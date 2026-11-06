import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
  type ReactNode,
} from "react"
import { AnimatePresence, m } from "motion/react"
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  RotateCcw,
  Video,
  Volume2,
  VolumeX,
} from "lucide-react"
import { caseStudies, getCaseStudy } from "@/data/caseStudies"
import { useStore } from "@/state/store"
import { useRaceStore, type MessageTone } from "@/race/raceStore"
import { raceCommands, telemetry } from "@/race/telemetry"
import { controls, type DriveKey } from "@/race/controls"
import { formatGap, formatLap, toKmh } from "@/race/format"
import type { SectorTone } from "@/race/types"
import { useAnimationFrame } from "@/hooks/useAnimationFrame"
import { useMediaQuery } from "@/hooks/useMediaQuery"
import { EASE_OUT } from "@/lib/motion"
import { cn } from "@/lib/cn"

export const SECTOR_COLOURS: Record<SectorTone, string> = {
  purple: "#b65cff",
  green: "#2fd673",
  yellow: "#ffd23f",
}

const TONE_CLASS: Record<MessageTone, string> = {
  neutral: "border-white/15 text-paper",
  go: "border-[#2fd673]/60 text-paper",
  purple: "border-[#b65cff]/70 text-paper",
  green: "border-[#2fd673]/60 text-paper",
  warning: "border-[#ffd23f]/60 text-paper",
  flag: "border-paper/70 text-paper",
}
const TONE_DOT: Record<MessageTone, string> = {
  neutral: "bg-paper",
  go: "bg-[#2fd673]",
  purple: "bg-[#b65cff]",
  green: "bg-[#2fd673]",
  warning: "bg-[#ffd23f]",
  flag: "bg-paper",
}

const panel =
  "rounded-[6px] border border-white/10 bg-ink/70 shadow-[0_18px_50px_rgba(0,0,0,0.45)] backdrop-blur-xl"

/** In-race heads-up display. */
export function RaceHud() {
  const phase = useRaceStore((s) => s.phase)
  const slug = useRaceStore((s) => s.slug)
  const touch = useMediaQuery("(pointer: coarse)")
  const study = getCaseStudy(slug) ?? caseStudies[0]
  const driving = phase === "grid" || phase === "lights" || phase === "racing"

  return (
    <div
      className="pointer-events-none fixed inset-0 z-30 select-none"
      style={{ "--accent": study.livery.accent } as CSSProperties}
    >
      <LiveRegion />
      {phase !== "results" && (
        <>
          <div className="absolute top-[max(0.75rem,env(safe-area-inset-top))] left-[max(0.75rem,env(safe-area-inset-left))] flex flex-col gap-3 md:top-6 md:left-6">
            <PositionBlock />
            <Tower />
          </div>
          {/* narrow screens: the timer drops below the position / buttons row */}
          <div className="absolute top-[calc(max(0.75rem,env(safe-area-inset-top))+62px)] left-1/2 -translate-x-1/2 sm:top-[max(0.75rem,env(safe-area-inset-top))] md:top-6">
            <TopCenter />
          </div>
          <div className="absolute top-[max(0.75rem,env(safe-area-inset-top))] right-[max(0.75rem,env(safe-area-inset-right))] md:top-6 md:right-6">
            <HudButtons />
          </div>
          <Messages />
          <Warnings touch={touch} />
          <div className="absolute bottom-6 left-6 hidden md:block short:hidden">
            <Minimap />
          </div>
          <div
            className={cn(
              "absolute",
              touch
                ? // phones in portrait: above the steering and pedals; wider screens: between them
                  "bottom-[calc(max(1rem,env(safe-area-inset-bottom))+116px)] left-1/2 -translate-x-1/2 sm:bottom-[calc(max(1rem,env(safe-area-inset-bottom))+0.25rem)]"
                : "right-6 bottom-6",
            )}
          >
            <Speedo compact={touch} />
          </div>
          {touch && driving && <TouchControls />}
        </>
      )}
    </div>
  )
}

function LiveRegion() {
  const message = useRaceStore((s) => s.message)
  return (
    <div aria-live="polite" className="sr-only">
      {message
        ? `${message.title}${message.detail ? `, ${message.detail}` : ""}`
        : ""}
    </div>
  )
}

