import * as THREE from 'three'
import { Character } from '../world/Character'
import { Animator, type ActionKind, type AnimStyle } from '../world/animation'
import { emptyStats, type Attributes, type JerseyStyle, type PlayerGameStats, type PlayerProfile, type TeamInfo } from '../types'
import { badgeLevel } from '../../data/attributes'
import { hashString, mulberry32 } from '../../data/rng'

/** Body mass by archetype on top of the height-based build. */
const ARCHETYPE_BULK: Record<string, number> = { glass: 0.05, slasher: 0.02, lockdown: 0.01, sharpshooter: -0.02, playmaker: -0.03 }

export const PLAYER_GRAVITY = 13

/** A player's movement personality: bigs stride heavier and wider, guards lighter; every player differs a little. */
function gaitStyle(p: PlayerProfile): AnimStyle {
  const r = mulberry32(hashString(p.id + ':gait'))
  const j = (k: number) => (r() - 0.5) * 2 * k
  const tall = Math.max(-1, Math.min(1, (p.heightCm - 198) / 14))
  return {
    cadence: 1 - 0.035 * tall + j(0.035),
    arms: 1 - 0.08 * tall + j(0.14),
    elbow: j(0.14),
    lean: 0.01 * tall + j(0.03),
    bounce: 1 - 0.15 * tall + j(0.18),
    width: 1 + 0.06 * tall + j(0.05),
    swagger: 1 + j(0.25),
    // better handlers keep it lower
    dribble: 1 - ((p.attributes.handles - 70) / 99) * 0.12 + j(0.04),
  }
}

export interface AIState {
  think: number
  intent: string
  target: THREE.Vector3
  spot: number
  cutTimer: number
  plan: { releaseAt: number; gradeRoll: number } | null
  reactDelay: number
  lastMoveTime: number
}

export class Athlete {
  readonly profile: PlayerProfile
  readonly team: 0 | 1
  readonly slot: number
  char: Character
  anim: Animator
  pos = new THREE.Vector3()
  vel = new THREE.Vector3()
  facing = 0
  jumpY = 0
  jumpV = 0
  airborne = false
  hasBall = false
  dribbling = false
  dribbleHand: 1 | -1 = -1
  dribblePhase = 0
  action: ActionKind | null = null
  actionT = 0
  actionDur = 0
  actionDir = 0
  releaseT = -1
  variant = 0
  human = false
  defense = false
  moveDir = new THREE.Vector2()
  moveTarget: THREE.Vector3 | null = null
  arrive = 0.35
  sprint = false
  faceTarget: THREE.Vector3 | null = null
  /** What the eyes follow (usually the ball); the head turns toward it within the neck's range. */
  lookTarget: THREE.Vector3 | null = null
  stumble = 0
  skillCooldown = 0
  stealCooldown = 0
  boost = 0
  catchTimer = 99
  lockMove = 0
  /** When true, jump physics is paused (dunk hang); the script owns jumpY. */
  holdAir = false
  /** When true the facing controller is off and a script owns `facing` (spin moves). */
  lockFacing = false
  /** Seconds left in the rhythm window after a step-back or hesitation: quicker, cleaner pull-ups. */
  rhythm = 0
  /** Consecutive made field goals / misses, and the hot-streak level they earn (1 heating up, 2 on fire). */
  streak = 0
  colds = 0
  fire: 0 | 1 | 2 = 0
  /** Scripted root motion for layups/dunks: returns true while active. */
  script: ((dt: number) => boolean) | null = null
  stats: PlayerGameStats = emptyStats()
  ai: AIState = { think: 0, intent: 'idle', target: new THREE.Vector3(), spot: 0, cutTimer: 0, plan: null, reactDelay: 0, lastMoveTime: 0 }
  readonly H: number
  readonly attrs: Attributes
  onBounce?: (a: Athlete) => void
  private time = Math.random() * 10
  private tmpA = new THREE.Vector3()
  private tmpB = new THREE.Vector3()

