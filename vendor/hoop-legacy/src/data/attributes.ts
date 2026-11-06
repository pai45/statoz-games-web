import type { Attributes, AttrKey, BadgeId, PlayerProfile, Position } from '../game/types'

export interface AttrDef {
  key: AttrKey
  label: string
  short: string
  group: 'Shooting' | 'Finishing' | 'Playmaking' | 'Defense' | 'Athleticism'
}

export const ATTRS: AttrDef[] = [
  { key: 'three', label: 'Three-Point Shot', short: '3PT', group: 'Shooting' },
  { key: 'mid', label: 'Mid-Range Shot', short: 'MID', group: 'Shooting' },
  { key: 'finish', label: 'Layup / Finishing', short: 'FIN', group: 'Finishing' },
  { key: 'dunk', label: 'Dunking', short: 'DNK', group: 'Finishing' },
  { key: 'handles', label: 'Ball Handling', short: 'HND', group: 'Playmaking' },
  { key: 'passing', label: 'Passing', short: 'PAS', group: 'Playmaking' },
  { key: 'perimD', label: 'Perimeter Defense', short: 'DEF', group: 'Defense' },
  { key: 'steal', label: 'Steal', short: 'STL', group: 'Defense' },
  { key: 'block', label: 'Block', short: 'BLK', group: 'Defense' },
  { key: 'rebound', label: 'Rebounding', short: 'REB', group: 'Defense' },
  { key: 'speed', label: 'Speed', short: 'SPD', group: 'Athleticism' },
  { key: 'vertical', label: 'Vertical', short: 'VRT', group: 'Athleticism' },
  { key: 'stamina', label: 'Stamina', short: 'STA', group: 'Athleticism' },
]

export const ATTR_GROUPS = ['Shooting', 'Finishing', 'Playmaking', 'Defense', 'Athleticism'] as const

const POSITION_WEIGHTS: Record<Position, Attributes> = {
  PG: { three: 1.2, mid: 1, finish: 0.9, dunk: 0.3, handles: 1.5, passing: 1.4, speed: 1.2, vertical: 0.5, perimD: 1, steal: 0.9, block: 0.2, rebound: 0.3, stamina: 0.6 },
  SG: { three: 1.5, mid: 1.2, finish: 1, dunk: 0.5, handles: 1.1, passing: 0.8, speed: 1.1, vertical: 0.6, perimD: 1, steal: 0.8, block: 0.3, rebound: 0.4, stamina: 0.6 },
  SF: { three: 1.1, mid: 1.1, finish: 1.1, dunk: 0.9, handles: 0.9, passing: 0.8, speed: 1, vertical: 0.8, perimD: 1.1, steal: 0.8, block: 0.6, rebound: 0.8, stamina: 0.6 },
  PF: { three: 0.7, mid: 1, finish: 1.2, dunk: 1.1, handles: 0.6, passing: 0.7, speed: 0.8, vertical: 0.9, perimD: 0.8, steal: 0.5, block: 1.1, rebound: 1.3, stamina: 0.6 },
  C: { three: 0.3, mid: 0.7, finish: 1.3, dunk: 1.2, handles: 0.3, passing: 0.6, speed: 0.6, vertical: 0.9, perimD: 0.6, steal: 0.4, block: 1.5, rebound: 1.6, stamina: 0.7 },
}

export function overall(attrs: Attributes, pos: Position) {
  const w = POSITION_WEIGHTS[pos]
  let sum = 0
  let wsum = 0
  const weighted: number[] = []
  for (const k of Object.keys(w) as AttrKey[]) {
    sum += attrs[k] * w[k]
    wsum += w[k]
    if (w[k] >= 1) weighted.push(attrs[k])
  }
  weighted.sort((a, b) => b - a)
  const top = weighted.slice(0, 3)
  const topAvg = top.length ? top.reduce((a, b) => a + b, 0) / top.length : sum / wsum
  const ovr = 0.72 * (sum / wsum) + 0.28 * topAvg + 2
  return Math.max(40, Math.min(99, Math.round(ovr)))
}

export function profileOvr(p: PlayerProfile) {
  return overall(p.attributes, p.position)
}

export interface Archetype {
  id: string
  name: string
  tagline: string
  positions: Position[]
  base: Attributes
  caps: Attributes
  signatureBadge: BadgeId
}

