// Pooled particles, impact decals, and screen-space bullet trails.
import * as THREE from 'three'

import { createSpriteTexture } from './builder.ts'
import type { Surface } from './collision.ts'
import { fogShared } from './sky.ts'

const particleVertex = /* glsl */ `
attribute float size;
attribute float alpha;
attribute vec3 tint;
attribute float spin;
uniform float uScale;
varying float vAlpha;
varying vec3 vTint;
varying float vSpin;
#include <fog_pars_vertex>
void main() {
  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = clamp( size * uScale / max( -mvPosition.z, 0.05 ), 1.0, 1024.0 );
  vAlpha = alpha;
  vTint = tint;
  vSpin = spin;
  #include <fog_vertex>
}`

const particleFragment = /* glsl */ `
uniform sampler2D uMap;
varying float vAlpha;
varying vec3 vTint;
varying float vSpin;
#include <fog_pars_fragment>
void main() {
  vec2 p = gl_PointCoord - 0.5;
  float c = cos( vSpin );
  float s = sin( vSpin );
  p = vec2( c * p.x - s * p.y, s * p.x + c * p.y ) + 0.5;
  vec4 texel = texture2D( uMap, p );
  gl_FragColor = vec4( vTint, texel.a * vAlpha );
  if ( gl_FragColor.a < 0.004 ) discard;
  #include <fog_fragment>
}`

interface ParticleSpec {
  x: number
  y: number
  z: number
  vx: number
  vy: number
  vz: number
  size: number
  grow: number
  life: number
  color: THREE.ColorRepresentation
  alpha: number
  gravity: number
  drag: number
}

class ParticleSystem {
  readonly points: THREE.Points
  private readonly max: number
  private readonly position: Float32Array
  private readonly velocity: Float32Array
  private readonly sizes: Float32Array
  private readonly alphas: Float32Array
  private readonly tints: Float32Array
  private readonly spins: Float32Array
  private readonly age: Float32Array
  private readonly life: Float32Array
  private readonly grow: Float32Array
  private readonly base: Float32Array
  private readonly startAlpha: Float32Array
  private readonly gravity: Float32Array
  private readonly drag: Float32Array
  private readonly spinRate: Float32Array
  private cursor = 0
  private readonly material: THREE.ShaderMaterial
  private readonly color = new THREE.Color()
  readonly additive: boolean

