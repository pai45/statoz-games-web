import * as THREE from "three"
import type { Compound, Livery } from "@/data/types"
import { LIVERY_FONT, withAlpha } from "../fonts"
import type { CarPartKey } from "./carGeometry"
import { LIVERY_BOUNDS, type LiveryArt } from "./liveryArt"

export const COMPOUND_COLOURS: Record<Compound, string> = {
  soft: "#ef2b34",
  medium: "#ffd23f",
  hard: "#f1f1f1",
}

function canvasTexture(canvas: HTMLCanvasElement) {
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 8
  texture.needsUpdate = true
  return texture
}

/** Fit `text` in the livery face within `maxWidth`, starting from `size`. */
function fitLivery(
  ctx: CanvasRenderingContext2D,
  text: string,
  size: number,
  maxWidth: number,
) {
  for (; size > 24; size -= 4) {
    ctx.font = `italic 900 ${size}px ${LIVERY_FONT}`
    if (ctx.measureText(text).width <= maxWidth) break
  }
  return { size, width: ctx.measureText(text).width }
}

/** Wind cut: a wedge sliced out of the letters, widening to the right. */
function windCut(
  ctx: CanvasRenderingContext2D,
  from: number,
  to: number,
  y: number,
  thickness: number,
) {
  ctx.save()
  ctx.globalCompositeOperation = "destination-out"
  ctx.beginPath()
  ctx.moveTo(from, y)
  ctx.lineTo(to, y - thickness / 2)
  ctx.lineTo(to, y + thickness / 2)
  ctx.closePath()
  ctx.fill()
  ctx.restore()
}

/**
 * Sponsor wordmark for the sidepods and rear-wing endplates (4:1): the
 * site's display face at its widest, black italic, with a speed trail
 * dragging behind it, wind cuts through the letters and a tapered underline.
 */
export function createNameTexture(text: string, colour: string) {
  const W = 1024
  const H = 256
  const canvas = document.createElement("canvas")
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext("2d")!
  const label = text.toUpperCase()
  const { size, width } = fitLivery(ctx, label, 150, 780)
  const cap = size * 0.72
  const x = (W - width) / 2 + size * 0.14
  const base = H / 2 + cap / 2 - 6
  ctx.textBaseline = "alphabetic"
  ctx.textAlign = "left"
  ctx.fillStyle = colour
  // speed trail
  ctx.globalAlpha = 0.12
  ctx.fillText(label, x - size * 0.3, base)
  ctx.globalAlpha = 0.3
  ctx.fillText(label, x - size * 0.15, base)
  ctx.globalAlpha = 1
  ctx.fillText(label, x, base)
  windCut(ctx, x + width * 0.3, x + width + 24, base - cap * 0.36, cap * 0.07)
  windCut(ctx, x + width * 0.55, x + width + 24, base - cap * 0.64, cap * 0.05)
  // underline, slanted with the italics and fading out to the right
  const fade = ctx.createLinearGradient(x, 0, x + width * 0.9, 0)
  fade.addColorStop(0, colour)
  fade.addColorStop(1, withAlpha(colour, 0))
  ctx.fillStyle = fade
  const top = base + 14
  const bar = Math.max(6, size * 0.06)
  ctx.beginPath()
  ctx.moveTo(x - 4, top)
  ctx.lineTo(x + width * 0.9, top)
  ctx.lineTo(x + width * 0.9 - bar * 0.4, top + bar)
  ctx.lineTo(x - 4 - bar * 0.4, top + bar)
  ctx.closePath()
  ctx.fill()
  return canvasTexture(canvas)
}

/** Race number for the nose and engine-cover fin (1:1), in the livery face. */
export function createNumberTexture(number: string, colour: string) {
  const S = 256
  const canvas = document.createElement("canvas")
  canvas.width = S
  canvas.height = S
  const ctx = canvas.getContext("2d")!
  const { size, width } = fitLivery(ctx, number, 176, 214)
  const cap = size * 0.72
  const x = (S - width) / 2
  const base = S / 2 + cap / 2
  ctx.textBaseline = "alphabetic"
  ctx.textAlign = "left"
  // a dropped shadow lifts the figures off light paint
  ctx.fillStyle = "rgba(0,0,0,0.32)"
  ctx.fillText(number, x + 7, base + 6)
  ctx.fillStyle = colour
  ctx.fillText(number, x, base)
  windCut(ctx, x + width * 0.25, x + width + 16, base - cap * 0.45, cap * 0.07)
  return canvasTexture(canvas)
}

function paintParams(
  finish: Livery["finish"],
): THREE.MeshPhysicalMaterialParameters {
  switch (finish) {
    case "metallic":
      return {
        metalness: 0.35,
        roughness: 0.3,
        clearcoat: 1,
        clearcoatRoughness: 0.05,
      }
    case "satin":
      return {
        metalness: 0.15,
        roughness: 0.55,
        clearcoat: 0.35,
        clearcoatRoughness: 0.35,
      }
    default:
      return {
        metalness: 0.08,
        roughness: 0.3,
        clearcoat: 1,
        clearcoatRoughness: 0.04,
      }
  }
}

let shared: Record<"carbon" | "dark" | "rubber" | "rim" | "visor" | "glow", THREE.Material> | null =
  null

