import { useEffect, useRef } from "react"
import * as THREE from "three"
import { useFrame } from "@react-three/fiber"
import { caseStudies } from "@/data/caseStudies"
import { useStore } from "@/state/store"
import {
  useRaceStore,
  type ClassificationRow,
  type Difficulty,
  type RacePhase,
  type Standing,
} from "@/race/raceStore"
import {
  raceCommands,
  resetTelemetry,
  telemetry,
  type CarDot,
} from "@/race/telemetry"
import { clearControls, controls, sampleControls } from "@/race/controls"
import { engineSound } from "@/race/audio"
import { saveRecord } from "@/race/records"
import { formatLap, ordinal } from "@/race/format"
import { gridSlot } from "../layout"
import { CAR, RaceSim, STEP, angleDiff, type Controls } from "./sim"
import { getTrack, trackMapPath } from "./track"
import { cameraHandoff, carRigs, raceFocus } from "./raceView"

/** seconds on the grid before the first light */
const GRID_HOLD = 1.6
/** seconds between start lights */
const LIGHT_INTERVAL = 0.8
/** cool-down before the classification appears */
const RESULTS_DELAY = 3.2
/** upshift points (m/s) for the 8-speed box shown on the HUD */
const GEARS = [0, 16, 25, 34, 43, 52, 61, 70, 100]

// development aids: ?racefast speeds the clock up, ?raceauto lets the AI drive the player's car
const devParams = import.meta.env.DEV
  ? new URLSearchParams(window.location.search)
  : null
const TIME_SCALE = devParams?.has("racefast") ? 4 : 1
const AUTOPILOT = devParams?.has("raceauto") ?? false

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
const NO_INPUT: Controls = { throttle: 0, brake: 0, steer: 0 }

type CameraMode = "chase" | "onboard" | "orbit"

type Runtime = {
  sim: RaceSim
  phaseClock: number
  lightsShown: number
  hold: number
  accumulator: number
  throttleAtStart: boolean
  finishedFor: number | null
  resultsSent: boolean
  standingsClock: number
  orderKey: string
  position: number
  lastToast: number
  lastLimits: number
  wrongWay: number
  stuck: number
  revs: number
  dots: CarDot[]
  // camera
  mode: CameraMode | null
  look: THREE.Vector3
  /** camera and look-at offsets from the car when the current blend began */
  fromPos: THREE.Vector3
  fromLook: THREE.Vector3
  fromFov: number
  fromOffset: [number, number]
  /** 0 → 1 while the setup shot's lens shift is unwound */
  offsetBlend: number
  blend: number
  yaw: number
  orbit: number
  shake: number
}

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v))
const ease = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

function parkCars() {
  for (const study of caseStudies) {
    const rig = carRigs.get(study.slug)
    if (!rig) continue
    rig.root.position.copy(gridSlot(study.position))
    rig.root.rotation.set(0, 0, 0)
    rig.body.rotation.set(0, 0, 0)
  }
}

function gearOf(v: number) {
  let g = 1
  while (g < GEARS.length - 1 && v > GEARS[g]) g++
  const lo = GEARS[g - 1]
  const hi = GEARS[g]
  return { gear: g, rpm: 0.38 + 0.62 * clamp((v - lo) / (hi - lo), 0, 1) }
}

const toneOf = (tone: "purple" | "green" | "yellow") =>
  tone === "yellow" ? "neutral" as const : tone

const activePhase = (phase: RacePhase) =>
  phase === "grid" ||
  phase === "lights" ||
  phase === "racing" ||
  phase === "finished"

