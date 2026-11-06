/**
 * "Shot on!" — the game's version of check.
 *
 * A side has a shot on when its carrier could score with a good chance right
 * now, or with one pass and a shot. The warning is advice, not a rule: the
 * defending side does not have to answer it.
 */

import { carrierOf, keeperOf, occupancy } from "./board";
import { passTargets } from "./moves";
import { bestShot, passOdds, shotOdds } from "./odds";
import { clamp, other, type GameState, type GoalTarget, type Side, type Sq } from "./state";

export const shotOnThreshold = 0.25;
export const comboThreshold = 0.35;

export type ShotLane = { from: Sq; target: GoalTarget; goal: number; via: string | null };

export type Threat = {
  side: Side;
  /** Best goal chance from where the ball is. */
  shot: number;
  /** Best pass-then-shot chance. */
  combo: number;
  on: boolean;
  /** The lanes worth shading, strongest first. */
  lanes: ShotLane[];
};

const none = (side: Side): Threat => ({ side, shot: 0, combo: 0, on: false, lanes: [] });

export function threatOf(state: GameState, side: Side): Threat {
  if (state.phase !== "play") return none(side);
  const carrier = carrierOf(state);
  if (carrier.side !== side || carrier.cls === "keeper") return none(side);

  const grid = occupancy(state.pieces);
  const lanes: ShotLane[] = [];
  for (const target of [1, 2, 3] as const) {
    const goal = bestShotTarget(state, carrier.id, target);
    if (goal >= 0.15) lanes.push({ from: { col: carrier.col, row: carrier.row }, target, goal, via: null });
  }
  const shot = bestShot(state, carrier, { grid });

  // One pass first: the keeper gets one step toward the receiver's row.
  const keeper = keeperOf(state, other(side));
  let combo = 0;
  for (const receiver of passTargets(state, grid, carrier)) {
    const keeperRow = keeper.row + Math.sign(clamp(receiver.row, 1, 3) - keeper.row);
    const success = passOdds(state, carrier, receiver).success;
    const chance = success * bestShot(state, receiver, { grid, keeperRow });
    if (chance > combo) combo = chance;
    if (chance >= comboThreshold) {
      for (const target of [1, 2, 3] as const) {
        const goal = shotOdds(state, receiver, target, { grid, keeperRow }).goal * success;
        if (goal >= comboThreshold) {
          lanes.push({ from: { col: receiver.col, row: receiver.row }, target, goal, via: receiver.id });
        }
      }
    }
  }
  lanes.sort((a, b) => b.goal - a.goal);
  return { side, shot, combo, on: shot >= shotOnThreshold || combo >= comboThreshold, lanes };
}

function bestShotTarget(state: GameState, shooterId: string, target: GoalTarget): number {
  const shooter = state.pieces.find((piece) => piece.id === shooterId);
  if (shooter === undefined || bestShot(state, shooter) === 0) return 0;
  return shotOdds(state, shooter, target).goal;
}
