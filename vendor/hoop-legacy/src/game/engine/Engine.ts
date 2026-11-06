import * as THREE from 'three'
import { Arena } from '../world/Arena'
import { Hoop, type BallLike } from '../world/Hoop'
import { COURT } from '../sim/court'
import { AudioEngine } from './audio'
import { Commentary } from './commentary'
import { CameraRig } from './CameraRig'
import { Effects } from './Effects'
import { InputManager } from './input'
import { detectQuality, isHandheld, qualityPreset, type QualityLevel, type QualitySetting, type QualitySettings } from './quality'
import { guardZoomGestures } from './mobile'
import { PostStack } from './post'
import { FloorReflection, LAYER_FLOOR, LAYER_REFLECT } from './reflection'
import { setCharacterQuality } from '../world/character/materials'
import { prewarmCharacterAssets } from '../world/character/assets'

export interface EngineMode {
  update(dt: number): void
  balls(): BallLike[]
  dispose(): void
}

export interface EngineOptions {
  quality: QualitySetting
  resolutionScale: number
  shake: boolean
}

export class Engine {
  renderer: THREE.WebGLRenderer
  scene = new THREE.Scene()
  camera: THREE.PerspectiveCamera
  rig: CameraRig
  arena: Arena
  hoop: Hoop
  farHoop: Hoop
  audio = new AudioEngine()
  /** Broadcast booth: play-by-play, analyst and PA announcer (speech + captions). */
  commentary = new Commentary(this.audio)
  input = new InputManager()
  effects = new Effects()
  quality: QualitySettings
  qualitySetting: QualitySetting
  mode: EngineMode | null = null
  paused = false
  timeScale = 1
  /** Gameplay camera preset (from settings). */
  cameraPreset: 'broadcast' | 'close' | 'high' = 'broadcast'
  private hitStopUntil = 0
  private hitStopScale = 1
  container: HTMLElement
  width = 1
  height = 1
  fps = 60
  /** Phones and tablets: frame-rate cap and finer dynamic resolution. */
  readonly handheld = isHandheld()
  readonly frameListeners = new Set<(dt: number) => void>()
  key: THREE.DirectionalLight
  shadowFocus = new THREE.Vector3(0, 0, 4)
  /** Mirrored floor pass (lacquered court reflections), sized and enabled per quality tier. */
  readonly reflection = new FloorReflection()
  private post: PostStack | null = null
  private timer = new THREE.Timer()
  private resolutionScale: number
  private perfAccum = 0
  private perfSamples: number[] = []
  private perfWarmup = 3
  /** consecutive on-pace perf windows, and seconds since the last slow one */
  private goodWindows = 0
  private calm = 0
  /** pixel ratio that last proved too heavy (dynamic resolution won't climb back past it for a while) */
  private prCeiling = Infinity
  private nextFrameAt = 0
  private ro: ResizeObserver
  private disposed = false

  constructor(container: HTMLElement, opts: EngineOptions) {
    this.container = container
    this.qualitySetting = opts.quality
    this.resolutionScale = opts.resolutionScale
    const level: QualityLevel = opts.quality === 'auto' ? detectQuality() : opts.quality
    this.quality = qualityPreset(level, opts.resolutionScale)
    setCharacterQuality(level)

    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance', alpha: false, stencil: false })
    this.renderer.setPixelRatio(this.quality.pixelRatio)
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.05
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
    this.renderer.shadowMap.enabled = this.quality.shadows
    this.renderer.shadowMap.type = THREE.PCFShadowMap
    this.renderer.domElement.style.display = 'block'
    this.renderer.domElement.style.width = '100%'
    this.renderer.domElement.style.height = '100%'
    this.renderer.domElement.style.touchAction = 'none'
    container.appendChild(this.renderer.domElement)

    this.camera = new THREE.PerspectiveCamera(42, 1, 0.3, 160)
    // the gameplay camera sees the floor layer and everything flagged for the lite reflection
    this.camera.layers.enable(LAYER_FLOOR)
    this.camera.layers.enable(LAYER_REFLECT)
    this.rig = new CameraRig(this.camera)
    this.rig.shakeEnabled = opts.shake
    this.scene.background = new THREE.Color(0x05060a)
    this.scene.fog = new THREE.Fog(0x05060a, 38, 95)

    this.key = this.setupLights()
    this.setupEnvironment()

    const aniso = Math.min(8, this.renderer.capabilities.getMaxAnisotropy())
    this.arena = new Arena(this.quality, aniso)
    this.scene.add(this.arena.group)
    this.hoop = new Hoop(1, 0, true)
    this.hoop.addTo(this.scene)
    this.farHoop = new Hoop(-1, COURT.farHoopZ, false)
    this.farHoop.addTo(this.scene)
    this.scene.add(this.effects.group)
    // the lite (medium) reflection shows the playable hoop and effects; the far hoop is rarely mirrored
    // from the gameplay cameras and would cost ~15 extra draw calls on phones
    for (const root of [this.hoop.group, this.hoop.net.line, this.effects.group]) root.traverse((o) => o.layers.enable(LAYER_REFLECT))

    this.input.attach()
    guardZoomGestures()
    this.timer.connect(document)
    this.ro = new ResizeObserver(() => this.resize())
    this.ro.observe(container)
    this.resize()
    this.applyPost()
    this.renderer.setAnimationLoop(this.frame)
    prewarmCharacterAssets()
  }

