/** Font stacks for text drawn into canvas textures. */

/** The site's display face (Archivo) at normal width. */
export const DISPLAY_FONT = '"Archivo", "Arial Narrow", Arial, sans-serif'
/** Archivo at its widest, black italic: liveries, LED walls and boards. */
export const LIVERY_FONT =
  '"Archivo Livery", "Archivo", "Arial Black", Arial, sans-serif'
export const MONO_FONT = '"JetBrains Mono", ui-monospace, monospace'

/** `#rrggbb` as an rgba() string. */
export function withAlpha(hex: string, alpha: number) {
  const n = parseInt(hex.replace("#", ""), 16)
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${alpha})`
}
