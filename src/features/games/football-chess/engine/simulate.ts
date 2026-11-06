/**
 * Headless matches, for tests and for tuning the odds.
 */

import type { RandomSource } from "../../shared/engine/random-source";
import { botMove, type BotProfile } from "./ai/bots";
import { choose, search } from "./ai/search";
import { defaultWeights } from "./eval";
import { step } from "./game";
import { legalActions } from "./moves";
import { hashString, Stream } from "./rng";
import { createGame } from "./setup";
import type { Action, GameState, MatchSetup, Side } from "./state";

export type Policy = (state: GameState) => Action;

function decideStream(seed: number, label: string): RandomSource {
  return new Stream(hashString(`decide:${label}:${seed}`)).next;
}

export function botPolicy(profile: BotProfile, seed: number, label = "bot"): Policy {
  const decide = decideStream(seed, label);
  return (state) => botMove(state, profile, decide).action;
}

/** Any legal action, uniformly. */
export function randomPolicy(seed: number): Policy {
  const decide = decideStream(seed, "random");
  return (state) => {
    const actions = legalActions(state);
    return actions[Math.floor(decide() * actions.length)];
  };
}

/** The best action by position value alone, without reading replies. Fast. */
export function greedyPolicy(seed: number): Policy {
  const decide = decideStream(seed, "greedy");
  const params = { depth: 1, beams: [1], budget: Infinity, weights: defaultWeights, risk: 0, style: {} };
  return (state) => choose(search(state, params).ranked, { temperature: 0, topN: 1 }, decide);
}

export function playMatch(
  setup: MatchSetup,
  policies: Record<Side, Policy>,
  maxPlies = 2000,
): GameState {
  let state = createGame(setup);
  while (state.phase !== "fullTime" && state.ply < maxPlies) {
    state = step(state, policies[state.turn](state));
  }
  return state;
}

export type MatchSummary = {
  goals: Record<Side, number>;
  shots: Record<Side, number>;
  passives: Record<Side, number>;
  fouls: Record<Side, number>;
  winner: Side | null;
  plies: number;
};

export function summarize(state: GameState): MatchSummary {
  const { home, away } = state.score;
  return {
    goals: { home, away },
    shots: { home: state.stats.home.shots, away: state.stats.away.shots },
    passives: { home: state.stats.home.passives, away: state.stats.away.passives },
    fouls: { home: state.stats.home.fouls, away: state.stats.away.fouls },
    winner: home === away ? null : home > away ? "home" : "away",
    plies: state.ply,
  };
}
