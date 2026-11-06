// First-person rifle: procedural model, camo furniture, hands, and procedural animation.
import * as THREE from 'three'

import { MeshBuilder, createCamoTexture, createNoiseTexture, createSpriteTexture } from './builder.ts'
import type { CamoSpec, RifleId, RifleSpec } from './data.ts'
import { clamp, damp, noise1 } from './noise.ts'

interface RifleShape {
  stock: number
  receiver: number
  forend: number
  barrelR: number
  scopeLen: number
  objR: number
  tubeR: number
  brake: 'none' | 'slim' | 'big'
  suppressor: boolean
  magH: number
  bulk: number
  thumbhole: boolean
}

const SHAPES: Record<RifleId, RifleShape> = {
  ranger: { stock: 0.31, receiver: 0.23, forend: 0.31, barrelR: 0.0105, scopeLen: 0.36, objR: 0.026, tubeR: 0.0152, brake: 'none', suppressor: false, magH: 0.065, bulk: 1, thumbhole: false },
  whisper: { stock: 0.27, receiver: 0.21, forend: 0.24, barrelR: 0.009, scopeLen: 0.32, objR: 0.025, tubeR: 0.0152, brake: 'none', suppressor: true, magH: 0.085, bulk: 0.95, thumbhole: false },
  longbow: { stock: 0.34, receiver: 0.26, forend: 0.35, barrelR: 0.0122, scopeLen: 0.4, objR: 0.029, tubeR: 0.017, brake: 'slim', suppressor: false, magH: 0.07, bulk: 1.05, thumbhole: true },
  anvil: { stock: 0.36, receiver: 0.31, forend: 0.37, barrelR: 0.0165, scopeLen: 0.42, objR: 0.032, tubeR: 0.017, brake: 'big', suppressor: false, magH: 0.1, bulk: 1.22, thumbhole: false },
}

export interface RifleModel {
  root: THREE.Group
  bolt: THREE.Group
  magazine: THREE.Group
  muzzle: THREE.Object3D
  /** Distance from the grip to the scope's eyepiece along +Z. */
  eyeZ: number
  scopeY: number
  dispose(): void
}

let noiseMap: THREE.Texture | null = null

function mesh(builder: MeshBuilder, material: THREE.Material): THREE.Mesh {
  const object = new THREE.Mesh(builder.build(), material)
  object.castShadow = false
  object.receiveShadow = false
  return object
}

