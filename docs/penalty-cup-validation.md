# Penalty Cup mobile validation - 31 October 2026

Maintained locally in Future Games Web at /play/penalty-cup. No Flutter changes, publication or deployment. This report supersedes the initial implementation report for the mobile changes.

## Passed checks

- 38 unit/integration tests: tournament, mobile checkpoints, viewport policy, discovery and device assets (tests/penalty-cup.test.ts, tests/penalty-cup-mobile.test.ts, tests/mobile-game-viewport.test.ts, tests/home-catalog.test.ts, tests/device-assets.test.mjs).
- 34 existing Penalty Shootout regression tests: npm run test:shootout. The original game's default physics, animation and match rules remain covered.
- 108 browser screen-fit checks across 667x375, 844x390, 852x393, 932x430, 568x280, 844x300 and upright 390x844. Menus, all 48 selections, groups, third-place table, paged results/bracket, final result and history fit the viewport without page scrolling or clipped controls. No page errors were recorded.
- Actual simultaneous touch aim/shoot, goalkeeper input, dive/recovery, pause, completed-penalty reload and account isolation passed in the offline-bundle browser suite. No difficulty selector remains.
- The local preview passed landscape rendering, upright-phone rotation and persistent v2 save/reload checks at http://127.0.0.1:3199. It serves the maintained offline bundle, with local-only browser storage.
- npm run build:penalty-cup passed. The embedded offline HTML is approximately 8.8 MiB, with local fonts, character atlases/masks, physics and audio.
- Scoped ESLint passed with no warnings or errors. Repository lint had no errors and three existing unused-variable warnings in .cache/f1-racing-phone-probe.mjs, .cache/shootout-fx/capture.mjs and src/features/games/retro-circuit/data.ts.
- Targeted git diff --check passed.
- Final npm run typecheck passed, including Next route generation and TypeScript.
- Final npm run build passed: production compilation, TypeScript, all 64 generated pages and the device-download manifest, including /play/penalty-cup.
- npm run test:penalty-cup:app passed against that production build: real play route, landscape layout, upright-phone rotation, account-scoped v2 save and reload. No page errors were recorded.

## Rules, save and animation coverage

The 72 unit/integration/regression tests include all 495 third-place routing combinations, head-to-head ties, group draws, complete championship/group-elimination/bronze journeys, early knockout clinch, paired sudden death, retry decisions and duplicate result settlement. Random opponents differ from the selected nation.

New checks cover RNG state restoration, the next actual CPU outcome after restoring a checkpoint, early goalkeeper tap buffering, centre high/low reach, low-dive stretch/landing/recovery sampling, v1-to-v2 migration, backup recovery and stale-write rejection. Browser reload preserves finished penalties and resumes the next keeping/shooting turn. Random Game does not alter Cup progress.

## Earlier environment retries

Earlier typecheck attempts reported unrelated Racer nx/nz property errors. The final repository typecheck passed after those concurrent changes settled; no Racer source was changed for this task.

An earlier full build met a concurrent Next build lock. The final full build passed after the other build finished. No other process or build lock was removed.

An earlier integration attempt against the existing Next dev server on port 3123 timed out; its log contained repeated write EPIPE errors. The final integration run passed against the freshly completed production build. The standalone compiled bundle and local preview also passed independently.

## Evidence and physical-device limits

Current evidence: test-results/penalty-cup-mobile/checks.json, preview-checks.json and app-checks.json. Screenshots include nations at each viewport, paged brackets, compact results, shooting, keeper push/stretch/recovery, pause, preview reload and the production app's restored landscape cup. A gameplay WebM is stored in the video subdirectory. app-failure.png is retained only as diagnostic history from the earlier dev-server timeout.

Browser viewport emulation does not establish physical iPhone Safari performance, audible mixing, notch behavior on every device or real gamepad hardware. Existing simulated input coverage is preserved. Asset permissions/provenance remain in public/games/penalty-cup/PROVENANCE.json and the Penalty Shootout character notices. Cup scores are original gameplay, not historical World Cup results.

See PENALTY-CUP.md for rules and sources, and penalty-cup-mobile.md for implementation details.
