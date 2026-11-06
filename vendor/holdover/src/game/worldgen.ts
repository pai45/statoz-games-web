// Deterministic, DOM-free world generation: terrain, roads, sites, vegetation,
// colliders and nest light baking. The renderer wraps these buffers in materials.
import * as THREE from 'three'

import { MeshBuilder, vary } from './builder.ts'
import { CollisionWorld, box as boxCollider, cylinder as cylCollider, type Collider } from './collision.ts'
import { DUEL_ARENAS, MISSIONS, type NestSpec } from './data.ts'
import {
  CHECKPOINT,
  COMPOUND,
  DEPOT,
  FLOOR_HEIGHT,
  NEST,
  OUTPOST,
  ROADS,
  VILLAGE,
  VILLAGE_BUILDINGS,
  ZONES,
  type BuildingSpec,
} from './layout.ts'
import { clamp, fbm2, mulberry32, smoothstep, valueNoise2 } from './noise.ts'
import {
  BAG,
  Frame,
  PAL,
  barrels,
  boomBarrier,
  building,
  churchTower,
  compoundWall,
  crateStack,
  createSite,
  fence,
  flagPole,
  generator,
  hescoRow,
  jerseyBarrier,
  lightTower,
  marketStall,
  pipeRack,
  powerPole,
  prefabCabin,
  radioMast,
  rubble,
  sandbagLine,
  sandbagRing,
  satelliteDish,
  shippingContainer,
  storageTank,
  streetLamp,
  vehicle,
  watchtower,
  waterTower,
  well,
  type FlagSpot,
  type LampSpot,
  type Site,
  type WireSpan,
} from './structures.ts'
import { EYE_Y, NEST_FLOOR, NEST_GROUND, terrainHeight } from './terrain.ts'
import { PLANT_SIZE, type PlantInstance, type PlantKind } from './vegetation.ts'

export const NEAR = { x0: -480, x1: 480, z0: -840, z1: 120, step: 2.5, chunk: 64 }
export const FAR = { x0: -6000, x1: 6000, z0: -7020, z1: 3000, step: 60 }

// ---------------------------------------------------------------------------
// Terrain colour

const TC = {
  dry: new THREE.Color('#8e8553'),
  green: new THREE.Color('#5d6a37'),
  olive: new THREE.Color('#717445'),
  soil: new THREE.Color('#7a6446'),
  rock: new THREE.Color('#7d776e'),
  rockDark: new THREE.Color('#5c5851'),
  snow: new THREE.Color('#e4e8eb'),
  dust: new THREE.Color('#a39478'),
  pad: new THREE.Color('#8f7f63'),
  paved: new THREE.Color('#a39b8c'),
  rubble: new THREE.Color('#857d71'),
}

interface Segment {
  ax: number
  az: number
  dx: number
  dz: number
  len2: number
  half: number
}

const ROAD_SEGMENTS: Segment[] = ROADS.flatMap((road) =>
  road.points.slice(1).map((point, index) => {
    const [ax, az] = road.points[index]
    const dx = point[0] - ax
    const dz = point[1] - az
    return { ax, az, dx, dz, len2: dx * dx + dz * dz, half: road.width / 2 }
  }),
)

/** Signed distance outside the nearest road edge (negative on the road). */
export function roadEdgeDistance(x: number, z: number): number {
  let best = Infinity
  for (const s of ROAD_SEGMENTS) {
    const px = x - s.ax
    const pz = z - s.az
    const t = clamp((px * s.dx + pz * s.dz) / s.len2, 0, 1)
    const ex = px - s.dx * t
    const ez = pz - s.dz * t
    const d = Math.sqrt(ex * ex + ez * ez) - s.half
    if (d < best) best = d
  }
  return best
}

const _c = new THREE.Color()

function terrainColor(x: number, z: number, h: number, ny: number, near: boolean, out: THREE.Color): THREE.Color {
  const slope = 1 - ny
  const n1 = fbm2(x / 140, z / 140, 3, 71) * 0.5 + 0.5
  const n2 = valueNoise2(x / 23, z / 23, 73) * 0.5 + 0.5
  out.copy(TC.dry).lerp(TC.green, smoothstep(0.42, 0.78, n1) * (1 - smoothstep(40, 170, h)))
  out.lerp(TC.olive, smoothstep(0.5, 0.9, n2) * 0.45)
  out.lerp(TC.soil, smoothstep(0.6, 0.85, n2) * 0.35 * (1 - smoothstep(0.42, 0.7, n1)))
  out.lerp(TC.rock, smoothstep(0.13, 0.3, slope))
  out.lerp(TC.rockDark, smoothstep(0.3, 0.55, slope) * 0.7)
  out.lerp(TC.rock, smoothstep(230, 340, h) * 0.75)
  const snow = smoothstep(390, 470, h + (n1 - 0.5) * 70) * (1 - smoothstep(0.4, 0.62, slope))
  out.lerp(TC.snow, snow)
  if (near) {
    const road = roadEdgeDistance(x, z)
    if (road < 6) out.lerp(TC.dust, (1 - smoothstep(-1, 6, road)) * 0.75)
    for (const zone of Object.values(ZONES)) {
      const d = Math.hypot(x - zone.center[0], z - zone.center[1])
      if (d < zone.radius * 1.2) out.lerp(TC.pad, (1 - smoothstep(zone.radius * 0.7, zone.radius * 1.2, d)) * 0.7)
    }
    const square = Math.hypot(x - VILLAGE.square[0], z - VILLAGE.square[1])
    if (square < 30) out.lerp(TC.paved, (1 - smoothstep(18, 30, square)) * 0.85)
    const nest = Math.hypot(x - NEST.x, z - NEST.z)
    if (nest < 16) out.lerp(TC.rubble, (1 - smoothstep(6, 16, nest)) * 0.7)
  }
  return out
}

// ---------------------------------------------------------------------------
// Terrain meshes

interface Grid {
  nx: number
  nz: number
  x0: number
  z0: number
  step: number
  heights: Float32Array
  normals: Float32Array
  colors: Float32Array
}

function buildGrid(x0: number, z0: number, nx: number, nz: number, step: number, near: boolean, skip?: (i: number, j: number) => boolean): Grid {
  const heights = new Float32Array(nx * nz)
  for (let j = 0; j < nz; j += 1) {
    for (let i = 0; i < nx; i += 1) {
      if (skip?.(i, j)) continue
      heights[j * nx + i] = terrainHeight(x0 + i * step, z0 + j * step)
    }
  }
  const normals = new Float32Array(nx * nz * 3)
  const colors = new Float32Array(nx * nz * 3)
  const n = new THREE.Vector3()
  for (let j = 0; j < nz; j += 1) {
    for (let i = 0; i < nx; i += 1) {
      if (skip?.(i, j)) continue
      const index = j * nx + i
      const il = Math.max(0, i - 1)
      const ir = Math.min(nx - 1, i + 1)
      const jd = Math.max(0, j - 1)
      const ju = Math.min(nz - 1, j + 1)
      const hx = (heights[j * nx + ir] - heights[j * nx + il]) / ((ir - il) * step)
      const hz = (heights[ju * nx + i] - heights[jd * nx + i]) / ((ju - jd) * step)
      n.set(-hx, 1, -hz).normalize()
      normals.set([n.x, n.y, n.z], index * 3)
      terrainColor(x0 + i * step, z0 + j * step, heights[index], n.y, near, _c)
      colors.set([_c.r, _c.g, _c.b], index * 3)
    }
  }
  return { nx, nz, x0, z0, step, heights, normals, colors }
}

