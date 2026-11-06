import { createRoot } from "react-dom/client"
import { MemoryRouter, Route, Routes } from "react-router"
import { LazyMotion, MotionConfig, domAnimation } from "motion/react"
import { useEffect } from "react"

import { CanvasBoundary } from "./components/CanvasBoundary"
import { useFontsLoader } from "./hooks/useFontsLoader"
import RacePage from "./pages/RacePage"
import { engineSound } from "./race/audio"
import { clearControls, controls } from "./race/controls"
import { useRaceStore } from "./race/raceStore"
import { telemetry } from "./race/telemetry"
import { useStore } from "./state/store"
import Experience from "./three/Experience"

const host = window.__STATOZ_HOST__
const root = createRoot(document.getElementById("root")!)
let disposed = false
let ready = false
let lastResult: unknown = null

function exit() {
  clearControls()
  engineSound.setActive(false)
  host.emit("exit")
}

function Exit() {
  useEffect(exit, [])
  return null
}

function Game() {
  useFontsLoader()
  return (
    <>
      <CanvasBoundary>
        <Experience onSelect={slug => useRaceStore.getState().setSlug(slug)} />
      </CanvasBoundary>
      <main id="main" tabIndex={-1}>
        <Routes>
          <Route path="/race/:slug?" element={<RacePage />} />
          <Route path="*" element={<Exit />} />
        </Routes>
      </main>
    </>
  )
}

const unsubscribeScene = useStore.subscribe(state => {
  if (state.sceneReady && !ready) {
    ready = true
    host.emit("ready", { runtime: "portfolio-formula", source: "figma-261:2" })
  }
})
const unsubscribeRace = useRaceStore.subscribe(state => {
  if (!state.result || state.result === lastResult) return
  lastResult = state.result
  host.result({
    id: `${host.sessionId}-${state.raceId}`,
    carId: state.result.slug,
    position: state.result.position,
    time: state.result.time,
    laps: state.result.laps,
    bestLap: state.result.bestLap,
    mode: state.config?.mode,
    circuit: state.result.circuit,
    careerEventId: state.config?.careerEventId,
  })
})

// Read-only diagnostics for automated runtime checks, without shipping drive cheats.
window.__PORTFOLIO_FORMULA__ = () => {
  const race = useRaceStore.getState()
  return {
    ready: useStore.getState().sceneReady,
    phase: race.phase,
    menu: race.menu,
    mode: race.mode,
    circuit: race.config?.circuit ?? race.circuit,
    career: { tier: race.career.active?.tier ?? 0, round: race.career.active?.results.length ?? 0, unlockedTier: race.career.unlockedTier, best: race.career.best },
    grid: race.config?.grid ?? [],
    saveWarning: race.saveWarning,
    paused: race.paused,
    settingsOpen: race.settingsOpen,
    car: race.slug,
    laps: race.config?.laps ?? race.laps,
    difficulty: race.config?.difficulty ?? race.difficulty,
    camera: race.camera,
    racingLine: race.racingLine,
    autoThrottle: race.autoThrottle,
    speed: telemetry.speed,
    lap: telemetry.lap,
    time: telemetry.raceTime,
    quality: useStore.getState().quality,
    touch: { ...controls.touch },
  }
}

host.command = type => {
  if (disposed) return
  clearControls()
  if (type === "dispose") {
    disposed = true
    engineSound.setActive(false)
    unsubscribeScene()
    unsubscribeRace()
    root.unmount()
    delete window.__PORTFOLIO_FORMULA__
  } else if (type === "pause" || type === "resume") {
    useRaceStore.getState().setPaused(type === "pause")
  }
}

root.render(
  <MotionConfig reducedMotion="user">
    <LazyMotion features={domAnimation} strict>
      <MemoryRouter initialEntries={["/race/statoz"]}>
        <Game />
      </MemoryRouter>
    </LazyMotion>
  </MotionConfig>,
)
