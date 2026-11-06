/**
 * Signed-distance sculpting toolkit used to generate the athlete meshes at runtime.
 *
 * Shapes are authored as smooth unions of anatomical primitives (ellipsoids, round cones, boxes),
 * then polygonised with naive surface nets. Vertex positions are projected back onto the iso-surface
 * and normals come from the analytic field gradient, so shading stays smooth even at coarse voxel sizes.
 */

export type V3 = [number, number, number]

const BIG = 1e3

export const v3 = {
  add: (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]],
  sub: (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]],
  scale: (a: V3, s: number): V3 => [a[0] * s, a[1] * s, a[2] * s],
  madd: (a: V3, b: V3, s: number): V3 => [a[0] + b[0] * s, a[1] + b[1] * s, a[2] + b[2] * s],
  dot: (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2],
  cross: (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]],
  len: (a: V3) => Math.hypot(a[0], a[1], a[2]),
  norm: (a: V3): V3 => {
    const l = Math.hypot(a[0], a[1], a[2]) || 1
    return [a[0] / l, a[1] / l, a[2] / l]
  },
  lerp: (a: V3, b: V3, t: number): V3 => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t],
}

/** Orthonormal frame (rows = local X, Y, Z in world space) whose local Y follows `axis`. */
export interface Frame {
  x: V3
  y: V3
  z: V3
}

export function frameFromAxis(axis: V3, hintZ: V3 = [0, 0, 1]): Frame {
  const y = v3.norm(axis)
  let x = v3.cross(y, hintZ)
  if (v3.len(x) < 1e-6) x = v3.cross(y, [1, 0, 0])
  x = v3.norm(x)
  const z = v3.cross(x, y)
  return { x, y, z }
}

export const IDENTITY_FRAME: Frame = { x: [1, 0, 0], y: [0, 1, 0], z: [0, 0, 1] }

/** Rotate a frame around world axes by Euler XYZ (radians). */
export function eulerFrame(rx: number, ry: number, rz: number): Frame {
  const cx = Math.cos(rx), sx = Math.sin(rx)
  const cy = Math.cos(ry), sy = Math.sin(ry)
  const cz = Math.cos(rz), sz = Math.sin(rz)
  // R = Rx * Ry * Rz (three.js 'XYZ' order); columns are the rotated basis vectors.
  const m00 = cy * cz, m01 = -cy * sz, m02 = sy
  const m10 = cx * sz + sx * sy * cz, m11 = cx * cz - sx * sy * sz, m12 = -sx * cy
  const m20 = sx * sz - cx * sy * cz, m21 = sx * cz + cx * sy * sz, m22 = cx * cy
  return { x: [m00, m10, m20], y: [m01, m11, m21], z: [m02, m12, m22] }
}

const enum Kind {
  Ellipsoid = 0,
  RoundCone = 1,
  Box = 2,
  /** intersection of two ellipsoids sharing one frame: an almond (eyelid openings) */
  Lens = 3,
}

export const enum Op {
  Union = 0,
  Subtract = 1,
  Intersect = 2,
}

interface Prim {
  kind: Kind
  op: Op
  k: number
  group: number
  // bounds
  x0: number
  y0: number
  z0: number
  x1: number
  y1: number
  z1: number
  // tight bounds (un-padded) for distance culling
  tx0: number
  ty0: number
  tz0: number
  tx1: number
  ty1: number
  tz1: number
  // shared center / first point
  cx: number
  cy: number
  cz: number
  // rotation rows (world -> local)
  m00: number
  m01: number
  m02: number
  m10: number
  m11: number
  m12: number
  m20: number
  m21: number
  m22: number
  // ellipsoid radii / box half extents
  rx: number
  ry: number
  rz: number
  // round cone
  bax: number
  bay: number
  baz: number
  l2: number
  rr: number
  a2: number
  il2: number
  r1: number
  r2: number
  // box rounding
  round: number
  // lens: second ellipsoid centre and radii
  qx: number
  qy: number
  qz: number
  sx: number
  sy: number
  sz: number
}

function blankPrim(kind: Kind, op: Op, k: number, group: number): Prim {
  return {
    kind, op, k, group,
    x0: 0, y0: 0, z0: 0, x1: 0, y1: 0, z1: 0,
    tx0: 0, ty0: 0, tz0: 0, tx1: 0, ty1: 0, tz1: 0,
    cx: 0, cy: 0, cz: 0,
    m00: 1, m01: 0, m02: 0, m10: 0, m11: 1, m12: 0, m20: 0, m21: 0, m22: 1,
    rx: 0, ry: 0, rz: 0,
    bax: 0, bay: 0, baz: 0, l2: 0, rr: 0, a2: 0, il2: 0, r1: 0, r2: 0,
    round: 0,
    qx: 0, qy: 0, qz: 0, sx: 1, sy: 1, sz: 1,
  }
}

function smin(a: number, b: number, k: number) {
  if (k <= 0) return a < b ? a : b
  const h = k - Math.abs(a - b)
  if (h <= 0) return a < b ? a : b
  const hh = h / k
  return (a < b ? a : b) - hh * hh * k * 0.25
}

function smax(a: number, b: number, k: number) {
  return -smin(-a, -b, k)
}

/** Approximate ellipsoid distance in the primitive's frame, for centre (cx, cy, cz) and radii (rx, ry, rz). */
function ellDist(p: Prim, cx: number, cy: number, cz: number, rx: number, ry: number, rz: number, x: number, y: number, z: number) {
  const dx = x - cx, dy = y - cy, dz = z - cz
  const lx = (p.m00 * dx + p.m01 * dy + p.m02 * dz) / rx
  const ly = (p.m10 * dx + p.m11 * dy + p.m12 * dz) / ry
  const lz = (p.m20 * dx + p.m21 * dy + p.m22 * dz) / rz
  const k0 = Math.sqrt(lx * lx + ly * ly + lz * lz)
  const k1 = Math.sqrt((lx / rx) ** 2 + (ly / ry) ** 2 + (lz / rz) ** 2)
  if (k1 < 1e-9) return -Math.min(rx, ry, rz)
  return (k0 * (k0 - 1)) / k1
}

