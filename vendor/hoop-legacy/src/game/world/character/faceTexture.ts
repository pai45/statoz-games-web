import * as THREE from 'three'
import type { FacialHair, HairStyle } from '../../types'
import { mulberry32 } from '../../../data/rng'
import { FACE_WIN, LID_T, eyeCenter, facePxPerRad, faceUv, faceUvInverse, frontPoint, lidCurve, mouthY, noseGeom, type FaceParams } from './head'
import type { Sdf, V3 } from './sdf'

export type { FacialHair }

/** Hairline + fade description in head angles (theta = azimuth, 0 front; phi = polar angle from the crown). */
export interface ScalpStyle {
  /** hair covers the scalp at all */
  covered: boolean
  /** opacity/density of painted hair on the scalp (buzz < fade top) */
  density: number
  /** fade on the sides/back: [phiTop, phiBottom] in units of PI, null = no fade */
  fade: [number, number] | null
  /** concentric 360 waves */
  waves: boolean
  /** combed back toward a bun */
  pulledBack: boolean
  /** sharp line-up at the front */
  lineUp: boolean
  /** hairline lowered/raised (units of PI) */
  hairlineShift: number
}

export function scalpStyle(style: HairStyle): ScalpStyle {
  const base: ScalpStyle = { covered: true, density: 1, fade: null, waves: false, pulledBack: false, lineUp: true, hairlineShift: 0 }
  switch (style) {
    case 'bald':
      return { ...base, covered: false, density: 0, lineUp: false }
    case 'buzz':
      return { ...base, density: 0.62, lineUp: false }
    case 'fade':
      return { ...base, fade: [0.36, 0.5] }
    case 'waves':
      return { ...base, waves: true, fade: [0.43, 0.56] }
    case 'hightop':
      return { ...base, fade: [0.34, 0.47] }
    case 'bun':
      return { ...base, pulledBack: true, lineUp: false, hairlineShift: -0.01 }
    case 'twists':
      return { ...base, fade: [0.4, 0.53] }
    case 'braids':
      return { ...base, density: 0.85 }
    case 'locs':
      return { ...base, lineUp: false }
    case 'afro':
      return { ...base, lineUp: false, hairlineShift: -0.01 }
  }
  return base
}

/** Angular hairline: phi (units of PI) of the hair edge at azimuth theta. */
export function hairlinePhi(theta: number, shift = 0) {
  const a = Math.abs(theta)
  // front (0) -> temple recess (0.55) -> sideburn (1.25) -> over the ear (1.6) -> nape (PI)
  const pts: [number, number][] = [
    [0, 0.286],
    [0.42, 0.283],
    [0.7, 0.268],
    [0.98, 0.31],
    [1.2, 0.47],
    [1.32, 0.5],
    [1.42, 0.42],
    [1.62, 0.37],
    [1.82, 0.43],
    [2.2, 0.56],
    [2.7, 0.615],
    [Math.PI, 0.625],
  ]
  for (let i = 1; i < pts.length; i++) {
    if (a <= pts[i][0]) {
      const [t0, v0] = pts[i - 1]
      const [t1, v1] = pts[i]
      const k = (a - t0) / (t1 - t0)
      const s = k * k * (3 - 2 * k)
      return v0 + (v1 - v0) * s + shift
    }
  }
  return 0.625 + shift
}

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

function hexRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16)
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]
}

function lum(c: [number, number, number]) {
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]
}

/** Value noise on a wrapped grid, sampled in (u, v) in [0,1]. */
function makeNoise(seed: number, gw: number, gh: number) {
  const r = mulberry32(seed)
  const g = new Float32Array(gw * gh)
  for (let i = 0; i < g.length; i++) g[i] = r()
  return (u: number, v: number) => {
    const x = (((u % 1) + 1) % 1) * gw
    const y = Math.min(gh - 1.001, Math.max(0, v * (gh - 1)))
    const x0 = Math.floor(x), y0 = Math.floor(y)
    const fx = x - x0, fy = y - y0
    const x1 = (x0 + 1) % gw
    const sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy)
    const a = g[(x0 % gw) + gw * y0], b = g[x1 + gw * y0], c = g[(x0 % gw) + gw * (y0 + 1)], d = g[x1 + gw * (y0 + 1)]
    return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy
  }
}

function hash2(x: number, y: number) {
  let h = (Math.imul(x, 374761393) + Math.imul(y, 668265263)) | 0
  h = Math.imul(h ^ (h >>> 13), 1274126177)
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296
}

export function tp(p: V3): [number, number] {
  const r = Math.hypot(p[0], p[1], p[2])
  return [Math.atan2(p[0], p[2]), Math.acos(p[1] / r)]
}

type RGB = [number, number, number]

/**
 * A paint target: a canvas whose texels map separably to head angles (theta = azimuth, 0 at the front;
 * phi = polar angle from the crown).
 */
interface Target {
  w: number
  h: number
  /** field-pass size, upscaled onto the canvas */
  lw: number
  lh: number
  theta(u: number): number
  phi(v: number): number
  px(theta: number, phi: number): [number, number]
  /** canvas texels per radian of azimuth at the centre of the face */
  ppr: number
}

function scalpTarget(W: number): Target {
  const H = W / 2
  const lw = Math.min(W / 2, 512)
  return {
    w: W,
    h: H,
    lw,
    lh: lw / 2,
    theta: (u) => (u - 0.5) * Math.PI * 2,
    phi: (v) => (1 - v) * Math.PI,
    px: (t, p) => [(t / (Math.PI * 2) + 0.5) * W, (p / Math.PI) * H],
    ppr: W / (Math.PI * 2),
  }
}

