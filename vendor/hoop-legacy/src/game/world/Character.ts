import * as THREE from 'three'
import type { Appearance, HairStyle, JerseyStyle } from '../types'
import { characterLod, getBuildAssets, getShoeGeometry } from './character/assets'
import { buildIndex } from './character/body'
import { LASH_SWATCH, eyeTexture, irisVariant, paintFace, type FacePaint, type FacialHair } from './character/faceTexture'
import { buildHair, hairNoiseTexture, hairStrandTexture } from './character/hair'
import { EYE_R, earAnchor, earMesh, eyeCenter, faceKeep, faceParams, headSdf, lidCurve, meshFace, meshHead, type FaceMesh, type FaceParams } from './character/head'
import { characterQuality, getEyeMaterial, makeClothMaterial, makeGearMaterial, makeHairMaterial, makeHeadMaterial, makeShoeMaterial, makeSkinMaterial } from './character/materials'
import { paintJerseyPrint, paintShortsPrint } from './character/prints'
import { B, BONE_COUNT, OFFSETS, bindPose, clavicleAngles, createBones } from './character/rig'
import { fieldAO, type V3 } from './character/sdf'
import { LAYER_REFLECT } from '../engine/reflection'

export { B, BONE_COUNT }

export interface CharacterLook {
  heightCm: number
  appearance: Appearance
  jersey: JerseyStyle
  number: number
  bulk?: number
  /** stable per-player seed for facial structure and small style choices */
  seed?: number
  /** surname printed on the back of the jersey */
  name?: string
  /** team graphics (wordmark, crest) */
  team?: { name: string; abbr: string; primary: string; secondary: string } | null
}

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

function facialHairFor(ap: Appearance, seed: number): FacialHair {
  if (ap.facialHair) return ap.facialHair
  if (ap.beard) return (['goatee', 'beard', 'full', 'beard'] as const)[seed % 4]
  return seed % 3 === 0 ? 'stubble' : 'clean'
}

function lum(hex: string) {
  const c = new THREE.Color(hex)
  return 0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b
}

/**
 * A fully procedural athlete: sculpted SDF body and uniform (shared per build), plus a per-player head
 * (face sculpt, painted skin/hair texture, eyes, ears), hairstyle geometry, sneakers and gear. Everything
 * is skinned to one skeleton; the rig is authored at unit height and scaled to the player's height.
 */
export class Character {
  group = new THREE.Group()
  rig = new THREE.Group()
  /** body skin mesh (kept for API compatibility) */
  mesh: THREE.SkinnedMesh
  meshes: THREE.SkinnedMesh[] = []
  bones: THREE.Bone[]
  skeleton: THREE.Skeleton
  height: number
  bindHipY: number
  private owned: { dispose(): void }[] = []
  private sweatMats: THREE.Material[] = []
  private tmp = new THREE.Vector3()
  private qa = new THREE.Quaternion()
  private qc = new THREE.Quaternion()
  private eu = new THREE.Euler()
  private clavOut = { y: 0, z: 0 }

