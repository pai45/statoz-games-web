import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { host as gameHost } from './host'

import { DUEL_ARENAS, DUEL_DIFFICULTIES, MISSIONS } from './game/data.ts'
import { GameEngine } from './game/engine.ts'
import {
  applyDuelResult,
  applyMissionResult,
  clearProfile,
  createProfile,
  evaluateMission,
  isMissionUnlocked,
  levelInfo,
  loadProfile,
  PROFILE_KEY,
  sanitizeCallsign,
  saveProfile,
  type DuelPrefs,
  type Profile,
  type Settings,
} from './game/progression.ts'
import type { GameEvent, HudState } from './game/types.ts'
import { playUi, setUiHandler } from './ui/common.tsx'
import { Hud, type IntroCard, type Notice, type Popup, type TouchActions } from './ui/hud/Hud.tsx'
import { PauseMenu } from './ui/hud/PauseMenu.tsx'
import { IconCrosshair } from './ui/icons.tsx'
import { resolveLoadout } from './ui/loadout.tsx'
import { Armory } from './ui/screens/Armory.tsx'
import { Campaign } from './ui/screens/Campaign.tsx'
import { Career } from './ui/screens/Career.tsx'
import { DuelSetup } from './ui/screens/DuelSetup.tsx'
import { MainMenu, type MenuTarget } from './ui/screens/MainMenu.tsx'
import { DuelResults, Results, type DuelResult, type MissionResult } from './ui/screens/Results.tsx'
import { SettingsScreen } from './ui/screens/SettingsScreen.tsx'

type Screen =
  | { id: 'title' }
  | { id: 'menu' }
  | { id: 'campaign'; index: number }
  | { id: 'duel' }
  | { id: 'armory' }
  | { id: 'career' }
  | { id: 'settings' }
  | { id: 'mission'; index: number }
  | { id: 'duelGame' }
  | { id: 'results'; result: MissionResult }
  | { id: 'duelResults'; result: DuelResult }

interface BootState {
  progress: number
  label: string
  ready: boolean
  error: string | null
}

const DETAILS_KEY = 'holdover.hud.details'
const smallViewport = () => typeof window !== 'undefined' && (window.innerWidth < 900 || window.innerHeight < 560)

function readDetails(): boolean {
  try {
    return localStorage.getItem(DETAILS_KEY) === '1'
  } catch {
    return false
  }
}

const coarsePointer = () => typeof window !== 'undefined' && (window.matchMedia?.('(pointer: coarse)').matches || 'ontouchstart' in window)

/** First launch on a phone or tablet defaults to the lightweight renderer. */
function initialProfile(): Profile {
  const profile = loadProfile()
  let stored = false
  try {
    stored = localStorage.getItem(PROFILE_KEY) !== null
  } catch {
    stored = false
  }
  if (!stored && coarsePointer()) return { ...profile, settings: { ...profile.settings, quality: 'performance', fov: 65 } }
  return profile
}

function firstOpenMission(profile: Profile): number {
  const index = MISSIONS.findIndex((mission, i) => isMissionUnlocked(profile, i) && !profile.missions[mission.id]?.completed)
  return index >= 0 ? index : MISSIONS.length - 1
}

