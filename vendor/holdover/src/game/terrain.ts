// Analytic terrain shared by the rendered mesh, bullets, actors, and tests.
import { NEST, ROADS, ZONES, type ZoneSpec } from './layout.ts'
import { clamp, fbm2, lerp, smoothstep, valueNoise2 } from './noise.ts'

export const NEST_GROUND = 25
export const NEST_FLOOR = NEST_GROUND + NEST.floorAboveGround
export const EYE_Y = NEST_FLOOR + NEST.eyeHeight
export const COVER_EYE_Y = NEST_FLOOR + NEST.coverEyeHeight

interface RoadSegment {
  ax: number
  az: number
  dx: number
  dz: number
  len2: number
  half: number
}

const FLAT_SEGMENTS: RoadSegment[] = ROADS.filter((road) => road.flatten).flatMap((road) =>
  road.points.slice(1).map((point, index) => {
    const [ax, az] = road.points[index]
    const dx = point[0] - ax
    const dz = point[1] - az
    return { ax, az, dx, dz, len2: dx * dx + dz * dz, half: road.width / 2 }
  }),
)

const ZONE_LIST: ZoneSpec[] = Object.values(ZONES)

function ridged(x: number, z: number, seed: number): number {
  let sum = 0
  let amplitude = 0.55
  let frequency = 1
  for (let octave = 0; octave < 4; octave += 1) {
    const n = 1 - Math.abs(valueNoise2(x * frequency, z * frequency, seed + octave * 13))
    sum += n * n * amplitude
    amplitude *= 0.5
    frequency *= 2.1
  }
  return sum
}

/** Large landforms only. Roads use this as a smooth road bed. */
export function macroHeight(x: number, z: number): number {
  const valley = fbm2(x / 280, z / 280, 3, 11) * 3.6
  const crestNoise = fbm2(x / 90, 3.7, 2, 5) * 3 * smoothstep(14, 70, Math.abs(x))
  const ridge = smoothstep(-40, 26, z) * (NEST_GROUND + crestNoise)
  const behind = smoothstep(30, 170, z) * 34
  const north = smoothstep(-500, -690, z) * 17
  const east = smoothstep(285, 660, x) * (86 + fbm2(x / 300, z / 300, 3, 31) * 46)
  const west = smoothstep(-305, -680, x) * (98 + fbm2(x / 300, z / 300, 3, 37) * 52)
  const far = smoothstep(-860, -1750, z) * (190 + ridged(x / 760, z / 760, 41) * 330)
  const farSides = smoothstep(950, 2300, Math.abs(x)) * (120 + ridged(x / 600, z / 600, 53) * 160)
  return valley + ridge + behind + north + east + west + far + farSides
}

function detail(x: number, z: number): number {
  return fbm2(x / 55, z / 55, 3, 23) * 1.1 + valueNoise2(x / 13, z / 13, 29) * 0.22
}

function flatRoadWeight(x: number, z: number): number {
  let weight = 0
  for (const segment of FLAT_SEGMENTS) {
    const px = x - segment.ax
    const pz = z - segment.az
    const t = clamp((px * segment.dx + pz * segment.dz) / segment.len2, 0, 1)
    const ex = px - segment.dx * t
    const ez = pz - segment.dz * t
    const distance = Math.sqrt(ex * ex + ez * ez)
    if (distance < segment.half + 7) {
      weight = Math.max(weight, 1 - smoothstep(segment.half + 0.8, segment.half + 7, distance))
    }
  }
  return weight
}

export function terrainHeight(x: number, z: number): number {
  const macro = macroHeight(x, z)
  let height = macro + detail(x, z) * (1 + clamp(macro / 28, 0, 7))

  if (x > -900 && x < 1600 && z > -760 && z < 60) {
    const road = flatRoadWeight(x, z)
    if (road > 0) height = lerp(height, macro, road)
  }

  for (const zone of ZONE_LIST) {
    const dx = x - zone.center[0]
    const dz = z - zone.center[1]
    const reach = zone.radius * 1.4
    if (Math.abs(dx) > reach || Math.abs(dz) > reach) continue
    const distance = Math.sqrt(dx * dx + dz * dz)
    if (distance >= reach) continue
    const weight = 1 - smoothstep(zone.radius, reach, distance)
    const pad = zone.height + valueNoise2(x / 9, z / 9, 61) * 0.05
    height = lerp(height, pad, weight)
  }

  const nestDistance = Math.hypot(x - NEST.x, z - NEST.z)
  if (nestDistance < 22) {
    height = lerp(height, NEST_GROUND, 1 - smoothstep(9, 22, nestDistance))
  }
  return height
}

/** Surface normal from central differences. */
export function terrainNormal(x: number, z: number, step = 1.5): [number, number, number] {
  const hx = terrainHeight(x + step, z) - terrainHeight(x - step, z)
  const hz = terrainHeight(x, z + step) - terrainHeight(x, z - step)
  const nx = -hx
  const ny = 2 * step
  const nz = -hz
  const length = Math.hypot(nx, ny, nz)
  return [nx / length, ny / length, nz / length]
}

/**
 * Marches a ray against the terrain. Returns the distance along the
 * normalized direction or -1 when nothing is hit within `maxDistance`.
 */
export function raycastTerrain(
  ox: number,
  oy: number,
  oz: number,
  dx: number,
  dy: number,
  dz: number,
  maxDistance: number,
  step = 3,
): number {
  let previous = 0
  let previousGap = oy - terrainHeight(ox, oz)
  if (previousGap < 0) return 0
  for (let t = step; t <= maxDistance + step; t += step) {
    const distance = Math.min(t, maxDistance)
    const x = ox + dx * distance
    const y = oy + dy * distance
    const z = oz + dz * distance
    const gap = y - terrainHeight(x, z)
    if (gap < 0) {
      let low = previous
      let high = distance
      for (let iteration = 0; iteration < 12; iteration += 1) {
        const mid = (low + high) / 2
        const midGap = oy + dy * mid - terrainHeight(ox + dx * mid, oz + dz * mid)
        if (midGap < 0) high = mid
        else low = mid
      }
      return (low + high) / 2
    }
    previous = distance
    previousGap = gap
    if (distance >= maxDistance) break
    // Take longer strides when far above the ground.
    if (previousGap > 40) t += step * 3
  }
  return -1
}
