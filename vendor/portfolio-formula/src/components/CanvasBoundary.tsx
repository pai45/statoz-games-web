import { Component, type ReactNode } from "react"
import { useStore } from "@/state/store"

/** Falls back to a static backdrop if WebGL is unavailable or the scene throws. */
export class CanvasBoundary extends Component<{ children: ReactNode }, {
  failed: boolean
}> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error: unknown) {
    console.warn("3D grid unavailable, showing static backdrop.", error)
    const s = useStore.getState()
    s.setSceneReady()
    s.setIntro("done")
    s.setCanvasFailed()
  }

  render() {
    if (this.state.failed) return <StaticBackdrop />
    return this.props.children
  }
}

export function StaticBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-0 bg-ink"
      style={{
        backgroundImage:
          "radial-gradient(ellipse 80% 60% at 70% 40%, rgba(255,59,48,0.12), transparent 60%), repeating-linear-gradient(90deg, rgba(255,255,255,0.035) 0 1px, transparent 1px 120px)",
      }}
    />
  )
}