  constructor(look: CharacterLook) {
    this.height = look.heightCm / 100
    const H = this.height
    this.bindHipY = OFFSETS[0][1] * H
    const ap = look.appearance
    const J = look.jersey
    const seed = (look.seed ?? Math.floor(look.heightCm * 131 + look.number * 977)) >>> 0
    const bulk = look.bulk ?? 1 + (look.heightCm - 200) / 260
    const quality = characterQuality()

    // skeleton, bound in the sculpting (A) pose
    this.bones = createBones()
    this.rig.scale.setScalar(H)
    this.rig.add(this.bones[0])
    this.group.add(this.rig)
    this.group.updateMatrixWorld(true)
    this.skeleton = new THREE.Skeleton(this.bones)

    const assets = getBuildAssets(buildIndex(bulk))
    // parts too small to read in a blurred floor reflection stay out of the lite mirrored pass
    const noReflect = new Set<THREE.SkinnedMesh>()
    const add = (geo: THREE.BufferGeometry, mat: THREE.Material, shadow = true, reflect = true) => {
      const m = new THREE.SkinnedMesh(geo, mat)
      m.castShadow = shadow
      m.receiveShadow = false
      m.frustumCulled = false
      this.rig.add(m)
      this.meshes.push(m)
      if (!reflect) noReflect.add(m)
      return m
    }

    // ---- body + uniform
    const sockStripe = seed % 2 === 0 ? (lum(ap.sockColor) > 0.5 ? J.trim : ap.shoeAccent) : null
    const skinMat = makeSkinMaterial({ skin: ap.skin, armSleeve: ap.armSleeve, legSleeve: ap.legSleeve, sock: ap.sockColor, sockStripe })
    this.mesh = add(assets.body, skinMat)
    this.sweatMats.push(skinMat)
    const team = look.team ?? null
    const printSize = quality === 'low' ? 512 : 1024
    const spec = {
      number: look.number,
      name: look.name ?? '',
      teamName: team?.name ?? null,
      teamAbbr: team?.abbr ?? null,
      primary: team?.primary ?? J.trim,
      secondary: team?.secondary ?? J.base,
      base: J.base,
      numberColor: J.number,
      trim: J.trim,
      size: printSize,
    }
    const jPrint = paintJerseyPrint(spec)
    const sPrint = paintShortsPrint(spec)
    const jerseyMat = makeClothMaterial({ kind: 'jersey', base: J.base, trim: J.trim, trim2: J.number, panel: J.trim, print: jPrint })
    const shortsMat = makeClothMaterial({ kind: 'shorts', base: J.shorts, trim: J.trim, trim2: J.number, panel: J.trim, print: sPrint })
    add(assets.jersey, jerseyMat)
    add(assets.shorts, shortsMat)
    const whiteUpper = lum(ap.shoeColor) > 0.8
    const shoeMat = makeShoeMaterial({
      upper: ap.shoeColor,
      accent: ap.shoeAccent,
      sole: seed % 5 === 0 && !whiteUpper ? ap.shoeAccent : '#f1f1ee',
      outsole: seed % 3 === 0 ? '#a8763f' : whiteUpper ? ap.shoeAccent : '#2a2b2f',
      lace: whiteUpper ? '#f4f4f4' : seed % 2 ? ap.shoeColor : '#f4f4f4',
    })
    add(getShoeGeometry(), shoeMat)
    this.owned.push(skinMat, jerseyMat, shortsMat, shoeMat, jPrint, sPrint)

    // ---- head (expensive parts cached per look so a returning player is cheap)
    const facial = facialHairFor(ap, seed)
    const hd = headData(seed, ap, facial, quality === 'low' ? 512 : 1024)
    const f = hd.f
    const s = Math.pow(H / 2, 0.35) / H
    const headBone = bindPose().pos[B.head]
    const O: V3 = [headBone[0], headBone[1] + 0.125 * s, headBone[2] + 0.018 * s]
    const toModel = (p: V3, out: number[], o: number) => {
      out[o] = O[0] + p[0] * s
      out[o + 1] = O[1] + p[1] * s
      out[o + 2] = O[2] + p[2] * s
    }
    const scalpMap = new THREE.CanvasTexture(hd.paint.scalp)
    scalpMap.colorSpace = THREE.SRGBColorSpace
    scalpMap.anisotropy = 4
    const scalpRough = new THREE.CanvasTexture(hd.paint.scalpRough)
    const faceMap = new THREE.CanvasTexture(hd.paint.face)
    faceMap.colorSpace = THREE.SRGBColorSpace
    faceMap.anisotropy = 8
    const faceRough = new THREE.CanvasTexture(hd.paint.faceRough)
    const headGeo = this.headGeometry(hd, toModel)
    const headMat = makeHeadMaterial(scalpMap, scalpRough, faceMap, faceRough, ap.skin)
    add(headGeo, headMat)
    this.sweatMats.push(headMat)
    this.owned.push(headGeo, headMat, scalpMap, scalpRough, faceMap, faceRough)
    const eyeGeo = this.eyeGeometry(f, toModel)
    // eye textures and materials are shared per iris variant
    add(eyeGeo, getEyeMaterial(eyeTexture(irisVariant(seed))), false, false)
    this.owned.push(eyeGeo)

    // ---- hair
    for (const part of hd.hair) {
      const vc = part.positions.length / 3
      const P = new Float32Array(vc * 3)
      for (let i = 0; i < vc; i++) toModel([part.positions[i * 3], part.positions[i * 3 + 1], part.positions[i * 3 + 2]], P as unknown as number[], i * 3)
      const g = rigidGeometry(P, part.normals, part.indices, B.head, { uv: [part.uvs, 2], shell: [part.shell, 1], ao: [part.ao, 1] })
      const mat = makeHairMaterial(ap.hairColor, part.kind === 'shell' ? hairNoiseTexture() : hairStrandTexture(), part.kind === 'shell')
      add(g, mat, part.kind === 'strand' || ap.hair === 'afro' || ap.hair === 'hightop')
      this.owned.push(g, mat)
    }

    // ---- gear
    if (ap.headband) {
      const g = this.headbandGeometry(hd.hsdf, toModel, ap.hair)
      const mat = makeGearMaterial(ap.headband)
      add(g, mat, true, false)
      this.owned.push(g, mat)
    }
    if (ap.wristbands) {
      const mat = makeGearMaterial(ap.wristbands)
      add(wristbandGeometry(), mat, true, false)
      this.owned.push(mat)
    }

    this.rig.updateMatrixWorld(true)
    for (const m of this.meshes) m.bind(this.skeleton, m.matrixWorld.clone())
    // athletes always appear in the lacquered floor, even in the lite reflection
    for (const m of this.meshes) if (!noReflect.has(m)) m.layers.enable(LAYER_REFLECT)
    // rest pose = arms down; the animator drives everything from here
    for (let i = 0; i < BONE_COUNT; i++) this.bones[i].rotation.set(0, 0, 0)
  }

