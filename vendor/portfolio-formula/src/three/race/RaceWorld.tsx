import { useEffect, useLayoutEffect, useMemo, useRef } from "react"
import * as THREE from "three"
import { MeshReflectorMaterial } from "@react-three/drei"
import { useStore } from "@/state/store"
import { useRaceStore } from "@/race/raceStore"
import { profile } from "@/data/profile"
import { createAsphaltMaps, createBoardTexture, MARKINGS } from "../textures"
import { Markings } from "../scene/Track"
import { KERB_WIDTH, ROAD_HALF_WIDTH, getTrack, type Track } from "./track"
import { CAR } from "./sim"

type Span = (i: number) => [number, number]

/**
 * Flat strip following the track between two lateral offsets (left < right),
 * facing up. `include` skips samples, so one geometry can hold many pieces.
 * With `planar`, vertices are written in a plane's local XY space (x, -z) for
 * a mesh rotated -90° about X, which is what the reflector material expects.
 */
function flatStrip(
  track: Track,
  span: Span,
  y: number,
  metresPerV: number,
  options: {
    include?: (i: number) => boolean
    planar?: boolean
    uAcross?: number
  } = {},
) {
  const { include, planar = false, uAcross } = options
  const n = track.count
  const positions: number[] = []
  const uvs: number[] = []
  const indices: number[] = []
  for (let k = 0; k <= n; k++) {
    const i = k % n
    const [a, b] = span(i)
    const rx = -track.tz[i]
    const rz = track.tx[i]
    const ax = track.x[i] + rx * a
    const az = track.z[i] + rz * a
    const bx = track.x[i] + rx * b
    const bz = track.z[i] + rz * b
    if (planar) positions.push(ax, -az, 0, bx, -bz, 0)
    else positions.push(ax, y, az, bx, y, bz)
    const v = (k * track.ds) / metresPerV
    if (uAcross) uvs.push(a / uAcross, v, b / uAcross, v)
    else uvs.push(0, v, 1, v)
    if (k < n && (!include || (include(i) && include((i + 1) % n)))) {
      const p = k * 2
      indices.push(p, p + 1, p + 2, p + 1, p + 3, p + 2)
    }
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3),
  )
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()
  return geometry
}

/** Vertical strip at a lateral offset per sample, from y0 to y1. */
function wallStrip(
  track: Track,
  offset: (i: number) => number,
  y0: number,
  y1: number,
  metresPerU: number,
) {
  const n = track.count
  const positions: number[] = []
  const uvs: number[] = []
  const indices: number[] = []
  for (let k = 0; k <= n; k++) {
    const i = k % n
    const d = offset(i)
    const x = track.x[i] - track.tz[i] * d
    const z = track.z[i] + track.tx[i] * d
    positions.push(x, y0, z, x, y1, z)
    const u = (k * track.ds) / metresPerU
    uvs.push(u, 0, u, 1)
    if (k < n) {
      const p = k * 2
      indices.push(p, p + 2, p + 1, p + 1, p + 2, p + 3)
    }
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3),
  )
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()
  return geometry
}

function createKerbTexture() {
  const canvas = document.createElement("canvas")
  canvas.width = 8
  canvas.height = 64
  const ctx = canvas.getContext("2d")!
  ctx.fillStyle = "#d8dadf"
  ctx.fillRect(0, 0, 8, 64)
  ctx.fillStyle = "#c8281e"
  ctx.fillRect(0, 0, 8, 32)
  const t = new THREE.CanvasTexture(canvas)
  t.colorSpace = THREE.SRGBColorSpace
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  t.magFilter = THREE.NearestFilter
  t.anisotropy = 8
  return t
}

const inMarkings = (track: Track, i: number) =>
  Math.abs(track.x[i]) < MARKINGS.xMax + 0.5 &&
  track.z[i] > MARKINGS.zMin + 0.5 &&
  track.z[i] < MARKINGS.zMax - 0.5