export function buildRifleModel(rifle: RifleSpec, camo: CamoSpec, withHands: boolean): RifleModel {
  const s = SHAPES[rifle.id]
  const L = rifle.barrelLength
  const camoTexture = createCamoTexture(camo, 256)
  noiseMap ??= createNoiseTexture(128, 41, 0.82, 1)
  const materials = {
    furniture: new THREE.MeshStandardMaterial({ map: camoTexture, roughness: camo.pattern === 'damascus' ? 0.45 : 0.78, metalness: camo.pattern === 'damascus' ? 0.45 : 0.04 }),
    metal: new THREE.MeshStandardMaterial({ vertexColors: true, map: noiseMap, roughness: 0.4, metalness: 0.85 }),
    scope: new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.5, metalness: 0.55 }),
    rubber: new THREE.MeshStandardMaterial({ color: '#151515', roughness: 0.92 }),
    glass: new THREE.MeshStandardMaterial({ color: '#0e1d29', roughness: 0.04, metalness: 1, envMapIntensity: 1.6 }),
    glove: new THREE.MeshStandardMaterial({ vertexColors: true, map: noiseMap, roughness: 0.95 }),
  }
  const furniture = new MeshBuilder(5)
  const metal = new MeshBuilder(6)
  const scope = new MeshBuilder(6)
  const rubber = new MeshBuilder(6)
  const glass = new MeshBuilder(6)
  const glove = new MeshBuilder(6)
  const white = '#ffffff'
  const steel = '#2c2e30'
  const dark = '#1f2122'
  const b = s.bulk
  const recv = s.receiver
  const front = -(recv + s.forend)
  // Stock and grip.
  furniture.box(0, -0.012 * b, s.stock / 2 + 0.01, 0.042 * b, 0.105 * b, s.stock, white)
  furniture.box(0, 0.052 * b, s.stock * 0.55, 0.036 * b, 0.032 * b, s.stock * 0.42, white)
  if (s.thumbhole) furniture.box(0, -0.075 * b, s.stock * 0.6, 0.04 * b, 0.03 * b, s.stock * 0.6, white)
  rubber.box(0, -0.012 * b, s.stock + 0.022, 0.046 * b, 0.122 * b, 0.026, white)
  furniture.boxEuler(0, -0.072 * b, 0.028, 0.034 * b, 0.1 * b, 0.046 * b, white, 0.38, 0, 0)
  // Receiver, rail and action.
  metal.box(0, 0.012 * b, -recv / 2 + 0.02, 0.046 * b, 0.05 * b, recv, steel)
  metal.box(0, 0.044 * b, -recv / 2 + 0.01, 0.024, 0.012, recv + 0.05, '#252729')
  for (let i = 0; i < 9; i += 1) metal.box(0, 0.051 * b, 0.02 - i * ((recv + 0.03) / 9), 0.026, 0.004, 0.006, '#17191a')
  metal.box(0, -0.03 * b, -0.03, 0.006, 0.026, 0.06, dark)
  metal.box(0, -0.048 * b, -0.04, 0.02, 0.006, 0.075, dark)
  // Forend with accessory slots.
  furniture.box(0, -0.002 * b, (-recv + front) / 2, 0.052 * b, 0.058 * b, s.forend, white)
  for (let i = 0; i < 4; i += 1) metal.box(0.0265 * b, -0.002 * b, -recv - 0.05 - i * (s.forend / 5), 0.002, 0.014, 0.035, '#111213')
  // Barrel and muzzle.
  const muzzleZ = -(recv + L)
  metal.tube(0, 0.012 * b, -recv + 0.01, 0, 0.012 * b, muzzleZ, s.barrelR, steel, 10)
  if (s.suppressor) {
    metal.tube(0, 0.012 * b, -recv - 0.04, 0, 0.012 * b, muzzleZ - 0.06, 0.022, '#2a2b2a', 14)
    for (let i = 0; i < 6; i += 1) metal.tube(0, 0.012 * b, muzzleZ - 0.06 + i * 0.05, 0, 0.012 * b, muzzleZ - 0.058 + i * 0.05, 0.0225, '#1a1b1b', 14)
  } else if (s.brake === 'slim') {
    metal.tube(0, 0.012 * b, muzzleZ + 0.01, 0, 0.012 * b, muzzleZ - 0.07, s.barrelR * 1.55, '#232425', 10)
    for (let i = 0; i < 3; i += 1) metal.box(0, 0.012 * b, muzzleZ - 0.012 - i * 0.02, s.barrelR * 3.3, 0.006, 0.008, '#0d0d0d')
  } else if (s.brake === 'big') {
    metal.box(0, 0.012 * b, muzzleZ - 0.045, 0.05, 0.036, 0.1, '#262728')
    for (let i = 0; i < 3; i += 1) metal.box(0, 0.012 * b, muzzleZ - 0.015 - i * 0.03, 0.054, 0.024, 0.014, '#0c0c0c')
  }
  const muzzleEnd = s.suppressor ? muzzleZ - 0.06 : s.brake === 'big' ? muzzleZ - 0.1 : s.brake === 'slim' ? muzzleZ - 0.07 : muzzleZ
  // Folded bipod.
  for (const side of [-1, 1]) metal.tube(side * 0.012, -0.035 * b, front + 0.02, side * 0.014, -0.032 * b, front + 0.2, 0.0055, '#202122', 6)
  metal.box(0, -0.03 * b, front + 0.03, 0.04, 0.018, 0.03, '#202122')
  // Optic: 30 mm class tube with bells, turrets, rings and lenses.
  const scopeY = 0.077 * b
  const eyeZ = 0.075
  const objZ = eyeZ - s.scopeLen
  scope.tube(0, scopeY, eyeZ - 0.07, 0, scopeY, objZ + 0.09, s.tubeR, '#1b1c1d', 18)
  scope.cylinder(0, scopeY, eyeZ, 0.02, 0.075, '#1d1e1f', 18, 0.92, -Math.PI / 2)
  // Objective bell: wide at the front (objZ), tapering back into the tube.
  scope.cylinder(0, scopeY, objZ, s.objR, 0.1, '#1b1c1d', 20, s.tubeR / s.objR, Math.PI / 2)
  scope.cylinder(0, scopeY, objZ - 0.03, s.objR + 0.001, 0.035, '#171819', 20, 1, Math.PI / 2)
  scope.cylinder(0, scopeY + s.tubeR, -0.11 + eyeZ * 0.2, 0.013, 0.026, '#202122', 14)
  scope.cylinder(s.tubeR, scopeY, -0.11 + eyeZ * 0.2, 0.012, 0.024, '#202122', 14, 1, 0, -Math.PI / 2)
  scope.cylinder(-s.tubeR, scopeY, -0.1 + eyeZ * 0.2, 0.009, 0.018, '#202122', 12, 1, 0, Math.PI / 2)
  for (let i = 0; i < 14; i += 1) {
    const a = (i / 14) * Math.PI * 2
    scope.box(Math.cos(a) * 0.0135, scopeY + s.tubeR + 0.026, -0.11 + eyeZ * 0.2 + Math.sin(a) * 0.0135, 0.002, 0.003, 0.002, '#7f8285')
  }
  for (const z of [-0.02, -recv + 0.05]) {
    scope.box(0, (scopeY + 0.044 * b) / 2 + 0.004, z, 0.03, scopeY - 0.044 * b + 0.01, 0.022, '#1e1f20')
    scope.cylinder(0, scopeY, z + 0.011, s.tubeR + 0.003, 0.022, '#1e1f20', 16, 1, -Math.PI / 2)
  }
  glass.cylinder(0, scopeY, objZ - 0.026, s.objR - 0.003, 0.004, white, 20, 1, Math.PI / 2)
  glass.cylinder(0, scopeY, eyeZ + 0.002, 0.0175, 0.003, white, 18, 1, -Math.PI / 2)
  // Hands and sleeves.
  if (withHands) {
    const g = '#2b2d29'
    const sleeve = '#55583f'
    glove.boxEuler(0.004, -0.07 * b, 0.035, 0.05, 0.085, 0.09, g, 0.38, 0, 0)
    for (let i = 0; i < 3; i += 1) glove.boxEuler(-0.028, -0.055 * b - i * 0.022, 0.012, 0.022, 0.018, 0.05, g, 0.3, 0.25, 0)
    glove.boxEuler(-0.02, 0.01, -0.02, 0.018, 0.018, 0.06, g, -0.1, 0.25, 0)
    glove.tube(0.012, -0.095 * b, 0.07, 0.07, -0.2, 0.36, 0.04, sleeve, 10)
    glove.tube(0.07, -0.2, 0.36, 0.11, -0.26, 0.6, 0.05, sleeve, 10)
    const lz = -recv - s.forend * 0.55
    glove.box(0, -0.052 * b, lz, 0.062, 0.03, 0.095, g)
    for (const side of [-1, 1]) glove.box(side * 0.031 * b, -0.025 * b, lz, 0.012, 0.045, 0.085, g)
    glove.tube(-0.01, -0.07 * b, lz + 0.03, -0.09, -0.19, lz + 0.26, 0.038, sleeve, 10)
    glove.tube(-0.09, -0.19, lz + 0.26, -0.15, -0.27, lz + 0.5, 0.047, sleeve, 10)
  }
  const root = new THREE.Group()
  root.add(mesh(furniture, materials.furniture), mesh(metal, materials.metal), mesh(scope, materials.scope), mesh(rubber, materials.rubber), mesh(glass, materials.glass))
  if (withHands) root.add(mesh(glove, materials.glove))
  // Bolt handle (or charging handle on semis) on its own pivot.
  const bolt = new THREE.Group()
  bolt.position.set(0.024 * b, 0.022 * b, -0.035)
  const boltBuilder = new MeshBuilder(6)
  if (rifle.action === 'bolt') {
    boltBuilder.tube(0, 0, 0, 0.05, -0.022, 0.01, 0.0055, '#3a3c3e', 8)
    boltBuilder.sphere(0.054, -0.024, 0.012, 0.012, 0.012, 0.012, '#2a2c2e')
  } else {
    boltBuilder.box(0.01, 0, 0, 0.02, 0.012, 0.03, '#2a2c2e')
  }
  bolt.add(mesh(boltBuilder, materials.metal))
  root.add(bolt)
  const magazine = new THREE.Group()
  const magBuilder = new MeshBuilder(6)
  magBuilder.box(0, -0.045 * b - s.magH / 2, -0.12, 0.036 * b, s.magH, 0.085, '#232526')
  magBuilder.box(0, -0.045 * b - s.magH, -0.12, 0.04 * b, 0.01, 0.09, '#1a1b1c')
  magazine.add(mesh(magBuilder, materials.metal))
  root.add(magazine)
  const muzzle = new THREE.Object3D()
  muzzle.position.set(0, 0.012 * b, muzzleEnd - 0.02)
  root.add(muzzle)
  return {
    root,
    bolt,
    magazine,
    muzzle,
    eyeZ,
    scopeY,
    dispose() {
      root.traverse((object) => {
        const m = object as THREE.Mesh
        if (m.geometry) m.geometry.dispose()
      })
      for (const material of Object.values(materials)) material.dispose()
      camoTexture.dispose()
    },
  }
}