function primDist(p: Prim, x: number, y: number, z: number): number {
  switch (p.kind) {
    case Kind.Ellipsoid:
      return ellDist(p, p.cx, p.cy, p.cz, p.rx, p.ry, p.rz, x, y, z)
    case Kind.Lens: {
      const a = ellDist(p, p.cx, p.cy, p.cz, p.rx, p.ry, p.rz, x, y, z)
      const b = ellDist(p, p.qx, p.qy, p.qz, p.sx, p.sy, p.sz, x, y, z)
      return a > b ? a : b
    }
    case Kind.RoundCone: {
      const pax = x - p.cx, pay = y - p.cy, paz = z - p.cz
      const l2 = p.l2
      const yy = pax * p.bax + pay * p.bay + paz * p.baz
      const zz = yy - l2
      const xvx = pax * l2 - p.bax * yy
      const xvy = pay * l2 - p.bay * yy
      const xvz = paz * l2 - p.baz * yy
      const x2 = xvx * xvx + xvy * xvy + xvz * xvz
      const y2 = yy * yy * l2
      const z2 = zz * zz * l2
      const rr = p.rr
      const k = Math.sign(rr) * rr * rr * x2
      if (Math.sign(zz) * p.a2 * z2 > k) return Math.sqrt(x2 + z2) * p.il2 - p.r2
      if (Math.sign(yy) * p.a2 * y2 < k) return Math.sqrt(x2 + y2) * p.il2 - p.r1
      return (Math.sqrt(x2 * p.a2 * p.il2) + yy * rr) * p.il2 - p.r1
    }
    case Kind.Box: {
      const dx = x - p.cx, dy = y - p.cy, dz = z - p.cz
      const qx = Math.abs(p.m00 * dx + p.m01 * dy + p.m02 * dz) - p.rx + p.round
      const qy = Math.abs(p.m10 * dx + p.m11 * dy + p.m12 * dz) - p.ry + p.round
      const qz = Math.abs(p.m20 * dx + p.m21 * dy + p.m22 * dz) - p.rz + p.round
      const ox = qx > 0 ? qx : 0, oy = qy > 0 ? qy : 0, oz = qz > 0 ? qz : 0
      const inside = Math.min(Math.max(qx, qy, qz), 0)
      return Math.sqrt(ox * ox + oy * oy + oz * oz) + inside - p.round
    }
  }
  return BIG
}

export interface SdfField {
  eval(x: number, y: number, z: number): number
}

/** A sequence of primitives combined with smooth CSG operations, accelerated by a uniform bin grid. */
export class Sdf implements SdfField {
  prims: Prim[] = []
  groupCount = 1
  /** Optional per-point displacement (cloth folds, surface noise). Must stay small. */
  displace: ((x: number, y: number, z: number) => number) | null = null
  private bins: Int32Array[] = []
  private bx0 = 0
  private by0 = 0
  private bz0 = 0
  private bs = 0.02
  private bnx = 0
  private bny = 0
  private bnz = 0
  private built = false
  private static EMPTY = new Int32Array(0)

  private push(p: Prim, pad: number) {
    p.tx0 = p.x0
    p.ty0 = p.y0
    p.tz0 = p.z0
    p.tx1 = p.x1
    p.ty1 = p.y1
    p.tz1 = p.z1
    p.x0 -= pad
    p.y0 -= pad
    p.z0 -= pad
    p.x1 += pad
    p.y1 += pad
    p.z1 += pad
    this.prims.push(p)
    this.groupCount = Math.max(this.groupCount, p.group + 1)
    this.built = false
    return this
  }

  ellipsoid(c: V3, r: V3, opts: { frame?: Frame; k?: number; op?: Op; group?: number } = {}) {
    const f = opts.frame ?? IDENTITY_FRAME
    const p = blankPrim(Kind.Ellipsoid, opts.op ?? Op.Union, opts.k ?? 0, opts.group ?? 0)
    p.cx = c[0]
    p.cy = c[1]
    p.cz = c[2]
    p.rx = r[0]
    p.ry = r[1]
    p.rz = r[2]
    setRows(p, f)
    const m = Math.max(r[0], r[1], r[2])
    p.x0 = c[0] - m
    p.y0 = c[1] - m
    p.z0 = c[2] - m
    p.x1 = c[0] + m
    p.y1 = c[1] + m
    p.z1 = c[2] + m
    return this.push(p, p.k + 0.004)
  }

  /**
   * Intersection of two ellipsoids in one frame: an almond whose pointed tips sit where the two surfaces
   * cross. Subtracted, it cuts eyelid openings with sharp canthi.
   */
  lens(c1: V3, r1: V3, c2: V3, r2: V3, opts: { frame?: Frame; k?: number; op?: Op; group?: number } = {}) {
    const f = opts.frame ?? IDENTITY_FRAME
    const p = blankPrim(Kind.Lens, opts.op ?? Op.Union, opts.k ?? 0, opts.group ?? 0)
    p.cx = c1[0]
    p.cy = c1[1]
    p.cz = c1[2]
    p.rx = r1[0]
    p.ry = r1[1]
    p.rz = r1[2]
    p.qx = c2[0]
    p.qy = c2[1]
    p.qz = c2[2]
    p.sx = r2[0]
    p.sy = r2[1]
    p.sz = r2[2]
    setRows(p, f)
    // the intersection lies inside both bounding boxes
    const m1 = Math.max(r1[0], r1[1], r1[2])
    const m2 = Math.max(r2[0], r2[1], r2[2])
    p.x0 = Math.max(c1[0] - m1, c2[0] - m2)
    p.y0 = Math.max(c1[1] - m1, c2[1] - m2)
    p.z0 = Math.max(c1[2] - m1, c2[2] - m2)
    p.x1 = Math.min(c1[0] + m1, c2[0] + m2)
    p.y1 = Math.min(c1[1] + m1, c2[1] + m2)
    p.z1 = Math.min(c1[2] + m1, c2[2] + m2)
    return this.push(p, p.k + 0.004)
  }

  sphere(c: V3, r: number, opts: { k?: number; op?: Op; group?: number } = {}) {
    return this.roundCone(c, [c[0], c[1] + 1e-5, c[2]], r, r, opts)
  }

