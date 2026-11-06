// Runtime world: wraps generated buffers in materials, owns lighting, sky, fog,
// wind-driven flags, night lights, and the baked nest.
import * as THREE from 'three'

import { createNoiseTexture, createSpriteTexture, createWorldMaterials, type WorldMaterials } from './builder.ts'
import { CollisionWorld, type Surface } from './collision.ts'
import { mulberry32 } from './noise.ts'
import { applyFogPreset, applySkyPreset, buildEnvironment, createSkyMaterial, patchFogShaders, sunDirection, type TimePreset } from './sky.ts'
import { raycastTerrain, terrainNormal } from './terrain.ts'
import { PLANT_KINDS, plantGeometry, type PlantKind } from './vegetation.ts'
import { BUILDER_KEYS, bakeNestOcclusion, bakeNestSun, buildRoads, buildStaticWorld, buildTerrain, NEAR, type StaticWorld } from './worldgen.ts'
import type { FlagSpot } from './structures.ts'

export type ProgressFn = (fraction: number, label: string) => Promise<void>

export interface WorldHit {
  t: number
  nx: number
  ny: number
  nz: number
  surface: Surface
  terrain: boolean
}

interface FlagRig {
  spot: FlagSpot
  mesh: THREE.Mesh
  base: Float32Array
  phase: number
}

const VARIANTS: Record<PlantKind, number> = { cypress: 2, broadleaf: 2, pine: 2, olive: 2, bush: 2, shrub: 1, rock: 2 }

function chainlinkTexture(): THREE.Texture {
  const size = 64
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  ctx.clearRect(0, 0, size, size)
  ctx.strokeStyle = 'rgba(255,255,255,1)'
  ctx.lineWidth = 2.2
  const cells = 4
  for (let i = -cells; i <= cells * 2; i += 1) {
    const o = (i * size) / cells
    ctx.beginPath()
    ctx.moveTo(o, 0)
    ctx.lineTo(o + size, size)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(o + size, 0)
    ctx.lineTo(o, size)
    ctx.stroke()
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

/** Replaces the sun term with a baked per-vertex visibility so the nest needs no shadow map. */
function bakedSunMaterial(base: THREE.MeshStandardMaterial, key: string): THREE.MeshStandardMaterial {
  const material = base.clone()
  material.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nattribute float sunVis;\nvarying float vSunVis;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvSunVis = sunVis;')
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying float vSunVis;')
      .replace(
        '#include <lights_fragment_begin>',
        THREE.ShaderChunk.lights_fragment_begin.replace(
          'getDirectionalLightInfo( directionalLight, directLight );',
          'getDirectionalLightInfo( directionalLight, directLight );\n\t\tdirectLight.color *= vSunVis;',
        ),
      )
  }
  material.customProgramCacheKey = () => `baked-sun-${key}`
  return material
}

function patchTerrainMaterial(material: THREE.MeshStandardMaterial): void {
  material.onBeforeCompile = (shader) => {
    // Two detail scales hide tiling; the second sample drifts across large distances.
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <map_fragment>',
      `#ifdef USE_MAP
        vec4 detailA = texture2D( map, vMapUv );
        vec4 detailB = texture2D( map, vMapUv * 0.113 + vec2( 0.37, 0.11 ) );
        vec4 detailC = texture2D( map, vMapUv * 4.7 );
        diffuseColor.rgb *= detailA.rgb * detailB.rgb * mix( vec3( 1.0 ), detailC.rgb, 0.45 ) * 1.55;
      #endif`,
    )
  }
  material.customProgramCacheKey = () => 'terrain-detail'
}

export class World {
  readonly root = new THREE.Group()
  readonly collision: CollisionWorld
  readonly materials: WorldMaterials
  readonly sun = new THREE.DirectionalLight('#ffffff', 3)
  readonly hemi = new THREE.HemisphereLight('#ffffff', '#444444', 0.4)
  readonly fog = new THREE.FogExp2('#b7c6d2', 0.0008)
  readonly skyMaterial = createSkyMaterial()
  readonly sky: THREE.Mesh
  preset: TimePreset | null = null
  sunDir = new THREE.Vector3(0, 1, 0)
  night = false

