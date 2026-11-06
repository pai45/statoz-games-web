import { useLayoutEffect, useRef, useState } from 'react'
import { ArrowUpRight, Hand, Shuffle, Target, Zap, type LucideIcon } from 'lucide-react'
import { getEngine } from '../../game/engine/runtime'
import type { ActionName } from '../../game/engine/input'
import { cx, haptic } from '../kit'
import { useEngineFrame } from './hooks'

export interface ButtonSpec {
  action: ActionName
  label: string
  icon: LucideIcon
  size: 'xl' | 'md'
  hidden?: boolean
  tone?: 'blaze' | 'white' | 'sky'
  /** label that follows the game state every frame (the move button names the move the stick will do) */
  live?: () => string
}

/** knob travel (px) */
const R = 58
/** below this deflection the stick reads as centred */
const DEAD = 0.12
/** sprint engages near full tilt and releases a little lower, so it doesn't flicker at the rim */
const SPRINT_ON = 0.94
const SPRINT_OFF = 0.84
const RING = ['border-white/30', 'bg-black/25']

/** Pointer capture throws if the pointer is already gone (a very quick tap); losing it is harmless. */
function capture(el: Element, id: number) {
  try {
    el.setPointerCapture?.(id)
  } catch {
    /* pointer already released */
  }
}
const RING_SPRINT = ['border-blaze', 'bg-blaze/12', 'shadow-[0_0_28px_rgba(255,91,20,0.55)]']

/**
 * Floating thumbstick: it appears under the thumb, follows the thumb if it slides far past the rim, and maps
 * deflection through a dead zone and a gentle response curve (fine control for walking, full tilt to run).
 * Pushing to the rim sprints, with a haptic tick. Updates the DOM directly so a moving thumb never
 * re-renders React.
 */
