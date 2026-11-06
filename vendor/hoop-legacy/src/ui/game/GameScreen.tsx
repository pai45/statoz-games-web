import { useEffect, useMemo, useRef, useState } from 'react'
import { Keyboard, Pause, Play, RotateCcw, Settings2, LogOut, Volume2, Smartphone } from 'lucide-react'
import { getEngine } from '../../game/engine/runtime'
import { Match, formatClock, type MatchHud, type MatchPhase, type MoveName } from '../../game/sim/Match'
import type { StatCard } from '../../game/sim/director'
import { Contest, simulateContest, type ContestHud } from '../../game/sim/Contest'
import { RACK_SPOTS } from '../../game/sim/court'
import type { ContestResult, ContestRoundScore, MatchResult, TeamInfo } from '../../game/types'
import { shortName } from '../../game/types'
import { applyContestResult, applyMatchResult } from '../../data/career'
import { commitCareer, go, store, updateRecords, updateSettings, useStore, type Session } from '../../state/store'
import { Button, cx, Emblem, Modal, Segmented, haptic } from '../kit'
import { ActionCluster, ICONS, Joystick, type ButtonSpec } from './TouchControls'
import { FeedbackLayer, Marker, PassMarker, ScoreBug, ShotMeter } from './HudParts'
import { CaptionBar, FreeThrowBanner, LineupCard, StatLowerThird } from './Broadcast'

/** What the move button says, from where the stick points (see Match.moveFor). */
const MOVE_LABEL: Record<MoveName, string> = { crossover: 'Cross', behind: 'Behind', spin: 'Spin', stepback: 'Step-back', hesi: 'Hesi' }
import { useEngine, useFeedback, useGameSession, useInterval, useTouchMode } from './hooks'

export function GameScreen({ session }: { session: Session }) {
  return session.kind === 'match' ? <MatchView session={session} /> : <ContestView session={session} />
}

function finishToResults(session: Session, result: MatchResult) {
  const st = store.get()
  if (session.origin === 'career' && st.career && session.eventId) {
    const { save, rewards } = applyMatchResult(st.career, session.eventId, result)
    commitCareer(save)
    go({ id: 'results', session, result, rewards })
  } else {
    const humanSide = session.kind === 'match' ? (session.config.sides[0].human ? 0 : 1) : 0
    const won = result.winner === humanSide
    updateRecords(won ? { quickWins: st.records.quickWins + 1 } : { quickLosses: st.records.quickLosses + 1 })
    go({ id: 'results', session, result })
  }
}

