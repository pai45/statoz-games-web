import * as THREE from 'three'
import {
  BUILDS,
  G,
  GROUP_COUNT,
  WeightAccumulator,
  armWeights,
  bodySdf,
  legWeights,
  limbParam,
  neckWeights,
  torsoWeights,
} from './body'
import {
  JERSEY_Y0,
  SHORTS_Y0,
  jerseyEdges,
  jerseySdf,
  jerseySide,
  jerseyUV,
  keepOf,
  maskedField,
  shortsEdges,
  shortsSdf,
  shortsSide,
  shortsUV,
} from './garments'
import { handMesh, handSdf } from './hands'
import { B, bindPose } from './rig'
import { clipMesh, cullTriangles, fieldAO, surfaceNets, unionField, type MeshData, type V3 } from './sdf'
import { characterQuality } from './materials'
import { SOLE_Y, shoeMesh, shoeSdf } from './shoes'
import { isHandheld } from '../../engine/quality'

/** Geometry shared by every player with the same build (normalized units, bind pose). */
export interface BuildAssets {
  body: THREE.BufferGeometry
  jersey: THREE.BufferGeometry
  shorts: THREE.BufferGeometry
}

const buildCache = new Map<string, BuildAssets>()
const shoeGeo: (THREE.BufferGeometry | undefined)[] = []

/**
 * 0 = full detail, 1 = coarse meshes: the low tier everywhere, and the medium tier on phones and
 * tablets, where six full-detail athletes plus their shadow pass (~1.3M triangles) cost more than the
 * small screen can show. The savings pay for the floor reflection and post stack.
 */
export function characterLod() {
  const q = characterQuality()
  return q === 'low' || (q === 'medium' && isHandheld()) ? 1 : 0
}

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

function transformMesh(m: MeshData, mat: THREE.Matrix4, mirrorX: boolean): MeshData {
  const P = new Float32Array(m.positions.length)
  const N = new Float32Array(m.normals.length)
  const v = new THREE.Vector3()
  const n = new THREE.Vector3()
  const nm = new THREE.Matrix3().getNormalMatrix(mat)
  for (let i = 0; i < P.length; i += 3) {
    v.set(mirrorX ? -m.positions[i] : m.positions[i], m.positions[i + 1], m.positions[i + 2]).applyMatrix4(mat)
    n.set(mirrorX ? -m.normals[i] : m.normals[i], m.normals[i + 1], m.normals[i + 2]).applyMatrix3(nm).normalize()
    P[i] = v.x
    P[i + 1] = v.y
    P[i + 2] = v.z
    N[i] = n.x
    N[i + 1] = n.y
    N[i + 2] = n.z
  }
  const I = new Uint32Array(m.indices)
  if (mirrorX) for (let i = 0; i < I.length; i += 3) [I[i + 1], I[i + 2]] = [I[i + 2], I[i + 1]]
  return { positions: P, normals: N, indices: I }
}

function makeGeometry(m: MeshData, attrs: Record<string, [ArrayLike<number>, number]>, skinIndex: Uint16Array, skinWeight: Float32Array) {
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.BufferAttribute(m.positions, 3))
  g.setAttribute('normal', new THREE.BufferAttribute(m.normals, 3))
  for (const [k, [arr, size]] of Object.entries(attrs)) g.setAttribute(k, new THREE.BufferAttribute(arr instanceof Float32Array ? arr : new Float32Array(arr), size))
  g.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(skinIndex, 4))
  g.setAttribute('skinWeight', new THREE.Float32BufferAttribute(skinWeight, 4))
  g.setIndex(new THREE.BufferAttribute(m.indices, 1))
  return g
}

const handAO: (Float32Array | undefined)[] = []

