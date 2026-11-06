import { mulberry32 } from '../../../data/rng'
import { Op, Sdf, clipMesh, eulerFrame, simplify, surfaceNets, tetraGradient, v3, type Frame, type MeshData, type V3 } from './sdf'

/**
 * Head sculpt, authored in metres around the head centre O (between the ears at eye level).
 * +Z faces forward, +Y up. Converted to the normalized character space when assembled.
 *
 * Landmarks follow adult male norms (64 mm between the pupils, a 24 mm eyeball, the stomion about 72 mm and
 * the chin about 122 mm below the eye line). The face is meshed with surface nets (it has the concave and
 * overhanging anatomy a ray-traced grid cannot sample: lids, nostrils, the lip line), the cranium with the
 * ray-traced grid that the scalp hair and painted hairlines are fitted to.
 */
export interface FaceParams {
  headW: number
  faceLen: number
  jawW: number
  chin: number
  cheek: number
  brow: number
  noseW: number
  noseLen: number
  noseBridge: number
  lipFull: number
  eyeSize: number
  eyeSpread: number
  earSize: number
  /** 0 = round brows, 1 = arched */
  browArch: number
  browThick: number
  /** nose tip projection */
  noseTip: number
  /** mouth width */
  lipW: number
  /** eye opening height */
  eyeOpen: number
  /** canthal tilt (rad, lateral corner up) */
  eyeTilt: number
  /** depth of the upper lid crease, 0..1 */
  lidFold: number
  /** hollow under the cheekbones, 0..1 */
  hollow: number
  /** chin squareness, 0..1 */
  chinSq: number
}

export function faceParams(seed: number): FaceParams {
  const r = mulberry32(seed ^ 0x5f3759df)
  const v = (lo: number, hi: number) => lo + (hi - lo) * r()
  // the first fifteen draws keep their order so a player's proportions stay his own
  return {
    headW: v(0.95, 1.05),
    faceLen: v(0.95, 1.06),
    jawW: v(0.92, 1.12),
    chin: v(0.88, 1.15),
    cheek: v(0.88, 1.15),
    brow: v(0.85, 1.2),
    noseW: v(0.9, 1.3),
    noseLen: v(0.93, 1.07),
    noseBridge: v(0.85, 1.15),
    lipFull: v(0.9, 1.3),
    eyeSize: v(0.96, 1.04),
    eyeSpread: v(0.97, 1.04),
    earSize: v(0.93, 1.07),
    browArch: r(),
    browThick: v(0.8, 1.2),
    noseTip: v(0.88, 1.12),
    lipW: v(0.93, 1.08),
    eyeOpen: v(0.9, 1.06),
    eyeTilt: v(0.02, 0.11),
    lidFold: r(),
    hollow: r(),
    chinSq: r(),
  }
}

export const EYE_R = 0.0122
/** Lid shell thickness over the eyeball (the visible lid margin). */
export const LID_T = 0.0022

export function eyeCenter(f: FaceParams, side: 1 | -1): V3 {
  return [0.0322 * f.eyeSpread * f.headW * side, 0.0, 0.0688]
}

/** Stomion (the line between the lips), in head space. */
export function mouthY(f: FaceParams) {
  return -0.0715 * f.faceLen
}

/** Nose base and tip, shared by the sculpt and the painter. */
export function noseGeom(f: FaceParams) {
  const nl = f.noseLen
  const base = 0.0965
  const tip = base + 0.0142 * f.noseTip
  return { nl, nw: f.noseW, base, tip, sub: -0.0492 * nl }
}

/**
 * The almond eye opening in the eye's frame (local +x points laterally): an upper arc and a lower arc that
 * cross at the corners, tilted by the canthal tilt. The upper lid peaks a little medially and covers the top
 * of the iris; the lower lid's lowest point sits a little laterally.
 */
