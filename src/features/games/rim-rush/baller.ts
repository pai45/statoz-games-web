// Original stylised basketball players, built from primitives and posed in code with two-bone IK.
// Look: chunky "toy athlete" proportions with an ink outline that matches the game's interface.
import * as T from 'three';
import {mergeGeometries} from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import type {Look} from './levels';

const DOWN = new T.Vector3(0, -1, 0);
const _q = new T.Quaternion(), _v = new T.Vector3(), _s = new T.Vector3(), _t = new T.Vector3(), _n = new T.Vector3(), _e = new T.Vector3(), _h = new T.Vector3();
const UPPER_ARM = 0.33, LOWER_ARM = 0.37, UPPER_LEG = 0.46, LOWER_LEG = 0.46;
export const SHOULDER_Y = 1.48;
const HIP_Y = 0.98;
const INK = '#1a1410';
/** Turned this far from side-on toward the camera, so faces and numbers read. */
const TURN = 0.78;

/** Rotates `bone` so its local -Y axis points along the world direction `dir`. */
function pointBone(bone: T.Object3D, dir: T.Vector3) {
  bone.parent!.getWorldQuaternion(_q).invert();
  _v.copy(dir).applyQuaternion(_q).normalize();
  bone.quaternion.setFromUnitVectors(DOWN, _v);
  bone.updateMatrixWorld(true);
}
/** Bends a two-bone chain so its end reaches `target`, with the middle joint pushed toward `hint` (both world space). */
function reach(upper: T.Object3D, lower: T.Object3D, a: number, b: number, target: T.Vector3, hint: T.Vector3) {
  upper.getWorldPosition(_s);
  _t.copy(target).sub(_s);
  const d = Math.max(Math.abs(a - b) + 1e-3, Math.min(a + b - 1e-3, _t.length()));
  _t.normalize();
  const bend = Math.acos(Math.max(-1, Math.min(1, (a * a + d * d - b * b) / (2 * a * d))));
  _n.crossVectors(_t, hint);
  if (_n.lengthSq() < 1e-8) _n.set(1, 0, 0);
  _n.normalize();
  const upperDir = _e.copy(_t).applyAxisAngle(_n, bend);
  pointBone(upper, upperDir);
  const elbow = _h.copy(_s).addScaledVector(upperDir, a);
  const end = _v.copy(_s).addScaledVector(_t, d);
  pointBone(lower, end.sub(elbow).normalize());
}

/** One shared outline material: back faces pushed out along their normals, drawn in ink. */
let outlineMaterial: T.MeshBasicMaterial | null = null;
function outline() {
  if (outlineMaterial) return outlineMaterial;
  const m = new T.MeshBasicMaterial({color: INK, side: T.BackSide});
  m.onBeforeCompile = shader => {
    shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', 'vec3 transformed = position + normal * 0.016;');
  };
  m.customProgramCacheKey = () => 'rim-rush-outline';
  outlineMaterial = m;
  return m;
}

/**
 * Tank-top texture for the lathe torso. u runs around the body (0.5 faces forward once the mesh is turned),
 * v runs from waist (0) to neck (1). Arm holes and the neckline are painted in skin tone.
 */
