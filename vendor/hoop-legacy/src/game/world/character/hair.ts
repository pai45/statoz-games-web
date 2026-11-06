import * as THREE from 'three'
import type { HairStyle } from '../../types'
import { mulberry32 } from '../../../data/rng'
import { hairlinePhi, scalpStyle } from './faceTexture'
import type { HeadMesh } from './head'
import { Op, Sdf, surfaceNets, tetraGradient, v3, type V3 } from './sdf'

/** Hair geometry in head space (metres), with per-vertex shell layer + occlusion. */
export interface HairPart {
  positions: Float32Array
  normals: Float32Array
  uvs: Float32Array
  indices: Uint32Array
  shell: Float32Array
  ao: Float32Array
  kind: 'shell' | 'strand'
}

class PartBuilder {
  p: number[] = []
  n: number[] = []
  uv: number[] = []
  sh: number[] = []
  ao: number[] = []
  idx: number[] = []
  vert(p: V3, n: V3, u: number, v: number, shell: number, ao: number) {
    this.p.push(p[0], p[1], p[2])
    this.n.push(n[0], n[1], n[2])
    this.uv.push(u, v)
    this.sh.push(shell)
    this.ao.push(ao)
    return this.p.length / 3 - 1
  }
  get count() {
    return this.p.length / 3
  }
  done(kind: HairPart['kind']): HairPart {
    return {
      positions: new Float32Array(this.p),
      normals: new Float32Array(this.n),
      uvs: new Float32Array(this.uv),
      indices: new Uint32Array(this.idx),
      shell: new Float32Array(this.sh),
      ao: new Float32Array(this.ao),
      kind,
    }
  }
}

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

/** Point + normal on the scalp along a direction from the head centre. */
function scalpAt(sdf: Sdf, d: V3): { p: V3; n: V3 } {
  let r = 0.17
  let prev = r
  let dv = sdf.eval(d[0] * r, d[1] * r, d[2] * r)
  for (let it = 0; it < 90 && dv > 1e-5; it++) {
    prev = r
    r -= Math.min(0.008, Math.max(dv * 0.9, 0.0004))
    if (r < 0.01) break
    dv = sdf.eval(d[0] * r, d[1] * r, d[2] * r)
  }
  if (dv < 0) {
    let lo = r, hi = prev
    for (let b = 0; b < 10; b++) {
      const mid = (lo + hi) / 2
      if (sdf.eval(d[0] * mid, d[1] * mid, d[2] * mid) < 0) lo = mid
      else hi = mid
    }
    r = (lo + hi) / 2
  }
  const p: V3 = [d[0] * r, d[1] * r, d[2] * r]
  const g: V3 = [0, 0, 0]
  tetraGradient(sdf, p[0], p[1], p[2], 0.001, g)
  return { p, n: v3.norm(g) }
}

const dirTP = (theta: number, phi: number): V3 => [Math.sin(phi) * Math.sin(theta), Math.cos(phi), Math.sin(phi) * Math.cos(theta)]

/** Layered shells over the head grid where `thick(theta, phiN)` > 0 (short cuts with some volume). */
function scalpShells(head: HeadMesh, thick: (theta: number, phiN: number) => number, layers: number, uvScale: [number, number]): HairPart | null {
  const b = new PartBuilder()
  const vc = head.positions.length / 3
  const t = new Float32Array(vc)
  for (let i = 0; i < vc; i++) {
    const theta = (head.uvs[i * 2] - 0.5) * Math.PI * 2
    const phiN = 1 - head.uvs[i * 2 + 1]
    t[i] = thick(theta, phiN)
  }
  const tris: number[] = []
  for (let k = 0; k < head.indices.length; k += 3) {
    const a = head.indices[k], c = head.indices[k + 1], d = head.indices[k + 2]
    if (Math.max(t[a], t[c], t[d]) > 0.0009) tris.push(a, c, d)
  }
  if (!tris.length) return null
  const tmax = Math.max(...Array.from(t))
  for (let l = 0; l < layers; l++) {
    const f = (l + 1) / layers
    const remap = new Map<number, number>()
    for (const v of tris) {
      let id = remap.get(v)
      if (id === undefined) {
        const n: V3 = [head.normals[v * 3], head.normals[v * 3 + 1], head.normals[v * 3 + 2]]
        const off = 0.0007 + t[v] * f
        const p: V3 = [head.positions[v * 3] + n[0] * off, head.positions[v * 3 + 1] + n[1] * off, head.positions[v * 3 + 2] + n[2] * off]
        const edge = 1 - smooth(0, Math.max(0.001, tmax * 0.35), t[v])
        id = b.vert(p, n, head.uvs[v * 2] * uvScale[0], head.uvs[v * 2 + 1] * uvScale[1], Math.min(1, Math.max(f * 0.9, edge)), 0.55 + 0.45 * f)
        remap.set(v, id)
      }
      b.idx.push(id)
    }
  }
  return b.done('shell')
}

