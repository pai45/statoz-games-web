import {
  Bloom,
  EffectComposer,
  Noise,
  ToneMapping,
  Vignette,
} from "@react-three/postprocessing"
import { ToneMappingMode } from "postprocessing"

/**
 * The post stack. `lite` keeps only multisampling and tone mapping: the
 * anti-aliasing for a canvas created without it (a session that began on high
 * quality and dropped to low), so its edges do not shimmer as the camera moves.
 */
export function Effects({ lite = false }: { lite?: boolean }) {
  if (lite)
    return (
      <EffectComposer multisampling={4} enableNormalPass={false}>
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      </EffectComposer>
    )
  return (
    <EffectComposer multisampling={4} enableNormalPass={false}>
      <Bloom
        mipmapBlur
        luminanceThreshold={1.5}
        luminanceSmoothing={0.25}
        intensity={0.85}
        radius={0.72}
      />
      <Vignette offset={0.32} darkness={0.42} />
      {/* fresh grain every frame: kept faint, or it reads as the frame flickering */}
      <Noise premultiply opacity={0.12} />
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
    </EffectComposer>
  )
}
