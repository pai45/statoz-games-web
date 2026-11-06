import {
  KERB_WIDTH,
  ROAD_HALF_WIDTH,
  locate,
  pointAt,
  sampleAt,
  wrapS,
  type Track,
  type TrackLocation,
  type TrackPoint,
} from "./track"
import type { Difficulty } from "@/race/raceStore"
import type { SectorTone } from "@/race/types"

/**
 * Arcade race simulation. Every car — player and rivals — uses the same
 * kinematic bicycle model with a lateral grip limit, so corners have to be
 * braked for and rivals obey the same physics as the player. Pure logic: no
 * React, DOM or rendering, stepped at a fixed rate by the race director.
 */

export const CAR = {
  wheelbase: 3.6,
  halfLength: 2.75,
  halfWidth: 1.0,
  /** ≈ 310 km/h */
  topSpeed: 86,
  engine: 17,
  brake: 40,
  reverse: 6,
  reverseMax: 9,
  coast: 1.4,
  drag: 0.00042,
  maxSteer: 0.5,
  steerFalloff: 18,
  /** lateral acceleration limit on asphalt (≈ 3 g) */
  grip: 30,
  gripGrass: 11,
  grassTop: 30,
  grassDrag: 0.8,
}

export const STEP = 1 / 120

export type Controls = {
  throttle: number
  brake: number
  steer: number
}

export type SimCar = {
  slug: string
  player: boolean
  x: number
  z: number
  heading: number
  speed: number
  yawRate: number
  accel: number
  lateral: number
  prevX: number
  prevZ: number
  prevHeading: number
  loc: TrackLocation
  /** angle between the car and the track direction (rad, + = pointing left) */
  alpha: number
  /** forward crossings of the start line (0 on the grid, 1 during lap 1) */
  laps: number
  /** backward line crossings still to be undone before a crossing counts again */
  recross: number
  /** distance raced: (laps - 1) · length + s; negative on the grid */
  progress: number
  startProgress: number
  offTrack: boolean
  lapStart: number
  sectorStart: number
  /** index of the next sector boundary to cross (0, 1), or 2 for the line */
  sector: number
  sectorTimes: (number | null)[]
  sectorTones: (SectorTone | null)[]
  bestSectors: (number | null)[]
  lastLap: number | null
  bestLap: number | null
  finished: boolean
  finishTime: number | null
  topSpeed: number
  /** AI pace multiplier on the speed profile */
  skill: number
  reaction: number
  lane: number
  passSide: number
  passTimer: number
  /** the car being overtaken, if any */
  passing: SimCar | null
  /** seconds without car-to-car contact (after a reset) */
  ghost: number
  autopilot: boolean
  controls: Controls
}

export type RaceEvent = {
  type: "sector"
  car: SimCar
  sector: number
  time: number
  tone: SectorTone
} | {
  type: "lap"
  car: SimCar
  lap: number
  time: number
  tone: SectorTone
} | {
  type: "finish"
  car: SimCar
  time: number
  position: number
} | {
  type: "wall"
  car: SimCar
  strength: number
} | {
  type: "contact"
  car: SimCar
  strength: number
}

type RaceOptions = {
  laps: number
  difficulty: Difficulty
  seed: number
}

export type GridEntry = {
  slug: string
  x: number
  z: number
  player: boolean
}

/** Rival pace (fraction of the ideal speed profile) and how strongly the pack waits for / chases the player. */
const RIVALS: Record<Difficulty, {
  skill: [number, number]
  wait: number
  chase: number
}> = {
  easy: { skill: [0.68, 0.74], wait: 0.2, chase: 0 },
  medium: { skill: [0.79, 0.84], wait: 0.07, chase: 0.035 },
  hard: { skill: [0.88, 0.93], wait: 0.035, chase: 0.05 },
  expert: { skill: [0.94, 0.98], wait: 0.035, chase: 0.05 },
}

const clamp = (v: number, lo: number, hi: number) =>
  v < lo ? lo : v > hi ? hi : v

export function angleDiff(a: number, b: number) {
  let d = a - b
  while (d > Math.PI) d -= Math.PI * 2
  while (d < -Math.PI) d += Math.PI * 2
  return d
}

function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const CIRCLES = [-1.75, 0, 1.75]
const RADIUS = 1.05

