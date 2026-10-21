# Penalty Shootout 3D

Local implementation at `/play/penalty-shootout`. Next.js/React owns the lobby, HUD, settings and results; Three.js owns the scene; Rapier owns the 120 Hz ball/contact simulation. Input, simulation, rendering and audio remain feature-local. No server, account service or multiplayer backend was added.

## Playing

- Shoot: press in the centre composure window, hold to charge, release for the run-up. Aim with WASD, the left gamepad stick or the touch stick. Holding aim past the opening can miss. `1/2/3` selects Driven/Placed/Chip. Gamepad B/Circle shoots, RB places and LB chips.
- Keep: A/D or the left stick moves on the line. Arrow keys/right stick/right touch pad select a timed dive; Space/A/Cross holds centre. Inputs follow the current screen orientation.
- Five kicks each, an early finish when the trailing side cannot catch up, then paired sudden death. Player takes first. Practice shots/saves award no XP, coins, history or streak activity.
- Escape or Pause stops simulation and clears held inputs. Visibility loss and controller disconnection also pause. Resume is explicit. Losing a graphics context preserves the simulation and waits for restoration.
- Replays use stored transforms/clip times in the same renderer. Skipping or replaying cannot change a result or settle rewards again.

## Integration and public boundaries

`PenaltyShootoutProps` retains the existing launcher contract. New internal contracts live in `game-types.ts`: `ShotCommand`, `KeeperCommand`, `InputFrame`, `KickResult`, `Snapshot` and `Frame`. The old direction/rating renderer is no longer used by the mounted game. No deck or starter pack is required for this game.

The runtime is dynamically loaded by the client launcher. All models/audio are local and resolved through `publicAsset` for normal and `/statoz_web` static builds. Model/physics failures have a retry path; audio has independent mute/effects/crowd controls. The shared full-screen moment mechanism defers streak celebrations while the game/result owns the screen.

Progress retains `statoz.shootout.v1` and the existing career/XP readers. Older history rows remain readable. New history rows have stable session IDs and optional runtime version metadata. Completed matches keep the existing 50/10 coin reward and win-margin XP; the session ID deduplicates history and wallet settlement. Account-owned settings use `statoz.shootout.settings.v1` and participate in the existing account switch list. Replays are in memory only.

## Assets and reproducibility

The runtime manifest is `public/assets/games/penalty-shootout/manifest.json`, with source URLs, licences, adaptations, hashes and sizes. Blender Studio's realistic human base mesh is the CC0 foundation; StatOz authored the rig, skin weights, garment materials, gloves and football clips. The crowd is the CC0 recording **Stadium Crowd** by stomachache; effects are original deterministic synthesis. No reference-game assets are bundled.

Editable source: `assets/athlete-source.blend`. Blender 4.5.9 LTS was used. The saved file contains the rig, materials and 16 named action clips. Their contact event is 1.0 seconds; aiming locks at 0.9 seconds. `TAKER` is the measured boot-placement calibration shared by rendering, simulation and the geometric contact regression.

To regenerate from the original official human-mesh bundle:

```text
blender --background --factory-startup --python build-athlete.py -- --source <human_base_meshes_bundle.blend> --output <asset-working-directory>
gltf-transform resample <asset-working-directory>/athlete.glb <optimized-athlete.glb>
```

The audio builder is retained as an editable synthesis recipe; it expects the source crowd preview in its local tools directory. Preserve the manifest's licence/source evidence when rebuilding. Sources/downloads and the reference footage stay in the local Designer work folder; only finished assets and editable authored source are copied to web.

## Verification

```text
npm run test:shootout
npm run test:shootout:e2e
npm run lint
npm run typecheck
npm run build
npm run build:pages
```

The browser suite expects a running local web app at port 3138 by default; `SHOOTOUT_URL` overrides it. Set `SHOOTOUT_CHROMIUM` to use an installed Chromium, or install Playwright Chromium. Browser tests exercise desktop, 412×915 portrait, 915×412 landscape, simultaneous touch, training isolation, replay, a completed match, loading retry and context restoration. Physical phone/GPU performance and physical controller ergonomics require device testing. Headless browser sizes are not a substitute for those checks.

The separate `REFERENCE.md` records what the Vita manual documents, what the public recording shows and which tuning is original.

## Reference-led presentation update

See [BROADCAST_REVIEW.md](BROADCAST_REVIEW.md) for the detailed PC/PS4 video study, timestamped observations, implementation changes, screenshots and new validation. Runtime version: `football-broadcast-2`. The initial Vita-inspired mechanics remain the gameplay foundation; the game now uses its own conventional football interface and broadcast framing informed by the two user-supplied videos.

## Character and movement upgrade

See [character/reference notes](CHARACTER_ANIMATION.md) and the [validation report and review media](MOTION_VALIDATION.md). Editable source, asset provenance, both detail levels and the motion compiler are included locally.

## Current character realism pass

Runtime `character-motion-4`: [kit/character/movement notes](CHARACTER_REALISM_V4.md), [review video and final validation](MOTION_VALIDATION.md).
