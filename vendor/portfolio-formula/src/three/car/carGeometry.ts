import * as THREE from "three"
import { LoftGeometry } from "three/addons/geometries/LoftGeometry.js"
import { DecalGeometry } from "three/addons/geometries/DecalGeometry.js"
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js"

/**
 * Procedural 2022+-era Formula 1 car.
 *
 * Local frame: X = right, Y = up, Z = forward (nose points to +Z), metres,
 * ground at y = 0, origin at the centre of the wheelbase. The geometry is built
 * once and shared by every car on the grid; liveries only swap materials.
 */

export type CarPartKey = "paint" | "paint2" | "carbon" | "dark" | "rubber" | "stripe" | "rim" | "visor" | "glow"

export const CAR_PART_KEYS: CarPartKey[] = [
  "paint",
  "paint2",
  "carbon",
  "dark",
  "rubber",
  "stripe",
  "rim",
  "visor",
  "glow",
]

export type CarDecalKey = "sidepodL" | "sidepodR" | "nose" | "finL" | "finR" | "wingL" | "wingR"

export type CarGeometry = {
  parts: Record<CarPartKey, THREE.BufferGeometry>
  decals: Record<CarDecalKey, {
    geometry: THREE.BufferGeometry
    texture: "name" | "number"
  }>
}

const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z)

// ---------------------------------------------------------------------------
// Interpolation helpers
// ---------------------------------------------------------------------------

/** Monotone cubic (PCHIP) interpolation — smooth without overshooting key values. */
export function pchip(xs: number[], ys: number[]) {
  const n = xs.length
  const h: number[] = []
  const d: number[] = []
  for (let i = 0; i < n - 1; i++) {
    h[i] = xs[i + 1] - xs[i]
    d[i] = (ys[i + 1] - ys[i]) / h[i]
  }
  const m: number[] = new Array(n).fill(0)
  m[0] = d[0]
  m[n - 1] = d[n - 2]
  for (let i = 1; i < n - 1; i++) {
    if (d[i - 1] * d[i] <= 0) m[i] = 0
    else {
      const w1 = 2 * h[i] + h[i - 1]
      const w2 = h[i] + 2 * h[i - 1]
      m[i] = (w1 + w2) / (w1 / d[i - 1] + w2 / d[i])
    }
  }
  return (x: number) => {
    if (x <= xs[0]) return ys[0]
    if (x >= xs[n - 1]) return ys[n - 1]
    let i = 0
    while (i < n - 2 && x > xs[i + 1]) i++
    const t = (x - xs[i]) / h[i]
    const t2 = t * t
    const t3 = t2 * t
    return (
      (2 * t3 - 3 * t2 + 1) * ys[i] +
      (t3 - 2 * t2 + t) * h[i] * m[i] +
      (-2 * t3 + 3 * t2) * ys[i + 1] +
      (t3 - t2) * h[i] * m[i + 1]
    )
  }
}

// ---------------------------------------------------------------------------
// Loft helpers
// ---------------------------------------------------------------------------

function centroid(points: THREE.Vector3[]) {
  const c = new THREE.Vector3()
  points.forEach((p) => c.add(p))
  return c.divideScalar(points.length)
}

/** LoftGeometry with sections automatically wound so normals face outwards. */
type LoftCaps = {
  capStart?: boolean
  capEnd?: boolean
}

export function orientedLoft(sections: THREE.Vector3[][], opts: LoftCaps = {}) {
  const first = sections[0]
  const dir = centroid(sections[sections.length - 1]).sub(centroid(first))
  const normal = new THREE.Vector3()
  for (let i = 0; i < first.length; i++) {
    const p = first[i]
    const q = first[(i + 1) % first.length]
    normal.x += (p.y - q.y) * (p.z + q.z)
    normal.y += (p.z - q.z) * (p.x + q.x)
    normal.z += (p.x - q.x) * (p.y + q.y)
  }
  const ordered =
    normal.dot(dir) < 0 ? sections.map((s) => [...s].reverse()) : sections
  return new LoftGeometry(ordered, {
    closed: true,
    capStart: !!opts.capStart,
    capEnd: !!opts.capEnd,
  })
}

export type BodyKey = {
  z: number
  /** half width */
  w: number
  /** bottom height */
  yb: number
  /** top height */
  yt: number
  /** lateral centre */
  cx?: number
  /** superellipse exponent for the upper / lower half */
  nT?: number
  nB?: number
  /** height of the widest point as a fraction from bottom to top */
  e?: number
}

function superSection(k: Required<BodyKey>, segments: number) {
  const points: THREE.Vector3[] = []
  const ym = k.yb + (k.yt - k.yb) * k.e
  const hT = k.yt - ym
  const hB = ym - k.yb
  for (let j = 0; j < segments; j++) {
    const th = (j / segments) * Math.PI * 2
    const c = Math.cos(th)
    const s = Math.sin(th)
    const n = s >= 0 ? k.nT : k.nB
    const x = k.cx + k.w * Math.sign(c) * Math.pow(Math.abs(c), 2 / n)
    const y =
      ym + (s >= 0 ? hT : hB) * Math.sign(s) * Math.pow(Math.abs(s), 2 / n)
    points.push(V(x, y, k.z))
  }
  return points
}

