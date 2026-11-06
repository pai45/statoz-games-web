// Procedural architecture and props. Every generator writes merged geometry into
// per-material builders and registers matching bullet colliders. No DOM access, so
// sightline tests can build the whole world in Node.
import * as THREE from 'three'

import { MeshBuilder, UNIT_BOX, unitCylinder, vary, type ColorInput } from './builder.ts'
import { CollisionWorld, box as boxCollider, cylinder as cylCollider, type Surface } from './collision.ts'
import { FLOOR_HEIGHT, type BuildingSpec } from './layout.ts'

export type BuilderKey = 'std' | 'metal' | 'cloth' | 'glass' | 'glow' | 'foliage' | 'fence'
export type Builders = Record<BuilderKey, MeshBuilder>

export function createBuilders(): Builders {
  return {
    std: new MeshBuilder(0.35),
    metal: new MeshBuilder(0.5),
    cloth: new MeshBuilder(0.5),
    glass: new MeshBuilder(0.35),
    glow: new MeshBuilder(0.35),
    foliage: new MeshBuilder(0.35),
    fence: new MeshBuilder(0.55),
  }
}

export interface FlagSpot {
  x: number
  y: number
  z: number
  kind: 'flag' | 'windsock'
  colors: [string, string]
  size: number
}

export interface LampSpot {
  x: number
  y: number
  z: number
  color: string
  size: number
  kind: 'street' | 'flood' | 'beacon'
}

export interface WireSpan {
  a: [number, number, number]
  b: [number, number, number]
  sag: number
}

export interface Site {
  b: Builders
  col: CollisionWorld
  group: string
  rnd: () => number
  flags: FlagSpot[]
  lamps: LampSpot[]
  wires: WireSpan[]
}

export function createSite(col: CollisionWorld, group: string, rnd: () => number, b = createBuilders()): Site {
  return { b, col, group, rnd, flags: [], lamps: [], wires: [] }
}

const AXIS_Y = new THREE.Vector3(0, 1, 0)
const _m = new THREE.Matrix4()
const _local = new THREE.Matrix4()
const _q = new THREE.Quaternion()
const _e = new THREE.Euler(0, 0, 0, 'YXZ')
const _p = new THREE.Vector3()
const _s = new THREE.Vector3()
const _v = new THREE.Vector3()

/** Low-poly ellipsoid used for sandbags, rocks, and soft organic shapes. */
export const BAG = new THREE.SphereGeometry(1, 8, 5)

export interface PartOptions {
  rx?: number
  ry?: number
  rz?: number
  collide?: Surface
  soft?: boolean
  noMesh?: boolean
}

export interface CylOptions extends PartOptions {
  seg?: number
  top?: number
}

/** A local coordinate frame (position + yaw) that places parts and colliders in world space. */
export class Frame {
  readonly site: Site
  readonly x: number
  readonly y: number
  readonly z: number
  readonly rot: number
  readonly cos: number
  readonly sin: number
  private readonly matrix = new THREE.Matrix4()

  constructor(site: Site, x: number, y: number, z: number, rot = 0) {
    this.site = site
    this.x = x
    this.y = y
    this.z = z
    this.rot = rot
    this.cos = Math.cos(rot)
    this.sin = Math.sin(rot)
    this.matrix.compose(new THREE.Vector3(x, y, z), new THREE.Quaternion().setFromAxisAngle(AXIS_Y, rot), new THREE.Vector3(1, 1, 1))
  }

  wx(lx: number, lz: number): number {
    return this.x + lx * this.cos + lz * this.sin
  }

  wz(lx: number, lz: number): number {
    return this.z - lx * this.sin + lz * this.cos
  }

  child(lx: number, ly: number, lz: number, rot = 0): Frame {
    return new Frame(this.site, this.wx(lx, lz), this.y + ly, this.wz(lx, lz), this.rot + rot)
  }

  world(lx: number, ly: number, lz: number): [number, number, number] {
    return [this.wx(lx, lz), this.y + ly, this.wz(lx, lz)]
  }

  geom(
    key: BuilderKey,
    geometry: THREE.BufferGeometry,
    lx: number,
    ly: number,
    lz: number,
    sx: number,
    sy: number,
    sz: number,
    color: ColorInput,
    rx = 0,
    ry = 0,
    rz = 0,
  ): this {
    _e.set(rx, ry, rz, 'YXZ')
    _q.setFromEuler(_e)
    _local.compose(_p.set(lx, ly, lz), _q, _s.set(sx, sy, sz))
    _m.multiplyMatrices(this.matrix, _local)
    this.site.b[key].add(geometry, _m, color)
    return this
  }

  /** Box whose bottom sits at `ly0` (before any tilt, which pivots about the center). */
  box(key: BuilderKey, lx: number, ly0: number, lz: number, sx: number, sy: number, sz: number, color: ColorInput, o: PartOptions = {}): this {
    const ry = o.ry ?? 0
    if (!o.noMesh) this.geom(key, UNIT_BOX, lx, ly0 + sy / 2, lz, sx, sy, sz, color, o.rx ?? 0, ry, o.rz ?? 0)
    if (o.collide) {
      this.site.col.add(
        boxCollider(this.wx(lx, lz), this.y + ly0 + sy / 2, this.wz(lx, lz), sx, sy, sz, o.collide, this.rot + ry, o.soft ?? false),
        this.site.group,
      )
    }
    return this
  }

  /** Cylinder with its base center at (lx, ly0, lz); tilts pivot about the base. */
  cyl(key: BuilderKey, lx: number, ly0: number, lz: number, r: number, h: number, color: ColorInput, o: CylOptions = {}): this {
    const rx = o.rx ?? 0
    const rz = o.rz ?? 0
    _e.set(rx, o.ry ?? 0, rz, 'YXZ')
    _q.setFromEuler(_e)
    _v.set(0, h / 2, 0).applyQuaternion(_q)
    if (!o.noMesh) this.geom(key, unitCylinder(o.seg ?? 12, o.top ?? 1), lx + _v.x, ly0 + _v.y, lz + _v.z, r, h, r, color, rx, o.ry ?? 0, rz)
    if (o.collide && rx === 0 && rz === 0) {
      this.site.col.add(cylCollider(this.wx(lx, lz), this.wz(lx, lz), this.y + ly0, this.y + ly0 + h, r, o.collide, o.soft ?? false), this.site.group)
    }
    return this
  }

  /** Cylinder between two local points. */
  tube(key: BuilderKey, a: readonly [number, number, number], b: readonly [number, number, number], r: number, color: ColorInput, seg = 6): this {
    const [ax, ay, az] = this.world(a[0], a[1], a[2])
    const [bx, by, bz] = this.world(b[0], b[1], b[2])
    this.site.b[key].tube(ax, ay, az, bx, by, bz, r, color, seg)
    return this
  }

  blob(key: BuilderKey, lx: number, ly: number, lz: number, sx: number, sy: number, sz: number, color: ColorInput, ry = 0, rx = 0, rz = 0): this {
    return this.geom(key, BAG, lx, ly, lz, sx, sy, sz, color, rx, ry, rz)
  }
}

// ---------------------------------------------------------------------------
// Palette

export const PAL = {
  concrete: '#8f8b84',
  concreteDark: '#68655f',
  concreteLight: '#aaa59b',
  wood: '#6b4f36',
  woodDark: '#45331f',
  woodLight: '#8d6c49',
  metal: '#3b3f42',
  metalLight: '#8f969a',
  galvanized: '#a3a9ab',
  rust: '#7a4a2e',
  sandbag: '#a3906a',
  sandbagDark: '#86744f',
  hesco: '#b29c74',
  olive: '#4e5636',
  oliveDark: '#383e28',
  tan: '#a38d68',
  tire: '#1d1d1c',
  interior: '#3a332c',
  interiorDark: '#231f1b',
  roof: '#8a8379',
  white: '#d8d4cb',
  red: '#8e2f24',
}

const SHUTTERS = ['#4f6b5a', '#5b6f80', '#7a4a32', '#8b7d62', '#3f5866', '#6d6a4a']
const CLOTHES = ['#b5462f', '#2f5d7c', '#d1b04a', '#567a3a', '#d8d2c4', '#7c3f62', '#c47f3c', '#40566b']

function pick<T>(rnd: () => number, list: readonly T[]): T {
  return list[Math.floor(rnd() * list.length) % list.length]
}

// ---------------------------------------------------------------------------
// Buildings

export const OPENING_W = 1.3
export const OPENING_SILL = 0.95
export const OPENING_TOP = 2.35
const WALL_T = 0.3

interface Face {
  nx: number
  nz: number
  ux: number
  uz: number
  offset: number
  length: number
  ry: number
  name: 'south' | 'north' | 'east' | 'west'
}