  roundCone(a: V3, b: V3, ra: number, rb: number, opts: { k?: number; op?: Op; group?: number } = {}) {
    const p = blankPrim(Kind.RoundCone, opts.op ?? Op.Union, opts.k ?? 0, opts.group ?? 0)
    p.cx = a[0]
    p.cy = a[1]
    p.cz = a[2]
    p.bax = b[0] - a[0]
    p.bay = b[1] - a[1]
    p.baz = b[2] - a[2]
    p.l2 = Math.max(1e-10, p.bax * p.bax + p.bay * p.bay + p.baz * p.baz)
    p.r1 = ra
    p.r2 = rb
    p.rr = ra - rb
    p.a2 = p.l2 - p.rr * p.rr
    p.il2 = 1 / p.l2
    const m = Math.max(ra, rb)
    p.x0 = Math.min(a[0], b[0]) - m
    p.y0 = Math.min(a[1], b[1]) - m
    p.z0 = Math.min(a[2], b[2]) - m
    p.x1 = Math.max(a[0], b[0]) + m
    p.y1 = Math.max(a[1], b[1]) + m
    p.z1 = Math.max(a[2], b[2]) + m
    return this.push(p, p.k + 0.004)
  }

  box(c: V3, half: V3, opts: { frame?: Frame; round?: number; k?: number; op?: Op; group?: number } = {}) {
    const f = opts.frame ?? IDENTITY_FRAME
    const p = blankPrim(Kind.Box, opts.op ?? Op.Union, opts.k ?? 0, opts.group ?? 0)
    p.cx = c[0]
    p.cy = c[1]
    p.cz = c[2]
    p.rx = half[0]
    p.ry = half[1]
    p.rz = half[2]
    p.round = Math.min(opts.round ?? 0, half[0], half[1], half[2])
    setRows(p, f)
    const m = Math.hypot(half[0], half[1], half[2])
    p.x0 = c[0] - m
    p.y0 = c[1] - m
    p.z0 = c[2] - m
    p.x1 = c[0] + m
    p.y1 = c[1] + m
    p.z1 = c[2] + m
    return this.push(p, p.k + 0.004)
  }

  bounds(): { min: V3; max: V3 } {
    const min: V3 = [BIG, BIG, BIG]
    const max: V3 = [-BIG, -BIG, -BIG]
    for (const p of this.prims) {
      if (p.op !== Op.Union) continue
      min[0] = Math.min(min[0], p.x0)
      min[1] = Math.min(min[1], p.y0)
      min[2] = Math.min(min[2], p.z0)
      max[0] = Math.max(max[0], p.x1)
      max[1] = Math.max(max[1], p.y1)
      max[2] = Math.max(max[2], p.z1)
    }
    return { min, max }
  }

  build(binSize = 0.02) {
    const { min, max } = this.bounds()
    this.bs = binSize
    this.bx0 = min[0]
    this.by0 = min[1]
    this.bz0 = min[2]
    this.bnx = Math.max(1, Math.ceil((max[0] - min[0]) / binSize))
    this.bny = Math.max(1, Math.ceil((max[1] - min[1]) / binSize))
    this.bnz = Math.max(1, Math.ceil((max[2] - min[2]) / binSize))
    const lists: number[][] = []
    for (let i = 0; i < this.bnx * this.bny * this.bnz; i++) lists.push([])
    this.prims.forEach((p, idx) => {
      const i0 = Math.max(0, Math.floor((p.x0 - this.bx0) / binSize))
      const j0 = Math.max(0, Math.floor((p.y0 - this.by0) / binSize))
      const k0 = Math.max(0, Math.floor((p.z0 - this.bz0) / binSize))
      const i1 = Math.min(this.bnx - 1, Math.floor((p.x1 - this.bx0) / binSize))
      const j1 = Math.min(this.bny - 1, Math.floor((p.y1 - this.by0) / binSize))
      const k1 = Math.min(this.bnz - 1, Math.floor((p.z1 - this.bz0) / binSize))
      for (let k = k0; k <= k1; k++) for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) lists[i + this.bnx * (j + this.bny * k)].push(idx)
    })
    this.bins = lists.map((l) => (l.length ? Int32Array.from(l) : Sdf.EMPTY))
    this.built = true
    return this
  }

  private binAt(x: number, y: number, z: number) {
    if (!this.built) this.build()
    const i = Math.floor((x - this.bx0) / this.bs)
    const j = Math.floor((y - this.by0) / this.bs)
    const k = Math.floor((z - this.bz0) / this.bs)
    if (i < 0 || j < 0 || k < 0 || i >= this.bnx || j >= this.bny || k >= this.bnz) return Sdf.EMPTY
    return this.bins[i + this.bnx * (j + this.bny * k)]
  }

  eval(x: number, y: number, z: number): number {
    const list = this.binAt(x, y, z)
    let d = BIG
    const prims = this.prims
    for (let n = 0; n < list.length; n++) {
      const p = prims[list[n]]
      if (x < p.x0 || x > p.x1 || y < p.y0 || y > p.y1 || z < p.z0 || z > p.z1) continue
      // lower bound on this primitive's distance: its tight box
      const ex = x < p.tx0 ? p.tx0 - x : x > p.tx1 ? x - p.tx1 : 0
      const ey = y < p.ty0 ? p.ty0 - y : y > p.ty1 ? y - p.ty1 : 0
      const ez = z < p.tz0 ? p.tz0 - z : z > p.tz1 ? z - p.tz1 : 0
      const lb = ex > ey ? (ex > ez ? ex : ez) : ey > ez ? ey : ez
      if (p.op === Op.Union) {
        if (lb >= d + p.k) continue
      } else if (p.op === Op.Subtract && lb >= p.k - d) continue
      const di = primDist(p, x, y, z)
      if (p.op === Op.Union) d = smin(d, di, p.k)
      else if (p.op === Op.Subtract) d = smax(d, -di, p.k)
      else d = smax(d, di, p.k)
    }
    if (this.displace && d < 0.05) d += this.displace(x, y, z)
    return d
  }

  /** Per-group smooth-union distances (used to derive skin weights). */
  evalGroups(x: number, y: number, z: number, out: Float64Array) {
    out.fill(BIG)
    const list = this.binAt(x, y, z)
    const prims = this.prims
    for (let n = 0; n < list.length; n++) {
      const p = prims[list[n]]
      if (p.op !== Op.Union) continue
      if (x < p.x0 || x > p.x1 || y < p.y0 || y > p.y1 || z < p.z0 || z > p.z1) continue
      out[p.group] = smin(out[p.group], primDist(p, x, y, z), p.k)
    }
  }

  isEmptyAt(x: number, y: number, z: number) {
    return this.binAt(x, y, z).length === 0
  }
}

