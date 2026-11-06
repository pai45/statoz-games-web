import * as THREE from 'three'
import { BONE_COUNT } from '../world/Character'
import type { BallBody } from '../world/Ball'
import type { Athlete } from './Athlete'

const POSE = BONE_COUNT * 3
/** per athlete: x, jump y, z, facing, hip x/y/z, then the pose (Euler XYZ per bone) */
const A_STRIDE = 7 + POSE
/** ball: position + quaternion (spin) */
const B_STRIDE = 7

const lerpAngle = (a: number, b: number, t: number) => a + Math.atan2(Math.sin(b - a), Math.cos(b - a)) * t
/** frames closer together than this are skipped, so high-refresh displays keep the full history */
const MIN_STEP = 1 / 72

/**
 * Rolling recording of the last few seconds of play for instant replays: every athlete's root, facing
 * and full 19-bone pose plus the ball, in one preallocated ring buffer (no per-frame allocation).
 * Playback interpolates between frames and drives the characters directly, bypassing the simulation.
 */
export class ReplayBuffer {
  private readonly n: number
  private readonly stride: number
  private readonly capacity: number
  private readonly data: Float32Array
  private readonly times: Float64Array
  private head = 0
  private count = 0
  private lastT = -Infinity
  private pose: Float32Array[]
  private q0 = new THREE.Quaternion()
  private q1 = new THREE.Quaternion()

  constructor(athletes: number, seconds = 4.2, fps = 75) {
    this.n = athletes
    this.stride = athletes * A_STRIDE + B_STRIDE
    this.capacity = Math.ceil(seconds * fps)
    this.data = new Float32Array(this.capacity * this.stride)
    this.times = new Float64Array(this.capacity)
    this.pose = Array.from({ length: athletes }, () => new Float32Array(POSE))
  }

  clear() {
    this.head = 0
    this.count = 0
    this.lastT = -Infinity
  }

  get startTime() {
    return this.count ? this.times[this.index(0)] : 0
  }

  get endTime() {
    return this.count ? this.times[this.index(this.count - 1)] : 0
  }

  private index(logical: number) {
    return (this.head - this.count + logical + this.capacity * 2) % this.capacity
  }

  capture(t: number, athletes: readonly Athlete[], ball: BallBody) {
    if (t - this.lastT < MIN_STEP) return
    this.lastT = t
    const i = this.head
    const o = i * this.stride
    const d = this.data
    for (let k = 0; k < this.n; k++) {
      const a = athletes[k]
      const b = o + k * A_STRIDE
      const g = a.char.group
      d[b] = g.position.x
      d[b + 1] = g.position.y
      d[b + 2] = g.position.z
      d[b + 3] = g.rotation.y
      const p = a.anim.cur
      d[b + 4] = p.hipX
      d[b + 5] = p.hipY
      d[b + 6] = p.hipZ
      d.set(p.r, b + 7)
    }
    const bo = o + this.n * A_STRIDE
    const m = ball.mesh
    d[bo] = m.position.x
    d[bo + 1] = m.position.y
    d[bo + 2] = m.position.z
    d[bo + 3] = m.quaternion.x
    d[bo + 4] = m.quaternion.y
    d[bo + 5] = m.quaternion.z
    d[bo + 6] = m.quaternion.w
    this.times[i] = t
    this.head = (this.head + 1) % this.capacity
    this.count = Math.min(this.capacity, this.count + 1)
  }

  /** Poses the athletes and ball as they were at time `t` (clamped to the recording). */
  apply(t: number, athletes: readonly Athlete[], ball: BallBody) {
    if (this.count < 2) return
    // binary search for the last frame at or before t
    let lo = 0
    let hi = this.count - 1
    if (t <= this.times[this.index(0)]) hi = 0
    else if (t >= this.times[this.index(hi)]) lo = hi
    else {
      while (hi - lo > 1) {
        const mid = (lo + hi) >> 1
        if (this.times[this.index(mid)] <= t) lo = mid
        else hi = mid
      }
    }
    const i0 = this.index(lo)
    const i1 = this.index(Math.min(this.count - 1, lo + 1))
    const t0 = this.times[i0]
    const t1 = this.times[i1]
    const f = t1 > t0 ? Math.min(1, Math.max(0, (t - t0) / (t1 - t0))) : 0
    const d = this.data
    const o0 = i0 * this.stride
    const o1 = i1 * this.stride
    for (let k = 0; k < this.n; k++) {
      const a = athletes[k]
      const b0 = o0 + k * A_STRIDE
      const b1 = o1 + k * A_STRIDE
      const g = a.char.group
      g.position.set(d[b0] + (d[b1] - d[b0]) * f, d[b0 + 1] + (d[b1 + 1] - d[b0 + 1]) * f, d[b0 + 2] + (d[b1 + 2] - d[b0 + 2]) * f)
      g.rotation.y = lerpAngle(d[b0 + 3], d[b1 + 3], f)
      const pose = this.pose[k]
      for (let j = 0; j < POSE; j++) pose[j] = lerpAngle(d[b0 + 7 + j], d[b1 + 7 + j], f)
      a.char.applyPose(pose, d[b0 + 4] + (d[b1 + 4] - d[b0 + 4]) * f, d[b0 + 5] + (d[b1 + 5] - d[b0 + 5]) * f, d[b0 + 6] + (d[b1 + 6] - d[b0 + 6]) * f)
    }
    const c0 = o0 + this.n * A_STRIDE
    const c1 = o1 + this.n * A_STRIDE
    const x = d[c0] + (d[c1] - d[c0]) * f
    const y = d[c0 + 1] + (d[c1 + 1] - d[c0 + 1]) * f
    const z = d[c0 + 2] + (d[c1 + 2] - d[c0 + 2]) * f
    // the net simulation reads pos/vel, so the replayed ball swishes through it again
    ball.vel.set(x - ball.pos.x, y - ball.pos.y, z - ball.pos.z).multiplyScalar(60)
    ball.pos.set(x, y, z)
    ball.mesh.position.set(x, y, z)
    this.q0.set(d[c0 + 3], d[c0 + 4], d[c0 + 5], d[c0 + 6])
    this.q1.set(d[c1 + 3], d[c1 + 4], d[c1 + 5], d[c1 + 6])
    ball.mesh.quaternion.slerpQuaternions(this.q0, this.q1, f)
  }
}
