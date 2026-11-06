import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { ChevronLeft, Coins, Dumbbell, FastForward, Inbox as InboxIcon, Mail, Play, Shirt, Sparkles, Star, Trophy, Users, BarChart3, CalendarDays, Home, Check, Lock, Crown } from 'lucide-react'
import {
  DRILLS,
  SHOP,
  applyContestResult,
  attrCapFor,
  buildSession,
  buyItem,
  canTrain,
  careerOvr,
  chapterName,
  effectivePlayer,
  equipItem,
  getProTeam,
  markInboxRead,
  nextEvent,
  recruitCost,
  reputationTier,
  runDrill,
  seriesWinner,
  setRecruits,
  shopItem,
  simContest,
  simCurrentGame,
  sortedStandings,
  updateLook,
  upgradeAttribute,
  upgradeBadge,
  xpForLevel,
  type CareerEvent,
  type CareerSave,
  type Rewards,
  type StatTotals,
} from '../../data/career'
import { ATTRS, ATTR_GROUPS, BADGES, BADGE_TIERS, BADGE_TIER_COLORS, getArchetype, heightToStr, overall, upgradeCost } from '../../data/attributes'
import { HAIR_COLORS } from '../../data/names'
import { getTeam, teamOvr } from '../../data/teams'
import type { HairStyle, MatchResult, PlayerProfile, TeamInfo } from '../../game/types'
import { fullName, shortName } from '../../game/types'
import { commitCareer, go, useStore, type CareerTab, type Session } from '../../state/store'
import { Button, cx, Emblem, IconButton, Modal, OvrBadge, Panel, Pill, RatingBar, Segmented, Stat, formatNum, sfx } from '../kit'
import { ChipGroup, FACIAL_HAIR, Swatches, facialHairOf, facialHairPatch } from './CreatePlayer'

const TABS: { id: CareerTab; label: string; icon: ReactNode }[] = [
  { id: 'home', label: 'Home', icon: <Home className="size-4" /> },
  { id: 'upgrade', label: 'Upgrade', icon: <Sparkles className="size-4" /> },
  { id: 'season', label: 'Season', icon: <CalendarDays className="size-4" /> },
  { id: 'stats', label: 'Stats', icon: <BarChart3 className="size-4" /> },
  { id: 'locker', label: 'Locker', icon: <Shirt className="size-4" /> },
  { id: 'inbox', label: 'Inbox', icon: <InboxIcon className="size-4" /> },
]

export function startCareerEvent(save: CareerSave, ev: CareerEvent | { id: string }) {
  const s = buildSession(save, ev.id)
  if (!s) return
  const session: Session =
    s.kind === 'match'
      ? { kind: 'match', config: s.match!, origin: 'career', eventId: s.eventId }
      : { kind: 'contest', config: s.contest!, origin: 'career', eventId: s.eventId, jersey: s.jersey }
  go({ id: 'game', session })
}

export function CareerHub({ tab }: { tab: CareerTab }) {
  const save = useStore((s) => s.career)
  const [browse, setBrowse] = useState(false)
  const [result, setResult] = useState<{ title: string; rewards: Rewards; match?: MatchResult } | null>(null)
  const [recruitOpen, setRecruitOpen] = useState(false)
  if (!save) return null
  const unread = save.inbox.filter((m) => !m.read).length
  const setTab = (t: CareerTab) => go({ id: 'career', tab: t })
  return (
    <div className="absolute inset-0 z-10 flex flex-col bg-gradient-to-r from-ink-950/96 via-ink-950/85 to-ink-950/35 max-md:to-ink-950/80">
      <HubHeader save={save} />
      <nav className="scrollbar-thin safe-pad flex shrink-0 gap-1 overflow-x-auto px-4 pb-2 sm:px-6">
        <button className="h-11 rounded-lg bg-white px-4 font-display font-bold uppercase text-ink-950" onClick={() => { setBrowse(false); setTab('home') }}>Next event</button>
        <button className="h-11 rounded-lg px-4 font-display font-bold uppercase text-white/80" aria-expanded={browse} onClick={() => setBrowse(!browse)}>Browse career</button>
      </nav>
      {browse && <nav className="safe-pad flex shrink-0 flex-wrap gap-2 px-4 pb-3 sm:px-6" aria-label="Career sections">
        {TABS.filter(t => t.id !== 'home').map((t) => (
          <button
            key={t.id}
            onClick={() => {
              sfx()
              setBrowse(false)
              setTab(t.id)
            }}
            className={cx(
              'relative flex h-11 shrink-0 items-center gap-1.5 rounded-lg px-3 font-display text-sm font-bold uppercase tracking-wide transition',
              tab === t.id ? 'bg-white text-ink-950' : 'text-white/65 hover:bg-white/8 hover:text-white',
            )}
          >
            {t.icon}
            {t.label}
            {t.id === 'inbox' && unread > 0 && <span className="grid size-4 place-items-center rounded-full bg-blaze text-[10px] text-white">{unread}</span>}
            {t.id === 'upgrade' && save.sp > 0 && <span className="grid h-4 min-w-4 place-items-center rounded-full bg-gold px-1 text-[10px] text-ink-950">{save.sp}</span>}
          </button>
        ))}
      </nav>}
      <div className="scrollbar-thin safe-pad min-h-0 flex-1 overflow-y-auto px-4 pb-6 sm:px-6">
        <div className="lg:max-w-[1000px]">
          {tab === 'home' && <HomeTab save={save} onResult={setResult} onRecruit={() => setRecruitOpen(true)} />}
          {tab === 'upgrade' && <UpgradeTab save={save} />}
          {tab === 'season' && <SeasonTab save={save} />}
          {tab === 'stats' && <StatsTab save={save} />}
          {tab === 'locker' && <LockerTab save={save} />}
          {tab === 'inbox' && <InboxTab save={save} />}
        </div>
      </div>
      <Modal open={!!result} onClose={() => setResult(null)} title={result?.title}>
        {result && <ResultSummary result={result} />}
      </Modal>
      <RecruitModal open={recruitOpen} onClose={() => setRecruitOpen(false)} save={save} />
    </div>
  )
}