function jerseyTexture(look: Look) {
  const W = 512, H = 256, c = document.createElement('canvas'); c.width = W; c.height = H;
  const x = c.getContext('2d')!;
  x.fillStyle = look.jersey; x.fillRect(0, 0, W, H);
  // Mesh fabric and soft side shading.
  x.globalAlpha = 0.07; x.fillStyle = '#000';
  for (let i = 0; i < W; i += 4) for (let j = (i / 4) % 2 * 2; j < H; j += 4) x.fillRect(i, j, 2, 2);
  x.globalAlpha = 1;
  const side = x.createLinearGradient(0, 0, W, 0);
  for (const [at, a] of [[0, 0.1], [0.25, 0.2], [0.5, 0], [0.75, 0.2], [1, 0.1]] as const) side.addColorStop(at, `rgba(0,0,0,${a})`);
  x.fillStyle = side; x.fillRect(0, 0, W, H);
  // Hem trim.
  x.fillStyle = look.trim; x.fillRect(0, H - 22, W, 10);
  // Arm holes at the sides, neckline at front and back.
  x.fillStyle = look.skin;
  for (const u of [0.25, 0.75]) {x.beginPath(); x.ellipse(u * W, 0, 50, 84, 0, 0, Math.PI * 2); x.fill();}
  x.beginPath(); x.moveTo(0.5 * W - 60, 0); x.quadraticCurveTo(0.5 * W, 70, 0.5 * W + 60, 0); x.fill();
  for (const u of [0, 1]) {x.beginPath(); x.moveTo(u * W - 46, 0); x.quadraticCurveTo(u * W, 34, u * W + 46, 0); x.fill();}
  // Trim piping around the openings.
  x.strokeStyle = look.trim; x.lineWidth = 9;
  for (const u of [0.25, 0.75]) {x.beginPath(); x.ellipse(u * W, 0, 54, 88, 0, 0, Math.PI); x.stroke();}
  x.beginPath(); x.moveTo(0.5 * W - 64, 0); x.quadraticCurveTo(0.5 * W, 76, 0.5 * W + 64, 0); x.stroke();
  // Number on the chest and a smaller one on the back.
  // Light jerseys get a dark number; others get the trim colour (or cream) with an ink outline.
  const light = new T.Color(look.jersey).getHSL({h: 0, s: 0, l: 0}).l > 0.75;
  const trimLight = new T.Color(look.trim).getHSL({h: 0, s: 0, l: 0}).l > 0.6;
  const fill = light ? '#1b1b1b' : trimLight ? look.trim : '#fffaf0';
  x.textAlign = 'center'; x.textBaseline = 'middle'; x.lineJoin = 'round';
  for (const [u, size] of [[0.5, 112], [0, 72], [1, 72]] as const) {
    x.font = `${size}px 'Lilita One', 'Arial Black', Impact, sans-serif`;
    if (!light) {x.lineWidth = size * 0.12; x.strokeStyle = INK; x.strokeText(String(look.number), u * W, H * 0.55);}
    x.fillStyle = fill; x.fillText(String(look.number), u * W, H * 0.55);
  }
  const t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; t.anisotropy = 4;
  return t;
}
function shadowTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 64;
  const x = c.getContext('2d')!, g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(0,0,0,0.55)'); g.addColorStop(0.6, 'rgba(0,0,0,0.25)'); g.addColorStop(1, 'rgba(0,0,0,0)');
  x.fillStyle = g; x.fillRect(0, 0, 64, 64);
  return new T.CanvasTexture(c);
}

/** V-shaped torso: waist to shoulders to neck. */
const TORSO = new T.LatheGeometry([
  [0.0, -0.02], [0.155, -0.02], [0.165, 0.08], [0.19, 0.22], [0.205, 0.33], [0.19, 0.42], [0.13, 0.5], [0.07, 0.54], [0.0, 0.545],
].map(([r, y]) => new T.Vector2(r, y)), 28);

type Limb = {upper: T.Group; lower: T.Group; end: T.Object3D};
export type Pose = {
  /** Hand and foot targets in the player's local frame: x across the body, y up, z forward. */
  hands: [T.Vector3, T.Vector3]; feet: [T.Vector3, T.Vector3];
  hipDrop: number; lean: number; look: T.Vector3 | null; frozen: number;
};
type MatName = 'skin' | 'hair' | 'jersey' | 'shorts' | 'trim' | 'shoes' | 'sole' | 'sock' | 'eye' | 'white';

export class Baller {
  root = new T.Group();
  private hips = new T.Group();
  private spine = new T.Group();
  private head = new T.Group();
  private arms: Limb[] = [];
  private legs: Limb[] = [];
  private mats: Record<MatName, T.MeshStandardMaterial>;
  private ice: T.Mesh;
  private hairGroup = new T.Group();
  private aura: T.Mesh;
  private shadow: T.Mesh;
  private current = {hands: [new T.Vector3(), new T.Vector3()], feet: [new T.Vector3(), new T.Vector3()], hipDrop: 0, lean: 0};
  private started = false;
  private lookKey = '';
  /** One vertex-coloured mesh per bone keeps draw calls low; colours are repainted from `mats` on a look change. */
  private body = new T.MeshStandardMaterial({vertexColors: true, roughness: 0.6});
  private baked: T.Mesh[] = [];

