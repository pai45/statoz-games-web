import { create } from "zustand"

type OverviewShot = {
  kind: "overview"
}

type CarShot = {
  kind: "car"
  slug: string
}

type DetailShot = {
  kind: "detail"
  slug: string
}

type AerialShot = {
  kind: "aerial"
}

/** A season of career mode, staged on the set past the end of the grid. */
type CareerShot = {
  kind: "career"
  stage: number
  /** establishing shot of the whole set (the career intro) */
  wide?: boolean
}

/** Expertise: his tools stacked into his race number, further down the straight. */
type ExpertiseShot = {
  kind: "expertise"
}

/** The gallery: the camera runs along the wall of artwork beyond the pit wall. */
type GalleryShot = {
  kind: "gallery"
}

/** Contact: the finish line at the end of the straight, the podium and its trophy. */
type FinishShot = {
  kind: "finish"
}

export type Shot = OverviewShot | CarShot | DetailShot | AerialShot | CareerShot | ExpertiseShot | GalleryShot | FinishShot

/** A piece picked on the gallery wall, for the page to show full size. */
type ArtworkRequest = {
  index: number
  /** distinguishes repeat picks of the same piece */
  at: number
}

export type IntroState = "running" | "out" | "done"
export type Quality = "high" | "low"
export type SceneMode = "portfolio" | "race"

type State = {
  shot: Shot
  hovered: string | null
  /** number of start lights lit during the intro (0–5) */
  lights: number
  intro: IntroState
  sceneReady: boolean
  fontsVersion: number
  quality: Quality
  /** stop rendering while the canvas is fully covered by page content */
  paused: boolean
  /** the grid scene doubles as the race circuit */
  mode: SceneMode
  /** WebGL failed: the static backdrop is showing */
  canvasFailed: boolean
  /** phones: fraction of the screen covered by the docked card (0 when none) */
  sheet: number
  /**
   * Where the contact copy starts (CSS px from the top of the screen) once
   * the page is scrolled to its end: the finish fits its flag above it. 0
   * until measured.
   */
  contactTop: number
  artwork: ArtworkRequest | null
  setShot: (shot: Shot) => void
  setHovered: (slug: string | null) => void
  setLights: (lights: number) => void
  setIntro: (intro: IntroState) => void
  setSceneReady: () => void
  bumpFonts: () => void
  setQuality: (quality: Quality) => void
  setPaused: (paused: boolean) => void
  setMode: (mode: SceneMode) => void
  setCanvasFailed: () => void
  setSheet: (sheet: number) => void
  setContactTop: (top: number) => void
  showArtwork: (index: number) => void
}

const sameShot = (a: Shot, b: Shot) =>
  a.kind === b.kind &&
  ("slug" in a ? a.slug : "") === ("slug" in b ? b.slug : "") &&
  ("stage" in a ? a.stage : -1) === ("stage" in b ? b.stage : -1) &&
  ("wide" in a && !!a.wide) === ("wide" in b && !!b.wide)

const params = new URLSearchParams(window.location.search)
const forcedQuality = params.get("quality")

/** `?quality=high|low` pins the render quality (useful for testing and demos). */
export const QUALITY_LOCKED =
  forcedQuality === "high" || forcedQuality === "low"

/** Touch devices and small screens start on the lightweight render path. */
function initialQuality(): Quality {
  if (forcedQuality === "high" || forcedQuality === "low") return forcedQuality
  const coarse = window.matchMedia("(pointer: coarse)").matches
  return coarse || window.innerWidth < 768 ? "low" : "high"
}

/** The start-light intro plays once per session, only when landing on the grid. */

export const useStore = create<State>((set, get) => ({
  shot: { kind: "overview" },
  hovered: null,
  lights: 0,
  intro: "done",
  sceneReady: false,
  fontsVersion: 0,
  quality: initialQuality(),
  paused: false,
  mode: "race",
  canvasFailed: false,
  sheet: 0,
  contactTop: 0,
  artwork: null,
  setShot: (shot) => {
    if (!sameShot(get().shot, shot)) set({ shot })
  },
  setHovered: (hovered) => {
    if (get().hovered !== hovered) set({ hovered })
  },
  setLights: (lights) => set({ lights }),
  setIntro: (intro) => set({ intro }),
  setSceneReady: () => set({ sceneReady: true }),
  bumpFonts: () => set((s) => ({ fontsVersion: s.fontsVersion + 1 })),
  setQuality: (quality) => set({ quality }),
  setPaused: (paused) => {
    if (get().paused !== paused) set({ paused })
  },
  setMode: (mode) => {
    if (get().mode !== mode) set({ mode })
  },
  setCanvasFailed: () => set({ canvasFailed: true }),
  setSheet: (sheet) => {
    if (Math.abs(get().sheet - sheet) > 0.004) set({ sheet })
  },
  setContactTop: (contactTop) => {
    if (Math.abs(get().contactTop - contactTop) > 1) set({ contactTop })
  },
  showArtwork: (index) => set({ artwork: { index, at: performance.now() } }),
}))
