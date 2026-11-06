import * as THREE from 'three'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'
import { COURT } from '../sim/court'
import type { TeamInfo } from '../types'
import {
  CROWD_POSES,
  ScoreboardCanvas,
  makeCourtLogoTexture,
  makeCrowdAtlas,
  makeGlowTexture,
  makeLedTexture,
  makeTextTexture,
  makeWoodTextures,
  shadeHex,
} from './textures'
import { mulberry32 } from '../../data/rng'
import type { QualitySettings } from '../engine/quality'
import { LAYER_FLOOR, LAYER_REFLECT, makeReflective } from '../engine/reflection'

const CENTER_Z = COURT.halfCourtZ
const FLOOR_HALF_X = COURT.halfWidth + 5.2
const FLOOR_MIN_Z = COURT.baselineZ - 6.2
const FLOOR_MAX_Z = COURT.farBaselineZ + 6.2

class LineBuilder {
  geos: THREE.BufferGeometry[] = []
  y: number
  constructor(y: number) {
    this.y = y
  }
  rect(x0: number, z0: number, x1: number, z1: number) {
    const w = Math.abs(x1 - x0)
    const d = Math.abs(z1 - z0)
    const g = new THREE.PlaneGeometry(w, d)
    g.rotateX(-Math.PI / 2)
    g.translate((x0 + x1) / 2, this.y, (z0 + z1) / 2)
    this.geos.push(g)
  }
  /** Line segment of a given width along x or z. */
  seg(x0: number, z0: number, x1: number, z1: number, w = COURT.lineWidth) {
    if (Math.abs(x1 - x0) < 1e-4) this.rect(x0 - w / 2, z0, x0 + w / 2, z1)
    else this.rect(x0, z0 - w / 2, x1, z0 + w / 2)
  }
  /** Arc around (cx, cz); angle measured from +z toward +x. */
  arc(cx: number, cz: number, r: number, a0: number, a1: number, w = COURT.lineWidth, segs = 48) {
    const pos: number[] = []
    const idx: number[] = []
    for (let i = 0; i <= segs; i++) {
      const a = a0 + ((a1 - a0) * i) / segs
      const s = Math.sin(a)
      const c = Math.cos(a)
      pos.push(cx + s * (r - w / 2), this.y, cz + c * (r - w / 2))
      pos.push(cx + s * (r + w / 2), this.y, cz + c * (r + w / 2))
      if (i < segs) {
        const k = i * 2
        idx.push(k, k + 1, k + 2, k + 1, k + 3, k + 2)
      }
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
    g.setIndex(idx)
    g.computeVertexNormals()
    // make sure normals point up regardless of winding
    const n = g.getAttribute('normal') as THREE.BufferAttribute
    for (let i = 0; i < n.count; i++) n.setXYZ(i, 0, 1, 0)
    g.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array((pos.length / 3) * 2), 2))
    this.geos.push(g)
  }
  build() {
    return mergeGeometries(this.geos.map((g) => (g.index ? g : g)), false)
  }
}

function courtLines() {
  const L = new LineBuilder(0.004)
  const hw = COURT.halfWidth
  const bz = COURT.baselineZ
  const fz = COURT.farBaselineZ
  const w = COURT.lineWidth
  L.seg(-hw + w / 2, bz, -hw + w / 2, fz)
  L.seg(hw - w / 2, bz, hw - w / 2, fz)
  L.seg(-hw, bz + w / 2, hw, bz + w / 2)
  L.seg(-hw, fz - w / 2, hw, fz - w / 2)
  L.seg(-hw, CENTER_Z, hw, CENTER_Z)
  L.arc(0, CENTER_Z, COURT.centerCircleRadius, 0, Math.PI * 2, w, 72)
  L.arc(0, CENTER_Z, 0.61, 0, Math.PI * 2, w, 40)
  for (const end of [0, 1]) {
    const hz = end === 0 ? 0 : COURT.farHoopZ
    const dir = end === 0 ? 1 : -1
    const base = end === 0 ? bz : fz
    const Z = (z: number) => hz + z * dir
    const cz = COURT.threeCornerZ
    const cx = COURT.threeCornerX
    L.seg(-cx, Math.min(base, Z(cz)), -cx, Math.max(base, Z(cz)))
    L.seg(cx, Math.min(base, Z(cz)), cx, Math.max(base, Z(cz)))
    const a0 = Math.asin(cx / COURT.threeRadius)
    if (dir > 0) L.arc(0, hz, COURT.threeRadius, -a0, a0, w, 64)
    else L.arc(0, hz, COURT.threeRadius, Math.PI - a0, Math.PI + a0, w, 64)
    const kw = COURT.keyHalfWidth
    const ft = Z(COURT.freeThrowZ)
    L.seg(-kw, Math.min(base, ft), -kw, Math.max(base, ft))
    L.seg(kw, Math.min(base, ft), kw, Math.max(base, ft))
    L.seg(-kw, ft, kw, ft)
    if (dir > 0) {
      L.arc(0, ft, COURT.ftCircleRadius, -Math.PI / 2, Math.PI / 2, w, 40)
      for (let i = 0; i < 8; i++) {
        const a = Math.PI / 2 + (i + 0.25) * (Math.PI / 8)
        L.arc(0, ft, COURT.ftCircleRadius, a, a + Math.PI / 16, w, 4)
      }
      L.arc(0, hz, COURT.restrictedRadius, -Math.PI / 2, Math.PI / 2, w, 32)
    } else {
      L.arc(0, ft, COURT.ftCircleRadius, Math.PI / 2, Math.PI * 1.5, w, 40)
      for (let i = 0; i < 8; i++) {
        const a = -Math.PI / 2 + (i + 0.25) * (Math.PI / 8)
        L.arc(0, ft, COURT.ftCircleRadius, a, a + Math.PI / 16, w, 4)
      }
      L.arc(0, hz, COURT.restrictedRadius, Math.PI / 2, Math.PI * 1.5, w, 32)
    }
    for (const hzOff of [0.75, 1.65, 2.55, 3.45]) {
      const z = Z(hzOff)
      L.seg(-kw - 0.2, z, -kw, z)
      L.seg(kw, z, kw + 0.2, z)
    }
  }
  return L.build()
}

