# Stadium Cricket validation — 22 October 2026

## Lobby presentation refresh

The lobby now follows the maintained 3D Penalty Shootout lobby composition: a full-screen original-game stadium capture, left-aligned wordmark and introduction, a three-cell capabilities row, one primary play action and compact expandable help/credits. StatOz tokens, type and controls are retained. No imported runtime or gameplay files changed.

Browser review passed at 1440px desktop, 412px portrait, 844px landscape and 320px narrow mobile, including overflow checks, keyboard disclosure activation, entering the original game and returning to the lobby. Updated screenshots are in test-results/stadium-cricket/lobby-refresh. Existing source-integrity, catalogue and save tests pass.

## Result

Implemented locally in Future Games Web. No push, hosted integration or publication was performed. Final Over is retired from the playable catalogue and launcher; its saves, historical progress readers and shared kit data remain.

## Source and gameplay

- Source: RealOmlit/CricketV2 at cb19e595d5a00a2764a6a5cb4b20fc48a2a733bc.
- All 15 upstream source/asset files pass the SHA-256 integrity manifest in vendor/cricketv2/SOURCE.json. Original game permission was confirmed by the user; existing third-party credits and Three.js r160 MIT notice are retained.
- Chromium parity comparison passed 19 scenarios: every role at every difficulty in two-over challenges, plus early victories configured for 5, 10 and 20 overs. Identical seeded random values and frame timestamps produced equal delivery choices, timing state, scores, wickets, striker changes, player figures, ball/camera positions and result text.
- The renderer was bypassed after initialization during simulation comparisons for speed. Actual rendering was inspected separately through screenshots and a recorded short innings. Longer configurations were checked through early finishes rather than complete 120-ball playthroughs.
- Source game files are unchanged. Integration lives in the outer lobby, packaging, account storage and host lifecycle adapter.

## Checks passed

- Seven focused catalogue, ownership, account-save, protocol and source-integrity tests.
- Full lint, typecheck, standard production build and subdirectory static-export build.
- Desktop, 412px portrait and 844px landscape visual inspection; no lobby horizontal overflow.
- Original game inside the StatOz host, completed short innings, saved configuration reload, account-switch remount, invalid-save preservation and frame removal on exit.
- Pause, keyboard camera control, sound toggle states, all five graphics preset selections and cancellation of animation callbacks on disposal.
- Old Final Over URL, subdirectory asset loading, original home-link reload and return to the cricket catalogue.
- Unavailable storage remains playable; write failures display a warning; unsupported WebGL displays a recoverable error.
- Recorded WebM decoded fully with FFmpeg 7.1 without errors.

## Evidence

Generated evidence is local and ignored by Git under test-results/stadium-cricket:

- validation.json: gameplay parity and hosted account/lifecycle checks.
- static-validation.json: subdirectory/mobile and failure recovery.
- lobby-desktop.png, lobby-412.png and lobby-844.png.
- original-desktop.png, completed-innings.png, static-game-mobile.png and static-game-landscape.png.
- video/: silent browser recording containing a complete short innings.

The actual game capture used by the lobby and catalogue lives in public/games/stadium-cricket/stadium-preview.jpg with a reference/provenance sidecar.

## Limits retained for iteration

Personal-best keys remain shared across roles, including defending modes, as in the source. Shot direction remains automatic, despite stale aiming instructions in the upstream README. No card gate, XP or coin awards were introduced. Audio toggle/lifecycle behavior was exercised, but audible output and loudness were not manually assessed. Physical-device frame rate, thermals and every graphics preset's visual fidelity have not been benchmarked.