  private sweat = 0
  private sweatShown = 0
  /** angular velocity of the facing (rad/s) so turns ease in and out */
  private yawVel = 0
  private lookYaw = 0
  /** a push spread over a few frames (a crossover's push-off) instead of an instant jump in velocity */
  private pushX = 0
  private pushZ = 0
  private pushLeft = 0
  private pushDur = 1
  private wasDribbling = false
  private dribbleRate = 2
  /** Jog-speed multiplier for this frame (AI eases into a walk near its spot). Reset after each update. */
  pace = 1

  constructor(profile: PlayerProfile, team: 0 | 1, slot: number, jersey: JerseyStyle, teamInfo?: Pick<TeamInfo, 'name' | 'abbr' | 'primary' | 'secondary'> | null) {
    this.profile = profile
    this.team = team
    this.slot = slot
    this.attrs = profile.attributes
    this.char = new Character({
      heightCm: profile.heightCm,
      appearance: profile.appearance,
      jersey,
      number: profile.number,
      name: profile.lastName,
      seed: hashString(profile.id + profile.firstName),
      bulk: 1 + (profile.heightCm - 200) / 260 + (ARCHETYPE_BULK[profile.archetype ?? ''] ?? 0),
      team: teamInfo ? { name: teamInfo.name, abbr: teamInfo.abbr, primary: teamInfo.primary, secondary: teamInfo.secondary } : null,
    })
    this.H = this.char.height
    this.anim = new Animator(this.char)
    this.anim.style = gaitStyle(profile)
    this.variant = Math.floor(Math.random() * 3)
  }

  get reach() {
    return this.H * 1.3 + this.jumpY
  }

  get speed() {
    return Math.hypot(this.vel.x, this.vel.z)
  }

  get jogSpeed() {
    return 3.5 + (this.attrs.speed / 99) * 1.2
  }

  get sprintSpeed() {
    return (5.3 + (this.attrs.speed / 99) * 1.9 - (this.hasBall ? 0.45 - (this.attrs.handles / 99) * 0.35 : 0)) * (this.fire === 2 ? 1.04 : 1)
  }

  get slideSpeed() {
    return 3.4 + (this.attrs.perimD / 99) * 1.5
  }

  /** First-step acceleration (m/s²); it tapers as speed builds. */
  get accel() {
    return 13 + (this.attrs.speed / 99) * 7 + (this.hasBall ? badgeLevel(this.profile, 'quickFirst') * 4 : 0)
  }

  /** Planted-foot braking deceleration (m/s²). */
  get brakeDecel() {
    return 10 + (this.attrs.speed / 99) * 5
  }

  /** Lateral grip (m/s²): how hard a player can carve a turn at speed. */
  get gripAccel() {
    return 10 + (this.attrs.speed / 99) * 5 + (this.hasBall ? (this.attrs.handles / 99) * 2 : 0)
  }

  get busy() {
    return this.action !== null && this.action !== 'catch' && this.action !== 'hold'
  }

  forward(out: THREE.Vector3) {
    return out.set(Math.sin(this.facing), 0, Math.cos(this.facing))
  }

  startAction(kind: ActionKind, dur: number, dir = 0) {
    // a crossover starts with the ball at the top of the bounce in the old hand
    if ((kind === 'crossover' || kind === 'behind') && this.action !== kind) this.dribblePhase = 0
    this.action = kind
    this.actionT = 0
    this.actionDur = dur
    this.actionDir = dir
    this.releaseT = -1
  }

  endAction() {
    this.pushLeft = 0
    this.action = null
    this.actionT = 0
    this.script = null
    this.holdAir = false
    this.lockFacing = false
    this.releaseT = -1
  }

  /** Adds `(vx, vz)` to the velocity over `dur` seconds: a push-off rather than a teleport in speed. */
  impulse(vx: number, vz: number, dur = 0.12) {
    this.pushX = vx
    this.pushZ = vz
    this.pushDur = Math.max(1 / 240, dur)
    this.pushLeft = this.pushDur
  }

  jump(height: number) {
    if (this.airborne) return
    this.jumpV = Math.sqrt(2 * PLAYER_GRAVITY * Math.max(0.05, height))
    this.airborne = true
  }

  maxJump() {
    return 0.5 + (this.attrs.vertical / 99) * 0.45
  }