interface CrowdInstance {
  x: number
  y: number
  z: number
  bright: number
  scale: number
  /** fixed atlas cell (photographers); otherwise a random spectator pose */
  cell?: number
  /** fixed shirt colour, never re-tinted by team colours */
  fixedTint?: string
}

export class Arena {
  group = new THREE.Group()
  floorMat: THREE.MeshStandardMaterial
  apronMat: THREE.MeshStandardMaterial
  paintMat: THREE.MeshStandardMaterial
  logoMesh: THREE.Mesh
  baselineTexts: THREE.Mesh[] = []
  ledTextures: THREE.Texture[] = []
  ledMats: THREE.MeshBasicMaterial[] = []
  crowdMat: THREE.ShaderMaterial | null = null
  crowdGeo: THREE.InstancedBufferGeometry | null = null
  /** instances before this index take team colours; photographers sit after it */
  private crowdTintable = 0
  scoreboard = new ScoreboardCanvas()
  cheer = 0
  private time = 0
  private bannerGroup = new THREE.Group()
  private quality: QualitySettings
  private wood = makeWoodTextures(1024)

  constructor(quality: QualitySettings, anisotropy: number) {
    this.quality = quality
    this.wood.map.anisotropy = anisotropy
    this.wood.rough.anisotropy = anisotropy
    const courtW = COURT.halfWidth * 2
    const courtL = COURT.farBaselineZ - COURT.baselineZ
    const woodRepeat = (w: number, l: number) => {
      const m = this.wood.map.clone()
      m.repeat.set(w / 2.2, l / 2.2)
      m.needsUpdate = true
      const r = this.wood.rough.clone()
      r.repeat.copy(m.repeat)
      r.needsUpdate = true
      return { m, r }
    }
    const FloorMat = quality.clearcoat ? THREE.MeshPhysicalMaterial : THREE.MeshStandardMaterial
    const courtWood = woodRepeat(courtW, courtL)
    this.floorMat = new FloorMat({
      map: courtWood.m,
      roughnessMap: courtWood.r,
      roughness: 1,
      metalness: 0,
      envMapIntensity: 1.25,
    })
    if (this.floorMat instanceof THREE.MeshPhysicalMaterial) {
      this.floorMat.clearcoat = 0.22
      this.floorMat.clearcoatRoughness = 0.28
    }
    makeReflective(this.floorMat, 3.2)
    const court = new THREE.Mesh(new THREE.PlaneGeometry(courtW, courtL), this.floorMat)
    court.rotation.x = -Math.PI / 2
    court.position.set(0, 0, (COURT.baselineZ + COURT.farBaselineZ) / 2)
    court.receiveShadow = true
    court.layers.set(LAYER_FLOOR)
    this.group.add(court)

    const apronW = FLOOR_HALF_X * 2
    const apronL = FLOOR_MAX_Z - FLOOR_MIN_Z
    const apronWood = woodRepeat(apronW, apronL)
    this.apronMat = new THREE.MeshStandardMaterial({
      map: apronWood.m,
      roughnessMap: apronWood.r,
      roughness: 1,
      color: new THREE.Color('#6b4a33'),
      envMapIntensity: 1.1,
    })
    makeReflective(this.apronMat, 2.2)
    const apron = new THREE.Mesh(new THREE.PlaneGeometry(apronW, apronL), this.apronMat)
    apron.rotation.x = -Math.PI / 2
    apron.position.set(0, -0.003, (FLOOR_MIN_Z + FLOOR_MAX_Z) / 2)
    apron.receiveShadow = true
    apron.layers.set(LAYER_FLOOR)
    this.group.add(apron)

    // painted keys tinted over the wood grain
    const keyWood = woodRepeat(COURT.keyHalfWidth * 2, COURT.freeThrowZ - COURT.baselineZ)
    this.paintMat = new THREE.MeshStandardMaterial({
      map: keyWood.m,
      roughnessMap: keyWood.r,
      roughness: 1,
      color: new THREE.Color('#9c2b1b'),
      envMapIntensity: 1.2,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    })
    makeReflective(this.paintMat, 2.8)
    for (const end of [0, 1]) {
      const key = new THREE.Mesh(new THREE.PlaneGeometry(COURT.keyHalfWidth * 2, COURT.freeThrowZ - COURT.baselineZ), this.paintMat)
      key.rotation.x = -Math.PI / 2
      const len = COURT.freeThrowZ - COURT.baselineZ
      key.position.set(0, 0.0015, end === 0 ? COURT.baselineZ + len / 2 : COURT.farBaselineZ - len / 2)
      key.receiveShadow = true
      key.layers.set(LAYER_FLOOR)
      this.group.add(key)
    }

    const lineMat = makeReflective(
      new THREE.MeshStandardMaterial({
        color: 0xf4f4f0,
        roughness: 0.38,
        polygonOffset: true,
        polygonOffsetFactor: -2,
        polygonOffsetUnits: -2,
      }),
      2.4,
    )
    const lines = new THREE.Mesh(courtLines(), lineMat)
    lines.receiveShadow = true
    lines.layers.set(LAYER_FLOOR)
    this.group.add(lines)

    this.logoMesh = new THREE.Mesh(
      new THREE.CircleGeometry(1.55, 48),
      makeReflective(new THREE.MeshStandardMaterial({ transparent: true, roughness: 0.35, polygonOffset: true, polygonOffsetFactor: -3, polygonOffsetUnits: -3 }), 2.6),
    )
    this.logoMesh.rotation.x = -Math.PI / 2
    this.logoMesh.position.set(0, 0.005, CENTER_Z)
    this.logoMesh.receiveShadow = true
    this.logoMesh.layers.set(LAYER_FLOOR)
    this.group.add(this.logoMesh)

    this.buildStands()
    this.buildCourtside()
    this.buildLightRig()
    this.buildJumbotron()
    this.group.add(this.bannerGroup)
  }