function PositionBlock() {
  const standings = useRaceStore((s) => s.standings)
  // the race's own lap count, not a settings change waiting for the next start
  const laps = useRaceStore((s) => s.raceLaps)
  const slug = useRaceStore((s) => s.slug)
  const me = standings.find((s) => s.player)
  const start = useRaceStore(s => s.config ? s.config.grid.indexOf(slug) + 1 : 1)
  return (
    <div className={cn(panel, "flex items-stretch overflow-hidden")}>
      <div className="w-[3px] bg-[var(--accent)]" aria-hidden="true" />
      <div className="flex items-baseline px-3 py-1.5 md:px-4 md:py-2">
        <span className="font-wide text-[34px] leading-none font-extrabold tracking-[-0.04em] italic md:text-[48px]">
          P{me?.position ?? start}
        </span>
        <span className="ml-1 font-mono text-[12px] text-dim md:text-[13px]">
          /{caseStudies.length}
        </span>
      </div>
      <div className="flex flex-col justify-center border-l border-white/10 px-3 md:px-4">
        <span className="eyebrow text-[9px] text-dim md:text-[10px]">Lap</span>
        <span className="font-mono text-[15px] font-bold tabular-nums md:text-[18px]">
          {me?.lap ?? 1}
          <span className="text-dim">/{laps}</span>
        </span>
      </div>
    </div>
  )
}

function Tower() {
  const standings = useRaceStore((s) => s.standings)
  const phase = useRaceStore((s) => s.phase)
  const onGrid = phase === "grid" || phase === "lights"
  if (!standings.length) return null
  return (
    <ol
      aria-label="Race order"
      className={cn(
        panel,
        "hidden w-[208px] overflow-hidden py-1 md:block short:hidden [@media(max-height:700px)]:hidden",
      )}
    >
      {standings.map((row) => {
        const study = getCaseStudy(row.slug)
        if (!study) return null
        return (
          <li
            key={row.slug}
            title={`${study.driverName} · ${study.name}`}
            aria-label={`P${row.position}, ${study.driverName}, ${study.name}${row.player ? ", you" : ""}`}
            className={cn(
              "flex h-7 items-center gap-2 px-3 font-mono text-[11px] transition-colors duration-300",
              row.player ? "bg-paper text-ink" : "text-paper",
            )}
          >
            <span className="w-3.5 text-right font-bold tabular-nums">
              {row.position}
            </span>
            <span
              className="h-3.5 w-[3px] rounded-full"
              style={{ background: study.livery.accent }}
              aria-hidden="true"
            />
            <span className="font-bold tracking-[0.1em]">{study.code}</span>
            <span
              className={cn(
                "ml-auto tabular-nums",
                row.player ? "text-ink/70" : "text-paper/60",
              )}
            >
              {row.position === 1
                ? onGrid
                  ? "Pole"
                  : row.finished
                    ? "Winner"
                    : "Leader"
                : onGrid || row.interval === null
                  ? ""
                  : formatGap(row.interval)}
            </span>
          </li>
        )
      })}
    </ol>
  )
}

function TopCenter() {
  const phase = useRaceStore((s) => s.phase)
  const lights = useStore((s) => s.lights)
  const prestart = phase === "grid" || phase === "lights"
  if (prestart)
    return (
      <div className={cn(panel, "flex items-center gap-3 px-4 py-2.5")}>
        <div className="flex gap-1.5" aria-hidden="true">
          {[1, 2, 3, 4, 5].map((i) => (
            <span
              key={i}
              className={cn(
                "h-3 w-3 rounded-full transition-[background-color,box-shadow] duration-100",
                lights >= i
                  ? "bg-signal shadow-[0_0_14px_3px_rgba(255,59,48,0.75)]"
                  : "bg-white/12",
              )}
            />
          ))}
        </div>
        <span className="eyebrow text-[10px] text-paper">
          {phase === "grid" ? "Formation complete" : "Lights"}
        </span>
      </div>
    )
  return <LapTimer />
}

