// Screen-space overlay drawn every frame: reticles (scaled in true milliradians),
// ballistic assist, tag markers, hitmarkers, and damage cues.
import type { ReticleId } from './data.ts'

export type MarkerKind = 'hostile' | 'hvt' | 'civilian' | 'sniper'

export interface Marker {
  x: number
  y: number
  kind: MarkerKind
  label?: string
  distance: number
  onScreen: boolean
  angle: number
}

export interface OverlayFrame {
  width: number
  height: number
  scope: number
  radius: number
  pxPerMil: number
  reticle: ReticleId
  illuminated: boolean
  thermal: boolean
  assist: { x: number; y: number } | null
  markers: Marker[]
  hitAge: number
  hitKind: 'hit' | 'kill' | 'headshot' | 'armor' | null
  damage: Array<{ angle: number; age: number }>
  threat: { angle: number; strength: number } | null
  spread: number
  hidden: boolean
  zoomLabel: string
  cycling: boolean
}

const MARKER_COLORS: Record<MarkerKind, string> = {
  hostile: '#ff4a3d',
  sniper: '#ff4a3d',
  hvt: '#f5c04a',
  civilian: '#cfe6ff',
}

function line(ctx: CanvasRenderingContext2D, x0: number, y0: number, x1: number, y1: number): void {
  ctx.beginPath()
  ctx.moveTo(x0, y0)
  ctx.lineTo(x1, y1)
  ctx.stroke()
}

