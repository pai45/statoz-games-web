/**
 * Formations, kick-offs and a fresh match.
 */

import type { PlayerCard } from "@/domain/cards";

import { generateShootoutOpponent } from "../../shared/engine/opponent";
import type { RandomSource } from "../../shared/engine/random-source";
import { onBoard, squadIndex } from "./board";
import { classOf } from "./classes";
import { CENTRE, cheb, COLS, keeperCol, mirrorCol, ROWS, sq } from "./geometry";
import { hashString } from "./rng";
import {
  FootballChessInputError,
  other,
  type Formation,
  type GameState,
  type MatchSetup,
  type PieceCard,
  type Piece,
  type Side,
  type Sq,
} from "./state";

/**
 * Home's starting squares, in squad order `[atk, atk, def, def]`. Away uses
 * the same shapes reflected end to end. Column 3 stays clear for the kick-off.
 */
const formationSquares: Record<Formation, readonly [Sq, Sq, Sq, Sq]> = {
  box: [sq(2, 1), sq(2, 3), sq(1, 1), sq(1, 3)],
  diamond: [sq(2, 2), sq(1, 3), sq(1, 1), sq(0, 2)],
  attacking: [sq(2, 0), sq(2, 4), sq(2, 2), sq(1, 2)],
  defensive: [sq(2, 2), sq(1, 2), sq(0, 1), sq(0, 3)],
};

export const formationInfo: Record<Formation, { label: string; code: string; blurb: string }> = {
  box: { label: "Box", code: "2-2", blurb: "Two up, two back. Balanced." },
  diamond: { label: "Diamond", code: "1-2-1", blurb: "Controls the middle and keeps a man back." },
  attacking: { label: "High line", code: "2-1-1", blurb: "Wide forwards and a high press." },
  defensive: { label: "Low block", code: "1-1-2", blurb: "Two deep in front of goal. Hard to break." },
};

export function formationSquaresFor(formation: Formation, side: Side): Sq[] {
  return formationSquares[formation].map((s) =>
    side === "home" ? s : sq(mirrorCol(s.col), s.row),
  );
}

function makePiece(
  side: Side,
  index: number,
  card: PieceCard,
  spot: Sq,
): Piece {
  const keeper = index === 4;
  return {
    id: `${side === "home" ? "h" : "a"}${keeper ? "k" : index}`,
    side,
    cls: keeper ? "keeper" : classOf(card),
    card,
    col: keeper ? keeperCol(side) : spot.col,
    row: keeper ? 2 : spot.row,
    homeCol: keeper ? keeperCol(side) : spot.col,
    homeRow: keeper ? 2 : spot.row,
    yellow: false,
    offFor: 0,
    restUntil: 0,
    noTackleUntil: 0,
  };
}

/**
 * The piece that kicks off: an attacker if one is on the board, the one whose
 * starting square is furthest forward, then the most central.
 */
export function kickerOf(pieces: readonly Piece[], side: Side): Piece | null {
  const mine = pieces.filter((piece) => piece.side === side && onBoard(piece));
  const forward = (piece: Piece) => (side === "home" ? piece.homeCol : -piece.homeCol);
  mine.sort(
    (a, b) =>
      Number(squadIndex(a) > 1) - Number(squadIndex(b) > 1) ||
      forward(b) - forward(a) ||
      Math.abs(a.homeRow - 2) - Math.abs(b.homeRow - 2) ||
      squadIndex(a) - squadIndex(b),
  );
  return mine[0] ?? null;
}

/**
 * Everyone back to their formation squares, keepers to the middle of the goal,
 * and the kicking-off side's kicker on the centre spot with the ball.
 */
export function kickoffPieces(
  pieces: readonly Piece[],
  kickoff: Side,
): { pieces: Piece[]; carrierId: string } {
  const reset = pieces.map((piece) =>
    piece.cls === "keeper"
      ? { ...piece, row: 2 }
      : onBoard(piece)
        ? { ...piece, col: piece.homeCol, row: piece.homeRow }
        : piece,
  );
  const kicker = kickerOf(reset, kickoff);
  if (kicker === null) {
    return { pieces: reset, carrierId: kickoff === "home" ? "hk" : "ak" };
  }
  return {
    pieces: reset.map((piece) =>
      piece.id === kicker.id ? { ...piece, col: CENTRE.col, row: CENTRE.row } : piece,
    ),
    carrierId: kicker.id,
  };
}

