import { useEffect, useMemo } from "react"
import * as THREE from "three"
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js"
import { useStore } from "@/state/store"
import { profile } from "@/data/profile"
import { RACE_NUMBER } from "@/data/career"
import { caseStudies } from "@/data/caseStudies"
import { TRACK_HALF_WIDTH } from "../layout"
import { createBoardTexture } from "../textures"

/**
 * Covered grandstands down both sides of the straight, set well back behind
 * the walls. Each is built in its own frame (u = metres back from the front
 * edge, y up, w along the section) and placed facing the track. Seats and
 * crowd are instanced; the seats nearest the grid spell out his race number.
 *
 * They are scenery, not a subject: dark materials, a crowd knocked back to
 * near-grey, lights kept under the bloom threshold and an extra haze that
 * sinks them into the night, so the cars and the set pieces always read first.
 */

export const STAND_FRONT = TRACK_HALF_WIDTH + 12
const ROWS = 12
const TREAD = 0.9
const RISE = 0.5
/** height of the front wall (the first row of seats) */
const PLINTH = 1.6
const DEPTH = ROWS * TREAD
const TOP = PLINTH + (ROWS - 1) * RISE
const ROOF_BACK = TOP + 3.3
const ROOF_FRONT = TOP + 3.9
const OVERHANG = 1.3
const SEAT_PITCH = 0.56
/**
 * Sections along the straight, [near end, far end] in z. The outer side
 * starts further down so it stays clear of the opening shot, which is taken
 * from just beyond that wall.
 */
const SECTIONS: Record<"1" | "-1", [number, number][]> = {
  "1": [
    [6, -26],
    [-30, -62],
  ],
  "-1": [
    [-16, -40],
    [-44, -68],
  ],
}

type Section = {
  side: 1 | -1
  from: number
  to: number
  /** the section nearest the grid carries the race number in its seats */
  number: boolean
  matrix: THREE.Matrix4
}

const sections: Section[] = []
for (const side of [1, -1] as const)
  SECTIONS[`${side}`].forEach(([from, to], i) => {
    // right: u runs out along +x and w up the straight from the far end;
    // left: turned half round, so the stand still faces the track
    const matrix =
      side > 0
        ? new THREE.Matrix4().makeTranslation(STAND_FRONT, 0, to)
        : new THREE.Matrix4()
            .makeTranslation(-STAND_FRONT, 0, from)
            .multiply(new THREE.Matrix4().makeRotationY(Math.PI))
    sections.push({ side, from, to, number: i === 0, matrix })
  })

/** Density of the haze the stands add on top of the scene's fog. */
const HAZE = 0.028

/**
 * Extra distance haze for every stand material (passed as onBeforeCompile):
 * it mixes towards the scene's fog colour much sooner than the fog itself.
 * Without fog in the scene it does nothing.
 */
function addHaze(shader: THREE.WebGLProgramParametersWithUniforms) {
  shader.fragmentShader = shader.fragmentShader.replace(
    "#include <fog_fragment>",
    [
      "#include <fog_fragment>",
      "#ifdef USE_FOG",
      `  float haze = 1.0 - exp(-${(HAZE * HAZE).toFixed(6)} * vFogDepth * vFogDepth);`,
      "  gl_FragColor.rgb = mix(gl_FragColor.rgb, fogColor, haze);",
      "#endif",
    ].join("\n"),
  )
}

/** 5×7 figures for the seat pattern, top row first. */
const SEAT_FIGURES: Record<string, string[]> = {
  "4": ["X..X.", "X..X.", "X..X.", "XXXXX", "...X.", "...X.", "...X."],
  "5": ["XXXXX", "X....", "XXXX.", "....X", "....X", "X...X", ".XXX."],
}