function faces(hw: number, hd: number): Face[] {
  return [
    { name: 'south', nx: 0, nz: 1, ux: 1, uz: 0, offset: hd, length: hw * 2, ry: 0 },
    { name: 'north', nx: 0, nz: -1, ux: -1, uz: 0, offset: hd, length: hw * 2, ry: Math.PI },
    { name: 'east', nx: 1, nz: 0, ux: 0, uz: -1, offset: hw, length: hd * 2, ry: Math.PI / 2 },
    { name: 'west', nx: -1, nz: 0, ux: 0, uz: 1, offset: hw, length: hd * 2, ry: -Math.PI / 2 },
  ]
}

/** Box on a facade: `along` runs along the face, `out` is the protrusion from the wall plane. */
function faceBox(
  f: Frame,
  face: Face,
  key: BuilderKey,
  along: number,
  y0: number,
  out: number,
  sx: number,
  sy: number,
  sz: number,
  color: ColorInput,
  o: PartOptions = {},
): void {
  const d = face.offset + out
  f.box(key, face.nx * d + face.ux * along, y0, face.nz * d + face.uz * along, sx, sy, sz, color, { ...o, ry: face.ry + (o.ry ?? 0) })
}

function fakeWindow(f: Frame, face: Face, along: number, y0: number, trim: THREE.Color, glowChance: number): void {
  const rnd = f.site.rnd
  const style = rnd()
  // Layers keep >= 3 cm of depth separation so distant facades do not z-fight.
  faceBox(f, face, 'std', along, y0 + 0.86, 0.09, 1.46, 0.08, 0.2, trim)
  if (style < 0.18) {
    // Closed shutters.
    faceBox(f, face, 'std', along, y0 + 0.95, 0.03, 1.22, 1.42, 0.06, vary(pick(rnd, SHUTTERS), rnd, 0.08))
    for (let i = 0; i < 4; i += 1) faceBox(f, face, 'std', along, y0 + 1.1 + i * 0.32, 0.08, 1.18, 0.03, 0.02, '#2b2723')
    return
  }
  faceBox(f, face, 'glass', along, y0 + 1.0, 0.02, 1.14, 1.36, 0.06, '#20282d')
  faceBox(f, face, 'std', along, y0 + 0.93, 0.05, 1.32, 0.08, 0.1, trim)
  faceBox(f, face, 'std', along, y0 + 2.36, 0.05, 1.32, 0.08, 0.1, trim)
  for (const side of [-1, 1]) faceBox(f, face, 'std', along + side * 0.62, y0 + 1.0, 0.05, 0.08, 1.36, 0.1, trim)
  faceBox(f, face, 'std', along, y0 + 1.6, 0.06, 1.12, 0.05, 0.04, trim)
  faceBox(f, face, 'std', along, y0 + 1.0, 0.06, 0.05, 1.33, 0.04, trim)
  if (rnd() < glowChance) faceBox(f, face, 'glow', along, y0 + 1.03, 0.11, 1.04, 1.28, 0.02, '#ffcf8a')
  if (style < 0.62) {
    const shutter = vary(pick(rnd, SHUTTERS), rnd, 0.08)
    for (const side of [-1, 1]) faceBox(f, face, 'std', along + side * 1.0, y0 + 0.95, 0.04, 0.6, 1.44, 0.05, shutter)
  }
  if (rnd() < 0.12) {
    // Wall-mounted AC unit beside the window.
    faceBox(f, face, 'metal', along + 1.05, y0 + 2.05, 0.0, 0.7, 0.45, 0.42, '#c9c7c0')
  }
}

function door(f: Frame, face: Face, along: number, y0: number, trim: THREE.Color): void {
  const rnd = f.site.rnd
  for (const side of [-1, 1]) faceBox(f, face, 'std', along + side * 0.63, y0, 0.05, 0.14, 2.42, 0.1, trim)
  faceBox(f, face, 'std', along, y0 + 2.28, 0.05, 1.4, 0.14, 0.1, trim)
  faceBox(f, face, 'std', along, y0, 0.02, 1.12, 2.28, 0.06, vary(pick(rnd, [PAL.woodDark, PAL.wood, '#3f4b52', '#5a2f26']), rnd, 0.06))
  faceBox(f, face, 'std', along, y0 - 0.2, 0.25, 1.6, 0.22, 0.6, PAL.concreteDark)
  faceBox(f, face, 'metal', along + 0.4, y0 + 1.05, 0.09, 0.05, 0.05, 0.06, '#b9a36a')
}

function shopfront(f: Frame, face: Face, along: number, y0: number, awning: string, trim: THREE.Color): void {
  const rnd = f.site.rnd
  for (const side of [-1, 1]) faceBox(f, face, 'std', along + side * 1.88, y0, 0.05, 0.16, 2.85, 0.1, trim)
  faceBox(f, face, 'std', along, y0 + 2.62, 0.05, 3.9, 0.23, 0.1, trim)
  faceBox(f, face, 'metal', along, y0 + 0.05, 0.05, 3.6, 2.55, 0.08, vary('#7c8084', rnd, 0.06))
  for (let i = 0; i < 9; i += 1) faceBox(f, face, 'metal', along, y0 + 0.2 + i * 0.27, 0.11, 3.6, 0.03, 0.02, '#5d6064')
  // Sloped canvas awning.
  const d = face.offset + 0.85
  f.box('cloth', face.nx * d + face.ux * along, y0 + 2.75, face.nz * d + face.uz * along, 4.2, 0.05, 1.8, vary(awning, rnd, 0.05), {
    ry: face.ry,
    rx: 0.32,
  })
  const sign = vary(pick(rnd, ['#2c4a5e', '#7d2a22', '#c9a43c', '#2f5a3a']), rnd, 0.05)
  faceBox(f, face, 'std', along, y0 + 3.25, 0.02, 3.4, 0.55, 0.1, sign)
}

function openingFrame(f: Frame, face: Face, along: number, y0: number, trim: THREE.Color): void {
  const rnd = f.site.rnd
  const w = OPENING_W
  const h = OPENING_TOP - OPENING_SILL
  faceBox(f, face, 'std', along, y0 + OPENING_SILL - 0.08, 0.06, w + 0.3, 0.08, 0.24, trim)
  faceBox(f, face, 'std', along, y0 + OPENING_TOP, 0.03, w + 0.24, 0.1, 0.1, trim)
  for (const side of [-1, 1]) faceBox(f, face, 'std', along + side * (w / 2 + 0.06), y0 + OPENING_SILL, 0.03, 0.12, h, 0.1, trim)
  // One broken shutter left hanging open.
  const side = rnd() < 0.5 ? -1 : 1
  faceBox(f, face, 'std', along + side * (w / 2 + 0.42), y0 + OPENING_SILL + 0.05, 0.09, 0.62, h - 0.1, 0.05, vary(pick(rnd, SHUTTERS), rnd, 0.1), {
    ry: side * 0.5,
  })
}

/** Dark interior room so openings read as deep windows rather than painted panels. */
function room(f: Frame, hw: number, hd: number, y0: number, top: number): void {
  const rnd = f.site.rnd
  const iw = hw * 2 - WALL_T * 2
  const id = hd * 2 - WALL_T * 2
  const h = top - y0
  f.box('std', 0, y0 - 0.22, 0, iw, 0.22, id, '#4a3f35', { collide: 'concrete' })
  f.box('std', 0, top - 0.22, 0, iw, 0.22, id, PAL.interiorDark, { collide: 'concrete' })
  f.box('std', 0, y0, -hd + WALL_T + 0.03, iw, h - 0.22, 0.06, PAL.interior)
  f.box('std', hw - WALL_T - 0.03, y0, 0, 0.06, h - 0.22, id, PAL.interiorDark)
  f.box('std', -hw + WALL_T + 0.03, y0, 0, 0.06, h - 0.22, id, PAL.interiorDark)
  // Interior partition depth cue and furniture silhouettes.
  f.box('std', 0, y0, -hd + WALL_T + id * 0.45, iw * 0.4, h - 0.22, 0.1, '#2c2621')
  for (let i = 0; i < 3; i += 1) {
    const x = (rnd() - 0.5) * (iw - 1.5)
    const z = -hd + WALL_T + 0.6 + rnd() * (id * 0.35)
    if (rnd() < 0.5) {
      f.box('std', x, y0, z, 1.2, 0.75, 0.7, '#3b2e22')
    } else {
      f.box('std', x, y0, z, 0.5, 1.8, 0.4, '#2e2924')
    }
  }
}

