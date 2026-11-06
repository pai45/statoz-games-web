import { useEffect, useRef, useState } from 'react'
import { getEngine, onEngine } from '../../game/engine/runtime'
import type { Engine } from '../../game/engine/Engine'
import { enterGameFullscreen, keepAwake } from '../../game/engine/mobile'
import { isTouchDevice } from '../../game/engine/quality'
import type { FeedbackKind } from '../../game/sim/Match'

/** Runs a callback every rendered frame (for imperative HUD updates). */
export function useEngineFrame(cb: (dt: number) => void) {
  const ref = useRef(cb)
  ref.current = cb
  useEffect(() => {
    let attached: Engine | null = null
    const fn = (dt: number) => ref.current(dt)
    const off = onEngine((e) => {
      attached = e
      e.frameListeners.add(fn)
    })
    return () => {
      off()
      attached?.frameListeners.delete(fn)
    }
  }, [])
}

export interface FeedbackItem {
  id: number
  text: string
  kind: FeedbackKind
  sub?: string
}

let fid = 1
export function useFeedback() {
  const [items, setItems] = useState<FeedbackItem[]>([])
  const push = (text: string, kind: FeedbackKind, sub?: string) => {
    const id = fid++
    setItems((list) => [...list.slice(-2), { id, text, kind, sub }])
    window.setTimeout(() => setItems((list) => list.filter((i) => i.id !== id)), 1500)
  }
  return [items, push] as const
}

/** True when on-screen touch controls should be shown. */
export function useTouchMode() {
  const [touch, setTouch] = useState(() => isTouchDevice())
  useEffect(() => {
    const on = (e: PointerEvent) => {
      if (e.pointerType === 'touch') setTouch(true)
    }
    const key = () => setTouch(false)
    window.addEventListener('pointerdown', on)
    window.addEventListener('keydown', key)
    return () => {
      window.removeEventListener('pointerdown', on)
      window.removeEventListener('keydown', key)
    }
  }, [])
  return touch
}

export function useInterval(cb: () => void, ms: number) {
  const ref = useRef(cb)
  ref.current = cb
  useEffect(() => {
    const id = window.setInterval(() => ref.current(), ms)
    return () => window.clearInterval(id)
  }, [ms])
}

/**
 * Device glue while a game is on screen: fullscreen + landscape on phones (the screen mounts straight from a
 * tap, so the browser still allows it), keeps the display awake, and calls `onBackground` when the app is
 * hidden (a call, a notification, switching apps) so play doesn't run on unattended.
 */
export function useGameSession(onBackground: () => void) {
  const ref = useRef(onBackground)
  ref.current = onBackground
  useEffect(() => {
    void enterGameFullscreen()
    void keepAwake(true)
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') ref.current()
      else void keepAwake(true)
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      document.removeEventListener('visibilitychange', onVisibility)
      void keepAwake(false)
    }
  }, [])
}

/** The engine instance, re-rendering once it has been created. */
export function useEngine() {
  const [engine, setEngine] = useState<Engine | null>(() => getEngine())
  useEffect(() => {
    const off = onEngine((e) => setEngine(e))
    return () => {
      off()
    }
  }, [])
  return engine
}