export function getSharedCarMaterials() {
  if (shared) return shared
  shared = {
    carbon: new THREE.MeshPhysicalMaterial({
      color: "#0b0c0e",
      roughness: 0.42,
      metalness: 0.25,
      clearcoat: 0.6,
      clearcoatRoughness: 0.25,
    }),
    dark: new THREE.MeshStandardMaterial({
      color: "#050506",
      roughness: 0.9,
      metalness: 0,
    }),
    rubber: new THREE.MeshStandardMaterial({
      color: "#111113",
      roughness: 0.88,
      metalness: 0,
    }),
    rim: new THREE.MeshStandardMaterial({
      color: "#1b1d21",
      roughness: 0.32,
      metalness: 0.85,
    }),
    visor: new THREE.MeshPhysicalMaterial({
      color: "#16181f",
      roughness: 0.05,
      metalness: 0.9,
      clearcoat: 1,
      clearcoatRoughness: 0.02,
    }),
    glow: new THREE.MeshBasicMaterial({
      color: new THREE.Color(6, 0.28, 0.22),
      toneMapped: false,
    }),
  }
  return shared
}

// Projects the livery artwork onto the paint in car space: flanks sample the
// side view (z, y), upward-facing panels the top view (z, x).
const LIVERY_VARYINGS = /* glsl */ `
varying vec3 vLiveryPos;
varying vec3 vLiveryNormal;
`
const LIVERY_UNIFORMS = /* glsl */ `
uniform sampler2D liverySide;
uniform sampler2D liveryTop;
uniform vec4 liveryBounds;
uniform float liveryHalfWidth;
`
const LIVERY_FRAGMENT = /* glsl */ `
{
  vec3 liveryNormal = normalize(vLiveryNormal);
  float liveryU = (vLiveryPos.z - liveryBounds.x) / (liveryBounds.y - liveryBounds.x);
  vec2 liverySideUv = vec2(liveryU, (vLiveryPos.y - liveryBounds.z) / (liveryBounds.w - liveryBounds.z));
  vec2 liveryTopUv = vec2(liveryU, vLiveryPos.x / (2.0 * liveryHalfWidth) + 0.5);
  vec3 liverySideColour = texture2D(liverySide, liverySideUv).rgb;
  vec3 liveryTopColour = texture2D(liveryTop, liveryTopUv).rgb;
  diffuseColor.rgb *= mix(liverySideColour, liveryTopColour, smoothstep(0.6, 0.8, abs(liveryNormal.y)));
}
`

function applyLivery(material: THREE.MeshPhysicalMaterial, art: LiveryArt) {
  const { zMin, zMax, yMin, yMax, halfWidth } = LIVERY_BOUNDS
  material.onBeforeCompile = (shader) => {
    shader.uniforms.liverySide = { value: art.side }
    shader.uniforms.liveryTop = { value: art.top }
    shader.uniforms.liveryBounds = {
      value: new THREE.Vector4(zMin, zMax, yMin, yMax),
    }
    shader.uniforms.liveryHalfWidth = { value: halfWidth }
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", `#include <common>\n${LIVERY_VARYINGS}`)
      .replace(
        "#include <begin_vertex>",
        "#include <begin_vertex>\nvLiveryPos = position;\nvLiveryNormal = normal;",
      )
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        `#include <common>\n${LIVERY_VARYINGS}${LIVERY_UNIFORMS}`,
      )
      .replace(
        "#include <map_fragment>",
        `#include <map_fragment>\n${LIVERY_FRAGMENT}`,
      )
  }
  // every livery shares the same program; only the uniforms differ
  material.customProgramCacheKey = () => "f1-livery-v1"
}

export type LiveryMaterials = {
  byPart: Record<CarPartKey, THREE.Material>
  nameDecal: THREE.MeshPhysicalMaterial
  numberDecal: THREE.MeshPhysicalMaterial
  paint: THREE.MeshPhysicalMaterial
  dispose: () => void
}

export function createLiveryMaterials(
  livery: Livery,
  name: string,
  number: string,
  art: LiveryArt,
): LiveryMaterials {
  const params = paintParams(livery.finish)
  // the artwork carries the body colour, so the paint itself is neutral
  const paint = new THREE.MeshPhysicalMaterial({
    color: "#ffffff",
    ...params,
  })
  applyLivery(paint, art)
  const paint2 = new THREE.MeshPhysicalMaterial({
    color: livery.secondary,
    ...params,
  })
  const stripe = new THREE.MeshStandardMaterial({
    color: COMPOUND_COLOURS[livery.compound],
    roughness: 0.55,
  })
  const nameTexture = createNameTexture(name, livery.decal)
  const numberTexture = createNumberTexture(number, livery.decal)
  const decal = (map: THREE.Texture) =>
    new THREE.MeshPhysicalMaterial({
      map,
      transparent: true,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -4,
      polygonOffsetUnits: -4,
      roughness: 0.3,
      metalness: 0.05,
      clearcoat: 1,
      clearcoatRoughness: 0.05,
    })
  const nameDecal = decal(nameTexture)
  const numberDecal = decal(numberTexture)
  const s = getSharedCarMaterials()
  return {
    paint,
    nameDecal,
    numberDecal,
    byPart: {
      paint,
      paint2,
      stripe,
      carbon: s.carbon,
      dark: s.dark,
      rubber: s.rubber,
      rim: s.rim,
      visor: s.visor,
      glow: s.glow,
    },
    dispose() {
      ;[paint, paint2, stripe, nameDecal, numberDecal].forEach((m) =>
        m.dispose(),
      )
      nameTexture.dispose()
      numberTexture.dispose()
    },
  }
}
