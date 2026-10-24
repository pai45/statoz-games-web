# Pitch Rush

Independent arcade football adaptation of markclausing/websoccer at e3628948208c4c89c781e86068d20320169f9fe5 (MIT, Mark Clausing). Vendor bytes remain unchanged and hash-checked on build. The game retains its original simulation, 60 Hz timing, procedural pixel art, synthesized audio, CPU difficulty, keyboard/gamepad/touch inputs, formations and local two-player mode.

The title, cover, menu treatment and host lifecycle are the adaptation. Original generated cover provenance and prompt: public/games/pitch-rush/cover-source.json. No real teams, athletes or endorsements.

Launch /play/pitch-rush from the football library. Uses the existing authenticated BundledGame host, versioned offline manifest, account-scoped local saves, validated bridge and mobile landscape viewport. No rewards are granted. The bundle can be reviewed through the existing Flutter import workflow; this change does not import it into Flutter.

Online mode is disabled in this offline edition. No upstream public relay, shared scores, Discord service or hosted integration is contacted. CPU and local two-player matches work without a server. Two-player mode requires a keyboard or gamepads; touch controls drive player one.

Build: npm run build:pitch-rush. Checks: npm run test:pitch-rush, vendor simulation/UI tests, lint, typecheck and production build. Physical mobile devices, gamepads and audible output require manual acceptance testing.
