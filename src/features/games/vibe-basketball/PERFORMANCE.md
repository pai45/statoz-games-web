# Mobile performance — 24 October 2026

The ordinary phone launch previously inherited desktop rendering: up to 2× device resolution in each dimension, bloom post-processing, real-time 2048px shadow maps, physical glass transmission and four spotlights. The contest rebuilt its 27 shot indicators and tournament display on every frame, and the integration repeatedly rewrote unchanged UI attributes/text. Earlier layout tests used the source's lite flag, so they did not represent the normal launch's graphics load.

Mobile Auto now uses one renderer pass with bounded resolution (at most 1× CSS pixels / 650,000 drawing-buffer pixels), no bloom/shadow buffers or multisample antialiasing, cheaper alpha glass and two retained spotlights. Static environment meshes sharing a material are merged, preserving independently hidden fences and blinking beacons. Small athlete geometry uses fewer radial subdivisions while retaining the original skeleton and animations. Overlay backdrop blur is disabled in this profile.

HUD updates are cached by displayed state; the source shot meter still updates each simulation step. Graphics adaptation monitors frame intervals and can reduce resolution to 0.65× after sustained slow frames, with cooldowns. It does not skip or advance simulation, alter input timing, or change contest clocks/rules. Hidden debug strings are not assembled unless the debug overlay is on.

Pause → Graphics cycles Auto → Performance → High. Performance starts at 0.8× with a 450,000-pixel budget and can adapt down; High retains the desktop renderer and 2× pixel ratio. The choice stays in the game's URL across mode navigation. Changing the graphics setting restarts the game. Desktop Auto retains High graphics.

## Local before/after measurement

Same 844 × 390 CSS viewport, 3× emulated device scale, normal launch without lite, 2.5-second sample after warmup, both modes. Headless Windows Chrome uses SwiftShader; this is a local rendering-work comparison, not a physical mobile GPU benchmark or a guaranteed phone FPS result.

| Mode | Mean frame callback work | Mean drawing calls/frame | Drawing buffer |
| --- | --- | --- | --- |
| 1v1 | 8.1 → 3.5 ms | 329 → 94 | 1688 × 780 → 844 × 390 |
| three-point | 14.0 → 6.4 ms | 479 → 143 | 1688 × 780 → 844 × 390 |

The contest callback work decreased by about 54%, drawing calls by about 70%, and canvas pixel count by 75% in this sample. The static batches alone remove 44 environment drawing calls. Mutation records fell from 2,196 to 43 in the contest sample. Numbers vary with animation, game phase and host load; rerun the harness for comparisons.

## Reproduction and checks

- npm run build:vibe-basketball
- npm run test:vibe-basketball (source integrity, catalog and graphics policy)
- node scripts/verify-vibe-performance.mjs (ordinary phone default, actual renderer flags, adaptive resolution without advancing the game clock, live HUD/clock, Graphics override, desktop High)
- node scripts/verify-vibe-mobile.mjs (six sizes, normal Auto path without lite, no overlaps, touch gestures)
- node scripts/verify-vibe-basketball.mjs (existing input/pause and upstream contest probes)
- Build the export, then node scripts/verify-vibe-extra.mjs (actual host launch, safe areas, mobile renderer choice, exit, retry and upstream smoke).
- node scripts/benchmark-vibe-basketball.mjs writes a new after sample. Set VIBE_BENCH_LABEL to select a separate report; retain before.json as the historical baseline.

Raw reports and captures: test-results/vibe-basketball/performance/. Physical Android/iOS, thermal throttling and long-session phone FPS remain unverified. Keep the changes local until a separate release request.

The resolution budget follows [Three.js guidance on high-DPI rendering and drawing-buffer limits](https://threejs.org/manual/pages/responsive.html).
