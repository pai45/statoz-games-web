/**
 * Squares, lanes and zones on the 7×5 board.
 *
 * Column 0 (a) is next to the home goal, column 6 (g) next to the away goal.
 * Home attacks toward column 7, away toward column -1.
 */

import type { Side, Sq } from "./state";

export const COLS = 7;
export const ROWS = 5;
export const FILES = "abcdefg";
export const CENTRE: Sq = { col: 3, row: 2 };
export const GOAL_ROWS = [1, 2, 3] as const;

export const DIRS8: readonly (readonly [number, number])[] = [
  [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1],
];

export const KNIGHT: readonly (readonly [number, number])[] = [
  [1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, -1], [-2, 1], [-1, 2],
];

export function sq(col: number, row: number): Sq {
  return { col, row };
}

export function inBounds(col: number, row: number): boolean {
  return col >= 0 && col < COLS && row >= 0 && row < ROWS;
}

export function sameSq(a: Sq, b: Sq): boolean {
  return a.col === b.col && a.row === b.row;
}

export function sqIndex(col: number, row: number): number {
  return row * COLS + col;
}

/** Chebyshev distance: a diagonal step counts as one. */
export function cheb(a: Sq, b: Sq): number {
  return Math.max(Math.abs(a.col - b.col), Math.abs(a.row - b.row));
}

export function neighbors8(s: Sq): Sq[] {
  const out: Sq[] = [];
  for (const [dc, dr] of DIRS8) {
    if (inBounds(s.col + dc, s.row + dr)) out.push(sq(s.col + dc, s.row + dr));
  }
  return out;
}

/** Where a side's keeper stands: just off its own end of the grid. */
export function keeperCol(side: Side): number {
  return side === "home" ? -1 : COLS;
}

/** Columns between a square and the goal a side attacks (1 next to goal). */
export function goalDistance(side: Side, col: number): number {
  return side === "home" ? COLS - col : col + 1;
}

/** Away's formation squares are home's, reflected end to end. */
export function mirrorCol(col: number): number {
  return COLS - 1 - col;
}

/** The two columns and three middle rows in front of a side's own goal. */
export function inPenaltyArea(defending: Side, s: Sq): boolean {
  if (s.row < 1 || s.row > 3) return false;
  return defending === "home" ? s.col <= 1 : s.col >= COLS - 2;
}

/**
 * Squares strictly between two squares on a straight lane (row, column or
 * true diagonal), nearest first; null when they are not on a lane.
 */
export function laneBetween(a: Sq, b: Sq): Sq[] | null {
  const dc = b.col - a.col;
  const dr = b.row - a.row;
  if (dc === 0 && dr === 0) return null;
  if (dc !== 0 && dr !== 0 && Math.abs(dc) !== Math.abs(dr)) return null;
  const sc = Math.sign(dc);
  const sr = Math.sign(dr);
  const out: Sq[] = [];
  for (let c = a.col + sc, r = a.row + sr; c !== b.col || r !== b.row; c += sc, r += sr) {
    out.push(sq(c, r));
  }
  return out;
}

/* ---- Shot paths ----------------------------------------------------------- */

const pathCache = new Map<string, readonly Sq[]>();

/**
 * The squares a shot crosses, nearest first, from the centre of the shooter's
 * square to the middle of the target row on the goal line. A line that only
 * grazes a corner does not count as crossing a square.
 */
export function shotPath(from: Sq, side: Side, targetRow: number): readonly Sq[] {
  const key = `${side}:${from.col},${from.row}:${targetRow}`;
  const cached = pathCache.get(key);
  if (cached !== undefined) return cached;

  const x0 = from.col + 0.5;
  const y0 = from.row + 0.5;
  const x1 = side === "home" ? COLS : 0;
  const y1 = targetRow + 0.5;
  const steps = 240;
  const seen = new Set<number>();
  const out: Sq[] = [];
  for (let i = 1; i < steps; i += 1) {
    const t = i / steps;
    const x = x0 + (x1 - x0) * t;
    const y = y0 + (y1 - y0) * t;
    const col = Math.floor(x);
    const row = Math.floor(y);
    if (!inBounds(col, row) || (col === from.col && row === from.row)) continue;
    const fx = x - col;
    const fy = y - row;
    const nearX = fx < 0.08 || fx > 0.92;
    const nearY = fy < 0.08 || fy > 0.92;
    if (nearX && nearY) continue;
    const index = sqIndex(col, row);
    if (seen.has(index)) continue;
    seen.add(index);
    out.push(sq(col, row));
  }
  pathCache.set(key, out);
  return out;
}

export function sqName(s: Sq): string {
  return `${FILES[s.col] ?? "?"}${s.row + 1}`;
}

export function parseSq(name: string): Sq {
  const col = FILES.indexOf(name[0]);
  const row = Number(name.slice(1)) - 1;
  if (col < 0 || !Number.isInteger(row) || !inBounds(col, row)) {
    throw new Error(`Not a square: ${name}`);
  }
  return sq(col, row);
}
