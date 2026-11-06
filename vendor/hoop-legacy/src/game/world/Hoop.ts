import * as THREE from 'three'
import { LineSegments2 } from 'three/addons/lines/LineSegments2.js'
import { LineSegmentsGeometry } from 'three/addons/lines/LineSegmentsGeometry.js'
import { LineMaterial } from 'three/addons/lines/LineMaterial.js'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'
import { COURT } from '../sim/court'
import { ShotClockCanvas } from './textures'

const RINGS = 7
const STRANDS = 12
const NET_LEN = 0.44

export interface BallLike {
  pos: THREE.Vector3
  vel: THREE.Vector3
  radius: number
}

class NetSim {
  count = RINGS * STRANDS
  pos = new Float32Array(RINGS * STRANDS * 3)
  prev = new Float32Array(RINGS * STRANDS * 3)
  restLocal = new Float32Array(RINGS * STRANDS * 3)
  cons: number[] = []
  consLen: number[] = []
  draw: number[] = []
  geometry: LineSegmentsGeometry
  material: LineMaterial
  line: LineSegments2
  private buf: Float32Array
  private bufAttr: THREE.InterleavedBuffer
  center: THREE.Vector3
  simulate: boolean
  active = 0

  constructor(center: THREE.Vector3, simulate: boolean, facing: 1 | -1) {
    this.center = center
    this.simulate = simulate
    const idx = (k: number, i: number) => k * STRANDS + ((i + STRANDS) % STRANDS)
    for (let k = 0; k < RINGS; k++) {
      const f = k / (RINGS - 1)
      const r = THREE.MathUtils.lerp(COURT.rimRadius - 0.004, 0.128, Math.pow(f, 0.85))
      const y = -NET_LEN * f
      for (let i = 0; i < STRANDS; i++) {
        const a = ((i + (k % 2) * 0.5) / STRANDS) * Math.PI * 2
        const j = idx(k, i) * 3
        this.restLocal[j] = Math.sin(a) * r
        this.restLocal[j + 1] = y
        this.restLocal[j + 2] = Math.cos(a) * r * facing
      }
    }
    const link = (a: number, b: number, drawIt: boolean) => {
      this.cons.push(a, b)
      const dx = this.restLocal[a * 3] - this.restLocal[b * 3]
      const dy = this.restLocal[a * 3 + 1] - this.restLocal[b * 3 + 1]
      const dz = this.restLocal[a * 3 + 2] - this.restLocal[b * 3 + 2]
      this.consLen.push(Math.hypot(dx, dy, dz))
      if (drawIt) this.draw.push(a, b)
    }
    for (let k = 0; k < RINGS - 1; k++) {
      for (let i = 0; i < STRANDS; i++) {
        link(idx(k, i), idx(k + 1, i), true)
        link(idx(k, i), idx(k + 1, k % 2 === 0 ? i - 1 : i + 1), true)
      }
    }
    for (let k = 1; k < RINGS; k++) for (let i = 0; i < STRANDS; i++) link(idx(k, i), idx(k, i + 1), false)
    this.reset()
    this.geometry = new LineSegmentsGeometry()
    this.buf = new Float32Array(this.draw.length * 3)
    this.writeBuffer()
    this.geometry.setPositions(this.buf)
    const attr = this.geometry.getAttribute('instanceStart') as THREE.InterleavedBufferAttribute
    this.bufAttr = attr.data
    this.buf = this.bufAttr.array as Float32Array
    this.material = new LineMaterial({ color: 0xf7f7f2, linewidth: 1.5, worldUnits: false, transparent: true, opacity: 0.95 })
    this.line = new LineSegments2(this.geometry, this.material)
    this.line.frustumCulled = false
  }

  reset() {
    for (let i = 0; i < this.count; i++) {
      const j = i * 3
      this.pos[j] = this.center.x + this.restLocal[j]
      this.pos[j + 1] = this.center.y + this.restLocal[j + 1]
      this.pos[j + 2] = this.center.z + this.restLocal[j + 2]
    }
    this.prev.set(this.pos)
  }

