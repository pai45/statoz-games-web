import * as THREE from 'three'
import type { Engine, EngineMode } from '../engine/Engine'
import { BallBody, type BallEvents } from '../world/Ball'
import type { BallLike } from '../world/Hoop'
import { Athlete } from './Athlete'
import { aiBitesOnFake, aiDefend, aiUpdate, assignment, segDist, updateScreens } from './ai'
import { ReplayBuffer } from './replay'
import { BOUNDS, CHECK_SPOT, COURT, PLAYER_RADIUS, SPOTS, distToRim, inBounds, isBeyondArc, isThree } from './court'
import {
  DIFFICULTY,
  GRADE_TEXT,
  METER_FILL_TIME,
  METER_IDEAL,
  METER_MAX,
  aimPoint,
  baseChance,
  computeContest,
  finalChance,
  gradeRelease,
  greenWindow,
  rollGrade,
  shotRating,
  solveLaunch,
  solveLaunchApex,
  type DiffParams,
  type Grade,
  type ShotType,
} from './shooting'
import { emptyStats, shortName, type MatchConfig, type MatchResult, type PlayerProfile } from '../types'
import { badgeLevel, overall } from '../../data/attributes'
import { BroadcastDirector, type StatCard } from './director'
import type { InputManager } from '../engine/input'

export type MatchPhase = 'intro' | 'check' | 'live' | 'scored' | 'replay' | 'dead' | 'freethrow' | 'over'

/** Starting-lineup lower-third shown while the camera spotlights a player before tip-off. */
export interface IntroCard {
  key: number
  team: 0 | 1
  first: string
  last: string
  number: number
  position: string
  heightCm: number
  ovr: number
  archetype?: string
}

export type MoveName = 'crossover' | 'behind' | 'spin' | 'stepback' | 'hesi'
export type FeedbackKind = 'green' | 'good' | 'bad' | 'info' | 'big' | 'score'

export interface MatchHud {
  phase: MatchPhase
  score: [number, number]
  gameClock: number
  shotClock: number
  possession: 0 | 1
  mustClear: boolean
  humanTeam: 0 | 1 | null
  offense: boolean
  hasBall: boolean
  looseBall: boolean
  meter: { active: boolean; fill: number; gw: number; x: number; y: number; grade: Grade | null; flash: number }
  marker: { x: number; y: number; visible: boolean }
  passTarget: { x: number; y: number; visible: boolean; lob: boolean }
  overtime: boolean
  controlledName: string
  teamSize: number
  /** free throws in progress */
  ft: { active: boolean; idx: number; total: number; name: string; human: boolean }
  /** a player on each side is on fire */
  fire: [boolean, boolean]
  controlledFire: 0 | 1 | 2
  /** what the move button does with the stick where it is now */
  moveHint: MoveName
  intro: IntroCard | null
}

export interface MatchEvents {
  onFeedback?: (text: string, kind: FeedbackKind, sub?: string) => void
  onScore?: (team: 0 | 1, points: number, scorer: PlayerProfile) => void
  onPhase?: (phase: MatchPhase, info?: string) => void
  onGameOver?: (result: MatchResult) => void
  /** broadcast lower-thirds (player lines, team runs) */
  onStat?: (card: StatCard) => void
}

interface Flight {
  kind: 'shot' | 'pass' | 'loose'
  shooter?: Athlete
  points?: number
  shotType?: ShotType
  grade?: Grade | null
  touchedRim: boolean
  resolved: boolean
  passer?: Athlete
  receiver?: Athlete
  interceptor?: Athlete | null
  t: number
  notCleared?: boolean
  assister?: Athlete | null
  /** a shooting foul on this attempt: free throws follow (an and-one if it drops) */
  foul?: { fouler: Athlete; shots: number } | null
  /** a free throw */
  ft?: boolean
  /** an alley-oop lob and when the cutter catches it */
  lob?: boolean
  catchAt?: number
  play?: Play
}

/** How a basket was made, for the booth, the replay label and the highlights. */
interface Play {
  stepback?: boolean
  euro?: boolean
  putback?: boolean
  alley?: boolean
  victim?: Athlete | null
}

interface ShootingState {
  a: Athlete
  t: number
  type: ShotType
  gw: number
  human: boolean
  plannedFill: number
  jumped: boolean
  /** a free throw (set shot, no defense) */
  ft?: boolean
  /** shooting out of a step-back or hesitation */
  rhythm?: boolean
  stepback?: boolean
}

interface FreeThrows {
  shooter: Athlete
  total: number
  idx: number
  t: number
  stage: 'setup' | 'ready' | 'shooting' | 'flight' | 'done'
  /** the ball has been bounced back to the shooter */
  returned: boolean
}

const INTRO_MATCHUP = 3.0

const RIM_FLOOR = new THREE.Vector3(0, 0, 0)
const RIM_TARGET = new THREE.Vector3(0, 0, 0)

export class Match implements EngineMode {
  engine: Engine
  config: MatchConfig
  events: MatchEvents
  teams: [Athlete[], Athlete[]] = [[], []]
  athletes: Athlete[] = []
  ball = new BallBody()
  holder: Athlete | null = null
  flight: Flight | null = null
  possTeam: 0 | 1 = 0
  mustClear = false
  humanTeam: 0 | 1 | null
  controlled: Athlete | null = null
  phase: MatchPhase = 'intro'
  phaseT = 0
  score: [number, number] = [0, 0]
  gameClock: number
  shotClock: number
  overtime = false
  elapsed = 0
  diff: DiffParams
  mateDiff: DiffParams = DIFFICULTY.allstar
  shooting: ShootingState | null = null
  hud: MatchHud
  highlights: string[] = []
  /** rolling recording for instant replays (created once athletes exist) */
  private replay: ReplayBuffer | null = null
  private pendingReplay: { at: number; scorer: Athlete; label: string } | null = null
  private replayScorer: Athlete | null = null
  private replayT = 0
  private replayFrom = 0
  private replayTo = 0
  private replayAt = 0
  private replaySide = 1
  private lastReplayAt = -99
  /** cut (rather than glide) the camera on the next update */
  private snapCamera = false
  private ballEv: BallEvents = { rim: 0, board: 0, floor: 0, scored: false }
  private nextPoss: 0 | 1 = 0
  private lastPass: { passer: Athlete; receiver: Athlete; time: number } | null = null
  private pendingSteal: { a: Athlete; t: number } | null = null
  private lastTouchTeam: 0 | 1 = 0
  private resultSent = false
  private winner: 0 | 1 | null = null
  private scoreboardTick = 0
  private squeakCooldown = 0
  private prevVel = new Map<Athlete, THREE.Vector2>()
  private tmp = new THREE.Vector3()
  private tmp2 = new THREE.Vector3()
  private proj = { x: 0, y: 0, visible: false }
  private meterFlash = 0
  private passPreview: Athlete | null = null
  private checkTargets = new Map<Athlete, THREE.Vector3>()
  private introFrom = new THREE.Vector3(-14, 10, 24)
  private gameOverAt = 0
  /** broadcast presentation: booth, crowd, lower-thirds */
  director: BroadcastDirector
  private pendingFT: { shooter: Athlete; shots: number } | null = null
  private ft: FreeThrows | null = null
  private introPlan: Athlete[] = []
  private introSeg = -2
  private introKey = 0
  /** the last dribble move per player (step-back threes, hesitation pull-ups) */
  private lastMove = new Map<Athlete, { kind: MoveName | 'pumpfake'; t: number }>()
  private unanswered = { team: -1, n: 0 }
  private pendingCharge: { a: Athlete; d: Athlete; t: number } | null = null
  private driveZoom = 0
  private checks = 0
  /** defensive switches after screens (both directions: defender <-> man), cleared every possession */
  switches = new Map<Athlete, Athlete>()

  constructor(engine: Engine, config: MatchConfig, events: MatchEvents) {
    this.engine = engine
    this.config = config
    this.events = events
    this.director = new BroadcastDirector(this)
    engine.effects.clearFires()
    this.diff = DIFFICULTY[config.difficulty]
    this.humanTeam = config.sides[0].human ? 0 : config.sides[1].human ? 1 : null
    this.gameClock = config.timeLimit
    this.shotClock = config.shotClock
    config.sides.forEach((side, ti) => {
      side.players.forEach((p, slot) => {
        const a = new Athlete(p, ti as 0 | 1, slot, side.jersey, side.team)
        a.onBounce = (x) => this.onBounce(x)
        engine.scene.add(a.char.group)
        this.teams[ti].push(a)
        this.athletes.push(a)
        this.prevVel.set(a, new THREE.Vector2())
      })
    })
    engine.scene.add(this.ball.mesh)
    const other = config.sides[0].team.id === config.courtTeam.id ? config.sides[1].team : config.sides[0].team
    engine.arena.setCourtTeam(config.courtTeam, other)
    engine.hoop.setPadColor(config.courtTeam.primary)
    engine.farHoop.setPadColor(config.courtTeam.primary)
    engine.hoop.net.reset()
    this.hud = {
      phase: 'intro',
      score: this.score,
      gameClock: this.gameClock,
      shotClock: this.shotClock,
      possession: 0,
      mustClear: false,
      humanTeam: this.humanTeam,
      offense: true,
      hasBall: false,
      looseBall: false,
      meter: { active: false, fill: 0, gw: 0.06, x: 0, y: 0, grade: null, flash: 0 },
      marker: { x: 0, y: 0, visible: false },
      passTarget: { x: 0, y: 0, visible: false, lob: false },
      overtime: false,
      controlledName: '',
      teamSize: config.mode === '3v3' ? 3 : 1,
      ft: { active: false, idx: 0, total: 0, name: '', human: false },
      fire: [false, false],
      controlledFire: 0,
      moveHint: 'crossover',
      intro: null,
    }
    if (this.humanTeam !== null) {
      const team = this.teams[this.humanTeam]
      this.controlled = team.find((a) => a.profile.id === config.focusPlayerId) ?? team[0]
      this.controlled.human = true
    }
    this.possTeam = config.firstPossession ?? (Math.random() < 0.5 ? 0 : 1)
    this.placeForIntro()
    this.engine.audio.stopMusic()
    this.engine.audio.startCrowd(0.06)
    this.engine.audio.setCrowdBase(0.06)
    this.updateScoreboard(true)
    const home = config.sides[0].team
    this.engine.rig.set(this.introFrom, new THREE.Vector3(0, 2, 4), true)
    this.engine.rig.targetFov = 40
    this.events.onPhase?.('intro', `${home.city} ${home.name}`)
    this.director.tipoff()
  }

  balls(): BallLike[] {
    return [this.ball]
  }

  get teamSize() {
    return this.teams[0].length
  }

  skipIntro(force = false) {
    if (this.phase === 'intro' && (force || this.phaseT > 0.4)) this.endIntro()
  }

  private get introShot() {
    return this.teamSize > 1 ? 1.7 : 2.0
  }

  /** Starting lineups stand along the free-throw line extended, facing the cameras at half court. */
  private placeForIntro() {
    this.introPlan = [...this.teams[0], ...this.teams[1]]
    for (const a of this.athletes) {
      const side = a.team === 0 ? -1 : 1
      a.pos.set(side * (1.35 + a.slot * 1.6), 0, 4.7 + a.slot * 0.3)
      a.vel.set(0, 0, 0)
      a.facing = side * 0.18
      a.faceTarget = null
    }
  }

  /** Matchup fly-in, then a spotlight on every starter with a lower-third and the PA announcer. */
  private updateIntro(inp: InputManager) {
    const shot = this.introShot
    const total = INTRO_MATCHUP + this.introPlan.length * shot
    if (this.phaseT > total || (this.phaseT > 0.5 && (inp.pressed.shoot || inp.pressed.pass || inp.pressed.skill))) {
      this.endIntro()
      return
    }
    const seg = this.phaseT < INTRO_MATCHUP ? -1 : Math.min(this.introPlan.length - 1, Math.floor((this.phaseT - INTRO_MATCHUP) / shot))
    if (seg === this.introSeg) return
    this.introSeg = seg
    if (seg < 0) return
    this.snapCamera = true
    const a = this.introPlan[seg]
    a.startAction('intro', shot + 0.5)
    const p = a.profile
    this.hud.intro = { key: ++this.introKey, team: a.team, first: p.firstName, last: p.lastName, number: p.number, position: p.position, heightCm: p.heightCm, ovr: overall(p.attributes, p.position), archetype: p.archetype }
    this.director.lineupPlayer(a)
  }

  private endIntro() {
    this.hud.intro = null
    this.introSeg = -2
    this.engine.commentary.stop()
    this.setupCheck(this.possTeam)
  }

  // ---------------------------------------------------------------- phases
  private setPhase(p: MatchPhase, info?: string) {
    this.phase = p
    this.phaseT = 0
    this.hud.phase = p
    this.events.onPhase?.(p, info)
  }

  private checkPositions(team: 0 | 1) {
    const off = this.teams[team]
    const def = this.teams[1 - team]
    const map = new Map<Athlete, THREE.Vector3>()
    const handlerIdx = this.humanTeam === team && this.controlled && this.controlled.team === team ? this.controlled.slot : 0
    const spots = [SPOTS.leftWing, SPOTS.rightWing, SPOTS.leftCorner, SPOTS.rightCorner]
    const pick = Math.random() < 0.5 ? [0, 1] : [2, 3]
    let k = 0
    off.forEach((a, i) => {
      if (i === handlerIdx) map.set(a, new THREE.Vector3(CHECK_SPOT.x, 0, CHECK_SPOT.z))
      else {
        const s = spots[pick[k++ % 2]]
        map.set(a, new THREE.Vector3(s.x, 0, s.z))
      }
    })
    def.forEach((d) => {
      const man = off[d.slot] ?? off[0]
      const mp = map.get(man)!
      const l = Math.hypot(mp.x, mp.z) || 1
      const gap = man.slot === handlerIdx ? 1.5 : 1.8
      map.set(d, new THREE.Vector3(mp.x - (mp.x / l) * gap, 0, mp.z - (mp.z / l) * gap))
    })
    return { map, handler: off[handlerIdx] ?? off[0] }
  }