function roofProp(f: Frame, kind: NonNullable<BuildingSpec['roofProps']>[number], lx: number, y: number, lz: number): void {
  const rnd = f.site.rnd
  switch (kind) {
    case 'tank': {
      const black = rnd() < 0.6
      f.box('metal', lx, y, lz, 1.4, 0.5, 1.4, PAL.metal)
      f.cyl(black ? 'std' : 'metal', lx, y + 0.5, lz, 0.62, 1.15, black ? '#222324' : PAL.white, { seg: 14, collide: 'metal' })
      f.cyl('std', lx, y + 1.65, lz, 0.62, 0.12, black ? '#1a1b1c' : '#bdb9b1', { seg: 14, top: 0.6 })
      break
    }
    case 'dish': {
      f.cyl('metal', lx, y, lz, 0.04, 1.1, PAL.metalLight, { seg: 6 })
      f.blob('metal', lx, y + 1.15, lz + 0.08, 0.5, 0.5, 0.1, '#d9d7d0', 0.3 + rnd(), -0.35)
      f.tube('metal', [lx, y + 1.15, lz + 0.1], [lx, y + 1.3, lz + 0.55], 0.015, PAL.metal, 4)
      break
    }
    case 'ac':
      f.box('metal', lx, y, lz, 0.95, 0.68, 0.55, '#c4c2bb', { collide: 'metal' })
      f.cyl('metal', lx, y + 0.34, lz + 0.28, 0.24, 0.02, '#3c3e40', { seg: 12, rx: Math.PI / 2 })
      break
    case 'antenna':
      f.cyl('metal', lx, y, lz, 0.035, 3.4, PAL.metalLight, { seg: 6 })
      for (let i = 0; i < 4; i += 1) f.box('metal', lx, y + 1.8 + i * 0.42, lz, 1.1 - i * 0.22, 0.03, 0.03, PAL.metalLight, { ry: 0.4 })
      break
    case 'laundry': {
      const span = 3.2
      f.cyl('metal', lx - span / 2, y, lz, 0.03, 1.8, PAL.metalLight, { seg: 5 })
      f.cyl('metal', lx + span / 2, y, lz, 0.03, 1.8, PAL.metalLight, { seg: 5 })
      f.tube('metal', [lx - span / 2, y + 1.75, lz], [lx + span / 2, y + 1.72, lz], 0.008, '#2a2a2a', 3)
      for (let i = 0; i < 5; i += 1) {
        const x = lx - span / 2 + 0.4 + i * 0.6
        const h = 0.5 + rnd() * 0.4
        f.box('cloth', x, y + 1.72 - h, lz, 0.45 + rnd() * 0.2, h, 0.02, vary(pick(rnd, CLOTHES), rnd, 0.1))
      }
      break
    }
  }
}

export interface BuildingStyle {
  parapet?: number
  prefab?: boolean
  door?: Face['name'] | 'none'
  glow?: number
  roofColor?: string
  /** Openings on faces other than south (e.g. a guard booth all around). */
  wrapWindows?: boolean
}

export function building(site: Site, spec: BuildingSpec, base: number, style: BuildingStyle = {}): void {
  const rnd = site.rnd
  const f = new Frame(site, spec.x, base, spec.z, 0)
  const H = spec.floors * FLOOR_HEIGHT
  const hw = spec.w / 2
  const hd = spec.d / 2
  const wallColor = new THREE.Color(spec.color)
  const trim = wallColor.clone().lerp(new THREE.Color('#efe9dc'), 0.38)
  const plinth = wallColor.clone().multiplyScalar(0.58)
  const openings = new Map<number, number[]>()
  for (const o of spec.openings ?? []) openings.set(o.floor, o.xs.map((x) => x - spec.x))
  const parapetH = style.parapet ?? 0.9
  const glow = style.glow ?? 0.3

  f.box('std', 0, -0.7, 0, spec.w + 0.16, 1.02, spec.d + 0.16, plinth)
  if (openings.size === 0) {
    f.box('std', 0, 0, 0, spec.w, H, spec.d, wallColor, { collide: 'concrete' })
  } else {
    f.box('std', 0, 0, -hd + WALL_T / 2, spec.w, H, WALL_T, wallColor, { collide: 'concrete' })
    f.box('std', hw - WALL_T / 2, 0, 0, WALL_T, H, spec.d - WALL_T * 2, wallColor, { collide: 'concrete' })
    f.box('std', -hw + WALL_T / 2, 0, 0, WALL_T, H, spec.d - WALL_T * 2, wallColor, { collide: 'concrete' })
    const sz = hd - WALL_T / 2
    for (let fl = 0; fl < spec.floors; fl += 1) {
      const y0 = fl * FLOOR_HEIGHT
      const xs = openings.get(fl)
      if (!xs) {
        f.box('std', 0, y0, sz, spec.w, FLOOR_HEIGHT, WALL_T, wallColor, { collide: 'concrete' })
        continue
      }
      f.box('std', 0, y0, sz, spec.w, OPENING_SILL, WALL_T, wallColor, { collide: 'concrete' })
      f.box('std', 0, y0 + OPENING_TOP, sz, spec.w, FLOOR_HEIGHT - OPENING_TOP, WALL_T, wallColor, { collide: 'concrete' })
      let cursor = -hw
      for (const ox of [...xs].sort((a, b) => a - b)) {
        const left = ox - OPENING_W / 2
        if (left > cursor + 0.01) {
          f.box('std', (cursor + left) / 2, y0 + OPENING_SILL, sz, left - cursor, OPENING_TOP - OPENING_SILL, WALL_T, wallColor, { collide: 'concrete' })
        }
        cursor = ox + OPENING_W / 2
      }
      if (hw > cursor + 0.01) {
        f.box('std', (cursor + hw) / 2, y0 + OPENING_SILL, sz, hw - cursor, OPENING_TOP - OPENING_SILL, WALL_T, wallColor, { collide: 'concrete' })
      }
      room(f, hw, hd, y0, y0 + FLOOR_HEIGHT)
    }
    f.box('std', 0, H - 0.25, 0, spec.w - WALL_T * 2, 0.25, spec.d - WALL_T * 2, PAL.interiorDark, { collide: 'concrete' })
  }

  // Roof cap, parapet and coping.
  const roofColor = vary(style.roofColor ?? PAL.roof, rnd, 0.05)
  f.box('std', 0, H - 0.14, 0, spec.w + 0.2, 0.16, spec.d + 0.2, roofColor)
  if (parapetH > 0) {
    const pt = 0.22
    const ph = parapetH - 0.02
    const ow = spec.w + 0.2
    const od = spec.d + 0.2
    f.box('std', 0, H + 0.02, od / 2 - pt / 2, ow, ph, pt, wallColor, { collide: 'concrete' })
    f.box('std', 0, H + 0.02, -od / 2 + pt / 2, ow, ph, pt, wallColor, { collide: 'concrete' })
    f.box('std', ow / 2 - pt / 2, H + 0.02, 0, pt, ph, od - pt * 2, wallColor, { collide: 'concrete' })
    f.box('std', -ow / 2 + pt / 2, H + 0.02, 0, pt, ph, od - pt * 2, wallColor, { collide: 'concrete' })
    f.box('std', 0, H + parapetH, od / 2 - pt / 2, ow + 0.06, 0.06, pt + 0.06, trim)
    f.box('std', 0, H + parapetH, -od / 2 + pt / 2, ow + 0.06, 0.06, pt + 0.06, trim)
    f.box('std', ow / 2 - pt / 2, H + parapetH, 0, pt + 0.06, 0.06, od - pt * 2, trim)
    f.box('std', -ow / 2 + pt / 2, H + parapetH, 0, pt + 0.06, 0.06, od - pt * 2, trim)
  }

  const list = faces(hw, hd)
  // Floor bands.
  for (let fl = 1; fl < spec.floors; fl += 1) {
    for (const face of list) faceBox(f, face, 'std', 0, fl * FLOOR_HEIGHT - 0.08, 0.02, face.length + 0.08, 0.14, 0.08, trim)
  }

  if (style.prefab) {
    const rib = wallColor.clone().multiplyScalar(0.82)
    for (const face of list) {
      const count = Math.floor(face.length / 0.55)
      for (let i = 1; i < count; i += 1) faceBox(f, face, 'std', -face.length / 2 + i * 0.55, 0, 0.0, 0.05, H - 0.05, 0.05, rib)
    }
  }

  // Windows, doors, shop fronts.
  const doorFace = style.door ?? 'south'
  for (const face of list) {
    const usable = face.length - 1.4
    const count = Math.max(1, Math.floor(usable / 2.9))
    const spacing = usable / count
    for (let fl = 0; fl < spec.floors; fl += 1) {
      const y0 = fl * FLOOR_HEIGHT
      const real = face.name === 'south' ? openings.get(fl) : undefined
      for (const ox of real ?? []) openingFrame(f, face, ox, y0, trim)
      for (let i = 0; i < count; i += 1) {
        const along = -usable / 2 + spacing * (i + 0.5)
        if (real?.some((ox) => Math.abs(ox - along) < 1.75)) continue
        if (fl === 0 && face.name === doorFace) {
          if (i === Math.floor(count / 2)) {
            if (spec.awning) shopfront(f, face, along, y0, spec.awning, trim)
            else door(f, face, along, y0, trim)
            continue
          }
          if (spec.awning && count > 2 && i === Math.floor(count / 2) - 1) {
            shopfront(f, face, along, y0, spec.awning, trim)
            continue
          }
        }
        if (fl === 0 && rnd() < 0.25) continue
        fakeWindow(f, face, along, y0, trim, glow)
      }
    }
    // Occasional balcony on side faces.
    if (spec.floors >= 2 && face.name !== 'south' && rnd() < 0.35) {
      const along = (rnd() - 0.5) * (face.length - 4)
      const y0 = FLOOR_HEIGHT
      faceBox(f, face, 'std', along, y0 - 0.15, 0.55, 2.6, 0.15, 1.1, trim)
      faceBox(f, face, 'metal', along, y0, 1.05, 2.6, 0.04, 0.04, PAL.metal)
      faceBox(f, face, 'metal', along, y0 + 0.95, 1.05, 2.6, 0.04, 0.05, PAL.metal)
      for (let i = 0; i <= 8; i += 1) faceBox(f, face, 'metal', along - 1.3 + i * 0.325, y0, 1.05, 0.025, 0.95, 0.025, PAL.metal)
    }
  }

  // Drainpipe and grime stains on the facade.
  const south = list[0]
  faceBox(f, south, 'metal', hw - 0.35, 0, 0.06, 0.09, H, 0.09, '#6d6a63')

  // Roof props in the rear half so rooftop spawns along the south edge stay clear.
  const props = spec.roofProps ?? []
  props.forEach((kind, index) => {
    const lx = -hw + 1.4 + ((index + 0.5) / props.length) * (spec.w - 2.8)
    const lz = -hd + 1.3 + rnd() * Math.max(0.2, hd * 0.6 - 1)
    roofProp(f, kind, lx, H + 0.02, lz)
  })
}

