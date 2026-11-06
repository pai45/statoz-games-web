import * as THREE from 'three'
import { COURT } from '../sim/court'
import { B, BONE_COUNT, type Character } from './Character'
import { clavicleAngles } from './character/rig'
import { solveTwoBone, type TwoBone } from './ik'

export type ActionKind =
  | 'shoot'
  | 'layup'
  | 'dunk'
  | 'pass'
  | 'catch'
  | 'steal'
  | 'block'
  | 'rebound'
  | 'crossover'
  | 'behind'
  | 'hesi'
  | 'stepback'
  | 'spin'
  | 'pumpfake'
  | 'screen'
  | 'intro'
  | 'alley'
  | 'stumble'
  | 'fall'
  | 'celebrate'
  | 'dejected'
  | 'hold'

export class Pose {
  r = new Float32Array(BONE_COUNT * 3)
  hipX = 0
  hipY = 0
  hipZ = 0
  reset() {
    this.r.fill(0)
    this.hipX = 0
    this.hipY = 0
    this.hipZ = 0
  }
  set(b: number, x: number, y = 0, z = 0) {
    const i = b * 3
    this.r[i] = x
    this.r[i + 1] = y
    this.r[i + 2] = z
  }
  add(b: number, x: number, y = 0, z = 0) {
    const i = b * 3
    this.r[i] += x
    this.r[i + 1] += y
    this.r[i + 2] += z
  }
  get(b: number, axis: 0 | 1 | 2) {
    return this.r[b * 3 + axis]
  }
  blendTo(t: Pose, k: number) {
    for (let i = 0; i < this.r.length; i++) this.r[i] += (t.r[i] - this.r[i]) * k
    this.hipX += (t.hipX - this.hipX) * k
    this.hipY += (t.hipY - this.hipY) * k
    this.hipZ += (t.hipZ - this.hipZ) * k
  }
  copy(p: Pose) {
    this.r.set(p.r)
    this.hipX = p.hipX
    this.hipY = p.hipY
    this.hipZ = p.hipZ
  }
}

export interface AnimInput {
  dt: number
  time: number
  speed: number
  localVelX: number
  localVelZ: number
  sprint: boolean
  defense: boolean
  hasBall: boolean
  dribbling: boolean
  dribbleHand: 1 | -1
  dribblePhase: number
  action: ActionKind | null
  actionT: number
  actionDur: number
  actionDir: number
  releaseT: number
  airborne: boolean
  variant: number
  lookYaw: number
  /** World root position + facing, used to lock planted feet to the floor. */
  rootX?: number
  rootZ?: number
  facing?: number
  /** Dribble frequency (bounces per second) so the ball's flight can be solved physically. */
  dribbleRate?: number
}

/** Per-athlete movement personality (1 / 0 = neutral). */
export interface AnimStyle {
  /** cadence multiplier (stride length compensates) */
  cadence: number
  /** arm-swing amplitude multiplier */
  arms: number
  /** extra elbow bend when running (rad) */
  elbow: number
  /** extra forward trunk lean (rad) */
  lean: number
  /** vertical bob multiplier */
  bounce: number
  /** stance width multiplier */
  width: number
  /** pelvis sway / rotation multiplier */
  swagger: number
  /** dribble height multiplier */
  dribble: number
}

export const NEUTRAL_STYLE: AnimStyle = { cadence: 1, arms: 1, elbow: 0, lean: 0, bounce: 1, width: 1, swagger: 1, dribble: 1 }

interface DribbleFlight {
  /** release and catch heights the flight was solved for */
  hr: number
  hc: number
  /** push speed out of the hand (m/s, downward) */
  v0: number
  /** rebound speed off the floor */
  vUp: number
  /** speed the ball is still rising at when the palm takes it */
  vc: number
  tDown: number
  tUp: number
  /** phases of release and catch (the bounce is at 0.5) */
  dRel: number
  dCat: number
}

const clamp = (x: number, a: number, b: number) => (x < a ? a : x > b ? b : x)
const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x)
const ease = (x: number) => {
  const t = clamp01(x)
  return t * t * (3 - 2 * t)
}
const sm = (a: number, b: number, x: number) => ease((x - a) / (b - a))
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const wrap = (a: number) => Math.atan2(Math.sin(a), Math.cos(a))
const damp = (cur: number, target: number, rate: number, dt: number) => cur + (target - cur) * (1 - Math.exp(-rate * dt))
/** Critically damped spring toward `target` (state `s.x`, velocity `s.v`): eases in as well as out. */
const spring = (s: { x: number; v: number }, target: number, w: number, dt: number) => {
  const x = s.x - target
  const j = s.v + w * x
  const e = Math.exp(-w * dt)
  s.x = target + (x + j * dt) * e
  s.v = (s.v - w * j * dt) * e
  return s.x
}
/** cubic Hermite: positions p0/p1, tangents m0/m1 already scaled by the segment duration */
const hermite = (p0: number, m0: number, p1: number, m1: number, s: number) => {
  const s2 = s * s
  const s3 = s2 * s
  return (2 * s3 - 3 * s2 + 1) * p0 + (s3 - 2 * s2 + s) * m0 + (3 * s2 - 2 * s3) * p1 + (s3 - s2) * m1
}
const GRAVITY = 9.81
/** basketball on hardwood */
const RESTITUTION = 0.78
const TAU = Math.PI * 2
const Y_AXIS = new THREE.Vector3(0, 1, 0)
const IDENT = new THREE.Quaternion()

/** side: 1 = left, -1 = right */
function arm(p: Pose, side: 1 | -1, flex: number, abd: number, elbow: number, wrist = 0, twist = 0) {
  p.set(side > 0 ? B.upperArmL : B.upperArmR, flex, twist * side, abd * side)
  p.set(side > 0 ? B.forearmL : B.forearmR, elbow, 0, 0)
  p.set(side > 0 ? B.handL : B.handR, wrist, 0, 0)
}

function leg(p: Pose, side: 1 | -1, flex: number, abd: number, knee: number, foot?: number) {
  p.set(side > 0 ? B.thighL : B.thighR, flex, 0, abd * side)
  p.set(side > 0 ? B.shinL : B.shinR, knee, 0, 0)
  p.set(side > 0 ? B.footL : B.footR, foot ?? -(flex + knee) * 0.85, 0, 0)
}

/** Rig proportions as fractions of standing height (match character/rig.ts). */
const R = {
  hip: 0.56,
  thighX: 0.048,
  thighY: -0.03,
  thigh: 0.245,
  shin: 0.246,
  ankle: 0.039,
  toeBall: 0.072,
  spine: 0.06,
  chest: 0.12,
  clavX: 0.022,
  clavY: 0.075,
  shoulderX: 0.09,
  upperArm: 0.175,
  forearm: 0.145,
  palm: 0.036,
}

/** Actions that drive the whole body (legs included) from keyed poses. */
const FULL_BODY = new Set<ActionKind>(['shoot', 'layup', 'dunk', 'steal', 'block', 'rebound', 'stumble', 'fall', 'stepback', 'screen'])
/**
 * Actions layered over the upper body while the legs keep stepping (the spin pivots on locked feet with
 * quick steps instead of skating through a keyed leg pose).
 */
const LAYERED = new Set<ActionKind>(['pass', 'celebrate', 'dejected', 'pumpfake', 'hesi', 'intro', 'spin'])
/** Moves that carry the ball tucked in both hands rather than dribbled. */
const TUCK = new Set<ActionKind>(['spin', 'stepback'])
/** Dribble moves that carry the ball from one hand to the other. */
const HAND_SWITCH = new Set<ActionKind>(['crossover', 'behind'])
const UPPER_BONES = [B.spine, B.chest, B.neck, B.head, B.upperArmL, B.forearmL, B.handL, B.upperArmR, B.forearmR, B.handR]
const UPPER_SET = new Set<number>(UPPER_BONES)

interface Foot {
  side: 1 | -1
  planted: boolean
  /** world ankle ground position + yaw */
  x: number
  z: number
  yaw: number
  fx: number
  fz: number
  fyaw: number
  t: number
  dur: number
  amp: number
  /** gait step (lands ahead of the hip) vs. corrective/idle step */
  gait: boolean
  lift: number
  pitch: number
  liftPitch: number
  since: number
  /** small per-step placement variation */
  jx: number
  jz: number
  jyaw: number
  /** yaw change applied by this swing, kept continuous so a turn never flips the long way round */
  yawD: number
}

function crossed(p0: number, p1: number, x: number) {
  return p0 <= p1 ? p0 < x && p1 >= x : p0 < x || p1 >= x
}

type BallMode = 'none' | 'dribble' | 'hold' | 'tuck'

/**
 * Procedural athlete animation.
 *
 * Locomotion is fully procedural: a speed-driven gait cycle (cadence, duty factor and stride scale with
 * speed and height) schedules steps, planted feet are locked to the floor in world space, and two-bone IK
 * solves the legs with the knees tracking the toes. The pelvis bobs, sways, rotates and leans into
 * acceleration; the torso counter-rotates and leans with speed while the head stays level. Defenders slide
 * with short quick steps and open their hips to run once a slide can't keep up, the chest and head staying
 * on their man. Ball handling places the hands with arm IK so the dribble hand rides the ball. Keyed action
 * poses (shots, dunks, blocks...) are blended over the top.
 */
