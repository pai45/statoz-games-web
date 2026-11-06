import type {
  Appearance,
  AttrKey,
  BadgeId,
  ContestConfig,
  ContestResult,
  Difficulty,
  HairStyle,
  JerseyStyle,
  MatchConfig,
  MatchResult,
  PlayerGameStats,
  PlayerProfile,
  Position,
  TeamInfo,
} from '../game/types'
import { emptyStats, fullName, shortName } from '../game/types'
import { ATTRS, BADGES, attrCap, getArchetype, overall, upgradeCost } from './attributes'
import { PARK_TEAM, PRO_TEAMS, STREET_TEAMS, allStarTeam, generatePlayer, getTeam, jerseyFor, makeStreetPlayer, teamOvr } from './teams'
import { hashString, mulberry32, pick, uid } from './rng'
import { simulateContest } from '../game/sim/Contest'

export type Chapter = 'blacktop' | 'circuit' | 'combine' | 'pro'

export interface StatTotals extends PlayerGameStats {
  gp: number
  w: number
  l: number
}

export interface GameLogEntry {
  id: string
  label: string
  opp: string
  won: boolean
  score: string
  stats: PlayerGameStats
  simmed: boolean
}

export interface Trophy {
  id: string
  name: string
  detail: string
  season?: number
  tier: 'gold' | 'silver' | 'bronze' | 'legend'
}

export interface InboxMessage {
  id: string
  from: string
  title: string
  body: string
  read: boolean
  at: number
}

export interface ScheduledGame {
  round: number
  home: string
  away: string
  result?: { hs: number; as: number; user: boolean }
}

export interface Series {
  a: string
  b: string
  winsA: number
  winsB: number
  bestOf: number
}

export interface ProState {
  season: number
  year: number
  teamId: string
  schedule: ScheduledGame[]
  round: number
  standings: Record<string, { w: number; l: number; pf: number; pa: number }>
  phase: 'regular' | 'playoffs' | 'offseason'
  allStar: { invited: boolean; contestDone: boolean; contestWon: boolean; selected: boolean; gameDone: boolean }
  playoffs: { semis: Series[]; final: Series | null; champion: string | null } | null
  salary: number
  trained: boolean
  awards: string[]
}

export interface Bracket {
  teams: string[]
  /** The user's opponent for each round (QF, SF, Final). */
  opponents: string[]
  round: number
  alive: boolean
  results: { a: string; b: string; winner: string; score: string }[]
}

export interface CareerSave {
  version: 1
  slot: number
  createdAt: number
  updatedAt: number
  player: PlayerProfile
  level: number
  xp: number
  sp: number
  coins: number
  followers: number
  chapter: Chapter
  difficulty: Difficulty
  blacktop: { ladder: PlayerProfile[]; beaten: number }
  circuit: { recruits: PlayerProfile[]; teammates: string[]; bracket: Bracket | null; runs: number }
  combine: { threeScore: number | null; oneOnOne: { won: boolean; margin: number } | null; pick: number | null; teamId: string | null }
  pro: ProState | null
  stats: { career: StatTotals; season: StatTotals; log: GameLogEntry[]; highs: Record<'pts' | 'reb' | 'ast' | 'stl' | 'blk' | 'tpm', number> }
  trophies: Trophy[]
  inbox: InboxMessage[]
  inventory: { owned: string[]; shoes: string; headband: string | null; armSleeve: string | null; legSleeve: string | null; wristbands: string | null }
  legacy: number
  endorsements: string[]
  trainedSinceGame: boolean
  hallOfFame: boolean
}

export interface Rewards {
  xp: number
  coins: number
  followers: number
  levelUps: number
  spGained: number
  messages: string[]
  attributeGains: { key: AttrKey; amount: number }[]
}

export interface CareerEvent {
  id: string
  kind: 'match' | 'contest' | 'recruit' | 'draft' | 'offseason' | 'champion'
  chapterLabel: string
  title: string
  subtitle: string
  opponent?: PlayerProfile | TeamInfo
  canSim: boolean
}

export interface CreateDraft {
  firstName: string
  lastName: string
  number: number
  position: Position
  archetype: string
  heightCm: number
  appearance: Appearance
  difficulty: Difficulty
}

// ------------------------------------------------------------------ store items
export interface ShopItem {
  id: string
  kind: 'shoes' | 'headband' | 'armSleeve' | 'legSleeve' | 'wristbands'
  name: string
  price: number
  color: string
  accent?: string
  boosts?: Partial<Record<AttrKey, number>>
  blurb: string
}

export const SHOP: ShopItem[] = [
  { id: 'shoe_street', kind: 'shoes', name: 'Street Classics', price: 0, color: '#f2f2f2', accent: '#111318', blurb: 'Where it all started.' },
  { id: 'shoe_aero', kind: 'shoes', name: 'Aero Glide', price: 900, color: '#0ea5e9', accent: '#ffffff', boosts: { speed: 2, vertical: 1 }, blurb: '+2 SPD, +1 VRT' },
  { id: 'shoe_lock', kind: 'shoes', name: 'Lockdown Lows', price: 1100, color: '#111318', accent: '#e02f2f', boosts: { perimD: 2, steal: 1 }, blurb: '+2 DEF, +1 STL' },
  { id: 'shoe_splash', kind: 'shoes', name: 'Splash Runners', price: 1500, color: '#f2b705', accent: '#111318', boosts: { three: 2, mid: 1 }, blurb: '+2 3PT, +1 MID' },
  { id: 'shoe_king', kind: 'shoes', name: 'Court Kings', price: 1400, color: '#7c3aed', accent: '#f2b705', boosts: { dunk: 2, finish: 1, vertical: 1 }, blurb: '+2 DNK, +1 FIN, +1 VRT' },
  { id: 'shoe_legacy', kind: 'shoes', name: 'Legacy Elite', price: 3600, color: '#ff5b14', accent: '#111318', boosts: { three: 1, finish: 1, speed: 1, vertical: 1, handles: 1, perimD: 1 }, blurb: '+1 to six key ratings' },
  { id: 'hb_white', kind: 'headband', name: 'Headband — White', price: 120, color: '#ffffff', blurb: 'Classic look' },
  { id: 'hb_black', kind: 'headband', name: 'Headband — Black', price: 120, color: '#111318', blurb: 'Stealth' },
  { id: 'hb_red', kind: 'headband', name: 'Headband — Red', price: 140, color: '#e02f2f', blurb: 'Bold' },
  { id: 'as_white', kind: 'armSleeve', name: 'Shooting Sleeve — White', price: 180, color: '#ffffff', blurb: 'Shooting arm sleeve' },
  { id: 'as_black', kind: 'armSleeve', name: 'Shooting Sleeve — Black', price: 180, color: '#111318', blurb: 'Shooting arm sleeve' },
  { id: 'ls_black', kind: 'legSleeve', name: 'Leg Sleeve — Black', price: 160, color: '#111318', blurb: 'Compression sleeve' },
  { id: 'ls_white', kind: 'legSleeve', name: 'Leg Sleeve — White', price: 160, color: '#ffffff', blurb: 'Compression sleeve' },
  { id: 'wb_white', kind: 'wristbands', name: 'Wristbands — White', price: 80, color: '#ffffff', blurb: 'Both wrists' },
  { id: 'wb_orange', kind: 'wristbands', name: 'Wristbands — Blaze', price: 90, color: '#ff6a13', blurb: 'Both wrists' },
]