  private placeForCheck(team: 0 | 1, snap: boolean) {
    const { map, handler } = this.checkPositions(team)
    for (const a of this.athletes) {
      const p = map.get(a)!
      if (snap) {
        a.pos.copy(p)
        a.vel.set(0, 0, 0)
      }
      a.facing = a.team === team ? Math.PI : Math.atan2(handler.pos.x - a.pos.x, handler.pos.z - a.pos.z)
      if (a.team !== team) a.facing = 0
    }
    return handler
  }

  private setupCheck(team: 0 | 1) {
    this.possTeam = team
    this.pendingReplay = null
    this.pendingFT = null
    this.pendingCharge = null
    this.ft = null
    this.hud.ft.active = false
    this.hud.intro = null
    this.switches.clear()
    this.engine.audio.hush(false)
    // the arena fills the dead ball (not before the opening check)
    if (this.checks++ > 0) this.director.deadBall(team)
    this.mustClear = false
    this.shotClock = this.config.shotClock
    this.flight = null
    this.shooting = null
    this.hud.meter.active = false
    this.engine.effects.stopTrail()
    for (const a of this.athletes) {
      a.endAction()
      a.jumpY = 0
      a.jumpV = 0
      a.airborne = false
      a.stumble = 0
      a.hasBall = false
      a.dribbling = false
      a.moveTarget = null
      a.moveDir.set(0, 0)
      a.sprint = false
      a.faceTarget = null
      a.ai.intent = 'idle'
      a.ai.plan = null
    }
    const handler = this.placeForCheck(team, true)
    this.holder = handler
    handler.hasBall = true
    handler.startAction('hold', 99)
    this.ball.free = false
    this.ball.vel.set(0, 0, 0)
    this.lastTouchTeam = team
    if (this.humanTeam !== null) {
      if (team === this.humanTeam) this.setControlled(handler)
      else this.setControlled(assignment(this, handler))
    }
    for (const a of this.athletes) {
      if (a.team !== team) a.faceTarget = handler.pos
    }
    this.setPhase('check')
    this.engine.audio.whistle()
  }

  private goLive() {
    const h = this.holder
    if (h) {
      h.endAction()
      h.dribbling = true
    }
    for (const a of this.athletes) a.faceTarget = null
    this.setPhase('live')
  }

  private setControlled(a: Athlete | null) {
    if (this.humanTeam === null) return
    if (this.controlled) {
      this.controlled.human = false
      this.controlled.moveDir.set(0, 0)
    }
    this.controlled = a
    if (a) {
      a.human = true
      a.moveTarget = null
      this.hud.controlledName = shortName(a.profile)
    }
  }

  // ---------------------------------------------------------------- update
  update(dt: number) {
    this.phaseT += dt
    this.elapsed += dt
    this.meterFlash = Math.max(0, this.meterFlash - dt)
    this.squeakCooldown -= dt
    const inp = this.engine.input

    switch (this.phase) {
      case 'intro':
        this.updateIntro(inp)
        break
      case 'check': {
        const humanOffense = this.humanTeam === this.possTeam
        const moved = humanOffense && (Math.hypot(inp.move.x, inp.move.y) > 0.3 || inp.pressed.shoot || inp.pressed.pass || inp.pressed.skill)
        if ((humanOffense && this.phaseT > 0.5 && moved) || this.phaseT > (humanOffense ? 1.6 : 1.1)) this.goLive()
        break
      }
      case 'live':
        this.updateLive(dt)
        break
      case 'scored':
      case 'dead':
        // a highlight gets an instant replay once the celebration has started
        if (this.phase === 'scored' && this.pendingReplay && this.phaseT > 1.0) {
          this.startReplay()
          // startReplay() may have changed the phase
          if ((this.phase as MatchPhase) === 'replay') return
        }
        if (this.phaseT > (this.phase === 'scored' ? 1.7 : 1.3)) this.afterDeadBall()
        else this.walkToCheck()
        break
      case 'freethrow':
        this.updateFreeThrow(dt)
        break
      case 'replay':
        this.updateReplay(dt)
        this.updateHud()
        return
      case 'over':
        if (!this.resultSent && this.elapsed - this.gameOverAt > 3.4) {
          this.resultSent = true
          this.events.onGameOver?.(this.buildResult())
        }
        break
    }

    for (const a of this.athletes) a.update(dt)
    this.resolveCollisions()
    this.updateBall(dt)
    if (this.phase === 'live' || this.phase === 'scored') {
      this.replay ??= new ReplayBuffer(this.athletes.length)
      this.replay.capture(this.elapsed, this.athletes, this.ball)
    }
    this.updateSqueaks()
    this.updateCamera(dt)
    this.updateHud()
    this.updateScoreboard(false)
    this.director.update()
  }

  /** After a whistle or a make: free throws if a foul is pending, otherwise the next check ball. */
  private afterDeadBall() {
    const p = this.pendingFT
    if (p) {
      this.pendingFT = null
      this.startFreeThrows(p.shooter, p.shots)
    } else this.setupCheck(this.nextPoss)
  }

  private walkToCheck() {
    if (this.phaseT < 0.15) {
      this.checkTargets = this.checkPositions(this.nextPoss).map
    }
    for (const a of this.athletes) {
      if (a.action === 'celebrate' || a.action === 'dunk' || a.airborne) continue
      const t = this.checkTargets.get(a)
      if (t && this.phaseT > 0.6) {
        a.moveTarget = t
        a.sprint = false
        a.defense = false
      }
    }
  }

  // ---------------------------------------------------------------- instant replay
  /** Ends a running replay early (HUD tap). */
  skipReplay() {
    if (this.phase === 'replay') this.finishReplay()
  }

  private startReplay() {
    const p = this.pendingReplay
    this.pendingReplay = null
    const rb = this.replay
    if (!p || !rb || rb.endTime - rb.startTime < 1.4) return
    this.replayTo = Math.min(rb.endTime, p.at + 0.8)
    this.replayFrom = Math.max(rb.startTime, this.replayTo - 3.2)
    this.replayT = this.replayFrom
    this.replayAt = p.at
    this.replayScorer = p.scorer
    this.replaySide = p.scorer.pos.x >= 0 ? 1 : -1
    this.lastReplayAt = this.elapsed
    this.snapCamera = true
    this.engine.effects.stopTrail()
    this.setPhase('replay', `${p.label}|${shortName(p.scorer.profile)}`)
  }

  private updateReplay(dt: number) {
    const inp = this.engine.input
    if (this.phaseT > 0.45 && (inp.pressed.shoot || inp.pressed.pass || inp.pressed.skill)) {
      this.finishReplay()
      return
    }
    // real time on the approach, deep slow motion through the slam or the swish
    const near = 1 - THREE.MathUtils.smoothstep(Math.abs(this.replayT - this.replayAt), 0.1, 1.0)
    this.replayT += dt * (0.92 - 0.6 * near)
    this.replay?.apply(this.replayT, this.athletes, this.ball)
    this.replayCamera()
    if (this.replayT >= this.replayTo) this.finishReplay()
  }

  /** Low, tight broadcast replay angle on the scorer and the rim, drifting around the play. */
  private replayCamera() {
    const scorer = this.replayScorer
    if (!scorer) return
    const rig = this.engine.rig
    const s = scorer.char.group.position
    const rim = this.engine.hoop.center
    const portrait = this.engine.aspect < 0.9
    const fx = s.x * 0.55 + rim.x * 0.45
    const fz = s.z * 0.55 + rim.z * 0.45
    const fy = 1.35 + Math.min(1.3, s.y * 0.9)
    const t = this.replayT - this.replayFrom
    const ang = this.replaySide * (1.0 - t * 0.11)
    const r = portrait ? 8.6 : 6.2
    this.tmp.set(fx + Math.sin(ang) * r, 1.15 + fy * 0.3, fz + Math.cos(ang) * r)
    this.tmp2.set(fx, fy, fz)
    rig.posLag = 2.4
    rig.set(this.tmp, this.tmp2, this.snapCamera)
    this.snapCamera = false
    rig.targetFov = portrait ? 50 : 33
    this.engine.shadowFocus.set(fx, 0, fz)
  }

  private finishReplay() {
    this.replayScorer = null
    this.snapCamera = true
    this.afterDeadBall()
  }

  private updateLive(dt: number) {
    // clocks
    const shotInAir = this.flight?.kind === 'shot' && !this.flight.resolved
    if (this.config.timeLimit > 0 && !this.overtime) {
      this.gameClock = Math.max(0, this.gameClock - dt)
      if (this.gameClock <= 0 && !shotInAir && !this.shooting) {
        this.timeExpired()
        return
      }
    }
    if (this.config.shotClock > 0 && !shotInAir && (this.holder || this.flight?.kind === 'pass')) {
      this.shotClock = Math.max(0, this.shotClock - dt)
      if (this.shotClock <= 0 && !this.shooting && !(this.holder && (this.holder.action === 'layup' || this.holder.action === 'dunk'))) {
        this.engine.audio.buzzer()
        this.turnover((1 - this.possTeam) as 0 | 1, 'SHOT CLOCK VIOLATION')
        return
      }
    }
    // clearing
    if (this.mustClear && this.holder && this.holder.team === this.possTeam && isBeyondArc(this.holder.pos.x, this.holder.pos.z)) {
      this.mustClear = false
      if (this.holder.team === this.humanTeam) this.events.onFeedback?.('CLEARED', 'info')
    }
    // pending steal resolution
    if (this.pendingSteal) {
      this.pendingSteal.t -= dt
      if (this.pendingSteal.t <= 0) {
        this.resolveSteal(this.pendingSteal.a)
        this.pendingSteal = null
      }
    }
    // a spin straight into a set defender: the whistle comes on contact
    if (this.pendingCharge) {
      const pc = this.pendingCharge
      pc.t -= dt
      if (pc.t <= 0) {
        this.pendingCharge = null
        if (this.holder === pc.a && Math.hypot(pc.a.pos.x - pc.d.pos.x, pc.a.pos.z - pc.d.pos.z) < 1.25) this.chargeFoul(pc.a, pc.d)
      }
      if (this.phase !== 'live') return
    }
    // screens that connect slow the defender and can force a switch
    updateScreens(this, dt)
    // shooting meter
    if (this.shooting) this.updateShooting(dt)
    // human
    if (this.controlled) this.updateHuman(dt)
    // AI
    for (const a of this.athletes) {
      if (a.human) continue
      aiUpdate(this, a, dt)
    }
  }

  private timeExpired() {
    if (this.score[0] === this.score[1]) {
      this.overtime = true
      this.hud.overtime = true
      this.engine.audio.buzzer()
      this.events.onFeedback?.('OVERTIME', 'big', 'Next basket wins')
      this.director.overtime()
      return
    }
    this.endGame(this.score[0] > this.score[1] ? 0 : 1)
  }

  // ---------------------------------------------------------------- human control
  private updateHuman(dt: number) {
    const c = this.controlled!
    const inp = this.engine.input
    const mx = inp.move.x
    const mz = -inp.move.y
    const mag = Math.hypot(mx, mz)
    this.passPreview = null
    c.lookTarget = this.holder === c ? null : this.ball.pos
    if (this.holder === c) {
      c.defense = false
      if (this.shooting && this.shooting.a === c) {
        if (inp.released.shoot) this.releaseShot()
        return
      }
      if (c.busy || c.stumble > 0) return
      c.moveTarget = null
      c.moveDir.set(mx, mz)
      c.sprint = inp.sprint
      c.faceTarget = null
      this.hud.moveHint = this.moveFor(c, mx, mz)
      if (this.teamSize > 1) this.passPreview = this.choosePassTarget(c, mx, mz)
      if (inp.pressed.shoot) this.startShot(c, true)
      else if (inp.pressed.pass && this.teamSize > 1 && this.passPreview) this.doPass(c, this.passPreview)
      else if (inp.pressed.skill) this.doMove(c, mx, mz)
      return
    }
    if (this.holder && this.holder.team !== c.team) {
      if (inp.pressed.pass && this.teamSize > 1) {
        this.switchToNearest(this.holder.pos)
        return
      }
      if (mag < 0.12 && !c.busy && !c.airborne) {
        aiDefend(this, c, dt, this.diff, true)
      } else if (!c.busy || c.action === 'steal') {
        c.defense = true
        c.moveTarget = null
        c.moveDir.set(mx, mz)
        c.sprint = inp.sprint
        c.faceTarget = this.holder.pos
      }
      if (inp.pressed.shoot) this.blockJump(c)
      if (inp.pressed.skill) this.doSteal(c)
      return
    }
    // loose ball / pass in flight
    c.defense = false
    if (inp.pressed.pass && this.teamSize > 1 && !(this.flight?.kind === 'pass' && this.flight.passer?.team === c.team)) {
      this.switchToNearest(this.ball.pos)
      return
    }
    if (mag < 0.12 && !c.busy) {
      aiUpdate(this, c, dt)
    } else {
      c.moveTarget = null
      c.moveDir.set(mx, mz)
      c.sprint = inp.sprint
      c.faceTarget = this.ball.pos
    }
    if (inp.pressed.shoot) this.reboundJump(c)
  }

  private switchToNearest(p: THREE.Vector3) {
    if (this.humanTeam === null) return
    let best: Athlete | null = null
    let bd = 99
    for (const a of this.teams[this.humanTeam]) {
      if (a === this.controlled) continue
      const d = Math.hypot(a.pos.x - p.x, a.pos.z - p.z)
      if (d < bd) {
        bd = d
        best = a
      }
    }
    if (best) {
      this.setControlled(best)
      this.engine.audio.click()
    }
  }

