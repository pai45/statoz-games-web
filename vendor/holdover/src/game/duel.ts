// Quick Duel: best-of-N counter-sniper rounds on a chosen arena.
import * as THREE from 'three'

import { Actor, type HitPart } from './actors.ts'
import { DUEL_DIFFICULTIES, type DuelArena, type DuelDifficultyId, type RifleSpec } from './data.ts'
import { mulberry32 } from './noise.ts'
import { duelMatchOver, duelTuning, duelWinner, type DuelRounds, type DuelScore, type DuelSummary } from './progression.ts'
import { SniperBrain } from './sniper.ts'
import type { DuelHud, Glint, HitReport, MissionHud, Session, SessionHost, ShotInfo } from './types.ts'

const ROUND_LIMIT = 120

export class DuelSession implements Session {
  readonly kind = 'duel' as const
  readonly actors: Actor[] = []
  readonly arena: DuelArena
  readonly difficulty: DuelDifficultyId
  readonly rounds: DuelRounds
  score: DuelScore = { player: 0, enemy: 0, draws: 0 }
  round = 1
  phase: DuelHud['phase'] = 'intro'
  finished = false
  private phaseTimer = 4
  private roundTime = 0
  private elapsed = 0
  private readonly host: SessionHost
  private enemy: Actor
  private brain: SniperBrain
  private readonly random: () => number
  private banner: string | null = null
  private bannerSub: string | null = null
  private pendingHitAt = -1
  private enemyWounds = 0
  private stats = { kills: 0, headshots: 0, shots: 0, hits: 0, longest: 0 }
  private lastNest = -1
  private roundWinner: 'player' | 'enemy' | 'draw' | null = null

  constructor(host: SessionHost, arena: DuelArena, difficulty: DuelDifficultyId, rounds: DuelRounds) {
    this.host = host
    this.arena = arena
    this.difficulty = difficulty
    this.rounds = rounds
    this.random = mulberry32(Math.floor(Math.random() * 1e9))
    this.enemy = new Actor({ kind: 'sniper', seed: 4242 })
    this.actors.push(this.enemy)
    this.brain = this.createBrain()
    this.startRound()
  }

  private createBrain(): SniperBrain {
    const brain = new SniperBrain(this.host, this.enemy, this.arena.nests, duelTuning(this.difficulty, this.host.level), this.random)
    brain.onFire = (hit) => {
      if (!hit || this.phase !== 'live') return
      const distance = this.enemy.headPosition(new THREE.Vector3()).distanceTo(this.host.eye)
      this.pendingHitAt = this.elapsed + distance / 820
    }
    return brain
  }

  private startRound(): void {
    // Each round gets a fresh marksman in a different nest.
    if (this.round > 1) {
      this.enemy.dispose()
      this.actors.length = 0
      this.enemy = new Actor({ kind: 'sniper', seed: 4242 + this.round * 7 })
      this.actors.push(this.enemy)
      this.brain = this.createBrain()
    }
    let nest = Math.floor(this.random() * this.arena.nests.length)
    if (nest === this.lastNest) nest = (nest + 1) % this.arena.nests.length
    this.lastNest = nest
    this.brain.start(nest, 2.5)
    this.enemyWounds = 0
    this.pendingHitAt = -1
    this.roundTime = 0
    this.phase = 'intro'
    this.phaseTimer = 3.6
    this.roundWinner = null
    this.banner = `Round ${this.round}`
    this.bannerSub = 'Find the enemy marksman before he finds you'
    this.host.resetPlayer()
    this.host.audio.ui('round')
  }

  get live(): boolean {
    return this.phase === 'live'
  }

  get forceCover(): boolean {
    return this.phase === 'intro' && this.phaseTimer > 1.2
  }

  private endRound(winner: 'player' | 'enemy' | 'draw'): void {
    if (this.phase !== 'live') return
    this.roundWinner = winner
    if (winner === 'player') this.score.player += 1
    else if (winner === 'enemy') this.score.enemy += 1
    else this.score.draws += 1
    this.phase = 'roundEnd'
    this.phaseTimer = winner === 'enemy' ? 4.2 : 3.6
    this.banner = winner === 'player' ? 'Round won' : winner === 'enemy' ? 'Round lost' : 'Time — round drawn'
    this.bannerSub = winner === 'enemy' ? 'The marksman was waiting for you' : winner === 'player' ? 'Marksman eliminated' : 'Neither shooter found a shot'
    this.host.audio.ui(winner === 'player' ? 'confirm' : 'back')
  }