export function shopItem(id: string | null) {
  return SHOP.find((s) => s.id === id) ?? null
}

// ------------------------------------------------------------------ helpers
export const DIFF_XP: Record<Difficulty, number> = { rookie: 0.8, pro: 1, allstar: 1.2, superstar: 1.4, hof: 1.65 }

export function xpForLevel(level: number) {
  return 260 + level * 95
}

function emptyTotals(): StatTotals {
  return { ...emptyStats(), gp: 0, w: 0, l: 0 }
}

function msg(from: string, title: string, body: string): InboxMessage {
  return { id: uid('m'), from, title, body, read: false, at: Date.now() }
}

export function careerOvr(save: CareerSave) {
  return overall(effectivePlayer(save).attributes, save.player.position)
}

export function baseOvr(save: CareerSave) {
  return overall(save.player.attributes, save.player.position)
}

/** Player with gear boosts and equipped cosmetics applied. */
export function effectivePlayer(save: CareerSave): PlayerProfile {
  const p = save.player
  const attrs = { ...p.attributes }
  const shoes = shopItem(save.inventory.shoes)
  if (shoes?.boosts) for (const [k, v] of Object.entries(shoes.boosts)) attrs[k as AttrKey] = Math.min(99, attrs[k as AttrKey] + (v ?? 0))
  const look: Appearance = {
    ...p.appearance,
    shoeColor: shoes?.color ?? p.appearance.shoeColor,
    shoeAccent: shoes?.accent ?? p.appearance.shoeAccent,
    headband: shopItem(save.inventory.headband)?.color ?? null,
    armSleeve: shopItem(save.inventory.armSleeve)?.color ?? null,
    legSleeve: shopItem(save.inventory.legSleeve)?.color ?? null,
    wristbands: shopItem(save.inventory.wristbands)?.color ?? null,
  }
  return { ...p, attributes: attrs, appearance: look }
}

export function chapterName(c: Chapter) {
  return { blacktop: 'Chapter 1 · The Blacktop', circuit: 'Chapter 2 · City Circuit', combine: 'Chapter 3 · The Combine', pro: 'Pro Hoops League' }[c]
}

export function reputationTier(followers: number) {
  if (followers >= 1_000_000) return 'Legend'
  if (followers >= 250_000) return 'Superstar'
  if (followers >= 60_000) return 'All-Star'
  if (followers >= 15_000) return 'Starter'
  if (followers >= 3_000) return 'Rising'
  return 'Unknown'
}

// ------------------------------------------------------------------ creation
const LADDER: [string, string, Position, number][] = [
  ['"Lil Nate"', 'Rollins', 'PG', 54],
  ['"Deuce"', 'Marsh', 'SG', 58],
  ['"Big Tank"', 'Okoye', 'C', 61],
  ['"Silk"', 'Fontaine', 'SF', 64],
  ['"King Ray"', 'Calloway', 'PF', 68],
]

export function newCareer(slot: number, d: CreateDraft): CareerSave {
  const arch = getArchetype(d.archetype)
  const attrs = { ...arch.base }
  for (const k of Object.keys(attrs) as AttrKey[]) attrs[k] = Math.min(attrCap(arch, k, d.heightCm), attrs[k])
  const player: PlayerProfile = {
    id: 'me',
    firstName: d.firstName.trim() || 'Rookie',
    lastName: d.lastName.trim() || 'Baller',
    number: d.number,
    position: d.position,
    heightCm: d.heightCm,
    attributes: attrs,
    badges: { [arch.signatureBadge]: 1 },
    appearance: d.appearance,
    archetype: arch.id,
  }
  const ladder = LADDER.map(([f, l, pos, ovr], i) => makeStreetPlayer(`ladder_${slot}_${i}_${Date.now() % 1000}`, pos, ovr, f, l))
  const save: CareerSave = {
    version: 1,
    slot,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    player,
    level: 1,
    xp: 0,
    sp: 8,
    coins: 400,
    followers: 120,
    chapter: 'blacktop',
    difficulty: d.difficulty,
    blacktop: { ladder, beaten: 0 },
    circuit: { recruits: [], teammates: [], bracket: null, runs: 0 },
    combine: { threeScore: null, oneOnOne: null, pick: null, teamId: null },
    pro: null,
    stats: { career: emptyTotals(), season: emptyTotals(), log: [], highs: { pts: 0, reb: 0, ast: 0, stl: 0, blk: 0, tpm: 0 } },
    trophies: [],
    inbox: [],
    inventory: { owned: ['shoe_street'], shoes: 'shoe_street', headband: null, armSleeve: null, legSleeve: null, wristbands: null },
    legacy: 0,
    endorsements: [],
    trainedSinceGame: false,
    hallOfFame: false,
  }
  save.inbox.push(
    msg(
      'Coach Dre',
      'Welcome to Rucker Lane',
      `${player.firstName}, nobody knows your name yet. That changes on the blacktop. Beat the five kings of this park and the city will start talking. You have 8 skill points — spend them in Upgrades before your first game.`,
    ),
  )
  return save
}

// ------------------------------------------------------------------ events
function streetRecruits(save: CareerSave) {
  const rng = mulberry32(hashString(`${save.createdAt}_recruits_${save.circuit.runs}`))
  const pos: Position[] = ['PG', 'SG', 'SF', 'PF', 'C', 'SF']
  const ovr = [60, 62, 64, 66, 68, 71]
  return pos.map((p, i) => {
    const r = generatePlayer(rng, `recruit_${i}`, p, ovr[i], new Set([save.player.number]))
    return r
  })
}

export function recruitCost(p: PlayerProfile) {
  const o = overall(p.attributes, p.position)
  return Math.max(0, Math.round((o - 61) * 55 / 10) * 10)
}

function circuitTeamName(save: CareerSave): TeamInfo {
  const mates = save.circuit.recruits.filter((r) => save.circuit.teammates.includes(r.id))
  return {
    id: 'mycrew',
    city: save.player.lastName,
    name: 'Crew',
    abbr: save.player.lastName.slice(0, 3).toUpperCase(),
    primary: '#ff5b14',
    secondary: '#14161c',
    roster: [save.player, ...mates],
    tier: 'street',
  }
}

export function getProTeam(save: CareerSave) {
  return getTeam(save.pro?.teamId ?? save.combine.teamId ?? PRO_TEAMS[0].id)
}

function topPlayers(team: TeamInfo, n: number) {
  return [...team.roster].sort((a, b) => overall(b.attributes, b.position) - overall(a.attributes, a.position)).slice(0, n)
}