function gridChunk(grid: Grid, i0: number, j0: number, i1: number, j1: number, skipCell?: (i: number, j: number) => boolean): THREE.BufferGeometry | null {
  const w = i1 - i0 + 1
  const h = j1 - j0 + 1
  const positions = new Float32Array(w * h * 3)
  const normals = new Float32Array(w * h * 3)
  const colors = new Float32Array(w * h * 3)
  const uvs = new Float32Array(w * h * 2)
  for (let j = 0; j < h; j += 1) {
    for (let i = 0; i < w; i += 1) {
      const gi = i0 + i
      const gj = j0 + j
      const g = gj * grid.nx + gi
      const v = j * w + i
      const x = grid.x0 + gi * grid.step
      const z = grid.z0 + gj * grid.step
      positions[v * 3] = x
      positions[v * 3 + 1] = grid.heights[g]
      positions[v * 3 + 2] = z
      normals.set(grid.normals.subarray(g * 3, g * 3 + 3), v * 3)
      colors.set(grid.colors.subarray(g * 3, g * 3 + 3), v * 3)
      uvs[v * 2] = x / 9
      uvs[v * 2 + 1] = z / 9
    }
  }
  const indices: number[] = []
  for (let j = 0; j < h - 1; j += 1) {
    for (let i = 0; i < w - 1; i += 1) {
      if (skipCell?.(i0 + i, j0 + j)) continue
      const a = j * w + i
      const b = a + 1
      const c = a + w
      const d = c + 1
      indices.push(a, c, b, b, c, d)
    }
  }
  if (indices.length === 0) return null
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2))
  geometry.setIndex(indices)
  geometry.computeBoundingSphere()
  geometry.computeBoundingBox()
  return geometry
}

/** Vertical curtain hanging below a closed loop of grid vertices to hide LOD cracks. */
function skirt(grid: Grid, loop: Array<[number, number]>, depth: number): THREE.BufferGeometry {
  const positions: number[] = []
  const colors: number[] = []
  const normals: number[] = []
  const uvs: number[] = []
  const indices: number[] = []
  loop.forEach(([i, j], k) => {
    const g = j * grid.nx + i
    const x = grid.x0 + i * grid.step
    const z = grid.z0 + j * grid.step
    const y = grid.heights[g]
    positions.push(x, y, z, x, y - depth, z)
    for (let r = 0; r < 2; r += 1) {
      colors.push(grid.colors[g * 3] * 0.8, grid.colors[g * 3 + 1] * 0.8, grid.colors[g * 3 + 2] * 0.8)
      normals.push(0, 1, 0)
      uvs.push(x / 9, (z + r * depth) / 9)
    }
    if (k > 0) {
      const a = (k - 1) * 2
      const b = k * 2
      indices.push(a, a + 1, b, b, a + 1, b + 1, a, b, a + 1, b, b + 1, a + 1)
    }
  })
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3))
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
  geometry.setIndex(indices)
  geometry.computeBoundingSphere()
  return geometry
}

function rectLoop(i0: number, j0: number, i1: number, j1: number, stride: number): Array<[number, number]> {
  const loop: Array<[number, number]> = []
  for (let i = i0; i < i1; i += stride) loop.push([i, j0])
  for (let j = j0; j < j1; j += stride) loop.push([i1, j])
  for (let i = i1; i > i0; i -= stride) loop.push([i, j1])
  for (let j = j1; j > j0; j -= stride) loop.push([i0, j])
  loop.push([i0, j0])
  return loop
}

export interface TerrainBuild {
  near: THREE.BufferGeometry[]
  far: THREE.BufferGeometry[]
  skirts: THREE.BufferGeometry[]
}

export function buildTerrain(): TerrainBuild {
  const nnx = Math.round((NEAR.x1 - NEAR.x0) / NEAR.step) + 1
  const nnz = Math.round((NEAR.z1 - NEAR.z0) / NEAR.step) + 1
  const near = buildGrid(NEAR.x0, NEAR.z0, nnx, nnz, NEAR.step, true)
  const chunks: THREE.BufferGeometry[] = []
  for (let j = 0; j < nnz - 1; j += NEAR.chunk) {
    for (let i = 0; i < nnx - 1; i += NEAR.chunk) {
      const chunk = gridChunk(near, i, j, Math.min(nnx - 1, i + NEAR.chunk), Math.min(nnz - 1, j + NEAR.chunk))
      if (chunk) chunks.push(chunk)
    }
  }
  const fnx = Math.round((FAR.x1 - FAR.x0) / FAR.step) + 1
  const fnz = Math.round((FAR.z1 - FAR.z0) / FAR.step) + 1
  const hi0 = Math.round((NEAR.x0 - FAR.x0) / FAR.step)
  const hi1 = Math.round((NEAR.x1 - FAR.x0) / FAR.step)
  const hj0 = Math.round((NEAR.z0 - FAR.z0) / FAR.step)
  const hj1 = Math.round((NEAR.z1 - FAR.z0) / FAR.step)
  const inHole = (i: number, j: number) => i > hi0 && i < hi1 && j > hj0 && j < hj1
  const far = buildGrid(FAR.x0, FAR.z0, fnx, fnz, FAR.step, false, inHole)
  const skipCell = (i: number, j: number) => i >= hi0 && i < hi1 && j >= hj0 && j < hj1
  const farChunks: THREE.BufferGeometry[] = []
  const tilesX = 4
  const tilesZ = 3
  for (let tz = 0; tz < tilesZ; tz += 1) {
    for (let tx = 0; tx < tilesX; tx += 1) {
      const i0 = Math.floor(((fnx - 1) * tx) / tilesX)
      const i1 = Math.floor(((fnx - 1) * (tx + 1)) / tilesX)
      const j0 = Math.floor(((fnz - 1) * tz) / tilesZ)
      const j1 = Math.floor(((fnz - 1) * (tz + 1)) / tilesZ)
      const chunk = gridChunk(far, i0, j0, i1, j1, skipCell)
      if (chunk) farChunks.push(chunk)
    }
  }
  const nearLoop = rectLoop(0, 0, nnx - 1, nnz - 1, 1)
  const farLoop = rectLoop(hi0, hj0, hi1, hj1, 1)
  return { near: chunks, far: farChunks, skirts: [skirt(near, nearLoop, 45), skirt(far, farLoop, 45)] }
}

// ---------------------------------------------------------------------------
// Roads