function setRows(p: Prim, f: Frame) {
  p.m00 = f.x[0]
  p.m01 = f.x[1]
  p.m02 = f.x[2]
  p.m10 = f.y[0]
  p.m11 = f.y[1]
  p.m12 = f.y[2]
  p.m20 = f.z[0]
  p.m21 = f.z[1]
  p.m22 = f.z[2]
}

/** Combines several fields with a hard minimum (e.g. body + garments for occlusion). */
export function unionField(...fields: SdfField[]): SdfField {
  return {
    eval(x, y, z) {
      let d = BIG
      for (const f of fields) d = Math.min(d, f.eval(x, y, z))
      return d
    },
  }
}

export interface MeshData {
  positions: Float32Array
  normals: Float32Array
  indices: Uint32Array
}

export function gradient(f: SdfField, x: number, y: number, z: number, eps: number, out: V3): V3 {
  out[0] = f.eval(x + eps, y, z) - f.eval(x - eps, y, z)
  out[1] = f.eval(x, y + eps, z) - f.eval(x, y - eps, z)
  out[2] = f.eval(x, y, z + eps) - f.eval(x, y, z - eps)
  return out
}

/**
 * Naive surface nets over [min, max] with voxel size h.
 * Two hierarchical passes (4^3 blocks, then 2^3 sub-blocks) test cell centres against the field so only the
 * thin band around the surface is evaluated and meshed at full resolution. Vertices are projected onto the
 * zero set and receive gradient normals.
 */
export function surfaceNets(f: SdfField, min: V3, max: V3, h: number, project = true): MeshData {
  const C = 4
  const bx = Math.ceil((max[0] - min[0]) / h / C)
  const by = Math.ceil((max[1] - min[1]) / h / C)
  const bz = Math.ceil((max[2] - min[2]) / h / C)
  const nx = bx * C + 1, ny = by * C + 1, nz = bz * C + 1
  const sqrt3 = Math.sqrt(3)
  // level 1: block centres
  const blockVal = new Float32Array(bx * by * bz)
  const thr1 = ((C * h * sqrt3) / 2) * 1.3
  const subs: number[] = []
  const sx2 = bx * 2, sy2 = by * 2
  const subVal = new Float32Array(bx * by * bz * 8).fill(NaN)
  const thr2 = ((2 * h * sqrt3) / 2) * 1.3
  for (let k = 0; k < bz; k++)
    for (let j = 0; j < by; j++)
      for (let i = 0; i < bx; i++) {
        const v = f.eval(min[0] + (i + 0.5) * C * h, min[1] + (j + 0.5) * C * h, min[2] + (k + 0.5) * C * h)
        blockVal[i + bx * (j + by * k)] = v
        if (Math.abs(v) > thr1) continue
        // level 2: sub-block centres
        for (let c = 0; c < 8; c++) {
          const si = i * 2 + (c & 1), sj = j * 2 + ((c >> 1) & 1), sk = k * 2 + ((c >> 2) & 1)
          const sv = f.eval(min[0] + (si + 0.5) * 2 * h, min[1] + (sj + 0.5) * 2 * h, min[2] + (sk + 0.5) * 2 * h)
          subVal[si + sx2 * (sj + sy2 * sk)] = sv
          if (Math.abs(sv) <= thr2) subs.push(si, sj, sk)
        }
      }
  const vals = new Float32Array(nx * ny * nz)
  const done = new Uint8Array(nx * ny * nz)
  for (let b = 0; b < subs.length; b += 3) {
    const i0 = subs[b] * 2, j0 = subs[b + 1] * 2, k0 = subs[b + 2] * 2
    for (let k = k0; k <= k0 + 2; k++) {
      const z = min[2] + k * h
      for (let j = j0; j <= j0 + 2; j++) {
        const y = min[1] + j * h
        let base = i0 + nx * (j + ny * k)
        for (let i = i0; i <= i0 + 2; i++, base++) {
          if (done[base]) continue
          done[base] = 1
          vals[base] = f.eval(min[0] + i * h, y, z)
        }
      }
    }
  }
  const signAt = (i: number, j: number, k: number) => {
    const id = i + nx * (j + ny * k)
    if (done[id]) return vals[id] < 0
    const si = Math.min(sx2 - 1, i >> 1), sj = Math.min(sy2 - 1, j >> 1), sk = Math.min(bz * 2 - 1, k >> 1)
    const sv = subVal[si + sx2 * (sj + sy2 * sk)]
    if (sv === sv) return sv < 0
    return blockVal[Math.min(bx - 1, i >> 2) + bx * (Math.min(by - 1, j >> 2) + by * Math.min(bz - 1, k >> 2))] < 0
  }
  const cx = nx - 1, cy = ny - 1
  const cellVert = new Map<number, number>()
  const pos: number[] = []
  const corner = new Float64Array(8)
  const o1 = 1, o2 = nx, o4 = nx * ny
  const coff = [0, o1, o2, o1 + o2, o4, o1 + o4, o2 + o4, o1 + o2 + o4]
  const EA = [0, 2, 4, 6, 0, 1, 4, 5, 0, 1, 2, 3]
  const EB = [1, 3, 5, 7, 2, 3, 6, 7, 4, 5, 6, 7]
  for (let b = 0; b < subs.length; b += 3) {
    const i0 = subs[b] * 2, j0 = subs[b + 1] * 2, k0 = subs[b + 2] * 2
    for (let k = k0; k < k0 + 2; k++)
      for (let j = j0; j < j0 + 2; j++)
        for (let i = i0; i < i0 + 2; i++) {
          const base = i + nx * (j + ny * k)
          let mask = 0
          for (let c = 0; c < 8; c++) {
            const v = vals[base + coff[c]]
            corner[c] = v
            if (v < 0) mask |= 1 << c
          }
          if (mask === 0 || mask === 255) continue
          let sx = 0, sy = 0, sz = 0, cnt = 0
          for (let e = 0; e < 12; e++) {
            const a = EA[e], bb = EB[e]
            const va = corner[a], vb = corner[bb]
            if (va < 0 === vb < 0) continue
            const t = va / (va - vb)
            const ax = a & 1, ay = (a >> 1) & 1, az = (a >> 2) & 1
            sx += ax + ((bb & 1) - ax) * t
            sy += ay + (((bb >> 1) & 1) - ay) * t
            sz += az + (((bb >> 2) & 1) - az) * t
            cnt++
          }
          cellVert.set(i + cx * (j + cy * k), pos.length / 3)
          pos.push(min[0] + (i + sx / cnt) * h, min[1] + (j + sy / cnt) * h, min[2] + (k + sz / cnt) * h)
        }
  }
  const idx: number[] = []
  const cell = (i: number, j: number, k: number) => {
    const v = cellVert.get(i + cx * (j + cy * k))
    return v === undefined ? -1 : v
  }
  const quad = (a: number, b: number, c: number, d: number, flip: boolean) => {
    if (a < 0 || b < 0 || c < 0 || d < 0) return
    if (flip) {
      const t = b
      b = d
      d = t
    }
    if (dist2(pos, a, c) < dist2(pos, b, d)) idx.push(a, b, c, a, c, d)
    else idx.push(a, b, d, b, c, d)
  }
  for (let b = 0; b < subs.length; b += 3) {
    const i0 = subs[b] * 2, j0 = subs[b + 1] * 2, k0 = subs[b + 2] * 2
    for (let k = k0; k < k0 + 2; k++)
      for (let j = j0; j < j0 + 2; j++)
        for (let i = i0; i < i0 + 2; i++) {
          const in0 = vals[i + nx * (j + ny * k)] < 0
          if (j >= 1 && k >= 1 && in0 !== signAt(i + 1, j, k)) quad(cell(i, j - 1, k - 1), cell(i, j, k - 1), cell(i, j, k), cell(i, j - 1, k), !in0)
          if (i >= 1 && k >= 1 && in0 !== signAt(i, j + 1, k)) quad(cell(i - 1, j, k - 1), cell(i - 1, j, k), cell(i, j, k), cell(i, j, k - 1), !in0)
          if (i >= 1 && j >= 1 && in0 !== signAt(i, j, k + 1)) quad(cell(i - 1, j - 1, k), cell(i, j - 1, k), cell(i, j, k), cell(i - 1, j, k), !in0)
        }
  }
  const positions = new Float32Array(pos)
  const normals = new Float32Array(positions.length)
  const g: V3 = [0, 0, 0]
  const eps = h * 0.35
  for (let v = 0; v < positions.length; v += 3) {
    let x = positions[v], y = positions[v + 1], z = positions[v + 2]
    const d = tetraGradient(f, x, y, z, eps, g)
    const gl2 = g[0] * g[0] + g[1] * g[1] + g[2] * g[2]
    if (project && gl2 > 1e-12) {
      const sc = d / gl2
      let stx = g[0] * sc, sty = g[1] * sc, stz = g[2] * sc
      const sl = Math.hypot(stx, sty, stz)
      const lim = h * 0.6
      if (sl > lim) {
        stx *= lim / sl
        sty *= lim / sl
        stz *= lim / sl
      }
      x -= stx
      y -= sty
      z -= stz
      positions[v] = x
      positions[v + 1] = y
      positions[v + 2] = z
    }
    const l = Math.sqrt(gl2) || 1
    normals[v] = g[0] / l
    normals[v + 1] = g[1] / l
    normals[v + 2] = g[2] / l
  }
  return { positions, normals, indices: new Uint32Array(idx) }
}

