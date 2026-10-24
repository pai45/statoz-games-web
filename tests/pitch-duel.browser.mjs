// Pitch Duel in a real browser: the rotated phone frame, landscape phone sizes,
// a full match to the result screen, the v3 save, and the portrait fallback.
//   npm run test:pitch-duel:browser            (starts its own dev server)
//   npm run test:pitch-duel:browser -- --url=http://localhost:3000
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import next from 'next';
import { chromium } from '@playwright/test';

const root = process.cwd();
const out = path.join(root, 'test-results/pitch-duel');
await fs.mkdir(out, { recursive: true });
const existing = process.argv.find((value) => value.startsWith('--url='))?.slice(6);
const app = existing ? null : next({ dev: true, dir: root });
await app?.prepare();
const handler = app?.getRequestHandler();
const server = existing ? null : http.createServer((request, response) => void handler(request, response));
if (server) await new Promise((resolve) => server.listen(0, 'localhost', resolve));
const origin = existing || `http://localhost:${server.address().port}`;
const browser = await chromium.launch({ executablePath: process.env.MOBILE_VIEWPORT_CHROMIUM || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--enable-unsafe-swiftshader'] });
const errors = [];

const owned = {
  players: ['arg-lionel-messi', 'arg-lautaro-martinez', 'arg-julian-alvarez', 'arg-rodrigo-de-paul', 'arg-cristian-romero', 'arg-lisandro-martinez', 'arg-nahuel-molina', 'arg-emiliano-martinez', 'bra-alisson-becker'],
  actions: ['act1-gold', 'act2-silver', 'act7-bronze', 'act15-gold', 'act16-bronze'],
};

async function seeded(options) {
  const context = await browser.newContext(options);
  await context.addInitScript((ids) => {
    if (sessionStorage.getItem('pd-seeded')) return;
    sessionStorage.setItem('pd-seeded', '1');
    localStorage.setItem('statoz.games.web.auth.v2', JSON.stringify({ version: 2, authenticated: true, email: 'pitch-duel@example.test' }));
    localStorage.setItem('statoz.games.web.accounts.v1', JSON.stringify({ version: 1, accounts: { 'pitch-duel@example.test': { onboardingComplete: true } } }));
    localStorage.setItem('statoz.games.web.economy.v1', JSON.stringify({
      version: 1, coins: 500, owned: { playerCardIds: ids.players, actionCardIds: ids.actions },
      starterClaims: { football: { claimedAt: new Date().toISOString(), playerCardIds: ids.players.slice(0, 5), actionCardIds: ids.actions } }, transactions: [],
    }));
  }, owned);
  const page = await context.newPage();
  page.on('pageerror', (error) => errors.push(`${options.viewport.width}x${options.viewport.height}: ${error.message}`));
  return { context, page };
}

const fits = (target) => target.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1 && document.documentElement.scrollHeight <= innerHeight + 1);

async function checkTargets(target, label) {
  const bad = await target.evaluate(() => [...document.querySelectorAll('[data-pitch-duel-option]')].map((el) => {
    const r = el.getBoundingClientRect();
    return { id: el.getAttribute('data-pitch-duel-option'), w: r.width, h: r.height, inside: r.top >= 0 && r.left >= 0 && r.bottom <= innerHeight + 1 && r.right <= innerWidth + 1 };
  }).filter((t) => t.w < 44 || t.h < 44 || !t.inside));
  assert.deepEqual(bad, [], `${label}: every option must be on screen and at least 44px`);
}

/** Taps through a whole match, then opens the result screen. */
async function playMatch(target, label) {
  await target.getByRole('button', { name: 'Kick off' }).click();
  await target.locator('[data-pitch-duel-screen="match"]').waitFor({ timeout: 90000 });
  assert.ok(await fits(target), `${label}: match screen must not scroll`);
  await target.getByRole('button', { name: /KICK OFF ▶/ }).click();
  await checkTargets(target, label);
  for (let i = 0; i < 200; i += 1) {
    const finish = target.getByRole('button', { name: /FULL-TIME · SEE RESULT/ });
    if (await finish.count()) {
      await finish.first().click();
      break;
    }
    const nextButton = target.getByRole('button', { name: /^(NEXT ▶|START SECOND HALF ▶)$/ });
    if (await nextButton.count()) { await nextButton.first().click(); continue; }
    const options = target.locator('[data-pitch-duel-option]');
    const count = await options.count();
    if (count) { await options.nth(i % count).click(); continue; }
    await target.waitForTimeout(100);
  }
  await target.locator('[data-pitch-duel-screen="summary"]').waitFor({ timeout: 30000 });
}

try {
  // 1. Phone held upright: the shared host rotates the game into landscape.
  {
    const { context, page } = await seeded({ viewport: { width: 393, height: 851 }, hasTouch: true, isMobile: true });
    await page.goto(`${origin}/play/pitch-duel`, { waitUntil: 'domcontentloaded', timeout: 180000 });
    const handle = await page.locator('iframe[data-mobile-game-frame]').elementHandle({ timeout: 180000 });
    const frame = await handle.contentFrame();
    await frame.waitForFunction(() => innerWidth > innerHeight && document.readyState === 'complete', null, { timeout: 180000 });
    await frame.locator('[data-pitch-duel-screen="home"]').waitFor({ timeout: 180000 });
    assert.ok(await fits(frame), 'rotated home must not scroll');
    await playMatch(frame, 'rotated phone');
    await page.screenshot({ path: path.join(out, 'rotated-phone-summary.png') });
    const saved = await frame.evaluate(() => JSON.parse(localStorage.getItem('statoz.games.web.pitch-duel.v3') ?? 'null'));
    assert.equal(saved?.played, 1, 'the finished match is saved');
    assert.equal(saved.history[0].decisions >= 26 && saved.history[0].decisions <= 36, true, 'about thirty decisions');
    await context.close();
  }

  // 2. Landscape phone sizes, desktop pointer (no host frame).
  for (const viewport of [{ width: 640, height: 360 }, { width: 932, height: 430 }]) {
    const label = `${viewport.width}x${viewport.height}`;
    const { context, page } = await seeded({ viewport });
    await page.goto(`${origin}/play/pitch-duel`, { waitUntil: 'domcontentloaded', timeout: 180000 });
    await page.locator('[data-pitch-duel-screen="home"]').waitFor({ timeout: 180000 });
    assert.ok(await fits(page), `${label}: home must not scroll`);
    await page.getByRole('button', { name: 'Kick off' }).click();
    await page.locator('[data-pitch-duel-screen="match"]').waitFor({ timeout: 90000 });
    await page.getByRole('button', { name: /KICK OFF ▶/ }).click();
    assert.ok(await fits(page), `${label}: match must not scroll`);
    await checkTargets(page, label);
    await page.screenshot({ path: path.join(out, `${label}-match.png`) });
    await context.close();
  }

  // 3. A narrow portrait desktop window still shows the match.
  {
    const { context, page } = await seeded({ viewport: { width: 390, height: 844 } });
    await page.goto(`${origin}/play/pitch-duel`, { waitUntil: 'domcontentloaded', timeout: 180000 });
    await page.locator('[data-pitch-duel-screen="home"]').waitFor({ timeout: 180000 });
    await page.getByRole('button', { name: 'Kick off' }).click();
    await page.locator('[data-pitch-duel-screen="match"]').waitFor({ timeout: 90000 });
    assert.ok(await page.locator('[data-pitch-duel-screen="match"]').isVisible(), 'portrait must never hide the match');
    await page.screenshot({ path: path.join(out, 'portrait-desktop.png'), fullPage: true });
    await context.close();
  }

  assert.deepEqual(errors, []);
  console.log('Passed: rotated phone full match + save, 640x360 and 932x430 layouts, portrait fallback.');
} catch (error) {
  console.log('Pitch Duel browser check failed: ' + String(error));
  console.log('Browser errors: ' + JSON.stringify(errors));
  process.exitCode = 1;
} finally {
  await browser.close();
  if (server) { server.closeAllConnections(); await new Promise((resolve) => server.close(resolve)); }
  await app?.close();
}