export class Animator {
  cur = new Pose()
  /** gait cycle phase [0,1): left foot lands at 0, right at 0.5 */
  phase = 0
  /** gait cycles per second (0 when standing) */
  cycleRate = 0
  /** ball centre in character-local metres (valid while dribbling/holding) */
  ballLocal = new THREE.Vector3()
  ballValid = false
  style: AnimStyle = { ...NEUTRAL_STYLE }
  private char: Character
  private H: number
  private loco = new Pose()
  private act = new Pose()
  private feet: Foot[]
  private fresh = true
  private rootX = 0
  private rootZ = 0
  private facing = 0
  private simX = 0
  private simZ = 0
  private prevVX = 0
  private prevVZ = 0
  private yawRate = 0
  private accFwd = 0
  private accLat = 0
  private wMove = 0
  private wDef = 0
  private wDrib = 0
  private wHold = 0
  private wSlide = 0
  /** lower-body yaw relative to the root while running "open" (hips turned toward the travel direction) */
  private gYaw = 0
  private openSide: 1 | -1 = 1
  private wasMoving = false
  private stepCool = 0
  private fidgetT = 2 + Math.random() * 3
  private idleT = Math.random() * 20
  private actKind: ActionKind | null = null
  private actW = 0
  private actWs = { x: 0, v: 0 }
  /** pose inertialization state: per-angle offset and its velocity, and last frame's joint velocity */
  private inOff = new Float32Array(BONE_COUNT * 3)
  private inOffV = new Float32Array(BONE_COUNT * 3)
  private curV = new Float32Array(BONE_COUNT * 3)
  private inActive = false
  private xoWs = { x: 0, v: 0 }
  private tuckWs = { x: 0, v: 0 }
  private handWs = [
    { x: 0, v: 0 },
    { x: 0, v: 0 },
  ]
  private actT = 0
  private actDur = 1
  private actDir = 0
  private actRel = -1
  private actAir = false
  private actVariant = 0
  private xoFrom: 1 | -1 = -1
  private xoTo: 1 | -1 = 1
  /** the current hand switch goes behind the back rather than in front */
  private xoBehind = false
  private prevAction: ActionKind | null = null
  private ballMode: BallMode = 'none'
  private xoW = 0
  /** crossover progress: 0 pushing across, 1 after the bounce (heading to the new hand), 2 caught */
  private xoStage = 2
  private dribT = 0.5
  private prevDrib = -1
  private flight: DribbleFlight = { hr: 0, hc: 0, v0: 0, vUp: 0, vc: 0, tDown: 0, tUp: 0, dRel: 0.2, dCat: 0.8 }
  /** the flight in the air keeps the period and heights it was released with */
  private airT = 0.5
  private air: DribbleFlight = { hr: 0, hc: 0, v0: 0, vUp: 0, vc: 0, tDown: 0, tUp: 0, dRel: 0.2, dCat: 0.8 }
  private inAir = false
  /** height and rising speed of the last catch, where the palm's ride starts */
  private catchY = -1
  private catchV = 0
  private catchD = 0.8
  /**
   * Ball inertialization: when the ball's target path jumps (a move restarts the bounce, the mode changes)
   * the offset from where the ball really was decays as a critically damped spring, so position and
   * velocity stay continuous.
   */
  private ballOff = new THREE.Vector3()
  private ballOffV = new THREE.Vector3()
  private ballPrev = new THREE.Vector3()
  private ballPrevV = new THREE.Vector3()
  private targetPrev = new THREE.Vector3()
  private ballOwned = false
  private extBall = new THREE.Vector3()
  private extBallValid = false
  /** frames since the sim last reported the ball (a stale report is ignored) */
  private extAge = 99
  private wTuck = 0
  /** dribbling hand whose partner holds the guard bar */
  private guardHand: 1 | -1 = -1
  /** wrist tip toward the floor, eased so a restarted bounce never flicks the wrist */
  private tipS = { x: 0.5, v: 0 }
  /** pelvis height last frame (world metres), for sizing the next landing */
  private lastHipsY = 1
  /** per-hand IK weight while dribbling (left, right) so hand-offs blend */
  private handW = [0, 0]
  private lastPalm = [new THREE.Vector3(), new THREE.Vector3()]
  private lastHandQ = [new THREE.Quaternion(), new THREE.Quaternion()]
  private clav = [
    { y: 0, z: 0 },
    { y: 0, z: 0 },
  ]
  // scratch
  private ik: TwoBone = { flex: 0, abd: 0, mid: 0, clamped: false }
  private nTmp = { x: 0, z: 0 }
  private qA = new THREE.Quaternion()
  private qB = new THREE.Quaternion()
  private qC = new THREE.Quaternion()
  private qD = new THREE.Quaternion()
  private qE = new THREE.Quaternion()
  private qF = new THREE.Quaternion()
  private qG = new THREE.Quaternion()
  private eA = new THREE.Euler()
  private eB = new THREE.Euler()
  private ballTarget = new THREE.Vector3()
  private vA = new THREE.Vector3()
  private vB = new THREE.Vector3()
  private vC = new THREE.Vector3()
  private vD = new THREE.Vector3()
  private mA = new THREE.Matrix4()
  private palm = new THREE.Vector3()

  constructor(char: Character) {
    this.char = char
    this.H = char.height
    this.lastHipsY = R.hip * this.H
    const mk = (side: 1 | -1): Foot => ({ side, planted: true, x: 0, z: 0, yaw: 0, fx: 0, fz: 0, fyaw: 0, t: 1, dur: 0.3, amp: 0, gait: false, lift: 0, pitch: 0, liftPitch: 0, since: 1, jx: 0, jz: 0, jyaw: 0, yawD: NaN })
    this.feet = [mk(1), mk(-1)]
    this.base(this.cur)
  }

  /** Neutral standing pose (used as the base for keyed full-body actions). */
  private base(p: Pose) {
    p.reset()
    arm(p, 1, -0.1, 0.11, -0.34, -0.1)
    arm(p, -1, -0.1, 0.11, -0.34, -0.1)
    leg(p, 1, -0.06, 0.04, 0.12)
    leg(p, -1, -0.06, 0.04, 0.12)
  }

  private legExtent(p: Pose, side: 1 | -1) {
    const tx = p.get(side > 0 ? B.thighL : B.thighR, 0)
    const tz = p.get(side > 0 ? B.thighL : B.thighR, 2)
    const kx = p.get(side > 0 ? B.shinL : B.shinR, 0)
    return (R.thigh * this.H * Math.cos(tx) + R.shin * this.H * Math.cos(tx + kx)) * Math.cos(tz)
  }

  /** Lowers the hips so the extended leg of a keyed pose keeps its foot on the floor. */
  private plant(p: Pose) {
    const full = (R.thigh + R.shin) * this.H
    const ext = Math.max(this.legExtent(p, 1), this.legExtent(p, -1))
    p.hipY += ext - full
  }

  private resetFeet(rx: number, rz: number, facing: number) {
    const fc = Math.cos(facing), fs = Math.sin(facing)
    for (const f of this.feet) {
      const x = f.side * 0.067 * this.H
      const z = (f.side > 0 ? 0.016 : -0.012) * this.H
      f.x = rx + x * fc + z * fs
      f.z = rz - x * fs + z * fc
      f.yaw = facing + f.side * 0.1
      f.planted = true
      f.lift = 0
      f.pitch = 0
      f.t = 1
    }
  }

  private startSwing(f: Foot, dur: number, amp: number, gait: boolean) {
    f.planted = false
    f.fx = f.x
    f.fz = f.z
    f.fyaw = f.yaw
    f.t = 0
    f.dur = Math.max(0.08, dur)
    f.amp = amp
    f.gait = gait
    f.liftPitch = f.pitch
    // no two strides land exactly alike
    const j = gait ? this.H : 0
    f.jx = (Math.random() - 0.5) * 0.014 * j
    f.jz = (Math.random() - 0.5) * 0.024 * j
    f.jyaw = gait ? (Math.random() - 0.5) * 0.07 : 0
    f.yawD = NaN
  }

  /**
   * Where the sim put the ball while the animator did not own it (hands during a shot or catch), in
   * character space: the next owned ball path starts from it instead of teleporting.
   */
  noteExternalBall(x: number, y: number, z: number) {
    this.extBall.set(x, y, z)
    this.extBallValid = true
    this.extAge = 0
  }

  update(inp: AnimInput) {
    const dt = Math.min(0.05, Math.max(1e-4, inp.dt))
    this.extAge++
    // ---- world transform of the root
    const facing = inp.facing ?? this.facing
    let rx: number
    let rz: number
    const fc = Math.cos(facing), fs = Math.sin(facing)
    if (inp.rootX !== undefined && inp.rootZ !== undefined) {
      rx = inp.rootX
      rz = inp.rootZ
    } else {
      this.simX += (inp.localVelX * fc + inp.localVelZ * fs) * dt
      this.simZ += (-inp.localVelX * fs + inp.localVelZ * fc) * dt
      rx = this.simX
      rz = this.simZ
    }
    const vwx = inp.localVelX * fc + inp.localVelZ * fs
    const vwz = -inp.localVelX * fs + inp.localVelZ * fc
    if (this.fresh || Math.hypot(rx - this.rootX, rz - this.rootZ) > 1.2 + inp.speed * dt * 2) {
      // first frame or teleport (re-spot for a check ball): stand the feet under the body
      this.rootX = rx
      this.rootZ = rz
      this.facing = facing
      this.prevVX = vwx
      this.prevVZ = vwz
      this.resetFeet(rx, rz, facing)
      this.fresh = false
    }
    this.yawRate = damp(this.yawRate, wrap(facing - this.facing) / dt, 10, dt)
    const ax = (vwx - this.prevVX) / dt
    const az = (vwz - this.prevVZ) / dt
    this.prevVX = vwx
    this.prevVZ = vwz
    this.accLat = damp(this.accLat, clamp(ax * fc - az * fs, -25, 25), 10, dt)
    this.accFwd = damp(this.accFwd, clamp(ax * fs + az * fc, -25, 25), 10, dt)
    this.rootX = rx
    this.rootZ = rz
    this.facing = facing

    // ---- keyed action layer weight
    const a = inp.action && (FULL_BODY.has(inp.action) || LAYERED.has(inp.action)) ? inp.action : null
    // one keyed action handing straight over to another (a step-back into the shot) would swap poses at
    // full weight: inertialize the switch
    const switched = a !== null && this.actKind !== null && a !== this.actKind && this.actW > 0.05
    if (a) {
      this.actKind = a
      this.actT = inp.actionT
      this.actDur = inp.actionDur
      this.actDir = inp.actionDir
      this.actRel = inp.releaseT
      this.actAir = inp.airborne
      this.actVariant = inp.variant
      this.actW = spring(this.actWs, 1, 30, dt)
    } else {
      this.actW = Math.max(0, spring(this.actWs, 0, 13, dt))
      if (this.actW < 0.01) {
        this.actW = 0
        this.actWs.x = 0
        this.actWs.v = 0
        this.actKind = null
      }
    }
    if (inp.action && HAND_SWITCH.has(inp.action) && this.prevAction !== inp.action) {
      this.xoFrom = inp.dribbleHand
      this.xoTo = inp.actionDir > 0 ? 1 : -1
      this.xoBehind = inp.action === 'behind'
      this.xoStage = 0
    }
    this.prevAction = inp.action
    const fullBody = this.actKind !== null && FULL_BODY.has(this.actKind)
    const detached = inp.airborne || (fullBody && this.actW > 0.2)

    this.locomotion(this.loco, inp, dt, rx, rz, facing, vwx, vwz, detached)

    if (this.actKind && this.actW > 0) {
      if (fullBody) {
        this.base(this.act)
        if (this.actionPose(this.act, this.actKind)) this.plant(this.act)
        this.loco.blendTo(this.act, this.actW)
      } else {
        this.act.copy(this.loco)
        this.actionPose(this.act, this.actKind)
        const w = this.actW
        for (const b of UPPER_BONES) for (let k = 0; k < 3; k++) this.loco.r[b * 3 + k] += (this.act.r[b * 3 + k] - this.loco.r[b * 3 + k]) * w
      }
    }
    // switches between keyed actions ease through (before the hands are put back on the ball)
    this.inertialize(switched, fullBody, dt)
    // an action layer over a live dribble (a hesitation's chest lift, a spin easing out) moves the shoulders
    // after the hands were solved: put the dribbling hand back on the ball
    if (this.ballMode === 'dribble' && this.actW > 0.001) {
      for (const side of [1, -1] as const) {
        const i = side > 0 ? 0 : 1
        if (this.handW[i] > 0.001) this.armIK(this.loco, side, this.lastPalm[i], this.lastHandQ[i], this.handW[i])
      }
    }
    // a tucked ball: both palms on it, over whatever the keyed arms are doing
    this.wTuck = clamp01(spring(this.tuckWs, this.ballMode === 'tuck' ? 1 : 0, 40, dt))
    if (this.wTuck > 0.01 && this.ballValid) {
      const b = this.ballLocal
      for (const side of [1, -1] as const) {
        this.palm.set(b.x + side * (COURT.ballRadius + 0.006 * this.H), b.y + 0.008 * this.H, b.z - 0.01 * this.H)
        this.handBasisHold(0.25, this.qC)
        this.armIK(this.loco, side, this.palm, this.qC, this.wTuck)
      }
    }
    for (let i = 0; i < this.curV.length; i++) this.curV[i] = wrap(this.loco.r[i] - this.cur.r[i]) / dt
    this.cur.copy(this.loco)
    this.char.applyPose(this.cur.r, this.cur.hipX, this.cur.hipY, this.cur.hipZ)
  }

