import { ARM_A, B, FOREARM_LEN, LEG_A, SHIN_LEN, THIGH_LEN, UPPER_ARM_LEN, bindPose } from './rig'
import { Sdf, frameFromAxis, v3, type V3 } from './sdf'

export const G = { torso: 0, neck: 1, armL: 2, armR: 3, legL: 4, legR: 5 } as const
export const GROUP_COUNT = 6

/** Body builds: girth scales the trunk, muscle scales muscle bellies, waist scales the midsection. */
export interface BuildSpec {
  girth: number
  muscle: number
  waist: number
  limb: number
}

export const BUILDS: BuildSpec[] = [
  { girth: 0.95, muscle: 0.9, waist: 0.95, limb: 0.94 },
  { girth: 1.0, muscle: 1.0, waist: 1.0, limb: 1.0 },
  { girth: 1.065, muscle: 1.1, waist: 1.09, limb: 1.07 },
]

export function buildIndex(bulk: number) {
  if (bulk < 0.975) return 0
  if (bulk < 1.045) return 1
  return 2
}

export interface LimbFrame {
  /** joint at the root (shoulder / hip) */
  root: V3
  /** axis pointing down the limb in the bind pose */
  axis: V3
  /** perpendicular pointing outward (lateral) in the frontal plane */
  lat: V3
  mid: V3
  end: V3
}

export function armFrame(side: 1 | -1): LimbFrame {
  const bp = bindPose()
  const root = bp.pos[side > 0 ? B.upperArmL : B.upperArmR]
  const axis: V3 = [Math.sin(ARM_A) * side, -Math.cos(ARM_A), 0]
  const lat: V3 = [Math.cos(ARM_A) * side, Math.sin(ARM_A), 0]
  const mid = v3.madd(root, axis, UPPER_ARM_LEN)
  const end = v3.madd(mid, axis, FOREARM_LEN)
  return { root, axis, lat, mid, end }
}

export function legFrame(side: 1 | -1): LimbFrame {
  const bp = bindPose()
  const root = bp.pos[side > 0 ? B.thighL : B.thighR]
  const axis: V3 = [Math.sin(LEG_A) * side, -Math.cos(LEG_A), 0]
  const lat: V3 = [Math.cos(LEG_A) * side, Math.sin(LEG_A), 0]
  const mid = v3.madd(root, axis, THIGH_LEN)
  const end = v3.madd(mid, axis, SHIN_LEN)
  return { root, axis, lat, mid, end }
}

const F: V3 = [0, 0, 1]

/** Anatomical sculpt of an elite basketball player (head, hands and feet are separate meshes). */
export function bodySdf(build: BuildSpec): Sdf {
  const s = new Sdf()
  addUpperTrunk(s, build, 0)
  addPelvis(s, build, 0)
  addNeck(s, build)
  addArms(s, build)
  addLegs(s, build, 0, true)
  return s.build(0.02)
}

const mir = (p: V3, sd: number): V3 => [p[0] * sd, p[1], p[2]]
const grown = (r: V3, g: number): V3 => [r[0] + g, r[1] + g, r[2] + g]