function faceTarget(W: number): Target {
  const H = Math.round(W * 0.625)
  return {
    w: W,
    h: H,
    lw: W / 2,
    lh: Math.round(H / 2),
    theta: (u) => faceUvInverse(u, 0.5)[0],
    phi: (v) => faceUvInverse(0.5, v)[1],
    px: (t, p) => {
      const [u, v] = faceUv(t, p)
      return [u * W, (1 - v) * H]
    },
    ppr: facePxPerRad(W),
  }
}

/** Face-window texel holding the lash colour (an unused corner: behind the temple, above the face cut). */
export const LASH_SWATCH: [number, number] = [0.004, 0.993]

export interface FacePaint {
  /** equirectangular head map (scalp, ears, the cranium around the face) and its roughness */
  scalp: HTMLCanvasElement
  scalpRough: HTMLCanvasElement
  /** zoomed face-window map (see `faceUv`) and its roughness */
  face: HTMLCanvasElement
  faceRough: HTMLCanvasElement
}

function canvas(w: number, h: number) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  return c
}

const css = (c: RGB, a = 1) =>
  `rgba(${Math.round(Math.max(0, Math.min(1, c[0])) * 255)},${Math.round(Math.max(0, Math.min(1, c[1])) * 255)},${Math.round(Math.max(0, Math.min(1, c[2])) * 255)},${a})`
const mul = (c: RGB, r: number, g = r, b = r): RGB => [c[0] * r, c[1] * g, c[2] * b]

/** A polyline in head angles. */
type Poly = [number, number][]
interface Strand {
  t0: number
  p0: number
  t1: number
  p1: number
  shade: number
}

/**
 * Paints the head: one shading function (tone, mottling, flush, periorbital and perioral tone, beard
 * shadow, scalp hair, facial-hair density, roughness) evaluated into the equirect head map and into the
 * zoomed face window so they agree at the face seam, then the facial detail as vector work on the sculpted
 * surface - vermilion, lid creases, lash lines, caruncles, nostrils, brow hairs - and directional beard and
 * stubble strands.
 */