export function buildRoads(): THREE.BufferGeometry {
  const positions: number[] = []
  const colors: number[] = []
  const normals: number[] = []
  const uvs: number[] = []
  const indices: number[] = []
  const random = mulberry32(91)
  const inside = (x: number, z: number) => x > NEAR.x0 + 3 && x < NEAR.x1 - 3 && z > NEAR.z0 + 3 && z < NEAR.z1 - 3
  const strip = (samples: THREE.Vector3[], offsetA: number, offsetB: number, lift: number, color: (t: number, side: number) => THREE.Color, dash?: number) => {
    let base = -1
    let length = 0
    for (let k = 0; k < samples.length; k += 1) {
      const p = samples[k]
      const prev = samples[Math.max(0, k - 1)]
      const next = samples[Math.min(samples.length - 1, k + 1)]
      const tx = next.x - prev.x
      const tz = next.z - prev.z
      const tl = Math.hypot(tx, tz) || 1
      const nx = -tz / tl
      const nz = tx / tl
      if (k > 0) length += Math.hypot(p.x - samples[k - 1].x, p.z - samples[k - 1].z)
      const visible = inside(p.x, p.z) && (dash === undefined || length % (dash * 2) < dash)
      if (!visible) {
        base = -1
        continue
      }
      const start = positions.length / 3
      for (const [side, offset] of [
        [0, offsetA],
        [1, offsetB],
      ] as const) {
        const x = p.x + nx * offset
        const z = p.z + nz * offset
        positions.push(x, terrainHeight(x, z) + lift, z)
        const c = color(length, side)
        colors.push(c.r, c.g, c.b)
        normals.push(0, 1, 0)
        uvs.push(x * 0.4, z * 0.4)
      }
      if (base >= 0) indices.push(base, base + 1, start, start, base + 1, start + 1)
      base = start
    }
  }
  for (const road of ROADS) {
    const curve = new THREE.CatmullRomCurve3(road.points.map(([x, z]) => new THREE.Vector3(x, 0, z)), false, 'centripetal', 0.2)
    const samples = curve.getSpacedPoints(Math.ceil(curve.getLength() / 2.5))
    const half = road.width / 2
    const lift = road.flatten ? 0.07 : 0.11
    if (road.surface === 'asphalt') {
      const asphalt = new THREE.Color('#3f4142')
      const worn = new THREE.Color('#5b5650')
      strip(samples, -half - 0.9, -half, lift - 0.01, () => vary(worn, random, 0.05))
      strip(samples, half, half + 0.9, lift - 0.01, () => vary(worn, random, 0.05))
      strip(samples, -half, half, lift, (t) => vary(asphalt, random, 0.03).lerp(worn, (valueNoise2(t / 9, 0, 5) * 0.5 + 0.5) * 0.35))
      const paint = new THREE.Color('#c9c3ae')
      strip(samples, -0.08, 0.08, lift + 0.015, () => paint, 4.5)
      strip(samples, -half + 0.25, -half + 0.4, lift + 0.015, () => paint)
      strip(samples, half - 0.4, half - 0.25, lift + 0.015, () => paint)
    } else {
      const dirt = new THREE.Color('#8b7657')
      const rut = new THREE.Color('#6d5b43')
      strip(samples, -half, half, lift, (t, side) => vary(dirt, random, 0.04).lerp(rut, side * 0.1 + (valueNoise2(t / 6, side, 9) * 0.5 + 0.5) * 0.15))
      strip(samples, -1.15, -0.7, lift + 0.012, () => vary(rut, random, 0.05))
      strip(samples, 0.7, 1.15, lift + 0.012, () => vary(rut, random, 0.05))
    }
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3))
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
  geometry.setIndex(indices)
  geometry.computeBoundingSphere()
  return geometry
}

// ---------------------------------------------------------------------------
// Zones

const spec = (id: string, s: { x: number; z: number; w: number; d: number; floors: number }, color: string, extra: Partial<BuildingSpec> = {}): BuildingSpec => ({
  id,
  x: s.x,
  z: s.z,
  w: s.w,
  d: s.d,
  floors: s.floors,
  color,
  ...extra,
})

function guardBooth(site: Site, x: number, z: number, w: number, d: number, h: number, base: number): void {
  const f = new Frame(site, x, base, z, 0)
  f.box('std', 0, -0.2, 0, w, 1.2, d, vary('#b8b1a1', site.rnd, 0.03), { collide: 'concrete' })
  f.box('glass', 0, 1.0, 0, w - 0.1, 1.2, d - 0.1, '#232b30', { collide: 'glass', soft: true })
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) f.box('std', (sx * (w - 0.12)) / 2, 1.0, (sz * (d - 0.12)) / 2, 0.14, 1.25, 0.14, '#b8b1a1')
  f.box('std', 0, 2.25, 0, w + 0.5, 0.2, d + 0.5, '#7d786f', { collide: 'concrete' })
  f.box('std', 0, h - 0.25, 0, w + 0.2, 0.2, d + 0.2, '#9c968b')
}

function buildCheckpoint(site: Site): void {
  const base = ZONES.checkpoint.height
  const C = CHECKPOINT
  guardBooth(site, C.booth.x, C.booth.z, C.booth.w, C.booth.d, C.booth.h, base)
  boomBarrier(site, C.barrierX, -145.8, Math.PI / 2, base)
  C.barriers.forEach(([x, z], i) => jerseyBarrier(site, x, z, [0.12, -0.28, 0.2][i] ?? 0, base))
  sandbagRing(site, C.bunker.x, C.bunker.z, C.bunker.r, base, 1.15, Math.PI)
  watchtower(site, C.tower.x, C.tower.z, C.tower.platform, base, 'wood')
  shippingContainer(site, C.container.x, C.container.z, 0.3, 1, '#2f4c63', base, 6.1)
  building(site, spec('barracks', C.barracks, '#a9a48f'), base, { prefab: true, parapet: 0.25, glow: 0.4 })
  vehicle(site, 'truck', C.truck.x, C.truck.z, C.truck.rot, '#525a3a', base)
  flagPole(site, C.flag.x, C.flag.z, base, 7, ['#7a2a22', '#e3dccb'])
  hescoRow(site, -38, -173, 0, 22, base)
  hescoRow(site, -66, -158, Math.PI / 2, 9, base)
  hescoRow(site, -71, -136, 0.05, 8, base, 1.2)
  const f = new Frame(site, -50, base, -144, 0.1)
  sandbagLine(f, 0, 0, 0, 3.2, 3)
  crateStack(site, -8, -150, 0.4, base, 5)
  barrels(site, -56, -168, base, 5, '#4e5636')
  streetLamp(site, -22, -137, Math.PI, base)
  vehicle(site, 'pickup', -64, -147.5, 1.35, '#c4b89a', base)
  site.lamps.push({ x: -27, y: base + 2.9, z: -143, color: '#ffd9a0', size: 1.4, kind: 'street' })
}

const STALL_COLORS = ['#b5462f', '#2f5d7c', '#d1b04a', '#567a3a']

