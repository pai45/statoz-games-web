/**
 * Scroll state shared by the home page and the 3D camera. Written on scroll,
 * read every frame; kept free of three.js imports so the DOM bundle stays small.
 */
export const stopProgress = {
  /** how far through the current stop the reader is, 0 (just arrived) → 1 (leaving) */
  value: 0.5,
}