function MatchView({ session }: { session: Extract<Session, { kind: 'match' }> }) {
  const cfg = session.config
  const [match, setMatch] = useState<Match | null>(null)
  const [phase, setPhase] = useState<MatchPhase>('intro')
  const [phaseInfo, setPhaseInfo] = useState('')
  const [paused, setPaused] = useState(false)
  const [items, push] = useFeedback()
  const [tick, setTick] = useState(0)
  const [restartKey, setRestartKey] = useState(0)
  const touch = useTouchMode()
  const settings = useStore((s) => s.settings)
  const hudRef = useRef<MatchHud | null>(null)
  const engine = useEngine()
  const [card, setCard] = useState<StatCard | null>(null)
  const cardTimer = useRef<number | null>(null)

  useEffect(() => {
    if (!engine) return
    const m = new Match(engine, cfg, {
      onFeedback: (t, k, s) => {
        push(t, k, s)
        if (k === 'green' || k === 'big') haptic(28)
      },
      onPhase: (p, info) => {
        setPhase(p)
        setPhaseInfo(info ?? '')
      },
      onGameOver: (result) => finishToResults(session, result),
      onStat: (c) => {
        setCard(c)
        if (cardTimer.current !== null) window.clearTimeout(cardTimer.current)
        cardTimer.current = window.setTimeout(() => setCard(null), 3800)
      },
    })
    engine.setMode(m)
    if (import.meta.env.DEV) (window as unknown as { __match?: Match }).__match = m
    hudRef.current = m.hud
    setMatch(m)
    setPhase('intro')
    engine.input.onPause = () => setPaused((p) => !p)
    engine.input.gameActive = true
    return () => {
      engine.input.onPause = undefined
      engine.input.gameActive = false
      engine.paused = false
      if (cardTimer.current !== null) window.clearTimeout(cardTimer.current)
      setCard(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, restartKey, engine])

  useEffect(() => {
    const e = getEngine()
    if (!e) return
    e.paused = paused
    e.input.setEnabled(!paused)
    // the booth goes quiet while the game is paused
    if (paused) e.commentary.stop()
  }, [paused])

  useInterval(() => setTick((t) => t + 1), 120)
  void tick
  useGameSession(() => setPaused(true))

  const hud = hudRef.current
  const [home, away] = cfg.sides
  const humanTeam = cfg.sides[0].human ? 0 : cfg.sides[1].human ? 1 : null
  const offense = hud ? hud.offense && !hud.looseBall : true
  const loose = hud?.looseBall ?? false
  const threes = cfg.mode === '3v3'
  const specs: { primary: ButtonSpec; second?: ButtonSpec; third?: ButtonSpec } = useMemo(() => {
    if (loose) {
      return {
        primary: { action: 'shoot', label: 'Jump', icon: ICONS.jump, size: 'xl', tone: 'blaze' },
        second: { action: 'pass', label: 'Switch', icon: ICONS.switch, size: 'md', hidden: !threes },
      }
    }
    if (offense) {
      return {
        primary: { action: 'shoot', label: 'Shoot', icon: ICONS.shoot, size: 'xl', tone: 'blaze' },
        second: { action: 'pass', label: 'Pass', icon: ICONS.pass, size: 'md', hidden: !threes, tone: 'sky' },
        third: { action: 'skill', label: 'Move', icon: ICONS.move, size: 'md', live: () => MOVE_LABEL[hudRef.current?.moveHint ?? 'crossover'] },
      }
    }
    return {
      primary: { action: 'shoot', label: 'Block', icon: ICONS.block, size: 'xl', tone: 'blaze' },
      second: { action: 'pass', label: 'Switch', icon: ICONS.switch, size: 'md', hidden: !threes },
      third: { action: 'skill', label: 'Steal', icon: ICONS.steal, size: 'md' },
    }
  }, [offense, loose, threes])

  const clock = hud ? (cfg.timeLimit > 0 ? (hud.overtime ? 'OT' : formatClock(hud.gameClock)) : `TO ${cfg.targetScore}`) : ''
  const shotClock = hud && cfg.shotClock > 0 && (phase === 'live' || phase === 'check') ? String(Math.ceil(hud.shotClock)) : ''
  const score = hud ? hud.score : ([0, 0] as [number, number])

  const quit = () => {
    setPaused(false)
    go(session.origin === 'career' ? { id: 'career', tab: 'home' } : { id: 'quick', mode: cfg.mode })
  }

  return (
    <div className="absolute inset-0 touch-none select-none overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.55)_100%)]" />
      {phase !== 'intro' && phase !== 'over' && (
        <ScoreBug home={home.team} away={away.team} score={score} clock={clock} shotClock={shotClock} possession={hud ? hud.possession : null} label={cfg.label} fire={hud?.fire} />
      )}
      {phase !== 'replay' && phase !== 'intro' && (
        <>
          <Marker src={hud} />
          <PassMarker src={hud} />
          <ShotMeter hud={hud} />
        </>
      )}
      <FeedbackLayer items={items} />
      {card && phase !== 'replay' && phase !== 'intro' && phase !== 'over' && <StatLowerThird card={card} touch={touch} />}
      {phase === 'freethrow' && hud?.ft.active && <FreeThrowBanner ft={hud.ft} touch={touch} />}
      <CaptionBar touch={touch} />

      {phase === 'intro' && !hud?.intro && <IntroCard session={session} onSkip={() => match?.skipIntro()} />}
      {phase === 'intro' && hud?.intro && (
        <button type="button" aria-label="Skip introductions" className="absolute inset-0 z-30 cursor-pointer" onClick={() => match?.skipIntro()}>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent" />
          <LineupCard card={hud.intro} team={cfg.sides[hud.intro.team].team} />
          <div className="pointer-events-none absolute right-[max(env(safe-area-inset-right),20px)] top-[max(env(safe-area-inset-top),16px)] rounded-full bg-black/55 px-3 py-1 font-display text-[11px] font-bold uppercase tracking-[0.25em] text-white/70 backdrop-blur">
            Starting lineups · tap to skip
          </div>
        </button>
      )}
      {phase === 'replay' && <ReplayOverlay info={phaseInfo} touch={touch} onSkip={() => match?.skipReplay()} />}
      {touch && <RotateHint />}
      {phase === 'check' && hud?.offense && <Banner tone="sky">Check ball — move to start</Banner>}
      {phase === 'live' && hud?.mustClear && hud.offense && <Banner tone="gold">Clear the ball past the arc</Banner>}
      {phase === 'over' && (
        <div className="pointer-events-none absolute inset-x-0 top-[22%] z-20 flex animate-pop flex-col items-center">
          <div className="font-display text-[clamp(44px,10vw,96px)] font-black uppercase italic leading-none text-white drop-shadow-2xl">Final</div>
          <div className="mt-2 flex items-center gap-4 font-display text-4xl font-black italic">
            <Emblem team={home.team} size={44} />
            <span className={score[0] > score[1] ? 'text-gold' : 'text-white/70'}>{score[0]}</span>
            <span className="text-white/40">–</span>
            <span className={score[1] > score[0] ? 'text-gold' : 'text-white/70'}>{score[1]}</span>
            <Emblem team={away.team} size={44} />
          </div>
        </div>
      )}

      {humanTeam !== null && phase !== 'over' && phase !== 'replay' && phase !== 'freethrow' && (
        <>
          {touch && phase !== 'intro' && (
            <>
              <Joystick left={!settings.leftHanded} />
              <ActionCluster specs={specs} left={settings.leftHanded} />
            </>
          )}
          {!touch && settings.hints && phase !== 'intro' && <KeyHints offense={offense} loose={loose} threes={threes} move={hud ? MOVE_LABEL[hud.moveHint] : 'Cross'} />}
        </>
      )}
      {phase === 'freethrow' && hud?.ft.active && hud.ft.human && touch && (
        <ActionCluster specs={{ primary: { action: 'shoot', label: 'Shoot', icon: ICONS.shoot, size: 'xl', tone: 'blaze' } }} left={settings.leftHanded} />
      )}

      <button
        aria-label="Pause"
        onClick={() => setPaused(true)}
        className="absolute left-[max(env(safe-area-inset-left),12px)] top-[max(env(safe-area-inset-top),10px)] z-40 grid size-11 place-items-center rounded-full bg-black/45 text-white/85 backdrop-blur hover:bg-black/65"
      >
        <Pause className="size-4" />
      </button>

      <PauseMenu
        open={paused}
        onResume={() => setPaused(false)}
        onRestart={
          session.origin === 'quick'
            ? () => {
                setPaused(false)
                setRestartKey((k) => k + 1)
              }
            : undefined
        }
        onQuit={quit}
        quitLabel={session.origin === 'career' ? 'Quit to Career Hub' : 'Quit to Setup'}
        quitNote={session.origin === 'career' ? 'Progress for this game will not be saved. You can replay it from the hub.' : undefined}
        mode="match"
        threes={threes}
      />
    </div>
  )
}

/** Broadcast instant-replay dressing: letterbox, REPLAY bug with the play and scorer, skip hint. */
function ReplayOverlay({ info, touch, onSkip }: { info: string; touch: boolean; onSkip: () => void }) {
  const [play, who] = info.split('|')
  return (
    <button type="button" aria-label="Skip replay" onClick={onSkip} className="absolute inset-0 z-30 cursor-pointer">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[9%] origin-top animate-letterbox bg-black" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[9%] origin-bottom animate-letterbox bg-black" />
      <div className="pointer-events-none absolute left-[max(env(safe-area-inset-left),72px)] top-[calc(9%+12px)] flex animate-pop items-stretch overflow-hidden rounded-md shadow-2xl shadow-black/60">
        <div className="flex items-center gap-2 bg-blaze px-3 py-1.5 font-display text-lg font-black uppercase italic tracking-wide text-white">
          <span className="size-2 animate-pulse rounded-full bg-white" />
          Replay
        </div>
        <div className="flex flex-col justify-center bg-ink-950/80 px-3 py-1 text-left leading-tight backdrop-blur">
          <span className="font-display text-sm font-black uppercase italic text-white">{play}</span>
          {who && <span className="text-[11px] font-semibold uppercase tracking-wider text-white/60">{who}</span>}
        </div>
      </div>
      <div className="pointer-events-none absolute bottom-[calc(9%+12px)] right-[max(env(safe-area-inset-right),20px)] animate-fade rounded-full bg-black/55 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white/70 backdrop-blur">
        {touch ? 'Tap to skip' : 'Click or press shoot to skip'}
      </div>
    </button>
  )
}

function RotateHint() {
  const [show, setShow] = useState(() => window.innerHeight > window.innerWidth)
  useEffect(() => {
    const t = window.setTimeout(() => setShow(false), 5000)
    const on = () => {
      if (window.innerWidth > window.innerHeight) setShow(false)
    }
    window.addEventListener('resize', on)
    return () => {
      window.clearTimeout(t)
      window.removeEventListener('resize', on)
    }
  }, [])
  if (!show) return null
  return (
    <button onClick={() => setShow(false)} className="absolute inset-x-4 top-[calc(max(env(safe-area-inset-top),8px)+78px)] z-30 flex animate-rise items-center gap-3 rounded-2xl bg-ink-950/85 px-4 py-3 text-left backdrop-blur">
      <Smartphone className="size-6 shrink-0 rotate-90 text-blaze" />
      <span className="text-sm text-white/85">Rotate your phone to landscape for the full-court view. Tap to dismiss.</span>
    </button>
  )
}

function Banner({ children, tone }: { children: React.ReactNode; tone: 'sky' | 'gold' }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-[calc(max(env(safe-area-inset-top),8px)+72px)] z-20 flex justify-center">
      <div className={cx('clip-skew animate-pulse-soft px-5 py-1.5 font-display text-sm font-black uppercase italic tracking-wider', tone === 'sky' ? 'bg-sky/85 text-ink-950' : 'bg-gold text-ink-950')}>{children}</div>
    </div>
  )
}

function IntroCard({ session, onSkip }: { session: Extract<Session, { kind: 'match' }>; onSkip: () => void }) {
  const [a, b] = session.config.sides
  return (
    <button className="absolute inset-0 z-30 flex flex-col items-center justify-end pb-[12dvh] text-left" onClick={onSkip}>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
      <div className="relative w-[min(760px,92vw)] animate-rise">
        <div className="mb-2 text-center font-display text-xs font-bold uppercase tracking-[0.35em] text-blaze">{session.config.label}</div>
        <div className="flex items-center justify-between gap-3">
          <TeamSide team={a.team} players={a.players.map((p) => shortName(p))} />
          <div className="font-display text-3xl font-black italic text-white/50">VS</div>
          <TeamSide team={b.team} players={b.players.map((p) => shortName(p))} right />
        </div>
        <div className="mt-4 text-center font-display text-[11px] font-semibold uppercase tracking-[0.3em] text-white/55 animate-pulse-soft">Tap to skip</div>
      </div>
    </button>
  )
}

function TeamSide({ team, players, right }: { team: TeamInfo; players: string[]; right?: boolean }) {
  return (
    <div className={cx('flex min-w-0 flex-1 items-center gap-3', right && 'flex-row-reverse text-right')}>
      <Emblem team={team} size={64} />
      <div className="min-w-0">
        <div className="truncate font-display text-[11px] font-bold uppercase tracking-[0.2em] text-white/60">{team.city}</div>
        <div className="truncate font-display text-[clamp(22px,4vw,36px)] font-black uppercase italic leading-none">{team.name}</div>
        <div className="mt-1 truncate text-xs text-white/60">{players.join(' · ')}</div>
      </div>
    </div>
  )
}

function KeyHints({ offense, loose, threes, move }: { offense: boolean; loose: boolean; threes: boolean; move: string }) {
  const k = (key: string, label: string) => (
    <span className="flex items-center gap-1.5">
      <kbd className="rounded-md border border-white/25 bg-white/10 px-1.5 py-0.5 font-sans text-[11px] font-semibold">{key}</kbd>
      <span className="text-white/70">{label}</span>
    </span>
  )
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-3 z-20 flex justify-center">
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 rounded-xl bg-black/50 px-4 py-2 font-display text-xs uppercase tracking-wide backdrop-blur">
        {k('WASD', 'Move')}
        {k('Shift', 'Sprint')}
        {loose ? k('Space', 'Jump') : offense ? k('Space', 'Hold shoot · tap fake') : k('Space', 'Block')}
        {threes && k('K', loose || !offense ? 'Switch' : 'Pass')}
        {!loose && k('L', offense ? `Move: ${move}` : 'Steal')}
        {k('Esc', 'Pause')}
      </div>
    </div>
  )
}

