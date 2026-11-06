/**
 * Every chance in the game, as a number plus the reasons behind it.
 *
 * The UI shows these before the player commits, and the AI and the outcome
 * lists in `resolve.ts` read the same functions, so what is shown is exactly
 * what is rolled. Position is meant to outweigh rating: rating effects are
 * small and capped.
 */

import { at, isGuarded, keeperOf, leadGuard, occupancy, onBoard, type Occupancy } from "./board";
import { classTraits } from "./classes";
import { cheb, goalDistance, laneBetween, shotPath } from "./geometry";
import { clamp, other, type GameState, type GoalTarget, type Piece, type Sq } from "./state";

export type Factor = {
  label: string;
  /** "Ã—0.75" style multipliers, or "+10%" style additions. */
  kind: "base" | "mul" | "add";
  value: number;
};

export const shotBase = [0, 0.8, 0.6, 0.4, 0.24] as const;
export const shotAngle = [1, 0.92, 0.8, 0.65] as const;
export const keeperCover = [0.6, 0.9, 1] as const;
export const strikerFinish = 1.1;
export const blockChance = { defender: 0.55, other: 0.4 } as const;
export const minShot = 0.05;
export const maxShot = 0.85;

export const interceptLane = 0.25;
export const interceptReceiver = 0.15;
export const minPass = 0.35;

export const tackleBase = 0.28;
export const tackleSupport = 0.12;

export const cornerShare = 0.4;
export const foulChance = 0.3;
export const sinBinActions = 6;

/** Half a per cent per rating point, capped. */
export function ratingEdge(a: number, b: number, cap: number): number {
  return clamp((a - b) * 0.005, -cap, cap);
}

/* ---- Shots ----------------------------------------------------------------- */

export type ShotOdds = {
  goal: number;
  saved: number;
  blocked: number;
  /** The chance before any blocker is counted. */
  onTarget: number;
  blockers: Piece[];
  path: readonly Sq[];
  factors: Factor[];
};

export function canShootFrom(shooter: Piece, from: Sq): boolean {
  if (shooter.cls === "keeper") return false;
  return goalDistance(shooter.side, from.col) <= classTraits[shooter.cls].shootRange;
}

/**
 * A shot at one of the three goal-mouth rows. `from` and `keeperRow` let the
 * AI ask "what if" without building a new state.
 */
export function shotOdds(
  state: GameState,
  shooter: Piece,
  target: GoalTarget,
  options: { from?: Sq; keeperRow?: number; grid?: Occupancy } = {},
): ShotOdds {
  const from = options.from ?? shooter;
  const keeper = keeperOf(state, other(shooter.side));
  const keeperRow = options.keeperRow ?? keeper.row;
  const distance = goalDistance(shooter.side, from.col);
  const base = distance < shotBase.length ? shotBase[distance] : 0;
  const angle = shotAngle[Math.min(3, Math.abs(from.row - target))];
  const cover = keeperCover[Math.min(2, Math.abs(keeperRow - target))];
  const finish = shooter.cls === "striker" ? strikerFinish : 1;
  const edge = ratingEdge(shooter.card.rating, keeper.card.rating, 0.08);
  const onTarget = base * angle * cover * finish * (1 + edge);

  const grid = options.grid ?? occupancy(state.pieces);
  const path = shotPath(from, shooter.side, target);
  const blockers: Piece[] = [];
  let through = 1;
  for (const s of path) {
    const piece = at(grid, s.col, s.row);
    if (piece === null || piece.side === shooter.side || piece.id === shooter.id) continue;
    blockers.push(piece);
    through *= 1 - (piece.cls === "defender" ? blockChance.defender : blockChance.other);
  }

  const goal = clamp(onTarget * through, minShot, maxShot);
  const blocked = Math.min(1 - goal, 1 - through);
  const saved = Math.max(0, 1 - goal - blocked);

  const factors: Factor[] = [
    { label: `${distance} col${distance === 1 ? "" : "s"} out`, kind: "base", value: base },
    { label: "Angle", kind: "mul", value: angle },
    {
      label:
        cover === keeperCover[0]
          ? "Keeper on the line"
          : cover === keeperCover[1]
            ? "Keeper one row off"
            : "Keeper out of position",
      kind: "mul",
      value: cover,
    },
  ];
  if (finish !== 1) factors.push({ label: "Striker's finish", kind: "mul", value: finish });
  if (edge !== 0) factors.push({ label: "Rating vs keeper", kind: "mul", value: 1 + edge });
  for (const blocker of blockers) {
    factors.push({
      label: `${blocker.card.shortName} in the way`,
      kind: "mul",
      value: 1 - (blocker.cls === "defender" ? blockChance.defender : blockChance.other),
    });
  }
  return { goal, saved, blocked, onTarget, blockers, path, factors };
}

/** The best goal chance a piece has from a square, over the three targets. */
export function bestShot(
  state: GameState,
  shooter: Piece,
  options: { from?: Sq; keeperRow?: number; grid?: Occupancy } = {},
): number {
  if (!canShootFrom(shooter, options.from ?? shooter)) return 0;
  let best = 0;
  for (const target of [1, 2, 3] as const) {
    best = Math.max(best, shotOdds(state, shooter, target, options).goal);
  }
  return best;
}

