// Geometry merging and procedural textures shared by the world, actors, and rifle.
import * as THREE from 'three'

import type { CamoSpec } from './data.ts'
import { fbm2, mulberry32 } from './noise.ts'

const tmpPosition = new THREE.Vector3()
const tmpNormal = new THREE.Vector3()
const tmpNormalMatrix = new THREE.Matrix3()
const tmpMatrix = new THREE.Matrix4()
const tmpQuaternion = new THREE.Quaternion()
const tmpEuler = new THREE.Euler()
const tmpScale = new THREE.Vector3()
const tmpOffset = new THREE.Vector3()
const tmpColor = new THREE.Color()

export const UNIT_BOX = new THREE.BoxGeometry(1, 1, 1)
export const UNIT_BLOB = new THREE.IcosahedronGeometry(1, 1)
export const UNIT_SPHERE = new THREE.SphereGeometry(1, 14, 10)

const cylinderCache = new Map<string, THREE.BufferGeometry>()

/** Unit-height cylinder centered on the origin. `top` is the top radius relative to the bottom. */
export function unitCylinder(segments = 12, top = 1, open = false): THREE.BufferGeometry {
  const key = `${segments}:${top}:${open}`
  let geometry = cylinderCache.get(key)
  if (!geometry) {
    geometry = new THREE.CylinderGeometry(top, 1, 1, segments, 1, open)
    cylinderCache.set(key, geometry)
  }
  return geometry
}

export type ColorInput = THREE.ColorRepresentation | THREE.Color

export function toColor(value: ColorInput, target = new THREE.Color()): THREE.Color {
  return value instanceof THREE.Color ? target.copy(value) : target.set(value)
}

/** Deterministic lightness and hue jitter. */
export function vary(value: ColorInput, random: () => number, amount = 0.06): THREE.Color {
  const color = toColor(value)
  const hsl = { h: 0, s: 0, l: 0 }
  color.getHSL(hsl)
  color.setHSL(
    (hsl.h + (random() - 0.5) * amount * 0.25 + 1) % 1,
    THREE.MathUtils.clamp(hsl.s + (random() - 0.5) * amount, 0, 1),
    THREE.MathUtils.clamp(hsl.l + (random() - 0.5) * amount * 1.6, 0, 1),
  )
  return color
}

export class MeshBuilder {
  positions: number[] = []
  normals: number[] = []
  colors: number[] = []
  uvs: number[] = []
  indices: number[] = []
  skinIndices: number[] | null = null
  private vertices = 0
  uvScale: number

  constructor(uvScale = 0.35, skinned = false) {
    this.uvScale = uvScale
    if (skinned) this.skinIndices = []
  }

  get vertexCount(): number {
    return this.vertices
  }

  add(geometry: THREE.BufferGeometry, matrix: THREE.Matrix4, color: ColorInput, bone = 0): this {
    const position = geometry.getAttribute('position')
    const normal = geometry.getAttribute('normal')
    const rgb = toColor(color, tmpColor)
    tmpNormalMatrix.getNormalMatrix(matrix)
    const base = this.vertices
    const scale = this.uvScale
    for (let i = 0; i < position.count; i += 1) {
      tmpPosition.fromBufferAttribute(position, i).applyMatrix4(matrix)
      tmpNormal.fromBufferAttribute(normal, i).applyMatrix3(tmpNormalMatrix).normalize()
      this.positions.push(tmpPosition.x, tmpPosition.y, tmpPosition.z)
      this.normals.push(tmpNormal.x, tmpNormal.y, tmpNormal.z)
      this.colors.push(rgb.r, rgb.g, rgb.b)
      const ax = Math.abs(tmpNormal.x)
      const ay = Math.abs(tmpNormal.y)
      const az = Math.abs(tmpNormal.z)
      if (ay >= ax && ay >= az) this.uvs.push(tmpPosition.x * scale, tmpPosition.z * scale)
      else if (ax >= az) this.uvs.push(tmpPosition.z * scale, tmpPosition.y * scale)
      else this.uvs.push(tmpPosition.x * scale, tmpPosition.y * scale)
      if (this.skinIndices) this.skinIndices.push(bone, 0, 0, 0)
    }
    const index = geometry.getIndex()
    if (index) {
      for (let i = 0; i < index.count; i += 1) this.indices.push(base + index.getX(i))
    } else {
      for (let i = 0; i < position.count; i += 1) this.indices.push(base + i)
    }
    this.vertices += position.count
    return this
  }

