// Procedural, rigidly skinned humans with layered procedural animation and capsule hitboxes.
import * as THREE from 'three'

import { MeshBuilder, createSpriteTexture, vary } from './builder.ts'
import { intersectCapsule, type CollisionWorld } from './collision.ts'
import type { ActorKind, Pose } from './data.ts'
import { clamp, damp, mulberry32 } from './noise.ts'

export type HitPart = 'head' | 'torso' | 'pelvis' | 'arm' | 'leg'
export type UpperMode = 'relaxed' | 'ready' | 'aim' | 'cower' | 'carry'

export interface ActorHit {
  t: number
  part: HitPart
}

// Bone indices.
const ROOT = 0
const HIPS = 1
const SPINE = 2
const CHEST = 3
const NECK = 4
const ARM_L = 5
const FORE_L = 6
const ARM_R = 7
const FORE_R = 8
const THIGH_L = 9
const SHIN_L = 10
const THIGH_R = 11
const SHIN_R = 12
const WEAPON = 13

const BONES: Array<{ parent: number; pos: [number, number, number] }> = [
  { parent: -1, pos: [0, 0, 0] },
  { parent: ROOT, pos: [0, 0.98, 0] },
  { parent: HIPS, pos: [0, 0.12, 0] },
  { parent: SPINE, pos: [0, 0.2, 0] },
  { parent: CHEST, pos: [0, 0.21, 0] },
  { parent: CHEST, pos: [0.2, 0.14, 0] },
  { parent: ARM_L, pos: [0, -0.29, 0] },
  { parent: CHEST, pos: [-0.2, 0.14, 0] },
  { parent: ARM_R, pos: [0, -0.29, 0] },
  { parent: HIPS, pos: [0.1, -0.05, 0] },
  { parent: THIGH_L, pos: [0, -0.44, 0] },
  { parent: HIPS, pos: [-0.1, -0.05, 0] },
  { parent: THIGH_R, pos: [0, -0.44, 0] },
  { parent: CHEST, pos: [0, -0.1, 0.25] },
]

// ---------------------------------------------------------------------------
// Looks

type HeadGear = 'wrap' | 'balaclava' | 'cap' | 'helmet' | 'beret' | 'hair' | 'scarf' | 'hood'
type Rig = 'none' | 'chest' | 'plate' | 'heavy' | 'ghillie'
type Weapon = 'ak' | 'pkm' | 'sniper' | 'none'

interface Look {
  skin: string
  top: string
  sleeves: string
  pants: string
  boots: string
  head: HeadGear
  headColor: string
  rig: Rig
  rigColor: string
  weapon: Weapon
  coat?: string
  dress?: string
  beard?: boolean
  briefcase?: boolean
  gloves?: string
}

const SKINS = ['#c99a78', '#b07f5c', '#8d5f43', '#d8ae8c', '#a8755a', '#6e4a35']
const MILITIA_TOPS = ['#5a5f45', '#6b6550', '#4a4f3c', '#7a6e56', '#3f4437', '#5c5446']
const MILITIA_PANTS = ['#4a4c3c', '#5d5848', '#3b3d33', '#6f6450', '#2f322c']
const WRAPS = ['#c9bc9b', '#a5413a', '#d6cfbf', '#3b3a36', '#8c8269']
const CIV_TOPS = ['#c8a35a', '#7c9bb5', '#b55a4a', '#d9d3c4', '#6c7f5a', '#9b6b8e', '#e0b25c', '#4f6f8f', '#c47a3c']
const CIV_PANTS = ['#3c3a37', '#5b5148', '#2f3a4a', '#6b5e4c', '#47433c']

function pick<T>(random: () => number, list: readonly T[]): T {
  return list[Math.floor(random() * list.length) % list.length]
}

export type ActorVariant = 'courier' | 'warlord' | undefined

function lookFor(kind: ActorKind, seed: number, variant: ActorVariant): Look {
  const r = mulberry32(seed)
  const skin = pick(r, SKINS)
  if (kind === 'civilian') {
    const female = r() < 0.4
    const top = pick(r, CIV_TOPS)
    return {
      skin,
      top,
      sleeves: r() < 0.5 ? top : skin,
      pants: pick(r, CIV_PANTS),
      boots: '#2b2622',
      head: female ? 'scarf' : r() < 0.35 ? 'cap' : 'hair',
      headColor: female ? pick(r, ['#2f3a4a', '#7c3f62', '#c9bc9b', '#3b3a36', '#567a3a']) : pick(r, ['#1d1a17', '#3a2e24', '#6d6a63']),
      rig: 'none',
      rigColor: '#000',
      weapon: 'none',
      dress: female && r() < 0.7 ? pick(r, ['#2f3a4a', '#5b4f6b', '#6b4f3a', '#3b4a3a']) : undefined,
      beard: !female && r() < 0.4,
    }
  }
  if (kind === 'hvt') {
    if (variant === 'warlord') {
      return {
        skin,
        top: '#2c2a26',
        sleeves: '#2c2a26',
        pants: '#26241f',
        boots: '#1a1816',
        head: 'cap',
        headColor: '#3b3326',
        rig: 'none',
        rigColor: '#000',
        weapon: 'none',
        coat: '#3e3428',
        beard: true,
      }
    }
    return {
      skin,
      top: '#2a2d33',
      sleeves: '#2a2d33',
      pants: '#24262a',
      boots: '#151515',
      head: 'beret',
      headColor: '#a3241f',
      rig: 'none',
      rigColor: '#000',
      weapon: 'none',
      briefcase: true,
      beard: r() < 0.5,
    }
  }
  if (kind === 'heavy') {
    return {
      skin,
      top: '#33362e',
      sleeves: '#33362e',
      pants: '#2e302a',
      boots: '#1b1b19',
      head: 'helmet',
      headColor: '#2c2f2a',
      rig: 'heavy',
      rigColor: '#3a3d34',
      weapon: 'pkm',
      gloves: '#1e1e1c',
    }
  }
  if (kind === 'sniper') {
    return {
      skin,
      top: '#4b4a35',
      sleeves: '#4b4a35',
      pants: '#4a4533',
      boots: '#2a2620',
      head: 'hood',
      headColor: '#4f4c35',
      rig: 'ghillie',
      rigColor: '#55513a',
      weapon: 'sniper',
      gloves: '#3b3a2e',
    }
  }
  const top = pick(r, MILITIA_TOPS)
  const head = pick(r, ['wrap', 'wrap', 'balaclava', 'cap', 'helmet'] as const)
  return {
    skin,
    top,
    sleeves: r() < 0.8 ? top : skin,
    pants: pick(r, MILITIA_PANTS),
    boots: pick(r, ['#2b2622', '#4a3d2e', '#1f1f1d']),
    head,
    headColor: head === 'wrap' ? pick(r, WRAPS) : head === 'helmet' ? '#4d5338' : head === 'cap' ? pick(r, ['#4a4f3c', '#2f322c', '#6b6550']) : '#1d1d1b',
    rig: r() < 0.75 ? 'chest' : 'plate',
    rigColor: pick(r, ['#6b6550', '#4d5338', '#7d7158', '#3b3d33']),
    weapon: 'ak',
    beard: r() < 0.55,
    gloves: r() < 0.4 ? '#2a2723' : undefined,
  }
}

