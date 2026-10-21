import * as THREE from "three";
import type { Vec3 } from "../game-types";

/** The authored hand pivot is the palm centre, shared with its ball collider. */
export function alignKeeperHand(group: THREE.Group, bones: Map<string, THREE.Bone>, side: "L" | "R", destination: Vec3) {
  const upper = bones.get(`upper_arm_${side}`), lower = bones.get(`forearm_${side}`), hand = bones.get(`hand_${side}`);
  if (!upper || !lower || !hand) return;
  group.updateMatrixWorld(true);
  const shoulder = upper.getWorldPosition(new THREE.Vector3()), elbow = lower.getWorldPosition(new THREE.Vector3()), palm = hand.getWorldPosition(new THREE.Vector3());
  const target = new THREE.Vector3(destination.x, destination.y, destination.z), direction = target.clone().sub(shoulder), lengthA = shoulder.distanceTo(elbow), lengthB = elbow.distanceTo(palm), distance = Math.min(direction.length(), lengthA + lengthB - 0.001);
  direction.normalize();
  // Outward elbow pole preserves a ready stance rather than pointing both
  // elbows into the camera. Rotate the pole with the diver's body on landing.
  const bend = new THREE.Vector3(side === "L" ? .25 : -.25, -.35, -1).applyQuaternion(group.quaternion);
  bend.addScaledVector(direction, -bend.dot(direction)).normalize();
  const along = (lengthA ** 2 - lengthB ** 2 + distance ** 2) / Math.max(0.001, 2 * distance), height = Math.sqrt(Math.max(0, lengthA ** 2 - along ** 2));
  const desiredElbow = shoulder.clone().addScaledVector(direction, along).addScaledVector(bend, height);
  const orient = (bone: THREE.Bone, child: THREE.Bone, point: THREE.Vector3) => {
    const start = bone.getWorldPosition(new THREE.Vector3()), now = child.getWorldPosition(new THREE.Vector3()).sub(start).normalize(), wanted = point.clone().sub(start).normalize(), world = bone.getWorldQuaternion(new THREE.Quaternion()), parent = bone.parent!.getWorldQuaternion(new THREE.Quaternion());
    bone.quaternion.copy(parent.invert().multiply(new THREE.Quaternion().setFromUnitVectors(now, wanted).multiply(world))); group.updateMatrixWorld(true);
  };
  orient(upper, lower, desiredElbow); orient(lower, hand, target);
}