  /**
   * Head geometry: the ray-traced cranium with the face region cut away (and inset a hair so the face sits on
   * top at the seam), the surface-nets face, and the two ears. `faceFlag` selects the face texture set.
   */
  private headGeometry(hd: HeadData, toModel: (p: V3, out: number[], o: number) => void) {
    const hm = hd.hm
    const fm = hd.fm
    const f = hd.f
    const ao = hd.ao
    const ear = earMesh()
    const hv = hm.positions.length / 3
    const fv = fm.positions.length / 3
    const ev = ear.positions.length / 3
    const lash = lashRibbons(f, hd.hsdf)
    const lv = lash.positions.length / 3
    const total = hv + fv + ev * 2 + lv
    const P = new Float32Array(total * 3)
    const N = new Float32Array(total * 3)
    const UV = new Float32Array(total * 2)
    const FUV = new Float32Array(total * 2)
    const FF = new Float32Array(total)
    const AO = new Float32Array(total)
    for (let i = 0; i < hv; i++) {
      const nx = hm.normals[i * 3], ny = hm.normals[i * 3 + 1], nz = hm.normals[i * 3 + 2]
      const x = hm.positions[i * 3], y = hm.positions[i * 3 + 1], z = hm.positions[i * 3 + 2]
      // flush at the face edge, sinking under the face so it never pokes through
      const inset = 0.6 * Math.min(0.008, Math.max(0, faceKeep(x, y, z) + 0.0004))
      toModel([x - nx * inset, y - ny * inset, z - nz * inset], P as unknown as number[], i * 3)
      N[i * 3] = nx
      N[i * 3 + 1] = ny
      N[i * 3 + 2] = nz
      UV[i * 2] = hm.uvs[i * 2]
      UV[i * 2 + 1] = hm.uvs[i * 2 + 1]
      AO[i] = ao[i]
    }
    // keep cranium triangles outside the face plus a 6 mm band under its edge, and drop the stretched grid
    // triangles (jaw, under the chin) that reach deep under the face and would pierce it
    const idx: number[] = []
    const keepV = new Float32Array(hv)
    for (let i = 0; i < hv; i++) keepV[i] = faceKeep(hm.positions[i * 3], hm.positions[i * 3 + 1], hm.positions[i * 3 + 2])
    for (let t = 0; t < hm.indices.length; t += 3) {
      const a = hm.indices[t], b = hm.indices[t + 1], c = hm.indices[t + 2]
      const lo = Math.min(keepV[a], keepV[b], keepV[c])
      const hi = Math.max(keepV[a], keepV[b], keepV[c])
      if (lo > 0.006 || hi > 0.014) continue
      idx.push(a, b, c)
    }
    for (let i = 0; i < fv; i++) {
      const v = hv + i
      const x = fm.positions[i * 3], y = fm.positions[i * 3 + 1], z = fm.positions[i * 3 + 2]
      toModel([x, y, z], P as unknown as number[], v * 3)
      N[v * 3] = fm.normals[i * 3]
      N[v * 3 + 1] = fm.normals[i * 3 + 1]
      N[v * 3 + 2] = fm.normals[i * 3 + 2]
      const r = Math.hypot(x, y, z) || 1
      UV[v * 2] = Math.atan2(x, z) / (2 * Math.PI) + 0.5
      UV[v * 2 + 1] = 1 - Math.acos(Math.max(-1, Math.min(1, y / r))) / Math.PI
      FUV[v * 2] = fm.uvs[i * 2]
      FUV[v * 2 + 1] = fm.uvs[i * 2 + 1]
      // > 0.5 selects the face maps; the ramp above it fades the pores out toward the seam
      FF[v] = 0.51 + 0.49 * Math.min(1, faceKeep(x, y, z) / 0.012)
      AO[v] = hd.faceAo[i]
    }
    for (let t = 0; t < fm.indices.length; t++) idx.push(fm.indices[t] + hv)
    for (let k = 0; k < 2; k++) {
      const sd = k === 0 ? 1 : -1
      const anchor = earAnchor(f)
      const ang = -0.35 * sd
      const ca = Math.cos(ang), sa = Math.sin(ang)
      const es = f.earSize
      const base = hv + fv + k * ev
      for (let i = 0; i < ev; i++) {
        const x = ear.positions[i * 3] * sd * es, y = ear.positions[i * 3 + 1] * es, z = ear.positions[i * 3 + 2] * es
        const rx = x * ca + z * sa
        const rz = -x * sa + z * ca
        toModel([anchor[0] * sd + rx, anchor[1] + y, anchor[2] + rz], P as unknown as number[], (base + i) * 3)
        const nx = ear.normals[i * 3] * sd, ny = ear.normals[i * 3 + 1], nz = ear.normals[i * 3 + 2]
        N[(base + i) * 3] = nx * ca + nz * sa
        N[(base + i) * 3 + 1] = ny
        N[(base + i) * 3 + 2] = -nx * sa + nz * ca
        // sample clean forehead skin from the face texture
        UV[(base + i) * 2] = 0.5
        UV[(base + i) * 2 + 1] = 0.6
        AO[base + i] = 0.6 + 0.4 * smooth(-0.004, 0.006, ear.positions[i * 3])
      }
      for (let t = 0; t < ear.indices.length; t += 3) {
        const a = ear.indices[t] + base, b = ear.indices[t + 1] + base, c = ear.indices[t + 2] + base
        if (sd > 0) idx.push(a, b, c)
        else idx.push(a, c, b)
      }
    }
    // lashes: matte like the skin, coloured by the lash swatch painted in the face map's unused corner
    const lb = hv + fv + ev * 2
    for (let i = 0; i < lv; i++) {
      const v = lb + i
      toModel([lash.positions[i * 3], lash.positions[i * 3 + 1], lash.positions[i * 3 + 2]], P as unknown as number[], v * 3)
      N[v * 3] = lash.normals[i * 3]
      N[v * 3 + 1] = lash.normals[i * 3 + 1]
      N[v * 3 + 2] = lash.normals[i * 3 + 2]
      FUV[v * 2] = LASH_SWATCH[0]
      FUV[v * 2 + 1] = LASH_SWATCH[1]
      FF[v] = 1
      AO[v] = 0.55
    }
    for (let t = 0; t < lash.indices.length; t++) idx.push(lash.indices[t] + lb)
    return rigidGeometry(P, N, new Uint32Array(idx), B.head, { uv: [UV, 2], ao: [AO, 1], faceUv: [FUV, 2], faceFlag: [FF, 1] })
  }

