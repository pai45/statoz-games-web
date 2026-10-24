# Pitch Rush mobile adaptation

Maintained target: StatOz Future Games Web only. Independent football cabinet art direction; the cover is illustration only, with no game title. The interface carries the name.

The original 60 Hz deterministic football simulation, assisted ground passes, charged shots, aftertouch, formations and CPU are retained. Mobile adaptations are original decisions, rather than claims about upstream behavior:

- Default match duration is two 45-second halves on touch devices; the player can choose longer matches. Normal CPU remains the default.
- A 480-pixel logical playfield on mobile makes players larger than fitting the desktop 620-pixel-high image into a phone. Width follows the available landscape area. The existing landscape host supports portrait-held phones by rotating a real inner browser viewport.
- The joystick and Attack, Defence, Switch and Pause buttons occupy side rails, outside the playable pitch. Movement plus either action uses independent captured pointers. The two right buttons are Attack (tap to pass; hold/release to shoot with the ball) and Defence (slide tackle without possession). The optional Switch button sits above the left joystick. A held action cannot turn into the other action after a possession change. Tap/hold and aftertouch retain the same simulation inputs as keyboard and gamepad play.
- The initial menu keeps mode, CPU level, duration and Kick Off prominent. Audio, commentary, offside, lineups, controls and scores remain under Options & tactics. Touch users see a concise control guide.
- Pause, app backgrounding and loss of focus clear held keyboard/touch inputs and suspend audio. Resuming requires an intentional action. Canceled or lost pointer capture releases its input. Removing the game cancels its animation loop and closes audio.
- Losses and local two-player results have explicit Play again and Match setup buttons; no physical Enter key is required. Qualifying single-player scores keep the upstream touch initials entry and are saved by the account-scoped host.
- Online mode and remote scores are disabled in this offline edition. Local two-player mode needs a keyboard or two gamepads; the touch controls drive player one.

The original MIT vendor source is unchanged and hash checked. Build-time adaptations are in scripts/build-pitch-rush.mjs and src/features/games/pitch-rush. The self-contained bundle enters the existing versioned, hashed game manifest. No native Flutter import or release is part of this change.

Physical iOS/Android, hardware gamepads, audible output, browser-chrome interruptions and long-term match balance still require device testing.