function buildWeapon(b: MeshBuilder, weapon: Weapon, random: () => number): void {
  // Weapon bone bind origin: (0, 1.2, 0.25). Modeled along +Z with the grip at the origin.
  const ox = 0
  const oy = 1.2
  const oz = 0.25
  const W = WEAPON
  if (weapon === 'none') return
  const black = '#1f2021'
  if (weapon === 'ak') {
    const wood = vary('#6b3f22', random, 0.08)
    b.box(ox, oy + 0.03, oz + 0.08, 0.05, 0.075, 0.32, black, 0, W)
    b.boxEuler(ox, oy + 0.01, oz - 0.17, 0.04, 0.075, 0.27, wood, 0.12, 0, 0, W)
    b.box(ox, oy + 0.035, oz + 0.3, 0.055, 0.055, 0.15, wood, 0, W)
    b.tube(ox, oy + 0.05, oz + 0.36, ox, oy + 0.05, oz + 0.66, 0.011, black, 5, W)
    b.tube(ox, oy + 0.085, oz + 0.24, ox, oy + 0.085, oz + 0.46, 0.008, black, 4, W)
    b.boxEuler(ox, oy - 0.07, oz + 0.15, 0.028, 0.15, 0.055, '#2a2b2c', -0.35, 0, 0, W)
    b.boxEuler(ox, oy - 0.04, oz + 0.0, 0.03, 0.09, 0.04, black, 0.35, 0, 0, W)
    return
  }
  if (weapon === 'pkm') {
    b.box(ox, oy + 0.03, oz + 0.1, 0.06, 0.09, 0.42, black, 0, W)
    b.boxEuler(ox, oy + 0.0, oz - 0.2, 0.045, 0.09, 0.3, '#2b2c2d', 0.1, 0, 0, W)
    b.tube(ox, oy + 0.05, oz + 0.3, ox, oy + 0.05, oz + 0.88, 0.016, black, 6, W)
    b.box(ox + 0.06, oy - 0.05, oz + 0.12, 0.08, 0.1, 0.12, '#3d4232', 0, W)
    b.tube(ox - 0.02, oy + 0.02, oz + 0.75, ox - 0.06, oy - 0.1, oz + 0.62, 0.006, black, 4, W)
    b.tube(ox + 0.02, oy + 0.02, oz + 0.75, ox + 0.06, oy - 0.1, oz + 0.62, 0.006, black, 4, W)
    return
  }
  // Scoped bolt rifle.
  const furniture = vary('#4b4a35', random, 0.06)
  b.box(ox, oy + 0.03, oz + 0.08, 0.05, 0.07, 0.34, black, 0, W)
  b.boxEuler(ox, oy + 0.0, oz - 0.22, 0.045, 0.1, 0.36, furniture, 0.08, 0, 0, W)
  b.box(ox, oy + 0.03, oz + 0.38, 0.06, 0.06, 0.32, furniture, 0, W)
  b.tube(ox, oy + 0.045, oz + 0.4, ox, oy + 0.045, oz + 1.0, 0.013, black, 6, W)
  b.tube(ox, oy + 0.12, oz - 0.04, ox, oy + 0.12, oz + 0.3, 0.02, black, 8, W)
  b.cylinder(ox, oy + 0.12, oz + 0.3, 0.032, 0.09, black, 10, 1, Math.PI / 2, 0, W)
  b.cylinder(ox, oy + 0.12, oz - 0.05, 0.026, 0.05, black, 8, 1, -Math.PI / 2, 0, W)
  b.box(ox, oy + 0.075, oz + 0.12, 0.03, 0.05, 0.04, black, 0, W)
}