/** Gradient via a 4-sample tetrahedron; returns the field value estimate at the centre. */
export function tetraGradient(f: SdfField, x: number, y: number, z: number, e: number, out: V3) {
  const a = f.eval(x + e, y - e, z - e)
  const b = f.eval(x - e, y - e, z + e)
  const c = f.eval(x - e, y + e, z - e)
  const d = f.eval(x + e, y + e, z + e)
  const k = 1 / (4 * e)
  out[0] = (a - b - c + d) * k
  out[1] = (-a - b + c + d) * k
  out[2] = (-a + b - c + d) * k
  return (a + b + c + d) * 0.25
}

function dist2(p: number[], a: number, b: number) {
  const dx = p[a * 3] - p[b * 3], dy = p[a * 3 + 1] - p[b * 3 + 1], dz = p[a * 3 + 2] - p[b * 3 + 2]
  return dx * dx + dy * dy + dz * dz
}

export interface ClippedMesh extends MeshData {
  /** keep-function value per vertex (0 on the cut boundary, grows inward) */
  edge: Float32Array
}

/**
 * Clips triangles against keep(p) >= 0, splitting boundary triangles so cut edges are clean.
 * Returns the per-vertex keep value, which doubles as a distance-to-edge for trims.
 */
export function clipMesh(mesh: MeshData, keep: (x: number, y: number, z: number) => number): ClippedMesh {
  const P = mesh.positions
  const N = mesh.normals
  const vc = P.length / 3
  const kv = new Float32Array(vc)
  for (let i = 0; i < vc; i++) kv[i] = keep(P[i * 3], P[i * 3 + 1], P[i * 3 + 2])
  const outP: number[] = []
  const outN: number[] = []
  const outE: number[] = []
  const remap = new Int32Array(vc).fill(-1)
  const edgeMap = new Map<number, number>()
  const useVert = (i: number) => {
    if (remap[i] >= 0) return remap[i]
    remap[i] = outP.length / 3
    outP.push(P[i * 3], P[i * 3 + 1], P[i * 3 + 2])
    outN.push(N[i * 3], N[i * 3 + 1], N[i * 3 + 2])
    outE.push(Math.max(0, kv[i]))
    return remap[i]
  }
  const edgeVert = (a: number, b: number) => {
    const key = a < b ? a * vc + b : b * vc + a
    const hit = edgeMap.get(key)
    if (hit !== undefined) return hit
    const t = kv[a] / (kv[a] - kv[b])
    const id = outP.length / 3
    for (let c = 0; c < 3; c++) outP.push(P[a * 3 + c] + (P[b * 3 + c] - P[a * 3 + c]) * t)
    let nx = N[a * 3] + (N[b * 3] - N[a * 3]) * t
    let ny = N[a * 3 + 1] + (N[b * 3 + 1] - N[a * 3 + 1]) * t
    let nz = N[a * 3 + 2] + (N[b * 3 + 2] - N[a * 3 + 2]) * t
    const l = Math.hypot(nx, ny, nz) || 1
    nx /= l
    ny /= l
    nz /= l
    outN.push(nx, ny, nz)
    outE.push(0)
    edgeMap.set(key, id)
    return id
  }
  const outI: number[] = []
  const I = mesh.indices
  const poly: number[] = []
  for (let t = 0; t < I.length; t += 3) {
    const a = I[t], b = I[t + 1], c = I[t + 2]
    const ia = kv[a] >= 0, ib = kv[b] >= 0, ic = kv[c] >= 0
    if (ia && ib && ic) {
      outI.push(useVert(a), useVert(b), useVert(c))
      continue
    }
    if (!ia && !ib && !ic) continue
    poly.length = 0
    const tri = [a, b, c]
    for (let e = 0; e < 3; e++) {
      const p = tri[e]
      const q = tri[(e + 1) % 3]
      const ip = kv[p] >= 0
      const iq = kv[q] >= 0
      if (ip) poly.push(useVert(p))
      if (ip !== iq) poly.push(edgeVert(p, q))
    }
    for (let k = 1; k + 1 < poly.length; k++) outI.push(poly[0], poly[k], poly[k + 1])
  }
  return { positions: new Float32Array(outP), normals: new Float32Array(outN), indices: new Uint32Array(outI), edge: new Float32Array(outE) }
}