export function paintFace(opts: { skin: string; hair: string; style: HairStyle; facial: FacialHair; face: FaceParams; seed: number; size: number; sdf: Sdf }): FacePaint {
  const skin = hexRgb(opts.skin)
  const hair = hexRgb(opts.hair)
  const sl = lum(skin)
  const hairL = lum(hair)
  const sc = scalpStyle(opts.style)
  const f = opts.face
  const sdf = opts.sdf
  const noise = makeNoise(opts.seed, 48, 24)
  const fine = makeNoise(opts.seed + 7, 160, 80)
  const micro = makeNoise(opts.seed + 11, 640, 320)
  const rng = mulberry32(opts.seed ^ 0xabcdef)
  const facial = opts.facial
  const beardFn = beardMask(facial, f)
  const shadowFn = beardMask('full', f)
  // a clean-shaven face still shows where the beard grows, more so with dark hair
  const shadowAmt = facial === 'clean' ? (0.2 + 0.6 * rng()) * (1 - hairL) : 0
  const eyeA = tp(eyeCenter(f, 1))
  const my = mouthY(f)
  const ng = noseGeom(f)
  const lipA = tp([0, my, 0.098])
  const noseA = tp([0, -0.036 * ng.nl, ng.tip])
  const flushC: RGB = [skin[0] * 1.1 + 0.015, skin[1] * 0.84, skin[2] * 0.82]
  // muted rose-brown vermilion on lighter skin, deeper and cooler on darker skin, a lighter lower lip
  const mix3 = (a: RGB, b: RGB, k: number): RGB => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k]
  const lipTint: RGB = sl > 0.42 ? mix3(mul(skin, 0.8, 0.7, 0.74), [0.6, 0.32, 0.34], 0.35) : mix3(mul(skin, 0.82, 0.66, 0.72), [0.24, 0.12, 0.13], 0.25)
  const lipLow: RGB = sl > 0.42 ? mix3(mul(skin, 0.9, 0.78, 0.8), [0.68, 0.4, 0.42], 0.3) : mix3(mul(skin, 1.04, 0.82, 0.84), [0.42, 0.22, 0.23], 0.25)
  const hairDark = mul(hair, 0.8)
  const lashC: RGB = [Math.min(hair[0], 0.09) * 0.8, Math.min(hair[1], 0.07) * 0.8, Math.min(hair[2], 0.06) * 0.8]
  const browC: RGB = mul(hair, 0.92)

  // ---------------------------------------------------------------- shading function
  const out = [0, 0, 0, 0]
  const shade = (theta: number, phi: number, line: number) => {
    const at = Math.abs(theta)
    const phiN = phi / Math.PI
    const eu = theta / (Math.PI * 2) + 0.5
    const ev = 1 - phiN
    const n = noise(eu, ev)
    const nf = fine(eu, ev)
    const nm = micro(eu, ev) - 0.5
    let r = skin[0] * (0.95 + 0.08 * n + 0.05 * nm)
    let g = skin[1] * (0.95 + 0.07 * n + 0.045 * nm)
    let b = skin[2] * (0.96 + 0.06 * n + 0.04 * nm)
    let ro = 0.53 + 0.08 * (nf - 0.5) + 0.05 * nm - 0.035 * (1 - sl)
    // flush: cheeks, nose, chin and ears (stronger on lighter tones, never absent)
    const dCheek = Math.hypot(at - 0.6, (phi - 1.74) * 1.25)
    const dNose = Math.hypot(theta - noseA[0], (phi - noseA[1]) * 1.1)
    const dChin = Math.hypot(theta, (phi - lipA[1] - 0.3) * 1.2)
    const ear = smooth(1.45, 1.6, at) * smooth(1.9, 1.75, at) * smooth(1.25, 1.45, phi) * smooth(1.95, 1.75, phi)
    const flush = Math.min(1, smooth(0.42, 0.05, dCheek) * 0.55 + smooth(0.2, 0, dNose) * 0.75 + smooth(0.22, 0, dChin) * 0.2 + ear * 0.5) * (0.5 + 0.5 * sl)
    r += (flushC[0] - r) * flush * 0.45
    g += (flushC[1] - g) * flush * 0.45
    b += (flushC[2] - b) * flush * 0.45
    // periorbital tone: the lids and a crescent under the eye run darker and cooler
    const dE = Math.hypot(at - eyeA[0], (phi - eyeA[1]) * 1.2)
    const under = smooth(0.1, 0, Math.hypot((at - eyeA[0]) * 0.75, (phi - eyeA[1] - 0.12) * 2.2))
    const orb = smooth(0.22, 0.06, dE) * (0.08 + 0.1 * (1 - sl)) + under * (0.05 + 0.09 * (1 - sl))
    r *= 1 - orb
    g *= 1 - orb * 1.12
    b *= 1 - orb * 0.88
    // perioral tone on deeper skin
    const peri = smooth(0.3, 0.1, Math.hypot(theta, (phi - lipA[1]) * 1.5)) * (1 - sl) * 0.07
    r *= 1 - peri
    g *= 1 - peri * 1.1
    b *= 1 - peri
    // sheen: forehead, nose and cheekbones are oilier
    ro -= 0.07 * smooth(0.32, 0, at) * smooth(0.27, 0.36, phiN) * smooth(0.6, 0.5, phiN)
    ro -= 0.08 * smooth(0.17, 0, dNose)
    ro -= 0.04 * smooth(0.25, 0.05, Math.hypot(at - 0.6, (phi - 1.6) * 1.4))
    // beard shadow on clean-shaven faces
    if (shadowAmt > 0 && phiN > 0.42 && at < 1.5) {
      const sh = shadowFn(theta, phi) * shadowAmt
      r *= 1 - 0.13 * sh
      g *= 1 - 0.11 * sh
      b *= 1 - 0.07 * sh
    }
    // ---- scalp hair
    if (sc.covered) {
      const edge = sc.lineUp ? 0.006 : 0.016
      let cov = smooth(line + edge, line - edge, phiN)
      if (!sc.lineUp) cov *= 0.75 + 0.25 * smooth(line, line - 0.04, phiN)
      if (sc.fade && at > 0.42) {
        const fk = smooth(sc.fade[1], sc.fade[0], phiN)
        cov *= 1 - smooth(0.42, 1.0, at) * (1 - fk) * 0.97
      }
      if (cov > 0.001) {
        const sp = hash2(Math.floor(eu * 1536), Math.floor(ev * 768))
        let dens = sc.density * (0.82 + 0.18 * sp)
        if (sc.waves) dens *= 0.82 + 0.3 * (0.5 + 0.5 * Math.sin(phiN * 150 + Math.sin(theta * 3) * 0.8))
        if (sc.pulledBack) dens *= 0.85 + 0.2 * (0.5 + 0.5 * Math.sin(theta * 70 + phiN * 6))
        const k = Math.min(1, cov * dens)
        const hc = sc.waves ? hairDark : hair
        r += (hc[0] * (0.85 + 0.25 * sp) - r) * k
        g += (hc[1] * (0.85 + 0.25 * sp) - g) * k
        b += (hc[2] * (0.85 + 0.25 * sp) - b) * k
        ro += (0.78 - ro) * k
      }
    } else if (phiN < 0.42) {
      ro -= 0.12 * smooth(0.42, 0.2, phiN)
    }
    // ---- facial hair density under the strands
    const bm = phiN > 0.42 && at < 1.55 ? beardFn(theta, phi) : 0
    if (bm > 0) {
      const k = Math.min(1, bm) * (facial === 'stubble' ? 1.6 : 0.5)
      r += (hair[0] * 0.85 - r) * k
      g += (hair[1] * 0.85 - g) * k
      b += (hair[2] * 0.85 - b) * k
      ro += (0.8 - ro) * Math.min(1, bm * 1.2)
    }
    out[0] = r
    out[1] = g
    out[2] = b
    out[3] = ro
  }
  const field = (T: Target) => {
    const col = canvas(T.lw, T.lh)
    const rough = canvas(T.lw, T.lh)
    const cctx = col.getContext('2d')!
    const rctx = rough.getContext('2d')!
    const img = cctx.createImageData(T.lw, T.lh)
    const rimg = rctx.createImageData(T.lw, T.lh)
    const th = new Float32Array(T.lw)
    const lines = new Float32Array(T.lw)
    for (let x = 0; x < T.lw; x++) {
      th[x] = T.theta((x + 0.5) / T.lw)
      lines[x] = hairlinePhi(th[x], sc.hairlineShift)
    }
    for (let y = 0; y < T.lh; y++) {
      const ph = T.phi(1 - (y + 0.5) / T.lh)
      for (let x = 0; x < T.lw; x++) {
        shade(th[x], ph, lines[x])
        const o = (y * T.lw + x) * 4
        img.data[o] = Math.max(0, Math.min(255, Math.round(out[0] * 255)))
        img.data[o + 1] = Math.max(0, Math.min(255, Math.round(out[1] * 255)))
        img.data[o + 2] = Math.max(0, Math.min(255, Math.round(out[2] * 255)))
        img.data[o + 3] = 255
        const rv = Math.max(0, Math.min(255, Math.round(out[3] * 255)))
        rimg.data[o] = rv
        rimg.data[o + 1] = rv
        rimg.data[o + 2] = rv
        rimg.data[o + 3] = 255
      }
    }
    cctx.putImageData(img, 0, 0)
    rctx.putImageData(rimg, 0, 0)
    return { col, rough }
  }

  // ---------------------------------------------------------------- facial detail, in head angles
  const fp = (x: number, y: number) => tp(frontPoint(sdf, x, y))
  const lw = f.lipW
  const lf = f.lipFull
  const cornerX = 0.0244 * lw
  const lipN = 14
  const upperBorder: Poly = []
  const lowerBorder: Poly = []
  const mouthLine: Poly = []
  for (let i = 0; i <= lipN * 2; i++) {
    const x = cornerX * (i / lipN - 1)
    const ax = Math.abs(x) / cornerX
    const yU = lf * (0.0083 + 0.0017 * Math.exp(-(((ax - 0.22) / 0.13) ** 2)) - 0.0008 * Math.exp(-((ax / 0.07) ** 2))) * Math.pow(Math.max(0, 1 - ax ** 2.5), 0.6)
    const yL = -lf * 0.0102 * Math.pow(Math.max(0, 1 - ax * ax), 0.7)
    upperBorder.push(fp(x, my + 0.0002 + yU))
    lowerBorder.push(fp(x, my - 0.0004 + yL))
    mouthLine.push(fp(x * 1.02, my - 0.0005 - 0.0008 * ax * ax))
  }
  const lowLipHi: Poly = []
  for (let i = 0; i <= 16; i++) {
    const a = (i / 16) * Math.PI * 2
    lowLipHi.push(fp(Math.cos(a) * 0.01 * lw, my - 0.0064 * lf + Math.sin(a) * 0.0022 * lf))
  }
  const eyes = ([1, -1] as const).map((sd) => {
    const crease = 0.0044 + 0.0018 * f.lidFold
    return {
      upper: lidCurve(f, sd, true, 24).map(tp),
      // the lash line runs over the lid margin itself, between the lid surface and the globe
      lash: lidCurve(f, sd, true, 24, 0, -LID_T * 0.45).map(tp),
      lower: lidCurve(f, sd, false, 24).map(tp),
      crease: lidCurve(f, sd, true, 24, crease, 0.0004).map(tp),
      sd,
    }
  })
  // brows follow the supraorbital rim: a full medial head, an arch two thirds out, a tapering tail
  const brows = ([1, -1] as const).map((sd) => {
    const ex = Math.abs(eyeCenter(f, sd)[0])
    const arch = 0.003 + 0.0045 * f.browArch
    const pts: { x: number; y: number; t: number }[] = []
    for (let i = 0; i <= 16; i++) {
      const t = i / 16
      const x = ex - 0.019 + 0.041 * t
      const y = 0.0128 + 0.0012 * f.brow + arch * Math.sin(Math.PI * Math.min(1, t * 1.3)) - 0.0035 * t * t
      pts.push({ x: x * sd, y, t })
    }
    return { pts, sd }
  })
  const browAt = (b: (typeof brows)[number], t: number) => {
    const k = Math.min(15, Math.floor(t * 16))
    const fr = t * 16 - k
    const a = b.pts[k], c = b.pts[k + 1]
    return { x: a.x + (c.x - a.x) * fr, y: a.y + (c.y - a.y) * fr, dx: c.x - a.x, dy: c.y - a.y }
  }
  // brow hairs as 3D segments, mapped through the surface once
  const browHairs: { a: [number, number]; b: [number, number]; w: number; al: number }[] = []
  for (const b of brows) {
    const thick = 0.0088 * f.browThick
    const n = Math.round(380 * (0.85 + 0.3 * f.browThick))
    for (let i = 0; i < n; i++) {
      // denser toward the head
      const t = Math.pow(rng(), 1.25)
      const c = browAt(b, t)
      const w = thick * (1 - 0.62 * t)
      const across = (rng() - 0.5) * 2
      const len = (0.0042 + 0.003 * rng()) * (1 - 0.3 * t)
      // the head grows upward, the body laterally with upper and lower hairs converging, the tail droops
      const along = Math.atan2(c.dy, Math.abs(c.dx))
      let ang = t < 0.14 ? 1.15 - t * 3 : along - across * 0.32 + (t > 0.8 ? -0.12 : 0.06)
      ang += (rng() - 0.5) * 0.3
      const x0 = c.x + b.sd * across * w * 0.12
      const y0 = c.y + across * w * 0.5
      const x1 = x0 + b.sd * Math.cos(ang) * len
      const y1 = y0 + Math.sin(ang) * len
      const edge = 1 - Math.abs(across)
      browHairs.push({ a: fp(x0, y0), b: fp(x1, y1), w: 0.9 + 0.5 * rng(), al: (0.3 + 0.45 * rng()) * (0.45 + 0.55 * edge) })
    }
  }
  const browFill: Poly[] = brows.map((b) => {
    const top: Poly = []
    const bot: Poly = []
    for (let i = 0; i <= 16; i++) {
      const c = b.pts[i]
      const w = 0.0088 * f.browThick * (1 - 0.62 * c.t)
      top.push(fp(c.x, c.y + w * 0.42))
      bot.push(fp(c.x, c.y - w * 0.42))
    }
    return top.concat(bot.reverse())
  })
  const moles: { a: [number, number]; r: number }[] = []
  const moleCount = Math.floor(rng() * rng() * 4)
  for (let i = 0; i < moleCount; i++) {
    const x = (rng() * 2 - 1) * 0.05
    const y = -0.07 + rng() * 0.11
    if (Math.abs(y) < 0.012 && Math.abs(Math.abs(x) - 0.032) < 0.02) continue
    if (Math.abs(y - my) < 0.016 && Math.abs(x) < 0.03) continue
    if (Math.abs(x) < 0.016 && y > -0.055) continue
    moles.push({ a: fp(x, y), r: 0.0005 + 0.0006 * rng() })
  }

  // ---------------------------------------------------------------- beard and stubble strands
  // the vermilion in head angles (with a small margin), from the border polylines
  const onLips = (theta: number, phi: number) => {
    const t0 = upperBorder[0][0], t1 = upperBorder[upperBorder.length - 1][0]
    if (theta < Math.min(t0, t1) - 0.01 || theta > Math.max(t0, t1) + 0.01) return false
    const k = Math.max(0, Math.min(upperBorder.length - 1.001, ((theta - t0) / (t1 - t0)) * (upperBorder.length - 1)))
    const i = Math.floor(k), fr = k - i
    const pu = upperBorder[i][1] + (upperBorder[i + 1][1] - upperBorder[i][1]) * fr
    const pl = lowerBorder[i][1] + (lowerBorder[i + 1][1] - lowerBorder[i][1]) * fr
    return phi > pu - 0.008 && phi < pl + 0.012
  }
  const strands: Strand[] = []
  if (facial !== 'clean') {
    const stub = facial === 'stubble'
    const peak = stub ? 0.15 : facial === 'goatee' ? 0.95 : 0.85
    const want = stub ? 15000 : facial === 'goatee' ? 4000 : facial === 'full' ? 11500 : 8500
    const lipPhi = lipA[1]
    for (let tries = 0; tries < want * 6 && strands.length < want; tries++) {
      const theta = (rng() * 2 - 1) * 1.55
      const phi = Math.PI * (0.43 + rng() * 0.36)
      const m = beardFn(theta, phi) / peak
      if (m <= 0 || rng() > m) continue
      const at = Math.abs(theta)
      const sg = Math.sign(theta) || 1
      // growth direction (azimuth, polar): down the cheeks toward the chin, outward over the lip
      let dt = -0.25 * sg
      let dp = 1
      if (at < 0.38 && phi < lipPhi) {
        dt = 0.9 * sg
        dp = 0.55
      } else if (at > 1.05) dt = 0
      else if (phi > Math.PI * 0.66) dt = 0.1 * sg
      const jit = (rng() - 0.5) * 0.7
      const ca = Math.cos(jit), sa = Math.sin(jit)
      const l = Math.hypot(dt, dp)
      const ux = (dt * ca - dp * sa) / l
      const uy = (dt * sa + dp * ca) / l
      const must = at < 0.38 && phi < lipPhi
      const len = (stub ? 0.0035 + 0.0045 * rng() : 0.016 + 0.024 * rng()) * (must ? 0.55 : 1)
      const sp = Math.sin(phi) || 1
      const t1 = theta + (ux * len) / sp, p1 = phi + uy * len
      if (onLips(theta, phi) || onLips(t1, p1) || onLips((theta + t1) / 2, (phi + p1) / 2)) continue
      strands.push({ t0: theta, p0: phi, t1, p1, shade: rng() })
    }
  }

  // ---------------------------------------------------------------- drawing
  const trace = (ctx: CanvasRenderingContext2D, T: Target, s: number, poly: Poly, close: boolean) => {
    ctx.beginPath()
    poly.forEach(([t, p], i) => {
      const [x, y] = T.px(t, p)
      if (i === 0) ctx.moveTo(x * s, y * s)
      else ctx.lineTo(x * s, y * s)
    })
    if (close) ctx.closePath()
  }
  // millimetres to texels at the face (r ~ 0.1 m)
  const mm = (T: Target, s: number, v: number) => T.ppr * v * 0.01 * s
  const lipPoly = (): Poly => upperBorder.concat(lowerBorder.slice().reverse())

  const drawStrands = (ctx: CanvasRenderingContext2D, T: Target, keep: (theta: number) => boolean) => {
    if (!strands.length) return
    const stub = facial === 'stubble'
    const buckets = 4
    ctx.lineCap = 'round'
    for (let k = 0; k < buckets; k++) {
      const v = 0.62 + 0.18 * k
      ctx.strokeStyle = css(mul(hair, v), stub ? 0.55 : 0.5)
      ctx.lineWidth = Math.max(0.55, mm(T, 1, stub ? 0.2 : 0.24))
      ctx.beginPath()
      for (const st of strands) {
        if (Math.min(buckets - 1, Math.floor(st.shade * buckets)) !== k || !keep(st.t0)) continue
        const [x0, y0] = T.px(st.t0, st.p0)
        const [x1, y1] = T.px(st.t1, st.p1)
        ctx.moveTo(x0, y0)
        ctx.lineTo(x1, y1)
      }
      ctx.stroke()
    }
  }

  const drawFace = (ctx: CanvasRenderingContext2D, T: Target) => {
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    // lips: feathered vermilion, a lighter lower lip, the white roll, fine vertical lines, the mouth line
    // the vermilion: a soft-edged fill (a wide faint outline, then the body)
    trace(ctx, T, 1, lipPoly(), true)
    ctx.strokeStyle = css(lipTint, 0.14)
    ctx.lineWidth = mm(T, 1, 1.6)
    ctx.stroke()
    ctx.fillStyle = css(lipTint, 0.55)
    ctx.fill()
    trace(ctx, T, 1, lowLipHi, true)
    ctx.fillStyle = css(lipLow, 0.2)
    ctx.fill()
    trace(ctx, T, 1, upperBorder, false)
    ctx.strokeStyle = css(mul(skin, 1.18), 0.16)
    ctx.lineWidth = mm(T, 1, 0.45)
    ctx.stroke()
    ctx.strokeStyle = css(mul(lipTint, 0.6), 0.1)
    ctx.lineWidth = Math.max(0.5, mm(T, 1, 0.12))
    ctx.beginPath()
    for (let i = 1; i < lipN * 2; i++) {
      if (rng() < 0.25) continue
      for (const [a, b] of [
        [upperBorder[i], mouthLine[i]],
        [mouthLine[i], lowerBorder[i]],
      ]) {
        const k0 = 0.2 + 0.2 * rng(), k1 = 0.75 + 0.2 * rng()
        const [x0, y0] = T.px(a[0] + (b[0] - a[0]) * k0, a[1] + (b[1] - a[1]) * k0)
        const [x1, y1] = T.px(a[0] + (b[0] - a[0]) * k1, a[1] + (b[1] - a[1]) * k1)
        ctx.moveTo(x0, y0)
        ctx.lineTo(x1, y1)
      }
    }
    ctx.stroke()
    trace(ctx, T, 1, mouthLine, false)
    ctx.strokeStyle = css(mul(skin, 0.24, 0.17, 0.17), 0.7)
    ctx.lineWidth = mm(T, 1, 0.7)
    ctx.stroke()
    for (const end of [mouthLine[0], mouthLine[mouthLine.length - 1]]) {
      const [x, y] = T.px(end[0], end[1])
      ctx.fillStyle = css(mul(skin, 0.3, 0.22, 0.22), 0.35)
      ctx.beginPath()
      ctx.ellipse(x, y, mm(T, 1, 1.1), mm(T, 1, 0.7), 0, 0, Math.PI * 2)
      ctx.fill()
    }
    // eyes
    for (const e of eyes) {
      // the upper lid between the lash line and the crease: darker, a little cooler
      trace(ctx, T, 1, e.upper.concat(e.crease.slice().reverse()), true)
      ctx.fillStyle = css(mul(skin, 0.8, 0.74, 0.8), 0.32)
      ctx.fill()
      trace(ctx, T, 1, e.crease, false)
      ctx.strokeStyle = css(mul(skin, 0.45, 0.38, 0.4), 0.28 + 0.2 * f.lidFold)
      ctx.lineWidth = mm(T, 1, 0.55)
      ctx.stroke()
      // caruncle: the pink fold in the inner corner
      const [cx, cy] = T.px(e.upper[0][0], (e.upper[0][1] + e.lower[0][1]) / 2)
      ctx.fillStyle = css([Math.min(1, skin[0] * 0.75 + 0.25), skin[1] * 0.5 + 0.08, skin[2] * 0.5 + 0.08], 0.7)
      ctx.beginPath()
      ctx.ellipse(cx, cy, mm(T, 1, 1.3), mm(T, 1, 0.9), 0, 0, Math.PI * 2)
      ctx.fill()
      // lash lines: dense and dark on the upper lid, tapering medially; faint on the lower
      for (let i = 0; i < e.lash.length - 1; i++) {
        const t = i / (e.lash.length - 1)
        const [x0, y0] = T.px(e.lash[i][0], e.lash[i][1])
        const [x1, y1] = T.px(e.lash[i + 1][0], e.lash[i + 1][1])
        ctx.strokeStyle = css(lashC, 0.95)
        ctx.lineWidth = mm(T, 1, 0.45 + 0.65 * Math.sin(Math.PI * Math.min(1, 0.25 + t * 0.9)))
        ctx.beginPath()
        ctx.moveTo(x0, y0)
        ctx.lineTo(x1, y1)
        ctx.stroke()
      }
      ctx.strokeStyle = css(lashC, 0.75)
      ctx.lineWidth = Math.max(0.5, mm(T, 1, 0.16))
      ctx.beginPath()
      for (let i = 2; i < e.upper.length - 1; i++) {
        const t = i / (e.upper.length - 1)
        for (let j = 0; j < 2; j++) {
          const a = e.upper[i]
          const len = (0.008 + 0.008 * Math.sin(Math.PI * t)) * (0.8 + 0.4 * rng())
          const [x0, y0] = T.px(a[0], a[1])
          const [x1, y1] = T.px(a[0] + e.sd * len * (0.2 + 0.6 * t), a[1] - len)
          ctx.moveTo(x0, y0)
          ctx.lineTo(x1, y1)
        }
      }
      ctx.stroke()
      trace(ctx, T, 1, e.lower, false)
      ctx.strokeStyle = css(lashC, 0.22)
      ctx.lineWidth = mm(T, 1, 0.28)
      ctx.stroke()
    }
    // brows: a faint fill for density, then the hairs
    ctx.fillStyle = css(browC, 0.14)
    for (const p of browFill) {
      trace(ctx, T, 1, p, true)
      ctx.fill()
    }
    // hairs batched by opacity and width
    for (let k = 0; k < 8; k++) {
      const wide = (k & 1) === 1
      ctx.strokeStyle = css(browC, [0.18, 0.28, 0.4, 0.6][k >> 1])
      ctx.lineWidth = Math.max(0.5, mm(T, 1, wide ? 0.17 : 0.12))
      ctx.beginPath()
      for (const h of browHairs) {
        if (Math.min(3, Math.floor((h.al - 0.12) / 0.09)) !== k >> 1 || h.w > 1.15 !== wide) continue
        const [x0, y0] = T.px(h.a[0], h.a[1])
        const [x1, y1] = T.px(h.b[0], h.b[1])
        ctx.moveTo(x0, y0)
        ctx.lineTo(x1, y1)
      }
      ctx.stroke()
    }
    // (nostrils are left to the sculpt and its occlusion: the angular projection would repeat them on the
    // front of the nose and the upper lip, which share their directions)
    for (const m of moles) {
      const [x, y] = T.px(m.a[0], m.a[1])
      ctx.fillStyle = css(mul(skin, 0.5, 0.42, 0.4), 0.7)
      ctx.beginPath()
      ctx.arc(x, y, Math.max(0.6, mm(T, 1, m.r * 1000)), 0, Math.PI * 2)
      ctx.fill()
    }
  }
  const drawFaceRough = (ctx: CanvasRenderingContext2D, T: Target, s: number) => {
    // glossy vermilion, matte brows
    trace(ctx, T, s, lipPoly(), true)
    ctx.fillStyle = 'rgba(118,118,118,0.85)'
    ctx.fill()
    // the parting is matte (no glossy strip in the groove)
    trace(ctx, T, s, mouthLine, false)
    ctx.strokeStyle = 'rgba(210,210,210,0.9)'
    ctx.lineWidth = Math.max(1, mm(T, s, 1.3))
    ctx.stroke()
    ctx.fillStyle = 'rgba(205,205,205,0.55)'
    for (const p of browFill) {
      trace(ctx, T, s, p, true)
      ctx.fill()
    }
  }

  const paint = (T: Target, face: boolean) => {
    const { col, rough } = field(T)
    const c = canvas(T.w, T.h)
    const ctx = c.getContext('2d')!
    ctx.imageSmoothingEnabled = true
    ctx.drawImage(col, 0, 0, T.w, T.h)
    if (face) {
      drawFace(ctx, T)
      drawFaceRough(rough.getContext('2d')!, T, T.lw / T.w)
      // lash swatch (sampled by the lash ribbons) and its roughness
      const sw = Math.ceil(T.w * 0.012), sh = Math.ceil(T.h * 0.018)
      ctx.fillStyle = css(lashC)
      ctx.fillRect(0, 0, sw, sh)
      const rc = rough.getContext('2d')!
      rc.fillStyle = 'rgb(190,190,190)'
      rc.fillRect(0, 0, Math.ceil(sw * (T.lw / T.w)) + 1, Math.ceil(sh * (T.lh / T.h)) + 1)
      drawStrands(ctx, T, (t) => Math.abs(t) < FACE_WIN.thetaMax * 1.08)
    } else drawStrands(ctx, T, (t) => Math.abs(t) > 1.45)
    return { c, rough }
  }
  const scalp = paint(scalpTarget(opts.size), false)
  const face = paint(faceTarget(opts.size), true)
  return { scalp: scalp.c, scalpRough: scalp.rough, face: face.c, faceRough: face.rough }
}

