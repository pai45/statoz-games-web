import * as THREE from 'three'
import type { Engine, EngineMode } from '../engine/Engine'
import { BallBody, ballGeometry, ballMaterial, type BallEvents } from '../world/Ball'
import type { BallLike } from '../world/Hoop'
import { Athlete } from './Athlete'
import { RACK_SPOTS, distToRim } from './court'
import {
  DIFFICULTY,
  GRADE_TEXT,
  METER_FILL_TIME,
  METER_MAX,
  aimPoint,
  baseChance,
  finalChance,
  gradeRelease,
  greenWindow,
  solveLaunch,
  type Grade,
} from './shooting'
import type { ContestConfig, JerseyStyle } from '../types'
import { jerseyFor } from '../../data/teams'
import type { FeedbackKind } from './Match'

export type ContestPhase = 'intro' | 'countdown' | 'live' | 'moving' | 'done'

export interface ContestHud {
  phase: ContestPhase
  time: number
  score: number
  rack: number
  ball: number
  racks: { results: (boolean | null)[]; money: boolean[] }[]
  countdown: number
  meter: { active: boolean; fill: number; gw: number; x: number; y: number; grade: Grade | null; flash: number }
  round: number
}

export interface ContestEvents {
  onFeedback?: (text: string, kind: FeedbackKind, sub?: string) => void
  onRoundEnd?: (score: number, stats: { makes: number; attempts: number; greens: number }) => void
}

interface FlyingBall {
  body: BallBody
  value: number
  rack: number
  index: number
  resolved: boolean
  t: number
  ev: BallEvents
}

const FILL_SCALE = 0.86

export class Contest implements EngineMode {
  engine: Engine
  config: ContestConfig
  events: ContestEvents
  shooter: Athlete
  hud: ContestHud
  private rackGroups: THREE.Group[] = []
  private rackBalls: THREE.Mesh[][] = []
  private flying: FlyingBall[] = []
  private phaseT = 0
  private shooting: { t: number; gw: number; jumped: boolean } | null = null
  private recover = 0
  private makes = 0
  private attempts = 0
  private greens = 0
  private doneSent = false
  private meterFlash = 0
  private proj = { x: 0, y: 0, visible: false }
  private tmp = new THREE.Vector3()
  private heldMesh: THREE.Mesh

