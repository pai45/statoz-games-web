import type { RandomSource } from "../../shared/engine/random-source";

import { attacks } from "./actions";
import { createMatch, currentTurn, step, type Turn } from "./match";
import { seededSource } from "./rng";
import type { MatchInput, MatchSetup, MatchState } from "./types";

/** How a scripted human picks, for tests and tuning. */
export type Policy = (turn: Exclude<Turn, { kind: "continue" | "over" }>, state: MatchState, random: RandomSource) => MatchInput;

export const uniformPolicy: Policy = (turn, _state, random) => {
  const pick = <T,>(items: readonly T[]) => items[Math.floor(random() * items.length)];
  if (turn.kind === "attack") return { type: "attack", action: pick(turn.options) };
  if (turn.kind === "defend") return { type: "defend", action: pick(turn.options) };
  return { type: "setPiece", option: pick(turn.options) };
};

/** Picks an action type evenly, then a button within it: the "mix it up" player. */
export const familyMixPolicy: Policy = (turn, state, random) => {
  if (turn.kind !== "attack") return uniformPolicy(turn, state, random);
  const byFamily = new Map<string, typeof turn.options>();
  for (const a of turn.options) byFamily.set(attacks[a].family, [...(byFamily.get(attacks[a].family) ?? []), a]);
  const groups = [...byFamily.values()];
  const group = groups[Math.floor(random() * groups.length)];
  return { type: "attack", action: group[Math.floor(random() * group.length)] };
};

/** Always the first option: the most predictable player there is. */
export const predictablePolicy: Policy = (turn) => {
  if (turn.kind === "attack") return { type: "attack", action: turn.options[0] };
  if (turn.kind === "defend") return { type: "defend", action: turn.options[0] };
  return { type: "setPiece", option: turn.options[0] };
};

/** Plays the whole match headlessly and returns the final state. */
export function autoplay(setup: MatchSetup, policy: Policy = uniformPolicy, policySeed = setup.seed ^ 0x51ed): MatchState {
  const random = seededSource(policySeed);
  let state = createMatch(setup);
  for (let guard = 0; guard < 400; guard += 1) {
    const turn = currentTurn(state);
    if (turn.kind === "over") return state;
    state = step(state, turn.kind === "continue" ? { type: "continue" } : policy(turn, state, random));
  }
  throw new Error("Match did not finish");
}

/** A thinking-ish player: shoots when it can, takes risks in the final third, mixes defensive reads. */
export const sensiblePolicy: Policy = (turn, state, random) => {
  const pick = <T,>(items: readonly T[]) => items[Math.floor(random() * items.length)];
  if (turn.kind === "attack") {
    const p = state.possession.progress;
    if (p === 8) return { type: "attack", action: random() < 0.7 ? "finish" : pick(turn.options) };
    if (p === 7 && random() < 0.5) {
      const shots = turn.options.filter((a) => a === "cross" || a === "longShot");
      if (shots.length) return { type: "attack", action: pick(shots) };
    }
    const forward = turn.options.filter((a) => a !== "shortPass" || p <= 2);
    return { type: "attack", action: pick(forward.length ? forward : turn.options) };
  }
  if (turn.kind === "defend") return { type: "defend", action: pick(turn.options) };
  return { type: "setPiece", option: pick(turn.options) };
};
