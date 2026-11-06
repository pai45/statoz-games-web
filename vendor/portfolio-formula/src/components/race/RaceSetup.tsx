import {
  useEffect,
  useMemo,
  type CSSProperties,
  type KeyboardEvent,
} from "react"
import { Link } from "react-router"
import { ArrowLeft, ArrowRight, Flag, Settings2 } from "lucide-react"
import { m } from "motion/react"
import { caseStudies, getCaseStudy } from "@/data/caseStudies"
import { useStore } from "@/state/store"
import { DIFFICULTIES, useRaceStore } from "@/race/raceStore"
import { readRecord } from "@/race/records"
import { formatLap } from "@/race/format"
import { NumberWord, numberWord } from "@/lib/words"
import { EASE_OUT } from "@/lib/motion"
import { cn } from "@/lib/cn"
import { Button, Nudge } from "@/components/ui/Button"

/** Pre-race screen: pick a car (the camera frames it on the grid), check the settings, go. */
export function RaceSetup() {
  const selected = useRaceStore((s) => s.slug)
  const laps = useRaceStore((s) => s.laps)
  const difficulty = useRaceStore((s) => s.difficulty)
  const sound = useRaceStore((s) => s.sound)
  const autoThrottle = useRaceStore((s) => s.autoThrottle)
  const racingLine = useRaceStore((s) => s.racingLine)
  const sceneReady = useStore((s) => s.sceneReady)
  const study = getCaseStudy(selected) ?? caseStudies[0]
  const record = useMemo(() => readRecord(study.slug, laps), [study.slug, laps])
  const ahead = study.position - 1
  const rivals = DIFFICULTIES.find((d) => d.value === difficulty)?.label ?? ""
  const summary = [
    `${laps} ${laps === 1 ? "lap" : "laps"}`,
    `${rivals} rivals`,
    racingLine && "racing line",
    autoThrottle && "auto-accelerate",
    sound ? "sound on" : "sound off",
  ]
    .filter(Boolean)
    .join(" · ")

  const start = () => {
    if (!sceneReady) return
    useRaceStore.getState().start()
  }

  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key !== "Enter" || e.repeat) return
      // the settings dialog keeps its own keys
      if (useRaceStore.getState().settingsOpen) return
      const el = document.activeElement
      if (el && el !== document.body && el.id !== "main") return
      e.preventDefault()
      start()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  })

  const select = (slug: string) => useRaceStore.getState().setSlug(slug)
  const onListKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const step =
      e.key === "ArrowDown" || e.key === "ArrowRight"
        ? 1
        : e.key === "ArrowUp" || e.key === "ArrowLeft"
          ? -1
          : 0
    if (!step) return
    e.preventDefault()
    const i = caseStudies.findIndex((c) => c.slug === selected)
    const next = (i + step + caseStudies.length) % caseStudies.length
    select(caseStudies[next].slug)
    e.currentTarget
      .querySelectorAll<HTMLButtonElement>("[role=radio]")
      [next]?.focus()
  }

  return (
    <section
      aria-labelledby="race-title"
      className="pointer-events-none fixed inset-0 z-20 flex items-end pb-[max(0.75rem,env(safe-area-inset-bottom))] md:items-center md:pt-20 md:pb-8 short:items-stretch short:pt-[72px] short:pb-3"
      style={{ "--accent": study.livery.accent } as CSSProperties}
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[62%] bg-gradient-to-t from-ink via-ink/80 to-transparent md:hidden"
      />
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-0 hidden w-[55%] bg-gradient-to-r from-ink/75 to-transparent md:block"
      />
      <div className="container-page relative max-md:px-3">
        <m.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE_OUT }}
          className="pointer-events-auto flex max-h-[calc(100svh-96px)] w-full flex-col overflow-hidden rounded-[14px] border border-white/10 bg-ink-2/[0.97] shadow-[0_30px_80px_rgba(0,0,0,0.55)] md:max-w-[440px] md:rounded-[6px] md:bg-ink/80 md:backdrop-blur-xl short:h-full short:max-h-none short:max-w-[400px]"
        >
          <div
            className="h-[3px] shrink-0 bg-[var(--accent)] transition-colors duration-500"
            aria-hidden="true"
          />
          <div className="min-h-0 overflow-y-auto overscroll-contain p-4 roomy:p-6 short:p-4">
            <p className="eyebrow flex items-center gap-2 text-mute">
              <Flag size={13} aria-hidden="true" className="text-signal" />
              Race mode
            </p>
            <h1
              id="race-title"
              className="mt-2 font-wide text-[26px] leading-[0.95] font-extrabold tracking-[-0.03em] italic roomy:mt-3 roomy:text-[34px] short:text-[24px]"
            >
              Pick a car.
              <span className="compact:hidden">
                <br />
                Race the grid.
              </span>
            </h1>
            <p className="mt-3 text-[14px] leading-relaxed text-paper/70 compact:hidden [@media(max-height:800px)]:hidden">
              {NumberWord(caseStudies.length)} liveries,{" "}
              {numberWord(caseStudies.length)} identical cars. Your pick sets
              your grid slot — the other {numberWord(caseStudies.length - 1)}{" "}
              are your rivals.
            </p>

            {/* car picker: tower on desktop, chips on phones */}
            <div
              role="radiogroup"
              aria-label="Car"
              onKeyDown={onListKey}
              className="mt-4 flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] roomy:mt-5 roomy:flex-col roomy:gap-0 roomy:overflow-hidden roomy:rounded-[4px] roomy:border roomy:border-white/10 roomy:pb-0"
            >
              {caseStudies.map((c) => {
                const on = c.slug === selected
                return (
                  <button
                    key={c.slug}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    aria-label={`${c.name}, ${c.driverName}, starts P${c.position}`}
                    title={`${c.name} · ${c.driverName}`}
                    tabIndex={on ? 0 : -1}
                    onClick={() => select(c.slug)}
                    className={cn(
                      "group flex shrink-0 items-center gap-2.5 rounded-[6px] border px-3 font-mono text-[11px] transition-colors duration-150 focus-visible:outline-offset-[-2px] compact:h-11 roomy:h-9 roomy:rounded-none roomy:border-0 roomy:border-b roomy:border-white/[0.06] roomy:last:border-b-0",
                      on
                        ? "border-paper bg-paper text-ink"
                        : "border-white/12 text-paper hover:bg-white/[0.06]",
                    )}
                  >
                    <span className="w-3 font-bold tabular-nums">
                      {c.position}
                    </span>
                    <span
                      className="h-4 w-[3px] rounded-full"
                      style={{ background: c.livery.accent }}
                      aria-hidden="true"
                    />
                    <span className="font-bold tracking-[0.1em]">{c.code}</span>
                    <span
                      className={cn(
                        "truncate font-sans text-[13px] compact:hidden",
                        on ? "text-ink/75" : "text-paper/60",
                      )}
                    >
                      {c.name}
                    </span>
                    {on && (
                      <span className="ml-auto hidden font-mono text-[10px] tracking-[0.12em] uppercase roomy:inline">
                        Your car
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            <div className="mt-3 flex items-start justify-between gap-4 roomy:mt-4">
              <div className="min-w-0">
                <p className="truncate text-[15px] font-semibold text-paper roomy:hidden">
                  {study.name}
                  <span className="text-paper/70"> · {study.driverName}</span>
                </p>
                <p className="text-[13px] text-paper/70">
                  <span className="compact:hidden">
                    <span className="font-semibold">{study.driverName}</span>
                    {" · "}
                  </span>
                  <span className="font-semibold text-[var(--accent)]">
                    Starts P{study.position}
                  </span>{" "}
                  ·{" "}
                  {ahead === 0
                    ? "pole position"
                    : `${ahead} ${ahead === 1 ? "car" : "cars"} to pass`}
                </p>
                <p className="mt-1 font-mono text-[11px] tracking-[0.04em] text-dim tabular-nums">
                  {record.race !== null || record.lap !== null ? (
                    <>
                      Your best{" "}
                      <span className="text-paper/80">
                        {formatLap(record.race)}
                      </span>
                      {" · lap "}
                      <span className="text-paper/80">
                        {formatLap(record.lap)}
                      </span>
                    </>
                  ) : (
                    "No time set with this car yet"
                  )}
                </p>
              </div>
            </div>

            {/* settings and the start stay in view however short the panel gets,
                with a fade above for the list scrolling under them. The footer
                bleeds into the panel padding, so its sticky inset reaches past it too */}
            <div className="sticky -bottom-4 z-10 -mx-4 mt-4 -mb-4 bg-ink-2 px-4 pb-4 before:pointer-events-none before:absolute before:inset-x-0 before:bottom-full before:h-6 before:bg-gradient-to-t before:from-ink-2 before:to-transparent roomy:-bottom-6 roomy:-mx-6 roomy:mt-5 roomy:-mb-6 roomy:bg-[#0a0b0e] roomy:px-6 roomy:pb-6 roomy:before:from-[#0a0b0e]">
              {/* laps, rivals, assists, sound, camera and controls all live in Settings */}
              <button
                type="button"
                aria-haspopup="dialog"
                onClick={() => useRaceStore.getState().setSettingsOpen(true)}
                className="group mb-2.5 flex w-full items-center gap-3 rounded-[6px] border border-white/10 px-3 py-2.5 text-left transition-colors hover:border-white/25 hover:bg-white/[0.03]"
              >
                <Settings2
                  size={16}
                  aria-hidden="true"
                  className="shrink-0 text-mute transition-transform duration-300 group-hover:rotate-45"
                />
                <span className="min-w-0 flex-1">
                  <span className="eyebrow block text-[10px] text-paper/80">
                    Settings
                  </span>
                  <span className="mt-0.5 block truncate text-[12px] text-paper/60">
                    {summary}
                  </span>
                </span>
                <span className="eyebrow shrink-0 text-[10px] text-dim transition-colors group-hover:text-paper">
                  Edit
                </span>
              </button>
              <Button
                onClick={start}
                disabled={!sceneReady}
                aria-keyshortcuts="Enter"
                className="h-12 w-full justify-between disabled:cursor-wait disabled:opacity-60"
              >
                {sceneReady ? "Start race" : "Preparing the circuit…"}
                <Nudge>
                  <ArrowRight size={16} aria-hidden="true" />
                </Nudge>
              </Button>
              <Link
                to="/"
                className="eyebrow mt-4 inline-flex items-center gap-1.5 text-[10px] text-dim transition-colors hover:text-paper compact:hidden"
              >
                <ArrowLeft size={12} aria-hidden="true" /> Back to Motorsport
              </Link>
            </div>
          </div>
        </m.div>
      </div>
    </section>
  )
}
