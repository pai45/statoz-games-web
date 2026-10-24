# Device game downloads

Production builds download game files before mounting any app route. The screen
shows completed bytes and supports retry/resume or an explicit online fallback.
Development skips this gate and does not register a service worker.

`npm run build` and `npm run build:pages` build the embedded games and Next.js,
then generate `public/_game-assets/<build-id>.json` (also copied into Pages output).
Always use these build commands: running `next build` directly omits this step.
The compiled app requests its own build's manifest, avoiding mixed-version files.

`scripts/game-asset-manifest.mjs` owns asset selection. It includes embedded game
runtime dependencies, shared artwork, loose game models/audio, referenced shop
files, and Next static code/fonts. Videos, ads, unused shop originals, reference
directories, old loose Retro game bundles, and all shop player portraits are
excluded. Portraits remain available in the app and load on demand when needed;
they are not part of the required device download. The build prints the exact size.
Both deployment modes serve original image URLs (`images.unoptimized`) so card
portraits use these cached files rather than making image-optimizer requests.

The service worker uses four concurrent downloads and verifies SHA-256 and size
before storing each file. Content-addressed cache entries are shared across builds.
Each open document/iframe pins its build; obsolete entries are removed only when
no live client needs them. The worker never skips waiting or reloads a running game.
Vibe Basketball's session/build and known client-side mode/touch/attract settings
share cached HTML bytes; arbitrary query parameters remain significant. Cached audio
supports byte ranges. Application HTML, RSC responses, accounts and APIs are never
cached. Full offline navigation is not provided.

Browser storage persistence is best-effort. Clearing website data or browser
eviction requires downloading missing files again. Device caching removes repeat
network transfers; game code still needs time for decoding, WebGL and audio unlock.

Run `npm run test:device-assets` for manifest/cache regression tests. After a normal
production build, run `npm run test:device-assets:browser` for real Chromium checks
and mobile/desktop screenshots under `test-results/device-assets`. Set
`DEVICE_ASSETS_CHROMIUM` to override the default installed Chrome executable.
After `npm run build:pages`, run `npm run test:device-assets:browser -- --pages`
to test the exported app under `/statoz-games-web`.
