import type { CaseStudy } from "@/data/types"
import { TIERS } from "./career"

/** Paint variants only alter bodywork; identity and handling stay unchanged. */
export function paintedStudy(study: CaseStudy, paint: number): CaseStudy {
  const tier = TIERS[paint]
  if (!tier) return study
  return { ...study, livery: { ...study.livery, primary: tier.color, secondary: "#10131a", accent: tier.color,
    decal: "#10131a", finish: paint >= 1 ? "metallic" : "gloss" } }
}