function buildVillage(site: Site): void {
  const base = ZONES.village.height
  for (const building_ of VILLAGE_BUILDINGS) building(site, building_, base, { glow: 0.32 })
  well(site, VILLAGE.well[0], VILLAGE.well[1], base)
  VILLAGE.stalls.forEach(([x, z], i) => marketStall(site, x, z, 0, STALL_COLORS[i % STALL_COLORS.length], base))
  for (const car of VILLAGE.cars) vehicle(site, 'sedan', car.x, car.z, car.rot, car.color, base)
  waterTower(site, VILLAGE.waterTower.x, VILLAGE.waterTower.z, VILLAGE.waterTower.platform, base)
  churchTower(site, -10, -324, base)
  for (const [x, z, rot] of [
    [47, -246.5, 0],
    [77, -246.5, 0],
    [36.5, -268, Math.PI / 2],
    [88.5, -262, -Math.PI / 2],
    [112, -252, 0],
  ] as const) {
    streetLamp(site, x, z, rot, base)
  }
  crateStack(site, 33, -284, 0.3, base, 4)
  barrels(site, 89.5, -285, base, 5, '#3f5a6e')
  crateStack(site, 104, -287, -0.2, base, 3)
  vehicle(site, 'pickup', 14, -278, 1.2, '#d0c8b4', base)
  flagPole(site, 80, VILLAGE_BUILDINGS[12].z - 3.2 + 0, base + 3 * FLOOR_HEIGHT, 4, ['#2f5d7c', '#e8e1cf'])
  // Rubble from a shelled corner.
  const r = new Frame(site, -14, base, -229, 0)
  rubble(r, 0, 0, 0, 6, 40, '#b0a58f')
  // Low walls around plots.
  const wall = (x0: number, z0: number, x1: number, z1: number) => compoundWall(site, x0, z0, x1, z1, 1.4, base, '#b7aa90')
  wall(108, -302, 128, -302)
  wall(-6, -288, -6, -310)
  wall(116, -330, 132, -330)
}

function buildDepot(site: Site): void {
  const base = ZONES.depot.height
  const F = DEPOT.fence
  fence(site, F.minX, F.maxZ, F.gate[0], F.maxZ, base)
  fence(site, F.gate[1], F.maxZ, F.maxX, F.maxZ, base)
  fence(site, F.maxX, F.maxZ, F.maxX, F.minZ, base)
  fence(site, F.maxX, F.minZ, F.minX, F.minZ, base)
  fence(site, F.minX, F.minZ, F.minX, F.maxZ, base)
  for (const x of F.gate) new Frame(site, x, base, F.maxZ, 0).box('std', 0, 0, 0, 0.5, 2.9, 0.5, PAL.concrete, { collide: 'concrete' })
  for (const tank of DEPOT.bigTanks) storageTank(site, tank.x, tank.z, tank.r, tank.h, base)
  for (const tank of DEPOT.smallTanks) storageTank(site, tank.x, tank.z, tank.r, tank.h, base)
  for (const c of DEPOT.containers) shippingContainer(site, c.x, c.z, c.rot, c.stack, c.color, base)
  pipeRack(site, DEPOT.pipeZ, -216, -140, base)
  building(site, spec('office', DEPOT.office, '#c2bba6', { roofProps: ['ac', 'antenna'] }), base, { parapet: 0.5, glow: 0.4 })
  for (const t of DEPOT.trucks) vehicle(site, 'tanker', t.x, t.z, t.rot, '#7e8b5e', base)
  generator(site, DEPOT.generator.x, DEPOT.generator.z, 0, base)
  lightTower(site, DEPOT.lightTower.x, DEPOT.lightTower.z, base)
  flagPole(site, -137, -342, base, 6.5, ['#e86a2c', '#f2efe6'], 'windsock')
  sandbagLine(new Frame(site, -145, base + 5.2, -324.35, 0), 0, 0, 0, 2.3, 1)
  barrels(site, -213, -350, base, 6, '#9a4a36')
  barrels(site, -136, -320, base, 4, '#3f5a6e')
  crateStack(site, -205, -312, 0, base, 4)
  guardBooth(site, -186, -305, 2.2, 2.2, 2.6, base)
  streetLamp(site, -175, -306, Math.PI, base)
}

function porch(site: Site): void {
  const V = COMPOUND.villa
  const south = V.z + V.d / 2
  const f = new Frame(site, V.x, 0, 0, 0)
  f.box('std', 0, -0.2, south + 1.7, 20.4, 0.23, 3.4, '#a69a85')
  for (const x of [-8.5, -4, 4, 8.5]) {
    f.cyl('std', x, 0.03, south + 3.15, 0.18, 2.95, '#e2d9c6', { seg: 10, collide: 'concrete' })
    f.box('std', x, 0.03, south + 3.15, 0.5, 0.25, 0.5, '#cfc5b0')
  }
  f.box('std', 0, 2.98, south + 1.75, 20.6, 0.26, 3.7, '#d9cfba', { collide: 'concrete' })
  f.box('metal', 0, 3.24, south + 3.55, 20.6, 0.05, 0.05, PAL.metal)
  f.box('metal', 0, 4.15, south + 3.55, 20.6, 0.05, 0.05, PAL.metal)
  for (let i = 0; i <= 24; i += 1) f.box('metal', -10.3 + i * 0.86, 3.24, south + 3.55, 0.03, 0.92, 0.03, PAL.metal)
  // Entrance steps and planters.
  for (const x of [-6, 6]) {
    f.box('std', x, 0, south + 3.9, 1.0, 0.6, 1.0, '#8a7d66')
    f.blob('foliage', x, 0.95, south + 3.9, 0.55, 0.5, 0.55, '#55663a')
  }
}

function buildCompound(site: Site): void {
  const C = COMPOUND
  const base = ZONES.compound.height
  compoundWall(site, C.minX, C.maxZ, C.gate[0], C.maxZ, C.southWallHeight, base)
  compoundWall(site, C.gate[1], C.maxZ, C.maxX, C.maxZ, C.southWallHeight, base)
  compoundWall(site, C.maxX, C.maxZ, C.maxX, C.minZ, C.wallHeight, base)
  compoundWall(site, C.maxX, C.minZ, C.minX, C.minZ, C.wallHeight, base)
  compoundWall(site, C.minX, C.minZ, C.minX, C.maxZ, C.wallHeight, base)
  for (const x of C.gate) {
    new Frame(site, x, base, C.maxZ, 0).box('std', 0, -0.3, 0, 0.75, 3.5, 0.75, '#b9ab90', { collide: 'concrete' })
  }
  // Gate leaves swung open inward.
  const leaf = (x: number, rot: number) => {
    const f = new Frame(site, x, base, C.maxZ - 0.2, rot)
    f.box('metal', 2.4, 0.05, 0, 4.8, 2.3, 0.06, '#2f3336')
    for (let i = 0; i < 9; i += 1) f.box('metal', 0.3 + i * 0.52, 0.05, 0.04, 0.05, 2.3, 0.03, '#4b5054')
  }
  leaf(C.gate[0] + 0.3, -1.25)
  leaf(C.gate[1] - 0.3, Math.PI + 1.25)
  building(site, spec('villa', C.villa, '#ddd2bb', { roofProps: ['dish', 'tank', 'ac', 'antenna'] }), base, { glow: 0.45 })
  porch(site)
  building(site, spec('garage', C.garage, '#c9bea7'), base, { parapet: 0.35, door: 'east', glow: 0.2 })
  building(site, spec('shed', C.shed, '#b9ae97'), base, { parapet: 0.3, door: 'west' })
  watchtower(site, C.tower.x, C.tower.z, C.tower.platform, base, 'steel')
  vehicle(site, 'suv', C.escapeVehicle.x, C.escapeVehicle.z, C.escapeVehicle.rot, '#1d1f21', base)
  for (const v of C.vehicles) vehicle(site, 'pickup', v.x, v.z, v.rot, '#a8916a', base)
  generator(site, 178, -428, Math.PI / 2, base)
  crateStack(site, 120, -412.5, 0, base, 4)
  barrels(site, 179, -476, base, 4, '#4e5636')
  satelliteDish(site, 170, -476, base, 2.6)
  flagPole(site, 158, C.villa.z - 4, base + C.villa.floors * FLOOR_HEIGHT, 4, ['#1f2a1f', '#b8913f'])
  for (const [x, z] of [
    [138, -428],
    [162, -428],
  ] as const) {
    streetLamp(site, x, z, 0, base)
  }
}

