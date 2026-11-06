// Low-poly vegetation and rock archetypes rendered with per-tile instancing.
import * as THREE from 'three'

import { MeshBuilder, unitCylinder, vary } from './builder.ts'
import { hash2, mulberry32 } from './noise.ts'

export type PlantKind = 'cypress' | 'broadleaf' | 'pine' | 'olive' | 'bush' | 'shrub' | 'rock'

export const PLANT_KINDS: PlantKind[] = ['cypress', 'broadleaf', 'pine', 'olive', 'bush', 'shrub', 'rock']

/** Typical canopy radius and height at scale 1, used for colliders and sightline checks. */
export const PLANT_SIZE: Record<PlantKind, { radius: number; height: number; trunk: number }> = {
  cypress: { radius: 1.2, height: 9.5, trunk: 0.22 },
  broadleaf: { radius: 2.6, height: 7.5, trunk: 0.3 },
  pine: { radius: 2.3, height: 11, trunk: 0.26 },
  olive: { radius: 2.4, height: 4.8, trunk: 0.28 },
  bush: { radius: 1.1, height: 1.5, trunk: 0 },
  shrub: { radius: 0.7, height: 0.8, trunk: 0 },
  rock: { radius: 1, height: 0.9, trunk: 0 },
}

function jitteredBlob(detail: number, seed: number, amount: number): THREE.BufferGeometry {
  const geometry = new THREE.IcosahedronGeometry(1, detail)
  const position = geometry.getAttribute('position') as THREE.BufferAttribute
  const v = new THREE.Vector3()
  for (let i = 0; i < position.count; i += 1) {
    v.fromBufferAttribute(position, i)
    // Hash the rounded position so duplicated corner vertices move together.
    const h = hash2(Math.round(v.x * 1000), Math.round(v.y * 1000) * 31 + Math.round(v.z * 1000), seed)
    v.multiplyScalar(1 - amount + h * amount * 2)
    position.setXYZ(i, v.x, v.y, v.z)
  }
  geometry.computeVertexNormals()
  return geometry
}

const BLOBS = [0, 1, 2, 3].map((seed) => jitteredBlob(0, 101 + seed, 0.18))
const ROCKS = [0, 1, 2].map((seed) => jitteredBlob(1, 301 + seed, 0.24))

function blob(builder: MeshBuilder, random: () => number, x: number, y: number, z: number, sx: number, sy: number, sz: number, color: THREE.ColorRepresentation): void {
  builder.geometry(BLOBS[Math.floor(random() * BLOBS.length)], x, y, z, vary(color, random, 0.08), random() * 0.4, random() * Math.PI * 2, random() * 0.4, sx, sy, sz)
}

function trunk(builder: MeshBuilder, x0: number, y0: number, z0: number, x1: number, y1: number, z1: number, r: number, color: THREE.ColorRepresentation): void {
  builder.tube(x0, y0, z0, x1, y1, z1, r, color, 5)
}

/** Builds one variant of a plant at unit scale with its base at the origin. */
export function plantGeometry(kind: PlantKind, variant: number): THREE.BufferGeometry {
  const random = mulberry32(PLANT_KINDS.indexOf(kind) * 977 + variant * 131 + 7)
  const b = new MeshBuilder(0.5)
  switch (kind) {
    case 'cypress': {
      trunk(b, 0, -0.3, 0, 0, 1.6, 0, 0.2, '#4a3a2a')
      const tiers = 5
      for (let i = 0; i < tiers; i += 1) {
        const t = i / (tiers - 1)
        const r = 1.15 * (1 - t * 0.62)
        blob(b, random, (random() - 0.5) * 0.15, 1.6 + t * 6.6, (random() - 0.5) * 0.15, r, 1.6, r, i % 2 ? '#2f3d24' : '#34442a')
      }
      blob(b, random, 0, 8.7, 0, 0.32, 0.9, 0.32, '#3a4a2c')
      break
    }
    case 'broadleaf': {
      trunk(b, 0, -0.3, 0, 0.15, 3.0, 0.1, 0.28, '#4d3d2b')
      trunk(b, 0.1, 2.4, 0.05, 1.3, 4.2, 0.4, 0.13, '#4d3d2b')
      trunk(b, 0.1, 2.6, 0.05, -1.1, 4.4, -0.5, 0.12, '#4d3d2b')
      const count = 5
      for (let i = 0; i < count; i += 1) {
        const a = (i / count) * Math.PI * 2 + random() * 0.6
        const d = 1.0 + random() * 0.8
        blob(b, random, Math.cos(a) * d, 4.6 + random() * 1.2, Math.sin(a) * d, 1.7 + random() * 0.5, 1.35, 1.7 + random() * 0.5, i % 2 ? '#4b5a2e' : '#56663a')
      }
      blob(b, random, 0, 6.1, 0, 1.6, 1.25, 1.6, '#5a6b3c')
      break
    }
    case 'pine': {
      trunk(b, 0, -0.3, 0, 0, 8.6, 0, 0.24, '#5a4431')
      const cones = 4
      for (let i = 0; i < cones; i += 1) {
        const t = i / (cones - 1)
        const r = 2.3 * (1 - t * 0.6)
        const y = 4.2 + t * 5.0
        b.geometry(unitCylinder(7, 0.05), 0, y + 1.2, 0, vary(i % 2 ? '#2c3a24' : '#33432a', random, 0.06), 0, random() * Math.PI, 0, r, 2.6, r)
      }
      break
    }
    case 'olive': {
      trunk(b, 0, -0.3, 0, 0.3, 1.5, 0.1, 0.3, '#5d5040')
      trunk(b, 0.3, 1.3, 0.1, -0.5, 2.6, -0.2, 0.18, '#5d5040')
      trunk(b, 0.3, 1.3, 0.1, 1.1, 2.5, 0.4, 0.16, '#5d5040')
      for (let i = 0; i < 4; i += 1) {
        const a = (i / 4) * Math.PI * 2 + random()
        blob(b, random, Math.cos(a) * 1.2, 3.0 + random() * 0.6, Math.sin(a) * 1.2, 1.5, 0.95, 1.5, i % 2 ? '#6b7552' : '#77805c')
      }
      blob(b, random, 0, 3.7, 0, 1.4, 0.9, 1.4, '#727b57')
      break
    }
    case 'bush': {
      for (let i = 0; i < 3; i += 1) {
        const a = (i / 3) * Math.PI * 2 + random()
        blob(b, random, Math.cos(a) * 0.45, 0.55 + random() * 0.2, Math.sin(a) * 0.45, 0.75, 0.62, 0.75, i % 2 ? '#4f5a34' : '#5a6439')
      }
      break
    }
    case 'shrub': {
      blob(b, random, 0, 0.32, 0, 0.62, 0.42, 0.62, '#76704a')
      blob(b, random, 0.3, 0.42, 0.15, 0.4, 0.36, 0.4, '#857c52')
      break
    }
    case 'rock': {
      b.geometry(ROCKS[variant % ROCKS.length], 0, 0.25, 0, vary('#7a756c', random, 0.1), random() * 0.5, random() * Math.PI, random() * 0.3, 1.0, 0.62, 0.85)
      break
    }
  }
  return b.build()
}

export interface PlantInstance {
  kind: PlantKind
  variant: number
  x: number
  y: number
  z: number
  scale: number
  rot: number
  tint: number
}