/** Removes triangles for which `drop` holds at all three corners, then compacts the vertex arrays. */
export function cullTriangles<T extends MeshData>(mesh: T, drop: (x: number, y: number, z: number) => boolean, extra: Float32Array[] = []): { mesh: MeshData; extra: Float32Array[] } {
  const P = mesh.positions
  const vc = P.length / 3
  const dropV = new Uint8Array(vc)
  for (let i = 0; i < vc; i++) dropV[i] = drop(P[i * 3], P[i * 3 + 1], P[i * 3 + 2]) ? 1 : 0
  const I = mesh.indices
  const keepI: number[] = []
  for (let t = 0; t < I.length; t += 3) {
    if (dropV[I[t]] && dropV[I[t + 1]] && dropV[I[t + 2]]) continue
    keepI.push(I[t], I[t + 1], I[t + 2])
  }
  return compact({ positions: mesh.positions, normals: mesh.normals, indices: new Uint32Array(keepI) }, extra)
}

export function compact(mesh: MeshData, extra: Float32Array[] = []): { mesh: MeshData; extra: Float32Array[] } {
  const vc = mesh.positions.length / 3
  const remap = new Int32Array(vc).fill(-1)
  let n = 0
  for (let i = 0; i < mesh.indices.length; i++) {
    const v = mesh.indices[i]
    if (remap[v] < 0) remap[v] = n++
  }
  const P = new Float32Array(n * 3)
  const N = new Float32Array(n * 3)
  const ex = extra.map((e) => new Float32Array((e.length / vc) * n))
  for (let v = 0; v < vc; v++) {
    const r = remap[v]
    if (r < 0) continue
    for (let c = 0; c < 3; c++) {
      P[r * 3 + c] = mesh.positions[v * 3 + c]
      N[r * 3 + c] = mesh.normals[v * 3 + c]
    }
    extra.forEach((e, k) => {
      const s = e.length / vc
      for (let c = 0; c < s; c++) ex[k][r * s + c] = e[v * s + c]
    })
  }
  const I = new Uint32Array(mesh.indices.length)
  for (let i = 0; i < I.length; i++) I[i] = remap[mesh.indices[i]]
  return { mesh: { positions: P, normals: N, indices: I }, extra: ex }
}

/** Classic distance-field ambient occlusion sampled along each vertex normal. */
export function fieldAO(mesh: MeshData, f: SdfField, step: number, strength = 1, samples = 5): Float32Array {
  const P = mesh.positions
  const N = mesh.normals
  const vc = P.length / 3
  const ao = new Float32Array(vc)
  for (let v = 0; v < vc; v++) {
    const x = P[v * 3], y = P[v * 3 + 1], z = P[v * 3 + 2]
    const nx = N[v * 3], ny = N[v * 3 + 1], nz = N[v * 3 + 2]
    let occ = 0
    let w = 1
    for (let s = 1; s <= samples; s++) {
      const d = s * step
      const sd = f.eval(x + nx * d, y + ny * d, z + nz * d)
      occ += (w * Math.max(0, d - sd)) / d
      w *= 0.62
    }
    ao[v] = Math.max(0, Math.min(1, 1 - strength * occ * 0.55))
  }
  return ao
}

/**
 * Quadric edge-collapse simplification (Garland-Heckbert) down to about `target` triangles: flat regions
 * collapse into large triangles while creases, rims and holes keep their density. Vertices on open
 * boundaries (and non-manifold edges) stay put so clipped edges still meet what they were clipped against.
 * Collapses that fold or flip a triangle or break the link condition are skipped. Normals are passed
 * through from the surviving vertices; callers usually recompute them from the field gradient.
 */
