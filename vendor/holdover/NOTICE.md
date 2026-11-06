# Holdover

Imported from the user-supplied `C:\Users\priya\Downloads\Create a 3D Cat` on 2026-11-06 for this independent local demo. The original game has no supplied standalone licence; this import does not claim an open-source licence for it. Source code, procedural artwork, synthesized audio and game interface are preserved. `package.original.json` and `pnpm-lock.yaml` retain the original dependency information.

Local integration changes: offline fonts, the StatOz isolated bundle bridge for local account-scoped saves and pause/disposal, and a Back to Archery button. The root project's React 19 and Three.js 0.186.1 build the port (the supplied manifest requested Three.js ^0.187.0).

Barlow and Barlow Condensed are supplied through Google Fonts under the SIL Open Font License. JetBrains Mono and its OFL notice are retained from the existing local Portfolio Formula font copy. Font licence texts live in `src/fonts`. React, React DOM and Three.js MIT notices are included in the generated game bundle notices. No external images, models or audio are loaded at runtime.
