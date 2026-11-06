import { isCircuit, type CircuitId } from "./circuits"

const KEY = "statoz.portfolio-formula.records.v2"
const LEGACY = "statoz.portfolio-formula.records.v1"
type CarRecords = { lap?: number; races?: Record<string, number> }
type Store = Partial<Record<CircuitId, Record<string, CarRecords>>>
type Envelope = { version: 2; circuits: Store }
const positive = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v) && v > 0
function validCars(value: unknown): value is Record<string, CarRecords> {
  return !!value && typeof value === "object" && !Array.isArray(value) && Object.values(value).every(c =>
    c && typeof c === "object" && (c.lap === undefined || positive(c.lap)) &&
    (c.races === undefined || (c.races && typeof c.races === "object" && !Array.isArray(c.races) &&
      Object.entries(c.races).every(([laps, t]) => ["1", "3", "5"].includes(laps) && positive(t)))))
}
function read(): { store: Store; writable: boolean } {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const data = JSON.parse(raw) as Envelope
      if (data.version !== 2 || !data.circuits || typeof data.circuits !== "object" || Array.isArray(data.circuits) ||
        !Object.entries(data.circuits).every(([id, cars]) => isCircuit(id) && validCars(cars))) return { store: {}, writable: false }
      return { store: data.circuits, writable: true }
    }
    const legacy = localStorage.getItem(LEGACY)
    if (legacy) {
      const cars: unknown = JSON.parse(legacy)
      if (!validCars(cars)) return { store: {}, writable: false }
      const store = { night: cars }
      localStorage.setItem(KEY, JSON.stringify({ version: 2, circuits: store }))
      return { store, writable: true }
    }
    return { store: {}, writable: true }
  } catch { return { store: {}, writable: false } }
}
export type RaceRecord = { race: number | null; lap: number | null }
export function readRecord(slug: string, laps: number, circuit: CircuitId = "night"): RaceRecord {
  const entry = read().store[circuit]?.[slug]
  return { race: entry?.races?.[String(laps)] ?? null, lap: entry?.lap ?? null }
}
export function saveRecord(slug: string, laps: number, race: number, lap: number | null, circuit: CircuitId = "night") {
  const { store, writable } = read()
  const cars = (store[circuit] ??= {})
  const entry = (cars[slug] ??= {})
  const previous = { race: entry.races?.[String(laps)] ?? null, lap: entry.lap ?? null }
  const improvedRace = positive(race) && (previous.race === null || race < previous.race)
  const improvedLap = positive(lap) && (previous.lap === null || lap < previous.lap)
  if (improvedRace) (entry.races ??= {})[String(laps)] = race
  if (improvedLap) entry.lap = lap!
  if (writable) {
    try { localStorage.setItem(KEY, JSON.stringify({ version: 2, circuits: store })) } catch { /* Bests remain optional. */ }
  }
  return { race: improvedRace, lap: improvedLap, previous }
}
