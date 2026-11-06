// Counter-sniper behaviour shared by Quick Duel and the final campaign mission.
import * as THREE from 'three'

import type { Actor } from './actors.ts'
import type { NestSpec } from './data.ts'
import type { DuelTuning } from './progression.ts'
import { terrainHeight } from './terrain.ts'
import type { SessionHost } from './types.ts'

export type SniperState = 'hidden' | 'leaving' | 'settling' | 'scanning' | 'aiming' | 'cycling'

const _p = new THREE.Vector3()

export class SniperBrain {
  readonly actor: Actor
  readonly nests: NestSpec[]
  readonly tuning: DuelTuning
  state: SniperState = 'hidden'
  lock = 0
  glint = 0
  warning = false
  wounded = false
  nestIndex = -1
  shotsFired = 0
  /** Called when the marksman fires; `hit` is decided at the trigger pull. */
  onFire: (hit: boolean) => void = () => {}
  private timer = 0
  private spot = 0
  private sweep = Math.random() * 6
  private duckedFor = 0
  private wasExposed = true
  private warned = false
  private readonly host: SessionHost
  private readonly random: () => number

  constructor(host: SessionHost, actor: Actor, nests: NestSpec[], tuning: DuelTuning, random: () => number) {
    this.host = host
    this.actor = actor
    this.nests = nests
    this.tuning = tuning
    this.random = random
    actor.hidden = true
  }

  /** Moves to a nest immediately (round starts) or after hiding for a while. */
  start(index = Math.floor(this.random() * this.nests.length), settle = 1.2): void {
    this.enterNest(index)
    this.state = 'settling'
    this.timer = settle
  }

  relocate(delay = 0.4): void {
    if (!this.actor.alive || this.state === 'hidden' || this.state === 'leaving') return
    this.state = 'leaving'
    this.timer = delay
    this.lock = 0
    this.warning = false
    this.actor.stance = this.actor.stance === 'prone' ? 'prone' : 'crouch'
  }

  private enterNest(index: number): void {
    const nest = this.nests[index % this.nests.length]
    this.nestIndex = index % this.nests.length
    const [nx, ny, nz] = nest.pos
    const feet = ny ?? terrainHeight(nx, nz)
    const eye = this.host.window
    const heading = Math.atan2(eye.x - nx, -(eye.z - nz))
    let x = nx
    let z = nz
    if (nest.pose === 'prone') {
      // The nest position marks the head; the body trails behind it.
      x -= Math.sin(heading) * 1.6
      z += Math.cos(heading) * 1.6
    }
    this.actor.place(x, feet, z, heading)
    this.actor.stance = nest.pose
    this.actor.upper = 'aim'
    this.actor.hidden = false
    const horizontal = Math.hypot(eye.x - nx, eye.z - nz)
    this.actor.aimPitch = Math.atan2(eye.y - (feet + 1.2), horizontal)
    this.lock = 0
    this.spot = 0
    this.warned = false
  }

  private pickNest(): number {
    if (this.nests.length <= 1) return 0
    let index = this.nestIndex
    while (index === this.nestIndex) index = Math.floor(this.random() * this.nests.length)
    return index
  }

  onNearMiss(): void {
    if (!this.actor.alive || this.state === 'hidden' || this.state === 'leaving') return
    this.actor.flinch()
    if (this.tuning.relocateOnMiss) this.relocate(0.35)
    else this.lock = Math.max(0, this.lock - 0.35)
  }

  onWounded(): void {
    this.wounded = true
    this.actor.flinch()
    this.relocate(0.5)
  }

  update(dt: number): void {
    const actor = this.actor
    if (!actor.alive) {
      this.glint = 0
      this.warning = false
      return
    }
    const exposed = this.host.playerExposed()
    this.timer -= dt
    switch (this.state) {
      case 'leaving':
        this.glint = 0
        if (this.timer <= 0) {
          actor.hidden = true
          this.state = 'hidden'
          this.timer = 3.2 + this.random() * 2.8 + (this.wounded ? 1.5 : 0)
        }
        break
      case 'hidden':
        this.glint = 0
        if (this.timer <= 0) this.start(this.pickNest(), 1.1)
        break
      case 'settling':
        this.glint = 0
        if (this.timer <= 0) {
          this.state = 'scanning'
          this.spot = 0
        }
        break
      case 'scanning': {
        this.sweep += dt * 0.45
        const offset = Math.sin(this.sweep) * 0.42
        actor.look(offset, 0.04)
        // Brief glints as the optic sweeps across the ridge.
        this.glint = Math.max(0, 1 - Math.abs(offset) * 6) * 0.3 * this.tuning.glint
        if (exposed) this.spot += dt / (this.tuning.lockTime * 0.55)
        if (this.host.sinceLoudShot() < 0.6) this.spot = 1
        if (this.spot >= 1) {
          this.state = 'aiming'
          this.lock = 0.08
          this.wasExposed = exposed
        }
        break
      }
      case 'aiming': {
        actor.look(0, 0)
        const floor = Math.max(0, 1 - this.tuning.reacquire / this.tuning.lockTime)
        if (exposed) {
          this.duckedFor = 0
          this.lock += dt / this.tuning.lockTime
        } else {
          if (this.wasExposed) this.lock = Math.min(this.lock, floor)
          this.duckedFor += dt
          this.lock = Math.max(0, this.lock - dt * 0.12)
          if (this.duckedFor > 7 && this.random() < dt * 0.3) this.relocate(0.3)
        }
        this.wasExposed = exposed
        const warnAt = 1 - this.tuning.warning / this.tuning.lockTime
        this.warning = this.lock >= warnAt
        if (this.warning && !this.warned) {
          this.warned = true
          this.host.audio.ui('warning')
        }
        if (!this.warning) this.warned = false
        const pulse = this.warning ? 1.15 + Math.sin(this.host.time * 26) * 0.25 : 0.32 + this.lock * 0.6
        this.glint = pulse * this.tuning.glint
        if (this.lock >= 1) this.fire(exposed)
        break
      }
      case 'cycling':
        this.glint = 0.2 * this.tuning.glint
        this.warning = false
        if (this.timer <= 0) {
          this.state = 'aiming'
          this.lock = Math.max(0, 1 - this.tuning.reacquire / this.tuning.lockTime)
        }
        break
    }
  }

  private fire(exposed: boolean): void {
    const hit = exposed && this.random() < this.tuning.accuracy
    this.shotsFired += 1
    this.actor.flinch()
    this.host.enemyFire(this.actor.muzzlePosition(_p).clone(), hit, 'sniper')
    this.onFire(hit)
    this.state = 'cycling'
    this.timer = 1.35
    this.lock = 0
    this.warning = false
    this.warned = false
  }

  get visible(): boolean {
    return !this.actor.hidden && this.actor.alive
  }
}
