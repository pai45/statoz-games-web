import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from "react"
import { createPortal } from "react-dom"
import { m } from "motion/react"
import { Gamepad2, Keyboard, Pointer, X } from "lucide-react"
import { getCaseStudy } from "@/data/caseStudies"
import { DIFFICULTIES, LAP_OPTIONS, useRaceStore } from "@/race/raceStore"
import { useMediaQuery } from "@/hooks/useMediaQuery"
import { EASE_OUT } from "@/lib/motion"
import { cn } from "@/lib/cn"
import { Button } from "@/components/ui/Button"
import { Key, Segmented, Toggle } from "./RaceControls"

/** One titled group of settings. */
function Group({
  title,
  note,
  children,
}: {
  title: string
  note?: string
  children: ReactNode
}) {
  const id = `race-settings-${title.toLowerCase().replace(/\W+/g, "-")}`
  return (
    <section
      aria-labelledby={id}
      className="border-t border-white/10 py-5 first:border-t-0 first:pt-1"
    >
      <div className="flex items-baseline justify-between gap-3">
        <h3 id={id} className="eyebrow text-[10px] text-paper/80">
          {title}
        </h3>
        {note && <p className="text-[11px] text-dim">{note}</p>}
      </div>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  )
}

/** A list of bindings for one input device. */
function Bindings({
  device,
  icon,
  children,
}: {
  device: string
  icon: ReactNode
  children: ReactNode
}) {
  return (
    <div>
      <h4 className="flex items-center gap-1.5 text-[11px] text-dim">
        {icon}
        {device}
      </h4>
      <dl className="mt-2.5 space-y-2">{children}</dl>
    </div>
  )
}

// a named type: oxfmt 0.2 mangles short inline type literals (drops the `;`)
type BindingProps = {
  keys: ReactNode
  action: string
}

/** The keys or buttons, then what they do. */
function Binding({ keys, action }: BindingProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="flex flex-wrap items-center gap-1">{keys}</dt>
      <dd className="text-right text-[12px] text-paper/60">{action}</dd>
    </div>
  )
}

const Or = ({ children = "or" }: { children?: string }) => (
  <span className="px-0.5 text-[11px] text-dim">{children}</span>
)

/**
 * Every race setting and the controls, in one dialog. It opens over the
 * setup screen, the pause menu or the results.
 */