export function nextEvent(save: CareerSave): CareerEvent {
  switch (save.chapter) {
    case 'blacktop': {
      const opp = save.blacktop.ladder[save.blacktop.beaten]
      return {
        id: `bt:${save.blacktop.beaten}`,
        kind: 'match',
        chapterLabel: chapterName('blacktop'),
        title: `King of the Park · ${save.blacktop.beaten + 1} of 5`,
        subtitle: `1v1 vs ${fullName(opp)} · First to 11`,
        opponent: opp,
        canSim: false,
      }
    }
    case 'circuit': {
      if (save.circuit.teammates.length < 2) {
        return { id: 'cc:recruit', kind: 'recruit', chapterLabel: chapterName('circuit'), title: 'Build Your Crew', subtitle: 'Recruit two teammates for the City Circuit 3v3 tournament', canSim: false }
      }
      const br = save.circuit.bracket!
      const roundNames = ['Quarterfinal', 'Semifinal', 'Championship']
      const oppId = bracketOpponent(br)
      const opp = getTeam(oppId)
      return {
        id: `cc:${br.round}`,
        kind: 'match',
        chapterLabel: chapterName('circuit'),
        title: `City Circuit · ${roundNames[br.round]}`,
        subtitle: `3v3 vs ${opp.city} ${opp.name} · First to 15`,
        opponent: opp,
        canSim: false,
      }
    }
    case 'combine': {
      if (save.combine.threeScore === null) {
        return { id: 'cb:3pt', kind: 'contest', chapterLabel: chapterName('combine'), title: 'Combine · Shooting Drill', subtitle: '60-second, five-rack three-point test. Scouts are watching.', canSim: false }
      }
      if (!save.combine.oneOnOne) {
        const opp = combineRival(save)
        return { id: 'cb:1v1', kind: 'match', chapterLabel: chapterName('combine'), title: 'Combine · Prospect Showdown', subtitle: `1v1 vs top prospect ${fullName(opp)} · First to 11`, opponent: opp, canSim: false }
      }
      return { id: 'cb:draft', kind: 'draft', chapterLabel: chapterName('combine'), title: 'Draft Night', subtitle: 'The commissioner is at the podium. Find out where you land.', canSim: false }
    }
    case 'pro': {
      const pro = save.pro!
      if (pro.phase === 'offseason') {
        return { id: 'pro:offseason', kind: 'offseason', chapterLabel: `Season ${pro.season} · Offseason`, title: 'Free Agency', subtitle: 'Review contract offers and start the next season', canSim: false }
      }
      if (pro.phase === 'regular') {
        const half = Math.floor(save_rounds(pro) / 2)
        if (pro.round === half && pro.allStar.invited && !pro.allStar.contestDone) {
          return { id: 'pro:3pt', kind: 'contest', chapterLabel: `Season ${pro.season} · All-Star Weekend`, title: 'Three-Point Contest', subtitle: 'Two rounds against the league’s best shooters', canSim: true }
        }
        if (pro.round === half && pro.allStar.selected && !pro.allStar.gameDone) {
          return { id: 'pro:asg', kind: 'match', chapterLabel: `Season ${pro.season} · All-Star Weekend`, title: 'All-Star Game', subtitle: '3v3 with the league’s elite · First to 15', canSim: true }
        }
        const g = userGame(pro)
        if (g) {
          const home = g.home === pro.teamId
          const opp = getTeam(home ? g.away : g.home)
          return {
            id: `pro:g:${pro.round}`,
            kind: 'match',
            chapterLabel: `Season ${pro.season} · Regular Season`,
            title: `Game ${pro.round + 1} of ${save_rounds(pro)}`,
            subtitle: `${home ? 'vs' : '@'} ${opp.city} ${opp.name} · First to 15`,
            opponent: opp,
            canSim: true,
          }
        }
      }
      if (pro.phase === 'playoffs' && pro.playoffs) {
        const po = pro.playoffs
        if (po.champion) {
          return { id: 'pro:champion', kind: 'champion', chapterLabel: `Season ${pro.season} · Playoffs`, title: po.champion === pro.teamId ? 'Champions!' : 'Season Over', subtitle: 'See the awards and head into the offseason', canSim: false }
        }
        const s = userSeries(pro)
        if (s) {
          const opp = getTeam(s.a === pro.teamId ? s.b : s.a)
          const mine = s.a === pro.teamId ? s.winsA : s.winsB
          const theirs = s.a === pro.teamId ? s.winsB : s.winsA
          const stage = po.final ? 'Finals' : 'Semifinals'
          return {
            id: `pro:po`,
            kind: 'match',
            chapterLabel: `Season ${pro.season} · Playoffs`,
            title: `${stage} · Game ${mine + theirs + 1}`,
            subtitle: `vs ${opp.city} ${opp.name} · Series ${mine}-${theirs} · Best of ${s.bestOf}`,
            opponent: opp,
            canSim: true,
          }
        }
        return { id: 'pro:champion', kind: 'champion', chapterLabel: `Season ${pro.season} · Playoffs`, title: 'Season Over', subtitle: 'Your team was eliminated. See the awards.', canSim: false }
      }
      return { id: 'pro:champion', kind: 'champion', chapterLabel: `Season ${pro.season}`, title: 'Season Complete', subtitle: 'Head into the offseason', canSim: false }
    }
  }
}

function save_rounds(pro: ProState) {
  return Math.max(...pro.schedule.map((g) => g.round)) + 1
}

function userGame(pro: ProState) {
  return pro.schedule.find((g) => g.round === pro.round && (g.home === pro.teamId || g.away === pro.teamId))
}

function userSeries(pro: ProState): Series | null {
  const po = pro.playoffs
  if (!po) return null
  if (po.final) return po.final.a === pro.teamId || po.final.b === pro.teamId ? po.final : null
  return po.semis.find((s) => (s.a === pro.teamId || s.b === pro.teamId) && seriesWinner(s) === null) ?? null
}

export function seriesWinner(s: Series) {
  const need = Math.ceil(s.bestOf / 2)
  if (s.winsA >= need) return s.a
  if (s.winsB >= need) return s.b
  return null
}

function combineRival(save: CareerSave) {
  return makeStreetPlayer(`rival_${save.createdAt}`, save.player.position === 'C' ? 'PF' : 'SF', Math.min(80, baseOvr(save) + 4), 'Malik', 'Price')
}

function bracketOpponent(br: Bracket) {
  return br.opponents[Math.min(br.round, br.opponents.length - 1)]
}

// ------------------------------------------------------------------ session builders
export interface CareerSession {
  kind: 'match' | 'contest'
  eventId: string
  match?: MatchConfig
  contest?: ContestConfig
  jersey?: JerseyStyle
}

const GAME_LEN = { oneOnOne: { target: 11, time: 300 }, threes: { target: 15, time: 360 } }