export class RaceSim {
  readonly track: Track
  readonly laps: number
  readonly cars: SimCar[]
  readonly player: SimCar
  /** seconds since lights out */
  time = 0
  started = false
  events: RaceEvent[] = []
  bestLap: number | null = null
  bestSectors: (number | null)[] = [null, null, null]
  finishedCount = 0
  private point: TrackPoint = { x: 0, z: 0, heading: 0 }
  private rivals: typeof RIVALS[Difficulty]

  constructor(track: Track, grid: GridEntry[], options: RaceOptions) {
    this.track = track
    this.laps = options.laps
    const random = mulberry32(options.seed)
    this.rivals = RIVALS[options.difficulty]
    const [lo, hi] = this.rivals.skill
    this.cars = grid.map((entry) => {
      const loc: TrackLocation = { index: 0, s: 0, d: 0 }
      locate(track, entry.x, entry.z, -1, loc)
      const progress = loc.s - track.length
      return {
        slug: entry.slug,
        player: entry.player,
        x: entry.x,
        z: entry.z,
        heading: 0,
        speed: 0,
        yawRate: 0,
        accel: 0,
        lateral: 0,
        prevX: entry.x,
        prevZ: entry.z,
        prevHeading: 0,
        loc,
        alpha: 0,
        laps: 0,
        recross: 0,
        progress,
        startProgress: progress,
        offTrack: false,
        lapStart: 0,
        sectorStart: 0,
        sector: 2,
        sectorTimes: [null, null, null],
        sectorTones: [null, null, null],
        bestSectors: [null, null, null],
        lastLap: null,
        bestLap: null,
        finished: false,
        finishTime: null,
        topSpeed: 0,
        skill: lo + random() * (hi - lo),
        reaction: 0.16 + random() * 0.3,
        lane: (random() - 0.5) * 1.6,
        passSide: 0,
        passTimer: 0,
        passing: null,
        ghost: 0,
        autopilot: !entry.player,
        controls: { throttle: 0, brake: 0, steer: 0 },
      }
    })
    this.player = this.cars.find((c) => c.player) ?? this.cars[0]
  }

  /** Lights out. */
  start() {
    this.started = true
    this.time = 0
  }

  /** Advances the race by one fixed step. */
  step(h: number, input: Controls) {
    for (const car of this.cars) {
      car.prevX = car.x
      car.prevZ = car.z
      car.prevHeading = car.heading
    }
    if (!this.started) return
    this.time += h

    for (const car of this.cars) {
      const prevS = car.loc.s
      const controls = car.autopilot ? this.drive(car, h) : input
      car.controls.throttle = controls.throttle
      car.controls.brake = controls.brake
      car.controls.steer = controls.steer
      this.integrate(car, controls, h)
      this.collideWalls(car)
      if (car.ghost > 0) car.ghost = Math.max(0, car.ghost - h)
      car.topSpeed = Math.max(car.topSpeed, car.speed)
      this.timing(car, prevS, h)
    }
    this.collideCars()
  }

  /** Player-requested reset: back on the centreline, pointing the right way. */
  resetCar(car: SimCar) {
    const t = this.track
    const s = car.loc.s - 4
    const lateral = clamp(car.loc.d, -3, 3)
    pointAt(t, s, lateral, this.point)
    car.x = car.prevX = this.point.x
    car.z = car.prevZ = this.point.z
    car.heading = car.prevHeading = this.point.heading
    car.speed = 0
    car.yawRate = 0
    car.ghost = 2.5
    const before = car.loc.s
    locate(t, car.x, car.z, car.loc.index, car.loc)
    // stepping back over the line must not cost a lap
    if (car.loc.s - before > t.length / 2) {
      car.laps -= 1
      car.recross += 1
    }
    car.progress = (car.laps - 1) * t.length + car.loc.s
    car.alpha = 0
  }

  /** Cars ordered by race position. */
  order() {
    return [...this.cars].sort((a, b) => {
      if (a.finished && b.finished) return a.finishTime! - b.finishTime!
      if (a.finished) return -1
      if (b.finished) return 1
      return b.progress - a.progress
    })
  }

  /** Estimated total race time for a car that has not finished yet. */
  projectedFinish(car: SimCar) {
    if (car.finishTime !== null) return car.finishTime
    const target = this.laps * this.track.length
    const covered = car.progress - car.startProgress
    const pace = covered > 50 && this.time > 1 ? covered / this.time : 40
    return this.time + Math.max(0, target - car.progress) / Math.max(pace, 10)
  }

