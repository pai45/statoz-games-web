// Home page: the centre-stage game coverflow and the VIEW ALL GAMES list, on desktop, tablet and an upright phone.
// Usage: node tests/home-hub.browser.mjs [--url=http://127.0.0.1:3000 | --pages]
//   --pages serves the static GitHub Pages export in out/ (run `npm run build:pages` first).
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import next from 'next';
import { chromium } from '@playwright/test';

const root = process.cwd(), out = path.join(root, 'test-results/home-hub');
await fs.mkdir(out, { recursive: true });
const existing = process.argv.find(value => value.startsWith('--url='))?.slice(6);
const pages = process.argv.includes('--pages');
const base = pages ? '/statoz-games-web' : '';
const app = existing || pages ? null : next({ dev: true, dir: root });
await app?.prepare();
const handler = app?.getRequestHandler();
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.txt': 'text/plain' };
const server = existing ? null : http.createServer(async (request, response) => {
  if (!pages) { void handler(request, response); return; }
  try {
    let relative = decodeURIComponent(new URL(request.url, 'http://localhost').pathname).slice(base.length);
    if (!path.extname(relative)) relative += '/index.html';
    const file = path.resolve(root, 'out', '.' + relative);
    if (!file.startsWith(path.join(root, 'out') + path.sep)) throw Error('Invalid path');
    response.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream');
    response.end(await fs.readFile(file));
  } catch { response.writeHead(404); response.end(); }
});
if (server) await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const origin = (existing || 'http://127.0.0.1:' + server.address().port) + base;
const browser = await chromium.launch({ executablePath: process.env.MOBILE_VIEWPORT_CHROMIUM || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const errors = [];

async function seed(context) {
  await context.addInitScript(() => {
    localStorage.setItem('statoz.games.web.auth.v2', JSON.stringify({ version: 2, authenticated: true, email: 'home@example.test' }));
    localStorage.setItem('statoz.games.web.accounts.v1', JSON.stringify({ version: 1, accounts: { 'home@example.test': { onboardingComplete: true } } }));
  });
}
const carousel = root => root.locator('section[aria-roledescription="carousel"]');
const centre = root => carousel(root).locator('a[aria-label^="Play "]').first();
const title = async root => (await carousel(root).locator('h2').textContent()).trim();
const counter = async root => (await carousel(root).locator('h2 + p span').last().textContent()).trim();
const pad = value => String(value).padStart(2, '0');

async function open(context, name, { phoneFrame = false } = {}) {
  const page = await context.newPage();
  page.on('pageerror', error => errors.push(`${name}: ${error.message}`));
  await page.goto(origin + '/', { waitUntil: 'domcontentloaded', timeout: 180000 });
  const root = phoneFrame ? page.frameLocator('iframe[data-mobile-platform-frame]') : page;
  await centre(root).waitFor({ timeout: 180000 });
  // The server-rendered carousel shows before React takes it over; a slow dev compile can leave it inert for a while.
  const next = carousel(root).getByRole('button', { name: 'Next game' });
  for (let tries = 0; !(await next.evaluate(button => Object.keys(button).some(key => key.startsWith('__reactProps')))); tries++) {
    if (tries > 900) throw new Error(`${name}: the carousel never became interactive`);
    await page.waitForTimeout(200);
  }
  await page.evaluate(() => document.fonts.ready);
  return { page, root };
}

/** Cards fill the stage: a centre game, neighbours on both sides, nothing off the page. */
async function checkCoverflow(root, name) {
  const total = Number((await counter(root)).split('/')[1]);
  assert.ok(total >= 13, `${name}: the coverflow runs through the whole catalog (${total})`);
  assert.equal(await counter(root), `01 / ${pad(total)}`, `${name}: starts on the first game`);
  const box = await centre(root).evaluate(card => { const r = card.getBoundingClientRect(); return { x: r.x, width: r.width, height: r.height }; });
  assert.ok(box.width > 150 && box.height > 100, `${name}: the centre card has a real size (${JSON.stringify(box)})`);
  const sides = await carousel(root).locator('button[aria-label^="Show "]').evaluateAll(cards => cards.map(card => { const r = card.getBoundingClientRect(); return r.x + r.width / 2; }));
  const middle = box.x + box.width / 2;
  assert.ok(sides.some(x => x < middle) && sides.some(x => x > middle), `${name}: games sit on both sides of the centre`);
  const overflow = await root.locator('html').evaluate(html => html.scrollWidth - html.clientWidth);
  assert.ok(overflow <= 0, `${name}: no horizontal page scroll (${overflow}px)`);
  // VIEW ALL is one icon button in the carousel's bottom-right corner, clear of PLAY.
  const corner = await carousel(root).evaluate(section => {
    const rect = element => { const r = element.getBoundingClientRect(); return { left: r.left, right: r.right, top: r.top, bottom: r.bottom, width: r.width, height: r.height }; };
    const viewAll = section.querySelector('[aria-label="View all games"]');
    const play = [...section.querySelectorAll('a[aria-label^="Play "]')].at(-1);
    return { section: rect(section), viewAll: rect(viewAll), play: rect(play), text: viewAll.textContent.trim() };
  });
  assert.equal(corner.text, '', `${name}: VIEW ALL shows only an icon`);
  assert.ok(Math.abs(corner.viewAll.width - corner.viewAll.height) < 2, `${name}: VIEW ALL is square (${JSON.stringify(corner.viewAll)})`);
  assert.ok(corner.section.right - corner.viewAll.right <= 24 && corner.section.bottom - corner.viewAll.bottom <= 24, `${name}: VIEW ALL sits in the bottom-right corner`);
  assert.ok(corner.play.right <= corner.viewAll.left || corner.play.bottom <= corner.viewAll.top, `${name}: VIEW ALL does not cover PLAY`);
  return total;
}

/** A real finger drag of `distance` px straight up the upright screen, which is leftwards in the turned shell. */
async function touchDragUp(page, root, distance) {
  const box = await centre(root).boundingBox();
  const x = box.x + box.width / 2, y = box.y + box.height / 2;
  const cdp = await page.context().newCDPSession(page);
  const touch = (type, at) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: type === 'touchEnd' ? [] : [{ x, y: at }] });
  await touch('touchStart', y);
  for (let step = 1; step <= 10; step++) { await touch('touchMove', y - (distance * step) / 10); await page.waitForTimeout(16); }
  await touch('touchEnd');
}