/** Facial hair coverage in head angles. */
function beardMask(style: FacialHair, f: FaceParams) {
  if (style === 'clean') return () => 0
  const lip = tp([0, mouthY(f), 0.1])
  // the goatee starts below the lower vermilion border
  const lowLip = tp([0, mouthY(f) - 0.0112 * f.lipFull, 0.095])
  const chin = tp([0, -0.104 * f.faceLen, 0.084])
  return (theta: number, phi: number) => {
    const at = Math.abs(theta)
    const phiN = phi / Math.PI
    const lipN = lip[1] / Math.PI
    // mustache: thin band above the upper lip, fading toward the mouth corners
    const must = smooth(0.012, 0.004, Math.abs(phiN - (lipN - 0.028))) * smooth(0.36, 0.26, at)
    // goatee: below the lower lip down over the chin
    const goatee = smooth(lowLip[1] / Math.PI + 0.004, lowLip[1] / Math.PI + 0.02, phiN) * smooth(0.34, 0.24, Math.hypot(at * 1.05, (phi - chin[1]) * 1.1))
    // cheek beard: below a line that dips from the sideburn toward the mouth corner
    // the cheek line dips toward the mouth and wanders a little; density fades in over it
    const cheekLine = 0.565 + 0.07 * smooth(1.15, 0.4, at) + 0.008 * Math.sin(at * 7.3 + 0.6)
    // one feathered, wandering back edge from the sideburn down to the angle of the jaw
    const edge = 1.3 + 0.025 * Math.sin(phi * 11 + 1) + 0.018 * Math.sin(phi * 23) + 0.05 * smooth(0.55, 0.72, phiN)
    const back = smooth(edge + 0.07, edge - 0.1, at)
    const cheek = smooth(cheekLine - 0.008, cheekLine + 0.03, phiN) * back * (1 - smooth(0.3, 0.2, at) * smooth(lipN + 0.03, lipN - 0.01, phiN))
    const sideburn = smooth(1.08, 1.2, at) * back * smooth(0.45, 0.5, phiN)
    const under = smooth(0.7, 0.76, phiN) * back
    switch (style) {
      case 'stubble':
        return 0.15 * Math.max(must, goatee, cheek, sideburn, under)
      case 'goatee':
        return 0.95 * Math.max(must * 0.9, goatee)
      case 'beard':
        return 0.85 * Math.max(must, goatee, cheek * smooth(0.6, 0.64, phiN + 0.02), sideburn * 0.8, under)
      case 'full':
        return Math.max(must, goatee, cheek, sideburn, under)
    }
    return 0
  }
}