  constructor(max: number, texture: THREE.Texture, additive: boolean) {
    this.max = max
    this.additive = additive
    this.position = new Float32Array(max * 3)
    this.velocity = new Float32Array(max * 3)
    this.sizes = new Float32Array(max)
    this.alphas = new Float32Array(max)
    this.tints = new Float32Array(max * 3)
    this.spins = new Float32Array(max)
    this.age = new Float32Array(max)
    this.life = new Float32Array(max)
    this.grow = new Float32Array(max)
    this.base = new Float32Array(max)
    this.startAlpha = new Float32Array(max)
    this.gravity = new Float32Array(max)
    this.drag = new Float32Array(max)
    this.spinRate = new Float32Array(max)
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(this.position, 3).setUsage(THREE.DynamicDrawUsage))
    geometry.setAttribute('size', new THREE.BufferAttribute(this.sizes, 1).setUsage(THREE.DynamicDrawUsage))
    geometry.setAttribute('alpha', new THREE.BufferAttribute(this.alphas, 1).setUsage(THREE.DynamicDrawUsage))
    geometry.setAttribute('tint', new THREE.BufferAttribute(this.tints, 3).setUsage(THREE.DynamicDrawUsage))
    geometry.setAttribute('spin', new THREE.BufferAttribute(this.spins, 1).setUsage(THREE.DynamicDrawUsage))
    geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 1e6)
    this.material = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.merge([THREE.UniformsLib.fog, { uScale: { value: 500 }, uMap: { value: texture } }]),
      vertexShader: particleVertex,
      fragmentShader: particleFragment,
      transparent: true,
      depthWrite: false,
      blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
      fog: true,
    })
    Object.assign(this.material.uniforms, fogShared)
    this.material.uniforms.uMap.value = texture
    this.points = new THREE.Points(geometry, this.material)
    this.points.frustumCulled = false
    this.points.renderOrder = additive ? 6 : 5
  }

  setScale(scale: number): void {
    this.material.uniforms.uScale.value = scale
  }

  spawn(p: ParticleSpec): void {
    const i = this.cursor
    this.cursor = (this.cursor + 1) % this.max
    this.position.set([p.x, p.y, p.z], i * 3)
    this.velocity.set([p.vx, p.vy, p.vz], i * 3)
    this.base[i] = p.size
    this.grow[i] = p.grow
    this.age[i] = 0
    this.life[i] = p.life
    this.startAlpha[i] = p.alpha
    this.gravity[i] = p.gravity
    this.drag[i] = p.drag
    this.spins[i] = Math.random() * Math.PI * 2
    this.spinRate[i] = (Math.random() - 0.5) * 2
    this.color.set(p.color)
    this.tints.set([this.color.r, this.color.g, this.color.b], i * 3)
    this.sizes[i] = p.size
    this.alphas[i] = p.alpha
  }

  update(dt: number): void {
    for (let i = 0; i < this.max; i += 1) {
      if (this.life[i] <= 0) continue
      this.age[i] += dt
      const u = this.age[i] / this.life[i]
      if (u >= 1) {
        this.life[i] = 0
        this.alphas[i] = 0
        continue
      }
      const k = Math.exp(-this.drag[i] * dt)
      this.velocity[i * 3] *= k
      this.velocity[i * 3 + 1] = this.velocity[i * 3 + 1] * k - this.gravity[i] * dt
      this.velocity[i * 3 + 2] *= k
      this.position[i * 3] += this.velocity[i * 3] * dt
      this.position[i * 3 + 1] += this.velocity[i * 3 + 1] * dt
      this.position[i * 3 + 2] += this.velocity[i * 3 + 2] * dt
      this.sizes[i] = this.base[i] + this.grow[i] * Math.sqrt(u)
      const fadeIn = this.additive ? 1 : Math.min(1, u * 12)
      this.alphas[i] = this.startAlpha[i] * fadeIn * (1 - u) * (1 - u * 0.3)
      this.spins[i] += this.spinRate[i] * dt
    }
    const geometry = this.points.geometry
    for (const name of ['position', 'size', 'alpha', 'tint', 'spin']) geometry.getAttribute(name).needsUpdate = true
  }

  clear(): void {
    this.life.fill(0)
    this.alphas.fill(0)
  }
}

// ---------------------------------------------------------------------------
// Screen-space trails

const trailVertex = /* glsl */ `
attribute vec3 pointA;
attribute vec3 pointB;
attribute vec2 corner;
attribute float fade;
uniform vec2 uResolution;
uniform float uWidth;
varying float vFade;
varying float vSide;
void main() {
  vec4 a = projectionMatrix * modelViewMatrix * vec4( pointA, 1.0 );
  vec4 b = projectionMatrix * modelViewMatrix * vec4( pointB, 1.0 );
  vec4 p = corner.x < 0.5 ? a : b;
  vec2 sa = a.xy / max( a.w, 1e-4 ) * uResolution;
  vec2 sb = b.xy / max( b.w, 1e-4 ) * uResolution;
  vec2 dir = normalize( sb - sa + vec2( 1e-5, 0.0 ) );
  vec2 normal = vec2( -dir.y, dir.x );
  p.xy += normal * corner.y * uWidth / uResolution * p.w;
  gl_Position = p;
  vFade = fade;
  vSide = corner.y;
}`

const trailFragment = /* glsl */ `
uniform vec3 uColor;
uniform float uOpacity;
varying float vFade;
varying float vSide;
void main() {
  float edge = 1.0 - abs( vSide );
  gl_FragColor = vec4( uColor, vFade * uOpacity * ( 0.35 + 0.65 * edge ) );
}`

interface TrailPoint {
  x: number
  y: number
  z: number
  time: number
}

export class Trail {
  readonly mesh: THREE.Mesh
  readonly points: TrailPoint[] = []
  life: number
  active = true
  private readonly material: THREE.ShaderMaterial
  private capacity = 0