/** The full circuit: road, paint, kerbs, barriers, grass and floodlights. */
export function RaceWorld() {
  const circuit = useRaceStore(s => s.phase === "select" ? "night" : s.config?.circuit ?? "night")
  const track = getTrack(circuit)
  const quality = useStore((s) => s.quality)
  const fontsVersion = useStore((s) => s.fontsVersion)
  const racingLine = useRaceStore((s) => s.racingLine)

  const geo = useMemo(() => {
    const W = ROAD_HALF_WIDTH
    const road = flatStrip(track, () => [-W - 0.05, W + 0.05], 0, 1.25, {
      planar: true,
      uAcross: 1.25,
    })
    const paintInclude = (i: number) => !inMarkings(track, i)
    const lines = mergeStrips([
      flatStrip(track, () => [-W, -W + 0.22], 0.004, 1, {
        include: paintInclude,
      }),
      flatStrip(track, () => [W - 0.22, W], 0.004, 1, {
        include: paintInclude,
      }),
    ])
    const onKerb = (i: number) => track.kerb[i] > 0
    const kerbs = mergeStrips([
      flatStrip(track, () => [-W - KERB_WIDTH, -W], 0.008, 2.4, {
        include: onKerb,
      }),
      flatStrip(track, () => [W, W + KERB_WIDTH], 0.008, 2.4, {
        include: onKerb,
      }),
    ])
    const walls = mergeStrips([
      wallStrip(track, (i) => track.barrierRight[i] + 0.3, 0, 1.05, 4),
      wallStrip(track, (i) => -track.barrierLeft[i] - 0.3, 0, 1.05, 4),
    ])
    // boards read left-to-right from inside the circuit on both sides
    const boardRight = wallStrip(
      track,
      (i) => track.barrierRight[i] + 0.27,
      0.3,
      0.92,
      -26,
    )
    const boardLeft = wallStrip(
      track,
      (i) => -track.barrierLeft[i] - 0.27,
      0.3,
      0.92,
      26,
    )
    const boards = mergeStrips([boardRight, boardLeft])
    return { road, lines, kerbs, walls, boards }
  }, [track])
  useEffect(() => () => Object.values(geo).forEach((g) => g.dispose()), [geo])

  const maps = useMemo(() => createAsphaltMaps(), [])
  const kerbTexture = useMemo(() => createKerbTexture(), [])
  const board = useMemo(
    () => createBoardTexture(`${profile.name}  ·  ${profile.tagline}`),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fontsVersion],
  )
  useEffect(() => () => board.dispose(), [board])

  const { minX, maxX, minZ, maxZ } = track.bounds
  const groundSize = Math.max(maxX - minX, maxZ - minZ) + 520

  return (
    <group>
      <mesh
        rotation-x={-Math.PI / 2}
        position={[(minX + maxX) / 2, -0.03, (minZ + maxZ) / 2]}
        receiveShadow
      >
        <planeGeometry args={[groundSize, groundSize]} />
        <meshStandardMaterial color="#0b100d" roughness={1} />
      </mesh>

      <mesh geometry={geo.road} rotation-x={-Math.PI / 2} receiveShadow>
        {quality === "high" ? (
          <MeshReflectorMaterial
            color="#2a2d33"
            roughness={0.7}
            metalness={0.4}
            envMapIntensity={0.35}
            // no normal map here: drei offsets every reflection lookup by it,
            // which breaks bright reflections into speckles that shimmer as
            // the camera moves (a visible flicker); the blur gives the sheen
            roughnessMap={maps.roughnessMap}
            blur={[300, 90]}
            resolution={1024}
            mixBlur={1}
            mixStrength={4.5}
            mixContrast={1.15}
            mirror={0}
            depthScale={0}
          />
        ) : (
          <meshStandardMaterial
            color="#26292e"
            roughness={0.62}
            metalness={0.25}
            normalMap={maps.normalMap}
            roughnessMap={maps.roughnessMap}
          />
        )}
      </mesh>

      <mesh geometry={geo.lines} receiveShadow>
        <meshStandardMaterial
          color="#dcdee2"
          roughness={0.75}
          polygonOffset
          polygonOffsetFactor={-1}
        />
      </mesh>
      <mesh geometry={geo.kerbs} receiveShadow>
        <meshStandardMaterial
          map={kerbTexture}
          roughness={0.6}
          polygonOffset
          polygonOffsetFactor={-1}
        />
      </mesh>
      <Markings />

      <mesh geometry={geo.walls} castShadow receiveShadow>
        <meshStandardMaterial
          color="#15171b"
          roughness={0.85}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh geometry={geo.boards}>
        <meshBasicMaterial
          map={board}
          color={[0.72, 0.72, 0.72]}
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      <TrackFloodlights track={track} />
      {racingLine && <RacingLine track={track} />}
    </group>
  )
}

