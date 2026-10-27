# F1 Racing — Crazy Grand Prix official embed

Maintained in `src/features/games/f1-racing`, launched at `/play/f1-racing` and listed under Motorsport. The user requested the full Crazy Grand Prix game under this catalog name. This integration launches the original game through `https://www.crazygames.com/embed/crazy-grand-prix`, preserving its original title, UI, modes, vehicles, circuits, artwork and provider services.

## Important operating limits

- **Internet and keyboard driving are required.** Published controls: W/Up accelerate, S/Down brake, A/Left and D/Right steer, C camera and B look back. Native menus accept pointer/touch input. No cross-origin touch-driving bridge is available; there are no nonfunctional simulated pedal buttons.
- The host supports landscape framing, handheld/full-screen presentation, fullscreen where browser policy permits, Reload and Exit. Use the **native in-game pause button** before opening display settings or leaving a race. A host overlay cannot pause an independently hosted Unity runtime.
- Progress, account services, advertising and multiplayer belong to CrazyGames/the game provider. They are not isolated by StatOz account and are not claimed to work offline. Browser third-party storage settings may affect persistence. Host display preference alone uses the existing StatOz account-specific bundle store.
- Multiplayer connectivity, a complete career, purchases/upgrades and long-term cloud storage have not been verified. The original game menus remain available; this is not a promise that every external service operates in this environment.

## Why the official embed

The researched Unity 2022.3.11f1 build initially loaded locally but reported `SiteLock v1.8.0 activated ... Code 3`. Local execution is refused. The lock was not removed, spoofed or bypassed. The temporary local SDK/input/decompression experiment and proprietary runtime payloads were removed from this maintained checkout. Original acquisitions and research records remain in Designer for provenance. No Unity source project was available.

Only the authored React/CSS host and metadata are bundled here. The original engine/assets are served by their original host. No third-party cover artwork is bundled; the catalog uses the project-owned Grand Prix Dash cover. F1 Racing is the user-requested label and does not imply Formula 1 affiliation.

## Integration details

The official embed redirects from `www.crazygames.com` to `games.crazygames.com` and creates a native frame on `crazy-grand-prix.game-files.crazygames.com`. Unity calls `navigator.getGamepads()` even when driving with a keyboard. Input permissions therefore need to pass through the source bundle frame, the external embed and, on phones, the mobile landscape frame. This integration explicitly delegates the gamepad feature across those origins for F1 Racing. It does not request a connected gamepad or claim tested controller support.

The external URL is fixed; no arbitrary URL, script or account credential is accepted. Exiting disposes the bundle and its external iframe. Error/timeout messaging offers Reload and a link to the original embed. No host result records are fabricated from an inaccessible native engine.

Build/check commands: `npm run build:f1-racing`, `npm run test:f1-racing`, `npm run test:f1-racing:browser`, `npm run lint`, `npm run typecheck`, `npm run test:device-assets`, `npm run build:pages`.

On 27 October 2026, the project owner authorized publishing this official embed on GitHub Pages.
