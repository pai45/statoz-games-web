import type { CSSProperties, PointerEvent as ReactPointerEvent, ReactNode } from 'react'

import type { ScoreLine } from '../../game/progression.ts'
import type { HudState, NoticeTone } from '../../game/types.ts'
import { formatTime } from '../common.tsx'
import { IconArrow, IconCheck, IconClose, IconEye, IconStar } from '../icons.tsx'

export interface Popup {
  id: number
  lines: ScoreLine[]
  total: number
  headshot: boolean
}

export interface Notice {
  id: number
  text: string
  tone: NoticeTone
}

export interface TouchActions {
  fire: () => void
  toggleScope: () => void
  breath: (holding: boolean) => void
  cover: (held: boolean) => void
  zoom: (factor: number) => void
  zero: (direction: number) => void
  reload: () => void
  range: () => void
  thermal: () => void
  pause: () => void
}

export interface IntroCard {
  id: number
  kicker: string
  title: string
  sub: string
}

const CARDINALS: Record<number, string> = { 0: 'N', 45: 'NE', 90: 'E', 135: 'SE', 180: 'S', 225: 'SW', 270: 'W', 315: 'NW' }

function Compass({ heading }: { heading: number }) {
  const pxPerDeg = 4.3
  const ticks = []
  const start = Math.floor((heading - 62) / 5) * 5
  for (let b = start; b <= heading + 62; b += 5) {
    const bearing = ((b % 360) + 360) % 360
    const x = (b - heading) * pxPerDeg
    const major = bearing % 15 === 0
    ticks.push(
      <div key={b}>
        <div className="compass-tick" style={{ left: x, height: CARDINALS[bearing] !== undefined ? 10 : major ? 7 : 4, opacity: major ? 0.8 : 0.4 }} />
        {(CARDINALS[bearing] !== undefined || bearing % 30 === 0) && (
          <div className="compass-label" style={{ left: x, color: CARDINALS[bearing] ? undefined : 'rgb(232 233 226 / 50%)', fontSize: CARDINALS[bearing] ? 14 : 11 }}>
            {CARDINALS[bearing] ?? bearing}
          </div>
        )}
      </div>,
    )
  }
  return (
    <div className="flex flex-col items-center gap-0.5">
      <div className="compass">
        <div className="compass-strip">{ticks}</div>
        <div className="compass-caret" />
      </div>
      <div className="mono text-[11px] text-[var(--text-dim)]">{String(Math.round(heading) % 360).padStart(3, '0')}°</div>
    </div>
  )
}

function MissionPanel({ hud }: { hud: HudState }) {
  const m = hud.mission!
  return (
    <div className="hud-panel flex flex-col gap-3 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="label accent">{m.code}</div>
          <div className="display text-[24px]">{m.name}</div>
        </div>
        <div className="mono text-[13px] text-[var(--text-dim)]">{formatTime(m.elapsed)}</div>
      </div>
      <div className="hud-objective text-[13px] leading-snug">{m.objective}</div>
      <div className="flex flex-wrap items-center gap-1.5">
        {Array.from({ length: m.total }, (_, i) => (
          <span key={i} className={`pip ${i < m.remaining ? 'on' : 'down'}`} />
        ))}
        <span className="mono ml-2 text-[11px] text-[var(--text-dim)]">
          {m.total - m.remaining}/{m.total} neutralized
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span className={`alert-badge ${m.alert}`}>
          <IconEye size={12} /> {m.alert === 'calm' ? 'Undetected' : m.alert}
        </span>
        {m.alert !== 'compromised' && m.detection > 0.01 && (
          <div className="meter flex-1">
            <i style={{ width: `${m.detection * 100}%`, background: m.detection > 0.6 ? 'var(--danger)' : 'var(--hvt)' }} />
          </div>
        )}
      </div>
      <div className="hud-bonuses flex flex-col gap-1">
        {m.bonuses.map((bonus) => (
          <div key={bonus.label} className="flex items-center gap-2 text-[12px]" style={{ color: bonus.state === 'failed' ? 'var(--text-faint)' : bonus.state === 'met' ? 'var(--ok)' : 'var(--text-dim)' }}>
            {bonus.state === 'met' ? <IconCheck size={12} /> : bonus.state === 'failed' ? <IconClose size={12} /> : <IconStar size={12} />}
            <span className={bonus.state === 'failed' ? 'line-through' : ''}>{bonus.label}</span>
            {bonus.progress && bonus.state === 'pending' && <span className="mono ml-auto text-[10.5px]">{bonus.progress}</span>}
          </div>
        ))}
      </div>
    </div>
  )
}

