// Pitch Duel in a real browser, portrait first: phone sizes and a desktop
// window, the drag-and-drop lineup, a full eleven-a-side match to the result
// screen, the v4 save, and a v3 save moving onto eleven a side.
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

async function seeded(options, extra = {}) {
  const context = await browser.newContext(options);
  await context.addInitScript(({ ids, extra }) => {
    if (sessionStorage.getItem('pd-seeded')) return;
    sessionStorage.setItem('pd-seeded', '1');
    localStorage.setItem('statoz.games.web.auth.v2', JSON.stringify({ version: 2, authenticated: true, email: 'pitch-duel@example.test' }));
    localStorage.setItem('statoz.games.web.accounts.v1', JSON.stringify({ version: 1, accounts: { 'pitch-duel@example.test': { onboardingComplete: true } } }));
    localStorage.setItem('statoz.games.web.economy.v1', JSON.stringify({
      version: 1, coins: 500, owned: { playerCardIds: ids.players, actionCardIds: ids.actions },
      starterClaims: { football: { claimedAt: new Date().toISOString(), playerCardIds: ids.players.slice(0, 5), actionCardIds: ids.actions } }, transactions: [],
    }));
    for (const [key, value] of Object.entries(extra)) localStorage.setItem(key, value);
  }, { ids: owned, extra });
  const page = await context.newPage();
  page.on('pageerror', (error) => errors.push(`${options.viewport.width}x${options.viewport.height}: ${error.message}`));
  return { context, page };
}

const fits = (target) => target.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1 && document.documentElement.scrollHeight <= innerHeight + 1);

async function checkTargets(target, label) {
  // Let the buttons finish dealing in before measuring them (looping animations never finish).
  await target.evaluate(() => Promise.all(document.getAnimations().filter((a) => a.effect?.getComputedTiming().iterations !== Infinity).map((a) => a.finished.catch(() => {}))));
  const bad = await target.evaluate(() => [...document.querySelectorAll('[data-pitch-duel-option]')].map((el) => {
    const r = el.getBoundingClientRect();
    return { id: el.getAttribute('data-pitch-duel-option'), w: r.width, h: r.height, inside: r.top >= 0 && r.left >= 0 && r.bottom <= innerHeight + 1 && r.right <= innerWidth + 1 };
  }).filter((t) => t.w < 44 || t.h < 44 || !t.inside));
  assert.deepEqual(bad, [], `${label}: every option must be on screen and at least 44px`);
}

/** Taps through a whole match, then waits for the result screen. */
async function playMatch(page, label) {
  await page.locator('[data-pitch-duel-option="play-match"]').click();
  await page.locator('[data-pitch-duel-screen="prematch"]').waitFor({ timeout: 30000 });
  assert.ok(await fits(page), `${label}: prematch must not scroll the page`);
  await page.locator('[data-pitch-duel-option="kick-off"]').click();
  await page.locator('[data-pitch-duel-screen="match"]').waitFor({ timeout: 30000 });
  assert.ok(await fits(page), `${label}: match screen must not scroll`);
  await page.getByRole('button', { name: /^KICK OFF$/ }).click();
  await checkTargets(page, label);
  await page.screenshot({ path: path.join(out, `${label}-match.png`) });
  let scenes = 0;
  let goals = 0;
  for (let i = 0; i < 400; i += 1) {
    const finish = page.getByRole('button', { name: /^SEE THE RESULT$/ });
    if (await finish.count()) {
      await page.screenshot({ path: path.join(out, `${label}-fulltime.png`) });
      await finish.first().click();
      break;
    }
    const goal = page.locator('#pd-goal-title');
    if (await goal.count()) {
      if (!goals) await page.screenshot({ path: path.join(out, `${label}-goal.png`) });
      goals += 1;
      await page.locator('[role="dialog"]').getByRole('button', { name: /CONTINUE/ }).click({ timeout: 3000 }).catch(() => {});
      continue;
    }
    const scene = page.locator('[data-kind][data-role]');
    if (await scene.count()) {
      if (!scenes) {
        await checkTargets(page, `${label} set piece`);
        await page.screenshot({ path: path.join(out, `${label}-set-piece.png`) });
      }
      scenes += 1;
    }
    const nextButton = page.getByRole('button', { name: /^(NEXT|CONTINUE|START SECOND HALF|KICK OFF)$/ });
    // A plain reveal also moves on by itself, so the button can vanish before the tap lands.
    if (await nextButton.count()) { await nextButton.first().click({ timeout: 3000 }).catch(() => {}); continue; }
    const options = page.locator('[data-pitch-duel-option]');
    const count = await options.count();
    if (count) { await options.nth(i % count).click({ timeout: 5000 }).catch(() => {}); continue; }
    await page.waitForTimeout(100);
  }
  await page.locator('[data-pitch-duel-summary]').waitFor({ timeout: 30000 });
  await page.screenshot({ path: path.join(out, `${label}-summary.png`) });
  return { scenes, goals };
}

