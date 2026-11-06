import { Canvas } from "@react-three/fiber"
import { QUALITY_LOCKED, useStore } from "@/state/store"
import { GridScene } from "./scene/GridScene"

export default function Experience({
  onSelect,
}: {
  onSelect: (slug: string) => void
}) {
  const quality = useStore((s) => s.quality)
  const paused = useStore((s) => s.paused)

  return (
    // The canvas keeps the large viewport height (100lvh; 100vh where lvh is
    // unsupported, which phones also size to the large viewport). Pinned to
    // both edges it would resize whenever a phone's toolbar shows or hides
    // while scrolling, and every resize clears the WebGL buffer: a flicker.
    <div
      className="fixed inset-x-0 top-0 z-0 h-screen supports-[height:100lvh]:h-lvh"
      aria-hidden="true"
    >
      <Canvas
        shadows="percentage"
        dpr={quality === "high" ? [1, 1.75] : [1, 1.3]}
        // the container is fixed: no need to re-measure it on every scroll
        resize={{ scroll: false }}
        gl={{
          antialias: quality !== "high",
          powerPreference: "high-performance",
          stencil: false,
        }}
        camera={{ fov: 34, near: 0.1, far: 240, position: [12, 7, 14] }}
        frameloop={paused ? "never" : "always"}
      >
        <GridScene onSelect={onSelect} lockQuality={QUALITY_LOCKED} />
      </Canvas>
    </div>
  )
}