export function bodyLoft(
  keys: BodyKey[],
  /** sample only part of the key range (keeps sections identical across a split) */
  opts: {
    stations?: number
    segments?: number
    capStart?: boolean
    capEnd?: boolean
    mirror?: boolean
    zRange?: [number, number]
  } = {},
) {
  const sorted = [...keys].sort((a, b) => a.z - b.z)
  const zs = sorted.map((k) => k.z)
  const f = (sel: (k: BodyKey) => number) => pchip(zs, sorted.map(sel))
  const W = f((k) => k.w)
  const YB = f((k) => k.yb)
  const YT = f((k) => k.yt)
  const CX = f((k) => k.cx ?? 0)
  const NT = f((k) => k.nT ?? 2.6)
  const NB = f((k) => k.nB ?? 3.5)
  const E = f((k) => k.e ?? 0.45)
  const stations = opts.stations ?? 44
  const segments = opts.segments ?? 36
  const z0 = opts.zRange?.[0] ?? zs[0]
  const z1 = opts.zRange?.[1] ?? zs[zs.length - 1]
  const sections: THREE.Vector3[][] = []
  for (let i = 0; i <= stations; i++) {
    // ease the distribution so the rounded ends get more stations
    const t = 0.5 - 0.5 * Math.cos((i / stations) * Math.PI)
    const z = z0 + (z1 - z0) * (0.35 * t + 0.65 * (i / stations))
    sections.push(
      superSection(
        {
          z,
          w: W(z),
          yb: YB(z),
          yt: YT(z),
          cx: CX(z) * (opts.mirror ? -1 : 1),
          nT: NT(z),
          nB: NB(z),
          e: E(z),
        },
        segments,
      ),
    )
  }
  return orientedLoft(sections, {
    capStart: opts.capStart,
    capEnd: opts.capEnd,
  })
}

/** Unit-chord inverted (downforce) aerofoil: TE → upper → LE → lower → TE. */
export function aerofoil(
  n: number,
  thickness: number,
  camber: number,
): [number, number][] {
  const t = (s: number) =>
    5 *
    thickness *
    (0.2969 * Math.sqrt(s) -
      0.126 * s -
      0.3516 * s * s +
      0.2843 * s ** 3 -
      0.1015 * s ** 4)
  const c = (s: number) => -camber * 4 * s * (1 - s)
  const pts: [number, number][] = []
  for (let i = 0; i <= n; i++) {
    const s = (1 + Math.cos((Math.PI * i) / n)) / 2
    pts.push([s, c(s) + t(s)])
  }
  for (let i = 1; i <= n; i++) {
    const s = (1 - Math.cos((Math.PI * i) / n)) / 2
    pts.push([s, c(s) - t(s)])
  }
  return pts
}

export type WingSpec = {
  x0: number
  x1: number
  chord: (x: number) => number
  zLE: (x: number) => number
  yLE: (x: number) => number
  /** degrees, positive raises the trailing edge */
  pitch: (x: number) => number
  thickness?: number
  camber?: number
  stations?: number
}

export function wingElement(spec: WingSpec) {
  const profile = aerofoil(10, spec.thickness ?? 0.09, spec.camber ?? 0.05)
  const stations = spec.stations ?? 18
  const sections: THREE.Vector3[][] = []
  for (let i = 0; i <= stations; i++) {
    const x = spec.x0 + ((spec.x1 - spec.x0) * i) / stations
    const c = spec.chord(x)
    const a = THREE.MathUtils.degToRad(spec.pitch(x))
    const zl = spec.zLE(x)
    const yl = spec.yLE(x)
    sections.push(
      profile.map(([s, h]) =>
        V(
          x,
          yl + s * c * Math.sin(a) + h * c * Math.cos(a),
          zl - s * c * Math.cos(a) + h * c * Math.sin(a),
        ),
      ),
    )
  }
  return orientedLoft(sections, { capStart: true, capEnd: true })
}

/** Shape with optional per-corner radius: points are [u, v, radius?]. */
export function roundedShape(points: [number, number, number?][]) {
  const shape = new THREE.Shape()
  const n = points.length
  for (let i = 0; i < n; i++) {
    const [x, y, r = 0] = points[i]
    const p = new THREE.Vector2(x, y)
    if (r <= 0) {
      if (i === 0) shape.moveTo(x, y)
      else shape.lineTo(x, y)
      continue
    }
    const prev = new THREE.Vector2(
      points[(i - 1 + n) % n][0],
      points[(i - 1 + n) % n][1],
    )
    const next = new THREE.Vector2(
      points[(i + 1) % n][0],
      points[(i + 1) % n][1],
    )
    const toPrev = prev.clone().sub(p)
    const toNext = next.clone().sub(p)
    const a = p
      .clone()
      .add(toPrev.clone().setLength(Math.min(r, toPrev.length() / 2)))
    const b = p
      .clone()
      .add(toNext.clone().setLength(Math.min(r, toNext.length() / 2)))
    if (i === 0) shape.moveTo(a.x, a.y)
    else shape.lineTo(a.x, a.y)
    shape.quadraticCurveTo(p.x, p.y, b.x, b.y)
  }
  shape.closePath()
  return shape
}

