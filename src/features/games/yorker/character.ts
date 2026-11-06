import * as T from 'three';
import {clone} from 'three/examples/jsm/utils/SkeletonUtils.js';
import type {GLTF} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {mergeGeometries} from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import {coarseBodyGeometry, refineBodyGeometry} from './player-geometry';
import {createKitMaterial, dressEquipment, ownsPlayerMaterial, type PlayerSurfaces} from './player-materials';
import {createPlayerHead} from './player-head';
import {playerBodyGeometry} from './player-jersey';

/**
 * Yorker players. The credited body/rig and batting cycle (CC-BY 4.0, bhagathartworks), original anatomical
 * heads and continuous skinned jerseys, shared near/far geometry, and CC0 3DAssets.dev equipment fitted to
 * the bones. Bowling, fielding, keeping and umpiring motion are authored on this same independent rig system.
 */
export type Dir = readonly [number, number, number];
export type Limb = readonly [Dir, Dir];
/** Body-frame pose: +x the player's left, +y up, +z forward. Limb directions are in the player's frame. */
export type BodyPose = {
  drop?: number; lift?: number; lean?: number; bend?: number; turn?: number; twist?: number;
  head?: Dir; la?: Limb; ra?: Limb; ll?: Limb; rl?: Limb; lf?: Dir; rf?: Dir;
};
export type Kit = {shirt: string; trim: string; trousers: string; skin: string; hair: string; sleeve?: string; hand?: string; shoes?: string; beard?: boolean};
export type Role = 'batter' | 'bowler' | 'keeper' | 'fielder' | 'umpire';
export type PlayerOptions = {kit: Kit; number: string; role: Role; helmet?: string; cap?: string; left?: boolean; name?: string; club?: string; badge?: string; height?: number};
export type GearAssets = {helmet: T.Object3D; bat: T.Object3D; pads: [T.Object3D, T.Object3D]; gloves: [T.Object3D, T.Object3D]; keeperGloves: [T.Object3D, T.Object3D]};
export type PlayerAssets = {gltf: GLTF; gear: GearAssets; surfaces: PlayerSurfaces};

/** Times (s) in the source batting cycle. */
export const CYCLE = {stance: .12, trigger: .3, contact: 1.14, finish: 1.85, carry: 4.6, wait: 5.8, settle: 5.95};
/** Bat mesh local frame (source units): handle top, shoulder, sweet spot and toe along y; face near z = .3. */
const BLADE = {handle: -1.27, shoulder: 1.1, sweet: 3.95, toe: 6.0, z: .3};
const HEIGHT = 1.8;
const V = (x = 0, y = 0, z = 0) => new T.Vector3(x, y, z), Q = () => new T.Quaternion();
const clamp = (n: number, a = 0, b = 1) => Math.max(a, Math.min(b, n));
export const smooth = (a: number, b: number, x: number) => {const t = clamp((x-a)/(b-a)); return t*t*(3-2*t);};
const worldPos = (o: T.Object3D) => o.getWorldPosition(V());
const worldQuat = (o: T.Object3D) => o.getWorldQuaternion(Q());
function setWorldQuaternion(o: T.Object3D, q: T.Quaternion) {o.quaternion.copy((o.parent ? worldQuat(o.parent) : Q()).invert().multiply(q)); o.updateMatrixWorld(true);}
function rotateWorld(o: T.Object3D, r: T.Quaternion) {setWorldQuaternion(o, r.clone().multiply(worldQuat(o)));}
function setWorldPosition(o: T.Object3D, p: T.Vector3) {o.position.copy(o.parent ? o.parent.worldToLocal(p.clone()) : p); o.updateMatrixWorld(true);}
function limited(q: T.Quaternion, max: number) {const angle = 2*Math.acos(clamp(Math.abs(q.w), 0, 1)); return angle > max && angle > 1e-6 ? Q().slerp(q, max/angle) : q;}

/* ---------- Pose maths ---------- */
const nlerp = (a: Dir | undefined, b: Dir | undefined, t: number): Dir | undefined => {
  if (!a) return b; if (!b) return a;
  const x = a[0]+(b[0]-a[0])*t, y = a[1]+(b[1]-a[1])*t, z = a[2]+(b[2]-a[2])*t, l = Math.hypot(x, y, z) || 1;
  return [x/l, y/l, z/l];
};
const limbLerp = (a: Limb | undefined, b: Limb | undefined, t: number): Limb | undefined => !a ? b : !b ? a : [nlerp(a[0], b[0], t)!, nlerp(a[1], b[1], t)!];
const num = (a: number | undefined, b: number | undefined, t: number) => (a ?? 0)+((b ?? 0)-(a ?? 0))*t;
export function lerpPose(a: BodyPose, b: BodyPose, t: number): BodyPose {
  return {drop: num(a.drop, b.drop, t), lift: num(a.lift, b.lift, t), lean: num(a.lean, b.lean, t), bend: num(a.bend, b.bend, t), turn: num(a.turn, b.turn, t), twist: num(a.twist, b.twist, t),
    head: nlerp(a.head, b.head, t), la: limbLerp(a.la, b.la, t), ra: limbLerp(a.ra, b.ra, t), ll: limbLerp(a.ll, b.ll, t), rl: limbLerp(a.rl, b.rl, t), lf: nlerp(a.lf, b.lf, t), rf: nlerp(a.rf, b.rf, t)};
}
/** Keyframed pose at time t with smooth easing between keys. */
export function keyed(keys: readonly (readonly [number, BodyPose])[], t: number): BodyPose {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) if (t <= keys[i][0]) {const [ta, a] = keys[i-1], [tb, b] = keys[i]; return lerpPose(a, b, smooth(0, 1, (t-ta)/(tb-ta)));}
  return keys[keys.length-1][1];
}
/** Locomotion: `phase` advances one stride (π) per footstep; `pace` 0 walk .. 1 sprint. */
export function stride(phase: number, pace: number, carry = false): BodyPose {
  const swing = .42+.5*pace, kneeLift = .55+.75*pace, pose: BodyPose = {lean: .05+.22*pace, drop: -.02-.05*pace};
  const legs: Limb[] = [], arms: Limb[] = [];
  for (const [sign, off] of [[1, 0], [-1, Math.PI]] as const) {
    const s = Math.sin(phase+off), thigh = s*swing, knee = .22+Math.max(0, -Math.sin(phase+off-.9))*kneeLift;
    legs.push([[sign*.06, -Math.cos(thigh), Math.sin(thigh)], [sign*.03, -Math.cos(thigh-knee), Math.sin(thigh-knee)]]);
    const arm = -s*swing*1.15;
    arms.push([[sign*.22, -Math.cos(arm), Math.sin(arm)], [sign*.03, -Math.cos(arm+.9+.6*pace), Math.sin(arm+.9+.6*pace)]]);
  }
  pose.ll = legs[0]; pose.rl = legs[1]; pose.la = arms[0]; pose.ra = carry ? [[-.2, -.95, .25], [-.1, -.55, .85]] : arms[1];
  pose.lf = [.05, -.3, 1]; pose.rf = [-.05, -.3, 1]; pose.head = [0, 1, .18];
  return pose;
}