const A = (o: Partial<Attributes>, d: number): Attributes => ({
  three: d, mid: d, finish: d, dunk: d, handles: d, passing: d, speed: d, vertical: d, perimD: d, steal: d, block: d, rebound: d, stamina: d,
  ...o,
})

export const ARCHETYPES: Archetype[] = [
  {
    id: 'sharpshooter',
    name: 'Sharpshooter',
    tagline: 'Lights-out range. Punishes every closeout.',
    positions: ['PG', 'SG', 'SF'],
    base: A({ three: 66, mid: 62, finish: 48, dunk: 35, handles: 55, passing: 50, speed: 58, vertical: 48, perimD: 46, steal: 45, block: 30, rebound: 36, stamina: 60 }, 50),
    caps: A({ three: 99, mid: 97, finish: 80, dunk: 65, handles: 88, passing: 82, speed: 88, vertical: 78, perimD: 80, steal: 80, block: 60, rebound: 66, stamina: 95 }, 90),
    signatureBadge: 'deadeye',
  },
  {
    id: 'slasher',
    name: 'Slasher',
    tagline: 'Explosive first step. Lives at the rim.',
    positions: ['SG', 'SF', 'PF'],
    base: A({ three: 45, mid: 50, finish: 66, dunk: 62, handles: 56, passing: 48, speed: 64, vertical: 66, perimD: 50, steal: 48, block: 40, rebound: 46, stamina: 62 }, 50),
    caps: A({ three: 80, mid: 86, finish: 99, dunk: 99, handles: 90, passing: 80, speed: 96, vertical: 99, perimD: 84, steal: 82, block: 74, rebound: 78, stamina: 96 }, 90),
    signatureBadge: 'posterizer',
  },
  {
    id: 'playmaker',
    name: 'Floor General',
    tagline: 'Ankle-breaking handles and dimes on a string.',
    positions: ['PG', 'SG'],
    base: A({ three: 56, mid: 56, finish: 56, dunk: 38, handles: 68, passing: 68, speed: 64, vertical: 52, perimD: 50, steal: 54, block: 28, rebound: 36, stamina: 62 }, 50),
    caps: A({ three: 92, mid: 92, finish: 90, dunk: 70, handles: 99, passing: 99, speed: 97, vertical: 82, perimD: 86, steal: 92, block: 55, rebound: 64, stamina: 96 }, 90),
    signatureBadge: 'ankleBreaker',
  },
  {
    id: 'lockdown',
    name: 'Lockdown',
    tagline: 'Clamps on the perimeter. Thief in the lanes.',
    positions: ['SG', 'SF', 'PF'],
    base: A({ three: 52, mid: 50, finish: 54, dunk: 50, handles: 50, passing: 48, speed: 62, vertical: 60, perimD: 68, steal: 64, block: 52, rebound: 50, stamina: 64 }, 50),
    caps: A({ three: 86, mid: 84, finish: 88, dunk: 86, handles: 84, passing: 80, speed: 95, vertical: 92, perimD: 99, steal: 99, block: 88, rebound: 84, stamina: 97 }, 90),
    signatureBadge: 'clamps',
  },
  {
    id: 'glass',
    name: 'Paint Beast',
    tagline: 'Owns the glass. Protects the rim.',
    positions: ['PF', 'C'],
    base: A({ three: 36, mid: 48, finish: 64, dunk: 64, handles: 40, passing: 46, speed: 50, vertical: 60, perimD: 48, steal: 40, block: 66, rebound: 68, stamina: 62 }, 50),
    caps: A({ three: 70, mid: 84, finish: 97, dunk: 99, handles: 70, passing: 80, speed: 82, vertical: 92, perimD: 80, steal: 72, block: 99, rebound: 99, stamina: 95 }, 90),
    signatureBadge: 'rimProtector',
  },
]

export function getArchetype(id: string | undefined) {
  return ARCHETYPES.find((a) => a.id === id) ?? ARCHETYPES[0]
}

export interface BadgeDef {
  id: BadgeId
  name: string
  description: string
  attr: AttrKey
  /** Attribute needed for tiers 1..4 (Bronze, Silver, Gold, Hall of Fame). */
  req: [number, number, number, number]
  cost: [number, number, number, number]
}