  /**
   * Eyeballs with the poles on the gaze axis (so the latitude rings circle the iris) and a cornea bulge over
   * the iris with analytic normals.
   */
  private eyeGeometry(f: FaceParams, toModel: (p: V3, out: number[], o: number) => void) {
    const r = EYE_R * f.eyeSize
    const sph = new THREE.SphereGeometry(r, 24, 16)
    sph.rotateX(Math.PI / 2)
    const sp = sph.getAttribute('position')
    const si = sph.getIndex()!
    const vc = sp.count
    const P: number[] = []
    const N: number[] = []
    const UV: number[] = []
    const idx: number[] = []
    const smooth01 = (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t))
    for (const sd of [1, -1] as const) {
      const c = eyeCenter(f, sd)
      const base = P.length / 3
      for (let i = 0; i < vc; i++) {
        const dx = sp.getX(i) / r, dy = sp.getY(i) / r, dz = sp.getZ(i) / r
        // cornea: R(a) = r (1 + 0.06 k^2), k a smoothstep of cos(a) from 0.8 to 1
        const t = (dz - 0.8) / 0.2
        const k = smooth01(t)
        const dk = t > 0 && t < 1 ? (6 * t * (1 - t)) / 0.2 : 0
        const R = r * (1 + 0.06 * k * k)
        const sa = Math.sqrt(Math.max(0, 1 - dz * dz))
        const dR = r * 0.12 * k * dk * -sa
        let nx = R * dx, ny = R * dy, nz = R * dz
        if (sa > 1e-5) {
          nx -= dR * ((dz * dx) / sa)
          ny -= dR * ((dz * dy) / sa)
          nz -= dR * -sa
        }
        const nl = Math.hypot(nx, ny, nz) || 1
        const o = P.length
        P.length += 3
        toModel([c[0] + dx * R, c[1] + dy * R, c[2] + dz * R], P, o)
        N.push(nx / nl, ny / nl, nz / nl)
        UV.push(0.5 + dx / 2, 0.5 + dy / 2)
      }
      for (let t = 0; t < si.count; t++) idx.push(si.getX(t) + base)
    }
    sph.dispose()
    const vcount = P.length / 3
    return rigidGeometry(new Float32Array(P), new Float32Array(N), new Uint32Array(idx), B.head, { uv: [new Float32Array(UV), 2], ao: [new Float32Array(vcount).fill(1), 1] })
  }

  private headbandGeometry(hsdf: ReturnType<typeof headSdf>, toModel: (p: V3, out: number[], o: number) => void, hair: HairStyle) {
    const seg = 48
    const rows = [-0.0125, 0.0125]
    const P: number[] = []
    const N: number[] = []
    const idx: number[] = []
    const tilt = -0.26
    const lift = hair === 'afro' || hair === 'hightop' ? 0.012 : hair === 'fade' || hair === 'twists' ? 0.007 : 0.0035
    for (let i = 0; i <= seg; i++) {
      const a = (i / seg) * Math.PI * 2
      for (const h of rows) {
        // direction on a tilted ring around the head, pushed onto the scalp
        const y0 = 0.052 + h
        let d: V3 = [Math.sin(a) * 0.08, y0, Math.cos(a) * 0.1 - 0.01]
        const cy = Math.cos(tilt), sy = Math.sin(tilt)
        d = [d[0], d[1] * cy - d[2] * sy * 0.35, d[2]]
        const len = Math.hypot(d[0], d[1], d[2])
        const dir: V3 = [d[0] / len, d[1] / len, d[2] / len]
        let r = 0.16
        for (let it = 0; it < 80; it++) {
          const dv = hsdf.eval(dir[0] * r, dir[1] * r, dir[2] * r)
          if (dv < 1e-4) break
          r -= Math.min(0.006, Math.max(dv * 0.9, 0.0003))
        }
        r += lift
        const p: V3 = [dir[0] * r, dir[1] * r, dir[2] * r]
        toModel(p, P, P.length)
        const n = [Math.sin(a), 0.15 * Math.sign(h), Math.cos(a)]
        const nl = Math.hypot(n[0], n[1], n[2])
        N.push(n[0] / nl, n[1] / nl, n[2] / nl)
      }
    }
    for (let i = 0; i < seg; i++) {
      const a = i * 2
      idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3)
    }
    const vc = P.length / 3
    return rigidGeometry(new Float32Array(P), new Float32Array(N), new Uint32Array(idx), B.head, { ao: [new Float32Array(vc).fill(0.9), 1] })
  }

  /**
   * Applies a pose (Euler XYZ per bone, hip offset in metres). The clavicles are derived from the upper-arm
   * pose so raised arms lift the shoulder girdle; the arm rotation is compensated so the authored arm
   * direction is preserved.
   */
  applyPose(rot: Float32Array, hipX: number, hipY: number, hipZ: number) {
    for (let i = 0; i < 17; i++) {
      if (i === B.upperArmL || i === B.upperArmR) continue
      this.bones[i].rotation.set(rot[i * 3], rot[i * 3 + 1], rot[i * 3 + 2])
    }
    for (const side of [1, -1] as const) {
      const ua = side > 0 ? B.upperArmL : B.upperArmR
      this.eu.set(rot[ua * 3], rot[ua * 3 + 1], rot[ua * 3 + 2])
      this.qa.setFromEuler(this.eu)
      clavicleAngles(this.qa, side, this.clavOut)
      const clav = this.bones[side > 0 ? B.clavicleL : B.clavicleR]
      clav.rotation.set(0, this.clavOut.y, this.clavOut.z)
      this.qc.setFromEuler(clav.rotation).invert()
      this.bones[ua].quaternion.copy(this.qc.multiply(this.qa))
    }
    const H = this.height
    this.bones[0].position.set(hipX / H, OFFSETS[0][1] + hipY / H, hipZ / H)
  }

  /** Sweat sheen 0..1 (raises skin gloss over a game). */
  setSweat(v: number) {
    for (const m of this.sweatMats) {
      const u = m.userData.uniforms
      if (u?.uSweat) u.uSweat.value = v
      if ((m as THREE.MeshPhysicalMaterial).isMeshPhysicalMaterial) (m as THREE.MeshPhysicalMaterial).clearcoat = 0.1 + 0.4 * v
    }
  }

  /** World-space position of a palm (call after the group matrices are current). */
  handWorld(right: boolean, out: THREE.Vector3) {
    const bone = this.bones[right ? B.handR : B.handL]
    this.tmp.set(0, -0.036, 0.004)
    bone.updateWorldMatrix(true, false)
    return out.copy(this.tmp).applyMatrix4(bone.matrixWorld)
  }

  boneWorld(index: number, out: THREE.Vector3) {
    const bone = this.bones[index]
    bone.updateWorldMatrix(true, false)
    return out.setFromMatrixPosition(bone.matrixWorld)
  }

  dispose() {
    for (const o of this.owned) o.dispose()
    this.skeleton.dispose()
    this.group.removeFromParent()
  }
}

