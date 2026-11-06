import { ArrowLeft } from "lucide-react"
import { ButtonLink, Nudge } from "@/components/ui/Button"

/** Shown when WebGL is unavailable: the race needs the 3D scene. */
export function RaceUnavailable() {
  return (
    <section
      aria-labelledby="race-unavailable"
      className="relative flex min-h-[100svh] items-end pb-[14vh]"
    >
      <div className="container-page relative">
        <p className="eyebrow flex items-center gap-2.5 text-mute">
          <span
            className="h-1.5 w-1.5 rounded-full bg-signal"
            aria-hidden="true"
          />
          Race mode
        </p>
        <h1
          id="race-unavailable"
          className="mt-5 max-w-[16ch] font-wide text-[clamp(2.2rem,6vw,4.5rem)] leading-[0.95] font-extrabold tracking-[-0.035em] italic"
        >
          The circuit needs 3D graphics.
        </h1>
        <p className="mt-6 max-w-[520px] text-[17px] leading-relaxed text-paper/75">
          This browser couldn’t start WebGL, so the race can’t run here. Every
          case study is still a click away on the grid.
        </p>
        <div className="pointer-events-auto mt-8">
          <ButtonLink to="/">
            <Nudge direction="left">
              <ArrowLeft size={16} aria-hidden="true" />
            </Nudge>
            Back to the grid
          </ButtonLink>
        </div>
      </div>
    </section>
  )
}