  constructor(look: Look) {
    const std = (color: string, roughness = 0.7) => new T.MeshStandardMaterial({color, roughness});
    this.mats = {
      skin: std(look.skin, 0.52), hair: std(look.hair, 0.8), jersey: std('#ffffff', 0.72), shorts: std(look.shorts, 0.62), trim: std(look.trim, 0.6),
      shoes: std(look.shoes, 0.45), sole: std('#f5f2ea', 0.6), sock: std('#f5f3ee', 0.85), eye: std('#140e0b', 0.25), white: std('#fbf8f1', 0.4),
    };
    this.root.add(this.hips); this.hips.position.y = HIP_Y;
    // Pelvis: loose, longer shorts.
    const pelvis = this.part(new T.SphereGeometry(0.19, 22, 14), 'shorts', this.hips, 0, -0.02, 0); pelvis.scale.set(1.12, 0.8, 0.82);
    this.hips.add(this.spine); this.spine.position.y = 0.05;
    const torso = this.part(TORSO, 'jersey', this.spine, 0, 0, 0); torso.scale.set(1.18, 1, 0.74); torso.rotation.y = Math.PI; torso.userData.keep = true;
    this.part(new T.CylinderGeometry(0.06, 0.07, 0.12, 14), 'skin', this.spine, 0, 0.56, 0);
    // Head: bigger than life so the face reads on a phone.
    this.spine.add(this.head); this.head.position.y = 0.6;
    const skull = this.part(new T.SphereGeometry(0.175, 28, 20), 'skin', this.head, 0, 0.15, 0); skull.scale.set(0.94, 1.04, 0.98);
    this.part(new T.SphereGeometry(0.1, 16, 12), 'skin', this.head, 0, 0.07, 0.05, false).scale.set(1.1, 0.8, 1);
    for (const s of [-1, 1]) {
      const white = this.part(new T.SphereGeometry(0.036, 14, 10), 'white', this.head, s * 0.06, 0.17, 0.148, false); white.scale.set(1, 1.15, 0.5);
      this.part(new T.SphereGeometry(0.021, 12, 8), 'eye', this.head, s * 0.058, 0.168, 0.164, false);
      const brow = this.part(new T.CapsuleGeometry(0.011, 0.045, 3, 6), 'hair', this.head, s * 0.062, 0.222, 0.155, false); brow.rotation.z = Math.PI / 2 + s * 0.18;
      this.part(new T.SphereGeometry(0.036, 12, 10), 'skin', this.head, s * 0.165, 0.14, 0, true).scale.set(0.6, 1, 1);
    }
    this.part(new T.SphereGeometry(0.03, 12, 10), 'skin', this.head, 0, 0.125, 0.172, false).scale.set(1, 0.9, 0.9);
    const mouth = this.part(new T.TorusGeometry(0.03, 0.008, 6, 14, Math.PI), 'eye', this.head, 0, 0.078, 0.158, false); mouth.rotation.z = Math.PI;
    this.head.add(this.hairGroup);
    // Arms and legs: each bone hangs down its local -Y axis.
    for (const s of [-1, 1]) {
      const shoulder = new T.Group(); shoulder.position.set(s * 0.215, SHOULDER_Y - HIP_Y - 0.05, 0); this.spine.add(shoulder);
      const upper = new T.Group(); shoulder.add(upper);
      this.part(new T.SphereGeometry(0.075, 16, 12), 'skin', upper, 0, -0.01, 0);
      this.part(new T.CapsuleGeometry(0.064, UPPER_ARM - 0.08, 4, 14), 'skin', upper, 0, -UPPER_ARM / 2, 0);
      const lower = new T.Group(); lower.position.y = -UPPER_ARM; upper.add(lower);
      this.part(new T.CapsuleGeometry(0.054, LOWER_ARM - 0.13, 4, 14), 'skin', lower, 0, -(LOWER_ARM - 0.08) / 2, 0);
      this.part(new T.CylinderGeometry(0.062, 0.062, 0.07, 14), 'trim', lower, 0, -LOWER_ARM + 0.14, 0);
      const hand = this.part(new T.SphereGeometry(0.072, 16, 12), 'skin', lower, 0, -LOWER_ARM + 0.04, 0); hand.scale.set(0.9, 1.1, 0.72);
      this.arms.push({upper, lower, end: hand});
      const hip = new T.Group(); hip.position.set(s * 0.1, -0.04, 0); this.hips.add(hip);
      const thigh = new T.Group(); hip.add(thigh);
      this.part(new T.CylinderGeometry(0.125, 0.112, UPPER_LEG - 0.06, 16), 'shorts', thigh, 0, -UPPER_LEG / 2 + 0.06, 0);
      this.part(new T.CylinderGeometry(0.114, 0.114, 0.035, 16), 'trim', thigh, 0, -UPPER_LEG + 0.12, 0, false);
      this.part(new T.CapsuleGeometry(0.07, UPPER_LEG - 0.2, 4, 12), 'skin', thigh, 0, -UPPER_LEG + 0.06, 0, false);
      const shin = new T.Group(); shin.position.y = -UPPER_LEG; thigh.add(shin);
      this.part(new T.CapsuleGeometry(0.062, LOWER_LEG - 0.14, 4, 12), 'skin', shin, 0, -LOWER_LEG / 2 + 0.03, 0);
      this.part(new T.CylinderGeometry(0.068, 0.064, 0.17, 14), 'sock', shin, 0, -LOWER_LEG + 0.12, 0);
      for (const y of [0.16, 0.185]) this.part(new T.CylinderGeometry(0.069, 0.069, 0.012, 14), 'trim', shin, 0, -LOWER_LEG + y, 0, false);
      // Chunky high-top: upper, contrasting sole, toe cap and side flash.
      const foot = new T.Group(); foot.position.y = -LOWER_LEG; shin.add(foot);
      const upperShoe = this.part(new T.CapsuleGeometry(0.075, 0.17, 4, 14), 'shoes', foot, 0, -0.015, 0.055); upperShoe.rotation.x = Math.PI / 2; upperShoe.scale.set(1.2, 1, 0.9);
      this.part(new T.CylinderGeometry(0.078, 0.082, 0.1, 14), 'shoes', foot, 0, 0.03, -0.01);
      const sole = this.part(new T.CapsuleGeometry(0.07, 0.2, 4, 12), 'sole', foot, 0, -0.06, 0.055); sole.rotation.x = Math.PI / 2; sole.scale.set(1.35, 1, 0.38);
      const flash = this.part(new T.CapsuleGeometry(0.018, 0.1, 3, 8), 'trim', foot, s * 0.088, -0.02, 0.05, false); flash.rotation.set(Math.PI / 2, 0, 0.25 * s);
      this.legs.push({upper: thigh, lower: shin, end: foot});
    }
    this.ice = new T.Mesh(new T.CapsuleGeometry(0.45, 1.25, 4, 16), new T.MeshStandardMaterial({color: '#bfe8ff', roughness: 0.08, metalness: 0.1, transparent: true, opacity: 0.38, depthWrite: false}));
    this.ice.position.y = 1.05; this.ice.visible = false; this.root.add(this.ice);
    this.aura = new T.Mesh(new T.RingGeometry(0.42, 0.55, 40), new T.MeshBasicMaterial({color: '#ffd04a', transparent: true, opacity: 0.8, depthWrite: false, side: T.DoubleSide}));
    this.aura.rotation.x = -Math.PI / 2; this.aura.position.y = 0.015; this.aura.visible = false; this.root.add(this.aura);
    this.shadow = new T.Mesh(new T.PlaneGeometry(0.9, 0.62), new T.MeshBasicMaterial({map: shadowTexture(), transparent: true, depthWrite: false}));
    this.shadow.rotation.x = -Math.PI / 2; this.shadow.renderOrder = 1; this.root.add(this.shadow);
    for (const g of [this.hips, this.spine, this.head, ...this.arms.flatMap(l => [l.upper, l.lower]), ...this.legs.flatMap(l => [l.upper, l.lower, l.end])]) this.bake(g);
    this.setLook(look);
  }

