import * as THREE from 'three'
import { GLTFLoader, type GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'
import { onEngine } from '../../engine/runtime'
import { characterLod } from '../character/assets'
import { B, BONE_COUNT } from '../character/rig'

/**
 * Authored athlete assets (generated offline by tools/athletes, shipped in public/athletes). Only geometry
 * and textures are kept from each glTF: every mesh is baked into the rig's normalized A-pose model space
 * (height 1, three.js axes) with its skin joints remapped to rig bone indices by name, so it binds directly
 * to a Character's skeleton. Sets are loaded once per level and shared by every player.
 */

export type AthleteLevel = 'lod1' | 'lod0' | 'hero'

interface ManifestFile {
  file: string
  bytes: number
  sha256: string
}
export interface ManifestTexture extends ManifestFile {
  codec: 'etc1s' | 'uastc'
  srgb: boolean
}
export interface ManifestAsset {
  slot: string
  variant: string | null
  license: string
  glb: ManifestFile
  triangles: number
  vertices: number
  drawCalls: number
  meshes: { name: string; morphs: string[] }[]
  joints: string[]
  textures: Record<string, string>
  extras: Record<string, unknown>
}
export interface AthleteManifest {
  version: number
  bones: string[]
  levels: Partial<Record<AthleteLevel, { bytes: number; assets: Record<string, ManifestAsset>; textures: Record<string, ManifestTexture> }>>
}

export interface AthletePart {
  name: string
  geometry: THREE.BufferGeometry
  /** morph target names, in morphAttributes order */
  morphs: string[]
}
export interface AthleteAsset {
  name: string
  slot: string
  variant: string | null
  parts: AthletePart[]
  /** texture role (contract key) -> texture */
  textures: Record<string, THREE.Texture>
  extras: Record<string, unknown>
  triangles: number
}
export interface AthleteSet {
  level: AthleteLevel
  assets: Map<string, AthleteAsset>
  /** first asset in a slot, optionally a specific variant */
  slot(slot: string, variant?: string | null): AthleteAsset | undefined
  stats: { bytes: number; ms: number }
}

const BASE = `${import.meta.env.BASE_URL}athletes/`
const TRANSCODER = `${import.meta.env.BASE_URL}basis/`

let manifestP: Promise<AthleteManifest> | null = null
export function loadAthleteManifest() {
  manifestP ??= fetch(`${BASE}manifest.json`, { cache: 'no-cache' }).then((r) => {
    if (!r.ok) throw new Error(`athlete manifest: HTTP ${r.status}`)
    return r.json() as Promise<AthleteManifest>
  })
  return manifestP
}

let ktx2: KTX2Loader | null = null
let ktx2P: Promise<KTX2Loader> | null = null
/** KTX2 transcoding needs the renderer's compressed-format support, so textures wait for the engine. */
function ktx2Loader() {
  ktx2P ??= new Promise<KTX2Loader>((resolve) => {
    onEngine((e) => {
      if (ktx2) return
      ktx2 = new KTX2Loader().setTranscoderPath(TRANSCODER).detectSupport(e.renderer)
      resolve(ktx2)
    })
  })
  return ktx2P
}

let gltf: GLTFLoader | null = null
function gltfLoader() {
  if (!gltf) {
    gltf = new GLTFLoader()
    gltf.setMeshoptDecoder(MeshoptDecoder)
  }
  return gltf
}

const sets = new Map<AthleteLevel, AthleteSet>()
const pending = new Map<AthleteLevel, Promise<AthleteSet>>()
const failed = new Set<AthleteLevel>()

export const athleteSetReady = (level: AthleteLevel) => sets.has(level)
export const athleteSetFailed = (level: AthleteLevel) => failed.has(level)
export const getAthleteSet = (level: AthleteLevel) => sets.get(level) ?? null

/** The gameplay level for the current quality tier (lod1 on low and on medium handhelds). */
export function athleteGameLevel(): AthleteLevel {
  return characterLod() === 1 ? 'lod1' : 'lod0'
}

/** Loads (once) and returns a level's shared set. Rejects if the manifest has no such level or a file fails. */
export function loadAthleteSet(level: AthleteLevel): Promise<AthleteSet> {
  const done = sets.get(level)
  if (done) return Promise.resolve(done)
  let p = pending.get(level)
  if (!p) {
    p = buildSet(level).then(
      (s) => {
        sets.set(level, s)
        failed.delete(level)
        return s
      },
      (err) => {
        failed.add(level)
        pending.delete(level)
        throw err
      },
    )
    pending.set(level, p)
  }
  return p
}

/** Waits up to `timeoutMs` for a level; resolves null on timeout or failure (callers fall back to procedural). */
export function awaitAthleteSet(level: AthleteLevel, timeoutMs = 10000): Promise<AthleteSet | null> {
  const done = sets.get(level)
  if (done) return Promise.resolve(done)
  return new Promise((resolve) => {
    const t = setTimeout(() => resolve(null), timeoutMs)
    loadAthleteSet(level).then(
      (s) => {
        clearTimeout(t)
        resolve(s)
      },
      () => {
        clearTimeout(t)
        resolve(null)
      },
    )
  })
}

async function buildSet(level: AthleteLevel): Promise<AthleteSet> {
  const t0 = performance.now()
  const manifest = await loadAthleteManifest()
  const lv = manifest.levels[level]
  if (!lv) throw new Error(`athlete set ${level}: not in manifest`)
  if (manifest.bones.length !== BONE_COUNT || manifest.bones.some((n, i) => B[n as keyof typeof B] !== i)) throw new Error('athlete set: manifest bone table does not match the rig')

  const texP = new Map<string, Promise<THREE.Texture>>()
  const texture = (stem: string) => {
    let p = texP.get(stem)
    if (!p) {
      const t = lv.textures[stem]
      if (!t) throw new Error(`athlete set ${level}: texture ${stem} missing`)
      p = ktx2Loader().then((k) =>
        k.loadAsync(BASE + t.file).then((tex) => {
          tex.colorSpace = t.srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace
          tex.name = stem
          return tex
        }),
      )
      texP.set(stem, p)
    }
    return p
  }

  const entries = await Promise.all(
    Object.entries(lv.assets).map(async ([name, a]) => {
      const [g, ...texs] = await Promise.all([gltfLoader().loadAsync(BASE + a.glb.file), ...Object.values(a.textures).map(texture)])
      const keys = Object.keys(a.textures)
      const textures: Record<string, THREE.Texture> = {}
      keys.forEach((k, i) => (textures[k] = texs[i]))
      const asset: AthleteAsset = { name, slot: a.slot, variant: a.variant, parts: extractParts(g, name), textures, extras: a.extras, triangles: a.triangles }
      return [name, asset] as const
    }),
  )
  const assets = new Map(entries)
  return {
    level,
    assets,
    slot(slot, variant) {
      for (const a of assets.values()) if (a.slot === slot && (variant === undefined || a.variant === variant)) return a
      return undefined
    },
    stats: { bytes: lv.bytes, ms: performance.now() - t0 },
  }
}

const _m = new THREE.Matrix4()
const _bm = new THREE.Matrix4()
const _n = new THREE.Matrix3()
const _v = new THREE.Vector3()

/**
 * Bakes each glTF mesh into rig model space. The transform reproduces exactly what three's skinning does at
 * the rest pose (world * bindMatrixInverse * boneMatrix * bindMatrix), so it absorbs node transforms and the
 * dequantization that meshopt/KHR_mesh_quantization folds into the inverse bind matrices.
 */
function extractParts(g: GLTF, assetName: string): AthletePart[] {
  const parts: AthletePart[] = []
  g.scene.updateMatrixWorld(true)
  g.scene.traverse((o) => {
    const mesh = o as THREE.Mesh
    if (!mesh.isMesh) return
    const src = mesh.geometry
    const M = new THREE.Matrix4().copy(mesh.matrixWorld)
    let remap: number[] | null = null
    const sm = mesh as THREE.SkinnedMesh
    if (sm.isSkinnedMesh) {
      sm.skeleton.update()
      const bms = sm.skeleton.boneMatrices!
      _bm.fromArray(bms, 0)
      M.multiply(sm.bindMatrixInverse).multiply(_bm).multiply(sm.bindMatrix)
      // every joint must agree at rest; a mismatch means the export was not in its bind pose
      for (let j = 1; j < sm.skeleton.bones.length; j++) {
        _m.fromArray(bms, j * 16)
        for (let k = 0; k < 16; k++)
          if (Math.abs(_m.elements[k] - _bm.elements[k]) > 1e-3) {
            console.warn(`athlete asset ${assetName}: joint ${sm.skeleton.bones[j].name} is not at rest`)
            k = 16
          }
      }
      remap = sm.skeleton.bones.map((b) => {
        const i = B[b.name as keyof typeof B]
        if (i === undefined) throw new Error(`athlete asset ${assetName}: joint ${b.name} is not a rig bone`)
        return i
      })
    }
    _n.getNormalMatrix(M)
    // normal-matrix scale, so morph normal deltas keep the magnitude of unit normals
    const nScale = Math.cbrt(Math.abs(_n.determinant())) || 1
    const geo = new THREE.BufferGeometry()
    for (const [name, attr] of Object.entries(src.attributes)) {
      const a = attr as THREE.BufferAttribute | THREE.InterleavedBufferAttribute
      if (name === 'skinIndex') {
        const out = new Uint16Array(a.count * 4)
        for (let i = 0; i < a.count; i++) for (let c = 0; c < 4; c++) out[i * 4 + c] = remap ? remap[a.getComponent(i, c)] : 0
        geo.setAttribute(name, new THREE.BufferAttribute(out, 4))
        continue
      }
      const out = toFloat(a)
      if (name === 'position') new THREE.BufferAttribute(out, 3).applyMatrix4(M)
      else if (name === 'normal') {
        const b = new THREE.BufferAttribute(out, 3).applyNormalMatrix(_n)
        for (let i = 0; i < b.count; i++) {
          _v.fromBufferAttribute(b, i).normalize()
          b.setXYZ(i, _v.x, _v.y, _v.z)
        }
      } else if (name === 'tangent') {
        for (let i = 0; i < a.count; i++) {
          _v.set(out[i * 4], out[i * 4 + 1], out[i * 4 + 2]).transformDirection(M)
          out[i * 4] = _v.x
          out[i * 4 + 1] = _v.y
          out[i * 4 + 2] = _v.z
        }
      } else if (name === 'skinWeight') {
        for (let i = 0; i < a.count; i++) {
          const s = out[i * 4] + out[i * 4 + 1] + out[i * 4 + 2] + out[i * 4 + 3] || 1
          for (let c = 0; c < 4; c++) out[i * 4 + c] /= s
        }
      }
      geo.setAttribute(name, new THREE.BufferAttribute(out, a.itemSize))
    }
    const L = M.clone().setPosition(0, 0, 0)
    for (const [name, list] of Object.entries(src.morphAttributes)) {
      ;(geo.morphAttributes as Record<string, THREE.BufferAttribute[]>)[name] = list.map((attr) => {
        const out = toFloat(attr as THREE.BufferAttribute)
        const b = new THREE.BufferAttribute(out, 3)
        if (name === 'position') b.applyMatrix4(L)
        else if (name === 'normal') {
          b.applyNormalMatrix(_n)
          for (let i = 0; i < out.length; i++) out[i] /= nScale
        }
        return b
      })
    }
    geo.morphTargetsRelative = src.morphTargetsRelative
    if (src.index) geo.setIndex(new THREE.BufferAttribute(src.index.array.slice(), 1))
    geo.computeBoundingBox()
    geo.computeBoundingSphere()
    const dict = mesh.morphTargetDictionary ?? {}
    const morphs: string[] = []
    for (const [k, i] of Object.entries(dict)) morphs[i] = k
    geo.name = `${assetName}:${mesh.name}`
    parts.push({ name: mesh.name, geometry: geo, morphs })
    src.dispose()
  })
  return parts
}

/** Copies any (possibly quantized/normalized/interleaved) attribute into a plain Float32Array. */
function toFloat(a: THREE.BufferAttribute | THREE.InterleavedBufferAttribute) {
  const out = new Float32Array(a.count * a.itemSize)
  for (let i = 0; i < a.count; i++) for (let c = 0; c < a.itemSize; c++) out[i * a.itemSize + c] = a.getComponent(i, c)
  return out
}