  choosePassTarget(a: Athlete, mx: number, mz: number): Athlete | null {
    const mates = this.teams[a.team].filter((t) => t !== a)
    if (!mates.length) return null
    const ml = Math.hypot(mx, mz)
    let best: Athlete | null = null
    let bestScore = -99
    for (const t of mates) {
      const dx = t.pos.x - a.pos.x
      const dz = t.pos.z - a.pos.z
      const d = Math.hypot(dx, dz) || 1
      let open = 99
      for (const o of this.teams[1 - a.team]) open = Math.min(open, Math.hypot(o.pos.x - t.pos.x, o.pos.z - t.pos.z))
      let score: number
      if (ml > 0.35) score = ((dx * mx + dz * mz) / (d * ml)) * 3 + Math.min(open, 3) * 0.15
      else score = Math.min(open, 4) - d * 0.12
      if (score > bestScore) {
        bestScore = score
        best = t
      }
    }
    return best
  }

  // ---------------------------------------------------------------- actions
  startShot(a: Athlete, human: boolean) {
    if (this.holder !== a || a.busy || this.phase !== 'live') return
    const dist = distToRim(a.pos.x, a.pos.z)
    const toward = -(a.vel.x * a.pos.x + a.vel.z * a.pos.z) / (dist || 1)
    if (dist < 1.9 || (dist < 3.5 && toward > 3.0)) {
      const athletic = a.attrs.dunk >= 55 && a.H >= 1.86
      const momentum = a.sprint || toward > 4 || dist < 1.4
      const dunkRoll = Math.random() < (a.attrs.dunk - 45) / 60 + (a.attrs.vertical - 60) / 220 + (a.human ? 0.12 : 0)
      if (athletic && momentum && dunkRoll) this.startDunk(a)
      else this.startLayup(a)
      return
    }
    const three = isThree(a.pos.x, a.pos.z)
    const type: ShotType = three ? 'three' : 'jumper'
    const diff = a.team === this.humanTeam ? this.mateDiff : this.diff
    const humanDiff = { ...this.diff, greenMul: this.diff.greenMul * this.diff.humanAssist * this.engine.input.timingAssist }
    // a hot hand widens the window; so does rising straight out of a step-back or hesitation
    const gw = greenWindow(a, type, human ? humanDiff : diff) * (a.fire === 2 ? 1.35 : a.fire === 1 ? 1.12 : 1) * (a.rhythm > 0 ? 1.08 : 1)
    const plannedFill = human ? METER_IDEAL : this.plannedFill(a, type, diff, gw)
    const lm = this.lastMove.get(a)
    const stepback = !!lm && lm.kind === 'stepback' && this.elapsed - lm.t < 1.2
    a.startAction('shoot', 4)
    a.dribbling = false
    a.faceTarget = RIM_TARGET
    a.vel.multiplyScalar(0.35)
    this.shooting = { a, t: 0, type, gw, human, plannedFill, jumped: false, rhythm: a.rhythm > 0, stepback }
    if (human) {
      this.hud.meter.active = true
      this.hud.meter.grade = null
      this.hud.meter.gw = gw
    }
  }

  /** Where an AI shooter will let go on the meter, from a graded roll. */
  private plannedFill(a: Athlete, type: ShotType, diff: DiffParams, gw: number) {
    let plannedFill = METER_IDEAL
    {
      const g = rollGrade(diff, shotRating(a, type))
      const r = Math.random()
      switch (g) {
        case 'perfect':
          plannedFill = METER_IDEAL + (r - 0.5) * gw
          break
        case 'good':
          plannedFill = METER_IDEAL + (r < 0.5 ? -1 : 1) * gw * (1.1 + Math.random() * 1.3)
          break
        case 'early':
          plannedFill = METER_IDEAL - gw * 2.6 - Math.random() * (0.2 - gw * 2.6)
          break
        case 'late':
          plannedFill = METER_IDEAL + gw * 2.6 + Math.random() * (0.2 - gw * 2.6)
          break
        case 'veryEarly':
          plannedFill = METER_IDEAL - 0.3
          break
        case 'veryLate':
          plannedFill = Math.min(METER_MAX - 0.01, METER_IDEAL + 0.3)
          break
      }
    }
    return plannedFill
  }

  private updateShooting(dt: number) {
    const s = this.shooting!
    s.t += dt
    const fill = s.t / METER_FILL_TIME
    if (!s.jumped && s.t >= (s.rhythm ? 0.12 : 0.18)) {
      s.jumped = true
      s.a.jump(0.32 + (s.a.attrs.vertical / 99) * 0.18)
    }
    if (s.human) {
      this.hud.meter.fill = Math.min(fill, METER_MAX)
      if (fill >= METER_MAX) this.releaseShot()
    } else if (fill >= s.plannedFill) this.releaseShot()
  }

  releaseShot() {
    const s = this.shooting
    if (!s) return
    // a quick tap is a pump fake, not a shot
    if (s.human && !s.ft && s.t < 0.14) {
      this.pumpFake(s.a)
      return
    }
    this.shooting = null
    const a = s.a
    const fill = Math.min(METER_MAX, s.t / METER_FILL_TIME)
    const grade = gradeRelease(fill, s.gw)
    a.releaseT = a.actionT
    a.actionDur = a.actionT + 0.6
    const from = a.ballPosition(new THREE.Vector3())
    if (s.human) {
      this.hud.meter.grade = grade
      this.hud.meter.fill = fill
      this.meterFlash = 0.9
    }
    if (s.ft) {
      this.releaseFreeThrow(a, s, grade)
      return
    }
    const defenders = this.teams[1 - a.team]
    const contest = computeContest(a, defenders, s.type, this.humanTeam === a.team ? this.diff.contest : 1)
    // rhythm (a step-back or hesitation into the shot) leaves the closest defender a beat behind
    if (s.rhythm) contest.contest *= 0.72
    const dist = distToRim(a.pos.x, a.pos.z)
    const three = s.type === 'three'
    a.stats.fga++
    if (three) a.stats.tpa++
    const foul = this.rollShootingFoul(a, contest.blocker ?? this.closestDefender(a), contest.contest, s.type)
    if (!foul && contest.blocker && Math.random() < contest.blockChance) {
      this.blockShot(a, contest.blocker, from, three ? 3 : 2)
      return
    }
    const dimer = this.lastPass && this.lastPass.receiver === a && this.elapsed - this.lastPass.time < 2.5 ? badgeLevel(this.lastPass.passer.profile, 'dimer') : 0
    const base = baseChance(a, s.type, dist, { moving: a.speed, catchShoot: a.catchTimer < 1.4, dimer })
    let p = this.hotHand(a, finalChance(a, s.type, base, contest.contest, grade))
    if (foul) p *= 0.6
    const make = Math.random() < p
    const target = aimPoint(make, from, grade)
    const angle = (three ? 48 : 50) + Math.random() * 4
    const v = solveLaunch(from, target, angle)
    this.launchShot(a, from, v, three ? 3 : 2, s.type, grade, { foul, play: s.stepback ? { stepback: true } : undefined })
    if (foul) this.whistleFoul(foul.fouler, a)
    if (grade === 'perfect' || a.fire === 2) {
      if (grade === 'perfect') a.stats.greens++
      this.engine.effects.startTrail(() => (this.ball.free ? this.ball.pos : null), a.fire === 2 ? '#ff7a1a' : '#3dff8a')
      if (grade === 'perfect' && (a.team === this.humanTeam || this.humanTeam === null)) this.engine.audio.green()
    }
    if (s.human) {
      const kind: FeedbackKind = grade === 'perfect' ? 'green' : grade === 'good' ? 'good' : 'bad'
      const contestTxt = contest.contest > 0.7 ? 'Smothered' : contest.contest > 0.4 ? 'Contested' : contest.contest > 0.15 ? 'Light contest' : 'Wide open'
      this.events.onFeedback?.(GRADE_TEXT[grade], kind, contestTxt)
    }
  }

  private launchShot(a: Athlete, from: THREE.Vector3, v: THREE.Vector3, points: number, type: ShotType, grade: Grade | null, extra: { foul?: { fouler: Athlete; shots: number } | null; play?: Play } = {}) {
    this.ball.pos.copy(from)
    this.ball.launch(v, type === 'layup' ? 5 : 10)
    this.holder = null
    a.hasBall = false
    this.lastTouchTeam = a.team
    const assister = this.lastPass && this.lastPass.receiver === a && this.elapsed - this.lastPass.time < 4 ? this.lastPass.passer : null
    this.flight = { kind: 'shot', shooter: a, points, shotType: type, grade, touchedRim: false, resolved: false, t: 0, notCleared: this.mustClear, assister, foul: extra.foul ?? null, play: extra.play }
    for (const x of this.athletes) x.ai.think = Math.min(x.ai.think, 0.15)
  }

  private blockShot(shooter: Athlete, blocker: Athlete, from: THREE.Vector3, points: number) {
    this.ball.pos.copy(from)
    const l = Math.hypot(shooter.pos.x, shooter.pos.z) || 1
    const side = (Math.random() - 0.5) * 4
    const v = new THREE.Vector3((shooter.pos.x / l) * 3.5 + -shooter.pos.z / l * side, 2.5 + Math.random() * 2, (shooter.pos.z / l) * 3.5 + (shooter.pos.x / l) * side)
    this.ball.launch(v, 2)
    this.holder = null
    shooter.hasBall = false
    this.lastTouchTeam = blocker.team
    this.flight = { kind: 'loose', touchedRim: false, resolved: true, t: 0, shooter, points }
    blocker.stats.blk++
    this.engine.audio.board(1.5)
    this.engine.arena.addCheer(0.6)
    this.engine.rig.addTrauma(0.3)
    this.engine.hitStop(0.06, 0.2)
    this.events.onFeedback?.(Math.random() < 0.5 ? 'BLOCKED!' : 'REJECTED!', 'big', shortName(blocker.profile))
    this.highlights.push(`${shortName(blocker.profile)} block`)
    this.onMissed(shooter)
    this.director.block(blocker)
  }

  // ---------------------------------------------------------------- fouls
  private closestDefender(a: Athlete) {
    let best: Athlete | null = null
    let bd = 99
    for (const d of this.teams[1 - a.team]) {
      const dd = Math.hypot(d.pos.x - a.pos.x, d.pos.z - a.pos.z)
      if (dd < bd) {
        bd = dd
        best = d
      }
    }
    return best
  }

  /**
   * Rolls a shooting foul on an attempt. FIBA 3x3: a foul on a shot inside the arc is worth one free throw,
   * beyond it two; an and-one is one. Late jumps into the shooter and poor defenders draw the most whistles.
   */
  private rollShootingFoul(shooter: Athlete, d: Athlete | null, contest: number, type: ShotType): { fouler: Athlete; shots: number } | null {
    if (!d || d.stumble > 0) return null
    const dist = Math.hypot(d.pos.x - shooter.pos.x, d.pos.z - shooter.pos.z)
    if (dist > 1.6) return null
    let p = type === 'layup' || type === 'dunk' ? (contest > 0.45 ? 0.15 : 0.04) : contest > 0.6 ? 0.07 : 0.015
    if (d.airborne && d.action === 'block' && d.actionT < 0.25) p *= 1.8
    p *= Math.max(0.35, 1.35 - d.attrs.perimD / 140 - (d.attrs.block / 99) * 0.15)
    if (shooter.human) p *= 1 + (this.diff.humanAssist - 1) * 0.8
    if (Math.random() >= p) return null
    return { fouler: d, shots: type === 'three' ? 2 : 1 }
  }

  /** The whistle on a shooting foul; the shot plays out before the free throws. */
  private whistleFoul(fouler: Athlete, shooter: Athlete) {
    this.engine.audio.whistle(2)
    const mine = fouler.team === this.humanTeam
    this.events.onFeedback?.('FOUL', mine ? 'bad' : 'info', `on ${shortName(fouler.profile)}`)
    void shooter
  }

  private reachFoul(d: Athlete, h: Athlete) {
    this.engine.audio.whistle(2)
    this.events.onFeedback?.('REACH-IN FOUL', d.team === this.humanTeam ? 'bad' : 'info', shortName(d.profile))
    this.director.foul(d, h, 0)
    this.nextPoss = h.team
    this.setPhase('dead')
  }

  // ---------------------------------------------------------------- hot streaks
  /** A make chance with the hot hand applied (heating up / on fire). */
  private hotHand(a: Athlete, p: number) {
    return Math.min(0.985, p * (a.fire === 2 ? 1.12 : a.fire === 1 ? 1.04 : 1))
  }

  private setFire(a: Athlete, level: 0 | 1 | 2) {
    const prev = a.fire
    if (prev === level) return
    a.fire = level
    this.engine.effects.setFire(a.profile.id, level === 2 ? () => a.char.group.position : null, level === 2)
    const mine = a.team === this.humanTeam || this.humanTeam === null
    if (level === 2) {
      this.engine.audio.ignite()
      this.events.onFeedback?.('ON FIRE', mine ? 'big' : 'info', shortName(a.profile))
      this.highlights.push(`${shortName(a.profile)} caught fire`)
    } else if (level === 1) this.events.onFeedback?.('HEATING UP', mine ? 'good' : 'info', shortName(a.profile))
    else if (prev === 2) this.events.onFeedback?.('COOLED OFF', 'info', shortName(a.profile))
    this.director.streak(a, level, prev)
    this.hud.fire[a.team] = this.teams[a.team].some((x) => x.fire === 2)
  }

  private onMade(s: Athlete) {
    s.streak++
    s.colds = 0
    if (s.streak >= 3) this.setFire(s, 2)
    else if (s.streak >= 2) this.setFire(s, 1)
    // the other side's fire burns out after two unanswered buckets
    if (this.unanswered.team === s.team) this.unanswered.n++
    else this.unanswered = { team: s.team, n: 1 }
    if (this.unanswered.n >= 2) {
      for (const o of this.teams[1 - s.team]) {
        if (o.fire > 0) {
          o.streak = 0
          this.setFire(o, 0)
        }
      }
    }
  }

