import * as THREE from "three"
import { caseStudies } from "@/data/caseStudies"
import type { Shot } from "@/state/store"

/** Distance between consecutive grid slots along the straight (metres). */
export const GRID_SPACING = 6.6
/** Lateral offset of the two grid columns. */
export const GRID_X = 2.75
/** z of the start line, just ahead of pole position. */
export const START_LINE_Z = 4.4
export const GANTRY_Z = 17
export const TRACK_HALF_WIDTH = 7.4

export function gridSlot(position: number) {
  const pole = position % 2 === 1
  return new THREE.Vector3(
    pole ? -GRID_X : GRID_X,
    0,
    -(position - 1) * GRID_SPACING,
  )
}

export const LAST_SLOT_Z = gridSlot(caseStudies.length).z

/**
 * Career mode is staged on a lift platform on the straight beyond the last
 * grid slot; it only rises out of the track while a season is on screen.
 */
export const CAREER_SET = new THREE.Vector3(0, 0, LAST_SLOT_Z - 19)

/** Expertise is staged further down the straight, past the career set. */
export const EXPERTISE_SET = new THREE.Vector3(0, 0, CAREER_SET.z - 24)

/**
 * The finish: the end of the straight, past the gallery wall. The podium
 * stands here; the finish line is painted across the track in front of it.
 */
export const FINISH_SET = new THREE.Vector3(0, 0, EXPERTISE_SET.z - 26)

/**
 * How far the camera stands back from the set. One framing for every season
 * (wide enough for the F1 car), so the driver holds his spot on screen while
 * the machines swap behind him.
 */
const CAREER_FRAME = 1.1

/**
 * A camera framing. `shift` is a lens shift as a fraction of the viewport
 * (x > 0 slides the subject right, y > 0 slides it up) so compositions can
 * leave room for copy without distorting perspective.
 */
export type Pose = {
  position: THREE.Vector3
  target: THREE.Vector3
  fov: number
  shift: [number, number]
}

const pose = (
  p: [number, number, number],
  t: [number, number, number],
  fov: number,
  shift: [number, number] = [0, 0],
): Pose => ({
  position: new THREE.Vector3(...p),
  target: new THREE.Vector3(...t),
  fov,
  shift,
})

// Development aid: ?pose=x,y,z,tx,ty,tz,fov,sx,sy overrides every shot.
const debugPose = (() => {
  if (!import.meta.env?.DEV) return null
  const raw = new URLSearchParams(window.location.search).get("pose")
  if (!raw) return null
  const n = raw.split(",").map(Number)
  if (n.length < 7 || n.some(Number.isNaN)) return null
  return pose([n[0], n[1], n[2]], [n[3], n[4], n[5]], n[6], [
    n[7] ?? 0,
    n[8] ?? 0,
  ])
})()

/** Ease a camera back from its target by `k`. */
function pullBack(
  target: [number, number, number],
  eye: [number, number, number],
  k: number,
): [number, number, number] {
  return [
    target[0] + (eye[0] - target[0]) * k,
    target[1] + (eye[1] - target[1]) * k,
    target[2] + (eye[2] - target[2]) * k,
  ]
}

/** Phones in portrait: lens shift and pull-back that fit the subject between the header and the docked card. */
function aboveSheet(height: number, sheet: number) {
  const header = 64 / height
  const cardTop = 1 - (sheet > 0 ? sheet : 0.45)
  const free = Math.max(0.15, cardTop - header)
  return {
    shiftY: THREE.MathUtils.clamp(0.54 - (header + cardTop) / 2, 0.12, 0.36),
    pull: THREE.MathUtils.clamp(0.47 / free, 1, 1.45),
  }
}

/**
 * The docked card's share of the visible screen, as a share of the canvas,
 * which runs on under a phone's toolbar when that is showing.
 */
