export type ActionName = 'shoot' | 'pass' | 'skill'
export type Device = 'keyboard' | 'touch' | 'gamepad'

const ACTIONS: ActionName[] = ['shoot', 'pass', 'skill']

const KEYMAP: Record<string, ActionName> = {
  Space: 'shoot',
  KeyJ: 'shoot',
  KeyK: 'pass',
  KeyE: 'pass',
  KeyL: 'skill',
  KeyQ: 'skill',
}

/**
 * Merges keyboard, gamepad and on-screen touch controls into named actions.
 * Gameplay only reads `move`, `sprint`, `held`, `pressed` and `released`.
 */
export class InputManager {
  move = { x: 0, y: 0 }
  sprint = false
  held: Record<ActionName, boolean> = { shoot: false, pass: false, skill: false }
  pressed: Record<ActionName, boolean> = { shoot: false, pass: false, skill: false }
  released: Record<ActionName, boolean> = { shoot: false, pass: false, skill: false }
  lastDevice: Device = 'keyboard'
  onDevice?: (d: Device) => void
  onPause?: () => void
  touchStick = { x: 0, y: 0, active: false, sprint: false }
  private keys = new Set<string>()
  private touchHeld: Record<ActionName, boolean> = { shoot: false, pass: false, skill: false }
  private pendingPress = new Set<ActionName>()
  private pendingRelease = new Set<ActionName>()
  private prevHeld: Record<ActionName, boolean> = { shoot: false, pass: false, skill: false }
  private prevPadStart = false
  private enabled = true
  /** True while a match/contest is on screen; menus keep native keyboard behaviour otherwise. */
  gameActive = false

  private onKeyDown = (e: KeyboardEvent) => {
    const tag = (e.target as HTMLElement | null)?.tagName
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
    if (!this.gameActive) return
    if (e.code === 'Escape' || e.code === 'KeyP') {
      this.onPause?.()
      return
    }
    if (KEYMAP[e.code] || e.code.startsWith('Arrow') || e.code === 'Space') e.preventDefault()
    if (!this.keys.has(e.code)) {
      const a = KEYMAP[e.code]
      if (a) this.pendingPress.add(a)
    }
    this.keys.add(e.code)
    this.setDevice('keyboard')
  }
  private onKeyUp = (e: KeyboardEvent) => {
    this.keys.delete(e.code)
    const a = KEYMAP[e.code]
    if (a) this.pendingRelease.add(a)
  }
  private onBlur = () => {
    this.keys.clear()
    for (const a of ACTIONS) this.touchHeld[a] = false
    this.touchStick.active = false
    this.touchStick.sprint = false
  }

  attach() {
    window.addEventListener('keydown', this.onKeyDown)
    window.addEventListener('keyup', this.onKeyUp)
    window.addEventListener('blur', this.onBlur)
  }
  detach() {
    window.removeEventListener('keydown', this.onKeyDown)
    window.removeEventListener('keyup', this.onKeyUp)
    window.removeEventListener('blur', this.onBlur)
  }

  setEnabled(v: boolean) {
    this.enabled = v
    if (!v) this.onBlur()
  }

  private setDevice(d: Device) {
    if (this.lastDevice !== d) {
      this.lastDevice = d
      this.onDevice?.(d)
    }
  }

  /** Touch screens add latency and give no tactile click, so shot-timing windows widen a little for them. */
  get timingAssist() {
    return this.lastDevice === 'touch' ? 1.2 : 1
  }

  /** Called by on-screen buttons. */
  touchPress(a: ActionName) {
    this.touchHeld[a] = true
    this.pendingPress.add(a)
    this.setDevice('touch')
  }
  touchRelease(a: ActionName) {
    if (!this.touchHeld[a]) return
    this.touchHeld[a] = false
    this.pendingRelease.add(a)
  }
  touchMove(x: number, y: number, active: boolean, sprint = false) {
    this.touchStick.x = x
    this.touchStick.y = y
    this.touchStick.active = active
    this.touchStick.sprint = active && sprint
    if (active) this.setDevice('touch')
  }

  update() {
    let mx = 0
    let my = 0
    let sprint = false
    const k = this.keys
    if (k.has('KeyA') || k.has('ArrowLeft')) mx -= 1
    if (k.has('KeyD') || k.has('ArrowRight')) mx += 1
    if (k.has('KeyW') || k.has('ArrowUp')) my += 1
    if (k.has('KeyS') || k.has('ArrowDown')) my -= 1
    if (k.has('ShiftLeft') || k.has('ShiftRight')) sprint = true
    const len = Math.hypot(mx, my)
    if (len > 1) {
      mx /= len
      my /= len
    }
    const held: Record<ActionName, boolean> = { shoot: false, pass: false, skill: false }
    for (const code of k) {
      const a = KEYMAP[code]
      if (a) held[a] = true
    }
    // gamepad
    const pads = typeof navigator !== 'undefined' && navigator.getGamepads ? navigator.getGamepads() : []
    for (const pad of pads) {
      if (!pad) continue
      const ax = pad.axes[0] ?? 0
      const ay = pad.axes[1] ?? 0
      const mag = Math.hypot(ax, ay)
      if (mag > 0.18) {
        const s = Math.min(1, (mag - 0.18) / 0.82) / mag
        mx = ax * s
        my = -ay * s
        this.setDevice('gamepad')
      }
      const b = (i: number) => !!pad.buttons[i]?.pressed
      if (b(2)) held.shoot = true
      if (b(0)) held.pass = true
      if (b(1) || b(3)) held.skill = true
      if (b(7) || b(5)) sprint = true
      if (b(0) || b(1) || b(2) || b(3)) this.setDevice('gamepad')
      const start = b(9)
      if (start && !this.prevPadStart) this.onPause?.()
      this.prevPadStart = start
    }
    // touch
    if (this.touchStick.active) {
      mx = this.touchStick.x
      my = this.touchStick.y
      if (this.touchStick.sprint) sprint = true
    }
    for (const a of ACTIONS) if (this.touchHeld[a]) held[a] = true

    if (!this.enabled) {
      mx = 0
      my = 0
      sprint = false
      for (const a of ACTIONS) held[a] = false
    }
    this.move.x = mx
    this.move.y = my
    this.sprint = sprint
    for (const a of ACTIONS) {
      const p = this.pendingPress.has(a)
      const r = this.pendingRelease.has(a)
      this.pressed[a] = this.enabled && ((held[a] && !this.prevHeld[a]) || p)
      this.released[a] = this.enabled && ((!held[a] && this.prevHeld[a]) || (r && !held[a]))
      this.held[a] = held[a]
      this.prevHeld[a] = held[a]
    }
    this.pendingPress.clear()
    this.pendingRelease.clear()
  }
}