export function getBuildAssets(index: number, lod = characterLod()): BuildAssets {
  const key = `${index}:${lod}`
  const hit = buildCache.get(key)
  if (hit) return hit
  const build = BUILDS[Math.max(0, Math.min(BUILDS.length - 1, index))]
  const bodyF = bodySdf(build)
  const jerseyF = jerseySdf(build)
  const shortsF = shortsSdf(build)
  const tmp: V3 = [0, 0, 0]
  const jKeep = (p: V3) => keepOf(jerseyEdges(p, build))
  const sKeep = (p: V3) => keepOf(shortsEdges(p))
  const jMasked = maskedField(jerseyF, jKeep)
  const sMasked = maskedField(shortsF, sKeep)

  // ---------------- body skin
  const h = lod ? 0.0092 : 0.0065
  const bb = bodyF.bounds()
  let body = surfaceNets(bodyF, [bb.min[0] - 2 * h, bb.min[1] - 2 * h, bb.min[2] - 2 * h], [bb.max[0] + 2 * h, bb.max[1] + 2 * h, bb.max[2] + 2 * h], h)
  body = cullTriangles(body, (x, y, z) => {
    tmp[0] = x
    tmp[1] = y
    tmp[2] = z
    if (y > JERSEY_Y0 && y < 0.86 && jerseyF.eval(x, y, z) < -0.0025 && jKeep(tmp) > 0.028) return true
    if (y > SHORTS_Y0 && y < 0.62 && shortsF.eval(x, y, z) < -0.0025 && sKeep(tmp) > 0.03) return true
    return false
  }).mesh
  const occluders = unionField(bodyF, jMasked, sMasked)
  const bodyAO = fieldAO(body, occluders, 0.0085, 1.0)
  const bvc = body.positions.length / 3

  // hands (shared sculpt, mirrored for the right side)
  const hand = handMesh(lod)
  const hAO = handAO[lod] ?? (handAO[lod] = fieldAO(hand, handSdf(), 0.0028, 0.9))
  const bp = bindPose()
  const hl = transformMesh(hand, bp.mat[B.handL], false)
  const hr = transformMesh(hand, bp.mat[B.handR], true)
  const hvc = hand.positions.length / 3
  const total = bvc + hvc * 2
  const P = new Float32Array(total * 3)
  const N = new Float32Array(total * 3)
  P.set(body.positions, 0)
  N.set(body.normals, 0)
  P.set(hl.positions, bvc * 3)
  N.set(hl.normals, bvc * 3)
  P.set(hr.positions, (bvc + hvc) * 3)
  N.set(hr.normals, (bvc + hvc) * 3)
  const I = new Uint32Array(body.indices.length + hand.indices.length * 2)
  I.set(body.indices, 0)
  for (let i = 0; i < hl.indices.length; i++) I[body.indices.length + i] = hl.indices[i] + bvc
  for (let i = 0; i < hr.indices.length; i++) I[body.indices.length + hl.indices.length + i] = hr.indices[i] + bvc + hvc
  const ao = new Float32Array(total)
  ao.set(bodyAO, 0)
  ao.set(hAO, bvc)
  ao.set(hAO, bvc + hvc)
  const region = new Float32Array(total * 2)
  const si = new Uint16Array(total * 4)
  const sw = new Float32Array(total * 4)
  const acc = new WeightAccumulator()
  const gd = new Float64Array(GROUP_COUNT)
  const gw = new Float64Array(GROUP_COUNT)
  for (let v = 0; v < bvc; v++) {
    const p: V3 = [P[v * 3], P[v * 3 + 1], P[v * 3 + 2]]
    bodyF.evalGroups(p[0], p[1], p[2], gd)
    let mn = Infinity
    let dom = 0
    for (let g = 0; g < GROUP_COUNT; g++) if (gd[g] < mn) {
      mn = gd[g]
      dom = g
    }
    let sum = 0
    for (let g = 0; g < GROUP_COUNT; g++) {
      gw[g] = gd[g] - mn > 0.03 ? 0 : Math.exp(-(gd[g] - mn) / 0.006)
      sum += gw[g]
    }
    for (let g = 0; g < GROUP_COUNT; g++) gw[g] /= sum
    acc.reset()
    torsoWeights(acc, p, gw[G.torso])
    neckWeights(acc, p, gw[G.neck])
    armWeights(acc, p, 1, gw[G.armL])
    armWeights(acc, p, -1, gw[G.armR])
    legWeights(acc, p, 1, gw[G.legL])
    legWeights(acc, p, -1, gw[G.legR])
    acc.write(si, sw, v * 4)
    const [code, t] = limbParam(p, dom)
    region[v * 2] = code
    region[v * 2 + 1] = t
  }
  for (let k = 0; k < 2; k++) {
    const right = k === 1
    for (let i = 0; i < hvc; i++) {
      const v = bvc + k * hvc + i
      const ly = hand.positions[i * 3 + 1]
      const toFa = smooth(-0.004, 0.014, ly) * 0.7
      si[v * 4] = right ? B.handR : B.handL
      sw[v * 4] = 1 - toFa
      si[v * 4 + 1] = right ? B.forearmR : B.forearmL
      sw[v * 4 + 1] = toFa
      region[v * 2] = 5
      region[v * 2 + 1] = 1
    }
  }
  const bodyGeo = makeGeometry({ positions: P, normals: N, indices: I }, { region: [region, 2], ao: [ao, 1] }, si, sw)

  // ---------------- jersey
  const gh = lod ? 0.0092 : 0.0066
  const jRaw = surfaceNets(jerseyF, [-0.17, JERSEY_Y0 - 0.02, -0.13], [0.17, 0.905, 0.13], gh)
  const jersey = clipMesh(jRaw, (x, y, z) => keepOf(jerseyEdges([x, y, z], build)))
  const jerseyGeo = garmentGeometry(jersey, unionField(bodyF, jerseyF), (p) => {
    const e = jerseyEdges(p, build)
    return { uv: jerseyUV(p), cloth: [e[0], e[1], jerseySide(p)] }
  }, (acc, p) => torsoWeights(acc, p, 1))

  // ---------------- shorts
  const sRaw = surfaceNets(shortsF, [-0.18, SHORTS_Y0 - 0.02, -0.13], [0.18, 0.63, 0.13], gh)
  const shorts = clipMesh(sRaw, (x, y, z) => keepOf(shortsEdges([x, y, z])))
  const shortsGeo = garmentGeometry(shorts, unionField(bodyF, shortsF), (p) => {
    const e = shortsEdges(p)
    return { uv: shortsUV(p), cloth: [e[0], e[1], shortsSide(p)] }
  }, (acc, p) => {
    const legW = smooth(0.535, 0.455, p[1])
    const side = smooth(-0.022, 0.022, p[0])
    torsoWeights(acc, p, 1 - legW)
    legWeights(acc, p, 1, legW * side, 0.7)
    legWeights(acc, p, -1, legW * (1 - side), 0.7)
  })

  const assets = { body: bodyGeo, jersey: jerseyGeo, shorts: shortsGeo }
  buildCache.set(key, assets)
  return assets
}