/** Runs the race: start procedure, simulation, timing, HUD feeds, cars and camera. */
export function RaceDirector() {
  const runtime = useRef<Runtime | null>(null)
  const tmpPos = useRef(new THREE.Vector3())
  const tmpLook = useRef(new THREE.Vector3())

  useEffect(() => {
    const track = getTrack()
    useRaceStore.getState().setTrackMap(trackMapPath(track))

    const begin = () => {
      const s = useRaceStore.getState()
      const config = s.config!
      const track = getTrack(config.circuit)
      useRaceStore.getState().setTrackMap(trackMapPath(track))
      const grid = config.grid.map((slug, i) => {
        const slot = gridSlot(i + 1)
        return { slug, x: slot.x, z: slot.z, player: slug === config.slug }
      })
      const sim = new RaceSim(track, grid, {
        laps: s.raceLaps,
        difficulty: s.raceDifficulty,
        seed: config.seed,
      })
      if (AUTOPILOT) {
        sim.player.autopilot = true
        sim.player.skill = 0.95
      }
      runtime.current = {
        sim,
        phaseClock: 0,
        lightsShown: 0,
        hold: 0.35 + (config.seed % 1100) / 1000,
        accumulator: 0,
        throttleAtStart: false,
        finishedFor: null,
        resultsSent: false,
        standingsClock: 1,
        orderKey: "",
        position: config.grid.indexOf(config.slug) + 1,
        lastToast: -10,
        lastLimits: -10,
        wrongWay: 0,
        stuck: 0,
        revs: 0,
        dots: sim.cars.map((c) => ({
          slug: c.slug,
          x: c.x,
          z: c.z,
          player: c.player,
        })),
        mode: null,
        look: new THREE.Vector3(),
        fromPos: new THREE.Vector3(),
        fromLook: new THREE.Vector3(),
        fromFov: 40,
        fromOffset: [0, 0],
        offsetBlend: 1,
        blend: 1,
        yaw: 0,
        orbit: 0,
        shake: 0,
      }
      resetTelemetry()
      clearControls()
      raceCommands.reset = false
      parkCars()
      useStore.getState().setLights(0)
      raceFocus.active = true
      raceFocus.x = sim.player.x
      raceFocus.z = sim.player.z
      engineSound.setEnabled(s.sound)
      engineSound.setActive(true)
    }

    const end = () => {
      if (runtime.current) cameraHandoff.race = true
      runtime.current = null
      parkCars()
      raceFocus.active = false
      useStore.getState().setLights(0)
      engineSound.setActive(false)
      clearControls()
    }

    const initial = useRaceStore.getState()
    if (initial.phase !== "select") begin()
    const unsubscribe = useRaceStore.subscribe((s, prev) => {
      if (s.raceId !== prev.raceId && s.phase === "grid") begin()
      else if (s.phase === "select" && prev.phase !== "select") end()
      if (s.sound !== prev.sound) engineSound.setEnabled(s.sound)
      if (s.paused !== prev.paused || s.phase !== prev.phase)
        engineSound.setActive(!s.paused && activePhase(s.phase))
    })
    return () => {
      unsubscribe()
      end()
    }
  }, [])

  useFrame((state, rawDelta) => {
    const rt = runtime.current
    const race = useRaceStore.getState()
    if (!rt || race.phase === "select" || race.paused) return
    const dt = Math.min(rawDelta, 0.1)
    const sim = rt.sim
    const player = sim.player

    // ---- start procedure -------------------------------------------------
    if (race.phase === "grid") {
      rt.phaseClock += dt
      if (rt.phaseClock >= GRID_HOLD) {
        rt.phaseClock = 0
        race.setPhase("lights")
      }
    } else if (race.phase === "lights") {
      rt.phaseClock += dt
      const lit = Math.min(5, Math.floor(rt.phaseClock / LIGHT_INTERVAL) + 1)
      if (lit !== rt.lightsShown) {
        rt.lightsShown = lit
        useStore.getState().setLights(lit)
      }
      if (rt.phaseClock >= 5 * LIGHT_INTERVAL + rt.hold) {
        useStore.getState().setLights(0)
        rt.throttleAtStart = controls.throttle > 0.3 || race.autoThrottle
        sim.start()
        race.setPhase("racing")
        race.notify("Lights out", "go", "And away we go")
      }
    }

    // ---- input + physics --------------------------------------------------
    sampleControls(dt, race.autoThrottle)
    if (raceCommands.reset) {
      raceCommands.reset = false
      if (race.phase === "racing") sim.resetCar(player)
    }
    if (race.phase === "racing" && sim.started) {
      if (
        telemetry.reaction === null &&
        !rt.throttleAtStart &&
        controls.throttle > 0.3
      )
        telemetry.reaction = sim.time
      if (rt.throttleAtStart && controls.throttle < 0.1)
        rt.throttleAtStart = false
    }
    if (sim.started) {
      rt.accumulator += dt * TIME_SCALE
      const input = race.phase === "racing" ? controls : NO_INPUT
      let steps = 0
      while (rt.accumulator >= STEP && steps < 48) {
        sim.step(STEP, input)
        rt.accumulator -= STEP
        steps++
      }
      if (steps === 48) rt.accumulator = 0
    }
    const alpha = sim.started ? clamp(rt.accumulator / STEP, 0, 1) : 1

    // ---- race events ------------------------------------------------------
    for (const e of sim.events) {
      if (!e.car.player) continue
      if (e.type === "lap") {
        if (e.tone === "purple")
          race.notify("Fastest lap", "purple", formatLap(e.time))
        else if (e.lap < sim.laps) {
          const next = e.lap + 1
          race.notify(
            next === sim.laps ? "Final lap" : `Lap ${next}`,
            next === sim.laps ? "flag" : toneOf(e.tone),
            `Lap ${e.lap} · ${formatLap(e.time)}`,
          )
        }
        if (e.tone === "purple" && e.lap === sim.laps - 1) {
          // keep the final-lap call even when the lap was the fastest
          window.setTimeout(() => {
            if (useRaceStore.getState().phase === "racing")
              useRaceStore.getState().notify("Final lap", "flag")
          }, 1600)
        }
      } else if (e.type === "finish") {
        rt.finishedFor = 0
        player.autopilot = true
        race.setPhase("finished")
        race.notify(
          "Chequered flag",
          "flag",
          `${ordinal(e.position)} · ${formatLap(e.time)}`,
        )
      } else if (e.type === "wall") {
        rt.shake = Math.min(1.2, rt.shake + e.strength / 10)
        engineSound.impact(e.strength)
        if (e.strength > 6) navigator.vibrate?.(Math.min(60, e.strength * 4))
      } else if (e.type === "contact") {
        rt.shake = Math.min(1, rt.shake + e.strength / 14)
      }
    }
    sim.events.length = 0

    // ---- player status ----------------------------------------------------
    const racingNow = race.phase === "racing"
    if (racingNow) {
      if (
        player.offTrack &&
        !telemetry.offTrack &&
        sim.time - rt.lastLimits > 4
      ) {
        rt.lastLimits = sim.time
        race.notify("Track limits", "warning")
      }
      rt.wrongWay =
        Math.abs(player.alpha) > 1.9 && player.speed > 2 ? rt.wrongWay + dt : 0
      rt.stuck =
        Math.abs(player.speed) < 1.5 && sim.time > 3 ? rt.stuck + dt : 0
    } else {
      rt.wrongWay = 0
      rt.stuck = 0
    }
    telemetry.offTrack = racingNow && player.offTrack
    telemetry.wrongWay = rt.wrongWay > 1.2
    telemetry.stuck = rt.stuck > 3

    // ---- classification ---------------------------------------------------
    if (rt.finishedFor !== null) {
      rt.finishedFor += dt
      if (rt.finishedFor > RESULTS_DELAY && !rt.resultsSent) {
        rt.resultsSent = true
        sendResults(rt, race.slug, race.raceDifficulty)
      }
    }

    // ---- standings --------------------------------------------------------
    rt.standingsClock += dt
    const order = sim.order()
    const key = order.map((c) => c.slug).join("|")
    // order changes show at once; gaps refresh at a readable pace
    if (key !== rt.orderKey || rt.standingsClock > 0.8) {
      rt.standingsClock = 0
      const standings: Standing[] = order.map((car, i) => {
        const ahead = order[i - 1]
        let interval: number | null = null
        if (ahead) {
          if (car.finished && ahead.finished)
            interval = car.finishTime! - ahead.finishTime!
          else
            interval =
              Math.max(0, ahead.progress - car.progress) /
              Math.max(car.speed, 22)
        }
        return {
          slug: car.slug,
          position: i + 1,
          lap: clamp(car.laps, 1, sim.laps),
          interval,
          finished: car.finished,
          player: car.player,
        }
      })
      race.setStandings(standings)
      const position = order.indexOf(player) + 1
      if (
        key !== rt.orderKey &&
        racingNow &&
        position < rt.position &&
        sim.time > 4 &&
        sim.time - rt.lastToast > 2.5
      ) {
        rt.lastToast = sim.time
        race.notify(`P${position}`, "green", "Position gained")
      }
      rt.position = position
      rt.orderKey = key
    }

    // ---- cars -------------------------------------------------------------
    let px = player.x
    let pz = player.z
    let ph = player.heading
    sim.cars.forEach((car, i) => {
      const x = car.prevX + (car.x - car.prevX) * alpha
      const z = car.prevZ + (car.z - car.prevZ) * alpha
      const h =
        car.prevHeading + angleDiff(car.heading, car.prevHeading) * alpha
      if (car.player) {
        px = x
        pz = z
        ph = h
      }
      const dot = rt.dots[i]
      dot.x = x
      dot.z = z
      const rig = carRigs.get(car.slug)
      if (!rig) return
      rig.root.position.set(x, 0, z)
      rig.root.rotation.set(0, h, 0)
      const pitch = clamp(-car.accel * 0.0011, -0.026, 0.03)
      const roll = clamp(-car.lateral * 0.0011, -0.03, 0.03)
      rig.body.rotation.x = THREE.MathUtils.damp(
        rig.body.rotation.x,
        pitch,
        7,
        dt,
      )
      rig.body.rotation.z = THREE.MathUtils.damp(
        rig.body.rotation.z,
        roll,
        7,
        dt,
      )
    })
    raceFocus.x = px
    raceFocus.z = pz

    // ---- telemetry ----------------------------------------------------------
    const speed = Math.abs(player.speed)
    if (sim.started) {
      const g = gearOf(speed)
      telemetry.gear = player.speed < -0.5 ? -1 : g.gear
      telemetry.rpm = g.rpm
    } else {
      rt.revs = THREE.MathUtils.damp(
        rt.revs,
        0.3 + controls.throttle * 0.62,
        9,
        dt,
      )
      telemetry.gear = 0
      telemetry.rpm = rt.revs
    }
    const ownControls = sim.started ? player.controls : controls
    telemetry.speed = speed
    telemetry.throttle = ownControls.throttle
    telemetry.brake = ownControls.brake
    telemetry.lap = clamp(player.laps, 1, sim.laps)
    telemetry.lapTime = player.finished
      ? (player.lastLap ?? 0)
      : player.laps >= 1
        ? sim.time - player.lapStart
        : sim.time
    telemetry.lastLap = player.lastLap
    telemetry.bestLap = player.bestLap
    telemetry.sectorTimes = player.sectorTimes
    telemetry.sectorTones = player.sectorTones
    telemetry.raceTime = player.finishTime ?? sim.time
    telemetry.topSpeed = player.topSpeed
    telemetry.dots = rt.dots

    engineSound.update(
      telemetry.rpm,
      race.phase === "finished" ? 0.2 : telemetry.throttle,
      clamp(speed / CAR.topSpeed, 0, 1),
    )

    // ---- camera -------------------------------------------------------------
    const camera = state.camera as THREE.PerspectiveCamera
    const reduced = reducedMotion.matches
    const portrait = state.size.width / Math.max(1, state.size.height) < 0.9
    const mode: CameraMode =
      race.phase === "finished" || race.phase === "results"
        ? "orbit"
        : race.camera
    if (mode !== rt.mode) {
      if (rt.mode === null) {
        // first frame: start from the setup shot, lens shift included
        camera
          .getWorldDirection(rt.look)
          .multiplyScalar(12)
          .add(camera.position)
        rt.yaw = ph
        const view = camera.view
        rt.fromOffset = view?.enabled ? [view.offsetX, view.offsetY] : [0, 0]
        rt.offsetBlend = 0
      }
      // offsets relative to the car, so a blend rides along with it at speed
      rt.fromPos.set(
        camera.position.x - px,
        camera.position.y,
        camera.position.z - pz,
      )
      rt.fromLook.set(rt.look.x - px, rt.look.y, rt.look.z - pz)
      rt.fromFov = camera.fov
      rt.blend = 0
      rt.mode = mode
    }
    cameraHandoff.race = true
    const speed01 = clamp(speed / CAR.topSpeed, 0, 1)
    const kick = reduced ? 0 : speed01
    const desired = tmpPos.current
    const target = tmpLook.current
    let fov: number
    if (mode === "orbit") {
      rt.orbit += dt * (reduced ? 0.12 : 0.3)
      desired.set(
        px + Math.sin(rt.orbit + ph) * 8.5,
        2.6,
        pz + Math.cos(rt.orbit + ph) * 8.5,
      )
      target.set(px, 0.7, pz)
      fov = portrait ? 58 : 40
    } else if (mode === "onboard") {
      const fx = Math.sin(ph)
      const fz = Math.cos(ph)
      desired.set(px - fx * 0.42, 1.14, pz - fz * 0.42)
      target.set(px + fx * 30, 0.62, pz + fz * 30)
      fov = (portrait ? 84 : 70) + kick * 8
    } else {
      rt.yaw += angleDiff(ph, rt.yaw) * (1 - Math.exp(-dt * 5.5))
      const fx = Math.sin(rt.yaw)
      const fz = Math.cos(rt.yaw)
      const back = (portrait ? 8.8 : 7.1) + kick * 1.1
      desired.set(px - fx * back, portrait ? 3.2 : 2.3, pz - fz * back)
      target.set(px + fx * 6, 0.9, pz + fz * 6)
      fov = (portrait ? 72 : 56) + kick * 10
    }
    rt.blend = Math.min(1, rt.blend + dt / (reduced ? 0.35 : 1.3))
    const e = ease(rt.blend)
    const lerp = THREE.MathUtils.lerp
    camera.position.set(
      px + lerp(rt.fromPos.x, desired.x - px, e),
      lerp(rt.fromPos.y, desired.y, e),
      pz + lerp(rt.fromPos.z, desired.z - pz, e),
    )
    rt.look.set(
      px + lerp(rt.fromLook.x, target.x - px, e),
      lerp(rt.fromLook.y, target.y, e),
      pz + lerp(rt.fromLook.z, target.z - pz, e),
    )
    camera.fov = THREE.MathUtils.lerp(rt.fromFov, fov, e)
    if (!reduced && rt.shake > 0.002) {
      camera.position.x += (Math.random() - 0.5) * rt.shake * 0.22
      camera.position.y += (Math.random() - 0.5) * rt.shake * 0.16
    }
    rt.shake *= Math.exp(-dt * 7)
    camera.lookAt(rt.look)
    // unwind the setup shot's lens shift instead of snapping it away
    if (rt.offsetBlend < 1) {
      rt.offsetBlend = Math.min(1, rt.offsetBlend + dt / (reduced ? 0.35 : 1.3))
      const left = 1 - ease(rt.offsetBlend)
      if (left < 0.002) camera.clearViewOffset()
      else {
        const { width, height } = state.size
        camera.setViewOffset(
          width,
          height,
          rt.fromOffset[0] * left,
          rt.fromOffset[1] * left,
          width,
          height,
        )
      }
    }
    camera.updateProjectionMatrix()
  })

  return null
}

