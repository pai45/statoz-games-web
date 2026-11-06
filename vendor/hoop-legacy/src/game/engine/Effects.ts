import * as THREE from 'three'
import { makeSoftDotTexture } from '../world/textures'

const CONFETTI = 320
const TRAIL = 28
/** embers per fire aura, and how many auras can burn at once */
const EMBERS = 70
const AURAS = 3

interface Aura {
  key: string
  source: () => THREE.Vector3 | null
  /** 0..1 fade (auras ease in and burn out instead of popping) */
  level: number
  on: boolean
}

export class Effects {
  group = new THREE.Group()
  private confetti: THREE.InstancedMesh
  private cPos = new Float32Array(CONFETTI * 3)
  private cVel = new Float32Array(CONFETTI * 3)
  private cRot = new Float32Array(CONFETTI * 3)
  private confettiTime = 0
  private trail: THREE.Points
  private trailPos: Float32Array
  private trailCol: Float32Array
  private trailSource: (() => THREE.Vector3 | null) | null = null
  private trailTime = 0
  private trailColor = new THREE.Color('#3dff8a')
  private embers: THREE.Points
  private ePos = new Float32Array(EMBERS * AURAS * 3)
  private eVel = new Float32Array(EMBERS * AURAS * 3)
  private eCol = new Float32Array(EMBERS * AURAS * 4)
  private eLife = new Float32Array(EMBERS * AURAS)
  private eMax = new Float32Array(EMBERS * AURAS)
  private auras: (Aura | null)[] = Array.from({ length: AURAS }, () => null)
  private emberSpawn = new Float32Array(AURAS)
  private m = new THREE.Matrix4()
  private q = new THREE.Quaternion()
  private e = new THREE.Euler()
  private s = new THREE.Vector3(1, 1, 1)
  private v = new THREE.Vector3()