/* ---------- Authored poses (right-handed; the rig mirrors left-handers) ---------- */
const STAND: BodyPose = {la: [[.22, -1, .05], [.06, -.85, .45]], ra: [[-.22, -1, .05], [-.06, -.85, .45]], ll: [[.06, -1, .02], [.04, -1, -.02]], rl: [[-.06, -1, .02], [-.04, -1, -.02]], head: [0, 1, .12]};
export const POSES: Record<string, BodyPose> = {
  stand: STAND,
  ready: {drop: -.12, lean: .32, la: [[.2, -.85, .45], [.02, -.6, .8]], ra: [[-.2, -.85, .45], [-.02, -.6, .8]], ll: [[.18, -1, .3], [.06, -1, -.25]], rl: [[-.18, -1, .3], [-.06, -1, -.25]], head: [0, 1, .45]},
  slip: {drop: -.36, lean: .62, la: [[.15, -.75, .65], [-.05, -.55, .85]], ra: [[-.15, -.75, .65], [.05, -.55, .85]], ll: [[.3, -.9, .6], [.08, -1, -.3]], rl: [[-.3, -.9, .6], [-.08, -1, -.3]], head: [0, 1, .4]},
  keep: {drop: -.62, lean: .5, la: [[.1, -.75, .7], [-.12, -.45, .9]], ra: [[-.1, -.75, .7], [.12, -.45, .9]], ll: [[.55, -.55, .9], [.1, -1, -.5]], rl: [[-.55, -.55, .9], [-.1, -1, -.5]], head: [0, 1, .4]},
  catchHigh: {lean: -.05, la: [[.12, .3, 1], [-.15, .7, .7]], ra: [[-.12, .3, 1], [.15, .7, .7]], ll: [[.1, -1, .1], [.05, -1, -.05]], rl: [[-.1, -1, .1], [-.05, -1, -.05]], head: [0, 1, .1]},
  appeal: {lean: -.2, la: [[.5, .85, .3], [.25, 1, .1]], ra: [[-.5, .85, .3], [-.25, 1, .1]], ll: [[.12, -1, .12], [.05, -1, -.05]], rl: [[-.12, -1, -.2], [-.05, -1, -.3]], head: [0, 1, -.15]},
  celebrate: {lean: -.1, la: [[.85, .4, .2], [.6, .8, .1]], ra: [[-.85, .4, .2], [-.6, .8, .1]], ll: [[.1, -1, .05], [.05, -1, 0]], rl: [[-.1, -1, .05], [-.05, -1, 0]], head: [0, 1, -.1]},
  dejected: {lean: .32, la: [[.15, -1, .1], [.05, -.9, .3]], ra: [[-.15, -1, .1], [-.05, -.9, .3]], ll: [[.08, -1, .03], [.04, -1, 0]], rl: [[-.08, -1, .03], [-.04, -1, 0]], head: [0, .8, .6]},
  umpire: {lean: .06, la: [[.18, -1, .25], [-.25, -.5, .8]], ra: [[-.18, -1, .25], [.25, -.5, .8]], ll: [[.1, -1, 0], [.05, -1, 0]], rl: [[-.1, -1, 0], [-.05, -1, 0]], head: [0, 1, .1]},
  umpireCrouch: {drop: -.1, lean: .38, la: [[.2, -.9, .45], [.05, -.7, .7]], ra: [[-.2, -.9, .45], [-.05, -.7, .7]], ll: [[.14, -1, .2], [.05, -1, -.15]], rl: [[-.14, -1, .2], [-.05, -1, -.15]], head: [0, 1, .35]},
  signalOut: {la: [[.18, -1, .2], [-.25, -.5, .8]], ra: [[-.12, 1, .3], [-.05, 1, .15]], ll: [[.1, -1, 0], [.05, -1, 0]], rl: [[-.1, -1, 0], [-.05, -1, 0]], head: [0, 1, .05]},
  signalSix: {la: [[.25, 1, .15], [.1, 1, .05]], ra: [[-.25, 1, .15], [-.1, 1, .05]], ll: [[.1, -1, 0], [.05, -1, 0]], rl: [[-.1, -1, 0], [-.05, -1, 0]], head: [0, 1, 0]},
  signalWide: {la: [[1, .05, .1], [1, .05, .1]], ra: [[-1, .05, .1], [-1, .05, .1]], ll: [[.1, -1, 0], [.05, -1, 0]], rl: [[-.1, -1, 0], [-.05, -1, 0]], head: [0, 1, .05]},
  signalNoBall: {la: [[.18, -1, .2], [.05, -.9, .3]], ra: [[-1, .05, .1], [-1, .05, .1]], ll: [[.1, -1, 0], [.05, -1, 0]], rl: [[-.1, -1, 0], [-.05, -1, 0]], head: [-.3, 1, .2]},
  duck: {drop: -.5, lean: .75, la: [[.2, -.6, .6], [0, -.4, .9]], ra: [[-.2, -.6, .6], [0, -.4, .9]], ll: [[.25, -.6, .8], [.05, -1, -.4]], rl: [[-.25, -.6, .7], [-.05, -1, -.4]], head: [0, .3, 1]},
};
/** Wave for the four signal: the arm sweeps across the chest. */
export function signalFour(t: number): BodyPose {const a = Math.sin(t*9)*.75; return {...POSES.signalOut, ra: [[-.25+a, .05, .95], [-.25+a*1.2, .05, .95]]};}

