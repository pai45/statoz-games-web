import { useRef } from 'react'
import { Flame } from 'lucide-react'
import { METER_IDEAL, METER_MAX, type Grade } from '../../game/sim/shooting'
import type { TeamInfo } from '../../game/types'
import { cx, Emblem } from '../kit'
import { useEngineFrame, type FeedbackItem } from './hooks'

const GRADE_COLOR: Record<Grade, string> = {
  perfect: '#38e07b',
  good: '#e9eef7',
  early: '#ffb03b',
  late: '#ffb03b',
  veryEarly: '#ff4057',
  veryLate: '#ff4057',
}

interface MeterSource {
  meter: { active: boolean; fill: number; gw: number; x: number; y: number; grade: Grade | null; flash: number }
}

/** 2K-style vertical shot meter that tracks the shooter. Updated imperatively each frame. */
export function ShotMeter({ hud }: { hud: MeterSource | null }) {
  const root = useRef<HTMLDivElement>(null)
  const fill = useRef<HTMLDivElement>(null)
  const band = useRef<HTMLDivElement>(null)
  const label = useRef<HTMLDivElement>(null)
  useEngineFrame(() => {
    const m = hud?.meter
    const el = root.current
    if (!el || !fill.current || !band.current || !label.current) return
    if (!m || (!m.active && m.flash <= 0)) {
      el.style.opacity = '0'
      return
    }
    el.style.opacity = m.flash > 0 ? String(Math.min(1, m.flash * 2)) : '1'
    el.style.transform = `translate(${Math.round(m.x)}px, ${Math.round(m.y)}px) translate(0, -50%)`
    const f = Math.min(1, m.fill / 1)
    fill.current.style.height = `${f * 100}%`
    const lo = Math.max(0, METER_IDEAL - m.gw)
    const hi = Math.min(1, METER_IDEAL + m.gw)
    band.current.style.bottom = `${lo * 100}%`
    band.current.style.height = `${(hi - lo) * 100}%`
    const g = m.grade
    fill.current.style.background = g ? GRADE_COLOR[g] : m.fill > METER_IDEAL + m.gw ? '#ffb03b' : 'linear-gradient(180deg,#ffffff,#cfd6e4)'
    fill.current.style.boxShadow = g === 'perfect' ? '0 0 18px #38e07b' : 'none'
    label.current.textContent = g === 'perfect' ? 'GREEN' : ''
    void METER_MAX
  })
  return (
    <div ref={root} className="pointer-events-none absolute left-0 top-0 z-20 opacity-0 transition-opacity duration-100">
      <div className="relative h-[104px] w-[14px] overflow-hidden rounded-full border-2 border-white/80 bg-black/55 shadow-[0_0_14px_rgba(0,0,0,0.6)]">
        <div ref={band} className="absolute inset-x-0 bg-good/55" />
        <div ref={fill} className="absolute inset-x-0 bottom-0 rounded-full" />
      </div>
      <div ref={label} className="absolute left-5 top-1/2 -translate-y-1/2 font-display text-lg font-black italic text-good drop-shadow" />
    </div>
  )
}

