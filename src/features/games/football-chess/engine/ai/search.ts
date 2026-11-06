/**
 * The opponent's search.
 *
 * Expectimax: the side to move picks its best action, its opponent picks the
 * reply worst for it, and every action that rolls is averaged over its
 * outcomes (read from `resolve.ts`, the same list the game draws from).
 * Below the root only the most promising few actions are searched, ordered by
 * a cheap guess, and the effort is capped by a count of evaluated positions —
 * not by the clock — so the same position gives the same answer on every
 * device and in tests.
 */

import type { RandomSource } from "../../../shared/engine/random-source";
import { carrierOf, occupancy, onBoard, pieceById, type Occupancy } from "../board";
import { evaluate, type EvalWeights } from "../eval";
import { cheb } from "../geometry";
import { legalActions } from "../moves";
import { shotOdds, slideOdds, tackleOdds, takeOnOdds } from "../odds";
import { outcomes } from "../resolve";
import type { Action, GameState, Side } from "../state";

/** Value nudges per verb, in goals, for a personality's taste. */
export type StyleBias = Partial<Record<Action["kind"], number>>;

export type SearchParams = {
  /** Plies searched: 1 is the action alone, 2 adds the reply. */
  depth: number;
  /** Actions searched at each ply below the root (index 0 is the reply). */
  beams: readonly number[];
  /** The most positions evaluated across all depths. */
  budget: number;
  weights: EvalWeights;
  /** Spread penalty at the root: positive avoids gambles, negative seeks them. */
  risk: number;
  style: StyleBias;
};

export type RankedAction = { action: Action; value: number };

export type SearchResult = {
  ranked: RankedAction[];
  /** The deepest search that finished inside the budget. */
  depth: number;
  nodes: number;
};

class OutOfBudget extends Error {}

type Context = { nodes: number; limit: number; me: Side; params: SearchParams };

function forward(side: Side, fromCol: number, toCol: number): number {
  return side === "home" ? toCol - fromCol : fromCol - toCol;
}

/** A cheap guess at how good an action is for the side playing it. */
function quickScore(state: GameState, grid: Occupancy, action: Action): number {
  const actor = pieceById(state, action.pieceId);
  const carrier = carrierOf(state);
  switch (action.kind) {
    case "shoot":
      return 1 + 10 * shotOdds(state, actor, action.target, { grid }).goal;
    case "tackle":
      return 4 * tackleOdds(state, actor, carrier).win;
    case "slide":
      return 3 * slideOdds(state, actor, carrier).win;
    case "takeOn":
      return 0.5 + 2 * takeOnOdds(state, actor, pieceById(state, action.defenderId)).win;
    case "pass": {
      const receiver = pieceById(state, action.targetId);
      return 1 + 0.4 * forward(actor.side, actor.col, receiver.col);
    }
    case "skill":
      return 1.5 + 0.3 * forward(actor.side, actor.col, action.to.col);
    case "move": {
      if (actor.id === carrier.id) return 0.5 + 0.5 * forward(actor.side, actor.col, action.to.col);
      if (carrier.side !== actor.side && onBoard(carrier)) {
        return 0.6 * (cheb(actor, carrier) - cheb(action.to, carrier));
      }
      return 0.2 * forward(actor.side, actor.col, action.to.col);
    }
    case "hold":
      return 0;
  }
}

export function orderActions(state: GameState, actions: readonly Action[]): Action[] {
  const grid = occupancy(state.pieces);
  return actions
    .map((action, index) => ({ action, index, score: quickScore(state, grid, action) }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map((entry) => entry.action);
}

/**
 * A goal ends a line: the board resets, so searching past it only adds noise.
 * Like a chess engine preferring the shorter mate, a goal found further ahead
 * is worth a little less (and one conceded later hurts a little less), which
 * stops the search putting off a good shot forever.
 */
export const goalDelay = 0.03;

function value(state: GameState, depth: number, ply: number, ctx: Context): number {
  const goal = state.last?.goalFor ?? null;
  if (depth === 0 || state.phase === "fullTime" || goal !== null) {
    ctx.nodes += 1;
    if (ctx.nodes > ctx.limit) throw new OutOfBudget();
    const v = evaluate(state, ctx.me, ctx.params.weights);
    if (goal === null) return v;
    return v + (goal === ctx.me ? -1 : 1) * goalDelay * ply;
  }
  let actions = legalActions(state);
  const beam = ctx.params.beams[Math.min(ply - 1, ctx.params.beams.length - 1)] ?? actions.length;
  if (actions.length > beam) actions = orderActions(state, actions).slice(0, beam);
  const maximise = state.turn === ctx.me;
  let best = maximise ? -Infinity : Infinity;
  for (const action of actions) {
    let expected = 0;
    for (const outcome of outcomes(state, action)) {
      expected += outcome.p * value(outcome.state, depth - 1, ply + 1, ctx);
    }
    if (maximise ? expected > best : expected < best) best = expected;
  }
  return best;
}

function rootValue(state: GameState, action: Action, depth: number, ctx: Context): number {
  const results = outcomes(state, action).map((outcome) => ({
    p: outcome.p,
    v: value(outcome.state, depth - 1, 1, ctx),
  }));
  const mean = results.reduce((sum, r) => sum + r.p * r.v, 0);
  const spread = Math.sqrt(results.reduce((sum, r) => sum + r.p * (r.v - mean) ** 2, 0));
  return mean - ctx.params.risk * spread + (ctx.params.style[action.kind] ?? 0);
}

/** Rank every legal action for the side to move, deepening while the budget lasts. */
export function search(state: GameState, params: SearchParams): SearchResult {
  const root = legalActions(state);
  const me = state.turn;
  let ranked: RankedAction[] = [];
  let depthDone = 0;
  let used = 0;
  for (let depth = 1; depth <= Math.max(1, params.depth); depth += 1) {
    // Depth 1 always finishes; deeper searches give up past the budget.
    const ctx: Context = { nodes: 0, limit: depth === 1 ? Infinity : params.budget - used, me, params };
    try {
      const values = root.map((action) => ({ action, value: rootValue(state, action, depth, ctx) }));
      ranked = values;
      depthDone = depth;
      used += ctx.nodes;
    } catch (error) {
      if (error instanceof OutOfBudget) break;
      throw error;
    }
  }
  ranked = [...ranked].sort((a, b) => b.value - a.value);
  return { ranked, depth: depthDone, nodes: used };
}

export type ChoiceOptions = {
  /** Softmax temperature over the top choices; 0 always plays the best. */
  temperature: number;
  topN: number;
};

/** Pick from a ranking, using the decision stream only to break ties or add noise. */
export function choose(ranked: readonly RankedAction[], options: ChoiceOptions, decide: RandomSource): Action {
  if (ranked.length === 0) throw new Error("No actions to choose from");
  const best = ranked[0].value;
  if (options.temperature <= 0) {
    const tied = ranked.filter((entry) => best - entry.value <= 1e-9);
    return tied[Math.floor(decide() * tied.length)].action;
  }
  const pool = ranked.slice(0, Math.max(1, options.topN));
  const weights = pool.map((entry) => Math.exp((entry.value - best) / options.temperature));
  const total = weights.reduce((sum, w) => sum + w, 0);
  let roll = decide() * total;
  for (let index = 0; index < pool.length; index += 1) {
    roll -= weights[index];
    if (roll < 0) return pool[index].action;
  }
  return pool[pool.length - 1].action;
}
