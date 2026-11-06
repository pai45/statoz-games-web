import * as THREE from "three"
import { START_LINE_Z, TRACK_HALF_WIDTH } from "../layout"
import { CIRCUITS, EXTRA_PLANS, type CircuitId } from "@/race/circuits"

/**
 * The race circuit, built around the portfolio's start/finish straight.
 *
 * Plan coordinates are written the way a driver reads a track map: `sx` is to
 * the right of the main straight and `sy` is the direction of travel along it.
 * World space is x = -sx, z = sy. Travel is clockwise seen from above, so most
 * corners are right-handers. The grid (z 0 → -40) sits on an exactly straight
 * segment, so the painted slots and the gantry line up with the circuit.
 */
const PLAN: [number, number][] = [
  // main straight
  [0, -80],
  [0, -62],
  [0, -45],
  [0, 0],
  [0, 45],
  [0, 95],
  // T1 — heavy braking right-hander
  [2, 118],
  [14, 132],
  [34, 137],
  [70, 138],
  // T2/T3 — fast esses
  [96, 148],
  [122, 152],
  [146, 144],
  // T4 — long right onto the back straight
  [172, 128],
  [186, 104],
  [194, 70],
  [198, 20],
  [198, -28],
  // T5 — hairpin
  [198, -58],
  [191.6, -73.6],
  [176, -80],
  [160.4, -73.6],
  [154, -58],
  [154, -30],
  // T6/T7 — infield lefts
  [154, -10],
  [147.6, 5.6],
  [132, 12],
  [110, 12],
  [94.4, 5.6],
  [88, -10],
  [88, -52],
  // T8 — right onto the bottom straight
  [88, -84],
  [79.8, -106.8],
  [60, -115],
  // T9 — fast final sweeper back onto the straight
  [35, -115],
  [10.3, -104.7],
]

export const ROAD_HALF_WIDTH = TRACK_HALF_WIDTH
export const KERB_WIDTH = 1.15
/** Barrier distance from the centreline in open sections. */
const BARRIER_OPEN = 13.5
/** Along the start/finish straight the walls close in so the gantry legs stay outside them. */
const BARRIER_STRAIGHT = 8.55
/** AI cornering and braking budget used to build the speed profile (below the physical limits). */
const PROFILE_LAT = 27
const PROFILE_BRAKE = 29
const PROFILE_TOP_SPEED = 85

export type Track = {
  length: number
  count: number
  ds: number
  x: Float32Array
  z: Float32Array
  /** unit tangent in the direction of travel */
  tx: Float32Array
  tz: Float32Array
  /** signed curvature (1/m); negative = right-hander */
  curvature: Float32Array
  /** lateral distance from the centreline to each barrier face */
  barrierLeft: Float32Array
  barrierRight: Float32Array
  /** 0–1: where kerbs are painted */
  kerb: Float32Array
  /** AI racing line as a lateral offset (right positive) */
  line: Float32Array
  /** AI target speed (m/s) */
  speed: Float32Array
  /** s of the S1/S2 and S2/S3 boundaries */
  sectors: [number, number]
  bounds: {
    minX: number
    maxX: number
    minZ: number
    maxZ: number
  }
}

const smoothstep = (e0: number, e1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)))
  return t * t * (3 - 2 * t)
}

function circularSmooth(
  src: Float32Array,
  radius: number,
  passes: number,
): Float32Array {
  const n = src.length
  let a: Float32Array = src
  for (let p = 0; p < passes; p++) {
    const b = new Float32Array(n)
    let sum = 0
    for (let k = -radius; k <= radius; k++) sum += a[(k + n) % n]
    for (let i = 0; i < n; i++) {
      b[i] = sum / (2 * radius + 1)
      sum += a[(i + radius + 1) % n] - a[(i - radius + n) % n]
    }
    a = b
  }
  return a
}

