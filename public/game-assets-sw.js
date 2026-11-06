/* Verified, content-addressed device cache for the app shell and per-game packs. */
const scope = new URL(self.registration.scope);
const prefix = 'statoz-games-assets:' + scope.pathname + ':';
// Keep the v1 cache names: matching files from the former all-games download
// are adopted without another transfer.
const filesName = prefix + 'files-v1';
const metaName = prefix + 'metadata-v1';
const jobs = new Map();
let maintenance = Promise.resolve();
let downloads = Promise.resolve();

function maintain(task) {
  const run = maintenance.then(task);
  maintenance = run.catch(() => {});
  return run;
}

const internal = name => new URL('__device_assets__/' + name, scope).href;
const fileKey = file => internal('files/' + file.hash + '/' + encodeURIComponent(file.url));
const pinKey = id => internal('clients/' + id);
const manifestKey = revision => internal('manifests/' + revision);
const packKey = packId => internal('packs/' + encodeURIComponent(packId));
const buildKey = buildId => internal('builds/' + buildId);
const pendingKey = packId => internal('pending/' + encodeURIComponent(packId));
const indexKey = buildId => internal('indexes/' + buildId);
const digest = async bytes => [...new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))].map(byte => byte.toString(16).padStart(2, '0')).join('');
const json = value => new Response(JSON.stringify(value), { headers: { 'Content-Type': 'application/json' } });
const normalizePath = value => {
  const pathname = new URL(value, scope.origin).pathname;
  return pathname.length > scope.pathname.length && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
};

self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));
// No skipWaiting: an updated worker must not replace one beneath a live game.

function validFile(file, basePath) {
  const url = new URL(file?.url, scope.origin);
  return url.origin === scope.origin && url.pathname.startsWith(scope.pathname) &&
    url.pathname === file.url && !url.search && /^[a-f0-9]{64}$/.test(file.hash) &&
    Number.isSafeInteger(file.bytes) && file.bytes >= 0 && basePath + '/' === scope.pathname;
}

function validManifest(manifest) {
  if (![1, 2].includes(manifest?.schemaVersion) || !/^[a-f0-9]{64}$/.test(manifest.revision) ||
      !Array.isArray(manifest.files) || !manifest.files.length ||
      manifest.totalBytes !== manifest.files.reduce((sum, file) => sum + file.bytes, 0) ||
      !manifest.files.every(file => validFile(file, manifest.basePath))) return false;
  if (manifest.schemaVersion === 1) return typeof manifest.buildId === 'string';
  return typeof manifest.packId === 'string' && /^(?:core|game:[\w-]+)$/.test(manifest.packId) &&
    typeof manifest.buildId === 'string' && /^[\w-]+$/.test(manifest.buildId) &&
    typeof manifest.entryUrl === 'string' && manifest.files.some(file => file.url === manifest.entryUrl) &&
    (manifest.entryUrls ?? [manifest.entryUrl]).every(entry => manifest.files.some(file => file.url === entry));
}

async function storedManifest(metadata, revision) {
  const response = await metadata.match(manifestKey(revision));
  return response ? response.json() : null;
}

async function mergePin(clientId, revisions) {
  if (!clientId) return;
  const metadata = await caches.open(metaName);
  const previous = await metadata.match(pinKey(clientId));
  const value = previous ? await previous.json() : { revisions: [] };
  const existing = value.revisions ?? (value.revision ? [value.revision] : []);
  await metadata.put(pinKey(clientId), json({ revisions: [...new Set([...revisions, ...existing])] }));
}

async function installedRevisions(metadata) {
  const revisions = new Set();
  for (const key of await metadata.keys()) {
    if (!key.url.startsWith(internal('packs/'))) continue;
    const value = await (await metadata.match(key)).json();
    if (value.revision) revisions.add(value.revision);
  }
  return revisions;
}

