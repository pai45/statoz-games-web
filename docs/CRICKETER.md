# Cricketer

Cricketer is an editable Three.js batting-chase game in Future Games Web at `/play/cricketer`. Its game simulation and interface are original. Its players are low-poly remakes built from **Virat Kohli Cricket Batting Animation - Low Poly** (bhagathartworks, CC-BY-4.0), shown unnamed in original Cricketer kits. The installed Stick Cricket Chase game remains separate.

## Play

Use left/right arrows, A/D or the two touch buttons. Read the delivery line and tap just before arrival. Direction, length and timing select drives, cuts, pulls, hooks, sweeps and scoops. One press commits one swing. Running and fielding are automatic; misses/catches consume a delivery. Three academy lessons lead into twelve ball-limited chases across three tiers, starting at five runs from five balls. Win to unlock the next challenge; completed challenges can be replayed.

## Character design

Every player shares one 49-joint skinned low-poly body (`public/games/cricketer/cricketer-player.glb`), baked by `scripts/build-cricketer-player.mjs` from the downloaded Sketchfab source. The source body texture is photographic and the bat texture carries real brands, so neither ships: the bake reads the body texture only to sort faces into skin, hair, stubble, shirt, collar, sleeve, trousers and shoe regions, and `character.ts` paints Cricketer's own kit colours, back numbers and bat livery from those regions at runtime. Skin, hair and beard vary per player (`kits.ts`). Batters add an original helmet with grille, rolled pads and gloves.

The batter plays the model's own 6.9s batting cycle directly on its own skeleton; there is no retargeting. Each delivery runs relaxed → get set → high backlift → downswing → contact (1.14s in the clip) → follow-through → walk-off. Swing progress maps onto the cycle so the bat meets the ball at contact. Different deliveries shift the native swing by the ball's offset from the native contact point: a planted-foot crouch, a spine and lead-shoulder solve, and a wrist pivot, with the top hand re-gripping the handle. The bat snaps exactly onto the ball only in the final instant. A shot-direction lean shapes the follow-through toward the struck side. Poses crossfade when the role changes, so there are no snaps between stance, swing, run and celebration.

Bowling (run-up, gather, side-on stride, arm over the top, release, follow-through), running, walking back to the mark, fielding crouch and celebration are authored on the same rig, starting from the cycle's upright standing frame. The fielder nearest the landing spot chases the ball. The clip is sampled by direct track evaluation so every frame writes every animated bone.

`CREDITS.md`, `PLAYER-LICENSE.txt`, `PROVENANCE.json` and `characters-manifest.json` record the source, hashes and terms. See `CRICKETER-CHARACTERS.md` for the design record.

## Simulation and saves

The simulation runs at 120 fixed steps per second with seeded deliveries; the renderer does not consume simulation RNG. Timing windows, scoring bands and bowling profiles are authored tuning informed by the reference, not recovered C# formulas. Bat face and ball use a shared contact target. A boundary trajectory crosses the actual circular rope.

The existing bundled-game host supplies session validation, account isolation, local saves and result deduplication. The version-1 Cricketer save records lessons, unlocks, best scores, preferences, result identity and completed-delivery checkpoints/RNG continuity. An unfinished delivery is replayed on Continue. Incompatible saves remain preserved while temporary play is allowed.

Backgrounding or portrait orientation pauses play and releases input. Explicit landscape resume is required. Reduced camera motion keeps the batting camera during flight. Assets are bundled locally; there is no remote fallback. WebGL/load failure has a retry screen. The three tiers share an original oval with sky variations.

## Assets and local checks

The original oval uses a 20.12m pitch. The CC0 pavilion and wicket come from 3DAssets.dev; its training-ground mesh and shortened strip are not used. The Innerscene link remains reference only. Barlow Condensed is locally embedded with its OFL notice. The downloaded player source is kept unchanged outside the repository; only the baked, texture-free runtime player is committed. Rebuild it with `node scripts/build-cricketer-player.mjs <extracted source folder>`, which also refreshes `characters-manifest.json`.

- `npm.cmd run build:cricketer` verifies character hashes and builds the offline bundle.
- `npm.cmd run test:cricketer`, `npm.cmd run test:cricketer:characters`, `npm.cmd run test:cricketer:browser`, and `npm.cmd run test:cricketer:app` cover simulation, visual rig, gameplay and product integration.
- `npm.cmd run preview:cricketer` serves the isolated local preview at `http://127.0.0.1:5254/fixture`.
- `npm.cmd run typecheck`, `npm.cmd run lint`, `npm.cmd run build`, and `npm.cmd run build:pages` are local validation/build commands; none publishes.

Character close-ups are under `test-results/cricketer-characters/closeup`; gameplay evidence is under `test-results/cricketer`; exported-app evidence is under `test-results/cricketer-app`. Deliberately refresh the actual gameplay cover with `CRICKETER_CAPTURE_COVER=1`, then rebuild so device-manifest hashes stay consistent. Physical Android/iOS acceptance remains pending. No Flutter synchronization is included.