function buildTrack(circuit: CircuitId): Track {
  const plan = circuit === "night" ? PLAN : EXTRA_PLANS[circuit]
  const scale = CIRCUITS.find(c => c.id === circuit)!.scale
  const curve = new THREE.CatmullRomCurve3(
    plan.map(
      ([sx, sy]) => new THREE.Vector3(-sx * scale, 0, sy * scale),
    ),
    true,
    "centripetal",
  )
  // dense, evenly spaced centreline
  const n0 = Math.round(curve.getLength())
  const pts = curve.getSpacedPoints(n0)
  let rawX: Float32Array = new Float32Array(n0)
  let rawZ: Float32Array = new Float32Array(n0)
  for (let i = 0; i < n0; i++) {
    rawX[i] = pts[i].x
    rawZ[i] = pts[i].z
  }
  // Catmull-Rom pinches tight arcs; a light closed-loop smooth rounds them out
  rawX = circularSmooth(rawX, 6, 3)
  rawZ = circularSmooth(rawZ, 6, 3)

  const cum = new Float64Array(n0 + 1)
  for (let i = 1; i <= n0; i++) {
    const a = (i - 1) % n0
    const b = i % n0
    cum[i] = cum[i - 1] + Math.hypot(rawX[b] - rawX[a], rawZ[b] - rawZ[a])
  }
  const length = cum[n0]

  // s = 0 sits exactly on the painted start line
  let startArc = 0
  let bestErr = Infinity
  for (let i = 0; i < n0; i++) {
    const a = i
    const b = (i + 1) % n0
    if (Math.abs(rawX[a]) > 2) continue
    const z0 = rawZ[a]
    const z1 = rawZ[b]
    if ((z0 - START_LINE_Z) * (z1 - START_LINE_Z) <= 0 && z1 > z0) {
      startArc =
        cum[i] + ((START_LINE_Z - z0) / (z1 - z0)) * (cum[i + 1] - cum[i])
      bestErr = 0
      break
    }
    const err = Math.abs(z0 - START_LINE_Z)
    if (err < bestErr) {
      bestErr = err
      startArc = cum[i]
    }
  }

  const count = Math.round(length)
  const ds = length / count
  const x = new Float32Array(count)
  const z = new Float32Array(count)
  let seg = 0
  for (let k = 0; k < count; k++) {
    const s = (startArc + k * ds) % length
    if (k === 0 || s < cum[seg]) seg = 0
    while (seg < n0 - 1 && cum[seg + 1] < s) seg++
    const t = (s - cum[seg]) / Math.max(1e-9, cum[seg + 1] - cum[seg])
    const a = seg % n0
    const b = (seg + 1) % n0
    x[k] = rawX[a] + (rawX[b] - rawX[a]) * t
    z[k] = rawZ[a] + (rawZ[b] - rawZ[a]) * t
  }
  const wrap = (i: number) => ((i % count) + count) % count

  const tx = new Float32Array(count)
  const tz = new Float32Array(count)
  for (let i = 0; i < count; i++) {
    const a = wrap(i - 1)
    const b = wrap(i + 1)
    const dx = x[b] - x[a]
    const dz = z[b] - z[a]
    const len = Math.hypot(dx, dz) || 1
    tx[i] = dx / len
    tz[i] = dz / len
  }

  const rawK = new Float32Array(count)
  for (let i = 0; i < count; i++) {
    const a = wrap(i - 3)
    const c = wrap(i + 3)
    let d =
      Math.atan2(x[c] - x[i], z[c] - z[i]) -
      Math.atan2(x[i] - x[a], z[i] - z[a])
    while (d > Math.PI) d -= Math.PI * 2
    while (d < -Math.PI) d += Math.PI * 2
    rawK[i] = d / (6 * ds)
  }
  const curvature = circularSmooth(rawK, 4, 2)
  const wideK = circularSmooth(rawK, 9, 2)

  // barriers: tight along the start/finish straight, open elsewhere
  const onStraight = new Uint8Array(count)
  for (let i = 0; i < count; i++)
    onStraight[i] = Math.abs(x[i]) < 3 && z[i] > -86 && z[i] < 108 ? 1 : 0
  const toStraight = new Float32Array(count).fill(1e9)
  for (let pass = 0; pass < 2; pass++) {
    for (let i = 0; i < count; i++) {
      if (onStraight[i]) toStraight[i] = 0
      else toStraight[i] = Math.min(toStraight[i], toStraight[wrap(i - 1)] + ds)
    }
    for (let i = count - 1; i >= 0; i--)
      toStraight[i] = Math.min(toStraight[i], toStraight[wrap(i + 1)] + ds)
  }
  const barrierLeft = new Float32Array(count)
  const barrierRight = new Float32Array(count)
  for (let i = 0; i < count; i++) {
    const base = THREE.MathUtils.lerp(
      BARRIER_STRAIGHT,
      BARRIER_OPEN,
      smoothstep(0, 28, toStraight[i]),
    )
    barrierLeft[i] = base
    barrierRight[i] = base
    // never let the inside wall fold over itself in a tight corner
    const k = wideK[i]
    if (Math.abs(k) > 1e-4) {
      const inside = 0.8 / Math.abs(k)
      if (k < 0) barrierRight[i] = Math.min(barrierRight[i], inside)
      else barrierLeft[i] = Math.min(barrierLeft[i], inside)
    }
  }
  // keep walls of neighbouring sections from crossing each other
  for (let i = 0; i < count; i += 1) {
    const rx = -tz[i]
    const rz = tx[i]
    for (let j = 0; j < count; j += 2) {
      const gap = Math.min(Math.abs(i - j), count - Math.abs(i - j))
      if (gap < 70) continue
      const dx = x[j] - x[i]
      const dz = z[j] - z[i]
      const dist = Math.hypot(dx, dz)
      if (dist > 60) continue
      const limit = dist / 2 - 0.6
      if (dx * rx + dz * rz > 0)
        barrierRight[i] = Math.min(barrierRight[i], limit)
      else barrierLeft[i] = Math.min(barrierLeft[i], limit)
    }
  }
  const smoothLeft = circularSmooth(barrierLeft, 3, 2)
  const smoothRight = circularSmooth(barrierRight, 3, 2)
  for (let i = 0; i < count; i++) {
    barrierLeft[i] = Math.max(
      ROAD_HALF_WIDTH + 0.9,
      Math.min(barrierLeft[i], smoothLeft[i]),
    )
    barrierRight[i] = Math.max(
      ROAD_HALF_WIDTH + 0.9,
      Math.min(barrierRight[i], smoothRight[i]),
    )
  }

  // kerbs where corners tighten
  const kerbRaw = new Float32Array(count)
  for (let i = 0; i < count; i++)
    kerbRaw[i] = smoothstep(1 / 95, 1 / 60, Math.abs(wideK[i]))
  const kerb = circularSmooth(kerbRaw, 4, 1)
  for (let i = 0; i < count; i++) kerb[i] = kerb[i] > 0.35 ? 1 : 0

  // Racing line: the minimum-curvature path inside the track limits, found by
  // relaxing the line towards a smooth (biharmonic) curve. It swings out
  // before a corner, clips the apex and runs out wide on the exit.
  const reach = ROAD_HALF_WIDTH - 1.7
  let line: Float32Array = new Float32Array(count)
  const lx = new Float32Array(count)
  const lz = new Float32Array(count)
  // coarse-to-fine: a wide stencil settles the overall shape quickly, a fine one the detail
  for (let iter = 0; iter < 900; iter++) {
    const span = iter < 500 ? 14 : 6
    for (let i = 0; i < count; i++) {
      lx[i] = x[i] - tz[i] * line[i]
      lz[i] = z[i] + tx[i] * line[i]
    }
    const next = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      const a = wrap(i - span)
      const b = wrap(i + span)
      const a2 = wrap(i - span * 2)
      const b2 = wrap(i + span * 2)
      // point that zeroes the local second difference of the curve
      const px = (4 * (lx[a] + lx[b]) - (lx[a2] + lx[b2])) / 6 - x[i]
      const pz = (4 * (lz[a] + lz[b]) - (lz[a2] + lz[b2])) / 6 - z[i]
      const target = -px * tz[i] + pz * tx[i]
      next[i] = Math.max(
        -reach,
        Math.min(reach, line[i] + (target - line[i]) * 0.45),
      )
    }
    line = next
  }
  line = circularSmooth(line, 5, 2)

  // curvature of the line the AI actually drives
  const lineX = new Float32Array(count)
  const lineZ = new Float32Array(count)
  for (let i = 0; i < count; i++) {
    lineX[i] = x[i] - tz[i] * line[i]
    lineZ[i] = z[i] + tx[i] * line[i]
  }
  const lineKRaw = new Float32Array(count)
  for (let i = 0; i < count; i++) {
    const a = wrap(i - 4)
    const c = wrap(i + 4)
    let d =
      Math.atan2(lineX[c] - lineX[i], lineZ[c] - lineZ[i]) -
      Math.atan2(lineX[i] - lineX[a], lineZ[i] - lineZ[a])
    while (d > Math.PI) d -= Math.PI * 2
    while (d < -Math.PI) d += Math.PI * 2
    const segA = Math.hypot(lineX[i] - lineX[a], lineZ[i] - lineZ[a])
    const segC = Math.hypot(lineX[c] - lineX[i], lineZ[c] - lineZ[i])
    lineKRaw[i] = d / Math.max(1e-3, (segA + segC) / 2)
  }
  const lineK = circularSmooth(lineKRaw, 4, 2)

  // AI speed profile: corner limit, then braking zones (backward pass around the loop)
  const speed = new Float32Array(count)
  for (let i = 0; i < count; i++)
    speed[i] = Math.min(
      PROFILE_TOP_SPEED,
      Math.sqrt(PROFILE_LAT / Math.max(Math.abs(lineK[i]), 1e-4)),
    )
  for (let pass = 0; pass < 2; pass++)
    for (let i = count - 1; i >= 0; i--) {
      const next = speed[wrap(i + 1)]
      speed[i] = Math.min(
        speed[i],
        Math.sqrt(next * next + 2 * PROFILE_BRAKE * ds),
      )
    }

  let minX = Infinity
  let maxX = -Infinity
  let minZ = Infinity
  let maxZ = -Infinity
  for (let i = 0; i < count; i++) {
    minX = Math.min(minX, x[i])
    maxX = Math.max(maxX, x[i])
    minZ = Math.min(minZ, z[i])
    maxZ = Math.max(maxZ, z[i])
  }

  return {
    length,
    count,
    ds,
    x,
    z,
    tx,
    tz,
    curvature,
    barrierLeft,
    barrierRight,
    kerb,
    line,
    speed,
    sectors: [length / 3, (length * 2) / 3],
    bounds: { minX, maxX, minZ, maxZ },
  }
}