  private readonly scene: THREE.Scene
  private readonly statics: StaticWorld
  private envTarget: THREE.WebGLRenderTarget | null = null
  private flags: FlagRig[] = []
  private lampSprites: Array<{ sprite: THREE.Sprite; kind: string; size: number; phase: number }> = []
  private nightLights: THREE.PointLight[] = []
  private glowMeshes: THREE.Mesh[] = []
  private glowMaterial = new THREE.MeshBasicMaterial({ vertexColors: true })
  private nestMeshes: THREE.Mesh[] = []
  private shadowSize = 160
  private readonly shadowFocus = new THREE.Vector3()
  private readonly tmp = new THREE.Vector3()

  private constructor(scene: THREE.Scene, statics: StaticWorld, materials: WorldMaterials) {
    this.scene = scene
    this.statics = statics
    this.collision = statics.collision
    this.materials = materials
    this.sky = new THREE.Mesh(new THREE.SphereGeometry(8000, 48, 24), this.skyMaterial)
    this.sky.frustumCulled = false
    this.sky.renderOrder = -10
  }

  static async create(scene: THREE.Scene, progress: ProgressFn): Promise<World> {
    patchFogShaders()
    await progress(0.04, 'Surveying the Sarn Valley')
    const statics = buildStaticWorld()
    const materials = createWorldMaterials()
    const world = new World(scene, statics, materials)
    await progress(0.2, 'Raising terrain')
    world.buildTerrain()
    await progress(0.5, 'Paving roads')
    world.buildRoads()
    await progress(0.58, 'Constructing structures')
    world.buildSites()
    await progress(0.72, 'Planting the hillsides')
    world.buildVegetation()
    await progress(0.84, 'Fortifying overwatch')
    world.buildNest()
    world.buildDynamic()
    world.buildLights()
    scene.add(world.root)
    scene.fog = world.fog
    await progress(0.92, 'Calibrating optics')
    return world
  }

  private buildTerrain(): void {
    const terrain = buildTerrain()
    patchTerrainMaterial(this.materials.terrain)
    for (const geometry of terrain.near) {
      const mesh = new THREE.Mesh(geometry, this.materials.terrain)
      mesh.receiveShadow = true
      mesh.castShadow = true
      mesh.matrixAutoUpdate = false
      this.root.add(mesh)
    }
    for (const geometry of [...terrain.far, ...terrain.skirts]) {
      const mesh = new THREE.Mesh(geometry, this.materials.terrain)
      mesh.receiveShadow = true
      mesh.matrixAutoUpdate = false
      this.root.add(mesh)
    }
  }

