/**
 * Driving input from keyboard, touch buttons and gamepads, merged into one
 * filtered throttle / brake / steer signal that the race director samples
 * every frame.
 */

export type DriveKey = "throttle" | "brake" | "left" | "right"
export type PadAction = "pause" | "camera" | "reset"

const KEYMAP: Record<string, DriveKey> = {
  ArrowUp: "throttle",
  KeyW: "throttle",
  ArrowDown: "brake",
  KeyS: "brake",
  ArrowLeft: "left",
  KeyA: "left",
  ArrowRight: "right",
  KeyD: "right",
}

export const driveKey = (code: string): DriveKey | undefined => KEYMAP[code]

type Flags = Record<DriveKey, boolean>
const flags = (): Flags => ({
  throttle: false,
  brake: false,
  left: false,
  right: false,
})

export const controls = {
  key: flags(),
  touch: flags(),
  pad: { throttle: 0, brake: 0, steer: 0, analog: false },
  /** filtered output */
  throttle: 0,
  brake: 0,
  steer: 0,
}

export function clearControls() {
  controls.key = flags()
  controls.touch = flags()
  controls.pad = { throttle: 0, brake: 0, steer: 0, analog: false }
  controls.throttle = 0
  controls.brake = 0
  controls.steer = 0
}

const approach = (value: number, target: number, step: number) =>
  value < target
    ? Math.min(target, value + step)
    : Math.max(target, value - step)

/** Reads every device and filters the result into `controls`. */
export function sampleControls(dt: number, autoThrottle: boolean) {
  pollGamepad()
  const { key, touch, pad } = controls
  const digital =
    (key.right || touch.right ? 1 : 0) - (key.left || touch.left ? 1 : 0)
  if (pad.analog && digital === 0) {
    controls.steer = pad.steer
  } else {
    // digital steering eases in, and snaps back faster than it turns in
    const returning =
      digital === 0 || Math.sign(digital) !== Math.sign(controls.steer)
    controls.steer = approach(
      controls.steer,
      digital,
      (returning ? 7 : 4.4) * dt,
    )
  }
  const brake = Math.max(key.brake || touch.brake ? 1 : 0, pad.brake)
  let throttle = Math.max(key.throttle || touch.throttle ? 1 : 0, pad.throttle)
  if (autoThrottle && brake < 0.05) throttle = 1
  controls.throttle = throttle
  controls.brake = brake
}

const padListeners = new Set<(action: PadAction) => void>()
let padButtons: boolean[] = []

/** Subscribe to edge-triggered gamepad buttons (Start, Y, Back). */
export function onPadAction(listener: (action: PadAction) => void) {
  padListeners.add(listener)
  return () => {
    padListeners.delete(listener)
  }
}

function pollGamepad() {
  const pads =
    typeof navigator !== "undefined" && navigator.getGamepads
      ? navigator.getGamepads()
      : []
  let pad: Gamepad | null = null
  for (const p of pads) {
    if (p && p.connected) {
      pad = p
      break
    }
  }
  if (!pad) {
    controls.pad.analog = false
    controls.pad.throttle = 0
    controls.pad.brake = 0
    controls.pad.steer = 0
    return
  }
  const button = (i: number) => pad!.buttons[i]
  const value = (i: number) => button(i)?.value ?? 0
  const pressed = (i: number) => button(i)?.pressed ?? false
  const raw = pad.axes[0] ?? 0
  const dead = 0.14
  const stick =
    Math.abs(raw) < dead
      ? 0
      : Math.sign(raw) * Math.pow((Math.abs(raw) - dead) / (1 - dead), 1.4)
  const dpad = (pressed(15) ? 1 : 0) - (pressed(14) ? 1 : 0)
  controls.pad.steer = dpad || stick
  controls.pad.analog = dpad === 0 && stick !== 0
  controls.pad.throttle = Math.max(value(7), pressed(0) ? 1 : 0)
  controls.pad.brake = Math.max(value(6), pressed(1) || pressed(13) ? 1 : 0)

  const edges: [number, PadAction][] = [
    [9, "pause"],
    [3, "camera"],
    [8, "reset"],
  ]
  for (const [index, action] of edges) {
    const now = pressed(index)
    if (now && !padButtons[index]) padListeners.forEach((l) => l(action))
    padButtons[index] = now
  }
}

/** Polls only the gamepad's action buttons (used while the race is paused). */
export function pollGamepadActions() {
  pollGamepad()
}