/**
 * Upper lash ribbons rooted on the lid margin, in head space, long in the middle and curling up (the lower
 * lashes are painted). Both windings, since they are seen from above and below.
 */
function lashRibbons(f: FaceParams, sdf: ReturnType<typeof headSdf>) {
  const P: number[] = []
  const N: number[] = []
  const I: number[] = []
  const n = 12
  for (const sd of [1, -1] as const) {
    const c = eyeCenter(f, sd)
    const roots = lidCurve(f, sd, true, n, 0, 0.00012)
    const rb = P.length / 3
    for (let i = 0; i <= n; i++) {
      const t = i / n
      const p: V3 = [roots[i][0], roots[i][1], roots[i][2]]
      // the rounded lid margin sits a little above the shell curve: step up onto the lid
      if (t > 0.08 && t < 0.92) for (let k = 0; k < 6 && sdf.eval(p[0], p[1], p[2]) > 0.0001; k++) p[1] += 0.00015
      let ox = p[0] - c[0], oz = p[2] - c[2]
      const oy = p[1] - c[1]
      const ol = Math.hypot(ox, oy, oz) || 1
      ox /= ol
      oz /= ol
      const len = (0.0011 + 0.0015 * Math.sin(Math.PI * Math.min(1, 0.15 + t))) * (t < 0.06 ? 0.3 : 1)
      const tip: V3 = [p[0] + ox * len * 0.7 + sd * len * 0.25 * t, p[1] + len * 0.72, p[2] + oz * len * 0.7]
      for (const q of [p, tip]) {
        P.push(q[0], q[1], q[2])
        N.push(ox, Math.max(oy / ol, 0.3), oz)
      }
    }
    for (let i = 0; i < n; i++) {
      const a = rb + i * 2, b = a + 1, c2 = a + 2, d = a + 3
      I.push(a, c2, b, b, c2, d, a, b, c2, b, d, c2)
    }
  }
  return { positions: new Float32Array(P), normals: new Float32Array(N), indices: new Uint32Array(I) }
}