function HubHeader({ save }: { save: CareerSave }) {
  const ovr = careerOvr(save)
  const need = xpForLevel(save.level)
  const arch = getArchetype(save.player.archetype)
  return (
    <header className="safe-pad flex shrink-0 flex-wrap items-center gap-x-4 gap-y-2 px-4 pt-[max(env(safe-area-inset-top),12px)] pb-3 sm:px-6">
      <IconButton onClick={() => go({ id: 'menu' })} label="Main menu">
        <ChevronLeft className="size-5" />
      </IconButton>
      <OvrBadge value={ovr} />
      <div className="min-w-0">
        <div className="font-display text-[10px] font-bold uppercase tracking-[0.22em] text-blaze">{chapterName(save.chapter)}</div>
        <div className="truncate font-display text-2xl font-black uppercase italic leading-none">{fullName(save.player)}</div>
        <div className="text-[11px] text-white/55">
          {save.player.position} · {arch.name} · {heightToStr(save.player.heightCm)} · {reputationTier(save.followers)}
        </div>
      </div>
      <div className="ml-auto flex items-center gap-3 sm:gap-5">
        <div className="w-28">
          <div className="flex justify-between font-display text-[11px] font-bold uppercase tracking-wider text-white/60">
            <span>Lvl {save.level}</span>
            <span>
              {save.xp}/{need}
            </span>
          </div>
          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-gradient-to-r from-sky to-good" style={{ width: `${(save.xp / need) * 100}%` }} />
          </div>
        </div>
        <HeaderStat icon={<Coins className="size-4 text-gold" />} value={formatNum(save.coins)} label="Coins" />
        <HeaderStat icon={<Sparkles className="size-4 text-sky" />} value={String(save.sp)} label="SP" />
        <HeaderStat icon={<Users className="size-4 text-blaze-soft" />} value={formatNum(save.followers)} label="Fans" />
      </div>
    </header>
  )
}

function HeaderStat({ icon, value, label }: { icon: ReactNode; value: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5" title={label}>
      {icon}
      <span className="font-display text-lg font-black italic tabular-nums">{value}</span>
    </div>
  )
}

