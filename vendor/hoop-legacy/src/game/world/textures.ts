import * as THREE from 'three'
import type { TeamInfo } from '../types'
import { mulberry32 } from '../../data/rng'

function makeCanvas(w: number, h: number) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  const ctx = c.getContext('2d')!
  return { c, ctx }
}

function tex(c: HTMLCanvasElement, srgb = true) {
  const t = new THREE.CanvasTexture(c)
  if (srgb) t.colorSpace = THREE.SRGBColorSpace
  t.needsUpdate = true
  return t
}

export const FONT_DISPLAY = '"Barlow Condensed", "Arial Narrow", Impact, sans-serif'

/** Maple hardwood with planks running along the court length. Tiles seamlessly. */
export function makeWoodTextures(size = 1024) {
  const rng = mulberry32(1337)
  const { c, ctx } = makeCanvas(size, size)
  const { c: rc, ctx: rctx } = makeCanvas(size, size)
  rctx.fillStyle = 'rgb(110,110,110)'
  rctx.fillRect(0, 0, size, size)
  const plankW = size / 32
  for (let col = 0; col < 32; col++) {
    const x = col * plankW
    let y = -rng() * size
    while (y < size) {
      const len = size * (0.3 + rng() * 0.9)
      const hue = 28 + rng() * 8
      const sat = 46 + rng() * 14
      const light = 52 + rng() * 12
      const color = `hsl(${hue} ${sat}% ${light}%)`
      const rough = Math.round(96 + rng() * 34)
      for (const off of [0, size]) {
        const yy = y - off
        if (yy + len < 0 || yy > size) continue
        ctx.fillStyle = color
        ctx.fillRect(x, yy, plankW, len)
        rctx.fillStyle = `rgb(${rough},${rough},${rough})`
        rctx.fillRect(x, yy, plankW, len)
        // grain streaks
        for (let g = 0; g < 7; g++) {
          const gx = x + rng() * plankW
          ctx.strokeStyle = `hsla(${hue - 6} 50% ${light - 14 - rng() * 10}% / ${0.12 + rng() * 0.22})`
          ctx.lineWidth = 0.6 + rng() * 1.2
          ctx.beginPath()
          ctx.moveTo(gx, yy)
          const wobble = (rng() - 0.5) * plankW * 0.5
          ctx.bezierCurveTo(gx + wobble, yy + len * 0.33, gx - wobble, yy + len * 0.66, gx + wobble * 0.3, yy + len)
          ctx.stroke()
        }
        // knots / figure
        if (rng() < 0.25) {
          const ky = yy + rng() * len
          const grd = ctx.createRadialGradient(x + plankW / 2, ky, 0, x + plankW / 2, ky, plankW * 0.8)
          grd.addColorStop(0, `hsla(${hue - 8} 55% ${light - 18}% / 0.35)`)
          grd.addColorStop(1, 'hsla(0 0% 0% / 0)')
          ctx.fillStyle = grd
          ctx.fillRect(x, ky - plankW, plankW, plankW * 2)
        }
        // butt joint
        ctx.fillStyle = 'rgba(60,35,15,0.55)'
        ctx.fillRect(x, yy, plankW, 1.2)
      }
      y += len
    }
    ctx.fillStyle = 'rgba(70,40,18,0.35)'
    ctx.fillRect(x, 0, 1, size)
  }
  // subtle scuffs in roughness
  for (let i = 0; i < 260; i++) {
    const v = Math.round(40 + rng() * 120)
    rctx.strokeStyle = `rgba(${v},${v},${v},0.25)`
    rctx.lineWidth = 1 + rng() * 2
    rctx.beginPath()
    const sx = rng() * size
    const sy = rng() * size
    rctx.moveTo(sx, sy)
    rctx.lineTo(sx + (rng() - 0.5) * 60, sy + (rng() - 0.5) * 60)
    rctx.stroke()
  }
  const map = tex(c)
  map.wrapS = map.wrapT = THREE.RepeatWrapping
  const rough = tex(rc, false)
  rough.wrapS = rough.wrapT = THREE.RepeatWrapping
  return { map, rough }
}

