import type { CareerSave } from '../data/career'
import type { Settings } from './store'

const SLOT_KEY = (i: number) => `hoop-legacy:career:${i}`
const SETTINGS_KEY = 'hoop-legacy:settings'
const RECORDS_KEY = 'hoop-legacy:records'
export const SLOT_COUNT = 3

function read<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

export function loadSlots(): (CareerSave | null)[] {
  return Array.from({ length: SLOT_COUNT }, (_, i) => {
    const s = read<CareerSave>(SLOT_KEY(i))
    return s && s.version === 1 ? s : null
  })
}

export function saveCareer(save: CareerSave) {
  return write(SLOT_KEY(save.slot), save)
}

export function deleteCareer(slot: number) {
  try {
    localStorage.removeItem(SLOT_KEY(slot))
  } catch {
    /* storage unavailable */
  }
}

export function loadSettings(): Partial<Settings> {
  return read<Partial<Settings>>(SETTINGS_KEY) ?? {}
}

export function saveSettings(s: Settings) {
  write(SETTINGS_KEY, s)
}

export interface Records {
  contestBest: number
  quickWins: number
  quickLosses: number
}

export function loadRecords(): Records {
  return { contestBest: 0, quickWins: 0, quickLosses: 0, ...(read<Partial<Records>>(RECORDS_KEY) ?? {}) }
}

export function saveRecords(r: Records) {
  write(RECORDS_KEY, r)
}