/** Pace bowler's delivery stride, seconds relative to release (negative before). Side-on action, right arm over. */
const PACE_ACTION: readonly (readonly [number, BodyPose])[] = [
  [-.62, {lean: .2, la: [[.25, -.6, .7], [.1, -.2, .95]], ra: [[-.25, -.75, -.5], [-.05, -.9, .2]], ll: [[.05, -.75, .65], [.03, -1, .05]], rl: [[-.05, -.9, -.4], [-.03, -.5, -.85]]}],
  [-.42, {lift: .2, lean: -.05, turn: .4, la: [[.15, .55, .8], [.05, .9, .4]], ra: [[-.1, .45, .85], [0, .9, .35]], ll: [[.08, -.45, .9], [.05, -.95, .2]], rl: [[-.06, -.95, -.1], [-.02, -.75, -.6]]}],
  [-.22, {drop: -.04, lean: -.18, turn: 1.25, twist: .25, la: [[.05, .5, .86], [0, .45, .9]], ra: [[-.15, -.82, -.5], [-.08, -.9, -.4]], ll: [[.05, -.4, .9], [.05, -.95, .25]], rl: [[-.06, -1, -.05], [-.02, -1, .05]]}],
  [-.08, {drop: -.06, lean: -.05, turn: .9, twist: .1, la: [[.25, .05, .95], [.35, -.35, .85]], ra: [[-.2, .15, -.95], [-.1, .55, -.82]], ll: [[.04, -.88, .45], [.04, -.88, .45]], rl: [[-.05, -.9, -.4], [-.03, -.55, -.8]]}],
  [0, {drop: -.04, lean: .22, turn: .2, twist: -.15, la: [[.38, -.7, .25], [.45, -.6, -.4]], ra: [[-.12, .97, .2], [-.05, .95, .32]], ll: [[.04, -.9, .4], [.03, -.92, .35]], rl: [[-.05, -.8, -.55], [0, -.3, -.95]]}],
  [.18, {drop: -.1, lean: .6, turn: -.15, twist: -.35, la: [[.3, -.85, -.35], [.2, -.9, -.2]], ra: [[.45, -.55, .7], [.6, -.7, .25]], ll: [[.05, -.95, .25], [.03, -1, .05]], rl: [[-.05, -.55, .8], [0, -.95, .25]]}],
  [.42, {drop: -.06, lean: .38, la: [[.25, -.7, -.5], [.1, -.4, .8]], ra: [[.2, -.85, .45], [.15, -.6, .75]], ll: [[.06, -.9, -.4], [.03, -.6, -.8]], rl: [[-.06, -.7, .7], [-.03, -1, .1]]}],
];
/** Leg-spinner: a short skip, slower arm, wrist rotation at release. */
const SPIN_ACTION: readonly (readonly [number, BodyPose])[] = [
  [-.5, {lean: .12, la: [[.25, -.8, .5], [.1, -.4, .9]], ra: [[-.25, -.8, .3], [-.1, -.5, .85]], ll: [[.05, -.85, .5], [.03, -1, 0]], rl: [[-.05, -.95, -.3], [-.03, -.6, -.75]]}],
  [-.3, {lift: .1, turn: .9, la: [[.1, .6, .8], [.05, .9, .4]], ra: [[-.1, .3, .9], [0, .8, .55]], ll: [[.06, -.5, .85], [.04, -.95, .25]], rl: [[-.05, -1, -.05], [-.02, -.8, -.5]]}],
  [-.12, {lean: -.1, turn: 1.15, twist: .2, la: [[.05, .55, .83], [0, .5, .86]], ra: [[-.12, -.4, -.9], [-.05, .1, -.99]], ll: [[.04, -.85, .5], [.04, -.9, .4]], rl: [[-.05, -1, -.1], [-.02, -.9, -.4]]}],
  [0, {lean: .25, turn: .3, twist: -.1, la: [[.35, -.7, .3], [.4, -.6, -.3]], ra: [[-.15, .95, .25], [-.05, .85, .5]], ll: [[.04, -.92, .35], [.03, -.95, .3]], rl: [[-.05, -.85, -.5], [0, -.4, -.9]]}],
  [.2, {lean: .5, turn: -.1, twist: -.3, la: [[.3, -.85, -.3], [.2, -.9, -.2]], ra: [[.4, -.6, .65], [.55, -.7, .3]], ll: [[.05, -.95, .2], [.03, -1, .05]], rl: [[-.05, -.6, .75], [0, -.95, .2]]}],
  [.45, {lean: .2, la: [[.2, -.95, .1], [.05, -.8, .5]], ra: [[-.15, -.95, .2], [-.05, -.8, .5]], ll: [[.06, -1, .05], [.03, -1, 0]], rl: [[-.06, -1, .05], [-.03, -1, 0]]}],
];
export function bowlingAction(spin: boolean, t: number): BodyPose {return keyed(spin ? SPIN_ACTION : PACE_ACTION, t);}
export const ACTION_START = {pace: -.62, spin: -.5};
/** A fielder's throw (seconds since the wind-up). */
export function throwAction(t: number): BodyPose {
  return keyed([[0, POSES.ready], [.18, {lean: -.05, turn: .9, la: [[.3, .3, .9], [.2, .5, .85]], ra: [[-.2, .2, -.95], [-.1, .6, -.8]], ll: [[.06, -.8, .55], [.04, -.95, .2]], rl: [[-.06, -1, -.15], [-.03, -.9, -.3]]}],
    [.32, {lean: .35, turn: -.1, twist: -.25, la: [[.3, -.8, -.2], [.2, -.9, 0]], ra: [[-.1, .3, .95], [0, .1, 1]], ll: [[.06, -.9, .4], [.04, -.95, .3]], rl: [[-.06, -.8, -.5], [0, -.4, -.9]]}],
    [.62, POSES.stand]], t);
}

/** Split a pair model (two items side by side along x) into its left (x>0) and right (x<0) items. */
export function splitPair(source: T.Object3D): [T.Object3D, T.Object3D] {
  source.updateMatrixWorld(true);
  const out: [T.Group, T.Group] = [new T.Group(), new T.Group()];
  source.traverse(o => {
    if (!(o instanceof T.Mesh)) return;
    const g = o.geometry.index ? o.geometry.toNonIndexed() : o.geometry.clone();
    g.applyMatrix4(o.matrixWorld);
    const pos = g.getAttribute('position'), parts: number[][] = [[], []];
    for (let i = 0; i < pos.count; i += 3) {const cx = (pos.getX(i)+pos.getX(i+1)+pos.getX(i+2))/3; parts[cx > 0 ? 0 : 1].push(i);}
    parts.forEach((tris, side) => {
      if (!tris.length) return;
      const piece = new T.BufferGeometry(), attrs = Object.keys(g.attributes);
      for (const name of attrs) {
        const src = g.getAttribute(name), size = src.itemSize, arr = new Float32Array(tris.length*3*size);
        tris.forEach((start, k) => {for (let v = 0; v < 3; v++) for (let s = 0; s < size; s++) arr[(k*3+v)*size+s] = src.getComponent(start+v, s);});
        piece.setAttribute(name, new T.BufferAttribute(arr, size));
      }
      if (!piece.getAttribute('normal')) piece.computeVertexNormals();
      const mesh = new T.Mesh(piece, (o.material as T.Material).clone()); mesh.castShadow = true; mesh.receiveShadow = true;
      out[side].add(mesh);
    });
  });
  for (const group of out) {const box = new T.Box3().setFromObject(group), c = box.getCenter(V()); group.children.forEach(m => (m as T.Mesh).geometry.translate(-c.x, -box.min.y, -c.z));}
  return out;
}

