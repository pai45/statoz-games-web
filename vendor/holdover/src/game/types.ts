// Contracts shared by the engine, the mission/duel sessions, and the React HUD.
import type * as THREE from 'three'

import type { Actor, HitPart } from './actors.ts'
import type { AudioEngine } from './audio.ts'
import type { RifleSpec } from './data.ts'
import type { Effects } from './effects.ts'
import type { DuelScore, DuelSummary, MissionStats, ScoreLine } from './progression.ts'
import type { World } from './world.ts'

export type AlertLevel = 'calm' | 'suspicious' | 'alerted' | 'compromised'
export type BonusState = 'pending' | 'met' | 'failed'

export interface MissionHud {
  code: string
  name: string
  objective: string
  remaining: number
  total: number
  elapsed: number
  alert: AlertLevel
  detection: number
  bonuses: Array<{ label: string; state: BonusState; progress?: string }>
  score: number
  ending: 'success' | 'fail' | null
  endReason: string | null
}

export interface DuelHud {
  round: number
  rounds: number
  score: DuelScore
  phase: 'intro' | 'live' | 'roundEnd' | 'matchEnd'
  roundTime: number
  roundLimit: number
  lock: number
  warning: boolean
  enemyAiming: boolean
  banner: string | null
  bannerSub: string | null
  difficulty: string
  arena: string
}

export interface HudState {
  mode: 'menu' | 'mission' | 'duel'
  live: boolean
  paused: boolean
  scoped: boolean
  scope: number
  zoom: number
  zoomMin: number
  zoomMax: number
  zero: number
  range: number | null
  rangeFresh: boolean
  windSpeed: number
  windFrom: number
  windRelative: number
  ammo: number
  magazine: number
  reserve: number
  chambered: boolean
  cycling: number
  reloading: number
  breath: number
  holding: boolean
  exhausted: boolean
  ducked: boolean
  health: number
  dead: boolean
  thermal: boolean
  thermalAvailable: boolean
  heading: number
  pitch: number
  assist: boolean
  killcam: boolean
  hint: string | null
  pointerLocked: boolean
  rifleName: string
  rifleDesignation: string
  caliber: string
  action: 'bolt' | 'semi'
  mission: MissionHud | null
  duel: DuelHud | null
}

export type NoticeTone = 'info' | 'warn' | 'good' | 'bad'

export type GameEvent =
  | { type: 'score'; lines: ScoreLine[]; total: number; headshot: boolean }
  | { type: 'notice'; text: string; tone: NoticeTone }
  | { type: 'missionEnd'; success: boolean; reason: string; stats: MissionStats }
  | { type: 'duelEnd'; summary: DuelSummary }
  | { type: 'pointer'; locked: boolean }
  | { type: 'pause' }

export interface ShotInfo {
  distance: number
  rifle: RifleSpec
  dirX: number
  dirZ: number
}

export interface HitReport {
  result: 'kill' | 'wound' | 'armor' | 'none'
}

export interface Glint {
  position: THREE.Vector3
  intensity: number
}

export interface SessionHost {
  readonly world: World
  readonly effects: Effects
  readonly audio: AudioEngine
  readonly eye: THREE.Vector3
  readonly window: THREE.Vector3
  readonly time: number
  readonly level: number
  playerExposed(): boolean
  sinceLoudShot(): number
  damagePlayer(amount: number, from: THREE.Vector3): void
  enemyFire(from: THREE.Vector3, hit: boolean, kind: 'rifle' | 'sniper' | 'heavy'): void
  resetPlayer(): void
  emit(event: GameEvent): void
  playerDead(): boolean
}

export interface Session {
  readonly kind: 'mission' | 'duel'
  readonly actors: Actor[]
  /** True while the player may shoot and the clock runs. */
  readonly live: boolean
  /** Forces the player into cover (round intros). */
  readonly forceCover: boolean
  update(dt: number, realDt: number): void
  onPlayerFired(rifle: RifleSpec): void
  onBulletSegment(ax: number, ay: number, az: number, bx: number, by: number, bz: number): void
  onBulletImpact(x: number, y: number, z: number): void
  onActorHit(actor: Actor, part: HitPart, shot: ShotInfo): HitReport
  wouldKill(actor: Actor, part: HitPart, rifle: RifleSpec): boolean
  isFinalTarget(actor: Actor): boolean
  glints(): Glint[]
  autoTagged(actor: Actor): boolean
  missionHud(): MissionHud | null
  duelHud(): DuelHud | null
  /** The actor that killed the player, for the duel death cam. */
  killer(): Actor | null
  dispose(): void
}