  private integrate(car: SimCar, c: Controls, h: number) {
    const v = car.speed
    const grass = car.offTrack
    let a = 0
    if (v >= 0 && c.throttle > 0) {
      const top = grass ? CAR.grassTop : CAR.topSpeed
      const ratio = clamp(v / top, 0, 1)
      a +=
        c.throttle * CAR.engine * (grass ? 0.6 : 1) * (1 - Math.pow(ratio, 2.6))
    }
    if (c.brake > 0) {
      if (v > 0.6) a -= c.brake * CAR.brake * (grass ? 0.55 : 1)
      else if (c.throttle < 0.1) a -= c.brake * CAR.reverse
    }
    if (v < 0 && c.throttle > 0) a += c.throttle * CAR.brake * 0.4
    const sign = Math.sign(v)
    a -= sign * (CAR.drag * v * v + (c.throttle < 0.05 ? CAR.coast : 0.25))
    if (grass) a -= CAR.grassDrag * v
    let nv = v + a * h
    const reversing = c.brake > 0 && v <= 0.6 && c.throttle < 0.1
    if (sign !== 0 && Math.sign(nv) !== sign && !reversing && c.throttle < 0.05)
      nv = 0
    nv = clamp(nv, -CAR.reverseMax, CAR.topSpeed)
    car.accel = (nv - v) / h
    car.speed = nv

    const vAbs = Math.abs(nv)
    const delta = (c.steer * CAR.maxSteer) / (1 + vAbs / CAR.steerFalloff)
    let r = (nv * Math.tan(delta)) / CAR.wheelbase
    const maxR = (grass ? CAR.gripGrass : CAR.grip) / Math.max(vAbs, 3)
    r = clamp(r, -maxR, maxR)
    car.yawRate += (r - car.yawRate) * Math.min(1, h * 16)
    car.heading -= car.yawRate * h
    car.lateral = car.yawRate * nv
    car.x += Math.sin(car.heading) * nv * h
    car.z += Math.cos(car.heading) * nv * h
  }

  private collideWalls(car: SimCar) {
    const t = this.track
    locate(t, car.x, car.z, car.loc.index, car.loc)
    const i = car.loc.index
    const trackHeading = Math.atan2(t.tx[i], t.tz[i])
    const alpha = angleDiff(car.heading, trackHeading)
    car.alpha = alpha
    const ext =
      CAR.halfWidth * Math.abs(Math.cos(alpha)) +
      CAR.halfLength * Math.abs(Math.sin(alpha))
    const penRight = car.loc.d + ext - t.barrierRight[i]
    if (penRight > 0) this.hitWall(car, 1, penRight, alpha, trackHeading)
    const penLeft = -t.barrierLeft[i] - (car.loc.d - ext)
    if (penLeft > 0) this.hitWall(car, -1, penLeft, alpha, trackHeading)
    car.offTrack = Math.abs(car.loc.d) > ROAD_HALF_WIDTH + KERB_WIDTH * 0.85
  }

  private hitWall(
    car: SimCar,
    side: 1 | -1,
    pen: number,
    alpha: number,
    trackHeading: number,
  ) {
    const t = this.track
    const i = car.loc.index
    car.x -= -t.tz[i] * pen * side
    car.z -= t.tx[i] * pen * side
    car.loc.d -= pen * side
    // velocity component pointing into this wall
    const into = side * -car.speed * Math.sin(alpha)
    if (into > 0.3) {
      car.speed *= 1 - clamp(0.03 + into / 38, 0.03, 0.65)
      const along =
        Math.abs(alpha) < Math.PI / 2 ? 0 : Math.PI * Math.sign(alpha)
      car.heading = trackHeading + along + (alpha - along) * 0.4
      car.yawRate = 0
      this.events.push({ type: "wall", car, strength: into })
    } else {
      car.speed *= 0.997
    }
  }

