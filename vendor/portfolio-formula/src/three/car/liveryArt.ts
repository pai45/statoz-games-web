import * as THREE from "three"
import type { Livery, LiveryPattern } from "@/data/types"

/**
 * Livery artwork drawn in car space (metres), then projected onto the painted
 * bodywork by the paint shader: a side view (z, y) for the flanks and a top
 * view (z, x) for upward-facing panels. Because both views share the car's own
 * coordinates, a motif flows continuously over the nose, sidepods, engine
 * cover, fin and wing flaps even though they are separate lofts.
 */
export const LIVERY_BOUNDS = {
  zMin: -2.95,
  zMax: 3.05,
  yMin: 0,
  yMax: 1.1,
  halfWidth: 1,
}

/** Area behind the sidepod sponsor name; designs keep it calm so the name stays legible. */
const NAME_ZONE = { z0: -0.66, z1: 0.42, y0: 0.18, y1: 0.52 }

type Ctx = CanvasRenderingContext2D

type Painter = {
  side: Ctx
  top: Ctx
  livery: Livery
  rand: () => number
}

type Point = [number, number]

function seeded(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function hashString(text: string) {
  let h = 2166136261
  for (let i = 0; i < text.length; i++)
    h = Math.imul(h ^ text.charCodeAt(i), 16777619)
  return h >>> 0
}

function canvasFor(kind: "side" | "top", width: number) {
  const height = width / 4
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext("2d")!
  const { zMin, zMax, yMin, yMax, halfWidth } = LIVERY_BOUNDS
  const sx = width / (zMax - zMin)
  // map metres to pixels: z runs left (rear) to right (nose), up is +y (side) or the car's right (top)
  if (kind === "side") {
    const sy = height / (yMax - yMin)
    ctx.setTransform(sx, 0, 0, -sy, -zMin * sx, yMax * sy)
  } else {
    const sy = height / (2 * halfWidth)
    ctx.setTransform(sx, 0, 0, -sy, -zMin * sx, halfWidth * sy)
  }
  return { canvas, ctx }
}

function toTexture(canvas: HTMLCanvasElement) {
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 8
  return texture
}

// --- drawing helpers (all coordinates in metres) ---------------------------------------------

/** "#rrggbb" to an rgba() string (parsed directly: THREE.Color would linearise the channels). */
function rgba(hex: string, alpha: number) {
  const n = parseInt(hex.slice(1), 16)
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`
}

function fill(ctx: Ctx, colour: string, alpha = 1) {
  ctx.globalAlpha = alpha
  ctx.fillStyle = colour
}

function rect(ctx: Ctx, z0: number, y0: number, z1: number, y1: number) {
  ctx.fillRect(
    Math.min(z0, z1),
    Math.min(y0, y1),
    Math.abs(z1 - z0),
    Math.abs(y1 - y0),
  )
}

function polygon(ctx: Ctx, points: Point[]) {
  ctx.beginPath()
  points.forEach(([z, y], i) => (i === 0 ? ctx.moveTo(z, y) : ctx.lineTo(z, y)))
  ctx.closePath()
  ctx.fill()
}

function circle(ctx: Ctx, z: number, y: number, r: number) {
  ctx.beginPath()
  ctx.arc(z, y, r, 0, Math.PI * 2)
  ctx.fill()
}

function polyline(
  ctx: Ctx,
  points: Point[],
  width: number,
  colour: string,
  alpha = 1,
) {
  ctx.globalAlpha = alpha
  ctx.strokeStyle = colour
  ctx.lineWidth = width
  ctx.lineJoin = "round"
  ctx.lineCap = "round"
  ctx.beginPath()
  points.forEach(([z, y], i) => (i === 0 ? ctx.moveTo(z, y) : ctx.lineTo(z, y)))
  ctx.stroke()
}

function inNameZone(z: number, y: number, pad = 0) {
  return (
    z > NAME_ZONE.z0 - pad &&
    z < NAME_ZONE.z1 + pad &&
    y > NAME_ZONE.y0 - pad &&
    y < NAME_ZONE.y1 + pad
  )
}

/** Signature colour on the front-wing flaps and the rear-wing flap (top view). */
function wings(top: Ctx, colour: string, alpha = 1) {
  fill(top, colour, alpha)
  rect(top, 2.44, 0.17, 2.92, 1.0)
  rect(top, 2.44, -0.17, 2.92, -1.0)
  rect(top, -2.95, -0.52, -2.47, 0.52)
}

function base(ctx: Ctx, colour: string) {
  fill(ctx, colour)
  const { zMin, zMax } = LIVERY_BOUNDS
  ctx.fillRect(zMin - 1, -2, zMax - zMin + 2, 4)
}

// --- designs -----------------------------------------------------------------------------------

/** PlusPay: QR modules dissolving forward, a scan beam, "+" glyphs. */
function qrCode({ side, top, livery, rand }: Painter) {
  const mint = livery.accent
  const pale = livery.secondary
  const m = 0.046

  // scan beam along the lower flank, fading in from the rear
  const beam = side.createLinearGradient(-2.9, 0, 2.9, 0)
  beam.addColorStop(0, rgba(mint, 0))
  beam.addColorStop(0.3, rgba(mint, 0.95))
  beam.addColorStop(1, rgba(mint, 0.95))
  side.globalAlpha = 1
  side.fillStyle = beam
  rect(side, -2.9, 0.158, 3.0, 0.178)
  side.globalAlpha = 0.22
  rect(side, -2.9, 0.122, 3.0, 0.214)

  // modules: dense at the rear, dissolving towards the sponsor name
  for (let z = -2.55; z < -0.7; z += m) {
    for (let y = 0.2; y < 0.92; y += m) {
      const t = (z + 2.55) / 1.85
      if (rand() > 0.6 - t * 0.56) continue
      fill(side, rand() > 0.35 ? mint : pale, 0.92)
      rect(side, z, y, z + m * 0.84, y + m * 0.84)
    }
  }
  const finder = (ctx: Ctx, z: number, y: number) => {
    fill(ctx, pale)
    rect(ctx, z, y, z + 7 * m, y + 7 * m)
    fill(ctx, livery.primary)
    rect(ctx, z + m, y + m, z + 6 * m, y + 6 * m)
    fill(ctx, mint)
    rect(ctx, z + 2 * m, y + 2 * m, z + 5 * m, y + 5 * m)
  }
  finder(side, -2.1, 0.17)
  finder(side, -1.5, 0.5)

  // "+" glyphs stepping down the nose
  const plus = (ctx: Ctx, z: number, y: number, s: number, alpha: number) => {
    fill(ctx, mint, alpha)
    rect(ctx, z - s / 2, y - s / 7, z + s / 2, y + s / 7)
    rect(ctx, z - s / 7, y - s / 2, z + s / 7, y + s / 2)
  }
  ;([
    [1.15, 0.43, 0.1, 1],
    [1.45, 0.38, 0.08, 0.85],
    [1.72, 0.335, 0.064, 0.7],
    [1.97, 0.3, 0.05, 0.55],
  ] as const).forEach(([z, y, s, a]) => plus(side, z, y, s, a))

  // top: mint spine with glyphs down the nose, a big plus on the engine cover, modules everywhere aft
  wings(top, mint)
  fill(top, pale)
  rect(top, 2.44, 0.17, 2.52, 1.0)
  rect(top, 2.44, -0.17, 2.52, -1.0)
  fill(top, mint)
  rect(top, 0.7, -0.012, 2.95, 0.012)
  ;[1.25, 1.65, 2.0].forEach((z, i) => plus(top, z, 0, 0.14 - i * 0.025, 1))
  plus(top, -1.75, 0, 0.26, 1)
  for (const sign of [1, -1]) {
    for (let z = -1.55; z < 0.25; z += m) {
      for (let x = 0.3; x < 0.7; x += m) {
        const t = (z + 1.55) / 1.8
        if (rand() > 0.55 - t * 0.5) continue
        fill(top, rand() > 0.35 ? mint : pale, 0.92)
        rect(top, z, sign * x, z + m * 0.84, sign * (x + m * 0.84))
      }
    }
    plus(top, 0.32, sign * 0.5, 0.1, 0.9)
  }
  for (let z = -2.55; z < -1.0; z += m) {
    for (let x = -0.34; x < 0.34; x += m) {
      if (Math.abs(x) < 0.17 && Math.abs(z + 1.75) < 0.17) continue
      const t = (z + 2.55) / 1.55
      if (rand() > 0.5 - t * 0.48) continue
      fill(top, rand() > 0.35 ? mint : pale, 0.9)
      rect(top, z, x, z + m * 0.84, x + m * 0.84)
    }
  }
}

/** Gift Card Marketplace: gift-wrap ribbon with a bow, confetti. */
function giftRibbon({ side, top, livery, rand }: Painter) {
  const cream = livery.secondary
  const sky = livery.accent
  const shade = "#a92f5b"
  const ribbonZ: [number, number] = [-1.1, -0.86]

  const confetti = (
    ctx: Ctx,
    z0: number,
    z1: number,
    y0: number,
    y1: number,
    count: number,
  ) => {
    for (let i = 0; i < count; i++) {
      const z = z0 + rand() * (z1 - z0)
      const y = y0 + rand() * (y1 - y0)
      if (ctx === side && inNameZone(z, y, 0.04)) continue
      const colour = [sky, cream, shade, sky][Math.floor(rand() * 4)]
      fill(ctx, colour, 0.95)
      ctx.save()
      ctx.translate(z, y)
      ctx.rotate(rand() * Math.PI)
      if (rand() > 0.3) ctx.fillRect(-0.03, -0.013, 0.06, 0.026)
      else circle(ctx, 0, 0, 0.017)
      ctx.restore()
    }
  }
  confetti(side, 0.6, 2.75, 0.14, 0.62, 60)
  confetti(side, -2.55, -1.25, 0.14, 0.92, 45)

  // ribbon band wrapping the body, with darker stitch lines
  fill(side, cream)
  rect(side, ribbonZ[0], -0.1, ribbonZ[1], 1.2)
  fill(side, shade, 0.5)
  rect(side, ribbonZ[0] + 0.022, -0.1, ribbonZ[0] + 0.03, 1.2)
  rect(side, ribbonZ[1] - 0.03, -0.1, ribbonZ[1] - 0.022, 1.2)

  // top: lengthwise ribbon, crossing band, bow at the crossing
  wings(top, cream)
  confetti(top, 0.55, 2.42, -0.95, 0.95, 70)
  confetti(top, -1.5, 0.5, -0.75, 0.75, 46)
  confetti(top, -2.6, -1.4, -0.7, 0.7, 30)
  fill(top, cream)
  rect(top, -2.7, -0.075, 2.95, 0.075)
  rect(top, ribbonZ[0], -1.2, ribbonZ[1], 1.2)
  const midZ = (ribbonZ[0] + ribbonZ[1]) / 2
  top.lineJoin = "round"
  for (const sign of [1, -1]) {
    // tail trailing back towards the rear wing
    fill(top, cream)
    polygon(top, [
      [midZ - 0.02, sign * 0.03],
      [midZ - 0.42, sign * 0.2],
      [midZ - 0.36, sign * 0.3],
      [midZ - 0.46, sign * 0.36],
      [midZ + 0.04, sign * 0.1],
    ])
    // loop
    top.beginPath()
    top.ellipse(
      midZ + 0.03,
      sign * 0.21,
      0.13,
      0.19,
      sign * 0.35,
      0,
      Math.PI * 2,
    )
    top.globalAlpha = 1
    top.fillStyle = cream
    top.fill()
    top.strokeStyle = shade
    top.lineWidth = 0.014
    top.stroke()
    top.beginPath()
    top.ellipse(
      midZ + 0.03,
      sign * 0.22,
      0.05,
      0.1,
      sign * 0.35,
      0,
      Math.PI * 2,
    )
    top.fillStyle = livery.primary
    top.fill()
  }
  fill(top, shade)
  circle(top, midZ, 0, 0.065)
  fill(top, cream)
  circle(top, midZ, 0, 0.045)
}

/** Muncho: "split the bill" diagonal two-tone with halftone dots. */
function splitTheBill({ side, top, livery }: Painter) {
  const black = livery.secondary
  const lilac = livery.accent
  const splitZ = (y: number) => -0.74 - 0.82 * y

  // halftone dots spreading forward from the split
  const step = 0.05
  for (let z = -1.6; z < 2.95; z += step) {
    for (let y = 0.08; y < 0.95; y += step) {
      const d = z - splitZ(y)
      if (d < 0) continue
      const r = 0.019 - d * 0.042
      if (r < 0.003) continue
      fill(side, lilac, 0.55)
      circle(side, z, y + ((Math.round(z / step) % 2) * step) / 2, r)
    }
  }
  // a second halftone bookend growing from the nose tip
  for (let z = 1.7; z < 2.95; z += step) {
    for (let y = 0.1; y < 0.6; y += step) {
      const r = 0.004 + (z - 1.7) * 0.012
      fill(side, lilac, 0.6)
      circle(side, z, y, Math.min(r, 0.019))
    }
  }
  // rear in black, split by a white slash and a lilac echo
  fill(side, black)
  polygon(side, [
    [-3.2, -0.2],
    [splitZ(-0.2), -0.2],
    [splitZ(1.3), 1.3],
    [-3.2, 1.3],
  ])
  polyline(
    side,
    [
      [splitZ(-0.2), -0.2],
      [splitZ(1.3), 1.3],
    ],
    0.034,
    "#ffffff",
  )
  polyline(
    side,
    [
      [splitZ(-0.2) + 0.07, -0.2],
      [splitZ(1.3) + 0.07, 1.3],
    ],
    0.012,
    lilac,
    0.9,
  )

  // top: a V-shaped split that meets the side slash on the shoulders
  wings(top, lilac)
  for (let z = 1.7; z < 2.45; z += step) {
    for (let x = -0.2; x < 0.2; x += step) {
      fill(top, lilac, 0.6)
      circle(top, z, x, Math.min(0.004 + (z - 1.7) * 0.02, 0.019))
    }
  }
  const topSplit = (x: number) => -1.4 + 0.42 * Math.abs(x)
  for (let z = -1.35; z < 2.95; z += step) {
    for (let x = -0.95; x < 0.95; x += step) {
      const d = z - topSplit(x)
      if (d < 0) continue
      const r = 0.018 - d * 0.011
      if (r < 0.003) continue
      fill(top, lilac, 0.5)
      circle(top, z, x, r)
    }
  }
  fill(top, black)
  polygon(top, [
    [-3.2, -1.2],
    [topSplit(1.2), -1.2],
    [topSplit(0), 0],
    [topSplit(1.2), 1.2],
    [-3.2, 1.2],
  ])
  polyline(
    top,
    [
      [topSplit(1.2), -1.2],
      [topSplit(0), 0],
      [topSplit(1.2), 1.2],
    ],
    0.034,
    "#ffffff",
  )
}

/** Muncho Dashboard: rising bar chart, dashboard grid, data trend line. */
function barChart({ side, top, livery, rand }: Painter) {
  const lav = livery.accent

  // dashboard grid
  for (let y = 0.12; y < 1.0; y += 0.06) {
    fill(side, "#ffffff", 0.07)
    rect(side, -2.9, y, 3.0, y + 0.005)
  }
  // bars growing towards the sponsor name
  let i = 0
  for (let z = -2.4; z < -0.78; z += 0.1, i++) {
    const h = 0.1 + i * 0.032 + rand() * 0.07
    fill(side, lav, 0.35 + Math.min(0.55, i * 0.04))
    rect(side, z, 0.1, z + 0.068, 0.1 + h)
    fill(side, "#ffffff", 0.85)
    rect(side, z, 0.1 + h - 0.01, z + 0.068, 0.1 + h)
  }
  // trend line with data points along the upper flank
  const pts: Point[] = []
  let y = 0.6
  for (let z = -2.45; z <= 2.0; z += 0.32) {
    y = Math.min(0.82, Math.max(0.53, y + (rand() - 0.38) * 0.07))
    pts.push([z, z > 0.3 ? Math.min(y, 0.6 - (z - 0.3) * 0.12) : y])
  }
  polyline(side, pts, 0.016, "#ffffff", 0.95)
  pts.forEach(([pz, py]) => {
    fill(side, livery.primary)
    circle(side, pz, py, 0.024)
    fill(side, "#ffffff")
    circle(side, pz, py, 0.014)
  })

  // top: horizontal bar charts on the sidepod tops, grid lines, a segmented progress bar
  wings(top, lav)
  for (const sign of [1, -1]) {
    for (let k = 0, z = -1.35; k < 9; k++, z += 0.12) {
      const len = 0.08 + ((k * 37) % 11) * 0.022 + k * 0.012
      fill(top, k % 3 === 2 ? "#ffffff" : lav, k % 3 === 2 ? 0.8 : 0.85)
      rect(top, z, sign * 0.34, z + 0.08, sign * (0.34 + len))
    }
  }
  for (const x of [-0.24, -0.16, -0.08, 0.08, 0.16, 0.24]) {
    fill(top, lav, 0.3)
    rect(top, -2.6, x - 0.004, 2.8, x + 0.004)
  }
  for (let z = -2.4, k = 0; z < -0.5; z += 0.12, k++) {
    fill(top, k < 11 ? lav : "#ffffff", k < 11 ? 0.9 : 0.25)
    rect(top, z, -0.035, z + 0.09, 0.035)
  }
}

/** Sri Aakriti: faceted platinum gem band, cyan pinstripes, sparkles. */
function gemFacets({ side, top, livery, rand }: Painter) {
  const platinum = livery.secondary
  const cyan = livery.accent
  const shades = [platinum, "#9aa3b2", "#e9edf2", "#6f7a8c"]
  const rise = (z: number) => Math.max(0, (-0.75 - z) / 1.9)
  const upper = (z: number) => 0.165 + Math.pow(rise(z), 1.2) * 0.62
  const lower = (z: number) => 0.055 + Math.pow(rise(z), 1.4) * 0.33

  // facet band: a jittered zigzag triangulation between two sweeping edges
  const cols: Point[][] = []
  for (let z = -2.6; z <= 2.7; z += 0.14) {
    const u = upper(z)
    const l = lower(z)
    cols.push(
      [0, 1, 2].map((k) => [
        z + (rand() - 0.5) * 0.06,
        l + ((u - l) * k) / 2 + (rand() - 0.5) * 0.03,
      ]),
    )
  }
  for (let c = 0; c < cols.length - 1; c++) {
    for (let k = 0; k < 2; k++) {
      const a = cols[c][k]
      const b = cols[c][k + 1]
      const p = cols[c + 1][k]
      const q = cols[c + 1][k + 1]
      fill(
        side,
        shades[Math.floor(rand() * shades.length)],
        0.35 + rand() * 0.55,
      )
      polygon(side, [a, b, q])
      fill(
        side,
        shades[Math.floor(rand() * shades.length)],
        0.3 + rand() * 0.55,
      )
      polygon(side, [a, q, p])
    }
  }
  // pinstripes riding the top edge of the band
  const edge: Point[] = []
  for (let z = -2.7; z <= 2.9; z += 0.05) edge.push([z, upper(z) + 0.035])
  polyline(side, edge, 0.011, cyan)
  polyline(
    side,
    edge.map(([z, y]) => [z, y + 0.028]),
    0.005,
    platinum,
    0.8,
  )
  // sparkles on a few facet vertices
  const sparkle = (ctx: Ctx, z: number, y: number, s: number) => {
    fill(ctx, "#ffffff", 0.95)
    polygon(ctx, [
      [z, y + s],
      [z + s * 0.22, y + s * 0.22],
      [z + s, y],
      [z + s * 0.22, y - s * 0.22],
      [z, y - s],
      [z - s * 0.22, y - s * 0.22],
      [z - s, y],
      [z - s * 0.22, y + s * 0.22],
    ])
  }
  ;[cols[4][2], cols[12][1], cols[20][2], cols[30][1]].forEach(([z, y], i) =>
    sparkle(side, z, y, 0.05 - i * 0.006),
  )

  // top: facet strips on the sidepod tops, platinum pinstripes, a faceted diamond on the engine cover
  wings(top, platinum, 0.9)
  for (const sign of [1, -1]) {
    for (let z = -1.5; z < 0.35; z += 0.14) {
      const a: Point = [z, sign * 0.5]
      const b: Point = [z + 0.14, sign * 0.5]
      const c: Point = [z + 0.07, sign * (0.5 + 0.12 + rand() * 0.06)]
      const d2: Point = [z + 0.07, sign * (0.5 - 0.1 - rand() * 0.05)]
      fill(
        top,
        shades[Math.floor(rand() * shades.length)],
        0.45 + rand() * 0.45,
      )
      polygon(top, [a, c, b])
      fill(
        top,
        shades[Math.floor(rand() * shades.length)],
        0.35 + rand() * 0.45,
      )
      polygon(top, [a, d2, b])
    }
    fill(top, cyan)
    rect(top, -1.5, sign * 0.655, 0.45, sign * 0.665)
  }
  fill(top, platinum, 0.9)
  rect(top, -2.6, 0.03, 2.9, 0.04)
  rect(top, -2.6, -0.04, 2.9, -0.03)
  fill(top, cyan)
  rect(top, -2.6, -0.006, 2.9, 0.006)
  const d: Point[] = [
    [-2.2, 0],
    [-1.75, 0.2],
    [-1.3, 0],
    [-1.75, -0.2],
  ]
  const centre: Point = [-1.75, 0]
  d.forEach((p, i) => {
    fill(top, shades[i % shades.length], 0.85)
    polygon(top, [centre, p, d[(i + 1) % d.length]])
  })
  sparkle(top, -1.75, 0, 0.07)
}

/** Eko Infomatics: deep-to-sky gradient, neural-network constellation, forward chevrons. */
function neuralNetwork({ side, top, livery, rand }: Painter) {
  const deep = "#0a4fc4"
  const aqua = livery.accent
  const navy = livery.secondary

  const grad = (ctx: Ctx) => {
    const g = ctx.createLinearGradient(-2.9, 0, 1.6, 0)
    g.addColorStop(0, deep)
    g.addColorStop(1, livery.primary)
    ctx.globalAlpha = 1
    ctx.fillStyle = g
    ctx.fillRect(-4, -2, 8, 4)
  }
  grad(side)
  grad(top)

  const network = (ctx: Ctx, nodes: Point[]) => {
    nodes.forEach((n, i) => {
      const near = nodes
        .map((m, j) => ({ j, d: Math.hypot(m[0] - n[0], m[1] - n[1]) }))
        .filter((o) => o.j !== i)
        .sort((a, b) => a.d - b.d)
        .slice(0, 2)
      near.forEach(({ j, d }) => {
        if (d < 0.5) polyline(ctx, [n, nodes[j]], 0.009, aqua, 0.65)
      })
    })
    nodes.forEach(([z, y]) => {
      const big = rand() > 0.82
      fill(ctx, big ? "#ffffff" : aqua, 0.95)
      circle(ctx, z, y, big ? 0.03 : 0.018)
      if (big) {
        fill(ctx, aqua, 0.25)
        circle(ctx, z, y, 0.065)
      }
    })
  }
  const scatter = (
    z0: number,
    z1: number,
    y0: number,
    y1: number,
    count: number,
    avoidName: boolean,
  ) => {
    const pts: Point[] = []
    while (pts.length < count) {
      const p: Point = [z0 + rand() * (z1 - z0), y0 + rand() * (y1 - y0)]
      if (avoidName && inNameZone(p[0], p[1], 0.05)) continue
      pts.push(p)
    }
    return pts
  }
  network(side, [
    ...scatter(-2.5, -0.75, 0.16, 0.92, 26, true),
    ...scatter(0.55, 1.25, 0.32, 0.62, 6, true),
  ])
  wings(top, aqua, 0.9)
  network(top, scatter(-2.5, -0.75, -0.32, 0.32, 16, false))
  network(top, scatter(-1.45, 0.25, 0.32, 0.68, 9, false))
  network(top, scatter(-1.45, 0.25, -0.68, -0.32, 9, false))

  // the Eko arrow, as forward chevrons on the nose
  const chevron = (
    ctx: Ctx,
    z: number,
    y: number,
    s: number,
    colour: string,
    alpha: number,
  ) => {
    fill(ctx, colour, alpha)
    polygon(ctx, [
      [z - s * 0.5, y + s * 0.5],
      [z - s * 0.2, y + s * 0.5],
      [z + s * 0.3, y],
      [z - s * 0.2, y - s * 0.5],
      [z - s * 0.5, y - s * 0.5],
      [z, y],
    ])
  }
  chevron(side, 1.55, 0.4, 0.2, navy, 0.9)
  chevron(side, 1.85, 0.355, 0.16, navy, 0.75)
  chevron(side, 2.1, 0.32, 0.12, navy, 0.6)
  for (const sign of [1, -1]) {
    chevron(top, 0.05, sign * 0.5, 0.15, "#ffffff", 0.9)
    chevron(top, 0.3, sign * 0.5, 0.12, "#ffffff", 0.65)
  }
  chevron(top, 1.45, 0, 0.16, "#ffffff", 0.95)
  chevron(top, 1.72, 0, 0.13, "#ffffff", 0.75)
  chevron(top, 1.96, 0, 0.1, "#ffffff", 0.55)
}

/**
 * StatOz: a football pitch marked out in navy (the app icon's goal) over the
 * electric cyan, a white goal-line pinstripe, and a streak of gold Oz Coins.
 */
function footballPitch({ side, top, livery }: Painter) {
  const ink = livery.secondary
  const coin = livery.accent
  const LINE = 0.016
  const MARK = 0.62
  const box = (
    ctx: Ctx,
    z0: number,
    y0: number,
    z1: number,
    y1: number,
    alpha = MARK,
  ) => {
    ctx.globalAlpha = alpha
    ctx.strokeStyle = ink
    ctx.lineWidth = LINE
    ctx.strokeRect(
      Math.min(z0, z1),
      Math.min(y0, y1),
      Math.abs(z1 - z0),
      Math.abs(y1 - y0),
    )
  }
  const ring = (
    ctx: Ctx,
    z: number,
    y: number,
    r: number,
    alpha = MARK,
    from = 0,
    to = Math.PI * 2,
  ) => {
    ctx.globalAlpha = alpha
    ctx.strokeStyle = ink
    ctx.lineWidth = LINE
    ctx.beginPath()
    ctx.arc(z, y, r, from, to)
    ctx.stroke()
  }
  /** a streak of coins along `at`, growing towards the nose */
  const streak = (ctx: Ctx, at: (i: number) => Point) => {
    for (let i = 0; i < 7; i++) {
      const [z, y] = at(i)
      const r = 0.018 + i * 0.0026
      fill(ctx, ink, 0.9)
      circle(ctx, z, y, r + 0.008)
      fill(ctx, coin)
      circle(ctx, z, y, r)
    }
  }

  // side: a navy band along the floor (the goal line) under a white pinstripe
  fill(side, ink)
  rect(side, -2.95, 0, 3.05, 0.15)
  fill(side, "#ffffff", 0.8)
  rect(side, -2.9, 0.158, 2.95, 0.168)
  // halfway line and centre circle, clear of the sponsor name
  polyline(
    side,
    [
      [-1.25, 0.18],
      [-1.25, 0.96],
    ],
    LINE,
    ink,
    MARK,
  )
  ring(side, -1.25, 0.56, 0.26)
  fill(side, ink, MARK + 0.15)
  circle(side, -1.25, 0.56, 0.022)
  // penalty area, six-yard box and the D, towards the tail
  box(side, -2.86, 0.24, -2.34, 0.86)
  box(side, -2.86, 0.4, -2.64, 0.7)
  ring(side, -2.42, 0.55, 0.2, MARK, -Math.PI / 3, Math.PI / 3)
  streak(side, (i) => [0.62 + i * 0.24, 0.78])

  // top: the same markings across the car, touchlines down the sidepods
  wings(top, ink)
  polyline(
    top,
    [
      [-1.25, -0.8],
      [-1.25, 0.8],
    ],
    LINE,
    ink,
    MARK,
  )
  ring(top, -1.25, 0, 0.24)
  fill(top, ink, MARK + 0.15)
  circle(top, -1.25, 0, 0.02)
  for (const x of [-0.62, 0.62])
    polyline(
      top,
      [
        [-2.6, x],
        [2.5, x],
      ],
      0.012,
      ink,
      MARK - 0.15,
    )
  box(top, -2.92, -0.4, -2.42, 0.4)
  streak(top, (i) => [0.3 + i * 0.24, 0])
}

/** MintIQ: candlestick chart, rising trend arrow, graph-paper nose. */
function candlesticks({ side, top, livery, rand }: Painter) {
  const black = livery.secondary

  // graph paper on the nose, with a ticker band of up/down markers
  for (let z = 0.5; z < 3.0; z += 0.08) {
    fill(side, black, 0.16)
    rect(side, z, 0, z + 0.005, 1.1)
  }
  for (let y = 0.06; y < 1.0; y += 0.08) {
    fill(side, black, 0.16)
    rect(side, 0.5, y, 3.0, y + 0.005)
  }
  fill(side, black)
  rect(side, 0.62, 0.2, 2.75, 0.262)
  for (let z = 0.75, k = 0; z < 2.6; z += 0.16, k++) {
    fill(side, livery.primary)
    const up = k % 3 !== 1
    polygon(
      side,
      up
        ? [
            [z - 0.03, 0.214],
            [z + 0.03, 0.214],
            [z, 0.248],
          ]
        : [
            [z - 0.03, 0.248],
            [z + 0.03, 0.248],
            [z, 0.214],
          ],
    )
  }

  // candles trending upwards towards the front
  let level = 0.26
  for (let z = -2.4; z < -0.78; z += 0.1) {
    const open = level
    const close = Math.min(0.78, Math.max(0.16, level + (rand() - 0.32) * 0.09))
    const high = Math.max(open, close) + 0.02 + rand() * 0.04
    const low = Math.min(open, close) - 0.02 - rand() * 0.04
    fill(side, black, 0.9)
    rect(side, z + 0.028, low, z + 0.036, high)
    if (close >= open) {
      side.globalAlpha = 0.9
      side.strokeStyle = black
      side.lineWidth = 0.008
      side.strokeRect(z + 0.008, open, 0.048, Math.max(0.012, close - open))
    } else {
      rect(side, z + 0.008, close, z + 0.056, open)
    }
    level = close
  }
  // rising trend line ending in an arrowhead
  const trend: Point[] = [
    [-2.45, 0.2],
    [-2.0, 0.3],
    [-1.7, 0.27],
    [-1.3, 0.42],
    [-1.05, 0.4],
    [-0.8, 0.58],
  ]
  polyline(side, trend, 0.022, black)
  fill(side, black)
  polygon(side, [
    [-0.68, 0.7],
    [-0.84, 0.66],
    [-0.74, 0.54],
  ])

  // top: black spine stripe, up-arrows on the engine cover, rising trend lines on the sidepod tops
  wings(top, black)
  fill(top, black)
  rect(top, -2.7, -0.04, 2.95, 0.04)
  for (const sign of [1, -1]) {
    const pts: Point[] = [
      [-1.45, sign * 0.64],
      [-1.15, sign * 0.56],
      [-0.9, sign * 0.6],
      [-0.55, sign * 0.48],
      [-0.25, sign * 0.52],
      [0.1, sign * 0.4],
    ]
    polyline(top, pts, 0.026, black)
    fill(top, black)
    polygon(top, [
      [0.24, sign * 0.36],
      [0.08, sign * 0.34],
      [0.13, sign * 0.48],
    ])
  }
  for (const z of [-2.2, -1.85, -1.5]) {
    for (const x of [-0.18, 0.18]) {
      polygon(top, [
        [z + 0.09, x],
        [z - 0.05, x + 0.07],
        [z - 0.05, x - 0.07],
      ])
    }
  }
}

const DESIGNS: Record<LiveryPattern, (p: Painter) => void> = {
  qr: qrCode,
  ribbon: giftRibbon,
  split: splitTheBill,
  chart: barChart,
  facets: gemFacets,
  network: neuralNetwork,
  candles: candlesticks,
  pitch: footballPitch,
}

export type LiveryArt = {
  side: THREE.CanvasTexture
  top: THREE.CanvasTexture
  dispose: () => void
}

/** Paints both livery views for a car. `width` is the side-canvas width in pixels (height is width / 4). */
export function createLiveryArt(
  livery: Livery,
  seedKey: string,
  width: number,
): LiveryArt {
  const side = canvasFor("side", width)
  const top = canvasFor("top", width)
  base(side.ctx, livery.primary)
  base(top.ctx, livery.primary)
  DESIGNS[livery.pattern]({
    side: side.ctx,
    top: top.ctx,
    livery,
    rand: seeded(hashString(seedKey)),
  })
  const sideTexture = toTexture(side.canvas)
  const topTexture = toTexture(top.canvas)
  return {
    side: sideTexture,
    top: topTexture,
    dispose() {
      sideTexture.dispose()
      topTexture.dispose()
    },
  }
}