  private buildStands() {
    const rng = mulberry32(2024)
    const seatGeos: THREE.BufferGeometry[] = []
    const crowd: CrowdInstance[] = []
    const density = this.quality.crowdDensity
    const addRowBox = (side: number, dist: number, y0: number, h: number, depth: number) => {
      // side 0: +x, 1: -x, 2: -z end, 3: +z end
      const g = new THREE.BoxGeometry(1, 1, 1)
      if (side < 2) {
        const len = FLOOR_MAX_Z - FLOOR_MIN_Z + (dist + depth) * 2
        g.scale(depth, h, len)
        const x = (FLOOR_HALF_X + dist + depth / 2) * (side === 0 ? 1 : -1)
        g.translate(x, y0 + h / 2, (FLOOR_MIN_Z + FLOOR_MAX_Z) / 2)
      } else {
        const len = FLOOR_HALF_X * 2 + (dist + depth) * 2
        g.scale(len, h, depth)
        const z = side === 2 ? FLOOR_MIN_Z - dist - depth / 2 : FLOOR_MAX_Z + dist + depth / 2
        g.translate(0, y0 + h / 2, z)
      }
      seatGeos.push(g)
    }
    const addCrowdRow = (side: number, dist: number, y: number, rowIndex: number, bowl: number) => {
      const spacing = 0.6
      const len = side < 2 ? FLOOR_MAX_Z - FLOOR_MIN_Z + dist * 2 : FLOOR_HALF_X * 2 + dist * 2
      const n = Math.floor(len / spacing)
      const fill = density * (bowl === 0 ? 0.97 - rowIndex * 0.012 : 0.85 - rowIndex * 0.02)
      for (let i = 0; i < n; i++) {
        if (rng() > fill) continue
        const along = -len / 2 + (i + 0.5) * spacing + (rng() - 0.5) * 0.12
        let x = 0
        let z = 0
        if (side < 2) {
          x = (FLOOR_HALF_X + dist + 0.3) * (side === 0 ? 1 : -1)
          z = (FLOOR_MIN_Z + FLOOR_MAX_Z) / 2 + along
        } else {
          x = along
          z = side === 2 ? FLOOR_MIN_Z - dist - 0.3 : FLOOR_MAX_Z + dist + 0.3
        }
        const bright = (bowl === 0 ? 0.5 - rowIndex * 0.022 : 0.22 - rowIndex * 0.01) * (0.8 + rng() * 0.35)
        crowd.push({ x, y: y - 0.2, z, bright: Math.max(0.08, bright), scale: 0.92 + rng() * 0.16 })
      }
    }
    // lower bowl
    const lowerRows = 14
    const rise = 0.42
    const depth = 0.86
    const startDist = 0.7
    const startY = 1.0
    for (let side = 0; side < 4; side++) {
      addRowBox(side, 0, 0, startY, startDist)
      for (let r = 0; r < lowerRows; r++) {
        const dist = startDist + r * depth
        const y0 = startY + r * rise
        addRowBox(side, dist, 0, y0 + rise, depth)
        addCrowdRow(side, dist, y0 + rise, r, 0)
      }
    }
    // upper bowl behind a fascia
    const upperStartDist = startDist + lowerRows * depth + 1.6
    const upperStartY = startY + lowerRows * rise + 2.6
    const upperRows = 12
    for (let side = 0; side < 4; side++) {
      addRowBox(side, startDist + lowerRows * depth, 0, upperStartY - 1.2, 1.6)
      for (let r = 0; r < upperRows; r++) {
        const dist = upperStartDist + r * 0.82
        const y0 = upperStartY + r * 0.55
        addRowBox(side, dist, 0, y0 + 0.55, 0.82)
        addCrowdRow(side, dist, y0 + 0.55, r, 1)
      }
    }
    const seatMat = new THREE.MeshStandardMaterial({ color: 0x15171d, roughness: 0.92, metalness: 0 })
    const seats = new THREE.Mesh(mergeGeometries(seatGeos), seatMat)
    seats.receiveShadow = false
    this.group.add(seats)

    // fascia LED ribbons between bowls
    const fasciaDist = startDist + lowerRows * depth
    const fasciaY = upperStartY - 1.25
    this.addLedRibbon(fasciaDist - 0.02, fasciaY, 0.9, 'fascia')

    this.addCourtsideFans(crowd)
    this.buildCrowd(crowd)
  }