/** Flat plate in the Z/Y plane, extruded along X and centred on `x`. Points are [z, y, radius?]. */
export function plateZY(
  points: [number, number, number?][],
  thickness: number,
  x: number,
) {
  const bevel = Math.min(0.004, thickness / 3)
  const depth = Math.max(0.001, thickness - bevel * 2)
  const shape = roundedShape(points.map(([z, y, r]) => [-z, y, r]))
  const g = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 1,
    curveSegments: 6,
  })
  g.rotateY(Math.PI / 2)
  g.translate(x - depth / 2, 0, 0)
  return g
}

/** Flat plate in the X/Z plane (top view), extruded upwards from `y`. Points are [x, z, radius?]. */
export function plateXZ(
  points: [number, number, number?][],
  thickness: number,
  y: number,
) {
  const bevel = Math.min(0.005, thickness / 3)
  const depth = Math.max(0.001, thickness - bevel * 2)
  const shape = roundedShape(points.map(([x, z, r]) => [x, -z, r]))
  const g = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 1,
    curveSegments: 6,
  })
  g.rotateX(-Math.PI / 2)
  g.translate(0, y + bevel, 0)
  return g
}

export function beam(
  a: THREE.Vector3,
  b: THREE.Vector3,
  radius: number,
  flatten = 1,
) {
  const dir = b.clone().sub(a)
  const length = dir.length()
  const g = new THREE.CylinderGeometry(radius, radius, length, 8, 1)
  if (flatten !== 1) g.scale(1, 1, flatten)
  g.applyQuaternion(
    new THREE.Quaternion().setFromUnitVectors(V(0, 1, 0), dir.normalize()),
  )
  const mid = a.clone().add(b).multiplyScalar(0.5)
  g.translate(mid.x, mid.y, mid.z)
  return g
}

export function ellipsoid(
  center: THREE.Vector3,
  radii: THREE.Vector3,
  w = 24,
  h = 14,
) {
  const g = new THREE.SphereGeometry(1, w, h)
  g.scale(radii.x, radii.y, radii.z)
  g.translate(center.x, center.y, center.z)
  return g
}

export function tube(points: THREE.Vector3[], radius: number, segments = 48) {
  return new THREE.TubeGeometry(
    new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.5),
    segments,
    radius,
    10,
    false,
  )
}

/** A lathe profile point: radius, axial position and the material it belongs to. */
export type ProfilePoint<T extends string,> = {
  r: number
  y: number
  tag: T
}

/** Lathe a tagged profile (points in [radius, axial]) and return one geometry per tag. */
export function tagLathe<T extends string>(
  profile: ProfilePoint<T>[],
  segments: number,
) {
  const out = new Map<T, THREE.BufferGeometry[]>()
  let start = 0
  for (let i = 1; i <= profile.length; i++) {
    const runEnds =
      i === profile.length || profile[i].tag !== profile[start].tag
    if (!runEnds) continue
    const end = Math.min(i, profile.length - 1)
    const pts = profile
      .slice(start, end + 1)
      .map((p) => new THREE.Vector2(Math.max(p.r, 0.0001), p.y))
    if (pts.length >= 2) {
      const g = new THREE.LatheGeometry(pts, segments)
      const list = out.get(profile[start].tag) ?? []
      list.push(g)
      out.set(profile[start].tag, list)
    }
    start = i
  }
  return out
}

// ---------------------------------------------------------------------------
// Car assembly (helpers above are shared with the career vehicles)
// ---------------------------------------------------------------------------

export const CAR_DIMENSIONS = {
  wheelRadius: 0.36,
  frontAxleZ: 1.8,
  rearAxleZ: -1.8,
  length: 5.6,
  width: 2.0,
}

