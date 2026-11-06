// Rim Rush renderer. Draws the simulation; it never changes it.
import * as T from 'three';
import {RoomEnvironment} from 'three/examples/jsm/environments/RoomEnvironment.js';
import {BALL_R, BOARD_X, HOOP_X, PLAYER_LOOK, RIM_R, RIM_Y, WALL_X, type CourtId, type Look} from './levels';
import {facing, handPoint, previewPath, type Game, type GameEvent, type PowerKind, type Side} from './engine';
import {Baller, type Pose} from './baller';
import {buildVenue, cheerCrowd, COURT_Z0, COURT_Z1, type TextureSet, type Venue} from './venues';
import type {BallSkin, Outfit} from './shop';

const TEXTURES = ['gym-brick-color', 'gym-brick-normal', 'concrete-color', 'concrete-normal', 'gym-floor-color', 'arena-floor-color', 'boardwalk-color', 'boardwalk-normal', 'rooftop-color', 'rooftop-normal', 'sand-color', 'sand-normal'];
const v3 = (x = 0, y = 0, z = 0) => new T.Vector3(x, y, z);
const NET_ROWS = 6, NET_COLS = 16, NET_DROP = 0.42;
const CONFETTI = 220;

function ballTexture(skin: BallSkin) {
  const c = document.createElement('canvas'); c.width = 512; c.height = 256;
  const x = c.getContext('2d')!;
  x.fillStyle = skin.base; x.fillRect(0, 0, 512, 256);
  // Pebbled leather.
  let seed = 3;
  const rnd = () => {seed = (seed * 16807) % 2147483647; return seed / 2147483647;};
  for (let i = 0; i < 9000; i++) {x.fillStyle = rnd() > 0.5 ? 'rgba(0,0,0,0.07)' : 'rgba(255,255,255,0.05)'; x.fillRect(rnd() * 512, rnd() * 256, 2, 2);}
  if (skin.stripe) {x.fillStyle = skin.stripe; for (const u of [0, 256]) x.fillRect(u + 40, 0, 88, 256);}
  x.strokeStyle = skin.seam; x.lineWidth = 6;
  x.beginPath(); x.moveTo(0, 128); x.lineTo(512, 128); x.stroke();
  for (const u of [0, 128, 256, 384, 512]) {x.beginPath(); x.moveTo(u, 0); x.lineTo(u, 256); x.stroke();}
  for (const off of [64, 320]) {x.beginPath(); for (let u = 0; u <= 128; u += 2) {const y = 128 + Math.sin((u / 128) * Math.PI) * 110 * (off === 64 ? 1 : -1); if (u === 0) x.moveTo(off - 64 + u, y); else x.lineTo(off - 64 + u, y);} x.stroke();}
  const t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; t.anisotropy = 4;
  return t;
}
function netTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 64;
  const x = c.getContext('2d')!; x.strokeStyle = '#ffffff'; x.lineWidth = 5; x.lineCap = 'round';
  x.beginPath(); x.moveTo(0, 0); x.lineTo(64, 64); x.moveTo(64, 0); x.lineTo(0, 64); x.stroke();
  const t = new T.CanvasTexture(c); t.wrapS = t.wrapT = T.RepeatWrapping; t.repeat.set(8, 3);
  return t;
}
function iconTexture(kind: PowerKind) {
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const x = c.getContext('2d')!; x.translate(64, 64); x.strokeStyle = '#fffaf0'; x.fillStyle = '#fffaf0'; x.lineCap = 'round';
  if (kind === 'bigRim') {x.lineWidth = 12; x.beginPath(); x.ellipse(0, -6, 40, 16, 0, 0, Math.PI * 2); x.stroke(); x.lineWidth = 6; for (const d of [-26, -9, 9, 26]) {x.beginPath(); x.moveTo(d, 8); x.lineTo(d * 0.6, 44); x.stroke();}}
  if (kind === 'freeze') {x.lineWidth = 9; for (let i = 0; i < 3; i++) {x.save(); x.rotate((i * Math.PI) / 3); x.beginPath(); x.moveTo(0, -46); x.lineTo(0, 46); for (const s of [-1, 1]) {x.moveTo(0, s * 28); x.lineTo(-14, s * 42); x.moveTo(0, s * 28); x.lineTo(14, s * 42);} x.stroke(); x.restore();}}
  if (kind === 'double') {x.font = "84px 'Lilita One', 'Arial Black', Impact, sans-serif"; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('×2', 0, 6);}
  const t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace;
  return t;
}
export const POWER_COLOURS: Record<PowerKind, string> = {bigRim: '#f08a24', freeze: '#5fc4ec', double: '#e6b422'};

