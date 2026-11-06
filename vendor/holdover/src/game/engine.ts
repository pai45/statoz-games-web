// Game runtime: renderer, input, player rifle handling, ballistics, cameras, and HUD output.
import * as THREE from 'three'

import { Actor, type HitPart } from './actors.ts'
import { AudioEngine } from './audio.ts'
import { BALLISTIC_STEP, holdover, solveZeroAngle, stepBullet, type BulletState } from './ballistics.ts'
import { createSpriteTexture } from './builder.ts'
import type { Surface } from './collision.ts'
import { ZERO_DISTANCES, type CamoSpec, type DuelArena, type DuelDifficultyId, type MissionSpec, type ReticleId, type RifleSpec, type WindSpec } from './data.ts'
import { DuelSession } from './duel.ts'
import { Effects, type Trail } from './effects.ts'
import { NEST } from './layout.ts'
import { MissionSession } from './mission.ts'
import { clamp, damp, mulberry32, noise1 } from './noise.ts'
import { drawOverlay, type Marker, type MarkerKind, type OverlayFrame } from './overlay.ts'
import { PostFX } from './post.ts'
import type { DuelRounds, QualityId, Settings } from './progression.ts'
import { RifleView } from './rifle.ts'
import { TIME_PRESETS, type TimePreset } from './sky.ts'
import { COVER_EYE_Y, EYE_Y, NEST_FLOOR, terrainHeight, terrainNormal } from './terrain.ts'
import type { GameEvent, HudState, Session, SessionHost } from './types.ts'
import { World } from './world.ts'

const DEG = Math.PI / 180
const YAW_LIMIT = 40 * DEG
const PITCH_MIN = -14 * DEG
const PITCH_MAX = 10 * DEG
/** Vertical screen field of view (degrees) times magnification; matches real optic field of view. */
const SCOPE_TFOV = 41
const SCOPE_RADIUS = 0.46

export interface Loadout {
  rifle: RifleSpec
  camo: CamoSpec
  reticle: ReticleId
}

interface Player {
  yaw: number
  pitch: number
  recoilP: number
  recoilPV: number
  recoilY: number
  recoilYV: number
  swayX: number
  swayY: number
  scoped: boolean
  scope: number
  zoom: number
  zero: number
  ammo: number
  reserve: number
  chambered: boolean
  cycle: number
  cycleTotal: number
  reload: number
  reloadTotal: number
  breath: number
  holding: boolean
  holdingActive: boolean
  exhausted: number
  duck: number
  health: number
  dead: boolean
  lastHurt: number
  heart: number
  thermal: boolean
  range: number | null
  rangeTime: number
  lastLoud: number
  autoReload: boolean
}

interface Bullet {
  state: BulletState
  rifle: RifleSpec
  time: number
  alive: boolean
  trail: Trail
  start: THREE.Vector3
}

interface TraceHit {
  t: number
  kind: 'actor' | 'world' | 'terrain'
  actor?: Actor
  part?: HitPart
  surface: Surface
  nx: number
  ny: number
  nz: number
}

interface KillCam {
  bullet: Bullet
  target: Actor
  phase: 'flight' | 'impact' | 'after'
  timer: number
  side: number
  orbit: number
  flight: number
  skip: boolean
  camPos: THREE.Vector3
  lookAt: THREE.Vector3
}

interface EnemyRound {
  from: THREE.Vector3
  to: THREE.Vector3
  t: number
  duration: number
  trail: Trail | null
  hit: boolean
}

export interface EngineCallbacks {
  onHud: (hud: HudState) => void
  onEvent: (event: GameEvent) => void
}

function freshPlayer(): Player {
  return {
    yaw: 0,
    pitch: -3 * DEG,
    recoilP: 0,
    recoilPV: 0,
    recoilY: 0,
    recoilYV: 0,
    swayX: 0,
    swayY: 0,
    scoped: false,
    scope: 0,
    zoom: 6,
    zero: 300,
    ammo: 5,
    reserve: 20,
    chambered: true,
    cycle: 0,
    cycleTotal: 1,
    reload: 0,
    reloadTotal: 1,
    breath: 1,
    holding: false,
    holdingActive: false,
    exhausted: 0,
    duck: 0,
    health: 100,
    dead: false,
    lastHurt: -99,
    heart: 72,
    thermal: false,
    range: null,
    rangeTime: -99,
    lastLoud: -99,
    autoReload: false,
  }
}

const QUALITY: Record<QualityId, { ratio: number; samples: number; shadow: number; bloom: boolean }> = {
  high: { ratio: 2, samples: 4, shadow: 2048, bloom: true },
  balanced: { ratio: 1.35, samples: 4, shadow: 2048, bloom: true },
  performance: { ratio: 1, samples: 0, shadow: 1024, bloom: false },
}

const _v = new THREE.Vector3()
const _w = new THREE.Vector3()
const _forward = new THREE.Vector3()
const _right = new THREE.Vector3()
const _up = new THREE.Vector3()

export class GameEngine implements SessionHost {
  world!: World
  readonly effects = new Effects()
  readonly audio = new AudioEngine()
  readonly eye = new THREE.Vector3(NEST.x, EYE_Y, NEST.z)
  readonly window = new THREE.Vector3(NEST.x, NEST_FLOOR + 1.25, NEST.wallZ - 0.25)
  time = 0
  level = 1

  private readonly host: HTMLElement
  private readonly overlay: HTMLCanvasElement
  private readonly overlayCtx: CanvasRenderingContext2D
  private readonly callbacks: EngineCallbacks
  private renderer!: THREE.WebGLRenderer
  private readonly scene = new THREE.Scene()
  private readonly camera = new THREE.PerspectiveCamera(60, 1, 0.45, 9000)
  private view!: RifleView
  private post!: PostFX
  private readonly timer = new THREE.Timer()
  private settings: Settings
  private mode: 'loading' | 'menu' | 'mission' | 'duel' = 'loading'
  private session: Session | null = null
  private paused = false
  private loadout: Loadout | null = null
  private preset: TimePreset = TIME_PRESETS.dusk
  private player: Player = freshPlayer()
  private bullets: Bullet[] = []
  private rounds: EnemyRound[] = []
  private killCam: KillCam | null = null
  private deathCam: { timer: number } | null = null
  private timeScale = 1
  private windSpec: WindSpec = { min: 1.5, max: 2.5, from: 250 }
  private windBase = 2
  private windSeed = 0
  private readonly windVector = new THREE.Vector3()
  private windSpeed = 2
  private windFrom = 250
  private readonly zeroCache = new Map<string, number>()
  private readonly tags = new Set<Actor>()
  private hitAge = 99
  private hitKind: OverlayFrame['hitKind'] = null
  private damageCues: Array<{ bearing: number; age: number }> = []
  private readonly keys = new Set<string>()
  private lookDX = 0
  private lookDY = 0
  private lookVelocity = new THREE.Vector2()
  private pointerLocked = false
  private fallbackLook = false
  private touchMode = false
  private coverHeld = false
  private touchAim: { id: number; x: number; y: number } | null = null
  private lockFailures = 0
  private cursor = { x: 0.5, y: 0.5, inside: false }
  private hudTimer = 0
  private hints: string[] = []
  private hintTimer = 0
  private currentHint: string | null = null
  private menuAngle = 0.25
  private readonly glintSprites: THREE.Sprite[] = []
  private bulletMesh!: THREE.Mesh
  private assist: { x: number; y: number } | null = null
  private assistTimer = 0
  private readonly random = mulberry32(99)
  private width = 1
  private height = 1
  private fade = 1
  private flash = 0
  private damageFlash = 0
  private shake = 0
  private letterbox = 0
  private missionThermal = false
  private quality: QualityId
  private resizeObserver: ResizeObserver | null = null
  private readonly cleanup: Array<() => void> = []
  private suppressPause = false
  private suspended = false
  private focus = new THREE.Vector3(0, 0, -300)
  private cameraBase = new THREE.Vector3()

  constructor(host: HTMLElement, overlay: HTMLCanvasElement, settings: Settings, callbacks: EngineCallbacks) {
    this.host = host
    this.overlay = overlay
    const ctx = overlay.getContext('2d')
    if (!ctx) throw new Error('2D canvas unavailable')
    this.overlayCtx = ctx
    this.settings = settings
    this.quality = settings.quality
    this.callbacks = callbacks
    this.camera.rotation.order = 'YXZ'
  }

  // -------------------------------------------------------------------------
  // Lifecycle