  /** Box centered at (x, y, z) with size (sx, sy, sz), rotated about Y. */
  box(x: number, y: number, z: number, sx: number, sy: number, sz: number, color: ColorInput, rotY = 0, bone = 0): this {
    tmpQuaternion.setFromEuler(tmpEuler.set(0, rotY, 0))
    tmpMatrix.compose(tmpOffset.set(x, y, z), tmpQuaternion, tmpScale.set(sx, sy, sz))
    return this.add(UNIT_BOX, tmpMatrix, color, bone)
  }

  /** Box with a full Euler rotation. */
  boxEuler(x: number, y: number, z: number, sx: number, sy: number, sz: number, color: ColorInput, rx: number, ry: number, rz: number, bone = 0): this {
    tmpQuaternion.setFromEuler(tmpEuler.set(rx, ry, rz))
    tmpMatrix.compose(tmpOffset.set(x, y, z), tmpQuaternion, tmpScale.set(sx, sy, sz))
    return this.add(UNIT_BOX, tmpMatrix, color, bone)
  }

  /** Cylinder whose base center is at (x, y, z). */
  cylinder(x: number, y: number, z: number, radius: number, height: number, color: ColorInput, segments = 12, top = 1, rx = 0, rz = 0, bone = 0): this {
    tmpQuaternion.setFromEuler(tmpEuler.set(rx, 0, rz))
    // Offset by half the height along the rotated up axis so the base sits at (x, y, z).
    tmpOffset.set(0, height / 2, 0).applyQuaternion(tmpQuaternion).add(tmpPosition.set(x, y, z))
    tmpMatrix.compose(tmpOffset, tmpQuaternion, tmpScale.set(radius, height, radius))
    return this.add(unitCylinder(segments, top), tmpMatrix, color, bone)
  }

  /** Cylinder between two points. */
  tube(ax: number, ay: number, az: number, bx: number, by: number, bz: number, radius: number, color: ColorInput, segments = 8, bone = 0): this {
    const start = new THREE.Vector3(ax, ay, az)
    const end = new THREE.Vector3(bx, by, bz)
    const direction = end.clone().sub(start)
    const length = direction.length()
    if (length < 1e-5) return this
    tmpQuaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.divideScalar(length))
    tmpMatrix.compose(start.add(end).multiplyScalar(0.5), tmpQuaternion, tmpScale.set(radius, length, radius))
    return this.add(unitCylinder(segments), tmpMatrix, color, bone)
  }

  sphere(x: number, y: number, z: number, sx: number, sy: number, sz: number, color: ColorInput, smooth = true, bone = 0, rotY = 0): this {
    tmpQuaternion.setFromEuler(tmpEuler.set(0, rotY, 0))
    tmpMatrix.compose(tmpOffset.set(x, y, z), tmpQuaternion, tmpScale.set(sx, sy, sz))
    return this.add(smooth ? UNIT_SPHERE : UNIT_BLOB, tmpMatrix, color, bone)
  }

  geometry(geometry: THREE.BufferGeometry, x: number, y: number, z: number, color: ColorInput, rx = 0, ry = 0, rz = 0, sx = 1, sy = 1, sz = 1, bone = 0): this {
    tmpQuaternion.setFromEuler(tmpEuler.set(rx, ry, rz))
    tmpMatrix.compose(tmpOffset.set(x, y, z), tmpQuaternion, tmpScale.set(sx, sy, sz))
    return this.add(geometry, tmpMatrix, color, bone)
  }

  build(): THREE.BufferGeometry {
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(this.positions, 3))
    geometry.setAttribute('normal', new THREE.Float32BufferAttribute(this.normals, 3))
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(this.colors, 3))
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(this.uvs, 2))
    if (this.skinIndices) {
      geometry.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(this.skinIndices, 4))
      const weights = new Float32Array(this.vertices * 4)
      for (let i = 0; i < this.vertices; i += 1) weights[i * 4] = 1
      geometry.setAttribute('skinWeight', new THREE.BufferAttribute(weights, 4))
    }
    geometry.setIndex(this.vertices > 65535 ? new THREE.Uint32BufferAttribute(this.indices, 1) : new THREE.Uint16BufferAttribute(this.indices, 1))
    geometry.computeBoundingSphere()
    geometry.computeBoundingBox()
    return geometry
  }
}