export type PlayerSnapshot = Map<T.Object3D, {p: T.Vector3; q: T.Quaternion}>;
export class Player {
  /** `outer` carries world position, yaw and the left-hander mirror; poses are solved unmirrored inside it. */
  outer = new T.Group(); root = new T.Group();
  readonly role: Role; readonly left: boolean;
  private orient = new T.Group(); private model: T.Object3D;
  private bones = new Map<string, T.Bone>(); private rest = new Map<T.Object3D, {p: T.Vector3; q: T.Quaternion}>(); private animated: T.Object3D[] = [];
  private tracks: {target: T.Object3D; path: 'position' | 'quaternion' | 'scale'; interpolant: T.Interpolant}[] = [];
  private duration = 1; private body!: T.SkinnedMesh; private batNode: T.Object3D | null = null; private batMesh: T.Object3D | null = null;
  private carry: {p: T.Vector3; q: T.Quaternion} | null = null;
  private key = ''; private blendFrom: PlayerSnapshot | null = null; private blendStart = 0; private blendTime = .25; private lastTime = 0;
  private standHeight = .95; private scaleFactor = 1;
  private surfaces: PlayerSurfaces;
  private bodyLevels!: {near: T.BufferGeometry; far: T.BufferGeometry};
  private headLevels!: {near: T.Group; far: T.Group};
  /** The last authored pose, so an unchanged static pose is not solved again every frame. */
  private cached: BodyPose | null = null;
  /** Native sweet-spot position at contact, in root space. */
  contactLocal = V();
  bladeError = 0; gripError = 0;
  ballHand: T.Bone;

  constructor(assets: PlayerAssets, readonly options: PlayerOptions) {
    this.role = options.role; this.left = !!options.left;
    this.surfaces = assets.surfaces;
    this.outer.name = `Yorker ${this.role} ${options.name ?? options.number}`;
    this.orient.rotation.y = Math.PI; this.root.add(this.orient); this.outer.add(this.root);
    this.model = clone(assets.gltf.scene); this.orient.add(this.model);
    this.model.traverse(o => {
      if ((o as T.Bone).isBone) {const bone = o as T.Bone; this.bones.set(bone.name.replace(/_\d+$/, ''), bone); this.animated.push(bone);}
      if (o instanceof T.SkinnedMesh) this.body = o;
      if (o.name === 'Cricketer_Bat') this.batNode = o;
      if (o.name === 'Cricketer_Bat_Mesh') this.batMesh = o;
    });
    if (!this.body || !this.batNode || !this.batMesh) throw Error('Player model is incomplete');
    this.animated.push(this.batNode);
    for (const o of this.animated) this.rest.set(o, {p: o.position.clone(), q: o.quaternion.clone()});
    this.ballHand = this.bone('RightHand');
    const tailored = playerBodyGeometry(this.body);
    this.bodyLevels = {near: refineBodyGeometry(tailored), far: coarseBodyGeometry(tailored)};
    this.body.geometry = this.bodyLevels.near;
    this.body.material = createKitMaterial(options, this.surfaces);
    this.body.material.userData.yorkerOwned = true;
    this.body.castShadow = true; this.body.receiveShadow = true; this.body.frustumCulled = false;
    const clip = assets.gltf.animations[0]; if (!clip) throw Error('Batting cycle missing');
    this.duration = clip.duration;
    for (const track of clip.tracks) {
      const {nodeName, propertyName} = T.PropertyBinding.parseTrackName(track.name), target = T.PropertyBinding.findNode(this.model, nodeName) as T.Object3D | null;
      if (!target || (propertyName !== 'position' && propertyName !== 'quaternion' && propertyName !== 'scale')) continue;
      const size = track.getValueSize(), result = new Float32Array(size);
      const interpolant = propertyName === 'quaternion' ? new T.QuaternionLinearInterpolant(track.times, track.values, size, result) : new T.LinearInterpolant(track.times, track.values, size, result);
      this.tracks.push({target, path: propertyName, interpolant});
    }
    // Athlete stature is measured on the upright carry frame; all gear is fitted after scaling.
    this.sample(CYCLE.carry);
    const top = worldPos(this.bone('HeadTop_End')).y;
    this.scaleFactor = (options.height ?? HEIGHT)/(top+.09); this.model.scale.multiplyScalar(this.scaleFactor);
    this.root.updateMatrixWorld(true);
    this.standHeight = this.root.worldToLocal(worldPos(this.bone('Hips'))).y;
    this.carry = {p: this.batNode.position.clone(), q: this.batNode.quaternion.clone()};
    this.sample(CYCLE.contact); this.contactLocal.copy(this.root.worldToLocal(this.sweetSpot()));
    this.sample(CYCLE.stance);
    this.fitGear(assets.gear);
    this.batNode.visible = this.role === 'batter';
    this.applyMirror();
  }

  bone(name: string) {const b = this.bones.get(name); if (!b) throw Error('Rig is missing '+name); return b;}
  private sample(t: number) {
    const time = ((t%this.duration)+this.duration)%this.duration;
    for (const {target, path, interpolant} of this.tracks) target[path].fromArray(interpolant.evaluate(time) as unknown as number[]);
    this.root.updateMatrixWorld(true);
  }
  private reset() {for (const [o, r] of this.rest) {o.position.copy(r.p); o.quaternion.copy(r.q);} this.root.updateMatrixWorld(true);}
  private snapshot(): PlayerSnapshot {const s: PlayerSnapshot = new Map(); for (const o of this.animated) s.set(o, {p: o.position.clone(), q: o.quaternion.clone()}); return s;}
  sweetSpot() {return this.batMesh!.localToWorld(V(0, BLADE.sweet, BLADE.z));}
  /** Direction in the player's body frame (+x left, +y up, +z forward) as a world vector. */
  dir(x: number, y: number, z: number) {return V(x, y, z).normalize().applyQuaternion(worldQuat(this.root));}
  /** World point to the unmirrored solving space (left-handers are mirrored about the player's x). */
  solveSpace(p: T.Vector3) {
    if (!this.left) return p.clone();
    const local = this.outer.worldToLocal(p.clone()); local.x = -local.x; return this.outer.localToWorld(local);
  }