  private collideCars() {
    const cars = this.cars
    for (let i = 0; i < cars.length; i++) {
      const A = cars[i]
      for (let j = i + 1; j < cars.length; j++) {
        const B = cars[j]
        if (A.ghost > 0 || B.ghost > 0) continue
        const dx = B.x - A.x
        const dz = B.z - A.z
        if (dx * dx + dz * dz > 40) continue
        const fax = Math.sin(A.heading)
        const faz = Math.cos(A.heading)
        const fbx = Math.sin(B.heading)
        const fbz = Math.cos(B.heading)
        let pen = 0
        let nx = 0
        let nz = 0
        for (const oa of CIRCLES) {
          const ax = A.x + fax * oa
          const az = A.z + faz * oa
          for (const ob of CIRCLES) {
            const cx = B.x + fbx * ob - ax
            const cz = B.z + fbz * ob - az
            const dist = Math.hypot(cx, cz)
            const p = RADIUS * 2 - dist
            if (p > pen) {
              pen = p
              nx = dist > 1e-4 ? cx / dist : 1
              nz = dist > 1e-4 ? cz / dist : 0
            }
          }
        }
        if (pen <= 0) continue
        A.x -= (nx * pen) / 2
        A.z -= (nz * pen) / 2
        B.x += (nx * pen) / 2
        B.z += (nz * pen) / 2
        let vax = fax * A.speed
        let vaz = faz * A.speed
        let vbx = fbx * B.speed
        let vbz = fbz * B.speed
        const rel = (vbx - vax) * nx + (vbz - vaz) * nz
        if (rel < 0) {
          const impulse = (-(1 + 0.15) * rel) / 2
          vax -= nx * impulse
          vaz -= nz * impulse
          vbx += nx * impulse
          vbz += nz * impulse
          A.speed = vax * fax + vaz * faz
          B.speed = vbx * fbx + vbz * fbz
          const strength = -rel
          if (A.player) this.events.push({ type: "contact", car: A, strength })
          if (B.player) this.events.push({ type: "contact", car: B, strength })
        }
      }
    }
  }

  private timing(car: SimCar, prevS: number, h: number) {
    const t = this.track
    const s = car.loc.s
    const delta = s - prevS
    if (delta < -t.length / 2) {
      // crossed the line going forwards; interpolate the exact moment
      const frac = (t.length - prevS) / Math.max(1e-6, s + t.length - prevS)
      this.crossLine(car, this.time - h + frac * h)
    } else if (delta > t.length / 2) {
      // reversed over the line: the lap in progress carries on once it is re-crossed
      car.laps -= 1
      car.recross += 1
    } else if (car.laps >= 1 && car.sector < 2 && !car.finished) {
      const boundary = t.sectors[car.sector]
      if (prevS < boundary && s >= boundary) {
        const frac = (boundary - prevS) / Math.max(1e-6, delta)
        this.completeSector(car, car.sector, this.time - h + frac * h)
        car.sector += 1
      }
    }
    car.progress = (car.laps - 1) * t.length + car.loc.s
  }

  private crossLine(car: SimCar, at: number) {
    car.laps += 1
    if (car.recross > 0) {
      car.recross -= 1
      return
    }
    if (car.finished) return
    if (car.laps >= 2 && car.sector === 2) {
      this.completeSector(car, 2, at)
      const lap = at - car.lapStart
      let tone: SectorTone = "yellow"
      if (this.bestLap === null || lap < this.bestLap) {
        this.bestLap = lap
        tone = "purple"
      } else if (car.bestLap === null || lap < car.bestLap) tone = "green"
      if (car.bestLap === null || lap < car.bestLap) car.bestLap = lap
      car.lastLap = lap
      this.events.push({ type: "lap", car, lap: car.laps - 1, time: lap, tone })
      if (car.laps >= this.laps + 1) {
        car.finished = true
        car.finishTime = at
        this.finishedCount += 1
        this.events.push({
          type: "finish",
          car,
          time: at,
          position: this.finishedCount,
        })
        return
      }
    }
    car.lapStart = at
    car.sectorStart = at
    car.sector = 0
    car.sectorTimes = [null, null, null]
    car.sectorTones = [null, null, null]
  }

  private completeSector(car: SimCar, index: number, at: number) {
    const time = at - car.sectorStart
    car.sectorStart = at
    let tone: SectorTone = "yellow"
    const overall = this.bestSectors[index]
    const personal = car.bestSectors[index]
    if (overall === null || time < overall) {
      this.bestSectors[index] = time
      tone = "purple"
    } else if (personal === null || time < personal) tone = "green"
    if (personal === null || time < personal) car.bestSectors[index] = time
    car.sectorTimes[index] = time
    car.sectorTones[index] = tone
    this.events.push({ type: "sector", car, sector: index, time, tone })
  }