// ---------------------------------------------------------------------------
// Canvas textures

function canvas(size: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const element = document.createElement('canvas')
  element.width = size
  element.height = size
  const context = element.getContext('2d')
  if (!context) throw new Error('2D canvas is unavailable')
  return [element, context]
}

function finishTexture(texture: THREE.Texture, repeat = true, srgb = true): THREE.Texture {
  if (repeat) {
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
  }
  if (srgb) texture.colorSpace = THREE.SRGBColorSpace
  texture.needsUpdate = true
  return texture
}

/** Tileable grayscale noise used as a subtle albedo detail map. */
export function createNoiseTexture(size = 256, seed = 3, low = 0.72, high = 1): THREE.Texture {
  const [element, context] = canvas(size)
  const image = context.createImageData(size, size)
  const period = 8
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      // Sample on a torus so the texture tiles seamlessly.
      const u = (x / size) * Math.PI * 2
      const v = (y / size) * Math.PI * 2
      const nx = Math.cos(u) * period
      const nz = Math.sin(u) * period + Math.cos(v) * period * 1.37
      const n = fbm2(nx + Math.sin(v) * period, nz, 5, seed) * 0.5 + 0.5
      const grain = fbm2(nx * 6.1 + Math.sin(v) * 31, nz * 6.1, 2, seed + 9) * 0.5 + 0.5
      const value = Math.round((low + (high - low) * (n * 0.75 + grain * 0.25)) * 255)
      const offset = (y * size + x) * 4
      image.data[offset] = value
      image.data[offset + 1] = value
      image.data[offset + 2] = value
      image.data[offset + 3] = 255
    }
  }
  context.putImageData(image, 0, 0)
  return finishTexture(new THREE.CanvasTexture(element))
}

export type SpriteKind = 'soft' | 'smoke' | 'spark' | 'glint' | 'flash' | 'ring'