  /** Place the player: world position and facing yaw (radians, 0 faces world +z). */
  place(x: number, z: number, yaw: number, y = 0) {this.outer.position.set(x, y, z); this.outer.rotation.y = yaw;}
  /** Begin a frame: crossfade when the action key changes. Then pose, then call end(). */
  begin(time: number, key: string, blend = .22) {
    if (this.left) {this.outer.scale.x = 1; this.outer.updateMatrixWorld(true);}
    if (key !== this.key) {if (this.key) {this.blendFrom = this.snapshot(); this.blendStart = time; this.blendTime = blend;} this.key = key; this.cached = null;}
    this.lastTime = time;
  }
  end() {
    if (this.blendFrom) {
      const w = smooth(0, 1, (this.lastTime-this.blendStart)/this.blendTime);
      if (w >= 1 || this.lastTime < this.blendStart) this.blendFrom = null;
      else for (const [o, from] of this.blendFrom) {o.position.lerpVectors(from.p, o.position, w); o.quaternion.copy(from.q.clone().slerp(o.quaternion, w));}
    }
    this.applyMirror();
  }
  private applyMirror() {this.outer.scale.x = this.left ? -1 : 1; this.outer.updateMatrixWorld(true);}
  /** Bind-space directions must follow the skin, not the root: the source skull has a turned rest frame. */
  private skinFrame(bone: T.Bone) {
    const i = this.body.skeleton.bones.indexOf(bone);
    return this.body.matrixWorld.clone().multiply(this.body.bindMatrixInverse).multiply(bone.matrixWorld)
      .multiply(this.body.skeleton.boneInverses[i]).multiply(this.body.bindMatrix);
  }

  /* ---------- Clip-driven batting ---------- */
  /** Batting cycle at clip time t (seconds). */
  clip(t: number) {this.cached = null; this.reset(); this.sample(t); this.batNode!.visible = this.role === 'batter';}
  /** Ready: relaxed, then the trigger into the high backlift as the bowler arrives. `p` 0..1, then a held waggle. */
  ready(p: number, time: number) {
    const getSet = this.duration-CYCLE.settle+CYCLE.stance;
    this.clip(p < 1 ? CYCLE.settle+smooth(0, 1, p)*getSet : CYCLE.stance+.035*Math.sin(time*2.2));
  }
  /** Swing progress s: 0 trigger, .5 contact, 1 finish. */
  swing(s: number) {
    const t = s <= .5 ? CYCLE.trigger+(CYCLE.contact-CYCLE.trigger)*Math.pow(s/.5, 1.3) : CYCLE.contact+(CYCLE.finish-CYCLE.contact)*(s-.5)/.5;
    this.clip(t);
  }
  /** Rotate the spine about the vertical (shot direction) and lean. */
  spineTurn(yaw: number, lean = 0) {
    this.cached = null;
    if (Math.abs(yaw) > 1e-4) rotateWorld(this.bone('Spine'), Q().setFromAxisAngle(this.dir(0, 1, 0), yaw));
    if (Math.abs(lean) > 1e-4) rotateWorld(this.bone('Spine1'), Q().setFromAxisAngle(this.dir(1, 0, 0), lean));
  }
  /** Drop the hips with both feet planted. */
  crouch(drop: number) {
    this.cached = null;
    if (drop < .002) return;
    const feet = ['Left', 'Right'].map(side => {const b = this.bone(side+'Foot'); return {p: worldPos(b), q: worldQuat(b)};});
    const hips = this.bone('Hips'); setWorldPosition(hips, worldPos(hips).add(this.dir(0, -1, 0).multiplyScalar(drop)));
    ['Left', 'Right'].forEach((side, i) => {this.solveChain(side+'UpLeg', side+'Leg', side+'Foot', feet[i].p); setWorldQuaternion(this.bone(side+'Foot'), feet[i].q);});
  }
  /** Raise the hands (and bat) for a leave. */
  liftHands(amount: number) {
    this.cached = null;
    if (amount < .01) return;
    rotateWorld(this.bone('Spine2'), Q().setFromAxisAngle(this.dir(0, 1, 0), .25*amount));
    for (const side of ['Left', 'Right']) rotateWorld(this.bone(side+'Arm'), Q().setFromAxisAngle(this.dir(1, 0, 0), -.55*amount));
  }
  /** Two-bone IK: place `endName` at `target`, bending toward `pole`. */
  solveChain(upperName: string, lowerName: string, endName: string, target: T.Vector3, pole?: T.Vector3) {
    const upper = this.bone(upperName), lower = this.bone(lowerName), end = this.bone(endName);
    const a = worldPos(upper), b = worldPos(lower), c = worldPos(end), l1 = a.distanceTo(b), l2 = b.distanceTo(c);
    const toTarget = target.clone().sub(a), d = clamp(toTarget.length(), Math.abs(l1-l2)+.001, l1+l2-.001); toTarget.normalize();
    const hint = pole ? pole.clone() : b.clone().sub(a);
    const bend = hint.addScaledVector(toTarget, -hint.dot(toTarget));
    if (bend.lengthSq() < 1e-8) bend.copy(this.dir(0, 0, 1)); bend.normalize();
    const cosine = clamp((l1*l1+d*d-l2*l2)/(2*l1*d), -1, 1), elbow = a.clone().addScaledVector(toTarget, l1*cosine).addScaledVector(bend, l1*Math.sqrt(1-cosine*cosine));
    rotateWorld(upper, Q().setFromUnitVectors(b.clone().sub(a).normalize(), elbow.sub(a).normalize()));
    const now = worldPos(lower); rotateWorld(lower, Q().setFromUnitVectors(worldPos(end).sub(now).normalize(), target.clone().sub(now).normalize()));
    return worldPos(end).distanceTo(target);
  }
  /** Bring the bat's sweet spot onto `target` (world, solving space): spine and shoulder CCD, wrist pivot, top hand re-grips. */
  batTo(target: T.Vector3, weight: number) {
    this.cached = null;
    const leftHand = this.bone('LeftHand'), bat = this.batMesh!;
    const batInverse = bat.matrixWorld.clone().invert();
    const grip = worldPos(leftHand).applyMatrix4(batInverse), gripTurn = worldQuat(bat).invert().multiply(worldQuat(leftHand));
    if (weight > .001) {
      const joints: [string, number][] = [['Spine', .32], ['Spine1', .32], ['Spine2', .36], ['RightArm', .6]];
      for (let pass = 0; pass < 5; pass++) for (const [name, max] of joints) {
        const bone = this.bone(name), pivot = worldPos(bone), from = this.sweetSpot().sub(pivot), to = target.clone().sub(pivot);
        if (from.lengthSq() < 1e-6 || to.lengthSq() < 1e-6) continue;
        rotateWorld(bone, limited(Q().slerp(Q().setFromUnitVectors(from.normalize(), to.normalize()), weight), max*weight));
      }
      const pivot = bat.localToWorld(V(0, BLADE.handle+.6, BLADE.z)), from = this.sweetSpot().sub(pivot), to = target.clone().sub(pivot);
      const turn = limited(Q().slerp(Q().setFromUnitVectors(from.normalize(), to.normalize()), weight), .8*weight);
      const node = this.batNode!, position = worldPos(node).sub(pivot).applyQuaternion(turn).add(pivot);
      setWorldQuaternion(node, turn.clone().multiply(worldQuat(node))); setWorldPosition(node, position);
    }
    const want = grip.applyMatrix4(bat.matrixWorld);
    this.gripError = this.solveChain('LeftArm', 'LeftForeArm', 'LeftHand', want, this.dir(-.2, -.6, -.4));
    setWorldQuaternion(leftHand, worldQuat(bat).multiply(gripTurn));
    this.bladeError = this.sweetSpot().distanceTo(target);
  }
  /** Move a hand (and arm) to a world point, e.g. a keeper taking the ball. */
  handTo(side: 'Left' | 'Right', target: T.Vector3, pole?: T.Vector3) {this.cached = null; return this.solveChain(side+'Arm', side+'ForeArm', side+'Hand', target, pole ?? this.dir(side === 'Left' ? .6 : -.6, -.6, -.3));}
  /** Plant a foot at a world point. */
  footTo(side: 'Left' | 'Right', target: T.Vector3) {this.cached = null; const foot = this.bone(side+'Foot'), q = worldQuat(foot); this.solveChain(side+'UpLeg', side+'Leg', side+'Foot', target, this.dir(0, 0, 1)); setWorldQuaternion(foot, q);}
  footWorld(side: 'Left' | 'Right') {return worldPos(this.bone(side+'Foot'));}
  handWorld(side: 'Left' | 'Right') {return worldPos(this.bone(side+'Hand'));}
  headWorld() {return worldPos(this.bone('Head'));}

