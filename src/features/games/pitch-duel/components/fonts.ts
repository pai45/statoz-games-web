import localFont from "next/font/local";

/**
 * Pitch Duel's own type, separate from the StatOz system: Bebas Neue for card
 * numbers, Barlow Condensed for labels and buttons, Inter (heavy and italic)
 * for display words such as VS and GOAL. All three are SIL OFL 1.1; the
 * licences sit next to the files in ../fonts.
 */
const numbers = localFont({
  src: "../fonts/bebas-neue-latin-400.woff2",
  weight: "400",
  style: "normal",
  variable: "--pd-font-numbers",
  display: "swap",
});

const labels = localFont({
  src: [
    { path: "../fonts/barlow-condensed-latin-500.woff2", weight: "500", style: "normal" },
    { path: "../fonts/barlow-condensed-latin-600.woff2", weight: "600", style: "normal" },
    { path: "../fonts/barlow-condensed-latin-700.woff2", weight: "700", style: "normal" },
    { path: "../fonts/barlow-condensed-latin-800.woff2", weight: "800", style: "normal" },
  ],
  variable: "--pd-font-labels",
  display: "swap",
});

const display = localFont({
  src: [
    { path: "../fonts/inter-latin-variable.woff2", weight: "100 900", style: "normal" },
    { path: "../fonts/inter-latin-variable-italic.woff2", weight: "100 900", style: "italic" },
  ],
  variable: "--pd-font-display",
  display: "swap",
});

/** Class names that define the three font variables on the game's root. */
export const pitchDuelFonts = `${numbers.variable} ${labels.variable} ${display.variable}`;