  private onMissed(s: Athlete) {
    s.streak = 0
    s.colds++
    if (s.fire === 1 || (s.fire === 2 && s.colds >= 2)) this.setFire(s, 0)
  }

  // ---------------------------------------------------------------- free throws
  private startFreeThrows(shooter: Athlete, total: number) {
    this.ft = { shooter, total, idx: 1, t: 0, stage: 'setup', returned: true }
    this.possTeam = shooter.team
    this.mustClear = false
    this.flight = null
    this.shooting = null
    this.pendingReplay = null
    this.hud.meter.active = false
    this.engine.effects.stopTrail()
    for (const a of this.athletes) {
      a.endAction()
      a.jumpY = 0
      a.jumpV = 0
      a.airborne = false
      a.stumble = 0
      a.hasBall = false
      a.dribbling = false
      a.moveTarget = null
      a.moveDir.set(0, 0)
      a.sprint = false
      a.faceTarget = null
      a.ai.intent = 'idle'
      a.ai.plan = null
    }
    this.placeForFreeThrows(shooter)
    this.giveBall(shooter)
    if (this.humanTeam !== null && shooter.team === this.humanTeam) this.setControlled(shooter)
    this.hud.ft = { active: true, idx: 1, total, name: shortName(shooter.profile), human: shooter.human }
    this.snapCamera = true
    this.setPhase('freethrow')
    this.director.ftSetup(shooter)
  }

  /** Shooter on the stripe, defenders on the blocks, everyone else spaced behind the arc. */
  private placeForFreeThrows(shooter: Athlete) {
    const lane = COURT.keyHalfWidth + 0.4
    const spots = [
      [-lane, 1.0],
      [lane, 1.0],
      [-lane, 2.15],
      [lane, 2.15],
    ]
    const outside = [
      [-3.4, 7.9],
      [3.4, 7.9],
      [0, 9.6],
    ]
    shooter.pos.set(0, 0, COURT.freeThrowZ + 0.32)
    const order = [...this.teams[1 - shooter.team], ...this.teams[shooter.team].filter((a) => a !== shooter)]
    let i = 0
    let o = 0
    for (const a of order) {
      const s = i < spots.length ? spots[i++] : outside[o++ % outside.length]
      a.pos.set(s[0], 0, s[1])
    }
    for (const a of this.athletes) {
      a.vel.set(0, 0, 0)
      a.facing = a === shooter ? Math.PI : Math.atan2(-a.pos.x, -a.pos.z * 0.3 + 2)
    }
  }

  private giveBall(a: Athlete) {
    this.holder = a
    a.hasBall = true
    a.dribbling = false
    a.endAction()
    a.startAction('hold', 99)
    this.ball.free = false
    this.ball.vel.set(0, 0, 0)
    this.flight = null
  }

  private updateFreeThrow(dt: number) {
    const ft = this.ft
    if (!ft) {
      this.setupCheck(this.nextPoss)
      return
    }
    const s = ft.shooter
    const inp = this.engine.input
    ft.t += dt
    this.hud.ft.idx = ft.idx
    s.faceTarget = RIM_TARGET
    switch (ft.stage) {
      case 'setup':
        if (ft.t > 1.1) {
          ft.stage = 'ready'
          ft.t = 0
        }
        break
      case 'ready':
        if (this.holder !== s) this.giveBall(s)
        if (s.human) {
          if (inp.pressed.shoot && ft.t > 0.2) this.startFreeThrowShot(s, true)
        } else if (ft.t > 0.9) this.startFreeThrowShot(s, false)
        break
      case 'shooting':
        if (!this.shooting) break
        if (s.human && inp.released.shoot) this.releaseShot()
        else this.updateShooting(dt)
        break
      case 'flight':
        if (ft.t > 4) this.ftResolved(false)
        break
      case 'done':
        // the official bounces it back to the shooter for the next one
        if (ft.idx < ft.total && !ft.returned && ft.t > 0.45 && this.holder !== s) {
          ft.returned = true
          const from = this.ball.pos.clone()
          const to = new THREE.Vector3(s.pos.x, 1.1, s.pos.z - 0.25)
          this.ball.free = true
          this.ball.launch(solveLaunch(from, to, 28), 2)
          this.flight = { kind: 'pass', receiver: s, interceptor: null, touchedRim: false, resolved: true, t: 0 }
        }
        if (ft.t > 1.3) {
          if (ft.idx < ft.total) {
            ft.idx++
            ft.stage = 'ready'
            ft.t = 0
            ft.returned = false
            if (this.holder !== s) this.giveBall(s)
          } else this.endFreeThrows()
        }
        break
    }
  }

  private startFreeThrowShot(a: Athlete, human: boolean) {
    const ft = this.ft!
    const diff = a.team === this.humanTeam ? this.mateDiff : this.diff
    const humanDiff = { ...this.diff, greenMul: this.diff.greenMul * this.diff.humanAssist * this.engine.input.timingAssist }
    // an uncontested set shot: a slightly kinder window
    const gw = greenWindow(a, 'jumper', human ? humanDiff : diff) * 1.2 * (a.fire === 2 ? 1.2 : 1)
    const plannedFill = human ? METER_IDEAL : this.plannedFill(a, 'jumper', diff, gw)
    a.endAction()
    a.startAction('shoot', 4)
    a.dribbling = false
    a.faceTarget = RIM_TARGET
    this.shooting = { a, t: 0, type: 'jumper', gw, human, plannedFill, jumped: true, ft: true }
    if (human) {
      this.hud.meter.active = true
      this.hud.meter.grade = null
      this.hud.meter.gw = gw
    }
    ft.stage = 'shooting'
    ft.t = 0
  }

  private releaseFreeThrow(a: Athlete, s: ShootingState, grade: Grade) {
    const from = a.ballPosition(new THREE.Vector3())
    const r = a.attrs.mid * 0.65 + a.attrs.three * 0.35
    let p = 0.66 + (r - 60) * 0.008
    p *= grade === 'perfect' ? 1.32 : grade === 'good' ? 1.12 : grade === 'early' || grade === 'late' ? 0.75 : 0.3
    p = Math.max(0.05, Math.min(0.985, this.hotHand(a, p)))
    const make = Math.random() < p
    const target = aimPoint(make, from, grade)
    this.ball.pos.copy(from)
    this.ball.launch(solveLaunch(from, target, 52), 9)
    this.holder = null
    a.hasBall = false
    a.stats.fta++
    this.flight = { kind: 'shot', shooter: a, points: 1, shotType: 'jumper', grade, touchedRim: false, resolved: false, t: 0, ft: true }
    if (this.ft) {
      this.ft.stage = 'flight'
      this.ft.t = 0
    }
    if (s.human) this.events.onFeedback?.(GRADE_TEXT[grade], grade === 'perfect' ? 'green' : grade === 'good' ? 'good' : 'bad')
    if (grade === 'perfect' && s.human) this.engine.audio.green()
  }

  private ftResolved(made: boolean) {
    const ft = this.ft
    if (!ft || ft.stage === 'done') return
    const s = ft.shooter
    ft.stage = 'done'
    ft.t = 0
    ft.returned = false
    const last = ft.idx >= ft.total
    if (made) {
      this.score[s.team] += 1
      s.stats.pts += 1
      s.stats.ftm++
      this.events.onScore?.(s.team, 1, s.profile)
      this.updateScoreboard(true)
      this.events.onFeedback?.('+1', 'score', 'FREE THROW')
    } else this.events.onFeedback?.('NO GOOD', 'info', 'Free throw')
    this.director.freeThrow(s, made, last)
    const target = this.config.targetScore
    if (made && ((target > 0 && this.score[s.team] >= target) || this.overtime)) {
      this.ft = null
      this.hud.ft.active = false
      this.endGame(s.team)
    }
  }

  private endFreeThrows() {
    const s = this.ft?.shooter
    this.ft = null
    this.hud.ft.active = false
    this.setupCheck(s ? ((1 - s.team) as 0 | 1) : this.nextPoss)
  }

  private startLayup(a: Athlete) {
    const l = Math.hypot(a.pos.x, a.pos.z) || 1
    const end = new THREE.Vector3((a.pos.x / l) * 0.85, 0, Math.max(0.35, (a.pos.z / l) * 0.85))
    // a help defender planted in the lane: euro step around him
    const dist = distToRim(a.pos.x, a.pos.z)
    if (dist > 1.7) {
      const px = -(end.z - a.pos.z)
      const pz = end.x - a.pos.x
      const pl = Math.hypot(px, pz) || 1
      for (const d of this.teams[1 - a.team]) {
        if (d.stumble > 0 || distToRim(d.pos.x, d.pos.z) > dist) continue
        if (segDist(d.pos.x, d.pos.z, a.pos.x, a.pos.z, end.x, end.z) < 0.8 && Math.random() < 0.45 + a.attrs.finish / 250) {
          const side = ((d.pos.x - a.pos.x) * px + (d.pos.z - a.pos.z) * pz) / pl
          this.startEuroLayup(a, side > 0 ? 1 : -1, end)
          return
        }
      }
    }
    this.layupFinish(a, false)
  }

  /** Two long steps, the first toward the help defender and the second around him, then the finish. */
  private startEuroLayup(a: Athlete, side: 1 | -1, end: THREE.Vector3) {
    a.startAction('alley', 2)
    a.dribbling = false
    a.faceTarget = RIM_TARGET
    const start = a.pos.clone()
    const px = -(end.z - start.z)
    const pz = end.x - start.x
    const pl = Math.hypot(px, pz) || 1
    let clock = 0
    a.script = (dt) => {
      clock += dt
      const k = Math.min(1, clock / 0.44)
      const lat = side * 0.55 * (k < 0.45 ? THREE.MathUtils.smoothstep(k, 0, 0.45) : 1 - 1.85 * THREE.MathUtils.smoothstep(k, 0.45, 1))
      const ox = a.pos.x
      const oz = a.pos.z
      a.pos.set(start.x + (end.x - start.x) * 0.5 * k + (px / pl) * lat, 0, start.z + (end.z - start.z) * 0.5 * k + (pz / pl) * lat)
      a.vel.set((a.pos.x - ox) / Math.max(dt, 1e-3), 0, (a.pos.z - oz) / Math.max(dt, 1e-3))
      if (clock >= 0.44) {
        if (this.holder !== a) {
          a.endAction()
          return false
        }
        this.layupFinish(a, true)
      }
      return true
    }
    if (a.human) this.events.onFeedback?.('EURO STEP', 'info')
  }

  private layupFinish(a: Athlete, euro: boolean) {
    a.endAction()
    a.startAction('layup', 1.0)
    a.dribbling = false
    a.faceTarget = RIM_TARGET
    const start = a.pos.clone()
    const l = Math.hypot(a.pos.x, a.pos.z) || 1
    const end = new THREE.Vector3((a.pos.x / l) * 0.85, 0, Math.max(0.35, (a.pos.z / l) * 0.85))
    let released = false
    let jumped = false
    a.script = (dt) => {
      const t = a.actionT
      if (t < 0.6) {
        const k = Math.min(1, t / 0.55)
        const e = k * (2 - k)
        a.pos.lerpVectors(start, end, e)
        a.vel.set((end.x - start.x) * 1.5, 0, (end.z - start.z) * 1.5)
      }
      if (!jumped && t >= 0.18) {
        jumped = true
        a.jump(0.5 + (a.attrs.vertical / 99) * 0.25)
      }
      if (!released && t >= 0.47) {
        released = true
        if (this.holder !== a) return true
        const from = a.ballPosition(new THREE.Vector3())
        const contest = computeContest(a, this.teams[1 - a.team], 'layup', this.humanTeam === a.team ? this.diff.contest : 1)
        // the euro step leaves the help defender reaching at air
        if (euro) {
          contest.contest *= 0.7
          contest.blockChance *= 0.6
        }
        a.stats.fga++
        const foul = this.rollShootingFoul(a, contest.blocker ?? this.closestDefender(a), contest.contest, 'layup')
        if (!foul && contest.blocker && Math.random() < contest.blockChance) {
          this.blockShot(a, contest.blocker, from, 2)
          return true
        }
        const base = baseChance(a, 'layup', distToRim(a.pos.x, a.pos.z))
        let p = this.hotHand(a, finalChance(a, 'layup', base, contest.contest, null))
        if (foul) p *= 0.6
        const make = Math.random() < p
        const target = aimPoint(make, from, null)
        // a soft, high touch that drops in over the front of the rim
        const v = solveLaunchApex(from, target, Math.max(from.y, COURT.rimHeight) + 0.38 + Math.random() * 0.14)
        this.launchShot(a, from, v, 2, 'layup', null, { foul, play: euro ? { euro: true } : undefined })
        if (foul) this.whistleFoul(foul.fouler, a)
        else if (a.team === this.humanTeam && a.human && !euro) {
          this.events.onFeedback?.(contest.contest > 0.5 ? 'TOUGH LAYUP' : 'LAYUP', 'info')
        }
      }
      void dt
      return t < 0.6
    }
  }

