// The four Rim Rush venues. Geometry, crowds and canvas art are original; floor and wall textures are CC0 (see PROVENANCE.json).
import * as T from 'three';
import {mergeGeometries} from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import {BOARD_X, CUPS, HOOP_X, SPOTS, WALL_X, type CourtId} from './levels';
import {Crowd, row, type Seat} from './crowd';

export type TextureSet = Partial<Record<string, T.Texture>>;
export type Venue = {
  group: T.Group; background: T.Color; fog: T.Fog | null; exposure: number;
  hemi: [string, string, number]; sun: [string, number, [number, number, number]];
  /** Back light that outlines the players against the background. */
  rim: [string, number];
  crowds: Crowd[];
  /** Called every frame with the elapsed time and the live score (the gym and arena boards show it). */
  update: (t: number, score: [number, number] | null, clock: string) => void;
  dispose: () => void;
};

const hash = (i: number, seed: number) => {const s = Math.sin(i * 127.1 + seed * 311.7) * 43758.5453; return s - Math.floor(s);};
const canvas = (w: number, h: number) => {const c = document.createElement('canvas'); c.width = w; c.height = h; return [c, c.getContext('2d')!] as const;};
const tex = (c: HTMLCanvasElement, srgb = true) => {const t = new T.CanvasTexture(c); if (srgb) t.colorSpace = T.SRGBColorSpace; t.anisotropy = 4; return t;};
const DISPLAY = "'Lilita One', 'Arial Black', Impact, sans-serif";
const std = (color: string, roughness = 0.8, extra: T.MeshStandardMaterialParameters = {}) => new T.MeshStandardMaterial({color, roughness, ...extra});
function box(parent: T.Object3D, w: number, h: number, d: number, mat: T.Material, x: number, y: number, z: number, shadow = false) {
  const m = new T.Mesh(new T.BoxGeometry(w, h, d), mat); m.position.set(x, y, z); m.castShadow = shadow; m.receiveShadow = true; parent.add(m); return m;
}
function cyl(parent: T.Object3D, r0: number, r1: number, h: number, mat: T.Material, x: number, y: number, z: number, seg = 12) {
  const m = new T.Mesh(new T.CylinderGeometry(r0, r1, h, seg), mat); m.position.set(x, y, z); parent.add(m); return m;
}

type Palette = {key: string; lines: string; centre: string; spot: [string, string]};
const PALETTES: Record<CourtId, Palette> = {
  rooftop: {key: '#2a7a72', lines: '#f4efe2', centre: '#e8774a', spot: ['#f08a24', '#f4efe2']},
  gym: {key: '#1f6f4a', lines: '#fbf6ea', centre: '#c8843a', spot: ['#f08a24', '#1f6f4a']},
  boardwalk: {key: '#2c6e9b', lines: '#ffffff', centre: '#f2c14e', spot: ['#f08a24', '#2c6e9b']},
  arena: {key: '#8f2d26', lines: '#f6efe0', centre: '#e6b422', spot: ['#f08a24', '#e6b422']},
};
export const COURT_W = 13.6, COURT_Z0 = -3.1, COURT_Z1 = 2.7;

/** Painted lines, keys and shooting spots on a transparent canvas laid over the floor. */
function markings(p: Palette) {
  const W = COURT_W, D = COURT_Z1 - COURT_Z0, px = 150, [c, x] = canvas(Math.round(W * px), Math.round(D * px));
  const X = (m: number) => (m + W / 2) * px, Z = (m: number) => (m - COURT_Z0) * px, base = HOOP_X + 0.9;
  x.lineWidth = 0.06 * px; x.strokeStyle = p.lines; x.lineJoin = 'round';
  // Keys.
  for (const s of [-1, 1]) {
    const x0 = X(s * base), x1 = X(s * (base - 2.3));
    x.fillStyle = p.key; x.fillRect(Math.min(x0, x1), Z(-1.5), Math.abs(x1 - x0), Z(1.5) - Z(-1.5));
    x.strokeRect(Math.min(x0, x1), Z(-1.5), Math.abs(x1 - x0), Z(1.5) - Z(-1.5));
    x.beginPath(); x.ellipse(x1, Z(0), 1.2 * px, 1.2 * px, 0, s > 0 ? Math.PI / 2 : -Math.PI / 2, s > 0 ? Math.PI * 1.5 : Math.PI / 2); x.stroke();
    // Three-point arc around the hoop, clipped to the court.
    x.save(); x.beginPath(); x.rect(X(-W / 2), Z(COURT_Z0 + 0.25), W * px, (D - 0.5) * px); x.clip();
    x.beginPath(); x.ellipse(X(s * HOOP_X), Z(0), 3.25 * px, 3.25 * px, 0, 0, Math.PI * 2); x.stroke(); x.restore();
    x.beginPath(); x.moveTo(X(s * base), Z(COURT_Z0 + 0.25)); x.lineTo(X(s * base), Z(COURT_Z1 - 0.25)); x.stroke();
  }
  // Boundary, centre line and circle.
  x.strokeRect(X(-base), Z(COURT_Z0 + 0.25), (base * 2) * px, (D - 0.5) * px);
  x.beginPath(); x.moveTo(X(0), Z(COURT_Z0 + 0.25)); x.lineTo(X(0), Z(COURT_Z1 - 0.25)); x.stroke();
  x.fillStyle = p.centre; x.beginPath(); x.arc(X(0), Z(0), 1.0 * px, 0, Math.PI * 2); x.fill(); x.stroke();
  x.beginPath(); x.arc(X(0), Z(0), 0.35 * px, 0, Math.PI * 2); x.stroke();
  // Shooting spots.
  for (const [i, s] of [[0, -1], [1, 1]] as const) for (const m of SPOTS) {
    x.fillStyle = p.spot[i]; x.globalAlpha = 0.9; x.beginPath(); x.arc(X(s * m), Z(0), 0.2 * px, 0, Math.PI * 2); x.fill();
    x.globalAlpha = 1; x.lineWidth = 0.03 * px; x.strokeStyle = p.lines; x.stroke(); x.lineWidth = 0.06 * px;
  }
  const t = tex(c); t.anisotropy = 8; return t;
}

