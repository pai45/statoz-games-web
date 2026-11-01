// Longbow renderer. Draws the engine state; it never changes it.
import * as T from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {BACKSTOP, SWING_LENGTH, TARGET_HEIGHT, arrowsThisEnd, drawAmount, endOf, sightPoint, targetCentre, type Game} from './engine';
import {TARGET_RADIUS} from './levels';

const v = (x = 0, y = 0, z = 0) => new T.Vector3(x, y, z);
const hash = (i: number, seed: number) => {const s = Math.sin(i * 127.1 + seed * 311.7) * 43758.5453; return s - Math.floor(s);};
const ease = (t: number) => t * t * (3 - 2 * t);

type RangeLook = {sky: [string, string]; fog: [number, number]; ground: 'meadow-grass' | 'forest-floor' | 'canyon-sand'; tint: string; lane: string; sun: string; sunPos: [number, number, number]; hemi: [string, string]};
const LOOKS: RangeLook[] = [
  {sky: ['#5f9fd8', '#eef3df'], fog: [70, 260], ground: 'meadow-grass', tint: '#c8e09a', lane: '#d9eaa6', sun: '#fff1d6', sunPos: [-30, 50, 20], hemi: ['#f2f8ff', '#5d7a36']},
  {sky: ['#56809f', '#d6e0cf'], fog: [80, 280], ground: 'forest-floor', tint: '#b9c79a', lane: '#cfdcae', sun: '#ffe9c4', sunPos: [25, 45, 10], hemi: ['#e3efe8', '#3f5530']},
  {sky: ['#4a88c8', '#f5d7a8'], fog: [90, 300], ground: 'canyon-sand', tint: '#f0b98a', lane: '#f3cfa2', sun: '#ffd7a3', sunPos: [-40, 32, 28], hemi: ['#fff0dc', '#8a4a2a']},
];
const PALETTE = {wood: '#7a5634', darkWood: '#4d3420', rope: '#c9b48a', straw: '#d7b866', player: '#c8452d', rival: '#2f7f8c', shaft: '#d9c29a'};

function ringTexture() {
  const size = 512, c = document.createElement('canvas'); c.width = c.height = size;
  const ctx = c.getContext('2d')!, colours = ['#f7f3e8', '#f7f3e8', '#1d1d1f', '#1d1d1f', '#2f8fd1', '#2f8fd1', '#d8432f', '#d8432f', '#f3c43d', '#f3c43d'];
  for (let ring = 0; ring < 10; ring++) {
    const r = size / 2 * (1 - ring / 10);
    ctx.beginPath(); ctx.arc(size / 2, size / 2, r, 0, Math.PI * 2); ctx.fillStyle = colours[ring]; ctx.fill();
    ctx.lineWidth = 2; ctx.strokeStyle = ring === 2 || ring === 3 ? '#f7f3e8' : '#1d1d1f'; ctx.stroke();
  }
  ctx.beginPath(); ctx.arc(size / 2, size / 2, size / 40, 0, Math.PI * 2); ctx.lineWidth = 1.5; ctx.strokeStyle = '#1d1d1f'; ctx.stroke();
  ctx.fillStyle = '#1d1d1f'; ctx.fillRect(size / 2 - 3, size / 2 - 0.5, 6, 1); ctx.fillRect(size / 2 - 0.5, size / 2 - 3, 1, 6);
  const t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; t.anisotropy = 4; return t;
}
function strawTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 256;
  const ctx = c.getContext('2d')!; ctx.fillStyle = '#c9a552'; ctx.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 900; i++) {
    const x = hash(i, 1) * 256, y = hash(i, 2) * 256, a = hash(i, 3) * Math.PI, l = 8 + hash(i, 4) * 22;
    ctx.strokeStyle = ['#e2c473', '#a9853b', '#d8b45c', '#8f6d2e'][i % 4]; ctx.lineWidth = 1 + hash(i, 5);
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); ctx.stroke();
  }
  const t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; t.wrapS = t.wrapT = T.RepeatWrapping; return t;
}
function labelTexture(text: string) {
  const c = document.createElement('canvas'); c.width = 256; c.height = 128;
  const ctx = c.getContext('2d')!; ctx.fillStyle = '#f3e6c4'; ctx.fillRect(0, 0, 256, 128);
  ctx.strokeStyle = '#4d3420'; ctx.lineWidth = 8; ctx.strokeRect(4, 4, 248, 120);
  ctx.fillStyle = '#2b2416'; ctx.font = "700 72px 'Arial Narrow', Arial, sans-serif"; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, 128, 68);
  const t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; return t;
}
function skyMaterial(top: string, bottom: string) {
  return new T.ShaderMaterial({
    side: T.BackSide, depthWrite: false, fog: false,
    uniforms: {top: {value: new T.Color(top)}, bottom: {value: new T.Color(bottom)}},
    vertexShader: 'varying vec3 p; void main(){ p = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: 'uniform vec3 top; uniform vec3 bottom; varying vec3 p; void main(){ float h = clamp(p.y * 1.6 + 0.08, 0.0, 1.0); gl_FragColor = vec4(mix(bottom, top, pow(h, 0.7)), 1.0); }',
  });
}