function wheel(halfWidth: number) {
  const R = CAR_DIMENSIONS.wheelRadius
  const rim = 0.236
  const hw = halfWidth
  type Tag = "rubber" | "stripe"
  const side = (sign: 1 | -1): ProfilePoint<Tag>[] => {
    // from rim outwards to the shoulder, on one side
    const pts: ProfilePoint<Tag>[] = [
      { r: rim, y: hw - 0.014, tag: "rubber" },
      { r: 0.255, y: hw - 0.004, tag: "rubber" },
      { r: 0.272, y: hw + 0.0015, tag: "rubber" },
      { r: 0.288, y: hw + 0.004, tag: "stripe" },
      { r: 0.306, y: hw + 0.005, tag: "rubber" },
      { r: 0.322, y: hw + 0.004, tag: "rubber" },
      { r: 0.338, y: hw - 0.001, tag: "rubber" },
      { r: 0.35, y: hw - 0.012, tag: "rubber" },
      { r: 0.357, y: hw - 0.03, tag: "rubber" },
      { r: R, y: hw - 0.055, tag: "rubber" },
    ]
    return pts.map((p) => ({ ...p, y: p.y * sign }))
  }
  // inner rim → inner sidewall → tread → outer sidewall → outer rim (gives outward normals)
  const inner = side(-1)
  const outer = side(1).reverse()
  const profile = [...inner, ...outer]
  // tags mark the start of a run; the stripe run is a single segment on each sidewall
  const tagged = profile.map((p, i) => {
    const next = profile[i + 1]
    const isStripe =
      (p.tag === "stripe" && i < inner.length) ||
      (next?.tag === "stripe" && i >= inner.length)
    return { ...p, tag: (isStripe ? "stripe" : "rubber") as Tag }
  })
  const tyre = tagLathe(tagged, 56)

  type CoverTag = "rim" | "paint2"
  const coverProfile: ProfilePoint<CoverTag>[] = [
    { r: rim + 0.002, y: hw - 0.016, tag: "rim" },
    { r: 0.205, y: hw - 0.024, tag: "paint2" },
    { r: 0.178, y: hw - 0.025, tag: "rim" },
    { r: 0.07, y: hw - 0.02, tag: "rim" },
    { r: 0.045, y: hw - 0.006, tag: "rim" },
    { r: 0.03, y: hw + 0.006, tag: "rim" },
    { r: 0.0, y: hw + 0.008, tag: "rim" },
  ]
  const cover = tagLathe(coverProfile, 40)
  const innerDisc = tagLathe(
    [
      { r: 0, y: -hw + 0.03, tag: "carbon" as const },
      { r: 0.12, y: -hw + 0.025, tag: "carbon" as const },
      { r: rim + 0.002, y: -hw + 0.014, tag: "carbon" as const },
    ],
    32,
  )

  const parts: Partial<Record<CarPartKey, THREE.BufferGeometry[]>> = {
    rubber: tyre.get("rubber") ?? [],
    stripe: tyre.get("stripe") ?? [],
    rim: cover.get("rim") ?? [],
    paint2: cover.get("paint2") ?? [],
    carbon: innerDisc.get("carbon") ?? [],
  }
  // lathe axis Y → axle along X
  Object.values(parts).forEach((list) =>
    list?.forEach((g) => g.rotateZ(-Math.PI / 2)),
  )
  return parts
}

