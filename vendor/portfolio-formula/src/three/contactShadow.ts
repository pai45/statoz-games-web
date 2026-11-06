import * as THREE from "three"

/**
 * Contact shadows shaped like what casts them. Each is painted once from a
 * few blurred shapes in the object's own frame (x across, z forward, metres):
 * darkest and tightest where a tyre or a boot meets the ground, softer under
 * the floor, faint and wide under parts held up off it. The painted plane is
 * laid flat under the object; the real shadow from the key light (high
 * quality) falls on top of it.
 */

export type ShadowBlob = {
  /** centre */
  x: number
  z: number
  /** full size across (x) and along (z) */
  w: number
  l: number
  /** 0 → 1: how dark it gets at its core */
  dark: number
  /** blur radius, metres */
  blur: number
  /** a rounded rectangle with this corner radius (metres); an ellipse when absent */
  round?: number
}

export type ContactShadow = {
  texture: THREE.Texture
  /** size of the plane it is painted for, and the z of its centre */
  width: number
  length: number
  z: number
}

/** pixels per metre */
const DENSITY = 110
const MAX_SIDE = 1024

function paint(blobs: ShadowBlob[]): ContactShadow {
  // a plane that covers every blob and its blur, so the falloff never clips
  let x0 = Infinity
  let x1 = -Infinity
  let z0 = Infinity
  let z1 = -Infinity
  for (const b of blobs) {
    const m = b.blur * 2.2
    x0 = Math.min(x0, b.x - b.w / 2 - m)
    x1 = Math.max(x1, b.x + b.w / 2 + m)
    z0 = Math.min(z0, b.z - b.l / 2 - m)
    z1 = Math.max(z1, b.z + b.l / 2 + m)
  }
  const half = Math.max(Math.abs(x0), Math.abs(x1))
  const width = half * 2
  const length = z1 - z0
  const px = Math.min(DENSITY, MAX_SIDE / Math.max(width, length))
  const canvas = document.createElement("canvas")
  canvas.width = Math.ceil(width * px)
  canvas.height = Math.ceil(length * px)
  const ctx = canvas.getContext("2d")!
  // darkness lives in the colour channels (an alphaMap reads green) over black
  ctx.fillStyle = "#000"
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  // overlapping shadows deepen without ever passing black
  ctx.globalCompositeOperation = "screen"
  // the canvas top is the plane's far (-z) edge once it is laid flat
  const X = (x: number) => (x + half) * px
  const Y = (z: number) => (z - z0) * px
  // blur by drawing each shape off the canvas and keeping only its shadow
  const away = canvas.width + 400
  for (const b of blobs) {
    const grey = Math.round(255 * b.dark)
    ctx.shadowColor = `rgb(${grey},${grey},${grey})`
    ctx.shadowBlur = b.blur * px * 2
    ctx.shadowOffsetX = away
    ctx.fillStyle = "#fff"
    ctx.beginPath()
    const cx = X(b.x) - away
    const cy = Y(b.z)
    const w = b.w * px
    const l = b.l * px
    if (b.round === undefined)
      ctx.ellipse(cx, cy, w / 2, l / 2, 0, 0, Math.PI * 2)
    else
      ctx.roundRect(
        cx - w / 2,
        cy - l / 2,
        w,
        l,
        Math.min(b.round * px, w / 2, l / 2),
      )
    ctx.fill()
  }
  const texture = new THREE.CanvasTexture(canvas)
  // raw values: the grey is an opacity, not a colour
  texture.colorSpace = THREE.NoColorSpace
  return { texture, width, length, z: (z0 + z1) / 2 }
}

type OpenWheeler = {
  /** wheel centres: z of each axle, x of each track */
  axleF: number
  axleR: number
  trackF: number
  trackR: number
  /** tyre widths */
  tyreF: number
  tyreR: number
  /** floor half width, and the z of the nose tip and the tail */
  floor: number
  nose: number
  tail: number
  /** front wing half span (just off the ground), rear wing half span (high up) */
  frontWing: number
  rearWing: number
}

