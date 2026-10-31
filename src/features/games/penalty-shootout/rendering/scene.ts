import * as THREE from "three";
import { GOAL, type Frame, type Snapshot, type Vec3 } from "../game-types";
import { mix } from "../engine/rules";
import { ImportedAthletes } from "./imported-athletes";
import { buildStadium } from "./stadium";
import { broadcastCamera } from "./camera";

const colors = { sky: 0xaab5bb, haze: 0xc1c7c5, white: 0xe8e9dc, marker: 0xe9e7c8 };
const vec = (v: Vec3) => new THREE.Vector3(v.x, v.y, v.z);

function canvasTexture(width: number, height: number, draw: (ctx: CanvasRenderingContext2D) => void) {
  const canvas = document.createElement("canvas"); canvas.width = width; canvas.height = height;
  const ctx = canvas.getContext("2d"); if (!ctx) throw new Error("Canvas textures are unavailable"); draw(ctx);
  const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace; return texture;
}
function lineBetween(a: THREE.Vector3, b: THREE.Vector3, material: THREE.Material, radius = 0.045) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, a.distanceTo(b), 10), material);
  mesh.position.copy(a).add(b).multiplyScalar(0.5); mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize()); mesh.castShadow = true; return mesh;
}

export class ShootoutScene {
  readonly renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(36, 1, 0.08, 240);
  private ball: THREE.Mesh;
  private target: THREE.Group;
  private net: THREE.LineSegments;
  private athletes: ImportedAthletes | null = null;
  private size = { width: 1, height: 1 };
  private resizeObserver: ResizeObserver;
  private quality = Math.min(window.devicePixelRatio, 1.6);
  private frameCount = 0;
  private sampleMs = 0;
  private previousTime = performance.now();
  private disposed = false;
  private replaying = false;
  private currentRole = "";
  private lost: (event: Event) => void;
  private restored: () => void;
  private sunlight: THREE.DirectionalLight;
  private goalPosition: Float32Array;
  private ui: HTMLElement;
  private crowdMotion: (seconds: number, reducedMotion: boolean) => void;
  constructor(private host: HTMLElement, onLost: () => void, onRestored: () => void) {
    this.ui = host;
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
    this.renderer.setPixelRatio(this.quality); this.renderer.shadowMap.enabled = true; this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace; this.renderer.toneMapping = THREE.ACESFilmicToneMapping; this.renderer.toneMappingExposure = 1.02;
    this.renderer.domElement.setAttribute("aria-label", "3D penalty pitch"); this.renderer.domElement.setAttribute("role", "img"); host.appendChild(this.renderer.domElement);
    this.scene.background = new THREE.Color(colors.sky); this.scene.fog = new THREE.Fog(colors.haze, 85, 220);
    this.scene.add(new THREE.HemisphereLight(0xe8f1f2, 0x4d543e, 1.45));
    const characterFill = new THREE.DirectionalLight(0xdde9f0, .65); characterFill.position.set(8, 9, -16); this.scene.add(characterFill);
    this.sunlight = new THREE.DirectionalLight(0xfff0d8, 2.2); this.sunlight.position.set(-16, 30, 17); this.sunlight.castShadow = true;
    this.sunlight.shadow.mapSize.set(1024, 1024); Object.assign(this.sunlight.shadow.camera, { left: -14, right: 14, top: 18, bottom: -12, near: 1, far: 80 }); this.sunlight.shadow.bias = -0.0003; this.sunlight.shadow.normalBias = 0.02;
    this.sunlight.target.position.set(0, 0, 5); this.scene.add(this.sunlight, this.sunlight.target);
    this.pitch(); this.crowdMotion = buildStadium(this.scene); this.net = this.goal(); this.goalPosition = new Float32Array(this.net.geometry.attributes.position.array);
    const ballTexture = canvasTexture(512, 256, ctx => {
      ctx.fillStyle = "#f3f2e8"; ctx.fillRect(0, 0, 512, 256);
      for (let row = 0; row < 5; row++) for (let col = 0; col < 10; col++) { const x = col * 58 + (row % 2) * 29, y = row * 58; ctx.beginPath(); for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2; ctx.lineTo(x + Math.cos(a) * 23, y + Math.sin(a) * 23); } ctx.closePath(); ctx.fillStyle = (row + col) % 3 === 0 ? "#1a2b34" : "#e8e9e0"; ctx.fill(); ctx.strokeStyle = "#aeb7b1"; ctx.lineWidth = 1; ctx.stroke(); }
    });
    this.ball = new THREE.Mesh(new THREE.SphereGeometry(GOAL.ballRadius, 24, 16), new THREE.MeshStandardMaterial({ map: ballTexture, roughness: 0.6 })); this.ball.castShadow = true; this.scene.add(this.ball);
    this.target = new THREE.Group();
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.13, 0.145, 40), new THREE.MeshBasicMaterial({ color: colors.marker, transparent: true, opacity: 0.8, side: THREE.DoubleSide, depthTest: false })); ring.renderOrder = 20; this.target.add(ring);
    const spread = new THREE.Mesh(new THREE.RingGeometry(0.98, 1, 48), new THREE.MeshBasicMaterial({ color: colors.marker, transparent: true, opacity: 0.23, depthTest: false, side: THREE.DoubleSide })); spread.name = "spread"; spread.renderOrder = 20; this.target.add(spread); this.scene.add(this.target);
    this.resizeObserver = new ResizeObserver(() => this.resize()); this.resizeObserver.observe(host); this.resize();
    this.lost = event => { event.preventDefault(); onLost(); }; this.restored = () => { this.resize(); onRestored(); };
    this.renderer.domElement.addEventListener("webglcontextlost", this.lost); this.renderer.domElement.addEventListener("webglcontextrestored", this.restored);
  }
  async load() {
    const athletes = await ImportedAthletes.load();
    if (this.disposed) { athletes.dispose(); return; }
    this.athletes = athletes;
    this.scene.add(athletes.group);
    this.ui.dataset.characterArt = "penalty-shooters-2";
  }
  private teamColors: [string,string,string,string] | null = null;
  async setTeamColors(player:string,opponent:string,playerShorts:string,opponentShorts:string){
    if(!this.athletes)return;
    await this.athletes.prepareKitMasks();
    this.teamColors=[player,opponent,playerShorts,opponentShorts];
  }
  private pitch() {
    const texture = canvasTexture(1024, 1024, ctx => { ctx.fillStyle = "#4d6b35"; ctx.fillRect(0, 0, 1024, 1024); let seed = 72; const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; }; for (let i = 0; i < 52000; i++) { ctx.fillStyle = random() > 0.5 ? "rgba(28,48,18,.15)" : "rgba(153,156,97,.14)"; ctx.fillRect(random() * 1024, random() * 1024, 1, 4); } }); texture.wrapS = texture.wrapT = THREE.RepeatWrapping; texture.repeat.set(8, 12); texture.anisotropy = 4;
    const grass = new THREE.Mesh(new THREE.PlaneGeometry(105, 140), new THREE.MeshStandardMaterial({ map: texture, roughness: 1 })); grass.rotation.x = -Math.PI / 2; grass.position.set(0, -0.005, 35); grass.receiveShadow = true; this.scene.add(grass);
    const stripeMat = new THREE.MeshStandardMaterial({ color: 0xa3ae72, transparent: true, opacity: 0.075, roughness: 1 });
    for (let z = 0; z < 100; z += 10) { const stripe = new THREE.Mesh(new THREE.PlaneGeometry(68, 5), stripeMat); stripe.rotation.x = -Math.PI / 2; stripe.position.set(0, 0.003, z + 2.5); this.scene.add(stripe); }
    const material = new THREE.LineBasicMaterial({ color: colors.white, transparent: true, opacity: 0.8 });
    const path = (points: number[][]) => { this.scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points.map(p => new THREE.Vector3(p[0], 0.012, p[1]))), material)); };
    path([[-34, 0], [34, 0], [34, 105], [-34, 105], [-34, 0]]); path([[-20.16, 0], [-20.16, 16.5], [20.16, 16.5], [20.16, 0]]); path([[-9.16, 0], [-9.16, 5.5], [9.16, 5.5], [9.16, 0]]);
    const spot = new THREE.Mesh(new THREE.CircleGeometry(0.12, 20), new THREE.MeshBasicMaterial({ color: colors.white })); spot.rotation.x = -Math.PI / 2; spot.position.set(0, 0.015, 11); this.scene.add(spot);
    const arc: number[][] = []; for (let i = 0; i <= 40; i++) { const a = Math.PI * (0.21 + i / 40 * 0.58); arc.push([Math.cos(a) * 9.15, 11 + Math.sin(a) * 9.15]); } path(arc);
  }
  private goal() {
    const mat = new THREE.MeshStandardMaterial({ color: colors.white, roughness: 0.3 });
    const a = GOAL.halfWidth + 0.06, h = GOAL.height + 0.06;
    for (const x of [-a, a]) { this.scene.add(lineBetween(new THREE.Vector3(x, 0, 0), new THREE.Vector3(x, h, 0), mat, 0.06)); this.scene.add(lineBetween(new THREE.Vector3(x, 0, -2), new THREE.Vector3(x, h, 0), mat, 0.025)); }
    this.scene.add(lineBetween(new THREE.Vector3(-a, h, 0), new THREE.Vector3(a, h, 0), mat, 0.06));
    const points: number[] = [], segment = (...v: number[]) => points.push(...v);
    for (let x = -a; x <= a; x += 0.18) { segment(x, 0, -2, x, h, -2); segment(x, h, -2, x, h, 0); }
    for (let y = 0; y <= h; y += 0.18) { segment(-a, y, -2, a, y, -2); segment(-a, y, -2, -a, y, 0); segment(a, y, -2, a, y, 0); }
    for (let z = -2; z <= 0; z += 0.18) { segment(-a, h, z, a, h, z); segment(-a, 0, z, -a, h, z); segment(a, 0, z, a, h, z); }
    const geometry = new THREE.BufferGeometry(); geometry.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
    const net = new THREE.LineSegments(geometry, new THREE.LineBasicMaterial({ color: 0xe2e6dc, transparent: true, opacity: 0.33 })); this.scene.add(net); return net;
  }
  private resize() { const width = Math.max(1, this.host.clientWidth), height = Math.max(1, this.host.clientHeight); this.size = { width, height }; this.renderer.setSize(width, height, false); this.camera.aspect = width / height; this.camera.updateProjectionMatrix(); }
  private mobileCup = false;
  optimizeForCup() {
    this.mobileCup = true;
    if(matchMedia('(pointer:coarse)').matches || this.host.clientHeight<500){this.quality=Math.min(window.devicePixelRatio,1.25);this.renderer.setPixelRatio(this.quality);this.renderer.shadowMap.enabled=false;this.resize();}
  }
  render(frame: Frame, previous: Frame | null, alpha: number, snapshot: Snapshot, reducedMotion: boolean) {
    if (!this.athletes || this.disposed) return;
    // Recorded ticks jump backwards when replay starts. Discard only that
    // discontinuity; subsequent replay poses interpolate like live poses.
    const samplePrevious = previous && frame.tick >= previous.tick && frame.tick - previous.tick <= 2 ? previous : null;
    const point = samplePrevious ? { x: mix(samplePrevious.ball.x, frame.ball.x, alpha), y: mix(samplePrevious.ball.y, frame.ball.y, alpha), z: mix(samplePrevious.ball.z, frame.ball.z, alpha) } : frame.ball;
    this.ball.position.copy(vec(point)); this.ball.quaternion.set(frame.rotation.x, frame.rotation.y, frame.rotation.z, frame.rotation.w);
    const replaying = snapshot.phase === "replay", changed = this.currentRole !== snapshot.role || this.replaying !== replaying;
    const view = broadcastCamera(frame, snapshot, this.size.width / this.size.height, reducedMotion), desired = vec(view.position);
    if (changed || reducedMotion || !this.frameCount) this.camera.position.copy(desired); else this.camera.position.lerp(desired, 0.1);
    this.camera.fov = view.fov; this.camera.updateProjectionMatrix(); this.camera.lookAt(vec(view.look));
    if(this.teamColors){const [p,o,ps,os]=this.teamColors;const shooting=snapshot.role==='shooting';this.athletes.setKitPalette(shooting?p:o,shooting?o:p,shooting?ps:os,shooting?os:ps);}
    this.athletes.update(frame, samplePrevious, alpha, this.camera, point, reducedMotion, this.mobileCup);
    this.ui.dataset.strikerFrame = String(this.athletes.strikerFrame);
    this.ui.dataset.keeperAnimation = this.athletes.keeperAnimation;
    this.ui.dataset.keeperFrame = String(this.athletes.keeperFrame);
    this.ui.dataset.keeperMotion = this.athletes.keeperMotion;
    this.scene.getObjectByName("nearAdvertising")!.visible = true;
    (this.net.material as THREE.LineBasicMaterial).opacity = 0.27; this.currentRole = snapshot.role; this.replaying = replaying;
    this.crowdMotion(frame.tick / 120, reducedMotion);
    this.target.visible = snapshot.role === "shooting" && ["charging", "runup", "preparation"].includes(snapshot.phase);
    this.target.position.set(snapshot.aim.x, snapshot.aim.y, 0.08); this.target.quaternion.copy(this.camera.quaternion); this.target.getObjectByName("spread")!.scale.setScalar(Math.max(0.12, snapshot.spread));
    const vertices = this.net.geometry.attributes.position;
    for (let i = 0; i < vertices.count; i++) { const x = this.goalPosition[i * 3], y = this.goalPosition[i * 3 + 1], z = this.goalPosition[i * 3 + 2]; const distance = Math.hypot(x - point.x, y - point.y); vertices.setZ(i, snapshot.result?.outcome === "goal" && !reducedMotion ? z - Math.sin(frame.tick * 0.14 + distance * 3) * 0.1 * Math.exp(-distance) : z); } vertices.needsUpdate = true;
    this.renderer.render(this.scene, this.camera);
    const now = performance.now(), delta = now - this.previousTime; this.previousTime = now; this.sampleMs += delta; this.frameCount++;
    if (this.frameCount % 180 === 0) { const average = this.sampleMs / 180; if (average > 27 && this.quality > 0.85) { this.quality = Math.max(0.85, this.quality - 0.2); this.renderer.setPixelRatio(this.quality); this.renderer.shadowMap.enabled = !this.mobileCup && this.quality > 1; this.resize(); } this.sampleMs = 0; this.ui.dataset.drawCalls = String(this.renderer.info.render.calls); this.ui.dataset.fps = (1000 / average).toFixed(1); }
  }
  dispose() {
    this.disposed = true; this.resizeObserver.disconnect(); this.renderer.domElement.removeEventListener("webglcontextlost", this.lost); this.renderer.domElement.removeEventListener("webglcontextrestored", this.restored);
    this.athletes?.dispose(); this.athletes = null;
    const geometries = new Set<THREE.BufferGeometry>(), materials = new Set<THREE.Material>(), textures = new Set<THREE.Texture>();
    this.scene.traverse(o => { if (o instanceof THREE.Mesh || o instanceof THREE.Line) { geometries.add(o.geometry); const mats = Array.isArray(o.material) ? o.material : [o.material]; for (const m of mats) { materials.add(m); for (const value of Object.values(m)) if (value instanceof THREE.Texture) textures.add(value); } } });
    for (const geometry of geometries) geometry.dispose(); for (const mat of materials) mat.dispose(); for (const tex of textures) tex.dispose(); this.renderer.dispose(); this.renderer.domElement.remove();
  }
}
