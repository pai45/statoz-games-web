import { useEffect, useRef } from "react"

/** Calls `callback` on every animation frame while mounted (and `active`). */
export function useAnimationFrame(
  callback: (dt: number) => void,
  active = true,
) {
  const saved = useRef(callback)
  saved.current = callback
  useEffect(() => {
    if (!active) return
    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      saved.current(Math.min(0.1, (now - last) / 1000))
      last = now
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [active])
}