/** Builds an arrow pointing down its local -Z axis with the tip at the origin. */
function arrowMesh(fletch: string) {
  const group = new T.Group(), length = 0.78;
  const shaft = new T.Mesh(new T.CylinderGeometry(0.0045, 0.0045, length, 6), new T.MeshStandardMaterial({color: PALETTE.shaft, roughness: 0.6}));
  shaft.rotation.x = Math.PI / 2; shaft.position.z = length / 2; group.add(shaft);
  const tip = new T.Mesh(new T.ConeGeometry(0.008, 0.035, 8), new T.MeshStandardMaterial({color: '#8d939a', metalness: 0.6, roughness: 0.35}));
  tip.rotation.x = -Math.PI / 2; tip.position.z = -0.012; group.add(tip);
  const vane = new T.MeshStandardMaterial({color: fletch, roughness: 0.8, side: T.DoubleSide});
  for (let i = 0; i < 3; i++) {
    const shape = new T.Shape(); shape.moveTo(0, 0); shape.lineTo(0.022, 0.03); shape.lineTo(0.022, 0.1); shape.lineTo(0, 0.1);
    const fin = new T.Mesh(new T.ShapeGeometry(shape), vane);
    const holder = new T.Group(); holder.rotation.z = i * Math.PI * 2 / 3; holder.position.z = length - 0.13;
    fin.rotation.y = -Math.PI / 2; fin.rotation.z = Math.PI / 2; fin.position.set(0.004, 0, 0); holder.add(fin); group.add(holder);
  }
  const nock = new T.Mesh(new T.CylinderGeometry(0.006, 0.006, 0.02, 6), new T.MeshStandardMaterial({color: fletch}));
  nock.rotation.x = Math.PI / 2; nock.position.z = length; group.add(nock);
  group.traverse(o => {o.castShadow = true;});
  return group;
}

type Stuck = {mesh: T.Group; born: number; tilt: T.Euler};

export class LongbowView {
  renderer: T.WebGLRenderer;
  scene = new T.Scene();
  camera = new T.PerspectiveCamera(30, 16 / 9, 0.05, 900);
  private view = new T.Scene();
  private viewCamera = new T.PerspectiveCamera(42, 16 / 9, 0.01, 10);
  private observer: ResizeObserver;
  private disposed = false;
  private lowPower: boolean;
  private sky: T.Mesh;
  private skyMat: T.ShaderMaterial;
  private hemi: T.HemisphereLight;
  private sun: T.DirectionalLight;
  private ground!: T.Mesh;
  private lane!: T.Mesh;
  private berm!: T.Mesh;
  private textures: Partial<Record<RangeLook['ground'] | `${RangeLook['ground']}-n`, T.Texture>> = {};
  private models: Record<string, {geometry: T.BufferGeometry; material: T.Material; matrix: T.Matrix4}[]> = {};
  private scenery = new T.Group();
  private rig = new T.Group();
  private face = new T.Group();
  private faceMesh: T.Mesh;
  private flash: T.Mesh;
  private swingPivot = new T.Group();
  private slideRail = new T.Group();
  private swingFrame = new T.Group();
  private standLegs = new T.Group();
  private ropes: T.Mesh[] = [];
  private marker: T.Mesh;
  private flags: {pole: T.Group; cloth: T.Mesh; base: Float32Array}[] = [];
  private flightArrow: T.Group;
  private trail: T.Line;
  private trailPoints: T.Vector3[] = [];
  private stuck: Stuck[] = [];
  private ground_: Stuck[] = [];
  private bow = new T.Group();
  private bowString: T.Line;
  private bowArrow: T.Group;
  private range = -1;
  private laneDistance = -1;
  private targetSize = '';
  private motionKind = '';
  private lastEnd = -1;
  private lastCheckpoint = -1;
  private trauma = 0;
  private flashAge = 9;
  private clock = 0;
  private eye = v(0, 1.6, 0);
  private look = v(0, 1.3, -30);
  private fov = 30;
  private impactFrom: {eye: T.Vector3; look: T.Vector3; fov: number} | null = null;
  private lastPhase = '';
  private lastFlight: {pos: T.Vector3; dir: T.Vector3} | null = null;
  private current: Game | null = null;