function LapTimer() {
  const time = useRef<HTMLSpanElement>(null)
  const last = useRef<HTMLSpanElement>(null)
  const best = useRef<HTMLSpanElement>(null)
  const sectors = useRef<(HTMLSpanElement | null)[]>([])
  useAnimationFrame(() => {
    const t = formatLap(telemetry.lapTime)
    if (time.current && time.current.textContent !== t)
      time.current.textContent = t
    const l = formatLap(telemetry.lastLap)
    if (last.current && last.current.textContent !== l)
      last.current.textContent = l
    const b = formatLap(telemetry.bestLap)
    if (best.current && best.current.textContent !== b)
      best.current.textContent = b
    telemetry.sectorTones.forEach((tone, i) => {
      const el = sectors.current[i]
      if (!el) return
      const colour = tone ? SECTOR_COLOURS[tone] : ""
      if (el.dataset.tone !== (tone ?? "")) {
        el.dataset.tone = tone ?? ""
        el.style.backgroundColor = colour
      }
    })
  })
  return (
    <div
      className={cn(
        panel,
        "min-w-[150px] px-4 pt-2 pb-2.5 text-center md:min-w-[210px]",
      )}
    >
      <span
        ref={time}
        className="block font-mono text-[20px] font-bold tracking-[-0.02em] tabular-nums md:text-[26px]"
      >
        0:00.000
      </span>
      <div className="mt-1.5 flex gap-1" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            ref={(el) => {
              sectors.current[i] = el
            }}
            className="h-[3px] flex-1 rounded-full bg-white/15 transition-colors duration-200"
          />
        ))}
      </div>
      <div className="mt-1.5 hidden justify-between gap-4 font-mono text-[10px] text-dim tabular-nums md:flex">
        <span>
          LAST <span ref={last} className="text-paper/80" />
        </span>
        <span>
          BEST <span ref={best} className="text-paper/80" />
        </span>
      </div>
    </div>
  )
}

function HudButtons() {
  const sound = useRaceStore((s) => s.sound)
  const camera = useRaceStore((s) => s.camera)
  const phase = useRaceStore((s) => s.phase)
  const live = phase !== "results"
  const button =
    "pointer-events-auto grid h-11 w-11 place-items-center rounded-[6px] border border-white/10 bg-ink/70 text-paper backdrop-blur-xl transition-colors hover:bg-white/10 md:h-10 md:w-10"
  return (
    <div className="flex gap-2">
      <button
        type="button"
        className={cn(button, "max-md:hidden")}
        onClick={() => useRaceStore.getState().toggleCamera()}
        aria-label={`Camera: ${camera === "chase" ? "chase" : "onboard"} (C)`}
        title="Switch camera (C)"
      >
        <Video size={17} aria-hidden="true" />
      </button>
      <button
        type="button"
        className={button}
        onClick={() => useRaceStore.getState().setSound(!sound)}
        aria-pressed={sound}
        aria-label="Engine sound (M)"
        title="Engine sound (M)"
      >
        {sound ? (
          <Volume2 size={17} aria-hidden="true" />
        ) : (
          <VolumeX size={17} aria-hidden="true" />
        )}
      </button>
      {live && (
        <button
          type="button"
          className={button}
          onClick={() => useRaceStore.getState().setPaused(true)}
          aria-label="Pause (Esc)"
          title="Pause (Esc)"
        >
          <Pause size={17} aria-hidden="true" />
        </button>
      )}
    </div>
  )
}