export function Joystick({ left = true }: { left?: boolean }) {
  const zone = useRef<HTMLDivElement>(null)
  const base = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const knob = useRef<HTMLDivElement>(null)
  const label = useRef<HTMLDivElement>(null)
  const st = useRef({ pid: -1, ox: 0, oy: 0, left: 0, top: 0, sprint: false })

  const placeBase = (x: number, y: number) => {
    if (base.current) base.current.style.transform = `translate(${x}px, ${y}px)`
  }
  const placeKnob = (x: number, y: number) => {
    if (knob.current) knob.current.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`
  }
  const setSprint = (on: boolean) => {
    const s = st.current
    if (s.sprint === on) return
    s.sprint = on
    const r = ring.current?.classList
    if (r) {
      for (const c of RING) r.toggle(c, !on)
      for (const c of RING_SPRINT) r.toggle(c, on)
    }
    knob.current?.classList.toggle('bg-blaze', on)
    knob.current?.classList.toggle('bg-white/80', !on)
    if (label.current) label.current.style.opacity = on ? '1' : '0'
    if (on) haptic(8)
  }
  const rest = () => {
    const z = zone.current
    if (!z || st.current.pid !== -1) return
    const r = z.getBoundingClientRect()
    placeBase(left ? 118 : r.width - 118, r.height - 112)
    placeKnob(0, 0)
    if (base.current) base.current.style.opacity = '0.45'
  }
  useLayoutEffect(() => {
    rest()
    const ro = new ResizeObserver(rest)
    if (zone.current) ro.observe(zone.current)
    return () => ro.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [left])

  const drive = (cx_: number, cy: number) => {
    const s = st.current
    let dx = cx_ - s.ox
    let dy = cy - s.oy
    let d = Math.hypot(dx, dy)
    // dragged well past the rim: pull the stick along under the thumb
    const leash = R * 1.45
    if (d > leash) {
      const k = (d - leash) / d
      s.ox += dx * k
      s.oy += dy * k
      dx = cx_ - s.ox
      dy = cy - s.oy
      d = leash
      placeBase(s.ox - s.left, s.oy - s.top)
    }
    const m = Math.min(1, d / R)
    const kx = d > R ? (dx / d) * R : dx
    const ky = d > R ? (dy / d) * R : dy
    placeKnob(kx, ky)
    const t = m <= DEAD ? 0 : Math.pow((m - DEAD) / (1 - DEAD), 1.2)
    const sprint = s.sprint ? m > SPRINT_OFF : m > SPRINT_ON
    getEngine()?.input.touchMove(d > 0 ? (dx / d) * t : 0, d > 0 ? (-dy / d) * t : 0, true, sprint)
    setSprint(sprint)
  }
  const end = () => {
    st.current.pid = -1
    getEngine()?.input.touchMove(0, 0, false)
    setSprint(false)
    rest()
  }

  return (
    <div
      ref={zone}
      className={cx('absolute bottom-0 top-[18%] z-20 touch-none', left ? 'left-0 w-[46%]' : 'right-0 w-[46%]')}
      onPointerDown={(e) => {
        const s = st.current
        if (s.pid !== -1) return
        s.pid = e.pointerId
        capture(e.target as Element, e.pointerId)
        const rect = zone.current!.getBoundingClientRect()
        s.left = rect.left
        s.top = rect.top
        s.ox = Math.max(rect.left + 80, Math.min(rect.right - 80, e.clientX))
        s.oy = Math.max(rect.top + 80, Math.min(rect.bottom - 70, e.clientY))
        placeBase(s.ox - rect.left, s.oy - rect.top)
        if (base.current) base.current.style.opacity = '1'
        drive(e.clientX, e.clientY)
      }}
      onPointerMove={(e) => {
        if (st.current.pid === e.pointerId) drive(e.clientX, e.clientY)
      }}
      onPointerUp={(e) => {
        if (st.current.pid === e.pointerId) end()
      }}
      onPointerCancel={(e) => {
        if (st.current.pid === e.pointerId) end()
      }}
    >
      <div ref={base} className="pointer-events-none absolute left-0 top-0 opacity-45 transition-opacity duration-150">
        <div
          ref={ring}
          className={cx('absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 transition-[border-color,background-color,box-shadow] duration-150', ...RING)}
          style={{ width: R * 2 + 20, height: R * 2 + 20 }}
        />
        <div ref={knob} className="absolute size-[58px] rounded-full border border-white/40 bg-white/80 shadow-lg" style={{ transform: 'translate(-50%, -50%)' }} />
        <div ref={label} className="absolute -translate-x-1/2 translate-y-[78px] font-display text-[11px] font-black uppercase italic tracking-widest text-blaze opacity-0 transition-opacity duration-100">
          Sprint
        </div>
      </div>
    </div>
  )
}

export function ActionButton({ spec, style }: { spec: ButtonSpec; style: React.CSSProperties }) {
  const [down, setDown] = useState(false)
  const pid = useRef<number | null>(null)
  const label = useRef<HTMLSpanElement>(null)
  useEngineFrame(() => {
    if (!spec.live || !label.current) return
    const t = spec.live()
    if (label.current.textContent !== t) label.current.textContent = t
  })
  if (spec.hidden) return null
  const Icon = spec.icon
  const big = spec.size === 'xl'
  const release = () => {
    if (pid.current === null) return
    pid.current = null
    setDown(false)
    getEngine()?.input.touchRelease(spec.action)
  }
  return (
    <button
      aria-label={spec.label}
      className={cx(
        // the ::before ring widens the touch target beyond the visible button
        "absolute z-30 grid touch-none select-none place-items-center rounded-full border-2 font-display font-black uppercase italic shadow-[0_10px_30px_-8px_rgba(0,0,0,0.8)] transition-transform duration-75 before:absolute before:-inset-2.5 before:rounded-full before:content-['']",
        big ? 'size-[94px] text-[15px]' : 'size-[66px] text-[11px]',
        spec.tone === 'blaze' ? 'border-blaze-soft/80 bg-gradient-to-b from-blaze to-[#d9420a] text-white' : spec.tone === 'sky' ? 'border-sky/60 bg-sky/25 text-white' : 'border-white/35 bg-white/14 text-white backdrop-blur-sm',
        down && 'scale-90 brightness-125',
      )}
      style={style}
      onPointerDown={(e) => {
        e.preventDefault()
        pid.current = e.pointerId
        capture(e.currentTarget, e.pointerId)
        setDown(true)
        haptic(10)
        getEngine()?.input.touchPress(spec.action)
      }}
      onPointerUp={release}
      onPointerCancel={release}
      onContextMenu={(e) => e.preventDefault()}
    >
      <span className="flex flex-col items-center leading-none">
        <Icon className={big ? 'mb-1 size-7' : 'mb-0.5 size-5'} strokeWidth={2.4} />
        <span ref={label}>{spec.label}</span>
      </span>
    </button>
  )
}

export function ActionCluster({ specs, left = false }: { specs: { primary: ButtonSpec; second?: ButtonSpec; third?: ButtonSpec }; left?: boolean }) {
  const side = left ? 'left' : 'right'
  const inset = 'max(env(safe-area-inset-right), 18px)'
  const insetL = 'max(env(safe-area-inset-left), 18px)'
  const s = side === 'right' ? inset : insetL
  return (
    <>
      <ActionButton spec={specs.primary} style={{ [side]: `calc(${s} + 6px)`, bottom: 'max(env(safe-area-inset-bottom), 26px)' }} />
      {specs.second && <ActionButton spec={specs.second} style={{ [side]: `calc(${s} + 118px)`, bottom: 'max(env(safe-area-inset-bottom), 18px)' }} />}
      {specs.third && <ActionButton spec={specs.third} style={{ [side]: `calc(${s} + 92px)`, bottom: 'calc(max(env(safe-area-inset-bottom), 18px) + 102px)' }} />}
    </>
  )
}

export const ICONS = { shoot: Target, block: Hand, jump: ArrowUpRight, pass: ArrowUpRight, switch: Shuffle, move: Zap, steal: Hand }
