import * as THREE from 'three'
import { COURT, distToRim, isThree } from './court'
import type { Athlete } from './Athlete'
import type { Difficulty } from '../types'
import { badgeLevel } from '../../data/attributes'

export type ShotType = 'jumper' | 'three' | 'layup' | 'dunk'
export type Grade = 'perfect' | 'good' | 'early' | 'late' | 'veryEarly' | 'veryLate'

export const METER_FILL_TIME = 0.62
export const METER_IDEAL = 0.8
export const METER_MAX = 1.18

export interface DiffParams {
  react: number
  shotIQ: number
  stealRate: number
  contest: number
  speedMul: number
  greenMul: number
  grades: [number, number, number, number]
  humanAssist: number
}

export const DIFFICULTY: Record<Difficulty, DiffParams> = {
  rookie: { react: 0.46, shotIQ: 0.55, stealRate: 0.08, contest: 0.6, speedMul: 0.9, greenMul: 1.65, grades: [0.05, 0.42, 0.37, 0.16], humanAssist: 1.25 },
  pro: { react: 0.34, shotIQ: 0.7, stealRate: 0.13, contest: 0.75, speedMul: 0.95, greenMul: 1.3, grades: [0.09, 0.5, 0.31, 0.1], humanAssist: 1.1 },
  allstar: { react: 0.25, shotIQ: 0.82, stealRate: 0.19, contest: 0.9, speedMul: 1, greenMul: 1.05, grades: [0.14, 0.56, 0.25, 0.05], humanAssist: 1 },
  superstar: { react: 0.18, shotIQ: 0.9, stealRate: 0.25, contest: 1, speedMul: 1.03, greenMul: 0.88, grades: [0.2, 0.58, 0.19, 0.03], humanAssist: 0.92 },
  hof: { react: 0.13, shotIQ: 0.96, stealRate: 0.31, contest: 1.1, speedMul: 1.06, greenMul: 0.72, grades: [0.27, 0.58, 0.14, 0.01], humanAssist: 0.85 },
}

export const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  rookie: 'Rookie',
  pro: 'Pro',
  allstar: 'All-Star',
  superstar: 'Superstar',
  hof: 'Hall of Fame',
}

export function shotRating(a: Athlete, type: ShotType) {
  switch (type) {
    case 'three':
      return a.attrs.three
    case 'jumper':
      return a.attrs.mid
    case 'layup':
      return a.attrs.finish
    case 'dunk':
      return a.attrs.dunk
  }
}

/** Half-width of the perfect window, in meter-fill units. */
export function greenWindow(a: Athlete, type: ShotType, diff: DiffParams) {
  const r = shotRating(a, type)
  const base = 0.034 + 0.042 * Math.max(0, (r - 40) / 59)
  return base * diff.greenMul * (1 + 0.45 * badgeLevel(a.profile, 'greenMachine'))
}

export function gradeRelease(fill: number, gw: number): Grade {
  const d = fill - METER_IDEAL
  const ad = Math.abs(d)
  if (ad <= gw) return 'perfect'
  if (ad <= gw * 2.5) return 'good'
  if (ad <= 0.24) return d < 0 ? 'early' : 'late'
  return d < 0 ? 'veryEarly' : 'veryLate'
}

export const GRADE_TEXT: Record<Grade, string> = {
  perfect: 'EXCELLENT',
  good: 'GOOD RELEASE',
  early: 'SLIGHTLY EARLY',
  late: 'SLIGHTLY LATE',
  veryEarly: 'VERY EARLY',
  veryLate: 'VERY LATE',
}

export interface ShotEval {
  type: ShotType
  dist: number
  three: boolean
  contest: number
  base: number
}

export function classifyShot(a: Athlete): { type: ShotType; dist: number; three: boolean } {
  const dist = distToRim(a.pos.x, a.pos.z)
  const three = isThree(a.pos.x, a.pos.z)
  return { type: three ? 'three' : 'jumper', dist, three }
}

