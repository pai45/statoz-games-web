import type { SectorTone } from "./types"

export type CarDot = {
  slug: string
  x: number
  z: number
  player: boolean
}

/**
 * Per-frame race values written by the 3D race director and read by the HUD
 * in its own animation-frame loop (no React re-render per frame).
 */
export const telemetry = {
  /** m/s */
  speed: 0,
  gear: 0,
  /** 0–1 within the current gear */
  rpm: 0,
  throttle: 0,
  brake: 0,
  lap: 0,
  lapTime: 0,
  lastLap: null as number | null,
  bestLap: null as number | null,
  sectorTimes: [null, null, null] as (number | null)[],
  sectorTones: [null, null, null] as (SectorTone | null)[],
  raceTime: 0,
  topSpeed: 0,
  reaction: null as number | null,
  offTrack: false,
  wrongWay: false,
  stuck: false,
  dots: [] as CarDot[],
}

export function resetTelemetry() {
  telemetry.speed = 0
  telemetry.gear = 0
  telemetry.rpm = 0
  telemetry.throttle = 0
  telemetry.brake = 0
  telemetry.lap = 0
  telemetry.lapTime = 0
  telemetry.lastLap = null
  telemetry.bestLap = null
  telemetry.sectorTimes = [null, null, null]
  telemetry.sectorTones = [null, null, null]
  telemetry.raceTime = 0
  telemetry.topSpeed = 0
  telemetry.reaction = null
  telemetry.offTrack = false
  telemetry.wrongWay = false
  telemetry.stuck = false
}

/** One-shot commands from the DOM to the race director. */
export const raceCommands = {
  reset: false,
}
