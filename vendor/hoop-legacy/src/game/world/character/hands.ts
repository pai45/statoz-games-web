import { Sdf, surfaceNets, v3, type MeshData, type V3 } from './sdf'

/** Rodrigues rotation of v around unit axis k by angle a. */
function rot(v: V3, k: V3, a: number): V3 {
  const c = Math.cos(a), s = Math.sin(a)
  const kv = v3.cross(k, v)
  const kd = v3.dot(k, v) * (1 - c)
  return [v[0] * c + kv[0] * s + k[0] * kd, v[1] * c + kv[1] * s + k[1] * kd, v[2] * c + kv[2] * s + k[2] * kd]
}

/**
 * Left hand in the hand-bone frame (normalized units): fingers point down -Y, the palm faces -X (toward
 * the body when the arm hangs), the thumb points forward +Z. Relaxed, slightly cupped "ready" pose.
 */
export function handSdf(): Sdf {
  const s = new Sdf()
  const palmN: V3 = [-1, 0, 0]
  // wrist stub matching the forearm end of the body sculpt
  s.ellipsoid([0, 0.004, 0], [0.0105, 0.018, 0.0158], { k: 0 })
  // palm + heel of the hand
  s.box([0.0005, -0.031, 0.0012], [0.0074, 0.025, 0.02], { round: 0.0068, k: 0.008 })
  s.ellipsoid([-0.003, -0.016, -0.007], [0.0075, 0.016, 0.011], { k: 0.006 })
  // thenar eminence (thumb pad)
  s.ellipsoid([-0.0045, -0.021, 0.013], [0.0078, 0.016, 0.0095], { k: 0.006 })
  const fingers: { z: number; len: [number, number, number]; spread: number; r: number; curl: [number, number, number]; y: number }[] = [
    { z: 0.0148, len: [0.0205, 0.0128, 0.0102], spread: 0.1, r: 0.0043, curl: [0.32, 0.5, 0.3], y: -0.0575 },
    { z: 0.0048, len: [0.0222, 0.0142, 0.0108], spread: 0.0, r: 0.0045, curl: [0.3, 0.52, 0.32], y: -0.059 },
    { z: -0.0055, len: [0.0208, 0.0136, 0.0104], spread: -0.11, r: 0.0042, curl: [0.34, 0.55, 0.33], y: -0.0578 },
    { z: -0.0152, len: [0.0162, 0.0108, 0.0092], spread: -0.24, r: 0.0037, curl: [0.4, 0.58, 0.34], y: -0.0545 },
  ]
  for (const f of fingers) {
    let p: V3 = [0.0005, f.y + 0.004, f.z]
    // knuckle
    s.sphere([0.003, f.y + 0.003, f.z], f.r * 1.08, { k: 0.004 })
    let d: V3 = v3.norm([0, -Math.cos(f.spread), Math.sin(f.spread)])
    let r = f.r
    for (let i = 0; i < 3; i++) {
      const axis = v3.norm(v3.cross(d, palmN))
      d = v3.norm(rot(d, axis, f.curl[i]))
      const q = v3.madd(p, d, f.len[i])
      const r2 = r * (i === 2 ? 0.82 : 0.92)
      s.roundCone(p, q, r, r2, { k: i === 0 ? 0.0045 : 0.0018 })
      p = q
      r = r2
    }
  }
  // thumb: metacarpal + two phalanges, angled forward and across the palm
  let p: V3 = [-0.002, -0.011, 0.016]
  let d: V3 = v3.norm([-0.32, -0.62, 0.72])
  const tl = [0.02, 0.0158, 0.0128]
  const tr = [0.0072, 0.0054, 0.0048]
  const tc = [0.0, 0.28, 0.24]
  for (let i = 0; i < 3; i++) {
    const axis = v3.norm(v3.cross(d, [-0.6, 0, -0.8]))
    d = v3.norm(rot(d, axis, tc[i]))
    const q = v3.madd(p, d, tl[i])
    s.roundCone(p, q, tr[i], i === 2 ? tr[i] * 0.8 : tr[i + 1], { k: i === 0 ? 0.006 : 0.002 })
    p = q
  }
  return s.build(0.01)
}

const handCache: (MeshData | undefined)[] = []

/** Hand mesh; lod 1 is the coarse variant for the low quality tier. */
export function handMesh(lod = 0): MeshData {
  const hit = handCache[lod]
  if (hit) return hit
  const sdf = handSdf()
  const b = sdf.bounds()
  const h = lod ? 0.003 : 0.0021
  const pad = h * 2
  const m = surfaceNets(sdf, [b.min[0] - pad, b.min[1] - pad, b.min[2] - pad], [b.max[0] + pad, b.max[1] + pad, b.max[2] + pad], h)
  handCache[lod] = m
  return m
}
