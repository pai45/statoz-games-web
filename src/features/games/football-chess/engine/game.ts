/**
 * Playing a match: one pure step per action.
 *
 * A step checks the action is legal, lists its outcomes, draws one from the
 * gameplay stream stored in the state (only when there is a real choice, so a
 * plain move never consumes a roll), and appends it to the log. Replaying the
 * log from the setup rebuilds the match exactly, which is how resume, review
 * and tamper checks work.
 */

import { actionKey, isLegal } from "./moves";
import { outcomes, type Outcome } from "./resolve";
import { nextRandom } from "./rng";
import { createGame } from "./setup";
import { FootballChessInputError, type Action, type GameState, type LogEntry, type MatchSetup, type Side } from "./state";

export type StepOptions = {
  /** Training only: choose the outcome instead of rolling for it. */
  forced?: number;
};

function pick(list: readonly Outcome[], roll: number): number {
  let total = 0;
  for (let index = 0; index < list.length; index += 1) {
    total += list[index].p;
    if (roll < total) return index;
  }
  return list.length - 1;
}

export function step(state: GameState, action: Action, options: StepOptions = {}): GameState {
  if (state.phase === "fullTime") throw new FootballChessInputError("The match is over");
  if (!isLegal(state, action)) throw new FootballChessInputError(`Illegal action ${actionKey(action)}`);

  const list = outcomes(state, action);
  let index = 0;
  let rng = state.rng;
  let forced = false;
  if (options.forced !== undefined) {
    if (!state.setup.config.allowForced) throw new FootballChessInputError("Forced outcomes are off for this match");
    if (!Number.isInteger(options.forced) || options.forced < 0 || options.forced >= list.length) {
      throw new FootballChessInputError(`No outcome ${options.forced}`);
    }
    index = options.forced;
    forced = true;
  } else if (list.length > 1) {
    const [roll, next] = nextRandom(state.rng);
    rng = next;
    index = pick(list, roll);
  }

  const chosen = list[index];
  const entry: LogEntry = {
    side: state.turn,
    action,
    outcome: index,
    p: chosen.p,
    tag: chosen.tag,
    forced,
  };
  return { ...chosen.state, rng, log: [...state.log, entry] };
}

/**
 * Rebuild a match from its setup and log. Throws if any entry is illegal, was
 * forced in a match that does not allow it, or records an outcome the stream
 * would not have produced.
 */
export function replay(setup: MatchSetup, log: readonly LogEntry[]): GameState {
  let state = createGame(setup);
  for (const entry of log) {
    if (entry.forced && !setup.config.allowForced) {
      throw new FootballChessInputError("A forced outcome in a match that does not allow them");
    }
    state = step(state, entry.action, entry.forced ? { forced: entry.outcome } : {});
    const last = state.log[state.log.length - 1];
    if (last.outcome !== entry.outcome) {
      throw new FootballChessInputError(`Log does not replay at ply ${state.ply - 1}`);
    }
  }
  return state;
}

export function isOver(state: GameState): boolean {
  return state.phase === "fullTime";
}

export function winner(state: GameState): Side | null {
  if (state.score.home === state.score.away) return null;
  return state.score.home > state.score.away ? "home" : "away";
}

/** Actions the side to move still has, this half and in total. */
export function actionsRemaining(state: GameState): { half: number; total: number } {
  const perHalf = state.setup.config.actionsPerHalf;
  const half = state.actionsLeft.home + state.actionsLeft.away;
  return { half, total: half + (state.half === 1 ? perHalf * 2 : 0) };
}

export { createGame };