function buildHuman(look: Look, seed: number): THREE.BufferGeometry {
  const random = mulberry32(seed + 17)
  const b = new MeshBuilder(0.5, true)
  const skin = vary(look.skin, random, 0.04)
  const top = vary(look.top, random, 0.05)
  const sleeves = look.sleeves === look.skin ? skin : vary(look.sleeves, random, 0.05)
  const pants = vary(look.pants, random, 0.05)
  const boots = vary(look.boots, random, 0.04)
  const hands = look.gloves ? vary(look.gloves, random, 0.04) : skin
  // Legs.
  for (const s of [1, -1]) {
    const thigh = s > 0 ? THIGH_L : THIGH_R
    const shin = s > 0 ? SHIN_L : SHIN_R
    b.tube(0.1 * s, 0.97, 0, 0.1 * s, 0.5, 0.012, 0.08, pants, 7, thigh)
    b.sphere(0.1 * s, 0.5, 0.012, 0.072, 0.07, 0.075, pants, false, shin)
    b.tube(0.1 * s, 0.5, 0.012, 0.1 * s, 0.11, 0, 0.06, pants, 7, shin)
    b.box(0.1 * s, 0.055, 0.04, 0.11, 0.11, 0.27, boots, 0, shin)
    if (look.rig === 'heavy' || (look.rig !== 'none' && random() < 0.4)) b.box(0.1 * s, 0.5, 0.075, 0.1, 0.1, 0.04, '#2a2b27', 0, shin)
  }
  // Pelvis and torso.
  b.box(0, 0.95, 0, 0.34, 0.2, 0.22, pants, 0, HIPS)
  b.box(0, 1.045, 0, 0.36, 0.06, 0.235, '#2a2621', 0, HIPS)
  b.box(0, 1.16, 0, 0.32, 0.2, 0.2, top, 0, SPINE)
  b.box(0, 1.345, 0, 0.38, 0.28, 0.23, top, 0, CHEST)
  for (const s of [1, -1]) b.sphere(0.18 * s, 1.43, 0, 0.085, 0.075, 0.095, top, true, CHEST)
  if (look.coat) {
    const coat = vary(look.coat, random, 0.04)
    b.box(0, 1.33, 0, 0.42, 0.33, 0.27, coat, 0, CHEST)
    b.box(0, 1.15, 0, 0.38, 0.22, 0.25, coat, 0, SPINE)
    b.box(0, 0.78, 0, 0.42, 0.5, 0.27, coat, 0, HIPS)
    b.box(0, 1.47, 0.04, 0.3, 0.06, 0.18, coat.clone().multiplyScalar(0.8), 0, CHEST)
  }
  if (look.dress) {
    const dress = vary(look.dress, random, 0.05)
    b.cylinder(0, 0.36, 0, 0.29, 0.7, dress, 10, 0.66, 0, 0, HIPS)
    b.box(0, 1.25, 0, 0.36, 0.4, 0.22, dress, 0, CHEST)
  }
  const rig = vary(look.rigColor, random, 0.05)
  if (look.rig === 'chest') {
    b.box(0, 1.27, 0.03, 0.36, 0.2, 0.27, rig, 0, CHEST)
    for (const x of [-0.09, 0, 0.09]) b.box(x, 1.25, 0.17, 0.07, 0.13, 0.05, rig.clone().multiplyScalar(0.85), 0, CHEST)
    for (const s of [1, -1]) b.box(0.11 * s, 1.42, 0, 0.05, 0.03, 0.25, rig, 0, CHEST)
  } else if (look.rig === 'plate') {
    b.box(0, 1.33, 0, 0.4, 0.32, 0.3, rig, 0, CHEST)
    for (const x of [-0.1, 0, 0.1]) b.box(x, 1.24, 0.16, 0.08, 0.12, 0.05, rig.clone().multiplyScalar(0.82), 0, CHEST)
    b.box(0.13, 1.18, 0.12, 0.08, 0.08, 0.06, '#3a3a36', 0, SPINE)
  } else if (look.rig === 'heavy') {
    b.box(0, 1.32, 0, 0.47, 0.4, 0.36, rig, 0, CHEST)
    b.box(0, 1.12, 0, 0.42, 0.18, 0.31, rig, 0, SPINE)
    for (const s of [1, -1]) b.sphere(0.24 * s, 1.43, 0, 0.11, 0.08, 0.12, rig, true, CHEST)
    b.box(0, 0.88, 0.1, 0.22, 0.16, 0.05, rig, 0, HIPS)
    b.box(0, 1.5, 0, 0.3, 0.08, 0.3, rig.clone().multiplyScalar(0.8), 0, CHEST)
  } else if (look.rig === 'ghillie') {
    const greens = ['#4f4c35', '#5d5a3c', '#6b6243', '#3f4030', '#7a6e4c']
    for (let i = 0; i < 26; i += 1) {
      const a = random() * Math.PI * 2
      const y = 1.1 + random() * 0.45
      b.sphere(Math.cos(a) * 0.2, y, Math.sin(a) * 0.15 - 0.03, 0.07 + random() * 0.05, 0.05 + random() * 0.05, 0.07, vary(pick(random, greens), random, 0.08), false, CHEST)
    }
    for (let i = 0; i < 10; i += 1) {
      b.sphere((random() - 0.5) * 0.32, 0.9 + random() * 0.15, -0.08 + random() * 0.05, 0.08, 0.07, 0.08, vary(pick(random, greens), random, 0.08), false, HIPS)
    }
  }
  // Neck and head.
  b.cylinder(0, 1.49, 0, 0.055, 0.11, skin, 8, 1, 0, 0, NECK)
  b.sphere(0, 1.655, 0.01, 0.1, 0.12, 0.112, skin, true, NECK)
  b.box(0, 1.645, 0.112, 0.026, 0.04, 0.03, skin, 0, NECK)
  const headColor = vary(look.headColor, random, 0.05)
  switch (look.head) {
    case 'wrap':
      b.sphere(0, 1.68, -0.012, 0.113, 0.118, 0.118, headColor, true, NECK)
      b.box(0, 1.6, 0.06, 0.2, 0.08, 0.11, headColor, 0, NECK)
      b.box(0, 1.5, 0, 0.2, 0.08, 0.2, headColor, 0, NECK)
      break
    case 'balaclava':
      b.sphere(0, 1.657, 0.008, 0.106, 0.126, 0.117, headColor, true, NECK)
      b.box(0, 1.685, 0.1, 0.12, 0.032, 0.035, skin, 0, NECK)
      break
    case 'cap':
      b.sphere(0, 1.705, -0.008, 0.105, 0.075, 0.112, headColor, true, NECK)
      b.box(0, 1.73, 0.1, 0.13, 0.014, 0.09, headColor, 0, NECK)
      break
    case 'helmet':
      b.sphere(0, 1.71, 0, 0.128, 0.105, 0.138, headColor, true, NECK)
      b.box(0, 1.665, 0, 0.24, 0.03, 0.27, headColor.clone().multiplyScalar(0.85), 0, NECK)
      if (look.rig === 'heavy') b.box(0, 1.645, 0.1, 0.17, 0.08, 0.04, '#151617', 0, NECK)
      break
    case 'beret':
      b.sphere(0, 1.71, -0.01, 0.103, 0.085, 0.11, '#1a1715', true, NECK)
      b.geometry(new THREE.SphereGeometry(1, 10, 6), 0.025, 1.77, 0, headColor, 0, 0, 0.22, 0.12, 0.045, 0.125, NECK)
      break
    case 'hair':
      b.sphere(0, 1.695, -0.014, 0.106, 0.1, 0.114, headColor, true, NECK)
      break
    case 'scarf':
      b.sphere(0, 1.67, -0.01, 0.116, 0.126, 0.121, headColor, true, NECK)
      b.box(0, 1.47, -0.02, 0.32, 0.12, 0.22, headColor, 0, CHEST)
      break
    case 'hood': {
      b.sphere(0, 1.67, -0.02, 0.122, 0.128, 0.13, headColor, true, NECK)
      for (let i = 0; i < 12; i += 1) {
        const a = random() * Math.PI * 2
        b.sphere(Math.cos(a) * 0.1, 1.65 + random() * 0.12, Math.sin(a) * 0.08 - 0.04, 0.05, 0.05, 0.05, vary(pick(random, ['#4f4c35', '#6b6243', '#3f4030']), random, 0.08), false, NECK)
      }
      break
    }
  }
  if (look.beard) b.box(0, 1.59, 0.075, 0.14, 0.075, 0.07, '#231d18', 0, NECK)
  // Arms.
  for (const s of [1, -1]) {
    const arm = s > 0 ? ARM_L : ARM_R
    const fore = s > 0 ? FORE_L : FORE_R
    b.tube(0.2 * s, 1.45, 0, 0.205 * s, 1.16, 0, 0.058, look.coat ? vary(look.coat, random, 0.03) : top, 7, arm)
    b.sphere(0.205 * s, 1.155, 0, 0.05, 0.05, 0.052, sleeves, false, fore)
    b.tube(0.205 * s, 1.15, 0, 0.205 * s, 0.92, 0.0, 0.046, look.coat ? vary(look.coat, random, 0.03) : sleeves, 7, fore)
    b.sphere(0.205 * s, 0.865, 0.01, 0.045, 0.07, 0.04, hands, true, fore)
  }
  if (look.briefcase) {
    b.box(0.215, 0.7, 0.0, 0.08, 0.3, 0.42, '#3a2a1e', 0, FORE_L)
    b.box(0.215, 0.86, 0.0, 0.03, 0.03, 0.12, '#1d1612', 0, FORE_L)
  }
  buildWeapon(b, look.weapon, random)
  return b.build()
}