function sphereUV(x: number, y: number, z: number) {
  const v = Math.acos(Math.max(-1, Math.min(1, y))) / Math.PI
  let u = Math.atan2(z, -x) / (Math.PI * 2)
  if (u < 0) u += 1
  return { u, v }
}

/** Pebbled basketball with seams for an equirectangular UV sphere. */
export function makeBallTextures(variant: 'classic' | 'money' = 'classic') {
  const W = 1024
  const H = 512
  const rng = mulberry32(variant === 'money' ? 99 : 7)
  const { c, ctx } = makeCanvas(W, H)
  const { c: bc, ctx: bctx } = makeCanvas(W, H)
  if (variant === 'money') {
    // alternating panels like a money ball
    const cols = ['#f2f2f2', '#c8102e', '#1d4ed8', '#f2f2f2']
    for (let i = 0; i < 4; i++) {
      ctx.fillStyle = cols[i]
      ctx.fillRect((i * W) / 4, 0, W / 4, H)
    }
  } else {
    const g = ctx.createLinearGradient(0, 0, 0, H)
    g.addColorStop(0, '#c9561f')
    g.addColorStop(0.5, '#d8642a')
    g.addColorStop(1, '#c4521c')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, W, H)
  }
  bctx.fillStyle = 'rgb(150,150,150)'
  bctx.fillRect(0, 0, W, H)
  for (let i = 0; i < 26000; i++) {
    const x = rng() * W
    const y = rng() * H
    const r = 0.8 + rng() * 1.4
    const l = rng()
    ctx.fillStyle = l > 0.5 ? 'rgba(255,190,140,0.10)' : 'rgba(60,20,5,0.13)'
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
    const b = Math.round(150 + (rng() - 0.3) * 90)
    bctx.fillStyle = `rgb(${b},${b},${b})`
    bctx.beginPath()
    bctx.arc(x, y, r, 0, Math.PI * 2)
    bctx.fill()
  }
  const seam = (draw: (g: CanvasRenderingContext2D) => void) => {
    ctx.strokeStyle = '#141010'
    ctx.lineWidth = 7
    draw(ctx)
    bctx.strokeStyle = 'rgb(20,20,20)'
    bctx.lineWidth = 9
    draw(bctx)
  }
  seam((g) => {
    g.beginPath()
    g.moveTo(0, H / 2)
    g.lineTo(W, H / 2)
    g.moveTo(W * 0.25, 0)
    g.lineTo(W * 0.25, H)
    g.moveTo(W * 0.75, 0)
    g.lineTo(W * 0.75, H)
    g.stroke()
  })
  for (const zc of [0.62, -0.62]) {
    const rr = Math.sqrt(1 - zc * zc)
    seam((g) => {
      g.beginPath()
      let prevU = -1
      for (let i = 0; i <= 256; i++) {
        const t = (i / 256) * Math.PI * 2
        const { u, v } = sphereUV(rr * Math.cos(t), rr * Math.sin(t), zc)
        if (prevU < 0 || Math.abs(u - prevU) > 0.5) g.moveTo(u * W, v * H)
        else g.lineTo(u * W, v * H)
        prevU = u
      }
      g.stroke()
    })
  }
  const map = tex(c)
  const bump = tex(bc, false)
  return { map, bump }
}

/** Crowd atlas: 8 seated/standing fans. Shirts are drawn in a magenta key for shader tinting. */
/** Spectator poses, in atlas cell order. Photographer cells are only used courtside. */
export type FanPose = 'sit' | 'clap' | 'cheer' | 'fist' | 'phone' | 'photog'
export const CROWD_POSES: FanPose[] = ['sit', 'clap', 'cheer', 'sit', 'phone', 'clap', 'fist', 'sit', 'cheer', 'sit', 'clap', 'fist', 'sit', 'phone', 'photog', 'photog']