const cached = new Map<CircuitId, Track>()

export function getTrack(circuit: CircuitId = "night") {
  let track = cached.get(circuit)
  if (!track) { track = buildTrack(circuit); cached.set(circuit, track) }
  return track
}

export const wrapIndex = (track: Track, i: number) =>
  ((i % track.count) + track.count) % track.count

export const wrapS = (track: Track, s: number) =>
  ((s % track.length) + track.length) % track.length

/** Linear lookup of a per-sample array at distance s. */
export function sampleAt(track: Track, values: Float32Array, s: number) {
  const f = wrapS(track, s) / track.ds
  const i0 = Math.floor(f) % track.count
  const i1 = (i0 + 1) % track.count
  const t = f - Math.floor(f)
  return values[i0] + (values[i1] - values[i0]) * t
}

export type TrackPoint = {
  x: number
  z: number
  /** heading (rad), forward = (sin, cos) */
  heading: number
}

/** World position at distance s along the track and lateral offset d (right positive). */
export function pointAt(track: Track, s: number, d: number, out: TrackPoint) {
  const f = wrapS(track, s) / track.ds
  const i0 = Math.floor(f) % track.count
  const i1 = (i0 + 1) % track.count
  const t = f - Math.floor(f)
  const cx = track.x[i0] + (track.x[i1] - track.x[i0]) * t
  const cz = track.z[i0] + (track.z[i1] - track.z[i0]) * t
  let tx = track.tx[i0] + (track.tx[i1] - track.tx[i0]) * t
  let tz = track.tz[i0] + (track.tz[i1] - track.tz[i0]) * t
  const len = Math.hypot(tx, tz) || 1
  tx /= len
  tz /= len
  out.x = cx - tz * d
  out.z = cz + tx * d
  out.heading = Math.atan2(tx, tz)
  return out
}