/** Iris colours (deep, mid, collarette): mostly browns, with hazel, amber, green and blue-grey. */
const IRIS: [string, string, string][] = [
  ['#1f1009', '#38200f', '#5a3417'],
  ['#341d0e', '#573218', '#83532a'],
  ['#3a2813', '#665026', '#8e8846'],
  ['#45260e', '#845420', '#b5823b'],
  ['#2b3628', '#526247', '#8b8c57'],
  ['#2a3846', '#526d86', '#98aec0'],
]

/** Seeded iris variant (independent of skin tone). */
export function irisVariant(seed: number) {
  const r = mulberry32(seed ^ 0x1e1e5)()
  return r < 0.42 ? 0 : r < 0.74 ? 1 : r < 0.86 ? 2 : r < 0.93 ? 3 : r < 0.97 ? 4 : 5
}

/**
 * Eyeball texture per iris variant: planar front projection (u, v in [0, 1] across the globe). Warm sclera
 * with faint vessels toward the corners, a fibrous iris with a collarette, crypts and a dark limbal ring, and
 * the upper lid's shadow baked over the top of the globe. The corners, outside the projected globe, hold the
 * lash colour that the lash ribbons sample.
 */
const eyeTex = new Map<number, THREE.CanvasTexture>()
export function eyeTexture(variant = 1) {
  const hit = eyeTex.get(variant)
  if (hit) return hit
  const S = 256
  const c = document.createElement('canvas')
  c.width = S
  c.height = S
  const ctx = c.getContext('2d')!
  const r = mulberry32(0x3e7e + variant * 977)
  const [deep, mid, col] = IRIS[Math.max(0, Math.min(IRIS.length - 1, variant))]
  ctx.fillStyle = '#100a08'
  ctx.fillRect(0, 0, S, S)
  const C = S / 2
  ctx.save()
  ctx.beginPath()
  ctx.arc(C, C, C, 0, Math.PI * 2)
  ctx.clip()
  const g = ctx.createRadialGradient(C, C, S * 0.12, C, C, C)
  g.addColorStop(0, '#e2d9ce')
  g.addColorStop(0.5, '#dcd0c3')
  g.addColorStop(0.8, '#cdb5a8')
  g.addColorStop(1, '#ad8a80')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, S, S)
  // vessels run in from the corners of the eye
  ctx.lineCap = 'round'
  for (let i = 0; i < 16; i++) {
    const side = i % 2 ? 1 : -1
    let x = C + side * C * (0.95 + 0.05 * r())
    let y = C + (r() - 0.5) * S * 0.35
    ctx.strokeStyle = `rgba(${150 + Math.round(r() * 40)},${40 + Math.round(r() * 25)},${40 + Math.round(r() * 20)},${0.12 + 0.14 * r()})`
    ctx.lineWidth = 0.5 + r() * 0.9
    ctx.beginPath()
    ctx.moveTo(x, y)
    const steps = 4 + Math.floor(r() * 4)
    for (let k = 0; k < steps; k++) {
      x -= side * S * (0.025 + 0.03 * r())
      y += (r() - 0.5) * S * 0.04
      ctx.lineTo(x, y)
      if (Math.abs(x - C) < S * 0.3) break
    }
    ctx.stroke()
  }
  const ir = S * 0.245
  const ig = ctx.createRadialGradient(C, C, ir * 0.2, C, C, ir)
  ig.addColorStop(0, deep)
  ig.addColorStop(0.42, mid)
  ig.addColorStop(0.75, mid)
  ig.addColorStop(0.92, deep)
  ig.addColorStop(1, '#0a0605')
  ctx.fillStyle = ig
  ctx.beginPath()
  ctx.arc(C, C, ir, 0, Math.PI * 2)
  ctx.fill()
  // radial fibres, lighter and darker
  for (let i = 0; i < 260; i++) {
    const a = r() * Math.PI * 2
    const r0 = ir * (0.36 + 0.08 * r())
    const r1 = ir * (0.7 + 0.27 * r())
    const light = r() < 0.55
    ctx.strokeStyle = light ? col : deep
    ctx.globalAlpha = light ? 0.12 + 0.2 * r() : 0.15 + 0.25 * r()
    ctx.lineWidth = 0.6 + r() * 0.9
    ctx.beginPath()
    ctx.moveTo(C + Math.cos(a) * r0, C + Math.sin(a) * r0)
    const bend = (r() - 0.5) * 0.12
    ctx.quadraticCurveTo(C + Math.cos(a + bend) * (r0 + r1) * 0.5, C + Math.sin(a + bend) * (r0 + r1) * 0.5, C + Math.cos(a) * r1, C + Math.sin(a) * r1)
    ctx.stroke()
  }
  // collarette and crypts
  ctx.globalAlpha = 0.4
  ctx.strokeStyle = col
  ctx.lineWidth = ir * 0.07
  ctx.beginPath()
  for (let i = 0; i <= 48; i++) {
    const a = (i / 48) * Math.PI * 2
    const rr = ir * (0.5 + 0.04 * Math.sin(a * 7 + r()))
    if (i === 0) ctx.moveTo(C + Math.cos(a) * rr, C + Math.sin(a) * rr)
    else ctx.lineTo(C + Math.cos(a) * rr, C + Math.sin(a) * rr)
  }
  ctx.stroke()
  ctx.fillStyle = deep
  for (let i = 0; i < 16; i++) {
    const a = r() * Math.PI * 2
    const rr = ir * (0.58 + 0.28 * r())
    ctx.globalAlpha = 0.25 + 0.2 * r()
    ctx.beginPath()
    ctx.ellipse(C + Math.cos(a) * rr, C + Math.sin(a) * rr, ir * (0.03 + 0.04 * r()), ir * (0.06 + 0.06 * r()), a, 0, Math.PI * 2)
    ctx.fill()
  }
  // limbal ring and pupil
  ctx.globalAlpha = 0.7
  ctx.strokeStyle = '#0b0706'
  ctx.lineWidth = ir * 0.1
  ctx.beginPath()
  ctx.arc(C, C, ir * 0.96, 0, Math.PI * 2)
  ctx.stroke()
  ctx.globalAlpha = 1
  ctx.fillStyle = '#030202'
  ctx.beginPath()
  ctx.arc(C, C, ir * 0.33, 0, Math.PI * 2)
  ctx.fill()
  // the upper lid shades the top of the globe; the corners of the opening fall off too
  const lid = ctx.createLinearGradient(0, 0, 0, S * 0.5)
  lid.addColorStop(0, 'rgba(30,14,8,0.75)')
  lid.addColorStop(0.55, 'rgba(30,14,8,0.42)')
  lid.addColorStop(1, 'rgba(30,14,8,0)')
  ctx.fillStyle = lid
  ctx.fillRect(0, 0, S, S * 0.5)
  const side = ctx.createRadialGradient(C, C, S * 0.3, C, C, C)
  side.addColorStop(0, 'rgba(60,30,20,0)')
  side.addColorStop(1, 'rgba(60,30,20,0.35)')
  ctx.fillStyle = side
  ctx.fillRect(0, 0, S, S)
  ctx.restore()
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 4
  eyeTex.set(variant, t)
  return t
}
