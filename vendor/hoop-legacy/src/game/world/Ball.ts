import * as THREE from 'three'
import { COURT } from '../sim/court'
import type { Hoop } from './Hoop'
import { makeBallTextures } from './textures'
import { LAYER_REFLECT } from '../engine/reflection'

export interface BallEvents {
  rim: number
  board: number
  floor: number
  scored: boolean
}

const texCache: Partial<Record<'classic' | 'money', { map: THREE.Texture; bump: THREE.Texture }>> = {}

export function ballMaterial(variant: 'classic' | 'money' = 'classic') {
  if (!texCache[variant]) texCache[variant] = makeBallTextures(variant)
  const t = texCache[variant]!
  return new THREE.MeshStandardMaterial({ map: t.map, bumpMap: t.bump, bumpScale: 1.2, roughness: 0.62, metalness: 0 })
}

let sharedGeo: THREE.SphereGeometry | null = null
export function ballGeometry() {
  if (!sharedGeo) sharedGeo = new THREE.SphereGeometry(COURT.ballRadius, 32, 20)
  return sharedGeo
}

export class BallBody {
  pos = new THREE.Vector3(0, 1, 6)
  vel = new THREE.Vector3()
  radius = COURT.ballRadius
  mesh: THREE.Mesh
  free = false
  spinAxis = new THREE.Vector3(1, 0, 0)
  spinRate = 0
  private prev = new THREE.Vector3()
  private tmp = new THREE.Vector3()
  private rimTmp = { rim: 0, board: 0 }

  constructor(variant: 'classic' | 'money' = 'classic') {
    this.mesh = new THREE.Mesh(ballGeometry(), ballMaterial(variant))
    this.mesh.castShadow = true
    this.mesh.layers.enable(LAYER_REFLECT)
  }

  setVariant(variant: 'classic' | 'money') {
    ;(this.mesh.material as THREE.Material).dispose()
    this.mesh.material = ballMaterial(variant)
  }

  launch(vel: THREE.Vector3, backspin = 9) {
    this.free = true
    this.vel.copy(vel)
    const h = this.tmp.set(vel.x, 0, vel.z)
    if (h.lengthSq() > 1e-4) {
      h.normalize()
      // backspin axis = horizontal direction x up
      this.spinAxis.set(h.z, 0, -h.x).normalize().negate()
      this.spinRate = backspin
    }
  }

  /** Integrates one frame with sub-steps; accumulates collision impacts into `ev`. */
  step(dt: number, hoop: Hoop | null, ev: BallEvents) {
    if (!this.free) return
    const nearHoop = hoop ? this.pos.distanceTo(hoop.center) < 2.2 : false
    const steps = nearHoop ? 8 : 3
    const h = dt / steps
    for (let s = 0; s < steps; s++) {
      this.prev.copy(this.pos)
      this.vel.y -= COURT.gravity * h
      this.pos.addScaledVector(this.vel, h)
      if (hoop) {
        this.rimTmp.rim = 0
        this.rimTmp.board = 0
        hoop.collide(this, h, this.rimTmp)
        if (this.rimTmp.rim > 0) {
          ev.rim = Math.max(ev.rim, this.rimTmp.rim)
          this.spinRate *= 0.6
        }
        if (this.rimTmp.board > 0) ev.board = Math.max(ev.board, this.rimTmp.board)
        const c = hoop.center
        if (this.prev.y >= c.y && this.pos.y < c.y && this.vel.y < 0) {
          const hd = Math.hypot(this.pos.x - c.x, this.pos.z - c.z)
          if (hd < COURT.rimRadius - 0.015) ev.scored = true
        }
      }
      if (this.pos.y < this.radius) {
        this.pos.y = this.radius
        if (this.vel.y < 0) {
          const impact = -this.vel.y
          if (impact > 0.4) ev.floor = Math.max(ev.floor, impact)
          this.vel.y = impact > 0.45 ? impact * 0.74 : 0
          this.vel.x *= 0.93
          this.vel.z *= 0.93
          // convert to rolling spin
          const hs = Math.hypot(this.vel.x, this.vel.z)
          if (hs > 0.05) {
            this.spinAxis.set(this.vel.z / hs, 0, -this.vel.x / hs)
            this.spinRate = hs / this.radius
          }
        }
        if (this.vel.y === 0) {
          const f = Math.exp(-0.9 * h)
          this.vel.x *= f
          this.vel.z *= f
          const hs = Math.hypot(this.vel.x, this.vel.z)
          if (hs > 0.02) this.spinRate = hs / this.radius
          else this.spinRate *= 0.9
        }
      }
      // arena walls
      if (Math.abs(this.pos.x) > 12.5) {
        this.pos.x = Math.sign(this.pos.x) * 12.5
        this.vel.x *= -0.4
      }
      if (this.pos.z < -7.5) {
        this.pos.z = -7.5
        this.vel.z *= -0.4
      }
      if (this.pos.z > 32) {
        this.pos.z = 32
        this.vel.z *= -0.4
      }
    }
  }

  sync(dt: number) {
    this.mesh.position.copy(this.pos)
    if (this.spinRate > 0.01) this.mesh.rotateOnWorldAxis(this.spinAxis, this.spinRate * dt)
  }
}
