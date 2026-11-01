# Cricketer

Cricketer is an editable Three.js batting-chase game in Future Games Web at `/play/cricketer`. Its game simulation and interface are original. Its redesigned players use the supplied **Indian Cricket Player Rigged** model and selected local Stick Cricket character motion, with new Cricketer kits, equipment and contact constraints. The installed Stick Cricket Chase game remains separate.

## Play

Use left/right arrows, A/D or the two touch buttons. Read the delivery line and tap just before arrival. Direction, length and timing select drives, cuts, pulls, hooks, sweeps and scoops. One press commits one swing. Running and fielding are automatic; misses/catches consume a delivery. Three academy lessons lead into twelve ball-limited chases across three tiers, starting at five runs from five balls. Win to unlock the next challenge; completed challenges can be replayed.

## Character design

`character.ts` replaces the earlier jointed body shapes with a continuous, 83-bone skinned player: modeled face, hands, clothing and footwear. The supplied mesh/face is attributed to numaan.k99 under CC-BY-4.0. Original national kit textures and sunglasses are not shown. Original Cricketer red/ivory and green kits, deforming shirt numbers, helmet/grille, segmented gloves, strapped pads, bat and iris/pupil details complete the design.

The retained Stick Cricket research has 51 native-curve-derived clips. Ten selected clips (six strokes plus stance, ambient, backlift and victory) are stored in `source-motion.local.glb`, with no native body meshes or textures. Runtime bone mapping preserves the supplied player's proportions. A compact contact pose, analytic two-bone arm IK and a planted-foot crouch keep the hands on the bat across low/high deliveries. Running, bowling and fielding use authored role poses on the shared skin. Static field/ready poses are reused to avoid needless updates.

This motion is an adaptation of material owned by Stick Sports. The conversion re-solves native curves through Unity2022 and does not reproduce Unity6000 controller/IK exactly. No independent redistribution license has been established for that motion, and the model's CC-BY license does not license it. The user has explicitly authorized this GitHub Pages release; that authorization is recorded separately from the source-license record. `CREDITS.md`, `PLAYER-LICENSE.txt`, `PROVENANCE.json` and `characters-manifest.json` preserve the separate sources, hashes and terms. See `CRICKETER-CHARACTERS.md` for evidence and design acceptance.

## Simulation and saves

The simulation runs at 120 fixed steps per second with seeded deliveries; the renderer does not consume simulation RNG. Timing windows, scoring bands and bowling profiles are authored tuning informed by the reference, not recovered C# formulas. Bat face and ball use a shared contact target. A boundary trajectory crosses the actual circular rope.

The existing bundled-game host supplies session validation, account isolation, local saves and result deduplication. The version-1 Cricketer save records lessons, unlocks, best scores, preferences, result identity and completed-delivery checkpoints/RNG continuity. An unfinished delivery is replayed on Continue. Incompatible saves remain preserved while temporary play is allowed.

Backgrounding or portrait orientation pauses play and releases input. Explicit landscape resume is required. Reduced camera motion keeps the batting camera during flight. Assets are bundled locally; there is no remote fallback. WebGL/load failure has a retry screen. The three tiers share an original oval with sky variations.

## Assets and local checks

The original oval uses a 20.12m pitch. The CC0 pavilion and wicket come from 3DAssets.dev; its training-ground mesh and shortened strip are not used. The Innerscene link remains reference only. Barlow Condensed is locally embedded with its OFL notice. The supplied player source files and original native character are kept unchanged; runtime copies/selected motion are separate files.

- `npm.cmd run build:cricketer` verifies character hashes and builds the offline bundle.
- `npm.cmd run test:cricketer`, `npm.cmd run test:cricketer:characters`, `npm.cmd run test:cricketer:browser`, and `npm.cmd run test:cricketer:app` cover simulation, visual rig, gameplay and product integration.
- `npm.cmd run preview:cricketer` serves the isolated local preview at `http://127.0.0.1:5254/fixture`.
- `npm.cmd run typecheck`, `npm.cmd run lint`, `npm.cmd run build`, and `npm.cmd run build:pages` are local validation/build commands; none publishes.

Character close-ups are under `test-results/cricketer-characters/closeup`; gameplay evidence is under `test-results/cricketer`; exported-app evidence is under `test-results/cricketer-app`. Deliberately refresh the actual gameplay cover with `CRICKETER_CAPTURE_COVER=1`, then rebuild so device-manifest hashes stay consistent. Physical Android/iOS acceptance remains pending. No Flutter synchronization is included.