function drawReticle(ctx: CanvasRenderingContext2D, f: OverlayFrame, cx: number, cy: number): void {
  const R = f.radius
  const mil = f.pxPerMil
  const ink = f.thermal ? 'rgba(10,10,10,0.95)' : 'rgba(6,7,8,0.94)'
  const glow = f.illuminated ? '#ff3b2f' : ink
  ctx.save()
  ctx.beginPath()
  ctx.arc(cx, cy, R, 0, Math.PI * 2)
  ctx.clip()
  ctx.strokeStyle = ink
  ctx.fillStyle = ink
  ctx.lineCap = 'butt'
  const thin = Math.max(1, Math.min(1.6, mil * 0.035))
  const post = Math.max(3, Math.min(7, mil * 0.32))
  switch (f.reticle) {
    case 'mildot': {
      const inner = 10 * mil
      ctx.lineWidth = thin
      line(ctx, cx - inner, cy, cx + inner, cy)
      line(ctx, cx, cy - inner, cx, cy + inner)
      ctx.lineWidth = post
      line(ctx, cx - R, cy, cx - inner, cy)
      line(ctx, cx + inner, cy, cx + R, cy)
      line(ctx, cx, cy + inner, cx, cy + R)
      line(ctx, cx, cy - R, cx, cy - inner)
      const dot = Math.max(1.4, Math.min(3.2, mil * 0.11))
      for (let i = 1; i <= 9; i += 1) {
        for (const [dx, dy] of [
          [i, 0],
          [-i, 0],
          [0, i],
          [0, -i],
        ]) {
          ctx.beginPath()
          ctx.ellipse(cx + dx * mil, cy + dy * mil, dx ? dot * 0.8 : dot, dy ? dot * 0.8 : dot, 0, 0, Math.PI * 2)
          ctx.fill()
        }
      }
      break
    }
    case 'duplex': {
      const inner = Math.min(R * 0.42, 14 * mil)
      ctx.lineWidth = thin
      line(ctx, cx - inner, cy, cx + inner, cy)
      line(ctx, cx, cy - inner, cx, cy + inner)
      ctx.lineWidth = post * 1.4
      line(ctx, cx - R, cy, cx - inner, cy)
      line(ctx, cx + inner, cy, cx + R, cy)
      line(ctx, cx, cy + inner, cx, cy + R)
      line(ctx, cx, cy - R, cx, cy - inner)
      break
    }
    case 'horseshoe': {
      ctx.lineWidth = thin * 1.4
      ctx.beginPath()
      ctx.arc(cx, cy, 5 * mil, Math.PI * 0.62, Math.PI * 2.38)
      ctx.stroke()
      ctx.lineWidth = thin
      line(ctx, cx - 14 * mil, cy, cx - 6.5 * mil, cy)
      line(ctx, cx + 6.5 * mil, cy, cx + 14 * mil, cy)
      line(ctx, cx, cy - 14 * mil, cx, cy - 6.5 * mil)
      for (let i = 2; i <= 10; i += 2) line(ctx, cx - mil * (0.6 + i * 0.12), cy + i * mil, cx + mil * (0.6 + i * 0.12), cy + i * mil)
      line(ctx, cx, cy + 6.5 * mil, cx, cy + 11 * mil)
      ctx.lineWidth = post
      line(ctx, cx - R, cy, cx - 14 * mil, cy)
      line(ctx, cx + 14 * mil, cy, cx + R, cy)
      line(ctx, cx, cy + 14 * mil, cx, cy + R)
      line(ctx, cx, cy - R, cx, cy - 14 * mil)
      break
    }
    case 'tree': {
      ctx.lineWidth = thin
      line(ctx, cx - 12 * mil, cy, cx + 12 * mil, cy)
      line(ctx, cx, cy - 6 * mil, cx, cy + 12 * mil)
      for (let i = -12; i <= 12; i += 1) {
        if (i === 0) continue
        const h = i % 5 === 0 ? 0.55 : i % 2 === 0 ? 0.35 : 0.2
        line(ctx, cx + i * mil, cy - h * mil, cx + i * mil, cy + h * mil)
      }
      const dot = Math.max(1.1, Math.min(2.6, mil * 0.08))
      for (let row = 1; row <= 10; row += 1) {
        const y = cy + row * mil
        const width = 1 + row * 0.6
        line(ctx, cx - 0.3 * mil, y, cx + 0.3 * mil, y)
        for (let k = 0.5; k <= width; k += 0.5) {
          for (const s of [-1, 1]) {
            ctx.beginPath()
            ctx.arc(cx + s * k * mil, y, k % 1 === 0 ? dot : dot * 0.65, 0, Math.PI * 2)
            ctx.fill()
          }
        }
      }
      ctx.font = `600 ${Math.max(9, Math.min(13, mil * 0.6))}px "JetBrains Mono", monospace`
      ctx.textAlign = 'right'
      ctx.textBaseline = 'middle'
      for (const row of [2, 4, 6, 8, 10]) ctx.fillText(String(row), cx - (1.8 + row * 0.6) * mil, cy + row * mil)
      ctx.lineWidth = post
      line(ctx, cx - R, cy, cx - 13 * mil, cy)
      line(ctx, cx + 13 * mil, cy, cx + R, cy)
      line(ctx, cx, cy - R, cx, cy - 7 * mil)
      break
    }
  }
  // Illuminated centre aiming point.
  ctx.fillStyle = glow
  if (f.illuminated) {
    ctx.shadowColor = '#ff3b2f'
    ctx.shadowBlur = 6
  }
  ctx.beginPath()
  ctx.arc(cx, cy, Math.max(1.3, Math.min(2.4, mil * 0.08)), 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
  // Lens housing: rings, focus marks and the magnification readout.
  ctx.save()
  ctx.strokeStyle = 'rgba(0,0,0,0.65)'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.arc(cx, cy, R + 1, 0, Math.PI * 2)
  ctx.stroke()
  ctx.fillStyle = 'rgba(212,214,206,0.55)'
  ctx.font = '500 11px "JetBrains Mono", monospace'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  ctx.fillText(f.zoomLabel, cx, cy + R + 10)
  for (let i = 0; i < 48; i += 1) {
    const a = (i / 48) * Math.PI * 2
    const r0 = R + 14
    const r1 = R + (i % 4 === 0 ? 22 : 18)
    ctx.strokeStyle = 'rgba(212,214,206,0.12)'
    ctx.lineWidth = 1
    line(ctx, cx + Math.cos(a) * r0, cy + Math.sin(a) * r0, cx + Math.cos(a) * r1, cy + Math.sin(a) * r1)
  }
  ctx.restore()
}

function diamond(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string, fill: boolean): void {
  ctx.beginPath()
  ctx.moveTo(x, y - size)
  ctx.lineTo(x + size * 0.8, y)
  ctx.lineTo(x, y + size)
  ctx.lineTo(x - size * 0.8, y)
  ctx.closePath()
  ctx.strokeStyle = color
  ctx.lineWidth = 1.6
  ctx.stroke()
  if (fill) {
    ctx.globalAlpha *= 0.3
    ctx.fillStyle = color
    ctx.fill()
    ctx.globalAlpha /= 0.3
  }
}

export function drawOverlay(ctx: CanvasRenderingContext2D, f: OverlayFrame): void {
  const { width, height } = f
  ctx.clearRect(0, 0, width, height)
  if (f.hidden) return
  const cx = width / 2
  const cy = height / 2
  if (f.scope > 0.96) {
    drawReticle(ctx, f, cx, cy)
    if (f.assist) {
      const x = cx + f.assist.x
      const y = cy + f.assist.y
      if (Math.hypot(f.assist.x, f.assist.y) < f.radius - 6) {
        ctx.save()
        ctx.fillStyle = 'rgba(255,72,52,0.95)'
        ctx.shadowColor = 'rgba(255,72,52,0.9)'
        ctx.shadowBlur = 8
        ctx.beginPath()
        ctx.arc(x, y, 2.6, 0, Math.PI * 2)
        ctx.fill()
        ctx.strokeStyle = 'rgba(255,72,52,0.7)'
        ctx.lineWidth = 1.2
        ctx.shadowBlur = 0
        ctx.beginPath()
        ctx.arc(x, y, 7, 0, Math.PI * 2)
        ctx.stroke()
        ctx.restore()
      }
    }
  } else if (f.scope < 0.3) {
    // Hip view: centre dot and a spread ring that explains the inaccuracy.
    ctx.save()
    ctx.globalAlpha = 1 - f.scope * 3
    ctx.fillStyle = 'rgba(236,234,226,0.9)'
    ctx.beginPath()
    ctx.arc(cx, cy, 1.6, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = 'rgba(236,234,226,0.28)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.arc(cx, cy, Math.max(10, f.spread), 0, Math.PI * 2)
    ctx.stroke()
    ctx.restore()
  }
  // Tag markers.
  const clipR = f.scope > 0.96 ? f.radius - 18 : Math.min(width, height) * 0.46
  for (const marker of f.markers) {
    const color = MARKER_COLORS[marker.kind]
    ctx.save()
    let x = marker.x
    let y = marker.y
    const dx = x - cx
    const dy = y - cy
    const outside = !marker.onScreen || (f.scope > 0.96 && Math.hypot(dx, dy) > clipR) || x < 24 || x > width - 24 || y < 24 || y > height - 24
    if (outside) {
      const a = marker.onScreen ? Math.atan2(dy, dx) : marker.angle
      x = cx + Math.cos(a) * clipR
      y = cy + Math.sin(a) * clipR
      ctx.translate(x, y)
      ctx.rotate(a)
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.moveTo(9, 0)
      ctx.lineTo(-4, -6)
      ctx.lineTo(-4, 6)
      ctx.closePath()
      ctx.fill()
      ctx.restore()
      continue
    }
    diamond(ctx, x, y, marker.kind === 'hvt' ? 8 : 6.5, color, marker.kind === 'hvt')
    ctx.font = '600 10px "Barlow Condensed", sans-serif'
    ctx.textAlign = 'center'
    ctx.fillStyle = color
    if (marker.label) {
      ctx.textBaseline = 'bottom'
      ctx.fillText(marker.label.toUpperCase(), x, y - 11)
    }
    ctx.textBaseline = 'top'
    ctx.font = '500 10px "JetBrains Mono", monospace'
    ctx.fillText(`${Math.round(marker.distance)}m`, x, y + 10)
    ctx.restore()
  }
  // Duel threat cue (Recruit difficulty only).
  if (f.threat) {
    ctx.save()
    const r = Math.min(width, height) * 0.2
    ctx.strokeStyle = `rgba(255,70,50,${0.35 + 0.5 * f.threat.strength})`
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.arc(cx, cy, r, f.threat.angle - 0.22, f.threat.angle + 0.22)
    ctx.stroke()
    ctx.restore()
  }
  // Incoming-fire indicators.
  for (const cue of f.damage) {
    const alpha = Math.max(0, 1 - cue.age / 2.2)
    if (alpha <= 0) continue
    ctx.save()
    const r = Math.min(width, height) * 0.26
    ctx.strokeStyle = `rgba(220,40,30,${alpha * 0.85})`
    ctx.lineWidth = 6
    ctx.beginPath()
    ctx.arc(cx, cy, r, cue.angle - 0.28, cue.angle + 0.28)
    ctx.stroke()
    ctx.restore()
  }
  // Hitmarker.
  if (f.hitKind && f.hitAge < 0.45) {
    const alpha = 1 - f.hitAge / 0.45
    const kill = f.hitKind === 'kill' || f.hitKind === 'headshot'
    const gap = kill ? 9 : 7
    const len = kill ? 13 : 9
    ctx.save()
    ctx.strokeStyle = f.hitKind === 'armor' ? `rgba(160,190,255,${alpha})` : kill ? `rgba(255,64,48,${alpha})` : `rgba(240,238,230,${alpha})`
    ctx.lineWidth = kill ? 2.6 : 2
    for (const [sx, sy] of [
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
    ]) {
      line(ctx, cx + sx * gap, cy + sy * gap, cx + sx * (gap + len), cy + sy * (gap + len))
    }
    ctx.restore()
  }
}

/** Draws a reticle into a square preview canvas, showing roughly +/-16 mils. */
export function drawReticlePreview(ctx: CanvasRenderingContext2D, reticle: ReticleId, size: number, illuminated = false): void {
  ctx.clearRect(0, 0, size, size)
  const radius = size / 2 - 3
  const gradient = ctx.createRadialGradient(size / 2, size / 2, radius * 0.1, size / 2, size / 2, radius)
  gradient.addColorStop(0, '#c9cdbf')
  gradient.addColorStop(1, '#8b9184')
  ctx.fillStyle = gradient
  ctx.beginPath()
  ctx.arc(size / 2, size / 2, radius, 0, Math.PI * 2)
  ctx.fill()
  const frame: OverlayFrame = {
    width: size,
    height: size,
    scope: 1,
    radius,
    pxPerMil: radius / 16,
    reticle,
    illuminated,
    thermal: false,
    assist: null,
    markers: [],
    hitAge: 99,
    hitKind: null,
    damage: [],
    threat: null,
    spread: 0,
    hidden: false,
    zoomLabel: '',
    cycling: false,
  }
  drawReticle(ctx, frame, size / 2, size / 2)
}