export default function App() {
  const hostRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLCanvasElement>(null)
  const engineRef = useRef<GameEngine | null>(null)
  const [profile, setProfileState] = useState<Profile>(() => initialProfile())
  const profileRef = useRef(profile)
  const [boot, setBoot] = useState<BootState>({ progress: 0, label: 'Initializing', ready: false, error: null })
  const [screen, setScreenState] = useState<Screen>({ id: 'title' })
  const screenRef = useRef<Screen>(screen)
  const [hud, setHud] = useState<HudState | null>(null)
  const [paused, setPaused] = useState(false)
  const [pauseView, setPauseView] = useState<'menu' | 'settings'>('menu')
  const [popups, setPopups] = useState<Popup[]>([])
  const [notices, setNotices] = useState<Notice[]>([])
  const [intro, setIntro] = useState<IntroCard | null>(null)
  const idRef = useRef(1)
  const [touch, setTouch] = useState(coarsePointer)
  const [portrait, setPortrait] = useState(() => window.innerHeight > window.innerWidth)
  const [small, setSmall] = useState(smallViewport)
  const [details, setDetails] = useState(readDetails)
  const compact = touch || small
  const toggleDetails = useCallback(() => {
    setDetails((open) => {
      const next = !open
      try {
        localStorage.setItem(DETAILS_KEY, next ? '1' : '0')
      } catch {
        // Storage can be unavailable; the toggle still works for this session.
      }
      return next
    })
  }, [])

  const setScreen = useCallback((next: Screen) => {
    screenRef.current = next
    setScreenState(next)
  }, [])

  const updateProfile = useCallback((next: Profile) => {
    profileRef.current = next
    setProfileState(next)
    saveProfile(next)
  }, [])

  // ---------------------------------------------------------------- Events
  const handleEvent = useRef<(event: GameEvent) => void>(() => {})
  handleEvent.current = (event: GameEvent) => {
    const engine = engineRef.current
    switch (event.type) {
      case 'score': {
        const id = idRef.current++
        setPopups((list) => [...list.slice(-2), { id, lines: event.lines, total: event.total, headshot: event.headshot }])
        window.setTimeout(() => setPopups((list) => list.filter((popup) => popup.id !== id)), 2900)
        break
      }
      case 'notice': {
        const id = idRef.current++
        setNotices((list) => [...list.slice(-2), { id, text: event.text, tone: event.tone }])
        window.setTimeout(() => setNotices((list) => list.filter((notice) => notice.id !== id)), 3700)
        break
      }
      case 'pause': {
        const current = screenRef.current
        if ((current.id === 'mission' || current.id === 'duelGame') && engine) {
          engine.pause()
          setPaused(true)
          setPauseView('menu')
        }
        break
      }
      case 'missionEnd': {
        const current = screenRef.current
        if (current.id !== 'mission') return
        const mission = MISSIONS[current.index]
        const before = profileRef.current
        const firstClear = !before.missions[mission.id]?.completed
        const evaluation = evaluateMission(mission, event.stats, event.success, firstClear, before.settings.ballisticAssist)
        const progress = applyMissionResult(before, mission, evaluation, event.stats)
        updateProfile(progress.profile)
        engine?.setLevel(progress.levelAfter)
        playUi(event.success ? 'confirm' : 'back')
        setScreen({ id: 'results', result: { index: current.index, mission, success: event.success, reason: event.reason, stats: event.stats, evaluation, progress, xpBefore: before.xp } })
        break
      }
      case 'duelEnd': {
        if (screenRef.current.id !== 'duelGame') return
        const before = profileRef.current
        const progress = applyDuelResult(before, event.summary)
        updateProfile(progress.profile)
        engine?.setLevel(progress.levelAfter)
        const arena = DUEL_ARENAS.find((item) => item.id === before.duel.arena) ?? DUEL_ARENAS[0]
        const difficulty = DUEL_DIFFICULTIES.find((item) => item.id === before.duel.difficulty) ?? DUEL_DIFFICULTIES[0]
        setScreen({ id: 'duelResults', result: { summary: event.summary, progress, xpBefore: before.xp, arena: arena.name, difficulty: difficulty.label } })
        break
      }
      case 'pointer':
        break
    }
  }

  // ---------------------------------------------------------------- Engine
  useEffect(() => {
    const command = (event: Event) => {
      if ((event as CustomEvent<string>).detail === 'pause') handleEvent.current({ type: 'pause' })
      else if ((event as CustomEvent<string>).detail === 'resume') {
        setPaused(false)
        engineRef.current?.resume()
      }
    }
    window.addEventListener('holdover:host-command', command)
    return () => window.removeEventListener('holdover:host-command', command)
  }, [])

  useEffect(() => {
    const host = hostRef.current
    const overlay = overlayRef.current
    if (!host || !overlay) return
    let engine: GameEngine | null = null
    let cancelled = false
    // Deferred so React StrictMode's mount/unmount probe never builds the world twice.
    const timer = window.setTimeout(() => {
      try {
        engine = new GameEngine(host, overlay, profileRef.current.settings, {
          onHud: (state) => setHud(state),
          onEvent: (event) => handleEvent.current(event),
        })
      } catch (error) {
        setBoot((state) => ({ ...state, error: error instanceof Error ? error.message : String(error) }))
        gameHost()?.emit('error')
        return
      }
      engineRef.current = engine
      if (import.meta.env.DEV) (window as unknown as { __holdover?: GameEngine }).__holdover = engine
      setUiHandler((sound) => engine?.audio.ui(sound))
      engine.setLevel(levelInfo(profileRef.current.xp).level)
      engine
        .init((progress, label) => {
          if (!cancelled) setBoot((state) => ({ ...state, progress, label }))
        })
        .then(() => {
          if (!cancelled) {
            setBoot((state) => ({ ...state, progress: 1, ready: true }))
            gameHost()?.emit('ready')
          }
        })
        .catch((error: unknown) => {
          if (!cancelled) {
            setBoot((state) => ({ ...state, error: error instanceof Error ? error.message : String(error) }))
            gameHost()?.emit('error')
          }
        })
    }, 0)
    return () => {
      cancelled = true
      window.clearTimeout(timer)
      engine?.dispose()
      engineRef.current = null
      setUiHandler(() => {})
    }
  }, [])

  // Go straight into the game menu as soon as the world is built.
  useEffect(() => {
    if (screen.id === 'title' && boot.ready) setScreen({ id: 'menu' })
  }, [screen.id, boot.ready, setScreen])

  // Audio may only start after a user gesture; the first tap or key unlocks it.
  useEffect(() => {
    const unlock = () => engineRef.current?.audio.unlock()
    const onTouch = () => setTouch(true)
    window.addEventListener('pointerdown', unlock)
    window.addEventListener('keydown', unlock)
    window.addEventListener('touchstart', onTouch, { passive: true })
    const onResize = () => {
      setPortrait(window.innerHeight > window.innerWidth)
      setSmall(smallViewport())
    }
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('pointerdown', unlock)
      window.removeEventListener('keydown', unlock)
      window.removeEventListener('touchstart', onTouch)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  useEffect(() => {
    if (touch && boot.ready) engineRef.current?.setTouchMode(true)
  }, [touch, boot.ready])

  // I toggles the full weapon details on compact layouts.
  useEffect(() => {
    if (!compact) return
    const onKey = (event: KeyboardEvent) => {
      const current = screenRef.current
      if (event.code !== 'KeyI' || event.repeat || paused || (current.id !== 'mission' && current.id !== 'duelGame')) return
      toggleDetails()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [compact, paused, toggleDetails])

  // The Armory renders its own rifle turntable; pause the world renderer meanwhile.
  useEffect(() => {
    engineRef.current?.setSuspended(screen.id === 'armory')
  }, [screen.id])

  // ------------------------------------------------------------- Actions
  const startMission = useCallback(
    (index: number) => {
      const engine = engineRef.current
      if (!engine) return
      const mission = MISSIONS[index]
      engine.audio.unlock()
      engine.startMission(mission, index, resolveLoadout(profileRef.current))
      engine.requestPointer()
      setPaused(false)
      setPopups([])
      setNotices([])
      setIntro({ id: idRef.current++, kicker: `${mission.code} · ${mission.clock}`, title: mission.name, sub: mission.location })
      setScreen({ id: 'mission', index })
    },
    [setScreen],
  )

  const startDuel = useCallback(() => {
    const engine = engineRef.current
    if (!engine) return
    const prefs = profileRef.current.duel
    const arena = DUEL_ARENAS.find((item) => item.id === prefs.arena) ?? DUEL_ARENAS[0]
    engine.audio.unlock()
    engine.startDuel(arena, prefs.difficulty, prefs.rounds, resolveLoadout(profileRef.current))
    engine.requestPointer()
    setPaused(false)
    setPopups([])
    setNotices([])
    const difficulty = DUEL_DIFFICULTIES.find((item) => item.id === prefs.difficulty)
    setIntro({ id: idRef.current++, kicker: `Quick Duel · ${difficulty?.label ?? ''}`, title: arena.name, sub: `${arena.range} · best of ${prefs.rounds}` })
    setScreen({ id: 'duelGame' })
  }, [setScreen])

  const toMenu = useCallback(
    (next: Screen = { id: 'menu' }) => {
      engineRef.current?.showMenu()
      setPaused(false)
      setIntro(null)
      setScreen(next)
    },
    [setScreen],
  )

  const resume = useCallback(() => {
    setPaused(false)
    engineRef.current?.resume()
  }, [])

  const setSettings = useCallback(
    (settings: Settings) => {
      updateProfile({ ...profileRef.current, settings })
      engineRef.current?.applySettings(settings)
    },
    [updateProfile],
  )

  const setLoadout = useCallback((loadout: Profile['loadout']) => updateProfile({ ...profileRef.current, loadout }), [updateProfile])
  const setDuelPrefs = useCallback((duel: DuelPrefs) => updateProfile({ ...profileRef.current, duel }), [updateProfile])

  const touchActions = useMemo<TouchActions>(
    () => ({
      fire: () => engineRef.current?.fire(),
      toggleScope: () => engineRef.current?.toggleScope(),
      breath: (holding) => engineRef.current?.setHoldingBreath(holding),
      cover: (held) => engineRef.current?.setCover(held),
      zoom: (factor) => engineRef.current?.changeZoom(factor),
      zero: (direction) => engineRef.current?.changeZero(direction),
      reload: () => engineRef.current?.startReload(),
      range: () => engineRef.current?.rangefind(),
      thermal: () => engineRef.current?.toggleThermal(),
      pause: () => handleEvent.current({ type: 'pause' }),
    }),
    [],
  )

  const navigate = (target: MenuTarget) => {
    if (target === 'campaign') setScreen({ id: 'campaign', index: firstOpenMission(profileRef.current) })
    else setScreen({ id: target })
  }

  // ------------------------------------------------------------- Render
  const inGame = screen.id === 'mission' || screen.id === 'duelGame'
  const showScrim = !inGame && screen.id !== 'title'
  const settingsPanel = (inGameSettings: boolean, back: () => void) => (
    <SettingsScreen
      settings={profile.settings}
      callsign={profile.callsign}
      inGame={inGameSettings}
      onChange={setSettings}
      onCallsign={(name) => updateProfile({ ...profileRef.current, callsign: sanitizeCallsign(name) })}
      onReset={() => {
        clearProfile()
        const fresh = createProfile()
        updateProfile(fresh)
        engineRef.current?.applySettings(fresh.settings)
        engineRef.current?.setLevel(1)
        setScreen({ id: 'menu' })
      }}
      onBack={back}
    />
  )

  return (
    <div className={`app ${touch ? 'touch' : ''} ${compact ? 'compact' : ''}`}>
      <div ref={hostRef} className={`stage ${inGame ? 'in-game' : ''}`}>
        <canvas ref={overlayRef} className="overlay-canvas" />
      </div>
      {showScrim && <div className={`scrim ${screen.id === 'menu' ? '' : 'heavy'}`} />}
      {screen.id === 'title' && <div className="scrim title" />}
      <div className="grain" />

      {inGame && hud && !paused && (
        <Hud
          hud={hud}
          popups={popups}
          notices={notices}
          intro={intro}
          touch={touch}
          actions={touchActions}
          compact={compact}
          details={details}
          onToggleDetails={toggleDetails}
          onEngage={() => {
            engineRef.current?.requestPointer()
          }}
        />
      )}

      {inGame && touch && portrait && !paused && <div className="rotate-hint">Rotate to landscape for the full scope</div>}

      {inGame && paused && pauseView === 'menu' && (
        <PauseMenu
          title="Paused"
          sub={screen.id === 'mission' ? `${MISSIONS[screen.index].code} · ${MISSIONS[screen.index].name}` : 'Quick Duel'}
          onResume={resume}
          onRestart={() => (screen.id === 'mission' ? startMission(screen.index) : startDuel())}
          onSettings={() => setPauseView('settings')}
          onQuit={() => toMenu(screen.id === 'mission' ? { id: 'campaign', index: screen.index } : { id: 'duel' })}
        />
      )}
      {inGame && paused && pauseView === 'settings' && <div className="modal !place-items-stretch !p-0">{settingsPanel(true, () => setPauseView('menu'))}</div>}

      {screen.id === 'menu' && <MainMenu profile={profile} onNavigate={navigate} onContinue={(index) => setScreen({ id: 'campaign', index })} />}
      {screen.id === 'campaign' && <Campaign profile={profile} initial={screen.index} onBack={() => setScreen({ id: 'menu' })} onDeploy={startMission} onLoadout={setLoadout} />}
      {screen.id === 'duel' && <DuelSetup profile={profile} onBack={() => setScreen({ id: 'menu' })} onStart={startDuel} onPrefs={setDuelPrefs} onLoadout={setLoadout} />}
      {screen.id === 'armory' && <Armory profile={profile} onBack={() => setScreen({ id: 'menu' })} onLoadout={setLoadout} />}
      {screen.id === 'career' && <Career profile={profile} onBack={() => setScreen({ id: 'menu' })} />}
      {screen.id === 'settings' && settingsPanel(false, () => setScreen({ id: 'menu' }))}
      {screen.id === 'results' && (
        <Results
          result={screen.result}
          onNext={() => startMission(screen.result.index + 1)}
          onRetry={() => startMission(screen.result.index)}
          onCampaign={() => toMenu({ id: 'campaign', index: screen.result.success ? Math.min(MISSIONS.length - 1, screen.result.index + 1) : screen.result.index })}
          onMenu={() => toMenu()}
        />
      )}
      {screen.id === 'duelResults' && <DuelResults result={screen.result} onRematch={startDuel} onSetup={() => toMenu({ id: 'duel' })} onMenu={() => toMenu()} />}

      {screen.id === 'title' && (
        <div className="absolute inset-0 grid place-items-center">
          <div className="flex flex-col items-center gap-7 text-center">
            <div className="logo">
              H<span className="logo-mark" />
              ldover
            </div>
            <div className="kicker justify-center">Sarn Valley · Long-range operations</div>
            {boot.error ? (
              <div className="max-w-[460px] text-[15px] text-[var(--danger)]">
                This device could not start the 3D renderer ({boot.error}). Try a browser with WebGL 2 enabled.
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${Math.round(boot.progress * 100)}%` }} />
                </div>
                <div className="label">{boot.label}</div>
              </div>
            )}
          </div>
          <div className="label absolute bottom-6 flex items-center gap-2">
            <IconCrosshair size={12} /> {touch ? 'Landscape and headphones recommended' : 'Headphones recommended'}
          </div>
        </div>
      )}
    </div>
  )
}