function buildParts(driver: boolean) {
  const parts: Record<CarPartKey, THREE.BufferGeometry[]> = {
    paint: [],
    paint2: [],
    carbon: [],
    dark: [],
    rubber: [],
    stripe: [],
    rim: [],
    visor: [],
    glow: [],
  }
  const add = (key: CarPartKey, ...g: THREE.BufferGeometry[]) =>
    parts[key].push(...g)

  // --- survival cell + nose ---------------------------------------------------
  const chassisKeys: BodyKey[] = [
    { z: -0.62, w: 0.3, yb: 0.1, yt: 0.7, nT: 3.4, nB: 4, e: 0.35 },
    { z: -0.3, w: 0.33, yb: 0.09, yt: 0.7, nT: 3.6, nB: 4, e: 0.35 },
    { z: 0.0, w: 0.34, yb: 0.09, yt: 0.665, nT: 3.8, nB: 4, e: 0.35 },
    { z: 0.35, w: 0.32, yb: 0.1, yt: 0.675, nT: 3.6, nB: 4, e: 0.36 },
    { z: 0.7, w: 0.27, yb: 0.13, yt: 0.7, nT: 3.0, nB: 3.6, e: 0.4 },
    { z: 1.1, w: 0.21, yb: 0.18, yt: 0.655, nT: 2.8, nB: 3.4, e: 0.42 },
    { z: 1.55, w: 0.165, yb: 0.215, yt: 0.58, nT: 2.7, nB: 3.2, e: 0.42 },
    { z: 2.0, w: 0.132, yb: 0.2, yt: 0.475, nT: 2.7, nB: 3.0, e: 0.42 },
    { z: 2.45, w: 0.104, yb: 0.155, yt: 0.36, nT: 2.8, nB: 3.0, e: 0.42 },
    { z: 2.8, w: 0.08, yb: 0.125, yt: 0.272, nT: 3.0, nB: 3.0, e: 0.42 },
    { z: 2.94, w: 0.046, yb: 0.14, yt: 0.232, nT: 2.4, nB: 2.4, e: 0.45 },
  ]
  const noseSplit = 2.52
  const chassis = bodyLoft(chassisKeys, {
    stations: 46,
    segments: 40,
    zRange: [-0.62, noseSplit],
  })
  const noseTip = bodyLoft(chassisKeys, {
    stations: 10,
    segments: 40,
    zRange: [noseSplit, 2.94],
    capEnd: true,
  })
  add("paint", chassis)
  add("paint2", noseTip)

  // --- engine cover ---------------------------------------------------------------
  const engine = bodyLoft(
    [
      { z: -2.48, w: 0.085, yb: 0.27, yt: 0.42, nT: 2.4, nB: 2.6, e: 0.5 },
      { z: -2.2, w: 0.12, yb: 0.19, yt: 0.475, nT: 2.4, nB: 3, e: 0.4 },
      { z: -1.8, w: 0.17, yb: 0.12, yt: 0.555, nT: 2.3, nB: 3.2, e: 0.32 },
      { z: -1.3, w: 0.235, yb: 0.09, yt: 0.65, nT: 2.2, nB: 3.4, e: 0.28 },
      { z: -0.85, w: 0.285, yb: 0.09, yt: 0.735, nT: 2.3, nB: 3.6, e: 0.3 },
      { z: -0.45, w: 0.305, yb: 0.09, yt: 0.735, nT: 2.6, nB: 3.8, e: 0.32 },
      { z: -0.15, w: 0.3, yb: 0.09, yt: 0.68, nT: 3, nB: 4, e: 0.34 },
    ],
    { stations: 40, segments: 36, capStart: true },
  )
  add("paint", engine)

  // --- airbox / roll hoop ------------------------------------------------------
  const airbox = bodyLoft(
    [
      { z: -1.45, w: 0.05, yb: 0.6, yt: 0.62, nT: 2.4, nB: 3, e: 0.5 },
      { z: -1.05, w: 0.115, yb: 0.6, yt: 0.79, nT: 2.4, nB: 3, e: 0.45 },
      { z: -0.72, w: 0.148, yb: 0.62, yt: 0.915, nT: 2.5, nB: 3, e: 0.45 },
      { z: -0.5, w: 0.155, yb: 0.64, yt: 0.955, nT: 2.6, nB: 3, e: 0.48 },
      { z: -0.37, w: 0.145, yb: 0.66, yt: 0.935, nT: 2.6, nB: 3, e: 0.5 },
    ],
    { stations: 22, segments: 28, capEnd: true },
  )
  add("paint", airbox)
  // intake opening on the roll hoop
  {
    const g = new THREE.CircleGeometry(1, 24)
    g.scale(0.095, 0.07, 1)
    g.translate(0, 0.845, -0.368)
    add("dark", g)
  }

  // --- sidepods ------------------------------------------------------------------
  const sidepodKeys: BodyKey[] = [
    {
      z: -1.88,
      cx: 0.19,
      w: 0.055,
      yb: 0.1,
      yt: 0.24,
      nT: 2.4,
      nB: 2.6,
      e: 0.5,
    },
    { z: -1.5, cx: 0.25, w: 0.1, yb: 0.09, yt: 0.29, nT: 2.4, nB: 2.8, e: 0.5 },
    { z: -1.1, cx: 0.33, w: 0.16, yb: 0.09, yt: 0.37, nT: 2.5, nB: 3, e: 0.52 },
    { z: -0.7, cx: 0.41, w: 0.21, yb: 0.09, yt: 0.45, nT: 2.6, nB: 3, e: 0.55 },
    { z: -0.3, cx: 0.46, w: 0.24, yb: 0.09, yt: 0.52, nT: 2.7, nB: 3, e: 0.56 },
    {
      z: 0.1,
      cx: 0.48,
      w: 0.245,
      yb: 0.095,
      yt: 0.56,
      nT: 2.8,
      nB: 3,
      e: 0.58,
    },
    { z: 0.38, cx: 0.48, w: 0.215, yb: 0.11, yt: 0.555, nT: 3, nB: 3, e: 0.6 },
    { z: 0.5, cx: 0.47, w: 0.17, yb: 0.14, yt: 0.51, nT: 3.2, nB: 3, e: 0.62 },
  ]
  const sidepodR = bodyLoft(sidepodKeys, {
    stations: 36,
    segments: 36,
    capStart: true,
    capEnd: true,
  })
  const sidepodL = bodyLoft(sidepodKeys, {
    stations: 36,
    segments: 36,
    capStart: true,
    capEnd: true,
    mirror: true,
  })
  add("paint", sidepodR, sidepodL)
  for (const s of [1, -1]) {
    // inlet mouth
    const shape = roundedShape([
      [-0.125, -0.07, 0.05],
      [0.125, -0.07, 0.05],
      [0.125, 0.07, 0.05],
      [-0.125, 0.07, 0.05],
    ])
    const g = new THREE.ShapeGeometry(shape, 6)
    g.translate(0.47 * s, 0.375, 0.503)
    add("dark", g)
  }

  // --- floor, diffuser, plank -------------------------------------------------------
  const floorRight: [number, number, number?][] = [
    [0.17, 1.45, 0.05],
    [0.46, 1.24, 0.12],
    [0.68, 0.98, 0.15],
    [0.79, 0.62, 0.1],
    [0.8, -0.72, 0.1],
    [0.76, -1.06, 0.1],
    [0.64, -1.32, 0.08],
    [0.555, -1.58, 0.05],
    [0.54, -2.36, 0.03],
  ]
  const floorLeft = floorRight
    .map(([x, z, r]) => [-x, z, r] as [number, number, number?])
    .reverse()
  add("carbon", plateXZ([...floorRight, ...floorLeft], 0.022, 0.048))
  // floor edge fences near the front of the floor
  for (const s of [1, -1]) {
    add(
      "carbon",
      plateZY(
        [
          [1.32, 0.07],
          [0.9, 0.07],
          [0.95, 0.19, 0.04],
          [1.25, 0.2, 0.04],
        ],
        0.012,
        0.33 * s,
      ),
    )
  }
  // diffuser roof + strakes
  {
    const roof = wingElement({
      x0: -0.52,
      x1: 0.52,
      chord: () => 0.62,
      zLE: () => -1.74,
      yLE: () => 0.075,
      pitch: () => 19,
      thickness: 0.03,
      camber: -0.06,
      stations: 6,
    })
    add("carbon", roof)
    for (const x of [-0.5, -0.3, -0.1, 0.1, 0.3, 0.5]) {
      add(
        "carbon",
        plateZY(
          [
            [-1.78, 0.07],
            [-2.37, 0.07],
            [-2.37, 0.29],
            [-2.0, 0.17],
          ],
          0.01,
          x,
        ),
      )
    }
  }

  // --- cockpit, driver ---------------------------------------------------------------
  add("dark", ellipsoid(V(0, 0.636, 0.03), V(0.215, 0.04, 0.37)))
  // headrest pads either side of the helmet
  for (const s of [1, -1])
    add(
      "dark",
      ellipsoid(V(0.17 * s, 0.69, -0.12), V(0.07, 0.05, 0.16), 16, 10),
    )
  if (driver) {
    const helmet = ellipsoid(V(0, 0.795, -0.05), V(0.113, 0.12, 0.13))
    add("paint2", helmet)
    const visor = new THREE.SphereGeometry(
      1,
      28,
      10,
      Math.PI / 2 - 0.95,
      1.9,
      1.12,
      0.42,
    )
    visor.scale(0.1145, 0.1215, 0.1315)
    visor.translate(0, 0.795, -0.05)
    add("visor", visor)
  } else {
    // empty cockpit: the steering wheel shows instead of a helmet
    const wheel = new THREE.TorusGeometry(0.1, 0.014, 8, 28)
    wheel.rotateX(-0.25)
    wheel.translate(0, 0.62, 0.36)
    add("dark", wheel)
  }

  // --- halo ---------------------------------------------------------------------------
  add(
    "paint2",
    tube(
      [
        V(-0.25, 0.62, -0.34),
        V(-0.293, 0.84, -0.21),
        V(-0.282, 0.905, 0.06),
        V(-0.17, 0.928, 0.32),
        V(0, 0.935, 0.42),
        V(0.17, 0.928, 0.32),
        V(0.282, 0.905, 0.06),
        V(0.293, 0.84, -0.21),
        V(0.25, 0.62, -0.34),
      ],
      0.026,
      72,
    ),
    tube([V(0, 0.935, 0.42), V(0, 0.875, 0.5), V(0, 0.71, 0.62)], 0.03, 16),
  )

  // --- mirrors ------------------------------------------------------------------------
  for (const s of [1, -1]) {
    const housing = new THREE.CapsuleGeometry(0.026, 0.09, 4, 10)
    housing.rotateZ(Math.PI / 2)
    housing.scale(1, 1, 1.3)
    housing.translate(0.415 * s, 0.705, 0.43)
    add("paint2", housing)
    add(
      "carbon",
      beam(V(0.29 * s, 0.6, 0.46), V(0.395 * s, 0.7, 0.43), 0.009, 0.5),
    )
    add(
      "carbon",
      beam(V(0.33 * s, 0.52, 0.42), V(0.4 * s, 0.69, 0.42), 0.008, 0.5),
    )
  }

  // --- engine-cover fin ---------------------------------------------------------------
  add(
    "paint",
    plateZY(
      [
        [-0.78, 0.66],
        [-0.78, 0.885, 0.05],
        [-1.95, 0.66, 0.03],
        [-1.95, 0.5],
      ],
      0.012,
      0,
    ),
  )

  // --- front wing ------------------------------------------------------------------------
  const fw = 0.93
  const frac = (x: number) => Math.min(1, Math.abs(x) / fw)
  add(
    "carbon",
    wingElement({
      x0: -fw,
      x1: fw,
      chord: (x) => 0.36 - 0.05 * frac(x),
      zLE: (x) => 2.98 - 0.04 * frac(x) ** 2,
      yLE: (x) => 0.075 + 0.022 * frac(x) ** 2,
      pitch: (x) => 2 + 4 * frac(x),
      thickness: 0.085,
      camber: 0.05,
      stations: 24,
    }),
  )
  const flaps = [
    {
      chord: 0.22,
      z: 2.81,
      y: 0.115,
      rise: 0.05,
      pitch: 13,
      key: "carbon" as const,
    },
    {
      chord: 0.17,
      z: 2.685,
      y: 0.165,
      rise: 0.085,
      pitch: 25,
      key: "paint" as const,
    },
    {
      chord: 0.135,
      z: 2.585,
      y: 0.215,
      rise: 0.11,
      pitch: 37,
      key: "paint" as const,
    },
  ]
  for (const f of flaps) {
    for (const [x0, x1] of [
      [-fw, -0.15],
      [0.15, fw],
    ]) {
      add(
        f.key,
        wingElement({
          x0,
          x1,
          chord: () => f.chord,
          zLE: (x) => f.z - 0.07 * frac(x) ** 1.5,
          yLE: (x) => f.y + f.rise * frac(x) ** 1.7,
          pitch: (x) => f.pitch + 6 * frac(x),
          thickness: 0.085,
          camber: 0.06,
          stations: 14,
        }),
      )
    }
  }
  for (const s of [1, -1]) {
    add(
      "paint2",
      plateZY(
        [
          [3.0, 0.045, 0.02],
          [3.0, 0.2, 0.04],
          [2.78, 0.37, 0.08],
          [2.44, 0.37, 0.03],
          [2.44, 0.18, 0.02],
          [2.6, 0.045, 0.02],
        ],
        0.014,
        0.945 * s,
      ),
    )
  }

  // --- rear wing -------------------------------------------------------------------------
  const rw = 0.47
  add(
    "carbon",
    wingElement({
      x0: -rw,
      x1: rw,
      chord: () => 0.3,
      zLE: () => -2.3,
      yLE: (x) => 0.795 - 0.03 * (1 - (x / rw) ** 2),
      pitch: () => 10,
      thickness: 0.1,
      camber: 0.07,
      stations: 18,
    }),
  )
  add(
    "paint",
    wingElement({
      x0: -rw,
      x1: rw,
      chord: () => 0.2,
      zLE: () => -2.5,
      yLE: (x) => 0.885 - 0.02 * (1 - (x / rw) ** 2),
      pitch: () => 36,
      thickness: 0.085,
      camber: 0.06,
      stations: 18,
    }),
  )
  // beam wing
  add(
    "carbon",
    wingElement({
      x0: -0.36,
      x1: 0.36,
      chord: () => 0.15,
      zLE: () => -2.36,
      yLE: () => 0.41,
      pitch: () => 8,
      thickness: 0.09,
      camber: 0.05,
      stations: 10,
    }),
    wingElement({
      x0: -0.36,
      x1: 0.36,
      chord: () => 0.11,
      zLE: () => -2.48,
      yLE: () => 0.45,
      pitch: () => 26,
      thickness: 0.09,
      camber: 0.05,
      stations: 10,
    }),
  )
  for (const s of [1, -1]) {
    add(
      "paint2",
      plateZY(
        [
          [-2.2, 0.36, 0.03],
          [-2.2, 0.9, 0.05],
          [-2.36, 1.03, 0.08],
          [-2.74, 1.03, 0.05],
          [-2.74, 0.62, 0.05],
          [-2.5, 0.36, 0.08],
        ],
        0.016,
        (rw + 0.008) * s,
      ),
    )
    // endplate rain lights
    const strip = new THREE.BoxGeometry(0.006, 0.26, 0.012)
    strip.translate((rw + 0.008 + 0.0085) * s, 0.84, -2.735)
    add("glow", strip)
  }
  // swan-neck pylon
  add(
    "carbon",
    plateZY(
      [
        [-2.26, 0.4],
        [-2.47, 0.4],
        [-2.5, 0.92, 0.03],
        [-2.43, 0.95, 0.02],
        [-2.36, 0.8],
      ],
      0.018,
      0,
    ),
  )
  // rear crash structure + rain light
  add(
    "carbon",
    bodyLoft(
      [
        { z: -2.66, w: 0.05, yb: 0.3, yt: 0.37, nT: 3, nB: 3 },
        { z: -2.4, w: 0.07, yb: 0.28, yt: 0.4, nT: 3, nB: 3 },
      ],
      { stations: 4, segments: 20, capStart: true },
    ),
  )
  {
    const light = new THREE.BoxGeometry(0.075, 0.04, 0.01)
    light.translate(0, 0.335, -2.667)
    add("glow", light)
  }

  // --- suspension -------------------------------------------------------------------------
  for (const s of [1, -1]) {
    const z = CAR_DIMENSIONS.frontAxleZ
    add(
      "carbon",
      beam(
        V(0.16 * s, 0.505, z + 0.25),
        V(0.66 * s, 0.52, z + 0.02),
        0.012,
        0.45,
      ),
      beam(
        V(0.16 * s, 0.52, z - 0.27),
        V(0.66 * s, 0.52, z + 0.02),
        0.012,
        0.45,
      ),
      beam(V(0.12 * s, 0.25, z + 0.3), V(0.68 * s, 0.22, z), 0.012, 0.45),
      beam(V(0.12 * s, 0.26, z - 0.3), V(0.68 * s, 0.22, z), 0.012, 0.45),
      beam(V(0.66 * s, 0.25, z - 0.02), V(0.15 * s, 0.56, z - 0.14), 0.011),
      beam(V(0.16 * s, 0.4, z + 0.14), V(0.66 * s, 0.38, z + 0.17), 0.009),
    )
    const zr = CAR_DIMENSIONS.rearAxleZ
    add(
      "carbon",
      beam(V(0.13 * s, 0.55, zr + 0.25), V(0.6 * s, 0.56, zr), 0.012, 0.45),
      beam(V(0.11 * s, 0.56, zr - 0.25), V(0.6 * s, 0.56, zr), 0.012, 0.45),
      beam(V(0.11 * s, 0.2, zr + 0.35), V(0.62 * s, 0.2, zr), 0.012, 0.45),
      beam(V(0.09 * s, 0.22, zr - 0.3), V(0.62 * s, 0.2, zr), 0.012, 0.45),
      beam(V(0.14 * s, 0.3, zr - 0.15), V(0.6 * s, 0.4, zr - 0.15), 0.009),
      beam(V(0.08 * s, 0.36, zr), V(0.6 * s, 0.36, zr), 0.022),
    )
  }

  // --- wheels ---------------------------------------------------------------------------------
  const front = wheel(0.15)
  const rear = wheel(0.2)
  const placeWheel = (
    src: Partial<Record<CarPartKey, THREE.BufferGeometry[]>>,
    x: number,
    z: number,
  ) => {
    for (const [key, list] of Object.entries(
      src,
    ) as [CarPartKey, THREE.BufferGeometry[]][]) {
      for (const g of list) {
        const c = g.clone()
        if (x < 0) c.rotateY(Math.PI)
        c.translate(x, CAR_DIMENSIONS.wheelRadius, z)
        add(key, c)
      }
    }
  }
  placeWheel(front, 0.8, CAR_DIMENSIONS.frontAxleZ)
  placeWheel(front, -0.8, CAR_DIMENSIONS.frontAxleZ)
  placeWheel(rear, 0.785, CAR_DIMENSIONS.rearAxleZ)
  placeWheel(rear, -0.785, CAR_DIMENSIONS.rearAxleZ)

  return { parts, chassis, engine, sidepodL, sidepodR }
}

