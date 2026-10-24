# Import validation — 23 October 2026

Source pinned to `mike007jd/vibebasketball@184a5b27ee259869744f0b32de9954ab7983c1bb`; baseline SHA-256 checks passed. Original code, MIT license and dependency notices are preserved. Three.js remains isolated at 0.170.0. The library card uses the upstream's actual gameplay capture, with its source recorded beside the image.

Passed:

- Full repository lint and TypeScript checks; final changed-file lint with no warnings.
- Three import/catalog/integrity tests, demo ownership test and three discovery regressions.
- Production build and static export with `/statoz-games-web` base path, including the generated play route.
- Original rules probe: five money-rack placements, 27 balls, 40 max points, deterministic CPU plans and official tiebreak rules.
- Original smoke assertions against the bundled game: procedural Rig/Animator athletes, valid play state, perfect-shot feedback, late-block protection and scoring. The bundle preserves constructor names for source diagnostics.
- Original comprehensive contest probe: menus/instructions, local setup, CPU watch/skip determinism, ball pool, qualification, elimination, 30-second advancement tiebreak, 70-second championship replay and champion result.
- Chrome responsive checks at 1440×900, 320×740, 390×844, 844×390 and 667×375; screenshots inspected and narrow setup/progress overlaps corrected.
- Actual multitouch pointer injection for movement plus shooting; canceled input clears held controls. Input checks distinguish quick fakes, committed shots, directional flicks and held finishes, and verify sprint/stance/spin/steal.
- Rotation, simulated document backgrounding, explicit resume and frozen simulation during pause.
- Actual exported host: existing basketball game retained, new card launches through the existing login gate, wrong-session messages rejected, exit removes iframe, failed module load surfaces Retry, and retry successfully starts the game.
- Runtime game requests stay local; contest props load under the subdirectory path. No character or animation-pack requests.

Evidence: `test-results/vibe-basketball/validation.json`, `extra-validation.json`, upstream logs and PNG captures. Headless Windows Chrome used software WebGL. Physical iOS/Android touch, browser chrome/safe-area behavior, hardware gamepads and audible output have not been verified on devices. Audio suspension is implemented; backgrounding was simulated in the regression harness.

No push, hosted build or deployment was performed. Existing unrelated edits were preserved.

## Character design v2 follow-up

Removed the Source & credits link from the pause interface; distribution and vendor licenses remain. Added original procedural faces, five hairstyle silhouettes, individual skin palettes, kit binding, player-name/number marks, shoe laces, wristbands and compression accessories. Corrected the source back-number placement, inverted shorts-seat winding, exposed upper-thigh gaps and chest overlays intersecting the jersey. The baseline source hashes still match the pinned import; original skeleton and animation/physics code are preserved.

Reviewed close-up and full-body captures for all four contest athletes plus Reyes, and confirmed the pause interface has no credits link. Evidence lives in `test-results/vibe-basketball/characters-v2`, including `review.json`. Full lint, typecheck, three integrity/catalog tests, production build, five-size responsive/multitouch checks and the original comprehensive contest probe passed after the update. The local server at port 3142 serves the revised bundle. Physical-device limitations above still apply.

## Mobile interface v3 follow-up

Replaced the overlapping phone HUD with a compact 44px score strip between Back and Pause. Mode, camera and touch settings are in Pause. The contest progress panel and thumb-adjacent shot meter remain separate from the shooting button. Removed the extra arrow pad from 1v1: one joystick moves, while a single Dribble button supports tap/swipe skills. Attack and defense actions are contextual. Portrait 1v1 reserves a bottom control dock; the portrait contest camera fits the court without side-fence occlusion.

The host follows the visible viewport, reserves native safe areas and adds a small landscape status-bar margin for webviews reporting zero top inset. Vibe Basketball alone enables viewport-fit=cover through route viewport metadata.

Passed full lint, typecheck, import integrity tests, production build, static export, the original contest and smoke probes, six-size measured overlap checks, joystick-plus-dribble multitouch, app launch/exit and retry. Exported-host checks passed for native viewport metadata, simulated safe areas, landscape status-bar spacing and visible viewport resizing. The resumed final targeted lint check also passed. Evidence: test-results/vibe-basketball/mobile-v3/validation.json and extra-validation.json. Physical iOS/Android testing remains unverified. Changes remain local; nothing was pushed or deployed.

## Mobile performance follow-up

Ordinary touch-device launches now use bounded resolution, a single renderer pass, reduced lighting/material cost and batched static scenery. HUD state changes are cached, adaptive resolution responds to sustained slow frames, and Pause offers Auto/Performance/High overrides. See PERFORMANCE.md for the measured before/after evidence and reproduction commands.

Passed six source-integrity/catalog/graphics-policy tests, renderer/adaptive-resolution probes, six-size responsive and multitouch checks, original contest probes, upstream smoke, actual exported app launch/exit, safe areas and failed-module retry. The retry fixture explicitly uses the download gate's Play online fallback with service workers blocked; the normal host test separately verifies a cache-enabled launch. Full TypeScript check, production build and static export passed. Full lint had zero errors and one unrelated existing unused roadworks warning in retro-circuit/data.ts. Physical Android/iOS GPU performance, thermals and long sessions remain unverified. No push or deployment.
