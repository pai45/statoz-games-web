/**
 * Difficulty tiers and manager personalities.
 *
 * A tier sets how far and how wide the search looks and how much noise it
 * plays with. A personality reweights the position value and adds a taste for
 * certain verbs and for risk, so a Park the Bus side and a Maverick side play
 * the same rules very differently.
 */

import type { RandomSource } from "../../../shared/engine/random-source";
import { defaultWeights, type EvalWeights } from "../eval";
import type { Action, GameState } from "../state";
import { choose, search, type SearchParams, type SearchResult, type StyleBias } from "./search";

export type Difficulty = "easy" | "medium" | "hard";
export type Personality = "balanced" | "parkTheBus" | "tikiTaka" | "gegenpress" | "longBall" | "maverick";

export const difficulties: readonly Difficulty[] = ["easy", "medium", "hard"];
export const personalities: readonly Personality[] = [
  "balanced",
  "parkTheBus",
  "tikiTaka",
  "gegenpress",
  "longBall",
  "maverick",
];

export const difficultyInfo: Record<Difficulty, { label: string; blurb: string }> = {
  easy: { label: "Easy", blurb: "Looks one move ahead and sometimes misses a threat." },
  medium: { label: "Medium", blurb: "Reads your best reply before it moves." },
  hard: { label: "Hard", blurb: "Plans three moves deep and rarely gambles." },
};

export const personalityInfo: Record<Personality, { label: string; blurb: string }> = {
  balanced: { label: "Balanced", blurb: "No strong habits. Takes what the position gives." },
  parkTheBus: { label: "Park the Bus", blurb: "Bodies behind the ball and no risks. Patience wins." },
  tikiTaka: { label: "Tiki-Taka", blurb: "Keeps the ball and loves short, safe passes." },
  gegenpress: { label: "Gegenpress", blurb: "Hunts the ball high up the pitch the moment it is lost." },
  longBall: { label: "Long Ball", blurb: "Goes forward fast and shoots early." },
  maverick: { label: "Maverick", blurb: "Take-ons, skill moves and slides. Thrilling and reckless." },
};

type Tier = { search: Omit<SearchParams, "weights" | "risk" | "style">; temperature: number; topN: number; shortSighted: number };

const tiers: Record<Difficulty, Tier> = {
  easy: { search: { depth: 2, beams: [4], budget: 400 }, temperature: 0.12, topN: 6, shortSighted: 0.45 },
  medium: { search: { depth: 2, beams: [10], budget: 2500 }, temperature: 0.015, topN: 3, shortSighted: 0 },
  hard: { search: { depth: 3, beams: [12, 6], budget: 16000 }, temperature: 0, topN: 1, shortSighted: 0 },
};

type Taste = { weights: Partial<EvalWeights>; risk: number; style: StyleBias };

const tastes: Record<Personality, Taste> = {
  balanced: { weights: {}, risk: 0.1, style: {} },
  parkTheBus: {
    weights: { goalSide: 0.03, pressure: 0.01, possession: 0.07 },
    risk: 0.35,
    style: { takeOn: -0.03, slide: -0.03, skill: -0.02 },
  },
  tikiTaka: { weights: { passOptions: 0.02, possession: 0.05 }, risk: 0.2, style: { pass: 0.01 } },
  gegenpress: { weights: { pressure: 0.05, goalSide: 0.006 }, risk: 0.05, style: { tackle: 0.02, slide: 0.01 } },
  longBall: { weights: { progress: 0.025, combo: 0.7 }, risk: -0.05, style: { pass: 0.006, shoot: 0.01 } },
  maverick: { weights: { pressure: 0.015 }, risk: -0.3, style: { takeOn: 0.03, skill: 0.02, slide: 0.02 } },
};

export type BotProfile = {
  difficulty: Difficulty;
  personality: Personality;
  params: SearchParams;
  temperature: number;
  topN: number;
  /** Chance of only looking at its own move, ignoring the reply. */
  shortSighted: number;
};

export function botProfile(difficulty: Difficulty, personality: Personality = "balanced"): BotProfile {
  const tier = tiers[difficulty];
  const taste = tastes[personality];
  return {
    difficulty,
    personality,
    params: {
      ...tier.search,
      weights: { ...defaultWeights, ...taste.weights },
      risk: taste.risk,
      style: taste.style,
    },
    temperature: tier.temperature,
    topN: tier.topN,
    shortSighted: tier.shortSighted,
  };
}

export function botMove(
  state: GameState,
  profile: BotProfile,
  decide: RandomSource,
): { action: Action; result: SearchResult } {
  const shortSighted = profile.shortSighted > 0 && decide() < profile.shortSighted;
  const params = shortSighted ? { ...profile.params, depth: 1 } : profile.params;
  const result = search(state, params);
  const action = choose(result.ranked, { temperature: profile.temperature, topN: profile.topN }, decide);
  return { action, result };
}