/**
 * Crowd atlas: 16 shaded spectators in 8 x 2 cells of 128 x 192. Clothing is painted in a magenta key
 * (r = b, g = 0) so the shader tints it per instance (team colours, merch); phone screens are keyed
 * pure cyan and glow; everything is top-lit with soft side shading so the stands read as people, not
 * stickers.
 */
export function makeCrowdAtlas() {
  const cellW = 128
  const cellH = 192
  const cols = 8
  const rows = 2
  const { c, ctx } = makeCanvas(cellW * cols, cellH * rows)
  const rng = mulberry32(42)
  const skins = ['#f1c9a5', '#d9a27a', '#b47a52', '#8a5534', '#5e3720', '#e8b893', '#9c6a44', '#3f2516']
  const hairs = ['#141010', '#2b1d14', '#4a2f1d', '#7a4b2a', '#c9a46a', '#1d1d1d', '#5a3a22', '#0d0b0a']
  const key = (s: number) => `rgb(${Math.round(255 * s)},0,${Math.round(255 * s)})`
  const limb = (x0: number, y0: number, x1: number, y1: number, w: number, color: string) => {
    ctx.strokeStyle = color
    ctx.lineWidth = w
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(x0, y0)
    ctx.lineTo(x1, y1)
    ctx.stroke()
  }
  const dot = (x: number, y: number, r: number, color: string) => {
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
  }
  CROWD_POSES.forEach((pose, i) => {
    const ox = (i % cols) * cellW
    const oy = Math.floor(i / cols) * cellH
    const cx = ox + cellW / 2 + (rng() - 0.5) * 8
    const skin = skins[(i * 5 + 3) % skins.length]
    const hair = hairs[(i * 3 + 1) % hairs.length]
    const crouch = pose === 'photog'
    ctx.save()
    ctx.beginPath()
    ctx.rect(ox, oy, cellW, cellH)
    ctx.clip()
    const headR = 19 + rng() * 4
    const headY = oy + (crouch ? 92 : 62) + rng() * 8
    const shoulderY = headY + headR + 10
    const tw = (crouch ? 76 : 62) + rng() * 18
    const side = i % 2 ? 1 : -1
    const sl = cx - tw / 2 + 9
    const sr = cx + tw / 2 - 9
    const sleeve = key(0.72)

    // arms behind the torso (raised arms read in front of the stands behind)
    if (pose === 'cheer') {
      for (const s of [-1, 1]) {
        const shx = s < 0 ? sl : sr
        const ex = shx + s * 14
        const ey = shoulderY - 30
        limb(shx, shoulderY + 6, ex, ey, 15, sleeve)
        limb(ex, ey, ex + s * 4, headY - headR - 18, 11, skin)
        dot(ex + s * 4, headY - headR - 22, 7.5, skin)
      }
    } else if (pose === 'fist') {
      const shx = side < 0 ? sl : sr
      const ex = shx + side * 12
      limb(shx, shoulderY + 6, ex, shoulderY - 28, 15, sleeve)
      limb(ex, shoulderY - 28, ex + side * 2, headY - headR - 16, 11, skin)
      dot(ex + side * 2, headY - headR - 20, 8.5, skin)
    } else if (pose === 'phone') {
      const shx = side < 0 ? sl : sr
      const hx = cx + side * (tw * 0.18)
      const hy = headY - 4
      limb(shx, shoulderY + 6, shx + side * 6, shoulderY + 34, 15, sleeve)
      limb(shx + side * 6, shoulderY + 34, hx, hy + 8, 11, skin)
      ctx.fillStyle = '#0b0c0f'
      ctx.beginPath()
      ctx.roundRect(hx - 8, hy - 14, 16, 26, 3)
      ctx.fill()
      ctx.fillStyle = '#00ffff'
      ctx.fillRect(hx - 6, hy - 12, 12, 21)
      dot(hx, hy + 10, 6.5, skin)
    }

    // torso: rounded shoulders, top-lit
    const tg = ctx.createLinearGradient(0, shoulderY, 0, oy + cellH)
    tg.addColorStop(0, key(1))
    tg.addColorStop(0.45, key(0.8))
    tg.addColorStop(1, key(0.52))
    ctx.fillStyle = tg
    ctx.beginPath()
    ctx.roundRect(cx - tw / 2, shoulderY, tw, oy + cellH - shoulderY + 12, [tw * 0.4, tw * 0.4, 4, 4])
    ctx.fill()
    // collar / neckline
    ctx.fillStyle = key(0.42)
    ctx.beginPath()
    ctx.ellipse(cx, shoulderY + 2, 13, 7, 0, 0, Math.PI)
    ctx.fill()

    // arms in front of the torso
    if (pose === 'sit' || pose === 'cheer' || pose === 'fist' || pose === 'phone') {
      for (const s of [-1, 1]) {
        if (pose === 'cheer') continue
        if ((pose === 'fist' || pose === 'phone') && s === side) continue
        const shx = s < 0 ? sl : sr
        limb(shx, shoulderY + 8, shx + s * 2, shoulderY + 62, 15, sleeve)
        limb(shx + s * 2, shoulderY + 62, cx + s * 12, shoulderY + 84, 11, skin)
      }
    } else if (pose === 'clap') {
      for (const s of [-1, 1]) {
        const shx = s < 0 ? sl : sr
        const ex = shx + s * 3
        const ey = shoulderY + 46
        limb(shx, shoulderY + 8, ex, ey, 15, sleeve)
        limb(ex, ey, cx + s * 5, shoulderY + 24, 11, skin)
      }
      dot(cx, shoulderY + 22, 8, skin)
    } else if (crouch) {
      // photographer: elbows out, a big black body and lens in front of the face
      for (const s of [-1, 1]) {
        const shx = s < 0 ? sl : sr
        limb(shx, shoulderY + 8, shx + s * 10, shoulderY + 28, 15, sleeve)
        limb(shx + s * 10, shoulderY + 28, cx + s * 16, headY + 6, 11, skin)
      }
    }

    // head with a soft key light from the upper left
    ctx.fillStyle = skin
    ctx.fillRect(cx - 8, headY + headR - 6, 16, 18)
    ctx.beginPath()
    ctx.ellipse(cx, headY, headR * 0.86, headR, 0, 0, Math.PI * 2)
    ctx.fill()
    dot(cx - headR * 0.86, headY + 2, 4.5, skin)
    dot(cx + headR * 0.86, headY + 2, 4.5, skin)
    const hg = ctx.createRadialGradient(cx - headR * 0.35, headY - headR * 0.4, 2, cx, headY, headR * 1.15)
    hg.addColorStop(0, 'rgba(255,240,220,0.18)')
    hg.addColorStop(0.6, 'rgba(0,0,0,0)')
    hg.addColorStop(1, 'rgba(0,0,0,0.32)')
    ctx.fillStyle = hg
    ctx.beginPath()
    ctx.ellipse(cx, headY, headR * 0.86, headR, 0, 0, Math.PI * 2)
    ctx.fill()
    // chin shadow on the neck, brows and eyes as soft darks
    ctx.fillStyle = 'rgba(0,0,0,0.28)'
    ctx.beginPath()
    ctx.ellipse(cx, headY + headR + 2, 9, 4, 0, 0, Math.PI * 2)
    ctx.fill()
    if (!crouch) {
      ctx.fillStyle = 'rgba(20,12,8,0.55)'
      ctx.beginPath()
      ctx.ellipse(cx - 7, headY - 1, 3.2, 2.2, 0, 0, Math.PI * 2)
      ctx.ellipse(cx + 7, headY - 1, 3.2, 2.2, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = 'rgba(60,20,20,0.35)'
      ctx.fillRect(cx - 5, headY + 9, 10, 2)
    }

    // hair, caps and beanies (caps take the shirt key so they pick up team colours)
    const style = i % 5
    ctx.fillStyle = hair
    ctx.beginPath()
    if (style === 1) {
      ctx.fillStyle = key(0.85)
      ctx.ellipse(cx, headY - headR * 0.35, headR * 0.92, headR * 0.72, 0, Math.PI, 0)
      ctx.fill()
      ctx.fillStyle = key(0.6)
      ctx.beginPath()
      ctx.ellipse(cx + side * 6, headY - headR * 0.38, headR * 1.05, 4, 0, 0, Math.PI * 2)
    } else if (style === 3) {
      ctx.fillStyle = key(0.55)
      ctx.ellipse(cx, headY - headR * 0.3, headR * 0.95, headR * 0.85, 0, Math.PI, 0)
    } else if (style === 4) {
      // long hair falls behind the shoulders
      ctx.ellipse(cx, headY - 2, headR * 1.02, headR * 1.12, 0, Math.PI * 1.02, Math.PI * 1.98)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(cx, headY - headR * 0.4, headR * 0.92, headR * 0.7, 0, Math.PI, 0)
    } else {
      ctx.ellipse(cx, headY - headR * 0.42, headR * 0.9, headR * (style === 2 ? 0.75 : 0.62), 0, Math.PI, 0)
    }
    ctx.fill()

    if (crouch) {
      ctx.fillStyle = '#121316'
      ctx.beginPath()
      ctx.roundRect(cx - 22, headY - 4, 44, 26, 5)
      ctx.fill()
      dot(cx + side * 6, headY + 10, 11, '#24262b')
      dot(cx + side * 6, headY + 10, 6, '#0a0b0d')
      ctx.fillStyle = '#2c2e33'
      ctx.fillRect(cx - 18, headY - 10, 12, 7)
    }

    // shadowed silhouette edge so mip levels keep a readable outline
    const vg = ctx.createLinearGradient(cx - tw / 2, 0, cx + tw / 2, 0)
    vg.addColorStop(0, 'rgba(0,0,0,0.38)')
    vg.addColorStop(0.28, 'rgba(0,0,0,0)')
    vg.addColorStop(0.72, 'rgba(0,0,0,0)')
    vg.addColorStop(1, 'rgba(0,0,0,0.34)')
    ctx.globalCompositeOperation = 'source-atop'
    ctx.fillStyle = vg
    ctx.fillRect(ox, shoulderY, cellW, cellH)
    ctx.globalCompositeOperation = 'source-over'
    ctx.restore()
  })
  const t = tex(c)
  t.generateMipmaps = true
  t.anisotropy = 4
  return { texture: t, cells: CROWD_POSES.length, cols, rows }
}

export function makeGlowTexture() {
  const { c, ctx } = makeCanvas(128, 128)
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.18, 'rgba(255,250,235,0.85)')
  g.addColorStop(0.45, 'rgba(255,240,210,0.25)')
  g.addColorStop(1, 'rgba(255,240,210,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 128, 128)
  return tex(c)
}

export function makeSoftDotTexture() {
  const { c, ctx } = makeCanvas(64, 64)
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.4, 'rgba(255,255,255,0.6)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 64, 64)
  return tex(c)
}

export function makeShadowBlobTexture() {
  const { c, ctx } = makeCanvas(128, 128)
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
  g.addColorStop(0, 'rgba(0,0,0,0.75)')
  g.addColorStop(0.55, 'rgba(0,0,0,0.35)')
  g.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 128, 128)
  return tex(c)
}

