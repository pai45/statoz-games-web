import { useEffect } from "react"
import { useStore } from "@/state/store"

/** Rebuilds canvas-drawn textures (decals, painted grid) once the web fonts are available. */
export function useFontsLoader() {
  const bumpFonts = useStore((s) => s.bumpFonts)
  useEffect(() => {
    let cancelled = false
    const faces = [
      'italic 800 64px "Archivo"',
      '800 64px "Archivo"',
      'italic 900 64px "Archivo Livery"',
      '500 16px "JetBrains Mono"',
    ]
    const loaded = document.fonts
      ? Promise.all(faces.map((f) => document.fonts.load(f)))
      : Promise.resolve()
    const timeout = new Promise((resolve) => window.setTimeout(resolve, 3500))
    Promise.race([loaded, timeout])
      .catch(() => undefined)
      .then(() => {
        if (!cancelled) bumpFonts()
      })
    return () => {
      cancelled = true
    }
  }, [bumpFonts])
}
