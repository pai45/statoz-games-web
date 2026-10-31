import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import { createHash, webcrypto } from 'node:crypto';
import { generateAssetManifest, referencedShopFiles } from '../scripts/game-asset-manifest.mjs';

const digest = value => createHash('sha256').update(value).digest('hex');
const worker = await fs.readFile(new URL('../public/game-assets-sw.js', import.meta.url), 'utf8');
function harness({ base = '/games-demo/', quota = 1e9 } = {}) {
  const origin = 'https://games.example', handlers = {}, stores = new Map(), bodies = new Map(), requested = [];
  let fail = null, corrupt = null, active = 0, maximum = 0;
  const clients = new Map([['tab', { id: 'tab' }]]);
  const key = request => typeof request === 'string' ? request : request.url;
  const caches = { async open(name) {
    if (!stores.has(name)) stores.set(name, new Map());
    const store = stores.get(name);
    return {
      async match(request) { return store.get(key(request))?.clone(); },
      async put(request, response) { store.set(key(request), response.clone()); },
      async delete(request) { return store.delete(key(request)); },
      async keys() { return [...store.keys()].map(url => new Request(url)); },
    };
  } };
  const self = { registration: { scope: origin + base }, navigator: { storage: { estimate: async () => ({ quota, usage: 0 }) } }, clients: { matchAll: async () => [...clients.values()], claim: async () => {} }, addEventListener: (type, handler) => { handlers[type] = handler; } };
  vm.runInNewContext(worker, { self, caches, URL, Response, Request, Headers, AbortSignal, crypto: webcrypto, console: { warn() {} }, fetch: async request => {
    const url = typeof request === 'string' ? request : request.url;
    requested.push(url);
    if (url === fail) throw Error('Offline');
    if (!bodies.has(url)) throw Error('Unexpected network request: ' + url);
    active++; maximum = Math.max(maximum, active);
    await new Promise(resolve => setTimeout(resolve, 2));
    active--;
    return new Response(url === corrupt ? 'corrupt' : bodies.get(url), { headers: { 'content-type': url.endsWith('.html') || url.includes('/play/') ? 'text/html' : 'application/octet-stream', 'content-encoding': 'gzip', 'vary': 'Accept-Language', 'content-length': '1' } });
  } });
  const manifest = (count = 8, buildId = 'build-one') => {
    const files = Array.from({ length: count }, (_, i) => {
      const url = base + (i === 0 ? 'embedded-games/vibe-basketball/index.html' : 'assets/file-' + i + '.bin');
      const body = `game ${i}`;
      bodies.set(url, body);
      return { url, hash: digest(body), bytes: Buffer.byteLength(body) };
    });
    return { schemaVersion: 1, basePath: base.slice(0, -1), buildId, revision: digest(JSON.stringify(files)), totalBytes: files.reduce((sum, file) => sum + file.bytes, 0), files };
  };
  const prepare = async (value, id = 'tab') => {
    clients.set(id, { id });
    const messages = []; let pending;
    handlers.message({ source: { id }, data: { type: 'PREPARE', manifest: value }, ports: [{ postMessage: value => messages.push(value) }], waitUntil: promise => { pending = promise; } });
    await pending;
    return messages;
  };
  const fetchAsset = async (url, { clientId = 'tab', mode = 'cors', resultingClientId = '', referrer = '', range } = {}) => {
    let promise;
    handlers.fetch({ request: { url: origin + url, method: 'GET', mode, referrer, headers: new Headers(range ? { range } : {}) }, clientId, resultingClientId, respondWith: value => { promise = value; } });
    return promise;
  };
  return { manifest, prepare, fetchAsset, requested, stores, bodies, clients, setFail: url => { fail = url; }, setCorrupt: url => { corrupt = url; }, get maximum() { return maximum; } };
}

