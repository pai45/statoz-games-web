// Longbow renderer. Draws the engine state; it never changes it.
import * as T from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {BACKSTOP, TARGET_HEIGHT, arrowsThisEnd, drawAmount, endOf, sightPoint, targetCentre, type Game} from './engine';
import {TARGET_RADIUS, type Motion, type TargetSize} from './levels';
import {arrowMesh, recolour} from './render/arrows';
import {FirstPersonBow} from './render/bow';
import {LOOKS, PALETTE, disposeObject, ease, hash, v, type GroundName} from './render/common';
import {PostPipeline, VignetteOverlay} from './render/post';
import {FrameBudget, TIER_SETTINGS, forcedTier, pickTier, type Tier} from './render/quality';
import {MODEL_NAMES, Scenery} from './render/scenery';
import {SkyDome} from './render/sky';
import {TargetRig} from './render/target';
import {blobGeometry, blobMaterial, blobTexture, labelTexture} from './render/textures';

type Stuck = {mesh: T.Group; born: number; tilt: T.Euler};

export class LongbowView {
  renderer: T.WebGLRenderer;
  scene = new T.Scene();
  // The bow has its own pass, so the world camera's near plane can sit at 12 cm for better depth precision at range.
  camera = new T.PerspectiveCamera(30, 16 / 9, 0.12, 900);
  private observer: ResizeObserver;
  private disposed = false;
  private tier: Tier;
  private budget = new FrameBudget();
  private lastFrameAt = 0;
  private sky = new SkyDome();
  private environment: T.WebGLRenderTarget | null = null;
  private post: PostPipeline | null = null;
  private vignette = new VignetteOverlay();
  private hemi: T.HemisphereLight;
  private sun: T.DirectionalLight;
  private ground!: T.Mesh;
  private lane!: T.Mesh;
  private berm!: T.Mesh;
  private textures: Partial<Record<GroundName | `${GroundName}-n`, T.Texture>> = {};
  private blobTexture = blobTexture();
  private blobMaterial: T.MeshBasicMaterial;
  private scenery: Scenery;
  private target: TargetRig;
  private bow = new FirstPersonBow();
  private marker: T.Mesh;
  private flags: {pole: T.Group; cloth: T.Mesh; base: Float32Array}[] = [];
  private flightArrow: T.Group;
  private trail: T.Line;
  private trailPoints: T.Vector3[] = [];
  private stuck: Stuck[] = [];
  private ground_: Stuck[] = [];
  private range = -1;
  private laneDistance = -1;
  private targetSize = '';
  private motionKind = '';
  private lastEnd = -1;
  private lastCheckpoint = -1;
  private trauma = 0;
  private clock = 0;
  private eye = v(0, 1.6, 0);
  private look = v(0, 1.3, -30);
  private fov = 30;
  /** Depth-of-field focus distance (m) and strength (0–1), eased towards each shot's framing. */
  private focus = 30;
  private blur = 0;
  private impactFrom: {eye: T.Vector3; look: T.Vector3; fov: number} | null = null;
  private lastPhase = '';
  private lastFlight: {pos: T.Vector3; dir: T.Vector3} | null = null;
  private current: Game | null = null;

