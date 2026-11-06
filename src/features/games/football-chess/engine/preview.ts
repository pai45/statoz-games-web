/**
 * What an action is worth before it is played, for the odds panel.
 *
 * The outcome lines come straight from `outcomes()` — the list the game rolls
 * from — so the panel can never disagree with the dice. The factors come from
 * the same odds functions that built that list.
 */

import { carrierOf, pieceById } from "./board";
import { classTraits } from "./classes";
import { sqName } from "./geometry";
import {
  foulChance,
  passOdds,
  penaltyOdds,
  shotOdds,
  slideOdds,
  tackleOdds,
  takeOnOdds,
  type Factor,
} from "./odds";
import { outcomes } from "./resolve";
import type { Action, GameState, GoalTarget, OutcomeTag } from "./state";

export type OutcomeLine = { tag: OutcomeTag; p: number; label: string; good: boolean };

export type ActionPreview = {
  title: string;
  /** The chance it works: a goal, a completed pass, a won duel. */
  chance: number;
  /** More than one possible outcome, so a roll decides it. */
  risky: boolean;
  lines: OutcomeLine[];
  factors: Factor[];
  note: string | null;
};

export const outcomeLabels: Record<OutcomeTag, string> = {
  moved: "Done",
  passed: "Pass completes",
  intercepted: "Cut out",
  goal: "Goal",
  saved: "Saved",
  blocked: "Blocked",
  corner: "Blocked for a corner",
  beat: "Beats him",
  lost: "Loses the ball",
  won: "Wins the ball",
  missed: "Misses",
  foul: "Foul and a card",
};

const goodTags = new Set<OutcomeTag>(["moved", "passed", "goal", "beat", "won", "corner"]);

/** Where in the goal a shot aims, as the player sees the goal on screen. */
export const targetLabels: Record<GoalTarget, string> = { 1: "bottom", 2: "middle", 3: "top" };

function factorsFor(state: GameState, action: Action): { factors: Factor[]; note: string | null } {
  const actor = pieceById(state, action.pieceId);
  switch (action.kind) {
    case "shoot":
      if (state.phase === "penalty") return { factors: penaltyOdds(state, actor).factors, note: null };
      return { factors: shotOdds(state, actor, action.target).factors, note: null };
    case "pass":
      return { factors: passOdds(state, actor, pieceById(state, action.targetId)).factors, note: null };
    case "takeOn":
      return {
        factors: takeOnOdds(state, actor, pieceById(state, action.defenderId)).factors,
        note: "Win and you land on the square behind him.",
      };
    case "tackle":
      return {
        factors: tackleOdds(state, actor, carrierOf(state)).factors,
        note: "Miss and he cannot tackle again for a turn.",
      };
    case "slide":
      return {
        factors: slideOdds(state, actor, carrierOf(state)).factors,
        note: `A miss leaves him on the floor, with a ${Math.round(foulChance * 100)}% chance of a foul.${
          actor.yellow ? " He is on a yellow: a foul is a red." : ""
        }`,
      };
    case "skill":
      return { factors: [], note: "Once per possession. It cannot land on a guarded square." };
    case "move":
    case "hold":
      return { factors: [], note: null };
  }
}

function titleOf(state: GameState, action: Action): string {
  const actor = pieceById(state, action.pieceId);
  const name = actor.card.shortName;
  switch (action.kind) {
    case "move":
      return `${name} to ${sqName(action.to)}`;
    case "skill":
      return `Skill move to ${sqName(action.to)}`;
    case "pass": {
      const receiver = pieceById(state, action.targetId);
      const kind = actor.cls === "keeper" ? "Throw" : actor.cls === "playmaker" ? "Lofted pass" : "Pass";
      return `${kind} to ${receiver.card.shortName}`;
    }
    case "shoot":
      return state.phase === "penalty"
        ? `Penalty, ${targetLabels[action.target]} of the goal`
        : `Shoot, ${targetLabels[action.target]} of the goal`;
    case "takeOn":
      return `Take on ${pieceById(state, action.defenderId).card.shortName}`;
    case "tackle":
      return `Tackle ${carrierOf(state).card.shortName}`;
    case "slide":
      return `Slide on ${carrierOf(state).card.shortName}`;
    case "hold":
      return `${classTraits[actor.cls].label} holds`;
  }
}

export function previewAction(state: GameState, action: Action): ActionPreview {
  const merged = new Map<OutcomeTag, number>();
  for (const outcome of outcomes(state, action)) {
    merged.set(outcome.tag, (merged.get(outcome.tag) ?? 0) + outcome.p);
  }
  const lines: OutcomeLine[] = [...merged.entries()]
    .map(([tag, p]) => ({ tag, p, label: outcomeLabels[tag], good: goodTags.has(tag) }))
    .sort((a, b) => Number(b.good) - Number(a.good) || b.p - a.p);
  const mainTag: OutcomeTag | undefined =
    action.kind === "shoot"
      ? "goal"
      : action.kind === "pass"
        ? "passed"
        : action.kind === "takeOn"
          ? "beat"
          : action.kind === "tackle" || action.kind === "slide"
            ? "won"
            : "moved";
  const chance = merged.get(mainTag) ?? 0;
  const { factors, note } = factorsFor(state, action);
  return { title: titleOf(state, action), chance, risky: merged.size > 1, lines, factors, note };
}

/** "62%", "×0.80", "+10%", "−8%" — how a factor reads in the panel. */
export function formatFactor(factor: Factor): string {
  if (factor.kind === "base") return `${Math.round(factor.value * 100)}%`;
  if (factor.kind === "mul") return `×${factor.value.toFixed(2)}`;
  const points = Math.round(factor.value * 100);
  return `${points >= 0 ? "+" : "−"}${Math.abs(points)}%`;
}

export function percent(p: number): string {
  if (p > 0.995) return "100%";
  if (p < 0.005) return "0%";
  return `${Math.round(p * 100)}%`;
}
