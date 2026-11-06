import * as THREE from 'three'
import { FONT_DISPLAY, drawEmblem } from '../textures'
import { JERSEY_Y0, JERSEY_Y1, SHORTS_Y0, SHORTS_Y1 } from './garments'

export interface PrintSpec {
  number: number
  name: string
  teamName: string | null
  teamAbbr: string | null
  primary: string
  secondary: string
  base: string
  numberColor: string
  trim: string
  size: number
}

function canvas(w: number, h: number) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  return { c, ctx: c.getContext('2d')! }
}

function luminance(hex: string) {
  const c = new THREE.Color(hex)
  return 0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b
}

function textWidth(ctx: CanvasRenderingContext2D, text: string, px: number, sx: number) {
  ctx.save()
  ctx.font = `italic 900 ${px}px ${FONT_DISPLAY}`
  let w = 0
  for (const ch of text) w += ctx.measureText(ch).width + px * 0.06
  ctx.restore()
  return Math.max(1, (w - px * 0.06) * sx)
}

/** Draws text along a gentle arc (centre lower than the ends), keeping glyphs upright. */
function arcText(ctx: CanvasRenderingContext2D, text: string, cx: number, cy: number, px: number, sx: number, arc: number, fill: string, stroke: string, strokeW: number) {
  ctx.save()
  ctx.font = `italic 900 ${px}px ${FONT_DISPLAY}`
  ctx.textBaseline = 'middle'
  ctx.textAlign = 'center'
  const spacing = px * 0.06
  const widths = [...text].map((ch) => ctx.measureText(ch).width + spacing)
  const total = widths.reduce((a, b) => a + b, 0) - spacing
  let x = -total / 2
  ctx.lineJoin = 'round'
  for (let i = 0; i < text.length; i++) {
    const w = widths[i]
    const mid = x + (w - spacing) / 2
    const t = mid / Math.max(1, total / 2)
    const dy = -arc * (1 - t * t)
    ctx.save()
    ctx.translate(cx + mid * sx, cy + dy)
    ctx.rotate(-t * arc * 0.012)
    ctx.scale(sx, 1)
    if (strokeW > 0) {
      ctx.lineWidth = strokeW
      ctx.strokeStyle = stroke
      ctx.strokeText(text[i], 0, 0)
    }
    ctx.fillStyle = fill
    ctx.fillText(text[i], 0, 0)
    ctx.restore()
    x += w
  }
  ctx.restore()
}

/** Two-colour tackle-twill number. */
function twillNumber(ctx: CanvasRenderingContext2D, n: string, cx: number, cy: number, px: number, sx: number, fill: string, outline: string, edge: string) {
  ctx.save()
  ctx.translate(cx, cy)
  ctx.scale(sx, 1)
  ctx.font = `900 ${px}px ${FONT_DISPLAY}`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.lineJoin = 'round'
  ctx.lineWidth = px * 0.15
  ctx.strokeStyle = edge
  ctx.strokeText(n, 0, 0)
  ctx.lineWidth = px * 0.09
  ctx.strokeStyle = outline
  ctx.strokeText(n, 0, 0)
  ctx.fillStyle = fill
  ctx.fillText(n, 0, 0)
  ctx.restore()
}

/** Jersey graphics in jersey UV space (u wraps, front centre = 0.5). Premultiplied alpha. */
export function paintJerseyPrint(s: PrintSpec): THREE.CanvasTexture {
  const W = s.size
  const H = s.size / 2
  const { c, ctx } = canvas(W, H)
  const span = JERSEY_Y1 - JERSEY_Y0
  const pxY = H / span // px per normalized unit vertically
  const pxX = W / (Math.PI * 2 * 0.075) // px per unit along the chest near the centre lines
  const sx = pxX / pxY
  const vy = (y: number) => (1 - (y - JERSEY_Y0) / span) * H
  const num = String(Math.max(0, Math.min(99, Math.round(s.number))))
  const edge = luminance(s.base) > 0.6 ? s.trim : s.base
  // front: wordmark + number
  if (s.teamName) {
    const word = s.teamName.toUpperCase()
    const px = 0.034 * pxY
    const fit = Math.min(1, (0.094 * pxX) / textWidth(ctx, word, px, sx))
    arcText(ctx, word, W * 0.5, vy(0.758), px, sx * fit, px * 0.22, s.numberColor, s.trim, px * 0.16)
  }
  const fpx = 0.098 * pxY
  twillNumber(ctx, num, W * 0.5, vy(0.687), fpx, sx * (num.length > 1 ? 0.92 : 1), s.numberColor, s.trim, edge)
  // back: name bar + number, centred on the wrap seam
  for (const x of [0, W]) {
    const name = s.name.toUpperCase()
    const px = 0.03 * pxY
    const fit = Math.min(1, (0.11 * pxX) / textWidth(ctx, name, px, sx))
    arcText(ctx, name, x, vy(0.795), px, sx * fit, px * 0.16, s.numberColor, s.trim, px * 0.14)
    twillNumber(ctx, num, x, vy(0.708), 0.112 * pxY, sx * (num.length > 1 ? 0.9 : 1), s.numberColor, s.trim, edge)
  }
  // jock tag (front left hem) + small league crest under the collar
  ctx.save()
  ctx.translate(W * 0.585, vy(0.575))
  ctx.scale(sx, 1)
  ctx.fillStyle = s.trim
  ctx.fillRect(-0.011 * pxY, -0.008 * pxY, 0.022 * pxY, 0.016 * pxY)
  ctx.fillStyle = s.numberColor
  ctx.font = `800 ${0.0075 * pxY}px ${FONT_DISPLAY}`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(s.teamAbbr ?? 'HL', 0, 0.0004 * pxY)
  ctx.restore()
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.premultiplyAlpha = true
  t.wrapS = THREE.RepeatWrapping
  t.anisotropy = 4
  return t
}

/** Shorts graphics: team crest on the front of each leg. Premultiplied alpha. */
export function paintShortsPrint(s: PrintSpec): THREE.CanvasTexture {
  const W = s.size / 2
  const H = s.size / 4
  const { c, ctx } = canvas(W, H)
  const span = SHORTS_Y1 - SHORTS_Y0
  const pxY = H / span
  const pxX = W / (Math.PI * 2 * 0.056)
  const sx = pxX / pxY
  const vy = (y: number) => (1 - (y - SHORTS_Y0) / span) * H
  if (s.teamAbbr) {
    ctx.save()
    ctx.translate(W * 0.5, vy(0.405))
    ctx.scale(sx, 1)
    drawEmblem(ctx, { abbr: s.teamAbbr, primary: s.primary, secondary: s.secondary, name: s.teamName ?? '' }, 0, 0, 0.026 * pxY)
    ctx.restore()
  }
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.premultiplyAlpha = true
  t.wrapS = THREE.RepeatWrapping
  t.anisotropy = 4
  return t
}
