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