async function prune() {
  const metadata = await caches.open(metaName);
  const live = new Set((await self.clients.matchAll({ includeUncontrolled: true })).map(client => client.id));
  const revisions = await installedRevisions(metadata);
  // Partial packs are resumable. Legacy manifests remain migration sources until
  // all their files have been adopted; never discard them on the first v2 play.
  for (const key of await metadata.keys()) {
    if (key.url.startsWith(internal('pending/'))) revisions.add((await (await metadata.match(key)).json()).revision);
    if (key.url.startsWith(internal('manifests/'))) {
      const manifest = await (await metadata.match(key)).json();
      if (manifest.schemaVersion === 1) revisions.add(manifest.revision);
    }
  }
  for (const job of jobs.values()) revisions.add(job.manifest.revision);
  for (const key of await metadata.keys()) {
    if (!key.url.startsWith(internal('clients/'))) continue;
    const id = key.url.slice(internal('clients/').length);
    if (!live.has(id)) { await metadata.delete(key); continue; }
    const pin = await (await metadata.match(key)).json();
    for (const revision of pin.revisions ?? (pin.revision ? [pin.revision] : [])) revisions.add(revision);
  }
  const retained = new Set();
  for (const key of await metadata.keys()) {
    if (!key.url.startsWith(internal('manifests/'))) continue;
    const manifest = await (await metadata.match(key)).json();
    if (revisions.has(manifest.revision)) manifest.files.forEach(file => retained.add(fileKey(file)));
    else await metadata.delete(key);
  }
  const cache = await caches.open(filesName);
  for (const key of await cache.keys()) if (!retained.has(key.url)) await cache.delete(key);
}

async function cachedBytes(manifest, verify = false) {
  const cache = await caches.open(filesName);
  let completedBytes = 0;
  for (const file of manifest.files) {
    const response = await cache.match(fileKey(file), { ignoreVary: true });
    if (!response) continue;
    if (verify) {
      const bytes = await response.arrayBuffer();
      if (bytes.byteLength !== file.bytes || await digest(bytes) !== file.hash) {
        await cache.delete(fileKey(file));
        continue;
      }
    }
    completedBytes += file.bytes;
  }
  return completedBytes;
}

async function complete(manifest, verify = false) {
  if (await cachedBytes(manifest, verify) !== manifest.totalBytes) return false;
  const cache = await caches.open(filesName);
  for (const file of manifest.files) if (!await cache.match(fileKey(file), { ignoreVary: true })) return false;
  return true;
}

async function packStatus(packId, expectedRevision, suppliedManifest) {
  const metadata = await caches.open(metaName);
  if (suppliedManifest) {
    if (!validManifest(suppliedManifest) || suppliedManifest.schemaVersion !== 2 || suppliedManifest.packId !== packId) throw Error('The game download list is invalid. Reload the app.');
    await metadata.put(manifestKey(suppliedManifest.revision), json(suppliedManifest));
    expectedRevision = suppliedManifest.revision;
  }
  const installedResponse = await metadata.match(packKey(packId));
  if (installedResponse) {
    const installed = await installedResponse.json();
    const manifest = await storedManifest(metadata, installed.revision);
    if (manifest && await complete(manifest, true)) return {
      state: 'installed', installed: true, current: installed.revision === expectedRevision,
      revision: installed.revision, buildId: manifest.buildId, completedBytes: manifest.totalBytes, totalBytes: manifest.totalBytes,
    };
    if (manifest) await metadata.put(pendingKey(packId), json({ revision: manifest.revision }));
    await metadata.delete(packKey(packId));
  }
  const expected = expectedRevision ? await storedManifest(metadata, expectedRevision) : null;
  if (expected) {
    const completedBytes = await cachedBytes(expected, true);
    // Adopt a complete pack assembled by the v1 all-games cache.
    if (completedBytes === expected.totalBytes && await complete(expected)) {
      await finishPackInstall(expected);
      return { state: 'installed', installed: true, current: true, revision: expected.revision, buildId: expected.buildId, completedBytes, totalBytes: expected.totalBytes };
    }
    return { state: 'not-installed', installed: false, current: false, completedBytes, totalBytes: expected.totalBytes };
  }
  return { state: 'not-installed', installed: false, current: false, completedBytes: 0, totalBytes: 0 };
}

async function fetchFile(file, signal) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 120000);
  const cancelled = () => controller.abort();
  signal?.addEventListener('abort', cancelled, { once: true });
  try {
    const response = await fetch(file.url, { cache: 'no-store', signal: controller.signal });
    return { response, bytes: await response.arrayBuffer() };
  }
  finally { clearTimeout(timer); signal?.removeEventListener('abort', cancelled); }
}

