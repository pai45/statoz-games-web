// Rival brain. Runs inside the simulation step and uses only the game's seeded randomness.
import {BODY_REACH, GRAVITY, JUMP_SPEED, MAX_SPEED, MIN_SPEED, RIM_Y} from './levels';
import {atSpot, facing, gauss, live, queueJump, queueShot, random, releasePoint, rivalOf, STEP, targetHoop, type Game, type Side} from './engine';
import {hoopX, speedFor} from './physics';

export type AiState = {planned: boolean; wait: number; jumpShot: boolean; rising: boolean; blockFlight: number; jumpAt: number};
export const newAiState = (): AiState => ({planned: false, wait: 0, jumpShot: false, rising: false, blockFlight: 0, jumpAt: -1});

const DEG = Math.PI / 180;
const JUMP_HEIGHT = (JUMP_SPEED * JUMP_SPEED) / (2 * GRAVITY);

/** The shot a rival would take right now, with its personal error applied. */
export function aiShot(g: Game, side: Side) {
  const r = rivalOf(g, side)!, from = releasePoint(g, side), target = targetHoop(side);
  const other = g.players[side === 0 ? 1 : 0];
  // Loft it more when the defender is close and between shooter and hoop.
  const gap = (other.x - from.x) * facing(side);
  let arc = r.arc + gauss(g) * 1.5 + (gap > 0 && gap < 2.2 ? 4 : 0);
  arc = Math.max(40, Math.min(72, arc));
  const speed = speedFor(from, {x: hoopX(target), y: RIM_Y}, arc * DEG) ?? MIN_SPEED + 4;
  const angle = (arc + gauss(g) * r.aimNoise) * DEG;
  const actual = speed * (1 + gauss(g) * r.powerNoise);
  return {angle, power: (actual - MIN_SPEED) / (MAX_SPEED - MIN_SPEED)};
}

export function aiThink(g: Game, side: Side) {
  const r = rivalOf(g, side), p = g.players[side], ai = p.ai;
  if (!r || !ai) return;
  const mine = g.balls[side];

  // Shooting.
  if (live(g) && mine.state === 'held' && atSpot(p, side) && p.frozen <= 0) {
    if (!ai.planned) {
      ai.planned = true; ai.rising = false;
      ai.wait = r.think[0] + random(g) * (r.think[1] - r.think[0]);
      ai.jumpShot = random(g) < r.jumpShot;
    }
    ai.wait -= STEP;
    if (ai.wait <= 0) {
      if (ai.jumpShot && !ai.rising && !p.airborne) {
        if (queueJump(g, side)) ai.rising = true; else ai.jumpShot = false;
      } else if (!ai.rising || (p.airborne && p.vy <= 0.4)) {
        const shot = aiShot(g, side);
        if (queueShot(g, side, shot.angle, shot.power)) ai.planned = false;
      }
    }
  } else if (mine.state !== 'held') ai.planned = false;

  // Contesting the other side's shot.
  const o: Side = side === 0 ? 1 : 0, ob = g.balls[o];
  if (ob.state === 'flight' && !ob.blocked && ob.flight !== ai.blockFlight && !p.airborne && p.frozen <= 0) {
    ai.blockFlight = ob.flight;
    const toward = (p.x - ob.x) * Math.sign(ob.vx);
    if (toward > 0 && Math.abs(ob.vx) > 0.5) {
      const t = (p.x - ob.x) / ob.vx, y = ob.y + ob.vy * t - (GRAVITY * t * t) / 2;
      const need = y - (p.y + BODY_REACH);
      if (need > -0.05 && need < JUMP_HEIGHT + 0.15 && random(g) < r.block) {
        const h = Math.min(Math.max(need, 0), JUMP_HEIGHT - 0.01);
        const rise = (JUMP_SPEED - Math.sqrt(JUMP_SPEED * JUMP_SPEED - 2 * GRAVITY * h)) / GRAVITY;
        ai.jumpAt = g.time + t - rise + gauss(g) * r.blockTiming;
      }
    }
  }
  if (ai.jumpAt > 0 && g.time >= ai.jumpAt) {ai.jumpAt = -1; queueJump(g, side);}
}