// ---------------------------------------------------------------------------
// Military structures

/** Ring of stacked sandbags. `gap` is the bearing (radians, local) of the entry. */
export function sandbagRing(site: Site, x: number, z: number, r: number, base: number, height = 1.15, gapAt = Math.PI): void {
  const f = new Frame(site, x, base, z, 0)
  const rows = Math.round(height / 0.25)
  const circumference = Math.PI * 2 * r
  const count = Math.max(8, Math.round(circumference / 0.56))
  for (let row = 0; row < rows; row += 1) {
    const offset = (row % 2) * 0.5
    for (let i = 0; i < count; i += 1) {
      const a = ((i + offset) / count) * Math.PI * 2
      const gap = Math.abs(((a - gapAt + Math.PI * 3) % (Math.PI * 2)) - Math.PI)
      if (gap < 0.42) continue
      const color = vary(row % 2 ? PAL.sandbag : PAL.sandbagDark, site.rnd, 0.08)
      // A yaw of `a` aligns the bag's long axis with the ring tangent.
      f.blob('std', Math.sin(a) * r, 0.13 + row * 0.25, Math.cos(a) * r, 0.31, 0.135, 0.2, color, a + (site.rnd() - 0.5) * 0.15)
    }
  }
  const segments = Math.max(8, Math.round(circumference / 0.9))
  for (let i = 0; i < segments; i += 1) {
    const a = ((i + 0.5) / segments) * Math.PI * 2
    const gap = Math.abs(((a - gapAt + Math.PI * 3) % (Math.PI * 2)) - Math.PI)
    if (gap < 0.42) continue
    f.box('std', Math.sin(a) * r, 0, Math.cos(a) * r, (circumference / segments) * 1.02, height, 0.42, PAL.sandbag, { collide: 'sand', noMesh: true, ry: a })
  }
}

/** Straight wall of sandbags along local X. */
export function sandbagLine(f: Frame, lx: number, ly: number, lz: number, length: number, rows: number, ry = 0): void {
  const site = f.site
  const count = Math.max(1, Math.round(length / 0.56))
  const c = Math.cos(ry)
  const s = Math.sin(ry)
  for (let row = 0; row < rows; row += 1) {
    const offset = (row % 2) * 0.28
    for (let i = 0; i < count; i += 1) {
      const along = -length / 2 + 0.28 + i * (length / count) + offset - 0.14
      if (Math.abs(along) > length / 2) continue
      const color = vary(row % 2 ? PAL.sandbag : PAL.sandbagDark, site.rnd, 0.08)
      f.blob('std', lx + along * c, ly + 0.13 + row * 0.25, lz - along * s, 0.31, 0.135, 0.2, color, ry + (site.rnd() - 0.5) * 0.12)
    }
  }
  f.box('std', lx, ly, lz, length, rows * 0.25, 0.42, PAL.sandbag, { collide: 'sand', noMesh: true, ry })
}

export function hescoRow(site: Site, x: number, z: number, rot: number, count: number, base: number, height = 1.4): void {
  const f = new Frame(site, x, base, z, rot)
  for (let i = 0; i < count; i += 1) {
    const lx = (i - (count - 1) / 2) * 1.06
    f.box('std', lx, 0, 0, 1.0, height - 0.05, 1.0, vary(PAL.hesco, site.rnd, 0.07))
    f.box('std', lx, height - 0.08, 0, 0.92, 0.1, 0.92, vary('#9c8862', site.rnd, 0.05))
    for (const sx of [-0.5, 0.5]) for (const sz of [-0.5, 0.5]) f.box('metal', lx + sx, 0, sz, 0.04, height, 0.04, '#5b5a52')
    for (let k = 1; k < 4; k += 1) {
      f.box('metal', lx, (k * height) / 4, 0.51, 1.0, 0.025, 0.02, '#5b5a52')
      f.box('metal', lx, (k * height) / 4, -0.51, 1.0, 0.025, 0.02, '#5b5a52')
    }
  }
  f.box('std', 0, 0, 0, count * 1.06, height, 1.0, PAL.hesco, { collide: 'sand', noMesh: true })
}

export function jerseyBarrier(site: Site, x: number, z: number, rot: number, base: number): void {
  const f = new Frame(site, x, base, z, rot)
  const color = vary(PAL.concreteLight, site.rnd, 0.05)
  f.box('std', 0, 0, 0, 3, 0.32, 0.62, color)
  f.box('std', 0, 0.3, 0, 3, 0.55, 0.26, color)
  f.box('std', 0, 0.28, 0, 3, 0.1, 0.42, color)
  f.box('std', 0, 0, 0, 3, 0.85, 0.5, color, { collide: 'concrete', noMesh: true })
  // Hazard stripes.
  for (let i = 0; i < 3; i += 1) f.box('std', -1 + i, 0.55, 0.135, 0.45, 0.18, 0.01, i % 2 ? '#c7a136' : '#2b2b2a')
}

export function shippingContainer(site: Site, x: number, z: number, rot: number, stack: number, color: string, base: number, length = 12.2): void {
  const f = new Frame(site, x, base, z, rot)
  const h = 2.6
  const w = 2.44
  for (let level = 0; level < stack; level += 1) {
    const c = vary(level === 0 ? color : pick(site.rnd, ['#5c6b4a', '#8a3b2a', '#2f4c63', '#9b7b3d', '#6a6e70']), site.rnd, 0.06)
    const y = level * h
    f.box('metal', 0, y, 0, length, h, w, c, { collide: 'metal' })
    const rib = c.clone().multiplyScalar(0.8)
    const ribs = Math.floor(length / 0.32)
    for (let i = 1; i < ribs; i += 1) {
      const lx = -length / 2 + i * (length / ribs)
      f.box('metal', lx, y + 0.12, w / 2, 0.07, h - 0.24, 0.04, rib)
      f.box('metal', lx, y + 0.12, -w / 2, 0.07, h - 0.24, 0.04, rib)
    }
    f.box('metal', 0, y + h - 0.12, 0, length + 0.04, 0.12, w + 0.04, rib)
    f.box('metal', 0, y, 0, length + 0.04, 0.12, w + 0.04, rib)
    // Door end with locking bars.
    f.box('metal', length / 2 + 0.01, y + 0.1, 0, 0.04, h - 0.2, w - 0.1, rib)
    for (const lz of [-0.8, -0.35, 0.35, 0.8]) f.box('metal', length / 2 + 0.05, y + 0.15, lz, 0.04, h - 0.3, 0.05, PAL.metalLight)
  }
}

