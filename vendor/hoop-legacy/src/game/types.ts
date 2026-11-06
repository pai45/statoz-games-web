export type AttrKey =
  | 'three'
  | 'mid'
  | 'finish'
  | 'dunk'
  | 'handles'
  | 'passing'
  | 'speed'
  | 'vertical'
  | 'perimD'
  | 'steal'
  | 'block'
  | 'rebound'
  | 'stamina'

export type Attributes = Record<AttrKey, number>

export type Position = 'PG' | 'SG' | 'SF' | 'PF' | 'C'

export type HairStyle = 'bald' | 'buzz' | 'fade' | 'afro' | 'twists' | 'hightop' | 'bun' | 'waves' | 'braids' | 'locs'

export type FacialHair = 'clean' | 'stubble' | 'goatee' | 'beard' | 'full'

export type BadgeId =
  | 'deadeye'
  | 'limitless'
  | 'catchShoot'
  | 'greenMachine'
  | 'proTouch'
  | 'posterizer'
  | 'ankleBreaker'
  | 'quickFirst'
  | 'dimer'
  | 'clamps'
  | 'pickPocket'
  | 'rimProtector'
  | 'reboundChaser'

export interface Appearance {
  skin: string
  hair: HairStyle
  hairColor: string
  beard: boolean
  /** Explicit facial hair style; when absent it is derived from `beard`. */
  facialHair?: FacialHair
  headband: string | null
  armSleeve: string | null
  legSleeve: string | null
  wristbands: string | null
  shoeColor: string
  shoeAccent: string
  sockColor: string
}

export interface PlayerProfile {
  id: string
  firstName: string
  lastName: string
  number: number
  position: Position
  heightCm: number
  attributes: Attributes
  badges: Partial<Record<BadgeId, number>>
  appearance: Appearance
  archetype?: string
}

export interface TeamInfo {
  id: string
  city: string
  name: string
  abbr: string
  primary: string
  secondary: string
  roster: PlayerProfile[]
  tier: 'street' | 'pro' | 'allstar'
}

export interface JerseyStyle {
  base: string
  trim: string
  number: string
  shorts: string
}

export type Difficulty = 'rookie' | 'pro' | 'allstar' | 'superstar' | 'hof'

export interface MatchSide {
  team: TeamInfo
  players: PlayerProfile[]
  jersey: JerseyStyle
  human: boolean
}

export type GameMode = '1v1' | '3v3'

export interface MatchConfig {
  mode: GameMode
  sides: [MatchSide, MatchSide]
  targetScore: number
  timeLimit: number
  shotClock: number
  difficulty: Difficulty
  courtTeam: TeamInfo
  label: string
  /** Profile id of the player the human controls by default (career player). */
  focusPlayerId?: string
  /** Team that checks the ball first; random when omitted. */
  firstPossession?: 0 | 1
}

export interface PlayerGameStats {
  pts: number
  fgm: number
  fga: number
  tpm: number
  tpa: number
  ast: number
  reb: number
  stl: number
  blk: number
  tov: number
  dunks: number
  greens: number
  ftm: number
  fta: number
}

export interface MatchResult {
  score: [number, number]
  winner: 0 | 1
  stats: Record<string, PlayerGameStats>
  durationSec: number
  highlights: string[]
  forfeited?: boolean
}

export interface ContestConfig {
  shooters: PlayerProfile[]
  humanIndex: number
  moneyRack: number
  rounds: 1 | 2
  duration: number
  racks: number
  courtTeam: TeamInfo
  label: string
  difficulty: Difficulty
}

export interface ContestRoundScore {
  id: string
  name: string
  score: number
}

export interface ContestResult {
  rounds: ContestRoundScore[][]
  humanScores: number[]
  champion: string
  humanWon: boolean
  humanBest: number
  makes: number
  attempts: number
  greens: number
}

export function emptyStats(): PlayerGameStats {
  return { pts: 0, fgm: 0, fga: 0, tpm: 0, tpa: 0, ast: 0, reb: 0, stl: 0, blk: 0, tov: 0, dunks: 0, greens: 0, ftm: 0, fta: 0 }
}

export function fullName(p: Pick<PlayerProfile, 'firstName' | 'lastName'>) {
  return `${p.firstName} ${p.lastName}`
}

export function shortName(p: Pick<PlayerProfile, 'firstName' | 'lastName'>) {
  return `${p.firstName.charAt(0)}. ${p.lastName}`
}