  private writeBuffer() {
    for (let n = 0; n < this.draw.length; n++) {
      const s = this.draw[n] * 3
      this.buf[n * 3] = this.pos[s]
      this.buf[n * 3 + 1] = this.pos[s + 1]
      this.buf[n * 3 + 2] = this.pos[s + 2]
    }
  }

  update(dt: number, balls: BallLike[], rimDy: number) {
    if (!this.simulate) return
    // sleep when nothing is near and the net has settled
    let near = false
    for (const b of balls) {
      if (Math.abs(b.pos.y - (this.center.y - 0.2)) < 0.9 && Math.hypot(b.pos.x - this.center.x, b.pos.z - this.center.z) < 0.8) near = true
    }
    if (near) this.active = 1.6
    if (this.active <= 0) return
    this.active -= dt
    const steps = 3
    const h = Math.min(dt, 1 / 30) / steps
    const g = -9.8 * h * h
    for (let s = 0; s < steps; s++) {
      for (let i = STRANDS; i < this.count; i++) {
        const j = i * 3
        for (let a = 0; a < 3; a++) {
          const v = (this.pos[j + a] - this.prev[j + a]) * 0.975
          this.prev[j + a] = this.pos[j + a]
          this.pos[j + a] += v + (a === 1 ? g : 0)
        }
      }
      for (let i = 0; i < STRANDS; i++) {
        const j = i * 3
        this.pos[j] = this.center.x + this.restLocal[j]
        this.pos[j + 1] = this.center.y + this.restLocal[j + 1] + rimDy
        this.pos[j + 2] = this.center.z + this.restLocal[j + 2]
      }
      for (let it = 0; it < 4; it++) {
        for (let c = 0; c < this.cons.length; c += 2) {
          const a = this.cons[c]
          const b = this.cons[c + 1]
          const ja = a * 3
          const jb = b * 3
          const dx = this.pos[jb] - this.pos[ja]
          const dy = this.pos[jb + 1] - this.pos[ja + 1]
          const dz = this.pos[jb + 2] - this.pos[ja + 2]
          const d = Math.hypot(dx, dy, dz) || 1e-6
          const rest = this.consLen[c >> 1]
          const diff = (d - rest) / d
          const pa = a < STRANDS
          const pb = b < STRANDS
          const wa = pa ? 0 : pb ? 1 : 0.5
          const wb = pb ? 0 : pa ? 1 : 0.5
          this.pos[ja] += dx * diff * wa
          this.pos[ja + 1] += dy * diff * wa
          this.pos[ja + 2] += dz * diff * wa
          this.pos[jb] -= dx * diff * wb
          this.pos[jb + 1] -= dy * diff * wb
          this.pos[jb + 2] -= dz * diff * wb
        }
        for (const ball of balls) {
          const R = ball.radius + 0.014
          for (let i = STRANDS; i < this.count; i++) {
            const j = i * 3
            const dx = this.pos[j] - ball.pos.x
            const dy = this.pos[j + 1] - ball.pos.y
            const dz = this.pos[j + 2] - ball.pos.z
            const d2 = dx * dx + dy * dy + dz * dz
            if (d2 < R * R) {
              const d = Math.sqrt(d2) || 1e-6
              const k = R / d
              this.pos[j] = ball.pos.x + dx * k
              this.pos[j + 1] = ball.pos.y + dy * k
              this.pos[j + 2] = ball.pos.z + dz * k
            }
          }
        }
      }
    }
    this.writeBuffer()
    this.bufAttr.needsUpdate = true
  }
}

export class Hoop {
  group = new THREE.Group()
  center: THREE.Vector3
  net: NetSim
  shotClock = new ShotClockCanvas()
  private rimPivot = new THREE.Group()
  private boardGroup = new THREE.Group()
  private padMat: THREE.MeshStandardMaterial
  private rimShake = 0
  private rimShakeVel = 0
  private boardShake = 0
  private boardShakeVel = 0
  readonly facing: 1 | -1