export function eyeOpening(f: FaceParams, sd: 1 | -1) {
  const e = eyeCenter(f, sd)
  const half = 0.0148 * (0.98 + 0.02 * f.eyeSize)
  const top = 0.0046 * f.eyeOpen
  const bot = 0.0049 * f.eyeOpen
  const ry1 = 0.0135
  const a1 = ry1 - top
  const rx1 = half / Math.sqrt(1 - (a1 / ry1) ** 2)
  const ry2 = 0.0142
  const b2 = ry2 - bot
  const rx2 = half / Math.sqrt(1 - (b2 / ry2) ** 2)
  const frame: Frame = eulerFrame(0, 0, sd * f.eyeTilt)
  // local -> world (frame columns are the local axes in world space); local x is lateral
  const toWorld = (lx: number, ly: number, lz: number): V3 => [
    e[0] + frame.x[0] * lx * sd + frame.y[0] * ly + frame.z[0] * lz,
    e[1] + frame.x[1] * lx * sd + frame.y[1] * ly + frame.z[1] * lz,
    e[2] + frame.x[2] * lx * sd + frame.y[2] * ly + frame.z[2] * lz,
  ]
  const zc = 0.008
  return {
    e,
    half,
    frame,
    c1: toWorld(-0.0012, -a1, zc),
    r1: [rx1, ry1, 0.03] as V3,
    c2: toWorld(0.0009, b2, zc),
    r2: [rx2, ry2, 0.03] as V3,
    /** lid margin height (local y) at local lateral offset x, for the upper and lower lid */
    upperY: (x: number) => -a1 + ry1 * Math.sqrt(Math.max(0, 1 - ((x + 0.0012) / rx1) ** 2)),
    lowerY: (x: number) => b2 - ry2 * Math.sqrt(Math.max(0, 1 - ((x - 0.0009) / rx2) ** 2)),
    toWorld,
  }
}

/**
 * Points along a lid margin on the outer lid surface (head space), medial corner to lateral corner.
 * `lift` raises the curve above the margin (the crease, the lash roots).
 */
export function lidCurve(f: FaceParams, sd: 1 | -1, upper: boolean, n = 16, lift = 0, inset = 0): V3[] {
  const o = eyeOpening(f, sd)
  const R = EYE_R * f.eyeSize + LID_T + inset
  const pts: V3[] = []
  for (let i = 0; i <= n; i++) {
    const x = -o.half + (2 * o.half * i) / n
    const y = (upper ? o.upperY(x) : o.lowerY(x)) + lift * Math.sin((Math.PI * i) / n)
    const z = Math.sqrt(Math.max(1e-8, R * R - x * x - y * y))
    pts.push(o.toWorld(x, y, z))
  }
  return pts
}

