# Shared StatOz typography

`manifest.json` is canonical in StatOz Designer. It owns the font families,
logical sizes, weights, leading, tracking, semantic text styles, and game/artwork
presets. Space Grotesk is the body/control family (300–700); Orbitron is the
display/HUD family (400–900). Do not synthesize 800/900 body weights.

Run `npm run typography:sync` to regenerate this checkout. Run
`npm run typography:sync:all` from Designer to explicitly copy the manifest,
generator, font, and license into the neighboring web and Flutter repositories.
`npm run typography:check:all` checks their generated files and snapshots without
writing. Ordinary builds and checks use committed local files only and never
read a sibling checkout or fetch fonts.

Web: use `textStyle("body")`, `.ds-type-body`, or the generated
`--ds-type-body-*` properties. Primitive sizes and weights live in
`typography.sizeRem` / `typography.weight`; fixed SVG/canvas text uses `typography.sizePx`. UI CSS uses `--ds-size-*` (rem);
fixed export canvases use `--ds-canvas-*` (pixels). Sizes have the same numeric
value in CSS pixels at a 16px root and Flutter logical pixels. Browser zoom and
Flutter text scaling remain enabled. Keep responsive game/canvas scaling around
these shared base values rather than introducing a second size table.

Flutter: use `StatOzTypography.body`, `StatOzTypography.control`, or the generated
`textTheme`. Existing `AppTheme`/`Cyber` helpers adapt this library. Body helpers
clamp weight requests to 300–700. The former Games typography scope remains
compatible and now uses the same body family as Matches/Pick.

Font provenance, the exact SHA-256 and license hash are in the manifest. The
design-kit downloads include the manifest, CSS, TypeScript, Dart, font and OFL
license. Older captures and frozen exports remain historical artifacts.

Run `npm run test:typography` after producing the web/Designer Pages builds and the isolated Flutter preview (`tmp/typography-web`, base `/card_game/`). It captures desktop/mobile/enlarged-text specimens and verifies bundled fonts, offline compositions, and the local kit download.
