// End-to-end return navigation, including the separate mobile landscape history.
import assert from 'node:assert/strict';
import http from 'node:http';
import next from 'next';
import { chromium } from '@playwright/test';

const existing = process.argv.find(value => value.startsWith('--url='))?.slice(6);
const app = existing ? null : next({ dev: false, dir: process.cwd() });
await app?.prepare();
const handler = app?.getRequestHandler();
const server = existing ? null : http.createServer((req, res) => void handler(req, res));
if (server) await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const origin = existing || `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({ executablePath: process.env.MOBILE_VIEWPORT_CHROMIUM || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const errors = [];
try {
  for (const mobile of [false, true]) {
    const context = await browser.newContext(mobile
      ? { viewport: { width: 393, height: 851 }, isMobile: true, hasTouch: true }
      : { viewport: { width: 1440, height: 900 } });
    // Navigation checks use the supported online mode; device-download coverage
    // lives in device-assets.browser.mjs and does not need repeating here.
    await context.route('**/_game-assets/*.json', route => route.abort());
    await context.addInitScript(() => {
      localStorage.setItem('statoz.games.web.auth.v2', JSON.stringify({ version: 2, authenticated: true, email: 'navigation@example.test' }));
      localStorage.setItem('statoz.games.web.accounts.v1', JSON.stringify({ version: 1, accounts: { 'navigation@example.test': { onboardingComplete: true } } }));
      localStorage.setItem('statoz.games.web.economy.v1', JSON.stringify({ version: 1, coins: 500, owned: { playerCardIds: [], actionCardIds: [] }, starterClaims: { football: { claimedAt: '2026-11-02', playerCardIds: [], actionCardIds: [] } }, transactions: [] }));
    });
    const page = await context.newPage();
    page.setDefaultTimeout(180000);
    page.setDefaultNavigationTimeout(30000);
    console.log(`Checking ${mobile ? 'phone' : 'desktop'} at ${origin} (process ${process.pid})`);
    page.on('pageerror', error => errors.push(error.message));
    const hub = () => mobile ? page.frameLocator('iframe[data-mobile-platform-frame]') : page;
    const game = () => mobile ? page.frameLocator('iframe[data-mobile-game-frame]') : page;
    for (const surface of mobile ? [page, hub(), game()] : [page]) {
      await page.addLocatorHandler(surface.getByRole('button', { name: 'Play online', exact: true }), async button => button.click());
    }
    for (const sport of [null, 'football']) {
      console.log('List round trip:', sport ?? 'all');
      const home = sport ? '/?sport=football' : '/';
      await page.goto(origin + home);
      await hub().getByRole('button', { name: 'View all games', exact: true }).click();
      const list = hub().getByRole('dialog', { name: 'ALL GAMES' });
      await list.getByRole('tab', { name: 'FOOTBALL', exact: true }).click();
      await hub().getByRole('dialog', { name: 'ALL GAMES' }).getByRole('tab', { name: 'FOOTBALL', exact: true }).and(hub().locator('[aria-selected="true"]')).waitFor();
      const play = list.getByRole('link', { name: /^Play Pitch Duel$/i });
      await play.waitFor();
      const launch = new URL(await play.getAttribute('href'), origin);
      const destination = launch.searchParams.get('returnTo');
      assert.equal(destination, `${sport ? '/?sport=football&' : '/?'}view=all&listSport=football`);
      await play.click();
      console.log('Opened:', page.url());
      await game().getByRole('button', { name: 'Leave Pitch Duel', exact: true }).click({ timeout: 60000 });
      console.log('Exit clicked:', page.url());
      await page.waitForURL(url => url.pathname === '/' && url.search === new URL(destination, origin).search);
      await hub().getByRole('heading', { name: 'ALL GAMES', exact: true }).click();
      assert.equal(await hub().getByRole('tab', { name: 'FOOTBALL', exact: true }).last().getAttribute('aria-selected'), 'true');
      await hub().getByRole('button', { name: 'Close all games', exact: true }).click();
      await page.waitForURL(origin + home);
      await hub().locator('section[aria-roledescription="carousel"]').waitFor();
    }
    // Coverflow launch and native browser Back preserve the selected tab.
    console.log('Coverflow and browser Back');
    await page.goto(origin + '/?sport=football');
    // An action lets the online-mode handlers dismiss the download screen.
    await hub().getByRole('button', { name: 'View all games', exact: true }).click();
    await hub().getByRole('button', { name: 'Close all games', exact: true }).click();
    const carousel = hub().locator('section[aria-roledescription="carousel"]');
    for (let index = 0; index < 20 && !(await carousel.getByRole('link', { name: /^Play Pitch Duel$/i }).count()); index++) {
      await carousel.getByRole('button', { name: 'Next game', exact: true }).click();
    }
    const launch = carousel.getByRole('link', { name: /^Play / }).first();
    assert.equal(new URL(await launch.getAttribute('href'), origin).searchParams.get('returnTo'), '/?sport=football');
    await launch.click();
    await page.waitForURL(url => url.pathname.startsWith('/play/'));
    await page.goBack();
    await page.waitForURL(origin + '/?sport=football');
    await hub().getByRole('button', { name: 'Next game', exact: true }).click();
    // Direct visits have a useful fallback even without launch history.
    console.log('Direct visit and legacy catalog');
    await page.goto(origin + '/play/pitch-duel');
    await game().getByRole('button', { name: 'Leave Pitch Duel', exact: true }).click({ timeout: 60000 });
    await page.waitForURL(origin + '/');
    await hub().getByRole('button', { name: 'Next game', exact: true }).click();
    await page.goto(origin + '/games/cricket');
    await hub().getByRole('button', { name: 'Next game', exact: true }).click();
    await page.waitForURL(origin + '/?sport=cricket');
    console.log(`${mobile ? 'phone' : 'desktop'} return journeys passed`);
    await context.close();
  }
  assert.deepEqual(errors, []);
} catch (error) {
  process.exitCode = 1;
  console.error(error);
} finally {
  // Next's standalone server can retain idle handles after all assertions and
  // browser contexts are closed. Bound shutdown for this dedicated test process.
  setTimeout(() => process.exit(process.exitCode || 0), 5000).unref();
  await browser.close();
  server?.closeAllConnections();
  server?.close();
  await app?.close?.();
}