  /* ---------- Authored motion ---------- */
  pose(p: BodyPose, grounded = true) {
    // Bone rotations are local, so a cached pose stays valid wherever the player is placed.
    if (p === this.cached && !this.blendFrom) return;
    this.cached = p;
    this.reset(); this.sample(CYCLE.carry);
    const lean = p.lean ?? 0, turn = p.turn ?? 0;
    const hips = this.bone('Hips'), spine1 = this.bone('Spine1');
    const up = worldPos(spine1).sub(worldPos(hips)).normalize(), left = worldPos(this.bone('LeftUpLeg')).sub(worldPos(this.bone('RightUpLeg')));
    left.addScaledVector(up, -left.dot(up)).normalize();
    const current = new T.Matrix4().makeBasis(left, up, left.clone().cross(up));
    const wantUp = this.dir(0, Math.cos(lean*.35), Math.sin(lean*.35)), wantLeft = this.dir(1, 0, 0).applyAxisAngle(this.dir(0, 1, 0), turn);
    wantLeft.addScaledVector(wantUp, -wantLeft.dot(wantUp)).normalize();
    const desired = new T.Matrix4().makeBasis(wantLeft, wantUp, wantLeft.clone().cross(wantUp));
    rotateWorld(hips, Q().setFromRotationMatrix(desired.multiply(current.transpose())));
    setWorldPosition(hips, this.root.localToWorld(V(0, this.standHeight+(p.drop ?? 0), 0)));
    rotateWorld(this.bone('Spine'), Q().setFromAxisAngle(this.dir(1, 0, 0), lean*.55));
    rotateWorld(this.bone('Spine2'), Q().setFromAxisAngle(this.dir(1, 0, 0), lean*.25));
    if (p.bend) rotateWorld(this.bone('Spine1'), Q().setFromAxisAngle(this.dir(0, 0, 1), -p.bend));
    // Shoulders follow the pelvis turn plus any extra twist.
    const shoulders = turn*.75+(p.twist ?? 0);
    if (Math.abs(shoulders) > 1e-4) rotateWorld(this.bone('Spine2'), Q().setFromAxisAngle(this.dir(0, 1, 0), shoulders-turn));
    const aimLimb = (upper: string, lower: string, end: string, limb?: Limb) => {if (!limb) return; this.aim(upper, lower, limb[0]); this.aim(lower, end, limb[1]);};
    aimLimb('LeftUpLeg', 'LeftLeg', 'LeftFoot', p.ll); aimLimb('RightUpLeg', 'RightLeg', 'RightFoot', p.rl);
    if (p.lf) this.aim('LeftFoot', 'LeftToeBase', p.lf); else this.aim('LeftFoot', 'LeftToeBase', [.05, -.3, 1]);
    if (p.rf) this.aim('RightFoot', 'RightToeBase', p.rf); else this.aim('RightFoot', 'RightToeBase', [-.05, -.3, 1]);
    aimLimb('LeftArm', 'LeftForeArm', 'LeftHand', p.la); aimLimb('RightArm', 'RightForeArm', 'RightHand', p.ra);
    const head = p.head ?? [0, 1, .12];
    this.aim('Neck', 'Head', [head[0]*.5, 1, head[2]*.5]); this.aim('Head', 'HeadTop_End', head);
    const headBone = this.bone('Head'), headUp = this.dir(...head);
    const actualForward = V(0, 0, 1).transformDirection(this.skinFrame(headBone));
    actualForward.addScaledVector(headUp, -actualForward.dot(headUp)).normalize();
    const wantForward = this.dir(0, 0, 1); wantForward.addScaledVector(headUp, -wantForward.dot(headUp)).normalize();
    const headYaw = Math.atan2(headUp.dot(actualForward.clone().cross(wantForward)), actualForward.dot(wantForward));
    rotateWorld(headBone, Q().setFromAxisAngle(headUp, headYaw));
    if (grounded) this.ground(p.lift ?? 0);
    if (this.carry && this.batNode) {this.batNode.position.copy(this.carry.p); this.batNode.quaternion.copy(this.carry.q);}
    this.batNode!.visible = this.role === 'batter';
    this.root.updateMatrixWorld(true);
  }
  private aim(name: string, childName: string, d: Dir) {
    const bone = this.bone(name), current = worldPos(this.bone(childName)).sub(worldPos(bone));
    if (current.lengthSq() < 1e-8) return;
    rotateWorld(bone, Q().setFromUnitVectors(current.normalize(), this.dir(d[0], d[1], d[2])));
  }
  /** Lowest foot point touches the turf (plus `lift` for a bound). */
  ground(lift = 0) {
    const hips = this.bone('Hips');
    const low = Math.min(...['LeftFoot', 'RightFoot'].map(n => this.root.worldToLocal(worldPos(this.bone(n))).y-.08*this.scaleFactor), ...['LeftToe_End', 'RightToe_End'].map(n => this.root.worldToLocal(worldPos(this.bone(n))).y-.02));
    setWorldPosition(hips, worldPos(hips).add(this.dir(0, 1, 0).multiplyScalar(lift-low)));
  }

