/**
 * Court geometry in meters. The playable hoop's rim center sits at the origin (x=0, z=0)
 * at rim height; +z runs toward half court, +x toward the right sideline as seen from
 * the default camera (behind the play, looking at the hoop).
 */
export const COURT = {
  halfWidth: 7.62,
  baselineZ: -1.6,
  halfCourtZ: 12.725,
  farBaselineZ: 27.05,
  farHoopZ: 25.45,
  rimHeight: 3.048,
  rimRadius: 0.2286,
  rimTube: 0.011,
  boardZ: -0.381,
  boardThickness: 0.03,
  boardHalfWidth: 0.915,
  boardBottom: 2.9,
  boardTop: 3.97,
  threeRadius: 7.24,
  threeCornerX: 6.71,
  threeCornerZ: Math.sqrt(7.24 * 7.24 - 6.71 * 6.71),
  keyHalfWidth: 2.44,
  freeThrowZ: 4.19,
  ftCircleRadius: 1.83,
  restrictedRadius: 1.22,
  centerCircleRadius: 1.83,
  ballRadius: 0.12,
  lineWidth: 0.05,
  gravity: 9.81,
} as const

export const PLAYER_RADIUS = 0.34

export function distToRim(x: number, z: number) {
  return Math.hypot(x, z)
}

/** True when a shot from (x, z) would be worth three points. */
export function isThree(x: number, z: number) {
  if (z < COURT.threeCornerZ) return Math.abs(x) > COURT.threeCornerX + 0.02
  return Math.hypot(x, z) > COURT.threeRadius + 0.02
}

/** True if the position is behind the arc (used for the "clear the ball" rule). */
export function isBeyondArc(x: number, z: number) {
  return isThree(x, z) || z > COURT.threeRadius + 0.2
}

export const BOUNDS = {
  minX: -COURT.halfWidth + 0.25,
  maxX: COURT.halfWidth - 0.25,
  minZ: COURT.baselineZ + 0.25,
  maxZ: COURT.halfCourtZ - 0.25,
}

export function inBounds(x: number, z: number, margin = 0) {
  return (
    x > -COURT.halfWidth - margin &&
    x < COURT.halfWidth + margin &&
    z > COURT.baselineZ - margin &&
    z < COURT.halfCourtZ + margin
  )
}

export const CHECK_SPOT = { x: 0, z: 8.6 }

/** Offensive spacing spots for half-court play. */
export const SPOTS = {
  top: { x: 0, z: 8.1 },
  leftWing: { x: -5.6, z: 5.3 },
  rightWing: { x: 5.6, z: 5.3 },
  leftCorner: { x: -6.95, z: -0.4 },
  rightCorner: { x: 6.95, z: -0.4 },
  leftSlot: { x: -2.6, z: 7.6 },
  rightSlot: { x: 2.6, z: 7.6 },
  leftElbow: { x: -2.3, z: 4.3 },
  rightElbow: { x: 2.3, z: 4.3 },
  leftBlock: { x: -1.9, z: 0.6 },
  rightBlock: { x: 1.9, z: 0.6 },
}

/** 3PT contest rack spots (left corner → right corner from the shooter's view). */
export const RACK_SPOTS = [
  { x: -7.05, z: -0.55, label: 'LEFT CORNER' },
  { x: -5.55, z: 5.2, label: 'LEFT WING' },
  { x: 0, z: 7.75, label: 'TOP OF THE KEY' },
  { x: 5.55, z: 5.2, label: 'RIGHT WING' },
  { x: 7.05, z: -0.55, label: 'RIGHT CORNER' },
]