export function sheetCover(sheet: number, canvasHeight: number) {
  const h = Math.max(1, canvasHeight)
  return sheet > 0
    ? 1 - (Math.min(window.innerHeight, h) * (1 - sheet)) / h
    : 0
}

/**
 * Portrait finish: the band between the header and the contact copy, as
 * shares of the screen height. The set stands in it, the flag waves in its
 * top-left corner.
 */
export function finishBand(height: number, sheet: number) {
  const header = 64 / height
  const cardTop = 1 - (sheet > 0 ? sheet : 0.45)
  return { header, cardTop, band: Math.max(0.14, cardTop - header) }
}

/**
 * Camera framing for each shot. Portrait (phone) framings follow a "stage +
 * sheet" layout: the subject is lens-shifted into the top ~45% of the screen,
 * above the content sheet, and never cropped.
 *
 * `sheet` is the share of the screen covered by the card docked to the bottom
 * on phones; car and career shots centre their subject in the space above it.
 */
export function shotPose(
  shot: Shot,
  aspect: number,
  height = 900,
  sheet = 0,
  progress = 0.5,
)/** how far through the current scroll stop the reader is (the gallery dolly follows it) */
: Pose {
  if (debugPose) return debugPose
  const portrait = aspect < 0.9
  // landscape phones: copy needs the left half, so subjects sit further right
  const short = !portrait && height < 540
  const mid = LAST_SLOT_Z / 2
  switch (shot.kind) {
    case "overview":
      return portrait
        ? pose([0, 12, mid + 38.8], [0, 0, mid + 6.8], 50, [0, 0.23])
        : pose(
            [-12.5, 8.5, 14.5],
            [0.8, 0.3, -11],
            38,
            short ? [0.27, 0.02] : [0.22, 0.06],
          )
    case "aerial":
      return portrait
        ? pose([2, 40, mid + 6], [0, 0, mid], 50, [0, 0.3])
        : pose([7, 28, mid + 16], [0, 0, mid], 40, [0.12, 0.14])
    case "car":
    case "detail": {
      const study =
        caseStudies.find((c) => c.slug === shot.slug) ?? caseStudies[0]
      const s = gridSlot(study.position)
      // frame each car from the outside of its column so neighbours never block the lens
      const side = Math.sign(s.x) || -1
      const at = (
        dx: number,
        dy: number,
        dz: number,
      ): [number, number, number] => [s.x + dx * side, s.y + dy, s.z + dz]
      if (shot.kind === "car") {
        if (portrait) {
          // centre the car between the header and the docked card, and pull
          // the camera back when that space gets tight (short phones)
          const { shiftY, pull } = aboveSheet(height, sheet)
          const target = at(0, 0.32, 0.15)
          return pose(pullBack(target, at(1.9, 4.2, 10.4), pull), target, 46, [
            0,
            shiftY,
          ])
        }
        return pose(
          at(6.0, 2.1, 7.0),
          at(0, 0.42, 0.15),
          32,
          short ? [0.25, 0] : [0.18, 0.02],
        )
      }
      return portrait
        ? pose(at(2.2, 3.2, 10.0), at(0, 0.4, 0.1), 46, [0, 0.21])
        : pose(
            at(4.3, 1.25, 7.6),
            at(0, 0.5, -0.2),
            30,
            short ? [0.25, 0.1] : [0.12, 0.17],
          )
    }
    default:
      return pose([-12.5, 8.5, 14.5], [0.8, 0.3, -11], 38, [0.22, 0.06])
  }
}

/** Driver's-eye view from pole position towards the start lights. */
export function introPose(aspect: number): Pose {
  const s = gridSlot(1)
  return aspect < 0.9
    ? pose([s.x, 1.9, s.z - 5.2], [s.x * 0.4, 3.2, GANTRY_Z], 62, [0, 0.14])
    : pose([s.x, 1.7, s.z - 4.6], [s.x * 0.4, 2.8, GANTRY_Z], 46, [0, 0.06])
}