// ---------------------------------------------------------------- home
function HomeTab({ save, onResult, onRecruit }: { save: CareerSave; onResult: (r: { title: string; rewards: Rewards; match?: MatchResult }) => void; onRecruit: () => void }) {
  const ev = nextEvent(save)
  const opp = ev.opponent
  const oppIsTeam = !!opp && 'roster' in opp
  const oppOvr = opp ? (oppIsTeam ? teamOvr(opp as TeamInfo) : overall((opp as PlayerProfile).attributes, (opp as PlayerProfile).position)) : null
  const primary = () => {
    if (ev.kind === 'match' || ev.kind === 'contest') startCareerEvent(save, ev)
    else if (ev.kind === 'recruit') onRecruit()
    else if (ev.kind === 'draft') go({ id: 'draft' })
    else go({ id: 'offseason' })
  }
  const sim = () => {
    if (ev.kind === 'contest') {
      const { save: s2, rewards } = simContest(save, ev.id)
      commitCareer(s2)
      onResult({ title: 'Contest simulated', rewards })
    } else {
      const { save: s2, rewards, result } = simCurrentGame(save, ev.id)
      commitCareer(s2)
      onResult({ title: result.winner === 0 ? 'Simulated · Win' : 'Simulated · Loss', rewards, match: result })
    }
  }
  const primaryLabel = { match: 'Play', contest: 'Compete', recruit: 'Build Crew', draft: 'Draft Night', offseason: 'Free Agency', champion: 'Continue' }[ev.kind]
  return (
    <div className="grid gap-3 lg:grid-cols-[1.25fr_1fr]">
      <div className="glass relative animate-rise overflow-hidden rounded-2xl p-5">
        <div className="pointer-events-none absolute -right-16 -top-20 size-64 rounded-full bg-blaze/25 blur-3xl" />
        <div className="relative">
          <div className="font-display text-[10px] font-bold uppercase tracking-[0.25em] text-blaze">{ev.chapterLabel}</div>
          <div className="mt-1 font-display text-[clamp(26px,4vw,40px)] font-black uppercase italic leading-[0.95]">{ev.title}</div>
          <div className="mt-1.5 text-sm text-white/65">{ev.subtitle}</div>
          {opp && (
            <div className="mt-4 flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2.5">
              {oppIsTeam ? <Emblem team={opp as TeamInfo} size={40} /> : <div className="grid size-10 place-items-center rounded-full bg-[#1f6feb]/30 font-display font-black italic">{(opp as PlayerProfile).lastName.slice(0, 2).toUpperCase()}</div>}
              <div className="min-w-0 flex-1">
                <div className="truncate font-display text-lg font-bold uppercase">{oppIsTeam ? `${(opp as TeamInfo).city} ${(opp as TeamInfo).name}` : fullName(opp as PlayerProfile)}</div>
                <div className="text-xs text-white/50">{oppIsTeam ? `Team OVR ${oppOvr}` : `${(opp as PlayerProfile).position} · ${heightToStr((opp as PlayerProfile).heightCm)}`}</div>
              </div>
              {oppOvr !== null && <OvrBadge value={oppOvr} size="sm" />}
              <span className="font-display text-sm font-bold text-white/40">vs</span>
              <OvrBadge value={careerOvr(save)} size="sm" label="YOU" />
            </div>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="primary" size="lg" icon={<Play className="size-5" />} sound="confirm" onClick={primary}>
              {primaryLabel}
            </Button>
            {ev.canSim && <details>
              <summary className="cursor-pointer px-3 py-3 text-sm text-white/70">More options</summary>
              <Button icon={<FastForward className="size-4" />} onClick={sim}>
                Sim (reduced rewards)
              </Button>
            </details>}
          </div>
        </div>
      </div>
      <details className="glass rounded-2xl p-4">
        <summary className="cursor-pointer font-display font-bold uppercase">Training & progress</summary>
        <div className="mt-3 grid gap-3"><TrainingCard save={save} onResult={onResult} /><ProgressCard save={save} /><LatestMessage save={save} /></div>
      </details>
    </div>
  )
}

function TrainingCard({ save, onResult }: { save: CareerSave; onResult: (r: { title: string; rewards: Rewards }) => void }) {
  const ok = canTrain(save)
  return (
    <Panel title="Training Facility" action={<Pill tone={ok ? 'good' : 'default'}>{ok ? '1 session ready' : 'Recovering'}</Pill>} className="animate-rise [animation-delay:80ms]">
      <div className="flex flex-col gap-1.5">
        {DRILLS.map((d) => (
          <button
            key={d.id}
            disabled={!ok}
            onClick={() => {
              sfx('confirm')
              if (d.interactive) startCareerEvent(save, { id: 'train:3pt' })
              else {
                const { save: s2, rewards } = runDrill(save, d.id)
                commitCareer(s2)
                onResult({ title: d.name, rewards })
              }
            }}
            className="flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2 text-left transition enabled:hover:bg-white/10 disabled:opacity-40"
          >
            <Dumbbell className="size-4 shrink-0 text-blaze" />
            <div className="min-w-0 flex-1">
              <div className="font-display text-[15px] font-bold uppercase">{d.name}</div>
              <div className="text-[11px] text-white/50">{d.focus}</div>
            </div>
            {d.interactive && <Pill tone="blaze">Live</Pill>}
          </button>
        ))}
      </div>
      {!ok && <p className="mt-2 text-xs text-white/45">You trained since your last game. Play your next game to unlock another session.</p>}
    </Panel>
  )
}

function ProgressCard({ save }: { save: CareerSave }) {
  if (save.chapter === 'blacktop') {
    return (
      <Panel title="Rucker Lane Ladder" className="animate-rise [animation-delay:140ms]">
        <div className="flex flex-col gap-1.5">
          {save.blacktop.ladder.map((p, i) => {
            const done = i < save.blacktop.beaten
            const cur = i === save.blacktop.beaten
            return (
              <div key={p.id} className={cx('flex items-center gap-3 rounded-xl px-3 py-2', cur ? 'bg-blaze/15 ring-1 ring-blaze/50' : 'bg-white/4')}>
                <span className="w-5 font-display text-sm font-black italic text-white/40">{i + 1}</span>
                <span className={cx('flex-1 truncate font-display font-bold uppercase', done && 'text-white/40 line-through')}>{fullName(p)}</span>
                <span className="text-xs text-white/50">OVR {overall(p.attributes, p.position)}</span>
                {done ? <Check className="size-4 text-good" /> : cur ? <Pill tone="blaze">Next</Pill> : <Lock className="size-3.5 text-white/30" />}
              </div>
            )
          })}
        </div>
      </Panel>
    )
  }
  if (save.chapter === 'circuit') {
    const br = save.circuit.bracket
    const mates = save.circuit.recruits.filter((r) => save.circuit.teammates.includes(r.id))
    return (
      <Panel title="City Circuit" className="animate-rise [animation-delay:140ms]">
        <div className="mb-2 text-xs text-white/50">Your crew</div>
        <div className="flex flex-wrap gap-1.5">
          <Pill tone="blaze">{shortName(save.player)}</Pill>
          {mates.length ? mates.map((m) => <Pill key={m.id}>{shortName(m)} · {overall(m.attributes, m.position)}</Pill>) : <span className="text-sm text-white/45">No teammates yet</span>}
        </div>
        {br && (
          <div className="mt-3 grid grid-cols-3 gap-1.5">
            {['Quarterfinal', 'Semifinal', 'Final'].map((r, i) => {
              const team = getTeam(br.opponents[i])
              const done = i < br.round
              return (
                <div key={r} className={cx('rounded-xl px-2 py-2 text-center', i === br.round ? 'bg-blaze/15 ring-1 ring-blaze/50' : 'bg-white/4')}>
                  <div className="font-display text-[10px] font-bold uppercase tracking-wider text-white/50">{r}</div>
                  <Emblem team={team} size={30} className={cx('mx-auto my-1', !done && i > br.round && 'opacity-40 grayscale')} />
                  <div className="truncate font-display text-xs font-bold uppercase">{i <= br.round ? team.name : '???'}</div>
                  {done && <Check className="mx-auto mt-0.5 size-3.5 text-good" />}
                </div>
              )
            })}
          </div>
        )}
        {save.circuit.runs > 0 && <p className="mt-2 text-xs text-white/45">Attempt {save.circuit.runs + 1}</p>}
      </Panel>
    )
  }
  if (save.chapter === 'combine') {
    const c = save.combine
    return (
      <Panel title="Draft Combine" className="animate-rise [animation-delay:140ms]">
        <div className="flex flex-col gap-1.5 text-sm">
          <Check3 done={c.threeScore !== null} label="Shooting drill" value={c.threeScore !== null ? `${c.threeScore} pts` : 'Pending'} />
          <Check3 done={!!c.oneOnOne} label="Prospect showdown" value={c.oneOnOne ? (c.oneOnOne.won ? `Won by ${c.oneOnOne.margin}` : `Lost by ${-c.oneOnOne.margin}`) : 'Pending'} />
          <Check3 done={false} label="Draft night" value="Pick #?" />
        </div>
        <p className="mt-2 text-xs text-white/45">Your draft position depends on your combine results and overall rating.</p>
      </Panel>
    )
  }
  const pro = save.pro!
  const team = getProTeam(save)
  const table = sortedStandings(pro)
  const seed = table.findIndex((x) => x.id === pro.teamId) + 1
  const rec = pro.standings[pro.teamId]
  return (
    <Panel title={`Season ${pro.season} · ${pro.year}`} className="animate-rise [animation-delay:140ms]">
      <div className="flex items-center gap-3">
        <Emblem team={team} size={52} />
        <div className="min-w-0 flex-1">
          <div className="truncate font-display text-xl font-black uppercase italic leading-none">
            {team.city} {team.name}
          </div>
          <div className="mt-1 text-sm text-white/60">
            {rec.w}-{rec.l} · #{seed} seed · {pro.phase === 'regular' ? 'Regular season' : pro.phase === 'playoffs' ? 'Playoffs' : 'Offseason'}
          </div>
        </div>
        <div className="text-right">
          <div className="font-display text-[10px] font-bold uppercase tracking-wider text-white/45">Salary</div>
          <div className="font-display text-lg font-black italic text-gold">{formatNum(pro.salary)}</div>
        </div>
      </div>
      {pro.awards.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {pro.awards.map((a) => (
            <Pill key={a} tone="gold">
              <Star className="size-3" /> {a}
            </Pill>
          ))}
        </div>
      )}
      <div className="mt-3 text-xs text-white/50">Legacy {save.legacy} / 1000 Hall of Fame</div>
      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-gradient-to-r from-gold to-blaze" style={{ width: `${Math.min(100, save.legacy / 10)}%` }} />
      </div>
    </Panel>
  )
}

function Check3({ done, label, value }: { done: boolean; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-white/4 px-3 py-2">
      {done ? <Check className="size-4 text-good" /> : <span className="size-4 rounded-full border border-white/30" />}
      <span className="flex-1 font-display font-bold uppercase">{label}</span>
      <span className="text-white/55">{value}</span>
    </div>
  )
}

function LatestMessage({ save }: { save: CareerSave }) {
  const m = save.inbox[0]
  if (!m) return null
  return (
    <Panel title="Latest" action={<Button size="sm" variant="ghost" icon={<Mail className="size-4" />} onClick={() => go({ id: 'career', tab: 'inbox' })}>Inbox</Button>} className="animate-rise [animation-delay:200ms]">
      <div className="font-display text-xs font-bold uppercase tracking-wider text-blaze">{m.from}</div>
      <div className="font-display text-lg font-bold uppercase">{m.title}</div>
      <p className="mt-1 line-clamp-3 text-sm text-white/65">{m.body}</p>
    </Panel>
  )
}

function ResultSummary({ result }: { result: { title: string; rewards: Rewards; match?: MatchResult } }) {
  const r = result.rewards
  const me = result.match?.stats['me']
  return (
    <div className="flex flex-col gap-3">
      {result.match && (
        <div className="text-center">
          <div className="font-display text-5xl font-black italic">
            {result.match.score[0]} – {result.match.score[1]}
          </div>
          {me && (
            <div className="mt-1 font-display text-sm font-bold uppercase text-white/65">
              {me.pts} PTS · {me.reb} REB · {me.ast} AST · {me.stl} STL · {me.blk} BLK
            </div>
          )}
        </div>
      )}
      <div className="grid grid-cols-3 gap-2 text-center">
        <Stat label="XP" value={`+${r.xp}`} />
        <Stat label="Coins" value={`+${formatNum(r.coins)}`} />
        <Stat label="Fans" value={`+${formatNum(r.followers)}`} />
      </div>
      {r.attributeGains.map((g) => (
        <div key={g.key} className="rounded-xl bg-good/12 px-3 py-2 text-sm font-semibold text-good">
          {ATTRS.find((a) => a.key === g.key)?.label} +{g.amount}
        </div>
      ))}
      {r.levelUps > 0 && <div className="rounded-xl bg-sky/12 px-3 py-2 text-sm font-semibold text-sky">Level up! +{r.spGained} skill points</div>}
      {r.messages.map((m) => (
        <div key={m} className="rounded-xl bg-white/6 px-3 py-2 text-sm text-white/80">
          {m}
        </div>
      ))}
    </div>
  )
}

function RecruitModal({ open, onClose, save }: { open: boolean; onClose: () => void; save: CareerSave }) {
  const [picked, setPicked] = useState<string[]>([])
  useEffect(() => {
    if (open) setPicked([])
  }, [open])
  const cost = save.circuit.recruits.filter((r) => picked.includes(r.id)).reduce((a, p) => a + recruitCost(p), 0)
  return (
    <Modal open={open} onClose={onClose} title="Recruit Your Crew" wide>
      <p className="mb-3 text-sm text-white/60">Pick two teammates for the City Circuit. Better players want a bigger cut of your coins.</p>
      <div className="grid gap-2 sm:grid-cols-2">
        {save.circuit.recruits.map((p) => {
          const on = picked.includes(p.id)
          const c = recruitCost(p)
          return (
            <button
              key={p.id}
              onClick={() => {
                sfx()
                setPicked((x) => (on ? x.filter((i) => i !== p.id) : x.length < 2 ? [...x, p.id] : [x[1], p.id]))
              }}
              className={cx('flex items-center gap-3 rounded-xl border p-3 text-left transition', on ? 'border-blaze bg-blaze/12' : 'border-white/10 bg-white/4 hover:border-white/30')}
            >
              <OvrBadge value={overall(p.attributes, p.position)} size="sm" />
              <div className="min-w-0 flex-1">
                <div className="truncate font-display text-[15px] font-bold uppercase">{fullName(p)}</div>
                <div className="text-[11px] text-white/50">
                  {p.position} · {getArchetype(p.archetype).name} · 3PT {p.attributes.three} · REB {p.attributes.rebound}
                </div>
              </div>
              <span className={cx('font-display text-sm font-black', c === 0 ? 'text-good' : 'text-gold')}>{c === 0 ? 'FREE' : c}</span>
            </button>
          )
        })}
      </div>
      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="text-sm text-white/60">
          Cost <span className={cx('font-bold', cost > save.coins ? 'text-bad' : 'text-gold')}>{cost}</span> / {save.coins} coins
        </span>
        <Button
          variant="primary"
          disabled={picked.length !== 2 || cost > save.coins}
          sound="confirm"
          onClick={() => {
            commitCareer(setRecruits(save, picked))
            onClose()
          }}
        >
          Sign Crew
        </Button>
      </div>
    </Modal>
  )
}

// ---------------------------------------------------------------- upgrade
function UpgradeTab({ save }: { save: CareerSave }) {
  const eff = effectivePlayer(save)
  const [view, setView] = useState<'attributes' | 'badges'>('attributes')
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Segmented options={[{ value: 'attributes', label: 'Attributes' }, { value: 'badges', label: 'Badges' }]} value={view} onChange={setView} />
        <div className="flex items-center gap-2 rounded-xl bg-sky/12 px-3 py-1.5">
          <Sparkles className="size-4 text-sky" />
          <span className="font-display text-lg font-black italic">{save.sp}</span>
          <span className="text-xs text-white/60">skill points · +4 per level</span>
        </div>
      </div>
      {view === 'attributes' ? (
        <div className="grid gap-3 md:grid-cols-2">
          {ATTR_GROUPS.map((g) => (
            <Panel key={g} title={g}>
              <div className="flex flex-col gap-2">
                {ATTRS.filter((a) => a.group === g).map((a) => {
                  const v = save.player.attributes[a.key]
                  const cap = attrCapFor(save, a.key)
                  const cost = upgradeCost(v)
                  const boost = eff.attributes[a.key] - v
                  const maxed = v >= cap
                  return (
                    <div key={a.key} className="flex items-center gap-2">
                      <div className="min-w-0 flex-1">
                        <RatingBar label={a.label} value={v + boost} cap={cap} boost={boost} />
                      </div>
                      <button
                        aria-label={`Upgrade ${a.label}`}
                        disabled={maxed || save.sp < cost}
                        onClick={() => {
                          sfx()
                          commitCareer(upgradeAttribute(save, a.key))
                        }}
                        className="flex h-8 w-14 shrink-0 items-center justify-center gap-1 rounded-lg bg-white/10 font-display text-sm font-black transition enabled:hover:bg-blaze disabled:opacity-30"
                      >
                        {maxed ? 'MAX' : `+${cost}`}
                      </button>
                    </div>
                  )
                })}
              </div>
            </Panel>
          ))}
        </div>
      ) : (
        <div className="grid gap-2 sm:grid-cols-2">
          {BADGES.map((b) => {
            const tier = save.player.badges[b.id] ?? 0
            const maxed = tier >= 4
            const need = maxed ? 0 : b.req[tier]
            const cost = maxed ? 0 : b.cost[tier]
            const meets = maxed || save.player.attributes[b.attr] >= need
            const attrLabel = ATTRS.find((a) => a.key === b.attr)!.short
            return (
              <div key={b.id} className="glass flex items-center gap-3 rounded-2xl p-3">
                <div className="grid size-11 shrink-0 place-items-center rounded-xl" style={{ background: `${BADGE_TIER_COLORS[tier]}33`, boxShadow: `inset 0 0 0 2px ${BADGE_TIER_COLORS[tier]}` }}>
                  <Crown className="size-5" style={{ color: tier ? BADGE_TIER_COLORS[tier] : '#6b7385' }} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate font-display text-[15px] font-bold uppercase">{b.name}</span>
                    <span className="font-display text-[10px] font-bold uppercase tracking-wider" style={{ color: BADGE_TIER_COLORS[tier] }}>
                      {BADGE_TIERS[tier]}
                    </span>
                  </div>
                  <div className="text-[11px] text-white/55">{b.description}</div>
                  {!maxed && (
                    <div className={cx('text-[11px]', meets ? 'text-white/45' : 'text-bad')}>
                      Next: {BADGE_TIERS[tier + 1]} · needs {attrLabel} {need}
                    </div>
                  )}
                </div>
                <button
                  disabled={maxed || !meets || save.sp < cost}
                  onClick={() => {
                    sfx('confirm')
                    commitCareer(upgradeBadge(save, b.id))
                  }}
                  className="h-8 shrink-0 rounded-lg bg-white/10 px-2.5 font-display text-sm font-black transition enabled:hover:bg-gold enabled:hover:text-ink-950 disabled:opacity-30"
                >
                  {maxed ? 'MAX' : `${cost} SP`}
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------- season
function SeasonTab({ save }: { save: CareerSave }) {
  const pro = save.pro
  if (!pro) {
    return (
      <div className="grid gap-3 md:grid-cols-2">
        <ProgressCard save={save} />
        <Panel title="Road to the pros">
          <ol className="flex flex-col gap-2 text-sm">
            {(['blacktop', 'circuit', 'combine', 'pro'] as const).map((c, i) => {
              const order = ['blacktop', 'circuit', 'combine', 'pro'].indexOf(save.chapter)
              return (
                <li key={c} className={cx('flex items-center gap-2 rounded-xl px-3 py-2', i === order ? 'bg-blaze/15' : 'bg-white/4', i > order && 'opacity-50')}>
                  {i < order ? <Check className="size-4 text-good" /> : i === order ? <Play className="size-4 text-blaze" /> : <Lock className="size-4" />}
                  <span className="font-display font-bold uppercase">{chapterName(c)}</span>
                </li>
              )
            })}
          </ol>
        </Panel>
      </div>
    )
  }
  const table = sortedStandings(pro)
  const rounds = Math.max(...pro.schedule.map((g) => g.round)) + 1
  const mine = pro.schedule.filter((g) => g.home === pro.teamId || g.away === pro.teamId)
  return (
    <div className="grid gap-3 lg:grid-cols-[1fr_1fr]">
      <Panel title={`Standings · Season ${pro.season}`}>
        <table className="w-full text-sm">
          <thead>
            <tr className="font-display text-[11px] uppercase tracking-wider text-white/45">
              <th className="py-1 text-left">#</th>
              <th className="py-1 text-left">Team</th>
              <th className="py-1 text-right">W</th>
              <th className="py-1 text-right">L</th>
              <th className="py-1 text-right">Diff</th>
            </tr>
          </thead>
          <tbody>
            {table.map((r, i) => {
              const t = getTeam(r.id)
              return (
                <tr key={r.id} className={cx('border-t border-white/5', r.id === pro.teamId && 'bg-blaze/12', i === 3 && 'border-b border-dashed border-b-white/25')}>
                  <td className="py-1.5 font-display font-black italic text-white/50">{i + 1}</td>
                  <td className="py-1.5">
                    <div className="flex items-center gap-2">
                      <Emblem team={t} size={22} />
                      <span className="font-semibold">
                        {t.city} {t.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-1.5 text-right font-bold tabular-nums">{r.w}</td>
                  <td className="py-1.5 text-right tabular-nums">{r.l}</td>
                  <td className={cx('py-1.5 text-right tabular-nums', r.pf - r.pa >= 0 ? 'text-good' : 'text-bad')}>{r.pf - r.pa > 0 ? '+' : ''}{r.pf - r.pa}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <p className="mt-2 text-[11px] text-white/45">Top four make the playoffs · Semis and Finals are best of three</p>
      </Panel>
      <div className="flex flex-col gap-3">
        {pro.playoffs && (
          <Panel title="Playoffs">
            <div className="flex flex-col gap-2">
              {[...pro.playoffs.semis, ...(pro.playoffs.final ? [pro.playoffs.final] : [])].map((s, i) => {
                const a = getTeam(s.a)
                const b = getTeam(s.b)
                const w = seriesWinner(s)
                return (
                  <div key={i} className="rounded-xl bg-white/4 px-3 py-2">
                    <div className="mb-1 font-display text-[10px] font-bold uppercase tracking-wider text-white/45">{i < 2 ? `Semifinal ${i + 1}` : 'Finals'}</div>
                    {[{ t: a, wins: s.winsA }, { t: b, wins: s.winsB }].map(({ t, wins }) => (
                      <div key={t.id} className={cx('flex items-center gap-2 py-0.5', w && w !== t.id && 'opacity-45')}>
                        <Emblem team={t} size={20} />
                        <span className={cx('flex-1 text-sm font-semibold', t.id === pro.teamId && 'text-blaze-soft')}>{t.name}</span>
                        <span className="font-display font-black">{wins}</span>
                      </div>
                    ))}
                  </div>
                )
              })}
              {pro.playoffs.champion && (
                <div className="flex items-center gap-2 rounded-xl bg-gold/15 px-3 py-2 font-display font-bold uppercase text-gold">
                  <Trophy className="size-4" /> Champion: {getTeam(pro.playoffs.champion).name}
                </div>
              )}
            </div>
          </Panel>
        )}
        <Panel title={`Your schedule · ${rounds} games`}>
          <div className="scrollbar-thin flex max-h-[300px] flex-col gap-1 overflow-y-auto pr-1">
            {mine.map((g) => {
              const home = g.home === pro.teamId
              const opp = getTeam(home ? g.away : g.home)
              const res = g.result
              const my = res ? (home ? res.hs : res.as) : null
              const their = res ? (home ? res.as : res.hs) : null
              return (
                <div key={g.round} className={cx('flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm', g.round === pro.round && pro.phase === 'regular' ? 'bg-blaze/12' : 'bg-white/3')}>
                  <span className="w-7 font-display text-xs font-bold text-white/40">G{g.round + 1}</span>
                  <span className="w-5 text-xs text-white/50">{home ? 'vs' : '@'}</span>
                  <Emblem team={opp} size={20} />
                  <span className="flex-1 truncate">{opp.name}</span>
                  {res ? (
                    <span className={cx('font-display font-bold', my! > their! ? 'text-good' : 'text-bad')}>
                      {my! > their! ? 'W' : 'L'} {my}-{their}
                    </span>
                  ) : (
                    <span className="text-xs text-white/35">—</span>
                  )}
                </div>
              )
            })}
          </div>
        </Panel>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------- stats
function avg(t: StatTotals, k: keyof StatTotals) {
  return t.gp ? (t[k] / t.gp).toFixed(1) : '0.0'
}
function pct(m: number, a: number) {
  return a ? `${((m / a) * 100).toFixed(1)}%` : '—'
}

function StatsTab({ save }: { save: CareerSave }) {
  const [scope, setScope] = useState<'season' | 'career'>(save.pro ? 'season' : 'career')
  const t = scope === 'season' ? save.stats.season : save.stats.career
  const highs = save.stats.highs
  return (
    <div className="grid gap-3 lg:grid-cols-[1.2fr_1fr]">
      <div className="flex flex-col gap-3">
        <Panel title="Averages" action={<Segmented options={[{ value: 'season', label: 'Season' }, { value: 'career', label: 'Career' }]} value={scope} onChange={setScope} />}>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
            <Stat label="GP" value={t.gp} sub={`${t.w}-${t.l}`} />
            <Stat label="PPG" value={avg(t, 'pts')} accent />
            <Stat label="RPG" value={avg(t, 'reb')} />
            <Stat label="APG" value={avg(t, 'ast')} />
            <Stat label="SPG" value={avg(t, 'stl')} />
            <Stat label="BPG" value={avg(t, 'blk')} />
            <Stat label="FG%" value={pct(t.fgm, t.fga)} />
            <Stat label="3P%" value={pct(t.tpm, t.tpa)} />
            <Stat label="Dunks" value={t.dunks} />
            <Stat label="Greens" value={t.greens} />
          </div>
        </Panel>
        <Panel title="Game log">
          {save.stats.log.length === 0 ? (
            <p className="text-sm text-white/50">No games yet. Your first box score will show up here.</p>
          ) : (
            <div className="scrollbar-thin overflow-x-auto">
              <table className="w-full min-w-[440px] text-sm">
                <thead>
                  <tr className="font-display text-[11px] uppercase tracking-wider text-white/45">
                    <th className="py-1 text-left">Game</th>
                    <th className="py-1 text-right">Result</th>
                    <th className="py-1 text-right">PTS</th>
                    <th className="py-1 text-right">REB</th>
                    <th className="py-1 text-right">AST</th>
                    <th className="py-1 text-right">FG</th>
                  </tr>
                </thead>
                <tbody>
                  {save.stats.log.slice(0, 15).map((g) => (
                    <tr key={g.id} className="border-t border-white/5">
                      <td className="max-w-[180px] truncate py-1.5">
                        <span className="text-white/80">{g.opp}</span>
                        {g.simmed && <span className="ml-1 text-[10px] text-white/35">SIM</span>}
                      </td>
                      <td className={cx('py-1.5 text-right font-display font-bold', g.won ? 'text-good' : 'text-bad')}>
                        {g.won ? 'W' : 'L'} {g.score}
                      </td>
                      <td className="py-1.5 text-right font-bold">{g.stats.pts}</td>
                      <td className="py-1.5 text-right">{g.stats.reb}</td>
                      <td className="py-1.5 text-right">{g.stats.ast}</td>
                      <td className="py-1.5 text-right">
                        {g.stats.fgm}/{g.stats.fga}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Panel>
      </div>
      <div className="flex flex-col gap-3">
        <Panel title="Career highs">
          <div className="grid grid-cols-3 gap-3">
            <Stat label="Points" value={highs.pts} />
            <Stat label="Rebounds" value={highs.reb} />
            <Stat label="Assists" value={highs.ast} />
            <Stat label="Steals" value={highs.stl} />
            <Stat label="Blocks" value={highs.blk} />
            <Stat label="Threes" value={highs.tpm} />
          </div>
        </Panel>
        <Panel title={`Trophy case · ${save.trophies.length}`}>
          {save.trophies.length === 0 ? (
            <p className="text-sm text-white/50">Win games, tournaments and awards to fill your trophy case.</p>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {save.trophies.map((t) => (
                <div key={t.id} className={cx('rounded-xl px-3 py-2', t.tier === 'legend' ? 'bg-[#b06cff]/18' : t.tier === 'gold' ? 'bg-gold/14' : t.tier === 'silver' ? 'bg-white/8' : 'bg-[#c07a43]/16')}>
                  <Trophy className={cx('mb-1 size-4', t.tier === 'gold' ? 'text-gold' : t.tier === 'legend' ? 'text-[#c89bff]' : t.tier === 'silver' ? 'text-white/70' : 'text-[#e0a06a]')} />
                  <div className="font-display text-sm font-bold uppercase leading-tight">{t.name}</div>
                  <div className="text-[11px] text-white/50">{t.detail}</div>
                </div>
              ))}
            </div>
          )}
        </Panel>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------- locker
const HAIRS: { id: HairStyle; label: string }[] = [
  { id: 'fade', label: 'Fade' },
  { id: 'buzz', label: 'Buzz' },
  { id: 'waves', label: 'Waves' },
  { id: 'twists', label: 'Twists' },
  { id: 'afro', label: 'Afro' },
  { id: 'hightop', label: 'High Top' },
  { id: 'braids', label: 'Cornrows' },
  { id: 'locs', label: 'Locs' },
  { id: 'bun', label: 'Man Bun' },
  { id: 'bald', label: 'Bald' },
]

function LockerTab({ save }: { save: CareerSave }) {
  const [view, setView] = useState<'shoes' | 'gear' | 'barber'>('shoes')
  const items = useMemo(() => SHOP.filter((s) => (view === 'shoes' ? s.kind === 'shoes' : s.kind !== 'shoes')), [view])
  const equipped = (id: string) => {
    const it = shopItem(id)!
    return it.kind === 'shoes' ? save.inventory.shoes === id : save.inventory[it.kind] === id
  }
  return (
    <div className="flex max-w-[560px] flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Segmented options={[{ value: 'shoes', label: 'Shoes' }, { value: 'gear', label: 'Gear' }, { value: 'barber', label: 'Barber' }]} value={view} onChange={setView} />
        <span className="flex items-center gap-1.5 font-display text-lg font-black italic">
          <Coins className="size-4 text-gold" />
          {formatNum(save.coins)}
        </span>
      </div>
      {view === 'barber' ? (
        <>
          <Panel title="Hairstyle (free)">
            <div className="flex flex-wrap gap-1.5">
              {HAIRS.map((h) => (
                <button
                  key={h.id}
                  onClick={() => {
                    sfx()
                    commitCareer(updateLook(save, { hair: h.id }))
                  }}
                  className={cx('rounded-lg px-3 py-1.5 font-display text-sm font-bold uppercase transition', save.player.appearance.hair === h.id ? 'bg-white text-ink-950' : 'bg-white/8 text-white/75 hover:bg-white/15')}
                >
                  {h.label}
                </button>
              ))}
            </div>
            <div className="mt-3">
              <Swatches colors={HAIR_COLORS} value={save.player.appearance.hairColor} onChange={(c) => commitCareer(updateLook(save, { hairColor: c }))} />
            </div>
          </Panel>
          <Panel title="Facial hair">
            <ChipGroup options={FACIAL_HAIR} value={facialHairOf(save.player.appearance)} onChange={(v) => commitCareer(updateLook(save, facialHairPatch(v)))} />
          </Panel>
        </>
      ) : (
        <div className="grid gap-2">
          {items.map((it) => {
            const owned = save.inventory.owned.includes(it.id)
            const on = owned && equipped(it.id)
            return (
              <div key={it.id} className={cx('glass flex items-center gap-3 rounded-2xl p-3', on && 'ring-1 ring-blaze/60')}>
                <div className="grid size-11 shrink-0 place-items-center rounded-xl" style={{ background: `linear-gradient(135deg, ${it.color}, ${it.accent ?? it.color})` }} />
                <div className="min-w-0 flex-1">
                  <div className="truncate font-display text-[15px] font-bold uppercase">{it.name}</div>
                  <div className={cx('text-[11px]', it.boosts ? 'text-good' : 'text-white/50')}>{it.blurb}</div>
                </div>
                {owned ? (
                  <Button size="sm" variant={on ? 'primary' : 'secondary'} onClick={() => commitCareer(equipItem(save, it.id))}>
                    {on ? (it.kind === 'shoes' ? 'Equipped' : 'Remove') : 'Equip'}
                  </Button>
                ) : (
                  <Button size="sm" variant="gold" disabled={save.coins < it.price} sound="confirm" onClick={() => commitCareer(buyItem(save, it.id))}>
                    {it.price}
                  </Button>
                )}
              </div>
            )
          })}
        </div>
      )}
      <p className="text-xs text-white/45">Your look updates live on the court. Shoe boosts apply in every game.</p>
    </div>
  )
}

// ---------------------------------------------------------------- inbox
function InboxTab({ save }: { save: CareerSave }) {
  useEffect(() => {
    const t = window.setTimeout(() => commitCareer(markInboxRead(save)), 600)
    return () => window.clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <div className="flex max-w-[680px] flex-col gap-2">
      {save.inbox.length === 0 && <p className="text-sm text-white/50">No messages.</p>}
      {save.inbox.map((m) => (
        <div key={m.id} className="glass rounded-2xl p-4">
          <div className="flex items-center gap-2">
            {!m.read && <span className="size-2 rounded-full bg-blaze" />}
            <span className="font-display text-xs font-bold uppercase tracking-wider text-blaze">{m.from}</span>
            <span className="ml-auto text-[11px] text-white/35">{new Date(m.at).toLocaleDateString()}</span>
          </div>
          <div className="mt-0.5 font-display text-lg font-bold uppercase">{m.title}</div>
          <p className="mt-1 text-sm text-white/65">{m.body}</p>
        </div>
      ))}
    </div>
  )
}

export { applyContestResult }
