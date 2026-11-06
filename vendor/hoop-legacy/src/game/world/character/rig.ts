import * as THREE from 'three'
import type { V3 } from './sdf'

/**
 * Skeleton layout. Indices 0-16 keep the original layout so poses authored for the old rig still apply;
 * the clavicles (17, 18) are driven automatically from the upper-arm pose to lift the shoulder girdle.
 * All offsets are in normalized units (character height = 1); the rig object is scaled by height in metres.
 */
export const B = {
  hips: 0,
  spine: 1,
  chest: 2,
  neck: 3,
  head: 4,
  upperArmL: 5,
  forearmL: 6,
  handL: 7,
  upperArmR: 8,
  forearmR: 9,
  handR: 10,
  thighL: 11,
  shinL: 12,
  footL: 13,
  thighR: 14,
  shinR: 15,
  footR: 16,
  clavicleL: 17,
  clavicleR: 18,
} as const

export const BONE_COUNT = 19
export const PARENT = [-1, 0, 1, 2, 3, 17, 5, 6, 18, 8, 9, 0, 11, 12, 0, 14, 15, 2, 2]

export const OFFSETS: V3[] = [
  [0, 0.56, 0],
  [0, 0.06, 0],
  [0, 0.12, 0],
  [0, 0.105, 0],
  [0, 0.03, 0],
  [0.09, 0, 0],
  [0, -0.175, 0],
  [0, -0.145, 0],
  [-0.09, 0, 0],
  [0, -0.175, 0],
  [0, -0.145, 0],
  [0.048, -0.03, 0],
  [0, -0.245, 0],
  [0, -0.246, 0],
  [-0.048, -0.03, 0],
  [0, -0.245, 0],
  [0, -0.246, 0],
  [0.022, 0.075, 0],
  [-0.022, 0.075, 0],
]

/** Bind-pose abduction: the mesh is sculpted in an A-pose so limbs never fuse with the torso. */
export const ARM_A = 0.6
export const LEG_A = 0.12

export const UPPER_ARM_LEN = 0.175
export const FOREARM_LEN = 0.145
export const THIGH_LEN = 0.245
export const SHIN_LEN = 0.246

export function bindRotation(i: number): V3 {
  switch (i) {
    case B.upperArmL:
      return [0, 0, ARM_A]
    case B.upperArmR:
      return [0, 0, -ARM_A]
    case B.thighL:
      return [0, 0, LEG_A]
    case B.thighR:
      return [0, 0, -LEG_A]
  }
  return [0, 0, 0]
}

export interface BindPose {
  /** joint positions (normalized) */
  pos: V3[]
  /** bone world matrices (normalized space) */
  mat: THREE.Matrix4[]
}

let cached: BindPose | null = null

export function bindPose(): BindPose {
  if (cached) return cached
  const bones = createBones()
  bones[0].updateMatrixWorld(true)
  cached = {
    pos: bones.map((b) => {
      const v = new THREE.Vector3().setFromMatrixPosition(b.matrixWorld)
      return [v.x, v.y, v.z] as V3
    }),
    mat: bones.map((b) => b.matrixWorld.clone()),
  }
  return cached
}

/** Creates the bone hierarchy posed in the bind (A) pose. */
export function createBones() {
  const bones: THREE.Bone[] = []
  for (let i = 0; i < BONE_COUNT; i++) {
    const b = new THREE.Bone()
    b.position.set(...OFFSETS[i])
    b.rotation.set(...bindRotation(i))
    bones.push(b)
  }
  for (let i = 0; i < BONE_COUNT; i++) if (PARENT[i] >= 0) bones[PARENT[i]].add(bones[i])
  return bones
}

/**
 * Shoulder-girdle response to an upper-arm orientation (expressed in the chest frame): raised arms lift
 * the clavicle, reaching forward protracts it. Returns rotations for the clavicle bone (side-signed).
 */
export function clavicleAngles(armQuat: THREE.Quaternion, side: 1 | -1, out: { y: number; z: number }) {
  _down.set(0, -1, 0).applyQuaternion(armQuat)
  const elev = Math.acos(Math.max(-1, Math.min(1, -_down.y)))
  const lift = Math.max(0, Math.min(0.34, (elev - 1.2) * 0.4))
  const prot = Math.max(-0.08, Math.min(0.2, _down.z * 0.2))
  out.y = -prot * side
  out.z = lift * side
  return out
}
const _down = new THREE.Vector3()

/** Transforms a point from a bone's bind-pose local frame to normalized model space. */
export function boneToModel(bone: number, p: V3): V3 {
  const v = new THREE.Vector3(...p).applyMatrix4(bindPose().mat[bone])
  return [v.x, v.y, v.z]
}