  /**
   * Life at floor level: two rows of courtside seats down each sideline (behind the scorer's table and
   * benches on +x) and photographers crouched along both baselines. They share the stands' instanced
   * billboard pass; chairs are one instanced mesh.
   */
  private addCourtsideFans(list: CrowdInstance[]) {
    const rng = mulberry32(911)
    const fans: CrowdInstance[] = []
    const chairs: THREE.Matrix4[] = []
    const rows = [
      { x: COURT.halfWidth + 3.35, from: -12.2, to: 12.2 },
      { x: COURT.halfWidth + 4.15, from: -12.8, to: 12.8 },
      { x: -(COURT.halfWidth + 1.7), from: -11.6, to: 11.6 },
      { x: -(COURT.halfWidth + 2.5), from: -12.4, to: 12.4 },
    ]
    const m = new THREE.Matrix4()
    const q = new THREE.Quaternion()
    const up = new THREE.Vector3(0, 1, 0)
    for (const r of rows) {
      const facing = r.x > 0 ? Math.PI : 0
      for (let z = r.from; z <= r.to; z += 0.62) {
        const zz = CENTER_Z + z + (rng() - 0.5) * 0.06
        q.setFromAxisAngle(up, facing + (r.x > 0 ? -Math.PI / 2 : Math.PI / 2))
        chairs.push(m.clone().compose(new THREE.Vector3(r.x + Math.sign(r.x) * 0.12, 0, zz), q, new THREE.Vector3(1, 1, 1)))
        if (rng() > this.quality.crowdDensity * 0.96) continue
        fans.push({ x: r.x, y: 0.26, z: zz, bright: 0.62 + rng() * 0.16, scale: 0.98 + rng() * 0.12 })
      }
    }
    list.push(...fans)
    // seats: the bench chair, turned to face the floor
    const seat = new THREE.BoxGeometry(0.46, 0.07, 0.46)
    seat.translate(0, 0.46, 0)
    const back = new THREE.BoxGeometry(0.07, 0.52, 0.46)
    back.translate(0.21, 0.76, 0)
    const legs = new THREE.BoxGeometry(0.4, 0.42, 0.05)
    legs.translate(0, 0.21, 0)
    const geo = mergeGeometries([seat, back, legs])
    const inst = new THREE.InstancedMesh(geo, new THREE.MeshStandardMaterial({ color: 0x20232b, roughness: 0.6, metalness: 0.25 }), chairs.length)
    chairs.forEach((c, i) => inst.setMatrixAt(i, c))
    this.group.add(inst)
    // photographers last so team tinting skips them
    const photo = CROWD_POSES.map((p, i) => (p === 'photog' ? i : -1)).filter((i) => i >= 0)
    for (const z of [COURT.baselineZ - 0.95, COURT.farBaselineZ + 0.95]) {
      for (const x of [-6.4, -5.3, -4.1, -2.9, -1.8, 1.8, 2.9, 4.1, 5.3, 6.4]) {
        if (rng() < 0.25) continue
        list.push({ x: x + (rng() - 0.5) * 0.3, y: 0, z: z + (rng() - 0.5) * 0.35, bright: 0.86 + rng() * 0.12, scale: 1.08 + rng() * 0.08, cell: photo[Math.floor(rng() * photo.length)], fixedTint: rng() < 0.6 ? '#2b2f37' : '#4a515c' })
      }
    }
  }