  private buildRoads(): void {
    const mesh = new THREE.Mesh(buildRoads(), this.materials.road)
    mesh.receiveShadow = true
    mesh.matrixAutoUpdate = false
    this.root.add(mesh)
    // Power lines as sagging polylines.
    const points: number[] = []
    for (const wire of this.statics.wires) {
      const segments = 10
      for (let i = 0; i < segments; i += 1) {
        for (const k of [i, i + 1]) {
          const t = k / segments
          const sag = Math.sin(t * Math.PI) * wire.sag
          points.push(
            wire.a[0] + (wire.b[0] - wire.a[0]) * t,
            wire.a[1] + (wire.b[1] - wire.a[1]) * t - sag,
            wire.a[2] + (wire.b[2] - wire.a[2]) * t,
          )
        }
      }
    }
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3))
    const lines = new THREE.LineSegments(geometry, new THREE.LineBasicMaterial({ color: '#1d1d1b', transparent: true, opacity: 0.75 }))
    lines.matrixAutoUpdate = false
    this.root.add(lines)
  }

  private buildSites(): void {
    const m = this.materials
    const fenceMaterial = new THREE.MeshStandardMaterial({
      vertexColors: true,
      map: chainlinkTexture(),
      alphaTest: 0.45,
      alphaToCoverage: true,
      side: THREE.DoubleSide,
      metalness: 0.4,
      roughness: 0.6,
    })
    const lookup: Record<(typeof BUILDER_KEYS)[number], THREE.Material> = {
      std: m.standard,
      metal: m.metal,
      cloth: m.cloth,
      glass: m.glass,
      glow: this.glowMaterial,
      foliage: m.foliage,
      fence: fenceMaterial,
    }
    for (const site of this.statics.sites) {
      for (const key of BUILDER_KEYS) {
        const builder = site.b[key]
        if (builder.vertexCount === 0) continue
        const mesh = new THREE.Mesh(builder.build(), lookup[key])
        mesh.matrixAutoUpdate = false
        if (key === 'glow') {
          mesh.visible = false
          this.glowMeshes.push(mesh)
        } else {
          mesh.castShadow = key !== 'glass'
          mesh.receiveShadow = true
        }
        this.root.add(mesh)
      }
    }
  }

  private buildVegetation(): void {
    const material = new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 0.92, metalness: 0 })
    const groups = new Map<string, Array<(typeof this.statics.plants)[number]>>()
    for (const plant of this.statics.plants) {
      const near = Math.abs(plant.x) < 520 && plant.z > -900 && plant.z < 160
      const key = `${plant.kind}:${plant.variant % VARIANTS[plant.kind]}:${near ? 'n' : 'f'}`
      let list = groups.get(key)
      if (!list) groups.set(key, (list = []))
      list.push(plant)
    }
    const geometries = new Map<string, THREE.BufferGeometry>()
    const matrix = new THREE.Matrix4()
    const quaternion = new THREE.Quaternion()
    const position = new THREE.Vector3()
    const scale = new THREE.Vector3()
    const color = new THREE.Color()
    const axis = new THREE.Vector3(0, 1, 0)
    for (const [key, plants] of groups) {
      const [kind, variant, region] = key.split(':') as [PlantKind, string, string]
      const geoKey = `${kind}:${variant}`
      let geometry = geometries.get(geoKey)
      if (!geometry) geometries.set(geoKey, (geometry = plantGeometry(kind, Number(variant))))
      const mesh = new THREE.InstancedMesh(geometry, material, plants.length)
      plants.forEach((plant, index) => {
        quaternion.setFromAxisAngle(axis, plant.rot)
        const squash = kind === 'rock' ? 1 : 0.9 + (plant.tint - 0.5) * 0.3
        matrix.compose(position.set(plant.x, plant.y, plant.z), quaternion, scale.set(plant.scale, plant.scale * squash, plant.scale))
        mesh.setMatrixAt(index, matrix)
        const shade = 0.84 + plant.tint * 0.3
        color.setRGB(shade * (0.96 + plant.tint * 0.08), shade, shade * (0.94 - plant.tint * 0.06))
        mesh.setColorAt(index, color)
      })
      mesh.instanceMatrix.needsUpdate = true
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
      mesh.computeBoundingSphere()
      mesh.castShadow = region === 'n' && PLANT_KINDS.indexOf(kind) < 5
      mesh.receiveShadow = true
      mesh.matrixAutoUpdate = false
      this.root.add(mesh)
    }
  }

  private buildNest(): void {
    const m = this.materials
    const pairs: Array<[(typeof BUILDER_KEYS)[number], THREE.MeshStandardMaterial]> = [
      ['std', bakedSunMaterial(m.standard, 'std')],
      ['metal', bakedSunMaterial(m.metal, 'metal')],
      ['cloth', bakedSunMaterial(m.cloth, 'cloth')],
    ]
    for (const [key, material] of pairs) {
      const builder = this.statics.nest.b[key]
      if (builder.vertexCount === 0) continue
      const geometry = builder.build()
      bakeNestOcclusion(geometry, this.statics.nestCollision, key === 'std' ? 10 : 6)
      bakeNestSun(geometry, this.statics.nestCollision, new THREE.Vector3(0, 1, 0))
      const mesh = new THREE.Mesh(geometry, material)
      mesh.matrixAutoUpdate = false
      this.nestMeshes.push(mesh)
      this.root.add(mesh)
    }
  }

  private buildDynamic(): void {
    const flagMaterial = new THREE.MeshStandardMaterial({ vertexColors: true, side: THREE.DoubleSide, roughness: 0.85 })
    for (const spot of this.statics.flags) {
      let geometry: THREE.BufferGeometry
      if (spot.kind === 'flag') {
        geometry = new THREE.PlaneGeometry(spot.size, spot.size * 0.62, 14, 7)
        geometry.translate(spot.size / 2, -spot.size * 0.31, 0)
        const position = geometry.getAttribute('position')
        const colors: number[] = []
        const a = new THREE.Color(spot.colors[0])
        const b = new THREE.Color(spot.colors[1])
        for (let i = 0; i < position.count; i += 1) {
          const u = position.getX(i) / spot.size
          const v = -position.getY(i) / (spot.size * 0.62)
          const c = u < 0.28 ? b : v < 0.5 ? a : a.clone().multiplyScalar(0.55)
          colors.push(c.r, c.g, c.b)
        }
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
      } else {
        geometry = new THREE.CylinderGeometry(0.3, 0.12, spot.size, 12, 5, true)
        geometry.rotateZ(-Math.PI / 2)
        geometry.translate(spot.size / 2, 0, 0)
        const position = geometry.getAttribute('position')
        const colors: number[] = []
        const a = new THREE.Color(spot.colors[0])
        const b = new THREE.Color(spot.colors[1])
        for (let i = 0; i < position.count; i += 1) {
          const band = Math.min(4, Math.floor((position.getX(i) / spot.size) * 5 + 0.001))
          const c = band % 2 ? b : a
          colors.push(c.r, c.g, c.b)
        }
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
      }
      const mesh = new THREE.Mesh(geometry, flagMaterial)
      mesh.position.set(spot.x, spot.y, spot.z)
      mesh.castShadow = true
      this.root.add(mesh)
      const base = new Float32Array(geometry.getAttribute('position').array as ArrayLike<number>)
      this.flags.push({ spot, mesh, base, phase: mulberry32(Math.round(spot.x * 7 + spot.z))() * 10 })
    }
    const soft = createSpriteTexture('flash', 64)
    for (const lamp of this.statics.lamps) {
      const material = new THREE.SpriteMaterial({ map: soft, color: lamp.color, blending: THREE.AdditiveBlending, depthWrite: false, fog: false, transparent: true })
      const sprite = new THREE.Sprite(material)
      sprite.position.set(lamp.x, lamp.y, lamp.z)
      sprite.scale.setScalar(lamp.size)
      sprite.visible = false
      this.root.add(sprite)
      this.lampSprites.push({ sprite, kind: lamp.kind, size: lamp.size, phase: Math.random() * 6 })
    }
  }

  private buildLights(): void {
    this.sun.castShadow = true
    this.sun.shadow.mapSize.set(2048, 2048)
    this.sun.shadow.bias = -0.0004
    this.sun.shadow.normalBias = 0.04
    const camera = this.sun.shadow.camera
    camera.near = 1
    camera.far = 1600
    this.root.add(this.sun, this.sun.target, this.hemi, this.sky)
    for (const [x, y, z] of [
      [62, 7, -262],
      [-165, 9, -332],
      [-32, 6, -150],
    ] as const) {
      const light = new THREE.PointLight('#ffcf8f', 0, 46, 2)
      light.position.set(x, y, z)
      this.nightLights.push(light)
      this.root.add(light)
    }
  }

  setShadowQuality(size: number): void {
    if (this.sun.shadow.mapSize.x === size) return
    this.sun.shadow.mapSize.set(size, size)
    this.sun.shadow.map?.dispose()
    this.sun.shadow.map = null
  }

  applyPreset(preset: TimePreset, renderer: THREE.WebGLRenderer): void {
    this.preset = preset
    this.night = preset.night
    sunDirection(preset, this.sunDir)
    this.sun.color.set(preset.sunColor)
    this.sun.intensity = preset.sunIntensity
    this.hemi.color.set(preset.hemiSky)
    this.hemi.groundColor.set(preset.hemiGround)
    this.hemi.intensity = preset.hemiIntensity
    applySkyPreset(this.skyMaterial.uniforms, preset)
    applyFogPreset(this.fog, preset)
    this.envTarget?.dispose()
    this.envTarget = buildEnvironment(renderer, preset)
    this.scene.environment = this.envTarget.texture
    this.scene.environmentIntensity = preset.envIntensity
    const glow = preset.night ? 2.6 : preset.id === 'dusk' ? 1.1 : 0
    this.glowMaterial.color.setScalar(glow)
    for (const mesh of this.glowMeshes) mesh.visible = glow > 0
    for (const lamp of this.lampSprites) lamp.sprite.visible = preset.night || (preset.id === 'dusk' && lamp.kind !== 'flood')
    for (const light of this.nightLights) light.intensity = preset.night ? 55 : 0
    // Sun direction for the nest is the light the window actually receives.
    for (const mesh of this.nestMeshes) bakeNestSun(mesh.geometry, this.statics.nestCollision, this.sunDir)
  }

  /** Centers the sun's shadow frustum on what the player is looking at. */
  setShadowFocus(focus: THREE.Vector3, size: number): void {
    const camera = this.sun.shadow.camera
    const half = size / 2
    if (Math.abs(this.shadowSize - size) > 0.5) {
      this.shadowSize = size
      camera.left = -half
      camera.right = half
      camera.top = half
      camera.bottom = -half
      camera.updateProjectionMatrix()
    }
    // Snap to shadow texels in light space to stop shimmering as the view moves.
    const texel = size / this.sun.shadow.mapSize.x
    const lightZ = this.sunDir
    const lightX = this.tmp.set(0, 1, 0).cross(lightZ).normalize()
    const lightY = new THREE.Vector3().crossVectors(lightZ, lightX)
    const px = Math.round(focus.dot(lightX) / texel) * texel
    const py = Math.round(focus.dot(lightY) / texel) * texel
    const pz = focus.dot(lightZ)
    this.shadowFocus.copy(lightX).multiplyScalar(px).addScaledVector(lightY, py).addScaledVector(lightZ, pz)
    this.sun.target.position.copy(this.shadowFocus)
    this.sun.position.copy(this.shadowFocus).addScaledVector(this.sunDir, 700)
    this.sun.target.updateMatrixWorld()
  }

  update(dt: number, time: number, wind: THREE.Vector3, camera: THREE.Camera): void {
    this.sky.position.copy(camera.position)
    this.skyMaterial.uniforms.uTime.value = time
    const speed = Math.hypot(wind.x, wind.z)
    const yaw = Math.atan2(-wind.z, wind.x)
    for (const flag of this.flags) this.animateFlag(flag, time, speed, yaw)
    for (const lamp of this.lampSprites) {
      if (!lamp.sprite.visible) continue
      if (lamp.kind === 'beacon') lamp.sprite.scale.setScalar(lamp.size * (Math.sin(time * 3 + lamp.phase) > 0.2 ? 1.4 : 0.15))
    }
    void dt
  }

  private animateFlag(flag: FlagRig, time: number, speed: number, yaw: number): void {
    const { mesh, spot } = flag
    const strength = THREE.MathUtils.clamp(speed / 7, 0, 1)
    mesh.rotation.set(0, 0, 0)
    if (spot.kind === 'windsock') {
      const droop = THREE.MathUtils.lerp(1.25, 0.05, Math.sqrt(strength))
      mesh.rotation.order = 'YZX'
      mesh.rotation.y = yaw + Math.sin(time * 1.7 + flag.phase) * 0.12 * (1 - strength * 0.6)
      mesh.rotation.z = -droop + Math.sin(time * 2.3 + flag.phase) * 0.05
      return
    }
    mesh.rotation.y = yaw
    const geometry = mesh.geometry
    const position = geometry.getAttribute('position') as THREE.BufferAttribute
    const base = flag.base
    const droop = THREE.MathUtils.lerp(1.3, 0.08, Math.sqrt(strength))
    const amplitude = 0.05 + strength * 0.14
    const frequency = 3 + speed * 1.1
    for (let i = 0; i < position.count; i += 1) {
      const x = base[i * 3]
      const y = base[i * 3 + 1]
      const u = x / spot.size
      const wave = Math.sin(u * 7.5 - time * frequency + flag.phase + y * 1.3) * amplitude * u * spot.size
      // Rotate the flag downward about the hoist as it droops in calm air.
      const px = x * Math.cos(droop)
      const py = y - x * Math.sin(droop)
      position.setXYZ(i, px, py, wave)
    }
    position.needsUpdate = true
    geometry.computeVertexNormals()
  }

  /** Nearest hard surface or terrain along a normalized ray. */
  raycast(ox: number, oy: number, oz: number, dx: number, dy: number, dz: number, maxT: number): WorldHit | null {
    const hard = this.collision.raycast(ox, oy, oz, dx, dy, dz, maxT)
    const limit = hard ? hard.t : maxT
    const t = raycastTerrain(ox, oy, oz, dx, dy, dz, limit, 1.5)
    if (t >= 0 && (!hard || t < hard.t)) {
      const x = ox + dx * t
      const z = oz + dz * t
      const [nx, ny, nz] = terrainNormal(x, z)
      return { t, nx, ny, nz, surface: ny < 0.8 ? 'concrete' : 'dirt', terrain: true }
    }
    if (hard) return { t: hard.t, nx: hard.nx, ny: hard.ny, nz: hard.nz, surface: hard.surface, terrain: false }
    return null
  }

  /** Near-terrain bounds for camera and AI clamps. */
  static readonly bounds = NEAR
}

export { createNoiseTexture }