  constructor(color: THREE.ColorRepresentation, width: number, opacity: number, life: number, additive: boolean) {
    this.life = life
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uResolution: { value: new THREE.Vector2(960, 540) },
        uWidth: { value: width },
        uColor: { value: new THREE.Color(color) },
        uOpacity: { value: opacity },
      },
      vertexShader: trailVertex,
      fragmentShader: trailFragment,
      transparent: true,
      depthWrite: false,
      blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
    })
    this.mesh = new THREE.Mesh(new THREE.BufferGeometry(), this.material)
    this.mesh.frustumCulled = false
    this.mesh.renderOrder = 7
  }

  push(x: number, y: number, z: number, time: number): void {
    this.points.push({ x, y, z, time })
    if (this.points.length > 160) this.points.shift()
  }

  update(time: number, resolution: THREE.Vector2): boolean {
    while (this.points.length > 0 && time - this.points[0].time > this.life) this.points.shift()
    if (this.points.length < 2) {
      this.mesh.visible = false
      return this.active || this.points.length > 0
    }
    this.mesh.visible = true
    this.material.uniforms.uResolution.value.copy(resolution)
    const segments = this.points.length - 1
    const vertexCount = segments * 4
    const geometry = this.mesh.geometry
    if (vertexCount > this.capacity) {
      this.capacity = Math.max(vertexCount, 64)
      geometry.setAttribute('pointA', new THREE.BufferAttribute(new Float32Array(this.capacity * 3), 3))
      geometry.setAttribute('pointB', new THREE.BufferAttribute(new Float32Array(this.capacity * 3), 3))
      geometry.setAttribute('corner', new THREE.BufferAttribute(new Float32Array(this.capacity * 2), 2))
      geometry.setAttribute('fade', new THREE.BufferAttribute(new Float32Array(this.capacity), 1))
      geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(this.capacity * 3), 3))
      const indices: number[] = []
      for (let s = 0; s < this.capacity / 4; s += 1) indices.push(s * 4, s * 4 + 1, s * 4 + 2, s * 4 + 2, s * 4 + 1, s * 4 + 3)
      geometry.setIndex(indices)
    }
    const a = geometry.getAttribute('pointA') as THREE.BufferAttribute
    const b = geometry.getAttribute('pointB') as THREE.BufferAttribute
    const corner = geometry.getAttribute('corner') as THREE.BufferAttribute
    const fade = geometry.getAttribute('fade') as THREE.BufferAttribute
    for (let s = 0; s < segments; s += 1) {
      const p = this.points[s]
      const q = this.points[s + 1]
      const fp = Math.max(0, 1 - (time - p.time) / this.life)
      const fq = Math.max(0, 1 - (time - q.time) / this.life)
      for (let k = 0; k < 4; k += 1) {
        const v = s * 4 + k
        a.setXYZ(v, p.x, p.y, p.z)
        b.setXYZ(v, q.x, q.y, q.z)
        corner.setXY(v, k < 2 ? 0 : 1, k % 2 ? 1 : -1)
        fade.setX(v, k < 2 ? fp : fq)
      }
    }
    a.needsUpdate = true
    b.needsUpdate = true
    corner.needsUpdate = true
    fade.needsUpdate = true
    geometry.setDrawRange(0, segments * 6)
    return true
  }

  dispose(): void {
    this.mesh.geometry.dispose()
    this.material.dispose()
    this.mesh.removeFromParent()
  }
}

// ---------------------------------------------------------------------------

const SURFACE_DUST: Record<Surface | 'flesh', { color: string; size: number; count: number }> = {
  dirt: { color: '#8d7a5c', size: 0.9, count: 7 },
  sand: { color: '#b19c76', size: 1.0, count: 8 },
  concrete: { color: '#a8a39a', size: 0.75, count: 6 },
  metal: { color: '#8f8f8c', size: 0.35, count: 3 },
  wood: { color: '#8a6d4c', size: 0.5, count: 4 },
  foliage: { color: '#5f6b3e', size: 0.5, count: 4 },
  glass: { color: '#c9d2d6', size: 0.4, count: 3 },
  fabric: { color: '#8f8676', size: 0.35, count: 3 },
  flesh: { color: '#5a1010', size: 0.3, count: 5 },
}