export function storageTank(site: Site, x: number, z: number, r: number, h: number, base: number): void {
  const f = new Frame(site, x, base, z, 0)
  const body = vary('#d6d3cb', site.rnd, 0.03)
  f.cyl('metal', 0, 0, 0, r, h, body, { seg: 32, collide: 'metal' })
  f.cyl('metal', 0, -0.3, 0, r + 0.25, 0.55, PAL.concreteDark, { seg: 32 })
  // Weld seams and rust streaks.
  for (let i = 1; i < 4; i += 1) f.cyl('metal', 0, (i * h) / 4, 0, r + 0.02, 0.06, '#b9b5ac', { seg: 32 })
  for (let i = 0; i < 6; i += 1) {
    const a = site.rnd() * Math.PI * 2
    f.box('metal', Math.sin(a) * (r + 0.01), h * 0.35, Math.cos(a) * (r + 0.01), 0.25, h * 0.6, 0.02, '#9d8a70', { ry: a })
  }
  // Shallow roof cap and a low rim lip that doubles as prone cover.
  f.cyl('metal', 0, h - 0.05, 0, r - 0.05, 0.12, '#c8c4bb', { seg: 32 })
  f.cyl('metal', 0, h, 0, r, 0.22, '#bdb8ae', { seg: 32 })
  // Handrail ring on posts.
  const posts = Math.round(r * 3.2)
  for (let i = 0; i < posts; i += 1) {
    const a = (i / posts) * Math.PI * 2
    f.cyl('metal', Math.sin(a) * (r - 0.15), h + 0.2, Math.cos(a) * (r - 0.15), 0.025, 0.85, '#8d9396', { seg: 4 })
  }
  for (let i = 0; i < posts; i += 1) {
    const a0 = (i / posts) * Math.PI * 2
    const a1 = ((i + 1) / posts) * Math.PI * 2
    const rr = r - 0.15
    f.tube('metal', [Math.sin(a0) * rr, h + 1.02, Math.cos(a0) * rr], [Math.sin(a1) * rr, h + 1.02, Math.cos(a1) * rr], 0.03, '#8d9396', 4)
  }
  // Spiral stair hint.
  for (let i = 0; i < 22; i += 1) {
    const a = -0.9 + i * 0.075
    const y = 0.4 + (i / 22) * (h - 0.6)
    f.box('metal', Math.sin(a) * (r + 0.45), y, Math.cos(a) * (r + 0.45), 0.35, 0.06, 0.9, PAL.metal, { ry: a })
  }
}

export function pipeRack(site: Site, z: number, x0: number, x1: number, base: number): void {
  const f = new Frame(site, (x0 + x1) / 2, base, z, 0)
  const length = x1 - x0
  const spans = Math.round(length / 7)
  for (let i = 0; i <= spans; i += 1) {
    const lx = -length / 2 + (i * length) / spans
    f.box('metal', lx, 0, -0.9, 0.22, 4.6, 0.22, PAL.metal, { collide: 'metal' })
    f.box('metal', lx, 0, 0.9, 0.22, 4.6, 0.22, PAL.metal, { collide: 'metal' })
    f.box('metal', lx, 3.4, 0, 0.2, 0.2, 2.1, PAL.metal)
    f.box('metal', lx, 4.4, 0, 0.2, 0.2, 2.1, PAL.metal)
  }
  const colors = ['#a8a59c', '#c2a34d', '#7d8a8f', '#9a4a36']
  colors.forEach((color, index) => {
    const lz = -0.7 + index * 0.46
    const y = index % 2 ? 4.6 : 3.6
    f.cyl('metal', -length / 2, y + 0.14, lz, 0.16, length, color, { seg: 10, rz: -Math.PI / 2 })
    f.box('metal', 0, y, lz, length, 0.32, 0.32, color, { collide: 'metal', noMesh: true })
  })
}

export type VehicleKind = 'sedan' | 'suv' | 'truck' | 'tanker' | 'pickup'

/** Vehicles are modeled with their length along local X. */
export function vehicle(site: Site, kind: VehicleKind, x: number, z: number, rot: number, color: string, base: number): void {
  const f = new Frame(site, x, base, z, rot)
  const rnd = site.rnd
  const paint = vary(color, rnd, 0.04)
  const dark = paint.clone().multiplyScalar(0.55)
  const wheel = (lx: number, lz: number, r: number, width: number) => {
    const side = Math.sign(lz)
    f.cyl('std', lx, r, lz - (side * width) / 2, r, width, PAL.tire, { seg: 14, rx: (side * Math.PI) / 2 })
    f.cyl('metal', lx, r, lz + side * (width / 2 - 0.01), r * 0.55, 0.03, '#8b8e8f', { seg: 10, rx: (side * Math.PI) / 2 })
  }
  if (kind === 'sedan' || kind === 'suv') {
    const L = kind === 'suv' ? 4.9 : 4.45
    const W = kind === 'suv' ? 1.95 : 1.76
    const lower = kind === 'suv' ? 0.95 : 0.72
    const cabinH = kind === 'suv' ? 0.75 : 0.55
    const r = kind === 'suv' ? 0.39 : 0.32
    f.box('metal', 0, r * 0.55, 0, L, lower, W, paint, { collide: 'metal' })
    f.box('metal', kind === 'suv' ? -0.35 : -0.2, r * 0.55 + lower, 0, kind === 'suv' ? 3.0 : 2.3, cabinH, W - 0.12, paint, { collide: 'metal' })
    f.box('glass', kind === 'suv' ? -0.35 : -0.2, r * 0.55 + lower + 0.08, 0, (kind === 'suv' ? 3.0 : 2.3) + 0.02, cabinH - 0.16, W - 0.1, '#1b2125')
    f.box('metal', L / 2 - 0.02, r * 0.55 + 0.2, 0, 0.06, 0.3, W - 0.3, dark)
    f.box('glow', L / 2 + 0.02, r * 0.55 + lower - 0.25, W / 2 - 0.25, 0.02, 0.12, 0.3, '#f4efe0')
    f.box('glow', L / 2 + 0.02, r * 0.55 + lower - 0.25, -W / 2 + 0.25, 0.02, 0.12, 0.3, '#f4efe0')
    f.box('std', -L / 2 - 0.01, r * 0.55 + lower - 0.25, W / 2 - 0.2, 0.02, 0.12, 0.28, '#7b1c14')
    f.box('std', -L / 2 - 0.01, r * 0.55 + lower - 0.25, -W / 2 + 0.2, 0.02, 0.12, 0.28, '#7b1c14')
    if (kind === 'suv') f.box('metal', -0.35, r * 0.55 + lower + cabinH, 0, 2.4, 0.06, W - 0.3, PAL.metal)
    for (const lx of [L * 0.32, -L * 0.32]) for (const lz of [W / 2 - 0.05, -W / 2 + 0.05]) wheel(lx, lz, r, 0.24)
    return
  }
  if (kind === 'pickup') {
    const L = 5.2
    const W = 1.85
    f.box('metal', 0, 0.35, 0, L, 0.75, W, paint, { collide: 'metal' })
    f.box('metal', 1.0, 1.1, 0, 1.6, 0.68, W - 0.1, paint, { collide: 'metal' })
    f.box('glass', 1.05, 1.18, 0, 1.62, 0.5, W - 0.08, '#1b2125')
    f.box('metal', -1.35, 1.1, W / 2 - 0.05, 2.3, 0.35, 0.06, paint)
    f.box('metal', -1.35, 1.1, -W / 2 + 0.05, 2.3, 0.35, 0.06, paint)
    // Mounted gun on a pedestal (a militia technical).
    f.cyl('metal', -1.4, 1.1, 0, 0.06, 0.9, PAL.metal, { seg: 6 })
    f.box('metal', -1.4, 1.95, 0, 1.3, 0.14, 0.14, '#2a2c2d')
    for (const lx of [1.6, -1.6]) for (const lz of [W / 2 - 0.05, -W / 2 + 0.05]) wheel(lx, lz, 0.36, 0.26)
    return
  }
  // Cargo truck or fuel tanker.
  const L = 7.6
  const W = 2.4
  f.box('metal', 0, 0.55, 0, L, 0.3, 1.2, PAL.metal, { collide: 'metal' })
  f.box('metal', L / 2 - 1.1, 0.8, 0, 2.0, 1.75, W, paint, { collide: 'metal' })
  f.box('glass', L / 2 - 0.15, 1.75, 0, 0.12, 0.7, W - 0.3, '#1b2125')
  f.box('metal', L / 2 - 1.1, 2.55, 0, 2.0, 0.08, W - 0.05, dark)
  f.box('metal', L / 2 - 0.02, 0.8, 0, 0.1, 0.5, W - 0.3, dark)
  if (kind === 'tanker') {
    f.cyl('metal', -0.9, 1.85, 0, 1.1, 5.2, vary('#c9c5bb', rnd, 0.04), { seg: 18, rz: Math.PI / 2 })
    f.box('metal', -0.9, 0.8, 0, 5.2, 2.1, 2.2, '#c9c5bb', { collide: 'metal', noMesh: true })
    f.box('metal', -0.9, 2.95, 0, 4.6, 0.06, 0.6, PAL.metal)
  } else {
    f.box('metal', -1.0, 0.85, 0, 5.4, 0.25, W, dark)
    f.box('cloth', -1.0, 1.1, 0, 5.4, 1.9, W - 0.04, vary('#5b5f45', rnd, 0.05), { collide: 'fabric', soft: true })
    for (let i = 0; i < 4; i += 1) f.box('cloth', -3.4 + i * 1.6, 2.98, 0, 0.08, 0.05, W, '#4c503a')
  }
  for (const lx of [L / 2 - 1.2, -1.6, -2.9]) for (const lz of [W / 2 - 0.2, -W / 2 + 0.2]) wheel(lx, lz, 0.5, 0.38)
}