function seededRandom(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

/** The stepped seating deck, front wall to back, extruded along a section. */
function deck(length: number) {
  const shape = new THREE.Shape()
  shape.moveTo(0, 0)
  shape.lineTo(0, PLINTH)
  for (let r = 0; r < ROWS; r++) {
    const y = PLINTH + r * RISE
    shape.lineTo((r + 1) * TREAD, y)
    if (r < ROWS - 1) shape.lineTo((r + 1) * TREAD, y + RISE)
  }
  shape.lineTo(DEPTH, 0)
  shape.closePath()
  return new THREE.ExtrudeGeometry(shape, {
    depth: length,
    bevelEnabled: false,
  })
}

const box = (
  w: number,
  h: number,
  d: number,
  u: number,
  y: number,
  z: number,
) => new THREE.BoxGeometry(w, h, d).translate(u, y, z)

/** Roof on columns at the back, cantilevered out over the seats. */
function structure(length: number) {
  const parts: THREE.BufferGeometry[] = []
  // back wall
  parts.push(
    box(0.3, TOP + 1.2, length, DEPTH + 0.15, (TOP + 1.2) / 2, length / 2),
  )
  // roof slab, rising slightly towards the track (-u)
  const span = DEPTH + OVERHANG + 0.4
  const tilt = -Math.atan2(ROOF_FRONT - ROOF_BACK, span)
  const roof = new THREE.BoxGeometry(span, 0.2, length)
  roof.rotateZ(tilt)
  roof.translate(
    DEPTH + 0.4 - span / 2,
    (ROOF_BACK + ROOF_FRONT) / 2,
    length / 2,
  )
  parts.push(roof)
  for (let w = 1; w < length; w += 8) {
    // column and the beam it carries out to the front edge
    const column = new THREE.CylinderGeometry(0.16, 0.2, ROOF_BACK, 10)
    column.translate(DEPTH + 0.15, ROOF_BACK / 2, w)
    parts.push(column)
    const beam = new THREE.BoxGeometry(span, 0.42, 0.18)
    beam.rotateZ(tilt)
    beam.translate(
      DEPTH + 0.4 - span / 2,
      (ROOF_BACK + ROOF_FRONT) / 2 - 0.3,
      w,
    )
    parts.push(beam)
  }
  // ends of the section
  for (const w of [0.15, length - 0.15])
    parts.push(box(DEPTH, 0.5, 0.3, DEPTH / 2, TOP + 0.6, w))
  return parts.map((g) => (g.index ? g.toNonIndexed() : g))
}

/** Emissive bits: an LED line on the front wall and lamps under the roof edge. */
function lamps(length: number) {
  const parts: THREE.BufferGeometry[] = [
    box(0.04, 0.06, length, -0.02, PLINTH - 0.12, length / 2),
  ]
  for (let w = 1.5; w < length; w += 3)
    parts.push(box(0.5, 0.06, 0.26, -OVERHANG + 0.6, ROOF_FRONT - 0.2, w))
  return parts.map((g) => g.toNonIndexed())
}

/** The LED fascia along the front edge of the roof, facing the track. */
function fascia(length: number) {
  const g = new THREE.PlaneGeometry(length, 0.9)
  g.rotateY(-Math.PI / 2)
  g.translate(-OVERHANG - 0.02, ROOF_FRONT - 0.1, length / 2)
  // repeat the board artwork every 26 m
  const uv = g.attributes.uv
  for (let i = 0; i < uv.count; i++) uv.setX(i, (uv.getX(i) * length) / 26)
  return g
}

/** A seat facing the track (-u), its back towards the stand. */
function seatGeometry() {
  return merged([
    box(0.4, 0.07, 0.44, 0, 0.035, 0),
    box(0.06, 0.38, 0.44, 0.2, 0.22, 0),
  ])
}

function merged(list: THREE.BufferGeometry[]) {
  const g = mergeGeometries(list)
  if (!g) throw new Error("Grandstands: could not merge geometry")
  return g
}

const SEAT = new THREE.Color("#15181d")
const SEAT_ALT = new THREE.Color("#191c22")
// the race number, a dark red you notice only once you look for it
const SEAT_NUMBER = new THREE.Color("#4a1f1d")
// a night crowd in the distance: shirts mostly greyed out, a hint of each colour left
const CROWD_GREY = new THREE.Color("#4d525b")
const SHIRTS = [
  "#f3f1ec",
  "#ff3b30",
  "#1b1e24",
  "#2b3a55",
  "#5c6370",
  ...caseStudies.map((c) => c.livery.primary),
].map((c) => new THREE.Color(c).lerp(CROWD_GREY, 0.75).multiplyScalar(0.24))
const SKIN = [
  "#3b2a20",
  "#5a3d2b",
  "#7a5238",
  "#9a6a48",
  "#c08a62",
  "#1c1612",
].map((c) => new THREE.Color(c).multiplyScalar(0.32))

export function Grandstands() {
  const quality = useStore((s) => s.quality)
  const fontsVersion = useStore((s) => s.fontsVersion)

  const geometry = useMemo(() => {
    const decks: THREE.BufferGeometry[] = []
    const steel: THREE.BufferGeometry[] = []
    const lights: THREE.BufferGeometry[] = []
    const boards: THREE.BufferGeometry[] = []
    for (const s of sections) {
      const length = s.from - s.to
      decks.push(deck(length).applyMatrix4(s.matrix))
      steel.push(...structure(length).map((g) => g.applyMatrix4(s.matrix)))
      lights.push(...lamps(length).map((g) => g.applyMatrix4(s.matrix)))
      boards.push(fascia(length).applyMatrix4(s.matrix))
    }
    return {
      deck: merged(decks),
      steel: merged(steel),
      lights: merged(lights),
      boards: merged(boards),
    }
  }, [])
  useEffect(
    () => () => Object.values(geometry).forEach((g) => g.dispose()),
    [geometry],
  )

  // seats (spelling the race number in the sections nearest the grid) and the crowd
  const people = useMemo(() => {
    const random = seededRandom(45)
    const occupancy = quality === "high" ? 0.58 : 0.36
    const seatMatrices: THREE.Matrix4[] = []
    const seatColours: THREE.Color[] = []
    const crowd: {
      matrix: THREE.Matrix4
      shirt: THREE.Color
      skin: THREE.Color
    }[] = []
    const figures = String(RACE_NUMBER)
      .split("")
      .map((d) => SEAT_FIGURES[d])
    const position = new THREE.Vector3()
    const turn = new THREE.Quaternion()
    const one = new THREE.Vector3(1, 1, 1)
    sections.forEach((s, index) => {
      const length = s.from - s.to
      const columns = Math.floor(length / SEAT_PITCH)
      const pattern = new Set<string>()
      // the number reads left to right from the track: on the right stand
      // that is up the straight (+w), on the left the frame is turned round
      if (s.number && figures.every(Boolean)) {
        const width = figures.length * 6 - 1
        const start = Math.floor(columns / 2 - width)
        figures.forEach((figure, f) =>
          figure.forEach((line, top) => {
            for (let x = 0; x < 5; x++)
              if (line[x] === "X")
                for (const dx of [0, 1])
                  pattern.add(
                    `${ROWS - 3 - top}:${start + (f * 6 + x) * 2 + dx}`,
                  )
          }),
        )
      }
      turn.setFromAxisAngle(
        new THREE.Vector3(0, 1, 0),
        s.side > 0 ? 0 : Math.PI,
      )
      for (let r = 0; r < ROWS; r++)
        for (let c = 0; c < columns; c++) {
          position
            .set(r * TREAD + 0.5, PLINTH + r * RISE, (c + 0.5) * SEAT_PITCH)
            .applyMatrix4(s.matrix)
          seatMatrices.push(new THREE.Matrix4().compose(position, turn, one))
          const lit = pattern.has(`${r}:${c}`)
          seatColours.push(
            lit ? SEAT_NUMBER : (r + index) % 4 === 0 ? SEAT_ALT : SEAT,
          )
          // the number stays clear so it can be read
          if (!lit && random() < occupancy) {
            const lean = new THREE.Quaternion().setFromAxisAngle(
              new THREE.Vector3(0, 1, 0),
              (s.side > 0 ? 0 : Math.PI) + (random() - 0.5) * 0.5,
            )
            crowd.push({
              matrix: new THREE.Matrix4().compose(
                position.clone().add(new THREE.Vector3(0, 0.02, 0)),
                lean,
                new THREE.Vector3(1, 0.88 + random() * 0.24, 1),
              ),
              shirt: SHIRTS[Math.floor(random() * SHIRTS.length)],
              skin: SKIN[Math.floor(random() * SKIN.length)],
            })
          }
        }
    })
    return { seatMatrices, seatColours, crowd }
  }, [quality])

  const instanced = useMemo(() => {
    const seats = new THREE.InstancedMesh(
      seatGeometry(),
      new THREE.MeshStandardMaterial({ roughness: 0.85, metalness: 0 }),
      people.seatMatrices.length,
    )
    people.seatMatrices.forEach((m, i) => {
      seats.setMatrixAt(i, m)
      seats.setColorAt(i, people.seatColours[i])
    })
    // seated spectators: a torso and a head, facing the track
    const torso = new THREE.CylinderGeometry(0.12, 0.17, 0.46, 6)
      .scale(0.8, 1, 1)
      .translate(-0.02, 0.3, 0)
    const head = new THREE.IcosahedronGeometry(0.1, 0).translate(-0.04, 0.64, 0)
    const bodies = new THREE.InstancedMesh(
      torso,
      new THREE.MeshStandardMaterial({ roughness: 0.95 }),
      people.crowd.length,
    )
    const heads = new THREE.InstancedMesh(
      head,
      new THREE.MeshStandardMaterial({ roughness: 0.9 }),
      people.crowd.length,
    )
    people.crowd.forEach((p, i) => {
      bodies.setMatrixAt(i, p.matrix)
      bodies.setColorAt(i, p.shirt)
      heads.setMatrixAt(i, p.matrix)
      heads.setColorAt(i, p.skin)
    })
    for (const mesh of [seats, bodies, heads]) {
      ;(mesh.material as THREE.Material).onBeforeCompile = addHaze
      mesh.instanceMatrix.needsUpdate = true
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
      mesh.computeBoundingSphere()
    }
    return { seats, bodies, heads }
  }, [people])
  useEffect(
    () => () => {
      for (const mesh of Object.values(instanced)) {
        mesh.geometry.dispose()
        ;(mesh.material as THREE.Material).dispose()
        mesh.dispose()
      }
    },
    [instanced],
  )

  const board = useMemo(() => {
    const t = createBoardTexture(
      `${profile.name}  ·  #${RACE_NUMBER}  ·  ${profile.role}`,
    )
    t.wrapS = THREE.RepeatWrapping
    return t
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fontsVersion])
  useEffect(() => () => board.dispose(), [board])

  return (
    <group>
      <mesh geometry={geometry.deck}>
        <meshStandardMaterial
          color="#101216"
          roughness={0.95}
          onBeforeCompile={addHaze}
        />
      </mesh>
      <mesh geometry={geometry.steel}>
        <meshStandardMaterial
          color="#14171c"
          roughness={0.85}
          metalness={0.15}
          onBeforeCompile={addHaze}
        />
      </mesh>
      {/* a faint warm glow, well under the bloom threshold */}
      <mesh geometry={geometry.lights}>
        <meshBasicMaterial
          color={[0.34, 0.3, 0.25]}
          onBeforeCompile={addHaze}
        />
      </mesh>
      <mesh geometry={geometry.boards}>
        <meshBasicMaterial
          map={board}
          color={[0.2, 0.2, 0.2]}
          onBeforeCompile={addHaze}
        />
      </mesh>
      <primitive object={instanced.seats} />
      <primitive object={instanced.bodies} />
      <primitive object={instanced.heads} />
    </group>
  )
}
