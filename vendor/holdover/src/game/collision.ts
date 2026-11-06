// Static collision primitives used by bullets, line-of-sight checks, and AI movement.

export type Surface =
  | 'concrete'
  | 'metal'
  | 'wood'
  | 'dirt'
  | 'sand'
  | 'foliage'
  | 'glass'
  | 'fabric'

export interface BoxCollider {
  kind: 'box'
  cx: number
  cy: number
  cz: number
  hx: number
  hy: number
  hz: number
  cos: number
  sin: number
  surface: Surface
  /** Thin cover such as foliage or fabric that bullets pass through. */
  soft?: boolean
}

export interface CylinderCollider {
  kind: 'cyl'
  cx: number
  cz: number
  y0: number
  y1: number
  r: number
  surface: Surface
  soft?: boolean
}

export type Collider = BoxCollider | CylinderCollider

export interface RayHit {
  t: number
  nx: number
  ny: number
  nz: number
  surface: Surface
  collider: Collider
}

export function box(
  cx: number,
  cy: number,
  cz: number,
  sx: number,
  sy: number,
  sz: number,
  surface: Surface,
  rotation = 0,
  soft = false,
): BoxCollider {
  return {
    kind: 'box',
    cx,
    cy,
    cz,
    hx: sx / 2,
    hy: sy / 2,
    hz: sz / 2,
    cos: Math.cos(rotation),
    sin: Math.sin(rotation),
    surface,
    soft,
  }
}

export function cylinder(
  cx: number,
  cz: number,
  y0: number,
  y1: number,
  r: number,
  surface: Surface,
  soft = false,
): CylinderCollider {
  return { kind: 'cyl', cx, cz, y0, y1, r, surface, soft }
}

/** Slab test in the box's local frame. Rotation is about +Y, matching Object3D.rotation.y. */
export function intersectBox(
  ox: number,
  oy: number,
  oz: number,
  dx: number,
  dy: number,
  dz: number,
  maxT: number,
  collider: BoxCollider,
): RayHit | null {
  const { cos, sin } = collider
  const px = ox - collider.cx
  const pz = oz - collider.cz
  // Inverse yaw rotation into local space.
  const lx = cos * px - sin * pz
  const lz = sin * px + cos * pz
  const ly = oy - collider.cy
  const ldx = cos * dx - sin * dz
  const ldz = sin * dx + cos * dz
  const ldy = dy
  let tMin = 0
  let tMax = maxT
  let axis = -1
  let sign = 0
  const origins = [lx, ly, lz]
  const directions = [ldx, ldy, ldz]
  const halves = [collider.hx, collider.hy, collider.hz]
  for (let i = 0; i < 3; i += 1) {
    const origin = origins[i]
    const direction = directions[i]
    const half = halves[i]
    if (Math.abs(direction) < 1e-9) {
      if (origin < -half || origin > half) return null
      continue
    }
    const inverse = 1 / direction
    let t0 = (-half - origin) * inverse
    let t1 = (half - origin) * inverse
    let entrySign = -1
    if (t0 > t1) {
      const swap = t0
      t0 = t1
      t1 = swap
      entrySign = 1
    }
    if (t0 > tMin) {
      tMin = t0
      axis = i
      sign = entrySign
    }
    if (t1 < tMax) tMax = t1
    if (tMin > tMax) return null
  }
  if (axis < 0) {
    // Origin starts inside the box.
    return { t: 0, nx: -dx, ny: -dy, nz: -dz, surface: collider.surface, collider }
  }
  let nlx = 0
  let nly = 0
  let nlz = 0
  if (axis === 0) nlx = sign
  else if (axis === 1) nly = sign
  else nlz = sign
  // Rotate the local normal back to world space.
  return {
    t: tMin,
    nx: cos * nlx + sin * nlz,
    ny: nly,
    nz: -sin * nlx + cos * nlz,
    surface: collider.surface,
    collider,
  }
}

