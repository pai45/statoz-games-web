import assert from 'node:assert/strict'
import test from 'node:test'

import { holdover, simulateToDistance, solveZeroAngle } from '../../src/game/ballistics.ts'
import { CollisionWorld, box, cylinder, intersectCapsule } from '../../src/game/collision.ts'
import { DUEL_ARENAS, MISSIONS, RIFLES, isRequiredSpawn } from '../../src/game/data.ts'
import { NEST, ZONES } from '../../src/game/layout.ts'
import {
  applyDuelResult,
  applyMissionResult,
  createProfile,
  duelMatchOver,
  duelTuning,
  duelWinner,
  emptyMissionStats,
  evaluateMission,
  isMissionUnlocked,
  levelInfo,
  sanitizeProfile,
  scoreKill,
  totalXpForLevel,
  unlocksBetween,
  winsNeeded,
  xpForLevel,
} from '../../src/game/progression.ts'
import { EYE_Y, NEST_GROUND, raycastTerrain, terrainHeight } from '../../src/game/terrain.ts'

const ranger = RIFLES[0]

test('zeroing puts the round on the line of sight at the zero distance', () => {
  for (const zero of [100, 300, 600]) {
    const angle = solveZeroAngle(ranger, zero)
    const shot = simulateToDistance(ranger, angle, zero)
    assert.ok(Math.abs(shot.y) < 0.002, `zero ${zero} m is off by ${shot.y}`)
  }
})

test('holdover is positive past the zero and negative inside it', () => {
  const angle = solveZeroAngle(ranger, 300)
  assert.ok(holdover(ranger, angle, 600, 0).elevation > 2)
  assert.ok(holdover(ranger, angle, 150, 0).elevation < 0)
})

test('crosswind drifts the round downwind and drift grows with range', () => {
  const angle = solveZeroAngle(ranger, 300)
  const near = holdover(ranger, angle, 300, 5)
  const far = holdover(ranger, angle, 700, 5)
  assert.ok(near.windage > 0)
  assert.ok(far.windage > near.windage)
  assert.ok(holdover(ranger, angle, 300, -5).windage < 0)
})

test('heavier rifles retain more velocity downrange', () => {
  const anvil = RIFLES.find((rifle) => rifle.id === 'anvil')
  const rangerShot = simulateToDistance(ranger, 0, 800)
  const anvilShot = simulateToDistance(anvil, 0, 800)
  assert.ok(anvilShot.velocity > rangerShot.velocity)
  assert.ok(anvilShot.time < rangerShot.time)
})

const eye = { x: NEST.x, y: EYE_Y, z: NEST.z }

function assertVisible(label, x, y, z) {
  const dx = x - eye.x
  const dy = y - eye.y
  const dz = z - eye.z
  const distance = Math.hypot(dx, dy, dz)
  const hit = raycastTerrain(eye.x, eye.y, eye.z, dx / distance, dy / distance, dz / distance, distance - 2, 1.5)
  assert.equal(hit, -1, `${label} is hidden by terrain at ${hit.toFixed?.(1)} m`)
  const yaw = (Math.atan2(dx, -dz) * 180) / Math.PI
  const pitch = (Math.atan2(dy, Math.hypot(dx, dz)) * 180) / Math.PI
  assert.ok(Math.abs(yaw) < 38, `${label} yaw ${yaw.toFixed(1)} is outside the window`)
  assert.ok(pitch > -11 && pitch < 7, `${label} pitch ${pitch.toFixed(1)} is outside the window`)
}

test('the nest sits on a flat pad high above the valley', () => {
  assert.ok(Math.abs(terrainHeight(NEST.x, NEST.z) - NEST_GROUND) < 0.01)
  assert.ok(Math.abs(terrainHeight(NEST.x + 5, NEST.z - 4) - NEST_GROUND) < 0.01)
  assert.ok(EYE_Y - terrainHeight(ZONES.village.center[0], ZONES.village.center[1]) > 25)
})

test('zones are flattened to their pad heights', () => {
  for (const zone of Object.values(ZONES)) {
    const [x, z] = zone.center
    assert.ok(Math.abs(terrainHeight(x, z) - zone.height) < 0.1, `${zone.id} is not flat`)
  }
})

test('every mission spawn is visible from the nest', () => {
  for (const mission of MISSIONS) {
    assert.ok(mission.spawns.some(isRequiredSpawn), `${mission.id} has no required targets`)
    for (const spawn of mission.spawns) {
      const [x, z] = spawn.pos
      const ground = terrainHeight(x, z)
      const feet = spawn.y ?? ground
      assert.ok(feet >= ground - 0.05, `${mission.id} spawn below terrain`)
      assertVisible(`${mission.id} ${spawn.kind} at ${x},${z}`, x, feet + 1.5, z)
    }
  }
})

test('every duel nest is visible from the nest', () => {
  for (const arena of DUEL_ARENAS) {
    for (const nest of arena.nests) {
      const [x, y, z] = nest.pos
      const feet = y ?? terrainHeight(x, z)
      assertVisible(`${arena.id} nest ${x},${z}`, x, feet + 0.5, z)
    }
  }
})

test('rotated boxes and cylinders report entry distance and outward normals', () => {
  const world = new CollisionWorld()
  world.add(box(0, 1, -10, 2, 2, 2, 'concrete', Math.PI / 4), 'a')
  world.add(cylinder(5, -20, 0, 6, 1, 'metal'), 'b')
  const hit = world.raycast(0, 1, 0, 0, 0, -1, 100)
  assert.ok(hit)
  assert.ok(Math.abs(hit.t - (10 - Math.SQRT2)) < 1e-6)
  assert.ok(hit.nz > 0.6)
  const tank = world.raycast(5, 3, 0, 0, 0, -1, 100)
  assert.ok(tank && Math.abs(tank.t - 19) < 1e-6 && tank.surface === 'metal')
  assert.equal(world.raycast(20, 1, 0, 0, 0, -1, 100), null)
  assert.ok(world.blocked(0, 1, 0, 0, 1, -20))
})

