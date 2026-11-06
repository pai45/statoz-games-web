import { addLegs, addPelvis, addUpperTrunk, legFrame, type BuildSpec } from './body'
import { THIGH_LEN } from './rig'
import { Sdf, v3, type SdfField, type V3 } from './sdf'

/**
 * Basketball uniform shells. Each garment is an inflated copy of the underlying anatomy merged with loose
 * "drape" volumes, so the cloth hangs off the chest and hips instead of shrink-wrapping the muscles.
 * keep(p) >= 0 marks where cloth exists; it doubles as distance-to-opening for trims.
 */

export const JERSEY_Y0 = 0.528
export const JERSEY_Y1 = 0.885
export const SHORTS_Y0 = 0.29
export const SHORTS_Y1 = 0.612
export const WAIST_Y = 0.604
/** Distance down the thigh (from the hip joint) where the shorts hem sits. */
export const HEM_T = 0.208

export function jerseySdf(build: BuildSpec): Sdf {
  const s = new Sdf()
  const g = build.girth
  addUpperTrunk(s, build, 0.0062)
  addPelvis(s, build, 0.0062)
  // drape: the shirt falls straight from the chest instead of following the waist
  s.ellipsoid([0, 0.665, -0.004], [0.091 * g, 0.12, 0.068 * g], { k: 0.03 })
  s.ellipsoid([0, 0.765, -0.006], [0.101 * g, 0.07, 0.07 * g], { k: 0.03 })
  // tucked into the shorts: pull the cloth in below the waistband
  s.displace = (_x, y) => 0.012 * tuck(y)
  return s.build(0.02)
}

function tuck(y: number) {
  const t = Math.min(1, Math.max(0, (0.628 - y) / 0.05))
  return t * t * (3 - 2 * t)
}

/** Neck opening (V-neck), armholes and the tuck line. Returns [collar, armhole, hem] distances. */
export function jerseyEdges(p: V3, build: BuildSpec): [number, number, number] {
  const [x, y, z] = p
  const g = build.girth
  // collar: elliptic cylinder around the neck, cut above the shoulder line, plus the V in front
  const a = 0.054 * g, b = 0.058 * g
  const ex = x / a, ez = (z + 0.006) / b
  const cyl = (Math.hypot(ex, ez) - 1) * Math.min(a, b)
  const collarY = 0.818 - 0.012 * Math.max(0, Math.min(1, (z + 0.02) / 0.07))
  const neckHole = Math.max(cyl, collarY - y)
  const vY = 0.79 + 1.25 * Math.abs(x)
  const vHole = Math.max((vY - y) / 1.6, 0.012 - z)
  const collar = Math.min(neckHole, vHole)
  // armholes: deep ellipsoidal cut around each shoulder
  const ax = Math.abs(x) - 0.113 * g
  const ay = y - 0.752
  const az = z + 0.008
  const rx = 0.052 * g, ry = 0.088, rz = 0.071 * g
  const k0 = Math.hypot(ax / rx, ay / ry, az / rz)
  const k1 = Math.hypot(ax / (rx * rx), ay / (ry * ry), az / (rz * rz))
  const arm = k1 > 1e-9 ? (k0 * (k0 - 1)) / k1 : -rx
  const hem = y - (JERSEY_Y0 + 0.006)
  return [collar, arm, hem]
}

export function shortsSdf(build: BuildSpec): Sdf {
  const s = new Sdf()
  const g = build.girth
  addPelvis(s, build, 0.0085)
  s.ellipsoid([0, 0.586, -0.002], [0.09 * g, 0.046, 0.067 * g], { k: 0.02 })
  addLegs(s, build, 0.0095, false)
  // loose leg tubes hanging slightly straighter than the thighs
  for (const sd of [1, -1] as const) {
    const l = legFrame(sd)
    const top = v3.madd(l.root, [0, 1, 0], 0.012)
    const bot = v3.madd(l.root, l.axis, HEM_T + 0.02)
    bot[0] -= 0.006 * sd
    s.roundCone(top, bot, 0.06 * g, 0.054 * build.limb, { k: 0.03 })
  }
  return s.build(0.02)
}

/** [waistband, hem] distances for the shorts. */
export function shortsEdges(p: V3): [number, number] {
  const waist = WAIST_Y - p[1]
  const l = legFrame(p[0] >= 0 ? 1 : -1)
  const hemP = v3.madd(l.root, l.axis, HEM_T)
  const hem = -v3.dot(v3.sub(p, hemP), l.axis)
  return [waist, hem]
}

export function keepOf(edges: number[]) {
  let m = Infinity
  for (const e of edges) m = Math.min(m, e)
  return m
}

/** Garment solid restricted to where cloth exists, for occlusion and hidden-skin tests. */
export function maskedField(f: SdfField, keep: (p: V3) => number): SdfField {
  const p: V3 = [0, 0, 0]
  return {
    eval(x, y, z) {
      p[0] = x
      p[1] = y
      p[2] = z
      return Math.max(f.eval(x, y, z), -keep(p))
    },
  }
}

/** Cylindrical jersey UVs: u wraps around the torso (front centre = 0.5, seam at the back), v runs hem -> collar. */
export function jerseyUV(p: V3): [number, number] {
  const u = Math.atan2(p[0], p[2] + 0.004) / (Math.PI * 2) + 0.5
  const v = (p[1] - JERSEY_Y0) / (JERSEY_Y1 - JERSEY_Y0)
  return [u, v]
}

/** Outward component around the torso (1 at the side seams, 0 at the front/back centre). */
export function jerseySide(p: V3) {
  return Math.abs(p[0]) / Math.max(1e-6, Math.hypot(p[0], p[2] + 0.004))
}

function legBlend(p: V3) {
  const sd = p[0] >= 0 ? 1 : -1
  const l = legFrame(sd)
  const t = Math.max(0, Math.min(1, (0.5 - p[1]) / 0.07))
  const k = t * t * (3 - 2 * t)
  const along = (l.root[1] - p[1]) / Math.cos(0.12)
  const cx = l.root[0] + l.axis[0] * Math.max(0, Math.min(THIGH_LEN, along))
  return { sd, ox: cx * k }
}

/** Shorts UVs: cylindrical around the pelvis, blending to each leg's own axis below the crotch. */
export function shortsUV(p: V3): [number, number] {
  const { ox } = legBlend(p)
  const u = Math.atan2(p[0] - ox, p[2] + 0.002) / (Math.PI * 2) + 0.5
  const v = (p[1] - SHORTS_Y0) / (SHORTS_Y1 - SHORTS_Y0)
  return [u, v]
}

/** Outward component around each leg (1 on the outer seam, -1 on the inseam). */
export function shortsSide(p: V3) {
  const { sd, ox } = legBlend(p)
  const dx = (p[0] - ox) * sd
  return dx / Math.max(1e-6, Math.hypot(dx, p[2] + 0.002))
}