export function PauseMenu({
  open,
  onResume,
  onRestart,
  onQuit,
  quitLabel,
  quitNote,
  mode,
  threes,
}: {
  open: boolean
  onResume: () => void
  onRestart?: () => void
  onQuit: () => void
  quitLabel: string
  quitNote?: string
  mode: 'match' | 'contest'
  threes?: boolean
}) {
  const [tab, setTab] = useState<'main' | 'controls' | 'audio'>('main')
  const settings = useStore((s) => s.settings)
  useEffect(() => {
    if (open) setTab('main')
  }, [open])
  if (!open) return null
  return (
    <Modal open={open} onClose={onResume} title="Paused">
      {tab === 'main' && (
        <div className="flex flex-col gap-2.5">
          <Button variant="primary" size="lg" icon={<Play className="size-5" />} onClick={onResume} autoFocus>
            Resume
          </Button>
          <Button icon={<Keyboard className="size-4" />} onClick={() => setTab('controls')}>
            Help
          </Button>
          <Button icon={<Volume2 className="size-4" />} onClick={() => setTab('audio')}>
            Settings
          </Button>
          <Button variant="ghost" icon={<LogOut className="size-4" />} onClick={onQuit}>
            {quitLabel}
          </Button>
          {quitNote && <p className="text-center text-xs text-white/45">{quitNote}</p>}
        </div>
      )}
      {tab === 'controls' && <ControlsReference mode={mode} threes={threes} onBack={() => setTab('main')} />}
      {tab === 'audio' && (
        <div className="flex flex-col gap-4">
          {onRestart && <Button icon={<RotateCcw className="size-4" />} onClick={onRestart}>Restart</Button>}
          <Slider label="Sound effects" value={settings.sfx} onChange={(v) => updateSettings({ sfx: v })} />
          <Slider label="Crowd" value={settings.crowd} onChange={(v) => updateSettings({ crowd: v })} />
          <Slider label="Music" value={settings.music} onChange={(v) => updateSettings({ music: v })} />
          <Slider label="Commentary" value={settings.commentary} onChange={(v) => updateSettings({ commentary: v })} />
          <div className="flex items-center justify-between gap-3">
            <span className="font-display text-sm font-bold uppercase tracking-wide text-white/70">Captions</span>
            <Segmented options={[{ value: 'on', label: 'On' }, { value: 'off', label: 'Off' }]} value={settings.captions ? 'on' : 'off'} onChange={(v) => updateSettings({ captions: v === 'on' })} />
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="font-display text-sm font-bold uppercase tracking-wide text-white/70">Camera</span>
            <Segmented
              options={[
                { value: 'broadcast', label: 'Broadcast' },
                { value: 'close', label: 'Close' },
                { value: 'high', label: 'High' },
              ]}
              value={settings.camera}
              onChange={(v) => updateSettings({ camera: v })}
            />
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="font-display text-sm font-bold uppercase tracking-wide text-white/70">Graphics</span>
            <Segmented
              options={[
                { value: 'auto', label: 'Auto' },
                { value: 'low', label: 'Low' },
                { value: 'medium', label: 'Med' },
                { value: 'high', label: 'High' },
              ]}
              value={settings.quality}
              onChange={(v) => updateSettings({ quality: v })}
            />
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="font-display text-sm font-bold uppercase tracking-wide text-white/70">Camera shake</span>
            <Segmented options={[{ value: 'on', label: 'On' }, { value: 'off', label: 'Off' }]} value={settings.shake ? 'on' : 'off'} onChange={(v) => updateSettings({ shake: v === 'on' })} />
          </div>
          <Button icon={<Settings2 className="size-4" />} onClick={() => setTab('main')}>
            Done
          </Button>
        </div>
      )}
    </Modal>
  )
}