function DuelPanel({ hud }: { hud: HudState }) {
  const d = hud.duel!
  return (
    <div className="hud-panel flex flex-col gap-3 p-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="label accent">
            Quick Duel · {d.arena}
          </div>
          <div className="display text-[24px]">
            Round {d.round} · Best of {d.rounds}
          </div>
        </div>
        <div className="mono text-[13px] text-[var(--text-dim)]">{formatTime(Math.max(0, d.roundLimit - d.roundTime))}</div>
      </div>
      <div className="flex items-center justify-between">
        <div className="text-center">
          <div className="label">You</div>
          <div className="display text-[40px] leading-none">{d.score.player}</div>
        </div>
        <div className="label">{d.difficulty}</div>
        <div className="text-center">
          <div className="label">Marksman</div>
          <div className="display text-[40px] leading-none text-[var(--text-dim)]">{d.score.enemy}</div>
        </div>
      </div>
    </div>
  )
}

function DetailsToggle({ expanded, onToggle, touch, opensUp }: { expanded: boolean; onToggle: () => void; touch: boolean; opensUp: boolean }) {
  // The arrow points the way the panel grows (or shrinks back).
  const up = expanded ? !opensUp : opensUp
  return (
    <button type="button" tabIndex={-1} className="hud-toggle" onMouseDown={(event) => event.preventDefault()} aria-expanded={expanded} aria-label={expanded ? 'Hide weapon details' : 'Show all weapon details'} onClick={onToggle}>
      <IconArrow size={11} style={{ transform: up ? 'none' : 'rotate(180deg)' }} />
      {expanded ? 'Less' : 'Details'}
      {!touch && <span className="keycap !h-[15px] !min-w-[15px] !px-1 !text-[9px]">I</span>}
    </button>
  )
}