function skyDome(stops: [number, string][], sunDir: T.Vector3 | null, sunColor = '#fff1d0') {
  const [c, x] = canvas(4, 512), g = x.createLinearGradient(0, 0, 0, 512);
  for (const [at, col] of stops) g.addColorStop(at, col);
  x.fillStyle = g; x.fillRect(0, 0, 4, 512);
  const m = new T.ShaderMaterial({
    side: T.BackSide, depthWrite: false, fog: false,
    uniforms: {grad: {value: tex(c)}, sun: {value: sunDir ?? new T.Vector3(0, -1, 0)}, sunColor: {value: new T.Color(sunColor)}},
    vertexShader: 'varying vec3 p; void main(){ p = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: `uniform sampler2D grad; uniform vec3 sun; uniform vec3 sunColor; varying vec3 p;
      void main(){ float h = clamp(1.0 - (p.y * 0.5 + 0.5 - 0.35) / 0.65, 0.0, 1.0); vec3 c = texture2D(grad, vec2(0.5, h)).rgb;
      float s = max(dot(normalize(p), normalize(sun)), 0.0); c += sunColor * (pow(s, 600.0) * 1.5 + pow(s, 12.0) * 0.25);
      gl_FragColor = vec4(c, 1.0); }`,
  });
  return new T.Mesh(new T.SphereGeometry(400, 32, 16), m);
}

function floorMaterial(textures: TextureSet, name: string, repeat: number, roughness: number, tint = '#ffffff') {
  const m = new T.MeshStandardMaterial({color: tint, roughness, metalness: 0});
  const map = textures[`${name}-color`]?.clone(), normal = textures[`${name}-normal`]?.clone();
  if (map) {map.wrapS = map.wrapT = T.RepeatWrapping; map.repeat.set(repeat, repeat * 0.5); map.colorSpace = T.SRGBColorSpace; map.needsUpdate = true; m.map = map;}
  if (normal) {normal.wrapS = normal.wrapT = T.RepeatWrapping; normal.repeat.copy(map?.repeat ?? new T.Vector2(1, 1)); normal.needsUpdate = true; m.normalMap = normal; m.normalScale.set(0.6, 0.6);}
  return m;
}

/** Shared pieces: floor, markings and a near edge so the court reads as a stage. */
function courtBase(group: T.Group, textures: TextureSet, id: CourtId, floor: {name: string; repeat: number; roughness: number; tint?: string; width?: number; depth?: number}) {
  const w = floor.width ?? 40, d = floor.depth ?? 26;
  const ground = new T.Mesh(new T.PlaneGeometry(w, d), floorMaterial(textures, floor.name, w / 3, floor.roughness, floor.tint));
  ground.rotation.x = -Math.PI / 2; ground.position.z = -d / 2 + 6; ground.receiveShadow = true; group.add(ground);
  const linesMat = new T.MeshStandardMaterial({map: markings(PALETTES[id]), transparent: true, roughness: floor.roughness * 0.8, polygonOffset: true, polygonOffsetFactor: -2, depthWrite: false});
  const lines = new T.Mesh(new T.PlaneGeometry(COURT_W, COURT_Z1 - COURT_Z0), linesMat);
  lines.rotation.x = -Math.PI / 2; lines.position.set(0, 0.002, (COURT_Z0 + COURT_Z1) / 2); lines.receiveShadow = true; group.add(lines);
  return {ground, lines};
}

/** Basket stanchion, backboard frame and padding. The rim and net are drawn by the renderer. */
export function stanchion(side: -1 | 1, accent: string) {
  const g = new T.Group(), pad = new T.MeshStandardMaterial({color: accent, roughness: 0.6}), steel = new T.MeshStandardMaterial({color: '#3b3f45', roughness: 0.35, metalness: 0.7});
  const base = new T.Mesh(new T.BoxGeometry(0.7, 0.55, 1.3), pad); base.position.set(side * (BOARD_X + 0.95), 0.275, -0.25); base.castShadow = base.receiveShadow = true; g.add(base);
  const pole = new T.Mesh(new T.CylinderGeometry(0.08, 0.09, 3.4, 16), steel); pole.position.set(side * (BOARD_X + 0.92), 1.95, -0.25); pole.castShadow = true; g.add(pole);
  const polePad = new T.Mesh(new T.CylinderGeometry(0.14, 0.14, 1.6, 16), pad); polePad.position.set(side * (BOARD_X + 0.92), 1.35, -0.25); polePad.castShadow = true; g.add(polePad);
  const arm = new T.Mesh(new T.BoxGeometry(0.95, 0.09, 0.12), steel); arm.position.set(side * (BOARD_X + 0.47), 3.62, -0.15); arm.rotation.z = side * 0.08; arm.castShadow = true; g.add(arm);
  const brace = new T.Mesh(new T.BoxGeometry(0.06, 0.6, 0.06), steel); brace.position.set(side * (BOARD_X + 0.6), 3.3, -0.15); brace.rotation.z = side * 0.9; g.add(brace);
  // Glass board seen almost edge-on: a frame with a faint face.
  const glass = new T.Mesh(new T.BoxGeometry(0.05, 1.05, 1.8), new T.MeshPhysicalMaterial({color: '#dff3ff', roughness: 0.05, transmission: 0, transparent: true, opacity: 0.28, metalness: 0, depthWrite: false}));
  glass.position.set(side * BOARD_X, 3.425, 0); g.add(glass);
  const frameMat = new T.MeshStandardMaterial({color: '#f4efe4', roughness: 0.4});
  for (const [y, h] of [[2.9, 0.05], [3.95, 0.05]]) {const bar = new T.Mesh(new T.BoxGeometry(0.07, h, 1.82), frameMat); bar.position.set(side * BOARD_X, y, 0); bar.castShadow = true; g.add(bar);}
  for (const z of [-0.9, 0.9]) {const bar = new T.Mesh(new T.BoxGeometry(0.07, 1.1, 0.05), frameMat); bar.position.set(side * BOARD_X, 3.425, z); g.add(bar);}
  const square = new T.Mesh(new T.BoxGeometry(0.075, 0.45, 0.6), new T.MeshBasicMaterial({color: '#f4efe4', wireframe: true})); square.position.set(side * BOARD_X, 3.3, 0); g.add(square);
  const bottomPad = new T.Mesh(new T.BoxGeometry(0.12, 0.08, 1.84), pad); bottomPad.position.set(side * BOARD_X, 2.86, 0); g.add(bottomPad);
  const bracket = new T.Mesh(new T.BoxGeometry(0.16, 0.05, 0.12), steel); bracket.position.set(side * (HOOP_X + 0.3), 3.03, 0); g.add(bracket);
  return g;
}

const rgba = (hex: string, a: number) => {const c = new T.Color(hex); return `rgba(${Math.round(c.r * 255)},${Math.round(c.g * 255)},${Math.round(c.b * 255)},${a})`;};

/** Soft cumulus painted on an open ring around the venue: soft puffs, lit tops and shaded bases. */
function cloudRing(radius: number, y: number, height: number, light: string, shadow: string, seed: number, count: number, repeat = 2) {
  const W = 2048, H = 256, [c, x] = canvas(W, H);
  for (let i = 0; i < count; i++) {
    const cx = hash(i, seed) * W, base = 170 + hash(i, seed + 1) * 50, w = 110 + hash(i, seed + 2) * 240;
    for (let k = 0; k < 11; k++) {
      const n = i * 11 + k, px = cx + (hash(n, seed + 3) - 0.5) * w, r = w * (0.14 + hash(n, seed + 5) * 0.16);
      const py = base - r * 0.6 - hash(n, seed + 4) * w * 0.22;
      for (const dx of [0, -W, W]) {
        const g = x.createRadialGradient(px + dx, py - r * 0.35, r * 0.1, px + dx, py, r);
        g.addColorStop(0, rgba(light, 0.9)); g.addColorStop(0.45, rgba(light, 0.6)); g.addColorStop(0.8, rgba(shadow, 0.22)); g.addColorStop(1, rgba(shadow, 0));
        x.fillStyle = g; x.beginPath(); x.arc(px + dx, py, r, 0, Math.PI * 2); x.fill();
      }
    }
  }
  const t = tex(c); t.wrapS = T.RepeatWrapping; t.repeat.set(repeat, 1);
  const ring = new T.Mesh(new T.CylinderGeometry(radius, radius, height, 64, 1, true), new T.MeshBasicMaterial({map: t, transparent: true, depthWrite: false, fog: false, side: T.BackSide}));
  ring.position.y = y; ring.renderOrder = -1;
  return ring;
}

/** Lit-window facade: dark wall with a grid of windows, some lit. One texture serves every building. */
function windowTexture(seed: number, lit: number, warm: string, cool: string) {
  const [c, x] = canvas(128, 128);
  x.fillStyle = '#000'; x.fillRect(0, 0, 128, 128);
  for (let r = 0; r < 8; r++) for (let k = 0; k < 8; k++) {
    const n = r * 8 + k;
    if (hash(n, seed) > lit) {x.fillStyle = '#16121c'; x.fillRect(k * 16 + 4, r * 16 + 4, 8, 9); continue;}
    x.fillStyle = hash(n, seed + 1) > 0.25 ? warm : cool; x.globalAlpha = 0.55 + hash(n, seed + 2) * 0.45;
    x.fillRect(k * 16 + 4, r * 16 + 4, 8, 9); x.globalAlpha = 1;
  }
  const t = tex(c); t.wrapS = t.wrapT = T.RepeatWrapping; t.magFilter = T.NearestFilter;
  return t;
}
type Tower = {x: number; z: number; w: number; d: number; top: number; base: number; colour: string};
/** Merges a block of buildings into one mesh: windows on the walls, plain roofs, plant rooms and masts on top. */
function city(towers: Tower[], windows: T.Texture, glow: number) {
  const parts: T.BufferGeometry[] = [];
  const add = (g: T.BufferGeometry, colour: string, windowsOn: boolean, cell: number) => {
    const uv = g.attributes.uv as T.BufferAttribute, pos = g.attributes.position as T.BufferAttribute;
    g.computeBoundingBox(); const size = g.boundingBox!.getSize(new T.Vector3());
    for (let i = 0; i < uv.count; i++) {
      const face = Math.floor(i / 4), across = face < 2 ? size.z : size.x;
      if (!windowsOn || face === 2 || face === 3) uv.setXY(i, 0.01, 0.01);
      else uv.setXY(i, uv.getX(i) * across / cell, uv.getY(i) * size.y / cell);
    }
    const col = new T.Color(colour), colours = new Float32Array(pos.count * 3);
    for (let i = 0; i < pos.count; i++) {colours[i * 3] = col.r; colours[i * 3 + 1] = col.g; colours[i * 3 + 2] = col.b;}
    g.setAttribute('color', new T.BufferAttribute(colours, 3));
    parts.push(g);
  };
  towers.forEach((b, i) => {
    const h = b.top - b.base, body = new T.BoxGeometry(b.w, h, b.d); body.translate(b.x, b.base + h / 2, b.z); add(body, b.colour, true, 6);
    if (hash(i, 31) > 0.35) {const room = new T.BoxGeometry(b.w * 0.4, 1.4, b.d * 0.4); room.translate(b.x + (hash(i, 32) - 0.5) * b.w * 0.3, b.top + 0.7, b.z); add(room, b.colour, false, 6);}
    if (hash(i, 33) > 0.6) {const mast = new T.BoxGeometry(0.15, 3 + hash(i, 34) * 4, 0.15); mast.translate(b.x + b.w * 0.25, b.top + 2.5, b.z); add(mast, '#2a2232', false, 6);}
    if (hash(i, 35) > 0.7) {const lip = new T.BoxGeometry(b.w + 0.3, 0.35, b.d + 0.3); lip.translate(b.x, b.top - 0.17, b.z); add(lip, '#241c2c', false, 6);}
  });
  const geo = mergeGeometries(parts)!;
  for (const p of parts) p.dispose();
  return new T.Mesh(geo, std('#ffffff', 0.9, {vertexColors: true, emissive: '#ffffff', emissiveMap: windows, emissiveIntensity: glow}));
}

function textPanel(text: string, w: number, h: number, bg: string, fg: string, glow = 0, bulbs = false) {
  const px = 128, [c, x] = canvas(Math.round(w * px), Math.round(h * px));
  x.fillStyle = bg; x.fillRect(0, 0, c.width, c.height);
  x.fillStyle = fg; x.font = `${Math.round(h * px * 0.62)}px ${DISPLAY}`; x.textAlign = 'center'; x.textBaseline = 'middle';
  x.fillText(text, c.width / 2, c.height * 0.54);
  if (bulbs) {x.fillStyle = '#ffe9b0'; for (let i = 12; i < c.width; i += 26) for (const y of [8, c.height - 8]) {x.beginPath(); x.arc(i, y, 5, 0, Math.PI * 2); x.fill();}}
  const t = tex(c);
  return new T.Mesh(new T.PlaneGeometry(w, h), std('#ffffff', 0.6, {map: t, emissive: '#ffffff', emissiveMap: t, emissiveIntensity: glow}));
}

/** Ticks crowds, working out the frame time from the elapsed time the renderer passes in. */
function crowdClock(crowds: Crowd[]) {
  let last = -1;
  return (t: number) => {const dt = last < 0 ? 0 : Math.min(0.1, Math.max(0, t - last)); last = t; for (const c of crowds) c.update(t, dt);};
}
let current: Crowd[] = [];
/** Makes the current venue's crowd roar. */
export function cheerCrowd(amount = 1) {for (const c of current) c.roar(amount);}

/* ---------------------------------------------------------------- Rooftop at dusk */
function rooftop(textures: TextureSet): Venue {
  const group = new T.Group();
  courtBase(group, textures, 'rooftop', {name: 'rooftop', repeat: 12, roughness: 0.9, tint: '#cfc6cc'});
  group.add(skyDome([[0, '#2a1d4a'], [0.3, '#6a3570'], [0.52, '#c8587a'], [0.66, '#f08a5d'], [0.8, '#ffc27a'], [1, '#ffe2a8']], new T.Vector3(0.5, 0.1, -1), '#ffe0a8'));
  group.add(cloudRing(230, 40, 60, '#ffe2cc', '#e39ab0', 7, 12, 2));
  // Far haze silhouette, then two layers of city blocks that drop away below the roof.
  const [sc, sx] = canvas(2048, 128); sx.fillStyle = '#7a4a72';
  for (let x = 0; x < 2048;) {const w = 20 + hash(x, 3) * 60, h = 20 + hash(x, 4) * 90; sx.fillRect(x, 128 - h, w, h); if (hash(x, 5) > 0.7) sx.fillRect(x + w * 0.4, 128 - h - 18, 3, 18); x += w + 2;}
  const haze = new T.Mesh(new T.PlaneGeometry(520, 32), new T.MeshBasicMaterial({map: tex(sc), transparent: true, fog: false, depthWrite: false}));
  haze.position.set(0, 2, -170); group.add(haze);
  const far: Tower[] = [], mid: Tower[] = [];
  for (let i = 0; i < 34; i++) far.push({x: -90 + i * 5.4 + hash(i, 1) * 3, z: -58 - hash(i, 2) * 28, w: 4 + hash(i, 3) * 5, d: 5 + hash(i, 4) * 5, base: -40, top: -1 + hash(i, 5) * 11, colour: ['#4f3a5e', '#5a4268', '#46334f'][i % 3]});
  for (let i = 0; i < 24; i++) {
    const x = -44 + i * 3.8 + hash(i, 11) * 2;
    if (Math.abs(x) < 7 && hash(i, 12) > 0.4) continue;
    mid.push({x, z: -20 - hash(i, 13) * 18, w: 3.5 + hash(i, 14) * 4, d: 5 + hash(i, 15) * 6, base: -40, top: -6 + hash(i, 16) * 9, colour: ['#3a2b45', '#432f4c', '#33263d', '#4a3550'][i % 4]});
  }
  group.add(city(far, windowTexture(5, 0.32, '#ffcf8a', '#a8d4ff'), 0.85), city(mid, windowTexture(9, 0.45, '#ffd38a', '#9fd3ff'), 1.0));
  // A painted sign with bulbs on the nearest tower.
  const sign = textPanel('SUNSET COURTS', 7, 1.4, '#2b1a2e', '#ffd08a', 0.9, true); sign.position.set(10, 5.2, -26); group.add(sign);
  for (const dx of [-3, 3]) box(group, 0.12, 6, 0.12, std('#2a2232'), 10 + dx, 1.6, -26.1);
  // Water tower on a neighbouring roof.
  const wood = std('#5a3a3a', 0.9), steel = std('#2e2836', 0.6, {metalness: 0.4});
  cyl(group, 1.5, 1.5, 2.4, wood, -12, 6.6, -16, 20);
  const roof = new T.Mesh(new T.ConeGeometry(1.65, 1.1, 20), wood); roof.position.set(-12, 8.35, -16); group.add(roof);
  for (const [dx, dz] of [[-1.1, -1.1], [1.1, -1.1], [-1.1, 1.1], [1.1, 1.1]]) cyl(group, 0.07, 0.07, 3.6, steel, -12 + dx, 3.6, -16 + dz, 6);
  box(group, 7, 0.4, 7, std('#3a2b45'), -12, 1.7, -16);
  // Our roof: concrete parapet with a coping stone, then a lighter chain-link fence on posts.
  const concrete = floorMaterial(textures, 'concrete', 1, 0.95, '#b9afb6');
  concrete.map?.repeat.set(10, 0.5); concrete.normalMap?.repeat.set(10, 0.5);
  box(group, 40, 1.0, 0.4, concrete, 0, 0.5, -4.7);
  box(group, 40, 0.1, 0.55, std('#d6ccd2', 0.8), 0, 1.05, -4.7);
  const [fc, fx] = canvas(128, 128); fx.strokeStyle = 'rgba(200,196,210,0.9)'; fx.lineWidth = 2;
  for (let i = -128; i < 256; i += 64) {fx.beginPath(); fx.moveTo(i, 0); fx.lineTo(i + 128, 128); fx.stroke(); fx.beginPath(); fx.moveTo(i + 128, 0); fx.lineTo(i, 128); fx.stroke();}
  const fence = tex(fc); fence.wrapS = fence.wrapT = T.RepeatWrapping; fence.repeat.set(40 / 1.4, 2.6 / 1.4);
  const fenceMesh = new T.Mesh(new T.PlaneGeometry(40, 2.6), std('#ffffff', 0.5, {map: fence, transparent: true, alphaTest: 0.25, side: T.DoubleSide, metalness: 0.5}));
  fenceMesh.position.set(0, 2.4, -4.75); group.add(fenceMesh);
  for (let x = -18; x <= 18; x += 3) cyl(group, 0.04, 0.04, 2.7, steel, x, 2.45, -4.72, 6);
  box(group, 40, 0.06, 0.06, steel, 0, 3.72, -4.72);
  // String lights between the posts.
  const bulbs = new T.InstancedMesh(new T.SphereGeometry(0.07, 8, 6), new T.MeshBasicMaterial({color: '#ffe0a0'}), 64), m4 = new T.Matrix4(), wire: T.Vector3[] = [];
  for (let i = 0; i < 64; i++) {
    const t = i / 63, x = -16 + t * 32, sag = Math.sin(((t * 5) % 1) * Math.PI) * 0.45, p = new T.Vector3(x, 4.25 - sag, -4.5);
    wire.push(p); m4.setPosition(p.x, p.y - 0.09, p.z); bulbs.setMatrixAt(i, m4);
  }
  group.add(bulbs, new T.Line(new T.BufferGeometry().setFromPoints(wire), new T.LineBasicMaterial({color: '#241a26'})));
  // Rooftop furniture, kept to the sides so the players read cleanly.
  const metal = std('#9a96a0', 0.5, {metalness: 0.5});
  for (const x of [-9.4, -7.6]) {
    box(group, 1.5, 1.0, 0.9, metal, x, 0.5, -3.95, true);
    const fan = new T.Mesh(new T.CylinderGeometry(0.4, 0.4, 0.05, 20), std('#3a3640', 0.6)); fan.position.set(x, 1.03, -3.95); group.add(fan);
  }
  const plank = std('#9a6a3e', 0.8);
  box(group, 2.2, 0.08, 0.45, plank, 8.6, 0.48, -3.9, true); box(group, 2.2, 0.4, 0.06, plank, 8.6, 0.78, -4.1, true);
  for (const dx of [-0.9, 0.9]) box(group, 0.08, 0.45, 0.4, steel, 8.6 + dx, 0.23, -3.9);
  const bag = new T.Mesh(new T.CapsuleGeometry(0.16, 0.45, 4, 10), std('#f08a24', 0.7)); bag.rotation.z = Math.PI / 2; bag.position.set(8.2, 0.68, -3.88); bag.castShadow = true; group.add(bag);
  box(group, 0.6, 0.45, 0.4, std('#c3283d', 0.5), 10.4, 0.23, -3.85, true); box(group, 0.64, 0.08, 0.44, std('#f4efe4', 0.5), 10.4, 0.49, -3.85);
  for (const x of [-11.2, 11.8]) {
    cyl(group, 0.3, 0.22, 0.55, std('#b4552e', 0.8), x, 0.28, -3.95, 14);
    const leaf = new T.Mesh(new T.IcosahedronGeometry(0.5, 1), std('#3f7a3a', 0.85)); leaf.position.set(x, 0.95, -3.95); leaf.scale.set(1, 1.2, 1); leaf.castShadow = true; group.add(leaf);
  }
  // A handful of friends watching from the wall.
  const seats: Seat[] = [...row(-12, -3.2, 0.5, -5.1, 0.7, false, [], 0.55, 1), ...row(3.2, 12, 0.5, -5.1, 0.7, false, [], 0.55, 2)];
  const crowds = [new Crowd(seats, {shirts: ['#f08a24', '#2a7a72', '#f4efe2', '#c3283d', '#3c5a8a'], dim: 0.95})];
  for (const c of crowds) group.add(c.group);
  return {group, crowds, background: new T.Color('#b34e73'), fog: new T.Fog('#9c4f78', 40, 140), exposure: 1.0,
    hemi: ['#ffc9b0', '#3a2a40', 1.05], sun: ['#ffc58a', 2.6, [9, 7, 4]], rim: ['#ff9a6a', 1.6], update: crowdClock(crowds), dispose: () => disposeGroup(group, crowds)};
}

/* ---------------------------------------------------------------- Old gym */
function gym(textures: TextureSet): Venue {
  const group = new T.Group();
  courtBase(group, textures, 'gym', {name: 'gym-floor', repeat: 10, roughness: 0.36});
  // Bleachers: six rising rows of benches on dark risers, split by a centre stair.
  const bench = std('#b07a42', 0.6), riser = std('#3b2a1e', 0.9), rail = std('#2c2c30', 0.4, {metalness: 0.6});
  const seats: Seat[] = [];
  for (let r = 0; r < 6; r++) {
    const top = 0.45 * (r + 1), z = -4.1 - r * 0.85;
    box(group, 30, top, 0.85, riser, 0, top / 2, z);
    box(group, 30, 0.06, 0.4, bench, 0, top + 0.03, z + 0.18);
    box(group, 0.9, top + 0.01, 0.85, std('#c9b48a', 0.7), 0, top / 2, z + 0.005);
    seats.push(...row(-14.5, 14.5, top + 0.05, z - 0.05, 0.62, true, [[-0.5, 0.5]], 0.86, r));
  }
  box(group, 30, 0.05, 0.05, rail, 0, 0.95, -3.7);
  for (let x = -14; x <= 14; x += 2) box(group, 0.04, 0.95, 0.04, rail, x, 0.47, -3.7);
  // Back wall: painted block below, brick above, high windows with light shafts.
  const backZ = -9.4;
  const brick = floorMaterial(textures, 'gym-brick', 1, 0.9, '#d9b8a4');
  brick.map?.repeat.set(16, 4); brick.normalMap?.repeat.set(16, 4);
  box(group, 40, 8.4, 0.3, brick, 0, 3.6 + 4.2, backZ);
  box(group, 40, 3.6, 0.3, std('#1f6f4a', 0.8), 0, 1.8, backZ + 0.02);
  box(group, 40, 0.18, 0.32, std('#f08a24', 0.6), 0, 3.6, backZ + 0.03);
  for (const s of [-1, 1]) box(group, 0.3, 12, 20, brick, s * 17, 6, -1);
  const [wc, wx] = canvas(128, 96); wx.fillStyle = '#d8ecf6'; wx.fillRect(0, 0, 128, 96); wx.fillStyle = '#3b3b40';
  for (const x of [0, 42, 84, 124]) wx.fillRect(x, 0, 4, 96);
  for (const y of [0, 46, 92]) wx.fillRect(0, y, 128, 4);
  const pane = tex(wc), shaftMat = new T.MeshBasicMaterial({color: '#fff3d6', transparent: true, opacity: 0.07, blending: T.AdditiveBlending, depthWrite: false, side: T.DoubleSide});
  for (let i = -3; i <= 3; i++) {
    if (i === 0) continue;
    const win = new T.Mesh(new T.PlaneGeometry(2.6, 1.9), new T.MeshBasicMaterial({map: pane})); win.position.set(i * 4.4, 8.4, backZ + 0.17); group.add(win);
    const shaft = new T.Mesh(new T.PlaneGeometry(2.4, 9), shaftMat); shaft.position.set(i * 4.4 + 1.2, 5.2, backZ + 3.4); shaft.rotation.set(-0.75, 0, 0.22); group.add(shaft);
  }
  // Wall scoreboard with the live score.
  const [sc, sx] = canvas(512, 224), screen = tex(sc);
  const boardMesh = new T.Mesh(new T.BoxGeometry(4.4, 1.9, 0.3), [0, 0, 0, 0, 1, 0].map(i => i ? std('#ffffff', 0.5, {map: screen, emissive: '#ffffff', emissiveMap: screen, emissiveIntensity: 0.8}) : std('#1b1b1e', 0.5)));
  boardMesh.position.set(0, 5.4, backZ + 0.3); group.add(boardMesh);
  let shown = '';
  const drawBoard = (score: [number, number] | null, clock: string) => {
    const key = score ? `${score[0]}|${score[1]}|${clock}` : '-'; if (key === shown) return; shown = key;
    sx.fillStyle = '#141416'; sx.fillRect(0, 0, 512, 224); sx.strokeStyle = '#f08a24'; sx.lineWidth = 8; sx.strokeRect(6, 6, 500, 212);
    sx.textAlign = 'center'; sx.textBaseline = 'middle'; sx.font = `34px ${DISPLAY}`; sx.fillStyle = '#f4efe4'; sx.fillText('HOME', 110, 44); sx.fillText('GUEST', 402, 44);
    sx.font = `92px ${DISPLAY}`; sx.fillStyle = '#ff6a3a'; sx.fillText(score ? String(score[0]).padStart(2, '0') : '00', 110, 136); sx.fillText(score ? String(score[1]).padStart(2, '0') : '00', 402, 136);
    sx.font = `54px ${DISPLAY}`; sx.fillStyle = '#ffd04a'; sx.fillText(score ? clock : '1:00', 256, 120);
    screen.needsUpdate = true;
  };
  // Cup banners and retired numbers.
  CUPS.forEach((cup, i) => {
    const [bc, bx] = canvas(256, 512);
    bx.fillStyle = ['#1f6f4a', '#2c6e9b', '#8f2d26'][i]; bx.beginPath(); bx.moveTo(0, 0); bx.lineTo(256, 0); bx.lineTo(256, 440); bx.lineTo(128, 512); bx.lineTo(0, 440); bx.fill();
    bx.fillStyle = '#f6efe0'; bx.font = `60px ${DISPLAY}`; bx.textAlign = 'center';
    cup.name.toUpperCase().split(' ').forEach((w, j) => bx.fillText(w, 128, 150 + j * 76));
    bx.fillRect(48, 330, 160, 8);
    const banner = new T.Mesh(new T.PlaneGeometry(1.3, 2.6), std('#ffffff', 0.9, {map: tex(bc), transparent: true, alphaTest: 0.5}));
    banner.position.set([-8.8, 8.8, -13][i], 5.1, backZ + 0.18); group.add(banner);
  });
  for (const [x, n] of [[-5.2, 23], [5.2, 33]] as const) {
    const [rc, rx] = canvas(128, 128); rx.fillStyle = '#f4efe4'; rx.beginPath(); rx.arc(64, 64, 60, 0, Math.PI * 2); rx.fill();
    rx.strokeStyle = '#1f6f4a'; rx.lineWidth = 10; rx.stroke(); rx.fillStyle = '#1f6f4a'; rx.font = `64px ${DISPLAY}`; rx.textAlign = 'center'; rx.textBaseline = 'middle'; rx.fillText(String(n), 64, 68);
    const disc = new T.Mesh(new T.CircleGeometry(0.55, 32), std('#ffffff', 0.7, {map: tex(rc)})); disc.position.set(x, 5.6, backZ + 0.17); group.add(disc);
  }
  const exit = textPanel('EXIT', 0.9, 0.36, '#1f6f4a', '#f4efe4', 1.2); exit.position.set(-12, 4.3, backZ + 0.17); group.add(exit);
  const crowds = [new Crowd(seats, {shirts: ['#1f6f4a', '#f08a24', '#f4efe4', '#2c6e9b', '#c3283d', '#e6b422'], dim: 0.92})];
  for (const c of crowds) group.add(c.group);
  const tick = crowdClock(crowds);
  return {group, crowds, background: new T.Color('#3a2e24'), fog: new T.Fog('#4a3a2c', 30, 70), exposure: 1.02,
    hemi: ['#fff4e0', '#6b4a2a', 1.15], sun: ['#fff1d8', 2.2, [3, 12, 7]], rim: ['#fff2d6', 1.3],
    update: (t, score, clock) => {tick(t); drawBoard(score, clock);}, dispose: () => disposeGroup(group, crowds)};
}

/* ---------------------------------------------------------------- Boardwalk */
function leafTexture() {
  const [c, x] = canvas(256, 64);
  x.strokeStyle = '#3f8a3a'; x.lineCap = 'round';
  for (let i = 8; i < 248; i += 7) {const len = 26 * Math.sin((i / 256) * Math.PI) + 4; x.lineWidth = 5; x.beginPath(); x.moveTo(i, 32); x.lineTo(i + 10, 32 - len); x.moveTo(i, 32); x.lineTo(i + 10, 32 + len); x.stroke();}
  x.strokeStyle = '#5a7a2a'; x.lineWidth = 4; x.beginPath(); x.moveTo(0, 32); x.lineTo(256, 32); x.stroke();
  return tex(c);
}
function palm(x: number, z: number, lean: number, height: number, leaves: T.Texture) {
  const g = new T.Group(), v = (a: number, b: number, c: number) => new T.Vector3(a, b, c);
  const top = v(x + lean * 2, height, z);
  const curve = new T.QuadraticBezierCurve3(v(x, 0, z), v(x + lean * 0.4, height * 0.6, z), top);
  const [rc, rx] = canvas(32, 128); rx.fillStyle = '#9a7a52'; rx.fillRect(0, 0, 32, 128); rx.fillStyle = '#6e5234';
  for (let y = 0; y < 128; y += 12) rx.fillRect(0, y, 32, 4);
  const ring = tex(rc); ring.wrapS = ring.wrapT = T.RepeatWrapping; ring.repeat.set(1, 4);
  const trunk = new T.Mesh(new T.TubeGeometry(curve, 20, 0.2, 8), std('#ffffff', 0.9, {map: ring})); trunk.castShadow = true; g.add(trunk);
  const leafMat = std('#ffffff', 0.8, {map: leaves, alphaTest: 0.5, side: T.DoubleSide});
  for (let i = 0; i < 9; i++) {
    const geo = new T.PlaneGeometry(3.2, 0.9, 10, 1), pos = geo.attributes.position as T.BufferAttribute;
    for (let k = 0; k < pos.count; k++) {const px = pos.getX(k) + 1.6; pos.setY(k, pos.getY(k) - (px / 3.2) ** 2 * 1.3); pos.setX(k, px);}
    geo.rotateX(-Math.PI / 2 + 0.35); geo.computeVertexNormals();
    const frond = new T.Mesh(geo, leafMat); frond.position.copy(top); frond.rotation.y = (i / 9) * Math.PI * 2 + hash(i, x) * 0.4; frond.castShadow = true; g.add(frond);
  }
  for (let i = 0; i < 3; i++) {const nut = new T.Mesh(new T.SphereGeometry(0.13, 8, 6), std('#5a3a1e')); nut.position.copy(top).add(v(Math.cos(i * 2.1) * 0.2, -0.2, Math.sin(i * 2.1) * 0.2)); g.add(nut);}
  return g;
}
function boardwalk(textures: TextureSet): Venue {
  const group = new T.Group();
  group.add(skyDome([[0, '#2f7fd0'], [0.55, '#6db8ea'], [0.88, '#bfe4f4'], [1, '#f4eed8']], new T.Vector3(-0.6, 0.6, -1)));
  group.add(cloudRing(220, 46, 70, '#ffffff', '#9fc2dc', 21, 16, 2));
  const sand = new T.Mesh(new T.PlaneGeometry(140, 40), floorMaterial(textures, 'sand', 34, 1, '#f1dfb8')); sand.rotation.x = -Math.PI / 2; sand.position.set(0, -0.05, -8); sand.receiveShadow = true; group.add(sand);
  const wet = new T.Mesh(new T.PlaneGeometry(140, 3), std('#c9ae84', 0.4)); wet.rotation.x = -Math.PI / 2; wet.position.set(0, -0.045, -26.5); group.add(wet);
  courtBase(group, textures, 'boardwalk', {name: 'boardwalk', repeat: 8, roughness: 0.7, tint: '#f2e6d0', width: 16, depth: 8.4});
  box(group, 16, 0.25, 8.4, std('#9b7a55', 0.9), 0, -0.13, 1.8);
  // Sea, surf line and a hazy headland with the lighthouse.
  const [nc, nx] = canvas(256, 256), img = nx.createImageData(256, 256);
  for (let i = 0; i < 256 * 256; i++) {const a = hash(i % 256 * 0.31, Math.floor(i / 256) * 0.17) * 40; img.data[i * 4] = 128 + a - 20; img.data[i * 4 + 1] = 128 + a * 0.7 - 14; img.data[i * 4 + 2] = 255; img.data[i * 4 + 3] = 255;}
  nx.putImageData(img, 0, 0);
  const ripple = tex(nc, false); ripple.wrapS = ripple.wrapT = T.RepeatWrapping; ripple.repeat.set(60, 20);
  const sea = new T.Mesh(new T.PlaneGeometry(600, 200), std('#1d8ab4', 0.1, {metalness: 0.1, normalMap: ripple, normalScale: new T.Vector2(0.35, 0.35)}));
  sea.rotation.x = -Math.PI / 2; sea.position.set(0, -0.09, -126); group.add(sea);
  const [fc, fx] = canvas(512, 32); fx.fillStyle = 'rgba(255,255,255,0.9)';
  for (let x = 0; x < 512; x += 2) {const h = 10 + Math.sin(x * 0.05) * 5 + Math.sin(x * 0.17) * 3; fx.fillRect(x, 16 - h / 2, 2, h);}
  const foamTex = tex(fc); foamTex.wrapS = T.RepeatWrapping; foamTex.repeat.set(16, 1);
  const foam = new T.Mesh(new T.PlaneGeometry(200, 1.1), new T.MeshBasicMaterial({map: foamTex, transparent: true, depthWrite: false})); foam.rotation.x = -Math.PI / 2; foam.position.set(0, -0.03, -28.2); group.add(foam);
  const hill = std('#4f7f94', 1);
  for (const [x, z, sx, sy] of [[64, -190, 70, 7], [8, -215, 46, 4], [-78, -200, 80, 6]] as const) {
    const h = new T.Mesh(new T.SphereGeometry(1, 24, 10, 0, Math.PI * 2, 0, Math.PI / 2), hill); h.scale.set(sx, sy, 18); h.position.set(x, -0.5, z); group.add(h);
  }
  const stripes = [std('#f4efe4', 0.6), std('#c3283d', 0.6)];
  for (let i = 0; i < 6; i++) cyl(group, 1.5 - i * 0.12, 1.62 - i * 0.12, 2.4, stripes[i % 2], 52, 7 + i * 2.4, -190, 16);
  box(group, 1.6, 1.2, 1.6, std('#2a2a2a', 0.5), 52, 22, -190);
  // Sailboats.
  for (const [x, z, s] of [[-26, -70, 1], [34, -95, 0.8], [-60, -120, 0.7]] as const) {
    const boat = new T.Group(); box(boat, 3, 0.5, 0.9, std('#f4efe4', 0.6), 0, 0.15, 0);
    const shape = new T.Shape(); shape.moveTo(0, 0); shape.lineTo(1.6, 0); shape.lineTo(0, 3.6);
    const sail = new T.Mesh(new T.ShapeGeometry(shape), std('#ffffff', 0.7, {side: T.DoubleSide})); sail.position.set(-0.6, 0.45, 0); boat.add(sail);
    boat.position.set(x, -0.1, z); boat.scale.setScalar(s); group.add(boat);
  }
  // Lifeguard tower, beach huts and striped parasols.
  const white = std('#f4efe4', 0.6), red = std('#d23b3b', 0.6), wood = std('#a98458', 0.85);
  for (const [dx, dz] of [[-0.8, -0.8], [0.8, -0.8], [-0.8, 0.8], [0.8, 0.8]]) cyl(group, 0.08, 0.08, 2.6, wood, -12 + dx, 1.3, -11 + dz, 6);
  box(group, 2.2, 0.15, 2.2, wood, -12, 2.6, -11, true); box(group, 1.8, 1.4, 1.6, red, -12, 3.4, -11, true); box(group, 1.84, 0.25, 1.64, white, -12, 3.3, -11);
  const hutRoof = new T.Mesh(new T.ConeGeometry(1.5, 0.7, 4), white); hutRoof.rotation.y = Math.PI / 4; hutRoof.position.set(-12, 4.45, -11); group.add(hutRoof);
  cyl(group, 0.03, 0.03, 1.4, wood, -12, 5.4, -11, 6);
  const flag = new T.Mesh(new T.PlaneGeometry(0.7, 0.45), std('#f2c14e', 0.7, {side: T.DoubleSide})); flag.position.set(-11.6, 5.8, -11); group.add(flag);
  ([['#f08a24', 9.5], ['#7fc6d8', 12], ['#f2c14e', 14.5]] as const).forEach(([colour, x], i) => {
    const [hc, hx] = canvas(64, 64); hx.fillStyle = '#f4efe4'; hx.fillRect(0, 0, 64, 64); hx.fillStyle = colour;
    for (let s = 0; s < 64; s += 16) hx.fillRect(s, 0, 8, 64);
    box(group, 2, 2.2, 2, std('#ffffff', 0.8, {map: tex(hc)}), x, 1.1, -9.5 - i * 0.6, true);
    const roof = new T.Mesh(new T.CylinderGeometry(1.25, 1.25, 2.2, 3), std('#3b5f7a', 0.8)); roof.rotation.z = Math.PI / 2; roof.position.set(x, 2.55, -9.5 - i * 0.6); roof.scale.set(1, 1, 0.9); group.add(roof);
  });
  for (const [x, colour] of [[-7.6, '#f08a24'], [8.3, '#2c6e9b'], [-15, '#d23b3b']] as const) {
    const [pc, px] = canvas(256, 32);
    for (let i = 0; i < 8; i++) {px.fillStyle = i % 2 ? '#f4efe4' : colour; px.fillRect(i * 32, 0, 32, 32);}
    cyl(group, 0.03, 0.03, 2.4, white, x, 1.2, -6, 6);
    const top = new T.Mesh(new T.ConeGeometry(1.35, 0.55, 16, 1, true), std('#ffffff', 0.8, {map: tex(pc), side: T.DoubleSide})); top.position.set(x, 2.35, -6); top.castShadow = true; group.add(top);
  }
  const leaves = leafTexture();
  for (const [x, z, l, h] of [[-10.5, -6.2, 0.9, 7.5], [-14.5, -9, 0.4, 8.5], [11, -6.8, -0.9, 7], [16, -10.5, -0.5, 9]] as const) group.add(palm(x, z, l, h, leaves));
  // Railing with a solid lower board, fans behind it, and bunting overhead.
  for (let x = -8; x <= 8; x += 1.6) box(group, 0.1, 1.1, 0.1, white, x, 0.55, -3.9, true);
  box(group, 16.2, 0.07, 0.08, white, 0, 1.05, -3.9); box(group, 16.2, 0.55, 0.04, white, 0, 0.42, -3.92);
  const seats: Seat[] = [...row(-7.6, 7.6, 0.55, -4.4, 0.62, false, [[-0.5, 0.5]], 0.82, 3), ...row(-7.2, 7.2, 0.45, -5.2, 0.7, false, [], 0.5, 4)];
  for (const s of [-1, 1]) cyl(group, 0.05, 0.05, 4.2, white, s * 8.1, 2.1, -3.95, 8);
  const flags: T.BufferGeometry[] = [], colours = ['#f08a24', '#f2c14e', '#2c6e9b', '#d23b3b', '#3f8a3a', '#f4efe4'];
  for (let i = 0; i < 26; i++) {
    const t = i / 25, x = -8 + t * 16, y = 4.1 - Math.sin(t * Math.PI) * 0.6;
    const tri = new T.BufferGeometry().setFromPoints([new T.Vector3(x - 0.22, y, -3.95), new T.Vector3(x + 0.22, y, -3.95), new T.Vector3(x, y - 0.5, -3.95)]);
    const c = new T.Color(colours[i % colours.length]);
    tri.setAttribute('color', new T.BufferAttribute(new Float32Array([c.r, c.g, c.b, c.r, c.g, c.b, c.r, c.g, c.b]), 3)); tri.computeVertexNormals();
    flags.push(tri);
  }
  group.add(new T.Mesh(mergeGeometries(flags)!, std('#ffffff', 0.8, {vertexColors: true, side: T.DoubleSide})));
  const crowds = [new Crowd(seats, {shirts: ['#f08a24', '#7fc6d8', '#f4efe4', '#f2c14e', '#e0663a', '#3f8a3a']})];
  for (const c of crowds) group.add(c.group);
  const tick = crowdClock(crowds);
  return {group, crowds, background: new T.Color('#9fd3f0'), fog: new T.Fog('#cfe8f2', 70, 240), exposure: 0.95,
    hemi: ['#e8f6ff', '#c9a979', 1.2], sun: ['#fff1d0', 3.0, [-6, 12, 7]], rim: ['#fff6e0', 1.2],
    update: (t) => {ripple.offset.set(t * 0.01, t * 0.004); foamTex.offset.x = Math.sin(t * 0.5) * 0.02; tick(t);}, dispose: () => disposeGroup(group, crowds)};
}

/* ---------------------------------------------------------------- Night arena */
function arena(textures: TextureSet): Venue {
  const group = new T.Group();
  courtBase(group, textures, 'arena', {name: 'arena-floor', repeat: 10, roughness: 0.24});
  const apron = new T.Mesh(new T.PlaneGeometry(60, 30), std('#1c1714', 0.6)); apron.rotation.x = -Math.PI / 2; apron.position.set(0, -0.01, -10); group.add(apron);
  // Lower bowl: seven tiers with stair aisles, then a fascia ribbon and a dim upper deck.
  const seatMat = std('#2a211c', 0.9), stair = std('#4a3c32', 0.8), aisles: [number, number][] = [[-12.6, -11.4], [-5.6, -4.4], [4.4, 5.6], [11.4, 12.6]];
  const lower: Seat[] = [], upper: Seat[] = [];
  for (let r = 0; r < 7; r++) {
    const top = 0.35 + r * 0.8, z = -5.3 - r * 1.2;
    box(group, 36, top, 1.2, seatMat, 0, top / 2, z);
    for (const [a, b] of aisles) box(group, b - a, top + 0.02, 1.2, stair, (a + b) / 2, top / 2, z + 0.01);
    lower.push(...row(-17, 17, top, z + 0.15, 0.6, true, aisles, 0.93, r + 10));
  }
  const [lc, lx] = canvas(2048, 64), led = tex(lc); led.wrapS = T.RepeatWrapping; led.repeat.set(2, 1);
  lx.fillStyle = '#120d0a'; lx.fillRect(0, 0, 2048, 64); lx.font = `44px ${DISPLAY}`; lx.textBaseline = 'middle';
  lx.textAlign = 'center';
  ['RIM RUSH', 'NIGHT ARENA', 'CHAMPIONS CUP', 'SWISH +1'].forEach((w, i) => {lx.fillStyle = i % 2 ? '#f6efe0' : '#e6b422'; lx.fillText(w, 256 + i * 512, 34); lx.fillStyle = '#e6b422'; lx.fillText('★', 512 + i * 512, 34);});
  const ribbon = new T.Mesh(new T.BoxGeometry(40, 0.9, 0.3), [0, 0, 0, 0, 1, 0].map(i => i ? std('#ffffff', 0.4, {map: led, emissive: '#ffffff', emissiveMap: led, emissiveIntensity: 1.1}) : std('#141010')));
  ribbon.position.set(0, 6.25, -13.9); group.add(ribbon);
  for (let r = 0; r < 4; r++) {
    const top = 6.9 + r * 0.9, z = -14.8 - r * 1.3;
    box(group, 40, 1.2, 1.3, seatMat, 0, top - 0.6, z);
    upper.push(...row(-19, 19, top, z + 0.1, 0.7, true, [], 0.7, r + 30));
  }
  // Courtside boards.
  const [ac, ax] = canvas(1024, 64);
  ax.fillStyle = '#16120f'; ax.fillRect(0, 0, 1024, 64); ax.fillStyle = '#e6b422'; ax.font = `40px ${DISPLAY}`; ax.textBaseline = 'middle';
  for (let i = 0; i < 4; i++) ax.fillText(i % 2 ? 'NIGHT ARENA' : 'RIM RUSH', 20 + i * 256, 34);
  const ads = tex(ac); ads.wrapS = T.RepeatWrapping; ads.repeat.set(3, 1);
  box(group, 24, 0.7, 0.15, std('#ffffff', 0.4, {map: ads, emissive: '#ffffff', emissiveMap: ads, emissiveIntensity: 0.7}), 0, 0.35, -4.4);
  // Hanging scoreboard with the live score.
  const [sc, sx] = canvas(512, 256), screen = tex(sc);
  const cube = new T.Mesh(new T.BoxGeometry(4.2, 2.1, 2.2), [0, 0, 0, 0, 1, 1].map(i => i ? std('#ffffff', 0.5, {map: screen, emissive: '#ffffff', emissiveMap: screen, emissiveIntensity: 0.9}) : std('#1a1614', 0.5)));
  cube.position.set(0, 8.4, -2.5); group.add(cube);
  let shown = '';
  const draw = (score: [number, number] | null, clock: string) => {
    const key = score ? `${score[0]}-${score[1]}-${clock}` : 'idle'; if (key === shown) return; shown = key;
    sx.fillStyle = '#0d0b0a'; sx.fillRect(0, 0, 512, 256); sx.textAlign = 'center'; sx.textBaseline = 'middle';
    sx.fillStyle = '#e6b422'; sx.font = `46px ${DISPLAY}`; sx.fillText(score ? clock : 'RIM RUSH', 256, 52);
    if (score) {sx.font = `120px ${DISPLAY}`; sx.fillStyle = '#f08a24'; sx.fillText(String(score[0]), 128, 160); sx.fillStyle = '#f6efe0'; sx.fillText(String(score[1]), 384, 160);}
    else {sx.font = `56px ${DISPLAY}`; sx.fillStyle = '#f6efe0'; sx.fillText('TONIGHT', 256, 150);}
    screen.needsUpdate = true;
  };
  // Title banners in the rafters and light cones from the rig.
  CUPS.forEach((cup, i) => {
    const [bc, bx] = canvas(192, 384); bx.fillStyle = '#e6b422'; bx.fillRect(0, 0, 192, 384); bx.fillStyle = '#1a1410'; bx.fillRect(8, 8, 176, 368);
    bx.fillStyle = '#e6b422'; bx.font = `40px ${DISPLAY}`; bx.textAlign = 'center';
    cup.name.toUpperCase().split(' ').forEach((w, j) => bx.fillText(w, 96, 120 + j * 52)); bx.fillText('★', 96, 300);
    const b = new T.Mesh(new T.PlaneGeometry(1.4, 2.8), std('#ffffff', 0.7, {map: tex(bc)})); b.position.set(-9 + i * 9, 11.5, -16); group.add(b);
  });
  const cone = new T.MeshBasicMaterial({color: '#fff2d6', transparent: true, opacity: 0.06, blending: T.AdditiveBlending, depthWrite: false, side: T.DoubleSide});
  for (const x of [-HOOP_X, -1.5, 1.5, HOOP_X]) {const c = new T.Mesh(new T.ConeGeometry(2.2, 10, 24, 1, true), cone); c.position.set(x, 6.5, -0.6); group.add(c);}
  // Camera flashes twinkling in the stands.
  const flashGeo = new T.BufferGeometry(), flashes = 60, pos = new Float32Array(flashes * 3);
  for (let i = 0; i < flashes; i++) {pos[i * 3] = (hash(i, 9) - 0.5) * 34; pos[i * 3 + 1] = 0.9 + hash(i, 10) * 10; pos[i * 3 + 2] = -5.5 - hash(i, 11) * 14;}
  flashGeo.setAttribute('position', new T.BufferAttribute(pos, 3));
  const flashMat = new T.PointsMaterial({color: '#ffffff', size: 0.16, transparent: true, opacity: 0, depthWrite: false});
  group.add(new T.Points(flashGeo, flashMat));
  const crowds = [
    new Crowd(lower, {shirts: ['#8f2d26', '#e6b422', '#f4efe4', '#1f2a44', '#c3283d', '#f08a24'], dim: 0.95}),
    new Crowd(upper, {shirts: ['#8f2d26', '#e6b422', '#f4efe4', '#1f2a44'], dim: 0.55}),
  ];
  for (const c of crowds) group.add(c.group);
  const tick = crowdClock(crowds);
  return {group, crowds, background: new T.Color('#100d0b'), fog: new T.Fog('#100d0b', 22, 52), exposure: 1.1,
    hemi: ['#5a4c40', '#1a1410', 0.95], sun: ['#fff4e2', 3.0, [2, 14, 6]], rim: ['#ffd9a0', 2.0],
    update: (t, score, clock) => {tick(t); draw(score, clock); led.offset.x = (t * 0.03) % 1; flashMat.opacity = hash(Math.floor(t * 8), 3) > 0.7 ? 0.9 : 0;},
    dispose: () => disposeGroup(group, crowds)};
}

function disposeGroup(group: T.Object3D, crowds: Crowd[]) {
  for (const c of crowds) {group.remove(c.group); c.dispose();}
  current = current.filter(c => !crowds.includes(c));
  group.traverse(o => {
    if (!(o instanceof T.Mesh || o instanceof T.Points || o instanceof T.Line)) return;
    o.geometry.dispose();
    for (const m of Array.isArray(o.material) ? o.material : [o.material]) {
      for (const v of Object.values(m)) if (v instanceof T.Texture) v.dispose();
      if (m instanceof T.ShaderMaterial) for (const u of Object.values(m.uniforms)) if (u.value instanceof T.Texture) u.value.dispose();
      m.dispose();
    }
  });
}

/**
 * Merges static meshes that share a material (and shadow flags) into one mesh each, so a venue
 * full of boxes, rails and props costs a handful of draw calls. Crowds and multi-material meshes are left alone.
 */
function mergeStatic(group: T.Group, skip: Set<T.Object3D>) {
  group.updateMatrixWorld(true);
  type Bucket = {material: T.Material; cast: boolean; receive: boolean; order: number; geos: T.BufferGeometry[]; meshes: T.Mesh[]};
  const buckets = new Map<string, Bucket>();
  group.traverse(o => {
    if (!(o instanceof T.Mesh) || o instanceof T.InstancedMesh || Array.isArray(o.material) || skip.has(o)) return;
    for (let p = o.parent; p; p = p.parent) if (skip.has(p)) return;
    const attrs = Object.keys(o.geometry.attributes).sort().join(',');
    const key = `${o.material.uuid}|${o.castShadow}|${o.receiveShadow}|${o.renderOrder}|${attrs}`;
    const g = o.geometry.index ? o.geometry.toNonIndexed() : o.geometry.clone();
    g.applyMatrix4(o.matrixWorld);
    const b: Bucket = buckets.get(key) ?? {material: o.material, cast: o.castShadow, receive: o.receiveShadow, order: o.renderOrder, geos: [], meshes: []};
    b.geos.push(g); b.meshes.push(o); buckets.set(key, b);
  });
  for (const b of buckets.values()) {
    if (b.meshes.length < 2) {for (const g of b.geos) g.dispose(); continue;}
    for (const m of b.meshes) {m.removeFromParent(); m.geometry.dispose();}
    const merged = new T.Mesh(mergeGeometries(b.geos)!, b.material);
    merged.castShadow = b.cast; merged.receiveShadow = b.receive; merged.renderOrder = b.order;
    group.add(merged);
    for (const g of b.geos) g.dispose();
  }
}

export function buildVenue(id: CourtId, textures: TextureSet): Venue {
  const v = id === 'rooftop' ? rooftop(textures) : id === 'gym' ? gym(textures) : id === 'boardwalk' ? boardwalk(textures) : arena(textures);
  current = v.crowds;
  const accent = {rooftop: '#2a7a72', gym: '#1f6f4a', boardwalk: '#2c6e9b', arena: '#8f2d26'}[id];
  v.group.add(stanchion(-1, accent), stanchion(1, accent));
  // End nets: the side walls the ball can bank off. Kept light so they frame rather than cage the court.
  const [nc, nx] = canvas(64, 64); nx.strokeStyle = 'rgba(255,255,255,0.55)'; nx.lineWidth = 2;
  nx.strokeRect(1, 1, 62, 62);
  const mesh = tex(nc); mesh.wrapS = mesh.wrapT = T.RepeatWrapping; mesh.repeat.set(4, 5);
  const netMat = new T.MeshStandardMaterial({map: mesh, color: id === 'arena' ? '#e6b422' : '#ffffff', transparent: true, opacity: 0.7, alphaTest: 0.1, side: T.DoubleSide, roughness: 0.8, depthWrite: false});
  const padMat = new T.MeshStandardMaterial({color: accent, roughness: 0.6}), steel = new T.MeshStandardMaterial({color: '#3b3f45', metalness: 0.6, roughness: 0.4});
  for (const s of [-1, 1]) {
    const net = new T.Mesh(new T.PlaneGeometry(5.6, 6.5), netMat); net.rotation.y = Math.PI / 2; net.position.set(s * (WALL_X + 0.02), 3.25, -0.2); v.group.add(net);
    const pad = new T.Mesh(new T.BoxGeometry(0.12, 1.0, 5.6), padMat); pad.position.set(s * (WALL_X + 0.08), 0.5, -0.2); pad.castShadow = pad.receiveShadow = true; v.group.add(pad);
    for (const z of [-3, 2.6]) {const post = new T.Mesh(new T.CylinderGeometry(0.05, 0.05, 6.6, 8), steel); post.position.set(s * (WALL_X + 0.02), 3.3, z); v.group.add(post);}
    const top = new T.Mesh(new T.BoxGeometry(0.06, 0.06, 5.6), steel); top.position.set(s * (WALL_X + 0.02), 6.5, -0.2); v.group.add(top);
  }
  mergeStatic(v.group, new Set(v.crowds.map(c => c.group)));
  return v;
}
export const WALL_LIMIT = WALL_X;