// ---------------------------------------------------------------------------
// Poses: 14 bones x 3 Euler angles plus hips height/offset, weapon offset, and root pitch/lift.

const P_HIPS_Y = 42
const P_HIPS_Z = 43
const P_WEAPON = 44
const P_ROOT_PITCH = 47
const P_ROOT_LIFT = 48
const POSE_SIZE = 49

function setBone(p: Float32Array, bone: number, x: number, y = 0, z = 0): void {
  p[bone * 3] = x
  p[bone * 3 + 1] = y
  p[bone * 3 + 2] = z
}

function basePose(p: Float32Array, stance: Pose, upper: UpperMode, armed: boolean): void {
  p.fill(0)
  p[P_HIPS_Y] = 0.98
  p[P_WEAPON] = 0
  p[P_WEAPON + 1] = -0.1
  p[P_WEAPON + 2] = 0.25
  if (stance === 'prone') {
    p[P_ROOT_PITCH] = Math.PI / 2
    p[P_ROOT_LIFT] = 0.15
    setBone(p, THIGH_L, 0, 0, 0.1)
    setBone(p, THIGH_R, 0, 0, -0.1)
    setBone(p, SHIN_L, 0.08)
    setBone(p, SHIN_R, 0.08)
    setBone(p, SPINE, 0.04)
    setBone(p, CHEST, -0.12)
    setBone(p, NECK, -1.2)
    setBone(p, ARM_L, -2.3, 0, 0.42)
    setBone(p, FORE_L, -1.35)
    setBone(p, ARM_R, -2.15, 0, -0.42)
    setBone(p, FORE_R, -1.55)
    setBone(p, WEAPON, -1.5)
    p[P_WEAPON] = -0.07
    p[P_WEAPON + 1] = 0.36
    p[P_WEAPON + 2] = -0.06
    return
  }
  if (stance === 'crouch') {
    p[P_HIPS_Y] = 0.64
    p[P_HIPS_Z] = -0.14
    setBone(p, THIGH_L, -1.3, 0, 0.05)
    setBone(p, SHIN_L, 1.7)
    setBone(p, THIGH_R, -1.1, 0, -0.05)
    setBone(p, SHIN_R, 1.75)
    setBone(p, SPINE, 0.3)
    setBone(p, CHEST, 0.1)
    setBone(p, NECK, -0.3)
  } else if (stance === 'kneel') {
    p[P_HIPS_Y] = 0.6
    p[P_HIPS_Z] = -0.05
    setBone(p, THIGH_L, -1.45, 0, 0.06)
    setBone(p, SHIN_L, 1.45)
    setBone(p, THIGH_R, 0.12, 0, -0.06)
    setBone(p, SHIN_R, 1.45)
    setBone(p, SPINE, 0.08)
  } else {
    setBone(p, SPINE, 0.02)
    setBone(p, CHEST, 0.02)
  }
  const mode = !armed && (upper === 'ready' || upper === 'aim') ? 'relaxed' : upper
  switch (mode) {
    case 'relaxed':
      setBone(p, ARM_L, 0.06, 0, 0.09)
      setBone(p, FORE_L, -0.22)
      setBone(p, ARM_R, 0.06, 0, -0.09)
      setBone(p, FORE_R, -0.22)
      break
    case 'carry':
      setBone(p, ARM_L, 0.02, 0, 0.12)
      setBone(p, FORE_L, -0.08)
      setBone(p, ARM_R, 0.08, 0, -0.08)
      setBone(p, FORE_R, -0.25)
      break
    case 'ready':
      setBone(p, ARM_R, -0.45, 0, -0.18)
      setBone(p, FORE_R, -1.15)
      setBone(p, ARM_L, -0.95, 0, -0.28)
      setBone(p, FORE_L, -0.75)
      setBone(p, WEAPON, 0.55, 0.2, 0)
      p[P_WEAPON] = -0.13
      p[P_WEAPON + 1] = -0.14
      p[P_WEAPON + 2] = 0.28
      break
    case 'aim':
      p[CHEST * 3] -= 0.02
      setBone(p, ARM_R, -1.25, 0, -0.55)
      setBone(p, FORE_R, -1.35)
      setBone(p, ARM_L, -1.35, 0, -0.42)
      setBone(p, FORE_L, -0.45)
      setBone(p, NECK, 0.18, 0, 0.12)
      setBone(p, WEAPON, 0, 0, 0)
      p[P_WEAPON] = -0.1
      p[P_WEAPON + 1] = 0.2
      p[P_WEAPON + 2] = 0.1
      break
    case 'cower':
      p[SPINE * 3] += 0.35
      setBone(p, NECK, 0.45)
      setBone(p, ARM_L, -2.55, 0, 0.55)
      setBone(p, FORE_L, -2.1)
      setBone(p, ARM_R, -2.55, 0, -0.55)
      setBone(p, FORE_R, -2.1)
      break
  }
}