async function download(manifest, report, signal) {
  const cache = await caches.open(filesName);
  await cachedBytes(manifest, true);
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
  if (estimate?.quota && estimate.quota - (estimate.usage || 0) < missing * 1.05) throw Error('Not enough device storage. Free some space in browser or device settings and retry.');
  let index = 0, failure;
  await Promise.all(Array.from({ length: 4 }, async () => {
    while (!failure && !signal.aborted && index < pending.length) {
      const file = pending[index++];
      try {
        const { response, bytes } = await fetchFile(file, signal);
        if (!response.ok || response.redirected && !/^text\/html/i.test(response.headers.get('content-type') || '')) throw Error('A game file could not download. Check your connection and retry.');
        if (await digest(bytes) !== file.hash || bytes.byteLength !== file.bytes) throw Error('Game files changed during download. Reload the app and retry.');
        const headers = new Headers(response.headers);
        headers.delete('content-encoding'); headers.delete('vary');
        headers.set('content-length', String(bytes.byteLength));
        await cache.put(fileKey(file), new Response(bytes, { headers, status: 200 }));
        completedBytes += file.bytes;
        progress();
      } catch (error) { failure = error; }
    }
  }));
  if (signal.aborted) throw new DOMException('Download cancelled', 'AbortError');
  if (failure) throw failure;
  if (!await complete(manifest)) throw Error('A downloaded file is missing. Retry to repair the download.');
}

async function finishPackInstall(manifest, clientId) {
  const metadata = await caches.open(metaName);
  await metadata.put(packKey(manifest.packId), json({ packId: manifest.packId, revision: manifest.revision, buildId: manifest.buildId }));
  const buildResponse = await metadata.match(buildKey(manifest.buildId));
  const build = buildResponse ? await buildResponse.json() : {};
  build.revisions ??= {};
  build.revisions[manifest.packId] = manifest.revision;
  await metadata.put(buildKey(manifest.buildId), json(build));
  await metadata.delete(pendingKey(manifest.packId));
  await mergePin(clientId, [manifest.revision]);
}

async function install(event, port, manifest, legacy = false) {
  if (!validManifest(manifest) || (!legacy && manifest.schemaVersion !== 2)) throw Error('The game download list is invalid. Reload the app.');
  const metadata = await caches.open(metaName);
  await maintain(async () => {
    await metadata.put(manifestKey(manifest.revision), json(manifest));
    if (!legacy) await metadata.put(pendingKey(manifest.packId), json({ revision: manifest.revision }));
  });
  let job = jobs.get(manifest.revision);
  if (job?.controller.signal.aborted) { jobs.delete(manifest.revision); job = undefined; }
  if (!job) {
    const controller = new AbortController();
    const ports = new Set([port]);
    const run = () => download(manifest, message => ports.forEach(listener => listener.postMessage(message)), controller.signal);
    const promise = downloads.then(run, run);
    downloads = promise.catch(() => {});
    job = {
      manifest, ports, subscribers: new Map([[port, event.source.id]]), controller,
      promise,
    };
    jobs.set(manifest.revision, job);
  } else {
    job.ports.add(port);
    job.subscribers.set(port, event.source.id);
  }
  try {
    await job.promise;
    if (!job.subscribers.has(port)) return;
    await maintain(async () => {
      if (legacy) {
        await mergePin(event.source.id, [manifest.revision]);
        await metadata.put(buildKey(manifest.buildId), json({ revision: manifest.revision }));
      } else await finishPackInstall(manifest, event.source.id);
    });
    port.postMessage({ state: 'ready', installed: true, current: true, revision: manifest.revision, buildId: manifest.buildId, completedBytes: manifest.totalBytes, totalBytes: manifest.totalBytes });
  } catch (error) {
    if (error?.name === 'AbortError') port.postMessage({ state: 'cancelled', completedBytes: await cachedBytes(manifest), totalBytes: manifest.totalBytes });
    else port.postMessage({ state: 'error', error: error?.name === 'QuotaExceededError' ? 'Device storage is full. Free some space in browser or device settings and retry.' : error?.message || 'The download stopped. Check your connection and retry.' });
  } finally {
    job.ports.delete(port);
    job.subscribers.delete(port);
    if (!job.ports.size && jobs.get(manifest.revision) === job) jobs.delete(manifest.revision);
    await maintain(prune);
  }
}

self.addEventListener('message', event => {
  const type = event.data?.type;
  const port = event.ports[0];
  if (!event.source?.id) return;
  if (type === 'CANCEL_PACK') {
    for (const job of jobs.values()) if (job.manifest.packId === event.data.packId) {
      for (const [listener, clientId] of job.subscribers) if (clientId === event.source.id) {
        listener.postMessage({ state: 'cancelled' });
        job.subscribers.delete(listener); job.ports.delete(listener);
      }
      if (!job.subscribers.size) job.controller.abort();
    }
    port?.postMessage({ state: 'cancelled' });
    return;
  }
  if (!port) return;
  event.waitUntil((async () => {
    try {
      const index = event.data.index;
      if (index?.schemaVersion === 2 && /^[\w-]+$/.test(index.buildId) && index.basePath + '/' === scope.pathname && index.core?.packId === 'core' && index.games && JSON.stringify(index).length < 100000) {
        await (await caches.open(metaName)).put(indexKey(index.buildId), json(index));
      }
      if (type === 'PREPARE') return await install(event, port, event.data.manifest, true);
      if (type === 'INSTALL_PACK') return await install(event, port, event.data.manifest, false);
      if (type === 'GET_PACK_STATUS' || type === 'VERIFY_PACK') {
        const status = await maintain(async () => {
          const value = await packStatus(event.data.packId, event.data.revision, event.data.manifest);
          if (value.installed) await mergePin(event.source.id, [value.revision]);
          return value;
        });
        port.postMessage(status);
        return;
      }
    } catch (error) {
      port.postMessage({ state: 'error', error: error?.message || 'The download service could not complete the request.' });
    }
  })());
});