export function buildSession(save: CareerSave, eventId: string): CareerSession | null {
  const me = effectivePlayer(save)
  const diff = save.difficulty
  if (eventId.startsWith('bt:')) {
    const opp = save.blacktop.ladder[save.blacktop.beaten]
    const myTeam: TeamInfo = { ...PARK_TEAM, id: 'me_park', city: save.player.lastName, name: 'Hooper', abbr: save.player.lastName.slice(0, 3).toUpperCase(), roster: [me] }
    const oppTeam: TeamInfo = { ...PARK_TEAM, id: 'park_king', city: opp.lastName, name: 'Park', abbr: opp.lastName.slice(0, 3).toUpperCase(), primary: '#1f6feb', secondary: '#0b1120', roster: [opp] }
    return {
      kind: 'match',
      eventId,
      match: {
        mode: '1v1',
        sides: [
          { team: myTeam, players: [me], jersey: { base: '#f3f3f1', trim: '#ff5b14', number: '#ff5b14', shorts: '#1b1d22' }, human: true },
          { team: oppTeam, players: [opp], jersey: { base: '#1f6feb', trim: '#0b1120', number: '#ffffff', shorts: '#0b1120' }, human: false },
        ],
        targetScore: GAME_LEN.oneOnOne.target,
        timeLimit: GAME_LEN.oneOnOne.time,
        shotClock: 12,
        difficulty: diff,
        courtTeam: PARK_TEAM,
        label: 'KING OF THE PARK',
        focusPlayerId: 'me',
      },
    }
  }
  if (eventId.startsWith('cc:')) {
    const crew = circuitTeamName(save)
    const br = save.circuit.bracket!
    const opp = getTeam(bracketOpponent(br))
    const mates = save.circuit.recruits.filter((r) => save.circuit.teammates.includes(r.id))
    return {
      kind: 'match',
      eventId,
      match: {
        mode: '3v3',
        sides: [
          { team: crew, players: [me, ...mates].slice(0, 3), jersey: { base: '#ff5b14', trim: '#14161c', number: '#ffffff', shorts: '#14161c' }, human: true },
          { team: opp, players: topPlayers(opp, 3), jersey: jerseyFor(opp, false), human: false },
        ],
        targetScore: GAME_LEN.threes.target,
        timeLimit: GAME_LEN.threes.time,
        shotClock: 12,
        difficulty: diff,
        courtTeam: opp,
        label: 'CITY CIRCUIT',
        focusPlayerId: 'me',
      },
    }
  }
  if (eventId === 'cb:3pt' || eventId === 'train:3pt') {
    return {
      kind: 'contest',
      eventId,
      jersey: { base: '#1b1d22', trim: '#ff5b14', number: '#ffffff', shorts: '#1b1d22' },
      contest: { shooters: [me], humanIndex: 0, moneyRack: 4, rounds: 1, duration: eventId === 'train:3pt' ? 45 : 60, racks: 5, courtTeam: PARK_TEAM, label: eventId === 'train:3pt' ? 'SHOOTING DRILL' : 'DRAFT COMBINE', difficulty: diff },
    }
  }
  if (eventId === 'cb:1v1') {
    const opp = combineRival(save)
    const myTeam: TeamInfo = { ...PARK_TEAM, id: 'combine_me', city: save.player.lastName, name: 'Prospect', abbr: save.player.lastName.slice(0, 3).toUpperCase(), roster: [me] }
    const oppTeam: TeamInfo = { ...PARK_TEAM, id: 'combine_rival', city: 'Price', name: 'Prospect', abbr: 'PRC', primary: '#c8102e', secondary: '#141414', roster: [opp] }
    return {
      kind: 'match',
      eventId,
      match: {
        mode: '1v1',
        sides: [
          { team: myTeam, players: [me], jersey: { base: '#1b1d22', trim: '#ff5b14', number: '#ffffff', shorts: '#1b1d22' }, human: true },
          { team: oppTeam, players: [opp], jersey: { base: '#f3f3f1', trim: '#c8102e', number: '#c8102e', shorts: '#f3f3f1' }, human: false },
        ],
        targetScore: GAME_LEN.oneOnOne.target,
        timeLimit: GAME_LEN.oneOnOne.time,
        shotClock: 12,
        difficulty: diff,
        courtTeam: PARK_TEAM,
        label: 'DRAFT COMBINE',
        focusPlayerId: 'me',
      },
    }
  }
  const pro = save.pro
  if (!pro) return null
  const myTeam = getTeam(pro.teamId)
  const myRoster = [me, ...topPlayers(myTeam, 2)]
  const myTeamWithMe: TeamInfo = { ...myTeam, roster: [me, ...myTeam.roster] }
  if (eventId === 'pro:3pt') {
    const shooters = proShooters(save)
    return {
      kind: 'contest',
      eventId,
      jersey: jerseyFor(myTeam, false),
      contest: { shooters: [me, ...shooters], humanIndex: 0, moneyRack: 2, rounds: 2, duration: 60, racks: 5, courtTeam: PRO_TEAMS[(pro.season + 3) % PRO_TEAMS.length], label: 'ALL-STAR 3PT CONTEST', difficulty: diff },
    }
  }
  if (eventId === 'pro:asg') {
    const stars = PRO_TEAMS.flatMap((t) => topPlayers(t, 1))
    const east = allStarTeam('as_east', 'East Stars', [me, stars[0], stars[2]], '#1d4ed8', '#f2f2f2')
    const west = allStarTeam('as_west', 'West Stars', [stars[1], stars[3], stars[4]], '#c8102e', '#f2f2f2')
    return {
      kind: 'match',
      eventId,
      match: {
        mode: '3v3',
        sides: [
          { team: east, players: east.roster, jersey: { base: '#1d4ed8', trim: '#f2f2f2', number: '#ffffff', shorts: '#1d4ed8' }, human: true },
          { team: west, players: west.roster, jersey: { base: '#c8102e', trim: '#f2f2f2', number: '#ffffff', shorts: '#c8102e' }, human: false },
        ],
        targetScore: 15,
        timeLimit: 360,
        shotClock: 12,
        difficulty: diff,
        courtTeam: PRO_TEAMS[(pro.season + 3) % PRO_TEAMS.length],
        label: 'ALL-STAR GAME',
        focusPlayerId: 'me',
      },
    }
  }
  let oppId: string | null = null
  let home = true
  let label = 'PRO HOOPS LEAGUE'
  if (eventId.startsWith('pro:g:')) {
    const g = userGame(pro)
    if (!g) return null
    home = g.home === pro.teamId
    oppId = home ? g.away : g.home
  } else if (eventId === 'pro:po') {
    const s = userSeries(pro)
    if (!s) return null
    oppId = s.a === pro.teamId ? s.b : s.a
    label = pro.playoffs?.final ? 'PHL FINALS' : 'PHL PLAYOFFS'
  }
  if (!oppId) return null
  const opp = getTeam(oppId)
  const sides: MatchConfig['sides'] = [
    { team: myTeamWithMe, players: myRoster, jersey: jerseyFor(myTeam, home), human: true },
    { team: opp, players: topPlayers(opp, 3), jersey: jerseyFor(opp, !home), human: false },
  ]
  return {
    kind: 'match',
    eventId,
    match: {
      mode: '3v3',
      sides,
      targetScore: 15,
      timeLimit: 360,
      shotClock: 12,
      difficulty: diff,
      courtTeam: home ? myTeam : opp,
      label,
      focusPlayerId: 'me',
    },
  }
}

function proShooters(save: CareerSave) {
  const all = PRO_TEAMS.flatMap((t) => t.roster).filter((p) => p.id !== 'me')
  return all.sort((a, b) => b.attributes.three - a.attributes.three).slice(0, 5)
}

// ------------------------------------------------------------------ rewards
function clone<T>(x: T): T {
  return JSON.parse(JSON.stringify(x)) as T
}

function addStats(t: StatTotals, s: PlayerGameStats, won: boolean) {
  t.gp++
  if (won) t.w++
  else t.l++
  // totals saved before a stat existed start it from zero
  for (const k of Object.keys(emptyStats()) as (keyof PlayerGameStats)[]) t[k] = (t[k] ?? 0) + (s[k] ?? 0)
}

function grantXp(save: CareerSave, amount: number, r: Rewards) {
  save.xp += amount
  r.xp += amount
  while (save.xp >= xpForLevel(save.level)) {
    save.xp -= xpForLevel(save.level)
    save.level++
    save.sp += 4
    r.levelUps++
    r.spGained += 4
  }
}

const ENDORSEMENTS: [number, string, number][] = [
  [2500, 'Swish Energy Drinks', 40],
  [12000, 'Aero Glide Footwear', 80],
  [50000, 'Pro Hoops Gaming', 140],
  [200000, 'Legacy Watches', 240],
]

function endorsementIncome(save: CareerSave) {
  return ENDORSEMENTS.filter(([, name]) => save.endorsements.includes(name)).reduce((a, [, , c]) => a + c, 0)
}