interface HeadData {
  f: FaceParams
  hsdf: ReturnType<typeof headSdf>
  hm: ReturnType<typeof meshHead>
  ao: Float32Array
  fm: FaceMesh
  faceAo: Float32Array
  hair: ReturnType<typeof buildHair>
  paint: FacePaint
}

const headCache = new Map<string, HeadData>()

/** Head sculpt, occlusion, painted face and hair for a look, kept in a small LRU. */
function headData(seed: number, ap: Appearance, facial: FacialHair, size: number): HeadData {
  const lod = characterLod()
  const key = [seed, ap.skin, ap.hair, ap.hairColor, facial, size, lod].join('|')
  const hit = headCache.get(key)
  if (hit) {
    headCache.delete(key)
    headCache.set(key, hit)
    return hit
  }
  const f = faceParams(seed)
  const hsdf = headSdf(f)
  const hm = meshHead(f, lod, hsdf)
  const ao = fieldAO(hm, hsdf, 0.004, 0.5)
  const fm = meshFace(hsdf, lod)
  // same occlusion as the cranium so the two agree at the seam
  const faceAo = fieldAO(fm, hsdf, 0.004, 0.5)
  const paint = paintFace({ skin: ap.skin, hair: ap.hairColor, style: ap.hair, facial, face: f, seed, size, sdf: hsdf })
  const data: HeadData = { f, hsdf, hm, ao, fm, faceAo, hair: buildHair(ap.hair as HairStyle, hsdf, hm, seed, lod), paint }
  headCache.set(key, data)
  while (headCache.size > 8) headCache.delete(headCache.keys().next().value as string)
  return data
}