export type TrackLocation = {
  index: number
  s: number
  d: number
}

/**
 * Finds the track position of a world point. With a valid hint only nearby
 * samples are searched, which keeps lookups cheap and unambiguous where parts
 * of the circuit run close to each other.
 */
export function locate(
  track: Track,
  px: number,
  pz: number,
  hint: number,
  out: TrackLocation,
) {
  let best = 0
  let bestD = Infinity
  if (hint >= 0) {
    for (let k = -40; k <= 40; k++) {
      const i = wrapIndex(track, hint + k)
      const dx = px - track.x[i]
      const dz = pz - track.z[i]
      const d2 = dx * dx + dz * dz
      if (d2 < bestD) {
        bestD = d2
        best = i
      }
    }
  } else {
    for (let i = 0; i < track.count; i++) {
      const dx = px - track.x[i]
      const dz = pz - track.z[i]
      const d2 = dx * dx + dz * dz
      if (d2 < bestD) {
        bestD = d2
        best = i
      }
    }
  }
  const dx = px - track.x[best]
  const dz = pz - track.z[best]
  const along = dx * track.tx[best] + dz * track.tz[best]
  out.index = best
  out.s = wrapS(track, best * track.ds + along)
  out.d = -dx * track.tz[best] + dz * track.tx[best]
  return out
}

/** Minimap outline in map space (x right, y down, main straight pointing up). */
export function trackMapPath(track: Track, step = 4) {
  const pad = 16
  const { minX, maxX, minZ, maxZ } = track.bounds
  const mx = (x: number) => maxX - x + pad
  const my = (z: number) => maxZ - z + pad
  let d = ""
  for (let i = 0; i < track.count; i += step)
    d += `${
      i ? "L" : "M"
    }${mx(track.x[i]).toFixed(1)} ${my(track.z[i]).toFixed(1)}`
  d += "Z"
  return {
    path: d,
    width: maxX - minX + pad * 2,
    height: maxZ - minZ + pad * 2,
    /** world → map transform: mapX = originX - x, mapY = originY - z */
    originX: maxX + pad,
    originY: maxZ + pad,
    start: { x: mx(track.x[0]), y: my(track.z[0]) },
  }
}