/** An open-wheel racer: four tyres, a floor between them, a wing close to the ground at the front. */
function openWheeler(c: OpenWheeler): ShadowBlob[] {
  const blobs: ShadowBlob[] = [
    // the whole car shading the ground beneath it
    {
      x: 0,
      z: (c.nose + c.tail) / 2,
      w: c.trackF * 2 + c.tyreF,
      l: c.nose - c.tail,
      dark: 0.5,
      blur: 0.6,
      round: 0.6,
    },
    // the floor, a few centimetres off the asphalt
    {
      x: 0,
      z: (c.axleF * 0.8 + c.axleR) / 2,
      w: c.floor * 2,
      l: c.axleF * 0.8 - c.axleR,
      dark: 0.72,
      blur: 0.16,
      round: 0.25,
    },
    // nose and front wing
    {
      x: 0,
      z: c.nose - 0.25,
      w: c.frontWing * 2,
      l: 0.4,
      dark: 0.45,
      blur: 0.12,
      round: 0.1,
    },
    // rear wing, high up: barely there
    {
      x: 0,
      z: c.tail - 0.05,
      w: c.rearWing * 2,
      l: 0.35,
      dark: 0.12,
      blur: 0.35,
      round: 0.1,
    },
  ]
  for (const [z, track, tyre] of [
    [c.axleF, c.trackF, c.tyreF],
    [c.axleR, c.trackR, c.tyreR],
  ] as const)
    for (const side of [1, -1]) {
      // the shade round each tyre, then the dark line where it sits
      blobs.push({
        x: track * side,
        z,
        w: tyre + 0.18,
        l: 0.85,
        dark: 0.6,
        blur: 0.16,
      })
      blobs.push({
        x: track * side,
        z,
        w: tyre * 0.92,
        l: 0.42,
        dark: 0.92,
        blur: 0.045,
        round: 0.05,
      })
    }
  return blobs
}

const LAYOUTS = {
  f1: () =>
    openWheeler({
      axleF: 1.8,
      axleR: -1.8,
      trackF: 0.8,
      trackR: 0.785,
      tyreF: 0.3,
      tyreR: 0.4,
      floor: 0.78,
      nose: 3.3,
      tail: -2.55,
      frontWing: 0.93,
      rearWing: 0.47,
    }),
  f2: () =>
    openWheeler({
      axleF: 1.57,
      axleR: -1.57,
      trackF: 0.79,
      trackR: 0.77,
      tyreF: 0.27,
      tyreR: 0.36,
      floor: 0.7,
      nose: 2.6,
      tail: -2.55,
      frontWing: 0.9,
      rearWing: 0.47,
    }),
  f3: () =>
    openWheeler({
      axleF: 1.425,
      axleR: -1.425,
      trackF: 0.76,
      trackR: 0.74,
      tyreF: 0.24,
      tyreR: 0.31,
      floor: 0.62,
      nose: 2.36,
      tail: -2.3,
      frontWing: 0.86,
      rearWing: 0.45,
    }),
  // a kart: a low tube frame and seat between four small tyres
  kart: (): ShadowBlob[] => {
    const blobs: ShadowBlob[] = [
      { x: 0, z: 0.05, w: 1.35, l: 1.75, dark: 0.32, blur: 0.3, round: 0.4 },
      { x: 0, z: -0.05, w: 0.62, l: 1.3, dark: 0.5, blur: 0.1, round: 0.2 },
      // front fairing and rear bumper, low down
      { x: 0, z: 0.85, w: 0.9, l: 0.18, dark: 0.3, blur: 0.08, round: 0.06 },
      { x: 0, z: -0.82, w: 1.2, l: 0.12, dark: 0.25, blur: 0.08, round: 0.05 },
    ]
    for (const [z, x, tyre] of [
      [0.52, 0.53, 0.116],
      [-0.52, 0.6, 0.184],
    ] as const)
      for (const side of [1, -1]) {
        blobs.push({
          x: x * side,
          z,
          w: tyre + 0.1,
          l: 0.36,
          dark: 0.45,
          blur: 0.08,
        })
        blobs.push({
          x: x * side,
          z,
          w: tyre * 0.9,
          l: 0.16,
          dark: 0.92,
          blur: 0.025,
          round: 0.02,
        })
      }
    return blobs
  },
  // a driver standing: the dark under each boot inside the shade of the body
  driver: (): ShadowBlob[] => {
    const blobs: ShadowBlob[] = [
      { x: 0, z: 0.03, w: 0.66, l: 0.52, dark: 0.45, blur: 0.22 },
    ]
    for (const side of [1, -1]) {
      blobs.push({
        x: 0.11 * side,
        z: 0.05,
        w: 0.2,
        l: 0.38,
        dark: 0.62,
        blur: 0.08,
      })
      blobs.push({
        x: 0.11 * side,
        z: 0.06,
        w: 0.1,
        l: 0.27,
        dark: 0.85,
        blur: 0.025,
        round: 0.04,
      })
    }
    return blobs
  },
} satisfies Record<string, () => ShadowBlob[]>

export type ContactShadowKind = keyof typeof LAYOUTS

const cache = new Map<ContactShadowKind, ContactShadow>()

/** A contact shadow for a one-off object, painted from its own blobs (not cached). */
export function paintContactShadow(blobs: ShadowBlob[]) {
  return paint(blobs)
}

/** The contact shadow for a machine or the driver, painted on first use and then shared. */
export function getContactShadow(kind: ContactShadowKind) {
  let shadow = cache.get(kind)
  if (!shadow) {
    shadow = paint(LAYOUTS[kind]())
    cache.set(kind, shadow)
  }
  return shadow
}