/** Draws a team emblem into a canvas context. Used by the court, LED boards and UI. */
export function drawEmblem(ctx: CanvasRenderingContext2D, team: Pick<TeamInfo, 'abbr' | 'primary' | 'secondary' | 'name'>, cx: number, cy: number, r: number) {
  ctx.save()
  ctx.translate(cx, cy)
  // outer ring
  ctx.beginPath()
  ctx.arc(0, 0, r, 0, Math.PI * 2)
  ctx.fillStyle = team.secondary
  ctx.fill()
  ctx.beginPath()
  ctx.arc(0, 0, r * 0.9, 0, Math.PI * 2)
  ctx.fillStyle = team.primary
  ctx.fill()
  // ball seams
  ctx.strokeStyle = 'rgba(0,0,0,0.22)'
  ctx.lineWidth = r * 0.045
  ctx.beginPath()
  ctx.moveTo(-r * 0.9, 0)
  ctx.lineTo(r * 0.9, 0)
  ctx.moveTo(0, -r * 0.9)
  ctx.lineTo(0, r * 0.9)
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(-r * 1.25, 0, r * 0.95, -0.75, 0.75)
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(r * 1.25, 0, r * 0.95, Math.PI - 0.75, Math.PI + 0.75)
  ctx.stroke()
  // abbreviation
  ctx.fillStyle = '#ffffff'
  ctx.font = `italic 900 ${r * 0.78}px ${FONT_DISPLAY}`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.lineWidth = r * 0.09
  ctx.strokeStyle = team.secondary
  ctx.lineJoin = 'round'
  ctx.strokeText(team.abbr, 0, r * 0.04)
  ctx.fillText(team.abbr, 0, r * 0.04)
  ctx.restore()
}

