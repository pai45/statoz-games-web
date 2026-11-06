/**
 * Analytic inverse kinematics for the athlete rig.
 *
 * Limbs rest along -Y in their parent frame and use Euler XYZ with zero twist, so a limb's rotation is
 * R = Rx(flex) * Rz(abd) and its middle joint (knee / elbow) bends about its local X axis.
 */

export interface TwoBone {
  /** rotation about X of the upper bone */
  flex: number
  /** rotation about Z of the upper bone (signed, already includes the side) */
  abd: number
  /** middle-joint rotation about X (knee > 0 bends back, elbow < 0 bends forward) */
  mid: number
  /** true when the target was out of reach and the chain was straightened */
  clamped: boolean
}

const wrap = (a: number) => Math.atan2(Math.sin(a), Math.cos(a))

/**
 * Solves upper/lower bone angles so the chain tip reaches v (relative to the root joint, parent frame).
 * `bend` +1 for knees, -1 for elbows. `soft` (a fraction of the reach) eases the last stretch toward full
 * extension instead of snapping the joint straight; use it only where the tip may fall a little short
 * (a swinging foot, never a planted one).
 */
export function solveTwoBone(vx: number, vy: number, vz: number, L1: number, L2: number, bend: 1 | -1, out: TwoBone, soft = 0): TwoBone {
  let D = Math.hypot(vx, vy, vz)
  const minD = Math.abs(L1 - L2) + 1e-4
  const maxD = (L1 + L2) * 0.9993
  if (D < 1e-6) {
    vx = 0
    vy = -1
    vz = 0
    D = 1
  }
  let Dc = Math.min(maxD, Math.max(minD, D))
  if (soft > 0) {
    const ds = maxD * (1 - soft)
    if (D > ds) Dc = ds + (maxD - ds) * (1 - Math.exp(-(D - ds) / (maxD - ds)))
  }
  out.clamped = D > maxD
  const s = Dc / D
  vx *= s
  vy *= s
  vz *= s
  const cosI = (L1 * L1 + L2 * L2 - Dc * Dc) / (2 * L1 * L2)
  const interior = Math.acos(Math.max(-1, Math.min(1, cosI)))
  const mid = (Math.PI - interior) * bend
  // tip of the chain in the upper bone's frame
  const wy = -L1 - L2 * Math.cos(mid)
  const wz = -L2 * Math.sin(mid)
  const abd = Math.asin(Math.max(-1, Math.min(1, -vx / wy)))
  out.flex = wrap(Math.atan2(vz, vy) - Math.atan2(wz, wy * Math.cos(abd)))
  out.abd = abd
  out.mid = mid
  return out
}