/** Open-look make chance assuming a good release. */
export function baseChance(a: Athlete, type: ShotType, dist: number, opts: { moving?: number; catchShoot?: boolean; dimer?: number } = {}) {
  const r = shotRating(a, type)
  let p = 0
  switch (type) {
    case 'layup':
      p = 0.5 + (r - 60) * 0.0095 + badgeLevel(a.profile, 'proTouch') * 0.08 - Math.max(0, dist - 1.6) * 0.06
      break
    case 'dunk':
      p = 0.82 + (r - 60) * 0.005
      break
    case 'jumper':
      p = 0.41 + (r - 60) * 0.0082 - Math.max(0, dist - 5) * 0.012
      break
    case 'three': {
      p = 0.35 + (r - 60) * 0.0082
      const deep = Math.max(0, dist - 8.0)
      p -= deep * (0.075 - badgeLevel(a.profile, 'limitless') * 0.05)
      break
    }
  }
  if (opts.moving && (type === 'jumper' || type === 'three') && opts.moving > 3) p -= 0.05
  if (opts.catchShoot && (type === 'jumper' || type === 'three')) p += 0.025 + badgeLevel(a.profile, 'catchShoot') * 0.06
  if (opts.dimer) p += opts.dimer * 0.05
  return Math.max(0.03, Math.min(0.97, p))
}

export function finalChance(a: Athlete, type: ShotType, base: number, contest: number, grade: Grade | null) {
  const deadeye = type === 'jumper' || type === 'three' ? badgeLevel(a.profile, 'deadeye') : 0
  const poster = type === 'dunk' ? badgeLevel(a.profile, 'posterizer') : 0
  const contested = base * (1 - contest * (0.55 - 0.25 * deadeye - 0.3 * poster))
  if (!grade) return Math.max(0.02, contested)
  const r = shotRating(a, type)
  switch (grade) {
    case 'perfect':
      return Math.min(0.995, Math.max(contested, 0.9 + (r / 99) * 0.08) * (1 - contest * 0.3 * (1 - deadeye * 0.6)))
    case 'good':
      return contested
    case 'early':
    case 'late':
      return contested * 0.48
    default:
      return contested * 0.1
  }
}

export interface ContestInfo {
  contest: number
  blocker: Athlete | null
  blockChance: number
}

export function computeContest(shooter: Athlete, defenders: Athlete[], type: ShotType, diffContest: number): ContestInfo {
  let best = 0
  let blocker: Athlete | null = null
  let blockChance = 0
  const rx = -shooter.pos.x
  const rz = -shooter.pos.z
  const rl = Math.hypot(rx, rz) || 1
  for (const d of defenders) {
    const dx = d.pos.x - shooter.pos.x
    const dz = d.pos.z - shooter.pos.z
    const dist = Math.hypot(dx, dz)
    if (dist > 2.9) continue
    const cos = (dx * rx + dz * rz) / ((dist || 1) * rl)
    let c = Math.min(1, Math.max(0, (2.9 - dist) / 2.2))
    c *= cos < -0.25 ? 0.25 : 0.6 + 0.4 * Math.max(0, cos)
    const handsUp = d.action === 'block' || d.airborne
    c *= handsUp ? 1.25 : 0.8
    c *= 1 + 0.25 * badgeLevel(d.profile, 'clamps')
    c *= Math.min(1.3, Math.max(0.7, 1 + (d.H - shooter.H) * 0.8))
    c *= d.stumble > 0 ? 0.1 : 1
    c *= d.ai && !d.human ? diffContest : 1
    if (c > best) best = c
    if (dist < 1.7 && cos > 0.1 && d.stumble <= 0) {
      const typeF = type === 'layup' ? 1.3 : type === 'dunk' ? 0.55 * (1 - 0.6 * badgeLevel(shooter.profile, 'posterizer')) : type === 'jumper' ? 0.6 : 0.4
      const heightF = Math.min(1.6, Math.max(0.55, 1 + (d.H - shooter.H) * 2.2))
      let bc = (d.attrs.block / 99) * 0.34 * ((1.7 - dist) / 1.2) * typeF * heightF
      bc *= 1 + 0.5 * badgeLevel(d.profile, 'rimProtector')
      if (!handsUp) bc *= 0.22
      bc = Math.min(0.55, bc)
      if (bc > blockChance) {
        blockChance = bc
        blocker = d
      }
    }
  }
  return { contest: Math.min(1, best), blocker, blockChance }
}

