import { useEffect, useRef, type CSSProperties } from "react"
import { useNavigate } from "react-router"
import { m } from "motion/react"
import { ArrowRight, RotateCcw, Settings2 } from "lucide-react"
import { getCaseStudy } from "@/data/caseStudies"
import { DIFFICULTIES, useRaceStore } from "@/race/raceStore"
import { formatGap, formatLap, ordinal, toKmh } from "@/race/format"
import { reveal, stagger } from "@/lib/motion"
import { cn } from "@/lib/cn"
import { Button, Nudge } from "@/components/ui/Button"
import { SECTOR_COLOURS } from "./RaceHud"

const VERDICT = (position: number) =>
  position === 1 ? "Winner" : position <= 3 ? "Podium" : "Finished"

/** Classification after the chequered flag, with a way back into the portfolio. */
export function RaceResults() {
  const result = useRaceStore((s) => s.result)
  const settingsOpen = useRaceStore((s) => s.settingsOpen)
  const navigate = useNavigate()
  const again = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    again.current?.focus({ preventScroll: true })
  }, [result])
  if (!result) return null
  const study = getCaseStudy(result.slug)
  if (!study) return null
  const gained = study.position - result.position
  const rivals = DIFFICULTIES.find((d) => d.value === result.difficulty)?.label
  const raceAgain = () => useRaceStore.getState().start()

  const stats = [
    {
      label: "Race time",
      value: formatLap(result.time),
      pb: result.record.race,
    },
    {
      label: "Best lap",
      value: formatLap(result.bestLap),
      pb: result.record.lap,
      purple: result.fastestLap,
    },
    {
      label: "Reaction",
      value: result.reaction === null ? "—" : `${result.reaction.toFixed(3)}s`,
    },
    { label: "Top speed", value: `${toKmh(result.topSpeed)} km/h` },
  ]

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="results-title"
      // the settings dialog can open on top before racing again
      inert={settingsOpen}
      className="pointer-events-auto fixed inset-0 z-40 overflow-y-auto overscroll-contain bg-[linear-gradient(90deg,rgba(7,8,10,0.92),rgba(7,8,10,0.7)_55%,rgba(7,8,10,0.25))] max-md:bg-ink/80"
      style={{ "--accent": study.livery.accent } as CSSProperties}
    >
      <div className="container-page flex min-h-full items-center py-6 md:py-16">
        <m.div
          variants={stagger(0.06, 0.05)}
          initial="hidden"
          animate="show"
          className="w-full max-w-[600px] overflow-hidden rounded-[10px] border border-white/10 bg-ink-2/95 shadow-[0_30px_80px_rgba(0,0,0,0.6)] md:rounded-[6px] md:bg-ink/80 md:backdrop-blur-xl"
        >
          <div className="h-[3px] bg-[var(--accent)]" aria-hidden="true" />
          <div className="p-5 md:p-8">
            <m.p
              variants={reveal}
              className="eyebrow flex items-center gap-2 text-dim"
            >
              <span className="grid grid-cols-2 gap-px" aria-hidden="true">
                {[0, 1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className={cn(
                      "h-1.5 w-1.5",
                      i === 0 || i === 3 ? "bg-paper" : "bg-paper/25",
                    )}
                  />
                ))}
              </span>
              Chequered flag · {result.laps}{" "}
              {result.laps === 1 ? "lap" : "laps"} · {rivals} rivals
            </m.p>
            <m.div
              variants={reveal}
              className="mt-3 flex flex-wrap items-end gap-x-4 gap-y-2"
            >
              <h2
                id="results-title"
                className="font-wide text-[64px] leading-[0.82] font-extrabold tracking-[-0.05em] italic md:text-[88px]"
              >
                <span className="sr-only">You finished </span>P{result.position}
              </h2>
              <div className="pb-1.5">
                <p className="font-wide text-[22px] leading-none font-extrabold tracking-[-0.02em] text-[var(--accent)] italic md:text-[26px]">
                  {VERDICT(result.position)}
                </p>
                <p className="mt-1.5 text-[14px] text-paper/70">
                  {study.name} · from P{study.position}{" "}
                  <span
                    className={cn(
                      "font-mono text-[12px]",
                      gained > 0
                        ? "text-[#2fd673]"
                        : gained < 0
                          ? "text-signal"
                          : "text-dim",
                    )}
                  >
                    {gained > 0
                      ? `+${gained} ${gained === 1 ? "place" : "places"}`
                      : gained < 0
                        ? `${gained} ${gained === -1 ? "place" : "places"}`
                        : "held position"}
                  </span>
                </p>
              </div>
            </m.div>

            {(result.record.race || result.record.lap || result.fastestLap) && (
              <m.ul
                variants={reveal}
                className="mt-4 flex flex-wrap gap-1.5"
                aria-label="Highlights"
              >
                {result.record.race && <Badge>New personal best</Badge>}
                {result.record.lap && !result.record.race && (
                  <Badge>Personal best lap</Badge>
                )}
                {result.fastestLap && (
                  <Badge purple>Fastest lap of the race</Badge>
                )}
              </m.ul>
            )}

            <m.dl
              variants={reveal}
              className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-[6px] border border-white/10 bg-white/10 md:grid-cols-4"
            >
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="bg-ink-2 px-3.5 py-3 md:bg-ink/90"
                >
                  <dt className="eyebrow text-[9px] text-dim">{s.label}</dt>
                  <dd
                    className="mt-1 font-mono text-[15px] font-bold tabular-nums"
                    style={
                      s.purple ? { color: SECTOR_COLOURS.purple } : undefined
                    }
                  >
                    {s.value}
                    {s.pb && (
                      <span className="ml-1.5 align-middle text-[9px] text-[#2fd673]">
                        PB
                      </span>
                    )}
                  </dd>
                </div>
              ))}
            </m.dl>

            <m.div variants={reveal} className="mt-6">
              <p className="eyebrow text-[10px] text-dim">Classification</p>
              <table className="mt-2 w-full border-collapse font-mono text-[12px]">
                <thead className="sr-only">
                  <tr>
                    <th>Position</th>
                    <th>Driver and car</th>
                    <th>Time</th>
                    <th>Best lap</th>
                  </tr>
                </thead>
                <tbody>
                  {result.rows.map((row) => {
                    const car = getCaseStudy(row.slug)
                    if (!car) return null
                    return (
                      <tr
                        key={row.slug}
                        title={`${car.driverName} · ${car.name}`}
                        aria-label={`P${row.position}, ${car.driverName}, ${car.name}${row.player ? ", you" : ""}`}
                        className={cn(
                          "h-9 border-b border-white/[0.06]",
                          row.player && "bg-paper text-ink",
                        )}
                      >
                        <td className="w-8 pl-2.5 font-bold tabular-nums">
                          {row.position}
                        </td>
                        <td>
                          <span className="flex items-center gap-2">
                            <span
                              className="h-3.5 w-[3px] rounded-full"
                              style={{ background: car.livery.accent }}
                              aria-hidden="true"
                            />
                            <span className="font-bold tracking-[0.1em]">
                              {car.code}
                            </span>
                            <span
                              className={cn(
                                "truncate font-sans text-[12px] max-sm:hidden",
                                row.player ? "text-ink/70" : "text-paper/55",
                              )}
                            >
                              {car.driverName}
                              {row.player && " · you"}
                              <span className="block text-[10px]">{car.name}</span>
                            </span>
                          </span>
                        </td>
                        <td className="text-right tabular-nums">
                          {row.gap === null
                            ? formatLap(row.time)
                            : formatGap(row.gap)}
                        </td>
                        <td
                          className={cn(
                            "pr-2.5 text-right tabular-nums max-sm:hidden",
                            row.player ? "text-ink/70" : "text-paper/55",
                          )}
                        >
                          {formatLap(row.bestLap)}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </m.div>

            <m.div variants={reveal} className="mt-7 flex flex-wrap gap-2.5">
              <Button
                ref={again}
                onClick={raceAgain}
                className="h-12 grow justify-between sm:grow-0"
              >
                Race again
                <RotateCcw size={15} aria-hidden="true" />
              </Button>
              <Button
                variant="secondary"
                onClick={() => useRaceStore.getState().backToSelect()}
                className="h-12 grow sm:grow-0"
              >
                Change car
              </Button>
              <Button
                variant="secondary"
                aria-haspopup="dialog"
                onClick={() => useRaceStore.getState().setSettingsOpen(true)}
                className="h-12 grow sm:grow-0"
              >
                <Settings2 size={15} aria-hidden="true" />
                Settings
              </Button>
            </m.div>
            <m.div
              variants={reveal}
              className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5"
            >
              <button
                type="button"
                onClick={() => navigate("/")}
                className="eyebrow text-[10px] text-dim transition-colors hover:text-paper"
              >
                Back to Motorsport
              </button>
            </m.div>
            <p className="sr-only">
              {`You finished ${ordinal(result.position)} in ${formatLap(result.time)}.`}
            </p>
          </div>
        </m.div>
      </div>
    </div>
  )
}

type BadgeProps = {
  children: string
  purple?: boolean
}

function Badge({ children, purple }: BadgeProps) {
  return (
    <li
      className="eyebrow rounded-[3px] border px-2 py-1 text-[10px]"
      style={
        purple
          ? {
              borderColor: `${SECTOR_COLOURS.purple}99`,
              color: SECTOR_COLOURS.purple,
            }
          : { borderColor: "rgba(47,214,115,0.6)", color: "#2fd673" }
      }
    >
      {children}
    </li>
  )
}
