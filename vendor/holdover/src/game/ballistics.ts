// Point-mass exterior ballistics with quadratic drag, gravity, and wind.
// Drag is expressed per meter so velocity decays as v = v0 * exp(-drag * x) in flat fire.

export const GRAVITY = 9.81
export const BALLISTIC_STEP = 1 / 500
export const SPEED_OF_SOUND = 343

export interface Vec3Like {
  x: number
  y: number
  z: number
}

export interface BallisticSpec {
  muzzleVelocity: number
  drag: number
}

export interface BulletState {
  px: number
  py: number
  pz: number
  vx: number
  vy: number
  vz: number
}

export function stepBullet(
  state: BulletState,
  wind: Vec3Like,
  drag: number,
  dt: number,
): void {
  const rx = state.vx - wind.x
  const ry = state.vy - wind.y
  const rz = state.vz - wind.z
  const k = drag * Math.hypot(rx, ry, rz)
  state.vx -= k * rx * dt
  state.vy -= (k * ry + GRAVITY) * dt
  state.vz -= k * rz * dt
  state.px += state.vx * dt
  state.py += state.vy * dt
  state.pz += state.vz * dt
}

export interface FlatShot {
  /** Height relative to the line of sight, in meters (negative is below). */
  y: number
  /** Lateral drift in the wind direction, in meters. */
  z: number
  time: number
  velocity: number
}

/**
 * Fires along +x with the bore elevated by `angle` radians and a crosswind
 * blowing toward +z. Returns the bullet state when it reaches `distance`.
 */
export function simulateToDistance(
  spec: BallisticSpec,
  angle: number,
  distance: number,
  crossWind = 0,
): FlatShot {
  const state: BulletState = {
    px: 0,
    py: 0,
    pz: 0,
    vx: spec.muzzleVelocity * Math.cos(angle),
    vy: spec.muzzleVelocity * Math.sin(angle),
    vz: 0,
  }
  const wind = { x: 0, y: 0, z: crossWind }
  let time = 0
  let prevX = 0
  let prevY = 0
  let prevZ = 0
  while (state.px < distance && time < 8) {
    prevX = state.px
    prevY = state.py
    prevZ = state.pz
    stepBullet(state, wind, spec.drag, BALLISTIC_STEP)
    time += BALLISTIC_STEP
  }
  const span = state.px - prevX
  const f = span > 0 ? (distance - prevX) / span : 1
  return {
    y: prevY + (state.py - prevY) * f,
    z: prevZ + (state.pz - prevZ) * f,
    time: time - BALLISTIC_STEP + f * BALLISTIC_STEP,
    velocity: Math.hypot(state.vx, state.vy, state.vz),
  }
}

/** Bore elevation (radians above the line of sight) that zeroes the rifle at `zero` meters. */
export function solveZeroAngle(spec: BallisticSpec, zero: number): number {
  let low = 0
  let high = 0.08
  for (let iteration = 0; iteration < 48; iteration += 1) {
    const mid = (low + high) / 2
    if (simulateToDistance(spec, mid, zero).y > 0) high = mid
    else low = mid
  }
  return (low + high) / 2
}

export interface Holdover {
  /** Milliradians to hold above the target (negative means hold under). */
  elevation: number
  /** Milliradians of drift in the wind direction. Hold the same amount into the wind. */
  windage: number
  time: number
  impactVelocity: number
}

export function holdover(
  spec: BallisticSpec,
  zeroAngle: number,
  distance: number,
  crossWind: number,
): Holdover {
  const shot = simulateToDistance(spec, zeroAngle, distance, crossWind)
  return {
    elevation: (-shot.y / distance) * 1000,
    windage: (shot.z / distance) * 1000,
    time: shot.time,
    impactVelocity: shot.velocity,
  }
}

/** Converts a linear offset at a distance to milliradians. */
export function toMils(offset: number, distance: number): number {
  return (offset / Math.max(distance, 0.001)) * 1000
}