/** Chest, back, abdomen, shoulder girdle. `grow` inflates every primitive (used for garments). */
export function addUpperTrunk(s: Sdf, build: BuildSpec, grow: number) {
  const g = build.girth
  const m = build.muscle
  const w = build.waist
  const T = G.torso
  s.ellipsoid([0, 0.712, -0.006], grown([0.081 * g, 0.104, 0.061 * g], grow), { k: 0, group: T })
  // shoulder girdle / upper chest shelf that carries the clavicles
  s.ellipsoid([0, 0.788, -0.006], grown([0.098 * g, 0.047, 0.057 * g], grow), { k: 0.022, group: T })
  s.ellipsoid([0, 0.79, -0.036], grown([0.07 * g, 0.05, 0.03 * g], grow), { k: 0.018, group: T })
  s.ellipsoid([0, 0.634, 0.004], grown([0.066 * w, 0.074, 0.046 * w], grow), { k: 0.02, group: T })
  s.ellipsoid([0, 0.632, -0.022], grown([0.064 * w, 0.072, 0.034 * w], grow), { k: 0.02, group: T })
  for (const sd of [1, -1]) {
    // pecs: broad and flat, outer edge rising toward the armpit
    s.ellipsoid(mir([0.045, 0.764, 0.03], sd), grown([0.055 * m, 0.029 * m, 0.019 * m], grow), { frame: rotZ(0.24 * sd), k: 0.022, group: T })
    // lats: V-taper
    s.ellipsoid(mir([0.073, 0.735, -0.02], sd), grown([0.024 * m, 0.068, 0.04 * m], grow), { frame: rotZ(-0.2 * sd), k: 0.016, group: T })
    // trapezius slope from the neck to the acromion
    s.roundCone(mir([0.017, 0.87, -0.024], sd), mir([0.094, 0.828, -0.014], sd), 0.0235 * m + grow, 0.0165 * m + grow, { k: 0.02, group: T })
    // obliques
    s.ellipsoid(mir([0.056, 0.62, -0.002], sd), grown([0.022 * w, 0.05, 0.035 * w], grow), { k: 0.014, group: T })
    // shoulder bar: sternum to acromion, fills the girdle between chest and trapezius
    s.roundCone(mir([0.012, 0.824, 0.006], sd), mir([0.094, 0.823, -0.004], sd), 0.025 * g + grow, 0.021 * g + grow, { k: 0.022, group: T })
    // clavicle ridge (subtle)
    if (grow === 0) s.roundCone(mir([0.014, 0.83, 0.026], sd), mir([0.09, 0.836, 0.012], sd), 0.0068, 0.0062, { k: 0.012, group: T })
  }
}

/** Pelvis, glutes, groin. */
export function addPelvis(s: Sdf, build: BuildSpec, grow: number) {
  const g = build.girth
  const T = G.torso
  s.ellipsoid([0, 0.548, -0.004], grown([0.082 * g, 0.057, 0.058 * g], grow), { k: 0.022, group: T })
  s.ellipsoid([0, 0.507, 0.018], grown([0.048 * g, 0.032, 0.032 * g], grow), { k: 0.014, group: T })
  for (const sd of [1, -1]) s.ellipsoid(mir([0.04, 0.516, -0.033], sd), grown([0.045 * g, 0.054, 0.039 * g], grow), { k: 0.016, group: T })
}

export function addNeck(s: Sdf, build: BuildSpec) {
  const g = build.girth
  s.roundCone([0, 0.814, -0.012], [0, 0.905, -0.004], 0.0345 * g, 0.0305 * g, { k: 0.02, group: G.neck })
  for (const sd of [1, -1]) s.roundCone(mir([0.024, 0.889, -0.008], sd), mir([0.009, 0.834, 0.024], sd), 0.0084, 0.0078, { k: 0.008, group: G.neck })
}

export function addArms(s: Sdf, build: BuildSpec) {
  const m = build.muscle
  const L = build.limb
  for (const sd of [1, -1] as const) {
    const a = armFrame(sd)
    const grp = sd > 0 ? G.armL : G.armR
    const fr = frameFromAxis(a.axis, F)
    const P = (t: number, dl = 0, df = 0): V3 => v3.madd(v3.madd(v3.madd(a.root, a.axis, t), a.lat, dl), F, df)
    // deltoid: middle, front and rear heads
    s.ellipsoid(P(0.028, 0.006), [0.0235 * m, 0.043 * m, 0.029 * m], { frame: fr, k: 0.016, group: grp })
    s.ellipsoid(P(0.034, 0.0, 0.016), [0.018 * m, 0.037 * m, 0.018 * m], { frame: fr, k: 0.01, group: grp })
    s.ellipsoid(P(0.034, 0.0, -0.016), [0.018 * m, 0.035 * m, 0.018 * m], { frame: fr, k: 0.01, group: grp })
    s.roundCone(P(0.01), a.mid, 0.0275 * L, 0.0195 * L, { k: 0.012, group: grp })
    s.ellipsoid(P(0.104, -0.002, 0.012), [0.022 * m, 0.05, 0.021 * m], { frame: fr, k: 0.008, group: grp })
    s.ellipsoid(P(0.08, 0.004, -0.012), [0.023 * m, 0.06, 0.021 * m], { frame: fr, k: 0.008, group: grp })
    s.sphere(v3.madd(a.mid, F, -0.008), 0.016 * L, { k: 0.01, group: grp })
    s.roundCone(a.mid, v3.madd(a.end, a.axis, -0.005), 0.021 * L, 0.0125 * L, { k: 0.01, group: grp })
    s.ellipsoid(P(UPPER_ARM_LEN + 0.035, 0.006, 0.006), [0.021 * m, 0.05, 0.02 * m], { frame: fr, k: 0.008, group: grp })
    s.ellipsoid(P(UPPER_ARM_LEN + 0.04, -0.007, 0), [0.018 * m, 0.045, 0.018 * m], { frame: fr, k: 0.008, group: grp })
    s.ellipsoid(v3.madd(a.end, a.axis, -0.004), [0.0105 * L, 0.018, 0.0158 * L], { frame: fr, k: 0.006, group: grp })
  }
}

