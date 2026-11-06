import { useMemo, useState, type ReactNode } from 'react'
import { Crosshair, Gamepad2, Settings as SettingsIcon, Trophy, Users, User, Play, Smartphone } from 'lucide-react'
import { getEngine } from '../../game/engine/runtime'
import { DIFFICULTY_LABEL } from '../../game/sim/shooting'
import { RACK_SPOTS } from '../../game/sim/court'
import type { Difficulty, GameMode, PlayerProfile, TeamInfo } from '../../game/types'
import { fullName, shortName } from '../../game/types'
import { ALL_TEAMS, PRO_TEAMS, jerseyFor, teamOvr } from '../../data/teams'
import { overall } from '../../data/attributes'
import { careerOvr, chapterName, effectivePlayer } from '../../data/career'
import { go, updateSettings, useStore, type Screen } from '../../state/store'
import { Arrows, Button, cx, Emblem, OvrBadge, Panel, Pill, ScreenHeader, Segmented, haptic, sfx } from '../kit'
import { ControlsReference, Slider } from '../game/GameScreen'

// ---------------------------------------------------------------- title
export function TitleScreen() {
  const start = () => {
    const e = getEngine()
    e?.audio.unlock()
    e?.commentary.unlock()
    e?.audio.startMusic()
    e?.audio.startCrowd(0.03)
    sfx('confirm')
    haptic(20)
    go({ id: 'menu' })
  }
  return (
    <button onClick={start} className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center outline-none" autoFocus>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(5,7,11,0.25),rgba(5,7,11,0.85)_75%)]" />
      <div className="relative animate-rise">
        <div className="font-display text-[11px] font-bold uppercase tracking-[0.5em] text-white/60 sm:text-sm">Basketball · Career · Contest</div>
        <Logo className="mt-2" size="xl" />
        <div className="mt-3 font-display text-base font-semibold uppercase italic tracking-[0.3em] text-white/75">Build your legacy</div>
      </div>
      <div className="relative mt-10 animate-pulse-soft font-display text-lg font-black uppercase italic tracking-[0.3em] text-white sm:text-xl">Tap to start</div>
      <div className="absolute bottom-[max(env(safe-area-inset-bottom),14px)] flex items-center gap-2 text-xs text-white/45">
        <Smartphone className="size-3.5 rotate-90" /> Best in landscape · sound on
      </div>
    </button>
  )
}

export function Logo({ size = 'md', className }: { size?: 'sm' | 'md' | 'xl'; className?: string }) {
  const s = { sm: 'text-[26px]', md: 'text-[44px]', xl: 'text-[clamp(64px,13vw,150px)]' }[size]
  return (
    <div className={cx('relative select-none font-display font-black uppercase italic leading-[0.82] tracking-tight', s, className)}>
      <span className="block text-white drop-shadow-[0_6px_24px_rgba(0,0,0,0.6)]">Hoop</span>
      <span className="block bg-gradient-to-r from-blaze via-[#ff7a2e] to-gold bg-clip-text pr-[0.08em] text-transparent drop-shadow-[0_6px_24px_rgba(255,91,20,0.35)]">Legacy</span>
    </div>
  )
}

// ---------------------------------------------------------------- main menu
function MenuTile({
  title,
  kicker,
  caption,
  icon,
  accent,
  onClick,
  className,
  children,
  delay = 0,
}: {
  title: string
  kicker?: string
  caption?: string
  icon: ReactNode
  accent: string
  onClick: () => void
  className?: string
  children?: ReactNode
  delay?: number
}) {
  return (
    <button
      data-primary={title === 'My Career' || undefined}
      onClick={() => {
        sfx('confirm')
        haptic(12)
        onClick()
      }}
      style={{ animationDelay: `${delay}ms`, background: `linear-gradient(135deg, ${accent}d9 0%, ${accent}55 38%, rgba(10,14,22,0.92) 78%)` }}
      className={cx(
        'clip-tile group relative flex min-h-[96px] animate-rise flex-col justify-between overflow-hidden px-6 py-3.5 text-left shadow-2xl ring-1 ring-white/10 transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.98]',
        className,
      )}
    >
      <span className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/18 to-transparent opacity-0 group-hover:animate-sweep group-hover:opacity-100" />
      <span className="pointer-events-none absolute -right-3 -bottom-6 font-display text-[110px] font-black uppercase italic leading-none text-white/[0.06]">{title.split(' ')[0]}</span>
      <div className="relative flex items-start justify-between gap-3">
        <div>
          {kicker && <div className="font-display text-[10px] font-bold uppercase tracking-[0.25em] text-white/75">{kicker}</div>}
          <div className="font-display text-[clamp(22px,3.2vw,34px)] font-black uppercase italic leading-none tracking-tight">{title}</div>
        </div>
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-black/25 text-white">{icon}</span>
      </div>
      <div className="relative">
        {children}
        {caption && <div className="text-[13px] text-white/75">{caption}</div>}
      </div>
    </button>
  )
}