function buildOutpost(site: Site): void {
  const O = OUTPOST
  const base = ZONES.outpost.height
  radioMast(site, O.mast.x, O.mast.z, O.mast.h, base)
  sandbagRing(site, O.bunker.x, O.bunker.z, O.bunker.r, base, 1.15, Math.PI)
  O.cabins.forEach((c, i) => prefabCabin(site, c.x, c.z, c.rot, base, i === 1))
  satelliteDish(site, O.dish.x, O.dish.z, base, 3.4)
  vehicle(site, 'truck', O.truck.x, O.truck.z, O.truck.rot, '#4e5636', base)
  flagPole(site, O.flag.x, O.flag.z, base, 7.5, ['#7a2a22', '#1e1e1e'])
  flagPole(site, -70, -664, base, 5.5, ['#e86a2c', '#f2efe6'], 'windsock')
  hescoRow(site, -38, -737, 0, 40, base)
  hescoRow(site, -91, -708, Math.PI / 2, 24, base)
  hescoRow(site, 15, -708, Math.PI / 2, 24, base)
  generator(site, -70, -712, 0.3, base)
  crateStack(site, -12, -705, 0.2, base, 5)
  barrels(site, -78, -690, base, 6, '#4e5636')
  sandbagLine(new Frame(site, -40, base, -648, 0), 0, 0, 0, 8, 2)
  lightTower(site, -76, -720, base, 9)
}

const RURAL: Array<[number, number, number, number, string]> = [
  [-128, -252, 9, 7, '#bcae92'],
  [214, -182, 10, 8, '#c6b89c'],
  [-262, -424, 9, 8, '#b2a489'],
  [262, -526, 11, 8, '#c1b296'],
  [-300, -122, 8, 7, '#b9ab90'],
  [334, -362, 10, 9, '#c4b498'],
  [-170, -560, 9, 7, '#b8aa8e'],
  [214, -640, 10, 8, '#bfb093'],
]

function buildCountryside(site: Site): void {
  RURAL.forEach(([x, z, w, d, color], i) => {
    const base = terrainHeight(x, z) - 0.3
    building(site, { id: `R${i}`, x, z, w, d, floors: i % 3 === 0 ? 2 : 1, color, roofProps: i % 2 ? ['tank'] : ['dish'] }, base, { glow: 0.5 })
  })
  vehicle(site, 'sedan', -118, -139, 0.4, '#3b3936', terrainHeight(-118, -139))
  vehicle(site, 'truck', 238, -318, 2.2, '#4a4436', terrainHeight(238, -318))
  // Power line along the main road.
  const road = ROADS[0]
  const curve = new THREE.CatmullRomCurve3(road.points.map(([x, z]) => new THREE.Vector3(x, 0, z)), false, 'centripetal', 0.2)
  const samples = curve.getSpacedPoints(Math.ceil(curve.getLength() / 42))
  let previous: [number, number, number][] | null = null
  for (let k = 0; k < samples.length; k += 1) {
    const p = samples[k]
    const next = samples[Math.min(samples.length - 1, k + 1)]
    const prev = samples[Math.max(0, k - 1)]
    const tx = next.x - prev.x
    const tz = next.z - prev.z
    const tl = Math.hypot(tx, tz) || 1
    // Poles stand on the far (north) side of the road.
    const side = tx / tl > 0 ? 1 : -1
    const x = p.x + (tz / tl) * 9 * side
    const z = p.z - (tx / tl) * 9 * side
    const insideNear = x > NEAR.x0 + 10 && x < NEAR.x1 - 10 && z > NEAR.z0 + 10 && z < NEAR.z1 - 10
    const inZone = Object.values(ZONES).some((zone) => Math.hypot(x - zone.center[0], z - zone.center[1]) < zone.radius + 6)
    if (!insideNear || inZone) {
      previous = null
      continue
    }
    const tips = powerPole(site, x, z, Math.atan2(tz, tx) * -1 + Math.PI / 2, terrainHeight(x, z))
    if (previous) previous.forEach((a, n) => site.wires.push({ a, b: tips[n], sag: 0.9 }))
    previous = tips
  }
}

// ---------------------------------------------------------------------------
// Player nest: a shelled two-storey house on the ridge.

const subBoxCache = new Map<string, THREE.BufferGeometry>()

function subBox(sx: number, sy: number, sz: number): THREE.BufferGeometry {
  const nx = Math.max(1, Math.ceil(sx / 0.35))
  const ny = Math.max(1, Math.ceil(sy / 0.35))
  const nz = Math.max(1, Math.ceil(sz / 0.35))
  const key = `${nx}:${ny}:${nz}`
  let geometry = subBoxCache.get(key)
  if (!geometry) {
    geometry = new THREE.BoxGeometry(1, 1, 1, nx, ny, nz)
    subBoxCache.set(key, geometry)
  }
  return geometry
}

function slab(f: Frame, lx: number, ly0: number, lz: number, sx: number, sy: number, sz: number, color: THREE.ColorRepresentation, collide = true): void {
  f.geom('std', subBox(sx, sy, sz), lx, ly0 + sy / 2, lz, sx, sy, sz, color)
  if (collide) f.site.col.add(boxCollider(f.wx(lx, lz), f.y + ly0 + sy / 2, f.wz(lx, lz), sx, sy, sz, 'concrete', f.rot), f.site.group)
}