  private buildCrowd(list: CrowdInstance[]) {
    const atlas = makeCrowdAtlas()
    const base = new THREE.PlaneGeometry(1, 1)
    base.translate(0, 0.5, 0)
    const geo = new THREE.InstancedBufferGeometry()
    geo.index = base.index
    geo.setAttribute('position', base.getAttribute('position'))
    geo.setAttribute('uv', base.getAttribute('uv'))
    const n = list.length
    const offset = new Float32Array(n * 3)
    const tint = new Float32Array(n * 3)
    const cell = new Float32Array(n)
    const phase = new Float32Array(n)
    const scale = new Float32Array(n)
    const bright = new Float32Array(n)
    const rng = mulberry32(77)
    const c = new THREE.Color()
    // a real crowd is mostly darks and neutrals with team colour, not a box of crayons
    const palette = ['#e4e4e2', '#1b1d22', '#2b2f38', '#3f4652', '#2f5fb8', '#a8342a', '#d9ae3a', '#2f7a46', '#5c3a9e', '#c8692c', '#8d96a0', '#14161b']
    const spectators = CROWD_POSES.map((p, i) => (p === 'photog' ? -1 : i)).filter((i) => i >= 0)
    this.crowdTintable = list.findIndex((p) => p.fixedTint !== undefined)
    if (this.crowdTintable < 0) this.crowdTintable = list.length
    list.forEach((p, i) => {
      offset[i * 3] = p.x
      offset[i * 3 + 1] = p.y
      offset[i * 3 + 2] = p.z
      c.set(p.fixedTint ?? palette[Math.floor(rng() * palette.length)])
      tint[i * 3] = c.r
      tint[i * 3 + 1] = c.g
      tint[i * 3 + 2] = c.b
      cell[i] = p.cell ?? spectators[Math.floor(rng() * spectators.length)]
      phase[i] = rng()
      scale[i] = p.scale
      bright[i] = p.bright
    })
    geo.setAttribute('offset', new THREE.InstancedBufferAttribute(offset, 3))
    geo.setAttribute('tint', new THREE.InstancedBufferAttribute(tint, 3))
    geo.setAttribute('cell', new THREE.InstancedBufferAttribute(cell, 1))
    geo.setAttribute('phase', new THREE.InstancedBufferAttribute(phase, 1))
    geo.setAttribute('scaleA', new THREE.InstancedBufferAttribute(scale, 1))
    geo.setAttribute('bright', new THREE.InstancedBufferAttribute(bright, 1))
    geo.instanceCount = n
    const mat = new THREE.ShaderMaterial({
      uniforms: {
        map: { value: atlas.texture },
        time: { value: 0 },
        cheer: { value: 0 },
        cells: { value: atlas.cells },
        cols: { value: atlas.cols },
        rows: { value: atlas.rows },
        uFlash: { value: this.quality.level === 'low' ? 0 : 1 },
        exposure: { value: 1 },
      },
      vertexShader: /* glsl */ `
        attribute vec3 offset;
        attribute vec3 tint;
        attribute float cell;
        attribute float phase;
        attribute float scaleA;
        attribute float bright;
        uniform float time;
        uniform float cheer;
        uniform float cells;
        uniform float cols;
        uniform float rows;
        uniform float uFlash;
        varying vec2 vUv;
        varying vec3 vTint;
        varying float vBright;
        varying float vFlash;
        void main() {
          float rate = 1.6 + cheer * 7.0 + phase * 1.3;
          float bob = (sin(time * rate + phase * 6.2831) * 0.5 + 0.5) * (0.015 + cheer * 0.2 * step(0.35, fract(phase * 7.13)));
          vec3 base = offset + vec3(0.0, bob, 0.0);
          vec3 right = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]);
          right.y = 0.0;
          right = normalize(right);
          vec3 pos = base + right * position.x * scaleA * 0.66 + vec3(0.0, position.y * scaleA * 0.99, 0.0);
          float col = mod(cell, cols);
          float row = floor(cell / cols);
          vUv = vec2((uv.x + col) / cols, (uv.y + (rows - 1.0 - row)) / rows);
          // shirts slightly muted: arena spill light, not studio light
          vTint = mix(vec3(dot(tint, vec3(0.2126, 0.7152, 0.0722))), tint, 0.82);
          vBright = bright * (1.0 + cheer * 0.25);
          // camera flashes: rare when the ball is dead, a storm on big plays
          float slot = time * 5.0 + phase * 17.0;
          float h = fract(sin(floor(slot) * 12.9898 + phase * 437.585) * 43758.5453);
          float pFlash = 0.0012 + cheer * 0.014;
          vFlash = uFlash * step(1.0 - pFlash, h) * pow(1.0 - fract(slot), 3.0);
          gl_Position = projectionMatrix * viewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform sampler2D map;
        varying vec2 vUv;
        varying vec3 vTint;
        varying float vBright;
        varying float vFlash;
        void main() {
          vec4 c = texture2D(map, vUv);
          if (c.a < 0.5) discard;
          vec3 col = c.rgb;
          bool cloth = c.g < 0.12 && c.r > 0.1 && abs(c.r - c.b) < 0.1;
          bool screen = c.r < 0.25 && c.g > 0.7 && c.b > 0.7;
          if (cloth) col = vTint * (c.r * 1.18);
          col *= vBright;
          // phone screens glow in the dark stands
          if (screen) col = vec3(0.6, 0.78, 1.0) * 1.4;
          col += vec3(1.0, 0.96, 0.9) * vFlash * 7.0;
          gl_FragColor = vec4(col, 1.0);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }
      `,
    })
    const mesh = new THREE.Mesh(geo, mat)
    mesh.frustumCulled = false
    this.crowdMat = mat
    this.crowdGeo = geo
    this.group.add(mesh)
  }

