// Uses the host-supervised app and isolated browser storage.
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import {existsSync} from "node:fs";
import path from "node:path";
import {chromium, expect} from "@playwright/test";

const origin = (process.env.SHOP_TEST_ORIGIN || "http://localhost:3000").replace(/\/$/, "");
const out = path.resolve("test-results/shop");
await fs.mkdir(out, {recursive: true});
const executablePath = process.env.CHROME_PATH || (existsSync("/usr/bin/chromium") ? "/usr/bin/chromium" : undefined);
const browser = await chromium.launch({...(executablePath ? {executablePath} : {channel: "chrome"}), headless: true});
const context = await browser.newContext({viewport: {width: 390, height: 844}, isMobile: true, hasTouch: true, deviceScaleFactor: 1});
const page = await context.newPage(), errors = [], failed = [], checks = [];
page.on("pageerror", error => errors.push(error.message));
page.on("response", response => {
  if (response.status() >= 400 && !response.url().endsWith("favicon.ico")) failed.push(`${response.status()} ${response.url()}`);
});
const open = async route => {
  await page.goto(origin + route, {waitUntil: "networkidle", timeout: 120000});
  await page.locator("[data-shop-screen]").waitFor();
  await expect(page.getByRole("tablist", {name: "Shop category"})).toHaveCSS("display", "flex", {timeout: 30000});
};
const balance = () => page.locator("[data-shop-wallet]").getAttribute("data-shop-wallet").then(Number);
const storage = key => page.evaluate(key => JSON.parse(localStorage.getItem(key) || "null"), key);
const snapshot = name => page.screenshot({path: path.join(out, name + ".png"), timeout: 60000});
const card = id => page.locator(`[data-product-id="${id}"]`);
const tabs = () => page.getByRole("tablist", {name: "Shop category"});
const search = () => page.getByRole("searchbox", {name: "Search shop items"});
const finishEquip = async () => {
  const moment = page.locator("[data-equip-celebration]");
  await moment.waitFor({state: "visible"});
  assert.ok(await moment.evaluate(node => node.matches(":modal")), "celebrations isolate keyboard focus");
  await page.keyboard.press("Tab");
  assert.ok(await moment.evaluate(node => node.contains(document.activeElement)));
  await page.keyboard.press("Escape");
  await moment.waitFor({state: "hidden"});
};