/** The empty square nearest a spot, for a piece coming back from the sin bin. */
export function nearestFreeSquare(pieces: readonly Piece[], spot: Sq): Sq {
  const taken = new Set(
    pieces.filter(onBoard).map((piece) => piece.row * COLS + piece.col),
  );
  let best: Sq | null = null;
  let bestDistance = Infinity;
  for (let row = 0; row < ROWS; row += 1) {
    for (let col = 0; col < COLS; col += 1) {
      if (taken.has(row * COLS + col)) continue;
      const d = cheb(sq(col, row), spot) * 10 + Math.abs(row - spot.row);
      if (d < bestDistance) {
        bestDistance = d;
        best = sq(col, row);
      }
    }
  }
  return best ?? spot;
}

function validateSquad(squad: readonly PieceCard[], side: Side): void {
  if (squad.length !== 5) {
    throw new FootballChessInputError(`${side} needs five cards, got ${squad.length}`);
  }
  const ids = new Set(squad.map((card) => card.id));
  if (ids.size !== 5) throw new FootballChessInputError(`${side} fields a card twice`);
  if (squad[4].role !== "goalkeeper") {
    throw new FootballChessInputError(`${side}'s fifth card must be a goalkeeper`);
  }
}

export function createGame(setup: MatchSetup): GameState {
  validateSquad(setup.home.squad, "home");
  validateSquad(setup.away.squad, "away");
  const homeSpots = formationSquaresFor(setup.home.formation, "home");
  const awaySpots = formationSquaresFor(setup.away.formation, "away");
  const pieces: Piece[] = [
    ...setup.home.squad.map((card, index) => makePiece("home", index, card, homeSpots[index] ?? CENTRE)),
    ...setup.away.squad.map((card, index) => makePiece("away", index, card, awaySpots[index] ?? CENTRE)),
  ];
  const kicked = kickoffPieces(pieces, setup.kickoff);
  const actions = setup.config.actionsPerHalf;
  const emptyStats = { shots: 0, passives: 0, fouls: 0, cards: 0 };
  return {
    setup,
    pieces: kicked.pieces,
    carrierId: kicked.carrierId,
    turn: setup.kickoff,
    half: 1,
    actionsLeft: { home: actions, away: actions },
    attackClock: setup.config.attackClock,
    skillSpent: false,
    score: { home: 0, away: 0 },
    stats: { home: emptyStats, away: emptyStats },
    phase: "play",
    penaltyTakerId: null,
    ply: 0,
    rng: hashString(`football-chess:${setup.seed}`),
    log: [],
    last: null,
  };
}

export function secondHalfKickoff(setup: MatchSetup): Side {
  return other(setup.kickoff);
}

/* ---- Drafting a rival ------------------------------------------------------ */

export type CardPools = {
  attackers: PlayerCard[];
  defenders: PlayerCard[];
  keepers: PlayerCard[];
};

/** Average rating of a squad, keeper included. */
export function squadRating(squad: readonly PieceCard[]): number {
  return Math.round(squad.reduce((sum, card) => sum + card.rating, 0) / Math.max(1, squad.length));
}

/**
 * A rival five drawn around a target rating, reusing the shared 5-a-side
 * drafter. `exclude` keeps the player's own cards out of the rival's side.
 */
export function draftSquad(
  targetRating: number,
  pools: CardPools,
  random: RandomSource,
  exclude: ReadonlySet<string> = new Set(),
): PieceCard[] {
  const level = Math.max(1, Math.round((targetRating - 66) / 2));
  const keep = (cards: PlayerCard[]) => cards.filter((card) => !exclude.has(card.id));
  const squad = generateShootoutOpponent(
    level,
    keep(pools.attackers),
    keep(pools.defenders),
    keep(pools.keepers),
    random,
  );
  return squad.shooters;
}