export class Effects {
  readonly group = new THREE.Group()
  private readonly soft: ParticleSystem
  private readonly glow: ParticleSystem
  private readonly chips: ParticleSystem
  private readonly decals: THREE.InstancedMesh
  private decalCursor = 0
  private readonly trails: Trail[] = []
  private readonly resolution = new THREE.Vector2(960, 540)
  private readonly matrix = new THREE.Matrix4()
  private readonly quaternion = new THREE.Quaternion()
  private readonly normal = new THREE.Vector3()
  private readonly up = new THREE.Vector3(0, 0, 1)
  reduceFlashing = false

  constructor() {
    this.soft = new ParticleSystem(700, createSpriteTexture('smoke', 128), false)
    this.chips = new ParticleSystem(500, createSpriteTexture('soft', 32), false)
    this.glow = new ParticleSystem(300, createSpriteTexture('spark', 64), true)
    this.group.add(this.soft.points, this.chips.points, this.glow.points)
    const hole = document.createElement('canvas')
    hole.width = 64
    hole.height = 64
    const ctx = hole.getContext('2d')!
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
    gradient.addColorStop(0, 'rgba(10,9,8,1)')
    gradient.addColorStop(0.22, 'rgba(20,18,16,0.95)')
    gradient.addColorStop(0.45, 'rgba(60,55,48,0.45)')
    gradient.addColorStop(1, 'rgba(60,55,48,0)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 64, 64)
    const texture = new THREE.CanvasTexture(hole)
    texture.colorSpace = THREE.SRGBColorSpace
    this.decals = new THREE.InstancedMesh(
      new THREE.PlaneGeometry(1, 1),
      new THREE.MeshStandardMaterial({ map: texture, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4, roughness: 1 }),
      96,
    )
    this.decals.count = 0
    this.decals.frustumCulled = false
    this.group.add(this.decals)
  }

  setView(heightPx: number, fov: number, widthPx: number): void {
    const scale = heightPx / (2 * Math.tan(THREE.MathUtils.degToRad(fov) / 2))
    this.soft.setScale(scale)
    this.chips.setScale(scale)
    this.glow.setScale(scale)
    this.resolution.set(widthPx / 2, heightPx / 2)
  }

  impact(surface: Surface | 'flesh', x: number, y: number, z: number, nx: number, ny: number, nz: number, scale = 1): void {
    const spec = SURFACE_DUST[surface]
    const n = 0.6 + scale * 0.4
    for (let i = 0; i < spec.count; i += 1) {
      const spread = 0.8 + Math.random() * 1.2
      this.soft.spawn({
        x: x + nx * 0.1,
        y: y + ny * 0.1,
        z: z + nz * 0.1,
        vx: (nx * 2.2 + (Math.random() - 0.5) * 2) * spread * n,
        vy: (ny * 2.2 + Math.random() * 1.6) * spread * n,
        vz: (nz * 2.2 + (Math.random() - 0.5) * 2) * spread * n,
        size: spec.size * 0.4 * scale,
        grow: spec.size * (1.2 + Math.random()) * scale,
        life: surface === 'flesh' ? 0.7 : 1.5 + Math.random() * 1.2,
        color: spec.color,
        alpha: surface === 'flesh' ? 0.75 : 0.55,
        gravity: surface === 'flesh' ? 0.6 : -0.12,
        drag: 2.4,
      })
    }
    // Flung chips and debris.
    const chips = surface === 'metal' ? 0 : surface === 'flesh' ? 6 : 10
    for (let i = 0; i < chips; i += 1) {
      this.chips.spawn({
        x,
        y,
        z,
        vx: nx * 4 + (Math.random() - 0.5) * 6,
        vy: ny * 4 + Math.random() * 5,
        vz: nz * 4 + (Math.random() - 0.5) * 6,
        size: (surface === 'flesh' ? 0.05 : 0.07) * scale,
        grow: 0,
        life: 0.6 + Math.random() * 0.5,
        color: surface === 'flesh' ? '#4a0c0c' : surface === 'foliage' ? '#56622f' : '#4b4237',
        alpha: 0.95,
        gravity: 9.8,
        drag: 0.6,
      })
    }
    if (surface === 'metal' || surface === 'glass') {
      for (let i = 0; i < (surface === 'metal' ? 14 : 8); i += 1) {
        this.glow.spawn({
          x,
          y,
          z,
          vx: nx * 6 + (Math.random() - 0.5) * 9,
          vy: ny * 6 + Math.random() * 6,
          vz: nz * 6 + (Math.random() - 0.5) * 9,
          size: 0.07 * scale,
          grow: 0,
          life: 0.25 + Math.random() * 0.3,
          color: surface === 'metal' ? '#ffcc7a' : '#e6f2ff',
          alpha: this.reduceFlashing ? 0.5 : 1,
          gravity: 9.8,
          drag: 1.2,
        })
      }
    }
  }

  /** Dust blown off the sill and floor by the player's muzzle blast. */
  muzzleBlast(x: number, y: number, z: number, fx: number, fz: number, strength: number): void {
    for (let i = 0; i < Math.round(8 * strength); i += 1) {
      this.soft.spawn({
        x: x + fx * (0.6 + Math.random()),
        y: y - 0.2 - Math.random() * 0.3,
        z: z + fz * (0.6 + Math.random()),
        vx: fx * (3 + Math.random() * 3) + (Math.random() - 0.5) * 2.5,
        vy: Math.random() * 1.2,
        vz: fz * (3 + Math.random() * 3) + (Math.random() - 0.5) * 2.5,
        size: 0.35,
        grow: 1.8 * strength,
        life: 1.4 + Math.random(),
        color: '#9d927f',
        alpha: 0.22 * strength,
        gravity: -0.05,
        drag: 2.2,
      })
    }
  }

  enemyMuzzle(x: number, y: number, z: number, dx: number, dy: number, dz: number, big: boolean): void {
    this.glow.spawn({ x, y, z, vx: 0, vy: 0, vz: 0, size: big ? 1.1 : 0.6, grow: 0.3, life: 0.08, color: '#ffc477', alpha: this.reduceFlashing ? 0.5 : 1, gravity: 0, drag: 0 })
    for (let i = 0; i < (big ? 5 : 3); i += 1) {
      this.soft.spawn({
        x: x + dx * 0.3,
        y: y + dy * 0.3,
        z: z + dz * 0.3,
        vx: dx * (2 + Math.random() * 2) + (Math.random() - 0.5),
        vy: dy * 2 + Math.random() * 0.6,
        vz: dz * (2 + Math.random() * 2) + (Math.random() - 0.5),
        size: 0.3,
        grow: big ? 2.2 : 1.2,
        life: 1.6,
        color: '#c9c3b5',
        alpha: 0.35,
        gravity: -0.1,
        drag: 2,
      })
    }
  }

  decal(x: number, y: number, z: number, nx: number, ny: number, nz: number, size: number): void {
    this.normal.set(nx, ny, nz).normalize()
    this.quaternion.setFromUnitVectors(this.up, this.normal)
    const s = size * (0.8 + Math.random() * 0.4)
    this.matrix.compose(new THREE.Vector3(x + nx * 0.015, y + ny * 0.015, z + nz * 0.015), this.quaternion, new THREE.Vector3(s, s, s))
    this.decals.setMatrixAt(this.decalCursor, this.matrix)
    this.decalCursor = (this.decalCursor + 1) % 96
    this.decals.count = Math.max(this.decals.count, this.decalCursor === 0 ? 96 : this.decalCursor)
    this.decals.instanceMatrix.needsUpdate = true
  }

  trail(color: THREE.ColorRepresentation, width: number, opacity: number, life: number, additive = false): Trail {
    const trail = new Trail(color, width, opacity, life, additive)
    this.trails.push(trail)
    this.group.add(trail.mesh)
    return trail
  }

  update(dt: number, time: number): void {
    this.soft.update(dt)
    this.chips.update(dt)
    this.glow.update(dt)
    for (let i = this.trails.length - 1; i >= 0; i -= 1) {
      const trail = this.trails[i]
      if (!trail.update(time, this.resolution)) {
        trail.dispose()
        this.trails.splice(i, 1)
      }
    }
  }

  clear(): void {
    this.soft.clear()
    this.chips.clear()
    this.glow.clear()
    this.decals.count = 0
    this.decalCursor = 0
    for (const trail of this.trails) trail.dispose()
    this.trails.length = 0
  }
}
