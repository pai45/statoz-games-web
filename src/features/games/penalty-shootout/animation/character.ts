import * as THREE from "three";
import authored from "./athlete-motion.json";
import type { Vec3 } from "../game-types";
import { alignKeeperHand } from "../rendering/athlete-pose";

type Track = { node: number; path: string; times: number[]; values: number[] };
type Definition = { nodes: { name: string; parent: number; position: number[]; quaternion: number[]; scale: number[] }[]; clips: Record<string, { duration: number; tracks: Track[] }> };
export const motion = authored as Definition;
export type CharacterPose = { positions: Float32Array; rotations: Float32Array; root: Vec3; rotation: [number, number, number, number]; clip: string; time: number; preset: number; blink: number; expression: "neutral" | "smile" | "tension" };
export type PoseOptions = { root: Vec3; lean?: number; yaw?: number; tick: number; preset: number; leftPlant?: boolean; rightPlant?: boolean; resetFeet?: boolean; hands?: [Vec3, Vec3]; expression?: CharacterPose["expression"] };
const smooth = (x: number) => { const v = Math.max(0, Math.min(1, x)); return v * v * (3 - 2 * v); };
const scratch = new THREE.Quaternion();

/** CPU-only skeleton. The simulation samples it; WebGL only consumes its snapshots. */
export class CharacterAnimator {
  readonly group = new THREE.Group();
  readonly bones = new Map<string, THREE.Bone>();
  readonly nodes: THREE.Bone[];
  private clip = "";
  private transitionTick = 0;
  private previous: CharacterPose | null = null;
  private last: CharacterPose | null = null;
  private planted = new Map<string, THREE.Vector3>();
  private pelvisCorrection = 0;
  constructor() {
    this.nodes = motion.nodes.map(n => { const b = new THREE.Bone(); b.name = n.name; b.position.fromArray(n.position); b.quaternion.fromArray(n.quaternion); b.scale.fromArray(n.scale); this.bones.set(n.name, b); return b; });
    motion.nodes.forEach((n, i) => { if (n.parent < 0) this.group.add(this.nodes[i]); else this.nodes[n.parent].add(this.nodes[i]); });
  }
  point(name: string): Vec3 { const p = this.bones.get(name)!.getWorldPosition(new THREE.Vector3()); return { x: p.x, y: p.y, z: p.z }; }
  private leg(side: string, target: THREE.Vector3) {
    const upper = this.bones.get(`thigh_${side}`)!, lower = this.bones.get(`shin_${side}`)!, foot = this.bones.get(`foot_${side}`)!;
    this.group.updateMatrixWorld(true);
    const hip = upper.getWorldPosition(new THREE.Vector3()), knee = lower.getWorldPosition(new THREE.Vector3()), ankle = foot.getWorldPosition(new THREE.Vector3()), footRotation = foot.getWorldQuaternion(new THREE.Quaternion());
    const a = hip.distanceTo(knee), b = knee.distanceTo(ankle), delta = target.clone().sub(hip);
    // Compress the stance slightly when the authored hip turn makes a plant
    // unreachable. The correction is bounded; bones never stretch to a target.
    const excess = delta.length() - (a + b - .001), hips = this.bones.get("hips")!;
    if (excess > 0 && hip.y > target.y && this.pelvisCorrection < .055) {
      const drop = Math.min(.055 - this.pelvisCorrection, excess * 1.5); this.pelvisCorrection += drop;
      const correction = new THREE.Vector3(0, -drop, 0).applyQuaternion(hips.parent!.getWorldQuaternion(new THREE.Quaternion()).invert());
      hips.position.add(correction); this.group.updateMatrixWorld(true); upper.getWorldPosition(hip); delta.copy(target).sub(hip);
    }
    const distance = Math.max(.01, Math.min(delta.length(), a + b - .0001)); delta.normalize();
    const forward = new THREE.Vector3(0, 0, 1).applyQuaternion(this.group.quaternion); forward.addScaledVector(delta, -forward.dot(delta)).normalize();
    const along = (a * a - b * b + distance * distance) / (2 * distance), bend = Math.sqrt(Math.max(0, a * a - along * along));
    const desired = hip.clone().addScaledVector(delta, along).addScaledVector(forward, bend);
    const orient = (bone: THREE.Bone, child: THREE.Bone, destination: THREE.Vector3) => {
      const start = bone.getWorldPosition(new THREE.Vector3()), current = child.getWorldPosition(new THREE.Vector3()).sub(start).normalize(), wanted = destination.clone().sub(start).normalize();
      const world = bone.getWorldQuaternion(new THREE.Quaternion()), parent = bone.parent!.getWorldQuaternion(new THREE.Quaternion());
      bone.quaternion.copy(parent.invert().multiply(new THREE.Quaternion().setFromUnitVectors(current, wanted).multiply(world))); this.group.updateMatrixWorld(true);
    };
    orient(upper, lower, desired); orient(lower, foot, target);
    foot.quaternion.copy(foot.parent!.getWorldQuaternion(new THREE.Quaternion()).invert().multiply(footRotation)); this.group.updateMatrixWorld(true);
  }
  evaluate(clip: string, seconds: number, options: PoseOptions): CharacterPose {
    const definition = motion.clips[clip]; if (!definition) throw new Error(`Missing character motion: ${clip}`);
    if (clip !== this.clip) { this.previous = this.last; this.transitionTick = options.tick; this.clip = clip; }
    this.group.position.set(options.root.x, options.root.y, options.root.z); this.group.rotation.set(0, options.yaw ?? 0, options.lean ?? 0);
    for (let i = 0; i < this.nodes.length; i++) { this.nodes[i].position.fromArray(motion.nodes[i].position); this.nodes[i].quaternion.fromArray(motion.nodes[i].quaternion); }
    const time = Math.max(0, Math.min(seconds, definition.duration - .000001));
    for (const track of definition.tracks) {
      const node = this.nodes[track.node], size = track.path === "rotation" ? 4 : 3, times = track.times;
      let low = 0, high = times.length - 1;
      while (low < high) { const mid = Math.ceil((low + high) / 2); if (times[mid] <= time) low = mid; else high = mid - 1; }
      const next = Math.min(low + 1, times.length - 1), alpha = next === low ? 0 : Math.max(0, Math.min(1, (time - times[low]) / (times[next] - times[low])));
      if (track.path === "rotation") { node.quaternion.fromArray(track.values, low * size); scratch.fromArray(track.values, next * size); node.quaternion.slerp(scratch, alpha); }
      else if (track.path === "translation") { node.position.fromArray(track.values, low * size); for (let c = 0; c < 3; c++) node.position.setComponent(c, node.position.getComponent(c) + (track.values[next * size + c] - node.position.getComponent(c)) * alpha); }
    }
    // Transition weights use simulation ticks, never render delta or mixer wall time.
    const blend = smooth((options.tick - this.transitionTick) / 17);
    if (this.previous && blend < 1) for (let i = 0; i < this.nodes.length; i++) {
      const node = this.nodes[i], target = node.position.clone(); node.position.fromArray(this.previous.positions, i * 3).lerp(target, blend);
      scratch.copy(node.quaternion); node.quaternion.fromArray(this.previous.rotations, i * 4).slerp(scratch, blend);
    }
    this.group.updateMatrixWorld(true);
    this.pelvisCorrection = 0;
    if (options.resetFeet) this.planted.clear();
    for (const [side, active] of [["L", options.leftPlant], ["R", options.rightPlant]] as const) {
      if (!active) { this.planted.delete(side); continue; }
      const foot = this.bones.get(`foot_${side}`)!;
      if (!this.planted.has(side)) { const anchor = foot.getWorldPosition(new THREE.Vector3()); anchor.y = .12; this.planted.set(side, anchor); }
      this.leg(side, this.planted.get(side)!);
    }
    if (options.hands) { alignKeeperHand(this.group, this.bones, "L", options.hands[0]); alignKeeperHand(this.group, this.bones, "R", options.hands[1]); }
    // Small bounded look-down movement; does not target unreleased aim or alter reach.
    const head = this.bones.get("head"); if (head && (clip.startsWith("prepare") || clip.startsWith("keeper_ready"))) head.rotateX(.025 * Math.sin(options.tick / 180));
    this.group.updateMatrixWorld(true);
    const positions = new Float32Array(this.nodes.length * 3), rotations = new Float32Array(this.nodes.length * 4);
    this.nodes.forEach((node, i) => { node.position.toArray(positions, i * 3); node.quaternion.toArray(rotations, i * 4); });
    const blinkTime = (options.tick + options.preset * 73) % 430, blink = blinkTime < 14 ? Math.sin(blinkTime / 14 * Math.PI) : 0;
    this.last = { positions, rotations, root: { ...options.root }, rotation: this.group.quaternion.toArray() as CharacterPose["rotation"], clip, time, preset: options.preset, blink, expression: options.expression ?? "neutral" };
    return this.last;
  }
}

export function applyCharacterPose(group: THREE.Group, nodes: Map<string, THREE.Object3D>, pose: CharacterPose, previous: CharacterPose | undefined, alpha: number) {
  const fraction = previous ? Math.max(0, Math.min(1, alpha)) : 1;
  group.position.set(pose.root.x, pose.root.y, pose.root.z); group.quaternion.fromArray(pose.rotation);
  if (previous) { group.position.lerp(new THREE.Vector3(previous.root.x, previous.root.y, previous.root.z), 1 - fraction); scratch.fromArray(previous.rotation); group.quaternion.slerp(scratch, 1 - fraction); }
  motion.nodes.forEach((definition, i) => {
    const node = nodes.get(definition.name); if (!node) return;
    node.position.fromArray(pose.positions, i * 3); node.quaternion.fromArray(pose.rotations, i * 4);
    if (previous) { node.position.lerp(new THREE.Vector3().fromArray(previous.positions, i * 3), 1 - fraction); scratch.fromArray(previous.rotations, i * 4); node.quaternion.slerp(scratch, 1 - fraction); }
  });
  group.updateMatrixWorld(true);
}
