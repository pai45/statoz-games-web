import { useEffect, useRef, type KeyboardEvent } from "react"
import { useNavigate } from "react-router"
import { m } from "motion/react"
import { Settings2 } from "lucide-react"
import { useRaceStore } from "@/race/raceStore"
import { pollGamepadActions } from "@/race/controls"
import { raceCommands } from "@/race/telemetry"
import { useAnimationFrame } from "@/hooks/useAnimationFrame"
import { useMediaQuery } from "@/hooks/useMediaQuery"
import { EASE_OUT } from "@/lib/motion"
import { Button } from "@/components/ui/Button"
import { MenuNavigation } from "./FormulaMenu"

/** Pause dialog: resume, restart, change car, settings or leave. */
export function RacePause() {
  const navigate = useNavigate()
  const phase = useRaceStore((s) => s.phase)
  const settingsOpen = useRaceStore((s) => s.settingsOpen)
  const touch = useMediaQuery("(pointer: coarse)")
  const dialog = useRef<HTMLDivElement>(null)
  const resumeButton = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    resumeButton.current?.focus()
    return () => previous?.focus?.()
  }, [])
  // the race loop is stopped, so poll the gamepad's Start button here
  useAnimationFrame(() => pollGamepadActions())

  const race = useRaceStore.getState
  const resume = () => race().setPaused(false)
  const restart = () => race().start()

  // keep Tab inside the dialog
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Tab" || !dialog.current) return
    const items =
      dialog.current.querySelectorAll<HTMLElement>("button, a[href]")
    if (!items.length) return
    const first = items[0]
    const last = items[items.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }

  return (
    <MenuNavigation screen="pause">
    <div
      className="pointer-events-auto fixed inset-0 z-40 grid place-items-center bg-ink/65 p-4 backdrop-blur-[6px]"
      // the settings dialog sits on top; this one waits behind it
      inert={settingsOpen}
    >
      <m.div
        ref={dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="pause-title"
        onKeyDown={onKeyDown}
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: EASE_OUT }}
        className="w-full max-w-[380px] overflow-hidden rounded-[10px] border border-white/10 bg-ink-2/95 shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
      >
        <div
          className="h-[3px] bg-[var(--accent,#ff3b30)]"
          aria-hidden="true"
        />
        <div className="p-6">
          <p className="eyebrow text-dim">Race paused</p>
          <h2
            id="pause-title"
            className="mt-2 font-wide text-[34px] leading-none font-extrabold tracking-[-0.03em] italic"
          >
            Box, box.
          </h2>
          <div className="mt-6 grid gap-2">
            <Button
              ref={resumeButton}
              onClick={resume}
              className="h-12 w-full justify-between"
            >
              Resume
              {!touch && (
                <span className="font-mono text-[10px] text-ink/45">ESC</span>
              )}
            </Button>
            <Button variant="secondary" onClick={restart} className="w-full">
              Restart race
            </Button>
            {phase === "racing" && (
              <Button
                variant="secondary"
                onClick={() => {
                  raceCommands.reset = true
                  resume()
                }}
                className="w-full"
              >
                Reset car to track
              </Button>
            )}
            <Button
              variant="secondary"
              onClick={() => race().backToSelect()}
              className="w-full"
            >
              {race().mode === "career" ? "Back to Career" : "Change car"}
            </Button>
            <Button
              variant="secondary"
              aria-haspopup="dialog"
              onClick={() => race().setSettingsOpen(true)}
              className="w-full"
            >
              <Settings2 size={15} aria-hidden="true" />
              Settings
            </Button>
            <Button
              variant="quiet"
              onClick={() => navigate("/")}
              className="w-full justify-center"
            >
              Back to Motorsport
            </Button>
          </div>
        </div>
      </m.div>
    </div>
    </MenuNavigation>
  )
}
