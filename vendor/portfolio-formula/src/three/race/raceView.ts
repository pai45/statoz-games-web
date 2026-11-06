import type * as THREE from "three"

/** Scene objects and view state shared between the grid scene and the race director. */

export type CarRig = {
  /** positioned and rotated by the race (or parked on its grid slot) */
  root: THREE.Group
  /** pitch and roll only */
  body: THREE.Group
}

export const carRigs = new Map<string, CarRig>()

/** Where the key light (and its shadow frustum) should follow during a race. */
export const raceFocus = { active: false, x: 0, z: 0 }

/** Set while the race camera drives the view, so the portfolio rig can hand back smoothly. */
export const cameraHandoff = { race: false }