  /**
   * Pose inertialization: on a switch the offset from where each joint was heading to the new pose is
   * captured, then decays as a critically damped spring, so the switch keeps every joint's position and
   * velocity continuous. The legs and hips take part only for full-body poses (feet detached).
   */
  private inertialize(trigger: boolean, fullBody: boolean, dt: number) {
    const off = this.inOff
    const ov = this.inOffV
    const n = off.length
    if (trigger) {
      for (let i = 0; i < n; i++) {
        const legs = !UPPER_SET.has(Math.floor(i / 3))
        if (legs && !fullBody) {
          off[i] = 0
          ov[i] = 0
          continue
        }
        off[i] = wrap(this.cur.r[i] + this.curV[i] * dt - this.loco.r[i])
        ov[i] = this.curV[i]
      }
      this.inActive = true
    }
    if (!this.inActive) return
    const w = 20
    const e = Math.exp(-w * dt)
    let live = false
    for (let i = 0; i < n; i++) {
      const j = ov[i] + w * off[i]
      off[i] = (off[i] + j * dt) * e
      ov[i] = (ov[i] - w * j * dt) * e
      this.loco.r[i] += off[i]
      if (Math.abs(off[i]) > 1e-4) live = true
    }
    this.inActive = live
  }

  // ---------------------------------------------------------------- locomotion
  private locomotion(p: Pose, inp: AnimInput, dt: number, rx: number, rz: number, facing: number, vwx: number, vwz: number, detached: boolean) {
    const H = this.H
    const hs = H / 1.95
    const v = inp.speed
    const lvx = inp.localVelX
    const lvz = inp.localVelZ
    const moving = v > 0.2 && !detached
    const t = inp.time
    const st = this.style
    p.reset()

    // ---------- travel frame. Slides and backpedals top out around 2.5-3.5 m/s; past that the hips open
    // toward the travel direction and the athlete runs while the chest and head stay on the target.
    const def = inp.defense && !inp.hasBall ? 1 : 0
    const ta = v > 0.3 ? Math.atan2(lvx, lvz) : 0
    const ata = Math.abs(ta)
    if (ata > 0.2 && ata < 2.4) this.openSide = ta > 0 ? 1 : -1
    const lo = lerp(2.3, 3.3, sm(0.2, 0.75, -Math.cos(ta)))
    const open = moving ? sm(lo, lo + 0.8, v) : 0
    // running straight back: keep turning the hips to the side they already favour
    const taU = clamp(ata > 2.4 ? this.openSide * ata : ta, -2.8, 2.8)
    this.gYaw = damp(this.gYaw, taU * open, 6, dt)
    const g = this.gYaw
    const gc0 = Math.cos(g), gs0 = Math.sin(g)
    // velocity and acceleration in the travel frame
    const gvx = lvx * gc0 - lvz * gs0
    const gvz = lvx * gs0 + lvz * gc0
    const accLat = this.accLat * gc0 - this.accFwd * gs0
    const accFwd = this.accLat * gs0 + this.accFwd * gc0
    const gf = facing + g
    const gc = Math.cos(gf), gs = Math.sin(gf)
    const fc = Math.cos(facing), fs = Math.sin(facing)

    // ---------- style weights
    const defT = def * (1 - open)
    const drib = inp.hasBall && inp.dribbling && (!inp.action || HAND_SWITCH.has(inp.action) || inp.action === 'hesi') ? 1 : 0
    const hold = inp.hasBall && !drib && (!inp.action || inp.action === 'hold' || inp.action === 'catch') ? 1 : 0
    const lat = v > 0.3 ? Math.abs(gvx) / v : 0
    const shuffle = (1 - def) * (1 - open) * sm(0.62, 0.88, lat) * (1 - sm(3.6, 5.0, v))
    this.wMove = damp(this.wMove, moving ? sm(0.2, 0.9, v) : 0, 9, dt)
    this.wDef = damp(this.wDef, defT, 6, dt)
    this.wDrib = damp(this.wDrib, drib, 10, dt)
    this.wHold = damp(this.wHold, hold, 10, dt)
    this.wSlide = damp(this.wSlide, Math.max(defT, shuffle), 7, dt)
    const run = sm(1.9, 4.2, v)
    const sprint = sm(5.0, 7.0, v)
    const wm = this.wMove
    const slide = this.wSlide
    const shuffleW = Math.max(0, slide - this.wDef)
    const ballW = Math.max(this.wDrib, this.wHold)
    // feet turn out a little, more in a wide stance
    const toeOut = (0.1 + 0.12 * this.wDef + 0.06 * ballW) * (1 - 0.6 * run * wm)

    // ---------- gait timing (cadence and duty factor follow speed; stride = speed / cadence)
    const cadRun = (Math.min(3.9, 1.72 + 0.27 * v) / Math.sqrt(hs)) * st.cadence
    // slides are quick, short, non-crossing steps
    const cadSlide = Math.min(5.4, 3 + 0.95 * v)
    // a spin is two or three quick pivot steps around the turn
    const spinning = inp.action === 'spin'
    const cadence = spinning ? Math.max(6.2, lerp(cadRun, cadSlide, slide)) : lerp(cadRun, cadSlide, slide)
    const rate = cadence / 2
    // running stance shortens toward a real runner's (under 0.3 of the cycle, about 0.23 sprinting)
    const duty = lerp(lerp(0.61, 0.28, run) - 0.05 * sprint, lerp(0.62, 0.46, sm(0.4, 2.4, v)), slide)
    const ivx = v > 1e-3 ? gvx / v : 0
    const ivz = v > 1e-3 ? gvz / v : 1
    if (moving && !this.wasMoving) {
      // first step: the foot trailing the travel direction pushes off first
      const proj = (f: Foot) => {
        const dx = f.x - rx, dz = f.z - rz
        return (dx * gc - dz * gs) * ivx + (dx * gs + dz * gc) * ivz
      }
      const leftFirst = proj(this.feet[0]) <= proj(this.feet[1])
      this.phase = ((leftFirst ? duty : duty - 0.5) - 0.01 + 1) % 1
    }
    this.wasMoving = moving
    if (moving) this.phase = (this.phase + rate * dt) % 1
    this.cycleRate = moving ? rate : 0
    const halfTravel = moving ? (0.5 * v * duty) / rate : 0
    // accelerating, the feet land under the hips (drive steps); braking, they reach out ahead (braking steps)
    const accT = v > 0.3 ? (this.accLat * lvx + this.accFwd * lvz) / v : 0
    const accStep = clamp(-accT * 0.012, -0.11, 0.08) * H * wm
    // never plant so far out that the hips have to drop to reach the floor: the stance sits a little behind
    // the hips (a runner lands under himself and pushes off behind), and a landing is capped at what the
    // leg reaches from the current hip height, with a small allowance
    const hipJoint = this.lastHipsY + R.thighY * H
    const vert = Math.max(0, hipJoint - R.ankle * H)
    const reachL = (R.thigh + R.shin) * H * 0.955
    const reachH = Math.sqrt(Math.max(0, reachL * reachL - vert * vert)) + 0.035 * H
    const land = Math.min(halfTravel * lerp(1, 0.8, run) + accStep, 0.3 * H, Math.max(0.06 * H, reachH))
    // a trailing foot comes up once the leg (with the heel off the floor) can no longer reach it
    const reachBehind = Math.min(0.32 * H, Math.max(0.16 * H, reachH + 0.035 * H))
    const liftAmp = spinning ? 0.06 * hs : lerp(lerp(0.055, 0.27, run) + 0.12 * sprint, 0.04, slide) * hs

    const dh = inp.dribbleHand
    /** comfortable stance offset of a foot in the travel frame */
    const neutral = (side: 1 | -1, out: { x: number; z: number }) => {
      let x = 0.067 * H
      let z = (side > 0 ? 0.016 : -0.012) * H
      x = lerp(x, 0.108 * H, this.wDrib)
      z = lerp(z, (side === -dh ? 0.058 : -0.034) * H, this.wDrib)
      x = lerp(x, 0.09 * H, this.wHold)
      z = lerp(z, (side > 0 ? 0.056 : -0.03) * H, this.wHold)
      x = lerp(x, lerp(0.05, 0.032, run) * H, wm)
      z = lerp(z, 0, wm)
      x = lerp(x, lerp(0.1, 0.152, this.wDef) * H, slide)
      z = lerp(z, (side > 0 ? 0.016 : -0.02) * H * this.wDef, slide)
      out.x = side * x * st.width
      out.z = z
    }

    // ---------- feet: phase-scheduled steps, world-locked stance
    const nt = this.nTmp
    for (let i = 0; i < 2; i++) {
      const f = this.feet[i]
      const off = i === 0 ? 0 : 0.5
      f.since += dt
      if (detached) {
        neutral(f.side, nt)
        f.x = rx + nt.x * gc + nt.z * gs
        f.z = rz - nt.x * gs + nt.z * gc
        f.yaw = gf + f.side * toeOut
        f.planted = true
        f.lift = 0
        f.pitch = 0
        f.t = 1
        continue
      }
      // lift when the foot's phase is in its swing window and it has stood long enough; a crossing test
      // misses the window when the duty factor shifts mid-move and leaves the foot down a whole cycle
      const lp = (this.phase + off) % 1
      if (moving && f.planted && lp >= duty && lp < 0.97 && f.since > (0.45 * duty) / Math.max(0.1, rate)) this.startSwing(f, Math.max(0.08, (1 - lp) / rate), liftAmp, true)
      // pivoting: a planted foot turns with the body on the ball of the foot instead of twisting the knee
      if (spinning && f.planted) f.yaw += wrap(gf + f.side * toeOut - f.yaw) * (1 - Math.exp(-16 * dt))
      if (f.planted) {
        // never let a planted foot trail out of reach (sharp cuts, sudden pushes), nor twist far round
        // from the way the body is going (turning back on itself)
        const hx = rx + f.side * R.thighX * H * gc
        const hz = rz - f.side * R.thighX * H * gs
        if (Math.hypot(f.x - hx, f.z - hz) > reachBehind) this.startSwing(f, 0.16, 0.04 * H, moving)
        else if (moving && !spinning && Math.abs(wrap(f.yaw - gf - f.side * toeOut)) > 1.25) this.startSwing(f, 0.18, 0.04 * H, true)
      }
      if (!f.planted) {
        f.t += dt / f.dur
        const tt = clamp01(f.t)
        const tl = Math.max(0, (1 - f.t) * f.dur)
        const pf = gf + clamp(this.yawRate * tl * 0.6, -0.6, 0.6)
        const pc = Math.cos(pf), ps = Math.sin(pf)
        const prx = rx + vwx * tl
        const prz = rz + vwz * tl
        neutral(f.side, nt)
        let lx = nt.x
        let lz = nt.z
        if (f.gait && moving) {
          lx += ivx * land + f.jx
          lz += ivz * land + f.jz
        } else {
          lx += f.jx
          lz += f.jz
        }
        const tx = prx + lx * pc + lz * ps
        const tz = prz - lx * ps + lz * pc
        // running: the heel recovers up behind first, then the foot whips forward
        const sh = Math.pow(ease(tt), f.gait ? 1 + 0.9 * run : 1)
        f.x = f.fx + (tx - f.fx) * sh
        f.z = f.fz + (tz - f.fz) * sh
        const fy = pf + f.side * toeOut + f.jyaw
        let yd = wrap(fy - f.fyaw)
        if (yd === yd && f.yawD === f.yawD && Math.abs(yd - f.yawD) > Math.PI) yd += yd < f.yawD ? TAU : -TAU
        f.yawD = yd
        f.yaw = f.fyaw + yd * ease(tt)
        const k = f.gait ? lerp(1, 0.62, run) : 1
        f.lift = f.amp * Math.pow(Math.sin(Math.PI * Math.pow(tt, k)), 0.85)
        if (f.t >= 1) {
          f.planted = true
          f.x = tx
          f.z = tz
          f.yaw = fy
          f.lift = 0
          f.since = 0
        }
      }
    }
    // standing: settle steps toward a comfortable stance, pivot steps when turning in place
    this.stepCool -= dt
    this.fidgetT -= dt
    if (moving) this.fidgetT = Math.max(this.fidgetT, 1.5)
    if (!detached && !moving && this.feet[0].planted && this.feet[1].planted && this.stepCool <= 0) {
      let best = -1
      let bestScore = 1
      for (let i = 0; i < 2; i++) {
        const f = this.feet[i]
        neutral(f.side, nt)
        const tx = rx + nt.x * gc + nt.z * gs
        const tz = rz - nt.x * gs + nt.z * gc
        const score = Math.hypot(f.x - tx, f.z - tz) / (0.05 * H) + Math.abs(wrap(f.yaw - gf - f.side * toeOut)) / 0.55
        if (score > bestScore) {
          bestScore = score
          best = i
        }
      }
      if (best >= 0) {
        this.startSwing(this.feet[best], 0.24, 0.032 * H, false)
        this.stepCool = 0.1
      } else if (this.fidgetT <= 0) {
        // the odd weight-shifting step so nobody stands frozen (defenders keep their feet busier)
        const f = this.feet[Math.random() < 0.5 ? 0 : 1]
        this.startSwing(f, 0.3, 0.022 * H, false)
        f.jx = (Math.random() - 0.5) * 0.035 * H
        f.jz = (Math.random() - 0.5) * 0.045 * H
        f.jyaw = (Math.random() - 0.5) * 0.18
        this.fidgetT = 2.5 + Math.random() * 4.5 - 1.5 * this.wDef
        this.stepCool = 0.4
      }
    }

    // ---------- pelvis
    const gaitW = wm * (1 - slide)
    const sway = Math.cos(TAU * (this.phase - duty * 0.5))
    this.idleT += dt
    const idleW = (1 - wm) * (1 - this.wDef) * (1 - 0.6 * ballW)
    const shift = Math.sin(this.idleT * 0.55) * idleW
    const swayX = (lerp(0.012, 0.005, run) * sway * gaitW * st.swagger + 0.016 * shift) * H
    const strideYaw = -lerp(0.07, 0.13, run) * Math.cos(TAU * this.phase) * gaitW * st.swagger
    const dirYaw = gvz > 0.2 && v > 0.5 ? clamp(Math.atan2(gvx, gvz), -0.7, 0.7) * 0.4 * gaitW : 0
    // crossover: a low, shoulder-dipping change of direction (folded in before the leg IK so the feet stay planted)
    const xoK = inp.action === 'crossover' ? Math.sin(Math.PI * clamp01(inp.actionT / Math.max(0.05, inp.actionDur))) : 0
    // the spin sits low through the turn
    const spinK = spinning ? Math.sin(Math.PI * clamp01(inp.actionT / Math.max(0.05, inp.actionDur))) : 0
    const xoDir = this.xoTo
    const hipYaw = strideYaw + dirYaw + 0.05 * shift + 0.1 * xoDir * xoK
    // lean into acceleration: cuts, curves and lateral pushes tip the whole body
    const bank = clamp(Math.atan2(accLat, 9.81) * 0.55, -0.26, 0.26) * wm
    const swayRoll = lerp(0.055, 0.03, run) * sway * gaitW * st.swagger - 0.035 * shift
    const hipRoll = swayRoll - bank
    // the body tips into acceleration (bursting out of a stance) and rocks back against braking
    const accLean = clamp(Math.atan2(accFwd, GRAVITY) * 0.7, -0.22, 0.42) * wm
    const hipPitch = 0.03 + 0.05 * run * wm + 0.05 * sprint + 0.1 * this.wDef + (0.1 * this.wDrib + 0.06 * this.wHold) * (1 - wm * 0.5) + 0.06 * xoK + 0.35 * accLean

    // height: crouch for the style, running compression at mid-stance, legs never hyperextend
    let comp = 0
    for (let i = 0; i < 2; i++) {
      const lp = (this.phase + (i ? 0.5 : 0)) % 1
      if (lp < duty) comp = Math.max(comp, Math.sin((Math.PI * lp) / duty))
    }
    let hipsY = R.hip * H
    hipsY -= 0.012 * H
    hipsY -= (0.088 * this.wDrib * (1 - 0.45 * wm) + 0.066 * this.wHold) * H
    // drive steps sit lower
    hipsY -= 0.025 * H * clamp(accT / 10, 0, 1) * wm
    hipsY -= 0.125 * this.wDef * H + 0.06 * shuffleW * H
    hipsY -= (0.03 * run + 0.014 * sprint) * H * wm
    hipsY -= 0.03 * H * xoK + 0.055 * H * spinK
    // a set defender stays light on his feet
    hipsY += (Math.sin(t * 8.1) + 0.5 * Math.sin(t * 13.7 + 1.3)) * 0.004 * H * this.wDef * (1 - wm)
    if (moving) hipsY += (-0.017 * run * comp + 0.008 * run * (1 - comp)) * H * (1 - slide) * st.bounce
    const qH = this.qA.setFromEuler(this.eA.set(hipPitch, hipYaw, hipRoll))
    if (g !== 0) qH.premultiply(this.qE.setFromAxisAngle(Y_AXIS, g))
    // side-to-side weight shift happens across the travel frame
    const hipX = swayX * gc0
    const hipZ = -swayX * gs0
    const L = (R.thigh + R.shin) * H
    for (const f of this.feet) {
      // a swinging foot only counts as it comes down to land (never mid-spin): it must not drag the hips
      if (!f.planted && (f.lift > 0.02 * H || f.t < 0.85 || spinning)) continue
      const dxw = f.x - rx, dzw = f.z - rz
      let lx = dxw * fc - dzw * fs
      let lz = dxw * fs + dzw * fc
      // a heel already coming off the floor (toe-off) lifts and shifts the ankle
      let ly = R.ankle * H + f.lift
      if (f.planted && f.pitch > 0) {
        const b = R.toeBall * H
        const relYaw = wrap(f.yaw - facing)
        ly += b * Math.sin(f.pitch)
        lx += Math.sin(relYaw) * b * (1 - Math.cos(f.pitch))
        lz += Math.cos(relYaw) * b * (1 - Math.cos(f.pitch))
      }
      this.vA.set(f.side * R.thighX * H, R.thighY * H, 0).applyQuaternion(qH)
      const ddx = lx - (hipX + this.vA.x)
      const ddz = lz - (hipZ + this.vA.z)
      const reach = L * lerp(0.985, 0.955, run * wm)
      const hmax = ly + Math.sqrt(Math.max(0, reach * reach - ddx * ddx - ddz * ddz)) - this.vA.y
      // a foot that would drag the hips down is picked up instead and the stride moves on: a trailing foot
      // (or any foot in a spin) as soon as it pulls, any other before it can sink the pelvis
      const drag = hipsY - hmax
      if (moving && f.planted && (drag > 0.06 * H || (drag > 0.025 * H && (spinning || ddx * ivx + ddz * ivz < 0)))) {
        this.startSwing(f, clamp((1 - duty) / rate, 0.12, 0.3), liftAmp, true)
        continue
      }
      if (hmax < hipsY) hipsY = hmax
    }
    this.lastHipsY = hipsY
    p.hipX = hipX
    p.hipY = hipsY - R.hip * H
    p.hipZ = hipZ
    this.eA.setFromQuaternion(qH, 'XYZ')
    p.set(B.hips, this.eA.x, this.eA.y, this.eA.z)

    // ---------- legs (IK to the locked feet)
    const toeOff = lerp(0.3, 0.72, run) * wm * (1 - 0.7 * slide)
    const landPitch = lerp(-0.2, -0.03, run) * wm * (1 - slide)
    const qInv = this.qB.copy(qH).invert()
    for (let i = 0; i < 2; i++) {
      const f = this.feet[i]
      const off = i === 0 ? 0 : 0.5
      const lp = (this.phase + off) % 1
      let pitch = 0
      if (detached) pitch = 0
      else if (f.planted) pitch = moving ? toeOff * sm(0.55, 1, lp < duty ? lp / duty : 1) * (f.since > 0.05 ? 1 : f.since / 0.05) : 0
      else {
        const tt = clamp01(f.t)
        pitch = f.gait ? lerp(f.liftPitch, landPitch, sm(0.1, 0.9, tt)) + 0.22 * run * Math.sin(Math.PI * tt) : 0.12 * Math.sin(Math.PI * tt)
      }
      f.pitch = pitch
      const relYaw = wrap(f.yaw - facing)
      const dxw = f.x - rx, dzw = f.z - rz
      let lx = dxw * fc - dzw * fs
      let lz = dxw * fs + dzw * fc
      let ly = R.ankle * H + f.lift
      if (f.planted && pitch > 0) {
        // heel lifts around the ball of the foot
        const b = R.toeBall * H
        const fwd = b * (1 - Math.cos(pitch))
        ly += b * Math.sin(pitch)
        lx += Math.sin(relYaw) * fwd
        lz += Math.cos(relYaw) * fwd
      }
      this.vA.set(lx - hipX, ly - hipsY, lz - hipZ).applyQuaternion(qInv)
      this.vA.x -= f.side * R.thighX * H
      this.vA.y -= R.thighY * H
      // a swinging leg eases into extension (no knee snap at heel strike); a planted one reaches exactly
      solveTwoBone(this.vA.x, this.vA.y, this.vA.z, R.thigh * H, R.shin * H, 1, this.ik, f.planted ? 0 : 0.05)
      const th = f.side > 0 ? B.thighL : B.thighR
      const sh = f.side > 0 ? B.shinL : B.shinR
      const ft = f.side > 0 ? B.footL : B.footR
      // the knee tracks the toes: swivel the bend plane about the hip-ankle axis
      const qT = this.qC.setFromEuler(this.eA.set(this.ik.flex, 0, this.ik.abd))
      const swivel = clamp(wrap(relYaw - g - hipYaw) * 0.7, -0.7, 0.7)
      if (Math.abs(swivel) > 1e-3) qT.premultiply(this.qD.setFromAxisAngle(this.vB.copy(this.vA).normalize(), -swivel))
      this.eA.setFromQuaternion(qT, 'XYZ')
      p.set(th, this.eA.x, this.eA.y, this.eA.z)
      p.set(sh, this.ik.mid, 0, 0)
      // foot: stays level on the floor (or pitched for heel-off / swing), yawed to its planted direction
      qT.premultiply(qH)
      qT.multiply(this.qD.setFromEuler(this.eA.set(this.ik.mid, 0, 0)))
      this.qD.setFromEuler(this.eB.set(pitch, relYaw, 0, 'YXZ'))
      qT.invert().multiply(this.qD)
      this.eA.setFromQuaternion(qT, 'XYZ')
      p.set(ft, this.eA.x, this.eA.y, this.eA.z)
    }

    // ---------- torso and head
    const lean = (lerp(0.04, 0.12, run) + 0.07 * sprint) * wm + accLean + 0.24 * this.wDef + 0.18 * this.wDrib * (1 - 0.5 * wm) + 0.1 * this.wHold + 0.08 * shuffleW + st.lean
    const breath = Math.sin(t * (2.1 + 1.4 * wm)) * (0.012 + 0.01 * wm)
    // open hips: the chest winds back toward the target, the neck turns the rest of the way
    const twist = -clamp(g, -1.9, 1.9)
    // a handler working slowly turns his ball-side shoulder away from the defence
    const shield = dh * this.wDrib * (1 - run) * (1 - this.xoW)
    p.set(B.spine, lean * 0.55 + 0.1 * xoK, -strideYaw * 0.45 - dirYaw * 0.4 + twist * 0.22 + 0.06 * xoDir * xoK + 0.04 * shield, -swayRoll * 0.4)
    p.set(B.chest, lean * 0.45 + breath + 0.05 * xoK, -strideYaw * 0.65 - dirYaw * 0.5 + twist * 0.3 + 0.14 * xoDir * xoK + 0.1 * shield, -swayRoll * 0.25 - 0.1 * xoDir * xoK)
    const headPitch = 0.03 + 0.08 * this.wDef - 0.03 * this.wDrib + Math.sin(TAU * this.phase * 2) * 0.012 * run * wm
    this.headLook(p, qH, inp.lookYaw, headPitch)

    // ---------- arms: counter-swing to the legs (elbows bend more as speed rises)
    const armAmp = (lerp(0.28, 0.55, run) + 0.3 * sprint) * gaitW * st.arms
    const swing = Math.cos(TAU * (this.phase - 0.46))
    const elbowBase = lerp(0.24, lerp(0.32, 1.42, run) + 0.12 * sprint + st.elbow * run, wm)
    const idleSway = Math.sin(t * 1.3) * 0.03 * (1 - wm)
    for (const side of [1, -1] as const) {
      const s = side > 0 ? swing : -swing
      const flex = -0.06 - armAmp * s + idleSway * side - 0.03 * shift * side
      const abd = 0.1 + 0.05 * run - 0.03 * sprint + 0.2 * shuffleW
      const elbow = -(elbowBase + 0.28 * run * wm * Math.max(0, s) - 0.18 * run * wm * Math.max(0, -s))
      arm(p, side, flex, abd, elbow, -0.12)
    }
    if (this.wDef > 0.01) {
      const w = this.wDef
      for (const side of [1, -1] as const) {
        const ua = side > 0 ? B.upperArmL : B.upperArmR
        const fa = side > 0 ? B.forearmL : B.forearmR
        const hd = side > 0 ? B.handL : B.handR
        const jitter = Math.sin(t * (side > 0 ? 3.1 : 2.7) + (side > 0 ? 0 : 1))
        const flex = (side > 0 ? -0.42 : -0.55) + jitter * 0.08
        const abd = (side > 0 ? 0.92 : 0.78) * side
        const elbow = side > 0 ? -0.55 : -0.72
        p.r[ua * 3] = lerp(p.r[ua * 3], flex, w)
        p.r[ua * 3 + 1] = lerp(p.r[ua * 3 + 1], 0, w)
        p.r[ua * 3 + 2] = lerp(p.r[ua * 3 + 2], abd, w)
        p.r[fa * 3] = lerp(p.r[fa * 3], elbow, w)
        p.r[hd * 3] = lerp(p.r[hd * 3], 0.15, w)
      }
    }

    // ---------- ball handling
    this.ballLayer(p, inp, dt, v, run, sprint)
  }

