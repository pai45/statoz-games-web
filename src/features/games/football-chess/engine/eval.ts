/**
 * How good a position is, in goals.
 *
 * The score difference counts one per goal; on top of that the side on the
 * ball is worth its chance of scoring soon (a shot now, or a pass and a shot),
 * how far forward it is and how many outlets it has, and the defending side
 * earns a little for pressure on the ball and bodies goal-side of it.
 * Personalities reweight these terms.
 */

import { carrierOf, keeperOf, occupancy, onBoard } from "./board";
import { cheb, goalDistance } from "./geometry";
import { actionsRemaining } from "./game";
import { passTargets } from "./moves";
import { bestShot, passOdds } from "./odds";
import { clamp, other, type GameState, type Side } from "./state";

export type EvalWeights = {
  possession: number;
  progress: number;
  shot: number;
  combo: number;
  passOptions: number;
  pressure: number;
  goalSide: number;
  discipline: number;
  clock: number;
};

export const defaultWeights: EvalWeights = {
  possession: 0.04,
  progress: 0.03,
  shot: 0.3,
  combo: 0.3,
  passOptions: 0.008,
  pressure: 0.02,
  goalSide: 0.025,
  discipline: 0.15,
  clock: 0.2,
};

/**
 * A possession is worth less as its attack clock runs down: full value with
 * four or more actions left, then `clock` less for each one missing.
 */
function clockFactor(state: GameState, w: EvalWeights): number {
  if (state.setup.config.attackClock <= 0) return 1;
  return clamp(1 - w.clock * (4 - state.attackClock), 0.2, 1);
}

/** The positional part only: what the side on the ball is worth, for `me`. */
export function positional(state: GameState, me: Side, w: EvalWeights = defaultWeights): number {
  if (state.phase === "fullTime") return 0;
  const carrier = carrierOf(state);
  const poss = carrier.side;
  let attack = w.possession;
  let defence = 0;

  // An open shot is only an option: the defence answers before it can be
  // taken again, so it is worth well under the goal it might become.
  const grid = occupancy(state.pieces);
  const moving = state.turn === poss || state.phase === "penalty";
  const reach = moving ? 1 : 0.6;
  const ground = (col: number) => w.progress * Math.min(4, 7 - goalDistance(poss, col));
  const isKeeper = carrier.cls === "keeper";
  const here = isKeeper ? 0 : ground(carrier.col) + reach * w.shot * bestShot(state, carrier, { grid });

  // The best teammate to give it to: where they stand and what they could
  // shoot, discounted by the pass's chance and the action it costs. This is
  // what makes forward runs and opened lanes worth something — and what a
  // keeper holding the ball after a save is really worth.
  const outlets = passTargets(state, grid, carrier);
  const keeper = keeperOf(state, other(poss));
  let there = 0;
  for (const receiver of outlets) {
    const keeperRow = keeper.row + Math.sign(clamp(receiver.row, 1, 3) - keeper.row);
    const success = passOdds(state, carrier, receiver).success;
    const value =
      success * (ground(receiver.col) + reach * w.combo * bestShot(state, receiver, { grid, keeperRow }));
    if (value > there) there = value;
  }
  attack += Math.max(here, here * 0.5 + there * 0.6) + (isKeeper ? 0 : w.passOptions * outlets.length);
  attack *= clockFactor(state, w);

  if (!isKeeper) {
    const defending = other(poss);
    for (const piece of state.pieces) {
      if (piece.side !== defending || !onBoard(piece)) continue;
      if (cheb(piece, carrier) === 1) defence += w.pressure;
      const goalSide = defending === "home" ? piece.col < carrier.col : piece.col > carrier.col;
      if (goalSide) defence += w.goalSide;
    }
  }

  let value = poss === me ? attack - defence : defence - attack;
  for (const piece of state.pieces) {
    if (piece.offFor > 0) value += (piece.side === me ? -1 : 1) * w.discipline;
  }
  return value;
}

export function evaluate(state: GameState, me: Side, w: EvalWeights = defaultWeights): number {
  const diff = state.score[me] - state.score[other(me)];
  return diff + positional(state, me, w);
}

/** Goals per action across both sides in a typical match, for the win estimate. */
const goalRate = 0.05;

function normalCdf(x: number): number {
  // Abramowitz–Stegun 7.1.26, plenty for an eval bar.
  const t = 1 / (1 + 0.3275911 * Math.abs(x) / Math.SQRT2);
  const y =
    1 -
    ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) *
      t *
      Math.exp(-(x * x) / 2);
  return x >= 0 ? 0.5 * (1 + y) : 0.5 * (1 - y);
}

/**
 * Win, draw and loss chances for `me`, from the score, the position and the
 * actions left. At full time it is exact.
 */
export function resultChances(state: GameState, me: Side): { win: number; draw: number; loss: number } {
  const diff = state.score[me] - state.score[other(me)];
  if (state.phase === "fullTime") {
    return { win: diff > 0 ? 1 : 0, draw: diff === 0 ? 1 : 0, loss: diff < 0 ? 1 : 0 };
  }
  const mean = diff + positional(state, me);
  const spread = Math.sqrt(actionsRemaining(state).total * goalRate + 0.05);
  const win = normalCdf((mean - 0.5) / spread);
  const loss = normalCdf((-mean - 0.5) / spread);
  return { win, draw: Math.max(0, 1 - win - loss), loss };
}

/** Expected points share (a win is 1, a draw ½), which drives the eval bar. */
export function expectedScore(state: GameState, me: Side): number {
  const chances = resultChances(state, me);
  return chances.win + chances.draw / 2;
}
