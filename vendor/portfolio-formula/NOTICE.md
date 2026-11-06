# Formula — supplied portfolio race mode

This game is adapted locally, at the user's request, from Priyangshu's portfolio
code layer supplied through Figma:

- File: `RZuziAAke5pGi3yfKvXYMG`
- Node: `261:2`
- Reference: https://www.figma.com/design/RZuziAAke5pGi3yfKvXYMG?node-id=261-2
- Original source hashes: `SOURCE.json`

The supplied source carries no separate open-source license. Its inclusion is
limited to the user's requested adaptation; this notice does not relicense it
or assert third-party redistribution rights. Preserve source comments and
attribution. No other repository or original portfolio files are modified.

## Adaptation boundary

The supplied race simulation, procedural F1 car geometry, eight liveries,
circuit, physics, cameras, audio synthesizer and race interfaces are retained.
Portfolio-only pages, gallery/career scenes and personal contact information
are excluded. Case-study links become StatOz exit/selection actions. Track
boards use StatOz branding. Saved preferences and records use
`statoz.portfolio-formula.*` keys inside the host's account-scoped bundle store.

This is an independent local demo, not an official Formula 1 product.
Existing Racer and its assets/saves remain unchanged.

The local racing roster replaces portfolio project display names with original
car marques and fictional, racing-inspired drivers. Car decals and timing codes
follow that roster. Legacy slugs remain stable for saved personal bests; original
source hashes and attribution are preserved.

## Dependencies and fonts

Dependency versions are pinned in `package-lock.json`; original license files
ship with each installed package. Dependencies are isolated from the host app.
This build uses React/React DOM (MIT), Three.js (MIT), React Three Fiber/Drei
(MIT), React Three Postprocessing/Postprocessing (MIT), Zustand (MIT), Motion
(MIT), React Router (MIT), Maath (MIT) and Lucide (ISC).

Archivo and JetBrains Mono are self-hosted under the SIL Open Font License.
Their license texts and download hashes live in `src/assets/fonts/`. The
supplied Archivo Livery face is retained for canvas-drawn car decals.

The owner renamed the displayed game to Formula on 6 November 2026. Header,
track-board tagline, host title and cover were updated. The portfolio-formula
route, runtime id and save keys remain stable; original source hashes remain
historical provenance.

## Lobby and career adaptation ? 6 November 2026

The local adaptation adds original lobby, setup, career, and result screens;
three-race championships with four tiers; seeded grid ordering independent of car
selection; four procedural cosmetic paint variants; and original Harbor Run and
Switchback Ring layouts. Night Circuit retains the supplied plan. The existing
bicycle physics model remains intact; Expert adds a career-only rival preset.
Circuit selection now binds the renderer, timing, simulation, and minimap to a
shared track registry. Bests migrate to per-circuit records without deleting the
original save. Career progress stays in the host's existing local account scope.
Original source hashes are preserved as historical provenance, not rewritten to
claim the new adaptation was part of the supplied code layer.