export const BADGES: BadgeDef[] = [
  { id: 'deadeye', name: 'Deadeye', description: 'Contested jumpers lose less accuracy.', attr: 'three', req: [64, 72, 80, 88], cost: [2, 3, 4, 6] },
  { id: 'limitless', name: 'Limitless Range', description: 'Extends your range well beyond the arc.', attr: 'three', req: [70, 78, 85, 92], cost: [2, 3, 5, 6] },
  { id: 'catchShoot', name: 'Catch & Shoot', description: 'Boost to shots right after receiving a pass.', attr: 'three', req: [60, 68, 76, 85], cost: [1, 2, 3, 5] },
  { id: 'greenMachine', name: 'Green Machine', description: 'Wider perfect-release window on jumpers.', attr: 'mid', req: [62, 70, 78, 86], cost: [2, 3, 4, 6] },
  { id: 'proTouch', name: 'Pro Touch', description: 'Layups and floaters fall more often.', attr: 'finish', req: [60, 68, 77, 86], cost: [1, 2, 3, 5] },
  { id: 'posterizer', name: 'Posterizer', description: 'Dunk through contact more often.', attr: 'dunk', req: [62, 72, 80, 88], cost: [2, 3, 4, 6] },
  { id: 'ankleBreaker', name: 'Ankle Breaker', description: 'Skill moves stagger defenders more often.', attr: 'handles', req: [62, 70, 78, 87], cost: [2, 3, 4, 6] },
  { id: 'quickFirst', name: 'Quick First Step', description: 'Faster acceleration with the ball.', attr: 'speed', req: [60, 68, 77, 86], cost: [1, 2, 3, 5] },
  { id: 'dimer', name: 'Dimer', description: 'Teammates shoot better after your passes.', attr: 'passing', req: [60, 68, 77, 86], cost: [1, 2, 3, 5] },
  { id: 'clamps', name: 'Clamps', description: 'Stronger contests and on-ball defense.', attr: 'perimD', req: [62, 70, 78, 87], cost: [2, 3, 4, 6] },
  { id: 'pickPocket', name: 'Pick Pocket', description: 'Higher steal success.', attr: 'steal', req: [60, 68, 77, 86], cost: [1, 2, 3, 5] },
  { id: 'rimProtector', name: 'Rim Protector', description: 'Block shots at the rim more often.', attr: 'block', req: [62, 70, 78, 87], cost: [2, 3, 4, 6] },
  { id: 'reboundChaser', name: 'Rebound Chaser', description: 'Bigger reach and pull on rebounds.', attr: 'rebound', req: [60, 68, 77, 86], cost: [1, 2, 3, 5] },
]

export const BADGE_TIERS = ['None', 'Bronze', 'Silver', 'Gold', 'Hall of Fame'] as const
export const BADGE_TIER_COLORS = ['#3a3f4b', '#c07a43', '#c7ced8', '#f2c14e', '#b06cff']

export function badgeTier(p: PlayerProfile, id: BadgeId) {
  return p.badges[id] ?? 0
}

/** Badge effect strength 0..1 for gameplay modifiers. */
export function badgeLevel(p: PlayerProfile, id: BadgeId) {
  return (p.badges[id] ?? 0) / 4
}

export function upgradeCost(current: number) {
  if (current < 70) return 1
  if (current < 78) return 2
  if (current < 85) return 3
  if (current < 91) return 4
  return 5
}

export function heightToStr(cm: number) {
  const inches = Math.round(cm / 2.54)
  return `${Math.floor(inches / 12)}'${inches % 12}"`
}

/** Height affects attribute caps: taller players trade speed/handles for size. */
export function heightCapModifier(key: AttrKey, heightCm: number) {
  const t = (heightCm - 198) / 15
  switch (key) {
    case 'speed':
    case 'handles':
      return Math.round(-t * 6)
    case 'three':
      return Math.round(-t * 3)
    case 'block':
    case 'rebound':
      return Math.round(t * 7)
    case 'dunk':
      return Math.round(t * 3)
    default:
      return 0
  }
}

export function attrCap(arch: Archetype, key: AttrKey, heightCm: number) {
  return Math.max(50, Math.min(99, arch.caps[key] + heightCapModifier(key, heightCm)))
}
