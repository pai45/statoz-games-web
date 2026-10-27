// Home page: featured cover carousel and holo game cards, on desktop, tablet and phone.
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
const banner = page => page.locator('section[aria-label="Featured games"]');
const strip = page => banner(page).locator('[aria-label^="Play "]');
const activeTitle = async page => (await strip(page).getAttribute('aria-label')).replace(/^Play /, '');
const featured = async page => (await banner(page).getByRole('button', { name: /^Show / }).evaluateAll(buttons => buttons.map(b => b.getAttribute('aria-label').replace(/^Show /, ''))));
const library = page => page.locator('section[aria-label="All games"]');

async function open(context, name) {
  const page = await context.newPage();
  page.on('pageerror', error => errors.push(`${name}: ${error.message}`));
  await page.goto(origin + '/', { waitUntil: 'domcontentloaded', timeout: 180000 });
  await strip(page).waitFor({ timeout: 180000 });
  await library(page).locator('li').first().waitFor({ timeout: 60000 });
  await page.evaluate(() => document.fonts.ready);
  return page;
}

/** Scroll the hub panel through so lazy covers load, then capture the page. */
async function capture(page, file) {
  await page.evaluate(async () => {
    const panel = document.querySelector('[role="tabpanel"]');
    for (const el of [panel, document.scrollingElement]) {
      if (!el) continue;
      for (let y = 0; y <= el.scrollHeight; y += 400) { el.scrollTop = y; await new Promise(r => setTimeout(r, 60)); }
      el.scrollTop = 0;
    }
    await Promise.all([...document.images].map(img => img.complete ? null : new Promise(r => { img.onload = img.onerror = r; })));
  });
  await page.screenshot({ path: path.join(out, file), fullPage: true });
}

/** The same frameless carousel at every size: three covers, and only the game's name as text. */
async function checkCarousel(page, name) {
  const games = await featured(page);
  assert.equal(games.length, 3, `${name}: carousel rotates through three games`);
  assert.equal(await activeTitle(page), games[0], `${name}: carousel leads with the first trending game`);
  assert.equal((await strip(page).getAttribute('href')).replace(/\/$/, ''), base + '/play/retro-hoops', `${name}: the first trending game is Retro Hoops`);
  const text = await banner(page).evaluate(section => [...section.querySelectorAll('*')]
    .filter(el => !el.closest('[aria-hidden="true"]') && el.checkVisibility({ visibilityProperty: true }))
    .flatMap(el => [...el.childNodes].filter(node => node.nodeType === 3).map(node => node.textContent.trim()))
    .filter(Boolean).join(' '));
  assert.equal(text, games[0], `${name}: carousel text (besides decoration) is only the game name`);
  const box = await banner(page).evaluate(section => {
    const style = getComputedStyle(section);
    return { background: style.backgroundColor, border: style.borderTopWidth, clip: style.clipPath };
  });
  assert.deepEqual(box, { background: 'rgba(0, 0, 0, 0)', border: '0px', clip: 'none' }, `${name}: carousel has no box`);
}

/** Every card shows only its name; below the desktop breakpoint, an even two-column grid. */
async function checkCards(page, name, { twoColumn, live }) {
  const cards = library(page).locator('[data-discovery-card]');
  const listed = Number((await library(page).locator('header').innerText()).match(/(\d+) GAMES?/)[1]);
  assert.ok(listed >= 13, `${name}: the library lists the whole catalog (${listed})`);
  assert.equal(await cards.count(), listed, `${name}: every enabled game has a card`);
  for (const card of await cards.all()) {
    const control = card.locator('a, button').first();
    const label = await control.getAttribute('aria-label');
    const text = (await control.innerText()).replace(/\s+/g, ' ').trim().replace(/^\d{2} /, '');
    assert.equal(`Play ${text}`, label, `${name}: a card's only visible text is the game name (${label})`);
  }
  if (twoColumn) {
    const cells = await library(page).locator('li').evaluateAll(items => items.map(li => { const r = li.getBoundingClientRect(); return { x: Math.round(r.left), w: Math.round(r.width) }; }));
    assert.equal(new Set(cells.map(c => c.x)).size, 2, `${name}: cards sit in two columns`);
    assert.equal(new Set(cells.map(c => c.w)).size, 1, `${name}: no card spans the full row`);
  }
  if (live) {
    const animations = await library(page).locator('[data-discovery-card] a').evaluateAll(links => links.slice(0, 3).map(a => getComputedStyle(a).animationName));
    assert.deepEqual(animations.map(a => /liveTilt/.test(a)), [true, true, false], `${name}: the first row plays the hover treatment on its own`);
  }
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  assert.ok(overflow <= 0, `${name}: no horizontal page scroll (${overflow}px)`);
}