export function createSpriteTexture(kind: SpriteKind, size = 128): THREE.Texture {
  const [element, context] = canvas(size)
  const half = size / 2
  context.clearRect(0, 0, size, size)
  if (kind === 'soft' || kind === 'smoke') {
    const gradient = context.createRadialGradient(half, half, 0, half, half, half)
    gradient.addColorStop(0, 'rgba(255,255,255,1)')
    gradient.addColorStop(kind === 'soft' ? 0.35 : 0.5, 'rgba(255,255,255,0.55)')
    gradient.addColorStop(1, 'rgba(255,255,255,0)')
    context.fillStyle = gradient
    context.fillRect(0, 0, size, size)
    if (kind === 'smoke') {
      const random = mulberry32(11)
      context.globalCompositeOperation = 'destination-out'
      for (let i = 0; i < 90; i += 1) {
        const angle = random() * Math.PI * 2
        const radius = random() * half * 0.9
        const blob = context.createRadialGradient(
          half + Math.cos(angle) * radius,
          half + Math.sin(angle) * radius,
          0,
          half + Math.cos(angle) * radius,
          half + Math.sin(angle) * radius,
          size * 0.12,
        )
        blob.addColorStop(0, 'rgba(0,0,0,0.22)')
        blob.addColorStop(1, 'rgba(0,0,0,0)')
        context.fillStyle = blob
        context.fillRect(0, 0, size, size)
      }
    }
  } else if (kind === 'spark') {
    const gradient = context.createRadialGradient(half, half, 0, half, half, half)
    gradient.addColorStop(0, 'rgba(255,255,255,1)')
    gradient.addColorStop(0.15, 'rgba(255,240,200,0.9)')
    gradient.addColorStop(1, 'rgba(255,160,60,0)')
    context.fillStyle = gradient
    context.fillRect(0, 0, size, size)
  } else if (kind === 'glint' || kind === 'flash') {
    const gradient = context.createRadialGradient(half, half, 0, half, half, half)
    gradient.addColorStop(0, 'rgba(255,255,255,1)')
    gradient.addColorStop(0.12, kind === 'glint' ? 'rgba(255,255,255,0.9)' : 'rgba(255,220,150,0.95)')
    gradient.addColorStop(0.4, kind === 'glint' ? 'rgba(200,220,255,0.18)' : 'rgba(255,140,40,0.3)')
    gradient.addColorStop(1, 'rgba(255,255,255,0)')
    context.fillStyle = gradient
    context.fillRect(0, 0, size, size)
    context.globalCompositeOperation = 'lighter'
    const rays = kind === 'glint' ? 4 : 7
    for (let i = 0; i < rays; i += 1) {
      context.save()
      context.translate(half, half)
      context.rotate((i / rays) * Math.PI + (kind === 'glint' ? Math.PI / 4 : 0.3))
      const ray = context.createLinearGradient(-half, 0, half, 0)
      ray.addColorStop(0, 'rgba(255,255,255,0)')
      ray.addColorStop(0.5, 'rgba(255,255,255,0.75)')
      ray.addColorStop(1, 'rgba(255,255,255,0)')
      context.fillStyle = ray
      context.fillRect(-half, -size * 0.012, size, size * 0.024)
      context.restore()
    }
  } else if (kind === 'ring') {
    context.strokeStyle = 'rgba(255,255,255,1)'
    context.lineWidth = size * 0.08
    context.beginPath()
    context.arc(half, half, half * 0.7, 0, Math.PI * 2)
    context.stroke()
  }
  return finishTexture(new THREE.CanvasTexture(element), false)
}