export function buildNest(site: Site): void {
  const f = new Frame(site, NEST.x, NEST_GROUND, 0, 0)
  const rnd = site.rnd
  const floor = NEST_FLOOR - NEST_GROUND
  const outer = NEST.wallZ - NEST.wallThickness
  const t = NEST.wallThickness
  const back = 35.6
  const hw = 4.25
  const plaster = '#b6ab98'
  const concrete = '#8e887e'
  const sill = floor + NEST.sillHeight
  const top = floor + NEST.openingTop
  const ceiling = floor + 3.2
  const zc = (outer + back) / 2
  const depth = back - outer
  // Foundations and ground floor shell.
  slab(f, 0, -0.6, zc, hw * 2 + 0.3, 0.7, depth + 0.3, '#6e685f')
  slab(f, 0, 0, outer + t / 2, hw * 2, floor, t, plaster)
  slab(f, -hw + t / 2, 0, zc, t, floor, depth, plaster)
  slab(f, hw - t / 2, 0, zc, t, floor, depth, plaster)
  slab(f, 0, 0, back - t / 2, hw * 2, floor, t, plaster)
  slab(f, 0, floor - 0.3, zc, hw * 2 - t * 2, 0.3, depth - t * 2, '#7d776d')
  // Upper north wall with the firing opening.
  slab(f, 0, floor, outer + t / 2, hw * 2, NEST.sillHeight, t, plaster)
  const side = hw - NEST.openingHalfWidth
  slab(f, -NEST.openingHalfWidth - side / 2, sill, outer + t / 2, side, top - sill, t, plaster)
  slab(f, NEST.openingHalfWidth + side / 2, sill, outer + t / 2, side, top - sill, t, plaster)
  slab(f, -0.9, top, outer + t / 2, hw * 2 - 1.8, 0.65, t, plaster)
  slab(f, -hw + 0.6, top + 0.65, outer + t / 2, 1.2, 0.3, t, plaster)
  // Side walls: the west one has a shell breach.
  slab(f, hw - t / 2, floor, zc, t, ceiling - floor, depth - t * 2, plaster)
  const breach0 = 31.4
  const breach1 = 33.3
  slab(f, -hw + t / 2, floor, (outer + t + breach0) / 2, t, ceiling - floor, breach0 - outer - t, plaster)
  slab(f, -hw + t / 2, floor, (breach1 + back - t) / 2, t, ceiling - floor, back - t - breach1, plaster)
  slab(f, -hw + t / 2, floor, (breach0 + breach1) / 2, t, 0.55, breach1 - breach0, plaster)
  slab(f, -hw + t / 2, ceiling - 0.6, (breach0 + breach1) / 2, t, 0.6, breach1 - breach0, plaster)
  // Rear wall with a stairwell doorway at x in [-3.15, -2.05].
  slab(f, 1.1, floor, back - t / 2, 6.3, ceiling - floor, t, plaster)
  slab(f, -hw + 0.55, floor, back - t / 2, 1.1, ceiling - floor, t, plaster)
  slab(f, -2.6, floor + 2.3, back - t / 2, 1.1, ceiling - floor - 2.3, t, plaster)
  // Partial roof over the rear half; the front collapsed.
  slab(f, 0, ceiling, 33.6, hw * 2, 0.3, 4.0, '#7f796f')
  slab(f, -2.2, ceiling, 31.1, 3.8, 0.3, 1.0, '#7f796f')
  // Rebar curling out of the broken slab edge.
  for (let i = 0; i < 9; i += 1) {
    const x = -3.6 + i * 0.85 + rnd() * 0.2
    f.tube('metal', [x, ceiling + 0.12, 31.6], [x + (rnd() - 0.5) * 0.4, ceiling - 0.25 - rnd() * 0.5, 30.9 - rnd() * 0.4], 0.012, '#4a3b30', 4)
  }
  // A fallen slab leaning on the east wall.
  f.geom('std', subBox(1.6, 0.2, 2.4), 3.2, floor + 1.0, 31.2, 1.6, 0.2, 2.4, concrete, 0.1, 0.05, 1.05)
  // Debris, gear, and the shooter's kit.
  rubble(f, -3.2, floor, 29.3, 1.2, 26, concrete)
  rubble(f, 3.3, floor, 29.4, 1.1, 22, '#9b9488')
  rubble(f, -3.0, floor, 33.0, 1.4, 18, plaster)
  rubble(f, 0, 0, 27.0, 5.0, 40, '#8a8378')
  sandbagLine(f, -2.45, floor, NEST.wallZ + 0.3, 1.9, 3)
  sandbagLine(f, 2.45, floor, NEST.wallZ + 0.3, 1.9, 3)
  f.box('cloth', 1.8, floor, 32.2, 0.85, 0.12, 1.95, '#4d5338')
  f.box('cloth', 1.8, floor + 0.12, 31.4, 0.7, 0.14, 0.35, '#5c6244')
  f.box('std', -2.2, floor, 31.0, 0.75, 0.4, 0.45, '#4f5636')
  f.box('metal', -2.2, floor + 0.4, 31.0, 0.32, 0.18, 0.2, '#2a2d2b')
  f.box('std', -1.7, floor, 33.6, 1.2, 0.72, 0.7, '#5b4632')
  f.box('cloth', -1.7, floor + 0.72, 33.6, 0.9, 0.01, 0.6, '#c8bc98')
  f.box('metal', -2.0, floor + 0.73, 33.7, 0.3, 0.12, 0.2, '#30332f')
  for (let i = 0; i < 6; i += 1) {
    f.geom('metal', BAG, -0.6 + rnd() * 1.3, floor + 0.012, NEST.wallZ + 0.35 + rnd() * 0.5, 0.008, 0.008, 0.035, '#b48a3c', 0, rnd() * Math.PI, Math.PI / 2)
  }
  // Camouflage scrim hanging from the lintel at the sides of the opening.
  for (let i = 0; i < 7; i += 1) {
    const x = (i < 4 ? -1.45 : 1.0) + (i % 4) * 0.14
    f.box('cloth', x, top - 0.55 - rnd() * 0.3, NEST.wallZ - 0.05, 0.12, 0.55 + rnd() * 0.35, 0.02, vary(i % 2 ? '#4d5338' : '#6b5c43', rnd, 0.08))
  }
  // Tarp rolled up above the west breach so evening light still spills in.
  f.box('cloth', -hw + 0.2, ceiling - 0.82, (breach0 + breach1) / 2, 0.2, 0.2, breach1 - breach0 + 0.4, '#3f4733')
  f.box('cloth', -hw + 0.2, ceiling - 1.4, breach0 + 0.1, 0.02, 0.6, 0.25, '#3f4733')
}

// ---------------------------------------------------------------------------
// Sightline protection for vegetation placement and tests.

export interface SightTarget {
  x: number
  y: number
  z: number
  /** Extra lateral clearance in meters. */
  margin: number
  /** Vertical extent of the body below `y`. */
  body: number
  label: string
}

/** Approximate head-center height above the feet for each sniper pose. */
export function poseHead(nest: NestSpec): number {
  return nest.pose === 'prone' ? 0.32 : nest.pose === 'stand' ? 1.62 : nest.pose === 'crouch' ? 1.12 : 1.15
}

function nestFeet(nest: NestSpec): number {
  return nest.pos[1] ?? terrainHeight(nest.pos[0], nest.pos[2])
}