export function watchtower(site: Site, x: number, z: number, platform: number, base: number, style: 'wood' | 'steel' = 'wood'): void {
  const f = new Frame(site, x, base, z, 0)
  const leg = style === 'wood' ? PAL.woodDark : PAL.metal
  const half = 1.5
  const total = platform + 2.4
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      f.box(style === 'wood' ? 'std' : 'metal', sx * half, -0.3, sz * half, 0.2, total + 0.3, 0.2, leg, { collide: style === 'wood' ? 'wood' : 'metal' })
    }
  }
  for (let level = 0; level < 2; level += 1) {
    const y0 = (level * platform) / 2 + 0.4
    const y1 = ((level + 1) * platform) / 2 - 0.1
    f.tube('std', [-half, y0, half], [half, y1, half], 0.05, leg)
    f.tube('std', [half, y0, -half], [-half, y1, -half], 0.05, leg)
    f.tube('std', [half, y0, half], [half, y1, -half], 0.05, leg)
    f.tube('std', [-half, y0, -half], [-half, y1, half], 0.05, leg)
  }
  f.box('std', 0, platform - 0.2, 0, 3.4, 0.2, 3.4, PAL.wood, { collide: 'wood' })
  // Chest-high walls: plank for wood, sandbags for steel.
  const wallH = 1.0
  for (const [lx, lz, sx, sz] of [
    [0, 1.65, 3.4, 0.12],
    [0, -1.65, 3.4, 0.12],
    [1.65, 0, 0.12, 3.2],
    [-1.65, 0, 0.12, 3.2],
  ] as const) {
    f.box('std', lx, platform, lz, sx, wallH, sz, vary(style === 'wood' ? PAL.woodLight : PAL.sandbag, site.rnd, 0.06), { collide: 'wood' })
  }
  if (style === 'wood') {
    for (let i = 0; i < 6; i += 1) f.box('std', -1.4 + i * 0.56, platform + 0.05, 1.72, 0.02, wallH - 0.1, 0.02, PAL.woodDark)
  }
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) f.box('std', sx * 1.6, platform, sz * 1.6, 0.1, 2.35, 0.1, leg)
  f.box('metal', 0, platform + 2.35, 0, 3.9, 0.07, 3.9, vary('#6f6e66', site.rnd, 0.05), { rx: 0.06, collide: 'metal' })
  // Ladder up the north side.
  for (const sx of [-0.25, 0.25]) f.box('std', sx, 0, -half - 0.35, 0.06, platform, 0.06, leg)
  for (let i = 1; i < platform / 0.35; i += 1) f.box('std', 0, i * 0.35, -half - 0.35, 0.5, 0.04, 0.04, leg)
  // Searchlight.
  f.cyl('metal', 1.2, platform + wallH, 1.5, 0.05, 0.25, PAL.metal, { seg: 6 })
  f.cyl('metal', 1.2, platform + wallH + 0.22, 1.42, 0.17, 0.32, '#2b2d2e', { seg: 10, rx: Math.PI / 2 + 0.25 })
  site.lamps.push({ ...worldOf(f, 1.2, platform + wallH + 0.3, 1.75), color: '#f6edd5', size: 1.4, kind: 'flood' })
}

function worldOf(f: Frame, lx: number, ly: number, lz: number): { x: number; y: number; z: number } {
  return { x: f.wx(lx, lz), y: f.y + ly, z: f.wz(lx, lz) }
}

export function waterTower(site: Site, x: number, z: number, platform: number, base: number): void {
  const f = new Frame(site, x, base, z, 0)
  const tankBase = platform + 2.6
  const legR = 2.0
  for (let i = 0; i < 4; i += 1) {
    const a = Math.PI / 4 + (i * Math.PI) / 2
    const lx = Math.sin(a) * legR
    const lz = Math.cos(a) * legR
    f.box('metal', lx, -0.3, lz, 0.18, tankBase + 0.3, 0.18, '#6a6d6e', { collide: 'metal' })
    const b = Math.PI / 4 + ((i + 1) * Math.PI) / 2
    for (const [y0, y1] of [
      [0.5, platform / 2],
      [platform / 2, platform - 0.3],
    ]) {
      f.tube('metal', [lx, y0, lz], [Math.sin(b) * legR, y1, Math.cos(b) * legR], 0.04, '#6a6d6e', 4)
    }
  }
  f.cyl('metal', 0, platform - 0.16, 0, 2.75, 0.16, '#5d6062', { seg: 16, collide: 'metal' })
  const posts = 16
  for (let i = 0; i < posts; i += 1) {
    const a = (i / posts) * Math.PI * 2
    f.cyl('metal', Math.sin(a) * 2.65, platform, Math.cos(a) * 2.65, 0.025, 1.0, '#7d8183', { seg: 4 })
    const b = ((i + 1) / posts) * Math.PI * 2
    for (const y of [0.5, 1.0]) {
      f.tube('metal', [Math.sin(a) * 2.65, platform + y, Math.cos(a) * 2.65], [Math.sin(b) * 2.65, platform + y, Math.cos(b) * 2.65], 0.022, '#7d8183', 4)
    }
  }
  // Low kick plate on the south arc gives a duel sniper partial cover.
  for (let i = 0; i < 6; i += 1) {
    const a = -0.75 + i * 0.3
    f.box('metal', Math.sin(a) * 2.62, platform, Math.cos(a) * 2.62, 0.82, 0.32, 0.04, '#55585a', { ry: a, collide: 'metal' })
  }
  f.cyl('metal', 0, tankBase, 0, 2.3, 3.0, vary('#8f9496', site.rnd, 0.04), { seg: 20, collide: 'metal' })
  f.cyl('metal', 0, tankBase + 3.0, 0, 2.35, 0.9, '#7d8183', { seg: 20, top: 0.08 })
  for (let i = 0; i < 3; i += 1) f.cyl('metal', 0, tankBase + 0.7 + i * 0.85, 0, 2.32, 0.05, '#6f7476', { seg: 20 })
  f.cyl('metal', 0, 0, 0, 0.12, tankBase, '#55595b', { seg: 6 })
  for (const sx of [-0.22, 0.22]) f.box('metal', sx, 0, -2.2, 0.05, platform, 0.05, '#55595b')
  for (let i = 1; i < platform / 0.4; i += 1) f.box('metal', 0, i * 0.4, -2.2, 0.44, 0.035, 0.035, '#55595b')
}

export function compoundWall(site: Site, x0: number, z0: number, x1: number, z1: number, height: number, base: number, color = '#c2b195'): void {
  const dx = x1 - x0
  const dz = z1 - z0
  const length = Math.hypot(dx, dz)
  const rot = -Math.atan2(dz, dx)
  const f = new Frame(site, (x0 + x1) / 2, base, (z0 + z1) / 2, rot)
  const wall = vary(color, site.rnd, 0.03)
  f.box('std', 0, -0.4, 0, length, height + 0.4, 0.4, wall, { collide: 'concrete' })
  f.box('std', 0, height, 0, length + 0.1, 0.08, 0.52, wall.clone().multiplyScalar(1.08))
  f.box('std', 0, -0.4, 0, length + 0.04, 0.7, 0.46, wall.clone().multiplyScalar(0.62))
  const piers = Math.floor(length / 4.5)
  for (let i = 0; i <= piers; i += 1) f.box('std', -length / 2 + (i * length) / Math.max(1, piers), 0, 0, 0.5, height + 0.18, 0.55, wall.clone().multiplyScalar(0.92))
  // Broken glass/wire topping.
  for (let i = 0; i < length / 1.2; i += 1) f.box('metal', -length / 2 + i * 1.2 + 0.6, height + 0.08, 0, 0.03, 0.35, 0.03, '#4a4a46')
  f.box('metal', 0, height + 0.36, 0, length, 0.015, 0.015, '#4a4a46')
}