/** The XI as the lineup editor shows it: place → aria label. */
const lineupLabels = (page) => page.locator('[data-place]').evaluateAll((els) => Object.fromEntries(els.map((el) => [el.getAttribute('data-place'), el.getAttribute('aria-label')])));

async function editLineup(page, label) {
  await page.getByRole('button', { name: /^LINEUP$/ }).click();
  await page.locator('[data-pitch-duel-screen="lineup"]').waitFor({ timeout: 30000 });
  assert.equal(await page.locator('[data-place]').count(), 11, `${label}: eleven places`);
  await checkTargets(page, `${label} lineup`);
  await page.screenshot({ path: path.join(out, `${label}-lineup.png`) });

  // Drag place 0 onto place 1: the two players swap.
  const before = await lineupLabels(page);
  const a = await page.locator('[data-place="0"]').boundingBox();
  const b = await page.locator('[data-place="1"]').boundingBox();
  await page.mouse.move(a.x + a.width / 2, a.y + a.height / 2);
  await page.mouse.down();
  await page.mouse.move(a.x + a.width / 2 + 12, a.y + a.height / 2 + 6, { steps: 3 });
  await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2, { steps: 8 });
  await page.mouse.up();
  const swapped = await lineupLabels(page);
  const name = (text) => text.split(': ')[1];
  assert.equal(name(swapped['0']), name(before['1']), `${label}: drag swaps the players`);
  assert.equal(name(swapped['1']), name(before['0']), `${label}: drag swaps both ways`);

  // Tap a place, then a squad card: the card comes in.
  await page.locator('[data-place="9"]').click();
  const incoming = page.locator('[data-bench] button').first();
  const incomingName = (await incoming.getAttribute('aria-label')).replace(/^Bring in /, '').split(',')[0];
  await incoming.click();
  const after = await lineupLabels(page);
  assert.ok(after['9'].includes(incomingName), `${label}: a squad card replaces the picked place`);

  await page.locator('[data-pitch-duel-option="save-lineup"]').click();
  await page.locator('[data-pitch-duel-screen="home"]').waitFor({ timeout: 30000 });
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('statoz.games.web.pitch-duel.v4') ?? 'null'));
  assert.equal(saved?.club?.outfield?.length, 10, `${label}: the eleven is saved`);
  return incomingName;
}

