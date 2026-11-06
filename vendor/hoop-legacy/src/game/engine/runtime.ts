import { Engine, type EngineOptions } from './Engine'

let engine: Engine | null = null
const listeners = new Set<(e: Engine) => void>()

export function createEngine(container: HTMLElement, opts: EngineOptions) {
  if (engine) return engine
  engine = new Engine(container, opts)
  for (const l of listeners) l(engine)
  return engine
}

export function getEngine() {
  return engine
}

export function onEngine(cb: (e: Engine) => void) {
  if (engine) cb(engine)
  listeners.add(cb)
  return () => listeners.delete(cb)
}

export function destroyEngine() {
  engine?.dispose()
  engine = null
}