/** Chain-link fence panel run along a straight segment. */
export function fence(site: Site, x0: number, z0: number, x1: number, z1: number, base: number, height = 2.4): void {
  const dx = x1 - x0
  const dz = z1 - z0
  const length = Math.hypot(dx, dz)
  const rot = -Math.atan2(dz, dx)
  const f = new Frame(site, (x0 + x1) / 2, base, (z0 + z1) / 2, rot)
  f.box('fence', 0, 0, 0, length, height, 0.02, '#9aa0a2', { collide: 'metal', soft: true })
  const posts = Math.max(1, Math.round(length / 3))
  for (let i = 0; i <= posts; i += 1) {
    const lx = -length / 2 + (i * length) / posts
    f.cyl('metal', lx, -0.2, 0, 0.04, height + 0.55, '#7f8587', { seg: 6 })
    f.box('metal', lx, height + 0.05, -0.18, 0.03, 0.03, 0.4, '#7f8587', { rx: -0.6 })
  }
  f.cyl('metal', -length / 2, height - 0.02, 0, 0.025, length, '#7f8587', { seg: 5, rz: -Math.PI / 2 })
  for (const k of [0, 1, 2]) f.box('metal', 0, height + 0.2 + k * 0.12, -0.18 - k * 0.07, length, 0.01, 0.01, '#3d3f3f')
}

export function flagPole(site: Site, x: number, z: number, base: number, height: number, colors: [string, string], kind: 'flag' | 'windsock' = 'flag'): void {
  const f = new Frame(site, x, base, z, 0)
  f.cyl('metal', 0, 0, 0, kind === 'flag' ? 0.05 : 0.07, height, '#b5b9bb', { seg: 8 })
  f.cyl('std', 0, -0.2, 0, 0.35, 0.3, PAL.concreteDark, { seg: 10 })
  if (kind === 'flag') f.blob('metal', 0, height + 0.06, 0, 0.08, 0.08, 0.08, '#c9a43c')
  site.flags.push({ x, y: base + height - (kind === 'flag' ? 0.05 : 0.2), z, kind, colors, size: kind === 'flag' ? 1.6 : 1.7 })
}

export function streetLamp(site: Site, x: number, z: number, rot: number, base: number): void {
  const f = new Frame(site, x, base, z, rot)
  f.cyl('metal', 0, 0, 0, 0.07, 6.2, '#4d5154', { seg: 8, top: 0.6, collide: 'metal' })
  f.tube('metal', [0, 6.0, 0], [0, 6.4, 1.3], 0.04, '#4d5154', 5)
  f.box('metal', 0, 6.25, 1.35, 0.3, 0.12, 0.55, '#3b3e40')
  f.box('glow', 0, 6.2, 1.35, 0.22, 0.04, 0.42, '#ffd9a0')
  site.lamps.push({ ...worldOf(f, 0, 6.15, 1.35), color: '#ffcf8a', size: 2.2, kind: 'street' })
}

export function powerPole(site: Site, x: number, z: number, rot: number, base: number, height = 8.5): [number, number, number][] {
  const f = new Frame(site, x, base, z, rot)
  f.cyl('std', 0, -0.4, 0, 0.13, height + 0.4, vary('#5b4632', site.rnd, 0.06), { seg: 8, top: 0.75 })
  f.box('std', 0, height - 0.6, 0, 2.0, 0.12, 0.12, '#4a3a2a')
  const tips: [number, number, number][] = []
  for (const lx of [-0.85, 0, 0.85]) {
    f.cyl('std', lx, height - 0.48, 0, 0.04, 0.14, '#c6c2b4', { seg: 6 })
    tips.push(f.world(lx, height - 0.35, 0))
  }
  if (site.rnd() < 0.3) f.box('metal', 0, height - 1.6, 0.25, 0.45, 0.6, 0.45, '#7d8184')
  return tips
}

export function marketStall(site: Site, x: number, z: number, rot: number, canvas: string, base: number): void {
  const f = new Frame(site, x, base, z, rot)
  const rnd = site.rnd
  for (const sx of [-1.4, 1.4]) for (const sz of [-1, 1]) f.box('std', sx, 0, sz, 0.08, sz > 0 ? 2.2 : 2.55, 0.08, PAL.woodDark)
  f.box('cloth', 0, 2.3, 0, 3.3, 0.04, 2.5, vary(canvas, rnd, 0.06), { rx: 0.14, collide: 'fabric', soft: true })
  for (let i = 0; i < 7; i += 1) f.box('cloth', -1.5 + i * 0.5, 2.07, 1.28, 0.42, 0.22, 0.02, i % 2 ? vary(canvas, rnd, 0.05) : '#e8e1cf')
  f.box('std', 0, 0, 0.55, 2.8, 0.85, 0.9, PAL.woodLight, { collide: 'wood' })
  const goods = ['#c2562f', '#d9a531', '#5e8a3a', '#8f3a3a', '#d8c79a']
  for (let i = 0; i < 8; i += 1) {
    const gx = -1.15 + (i % 4) * 0.75
    const gz = 0.32 + Math.floor(i / 4) * 0.42
    f.box('std', gx, 0.85, gz, 0.6, 0.16, 0.36, PAL.wood)
    f.blob('foliage', gx, 1.02, gz, 0.26, 0.08, 0.15, vary(pick(rnd, goods), rnd, 0.12))
  }
  f.box('std', 1.9, 0, -0.4, 0.55, 0.45, 0.55, PAL.wood)
  f.box('std', 1.85, 0.45, -0.35, 0.5, 0.4, 0.5, PAL.woodLight)
}

export function well(site: Site, x: number, z: number, base: number): void {
  const f = new Frame(site, x, base, z, 0)
  f.cyl('std', 0, 0, 0, 1.15, 0.85, vary('#a39b8b', site.rnd, 0.04), { seg: 16, collide: 'concrete' })
  f.cyl('std', 0, 0.85, 0, 1.22, 0.1, '#8e877a', { seg: 16 })
  for (const sx of [-1, 1]) f.box('std', sx * 1.0, 0.85, 0, 0.12, 1.6, 0.12, PAL.woodDark)
  f.box('std', 0, 2.4, 0, 2.3, 0.1, 0.12, PAL.woodDark)
  f.box('std', 0, 2.5, 0, 2.8, 0.06, 1.7, PAL.wood, { rz: 0.05 })
}

export function radioMast(site: Site, x: number, z: number, height: number, base: number): void {
  const f = new Frame(site, x, base, z, 0)
  const r0 = 1.25
  const r1 = 0.35
  const legs = [0, (Math.PI * 2) / 3, (Math.PI * 4) / 3]
  const sections = Math.round(height / 2.2)
  const radius = (t: number) => r0 + (r1 - r0) * t
  const color = '#b8b1a6'
  for (let s = 0; s < sections; s += 1) {
    const t0 = s / sections
    const t1 = (s + 1) / sections
    const y0 = t0 * height
    const y1 = t1 * height
    for (let i = 0; i < 3; i += 1) {
      const a = legs[i]
      const b = legs[(i + 1) % 3]
      const p0: [number, number, number] = [Math.sin(a) * radius(t0), y0, Math.cos(a) * radius(t0)]
      const p1: [number, number, number] = [Math.sin(a) * radius(t1), y1, Math.cos(a) * radius(t1)]
      const q1: [number, number, number] = [Math.sin(b) * radius(t1), y1, Math.cos(b) * radius(t1)]
      f.tube('metal', p0, p1, 0.05, s % 2 ? '#b94a37' : color, 5)
      f.tube('metal', p1, q1, 0.025, color, 4)
      f.tube('metal', p0, q1, 0.02, color, 4)
    }
  }
  for (let i = 0; i < 3; i += 1) {
    const a = legs[i]
    f.box('metal', Math.sin(a) * r0, 0, Math.cos(a) * r0, 0.12, height * 0.5, 0.12, color, { collide: 'metal', noMesh: true })
  }
  // Antenna arrays and beacon.
  for (let i = 0; i < 3; i += 1) {
    const a = legs[i] + 0.5
    f.box('metal', Math.sin(a) * 0.6, height * 0.72 + i * 1.6, Math.cos(a) * 0.6, 0.35, 1.4, 0.12, '#d8d5cc', { ry: a })
  }
  f.cyl('metal', 0, height, 0, 0.04, 3.2, color, { seg: 5 })
  f.box('glow', 0, height + 3.1, 0, 0.18, 0.18, 0.18, '#ff3b2a')
  site.lamps.push({ x, y: base + height + 3.2, z, color: '#ff3b2a', size: 2.4, kind: 'beacon' })
  f.box('std', 0, -0.4, 0, 3.2, 0.55, 3.2, PAL.concreteDark)
}

