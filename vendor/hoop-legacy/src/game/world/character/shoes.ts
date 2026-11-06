import { Op, Sdf, surfaceNets, type MeshData } from './sdf'

/** Sole bottom in the foot-bone frame (the ankle sits 0.039 above the floor in the rest pose). */
export const SOLE_Y = -0.039

/**
 * Left basketball shoe in the foot-bone frame (normalized units): +Z toe, +X lateral, +Y up.
 * Mid-top silhouette with a cupsoled heel, toe box, padded collar and tongue.
 */
export function shoeSdf(): Sdf {
  const s = new Sdf()
  // midsole/outsole slab, flared a little past the upper like a basketball cupsole
  s.ellipsoid([0, -0.03, -0.006], [0.0226, 0.0105, 0.0318], { k: 0 })
  s.ellipsoid([0.0025, -0.0315, 0.05], [0.0274, 0.0088, 0.05], { k: 0.012 })
  s.ellipsoid([0.003, -0.0322, 0.098], [0.0268, 0.0084, 0.0405], { k: 0.012 })
  // upper: heel, midfoot, toe box
  s.ellipsoid([0, -0.016, -0.011], [0.0192, 0.023, 0.0255], { k: 0.012 })
  s.ellipsoid([0.001, -0.019, 0.038], [0.0232, 0.0205, 0.048], { k: 0.016 })
  s.ellipsoid([0.003, -0.0255, 0.094], [0.0238, 0.0128, 0.04], { k: 0.014 })
  // collar padding around the ankle, tongue
  s.roundCone([0, -0.012, -0.012], [0, 0.011, -0.009], 0.0222, 0.0205, { k: 0.012 })
  s.ellipsoid([0, 0.0015, 0.016], [0.0135, 0.021, 0.0105], { k: 0.01 })
  // heel pull tab
  s.box([0, 0.0085, -0.0305], [0.0062, 0.0085, 0.0042], { round: 0.0028, k: 0.004 })
  // flat floor contact
  s.box([0, SOLE_Y + 0.1, 0.05], [0.06, 0.1, 0.12], { k: 0.003, op: Op.Intersect })
  return s.build(0.01)
}

const shoeCache: (MeshData | undefined)[] = []

export function shoeMesh(lod = 0): MeshData {
  const hit = shoeCache[lod]
  if (hit) return hit
  const sdf = shoeSdf()
  const b = sdf.bounds()
  const h = lod ? 0.0046 : 0.0033
  const pad = h * 2
  const m = surfaceNets(sdf, [b.min[0] - pad, Math.max(SOLE_Y - pad, b.min[1] - pad), b.min[2] - pad], [b.max[0] + pad, b.max[1] + pad, b.max[2] + pad], h)
  shoeCache[lod] = m
  return m
}
