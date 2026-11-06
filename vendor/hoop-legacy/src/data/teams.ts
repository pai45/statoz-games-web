import type { Appearance, Attributes, AttrKey, HairStyle, JerseyStyle, PlayerProfile, Position, TeamInfo } from '../game/types'
import { ARCHETYPES, attrCap, overall, type Archetype } from './attributes'
import { FIRST_NAMES, GEAR_COLORS, HAIR_COLORS, LAST_NAMES, SKIN_TONES } from './names'
import { gauss, hashString, mulberry32, pick, randInt, type Rng } from './rng'

const HEIGHTS: Record<Position, [number, number]> = {
  PG: [184, 193],
  SG: [190, 198],
  SF: [197, 204],
  PF: [202, 209],
  C: [207, 216],
}

const HAIRS: HairStyle[] = ['buzz', 'fade', 'waves', 'afro', 'twists', 'hightop', 'bun', 'bald', 'fade', 'buzz', 'braids', 'locs']

function archetypeFor(rng: Rng, pos: Position): Archetype {
  const options = ARCHETYPES.filter((a) => a.positions.includes(pos))
  return pick(rng, options)
}

export function randomAppearance(rng: Rng): Appearance {
  const gear = () => (rng() < 0.5 ? pick(rng, GEAR_COLORS) : null)
  return {
    skin: pick(rng, SKIN_TONES),
    hair: pick(rng, HAIRS),
    hairColor: rng() < 0.82 ? pick(rng, HAIR_COLORS.slice(0, 3)) : pick(rng, HAIR_COLORS),
    beard: rng() < 0.42,
    headband: rng() < 0.22 ? pick(rng, GEAR_COLORS) : null,
    armSleeve: rng() < 0.3 ? pick(rng, GEAR_COLORS) : null,
    legSleeve: rng() < 0.18 ? pick(rng, GEAR_COLORS) : null,
    wristbands: gear(),
    shoeColor: pick(rng, GEAR_COLORS),
    shoeAccent: pick(rng, GEAR_COLORS),
    sockColor: rng() < 0.6 ? '#f5f5f5' : '#15171c',
  }
}

export function generateAttributes(rng: Rng, arch: Archetype, heightCm: number, targetOvr: number, pos: Position): Attributes {
  const keys = Object.keys(arch.base) as AttrKey[]
  const attrs = { ...arch.base }
  for (const k of keys) attrs[k] = Math.round(attrs[k] + gauss(rng) * 4)
  for (let iter = 0; iter < 30; iter++) {
    const ovr = overall(attrs, pos)
    const diff = targetOvr - ovr
    if (Math.abs(diff) < 1) break
    for (const k of keys) {
      const cap = attrCap(arch, k, heightCm)
      const room = diff > 0 ? (cap - attrs[k]) / 40 : 1
      attrs[k] = Math.max(25, Math.min(cap, attrs[k] + diff * (0.55 + rng() * 0.6) * Math.max(0.3, room)))
    }
  }
  for (const k of keys) attrs[k] = Math.round(attrs[k])
  return attrs
}

export function generatePlayer(rng: Rng, id: string, pos: Position, targetOvr: number, usedNumbers: Set<number>): PlayerProfile {
  const arch = archetypeFor(rng, pos)
  const [hMin, hMax] = HEIGHTS[pos]
  const heightCm = randInt(rng, hMin, hMax)
  let number = randInt(rng, 0, 45)
  while (usedNumbers.has(number)) number = (number + 7) % 99
  usedNumbers.add(number)
  const attributes = generateAttributes(rng, arch, heightCm, targetOvr, pos)
  const badges: PlayerProfile['badges'] = {}
  const tier = targetOvr >= 85 ? 3 : targetOvr >= 78 ? 2 : targetOvr >= 70 ? 1 : 0
  if (tier > 0) badges[arch.signatureBadge] = tier
  return {
    id,
    firstName: pick(rng, FIRST_NAMES),
    lastName: pick(rng, LAST_NAMES),
    number,
    position: pos,
    heightCm,
    attributes,
    badges,
    appearance: randomAppearance(rng),
    archetype: arch.id,
  }
}

interface TeamSeed {
  id: string
  city: string
  name: string
  abbr: string
  primary: string
  secondary: string
  ovr: [number, number, number, number]
}

const PRO_SEEDS: TeamSeed[] = [
  { id: 'vlt', city: 'Neon City', name: 'Voltage', abbr: 'VLT', primary: '#f5d90a', secondary: '#121212', ovr: [86, 79, 76, 72] },
  { id: 'hbk', city: 'Harbor', name: 'Krakens', abbr: 'HBK', primary: '#0f8a7e', secondary: '#0b1f3a', ovr: [84, 80, 75, 71] },
  { id: 'dsc', city: 'Desert', name: 'Scorpions', abbr: 'DSC', primary: '#e2711d', secondary: '#2b1d14', ovr: [83, 78, 77, 70] },
  { id: 'nsw', city: 'Northside', name: 'Wolves', abbr: 'NSW', primary: '#5b7ea4', secondary: '#141c26', ovr: [82, 79, 74, 72] },
  { id: 'bay', city: 'Bay City', name: 'Monarchs', abbr: 'BAY', primary: '#6d28d9', secondary: '#f5b70a', ovr: [87, 76, 74, 70] },
  { id: 'mtt', city: 'Metro', name: 'Titans', abbr: 'MTT', primary: '#c8102e', secondary: '#141414', ovr: [81, 80, 76, 73] },
  { id: 'smt', city: 'Summit', name: 'Peaks', abbr: 'SMT', primary: '#178c4a', secondary: '#0d1f16', ovr: [80, 77, 75, 71] },
  { id: 'cst', city: 'Coastline', name: 'Surge', abbr: 'CST', primary: '#0ab4d6', secondary: '#0f172a', ovr: [79, 78, 74, 70] },
]