  /**
   * Stabilised head: turns the neck and head so the eyes stay level and on `yaw` (relative to the root),
   * whatever the torso is doing. A little of the torso's motion is let through so it never looks locked.
   */
  private headLook(p: Pose, qHips: THREE.Quaternion, yaw: number, pitch: number) {
    const q = this.qE.copy(qHips)
    q.multiply(this.qF.setFromEuler(this.eA.set(p.r[B.spine * 3], p.r[B.spine * 3 + 1], p.r[B.spine * 3 + 2])))
    q.multiply(this.qF.setFromEuler(this.eA.set(p.r[B.chest * 3], p.r[B.chest * 3 + 1], p.r[B.chest * 3 + 2])))
    // the neck only turns so far past the chest
    const fwd = this.vD.set(0, 0, 1).applyQuaternion(q)
    const cy = Math.atan2(fwd.x, fwd.z)
    const hy = cy + clamp(wrap(yaw - cy), -1.3, 1.3)
    const target = this.qF.setFromEuler(this.eB.set(pitch, hy, 0, 'YXZ'))
    const rel = q.invert().multiply(target).slerp(IDENT, 0.12)
    const qN = this.qG.identity().slerp(rel, 0.55)
    this.eA.setFromQuaternion(qN, 'XYZ')
    p.set(B.neck, this.eA.x, this.eA.y, this.eA.z)
    qN.invert().multiply(rel)
    this.eA.setFromQuaternion(qN, 'XYZ')
    p.set(B.head, this.eA.x, this.eA.y, this.eA.z)
  }