export function satelliteDish(site: Site, x: number, z: number, base: number, size = 3.2): void {
  const f = new Frame(site, x, base, z, 0)
  f.box('std', 0, -0.3, 0, 1.6, 0.6, 1.6, PAL.concreteDark)
  f.cyl('metal', 0, 0.3, 0, 0.18, 1.6, '#8f9396', { seg: 10, collide: 'metal' })
  f.blob('metal', 0, 2.2, 0.15, size / 2, size / 2, 0.28, '#e0ddd4', 0.35, -0.55)
  f.tube('metal', [0, 2.2, 0.3], [0.25, 2.9, 1.6], 0.03, PAL.metal, 4)
  f.tube('metal', [0, 2.2, 0.3], [-0.25, 2.9, 1.6], 0.03, PAL.metal, 4)
  f.box('metal', 0, 2.75, 1.55, 0.25, 0.25, 0.3, '#3b3f42')
}

export function boomBarrier(site: Site, x: number, z: number, rot: number, base: number, length = 6.5): void {
  const f = new Frame(site, x, base, z, rot)
  f.box('metal', 0, 0, 0, 0.45, 1.05, 0.45, '#b33a2a', { collide: 'metal' })
  const stripes = 8
  for (let i = 0; i < stripes; i += 1) {
    f.box('metal', 0.3 + (i + 0.5) * (length / stripes), 0.88, 0, length / stripes, 0.12, 0.12, i % 2 ? '#e6e2d8' : '#b33a2a')
  }
  f.box('metal', 0.3 + length, 0, 0, 0.12, 0.85, 0.12, '#5c5f61')
}

export function crateStack(site: Site, x: number, z: number, rot: number, base: number, count = 3): void {
  const f = new Frame(site, x, base, z, rot)
  for (let i = 0; i < count; i += 1) {
    const lx = (i % 2) * 0.85 - 0.4
    const ly = Math.floor(i / 2) * 0.62
    const color = vary(site.rnd() < 0.5 ? '#5d6340' : PAL.woodLight, site.rnd, 0.08)
    f.box('std', lx, ly, 0, 0.8, 0.6, 0.62, color, { collide: 'wood' })
    f.box('std', lx, ly + 0.27, 0.315, 0.82, 0.06, 0.02, color.clone().multiplyScalar(0.7))
  }
}

export function barrels(site: Site, x: number, z: number, base: number, count = 4, color = '#3f5a6e'): void {
  const f = new Frame(site, x, base, z, 0)
  for (let i = 0; i < count; i += 1) {
    const lx = (i % 3) * 0.66
    const lz = Math.floor(i / 3) * 0.66
    const c = vary(site.rnd() < 0.3 ? PAL.rust : color, site.rnd, 0.07)
    f.cyl('metal', lx, 0, lz, 0.29, 0.88, c, { seg: 12, collide: 'metal' })
    f.cyl('metal', lx, 0.3, lz, 0.3, 0.04, c.clone().multiplyScalar(0.75), { seg: 12 })
    f.cyl('metal', lx, 0.6, lz, 0.3, 0.04, c.clone().multiplyScalar(0.75), { seg: 12 })
  }
}

export function generator(site: Site, x: number, z: number, rot: number, base: number): void {
  const f = new Frame(site, x, base, z, rot)
  f.box('metal', 0, 0, 0, 3.2, 0.25, 1.4, PAL.metal)
  f.box('metal', 0, 0.25, 0, 2.9, 1.55, 1.25, vary('#6d7a4e', site.rnd, 0.05), { collide: 'metal' })
  for (let i = 0; i < 8; i += 1) f.box('metal', -1.2 + i * 0.22, 0.6, 0.63, 0.1, 0.8, 0.02, '#3d4430')
  f.cyl('metal', 1.0, 1.8, -0.3, 0.09, 0.9, '#2c2d2e', { seg: 8 })
}

export function lightTower(site: Site, x: number, z: number, base: number, height = 11): void {
  const f = new Frame(site, x, base, z, 0)
  f.box('metal', 0, 0, 0, 1.6, 0.7, 2.6, '#c9a13c')
  f.cyl('metal', 0, 0.7, 0, 0.12, height, '#9a9e9f', { seg: 8, top: 0.7, collide: 'metal' })
  f.box('metal', 0, height + 0.5, 0, 2.2, 0.12, 0.12, PAL.metal)
  for (const lx of [-0.8, -0.27, 0.27, 0.8]) {
    f.box('metal', lx, height + 0.65, 0.05, 0.45, 0.4, 0.2, '#2d2f30', { rx: 0.35 })
    f.box('glow', lx, height + 0.68, 0.17, 0.38, 0.32, 0.02, '#fff4dc', { rx: 0.35 })
  }
  site.lamps.push({ ...worldOf(f, 0, height + 0.8, 0.3), color: '#fff1d6', size: 5, kind: 'flood' })
}

export function prefabCabin(site: Site, x: number, z: number, rot: number, base: number, roofCover: boolean): void {
  const f = new Frame(site, x, base, z, rot)
  const L = 6.2
  const W = 2.5
  const H = 2.7
  const body = vary('#b9b4a4', site.rnd, 0.04)
  f.box('std', 0, -0.25, 0, L + 0.2, 0.25, W + 0.2, PAL.concreteDark)
  f.box('metal', 0, 0, 0, L, H, W, body, { collide: 'metal' })
  for (let i = 1; i < L / 0.42; i += 1) {
    f.box('metal', -L / 2 + i * 0.42, 0.05, W / 2, 0.05, H - 0.2, 0.03, body.clone().multiplyScalar(0.84))
    f.box('metal', -L / 2 + i * 0.42, 0.05, -W / 2, 0.05, H - 0.2, 0.03, body.clone().multiplyScalar(0.84))
  }
  f.box('metal', 0, H - 0.08, 0, L + 0.12, 0.1, W + 0.12, body.clone().multiplyScalar(0.7))
  f.box('std', 1.6, 0, W / 2 + 0.01, 0.9, 2.05, 0.04, '#4a4d48')
  f.box('glass', -1.2, 1.1, W / 2 + 0.01, 1.2, 0.8, 0.04, '#1f272b')
  f.box('metal', -1.2, 1.9, W / 2 + 0.06, 1.4, 0.06, 0.12, '#7d8184')
  f.box('metal', -2.4, H, -0.6, 0.9, 0.55, 0.6, '#c9c7c0')
  if (roofCover) sandbagLine(f, 0, H + 0.02, W / 2 - 0.25, L - 0.6, 1)
}

export function churchTower(site: Site, x: number, z: number, base: number): void {
  const f = new Frame(site, x, base, z, 0)
  const stone = vary('#b8ab92', site.rnd, 0.03)
  f.box('std', 0, -0.5, 0, 4.4, 0.8, 4.4, stone.clone().multiplyScalar(0.7))
  f.box('std', 0, 0, 0, 4.0, 15, 4.0, stone, { collide: 'concrete' })
  f.box('std', 0, 6, 0, 4.2, 0.25, 4.2, stone.clone().multiplyScalar(1.08))
  f.box('std', 0, 11.5, 0, 4.2, 0.25, 4.2, stone.clone().multiplyScalar(1.08))
  for (const face of faces(2.0, 2.0)) {
    faceBox(f, face, 'std', 0, 12.3, 0.01, 1.1, 2.0, 0.08, '#1b1714')
    faceBox(f, face, 'std', 0, 7.6, 0.01, 0.5, 1.4, 0.08, '#2a241f')
  }
  f.box('std', 0, 15, 0, 4.3, 0.3, 4.3, stone.clone().multiplyScalar(1.1))
  f.cyl('std', 0, 15.3, 0, 2.6, 4.2, vary('#6f5a48', site.rnd, 0.04), { seg: 4, top: 0.02, ry: Math.PI / 4 })
  f.cyl('metal', 0, 19.4, 0, 0.04, 1.4, '#3b3b3a', { seg: 4 })
  f.box('metal', 0, 20.3, 0, 0.6, 0.06, 0.06, '#3b3b3a')
}

export function rubble(f: Frame, lx: number, ly: number, lz: number, spread: number, count: number, color = PAL.concrete): void {
  const rnd = f.site.rnd
  for (let i = 0; i < count; i += 1) {
    const s = 0.08 + rnd() * 0.28
    f.geom(
      'std',
      UNIT_BOX,
      lx + (rnd() - 0.5) * spread,
      ly + s * 0.3,
      lz + (rnd() - 0.5) * spread,
      s * (1 + rnd()),
      s * 0.6,
      s,
      vary(color, rnd, 0.1),
      rnd() * 0.5,
      rnd() * Math.PI,
      rnd() * 0.5,
    )
  }
}