export function intersectCylinder(
  ox: number,
  oy: number,
  oz: number,
  dx: number,
  dy: number,
  dz: number,
  maxT: number,
  collider: CylinderCollider,
): RayHit | null {
  const px = ox - collider.cx
  const pz = oz - collider.cz
  const a = dx * dx + dz * dz
  const b = 2 * (px * dx + pz * dz)
  const c = px * px + pz * pz - collider.r * collider.r
  let best = Infinity
  let nx = 0
  let ny = 0
  let nz = 0
  if (a > 1e-12) {
    const discriminant = b * b - 4 * a * c
    if (discriminant >= 0) {
      const t = (-b - Math.sqrt(discriminant)) / (2 * a)
      if (t >= 0 && t <= maxT) {
        const y = oy + dy * t
        if (y >= collider.y0 && y <= collider.y1) {
          best = t
          nx = (px + dx * t) / collider.r
          nz = (pz + dz * t) / collider.r
        }
      }
    }
  }
  if (Math.abs(dy) > 1e-9) {
    for (const capY of [collider.y1, collider.y0]) {
      const t = (capY - oy) / dy
      if (t < 0 || t > maxT || t >= best) continue
      const hx = px + dx * t
      const hz = pz + dz * t
      if (hx * hx + hz * hz <= collider.r * collider.r) {
        best = t
        nx = 0
        ny = capY === collider.y1 ? 1 : -1
        nz = 0
      }
    }
  }
  if (best === Infinity) {
    if (c <= 0 && oy >= collider.y0 && oy <= collider.y1) {
      return { t: 0, nx: -dx, ny: -dy, nz: -dz, surface: collider.surface, collider }
    }
    return null
  }
  return { t: best, nx, ny, nz, surface: collider.surface, collider }
}

export function intersectCollider(
  ox: number,
  oy: number,
  oz: number,
  dx: number,
  dy: number,
  dz: number,
  maxT: number,
  collider: Collider,
): RayHit | null {
  return collider.kind === 'box'
    ? intersectBox(ox, oy, oz, dx, dy, dz, maxT, collider)
    : intersectCylinder(ox, oy, oz, dx, dy, dz, maxT, collider)
}

interface Group {
  colliders: Collider[]
  minX: number
  minY: number
  minZ: number
  maxX: number
  maxY: number
  maxZ: number
}

function bounds(collider: Collider): [number, number, number, number, number, number] {
  if (collider.kind === 'cyl') {
    return [
      collider.cx - collider.r,
      collider.y0,
      collider.cz - collider.r,
      collider.cx + collider.r,
      collider.y1,
      collider.cz + collider.r,
    ]
  }
  const ex = Math.abs(collider.cos) * collider.hx + Math.abs(collider.sin) * collider.hz
  const ez = Math.abs(collider.sin) * collider.hx + Math.abs(collider.cos) * collider.hz
  return [
    collider.cx - ex,
    collider.cy - collider.hy,
    collider.cz - ez,
    collider.cx + ex,
    collider.cy + collider.hy,
    collider.cz + ez,
  ]
}

function rayHitsBounds(
  ox: number,
  oy: number,
  oz: number,
  dx: number,
  dy: number,
  dz: number,
  maxT: number,
  group: Group,
): boolean {
  let tMin = 0
  let tMax = maxT
  const origins = [ox, oy, oz]
  const directions = [dx, dy, dz]
  const mins = [group.minX, group.minY, group.minZ]
  const maxs = [group.maxX, group.maxY, group.maxZ]
  for (let i = 0; i < 3; i += 1) {
    if (Math.abs(directions[i]) < 1e-9) {
      if (origins[i] < mins[i] || origins[i] > maxs[i]) return false
      continue
    }
    let t0 = (mins[i] - origins[i]) / directions[i]
    let t1 = (maxs[i] - origins[i]) / directions[i]
    if (t0 > t1) {
      const swap = t0
      t0 = t1
      t1 = swap
    }
    tMin = Math.max(tMin, t0)
    tMax = Math.min(tMax, t1)
    if (tMin > tMax) return false
  }
  return true
}

/** Grouped static colliders. Groups are coarse clusters (one per site) for cheap rejection. */
export class CollisionWorld {
  private groups = new Map<string, Group>()
  count = 0