  // ---------------------------------------------------------------- ball handling (hands via IK)
  private ballLayer(p: Pose, inp: AnimInput, dt: number, v: number, run: number, sprint: number) {
    const H = this.H
    const BR = COURT.ballRadius
    const t = inp.time
    let mode: BallMode = 'none'
    if (inp.hasBall && inp.dribbling && (!inp.action || HAND_SWITCH.has(inp.action) || inp.action === 'hesi')) mode = 'dribble'
    else if (inp.hasBall && inp.action && TUCK.has(inp.action)) mode = 'tuck'
    else if (inp.hasBall && (!inp.action || inp.action === 'hold' || inp.action === 'catch')) mode = 'hold'
    let jump = mode !== this.ballMode
    this.ballMode = mode
    this.ballValid = mode !== 'none'
    if (mode !== 'dribble') {
      // a hand coming off the dribble eases out of its last spot instead of popping to the keyed arm
      for (const side of [1, -1] as const) {
        const i = side > 0 ? 0 : 1
        this.handW[i] = clamp01(spring(this.handWs[i], 0, 22, dt))
        if (this.handW[i] > 0.001 && mode !== 'hold') this.armIK(p, side, this.lastPalm[i], this.lastHandQ[i], this.handW[i])
      }
      this.prevDrib = -1
      this.inAir = false
      this.catchY = -1
    }
    // coming off the dribble the guard arm fades with the dribble posture instead of dropping at once
    if (mode !== 'dribble' && this.wDrib > 0.01) this.freeArm(p, this.guardHand, t, run, sprint)
    if (mode === 'none') {
      this.ballOwned = false
      return
    }
    const target = this.ballTarget
    if (mode === 'dribble') {
      const d = inp.dribblePhase
      const prev = this.prevDrib
      // a phase jump (a move restarting the bounce) is absorbed by the ball's inertialization
      if (this.prevDrib >= 0) {
        let dd = d - this.prevDrib
        if (dd < -0.5) dd += 1
        if (dd < -0.02 || dd > 0.3) {
          jump = true
          this.inAir = false
          this.catchY = -1
        }
        // crossover progress: past the bounce the ball belongs to the new hand, caught when the phase wraps
        if (this.xoStage === 0 && this.prevDrib < 0.5 && d >= 0.5) this.xoStage = 1
        else if (this.xoStage === 1 && d < this.prevDrib - 0.5) this.xoStage = 2
      }
      this.prevDrib = d
      const xoActive = !!inp.action && HAND_SWITCH.has(inp.action) && this.xoStage < 2
      this.xoW = clamp01(spring(this.xoWs, xoActive ? 1 : 0, 22, dt))
      const xw = this.xoW
      // the period follows the tempo closely: the palm ride and the flight are timed with the phase as it
      // actually advances (a lagging period mistimes the catch when the tempo changes)
      this.dribT = damp(this.dribT, 1 / Math.max(0.8, inp.dribbleRate ?? 2), 30, dt)
      const mk = sm(0.4, 6.5, v)
      // top of the hand contact: a low control dribble standing, higher and further out at speed
      const top = lerp((0.405 + 0.06 * mk) * this.style.dribble, 0.34, xw) * H
      const rel = top - 0.04 * H
      const cat = rel - 0.012 * H
      // the palm's ride is solved fresh every frame; a ball in the air keeps the flight it was released
      // with, so a change of tempo (a hesitation, locking to the stride) never moves it mid-air
      const fl = this.flight
      this.solveDribble(this.dribT, rel, cat, BR, lerp(0.64, 0.72, mk), fl)
      // hand / air state: released when the phase passes the release point, caught when it passes the
      // catch point of the flight it was released with
      const air = this.air
      const handFrom = this.catchY >= 0 ? this.catchD : fl.dCat
      const handSpan = (((fl.dRel - handFrom) % 1) + 1) % 1 || 1e-3
      if (prev < 0 || jump) {
        this.inAir = d >= fl.dRel && d <= fl.dCat
        if (this.inAir) {
          Object.assign(air, fl)
          this.airT = this.dribT
        }
      } else if (!this.inAir && (crossed(prev, d, fl.dRel) || (((d - handFrom) % 1) + 1) % 1 >= handSpan)) {
        this.inAir = true
        Object.assign(air, fl)
        this.airT = this.dribT
      } else if (this.inAir && crossed(prev, d, air.dCat)) {
        this.inAir = false
        this.catchY = air.hc
        this.catchV = air.vc
        this.catchD = air.dCat
      }
      const nowAir = this.inAir
      const inHand = !nowAir
      const ff = nowAir ? air : fl
      const T = nowAir ? this.airT : this.dribT
      let by: number
      let s = 0
      let u = 0
      let k = 0
      if (!inHand) {
        // free flight: pushed down, gravity, bounce, rising back to the palm
        const tf = (d - ff.dRel) * T
        u = clamp01((d - ff.dRel) / (ff.dCat - ff.dRel))
        if (tf < ff.tDown) {
          by = ff.hr - ff.v0 * tf - 0.5 * GRAVITY * tf * tf
          k = tf / Math.max(1e-3, ff.tDown)
        } else {
          const tu = tf - ff.tDown
          by = BR + ff.vUp * tu - 0.5 * GRAVITY * tu * tu
          k = Math.max(0, 1 - tu / Math.max(1e-3, ff.tUp))
        }
        by = Math.max(BR, by)
      } else {
        // riding the palm from the catch: absorbed on the way up, pushed on the way down
        const from = this.catchY >= 0 ? this.catchD : fl.dCat
        const span = (((fl.dRel - from) % 1) + 1) % 1 || 1e-3
        s = clamp01(((((d - from) % 1) + 1) % 1) / span)
        const Tc = span * T
        const cy = this.catchY >= 0 ? this.catchY : cat
        const cv = this.catchY >= 0 ? this.catchV : fl.vc
        by = hermite(cy, cv * Tc, rel, -fl.v0 * Tc, s)
      }
      // horizontal: at the hand's side; a speed dribble is pushed out ahead so it bounces in front and the
      // body runs onto it (constant relative speed down, slowed by the floor on the way up)
      const dh = inp.dribbleHand
      const baseX = dh * (0.148 + 0.012 * mk) * H
      const baseZ = (0.125 + 0.1 * mk + 0.035 * sprint) * H
      let bx = baseX
      let bz = baseZ + (0.012 + 0.11 * mk) * H * k
      let hand: 1 | -1 = dh
      let palmX = baseX
      let palmZ = baseZ
      if (xw > 0.001) {
        // crossover: pushed across the body at constant lateral speed, bouncing near the midline; a
        // behind-the-back wraps the ball around the hips and bounces it behind the heels
        const behind = this.xoBehind
        const from = this.xoFrom * (behind ? 0.17 : 0.15) * H
        const to = this.xoTo * (behind ? 0.17 : 0.15) * H
        // only the crossing flight travels across; once caught the ball stays on the new side
        const crossing = !inHand && this.xoStage < 2
        const xbx = crossing ? lerp(from, to, u) : this.xoStage === 0 ? from : to
        const zMid = behind ? -0.075 * H : 0.165 * H
        const zSide = behind ? 0.02 * H : 0.165 * H
        const xbz = crossing ? lerp(zSide, zMid, Math.sin(Math.PI * u)) : zSide
        bx = lerp(bx, xbx, xw)
        bz = lerp(bz, xbz, xw)
        if (xoActive) hand = this.xoStage === 0 ? this.xoFrom : this.xoTo
        palmX = lerp(baseX, hand * (behind ? 0.17 : 0.15) * H, xw)
        palmZ = lerp(baseZ, zSide, xw)
      }
      target.set(bx, by, bz)
      this.settleBall(target, dt, jump, BR)
      const ball = this.ballLocal
      // palm: on top of the ball while in contact; between touches it follows through, then rises to meet it
      const pal = this.palm
      if (inHand) pal.set(ball.x + hand * 0.012 * H, ball.y + BR + 0.004 * H, ball.z - 0.022 * H)
      else {
        const Tf = (ff.dCat - ff.dRel) * T
        const hy = hermite(ff.hr + BR, -0.35 * ff.v0 * Tf, ff.hc + BR, 0.6 * ff.vc * Tf, u)
        pal.set(palmX + hand * 0.012 * H, Math.max(hy, ball.y + BR) + 0.004 * H, palmZ - 0.022 * H)
      }
      // wrist snaps through the push, relaxes while the ball is away
      const pushK = inHand ? sm(0.45, 1, s) : 1 - sm(0, 0.35, u)
      this.handBasisDribble(hand, spring(this.tipS, 0.25 + 0.55 * pushK, jump ? 30 : 60, dt), this.qC)
      // the ball-side shoulder dips into each push
      p.add(B.chest, 0, 0, -hand * 0.035 * pushK * this.wDrib)
      this.freeArm(p, hand, t, run, sprint)
      // the dribbling hand rides the ball; a hand that just let go eases out of its last spot
      for (const side of [1, -1] as const) {
        const i = side > 0 ? 0 : 1
        const active = side === hand
        this.handW[i] = clamp01(spring(this.handWs[i], active ? 1 : 0, 44, dt))
        if (active) {
          this.lastPalm[i].copy(pal)
          this.lastHandQ[i].copy(this.qC)
        }
        // the hand follows its own (fast) weight; only the crouch blends in at the posture's pace
        const hw = this.handW[i]
        if (hw > 0.001) this.armIK(p, side, active ? pal : this.lastPalm[i], active ? this.qC : this.lastHandQ[i], hw)
      }
      return
    }
    this.xoW = clamp01(spring(this.xoWs, 0, 22, dt))
    if (mode === 'tuck') {
      // tucked to the belly through a spin, gathered at the chest on a step-back (palms placed after the
      // keyed arms, in update)
      const chest = inp.action === 'stepback'
      target.set(0, (chest ? 0.62 : 0.5) * H, (chest ? 0.17 : 0.15) * H)
      this.settleBall(target, dt, jump, BR)
      return
    }
    // triple threat at the hip, or secured at the chest on the catch
    const chest = inp.action === 'catch'
    const sd = inp.dribbleHand
    target.set(chest ? 0 : sd * 0.035 * H, chest ? 0.64 * H : 0.465 * H, chest ? 0.19 * H : 0.135 * H)
    this.settleBall(target, dt, jump, BR)
    const b = this.ballLocal
    for (const side of [1, -1] as const) {
      this.palm.set(b.x + side * (BR + 0.006 * H), b.y + 0.008 * H, b.z - 0.01 * H)
      this.handBasisHold(0.25, this.qC)
      this.armIK(p, side, this.palm, this.qC, this.wHold)
    }
  }

