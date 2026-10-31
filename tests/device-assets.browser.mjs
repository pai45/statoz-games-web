import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import { randomUUID } from 'node:crypto';
import next from 'next';
import { chromium, expect } from '@playwright/test';
import { localGames } from './helpers/local-games.mjs';

const root = process.cwd(), pages = process.argv.includes('--pages');
const base = pages ? '/statoz-games-web' : '';
const out = path.join(root, 'test-results', pages ? 'device-assets-pages' : 'device-assets');
await fs.mkdir(out, { recursive: true });
const app = pages ? null : next({ dev: false, dir: root });
await app?.prepare();
const handle = pages ? async (request, response) => {
  try {
    let relative = decodeURIComponent(new URL(request.url, 'http://localhost').pathname).slice(base.length);
    if (!path.extname(relative)) relative += '/index.html';
    const file = path.resolve(root, 'out', '.' + relative);
    if (!file.startsWith(path.join(root, 'out') + path.sep)) throw Error('Invalid static path');
    const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.ttf': 'font/ttf' };
    response.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream');
    response.end(await fs.readFile(file));
  } catch { response.writeHead(404); response.end(); }
} : app.getRequestHandler();
const requests = new Map();
let failureFile, blockAssets = false;
const blocked = [];
let manifestUrls = new Set();
const server = http.createServer((request, response) => {
  const url = new URL(request.url, 'http://localhost');
  requests.set(url.pathname, (requests.get(url.pathname) || 0) + 1);
  response.on('finish', () => { if (response.statusCode >= 300 && url.pathname !== failureFile) console.log('Asset HTTP status:', response.statusCode, url.pathname); });
  const local = url.pathname.slice(base.length);
  const isAsset = manifestUrls.has(url.pathname) || /^\/(?:assets|embedded-games|_next\/static)\//.test(local) || /^\/games\/.*\.(?:png|jpe?g|webp|svg|glb|gltf|bin|wasm|js|css|html|json|ogg|wav|mp3)$/i.test(local);
  if (url.pathname === failureFile || blockAssets && isAsset) {
    if (blockAssets) blocked.push(url.pathname);
    response.writeHead(503); response.end('Asset networking disabled for cache verification'); return;
  }
  void handle(request, response);
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const origin = 'http://127.0.0.1:' + server.address().port;
// Exercise the ordinary disk-backed cache for the complete native payloads.
// Incognito storage is in-memory: https://chromium.googlesource.com/chromium/src/+/lkgr/content/browser/service_worker/README.md
const profileRoot=path.resolve(root,'.cache/device-cache-e2e');
const profile=path.join(profileRoot,randomUUID());
await fs.mkdir(profile,{recursive:true});
const persistent=await chromium.launchPersistentContext(profile,{ executablePath: process.env.DEVICE_ASSETS_CHROMIUM || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, viewport: {width:412,height:915}, args: ['--enable-unsafe-swiftshader'] });
const browser=persistent.browser();
try {
  const html = await (await fetch(origin + base + '/login')).text();
  const buildId = /<meta name="statoz-assets-build" content="([\w-]+)"/.exec(html)?.[1];
  assert.ok(buildId, 'production HTML must expose its asset build');
  const manifest = await (await fetch(origin + base + '/_game-assets/' + buildId + '.json')).json();
  manifestUrls = new Set(manifest.files.map(file => file.url));
  failureFile = manifest.files.find(file => file.url.endsWith('/athlete.glb')).url;
  const context = persistent;
  context.on('console', message => { if (message.text().includes('Device asset download failed') || message.text().includes('Device cache')) console.log(message.text()); });
  await context.addInitScript(() => {
    localStorage.setItem('statoz.games.web.auth.v2', JSON.stringify({ version: 2, authenticated: true, email: 'device-test@example.test' }));
    localStorage.setItem('statoz.games.web.accounts.v1', JSON.stringify({ version: 1, accounts: { 'device-test@example.test': { onboardingComplete: true } } }));
  });
  const page = await context.newPage();
  const waitReady = async () => {
    await page.waitForFunction(() => {
      const screen = document.querySelector('[data-device-assets]');
      return !screen || screen.getAttribute('data-device-assets') === 'error';
    }, null, { timeout: 180000 });
    if (await page.locator('[data-device-assets="error"]').count()) throw new Error(await page.locator('[data-device-assets="error"]').innerText());
  };
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(origin + base + '/play/vibe-basketball');
  await page.locator('[data-device-assets]').waitFor();
  assert.equal(await page.locator('iframe').count(), 0, 'game must not mount before the download');
  await page.screenshot({ path: path.join(out, 'download-mobile.png') });
  await page.locator('[data-device-assets="error"]').waitFor({ timeout: 180000 });
  console.log('Initial download failure shown; verifying resume.');
  await page.screenshot({ path: path.join(out, 'retry-mobile.png') });
  await page.setViewportSize({ width: 1365, height: 900 });
  await page.screenshot({ path: path.join(out, 'retry-desktop.png') });
  const retainedFile = manifest.files.find(file => (requests.get(file.url) || 0) === 1 && file.url !== failureFile && !file.url.startsWith('/_next/'))?.url;
  assert.ok(retainedFile);
  const retainedCount = requests.get(retainedFile);
  failureFile = undefined;
  await page.getByRole('button', { name: 'Retry download' }).click();
  await page.waitForFunction(() => {
    const screen = document.querySelector('[data-device-assets]');
    return !screen || screen.getAttribute('data-device-assets') === 'error';
  }, null, { timeout: 300000 });
  if (await page.locator('[data-device-assets="error"]').count()) throw new Error(await page.locator('[data-device-assets="error"]').innerText());
  console.log('All files cached; disabling asset networking.');
  assert.equal(requests.get(retainedFile), retainedCount, 'retry must reuse files already cached');
  await page.locator('iframe').waitFor();
  const evicted = manifest.files.find(file => file.url.endsWith('/athlete-low.glb'));
  await page.evaluate(async file => {
    const name = (await caches.keys()).find(name => name.startsWith('statoz-games-assets:') && name.endsWith('files-v1'));
    const cache = await caches.open(name);
    const key = (await cache.keys()).find(key => key.url.includes('/files/' + file.hash + '/'));
    if (!key || !await cache.delete(key)) throw Error('Could not evict the test asset');
  }, evicted);
  const evictionCount = requests.get(evicted.url);
  await page.reload();
  await page.locator('[data-device-assets]').waitFor({ state: 'detached', timeout: 180000 });
  assert.equal(requests.get(evicted.url), evictionCount + 1, 'return visit must repair a missing asset');
  const before = Object.fromEntries(requests);
  blockAssets = true;
  // Check every manifest record through the real service worker with the server
  // denying asset traffic. No mocked cache or request interception is involved.
  const failures = await page.evaluate(async files => {
    const failed = [];
    for (let i = 0; i < files.length; i += 4) await Promise.all(files.slice(i, i + 4).map(async file => {
      try { const response = await fetch(file.url); if (!response.ok || (await response.arrayBuffer()).byteLength !== file.bytes) failed.push(file.url); }
      catch { failed.push(file.url); }
    }));
    return failed;
  }, manifest.files);
  assert.deepEqual(failures, [], 'all game assets must work with their network disabled');
  console.log('All cached responses verified; checking reload and game routes.');
  // New document boot scripts must also come from the pinned cache.
  await page.reload();
  await page.locator('[data-device-assets]').waitFor({ state: 'detached', timeout: 180000 });
  await page.locator('iframe').waitFor();
  await page.frameLocator('iframe').locator('#mode-1v1').click({ timeout: 90000 });
  await page.waitForFunction(() => document.querySelector('iframe')?.contentWindow?.__game?.players?.length === 2, null, { timeout: 90000 });
  // Direct game routes test all enabled destinations; deck gates may appear for
  // card games, but those must not trigger any asset downloads either.
  const routes = [...(process.argv.includes('--local-games')?[]:['stadium-cricket', 'penalty-shootout', 'pitch-duel', 'football-chess', 'grand-prix', 'tennis']), ...localGames.map(game=>game.id)];
  const routeResults = [];
  for (const route of routes) {
    const response = await page.goto(origin + base + '/play/' + route);
    assert.ok(response.ok(), route + ' route must exist');
    await waitReady();
    const game=localGames.find(game=>game.id===route);
    if(game){
      const matches=frame=>frame.url()==='about:srcdoc'||frame.url().includes('/embedded-games/'+game.id+'/');
      await expect.poll(()=>page.frames().some(matches),{timeout:60000}).toBe(true);
      const bundle=page.frames().find(matches);
      if(game.start){
        await bundle.getByRole('button',{name:game.start,exact:true}).click();
        await expect.poll(()=>page.frames().some(frame=>frame.url().includes('/games/'+game.id+'/')),{timeout:30000}).toBe(true);
        const native=page.frames().find(frame=>frame.url().includes('/games/'+game.id+'/'));
        await native.waitForFunction(game.ready,null,{timeout:120000});
        await expect(bundle.getByRole('button',{name:'Pause',exact:true})).toBeEnabled();
      }else if(game.id==='football-shooting')await bundle.locator('[data-character-source="football-strike"]').waitFor({timeout:60000});
      else await bundle.locator('#console-exit').waitFor();
    }else await page.waitForTimeout(1500);
    routeResults.push({ route, frames: page.frames().length - 1 });
    console.log('Cached route: ' + route);
  }
  assert.deepEqual(blocked, [], 'cached game launches must not reach the asset server');
  assert.deepEqual(errors, [], 'game routes must not raise browser errors');
  assert.ok(await page.evaluate(() => localStorage.getItem('statoz.games.web.auth.v2')), 'account data preserved');
  await fs.writeFile(path.join(out, 'results.json'), JSON.stringify({ files: manifest.files.length, totalBytes: manifest.totalBytes, retainedFile, routeResults, blocked, errors, before }, null, 2));
  console.log(`Device cache verified: ${manifest.files.length} files; retries, reload and ${routes.length + 1} game routes; zero asset network requests after ready.`);
  blockAssets = false;
  const unsupported = await browser.newContext();
  await unsupported.addInitScript(() => Object.defineProperty(window, 'isSecureContext', { value: false }));
  const fallback = await unsupported.newPage();
  await fallback.goto(origin + base + '/login');
  await fallback.locator('[data-device-assets="error"]').waitFor();
  await fallback.getByRole('button', { name: 'Play online' }).click();
  await fallback.locator('[data-device-assets]').waitFor({ state: 'detached' });
  await unsupported.close();
  console.log('Unsupported-storage browser fallback verified.');
} catch (error) {
  console.log('Browser verification failed: ' + String(error));
  for (const context of browser.contexts()) for (const page of context.pages()) {
    console.error('Download screen:', await page.locator('body').innerText().catch(() => 'unavailable'));
    await page.screenshot({ path: path.join(out, 'failure.png') }).catch(() => {});
    console.log('Cache file count: ' + await page.evaluate(async () => {
      const names = await caches.keys();
      return Promise.all(names.map(async name => ({ name, files: (await (await caches.open(name)).keys()).length })));
    }).then(value => JSON.stringify(value)).catch(() => 'unavailable'));
  }
  process.exitCode = 1;
} finally {
  await browser.close();
  server.closeAllConnections();
  await new Promise(resolve => server.close(resolve));
  await app?.close();
  if(!process.exitCode){if(!profile.startsWith(profileRoot+path.sep))throw Error('Unexpected test profile path');await fs.rm(profile,{recursive:true,force:true});}
}