  /** Adds a body part with an ink outline unless it is a small face or trim detail. */
  private part(geometry: T.BufferGeometry, mat: MatName, parent: T.Object3D, x = 0, y = 0, z = 0, outlined = true) {
    const o = new T.Mesh(geometry, this.mats[mat]); o.position.set(x, y, z); o.castShadow = true; o.userData.mat = mat; parent.add(o);
    if (outlined) {const line = new T.Mesh(geometry, outline()); line.castShadow = false; line.userData.outline = true; o.add(line);}
    return o;
  }

  /**
   * Merges a bone's loose parts (everything except the textured torso and the hand used as the IK end)
   * into one vertex-coloured mesh and one outline mesh.
   */
  private bake(group: T.Object3D) {
    const solids: T.BufferGeometry[] = [], lines: T.BufferGeometry[] = [], ranges: {mat: MatName; start: number; count: number}[] = [];
    let start = 0;
    for (const child of [...group.children]) {
      if (!(child instanceof T.Mesh) || child.userData.keep || child.userData.outline || this.arms.some(a => a.end === child)) continue;
      child.updateMatrix();
      const src = child.geometry.index ? child.geometry.toNonIndexed() : child.geometry.clone();
      const g = new T.BufferGeometry();
      g.setAttribute('position', src.attributes.position); g.setAttribute('normal', src.attributes.normal);
      g.applyMatrix4(child.matrix);
      const count = g.attributes.position.count;
      solids.push(g); ranges.push({mat: child.userData.mat as MatName, start, count}); start += count;
      if (child.children.some(c => c.userData.outline)) lines.push(g.clone());
      group.remove(child);
      if (child.geometry !== TORSO) child.geometry.dispose();
      src.dispose();
    }
    if (!solids.length) return;
    const geo = mergeGeometries(solids)!;
    geo.setAttribute('color', new T.BufferAttribute(new Float32Array(start * 3), 3));
    geo.userData.ranges = ranges;
    const mesh = new T.Mesh(geo, this.body); mesh.castShadow = true; mesh.userData.baked = true; group.add(mesh);
    if (lines.length) {const line = new T.Mesh(mergeGeometries(lines)!, outline()); line.userData.outline = true; line.userData.bakedLine = true; mesh.add(line);}
    for (const g of [...solids, ...lines]) g.dispose();
    this.baked.push(mesh);
    this.paint(mesh);
  }
  private paint(mesh: T.Mesh) {
    const colour = mesh.geometry.attributes.color as T.BufferAttribute;
    for (const r of mesh.geometry.userData.ranges as {mat: MatName; start: number; count: number}[]) {
      const c = this.mats[r.mat].color;
      for (let i = r.start; i < r.start + r.count; i++) colour.setXYZ(i, c.r, c.g, c.b);
    }
    colour.needsUpdate = true;
  }