let prewarmQueued = false
/**
 * Generates the remaining body builds a few seconds after startup, one per idle slot, so later
 * match loads don't pay for the sculpt/mesh passes.
 */
export function prewarmCharacterAssets() {
  if (prewarmQueued || typeof window === 'undefined') return
  prewarmQueued = true
  const jobs = [() => getShoeGeometry(), () => getBuildAssets(1), () => getBuildAssets(2), () => getBuildAssets(0)]
  const idle = (cb: () => void) => {
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }
    if (w.requestIdleCallback) w.requestIdleCallback(cb, { timeout: 3000 })
    else window.setTimeout(cb, 200)
  }
  const next = () => {
    const job = jobs.shift()
    if (!job) return
    idle(() => {
      job()
      window.setTimeout(next, 900)
    })
  }
  window.setTimeout(next, 3500)
}

/** UVs with a wrap seam: triangles spanning u 0/1 get duplicated vertices shifted by +1. */
function garmentGeometry(
  mesh: MeshData,
  occ: ReturnType<typeof unionField>,
  attrs: (p: V3) => { uv: [number, number]; cloth: [number, number, number] },
  weights: (acc: WeightAccumulator, p: V3) => void,
) {
  const vc = mesh.positions.length / 3
  const ao = fieldAO(mesh, occ, 0.008, 0.9)
  const uv: number[] = []
  const cloth: number[] = []
  const P: number[] = Array.from(mesh.positions)
  const N: number[] = Array.from(mesh.normals)
  const AO: number[] = Array.from(ao)
  for (let v = 0; v < vc; v++) {
    const a = attrs([mesh.positions[v * 3], mesh.positions[v * 3 + 1], mesh.positions[v * 3 + 2]])
    uv.push(a.uv[0], a.uv[1])
    cloth.push(a.cloth[0], a.cloth[1], a.cloth[2])
  }
  const I = Array.from(mesh.indices)
  const dup = new Map<number, number>()
  for (let t = 0; t < I.length; t += 3) {
    const us = [uv[I[t] * 2], uv[I[t + 1] * 2], uv[I[t + 2] * 2]]
    if (Math.max(...us) - Math.min(...us) < 0.5) continue
    for (let c = 0; c < 3; c++) {
      const v = I[t + c]
      if (uv[v * 2] >= 0.5) continue
      let d = dup.get(v)
      if (d === undefined) {
        d = P.length / 3
        P.push(P[v * 3], P[v * 3 + 1], P[v * 3 + 2])
        N.push(N[v * 3], N[v * 3 + 1], N[v * 3 + 2])
        AO.push(AO[v])
        uv.push(uv[v * 2] + 1, uv[v * 2 + 1])
        cloth.push(cloth[v * 3], cloth[v * 3 + 1], cloth[v * 3 + 2])
        dup.set(v, d)
      }
      I[t + c] = d
    }
  }
  const n = P.length / 3
  const si = new Uint16Array(n * 4)
  const sw = new Float32Array(n * 4)
  const acc = new WeightAccumulator()
  for (let v = 0; v < n; v++) {
    acc.reset()
    weights(acc, [P[v * 3], P[v * 3 + 1], P[v * 3 + 2]])
    acc.write(si, sw, v * 4)
  }
  return makeGeometry(
    { positions: new Float32Array(P), normals: new Float32Array(N), indices: new Uint32Array(I) },
    { uv: [uv, 2], cloth: [cloth, 3], ao: [AO, 1] },
    si,
    sw,
  )
}