/** Paints a tileable camouflage pattern for rifle furniture. */
export function createCamoTexture(camo: CamoSpec, size = 256): THREE.Texture {
  const [element, context] = canvas(size)
  const random = mulberry32(camo.id.length * 97 + camo.colors.length)
  const [base, ...accents] = camo.colors
  context.fillStyle = base
  context.fillRect(0, 0, size, size)
  const wrap = (draw: (dx: number, dy: number) => void) => {
    for (const dx of [-size, 0, size]) for (const dy of [-size, 0, size]) draw(dx, dy)
  }
  if (camo.pattern === 'woodland' || camo.pattern === 'desert' || camo.pattern === 'arctic') {
    const blobs = camo.pattern === 'desert' ? 36 : 46
    for (let i = 0; i < blobs; i += 1) {
      const color = accents[i % accents.length]
      const cx = random() * size
      const cy = random() * size
      const rx = size * (0.05 + random() * 0.1)
      const ry = rx * (0.4 + random() * 0.6)
      const angle = random() * Math.PI
      context.fillStyle = color
      wrap((dx, dy) => {
        context.beginPath()
        for (let step = 0; step <= 14; step += 1) {
          const t = (step / 14) * Math.PI * 2
          const wobble = 0.75 + 0.35 * Math.sin(t * 3 + i)
          const px = Math.cos(t) * rx * wobble
          const py = Math.sin(t) * ry * wobble
          const x = cx + dx + px * Math.cos(angle) - py * Math.sin(angle)
          const y = cy + dy + px * Math.sin(angle) + py * Math.cos(angle)
          if (step === 0) context.moveTo(x, y)
          else context.lineTo(x, y)
        }
        context.fill()
      })
    }
  } else if (camo.pattern === 'digital') {
    const cell = size / 32
    for (let i = 0; i < 520; i += 1) {
      const x = Math.floor(random() * 32) * cell
      const y = Math.floor(random() * 32) * cell
      context.fillStyle = accents[i % accents.length]
      const w = cell * (1 + Math.floor(random() * 3))
      const h = cell * (1 + Math.floor(random() * 2))
      wrap((dx, dy) => context.fillRect(x + dx, y + dy, w, h))
    }
  } else if (camo.pattern === 'tiger') {
    for (let i = 0; i < 26; i += 1) {
      context.fillStyle = accents[i % accents.length]
      const y = random() * size
      const thickness = size * (0.015 + random() * 0.03)
      wrap((dx, dy) => {
        context.beginPath()
        context.moveTo(dx, y + dy)
        for (let x = 0; x <= size; x += size / 12) {
          context.lineTo(x + dx, y + dy + Math.sin(x * 0.05 + i) * size * 0.04)
        }
        for (let x = size; x >= 0; x -= size / 12) {
          context.lineTo(x + dx, y + dy + thickness + Math.sin(x * 0.07 + i * 2) * size * 0.03)
        }
        context.fill()
      })
    }
  } else if (camo.pattern === 'damascus') {
    context.lineWidth = size * 0.012
    for (let i = 0; i < 40; i += 1) {
      context.strokeStyle = accents[i % accents.length]
      context.globalAlpha = 0.55
      context.beginPath()
      const offset = (i / 40) * size
      for (let x = -4; x <= size + 4; x += 4) {
        const y = offset + Math.sin(x * 0.045 + i * 0.7) * size * 0.05 + Math.sin(x * 0.11) * size * 0.015
        if (x === -4) context.moveTo(x, y)
        else context.lineTo(x, y)
      }
      context.stroke()
    }
    context.globalAlpha = 1
  } else {
    // Solid factory finish with faint stippling.
    for (let i = 0; i < 1600; i += 1) {
      context.fillStyle = accents[i % accents.length]
      context.globalAlpha = 0.25
      context.fillRect(random() * size, random() * size, 1.5, 1.5)
    }
    context.globalAlpha = 1
  }
  return finishTexture(new THREE.CanvasTexture(element))
}

export interface WorldMaterials {
  standard: THREE.MeshStandardMaterial
  metal: THREE.MeshStandardMaterial
  foliage: THREE.MeshStandardMaterial
  glass: THREE.MeshStandardMaterial
  terrain: THREE.MeshStandardMaterial
  road: THREE.MeshStandardMaterial
  cloth: THREE.MeshStandardMaterial
  baked: THREE.MeshBasicMaterial
  emissive: THREE.MeshBasicMaterial
  detail: THREE.Texture
}

export function createWorldMaterials(): WorldMaterials {
  const detail = createNoiseTexture(256, 3, 0.7, 1)
  const fine = createNoiseTexture(128, 17, 0.8, 1)
  return {
    detail,
    standard: new THREE.MeshStandardMaterial({ vertexColors: true, map: fine, roughness: 0.92, metalness: 0 }),
    metal: new THREE.MeshStandardMaterial({ vertexColors: true, map: fine, roughness: 0.48, metalness: 0.55 }),
    foliage: new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.95, metalness: 0, flatShading: true }),
    glass: new THREE.MeshStandardMaterial({ color: '#1d262c', roughness: 0.08, metalness: 0.6 }),
    terrain: new THREE.MeshStandardMaterial({ vertexColors: true, map: detail, roughness: 1, metalness: 0 }),
    road: new THREE.MeshStandardMaterial({
      vertexColors: true,
      map: fine,
      roughness: 0.94,
      metalness: 0,
      polygonOffset: true,
      polygonOffsetFactor: -3,
      polygonOffsetUnits: -3,
    }),
    cloth: new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.96, metalness: 0, side: THREE.DoubleSide }),
    baked: new THREE.MeshBasicMaterial({ vertexColors: true, map: detail }),
    emissive: new THREE.MeshBasicMaterial({ vertexColors: true, toneMapped: true, fog: true }),
  }
}