  setLook(look: Look) {
    const key = JSON.stringify(look);
    if (key === this.lookKey) return;
    this.lookKey = key;
    this.mats.skin.color.set(look.skin); this.mats.hair.color.set(look.hair); this.mats.shorts.color.set(look.shorts);
    this.mats.shoes.color.set(look.shoes); this.mats.trim.color.set(look.trim);
    this.mats.sole.color.set(look.shoes === '#f4f1ea' || look.shoes === '#ffffff' || look.shoes === '#f6f0dc' ? look.trim : '#f5f2ea');
    this.mats.jersey.map?.dispose(); this.mats.jersey.map = jerseyTexture(look); this.mats.jersey.needsUpdate = true;
    for (const child of [...this.hairGroup.children]) {
      this.hairGroup.remove(child); (child as T.Mesh).geometry.dispose();
      for (const line of child.children) (line as T.Mesh).geometry.dispose();
      this.baked = this.baked.filter(m => m !== child);
    }
    const hair = (g: T.BufferGeometry, x: number, y: number, z: number, sx = 1, sy = 1, sz = 1, mat: MatName = 'hair') => {
      const o = this.part(g, mat, this.hairGroup, x, y, z); o.scale.set(sx, sy, sz); return o;
    };
    const cap = new T.SphereGeometry(0.18, 26, 14, 0, Math.PI * 2, 0, Math.PI * 0.5);
    if (look.hairStyle === 'short') {
      const top = hair(cap, 0, 0.16, -0.012, 0.97, 0.9, 1.0); top.rotation.x = -0.18;
      hair(new T.SphereGeometry(0.07, 12, 8), 0.02, 0.29, 0.1, 1.9, 0.55, 0.9);
    }
    if (look.hairStyle === 'buzz') {const top = hair(cap, 0, 0.165, -0.008, 0.965, 0.82, 1.0); top.rotation.x = -0.22;}
    if (look.hairStyle === 'puff') {
      const top = hair(cap, 0, 0.16, -0.012, 0.97, 0.9, 1.0); top.rotation.x = -0.18;
      hair(new T.IcosahedronGeometry(0.21, 2), 0, 0.33, -0.05, 1.1, 0.88, 1.0);
    }
    if (look.hairStyle === 'band') {
      const top = hair(cap, 0, 0.165, -0.012, 0.97, 0.95, 1.0); top.rotation.x = -0.2;
      const band = hair(new T.TorusGeometry(0.168, 0.026, 8, 30), 0, 0.235, 0.0, 1, 1, 1.03, 'trim'); band.rotation.x = Math.PI / 2 - 0.2;
    }
    this.bake(this.hairGroup);
    for (const m of this.baked) this.paint(m);
  }