const emblemCache = new Map<string, string>()
export function emblemDataUrl(team: Pick<TeamInfo, 'abbr' | 'primary' | 'secondary' | 'name' | 'id'>, size = 160) {
  const key = `${team.id}_${size}`
  const hit = emblemCache.get(key)
  if (hit) return hit
  const { c, ctx } = makeCanvas(size, size)
  drawEmblem(ctx, team, size / 2, size / 2, size / 2 - 2)
  const url = c.toDataURL('image/png')
  emblemCache.set(key, url)
  return url
}

export function makeCourtLogoTexture(team: TeamInfo) {
  const { c, ctx } = makeCanvas(512, 512)
  drawEmblem(ctx, team, 256, 256, 240)
  const t = tex(c)
  return t
}

export function makeTextTexture(text: string, color: string, opts: { w?: number; h?: number; font?: string; stroke?: string; align?: CanvasTextAlign } = {}) {
  const w = opts.w ?? 1024
  const h = opts.h ?? 192
  const { c, ctx } = makeCanvas(w, h)
  ctx.font = opts.font ?? `italic 900 ${h * 0.78}px ${FONT_DISPLAY}`
  ctx.textAlign = opts.align ?? 'center'
  ctx.textBaseline = 'middle'
  if (opts.stroke) {
    ctx.lineWidth = h * 0.06
    ctx.strokeStyle = opts.stroke
    ctx.strokeText(text, w / 2, h / 2)
  }
  ctx.fillStyle = color
  ctx.fillText(text, w / 2, h / 2 + h * 0.03)
  return tex(c)
}