export function headSdf(f: FaceParams): Sdf {
  const s = new Sdf()
  const W = f.headW
  const L = f.faceLen
  const mir = (p: V3, sd: number): V3 => [p[0] * sd, p[1], p[2]]
  const sides = [1, -1] as const
  // ---- cranium, occiput, forehead (the hair, headbands and painted hairlines are fitted to these)
  // k only pads its bounds here (nothing precedes it); later 3 cm blends need the cranium evaluated that far out
  s.ellipsoid([0, 0.02, -0.012], [0.073 * W, 0.09, 0.097], { k: 0.03 })
  s.ellipsoid([0, -0.025, -0.07], [0.05 * W, 0.042, 0.04], { k: 0.03 })
  s.ellipsoid([0, 0.034, 0.05], [0.058 * W, 0.045, 0.038], { k: 0.03 })
  // ---- midface and the dental arch the lips sit on
  s.ellipsoid([0, -0.026, 0.046], [0.05 * W, 0.046, 0.05], { k: 0.026 })
  s.ellipsoid([0, mouthY(f) + 0.002, 0.072], [0.029 * f.lipW, 0.025, 0.021], { k: 0.03 })
  for (const sd of sides) {
    const c = f.cheek
    // malar eminence, and the zygomatic arch running back toward the ear
    s.ellipsoid(mir([0.046 * W, -0.018, 0.058], sd), [0.016 * c, 0.0105 * c, 0.0135 * c], { frame: eulerFrame(0, 0.45 * sd, -0.32 * sd), k: 0.017 })
    s.roundCone(mir([0.052 * W, -0.013, 0.048], sd), mir([0.066 * W, -0.006, 0.004], sd), 0.0074 * c, 0.006, { k: 0.02 })
    // one broad cheek pad from the cheekbone down to the jaw (no ball cheeks)
    s.ellipsoid(mir([0.037 * W, -0.053 * L, 0.051], sd), [0.019, 0.026, 0.03], { k: 0.03 })
    // buccal fat and masseter fill the side of the face between the cheekbone and the jaw
    // (thinner on lean faces: that is the hollow under the cheekbone)
    s.ellipsoid(mir([0.047 * W, -0.048 * L, 0.018], sd), [0.0135 * (1.06 - 0.3 * f.hollow), 0.03, 0.034 * (1.02 - 0.12 * f.hollow)], { k: 0.025 })
    // mandible: ramus up toward the ear, body down to the chin, with wide blends for a clean jawline
    const jw = f.jawW * W
    const gon: V3 = mir([0.047 * jw, -0.074 * L, -0.013], sd)
    s.roundCone(mir([0.05 * jw, -0.022, -0.025], sd), gon, 0.0095, 0.0104, { k: 0.026 })
    s.roundCone(gon, mir([0.018, -0.107 * L, 0.065], sd), 0.0104, 0.0098, { k: 0.026 })
  }
  // chin: the mental protuberance, rounded or squared off
  const ch = f.chin
  s.ellipsoid([0, -0.105 * L, 0.074], [0.019 * ch, 0.016 * ch, 0.016 * ch], { k: 0.018 })
  if (f.chinSq > 0.35) for (const sd of sides) s.sphere(mir([0.0088 * ch, -0.107 * L, 0.0745], sd), 0.0098 * ch * (0.8 + 0.2 * f.chinSq), { k: 0.012 })
  // ---- brow: the glabella and the supraorbital ridges arching back to the temples
  const br = f.brow
  s.ellipsoid([0, 0.014, 0.084], [0.013, 0.0098, 0.0088 * (0.85 + 0.15 * br)], { k: 0.014 })
  for (const sd of sides) s.ellipsoid(mir([0.031 * W, 0.0168, 0.0775], sd), [0.021, 0.0072 * br, 0.0102 * br], { frame: eulerFrame(0, 0.32 * sd, -0.1 * sd), k: 0.014 })
  // ---- eyes: orbital socket, a lid shell hugging the eyeball, the almond opening, then the socket behind it
  // filled just under the eyeball so the lids close cleanly around the eye mesh
  for (const sd of sides) {
    const e = eyeCenter(f, sd)
    const er = EYE_R * f.eyeSize
    // the orbit is deepest under the brow (the upper sulcus) and shallow toward the cheek
    s.ellipsoid([e[0] + 0.001 * sd, e[1] + 0.0038, e[2] + 0.0128], [0.0172, 0.0128, 0.0108], { op: Op.Subtract, k: 0.012 })
    s.sphere(e, er + LID_T, { k: 0.011 })
    if (f.lidFold > 0.2) s.ellipsoid([e[0] + 0.0008 * sd, e[1] + 0.0101, e[2] + 0.0086], [0.0132, 0.0011 + 0.0007 * f.lidFold, 0.0075], { op: Op.Subtract, k: 0.0035 })
    const o = eyeOpening(f, sd)
    s.lens(o.c1, o.r1, o.c2, o.r2, { frame: o.frame, op: Op.Subtract, k: 0.0038 })
    // a small fillet where the lid margins meet the globe keeps the crease clean at voxel scale
    s.sphere(e, er - 0.0006, { k: 0.0022 })
    // tissue behind the eyeball and in the canthi (stops the lens carving slits past the globe)
    s.ellipsoid([e[0], e[1] + 0.0003, e[2] - 0.0035], [0.0158, 0.0108, 0.0118], { k: 0.0015 })
  }
  // ---- nose: dorsum widening to the base, a two-domed tip, alar wings with a crease, columella, nostrils
  const n = noseGeom(f)
  const { nl, nw } = n
  s.roundCone([0, 0.006, 0.0855], [0, -0.03 * nl, n.tip - 0.0045], 0.0052 * f.noseBridge, 0.0064, { k: 0.008 })
  s.ellipsoid([0, -0.025 * nl, 0.0925], [0.0102 * nw, 0.019 * nl, 0.0108], { k: 0.012 })
  // the tip: one lobule with two faint domes (the lower lateral cartilages) and the infratip below
  s.ellipsoid([0, -0.0362 * nl, n.tip - 0.0062], [0.0084 * nw, 0.0072, 0.0062], { k: 0.0075 })
  for (const sd of sides) s.sphere(mir([0.0034 * nw, -0.0352 * nl, n.tip - 0.0058], sd), 0.0052, { k: 0.006 })
  s.ellipsoid([0, -0.0412 * nl, n.tip - 0.0078], [0.0074 * nw, 0.0052, 0.0066], { k: 0.007 })
  // alar wings sweep from the side of the tip back to where they join the cheek
  for (const sd of sides) s.roundCone(mir([0.0085 * nw, -0.041 * nl, n.tip - 0.0088], sd), mir([0.0155 * nw, -0.0447 * nl, n.base - 0.0062], sd), 0.004, 0.0048 * (0.9 + 0.1 * nw), { k: 0.0055 })
  s.roundCone([0, -0.0418 * nl, n.tip - 0.0085], [0, n.sub, n.base + 0.0004], 0.0028, 0.0025, { k: 0.0035 })
  // nostrils open downward under the tip, hidden from the front by the wings and columella
  for (const sd of sides) s.ellipsoid(mir([0.0066 * nw, -0.0492 * nl, n.base - 0.0012], sd), [0.0034 * nw, 0.0019, 0.0042], { frame: eulerFrame(0.2, 0.45 * sd, 0), op: Op.Subtract, k: 0.0016 })
  // ---- lips: upper vermilion with a cupid's bow and philtral columns, a fuller lower lip rolling into the
  // mentolabial sulcus, the line between them and the corners of the mouth
  const lf = f.lipFull
  const lw = f.lipW
  const my = mouthY(f)
  // the lips and the skin of the upper lip are deep ellipsoids, so their fronts wrap around the dental arch
  // instead of ending in slabs at the corners
  const vTop = my + 0.0098 * lf
  s.ellipsoid([0, (n.sub + vTop) / 2, 0.0768], [0.021 * lw, (vTop - n.sub) / -2 + 0.0015, 0.0185], { frame: eulerFrame(-0.28, 0, 0), k: 0.011 })
  s.ellipsoid([0, my + 0.0048, 0.0815], [0.0232 * lw, 0.0052 * lf, 0.0185], { frame: eulerFrame(-0.3, 0, 0), k: 0.009 })
  // (the cupid's bow and philtrum are painted: as sculpt they are below the mesh resolution)
  s.ellipsoid([0, my - 0.0058, 0.0835], [0.0205 * lw, 0.0064 * lf, 0.016 * (0.9 + 0.1 * lf)], { frame: eulerFrame(0.25, 0, 0), k: 0.009 })
  s.ellipsoid([0, my - 0.0185 * (0.9 + 0.1 * lf), 0.094], [0.015, 0.004, 0.0056], { op: Op.Subtract, k: 0.0075 })
  // the parting of the lips: a shallow groove the mesh can resolve (the painted line darkens it)
  s.ellipsoid([0, my, 0.0985], [0.0246 * lw, 0.0015, 0.0065], { op: Op.Subtract, k: 0.0042 })
  // (the nasolabial fold comes from the cheek pad meeting the muzzle, plus occlusion and paint)
  return s.build(0.012)
}

