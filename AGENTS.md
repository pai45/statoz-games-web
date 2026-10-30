# Independent StatOz demo

This repository is a games demo/UI reference. Never write to the original card_game, statoz_web or another repository. Keep saves local and namespaced. Do not run cross-project synchronization. All inherited artwork is temporary with replacement planned; preserve source notices. No real payments, authentication or production economy is implemented.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## StatOz mock data

Before creating or changing StatOz demo fixtures, read `.codex/skills/statoz-mock-data/SKILL.md` and follow its ownership and validation rules.

## Retro Football independent style

User direction: Retro Football uses its own classic arcade identity. Follow the installed `independent-game-style` skill: no StatOz visual system, cyberpunk theme, techno fonts, chamfer panels or cyber HUD styling inside this game. The host product retains its existing styling.

## Pitch Duel independent style

User direction (2026-10-30): Pitch Duel is an eleven-a-side, portrait-first card football game with its own Ballers-inspired look (dark violet stadium panels, pink/cyan accents, tiered shield cards, Bebas Neue / Barlow Condensed / Inter). Do not restyle it with the StatOz system inside the game; the host keeps its styling. The Ballers repository is unlicensed: never copy its code, CSS, images, logo or audio — measure and redraw only. See `docs/PITCH-DUEL.md`.

## Penalty Shootout ownership

This repository is the canonical home for all future Penalty Shootout changes, per the user. The complete 3D game was transferred from statoz_web on 2026-10-21. Develop, test and maintain it here; do not sync changes back to statoz_web or edit Designer staging copies as the runtime source. Preserve local namespaced progress and account isolation.

## Retro Hoops asset agent

For Retro Hoops asset generation, modification, animation and Street Hoop likeness
work, delegate to one `street_hoop_artist` agent when delegation is available.
Its project role is `.codex/agents/street-hoop-artist.toml`. Read the canonical
`street-hoop-assets` skill in the Designer research workspace named by that role;
if custom roles or delegation are unavailable, the executing agent reads the same
role and workflow. Give it a concrete defect target and exclusive asset-file
ownership for the pass. Keep runtime changes here, preserve unrelated work and
Retro Hoops' independent arcade style, and keep builds local unless a separate
current release request authorizes a push/pipeline/publication.
