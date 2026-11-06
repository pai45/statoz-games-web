import { isHandheld } from './quality'

/**
 * Mobile platform glue for game screens: fullscreen + landscape lock where the browser allows it, a screen
 * wake lock so the display doesn't dim mid-possession, and a guard against accidental pinch-zoom on iOS
 * (which ignores `user-scalable=no`). Every call fails quietly where unsupported or not permitted.
 */

type LockableOrientation = ScreenOrientation & { lock?: (o: 'landscape') => Promise<void> }
interface WakeLockHandle {
  release(): Promise<void>
  addEventListener?(type: 'release', cb: () => void): void
}
type WakeLockNavigator = Navigator & { wakeLock?: { request(type: 'screen'): Promise<WakeLockHandle> } }

/** Call from (or right after) a tap: transient user activation is required. */
export async function enterGameFullscreen() {
  if (!isHandheld() || typeof document === 'undefined') return
  const el = document.documentElement
  try {
    if (!document.fullscreenElement && document.fullscreenEnabled && el.requestFullscreen) await el.requestFullscreen({ navigationUI: 'hide' })
  } catch {
    // no user activation, blocked in an iframe, or unsupported (iPhone Safari)
  }
  try {
    await (screen.orientation as LockableOrientation | undefined)?.lock?.('landscape')
  } catch {
    // orientation lock only works in fullscreen on supporting browsers
  }
}

let wakeLock: WakeLockHandle | null = null
let wantAwake = false

/** Holds (or releases) a screen wake lock; browsers drop it when the page is hidden, so re-call on return. */
export async function keepAwake(on: boolean) {
  wantAwake = on
  if (!on) {
    const held = wakeLock
    wakeLock = null
    await held?.release().catch(() => undefined)
    return
  }
  const api = (navigator as WakeLockNavigator).wakeLock
  if (wakeLock || !api || document.visibilityState !== 'visible') return
  try {
    const lock = await api.request('screen')
    if (!wantAwake) {
      void lock.release()
      return
    }
    wakeLock = lock
    lock.addEventListener?.('release', () => {
      if (wakeLock === lock) wakeLock = null
    })
  } catch {
    // denied (battery saver) or unsupported
  }
}

let guarded = false

/** iOS Safari ignores user-scalable=no; cancelling its gesture events stops a two-thumb press from zooming the page. */
export function guardZoomGestures() {
  if (guarded || typeof document === 'undefined') return
  guarded = true
  const stop = (e: Event) => e.preventDefault()
  document.addEventListener('gesturestart', stop, { passive: false })
  document.addEventListener('gesturechange', stop, { passive: false })
}