const STREET_SEEDS: TeamSeed[] = [
  { id: 'ssb', city: 'Southside', name: 'Ballers', abbr: 'SSB', primary: '#d97706', secondary: '#1c1917', ovr: [68, 63, 60, 56] },
  { id: 'ebh', city: 'Eastbank', name: 'Hoopers', abbr: 'EBH', primary: '#2563eb', secondary: '#0b1120', ovr: [66, 64, 60, 57] },
  { id: 'wek', city: 'Westend', name: 'Kings', abbr: 'WEK', primary: '#a21caf', secondary: '#1a0b1f', ovr: [70, 64, 61, 58] },
  { id: 'upr', city: 'Uptown', name: 'Royals', abbr: 'UPR', primary: '#b91c1c', secondary: '#f5deb3', ovr: [71, 66, 62, 58] },
  { id: 'rvr', city: 'Riverside', name: 'Runners', abbr: 'RVR', primary: '#0891b2', secondary: '#082f49', ovr: [65, 62, 60, 56] },
  { id: 'oto', city: 'Old Town', name: 'Outlaws', abbr: 'OTO', primary: '#57534e', secondary: '#e7e5e4', ovr: [69, 65, 61, 57] },
  { id: 'ipe', city: 'Iron Park', name: 'Elite', abbr: 'IPE', primary: '#65a30d', secondary: '#1a2e05', ovr: [73, 67, 63, 59] },
]

const ROSTER_POSITIONS: Position[][] = [
  ['PG', 'SF', 'C', 'SG'],
  ['SG', 'PF', 'PG', 'C'],
  ['SF', 'PG', 'C', 'PF'],
  ['PG', 'SG', 'PF', 'C'],
]

function buildTeam(seed: TeamSeed, tier: TeamInfo['tier']): TeamInfo {
  const rng = mulberry32(hashString(seed.id + seed.name))
  const used = new Set<number>()
  const positions = ROSTER_POSITIONS[hashString(seed.id) % ROSTER_POSITIONS.length]
  const roster = seed.ovr.map((ovr, i) => generatePlayer(rng, `${seed.id}_${i}`, positions[i], ovr, used))
  return { id: seed.id, city: seed.city, name: seed.name, abbr: seed.abbr, primary: seed.primary, secondary: seed.secondary, roster, tier }
}

export const PRO_TEAMS: TeamInfo[] = PRO_SEEDS.map((s) => buildTeam(s, 'pro'))
export const STREET_TEAMS: TeamInfo[] = STREET_SEEDS.map((s) => buildTeam(s, 'street'))
export const ALL_TEAMS: TeamInfo[] = [...PRO_TEAMS, ...STREET_TEAMS]

export const PARK_TEAM: TeamInfo = {
  id: 'park',
  city: 'Rucker Lane',
  name: 'Park',
  abbr: 'PRK',
  primary: '#ff5b14',
  secondary: '#14161c',
  roster: [],
  tier: 'street',
}

export function getTeam(id: string): TeamInfo {
  return ALL_TEAMS.find((t) => t.id === id) ?? (id === PARK_TEAM.id ? PARK_TEAM : PRO_TEAMS[0])
}

export function teamOvr(team: TeamInfo, count = 3) {
  const ovrs = team.roster.map((p) => overall(p.attributes, p.position)).sort((a, b) => b - a)
  const top = ovrs.slice(0, count)
  return Math.round(top.reduce((a, b) => a + b, 0) / Math.max(1, top.length))
}

export function teamFullName(t: TeamInfo) {
  return `${t.city} ${t.name}`
}

function luminance(hex: string) {
  const n = parseInt(hex.slice(1), 16)
  const r = (n >> 16) & 255
  const g = (n >> 8) & 255
  const b = n & 255
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
}

export function readableOn(hex: string) {
  return luminance(hex) > 0.55 ? '#111318' : '#ffffff'
}

export function jerseyFor(team: TeamInfo, home: boolean): JerseyStyle {
  if (home) {
    return { base: '#f3f3f1', trim: team.primary, number: team.primary, shorts: '#f3f3f1' }
  }
  const lightPrimary = luminance(team.primary) > 0.55
  return {
    base: team.primary,
    trim: team.secondary,
    number: lightPrimary ? team.secondary : '#ffffff',
    shorts: team.primary,
  }
}

/** Pick a seeded street player for 1v1 park battles. */
export function makeStreetPlayer(seed: string, pos: Position, ovr: number, firstName?: string, lastName?: string) {
  const rng = mulberry32(hashString(seed))
  const p = generatePlayer(rng, seed, pos, ovr, new Set())
  if (firstName) p.firstName = firstName
  if (lastName) p.lastName = lastName
  return p
}

export function allStarTeam(id: string, name: string, players: PlayerProfile[], primary: string, secondary: string): TeamInfo {
  return { id, city: 'All-Star', name, abbr: name.slice(0, 3).toUpperCase(), primary, secondary, roster: players, tier: 'allstar' }
}