async function swipe(page, from, to) {
  const stage = strip(page).locator('xpath=..');
  await stage.dispatchEvent('pointerdown', { clientX: from, clientY: 200, pointerType: 'touch', isPrimary: true });
  await stage.dispatchEvent('pointerup', { clientX: to, clientY: 205, pointerType: 'touch', isPrimary: true });
}

try {
  // Desktop: links, pager, auto-advance, hover hold, sport tabs.
  const desktop = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await seed(desktop);
  let page = await open(desktop, 'desktop');
  await checkCarousel(page, 'desktop');
  await checkCards(page, 'desktop', { twoColumn: false, live: false });
  assert.equal(await page.locator('[data-ad-placement="home-feed"]').count(), 0, 'landing page has no in-feed ad banner');
  await capture(page, 'desktop.png');
  const games = await featured(page);
  assert.equal((await library(page).locator('[data-discovery-card] a').first().getAttribute('href')).replace(/\/$/, ''), base + '/play/retro-hoops');
  assert.equal((await strip(page).getAttribute('href')).replace(/\/$/, ''), base + '/play/retro-hoops');

  await page.getByRole('button', { name: 'Next featured game' }).click();
  assert.equal(await activeTitle(page), games[1], 'next arrow moves the carousel on');
  await page.getByRole('button', { name: 'Show ' + games[2] }).click();
  assert.equal(await activeTitle(page), games[2], 'pager segment jumps to its game');

  // Focus inside the carousel holds it, like hover; release both.
  await page.evaluate(() => document.activeElement?.blur());
  await page.mouse.move(0, 0);
  await page.waitForTimeout(6800);
  assert.equal(await activeTitle(page), games[0], 'carousel auto-advances and wraps around');
  await banner(page).hover();
  await page.waitForTimeout(6800);
  assert.equal(await activeTitle(page), games[0], 'carousel holds while hovered');

  for (const [label, slug] of [['FOOTBALL', 'football'], ['CRICKET', 'cricket'], ['BASKET', 'basketball'], ['TENNIS', 'tennis'], ['MOTORSPORT', 'motorsport'], ['GOLF', 'golf']]) {
    await page.getByRole('tab', { name: label }).click();
    await page.waitForURL('**/?sport=' + slug);
    await page.locator('section[aria-label="' + label[0] + label.slice(1).toLowerCase() + ' games"]').waitFor();
    assert.equal(await banner(page).count(), 0, label + ' tab has no featured carousel');
  }
  await page.getByRole('tab', { name: 'ALL GAMES' }).click();
  await page.waitForURL(url => !url.search && url.href.replace(/\/$/, '') === origin);
  await strip(page).waitFor();
  assert.equal((await featured(page)).length, 3, 'All Games keeps its carousel');
  await desktop.close();

  // Tablet (touch): same carousel, two even columns, live first row.
  const tablet = await browser.newContext({ viewport: { width: 820, height: 1180 }, hasTouch: true, isMobile: true });
  page = await open(tablet, 'tablet');
  await checkCarousel(page, 'tablet');
  await checkCards(page, 'tablet', { twoColumn: true, live: true });
  await capture(page, 'tablet.png');
  await tablet.close();

  // Phone (touch): same carousel, swipe, two even columns, live first row.
  const phone = await browser.newContext({ viewport: { width: 393, height: 851 }, hasTouch: true, isMobile: true });
  page = await open(phone, 'phone');
  await checkCarousel(page, 'phone');
  const phoneGames = await featured(page);
  await swipe(page, 300, 120);
  await page.waitForFunction(title => document.querySelector('section[aria-label="Featured games"] [aria-label^="Play "]')?.getAttribute('aria-label') === 'Play ' + title, phoneGames[1]);
  assert.ok(!page.url().includes('/play/'), 'a swipe does not open the game');
  await checkCards(page, 'phone', { twoColumn: true, live: true });
  await capture(page, 'phone.png');
  await phone.close();

  // Reduced motion: no auto-advance.
  const calm = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  page = await open(calm, 'reduced-motion');
  const still = await activeTitle(page);
  await page.waitForTimeout(6800);
  assert.equal(await activeTitle(page), still, 'reduced motion keeps the carousel still');
  await calm.close();

  assert.deepEqual(errors, [], 'no page errors');
  console.log('home hub browser checks passed; screenshots in', out);
} finally {
  await browser.close();
  server?.close();
  await app?.close?.();
}