/** Legs; `full = false` stops at the knee (garment use). */
export function addLegs(s: Sdf, build: BuildSpec, grow: number, full: boolean) {
  const m = build.muscle
  const L = build.limb
  for (const sd of [1, -1] as const) {
    const l = legFrame(sd)
    const grp = sd > 0 ? G.legL : G.legR
    const fr = frameFromAxis(l.axis, F)
    const P = (t: number, dl = 0, df = 0): V3 => v3.madd(v3.madd(v3.madd(l.root, l.axis, t), l.lat, dl), F, df)
    const Q = (t: number, dl = 0, df = 0): V3 => v3.madd(v3.madd(v3.madd(l.mid, l.axis, t), l.lat, dl), F, df)
    s.roundCone(P(-0.005), P(THIGH_LEN - 0.012), 0.05 * L + grow, 0.031 * L + grow, { k: 0.02, group: grp })
    s.ellipsoid(P(0.11, 0, 0.02), grown([0.024 * m, 0.085, 0.02 * m], grow), { frame: fr, k: 0.012, group: grp })
    s.ellipsoid(P(0.13, 0.022, 0.004), grown([0.022 * m, 0.085, 0.028 * m], grow), { frame: fr, k: 0.012, group: grp })
    s.ellipsoid(P(0.205, -0.015, 0.012), grown([0.02 * m, 0.04, 0.02 * m], grow), { frame: fr, k: 0.01, group: grp })
    s.ellipsoid(P(0.12, 0, -0.02), grown([0.03 * m, 0.09, 0.024 * m], grow), { frame: fr, k: 0.012, group: grp })
    s.ellipsoid(P(0.055, -0.018, 0), grown([0.024, 0.06, 0.032], grow), { frame: fr, k: 0.014, group: grp })
    if (!full) continue
    s.sphere(l.mid, 0.026 * L, { k: 0.02, group: grp })
    s.ellipsoid(Q(-0.004, 0, 0.019), [0.013, 0.016, 0.008], { frame: fr, k: 0.012, group: grp })
    s.roundCone(l.mid, l.end, 0.027 * L, 0.0165 * L, { k: 0.01, group: grp })
    s.ellipsoid(Q(0.072, -0.011, -0.017), [0.019 * m, 0.062, 0.021 * m], { frame: fr, k: 0.009, group: grp })
    s.ellipsoid(Q(0.066, 0.012, -0.016), [0.017 * m, 0.052, 0.019 * m], { frame: fr, k: 0.009, group: grp })
    s.ellipsoid(Q(0.13, 0, -0.009), [0.024, 0.07, 0.02], { frame: fr, k: 0.012, group: grp })
    s.ellipsoid(Q(0.09, 0.008, 0.011), [0.011, 0.07, 0.011], { frame: fr, k: 0.008, group: grp })
    s.ellipsoid(v3.madd(l.end, l.axis, 0.004), [0.017, 0.02, 0.019], { frame: fr, k: 0.008, group: grp })
  }
}

function rotZ(a: number) {
  const c = Math.cos(a), sn = Math.sin(a)
  return { x: [c, sn, 0] as V3, y: [-sn, c, 0] as V3, z: [0, 0, 1] as V3 }
}

const sm = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

export class WeightAccumulator {
  w = new Float64Array(19)
  reset() {
    this.w.fill(0)
  }
  add(bone: number, v: number) {
    if (v > 0) this.w[bone] += v
  }
  /** Writes the four strongest influences (normalized). */
  write(si: Uint16Array, sw: Float32Array, o: number) {
    const top = [0, 0, 0, 0]
    const tw = [0, 0, 0, 0]
    for (let b = 0; b < this.w.length; b++) {
      const v = this.w[b]
      if (v <= tw[3]) continue
      let k = 3
      while (k > 0 && v > tw[k - 1]) {
        tw[k] = tw[k - 1]
        top[k] = top[k - 1]
        k--
      }
      tw[k] = v
      top[k] = b
    }
    const sum = tw[0] + tw[1] + tw[2] + tw[3] || 1
    for (let k = 0; k < 4; k++) {
      si[o + k] = top[k]
      sw[o + k] = tw[k] / sum
    }
  }
}

