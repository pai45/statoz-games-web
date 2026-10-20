# StatOz design system

This directory is the single source of truth for StatOz visual language and
reusable interface components.

```text
design-system/
|-- tokens/       # Colors, spacing, and typography definitions
|-- styles/       # CSS custom properties consumed by the application
|-- components/   # Reusable, product-agnostic React components
|-- icons/        # React icon wrappers and icon-specific helpers
`-- index.ts      # Public design-system API
```

## Component ownership

A component belongs here when it is reusable across features and does not know
about matches, picks, games, profiles, or other product domains. Examples are
buttons, inputs, search bars, alerts, cards, dialogs, tabs, and tooltips.

Feature-aware compositions stay in `src/features/<feature>/components` even
when they are assembled from design-system components.

## Rules

- Use tokens instead of hard-coded color, spacing, or typography values.
- Import from `@/design-system` or a component's public entry point.
- Keep components accessible, responsive, and independent of application data.
- Add component tests next to the component when implementation begins.
- Do not import from `src/app`, `src/features`, `src/domain`, or `src/server`.

## Editorial discovery

Use `components/data-display/discovery-card` for plate chrome, lifecycle tags, outcome rows, team labels, progress and VS. Sport/data/navigation adapters stay in features/matches. See `docs/discovery-card-library.md`; `npm run discovery:check` verifies the shipped library.
