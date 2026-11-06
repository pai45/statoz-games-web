import { useEffect, useRef, useState } from 'react'
import { createEngine, getEngine } from './game/engine/runtime'
import { Showcase } from './game/sim/Showcase'
import { PARK_TEAM, PRO_TEAMS, getTeam, jerseyFor } from './data/teams'
import { effectivePlayer, nextEvent, newCareer } from './data/career'
import { overall } from './data/attributes'
import { commitCareer, go, store, useStore, type Screen } from './state/store'
import { TitleScreen, MainMenu, QuickPlay, ContestSetup, SettingsScreen } from './ui/screens/Menus'
import { ResultsScreen, ContestResultsScreen } from './ui/screens/Results'
import { GameScreen } from './ui/game/GameScreen'
import { CareerSlots } from './ui/career/Slots'
import { CreatePlayer, STREET_JERSEY } from './ui/career/CreatePlayer'
import { CareerHub } from './ui/career/Hub'
import { DraftNight, Offseason } from './ui/career/Draft'
import type { PlayerProfile, TeamInfo } from './game/types'

const FEATURED: { p: PlayerProfile; team: TeamInfo }[] = PRO_TEAMS.map((t) => ({
  p: [...t.roster].sort((a, b) => overall(b.attributes, b.position) - overall(a.attributes, a.position))[0],
  team: t,
}))

function EngineHost() {
  const ref = useRef<HTMLDivElement>(null)
  const [failed, setFailed] = useState(false)
  useEffect(() => {
    let cancelled = false
    // Canvas textures (court lettering, LED boards, jersey numbers) need the display font loaded first.
    const fonts = Promise.all(
      ['900 italic 64px "Barlow Condensed"', '800 italic 64px "Barlow Condensed"', '900 64px "Barlow Condensed"', '800 64px "Barlow Condensed"'].map((f) => document.fonts?.load(f)),
    ).catch(() => undefined)
    const timeout = new Promise((r) => window.setTimeout(r, 2500))
    void Promise.race([fonts, timeout]).then(() => {
      if (cancelled || !ref.current) return
      try {
        const s = store.get().settings
        const e = createEngine(ref.current, { quality: s.quality, resolutionScale: s.resolution, shake: s.shake })
        e.audio.setVolumes({ sfx: s.sfx, crowd: s.crowd, music: s.music })
        e.commentary.setVolume(s.commentary)
        e.commentary.captions = s.captions
        e.cameraPreset = s.camera
        store.set({ showcaseKey: store.get().showcaseKey + 1 })
      } catch (err) {
        console.error(err)
        setFailed(true)
      }
    })
    return () => {
      cancelled = true
    }
  }, [])
  return (
    <>
      <div ref={ref} className="fixed inset-0" aria-hidden />
      {failed && (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-ink-950 p-6 text-center">
          <div>
            <div className="font-display text-3xl font-black uppercase italic">3D not available</div>
            <p className="mt-2 max-w-sm text-sm text-white/60">This device or browser could not start WebGL. Try a recent version of Chrome, Safari or Edge with hardware acceleration enabled.</p>
          </div>
        </div>
      )}
    </>
  )
}

/** Keeps the 3D scene in sync with whichever menu screen is showing. */
function useSceneDirector() {
  const screen = useStore((s) => s.screen)
  const career = useStore((s) => s.career)
  const preview = useStore((s) => s.preview)
  const engineReady = useStore((s) => s.showcaseKey)
  const featured = useRef(Math.floor(Math.random() * FEATURED.length))
  useEffect(() => {
    const e = getEngine()
    if (!e) return
    if (screen.id === 'game' || screen.id === 'results' || screen.id === 'contestResults') return
    const creator = screen.id === 'careerCreate' || (screen.id === 'career' && screen.tab === 'locker')
    let profile: PlayerProfile
    let jersey = STREET_JERSEY
    let court: TeamInfo = PARK_TEAM
    let team: TeamInfo | null = null
    const careerScreen = screen.id === 'career' || screen.id === 'draft' || screen.id === 'offseason'
    if (screen.id === 'careerCreate' && preview) {
      profile = preview.profile
      jersey = preview.jersey
    } else if (career && careerScreen) {
      profile = effectivePlayer(career)
      const proTeam = career.pro ? getTeam(career.pro.teamId) : null
      if (proTeam) {
        jersey = jerseyFor(proTeam, nextEvent(career).id.startsWith('pro:') ? true : false)
        court = proTeam
        team = proTeam
      }
    } else {
      const f = FEATURED[featured.current % FEATURED.length]
      profile = f.p
      jersey = jerseyFor(f.team, false)
      court = f.team
      team = f.team
    }
    if (e.mode instanceof Showcase) {
      e.mode.setCourt(court)
      e.mode.setView(creator ? 'creator' : 'menu')
      e.mode.setProfile(profile, jersey, team)
    } else {
      e.setMode(new Showcase(e, creator ? 'creator' : 'menu', profile, jersey, court, team))
    }
    if (e.audio.ctx) e.audio.startMusic()
  }, [screen, career, preview, engineReady])
}