function WeaponPanel({ hud, touch, onCollapse, opensUp = true }: { hud: HudState; touch: boolean; onCollapse?: () => void; opensUp?: boolean }) {
  const status = hud.reloading >= 0 ? 'Reloading' : hud.cycling >= 0 ? (hud.action === 'bolt' ? 'Cycling bolt' : 'Chambering') : hud.ammo === 0 ? (hud.reserve > 0 ? (touch ? 'Empty · tap reload' : 'Empty · press R') : 'Out of ammunition') : null
  const crossDeg = hud.windRelative
  const cross = Math.sin((crossDeg * Math.PI) / 180) * hud.windSpeed
  return (
    <div className="hud-panel flex flex-col gap-3 p-4">
      {onCollapse ? (
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="display whitespace-nowrap text-[20px]">{hud.rifleName}</div>
            <div className="mono text-[10.5px] text-[var(--text-faint)]">{hud.caliber}</div>
          </div>
          <DetailsToggle expanded onToggle={onCollapse} touch={touch} opensUp={opensUp} />
        </div>
      ) : (
        <div className="flex items-baseline justify-between gap-3">
          <span className="display text-[20px]">{hud.rifleName}</span>
          <span className="mono text-[10.5px] text-[var(--text-faint)]">{hud.caliber}</span>
        </div>
      )}
      <div className="flex items-end justify-between">
        <div className="flex items-end gap-1">
          {Array.from({ length: hud.magazine }, (_, i) => (
            <span key={i} className={`round-pip ${i >= hud.ammo ? 'spent' : i === 0 && hud.chambered ? 'chambered' : ''}`} />
          ))}
        </div>
        <div className="text-right">
          <span className="display text-[34px] leading-none">{hud.ammo}</span>
          <span className="mono text-[13px] text-[var(--text-dim)]"> / {hud.reserve}</span>
        </div>
      </div>
      {status && (
        <div className="flex items-center gap-2">
          <span className="label" style={{ color: hud.ammo === 0 && hud.reloading < 0 ? 'var(--danger)' : 'var(--accent)' }}>
            {status}
          </span>
          {(hud.reloading >= 0 || hud.cycling >= 0) && (
            <div className="meter flex-1">
              <i style={{ width: `${Math.max(hud.reloading, hud.cycling) * 100}%`, background: 'var(--accent)' }} />
            </div>
          )}
        </div>
      )}
      <div className="grid grid-cols-3 gap-2 border-t border-[rgb(255_255_255/8%)] pt-3">
        <div>
          <div className="label">Zero</div>
          <div className="mono text-[15px]">{hud.zero}m</div>
        </div>
        <div>
          <div className="label">Range</div>
          <div className="mono text-[15px]" style={{ color: hud.rangeFresh ? 'var(--accent-hi)' : 'var(--text-faint)' }}>
            {hud.range !== null && hud.rangeFresh ? `${Math.round(hud.range)}m` : '----'}
          </div>
        </div>
        <div>
          <div className="label">Optic</div>
          <div className="mono text-[15px]">{hud.zoom.toFixed(1)}×</div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="grid h-[46px] w-[46px] place-items-center rounded-full border border-[rgb(255_255_255/16%)]">
          <IconArrow size={22} style={{ transform: `rotate(${crossDeg}deg)`, color: 'var(--info)' } as CSSProperties} />
        </div>
        <div className="flex-1">
          <div className="label">Wind · from {Math.round(hud.windFrom)}°</div>
          <div className="mono text-[15px]">{hud.windSpeed.toFixed(1)} m/s</div>
          <div className="mono text-[10.5px] text-[var(--text-faint)]">
            {Math.abs(cross) < 0.15 ? 'no crosswind' : `${Math.abs(cross).toFixed(1)} m/s ${cross > 0 ? 'left → right' : 'right → left'}`}
          </div>
        </div>
      </div>
      {hud.scoped && (
        <div className="flex flex-col gap-1">
          <div className="flex justify-between">
            <span className="label" style={{ color: hud.exhausted ? 'var(--danger)' : hud.holding ? 'var(--info)' : undefined }}>
              {hud.exhausted ? 'Recovering breath' : hud.holding ? 'Holding breath' : touch ? 'Breath · hold steady' : 'Breath · hold Shift'}
            </span>
            {hud.assist && <span className="label">Assist on</span>}
          </div>
          <div className="meter">
            <i style={{ width: `${hud.breath * 100}%`, background: hud.exhausted ? 'var(--danger)' : 'var(--info)' }} />
          </div>
        </div>
      )}
      {hud.thermalAvailable && !touch && (
        <div className="label" style={{ color: hud.thermal ? 'var(--text)' : undefined }}>
          Thermal {hud.thermal ? 'on' : 'off'} · <span className="keycap">T</span>
        </div>
      )}
    </div>
  )
}