  private startDunk(a: Athlete) {
    a.startAction('dunk', 1.22)
    a.dribbling = false
    a.faceTarget = RIM_TARGET
    a.holdAir = true
    const start = a.pos.clone()
    const l = Math.hypot(a.pos.x, a.pos.z) || 1
    const ux = a.pos.x / l
    const uz = Math.max(0.25, a.pos.z / l)
    const ul = Math.hypot(ux, uz)
    const end = new THREE.Vector3((ux / ul) * 0.6, 0, (uz / ul) * 0.6)
    const peak = Math.max(0.5, COURT.rimHeight + 0.14 - a.H * 1.27)
    let slammed = false
    let blocked = false
    let checked = false
    let poster: Athlete | null = null
    let foul: { fouler: Athlete; shots: number } | null = null
    a.script = () => {
      const t = a.actionT
      if (t < 0.56) {
        const k = Math.max(0, (t - 0.05) / 0.51)
        const e = Math.min(1, k * (2 - k))
        a.pos.lerpVectors(start, end, e)
      }
      if (t < 0.2) a.jumpY = 0
      else if (t < 0.56) {
        const k = (t - 0.2) / 0.36
        a.jumpY = peak * (1 - (1 - k) * (1 - k))
      } else if (t < 0.95 && !blocked) a.jumpY = peak - (t - 0.56) * 0.08
      else {
        const t0 = blocked ? 0.5 : 0.95
        const k = Math.min(1, (t - t0) / 0.27)
        const startY = blocked ? peak * 0.9 : peak - 0.031
        a.jumpY = Math.max(0, startY * (1 - k * k))
      }
      a.airborne = a.jumpY > 0.001
      if (!checked && t >= 0.32) {
        checked = true
        const contest = computeContest(a, this.teams[1 - a.team], 'dunk', this.humanTeam === a.team ? this.diff.contest : 1)
        if (contest.blocker && Math.hypot(contest.blocker.pos.x - a.pos.x, contest.blocker.pos.z - a.pos.z) < 1.6) poster = contest.blocker
        foul = this.rollShootingFoul(a, contest.blocker ?? this.closestDefender(a), contest.contest, 'dunk')
        if (!foul && contest.blocker && Math.random() < contest.blockChance * 0.8) {
          blocked = true
          a.stats.fga++
          const from = a.ballPosition(new THREE.Vector3())
          this.blockShot(a, contest.blocker, from, 2)
          a.actionDur = 0.85
        }
      }
      if (!slammed && !blocked && t >= 0.6 && this.holder === a) {
        slammed = true
        this.slam(a, ux, uz, { foul, play: poster ? { victim: poster } : undefined })
      }
      if (t >= 1.22 || (blocked && t >= 0.85)) {
        a.jumpY = 0
        a.airborne = false
        a.holdAir = false
        return false
      }
      return true
    }
  }

  doPass(a: Athlete, target: Athlete) {
    if (this.holder !== a || a.busy) return
    if (this.canLob(a, target) && this.throwLob(a, target)) return
    a.startAction('pass', 0.32)
    a.dribbling = false
    a.faceTarget = target.pos
    const from = a.ballPosition(new THREE.Vector3())
    from.y = Math.max(1.0, from.y)
    const d = Math.hypot(target.pos.x - from.x, target.pos.z - from.z)
    const speed = 10 + (a.attrs.passing / 99) * 3.5
    const tf = d / speed
    const lead = new THREE.Vector3(target.pos.x + target.vel.x * tf * 0.85, 1.25, target.pos.z + target.vel.z * tf * 0.85)
    lead.x = Math.max(BOUNDS.minX, Math.min(BOUNDS.maxX, lead.x))
    lead.z = Math.max(BOUNDS.minZ, Math.min(BOUNDS.maxZ, lead.z))
    const v = solveLaunch(from, lead, d > 7 ? 16 : 7)
    this.ball.pos.copy(from)
    this.ball.launch(v, 3)
    this.holder = null
    a.hasBall = false
    this.lastTouchTeam = a.team
    // interception roll
    let interceptor: Athlete | null = null
    for (const o of this.teams[1 - a.team]) {
      if (o.stumble > 0) continue
      const vx = lead.x - from.x
      const vz = lead.z - from.z
      const l2 = vx * vx + vz * vz || 1
      const t = Math.max(0.15, Math.min(0.9, ((o.pos.x - from.x) * vx + (o.pos.z - from.z) * vz) / l2))
      const sd = Math.hypot(o.pos.x - (from.x + vx * t), o.pos.z - (from.z + vz * t))
      if (sd > 0.95) continue
      let chance = (o.attrs.steal / 99) * 0.5 * (1 - sd / 0.95) * (1 + badgeLevel(o.profile, 'pickPocket') * 0.5)
      chance *= o.human ? 1 : this.diff.stealRate * 4.2
      if (a.human) chance /= this.diff.humanAssist
      if (Math.random() < Math.min(0.6, chance)) {
        interceptor = o
        break
      }
    }
    this.flight = { kind: 'pass', passer: a, receiver: target, interceptor, touchedRim: false, resolved: true, t: 0 }
    this.lastPass = { passer: a, receiver: target, time: this.elapsed }
    if (a.human) this.setControlled(target)
  }

  doCrossover(a: Athlete, mx: number, mz: number, kind: 'crossover' | 'behind' = 'crossover') {
    if (this.holder !== a || a.busy || a.skillCooldown > 0 || !a.dribbling) return
    const lx = Math.cos(a.facing)
    const lz = -Math.sin(a.facing)
    const lateral = mx * lx + mz * lz
    const dir = Math.abs(lateral) > 0.2 ? Math.sign(lateral) : -a.dribbleHand
    a.startAction(kind, 0.4, dir)
    a.skillCooldown = 0.8
    const push = kind === 'behind' ? 3.4 : 3.1
    // the push-off builds over a couple of strides' worth of frames rather than in one
    a.impulse(lx * dir * push, lz * dir * push, 0.12)
    a.boost = 0.75
    this.lastMove.set(a, { kind, t: this.elapsed })
    if (this.squeakCooldown <= 0) {
      this.engine.audio.squeak()
      this.squeakCooldown = 0.2
    }
    // a defender leaning the wrong way is easiest to drop
    const t = this.defenderInFront(a)
    let lean = 0
    if (t) {
      const tlat = t.vel.x * lx + t.vel.z * lz
      if (Math.sign(tlat) === -dir && Math.abs(tlat) > 1) lean = 0.1
    }
    this.reactToMove(a, kind, kind === 'behind' ? 0.85 : 1, lean)
  }

  // ---------------------------------------------------------------- pro moves
  /**
   * One move button read with the stick, 2K pro-stick style: toward the rim spins, away from it steps back,
   * sideways crosses over (behind the back at speed), and no direction is a hesitation.
   */
  moveFor(a: Athlete, mx: number, mz: number): MoveName {
    const mag = Math.hypot(mx, mz)
    if (mag < 0.3) return 'hesi'
    const l = Math.hypot(a.pos.x, a.pos.z) || 1
    const dot = (-a.pos.x * mx - a.pos.z * mz) / (l * mag)
    if (dot < -0.55) return 'stepback'
    if (dot > 0.62) return 'spin'
    return a.speed > 4.3 ? 'behind' : 'crossover'
  }

  doMove(a: Athlete, mx: number, mz: number) {
    if (this.holder !== a || a.busy || a.skillCooldown > 0 || !a.dribbling || this.phase !== 'live') return
    switch (this.moveFor(a, mx, mz)) {
      case 'stepback':
        return this.doStepBack(a)
      case 'spin':
        return this.doSpin(a, mx, mz)
      case 'hesi':
        return this.doHesi(a)
      case 'behind':
        return this.doCrossover(a, mx, mz, 'behind')
      default:
        return this.doCrossover(a, mx, mz, 'crossover')
    }
  }

  private defenderInFront(a: Athlete, range = 2.3) {
    let target: Athlete | null = null
    let td = 99
    const f = a.forward(this.tmp)
    for (const d of this.teams[1 - a.team]) {
      const dx = d.pos.x - a.pos.x
      const dz = d.pos.z - a.pos.z
      const dist = Math.hypot(dx, dz)
      if (dist < range && (dx * f.x + dz * f.z) / (dist || 1) > 0.15 && dist < td) {
        td = dist
        target = d
      }
    }
    return target
  }

  /** Rolls whether a move beats the defender in front (a stumble, or his ankles on the big ones). */
  private reactToMove(a: Athlete, kind: MoveName, mult: number, bonus = 0) {
    const target = this.defenderInFront(a)
    if (!target || target.stumble > 0 || target.airborne) return null
    let chance = (0.07 + ((a.attrs.handles - target.attrs.perimD) / 99) * 0.42 + 0.18 * badgeLevel(a.profile, 'ankleBreaker') - 0.1 * badgeLevel(target.profile, 'clamps')) * mult + bonus
    if (a.fire === 2) chance += 0.08
    if (target.human) chance *= 0.8
    if (a.human) chance *= this.diff.humanAssist
    chance = Math.max(0.03, Math.min(0.5, chance))
    if (Math.random() >= chance) return null
    const big = kind !== 'hesi' && Math.random() < 0.22 + Math.max(0, (a.attrs.handles - 80) / 100)
    const dur = big ? 1.9 : kind === 'hesi' ? 0.55 : 0.9
    target.startAction(big ? 'fall' : 'stumble', dur)
    target.stumble = dur
    this.engine.arena.addCheer(big ? 0.8 : 0.4)
    this.engine.rig.addTrauma(big ? 0.25 : 0.1)
    if (big) this.engine.hitStop(0.06, 0.25)
    const label = big ? 'ANKLES BROKEN!' : kind === 'spin' ? 'SPUN HIM!' : kind === 'stepback' ? 'CREATED SPACE' : kind === 'hesi' ? 'FROZE HIM!' : 'SHOOK HIM!'
    this.events.onFeedback?.(label, big ? 'big' : 'good', shortName(a.profile))
    if (big) this.highlights.push(`${shortName(a.profile)} broke ${shortName(target.profile)}'s ankles`)
    this.director.ankles(a, target, big)
    return target
  }

  /** Hop back off the inside foot into space; a pull-up straight out of it is quicker and cleaner. */
  private doStepBack(a: Athlete) {
    a.startAction('stepback', 0.5)
    a.skillCooldown = 0.9
    a.lockFacing = true
    const l = Math.hypot(a.pos.x, a.pos.z) || 1
    const ux = a.pos.x / l
    const uz = a.pos.z / l
    // square up to the rim through the plant rather than snapping round
    const f0 = a.facing
    const fTurn = Math.atan2(Math.sin(Math.atan2(-ux, -uz) - f0), Math.cos(Math.atan2(-ux, -uz) - f0))
    const start = a.pos.clone()
    const dist = 1.05 + (a.attrs.handles / 99) * 0.3
    const end = new THREE.Vector3()
    let hopped = false
    a.script = (dt) => {
      const t = a.actionT
      const fk = THREE.MathUtils.clamp(t / 0.12, 0, 1)
      a.facing = f0 + fTurn * fk * fk * (3 - 2 * fk)
      if (t < 0.1) {
        // the plant: the incoming speed bleeds off into the load
        a.vel.multiplyScalar(Math.exp(-22 * dt))
        a.pos.x += a.vel.x * dt
        a.pos.z += a.vel.z * dt
        return true
      }
      if (!hopped) {
        hopped = true
        a.jump(0.09)
        start.copy(a.pos)
        end.set(Math.max(BOUNDS.minX, Math.min(BOUNDS.maxX, start.x + ux * dist)), 0, Math.max(BOUNDS.minZ, Math.min(BOUNDS.maxZ, start.z + uz * dist)))
      }
      const k = THREE.MathUtils.clamp((t - 0.1) / 0.3, 0, 1)
      const e = 1 - (1 - k) * (1 - k)
      const ox = a.pos.x
      const oz = a.pos.z
      a.pos.lerpVectors(start, end, e)
      a.vel.set((a.pos.x - ox) / Math.max(dt, 1e-3), 0, (a.pos.z - oz) / Math.max(dt, 1e-3))
      if (t >= 0.42) {
        a.vel.set(0, 0, 0)
        return false
      }
      return true
    }
    a.rhythm = 1.0
    this.lastMove.set(a, { kind: 'stepback', t: this.elapsed })
    this.engine.audio.squeak()
    this.reactToMove(a, 'stepback', 0.75)
  }

  /** A full pivot around the defender, ball tucked, coming out the far side still driving. */
  private doSpin(a: Athlete, mx: number, mz: number) {
    const def = this.defenderInFront(a, 2.2)
    const ml = Math.hypot(mx, mz) || 1
    const dx = mx / ml
    const dz = mz / ml
    const px = -dz
    const pz = dx
    let dir: 1 | -1 = 1
    if (def) dir = (def.pos.x - a.pos.x) * px + (def.pos.z - a.pos.z) * pz > 0 ? -1 : 1
    a.startAction('spin', 0.52, dir)
    a.skillCooldown = 1.0
    a.lockFacing = true
    const f0 = a.facing
    const turn = Math.atan2(Math.sin(Math.atan2(dx, dz) - f0), Math.cos(Math.atan2(dx, dz) - f0)) + dir * Math.PI * 2
    const start = a.pos.clone()
    const len = 1.5 + (a.attrs.speed / 99) * 0.4
    const end = new THREE.Vector3(Math.max(BOUNDS.minX, Math.min(BOUNDS.maxX, start.x + dx * len)), 0, Math.max(BOUNDS.minZ, Math.min(BOUNDS.maxZ, start.z + dz * len)))
    const span = Math.hypot(end.x - start.x, end.z - start.z) || 1
    const T = 0.46
    // the path enters at the speed he had and leaves at jog speed (cubic Hermite in time), and the swing
    // around the defender starts and ends with no sideways speed, so nothing jumps either side of the move
    const exitSpeed = a.jogSpeed
    const m0 = THREE.MathUtils.clamp(((a.vel.x * dx + a.vel.z * dz) * T) / span, 0, 2.4)
    const m1 = THREE.MathUtils.clamp((exitSpeed * T) / span, 0, 2.4)
    a.script = (dt) => {
      const t = a.actionT
      const k = Math.min(1, t / T)
      const e = (k * k * k - 2 * k * k + k) * m0 + (3 * k * k - 2 * k * k * k) + (k * k * k - k * k) * m1
      const sb = Math.sin(Math.PI * k)
      const bulge = sb * sb * 0.4 * dir
      const ox = a.pos.x
      const oz = a.pos.z
      a.pos.set(start.x + (end.x - start.x) * e + px * bulge, 0, start.z + (end.z - start.z) * e + pz * bulge)
      a.vel.set((a.pos.x - ox) / Math.max(dt, 1e-3), 0, (a.pos.z - oz) / Math.max(dt, 1e-3))
      a.facing = f0 + turn * (k * k * (3 - 2 * k))
      if (t >= T) {
        a.lockFacing = false
        a.boost = 0.6
        // leave along the path at the speed its last tangent carried
        const vx = ((end.x - start.x) / span) * ((m1 * span) / T)
        const vz = ((end.z - start.z) / span) * ((m1 * span) / T)
        a.vel.set(vx, 0, vz)
        return false
      }
      return true
    }
    this.lastMove.set(a, { kind: 'spin', t: this.elapsed })
    this.engine.audio.squeak()
    // spinning blind into a defender who has his feet set is a charge
    if (def && Math.hypot(def.pos.x - a.pos.x, def.pos.z - a.pos.z) < 1.0 && def.speed < 0.9 && !def.airborne && Math.random() < 0.16) {
      this.pendingCharge = { a, d: def, t: 0.24 }
      return
    }
    this.reactToMove(a, 'spin', 0.95)
  }