export function MainMenu() {
  const slots = useStore((s) => s.slots)
  const career = useStore((s) => s.career)
  const latest = career ?? [...slots].filter(Boolean).sort((a, b) => b!.updatedAt - a!.updatedAt)[0] ?? null
  return (
    <div className="absolute inset-0 z-10 flex flex-col overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink-950/95 via-ink-950/70 to-transparent max-md:bg-gradient-to-t max-md:from-ink-950/95 max-md:via-ink-950/60" />
      <div className="safe-pad relative flex h-full flex-col justify-between gap-3 px-5 py-[max(env(safe-area-inset-top),14px)] sm:px-8 md:max-w-[min(56vw,620px)]">
        <div className="flex items-start justify-between">
          <Logo size="sm" className="animate-rise" />
        </div>
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
          <MenuTile
            className="col-span-2 min-h-[118px]"
            title="My Career"
            kicker={latest ? chapterName(latest.chapter) : 'Story mode'}
            accent="#ff5b14"
            icon={<User className="size-5" />}
            onClick={() => go({ id: 'careerSlots' })}
            delay={60}
          >
            {latest ? (
              <div className="flex items-center gap-3">
                <OvrBadge value={careerOvr(latest)} size="sm" />
                <div className="min-w-0">
                  <div className="truncate font-display text-lg font-bold uppercase">{fullName(latest.player)}</div>
                  <div className="text-xs text-white/70">
                    Level {latest.level} · {latest.player.position} · {latest.stats.career.w}-{latest.stats.career.l}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-[13px] text-white/80">Create a player and start your career.</div>
            )}
          </MenuTile>
          <MenuTile title="Play Now" kicker="1v1 · 3v3" accent="#1d4ed8" icon={<Gamepad2 className="size-5" />} onClick={() => go({ id: 'quick' })} delay={120} />
          <MenuTile title="3PT Contest" accent="#d99a1e" icon={<Crosshair className="size-5" />} onClick={() => go({ id: 'contestSetup' })} delay={180} />
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" icon={<SettingsIcon className="size-4" />} onClick={() => go({ id: 'settings', from: { id: 'menu' } })}>
            Settings
          </Button>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------- quick play
const LENGTHS = [11, 15, 21]
const CLOCKS = [0, 180, 300, 480]

export function QuickPlay({ initialMode }: { initialMode?: GameMode }) {
  const settings = useStore((s) => s.settings)
  const career = useStore((s) => s.career)
  const [mode, setMode] = useState<GameMode>(initialMode ?? '1v1')
  const [ti, setTi] = useState(1)
  const [oi, setOi] = useState(4)
  const [pi, setPi] = useState(0)
  const [opi, setOpi] = useState(0)
  const [useMe, setUseMe] = useState(false)
  const [target, setTarget] = useState(mode === '1v1' ? 11 : 15)
  const [clock, setClock] = useState(300)
  const [diff, setDiff] = useState<Difficulty>(settings.difficulty)
  const teams = ALL_TEAMS
  const t = teams[ti]
  const o = teams[oi === ti ? (oi + 1) % teams.length : oi]
  const me = career ? effectivePlayer(career) : null
  const sortedRoster = (team: TeamInfo) => [...team.roster].sort((a, b) => overall(b.attributes, b.position) - overall(a.attributes, a.position))
  const myRoster = sortedRoster(t)
  const oppRoster = sortedRoster(o)
  const myPlayer = useMe && me ? me : myRoster[pi % myRoster.length]
  const oppPlayer = oppRoster[opi % oppRoster.length]

  const start = () => {
    updateSettings({ difficulty: diff })
    const myPlayers = mode === '1v1' ? [myPlayer] : useMe && me ? [me, ...myRoster.slice(0, 2)] : myRoster.slice(0, 3)
    const oppPlayers = mode === '1v1' ? [oppPlayer] : oppRoster.slice(0, 3)
    go({
      id: 'game',
      session: {
        kind: 'match',
        origin: 'quick',
        config: {
          mode,
          sides: [
            { team: t, players: myPlayers, jersey: jerseyFor(t, true), human: true },
            { team: o, players: oppPlayers, jersey: jerseyFor(o, false), human: false },
          ],
          targetScore: target,
          timeLimit: clock,
          shotClock: 12,
          difficulty: diff,
          courtTeam: t,
          label: mode === '1v1' ? '1-ON-1 · QUICK PLAY' : '3-ON-3 · QUICK PLAY',
          focusPlayerId: myPlayers[0].id,
        },
      },
    })
  }

  return (
    <div className="absolute inset-0 z-10 flex flex-col bg-gradient-to-r from-ink-950/95 via-ink-950/80 to-ink-950/30">
      <ScreenHeader title="Play Now" kicker="Quick game" onBack={() => go({ id: 'menu' })} right={<Segmented options={[{ value: '1v1', label: '1v1' }, { value: '3v3', label: '3v3' }]} value={mode} onChange={(m) => { setMode(m); setTarget(m === '1v1' ? 11 : 15) }} />} />
      <div className="scrollbar-thin safe-pad min-h-0 flex-1 overflow-y-auto px-4 pb-4 sm:px-6">
        <div className="grid gap-3 lg:max-w-[920px] lg:grid-cols-[1fr_auto_1fr]">
          <TeamPicker label="Your team" team={t} onPrev={() => setTi((ti + teams.length - 1) % teams.length)} onNext={() => setTi((ti + 1) % teams.length)}>
            {mode === '1v1' ? (
              me && useMe ? (
                <PlayerLine p={me} tag="My Player" />
              ) : (
                <Arrows onPrev={() => setPi((pi + myRoster.length - 1) % myRoster.length)} onNext={() => setPi((pi + 1) % myRoster.length)}>
                  <PlayerLine p={myPlayer} />
                </Arrows>
              )
            ) : (
              <div className="flex flex-col gap-1">
                {(useMe && me ? [me, ...myRoster.slice(0, 2)] : myRoster.slice(0, 3)).map((p) => (
                  <PlayerLine key={p.id} p={p} compact tag={p.id === 'me' ? 'You' : undefined} />
                ))}
              </div>
            )}
            {me && (
              <label className="mt-2 flex cursor-pointer items-center gap-2 text-sm text-white/75">
                <input type="checkbox" checked={useMe} onChange={(e) => setUseMe(e.target.checked)} className="size-4 accent-[#ff5b14]" />
                Play as my career player ({shortName(me)})
              </label>
            )}
          </TeamPicker>
          <div className="grid place-items-center font-display text-3xl font-black italic text-white/40">VS</div>
          <TeamPicker label="Opponent" team={o} onPrev={() => setOi((oi + teams.length - 1) % teams.length)} onNext={() => setOi((oi + 1) % teams.length)}>
            {mode === '1v1' ? (
              <Arrows onPrev={() => setOpi((opi + oppRoster.length - 1) % oppRoster.length)} onNext={() => setOpi((opi + 1) % oppRoster.length)}>
                <PlayerLine p={oppPlayer} />
              </Arrows>
            ) : (
              <div className="flex flex-col gap-1">
                {oppRoster.slice(0, 3).map((p) => (
                  <PlayerLine key={p.id} p={p} compact />
                ))}
              </div>
            )}
          </TeamPicker>
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:max-w-[920px]">
          <Panel title="Difficulty">
            <Segmented className="w-full" options={(['rookie', 'pro', 'allstar', 'superstar', 'hof'] as Difficulty[]).map((d) => ({ value: d, label: DIFFICULTY_LABEL[d].replace('Hall of Fame', 'HOF') }))} value={diff} onChange={setDiff} />
          </Panel>
          <Panel title="Game length">
            <div className="flex flex-wrap gap-2">
              <Segmented options={LENGTHS.map((l) => ({ value: l, label: `To ${l}` }))} value={target} onChange={setTarget} />
              <Segmented options={CLOCKS.map((c) => ({ value: c, label: c ? `${c / 60}:00` : 'No clock' }))} value={clock} onChange={setClock} />
            </div>
          </Panel>
        </div>
      </div>
      <div className="safe-pad flex shrink-0 items-center justify-between gap-3 border-t border-white/8 bg-ink-950/70 px-4 py-3 backdrop-blur sm:px-6">
        <div className="hidden text-sm text-white/55 sm:block">Scoring: 2s & 3s · 12-second shot clock · Loser's ball after every make</div>
        <Button variant="primary" size="lg" icon={<Play className="size-5" />} sound="confirm" onClick={start} className="ml-auto">
          Tip Off
        </Button>
      </div>
    </div>
  )
}

function TeamPicker({ label, team, onPrev, onNext, children }: { label: string; team: TeamInfo; onPrev: () => void; onNext: () => void; children: ReactNode }) {
  return (
    <div className="glass relative overflow-hidden rounded-2xl p-4" style={{ boxShadow: `inset 4px 0 0 ${team.primary}` }}>
      <div className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full opacity-30 blur-3xl" style={{ background: team.primary }} />
      <div className="relative mb-3 font-display text-[10px] font-bold uppercase tracking-[0.25em] text-white/55">{label}</div>
      <Arrows onPrev={onPrev} onNext={onNext}>
        <div className="flex items-center gap-3">
          <Emblem team={team} size={52} />
          <div className="min-w-0">
            <div className="truncate font-display text-[11px] font-bold uppercase tracking-[0.2em] text-white/55">{team.city}</div>
            <div className="truncate font-display text-2xl font-black uppercase italic leading-none">{team.name}</div>
            <div className="mt-0.5 text-xs text-white/50">{team.tier === 'pro' ? 'Pro Hoops League' : 'Street circuit'} · Team OVR {teamOvr(team)}</div>
          </div>
        </div>
      </Arrows>
      <div className="relative mt-3">{children}</div>
    </div>
  )
}

function PlayerLine({ p, compact, tag }: { p: PlayerProfile; compact?: boolean; tag?: string }) {
  const ovr = overall(p.attributes, p.position)
  return (
    <div className={cx('flex items-center gap-2.5 rounded-xl bg-white/5', compact ? 'px-2 py-1.5' : 'px-3 py-2')}>
      <OvrBadge value={ovr} size="sm" />
      <div className="min-w-0 flex-1">
        <div className="truncate font-display text-[15px] font-bold uppercase">
          {fullName(p)} {tag && <Pill tone="blaze" className="ml-1 align-middle">{tag}</Pill>}
        </div>
        <div className="text-[11px] text-white/50">
          #{p.number} · {p.position} · 3PT {p.attributes.three} · DNK {p.attributes.dunk} · HND {p.attributes.handles}
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------- contest setup
export function ContestSetup() {
  const settings = useStore((s) => s.settings)
  const career = useStore((s) => s.career)
  const records = useStore((s) => s.records)
  const shooters = useMemo(() => {
    const all = PRO_TEAMS.flatMap((t) => t.roster.map((p) => ({ p, team: t })))
    return all.sort((a, b) => b.p.attributes.three - a.p.attributes.three).slice(0, 10)
  }, [])
  const me = career ? effectivePlayer(career) : null
  const options = [...(me ? [{ p: me, team: null as TeamInfo | null }] : []), ...shooters]
  const [si, setSi] = useState(0)
  const [rack, setRack] = useState(2)
  const [format, setFormat] = useState<'solo' | 'full'>('full')
  const [diff, setDiff] = useState<Difficulty>(settings.difficulty)
  const chosen = options[si]
  const start = () => {
    const rivals = shooters.filter((s) => s.p.id !== chosen.p.id).slice(0, 5).map((s) => s.p)
    const team = chosen.team ?? PRO_TEAMS[0]
    go({
      id: 'game',
      session: {
        kind: 'contest',
        origin: 'quick',
        jersey: chosen.team ? jerseyFor(chosen.team, false) : { base: '#1b1d22', trim: '#ff5b14', number: '#ffffff', shorts: '#1b1d22' },
        config: {
          shooters: format === 'full' ? [chosen.p, ...rivals] : [chosen.p],
          humanIndex: 0,
          moneyRack: rack,
          rounds: format === 'full' ? 2 : 1,
          duration: 60,
          racks: 5,
          courtTeam: team,
          label: format === 'full' ? '3-POINT CONTEST' : 'SCORE ATTACK',
          difficulty: diff,
        },
      },
    })
  }
  return (
    <div className="absolute inset-0 z-10 flex flex-col bg-gradient-to-r from-ink-950/95 via-ink-950/80 to-ink-950/30">
      <ScreenHeader title="3PT Contest" kicker="All-Star Saturday" onBack={() => go({ id: 'menu' })} right={records.contestBest > 0 ? <Pill tone="gold">Best {records.contestBest}</Pill> : undefined} />
      <div className="scrollbar-thin safe-pad min-h-0 flex-1 overflow-y-auto px-4 pb-4 sm:px-6">
        <div className="grid gap-3 lg:max-w-[920px] lg:grid-cols-2">
          <Panel title="Format">
            <Segmented className="w-full" options={[{ value: 'full', label: 'Full contest' }, { value: 'solo', label: 'Score attack' }]} value={format} onChange={setFormat} />
            <p className="mt-2 text-sm text-white/55">{format === 'full' ? 'Face five of the league’s best shooters. Top three reach the Final Round.' : 'One 60-second round. Chase your personal best.'}</p>
          </Panel>
          <Panel title="Timing window">
            <Segmented className="w-full" options={(['rookie', 'pro', 'allstar', 'superstar', 'hof'] as Difficulty[]).map((d) => ({ value: d, label: DIFFICULTY_LABEL[d].replace('Hall of Fame', 'HOF') }))} value={diff} onChange={setDiff} />
          </Panel>
          <Panel title="Shooter">
            <Arrows onPrev={() => setSi((si + options.length - 1) % options.length)} onNext={() => setSi((si + 1) % options.length)}>
              <div className="flex items-center gap-3">
                {chosen.team ? <Emblem team={chosen.team} size={44} /> : <div className="grid size-11 place-items-center rounded-full bg-blaze/20 font-display text-sm font-black text-blaze">YOU</div>}
                <div className="min-w-0">
                  <div className="truncate font-display text-xl font-black uppercase italic leading-none">{fullName(chosen.p)}</div>
                  <div className="mt-0.5 text-xs text-white/55">
                    3PT {chosen.p.attributes.three} · MID {chosen.p.attributes.mid} {chosen.team ? `· ${chosen.team.city} ${chosen.team.name}` : '· Career player'}
                  </div>
                </div>
              </div>
            </Arrows>
          </Panel>
          <Panel title="Money rack (all balls worth 2)">
            <div className="relative mx-auto h-[118px] w-full max-w-[340px]">
              <svg viewBox="0 0 340 118" className="absolute inset-0 h-full w-full">
                <path d="M20 8 L20 40 A150 150 0 0 0 320 40 L320 8" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2" />
                <rect x="130" y="4" width="80" height="58" fill="rgba(255,91,20,0.12)" stroke="rgba(255,255,255,0.25)" />
                <circle cx="170" cy="18" r="7" fill="none" stroke="#ff5b14" strokeWidth="2" />
              </svg>
              {RACK_SPOTS.map((s, i) => {
                const pos = [
                  { l: '4%', t: '18%' },
                  { l: '18%', t: '66%' },
                  { l: '50%', t: '86%' },
                  { l: '82%', t: '66%' },
                  { l: '96%', t: '18%' },
                ][i]
                return (
                  <button
                    key={s.label}
                    aria-label={s.label}
                    onClick={() => {
                      sfx()
                      setRack(i)
                    }}
                    className={cx('absolute grid size-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 font-display text-xs font-black transition', rack === i ? 'scale-110 border-gold bg-gold text-ink-950' : 'border-white/40 bg-ink-900 text-white/70 hover:border-white')}
                    style={{ left: pos.l, top: pos.t }}
                  >
                    {i + 1}
                  </button>
                )
              })}
            </div>
            <div className="text-center font-display text-sm font-bold uppercase tracking-wider text-gold">{RACK_SPOTS[rack].label}</div>
          </Panel>
        </div>
      </div>
      <div className="safe-pad flex shrink-0 items-center justify-end gap-3 border-t border-white/8 bg-ink-950/70 px-4 py-3 backdrop-blur sm:px-6">
        <Button variant="primary" size="lg" icon={<Trophy className="size-5" />} sound="confirm" onClick={start}>
          Start Contest
        </Button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------- settings
export function SettingsScreen({ from }: { from: Screen }) {
  const s = useStore((st) => st.settings)
  const [showControls, setShowControls] = useState(false)
  const Row = ({ label, children, note }: { label: string; children: ReactNode; note?: string }) => (
    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-2.5">
      <div>
        <div className="font-display text-[15px] font-bold uppercase tracking-wide">{label}</div>
        {note && <div className="text-xs text-white/45">{note}</div>}
      </div>
      {children}
    </div>
  )
  return (
    <div className="absolute inset-0 z-10 flex flex-col bg-gradient-to-r from-ink-950/95 via-ink-950/85 to-ink-950/40">
      <ScreenHeader title="Settings" onBack={() => go(from)} />
      <div className="scrollbar-thin safe-pad min-h-0 flex-1 overflow-y-auto px-4 pb-6 sm:px-6">
        <div className="grid gap-3 lg:max-w-[920px] lg:grid-cols-2">
          <Panel title="Graphics">
            <div className="divide-y divide-white/6">
              <Row label="Quality" note="Auto adapts to your device's frame rate">
                <Segmented options={[{ value: 'auto', label: 'Auto' }, { value: 'low', label: 'Low' }, { value: 'medium', label: 'Med' }, { value: 'high', label: 'High' }]} value={s.quality} onChange={(v) => updateSettings({ quality: v })} />
              </Row>
              <Row label="Resolution" note="Lower for longer battery life">
                <Segmented options={[{ value: 0.75, label: '75%' }, { value: 1, label: '100%' }]} value={s.resolution} onChange={(v) => updateSettings({ resolution: v })} />
              </Row>
              <Row label="Camera" note="Broadcast, a tighter 2K-style cam, or a high tactical view">
                <Segmented options={[{ value: 'broadcast', label: 'Broadcast' }, { value: 'close', label: 'Close' }, { value: 'high', label: 'High' }]} value={s.camera} onChange={(v) => updateSettings({ camera: v })} />
              </Row>
              <Row label="Camera shake">
                <Segmented options={[{ value: 'on', label: 'On' }, { value: 'off', label: 'Off' }]} value={s.shake ? 'on' : 'off'} onChange={(v) => updateSettings({ shake: v === 'on' })} />
              </Row>
            </div>
          </Panel>
          <Panel title="Audio">
            <div className="flex flex-col gap-3 py-1">
              <Slider label="Sound effects" value={s.sfx} onChange={(v) => updateSettings({ sfx: v })} />
              <Slider label="Crowd" value={s.crowd} onChange={(v) => updateSettings({ crowd: v })} />
              <Slider label="Music" value={s.music} onChange={(v) => updateSettings({ music: v })} />
              <Slider label="Commentary" value={s.commentary} onChange={(v) => updateSettings({ commentary: v })} />
              <div className="flex items-center justify-between gap-3">
                <span className="font-display text-sm font-bold uppercase tracking-wide text-white/70">Captions</span>
                <Segmented options={[{ value: 'on', label: 'On' }, { value: 'off', label: 'Off' }]} value={s.captions ? 'on' : 'off'} onChange={(v) => updateSettings({ captions: v === 'on' })} />
              </div>
            </div>
          </Panel>
          <Panel title="Gameplay">
            <div className="divide-y divide-white/6">
              <Row label="Default difficulty">
                <Segmented options={(['rookie', 'pro', 'allstar', 'superstar', 'hof'] as Difficulty[]).map((d) => ({ value: d, label: DIFFICULTY_LABEL[d].replace('Hall of Fame', 'HOF') }))} value={s.difficulty} onChange={(v) => updateSettings({ difficulty: v })} />
              </Row>
              <Row label="Left-handed layout" note="Swap joystick and buttons">
                <Segmented options={[{ value: 'off', label: 'Off' }, { value: 'on', label: 'On' }]} value={s.leftHanded ? 'on' : 'off'} onChange={(v) => updateSettings({ leftHanded: v === 'on' })} />
              </Row>
              <Row label="Vibration">
                <Segmented options={[{ value: 'on', label: 'On' }, { value: 'off', label: 'Off' }]} value={s.vibration ? 'on' : 'off'} onChange={(v) => updateSettings({ vibration: v === 'on' })} />
              </Row>
              <Row label="Keyboard hints">
                <Segmented options={[{ value: 'on', label: 'On' }, { value: 'off', label: 'Off' }]} value={s.hints ? 'on' : 'off'} onChange={(v) => updateSettings({ hints: v === 'on' })} />
              </Row>
            </div>
          </Panel>
          <Panel title="Controls" action={<Button size="sm" icon={<Users className="size-4" />} onClick={() => setShowControls((v) => !v)}>{showControls ? 'Hide' : 'Show'}</Button>}>
            {showControls ? <ControlsReference mode="match" threes /> : <p className="text-sm text-white/55">One joystick and three context buttons. Hold Shoot and release at the top of the meter for a green release.</p>}
          </Panel>
        </div>
      </div>
    </div>
  )
}