  update(dt: number) {
    this.time += dt
    this.catchTimer += dt
    this.skillCooldown = Math.max(0, this.skillCooldown - dt)
    this.stealCooldown = Math.max(0, this.stealCooldown - dt)
    this.boost = Math.max(0, this.boost - dt)
    this.lockMove = Math.max(0, this.lockMove - dt)
    this.rhythm = Math.max(0, this.rhythm - dt)

    // --- desired velocity
    let tx = 0
    let tz = 0
    let mag = 0
    let targetDist = -1
    if (this.moveTarget) {
      tx = this.moveTarget.x - this.pos.x
      tz = this.moveTarget.z - this.pos.z
      const d = Math.hypot(tx, tz)
      if (d > 0.05) {
        tx /= d
        tz /= d
        mag = d > this.arrive ? 1 : d / this.arrive
        targetDist = d
      }
    } else {
      const l = this.moveDir.length()
      if (l > 0.02) {
        tx = this.moveDir.x / l
        tz = this.moveDir.y / l
        mag = Math.min(1, l)
      }
    }
    let maxSpeed = this.sprint ? this.sprintSpeed : this.defense ? this.slideSpeed : this.jogSpeed * Math.max(0.3, Math.min(1, this.pace))
    if (this.boost > 0) maxSpeed *= 1.18
    let control = 1
    if (this.stumble > 0) {
      this.stumble -= dt
      maxSpeed *= 0.12
      if (this.stumble <= 0 && (this.action === 'stumble' || this.action === 'fall')) this.endAction()
    }
    if (this.lockMove > 0) control = 0
    switch (this.action) {
      case 'shoot':
      case 'layup':
      case 'dunk':
      case 'fall':
      case 'stepback':
      case 'spin':
      case 'alley':
        control = 0
        break
      case 'pumpfake':
        maxSpeed *= 0.15
        break
      case 'screen':
      case 'intro':
        maxSpeed = 0
        break
      case 'pass':
      case 'catch':
        maxSpeed *= 0.5
        break
      case 'steal':
        maxSpeed *= 0.6
        break
      case 'crossover':
      case 'behind':
        control = 0.35
        break
      case 'block':
      case 'rebound':
        if (this.airborne) control = 0.1
        break
      case 'celebrate':
      case 'dejected':
        maxSpeed *= 0.3
        break
    }
    if (this.airborne && control > 0.2) control = 0.2
    const scripted = this.script ? this.script(dt) : false
    if (!scripted) {
      if (control === 0) {
        // no footing control (shots, landings, falls): friction only
        const f = Math.exp(-(this.airborne ? 0.4 : 7) * dt)
        this.vel.x *= f
        this.vel.z *= f
      } else {
        let want = maxSpeed * mag
        // arrive on a spot without overshooting: never carry more speed than can be braked away in time
        if (targetDist >= 0) want = Math.min(want, Math.sqrt(2 * this.brakeDecel * 0.75 * Math.max(0, targetDist - 0.04)))
        this.steer(tx, tz, want, control, dt)
      }
      if (this.pushLeft > 0) {
        const k = Math.min(dt, this.pushLeft) / this.pushDur
        this.vel.x += this.pushX * k
        this.vel.z += this.pushZ * k
        this.pushLeft -= dt
      }
      this.pos.x += this.vel.x * dt
      this.pos.z += this.vel.z * dt
    }

    // --- facing
    let desiredYaw: number | null = null
    if (this.faceTarget) {
      desiredYaw = Math.atan2(this.faceTarget.x - this.pos.x, this.faceTarget.z - this.pos.z)
    } else if (this.speed > 0.6) {
      desiredYaw = Math.atan2(this.vel.x, this.vel.z)
    }
    if (desiredYaw !== null && this.action !== 'fall' && !this.lockFacing) {
      // turn with eased angular velocity instead of a constant-rate snap; momentum slows sprinting turns
      const d = Math.atan2(Math.sin(desiredYaw - this.facing), Math.cos(desiredYaw - this.facing))
      const maxRate = this.airborne ? 2.5 : this.action === 'shoot' ? 14 : this.speed > 5.5 ? 7.5 : 10.5
      const want = Math.max(-maxRate, Math.min(maxRate, d * 11))
      this.yawVel += (want - this.yawVel) * (1 - Math.exp(-24 * dt))
      let step = this.yawVel * dt
      if (Math.abs(step) > Math.abs(d)) {
        step = d
        this.yawVel *= 0.5
      }
      this.facing += step
    } else {
      this.yawVel *= Math.exp(-12 * dt)
    }

    // --- jump physics (scripted dunks manage jumpY themselves)
    if (this.airborne && !this.holdAir) {
      this.jumpV -= PLAYER_GRAVITY * dt
      this.jumpY += this.jumpV * dt
      if (this.jumpY <= 0) {
        this.jumpY = 0
        this.jumpV = 0
        this.airborne = false
      }
    }

    // --- actions
    if (this.action) {
      this.actionT += dt
      if ((this.action === 'crossover' || this.action === 'behind') && this.actionT > this.actionDur * 0.45 && this.actionDir !== 0) {
        const target = (this.actionDir > 0 ? 1 : -1) as 1 | -1
        if (this.dribbleHand !== target) this.dribbleHand = target
      }
      if (this.actionT >= this.actionDur && this.action !== 'stumble' && this.action !== 'fall') {
        if (!(this.airborne && (this.action === 'block' || this.action === 'rebound' || this.action === 'shoot' || this.action === 'layup'))) this.endAction()
      }
    }

    // --- dribble
    const dribbleNow = this.hasBall && this.dribbling && (this.action === null || this.action === 'crossover' || this.action === 'behind' || this.action === 'hesi')
    if (dribbleNow) {
      // picking up the dribble: the ball starts in the hand at the top of the bounce
      if (!this.wasDribbling) this.dribblePhase = 0.94
      const prev = this.dribblePhase
      let freq: number
      if (this.action === 'crossover' || this.action === 'behind') freq = 3.2
      else if (this.action === 'hesi') freq = 1.5
      else {
        // free rhythm when walking; at speed one bounce per stride, landing with the opposite foot
        const lock = Math.max(0, Math.min(1, (this.speed - 3.0) / 1.6))
        const free = 1.85 + Math.min(0.45, this.speed * 0.12)
        const gait = this.anim.cycleRate
        freq = gait > 0 ? free + (gait - free) * lock : free
        if (gait > 0 && lock > 0) {
          let err = ((this.anim.phase + (this.dribbleHand < 0 ? 0.5 : 0)) % 1) - this.dribblePhase
          err -= Math.round(err)
          freq += err * 3 * lock
        }
      }
      this.dribblePhase = (this.dribblePhase + dt * Math.max(0.6, freq)) % 1
      this.dribbleRate = Math.max(0.6, freq)
      if (prev < 0.5 && this.dribblePhase >= 0.5) this.onBounce?.(this)
    }
    this.wasDribbling = dribbleNow

    // --- animation
    const f = this.forward(this.tmpA)
    const lvz = this.vel.x * f.x + this.vel.z * f.z
    const lvx = this.vel.x * f.z - this.vel.z * f.x
    let look = 0
    if (this.lookTarget && this.action !== 'shoot' && this.action !== 'layup' && this.action !== 'dunk') {
      const lx = this.lookTarget.x - this.pos.x
      const lz = this.lookTarget.z - this.pos.z
      if (lx * lx + lz * lz > 0.36) look = Math.max(-1.3, Math.min(1.3, Math.atan2(Math.sin(Math.atan2(lx, lz) - this.facing), Math.cos(Math.atan2(lx, lz) - this.facing))))
    }
    this.lookYaw += (look - this.lookYaw) * (1 - Math.exp(-6 * dt))
    this.anim.update({
      dt,
      time: this.time,
      speed: this.speed,
      localVelX: lvx,
      localVelZ: lvz,
      sprint: this.sprint,
      defense: this.defense && !this.hasBall,
      hasBall: this.hasBall,
      dribbling: this.dribbling,
      dribbleHand: this.dribbleHand,
      dribblePhase: this.dribblePhase,
      action: this.action,
      actionT: this.actionT,
      actionDur: this.actionDur,
      actionDir: this.actionDir,
      releaseT: this.releaseT,
      airborne: this.airborne,
      variant: this.variant,
      lookYaw: this.lookYaw,
      rootX: this.pos.x,
      rootZ: this.pos.z,
      facing: this.facing,
      dribbleRate: this.dribbleRate,
    })
    this.pace = 1
    this.char.group.position.set(this.pos.x, this.jumpY, this.pos.z)
    this.char.group.rotation.y = this.facing
    // players glisten as they work
    this.sweat = Math.min(1, this.sweat + dt * (0.0006 + Math.min(7, this.speed) * 0.00045 + (this.airborne ? 0.002 : 0)))
    if (this.sweat - this.sweatShown > 0.03) {
      this.sweatShown = this.sweat
      this.char.setSweat(this.sweat)
    }
  }