type NetSim = {mesh: T.Mesh; base: Float32Array; dx: number[]; vdx: number[]; swell: number[]; vswell: number[]; drop: number[]; vdrop: number[]};
type Trail = {mesh: T.Mesh; points: T.Vector3[]};
type Piece = {p: T.Vector3; v: T.Vector3; r: T.Euler; w: T.Vector3; life: number; colour: T.Color};

export class RimRushView {
  renderer: T.WebGLRenderer;
  scene = new T.Scene();
  camera = new T.PerspectiveCamera(31, 16 / 9, 0.1, 900);
  private observer: ResizeObserver;
  private textures: TextureSet = {};
  private venue: Venue | null = null;
  private venueId: CourtId | null = null;
  private hemi = new T.HemisphereLight('#ffffff', '#444444', 1);
  private sun = new T.DirectionalLight('#ffffff', 2);
  /** Back light from behind the court that outlines the players against busy backgrounds. */
  private rim = new T.DirectionalLight('#ffffff', 1.5);
  private rims: T.Mesh[] = [];
  private rimShake = [0, 0];
  private nets: NetSim[] = [];
  private players: Baller[] = [];
  private balls: T.Mesh[] = [];
  private ballMats: T.MeshStandardMaterial[] = [];
  private ballSkins = ['', ''];
  private spin = [new T.Quaternion(), new T.Quaternion()];
  private spinRate = [0, 0];
  private shown = [v3(), v3()];
  private catching = [0, 0];
  private catchFrom = [v3(), v3()];
  private prevState = ['held', 'held'];
  private trails: Trail[] = [];
  private dots: T.InstancedMesh;
  private orb = new T.Group();
  private orbKind: PowerKind | null = null;
  private orbBorn = 0;
  private confetti: T.InstancedMesh;
  private pieces: Piece[] = [];
  private shake = 0;
  private time = 0;
  private lowPower: boolean;
  private disposed = false;
  private lastScore: [number, number] = [-1, -1];
  private celebrate = [-10, -10];
  private walkPhase = [0, 0];
  private lastX = [0, 0];
  private looks: [Look, Look] = [PLAYER_LOOK, PLAYER_LOOK];
  private skins: [BallSkin | null, BallSkin | null] = [null, null];
  private envTexture: T.Texture | null = null;

