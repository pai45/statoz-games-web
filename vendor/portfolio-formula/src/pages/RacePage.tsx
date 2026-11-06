import { useEffect } from "react"
import { useNavigate, useParams } from "react-router"
import { getCaseStudy } from "@/data/caseStudies"
import { useStore } from "@/state/store"
import { useRaceStore } from "@/race/raceStore"
import { clearControls, controls, driveKey, onPadAction } from "@/race/controls"
import { raceCommands, telemetry } from "@/race/telemetry"
import { FormulaMenu } from "@/components/race/FormulaMenu"
import { RaceHud } from "@/components/race/RaceHud"
import { RacePause } from "@/components/race/RacePause"
import { FormulaResults } from "@/components/race/FormulaResults"
import { RaceSettings } from "@/components/race/RaceSettings"
import { RaceUnavailable } from "@/components/race/RaceUnavailable"

/**
 * Race mode. The persistent grid scene swaps its straight for the full
 * circuit; this page layers the setup, HUD, pause and results UI on top.
 */
export default function RacePage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const phase = useRaceStore((s) => s.phase)
  const paused = useRaceStore((s) => s.paused)
  const settingsOpen = useRaceStore((s) => s.settingsOpen)
  const selected = useRaceStore((s) => s.slug)
  const canvasFailed = useStore((s) => s.canvasFailed)

  useEffect(() => {
    const store = useStore.getState()
    store.setMode("race")
    store.setHovered(null)
    return () => {
      useRaceStore.getState().backToSelect()
      useStore.getState().setMode("portfolio")
      clearControls()
    }
  }, [])

  // development aid for automated checks: a snapshot of the race state
  useEffect(() => {
    if (!import.meta.env.DEV) return
    const w = window as unknown as { __race?: () => unknown }
    w.__race = () => {
      const s = useRaceStore.getState()
      return {
        phase: s.phase,
        paused: s.paused,
        slug: s.slug,
        position: s.standings.find((r) => r.player)?.position ?? null,
        lap: telemetry.lap,
        kmh: Math.round(telemetry.speed * 3.6),
        gear: telemetry.gear,
        t: Number(telemetry.raceTime.toFixed(2)),
        lights: useStore.getState().lights,
        msg: s.message?.title ?? null,
        offTrack: telemetry.offTrack,
        result: s.result
          ? {
              position: s.result.position,
              time: Number(s.result.time.toFixed(2)),
            }
          : null,
      }
    }
    return () => {
      delete w.__race
    }
  }, [])

  // the URL picks the car (deep links from case studies)…
  useEffect(() => {
    if (!slug) return
    if (getCaseStudy(slug)) useRaceStore.getState().setSlug(slug)
    else navigate("/race", { replace: true })
  }, [slug, navigate])

  // …the camera frames the picked car on the grid…
  useEffect(() => {
    if (phase === "select")
      useStore.getState().setShot({ kind: "car", slug: selected })
  }, [phase, selected])

  // …and picking a car updates the URL. The store is read directly: on the
  // first render `selected` can still hold the previous car and would bounce
  // the URL back to it.
  useEffect(() => {
    if (phase !== "select") return
    const current = useRaceStore.getState().slug
    if (slug !== current)
      navigate(`/race/${current}`, { replace: true, preventScrollReset: true })
  }, [phase, selected, slug, navigate])

  const racing = phase !== "select"

  // driving keys and race commands
  useEffect(() => {
    if (!racing) return
    const race = useRaceStore.getState
    const onDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (race().phase === "results") return
      // with the settings dialog open, Esc closes it and the race ignores the rest
      if (race().settingsOpen) {
        if (e.code === "Escape" && !e.repeat) {
          e.preventDefault()
          race().setSettingsOpen(false)
        }
        return
      }
      if (race().paused && e.code !== "Escape" && e.code !== "KeyP") return
      const key = driveKey(e.code)
      if (key) {
        e.preventDefault()
        controls.key[key] = true
        return
      }
      if (e.repeat) return
      const { phase: p, paused: isPaused } = race()
      const live =
        p === "grid" || p === "lights" || p === "racing" || p === "finished"
      if (e.code === "Escape" || e.code === "KeyP") {
        if (!live) return
        e.preventDefault()
        race().setPaused(!isPaused)
      } else if (isPaused) {
        return
      } else if (e.code === "KeyC") {
        race().toggleCamera()
      } else if (e.code === "KeyR") {
        raceCommands.reset = true
      } else if (e.code === "KeyM") {
        race().setSound(!race().sound)
      } else if (e.code === "Space") {
        e.preventDefault()
      }
    }
    const onUp = (e: KeyboardEvent) => {
      const key = driveKey(e.code)
      if (key) controls.key[key] = false
    }
    const pauseIfLive = () => {
      clearControls()
      const p = race().phase
      if (p === "grid" || p === "lights" || p === "racing")
        race().setPaused(true)
    }
    const onVisibility = () => {
      if (document.hidden) pauseIfLive()
    }
    const offPad = onPadAction((action) => {
      const r = race()
      if (r.settingsOpen) {
        if (action === "pause") r.setSettingsOpen(false)
        return
      }
      if (action === "pause") r.setPaused(!r.paused)
      else if (r.paused) return
      else if (action === "camera") r.toggleCamera()
      else if (action === "reset") raceCommands.reset = true
    })
    window.addEventListener("keydown", onDown)
    window.addEventListener("keyup", onUp)
    window.addEventListener("blur", pauseIfLive)
    document.addEventListener("visibilitychange", onVisibility)
    // no page scrolling or pull-to-refresh while racing
    const root = document.documentElement
    const previous = root.style.overflow
    const previousOverscroll = root.style.overscrollBehavior
    root.style.overflow = "hidden"
    root.style.overscrollBehavior = "none"
    return () => {
      window.removeEventListener("keydown", onDown)
      window.removeEventListener("keyup", onUp)
      window.removeEventListener("blur", pauseIfLive)
      document.removeEventListener("visibilitychange", onVisibility)
      offPad()
      root.style.overflow = previous
      root.style.overscrollBehavior = previousOverscroll
      clearControls()
    }
  }, [racing])

  if (canvasFailed) return <RaceUnavailable />

  return (
    <>
      {racing && phase !== "results" ? <RaceHud /> : !racing ? <FormulaMenu /> : null}
      {paused && racing && <RacePause />}
      {phase === "results" && <FormulaResults />}
      {settingsOpen && <RaceSettings />}
    </>
  )
}