  constructor(private canvas: HTMLCanvasElement) {
    this.tier = pickTier();
    const settings = TIER_SETTINGS[this.tier];
    this.renderer = new T.WebGLRenderer({canvas, antialias: true, powerPreference: 'high-performance'});
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, settings.pixelRatio));
    this.renderer.outputColorSpace = T.SRGBColorSpace;
    this.renderer.toneMapping = T.ACESFilmicToneMapping;
    this.renderer.shadowMap.enabled = settings.shadows; this.renderer.shadowMap.type = T.PCFShadowMap;
    this.renderer.autoClear = false;
    this.renderer.info.autoReset = false;

    this.scene.add(this.sky.mesh);
    this.hemi = new T.HemisphereLight('#ffffff', '#55663a', 0.6); this.scene.add(this.hemi);
    this.sun = new T.DirectionalLight('#fff1d6', 3); this.sun.castShadow = settings.shadows;
    this.sun.shadow.mapSize.set(settings.shadowMap, settings.shadowMap);
    this.sun.shadow.bias = -0.0004; this.sun.shadow.normalBias = 0.04; this.sun.shadow.radius = 3;
    this.scene.add(this.sun, this.sun.target);
    this.blobMaterial = blobMaterial(this.blobTexture, settings.blobOpacity);
    this.scenery = new Scenery(settings.shadows, this.blobMaterial);
    this.target = new TargetRig(this.blobMaterial);
    this.scene.add(this.scenery.group, this.target.root);

    // Distance marker beside the lane and two wind flags (archer and target end).
    this.marker = new T.Mesh(new T.PlaneGeometry(0.9, 0.45), new T.MeshStandardMaterial({map: labelTexture('30 m'), roughness: 0.9}));
    this.scene.add(this.marker);
    for (let i = 0; i < 2; i++) {
      const pole = new T.Group(), d = v(0, 4.2, 0), length = d.length();
      const stick = new T.Mesh(new T.CylinderGeometry(0.035, 0.035, 1, 8), new T.MeshStandardMaterial({color: '#e9e2cf'}));
      stick.position.copy(d).multiplyScalar(0.5); stick.scale.y = length; stick.castShadow = true; pole.add(stick);
      const shadow = new T.Mesh(blobGeometry(), this.blobMaterial); shadow.position.y = 0.02; shadow.scale.setScalar(0.3); shadow.renderOrder = 1; pole.add(shadow);
      const geometry = new T.PlaneGeometry(1.2, 0.7, 12, 4); geometry.translate(0.6, 3.75, 0);
      const cloth = new T.Mesh(geometry, new T.MeshStandardMaterial({color: i ? '#c8452d' : '#e2a72e', side: T.DoubleSide, roughness: 0.9}));
      cloth.castShadow = true; pole.add(cloth); this.scene.add(pole);
      this.flags.push({pole, cloth, base: Float32Array.from(geometry.attributes.position.array as Float32Array)});
    }

    this.flightArrow = arrowMesh(PALETTE.player); this.flightArrow.visible = false; this.scene.add(this.flightArrow);
    const trailGeometry = new T.BufferGeometry().setFromPoints(Array.from({length: 24}, () => v()));
    this.trail = new T.Line(trailGeometry, new T.LineBasicMaterial({color: '#fff7dc', transparent: true, opacity: 0.55}));
    this.trail.frustumCulled = false; this.scene.add(this.trail);

    if (settings.post) this.post = new PostPipeline(this.renderer, this.scene, this.camera, this.bow.scene, this.bow.camera);
    this.observer = new ResizeObserver(() => this.resize()); this.observer.observe(canvas); this.resize();
  }

  private resize() {
    const {width, height} = this.canvas.getBoundingClientRect(); if (!width || !height) return;
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height; this.camera.updateProjectionMatrix(); this.bow.setAspect(width / height);
    this.post?.setSize(width, height, this.renderer.getPixelRatio());
  }

  /** Steps down to the low tier for the rest of the session: no post-processing, fewer pixels. */
  private setTier(tier: Tier) {
    if (tier === this.tier) return;
    this.tier = tier;
    const settings = TIER_SETTINGS[tier];
    this.post?.dispose(); this.post = null;
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, settings.pixelRatio));
    this.sun.shadow.mapSize.set(settings.shadowMap, settings.shadowMap); this.sun.shadow.map?.dispose(); this.sun.shadow.map = null;
    this.resize();
  }

  async loadAssets(base: string) {
    const loader = new GLTFLoader(), textures = new T.TextureLoader();
    const grounds = ['meadow-grass', 'forest-floor', 'canyon-sand'] as const;
    const [gltfs, maps] = await Promise.all([
      Promise.all(MODEL_NAMES.map(n => loader.loadAsync(`${base}models/${n}.glb`))),
      Promise.all(grounds.flatMap(g => [textures.loadAsync(`${base}textures/${g}-color.jpg`), textures.loadAsync(`${base}textures/${g}-normal.jpg`)])),
    ]);
    if (this.disposed) return;
    grounds.forEach((g, i) => {
      const color = maps[i * 2], normal = maps[i * 2 + 1];
      for (const t of [color, normal]) {t.wrapS = t.wrapT = T.RepeatWrapping; t.anisotropy = 4;}
      color.colorSpace = T.SRGBColorSpace;
      this.textures[g] = color; this.textures[`${g}-n`] = normal;
    });
    this.scenery.setModels(gltfs);
    const groundGeometry = new T.PlaneGeometry(700, 700); groundGeometry.rotateX(-Math.PI / 2);
    this.ground = new T.Mesh(groundGeometry, new T.MeshStandardMaterial({roughness: 1})); this.ground.receiveShadow = true;
    const laneGeometry = new T.PlaneGeometry(4.5, 1); laneGeometry.rotateX(-Math.PI / 2);
    this.lane = new T.Mesh(laneGeometry, new T.MeshStandardMaterial({roughness: 1, transparent: true, opacity: 0.55})); this.lane.receiveShadow = true;
    // An earth bank behind the target: the top half of a squashed sphere.
    this.berm = new T.Mesh(new T.SphereGeometry(1, 40, 10, 0, Math.PI * 2, 0, Math.PI / 2), new T.MeshStandardMaterial({roughness: 1}));
    this.berm.scale.set(26, 3.2, 4); this.berm.receiveShadow = true;
    this.scene.add(this.ground, this.lane, this.berm);
    this.setRange(0);
  }

  /** Swaps sky, light, ground and scenery for one of the three ranges. */
  setRange(range: number) {
    if (range === this.range || !this.ground) return;
    this.range = range;
    const look = LOOKS[range];
    this.sky.setLook(look);
    this.environment?.dispose(); this.environment = this.sky.bakeEnvironment(this.renderer);
    this.scene.environment = this.environment.texture; this.scene.environmentIntensity = look.environment;
    this.bow.setEnvironment(this.environment.texture, look.environment);
    this.scene.fog = new T.FogExp2(look.fog.colour, look.fog.density);
    this.hemi.color.set(look.hemi.sky); this.hemi.groundColor.set(look.hemi.ground); this.hemi.intensity = look.hemi.intensity;
    this.sun.color.set(look.sun.colour); this.sun.intensity = look.sun.intensity;
    this.renderer.toneMappingExposure = look.exposure;
    this.post?.setLook(look);
    const ground = this.ground.material as T.MeshStandardMaterial, color = this.textures[look.ground]!.clone(), normal = this.textures[`${look.ground}-n`]!.clone();
    color.repeat.set(140, 140); normal.repeat.set(140, 140);
    ground.map?.dispose(); ground.normalMap?.dispose();
    ground.map = color; ground.normalMap = normal; ground.color.set(look.tint); ground.needsUpdate = true;
    const lane = this.lane.material as T.MeshStandardMaterial;
    // Brighter than the field around it, like a freshly mown strip.
    lane.map?.dispose(); lane.map = this.textures[look.ground]!.clone(); lane.color.set(look.lane).multiplyScalar(1.3); lane.needsUpdate = true;
    const berm = this.berm.material as T.MeshStandardMaterial, bermMap = this.textures[look.ground]!.clone(); bermMap.repeat.set(10, 3);
    berm.map?.dispose(); berm.map = bermMap; berm.color.set(look.tint).multiplyScalar(0.85); berm.needsUpdate = true;
    this.scenery.build(range);
    this.laneDistance = -1;
    this.budget.reset();
  }

  /** Moves the target, lane, marker, flags and shadow area to a new lane distance and target style. */
  private layoutLane(d: number, kind: Motion['kind'], size: TargetSize) {
    if (!this.lane || (d === this.laneDistance && kind === this.motionKind && size === this.targetSize)) return;
    this.laneDistance = d; this.motionKind = kind; this.targetSize = size;
    this.target.root.position.set(0, 0, -d);
    this.target.layout(kind, TARGET_RADIUS[size]);
    this.lane.scale.z = d + 4; this.lane.position.set(0, 0.01, -d / 2);
    // Line the lane's grass up with the ground's (one tile per 5 m), so only the tint changes.
    const laneMap = (this.lane.material as T.MeshStandardMaterial).map;
    if (laneMap) {laneMap.repeat.set(4.5 / 5, (d + 4) / 5); laneMap.offset.set(((350 - 2.25) / 5) % 1, ((350 - 2) / 5) % 1);}
    this.berm.position.set(0, 0, -d - BACKSTOP - 2);
    const marker = this.marker.material as T.MeshStandardMaterial; marker.map?.dispose(); marker.map = labelTexture(`${d} m`);
    this.marker.position.set(-3.4, 0.9, -d + 1.5); this.marker.rotation.y = 0.35;
    this.flags[0].pole.position.set(3.2, 0, -4); this.flags[1].pole.position.set(-3.6, 0, -d - 1.5);
    this.fitShadow(d);
  }

  /** Points the sun at the lane and fits its shadow map around everything from the archer to the backstop. */
  private fitShadow(d: number) {
    const centre = v(0, 0, (6 - d - BACKSTOP) / 2);
    this.sun.position.copy(centre).addScaledVector(this.sky.sunDir, 150); this.sun.target.position.copy(centre);
    this.sun.updateMatrixWorld(); this.sun.target.updateMatrixWorld();
    const cam = this.sun.shadow.camera; cam.position.copy(this.sun.position); cam.lookAt(centre); cam.updateMatrixWorld();
    const box = new T.Box3(), corner = v();
    for (const x of [-13, 13]) for (const y of [0, 6]) for (const z of [6, -d - BACKSTOP]) box.expandByPoint(corner.set(x, y, z).applyMatrix4(cam.matrixWorldInverse));
    cam.left = box.min.x; cam.right = box.max.x; cam.bottom = box.min.y; cam.top = box.max.y;
    // Reach 40 m further towards the sun so tall trees beside the field still cast into it.
    cam.near = Math.max(1, -box.max.z - 40); cam.far = -box.min.z + 10;
    cam.updateProjectionMatrix();
  }

  /** Metres on the target plane covered by one CSS pixel at the current zoom. */
  metresPerPixel(distance: number) {
    const height = this.canvas.getBoundingClientRect().height || 1;
    return 2 * distance * Math.tan(T.MathUtils.degToRad(this.camera.fov) / 2) / height;
  }

  private clearArrows() {
    for (const s of [...this.stuck, ...this.ground_]) {s.mesh.removeFromParent(); disposeObject(s.mesh);}
    this.stuck = []; this.ground_ = [];
  }
  private syncArrows(game: Game) {
    const end = endOf(game, game.phase === 'impact' ? game.arrowIndex - 1 : game.arrowIndex);
    if (end !== this.lastEnd || game.checkpoint < this.lastCheckpoint) {this.clearArrows(); this.lastEnd = end;}
    this.lastCheckpoint = game.checkpoint;
    const inTarget = arrowsThisEnd(game), face = this.target.face;
    while (this.stuck.length < inTarget.length) {
      const r = inTarget[this.stuck.length], mesh = arrowMesh(r.shooter === 'player' ? PALETTE.player : PALETTE.rival);
      const tilt = new T.Euler(-0.05 + hash(this.stuck.length, 3) * 0.1, -0.06 + hash(this.stuck.length, 5) * 0.12, 0);
      const s = 1 / face.scale.x; mesh.scale.setScalar(s);
      mesh.position.set(r.px * s, r.py * s, 0.02 - 0.18 * s); mesh.rotation.copy(tilt);
      face.add(mesh); this.stuck.push({mesh, born: this.clock, tilt});
    }
  }

  draw(game: Game | null, dt: number, reduced: boolean, menuRange = 0) {
    this.clock += dt;
    // Judge speed by wall-clock time between frames: `dt` can be a large manual step in tests.
    const now = performance.now(), interval = this.lastFrameAt ? Math.min(0.1, (now - this.lastFrameAt) / 1000) : 0;
    this.lastFrameAt = now;
    if (this.post && !forcedTier() && this.budget.over(interval)) this.setTier('low');
    if (game !== this.current) {this.current = game; this.clearArrows(); this.lastEnd = -1; this.lastCheckpoint = -1; this.trailPoints = []; this.lastPhase = '';}
    if (game) {
      this.setRange(game.config.mode === 'career' ? game.config.level.range : ['wren', 'tamsin', 'odette'].indexOf(game.config.opponent.id));
      this.layoutLane(game.distance, game.motion.kind, game.config.mode === 'career' ? game.config.level.target : 'standard');
      this.syncArrows(game);
    } else {
      this.setRange(menuRange);
      this.layoutLane(30, 'none', 'standard');
    }
    const distance = game?.distance ?? 30, time = game?.time ?? this.clock;
    // Target motion.
    const centre = game ? targetCentre(game, time) : {x: 0, y: TARGET_HEIGHT};
    this.target.pose(game, centre);
    // Stuck arrows quiver briefly.
    for (const s of this.stuck) {const age = this.clock - s.born, q = reduced ? 0 : Math.exp(-age * 9) * Math.sin(age * 70) * 0.06; s.mesh.rotation.set(s.tilt.x + q, s.tilt.y + q * 0.6, 0);}
    // Flags stream with the wind.
    const wind = game?.wind ?? {x: 2, z: 0.5, speed: 2.1};
    for (const flag of this.flags) {
      flag.pole.rotation.y = Math.atan2(-wind.z, wind.x);
      const position = flag.cloth.geometry.attributes.position as T.BufferAttribute, droop = 1 - Math.min(1, wind.speed / 8);
      for (let i = 0; i < position.count; i++) {
        const bx = flag.base[i * 3], by = flag.base[i * 3 + 1], k = bx / 1.2;
        const wave = reduced ? 0 : Math.sin(this.clock * (4 + wind.speed) - bx * 5) * 0.08 * k * (0.3 + wind.speed / 8);
        position.setXYZ(i, bx * (1 - droop * 0.55), by - droop * k * 0.55, wave);
      }
      position.needsUpdate = true;
    }

    // Flight arrow and trail.
    const flight = game?.flight, flying = !!game && game.phase === 'flight' && !!flight;
    this.flightArrow.visible = flying;
    if (flying) {
      const pos = v(flight!.pos.x, flight!.pos.y, flight!.pos.z), dir = v(flight!.vel.x, flight!.vel.y, flight!.vel.z).normalize();
      this.flightArrow.position.copy(pos); this.flightArrow.quaternion.setFromUnitVectors(v(0, 0, -1), dir);
      recolour(this.flightArrow, flight!.shooter === 'player' ? PALETTE.player : PALETTE.rival);
      this.lastFlight = {pos, dir};
      this.trailPoints.unshift(pos.clone()); this.trailPoints.length = Math.min(this.trailPoints.length, 24);
    } else if (this.lastPhase === 'flight' && game?.phase === 'impact' && game.last?.miss && this.lastFlight) {
      // Missed arrows stay where they landed until the end is collected.
      const mesh = arrowMesh(game.last.shooter === 'player' ? PALETTE.player : PALETTE.rival);
      mesh.position.copy(this.lastFlight.pos); mesh.quaternion.setFromUnitVectors(v(0, 0, -1), this.lastFlight.dir);
      if (mesh.position.y < 0.05) mesh.position.y = 0.02;
      this.scene.add(mesh); this.ground_.push({mesh, born: this.clock, tilt: new T.Euler()});
    }
    if (!flying) this.trailPoints.length = Math.max(0, this.trailPoints.length - 2);
    const trail = this.trail.geometry.attributes.position as T.BufferAttribute;
    for (let i = 0; i < 24; i++) {const p = this.trailPoints[Math.min(i, this.trailPoints.length - 1)] ?? v(0, -10, 0); trail.setXYZ(i, p.x, p.y, p.z);}
    trail.needsUpdate = true; this.trail.visible = this.trailPoints.length > 1 && !reduced;

    // Impact flash on the ring that was hit.
    if (game && this.lastPhase === 'flight' && game.phase === 'impact' && game.last && !game.last.miss) {
      this.target.hit(game.last.score);
      if (game.last.shooter === 'player' && !reduced) this.trauma = Math.min(1, this.trauma + (game.last.score >= 10 ? 0.55 : 0.3));
    }
    this.target.update(dt, reduced);

    this.updateCamera(game, centre, distance, dt, reduced);
    this.bow.update(game, dt);
    this.sky.update(dt, this.camera, wind, reduced);
    this.lastPhase = game?.phase ?? '';

    this.renderer.info.reset();
    if (this.post) this.post.render(dt, this.bow.visible, this.focus, this.blur);
    else {
      this.renderer.setRenderTarget(null); this.renderer.clear();
      this.renderer.render(this.scene, this.camera);
      if (this.bow.visible) {this.renderer.clearDepth(); this.renderer.render(this.bow.scene, this.bow.camera);}
      this.vignette.render(this.renderer);
    }
  }

  private updateCamera(game: Game | null, centre: {x: number; y: number}, distance: number, dt: number, reduced: boolean) {
    const aimFov = (d: number, zoom: number) => T.MathUtils.lerp(32, T.MathUtils.radToDeg(2 * Math.atan(2.6 / d)), ease(Math.min(1, zoom)));
    let eye = v(0, 1.62, 0.15), look: T.Vector3, fov: number;
    // Depth of field: what the shot is about, and how strongly everything else softens.
    let focus = distance, blur = 0;
    const phase = game?.phase;
    if (!game) {
      const a = this.clock * 0.06;
      eye = v(Math.sin(a) * 7 + 4, 2.6, 6 + Math.cos(a) * 2); look = v(0, 1.4, -26); fov = 42;
    } else if (phase === 'finished') {
      eye = v(2.5, 2.4, 5); look = v(0, 1.3, -distance * 0.7); fov = 38;
    } else if (phase === 'impact' && !reduced) {
      if (!this.impactFrom || this.lastPhase !== 'impact') this.impactFrom = {eye: this.eye.clone(), look: this.look.clone(), fov: this.fov};
      const k = ease(Math.min(1, game.age / 0.35));
      const close = v(centre.x + 0.35, centre.y + 0.15, -distance + 3.4), at = v(centre.x, centre.y, -distance);
      eye = this.impactFrom.eye.clone().lerp(close, k); look = this.impactFrom.look.clone().lerp(at, k); fov = T.MathUtils.lerp(this.impactFrom.fov, 32, k);
      focus = eye.distanceTo(at); blur = 0.9 * k;
    } else if (phase === 'flight' && game.cinematic && !reduced && this.lastFlight) {
      const {pos, dir} = this.lastFlight;
      eye = pos.clone().addScaledVector(dir, -1.4).add(v(0.25, 0.22, 0)); look = pos.clone().addScaledVector(dir, 5); fov = 40;
      focus = 1.6; blur = 0.7;
    } else if (game.turn === 'ai' && (phase === 'ai-aim' || phase === 'flight')) {
      eye = v(1.2, 1.7, 0.4); look = v(centre.x, centre.y, -distance); fov = aimFov(distance, 0.75);
      blur = 0.3;
    } else {
      const sight = sightPoint(game), zoom = phase === 'flight' ? 1 : drawAmount(game);
      // While a normal shot flies the view holds still, so the arrow is seen arriving.
      look = phase === 'flight' ? this.look.clone() : v(sight.x, sight.y, -distance); fov = phase === 'flight' ? this.fov : aimFov(distance, zoom);
      blur = phase === 'flight' ? this.blur : 0.85 * ease(drawAmount(game));
    }
    if (phase !== 'impact') this.impactFrom = null;
    this.eye.copy(eye); this.look.copy(look); this.fov = fov;
    this.focus += (focus - this.focus) * Math.min(1, dt * 12); this.blur += (blur - this.blur) * Math.min(1, dt * 6);
    this.camera.position.copy(eye); this.camera.fov = fov; this.camera.updateProjectionMatrix(); this.camera.lookAt(look);
    // Camera-only shake from a decaying trauma value; never touches the simulation.
    this.trauma = Math.max(0, this.trauma - dt * 1.6);
    if (this.trauma > 0 && !reduced) {
      const s = this.trauma * this.trauma * 0.012;
      this.camera.rotation.x += s * Math.sin(this.clock * 47); this.camera.rotation.y += s * Math.sin(this.clock * 39 + 1.3); this.camera.rotation.z += s * 0.5 * Math.sin(this.clock * 31 + 2.1);
    }
  }

  inspect() {
    return {
      drawCalls: this.renderer.info.render.calls, triangles: this.renderer.info.render.triangles, fov: this.camera.fov, eye: this.camera.position.toArray(),
      lowPower: this.tier === 'low', tier: this.tier, post: !!this.post, shadows: this.renderer.shadowMap.enabled, focus: +this.focus.toFixed(2), blur: +this.blur.toFixed(2),
      bow: this.bow.visible, stuckArrows: this.stuck.length, groundArrows: this.ground_.length, faceChildren: this.target.face.children.length, range: this.range,
    };
  }

  dispose() {
    this.disposed = true; this.observer.disconnect();
    disposeObject(this.scene); disposeObject(this.bow.scene);
    this.scenery.dispose(); this.sky.dispose(); this.post?.dispose(); this.vignette.dispose();
    this.environment?.dispose(); this.blobTexture.dispose();
    for (const t of Object.values(this.textures)) t?.dispose();
    this.renderer.dispose(); this.renderer.forceContextLoss();
  }
}