  /* ---------- Gear ---------- */
  private attach(gear: T.Object3D, bone: T.Object3D, position: T.Vector3, quaternion: T.Quaternion) {
    this.root.add(gear); gear.position.copy(this.root.worldToLocal(position.clone())); gear.quaternion.copy(worldQuat(this.root).invert().multiply(quaternion));
    this.root.updateMatrixWorld(true); bone.attach(gear);
  }
  /** Batch original detail by material within a single bone attachment to keep the cast's draw calls bounded. */
  private detail(group: T.Group) {
    group.updateMatrixWorld(true);
    const batches = new Map<T.Material, T.BufferGeometry[]>(), originals = new Set<T.BufferGeometry>();
    group.traverse(node => {
      if (!(node instanceof T.Mesh)) return;
      const material = node.material as T.Material;
      const geometry = (node.geometry.index ? node.geometry.toNonIndexed() : node.geometry.clone()).applyMatrix4(node.matrixWorld);
      material.userData.yorkerOwned = true; originals.add(node.geometry);
      if (!batches.has(material)) batches.set(material, []);
      batches.get(material)!.push(geometry);
    });
    group.clear();
    for (const [material, pieces] of batches) {
      const geometry = mergeGeometries(pieces)!; geometry.userData.yorkerOwned = true;
      const mesh = new T.Mesh(geometry, material); mesh.castShadow = !material.userData.yorkerNoShadow; mesh.receiveShadow = true; group.add(mesh);
      pieces.forEach(g => g.dispose());
    }
    originals.forEach(g => g.dispose());
    return group;
  }
  private fitGear(g: GearAssets) {
    const role = this.role, opts = this.options;
    this.sample(CYCLE.carry); this.root.updateMatrixWorld(true);
    const head = this.bone('Head'), top = this.bone('HeadTop_End');
    const h = worldPos(head), crown = worldPos(top), up = crown.clone().sub(h).normalize(), size = crown.distanceTo(h)*.84;
    const forward = V(0, 0, 1).transformDirection(this.skinFrame(head)); forward.addScaledVector(up, -forward.dot(up)).normalize();
    const side = up.clone().cross(forward).normalize(), frame = Q().setFromRotationMatrix(new T.Matrix4().makeBasis(side, up, forward));
    const profile = Number(opts.number) || (role === 'umpire' ? 2 : 0);
    const face = createPlayerHead(opts.kit, this.surfaces, profile);
    this.headLevels = {near: this.detail(face.group), far: this.detail(createPlayerHead(opts.kit, this.surfaces, profile, false).group)};
    const faceGroup = new T.Group(); faceGroup.add(this.headLevels.near, this.headLevels.far); this.headLevels.far.visible = false; faceGroup.scale.setScalar(size);
    this.attach(faceGroup, head, h, frame);
    if (role === 'batter') {
      const helmet = g.helmet.clone(true);
      dressEquipment(helmet, 'helmet', {...opts.kit, shirt: opts.helmet ?? opts.kit.shirt}, this.surfaces);
      const s = (size*.86+.026)/.28; helmet.scale.setScalar(s);
      this.attach(helmet, head, h.clone().addScaledVector(up, size*.747+.028-.1*s).addScaledVector(forward, .018), frame);
    } else if (role !== 'umpire' && opts.cap) {
      const cap = new T.Group(), mat = new T.MeshStandardMaterial({color: opts.cap, roughness: .9});
      const stitch = new T.MeshStandardMaterial({color: new T.Color(opts.cap).lerp(new T.Color('#c1c8cd'), .17), roughness: 1});
      const r = size*face.radius;
      const dome = new T.Mesh(new T.SphereGeometry(r, 28, 16, 0, Math.PI*2, 0, Math.PI*.5), mat); dome.scale.set(1, .67, 1.26); cap.add(dome);
      const shape = new T.Shape(); shape.moveTo(-r*.94, 0); shape.lineTo(-r*.92, r*.35);
      shape.quadraticCurveTo(-r*.9, r*1.25, 0, r*1.3); shape.quadraticCurveTo(r*.9, r*1.25, r*.92, r*.35);
      shape.lineTo(r*.94, 0); shape.quadraticCurveTo(0, -r*.2, -r*.94, 0);
      const peak = new T.Mesh(new T.ExtrudeGeometry(shape, {depth: .0035, bevelEnabled: true, bevelSize: .001, bevelThickness: .001, bevelSegments: 1, steps: 1, curveSegments: 10}), mat);
      peak.rotation.x = Math.PI/2; peak.position.set(0, .002, r*.22); cap.add(peak);
      for (let i = 0; i < 6; i++) {
        const a = i/6*Math.PI*2, points = Array.from({length: 9}, (_, j) => {const p = j/8*Math.PI*.49; return V(Math.sin(p)*Math.sin(a)*r*1.005, Math.cos(p)*r*.675, Math.sin(p)*Math.cos(a)*r*1.265);});
        cap.add(new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(points), 12, .00065, 4, false), stitch));
      }
      const button = new T.Mesh(new T.SphereGeometry(.005, 10, 8), mat); button.position.y = r*.67; cap.add(button);
      this.attach(this.detail(cap), head, h.clone().addScaledVector(up, size*face.hatLine).addScaledVector(forward, -size*.08), frame);
    } else if (role === 'umpire') {
      const hat = new T.Group(), mat = new T.MeshStandardMaterial({color: '#e4e0d3', roughness: .92}), band = new T.MeshStandardMaterial({color: '#1b2638', roughness: .9}); const r = size*face.radius;
      const crownMesh = new T.Mesh(new T.CylinderGeometry(r*.86, r, r*.8, 28), mat); crownMesh.position.y = r*.4; hat.add(crownMesh);
      const brim = new T.Mesh(new T.CylinderGeometry(r*1.65, r*1.67, .006, 40), mat); hat.add(brim);
      const ribbon = new T.Mesh(new T.CylinderGeometry(r*.986, r*1.005, r*.16, 28, 1, true), band); ribbon.position.y = r*.1; hat.add(ribbon);
      this.detail(hat); hat.scale.z = 1.26;
      this.attach(hat, head, h.clone().addScaledVector(up, size*face.hatLine).addScaledVector(forward, -size*.08), frame);
    }
    if (role === 'batter' || role === 'keeper') this.fitPads(g.pads);
    if (role === 'batter') this.fitGloves(g.gloves, false);
    if (role === 'keeper') this.fitGloves(g.keeperGloves, true);
    if (role === 'batter') this.fitBat(g.bat);
    this.fitBootLaces();
    this.fitCollar();
  }
  private fitCollar() {
    const bone = this.bone('Spine2'), neck = worldPos(this.bone('Neck'));
    const up = neck.clone().sub(worldPos(bone)).normalize();
    const forward = V(0, 0, 1).transformDirection(this.skinFrame(bone)); forward.addScaledVector(up, -forward.dot(up)).normalize();
    const across = up.clone().cross(forward).normalize(), frame = Q().setFromRotationMatrix(new T.Matrix4().makeBasis(across, up, forward));
    const kit = this.options.kit, group = new T.Group();
    const fabric = new T.MeshPhysicalMaterial({color: kit.shirt, roughness: .88, metalness: 0, bumpMap: this.surfaces.fabric, bumpScale: .0002, sheen: .18, sheenRoughness: .9, sheenColor: '#bcc2ca'});
    const collar = new T.Mesh(new T.LatheGeometry([new T.Vector2(.166, -.15), new T.Vector2(.15, -.115), new T.Vector2(.088, -.025), new T.Vector2(.074, 0)], 40), fabric);
    collar.scale.z = .78; group.add(collar);
    const edge = new T.Mesh(new T.TorusGeometry(.075, .005, 7, 40), new T.MeshStandardMaterial({color: new T.Color(kit.shirt).multiplyScalar(.75), roughness: .9}));
    edge.rotation.x = Math.PI/2; edge.scale.y = .78; group.add(edge);
    const inset = new T.Mesh(new T.CircleGeometry(.077, 32), new T.MeshStandardMaterial({color: kit.skin, roughness: .65}));
    inset.rotation.x = -Math.PI/2; inset.scale.y = .78; inset.position.y = -.003; group.add(inset);
    this.attach(this.detail(group), bone, neck.clone().addScaledVector(forward, .008), frame);
  }
  private fitPads(pads: [T.Object3D, T.Object3D]) {
    (['Left', 'Right'] as const).forEach((s, i) => {
      const knee = worldPos(this.bone(s+'Leg')), ankle = worldPos(this.bone(s+'Foot')), toe = worldPos(this.bone(s+'ToeBase'));
      const axis = knee.clone().sub(ankle), length = axis.length(); axis.normalize();
      const front = toe.clone().sub(ankle); front.addScaledVector(axis, -front.dot(axis)).normalize();
      const across = axis.clone().cross(front).normalize(), frame = Q().setFromRotationMatrix(new T.Matrix4().makeBasis(across, axis, front));
      const pad = pads[i].clone(true); pad.scale.setScalar((length+.2*this.scaleFactor)/.652);
      dressEquipment(pad, 'pads', this.options.kit, this.surfaces);
      this.attach(pad, this.bone(s+'Leg'), ankle.clone().addScaledVector(axis, -.07*this.scaleFactor).addScaledVector(front, .045), frame);
    });
  }
  private fitGloves(gloves: [T.Object3D, T.Object3D], keeper: boolean) {
    (['Left', 'Right'] as const).forEach((s, i) => {
      const hand = this.bone(s+'Hand'), wrist = worldPos(hand), tip = worldPos(this.bone(s+'HandIndex1'));
      const along = tip.clone().sub(wrist).normalize(), thumb = worldPos(this.bone(s+'HandThumb1')).sub(wrist);
      const back = along.clone().cross(thumb).normalize().multiplyScalar(s === 'Left' ? 1 : -1);
      const across = back.clone().cross(along).normalize(), frame = Q().setFromRotationMatrix(new T.Matrix4().makeBasis(across, back, along));
      const glove = gloves[i].clone(true); glove.scale.setScalar(this.scaleFactor*(keeper ? 1.05 : .95));
      dressEquipment(glove, 'gloves', this.options.kit, this.surfaces);
      this.attach(glove, hand, wrist.clone().addScaledVector(along, -.03).addScaledVector(back, -.02), frame);
    });
  }
  private fitBat(bat: T.Object3D) {
    // Replace the source bat with the CC0 bat in the same handle-to-toe frame.
    const mesh = this.batMesh!;
    (mesh as T.Mesh).visible = false;
    const holder = new T.Group(); mesh.parent!.add(holder);
    holder.position.copy(mesh.position); holder.quaternion.copy(mesh.quaternion); holder.scale.copy(mesh.scale);
    const blade = bat.clone(true); const length = BLADE.toe+.12-BLADE.handle;
    blade.scale.setScalar(length/.836); blade.rotation.set(0, 0, Math.PI); blade.position.set(0, BLADE.handle+length, BLADE.z-.05);
    dressEquipment(blade, 'bat', this.options.kit, this.surfaces);
    holder.add(blade);
  }

  private fitBootLaces() {
    const lace = new T.MeshStandardMaterial({color: this.role === 'umpire' ? '#333b44' : '#d6d8d3', roughness: .95});
    for (const side of ['Left', 'Right']) {
      const foot = this.bone(side+'Foot'), ankle = worldPos(foot), toe = worldPos(this.bone(side+'ToeBase'));
      const front = toe.sub(ankle).normalize(), up = this.dir(0, 1, 0);
      up.addScaledVector(front, -up.dot(front)).normalize();
      const across = up.clone().cross(front).normalize();
      const frame = Q().setFromRotationMatrix(new T.Matrix4().makeBasis(across, up, front)), group = new T.Group();
      for (let i = 0; i < 4; i++) {
        const z = .035+i*.012;
        const line = new T.CatmullRomCurve3([V(-.027, .024-i*.002, z), V(0, .032-i*.002, z+.004), V(.027, .024-i*.002, z+.007)]);
        group.add(new T.Mesh(new T.TubeGeometry(line, 8, .0012, 4, false), lace));
      }
      this.attach(this.detail(group), foot, ankle, frame);
    }
  }

  /** Projected size, not raw distance: a telephoto broadcast camera must not lose the face's silhouette. */
  updateDetail(camera: T.PerspectiveCamera) {
    const center = this.outer.getWorldPosition(V()).add(V(0, .95, 0));
    const fraction = (this.options.height ?? HEIGHT)/(Math.max(.1, camera.position.distanceTo(center))*2*Math.tan(T.MathUtils.degToRad(camera.fov)/2));
    this.body.geometry = fraction > .23 ? this.bodyLevels.near : this.bodyLevels.far;
    this.headLevels.near.visible = fraction > .42; this.headLevels.far.visible = !this.headLevels.near.visible;
  }

  inspection() {return {role: this.role, name: this.options.name, key: this.key, detailed: this.body.geometry === this.bodyLevels.near, bladeError: this.bladeError, gripError: this.gripError, height: worldPos(this.bone('HeadTop_End')).y-this.outer.position.y};}
  dispose(releaseShared = false) {
    const materials = new Set<T.Material>(), geometries = new Set<T.BufferGeometry>();
    this.outer.traverse(node => {
      if (!(node instanceof T.Mesh)) return;
      for (const material of Array.isArray(node.material) ? node.material : [node.material]) if (ownsPlayerMaterial(material)) materials.add(material);
      if (node.geometry.userData.yorkerOwned) geometries.add(node.geometry);
    });
    materials.forEach(material => material.dispose()); geometries.forEach(geometry => geometry.dispose());
    this.body.skeleton.dispose();
    if (releaseShared) {this.bodyLevels.near.dispose(); this.bodyLevels.far.dispose();}
    this.outer.removeFromParent();
  }
}