  /** Stop on a dime with the eyes up, then explode past a defender who bit on the pull-up look. */
  private doHesi(a: Athlete) {
    a.startAction('hesi', 0.42)
    a.skillCooldown = 0.75
    const f = a.forward(new THREE.Vector3())
    let fired = false
    let sx = 0
    let sz = 0
    a.script = (dt) => {
      const t = a.actionT
      if (t < 0.22) {
        a.vel.multiplyScalar(Math.exp(-14 * dt))
      } else if (t < 0.38) {
        // explode: drive up to 110% of jog speed over 0.16 s, the velocity never jumping
        if (!fired) {
          fired = true
          a.boost = 0.9
          sx = a.vel.x
          sz = a.vel.z
        }
        const k = (t - 0.22) / 0.16
        const e = k * k * (3 - 2 * k)
        const goal = a.jogSpeed * 1.1
        a.vel.set(sx + (f.x * goal - sx) * e, 0, sz + (f.z * goal - sz) * e)
      } else return false
      a.pos.x += a.vel.x * dt
      a.pos.z += a.vel.z * dt
      return true
    }
    a.rhythm = 0.75
    this.lastMove.set(a, { kind: 'hesi', t: this.elapsed })
    // a defender who was backpedalling (or closing out) is easiest to freeze
    const d = this.defenderInFront(a)
    let bonus = 0
    if (d) {
      const towardHim = ((a.pos.x - d.pos.x) * d.vel.x + (a.pos.z - d.pos.z) * d.vel.z) / (Math.hypot(a.pos.x - d.pos.x, a.pos.z - d.pos.z) || 1)
      if (Math.abs(towardHim) > 1.5) bonus = 0.12
    }
    this.reactToMove(a, 'hesi', 0.7, bonus)
  }

  /** Ball up as if to shoot: defenders who bite leave their feet; the handler keeps the dribble. */
  pumpFake(a: Athlete) {
    if (this.holder !== a || this.phase !== 'live') return
    if (this.shooting?.a === a) {
      this.shooting = null
      this.hud.meter.active = false
    }
    a.endAction()
    a.startAction('pumpfake', 0.42)
    a.dribbling = true
    a.faceTarget = RIM_TARGET
    a.skillCooldown = Math.max(a.skillCooldown, 0.3)
    this.lastMove.set(a, { kind: 'pumpfake', t: this.elapsed })
    if (a.human) this.events.onFeedback?.('PUMP FAKE', 'info')
    let bit = false
    for (const d of this.teams[1 - a.team]) {
      if (d.human || d.airborne || d.busy || d.stumble > 0) continue
      if (aiBitesOnFake(this, d, a)) {
        this.blockJump(d)
        bit = true
      }
    }
    if (bit && a.human) this.events.onFeedback?.('BIT ON THE FAKE!', 'good')
  }

  private chargeFoul(a: Athlete, d: Athlete) {
    d.startAction('fall', 1.2)
    d.stumble = 1.2
    this.director.foul(a, d, 0)
    this.turnover(d.team, 'OFFENSIVE FOUL')
  }

  // ---------------------------------------------------------------- highlight plays
  /** Can this pass be a lob for a dunk? A cutter attacking the rim with the bounce to finish, lane clear. */
  canLob(passer: Athlete, t: Athlete) {
    if (this.teamSize < 2 || t.team !== passer.team || t === passer || t.busy || t.airborne || t.stumble > 0) return false
    if (t.attrs.dunk < 66 || t.attrs.vertical < 58) return false
    const d = distToRim(t.pos.x, t.pos.z)
    if (d < 1.0 || d > 4.6) return false
    const toward = -(t.vel.x * t.pos.x + t.vel.z * t.pos.z) / (d || 1)
    if (toward < 1.6 && t.ai.intent !== 'cut' && t.ai.intent !== 'roll') return false
    for (const o of this.teams[1 - passer.team]) {
      if (distToRim(o.pos.x, o.pos.z) < d && segDist(o.pos.x, o.pos.z, t.pos.x, t.pos.z, 0, 0) < 0.7) return false
    }
    return Math.hypot(passer.pos.x - t.pos.x, passer.pos.z - t.pos.z) > 2.5
  }

  /** Throws the lob to a spot above the rim; returns false when there is no time for the cutter to rise. */
  private throwLob(a: Athlete, rec: Athlete) {
    const d = distToRim(rec.pos.x, rec.pos.z) || 1
    const ux = rec.pos.x / d
    const uz = Math.max(0.2, rec.pos.z / d)
    const ul = Math.hypot(ux, uz)
    const catchAt = new THREE.Vector3((ux / ul) * 0.42, COURT.rimHeight + 0.42, (uz / ul) * 0.42)
    const from = a.ballPosition(new THREE.Vector3())
    from.y = Math.max(1.3, from.y)
    const v = solveLaunch(from, catchAt, 58)
    const T = Math.hypot(catchAt.x - from.x, catchAt.z - from.z) / Math.max(0.5, Math.hypot(v.x, v.z))
    if (T < 0.6 || T > 1.8) return false
    a.startAction('pass', 0.32)
    a.dribbling = false
    a.faceTarget = rec.pos
    this.ball.pos.copy(from)
    this.ball.launch(v, 4)
    this.holder = null
    a.hasBall = false
    this.lastTouchTeam = a.team
    this.flight = { kind: 'pass', passer: a, receiver: rec, interceptor: null, touchedRim: false, resolved: true, t: 0, lob: true, catchAt: T }
    this.lastPass = { passer: a, receiver: rec, time: this.elapsed }
    this.startAlleyOop(rec, catchAt, T)
    if (a.human) this.setControlled(rec)
    if (a.human || rec.human) this.events.onFeedback?.('ALLEY-OOP', 'info')
    return true
  }

  /** The cutter times his run and jump so his hands meet the lob above the rim, then throws it down. */
  private startAlleyOop(a: Athlete, catchAt: THREE.Vector3, T: number) {
    a.endAction()
    a.startAction('alley', T + 1.2)
    a.dribbling = false
    a.faceTarget = RIM_TARGET
    a.moveTarget = null
    a.holdAir = true
    const l = Math.hypot(catchAt.x, catchAt.z) || 1
    const ux = catchAt.x / l
    const uz = catchAt.z / l
    const start = a.pos.clone()
    const take = new THREE.Vector3(ux * 1.3, 0, uz * 1.3)
    const land = new THREE.Vector3(ux * 0.6, 0, uz * 0.6)
    const rise = 0.36
    const tTake = Math.max(0.12, T - rise)
    const peak = Math.max(0.45, catchAt.y - a.H * 1.25)
    let clock = 0
    let slammed = false
    let flying = false
    a.script = (dt) => {
      clock += dt
      const ox = a.pos.x
      const oz = a.pos.z
      if (clock < tTake) {
        a.pos.lerpVectors(start, take, clock / tTake)
        a.jumpY = 0
      } else {
        if (!flying) {
          // takeoff: the keyed dunk takes over from its rise
          flying = true
          a.action = 'dunk'
          a.actionT = 0.2
          a.actionDur = 1.22
        }
        const u = clock - tTake
        if (u < rise) a.jumpY = peak * (1 - (1 - u / rise) * (1 - u / rise))
        else if (u < rise + 0.3) a.jumpY = peak - (u - rise) * 0.15
        else a.jumpY = Math.max(0, (peak - 0.045) * (1 - Math.min(1, (u - rise - 0.3) / 0.28) ** 2))
        a.pos.lerpVectors(take, land, Math.min(1, u / (rise + 0.2)))
      }
      a.vel.set((a.pos.x - ox) / Math.max(dt, 1e-3), 0, (a.pos.z - oz) / Math.max(dt, 1e-3))
      a.airborne = a.jumpY > 0.001
      if (!slammed && this.holder === a && clock >= T + 0.1) {
        slammed = true
        this.slam(a, ux, uz, { play: { alley: true } })
      }
      // a missed connection: the play is over once he is back on the floor
      if (flying && a.jumpY <= 0 && clock > tTake + rise + 0.3) {
        a.jumpY = 0
        a.airborne = false
        a.holdAir = false
        a.endAction()
        return false
      }
      return true
    }
  }

  /** The ball through the rim with authority: the score, the rim hang, shake and a hit-stop. */
  private slam(a: Athlete, ux: number, uz: number, extra: { foul?: { fouler: Athlete; shots: number } | null; play?: Play } = {}) {
    a.stats.fga++
    a.stats.dunks++
    const from = new THREE.Vector3(0, COURT.rimHeight + 0.17, 0)
    this.ball.pos.copy(from)
    this.ball.launch(new THREE.Vector3(-ux * 0.2, -4.2, -uz * 0.2), 4)
    this.holder = null
    a.hasBall = false
    this.lastTouchTeam = a.team
    const assister = this.lastPass && this.lastPass.receiver === a && this.elapsed - this.lastPass.time < 4 ? this.lastPass.passer : null
    this.flight = { kind: 'shot', shooter: a, points: 2, shotType: 'dunk', grade: null, touchedRim: true, resolved: false, t: 0, notCleared: this.mustClear, assister, foul: extra.foul ?? null, play: extra.play }
    this.engine.hoop.dunk()
    this.engine.audio.rim(3)
    this.engine.rig.addTrauma(0.5)
    this.engine.hitStop(0.08, 0.12)
    const play = extra.play ?? {}
    this.events.onFeedback?.(play.alley ? 'ALLEY-OOP!' : play.putback ? 'PUTBACK SLAM!' : play.victim ? 'POSTERIZED!' : 'SLAM DUNK!', 'big', shortName(a.profile))
    if (!play.alley) this.highlights.push(`${shortName(a.profile)} ${play.putback ? 'putback dunk' : play.victim ? 'poster dunk' : 'dunk'}`)
    if (extra.foul) this.whistleFoul(extra.foul.fouler, a)
  }

  /** An offensive rebound caught in the air at the rim goes straight back down. */
  private startPutback(a: Athlete) {
    a.endAction()
    a.action = 'dunk'
    a.actionT = 0.48
    a.actionDur = 1.22
    a.holdAir = true
    a.dribbling = false
    a.faceTarget = RIM_TARGET
    const y0 = a.jumpY
    const peak = Math.max(y0, COURT.rimHeight + 0.1 - a.H * 1.27)
    const l = Math.hypot(a.pos.x, a.pos.z) || 1
    const ux = a.pos.x / l
    const uz = Math.max(0.25, a.pos.z / l)
    const start = a.pos.clone()
    const ul = Math.hypot(ux, uz)
    const end = new THREE.Vector3((ux / ul) * 0.55, 0, (uz / ul) * 0.55)
    let clock = 0
    let slammed = false
    a.script = (dt) => {
      clock += dt
      const k = Math.min(1, clock / 0.14)
      a.pos.lerpVectors(start, end, k)
      if (clock < 0.14) a.jumpY = y0 + (peak - y0) * k
      else if (clock < 0.4) a.jumpY = peak - (clock - 0.14) * 0.12
      else a.jumpY = Math.max(0, (peak - 0.03) * (1 - Math.min(1, (clock - 0.4) / 0.28) ** 2))
      a.airborne = a.jumpY > 0.001
      void dt
      if (!slammed && clock >= 0.12 && this.holder === a) {
        slammed = true
        this.slam(a, ux, uz, { play: { putback: true } })
      }
      if (clock >= 0.7) {
        a.jumpY = 0
        a.airborne = false
        a.holdAir = false
        return false
      }
      return true
    }
  }

  /** A non-dunker's offensive rebound at the rim gets tipped back up. */
  private tipIn(a: Athlete) {
    a.stats.fga++
    const from = this.ball.pos.clone()
    const make = Math.random() < this.hotHand(a, 0.36 + a.attrs.finish / 320)
    const target = aimPoint(make, from, null)
    this.launchShot(a, from, solveLaunchApex(from, target, Math.max(from.y, COURT.rimHeight) + 0.3), 2, 'layup', null, { play: { putback: true } })
  }

  doSteal(d: Athlete) {
    if (d.busy || d.stealCooldown > 0 || d.airborne || d.stumble > 0) return
    d.startAction('steal', 0.45)
    d.stealCooldown = 0.9
    this.pendingSteal = { a: d, t: 0.14 }
  }

