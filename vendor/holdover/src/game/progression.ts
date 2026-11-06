import {
  CAMOS,
  DUEL_ARENAS,
  DUEL_DIFFICULTIES,
  MISSIONS,
  RANKS,
  RETICLES,
  RIFLES,
  type ActorKind,
  type BonusSpec,
  type DuelDifficulty,
  type DuelDifficultyId,
  type MissionSpec,
  type ReticleId,
  type RifleId,
} from './data.ts'

export const PROFILE_KEY = 'holdover.profile.v1'
export const PROFILE_VERSION = 1
export const MAX_LEVEL = 20

export type QualityId = 'high' | 'balanced' | 'performance'
export type KillCamMode = 'final' | 'always' | 'off'
export type ScopeMode = 'hold' | 'toggle'

export interface Settings {
  sensitivity: number
  scopedSensitivity: number
  invertY: boolean
  scopeMode: ScopeMode
  ballisticAssist: boolean
  hints: boolean
  killCam: KillCamMode
  quality: QualityId
  fov: number
  reduceShake: boolean
  reduceFlashing: boolean
  masterVolume: number
  sfxVolume: number
  musicVolume: number
}

export const DEFAULT_SETTINGS: Settings = {
  sensitivity: 1,
  scopedSensitivity: 0.8,
  invertY: false,
  scopeMode: 'hold',
  ballisticAssist: true,
  hints: true,
  killCam: 'final',
  quality: 'balanced',
  fov: 70,
  reduceShake: false,
  reduceFlashing: false,
  masterVolume: 0.8,
  sfxVolume: 0.9,
  musicVolume: 0.45,
}

export interface MissionRecord {
  completed: boolean
  stars: number
  bestScore: number
  bestTime: number | null
  attempts: number
}

export interface CareerStats {
  kills: number
  headshots: number
  shotsFired: number
  shotsHit: number
  longestShot: number
  missionsCompleted: number
  duelMatches: number
  duelWins: number
  duelLosses: number
  duelRoundsWon: number
  duelRoundsLost: number
  duelStreak: number
  bestDuelStreak: number
  playSeconds: number
}

export interface Loadout {
  rifle: RifleId
  camo: string
  reticle: ReticleId
}

export type DuelRounds = 3 | 5 | 7

export interface DuelPrefs {
  arena: string
  difficulty: DuelDifficultyId
  rounds: DuelRounds
}

export interface Profile {
  version: typeof PROFILE_VERSION
  callsign: string
  xp: number
  missions: Record<string, MissionRecord>
  stats: CareerStats
  loadout: Loadout
  settings: Settings
  duel: DuelPrefs
  createdAt: number
}

const EMPTY_STATS: CareerStats = {
  kills: 0,
  headshots: 0,
  shotsFired: 0,
  shotsHit: 0,
  longestShot: 0,
  missionsCompleted: 0,
  duelMatches: 0,
  duelWins: 0,
  duelLosses: 0,
  duelRoundsWon: 0,
  duelRoundsLost: 0,
  duelStreak: 0,
  bestDuelStreak: 0,
  playSeconds: 0,
}