function WeaponCompact({ hud, touch, onExpand, opensUp }: { hud: HudState; touch: boolean; onExpand: () => void; opensUp: boolean }) {
  const cross = Math.sin((hud.windRelative * Math.PI) / 180) * hud.windSpeed
  const status = hud.reloading >= 0 ? 'Reload' : hud.cycling >= 0 ? 'Cycle' : hud.ammo === 0 ? 'Empty' : null
  const progress = Math.max(hud.reloading, hud.cycling)
  return (
    <div className="hud-panel weapon-compact flex flex-col gap-1.5 px-3 py-2">
      <div className="flex items-center gap-2.5">
        <div className="flex items-baseline gap-0.5">
          <span className="display text-[26px] leading-none">{hud.ammo}</span>
          <span className="mono text-[11px] text-[var(--text-dim)]">/{hud.reserve}</span>
        </div>
        <div className="flex items-end gap-[3px]">
          {Array.from({ length: hud.magazine }, (_, i) => (
            <span key={i} className={`round-pip sm ${i >= hud.ammo ? 'spent' : i === 0 && hud.chambered ? 'chambered' : ''}`} />
          ))}
        </div>
        {status && <span className="label !text-[9px]" style={{ color: hud.ammo === 0 && hud.reloading < 0 ? 'var(--danger)' : 'var(--accent)' }}>{status}</span>}
        <span className="ml-auto pl-1">
          <DetailsToggle expanded={false} onToggle={onExpand} touch={touch} opensUp={opensUp} />
        </span>
      </div>
      {progress >= 0 && (
        <div className="meter">
          <i style={{ width: `${progress * 100}%`, background: 'var(--accent)' }} />
        </div>
      )}
      <div className="mono flex items-center gap-3 text-[11px] leading-none text-[var(--text-dim)]">
        <span>
          Z <b className="font-medium text-[var(--text)]">{hud.zero}</b>
        </span>
        <span>
          R <b className="font-medium" style={{ color: hud.rangeFresh ? 'var(--accent-hi)' : 'var(--text-faint)' }}>{hud.range !== null && hud.rangeFresh ? Math.round(hud.range) : '---'}</b>
        </span>
        <span className="text-[var(--text)]">{hud.zoom.toFixed(1)}×</span>
        <span className="flex items-center gap-1" title={`Wind from ${Math.round(hud.windFrom)}°`}>
          <IconArrow size={13} style={{ transform: `rotate(${hud.windRelative}deg)`, color: 'var(--info)' } as CSSProperties} />
          <span className="text-[var(--text)]">{Math.abs(cross).toFixed(1)}</span>
        </span>
      </div>
      {hud.scoped && (
        <div className="meter">
          <i style={{ width: `${hud.breath * 100}%`, background: hud.exhausted ? 'var(--danger)' : 'var(--info)' }} />
        </div>
      )}
    </div>
  )
}

function TouchButton({ label, size = 58, onPress, onRelease, active = false, primary = false, children }: { label: string; size?: number; onPress: () => void; onRelease?: () => void; active?: boolean; primary?: boolean; children?: ReactNode }) {
  const down = (event: ReactPointerEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    onPress()
  }
  const up = (event: ReactPointerEvent<HTMLButtonElement>) => {
    event.preventDefault()
    onRelease?.()
  }
  return (
    <button
      type="button"
      aria-label={label}
      className={`touch-btn ${primary ? 'primary' : ''} ${active ? 'active' : ''}`}
      style={{ width: size, height: size, fontSize: size < 56 ? 10 : size < 70 ? 12 : undefined, letterSpacing: size < 56 ? '0.04em' : undefined }}
      onPointerDown={down}
      onPointerUp={up}
      onPointerCancel={up}
      onContextMenu={(event) => event.preventDefault()}
    >
      {children ?? <span>{label}</span>}
    </button>
  )
}

