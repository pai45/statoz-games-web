/**
 * Football Chess v2 — the shared vocabulary of the engine.
 *
 * Everything here is plain JSON so a match can be saved, replayed and
 * reviewed. The board is 7 columns (a–g, home goal on the left) by 5 rows
 * (1–5, bottom to top). The goals sit just off the grid, level with rows 2–4,
 * and each keeper stands in its goal rather than on a square.
 *
 * "home" is the side on the left, attacking the right-hand goal. In single
 * player the human is always home.
 */

import type { PlayerCard } from "@/domain/cards";

export type Side = "home" | "away";

export function other(side: Side): Side {
  return side === "home" ? "away" : "home";
}

export type Sq = { readonly col: number; readonly row: number };

export type PieceClass = "striker" | "runner" | "playmaker" | "defender" | "keeper";

/** The parts of a card the engine reads. */
export type PieceCard = Pick<PlayerCard, "id" | "name" | "shortName" | "position" | "role" | "rating">;

export type Piece = {
  /** `h0`–`h3` and `hk` for home, `a0`–`a3` and `ak` for away. */
  id: string;
  side: Side;
  cls: PieceClass;
  card: PieceCard;
  /** Keepers stand off the grid, at column -1 (home) or 7 (away). */
  col: number;
  row: number;
  /** The formation square the piece returns to at a kick-off. */
  homeCol: number;
  homeRow: number;
  yellow: boolean;
  /** Own actions left in the sin bin. The piece is off the board while > 0. */
  offFor: number;
  /** A missed slide: the piece cannot act while `ply < restUntil`. */
  restUntil: number;
  /** A missed tackle: the piece cannot tackle while `ply < noTackleUntil`. */
  noTackleUntil: number;
};

export type Formation = "box" | "diamond" | "attacking" | "defensive";

export const formations: readonly Formation[] = ["box", "diamond", "attacking", "defensive"];

export const matchLengths = { short: 12, standard: 20, long: 28 } as const;
export type MatchLength = keyof typeof matchLengths;

export type MatchConfig = {
  /** Actions each side takes per half. */
  actionsPerHalf: number;
  /** Actions a side may keep the ball for before passive play; 0 switches it off. */
  attackClock: number;
  /** Training only: lets a step choose its outcome instead of rolling. */
  allowForced: boolean;
};

export const defaultAttackClock = 6;
/** A corner hands the attack back with this many actions on the clock. */
export const cornerAttackClock = 3;

export function matchConfig(length: MatchLength = "standard"): MatchConfig {
  return { actionsPerHalf: matchLengths[length], attackClock: defaultAttackClock, allowForced: false };
}

export type TeamSetup = {
  name: string;
  formation: Formation;
  /** `[attacker, attacker, defender, defender, keeper]`. */
  squad: readonly PieceCard[];
};

export type MatchSetup = {
  seed: number;
  home: TeamSetup;
  away: TeamSetup;
  config: MatchConfig;
  /** Who kicks off the first half; the other side kicks off the second. */
  kickoff: Side;
};

/** Goal-mouth targets are the rows level with the goal: 1, 2 and 3 (rows 2–4). */
export type GoalTarget = 1 | 2 | 3;

export type Action =
  | { kind: "move"; pieceId: string; to: Sq }
  /** A Runner's once-per-possession knight-style jump with the ball. */
  | { kind: "skill"; pieceId: string; to: Sq }
  | { kind: "pass"; pieceId: string; targetId: string }
  | { kind: "shoot"; pieceId: string; target: GoalTarget }
  | { kind: "takeOn"; pieceId: string; defenderId: string }
  | { kind: "tackle"; pieceId: string }
  | { kind: "slide"; pieceId: string }
  /** Only offered when a side has nothing else it can do. */
  | { kind: "hold"; pieceId: string };

export type OutcomeTag =
  | "moved"
  | "passed"
  | "intercepted"
  | "goal"
  | "saved"
  | "blocked"
  | "corner"
  | "beat"
  | "lost"
  | "won"
  | "missed"
  | "foul";

export type CardShown = "none" | "yellow" | "red";

/** What the last action did, for banners, the arrow and the move list. */
export type MatchEvent = {
  side: Side;
  actorId: string;
  action: Action;
  tag: OutcomeTag;
  /** Probability of the outcome that happened. */
  p: number;
  from: Sq;
  to: Sq;
  card: CardShown;
  penaltyAwarded: boolean;
  penaltyKick: boolean;
  passive: boolean;
  goalFor: Side | null;
  halfTime: boolean;
  fullTime: boolean;
};

export type LogEntry = {
  side: Side;
  action: Action;
  /** Index into the action's outcome list. */
  outcome: number;
  p: number;
  tag: OutcomeTag;
  forced: boolean;
};

export type Phase = "play" | "penalty" | "fullTime";

export type SideStats = { shots: number; passives: number; fouls: number; cards: number };

export type GameState = {
  setup: MatchSetup;
  pieces: readonly Piece[];
  carrierId: string;
  turn: Side;
  half: 1 | 2;
  actionsLeft: Readonly<Record<Side, number>>;
  attackClock: number;
  /** A Runner's skill move has been used this possession. */
  skillSpent: boolean;
  score: Readonly<Record<Side, number>>;
  stats: Readonly<Record<Side, SideStats>>;
  phase: Phase;
  penaltyTakerId: string | null;
  ply: number;
  /** The gameplay stream's position. */
  rng: number;
  log: readonly LogEntry[];
  last: MatchEvent | null;
};

/** Raised for an illegal action or a forbidden forced outcome. */
export class FootballChessInputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FootballChessInputError";
  }
}

export function clamp(value: number, low: number, high: number): number {
  return value < low ? low : value > high ? high : value;
}
