# Pitch Rush validation — 2026-10-24

Pinned MIT source: markclausing/websoccer@e3628948208c4c89c781e86068d20320169f9fe5. Every vendor hash and the original notice were checked. All four upstream suites passed, including deterministic matches, rules, local input, UI, network and worker tests.

The final offline game build and three integration tests passed. Product-boundary and mobile-viewport unit checks passed. Full lint passed with unrelated warnings; the owned integration files were also checked separately.

Browser evidence: test-results/pitch-rush/report.json and PNGs. Five sizes: 1280×800 desktop; 844×390 and 740×360 phones; 393×851 portrait phone using the actual rotated viewport; 1180×820 tablet. Checks cover complete canvas bounds, controls outside the field, native simultaneous movement plus held kick and cancellation, pause/tick stability, input clearing on interruption, loss/rematch, win/initials, account-scoped saves and exit. Result screens were reached by controlled test-state changes; the original headless simulation suites cover match rules. No page errors or remote game requests were observed.

The final five-size browser pass used an isolated fixture with the maintained MobileGameViewport, MobileGameNavigationBridge and BundledGame components linked from this checkout, plus the final offline game bytes. Its library and sample-account entry are test fixtures. The full production application’s desktop launch, catalog, account saves, results and exit were exercised earlier. The mobile regression additionally caught and fixed a shared source-URL race during client navigation and measured canvas overflow; portrait taps are mapped through the real 90-degree host transform.

The shared app initially passed production build and typecheck. A later concurrent Pitch Duel refactor removed src/features/games/pitch-duel/state/pitch-duel-progress.ts and types.ts while index.ts still re-exported them, so the final shared production rebuild is blocked by those unrelated missing modules. No Pitch Duel source was changed to mask that failure. After that refactor is complete, run the full build/typecheck again; its device manifest will regenerate the final bundle hashes automatically.

Physical iOS/Android, hardware gamepads and audible output remain unverified. Online relay play is disabled in this offline edition. No native Flutter import, commit, push, pipeline or publication was performed.

## Separate mobile actions

2026-10-24: added a left movement/aim joystick and separate right-side Attack (tap pass; hold/release shot) and Defence (slide tackle) buttons. Manual Switch sits above the joystick. Both action buttons keep their own pointer capture and possession eligibility, and the held touch input is checked at every simulation input poll so a turnover cannot turn Defence into a shot or Attack into a slide. Keyboard/gamepad input and the original vendor simulation remain unchanged.

The updated offline bundle, all three integrity/catalog tests and targeted lint passed. Browser checks passed at all five recorded sizes, including portrait rotation, full canvas bounds, simultaneous joystick/action input, charged shot release, slide tackle, wrong-context button rejection, turnover while holding Defence, canceled pointers, pause/resume, results and asynchronous account saves. Screenshots and report are in test-results/pitch-rush. Browser cleanup required the runner's bounded Windows Chrome shutdown. No page errors or remote game requests were recorded. Physical device testing remains unverified; the shared app rebuild limitation above still applies.

## Slower play and manual aim

Updated offline build and all 16 integrity/gameplay tests passed. Direction cases cover short passes and charged shots up/down/left/right/diagonally, holding beyond maximum power without firing, neutral-stick aim retention, changing aim on release, exact velocity without inherited sideways drift, and possession loss. Targeted lint passed. Native simultaneous touch was verified against the actual self-contained mobile bundle: turn the joystick from up to right while holding Attack, release Attack independently to pass; repeat at full power for a shot. Measured rate: 44.22 simulation ticks per wall-clock second (target 45, compared with 60 originally). Both rightward kicks had zero vertical velocity. Visual inspection confirmed the aim arrow. Evidence: test-results/pitch-rush/aim. The pre-existing shared-app build limitation and physical-device limitations above remain.

## Lobby layout

2026-10-30: the match-setup menu is restructured into a header (back button, title, tagline), a Match setup group (equal-width Mode, CPU skill and Match length controls, plus a touch-only Stick/Attack/Defence key), one accordion for How it plays and Options & tactics, and a pinned Kick Off footer. How it plays now carries the touch guide, so it is no longer empty on touch devices. Phones held sideways use two columns, so setup, extras and Kick Off fit without scrolling at 844×390, 740×360 and 667×375. Exit moved from the menu footer to the header (`#exitGame`); the pause menu keeps its Exit button.

Gameplay tests (13) passed and the production build passed. The browser check passed at all five sizes after two outdated harness assumptions were bypassed in a scratch copy: the guest "LOG IN TO PLAY" gate no longer exists in the app, and the host now loads the game from a URL instead of an `about:srcdoc` frame. The catalog unit test still fails on an unrelated assertion (`retro-football` is no longer in the football deck).