function checkEndorsements(save: CareerSave, r: Rewards) {
  for (const [need, name, coins] of ENDORSEMENTS) {
    if (save.followers >= need && !save.endorsements.includes(name)) {
      save.endorsements.push(name)
      r.messages.push(`Endorsement signed: ${name} (+${coins} coins per game)`)
      save.inbox.unshift(msg('Agent Mia Chen', `Deal signed with ${name}`, `Your following is exploding. ${name} wants you as the face of their next campaign. You will earn ${coins} extra coins after every game.`))
    }
  }
}

function newRewards(): Rewards {
  return { xp: 0, coins: 0, followers: 0, levelUps: 0, spGained: 0, messages: [], attributeGains: [] }
}

function awardTrophy(save: CareerSave, t: Omit<Trophy, 'id'>, legacy: number, r: Rewards) {
  save.trophies.push({ ...t, id: uid('t') })
  save.legacy += legacy
  r.messages.push(`Trophy earned: ${t.name}`)
  checkHallOfFame(save, r)
}

function checkHallOfFame(save: CareerSave, r: Rewards) {
  if (!save.hallOfFame && save.legacy >= 1000) {
    save.hallOfFame = true
    save.trophies.push({ id: uid('t'), name: 'Hall of Fame', detail: 'Enshrined among the all-time greats', tier: 'legend' })
    r.messages.push('You have been inducted into the Hall of Fame!')
    save.inbox.unshift(msg('Pro Hoops League', 'Welcome to the Hall of Fame', 'Your legacy is cemented forever. Keep playing — every banner you raise adds to the story.'))
  }
}

function newsFor(save: CareerSave, won: boolean, s: PlayerGameStats, opp: string) {
  const name = shortName(save.player)
  if (s.pts >= 12) return `${name} erupts for ${s.pts} as ${won ? 'the crowd goes wild' : 'it still is not enough'} against ${opp}`
  if (s.dunks >= 2) return `${name} puts on an aerial show with ${s.dunks} dunks vs ${opp}`
  if (s.ast >= 4) return `${name} orchestrates with ${s.ast} assists vs ${opp}`
  if (s.stl + s.blk >= 4) return `${name} locks down ${opp}: ${s.stl} steals, ${s.blk} blocks`
  return won ? `${name} and company handle business against ${opp}` : `${opp} edges ${name} in a hard-fought battle`
}

/** Apply a played (or simmed) match to the career. */
export function applyMatchResult(input: CareerSave, eventId: string, result: MatchResult, simmed = false): { save: CareerSave; rewards: Rewards } {
  const save = clone(input)
  const r = newRewards()
  const s = result.stats['me'] ?? emptyStats()
  const won = result.winner === 0
  const mult = DIFF_XP[save.difficulty] * (simmed ? 0.55 : 1) * (save.chapter === 'pro' ? 1.3 : 1)
  const xp = Math.round(((won ? 130 : 65) + s.pts * 5 + s.reb * 4 + s.ast * 5 + s.stl * 6 + s.blk * 6 + s.greens * 6 + s.dunks * 6) * mult)
  grantXp(save, xp, r)
  const salaryShare = save.pro ? Math.round(save.pro.salary / 14) : 0
  const coins = Math.round((won ? 160 : 80) * (simmed ? 0.6 : 1)) + salaryShare + endorsementIncome(save)
  save.coins += coins
  r.coins += coins
  const followers = Math.round((s.pts * 14 + result.highlights.length * 160 + (won ? 220 : 60)) * (1 + save.level * 0.04) * (save.chapter === 'pro' ? 2.2 : 1) * (simmed ? 0.5 : 1))
  save.followers += followers
  r.followers += followers
  checkEndorsements(save, r)
  addStats(save.stats.career, s, won)
  addStats(save.stats.season, s, won)
  for (const k of ['pts', 'reb', 'ast', 'stl', 'blk', 'tpm'] as const) {
    if (s[k] > save.stats.highs[k]) {
      if (save.stats.highs[k] > 0 && !simmed) r.messages.push(`New career high: ${s[k]} ${k.toUpperCase()}`)
      save.stats.highs[k] = s[k]
    }
  }
  const ev = nextEvent(input)
  const oppName = ev.opponent ? ('lastName' in ev.opponent ? fullName(ev.opponent) : `${ev.opponent.city} ${ev.opponent.name}`) : 'All-Stars'
  save.stats.log.unshift({ id: uid('g'), label: ev.title, opp: oppName, won, score: `${result.score[0]}-${result.score[1]}`, stats: s, simmed })
  save.stats.log = save.stats.log.slice(0, 40)
  save.trainedSinceGame = false
  if (save.pro) save.pro.trained = false

  // chapter progression
  if (eventId.startsWith('bt:')) {
    if (won) {
      save.blacktop.beaten++
      const beaten = input.blacktop.ladder[input.blacktop.beaten]
      r.messages.push(`${fullName(beaten)} has been dethroned`)
      if (save.blacktop.beaten >= 5) {
        save.chapter = 'circuit'
        save.circuit.recruits = streetRecruits(save)
        awardTrophy(save, { name: 'King of the Park', detail: 'Ran the Rucker Lane ladder', tier: 'bronze' }, 40, r)
        save.inbox.unshift(msg('Coach Dre', 'The city is calling', 'Five for five. You own this park. The City Circuit 3v3 tournament starts next week — you will need a crew. Pick your guys wisely.'))
      }
    } else {
      save.inbox.unshift(msg('Coach Dre', 'Run it back', 'Losses teach more than wins. Spend your skill points, hit the training court, and challenge him again.'))
    }
  } else if (eventId.startsWith('cc:')) {
    const br = save.circuit.bracket!
    const opp = bracketOpponent(input.circuit.bracket!)
    br.results.push({ a: 'mycrew', b: opp, winner: won ? 'mycrew' : opp, score: `${result.score[0]}-${result.score[1]}` })
    if (won) {
      if (br.round >= 2) {
        br.alive = false
        save.chapter = 'combine'
        awardTrophy(save, { name: 'City Circuit Champion', detail: 'Won the 3v3 street tournament', tier: 'silver' }, 60, r)
        save.inbox.unshift(msg('Agent Mia Chen', 'Scouts want you at the Combine', 'I am Mia — I represent players who are about to blow up. Pro scouts saw the Circuit final. You are invited to the Draft Combine. Show them that jumper.'))
      } else {
        br.round++
      }
    } else {
      br.alive = false
      save.circuit.runs++
      save.circuit.bracket = newBracket(save)
      save.inbox.unshift(msg('Coach Dre', 'Eliminated — for now', 'The Circuit runs again next week. Same crew or new blood — your call. Get better and come back hungry.'))
    }
  } else if (eventId === 'cb:1v1') {
    save.combine.oneOnOne = { won, margin: result.score[0] - result.score[1] }
  } else if (eventId.startsWith('pro:')) {
    applyProGame(save, eventId, result, r)
  }
  save.updatedAt = Date.now()
  if (!eventId.startsWith('pro:') || eventId.startsWith('pro:g:')) {
    save.inbox.unshift(msg('HoopWire', 'Game Recap', newsFor(save, won, s, oppName)))
  }
  save.inbox = save.inbox.slice(0, 40)
  return { save, rewards: r }
}