// ---------------------------------------------------------------------------

export interface ViewInput {
  scope: number
  duck: number
  lookX: number
  lookY: number
  time: number
  breath: number
}

const REST = new THREE.Vector3(0.135, -0.158, -0.33)
const REST_ROT = new THREE.Euler(0.03, 0.07, 0.0)

export class RifleView {
  readonly scene = new THREE.Scene()
  readonly camera = new THREE.PerspectiveCamera(46, 1, 0.01, 10)
  private readonly holder = new THREE.Group()
  private model: RifleModel | null = null
  private rifle: RifleSpec | null = null
  private readonly flash: THREE.Sprite
  private readonly flashLight = new THREE.PointLight('#ffb766', 0, 3, 2)
  private readonly key = new THREE.DirectionalLight('#ffffff', 1.4)
  private readonly fill = new THREE.HemisphereLight('#ffffff', '#3b3631', 1.25)
  private readonly rim = new THREE.DirectionalLight('#c9d8ff', 0.9)
  private readonly brass: THREE.Mesh
  private brassVel = new THREE.Vector3()
  private brassLife = 0
  private recoil = 0
  private recoilVel = 0
  private boltTime = -1
  private boltDuration = 1
  private reloadTime = -1
  private reloadDuration = 1
  private flashTime = 0
  private swayX = 0
  private swayY = 0
  visible = true