function canonical(url) {
  if (url.pathname.startsWith(scope.pathname + 'games/soccer-real/native/images/') && /\.(?:jpg|png|webp)$/.test(url.pathname) && url.searchParams.get('v') === '1') url.searchParams.delete('v');
  if (url.pathname.startsWith(scope.pathname + 'embedded-games/') && url.pathname.endsWith('/index.html')) {
    url.searchParams.delete('session'); url.searchParams.delete('assetBuild');
  }
  if (url.pathname.startsWith(scope.pathname + 'games/') && url.pathname.endsWith('.html')) {
    for (const key of ['session','scope','nonce','assetBuild']) url.searchParams.delete(key);
  }
  if (url.pathname === scope.pathname + 'embedded-games/vibe-basketball/index.html') {
    url.searchParams.delete('session'); url.searchParams.delete('assetBuild');
    if (['1v1', 'three-point'].includes(url.searchParams.get('mode'))) url.searchParams.delete('mode');
    if (['0', '1'].includes(url.searchParams.get('touch'))) url.searchParams.delete('touch');
    if (['auto', 'performance', 'high'].includes(url.searchParams.get('quality'))) url.searchParams.delete('quality');
    if (['0', '1'].includes(url.searchParams.get('lite'))) url.searchParams.delete('lite');
    if (url.searchParams.get('attract') === '') url.searchParams.delete('attract');
  }
  return url.search ? null : normalizePath(url.href);
}

async function pinnedManifests(clientId) {
  if (!clientId) return [];
  const metadata = await caches.open(metaName);
  const response = await metadata.match(pinKey(clientId));
  if (!response) return [];
  const pin = await response.json();
  const revisions = pin.revisions ?? (pin.revision ? [pin.revision] : []);
  return (await Promise.all(revisions.map(revision => storedManifest(metadata, revision)))).filter(Boolean);
}

async function cachedFile(manifests, pathname) {
  const wanted = normalizePath(pathname);
  for (const manifest of manifests) {
    const file = manifest.files.find(item => normalizePath(item.url) === wanted);
    if (!file) continue;
    const response = await (await caches.open(filesName)).match(fileKey(file), { ignoreVary: true });
    if (response) return { response, file, manifest };
  }
  return null;
}

async function cachedAssetResponse(event) {
  const pathname = canonical(new URL(event.request.url));
  if (!pathname) return fetch(event.request);
  let manifests = await pinnedManifests(event.clientId);
  if (event.request.mode === 'navigate' && event.resultingClientId) {
    if (!manifests.length) {
      const requested = new URL(event.request.url);
      const buildId = requested.searchParams.get('assetBuild');
      if (buildId && /^[\w-]+$/.test(buildId)) {
        const metadata = await caches.open(metaName);
        const stored = await metadata.match(buildKey(buildId));
        const build = stored && await stored.json();
        const revisions = build?.revisions ? Object.values(build.revisions) : build?.revision ? [build.revision] : [];
        manifests = (await Promise.all(revisions.map(revision => storedManifest(metadata, revision)))).filter(Boolean);
      }
    }
    if (manifests.length) await mergePin(event.resultingClientId, manifests.map(manifest => manifest.revision));
  }
  const cached = await cachedFile(manifests, pathname);
  if (!cached) return fetch(event.request);
  const range = event.request.headers.get('range');
  if (!range) return cached.response;
  const match = /^bytes=(\d*)-(\d*)$/.exec(range);
  if (!match || (!match[1] && !match[2])) return fetch(event.request);
  const bytes = await cached.response.arrayBuffer();
  const start = match[1] ? Number(match[1]) : Math.max(0, bytes.byteLength - Number(match[2]));
  const end = match[1] && match[2] ? Math.min(Number(match[2]), bytes.byteLength - 1) : bytes.byteLength - 1;
  if (start > end || start >= bytes.byteLength) return new Response(null, { status: 416, headers: { 'Content-Range': `bytes */${bytes.byteLength}` } });
  const headers = new Headers(cached.response.headers);
  headers.set('Content-Range', `bytes ${start}-${end}/${bytes.byteLength}`);
  headers.set('Content-Length', String(end - start + 1));
  headers.set('Accept-Ranges', 'bytes');
  return new Response(bytes.slice(start, end + 1), { status: 206, headers });
}