test('real bundle navigation pins its compiled build before native session navigation and child asset requests',async()=>{
 const h=harness(),manifest=h.manifest(3),url=manifest.basePath+'/games/tennis-bits/native/index.html',body='<html>native local game</html>';
 h.bodies.set(url,body);manifest.files.push({url,hash:digest(body),bytes:Buffer.byteLength(body)});manifest.totalBytes+=Buffer.byteLength(body);manifest.revision=digest(JSON.stringify(manifest.files));
 await h.prepare(manifest);
 const root=await h.fetchAsset(manifest.files[0].url+'?assetBuild='+manifest.buildId+'&session=abc',{clientId:'tab',mode:'navigate',resultingClientId:'bundle'});
 assert.equal(await root.text(),'game 0');
 const response=await h.fetchAsset(url+'?session=abc&scope=account&nonce=xyz',{clientId:'bundle',mode:'navigate',resultingClientId:'native'});
 assert.equal(await response.text(),body);
 assert.equal(await(await h.fetchAsset(manifest.files[1].url,{clientId:'native'})).text(),'game 1');
 assert.equal(h.requested.length,manifest.files.length);
 await assert.rejects(h.fetchAsset(url+'?unknown=value',{clientId:'native'}),/Unexpected network/);
});

test('downloads four at a time, reports actual bytes, and reuses completed files', async () => {
  const h = harness(), manifest = h.manifest();
  const messages = await h.prepare(manifest);
  assert.equal(messages.at(-1).state, 'ready');
  assert.equal(messages.at(-1).completedBytes, manifest.totalBytes);
  assert.equal(h.maximum, 4);
  assert.equal(h.requested.length, 8);
  assert.equal((await h.prepare(manifest)).at(-1).state, 'ready');
  assert.equal(h.requested.length, 8);
});