/** Scrolling LED ribbon board content. */
export function makeLedTexture(segments: { text: string; bg: string; fg: string }[], h = 64) {
  const segW = h * 9
  const { c, ctx } = makeCanvas(segW * segments.length, h)
  segments.forEach((s, i) => {
    const x = i * segW
    const g = ctx.createLinearGradient(x, 0, x + segW, 0)
    g.addColorStop(0, s.bg)
    g.addColorStop(1, shadeHex(s.bg, -0.35))
    ctx.fillStyle = g
    ctx.fillRect(x, 0, segW, h)
    ctx.fillStyle = 'rgba(255,255,255,0.08)'
    for (let k = 0; k < 6; k++) {
      ctx.beginPath()
      ctx.moveTo(x + segW * 0.62 + k * h * 0.5, h)
      ctx.lineTo(x + segW * 0.62 + k * h * 0.5 + h * 0.6, 0)
      ctx.lineTo(x + segW * 0.62 + k * h * 0.5 + h * 0.75, 0)
      ctx.lineTo(x + segW * 0.62 + k * h * 0.5 + h * 0.15, h)
      ctx.fill()
    }
    ctx.fillStyle = s.fg
    ctx.font = `italic 800 ${h * 0.62}px ${FONT_DISPLAY}`
    ctx.textBaseline = 'middle'
    ctx.textAlign = 'left'
    ctx.fillText(s.text, x + h * 0.4, h * 0.54)
  })
  // LED pixel grid
  ctx.fillStyle = 'rgba(0,0,0,0.28)'
  for (let y = 0; y < h; y += 3) ctx.fillRect(0, y, c.width, 1)
  const t = tex(c)
  t.wrapS = THREE.RepeatWrapping
  return t
}

