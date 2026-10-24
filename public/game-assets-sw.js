/* Static device cache only. Never cache accounts, saves, APIs or page navigation. */
const scope = new URL(self.registration.scope);
const prefix = 'statoz-games-assets:' + scope.pathname + ':';
const filesName = prefix + 'files-v1';
const metaName = prefix + 'metadata-v1';
const jobs = new Map();
let maintenance = Promise.resolve();
function maintain(task) {
  const run = maintenance.then(task);
  maintenance = run.catch(() => {});
  return run;
}
const internal = name => new URL('__device_assets__/' + name, scope).href;
const fileKey = file => internal('files/' + file.hash + '/' + encodeURIComponent(file.url));
const pinKey = id => internal('clients/' + id);
const manifestKey = revision => internal('manifests/' + revision);
const json = value => new Response(JSON.stringify(value), { headers: { 'Content-Type': 'application/json' } });

self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));
// No skipWaiting: a new worker must never replace one underneath an active game.

function validManifest(manifest) {
  return manifest?.schemaVersion === 1 && /^[a-f0-9]{64}$/.test(manifest.revision) &&
    manifest.basePath + '/' === scope.pathname && Array.isArray(manifest.files) && manifest.files.length > 0 &&
    manifest.totalBytes === manifest.files.reduce((sum, file) => sum + file.bytes, 0) && manifest.files.every(file => {
      const url = new URL(file.url, scope.origin);
      return url.origin === scope.origin && url.pathname.startsWith(scope.pathname) &&
        url.pathname === file.url && !url.search && /^[a-f0-9]{64}$/.test(file.hash) && Number.isSafeInteger(file.bytes) && file.bytes >= 0;
    });
}

async function prune(current) {
  const metadata = await caches.open(metaName);
  const live = new Set((await self.clients.matchAll({ includeUncontrolled: true })).map(client => client.id));
  const revisions = new Set([current.revision, ...jobs.keys()]);
  for (const key of await metadata.keys()) {
    if (!key.url.startsWith(internal('clients/'))) continue;
    const id = key.url.slice(internal('clients/').length);
    if (live.has(id)) revisions.add((await (await metadata.match(key)).json()).revision);
    else await metadata.delete(key);
  }
  const retained = new Set(current.files.map(fileKey));
  for (const key of await metadata.keys()) {
    if (!key.url.startsWith(internal('manifests/'))) continue;
    const manifest = await (await metadata.match(key)).json();
    if (revisions.has(manifest.revision)) manifest.files.forEach(file => retained.add(fileKey(file)));
    else {
      await metadata.delete(key);
      await metadata.delete(internal('builds/' + manifest.buildId));
    }
  }
  const cache = await caches.open(filesName);
  for (const key of await cache.keys()) if (!retained.has(key.url)) await cache.delete(key);
}

async function download(manifest, report) {
  const cache = await caches.open(filesName);
  let completedBytes = 0;
  const pending = [];
  for (const file of manifest.files) {
    if (await cache.match(fileKey(file), { ignoreVary: true })) completedBytes += file.bytes;
    else pending.push(file);
  }
  const progress = () => report({ state: 'downloading', completedBytes, totalBytes: manifest.totalBytes });
  progress();
  const estimate = await self.navigator.storage?.estimate().catch(() => ({}));
  const missing = manifest.totalBytes - completedBytes;
  if (estimate?.quota && estimate.quota - (estimate.usage || 0) < missing * 1.05) throw Error('Not enough device storage. Free some space and retry, or play online.');
  let index = 0, failure;
  await Promise.all(Array.from({ length: 4 }, async () => {
    while (!failure && index < pending.length) {
      const file = pending[index++];
      try {
        const response = await fetch(file.url, { cache: 'no-store', signal: AbortSignal.timeout(120000) });
        if (!response.ok || response.redirected) throw Error('A game file could not download. Check your connection and retry.');
        const bytes = await response.arrayBuffer();
        const digest = [...new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))].map(byte => byte.toString(16).padStart(2, '0')).join('');
        if (digest !== file.hash || bytes.byteLength !== file.bytes) throw Error('Game files changed during download. Reload the app and retry.');
        const headers = new Headers(response.headers);
        // fetch() exposes decoded bytes. Transport compression and request
        // variation do not apply to a verified, content-addressed local file.
        headers.delete('content-encoding');
        headers.delete('vary');
        headers.set('content-length', String(bytes.byteLength));
        await cache.put(fileKey(file), new Response(bytes, { headers, status: 200 }));
        completedBytes += file.bytes;
        progress();
      } catch (error) { console.warn('Device asset download failed:', file.url, error); failure = error; }
    }
  }));
  if (failure) throw failure;
  for (const file of manifest.files) if (!await cache.match(fileKey(file), { ignoreVary: true })) throw Error('A downloaded file is missing. Retry to repair the download.');
}