test('Soccer native texture version tags reuse the pinned immutable file, leaving other query values uncached',async()=>{
 const h=harness(),manifest=h.manifest(1),url=manifest.basePath+'/games/soccer-real/native/images/japan.jpg',body='uniform texture';
 h.bodies.set(url,body);manifest.files.push({url,hash:digest(body),bytes:Buffer.byteLength(body)});manifest.totalBytes+=Buffer.byteLength(body);manifest.revision=digest(JSON.stringify(manifest.files));
 await h.prepare(manifest);
 assert.equal(await(await h.fetchAsset(url+'?v=1')).text(),body);
 assert.equal(h.requested.length,manifest.files.length);
 await assert.rejects(h.fetchAsset(url+'?v=2'),/Unexpected network/);
});
test('interrupted downloads resume without downloading successful files again', async () => {
  const h = harness(), manifest = h.manifest();
  h.setFail(manifest.files[6].url);
  assert.equal((await h.prepare(manifest)).at(-1).state, 'error');
  const firstCount = h.requested.filter(url => url === manifest.files[0].url).length;
  h.setFail(null);
  assert.equal((await h.prepare(manifest)).at(-1).state, 'ready');
  assert.equal(h.requested.filter(url => url === manifest.files[0].url).length, firstCount);
});
test('rejects bad content and repairs an evicted file', async () => {
  const h = harness(), manifest = h.manifest();
  h.setCorrupt(manifest.files[0].url);
  assert.equal((await h.prepare(manifest)).at(-1).state, 'error');
  h.setCorrupt(null);
  await h.prepare(manifest);
  const store = [...h.stores.entries()].find(([name]) => name.endsWith('files-v1'))[1];
  store.delete([...store.keys()][0]);
  const count = h.requested.length;
  await h.prepare(manifest);
  assert.equal(h.requested.length, count + 1);
});
test('insufficient storage fails without marking ready or downloading', async () => {
  const h = harness({ quota: 1 }), manifest = h.manifest();
  assert.match((await h.prepare(manifest)).at(-1).error, /storage/);
  assert.equal(h.requested.length, 0);
});
test('cached iframe session navigation pins its scripts and supports audio ranges', async () => {
  const h = harness(), manifest = h.manifest();
  await h.prepare(manifest);
  h.clients.set('iframe', { id: 'iframe' });
  const response = await h.fetchAsset(manifest.files[0].url + '?session=new&assetBuild=build-one&mode=three-point&touch=1', { clientId: '', mode: 'navigate', resultingClientId: 'iframe' });
  assert.equal(await response.text(), 'game 0');
  assert.equal(response.headers.get('content-encoding'), null);
  assert.equal(response.headers.get('vary'), null);
  const audio = await h.fetchAsset(manifest.files[1].url, { clientId: 'iframe', range: 'bytes=1-3' });
  assert.equal(audio.status, 206);
  assert.equal(await audio.text(), 'ame');
  assert.equal(h.requested.length, 8);
  await assert.rejects(h.fetchAsset(manifest.files[1].url + '?unknown=value'), /Unexpected network/);
});
test('changed assets download once; old tabs retain their build until closed', async () => {
  const h = harness(), old = h.manifest();
  await h.prepare(old);
  const updated = structuredClone(old);
  updated.files[1] = { ...updated.files[1], hash: digest('new art'), bytes: 7 };
  updated.buildId = 'build-two'; updated.revision = digest('two');
  updated.totalBytes = updated.files.reduce((sum, file) => sum + file.bytes, 0);
  h.bodies.set(updated.files[1].url, 'new art');
  await h.prepare(updated, 'new-tab');
  assert.equal(h.requested.length, 9);
  assert.equal(await (await h.fetchAsset(old.files[1].url)).text(), 'game 1');
  assert.equal(await (await h.fetchAsset(old.files[1].url, { clientId: 'new-tab' })).text(), 'new art');
  h.clients.delete('tab');
  await h.prepare(updated, 'new-tab');
  assert.equal([...h.stores.entries()].find(([name]) => name.endsWith('files-v1'))[1].size, 8);
});
test('application navigation stays network-only and pins its new document', async () => {
  const h = harness(), manifest = h.manifest();
  await h.prepare(manifest);
  h.bodies.set('https://games.example/games-demo/play/tennis', '<meta name="statoz-assets-build" content="build-one"><p>private page</p>');
  await h.fetchAsset('/games-demo/play/tennis', { mode: 'navigate', resultingClientId: 'next-tab' });
  const response = await h.fetchAsset(manifest.files[1].url, { clientId: 'next-tab' });
  assert.equal(await response.text(), 'game 1');
  const storedBodies = [...h.stores.values()].flatMap(store => [...store.keys()]);
  assert.ok(!storedBodies.some(url => url.endsWith('/play/tennis')));
});
test('two versions preparing concurrently keep both live tabs usable', async () => {
  const h = harness(), first = h.manifest();
  const second = structuredClone(first);
  second.buildId = 'build-two'; second.revision = digest('concurrent version');
  second.files = [...second.files, { url: first.basePath + '/assets/extra.bin', hash: digest('extra'), bytes: 5 }];
  second.totalBytes += 5;
  h.bodies.set(second.files.at(-1).url, 'extra');
  const results = await Promise.all([h.prepare(first), h.prepare(second, 'other-tab')]);
  assert.ok(results.every(messages => messages.at(-1).state === 'ready'));
  assert.equal(await (await h.fetchAsset(second.files.at(-1).url, { clientId: 'other-tab' })).text(), 'extra');
  assert.equal(await (await h.fetchAsset(first.files[1].url)).text(), 'game 1');
});
test('shop selection excludes all portraits, retaining other literal and template references', () => {
  const files = ['assets/shop/portraits/LEO 10.webp', 'assets/shop/portraits/LEO 10.png', 'assets/shop/coins/rookie.png', 'assets/shop/coins/.gitkeep'];
  assert.deepEqual([...referencedShopFiles('"/assets/shop/portraits/LEO 10.webp" `/assets/shop/portraits/${sport}/${player}.png` `/assets/shop/coins/${id}.png`', [...files, 'assets/shop/portraits/football/player.png'])], [files[2]]);
});
test('manifest includes built game dependencies and static code, encodes names and changes with content', async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'game-assets-'));
  const put = async (file, text = 'bytes') => { await fs.mkdir(path.dirname(path.join(root, file)), { recursive: true }); await fs.writeFile(path.join(root, file), text); };
  try {
    for (const game of ['open-golf', 'pitch-rush', 'final-third', 'retro-hoops', 'retro-football', 'retro-football-2', 'stick-cricket', 'football-shooting', 'f1-racing', 'archery-test', 'tennis-bits', 'soccer-real', 'penalty-shooters-2', 'retro-circuit', 'retro-innings', 'stadium-cricket', 'vibe-basketball']) await put(`public/embedded-games/${game}/index.html`);
    await put('src/domain/removed-games.json', await fs.readFile(path.join(process.cwd(), 'src/domain/removed-games.json'), 'utf8'));
    await put('src/catalog.ts', '"/assets/shop/portraits/LEO 10.webp" "/assets/shop/banners/BLUE 10.webp"');
    await put('public/assets/shop/banners/BLUE 10.webp');
    for (const file of ['public/assets/shop/portraits/LEO 10.webp', 'public/assets/shop/portraits/unused.png', 'public/assets/ads/promo.mp4', 'public/assets/ads/ad-space-anchor.svg', 'public/assets/games/penalty-shootout/model.glb', 'public/embedded-games/vibe-basketball/models/prop.glb', '.next/static/chunks/game.js', '.next/static/media/font.woff2']) await put(file);
    for (const asset of ['data/cores/fbneo-wasm.data', 'roms/strhoop.zip', 'roms/arcade.7z', 'bridge.js', 'index.html']) await put('public/games/retro-hoops/street-hoop/' + asset);
    for (const asset of ['arcade/data/cores/fbneo-wasm.data', 'arcade/roms/ssideki2.zip', 'arcade/roms/arcade.7z', 'arcade/bridge.js', 'arcade/index.html', 'cover.png']) await put('public/games/retro-football-2/' + asset);
    for (const asset of ['unity/Build/game.wasm','unity/Build/game.data','unity/StreamingAssets/aa/catalog.bin','unity/StreamingAssets/aa/WebGL/scene.bundle','unity/bridge.js','cover.png']) await put('public/games/stick-cricket/' + asset);
    for(const asset of ['native/index.html','native/local-platform.js','native/engine.bundle.js','native/assets/models/512/terrains/EnvironmentA.glb','native/assets/fonts/helve.xml','native/assets/sounds/effects.mp3'])await put('public/games/archery-test/'+asset);
    for(const asset of ['games/tennis-bits/native/Build/game.wasm','games/tennis-bits/native/StreamingAssets/aa/tennis.bundle','games/soccer-real/native/images/mid_player17.glb','games/penalty-shooters-2/native/media/music.webm','games/football-shooting/recovered/animations.bin'])await put('public/'+asset);
    for (const id of ['retro-hoops', 'retro-football-2', 'football-shooting']) for (const asset of [`assets/games/${id}/sprite.png`, `assets/games/${id}.svg`, `assets/games/covers/${id}.webp`, `assets/games/identity/${id}.svg`]) await put('public/' + asset);
    await put('public/games/tennis-bits/dissection/large-library.json');await put('public/games/tennis-bits/originals/Build/game.wasm');
    await put('public/assets/games/penalty-shootout/imported-characters/manifest.json');
    const first = await generateAssetManifest({ root, buildId: 'one', basePath: '/demo', exportDir: path.join(root, 'out') });
    for (const asset of ['data/cores/fbneo-wasm.data', 'roms/strhoop.zip', 'roms/arcade.7z', 'bridge.js', 'index.html']) {
      const entry = first.files.find(file => file.url === '/demo/games/retro-hoops/street-hoop/' + asset);
      assert.equal(entry, undefined, 'Retired arcade dependency: ' + asset);
    }
    for (const asset of ['arcade/data/cores/fbneo-wasm.data', 'arcade/roms/ssideki2.zip', 'arcade/roms/arcade.7z', 'arcade/bridge.js', 'arcade/index.html', 'cover.png']) {
      const entry = first.files.find(file => file.url === '/demo/games/retro-football-2/' + asset);
      assert.equal(entry, undefined, 'Retired football arcade dependency: ' + asset);
    }
    for (const asset of ['unity/Build/game.data','unity/StreamingAssets/aa/catalog.bin','unity/StreamingAssets/aa/WebGL/scene.bundle']) {const entry=first.files.find(file=>file.url==='/demo/games/stick-cricket/'+asset);assert.ok(entry,'Missing Unity dependency: '+asset);assert.equal(entry.hash,digest('bytes'));}
    for (const id of ['final-third', 'retro-football', 'retro-circuit']) assert.ok(!first.files.some(file => file.url.includes('/embedded-games/' + id + '/')));
    assert.ok(!first.files.some(file=>file.url.includes('/embedded-games/retro-innings/') || file.url.includes('/games/retro-innings/')));
    for (const id of ['retro-hoops', 'retro-football-2', 'football-shooting']) {
      assert.ok(!first.files.some(file => file.url.includes('/embedded-games/' + id + '/') || file.url.includes('/games/' + id + '/') || file.url.includes('/games/covers/' + id + '.') || file.url.includes('/games/identity/' + id + '.')));
      assert.equal(await fs.readFile(path.join(root, 'public/assets/games/covers/' + id + '.webp'), 'utf8'), 'bytes');
    }
    assert.ok(first.files.some(file=>file.url==='/demo/assets/games/penalty-shootout/imported-characters/manifest.json'));
    for(const asset of ['games/tennis-bits/native/Build/game.wasm','games/tennis-bits/native/StreamingAssets/aa/tennis.bundle','games/soccer-real/native/images/mid_player17.glb','games/penalty-shooters-2/native/media/music.webm'])assert.ok(first.files.some(file=>file.url==='/demo/'+asset));
    assert.ok(!first.files.some(file=>file.url.includes('/dissection/')||file.url.includes('/originals/')));
    for(const asset of ['native/assets/models/512/terrains/EnvironmentA.glb','native/assets/fonts/helve.xml','native/assets/sounds/effects.mp3'])assert.ok(first.files.some(file=>file.url==='/demo/games/archery-test/'+asset),'Missing native dependency '+asset);
    assert.ok(!first.files.some(file => file.url.includes('/assets/shop/portraits/')));
    assert.ok(first.files.some(file => file.url === '/demo/assets/shop/banners/BLUE%2010.webp'));
    assert.equal(await fs.readFile(path.join(root, 'public/assets/shop/portraits/LEO 10.webp'), 'utf8'), 'bytes');
    assert.ok(first.files.some(file => file.url.endsWith('/prop.glb')));
    assert.ok(first.files.some(file => file.url.endsWith('/font.woff2')));
    assert.ok(first.files.some(file => file.url.endsWith('/ad-space-anchor.svg')));
    assert.ok(!first.files.some(file => /unused|promo/.test(file.url)));
    await put('public/assets/games/penalty-shootout/model.glb', 'changed');
    const second = await generateAssetManifest({ root, buildId: 'two' });
    assert.notEqual(first.revision, second.revision);
    assert.ok(!second.files.some(file => file.url.includes('/assets/shop/portraits/')));
    assert.ok(second.files.every(file => !file.url.startsWith('/demo/')));
  } finally { await fs.rm(root, { recursive: true, force: true }); }
});