export function applyContestResult(input: CareerSave, eventId: string, result: ContestResult): { save: CareerSave; rewards: Rewards } {
  const save = clone(input)
  const r = newRewards()
  const best = result.humanBest
  const mult = DIFF_XP[save.difficulty]
  grantXp(save, Math.round((70 + best * 7 + result.greens * 4 + (result.humanWon ? 150 : 0)) * mult), r)
  const coins = 60 + best * 8 + (result.humanWon ? 500 : 0)
  save.coins += coins
  r.coins += coins
  const f = Math.round((best * 30 + (result.humanWon ? 1500 : 0)) * (save.chapter === 'pro' ? 3 : 1))
  save.followers += f
  r.followers += f
  checkEndorsements(save, r)
  if (eventId === 'cb:3pt') {
    save.combine.threeScore = best
    r.messages.push(`Combine shooting score: ${best}`)
  } else if (eventId === 'train:3pt') {
    const gain = best >= 22 ? 2 : best >= 14 ? 1 : 0
    if (gain > 0) bumpAttr(save, 'three', gain, r)
    if (best >= 18) bumpAttr(save, 'mid', 1, r)
    save.trainedSinceGame = true
    if (save.pro) save.pro.trained = true
  } else if (eventId === 'pro:3pt' && save.pro) {
    save.pro.allStar.contestDone = true
    save.pro.allStar.contestWon = result.humanWon
    if (result.humanWon) {
      awardTrophy(save, { name: 'Three-Point Contest Champion', detail: `All-Star Weekend · Season ${save.pro.season}`, season: save.pro.season, tier: 'gold' }, 50, r)
      save.pro.awards.push('3PT Contest Champion')
    }
  }
  save.updatedAt = Date.now()
  return { save, rewards: r }
}

function bumpAttr(save: CareerSave, key: AttrKey, amount: number, r: Rewards) {
  const arch = getArchetype(save.player.archetype)
  const cap = attrCap(arch, key, save.player.heightCm)
  const before = save.player.attributes[key]
  save.player.attributes[key] = Math.min(cap, before + amount)
  const got = save.player.attributes[key] - before
  if (got > 0) r.attributeGains.push({ key, amount: got })
}

// ------------------------------------------------------------------ circuit bracket
export function newBracket(save: CareerSave): Bracket {
  const rng = mulberry32(hashString(`${save.createdAt}_br_${save.circuit.runs}`))
  const byStrength = [...STREET_TEAMS].sort((a, b) => teamOvr(a) - teamOvr(b)).map((t) => t.id)
  const weak = byStrength.slice(0, 3)
  const mid = byStrength.slice(3, 6)
  const opponents = [pick(rng, weak), pick(rng, mid), byStrength[byStrength.length - 1]]
  return { teams: ['mycrew', ...byStrength], opponents, round: 0, alive: true, results: [] }
}

export function setRecruits(input: CareerSave, ids: string[]): CareerSave {
  const save = clone(input)
  const picked = save.circuit.recruits.filter((r) => ids.includes(r.id))
  const cost = picked.reduce((a, p) => a + recruitCost(p), 0)
  if (cost > save.coins || picked.length !== 2) return input
  save.coins -= cost
  save.circuit.teammates = ids
  save.circuit.bracket = newBracket(save)
  save.updatedAt = Date.now()
  return save
}

// ------------------------------------------------------------------ draft
export function runDraft(input: CareerSave): { save: CareerSave; pick: number; team: TeamInfo } {
  const save = clone(input)
  const ovr = baseOvr(save)
  const score = (save.combine.threeScore ?? 10) * 1.2 + (save.combine.oneOnOne?.won ? 14 : 0) + Math.max(-6, Math.min(8, save.combine.oneOnOne?.margin ?? 0)) + (ovr - 60) * 1.6
  const pick = Math.max(1, Math.min(8, Math.round(9 - score / 8)))
  // worst teams pick first: order by team OVR ascending
  const order = [...PRO_TEAMS].sort((a, b) => teamOvr(a) - teamOvr(b))
  const team = order[pick - 1]
  save.combine.pick = pick
  save.combine.teamId = team.id
  save.chapter = 'pro'
  save.pro = newSeason(save, team.id, 1, 900 + (9 - pick) * 120)
  save.stats.season = emptyTotals()
  awardTrophy(save, { name: `Draft Pick #${pick}`, detail: `Selected by the ${team.city} ${team.name}`, tier: pick <= 3 ? 'gold' : 'silver' }, 30 + (9 - pick) * 5, newRewards())
  save.inbox.unshift(msg(`${team.city} ${team.name}`, 'Welcome to the league', `With the #${pick} pick, we selected you. We expect you to make an impact from day one. Season 1 tips off now.`))
  save.updatedAt = Date.now()
  return { save, pick, team }
}

// ------------------------------------------------------------------ pro seasons
function roundRobin(ids: string[]) {
  const n = ids.length
  const arr = [...ids]
  const rounds: [string, string][][] = []
  for (let r = 0; r < n - 1; r++) {
    const games: [string, string][] = []
    for (let i = 0; i < n / 2; i++) {
      const a = arr[i]
      const b = arr[n - 1 - i]
      games.push(r % 2 === 0 ? [a, b] : [b, a])
    }
    rounds.push(games)
    arr.splice(1, 0, arr.pop()!)
  }
  return rounds
}

export function newSeason(save: CareerSave, teamId: string, season: number, salary: number): ProState {
  const ids = PRO_TEAMS.map((t) => t.id)
  const rr = roundRobin(ids)
  const schedule: ScheduledGame[] = []
  rr.forEach((games, r) => games.forEach(([h, a]) => schedule.push({ round: r, home: h, away: a })))
  rr.forEach((games, r) => games.forEach(([h, a]) => schedule.push({ round: r + rr.length, home: a, away: h })))
  const standings: ProState['standings'] = {}
  for (const id of ids) standings[id] = { w: 0, l: 0, pf: 0, pa: 0 }
  const ovr = overall(save.player.attributes, save.player.position)
  return {
    season,
    year: 2025 + season,
    teamId,
    schedule,
    round: 0,
    standings,
    phase: 'regular',
    allStar: { invited: false, contestDone: false, contestWon: false, selected: false, gameDone: false },
    playoffs: null,
    salary,
    trained: false,
    awards: [],
  }
  void ovr
}

function teamStrength(save: CareerSave, id: string) {
  const base = teamOvr(getTeam(id))
  if (save.pro && id === save.pro.teamId) return (base * 2 + careerOvr(save)) / 3
  return base
}

export function simScore(a: number, b: number, rng = Math.random, target = 15): [number, number] {
  const p = 1 / (1 + Math.exp(-(a - b) / 4.5))
  const aWins = rng() < p
  const loser = Math.max(4, Math.round(target - 1 - rng() * 8))
  return aWins ? [target, loser] : [loser, target]
}

function record(pro: ProState, home: string, away: string, hs: number, as: number) {
  const H = pro.standings[home]
  const A = pro.standings[away]
  H.pf += hs
  H.pa += as
  A.pf += as
  A.pa += hs
  if (hs > as) {
    H.w++
    A.l++
  } else {
    A.w++
    H.l++
  }
}

export function sortedStandings(pro: ProState) {
  return Object.entries(pro.standings)
    .map(([id, s]) => ({ id, ...s }))
    .sort((x, y) => y.w - x.w || y.pf - y.pa - (x.pf - x.pa))
}

