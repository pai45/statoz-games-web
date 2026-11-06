import { caseStudies } from "@/data/caseStudies"
import { CIRCUITS, type CircuitId } from "./circuits"

export const CAREER_KEY = "statoz.portfolio-formula.career.v1"
export const TIERS = [
  { name: "Rookie", laps: 1, difficulty: "easy", paint: "Signal", color: "#f6f3e9", detail: "Find your line. Earn your place." },
  { name: "Club", laps: 3, difficulty: "medium", paint: "Copper", color: "#cc7844", detail: "Hold your nerve over three laps." },
  { name: "Pro", laps: 3, difficulty: "hard", paint: "Silverline", color: "#bac6d6", detail: "Every braking point matters." },
  { name: "Champion", laps: 5, difficulty: "expert", paint: "Goldleaf", color: "#e6bc52", detail: "Five laps. The fastest grid. Your title." },
] as const
export const POINTS = [10, 8, 6, 5, 4, 3, 2, 1] as const
export type CareerRound = { eventId: string; circuit: CircuitId; order: string[] }
export type Season = { id: number; tier: number; slug: string; seed: number; results: CareerRound[] }
export type Career = { version: 1; serial: number; unlockedTier: number; best: (number | null)[]; active: Season | null }
export const emptyCareer = (): Career => ({ version: 1, serial: 0, unlockedTier: 0, best: [null, null, null, null], active: null })
const slugs = caseStudies.map(c => c.slug)
const validInt = (v: unknown, lo: number, hi: number): v is number => typeof v === "number" && Number.isInteger(v) && v >= lo && v <= hi
const permutation = (v: unknown): v is string[] => Array.isArray(v) && v.length === 8 && new Set(v).size === 8 && v.every(s => slugs.includes(s))

export function validCareer(v: unknown): v is Career {
  if (!v || typeof v !== "object") return false
  const c = v as Career
  if (c.version !== 1 || !validInt(c.serial, 0, 1e9) || !validInt(c.unlockedTier, 0, 3) ||
    !Array.isArray(c.best) || c.best.length !== 4 || !c.best.every(r => r === null || validInt(r, 1, 8))) return false
  if (c.active === null) return true
  const s = c.active
  return !!s && validInt(s.id, 1, c.serial) && validInt(s.tier, 0, c.unlockedTier) && slugs.includes(s.slug) &&
    validInt(s.seed, 0, 0xffffffff) && Array.isArray(s.results) && s.results.length <= 3 &&
    s.results.every((r, i) => r && r.eventId === `${s.id}:${i}` && r.circuit === CIRCUITS[i].id && permutation(r.order))
}

export function standings(season: Season) {
  return slugs.map(slug => {
    const finishes = season.results.map(r => r.order.indexOf(slug) + 1)
    return { slug, points: finishes.reduce((sum, p) => sum + POINTS[p - 1], 0), finishes }
  }).sort((a, b) => {
    if (a.points !== b.points) return b.points - a.points
    for (let p = 1; p <= 8; p++) {
      const diff = b.finishes.filter(f => f === p).length - a.finishes.filter(f => f === p).length
      if (diff) return diff
    }
    return (a.finishes.at(-1) ?? slugs.indexOf(a.slug)) - (b.finishes.at(-1) ?? slugs.indexOf(b.slug))
  })
}

export function beginSeason(c: Career, tier: number, slug: string, seed: number): Career {
  if (!validInt(tier, 0, c.unlockedTier) || !slugs.includes(slug) || (c.active && c.active.results.length < 3)) return c
  const id = c.serial + 1
  return { ...c, serial: id, active: { id, tier, slug, seed: seed >>> 0, results: [] } }
}

/** One complete event is committed once; rewards and standings share the same save. */
export function completeRound(c: Career, eventId: string, order: string[]): Career {
  const s = c.active
  if (!s || s.results.length >= 3 || eventId !== `${s.id}:${s.results.length}` || !permutation(order)) return c
  const active = { ...s, results: [...s.results, { eventId, circuit: CIRCUITS[s.results.length].id, order: [...order] }] }
  if (active.results.length < 3) return { ...c, active }
  const rank = standings(active).findIndex(r => r.slug === s.slug) + 1
  const best = [...c.best]
  best[s.tier] = Math.min(best[s.tier] ?? 8, rank)
  return { ...c, active, best, unlockedTier: rank <= 3 ? Math.max(c.unlockedTier, Math.min(3, s.tier + 1)) : c.unlockedTier }
}

export function loadCareer(): { career: Career; warning: string; writable: boolean } {
  try {
    const raw = localStorage.getItem(CAREER_KEY)
    if (!raw) return { career: emptyCareer(), warning: "", writable: true }
    const parsed: unknown = JSON.parse(raw)
    if (validCareer(parsed)) return { career: parsed, warning: "", writable: true }
  } catch { /* Preserve invalid data and try the last valid backup. */ }
  try {
    const backup: unknown = JSON.parse(localStorage.getItem(`${CAREER_KEY}.backup`) ?? "null")
    if (validCareer(backup)) return { career: backup, warning: "Recovered the last valid career save. Progress from this visit stays in memory; the original save is preserved.", writable: false }
  } catch { /* Storage may be unavailable. */ }
  return { career: emptyCareer(), warning: "Career storage is unavailable or incompatible. Progress from this visit stays in memory; existing data is preserved.", writable: false }
}

export function saveCareer(career: Career, writable: boolean): string {
  if (!writable) return ""
  try {
    const old = localStorage.getItem(CAREER_KEY)
    if (old && validCareer(JSON.parse(old))) localStorage.setItem(`${CAREER_KEY}.backup`, old)
    localStorage.setItem(CAREER_KEY, JSON.stringify(career))
    return ""
  } catch { return "Career could not save. Keep this game open to retain your current progress." }
}