  /**
   * Momentum locomotion. Speed builds along a sprint curve (explosive first steps tapering toward top
   * speed) and sheds at a planted-foot braking rate; the heading turns no faster than shoe grip allows, so
   * a sprinter carves a wide arc while a jogger can plant and cut. Sharp changes of direction brake first.
   */
  private steer(tx: number, tz: number, want: number, control: number, dt: number) {
    const v = this.vel
    const s = Math.hypot(v.x, v.z)
    const drive = this.accel * control
    const brake = this.brakeDecel * Math.max(0.5, control)
    if (want < 0.05 || (tx === 0 && tz === 0)) {
      if (s > 1e-6) {
        const k = Math.max(0, s - brake * dt) / s
        v.x *= k
        v.z *= k
      }
      return
    }
    if (s < 0.6) {
      // from (nearly) standing the first step can go any direction
      const dvx = tx * want - v.x
      const dvz = tz * want - v.z
      const dl = Math.hypot(dvx, dvz)
      if (dl > 1e-6) {
        const k = Math.min(1, (drive * dt) / dl)
        v.x += dvx * k
        v.z += dvz * k
      }
      return
    }
    const hx = v.x / s
    const hz = v.z / s
    const dot = hx * tx + hz * tz
    const err = Math.atan2(hx * tz - hz * tx, dot)
    // the further off the heading, the more speed has to come off first (plant and cut)
    const target = want * Math.max(0, Math.min(1, (dot + 0.3) / 1.3))
    const ns = target > s ? s + Math.min(target - s, drive * Math.max(0.22, 1 - s / (this.sprintSpeed * 1.2)) * dt) : Math.max(target, s - brake * dt)
    const maxTurn = Math.min(10, (this.gripAccel * control) / Math.max(ns, 0.6)) * dt
    const turn = Math.max(-maxTurn, Math.min(maxTurn, err))
    const c = Math.cos(turn)
    const sn = Math.sin(turn)
    v.x = (hx * c - hz * sn) * ns
    v.z = (hx * sn + hz * c) * ns
  }