  /** Rival driver: pure-pursuit steering along the racing line, speed from the profile. */
  private drive(car: SimCar, h: number): Controls {
    const out = car.controls
    const t = this.track
    if (this.time < car.reaction && !car.player) {
      out.throttle = 0
      out.brake = 0
      out.steer = 0
      return out
    }
    const v = Math.max(0, car.speed)
    const room = ROAD_HALF_WIDTH - 1.3

    let pace = car.skill
    if (car.finished) pace = 0.55
    else if (!car.player && !this.player.finished) {
      // keep the pack within reach of the player without making it obvious
      const lead = car.progress - this.player.progress
      if (lead > 25) pace -= Math.min(this.rivals.wait, (lead - 25) / 700)
      else if (lead < -35)
        pace += Math.min(this.rivals.chase, (-lead - 35) / 900)
    }
    const own =
      Math.min(
        sampleAt(t, t.speed, car.loc.s + 2),
        sampleAt(t, t.speed, car.loc.s + 2 + v * 0.3),
      ) * pace

    const look = clamp(7 + v * 0.3, 7, 30)
    const ahead = car.loc.s + look
    let targetD = sampleAt(t, t.line, ahead) + car.lane

    // traffic: follow the car ahead in our lane, or pull out and pass it
    let cap = Infinity
    let blocker: SimCar | null = null
    let blockerGap = Infinity
    for (const other of this.cars) {
      if (other === car || other.ghost > 0) continue
      let gap = wrapS(t, other.loc.s - car.loc.s)
      if (gap > t.length / 2) gap -= t.length
      if (gap <= 0.5 || gap > 30) continue
      const dd = other.loc.d - car.loc.d
      if (Math.abs(dd) > 2.5) continue
      const keep = 6.4 + v * 0.14
      cap = Math.min(cap, other.speed + (gap - keep) * 1.4)
      if (gap < blockerGap) {
        blockerGap = gap
        blocker = other
      }
    }
    if (
      blocker &&
      blockerGap < 22 &&
      own > blocker.speed + 1 &&
      car.passTimer <= 0
    ) {
      // pick the side with room next to the car we are catching
      let side = blocker.loc.d > car.loc.d ? -1 : 1
      if (Math.abs(blocker.loc.d + side * 3.4) > room) side = -side
      if (Math.abs(blocker.loc.d + side * 3.4) <= room) {
        car.passSide = side
        car.passing = blocker
        car.passTimer = 3
      }
    }
    if (car.passTimer > 0) {
      car.passTimer -= h
      const target = car.passing
      let gap = target ? wrapS(t, target.loc.s - car.loc.s) : 0
      if (gap > t.length / 2) gap -= t.length
      if (!target || gap < -7 || gap > 34) {
        car.passTimer = 0
        car.passing = null
      } else {
        targetD = target.loc.d + car.passSide * 3.4
        // once alongside, the pass is on: stop following the car being passed
        if (Math.abs(target.loc.d - car.loc.d) > 2.2) cap = Infinity
      }
    }

    // side awareness: hold a car's width from anyone running alongside
    for (const other of this.cars) {
      if (other === car || other.ghost > 0) continue
      let gap = wrapS(t, other.loc.s - car.loc.s)
      if (gap > t.length / 2) gap -= t.length
      if (Math.abs(gap) > 6.5) continue
      const side = car.loc.d >= other.loc.d ? 1 : -1
      const min = other.loc.d + side * 2.6
      if (side > 0 ? targetD < min : targetD > min) targetD = min
    }
    targetD = clamp(targetD, -room, room)

    pointAt(t, ahead, targetD, this.point)
    const dx = this.point.x - car.x
    const dz = this.point.z - car.z
    const sin = Math.sin(car.heading)
    const cos = Math.cos(car.heading)
    const fwd = dx * sin + dz * cos
    const right = -dx * cos + dz * sin
    const alpha = Math.atan2(right, Math.max(0.5, fwd))
    const curvature = (2 * Math.sin(alpha)) / look
    const delta = Math.atan(curvature * CAR.wheelbase)
    const maxDelta = CAR.maxSteer / (1 + v / CAR.steerFalloff)
    out.steer = clamp(delta / maxDelta, -1, 1)

    let target = Math.min(own, Math.max(0, cap))
    if (car.offTrack) target = Math.min(target, 24)
    // pointing the wrong way after a spin: slow right down and steer round
    if (Math.abs(car.alpha) > 1.4) target = Math.min(target, 8)

    if (v < target - 1) {
      out.throttle = 1
      out.brake = 0
    } else if (v > target + 1.2) {
      out.throttle = 0
      out.brake = clamp((v - target) / 9, 0.15, 1)
    } else {
      out.throttle = clamp(0.35 + (target - v) * 0.3, 0, 1)
      out.brake = 0
    }
    return out
  }
}
