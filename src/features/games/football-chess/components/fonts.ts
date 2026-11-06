import localFont from "next/font/local";

/**
 * Football Chess's own type, separate from the StatOz system: Fraunces, a
 * soft old-style serif, for titles and scores, and IBM Plex Sans Condensed for
 * labels, odds and the move list. Both are SIL OFL 1.1; the licences sit next
 * to the files in ../fonts.
 */
const display = localFont({
  src: [
    { path: "../fonts/fraunces-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "../fonts/fraunces-latin-700-normal.woff2", weight: "700", style: "normal" },
    { path: "../fonts/fraunces-latin-900-normal.woff2", weight: "900", style: "normal" },
    { path: "../fonts/fraunces-latin-700-italic.woff2", weight: "700", style: "italic" },
  ],
  variable: "--fc-font-display",
  display: "swap",
});

const labels = localFont({
  src: [
    { path: "../fonts/ibm-plex-sans-condensed-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../fonts/ibm-plex-sans-condensed-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "../fonts/ibm-plex-sans-condensed-latin-700-normal.woff2", weight: "700", style: "normal" },
  ],
  variable: "--fc-font-labels",
  display: "swap",
});

/** Class names that define both font variables on the game's root. */
export const footballChessFonts = `${display.variable} ${labels.variable}`;
