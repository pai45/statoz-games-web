import { useSyncExternalStore } from 'react'
import type { CareerSave, Rewards } from '../data/career'
import type { QualitySetting } from '../game/engine/quality'
import type { ContestConfig, ContestResult, Difficulty, GameMode, JerseyStyle, MatchConfig, MatchResult, PlayerProfile } from '../game/types'
import { loadRecords, loadSettings, loadSlots, saveCareer, saveRecords, saveSettings, type Records } from './persistence'

export interface Settings {
  quality: QualitySetting
  resolution: number
  shake: boolean
  sfx: number
  crowd: number
  music: number
  vibration: boolean
  hints: boolean
  difficulty: Difficulty
  leftHanded: boolean
  /** Broadcast commentary volume (0 turns the booth off). */
  commentary: number
  /** Show commentary captions on screen. */
  captions: boolean
  /** Gameplay camera preset. */
  camera: CameraPreset
}

export type CameraPreset = 'broadcast' | 'close' | 'high'

export const DEFAULT_SETTINGS: Settings = {
  quality: 'auto',
  resolution: 1,
  shake: true,
  sfx: 0.9,
  crowd: 0.7,
  music: 0.45,
  vibration: true,
  hints: true,
  difficulty: 'pro',
  leftHanded: false,
  commentary: 0.8,
  captions: true,
  camera: 'broadcast',
}

export type Session =
  | { kind: 'match'; config: MatchConfig; origin: 'quick' | 'career'; eventId?: string }
  | { kind: 'contest'; config: ContestConfig; origin: 'quick' | 'career'; eventId?: string; jersey?: JerseyStyle }

export type CareerTab = 'home' | 'upgrade' | 'season' | 'stats' | 'locker' | 'inbox'

export type Screen =
  | { id: 'title' }
  | { id: 'menu' }
  | { id: 'quick'; mode?: GameMode }
  | { id: 'contestSetup' }
  | { id: 'settings'; from: Screen }
  | { id: 'game'; session: Session }
  | { id: 'results'; session: Session; result: MatchResult; rewards?: Rewards }
  | { id: 'contestResults'; session: Session; result: ContestResult; rewards?: Rewards }
  | { id: 'careerSlots' }
  | { id: 'careerCreate'; slot: number }
  | { id: 'career'; tab: CareerTab }
  | { id: 'draft' }
  | { id: 'offseason' }

export interface AppState {
  screen: Screen
  settings: Settings
  slots: (CareerSave | null)[]
  career: CareerSave | null
  records: Records
  /** Incremented to force the 3D menu showcase to refresh its featured player. */
  showcaseKey: number
  /** Player shown on the creator turntable while building a career player. */
  preview: { profile: PlayerProfile; jersey: JerseyStyle } | null
}

type Listener = () => void

function createStore() {
  const slots = loadSlots()
  let state: AppState = {
    screen: { id: 'title' },
    settings: { ...DEFAULT_SETTINGS, ...loadSettings() },
    slots,
    career: null,
    records: loadRecords(),
    showcaseKey: 0,
    preview: null,
  }
  const listeners = new Set<Listener>()
  return {
    get: () => state,
    set(patch: Partial<AppState> | ((s: AppState) => Partial<AppState>)) {
      const p = typeof patch === 'function' ? patch(state) : patch
      state = { ...state, ...p }
      for (const l of listeners) l()
    },
    subscribe(l: Listener) {
      listeners.add(l)
      return () => listeners.delete(l)
    },
  }
}

export const store = createStore()

export function useStore<T>(sel: (s: AppState) => T): T {
  return useSyncExternalStore(store.subscribe, () => sel(store.get()), () => sel(store.get()))
}

export function go(screen: Screen) {
  store.set({ screen })
}

export function updateSettings(patch: Partial<Settings>) {
  const settings = { ...store.get().settings, ...patch }
  saveSettings(settings)
  store.set({ settings })
}

/** Persist and activate a career save. */
export function commitCareer(save: CareerSave) {
  saveCareer(save)
  const slots = [...store.get().slots]
  slots[save.slot] = save
  store.set({ career: save, slots })
}

export function updateRecords(patch: Partial<Records>) {
  const records = { ...store.get().records, ...patch }
  saveRecords(records)
  store.set({ records })
}