try {
  // 1. Phones, portrait, touch: lineup editing, then a whole match.
  for (const viewport of [{ width: 390, height: 844 }, { width: 360, height: 740 }]) {
    const label = `${viewport.width}x${viewport.height}`;
    const { context, page } = await seeded({ viewport, hasTouch: true, isMobile: true });
    await page.goto(`${origin}/play/pitch-duel`, { waitUntil: 'domcontentloaded', timeout: 180000 });
    await page.locator('[data-pitch-duel-screen="home"]').waitFor({ timeout: 180000 });
    assert.equal(await page.locator('iframe[data-mobile-game-frame]').count(), 0, `${label}: portrait, no rotated frame`);
    assert.ok(await fits(page), `${label}: home must not scroll the page`);
    await page.screenshot({ path: path.join(out, `${label}-home.png`) });
    if (viewport.width === 390) await editLineup(page, label);
    const played = await playMatch(page, label);
    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('statoz.games.web.pitch-duel.v4') ?? 'null'));
    assert.equal(saved?.played, 1, `${label}: the finished match is saved`);
    assert.ok(saved.history[0].decisions >= 26 && saved.history[0].decisions <= 36, `${label}: about thirty decisions`);
    console.log(`${label}: ${played.scenes} set-piece screens, ${played.goals} goals`);
    await context.close();
  }

  // 2. Bigger phone and a desktop window: the column stays centred and usable.
  for (const viewport of [{ width: 430, height: 932 }, { width: 1280, height: 800 }]) {
    const label = `${viewport.width}x${viewport.height}`;
    const { context, page } = await seeded({ viewport });
    await page.goto(`${origin}/play/pitch-duel`, { waitUntil: 'domcontentloaded', timeout: 180000 });
    await page.locator('[data-pitch-duel-screen="home"]').waitFor({ timeout: 180000 });
    await page.locator('[data-pitch-duel-option="play-match"]').click();
    await page.locator('[data-pitch-duel-option="kick-off"]').click();
    await page.locator('[data-pitch-duel-screen="match"]').waitFor({ timeout: 30000 });
    await page.getByRole('button', { name: /^KICK OFF$/ }).click();
    assert.ok(await fits(page), `${label}: match must not scroll`);
    await checkTargets(page, label);
    await page.screenshot({ path: path.join(out, `${label}-match.png`) });
    await context.close();
  }

  // 3. A v3 five-a-side save opens as an eleven, with its progress.
  {
    const v3 = { version: 3, club: { formation: '1-2-1', keeperId: 'arg-emiliano-martinez', outfield: ['arg-cristian-romero', 'arg-rodrigo-de-paul', 'arg-lionel-messi', 'arg-lautaro-martinez'], tactics: [] }, points: 12, xp: 480, wins: 4, draws: 0, losses: 1, played: 5, goalsFor: 9, goalsAgainst: 4, currentStreak: 2, bestStreak: 3, tutorialSeen: true, history: [], rewardedDivisions: [2], settings: { haptics: true } };
    const { context, page } = await seeded({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true }, { 'statoz.games.web.pitch-duel.v3': JSON.stringify(v3) });
    await page.goto(`${origin}/play/pitch-duel`, { waitUntil: 'domcontentloaded', timeout: 180000 });
    await page.locator('[data-pitch-duel-screen="home"]').waitFor({ timeout: 180000 });
    await page.waitForFunction(() => localStorage.getItem('statoz.games.web.pitch-duel.v4'), null, { timeout: 30000 });
    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('statoz.games.web.pitch-duel.v4')));
    assert.equal(saved.version, 4);
    assert.equal(saved.points, 12);
    assert.equal(saved.migratedFrom, 3);
    assert.equal(saved.club.outfield.length, 10);
    assert.ok(saved.club.outfield.includes('arg-lionel-messi'), 'old players keep their places');
    assert.ok(await page.getByText(/DIV 2/).first().isVisible(), 'division carries over');
    await context.close();
  }

  assert.deepEqual(errors, []);
  console.log('Passed: 390x844 lineup drag + full match, 360x740 full match, 430x932 and desktop layouts, v3 → v4 save.');
} catch (error) {
  console.log('Pitch Duel browser check failed: ' + String(error));
  console.log('Browser errors: ' + JSON.stringify(errors));
  process.exitCode = 1;
} finally {
  await browser.close();
  if (server) { server.closeAllConnections(); await new Promise((resolve) => server.close(resolve)); }
  await app?.close();
}