export function sightTargets(): SightTarget[] {
  const targets: SightTarget[] = []
  for (const mission of MISSIONS) {
    for (const spawn of mission.spawns) {
      const ground = (x: number, z: number) => spawn.y ?? terrainHeight(x, z)
      const add = (x: number, z: number, margin: number, label: string) =>
        targets.push({ x, y: ground(x, z) + 1.62, z, margin, body: 1.1, label: `${mission.id} ${spawn.kind} ${label}` })
      add(spawn.pos[0], spawn.pos[1], 1.5, `${spawn.pos[0]},${spawn.pos[1]}`)
      const behavior = spawn.behavior
      if (behavior.type === 'patrol' || behavior.type === 'escape') {
        const path = behavior.path
        for (let k = 1; k < path.length; k += 1) {
          const [ax, az] = path[k - 1]
          const [bx, bz] = path[k]
          const steps = Math.ceil(Math.hypot(bx - ax, bz - az) / 4)
          for (let s = 1; s <= steps; s += 1) add(ax + ((bx - ax) * s) / steps, az + ((bz - az) * s) / steps, 1.2, 'path')
        }
      }
      if (behavior.type === 'wander') {
        for (let k = 0; k < 6; k += 1) {
          const a = (k / 6) * Math.PI * 2
          add(spawn.pos[0] + Math.cos(a) * behavior.radius, spawn.pos[1] + Math.sin(a) * behavior.radius, 2, 'wander')
        }
      }
      if (behavior.type === 'sniper') {
        for (const nest of behavior.nests) {
          targets.push({ x: nest.pos[0], y: nestFeet(nest) + poseHead(nest), z: nest.pos[2], margin: 1, body: 0.2, label: `${mission.id} sniper nest` })
        }
      }
    }
  }
  for (const arena of DUEL_ARENAS) {
    for (const nest of arena.nests) {
      targets.push({ x: nest.pos[0], y: nestFeet(nest) + poseHead(nest), z: nest.pos[2], margin: 1, body: 0.2, label: `duel ${arena.id} ${nest.pos[0]},${nest.pos[2]}` })
    }
  }
  return targets
}

const EYE = { x: NEST.x, y: EYE_Y, z: NEST.z }

function blocksSight(targets: SightTarget[], x: number, z: number, top: number, radius: number): boolean {
  for (const target of targets) {
    const dx = target.x - EYE.x
    const dz = target.z - EYE.z
    const length2 = dx * dx + dz * dz
    const px = x - EYE.x
    const pz = z - EYE.z
    const s = (px * dx + pz * dz) / length2
    if (s <= 0.02 || s >= 1) continue
    const lateral = Math.abs(px * dz - pz * dx) / Math.sqrt(length2)
    if (lateral > radius + target.margin + 1.5) continue
    const lineFeet = EYE.y + (target.y - target.body - EYE.y) * s
    if (top + 0.4 > lineFeet) return true
  }
  return false
}

// ---------------------------------------------------------------------------
// Vegetation

function placeVegetation(targets: SightTarget[], col: CollisionWorld): PlantInstance[] {
  const random = mulberry32(2024)
  const plants: PlantInstance[] = []
  const zones = Object.values(ZONES)
  const accept = (kind: PlantKind, x: number, z: number, scale: number, dedicated = false): boolean => {
    const size = PLANT_SIZE[kind]
    const y = terrainHeight(x, z)
    if (!dedicated) {
      if (Math.hypot(x - NEST.x, z - NEST.z) < 20) return false
      if (zones.some((zone) => Math.hypot(x - zone.center[0], z - zone.center[1]) < zone.radius * (kind === 'shrub' || kind === 'rock' ? 0.8 : 1.05))) return false
      if (x > NEAR.x0 && x < NEAR.x1 && z > NEAR.z0 && z < NEAR.z1 && roadEdgeDistance(x, z) < 2.5 + size.radius * scale) return false
      if (RURAL.some(([rx, rz, w, d]) => Math.abs(x - rx) < w / 2 + 3 && Math.abs(z - rz) < d / 2 + 3)) return false
      if (blocksSight(targets, x, z, y + size.height * scale, size.radius * scale)) return false
    }
    plants.push({ kind, variant: Math.floor(random() * 3), x, y: y - 0.15, z, scale, rot: random() * Math.PI * 2, tint: random() })
    const nearPlay = Math.abs(x) < 520 && z > -900 && z < 160
    if (nearPlay && size.trunk > 0) {
      const group = `veg:${Math.floor(x / 160)}:${Math.floor(z / 160)}`
      col.add(cylCollider(x, z, y - 0.5, y + size.height * scale * 0.45, size.trunk * scale, 'wood'), group)
      col.add(cylCollider(x, z, y + size.height * scale * 0.3, y + size.height * scale, size.radius * scale, 'foliage', true), group)
    } else if (nearPlay && kind === 'rock' && scale > 1.1) {
      col.add(cylCollider(x, z, y - 0.3, y + size.height * scale * 0.8, size.radius * scale * 0.75, 'concrete'), `veg:${Math.floor(x / 160)}:${Math.floor(z / 160)}`)
    }
    return true
  }

  // Near play area: jittered grid with clustered density.
  const cell = 8
  for (let z = NEAR.z0; z < NEAR.z1; z += cell) {
    for (let x = NEAR.x0; x < NEAR.x1; x += cell) {
      const px = x + random() * cell
      const pz = z + random() * cell
      const h = terrainHeight(px, pz)
      const cluster = fbm2(px / 90, pz / 90, 3, 501) * 0.5 + 0.5
      const valley = 1 - smoothstep(30, 90, h)
      const roll = random()
      if (roll < cluster * cluster * 0.5) {
        const kind: PlantKind = h > 45 ? (random() < 0.7 ? 'pine' : 'cypress') : random() < 0.45 ? 'olive' : random() < 0.6 ? 'broadleaf' : 'cypress'
        accept(kind, px, pz, 0.75 + random() * 0.55)
      } else if (roll > 0.8 && roll < 0.88 + valley * 0.04) {
        accept(random() < 0.6 ? 'bush' : 'shrub', px, pz, 0.7 + random() * 0.8)
      } else if (roll > 0.965) {
        accept('rock', px, pz, 0.5 + random() * 1.6)
      }
    }
  }
  // Ridge foreground below the nest window.
  for (let i = 0; i < 70; i += 1) {
    const a = -1.1 + random() * 2.2
    const d = 22 + random() * 60
    accept(random() < 0.5 ? 'shrub' : random() < 0.6 ? 'bush' : 'rock', NEST.x + Math.sin(a) * d, NEST.z - Math.cos(a) * d, 0.6 + random() * 0.9)
  }
  // Far hillsides: pine forests and scrub.
  const farCell = 34
  for (let z = -2600; z < 1600; z += farCell) {
    for (let x = -2600; x < 2600; x += farCell) {
      if (x > NEAR.x0 && x < NEAR.x1 && z > NEAR.z0 && z < NEAR.z1) continue
      const px = x + random() * farCell
      const pz = z + random() * farCell
      const h = terrainHeight(px, pz)
      if (h > 330 || h < 4) continue
      const forest = fbm2(px / 260, pz / 260, 3, 503) * 0.5 + 0.5
      if (random() < smoothstep(0.42, 0.75, forest) * 0.75) accept(random() < 0.75 ? 'pine' : 'cypress', px, pz, 0.9 + random() * 0.6)
    }
  }
  // Dedicated plants: compound courtyard trees and duel hides.
  for (const [x, z] of COMPOUND.trees) accept('cypress', x, z, 1.0, true)
  for (const arena of DUEL_ARENAS) {
    for (const nest of arena.nests) {
      if (nest.cover !== 'bush') continue
      accept('bush', nest.pos[0] - 0.7, nest.pos[2] + 1.3, 1.25, true)
      accept('bush', nest.pos[0] + 0.9, nest.pos[2] + 0.9, 1.05, true)
      accept('shrub', nest.pos[0] + 0.1, nest.pos[2] + 1.6, 1.2, true)
    }
  }
  return plants
}