function applyProGame(save: CareerSave, eventId: string, result: MatchResult, r: Rewards) {
  const pro = save.pro!
  const won = result.winner === 0
  if (eventId === 'pro:asg') {
    pro.allStar.gameDone = true
    if (won) {
      const s = result.stats['me']
      if (s && s.pts >= 6) {
        awardTrophy(save, { name: 'All-Star Game MVP', detail: `Season ${pro.season}`, season: pro.season, tier: 'gold' }, 40, r)
        pro.awards.push('All-Star MVP')
      }
    }
    return
  }
  if (eventId.startsWith('pro:g:')) {
    const g = userGame(pro)!
    const home = g.home === pro.teamId
    const hs = home ? result.score[0] : result.score[1]
    const as = home ? result.score[1] : result.score[0]
    g.result = { hs, as, user: true }
    record(pro, g.home, g.away, hs, as)
    // sim the rest of the round
    const rng = mulberry32(hashString(`${save.createdAt}_${pro.season}_${pro.round}`))
    for (const o of pro.schedule.filter((x) => x.round === pro.round && x !== g)) {
      const [h, a] = simScore(teamStrength(save, o.home), teamStrength(save, o.away), rng)
      o.result = { hs: h, as: a, user: false }
      record(pro, o.home, o.away, h, a)
    }
    pro.round++
    const rounds = save_rounds(pro)
    if (pro.round === Math.floor(rounds / 2)) {
      const ovr = careerOvr(save)
      const ppg = save.stats.season.gp ? save.stats.season.pts / save.stats.season.gp : 0
      pro.allStar.invited = save.player.attributes.three >= 70 || (save.stats.season.tpa > 6 && save.stats.season.tpm / save.stats.season.tpa > 0.38)
      pro.allStar.selected = ovr >= 74 || ppg >= 7
      if (pro.allStar.selected) {
        awardTrophy(save, { name: 'All-Star', detail: `Season ${pro.season} selection`, season: pro.season, tier: 'silver' }, 40, r)
        pro.awards.push('All-Star')
      }
      if (pro.allStar.invited || pro.allStar.selected) {
        save.inbox.unshift(msg('Pro Hoops League', 'All-Star Weekend', `${pro.allStar.selected ? 'You were voted into the All-Star Game. ' : ''}${pro.allStar.invited ? 'You are invited to the Three-Point Contest.' : ''}`))
      }
    }
    if (pro.round >= rounds) startPlayoffs(save, r)
    return
  }
  if (eventId === 'pro:po') {
    const s = userSeries(pro)!
    if ((s.a === pro.teamId) === won) s.winsA++
    else s.winsB++
    advancePlayoffs(save, r)
  }
}

function startPlayoffs(save: CareerSave, r: Rewards) {
  const pro = save.pro!
  pro.phase = 'playoffs'
  const seeds = sortedStandings(pro).map((x) => x.id)
  pro.playoffs = {
    semis: [
      { a: seeds[0], b: seeds[3], winsA: 0, winsB: 0, bestOf: 3 },
      { a: seeds[1], b: seeds[2], winsA: 0, winsB: 0, bestOf: 3 },
    ],
    final: null,
    champion: null,
  }
  const seed = seeds.indexOf(pro.teamId) + 1
  if (seed <= 4) {
    save.inbox.unshift(msg('Pro Hoops League', 'Playoff bound', `You clinched the #${seed} seed. Semifinals are best of three.`))
  } else {
    save.inbox.unshift(msg('Coach', 'Missed the playoffs', `We finished #${seed}. The playoffs go on without us — let’s use this time to get better.`))
  }
  advancePlayoffs(save, r)
}

function simSeriesStep(save: CareerSave, s: Series, rng: () => number) {
  while (seriesWinner(s) === null) {
    const [a, b] = simScore(teamStrength(save, s.a), teamStrength(save, s.b), rng)
    if (a > b) s.winsA++
    else s.winsB++
  }
}

function advancePlayoffs(save: CareerSave, r: Rewards) {
  const pro = save.pro!
  const po = pro.playoffs!
  const rng = mulberry32(hashString(`${save.createdAt}_po_${pro.season}_${po.semis.map((s) => s.winsA + s.winsB).join('')}`))
  const mine = (s: Series) => s.a === pro.teamId || s.b === pro.teamId
  if (!po.final) {
    for (const s of po.semis) if (!mine(s)) simSeriesStep(save, s, rng)
    const userIn = po.semis.find(mine)
    if (userIn && seriesWinner(userIn) === null) return
    if (po.semis.every((s) => seriesWinner(s) !== null)) {
      po.final = { a: seriesWinner(po.semis[0])!, b: seriesWinner(po.semis[1])!, winsA: 0, winsB: 0, bestOf: 3 }
      if (!mine(po.final)) simSeriesStep(save, po.final, rng)
    }
  }
  if (po.final && seriesWinner(po.final)) {
    po.champion = seriesWinner(po.final)
    finishSeason(save, r)
  }
}

function finishSeason(save: CareerSave, r: Rewards) {
  const pro = save.pro!
  const st = save.stats.season
  const gp = Math.max(1, st.gp)
  const ppg = st.pts / gp
  const seed = sortedStandings(pro).findIndex((x) => x.id === pro.teamId) + 1
  const ovr = careerOvr(save)
  if (pro.playoffs?.champion === pro.teamId) {
    awardTrophy(save, { name: 'PHL Champion', detail: `Season ${pro.season} title`, season: pro.season, tier: 'gold' }, 200, r)
    pro.awards.push('Champion')
  }
  if (seed <= 2 && ppg >= 6.5 && ovr >= 78) {
    awardTrophy(save, { name: 'Most Valuable Player', detail: `Season ${pro.season}`, season: pro.season, tier: 'gold' }, 150, r)
    pro.awards.push('MVP')
  }
  if (pro.season === 1 && ppg >= 4) {
    awardTrophy(save, { name: 'Rookie of the Year', detail: 'Season 1', season: 1, tier: 'silver' }, 60, r)
    pro.awards.push('Rookie of the Year')
  }
  if ((st.stl + st.blk) / gp >= 1.8) {
    awardTrophy(save, { name: 'Defensive Player of the Year', detail: `Season ${pro.season}`, season: pro.season, tier: 'gold' }, 80, r)
    pro.awards.push('DPOY')
  }
  save.legacy += st.w * 3
  checkHallOfFame(save, r)
  pro.phase = 'offseason'
  save.inbox.unshift(msg('Agent Mia Chen', 'Offseason is here', `Season ${pro.season} is in the books${pro.awards.length ? ` — ${pro.awards.join(', ')}` : ''}. Offers are coming in. Let’s talk free agency.`))
}

export function contractOffers(save: CareerSave) {
  const pro = save.pro!
  const ovr = careerOvr(save)
  const base = 900 + Math.max(0, ovr - 65) * 140 + pro.awards.length * 350
  const rng = mulberry32(hashString(`${save.createdAt}_offers_${pro.season}`))
  const others = PRO_TEAMS.filter((t) => t.id !== pro.teamId).sort(() => rng() - 0.5).slice(0, 2)
  return [
    { team: getTeam(pro.teamId), salary: Math.round(base * 1.05), note: 'Re-sign · Team loyalty bonus' },
    ...others.map((t, i) => ({ team: t, salary: Math.round(base * (1.12 + i * 0.08)), note: i === 0 ? 'Contender wants a closer' : 'Rebuilding around you' })),
  ]
}