  add(collider: Collider, groupName = 'default'): Collider {
    let group = this.groups.get(groupName)
    if (!group) {
      group = {
        colliders: [],
        minX: Infinity,
        minY: Infinity,
        minZ: Infinity,
        maxX: -Infinity,
        maxY: -Infinity,
        maxZ: -Infinity,
      }
      this.groups.set(groupName, group)
    }
    const [minX, minY, minZ, maxX, maxY, maxZ] = bounds(collider)
    group.minX = Math.min(group.minX, minX)
    group.minY = Math.min(group.minY, minY)
    group.minZ = Math.min(group.minZ, minZ)
    group.maxX = Math.max(group.maxX, maxX)
    group.maxY = Math.max(group.maxY, maxY)
    group.maxZ = Math.max(group.maxZ, maxZ)
    group.colliders.push(collider)
    this.count += 1
    return collider
  }

  /** Nearest hit along a normalized direction. Soft colliders are skipped unless requested. */
  raycast(
    ox: number,
    oy: number,
    oz: number,
    dx: number,
    dy: number,
    dz: number,
    maxT: number,
    includeSoft = false,
  ): RayHit | null {
    let best: RayHit | null = null
    let limit = maxT
    for (const group of this.groups.values()) {
      if (!rayHitsBounds(ox, oy, oz, dx, dy, dz, limit, group)) continue
      for (const collider of group.colliders) {
        if (collider.soft && !includeSoft) continue
        const hit = intersectCollider(ox, oy, oz, dx, dy, dz, limit, collider)
        if (hit && (!best || hit.t < best.t)) {
          best = hit
          limit = hit.t
        }
      }
    }
    return best
  }

  /** True when the straight segment between two points is blocked by hard geometry. */
  blocked(ax: number, ay: number, az: number, bx: number, by: number, bz: number): boolean {
    const dx = bx - ax
    const dy = by - ay
    const dz = bz - az
    const length = Math.hypot(dx, dy, dz)
    if (length < 1e-6) return false
    return this.raycast(ax, ay, az, dx / length, dy / length, dz / length, length) !== null
  }
}

export interface CapsuleHit {
  t: number
  distance: number
}

/**
 * Closest approach between a ray segment [o, o + d * maxT] and a capsule
 * segment [a, b]. Returns the ray parameter when within `radius`.
 */
export function intersectCapsule(
  ox: number,
  oy: number,
  oz: number,
  dx: number,
  dy: number,
  dz: number,
  maxT: number,
  ax: number,
  ay: number,
  az: number,
  bx: number,
  by: number,
  bz: number,
  radius: number,
): CapsuleHit | null {
  const ux = dx * maxT
  const uy = dy * maxT
  const uz = dz * maxT
  const vx = bx - ax
  const vy = by - ay
  const vz = bz - az
  const wx = ox - ax
  const wy = oy - ay
  const wz = oz - az
  const a = ux * ux + uy * uy + uz * uz
  const b = ux * vx + uy * vy + uz * vz
  const c = vx * vx + vy * vy + vz * vz
  const d = ux * wx + uy * wy + uz * wz
  const e = vx * wx + vy * wy + vz * wz
  const denominator = a * c - b * b
  // Degenerate (sphere) or parallel case: project the capsule start onto the ray.
  let s = denominator > 1e-9 * Math.max(1, a * c) ? (b * e - c * d) / denominator : a > 1e-12 ? -d / a : 0
  s = Math.min(1, Math.max(0, s))
  let t = c > 1e-12 ? (b * s + e) / c : 0
  if (t < 0 || t > 1) {
    t = Math.min(1, Math.max(0, t))
    s = a > 1e-12 ? Math.min(1, Math.max(0, (b * t - d) / a)) : 0
  }
  const px = ox + ux * s - (ax + vx * t)
  const py = oy + uy * s - (ay + vy * t)
  const pz = oz + uz * s - (az + vz * t)
  const distance = Math.sqrt(px * px + py * py + pz * pz)
  if (distance > radius) return null
  // Step back from the closest approach to the capsule surface.
  const penetration = Math.sqrt(Math.max(0, radius * radius - distance * distance))
  const along = s * maxT - penetration
  return { t: Math.max(0, Math.min(maxT, along)), distance }
}