export function normalise(g: THREE.BufferGeometry) {
  const ng = g.index ? g.toNonIndexed() : g.clone()
  for (const name of Object.keys(ng.attributes)) {
    if (name !== "position" && name !== "normal" && name !== "uv")
      ng.deleteAttribute(name)
  }
  if (!ng.attributes.normal) ng.computeVertexNormals()
  if (!ng.attributes.uv) {
    ng.setAttribute(
      "uv",
      new THREE.Float32BufferAttribute(
        new Float32Array(ng.attributes.position.count * 2),
        2,
      ),
    )
  }
  return ng
}

function decalOn(
  target: THREE.BufferGeometry,
  position: THREE.Vector3,
  rotation: THREE.Euler,
  size: THREE.Vector3,
) {
  const mesh = new THREE.Mesh(target)
  mesh.updateMatrixWorld(true)
  return new DecalGeometry(mesh, position, rotation, size)
}

function flatDecal(
  width: number,
  height: number,
  position: THREE.Vector3,
  rotationY: number,
) {
  const g = new THREE.PlaneGeometry(width, height)
  g.rotateY(rotationY)
  g.translate(position.x, position.y, position.z)
  return g
}

const cached = new Map<boolean, CarGeometry>()

/** The shared F1 car; `driver: false` leaves the cockpit empty (career mode). */
export function getCarGeometry(driver = true): CarGeometry {
  const hit = cached.get(driver)
  if (hit) return hit
  const { parts, chassis, sidepodL, sidepodR } = buildParts(driver)

  const merged = {} as Record<CarPartKey, THREE.BufferGeometry>
  for (const key of CAR_PART_KEYS) {
    const list = parts[key].map(normalise)
    const g = list.length
      ? mergeGeometries(list, false)
      : new THREE.BufferGeometry()
    if (!g) throw new Error(`Failed to merge car part: ${key}`)
    g.computeBoundingSphere()
    merged[key] = g
  }

  const decals: CarGeometry["decals"] = {
    sidepodR: {
      texture: "name",
      geometry: decalOn(
        sidepodR,
        V(0.7, 0.35, -0.12),
        new THREE.Euler(0, Math.PI / 2, 0),
        V(0.88, 0.22, 0.5),
      ),
    },
    sidepodL: {
      texture: "name",
      geometry: decalOn(
        sidepodL,
        V(-0.7, 0.35, -0.12),
        new THREE.Euler(0, -Math.PI / 2, 0),
        V(0.88, 0.22, 0.5),
      ),
    },
    nose: {
      texture: "number",
      geometry: decalOn(
        chassis,
        V(0, 0.45, 2.12),
        new THREE.Euler(-Math.PI / 2 + 0.27, 0, 0),
        V(0.19, 0.19, 0.14),
      ),
    },
    finR: {
      texture: "number",
      geometry: flatDecal(0.12, 0.12, V(0.0085, 0.72, -1.3), Math.PI / 2),
    },
    finL: {
      texture: "number",
      geometry: flatDecal(0.12, 0.12, V(-0.0085, 0.72, -1.3), -Math.PI / 2),
    },
    wingR: {
      texture: "name",
      geometry: flatDecal(0.46, 0.115, V(rwOuter(), 0.6, -2.47), Math.PI / 2),
    },
    wingL: {
      texture: "name",
      geometry: flatDecal(0.46, 0.115, V(-rwOuter(), 0.6, -2.47), -Math.PI / 2),
    },
  }

  const result = { parts: merged, decals }
  cached.set(driver, result)
  return result
}

function rwOuter() {
  return 0.47 + 0.008 + 0.0105
}
