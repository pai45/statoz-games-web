import { useEffect, useRef } from "react"
import * as THREE from "three"
import { useFrame, useThree } from "@react-three/fiber"
import { PerformanceMonitor } from "@react-three/drei"
import { useStore } from "@/state/store"
import { Gantry } from "./Gantry"
import { Floodlights } from "./Floodlights"
import { Lighting } from "./Lighting"
import { GridCars } from "./GridCars"
import { CameraRig } from "./CameraRig"
import { Effects } from "./Effects"
import { RaceWorld } from "../race/RaceWorld"
import { RaceDirector } from "../race/RaceDirector"

/** Signals that shaders are compiled and the first frames are on screen. */
function ReadySignal() {
  const frames = useRef(0)
  const setSceneReady = useStore((s) => s.setSceneReady)
  useFrame(() => {
    frames.current += 1
    if (frames.current === 3) setSceneReady()
  })
  return null
}

/** Tone mapping lives in the post stack when it is active, otherwise on the renderer. */
function ToneMappingSync({ post }: { post: boolean }) {
  const gl = useThree((s) => s.gl)
  useEffect(() => {
    gl.toneMapping = post ? THREE.NoToneMapping : THREE.ACESFilmicToneMapping
    gl.toneMappingExposure = 1
  }, [gl, post])
  return null
}

export function GridScene({
  onSelect,
  lockQuality,
}: {
  onSelect: (slug: string) => void
  lockQuality: boolean
}) {
  const quality = useStore((s) => s.quality)
  const setQuality = useStore((s) => s.setQuality)
  // anti-aliasing is fixed when the context is made: a session that began on
  // high quality has none of its own, so if it drops to low it keeps a light
  // post stack for its multisampling
  const nativeAA = useThree(
    (s) => s.gl.getContextAttributes()?.antialias ?? false,
  )
  const post = quality === "high" ? "full" : nativeAA ? null : "lite"
  // the same cars, gantry and lights double as the race; only the circuit swaps in
  return (
    <>
      <color attach="background" args={["#05060a"]} />
      <fogExp2 attach="fog" args={["#07090d", 0.012]} />
      <Lighting />
      <RaceWorld />
      <Gantry />
      <Floodlights />
      <GridCars onSelect={onSelect} />
      <CameraRig />
      <RaceDirector />
      <ReadySignal />
      <ToneMappingSync post={post !== null} />
      {post && <Effects lite={post === "lite"} />}
      {!lockQuality && (
        <PerformanceMonitor flipflops={1} onDecline={() => setQuality("low")} />
      )}
    </>
  )
}