  constructor(facing: 1 | -1, z: number, interactive: boolean) {
    this.facing = facing
    this.center = new THREE.Vector3(0, COURT.rimHeight, z)
    this.group.position.set(0, 0, z)
    this.group.rotation.y = facing > 0 ? 0 : Math.PI
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0xdfeef5,
      transparent: true,
      opacity: 0.16,
      roughness: 0.04,
      metalness: 0.1,
      envMapIntensity: 2.2,
      depthWrite: false,
    })
    const boardH = COURT.boardTop - COURT.boardBottom
    const boardY = (COURT.boardTop + COURT.boardBottom) / 2
    const glass = new THREE.Mesh(new THREE.BoxGeometry(COURT.boardHalfWidth * 2, boardH, COURT.boardThickness), glassMat)
    glass.position.set(0, boardY, COURT.boardZ - COURT.boardThickness / 2)
    glass.renderOrder = 2
    this.boardGroup.add(glass)
    // painted border + shooter's square
    const lineMat = new THREE.MeshBasicMaterial({ color: 0xf5f5f5 })
    const frame: THREE.BufferGeometry[] = []
    const bar = (w: number, h: number, x: number, y: number) => {
      const g = new THREE.BoxGeometry(w, h, 0.006)
      g.translate(x, y, COURT.boardZ + 0.002)
      frame.push(g)
    }
    const bw = COURT.boardHalfWidth * 2
    const lw = 0.05
    bar(bw, lw, 0, COURT.boardTop - lw / 2)
    bar(bw, lw, 0, COURT.boardBottom + lw / 2)
    bar(lw, boardH, -COURT.boardHalfWidth + lw / 2, boardY)
    bar(lw, boardH, COURT.boardHalfWidth - lw / 2, boardY)
    const sqB = COURT.rimHeight + 0.02
    const sqT = sqB + 0.457
    bar(0.61, lw, 0, sqT - lw / 2)
    bar(0.61, lw, 0, sqB + lw / 2)
    bar(lw, 0.457, -0.305 + lw / 2, (sqB + sqT) / 2)
    bar(lw, 0.457, 0.305 - lw / 2, (sqB + sqT) / 2)
    // one draw call for the border and shooter's square, not eight
    this.boardGroup.add(new THREE.Mesh(mergeGeometries(frame), lineMat))
    for (const g of frame) g.dispose()
    // edge frame (metal)
    const edgeMat = new THREE.MeshStandardMaterial({ color: 0x1a1c20, roughness: 0.4, metalness: 0.7 })
    const edges = new THREE.Mesh(new THREE.BoxGeometry(bw + 0.04, boardH + 0.04, 0.012), edgeMat)
    edges.position.set(0, boardY, COURT.boardZ - COURT.boardThickness - 0.01)
    this.boardGroup.add(edges)
    this.padMat = new THREE.MeshStandardMaterial({ color: 0x9c2b1b, roughness: 0.55 })
    const pad = new THREE.Mesh(new THREE.BoxGeometry(bw + 0.06, 0.07, 0.08), this.padMat)
    pad.position.set(0, COURT.boardBottom - 0.03, COURT.boardZ - 0.02)
    this.boardGroup.add(pad)
    // shot clock on top of the board
    const scMats = [edgeMat, edgeMat, edgeMat, edgeMat, new THREE.MeshBasicMaterial({ map: this.shotClock.texture, toneMapped: false }), edgeMat]
    const sc = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.3, 0.14), scMats)
    sc.position.set(0, COURT.boardTop + 0.19, COURT.boardZ - 0.07)
    this.boardGroup.add(sc)
    this.group.add(this.boardGroup)

    // rim
    const rimMat = new THREE.MeshStandardMaterial({ color: 0xff4a12, roughness: 0.32, metalness: 0.55, emissive: 0x200500 })
    const rim = new THREE.Mesh(new THREE.TorusGeometry(COURT.rimRadius + COURT.rimTube, COURT.rimTube, 10, 48), rimMat)
    rim.rotation.x = Math.PI / 2
    rim.position.set(0, 0, -COURT.boardZ)
    this.rimPivot.position.set(0, COURT.rimHeight, COURT.boardZ)
    this.rimPivot.add(rim)
    const bracket = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.05, 0.16), rimMat)
    bracket.position.set(0, -0.015, 0.08)
    this.rimPivot.add(bracket)
    const plate = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.2, 0.02), rimMat)
    plate.position.set(0, -0.06, 0.012)
    this.rimPivot.add(plate)
    this.group.add(this.rimPivot)
    rim.castShadow = true
    glass.castShadow = false

    // stanchion (portable arena unit): rounded padded base with a sloped front skirt, a padded upright,
    // and a twin-tube steel boom with diagonal braces out to the board. One mesh per material.
    const baseZ = COURT.baselineZ - 2.35
    const pads: THREE.BufferGeometry[] = []
    const steel: THREE.BufferGeometry[] = []
    const padBox = (w: number, h: number, d: number, r: number, x: number, y: number, z: number, rotX = 0) => {
      const g = new RoundedBoxGeometry(w, h, d, 3, r)
      if (rotX) g.rotateX(rotX)
      g.translate(x, y, z)
      pads.push(g)
    }
    padBox(1.28, 1.02, 2.3, 0.14, 0, 0.51, baseZ - 0.05)
    // the sloped skirt players run into
    padBox(1.24, 0.92, 0.34, 0.12, 0, 0.47, baseZ + 1.12, -0.32)
    const colZ = baseZ - 0.62
    padBox(0.56, 2.5, 0.56, 0.16, 0, 1.02 + 1.25, colZ)
    const tube = (a: THREE.Vector3, b: THREE.Vector3, r: number) => {
      const len = a.distanceTo(b)
      const g = new THREE.CylinderGeometry(r, r, len, 12, 1)
      const mid = a.clone().add(b).multiplyScalar(0.5)
      const dir = b.clone().sub(a).normalize()
      g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir))
      g.translate(mid.x, mid.y, mid.z)
      steel.push(g)
    }
    const boomY = 3.42
    const boardBackZ = COURT.boardZ - COURT.boardThickness - 0.05
    for (const x of [-0.17, 0.17]) {
      // upper boom: column top to the board's back frame
      tube(new THREE.Vector3(x, 3.6, colZ + 0.1), new THREE.Vector3(x, boomY, boardBackZ), 0.058)
      // diagonal brace from the column to under the board
      tube(new THREE.Vector3(x, 2.55, colZ + 0.2), new THREE.Vector3(x, COURT.boardBottom - 0.02, boardBackZ - 0.25), 0.042)
      // vertical tie at the board end
      tube(new THREE.Vector3(x, COURT.boardBottom - 0.06, boardBackZ - 0.22), new THREE.Vector3(x, boomY + 0.04, boardBackZ - 0.06), 0.036)
    }
    // cross bars and the board mounting plate
    tube(new THREE.Vector3(-0.2, boomY + 0.02, boardBackZ - 0.08), new THREE.Vector3(0.2, boomY + 0.02, boardBackZ - 0.08), 0.04)
    tube(new THREE.Vector3(-0.2, COURT.boardBottom - 0.04, boardBackZ - 0.24), new THREE.Vector3(0.2, COURT.boardBottom - 0.04, boardBackZ - 0.24), 0.034)
    const plateG = new THREE.BoxGeometry(0.62, 0.5, 0.05)
    plateG.translate(0, (COURT.boardBottom + boomY) / 2 + 0.05, boardBackZ - 0.01)
    steel.push(plateG)
    // padded sleeve where the boom leaves the column
    padBox(0.5, 0.42, 0.7, 0.12, 0, 3.52, colZ + 0.55)
    const base = new THREE.Mesh(mergeGeometries(pads), this.padMat)
    base.castShadow = true
    base.receiveShadow = true
    this.group.add(base)
    for (const g of pads) g.dispose()
    const metal = new THREE.MeshStandardMaterial({ color: 0x2a2d34, roughness: 0.38, metalness: 0.75 })
    const boom = new THREE.Mesh(mergeGeometries(steel), metal)
    boom.castShadow = true
    this.group.add(boom)
    for (const g of steel) g.dispose()

    this.net = new NetSim(this.center.clone(), interactive, facing)
  }

  addTo(scene: THREE.Scene) {
    scene.add(this.group)
    scene.add(this.net.line)
  }

  setPadColor(hex: string) {
    this.padMat.color.set(hex)
  }

  setResolution(w: number, h: number) {
    this.net.material.resolution.set(w, h)
  }

  hitRim(intensity: number) {
    this.rimShakeVel += Math.min(3, intensity) * 0.9
  }

  dunk() {
    this.rimShakeVel -= 7
    this.boardShakeVel += 1.6
    this.net.active = 2
  }

  /** Rim + backboard collision for a ball. Returns impact speeds (0 if none). */
  collide(b: BallLike, dt: number, out: { rim: number; board: number }) {
    const c = this.center
    const R = COURT.rimRadius + COURT.rimTube
    const r = COURT.rimTube
    const dx = b.pos.x - c.x
    const dz = b.pos.z - c.z
    const hd = Math.hypot(dx, dz)
    const nx = hd > 1e-5 ? dx / hd : 1
    const nz = hd > 1e-5 ? dz / hd : 0
    const qx = c.x + nx * R
    const qz = c.z + nz * R
    let ex = b.pos.x - qx
    let ey = b.pos.y - c.y
    let ez = b.pos.z - qz
    let dist = Math.hypot(ex, ey, ez)
    const minD = b.radius + r
    if (dist < minD) {
      if (dist < 1e-6) {
        ex = 0
        ey = 1
        ez = 0
        dist = 1
      }
      const inv = 1 / dist
      const n = new THREE.Vector3(ex * inv, ey * inv, ez * inv)
      b.pos.set(qx + n.x * minD, c.y + n.y * minD, qz + n.z * minD)
      const vn = b.vel.dot(n)
      if (vn < 0) {
        b.vel.addScaledVector(n, -(1 + 0.58) * vn)
        // tangential friction
        const vn2 = b.vel.dot(n)
        const tx = b.vel.x - n.x * vn2
        const ty = b.vel.y - n.y * vn2
        const tz = b.vel.z - n.z * vn2
        b.vel.set(tx * 0.84 + n.x * vn2, ty * 0.84 + n.y * vn2, tz * 0.84 + n.z * vn2)
        out.rim = Math.max(out.rim, -vn)
      }
    }
    // backboard (front face toward +z for the main hoop)
    const fz = c.z + COURT.boardZ * this.facing
    const front = (b.pos.z - fz) * this.facing
    if (
      front < b.radius &&
      front > -0.25 &&
      Math.abs(b.pos.x - c.x) < COURT.boardHalfWidth + b.radius * 0.4 &&
      b.pos.y > COURT.boardBottom - b.radius * 0.4 &&
      b.pos.y < COURT.boardTop + b.radius * 0.4
    ) {
      b.pos.z = fz + b.radius * this.facing
      const vz = b.vel.z * this.facing
      if (vz < 0) {
        b.vel.z = -b.vel.z * 0.62
        b.vel.x *= 0.88
        b.vel.y *= 0.9
        out.board = Math.max(out.board, -vz)
      }
    }
    // net drag while the ball falls through
    if (hd < COURT.rimRadius && b.pos.y < c.y && b.pos.y > c.y - NET_LEN - 0.05) {
      const k = Math.exp(-4.5 * dt)
      b.vel.x *= k
      b.vel.z *= k
      b.vel.y *= Math.exp(-1.6 * dt)
      // pull toward the net center so it drops cleanly
      b.vel.x -= dx * 6 * dt
      b.vel.z -= dz * 6 * dt
    }
  }

  update(dt: number, balls: BallLike[]) {
    const k = 160
    const damp = 9
    this.rimShakeVel += (-k * this.rimShake - damp * this.rimShakeVel) * dt
    this.rimShake += this.rimShakeVel * dt
    this.rimPivot.rotation.x = this.rimShake * 0.06
    this.boardShakeVel += (-220 * this.boardShake - 7 * this.boardShakeVel) * dt
    this.boardShake += this.boardShakeVel * dt
    this.boardGroup.rotation.x = this.boardShake * 0.012
    this.net.update(dt, balls, -this.rimShake * 0.06 * Math.abs(COURT.boardZ))
  }
}