// ---------------------------------------------------------------- face mesh
/** The face region (in front of the ears, below the hairline) is meshed with surface nets. */
export const FACE_CUT = { z: -0.012, top: 0.05 }

/** >= 0 inside the face region; grows inward (metres). */
export function faceKeep(x: number, y: number, z: number) {
  void x
  return Math.min(z - FACE_CUT.z, FACE_CUT.top - y)
}

/**
 * The face texture is a zoomed window of the head's equirectangular layout (so it is painted by the same
 * angle-based functions and matches the scalp texture at the seam), with texels concentrated toward the
 * centre of the face.
 */
export const FACE_WIN = { thetaMax: 1.8, phi0: 0.95, phi1: 2.85 }
const WARP_A = 1.35
const WARP_B = 0.35

/** Face-window texture coordinate (unclamped; the warp is monotonic a little past the window edge). */
export function faceUv(theta: number, phi: number): [number, number] {
  const t = Math.max(-1.1, Math.min(1.1, theta / FACE_WIN.thetaMax))
  return [0.5 + 0.5 * (WARP_A * t - WARP_B * t * t * t), 1 - (phi - FACE_WIN.phi0) / (FACE_WIN.phi1 - FACE_WIN.phi0)]
}

export function faceUvInverse(u: number, v: number): [number, number] {
  const sv = 2 * u - 1
  let t = sv / WARP_A
  for (let i = 0; i < 6; i++) t -= (WARP_A * t - WARP_B * t * t * t - sv) / (WARP_A - 3 * WARP_B * t * t)
  return [t * FACE_WIN.thetaMax, FACE_WIN.phi0 + (1 - v) * (FACE_WIN.phi1 - FACE_WIN.phi0)]
}

