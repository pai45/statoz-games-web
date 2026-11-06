/** 83.456 → "1:23.456" */
export function formatLap(seconds: number | null | undefined) {
  if (seconds === null || seconds === undefined || !Number.isFinite(seconds))
    return "–:––.–––"
  const total = Math.max(0, seconds)
  const m = Math.floor(total / 60)
  const s = total - m * 60
  return `${m}:${s.toFixed(3).padStart(6, "0")}`
}

/** 1.2345 → "+1.235" */
export function formatGap(seconds: number | null | undefined) {
  if (seconds === null || seconds === undefined || !Number.isFinite(seconds))
    return ""
  if (seconds >= 60) return `+${formatLap(seconds)}`
  return `+${seconds.toFixed(3)}`
}

export const toKmh = (metresPerSecond: number) =>
  Math.max(0, Math.round(metresPerSecond * 3.6))

export function ordinal(n: number) {
  const rem100 = n % 100
  if (rem100 >= 11 && rem100 <= 13) return `${n}th`
  return `${n}${["th", "st", "nd", "rd"][n % 10] ?? "th"}`
}