  /** Free arm while dribbling: a forearm bar out front, loosening into a running swing at speed. */
  private freeArm(p: Pose, hand: 1 | -1, t: number, run: number, sprint: number) {
    this.guardHand = hand
    const o = (hand === 1 ? -1 : 1) as 1 | -1
    const w = this.wDrib * (1 - 0.55 * sprint)
    const ua = o > 0 ? B.upperArmL : B.upperArmR
    const fa = o > 0 ? B.forearmL : B.forearmR
    const hd = o > 0 ? B.handL : B.handR
    const breathe = Math.sin(t * 2.4) * 0.04
    p.r[ua * 3] = lerp(p.r[ua * 3], -0.55 + breathe - 0.15 * run, w)
    p.r[ua * 3 + 1] = lerp(p.r[ua * 3 + 1], 0, w)
    p.r[ua * 3 + 2] = lerp(p.r[ua * 3 + 2], 0.32 * o, w)
    p.r[fa * 3] = lerp(p.r[fa * 3], -1.25, w)
    p.r[hd * 3] = lerp(p.r[hd * 3], 0.1, w)
  }

  /**
   * Follows the ball's target path. A jump in the path (`jump`, or a sudden leap of the target) is
   * inertialized: the offset from where the ball was heading decays as a critically damped spring, so
   * the ball never teleports and its velocity stays continuous.
   */
  private settleBall(target: THREE.Vector3, dt: number, jump: boolean, br: number) {
    const tv = this.vC
    if (this.ballOwned) tv.copy(target).sub(this.targetPrev).divideScalar(dt)
    else tv.set(0, 0, 0)
    // a target that leaps further than any real dribble moves in one frame is a cut, not motion
    if (this.ballOwned && tv.length() * dt > 0.3) jump = true
    if (jump) {
      if (this.ballOwned) {
        // where the ball was going this frame, minus where the new path is
        this.ballOff.copy(this.ballPrev).addScaledVector(this.ballPrevV, dt).sub(target)
        this.ballOffV.copy(this.ballPrevV)
        tv.set(0, 0, 0)
      } else if (this.extBallValid && this.extAge <= 2) {
        this.ballOff.copy(this.extBall).sub(target)
        this.ballOffV.set(0, 0, 0)
      } else {
        this.ballOff.set(0, 0, 0)
        this.ballOffV.set(0, 0, 0)
      }
      this.ballOffV.sub(tv)
    }
    const w = 24
    const e = Math.exp(-w * dt)
    const off = this.ballOff
    const ov = this.ballOffV
    for (const ax of ['x', 'y', 'z'] as const) {
      const j = ov[ax] + w * off[ax]
      off[ax] = (off[ax] + j * dt) * e
      ov[ax] = (ov[ax] - w * j * dt) * e
    }
    const out = this.ballLocal.copy(target).add(off)
    if (out.y < br) out.y = br
    if (this.ballOwned) this.ballPrevV.copy(out).sub(this.ballPrev).divideScalar(dt)
    else this.ballPrevV.set(0, 0, 0)
    this.ballPrev.copy(out)
    this.targetPrev.copy(target)
    this.ballOwned = true
    this.extBallValid = false
  }