// ---------------------------------------------------------------------------
// Assembly

export interface StaticWorld {
  collision: CollisionWorld
  sites: Site[]
  nest: Site
  nestCollision: CollisionWorld
  plants: PlantInstance[]
  flags: FlagSpot[]
  lamps: LampSpot[]
  wires: WireSpan[]
}

/** Builds every static structure and collider (no terrain or road meshes). */
export function buildStaticWorld(): StaticWorld {
  const collision = new CollisionWorld()
  const make = (group: string, seed: number) => createSite(collision, group, mulberry32(seed))
  const checkpoint = make('checkpoint', 11)
  const village = make('village', 12)
  const depot = make('depot', 13)
  const compound = make('compound', 14)
  const outpost = make('outpost', 15)
  const countryside = make('countryside', 16)
  buildCheckpoint(checkpoint)
  buildVillage(village)
  buildDepot(depot)
  buildCompound(compound)
  buildOutpost(outpost)
  buildCountryside(countryside)
  // Nest colliders feed both the bake-only world and the main world (incoming fire).
  const nestCollision = new TeeCollision(collision)
  const nest = createSite(nestCollision, 'nest', mulberry32(17))
  buildNest(nest)
  const sites = [checkpoint, village, depot, compound, outpost, countryside]
  const plants = placeVegetation(sightTargets(), collision)
  return {
    collision,
    sites,
    nest,
    nestCollision,
    plants,
    flags: sites.flatMap((site) => site.flags),
    lamps: sites.flatMap((site) => site.lamps),
    wires: sites.flatMap((site) => site.wires),
  }
}

class TeeCollision extends CollisionWorld {
  private readonly mirror: CollisionWorld

  constructor(mirror: CollisionWorld) {
    super()
    this.mirror = mirror
  }

  override add(collider: Collider, groupName = 'default'): Collider {
    this.mirror.add(collider, groupName)
    return super.add(collider, groupName)
  }
}

// ---------------------------------------------------------------------------
// Nest light baking

const _o = new THREE.Vector3()
const _n = new THREE.Vector3()
const _d = new THREE.Vector3()
const _t1 = new THREE.Vector3()
const _t2 = new THREE.Vector3()

/** Multiplies nest vertex colours by ray-traced ambient occlusion. Run once. */
export function bakeNestOcclusion(geometry: THREE.BufferGeometry, col: CollisionWorld, rays = 10): void {
  const position = geometry.getAttribute('position') as THREE.BufferAttribute
  const normal = geometry.getAttribute('normal') as THREE.BufferAttribute
  const color = geometry.getAttribute('color') as THREE.BufferAttribute
  const random = mulberry32(5)
  for (let i = 0; i < position.count; i += 1) {
    _o.fromBufferAttribute(position, i)
    _n.fromBufferAttribute(normal, i)
    _o.addScaledVector(_n, 0.03)
    _t1.set(Math.abs(_n.y) < 0.9 ? 0 : 1, Math.abs(_n.y) < 0.9 ? 1 : 0, 0).cross(_n).normalize()
    _t2.crossVectors(_n, _t1)
    let open = 0
    for (let r = 0; r < rays; r += 1) {
      const u = random()
      const v = random() * Math.PI * 2
      const s = Math.sqrt(u)
      _d.copy(_n).multiplyScalar(Math.sqrt(1 - u)).addScaledVector(_t1, Math.cos(v) * s).addScaledVector(_t2, Math.sin(v) * s)
      const hit = col.raycast(_o.x, _o.y, _o.z, _d.x, _d.y, _d.z, 3.2)
      open += hit ? hit.t / 3.2 : 1
    }
    const ao = 0.28 + 0.72 * Math.pow(open / rays, 1.3)
    color.setXYZ(i, color.getX(i) * ao, color.getY(i) * ao, color.getZ(i) * ao)
  }
  color.needsUpdate = true
}

/** Writes a per-vertex sun visibility attribute for the current sun direction. */
export function bakeNestSun(geometry: THREE.BufferGeometry, col: CollisionWorld, sun: THREE.Vector3): void {
  const position = geometry.getAttribute('position') as THREE.BufferAttribute
  const normal = geometry.getAttribute('normal') as THREE.BufferAttribute
  let attribute = geometry.getAttribute('sunVis') as THREE.BufferAttribute | undefined
  if (!attribute) {
    attribute = new THREE.BufferAttribute(new Float32Array(position.count), 1)
    geometry.setAttribute('sunVis', attribute)
  }
  const offsets = [
    [0, 0],
    [0.06, 0.03],
    [-0.05, 0.05],
  ]
  _t1.set(0, 1, 0).cross(sun).normalize()
  _t2.crossVectors(sun, _t1)
  for (let i = 0; i < position.count; i += 1) {
    _n.fromBufferAttribute(normal, i)
    if (_n.dot(sun) <= 0) {
      attribute.setX(i, 0)
      continue
    }
    _o.fromBufferAttribute(position, i).addScaledVector(_n, 0.03)
    let lit = 0
    for (const [a, b] of offsets) {
      _d.copy(sun).addScaledVector(_t1, a).addScaledVector(_t2, b).normalize()
      if (!col.raycast(_o.x, _o.y, _o.z, _d.x, _d.y, _d.z, 40)) lit += 1
    }
    attribute.setX(i, lit / offsets.length)
  }
  attribute.needsUpdate = true
}

// ---------------------------------------------------------------------------
// Sightline audit used by tests: lists targets whose head is hidden by hard geometry.

export function blockedSightlines(world: CollisionWorld, targets = sightTargets()): string[] {
  const blocked: string[] = []
  for (const target of targets) {
    const dx = target.x - EYE.x
    const dy = target.y - EYE.y
    const dz = target.z - EYE.z
    const length = Math.hypot(dx, dy, dz)
    const hit = world.raycast(EYE.x, EYE.y, EYE.z, dx / length, dy / length, dz / length, length - 0.6)
    if (hit && hit.collider.surface !== 'glass') blocked.push(`${target.label} (hit ${hit.collider.surface} at ${hit.t.toFixed(1)} m of ${length.toFixed(1)} m)`)
  }
  return blocked
}

export const BUILDER_KEYS = ['std', 'metal', 'cloth', 'glass', 'glow', 'foliage', 'fence'] as const

export function mergeSites(sites: Site[]): Record<(typeof BUILDER_KEYS)[number], MeshBuilder[]> {
  const result = {} as Record<(typeof BUILDER_KEYS)[number], MeshBuilder[]>
  for (const key of BUILDER_KEYS) result[key] = sites.map((site) => site.b[key]).filter((b) => b.vertexCount > 0)
  return result
}
