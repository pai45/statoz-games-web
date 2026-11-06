# Pitch Rush mobile adaptation

Maintained target: StatOz Future Games Web only. Independent football cabinet art direction; the cover is illustration only, with no game title. The interface carries the name.

The football simulation still uses fixed 60 Hz steps; wall-clock pacing is now 75% of the original. CPU, formations, aftertouch and charged kicks remain. Human passes and shots use direct chosen aim, without teammate snapping or movement momentum changing the release vector. Mobile adaptations are original decisions, rather than claims about upstream behavior:

- Default match duration is two 45-second halves on touch devices; the player can choose longer matches. Normal CPU remains the default.
- A 480-pixel logical playfield on mobile makes players larger than fitting the desktop 620-pixel-high image into a phone. Width follows the available landscape area. The existing landscape host supports portrait-held phones by rotating a real inner browser viewport.
- The joystick and Attack, Defence, Switch and Pause buttons occupy side rails, outside the playable pitch. Movement plus either action uses independent captured pointers. The two right buttons are Attack (tap to pass; hold/release to shoot with the ball) and Defence (slide tackle without possession). The optional Switch button sits above the left joystick. A held action cannot turn into the other action after a possession change. Tap/hold and aftertouch retain the same simulation inputs as keyboard and gamepad play.
- The initial lobby offers Career and Quick Match, plus Training, Settings and Exit. Quick Match keeps mode, CPU level, duration and Kick Off prominent. Audio, commentary, offside, lineups, controls and scores remain under Options & tactics. The first kick-off offers playable passing, defending and scoring drills; a coach strip and highlighted target/control guide touch players.
- Pause, app backgrounding and loss of focus clear held keyboard/touch inputs and suspend audio. Resuming requires an intentional action. Canceled or lost pointer capture releases its input. Removing the game cancels its animation loop and closes audio.
- Losses and local two-player results have explicit Play again and Match setup buttons; no physical Enter key is required. Qualifying single-player scores keep the upstream touch initials entry and are saved by the account-scoped host.
- Online mode and remote scores are disabled in this offline edition. Local two-player mode needs a keyboard or two gamepads; the touch controls drive player one.
- Career is four divisions of five-match seasons with fixed two-45-second halves, local cosmetic rewards and checkpoints. Career tables, fixtures, club cosmetics, trophies and history fit in compact landscape screens; cosmetics/history use pagination. Save & lobby and backgrounding preserve the match; Continue shows a Resume prompt. Held inputs and charged actions are cleared on restore.

The original MIT vendor source is unchanged and hash checked. Build-time adaptations are in scripts/build-pitch-rush.mjs and src/features/games/pitch-rush. The self-contained bundle enters the existing versioned, hashed game manifest. No native Flutter import or release is part of this change.

Physical iOS/Android, hardware gamepads, audible output, browser-chrome interruptions and long-term match balance still require device testing.

## Kenney artwork

2026-11-01: the game-owned rendering adapter uses the Kenney Sports Pack (CC0),
with rounded cream menus, blue/red team accents and matching text-free covers.
The existing landscape sizing, portrait host rotation, rail widths, pointer
capture and action bindings are retained. Sprites use linear Canvas sampling;
the atlas has gutters between source regions. All match artwork is embedded and
decoded before the runtime is initialized. Retry and exit remain available if
decoding fails.

## Slower play and manual aim

2026-10-24: gameplay advances at 75% speed. Hold Attack, aim with the joystick, then release. Short holds pass; longer holds shoot. The aiming arrow displays the selected direction while charging. Returning the stick to neutral preserves the last chosen direction; zero horizontal/vertical components remain zero. Charge caps at maximum power and waits for release. No automatic shot at maximum charge. CPU aim behavior is preserved. Match-clock simulation runs at the same reduced pace (the default two 45-second simulation halves take about two real minutes, plus stoppages).
