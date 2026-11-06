import * as THREE from "three"
import { caseStudies } from "@/data/caseStudies"
import { LIVERY_FONT } from "./fonts"
import { START_LINE_Z, TRACK_HALF_WIDTH, gridSlot } from "./layout"

function rand(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

/** Tileable asphalt: a normal map and a roughness map from layered noise. */
export function createAsphaltMaps(size = 512) {
  const r = rand(7)
  const height = new Float32Array(size * size)
  // aggregate stones + fine grain
  for (let i = 0; i < size * size; i++) height[i] = r() * 0.35
  for (let n = 0; n < size * 9; n++) {
    const cx = r() * size
    const cy = r() * size
    const rad = 1 + r() * 2.6
    const h = 0.4 + r() * 0.6
    for (let y = -3; y <= 3; y++)
      for (let x = -3; x <= 3; x++) {
        const d = Math.hypot(x, y)
        if (d > rad) continue
        const px = (Math.floor(cx + x) + size) % size
        const py = (Math.floor(cy + y) + size) % size
        height[py * size + px] = Math.max(
          height[py * size + px],
          h * (1 - d / (rad + 0.5)),
        )
      }
  }
  const normal = new Uint8Array(size * size * 4)
  const rough = new Uint8Array(size * size * 4)
  const at = (x: number, y: number) =>
    height[((y + size) % size) * size + ((x + size) % size)]
  for (let y = 0; y < size; y++)
    for (let x = 0; x < size; x++) {
      const dx = (at(x + 1, y) - at(x - 1, y)) * 2.2
      const dy = (at(x, y + 1) - at(x, y - 1)) * 2.2
      const len = Math.hypot(dx, dy, 1)
      const i = (y * size + x) * 4
      normal[i] = ((-dx / len) * 0.5 + 0.5) * 255
      normal[i + 1] = ((-dy / len) * 0.5 + 0.5) * 255
      normal[i + 2] = ((1 / len) * 0.5 + 0.5) * 255
      normal[i + 3] = 255
      const v = 150 + at(x, y) * 90
      rough[i] = rough[i + 1] = rough[i + 2] = Math.min(255, v)
      rough[i + 3] = 255
    }
  const make = (data: Uint8Array) => {
    const t = new THREE.DataTexture(data, size, size, THREE.RGBAFormat)
    t.wrapS = t.wrapT = THREE.RepeatWrapping
    t.magFilter = THREE.LinearFilter
    t.minFilter = THREE.LinearMipmapLinearFilter
    t.generateMipmaps = true
    t.needsUpdate = true
    return t
  }
  return { normalMap: make(normal), roughnessMap: make(rough) }
}

export const MARKINGS = {
  xMin: -TRACK_HALF_WIDTH - 0.6,
  xMax: TRACK_HALF_WIDTH + 0.6,
  zMin: -56,
  zMax: 26,
}

/** Painted grid: track edges, start line, chequered band, slot brackets and numbers. */
export function createMarkingsTexture(high: boolean) {
  const { xMin, xMax, zMin, zMax } = MARKINGS
  const W = high ? 1024 : 512
  const H = Math.round((W * (zMax - zMin)) / (xMax - xMin))
  const canvas = document.createElement("canvas")
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext("2d")!
  const sx = W / (xMax - xMin)
  const sz = H / (zMax - zMin)
  const X = (x: number) => (x - xMin) * sx
  const Z = (z: number) => (z - zMin) * sz
  const rect = (x0: number, z0: number, x1: number, z1: number) =>
    ctx.fillRect(
      X(Math.min(x0, x1)),
      Z(Math.min(z0, z1)),
      Math.abs(x1 - x0) * sx,
      Math.abs(z1 - z0) * sz,
    )

  const paint = "rgba(222, 224, 228, 0.86)"
  ctx.fillStyle = paint
  // track edges
  rect(-TRACK_HALF_WIDTH, zMin, -TRACK_HALF_WIDTH + 0.22, zMax)
  rect(TRACK_HALF_WIDTH - 0.22, zMin, TRACK_HALF_WIDTH, zMax)
  // start line + chequered band
  rect(-TRACK_HALF_WIDTH, START_LINE_Z, TRACK_HALF_WIDTH, START_LINE_Z + 0.32)
  const check = 0.62
  const bandZ = START_LINE_Z + 2.1
  for (let row = 0; row < 2; row++)
    for (let i = 0; i * check < TRACK_HALF_WIDTH * 2; i++) {
      if ((i + row) % 2) continue
      const x0 = -TRACK_HALF_WIDTH + i * check
      rect(
        x0,
        bandZ + row * check,
        Math.min(x0 + check, TRACK_HALF_WIDTH),
        bandZ + (row + 1) * check,
      )
    }
  // grid slots
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  for (const study of caseStudies) {
    const s = gridSlot(study.position)
    const front = s.z + 3.35
    const half = 1.15
    rect(s.x - half, front, s.x + half, front + 0.14)
    rect(s.x - half, front - 1.1, s.x - half + 0.14, front + 0.14)
    rect(s.x + half - 0.14, front - 1.1, s.x + half, front + 0.14)
    // slot number, painted beside the box on the outside of the grid
    const outward = Math.sign(s.x) || 1
    const numX = s.x + outward * 1.95
    ctx.save()
    ctx.translate(X(numX), Z(front - 0.55))
    ctx.font = `italic 900 ${Math.round(1.1 * sz)}px ${LIVERY_FONT}`
    ctx.fillText(String(study.position), 0, 0)
    ctx.restore()
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 8
  return texture
}

/** Soft radial falloff used for slot glows and light pools. */
export function createRadialTexture() {
  const size = 256
  const canvas = document.createElement("canvas")
  canvas.width = canvas.height = size
  const ctx = canvas.getContext("2d")!
  const g = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2,
  )
  g.addColorStop(0, "rgba(255,255,255,1)")
  g.addColorStop(0.35, "rgba(255,255,255,0.45)")
  g.addColorStop(1, "rgba(255,255,255,0)")
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)
  const t = new THREE.CanvasTexture(canvas)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

/** Rounded-rectangle outline glow for the selected grid slot. */
export function createSlotTexture() {
  const w = 256
  const h = 512
  const canvas = document.createElement("canvas")
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext("2d")!
  const r = 46
  const inset = 22
  ctx.shadowColor = "white"
  ctx.shadowBlur = 18
  ctx.strokeStyle = "white"
  ctx.lineWidth = 7
  ctx.beginPath()
  ctx.roundRect(inset, inset, w - inset * 2, h - inset * 2, r)
  ctx.stroke()
  const t = new THREE.CanvasTexture(canvas)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

/** Diamond-mesh catch fence (alpha). */
export function createFenceTexture() {
  const size = 64
  const canvas = document.createElement("canvas")
  canvas.width = canvas.height = size
  const ctx = canvas.getContext("2d")!
  ctx.strokeStyle = "rgba(255,255,255,0.9)"
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.lineTo(size, size)
  ctx.moveTo(size, 0)
  ctx.lineTo(0, size)
  ctx.stroke()
  const t = new THREE.CanvasTexture(canvas)
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  return t
}

/** Trackside LED board text, repeated along the barrier. */
export function createBoardTexture(text: string) {
  const canvas = document.createElement("canvas")
  canvas.width = 2048
  canvas.height = 96
  const ctx = canvas.getContext("2d")!
  ctx.fillStyle = "#06070a"
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.font = `italic 900 52px ${LIVERY_FONT}`
  ctx.textBaseline = "middle"
  ctx.fillStyle = "#f3f1ec"
  const label = text.toUpperCase()
  const gap = 90
  let x = 30
  let i = 0
  while (x < canvas.width) {
    ctx.fillStyle = i % 2 ? "#ff3b30" : "#f3f1ec"
    ctx.fillText(label, x, 50)
    x += ctx.measureText(label).width + gap
    i++
  }
  const t = new THREE.CanvasTexture(canvas)
  t.colorSpace = THREE.SRGBColorSpace
  t.wrapS = THREE.RepeatWrapping
  t.anisotropy = 8
  return t
}