  update(dt: number, realDt: number): void {
    this.elapsed += dt
    if (this.phase === 'live') this.roundTime += dt
    if (this.phase === 'intro' || this.phase === 'roundEnd' || this.phase === 'matchEnd') this.phaseTimer -= realDt
    switch (this.phase) {
      case 'intro':
        if (this.phaseTimer <= 0) {
          this.phase = 'live'
          this.banner = null
          this.bannerSub = null
        }
        break
      case 'live':
        if (this.pendingHitAt >= 0 && this.elapsed >= this.pendingHitAt) {
          this.pendingHitAt = -1
          this.host.damagePlayer(999, this.enemy.muzzlePosition(new THREE.Vector3()))
          this.endRound('enemy')
        } else if (this.roundTime >= ROUND_LIMIT) {
          this.endRound('draw')
        }
        break
      case 'roundEnd':
        if (this.phaseTimer <= 0) {
          if (duelMatchOver(this.score, this.rounds)) {
            this.phase = 'matchEnd'
            this.phaseTimer = 0.8
            const winner = duelWinner(this.score)
            this.banner = winner === 'player' ? 'Victory' : winner === 'enemy' ? 'Defeat' : 'Draw'
            this.bannerSub = `${this.score.player} – ${this.score.enemy}`
          } else {
            this.round += 1
            this.startRound()
          }
        }
        break
      case 'matchEnd':
        if (this.phaseTimer <= 0 && !this.finished) {
          this.finished = true
          this.host.emit({ type: 'duelEnd', summary: this.summary() })
        }
        break
    }
    if (this.phase === 'live' || this.phase === 'intro') this.brain.update(dt)
    this.enemy.update(dt, this.host.time)
  }

  summary(): DuelSummary {
    return {
      winner: duelWinner(this.score),
      score: { ...this.score },
      kills: this.stats.kills,
      headshots: this.stats.headshots,
      shots: this.stats.shots,
      hits: this.stats.hits,
      longest: this.stats.longest,
      difficulty: this.difficulty,
      elapsed: this.elapsed,
    }
  }

  onPlayerFired(rifle: RifleSpec): void {
    void rifle
    if (this.phase === 'live') this.stats.shots += 1
  }

  onBulletSegment(ax: number, ay: number, az: number, bx: number, by: number, bz: number): void {
    if (!this.enemy.alive || this.enemy.hidden) return
    if (this.enemy.headDistanceToSegment(ax, ay, az, bx, by, bz) < 2.4) this.brain.onNearMiss()
  }

  onBulletImpact(x: number, y: number, z: number): void {
    if (!this.enemy.alive || this.enemy.hidden) return
    if (Math.hypot(this.enemy.x - x, this.enemy.y - y, this.enemy.z - z) < 3.5) this.brain.onNearMiss()
  }

  wouldKill(actor: Actor, part: HitPart, rifle: RifleSpec): boolean {
    if (actor !== this.enemy || !actor.alive) return false
    return part === 'head' || part === 'torso' || part === 'pelvis' || this.enemyWounds >= 1 || rifle.id === 'anvil'
  }

  isFinalTarget(actor: Actor): boolean {
    if (actor !== this.enemy) return false
    const projected = { ...this.score, player: this.score.player + 1 }
    return duelMatchOver(projected, this.rounds)
  }

  autoTagged(): boolean {
    return false
  }

  onActorHit(actor: Actor, part: HitPart, shot: ShotInfo): HitReport {
    if (actor !== this.enemy || !actor.alive || this.phase !== 'live') return { result: 'none' }
    this.stats.hits += 1
    if (!this.wouldKill(actor, part, shot.rifle)) {
      this.enemyWounds += 1
      this.brain.onWounded()
      this.host.emit({ type: 'notice', text: 'Marksman wounded — he is relocating', tone: 'warn' })
      return { result: 'wound' }
    }
    actor.die(shot.dirX, shot.dirZ, part, this.host.world.collision, true)
    this.stats.kills += 1
    if (part === 'head') this.stats.headshots += 1
    this.stats.longest = Math.max(this.stats.longest, shot.distance)
    const lines = [{ label: 'Marksman down', points: 350 }]
    if (part === 'head') lines.push({ label: 'Headshot', points: 150 })
    if (shot.distance >= 500) lines.push({ label: `Long shot ${Math.round(shot.distance)} m`, points: 100 })
    this.host.emit({ type: 'score', lines, total: lines.reduce((sum, line) => sum + line.points, 0), headshot: part === 'head' })
    this.pendingHitAt = -1
    this.endRound('player')
    return { result: 'kill' }
  }

  glints(): Glint[] {
    if (!this.brain.visible || this.brain.glint < 0.01) return []
    return [{ position: this.enemy.opticPosition(), intensity: this.brain.glint }]
  }

  killer(): Actor | null {
    return this.roundWinner === 'enemy' ? this.enemy : null
  }

  missionHud(): MissionHud | null {
    return null
  }

  duelHud(): DuelHud {
    const difficulty = DUEL_DIFFICULTIES.find((item) => item.id === this.difficulty)
    return {
      round: this.round,
      rounds: this.rounds,
      score: { ...this.score },
      phase: this.phase,
      roundTime: this.roundTime,
      roundLimit: ROUND_LIMIT,
      lock: this.brain.state === 'aiming' ? this.brain.lock : 0,
      warning: this.brain.warning,
      enemyAiming: this.brain.state === 'aiming',
      banner: this.banner,
      bannerSub: this.bannerSub,
      difficulty: difficulty?.label ?? this.difficulty,
      arena: this.arena.name,
    }
  }

  dispose(): void {
    this.enemy.dispose()
  }
}