try {
  // Desktop: arrows, keyboard, side cards, the full list and the sport tabs.
  const desktop = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await seed(desktop);
  let { page, root } = await open(desktop, 'desktop');
  const total = await checkCoverflow(root, 'desktop');
  await page.screenshot({ path: path.join(out, 'desktop.png') });
  const first = await title(root);
  await page.getByRole('button', { name: 'Next game' }).click();
  assert.equal(await counter(root), `02 / ${pad(total)}`, 'next arrow moves on');
  await page.getByRole('button', { name: 'Previous game' }).click();
  await page.getByRole('button', { name: 'Previous game' }).click();
  assert.equal(await counter(root), `${pad(total)} / ${pad(total)}`, 'previous wraps around to the last game');
  await page.getByRole('button', { name: 'Next game' }).focus();
  await page.keyboard.press('ArrowRight');
  assert.equal(await title(root), first, 'arrow keys move the coverflow');
  // The right-hand neighbour: tap its uncovered right half.
  const side = carousel(page).locator('button[aria-label^="Show "][style*="--d: 1;"]');
  const sideName = (await side.getAttribute('aria-label')).replace(/^Show /, '');
  const sideBox = await side.boundingBox();
  await page.mouse.click(sideBox.x + sideBox.width * 0.85, sideBox.y + sideBox.height / 2);
  assert.equal((await title(root)).toUpperCase(), sideName.toUpperCase(), 'tapping a side card centres it');
  assert.ok(!page.url().includes('/play/'), 'tapping a side card does not open it');

  // Dragging: the cards follow the mouse; letting go settles on the nearest game without opening it.
  const before = Number((await counter(root)).split('/')[0]);
  const start = await centre(root).boundingBox();
  const sx = start.x + start.width / 2, sy = start.y + start.height / 2, slot = start.width * 0.6;
  await page.mouse.move(sx, sy);
  await page.mouse.down();
  await page.mouse.move(sx - slot * 0.5, sy, { steps: 6 });
  const mid = await centre(root).boundingBox();
  assert.ok(mid.x < start.x - slot * 0.3, `the centre card follows the drag (${Math.round(start.x)} -> ${Math.round(mid.x)})`);
  await page.mouse.move(sx - slot * 1.2, sy, { steps: 6 });
  await page.mouse.up();
  assert.equal(await counter(root), `${pad(before % total + 1)} / ${pad(total)}`, 'dragging left by one card shows the next game');
  assert.ok(!page.url().includes('/play/'), 'a drag does not open the game');
  const settled = await counter(root);
  await page.mouse.move(sx, sy);
  await page.mouse.down();
  await page.mouse.move(sx + 20, sy, { steps: 3 });
  await page.mouse.up();
  await page.waitForTimeout(300);
  assert.equal(await counter(root), settled, 'a short drag snaps back to the same game');
  assert.ok(!page.url().includes('/play/'), 'a short drag does not open the game');

  // VIEW ALL GAMES: every game as a row, a sport filter, Escape closes.
  await page.getByRole('button', { name: 'View all games', exact: true }).click();
  await page.waitForURL('**/?view=all');
  const list = page.getByRole('dialog', { name: 'ALL GAMES' });
  await list.waitFor();
  assert.equal(await list.locator('li').count(), total, 'the list has every game');
  await list.getByRole('tab', { name: 'FOOTBALL' }).click();
  assert.equal(await list.getByRole('tab', { name: 'FOOTBALL' }).getAttribute('aria-selected'), 'true', 'the football chip is selected');
  const football = await list.locator('li').count();
  assert.ok(football > 0 && football < total, `the football filter narrows the list (${football})`);
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(out, 'desktop-list.png') });
  await page.keyboard.press('Escape');
  await list.waitFor({ state: 'hidden' });
  await page.waitForURL(url => !url.search);
  assert.equal(await page.locator('[data-ad-placement="home-feed"]').count(), 0, 'landing page has no in-feed ad banner');

  for (const [label, slug] of [['FOOTBALL', 'football'], ['CRICKET', 'cricket'], ['BASKET', 'basketball'], ['TENNIS', 'tennis'], ['MOTORSPORT', 'motorsport'], ['GOLF', 'golf']]) {
    await page.getByRole('tab', { name: label }).click();
    await page.waitForURL('**/?sport=' + slug);
    await page.locator(`section[aria-label="${slug} games"]`).waitFor();
    assert.equal((await counter(page)).slice(0, 2), '01', label + ' tab starts on its first game');
  }
  await page.getByRole('tab', { name: 'ALL GAMES' }).click();
  await page.waitForURL(url => !url.search && url.href.replace(/\/$/, '') === origin);
  await desktop.close();

  // Portrait tablet: the shell is not rotated, and the cards still size from the stage.
  const tablet = await browser.newContext({ viewport: { width: 820, height: 1180 }, hasTouch: true, isMobile: true });
  await seed(tablet);
  ({ page, root } = await open(tablet, 'tablet'));
  assert.equal(await page.locator('iframe[data-mobile-platform-frame]').count(), 0, 'tablets keep the normal shell');
  await checkCoverflow(root, 'tablet');
  await page.screenshot({ path: path.join(out, 'tablet.png') });
  await tablet.close();

  // Upright phone: the whole shell is turned to landscape; a finger drag moves on without opening a game.
  const phone = await browser.newContext({ viewport: { width: 393, height: 851 }, hasTouch: true, isMobile: true });
  await seed(phone);
  ({ page, root } = await open(phone, 'phone', { phoneFrame: true }));
  assert.match(await page.locator('iframe[data-mobile-platform-frame]').evaluate(frame => frame.style.transform), /rotate\(90deg\)/, 'the shell is turned sideways');
  const inner = await root.locator('html').evaluate(() => ({ width: innerWidth, height: innerHeight }));
  assert.deepEqual(inner, { width: 851, height: 393 }, 'the shell lays out as landscape');
  await checkCoverflow(root, 'phone');
  await touchDragUp(page, root, 220);
  await root.locator('section[aria-roledescription="carousel"] h2 + p span', { hasText: /^0[2-9] \// }).waitFor({ timeout: 5000 });
  assert.ok(!page.url().includes('/play/'), 'a drag does not open the game');
  await page.screenshot({ path: path.join(out, 'phone.png') });
  await phone.close();

  assert.deepEqual(errors, [], 'no page errors');
  console.log('home hub browser checks passed; screenshots in', out);
} finally {
  await browser.close();
  server?.close();
  await app?.close?.();
}
