// Home page: featured banner and holo game cards, on phone and desktop.
// Usage: node tests/home-hub.browser.mjs [--url=http://127.0.0.1:3000]
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import next from 'next';
import { chromium } from '@playwright/test';

const root = process.cwd(), out = path.join(root, 'test-results/home-hub');
await fs.mkdir(out, { recursive: true });
const existing = process.argv.find(value => value.startsWith('--url='))?.slice(6);
const app = existing ? null : next({ dev: true, dir: root });
await app?.prepare();
const handler = app?.getRequestHandler();
const server = existing ? null : http.createServer((request, response) => { void handler(request, response); });
if (server) await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const origin = existing || 'http://127.0.0.1:' + server.address().port;
const browser = await chromium.launch({ executablePath: process.env.MOBILE_VIEWPORT_CHROMIUM || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const errors = [];

async function seed(context) {
  await context.addInitScript(() => {
    localStorage.setItem('statoz.games.web.auth.v2', JSON.stringify({ version: 2, authenticated: true, email: 'home@example.test' }));
    localStorage.setItem('statoz.games.web.accounts.v1', JSON.stringify({ version: 1, accounts: { 'home@example.test': { onboardingComplete: true } } }));
  });
}
const banner = page => page.locator('section[aria-label="Featured games"]');
const activeSlide = page => banner(page).locator('[aria-roledescription="slide"]:not([inert])');
const activeTitle = async page => (await activeSlide(page).getAttribute('aria-label')).replace(/^\d+ of \d+: /, '');

async function open(context, name) {
  const page = await context.newPage();
  page.on('pageerror', error => errors.push(`${name}: ${error.message}`));
  await page.goto(origin + '/', { waitUntil: 'domcontentloaded', timeout: 180000 });
  await banner(page).waitFor({ timeout: 180000 });
  await page.locator('section[aria-label="All games"] li').first().waitFor({ timeout: 60000 });
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

async function checkLayout(page, name) {
  const slides = await banner(page).locator('[aria-roledescription="slide"]').count();
  assert.equal(slides, 4, `${name}: All Games banner rotates through four games`);
  assert.equal(await activeTitle(page), 'RIMFORGE 3', `${name}: banner leads with the first trending game`);
  await checkCards(page, name);
}

async function checkCards(page, name) {
  const cards = page.locator('section[aria-label="All games"] [data-discovery-card]');
  assert.equal(await cards.count(), 13, `${name}: every enabled game has a card`);
  for (const card of await cards.all()) {
    const control = card.locator('a, button').first();
    const label = await control.getAttribute('aria-label');
    const text = (await control.innerText()).replace(/\s+/g, ' ').trim().replace(/^\d{2} /, '');
    assert.equal(`Play ${text}`, label, `${name}: a card's only visible text is the game name (${label})`);
  }
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  assert.ok(overflow <= 0, `${name}: no horizontal page scroll (${overflow}px)`);
}

try {
  // Desktop, signed in: links, pager, sport tab, auto-advance.
  const desktop = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await seed(desktop);
  let page = await open(desktop, 'desktop');
  await checkLayout(page, 'desktop');
  await capture(page, 'desktop.png');
  const firstCard = page.locator('section[aria-label="All games"] [data-discovery-card] a').first();
  assert.equal(await firstCard.getAttribute('href'), '/play/retro-hoops');
  assert.equal(await activeSlide(page).locator('a').getAttribute('href'), '/play/retro-hoops');

  await page.getByRole('button', { name: 'Next featured game' }).click();
  assert.equal(await activeTitle(page), 'APEXBREAK 3', 'next arrow moves the banner on');
  await page.getByRole('button', { name: 'Show OPEN GOLF' }).click();
  assert.equal(await activeTitle(page), 'OPEN GOLF', 'pager segment jumps to its game');

  // Focus inside the banner holds it, like hover; release both.
  await page.evaluate(() => document.activeElement?.blur());
  await page.mouse.move(0, 0);
  await page.waitForTimeout(6800);
  assert.equal(await activeTitle(page), 'RIMFORGE 3', 'banner auto-advances and wraps around');
  await banner(page).hover();
  await page.waitForTimeout(6800);
  assert.equal(await activeTitle(page), 'RIMFORGE 3', 'banner holds while hovered');

  for (const [label, slug] of [['FOOTBALL', 'football'], ['CRICKET', 'cricket'], ['BASKET', 'basketball'], ['TENNIS', 'tennis'], ['MOTORSPORT', 'motorsport'], ['GOLF', 'golf']]) {
    await page.getByRole('tab', { name: label }).click();
    await page.waitForURL('**/?sport=' + slug);
    await page.locator('section[aria-label="' + label[0] + label.slice(1).toLowerCase() + ' games"]').waitFor();
    assert.equal(await banner(page).count(), 0, label + ' tab has no featured carousel');
  }
  await page.getByRole('tab', { name: 'ALL GAMES' }).click();
  await page.waitForURL(origin + '/');
  assert.equal(await banner(page).locator('[aria-roledescription="slide"]').count(), 4, 'All Games keeps its carousel');
  await capture(page, 'desktop-all-games-return.png');
  await desktop.close();

  // Phone, signed out: frameless cover strip, live first card, login gate.
  const phone = await browser.newContext({ viewport: { width: 393, height: 851 }, hasTouch: true, isMobile: true });
  page = await open(phone, 'phone');
  const strip = banner(page).locator('[aria-label^="Play "]');
  await strip.waitFor({ timeout: 15000 });
  assert.equal(await banner(page).locator('[aria-roledescription="slide"]').count(), 3, 'phone banner shows three covers');
  assert.equal(await strip.getAttribute('aria-label'), 'Play RIMFORGE 3');
  const bannerText = await banner(page).evaluate(section => [...section.querySelectorAll('*')]
    .filter(el => !el.closest('[aria-hidden="true"]') && el.checkVisibility({ visibilityProperty: true }))
    .flatMap(el => [...el.childNodes].filter(node => node.nodeType === 3).map(node => node.textContent.trim()))
    .filter(Boolean).join(' '));
  assert.equal(bannerText, 'RIMFORGE 3', 'phone banner text (besides decoration) is only the game name');
  const frame = await banner(page).evaluate(section => {
    const box = section.getBoundingClientRect();
    const edge = section.firstElementChild;
    return { left: box.left, width: box.width, edge: getComputedStyle(edge).display };
  });
  assert.equal(frame.edge, 'none', 'phone banner has no frame');
  assert.ok(frame.left <= 0 && frame.width >= 393, `phone banner backdrop runs edge to edge (${JSON.stringify(frame)})`);
  const stage = strip.locator('xpath=..');
  await stage.dispatchEvent('pointerdown', { clientX: 300, clientY: 200, pointerType: 'touch', isPrimary: true });
  await stage.dispatchEvent('pointerup', { clientX: 120, clientY: 205, pointerType: 'touch', isPrimary: true });
  await page.waitForFunction(() => document.querySelector('section[aria-label="Featured games"] [aria-label^="Play "]')?.getAttribute('aria-label') === 'Play APEXBREAK 3');
  assert.equal(await page.getByRole('dialog').count(), 0, 'a swipe does not open the game');

  const live = await page.evaluate(() => {
    const first = document.querySelector('section[aria-label="All games"] [data-discovery-card] button, section[aria-label="All games"] [data-discovery-card] a');
    return { noHover: matchMedia('(hover: none)').matches, animation: getComputedStyle(first).animationName };
  });
  if (live.noHover) assert.match(live.animation, /liveTilt/, 'first phone row plays the hover treatment on its own');
  await checkCards(page, 'phone');
  await capture(page, 'phone.png');
  await page.locator('section[aria-label="All games"] [data-discovery-card] button').first().click({ force: true }); // the live card never stops moving
  await page.getByRole('dialog').waitFor({ timeout: 10000 });
  assert.match(await page.getByRole('dialog').innerText(), /RIMFORGE 3/, 'signed-out card asks to log in for that game');
  await phone.close();

  // Reduced motion: no auto-advance.
  const calm = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  page = await open(calm, 'reduced-motion');
  await page.waitForTimeout(6800);
  assert.equal(await activeTitle(page), 'RIMFORGE 3', 'reduced motion keeps the banner still');
  await calm.close();

  assert.deepEqual(errors, [], 'no page errors');
  console.log('home hub browser checks passed; screenshots in', out);
} finally {
  await browser.close();
  server?.close();
  await app?.close?.();
}