/** Texels per radian of azimuth at the centre of the face texture, for sizing painted strokes. */
export function facePxPerRad(width: number) {
  return (width * 0.5 * WARP_A) / FACE_WIN.thetaMax
}

export interface FaceMesh extends MeshData {
  /** face-window UVs */
  uvs: Float32Array
}

/**
 * Surface nets over the face region (2.1 mm voxels at LOD0, 3 mm at LOD1), clipped to it and simplified
 * (11k / 4.5k triangles) so the density stays on the lids, nose and lips. Normals come from the field.
 */
export function meshFace(sdf: Sdf, lod = 0): FaceMesh {
  const h = lod ? 0.003 : 0.0021
  const raw = surfaceNets(sdf, [-0.086, -0.152, FACE_CUT.z - 2 * h], [0.086, FACE_CUT.top + 2 * h, 0.132], h)
  const m = simplify(clipMesh(raw, faceKeep), lod ? 4500 : 11000)
  const vc = m.positions.length / 3
  const uvs = new Float32Array(vc * 2)
  const g: V3 = [0, 0, 0]
  for (let i = 0; i < vc; i++) {
    let x = m.positions[i * 3], y = m.positions[i * 3 + 1], z = m.positions[i * 3 + 2]
    // collapsed vertices sit a little off the surface, where the blended field's gradient turns: put them
    // back on the zero set, then take a normal at the scale of the mesh (finer detail is not in the mesh)
    for (let k = 0; k < 3; k++) {
      const d = sdf.eval(x, y, z)
      if (Math.abs(d) < 2e-6) break
      tetraGradient(sdf, x, y, z, 0.0004, g)
      const g2 = g[0] * g[0] + g[1] * g[1] + g[2] * g[2]
      if (g2 < 1e-6) break
      const st = Math.max(-h * 0.5, Math.min(h * 0.5, d / g2))
      x -= g[0] * st
      y -= g[1] * st
      z -= g[2] * st
    }
    m.positions[i * 3] = x
    m.positions[i * 3 + 1] = y
    m.positions[i * 3 + 2] = z
    tetraGradient(sdf, x, y, z, 0.0013, g)
    const gl = Math.hypot(g[0], g[1], g[2]) || 1
    m.normals[i * 3] = g[0] / gl
    m.normals[i * 3 + 1] = g[1] / gl
    m.normals[i * 3 + 2] = g[2] / gl
    const r = Math.hypot(x, y, z) || 1
    const [u, v] = faceUv(Math.atan2(x, z), Math.acos(Math.max(-1, Math.min(1, y / r))))
    uvs[i * 2] = Math.max(0, Math.min(1, u))
    uvs[i * 2 + 1] = Math.max(0, Math.min(1, v))
  }
  return { positions: m.positions, normals: m.normals, indices: m.indices, uvs }
}

/** The front surface point at (x, y): traced along -z from in front of the face. */
export function frontPoint(sdf: Sdf, x: number, y: number): V3 {
  let z = 0.16
  for (let i = 0; i < 80; i++) {
    const d = sdf.eval(x, y, z)
    if (d < 2e-5) break
    z -= Math.max(0.0002, Math.min(0.006, d * 0.9))
    if (z < -0.05) break
  }
  return [x, y, z]
}

export interface HeadMesh extends MeshData {
  uvs: Float32Array
}


/**
 * Meshes the head by sphere-tracing rays from the centre outward-in, giving an equirectangular UV layout
 * (u = azimuth, front at 0.5; v = 1 at the crown). Grid spacing is warped to concentrate vertices on the face.
 */