  private resolveSteal(d: Athlete) {
    const h = this.holder
    if (!h || h.team === d.team || h.action === 'dunk' || h.action === 'layup') return
    const dx = h.pos.x - d.pos.x
    const dz = h.pos.z - d.pos.z
    const dist = Math.hypot(dx, dz)
    const f = d.forward(this.tmp)
    const cos = (dx * f.x + dz * f.z) / (dist || 1)
    if (dist > 1.5 || cos < 0.3) {
      // a lunge from out of position or from behind: sometimes the whistle
      if (dist < 2 && Math.random() < 0.09 * (1.3 - d.attrs.steal / 99)) {
        this.reachFoul(d, h)
        return
      }
      if (Math.random() < 0.3) d.stumble = 0.3
      return
    }
    let chance = 0.1 + ((d.attrs.steal - h.attrs.handles) / 99) * 0.36 + 0.12 * badgeLevel(d.profile, 'pickPocket')
    if (h.action === 'crossover') chance -= 0.05
    if (!h.dribbling) chance -= 0.05
    if (h.action === 'shoot') chance += 0.05
    if (d.human) chance *= this.diff.humanAssist
    if (h.human) chance /= this.diff.humanAssist
    chance = Math.max(0.04, Math.min(0.55, chance))
    if (Math.random() < chance) {
      const from = h.ballPosition(new THREE.Vector3())
      this.ball.pos.copy(from)
      const l = dist || 1
      this.ball.launch(new THREE.Vector3((-dx / l) * 2.4, 1.6, (-dz / l) * 2.4), 3)
      if (this.shooting?.a === h) {
        this.shooting = null
        this.hud.meter.active = false
        h.endAction()
      }
      this.holder = null
      h.hasBall = false
      this.lastTouchTeam = d.team
      this.flight = { kind: 'loose', touchedRim: false, resolved: true, t: 0 }
      h.stats.tov++
      d.stats.stl++
      this.engine.arena.addCheer(0.4)
      this.events.onFeedback?.('STOLEN!', d.team === this.humanTeam ? 'good' : 'bad', shortName(d.profile))
      this.director.steal(d)
    } else if (Math.random() < 0.1 * (1.3 - d.attrs.steal / 99)) {
      this.reachFoul(d, h)
    } else if (Math.random() < 0.3) {
      d.stumble = 0.35
    }
  }

  blockJump(a: Athlete) {
    if (a.airborne || a.busy || a.stumble > 0) return
    a.startAction('block', 0.75)
    a.jump(a.maxJump() * 0.95)
  }

  reboundJump(a: Athlete) {
    if (a.airborne || a.busy || a.stumble > 0) return
    a.startAction('rebound', 0.75)
    a.jump(a.maxJump())
  }

  // ---------------------------------------------------------------- ball
  private onBounce(a: Athlete) {
    const d = this.engine.camera.position.distanceTo(a.pos)
    this.engine.audio.bounce(Math.max(0.15, Math.min(1, 9 / (d + 1))))
  }

  private gainPossession(a: Athlete, how: 'rebound' | 'pass' | 'loose' | 'intercept') {
    const offensive = a.team === this.possTeam
    this.holder = a
    a.hasBall = true
    a.dribbling = true
    this.ball.free = false
    const wasShot = this.flight?.kind === 'shot' || (this.flight?.kind === 'loose' && !!this.flight.shooter)
    const touched = this.flight?.touchedRim ?? false
    this.flight = null
    this.engine.effects.stopTrail()
    if (how === 'rebound' && wasShot) a.stats.reb++
    if (a.team !== this.possTeam) {
      this.possTeam = a.team
      this.mustClear = !isBeyondArc(a.pos.x, a.pos.z)
      this.shotClock = this.config.shotClock
      this.lastPass = null
      this.switches.clear()
      if (how === 'intercept') {
        a.stats.stl++
      }
    } else if (touched) {
      this.shotClock = this.config.shotClock
    }
    if (how === 'pass') a.catchTimer = 0
    // the catch starts from where the ball really arrived, not from the hands' resting spot
    a.noteBallWorld(this.ball.pos)
    if (!a.airborne && !a.busy) a.startAction('catch', 0.2)
    this.lastTouchTeam = a.team
    // an offensive board grabbed in the air at the rim: put it back
    if (how === 'rebound' && wasShot && offensive && a.airborne && this.phase === 'live' && distToRim(a.pos.x, a.pos.z) < 1.8) {
      if (a.attrs.dunk >= 62 && a.H * 1.27 + a.jumpY > COURT.rimHeight - 0.35 && Math.random() < 0.7) this.startPutback(a)
      else if (this.ball.pos.y > 2.5) this.tipIn(a)
    }
    for (const x of this.athletes) {
      x.ai.think = Math.min(x.ai.think, 0.1)
      x.ai.plan = null
    }
    if (this.humanTeam !== null) {
      if (a.team === this.humanTeam) this.setControlled(a)
      else if (this.controlled && (this.controlled.team !== this.humanTeam || this.teamSize === 1)) {
        // stay
      } else if (this.teamSize > 1) {
        this.setControlled(assignment(this, a))
      }
    }
  }

  private updateBall(dt: number) {
    const b = this.ball
    if (this.holder) {
      this.holder.ballPosition(b.pos)
      b.free = false
      b.spinRate = this.holder.dribbling ? 9 : 0
      b.spinAxis.set(Math.cos(this.holder.facing), 0, -Math.sin(this.holder.facing))
      b.sync(dt)
      return
    }
    if (!b.free) {
      b.sync(dt)
      return
    }
    const ev = this.ballEv
    ev.rim = 0
    ev.board = 0
    ev.floor = 0
    ev.scored = false
    b.step(dt, this.engine.hoop, ev)
    b.sync(dt)
    if (ev.rim > 0.3) {
      this.engine.audio.rim(ev.rim)
      this.engine.hoop.hitRim(ev.rim)
    }
    if (ev.board > 0.3) this.engine.audio.board(ev.board)
    if (ev.floor > 0) this.engine.audio.bounce(Math.min(1, ev.floor / 5))
    const f = this.flight
    if (!f) return
    f.t += dt
    if (f.kind === 'shot') {
      if (ev.rim > 0 || ev.board > 0) f.touchedRim = true
      if (ev.scored && !f.resolved) {
        this.scoreBasket(f)
        return
      }
      if (!f.resolved && ((f.touchedRim && b.pos.y < COURT.rimHeight - 0.35) || (b.vel.y < 0 && b.pos.y < COURT.rimHeight - 0.6) || f.t > 4)) {
        if (this.resolveMiss(f)) return
      }
      if (this.phase === 'live') this.tryPickup(true)
      return
    }
    if (f.kind === 'pass' && f.lob && f.receiver) {
      const r = f.receiver
      if (f.t >= (f.catchAt ?? 0) - 0.02 && r.action === 'dunk' && r.airborne && r.stumble <= 0) {
        // a help defender at the rim can still deny the lob
        const c = computeContest(r, this.teams[1 - r.team], 'dunk', this.humanTeam === r.team ? this.diff.contest : 1)
        if (c.blocker && Math.random() < c.blockChance * 0.6) {
          f.lob = false
          f.kind = 'loose'
          this.ball.vel.set(-this.ball.vel.x * 0.3 + (Math.random() - 0.5) * 2, 2.2, Math.abs(this.ball.vel.z) * 0.4 + 2)
          c.blocker.stats.blk++
          this.events.onFeedback?.('DENIED!', 'big', shortName(c.blocker.profile))
          this.director.block(c.blocker)
          return
        }
        this.gainPossession(r, 'pass')
        return
      }
      if (f.t > (f.catchAt ?? 0) + 0.3 || ev.floor > 0) {
        f.lob = false
        f.kind = 'loose'
      }
      return
    }
    if (f.kind === 'pass') {
      const cands = [f.interceptor, f.receiver].filter(Boolean) as Athlete[]
      for (const a of cands) {
        const cy = 1.2 + a.jumpY
        const d = Math.hypot(b.pos.x - a.pos.x, b.pos.y - cy, b.pos.z - a.pos.z)
        if (d < 0.95 && a.stumble <= 0) {
          if (a === f.interceptor) {
            this.gainPossession(a, 'intercept')
            f.passer && f.passer.stats.tov++
            this.events.onFeedback?.('INTERCEPTED!', a.team === this.humanTeam ? 'good' : 'bad', shortName(a.profile))
            this.director.steal(a)
          } else this.gainPossession(a, 'pass')
          return
        }
      }
      if (ev.floor > 0 || f.t > 1.8) f.kind = 'loose'
      return
    }
    // loose
    if (this.phase !== 'live') return
    if (b.pos.y < 0.6 && !inBounds(b.pos.x, b.pos.z, 0.05)) {
      this.turnover((1 - this.lastTouchTeam) as 0 | 1, 'OUT OF BOUNDS')
      return
    }
    this.tryPickup(false)
  }

  /**
   * A shot that did not drop. Returns true when play stops (a free throw, or a foul on the attempt sends the
   * shooter to the line); otherwise the ball is live for the rebound.
   */
  private resolveMiss(f: Flight) {
    f.resolved = true
    f.kind = 'loose'
    if (f.ft) {
      this.ftResolved(false)
      return true
    }
    if (f.touchedRim) this.shotClock = this.config.shotClock
    if (f.shooter && f.shooter.human && !f.touchedRim) this.events.onFeedback?.('AIRBALL', 'bad')
    if (f.shooter) {
      this.onMissed(f.shooter)
      this.director.miss(f.shooter, !f.touchedRim, f.touchedRim, f.points === 3)
    }
    if (f.foul && f.shooter && this.phase === 'live') {
      this.pendingFT = { shooter: f.shooter, shots: f.foul.shots }
      this.director.foul(f.foul.fouler, f.shooter, f.foul.shots)
      this.nextPoss = (1 - f.shooter.team) as 0 | 1
      this.setPhase('dead')
      return true
    }
    return false
  }

  private tryPickup(shotPhase: boolean) {
    const b = this.ball
    // a shot in the air is nobody's ball until it hits the rim or glass (catching it on the way up would be
    // goaltending); only the release itself can be blocked
    const sf = this.flight
    if (shotPhase && sf && !sf.resolved && (b.pos.y > COURT.rimHeight - 0.3 || (sf.kind === 'shot' && !sf.touchedRim))) return
    let best: Athlete | null = null
    let bestScore = -99
    for (const a of this.athletes) {
      if (a.stumble > 0 || a.action === 'fall' || a.action === 'dunk' || a.action === 'layup' || a.action === 'shoot') continue
      const hd = Math.hypot(b.pos.x - a.pos.x, b.pos.z - a.pos.z)
      const reachR = 0.55 + badgeLevel(a.profile, 'reboundChaser') * 0.2 + (a.airborne ? 0.15 : 0)
      if (hd > reachR || b.pos.y > a.reach + 0.18) continue
      if (Math.hypot(b.pos.x, b.pos.z) < 0.45 && b.pos.y > COURT.rimHeight - 0.2) continue
      const score = a.attrs.rebound / 99 + (a.airborne ? 0.35 : 0) - hd + Math.random() * 0.4 + badgeLevel(a.profile, 'reboundChaser') * 0.2
      if (score > bestScore) {
        bestScore = score
        best = a
      }
    }
    if (best) {
      // a rebound off a shot that was still in play settles the miss first (a foul on it stops play)
      const f = this.flight
      if (f && f.kind === 'shot' && !f.resolved && this.resolveMiss(f)) return
      const wasDefense = best.team !== this.possTeam
      this.gainPossession(best, 'rebound')
      if (best.team === this.humanTeam && best.human && wasDefense) this.events.onFeedback?.('REBOUND', 'info', 'Clear it past the arc')
    }
  }

  private scoreBasket(f: Flight) {
    f.resolved = true
    const s = f.shooter!
    const team = s.team
    this.engine.audio.swish()
    if (f.ft) {
      this.ftResolved(true)
      return
    }
    if (f.notCleared) {
      this.events.onFeedback?.('NO BASKET', 'bad', 'Ball was not cleared')
      this.engine.audio.whistle()
      this.nextPoss = (1 - team) as 0 | 1
      this.setPhase('dead')
      return
    }
    const before: [number, number] = [this.score[0], this.score[1]]
    const pts = f.points ?? 2
    this.score[team] += pts
    s.stats.pts += pts
    s.stats.fgm++
    if (pts === 3) s.stats.tpm++
    if (f.assister && f.assister.team === team) f.assister.stats.ast++
    this.onMade(s)
    const play = f.play ?? {}
    const andOne = !!f.foul
    if (andOne) {
      this.pendingFT = { shooter: s, shots: 1 }
      this.events.onFeedback?.('AND ONE!', 'big', shortName(s.profile))
    }
    const big = f.shotType === 'dunk' || pts === 3 || f.grade === 'perfect'
    const highlight = f.shotType === 'dunk' || (pts === 3 && (f.grade === 'perfect' || !!play.stepback)) || !!play.alley || !!play.putback
    if (highlight && this.elapsed - this.lastReplayAt > 26) {
      const label = play.alley ? 'ALLEY-OOP' : play.putback ? 'PUTBACK' : f.shotType === 'dunk' ? (play.victim ? 'POSTERIZED' : 'SLAM') : play.stepback ? 'STEP-BACK THREE' : 'GREEN LIGHT THREE'
      this.pendingReplay = { at: this.elapsed, scorer: s, label }
    }
    this.engine.arena.addCheer(team === 0 ? (big ? 1 : 0.6) : big ? 0.5 : 0.25)
    if (f.shotType !== 'dunk') this.engine.rig.addTrauma(0.05)
    const label =
      f.shotType === 'dunk'
        ? ''
        : pts === 3
          ? play.stepback
            ? 'STEP-BACK!'
            : 'FROM DOWNTOWN!'
          : play.putback
            ? 'TIP-IN'
            : play.euro
              ? 'EURO STEP'
              : f.shotType === 'layup'
                ? 'AND IT GOES'
                : f.grade === 'perfect'
                  ? 'CASH'
                  : 'BUCKET'
    if (label && !andOne) this.events.onFeedback?.(`+${pts}`, 'score', label)
    this.events.onScore?.(team, pts, s.profile)
    this.director.score(
      { scorer: s, points: pts, shot: f.shotType ?? 'jumper', green: f.grade === 'perfect', assister: f.assister && f.assister.team === team ? f.assister : null, victim: play.victim ?? null, alley: !!play.alley, putback: !!play.putback, stepback: !!play.stepback, euro: !!play.euro, andOne },
      before,
    )
    if (f.grade === 'perfect' && pts === 3) this.highlights.push(`${shortName(s.profile)} green three`)
    if (play.alley && f.assister) this.highlights.push(`${shortName(f.assister.profile)} to ${shortName(s.profile)} alley-oop`)
    // celebrate after landing
    setTimeout(() => {
      if (this.phase === 'scored' && s.action === null) s.startAction('celebrate', 1.3)
    }, 450)
    this.nextPoss = (1 - team) as 0 | 1
    this.updateScoreboard(true)
    const target = this.config.targetScore
    if ((target > 0 && this.score[team] >= target) || this.overtime) {
      this.pendingFT = null
      this.endGame(team)
      return
    }
    this.setPhase('scored')
  }