try {
  await open("/shop");
  assert.equal(page.frames().length, 1);
  assert.equal(await balance(), 1000);
  assert.deepEqual((await tabs().getByRole("tab").allInnerTexts()).map(label => label.toLowerCase()), ["coins", "avatars", "borders", "banners"]);
  assert.equal(await tabs().locator("img, [data-art]").count(), 0, "category tabs use the original text-only style");
  await expect(tabs().getByRole("tab", {name: "Avatars", exact: true})).toHaveAttribute("aria-selected", "true");
  assert.equal(await page.getByRole("combobox").count(), 0);
  assert.equal(await page.getByText(/finish your loadout|your football locker|for you|all items|my items|yours to collect/i).count(), 0);
  assert.equal(await page.locator("[data-product-id]").count(), 24);
  const firstBuy = await page.locator("[data-product-id]").first().getByRole("button", {name: /^Buy /}).boundingBox();
  assert.ok(firstBuy.height >= 44 && firstBuy.y + firstBuy.height < 844);
  assert.equal(await page.locator("[data-shop-screen]").evaluate(node => node.getAnimations({subtree: true}).filter(animation => animation.effect?.getComputedTiming().iterations === Infinity).length), 0);
  await snapshot("01-mobile-first-screen");
  await page.getByRole("button", {name: /Show more items/}).click();
  assert.equal(await page.locator("[data-product-id]").count(), 48);
  const ids = await page.locator("[data-product-id]").evaluateAll(nodes => nodes.map(node => `${node.dataset.productKind}:${node.dataset.productId}`));
  assert.equal(new Set(ids).size, ids.length);
  await search().fill("nothing-matches-782");
  await page.getByRole("heading", {name: "No items found"}).waitFor();
  await page.getByRole("button", {name: "Clear search", exact: true}).first().click();
  await expect(search()).toBeFocused();
  await expect(page.locator("[data-product-id]")).toHaveCount(24);
  checks.push("Four compact text categories, search only, pagination, unique items and empty-state recovery");

  const avatarTab = tabs().getByRole("tab", {name: "Avatars", exact: true});
  await avatarTab.focus();
  await page.keyboard.press("ArrowRight");
  await expect(tabs().getByRole("tab", {name: "Borders", exact: true})).toBeFocused();
  await expect(tabs().getByRole("tab", {name: "Borders", exact: true})).toHaveAttribute("aria-selected", "true");
  await search().fill("Liverpool");
  const previewButton = card("frame_liv").getByRole("button", {name: "Preview Liverpool"});
  await previewButton.click();
  let preview = page.getByRole("dialog", {name: "Liverpool", exact: true});
  await preview.waitFor();
  await page.keyboard.press("Escape");
  await preview.waitFor({state: "hidden"});
  await expect(previewButton).toBeFocused();
  await card("frame_liv").getByRole("button", {name: /^Buy Liverpool/}).click();
  let unlocked = page.getByRole("dialog", {name: "Liverpool", exact: true});
  await unlocked.waitFor();
  assert.equal(await balance(), 850);
  await unlocked.getByRole("button", {name: "Equip now", exact: true}).click();
  await finishEquip();
  await expect(card("frame_liv")).toHaveAttribute("data-product-state", "equipped");
  assert.equal(await card("frame_liv").getByRole("button", {name: /^Buy /}).count(), 0);
  assert.equal((await card("frame_liv").innerText()).match(/equipped/gi)?.length, 1);
  await expect.poll(() => page.evaluate(() => document.activeElement.tagName)).not.toBe("BODY");
  checks.push("Keyboard category navigation, preview focus restoration, exact charge, equip celebration and duplicate prevention");

  await open("/shop/search?sport=football&q=Neymar");
  await card("bra-neymar").getByRole("button", {name: /^Buy Neymar/}).click();
  await page.getByRole("dialog", {name: "Neymar", exact: true}).getByRole("button", {name: "Equip now", exact: true}).click();
  await finishEquip();
  assert.equal(await balance(), 825);
  assert.equal((await storage("statoz.games.web.profile.v1")).avatarId, "bra-neymar");
  await open("/shop?tab=banners&sport=football&q=nebula");
  await card("nebula").getByRole("button", {name: /^Buy NEBULA/}).click();
  await page.getByRole("dialog", {name: "NEBULA", exact: true}).getByRole("button", {name: "Equip now", exact: true}).click();
  await finishEquip();
  assert.equal(await balance(), 800);
  assert.equal((await storage("statoz.games.web.profile.v1")).bannerId, "nebula");
  await snapshot("02-banner-equipped");
  await open("/shop?tab=avatars&sport=football&q=Jannik Sinner");
  assert.ok(await page.locator("[data-product-id]").count() > 0, "tennis portraits appear despite legacy football parameter");
  await open("/shop?tab=banners&sport=football&q=korea");
  await card("korea").waitFor();
  await open("/shop?tab=kits");
  await expect(avatarTab).toHaveAttribute("aria-selected", "true");
  assert.equal(await page.locator('[data-product-kind="kit"], [data-product-kind="jersey"], [data-product-kind="livery"]').count(), 0);
  checks.push("Avatar/banner purchases update profile, all sports including Tennis appear, and retired tabs fall back safely");

  await open("/shop?tab=coins&sport=cricket&focus=frame_ars");
  preview = page.getByRole("dialog", {name: "Arsenal", exact: true});
  await preview.waitFor();
  await page.keyboard.press("Escape");
  await preview.waitFor({state: "hidden"});
  await expect(tabs().getByRole("tab", {name: "Borders", exact: true})).toHaveAttribute("aria-selected", "true");
  assert.ok(!new URL(page.url()).searchParams.has("focus"));
  await page.getByRole("link", {name: /Oz Coins. Add coins/}).click();
  await page.locator("#coins").waitFor();
  assert.equal(await search().count(), 0);
  assert.equal(await page.locator("[data-coin-bundle]").count(), 6);
  assert.equal(await page.getByText(/bonus level|enough for|starter boost/i).count(), 0);
  assert.match(await page.locator('[data-coin-bundle="pro"]').innerText(), /12,000/);
  assert.equal(await page.getByText(/no real payment/i).count(), 1);
  await snapshot("03-coin-bundles");
  const rookieButton = page.locator('[data-coin-bundle="rookie"]').getByRole("button");
  await rookieButton.click();
  const checkout = page.locator("[data-coin-checkout]");
  await checkout.waitFor();
  assert.match(await checkout.innerText(), /1,800/);
  await checkout.getByRole("button", {name: "Cancel", exact: true}).click();
  await checkout.waitFor({state: "hidden"});
  await expect(rookieButton).toBeFocused();
  assert.equal(await balance(), 800);
  await rookieButton.click();
  await checkout.getByRole("button", {name: /^Confirm/}).click();
  const reward = page.locator("[data-coin-reward]");
  await reward.waitFor({state: "visible"});
  assert.equal(await balance(), 1800);
  assert.ok(await reward.evaluate(node => node.matches(":modal")));
  await page.keyboard.press("Escape");
  await reward.waitFor({state: "hidden"});
  await expect.poll(() => page.evaluate(() => document.activeElement.tagName)).not.toBe("BODY");
  checks.push("Legacy focus links, wallet navigation, concise coin cards, cancellation and confirmed top-up celebration");

  await page.evaluate(() => {
    const key = "statoz.games.web.economy.v1", current = JSON.parse(localStorage.getItem(key));
    current.coins = 0; localStorage.setItem(key, JSON.stringify(current));
  });
  await open("/shop?tab=frames&q=Arsenal");
  await card("frame_ars").getByRole("button", {name: /^Buy Arsenal/}).click();
  await page.getByText("Not enough Oz Coins for that one.").last().waitFor();
  assert.equal(await balance(), 0);
  assert.ok(!(await storage("statoz.games.web.economy.v1")).owned.frameIds.includes("frame_ars"));
  await page.getByRole("button", {name: "GET COINS", exact: true}).click();
  await page.locator("#coins").waitFor();
  await page.reload({waitUntil: "networkidle"});
  const saved = await storage("statoz.games.web.economy.v1");
  assert.equal(saved.equipped.avatarId, "bra-neymar");
  assert.equal(saved.equipped.bannerId, "nebula");
  assert.equal(saved.equipped.frameId, "frame_liv");
  assert.ok(saved.owned.kitIds.includes("voltage") && saved.owned.jerseyIds.includes("statoz") && saved.owned.liveryIds.includes("gridLine"));
  checks.push("Insufficient funds never charge or grant; recovery, saved cosmetics and legacy inventory survive reload");

  for (const [name, viewport, mobile, columns] of [
    ["small-phone", {width: 360, height: 640}, true, 2],
    ["landscape-phone", {width: 844, height: 390}, true, 3],
    ["tablet", {width: 768, height: 1024}, true, 3],
    ["desktop", {width: 1440, height: 1000}, false, 4],
  ]) {
    const device = await browser.newContext({viewport, hasTouch: mobile, isMobile: mobile, deviceScaleFactor: 1, reducedMotion: "reduce"});
    const screen = await device.newPage(); screen.on("pageerror", error => errors.push(error.message));
    screen.on("response", response => {if (response.status() >= 400 && !response.url().endsWith("favicon.ico")) failed.push(`${response.status()} ${response.url()}`);});
    await screen.goto(origin + "/shop", {waitUntil: "networkidle"});
    await screen.locator("[data-shop-screen]").waitFor();
    assert.equal(screen.frames().length, 1);
    assert.ok(await screen.evaluate(() => document.documentElement.scrollWidth <= innerWidth+1), name + " no horizontal overflow");
    for (const tab of await screen.getByRole("tablist", {name: "Shop category"}).getByRole("tab").all()) {
      const box = await tab.boundingBox();
      assert.ok(box.width >= 44 && box.height >= 44 && box.x >= 0 && box.x + box.width <= viewport.width, name + " all category tabs visible and touchable");
    }
    assert.equal(await screen.locator('[data-shop-catalog] > div').last().evaluate(node => getComputedStyle(node).gridTemplateColumns.split(" ").length), columns);
    assert.ok(await screen.locator("[data-product-id]").first().getByRole("button", {name: /^Buy /}).evaluate(node => node.getBoundingClientRect().height >= 44));
    await screen.screenshot({path: path.join(out, `04-${name}.png`), timeout: 60000});
    await screen.getByRole("tab", {name: "Coins", exact: true}).click();
    assert.ok(await screen.evaluate(() => document.documentElement.scrollWidth <= innerWidth+1));
    await screen.locator('[data-coin-bundle="rookie"]').getByRole("button").click();
    const sheet = screen.locator("[data-coin-checkout]");
    const sheetBox = await sheet.boundingBox();
    assert.ok(sheetBox.y >= 0 && sheetBox.y + sheetBox.height <= viewport.height + 1, name + " checkout fits viewport");
    await sheet.getByRole("button", {name: /^Confirm/}).click();
    const moment = screen.locator("[data-coin-reward]");
    await moment.waitFor({state: "visible"});
    assert.equal(await moment.locator("[data-reward-balance]").textContent(), "2,000", "reduced motion uses final balance immediately");
    await screen.keyboard.press("Escape");
    await device.close();
  }
  checks.push("Phone, landscape, tablet and desktop layouts, touch targets, viewport-safe checkout and reduced motion");
  await open("/shop");
  await page.evaluate(() => { document.documentElement.style.fontSize = "200%"; });
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth+1), "enlarged text does not overflow");
  for (const tab of await tabs().getByRole("tab").all()) {
    assert.ok(await tab.evaluate(node => node.scrollWidth <= node.clientWidth+1), "enlarged category labels remain inside their tabs");
  }
  await page.evaluate(() => { document.documentElement.style.fontSize = ""; });
  checks.push("Enlarged text preserves the four categories without horizontal overflow");
  assert.deepEqual(errors, []);
  assert.deepEqual(failed, []);
  await fs.writeFile(path.join(out, "checks.json"), JSON.stringify({checks, errors, failed}, null, 2));
  console.log("PASS\n- " + checks.join("\n- "));
} catch (error) {
  await snapshot("zz-failure").catch(() => {});
  console.error("FAIL", error, "\nChecks:", checks, "\nPage errors:", errors, "\nFailed requests:", failed.slice(0, 15));
  process.exitCode = 1;
} finally {
  await browser.close();
}
