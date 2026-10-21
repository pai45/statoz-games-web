import { test, expect, type Page } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("statoz.games.web.auth.v2", JSON.stringify({ version: 2, authenticated: true, email: "shootout-qa@example.test" }));
    localStorage.setItem("statoz.games.web.accounts.v1", JSON.stringify({ version: 1, accounts: { "shootout-qa@example.test": { onboardingComplete: true } } }));
  });
});
test.afterEach(async ({ page }, info) => {
  // Release the live WebGL/audio page before Chromium fixture teardown.
  if (info.status === info.expectedStatus && !page.isClosed()) await page.goto("about:blank");
});
async function open(page: Page) {
  await page.goto("./play/penalty-shootout");
  await expect(page.getByRole("button", { name: "PLAY SHOOTOUT", exact: false })).toBeEnabled({ timeout: 60000 });
  await page.getByRole("button", { name: "Dismiss advertisement" }).click({ timeout: 1500 }).catch(() => {});
}
async function phase(page: Page, value: string) { await expect(page.locator("[data-shootout-phase]")).toHaveAttribute("data-shootout-phase", value); }
async function shoot(page: Page) {
  await page.keyboard.down("Space"); await page.keyboard.down("KeyD"); await page.waitForTimeout(540); await page.keyboard.up("Space"); await page.keyboard.up("KeyD"); await phase(page, "resolution");
}
test("Desktop shot, replay, pause, keeper and training never settle rewards", async ({ page }, info) => {
  const errors: string[] = []; page.on("pageerror", e => errors.push(String(e))); await open(page);
  await page.screenshot({ path: info.outputPath("desktop-lobby.png") });
  await page.getByRole("button", { name: "PRACTICE SHOTS", exact: true }).click();
  await page.screenshot({ path: info.outputPath("desktop-shooting.png") });
  // Keep this cancellation inside the page clock: a slow host/CDP round trip
  // must not turn the held test key into a full-power shot before Pause arrives.
  await page.evaluate(async () => {
    document.body.dispatchEvent(new KeyboardEvent("keydown", { code: "Space", bubbles: true, cancelable: true }));
    for (let frame = 0; frame < 4; frame++) await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
    document.querySelector<HTMLButtonElement>("[aria-label='Pause game']")!.click();
    document.body.dispatchEvent(new KeyboardEvent("keyup", { code: "Space", bubbles: true, cancelable: true }));
  });
  await expect(page.getByRole("dialog")).toBeVisible(); await page.waitForTimeout(300); await page.getByRole("button", { name: "RESUME PLAY" }).click(); await phase(page, "preparation");
  await shoot(page); await page.screenshot({ path: info.outputPath("desktop-result.png") });
  const score = await page.locator("[aria-label='STATOZ FC kick history']").textContent();
  // Replay captures are made by the review recorder; PNG encoding must not
  // consume the transient replay window before the skip action is exercised.
  await page.getByRole("button", { name: "REPLAY", exact: true }).click(); await phase(page, "replay");
  await page.getByRole("button", { name: "SKIP REPLAY" }).click(); await phase(page, "preparation");
  await expect(page.locator("[aria-label='STATOZ FC kick history']")).toHaveText(score!);
  await page.getByRole("button", { name: "Leave shootout" }).click(); await page.getByRole("button", { name: "QUIT TO LOBBY" }).click();
  await page.getByRole("button", { name: "PRACTICE SAVES", exact: true }).click(); await page.keyboard.down("KeyD"); await page.waitForTimeout(220); await page.keyboard.up("KeyD");
  await page.keyboard.press("ArrowRight"); await page.screenshot({ path: info.outputPath("desktop-keeping.png") }); await phase(page, "resolution");
  await page.screenshot({ path: info.outputPath("desktop-save-result.png") });
  expect(await page.evaluate(() => localStorage.getItem("statoz.games.web.shootout.v1"))).toBeNull();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("statoz.games.web.economy.v1") ?? "{}").settledRewardIds ?? [])).toHaveLength(0);
  expect(errors).toEqual([]);
});
for (const [name, width, height] of [["portrait", 412, 915], ["landscape", 915, 412]] as const) {
  test(`Phone ${name} supports simultaneous stick/shoot touch and readable keeping`, async ({ browser }, info) => {
    const context = await browser.newContext({ viewport: { width, height }, hasTouch: true, isMobile: true, deviceScaleFactor: 1 });
    const page = await context.newPage();
    await page.addInitScript(() => localStorage.setItem("statoz.games.web.auth.v2", JSON.stringify({ version: 2, authenticated: true, email: "mobile-qa@example.test" })));
    await open(page); await page.screenshot({ path: info.outputPath(`${name}-lobby.png`) });
    await page.getByRole("button", { name: "PRACTICE SHOTS", exact: true }).tap(); await page.screenshot({ path: info.outputPath(`${name}-shooting.png`) });
    const stick = await page.getByRole("group", { name: "AIM virtual stick" }).boundingBox(), shoot = await page.getByRole("button", { name: "Hold to charge shot" }).boundingBox();
    expect(stick).not.toBeNull(); expect(shoot).not.toBeNull();
    const cdp = await context.newCDPSession(page);
    const points = [{ x: stick!.x + stick!.width * 0.78, y: stick!.y + stick!.height / 2, id: 1 }, { x: shoot!.x + shoot!.width / 2, y: shoot!.y + shoot!.height / 2, id: 2 }];
    // Observe the transient phase inside the page. A delayed CDP response must
    // not make a successful touch appear to have skipped charging.
    await page.evaluate(() => {
      const game = document.querySelector<HTMLElement>("[data-shootout-phase]")!; game.dataset.testChargingObserved = "false";
      const observer = new MutationObserver(() => { if (game.dataset.shootoutPhase === "charging") { game.dataset.testChargingObserved = "true"; observer.disconnect(); } });
      observer.observe(game, { attributes: true, attributeFilter: ["data-shootout-phase"] });
    });
    await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: points }); await expect(page.locator("[data-shootout-phase]")).toHaveAttribute("data-test-charging-observed", "true"); await page.waitForTimeout(450); await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    await phase(page, "resolution"); await page.screenshot({ path: info.outputPath(`${name}-result.png`) });
    await page.getByRole("button", { name: "Leave shootout" }).tap(); await page.getByRole("button", { name: "QUIT TO LOBBY" }).tap(); await page.getByRole("button", { name: "PRACTICE SAVES", exact: true }).tap();
    await page.screenshot({ path: info.outputPath(`${name}-keeping.png`) });
    const dive = page.getByRole("button", { name: "Dive right high" }); const bounds = await dive.boundingBox(); expect(bounds!.width).toBeGreaterThanOrEqual(44); expect(bounds!.height).toBeGreaterThanOrEqual(44);
    await dive.tap(); await phase(page, "resolution");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.goto("about:blank"); await context.close();
  });
}
test("Full shootout settles once; replay, summary and reload preserve the result", async ({ page }) => {
  test.setTimeout(180000); await open(page); await page.getByRole("button", { name: "PLAY SHOOTOUT", exact: false }).click();
  for (let kick = 0; kick < 24; kick++) {
    console.log(`shootout kick ${kick + 1}: ${await page.locator("[data-shootout-phase]").getAttribute("data-shootout-phase")}`);
    if (await page.getByRole("button", { name: "VIEW RESULT" }).isVisible()) break;
    const taking = await page.locator("[data-shootout-role]").getAttribute("data-shootout-role") === "shooting";
    if (taking) { await page.keyboard.down("Space"); await page.keyboard.down("KeyD"); await page.waitForTimeout(780); await page.keyboard.up("Space"); await page.waitForTimeout(900); await page.keyboard.up("KeyD"); }
    await phase(page, "resolution");
    console.log(`resolved kick ${kick + 1}`);
    if (await page.getByRole("button", { name: "VIEW RESULT" }).isVisible()) break;
    await page.getByRole("button", { name: "NEXT PENALTY", exact: false }).click();
  }
  console.log("Opening final result"); await page.getByRole("button", { name: "VIEW RESULT" }).click(); await phase(page, "summary"); console.log("Summary visible");
  const before = await page.evaluate(() => ({ progress: localStorage.getItem("statoz.games.web.shootout.v1"), economy: localStorage.getItem("statoz.games.web.economy.v1") }));
  expect(JSON.parse(before.progress!).played).toBe(1); expect(JSON.parse(before.economy!).settledRewardIds).toHaveLength(1);
  await page.waitForTimeout(500); console.log("Reloading completed match"); await page.reload(); await expect(page.getByRole("button", { name: "PLAY SHOOTOUT", exact: false })).toBeEnabled(); console.log("Reload complete");
  expect(await page.evaluate(() => ({ progress: localStorage.getItem("statoz.games.web.shootout.v1"), economy: localStorage.getItem("statoz.games.web.economy.v1") }))).toEqual(before);
});
test("Asset loading failure can retry; context loss pauses and requires resume", async ({ page }) => {
  await page.route("**/athlete.glb", route => route.abort()); await page.goto("./play/penalty-shootout"); await expect(page.getByRole("alert").filter({ hasText: "THE PITCH" })).toBeVisible({ timeout: 60000 });
  await page.unroute("**/athlete.glb"); await page.getByRole("button", { name: "RETRY", exact: true }).click(); await expect(page.getByRole("button", { name: "PLAY SHOOTOUT", exact: false })).toBeEnabled();
  await page.getByRole("button", { name: "Dismiss advertisement" }).click({ timeout: 1500 }).catch(() => {}); await page.getByRole("button", { name: "PRACTICE SHOTS", exact: true }).click();
  const canLose = await page.evaluate(() => { const gl = document.querySelector("canvas")?.getContext("webgl2"), extension = gl?.getExtension("WEBGL_lose_context"); if (!extension) return false; extension.loseContext(); setTimeout(() => extension.restoreContext(), 600); return true; });
  expect(canLose).toBe(true); await expect(page.getByRole("dialog")).toBeVisible(); await expect(page.getByRole("button", { name: "RESUME PLAY" })).toBeEnabled(); await page.getByRole("button", { name: "RESUME PLAY" }).click(); await phase(page, "preparation");
});

test("Starting muted can unmute crowd ambience without restarting the match", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("statoz.games.web.shootout.settings.v1", JSON.stringify({ effects: 0.6, crowd: 0.4, muted: true })));
  await open(page); await page.getByRole("button", { name: "PRACTICE SHOTS", exact: true }).click();
  await page.getByRole("button", { name: "Unmute audio", exact: true }).click();
  await page.waitForFunction(() => { const howler = (globalThis as unknown as { Howler: { _howls: { _src: string; playing(): boolean }[] } }).Howler; return howler._howls.some(sound => String(sound._src).includes("crowd.ogg") && sound.playing()); });
});