export function RaceSettings() {
  const laps = useRaceStore((s) => s.laps)
  const difficulty = useRaceStore((s) => s.difficulty)
  const sound = useRaceStore((s) => s.sound)
  const autoThrottle = useRaceStore((s) => s.autoThrottle)
  const racingLine = useRaceStore((s) => s.racingLine)
  const camera = useRaceStore((s) => s.camera)
  const phase = useRaceStore((s) => s.phase)
  const careerMode = useRaceStore((s) => s.mode === "career")
  // the top rule takes the livery of the selected car, like the setup panel
  const accent = getCaseStudy(useRaceStore((s) => s.slug))?.livery.accent
  const touch = useMediaQuery("(pointer: coarse)")
  const dialog = useRef<HTMLDivElement>(null)
  // whatever opened the dialog: read while rendering, before the screen
  // beneath turns inert (an effect would see focus already inside here)
  const [opener] = useState(() => document.activeElement as HTMLElement | null)
  const race = useRaceStore.getState
  const close = () => race().setSettingsOpen(false)
  // laps and rivals cannot change a race that is under way
  const underway = phase !== "select" && phase !== "results"
  // with a keyboard there is a full legend, so it gets its own column
  const wide = !touch

  // focus moves into the dialog, and back to the opener on close
  useEffect(() => {
    dialog.current?.focus()
    return () => opener?.focus?.()
  }, [opener])

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      // close this dialog only, not the pause menu beneath it
      e.preventDefault()
      e.stopPropagation()
      close()
      return
    }
    if (e.key !== "Tab" || !dialog.current) return
    e.stopPropagation()
    const items = Array.from(
      dialog.current.querySelectorAll<HTMLElement>("button, a[href]"),
    ).filter((el) => el.tabIndex >= 0)
    if (!items.length) return
    const first = items[0]
    const last = items[items.length - 1]
    const active = document.activeElement
    if (e.shiftKey && (active === first || active === dialog.current)) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && active === last) {
      e.preventDefault()
      first.focus()
    }
  }

  // portalled: the page content sits in a stacking context below the site header
  return createPortal(
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 grid place-items-center bg-ink/70 p-3 backdrop-blur-[6px] md:p-6"
      style={accent ? { "--accent": accent } as CSSProperties : undefined}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close()
      }}
    >
      <m.div
        ref={dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="race-settings-title"
        tabIndex={-1}
        onKeyDown={onKeyDown}
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: EASE_OUT }}
        className={cn(
          "flex max-h-[calc(100svh-1.5rem)] w-full max-w-[440px] flex-col overflow-hidden rounded-[10px] border border-white/10 bg-ink-2/95 shadow-[0_30px_80px_rgba(0,0,0,0.6)] outline-none",
          wide && "md:max-h-[calc(100svh-3rem)] md:max-w-[820px]",
        )}
      >
        <div
          className="h-[3px] shrink-0 bg-[var(--accent,#ff3b30)]"
          aria-hidden="true"
        />
        <div className="flex shrink-0 items-start justify-between gap-4 px-5 pt-5 pb-4 md:px-7 md:pt-6 md:pb-5">
          <div>
            <p className="eyebrow text-dim">Race mode</p>
            <h2
              id="race-settings-title"
              className="mt-2 font-wide text-[30px] leading-none font-extrabold tracking-[-0.03em] italic"
            >
              Settings
            </h2>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Close settings"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-[6px] border border-white/10 text-paper transition-colors hover:bg-white/[0.06]"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        <div
          className={cn(
            "min-h-0 overflow-y-auto overscroll-contain px-5 md:px-7",
            wide && "md:grid md:grid-cols-2",
          )}
        >
          <div className={cn(wide && "md:pr-8")}>
            <Group
              title="Race"
              note={underway ? "Applies from the next start" : undefined}
            >
              {careerMode ? <p className="text-[12px] text-paper/70">Career championships set the laps and rival strength. Driving assists remain available.</p> : <><Segmented
                label="Laps"
                value={laps}
                options={LAP_OPTIONS.map((n) => ({ value: n, label: n }))}
                onChange={(n) => race().setLaps(n)}
              />
              <Segmented
                label="Rivals"
                value={difficulty}
                options={DIFFICULTIES}
                onChange={(d) => race().setDifficulty(d)}
              />
              </>}
            </Group>

            <Group title="Assists">
              <Toggle
                label="Racing line"
                hint="Shows where to brake"
                checked={racingLine}
                onChange={(on) => race().setRacingLine(on)}
              />
              <Toggle
                label="Auto-accelerate"
                hint="Steer and brake only"
                checked={autoThrottle}
                onChange={(on) => race().setAutoThrottle(on)}
              />
            </Group>

            <Group title="Sound & camera">
              <Toggle
                label="Engine sound"
                checked={sound}
                onChange={(on) => race().setSound(on)}
              />
              <Toggle
                label="Onboard camera"
                hint="Cockpit view instead of the chase cam"
                checked={camera === "onboard"}
                onChange={() => race().toggleCamera()}
              />
            </Group>
          </div>

          <div
            className={cn(
              "border-t border-white/10",
              wide && "md:border-t-0 md:border-l md:pl-8",
            )}
          >
            <Group title="Controls">
              {touch ? (
                <Bindings
                  device="Touch"
                  icon={<Pointer size={13} aria-hidden="true" />}
                >
                  <p className="text-[12px] leading-relaxed text-paper/60">
                    On-screen steering and pedals appear when the race starts.
                  </p>
                </Bindings>
              ) : (
                <Bindings
                  device="Keyboard"
                  icon={<Keyboard size={13} aria-hidden="true" />}
                >
                  <Binding
                    keys={
                      <>
                        <Key>W</Key>
                        <Key>A</Key>
                        <Key>S</Key>
                        <Key>D</Key>
                        <Or>or arrows</Or>
                      </>
                    }
                    action="Drive"
                  />
                  <Binding
                    keys={
                      <>
                        <Key>Esc</Key>
                        <Or />
                        <Key>P</Key>
                      </>
                    }
                    action="Pause"
                  />
                  <Binding keys={<Key>C</Key>} action="Switch camera" />
                  <Binding keys={<Key>R</Key>} action="Reset car to track" />
                  <Binding keys={<Key>M</Key>} action="Engine sound on/off" />
                </Bindings>
              )}
              <Bindings
                device="Gamepad"
                icon={<Gamepad2 size={13} aria-hidden="true" />}
              >
                <Binding
                  keys={
                    <>
                      <Key>L stick</Key>
                      <Or />
                      <Key>D-pad</Key>
                    </>
                  }
                  action="Steer"
                />
                <Binding
                  keys={
                    <>
                      <Key>RT</Key>
                      <Or />
                      <Key>A</Key>
                    </>
                  }
                  action="Accelerate"
                />
                <Binding
                  keys={
                    <>
                      <Key>LT</Key>
                      <Or />
                      <Key>B</Key>
                    </>
                  }
                  action="Brake"
                />
                <Binding keys={<Key>Y</Key>} action="Switch camera" />
                <Binding keys={<Key>Back</Key>} action="Reset car to track" />
                <Binding keys={<Key>Start</Key>} action="Pause" />
              </Bindings>
            </Group>
          </div>
        </div>

        <div className="flex shrink-0 items-center justify-between gap-4 border-t border-white/10 px-5 py-4 md:px-7">
          <p className="text-[11px] text-dim">Changes save automatically</p>
          <Button
            onClick={close}
            className="h-11 min-w-[8.5rem] justify-center"
          >
            Done
          </Button>
        </div>
      </m.div>
    </m.div>,
    document.body,
  )
}
