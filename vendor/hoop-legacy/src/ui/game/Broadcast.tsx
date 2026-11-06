import { useEffect, useState } from 'react'
import { Flame, Mic } from 'lucide-react'
import type { Caption } from '../../game/engine/commentary'
import { onEngine } from '../../game/engine/runtime'
import type { IntroCard, MatchHud } from '../../game/sim/Match'
import type { StatCard } from '../../game/sim/director'
import type { Position, TeamInfo } from '../../game/types'
import { ARCHETYPES, heightToStr } from '../../data/attributes'
import { cx, OvrBadge } from '../kit'

const POSITION_NAME: Record<Position, string> = { PG: 'Point Guard', SG: 'Shooting Guard', SF: 'Small Forward', PF: 'Power Forward', C: 'Center' }

/** Starting-lineup lower-third: the jersey number in team colours, the name, position, size and rating. */
export function LineupCard({ card, team }: { card: IntroCard; team: TeamInfo }) {
  const arch = ARCHETYPES.find((a) => a.id === card.archetype)?.name
  return (
    <div
      key={card.key}
      className="pointer-events-none absolute bottom-[max(env(safe-area-inset-bottom),18px)] left-[max(env(safe-area-inset-left),18px)] z-30 flex animate-wipe items-stretch overflow-hidden rounded-lg shadow-2xl shadow-black/60 sm:bottom-[10%] sm:left-[5%]"
    >
      <div className="grid w-[clamp(58px,9vw,82px)] place-items-center font-display text-[clamp(34px,5.5vw,54px)] font-black italic leading-none" style={{ background: team.primary, color: team.secondary }}>
        {card.number}
      </div>
      <div className="flex min-w-0 flex-col justify-center bg-ink-950/90 px-4 py-2.5 backdrop-blur-md">
        <div className="font-display text-[11px] font-bold uppercase tracking-[0.32em] text-white/60">{card.first}</div>
        <div className="font-display text-[clamp(26px,4.2vw,42px)] font-black uppercase italic leading-[0.95]">{card.last}</div>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-2 text-[11px] font-semibold uppercase tracking-wider text-white/65">
          <span>{POSITION_NAME[card.position as Position] ?? card.position}</span>
          <span className="text-white/25">/</span>
          <span>{heightToStr(card.heightCm)}</span>
          {arch && (
            <>
              <span className="text-white/25">/</span>
              <span className="text-gold">{arch}</span>
            </>
          )}
        </div>
      </div>
      <div className="flex items-center bg-ink-900/92 px-3">
        <OvrBadge value={card.ovr} size="md" />
      </div>
      <div className="w-1.5" style={{ background: team.primary }} />
    </div>
  )
}

/** Broadcast stat lower-third: a scorer's line, a team run, a player catching fire. */
export function StatLowerThird({ card, touch }: { card: StatCard; touch: boolean }) {
  return (
    <div
      key={card.id}
      className={cx(
        'pointer-events-none absolute z-20 flex animate-wipe items-stretch overflow-hidden rounded-md shadow-xl shadow-black/50',
        touch ? 'left-[max(env(safe-area-inset-left),12px)] top-[calc(max(env(safe-area-inset-top),10px)+56px)]' : 'bottom-16 left-6',
      )}
    >
      <div className="w-1.5" style={{ background: card.team.primary }} />
      {card.number !== undefined && (
        <div className="grid min-w-[44px] place-items-center px-2 font-display text-2xl font-black italic" style={{ background: card.team.primary, color: card.team.secondary }}>
          {card.number}
        </div>
      )}
      <div className="flex flex-col justify-center bg-ink-950/90 px-3 py-1.5 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="font-display text-base font-black uppercase italic leading-none">{card.title}</span>
          {card.tag && (
            <span className={cx('flex items-center gap-1 rounded px-1.5 py-0.5 font-display text-[10px] font-black uppercase italic tracking-wider', card.tag === 'ON FIRE' ? 'bg-blaze text-white' : 'bg-gold text-ink-950')}>
              {card.tag === 'ON FIRE' && <Flame className="size-3" />}
              {card.tag}
            </span>
          )}
        </div>
        <div className="mt-0.5 font-display text-sm font-bold uppercase tracking-wide text-white/80 tabular-nums">{card.line}</div>
      </div>
    </div>
  )
}

const SPEAKER: Record<Caption['speaker'], { label: string; tone: string }> = {
  pbp: { label: 'Play-by-play', tone: 'text-blaze-soft' },
  color: { label: 'Analyst', tone: 'text-sky' },
  pa: { label: 'Arena PA', tone: 'text-gold' },
}

/** Commentary captions (always available, even when the browser has no speech voices). */
export function CaptionBar({ touch }: { touch: boolean }) {
  const [cap, setCap] = useState<Caption | null>(null)
  useEffect(() => {
    let off: (() => void) | undefined
    const unsub = onEngine((e) => {
      off?.()
      off = e.commentary.onCaption(setCap)
    })
    return () => {
      unsub()
      off?.()
    }
  }, [])
  if (!cap) return null
  const s = SPEAKER[cap.speaker]
  return (
    <div className={cx('pointer-events-none absolute left-1/2 z-20 w-max -translate-x-1/2', touch ? 'bottom-[max(env(safe-area-inset-bottom),14px)] max-w-[46vw]' : 'bottom-14 max-w-[min(640px,70vw)]')}>
      <div key={cap.id} className="flex animate-fade items-start gap-2 rounded-lg bg-black/70 px-3 py-1.5 shadow-lg backdrop-blur">
        <span className={cx('mt-[3px] flex shrink-0 items-center gap-1 font-display text-[10px] font-black uppercase italic tracking-widest', s.tone)}>
          <Mic className="size-3" />
          {s.label}
        </span>
        <span className={cx('font-medium leading-snug text-white/90', touch ? 'text-xs' : 'text-[13px]')}>{cap.text}</span>
      </div>
    </div>
  )
}

/** At the stripe: which free throw this is, who is shooting, and the timing cue for a human shooter. */
export function FreeThrowBanner({ ft, touch }: { ft: MatchHud['ft']; touch: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-[calc(max(env(safe-area-inset-top),8px)+72px)] z-20 flex animate-fade flex-col items-center gap-1.5">
      <div className="clip-skew flex items-center gap-2 bg-white/92 px-5 py-1.5 font-display text-sm font-black uppercase italic tracking-wider text-ink-950">
        Free throw {ft.idx} of {ft.total}
        <span className="text-ink-950/40">/</span>
        {ft.name}
      </div>
      {ft.human && (
        <div className="rounded-full bg-black/55 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white/75 backdrop-blur">{touch ? 'Hold Shoot, release at the top' : 'Hold Space, release at the top'}</div>
      )}
    </div>
  )
}