async function installedRoute(pathname) {
  const metadata = await caches.open(metaName);
  const wanted = normalizePath(pathname);
  for (const key of await metadata.keys()) {
    if (!key.url.startsWith(internal('packs/'))) continue;
    const installed = await (await metadata.match(key)).json();
    const manifest = await storedManifest(metadata, installed.revision);
    if (!manifest) continue;
    const entries = manifest.entryUrls ?? [manifest.entryUrl];
    if (!entries.some(entry => normalizePath(entry) === wanted)) continue;
    const cached = await cachedFile([manifest], wanted);
    if (cached) return cached;
  }
  return null;
}

async function pinBuildFromHtml(clientId, html) {
  const buildId = /<meta name="statoz-assets-build" content="([\w-]+)"/.exec(html)?.[1];
  if (!buildId || !clientId) return;
  const metadata = await caches.open(metaName);
  const response = await metadata.match(buildKey(buildId));
  if (!response) return;
  const build = await response.json();
  await mergePin(clientId, build.revision ? [build.revision] : Object.values(build.revisions ?? {}));
}

async function pinRoute(clientId, manifest) {
  if (!clientId) return;
  const metadata = await caches.open(metaName);
  const stored = await metadata.match(buildKey(manifest.buildId));
  const build = stored && await stored.json();
  const revisions = [manifest.revision];
  if (build?.revisions?.core) revisions.push(build.revisions.core);
  await mergePin(clientId, revisions);
}

async function applicationNavigation(event) {
  const url = new URL(event.request.url);
  const revision = url.searchParams.get('assetPack');
  // PLAY navigates to the document that was verified, even if a deployment
  // switches while its game was downloading.
  if (revision && /^[a-f0-9]{64}$/.test(revision)) {
    const metadata = await caches.open(metaName);
    const manifest = await storedManifest(metadata, revision);
    if (manifest?.schemaVersion === 2 && (manifest.entryUrls ?? [manifest.entryUrl]).some(entry => normalizePath(entry) === normalizePath(url.href))) {
      const cached = await cachedFile([manifest], url.pathname);
      if (cached) { await pinRoute(event.resultingClientId, manifest); return cached.response; }
    }
  }
  try {
    const response = await fetch(event.request);
    if (response.ok && event.resultingClientId && response.headers.get('content-type')?.includes('text/html')) {
      try { await pinBuildFromHtml(event.resultingClientId, await response.clone().text()); } catch { /* ordinary online navigation still succeeds */ }
    }
    return response;
  } catch (error) {
    const cached = await installedRoute(new URL(event.request.url).pathname);
    if (!cached) {
      if (url.pathname.startsWith(scope.pathname + 'play/')) {
        const metadata = await caches.open(metaName);
        const coreRecord = await metadata.match(packKey('core'));
        const core = coreRecord && await storedManifest(metadata, (await coreRecord.json()).revision);
        const fallback = core && await cachedFile([core], scope.pathname + 'offline-game.html');
        if (fallback) return fallback.response;
      }
      throw error;
    }
    await pinRoute(event.resultingClientId, cached.manifest);
    return cached.response;
  }
}

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== scope.origin || !url.pathname.startsWith(scope.pathname)) return;
  const indexMatch = /^_game-assets\/([\w-]+)\/index\.json$/.exec(url.pathname.slice(scope.pathname.length));
  if (indexMatch) {
    event.respondWith((async () => {
      try { return await fetch(event.request); }
      catch (error) {
        const stored = await (await caches.open(metaName)).match(indexKey(indexMatch[1]));
        if (stored) return stored;
        throw error;
      }
    })());
    return;
  }
  const assetNavigation = url.pathname.startsWith(scope.pathname + 'embedded-games/') || (url.pathname.startsWith(scope.pathname + 'games/') && url.pathname.endsWith('.html'));
  if (event.request.mode === 'navigate' && !assetNavigation) {
    event.respondWith(applicationNavigation(event));
    return;
  }
  event.respondWith(cachedAssetResponse(event).catch(error => { console.warn('Device cache read failed:', event.request.url, String(error)); return fetch(event.request); }));
});
