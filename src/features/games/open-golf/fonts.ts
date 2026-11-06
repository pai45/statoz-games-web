import localFont from "next/font/local";

/**
 * Open Golf's own type for the lobby, matching the in-game arcade shell: Rubik
 * (variable 300–900, SIL OFL 1.1; licence in ./fonts/OFL-rubik.txt).
 */
const rubik = localFont({
  src: [{ path: "./fonts/rubik-latin-wght-normal.woff2", weight: "300 900", style: "normal" }],
  variable: "--og-font",
  display: "swap",
  fallback: ["Trebuchet MS", "Arial", "sans-serif"],
});

export const golfFonts = rubik.variable;