  constructor(engine: Engine, config: ContestConfig, round: number, events: ContestEvents, jersey?: JerseyStyle) {
    this.engine = engine
    this.config = config
    this.events = events
    const profile = config.shooters[config.humanIndex]
    this.shooter = new Athlete(profile, 0, 0, jersey ?? jerseyFor(config.courtTeam, false), jersey ? null : config.courtTeam)
    engine.scene.add(this.shooter.char.group)
    engine.arena.setCourtTeam(config.courtTeam)
    engine.hoop.setPadColor(config.courtTeam.primary)
    engine.hoop.net.reset()
    engine.arena.updateScoreboard(null, null, 0, 0, '', config.label)
    const racks: ContestHud['racks'] = []
    RACK_SPOTS.forEach((spot, ri) => {
      const money = Array.from({ length: 5 }, (_, i) => ri === config.moneyRack || i === 4)
      racks.push({ results: [null, null, null, null, null], money })
      const g = new THREE.Group()
      const l = Math.hypot(spot.x, spot.z)
      const ux = spot.x / l
      const uz = spot.z / l
      // rack sits beside the shooter, slightly behind the arc
      const side = new THREE.Vector3(-uz, 0, ux)
      const base = new THREE.Vector3(spot.x + ux * 0.55 + side.x * 0.75, 0, spot.z + uz * 0.55 + side.z * 0.75)
      g.position.copy(base)
      g.rotation.y = Math.atan2(side.x, side.z)
      const frameMat = new THREE.MeshStandardMaterial({ color: 0x1b1d22, metalness: 0.6, roughness: 0.4 })
      const stand = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.06, 1.35), frameMat)
      stand.position.set(0, 0.78, 0)
      g.add(stand)
      for (const z of [-0.6, 0.6]) {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.78, 0.05), frameMat)
        leg.position.set(0, 0.39, z)
        g.add(leg)
      }
      const balls: THREE.Mesh[] = []
      for (let i = 0; i < 5; i++) {
        const m = new THREE.Mesh(ballGeometry(), ballMaterial(money[i] ? 'money' : 'classic'))
        m.position.set(0, 0.93, -0.5 + i * 0.25)
        m.castShadow = true
        g.add(m)
        balls.push(m)
      }
      engine.scene.add(g)
      this.rackGroups.push(g)
      this.rackBalls.push(balls)
    })
    this.heldMesh = new THREE.Mesh(ballGeometry(), ballMaterial('classic'))
    this.heldMesh.castShadow = true
    this.heldMesh.visible = false
    engine.scene.add(this.heldMesh)
    this.hud = {
      phase: 'intro',
      time: config.duration,
      score: 0,
      rack: 0,
      ball: 0,
      racks,
      countdown: 3,
      meter: { active: false, fill: 0, gw: 0.06, x: 0, y: 0, grade: null, flash: 0 },
      round,
    }
    this.placeShooter(0, true)
    engine.audio.stopMusic()
    engine.audio.startCrowd(0.05)
    engine.audio.setCrowdBase(0.05)
  }

  balls(): BallLike[] {
    return this.flying.map((f) => f.body)
  }

  private spot(i: number) {
    return RACK_SPOTS[Math.min(i, RACK_SPOTS.length - 1)]
  }

  private placeShooter(i: number, snap: boolean) {
    const s = this.spot(i)
    if (snap) {
      this.shooter.pos.set(s.x, 0, s.z)
      this.shooter.vel.set(0, 0, 0)
    }
    this.shooter.facing = Math.atan2(-s.x, -s.z)
  }

  update(dt: number) {
    this.phaseT += dt
    this.meterFlash = Math.max(0, this.meterFlash - dt)
    const h = this.hud
    const inp = this.engine.input
    const a = this.shooter
    switch (h.phase) {
      case 'intro':
        if (this.phaseT > 2.2 || (this.phaseT > 0.5 && inp.pressed.shoot)) this.setPhase('countdown')
        break
      case 'countdown': {
        const left = 3 - this.phaseT
        const c = Math.ceil(left)
        if (c !== h.countdown && c > 0) {
          h.countdown = c
          this.engine.audio.click()
        }
        if (left <= 0) {
          h.countdown = 0
          this.engine.audio.buzzer()
          this.setPhase('live')
        }
        break
      }
      case 'live':
      case 'moving':
        h.time = Math.max(0, h.time - dt)
        if (h.phase === 'moving') {
          const s = this.spot(h.rack)
          a.moveTarget = new THREE.Vector3(s.x, 0, s.z)
          a.sprint = true
          a.arrive = 0.3
          if (Math.hypot(a.pos.x - s.x, a.pos.z - s.z) < 0.25) {
            a.moveTarget = null
            a.vel.set(0, 0, 0)
            this.placeShooter(h.rack, false)
            h.phase = 'live'
          }
        } else {
          a.faceTarget = new THREE.Vector3(0, 0, 0)
          this.recover -= dt
          if (this.shooting) {
            this.shooting.t += dt
            const fill = this.shooting.t / (METER_FILL_TIME * FILL_SCALE)
            h.meter.fill = Math.min(fill, METER_MAX)
            if (!this.shooting.jumped && this.shooting.t > 0.14) {
              this.shooting.jumped = true
              a.jump(0.28)
            }
            if (inp.released.shoot || fill >= METER_MAX) this.release()
          } else if (h.time > 0 && this.recover <= 0 && h.rack < 5 && (inp.pressed.shoot || (inp.held.shoot && this.recover < -0.05))) {
            this.startShot()
          }
        }
        if (h.time <= 0 && !this.shooting) {
          const pending = this.flying.some((f) => !f.resolved)
          if (!pending || this.phaseT > 3) this.finish()
        }
        break
      case 'done':
        break
    }
    a.update(dt)
    // held ball follows hands while shooting
    if (this.shooting) {
      a.ballPosition(this.heldMesh.position)
      this.heldMesh.visible = true
    } else this.heldMesh.visible = false
    this.updateBalls(dt)
    this.updateCamera()
    this.updateHud()
  }

  private setPhase(p: ContestPhase) {
    this.hud.phase = p
    this.phaseT = 0
  }

  private startShot() {
    const h = this.hud
    const a = this.shooter
    const diff = DIFFICULTY[this.config.difficulty]
    const gw = greenWindow(a, 'three', { ...diff, greenMul: diff.greenMul * diff.humanAssist * this.engine.input.timingAssist })
    this.shooting = { t: 0, gw, jumped: false }
    a.startAction('shoot', 4)
    a.hasBall = true
    a.dribbling = false
    h.meter.active = true
    h.meter.grade = null
    h.meter.gw = gw
    const rackBall = this.rackBalls[h.rack][h.ball]
    rackBall.visible = false
    const money = h.racks[h.rack].money[h.ball]
    ;(this.heldMesh.material as THREE.Material).dispose()
    this.heldMesh.material = ballMaterial(money ? 'money' : 'classic')
  }

  private release() {
    const s = this.shooting!
    this.shooting = null
    const h = this.hud
    const a = this.shooter
    const fill = Math.min(METER_MAX, s.t / (METER_FILL_TIME * FILL_SCALE))
    const grade = gradeRelease(fill, s.gw)
    a.releaseT = a.actionT
    a.actionDur = a.actionT + 0.45
    a.hasBall = false
    h.meter.grade = grade
    h.meter.fill = fill
    this.meterFlash = 0.7
    const from = a.ballPosition(new THREE.Vector3())
    const dist = distToRim(a.pos.x, a.pos.z)
    const base = baseChance(a, 'three', dist)
    const p = finalChance(a, 'three', base, 0, grade)
    const make = Math.random() < p
    const target = aimPoint(make, from, grade)
    const v = solveLaunch(from, target, 49 + Math.random() * 3)
    const money = h.racks[h.rack].money[h.ball]
    const body = this.acquireBall(money)
    body.pos.copy(from)
    body.launch(v, 10)
    this.flying.push({ body, value: money ? 2 : 1, rack: h.rack, index: h.ball, resolved: false, t: 0, ev: { rim: 0, board: 0, floor: 0, scored: false } })
    this.attempts++
    if (grade === 'perfect') {
      this.greens++
      this.engine.audio.green()
      this.engine.effects.startTrail(() => body.pos, money ? '#ffd23f' : '#3dff8a', 1.3)
    }
    const kind: FeedbackKind = grade === 'perfect' ? 'green' : grade === 'good' ? 'good' : 'bad'
    this.events.onFeedback?.(GRADE_TEXT[grade], kind)
    h.ball++
    this.recover = 0.32
    if (h.ball >= 5) {
      h.ball = 0
      h.rack++
      if (h.rack < 5) {
        this.setPhase('moving')
        this.phaseT = 0
      } else {
        h.time = Math.min(h.time, h.time)
      }
    }
  }

  private pool: BallBody[] = []
  private acquireBall(money: boolean) {
    const b = this.pool.pop() ?? new BallBody()
    b.setVariant(money ? 'money' : 'classic')
    this.engine.scene.add(b.mesh)
    return b
  }

  private updateBalls(dt: number) {
    for (const f of this.flying) {
      f.t += dt
      const ev = f.ev
      ev.rim = 0
      ev.board = 0
      ev.floor = 0
      ev.scored = false
      f.body.step(dt, this.engine.hoop, ev)
      f.body.sync(dt)
      if (ev.rim > 0.3) {
        this.engine.audio.rim(ev.rim)
        this.engine.hoop.hitRim(ev.rim)
      }
      if (ev.board > 0.3) this.engine.audio.board(ev.board)
      if (ev.floor > 0) this.engine.audio.bounce(Math.min(0.8, ev.floor / 6))
      if (!f.resolved && ev.scored) {
        f.resolved = true
        this.hud.score += f.value
        this.makes++
        this.hud.racks[f.rack].results[f.index] = true
        this.engine.audio.swish()
        this.engine.audio.cheer(f.value > 1 ? 0.8 : 0.45)
        this.engine.arena.addCheer(f.value > 1 ? 0.7 : 0.35)
        this.events.onFeedback?.(`+${f.value}`, 'score', f.value > 1 ? 'MONEY BALL' : undefined)
      } else if (!f.resolved && (f.body.pos.y < 2.2 && f.body.vel.y < 0 || f.t > 3.5)) {
        f.resolved = true
        this.hud.racks[f.rack].results[f.index] = false
      }
    }
    // recycle settled balls
    for (let i = this.flying.length - 1; i >= 0; i--) {
      const f = this.flying[i]
      if (f.resolved && f.t > 2.6) {
        f.body.mesh.removeFromParent()
        f.body.free = false
        this.pool.push(f.body)
        this.flying.splice(i, 1)
      }
    }
  }

  private finish() {
    if (this.doneSent) return
    this.doneSent = true
    this.setPhase('done')
    this.engine.audio.buzzer()
    this.shooter.endAction()
    this.shooter.startAction(this.hud.score >= 18 ? 'celebrate' : 'hold', 99)
    window.setTimeout(() => this.events.onRoundEnd?.(this.hud.score, { makes: this.makes, attempts: this.attempts, greens: this.greens }), 1600)
  }

  private updateCamera() {
    const a = this.shooter
    const portrait = this.engine.aspect < 0.9
    const l = Math.hypot(a.pos.x, a.pos.z) || 1
    const ux = a.pos.x / l
    const uz = a.pos.z / l
    const back = portrait ? 8.5 : 5.6
    const pos = this.tmp.set(a.pos.x + ux * back - uz * 1.1, portrait ? 4.6 : 3.1, a.pos.z + uz * back + ux * 1.1)
    const rig = this.engine.rig
    if (this.hud.phase === 'intro') {
      const k = Math.min(1, this.phaseT / 2)
      pos.y += (1 - k) * 5
      pos.x += (1 - k) * 4
    }
    rig.set(pos.clone(), new THREE.Vector3(ux * 1.2, 2.3, uz * 1.2))
    rig.targetFov = portrait ? 58 : 44
    this.engine.shadowFocus.set(a.pos.x * 0.6, 0, a.pos.z * 0.6)
  }

  private updateHud() {
    const h = this.hud
    const a = this.shooter
    if (h.meter.active || this.meterFlash > 0) {
      this.tmp.set(a.pos.x, a.H * 0.8 + a.jumpY, a.pos.z)
      this.engine.project(this.tmp, this.proj)
      h.meter.x = this.proj.x + 54
      h.meter.y = this.proj.y
    }
    if (this.meterFlash <= 0 && !this.shooting) h.meter.active = false
    h.meter.flash = this.meterFlash
  }

  dispose() {
    this.shooter.dispose()
    for (const g of this.rackGroups) g.removeFromParent()
    for (const f of this.flying) f.body.mesh.removeFromParent()
    this.heldMesh.removeFromParent()
    this.engine.effects.stopTrail()
  }
}

/** Simulated 3PT contest score for an AI shooter. */
export function simulateContest(threeRating: number, moneyRackBonus = true, rng = Math.random) {
  let score = 0
  const p = Math.max(0.22, Math.min(0.78, 0.34 + (threeRating - 60) * 0.0115))
  const moneyRack = Math.floor(rng() * 5)
  for (let r = 0; r < 5; r++) {
    for (let i = 0; i < 5; i++) {
      if (rng() < p * (r === 4 && i > 2 ? 0.9 : 1)) score += (moneyRackBonus && r === moneyRack) || i === 4 ? 2 : 1
    }
  }
  return score
}
