import { create } from "zustand"
import { caseStudies } from "@/data/caseStudies"
import { engineSound } from "./audio"
import { CIRCUITS, isCircuit, seededGrid, type CircuitId } from "./circuits"
import { TIERS, beginSeason, completeRound, loadCareer, saveCareer, type Career } from "./career"

/**
 * Race mode state shared by the DOM (setup, HUD, results) and the 3D race
 * director. Per-frame values live in `telemetry` instead, so the HUD can read
 * them without re-rendering React every frame.
 */

export type RacePhase = "select" | "grid" | "lights" | "racing" | "finished" | "results"
export type Difficulty = "easy" | "medium" | "hard" | "expert"
export type MenuScreen = "lobby" | "quick" | "career"
export type RaceConfig = Readonly<{
  mode: "quick" | "career"; circuit: CircuitId; laps: number; difficulty: Difficulty
  seed: number; grid: readonly string[]; careerEventId?: string; slug: string; paint: number
}>
export type CameraMode = "chase" | "onboard"
export type MessageTone = "neutral" | "go" | "purple" | "green" | "warning" | "flag"

export const LAP_OPTIONS = [1, 3, 5] as const
type DifficultyOption = {
  value: Difficulty
  label: string
}

export const DIFFICULTIES: DifficultyOption[] = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
]

export type Standing = {
  slug: string
  position: number
  /** current lap (1-based) */
  lap: number
  /** seconds to the car ahead; null for the leader */
  interval: number | null
  finished: boolean
  player: boolean
}

export type ClassificationRow = {
  slug: string
  position: number
  time: number
  /** seconds behind the winner; null for the winner */
  gap: number | null
  bestLap: number | null
  player: boolean
}

export type RaceResult = {
  circuit: CircuitId
  slug: string
  laps: number
  difficulty: Difficulty
  rows: ClassificationRow[]
  position: number
  time: number
  bestLap: number | null
  reaction: number | null
  /** m/s */
  topSpeed: number
  fastestLap: boolean
  record: {
    race: boolean
    lap: boolean
    previousRace: number | null
    previousLap: number | null
  }
}

export type RaceMessage = {
  id: number
  title: string
  detail?: string
  tone: MessageTone
}

export type TrackMap = {
  path: string
  width: number
  height: number
  originX: number
  originY: number
  start: {
    x: number
    y: number
  }
}

type Settings = {
  circuit: CircuitId
  paint: number
  laps: number
  difficulty: Difficulty
  sound: boolean
  autoThrottle: boolean
  camera: CameraMode
  /** braking-zone racing line painted on the track */
  racingLine: boolean
}

const SETTINGS_KEY = "statoz.portfolio-formula.settings.v1"

function defaultSettings(): Settings {
  const coarse =
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: coarse)").matches
  return {
    circuit: "night",
    paint: -1,
    laps: 3,
    difficulty: "medium",
    sound: true,
    autoThrottle: coarse,
    camera: "chase",
    racingLine: true,
  }
}

function loadSettings(): Settings {
  const base = defaultSettings()
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (!raw) return base
    const saved = JSON.parse(raw) as Partial<Settings>
    return {
      circuit: isCircuit(saved.circuit) ? saved.circuit : "night",
      paint: typeof saved.paint === "number" && Number.isInteger(saved.paint) && saved.paint >= -1 && saved.paint < 4 ? saved.paint : -1,
      laps: LAP_OPTIONS.includes(saved.laps as 1 | 3 | 5)
        ? saved.laps!
        : base.laps,
      difficulty: DIFFICULTIES.some((d) => d.value === saved.difficulty)
        ? saved.difficulty!
        : base.difficulty,
      sound: typeof saved.sound === "boolean" ? saved.sound : base.sound,
      autoThrottle:
        typeof saved.autoThrottle === "boolean"
          ? saved.autoThrottle
          : base.autoThrottle,
      camera: saved.camera === "onboard" ? "onboard" : "chase",
      racingLine:
        typeof saved.racingLine === "boolean"
          ? saved.racingLine
          : base.racingLine,
    }
  } catch {
    return base
  }
}

function persist(s: Settings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(s))
  } catch {
    /* storage unavailable */
  }
}

type RaceState = Settings & {
  menu: MenuScreen
  mode: "quick" | "career"
  config: RaceConfig | null
  career: Career
  saveWarning: string
  careerWritable: boolean
  openMenu: (menu: MenuScreen) => void
  newSeason: (tier: number) => void
  setCircuit: (circuit: CircuitId) => void
  setPaint: (paint: number) => void
  phase: RacePhase
  paused: boolean
  /** the player's car */
  slug: string
  /** bumps on every start/restart so the director rebuilds the race */
  raceId: number
  /** laps and rivals of the race under way, fixed when it starts: changes in
   *  the settings dialog wait for the next start */
  raceLaps: number
  raceDifficulty: Difficulty
  standings: Standing[]
  message: RaceMessage | null
  result: RaceResult | null
  /** the settings dialog is showing (over the setup, pause or results screen) */
  settingsOpen: boolean
  trackMap: TrackMap | null
  setSlug: (slug: string) => void
  setLaps: (laps: number) => void
  setDifficulty: (difficulty: Difficulty) => void
  setSound: (sound: boolean) => void
  setAutoThrottle: (on: boolean) => void
  setRacingLine: (on: boolean) => void
  toggleCamera: () => void
  setSettingsOpen: (open: boolean) => void
  start: () => void
  backToSelect: () => void
  setPhase: (phase: RacePhase) => void
  setPaused: (paused: boolean) => void
  notify: (title: string, tone?: MessageTone, detail?: string) => void
  setStandings: (standings: Standing[]) => void
  finish: (result: RaceResult) => void
  setTrackMap: (map: TrackMap) => void
}