function useSettingsSync() {
  const settings = useStore((s) => s.settings)
  const prev = useRef(settings)
  useEffect(() => {
    const e = getEngine()
    if (!e) return
    e.audio.setVolumes({ sfx: settings.sfx, crowd: settings.crowd, music: settings.music })
    e.commentary.setVolume(settings.commentary)
    e.commentary.captions = settings.captions
    e.cameraPreset = settings.camera
    e.setShake(settings.shake)
    if (prev.current.quality !== settings.quality || prev.current.resolution !== settings.resolution) e.setQuality(settings.quality, settings.resolution)
    prev.current = settings
  }, [settings])
}

function useDebugDeepLink() {
  useEffect(() => {
    if (!import.meta.env.DEV) return
    ;(window as unknown as { __dev?: unknown }).__dev = { store, go, commitCareer }
    const dbg = new URLSearchParams(location.search).get('debug')
    if (!dbg) return
    const home = PRO_TEAMS[1]
    const away = PRO_TEAMS[4]
    const n = dbg === 'match1' || dbg === 'sim1' ? 1 : 3
    const sim = dbg.startsWith('sim')
    if (dbg === 'match1' || dbg === 'match3' || sim) {
      go({
        id: 'game',
        session: {
          kind: 'match',
          origin: 'quick',
          config: {
            mode: n === 1 ? '1v1' : '3v3',
            sides: [
              { team: home, players: home.roster.slice(0, n), jersey: jerseyFor(home, true), human: !sim },
              { team: away, players: away.roster.slice(0, n), jersey: jerseyFor(away, false), human: false },
            ],
            targetScore: 21,
            timeLimit: 300,
            shotClock: 12,
            difficulty: 'pro',
            courtTeam: home,
            label: 'DEBUG',
            firstPossession: 0,
          },
        },
      })
    } else if (dbg === 'contest') {
      const shooters = PRO_TEAMS.flatMap((t) => t.roster).sort((a, b) => b.attributes.three - a.attributes.three).slice(0, 6)
      go({
        id: 'game',
        session: { kind: 'contest', origin: 'quick', jersey: jerseyFor(home, false), config: { shooters, humanIndex: 0, moneyRack: 2, rounds: 2, duration: 60, racks: 5, courtTeam: home, label: '3-POINT CONTEST', difficulty: 'pro' } },
      })
    } else if (dbg === 'career' || dbg === 'careerLocker') {
      const save = newCareer(0, {
        firstName: 'Jalen',
        lastName: 'Rivers',
        number: 3,
        position: 'SG',
        archetype: 'sharpshooter',
        heightCm: 196,
        difficulty: 'pro',
        appearance: { skin: '#8a5534', hair: 'twists', hairColor: '#0f0c0a', beard: true, headband: null, armSleeve: '#111318', legSleeve: null, wristbands: '#ffffff', shoeColor: '#f2f2f2', shoeAccent: '#111318', sockColor: '#f5f5f5' },
      })
      commitCareer(save)
      go({ id: 'career', tab: dbg === 'careerLocker' ? 'locker' : 'home' })
    } else {
      go({ id: dbg as Screen['id'] } as Screen)
    }
  }, [])
}

export default function App() {
  const screen = useStore((s) => s.screen)
  useSceneDirector()
  useSettingsSync()
  useDebugDeepLink()
  return (
    <div className="fixed inset-0 overflow-hidden">
      <EngineHost />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_center,transparent_60%,rgba(0,0,0,0.45)_100%)]" />
      <main className="fixed inset-0">{renderScreen(screen)}</main>
    </div>
  )
}

function renderScreen(screen: Screen) {
  switch (screen.id) {
    case 'title':
      return <TitleScreen />
    case 'menu':
      return <MainMenu />
    case 'quick':
      return <QuickPlay initialMode={screen.mode} />
    case 'contestSetup':
      return <ContestSetup />
    case 'settings':
      return <SettingsScreen from={screen.from} />
    case 'game':
      return <GameScreen session={screen.session} />
    case 'results':
      return <ResultsScreen session={screen.session} result={screen.result} rewards={screen.rewards} />
    case 'contestResults':
      return <ContestResultsScreen session={screen.session} result={screen.result} rewards={screen.rewards} />
    case 'careerSlots':
      return <CareerSlots />
    case 'careerCreate':
      return <CreatePlayer slot={screen.slot} />
    case 'career':
      return <CareerHub tab={screen.tab} />
    case 'draft':
      return <DraftNight />
    case 'offseason':
      return <Offseason />
  }
}