/** Trunk weights by height, with the upper outer chest following the clavicles. */
export function torsoWeights(acc: WeightAccumulator, p: V3, scale: number) {
  const y = p[1]
  const hips = 1 - sm(0.595, 0.665, y)
  const chest = sm(0.705, 0.775, y)
  const spine = 1 - hips - chest
  const ax = Math.abs(p[0])
  const clav = sm(0.052, 0.1, ax) * sm(0.77, 0.815, y) * 0.75
  acc.add(B.hips, hips * scale)
  acc.add(B.spine, Math.max(0, spine) * scale)
  acc.add(B.chest, chest * (1 - clav) * scale)
  acc.add(p[0] > 0 ? B.clavicleL : B.clavicleR, chest * clav * scale)
}

export function neckWeights(acc: WeightAccumulator, p: V3, scale: number) {
  const y = p[1]
  const chest = 1 - sm(0.83, 0.862, y)
  const head = sm(0.885, 0.912, y)
  acc.add(B.chest, chest * scale)
  acc.add(B.head, head * scale)
  acc.add(B.neck, Math.max(0, 1 - chest - head) * scale)
}

export function armWeights(acc: WeightAccumulator, p: V3, side: 1 | -1, scale: number) {
  const a = armFrame(side)
  const u = v3.dot(v3.sub(p, a.root), a.axis)
  const clav = side > 0 ? B.clavicleL : B.clavicleR
  const ua = side > 0 ? B.upperArmL : B.upperArmR
  const fa = side > 0 ? B.forearmL : B.forearmR
  const hd = side > 0 ? B.handL : B.handR
  const toUa = sm(-0.03, 0.018, u)
  const toFa = sm(UPPER_ARM_LEN - 0.022, UPPER_ARM_LEN + 0.02, u)
  const toHd = sm(UPPER_ARM_LEN + FOREARM_LEN - 0.016, UPPER_ARM_LEN + FOREARM_LEN + 0.01, u)
  acc.add(clav, (1 - toUa) * scale)
  acc.add(ua, toUa * (1 - toFa) * scale)
  acc.add(fa, toFa * (1 - toHd) * scale)
  acc.add(hd, toHd * scale)
}

export function legWeights(acc: WeightAccumulator, p: V3, side: 1 | -1, scale: number, hipShare = 1) {
  const l = legFrame(side)
  const u = v3.dot(v3.sub(p, l.root), l.axis)
  const th = side > 0 ? B.thighL : B.thighR
  const sh = side > 0 ? B.shinL : B.shinR
  const ft = side > 0 ? B.footL : B.footR
  const toTh = sm(-0.05, 0.07, u) * hipShare + (1 - hipShare)
  const toSh = sm(THIGH_LEN - 0.022, THIGH_LEN + 0.02, u)
  const toFt = sm(THIGH_LEN + SHIN_LEN - 0.02, THIGH_LEN + SHIN_LEN + 0.004, u)
  acc.add(B.hips, (1 - toTh) * scale)
  acc.add(th, toTh * (1 - toSh) * scale)
  acc.add(sh, toSh * (1 - toFt) * scale)
  acc.add(ft, toFt * scale)
}

/** Region code + limb parameter for the skin shader (sleeves, socks). */
export function limbParam(p: V3, group: number): [number, number] {
  if (group === G.armL || group === G.armR) {
    const a = armFrame(group === G.armL ? 1 : -1)
    const u = v3.dot(v3.sub(p, a.root), a.axis) / (UPPER_ARM_LEN + FOREARM_LEN)
    return [group === G.armL ? 1 : 2, u]
  }
  if (group === G.legL || group === G.legR) {
    const l = legFrame(group === G.legL ? 1 : -1)
    const u = v3.dot(v3.sub(p, l.root), l.axis) / (THIGH_LEN + SHIN_LEN)
    return [group === G.legL ? 3 : 4, u]
  }
  return [0, 0]
}
