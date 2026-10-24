# Vibe Basketball

Faithful import of mike007jd/vibebasketball at `184a5b27ee259869744f0b32de9954ab7983c1bb` (MIT). The upstream baseline is in `vendor/vibebasketball`; `SOURCE.json` records hashes checked before every build. It includes 1v1 and a four-shooter 3-Point Contest with 1–4 local players. No host rewards or economy integration is added.

Run `npm ci --prefix vendor/vibebasketball` once after checkout, then `npm run build:vibe-basketball`. Development, production and Pages prebuilds regenerate the local bundle. Three.js stays at the source's `0.170.0` inside the isolated dependency tree. The build adapts source in memory; vendor files remain unchanged. Relative script, style and GLB paths support subdirectory hosting. No remote assets are needed at runtime.

The host route `/play/vibe-basketball` uses the existing game launcher and login gate. The iframe owns its original mode menu, navigation and reload behavior. Messages validate origin, frame, protocol, game and launch session. The adapter supplies error reporting, pause/resume, audio suspension and exit; removing the iframe releases its runtime. Gameplay and UI styles stay independent of the StatOz visual system.

Touch: left analog movement joystick; right shoot button (hold/release, tap fake, block on defense); sprint plus contextual attack/defense actions. Dribble accepts a tap or directional swipe; swipe and hold for a finish. The extra arrow pad is removed. Contest mode only shows shooting. Keyboard/gamepad remain supported; the Touch toolbar button toggles the overlay. Modes, setup, money racks, CPU skip, rematches and pause are touch accessible. Controls clear on cancellation, blur and rotation. Backgrounding pauses and requires explicit resume.

Validation: `npm run test:vibe-basketball`, `npm run test:vibe-basketball:browser`, lint, typecheck, production and static builds. Build a static export with `node scripts/build-github-pages.mjs` before the browser command; its second runner serves `out` to test the actual host application. Browser evidence goes in `test-results/vibe-basketball`. The checks cover five viewport sizes, real simultaneous touch pointers, canceled input, rotation, simulated backgrounding, pause stability, both modes, subdirectory assets, source input timing, login, launch/exit, error recovery, and both upstream smoke and comprehensive contest probes against the built game. Physical iOS/Android hardware checks remain manual. See `VALIDATION.md` for the completed run.

## Character design v2

Local procedural art in `character-design.js` replaces the repeated head/headband with named hair silhouettes, visible eyes and brows, shaped faces, kit piping, wristbands/compression accessories and sneaker laces. The original skeleton, skin-weight solver, hand contacts and animation code remain unchanged. The build applies the art extension in memory; the vendor baseline is preserved. Front/back jersey marks now sit on the correct sides of the torso. The Source & credits link is removed from the pause interface; original license and attribution files remain in the source and distribution.

## Mobile interface v3

Phones use a 44px score strip between Back and Pause. Mode/camera/touch settings live inside Pause. The contest progress panel is compact, and its release meter sits beside the shooting thumb with no overlap. 1v1 has one movement joystick and contextual actions: Sprint/Dribble/Spin/Shoot on attack, Sprint/Stance/Steal/Block on defense. Portrait 1v1 reserves a separate bottom control dock and resizes the renderer to the actual court surface. The portrait contest camera preserves the horizontal view inside the side fences. The host respects its visible viewport height and reserves parent safe areas outside the iframe. `node scripts/verify-vibe-mobile.mjs` measures control/HUD bounds during shooting and tests joystick-plus-dribble gestures at six sizes.

## Mobile performance

Normal phone launches now select a lightweight renderer automatically; no lite URL flag is needed. Auto bounds resolution and adapts it down if frames remain slow. Pause → Graphics offers Performance (lighter) and High (desktop effects); changing quality restarts the game. HUD updates are cached without reducing touch or simulation frequency. See `PERFORMANCE.md` for measured before/after costs, testing and physical-device limitations.