/** Fur shells around an SDF hair volume. */
function volumeShells(sdf: Sdf, h: number, layers: number, depth: number, uvScale: [number, number]): HairPart {
  const bb = sdf.bounds()
  const m = surfaceNets(sdf, [bb.min[0] - 2 * h, bb.min[1] - 2 * h, bb.min[2] - 2 * h], [bb.max[0] + 2 * h, bb.max[1] + 2 * h, bb.max[2] + 2 * h], h)
  const b = new PartBuilder()
  const vc = m.positions.length / 3
  for (let l = 0; l <= layers; l++) {
    const f = l / layers
    const base = b.count
    for (let i = 0; i < vc; i++) {
      const p: V3 = [m.positions[i * 3], m.positions[i * 3 + 1], m.positions[i * 3 + 2]]
      const n: V3 = [m.normals[i * 3], m.normals[i * 3 + 1], m.normals[i * 3 + 2]]
      const theta = Math.atan2(p[0], p[2])
      const phi = Math.acos(Math.max(-1, Math.min(1, p[1] / (v3.len(p) || 1))))
      const off = depth * f
      b.vert(v3.madd(p, n, off), n, (theta / (Math.PI * 2) + 0.5) * uvScale[0], (1 - phi / Math.PI) * uvScale[1], l === 0 ? 0 : 0.12 + 0.88 * f, 0.62 + 0.38 * f)
    }
    for (let k = 0; k < m.indices.length; k++) b.idx.push(m.indices[k] + base)
  }
  return b.done('shell')
}