export function createProfile(now = Date.now()): Profile {
  return {
    version: PROFILE_VERSION,
    callsign: 'Ghost-6',
    xp: 0,
    missions: {},
    stats: { ...EMPTY_STATS },
    loadout: { rifle: 'ranger', camo: 'factory', reticle: 'mildot' },
    settings: { ...DEFAULT_SETTINGS },
    duel: { arena: DUEL_ARENAS[0].id, difficulty: 'recruit', rounds: 5 },
    createdAt: now,
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function finite(value: unknown, fallback: number, min = -Infinity, max = Infinity): number {
  return typeof value === 'number' && Number.isFinite(value)
    ? Math.min(max, Math.max(min, value))
    : fallback
}

function choice<T extends string | number>(value: unknown, options: readonly T[], fallback: T): T {
  return options.includes(value as T) ? (value as T) : fallback
}

function bool(value: unknown, fallback: boolean): boolean {
  return typeof value === 'boolean' ? value : fallback
}

export function sanitizeCallsign(value: unknown): string {
  if (typeof value !== 'string') return 'Ghost-6'
  const cleaned = value
    .replace(/[^A-Za-z0-9 _-]/g, '')
    .trim()
    .slice(0, 16)
  return cleaned.length >= 2 ? cleaned : 'Ghost-6'
}

export function sanitizeSettings(raw: unknown): Settings {
  const value = isRecord(raw) ? raw : {}
  const d = DEFAULT_SETTINGS
  return {
    sensitivity: finite(value.sensitivity, d.sensitivity, 0.2, 3),
    scopedSensitivity: finite(value.scopedSensitivity, d.scopedSensitivity, 0.2, 2),
    invertY: bool(value.invertY, d.invertY),
    scopeMode: choice(value.scopeMode, ['hold', 'toggle'] as const, d.scopeMode),
    ballisticAssist: bool(value.ballisticAssist, d.ballisticAssist),
    hints: bool(value.hints, d.hints),
    killCam: choice(value.killCam, ['final', 'always', 'off'] as const, d.killCam),
    quality: choice(value.quality, ['high', 'balanced', 'performance'] as const, d.quality),
    fov: finite(value.fov, d.fov, 55, 90),
    reduceShake: bool(value.reduceShake, d.reduceShake),
    reduceFlashing: bool(value.reduceFlashing, d.reduceFlashing),
    masterVolume: finite(value.masterVolume, d.masterVolume, 0, 1),
    sfxVolume: finite(value.sfxVolume, d.sfxVolume, 0, 1),
    musicVolume: finite(value.musicVolume, d.musicVolume, 0, 1),
  }
}

/** Accepts anything (including corrupt storage) and returns a valid profile. */
export function sanitizeProfile(raw: unknown): Profile {
  const base = createProfile()
  if (!isRecord(raw) || raw.version !== PROFILE_VERSION) return base
  const missions: Record<string, MissionRecord> = {}
  if (isRecord(raw.missions)) {
    for (const mission of MISSIONS) {
      const record = raw.missions[mission.id]
      if (!isRecord(record)) continue
      missions[mission.id] = {
        completed: bool(record.completed, false),
        stars: Math.round(finite(record.stars, 0, 0, 3)),
        bestScore: Math.round(finite(record.bestScore, 0, 0)),
        bestTime: record.bestTime === null ? null : finite(record.bestTime, 0, 0) || null,
        attempts: Math.round(finite(record.attempts, 0, 0)),
      }
    }
  }
  const rawStats = isRecord(raw.stats) ? raw.stats : {}
  const stats = { ...EMPTY_STATS }
  for (const key of Object.keys(EMPTY_STATS) as Array<keyof CareerStats>) {
    stats[key] = finite(rawStats[key], 0, 0)
  }
  const loadout = isRecord(raw.loadout) ? raw.loadout : {}
  const duel = isRecord(raw.duel) ? raw.duel : {}
  return {
    version: PROFILE_VERSION,
    callsign: sanitizeCallsign(raw.callsign),
    xp: Math.round(finite(raw.xp, 0, 0, totalXpForLevel(MAX_LEVEL))),
    missions,
    stats,
    loadout: {
      rifle: choice(loadout.rifle, RIFLES.map((rifle) => rifle.id), base.loadout.rifle),
      camo: choice(loadout.camo, CAMOS.map((camo) => camo.id), base.loadout.camo),
      reticle: choice(loadout.reticle, RETICLES.map((reticle) => reticle.id), base.loadout.reticle),
    },
    settings: sanitizeSettings(raw.settings),
    duel: {
      arena: choice(duel.arena, DUEL_ARENAS.map((arena) => arena.id), base.duel.arena),
      difficulty: choice(duel.difficulty, DUEL_DIFFICULTIES.map((item) => item.id), base.duel.difficulty),
      rounds: choice(duel.rounds, [3, 5, 7] as const, base.duel.rounds),
    },
    createdAt: finite(raw.createdAt, base.createdAt, 0),
  }
}

interface StorageLike {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
}

function defaultStorage(): StorageLike | null {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage
  } catch {
    return null
  }
}

export function loadProfile(storage: StorageLike | null = defaultStorage()): Profile {
  if (!storage) return createProfile()
  try {
    const text = storage.getItem(PROFILE_KEY)
    return text ? sanitizeProfile(JSON.parse(text)) : createProfile()
  } catch {
    return createProfile()
  }
}

export function saveProfile(profile: Profile, storage: StorageLike | null = defaultStorage()): boolean {
  if (!storage) return false
  try {
    storage.setItem(PROFILE_KEY, JSON.stringify(profile))
    return true
  } catch {
    return false
  }
}

export function clearProfile(storage: StorageLike | null = defaultStorage()): void {
  try {
    storage?.removeItem(PROFILE_KEY)
  } catch {
    // Storage can be unavailable in private browsing or sandboxed frames.
  }
}

// ---------------------------------------------------------------------------
// Levels and unlocks

/** XP needed to advance from `level` to `level + 1`. */
export function xpForLevel(level: number): number {
  return 500 + 250 * (Math.max(1, level) - 1)
}

/** Cumulative XP at which `level` is reached (level 1 starts at 0). */
export function totalXpForLevel(level: number): number {
  let total = 0
  for (let current = 1; current < Math.min(level, MAX_LEVEL); current += 1) total += xpForLevel(current)
  return total
}

export interface LevelInfo {
  level: number
  rank: string
  xpIntoLevel: number
  xpForNext: number
  progress: number
  maxed: boolean
}

export function rankName(level: number): string {
  return RANKS[Math.min(RANKS.length, Math.max(1, level)) - 1]
}

export function levelInfo(xp: number): LevelInfo {
  let level = 1
  let remaining = Math.max(0, Math.floor(xp))
  while (level < MAX_LEVEL && remaining >= xpForLevel(level)) {
    remaining -= xpForLevel(level)
    level += 1
  }
  const maxed = level >= MAX_LEVEL
  const xpForNext = maxed ? 0 : xpForLevel(level)
  return {
    level,
    rank: rankName(level),
    xpIntoLevel: maxed ? 0 : remaining,
    xpForNext,
    progress: maxed ? 1 : remaining / xpForNext,
    maxed,
  }
}

export interface UnlockItem {
  type: 'rifle' | 'camo' | 'reticle'
  id: string
  name: string
  level: number
}

export function allUnlocks(): UnlockItem[] {
  return [
    ...RIFLES.map((rifle) => ({ type: 'rifle' as const, id: rifle.id, name: rifle.name, level: rifle.unlockLevel })),
    ...CAMOS.map((camo) => ({ type: 'camo' as const, id: camo.id, name: camo.name, level: camo.unlockLevel })),
    ...RETICLES.map((reticle) => ({
      type: 'reticle' as const,
      id: reticle.id,
      name: reticle.name,
      level: reticle.unlockLevel,
    })),
  ].sort((a, b) => a.level - b.level)
}

export function unlocksBetween(levelBefore: number, levelAfter: number): UnlockItem[] {
  return allUnlocks().filter((item) => item.level > levelBefore && item.level <= levelAfter)
}

export function nextUnlock(level: number): UnlockItem | undefined {
  return allUnlocks().find((item) => item.level > level)
}

export function isMissionUnlocked(profile: Profile, index: number): boolean {
  if (index <= 0) return true
  const previous = MISSIONS[index - 1]
  return Boolean(previous && profile.missions[previous.id]?.completed)
}

export function campaignStars(profile: Profile): { stars: number; max: number; completed: number } {
  let stars = 0
  let completed = 0
  for (const mission of MISSIONS) {
    const record = profile.missions[mission.id]
    stars += record?.stars ?? 0
    if (record?.completed) completed += 1
  }
  return { stars, max: MISSIONS.length * 3, completed }
}

// ---------------------------------------------------------------------------
// Scoring

export interface KillInfo {
  kind: ActorKind
  headshot: boolean
  moving: boolean
  distance: number
  /** Seconds since the previous kill, or Infinity. */
  sincePrevious: number
  undetected: boolean
}

export interface ScoreLine {
  label: string
  points: number
}

const KILL_BASE: Record<ActorKind, number> = { hostile: 100, heavy: 160, hvt: 500, sniper: 350, civilian: -1000 }
const KILL_LABEL: Record<ActorKind, string> = {
  hostile: 'Hostile down',
  heavy: 'Heavy down',
  hvt: 'Target eliminated',
  sniper: 'Marksman down',
  civilian: 'Civilian casualty',
}

export function scoreKill(info: KillInfo): ScoreLine[] {
  const lines: ScoreLine[] = [{ label: KILL_LABEL[info.kind], points: KILL_BASE[info.kind] }]
  if (info.kind === 'civilian') return lines
  if (info.headshot) lines.push({ label: 'Headshot', points: 150 })
  if (info.moving) lines.push({ label: 'Moving target', points: 75 })
  if (info.distance >= 500) {
    lines.push({ label: `Long shot ${Math.round(info.distance)} m`, points: 100 + Math.round((info.distance - 500) / 2) })
  }
  if (info.sincePrevious <= 4) lines.push({ label: 'Quick follow-up', points: 100 })
  if (info.undetected) lines.push({ label: 'Undetected', points: 50 })
  return lines
}

export interface MissionStats {
  kills: number
  headshots: number
  shots: number
  hits: number
  longestKill: number
  longestHeadshot: number
  movingKills: number
  civiliansHit: number
  detected: boolean
  elapsed: number
  hvtHeadshot: boolean
  escortsKilled: number
  sniperFirst: boolean
  killPoints: number
}

export function emptyMissionStats(): MissionStats {
  return {
    kills: 0,
    headshots: 0,
    shots: 0,
    hits: 0,
    longestKill: 0,
    longestHeadshot: 0,
    movingKills: 0,
    civiliansHit: 0,
    detected: false,
    elapsed: 0,
    hvtHeadshot: false,
    escortsKilled: 0,
    sniperFirst: false,
    killPoints: 0,
  }
}

export function bonusMet(bonus: BonusSpec, stats: MissionStats): boolean {
  switch (bonus.id) {
    case 'headshots':
      return stats.headshots >= (bonus.value ?? 1)
    case 'nomiss':
      return stats.shots > 0 && stats.hits >= stats.shots
    case 'undetected':
      return !stats.detected
    case 'time':
      return stats.elapsed <= (bonus.value ?? 180)
    case 'moving':
      return stats.movingKills >= (bonus.value ?? 1)
    case 'hvtHeadshot':
      return stats.hvtHeadshot
    case 'escorts':
      return stats.escortsKilled >= (bonus.value ?? 2)
    case 'longshot':
      return stats.longestHeadshot >= (bonus.value ?? 700)
    case 'sniperFirst':
      return stats.sniperFirst
  }
}

export interface MissionEvaluation {
  success: boolean
  score: number
  stars: number
  accuracy: number
  bonuses: Array<{ spec: BonusSpec; met: boolean }>
  breakdown: ScoreLine[]
  xp: number
}

export function evaluateMission(
  mission: MissionSpec,
  stats: MissionStats,
  success: boolean,
  firstClear: boolean,
  assisted: boolean,
): MissionEvaluation {
  const accuracy = stats.shots > 0 ? stats.hits / stats.shots : 0
  const breakdown: ScoreLine[] = [{ label: 'Eliminations', points: stats.killPoints }]
  if (success) {
    breakdown.push({ label: 'Objective complete', points: 1000 })
    breakdown.push({ label: `Accuracy ${Math.round(accuracy * 100)}%`, points: Math.round(accuracy * 600) })
    const timeBonus = Math.max(0, Math.round((240 - stats.elapsed) * 3))
    if (timeBonus > 0) breakdown.push({ label: 'Time bonus', points: timeBonus })
    if (!stats.detected) breakdown.push({ label: 'Ghost bonus', points: 500 })
  }
  const score = Math.max(0, breakdown.reduce((sum, line) => sum + line.points, 0))
  const bonuses = mission.bonuses.map((spec) => ({ spec, met: success && bonusMet(spec, stats) }))
  const stars = success ? 1 + bonuses.filter((bonus) => bonus.met).length : 0
  let xp: number
  if (success) {
    const base = mission.xp * (firstClear ? 1 : 0.4)
    xp = Math.round((base + score * 0.25 + stars * 75) * (assisted ? 1 : 1.2))
  } else {
    xp = Math.round(Math.min(300, Math.max(0, stats.killPoints) * 0.15))
  }
  return { success, score, stars, accuracy, bonuses, breakdown, xp }
}

export interface ProgressResult {
  profile: Profile
  xpGained: number
  levelBefore: number
  levelAfter: number
  unlocks: UnlockItem[]
  newBest: boolean
}

function addCareer(stats: CareerStats, mission: { kills: number; headshots: number; shots: number; hits: number; longest: number; seconds: number }): CareerStats {
  return {
    ...stats,
    kills: stats.kills + mission.kills,
    headshots: stats.headshots + mission.headshots,
    shotsFired: stats.shotsFired + mission.shots,
    shotsHit: stats.shotsHit + mission.hits,
    longestShot: Math.max(stats.longestShot, mission.longest),
    playSeconds: stats.playSeconds + mission.seconds,
  }
}

export function applyMissionResult(
  profile: Profile,
  mission: MissionSpec,
  evaluation: MissionEvaluation,
  stats: MissionStats,
): ProgressResult {
  const previous = profile.missions[mission.id] ?? {
    completed: false,
    stars: 0,
    bestScore: 0,
    bestTime: null,
    attempts: 0,
  }
  const newBest = evaluation.success && evaluation.score > previous.bestScore
  const record: MissionRecord = {
    completed: previous.completed || evaluation.success,
    stars: Math.max(previous.stars, evaluation.stars),
    bestScore: evaluation.success ? Math.max(previous.bestScore, evaluation.score) : previous.bestScore,
    bestTime: evaluation.success
      ? Math.min(previous.bestTime ?? Infinity, Math.round(stats.elapsed * 10) / 10)
      : previous.bestTime,
    attempts: previous.attempts + 1,
  }
  const levelBefore = levelInfo(profile.xp).level
  const xp = Math.min(totalXpForLevel(MAX_LEVEL), profile.xp + evaluation.xp)
  const levelAfter = levelInfo(xp).level
  const career = addCareer(profile.stats, {
    kills: stats.kills,
    headshots: stats.headshots,
    shots: stats.shots,
    hits: stats.hits,
    longest: stats.longestKill,
    seconds: stats.elapsed,
  })
  if (evaluation.success && !previous.completed) career.missionsCompleted += 1
  return {
    profile: { ...profile, xp, missions: { ...profile.missions, [mission.id]: record }, stats: career },
    xpGained: xp - profile.xp,
    levelBefore,
    levelAfter,
    unlocks: unlocksBetween(levelBefore, levelAfter),
    newBest,
  }
}

// ---------------------------------------------------------------------------
// Quick Duel

export function winsNeeded(rounds: DuelRounds): number {
  return Math.floor(rounds / 2) + 1
}

export interface DuelScore {
  player: number
  enemy: number
  draws: number
}

/** A match ends at the win target, or after `rounds + 2` total rounds to cap draw streaks. */
export function duelMatchOver(score: DuelScore, rounds: DuelRounds): boolean {
  const target = winsNeeded(rounds)
  return score.player >= target || score.enemy >= target || score.player + score.enemy + score.draws >= rounds + 2
}

export function duelWinner(score: DuelScore): 'player' | 'enemy' | 'draw' {
  if (score.player > score.enemy) return 'player'
  if (score.enemy > score.player) return 'enemy'
  return 'draw'
}

export interface DuelTuning extends DuelDifficulty {
  /** Seconds of warning between the final glint and the shot. */
  warning: number
}

/** Applies a mild level-based ramp on top of the selected difficulty. */
export function duelTuning(difficultyId: DuelDifficultyId, level: number): DuelTuning {
  const difficulty = DUEL_DIFFICULTIES.find((item) => item.id === difficultyId) ?? DUEL_DIFFICULTIES[0]
  const ramp = 1 - Math.min(15, Math.max(0, level - 1)) * 0.012
  return {
    ...difficulty,
    lockTime: difficulty.lockTime * ramp,
    reacquire: difficulty.reacquire * ramp,
    warning: difficulty.id === 'elite' ? 0.75 : difficulty.id === 'veteran' ? 0.95 : 1.25,
  }
}

export interface DuelSummary {
  winner: 'player' | 'enemy' | 'draw'
  score: DuelScore
  kills: number
  headshots: number
  shots: number
  hits: number
  longest: number
  difficulty: DuelDifficultyId
  elapsed: number
}

export function duelXp(summary: DuelSummary): number {
  const multiplier = DUEL_DIFFICULTIES.find((item) => item.id === summary.difficulty)?.xpMultiplier ?? 1
  const raw =
    60 +
    summary.score.player * 150 +
    summary.headshots * 50 +
    (summary.winner === 'player' ? 400 : summary.winner === 'draw' ? 120 : 0)
  return Math.round(raw * multiplier)
}

export function applyDuelResult(profile: Profile, summary: DuelSummary): ProgressResult {
  const gained = duelXp(summary)
  const levelBefore = levelInfo(profile.xp).level
  const xp = Math.min(totalXpForLevel(MAX_LEVEL), profile.xp + gained)
  const levelAfter = levelInfo(xp).level
  const career = addCareer(profile.stats, {
    kills: summary.kills,
    headshots: summary.headshots,
    shots: summary.shots,
    hits: summary.hits,
    longest: summary.longest,
    seconds: summary.elapsed,
  })
  career.duelMatches += 1
  career.duelRoundsWon += summary.score.player
  career.duelRoundsLost += summary.score.enemy
  if (summary.winner === 'player') {
    career.duelWins += 1
    career.duelStreak += 1
    career.bestDuelStreak = Math.max(career.bestDuelStreak, career.duelStreak)
  } else if (summary.winner === 'enemy') {
    career.duelLosses += 1
    career.duelStreak = 0
  }
  return {
    profile: { ...profile, xp, stats: career },
    xpGained: xp - profile.xp,
    levelBefore,
    levelAfter,
    unlocks: unlocksBetween(levelBefore, levelAfter),
    newBest: false,
  }
}
