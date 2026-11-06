// Shared UI primitives: rank insignia, XP bar, stars, toggles, and UI sound routing.
import { useEffect, useState, type ReactNode } from 'react'

import type { UiSound } from '../game/audio.ts'
import { IconStar } from './icons.tsx'

let uiHandler: (sound: UiSound) => void = () => {}

export function setUiHandler(handler: (sound: UiSound) => void): void {
  uiHandler = handler
}

export function playUi(sound: UiSound): void {
  uiHandler(sound)
}

/** Hover/click sound props for interactive elements. */
export function sfx(click: UiSound = 'click') {
  return {
    onMouseEnter: () => playUi('hover'),
    onClickCapture: () => playUi(click),
  }
}

export function RankBadge({ level, size = 44 }: { level: number; size?: number }) {
  const enlisted = level <= 11
  const warrant = level === 12 || level === 13
  const officer = level >= 14 && level <= 19
  const ghost = level >= 20
  const chevrons = enlisted ? Math.min(3, Math.max(0, Math.ceil((level - 1) / 2.6))) : 0
  const rockers = enlisted ? Math.max(0, Math.min(3, level - 8)) : 0
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-label={`Level ${level}`}>
      <defs>
        <linearGradient id={`rank-${level}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={ghost ? '#f6d27f' : '#f3c162'} />
          <stop offset="1" stopColor={ghost ? '#9a6f22' : '#b98330'} />
        </linearGradient>
      </defs>
      <path d="M24 2l20 11v22L24 46 4 35V13z" fill="#101415" stroke={`url(#rank-${level})`} strokeWidth="2" />
      <g fill={`url(#rank-${level})`}>
        {level === 1 && <rect x="17" y="22.5" width="14" height="3" />}
        {Array.from({ length: chevrons }, (_, i) => (
          <path key={`c${i}`} d={`M13 ${16 + i * 6}l11 6 11-6v3.4l-11 6-11-6z`} />
        ))}
        {Array.from({ length: rockers }, (_, i) => (
          <path key={`r${i}`} d={`M13 ${31 + i * 3.6}q11 5 22 0v2.2q-11 5-22 0z`} />
        ))}
        {warrant && (
          <>
            <rect x="15" y="20" width="18" height="8" />
            <rect x={level === 12 ? 22 : 18.5} y="22" width="3" height="4" fill="#101415" />
            {level === 13 && <rect x="26.5" y="22" width="3" height="4" fill="#101415" />}
          </>
        )}
        {officer &&
          (level <= 15 ? (
            Array.from({ length: level - 13 }, (_, i) => <rect key={i} x={level === 14 ? 21 : 17 + i * 9} y="14" width="5" height="20" />)
          ) : level <= 17 ? (
            <path d="M24 12l3 7 7.5.6-5.7 4.9 1.8 7.3L24 28l-6.6 3.8 1.8-7.3-5.7-4.9L21 19z" opacity={level === 17 ? 1 : 0.85} />
          ) : (
            <path d="M8 20l8 2 8-8 8 8 8-2-4 14H12z" />
          ))}
        {ghost && (
          <>
            <circle cx="24" cy="24" r="9" fill="none" stroke={`url(#rank-${level})`} strokeWidth="2.4" />
            <path d="M24 10v8M24 30v8M10 24h8M30 24h8" stroke={`url(#rank-${level})`} strokeWidth="2.4" />
            <circle cx="24" cy="24" r="2" />
          </>
        )}
      </g>
      {!ghost && (
        <text x="24" y={enlisted && chevrons > 0 ? 13.5 : 41.5} textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="7.5" fontWeight="600" fill="#e8e9e2">
          {level}
        </text>
      )}
    </svg>
  )
}

export function XpBar({ progress, gain = 0, height = 4 }: { progress: number; gain?: number; height?: number }) {
  return (
    <div className="xp-track" style={{ height }}>
      <div className="xp-gain" style={{ width: `${Math.min(100, (progress + gain) * 100)}%` }} />
      <div className="xp-fill" style={{ width: `${Math.min(100, progress * 100)}%` }} />
    </div>
  )
}

export function Stars({ count, max = 3, size = 16, pop = false }: { count: number; max?: number; size?: number; pop?: boolean }) {
  return (
    <span className="inline-flex gap-[3px]">
      {Array.from({ length: max }, (_, i) => (
        <span key={i} className={`star ${i < count ? 'on' : ''} ${pop && i < count ? 'pop' : ''}`} style={pop ? { animationDelay: `${0.35 + i * 0.28}s` } : undefined}>
          <IconStar size={size} filled={i < count} />
        </span>
      ))}
    </span>
  )
}

export function Segmented<T extends string | number>({ options, value, onChange }: { options: Array<{ value: T; label: string; disabled?: boolean }>; value: T; onChange: (value: T) => void }) {
  return (
    <div className="segmented" role="radiogroup">
      {options.map((option) => (
        <button
          key={String(option.value)}
          type="button"
          role="radio"
          aria-checked={option.value === value}
          disabled={option.disabled}
          className={option.value === value ? 'active' : ''}
          onClick={() => onChange(option.value)}
          {...sfx()}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

export function Switch({ on, onChange, label }: { on: boolean; onChange: (on: boolean) => void; label: string }) {
  return <button type="button" role="switch" aria-checked={on} aria-label={label} className={`switch ${on ? 'on' : ''}`} onClick={() => onChange(!on)} {...sfx()} />
}

export function StatBar({ label, value, compare }: { label: string; value: number; compare?: number }) {
  return (
    <div className="stat-row">
      <span className="label" style={{ letterSpacing: '0.12em' }}>
        {label}
      </span>
      <span className="stat-bar">
        {compare !== undefined && compare > value && <b style={{ width: `${compare}%`, opacity: 0.35 }} />}
        <i style={{ width: `${value}%` }} />
        {compare !== undefined && compare < value && <b style={{ left: `${compare}%`, width: `${value - compare}%` }} />}
      </span>
      <span className="mono text-right text-[12px] text-[var(--text-dim)]">{value}</span>
    </div>
  )
}

export function ScreenHeader({ kicker, title, onBack, right }: { kicker: string; title: string; onBack?: () => void; right?: ReactNode }) {
  return (
    <div className="screen-head">
      <div className="flex flex-col gap-3">
        {onBack && (
          <button type="button" className="btn-ghost self-start" onClick={onBack} {...sfx('back')}>
            <span className="keycap">ESC</span> Back
          </button>
        )}
        <div className="kicker">{kicker}</div>
        <h1 className="screen-title">{title}</h1>
      </div>
      {right}
    </div>
  )
}

/** Closes a screen with Escape. */
export function useEscape(handler: (() => void) | undefined): void {
  useEffect(() => {
    if (!handler) return
    const onKey = (event: KeyboardEvent) => {
      if (event.code === 'Escape') {
        playUi('back')
        handler()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handler])
}

/** Counts a number up from zero for result screens. */
export function useCountUp(target: number, duration = 1100, delay = 0): number {
  const [value, setValue] = useState(0)
  useEffect(() => {
    let frame = 0
    const start = performance.now() + delay
    const tick = (now: number) => {
      const t = Math.min(1, Math.max(0, (now - start) / duration))
      setValue(Math.round(target * (1 - Math.pow(1 - t, 3))))
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target, duration, delay])
  return value
}

export function formatTime(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}