/** Swept tube along a polyline with parallel-transport frames. */
function tube(b: PartBuilder, path: V3[], radius: (t: number) => number, sides: number, vScale: number, rootAo = 0.45) {
  const n = path.length
  let len = 0
  const acc: number[] = [0]
  for (let i = 1; i < n; i++) {
    len += v3.len(v3.sub(path[i], path[i - 1]))
    acc.push(len)
  }
  let tan = v3.norm(v3.sub(path[1], path[0]))
  let nrm = v3.norm(v3.cross(tan, Math.abs(tan[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0]))
  const base = b.count
  for (let i = 0; i < n; i++) {
    const nt = i < n - 1 ? v3.norm(v3.sub(path[i + 1], path[i])) : tan
    const tt = i === 0 ? nt : v3.norm(v3.add(tan, nt))
    // transport the normal
    nrm = v3.norm(v3.sub(nrm, v3.scale(tt, v3.dot(nrm, tt))))
    const bin = v3.cross(tt, nrm)
    tan = nt
    const t = acc[i] / (len || 1)
    const r = radius(t)
    for (let s = 0; s <= sides; s++) {
      const a = (s / sides) * Math.PI * 2
      const dir: V3 = v3.add(v3.scale(nrm, Math.cos(a)), v3.scale(bin, Math.sin(a)))
      b.vert(v3.madd(path[i], dir, r), dir, s / sides, acc[i] * vScale, 0, rootAo + (1 - rootAo) * smooth(0, 0.35, t))
    }
  }
  for (let i = 0; i < n - 1; i++)
    for (let s = 0; s < sides; s++) {
      const a = base + i * (sides + 1) + s
      const c = a + sides + 1
      b.idx.push(a, c, a + 1, a + 1, c, c + 1)
    }
  // tip cap
  const tip = b.vert(v3.madd(path[n - 1], tan, radius(1) * 0.8), tan, 0.5, len * vScale, 0, 1)
  const last = base + (n - 1) * (sides + 1)
  for (let s = 0; s < sides; s++) b.idx.push(last + s, tip, last + s + 1)
}

export function buildHair(style: HairStyle, headSdfField: Sdf, head: HeadMesh, seed: number, lod = 0): HairPart[] {
  const L = (n: number) => (lod ? Math.max(1, Math.ceil(n / 2)) : n)
  const rng = mulberry32(seed ^ 0x1234567)
  const sc = scalpStyle(style)
  const parts: HairPart[] = []
  const cover = (theta: number, phiN: number, soft = 0.012) => smooth(hairlinePhi(theta, sc.hairlineShift) + soft, hairlinePhi(theta, sc.hairlineShift) - soft, phiN)
  switch (style) {
    case 'fade':
    case 'hightop': {
      if (style === 'fade') {
        const top = scalpShells(head, (th, ph) => 0.01 * cover(th, ph, 0.02) * smooth(0.4, 0.3, ph) * (0.75 + 0.25 * smooth(0.3, 0.12, ph)), L(4), [90, 45])
        if (top) parts.push(top)
        break
      }
      const s = new Sdf()
      s.ellipsoid([0, 0.02, -0.012], [0.078, 0.095, 0.102], { k: 0 })
      // flat-topped high-top, slightly taller at the front
      s.box([0, 0.088, 0.0], [0.068, 0.058, 0.084], { round: 0.034, frame: { x: [1, 0, 0], y: [0, 0.985, 0.17], z: [0, -0.17, 0.985] }, k: 0.035 })
      s.box([0, -0.062, 0.06], [0.2, 0.093, 0.2], { op: Op.Subtract, k: 0.02 })
      s.ellipsoid([0, -0.012, 0.07], [0.09, 0.07, 0.06], { op: Op.Subtract, k: 0.02 })
      s.build(0.02)
      parts.push(volumeShells(s, lod ? 0.012 : 0.0085, L(5), 0.008, [30, 15]))
      break
    }
    case 'waves': {
      const sh = scalpShells(head, (th, ph) => 0.0042 * cover(th, ph, 0.01) * (1 - smooth(0.42, 1.0, Math.abs(th)) * smooth(0.43, 0.56, ph)), L(2), [60, 30])
      if (sh) parts.push(sh)
      break
    }
    case 'buzz': {
      const sh = scalpShells(head, (th, ph) => 0.0018 * cover(th, ph, 0.015), 1, [110, 55])
      if (sh) parts.push(sh)
      break
    }
    case 'afro': {
      const s = new Sdf()
      s.ellipsoid([0, 0.04, -0.018], [0.118, 0.114, 0.126], { k: 0 })
      s.ellipsoid([0, -0.008, -0.03], [0.098, 0.098, 0.108], { k: 0.04 })
      // keep the face, ears and neck clear while meeting the hairline at the forehead
      s.ellipsoid([0, -0.052, 0.098], [0.078, 0.082, 0.07], { op: Op.Subtract, k: 0.022 })
      s.box([0, -0.128, 0.0], [0.2, 0.07, 0.2], { op: Op.Subtract, k: 0.03 })
      s.build(0.02)
      parts.push(volumeShells(s, lod ? 0.013 : 0.0095, L(5), 0.014, [26, 13]))
      break
    }
    case 'twists': {
      const b = new PartBuilder()
      const count = 84
      for (let i = 0; i < count; i++) {
        // even-ish coverage of the crown via a golden-angle spiral
        const k = (i + 0.5) / count
        const phiN = 0.04 + Math.sqrt(k) * 0.3
        const theta = i * 2.39996 + (rng() - 0.5) * 0.3
        if (phiN > hairlinePhi(theta) - 0.02) continue
        const { p, n } = scalpAt(headSdfField, dirTP(theta, phiN * Math.PI))
        const len = 0.055 + rng() * 0.035
        const out: V3 = v3.norm(v3.add(n, [0, 0.9, 0]))
        const path: V3[] = []
        let q = v3.madd(p, n, -0.002)
        let d = out
        const curl = (rng() - 0.5) * 0.5
        for (let sgm = 0; sgm <= 6; sgm++) {
          path.push(q)
          const away = v3.norm([q[0], 0, q[2] + 0.01])
          d = v3.norm(v3.add(v3.add(d, [0, -0.2 - 0.05 * sgm, 0]), v3.add(v3.scale(away, 0.12), [curl * 0.1, 0, 0])))
          q = v3.madd(q, d, len / 6)
        }
        tube(b, path, (t) => 0.0062 * (1 - 0.3 * t), 6, 24)
      }
      parts.push(b.done('strand'))
      break
    }
    case 'locs': {
      const b = new PartBuilder()
      const count = 64
      const gr: V3 = [0, 0, 0]
      const clearance = 0.0064
      for (let i = 0; i < count; i++) {
        const k = (i + 0.5) / count
        const phiN = 0.05 + Math.sqrt(k) * 0.5
        const theta = i * 2.39996 + (rng() - 0.5) * 0.25
        const line = hairlinePhi(theta)
        if (phiN > line - 0.015) continue
        const at = Math.abs(theta)
        if (at < 0.55 && phiN > 0.14) continue
        const { p, n } = scalpAt(headSdfField, dirTP(theta, phiN * Math.PI))
        const len = 0.16 + rng() * 0.07 - (at < 1.2 ? 0.045 : 0)
        const path: V3[] = []
        let q = v3.madd(p, n, -0.002)
        // front locs are pushed back over the crown and out to the side before they fall, so the face
        // stays clear (they lie along the scalp thanks to the collision below)
        const front = at < 1.3
        const sx = Math.sign(theta || 1)
        let d = front ? v3.norm(v3.add(v3.scale(n, 0.3), [sx * 0.35, 0.05, -0.9])) : n
        const steps = 12
        for (let sgm = 0; sgm <= steps; sgm++) {
          path.push(q)
          // heavy locs: they leave the scalp for a moment, then gravity takes over (front ones first
          // travel back and outward over the head)
          const pull: V3 = front && sgm < 5 ? [sx * 0.25, -0.25, -0.7] : [0, -0.9, 0]
          d = v3.norm(v3.add(v3.scale(d, 0.45), pull))
          q = v3.madd(q, d, len / steps)
          // drape over the head instead of passing through it: project out and lose the inward motion
          const dist = tetraGradient(headSdfField, q[0], q[1], q[2], 0.002, gr)
          if (dist < clearance) {
            const nn = v3.norm(gr)
            q = v3.madd(q, nn, clearance - dist)
            const into = v3.dot(d, nn)
            if (into < 0) d = v3.norm(v3.sub(d, v3.scale(nn, into)))
          }
          // below the skull, hang outside the neck
          const r = Math.hypot(q[0], q[2] + 0.012)
          if (q[1] < 0.0 && r < 0.092) {
            const push = 0.092 / r
            q = [q[0] * push, q[1], (q[2] + 0.012) * push - 0.012]
          }
          // keep strands out of the face: push back behind the cheek line, never sideways across it
          if (q[2] > 0.0 && Math.abs(q[0]) < 0.088 && q[1] < 0.06) {
            q = [q[0], q[1], Math.min(q[2], 0.0) - 0.002]
            if (d[2] > 0) d = v3.norm([d[0], d[1], -0.2])
          }
        }
        tube(b, path, (t) => 0.0058 * (1 - 0.15 * t), 6, 30)
      }
      parts.push(b.done('strand'))
      break
    }
    case 'braids': {
      const b = new PartBuilder()
      const rows = 11
      for (let i = 0; i < rows; i++) {
        const xr = (i / (rows - 1) - 0.5) * 2.7
        const path: V3[] = []
        const start = (0.6 - Math.abs(xr) * 0.12) * Math.PI * 0.5
        const end = Math.PI * (1.2 - Math.abs(xr) * 0.05)
        for (let sgm = 0; sgm <= 40; sgm++) {
          const psi = start + (sgm / 40) * (end - start)
          const d = v3.norm([xr * 0.6 * Math.max(0.35, Math.sin(psi)), Math.sin(psi), Math.cos(psi)])
          const { p, n } = scalpAt(headSdfField, d)
          path.push(v3.madd(p, n, 0.0028))
        }
        tube(b, path, () => 0.0048, 6, 34, 0.7)
      }
      parts.push(b.done('strand'))
      break
    }
    case 'bun': {
      const sh = scalpShells(head, (th, ph) => 0.0032 * cover(th, ph, 0.012), L(2), [80, 40])
      if (sh) parts.push(sh)
      const b = new PartBuilder()
      // twisted knot: a short coiled tube
      const c: V3 = [0, 0.092, -0.07]
      const path: V3[] = []
      for (let sgm = 0; sgm <= 36; sgm++) {
        const a = (sgm / 36) * Math.PI * 4.2
        const rr = 0.024 - sgm * 0.00045
        path.push([c[0] + Math.cos(a) * rr, c[1] + 0.012 - sgm * 0.0007, c[2] + Math.sin(a) * rr - 0.004])
      }
      tube(b, path, (t) => 0.013 * (1 - 0.35 * t), 8, 22, 0.6)
      parts.push(b.done('strand'))
      break
    }
  }
  return parts
}

function tex(c: HTMLCanvasElement) {
  const t = new THREE.CanvasTexture(c)
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  return t
}

let noiseTex: THREE.CanvasTexture | null = null
/** R: strand-tip mask for shells (dense clusters), G: brightness variation. */
export function hairNoiseTexture() {
  if (noiseTex) return noiseTex
  const S = 128
  const c = document.createElement('canvas')
  c.width = S
  c.height = S
  const ctx = c.getContext('2d')!
  const img = ctx.createImageData(S, S)
  const r = mulberry32(99)
  const field = new Float32Array(S * S)
  for (let i = 0; i < 260; i++) {
    const cx = r() * S, cy = r() * S, rad = 2 + r() * 3.5, v = 0.55 + r() * 0.45
    for (let y = -6; y <= 6; y++)
      for (let x = -6; x <= 6; x++) {
        const d = Math.hypot(x, y) / rad
        if (d >= 1) continue
        const px = (Math.floor(cx + x) + S) % S, py = (Math.floor(cy + y) + S) % S
        field[py * S + px] = Math.max(field[py * S + px], v * (1 - d * d))
      }
  }
  for (let i = 0; i < S * S; i++) {
    img.data[i * 4] = Math.round(field[i] * 255)
    img.data[i * 4 + 1] = Math.round((0.35 + 0.65 * r()) * 255)
    img.data[i * 4 + 2] = 0
    img.data[i * 4 + 3] = 255
  }
  ctx.putImageData(img, 0, 0)
  noiseTex = tex(c)
  return noiseTex
}

let strandTex: THREE.CanvasTexture | null = null
/** G: helical twist pattern for strand tubes (u around, v along). */
export function hairStrandTexture() {
  if (strandTex) return strandTex
  const S = 64
  const c = document.createElement('canvas')
  c.width = S
  c.height = S
  const ctx = c.getContext('2d')!
  const img = ctx.createImageData(S, S)
  const r = mulberry32(7)
  for (let y = 0; y < S; y++)
    for (let x = 0; x < S; x++) {
      const u = x / S, v = y / S
      const helix = 0.5 + 0.5 * Math.sin((u * 2 + v * 2) * Math.PI * 2)
      const fiber = 0.75 + 0.25 * Math.sin(u * Math.PI * 2 * 9 + r() * 0.6)
      const g = 0.25 + 0.75 * helix * fiber
      const o = (y * S + x) * 4
      img.data[o] = 255
      img.data[o + 1] = Math.round(g * 255)
      img.data[o + 2] = 0
      img.data[o + 3] = 255
    }
  ctx.putImageData(img, 0, 0)
  strandTex = tex(c)
  return strandTex
}