function TouchControls({ hud, actions }: { hud: HudState; actions: TouchActions }) {
  return (
    <>
      <div className="touch-left">
        <TouchButton label="Cover" size={66} active={hud.ducked} onPress={() => actions.cover(true)} onRelease={() => actions.cover(false)} />
        <div className="flex gap-2">
          <TouchButton label="Reload" size={50} onPress={actions.reload} />
          <TouchButton label="Range" size={50} onPress={actions.range} />
        </div>
        <div className="flex gap-2">
          <TouchButton label="Zero ▲" size={50} onPress={() => actions.zero(1)}>
            <span className="flex flex-col leading-none">
              <IconArrow size={14} />
              <span className="!text-[9px]">ZERO</span>
            </span>
          </TouchButton>
          <TouchButton label="Zero ▼" size={50} onPress={() => actions.zero(-1)}>
            <span className="flex flex-col items-center leading-none">
              <span className="!text-[9px]">ZERO</span>
              <IconArrow size={14} style={{ transform: 'rotate(180deg)' }} />
            </span>
          </TouchButton>
          {hud.thermalAvailable && <TouchButton label="Thermal" size={50} active={hud.thermal} onPress={actions.thermal} />}
        </div>
      </div>
      <div className="touch-right">
        {hud.scoped && (
          <div className="flex flex-col gap-2">
            <TouchButton label="Zoom in" size={46} onPress={() => actions.zoom(1.25)}>
              <span className="!text-[20px]">+</span>
            </TouchButton>
            <TouchButton label="Zoom out" size={46} onPress={() => actions.zoom(1 / 1.25)}>
              <span className="!text-[20px]">−</span>
            </TouchButton>
          </div>
        )}
        <div className="flex flex-col items-end gap-2">
          <TouchButton label={hud.scoped ? 'Lower' : 'Scope'} size={62} active={hud.scoped} onPress={actions.toggleScope} />
          <div className="flex items-end gap-2">
            {hud.scoped && <TouchButton label="Steady" size={62} active={hud.holding} onPress={() => actions.breath(true)} onRelease={() => actions.breath(false)} />}
            <TouchButton label="Fire" size={88} primary onPress={actions.fire} />
          </div>
        </div>
      </div>
      <button type="button" className="touch-pause" aria-label="Pause" onClick={actions.pause}>
        <span />
        <span />
      </button>
    </>
  )
}

function Controls({ hud, compact }: { hud: HudState; compact: boolean }) {
  const base: Array<[string, string]> = hud.scoped
    ? [
        ['LMB', 'Fire'],
        ['SHIFT', 'Breathe'],
        ['F', 'Range'],
        ['↑↓', 'Zero'],
        ['WHEEL', 'Zoom'],
        ['SPACE', 'Cover'],
      ]
    : [
        ['RMB', 'Scope'],
        ['F', 'Range / tag'],
        ['SPACE', 'Cover'],
        ['R', 'Reload'],
        ['ESC', 'Pause'],
      ]
  const items: Array<[string, string]> = compact ? [...base.slice(0, 4), ['I', 'Details']] : base
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-2 opacity-80">
      {items.map(([key, label]) => (
        <span key={key} className="flex items-center gap-1.5 text-[12px] text-[var(--text-dim)]">
          <span className="keycap">{key}</span>
          {label}
        </span>
      ))}
    </div>
  )
}