  /** Forces textures to be repainted (after the display font loads). */
  invalidate() {this.lookKey = '';}

  /** Places the player at `x, y` in the court plane, facing `dir` (+1 right, -1 left), turned partly toward the camera. */
  place(x: number, y: number, dir: number) {
    this.root.position.set(x, y, 0);
    this.root.rotation.y = dir * (Math.PI / 2 - TURN);
    // The contact shadow stays on the floor and shrinks as the player rises.
    const k = Math.max(0.45, 1 - y * 0.45);
    this.shadow.position.set(0, 0.012 - y, 0); this.shadow.scale.set(k, k, k);
    (this.shadow.material as T.MeshBasicMaterial).opacity = k;
  }
  /** Converts a world point to this player's local frame (for poses). */
  toLocal(p: T.Vector3, out: T.Vector3) {this.root.updateMatrixWorld(true); return this.root.worldToLocal(out.copy(p));}
  /** World position of a hand (0 = left, 1 = right). */
  handWorld(i: number, out: T.Vector3) {return this.arms[i].end.getWorldPosition(out);}

  pose(p: Pose, dt: number, snappy: boolean) {
    const k = this.started ? 1 - Math.exp(-dt * (snappy ? 30 : 14)) : 1;
    this.started = true;
    const c = this.current;
    for (let i = 0; i < 2; i++) {c.hands[i].lerp(p.hands[i], k); c.feet[i].lerp(p.feet[i], Math.min(1, k * 1.4));}
    c.hipDrop += (p.hipDrop - c.hipDrop) * k; c.lean += (p.lean - c.lean) * k;
    this.hips.position.y = HIP_Y - c.hipDrop;
    this.spine.rotation.x = c.lean;
    this.root.updateMatrixWorld(true);
    if (p.look) {
      const target = this.root.localToWorld(_v.copy(p.look));
      const before = this.head.quaternion.clone();
      this.head.lookAt(target);
      const look = this.head.quaternion.clone();
      this.head.quaternion.copy(before).slerp(look, 0.12);
      // Keep the head within a natural range.
      const e = new T.Euler().setFromQuaternion(this.head.quaternion, 'YXZ');
      e.x = Math.max(-0.6, Math.min(0.5, e.x)); e.y = Math.max(-0.9, Math.min(0.9, e.y)); e.z = 0;
      this.head.quaternion.setFromEuler(e);
    } else this.head.quaternion.slerp(new T.Quaternion(), 0.1);
    this.root.updateMatrixWorld(true);
    const rootQ = this.root.getWorldQuaternion(new T.Quaternion());
    for (let i = 0; i < 2; i++) {
      const side = i === 0 ? -1 : 1;
      const hand = this.root.localToWorld(_e.copy(c.hands[i]).clone());
      reach(this.arms[i].upper, this.arms[i].lower, UPPER_ARM, LOWER_ARM - 0.04, hand, new T.Vector3(side * 0.6, -0.5, -0.7).normalize().applyQuaternion(rootQ));
      const foot = this.root.localToWorld(_e.copy(c.feet[i]).clone());
      reach(this.legs[i].upper, this.legs[i].lower, UPPER_LEG, LOWER_LEG, foot, new T.Vector3(side * 0.1, 0, 1).normalize().applyQuaternion(rootQ));
      // Feet stay level with the floor.
      const foot3 = this.legs[i].end; foot3.parent!.getWorldQuaternion(_q).invert(); foot3.quaternion.copy(_q.multiply(rootQ));
    }
    this.ice.visible = p.frozen > 0;
  }
  setAura(on: boolean, t: number) {this.aura.visible = on; if (on) {this.aura.rotation.z = t * 2; (this.aura.material as T.MeshBasicMaterial).opacity = 0.55 + Math.sin(t * 6) * 0.25;}}
  dispose() {
    this.root.traverse(o => {if (o instanceof T.Mesh && (!o.userData.outline || o.userData.bakedLine) && o.geometry !== TORSO) o.geometry.dispose();});
    this.body.dispose();
    for (const m of Object.values(this.mats)) {m.map?.dispose(); m.dispose();}
    (this.ice.material as T.Material).dispose(); (this.aura.material as T.Material).dispose();
    const shadow = this.shadow.material as T.MeshBasicMaterial; shadow.map?.dispose(); shadow.dispose();
  }
}
