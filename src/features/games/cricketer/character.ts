import * as T from 'three';
import {clone} from 'three/examples/jsm/utils/SkeletonUtils.js';
import type {GLTF} from 'three/examples/jsm/loaders/GLTFLoader.js';

/**
 * Cricketer players: one low-poly skinned body (CC-BY, bhagathartworks) with its own batting
 * cycle, Cricketer kits painted from baked face regions, original helmet/pads, and authored
 * running, bowling and fielding poses on the same 49-joint rig.
 */
export type PlayerPose = 'ready' | 'swing' | 'recover' | 'wait' | 'run' | 'walk' | 'bowl' | 'field' | 'celebrate';
export type Kit = {shirt: string; trim: string; trousers: string; skin: string; hair: string; sleeve?: string; hand?: string; accent?: string; beard?: boolean};
type Snapshot = Map<T.Object3D, {p: T.Vector3; q: T.Quaternion}>;

/** Times (seconds) inside the source batting cycle. */
export const CYCLE = {stance: .12, trigger: .30, contact: 1.14, finish: 1.85, settle: 5.95, wait: 5.8, carry: 4.6};
const REGIONS = 11, SCALE = .92;
// Bat mesh local frame: handle top at y=-1.27, toe at y=6.12, blade face centred near z=.3.
const BLADE = {handle: -1.27, shoulder: 1.1, sweet: 3.95, toe: 6.0, z: .3};
const V = (x = 0, y = 0, z = 0) => new T.Vector3(x, y, z), Q = () => new T.Quaternion();
const clamp = (n: number, a = 0, b = 1) => Math.max(a, Math.min(b, n));
const smooth = (a: number, b: number, x: number) => {const t = clamp((x-a)/(b-a)); return t*t*(3-2*t);};
const worldPos = (o: T.Object3D) => o.getWorldPosition(V());
const worldQuat = (o: T.Object3D) => o.getWorldQuaternion(Q());
function setWorldQuaternion(o: T.Object3D, q: T.Quaternion) {o.quaternion.copy((o.parent ? worldQuat(o.parent) : Q()).invert().multiply(q)); o.updateMatrixWorld(true);}
function rotateWorld(o: T.Object3D, r: T.Quaternion) {setWorldQuaternion(o, r.clone().multiply(worldQuat(o)));}
function setWorldPosition(o: T.Object3D, p: T.Vector3) {o.position.copy(o.parent ? o.parent.worldToLocal(p.clone()) : p); o.updateMatrixWorld(true);}
function limited(q: T.Quaternion, max: number) {const angle = 2*Math.acos(clamp(Math.abs(q.w), 0, 1)); return angle > max && angle > 1e-6 ? Q().slerp(q, max/angle) : q;}
const flatMaterial = (color: T.ColorRepresentation, roughness = .7) => new T.MeshStandardMaterial({color, roughness, flatShading: true});
function addMesh(parent: T.Object3D, geometry: T.BufferGeometry, material: T.Material, p = V()) {const m = new T.Mesh(geometry, material); m.position.copy(p); m.castShadow = true; m.receiveShadow = true; parent.add(m); return m;}
function rod(parent: T.Object3D, material: T.Material, a: T.Vector3, b: T.Vector3, r: number, sides = 6) {const m = addMesh(parent, new T.CylinderGeometry(r, r, a.distanceTo(b), sides), material, a.clone().add(b).multiplyScalar(.5)); m.quaternion.setFromUnitVectors(V(0, 1, 0), b.clone().sub(a).normalize()); return m;}