export function Slider({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <label className="flex items-center gap-3">
      <span className="w-32 shrink-0 font-display text-sm font-bold uppercase tracking-wide text-white/70">{label}</span>
      <input type="range" min={0} max={1} step={0.05} value={value} onChange={(e) => onChange(Number(e.target.value))} className="h-1.5 flex-1 cursor-pointer accent-[#ff5b14]" />
      <span className="w-9 text-right font-display text-sm font-bold tabular-nums">{Math.round(value * 100)}</span>
    </label>
  )
}

export function ControlsReference({ mode, threes, onBack }: { mode: 'match' | 'contest'; threes?: boolean; onBack?: () => void }) {
  const rows: [string, string, string][] =
    mode === 'contest'
      ? [
          ['Shoot', 'Hold, release in the green', 'Space / J'],
          ['Racks', 'Shooter moves automatically', '—'],
        ]
      : [
          ['Move', 'Left stick (push fully to sprint)', 'WASD + Shift'],
          ['Shoot', 'Hold, release at the top of the meter. Tap for a pump fake. Near the rim: layup, euro step or dunk', 'Space / J'],
          ...(threes ? ([['Pass', 'Tap · aim with the stick. Hit a cutter at the rim for an alley-oop', 'K / E']] as [string, string, string][]) : []),
          ['Pro moves', 'Stick toward the rim: spin. Away: step-back. Sideways: crossover (behind the back at speed). No stick: hesitation', 'L / Q'],
          ['Block / Jump', 'Defense: contest shots · loose ball: rebound', 'Space / J'],
          ['Steal', 'Swipe at the ball handler. Reaching can draw a foul', 'L / Q'],
          ...(threes ? ([['Switch', 'Control the defender closest to the ball', 'K / E']] as [string, string, string][]) : []),
          ['Auto-guard', 'On defense, let go of the stick and your player guards automatically', '—'],
        ]
  return (
    <div className="flex flex-col gap-3">
      <div className="divide-y divide-white/8 overflow-hidden rounded-xl bg-white/4">
        {rows.map(([a, b, c]) => (
          <div key={a} className="grid grid-cols-[110px_1fr_auto] items-center gap-3 px-3 py-2.5 text-sm">
            <span className="font-display font-bold uppercase italic">{a}</span>
            <span className="text-white/65">{b}</span>
            <kbd className="rounded-md border border-white/20 bg-white/8 px-1.5 py-0.5 text-[11px] font-semibold text-white/80">{c}</kbd>
          </div>
        ))}
      </div>
      <p className="text-xs text-white/45">Gamepads work too: left stick moves, X shoots, A passes, B moves/steals, RT sprints.</p>
      {onBack && <Button onClick={onBack}>Back</Button>}
    </div>
  )
}