  constructor(private canvas: HTMLCanvasElement) {
    this.lowPower = (navigator.hardwareConcurrency ?? 8) <= 4 || matchMedia('(pointer: coarse)').matches && Math.min(screen.width, screen.height) < 420;
    this.renderer = new T.WebGLRenderer({canvas, antialias: true, powerPreference: 'high-performance'});
    this.renderer.setPixelRatio(Math.min(devicePixelRatio || 1, this.lowPower ? 1.25 : 1.5));
    this.renderer.outputColorSpace = T.SRGBColorSpace;
    this.renderer.toneMapping = T.ACESFilmicToneMapping;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = T.PCFSoftShadowMap;
    const pmrem = new T.PMREMGenerator(this.renderer);
    this.envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();
    this.scene.environment = this.envTexture;
    this.scene.environmentIntensity = 0.45;
    this.scene.add(this.hemi, this.sun, this.sun.target, this.rim, this.rim.target);
    this.rim.position.set(0, 13, -6); this.rim.target.position.set(0, 1.4, 0);
    this.sun.castShadow = true;
    const size = this.lowPower ? 1024 : 2048;
    this.sun.shadow.mapSize.set(size, size);
    Object.assign(this.sun.shadow.camera, {left: -8, right: 8, top: 7, bottom: -4, near: 1, far: 40});
    this.sun.shadow.bias = -0.0004; this.sun.shadow.normalBias = 0.02;

    // Rims and nets.
    for (const side of [-1, 1]) {
      const rim = new T.Mesh(new T.TorusGeometry(RIM_R, 0.026, 10, 40), new T.MeshStandardMaterial({color: '#e2531f', roughness: 0.35, metalness: 0.55, emissive: '#000000'}));
      rim.rotation.x = Math.PI / 2; rim.position.set(side * HOOP_X, RIM_Y, 0); rim.castShadow = true;
      this.scene.add(rim); this.rims.push(rim);
      const geo = new T.CylinderGeometry(RIM_R, RIM_R * 0.6, NET_DROP, NET_COLS, NET_ROWS - 1, true);
      const mesh = new T.Mesh(geo, new T.MeshStandardMaterial({map: netTexture(), alphaTest: 0.45, transparent: false, side: T.DoubleSide, roughness: 0.9, color: '#ffffff'}));
      mesh.position.set(side * HOOP_X, RIM_Y - NET_DROP / 2, 0); mesh.castShadow = true;
      this.scene.add(mesh);
      this.nets.push({mesh, base: (geo.attributes.position.array as Float32Array).slice(), dx: Array(NET_ROWS).fill(0), vdx: Array(NET_ROWS).fill(0), swell: Array(NET_ROWS).fill(0), vswell: Array(NET_ROWS).fill(0), drop: Array(NET_ROWS).fill(0), vdrop: Array(NET_ROWS).fill(0)});
    }
    // Players, balls and trails.
    for (let i = 0; i < 2; i++) {
      const p = new Baller(PLAYER_LOOK); this.players.push(p); this.scene.add(p.root);
      const mat = new T.MeshStandardMaterial({roughness: 0.62, metalness: 0});
      const ball = new T.Mesh(new T.SphereGeometry(BALL_R, 36, 24), mat); ball.castShadow = true;
      this.ballMats.push(mat); this.balls.push(ball); this.scene.add(ball);
      const trailGeo = new T.BufferGeometry();
      trailGeo.setAttribute('position', new T.BufferAttribute(new Float32Array(40 * 3), 3));
      trailGeo.setAttribute('color', new T.BufferAttribute(new Float32Array(40 * 4), 4));
      const idx: number[] = []; for (let k = 0; k < 19; k++) {const a = k * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);}
      trailGeo.setIndex(idx);
      const trail = new T.Mesh(trailGeo, new T.MeshBasicMaterial({vertexColors: true, transparent: true, depthWrite: false, side: T.DoubleSide, blending: T.NormalBlending}));
      trail.frustumCulled = false; this.scene.add(trail); this.trails.push({mesh: trail, points: []});
    }
    // Aim guide.
    const dc = document.createElement('canvas'); dc.width = dc.height = 64;
    const dx = dc.getContext('2d')!; dx.fillStyle = '#fffaf0'; dx.strokeStyle = '#1a1410'; dx.lineWidth = 9;
    dx.beginPath(); dx.arc(32, 32, 26, 0, Math.PI * 2); dx.fill(); dx.stroke();
    const dotMap = new T.CanvasTexture(dc); dotMap.colorSpace = T.SRGBColorSpace;
    this.dots = new T.InstancedMesh(new T.PlaneGeometry(0.17, 0.17), new T.MeshBasicMaterial({map: dotMap, transparent: true, depthTest: false, toneMapped: false}), 12);
    this.dots.renderOrder = 5; this.dots.frustumCulled = false; this.dots.visible = false; this.scene.add(this.dots);
    // Power-up orb.
    const shell = new T.Mesh(new T.SphereGeometry(0.34, 32, 20), new T.MeshStandardMaterial({color: '#ffffff', roughness: 0.15, transparent: true, opacity: 0.55, emissive: '#ffffff', emissiveIntensity: 0.4, depthWrite: false}));
    const ring = new T.Mesh(new T.TorusGeometry(0.42, 0.025, 8, 48), new T.MeshBasicMaterial({color: '#fffaf0'}));
    const icon = new T.Sprite(new T.SpriteMaterial({transparent: true, depthWrite: false})); icon.scale.set(0.5, 0.5, 1);
    this.orb.add(shell, ring, icon); this.orb.visible = false; this.scene.add(this.orb);
    // Confetti and sparks.
    this.confetti = new T.InstancedMesh(new T.PlaneGeometry(0.07, 0.11), new T.MeshBasicMaterial({side: T.DoubleSide}), CONFETTI);
    this.confetti.instanceColor = new T.InstancedBufferAttribute(new Float32Array(CONFETTI * 3), 3);
    this.confetti.frustumCulled = false; this.confetti.count = 0; this.scene.add(this.confetti);