export function penaltyOdds(state: GameState, taker: Piece): { goal: number; factors: Factor[] } {
  const keeper = keeperOf(state, other(taker.side));
  const edge = ratingEdge(taker.card.rating, keeper.card.rating, 0.06);
  const striker = taker.cls === "striker" ? 0.04 : 0;
  const goal = clamp(0.7 + edge + striker, 0.55, 0.85);
  const factors: Factor[] = [{ label: "Penalty", kind: "base", value: 0.7 }];
  if (striker !== 0) factors.push({ label: "Striker", kind: "add", value: striker });
  if (edge !== 0) factors.push({ label: "Rating vs keeper", kind: "add", value: edge });
  return { goal, factors };
}

/* ---- Passes ---------------------------------------------------------------- */

export type PassOdds = { success: number; interceptor: Piece | null; lofted: boolean; factors: Factor[] };

export function passOdds(state: GameState, passer: Piece, receiver: Piece): PassOdds {
  // Keepers and Playmakers play it in the air: only a marked receiver is at risk.
  const lofted = passer.cls === "playmaker" || passer.cls === "keeper";
  const defending = other(passer.side);
  const risks: { s: Sq; chance: number; label: string }[] = [];
  if (!lofted) {
    for (const s of laneBetween(passer, receiver) ?? []) {
      if (isGuarded(state, s, defending)) {
        risks.push({ s, chance: interceptLane, label: "Guarded lane" });
      }
    }
  }
  if (isGuarded(state, receiver, defending)) {
    risks.push({ s: receiver, chance: interceptReceiver, label: "Receiver marked" });
  }
  let success = 1;
  for (const risk of risks) success *= 1 - risk.chance;
  success = clamp(success, minPass, 1);
  const first = risks[0];
  const interceptor = first === undefined ? null : leadGuard(state, first.s, defending);
  const factors: Factor[] = [
    { label: passer.cls === "keeper" ? "Keeper's distribution" : lofted ? "Lofted pass" : "Pass", kind: "base", value: 1 },
    ...risks.map((risk) => ({ label: risk.label, kind: "mul" as const, value: 1 - risk.chance })),
  ];
  return { success: interceptor === null ? 1 : success, interceptor, lofted, factors };
}

/* ---- Duels ----------------------------------------------------------------- */

export type DuelOdds = { win: number; factors: Factor[] };

/** The square a take-on lands on: straight past the defender. */
export function takeOnLanding(carrier: Sq, defender: Sq): Sq {
  return { col: 2 * defender.col - carrier.col, row: 2 * defender.row - carrier.row };
}

export function takeOnOdds(state: GameState, carrier: Piece, defender: Piece): DuelOdds {
  const landing = takeOnLanding(carrier, defender);
  const runner = carrier.cls === "runner" ? 0.12 : 0;
  const tough = defender.cls === "defender" ? -0.1 : 0;
  const cover = state.pieces.filter(
    (piece) =>
      piece.side === defender.side &&
      onBoard(piece) &&
      piece.id !== defender.id &&
      cheb(piece, landing) === 1,
  ).length;
  const crowd = -0.08 * cover;
  const edge = ratingEdge(carrier.card.rating, defender.card.rating, 0.06);
  const win = clamp(0.5 + runner + tough + crowd + edge, 0.15, 0.85);
  const factors: Factor[] = [{ label: "Take-on", kind: "base", value: 0.5 }];
  if (runner) factors.push({ label: "Runner", kind: "add", value: runner });
  if (tough) factors.push({ label: "Against a Defender", kind: "add", value: tough });
  if (crowd) factors.push({ label: "Cover behind", kind: "add", value: crowd });
  if (edge) factors.push({ label: "Rating", kind: "add", value: edge });
  return { win, factors };
}

/** Teammates of `side` next to a square, other than `except`. */
function support(state: GameState, s: Sq, side: Piece["side"], except: string): number {
  return state.pieces.filter(
    (piece) =>
      piece.side === side &&
      onBoard(piece) &&
      piece.id !== except &&
      state.ply >= piece.restUntil &&
      cheb(piece, s) === 1,
  ).length;
}

export function tackleOdds(state: GameState, tackler: Piece, carrier: Piece): DuelOdds {
  const helpers = Math.min(2, support(state, carrier, tackler.side, tackler.id));
  const backup = tackleSupport * helpers;
  const defender = tackler.cls === "defender" ? 0.1 : 0;
  const edge = ratingEdge(tackler.card.rating, carrier.card.rating, 0.06);
  const win = clamp(tackleBase + backup + defender + edge, 0.15, 0.75);
  const factors: Factor[] = [{ label: "Tackle", kind: "base", value: tackleBase }];
  if (backup) factors.push({ label: `${helpers} teammate${helpers === 1 ? "" : "s"} closing in`, kind: "add", value: backup });
  if (defender) factors.push({ label: "Defender", kind: "add", value: defender });
  if (edge) factors.push({ label: "Rating", kind: "add", value: edge });
  return { win, factors };
}

export function slideOdds(state: GameState, slider: Piece, carrier: Piece): DuelOdds {
  const defender = slider.cls === "defender" ? 0.05 : 0;
  const edge = ratingEdge(slider.card.rating, carrier.card.rating, 0.06);
  const win = clamp(0.55 + defender + edge, 0.2, 0.8);
  const factors: Factor[] = [{ label: "Slide", kind: "base", value: 0.55 }];
  if (defender) factors.push({ label: "Defender", kind: "add", value: defender });
  if (edge) factors.push({ label: "Rating", kind: "add", value: edge });
  return { win, factors };
}

/** The empty square a slider lunges through, between it and the carrier. */
export function slideMiddle(slider: Sq, carrier: Sq): Sq {
  return { col: (slider.col + carrier.col) / 2, row: (slider.row + carrier.row) / 2 };
}