/** Both shoes (bind pose), with a shoe-space coordinate attribute for procedural colourways. */
export function getShoeGeometry(lod = characterLod()): THREE.BufferGeometry {
  const hit = shoeGeo[lod]
  if (hit) return hit
  const m = shoeMesh(lod)
  const ao = fieldAO(m, shoeSdf(), 0.003, 0.8)
  const bp = bindPose()
  const l = transformMesh(m, bp.mat[B.footL], false)
  const r = transformMesh(m, bp.mat[B.footR], true)
  const vc = m.positions.length / 3
  const P = new Float32Array(vc * 6)
  const N = new Float32Array(vc * 6)
  P.set(l.positions, 0)
  P.set(r.positions, vc * 3)
  N.set(l.normals, 0)
  N.set(r.normals, vc * 3)
  const I = new Uint32Array(m.indices.length * 2)
  I.set(l.indices, 0)
  for (let i = 0; i < r.indices.length; i++) I[m.indices.length + i] = r.indices[i] + vc
  const local = new Float32Array(vc * 6)
  local.set(m.positions, 0)
  local.set(m.positions, vc * 3)
  const AO = new Float32Array(vc * 2)
  AO.set(ao, 0)
  AO.set(ao, vc)
  const si = new Uint16Array(vc * 8)
  const sw = new Float32Array(vc * 8)
  for (let k = 0; k < 2; k++)
    for (let i = 0; i < vc; i++) {
      const v = k * vc + i
      const y = m.positions[i * 3 + 1]
      const toShin = smooth(-0.004, 0.012, y) * 0.55
      si[v * 4] = k ? B.footR : B.footL
      sw[v * 4] = 1 - toShin
      si[v * 4 + 1] = k ? B.shinR : B.shinL
      sw[v * 4 + 1] = toShin
    }
  const g = makeGeometry({ positions: P, normals: N, indices: I }, { shoeLocal: [local, 3], ao: [AO, 1] }, si, sw)
  shoeGeo[lod] = g
  void SOLE_Y
  return g
}