self.addEventListener('message', event => {
  const port = event.ports[0], manifest = event.data?.manifest;
  if (event.data?.type !== 'PREPARE' || !port || !event.source?.id) return;
  event.waitUntil((async () => {
    try {
      if (!validManifest(manifest)) throw Error('The game download list is invalid. Reload the app.');
      let job;
      // Serialize pin/manifest edits with cleanup, so a newly opened tab cannot
      // lose its version while another tab finishes downloading.
      await maintain(async () => {
        const metadata = await caches.open(metaName);
        await metadata.put(manifestKey(manifest.revision), json(manifest));
        await metadata.put(internal('builds/' + manifest.buildId), json({ revision: manifest.revision }));
        await metadata.put(pinKey(event.source.id), json({ revision: manifest.revision }));
        job = jobs.get(manifest.revision);
        if (!job) {
          const ports = new Set([port]);
          job = { ports, promise: download(manifest, message => ports.forEach(listener => listener.postMessage(message))) };
          jobs.set(manifest.revision, job);
        } else job.ports.add(port);
      });
      try {
        await job.promise;
        port.postMessage({ state: 'ready', completedBytes: manifest.totalBytes, totalBytes: manifest.totalBytes });
        await maintain(() => prune(manifest));
      } finally {
        job.ports.delete(port);
        if (!job.ports.size) jobs.delete(manifest.revision);
      }
    } catch (error) {
      port.postMessage({ state: 'error', error: error.name === 'QuotaExceededError' ? 'Device storage is full. Free some space and retry, or play online.' : error.message || 'The download stopped. Check your connection and retry.' });
    }
  })());
});

function canonical(url) {
  if (url.pathname === scope.pathname + 'embedded-games/vibe-basketball/index.html') {
    url.searchParams.delete('session');
    url.searchParams.delete('assetBuild');
    // These settings are read by the iframe's JavaScript; the HTML bytes stay
    // identical when switching modes, returning to menu, or toggling touch.
    if (['1v1', 'three-point'].includes(url.searchParams.get('mode'))) url.searchParams.delete('mode');
    if (['0', '1'].includes(url.searchParams.get('touch'))) url.searchParams.delete('touch');
    if (url.searchParams.get('attract') === '') url.searchParams.delete('attract');
  }
  return url.search ? null : url.pathname;
}
async function cachedResponse(event) {
  const url = canonical(new URL(event.request.url));
  if (!url) return fetch(event.request);
  const metadata = await caches.open(metaName);
  let pin = await metadata.match(pinKey(event.clientId));
  // An iframe is a separate service-worker client. Pin its navigation to the
  // parent's compiled build, then persist the pin for its models/scripts/audio.
  if (event.request.mode === 'navigate' && event.resultingClientId) {
    const requested = new URL(event.request.url);
    const referrer = event.request.referrer ? new URL(event.request.referrer) : null;
    const buildId = requested.searchParams.get('assetBuild') || (referrer?.origin === scope.origin ? referrer.searchParams.get('assetBuild') : null);
    if (buildId && /^[\w-]+$/.test(buildId)) pin = await metadata.match(internal('builds/' + buildId));
    if (pin) await maintain(() => metadata.put(pinKey(event.resultingClientId), pin.clone()));
  }
  if (!pin) return fetch(event.request);
  const stored = await metadata.match(manifestKey((await pin.json()).revision));
  if (!stored) return fetch(event.request);
  const file = (await stored.json()).files.find(file => file.url === url);
  const response = file && await (await caches.open(filesName)).match(fileKey(file), { ignoreVary: true });
  if (!response) return fetch(event.request);
  const range = event.request.headers.get('range');
  if (!range) return response;
  const match = /^bytes=(\d*)-(\d*)$/.exec(range);
  if (!match || (!match[1] && !match[2])) return fetch(event.request);
  const bytes = await response.arrayBuffer();
  const start = match[1] ? Number(match[1]) : Math.max(0, bytes.byteLength - Number(match[2]));
  const end = match[1] && match[2] ? Math.min(Number(match[2]), bytes.byteLength - 1) : bytes.byteLength - 1;
  if (start > end || start >= bytes.byteLength) return new Response(null, { status: 416, headers: { 'Content-Range': `bytes */${bytes.byteLength}` } });
  const headers = new Headers(response.headers);
  headers.set('Content-Range', `bytes ${start}-${end}/${bytes.byteLength}`);
  headers.set('Content-Length', String(end - start + 1));
  headers.set('Accept-Ranges', 'bytes');
  return new Response(bytes.slice(start, end + 1), { status: 206, headers });
}
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== scope.origin || !url.pathname.startsWith(scope.pathname)) return;
  // iframe navigation is an asset; application navigation and RSC stay network-only.
  if (event.request.mode === 'navigate' && !url.pathname.startsWith(scope.pathname + 'embedded-games/')) {
    event.respondWith((async () => {
      const response = await fetch(event.request);
      // Pin the new document before its scripts load, including after updates.
      // Navigation remains network-only; account HTML is never stored.
      try { if (response.ok && event.resultingClientId && response.headers.get('content-type')?.includes('text/html')) {
        const html = await response.clone().text();
        const build = /<meta name="statoz-assets-build" content="([\w-]+)"/.exec(html)?.[1];
        if (build) {
          const metadata = await caches.open(metaName);
          const pin = await metadata.match(internal('builds/' + build));
          if (pin) await maintain(() => metadata.put(pinKey(event.resultingClientId), pin));
        }
      } } catch { /* Storage denial must not prevent ordinary online navigation. */ }
      return response;
    })());
    return;
  }
  event.respondWith(cachedResponse(event).catch(error => { console.warn('Device cache read failed:', event.request.url, String(error)); return fetch(event.request); }));
});