function Messages() {
  const message = useRaceStore((s) => s.message)
  const [visible, setVisible] = useState<typeof message>(null)
  useEffect(() => {
    if (!message) return
    setVisible(message)
    const t = window.setTimeout(
      () => setVisible(null),
      message.tone === "flag" ? 3200 : 2200,
    )
    return () => window.clearTimeout(t)
  }, [message])
  return (
    <div
      className="absolute inset-x-0 top-[22%] flex justify-center px-4"
      aria-hidden="true"
    >
      <AnimatePresence mode="wait">
        {visible && (
          <m.div
            key={visible.id}
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: EASE_OUT }}
            className={cn(
              panel,
              "flex items-center gap-3 border px-4 py-2.5",
              TONE_CLASS[visible.tone],
            )}
          >
            <span
              className={cn(
                "h-2 w-2 shrink-0 rounded-full",
                TONE_DOT[visible.tone],
              )}
            />
            <span className="font-wide text-[18px] leading-none font-extrabold tracking-[-0.02em] italic md:text-[24px]">
              {visible.title}
            </span>
            {visible.detail && (
              <span className="font-mono text-[11px] text-paper/70 tabular-nums md:text-[12px]">
                {visible.detail}
              </span>
            )}
          </m.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Warnings({ touch }: { touch: boolean }) {
  const [state, setState] = useState({ wrongWay: false, stuck: false })
  useAnimationFrame(() => {
    if (
      telemetry.wrongWay !== state.wrongWay ||
      telemetry.stuck !== state.stuck
    )
      setState({ wrongWay: telemetry.wrongWay, stuck: telemetry.stuck })
  })
  return (
    <div className="absolute inset-x-0 top-[38%] flex flex-col items-center gap-3 px-4">
      {state.wrongWay && (
        <div className="rounded-[6px] bg-signal px-5 py-2.5 font-wide text-[22px] font-extrabold tracking-[-0.02em] text-white italic shadow-[0_0_40px_rgba(255,59,48,0.45)] md:text-[30px]">
          Wrong way
        </div>
      )}
      {(state.stuck || state.wrongWay) &&
        (touch ? (
          <button
            type="button"
            onClick={() => (raceCommands.reset = true)}
            className="pointer-events-auto flex h-11 items-center gap-2 rounded-[6px] border border-white/20 bg-ink/80 px-4 font-mono text-[11px] tracking-[0.14em] text-paper uppercase backdrop-blur-xl"
          >
            <RotateCcw size={15} aria-hidden="true" /> Reset car
          </button>
        ) : (
          <p
            className={cn(panel, "px-4 py-2 font-mono text-[12px] text-paper")}
          >
            Press{" "}
            <kbd className="rounded-[3px] border border-white/25 px-1.5 py-0.5 font-bold">
              R
            </kbd>{" "}
            to put the car back on track
          </p>
        ))}
    </div>
  )
}

const REV_LEDS = 15
const LED_COLOURS = Array.from({ length: REV_LEDS }, (_, i) =>
  i < 5 ? "#2fd673" : i < 10 ? "#ff3b30" : "#5b8cff",
)

function Speedo({ compact }: { compact: boolean }) {
  const speed = useRef<HTMLSpanElement>(null)
  const gear = useRef<HTMLSpanElement>(null)
  const leds = useRef<(HTMLSpanElement | null)[]>([])
  const throttle = useRef<HTMLSpanElement>(null)
  const brake = useRef<HTMLSpanElement>(null)
  useAnimationFrame(() => {
    const kmh = String(toKmh(telemetry.speed))
    if (speed.current && speed.current.textContent !== kmh)
      speed.current.textContent = kmh
    const g =
      telemetry.gear === 0
        ? "N"
        : telemetry.gear < 0
          ? "R"
          : String(telemetry.gear)
    if (gear.current && gear.current.textContent !== g)
      gear.current.textContent = g
    const lit = Math.round(
      Math.min(1, Math.max(0, (telemetry.rpm - 0.42) / 0.56)) * REV_LEDS,
    )
    leds.current.forEach((el, i) => {
      if (!el) return
      const on = i < lit
      if (el.dataset.on !== String(on)) {
        el.dataset.on = String(on)
        el.style.backgroundColor = on ? LED_COLOURS[i] : ""
        el.style.boxShadow = on ? `0 0 8px ${LED_COLOURS[i]}` : ""
      }
    })
    if (throttle.current)
      throttle.current.style.transform = `scaleY(${telemetry.throttle})`
    if (brake.current)
      brake.current.style.transform = `scaleY(${telemetry.brake})`
  })
  return (
    <div
      className={cn(panel, "px-4 pt-2.5 pb-3", compact && "px-3 pt-2 pb-2")}
      aria-hidden="true"
    >
      <div className="flex gap-[3px]">
        {LED_COLOURS.map((_, i) => (
          <span
            key={i}
            ref={(el) => {
              leds.current[i] = el
            }}
            className={cn(
              "rounded-full bg-white/10",
              compact ? "h-1.5 w-1.5" : "h-2 w-2",
            )}
          />
        ))}
      </div>
      <div className="mt-2 flex items-end gap-3">
        <div className="flex items-end gap-1.5">
          <span className="relative h-9 w-[5px] overflow-hidden rounded-full bg-white/10">
            <span
              ref={brake}
              className="absolute inset-0 origin-bottom scale-y-0 rounded-full bg-signal"
            />
          </span>
          <span className="relative h-9 w-[5px] overflow-hidden rounded-full bg-white/10">
            <span
              ref={throttle}
              className="absolute inset-0 origin-bottom scale-y-0 rounded-full bg-[#2fd673]"
            />
          </span>
        </div>
        <div className="flex items-baseline gap-1">
          <span
            ref={speed}
            className={cn(
              "min-w-[3ch] text-right font-wide leading-none font-extrabold tracking-[-0.04em] tabular-nums italic",
              compact ? "text-[30px]" : "text-[44px]",
            )}
          >
            0
          </span>
          <span className="font-mono text-[10px] text-dim">KM/H</span>
        </div>
        <div className="ml-1 flex flex-col items-center border-l border-white/10 pl-3">
          <span className="eyebrow text-[9px] text-dim">Gear</span>
          <span
            ref={gear}
            className={cn(
              "font-mono leading-none font-bold text-[var(--accent)]",
              compact ? "text-[22px]" : "text-[28px]",
            )}
          >
            N
          </span>
        </div>
      </div>
    </div>
  )
}

function Minimap() {
  const map = useRaceStore((s) => s.trackMap)
  const slug = useRaceStore((s) => s.slug)
  const dots = useRef(new Map<string, SVGCircleElement>())
  useAnimationFrame(() => {
    if (!map) return
    for (const dot of telemetry.dots) {
      const el = dots.current.get(dot.slug)
      if (!el) continue
      el.setAttribute("cx", (map.originX - dot.x).toFixed(1))
      el.setAttribute("cy", (map.originY - dot.z).toFixed(1))
    }
  })
  if (!map) return null
  const others = caseStudies.filter((c) => c.slug !== slug)
  const me = getCaseStudy(slug)
  return (
    <div className={cn(panel, "p-3")} aria-hidden="true">
      <svg
        viewBox={`0 0 ${map.width} ${map.height}`}
        className="h-[150px] w-auto [@media(max-height:760px)]:h-[118px]"
      >
        <path
          d={map.path}
          fill="none"
          stroke="rgba(243,241,236,0.16)"
          strokeWidth={14}
          strokeLinejoin="round"
        />
        <path
          d={map.path}
          fill="none"
          stroke="rgba(243,241,236,0.55)"
          strokeWidth={3}
          strokeLinejoin="round"
        />
        <rect
          x={map.start.x - 9}
          y={map.start.y - 2}
          width={18}
          height={4}
          fill="#f3f1ec"
        />
        {others.map((c) => (
          <circle
            key={c.slug}
            ref={(el) => {
              if (el) dots.current.set(c.slug, el)
              else dots.current.delete(c.slug)
            }}
            r={6}
            fill={c.livery.accent}
            stroke="#07080a"
            strokeWidth={2}
          />
        ))}
        {me && (
          <circle
            ref={(el) => {
              if (el) dots.current.set(me.slug, el)
              else dots.current.delete(me.slug)
            }}
            r={9}
            fill={me.livery.accent}
            stroke="#f3f1ec"
            strokeWidth={3}
          />
        )}
      </svg>
    </div>
  )
}

function TouchControls() {
  const autoThrottle = useRaceStore((s) => s.autoThrottle)
  useEffect(
    () => () => {
      controls.touch = {
        throttle: false,
        brake: false,
        left: false,
        right: false,
      }
    },
    [],
  )
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between px-[max(1rem,env(safe-area-inset-left))] pb-[max(1rem,env(safe-area-inset-bottom))] [touch-action:none]">
      <div className="flex gap-3">
        <PadButton drive="left" label="Steer left">
          <ChevronLeft size={30} aria-hidden="true" />
        </PadButton>
        <PadButton drive="right" label="Steer right">
          <ChevronRight size={30} aria-hidden="true" />
        </PadButton>
      </div>
      <div className="flex items-end gap-3">
        <PadButton drive="brake" label="Brake" tone="brake">
          <span className="font-mono text-[11px] font-bold tracking-[0.14em]">
            BRAKE
          </span>
        </PadButton>
        {!autoThrottle && (
          <PadButton drive="throttle" label="Accelerate" tone="throttle" tall>
            <span className="font-mono text-[11px] font-bold tracking-[0.14em]">
              GAS
            </span>
          </PadButton>
        )}
      </div>
    </div>
  )
}

function PadButton({
  drive,
  label,
  tone,
  tall,
  children,
}: {
  drive: DriveKey
  label: string
  tone?: "brake" | "throttle"
  tall?: boolean
  children: ReactNode
}) {
  const [down, setDown] = useState(false)
  const set = (on: boolean) => {
    controls.touch[drive] = on
    setDown(on)
  }
  const onDown = (e: PointerEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.currentTarget.setPointerCapture(e.pointerId)
    set(true)
  }
  const onUp = () => set(false)
  return (
    <button
      type="button"
      aria-label={label}
      onPointerDown={onDown}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      onLostPointerCapture={onUp}
      onContextMenu={(e) => e.preventDefault()}
      className={cn(
        "pointer-events-auto grid w-[76px] place-items-center rounded-[14px] border text-paper backdrop-blur-md transition-[background-color,transform] duration-75 [touch-action:none] [-webkit-touch-callout:none] short:w-[68px]",
        tall ? "h-[104px] short:h-[88px]" : "h-[76px] short:h-[68px]",
        tone === "brake"
          ? "border-signal/50 bg-signal/15"
          : tone === "throttle"
            ? "border-[#2fd673]/50 bg-[#2fd673]/15"
            : "border-white/20 bg-ink/45",
        down && "scale-95 bg-white/25",
      )}
    >
      {children}
    </button>
  )
}