let messageId = 0

const settingsOf = (s: RaceState): Settings => ({
  circuit: s.circuit,
  paint: s.paint,
  laps: s.laps,
  difficulty: s.difficulty,
  sound: s.sound,
  autoThrottle: s.autoThrottle,
  camera: s.camera,
  racingLine: s.racingLine,
})

const initialSettings = loadSettings()
const initialCareer = loadCareer()

export const useRaceStore = create<RaceState>((set, get) => ({
  ...initialSettings,
  menu: "lobby",
  mode: "quick",
  config: null,
  career: initialCareer.career,
  saveWarning: initialCareer.warning,
  careerWritable: initialCareer.writable,
  openMenu: (menu) => {
    const s = get()
    set({ menu, mode: menu === "career" ? "career" : "quick", phase: "select", paused: false,
      settingsOpen: false, config: null, result: null, standings: [], message: null,
      ...(menu === "career" && s.career.active ? { slug: s.career.active.slug } : {}) })
  },
  newSeason: (tier) => {
    const s = get()
    const career = beginSeason(s.career, tier, s.slug, Math.floor(Math.random() * 0x100000000))
    if (career === s.career) return
    const warning = saveCareer(career, s.careerWritable)
    set({ career, ...(warning ? { saveWarning: warning } : {}) })
  },
  setCircuit: (circuit) => {
    if (!isCircuit(circuit)) return
    set({ circuit }); persist(settingsOf(get()))
  },
  setPaint: (paint) => {
    if (!Number.isInteger(paint) || paint < -1 || paint > 3 || (paint >= 0 && get().career.best[paint] === null)) return
    set({ paint }); persist(settingsOf(get()))
  },
  phase: "select",
  paused: false,
  slug: caseStudies[0].slug,
  raceId: 0,
  raceLaps: initialSettings.laps,
  raceDifficulty: initialSettings.difficulty,
  standings: [],
  message: null,
  result: null,
  settingsOpen: false,
  trackMap: null,
  setSlug: (slug) => {
    if (get().mode === "career" && get().career.active && get().career.active!.results.length < 3) return
    if (get().slug !== slug && caseStudies.some((c) => c.slug === slug))
      set({ slug })
  },
  setLaps: (laps) => {
    set({ laps })
    persist(settingsOf(get()))
  },
  setDifficulty: (difficulty) => {
    set({ difficulty })
    persist(settingsOf(get()))
  },
  setSound: (sound) => {
    set({ sound })
    persist(settingsOf(get()))
    // always called from a user gesture, so audio may start here
    if (sound) engineSound.start()
  },
  setAutoThrottle: (autoThrottle) => {
    set({ autoThrottle })
    persist(settingsOf(get()))
  },
  setRacingLine: (racingLine) => {
    set({ racingLine })
    persist(settingsOf(get()))
  },
  toggleCamera: () => {
    set({ camera: get().camera === "chase" ? "onboard" : "chase" })
    persist(settingsOf(get()))
  },
  setSettingsOpen: (settingsOpen) => {
    if (get().settingsOpen !== settingsOpen) set({ settingsOpen })
  },
  start: () => {
    const s = get()
    const season = s.career.active
    if (s.mode === "career" && (!season || season.results.length >= 3)) return
    const restarting = s.phase !== "select" && s.phase !== "results"
    const seed = s.mode === "career" ? (season!.seed + season!.results.length * 7919) >>> 0
      : restarting && s.config ? s.config.seed : Math.floor(Math.random() * 0x100000000)
    const tier = s.mode === "career" ? TIERS[season!.tier] : null
    const config: RaceConfig = restarting && s.config ? s.config : Object.freeze({
      mode: s.mode, circuit: tier ? CIRCUITS[season!.results.length].id : s.circuit,
      laps: tier?.laps ?? s.laps, difficulty: tier?.difficulty ?? s.difficulty, seed,
      grid: Object.freeze(seededGrid(caseStudies.map(c => c.slug), seed)),
      slug: tier ? season!.slug : s.slug,
      paint: s.paint >= 0 && s.career.best[s.paint] !== null ? s.paint : -1,
      ...(tier ? { careerEventId: `${season!.id}:${season!.results.length}` } : {}),
    })
    // Start / Race again / Restart are user gestures: unlock audio now
    if (get().sound) engineSound.start()
    set((s) => ({
      phase: "grid",
      paused: false,
      settingsOpen: false,
      raceId: s.raceId + 1,
      config,
      slug: config.slug,
      raceLaps: config.laps,
      raceDifficulty: config.difficulty,
      standings: [],
      message: null,
      result: null,
    }))
  },
  backToSelect: () =>
    set({
      menu: get().mode === "career" ? "career" : "quick",
      config: null,
      phase: "select",
      paused: false,
      settingsOpen: false,
      standings: [],
      message: null,
      result: null,
    }),
  setPhase: (phase) => {
    if (get().phase !== phase) set({ phase })
  },
  setPaused: (paused) => {
    if (get().paused !== paused) set({ paused })
  },
  notify: (title, tone = "neutral", detail) =>
    set({ message: { id: ++messageId, title, detail, tone } }),
  setStandings: (standings) => set({ standings }),
  finish: (result) => {
    const s = get()
    if (s.phase === "results") return
    const career = s.config?.mode === "career" && s.config.careerEventId
      ? completeRound(s.career, s.config.careerEventId, result.rows.map(r => r.slug)) : s.career
    const warning = career !== s.career ? saveCareer(career, s.careerWritable) : ""
    set({ result, phase: "results", career, ...(warning ? { saveWarning: warning } : {}) })
  },
  setTrackMap: (trackMap) => set({ trackMap }),
}))
