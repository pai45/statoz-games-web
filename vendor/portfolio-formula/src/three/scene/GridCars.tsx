import { useEffect, useMemo, useRef } from "react"
import * as THREE from "three"
import { useFrame } from "@react-three/fiber"
import { useCursor } from "@react-three/drei"
import { caseStudies } from "@/data/caseStudies"
import type { CaseStudy } from "@/data/types"
import { useStore } from "@/state/store"
import { useRaceStore } from "@/race/raceStore"
import { F1Car } from "../car/F1Car"
import { gridSlot } from "../layout"
import { createRadialTexture, createSlotTexture } from "../textures"
import { getContactShadow, type ContactShadow } from "../contactShadow"
import { carRigs } from "../race/raceView"
import { paintedStudy } from "@/race/paints"

type SelectHandler = (slug: string) => void

type CarTextures = {
  radial: THREE.Texture
  slot: THREE.Texture
  shadow: ContactShadow
}

export function GridCars({ onSelect }: { onSelect: SelectHandler }) {
  const textures = useMemo(
    () => ({
      radial: createRadialTexture(),
      slot: createSlotTexture(),
      shadow: getContactShadow("f1"),
    }),
    [],
  )
  const hovered = useStore((s) => s.hovered)
  const racing = useRaceStore((s) => s.phase !== "select")
  const raceMode = useStore((s) => s.mode === "race")
  useCursor(!!hovered && !(raceMode && racing))
  return (
    <group>
      {caseStudies.map((study) => (
        <GridCar
          key={study.slug}
          study={study}
          onSelect={onSelect}
          textures={textures}
        />
      ))}
    </group>
  )
}

function GridCar({
  study,
  onSelect,
  textures,
}: {
  study: CaseStudy
  onSelect: SelectHandler
  textures: CarTextures
}) {
  const slot = useMemo(() => gridSlot(study.position), [study.position])
  const fontsVersion = useStore((s) => s.fontsVersion)
  const quality = useStore((s) => s.quality)
  const setHovered = useStore((s) => s.setHovered)
  const isHovered = useStore((s) => s.hovered === study.slug)
  const isFocused = useStore(
    (s) =>
      (s.shot.kind === "car" || s.shot.kind === "detail") &&
      s.shot.slug === study.slug,
  )
  const raceMode = useStore((s) => s.mode === "race")
  const racing = useRaceStore((s) => s.phase !== "select") && raceMode
  const paint = useRaceStore(s => s.phase === "select" ? s.paint : s.config?.paint ?? -1)
  const selected = useRaceStore(s => s.slug)
  const unlocked = useRaceStore(s => paint >= 0 && s.career.best[paint] !== null)
  const appearance = useMemo(() => study.slug === selected && unlocked ? paintedStudy(study, paint) : study, [study, selected, unlocked, paint])
  // slot glows belong to the grid; they would trail the car round the circuit
  const active = (isHovered || isFocused) && !racing

  const root = useRef<THREE.Group>(null)
  const body = useRef<THREE.Group>(null)
  useEffect(() => {
    if (!root.current || !body.current) return
    carRigs.set(study.slug, { root: root.current, body: body.current })
    return () => {
      carRigs.delete(study.slug)
    }
  }, [study.slug])

  const glowColor = useMemo(
    () => new THREE.Color(study.livery.accent).multiplyScalar(2.6),
    [study.livery.accent],
  )
  const outline = useRef<THREE.MeshBasicMaterial>(null)
  const pool = useRef<THREE.MeshBasicMaterial>(null)
  useFrame((_, delta) => {
    const target = active ? 1 : 0
    if (outline.current)
      outline.current.opacity = THREE.MathUtils.damp(
        outline.current.opacity,
        target,
        6,
        delta,
      )
    if (pool.current)
      pool.current.opacity = THREE.MathUtils.damp(
        pool.current.opacity,
        target * 0.38,
        5,
        delta,
      )
  })

  return (
    <group ref={root} position={slot}>
      <group ref={body}>
        <F1Car
          study={appearance}
          fontsVersion={fontsVersion}
          artWidth={quality === "high" ? 1536 : 1024}
        />
      </group>

      {/* contact shadow, shaped like the car */}
      <mesh
        rotation-x={-Math.PI / 2}
        position={[0, 0.012, textures.shadow.z]}
        renderOrder={1}
      >
        <planeGeometry args={[textures.shadow.width, textures.shadow.length]} />
        <meshBasicMaterial
          color="#000000"
          alphaMap={textures.shadow.texture}
          transparent
          depthWrite={false}
        />
      </mesh>
      {/* slot outline + light pool when the car is hovered or in focus */}
      <mesh
        rotation-x={-Math.PI / 2}
        position={[0, 0.016, 0.1]}
        renderOrder={1}
      >
        <planeGeometry args={[2.8, 6.6]} />
        <meshBasicMaterial
          ref={outline}
          map={textures.slot}
          color={glowColor}
          transparent
          opacity={0}
          depthWrite={false}
          toneMapped={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh
        rotation-x={-Math.PI / 2}
        position={[0, 0.014, 0.1]}
        renderOrder={1}
      >
        <planeGeometry args={[6, 10]} />
        <meshBasicMaterial
          ref={pool}
          map={textures.radial}
          color={study.livery.accent}
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* simplified hit volume keeps pointer raycasts cheap */}
      <mesh
        position={[0, 0.62, 0.15]}
        onPointerOver={(e) => {
          if (racing) return
          e.stopPropagation()
          setHovered(study.slug)
        }}
        onPointerOut={() => setHovered(null)}
        onClick={(e) => {
          if (racing) return
          e.stopPropagation()
          // on the race setup screen a click picks the car instead of opening its case study
          if (raceMode) useRaceStore.getState().setSlug(study.slug)
          else onSelect(study.slug)
        }}
      >
        <boxGeometry args={[2.1, 1.25, 5.9]} />
        <meshBasicMaterial
          transparent
          opacity={0}
          depthWrite={false}
          colorWrite={false}
        />
      </mesh>
    </group>
  )
}
