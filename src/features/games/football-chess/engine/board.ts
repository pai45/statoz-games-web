/**
 * Read-only queries over a match: who is where, who has the ball, and which
 * squares a Defender guards.
 */

import { cheb, COLS, inBounds, ROWS, sqIndex } from "./geometry";
import type { GameState, Piece, Side, Sq } from "./state";

/** On a square: an outfielder who is not in the sin bin. */
export function onBoard(piece: Piece): boolean {
  return piece.cls !== "keeper" && piece.offFor === 0;
}

export function pieceById(state: GameState, id: string): Piece {
  const piece = state.pieces.find((candidate) => candidate.id === id);
  if (piece === undefined) throw new Error(`No piece ${id}`);
  return piece;
}

export function carrierOf(state: GameState): Piece {
  return pieceById(state, state.carrierId);
}

export function possession(state: GameState): Side {
  return carrierOf(state).side;
}

export function keeperOf(state: GameState, side: Side): Piece {
  return pieceById(state, side === "home" ? "hk" : "ak");
}

export function outfield(state: GameState, side: Side): Piece[] {
  return state.pieces.filter((piece) => piece.side === side && onBoard(piece));
}

/** Can the piece act this ply (ignoring whose turn it is)? */
export function isRested(state: GameState, piece: Piece): boolean {
  return state.ply >= piece.restUntil;
}

/** A 35-cell lookup of the outfielders on the board. */
export type Occupancy = (Piece | null)[];

export function occupancy(pieces: readonly Piece[]): Occupancy {
  const grid: Occupancy = new Array(COLS * ROWS).fill(null);
  for (const piece of pieces) {
    if (onBoard(piece)) grid[sqIndex(piece.col, piece.row)] = piece;
  }
  return grid;
}

export function at(grid: Occupancy, col: number, row: number): Piece | null {
  return inBounds(col, row) ? grid[sqIndex(col, row)] : null;
}

export function isEmpty(grid: Occupancy, col: number, row: number): boolean {
  return inBounds(col, row) && grid[sqIndex(col, row)] === null;
}

/**
 * The Defenders of `bySide` guarding a square: on the board, on their feet,
 * and next to it (not standing on it).
 */
export function guardsOf(state: GameState, s: Sq, bySide: Side): Piece[] {
  return state.pieces.filter(
    (piece) =>
      piece.side === bySide &&
      piece.cls === "defender" &&
      onBoard(piece) &&
      state.ply >= piece.restUntil &&
      cheb(piece, s) === 1,
  );
}

export function isGuarded(state: GameState, s: Sq, bySide: Side): boolean {
  return guardsOf(state, s, bySide).length > 0;
}

/** The guard that would win the ball at a square: the higher rated, then by id. */
export function leadGuard(state: GameState, s: Sq, bySide: Side): Piece | null {
  const guards = guardsOf(state, s, bySide);
  guards.sort(
    (a, b) => b.card.rating - a.card.rating || a.id.localeCompare(b.id),
  );
  return guards[0] ?? null;
}

/** The squad index behind an id like `h2`; keepers are 4. */
export function squadIndex(piece: Piece): number {
  return piece.cls === "keeper" ? 4 : Number(piece.id.slice(1));
}