export function meshHead(f: FaceParams, lod = 0, sdfIn?: Sdf): HeadMesh {
  const NT = lod ? 64 : 92
  const NP = lod ? 46 : 68
  const sdf = sdfIn ?? headSdf(f)
  const cols = NT + 1
  const rows = NP + 1
  const P = new Float32Array(cols * rows * 3)
  const N = new Float32Array(cols * rows * 3)
  const UV = new Float32Array(cols * rows * 2)
  const g: V3 = [0, 0, 0]
  const thetaOf = (t: number) => {
    const x = t * 2 - 1
    return Math.PI * Math.sign(x) * Math.pow(Math.abs(x), 1.32)
  }
  const phiOf = (t: number) => Math.PI * (t + (0.42 * Math.sin(2 * Math.PI * (t - 0.06))) / (2 * Math.PI) + 0.0)
  const rowPrev = new Float32Array(cols).fill(0.17)
  for (let j = 0; j < rows; j++) {
    const phi = Math.min(Math.PI - 1e-4, Math.max(1e-4, phiOf(j / NP)))
    let left = 0.17
    for (let i = 0; i < cols; i++) {
      const th = thetaOf(i / NT)
      const d: V3 = [Math.sin(phi) * Math.sin(th), Math.cos(phi), Math.sin(phi) * Math.cos(th)]
      // sphere trace inward, starting just outside the neighbouring rays' hits
      let r = Math.min(0.17, Math.max(left, rowPrev[i]) + 0.014)
      let dv = sdf.eval(d[0] * r, d[1] * r, d[2] * r)
      while (dv < 0.002 && r < 0.17) {
        r = Math.min(0.17, r + 0.012)
        dv = sdf.eval(d[0] * r, d[1] * r, d[2] * r)
      }
      let prev = r
      for (let it = 0; it < 90 && dv > 1e-5; it++) {
        prev = r
        r -= Math.min(0.008, Math.max(dv * 0.9, 0.0004))
        if (r < 0.01) break
        dv = sdf.eval(d[0] * r, d[1] * r, d[2] * r)
      }
      if (dv < 0) {
        let lo = r, hi = prev
        for (let b = 0; b < 9; b++) {
          const mid = (lo + hi) / 2
          if (sdf.eval(d[0] * mid, d[1] * mid, d[2] * mid) < 0) lo = mid
          else hi = mid
        }
        r = (lo + hi) / 2
      }
      left = r
      rowPrev[i] = r
      const o = (j * cols + i) * 3
      P[o] = d[0] * r
      P[o + 1] = d[1] * r
      P[o + 2] = d[2] * r
      tetraGradient(sdf, P[o], P[o + 1], P[o + 2], 0.0008, g)
      const n = v3.norm(g)
      N[o] = n[0]
      N[o + 1] = n[1]
      N[o + 2] = n[2]
      UV[(j * cols + i) * 2] = th / (2 * Math.PI) + 0.5
      UV[(j * cols + i) * 2 + 1] = 1 - phi / Math.PI
    }
  }
  const idx: number[] = []
  for (let j = 0; j < NP; j++)
    for (let i = 0; i < NT; i++) {
      const a = j * cols + i
      const b = a + 1
      const c = a + cols
      const d = c + 1
      idx.push(a, c, b, b, c, d)
    }
  return { positions: P, normals: N, uvs: UV, indices: new Uint32Array(idx) }
}

/** Left ear in head space (metres), meshed once and shared. */
let earCache: MeshData | null = null
export function earMesh(): MeshData {
  if (earCache) return earCache
  const s = new Sdf()
  // outer shell, tilted back
  const rim: V3[] = [
    [0.0, 0.026, 0.004],
    [0.0, 0.031, -0.006],
    [0.0, 0.026, -0.016],
    [0.0, 0.012, -0.021],
    [0.0, -0.004, -0.019],
    [0.0, -0.016, -0.012],
  ]
  s.ellipsoid([-0.004, 0.006, -0.006], [0.006, 0.029, 0.017], { k: 0 })
  for (let i = 0; i + 1 < rim.length; i++) s.roundCone(v3.add(rim[i], [0.003, 0, 0]), v3.add(rim[i + 1], [0.003, 0, 0]), 0.0034, 0.0034, { k: 0.003 })
  // lobe
  s.ellipsoid([0.001, -0.018, -0.006], [0.0045, 0.0085, 0.0075], { k: 0.004 })
  // concha bowl and tragus
  s.sphere([0.0058, 0.0, -0.004], 0.0085, { op: Op.Subtract, k: 0.003 })
  s.ellipsoid([0.002, -0.002, 0.0055], [0.003, 0.005, 0.003], { k: 0.003 })
  s.build(0.006)
  const b = s.bounds()
  const h = 0.0021
  earCache = surfaceNets(s, [b.min[0] - 2 * h, b.min[1] - 2 * h, b.min[2] - 2 * h], [b.max[0] + 2 * h, b.max[1] + 2 * h, b.max[2] + 2 * h], h)
  return earCache
}

/** Where the left ear attaches (head space, metres). */
export function earAnchor(f: FaceParams): V3 {
  return [0.0695 * f.headW, 0.0, -0.008]
}