/** Launch velocity reaching `to` from `from` at the given launch angle (degrees). */
export function solveLaunch(from: THREE.Vector3, to: THREE.Vector3, angleDeg: number, out = new THREE.Vector3()) {
  const dx = to.x - from.x
  const dz = to.z - from.z
  const d = Math.hypot(dx, dz)
  const h = to.y - from.y
  let ang = (angleDeg * Math.PI) / 180
  for (let i = 0; i < 12; i++) {
    const denom = 2 * Math.cos(ang) ** 2 * (d * Math.tan(ang) - h)
    if (denom > 0.01) {
      const v = Math.sqrt((COURT.gravity * d * d) / denom)
      const hx = d > 1e-4 ? dx / d : 0
      const hz = d > 1e-4 ? dz / d : 0
      return out.set(hx * v * Math.cos(ang), v * Math.sin(ang), hz * v * Math.cos(ang))
    }
    ang += 0.06
  }
  return out.set(dx, 6, dz)
}

/**
 * Launch velocity that rises to `apexY` and drops onto `to` on the way down: the soft touch of a layup or a
 * tip. A fixed launch angle from below the rim at close range is too flat to clear the front of the rim.
 */
export function solveLaunchApex(from: THREE.Vector3, to: THREE.Vector3, apexY: number, out = new THREE.Vector3()) {
  const g = COURT.gravity
  const top = Math.max(apexY, from.y + 0.05, to.y + 0.05)
  const vy = Math.sqrt(2 * g * (top - from.y))
  const t = (vy + Math.sqrt(2 * g * (top - to.y))) / g
  return out.set((to.x - from.x) / t, vy, (to.z - from.z) / t)
}

/** Aim point for an intended make or miss. */
export function aimPoint(make: boolean, from: THREE.Vector3, grade: Grade | null, rng = Math.random) {
  const c = new THREE.Vector3(0, COURT.rimHeight, 0)
  const ax = from.x
  const az = from.z
  const al = Math.hypot(ax, az) || 1
  const tx = ax / al
  const tz = az / al
  const sx = -tz
  const sz = tx
  if (make) {
    const r = Math.sqrt(rng()) * 0.045
    const a = rng() * Math.PI * 2
    return c.set(Math.cos(a) * r - tx * 0.01, COURT.rimHeight, Math.sin(a) * r - tz * 0.01)
  }
  const bad = grade === 'veryEarly' || grade === 'veryLate'
  const roll = rng()
  if (bad && roll < 0.55) {
    const short = grade === 'veryEarly' ? 1 : -1
    const off = 0.42 + rng() * 0.45
    return c.set(tx * off * short + sx * (rng() - 0.5) * 0.4, COURT.rimHeight, tz * off * short + sz * (rng() - 0.5) * 0.4)
  }
  // misses land on the outer half of the rim (radius 0.229 m), so the contact kicks the ball out; anything
  // inside the rim's radius tends to roll in
  if (roll < 0.36) {
    const off = 0.24 + rng() * 0.06
    return c.set(tx * off + sx * (rng() - 0.5) * 0.12, COURT.rimHeight, tz * off + sz * (rng() - 0.5) * 0.12)
  }
  if (roll < 0.72) {
    const off = 0.25 + rng() * 0.06
    return c.set(-tx * off + sx * (rng() - 0.5) * 0.12, COURT.rimHeight, -tz * off + sz * (rng() - 0.5) * 0.12)
  }
  if (roll < 0.9) {
    const side = rng() < 0.5 ? 1 : -1
    const off = 0.25 + rng() * 0.06
    return c.set(sx * off * side, COURT.rimHeight, sz * off * side)
  }
  // long off the glass
  const off = 0.36 + rng() * 0.12
  return c.set(-tx * off, COURT.rimHeight + 0.25, -tz * off)
}

export function rollGrade(diff: DiffParams, rating: number, rng = Math.random): Grade {
  const [p, g, e] = diff.grades
  const bonus = Math.max(0, (rating - 75) / 24) * 0.1
  const r = rng()
  if (r < p + bonus) return 'perfect'
  if (r < p + bonus + g) return 'good'
  if (r < p + bonus + g + e) return rng() < 0.5 ? 'early' : 'late'
  return rng() < 0.5 ? 'veryEarly' : 'veryLate'
}
