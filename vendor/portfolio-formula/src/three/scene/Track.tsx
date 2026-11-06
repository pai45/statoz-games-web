import { useEffect, useMemo } from "react"
import { useStore } from "@/state/store"
import { createMarkingsTexture, MARKINGS } from "../textures"

export function Markings() {
  const quality = useStore((s) => s.quality)
  const fontsVersion = useStore((s) => s.fontsVersion)
  const markings = useMemo(
    () => createMarkingsTexture(quality === "high"),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [quality, fontsVersion],
  )
  useEffect(() => () => markings.dispose(), [markings])
  return (
    <mesh
      rotation-x={-Math.PI / 2}
      position={[
        (MARKINGS.xMin + MARKINGS.xMax) / 2,
        0.006,
        (MARKINGS.zMin + MARKINGS.zMax) / 2,
      ]}
      receiveShadow
    >
      <planeGeometry
        args={[MARKINGS.xMax - MARKINGS.xMin, MARKINGS.zMax - MARKINGS.zMin]}
      />
      <meshStandardMaterial
        map={markings}
        transparent
        depthWrite={false}
        roughness={0.78}
        metalness={0}
        polygonOffset
        polygonOffsetFactor={-2}
      />
    </mesh>
  )
}