  /**
   * Solves a dribble's free flight for period T: the push speed out of the hand at height `hr` such that
   * the fall, the bounce (restitution 0.78) and the rise back to the palm at `hc` take `flightShare` of the
   * cycle. The bounce is placed at phase 0.5; the rest of the cycle the ball rides the palm.
   */
  private solveDribble(T: number, hr: number, hc: number, r: number, flightShare: number, out: DribbleFlight) {
    const g = GRAVITY
    const e = RESTITUTION
    const drop = Math.max(0.05, hr - r)
    const rise = Math.max(0.04, hc - r)
    const flight = (v0: number) => {
      const vImp = Math.sqrt(v0 * v0 + 2 * g * drop)
      const vUp = e * vImp
      out.v0 = v0
      out.vUp = vUp
      out.tDown = (vImp - v0) / g
      out.tUp = (vUp - Math.sqrt(Math.max(0, vUp * vUp - 2 * g * rise))) / g
      out.vc = vUp - g * out.tUp
      return out.tDown + out.tUp
    }
    // softest push that still brings the ball back up to the hand; flight time falls as the push hardens
    const vMin = Math.sqrt(Math.max(0, (2 * g * rise) / (e * e) - 2 * g * drop)) + 0.05
    const want = T * flightShare
    let lo = vMin
    let hi = 9
    if (flight(lo) <= want) hi = lo
    else if (flight(hi) >= want) lo = hi
    else {
      for (let i = 0; i < 16; i++) {
        const mid = (lo + hi) * 0.5
        if (flight(mid) > want) lo = mid
        else hi = mid
      }
    }
    flight((lo + hi) * 0.5)
    out.hr = hr
    out.hc = hc
    out.dRel = clamp(0.5 - out.tDown / T, 0.04, 0.46)
    out.dCat = clamp(0.5 + out.tUp / T, 0.54, 0.96)
  }

  /** Palm down over the ball, fingers forward and tipped `tip` radians toward the floor. */
  private handBasisDribble(side: 1 | -1, tip: number, out: THREE.Quaternion) {
    const fy = -Math.sin(tip), fz = Math.cos(tip)
    // palm normal (down, slightly back) and finger direction in character space
    const nx = 0, ny = -Math.cos(tip), nz = -Math.sin(tip)
    // bone X axis: left hand palm faces -X so X = -n; right hand palm faces +X so X = n
    const xx = side > 0 ? -nx : nx, xy = side > 0 ? -ny : ny, xz = side > 0 ? -nz : nz
    const yx = 0, yy = -fy, yz = -fz
    const zx = xy * yz - xz * yy, zy = xz * yx - xx * yz, zz = xx * yy - xy * yx
    this.mA.set(xx, yx, zx, 0, xy, yy, zy, 0, xz, yz, zz, 0, 0, 0, 0, 1)
    return out.setFromRotationMatrix(this.mA)
  }

  /** Palms facing each other on the sides of the ball, fingers forward and tipped up. */
  private handBasisHold(tilt: number, out: THREE.Quaternion) {
    const yx = 0, yy = -Math.sin(tilt), yz = -Math.cos(tilt)
    const xx = 1, xy = 0, xz = 0
    const zx = xy * yz - xz * yy, zy = xz * yx - xx * yz, zz = xx * yy - xy * yx
    this.mA.set(xx, yx, zx, 0, xy, yy, zy, 0, xz, yz, zz, 0, 0, 0, 0, 1)
    return out.setFromRotationMatrix(this.mA)
  }

  /**
   * Arm IK: places the palm at `palm` (character space) with orientation `handQ`, blended over the
   * current FK arm by `w`. Accounts for the clavicle lift/protraction the character will apply.
   */
  private armIK(p: Pose, side: 1 | -1, palm: THREE.Vector3, handQ: THREE.Quaternion, w: number) {
    if (w <= 0.001) return
    const H = this.H
    // chest frame from the current pose (hips -> spine -> chest)
    const qHips = this.qA.setFromEuler(this.eA.set(p.r[B.hips * 3], p.r[B.hips * 3 + 1], p.r[B.hips * 3 + 2]))
    const pos = this.vA.set(p.hipX, R.hip * H + p.hipY, p.hipZ)
    pos.add(this.vB.set(0, R.spine * H, 0).applyQuaternion(qHips))
    const qSpine = qHips.multiply(this.qD.setFromEuler(this.eA.set(p.r[B.spine * 3], p.r[B.spine * 3 + 1], p.r[B.spine * 3 + 2])))
    pos.add(this.vB.set(0, R.chest * H, 0).applyQuaternion(qSpine))
    const qChest = qSpine.multiply(this.qD.setFromEuler(this.eA.set(p.r[B.chest * 3], p.r[B.chest * 3 + 1], p.r[B.chest * 3 + 2])))
    const clavPos = this.vC.copy(pos).add(this.vB.set(side * R.clavX * H, R.clavY * H, 0).applyQuaternion(qChest))
    // wrist sits a palm-length back from the palm centre along the fingers
    const wrist = this.vB.set(0, -1, 0).applyQuaternion(handQ).multiplyScalar(-R.palm * H).add(palm)
    const qChestInv = this.qB.copy(qChest).invert()
    const c = this.clav[side > 0 ? 0 : 1]
    const ua = side > 0 ? B.upperArmL : B.upperArmR
    const fa = side > 0 ? B.forearmL : B.forearmR
    const hd = side > 0 ? B.handL : B.handR
    const sh = this.vD
    const wristX = wrist.x, wristY = wrist.y, wristZ = wrist.z
    for (let it = 0; it < 2; it++) {
      sh.set(side * R.shoulderX * H, 0, 0).applyQuaternion(this.qD.setFromEuler(this.eA.set(0, c.y, c.z))).applyQuaternion(qChest).add(clavPos)
      this.vB.set(wristX - sh.x, wristY - sh.y, wristZ - sh.z).applyQuaternion(qChestInv)
      solveTwoBone(this.vB.x, this.vB.y, this.vB.z, R.upperArm * H, R.forearm * H, -1, this.ik)
      clavicleAngles(this.qD.setFromEuler(this.eA.set(this.ik.flex, 0, this.ik.abd)), side, c)
    }
    const flex = this.ik.flex, abd = this.ik.abd, mid = this.ik.mid
    // hand orientation relative to the forearm
    const qArm = this.qD.copy(qChest).multiply(this.qB.setFromEuler(this.eA.set(flex, 0, abd))).multiply(this.qB.setFromEuler(this.eA.set(mid, 0, 0)))
    qArm.invert().multiply(handQ)
    this.eA.setFromQuaternion(qArm, 'XYZ')
    const hx = this.eA.x, hy = this.eA.y, hz = this.eA.z
    // blend in rotation space: lerping Euler angles flips the wrist when an angle crosses +-pi
    this.blendBone(p, ua, flex, 0, abd, w)
    p.r[fa * 3] = lerp(p.r[fa * 3], mid, w)
    p.r[fa * 3 + 1] = lerp(p.r[fa * 3 + 1], 0, w)
    this.blendBone(p, hd, hx, hy, hz, w)
  }

  /** Slerps a bone's rotation toward the Euler XYZ target by `w`. */
  private blendBone(p: Pose, bone: number, x: number, y: number, z: number, w: number) {
    const i = bone * 3
    this.qF.setFromEuler(this.eB.set(p.r[i], p.r[i + 1], p.r[i + 2], 'XYZ'))
    this.qG.setFromEuler(this.eB.set(x, y, z, 'XYZ'))
    this.qF.slerp(this.qG, w)
    this.eB.setFromQuaternion(this.qF, 'XYZ')
    p.r[i] = this.eB.x
    p.r[i + 1] = this.eB.y
    p.r[i + 2] = this.eB.z
  }