test('capsule intersection finds a passing ray and rejects a miss', () => {
  const hit = intersectCapsule(0, 1.2, 0, 0, 0, -1, 50, 0.05, 0.9, -30, 0.05, 1.5, -30, 0.2)
  assert.ok(hit && Math.abs(hit.t - 29.8) < 0.05)
  assert.equal(intersectCapsule(0, 1.2, 0, 0, 0, -1, 50, 1, 0.9, -30, 1, 1.5, -30, 0.2), null)
  // A zero-length capsule is a sphere (the head hitbox) and must still register long-range hits.
  const head = intersectCapsule(0, 29, 0, 0, -0.1, -0.995, 400, 0, 29 - 0.1 * 180, -0.995 * 180, 0, 29 - 0.1 * 180, -0.995 * 180, 0.12)
  assert.ok(head && Math.abs(head.t - 180) < 0.2)
})

test('level curve starts at 500 XP and grows by 250 per level', () => {
  assert.equal(xpForLevel(1), 500)
  assert.equal(xpForLevel(2), 750)
  assert.equal(levelInfo(0).level, 1)
  assert.equal(levelInfo(499).level, 1)
  assert.equal(levelInfo(500).level, 2)
  assert.equal(levelInfo(totalXpForLevel(5)).level, 5)
  assert.ok(levelInfo(totalXpForLevel(20) + 10_000).maxed)
})

test('profiles survive corrupt storage and clamp bad values', () => {
  assert.equal(sanitizeProfile('nope').xp, 0)
  const profile = sanitizeProfile({
    version: 1,
    callsign: '<script>Hawk</script>',
    xp: -40,
    loadout: { rifle: 'laser', camo: 'woodland', reticle: 'duplex' },
    settings: { sensitivity: 99, scopeMode: 'toggle', fov: 'wide' },
    missions: { op01: { completed: true, stars: 7, bestScore: 1200.6, attempts: 2 }, bogus: { completed: true } },
  })
  assert.equal(profile.callsign, 'scriptHawkscript')
  assert.equal(profile.xp, 0)
  assert.equal(profile.loadout.rifle, 'ranger')
  assert.equal(profile.loadout.camo, 'woodland')
  assert.equal(profile.settings.sensitivity, 3)
  assert.equal(profile.settings.scopeMode, 'toggle')
  assert.equal(profile.settings.fov, 70)
  assert.equal(profile.missions.op01.stars, 3)
  assert.equal(profile.missions.bogus, undefined)
})

test('kill scoring layers headshot, moving, range, and follow-up bonuses', () => {
  const lines = scoreKill({ kind: 'hostile', headshot: true, moving: true, distance: 620, sincePrevious: 2, undetected: false })
  const total = lines.reduce((sum, line) => sum + line.points, 0)
  assert.equal(total, 100 + 150 + 75 + 160 + 100)
  assert.equal(scoreKill({ kind: 'civilian', headshot: true, moving: false, distance: 300, sincePrevious: 9, undetected: true }).length, 1)
})

test('mission evaluation awards stars, XP, unlocks, and the next mission', () => {
  const mission = MISSIONS[0]
  const stats = { ...emptyMissionStats(), kills: 3, headshots: 2, shots: 3, hits: 3, killPoints: 750, elapsed: 70, longestKill: 196 }
  const evaluation = evaluateMission(mission, stats, true, true, true)
  assert.equal(evaluation.stars, 3)
  assert.ok(evaluation.xp >= mission.xp)
  const profile = createProfile(0)
  assert.equal(isMissionUnlocked(profile, 1), false)
  const result = applyMissionResult(profile, mission, evaluation, stats)
  assert.equal(isMissionUnlocked(result.profile, 1), true)
  assert.equal(result.profile.missions.op01.stars, 3)
  assert.equal(result.profile.stats.missionsCompleted, 1)
  assert.ok(result.levelAfter >= 2)
  assert.ok(result.unlocks.some((item) => item.id === 'desert'))
  const failed = evaluateMission(mission, { ...stats, civiliansHit: 1 }, false, true, true)
  assert.equal(failed.stars, 0)
  assert.ok(failed.bonuses.every((bonus) => !bonus.met))
  assert.deepEqual(unlocksBetween(1, 1), [])
})

test('duel rules end matches at the win target and track streaks', () => {
  assert.equal(winsNeeded(5), 3)
  assert.equal(duelMatchOver({ player: 2, enemy: 2, draws: 0 }, 5), false)
  assert.equal(duelMatchOver({ player: 3, enemy: 1, draws: 0 }, 5), true)
  assert.equal(duelMatchOver({ player: 1, enemy: 1, draws: 5 }, 5), true)
  assert.equal(duelWinner({ player: 1, enemy: 1, draws: 5 }), 'draw')
  assert.ok(duelTuning('elite', 1).lockTime < duelTuning('recruit', 1).lockTime)
  assert.ok(duelTuning('veteran', 12).lockTime < duelTuning('veteran', 1).lockTime)
  const summary = { winner: 'player', score: { player: 3, enemy: 1, draws: 0 }, kills: 3, headshots: 1, shots: 6, hits: 3, longest: 320, difficulty: 'veteran', elapsed: 200 }
  const result = applyDuelResult(createProfile(0), summary)
  assert.equal(result.profile.stats.duelWins, 1)
  assert.equal(result.profile.stats.duelStreak, 1)
  assert.ok(result.xpGained > 400)
})