export function Hud({
  hud,
  popups,
  notices,
  intro,
  onEngage,
  touch,
  actions,
  compact,
  details,
  onToggleDetails,
}: {
  hud: HudState
  popups: Popup[]
  notices: Notice[]
  intro: IntroCard | null
  onEngage: () => void
  touch: boolean
  actions: TouchActions
  /** Phones and small windows: weapon info collapses to a single compact card. */
  compact: boolean
  details: boolean
  onToggleDetails: () => void
}) {
  if (hud.mode === 'menu') return null
  const duel = hud.duel
  const mission = hud.mission
  const banner = duel?.banner
    ? { title: duel.banner, sub: duel.bannerSub ?? '', tone: duel.banner.includes('lost') || duel.banner === 'Defeat' ? 'bad' : 'good' }
    : mission?.ending
      ? { title: mission.ending === 'success' ? 'Mission complete' : 'Mission failed', sub: mission.endReason ?? '', tone: mission.ending === 'success' ? 'good' : 'bad' }
      : hud.dead
        ? { title: 'Killed in action', sub: '', tone: 'bad' }
        : null
  const showLock = duel && duel.phase === 'live' && duel.enemyAiming && duel.lock > 0.12 && !hud.ducked
  return (
    <div className="hud">
      {!hud.killcam && (
        <>
          <div className="hud-tl">{mission ? <MissionPanel hud={hud} /> : duel ? <DuelPanel hud={hud} /> : null}</div>
          <div className="hud-tc">
            <Compass heading={hud.heading} />
            {showLock && (
              <div className={`lock-warning ${duel.warning ? 'hot' : ''}`}>
                <span className="label" style={{ color: duel.warning ? 'var(--danger)' : 'var(--hvt)' }}>
                  {duel.warning ? 'Fire imminent — take cover' : 'Marksman acquiring you'}
                </span>
                <div className="meter w-full">
                  <i style={{ width: `${Math.min(1, duel.lock) * 100}%`, background: 'var(--hvt)' }} />
                </div>
              </div>
            )}
            {notices.map((notice) => (
              <div key={notice.id} className={`notice ${notice.tone}`}>
                {notice.text}
              </div>
            ))}
          </div>
          {compact ? (
            // Touch keeps the fire controls bottom-right, so its card sits top-right and opens downward.
            <div className={touch ? 'hud-tr' : 'hud-br compact'}>
              {details ? (
                <WeaponPanel hud={hud} touch={touch} onCollapse={onToggleDetails} opensUp={!touch} />
              ) : (
                <WeaponCompact hud={hud} touch={touch} onExpand={onToggleDetails} opensUp={!touch} />
              )}
            </div>
          ) : (
            <div className="hud-br">
              <WeaponPanel hud={hud} touch={false} />
            </div>
          )}
          <div className={`flex flex-col gap-3 ${touch ? 'hud-status' : 'hud-bl'}`}>
            {hud.ducked && !hud.dead && <span className="alert-badge calm !text-[var(--info)]">In cover · release Space</span>}
            {hud.health < 99 && !hud.dead && (
              <div className="flex w-[200px] flex-col gap-1">
                <span className="label" style={{ color: hud.health < 40 ? 'var(--danger)' : undefined }}>
                  Condition {Math.round(hud.health)}%
                </span>
                <div className="meter">
                  <i style={{ width: `${hud.health}%`, background: hud.health < 40 ? 'var(--danger)' : 'var(--text)' }} />
                </div>
              </div>
            )}
            {!touch && <Controls hud={hud} compact={compact} />}
          </div>
          {touch && hud.live && !hud.dead && <TouchControls hud={hud} actions={actions} />}
          {hud.hint && !banner && (
            <div key={hud.hint} className="hint">
              {hud.hint}
            </div>
          )}
          <div className="popups">
            {popups.map((popup) =>
              popup.lines.map((line, i) => (
                <div key={`${popup.id}-${i}`} className={`popup-line ${i === 0 ? 'first' : ''} ${line.points < 0 ? 'bad' : ''}`} style={{ animationDelay: `${i * 0.09}s` }}>
                  <b>
                    {line.points > 0 ? '+' : ''}
                    {line.points}
                  </b>
                  {line.label}
                </div>
              )),
            )}
          </div>
        </>
      )}
      {hud.killcam && (
        <div className="killcam-tag">
          <i /> Bullet camera {touch ? 'tap to skip' : <><span className="keycap">LMB</span> skip</>}
        </div>
      )}
      {banner && (
        <div key={banner.title} className="banner">
          <div className="banner-title" style={{ color: banner.tone === 'bad' ? 'var(--danger)' : 'var(--text)' }}>
            {banner.title}
          </div>
          {banner.sub && <div className="mt-3 text-[16px] tracking-wide text-[var(--text-dim)]">{banner.sub}</div>}
        </div>
      )}
      {intro && !banner && (
        <div key={intro.id} className="mission-intro">
          <div className="kicker justify-center">{intro.kicker}</div>
          <div className="banner-title mt-2">{intro.title}</div>
          <div className="label mt-3">{intro.sub}</div>
        </div>
      )}
      {hud.live && !hud.pointerLocked && !hud.paused && !hud.killcam && (
        <button type="button" className="engage" onClick={onEngage} aria-label="Engage">
          <div className="flex flex-col items-center gap-3">
            <div className="display text-[44px]">Click to engage</div>
            <div className="label">Mouse aims · Esc pauses</div>
          </div>
        </button>
      )}
    </div>
  )
}