// ---------------------------------------------------------------- contest

function ContestView({ session }: { session: Extract<Session, { kind: 'contest' }> }) {
  const cfg = session.config
  const [round, setRound] = useState(1)
  const [contest, setContest] = useState<Contest | null>(null)
  const [paused, setPaused] = useState(false)
  const [items, push] = useFeedback()
  const [, setTick] = useState(0)
  const [standings, setStandings] = useState<{ round: number; rows: ContestRoundScore[]; qualified: boolean } | null>(null)
  const touch = useTouchMode()
  const settings = useStore((s) => s.settings)
  const roundsRef = useRef<ContestRoundScore[][]>([])
  const humanScores = useRef<number[]>([])
  const totals = useRef({ makes: 0, attempts: 0, greens: 0 })
  const finalists = useRef<number[]>([])
  const human = cfg.shooters[cfg.humanIndex]
  const engine = useEngine()

  useEffect(() => {
    if (!engine) return
    const c = new Contest(engine, cfg, round, {
      onFeedback: (t, k, s) => {
        push(t, k, s)
        if (k === 'green') haptic(24)
      },
      onRoundEnd: (score, st) => {
        humanScores.current.push(score)
        totals.current.makes += st.makes
        totals.current.attempts += st.attempts
        totals.current.greens += st.greens
        const others = cfg.shooters.map((p, i) => ({ p, i })).filter(({ i }) => i !== cfg.humanIndex)
        const pool = round === 1 ? others : others.filter(({ i }) => finalists.current.includes(i))
        const rows: ContestRoundScore[] = [
          { id: human.id, name: shortName(human), score },
          ...pool.map(({ p }) => ({ id: p.id, name: shortName(p), score: simulateContest(p.attributes.three) })),
        ].sort((a, b) => b.score - a.score)
        roundsRef.current.push(rows)
        const multi = cfg.rounds === 2 && cfg.shooters.length > 1
        if (multi && round === 1) {
          const top = rows.slice(0, 3)
          const qualified = top.some((r) => r.id === human.id)
          finalists.current = top.filter((r) => r.id !== human.id).map((r) => cfg.shooters.findIndex((s) => s.id === r.id))
          setStandings({ round: 1, rows, qualified })
        } else {
          finish()
        }
      },
    }, session.jersey)
    engine.setMode(c)
    if (import.meta.env.DEV) (window as unknown as { __contest?: Contest }).__contest = c
    setContest(c)
    engine.input.onPause = () => setPaused((p) => !p)
    engine.input.gameActive = true
    return () => {
      engine.input.onPause = undefined
      engine.input.gameActive = false
      engine.paused = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, round, engine])

  useEffect(() => {
    const e = getEngine()
    if (!e) return
    e.paused = paused
    e.input.setEnabled(!paused)
  }, [paused])

  useInterval(() => setTick((t) => t + 1), 100)
  useGameSession(() => setPaused(true))

  const finish = () => {
    const rounds = roundsRef.current
    const last = rounds[rounds.length - 1]
    const champion = last[0]
    const result: ContestResult = {
      rounds,
      humanScores: humanScores.current,
      champion: champion.name,
      humanWon: cfg.shooters.length > 1 && champion.id === human.id,
      humanBest: Math.max(...humanScores.current),
      makes: totals.current.makes,
      attempts: totals.current.attempts,
      greens: totals.current.greens,
    }
    const st = store.get()
    if (result.humanBest > st.records.contestBest) updateRecords({ contestBest: result.humanBest })
    if (session.origin === 'career' && st.career && session.eventId) {
      const { save, rewards } = applyContestResult(st.career, session.eventId, result)
      commitCareer(save)
      go({ id: 'contestResults', session, result, rewards })
    } else go({ id: 'contestResults', session, result })
  }

  const hud: ContestHud | null = contest?.hud ?? null
  const quit = () => {
    setPaused(false)
    go(session.origin === 'career' ? { id: 'career', tab: 'home' } : { id: 'contestSetup' })
  }

  return (
    <div className="absolute inset-0 touch-none select-none overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.5)_100%)]" />
      {hud && (
        <>
          <div className="pointer-events-none absolute left-1/2 top-[max(env(safe-area-inset-top),8px)] z-20 -translate-x-1/2 text-center">
            <div className="flex items-stretch overflow-hidden rounded-xl border border-white/10 bg-ink-950/80 shadow-2xl backdrop-blur-md">
              <div className="px-4 py-1.5">
                <div className="font-display text-[10px] font-bold uppercase tracking-[0.25em] text-white/50">Time</div>
                <div className={cx('font-display text-3xl font-black italic tabular-nums leading-none', hud.time <= 10 && hud.time > 0 && 'text-bad')}>{hud.time.toFixed(hud.time < 10 ? 1 : 0)}</div>
              </div>
              <div className="bg-white/6 px-4 py-1.5">
                <div className="font-display text-[10px] font-bold uppercase tracking-[0.25em] text-white/50">Score</div>
                <div className="font-display text-3xl font-black italic tabular-nums leading-none text-gold">{hud.score}</div>
              </div>
            </div>
            <div className="mt-1 font-display text-[10px] font-bold uppercase tracking-[0.25em] text-white/55">
              {cfg.label} {cfg.rounds === 2 && cfg.shooters.length > 1 ? `· ${round === 1 ? 'Round 1' : 'Final Round'}` : ''}
            </div>
          </div>
          <RackStrip hud={hud} />
          {hud.phase === 'intro' && (
            <div className="pointer-events-none absolute inset-x-0 top-[30%] z-20 flex animate-rise flex-col items-center text-center">
              <div className="font-display text-xs font-bold uppercase tracking-[0.35em] text-blaze">{round === 2 ? 'Final Round' : 'Three-Point Contest'}</div>
              <div className="font-display text-[clamp(30px,6vw,56px)] font-black uppercase italic leading-none">{shortName(human)}</div>
              <div className="mt-2 text-sm text-white/70">
                Money rack: <span className="font-bold text-gold">{RACK_SPOTS[cfg.moneyRack].label}</span> · every last ball is worth 2
              </div>
            </div>
          )}
          {hud.phase === 'countdown' && hud.countdown > 0 && (
            <div key={hud.countdown} className="pointer-events-none absolute inset-0 z-20 grid animate-pop place-items-center font-display text-[min(30vw,180px)] font-black italic text-white drop-shadow-2xl">
              {hud.countdown}
            </div>
          )}
          {hud.phase === 'live' && hud.score === 0 && hud.rack === 0 && hud.ball === 0 && (
            <div className="pointer-events-none absolute inset-x-0 bottom-[30%] z-20 flex justify-center">
              <div className="clip-skew animate-pulse-soft bg-white/90 px-5 py-1.5 font-display text-sm font-black uppercase italic tracking-wider text-ink-950">Hold shoot · release in the green</div>
            </div>
          )}
        </>
      )}
      <ShotMeter hud={hud} />
      <FeedbackLayer items={items} />
      {touch && hud && hud.phase !== 'done' && (
        <ActionCluster specs={{ primary: { action: 'shoot', label: 'Shoot', icon: ICONS.shoot, size: 'xl', tone: 'blaze' } }} left={settings.leftHanded} />
      )}
      {!touch && settings.hints && hud && hud.phase !== 'done' && (
        <div className="pointer-events-none absolute inset-x-0 top-[calc(max(env(safe-area-inset-top),8px)+84px)] z-20 flex justify-center">
          <span className="rounded-xl bg-black/50 px-4 py-2 font-display text-xs uppercase tracking-wide text-white/75 backdrop-blur">
            Hold <kbd className="mx-1 rounded-md border border-white/25 bg-white/10 px-1.5 py-0.5 font-sans text-[11px]">Space</kbd> and release at the top of the meter
          </span>
        </div>
      )}
      <button
        aria-label="Pause"
        onClick={() => setPaused(true)}
        className="absolute left-[max(env(safe-area-inset-left),12px)] top-[max(env(safe-area-inset-top),10px)] z-40 grid size-11 place-items-center rounded-full bg-black/45 text-white/85 backdrop-blur hover:bg-black/65"
      >
        <Pause className="size-4" />
      </button>
      <PauseMenu open={paused} onResume={() => setPaused(false)} onQuit={quit} quitLabel={session.origin === 'career' ? 'Quit to Career Hub' : 'Quit Contest'} mode="contest" />
      <Modal open={!!standings} title={standings?.qualified ? 'You advance!' : 'Eliminated'}>
        {standings && (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-white/65">{standings.qualified ? 'Top three move on to the Final Round. Scores reset.' : 'Only the top three advance to the final. So close.'}</p>
            <Leaderboard rows={standings.rows} highlightId={human.id} cut={3} />
            {standings.qualified ? (
              <Button
                variant="primary"
                size="lg"
                onClick={() => {
                  setStandings(null)
                  setRound(2)
                }}
              >
                Start Final Round
              </Button>
            ) : (
              <Button
                variant="primary"
                size="lg"
                onClick={() => {
                  setStandings(null)
                  finish()
                }}
              >
                See Results
              </Button>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}

function RackStrip({ hud }: { hud: ContestHud }) {
  return (
    <div className="pointer-events-none absolute bottom-[max(env(safe-area-inset-bottom),14px)] left-1/2 z-20 flex -translate-x-1/2 gap-1.5 rounded-xl bg-ink-950/70 px-2.5 py-2 backdrop-blur">
      {hud.racks.map((r, ri) => (
        <div key={ri} className={cx('flex flex-col items-center gap-1 rounded-lg px-1.5 py-1', ri === hud.rack && hud.phase !== 'done' && 'bg-white/10')}>
          <div className="flex gap-1">
            {r.results.map((res, bi) => (
              <span
                key={bi}
                className={cx(
                  'size-3 rounded-full border',
                  r.money[bi] ? 'border-gold' : 'border-white/40',
                  res === true && (r.money[bi] ? 'bg-gold' : 'bg-good'),
                  res === false && 'bg-bad/70',
                  res === null && 'bg-transparent',
                )}
              />
            ))}
          </div>
          <span className="font-display text-[9px] font-bold uppercase tracking-wider text-white/50">{['L Cor', 'L Wing', 'Top', 'R Wing', 'R Cor'][ri]}</span>
        </div>
      ))}
    </div>
  )
}

export function Leaderboard({ rows, highlightId, cut }: { rows: ContestRoundScore[]; highlightId: string; cut?: number }) {
  return (
    <div className="overflow-hidden rounded-xl bg-white/4">
      {rows.map((r, i) => (
        <div key={r.id} className={cx('grid grid-cols-[28px_1fr_auto] items-center gap-3 px-3 py-2', r.id === highlightId && 'bg-blaze/15', !!cut && i === cut - 1 && 'border-b border-dashed border-white/25')}>
          <span className="font-display text-sm font-black italic text-white/50">{i + 1}</span>
          <span className={cx('truncate font-display font-bold uppercase', r.id === highlightId && 'text-blaze-soft')}>{r.name}</span>
          <span className="font-display text-xl font-black italic tabular-nums">{r.score}</span>
        </div>
      ))}
    </div>
  )
}