export function simplify(mesh: MeshData, target: number): MeshData {
  const vc = mesh.positions.length / 3
  const P = Float64Array.from(mesh.positions)
  const I = Int32Array.from(mesh.indices)
  const tc = I.length / 3
  if (tc <= target) return mesh
  const Q = new Float64Array(vc * 10)
  const tAlive = new Uint8Array(tc).fill(1)
  const vAlive = new Uint8Array(vc).fill(1)
  const locked = new Uint8Array(vc)
  const ver = new Uint32Array(vc)
  const vt: number[][] = Array.from({ length: vc }, () => [])
  // every directed edge as a sortable key; runs of equal keys count the faces on an edge
  const keys = new Float64Array(tc * 3)
  const ek = (a: number, b: number) => (a < b ? a * vc + b : b * vc + a)
  for (let t = 0; t < tc; t++) {
    const a = I[t * 3], b = I[t * 3 + 1], c = I[t * 3 + 2]
    vt[a].push(t)
    vt[b].push(t)
    vt[c].push(t)
    keys[t * 3] = ek(a, b)
    keys[t * 3 + 1] = ek(b, c)
    keys[t * 3 + 2] = ek(c, a)
    const ux = P[b * 3] - P[a * 3], uy = P[b * 3 + 1] - P[a * 3 + 1], uz = P[b * 3 + 2] - P[a * 3 + 2]
    const wx = P[c * 3] - P[a * 3], wy = P[c * 3 + 1] - P[a * 3 + 1], wz = P[c * 3 + 2] - P[a * 3 + 2]
    let nx = uy * wz - uz * wy, ny = uz * wx - ux * wz, nz = ux * wy - uy * wx
    const len = Math.sqrt(nx * nx + ny * ny + nz * nz)
    if (len < 1e-14) continue
    const w = len * 0.5
    nx /= len
    ny /= len
    nz /= len
    const d = -(nx * P[a * 3] + ny * P[a * 3 + 1] + nz * P[a * 3 + 2])
    for (let j = 0; j < 3; j++) {
      const o = I[t * 3 + j] * 10
      Q[o] += w * nx * nx
      Q[o + 1] += w * nx * ny
      Q[o + 2] += w * nx * nz
      Q[o + 3] += w * nx * d
      Q[o + 4] += w * ny * ny
      Q[o + 5] += w * ny * nz
      Q[o + 6] += w * ny * d
      Q[o + 7] += w * nz * nz
      Q[o + 8] += w * nz * d
      Q[o + 9] += w * d * d
    }
  }
  keys.sort()
  const edges: number[] = []
  for (let i = 0; i < keys.length; ) {
    let j = i + 1
    while (j < keys.length && keys[j] === keys[i]) j++
    const key = keys[i]
    edges.push(key)
    if (j - i !== 2) {
      locked[Math.floor(key / vc)] = 1
      locked[key % vc] = 1
    }
    i = j
  }
  const err = (o: number, o2: number, x: number, y: number, z: number) =>
    (Q[o] + Q[o2]) * x * x + 2 * (Q[o + 1] + Q[o2 + 1]) * x * y + 2 * (Q[o + 2] + Q[o2 + 2]) * x * z + 2 * (Q[o + 3] + Q[o2 + 3]) * x +
    (Q[o + 4] + Q[o2 + 4]) * y * y + 2 * (Q[o + 5] + Q[o2 + 5]) * y * z + 2 * (Q[o + 6] + Q[o2 + 6]) * y +
    (Q[o + 7] + Q[o2 + 7]) * z * z + 2 * (Q[o + 8] + Q[o2 + 8]) * z + (Q[o + 9] + Q[o2 + 9])
  // min-heap of candidate collapses: remove `hu`, keep `hk` at (hx, hy, hz)
  let hn = 0
  let cap = edges.length * 2 + 16
  let hc = new Float64Array(cap), hu = new Int32Array(cap), hk = new Int32Array(cap)
  let hvu = new Uint32Array(cap), hvk = new Uint32Array(cap), hp = new Float64Array(cap * 3)
  const heap: number[] = []
  const free: number[] = []
  const grow = () => {
    const n = cap * 2
    const c2 = new Float64Array(n); c2.set(hc); hc = c2
    const u2 = new Int32Array(n); u2.set(hu); hu = u2
    const k2 = new Int32Array(n); k2.set(hk); hk = k2
    const a2 = new Uint32Array(n); a2.set(hvu); hvu = a2
    const b2 = new Uint32Array(n); b2.set(hvk); hvk = b2
    const p2 = new Float64Array(n * 3); p2.set(hp); hp = p2
    cap = n
  }
  const push = (a: number, b: number) => {
    if (locked[a] && locked[b]) return
    let u = a, k = b, x: number, y: number, z: number, c: number
    const oa = a * 10, ob = b * 10
    if (locked[a]) {
      u = b; k = a
      x = P[a * 3]; y = P[a * 3 + 1]; z = P[a * 3 + 2]
      c = err(oa, ob, x, y, z)
    } else if (locked[b]) {
      x = P[b * 3]; y = P[b * 3 + 1]; z = P[b * 3 + 2]
      c = err(oa, ob, x, y, z)
    } else {
      const mx = (P[a * 3] + P[b * 3]) * 0.5, my = (P[a * 3 + 1] + P[b * 3 + 1]) * 0.5, mz = (P[a * 3 + 2] + P[b * 3 + 2]) * 0.5
      const ca = err(oa, ob, P[a * 3], P[a * 3 + 1], P[a * 3 + 2])
      const cb = err(oa, ob, P[b * 3], P[b * 3 + 1], P[b * 3 + 2])
      const cm = err(oa, ob, mx, my, mz)
      if (cm <= ca && cm <= cb) { x = mx; y = my; z = mz; c = cm }
      else if (ca <= cb) { u = b; k = a; x = P[a * 3]; y = P[a * 3 + 1]; z = P[a * 3 + 2]; c = ca }
      else { x = P[b * 3]; y = P[b * 3 + 1]; z = P[b * 3 + 2]; c = cb }
    }
    // a small length term keeps flat regions from collapsing into slivers
    const dx = P[a * 3] - P[b * 3], dy = P[a * 3 + 1] - P[b * 3 + 1], dz = P[a * 3 + 2] - P[b * 3 + 2]
    c += (dx * dx + dy * dy + dz * dz) * 1e-6
    // every slot is either queued or free, so with none free the next new slot is `hn`
    let e = free.pop()
    if (e === undefined) {
      e = hn
      if (e >= cap) grow()
    }
    hc[e] = c; hu[e] = u; hk[e] = k; hvu[e] = ver[u]; hvk[e] = ver[k]
    hp[e * 3] = x; hp[e * 3 + 1] = y; hp[e * 3 + 2] = z
    // sift up
    let i = hn++
    heap[i] = e
    while (i > 0) {
      const pi = (i - 1) >> 1
      if (hc[heap[pi]] <= c) break
      heap[i] = heap[pi]
      i = pi
    }
    heap[i] = e
  }
  const pop = () => {
    const top = heap[0]
    const last = heap[--hn]
    let i = 0
    const c = hc[last]
    for (;;) {
      const l = i * 2 + 1
      if (l >= hn) break
      const r = l + 1
      const m = r < hn && hc[heap[r]] < hc[heap[l]] ? r : l
      if (hc[heap[m]] >= c) break
      heap[i] = heap[m]
      i = m
    }
    heap[i] = last
    heap.length = hn
    return top
  }
  for (const key of edges) push(Math.floor(key / vc), key % vc)
  let alive = tc
  // neighbourhood marks: mark[v] === stamp means v neighbours the removed vertex
  const mark = new Uint32Array(vc)
  let stamp = 0
  const triNormal = (a: number, b: number, c: number, out: number[], pa?: number, px = 0, py = 0, pz = 0) => {
    const ax = a === pa ? px : P[a * 3], ay = a === pa ? py : P[a * 3 + 1], az = a === pa ? pz : P[a * 3 + 2]
    const bx = b === pa ? px : P[b * 3], by = b === pa ? py : P[b * 3 + 1], bz = b === pa ? pz : P[b * 3 + 2]
    const cx = c === pa ? px : P[c * 3], cy = c === pa ? py : P[c * 3 + 1], cz = c === pa ? pz : P[c * 3 + 2]
    const ux = bx - ax, uy = by - ay, uz = bz - az, wx = cx - ax, wy = cy - ay, wz = cz - az
    out[0] = uy * wz - uz * wy
    out[1] = uz * wx - ux * wz
    out[2] = ux * wy - uy * wx
  }
  const n0 = [0, 0, 0], n1 = [0, 0, 0]
  // would moving vertex v (in its triangles that do not contain `skip`) to p fold or degenerate them?
  const folds = (v: number, skip: number, x: number, y: number, z: number) => {
    for (const t of vt[v]) {
      if (!tAlive[t]) continue
      const a = I[t * 3], b = I[t * 3 + 1], c = I[t * 3 + 2]
      if (a === skip || b === skip || c === skip) continue
      triNormal(a, b, c, n0)
      triNormal(a, b, c, n1, v, x, y, z)
      const l0 = Math.sqrt(n0[0] * n0[0] + n0[1] * n0[1] + n0[2] * n0[2]), l1 = Math.sqrt(n1[0] * n1[0] + n1[1] * n1[1] + n1[2] * n1[2])
      if (l1 < l0 * 0.02 || n0[0] * n1[0] + n0[1] * n1[1] + n0[2] * n1[2] < 0.3 * l0 * l1) return true
    }
    return false
  }
  while (alive > target && hn > 0) {
    const e = pop()
    free.push(e)
    const u = hu[e], k = hk[e]
    if (!vAlive[u] || !vAlive[k] || hvu[e] !== ver[u] || hvk[e] !== ver[k]) continue
    const x = hp[e * 3], y = hp[e * 3 + 1], z = hp[e * 3 + 2]
    // link condition: exactly the two opposite vertices are shared
    stamp++
    for (const t of vt[u]) if (tAlive[t]) for (let j = 0; j < 3; j++) mark[I[t * 3 + j]] = stamp
    mark[u] = 0
    mark[k] = 0
    let shared = 0
    stamp++
    const hit = stamp
    for (const t of vt[k])
      if (tAlive[t])
        for (let j = 0; j < 3; j++) {
          const v = I[t * 3 + j]
          if (mark[v] === hit - 1) {
            shared++
            mark[v] = hit
          }
        }
    if (shared !== 2) continue
    if (folds(u, k, x, y, z) || folds(k, u, x, y, z)) continue
    for (const t of vt[u]) {
      if (!tAlive[t]) continue
      const o = t * 3
      if (I[o] === k || I[o + 1] === k || I[o + 2] === k) {
        tAlive[t] = 0
        alive--
        continue
      }
      for (let j = 0; j < 3; j++) if (I[o + j] === u) I[o + j] = k
      vt[k].push(t)
    }
    vAlive[u] = 0
    vt[u] = []
    const lk = vt[k]
    let w = 0
    for (let i = 0; i < lk.length; i++) if (tAlive[lk[i]]) lk[w++] = lk[i]
    lk.length = w
    P[k * 3] = x
    P[k * 3 + 1] = y
    P[k * 3 + 2] = z
    for (let j = 0; j < 10; j++) Q[k * 10 + j] += Q[u * 10 + j]
    ver[k]++
    stamp++
    mark[k] = stamp
    for (const t of lk)
      for (let j = 0; j < 3; j++) {
        const v = I[t * 3 + j]
        if (mark[v] !== stamp) {
          mark[v] = stamp
          push(k, v)
        }
      }
  }
  const remap = new Int32Array(vc).fill(-1)
  let nv = 0
  for (let t = 0; t < tc; t++) if (tAlive[t]) for (let j = 0; j < 3; j++) { const v = I[t * 3 + j]; if (remap[v] < 0) remap[v] = nv++ }
  const outP = new Float32Array(nv * 3)
  const outN = new Float32Array(nv * 3)
  for (let v = 0; v < vc; v++) {
    const r = remap[v]
    if (r < 0) continue
    outP[r * 3] = P[v * 3]; outP[r * 3 + 1] = P[v * 3 + 1]; outP[r * 3 + 2] = P[v * 3 + 2]
    outN[r * 3] = mesh.normals[v * 3]; outN[r * 3 + 1] = mesh.normals[v * 3 + 1]; outN[r * 3 + 2] = mesh.normals[v * 3 + 2]
  }
  const outI = new Uint32Array(alive * 3)
  let oi = 0
  for (let t = 0; t < tc; t++) if (tAlive[t]) for (let j = 0; j < 3; j++) outI[oi++] = remap[I[t * 3 + j]]
  return { positions: outP, normals: outN, indices: outI }
}
