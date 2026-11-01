# Pitch Rush

Independent arcade football adaptation of markclausing/websoccer at e3628948208c4c89c781e86068d20320169f9fe5 (MIT, Mark Clausing). Vendor bytes remain unchanged and hash-checked on build. The deterministic simulation uses a 60 Hz fixed step at 75% wall-clock speed. Synthesized audio, CPU difficulty, keyboard/gamepad/touch inputs, formations and local two-player mode are retained.

Artwork uses the [Kenney Sports Pack](https://kenney.nl/assets/sports-pack), CC0. Original selected files and license are retained in vendor/kenney-sports-pack; public/games/pitch-rush/sports-art.json records hashes, atlas rectangles, pivots, alpha bounds and keeper recolours. The renderer assembles top-down bodies and limbs with distance-driven running, heading rotation, kick and slide poses. Pitch geometry, collisions and camera follow stay on the existing simulation coordinates.

Both text-free covers use the same deterministic Kenney composition. Reproduce the atlas and covers with `python scripts/import-pitch-rush-art.py path/to/kenney_sports-pack.zip` (Pillow required). Cover provenance: public/games/pitch-rush/cover-source.json. No real teams, athletes or endorsements.

The cream/blue/red interface is game-owned. Runtime artwork is embedded in the offline bundle and decoded before inputs, rendering or ready signaling begin. A failed decode offers retry/exit; disposal during loading prevents initialization. No save migration or public interface change is required.

Launch /play/pitch-rush from the football library. Uses the existing authenticated BundledGame host, versioned offline manifest, account-scoped local saves, validated bridge and mobile landscape viewport. No rewards are granted. The bundle can be reviewed through the existing Flutter import workflow; this change does not import it into Flutter.

Online mode is disabled in this offline edition. No upstream public relay, shared scores, Discord service or hosted integration is contacted. CPU and local two-player matches work without a server. Two-player mode requires a keyboard or gamepads; touch controls drive player one.

Build: npm run build:pitch-rush. Checks: npm run test:pitch-rush, npm run test:pitch-rush:art, npm run test:pitch-rush:aim, npm run test:pitch-rush:browser, targeted lint, typecheck and production build. Physical mobile devices, gamepads and audible output require manual acceptance testing.