  /** Reports where the ball really is (world), so the next held or dribbled ball path starts from it. */
  noteBallWorld(p: THREE.Vector3) {
    const dx = p.x - this.pos.x
    const dz = p.z - this.pos.z
    const s = Math.sin(this.facing)
    const c = Math.cos(this.facing)
    this.anim.noteExternalBall(dx * c - dz * s, p.y - this.jumpY, dx * s + dz * c)
  }

  /** Where the ball sits while this athlete holds it. */
  ballPosition(out: THREE.Vector3) {
    // dribbling / holding: the animator owns the ball path so it stays under the hands
    if (this.anim.ballValid && this.action !== 'shoot' && this.action !== 'layup' && this.action !== 'dunk') {
      const b = this.anim.ballLocal
      const s = Math.sin(this.facing)
      const c = Math.cos(this.facing)
      return out.set(this.pos.x + b.x * c + b.z * s, b.y + this.jumpY, this.pos.z - b.x * s + b.z * c)
    }
    this.char.group.updateMatrixWorld(true)
    const r = this.char.handWorld(true, this.tmpA)
    const l = this.char.handWorld(false, this.tmpB)
    const wr = this.action === 'shoot' || this.action === 'layup' ? 0.72 : 0.5
    out.copy(r).multiplyScalar(wr).addScaledVector(l, 1 - wr)
    const f = this.forward(this.tmpB)
    out.addScaledVector(f, 0.07)
    if (this.action === 'shoot' || this.action === 'dunk') out.y += 0.06
    // tell the animator where the hands had it, so its next dribble or hold starts from here
    this.noteBallWorld(out)
    return out
  }

  dispose() {
    this.char.dispose()
  }
}