export function shadeHex(hex: string, amt: number) {
  const n = parseInt(hex.slice(1), 16)
  let r = (n >> 16) & 255
  let g = (n >> 8) & 255
  let b = n & 255
  if (amt < 0) {
    r = Math.round(r * (1 + amt))
    g = Math.round(g * (1 + amt))
    b = Math.round(b * (1 + amt))
  } else {
    r = Math.round(r + (255 - r) * amt)
    g = Math.round(g + (255 - g) * amt)
    b = Math.round(b + (255 - b) * amt)
  }
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`
}

/** Scoreboard canvas shared by the jumbotron screens. */
export class ScoreboardCanvas {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  texture: THREE.CanvasTexture
  constructor() {
    const { c, ctx } = makeCanvas(512, 288)
    this.canvas = c
    this.ctx = ctx
    this.texture = tex(c)
    this.draw(null, null, 0, 0, '', 'HOOP LEGACY')
  }
  draw(home: TeamInfo | null, away: TeamInfo | null, hs: number, as: number, clock: string, banner: string) {
    const { ctx } = this
    const W = 512
    const H = 288
    const g = ctx.createLinearGradient(0, 0, 0, H)
    g.addColorStop(0, '#0b0f18')
    g.addColorStop(1, '#05070b')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, W, H)
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    if (home && away) {
      drawEmblem(ctx, home, 92, 104, 58)
      drawEmblem(ctx, away, W - 92, 104, 58)
      ctx.fillStyle = '#ffffff'
      ctx.font = `900 112px ${FONT_DISPLAY}`
      ctx.fillText(String(hs), 205, 110)
      ctx.fillText(String(as), W - 205, 110)
      ctx.fillStyle = '#ff5b14'
      ctx.font = `800 40px ${FONT_DISPLAY}`
      ctx.fillText(clock, W / 2, 112)
    } else {
      ctx.fillStyle = '#ffffff'
      ctx.font = `italic 900 86px ${FONT_DISPLAY}`
      ctx.fillText('HOOP', W / 2, 78)
      ctx.fillStyle = '#ff5b14'
      ctx.fillText('LEGACY', W / 2, 160)
    }
    ctx.fillStyle = '#ff5b14'
    ctx.fillRect(0, H - 62, W, 62)
    ctx.fillStyle = '#0b0f18'
    ctx.font = `italic 800 38px ${FONT_DISPLAY}`
    ctx.fillText(banner.toUpperCase(), W / 2, H - 30)
    ctx.fillStyle = 'rgba(0,0,0,0.25)'
    for (let y = 0; y < H; y += 3) ctx.fillRect(0, y, W, 1)
    this.texture.needsUpdate = true
  }
}

export class ShotClockCanvas {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  texture: THREE.CanvasTexture
  last = ''
  constructor() {
    const { c, ctx } = makeCanvas(128, 64)
    this.canvas = c
    this.ctx = ctx
    this.texture = tex(c)
    this.draw('')
  }
  draw(text: string) {
    if (text === this.last) return
    this.last = text
    const { ctx } = this
    ctx.fillStyle = '#080808'
    ctx.fillRect(0, 0, 128, 64)
    ctx.fillStyle = '#ff2a1a'
    ctx.font = `800 56px ${FONT_DISPLAY}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(text, 64, 35)
    this.texture.needsUpdate = true
  }
}