const LINE_GO = new THREE.Color("#2fd673")
const LINE_LIFT = new THREE.Color("#ffd23f")
const LINE_BRAKE = new THREE.Color("#ff3b30")

/**
 * Driving assist: a dashed line along the ideal path, coloured from the
 * speed profile — green flat out, amber lift, red brake.
 */
function RacingLine({ track }: { track: Track }) {
  const geometry = useMemo(() => {
    const n = track.count
    // speed an ideal car actually reaches: corner and braking limits, then
    // what the engine can deliver out of each corner
    const v = Float32Array.from(track.speed)
    for (let pass = 0; pass < 2; pass++)
      for (let i = 0; i < n; i++) {
        const j = (i + 1) % n
        const accel =
          CAR.engine * (1 - Math.pow(Math.min(1, v[i] / CAR.topSpeed), 2.6)) -
          CAR.drag * v[i] * v[i]
        v[j] = Math.min(
          v[j],
          Math.sqrt(v[i] * v[i] + 2 * Math.max(0, accel) * track.ds),
        )
      }
    const ahead = Math.max(1, Math.round(4 / track.ds))
    const tone = new Float32Array(n)
    for (let i = 0; i < n; i++) {
      const v0 = v[i]
      const v1 = v[(i + ahead) % n]
      const change = (v1 * v1 - v0 * v0) / (2 * ahead * track.ds)
      // braking, accelerating, or holding speed through a corner
      tone[i] = change < -3 ? 2 : change > 0.8 ? 0 : 1
    }
    const positions: number[] = []
    const colors: number[] = []
    const indices: number[] = []
    const half = 0.16
    const dash = 1.5
    const colour = new THREE.Color()
    for (let k = 0; k <= n; k++) {
      const i = k % n
      const d = track.line[i]
      const rx = -track.tz[i]
      const rz = track.tx[i]
      const cx = track.x[i] + rx * d
      const cz = track.z[i] + rz * d
      positions.push(
        cx - rx * half,
        0.012,
        cz - rz * half,
        cx + rx * half,
        0.012,
        cz + rz * half,
      )
      const t = tone[i]
      colour.copy(t === 2 ? LINE_BRAKE : t === 1 ? LINE_LIFT : LINE_GO)
      colors.push(colour.r, colour.g, colour.b, colour.r, colour.g, colour.b)
      if (k < n && Math.floor((k * track.ds) / dash) % 2 === 0) {
        const p = k * 2
        indices.push(p, p + 1, p + 2, p + 1, p + 3, p + 2)
      }
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3))
    g.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3))
    g.setIndex(indices)
    return g
  }, [track])
  useEffect(() => () => geometry.dispose(), [geometry])
  return (
    <mesh geometry={geometry} renderOrder={1}>
      <meshBasicMaterial
        vertexColors
        transparent
        opacity={0.5}
        depthWrite={false}
        toneMapped={false}
        polygonOffset
        polygonOffsetFactor={-3}
      />
    </mesh>
  )
}

function mergeStrips(parts: THREE.BufferGeometry[]) {
  const positions: number[] = []
  const normals: number[] = []
  const uvs: number[] = []
  const indices: number[] = []
  let offset = 0
  for (const g of parts) {
    const pos = g.getAttribute("position")
    const nor = g.getAttribute("normal")
    const uv = g.getAttribute("uv")
    for (let i = 0; i < pos.count; i++) {
      positions.push(pos.getX(i), pos.getY(i), pos.getZ(i))
      normals.push(nor.getX(i), nor.getY(i), nor.getZ(i))
      uvs.push(uv.getX(i), uv.getY(i))
    }
    const index = g.getIndex()!
    for (let i = 0; i < index.count; i++) indices.push(index.getX(i) + offset)
    offset += pos.count
    g.dispose()
  }
  const merged = new THREE.BufferGeometry()
  merged.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3),
  )
  merged.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3))
  merged.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2))
  merged.setIndex(indices)
  return merged
}

