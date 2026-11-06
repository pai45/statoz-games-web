import assert from 'node:assert/strict'
import test from 'node:test'

import { BALLISTIC_STEP, holdover, solveZeroAngle, stepBullet } from '../../src/game/ballistics.ts'
import { DUEL_ARENAS, MISSIONS, RIFLES } from '../../src/game/data.ts'
import { NEST } from '../../src/game/layout.ts'
import { EYE_Y, terrainHeight } from '../../src/game/terrain.ts'
import { blockedSightlines, buildStaticWorld, poseHead } from '../../src/game/worldgen.ts'

const world = buildStaticWorld()

function nestTarget(nest, label) {
  const feet = nest.pos[1] ?? terrainHeight(nest.pos[0], nest.pos[2])
  return { x: nest.pos[0], y: feet + poseHead(nest), z: nest.pos[2], margin: 0, body: 0, label }
}

test('every stationary mission target has a clear line of sight past structures', () => {
  const targets = []
  for (const mission of MISSIONS) {
    for (const spawn of mission.spawns) {
      if (spawn.behavior.type !== 'idle') continue
      const [x, z] = spawn.pos
      const feet = spawn.y ?? terrainHeight(x, z)
      targets.push({ x, y: feet + 1.62, z, margin: 0, body: 0, label: `${mission.id} ${spawn.kind} at ${x},${z}` })
    }
  }
  assert.ok(targets.length > 20)
  assert.deepEqual(blockedSightlines(world.collision, targets), [])
})

test('every duel and counter-sniper nest exposes the marksman to the player', () => {
  const targets = []
  for (const arena of DUEL_ARENAS) for (const nest of arena.nests) targets.push(nestTarget(nest, `${arena.id} ${nest.pos[0]},${nest.pos[2]}`))
  for (const mission of MISSIONS) {
    for (const spawn of mission.spawns) {
      if (spawn.behavior.type === 'sniper') for (const nest of spawn.behavior.nests) targets.push(nestTarget(nest, `${mission.id} nest ${nest.pos[0]}`))
    }
  }
  assert.deepEqual(blockedSightlines(world.collision, targets), [])
})

test('the overwatch window is open while the walls around it block fire', () => {
  const eye = { x: NEST.x, y: EYE_Y, z: NEST.z }
  // Straight out of the opening is clear for the first 30 m.
  assert.equal(world.collision.raycast(eye.x, eye.y, eye.z, 0, -0.05, -1, 30), null)
  // A round arriving at head height beside the opening hits the wall.
  assert.ok(world.collision.blocked(2.6, eye.y, NEST.z - 6, 2.6, eye.y, NEST.z))
})

test('ballistic assist matches the simulated round within a tenth of a milliradian', () => {
  for (const rifle of [RIFLES[0], RIFLES[2]]) {
    const zero = 300
    const angle = solveZeroAngle(rifle, zero)
    // Fire downhill toward a target 520 m out and 30 m below, as from the nest.
    const distance = 520
    const drop = 30
    const horizontal = Math.sqrt(distance * distance - drop * drop)
    const pitch = -Math.asin(drop / distance)
    const forward = [0, Math.sin(pitch), -Math.cos(pitch)]
    const up = [0, Math.cos(pitch), Math.sin(pitch)]
    const dir = forward.map((f, i) => f * Math.cos(angle) + up[i] * Math.sin(angle))
    const state = { px: 0, py: 0, pz: 0, vx: dir[0] * rifle.muzzleVelocity, vy: dir[1] * rifle.muzzleVelocity, vz: dir[2] * rifle.muzzleVelocity }
    const wind = { x: 3, y: 0, z: 0 }
    let previous = { ...state }
    while (-state.pz < horizontal) {
      previous = { ...state }
      stepBullet(state, wind, rifle.drag, BALLISTIC_STEP)
    }
    const f = (horizontal + previous.pz) / (previous.pz - state.pz)
    const y = previous.py + (state.py - previous.py) * f
    const x = previous.px + (state.px - previous.px) * f
    // Offsets from the line of sight, in milliradians.
    const vertical = ((y - -drop) * Math.cos(pitch) / distance) * 1000
    const lateral = (x / distance) * 1000
    const predicted = holdover(rifle, angle, distance, 3)
    assert.ok(Math.abs(-vertical - predicted.elevation) < 0.1, `${rifle.id} elevation ${-vertical} vs ${predicted.elevation}`)
    assert.ok(Math.abs(lateral - predicted.windage) < 0.1, `${rifle.id} windage ${lateral} vs ${predicted.windage}`)
  }
})