  constructor(private canvas: HTMLCanvasElement) {
    this.lowPower = matchMedia('(pointer: coarse)').matches || Math.min(innerWidth, innerHeight) < 500;
    this.renderer = new T.WebGLRenderer({canvas, antialias: true, powerPreference: 'high-performance'});
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, this.lowPower ? 1.25 : 1.6));
    this.renderer.outputColorSpace = T.SRGBColorSpace;
    this.renderer.toneMapping = T.ACESFilmicToneMapping; this.renderer.toneMappingExposure = 1.05;
    this.renderer.shadowMap.enabled = !this.lowPower; this.renderer.shadowMap.type = T.PCFSoftShadowMap;
    this.renderer.autoClear = false;

    this.skyMat = skyMaterial(LOOKS[0].sky[0], LOOKS[0].sky[1]);
    this.sky = new T.Mesh(new T.SphereGeometry(800, 24, 12), this.skyMat); this.scene.add(this.sky);
    this.hemi = new T.HemisphereLight('#ffffff', '#55663a', 1.7); this.scene.add(this.hemi);
    this.sun = new T.DirectionalLight('#fff1d6', 2.6); this.sun.castShadow = !this.lowPower;
    this.sun.shadow.mapSize.set(1024, 1024); this.sun.shadow.bias = -0.0004; this.sun.shadow.normalBias = 0.02;
    const sc = this.sun.shadow.camera; sc.left = -9; sc.right = 9; sc.top = 9; sc.bottom = -9; sc.near = 1; sc.far = 160;
    this.scene.add(this.sun, this.sun.target);
    this.scene.add(this.scenery, this.rig);

    // Target rig: a straw boss on an A-frame; the face group moves for sliding and swinging targets.
    this.faceMesh = new T.Mesh(new T.CircleGeometry(1, 64), new T.MeshStandardMaterial({map: ringTexture(), roughness: 0.85}));
    this.faceMesh.position.z = 0.012; this.faceMesh.receiveShadow = true;
    const boss = new T.Mesh(new T.CylinderGeometry(1.12, 1.12, 0.32, 40), new T.MeshStandardMaterial({map: strawTexture(), roughness: 1}));
    boss.rotation.x = Math.PI / 2; boss.position.z = -0.16; boss.castShadow = boss.receiveShadow = true;
    this.flash = new T.Mesh(new T.RingGeometry(0.9, 1, 64), new T.MeshBasicMaterial({color: '#fff6d8', transparent: true, opacity: 0, depthWrite: false, blending: T.AdditiveBlending}));
    this.flash.position.z = 0.02;
    this.face.add(boss, this.faceMesh, this.flash);
    this.rig.add(this.standLegs, this.slideRail, this.swingFrame, this.swingPivot);
    const wood = new T.MeshStandardMaterial({color: PALETTE.wood, roughness: 0.85});
    const post = (parent: T.Object3D, a: T.Vector3, b: T.Vector3, r = 0.05, material: T.Material = wood) => {
      const m = new T.Mesh(new T.CylinderGeometry(r, r, 1, 8), material), d = b.clone().sub(a);
      m.position.copy(a).add(b).multiplyScalar(0.5); m.scale.y = d.length(); m.quaternion.setFromUnitVectors(v(0, 1, 0), d.normalize());
      m.castShadow = true; parent.add(m); return m;
    };
    post(this.standLegs, v(-0.7, 0, 0.35), v(-0.45, 1.6, -0.25)); post(this.standLegs, v(0.7, 0, 0.35), v(0.45, 1.6, -0.25)); post(this.standLegs, v(0, 0, -1.1), v(0, 1.5, -0.3));
    post(this.slideRail, v(-3.2, 0, -0.5), v(-3.2, 2.2, -0.5), 0.07); post(this.slideRail, v(3.2, 0, -0.5), v(3.2, 2.2, -0.5), 0.07); post(this.slideRail, v(-3.3, 2.2, -0.5), v(3.3, 2.2, -0.5), 0.05);
    const frameTop = TARGET_HEIGHT + SWING_LENGTH + 0.05;
    post(this.swingFrame, v(-2.4, 0, -0.4), v(-2.1, frameTop, -0.4), 0.08); post(this.swingFrame, v(2.4, 0, -0.4), v(2.1, frameTop, -0.4), 0.08); post(this.swingFrame, v(-2.3, frameTop, -0.4), v(2.3, frameTop, -0.4), 0.07);
    const rope = new T.MeshStandardMaterial({color: PALETTE.rope, roughness: 1});
    for (const x of [-0.5, 0.5]) this.ropes.push(post(this.swingPivot, v(x * 0.3, 0, -0.1), v(x, -SWING_LENGTH + 0.9, -0.1), 0.012, rope));

    // Distance marker beside the lane and two wind flags (archer and target end).
    this.marker = new T.Mesh(new T.PlaneGeometry(0.9, 0.45), new T.MeshStandardMaterial({map: labelTexture('30 m'), roughness: 0.9}));
    this.scene.add(this.marker);
    for (let i = 0; i < 2; i++) {
      const pole = new T.Group(); post(pole, v(0, 0, 0), v(0, 4.2, 0), 0.035, new T.MeshStandardMaterial({color: '#e9e2cf'}));
      const geometry = new T.PlaneGeometry(1.2, 0.7, 12, 4); geometry.translate(0.6, 3.75, 0);
      const cloth = new T.Mesh(geometry, new T.MeshStandardMaterial({color: i ? '#c8452d' : '#e2a72e', side: T.DoubleSide, roughness: 0.9}));
      pole.add(cloth); this.scene.add(pole);
      this.flags.push({pole, cloth, base: Float32Array.from(geometry.attributes.position.array as Float32Array)});
    }

    this.flightArrow = arrowMesh(PALETTE.player); this.flightArrow.visible = false; this.scene.add(this.flightArrow);
    const trailGeometry = new T.BufferGeometry().setFromPoints(Array.from({length: 24}, () => v()));
    this.trail = new T.Line(trailGeometry, new T.LineBasicMaterial({color: '#fff7dc', transparent: true, opacity: 0.55}));
    this.trail.frustumCulled = false; this.scene.add(this.trail);

    // First-person bow, rendered in its own pass so camera zoom never distorts it.
    this.view.add(new T.HemisphereLight('#fff8ea', '#3b2c1c', 2.2));
    const key = new T.DirectionalLight('#ffffff', 1.6); key.position.set(-1, 2, 1); this.view.add(key);
    const limb = new T.CatmullRomCurve3([v(0, -0.62, 0.02), v(0, -0.32, -0.07), v(0, 0, -0.09), v(0, 0.32, -0.07), v(0, 0.62, 0.02)]);
    const bowWood = new T.MeshStandardMaterial({color: '#6b4426', roughness: 0.55});
    this.bow.add(new T.Mesh(new T.TubeGeometry(limb, 40, 0.013, 8), bowWood));
    const grip = new T.Mesh(new T.CylinderGeometry(0.018, 0.018, 0.13, 10), new T.MeshStandardMaterial({color: '#2c2118', roughness: 0.9}));
    grip.position.z = -0.09; this.bow.add(grip);
    this.bowString = new T.Line(new T.BufferGeometry().setFromPoints([v(0, 0.62, 0.02), v(0, 0, 0.02), v(0, -0.62, 0.02)]), new T.LineBasicMaterial({color: '#f1ead8'}));
    this.bow.add(this.bowString);
    this.bowArrow = arrowMesh(PALETTE.player); this.bowArrow.position.set(0.012, 0, -0.1); this.bow.add(this.bowArrow);
    this.view.add(this.bow); this.view.add(this.viewCamera);

    this.observer = new ResizeObserver(() => this.resize()); this.observer.observe(canvas); this.resize();
  }

  private resize() {
    const {width, height} = this.canvas.getBoundingClientRect(); if (!width || !height) return;
    this.renderer.setSize(width, height, false);
    this.camera.aspect = this.viewCamera.aspect = width / height;
    this.camera.updateProjectionMatrix(); this.viewCamera.updateProjectionMatrix();
  }

  async loadAssets(base: string) {
    const loader = new GLTFLoader(), textures = new T.TextureLoader();
    const names = ['rock', 'boulder', 'stump', 'shrub', 'fern'] as const;
    const grounds = ['meadow-grass', 'forest-floor', 'canyon-sand'] as const;
    const [gltfs, maps] = await Promise.all([
      Promise.all(names.map(n => loader.loadAsync(`${base}models/${n}.glb`))),
      Promise.all(grounds.flatMap(g => [textures.loadAsync(`${base}textures/${g}-color.jpg`), textures.loadAsync(`${base}textures/${g}-normal.jpg`)])),
    ]);
    if (this.disposed) return;
    grounds.forEach((g, i) => {
      const color = maps[i * 2], normal = maps[i * 2 + 1];
      for (const t of [color, normal]) {t.wrapS = t.wrapT = T.RepeatWrapping; t.anisotropy = 4;}
      color.colorSpace = T.SRGBColorSpace;
      this.textures[g] = color; this.textures[`${g}-n`] = normal;
    });
    names.forEach((n, i) => {
      const parts: {geometry: T.BufferGeometry; material: T.Material; matrix: T.Matrix4}[] = [];
      const root = gltfs[i].scene; root.updateMatrixWorld(true);
      const box = new T.Box3().setFromObject(root), size = box.getSize(v()), centre = box.getCenter(v());
      // Normalise every model to stand on the ground, centred, one metre tall.
      const normalise = new T.Matrix4().makeScale(1 / size.y, 1 / size.y, 1 / size.y).multiply(new T.Matrix4().makeTranslation(-centre.x, -box.min.y, -centre.z));
      root.traverse(o => {if (o instanceof T.Mesh) parts.push({geometry: o.geometry, material: o.material as T.Material, matrix: normalise.clone().multiply(o.matrixWorld)});});
      this.models[n] = parts;
    });
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

  /** Swaps sky, ground and scenery for one of the three ranges. */
  setRange(range: number) {
    if (range === this.range || !this.ground) return;
    this.range = range;
    const look = LOOKS[range];
    this.skyMat.uniforms.top.value.set(look.sky[0]); this.skyMat.uniforms.bottom.value.set(look.sky[1]);
    this.scene.fog = new T.Fog(look.sky[1], look.fog[0], look.fog[1]);
    this.hemi.color.set(look.hemi[0]); this.hemi.groundColor.set(look.hemi[1]);
    this.sun.color.set(look.sun);
    const ground = this.ground.material as T.MeshStandardMaterial, color = this.textures[look.ground]!.clone(), normal = this.textures[`${look.ground}-n`]!.clone();
    color.repeat.set(140, 140); normal.repeat.set(140, 140);
    ground.map?.dispose(); ground.normalMap?.dispose();
    ground.map = color; ground.normalMap = normal; ground.color.set(look.tint); ground.needsUpdate = true;
    const lane = this.lane.material as T.MeshStandardMaterial; lane.color.set(look.lane);
    const berm = this.berm.material as T.MeshStandardMaterial, bermMap = this.textures[look.ground]!.clone(); bermMap.repeat.set(10, 3);
    berm.map?.dispose(); berm.map = bermMap; berm.color.set(look.tint).multiplyScalar(0.85); berm.needsUpdate = true;
    this.buildScenery(range);
    this.laneDistance = -1;
  }

  private instanced(name: string, transforms: T.Matrix4[], tint?: string) {
    for (const part of this.models[name] ?? []) {
      const material = tint ? (part.material as T.MeshStandardMaterial).clone() : part.material;
      if (tint) (material as T.MeshStandardMaterial).color.set(tint);
      const mesh = new T.InstancedMesh(part.geometry, material, transforms.length);
      transforms.forEach((m, i) => mesh.setMatrixAt(i, m.clone().multiply(part.matrix)));
      mesh.castShadow = !this.lowPower; mesh.receiveShadow = true; mesh.userData.ownMaterial = !!tint; mesh.userData.ownGeometry = false;
      this.scenery.add(mesh);
    }
  }
  private place(x: number, z: number, scale: number, turn: number, squash = 1) {
    return new T.Matrix4().compose(v(x, 0, z), new T.Quaternion().setFromAxisAngle(v(0, 1, 0), turn), v(scale, scale * squash, scale));
  }
  private trees(kind: 'round' | 'pine', spots: [number, number, number][]) {
    const trunk = new T.InstancedMesh(new T.CylinderGeometry(0.18, 0.28, 1, 6), new T.MeshStandardMaterial({color: PALETTE.darkWood, roughness: 1}), spots.length);
    const crownGeometry = kind === 'pine' ? new T.ConeGeometry(1, 1, 7) : new T.IcosahedronGeometry(1, 1);
    const crown = new T.InstancedMesh(crownGeometry, new T.MeshStandardMaterial({color: '#ffffff', roughness: 0.95, flatShading: true}), spots.length * (kind === 'pine' ? 3 : 1));
    const greens = kind === 'pine' ? ['#2f5a3c', '#36644a', '#28503a'] : ['#5f8a3e', '#6f9a45', '#4f7b39', '#7d9f4c'];
    let c = 0;
    spots.forEach(([x, z, s], i) => {
      const height = kind === 'pine' ? 9 * s : 4.5 * s;
      trunk.setMatrixAt(i, this.place(x, z, s, 0).multiply(new T.Matrix4().makeScale(1, kind === 'pine' ? 3 : 2.6, 1)).multiply(new T.Matrix4().makeTranslation(0, 0.5, 0)));
      if (kind === 'pine') for (let k = 0; k < 3; k++) {
        const w = (2.6 - k * 0.7) * s, h = (3.6 - k * 0.6) * s;
        crown.setMatrixAt(c, new T.Matrix4().compose(v(x, height * 0.3 + k * 2.1 * s + h / 2, z), new T.Quaternion(), v(w, h, w)));
        crown.setColorAt(c++, new T.Color(greens[(i + k) % 3]));
      } else {
        crown.setMatrixAt(c, new T.Matrix4().compose(v(x, height * 0.75, z), new T.Quaternion().setFromAxisAngle(v(0, 1, 0), i), v(2.6 * s, 2.2 * s, 2.6 * s)));
        crown.setColorAt(c++, new T.Color(greens[i % 4]));
      }
    });
    for (const m of [trunk, crown]) {m.castShadow = !this.lowPower; m.receiveShadow = true; m.userData.ownMaterial = m.userData.ownGeometry = true; this.scenery.add(m);}
  }
  private buildScenery(range: number) {
    for (const child of [...this.scenery.children]) {
      this.scenery.remove(child);
      if (!(child instanceof T.InstancedMesh)) continue;
      if (child.userData.ownGeometry) child.geometry.dispose();
      if (child.userData.ownMaterial) (child.material as T.Material).dispose();
      child.dispose();
    }
    const side = (i: number, seed: number, near: number, far: number) => (hash(i, seed) < 0.5 ? -1 : 1) * (near + hash(i, seed + 1) * (far - near));
    const along = (i: number, seed: number) => 25 - hash(i, seed) * 160;
    if (range === 0) {
      this.trees('round', Array.from({length: 46}, (_, i) => [side(i, 3, 16, 75), along(i, 5), 0.8 + hash(i, 7) * 0.7] as [number, number, number]));
      this.instanced('shrub', Array.from({length: 34}, (_, i) => this.place(side(i, 11, 6, 30), along(i, 13), 0.7 + hash(i, 15) * 0.8, hash(i, 17) * 6)));
      this.instanced('rock', Array.from({length: 14}, (_, i) => this.place(side(i, 19, 8, 40), along(i, 21), 0.5 + hash(i, 23) * 0.8, hash(i, 25) * 6, 0.7)));
      // Hay bales along the lane edge, original geometry.
      const bales = new T.InstancedMesh(new T.CylinderGeometry(0.6, 0.6, 1.1, 18), new T.MeshStandardMaterial({map: strawTexture(), roughness: 1}), 8);
      for (let i = 0; i < 8; i++) bales.setMatrixAt(i, new T.Matrix4().compose(v((i % 2 ? 1 : -1) * (4.5 + hash(i, 31)), 0.6, -8 - i * 9), new T.Quaternion().setFromEuler(new T.Euler(0, hash(i, 33), Math.PI / 2)), v(1, 1, 1)));
      bales.castShadow = !this.lowPower; bales.userData.ownMaterial = bales.userData.ownGeometry = true; this.scenery.add(bales);
    } else if (range === 1) {
      this.trees('pine', Array.from({length: 90}, (_, i) => [side(i, 41, 9, 60), along(i, 43), 0.75 + hash(i, 45) * 0.6] as [number, number, number]));
      this.trees('pine', Array.from({length: 30}, (_, i) => [(hash(i, 51) - 0.5) * 120, -140 - hash(i, 53) * 60, 0.9 + hash(i, 55) * 0.5] as [number, number, number]));
      this.instanced('stump', Array.from({length: 18}, (_, i) => this.place(side(i, 61, 5, 25), along(i, 63), 0.45 + hash(i, 65) * 0.3, hash(i, 67) * 6)));
      this.instanced('fern', Array.from({length: 40}, (_, i) => this.place(side(i, 71, 4.5, 22), along(i, 73), 0.6 + hash(i, 75) * 0.5, hash(i, 77) * 6)));
      this.instanced('rock', Array.from({length: 12}, (_, i) => this.place(side(i, 79, 6, 30), along(i, 81), 0.6 + hash(i, 83) * 0.7, hash(i, 85) * 6, 0.6)), '#b8c2b0');
    } else {
      // Canyon walls: large boulders stretched into cliffs, plus original mesa blocks.
      this.instanced('boulder', Array.from({length: 26}, (_, i) => this.place((i % 2 ? 1 : -1) * (26 + hash(i, 91) * 18), 20 - Math.floor(i / 2) * 14, 9 + hash(i, 93) * 7, hash(i, 95) * 6, 1.3 + hash(i, 97))), '#d9926a');
      this.instanced('rock', Array.from({length: 26}, (_, i) => this.place(side(i, 101, 6, 24), along(i, 103), 0.5 + hash(i, 105) * 1.1, hash(i, 107) * 6, 0.7)), '#e0a37c');
      this.instanced('shrub', Array.from({length: 18}, (_, i) => this.place(side(i, 111, 5, 22), along(i, 113), 0.4 + hash(i, 115) * 0.4, hash(i, 117) * 6)), '#b1a46a');
      const mesa = new T.InstancedMesh(new T.CylinderGeometry(1, 1.15, 1, 7), new T.MeshStandardMaterial({color: '#b9603f', roughness: 1, flatShading: true}), 7);
      for (let i = 0; i < 7; i++) mesa.setMatrixAt(i, new T.Matrix4().compose(v((hash(i, 121) - 0.5) * 260, 14, -180 - hash(i, 123) * 90), new T.Quaternion(), v(18 + hash(i, 125) * 22, 28 + hash(i, 127) * 26, 18 + hash(i, 129) * 18)));
      mesa.userData.ownMaterial = mesa.userData.ownGeometry = true; this.scenery.add(mesa);
    }
  }

  /** Moves the target, lane, marker and flags to a new lane distance and target style. */
  private layoutLane(game: Game) {
    const d = game.distance, kind = game.motion.kind, size = game.config.mode === 'career' ? game.config.level.target : 'standard';
    if (d === this.laneDistance && kind === this.motionKind && size === this.targetSize) return;
    this.laneDistance = d; this.motionKind = kind; this.targetSize = size;
    this.rig.position.set(0, 0, -d);
    const r = TARGET_RADIUS[size]; this.face.scale.setScalar(r);
    this.standLegs.visible = kind === 'none'; this.slideRail.visible = kind === 'slide'; this.swingFrame.visible = this.swingPivot.visible = kind === 'swing';
    this.swingPivot.position.set(0, TARGET_HEIGHT + SWING_LENGTH, 0);
    this.face.removeFromParent(); (kind === 'swing' ? this.swingPivot : this.rig).add(this.face);
    this.lane.scale.z = d + 4; this.lane.position.set(0, 0.01, -d / 2);
    this.berm.position.set(0, 0, -d - BACKSTOP - 2);
    const marker = this.marker.material as T.MeshStandardMaterial; marker.map?.dispose(); marker.map = labelTexture(`${d} m`);
    this.marker.position.set(-3.4, 0.9, -d + 1.5); this.marker.rotation.y = 0.35;
    this.flags[0].pole.position.set(3.2, 0, -4); this.flags[1].pole.position.set(-3.6, 0, -d - 1.5);
    this.sun.position.set(LOOKS[Math.max(0, this.range)].sunPos[0], LOOKS[Math.max(0, this.range)].sunPos[1], -d + LOOKS[Math.max(0, this.range)].sunPos[2]);
    this.sun.target.position.set(0, 0, -d);
  }

  /** Metres on the target plane covered by one CSS pixel at the current zoom. */
  metresPerPixel(distance: number) {
    const height = this.canvas.getBoundingClientRect().height || 1;
    return 2 * distance * Math.tan(T.MathUtils.degToRad(this.camera.fov) / 2) / height;
  }

  private clearArrows() {
    for (const s of [...this.stuck, ...this.ground_]) {s.mesh.removeFromParent(); this.disposeObject(s.mesh);}
    this.stuck = []; this.ground_ = [];
  }
  private syncArrows(game: Game) {
    const end = endOf(game, game.phase === 'impact' ? game.arrowIndex - 1 : game.arrowIndex);
    if (end !== this.lastEnd || game.checkpoint < this.lastCheckpoint) {this.clearArrows(); this.lastEnd = end;}
    this.lastCheckpoint = game.checkpoint;
    const inTarget = arrowsThisEnd(game);
    while (this.stuck.length < inTarget.length) {
      const r = inTarget[this.stuck.length], mesh = arrowMesh(r.shooter === 'player' ? PALETTE.player : PALETTE.rival);
      const tilt = new T.Euler(-0.05 + hash(this.stuck.length, 3) * 0.1, -0.06 + hash(this.stuck.length, 5) * 0.12, 0);
      const s = 1 / this.face.scale.x; mesh.scale.setScalar(s);
      mesh.position.set(r.px * s, r.py * s, 0.02 - 0.18 * s); mesh.rotation.copy(tilt);
      this.face.add(mesh); this.stuck.push({mesh, born: this.clock, tilt});
    }
  }

  draw(game: Game | null, dt: number, reduced: boolean, menuRange = 0) {
    this.clock += dt;
    if (game !== this.current) {this.current = game; this.clearArrows(); this.lastEnd = -1; this.lastCheckpoint = -1; this.trailPoints = []; this.lastPhase = '';}
    if (game) {
      this.setRange(game.config.mode === 'career' ? game.config.level.range : ['wren', 'tamsin', 'odette'].indexOf(game.config.opponent.id));
      this.layoutLane(game); this.syncArrows(game);
    } else {
      this.setRange(menuRange);
      if (this.laneDistance !== 30 || this.motionKind !== 'none') {
        this.laneDistance = 30; this.motionKind = 'none'; this.targetSize = '';
        this.rig.position.set(0, 0, -30); this.face.scale.setScalar(TARGET_RADIUS.standard);
        this.standLegs.visible = true; this.slideRail.visible = this.swingFrame.visible = this.swingPivot.visible = false;
        this.face.removeFromParent(); this.rig.add(this.face);
        this.lane.scale.z = 34; this.lane.position.set(0, 0.01, -15); this.berm.position.set(0, 0, -30 - BACKSTOP - 2);
        this.flags[0].pole.position.set(3.2, 0, -4); this.flags[1].pole.position.set(-3.6, 0, -31.5);
        this.marker.position.set(-3.4, 0.9, -28.5); this.sun.target.position.set(0, 0, -30);
      }
    }
    const distance = game?.distance ?? 30, time = game?.time ?? this.clock;
    // Target motion.
    const centre = game ? targetCentre(game, time) : {x: 0, y: TARGET_HEIGHT};
    if (game?.motion.kind === 'swing') {
      this.swingPivot.rotation.z = Math.asin(Math.max(-1, Math.min(1, centre.x / SWING_LENGTH)));
      this.face.position.set(0, -SWING_LENGTH, 0);
    } else {this.face.position.set(centre.x, centre.y, 0); this.swingPivot.rotation.z = 0;}
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
      this.recolour(this.flightArrow, flight!.shooter === 'player' ? PALETTE.player : PALETTE.rival);
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
      this.flashAge = 0;
      const ring = 10 - game.last.score;
      this.flash.geometry.dispose(); this.flash.geometry = new T.RingGeometry(Math.max(0, ring / 10), (ring + 1) / 10, 64);
      if (game.last.shooter === 'player' && !reduced) this.trauma = Math.min(1, this.trauma + (game.last.score >= 10 ? 0.55 : 0.3));
    }
    this.flashAge += dt;
    (this.flash.material as T.MeshBasicMaterial).opacity = reduced ? 0 : Math.max(0, 0.85 - this.flashAge * 1.6);

    this.updateCamera(game, centre, distance, dt, reduced);
    this.updateBow(game, dt);
    this.lastPhase = game?.phase ?? '';

    this.renderer.clear();
    this.renderer.render(this.scene, this.camera);
    if (this.bow.visible) {this.renderer.clearDepth(); this.renderer.render(this.view, this.viewCamera);}
  }

  private recolour(arrow: T.Group, colour: string) {
    arrow.traverse(o => {if (o instanceof T.Mesh && (o.material as T.MeshStandardMaterial).side === T.DoubleSide) (o.material as T.MeshStandardMaterial).color.set(colour);});
  }

  private updateCamera(game: Game | null, centre: {x: number; y: number}, distance: number, dt: number, reduced: boolean) {
    const aimFov = (d: number, zoom: number) => T.MathUtils.lerp(32, T.MathUtils.radToDeg(2 * Math.atan(2.6 / d)), ease(Math.min(1, zoom)));
    let eye = v(0, 1.62, 0.15), look: T.Vector3, fov: number;
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
    } else if (phase === 'flight' && game.cinematic && !reduced && this.lastFlight) {
      const {pos, dir} = this.lastFlight;
      eye = pos.clone().addScaledVector(dir, -1.4).add(v(0.25, 0.22, 0)); look = pos.clone().addScaledVector(dir, 5); fov = 40;
    } else if (game.turn === 'ai' && (phase === 'ai-aim' || phase === 'flight')) {
      eye = v(1.2, 1.7, 0.4); look = v(centre.x, centre.y, -distance); fov = aimFov(distance, 0.75);
    } else {
      const sight = sightPoint(game), zoom = phase === 'flight' ? 1 : drawAmount(game);
      // While a normal shot flies the view holds still, so the arrow is seen arriving.
      look = phase === 'flight' ? this.look.clone() : v(sight.x, sight.y, -distance); fov = phase === 'flight' ? this.fov : aimFov(distance, zoom);
    }
    if (phase !== 'impact') this.impactFrom = null;
    this.eye.copy(eye); this.look.copy(look); this.fov = fov;
    this.camera.position.copy(eye); this.camera.fov = fov; this.camera.updateProjectionMatrix(); this.camera.lookAt(look);
    // Camera-only shake from a decaying trauma value; never touches the simulation.
    this.trauma = Math.max(0, this.trauma - dt * 1.6);
    if (this.trauma > 0 && !reduced) {
      const s = this.trauma * this.trauma * 0.012;
      this.camera.rotation.x += s * Math.sin(this.clock * 47); this.camera.rotation.y += s * Math.sin(this.clock * 39 + 1.3); this.camera.rotation.z += s * 0.5 * Math.sin(this.clock * 31 + 2.1);
    }
  }

  private updateBow(game: Game | null, dt: number) {
    const aiming = !!game && game.turn === 'player' && (game.phase === 'ready' || game.phase === 'drawing' || (game.phase === 'flight' && !game.cinematic));
    this.bow.visible = aiming;
    if (!aiming || !game) return;
    const draw = ease(drawAmount(game)), released = game.phase === 'flight';
    // A right-handed archer's bow: held low and left, canted, and lowered further at full draw so the
    // sight picture stays clear. The arrow stays parallel to the view, so it points at the sight.
    const target = v(-0.34 + 0.06 * draw, -0.36 - 0.12 * draw, -1.15);
    this.bow.position.lerp(target, Math.min(1, dt * 14));
    this.bow.rotation.set(0, 0, -0.32 + 0.08 * draw);
    const nock = released ? 0.02 : 0.02 + draw * 0.5;
    const string = this.bowString.geometry.attributes.position as T.BufferAttribute;
    string.setXYZ(1, 0, 0, nock); string.needsUpdate = true;
    this.bowArrow.visible = !released;
    this.bowArrow.position.set(0.012, 0, nock - 0.78);
  }

  inspect() {
    return {drawCalls: this.renderer.info.render.calls, triangles: this.renderer.info.render.triangles, fov: this.camera.fov, eye: this.camera.position.toArray(), lowPower: this.lowPower, bow: this.bow.visible, stuckArrows: this.stuck.length, groundArrows: this.ground_.length, faceChildren: this.face.children.length, range: this.range};
  }

  private disposeObject(root: T.Object3D) {
    root.traverse(o => {
      if (o instanceof T.Mesh || o instanceof T.Line) {
        o.geometry.dispose();
        for (const m of Array.isArray(o.material) ? o.material : [o.material]) {for (const value of Object.values(m)) if (value instanceof T.Texture) value.dispose(); m.dispose();}
      }
    });
  }
  dispose() {
    this.disposed = true; this.observer.disconnect();
    this.disposeObject(this.scene); this.disposeObject(this.view);
    for (const parts of Object.values(this.models)) for (const p of parts) {p.geometry.dispose(); p.material.dispose();}
    for (const t of Object.values(this.textures)) t?.dispose();
    this.renderer.dispose(); this.renderer.forceContextLoss();
  }
}