  constructor() {
    this.camera.position.set(0, 0, 0)
    this.scene.add(this.camera, this.key, this.fill, this.rim, this.holder)
    // Key light from the window ahead, rim from the room behind the shooter.
    this.key.position.set(0.4, 1, -1.2)
    this.rim.position.set(-0.8, 0.6, 1.2)
    this.flash = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: createSpriteTexture('flash', 128), color: '#ffd08a', blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }),
    )
    this.flash.visible = false
    this.flashLight.position.set(0.1, -0.05, -0.8)
    this.scene.add(this.flashLight)
    this.brass = new THREE.Mesh(new THREE.CylinderGeometry(0.0055, 0.0055, 0.05, 8), new THREE.MeshStandardMaterial({ color: '#c79a45', metalness: 0.9, roughness: 0.3 }))
    this.brass.visible = false
    this.scene.add(this.brass)
  }

  setLoadout(rifle: RifleSpec, camo: CamoSpec): void {
    if (this.model) {
      this.holder.remove(this.model.root)
      this.model.dispose()
    }
    this.rifle = rifle
    this.model = buildRifleModel(rifle, camo, true)
    this.holder.add(this.model.root)
    this.model.muzzle.add(this.flash)
    this.flash.scale.setScalar(rifle.suppressed ? 0.08 : 0.22 * (rifle.id === 'anvil' ? 1.5 : 1))
    this.boltTime = -1
    this.reloadTime = -1
  }

  setLighting(sky: THREE.Color, ground: THREE.Color, keyColor: THREE.Color, keyIntensity: number, env: THREE.Texture | null, envIntensity: number): void {
    this.fill.color.copy(sky)
    this.fill.groundColor.copy(ground)
    this.key.color.copy(keyColor)
    this.key.intensity = keyIntensity
    this.scene.environment = env
    this.scene.environmentIntensity = envIntensity
  }

  setAspect(aspect: number): void {
    this.camera.aspect = aspect
    this.camera.updateProjectionMatrix()
  }

  fire(): void {
    this.recoilVel += 9 * (this.rifle?.recoil ?? 1)
    if (!this.rifle?.suppressed || this.rifle.id === 'whisper') {
      this.flashTime = this.rifle?.suppressed ? 0.03 : 0.055
      this.flash.material.rotation = Math.random() * Math.PI
    }
    if (this.rifle?.action === 'semi') this.ejectBrass()
  }

  cycle(duration: number): void {
    this.boltTime = 0
    this.boltDuration = duration
  }

  reload(duration: number): void {
    this.reloadTime = 0
    this.reloadDuration = duration
  }

  get cycling(): boolean {
    return this.boltTime >= 0
  }

  private ejectBrass(): void {
    if (!this.model) return
    this.model.bolt.getWorldPosition(this.brass.position)
    this.brassVel.set(0.9 + Math.random() * 0.4, 0.9 + Math.random() * 0.3, 0.25)
    this.brassLife = 0.7
    this.brass.visible = true
  }

  update(dt: number, input: ViewInput): void {
    const model = this.model
    if (!model || !this.rifle) return
    // Recoil spring, sub-stepped for stability at low frame rates.
    const steps = Math.max(1, Math.ceil(dt / (1 / 240)))
    for (let i = 0; i < steps; i += 1) {
      const h = dt / steps
      this.recoilVel += (-this.recoil * 160 - this.recoilVel * 18) * h
      this.recoil += this.recoilVel * h
    }
    // Look-lag sway.
    this.swayX += (clamp(-input.lookX * 0.0018, -0.05, 0.05) - this.swayX) * damp(10, dt)
    this.swayY += (clamp(input.lookY * 0.0018, -0.05, 0.05) - this.swayY) * damp(10, dt)
    const scope = THREE.MathUtils.smoothstep(input.scope, 0, 1)
    // Eyepiece settles ~9 cm in front of the eye.
    const aim = new THREE.Vector3(0, -model.scopeY, -model.eyeZ - 0.09)
    const position = REST.clone().lerp(aim, scope)
    const breathe = Math.sin(input.time * 1.6) * 0.003 * (1 - scope * 0.7) * input.breath
    position.y += breathe - input.duck * 0.32
    position.x += this.swayX * (1 - scope * 0.8)
    position.z += this.recoil * 0.045
    const rotation = new THREE.Euler(
      THREE.MathUtils.lerp(REST_ROT.x, 0, scope) + this.recoil * 0.05 + this.swayY - input.duck * 0.5,
      THREE.MathUtils.lerp(REST_ROT.y, 0, scope) + this.swayX * 0.6,
      input.duck * 0.35,
    )
    // Bolt cycle: lift, pull, push, lower, with a cant of the rifle.
    let cant = 0
    if (this.boltTime >= 0) {
      this.boltTime += dt
      const u = this.boltTime / this.boltDuration
      const bolt = model.bolt
      if (this.rifle.action === 'bolt') {
        const lift = THREE.MathUtils.smoothstep(u, 0.05, 0.2) * (1 - THREE.MathUtils.smoothstep(u, 0.72, 0.86))
        const pull = THREE.MathUtils.smoothstep(u, 0.2, 0.42) * (1 - THREE.MathUtils.smoothstep(u, 0.48, 0.7))
        bolt.rotation.z = lift * 1.2
        bolt.position.z = -0.035 + pull * 0.095
        cant = Math.sin(clamp(u, 0, 1) * Math.PI) * 0.16
        if (pull > 0.9 && this.brassLife <= 0) this.ejectBrass()
      } else {
        bolt.position.z = -0.035 + Math.sin(clamp(u * 3, 0, 1) * Math.PI) * 0.03
      }
      if (u >= 1) {
        this.boltTime = -1
        bolt.rotation.z = 0
        bolt.position.z = -0.035
      }
    }
    if (this.reloadTime >= 0) {
      this.reloadTime += dt
      const u = this.reloadTime / this.reloadDuration
      const tilt = Math.sin(clamp(u, 0, 1) * Math.PI)
      rotation.z += tilt * 0.55
      rotation.x -= tilt * 0.25
      position.y -= tilt * 0.06
      const out = THREE.MathUtils.smoothstep(u, 0.15, 0.32) * (1 - THREE.MathUtils.smoothstep(u, 0.55, 0.78))
      model.magazine.position.y = -out * 0.28
      model.magazine.position.z = out * 0.05
      if (u >= 1) {
        this.reloadTime = -1
        model.magazine.position.set(0, 0, 0)
      }
    }
    rotation.z += cant
    // Subtle hand tremor.
    position.x += noise1(input.time * 0.7, 3) * 0.0012
    position.y += noise1(input.time * 0.6, 9) * 0.0012
    this.holder.position.copy(position)
    this.holder.rotation.copy(rotation)
    // Muzzle flash.
    this.flashTime = Math.max(0, this.flashTime - dt)
    this.flash.visible = this.flashTime > 0
    this.flashLight.intensity = this.flashTime > 0 ? 12 : 0
    if (this.brassLife > 0) {
      this.brassLife -= dt
      this.brassVel.y -= 9.8 * dt
      this.brass.position.addScaledVector(this.brassVel, dt)
      this.brass.rotation.x += dt * 25
      this.brass.rotation.z += dt * 17
      if (this.brassLife <= 0) this.brass.visible = false
    }
    this.visible = input.scope < 0.97
    this.holder.visible = this.visible
  }

  dispose(): void {
    this.model?.dispose()
  }
}
