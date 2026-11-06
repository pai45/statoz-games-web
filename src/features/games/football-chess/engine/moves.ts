/**
 * Legal actions for the side to move.
 */

import { at, carrierOf, isEmpty, isGuarded, occupancy, onBoard, pieceById, type Occupancy } from "./board";
import { classTraits } from "./classes";
import { cheb, DIRS8, goalDistance, GOAL_ROWS, KNIGHT, laneBetween, sq } from "./geometry";
import { slideMiddle, takeOnLanding } from "./odds";
import { other, type Action, type GameState, type Piece, type Sq } from "./state";

export function canAct(state: GameState, piece: Piece): boolean {
  if (state.phase !== "play" || piece.side !== state.turn) return false;
  if (state.ply < piece.restUntil) return false;
  if (piece.cls === "keeper") return piece.id === state.carrierId;
  return piece.offFor === 0;
}

/**
 * Teammates a carrier can pass to: on a straight lane with no opponent in it
 * (teammates let the ball through), or any straight lane for a Playmaker's
 * lofted ball. A keeper reaches anyone.
 */
export function passTargets(state: GameState, grid: Occupancy, passer: Piece): Piece[] {
  return state.pieces.filter((mate) => {
    if (mate.side !== passer.side || mate.id === passer.id || !onBoard(mate)) return false;
    if (passer.cls === "keeper") return true;
    const lane = laneBetween(passer, mate);
    if (lane === null) return false;
    return (
      passer.cls === "playmaker" ||
      lane.every((s) => {
        const piece = at(grid, s.col, s.row);
        return piece === null || piece.side === passer.side;
      })
    );
  });
}

function pushPieceActions(state: GameState, grid: Occupancy, piece: Piece, carrier: Piece, out: Action[]): void {
  const isCarrier = piece.id === carrier.id;
  const opponent = other(piece.side);

  if (piece.cls === "keeper") {
    if (!isCarrier) return;
    for (const mate of state.pieces) {
      if (mate.side === piece.side && onBoard(mate)) {
        out.push({ kind: "pass", pieceId: piece.id, targetId: mate.id });
      }
    }
    return;
  }

  // Moves. Runners go up to two squares in a straight line, but a Runner with
  // the ball stops when it steps into a guarded square.
  for (const [dc, dr] of DIRS8) {
    const c1 = piece.col + dc;
    const r1 = piece.row + dr;
    if (!isEmpty(grid, c1, r1)) continue;
    out.push({ kind: "move", pieceId: piece.id, to: sq(c1, r1) });
    if (piece.cls !== "runner") continue;
    if (isCarrier && isGuarded(state, sq(c1, r1), opponent)) continue;
    const c2 = c1 + dc;
    const r2 = r1 + dr;
    if (isEmpty(grid, c2, r2)) out.push({ kind: "move", pieceId: piece.id, to: sq(c2, r2) });
  }

  if (isCarrier) {
    if (piece.cls === "runner" && !state.skillSpent) {
      for (const [dc, dr] of KNIGHT) {
        const c = piece.col + dc;
        const r = piece.row + dr;
        if (isEmpty(grid, c, r) && !isGuarded(state, sq(c, r), opponent)) {
          out.push({ kind: "skill", pieceId: piece.id, to: sq(c, r) });
        }
      }
    }
    for (const mate of passTargets(state, grid, piece)) {
      out.push({ kind: "pass", pieceId: piece.id, targetId: mate.id });
    }
    if (goalDistance(piece.side, piece.col) <= classTraits[piece.cls].shootRange) {
      for (const target of GOAL_ROWS) out.push({ kind: "shoot", pieceId: piece.id, target });
    }
    for (const [dc, dr] of DIRS8) {
      const rival = at(grid, piece.col + dc, piece.row + dr);
      if (rival === null || rival.side === piece.side) continue;
      const landing = takeOnLanding(piece, rival);
      if (isEmpty(grid, landing.col, landing.row)) {
        out.push({ kind: "takeOn", pieceId: piece.id, defenderId: rival.id });
      }
    }
    return;
  }

  // Defending: tackle from next to the carrier, slide from two away in a line,
  // and never from behind — a carrier who has got past you is gone.
  if (carrier.side === piece.side || carrier.cls === "keeper") return;
  if (isBehind(piece, carrier)) return;
  const distance = cheb(piece, carrier);
  if (distance === 1 && state.ply >= piece.noTackleUntil) {
    out.push({ kind: "tackle", pieceId: piece.id });
  }
  const dc = carrier.col - piece.col;
  const dr = carrier.row - piece.row;
  const aligned = (dc === 0 || Math.abs(dc) === 2) && (dr === 0 || Math.abs(dr) === 2);
  if (distance === 2 && aligned) {
    const middle = slideMiddle(piece, carrier);
    if (isEmpty(grid, middle.col, middle.row)) out.push({ kind: "slide", pieceId: piece.id });
  }
}

/**
 * A defender is behind a carrier when it is nearer the carrier's own goal
 * (the carrier has already got past it). Level or goal-side is fine.
 */
export function isBehind(defender: Sq, carrier: Piece): boolean {
  return carrier.side === "home" ? defender.col < carrier.col : defender.col > carrier.col;
}

/** Every legal action for the side to move, in a stable order. */
export function legalActions(state: GameState): Action[] {
  if (state.phase === "fullTime") return [];
  if (state.phase === "penalty") {
    const taker = state.penaltyTakerId ?? state.carrierId;
    return GOAL_ROWS.map((target) => ({ kind: "shoot", pieceId: taker, target }));
  }
  const grid = occupancy(state.pieces);
  const carrier = carrierOf(state);
  const out: Action[] = [];
  for (const piece of state.pieces) {
    if (canAct(state, piece)) pushPieceActions(state, grid, piece, carrier, out);
  }
  if (out.length === 0) {
    const anyone = state.pieces.find((piece) => piece.side === state.turn);
    if (anyone !== undefined) out.push({ kind: "hold", pieceId: anyone.id });
  }
  return out;
}

export function actionKey(action: Action): string {
  switch (action.kind) {
    case "move":
    case "skill":
      return `${action.kind}:${action.pieceId}:${action.to.col},${action.to.row}`;
    case "pass":
      return `pass:${action.pieceId}:${action.targetId}`;
    case "shoot":
      return `shoot:${action.pieceId}:${action.target}`;
    case "takeOn":
      return `takeOn:${action.pieceId}:${action.defenderId}`;
    case "tackle":
    case "slide":
    case "hold":
      return `${action.kind}:${action.pieceId}`;
  }
}

export function isLegal(state: GameState, action: Action): boolean {
  const key = actionKey(action);
  return legalActions(state).some((candidate) => actionKey(candidate) === key);
}

/** The legal actions of one piece, for highlighting its targets. */
export function actionsOf(state: GameState, pieceId: string): Action[] {
  return legalActions(state).filter((action) => action.pieceId === pieceId);
}

/** Where an action points on the board, for tap targets and the arrow. */
export function actionTarget(state: GameState, action: Action): { col: number; row: number } {
  const actor = pieceById(state, action.pieceId);
  switch (action.kind) {
    case "move":
    case "skill":
      return action.to;
    case "pass":
      return pieceById(state, action.targetId);
    case "shoot":
      return { col: actor.side === "home" ? 7 : -1, row: action.target };
    case "takeOn":
      return pieceById(state, action.defenderId);
    case "tackle":
    case "slide":
      return carrierOf(state);
    case "hold":
      return actor;
  }
}