type Placement = {
  x: number
  z: number
  yaw: number
}

/** Floodlight towers around the circuit (the start/finish straight has its own). */
function TrackFloodlights({ track }: { track: Track }) {
  const placements = useMemo(() => {
    const out: Placement[] = []
    let side = 1
    for (let i = 0; i < track.count; i += Math.round(78 / track.ds)) {
      const nearStraight =
        Math.abs(track.x[i]) < 20 && track.z[i] > -70 && track.z[i] < 40
      side = -side
      if (nearStraight) continue
      const d = side > 0 ? track.barrierRight[i] + 6 : -track.barrierLeft[i] - 6
      const x = track.x[i] - track.tz[i] * d
      const z = track.z[i] + track.tx[i] * d
      // keep towers off every other part of the circuit
      let clear = true
      for (let j = 0; j < track.count; j += 3) {
        if (Math.hypot(track.x[j] - x, track.z[j] - z) < 17) {
          clear = false
          break
        }
      }
      if (!clear) continue
      out.push({ x, z, yaw: Math.atan2(track.x[i] - x, track.z[i] - z) })
    }
    return out
  }, [track])

  const poles = useRef<THREE.InstancedMesh>(null)
  const heads = useRef<THREE.InstancedMesh>(null)
  const lamps = useRef<THREE.InstancedMesh>(null)
  useLayoutEffect(() => {
    const m = new THREE.Matrix4()
    const q = new THREE.Quaternion()
    const e = new THREE.Euler()
    const one = new THREE.Vector3(1, 1, 1)
    const local = new THREE.Vector3()
    const at = new THREE.Vector3()
    placements.forEach((p, i) => {
      e.set(0, p.yaw, 0)
      q.setFromEuler(e)
      m.compose(at.set(p.x, 8, p.z), q, one)
      poles.current?.setMatrixAt(i, m)
      // head tilted down towards the track; the lamp sits just proud of its face
      e.set(0.45, p.yaw, 0, "YXZ")
      q.setFromEuler(e)
      const headY = 16.2
      local.set(0, 0, 0.15).applyAxisAngle(at.set(0, 1, 0), p.yaw)
      const hx = p.x + local.x
      const hz = p.z + local.z
      m.compose(at.set(hx, headY, hz), q, one)
      heads.current?.setMatrixAt(i, m)
      local.set(0, 0, 0.16).applyQuaternion(q)
      m.compose(at.set(hx + local.x, headY + local.y, hz + local.z), q, one)
      lamps.current?.setMatrixAt(i, m)
    })
    for (const mesh of [poles.current, heads.current, lamps.current]) {
      if (!mesh) continue
      mesh.instanceMatrix.needsUpdate = true
      mesh.computeBoundingSphere()
    }
  }, [placements])

  const count = placements.length
  if (!count) return null
  return (
    <group>
      <instancedMesh ref={poles} args={[undefined, undefined, count]}>
        <cylinderGeometry args={[0.14, 0.2, 16, 8]} />
        <meshStandardMaterial color="#1c1f24" roughness={0.6} metalness={0.6} />
      </instancedMesh>
      <instancedMesh ref={heads} args={[undefined, undefined, count]}>
        <boxGeometry args={[3.4, 1.5, 0.3]} />
        <meshStandardMaterial color="#121418" roughness={0.6} />
      </instancedMesh>
      <instancedMesh ref={lamps} args={[undefined, undefined, count]}>
        <planeGeometry args={[3.1, 1.25]} />
        <meshBasicMaterial color={[3.4, 3.5, 3.8]} toneMapped={false} />
      </instancedMesh>
    </group>
  )
}
