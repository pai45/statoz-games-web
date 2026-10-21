import * as THREE from "three";
import { GLTFLoader, type GLTF } from "three/addons/loaders/GLTFLoader.js";
import { clone } from "three/addons/utils/SkeletonUtils.js";
import { publicAsset } from "@/shared/config/base-path";
import { GOAL, type Frame, type Snapshot, type Vec3 } from "../game-types";
import { mix } from "../engine/rules";
import { applyCharacterPose } from "../animation/character";
import { buildStadium } from "./stadium";
import { broadcastCamera } from "./camera";

const colors = { sky: 0xaab5bb, haze: 0xc1c7c5, white: 0xe8e9dc, marker: 0xe9e7c8 };
const vec = (v: Vec3) => new THREE.Vector3(v.x, v.y, v.z);
type Athlete = { nodes: Map<string, THREE.Object3D>; keeping: boolean; preset: number; group: THREE.Group; mixer: THREE.AnimationMixer; actions: Map<string, THREE.AnimationAction>; current: string; bones: Map<string, THREE.Bone> };
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
  private shooter!: Athlete;
  private keeper!: Athlete;
  private model: GLTF | null = null;
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
    const low = this.size.width < 1000 || navigator.hardwareConcurrency <= 4;
    const model = await new GLTFLoader().loadAsync(publicAsset("/assets/games/penalty-shootout/" + (low ? "athlete-low.glb" : "athlete.glb")));
    if (this.disposed) { model.scene.traverse(o => { if (o instanceof THREE.Mesh) o.geometry.dispose(); }); return; }
    if (!model.animations.some(a => a.name === "kick_driven")) throw new Error("Athlete animation clips are missing");
    let missingTexture = false;
    model.scene.traverse(object => { if (object instanceof THREE.Mesh) for (const material of Array.isArray(object.material) ? object.material : [object.material]) if (["Skin", "Jersey", "Socks"].includes(material.name) && !(material as THREE.MeshStandardMaterial).map) missingTexture = true; });
    if (missingTexture) throw new Error("Character textures could not load. Please retry the pitch.");
    for (const bone of ["hips", "head", "hand_L", "hand_R", "foot_L", "foot_R"]) if (!model.scene.getObjectByName(bone)) throw new Error("Character skeleton is incomplete");
    this.model = model; this.shooter = this.athlete(model, false); this.keeper = this.athlete(model, true);
  }
  private athlete(model: GLTF, keeping: boolean): Athlete {
    const group = new THREE.Group(), character = clone(model.scene), bones = new Map<string, THREE.Bone>(), nodes = new Map<string, THREE.Object3D>(); group.add(character); this.scene.add(group);
    const kit = canvasTexture(256, 256, ctx => {
      ctx.fillStyle = keeping ? "#c8af58" : "#e8e7df"; ctx.fillRect(0, 0, 256, 256);
      ctx.strokeStyle = keeping ? "#af984e" : "#d1d4c9"; ctx.lineWidth = 0.7; for (let y = 0; y < 256; y += 4) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(256, y); ctx.stroke(); }
      ctx.fillStyle = keeping ? "#27332e" : "#34474b"; ctx.fillRect(0, 28, 256, 12); ctx.fillRect(0, 212, 256, 6);
      ctx.font = "bold 50px sans-serif"; ctx.textAlign = "center"; ctx.fillText(keeping ? "1" : "9", 128, 165);
    });
    character.traverse(o => {
      nodes.set(o.name, o);
      if (o.name.startsWith("Glove")) o.visible = keeping;
      if (o instanceof THREE.Bone) bones.set(o.name, o);
      if (o instanceof THREE.Mesh) {
        o.castShadow = true; o.receiveShadow = true; o.frustumCulled = false;
        const convert = (m: THREE.Material) => {
          const mat = (m as THREE.MeshStandardMaterial).clone();
          const palette: Record<string, number> = keeping
            ? { Jersey: 0x456350, JerseyPanel: 0xd4b66c, JerseyVent: 0x304b3c, Shorts: 0x243b30, Socks: 0x456350, Trim: 0xd4b66c, GloveBack: 0x365345, BootAccent: 0xd4b66c }
            : { Jersey: 0xe8e7df, JerseyPanel: 0x263b4c, JerseyVent: 0xc3c9c5, Shorts: 0x263b4c, Socks: 0xe8e7df, Trim: 0x9b653d, BootAccent: 0xb65e36 };
          if (m.name === "Jersey") mat.map ??= kit;
          if (palette[m.name] !== undefined) mat.color.setHex(palette[m.name]);
          if (m.name === "Gloves" || m.name === "GloveBack") mat.visible = keeping;
          if (m.name === "Skin") { mat.color.setHex(0x9f7354); mat.roughness = .72; }
          return mat;
        };
        o.material = Array.isArray(o.material) ? o.material.map(convert) : convert(o.material);
      }
    });
    group.updateMatrixWorld(true);
    const numberMap = canvasTexture(128, 192, ctx => { ctx.clearRect(0, 0, 128, 192); ctx.fillStyle = "#203139"; ctx.font = "bold 160px Arial"; ctx.textAlign = "center"; ctx.fillText(keeping ? "1" : "9", 64, 160); });
    const number = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 0.28), new THREE.MeshStandardMaterial({ map: numberMap, transparent: true, roughness: 0.85, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -1 }));
    number.position.set(0, 1.31, -0.17); number.rotation.y = Math.PI; group.add(number); group.updateMatrixWorld(true); bones.get("chest")?.attach(number);
    // Original club identity: a sewn shield and back lettering, no real brands.
    const badgeMap = canvasTexture(256, 256, ctx => {
      ctx.clearRect(0, 0, 256, 256); ctx.fillStyle = keeping ? "#d4b66c" : "#263b4c";
      ctx.beginPath(); ctx.moveTo(46, 25); ctx.lineTo(210, 25); ctx.lineTo(198, 165); ctx.quadraticCurveTo(170, 205, 128, 232); ctx.quadraticCurveTo(86, 205, 58, 165); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = "#e8e7df"; ctx.lineWidth = 6; ctx.stroke(); ctx.fillStyle = keeping ? "#243b30" : "#e8e7df"; ctx.font = "bold 68px Arial"; ctx.textAlign = "center"; ctx.fillText("AC", 128, 120); ctx.font = "26px Arial"; ctx.fillText("ATHLETIC", 128, 159);
    });
    const badge = new THREE.Mesh(new THREE.PlaneGeometry(.072, .082), new THREE.MeshStandardMaterial({ map: badgeMap, transparent: true, roughness: .95, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 }));
    badge.position.set(-.085, 1.40, .16); group.add(badge); group.updateMatrixWorld(true); bones.get("chest")?.attach(badge);
    const nameMap = canvasTexture(512, 96, ctx => { ctx.clearRect(0, 0, 512, 96); ctx.fillStyle = keeping ? "#e8e7df" : "#263b4c"; ctx.textAlign = "center"; ctx.font = "bold 48px Arial"; ctx.fillText(keeping ? "WARD" : "MORGAN", 256, 64); });
    const lettering = new THREE.Mesh(new THREE.PlaneGeometry(.25, .047), new THREE.MeshStandardMaterial({ map: nameMap, transparent: true, roughness: .95, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -1 }));
    lettering.position.set(0, 1.48, -.142); lettering.rotation.y = Math.PI; group.add(lettering); group.updateMatrixWorld(true); bones.get("chest")?.attach(lettering);
    const mixer = new THREE.AnimationMixer(character), actions = new Map<string, THREE.AnimationAction>();
    for (const clip of model.animations) { const action = mixer.clipAction(clip); action.play(); action.enabled = false; actions.set(clip.name, action); }
    return { group, mixer, actions, current: "", bones, nodes, keeping, preset: -1 };
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
  render(frame: Frame, previous: Frame | null, alpha: number, snapshot: Snapshot, reducedMotion: boolean) {
    if (!this.shooter || this.disposed) return;
    // Recorded ticks jump backwards when replay starts. Discard only that
    // discontinuity; subsequent replay poses interpolate like live poses.
    const samplePrevious = previous && frame.tick >= previous.tick && frame.tick - previous.tick <= 2 ? previous : null;
    const point = samplePrevious ? { x: mix(samplePrevious.ball.x, frame.ball.x, alpha), y: mix(samplePrevious.ball.y, frame.ball.y, alpha), z: mix(samplePrevious.ball.z, frame.ball.z, alpha) } : frame.ball;
    this.ball.position.copy(vec(point)); this.ball.quaternion.set(frame.rotation.x, frame.rotation.y, frame.rotation.z, frame.rotation.w);
    const update = (athlete: Athlete, pose: Frame["shooterPose"], last: Frame["shooterPose"] | undefined) => {
      applyCharacterPose(athlete.group, athlete.nodes, pose, last, alpha);
      athlete.group.traverse(object => {
        if (object.name.startsWith("HairPreset_")) object.visible = Number(object.name.match(/HairPreset_(\d)/)?.[1]) === pose.preset;
        if (!(object instanceof THREE.Mesh)) return;
        if (object.morphTargetDictionary && object.morphTargetInfluences) {
          for (const [name, index] of Object.entries(object.morphTargetDictionary)) object.morphTargetInfluences[index] = name.startsWith("FacePreset_") ? Number(name.slice(-1)) === pose.preset ? 1 : 0 : name === "Blink" ? pose.blink : name === "LookLeft" ? Math.max(0, -Math.sin(pose.time * 1.4 + pose.preset)) * .6 : name === "LookRight" ? Math.max(0, Math.sin(pose.time * 1.4 + pose.preset)) * .6 : name === "Smile" ? pose.expression === "smile" ? .7 : 0 : name === "Tension" ? pose.expression === "tension" ? .6 : 0 : 0;
        }
        if (athlete.preset !== pose.preset) for (const material of Array.isArray(object.material) ? object.material : [object.material]) if (material.name === "Skin") (material as THREE.MeshStandardMaterial).color.setHex([0xad805c, 0x80533a, 0xc39470, 0x60432f][pose.preset]);
      }); athlete.preset = pose.preset;
    };
    update(this.shooter, frame.shooterPose, samplePrevious?.shooterPose); update(this.keeper, frame.keeperPose, samplePrevious?.keeperPose);
    const replaying = snapshot.phase === "replay", changed = this.currentRole !== snapshot.role || this.replaying !== replaying;
    const view = broadcastCamera(frame, snapshot, this.size.width / this.size.height, reducedMotion), desired = vec(view.position);
    if (changed || reducedMotion || !this.frameCount) this.camera.position.copy(desired); else this.camera.position.lerp(desired, 0.1);
    this.camera.fov = view.fov; this.camera.updateProjectionMatrix(); this.camera.lookAt(vec(view.look));
    this.scene.getObjectByName("nearAdvertising")!.visible = snapshot.role !== "keeping" || replaying;
    (this.net.material as THREE.LineBasicMaterial).opacity = snapshot.role === "keeping" && !replaying ? 0.045 : 0.27; this.currentRole = snapshot.role; this.replaying = replaying;
    this.crowdMotion(frame.tick / 120, reducedMotion);
    this.target.visible = snapshot.role === "shooting" && ["charging", "runup", "preparation"].includes(snapshot.phase);
    this.target.position.set(snapshot.aim.x, snapshot.aim.y, 0.08); this.target.quaternion.copy(this.camera.quaternion); this.target.getObjectByName("spread")!.scale.setScalar(Math.max(0.12, snapshot.spread));
    const vertices = this.net.geometry.attributes.position;
    for (let i = 0; i < vertices.count; i++) { const x = this.goalPosition[i * 3], y = this.goalPosition[i * 3 + 1], z = this.goalPosition[i * 3 + 2]; const distance = Math.hypot(x - point.x, y - point.y); vertices.setZ(i, snapshot.result?.outcome === "goal" && !reducedMotion ? z - Math.sin(frame.tick * 0.14 + distance * 3) * 0.1 * Math.exp(-distance) : z); } vertices.needsUpdate = true;
    this.renderer.render(this.scene, this.camera);
    const now = performance.now(), delta = now - this.previousTime; this.previousTime = now; this.sampleMs += delta; this.frameCount++;
    if (this.frameCount % 180 === 0) { const average = this.sampleMs / 180; if (average > 27 && this.quality > 0.85) { this.quality = Math.max(0.85, this.quality - 0.2); this.renderer.setPixelRatio(this.quality); this.renderer.shadowMap.enabled = this.quality > 1; this.resize(); } this.sampleMs = 0; this.ui.dataset.drawCalls = String(this.renderer.info.render.calls); this.ui.dataset.fps = (1000 / average).toFixed(1); }
  }
  dispose() {
    this.disposed = true; this.resizeObserver.disconnect(); this.renderer.domElement.removeEventListener("webglcontextlost", this.lost); this.renderer.domElement.removeEventListener("webglcontextrestored", this.restored);
    const geometries = new Set<THREE.BufferGeometry>(), materials = new Set<THREE.Material>(), textures = new Set<THREE.Texture>();
    this.scene.traverse(o => { if (o instanceof THREE.Mesh || o instanceof THREE.Line) { geometries.add(o.geometry); const mats = Array.isArray(o.material) ? o.material : [o.material]; for (const m of mats) { materials.add(m); for (const value of Object.values(m)) if (value instanceof THREE.Texture) textures.add(value); } } });
    for (const geometry of geometries) geometry.dispose(); for (const mat of materials) mat.dispose(); for (const tex of textures) tex.dispose(); this.renderer.dispose(); this.renderer.domElement.remove();
    void this.model;
  }
}