function sendResults(rt: Runtime, slug: string, difficulty: Difficulty) {
  const sim = rt.sim
  const ranked = sim.cars
    .map((car) => ({ car, time: sim.projectedFinish(car) }))
    .sort((a, b) => a.time - b.time)
  const winner = ranked[0].time
  const rows: ClassificationRow[] = ranked.map(({ car, time }, i) => ({
    slug: car.slug,
    position: i + 1,
    time,
    gap: i === 0 ? null : time - winner,
    bestLap: car.bestLap,
    player: car.player,
  }))
  const player = sim.player
  const row = rows.find((r) => r.player)!
  const time = player.finishTime ?? row.time
  const circuit = useRaceStore.getState().config!.circuit
  const saved = saveRecord(slug, sim.laps, time, player.bestLap, circuit)
  useRaceStore.getState().finish({
    circuit,
    slug,
    laps: sim.laps,
    difficulty,
    rows,
    position: row.position,
    time,
    bestLap: player.bestLap,
    reaction: telemetry.reaction,
    topSpeed: player.topSpeed,
    fastestLap: player.bestLap !== null && player.bestLap === sim.bestLap,
    record: {
      race: saved.race,
      lap: saved.lap,
      previousRace: saved.previous.race,
      previousLap: saved.previous.lap,
    },
  })
}
