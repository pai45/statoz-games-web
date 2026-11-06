import localFont from "next/font/local";

/**
 * Rally Dash's own type, separate from the StatOz system: Rubik Dirt for the wordmark and
 * stage names, Barlow Condensed for timing boards and the interface. Both are SIL OFL 1.1;
 * the licences sit next to the files in ./fonts.
 */
const display = localFont({
    src: [{ path: "./fonts/rubik-dirt-latin-400-normal.woff2", weight: "400", style: "normal" }],
    variable: "--rd-font-display",
    display: "swap",
    preload: false,
    fallback: ["Impact", "Arial Black", "sans-serif"],
});

const ui = localFont({
    src: [
        { path: "./fonts/barlow-condensed-latin-600-normal.woff2", weight: "600", style: "normal" },
        { path: "./fonts/barlow-condensed-latin-700-italic.woff2", weight: "700", style: "italic" },
        { path: "./fonts/barlow-condensed-latin-800-italic.woff2", weight: "800", style: "italic" },
    ],
    variable: "--rd-font-ui",
    display: "swap",
    fallback: ["Arial Narrow", "Arial", "sans-serif"],
});

/** Class names that define both font variables on the game's root. */
export const rallyFonts = `${display.variable} ${ui.variable}`;