  private addLedRibbon(dist: number, y: number, h: number, kind: 'fascia' | 'courtside') {
    const tex = makeLedTexture([
      { text: 'HOOP LEGACY', bg: '#ff5b14', fg: '#ffffff' },
      { text: 'BUILD YOUR LEGACY', bg: '#0b0f18', fg: '#ff5b14' },
      { text: 'PRO HOOPS LEAGUE', bg: '#1d4ed8', fg: '#ffffff' },
      { text: 'SWISH ENERGY', bg: '#0f8a7e', fg: '#ffffff' },
      { text: 'AERO GLIDE KICKS', bg: '#141414', fg: '#f5d90a' },
      { text: 'DEFENSE!', bg: '#c8102e', fg: '#ffffff' },
    ])
    this.ledTextures.push(tex)
    const mat = new THREE.MeshBasicMaterial({ map: tex, toneMapped: false })
    mat.color.setScalar(kind === 'fascia' ? 1.15 : 1.25)
    this.ledMats.push(mat)
    const segments: [number, number, number, number][] = []
    // long sides
    const lenZ = FLOOR_MAX_Z - FLOOR_MIN_Z + dist * 2
    const lenX = FLOOR_HALF_X * 2 + dist * 2
    segments.push([FLOOR_HALF_X + dist, (FLOOR_MIN_Z + FLOOR_MAX_Z) / 2, lenZ, -Math.PI / 2])
    segments.push([-FLOOR_HALF_X - dist, (FLOOR_MIN_Z + FLOOR_MAX_Z) / 2, lenZ, Math.PI / 2])
    segments.push([0, FLOOR_MIN_Z - dist, lenX, 0])
    segments.push([0, FLOOR_MAX_Z + dist, lenX, Math.PI])
    for (const [x, z, len, rot] of segments) {
      const t = tex.clone()
      // 6 segments, each 9:1 → keep text proportions on the board
      t.repeat.set(len / (h * 9 * 6), 1)
      t.needsUpdate = true
      this.ledTextures.push(t)
      const m = mat.clone()
      m.map = t
      this.ledMats.push(m)
      const plane = new THREE.Mesh(new THREE.PlaneGeometry(len, h), m)
      plane.position.set(x, y + h / 2, z)
      plane.rotation.y = rot
      plane.layers.enable(LAYER_REFLECT)
      this.group.add(plane)
    }
  }

