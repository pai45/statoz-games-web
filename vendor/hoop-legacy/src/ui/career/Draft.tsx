import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Check } from 'lucide-react'
import { contractOffers, runDraft, startNextSeason, type CareerSave } from '../../data/career'
import { fullName } from '../../game/types'
import { commitCareer, go, useStore } from '../../state/store'
import { Button, cx, Emblem, Panel, Pill, ScreenHeader, formatNum, sfx } from '../kit'

export function DraftNight() {
  const career = useStore((s) => s.career)
  const [draft] = useState(() => (career && career.chapter === 'combine' ? runDraft(career) : null))
  const [stage, setStage] = useState(0)
  const committed = useRef(false)
  useEffect(() => {
    if (!draft || committed.current) return
    committed.current = true
    commitCareer(draft.save)
  }, [draft])
  useEffect(() => {
    if (!draft) return
    const timers = [900, 2400, 3900].map((ms, i) =>
      window.setTimeout(() => {
        setStage((s) => Math.max(s, i + 1))
        sfx(i === 2 ? 'levelUp' : 'confirm')
      }, ms),
    )
    return () => timers.forEach((t) => window.clearTimeout(t))
  }, [draft])
  if (!draft || !career) {
    return (
      <div className="absolute inset-0 z-10 grid place-items-center">
        <Button onClick={() => go({ id: 'career', tab: 'home' })}>Back to hub</Button>
      </div>
    )
  }
  const { pick, team } = draft
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-ink-950/80 px-6 text-center backdrop-blur-sm">
      <div className="pointer-events-none absolute inset-0 opacity-60" style={{ background: `radial-gradient(ellipse at center, ${team.primary}55, transparent 60%)` }} />
      <div className="relative">
        <div className="animate-rise font-display text-xs font-bold uppercase tracking-[0.4em] text-white/60">Pro Hoops League Draft · Round 1</div>
        {stage >= 1 && <div className="mt-4 animate-rise font-display text-[clamp(22px,4vw,40px)] font-bold uppercase italic text-white/85">With pick #{pick}…</div>}
        {stage >= 2 && (
          <div className="mt-4 flex animate-pop flex-col items-center gap-3">
            <Emblem team={team} size={110} />
            <div className="font-display text-[clamp(18px,3vw,26px)] font-bold uppercase tracking-[0.2em] text-white/70">
              The {team.city} {team.name} select
            </div>
          </div>
        )}
        {stage >= 3 && (
          <div className="mt-2 animate-pop">
            <div className="font-display text-[clamp(42px,9vw,96px)] font-black uppercase italic leading-none" style={{ color: team.primary === '#f5d90a' ? '#f5d90a' : '#fff' }}>
              {fullName(career.player)}
            </div>
            <div className="mt-6">
              <Button variant="primary" size="lg" icon={<ArrowRight className="size-5" />} sound="confirm" onClick={() => go({ id: 'career', tab: 'home' })}>
                Start Rookie Season
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export function Offseason() {
  const save = useStore((s) => s.career)
  const [choice, setChoice] = useState(0)
  if (!save?.pro) return null
  const offers = contractOffers(save)
  const pro = save.pro
  const rec = pro.standings[pro.teamId]
  const sign = () => {
    const o = offers[choice]
    commitCareer(startNextSeason(save as CareerSave, o.team.id, o.salary))
    go({ id: 'career', tab: 'home' })
  }
  return (
    <div className="absolute inset-0 z-10 flex flex-col bg-gradient-to-r from-ink-950/96 via-ink-950/88 to-ink-950/40">
      <ScreenHeader title="Free Agency" kicker={`After season ${pro.season}`} onBack={() => go({ id: 'career', tab: 'home' })} />
      <div className="scrollbar-thin safe-pad min-h-0 flex-1 overflow-y-auto px-4 pb-4 sm:px-6">
        <div className="flex max-w-[900px] flex-col gap-3">
          <Panel title="Season in review">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-display text-2xl font-black italic">
                {rec.w}-{rec.l}
              </span>
              {pro.playoffs?.champion && pro.playoffs.champion !== pro.teamId && <Pill>Champion: {pro.playoffs.champion.toUpperCase()}</Pill>}
              {pro.awards.map((a) => (
                <Pill key={a} tone="gold">
                  {a}
                </Pill>
              ))}
            </div>
          </Panel>
          <div className="grid gap-3 md:grid-cols-3">
            {offers.map((o, i) => (
              <button
                key={o.team.id}
                onClick={() => {
                  sfx()
                  setChoice(i)
                }}
                className={cx('glass flex flex-col items-start gap-2 rounded-2xl p-4 text-left transition', choice === i ? 'ring-2 ring-blaze' : 'hover:ring-1 hover:ring-white/30')}
              >
                <div className="flex w-full items-center justify-between">
                  <Emblem team={o.team} size={48} />
                  {choice === i && <Check className="size-5 text-blaze" />}
                </div>
                <div className="font-display text-xl font-black uppercase italic leading-none">
                  {o.team.city} {o.team.name}
                </div>
                <div className="text-xs text-white/55">{o.note}</div>
                <div className="mt-1 font-display text-2xl font-black italic text-gold">{formatNum(o.salary)}</div>
                <div className="text-[11px] text-white/45">coins per season</div>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="safe-pad flex shrink-0 justify-end border-t border-white/8 px-4 py-3 sm:px-6">
        <Button variant="primary" size="lg" sound="confirm" onClick={sign}>
          Sign & Start Season {pro.season + 1}
        </Button>
      </div>
    </div>
  )
}