export function Marker({ src }: { src: { marker: { x: number; y: number; visible: boolean }; controlledFire?: number } | null }) {
  const el = useRef<HTMLDivElement>(null)
  const fire = useRef<HTMLDivElement>(null)
  useEngineFrame(() => {
    const m = src?.marker
    if (!el.current) return
    if (!m || !m.visible) {
      el.current.style.opacity = '0'
      return
    }
    el.current.style.opacity = '1'
    el.current.style.transform = `translate(${Math.round(m.x)}px, ${Math.round(m.y)}px) translate(-50%, -100%)`
    if (fire.current) fire.current.style.display = src?.controlledFire === 2 ? 'block' : 'none'
  })
  return (
    <div ref={el} className="pointer-events-none absolute left-0 top-0 z-10 flex flex-col items-center opacity-0">
      <div ref={fire} className="mb-0.5 hidden animate-flicker text-[#ff9a3c]">
        <Flame className="size-4" fill="#ff7a1a" />
      </div>
      <svg width="22" height="16" viewBox="0 0 22 16" className="drop-shadow-[0_0_6px_rgba(255,91,20,0.9)]">
        <path d="M1 1 H21 L11 15 Z" fill="#ff5b14" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

export function PassMarker({ src }: { src: { passTarget: { x: number; y: number; visible: boolean; lob?: boolean } } | null }) {
  const el = useRef<HTMLDivElement>(null)
  const tag = useRef<HTMLDivElement>(null)
  useEngineFrame(() => {
    const m = src?.passTarget
    if (!el.current) return
    if (!m || !m.visible) {
      el.current.style.opacity = '0'
      return
    }
    el.current.style.opacity = '1'
    el.current.style.transform = `translate(${Math.round(m.x)}px, ${Math.round(m.y)}px) translate(-50%, -100%)`
    const t = tag.current
    if (t) {
      const lob = !!m.lob
      const text = lob ? 'Alley-oop' : 'Pass'
      if (t.textContent !== text) {
        t.textContent = text
        t.classList.toggle('bg-sky/80', !lob)
        t.classList.toggle('bg-blaze', lob)
      }
    }
  })
  return (
    <div ref={el} className="pointer-events-none absolute left-0 top-0 z-10 opacity-0">
      <div ref={tag} className="rounded-full border border-white/70 bg-sky/80 px-1.5 py-0.5 font-display text-[10px] font-black uppercase italic tracking-wider text-white shadow">
        Pass
      </div>
    </div>
  )
}

export function FeedbackLayer({ items }: { items: FeedbackItem[] }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-[17%] z-20 flex flex-col items-center gap-1">
      {items.map((f) => (
        <div key={f.id} className="animate-feedback text-center">
          <div
            className={cx(
              'font-display font-black uppercase italic leading-none tracking-tight drop-shadow-[0_4px_14px_rgba(0,0,0,0.85)]',
              f.kind === 'big' ? 'text-[clamp(34px,7vw,64px)] text-white' : f.kind === 'score' ? 'text-[clamp(30px,6vw,54px)] text-gold' : 'text-[clamp(20px,4vw,34px)]',
              f.kind === 'green' && 'text-good',
              f.kind === 'good' && 'text-white',
              f.kind === 'bad' && 'text-[#ffb03b]',
              f.kind === 'info' && 'text-sky',
            )}
          >
            {f.text}
          </div>
          {f.sub && <div className="mt-0.5 font-display text-sm font-bold uppercase tracking-[0.2em] text-white/80 drop-shadow">{f.sub}</div>}
        </div>
      ))}
    </div>
  )
}

export function ScoreBug({
  home,
  away,
  score,
  clock,
  shotClock,
  possession,
  label,
  fire,
}: {
  home: TeamInfo
  away: TeamInfo
  score: [number, number]
  clock: string
  shotClock: string
  possession: 0 | 1 | null
  label: string
  /** a player on that side is on fire */
  fire?: [boolean, boolean]
}) {
  const side = (t: TeamInfo, s: number, i: 0 | 1) => (
    <div className={cx('flex items-center gap-2 px-2.5', i === 1 && 'flex-row-reverse')}>
      <Emblem team={t} size={26} />
      <span className="font-display text-[15px] font-black italic tracking-wide">{t.abbr}</span>
      {fire?.[i] && <Flame aria-label="On fire" className="size-4 animate-flicker text-[#ff9a3c]" fill="#ff7a1a" />}
      <span className="min-w-[2ch] text-center font-display text-[26px] font-black italic tabular-nums leading-none">{s}</span>
      <span className={cx('size-0 border-y-[5px] border-y-transparent transition-opacity', i === 0 ? 'border-l-[7px] border-l-gold' : 'border-r-[7px] border-r-gold', possession === i ? 'opacity-100' : 'opacity-0')} />
    </div>
  )
  return (
    <div className="pointer-events-none absolute left-1/2 top-[max(env(safe-area-inset-top),8px)] z-20 -translate-x-1/2">
      <div className="flex items-stretch overflow-hidden rounded-xl border border-white/10 bg-ink-950/80 shadow-2xl backdrop-blur-md">
        <div className="flex items-center" style={{ boxShadow: `inset 0 -3px 0 ${home.primary}` }}>
          {side(home, score[0], 0)}
        </div>
        <div className="flex flex-col items-center justify-center bg-white/6 px-3 py-1">
          <span className="font-display text-[15px] font-bold tabular-nums leading-none">{clock}</span>
          {shotClock && <span className="mt-0.5 rounded bg-bad/90 px-1.5 font-display text-[11px] font-black tabular-nums leading-tight">{shotClock}</span>}
        </div>
        <div className="flex items-center" style={{ boxShadow: `inset 0 -3px 0 ${away.primary}` }}>
          {side(away, score[1], 1)}
        </div>
      </div>
      <div className="mt-1 text-center font-display text-[10px] font-bold uppercase tracking-[0.25em] text-white/55">{label}</div>
    </div>
  )
}