  constructor() {
    const geo = new THREE.PlaneGeometry(0.07, 0.11)
    const mat = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, toneMapped: false })
    this.confetti = new THREE.InstancedMesh(geo, mat, CONFETTI)
    this.confetti.visible = false
    this.confetti.frustumCulled = false
    const c = new THREE.Color()
    for (let i = 0; i < CONFETTI; i++) this.confetti.setColorAt(i, c.setHSL(Math.random(), 0.9, 0.6))
    this.group.add(this.confetti)

    const tg = new THREE.BufferGeometry()
    this.trailPos = new Float32Array(TRAIL * 3)
    this.trailCol = new Float32Array(TRAIL * 4)
    tg.setAttribute('position', new THREE.BufferAttribute(this.trailPos, 3))
    tg.setAttribute('color', new THREE.BufferAttribute(this.trailCol, 4))
    const tm = new THREE.PointsMaterial({
      size: 0.42,
      map: makeSoftDotTexture(),
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
      toneMapped: false,
    })
    this.trail = new THREE.Points(tg, tm)
    this.trail.frustumCulled = false
    this.trail.visible = false
    this.group.add(this.trail)

    // fire auras: embers licking up off a player who is on fire
    const eg = new THREE.BufferGeometry()
    eg.setAttribute('position', new THREE.BufferAttribute(this.ePos, 3))
    eg.setAttribute('color', new THREE.BufferAttribute(this.eCol, 4))
    const em = new THREE.PointsMaterial({
      size: 0.24,
      map: makeSoftDotTexture(),
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
      toneMapped: false,
    })
    this.embers = new THREE.Points(eg, em)
    this.embers.frustumCulled = false
    this.embers.visible = false
    this.group.add(this.embers)
  }

  /** Lights (or puts out) a fire aura that follows `source` (an athlete's root). */
  setFire(key: string, source: (() => THREE.Vector3 | null) | null, on: boolean) {
    let slot = this.auras.findIndex((a) => a?.key === key)
    if (on && source) {
      if (slot < 0) slot = this.auras.findIndex((a) => !a || (!a.on && a.level <= 0))
      if (slot < 0) return
      const prev = this.auras[slot]
      this.auras[slot] = { key, source, level: prev?.key === key ? prev.level : 0, on: true }
      this.embers.visible = true
    } else if (slot >= 0) {
      this.auras[slot]!.on = false
    }
  }

  clearFires() {
    this.auras.fill(null)
    this.eLife.fill(0)
    this.eCol.fill(0)
    this.embers.visible = false
  }


  burstConfetti(center: THREE.Vector3, colors: string[]) {
    const c = new THREE.Color()
    for (let i = 0; i < CONFETTI; i++) {
      this.cPos[i * 3] = center.x + (Math.random() - 0.5) * 14
      this.cPos[i * 3 + 1] = center.y + 6 + Math.random() * 6
      this.cPos[i * 3 + 2] = center.z + (Math.random() - 0.5) * 12
      this.cVel[i * 3] = (Math.random() - 0.5) * 1.5
      this.cVel[i * 3 + 1] = -0.6 - Math.random() * 1.2
      this.cVel[i * 3 + 2] = (Math.random() - 0.5) * 1.5
      this.cRot[i * 3] = Math.random() * 6
      this.cRot[i * 3 + 1] = Math.random() * 6
      this.cRot[i * 3 + 2] = Math.random() * 6
      c.set(colors[i % colors.length])
      if (Math.random() < 0.25) c.set('#ffffff')
      this.confetti.setColorAt(i, c)
    }
    if (this.confetti.instanceColor) this.confetti.instanceColor.needsUpdate = true
    this.confettiTime = 7
    this.confetti.visible = true
  }

  startTrail(source: () => THREE.Vector3 | null, color = '#3dff8a', duration = 1.6) {
    this.trailSource = source
    this.trailTime = duration
    this.trailColor.set(color)
    const p = source()
    if (p) for (let i = 0; i < TRAIL; i++) this.trailPos.set([p.x, p.y, p.z], i * 3)
    this.trail.visible = true
  }

  stopTrail() {
    this.trailSource = null
    this.trailTime = 0
    this.trail.visible = false
  }

  private updateEmbers(dt: number) {
    let any = false
    for (let s = 0; s < AURAS; s++) {
      const a = this.auras[s]
      if (a) {
        a.level = Math.max(0, Math.min(1, a.level + (a.on ? dt * 2.5 : -dt * 1.2)))
        if (!a.on && a.level <= 0) this.auras[s] = null
      }
      const src = a?.source() ?? null
      // spawn: about 90 embers per second at full heat, from the feet up to the hands
      if (a && src && a.level > 0) {
        this.emberSpawn[s] += dt * 90 * a.level
        while (this.emberSpawn[s] >= 1) {
          this.emberSpawn[s] -= 1
          const base = s * EMBERS
          let i = base
          for (let k = 0; k < EMBERS; k++) if (this.eLife[base + k] <= 0) {
            i = base + k
            break
          }
          const ang = Math.random() * Math.PI * 2
          const r = 0.18 + Math.random() * 0.22
          const h = Math.random() < 0.6 ? Math.random() * 0.35 : 0.6 + Math.random() * 1.2
          this.ePos[i * 3] = src.x + Math.cos(ang) * r
          this.ePos[i * 3 + 1] = src.y + h
          this.ePos[i * 3 + 2] = src.z + Math.sin(ang) * r
          this.eVel[i * 3] = Math.cos(ang) * 0.25
          this.eVel[i * 3 + 1] = 0.8 + Math.random() * 1.1
          this.eVel[i * 3 + 2] = Math.sin(ang) * 0.25
          this.eMax[i] = 0.45 + Math.random() * 0.45
          this.eLife[i] = this.eMax[i]
        }
      }
      for (let k = 0; k < EMBERS; k++) {
        const i = s * EMBERS + k
        if (this.eLife[i] <= 0) {
          this.eCol[i * 4 + 3] = 0
          this.eCol[i * 4] = this.eCol[i * 4 + 1] = this.eCol[i * 4 + 2] = 0
          continue
        }
        any = true
        this.eLife[i] -= dt
        const j = i * 3
        // flames lick upward and curl
        this.eVel[j] += Math.sin(this.eLife[i] * 17 + i) * 1.2 * dt
        this.eVel[j + 2] += Math.cos(this.eLife[i] * 13 + i) * 1.2 * dt
        this.ePos[j] += this.eVel[j] * dt
        this.ePos[j + 1] += this.eVel[j + 1] * dt
        this.ePos[j + 2] += this.eVel[j + 2] * dt
        const u = 1 - Math.max(0, this.eLife[i]) / this.eMax[i]
        // white-yellow core cooling to orange and deep red
        const fade = Math.sin(Math.min(1, u * 1.1) * Math.PI) * (a ? 0.35 + 0.65 * a.level : 0.6)
        this.eCol[i * 4] = 1.0 * fade
        this.eCol[i * 4 + 1] = (0.85 - 0.65 * u) * fade
        this.eCol[i * 4 + 2] = Math.max(0, 0.35 - u) * fade
        this.eCol[i * 4 + 3] = fade
      }
    }
    if (any) {
      const g = this.embers.geometry
      g.getAttribute('position').needsUpdate = true
      g.getAttribute('color').needsUpdate = true
    }
    this.embers.visible = any || this.auras.some((a) => !!a)
  }

  update(dt: number) {
    if (this.embers.visible) this.updateEmbers(dt)
    if (this.confettiTime > 0) {
      this.confettiTime -= dt
      for (let i = 0; i < CONFETTI; i++) {
        const j = i * 3
        this.cVel[j] += Math.sin(this.confettiTime * 3 + i) * 0.6 * dt
        this.cPos[j] += this.cVel[j] * dt
        this.cPos[j + 1] += this.cVel[j + 1] * dt
        this.cPos[j + 2] += this.cVel[j + 2] * dt
        if (this.cPos[j + 1] < 0.02) this.cPos[j + 1] = 0.02
        this.cRot[j] += dt * 4
        this.cRot[j + 1] += dt * 3
        this.e.set(this.cRot[j], this.cRot[j + 1], this.cRot[j + 2])
        this.q.setFromEuler(this.e)
        this.v.set(this.cPos[j], this.cPos[j + 1], this.cPos[j + 2])
        this.m.compose(this.v, this.q, this.s)
        this.confetti.setMatrixAt(i, this.m)
      }
      this.confetti.instanceMatrix.needsUpdate = true
      if (this.confettiTime <= 0) this.confetti.visible = false
    }
    if (this.trailSource && this.trailTime > 0) {
      this.trailTime -= dt
      const p = this.trailSource()
      for (let i = TRAIL - 1; i > 0; i--) {
        this.trailPos[i * 3] = this.trailPos[(i - 1) * 3]
        this.trailPos[i * 3 + 1] = this.trailPos[(i - 1) * 3 + 1]
        this.trailPos[i * 3 + 2] = this.trailPos[(i - 1) * 3 + 2]
      }
      if (p) {
        this.trailPos[0] = p.x
        this.trailPos[1] = p.y
        this.trailPos[2] = p.z
      }
      const fade = Math.min(1, this.trailTime / 0.5)
      for (let i = 0; i < TRAIL; i++) {
        const a = (1 - i / TRAIL) * fade
        this.trailCol[i * 4] = this.trailColor.r * a
        this.trailCol[i * 4 + 1] = this.trailColor.g * a
        this.trailCol[i * 4 + 2] = this.trailColor.b * a
        this.trailCol[i * 4 + 3] = a
      }
      const g = this.trail.geometry
      g.getAttribute('position').needsUpdate = true
      g.getAttribute('color').needsUpdate = true
      if (this.trailTime <= 0) this.stopTrail()
    }
  }
}