  private turnover(toTeam: 0 | 1, reason: string) {
    this.events.onFeedback?.(reason, 'info')
    this.engine.audio.whistle()
    this.director.turnover(reason)
    const h = this.holder
    if (h && h.team !== toTeam) h.stats.tov++
    this.nextPoss = toTeam
    this.setPhase('dead')
  }

  private endGame(winner: 0 | 1) {
    this.winner = winner
    this.gameOverAt = this.elapsed
    this.setPhase('over')
    this.engine.audio.buzzer()
    this.director.gameOver(winner)
    this.engine.arena.addCheer(1)
    const team = this.config.sides[winner].team
    this.engine.effects.burstConfetti(new THREE.Vector3(0, 0, 4), [team.primary, team.secondary, '#ffffff'])
    for (const a of this.athletes) {
      a.moveTarget = null
      a.moveDir.set(0, 0)
      if (!a.airborne) {
        a.endAction()
        a.startAction(a.team === winner ? 'celebrate' : 'dejected', 99)
      }
    }
    this.hud.meter.active = false
  }

  private buildResult(): MatchResult {
    const stats: MatchResult['stats'] = {}
    for (const a of this.athletes) stats[a.profile.id] = { ...emptyStats(), ...a.stats }
    return {
      score: [this.score[0], this.score[1]],
      winner: this.winner ?? (this.score[0] >= this.score[1] ? 0 : 1),
      stats,
      durationSec: Math.round(this.elapsed),
      highlights: this.highlights.slice(0, 6),
    }
  }

  // ---------------------------------------------------------------- physics helpers
  private resolveCollisions() {
    const list = this.athletes
    const minD = PLAYER_RADIUS * 2
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        const a = list[i]
        const b = list[j]
        if (a.action === 'dunk' || b.action === 'dunk') continue
        const dx = b.pos.x - a.pos.x
        const dz = b.pos.z - a.pos.z
        const d = Math.hypot(dx, dz)
        if (d >= minD || d < 1e-5) continue
        const push = minD - d
        const nx = dx / d
        const nz = dz / d
        let wa = 0.5
        if (a.action === 'screen') wa = 0
        else if (b.action === 'screen') wa = 1
        else if (a.defense && !b.defense) wa = 0.3
        else if (b.defense && !a.defense) wa = 0.7
        a.pos.x -= nx * push * wa
        a.pos.z -= nz * push * wa
        b.pos.x += nx * push * (1 - wa)
        b.pos.z += nz * push * (1 - wa)
        const va = a.vel.x * nx + a.vel.z * nz
        if (va > 0) {
          a.vel.x -= nx * va * 0.6
          a.vel.z -= nz * va * 0.6
        }
        const vb = b.vel.x * nx + b.vel.z * nz
        if (vb < 0) {
          b.vel.x -= nx * vb * 0.6
          b.vel.z -= nz * vb * 0.6
        }
      }
    }
    if (this.phase === 'intro') return
    for (const a of list) {
      a.pos.x = Math.max(BOUNDS.minX, Math.min(BOUNDS.maxX, a.pos.x))
      a.pos.z = Math.max(BOUNDS.minZ, Math.min(BOUNDS.maxZ, a.pos.z))
      // keep players out of the stanchion space under the board
      if (a.pos.z < COURT.baselineZ + 0.6 && Math.abs(a.pos.x) < 0.9) a.pos.z = COURT.baselineZ + 0.6
    }
  }

  private updateSqueaks() {
    for (const a of this.athletes) {
      const pv = this.prevVel.get(a)!
      const sp = a.speed
      const ps = pv.length()
      if (sp > 2.6 && ps > 2.6 && this.squeakCooldown <= 0) {
        const cos = (pv.x * a.vel.x + pv.y * a.vel.z) / (sp * ps)
        if (cos < 0.55 && Math.random() < 0.5) {
          this.engine.audio.squeak()
          this.squeakCooldown = 0.25
        }
      }
      pv.set(a.vel.x, a.vel.z)
    }
  }

  // ---------------------------------------------------------------- camera + hud
  private updateCamera(dt: number) {
    const rig = this.engine.rig
    const aspect = this.engine.aspect
    const portrait = aspect < 0.9
    const narrow = aspect < 1.45
    if (this.phase === 'intro' && this.introSeg >= 0) {
      // lineup spotlight: a slow push-in from three-quarters, cut between players
      const a = this.introPlan[this.introSeg]
      const k = Math.min(1, (this.phaseT - INTRO_MATCHUP - this.introSeg * this.introShot) / this.introShot)
      const side = a.team === 0 ? -1 : 1
      const r = THREE.MathUtils.lerp(portrait ? 4.8 : 3.7, portrait ? 4.2 : 3.05, k)
      const ang = side * (0.36 - 0.14 * k)
      this.tmp2.set(a.pos.x + Math.sin(ang) * r, 1.5 + 0.12 * k, a.pos.z + Math.cos(ang) * r)
      this.tmp.set(a.pos.x, a.H * 0.8, a.pos.z)
      rig.posLag = 8
      rig.targetFov = portrait ? 46 : 31
      if (this.snapCamera) rig.fov = rig.targetFov
      rig.set(this.tmp2, this.tmp, this.snapCamera)
      this.snapCamera = false
      this.engine.shadowFocus.set(a.pos.x, 0, a.pos.z)
      return
    }
    if (this.phase === 'freethrow' && this.ft) {
      // behind the shooter, rim and lane in frame
      const s = this.ft.shooter
      // short landscape screens aim a little higher so the rim sits below the free-throw banner
      const short = !portrait && this.engine.height < 560
      this.tmp2.set(s.pos.x + 0.9, portrait ? 3.6 : 2.55, s.pos.z + (portrait ? 7.4 : 5.5))
      this.tmp.set(0, short ? 2.95 : 2.5, 0.7)
      rig.posLag = 4
      rig.targetFov = portrait ? 50 : 36
      if (this.snapCamera) rig.fov = rig.targetFov
      rig.set(this.tmp2, this.tmp, this.snapCamera)
      this.snapCamera = false
      this.engine.shadowFocus.set(0, 0, 2.5)
      return
    }
    if (this.phase === 'intro') {
      const k = Math.min(1, this.phaseT / 2.9)
      const e = k * k * (3 - 2 * k)
      const a0 = -0.9 + e * 0.9
      const r = THREE.MathUtils.lerp(20, portrait ? 19 : 12.5, e)
      const pos = new THREE.Vector3(Math.sin(a0) * r, THREE.MathUtils.lerp(11, portrait ? 10.5 : 6.8, e), 5 + Math.cos(a0) * r)
      rig.set(pos, new THREE.Vector3(0, THREE.MathUtils.lerp(3, 1.6, e), THREE.MathUtils.lerp(6, 4, e)), true)
      rig.targetFov = portrait ? 52 : 42
      this.engine.shadowFocus.set(0, 0, 4)
      return
    }
    if (this.phase === 'over') {
      const wTeam = this.teams[this.winner ?? 0]
      const star = wTeam.reduce((x, y) => (y.stats.pts > x.stats.pts ? y : x), wTeam[0])
      const ang = this.elapsed * 0.35
      const p = new THREE.Vector3(star.pos.x + Math.sin(ang) * 5.5, 2.4, star.pos.z + Math.cos(ang) * 5.5)
      rig.posLag = 2
      rig.set(p, new THREE.Vector3(star.pos.x, 1.5, star.pos.z))
      rig.targetFov = portrait ? 55 : 40
      this.engine.shadowFocus.set(star.pos.x, 0, star.pos.z)
      return
    }
    rig.posLag = 3.2
    const focus = this.holder ? this.holder.pos : this.ball.pos
    const fx = focus.x
    const fz = Math.max(-0.5, Math.min(11.5, focus.z))
    // phones in landscape: a small screen needs a lower, tighter camera so the players stay readable
    const compact = !portrait && !narrow && this.engine.height < 560
    // presets: broadcast, a tighter and lower 2K-style cam, or a high tactical view
    const preset = this.engine.cameraPreset
    const pd = preset === 'close' ? 0.74 : preset === 'high' ? 1.08 : 1
    const ph = preset === 'close' ? 0.64 : preset === 'high' ? 1.55 : 1
    const look = this.tmp.set(fx * (portrait ? 0.6 : compact ? 0.64 : 0.5), (compact ? 1.35 : 1.5) - (preset === 'close' ? 0.15 : 0), THREE.MathUtils.lerp(fz, 0, portrait ? 0.5 : compact ? 0.34 : 0.42) + (portrait ? 1.2 : 0))
    const dist = (portrait ? 13.5 : narrow ? 14.5 : compact ? 9.8 : 12) * pd
    const height = (portrait ? 16 : narrow ? 8 : compact ? 5.3 : 6.9) * ph
    const pos = this.tmp2.set(fx * (portrait ? 0.55 : compact ? 0.5 : 0.4), height, Math.min(27, look.z + dist))
    rig.set(pos, look, this.snapCamera)
    this.snapCamera = false
    // a drive at the rim pulls the lens in a touch
    const h = this.holder
    let drive = 0
    if (h && this.phase === 'live') {
      const d = distToRim(h.pos.x, h.pos.z)
      const toward = -(h.vel.x * h.pos.x + h.vel.z * h.pos.z) / (d || 1)
      drive = THREE.MathUtils.clamp((4.5 - d) / 3, 0, 1) * THREE.MathUtils.clamp((toward - 2) / 3, 0, 1)
    }
    this.driveZoom += (drive - this.driveZoom) * (1 - Math.exp(-3 * dt))
    rig.targetFov = (portrait ? 62 : narrow ? 46 : compact ? 40 : 42) + (preset === 'high' ? 3 : preset === 'close' ? -1 : 0) - this.driveZoom * 4
    this.engine.shadowFocus.set(fx * 0.5, 0, (fz + 0) * 0.5 + 1)
  }

  private updateHud() {
    const h = this.hud
    h.phase = this.phase
    h.gameClock = this.gameClock
    h.shotClock = this.shotClock
    h.possession = this.possTeam
    h.mustClear = this.mustClear && !!this.holder
    h.looseBall = !this.holder
    h.offense = this.humanTeam !== null && this.possTeam === this.humanTeam
    h.hasBall = !!this.controlled && this.holder === this.controlled
    const c = this.controlled
    if (c) {
      this.tmp.set(c.pos.x, c.H + 0.42 + c.jumpY, c.pos.z)
      this.engine.project(this.tmp, this.proj)
      h.marker.x = this.proj.x
      h.marker.y = this.proj.y
      h.marker.visible = this.proj.visible && this.phase !== 'over' && this.phase !== 'intro'
      if (h.meter.active || this.meterFlash > 0) {
        this.tmp.set(c.pos.x, c.H * 0.75 + c.jumpY, c.pos.z)
        this.engine.project(this.tmp, this.proj)
        h.meter.x = this.proj.x + 46
        h.meter.y = this.proj.y
      }
      if (this.meterFlash <= 0 && !this.shooting) h.meter.active = false
      h.meter.flash = this.meterFlash
    } else {
      h.marker.visible = false
    }
    const pt = this.passPreview
    if (pt && this.phase === 'live') {
      this.tmp.set(pt.pos.x, pt.H + 0.35, pt.pos.z)
      this.engine.project(this.tmp, this.proj)
      h.passTarget.x = this.proj.x
      h.passTarget.y = this.proj.y
      h.passTarget.visible = this.proj.visible
      h.passTarget.lob = !!c && this.canLob(c, pt)
    } else h.passTarget.visible = false
    h.controlledFire = c ? c.fire : 0
    // backboard shot clock
    const sc = this.config.shotClock > 0 ? String(Math.ceil(this.shotClock)) : ''
    this.engine.hoop.shotClock.draw(this.phase === 'live' || this.phase === 'check' ? sc : '')
  }

  private updateScoreboard(force: boolean) {
    this.scoreboardTick -= 1
    if (!force && this.scoreboardTick > 0) return
    this.scoreboardTick = 30
    const [h, a] = this.config.sides
    const clock = this.config.timeLimit > 0 ? (this.overtime ? 'OT' : formatClock(this.gameClock)) : `TO ${this.config.targetScore}`
    this.engine.arena.updateScoreboard(h.team, a.team, this.score[0], this.score[1], clock, this.config.label)
  }

  dispose() {
    this.engine.effects.clearFires()
    this.engine.commentary.stop()
    this.engine.audio.hush(false)
    for (const a of this.athletes) a.dispose()
    this.ball.mesh.removeFromParent()
    ;(this.ball.mesh.material as THREE.Material).dispose()
    this.engine.effects.stopTrail()
    this.engine.hoop.shotClock.draw('')
    this.engine.audio.setCrowdBase(0.03)
  }
}

export function formatClock(sec: number) {
  const s = Math.max(0, Math.ceil(sec))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

export { RIM_FLOOR }