  async init(progress: (fraction: number, label: string) => void): Promise<void> {
    const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'high-performance', stencil: false })
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFShadowMap
    renderer.domElement.className = 'game-canvas'
    renderer.domElement.tabIndex = 0
    this.renderer = renderer
    this.host.prepend(renderer.domElement)
    const step = async (fraction: number, label: string) => {
      progress(fraction, label)
      await new Promise<void>((resolve) => requestAnimationFrame(() => setTimeout(resolve, 0)))
    }
    await step(0.02, 'Initializing renderer')
    this.world = await World.create(this.scene, step)
    this.view = new RifleView()
    const q = QUALITY[this.quality]
    this.post = new PostFX(renderer, this.scene, this.camera, this.view.scene, this.view.camera, q.samples)
    this.scene.add(this.effects.group)
    const glint = createSpriteTexture('glint', 128)
    for (let i = 0; i < 3; i += 1) {
      const sprite = new THREE.Sprite(
        new THREE.SpriteMaterial({ map: glint, color: '#f4f8ff', blending: THREE.AdditiveBlending, depthTest: false, depthWrite: false, sizeAttenuation: false, fog: false, transparent: true }),
      )
      sprite.visible = false
      sprite.renderOrder = 20
      this.glintSprites.push(sprite)
      this.scene.add(sprite)
    }
    const bulletGeometry = new THREE.CylinderGeometry(0.0042, 0.0042, 0.026, 10)
    bulletGeometry.rotateX(Math.PI / 2)
    const tip = new THREE.ConeGeometry(0.0042, 0.018, 10)
    tip.rotateX(-Math.PI / 2)
    tip.translate(0, 0, -0.022)
    this.bulletMesh = new THREE.Mesh(bulletGeometry, new THREE.MeshStandardMaterial({ color: '#b87333', metalness: 0.9, roughness: 0.25 }))
    this.bulletMesh.add(new THREE.Mesh(tip, this.bulletMesh.material))
    this.bulletMesh.visible = false
    this.scene.add(this.bulletMesh)
    this.applySettings(this.settings)
    this.resize()
    this.bindInput()
    this.setPreset(TIME_PRESETS.dusk)
    await step(0.96, 'Compiling shaders')
    try {
      await renderer.compileAsync(this.scene, this.camera)
    } catch {
      // Shader warm-up is an optimization only.
    }
    this.timer.connect(document)
    renderer.setAnimationLoop(() => this.frame())
    progress(1, 'Ready')
    this.showMenu()
  }

  dispose(): void {
    this.renderer?.setAnimationLoop(null)
    this.resizeObserver?.disconnect()
    for (const fn of this.cleanup) fn()
    this.session?.dispose()
    this.view?.dispose()
    this.timer.dispose()
    this.renderer?.dispose()
    this.renderer?.domElement.remove()
  }

  private setPreset(preset: TimePreset): void {
    this.preset = preset
    this.world.applyPreset(preset, this.renderer)
    this.renderer.toneMappingExposure = preset.exposure
    const u = this.post.uniforms
    u.uSaturation.value = preset.saturation
    u.uContrast.value = preset.contrast
    u.uTint.value.set(preset.tint)
    this.post.bloom.strength = preset.bloom
    const sky = new THREE.Color(preset.hemiSky)
    const ground = new THREE.Color(preset.hemiGround)
    const key = new THREE.Color(preset.sunColor).lerp(new THREE.Color(preset.fogColor), 0.4)
    this.view.setLighting(sky, ground, key, 1.4 + preset.sunIntensity * 0.35, this.scene.environment, 0.6 + preset.envIntensity * 0.7)
  }

  applySettings(settings: Settings): void {
    this.settings = settings
    this.audio.setVolumes(settings.masterVolume, settings.sfxVolume, settings.musicVolume)
    this.effects.reduceFlashing = settings.reduceFlashing
    this.quality = settings.quality
    if (!this.renderer) return
    const q = QUALITY[settings.quality]
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, q.ratio))
    this.post?.setSamples(q.samples)
    if (this.post) this.post.bloom.enabled = q.bloom
    this.world?.setShadowQuality(q.shadow)
    this.resize()
  }

  setLevel(level: number): void {
    this.level = level
  }

  private resize(): void {
    if (!this.renderer) return
    const rect = this.host.getBoundingClientRect()
    this.width = Math.max(1, Math.round(rect.width))
    this.height = Math.max(1, Math.round(rect.height))
    this.renderer.setSize(this.width, this.height, false)
    this.post?.setSize(this.width, this.height)
    this.camera.aspect = this.width / this.height
    this.camera.updateProjectionMatrix()
    this.view?.setAspect(this.width / this.height)
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    this.overlay.width = Math.round(this.width * dpr)
    this.overlay.height = Math.round(this.height * dpr)
    this.overlayCtx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }

  // -------------------------------------------------------------------------
  // Modes

  showMenu(): void {
    this.endSession()
    this.mode = 'menu'
    this.paused = false
    this.setPreset(TIME_PRESETS.dusk)
    this.windSpec = { min: 1.5, max: 2.5, from: 250 }
    this.windBase = 2
    this.fade = 1
    this.releasePointer()
    this.audio.setMusic('menu')
    this.audio.setAmbience('dusk', 2)
    this.audio.setHeartbeat(0)
  }

  private endSession(): void {
    this.session?.dispose()
    this.session = null
    for (const bullet of this.bullets) bullet.trail.active = false
    this.bullets = []
    this.rounds = []
    this.killCam = null
    this.deathCam = null
    this.timeScale = 1
    this.tags.clear()
    this.effects.clear()
    this.bulletMesh.visible = false
    for (const sprite of this.glintSprites) sprite.visible = false
    Actor.thermal = false
    this.hints = []
    this.currentHint = null
  }

  private beginSession(preset: TimePreset, loadout: Loadout, wind: WindSpec, zero: number, focus: readonly [number, number, number]): void {
    this.endSession()
    this.loadout = loadout
    this.setPreset(preset)
    this.view.setLoadout(loadout.rifle, loadout.camo)
    this.windSpec = wind
    this.windSeed = Math.random() * 100
    this.windBase = wind.min + Math.random() * (wind.max - wind.min)
    this.focus.set(focus[0], focus[1], focus[2])
    this.player = freshPlayer()
    this.resetPlayer()
    this.player.zero = zero
    this.player.zoom = loadout.rifle.zoom[0] + (loadout.rifle.zoom[1] - loadout.rifle.zoom[0]) * 0.35
    this.time = 0
    this.fade = 1
    this.paused = false
    this.audio.setAmbience(preset.id, this.windBase)
  }

  startMission(mission: MissionSpec, index: number, loadout: Loadout): void {
    this.beginSession(TIME_PRESETS[mission.time], loadout, mission.wind, mission.zero, mission.focus)
    this.missionThermal = mission.thermal ?? false
    const session = new MissionSession(this, mission, index)
    this.session = session
    this.mode = 'mission'
    this.audio.setMusic('mission')
    this.queueHints(mission)
    this.addActors()
  }

  startDuel(arena: DuelArena, difficulty: DuelDifficultyId, rounds: DuelRounds, loadout: Loadout): void {
    this.beginSession(TIME_PRESETS[arena.time], loadout, arena.wind, arena.zero, arena.focus)
    this.missionThermal = false
    this.session = new DuelSession(this, arena, difficulty, rounds)
    this.mode = 'duel'
    this.audio.setMusic('tension')
    if (this.settings.hints) {
      this.hints = [
        'Scan windows, rooftops and scrub for a flash of scope glint',
        this.touchMode ? 'When the glint flares he is about to fire — hold COVER' : 'When the glint flares he is about to fire — hold SPACE to drop into cover',
        'He has to reacquire you after you duck. Pop up, settle, and take the shot',
      ]
    }
    this.addActors()
  }

  private addActors(): void {
    if (!this.session) return
    for (const actor of this.session.actors) {
      if (!actor.group.parent) this.scene.add(actor.group)
      actor.setFlashlightVisible(this.preset.night)
    }
  }

  private queueHints(mission: MissionSpec): void {
    if (!this.settings.hints) return
    const hints: string[] = []
    if (mission.tutorial && this.touchMode) {
      hints.push(
        'Drag anywhere to aim. Tap SCOPE to raise the optic',
        'Hold STEADY to hold your breath and calm the reticle',
        `Tap RANGE to measure and tag a target. Your zero is ${mission.zero} m`,
        'Use the ZERO buttons to match your zero to the range',
        'Tap FIRE. Tagged hostiles stay marked through cover',
      )
    } else if (mission.tutorial) {
      hints.push(
        'Right-click to raise your scope. Scroll to change magnification',
        'Hold SHIFT to hold your breath and steady the reticle',
        `Press F to range and tag a target. Your zero is ${mission.zero} m`,
        'Use ↑ / ↓ to change your zero to match the range',
        'Left-click to fire. Tagged hostiles stay marked through cover',
      )
    } else {
      hints.push(this.touchMode ? `Zeroed at ${mission.zero} m. Tap RANGE, then adjust ZERO` : `Zeroed at ${mission.zero} m. Range with F and adjust with ↑ / ↓`)
      if (mission.wind.max >= 3) hints.push('Strong wind: watch the flags and windsocks, then hold into it')
    }
    if (mission.thermal) hints.unshift(this.touchMode ? 'Tap THERMAL to switch your optic to thermal' : 'Press T to switch your optic to thermal')
    if (mission.spawns.some((spawn) => spawn.kind === 'sniper')) hints.push(this.touchMode ? 'Watch for scope glint. Hold COVER when it flares' : 'Watch for scope glint. Hold SPACE for cover when it flares')
    if (mission.spawns.some((spawn) => spawn.kind === 'civilian')) hints.push('Civilians are present. A single civilian casualty fails the mission')
    this.hints = hints
    this.hintTimer = 2.5
  }

  pause(): void {
    if (this.mode !== 'mission' && this.mode !== 'duel') return
    this.paused = true
    this.keys.clear()
    this.player.holding = false
    this.coverHeld = false
    this.touchAim = null
    this.audio.setHeartbeat(0)
    this.releasePointer()
  }

  resume(): void {
    this.paused = false
    this.timer.reset()
    this.requestPointer()
  }

  /** Touch devices aim by dragging and never request pointer lock. */
  setTouchMode(touch: boolean): void {
    this.touchMode = touch
    if (touch) this.host.classList.remove('look-fallback')
    this.callbacks.onEvent({ type: 'pointer', locked: true })
  }

  setScoped(scoped: boolean): void {
    this.player.scoped = scoped
  }

  toggleScope(): void {
    this.player.scoped = !this.player.scoped
  }

  setHoldingBreath(holding: boolean): void {
    this.player.holding = holding
  }

  setCover(cover: boolean): void {
    this.coverHeld = cover
    if (cover) this.player.scoped = false
  }

  /** Sets magnification from 0 (lowest) to 1 (highest). */
  setZoomFraction(fraction: number): void {
    if (!this.loadout) return
    const [min, max] = this.loadout.rifle.zoom
    this.player.zoom = min * Math.pow(max / min, clamp(fraction, 0, 1))
  }

  skipKillCam(): void {
    if (this.killCam) this.killCam.skip = true
  }

  /** Stops rendering entirely (e.g. while another 3D view owns the GPU). */
  setSuspended(suspended: boolean): void {
    this.suspended = suspended
    if (!suspended) this.timer.reset()
  }

  get inSession(): boolean {
    return this.mode === 'mission' || this.mode === 'duel'
  }

  // -------------------------------------------------------------------------
  // Pointer and input

  requestPointer(): void {
    this.audio.unlock()
    if (this.fallbackLook || this.touchMode || !this.inSession) return
    const canvas = this.renderer.domElement
    if (typeof canvas.requestPointerLock !== 'function') {
      this.enableFallbackLook()
      return
    }
    try {
      const result = canvas.requestPointerLock() as unknown as Promise<void> | undefined
      if (result && typeof result.then === 'function') result.catch(() => this.lockFailed())
    } catch {
      this.lockFailed()
    }
  }

  /** Browsers briefly refuse to re-lock right after Esc; only give up after repeated failures. */
  private lockFailed(): void {
    this.lockFailures += 1
    if (this.lockFailures >= 2) this.enableFallbackLook()
  }

  private enableFallbackLook(): void {
    this.fallbackLook = true
    this.host.classList.add('look-fallback')
  }

  private releasePointer(): void {
    if (document.pointerLockElement === this.renderer?.domElement) {
      this.suppressPause = true
      document.exitPointerLock()
    }
    this.host.classList.remove('look-active')
  }

  private bindInput(): void {
    const canvas = this.renderer.domElement
    const on = <K extends keyof WindowEventMap>(target: Window | Document | HTMLElement, type: K | string, handler: (event: never) => void, options?: AddEventListenerOptions) => {
      target.addEventListener(type, handler as EventListener, options)
      this.cleanup.push(() => target.removeEventListener(type, handler as EventListener, options))
    }
    on(document, 'pointerlockchange', () => {
      const locked = document.pointerLockElement === canvas
      if (locked) this.lockFailures = 0
      this.pointerLocked = locked
      this.host.classList.toggle('look-active', locked)
      this.callbacks.onEvent({ type: 'pointer', locked })
      if (!locked && this.inSession && !this.paused && !this.suppressPause) this.callbacks.onEvent({ type: 'pause' })
      this.suppressPause = false
    })
    on(document, 'pointerlockerror', () => this.lockFailed())
    on(canvas, 'contextmenu', (event: MouseEvent) => event.preventDefault())
    // Touch: drag anywhere on the world to aim; buttons handle the rest.
    on(canvas, 'touchstart', (event: TouchEvent) => {
      event.preventDefault()
      this.audio.unlock()
      if (!this.touchMode) this.setTouchMode(true)
      if (!this.inSession || this.paused) return
      if (this.killCam) {
        this.killCam.skip = true
        return
      }
      const touch = event.changedTouches[0]
      if (touch && !this.touchAim) this.touchAim = { id: touch.identifier, x: touch.clientX, y: touch.clientY }
    }, { passive: false })
    on(canvas, 'touchmove', (event: TouchEvent) => {
      event.preventDefault()
      if (!this.touchAim || this.paused) return
      for (const touch of Array.from(event.changedTouches)) {
        if (touch.identifier !== this.touchAim.id) continue
        this.lookDX += (touch.clientX - this.touchAim.x) * 1.25
        this.lookDY += (touch.clientY - this.touchAim.y) * 1.25
        this.touchAim.x = touch.clientX
        this.touchAim.y = touch.clientY
      }
    }, { passive: false })
    const endTouch = (event: TouchEvent) => {
      for (const touch of Array.from(event.changedTouches)) if (touch.identifier === this.touchAim?.id) this.touchAim = null
    }
    on(canvas, 'touchend', endTouch)
    on(canvas, 'touchcancel', endTouch)
    on(canvas, 'mousedown', (event: MouseEvent) => {
      event.preventDefault()
      if (this.touchMode) return
      canvas.focus()
      this.audio.unlock()
      if (!this.inSession || this.paused) return
      if (!this.pointerLocked && !this.fallbackLook) {
        this.requestPointer()
        return
      }
      if (event.button === 0) {
        if (this.killCam) this.killCam.skip = true
        else this.fire()
      } else if (event.button === 2) {
        this.player.scoped = this.settings.scopeMode === 'toggle' ? !this.player.scoped : true
      }
    })
    on(window, 'mouseup', (event: MouseEvent) => {
      if (event.button === 2 && this.settings.scopeMode === 'hold') this.player.scoped = false
    })
    on(window, 'mousemove', (event: MouseEvent) => {
      if (!this.inSession || this.paused) return
      if (this.pointerLocked || this.fallbackLook) {
        this.lookDX += event.movementX
        this.lookDY += event.movementY
      }
      const rect = canvas.getBoundingClientRect()
      this.cursor.x = (event.clientX - rect.left) / rect.width
      this.cursor.y = (event.clientY - rect.top) / rect.height
      this.cursor.inside = this.cursor.x >= 0 && this.cursor.x <= 1 && this.cursor.y >= 0 && this.cursor.y <= 1
    })
    on(canvas, 'wheel', (event: WheelEvent) => {
      event.preventDefault()
      if (!this.inSession || this.paused) return
      this.changeZoom(event.deltaY < 0 ? 1.12 : 1 / 1.12)
    }, { passive: false })
    on(window, 'keydown', (event: KeyboardEvent) => {
      if (!this.inSession || this.paused) return
      const code = event.code
      if (['Space', 'ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Tab'].includes(code)) event.preventDefault()
      if (event.repeat && code !== 'KeyW' && code !== 'KeyA' && code !== 'KeyS' && code !== 'KeyD') return
      this.keys.add(code)
      switch (code) {
        case 'ShiftLeft':
        case 'ShiftRight':
          this.player.holding = true
          break
        case 'Space':
          if (this.killCam) this.killCam.skip = true
          break
        case 'KeyR':
          this.startReload()
          break
        case 'KeyF':
          this.rangefind()
          break
        case 'KeyT':
          this.toggleThermal()
          break
        case 'ArrowUp':
        case 'PageUp':
          this.changeZero(1)
          break
        case 'ArrowDown':
        case 'PageDown':
          this.changeZero(-1)
          break
        case 'KeyE':
          this.changeZoom(1.25)
          break
        case 'KeyQ':
          this.changeZoom(1 / 1.25)
          break
        case 'KeyV':
          this.player.scoped = !this.player.scoped
          break
        case 'Escape':
          if (this.fallbackLook) this.callbacks.onEvent({ type: 'pause' })
          break
      }
    })
    on(window, 'keyup', (event: KeyboardEvent) => {
      this.keys.delete(event.code)
      if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') this.player.holding = false
    })
    on(window, 'blur', () => {
      this.keys.clear()
      this.player.holding = false
    })
    this.resizeObserver = new ResizeObserver(() => this.resize())
    this.resizeObserver.observe(this.host)
  }

  changeZoom(factor: number): void {
    if (!this.loadout) return
    const [min, max] = this.loadout.rifle.zoom
    const next = clamp(this.player.zoom * factor, min, max)
    if (Math.abs(next - this.player.zoom) > 0.01) this.audio.click('zoom')
    this.player.zoom = next
  }

  changeZero(direction: number): void {
    const index = ZERO_DISTANCES.indexOf(this.player.zero)
    const next = ZERO_DISTANCES[clamp((index < 0 ? 2 : index) + direction, 0, ZERO_DISTANCES.length - 1)]
    if (next !== this.player.zero) {
      this.player.zero = next
      this.audio.click('zero')
    }
  }

  toggleThermal(): void {
    if (!this.missionThermal) {
      this.callbacks.onEvent({ type: 'notice', text: 'This optic has no thermal channel on this mission', tone: 'info' })
      return
    }
    this.player.thermal = !this.player.thermal
    this.audio.click('thermal')
  }

  private zeroAngle(rifle: RifleSpec, zero: number): number {
    const key = `${rifle.id}:${zero}`
    let angle = this.zeroCache.get(key)
    if (angle === undefined) {
      angle = solveZeroAngle(rifle, zero)
      this.zeroCache.set(key, angle)
    }
    return angle
  }

  // -------------------------------------------------------------------------
  // Host API used by sessions

  playerExposed(): boolean {
    return !this.player.dead && this.player.duck < 0.45 && (this.session?.live ?? false)
  }

  sinceLoudShot(): number {
    return this.time - this.player.lastLoud
  }

  playerDead(): boolean {
    return this.player.dead
  }

  emit(event: GameEvent): void {
    this.callbacks.onEvent(event)
    if (event.type === 'missionEnd' || event.type === 'duelEnd') {
      this.player.scoped = false
      this.releasePointer()
      this.audio.setHeartbeat(0)
      this.audio.setMusic('none')
    }
  }

  resetPlayer(): void {
    const p = this.player
    const rifle = this.loadout?.rifle
    p.health = 100
    p.dead = false
    p.lastHurt = -99
    p.heart = 72
    p.scoped = false
    p.scope = 0
    p.breath = 1
    p.exhausted = 0
    p.cycle = 0
    p.reload = 0
    p.chambered = true
    p.autoReload = false
    if (rifle) {
      p.ammo = rifle.magazine
      p.reserve = rifle.reserve
    }
    const dx = this.focus.x - this.eye.x
    const dz = this.focus.z - this.eye.z
    p.yaw = clamp(Math.atan2(dx, -dz), -YAW_LIMIT, YAW_LIMIT)
    p.pitch = clamp(Math.atan2(this.focus.y - this.eye.y, Math.hypot(dx, dz)), PITCH_MIN, PITCH_MAX)
    p.recoilP = p.recoilPV = p.recoilY = p.recoilYV = 0
    this.deathCam = null
    this.damageCues = []
    this.damageFlash = 0
  }

  damagePlayer(amount: number, from: THREE.Vector3): void {
    const p = this.player
    if (p.dead || !this.session) return
    if (this.session.kind === 'mission' && !this.session.live) return
    p.health -= amount
    p.lastHurt = this.time
    p.heart = Math.min(165, p.heart + 30)
    this.damageFlash = 1
    this.shake = Math.max(this.shake, 1)
    this.damageCues.push({ bearing: Math.atan2(from.x - this.eye.x, -(from.z - this.eye.z)), age: 0 })
    this.audio.playerHit()
    if (p.health <= 0) {
      p.health = 0
      p.dead = true
      p.scoped = false
      if (this.session.kind === 'duel') this.deathCam = { timer: 0 }
    }
  }

  enemyFire(from: THREE.Vector3, hit: boolean, kind: 'rifle' | 'sniper' | 'heavy'): void {
    if (!this.session) return
    let to: THREE.Vector3
    if (hit) {
      to = this.eye.clone()
    } else if (this.random() < 0.3 && this.player.duck < 0.5) {
      // Through the opening, snapping past the shooter into the back wall.
      to = new THREE.Vector3((this.random() - 0.5) * 2.4, NEST_FLOOR + 1.2 + this.random() * 1.3, 35.15)
    } else {
      const side = this.random() < 0.5 ? -1 : 1
      const onSill = this.random() < 0.4
      to = new THREE.Vector3(
        onSill ? (this.random() - 0.5) * 2.8 : side * (1.6 + this.random() * 1.8),
        onSill ? NEST_FLOOR + 0.2 + this.random() * 0.6 : NEST_FLOOR + 0.4 + this.random() * 2.2,
        NEST.wallZ - NEST.wallThickness - 0.01,
      )
    }
    _v.copy(to).sub(from).normalize()
    this.effects.enemyMuzzle(from.x, from.y, from.z, _v.x, _v.y, _v.z, kind === 'sniper')
    const distance = from.distanceTo(this.eye)
    const relative = Math.atan2(from.x - this.eye.x, -(from.z - this.eye.z)) - this.player.yaw
    this.audio.incoming(distance, hit, kind !== 'rifle', clamp(Math.sin(relative) * 1.5, -0.9, 0.9))
    const duration = distance / (kind === 'sniper' ? 850 : 700)
    const trail = kind === 'sniper' ? null : this.effects.trail(kind === 'heavy' ? '#ff9a52' : '#ffb26b', 2.4, 0.85, 0.09, true)
    this.rounds.push({ from: from.clone(), to, t: 0, duration, trail, hit })
  }

  // -------------------------------------------------------------------------
  // Rifle actions

  startReload(): void {
    const p = this.player
    const rifle = this.loadout?.rifle
    if (!rifle || p.reload > 0 || p.reserve <= 0 || p.ammo >= rifle.magazine || p.dead) return
    p.reload = rifle.reloadTime
    p.reloadTotal = rifle.reloadTime
    p.scoped = false
    this.view.reload(rifle.reloadTime)
    this.audio.reload(rifle.reloadTime)
  }

  private aimRay(): { origin: THREE.Vector3; dir: THREE.Vector3 } {
    return { origin: this.camera.position.clone(), dir: _forward.set(0, 0, -1).applyQuaternion(this.camera.quaternion).clone() }
  }

  /** Nearest actor, surface, or terrain along a straight ray (for ranging and tagging). */
  private probe(maxT = 1600): { t: number; actor: Actor | null } | null {
    const { origin, dir } = this.aimRay()
    let best: { t: number; actor: Actor | null } | null = null
    const hit = this.world.raycast(origin.x, origin.y, origin.z, dir.x, dir.y, dir.z, maxT)
    if (hit) best = { t: hit.t, actor: null }
    for (const actor of this.session?.actors ?? []) {
      if (actor.hidden) continue
      const limit = best ? best.t : maxT
      const result = actor.hitTest(origin.x, origin.y, origin.z, dir.x, dir.y, dir.z, limit, 0.35)
      if (result && (!best || result.t < best.t)) best = { t: result.t, actor }
    }
    return best
  }

  rangefind(): void {
    if (!this.session || this.player.dead) return
    const result = this.probe()
    this.player.range = result ? result.t : null
    this.player.rangeTime = this.time
    this.audio.click('range')
    if (result?.actor && result.actor.alive && !this.tags.has(result.actor)) {
      this.tags.add(result.actor)
      const label = result.actor.kind === 'civilian' ? 'Civilian marked' : result.actor.kind === 'hvt' ? 'Target marked' : 'Hostile tagged'
      this.callbacks.onEvent({ type: 'notice', text: `${label} · ${Math.round(result.t)} m`, tone: result.actor.kind === 'civilian' ? 'info' : 'good' })
    }
  }

  fire(): void {
    const p = this.player
    const rifle = this.loadout?.rifle
    const session = this.session
    if (!rifle || !session || !session.live || p.dead || p.duck > 0.3 || this.killCam || this.deathCam) return
    if (p.reload > 0 || p.cycle > 0) return
    if (!p.chambered || p.ammo <= 0) {
      this.audio.dryFire()
      if (p.ammo <= 0) this.startReload()
      return
    }
    p.ammo -= 1
    p.chambered = false
    const scoped = p.scope > 0.9
    this.camera.updateMatrixWorld()
    _forward.set(0, 0, -1).applyQuaternion(this.camera.quaternion)
    _up.set(0, 1, 0).applyQuaternion(this.camera.quaternion)
    _right.set(1, 0, 0).applyQuaternion(this.camera.quaternion)
    const angle = this.zeroAngle(rifle, p.zero)
    const dir = _forward.clone().multiplyScalar(Math.cos(angle)).addScaledVector(_up, Math.sin(angle))
    if (!scoped) {
      // Unsupported hip shots wander inside a cone.
      const spread = (1.4 * DEG) * Math.sqrt(this.random())
      const a = this.random() * Math.PI * 2
      dir.addScaledVector(_right, Math.cos(a) * spread).addScaledVector(_up, Math.sin(a) * spread)
    }
    dir.normalize()
    const origin = this.camera.position.clone().addScaledVector(dir, 0.35)
    const state: BulletState = {
      px: origin.x,
      py: origin.y,
      pz: origin.z,
      vx: dir.x * rifle.muzzleVelocity,
      vy: dir.y * rifle.muzzleVelocity,
      vz: dir.z * rifle.muzzleVelocity,
    }
    const bullet: Bullet = {
      state,
      rifle,
      time: 0,
      alive: true,
      trail: this.effects.trail('#e9ecef', 1.6, scoped ? 0.32 : 0.18, 0.55),
      start: origin.clone(),
    }
    bullet.trail.push(origin.x, origin.y, origin.z, this.time)
    this.bullets.push(bullet)
    // Decide on a bullet camera by predicting the flight against the current scene.
    if (this.settings.killCam !== 'off') {
      const predicted = this.predict(state, rifle)
      if (predicted?.actor && predicted.part && session.wouldKill(predicted.actor, predicted.part, rifle)) {
        const distance = origin.distanceTo(predicted.point)
        const worthy = this.settings.killCam === 'always' || session.isFinalTarget(predicted.actor)
        if (worthy && distance > 120) this.startKillCam(bullet, predicted.actor, predicted.time)
      }
    }
    session.onPlayerFired(rifle)
    this.view.fire()
    this.audio.shot(rifle)
    const shake = this.settings.reduceShake ? 0.35 : 1
    p.recoilPV += rifle.recoil * 34 * DEG * shake
    p.recoilYV += (this.random() - 0.5) * rifle.recoil * 10 * DEG * shake
    this.shake = Math.max(this.shake, 0.35 * rifle.recoil * shake)
    this.flash = (scoped ? 0.22 : 0.1) * (this.settings.reduceFlashing ? 0.25 : 1) * (rifle.suppressed ? 0.3 : 1)
    p.heart = Math.min(150, p.heart + 5)
    if (!rifle.suppressed) {
      p.lastLoud = this.time
      this.effects.muzzleBlast(this.eye.x, this.eye.y, NEST.wallZ - 0.6, Math.sin(p.yaw), -Math.cos(p.yaw), rifle.loudness)
    }
    p.cycle = rifle.cycleTime
    p.cycleTotal = rifle.cycleTime
    this.view.cycle(rifle.cycleTime)
    this.audio.bolt(rifle.action, rifle.cycleTime)
    if (p.ammo <= 0 && p.reserve > 0) p.autoReload = true
  }

  private predict(source: BulletState, rifle: RifleSpec): { actor: Actor | null; part: HitPart | undefined; point: THREE.Vector3; time: number } | null {
    const state = { ...source }
    let time = 0
    for (let i = 0; i < 2200; i += 1) {
      const ax = state.px
      const ay = state.py
      const az = state.pz
      stepBullet(state, this.windVector, rifle.drag, BALLISTIC_STEP)
      time += BALLISTIC_STEP
      const hit = this.trace(ax, ay, az, state.px, state.py, state.pz)
      if (hit) {
        const length = Math.hypot(state.px - ax, state.py - ay, state.pz - az)
        const f = hit.t / length
        return { actor: hit.actor ?? null, part: hit.part, point: new THREE.Vector3(ax + (state.px - ax) * f, ay + (state.py - ay) * f, az + (state.pz - az) * f), time }
      }
    }
    return null
  }

  private trace(ax: number, ay: number, az: number, bx: number, by: number, bz: number): TraceHit | null {
    const dx = bx - ax
    const dy = by - ay
    const dz = bz - az
    const length = Math.hypot(dx, dy, dz)
    if (length < 1e-6) return null
    const nx = dx / length
    const ny = dy / length
    const nz = dz / length
    let best: TraceHit | null = null
    let limit = length
    for (const actor of this.session?.actors ?? []) {
      if (actor.hidden) continue
      const hit = actor.hitTest(ax, ay, az, nx, ny, nz, limit)
      if (hit && hit.t <= limit) {
        limit = hit.t
        best = { t: hit.t, kind: 'actor', actor, part: hit.part, surface: 'fabric', nx: -nx, ny: -ny, nz: -nz }
      }
    }
    const hard = this.world.collision.raycast(ax, ay, az, nx, ny, nz, limit)
    if (hard) {
      limit = hard.t
      best = { t: hard.t, kind: 'world', surface: hard.surface, nx: hard.nx, ny: hard.ny, nz: hard.nz }
    }
    const groundB = terrainHeight(bx, bz)
    if (by < groundB) {
      let lo = 0
      let hi = length
      for (let i = 0; i < 16; i += 1) {
        const mid = (lo + hi) / 2
        const gap = ay + ny * mid - terrainHeight(ax + nx * mid, az + nz * mid)
        if (gap < 0) hi = mid
        else lo = mid
      }
      if (hi < limit) {
        const [tx, ty, tz] = terrainNormal(ax + nx * hi, az + nz * hi)
        best = { t: hi, kind: 'terrain', surface: 'dirt', nx: tx, ny: ty, nz: tz }
      }
    }
    return best
  }

  private updateBullets(dt: number): void {
    if (dt <= 0) return
    for (const bullet of this.bullets) {
      if (!bullet.alive) continue
      const state = bullet.state
      const sx = state.px
      const sy = state.py
      const sz = state.pz
      const steps = Math.min(800, Math.max(1, Math.ceil(dt / BALLISTIC_STEP)))
      const h = dt / steps
      for (let i = 0; i < steps; i += 1) {
        const ax = state.px
        const ay = state.py
        const az = state.pz
        stepBullet(state, this.windVector, bullet.rifle.drag, h)
        bullet.time += h
        const hit = this.trace(ax, ay, az, state.px, state.py, state.pz)
        if (hit) {
          this.resolveHit(bullet, hit, ax, ay, az)
          break
        }
        if (bullet.time > 4.5 || state.py < -40) {
          bullet.alive = false
          break
        }
      }
      bullet.trail.push(state.px, state.py, state.pz, this.time)
      this.session?.onBulletSegment(sx, sy, sz, state.px, state.py, state.pz)
      if (!bullet.alive) bullet.trail.active = false
    }
    this.bullets = this.bullets.filter((bullet) => bullet.alive || this.killCam?.bullet === bullet)
  }

  private resolveHit(bullet: Bullet, hit: TraceHit, ax: number, ay: number, az: number): void {
    const state = bullet.state
    const length = Math.hypot(state.px - ax, state.py - ay, state.pz - az)
    const f = length > 0 ? hit.t / length : 0
    const px = ax + (state.px - ax) * f
    const py = ay + (state.py - ay) * f
    const pz = az + (state.pz - az) * f
    state.px = px
    state.py = py
    state.pz = pz
    bullet.alive = false
    const speed = Math.hypot(state.vx, state.vy, state.vz)
    const dirX = state.vx / speed
    const dirZ = state.vz / speed
    const distance = Math.hypot(px - this.eye.x, py - this.eye.y, pz - this.eye.z)
    const pan = clamp(Math.sin(Math.atan2(px - this.eye.x, -(pz - this.eye.z)) - this.player.yaw) * 1.4, -0.9, 0.9)
    const delay = distance / 343
    if (hit.kind === 'actor' && hit.actor && hit.part) {
      const report = this.session?.onActorHit(hit.actor, hit.part, { distance, rifle: bullet.rifle, dirX, dirZ }) ?? { result: 'none' }
      const headshot = hit.part === 'head'
      if (report.result === 'armor') {
        this.effects.impact('metal', px, py, pz, -dirX, 0.2, -dirZ, 0.8)
        this.registerHit('armor')
        this.audio.impact('metal', distance, delay, pan)
      } else {
        this.effects.impact('flesh', px, py, pz, dirX * 0.6, 0.25, dirZ * 0.6, headshot ? 1.2 : 0.9)
        if (report.result === 'kill') this.registerHit(headshot ? 'headshot' : 'kill')
        else if (report.result !== 'none') this.registerHit('hit')
        this.audio.impact('flesh', distance, delay, pan)
      }
      return
    }
    this.effects.impact(hit.surface, px, py, pz, hit.nx, hit.ny, hit.nz, clamp(distance / 350, 0.8, 1.8))
    if (hit.surface !== 'foliage' && hit.surface !== 'fabric' && hit.surface !== 'glass') this.effects.decal(px, py, pz, hit.nx, hit.ny, hit.nz, 0.18)
    this.audio.impact(hit.surface, distance, delay, pan)
    this.session?.onBulletImpact(px, py, pz)
  }

  private registerHit(kind: NonNullable<OverlayFrame['hitKind']>): void {
    this.hitAge = 0
    this.hitKind = kind
    this.audio.hitConfirm(kind === 'headshot' ? 'headshot' : kind === 'kill' ? 'kill' : kind === 'armor' ? 'armor' : 'hit')
  }

  private updateEnemyRounds(dt: number): void {
    for (const round of this.rounds) {
      round.t += dt
      const u = Math.min(1, round.t / round.duration)
      _v.copy(round.from).lerp(round.to, u)
      round.trail?.push(_v.x, _v.y, _v.z, this.time)
      if (u >= 1 && !round.hit) {
        _w.copy(round.to).sub(round.from).normalize()
        this.effects.impact('concrete', round.to.x, round.to.y, round.to.z, -_w.x, -_w.y, -_w.z, 0.55)
        this.effects.decal(round.to.x, round.to.y, round.to.z, 0, 0, round.to.z > 30 ? -1 : 1, 0.12)
        if (round.to.z > 30) this.shake = Math.max(this.shake, 0.4)
      }
    }
    this.rounds = this.rounds.filter((round) => {
      const done = round.t >= round.duration
      if (done && round.trail) round.trail.active = false
      return !done
    })
  }

  // -------------------------------------------------------------------------
  // Cameras

  private startKillCam(bullet: Bullet, target: Actor, flight: number): void {
    this.killCam = {
      bullet,
      target,
      phase: 'flight',
      timer: 0,
      side: this.random() < 0.5 ? -1 : 1,
      orbit: 0,
      flight,
      skip: false,
      camPos: this.camera.position.clone(),
      lookAt: new THREE.Vector3(bullet.state.px, bullet.state.py, bullet.state.pz),
    }
    this.audio.whoosh(2.6)
    this.player.scoped = false
  }

  private updateKillCam(realDt: number): void {
    const kc = this.killCam
    if (!kc) {
      this.timeScale = 1
      return
    }
    kc.timer += realDt
    const state = kc.bullet.state
    const pos = _v.set(state.px, state.py, state.pz)
    const speed = Math.hypot(state.vx, state.vy, state.vz) || 1
    _forward.set(state.vx / speed, state.vy / speed, state.vz / speed)
    _right.crossVectors(_forward, _up.set(0, 1, 0)).normalize()
    const chest = kc.target.chestPosition(_w)
    if (kc.phase === 'flight') {
      if (!kc.bullet.alive) {
        kc.phase = kc.skip ? 'after' : 'impact'
        kc.timer = 0
      } else {
        const remaining = pos.distanceTo(chest)
        this.timeScale = kc.skip ? 1 : remaining < 18 ? 0.032 : clamp(kc.flight / 2.1, 0.03, 0.3)
        const near = 1 - THREE.MathUtils.smoothstep(remaining, 6, 22)
        const follow = pos.clone().addScaledVector(_forward, -1.15).addScaledVector(_right, 0.3 * kc.side).add(new THREE.Vector3(0, 0.1, 0))
        const side = chest.clone().addScaledVector(_right, 2.4 * kc.side).addScaledVector(_forward, -0.6).add(new THREE.Vector3(0, 0.35, 0))
        kc.camPos.copy(follow).lerp(side, near * 0.85)
        kc.lookAt.copy(pos).addScaledVector(_forward, 2.5 * (1 - near))
        this.bulletMesh.visible = true
        this.bulletMesh.position.copy(pos)
        this.bulletMesh.lookAt(pos.clone().add(_forward))
        this.bulletMesh.rotateZ(kc.timer * 30)
      }
    }
    if (kc.phase === 'impact') {
      this.bulletMesh.visible = false
      this.timeScale = 0.07
      kc.lookAt.lerp(chest, damp(6, realDt))
      if (kc.timer > 0.75) {
        kc.phase = 'after'
        kc.timer = 0
        kc.orbit = Math.atan2(kc.camPos.x - chest.x, kc.camPos.z - chest.z)
      }
    }
    if (kc.phase === 'after') {
      this.bulletMesh.visible = false
      this.timeScale = kc.skip ? 1 : 0.32
      kc.orbit += realDt * 0.4 * kc.side
      const target = new THREE.Vector3(chest.x + Math.sin(kc.orbit) * 3.1, chest.y + 0.9, chest.z + Math.cos(kc.orbit) * 3.1)
      kc.camPos.lerp(target, damp(3, realDt))
      kc.lookAt.lerp(chest, damp(5, realDt))
      if (kc.timer > (kc.skip ? 0.25 : 1.8)) {
        this.killCam = null
        this.timeScale = 1
      }
    }
  }

  private updateCamera(realDt: number): void {
    const p = this.player
    const baseFov = this.settings.fov
    if (this.killCam) {
      this.camera.position.copy(this.killCam.camPos)
      this.camera.lookAt(this.killCam.lookAt)
      this.camera.fov = 42
      this.camera.updateProjectionMatrix()
      this.letterbox += (0.085 - this.letterbox) * damp(6, realDt)
      return
    }
    this.letterbox += (0 - this.letterbox) * damp(8, realDt)
    const duckHeight = EYE_Y - (EYE_Y - COVER_EYE_Y) * THREE.MathUtils.smoothstep(p.duck, 0, 1)
    this.cameraBase.set(this.eye.x, duckHeight, this.eye.z)
    if (this.deathCam) {
      this.deathCam.timer += realDt
      const killer = this.session?.killer()
      this.camera.position.set(this.eye.x, EYE_Y, this.eye.z)
      if (killer) {
        killer.headPosition(_v)
        const target = Math.atan2(_v.x - this.eye.x, -(_v.z - this.eye.z))
        const pitch = Math.atan2(_v.y - EYE_Y, Math.hypot(_v.x - this.eye.x, _v.z - this.eye.z))
        const u = damp(2.5, realDt)
        p.yaw += (target - p.yaw) * u
        p.pitch += (pitch - p.pitch) * u
      }
      const zoomed = SCOPE_TFOV / 9
      const t = THREE.MathUtils.smoothstep(this.deathCam.timer, 0.3, 1.6)
      this.camera.fov = Math.exp(THREE.MathUtils.lerp(Math.log(baseFov), Math.log(zoomed), t))
      this.camera.rotation.set(p.pitch, -p.yaw, 0.08 * t)
      this.camera.updateProjectionMatrix()
      return
    }
    // Mild shake from shots and incoming fire.
    this.shake = Math.max(0, this.shake - realDt * 2.5)
    const shakeScale = this.settings.reduceShake ? 0.3 : 1
    const shakeX = (noise1(this.time * 31, 4) * 0.004 + (this.random() - 0.5) * 0.002) * this.shake * shakeScale
    const shakeY = (noise1(this.time * 29, 5) * 0.004 + (this.random() - 0.5) * 0.002) * this.shake * shakeScale
    const scope = THREE.MathUtils.smoothstep(p.scope, 0, 1)
    const scopedFov = SCOPE_TFOV / p.zoom
    const fov = Math.exp(THREE.MathUtils.lerp(Math.log(baseFov), Math.log(scopedFov), scope))
    this.camera.fov = fov
    this.camera.updateProjectionMatrix()
    this.camera.position.copy(this.cameraBase)
    const dead = p.dead ? THREE.MathUtils.smoothstep(this.time - p.lastHurt, 0, 1.2) : 0
    this.camera.position.y -= dead * 0.6
    const yaw = p.yaw + p.swayX + p.recoilY + shakeX
    const pitch = p.pitch + p.swayY + p.recoilP + shakeY - dead * 0.3
    this.camera.rotation.set(pitch, -yaw, dead * 0.5)
  }

  private updateMenuCamera(realDt: number): void {
    this.menuAngle += realDt * 0.016
    const a = this.menuAngle
    const cx = 30
    const cz = -330
    const r = 300
    const x = cx + Math.sin(a) * r
    const z = cz + Math.cos(a) * r
    const y = Math.max(terrainHeight(x, z) + 42, 66) + Math.sin(a * 2.3) * 7
    this.camera.position.set(x, y, z)
    this.camera.lookAt(cx + Math.sin(a + 0.85) * 70, 6, cz + Math.cos(a + 0.85) * 70)
    this.camera.fov = 48
    this.camera.updateProjectionMatrix()
  }

  // -------------------------------------------------------------------------
  // Frame

  private frame(): void {
    this.timer.update()
    const realDt = clamp(this.timer.getDelta(), 0, 0.1)
    if (this.paused || this.suspended) return
    const dt = realDt * this.timeScale
    this.time += dt
    this.update(dt, realDt)
    this.render(realDt)
  }

  private updateWind(realDt: number): void {
    const t = this.time * 0.12 + this.windSeed
    const gust = 1 + noise1(t, 11) * 0.22 + noise1(t * 3.1, 12) * 0.08
    this.windSpeed = Math.max(0, this.windBase * gust)
    this.windFrom = this.windSpec.from + noise1(t * 0.4, 13) * 9
    const toward = (this.windFrom + 180) * DEG
    this.windVector.set(Math.sin(toward) * this.windSpeed, 0, -Math.cos(toward) * this.windSpeed)
    void realDt
  }

  private updatePlayer(dt: number, realDt: number): void {
    const p = this.player
    const rifle = this.loadout?.rifle
    const session = this.session
    if (!rifle || !session) return
    const baseFov = this.settings.fov
    const fovRatio = this.camera.fov / baseFov
    const live = session.live && !this.killCam && !this.deathCam
    // Look input.
    let dx = this.lookDX
    let dy = this.lookDY
    this.lookDX = 0
    this.lookDY = 0
    if (this.fallbackLook && this.cursor.inside) {
      const edge = 0.06
      if (this.cursor.x < edge) dx -= ((edge - this.cursor.x) / edge) * 900 * realDt
      if (this.cursor.x > 1 - edge) dx += ((this.cursor.x - (1 - edge)) / edge) * 900 * realDt
      if (this.cursor.y < edge) dy -= ((edge - this.cursor.y) / edge) * 600 * realDt
      if (this.cursor.y > 1 - edge) dy += ((this.cursor.y - (1 - edge)) / edge) * 600 * realDt
    }
    if (this.keys.has('KeyA')) dx -= 420 * realDt
    if (this.keys.has('KeyD')) dx += 420 * realDt
    if (this.keys.has('KeyW')) dy -= 420 * realDt
    if (this.keys.has('KeyS')) dy += 420 * realDt
    if (!p.dead && !this.deathCam && !this.killCam) {
      const scoped = p.scope > 0.5
      const sensitivity = 0.0021 * this.settings.sensitivity * (scoped ? fovRatio * this.settings.scopedSensitivity * 1.4 : Math.max(0.35, fovRatio))
      p.yaw = clamp(p.yaw + dx * sensitivity, -YAW_LIMIT, YAW_LIMIT)
      p.pitch = clamp(p.pitch - dy * sensitivity * (this.settings.invertY ? -1 : 1), PITCH_MIN, PITCH_MAX)
    }
    this.lookVelocity.set(dx / Math.max(realDt, 1e-3), dy / Math.max(realDt, 1e-3))
    // Cover.
    const wantDuck = ((this.keys.has('Space') || this.coverHeld) && !this.killCam) || session.forceCover || p.dead
    p.duck += ((wantDuck ? 1 : 0) - p.duck) * damp(wantDuck ? 9 : 6, realDt)
    // Scope.
    const canScope = p.scoped && p.duck < 0.25 && p.reload <= 0 && !p.dead && live
    p.scope = clamp(p.scope + (canScope ? realDt * 4.6 : -realDt * 6), 0, 1)
    // Breath control.
    const wasHolding = p.holdingActive
    p.holdingActive = p.holding && p.scope > 0.85 && p.exhausted <= 0 && p.breath > 0 && live
    if (p.holdingActive) {
      p.breath -= realDt / 5.5
      if (p.breath <= 0) {
        p.breath = 0
        p.exhausted = 2.6
        p.holdingActive = false
        p.heart = Math.min(150, p.heart + 18)
      }
    } else {
      if (p.exhausted > 0) p.exhausted -= realDt
      else p.breath = Math.min(1, p.breath + realDt / 3.2)
    }
    if (p.holdingActive && !wasHolding) this.audio.breath(true)
    if (!p.holdingActive && wasHolding) this.audio.breath(false)
    this.audio.setHeartbeat(p.holdingActive || p.health < 40 ? p.heart : 0)
    p.heart += (72 - p.heart) * damp(0.22, realDt)
    // Sway in milliradians, a breathing figure-eight plus drift.
    const t = this.time
    const amp =
      1.25 *
      rifle.sway *
      (p.holdingActive ? 0.12 : 1) *
      (p.exhausted > 0 ? 2.3 : 1) *
      (1 + Math.max(0, p.heart - 72) / 70) *
      (p.cycle > 0 ? 1.35 : 1) *
      (p.health < 50 ? 1.4 : 1)
    const scopeWeight = 0.3 + 0.7 * p.scope
    p.swayX = ((Math.sin(t * 0.83) * 0.9 + noise1(t * 0.43, 1) * 0.6) * amp * scopeWeight) / 1000
    p.swayY = ((Math.sin(t * 1.66 + 0.6) * 0.55 + noise1(t * 0.37, 2) * 0.5) * amp * scopeWeight) / 1000
    // Recoil spring, sub-stepped so long frames cannot destabilize it.
    const springSteps = Math.max(1, Math.ceil(dt / (1 / 240)))
    const h = dt / springSteps
    for (let i = 0; i < springSteps; i += 1) {
      p.recoilPV += (-p.recoilP * 170 - p.recoilPV * 24) * h
      p.recoilP += p.recoilPV * h
      p.recoilYV += (-p.recoilY * 170 - p.recoilYV * 24) * h
      p.recoilY += p.recoilYV * h
    }
    // Mechanical timers.
    if (p.cycle > 0) {
      p.cycle -= dt
      if (p.cycle <= 0) {
        p.cycle = 0
        p.chambered = p.ammo > 0
        if (p.autoReload) {
          p.autoReload = false
          this.startReload()
        }
      }
    }
    if (p.reload > 0) {
      p.reload -= dt
      if (p.reload <= 0) {
        p.reload = 0
        const take = Math.min(rifle.magazine - p.ammo, p.reserve)
        p.ammo += take
        p.reserve -= take
        p.chambered = p.ammo > 0
      }
    }
    if (!p.dead && this.time - p.lastHurt > 4.5) p.health = Math.min(100, p.health + 24 * dt)
    this.damageFlash = Math.max(0, this.damageFlash - realDt * 1.6)
    for (const cue of this.damageCues) cue.age += realDt
    this.damageCues = this.damageCues.filter((cue) => cue.age < 2.2)
    Actor.thermal = p.thermal && p.scope > 0.85
  }

  private updateGlints(): void {
    const glints = this.session?.glints() ?? []
    const tan = Math.tan((this.camera.fov * DEG) / 2)
    this.glintSprites.forEach((sprite, index) => {
      const glint = glints[index]
      if (!glint || this.killCam) {
        sprite.visible = false
        return
      }
      const g = glint.position
      const blocked = this.world.collision.blocked(this.camera.position.x, this.camera.position.y, this.camera.position.z, g.x, g.y, g.z)
      sprite.visible = !blocked
      sprite.position.copy(g)
      const intensity = glint.intensity * (this.settings.reduceFlashing ? 0.6 : 1)
      sprite.scale.setScalar(Math.min(1.6, intensity) * (0.0032 + 0.03 * tan))
      sprite.material.opacity = Math.min(1, 0.4 + intensity * 0.6)
      sprite.material.rotation = this.time * 0.3
    })
  }

  private updateHints(realDt: number): void {
    if (this.hints.length === 0 && !this.currentHint) return
    this.hintTimer -= realDt
    if (this.hintTimer > 0) return
    if (this.currentHint) {
      this.currentHint = null
      this.hintTimer = 1.6
    } else {
      this.currentHint = this.hints.shift() ?? null
      this.hintTimer = 6
    }
  }

  private update(dt: number, realDt: number): void {
    this.updateWind(realDt)
    if (this.mode === 'menu' || !this.session) {
      this.updateMenuCamera(realDt)
    } else {
      this.updatePlayer(dt, realDt)
      this.addActors()
      this.session.update(dt, this.killCam ? 0 : realDt)
      this.updateBullets(dt)
      this.updateEnemyRounds(dt)
      this.updateKillCam(realDt)
      this.updateCamera(realDt)
      this.updateGlints()
      this.updateHints(realDt)
      if (this.deathCam && !this.player.dead) this.deathCam = null
    }
    this.fade = Math.max(0, this.fade - realDt * 0.9)
    this.flash = Math.max(0, this.flash - realDt * 6)
    this.hitAge += realDt
    this.camera.updateMatrixWorld()
    this.world.update(realDt, this.time, this.windVector, this.camera)
    this.effects.update(dt, this.time)
    this.effects.setView(this.height * this.renderer.getPixelRatio(), this.camera.fov, this.width * this.renderer.getPixelRatio())
    const p = this.player
    this.view.update(realDt, {
      scope: p.scope,
      duck: Math.max(p.duck, this.deathCam ? 1 : 0),
      lookX: this.lookVelocity.x * 0.016,
      lookY: this.lookVelocity.y * 0.016,
      time: this.time,
      breath: p.holdingActive ? 0.2 : 1,
    })
    this.audio.update(realDt)
    this.updateShadowFocus()
    this.hudTimer -= realDt
    if (this.hudTimer <= 0) {
      this.hudTimer = 0.075
      this.callbacks.onHud(this.hud())
    }
    this.drawOverlay(realDt)
  }

  private updateShadowFocus(): void {
    const camera = this.camera
    _forward.set(0, 0, -1).applyQuaternion(camera.quaternion)
    let distance: number
    if (this.killCam) {
      distance = 6
    } else if (this.mode === 'menu' || !this.session) {
      distance = 260
    } else {
      const hit = this.world.raycast(camera.position.x, camera.position.y, camera.position.z, _forward.x, _forward.y, _forward.z, 1400)
      distance = hit ? hit.t : 500
    }
    const focus = _w.copy(camera.position).addScaledVector(_forward, distance)
    const tan = Math.tan((camera.fov * DEG) / 2)
    const size = this.killCam ? 40 : clamp(distance * tan * 2 * camera.aspect * 1.35, 70, this.mode === 'menu' ? 520 : 380)
    this.world.setShadowFocus(focus, size)
    this.world.sun.shadow.normalBias = Math.max(0.03, (size / this.world.sun.shadow.mapSize.x) * 1.2)
  }

  private render(realDt: number): void {
    const u = this.post.uniforms
    const p = this.player
    const inSession = !!this.session && this.mode !== 'menu'
    const scope = inSession && !this.killCam && !this.deathCam ? THREE.MathUtils.smoothstep(p.scope, 0.55, 1) : 0
    u.uTime.value += realDt
    u.uScope.value = scope
    u.uScopeRadius.value = SCOPE_RADIUS
    const offset = u.uScopeOffset.value
    offset.x += (clamp(-this.lookVelocity.x * 0.00002, -0.03, 0.03) - offset.x) * damp(8, realDt)
    offset.y += (clamp(this.lookVelocity.y * 0.00002, -0.03, 0.03) - offset.y) * damp(8, realDt)
    u.uThermal.value = Actor.thermal ? 1 : 0
    u.uDamage.value = inSession ? Math.max(this.damageFlash * 0.8, p.dead ? 0.9 : clamp((60 - p.health) / 60, 0, 1) * 0.7) : 0
    u.uFlash.value = this.flash
    u.uBlur.value = this.killCam && this.killCam.phase === 'flight' ? 0.22 : 0
    u.uLetterbox.value = this.letterbox
    u.uFade.value = this.fade
    u.uMirage.value = scope > 0 && (this.preset.id === 'noon' || this.preset.id === 'day') ? 0.5 + p.zoom / 20 : 0
    u.uGrain.value = this.preset.night ? 0.05 : 0.028
    u.uVignette.value = inSession ? 0.34 : 0.42
    this.post.viewPass.enabled = inSession && this.view.visible && !this.killCam && !this.deathCam
    this.post.bloom.strength = this.preset.bloom * (Actor.thermal ? 0.4 : 1)
    this.post.render(realDt)
  }

  // -------------------------------------------------------------------------
  // HUD and overlay

  private markers(): Marker[] {
    const list: Marker[] = []
    if (!this.session) return list
    for (const actor of this.session.actors) {
      if (!actor.alive || actor.hidden) continue
      if (!this.tags.has(actor) && !this.session.autoTagged(actor)) continue
      actor.headPosition(_v)
      _v.y += 0.42
      const distance = _v.distanceTo(this.eye)
      _w.copy(_v).project(this.camera)
      const inFront = _w.z < 1
      const x = ((_w.x + 1) / 2) * this.width
      const y = ((1 - _w.y) / 2) * this.height
      const kind: MarkerKind = actor.kind === 'hvt' ? 'hvt' : actor.kind === 'civilian' ? 'civilian' : actor.kind === 'sniper' ? 'sniper' : 'hostile'
      const bearing = Math.atan2(_v.x - this.eye.x, -(_v.z - this.eye.z)) - this.player.yaw
      list.push({
        x,
        y,
        kind,
        label: actor.kind === 'hvt' ? 'Target' : actor.kind === 'sniper' ? 'Marksman' : actor.kind === 'civilian' ? 'Civ' : undefined,
        distance,
        onScreen: inFront && Math.abs(_w.x) <= 1.05 && Math.abs(_w.y) <= 1.05,
        angle: Math.atan2(-Math.cos(bearing) * 0.2, Math.sin(bearing)),
      })
    }
    return list
  }

  private drawOverlay(realDt: number): void {
    const p = this.player
    const inSession = !!this.session && this.mode !== 'menu'
    const hidden = !inSession || !!this.killCam || !!this.deathCam || p.dead
    const pxPerMil = (this.height / 2 / Math.tan((this.camera.fov * DEG) / 2)) * 0.001
    const rifle = this.loadout?.rifle
    this.assistTimer -= realDt
    if (inSession && rifle && this.settings.ballisticAssist && p.scope > 0.9 && this.assistTimer <= 0) {
      this.assistTimer = 0.08
      const probe = this.probe(1500)
      if (probe && probe.t > 25) {
        _right.set(1, 0, 0).applyQuaternion(this.camera.quaternion)
        _right.y = 0
        _right.normalize()
        const cross = this.windVector.dot(_right)
        const solution = holdover(rifle, this.zeroAngle(rifle, p.zero), probe.t, cross)
        this.assist = { x: solution.windage, y: solution.elevation }
      } else {
        this.assist = null
      }
    }
    let threat: OverlayFrame['threat'] = null
    const duel = this.session?.duelHud()
    if (duel && duel.enemyAiming && this.session?.kind === 'duel' && duel.difficulty === 'Recruit') {
      const enemy = this.session.actors[0]
      if (enemy && !enemy.hidden) {
        const bearing = Math.atan2(enemy.x - this.eye.x, -(enemy.z - this.eye.z)) - p.yaw
        threat = { angle: bearing - Math.PI / 2, strength: duel.lock }
      }
    }
    const frame: OverlayFrame = {
      width: this.width,
      height: this.height,
      scope: p.scope,
      radius: this.height * SCOPE_RADIUS,
      pxPerMil,
      reticle: this.loadout?.reticle ?? 'mildot',
      illuminated: this.preset.night || this.preset.id === 'dusk' || this.preset.id === 'dawn',
      thermal: Actor.thermal,
      assist: this.settings.ballisticAssist && this.assist ? { x: this.assist.x * pxPerMil, y: this.assist.y * pxPerMil } : null,
      markers: hidden ? [] : this.markers(),
      hitAge: this.hitAge,
      hitKind: this.hitKind,
      damage: this.damageCues.map((cue) => ({ angle: cue.bearing - p.yaw - Math.PI / 2, age: cue.age })),
      threat,
      spread: 1.4 * DEG * (this.height / 2 / Math.tan((this.camera.fov * DEG) / 2)),
      hidden,
      zoomLabel: `${p.zoom.toFixed(1)}×  ·  ZERO ${p.zero} M`,
      cycling: p.cycle > 0,
    }
    drawOverlay(this.overlayCtx, frame)
  }

  private hud(): HudState {
    const p = this.player
    const rifle = this.loadout?.rifle
    const session = this.session
    const relative = ((this.windFrom + 180) * DEG - p.yaw) / DEG
    return {
      mode: this.mode === 'loading' ? 'menu' : this.mode,
      live: !!session?.live,
      paused: this.paused,
      scoped: p.scope > 0.9,
      scope: p.scope,
      zoom: p.zoom,
      zoomMin: rifle?.zoom[0] ?? 4,
      zoomMax: rifle?.zoom[1] ?? 10,
      zero: p.zero,
      range: p.range,
      rangeFresh: this.time - p.rangeTime < 6,
      windSpeed: this.windSpeed,
      windFrom: ((this.windFrom % 360) + 360) % 360,
      windRelative: ((relative % 360) + 360) % 360,
      ammo: p.ammo,
      magazine: rifle?.magazine ?? 5,
      reserve: p.reserve,
      chambered: p.chambered,
      cycling: p.cycle > 0 ? 1 - p.cycle / p.cycleTotal : -1,
      reloading: p.reload > 0 ? 1 - p.reload / p.reloadTotal : -1,
      breath: p.breath,
      holding: p.holdingActive,
      exhausted: p.exhausted > 0,
      ducked: p.duck > 0.5,
      health: p.health,
      dead: p.dead,
      thermal: p.thermal,
      thermalAvailable: this.missionThermal,
      heading: ((p.yaw / DEG) % 360 + 360) % 360,
      pitch: p.pitch / DEG,
      assist: this.settings.ballisticAssist,
      killcam: !!this.killCam,
      hint: this.currentHint,
      pointerLocked: this.pointerLocked || this.fallbackLook || this.touchMode,
      rifleName: rifle?.name ?? '',
      rifleDesignation: rifle?.designation ?? '',
      caliber: rifle?.caliber ?? '',
      action: rifle?.action ?? 'bolt',
      mission: session?.missionHud() ?? null,
      duel: session?.duelHud() ?? null,
    }
  }
}
