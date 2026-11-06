import { useEffect, useMemo } from "react"
import type { ThreeElements } from "@react-three/fiber"
import type { CaseStudy } from "@/data/types"
import { CAR_PART_KEYS, getCarGeometry, type CarDecalKey } from "./carGeometry"
import { createLiveryMaterials } from "./liveryMaterials"
import { createLiveryArt } from "./liveryArt"

type Props = ThreeElements["group"] & {
  study: CaseStudy
  /** bump to rebuild decal textures once web fonts are ready */
  fontsVersion?: number
  /** width in pixels of the livery artwork (lower on the lightweight render path) */
  artWidth?: number
  /** false leaves the cockpit empty */
  driver?: boolean
}

const DECAL_KEYS: CarDecalKey[] = [
  "sidepodL",
  "sidepodR",
  "nose",
  "finL",
  "finR",
  "wingL",
  "wingR",
]

export function F1Car({
  study,
  fontsVersion = 0,
  artWidth = 1536,
  driver = true,
  ...props
}: Props) {
  const geometry = getCarGeometry(driver)
  const art = useMemo(
    () => createLiveryArt(study.livery, study.slug, artWidth),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [study.slug, study.livery, artWidth],
  )
  useEffect(() => () => art.dispose(), [art])
  const materials = useMemo(
    () =>
      createLiveryMaterials(
        study.livery,
        study.decalName ?? study.name,
        String(study.position).padStart(2, "0"),
        art,
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [study.slug, study.livery, fontsVersion, art],
  )
  useEffect(() => () => materials.dispose(), [materials])

  return (
    <group {...props}>
      {CAR_PART_KEYS.map((key) => (
        <mesh
          key={key}
          geometry={geometry.parts[key]}
          material={materials.byPart[key]}
          castShadow={key !== "glow" && key !== "visor"}
          receiveShadow={key !== "glow"}
        />
      ))}
      {DECAL_KEYS.map((key) => (
        <mesh
          key={key}
          geometry={geometry.decals[key].geometry}
          material={
            geometry.decals[key].texture === "name"
              ? materials.nameDecal
              : materials.numberDecal
          }
          renderOrder={2}
        />
      ))}
    </group>
  )
}