  private buildCourtside() {
    // LED boards ringing the floor, just in front of the first-row wall
    this.addLedRibbon(-0.03, 0.05, 0.9, 'courtside')
    // scorer's table + benches along the +x sideline
    const tableMat = new THREE.MeshStandardMaterial({ color: 0x0d0f14, roughness: 0.5 })
    const table = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.85, 7.5), tableMat)
    table.position.set(COURT.halfWidth + 2.3, 0.425, CENTER_Z)
    this.group.add(table)
    const tableLed = makeLedTexture([
      { text: 'HOOP LEGACY', bg: '#0b0f18', fg: '#ff5b14' },
      { text: 'PRO HOOPS LEAGUE', bg: '#ff5b14', fg: '#ffffff' },
    ])
    tableLed.repeat.set(7.5 / (0.6 * 9 * 2), 1)
    this.ledTextures.push(tableLed)
    const tlMat = new THREE.MeshBasicMaterial({ map: tableLed, toneMapped: false })
    this.ledMats.push(tlMat)
    const tl = new THREE.Mesh(new THREE.PlaneGeometry(7.5, 0.6), tlMat)
    tl.position.set(COURT.halfWidth + 1.89, 0.45, CENTER_Z)
    tl.rotation.y = -Math.PI / 2
    tl.layers.enable(LAYER_REFLECT)
    this.group.add(tl)
    // bench chairs
    const seat = new THREE.BoxGeometry(0.5, 0.08, 0.5)
    seat.translate(0, 0.48, 0)
    const back = new THREE.BoxGeometry(0.08, 0.55, 0.5)
    back.translate(0.22, 0.78, 0)
    const legs = new THREE.BoxGeometry(0.42, 0.44, 0.06)
    legs.translate(0, 0.22, 0)
    const chairGeo = mergeGeometries([seat, back, legs])
    const chairs = new THREE.InstancedMesh(chairGeo, new THREE.MeshStandardMaterial({ color: 0x2b2f38, roughness: 0.55, metalness: 0.2 }), 20)
    const m = new THREE.Matrix4()
    let k = 0
    for (const zc of [CENTER_Z - 8.5, CENTER_Z + 8.5]) {
      for (let i = 0; i < 10; i++) {
        m.makeTranslation(COURT.halfWidth + 2.4, 0, zc - 2.7 + i * 0.6)
        chairs.setMatrixAt(k++, m)
      }
    }
    this.group.add(chairs)
  }

  private buildLightRig() {
    const positions: THREE.Vector3[] = []
    for (let z = -4; z <= 30; z += 3.4) {
      positions.push(new THREE.Vector3(-9.5, 18.5, z), new THREE.Vector3(9.5, 18.5, z))
    }
    for (let x = -6; x <= 6; x += 3) {
      positions.push(new THREE.Vector3(x, 18.5, -6.5), new THREE.Vector3(x, 18.5, 31.8))
    }
    const fixtureGeo = new THREE.BoxGeometry(0.9, 0.22, 0.9)
    const fixtureMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(1, 0.96, 0.88).multiplyScalar(4), toneMapped: false })
    const fixtures = new THREE.InstancedMesh(fixtureGeo, fixtureMat, positions.length)
    const m = new THREE.Matrix4()
    positions.forEach((p, i) => {
      m.makeTranslation(p.x, p.y, p.z)
      fixtures.setMatrixAt(i, m)
    })
    fixtures.layers.enable(LAYER_REFLECT)
    this.group.add(fixtures)
    // trusses
    const trussMat = new THREE.MeshStandardMaterial({ color: 0x1b1e25, roughness: 0.8, metalness: 0.4 })
    for (const x of [-9.5, 9.5]) {
      const t = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.35, 38), trussMat)
      t.position.set(x, 18.85, 12.725)
      this.group.add(t)
    }
    // fake bloom glow cards
    const glow = new THREE.BufferGeometry().setFromPoints(positions.map((p) => p.clone().add(new THREE.Vector3(0, -0.2, 0))))
    const glowMat = new THREE.PointsMaterial({
      map: makeGlowTexture(),
      size: 5.5,
      sizeAttenuation: true,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      color: new THREE.Color(1, 0.93, 0.8),
      opacity: 0.85,
    })
    const glowPts = new THREE.Points(glow, glowMat)
    glowPts.layers.enable(LAYER_REFLECT)
    this.group.add(glowPts)
    // ceiling
    const ceil = new THREE.Mesh(new THREE.PlaneGeometry(90, 90), new THREE.MeshBasicMaterial({ color: 0x07080b }))
    ceil.rotation.x = Math.PI / 2
    ceil.position.set(0, 26, 12.7)
    this.group.add(ceil)
  }

  private buildJumbotron() {
    const g = new THREE.Group()
    g.position.set(0, 12.8, CENTER_Z)
    const body = new THREE.Mesh(new THREE.BoxGeometry(6.4, 3.6, 6.4), new THREE.MeshStandardMaterial({ color: 0x0b0d12, roughness: 0.6, metalness: 0.3 }))
    g.add(body)
    const screenMat = new THREE.MeshBasicMaterial({ map: this.scoreboard.texture, toneMapped: false })
    screenMat.color.setScalar(1.1)
    for (let i = 0; i < 4; i++) {
      const s = new THREE.Mesh(new THREE.PlaneGeometry(6.0, 3.37), screenMat)
      const a = (i * Math.PI) / 2
      s.position.set(Math.sin(a) * 3.21, 0, Math.cos(a) * 3.21)
      s.rotation.y = a
      g.add(s)
    }
    const ringTex = makeLedTexture([
      { text: 'HOOP LEGACY', bg: '#ff5b14', fg: '#ffffff' },
      { text: 'MAKE SOME NOISE', bg: '#0b0f18', fg: '#ffffff' },
    ])
    ringTex.repeat.set(2, 1)
    this.ledTextures.push(ringTex)
    const ringMat = new THREE.MeshBasicMaterial({ map: ringTex, toneMapped: false })
    this.ledMats.push(ringMat)
    const ring = new THREE.Mesh(new THREE.CylinderGeometry(3.7, 3.7, 0.7, 32, 1, true), ringMat)
    ring.position.y = -2.3
    g.add(ring)
    const glowUnder = new THREE.Mesh(new THREE.CircleGeometry(3.2, 32), new THREE.MeshBasicMaterial({ color: new THREE.Color(1, 0.6, 0.32).multiplyScalar(0.75), toneMapped: false }))
    glowUnder.rotation.x = Math.PI / 2
    glowUnder.position.y = -1.81
    g.add(glowUnder)
    g.traverse((o) => o.layers.enable(LAYER_REFLECT))
    this.group.add(g)
  }

  setCourtTeam(team: TeamInfo, away?: TeamInfo) {
    const paint = new THREE.Color(team.primary)
    const hsl = { h: 0, s: 0, l: 0 }
    paint.getHSL(hsl)
    paint.setHSL(hsl.h, Math.min(1, hsl.s * 0.95), Math.min(0.42, Math.max(0.2, hsl.l * 0.78)))
    this.paintMat.color.copy(paint)
    const apron = new THREE.Color(shadeHex(team.secondary, 0)).lerp(new THREE.Color('#5a3c26'), 0.55)
    this.apronMat.color.copy(apron)
    const logoMat = this.logoMesh.material as THREE.MeshStandardMaterial
    logoMat.map?.dispose()
    logoMat.map = makeCourtLogoTexture(team)
    logoMat.needsUpdate = true
    for (const m of this.baselineTexts) {
      ;(m.material as THREE.MeshStandardMaterial).map?.dispose()
      m.removeFromParent()
    }
    this.baselineTexts = []
    const city = team.city.toUpperCase()
    const nm = team.name.toUpperCase()
    const addText = (text: string, color: string, x: number, z: number, rotZ: number, w: number) => {
      const t = makeTextTexture(text, color, { w: 1024, h: 160 })
      const mat = makeReflective(new THREE.MeshStandardMaterial({ map: t, transparent: true, roughness: 0.4, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }), 2.4)
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, w * 0.156), mat)
      mesh.rotation.x = -Math.PI / 2
      mesh.rotation.z = rotZ
      mesh.position.set(x, 0.004, z)
      mesh.receiveShadow = true
      mesh.layers.set(LAYER_FLOOR)
      this.group.add(mesh)
      this.baselineTexts.push(mesh)
    }
    const ink = '#f5f5f2'
    addText(nm, ink, 0, COURT.baselineZ - 1.35, 0, 7.5)
    addText(city, ink, 0, COURT.farBaselineZ + 1.35, Math.PI, 7.5)
    addText('HOOP LEGACY', ink, COURT.halfWidth + 1.25, CENTER_Z - 7, Math.PI / 2, 6)
    addText('HOOP LEGACY', ink, -COURT.halfWidth - 1.25, CENTER_Z + 7, -Math.PI / 2, 6)
    addText(nm, team.primary, -COURT.halfWidth - 1.25, CENTER_Z - 7, -Math.PI / 2, 5)
    addText(city, team.primary, COURT.halfWidth + 1.25, CENTER_Z + 7, Math.PI / 2, 5)
    this.buildBanners(team)
    // home crowd wears home colors
    if (this.crowdGeo) {
      const tint = this.crowdGeo.getAttribute('tint') as THREE.InstancedBufferAttribute
      const rng = mulberry32(team.id.length * 97 + team.abbr.charCodeAt(0))
      const cols = [new THREE.Color(team.primary), new THREE.Color(team.secondary), new THREE.Color('#e8e8e8'), new THREE.Color(away?.primary ?? '#1b1d22')]
      const c = new THREE.Color()
      for (let i = 0; i < Math.min(tint.count, this.crowdTintable); i++) {
        const r = rng()
        if (r < 0.42) c.copy(cols[0])
        else if (r < 0.58) c.copy(cols[1])
        else if (r < 0.66) c.copy(cols[3])
        else c.setHSL(rng(), 0.35 + rng() * 0.4, 0.25 + rng() * 0.45)
        tint.setXYZ(i, c.r, c.g, c.b)
      }
      tint.needsUpdate = true
    }
  }

  private buildBanners(team: TeamInfo) {
    this.bannerGroup.clear()
    const years = ['2019', '2021', '2022', '2024', '2025']
    years.forEach((y, i) => {
      const c = document.createElement('canvas')
      c.width = 128
      c.height = 256
      const ctx = c.getContext('2d')!
      ctx.fillStyle = team.primary
      ctx.fillRect(0, 0, 128, 256)
      ctx.fillStyle = team.secondary
      ctx.fillRect(0, 0, 128, 16)
      ctx.beginPath()
      ctx.moveTo(0, 230)
      ctx.lineTo(64, 256)
      ctx.lineTo(128, 230)
      ctx.lineTo(128, 256)
      ctx.lineTo(0, 256)
      ctx.fill()
      ctx.fillStyle = '#ffffff'
      ctx.textAlign = 'center'
      ctx.font = 'italic 900 30px "Barlow Condensed", Impact, sans-serif'
      ctx.fillText(team.city.toUpperCase().slice(0, 10), 64, 66)
      ctx.font = 'italic 900 40px "Barlow Condensed", Impact, sans-serif'
      ctx.fillText('LEAGUE', 64, 120)
      ctx.fillText('CHAMPS', 64, 160)
      ctx.font = '800 34px "Barlow Condensed", Impact, sans-serif'
      ctx.fillText(y, 64, 206)
      const t = new THREE.CanvasTexture(c)
      t.colorSpace = THREE.SRGBColorSpace
      const mat = new THREE.MeshStandardMaterial({ map: t, roughness: 0.85, side: THREE.DoubleSide })
      mat.emissive = new THREE.Color(0xffffff)
      mat.emissiveMap = t
      mat.emissiveIntensity = 0.25
      const b = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 3.2), mat)
      b.position.set(-5 + i * 2.5, 15.5, FLOOR_MIN_Z - 6)
      this.bannerGroup.add(b)
    })
  }

  updateScoreboard(home: TeamInfo | null, away: TeamInfo | null, hs: number, as: number, clock: string, banner: string) {
    this.scoreboard.draw(home, away, hs, as, clock, banner)
  }

  addCheer(amount: number) {
    this.cheer = Math.min(1, this.cheer + amount)
  }

  update(dt: number) {
    this.time += dt
    this.cheer = Math.max(0, this.cheer - dt * 0.28)
    for (const t of this.ledTextures) t.offset.x = (t.offset.x + dt * 0.06) % 1
    if (this.crowdMat) {
      this.crowdMat.uniforms.time.value = this.time
      this.crowdMat.uniforms.cheer.value = this.cheer
    }
  }
}
