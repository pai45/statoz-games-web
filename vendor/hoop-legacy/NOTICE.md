# Hoop Legacy local import

User-supplied React / Three.js / Tailwind game imported on 2026-11-06 from
`Downloads/hoop legacy`. No blanket license accompanied the supplied game source.
This import does not assign a new license to it. Original bytes and hashes are
recorded in SOURCE.json. The original source folder is unchanged.

`statoz/` is the local host adapter. `scripts/build-hoop-legacy.mjs` compiles the
source with small lifecycle patches in memory. Original Figma development
plugins are preserved as source but are not executed or distributed as runtime.

Retain `public/athletes/LICENSES.md` and `sources.lock.json`. The supplied pack
contains a smoke-test mesh, not a complete generated athlete library. The actual
runtime uses the supplied procedural Character implementation. No downloaded
replacement assets are required. Basis transcoders retain their embedded notices.

React, Three.js, Lucide and Barlow font notices ship in the game LICENSES.txt.
