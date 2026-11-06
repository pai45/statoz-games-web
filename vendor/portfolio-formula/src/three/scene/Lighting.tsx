import { useEffect, useRef } from "react"
import * as THREE from "three"
import { useFrame } from "@react-three/fiber"
import { Environment, Lightformer } from "@react-three/drei"
import { useStore } from "@/state/store"
import { LAST_SLOT_Z } from "../layout"
import { raceFocus } from "../race/raceView"

const MID = LAST_SLOT_Z / 2
const KEY_OFFSET = new THREE.Vector3(-15, 24, 26)
const GRID_SHADOW = { half: 26, top: 34 }
const RACE_SHADOW = 18

// the shadow camera's own axes while it follows the race, as Matrix4.lookAt
// builds them (the light keeps a fixed offset, so they never change)
const SHADOW_Z = KEY_OFFSET.clone().normalize()
const SHADOW_X = new THREE.Vector3(0, 1, 0).cross(SHADOW_Z).normalize()
const SHADOW_Y = SHADOW_Z.clone().cross(SHADOW_X)
const _focus = new THREE.Vector3()

/**
 * The point the light follows, moved onto the shadow map's texel grid. Sliding
 * the shadow camera by fractions of a texel every frame makes shadow edges
 * crawl and shimmer; in whole texels they hold still.
 */
function snapToTexels(x: number, z: number, texel: number) {
  _focus.set(x, 0, z)
  const a = _focus.dot(SHADOW_X)
  const b = _focus.dot(SHADOW_Y)
  return _focus
    .addScaledVector(SHADOW_X, Math.round(a / texel) * texel - a)
    .addScaledVector(SHADOW_Y, Math.round(b / texel) * texel - b)
}

/** Spotlight whose target is kept in sync without adding it to the scene graph. */
function AimedSpot({
  position,
  target,
  intensity,
  color,
}: {
  position: [number, number, number]
  target: [number, number, number]
  intensity: number
  color: string
}) {
  const ref = useRef<THREE.SpotLight>(null)
  useEffect(() => {
    const light = ref.current
    if (!light) return
    light.target.position.set(...target)
    light.target.updateMatrixWorld()
  }, [target])
  return (
    <spotLight
      ref={ref}
      position={position}
      angle={0.62}
      penumbra={0.9}
      intensity={intensity}
      decay={0}
      distance={70}
      color={color}
    />
  )
}

export function Lighting() {
  const key = useRef<THREE.DirectionalLight>(null)
  const following = useRef(false)
  const quality = useStore((s) => s.quality)
  useEffect(() => {
    const light = key.current
    if (!light) return
    light.target.position.set(0, 0, MID)
    light.target.updateMatrixWorld()
  }, [])

  // during a race the key light (and its shadow frustum) travels with the player's car
  useFrame(() => {
    const light = key.current
    if (!light) return
    if (raceFocus.active) {
      const texel = (RACE_SHADOW * 2) / light.shadow.mapSize.width
      const focus = snapToTexels(raceFocus.x, raceFocus.z, texel)
      light.target.position.copy(focus)
      light.position.copy(focus).add(KEY_OFFSET)
      light.target.updateMatrixWorld()
      if (!following.current) {
        following.current = true
        const cam = light.shadow.camera
        cam.left = cam.bottom = -RACE_SHADOW
        cam.right = cam.top = RACE_SHADOW
        cam.updateProjectionMatrix()
      }
    } else if (following.current) {
      following.current = false
      light.position.set(KEY_OFFSET.x, KEY_OFFSET.y, MID + KEY_OFFSET.z)
      light.target.position.set(0, 0, MID)
      light.target.updateMatrixWorld()
      const cam = light.shadow.camera
      cam.left = -GRID_SHADOW.half
      cam.right = GRID_SHADOW.half
      cam.top = GRID_SHADOW.top
      cam.bottom = -GRID_SHADOW.top
      cam.updateProjectionMatrix()
    }
  })

  return (
    <>
      <hemisphereLight args={["#5a6378", "#0a0b0d", 0.6]} />
      <directionalLight
        ref={key}
        position={[-15, 24, MID + 26]}
        intensity={4.2}
        color="#f5f6fb"
        castShadow={quality === "high"}
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.03}
        // a soft penumbra (in shadow-map texels, ~10 cm here) instead of a hard edge
        shadow-radius={4}
        shadow-camera-left={-26}
        shadow-camera-right={26}
        shadow-camera-top={34}
        shadow-camera-bottom={-34}
        shadow-camera-near={5}
        shadow-camera-far={110}
      />
      {/* cool rim from behind the grid */}
      <directionalLight
        position={[-14, 9, MID - 40]}
        intensity={0.7}
        color="#8fb0ff"
      />
      {/* floodlight pools along the grid */}
      <AimedSpot
        position={[-9, 18, 2]}
        target={[0, 0, -6]}
        intensity={2.2}
        color="#fff6ea"
      />
      <AimedSpot
        position={[9, 18, MID - 6]}
        target={[0, 0, MID - 10]}
        intensity={1.8}
        color="#f0f4ff"
      />
      {/* warm kicker from the start-light side */}
      <directionalLight
        position={[-6, 4, 30]}
        intensity={0.45}
        color="#ff6a4d"
      />
      <Environment frames={1} resolution={256} environmentIntensity={1.5}>
        <color attach="background" args={["#040507"]} />
        <Lightformer
          form="rect"
          intensity={4.5}
          color="#ffffff"
          position={[0, 14, 0]}
          rotation-x={Math.PI / 2}
          scale={[34, 5, 1]}
        />
        <Lightformer
          form="rect"
          intensity={3.2}
          color="#f2f5ff"
          position={[18, 7, 0]}
          rotation-y={-Math.PI / 2}
          scale={[70, 1.6, 1]}
        />
        <Lightformer
          form="rect"
          intensity={3.2}
          color="#f2f5ff"
          position={[-18, 7, 0]}
          rotation-y={Math.PI / 2}
          scale={[70, 1.6, 1]}
        />
        <Lightformer
          form="rect"
          intensity={1.4}
          color="#ff5240"
          position={[0, 3, 30]}
          rotation-y={Math.PI}
          scale={[16, 2, 1]}
        />
        <Lightformer
          form="ring"
          intensity={0.8}
          color="#c9d6ff"
          position={[0, 6, -40]}
          scale={8}
        />
      </Environment>
    </>
  )
}
