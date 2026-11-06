import { useRef } from "react"
import * as THREE from "three"
import { useFrame, useThree } from "@react-three/fiber"
import { easing } from "maath"
import { useStore } from "@/state/store"
import { useRaceStore } from "@/race/raceStore"
import { stopProgress } from "@/lib/scrollStage"
import { introPose, sheetCover, shotPose } from "../layout"
import { cameraHandoff } from "../race/raceView"

const reducedMotionQuery =
  typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)")
    : null
const coarsePointerQuery =
  typeof window !== "undefined" ? window.matchMedia("(pointer: coarse)") : null

const NO_POINTER = { x: 0, y: 0 }
const UP = new THREE.Vector3(0, 1, 0)
/** how far (radians) the camera swings round its subject across one scroll stop */
const SCRUB = 0.11

/** Eases the camera towards the pose of the current shot, with gentle drift and pointer parallax. */
export function CameraRig() {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera
  const lookAt = useRef(new THREE.Vector3())
  const desired = useRef(new THREE.Vector3())
  const shift = useRef(new THREE.Vector2())
  const ready = useRef(false)

  useFrame((state, delta) => {
    const { shot, intro, mode, sheet } = useStore.getState()
    // the race camera owns the view from the grid to the results
    if (mode === "race" && useRaceStore.getState().phase !== "select") return
    if (cameraHandoff.race) {
      // resume from wherever the race camera left the lens
      cameraHandoff.race = false
      shift.current.set(0, 0)
      camera.getWorldDirection(lookAt.current)
      lookAt.current.multiplyScalar(12).add(camera.position)
    }
    const aspect = state.size.width / Math.max(1, state.size.height)
    const covered = sheetCover(sheet, state.size.height)
    const pose =
      intro === "running"
        ? introPose(aspect)
        : shotPose(shot, aspect, state.size.height, covered, stopProgress.value)
    const reduced = reducedMotionQuery?.matches ?? false
    const dt = Math.min(delta, 0.1)

    if (!ready.current) {
      camera.position.copy(pose.position)
      lookAt.current.copy(pose.target)
      camera.fov = pose.fov
      shift.current.set(pose.shift[0], pose.shift[1])
      ready.current = true
    }

    desired.current.copy(pose.position)
    if (!reduced && intro !== "running") {
      if (
        shot.kind === "car" ||
        shot.kind === "career" ||
        shot.kind === "expertise" ||
        shot.kind === "finish"
      ) {
        // scrolling through a stop swings the camera gently round its subject
        // (always on down the grid), so the page answers every scroll while
        // the subject holds its place beside the card
        const offset = desired.current.sub(pose.target)
        const side = Math.sign(offset.x) || 1
        offset.applyAxisAngle(UP, (stopProgress.value - 0.5) * SCRUB * side)
        desired.current.add(pose.target)
      }
      const t = state.clock.elapsedTime
      const pointer = coarsePointerQuery?.matches ? NO_POINTER : state.pointer
      const strength =
        shot.kind === "overview" || shot.kind === "aerial" ? 1 : 0.45
      desired.current.x +=
        (Math.sin(t * 0.13) * 0.35 + pointer.x * 0.5) * strength
      desired.current.y +=
        (Math.sin(t * 0.19) * 0.1 + pointer.y * 0.22) * strength
    }

    const smooth = reduced ? 0.12 : intro === "out" ? 1.25 : 0.7
    easing.damp3(camera.position, desired.current, smooth, dt)
    easing.damp3(lookAt.current, pose.target, smooth, dt)
    camera.lookAt(lookAt.current)
    easing.damp(camera, "fov", pose.fov, smooth, dt)
    easing.damp(shift.current, "x", pose.shift[0], smooth, dt)
    easing.damp(shift.current, "y", pose.shift[1], smooth, dt)
    const { width, height } = state.size
    camera.setViewOffset(
      width,
      height,
      -shift.current.x * width,
      shift.current.y * height,
      width,
      height,
    )
    camera.updateProjectionMatrix()
  })
  return null
}
