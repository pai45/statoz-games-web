# Design-system components

Organize reusable UI by purpose:

- `actions`: buttons and other direct actions.
- `forms`: input fields, search bars, selects, checkboxes, radios, and textareas.
- `feedback`: alerts, toasts, progress indicators, and skeletons.
- `data-display`: cards, badges, avatars, tables, and stat displays.
- `navigation`: tabs, breadcrumbs, pagination, and navigation controls.
- `overlays`: dialogs, drawers, popovers, and tooltips.
- `layout`: stacks, containers, grids, and dividers.

Each implemented component should use its own kebab-case directory:

```text
input-field/
|-- input-field.tsx
|-- input-field.test.tsx
|-- input-field.types.ts
`-- index.ts
```

Components must consume design tokens, include accessible labels and states,
and avoid feature-specific data or behavior.