/** Geometry rigidly skinned to one bone. */
function rigidGeometry(P: Float32Array, N: Float32Array, I: Uint32Array, bone: number, attrs: Record<string, [Float32Array, number]>) {
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.BufferAttribute(P, 3))
  g.setAttribute('normal', new THREE.BufferAttribute(N, 3))
  for (const [k, [a, n]] of Object.entries(attrs)) g.setAttribute(k, new THREE.BufferAttribute(a, n))
  const vc = P.length / 3
  const si = new Uint16Array(vc * 4)
  const sw = new Float32Array(vc * 4)
  for (let i = 0; i < vc; i++) {
    si[i * 4] = bone
    sw[i * 4] = 1
  }
  g.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(si, 4))
  g.setAttribute('skinWeight', new THREE.Float32BufferAttribute(sw, 4))
  g.setIndex(new THREE.BufferAttribute(I, 1))
  return g
}

let wristCache: THREE.BufferGeometry | null = null
/** Terry wristbands on both forearms (bind pose), shared. */
function wristbandGeometry() {
  if (wristCache) return wristCache
  const bp = bindPose()
  const P: number[] = []
  const N: number[] = []
  const SI: number[] = []
  const SW: number[] = []
  const idx: number[] = []
  const seg = 20
  for (const side of [1, -1]) {
    const mat = bp.mat[side > 0 ? B.forearmL : B.forearmR]
    const nm = new THREE.Matrix3().getNormalMatrix(mat)
    const base = P.length / 3
    const ys = [-0.141, -0.128, -0.115]
    for (let i = 0; i <= seg; i++) {
      const a = (i / seg) * Math.PI * 2
      for (let r = 0; r < ys.length; r++) {
        const bulge = r === 1 ? 1.06 : 1
        const v = new THREE.Vector3(Math.cos(a) * 0.0142 * bulge, ys[r], Math.sin(a) * 0.0186 * bulge).applyMatrix4(mat)
        const n = new THREE.Vector3(Math.cos(a) / 0.0142, (r - 1) * 18, Math.sin(a) / 0.0186).normalize().applyMatrix3(nm).normalize()
        P.push(v.x, v.y, v.z)
        N.push(n.x, n.y, n.z)
        SI.push(side > 0 ? B.forearmL : B.forearmR, side > 0 ? B.handL : B.handR, 0, 0)
        const toHand = r === 0 ? 0.3 : r === 1 ? 0.12 : 0.02
        SW.push(1 - toHand, toHand, 0, 0)
      }
    }
    for (let i = 0; i < seg; i++)
      for (let r = 0; r < ys.length - 1; r++) {
        const a = base + i * ys.length + r
        const b = a + ys.length
        if (side > 0) idx.push(a, a + 1, b, a + 1, b + 1, b)
        else idx.push(a, b, a + 1, a + 1, b, b + 1)
      }
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3))
  g.setAttribute('normal', new THREE.Float32BufferAttribute(N, 3))
  g.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(SI, 4))
  g.setAttribute('skinWeight', new THREE.Float32BufferAttribute(SW, 4))
  g.setIndex(idx)
  wristCache = g
  return g
}