function numberTexture(number: string, ink: string) {
  const c = document.createElement('canvas'); c.width = 128; c.height = 160; const ctx = c.getContext('2d')!;
  ctx.textAlign = 'center'; ctx.lineJoin = 'round';
  ctx.font = '900 92px "Arial Narrow",Arial,sans-serif'; ctx.lineWidth = 7; ctx.strokeStyle = 'rgba(0,0,0,.28)'; ctx.strokeText(number, 64, 128); ctx.fillStyle = ink; ctx.fillText(number, 64, 128);
  ctx.font = '700 15px Arial,sans-serif'; ctx.fillText('CRICKETER', 64, 26);
  const t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; return t;
}
let batTexture: T.CanvasTexture | null = null;
/** Original bat livery drawn into the source bat's UV layout (grip top-left, faces in the left columns). */
function batLivery() {
  if (batTexture) return batTexture;
  const s = 512, c = document.createElement('canvas'); c.width = c.height = s; const ctx = c.getContext('2d')!;
  const willow = ctx.createLinearGradient(0, 0, s*.4, 0); willow.addColorStop(0, '#e9cf9c'); willow.addColorStop(.5, '#f2dcae'); willow.addColorStop(1, '#ddbf86');
  ctx.fillStyle = willow; ctx.fillRect(0, 0, s, s);
  ctx.strokeStyle = 'rgba(150,104,52,.18)'; ctx.lineWidth = 1; for (let x = 3; x < s; x += 7) {ctx.beginPath(); ctx.moveTo(x, s*.33); ctx.lineTo(x+2, s); ctx.stroke();}
  ctx.fillStyle = '#1d3b31'; ctx.fillRect(0, 0, s*.4, s*.335);
  ctx.strokeStyle = '#2f5a49'; ctx.lineWidth = 5; for (let y = -s*.4; y < s*.34; y += 13) {ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(s*.4, y+s*.4*.35); ctx.stroke();}
  ctx.fillStyle = '#c4432f'; ctx.fillRect(0, s*.115, s*.4, s*.05);
  ctx.fillStyle = '#16231d'; ctx.fillRect(0, s*.315, s*.4, s*.025);
  for (const [x0, x1] of [[0, .118], [.122, .243]]) {
    const cx = (x0+x1)/2*s, w = (x1-x0)*s;
    ctx.save(); ctx.translate(cx, s*.62); ctx.rotate(-Math.PI/2);
    ctx.fillStyle = '#c4432f'; ctx.fillRect(-s*.19, -w*.38, s*.38, w*.76);
    ctx.fillStyle = '#f7ecd2'; ctx.font = `900 ${w*.5}px "Arial Narrow",Arial,sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('CRICKETER', 0, w*.03, s*.34);
    ctx.restore();
    ctx.fillStyle = '#1d3b31'; ctx.fillRect(cx-w*.3, s*.9, w*.6, s*.03);
  }
  batTexture = new T.CanvasTexture(c); batTexture.colorSpace = T.SRGBColorSpace; batTexture.flipY = false; batTexture.anisotropy = 4;
  return batTexture;
}

function kitMaterial(kit: Kit, number: T.Texture, batting: boolean) {
  const skin = new T.Color(kit.skin), hair = new T.Color(kit.hair);
  const palette = [skin, skin, new T.Color(kit.hand || (batting ? '#f1ebdb' : kit.skin)), hair, kit.beard ? hair.clone() : skin.clone().lerp(hair, .12), new T.Color(kit.shirt), new T.Color(kit.trim),
    new T.Color(kit.sleeve || kit.shirt), new T.Color(kit.trousers), new T.Color('#f3f0e8'), new T.Color(kit.accent || kit.trim)];
  if (palette.length !== REGIONS) throw Error('Kit palette mismatch');
  const material = new T.MeshStandardMaterial({roughness: .8, metalness: 0, flatShading: true});
  material.onBeforeCompile = shader => {
    shader.uniforms.uPalette = {value: palette}; shader.uniforms.uNumber = {value: number};
    shader.vertexShader = 'attribute float _region; attribute vec2 _kituv; varying float vRegion; varying vec2 vKitUV;\n'+shader.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\nvRegion=_region; vKitUV=_kituv;');
    shader.fragmentShader = `uniform vec3 uPalette[${REGIONS}]; uniform sampler2D uNumber; varying float vRegion; varying vec2 vKitUV;\n`+shader.fragmentShader.replace('#include <map_fragment>',
      '#include <map_fragment>\ndiffuseColor.rgb=uPalette[int(clamp(vRegion+.5,0.,10.))];\nif(vKitUV.x>=0.&&vKitUV.x<=1.&&vKitUV.y>=0.&&vKitUV.y<=1.){vec4 lettering=texture2D(uNumber,vKitUV);diffuseColor.rgb=mix(diffuseColor.rgb,lettering.rgb,lettering.a);}');
  };
  material.customProgramCacheKey = () => 'cricketer-kit-regions-v1';
  material.addEventListener('dispose', () => number.dispose());
  return material;
}

export type PlayerOptions = {batting: boolean; kit: Kit; number: string};
export class CricketerPlayer {
  root = new T.Group(); model: T.Object3D; head: T.Bone; readonly batting: boolean;
  /** Native sweet-spot position at contact, in root space. The renderer aligns the ball line with it. */
  contactLocal = V();
  private orient = new T.Group(); private duration: number;
  // Direct track evaluation: every sample writes every animated value (AnimationMixer skips unchanged values,
  // which would leave post-sample corrections in place).
  private tracks: {target: T.Object3D; path: 'position' | 'quaternion' | 'scale'; interpolant: T.Interpolant}[] = [];
  private bones = new Map<string, T.Bone>(); private rest: Snapshot = new Map(); private animated: T.Object3D[] = [];
  private body!: T.SkinnedMesh; private batNode!: T.Object3D; private batMesh!: T.Mesh; private carry!: {p: T.Vector3; q: T.Quaternion};
  private kind: PlayerPose | null = null; private staticKey = ''; private blendFrom: Snapshot | null = null; private blendStart = 0; private blendTime = .24; private lastClip = -1;
  private gripError = 0; private bladeError = 0; private blade = V(); private target: T.Vector3 | null = null;

  constructor(gltf: GLTF, readonly options: PlayerOptions) {
    this.batting = options.batting;
    this.orient.rotation.y = Math.PI; this.root.add(this.orient);
    this.model = clone(gltf.scene); this.model.scale.setScalar(SCALE); this.orient.add(this.model);
    this.model.traverse(o => {
      if ((o as T.Bone).isBone) {const bone = o as T.Bone; this.bones.set(bone.name.replace(/_\d+$/, ''), bone); this.animated.push(bone);}
      if (o instanceof T.SkinnedMesh) this.body = o;
      if (o.name === 'Cricketer_Bat') this.batNode = o;
      if (o.name === 'Cricketer_Bat_Mesh') this.batMesh = o as T.Mesh;
    });
    if (!this.body || !this.batNode || !this.batMesh) throw Error('Cricketer player asset is incomplete');
    this.animated.push(this.batNode);
    for (const o of this.animated) this.rest.set(o, {p: o.position.clone(), q: o.quaternion.clone()});
    this.head = this.bone('Head');
    const ink = options.kit.trim;
    this.body.material = kitMaterial(options.kit, numberTexture(options.number, ink), options.batting);
    this.body.castShadow = true; this.body.receiveShadow = true; this.body.frustumCulled = false;
    this.batMesh.material = new T.MeshStandardMaterial({map: batLivery(), roughness: .62, flatShading: true}); this.batMesh.castShadow = true;
    this.batNode.visible = options.batting;
    const clip = gltf.animations[0]; if (!clip) throw Error('Cricketer batting cycle missing');
    this.duration = clip.duration;
    for (const track of clip.tracks) {
      const {nodeName, propertyName} = T.PropertyBinding.parseTrackName(track.name), target = T.PropertyBinding.findNode(this.model, nodeName) as T.Object3D | null;
      if (!target || (propertyName !== 'position' && propertyName !== 'quaternion' && propertyName !== 'scale')) throw Error('Unsupported batting track '+track.name);
      const size = track.getValueSize(), result = new Float32Array(size);
      const interpolant = propertyName === 'quaternion' ? new T.QuaternionLinearInterpolant(track.times, track.values, size, result) : new T.LinearInterpolant(track.times, track.values, size, result);
      this.tracks.push({target, path: propertyName, interpolant});
    }
    this.sample(CYCLE.carry); this.carry = {p: this.batNode.position.clone(), q: this.batNode.quaternion.clone()};
    this.sample(CYCLE.contact); this.root.updateMatrixWorld(true); this.contactLocal.copy(this.root.worldToLocal(this.sweetSpot()));
    this.sample(CYCLE.stance); this.root.updateMatrixWorld(true); this.makeGear();
    this.pose(0, 'ready', 9);
  }

  private bone(name: string) {const b = this.bones.get(name); if (!b) throw Error('Player rig is missing '+name); return b;}
  private sample(t: number) {
    const time = ((t%this.duration)+this.duration)%this.duration;
    for (const {target, path, interpolant} of this.tracks) target[path].fromArray(interpolant.evaluate(time) as unknown as number[]);
    this.lastClip = time; this.root.updateMatrixWorld(true);
  }
  private reset() {for (const [o, r] of this.rest) {o.position.copy(r.p); o.quaternion.copy(r.q);} this.root.updateMatrixWorld(true);}
  private snapshot(): Snapshot {const s: Snapshot = new Map(); for (const o of this.animated) s.set(o, {p: o.position.clone(), q: o.quaternion.clone()}); return s;}
  private sweetSpot() {return this.batMesh.localToWorld(V(0, BLADE.sweet, BLADE.z));}
  private dir(x: number, y: number, z: number) {return V(x, y, z).normalize().applyQuaternion(worldQuat(this.root));}

  /** Pose for this frame. `progress` is the delivery age (ready), swing progress (swing: .5 = contact), seconds since contact (recover) or role progress (bowl). */
  pose(time: number, kind: PlayerPose, progress = 0, aim = 1, shot = 'drive', contactHeight = .6) {
    const blending = this.blendFrom && time-this.blendStart < this.blendTime;
    const staticKey = kind === 'field' || kind === 'wait' ? kind : '';
    if (staticKey && staticKey === this.staticKey && !blending && kind === this.kind) return;
    if (this.kind !== null && kind !== this.kind) {this.blendFrom = this.snapshot(); this.blendStart = time; this.blendTime = kind === 'swing' ? .12 : .26;}
    this.kind = kind; this.target = null;
    if (kind === 'ready' || kind === 'swing' || kind === 'recover' || kind === 'wait') this.clipPose(time, kind, progress, aim, shot, contactHeight);
    else this.authored(time, kind, progress);
    if (this.blendFrom) {
      const w = smooth(0, 1, (time-this.blendStart)/this.blendTime);
      if (w >= 1) this.blendFrom = null;
      else for (const [o, from] of this.blendFrom) {o.position.lerpVectors(from.p, o.position, w); o.quaternion.copy(from.q.clone().slerp(o.quaternion, w));}
      this.root.updateMatrixWorld(true);
    }
    if (this.target) this.solveContact(this.target, 1);
    this.batNode.visible = this.batting;
    this.staticKey = this.blendFrom ? '' : staticKey;
    this.root.updateMatrixWorld(true);
  }

  private clipPose(time: number, kind: PlayerPose, progress: number, aim: number, shot: string, contactHeight: number) {
    this.reset();
    const length = this.duration;
    let t: number;
    if (kind === 'wait') t = CYCLE.wait+.08*Math.sin(time*.8);
    else if (kind === 'ready') {
      // Get set from the relaxed bat-down position into the high backlift, then hold with a small waggle.
      const getSet = length-CYCLE.settle+CYCLE.stance;
      t = progress < 1 ? CYCLE.settle+smooth(0, 1, progress)*getSet : CYCLE.stance+.045*Math.sin(time*2.1);
    } else if (kind === 'swing') t = progress <= .5 ? CYCLE.trigger+(CYCLE.contact-CYCLE.trigger)*Math.pow(progress/.5, 1.35)
      : CYCLE.contact+(CYCLE.finish-CYCLE.contact)*(progress-.5)/.5;
    // Recover: progress is seconds since contact. The swing covers the first .42s; then the cycle plays on at walking pace.
    else t = Math.min(CYCLE.settle-.2, CYCLE.finish+Math.max(0, progress-.42)*.95);
    if (t > length) t -= length;
    this.sample(t);
    if (kind === 'swing' || kind === 'recover') {
      // Shot direction: lead the follow-through toward the side the ball is struck.
      const follow = kind === 'swing' ? smooth(.45, .9, progress) : 1-smooth(.2, .9, progress);
      const yaw = (aim < 0 ? .55 : -.18)*follow+(shot === 'pull' || shot === 'hook' ? .22 : shot === 'cut' ? -.2 : 0)*follow;
      if (Math.abs(yaw) > 1e-4) rotateWorld(this.bone('Spine'), Q().setFromAxisAngle(V(0, 1, 0), yaw));
      if (kind === 'swing') {
        // Shift the native swing by the ball's offset from the native contact point (faded in and out),
        // and snap exactly onto the ball only in the last instant before contact.
        const near = Math.exp(-Math.pow((progress-.5)/.2, 2)), snap = Math.exp(-Math.pow((progress-.5)/.05, 2));
        const low = clamp((this.contactLocal.y-contactHeight)*.62, 0, .3)+(shot === 'sweep' || shot === 'scoop' ? .06 : 0);
        this.crouch(low*near);
        const ball = this.root.localToWorld(V(this.contactLocal.x, contactHeight, this.contactLocal.z));
        const offset = ball.clone().sub(this.root.localToWorld(this.contactLocal.clone())).add(this.dir(0, 1, 0).multiplyScalar(low));
        this.target = this.sweetSpot().addScaledVector(offset, near).lerp(ball, snap);
      }
    }
  }

  /** Legs: keep both feet planted while the hips drop. */
  private crouch(drop: number) {
    if (drop < .002) return;
    const feet = ['Left', 'Right'].map(side => {const b = this.bone(side+'Foot'); return {p: worldPos(b), q: worldQuat(b)};});
    const hips = this.bone('Hips'); setWorldPosition(hips, worldPos(hips).add(this.dir(0, -1, 0).multiplyScalar(drop)));
    ['Left', 'Right'].forEach((side, i) => {this.solveChain(side+'UpLeg', side+'Leg', side+'Foot', feet[i].p); setWorldQuaternion(this.bone(side+'Foot'), feet[i].q);});
  }
  private solveChain(upperName: string, lowerName: string, endName: string, target: T.Vector3, pole?: T.Vector3) {
    const upper = this.bone(upperName), lower = this.bone(lowerName), end = this.bone(endName);
    const a = worldPos(upper), b = worldPos(lower), c = worldPos(end), l1 = a.distanceTo(b), l2 = b.distanceTo(c);
    const toTarget = target.clone().sub(a), d = clamp(toTarget.length(), Math.abs(l1-l2)+.001, l1+l2-.001); toTarget.normalize();
    const bend = (pole ? pole.clone() : b.clone().sub(a)).addScaledVector(toTarget, -(pole ? pole : b.clone().sub(a)).dot(toTarget));
    if (bend.lengthSq() < 1e-8) bend.copy(this.dir(0, 0, 1)); bend.normalize();
    const cosine = clamp((l1*l1+d*d-l2*l2)/(2*l1*d), -1, 1), elbow = a.clone().addScaledVector(toTarget, l1*cosine).addScaledVector(bend, l1*Math.sqrt(1-cosine*cosine));
    rotateWorld(upper, Q().setFromUnitVectors(b.clone().sub(a).normalize(), elbow.sub(a).normalize()));
    const now = worldPos(lower); rotateWorld(lower, Q().setFromUnitVectors(worldPos(end).sub(now).normalize(), target.clone().sub(now).normalize()));
    return worldPos(end).distanceTo(target);
  }

  /** Bring the bat's sweet spot onto the ball: spine and lead-shoulder CCD, a wrist pivot, then the top hand re-grips. */
  private solveContact(target: T.Vector3, weight: number) {
    const leftHand = this.bone('LeftHand');
    const batInverse = this.batMesh.matrixWorld.clone().invert();
    const grip = worldPos(leftHand).applyMatrix4(batInverse), gripTurn = worldQuat(this.batMesh).invert().multiply(worldQuat(leftHand));
    if (weight > .001) {
      const joints: [string, number][] = [['Spine', .32], ['Spine1', .32], ['Spine2', .36], ['RightArm', .55]];
      for (let pass = 0; pass < 5; pass++) for (const [name, max] of joints) {
        const bone = this.bone(name), pivot = worldPos(bone), from = this.sweetSpot().sub(pivot), to = target.clone().sub(pivot);
        if (from.lengthSq() < 1e-6 || to.lengthSq() < 1e-6) continue;
        rotateWorld(bone, limited(Q().slerp(Q().setFromUnitVectors(from.normalize(), to.normalize()), weight), max*weight));
      }
      // Wrist pivot about the top of the handle keeps the hands on the grip.
      const pivot = this.batMesh.localToWorld(V(0, BLADE.handle+.6, BLADE.z)), from = this.sweetSpot().sub(pivot), to = target.clone().sub(pivot);
      const turn = limited(Q().slerp(Q().setFromUnitVectors(from.normalize(), to.normalize()), weight), .75*weight);
      const node = this.batNode, position = worldPos(node).sub(pivot).applyQuaternion(turn).add(pivot);
      setWorldQuaternion(node, turn.clone().multiply(worldQuat(node))); setWorldPosition(node, position);
    }
    // Top hand re-grips the handle wherever the shoulder/spine correction moved it.
    const want = grip.applyMatrix4(this.batMesh.matrixWorld);
    this.gripError = this.solveChain('LeftArm', 'LeftForeArm', 'LeftHand', want, this.dir(-.2, -.6, -.4));
    setWorldQuaternion(leftHand, worldQuat(this.batMesh).multiply(gripTurn));
    // Report the closest point of the blade to the ball.
    const local = target.clone().applyMatrix4(this.batMesh.matrixWorld.clone().invert());
    this.blade.copy(this.batMesh.localToWorld(V(0, clamp(local.y, BLADE.shoulder, BLADE.toe), BLADE.z)));
    this.bladeError = this.blade.distanceTo(target);
  }

  /** Authored role motion on the shared rig. Body frame: +Z forward, +X the player's left. */
  private authored(time: number, kind: PlayerPose, progress: number) {
    // Start from the cycle's upright standing frame so head and limb twist stay natural.
    this.reset(); this.sample(CYCLE.carry);
    const q = kind === 'bowl' ? clamp((progress-.7)/.42, 0, 1.6) : 0;
    const striding = kind === 'run' || kind === 'walk' || kind === 'bowl' && progress < .7;
    const speed = kind === 'walk' ? 7.5 : 12.5, phase = time*speed, swing = kind === 'walk' ? .42 : .78;
    let lean = kind === 'field' ? .62 : striding ? (kind === 'walk' ? .06 : .2) : 0;
    if (kind === 'bowl' && !striding) lean = q < .45 ? -.18+q*.2 : -.09+smooth(.45, .85, q)*.75+smooth(.85, 1.3, q)*.25;
    // Pelvis faces forward, upright or leaning.
    const hips = this.bone('Hips'), spine = this.bone('Spine1');
    const up = worldPos(spine).sub(worldPos(hips)).normalize(), left = worldPos(this.bone('LeftUpLeg')).sub(worldPos(this.bone('RightUpLeg')));
    left.addScaledVector(up, -left.dot(up)).normalize();
    const current = new T.Matrix4().makeBasis(left, up, left.clone().cross(up)), wantUp = this.dir(0, Math.cos(lean*.35), Math.sin(lean*.35)), wantLeft = this.dir(1, 0, 0);
    const twist = kind === 'bowl' && !striding ? (q < .5 ? -.9+q*.6 : -.6+smooth(.5, .9, q)*1.1) : 0;
    if (twist) wantLeft.applyAxisAngle(this.dir(0, 1, 0), twist);
    const desired = new T.Matrix4().makeBasis(wantLeft, wantUp, wantLeft.clone().cross(wantUp));
    rotateWorld(hips, Q().setFromRotationMatrix(desired.multiply(current.transpose())));
    setWorldPosition(hips, this.root.localToWorld(V(0, .95, 0)));
    rotateWorld(this.bone('Spine'), Q().setFromAxisAngle(this.dir(1, 0, 0), lean*.65));
    rotateWorld(this.bone('Spine2'), Q().setFromAxisAngle(this.dir(1, 0, 0), lean*.3));
    for (const [side, sign] of [['Left', 1], ['Right', -1]] as const) {
      const s = Math.sin(phase+(sign > 0 ? 0 : Math.PI)), thigh = striding ? s*swing : 0, knee = striding ? .25+Math.max(0, -Math.sin(phase+(sign > 0 ? 0 : Math.PI)-.9))*(kind === 'walk' ? .55 : 1.25) : 0;
      let upper = V(sign*.06, -Math.cos(thigh), Math.sin(thigh)), lower = V(sign*.03, -Math.cos(thigh-knee), Math.sin(thigh-knee));
      if (kind === 'field') {upper = V(sign*.28, -1, .85); lower = V(sign*.06, -1, -.35);}
      if (kind === 'celebrate') {upper = V(sign*.08, -1, sign*.05); lower = V(sign*.05, -1, 0);}
      if (kind === 'bowl' && !striding) {
        if (side === 'Left') {const lift = q < .4 ? smooth(0, .3, q) : 1-smooth(.4, .6, q); upper = V(.06, -Math.cos(.35+lift*.9), Math.sin(.35+lift*.9)); lower = V(.03, -1, lift*.6);}
        else {const drag = smooth(.4, .9, q), through = smooth(.85, 1.4, q); upper = V(-.08, -1, -.45+drag*.9+through*.8); lower = V(-.04, -.7, -.7+drag*1.1+through*.4);}
      }
      this.aim(side+'UpLeg', side+'Leg', upper); this.aim(side+'Leg', side+'Foot', lower); this.aim(side+'Foot', side+'ToeBase', V(sign*.05, -.25, 1));
      // Arms counter-swing with bent elbows; roles override.
      const arm = striding ? -s*swing*1.2 : 0;
      let shoulder = V(sign*.2, -Math.cos(arm), Math.sin(arm)), elbow = V(sign*.02, -Math.cos(arm+1.45), Math.sin(arm+1.45));
      if (!striding && kind !== 'bowl') {shoulder = V(sign*.22, -1, .08); elbow = V(sign*.05, -.8, .55);}
      if (kind === 'field') {shoulder = V(sign*.12, -.85, .55); elbow = V(-sign*.05, -.85, .5);}
      if (kind === 'celebrate') {const pump = Math.sin(time*7)*.2; shoulder = V(sign*.5, 1, .1+pump); elbow = V(sign*.18, 1, .05);}
      if (kind === 'bowl' && !striding) {
        if (side === 'Right') {const a = -2.6+smooth(.1, .71, q)*2.95+smooth(.71, 1.3, q)*2.6; shoulder = V(-.12, Math.cos(a), Math.sin(a)); elbow = V(-.06, Math.cos(a+.1), Math.sin(a+.1));}
        else {const a = .5-smooth(.45, .85, q)*2.6; shoulder = V(.25, Math.cos(a), Math.sin(a)); elbow = V(.1, Math.cos(a+.6), Math.sin(a+.6));}
      }
      this.aim(side+'Arm', side+'ForeArm', shoulder); this.aim(side+'ForeArm', side+'Hand', elbow);
    }
    this.aim('Neck', 'Head', V(0, 1, kind === 'field' ? .25 : .08)); this.aim('Head', 'HeadTop_End', V(0, 1, kind === 'field' ? .62 : kind === 'bowl' ? .5 : .4));
    // Plant on the ground: lowest foot point touches the turf, with a light running bob.
    const lowest = Math.min(...['LeftFoot', 'RightFoot'].map(n => this.root.worldToLocal(worldPos(this.bone(n))).y-.075), ...['LeftToe_End', 'RightToe_End'].map(n => this.root.worldToLocal(worldPos(this.bone(n))).y-.015));
    const bob = kind === 'celebrate' ? Math.abs(Math.sin(time*7))*.07 : 0;
    setWorldPosition(hips, worldPos(hips).add(this.dir(0, 1, 0).multiplyScalar(bob-lowest)));
    if (this.batting) {this.batNode.position.copy(this.carry.p); this.batNode.quaternion.copy(this.carry.q);}
    this.root.updateMatrixWorld(true);
  }
  private aim(name: string, childName: string, body: T.Vector3) {
    const bone = this.bone(name), current = worldPos(this.bone(childName)).sub(worldPos(bone));
    if (current.lengthSq() < 1e-8) return;
    rotateWorld(bone, Q().setFromUnitVectors(current.normalize(), this.dir(body.x, body.y, body.z)));
  }

  /** Helmet and pads are original low-poly gear attached to the rig. Eyes give the plain face a read at distance. */
  private makeGear() {
    const kit = this.options.kit, head = this.bone('Head'), top = this.bone('HeadTop_End');
    const h = worldPos(head), crown = worldPos(top), up = crown.clone().sub(h).normalize(), size = crown.distanceTo(h);
    // The nose is the most forward (+Z in bind space) face-skin vertex; skin it into the current pose.
    const geometry = this.body.geometry, regions = geometry.getAttribute('_region'), positions = geometry.getAttribute('position'), skinIndex = geometry.getAttribute('skinIndex'), headIndex = this.body.skeleton.bones.indexOf(head);
    let noseIndex = -1, best = -Infinity;
    for (let i = 0; i < regions.count; i++) if (regions.getX(i) === 0 && skinIndex.getX(i) === headIndex && positions.getZ(i) > best) {best = positions.getZ(i); noseIndex = i;}
    if (noseIndex < 0) throw Error('Player face not found');
    const nose = this.body.getVertexPosition(noseIndex, V()).applyMatrix4(this.body.matrixWorld);
    const forward = nose.clone().sub(h); forward.addScaledVector(up, -forward.dot(up)).normalize();
    const side = up.clone().cross(forward).normalize(), frame = Q().setFromRotationMatrix(new T.Matrix4().makeBasis(side, up, forward));
    const attach = (gear: T.Object3D, bone: T.Object3D, position: T.Vector3, quaternion: T.Quaternion) => {this.root.add(gear); gear.position.copy(this.root.worldToLocal(position.clone())); gear.quaternion.copy(worldQuat(this.root).invert().multiply(quaternion)); this.root.updateMatrixWorld(true); bone.attach(gear);};
    const dark = flatMaterial('#151a17', .5);
    const eyes = new T.Group(); eyes.name = 'Cricketer_eyes';
    for (const s of [-1, 1]) {const eye = addMesh(eyes, new T.SphereGeometry(.011, 6, 4), dark, V(s*.034, 0, 0)); eye.scale.set(1, .8, .45); eye.castShadow = false; const brow = addMesh(eyes, new T.BoxGeometry(.03, .006, .008), flatMaterial(kit.hair, .9), V(s*.035, .022, -.002)); brow.rotation.z = -s*.12; brow.castShadow = false;}
    attach(eyes, head, nose.clone().addScaledVector(up, size*.1).addScaledVector(forward, -.026), frame);
    if (!this.batting) return;
    const shell = flatMaterial(kit.shirt, .45), trim = flatMaterial(kit.trim, .5), grille = flatMaterial('#1a1f1d', .4);
    const helmet = new T.Group(); helmet.name = 'Cricketer_helmet'; const r = size*.68;
    addMesh(helmet, new T.SphereGeometry(r, 12, 7, 0, Math.PI*2, 0, Math.PI*.58), shell).scale.set(1, .98, 1.08);
    const peak = addMesh(helmet, new T.CylinderGeometry(r*1.02, r*1.06, .016, 12, 1, false, -Math.PI*.42, Math.PI*.84), shell, V(0, -r*.05, r*.12)); peak.rotation.y = 0; peak.scale.z = 1.35;
    addMesh(helmet, new T.TorusGeometry(r*.99, .009, 4, 14, Math.PI*1.2), trim, V(0, -r*.08, 0)).rotation.set(Math.PI/2, 0, -Math.PI*.1);
    for (const y of [-.06, -.11, -.16]) {rod(helmet, grille, V(-r*.88, y*size/.2, r*.55), V(0, y*size/.2-.01, r*1.18), .0055, 4); rod(helmet, grille, V(0, y*size/.2-.01, r*1.18), V(r*.88, y*size/.2, r*.55), .0055, 4);}
    for (const x of [-.45, 0, .45]) rod(helmet, grille, V(x*r, -r*.12, r*(1.12-Math.abs(x)*.3)), V(x*r, -r*1.12, r*(1.12-Math.abs(x)*.25)), .005, 4);
    addMesh(helmet, new T.CylinderGeometry(r*.75, r*.82, r*.32, 10, 1, true, Math.PI*.55, Math.PI*.9), shell, V(0, -r*.5, -r*.18));
    attach(helmet, head, h.clone().addScaledVector(up, size*.5).addScaledVector(forward, -size*.06), frame);
    const padMaterial = flatMaterial('#f6f2e8', .62), rib = flatMaterial('#e3ddcf', .7), strap = flatMaterial(kit.trim, .55);
    for (const s of ['Left', 'Right']) {
      const knee = worldPos(this.bone(s+'Leg')), ankle = worldPos(this.bone(s+'Foot')), toe = worldPos(this.bone(s+'ToeBase'));
      const axis = knee.clone().sub(ankle), length = axis.length(); axis.normalize();
      const front = toe.clone().sub(ankle); front.addScaledVector(axis, -front.dot(axis)).normalize();
      const across = axis.clone().cross(front).normalize(), padFrame = Q().setFromRotationMatrix(new T.Matrix4().makeBasis(across, axis, front));
      const pad = new T.Group(); pad.name = 'Cricketer_'+s+'_pad'; const tall = length+.16;
      // Five vertical rolls curving round the shin, a knee roll, a side wing and straps tucked behind.
      for (let i = -2; i <= 2; i++) addMesh(pad, new T.CylinderGeometry(.024, .022, tall*(1-Math.abs(i)*.05), 6), i%2 ? rib : padMaterial, V(i*.031, -Math.abs(i)*.01, .018-i*i*.006));
      addMesh(pad, new T.CylinderGeometry(.032, .032, .15, 7), padMaterial, V(0, tall*.36, .03)).rotation.z = Math.PI/2;
      addMesh(pad, new T.BoxGeometry(.05, tall*.72, .016), padMaterial, V(.088, -.03, -.012)).rotation.y = -.7;
      for (const y of [-.3, .05, .24]) addMesh(pad, new T.BoxGeometry(.15, .022, .014), strap, V(0, y*tall, -.03));
      attach(pad, this.bone(s+'Leg'), ankle.clone().lerp(knee, .48).addScaledVector(front, .075), padFrame);
    }
  }

  /** Blade point nearest the ball at contact (falls back to the sweet spot). */
  bladePoint() {return this.target ? this.blade.clone() : this.sweetSpot();}
  inspection() {
    let skinnedMeshes = 0; this.model.traverse(o => {if (o instanceof T.SkinnedMesh) skinnedMeshes++;});
    this.body.computeBoundingBox(); const box = this.body.boundingBox!.clone().applyMatrix4(this.body.matrixWorld);
    return {skinnedMeshes, bones: this.bones.size, gripError: this.gripError, bladeError: this.bladeError, bounds: {min: box.min.toArray(), max: box.max.toArray()}, motion: 'bat_drive_cycle@'+this.lastClip.toFixed(3), kind: this.kind};
  }
}