    this.observer = new ResizeObserver(() => this.resize()); this.observer.observe(canvas); this.resize();
  }

  async loadAssets(base: string) {
    const loader = new T.TextureLoader();
    await Promise.all(TEXTURES.map(async name => {
      try {
        const t = await loader.loadAsync(`${base}textures/${name}.jpg`);
        if (name.endsWith('color')) t.colorSpace = T.SRGBColorSpace;
        t.anisotropy = 8; this.textures[name] = t;
      } catch {/* A missing texture falls back to a flat colour. */}
    }));
    // Make sure the display font is ready before canvas text is painted.
    try {await document.fonts?.load("64px 'Lilita One'");} catch {/* System fallback. */}
    this.players.forEach((p, i) => {p.invalidate(); p.setLook(this.looks[i]);});
    this.setCourt('rooftop');
  }

  setCourt(id: CourtId) {
    if (this.venueId === id) return;
    if (this.venue) {this.scene.remove(this.venue.group); this.venue.dispose();}
    const v = buildVenue(id, this.textures);
    this.venue = v; this.venueId = id;
    this.scene.add(v.group);
    this.scene.background = v.background; this.scene.fog = v.fog;
    this.renderer.toneMappingExposure = v.exposure;
    this.hemi.color.set(v.hemi[0]); this.hemi.groundColor.set(v.hemi[1]); this.hemi.intensity = v.hemi[2];
    this.rim.color.set(v.rim[0]); this.rim.intensity = v.rim[1];
    this.sun.color.set(v.sun[0]); this.sun.intensity = v.sun[1]; this.sun.position.set(...v.sun[2]); this.sun.target.position.set(0, 1, 0);
    this.renderer.shadowMap.needsUpdate = true;
  }

  /** The player's outfit and ball, and the rival's look. */
  setLooks(left: Look, right: Look, outfit: Outfit | null, leftBall: BallSkin, rightBall: BallSkin) {
    const l = outfit ? {...left, jersey: outfit.jersey, trim: outfit.trim, shorts: outfit.shorts, shoes: outfit.shoes} : left;
    this.looks = [l, right];
    this.players[0].setLook(l); this.players[1].setLook(right);
    this.skins = [leftBall, rightBall];
    for (let i = 0; i < 2; i++) {
      const skin = this.skins[i]!, key = JSON.stringify(skin) + i;
      if (this.ballSkins[i] === key) continue;
      this.ballSkins[i] = key; this.ballMats[i].map?.dispose(); this.ballMats[i].map = ballTexture(skin); this.ballMats[i].needsUpdate = true;
    }
  }

  private resize() {
    const w = Math.max(1, this.canvas.clientWidth), h = Math.max(1, this.canvas.clientHeight);
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h; this.camera.updateProjectionMatrix();
  }
  /** Distance that fits the whole court across and the shot arcs above. */
  private fitDistance() {
    const t = Math.tan(T.MathUtils.degToRad(this.camera.fov / 2));
    return Math.max((WALL_X + 0.6) / (t * this.camera.aspect), 3.35 / t);
  }
  /** Screen position (CSS pixels) of a court point, for HTML labels. */
  toScreen(x: number, y: number) {
    const p = v3(x, y, 0).project(this.camera);
    return {x: (p.x * 0.5 + 0.5) * this.canvas.clientWidth, y: (-p.y * 0.5 + 0.5) * this.canvas.clientHeight};
  }

  /** Visual reactions to simulation events. */
  react(events: GameEvent[], g: Game, reduced: boolean) {
    for (const e of events) {
      if (e.type === 'contact' && e.kind === 'rim' && e.hoop) {const i = e.hoop === -1 ? 0 : 1; this.rimShake[i] = Math.min(1, this.rimShake[i] + e.speed * 0.25); if (!reduced) this.burst(v3(e.hoop * HOOP_X, RIM_Y, 0), ['#ffd08a', '#f08a24'], 6, 2);}
      if (e.type === 'contact' && e.kind === 'board' && e.hoop) this.rimShake[e.hoop === -1 ? 0 : 1] += e.speed * 0.08;
      if (e.type === 'score') {
        const s = e.score, hx = facing(s.side) * HOOP_X;
        this.celebrate[s.side] = this.time;
        if (!reduced) {
          this.burst(v3(hx, RIM_Y - 0.2, 0), s.side === 0 ? ['#f08a24', '#fff6e8', '#e6b422', this.looks[0].jersey] : [this.looks[1].jersey, this.looks[1].trim, '#fff6e8'], s.points >= 4 ? 70 : 34, 4.5);
          this.shake = Math.max(this.shake, s.points >= 4 ? 0.12 : 0.05);
        }
        cheerCrowd(s.points >= 4 ? 1 : s.side === 0 ? 0.7 : 0.45);
      }
      if (e.type === 'block') {if (!reduced) this.shake = Math.max(this.shake, 0.1); cheerCrowd(0.8);}
      if (e.type === 'final' || e.type === 'overtime') cheerCrowd(1);
      if (e.type === 'power' && !reduced) this.burst(this.orb.position.clone(), [POWER_COLOURS[e.kind], '#ffffff'], 30, 3);
      if (e.type === 'power' && e.kind === 'freeze' && !reduced) {const o = g.players[e.side === 0 ? 1 : 0]; this.burst(v3(o.x, 1.2, 0), ['#bfe8ff', '#ffffff', '#5fc4ec'], 26, 2.5);}
      if (e.type === 'land' && !reduced) this.burst(v3(g.players[e.side].x, 0.05, 0.1), ['#d8cbb5', '#bfb39d'], 5, 0.8);
    }
  }

  private burst(at: T.Vector3, colours: string[], count: number, speed: number) {
    for (let i = 0; i < count && this.pieces.length < CONFETTI; i++) {
      const a = Math.random() * Math.PI * 2, up = 0.4 + Math.random() * 0.8;
      this.pieces.push({p: at.clone(), v: v3(Math.cos(a) * speed * (0.3 + Math.random() * 0.5), speed * up, Math.sin(a) * speed * 0.4 + 0.5), r: new T.Euler(Math.random() * 6, Math.random() * 6, 0),
        w: v3(Math.random() * 12 - 6, Math.random() * 12 - 6, 0), life: 1.2 + Math.random() * 0.8, colour: new T.Color(colours[i % colours.length])});
    }
  }

  private poseFor(g: Game | null, side: Side, dt: number): {pose: Pose; ball: T.Vector3 | null; snappy: boolean; hop: number} {
    const baller = this.players[side], f = g ? facing(side) : side === 0 ? 1 : -1;
    const pl = g?.players[side], b = g?.balls[side], t = this.time;
    const pose: Pose = {hands: [v3(-0.28, 1.0, 0.12), v3(0.28, 1.0, 0.12)], feet: [v3(-0.13, 0.08, 0.06), v3(0.13, 0.08, -0.06)], hipDrop: 0.02 + Math.sin(t * 2.2 + side) * 0.012, lean: 0.06, look: v3(0, 1.75, 3), frozen: pl?.frozen ?? 0};
    if (!g || !pl || !b) return {pose, ball: null, snappy: false, hop: 0};
    let hop = 0, snappy = false;
    const moving = Math.abs(pl.x - this.lastX[side]) > 1e-4 && !pl.airborne;
    this.lastX[side] = pl.x;
    if (moving) {
      this.walkPhase[side] += dt * 11;
      const s = Math.sin(this.walkPhase[side]);
      pose.feet[0].set(-0.13, 0.08 + Math.max(0, s) * 0.12, s * 0.2); pose.feet[1].set(0.13, 0.08 + Math.max(0, -s) * 0.12, -s * 0.2);
      hop = Math.abs(Math.cos(this.walkPhase[side])) * 0.03;
    }
    if (pl.airborne) {pose.feet[0].set(-0.13, 0.36, -0.1); pose.feet[1].set(0.13, 0.26, 0.08); pose.hipDrop = -0.02;}
    const other = g.balls[side === 0 ? 1 : 0];
    const target = other.state === 'flight' ? v3(other.x, other.y, 0) : b.state !== 'held' ? v3(b.x, b.y, 0) : v3(f * HOOP_X, RIM_Y, 0);
    pose.look = baller.toLocal(target, v3());
    let ball: T.Vector3 | null = null;
    const sinceShot = g.time - pl.shotAt;
    const aiming = (side === 0 && !g.config.autopilot && g.aim) || (pl.ai?.planned && pl.ai.wait < 0.3 && !pl.airborne);
    const power = side === 0 && g.aim ? g.aim.power : 0.5;
    if (b.state === 'held') {
      const h = handPoint(g, side), crouch = aiming ? 0.06 + power * 0.12 : 0;
      ball = v3(h.x - f * (aiming ? 0.08 : 0), h.y - crouch - (aiming ? 0.18 : 0) + (g.phase === 'countdown' ? Math.sin(t * 3) * 0.02 : 0), 0);
      const local = baller.toLocal(ball, v3());
      pose.hands[0].set(local.x - 0.12, local.y - 0.02, local.z - 0.04); pose.hands[1].set(local.x + 0.12, local.y - 0.02, local.z - 0.04);
      if (aiming) {pose.hipDrop = crouch; pose.lean = 0.12; pose.feet[0].z = 0.1;}
    } else if (sinceShot < 0.45) {
      // Follow-through.
      pose.hands[0].set(-0.1, 2.32, 0.28); pose.hands[1].set(0.1, 2.36, 0.3); pose.hipDrop = -0.04; snappy = true; pose.lean = -0.05;
    } else if (this.time - this.celebrate[side] < 1.3) {
      const pump = Math.sin((this.time - this.celebrate[side]) * 14);
      pose.hands[0].set(-0.3, 1.05, 0.15); pose.hands[1].set(0.22, 2.1 + pump * 0.18, 0.05); hop = Math.max(0, Math.sin((this.time - this.celebrate[side]) * 7)) * 0.08;
    } else {
      // Defending: hands up.
      const up = other.state === 'flight' ? 2.32 : 2.0;
      pose.hands[0].set(-0.24, up, 0.18); pose.hands[1].set(0.24, up + 0.04, 0.18); pose.hipDrop = 0.05;
    }
    if (g.phase === 'finished') {
      if (g.winner === side) {const k = Math.sin(this.time * 8); pose.hands[0].set(-0.3, 2.3 + k * 0.08, 0.05); pose.hands[1].set(0.3, 2.3 - k * 0.08, 0.05); hop = Math.max(0, k) * 0.12;}
      else if (g.winner !== null) {pose.hipDrop = 0.16; pose.lean = 0.45; pose.hands[0].set(-0.16, 0.62, 0.3); pose.hands[1].set(0.16, 0.62, 0.3); pose.look = v3(0, 0.5, 1.5);}
    }
    if (pl.frozen > 0) snappy = false;
    return {pose, ball, snappy, hop};
  }

  draw(g: Game | null, dt: number, reduced: boolean, attract: boolean) {
    if (this.disposed) return;
    this.time += dt;
    const t = this.time;
    if (g) this.setCourt(g.config.court.id);
    // Camera: fit the court, sway gently, shake on big moments.
    const d = this.fitDistance(), sway = attract && !reduced ? Math.sin(t * 0.15) * 0.22 : 0;
    this.camera.position.set(Math.sin(sway) * d, 3.55 + (attract ? 0.4 : 0), Math.cos(sway) * d);
    this.camera.lookAt(0, 2.35, 0);
    if (this.shake > 0 && !reduced) {this.camera.position.x += (Math.random() - 0.5) * this.shake; this.camera.position.y += (Math.random() - 0.5) * this.shake;}
    this.shake = Math.max(0, this.shake - dt * 0.6);

    // Players.
    for (const side of [0, 1] as const) {
      const p = this.players[side];
      if (!g) {p.root.visible = false; continue;}
      p.root.visible = true;
      const pl = g.players[side], {pose, ball, snappy, hop} = this.poseFor(g, side, dt);
      p.place(pl.x, pl.y + hop, facing(side));
      p.pose(pose, pl.frozen > 0 ? 0 : dt, snappy);
      p.setAura(pl.double, t);
      // Ball display: held balls follow the hands; a ball coming back is tossed into them.
      const b = g.balls[side], mesh = this.balls[side];
      mesh.visible = true;
      const target = ball ?? v3(b.x, b.y, 0);
      if (b.state === 'held' && this.prevState[side] !== 'held') {this.catching[side] = 0.001; this.catchFrom[side].copy(this.shown[side]);}
      this.prevState[side] = b.state;
      if (this.catching[side] > 0) {
        this.catching[side] = Math.min(1, this.catching[side] + dt / 0.22);
        const k = this.catching[side];
        this.shown[side].lerpVectors(this.catchFrom[side], target, k * k * (3 - 2 * k)); this.shown[side].y += Math.sin(k * Math.PI) * 0.4;
        if (k >= 1) this.catching[side] = 0;
      } else this.shown[side].copy(target);
      mesh.position.copy(this.shown[side]);
      const rate = b.state === 'flight' ? facing(side) * 13 : b.state === 'loose' && b.y <= BALL_R + 0.01 ? -b.vx / BALL_R : this.spinRate[side] * 0.98;
      this.spinRate[side] = b.state === 'held' ? 0 : rate;
      this.spin[side].premultiply(new T.Quaternion().setFromAxisAngle(v3(0, 0, 1), this.spinRate[side] * dt));
      mesh.quaternion.copy(this.spin[side]);
      this.updateTrail(side, b.state === 'flight' || (b.state === 'loose' && b.age < 0.4), this.shown[side]);
    }
    for (const mesh of this.balls) if (!g) mesh.visible = false;

    // Rims: power-up size and shake.
    for (let i = 0; i < 2; i++) {
      const rim = this.rims[i], r = g ? g.hoops[i].rimR : RIM_R, s = r / RIM_R;
      rim.scale.set(s, s, 1); this.nets[i].mesh.scale.set(s, 1, s);
      (rim.material as T.MeshStandardMaterial).emissive.set(s > 1.01 ? POWER_COLOURS.bigRim : '#000000');
      (rim.material as T.MeshStandardMaterial).emissiveIntensity = s > 1.01 ? 0.6 + Math.sin(t * 8) * 0.3 : 0;
      this.rimShake[i] = Math.max(0, this.rimShake[i] - dt * 2.5);
      const wobble = reduced ? 0 : Math.sin(t * 40) * this.rimShake[i] * 0.025;
      rim.position.y = RIM_Y + wobble; rim.rotation.z = wobble * 2 * (i === 0 ? -1 : 1);
      this.updateNet(i, g, dt, s);
    }

    // Aim guide for the human player.
    if (g && g.aim && !g.config.autopilot && g.balls[0].state === 'held') {
      const pts = previewPath(g, 0, g.aim.angle, g.aim.power, 0.36, 12), m = new T.Matrix4();
      pts.forEach((p, i) => {const s = 1 - i / 18; m.compose(v3(p.x, p.y, 0), new T.Quaternion(), v3(s, s, s)); this.dots.setMatrixAt(i, m);});
      this.dots.instanceMatrix.needsUpdate = true; this.dots.visible = true;
    } else this.dots.visible = false;

    // Power-up orb.
    const power = g?.power ?? null;
    this.orb.visible = !!power;
    if (power) {
      if (this.orbKind !== power.kind) {
        this.orbKind = power.kind; this.orbBorn = t;
        const [shell, ring, icon] = this.orb.children as [T.Mesh, T.Mesh, T.Sprite];
        (shell.material as T.MeshStandardMaterial).color.set(POWER_COLOURS[power.kind]); (shell.material as T.MeshStandardMaterial).emissive.set(POWER_COLOURS[power.kind]);
        (ring.material as T.MeshBasicMaterial).color.set(POWER_COLOURS[power.kind]);
        icon.material.map?.dispose(); icon.material.map = iconTexture(power.kind); icon.material.needsUpdate = true;
      }
      const grow = Math.min(1, (t - this.orbBorn) * 3), pulse = 1 + Math.sin(t * 5) * 0.05;
      this.orb.position.set(power.x, power.y + Math.sin(t * 2.4) * 0.08, 0);
      this.orb.scale.setScalar(grow * pulse * (power.age > 7.5 ? 0.6 + 0.4 * Math.abs(Math.sin(t * 12)) : 1));
      this.orb.children[1].rotation.set(t * 1.7, t * 1.1, 0);
    } else this.orbKind = null;

    // Confetti.
    const m = new T.Matrix4(), q = new T.Quaternion();
    this.pieces = this.pieces.filter(p => (p.life -= dt) > 0);
    this.pieces.forEach((p, i) => {
      p.v.y -= 7 * dt; p.v.multiplyScalar(1 - dt * 1.2); p.p.addScaledVector(p.v, dt);
      if (p.p.y < 0.02) {p.p.y = 0.02; p.v.set(0, 0, 0); p.w.set(0, 0, 0);}
      p.r.x += p.w.x * dt; p.r.y += p.w.y * dt;
      const s = Math.min(1, p.life * 2);
      m.compose(p.p, q.setFromEuler(p.r), v3(s, s, s)); this.confetti.setMatrixAt(i, m); this.confetti.setColorAt(i, p.colour);
    });
    this.confetti.count = this.pieces.length; this.confetti.instanceMatrix.needsUpdate = true;
    if (this.confetti.instanceColor) this.confetti.instanceColor.needsUpdate = true;

    const score: [number, number] | null = g ? [g.score[0], g.score[1]] : null;
    if (g && (score![0] !== this.lastScore[0] || score![1] !== this.lastScore[1])) this.lastScore = [score![0], score![1]];
    this.venue?.update(t, score, g ? (g.phase === 'overtime' ? 'OVERTIME' : `${Math.floor(Math.ceil(g.clock) / 60)}:${String(Math.ceil(g.clock) % 60).padStart(2, '0')}`) : '');
    this.renderer.render(this.scene, this.camera);
  }

  private updateTrail(side: Side, on: boolean, p: T.Vector3) {
    const tr = this.trails[side], pos = tr.mesh.geometry.attributes.position as T.BufferAttribute, col = tr.mesh.geometry.attributes.color as T.BufferAttribute;
    if (on) {tr.points.unshift(p.clone()); if (tr.points.length > 20) tr.points.pop();}
    else if (tr.points.length) tr.points.pop();
    const colour = new T.Color(this.skins[side]?.trail ?? '#ffb36b');
    for (let i = 0; i < 20; i++) {
      const a = tr.points[Math.min(i, tr.points.length - 1)] ?? p, b = tr.points[Math.min(i + 1, tr.points.length - 1)] ?? a;
      const dir = v3(a.x - b.x, a.y - b.y, 0); const n = dir.lengthSq() > 1e-8 ? v3(-dir.y, dir.x, 0).normalize() : v3(0, 1, 0);
      const w = BALL_R * 0.9 * (1 - i / 20), alpha = tr.points.length > 1 ? 0.55 * (1 - i / 20) : 0;
      pos.setXYZ(i * 2, a.x + n.x * w, a.y + n.y * w, -0.02); pos.setXYZ(i * 2 + 1, a.x - n.x * w, a.y - n.y * w, -0.02);
      col.setXYZW(i * 2, colour.r, colour.g, colour.b, alpha); col.setXYZW(i * 2 + 1, colour.r, colour.g, colour.b, alpha);
    }
    pos.needsUpdate = true; col.needsUpdate = true;
    tr.mesh.geometry.setDrawRange(0, tr.points.length > 1 ? (Math.min(tr.points.length, 20) - 1) * 6 : 0);
  }

  /** A small spring model: rows of the net sway with balls passing through and stretch on a swish. */
  private updateNet(i: number, g: Game | null, dt: number, scale: number) {
    const n = this.nets[i], hx = (i === 0 ? -1 : 1) * HOOP_X, rimR = RIM_R * scale;
    if (g) for (const b of g.balls) {
      if (b.state === 'held' || Math.abs(b.x - hx) > rimR + BALL_R || b.y > RIM_Y + 0.1 || b.y < RIM_Y - NET_DROP - 0.15) continue;
      for (let r = 0; r < NET_ROWS; r++) {
        const ry = RIM_Y - (r / (NET_ROWS - 1)) * NET_DROP, near = Math.max(0, 1 - Math.abs(b.y - ry) / 0.18);
        if (!near) continue;
        n.vdx[r] += (b.vx * 0.9 + (b.x - hx) * 6) * near * dt * 8;
        n.vswell[r] += near * dt * 4; n.vdrop[r] += Math.max(0, -b.vy) * near * dt * 1.6;
      }
    }
    const steps = Math.max(1, Math.round(dt / (1 / 120)));
    for (let s = 0; s < steps; s++) for (let r = 1; r < NET_ROWS; r++) {
      const h = dt / steps;
      n.vdx[r] += (-140 * n.dx[r] - 7 * n.vdx[r]) * h; n.dx[r] += n.vdx[r] * h;
      n.vswell[r] += (-180 * n.swell[r] - 9 * n.vswell[r]) * h; n.swell[r] += n.vswell[r] * h;
      n.vdrop[r] += (-120 * n.drop[r] - 6 * n.vdrop[r]) * h; n.drop[r] += n.vdrop[r] * h;
      n.dx[r] = Math.max(-0.2, Math.min(0.2, n.dx[r])); n.swell[r] = Math.max(-0.04, Math.min(0.08, n.swell[r])); n.drop[r] = Math.max(-0.02, Math.min(0.14, n.drop[r]));
    }
    const pos = n.mesh.geometry.attributes.position as T.BufferAttribute, base = n.base;
    for (let r = 0; r < NET_ROWS; r++) for (let c = 0; c <= NET_COLS; c++) {
      const k = r * (NET_COLS + 1) + c, bx = base[k * 3], by = base[k * 3 + 1], bz = base[k * 3 + 2];
      const radial = Math.hypot(bx, bz) || 1, grow = (radial + n.swell[r]) / radial, w = r / (NET_ROWS - 1);
      pos.setXYZ(k, bx * grow + n.dx[r] * w / scale, by - n.drop[r] * w - Math.sin(c * 1.7 + this.time * 3) * 0.004 * w, bz * grow);
    }
    pos.needsUpdate = true;
  }

  inspect() {
    return {
      court: this.venueId, camera: this.camera.position.toArray().map(n => +n.toFixed(2)), dots: this.dots.visible, orb: this.orb.visible,
      balls: this.balls.map(b => b.position.toArray().map(n => +n.toFixed(3))), confetti: this.pieces.length,
      draws: this.renderer.info.render.calls, triangles: this.renderer.info.render.triangles,
      bounds: {left: this.toScreen(-WALL_X, 0).x, right: this.toScreen(WALL_X, 0).x, rim: this.toScreen(HOOP_X, RIM_Y), board: this.toScreen(BOARD_X, 3.95), nearFloor: this.toScreen(0, 0).y, z: [COURT_Z0, COURT_Z1]},
    };
  }

  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    this.observer.disconnect();
    if (this.venue) {this.scene.remove(this.venue.group); this.venue.dispose();}
    for (const p of this.players) p.dispose();
    this.scene.traverse(o => {
      if (o instanceof T.Mesh || o instanceof T.InstancedMesh || o instanceof T.Sprite) {
        o.geometry?.dispose();
        for (const m of Array.isArray(o.material) ? o.material : [o.material]) {(m as T.MeshStandardMaterial).map?.dispose(); m.dispose();}
      }
    });
    for (const t of Object.values(this.textures)) t?.dispose();
    this.envTexture?.dispose();
    this.renderer.dispose();
  }
}
