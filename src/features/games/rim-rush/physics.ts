// Ball physics in the court's vertical plane. Pure functions over plain objects; no DOM, no randomness.
import {BALL_R, BOARD_BOTTOM, BOARD_TOP, BOARD_X, GRAVITY, HOOP_X, POLE_TOP, POLE_X, RIM_TUBE, RIM_Y, WALL_X} from './levels';

export type Vec = {x: number; y: number};
export type Body = {x: number; y: number; vx: number; vy: number};
export type Contact = 'floor' | 'wall' | 'rim' | 'board' | 'pole' | 'body' | 'ball';

const FLOOR_E = 0.74, WALL_E = 0.6, RIM_E = 0.5, BOARD_E = 0.62, POLE_E = 0.4, BODY_E = 0.45, BALL_E = 0.8;
/** The side a hoop is on: -1 for the left hoop, 1 for the right. */
export type HoopSide = -1 | 1;
export const hoopX = (side: HoopSide) => side * HOOP_X;

/** Pushes a ball out of a circle of radius `r` around `c` and reflects its normal velocity. Returns the impact speed, or 0. */
export function bounceCircle(b: Body, c: Vec, r: number, e: number, friction = 0.06) {
  const dx = b.x - c.x, dy = b.y - c.y, reach = r + BALL_R, d2 = dx * dx + dy * dy;
  if (d2 >= reach * reach) return 0;
  const d = Math.sqrt(d2) || 1e-6, nx = d2 ? dx / d : 0, ny = d2 ? dy / d : 1;
  b.x = c.x + nx * reach; b.y = c.y + ny * reach;
  const vn = b.vx * nx + b.vy * ny;
  if (vn >= 0) return 0;
  const tx = b.vx - vn * nx, ty = b.vy - vn * ny;
  b.vx = tx * (1 - friction) - e * vn * nx; b.vy = ty * (1 - friction) - e * vn * ny;
  return -vn;
}

/** Collides with a vertical segment at `x` from `y0` to `y1`, thickened by `r`. */
export function bounceSegment(b: Body, x: number, y0: number, y1: number, r: number, e: number) {
  return bounceCircle(b, {x, y: Math.max(y0, Math.min(y1, b.y))}, r, e, 0.1);
}

export type Hoop = {side: HoopSide; rimR: number};
export type StepContacts = {contacts: {kind: Contact; speed: number; side?: HoopSide}[]};

/** Rim, backboard and stanchion of one hoop. */
function collideHoop(b: Body, hoop: Hoop, out: StepContacts['contacts']) {
  const cx = hoopX(hoop.side);
  for (const rx of [cx - hoop.rimR, cx + hoop.rimR]) {
    const speed = bounceCircle(b, {x: rx, y: RIM_Y}, RIM_TUBE, RIM_E, 0.12);
    if (speed > 0.15) out.push({kind: 'rim', speed, side: hoop.side});
  }
  const board = bounceSegment(b, hoop.side * BOARD_X, BOARD_BOTTOM, BOARD_TOP, 0.03, BOARD_E);
  if (board > 0.15) out.push({kind: 'board', speed: board, side: hoop.side});
  const pole = bounceSegment(b, hoop.side * POLE_X, 0, POLE_TOP, 0.09, POLE_E);
  if (pole > 0.15) out.push({kind: 'pole', speed: pole, side: hoop.side});
  // The net slows a ball passing through and nudges it to the middle.
  if (Math.abs(b.x - cx) < hoop.rimR && b.y < RIM_Y && b.y > RIM_Y - 0.45) {
    b.vx = b.vx * 0.97 + (cx - b.x) * 0.02; b.vy *= 0.992;
  }
}

/** Advances one ball by `dt` with gravity and the court. Collisions are reported in `out`. */
export function integrate(b: Body, dt: number, hoops: Hoop[], out: StepContacts['contacts']) {
  b.vy -= GRAVITY * dt;
  b.x += b.vx * dt; b.y += b.vy * dt;
  if (b.y < BALL_R) {
    b.y = BALL_R;
    if (b.vy < 0) {
      const speed = -b.vy;
      b.vy = speed * FLOOR_E; b.vx *= 0.92;
      if (b.vy < 0.35) b.vy = 0;
      if (speed > 0.6) out.push({kind: 'floor', speed});
    }
  }
  if (b.y <= BALL_R + 1e-4 && b.vy === 0) b.vx *= 1 - 2.2 * dt;
  for (const side of [-1, 1] as const) {
    if (side * b.x > WALL_X - BALL_R) {
      b.x = side * (WALL_X - BALL_R);
      if (side * b.vx > 0) {const speed = Math.abs(b.vx); b.vx = -b.vx * WALL_E; if (speed > 0.4) out.push({kind: 'wall', speed, side});}
    }
  }
  for (const hoop of hoops) collideHoop(b, hoop, out);
}

/** Collides two free balls; returns the impact speed. */
export function bounceBalls(a: Body, b: Body) {
  const dx = b.x - a.x, dy = b.y - a.y, reach = BALL_R * 2, d2 = dx * dx + dy * dy;
  if (d2 >= reach * reach || d2 === 0) return 0;
  const d = Math.sqrt(d2), nx = dx / d, ny = dy / d, push = (reach - d) / 2;
  a.x -= nx * push; a.y -= ny * push; b.x += nx * push; b.y += ny * push;
  const vn = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
  if (vn >= 0) return 0;
  const j = -(1 + BALL_E) * vn / 2;
  a.vx -= j * nx; a.vy -= j * ny; b.vx += j * nx; b.vy += j * ny;
  return -vn;
}

export {BODY_E};

/** Where a ballistic ball launched from `p` with velocity `v` is after `t` seconds, ignoring collisions. */
export const ballistic = (p: Vec, v: Vec, t: number): Vec => ({x: p.x + v.x * t, y: p.y + v.y * t - GRAVITY * t * t / 2});

/** Launch speed that carries a ball from `from` through `to` at elevation `angle` (radians), or null if impossible. */
export function speedFor(from: Vec, to: Vec, angle: number) {
  const dx = Math.abs(to.x - from.x), dy = to.y - from.y, c = Math.cos(angle);
  const denom = 2 * c * c * (dx * Math.tan(angle) - dy);
  if (denom <= 0) return null;
  return Math.sqrt(GRAVITY * dx * dx / denom);
}