// ---------------------------------------------------------------------------

const _a = new THREE.Vector3()
const _b = new THREE.Vector3()
const _q = new THREE.Quaternion()
const _q2 = new THREE.Quaternion()
const X_AXIS = new THREE.Vector3(1, 0, 0)

interface Capsule {
  a: THREE.Vector3
  b: THREE.Vector3
  r: number
  part: HitPart
}

let nextActorId = 1
let beamTexture: THREE.Texture | null = null
let flareTexture: THREE.Texture | null = null

function beamAlpha(): THREE.Texture {
  if (beamTexture) return beamTexture
  const canvas = document.createElement('canvas')
  canvas.width = 4
  canvas.height = 64
  const ctx = canvas.getContext('2d')!
  const gradient = ctx.createLinearGradient(0, 0, 0, 64)
  gradient.addColorStop(0, 'rgba(255,255,255,0)')
  gradient.addColorStop(0.75, 'rgba(255,255,255,0.35)')
  gradient.addColorStop(1, 'rgba(255,255,255,1)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 4, 64)
  beamTexture = new THREE.CanvasTexture(canvas)
  return beamTexture
}

export interface ActorOptions {
  kind: ActorKind
  seed: number
  variant?: ActorVariant
  flashlight?: boolean
}

export class Actor {
  static thermal = false

  readonly id = nextActorId++
  readonly kind: ActorKind
  readonly group = new THREE.Group()
  readonly mesh: THREE.SkinnedMesh
  readonly bones: THREE.Bone[]
  readonly material: THREE.MeshStandardMaterial
  readonly armed: boolean

  alive = true
  // Feet position and compass heading (radians, 0 = north, PI = toward the player).
  x = 0
  y = 0
  z = 0
  heading = Math.PI
  stance: Pose = 'stand'
  upper: UpperMode = 'ready'
  speed = 0
  /** Additional head turn relative to the body, radians. */
  lookYaw = 0
  lookPitch = 0
  aimPitch = 0
  heat = 1
  flinchTime = 0
  hidden = false

  private targetLookYaw = 0
  private targetLookPitch = 0
  private phase = Math.random() * Math.PI * 2
  private readonly pose = new Float32Array(POSE_SIZE)
  private readonly target = new Float32Array(POSE_SIZE)
  private poseKey = ''
  private deathTime = -1
  private deathAxis = new THREE.Vector3(1, 0, 0)
  private deathKind: 'topple' | 'crumple' | 'slump' = 'topple'
  private deathSpin = 0
  private headshot = false
  private readonly capsules: Capsule[]
  private readonly hipsWorld = new THREE.Vector3()
  private readonly seed: number
  private flashlight: THREE.Group | null = null

  constructor(options: ActorOptions) {
    this.kind = options.kind
    this.seed = options.seed
    const look = lookFor(options.kind, options.seed, options.variant)
    this.armed = look.weapon !== 'none'
    if (!this.armed) this.upper = options.kind === 'hvt' && look.briefcase ? 'carry' : 'relaxed'
    const geometry = buildHuman(look, options.seed)
    this.material = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.86, metalness: 0.02 })
    this.mesh = new THREE.SkinnedMesh(geometry, this.material)
    this.mesh.castShadow = true
    this.mesh.receiveShadow = true
    this.mesh.frustumCulled = false
    this.bones = BONES.map(() => new THREE.Bone())
    BONES.forEach((spec, index) => {
      const bone = this.bones[index]
      bone.position.set(...spec.pos)
      if (spec.parent >= 0) this.bones[spec.parent].add(bone)
    })
    this.mesh.add(this.bones[ROOT])
    this.mesh.updateMatrixWorld(true)
    this.mesh.bind(new THREE.Skeleton(this.bones))
    this.group.add(this.mesh)
    this.capsules = [
      { a: new THREE.Vector3(), b: new THREE.Vector3(), r: 0.128, part: 'head' },
      { a: new THREE.Vector3(), b: new THREE.Vector3(), r: 0.175, part: 'torso' },
      { a: new THREE.Vector3(), b: new THREE.Vector3(), r: 0.155, part: 'pelvis' },
      { a: new THREE.Vector3(), b: new THREE.Vector3(), r: 0.062, part: 'arm' },
      { a: new THREE.Vector3(), b: new THREE.Vector3(), r: 0.052, part: 'arm' },
      { a: new THREE.Vector3(), b: new THREE.Vector3(), r: 0.062, part: 'arm' },
      { a: new THREE.Vector3(), b: new THREE.Vector3(), r: 0.052, part: 'arm' },
      { a: new THREE.Vector3(), b: new THREE.Vector3(), r: 0.088, part: 'leg' },
      { a: new THREE.Vector3(), b: new THREE.Vector3(), r: 0.068, part: 'leg' },
      { a: new THREE.Vector3(), b: new THREE.Vector3(), r: 0.088, part: 'leg' },
      { a: new THREE.Vector3(), b: new THREE.Vector3(), r: 0.068, part: 'leg' },
    ]
    if (options.flashlight) this.addFlashlight()
    this.applyPose(1)
  }

  private addFlashlight(): void {
    const rig = new THREE.Group()
    const cone = new THREE.CylinderGeometry(0.03, 1.9, 11, 18, 1, true)
    cone.rotateX(-Math.PI / 2)
    cone.translate(0, 0, 5.5)
    const beam = new THREE.Mesh(
      cone,
      new THREE.MeshBasicMaterial({
        color: '#fff1d2',
        alphaMap: beamAlpha(),
        transparent: true,
        opacity: 0.09,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    )
    // The cone's V coordinate runs along its length; flip so it is bright at the lens.
    const uv = cone.getAttribute('uv')
    for (let i = 0; i < uv.count; i += 1) uv.setY(i, 1 - uv.getY(i))
    flareTexture ??= createSpriteTexture('flash', 64)
    const lens = new THREE.Sprite(new THREE.SpriteMaterial({ map: flareTexture, color: '#fff3d8', blending: THREE.AdditiveBlending, depthWrite: false, fog: false }))
    lens.scale.setScalar(0.7)
    rig.add(beam, lens)
    // Weapon bone local space: muzzle region along +Z, below the receiver.
    rig.position.set(0.04, 0.0, 0.42)
    this.bones[WEAPON].add(rig)
    this.flashlight = rig
  }

  setFlashlightVisible(visible: boolean): void {
    if (this.flashlight) this.flashlight.visible = visible
  }

  place(x: number, y: number, z: number, heading = this.heading): void {
    this.x = x
    this.y = y
    this.z = z
    this.heading = heading
  }

  look(yaw: number, pitch = 0): void {
    this.targetLookYaw = clamp(yaw, -1.2, 1.2)
    this.targetLookPitch = clamp(pitch, -0.6, 0.5)
  }

  /** Bearing from the actor to a world point, radians. */
  bearingTo(x: number, z: number): number {
    return Math.atan2(x - this.x, -(z - this.z))
  }

  get dying(): boolean {
    return this.deathTime >= 0
  }

  die(impulseX: number, impulseZ: number, part: HitPart, collision: CollisionWorld | null, elevated: boolean): void {
    if (!this.alive) return
    this.alive = false
    this.deathTime = 0
    this.headshot = part === 'head'
    this.speed = 0
    const length = Math.hypot(impulseX, impulseZ) || 1
    let fx = impulseX / length
    let fz = impulseZ / length
    const random = mulberry32(this.seed * 13 + 5)
    const angle = (random() - 0.5) * 1.6
    const c = Math.cos(angle)
    const s = Math.sin(angle)
    ;[fx, fz] = [fx * c - fz * s, fx * s + fz * c]
    if (this.stance === 'prone') {
      this.deathKind = 'slump'
    } else if (elevated || this.stance === 'kneel') {
      this.deathKind = 'crumple'
    } else {
      this.deathKind = 'topple'
      if (collision) {
        // Avoid falling through walls: try a few directions before crumpling in place.
        let found = false
        for (let attempt = 0; attempt < 5 && !found; attempt += 1) {
          const a = attempt === 0 ? 0 : (attempt % 2 ? 1 : -1) * Math.ceil(attempt / 2) * 0.9
          const dx = fx * Math.cos(a) - fz * Math.sin(a)
          const dz = fx * Math.sin(a) + fz * Math.cos(a)
          if (!collision.blocked(this.x, this.y + 0.5, this.z, this.x + dx * 1.9, this.y + 0.5, this.z + dz * 1.9)) {
            fx = dx
            fz = dz
            found = true
          }
        }
        if (!found) this.deathKind = 'crumple'
      }
    }
    // Convert the world fall direction into the actor's local frame.
    const yaw = Math.PI - this.heading
    const lx = fx * Math.cos(yaw) - fz * Math.sin(yaw)
    const lz = fx * Math.sin(yaw) + fz * Math.cos(yaw)
    this.deathAxis.set(lz, 0, -lx).normalize()
    this.deathSpin = (random() - 0.5) * 0.8
    this.upper = 'relaxed'
  }

  flinch(): void {
    this.flinchTime = 0.45
  }

  update(dt: number, time: number): void {
    if (this.hidden) {
      this.group.visible = false
      return
    }
    this.group.visible = true
    this.lookYaw += (this.targetLookYaw - this.lookYaw) * damp(4, dt)
    this.lookPitch += (this.targetLookPitch - this.lookPitch) * damp(4, dt)
    if (this.deathTime >= 0) this.deathTime += dt
    if (this.flinchTime > 0) this.flinchTime = Math.max(0, this.flinchTime - dt)
    const stride = this.speed > 2.4 ? 1.9 : 1.35
    this.phase += (this.speed * dt * Math.PI * 2) / stride
    this.applyPose(dt, time)
    if (Actor.thermal) {
      const heat = this.alive ? 1 : Math.max(0.22, 1 - (this.deathTime > 0 ? this.deathTime / 45 : 0))
      this.material.emissive.setRGB(heat * 0.95, heat * 0.9, heat * 0.85)
    } else if (this.material.emissive.r !== 0) {
      this.material.emissive.setRGB(0, 0, 0)
    }
  }

  private applyPose(dt: number, time = 0): void {
    const key = `${this.stance}:${this.upper}`
    if (key !== this.poseKey) {
      basePose(this.target, this.stance, this.upper, this.armed)
      if (this.poseKey === '') this.pose.set(this.target)
      this.poseKey = key
    }
    const rate = damp(this.stance === 'prone' ? 3 : 6, dt)
    for (let i = 0; i < POSE_SIZE; i += 1) this.pose[i] += (this.target[i] - this.pose[i]) * rate
    const p = this.pose
    const bones = this.bones
    const moving = clamp(this.speed / 1.4, 0, 1)
    const run = clamp((this.speed - 2) / 1.5, 0, 1)
    const amp = moving * (0.42 + run * 0.35)
    const s = Math.sin(this.phase)
    const dying = this.deathTime >= 0
    const deathT = dying ? this.deathTime : 0
    for (let bone = 1; bone < BONES.length; bone += 1) {
      let x = p[bone * 3]
      let y = p[bone * 3 + 1]
      let z = p[bone * 3 + 2]
      if (!dying && this.stance !== 'prone') {
        switch (bone) {
          case THIGH_L:
            x += -s * amp
            break
          case THIGH_R:
            x += s * amp
            break
          case SHIN_L:
            x += (0.1 + 0.75 * Math.max(0, Math.sin(this.phase + 1.4))) * amp
            break
          case SHIN_R:
            x += (0.1 + 0.75 * Math.max(0, Math.sin(this.phase + 1.4 + Math.PI))) * amp
            break
          case ARM_L:
            if (!this.armed && this.upper !== 'cower') x += s * 0.4 * amp
            break
          case ARM_R:
            if (!this.armed && this.upper !== 'cower') x += -s * 0.4 * amp
            break
          case SPINE:
            x += run * 0.22 + Math.sin(time * 1.6 + this.phase * 0.1) * 0.012
            y += s * 0.06 * amp
            break
          case CHEST:
            y += -s * 0.08 * amp + this.lookYaw * 0.3
            x += this.flinchTime > 0 ? -Math.sin((this.flinchTime / 0.45) * Math.PI) * 0.35 : 0
            x -= this.upper === 'aim' ? this.aimPitch * 0.8 : 0
            break
          case NECK:
            y += this.lookYaw * 0.7
            x += this.lookPitch * 0.8
            break
        }
      }
      if (dying) {
        // Limbs go limp as the body falls.
        const limp = clamp(deathT * 2.2, 0, 1)
        if (this.deathKind !== 'slump') {
          switch (bone) {
            case THIGH_L:
            case THIGH_R:
              x += this.deathKind === 'crumple' ? -1.3 * limp : -0.35 * limp
              break
            case SHIN_L:
            case SHIN_R:
              x += this.deathKind === 'crumple' ? 1.9 * limp : 0.5 * limp
              break
            case ARM_L:
              x = THREE.MathUtils.lerp(x, -0.6, limp)
              z = THREE.MathUtils.lerp(z, 0.9, limp)
              break
            case ARM_R:
              x = THREE.MathUtils.lerp(x, 0.4, limp)
              z = THREE.MathUtils.lerp(z, -1.1, limp)
              break
            case FORE_L:
            case FORE_R:
              x = THREE.MathUtils.lerp(x, -0.3, limp)
              break
            case SPINE:
              x += (this.deathKind === 'crumple' ? 0.6 : 0.2) * limp
              break
            case NECK:
              x += (this.headshot ? -0.5 + Math.min(1, deathT * 3) * 0.9 : 0.5) * limp
              y += this.deathSpin * limp
              break
            case WEAPON:
              x += 1.2 * limp
              break
          }
        } else if (bone === NECK) {
          x = THREE.MathUtils.lerp(x, 0.35, limp)
        } else if (bone === ARM_L || bone === ARM_R) {
          z += (bone === ARM_L ? 0.4 : -0.4) * limp
        }
      }
      bones[bone].rotation.set(x, y, z)
    }
    const bob = this.stance === 'prone' || dying ? 0 : -Math.abs(Math.cos(this.phase)) * 0.035 * amp + 0.02 * amp
    let hipsY = p[P_HIPS_Y] + bob
    if (dying && this.deathKind === 'crumple') hipsY = THREE.MathUtils.lerp(hipsY, 0.32, clamp(deathT * 2.4, 0, 1))
    bones[HIPS].position.set(0, hipsY, p[P_HIPS_Z])
    bones[WEAPON].position.set(p[P_WEAPON], p[P_WEAPON + 1], p[P_WEAPON + 2])
    // Root: prone pitch and the death fall pivot about the feet.
    _q.setFromAxisAngle(X_AXIS, p[P_ROOT_PITCH])
    let lift = p[P_ROOT_LIFT]
    if (dying && this.deathKind !== 'slump') {
      const total = this.deathKind === 'topple' ? Math.PI / 2 - 0.06 : 1.25
      const duration = this.deathKind === 'topple' ? 0.72 : 0.9
      const u = clamp(deathT / duration, 0, 1)
      // Gravity ease with a small bounce on impact.
      let angle = total * u * u
      if (u >= 1) angle = total - Math.exp(-(deathT - duration) * 9) * Math.sin((deathT - duration) * 22) * 0.06
      _q2.setFromAxisAngle(this.deathAxis, angle)
      _q.premultiply(_q2)
      lift += Math.sin(angle) * (this.deathKind === 'topple' ? 0.13 : 0.2)
    }
    bones[ROOT].quaternion.copy(_q)
    bones[ROOT].position.set(0, lift, 0)
    this.group.position.set(this.x, this.y, this.z)
    this.group.rotation.set(0, Math.PI - this.heading, 0)
    this.group.updateMatrixWorld(true)
  }

  // -------------------------------------------------------------------------
  // Spatial queries (valid after update()).

  private boneWorld(bone: number, x: number, y: number, z: number, target: THREE.Vector3): THREE.Vector3 {
    return target.set(x, y, z).applyMatrix4(this.bones[bone].matrixWorld)
  }

  headPosition(target = new THREE.Vector3()): THREE.Vector3 {
    return this.boneWorld(NECK, 0, 0.155, 0.01, target)
  }

  chestPosition(target = new THREE.Vector3()): THREE.Vector3 {
    return this.boneWorld(CHEST, 0, 0.02, 0.02, target)
  }

  /** Front of the weapon optic (sniper glint) or the muzzle for other weapons. */
  opticPosition(target = new THREE.Vector3()): THREE.Vector3 {
    return this.boneWorld(WEAPON, 0, this.kind === 'sniper' ? 0.12 : 0.05, this.kind === 'sniper' ? 0.36 : 0.45, target)
  }

  muzzlePosition(target = new THREE.Vector3()): THREE.Vector3 {
    return this.boneWorld(WEAPON, 0, 0.045, this.kind === 'sniper' ? 1.0 : this.kind === 'heavy' ? 0.9 : 0.66, target)
  }

  private updateCapsules(): void {
    const c = this.capsules
    this.boneWorld(NECK, 0, 0.155, 0.01, c[0].a)
    c[0].b.copy(c[0].a)
    this.boneWorld(CHEST, 0, 0.17, 0, c[1].a)
    this.boneWorld(SPINE, 0, -0.02, 0, c[1].b)
    this.boneWorld(SPINE, 0, -0.02, 0, c[2].a)
    this.boneWorld(HIPS, 0, -0.06, 0, c[2].b)
    this.boneWorld(ARM_L, 0, 0, 0, c[3].a)
    this.boneWorld(FORE_L, 0, 0, 0, c[3].b)
    c[4].a.copy(c[3].b)
    this.boneWorld(FORE_L, 0, -0.26, 0, c[4].b)
    this.boneWorld(ARM_R, 0, 0, 0, c[5].a)
    this.boneWorld(FORE_R, 0, 0, 0, c[5].b)
    c[6].a.copy(c[5].b)
    this.boneWorld(FORE_R, 0, -0.26, 0, c[6].b)
    this.boneWorld(THIGH_L, 0, 0, 0, c[7].a)
    this.boneWorld(SHIN_L, 0, 0, 0, c[7].b)
    c[8].a.copy(c[7].b)
    this.boneWorld(SHIN_L, 0, -0.4, 0, c[8].b)
    this.boneWorld(THIGH_R, 0, 0, 0, c[9].a)
    this.boneWorld(SHIN_R, 0, 0, 0, c[9].b)
    c[10].a.copy(c[9].b)
    this.boneWorld(SHIN_R, 0, -0.4, 0, c[10].b)
  }

  /** Ray against the body capsules. Returns the nearest part hit. */
  hitTest(ox: number, oy: number, oz: number, dx: number, dy: number, dz: number, maxT: number, inflate = 0): ActorHit | null {
    if (this.hidden) return null
    // Broad phase: ray against a bounding sphere around the hips, before any capsule work.
    this.hipsWorld.setFromMatrixPosition(this.bones[HIPS].matrixWorld)
    const cx = this.hipsWorld.x - ox
    const cy = this.hipsWorld.y - oy
    const cz = this.hipsWorld.z - oz
    const along = cx * dx + cy * dy + cz * dz
    if (along < -1.3 || along > maxT + 1.3) return null
    const d2 = cx * cx + cy * cy + cz * cz - along * along
    if (d2 > (1.25 + inflate) * (1.25 + inflate)) return null
    this.updateCapsules()
    let best: ActorHit | null = null
    for (const capsule of this.capsules) {
      const hit = intersectCapsule(ox, oy, oz, dx, dy, dz, maxT, capsule.a.x, capsule.a.y, capsule.a.z, capsule.b.x, capsule.b.y, capsule.b.z, capsule.r + inflate)
      if (!hit) continue
      // Heads win ties so grazing headshots are not stolen by the shoulders.
      const t = capsule.part === 'head' ? hit.t - 0.04 : hit.t
      if (!best || t < best.t) best = { t, part: capsule.part }
    }
    if (best) best.t = Math.max(0, best.t)
    return best
  }

  /** Closest distance between a segment and the head, for near-miss checks. */
  headDistanceToSegment(ax: number, ay: number, az: number, bx: number, by: number, bz: number): number {
    this.headPosition(_a)
    _b.set(bx - ax, by - ay, bz - az)
    const length2 = _b.lengthSq()
    const t = length2 > 0 ? clamp(((_a.x - ax) * _b.x + (_a.y - ay) * _b.y + (_a.z - az) * _b.z) / length2, 0, 1) : 0
    return Math.hypot(ax + _b.x * t - _a.x, ay + _b.y * t - _a.y, az + _b.z * t - _a.z)
  }

  /** Is the actor visibly moving right now (for moving-target bonuses)? */
  get moving(): boolean {
    return this.speed > 0.6
  }

  dispose(): void {
    this.mesh.geometry.dispose()
    this.material.dispose()
    this.mesh.skeleton.dispose()
    this.group.removeFromParent()
    if (this.flashlight) {
      this.flashlight.traverse((object) => {
        const mesh = object as THREE.Mesh
        if (mesh.geometry) mesh.geometry.dispose()
      })
    }
  }
}

/** Smooth heading helper: turns `current` toward `target` at `rate` rad/s. */
export function turnToward(current: number, target: number, rate: number, dt: number): number {
  let delta = ((target - current + Math.PI * 3) % (Math.PI * 2)) - Math.PI
  const step = rate * dt
  if (delta > step) delta = step
  else if (delta < -step) delta = -step
  return current + delta
}

