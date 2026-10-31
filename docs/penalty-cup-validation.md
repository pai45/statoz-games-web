# Penalty Cup validation — 31 October 2026

Implemented locally in Future Games Web at `/play/penalty-cup`. No Flutter source, original StatOz repositories, hosted service, deployment or GitHub publication was changed.

## Passed checks

- `npm run typecheck`: passed. The final production build also completed its TypeScript checks.
- `npm run lint`: no errors. Three existing unused-variable warnings remain in `.cache/f1-racing-phone-probe.mjs`, `.cache/shootout-fx/capture.mjs` and `src/features/games/retro-circuit/data.ts`.
- Penalty Cup, discovery, viewport and device-asset integration tests: **31 passed** (`npx tsx --test tests/penalty-cup.test.ts tests/home-catalog.test.ts tests/mobile-game-viewport.test.ts tests/device-assets.test.mjs`).
- Existing Penalty Shootout regression suite: **34 passed** (`npm run test:shootout`).
- `npm run test:penalty-cup:browser`: passed. Exercised actual shooting, replay/skip, keeping, keyboard/pointer input, touch dive, desktop/portrait/landscape layouts, pause/resume, host pause/resume/dispose, random mode, account isolation, pending-result reload, retry persistence, bronze progression and a completed championship bracket. No page/console errors; external network requests blocked during the offline-bundle check.
- `npm run test:penalty-cup:app`: passed against the production build. Verified Football discovery, the real play route, portrait viewport, account-scoped host saves after full reload, and the help route, through the app's existing on-demand Play online choice.
- `npm run build`: passed, including both new routes and the device-download manifest. The Penalty Cup offline HTML is approximately **8.9 MiB**, with fonts, character atlases/masks, local audio and physics embedded.
- Targeted `git diff --check`: passed.

## Rules and persistence coverage

All 48 selections have three unique group opponents. Tests cover every one of the 495 official third-place routing combinations, head-to-head mini-tables and reapplication, group draws, five kicks per side, early knockout clinch and paired sudden death. Every nation completes an eight-match championship path in controller tests; completed tournaments settle all 104 fixtures. An additional 300 seeded group simulations verify unique knockout participants and correct group separation.

Losses remain pending until accepted or retried. Retrying preserves opponent/difficulty and changes the attempt seed without rerolling other results. Completed matches checkpoint before the replay/result screen is left. Duplicate settlement, seed restoration, corrupt-save preservation, unavailable storage and account isolation are covered. Random Game does not change cup progress or award economy rewards.

The shared renderer's optional national-color kit mode uses the existing source clothing masks. Default Penalty Shootout behavior and source animation timing are retained. See `PENALTY-CUP.md` and the asset provenance notices for factual-data and artwork sources.

## Review evidence and limits

Current reports: `test-results/penalty-cup/browser-validation.json` and `test-results/penalty-cup/app-validation.json`. Review screenshots in the same folder cover desktop home/hub, actual shot results, portrait home/gameplay/keeping, landscape keeping, rematch decisions, champion bracket, and the real app's restored portrait cup. Earlier failure captures are retained as diagnostic history; the current reports above describe the final verified run.

Physical-device touch performance, real gamepad hardware and audible mixing on device were not tested. Keyboard/touch browser input and the existing simulated gamepad adapter tests passed. Small national flags use original vector drawings with simplified emblems. Existing character-art permission/provenance notices remain intact. Cup results are original gameplay, not historical World Cup results.
