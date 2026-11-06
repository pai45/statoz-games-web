# figma-make-app

React + Vite + Tailwind CSS project running inside Figma Make.

## Development Server

A Vite development server is **already running** on `$PORT` (default 8443). You don't need to start it manually.

- Preview URL: The user can access the running app through the preview panel
- Hot reload: Changes to source files are reflected immediately

## Project Structure

This is the canonical project structure. Start with task-relevant files below. Only follow imports or inspect other files when required, when a documented path is missing, or when the repository contradicts this guide.

- `src/main.tsx` - React entrypoint; imports `src/index.css` and mounts `src/App.tsx` into the `#root` element
- `src/App.tsx` - Primary application component and the usual starting point for UI work
- `src/index.css` - Global CSS entrypoint and Tailwind CSS v4 import
- `index.html` - Vite HTML shell containing the `#root` element and loading `src/main.tsx`
- `package.json` - Project dependencies and the Vite build, development, preview, and formatting scripts
- `vite.config.ts` - Vite configuration with React, Tailwind CSS v4, and Figma Make plugins plus the `@` alias for `src`
- `.mise.toml` - Toolchain versions for Node.js and pnpm
- `src/game/` - Hoop Legacy 3D basketball engine (three.js): `engine/` (renderer, quality presets, post stack, floor reflection, camera rig, input, procedural audio with a rendered crowd bank and arena reverb, commentary booth with captions in `commentary.ts`, effects), `world/` (arena, hoop + net sim, ball physics, procedural skinned characters, animation), `sim/` (match rules: pro moves, pump fakes, alley-oops, putbacks, fouls and FIBA 3x3 free throws, hot streaks; AI with pick-and-roll in `ai.ts`; broadcast presentation in `director.ts`; shooting model, instant replays, 3PT contest, menu showcase)
- `src/game/world/character/` - Procedural athlete pipeline behind `world/Character.ts`: SDF sculpting + surface-nets meshing (`sdf.ts`), anatomy and skin weights (`body.ts`), rig with auto-driven clavicles (`rig.ts`), uniform shells (`garments.ts`) and prints (`prints.ts`), hands, shoes, head/face sculpt + painted face texture, hairstyles, shader-patched materials (`materials.ts`), and cached/LOD build assets (`assets.ts`). Geometry is authored at unit height in an A-pose and the rig is scaled to the player's height
- `src/data/` - Attributes, archetypes, badges, generated teams/rosters, and the career-mode logic (`career.ts`)
- `src/state/` - App store (screens, settings, active career) and localStorage persistence (3 career slots, settings, records)
- `src/ui/` - React screens and HUD: `screens/` (title, menus, quick play, contest setup, settings, results), `game/` (in-game HUD, broadcast lower-thirds and captions in `Broadcast.tsx`, touch controls, pause), `career/` (slots, player creator, hub, draft, free agency)
- `.claude/skills/` - Installed agent skills (UI/UX design, game development, motion/animation). See `.claude/SKILLS.md` for the list and sources; read a skill's `SKILL.md` before a matching task

## Dependencies

- Runtime: React 19 and React DOM 19
- Styling: Tailwind CSS v4 with the `@tailwindcss/vite` plugin
- Build tooling: Vite 8, TypeScript 5.7, and `@vitejs/plugin-react`
- Formatting: oxfmt

## Styling

This project uses **Tailwind CSS v4** through the `@tailwindcss/vite` plugin configured in `vite.config.ts`. `src/index.css` imports Tailwind with `@import 'tailwindcss';`. Use Tailwind utility classes directly in JSX and put global CSS or Tailwind v4 theme customization in `src/index.css`. This scaffold does not need a Tailwind config file or PostCSS config.

`src/main.tsx` imports `src/index.css`, so global font wiring belongs in `src/index.css`. Keep CSS `@import` statements first, then add any `@font-face` rules and font-family defaults there.

Tailwind emits utility classes in `@layer utilities`, and CSS outside any cascade layer overrides every layer regardless of specificity. Put global element styles, such as resets and defaults for `body`, headings, `button`, or `input`, inside `@layer base { ... }` so utility classes on those elements still apply. Tailwind's Preflight already applies `box-sizing: border-box`, removes default margins, and sets `font: inherit` on form controls, so do not repeat those rules.