  private setupLights() {
    const hemi = new THREE.HemisphereLight(0xd8e2ff, 0x4a3422, 0.85)
    this.scene.add(hemi)
    const key = new THREE.DirectionalLight(0xfff1e0, 2.15)
    key.position.set(4, 22, 12)
    key.castShadow = true
    key.shadow.mapSize.set(this.quality.shadowMapSize, this.quality.shadowMapSize)
    const cam = key.shadow.camera
    cam.left = -11
    cam.right = 11
    cam.top = 11
    cam.bottom = -11
    cam.near = 4
    cam.far = 50
    key.shadow.bias = -0.0004
    key.shadow.normalBias = 0.025
    key.shadow.radius = 3
    this.scene.add(key)
    this.scene.add(key.target)
    const fill = new THREE.DirectionalLight(0xbcd0ff, 0.55)
    fill.position.set(-10, 12, -8)
    this.scene.add(fill)
    const rim = new THREE.DirectionalLight(0xffd2a8, 0.6)
    rim.position.set(6, 8, -16)
    this.scene.add(rim)
    // lights must reach every camera layer, including the lite mirrored floor pass
    for (const l of [hemi, key, fill, rim]) l.layers.enableAll()
    return key
  }

  /** Arena-like environment map: bright ceiling panels + colored ribbons for floor gloss. */
  private setupEnvironment() {
    const env = new THREE.Scene()
    env.background = new THREE.Color(0x07080c)
    const room = new THREE.Mesh(new THREE.BoxGeometry(70, 34, 70), new THREE.MeshBasicMaterial({ color: 0x0c0e14, side: THREE.BackSide }))
    room.position.y = 10
    env.add(room)
    const panel = new THREE.MeshBasicMaterial({ color: new THREE.Color(1, 0.96, 0.88).multiplyScalar(9) })
    for (let x = -12; x <= 12; x += 6) {
      for (let z = -16; z <= 16; z += 6) {
        const p = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 2.2), panel)
        p.rotation.x = Math.PI / 2
        p.position.set(x, 22, z)
        env.add(p)
      }
    }
    const ribbon = (color: string, y: number) => {
      const m = new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(2.2) })
      for (let i = 0; i < 4; i++) {
        const r = new THREE.Mesh(new THREE.PlaneGeometry(60, 1.2), m)
        const a = (i * Math.PI) / 2
        r.position.set(Math.sin(a) * 30, y, Math.cos(a) * 30)
        r.rotation.y = a + Math.PI
        env.add(r)
      }
    }
    ribbon('#ff6a1f', 3)
    ribbon('#2a6cff', 9)
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.MeshBasicMaterial({ color: new THREE.Color('#b07a4a').multiplyScalar(0.35) }))
    floor.rotation.x = -Math.PI / 2
    floor.position.y = -6
    env.add(floor)
    const pmrem = new THREE.PMREMGenerator(this.renderer)
    const rt = pmrem.fromScene(env, 0.035)
    this.scene.environment = rt.texture
    this.scene.environmentIntensity = 0.72
    pmrem.dispose()
  }

  /** (Re)builds the post stack and floor reflection for the current tier. */
  private applyPost() {
    const q = this.quality
    const want = q.post ? { bloom: q.bloom, ao: q.ao, samples: 4 } : null
    const cur = this.post?.options
    if (!want || !cur || cur.bloom !== want.bloom || cur.ao !== want.ao || cur.samples !== want.samples) {
      this.post?.dispose()
      this.post = want ? new PostStack(this.renderer, this.scene, this.camera, want, this.width, this.height) : null
    }
    this.reflection.setMode(q.reflections)
  }

  /** Renders one frame through the current pipeline (mirrored floor pass, then post or direct). */
  renderNow(dt = 0) {
    if (this.reflection.active) this.reflection.render(this.renderer, this.scene, this.camera)
    if (this.post) this.post.render(dt)
    else this.renderer.render(this.scene, this.camera)
  }

  setQuality(setting: QualitySetting, resolutionScale = this.resolutionScale) {
    this.qualitySetting = setting
    this.resolutionScale = resolutionScale
    const level: QualityLevel = setting === 'auto' ? detectQuality() : setting
    this.applyLevel(level)
    this.perfWarmup = 3
    this.perfSamples.length = 0
    this.perfAccum = 0
    this.goodWindows = 0
    this.prCeiling = Infinity
  }

  private applyLevel(level: QualityLevel) {
    const prevShadows = this.quality.shadows
    this.quality = { ...qualityPreset(level, this.resolutionScale), crowdDensity: this.quality.crowdDensity, clearcoat: this.quality.clearcoat }
    setCharacterQuality(level)
    this.renderer.setPixelRatio(this.quality.pixelRatio)
    this.renderer.shadowMap.enabled = this.quality.shadows
    if (prevShadows !== this.quality.shadows) {
      this.scene.traverse((o) => {
        const m = (o as THREE.Mesh).material
        if (Array.isArray(m)) m.forEach((x) => (x.needsUpdate = true))
        else if (m) (m as THREE.Material).needsUpdate = true
      })
    }
    if (this.key.shadow.mapSize.x !== this.quality.shadowMapSize) {
      this.key.shadow.mapSize.set(this.quality.shadowMapSize, this.quality.shadowMapSize)
      this.key.shadow.map?.dispose()
      this.key.shadow.map = null
    }
    this.applyPost()
    this.resize()
  }

  setShake(v: boolean) {
    this.rig.shakeEnabled = v
  }

  /**
   * Hit-stop: the simulation runs at `scale` for `seconds` of real time, so a slam or a block lands with
   * weight. Newer, stronger stops win; the camera and HUD keep running at full rate.
   */
  hitStop(seconds = 0.07, scale = 0.15) {
    const until = performance.now() + seconds * 1000
    if (until > this.hitStopUntil) {
      this.hitStopUntil = until
      this.hitStopScale = scale
    }
  }

  /**
   * Frame-rate cap (0 = display rate). Handhelds hold games at a steady 60 even on 90/120 Hz panels and
   * drop idle menus to 30, which saves a lot of battery and heat for no visible loss.
   */
  frameCap() {
    if (!this.handheld) return 0
    return this.input.gameActive ? 60 : 30
  }

  private setRenderScale(pixelRatio: number) {
    this.renderer.setPixelRatio(pixelRatio)
    this.resize()
  }

  /** Fits the renderer, post stack and reflection to the container (or to an explicit size). */
  resize(width?: number, height?: number) {
    const w = Math.max(1, width ?? this.container.clientWidth)
    const h = Math.max(1, height ?? this.container.clientHeight)
    this.width = w
    this.height = h
    this.renderer.setSize(w, h, false)
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
    this.hoop.setResolution(w, h)
    this.farHoop.setResolution(w, h)
    const pr = this.renderer.getPixelRatio()
    this.post?.setSize(w, h, pr)
    this.reflection.setSize(w, h, pr)
  }

  get aspect() {
    return this.width / this.height
  }

  setMode(mode: EngineMode | null) {
    this.mode?.dispose()
    this.mode = mode
    this.timeScale = 1
    this.paused = false
  }

  private v3 = new THREE.Vector3()
  /** World → container CSS pixels. */
  project(p: THREE.Vector3, out: { x: number; y: number; visible: boolean }) {
    this.v3.copy(p).project(this.camera)
    out.x = (this.v3.x * 0.5 + 0.5) * this.width
    out.y = (-this.v3.y * 0.5 + 0.5) * this.height
    out.visible = this.v3.z < 1 && this.v3.z > -1
    return out
  }

  private frame = () => {
    if (this.disposed) return
    const cap = this.frameCap()
    if (cap > 0) {
      // render on a fixed schedule; 2 ms of slack absorbs vsync jitter
      const now = performance.now()
      const interval = 1000 / cap
      if (now + 2 < this.nextFrameAt) return
      if (now - this.nextFrameAt > interval) this.nextFrameAt = now
      this.nextFrameAt += interval
    }
    this.timer.update()
    const raw = Math.min(Math.max(this.timer.getDelta(), 0), 0.1)
    const dt = Math.min(raw, 1 / 20)
    this.input.update()
    if (!this.paused) {
      const sdt = dt * this.timeScale * (performance.now() < this.hitStopUntil ? this.hitStopScale : 1)
      this.mode?.update(sdt)
      this.arena.update(sdt)
      const balls = this.mode?.balls() ?? []
      this.hoop.update(sdt, balls)
      this.effects.update(sdt)
    }
    this.rig.update(dt)
    // keep the shadow frustum centered on the action
    this.key.position.set(this.shadowFocus.x + 4, 22, this.shadowFocus.z + 12)
    this.key.target.position.copy(this.shadowFocus)
    this.key.target.updateMatrixWorld()
    for (const l of this.frameListeners) l(dt)
    this.renderNow(dt)
    this.trackPerf(raw)
  }

  private trackPerf(dt: number) {
    if (dt <= 0) return
    this.fps += (1 / dt - this.fps) * 0.05
    if (this.qualitySetting !== 'auto') return
    if (this.perfWarmup > 0) {
      this.perfWarmup -= dt
      return
    }
    this.perfSamples.push(dt)
    this.perfAccum += dt
    if (this.perfAccum < 2) return
    // 70th-percentile frame time over ~2 s tracks sustained load, not one-off hitches (asset builds, GC)
    const samples = this.perfSamples.sort((a, b) => a - b)
    const p70 = samples[Math.floor(samples.length * 0.7)]
    const span = this.perfAccum
    this.perfSamples.length = 0
    this.perfAccum = 0
    const target = 1 / (this.frameCap() || 60)
    const full = this.quality.pixelRatio
    const pr = this.renderer.getPixelRatio()
    if (p70 > target * 1.22) {
      // falling behind: shave resolution first, then drop a quality tier
      this.goodWindows = 0
      this.calm = 0
      this.prCeiling = pr
      const floor = Math.max(0.6, full * 0.62)
      if (pr > floor + 0.01) this.setRenderScale(Math.max(floor, pr * 0.86))
      else if (this.quality.level === 'high') this.applyLevel('medium')
      else if (this.quality.level === 'medium') this.applyLevel('low')
      this.perfWarmup = 1
    } else if (p70 < target * 1.06) {
      // on pace: creep back toward full resolution, not past what recently proved too heavy
      this.goodWindows++
      this.calm += span
      if (this.calm > 30) this.prCeiling = Infinity
      const limit = Math.min(full, this.prCeiling * 0.94)
      if (this.goodWindows >= 3 && pr < limit - 0.01) {
        this.goodWindows = 0
        this.setRenderScale(Math.min(limit, pr * 1.07))
        this.perfWarmup = 1
      }
    } else {
      this.goodWindows = 0
    }
  }

  dispose() {
    this.disposed = true
    this.renderer.setAnimationLoop(null)
    this.commentary.stop()
    this.mode?.dispose()
    this.ro.disconnect()
    this.input.detach()
    this.timer.dispose()
    this.post?.dispose()
    this.reflection.dispose()
    this.renderer.dispose()
    this.renderer.domElement.remove()
  }
}