  // ---------------------------------------------------------------- keyed actions
  /** Writes a keyed action pose. Returns false when the pose is airborne (skip foot planting). */
  private actionPose(p: Pose, kind: ActionKind): boolean {
    const t = this.actT
    switch (kind) {
      case 'shoot': {
        const rel = this.actRel > 0 ? this.actRel : 0.52
        if (t < 0.16) {
          const k = ease(t / 0.16)
          leg(p, 1, lerp(-0.2, -0.6, k), 0.08, lerp(0.35, 1.05, k))
          leg(p, -1, lerp(-0.2, -0.55, k), 0.08, lerp(0.35, 1.0, k))
          arm(p, -1, -0.8, 0.22, -1.75, -0.5)
          arm(p, 1, -0.78, 0.28, -1.7, -0.3)
          p.set(B.spine, 0.18 * k, 0, 0)
          return true
        }
        const k = ease((t - 0.16) / Math.max(0.08, rel - 0.16))
        leg(p, 1, -0.12, 0.05, 0.22, 0.5)
        leg(p, -1, -0.12, 0.05, 0.22, 0.5)
        if (t < rel || this.actRel <= 0) {
          arm(p, -1, lerp(-0.8, -2.62, k), 0.12, lerp(-1.75, -1.7, k), -0.85)
          arm(p, 1, lerp(-0.78, -2.35, k), 0.36, lerp(-1.7, -1.35, k), -0.4)
        } else {
          const f = ease((t - rel) / 0.11)
          arm(p, -1, lerp(-2.62, -2.78, f), 0.1, lerp(-1.7, -0.1, f), lerp(-0.85, 1.15, f))
          arm(p, 1, lerp(-2.35, -1.9, f), lerp(0.36, 0.62, f), lerp(-1.35, -0.6, f), 0.2)
        }
        p.set(B.spine, -0.04, 0, 0)
        p.set(B.neck, -0.12, 0, 0)
        return false
      }
      case 'layup': {
        if (t < 0.18) {
          const k = ease(t / 0.18)
          leg(p, 1, lerp(-0.3, -0.75, k), 0.05, lerp(0.4, 1.1, k))
          leg(p, -1, lerp(-0.1, 0.25, k), 0.05, lerp(0.3, 0.5, k))
          arm(p, -1, -0.9, 0.25, -1.6)
          arm(p, 1, -0.85, 0.3, -1.55)
          p.set(B.spine, 0.25, 0, 0)
          return true
        }
        const k = ease((t - 0.18) / 0.3)
        leg(p, 1, 0.12, 0.05, 0.25, 0.5)
        leg(p, -1, lerp(-0.4, -1.45, k), 0.06, lerp(0.6, 1.5, k), 0.3)
        arm(p, -1, lerp(-1.0, -2.95, k), 0.12, lerp(-1.4, -0.3, k), lerp(-0.5, 0.6, ease((t - 0.45) / 0.15)))
        arm(p, 1, -0.9, 0.75, -0.6)
        p.set(B.spine, 0.08, 0, 0)
        return false
      }
      case 'dunk': {
        if (t < 0.2) {
          const k = ease(t / 0.2)
          leg(p, 1, lerp(-0.3, -0.85, k), 0.08, lerp(0.4, 1.35, k))
          leg(p, -1, lerp(-0.3, -0.8, k), 0.08, lerp(0.4, 1.3, k))
          arm(p, -1, -0.9, 0.25, -1.6)
          arm(p, 1, -0.9, 0.25, -1.6)
          p.set(B.spine, 0.35 * k, 0, 0)
          return true
        }
        if (t < 0.56) {
          const k = ease((t - 0.2) / 0.3)
          leg(p, 1, lerp(-0.2, -0.6, k), 0.1, lerp(0.3, 1.1, k), 0.4)
          leg(p, -1, lerp(-0.2, -0.3, k), 0.1, lerp(0.3, 0.7, k), 0.4)
          arm(p, -1, lerp(-1.2, -3.05, k), 0.18, lerp(-1.4, -1.25, k))
          arm(p, 1, lerp(-1.2, -3.05, k), 0.18, lerp(-1.4, -1.25, k))
          p.set(B.spine, lerp(0.2, -0.22, k), 0, 0)
          return false
        }
        if (t < 0.68) {
          const k = ease((t - 0.56) / 0.1)
          arm(p, -1, lerp(-3.05, -2.2, k), 0.18, lerp(-1.25, -0.1, k))
          arm(p, 1, lerp(-3.05, -2.2, k), 0.18, lerp(-1.25, -0.1, k))
          leg(p, 1, -0.5, 0.12, 0.9, 0.3)
          leg(p, -1, -0.3, 0.12, 0.6, 0.3)
          p.set(B.spine, 0.25, 0, 0)
          return false
        }
        if (t < 0.98) {
          const sw = Math.sin((t - 0.68) * 14) * 0.15
          arm(p, -1, -2.9, 0.2, -0.12)
          arm(p, 1, -2.9, 0.2, -0.12)
          leg(p, 1, -0.25 + sw, 0.1, 0.55, 0.4)
          leg(p, -1, -0.15 - sw, 0.1, 0.45, 0.4)
          p.set(B.spine, -0.1, 0, 0)
          return false
        }
        leg(p, 1, -0.55, 0.12, 0.95)
        leg(p, -1, -0.5, 0.12, 0.9)
        arm(p, -1, -0.6, 0.55, -1.2)
        arm(p, 1, -0.6, 0.55, -1.2)
        p.set(B.spine, 0.2, 0, 0)
        return !this.actAir
      }
      case 'pass': {
        const k = ease(t / 0.18)
        arm(p, -1, lerp(-0.8, -1.5, k), 0.2, lerp(-1.75, -0.08, k), lerp(-0.4, 0.5, k))
        arm(p, 1, lerp(-0.8, -1.5, k), 0.2, lerp(-1.75, -0.08, k), lerp(-0.4, 0.5, k))
        p.add(B.spine, 0.1 * (1 - k * 0.5), 0, 0)
        p.add(B.chest, 0.05 * k, 0, 0)
        return true
      }
      case 'steal': {
        const k = ease(t / 0.16) * (1 - ease((t - 0.3) / 0.15))
        p.set(B.spine, 0.2 + 0.32 * k, 0, 0)
        p.set(B.chest, 0, 0.25 * k, 0)
        arm(p, -1, lerp(-0.5, -1.55, k), 0.12, lerp(-0.8, -0.12, k), 0.3)
        arm(p, 1, lerp(-0.4, 0.35, k), 0.5, -0.5)
        leg(p, -1, lerp(-0.5, -0.95, k), 0.12, lerp(0.8, 0.9, k))
        leg(p, 1, lerp(-0.4, 0.3, k), 0.2, lerp(0.7, 0.45, k))
        return true
      }
      case 'block':
      case 'rebound': {
        const up = ease(t / 0.14)
        const flex = kind === 'block' ? -3.02 : -2.75
        arm(p, -1, lerp(-0.6, flex, up), 0.18, -0.15, 0.2)
        arm(p, 1, lerp(-0.6, flex, up), 0.18, -0.15, 0.2)
        if (this.actAir) {
          leg(p, 1, -0.28, 0.08, 0.55, 0.45)
          leg(p, -1, -0.18, 0.08, 0.45, 0.45)
          p.set(B.spine, -0.05, 0, 0)
          return false
        }
        leg(p, 1, -0.5, 0.1, 0.9)
        leg(p, -1, -0.5, 0.1, 0.9)
        return true
      }
      case 'stumble': {
        const w = Math.sin(t * 15)
        p.set(B.spine, -0.3 + 0.1 * w, 0, 0.2 * w)
        p.set(B.chest, 0, 0.2 * w, 0.1 * w)
        arm(p, 1, -0.6 + 0.4 * Math.sin(t * 11), 1.2 + 0.3 * w, -0.6)
        arm(p, -1, -0.8 + 0.4 * Math.sin(t * 9 + 1), 1.1 - 0.3 * w, -0.5)
        leg(p, 1, 0.25 + 0.15 * w, 0.15, 0.6)
        leg(p, -1, -0.5 - 0.1 * w, 0.2, 0.9)
        return true
      }
      case 'fall': {
        const k = ease(t / 0.45)
        p.set(B.spine, lerp(-0.3, -0.25, k), 0, 0)
        arm(p, 1, lerp(-0.4, 0.75, k), 0.35, -0.2)
        arm(p, -1, lerp(-0.4, 0.75, k), 0.35, -0.2)
        leg(p, 1, lerp(0.2, -1.45, k), 0.2, lerp(0.6, 0.35, k), 0.2)
        leg(p, -1, lerp(-0.4, -1.35, k), 0.25, lerp(0.8, 0.6, k), 0.2)
        p.hipY = -0.52 * this.H * k
        p.hipZ = -0.12 * k
        return false
      }
      case 'celebrate': {
        const v = this.actVariant % 3
        const pump = Math.abs(Math.sin(t * 9))
        if (v === 0) {
          arm(p, -1, -2.7 - pump * 0.2, 0.5, -0.4 - pump * 0.6)
          arm(p, 1, -2.7 - pump * 0.2, 0.5, -0.4 - pump * 0.6)
          p.set(B.spine, -0.18, 0, 0)
          p.set(B.neck, -0.3, 0, 0)
        } else if (v === 1) {
          arm(p, -1, -0.2, 1.45, -1.6 - pump * 0.2, 0, 0.3)
          arm(p, 1, -0.2, 1.45, -1.6 - pump * 0.2, 0, 0.3)
          p.set(B.spine, -0.1, 0, 0)
          p.set(B.chest, -0.1, 0, 0)
        } else {
          arm(p, -1, -2.2, 0.25, -0.05, 0.2)
          arm(p, 1, -0.3, 0.4, -1.6)
          p.set(B.chest, 0, -0.3, 0)
          p.set(B.neck, -0.25, -0.2, 0)
        }
        return true
      }
      case 'dejected': {
        p.set(B.spine, 0.65, 0, 0)
        p.set(B.neck, 0.2, 0, 0)
        arm(p, -1, -0.95, 0.18, -0.45)
        arm(p, 1, -0.95, 0.18, -0.45)
        return true
      }
      case 'stepback': {
        // load on the inside foot, hop back with the ball gathered at the chest, land square for the shot
        if (t < 0.12) {
          const k = ease(t / 0.12)
          leg(p, 1, lerp(-0.3, -0.78, k), 0.08, lerp(0.45, 1.18, k))
          leg(p, -1, lerp(-0.2, -0.45, k), 0.1, lerp(0.35, 0.82, k))
          p.set(B.spine, 0.2 + 0.12 * k, 0, 0)
        } else if (this.actAir || t < 0.34) {
          const k = ease((t - 0.12) / 0.2)
          // the feet reach forward under the hips as the body travels back
          leg(p, 1, lerp(-0.78, -0.62, k), 0.08, lerp(1.18, 0.78, k), 0.25)
          leg(p, -1, lerp(-0.45, -0.88, k), 0.1, lerp(0.82, 0.98, k), 0.25)
          p.set(B.spine, lerp(0.32, 0.12, k), 0, 0)
        } else {
          const k = ease((t - 0.34) / 0.16)
          leg(p, 1, lerp(-0.62, -0.42, k), 0.09, lerp(0.88, 0.72, k))
          leg(p, -1, lerp(-0.62, -0.42, k), 0.09, lerp(0.88, 0.72, k))
          p.set(B.spine, 0.13, 0, 0)
        }
        arm(p, -1, -0.82, 0.22, -1.72, -0.45)
        arm(p, 1, -0.8, 0.28, -1.68, -0.3)
        p.set(B.neck, -0.08, 0, 0)
        return !this.actAir
      }
      case 'spin': {
        // sit low and pivot, ball tucked tight to the belly, shoulders leading the turn
        const k = Math.sin(clamp01(t / Math.max(0.1, this.actDur)) * Math.PI)
        const sw = Math.sin(clamp01(t / Math.max(0.1, this.actDur)) * Math.PI * 2) * 0.32
        leg(p, 1, -0.5 + sw, 0.14, 0.9 + Math.max(0, -sw))
        leg(p, -1, -0.5 - sw, 0.14, 0.9 + Math.max(0, sw))
        p.set(B.spine, 0.3 + 0.12 * k, 0, 0)
        p.set(B.chest, 0, 0.22 * k * (this.actDir >= 0 ? 1 : -1), 0)
        arm(p, -1, -0.58, 0.3, -1.58, -0.3)
        arm(p, 1, -0.58, 0.3, -1.58, -0.3)
        p.set(B.neck, -0.12 * k, 0, 0)
        return true
      }
      case 'hesi': {
        // layered over a live dribble: chest up and eyes to the rim, selling the pull-up
        const k = Math.sin(clamp01(t / Math.max(0.1, this.actDur)) * Math.PI)
        p.add(B.spine, -0.18 * k, 0, 0)
        p.add(B.chest, -0.08 * k, 0, 0)
        p.add(B.neck, -0.16 * k, 0, 0)
        return true
      }
      case 'pumpfake': {
        // ball up to the set point as if to shoot, then back down
        const up = t < 0.17 ? ease(t / 0.17) : 1 - ease((t - 0.21) / 0.19)
        arm(p, -1, lerp(-0.85, -2.3, up), 0.15, lerp(-1.72, -1.82, up), -0.6)
        arm(p, 1, lerp(-0.82, -2.1, up), 0.3, lerp(-1.66, -1.55, up), -0.35)
        p.set(B.spine, lerp(0.16, -0.06, up), 0, 0)
        p.set(B.neck, -0.16 * up, 0, 0)
        return true
      }
      case 'screen': {
        // wide base, forearms crossed over the chest, braced for contact
        leg(p, 1, -0.32, 0.22, 0.52)
        leg(p, -1, -0.32, 0.22, 0.52)
        p.set(B.spine, 0.12, 0, 0)
        arm(p, -1, -0.6, 0.1, -1.9, 0, -0.9)
        arm(p, 1, -0.56, 0.1, -1.9, 0, -0.9)
        return true
      }
      case 'intro': {
        // starting-lineup swagger
        const v = this.actVariant % 3
        const nod = Math.sin(t * 2.2) * 0.04
        if (v === 0) {
          // arms folded across the chest
          arm(p, -1, -0.62, 0.1, -1.9, 0, -0.9)
          arm(p, 1, -0.55, 0.1, -1.9, 0, -0.9)
        } else if (v === 1) {
          // hands on the hips, elbows out
          arm(p, -1, 0.6, 0.7, -1.5, 0.1, -0.25)
          arm(p, 1, 0.6, 0.7, -1.5, 0.1, -0.25)
        } else {
          arm(p, -1, -2.85, 0.15, -0.1, 0.2)
          arm(p, 1, -0.35, 0.25, -0.5)
        }
        p.set(B.spine, -0.05, 0, 0)
        p.set(B.neck, -0.14 + nod, 0, 0)
        return true
      }
    }
    return true
  }
}