export function startNextSeason(input: CareerSave, teamId: string, salary: number): CareerSave {
  const save = clone(input)
  const pro = save.pro!
  save.pro = newSeason(save, teamId, pro.season + 1, salary)
  save.stats.season = emptyTotals()
  save.trainedSinceGame = false
  const team = getTeam(teamId)
  save.inbox.unshift(msg(`${team.city} ${team.name}`, `Season ${pro.season + 1} tips off`, teamId === pro.teamId ? 'Same uniform, bigger goals. Let’s go get a ring.' : 'Welcome to your new home. The city is buzzing.'))
  save.updatedAt = Date.now()
  return save
}

// ------------------------------------------------------------------ sim
export function simCurrentGame(save: CareerSave, eventId: string): { save: CareerSave; rewards: Rewards; result: MatchResult } {
  const session = buildSession(save, eventId)!
  const cfg = session.match!
  const rng = Math.random
  const myStr = (teamOvr({ ...cfg.sides[0].team, roster: cfg.sides[0].players }) * 2 + careerOvr(save)) / 3
  const oppStr = teamOvr({ ...cfg.sides[1].team, roster: cfg.sides[1].players })
  const [a, b] = simScore(myStr + 1, oppStr, rng, cfg.targetScore)
  const me = effectivePlayer(save)
  const share = 0.3 + (me.attributes.three + me.attributes.finish) / 600
  const pts = Math.round(a * share * (0.7 + rng() * 0.6))
  const tpm = Math.min(Math.floor(pts / 3), Math.round((me.attributes.three / 99) * rng() * 3))
  const fgm = Math.max(0, Math.round((pts - tpm * 3) / 2) + tpm)
  const stats: PlayerGameStats = {
    pts,
    fgm,
    fga: fgm + Math.round(2 + rng() * 5),
    tpm,
    tpa: tpm + Math.round(rng() * 3),
    ast: Math.round((me.attributes.passing / 99) * rng() * 4),
    reb: Math.round((me.attributes.rebound / 99) * (1 + rng() * 5)),
    stl: Math.round((me.attributes.steal / 99) * rng() * 2.4),
    blk: Math.round((me.attributes.block / 99) * rng() * 2.4),
    tov: Math.round(rng() * 2),
    dunks: 0,
    greens: 0,
    ftm: 0,
    fta: 0,
  }
  const result: MatchResult = { score: [a, b], winner: a > b ? 0 : 1, stats: { me: stats }, durationSec: 0, highlights: [] }
  const out = applyMatchResult(save, eventId, result, true)
  return { ...out, result }
}

export function simContest(save: CareerSave, eventId: string): { save: CareerSave; rewards: Rewards } {
  const me = effectivePlayer(save)
  const score = simulateContest(me.attributes.three)
  const shooters = proShooters(save)
  const others = shooters.map((p) => simulateContest(p.attributes.three))
  const won = score >= Math.max(...others)
  return applyContestResult(save, eventId, {
    rounds: [[{ id: 'me', name: shortName(me), score }, ...shooters.map((p, i) => ({ id: p.id, name: shortName(p), score: others[i] }))]],
    humanScores: [score],
    champion: won ? shortName(me) : 'AI',
    humanWon: won,
    humanBest: score,
    makes: 0,
    attempts: 25,
    greens: 0,
  })
}

// ------------------------------------------------------------------ upgrades / training / shop
export function upgradeAttribute(input: CareerSave, key: AttrKey): CareerSave {
  const save = clone(input)
  const cur = save.player.attributes[key]
  const cap = attrCap(getArchetype(save.player.archetype), key, save.player.heightCm)
  const cost = upgradeCost(cur)
  if (cur >= cap || save.sp < cost) return input
  save.sp -= cost
  save.player.attributes[key] = cur + 1
  save.updatedAt = Date.now()
  return save
}

export function upgradeBadge(input: CareerSave, id: BadgeId): CareerSave {
  const save = clone(input)
  const def = BADGES.find((b) => b.id === id)!
  const tier = save.player.badges[id] ?? 0
  if (tier >= 4) return input
  const need = def.req[tier]
  const cost = def.cost[tier]
  if (save.player.attributes[def.attr] < need || save.sp < cost) return input
  save.sp -= cost
  save.player.badges[id] = tier + 1
  save.updatedAt = Date.now()
  return save
}

export interface Drill {
  id: string
  name: string
  focus: string
  attrs: AttrKey[]
  interactive?: boolean
}

export const DRILLS: Drill[] = [
  { id: 'shooting', name: 'Shooting Drill', focus: 'Live 3PT session · 45 seconds', attrs: ['three', 'mid'], interactive: true },
  { id: 'finishing', name: 'Finishing Circuit', focus: 'Layups & dunks', attrs: ['finish', 'dunk'] },
  { id: 'handles', name: 'Handle Gauntlet', focus: 'Ball handling & passing', attrs: ['handles', 'passing'] },
  { id: 'defense', name: 'Defensive Slides', focus: 'Perimeter D, steals, blocks', attrs: ['perimD', 'steal', 'block'] },
  { id: 'athletics', name: 'Strength & Speed', focus: 'Speed, vertical, stamina', attrs: ['speed', 'vertical', 'stamina', 'rebound'] },
]

export function canTrain(save: CareerSave) {
  return !save.trainedSinceGame
}

export function runDrill(input: CareerSave, drillId: string): { save: CareerSave; rewards: Rewards } {
  const save = clone(input)
  const r = newRewards()
  const d = DRILLS.find((x) => x.id === drillId)!
  const arch = getArchetype(save.player.archetype)
  const sorted = [...d.attrs].sort((a, b) => save.player.attributes[a] - save.player.attributes[b])
  const rng = Math.random
  for (const k of sorted.slice(0, 2)) {
    const amt = rng() < 0.35 ? 2 : 1
    if (save.player.attributes[k] < attrCap(arch, k, save.player.heightCm)) bumpAttr(save, k, amt, r)
  }
  grantXp(save, Math.round(45 * DIFF_XP[save.difficulty]), r)
  save.trainedSinceGame = true
  if (save.pro) save.pro.trained = true
  save.updatedAt = Date.now()
  return { save, rewards: r }
}

export function buyItem(input: CareerSave, id: string): CareerSave {
  const item = shopItem(id)
  if (!item || input.inventory.owned.includes(id) || input.coins < item.price) return input
  const save = clone(input)
  save.coins -= item.price
  save.inventory.owned.push(id)
  equipInto(save, item)
  save.updatedAt = Date.now()
  return save
}

function equipInto(save: CareerSave, item: ShopItem) {
  if (item.kind === 'shoes') save.inventory.shoes = item.id
  else save.inventory[item.kind] = save.inventory[item.kind] === item.id ? null : item.id
}

export function equipItem(input: CareerSave, id: string): CareerSave {
  const item = shopItem(id)
  if (!item || !input.inventory.owned.includes(id)) return input
  const save = clone(input)
  equipInto(save, item)
  save.updatedAt = Date.now()
  return save
}

export function updateLook(input: CareerSave, look: Partial<Appearance> & { hair?: HairStyle }): CareerSave {
  const save = clone(input)
  save.player.appearance = { ...save.player.appearance, ...look }
  save.updatedAt = Date.now()
  return save
}

export function markInboxRead(input: CareerSave): CareerSave {
  if (!input.inbox.some((m) => !m.read)) return input
  const save = clone(input)
  for (const m of save.inbox) m.read = true
  return save
}

export function attrCapFor(save: CareerSave, key: AttrKey) {
  return attrCap(getArchetype(save.player.archetype), key, save.player.heightCm)
}

export { ATTRS }
