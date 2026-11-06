/**
 * What an action can lead to: one list of outcomes, each with its probability
 * and the full match state that follows.
 *
 * This is the only place the rules turn into consequences. Playing an action
 * draws one outcome from this list, and the AI reads the same list, so the
 * search can never disagree with the game about what a move does.
 */

import { at, carrierOf, keeperOf, occupancy, onBoard, pieceById, squadIndex } from "./board";
import { cheb, COLS, inPenaltyArea, sq } from "./geometry";
import {
  cornerShare,
  foulChance,
  passOdds,
  penaltyOdds,
  shotOdds,
  sinBinActions,
  slideMiddle,
  slideOdds,
  tackleOdds,
  takeOnLanding,
  takeOnOdds,
} from "./odds";
import { kickoffPieces, nearestFreeSquare, secondHalfKickoff } from "./setup";
import {
  clamp,
  cornerAttackClock,
  other,
  type Action,
  type CardShown,
  type GameState,
  type OutcomeTag,
  type Phase,
  type Piece,
  type Side,
  type SideStats,
  type Sq,
} from "./state";

export type Outcome = { p: number; tag: OutcomeTag; state: GameState };

type Raw = {
  p: number;
  tag: OutcomeTag;
  pieces: readonly Piece[];
  carrierId: string;
  to: Sq;
  shot?: boolean;
  goalFor?: Side;
  corner?: boolean;
  penalty?: boolean;
  foul?: boolean;
  card?: CardShown;
  sentOffId?: string;
  skillUsed?: boolean;
};

function place(
  pieces: readonly Piece[],
  id: string,
  to: Sq,
  patch: Partial<Piece> = {},
): Piece[] {
  return pieces.map((piece) =>
    piece.id === id ? { ...piece, ...patch, col: to.col, row: to.row } : piece,
  );
}

function patchPiece(pieces: readonly Piece[], id: string, patch: Partial<Piece>): Piece[] {
  return pieces.map((piece) => (piece.id === id ? { ...piece, ...patch } : piece));
}

function goalMouth(side: Side, target: number): Sq {
  return { col: side === "home" ? COLS : -1, row: target };
}

/** A blocked shot that goes out: the attackers restart from the near corner. */
function cornerRestart(state: GameState, shooter: Piece): { pieces: Piece[]; carrierId: string; at: Sq } {
  const corner = sq(shooter.side === "home" ? COLS - 1 : 0, shooter.row <= 2 ? 0 : 4);
  const grid = occupancy(state.pieces);
  const occupant = at(grid, corner.col, corner.row);
  if (occupant !== null && occupant.side === shooter.side) {
    return { pieces: [...state.pieces], carrierId: occupant.id, at: corner };
  }
  const spot = occupant === null ? corner : nearestFreeSquare(state.pieces, corner);
  const taker = state.pieces
    .filter((piece) => piece.side === shooter.side && onBoard(piece))
    .sort((a, b) => cheb(a, spot) - cheb(b, spot) || squadIndex(a) - squadIndex(b))[0];
  return { pieces: place(state.pieces, taker.id, spot), carrierId: taker.id, at: spot };
}

function rawOutcomes(state: GameState, action: Action): Raw[] {
  const actor = pieceById(state, action.pieceId);
  const pieces = state.pieces;
  const carrierId = state.carrierId;

  switch (action.kind) {
    case "hold":
      return [{ p: 1, tag: "moved", pieces, carrierId, to: actor }];

    case "move":
      return [{ p: 1, tag: "moved", pieces: place(pieces, actor.id, action.to), carrierId, to: action.to }];

    case "skill":
      return [
        { p: 1, tag: "moved", pieces: place(pieces, actor.id, action.to), carrierId, to: action.to, skillUsed: true },
      ];

    case "pass": {
      const receiver = pieceById(state, action.targetId);
      const odds = passOdds(state, actor, receiver);
      const done: Raw = { p: odds.success, tag: "passed", pieces, carrierId: receiver.id, to: receiver };
      if (odds.interceptor === null || odds.success >= 1) return [{ ...done, p: 1 }];
      return [
        done,
        { p: 1 - odds.success, tag: "intercepted", pieces, carrierId: odds.interceptor.id, to: odds.interceptor },
      ];
    }

    case "shoot": {
      const keeper = keeperOf(state, other(actor.side));
      const mouth = goalMouth(actor.side, action.target);
      if (state.phase === "penalty") {
        const odds = penaltyOdds(state, actor);
        return [
          { p: odds.goal, tag: "goal", pieces, carrierId, to: mouth, shot: true, goalFor: actor.side },
          { p: 1 - odds.goal, tag: "saved", pieces, carrierId: keeper.id, to: keeper, shot: true },
        ];
      }
      const odds = shotOdds(state, actor, action.target);
      const out: Raw[] = [
        { p: odds.goal, tag: "goal", pieces, carrierId, to: mouth, shot: true, goalFor: actor.side },
        { p: odds.saved, tag: "saved", pieces, carrierId: keeper.id, to: keeper, shot: true },
      ];
      const blocker = odds.blockers[0];
      if (blocker !== undefined && odds.blocked > 0) {
        const corner = cornerRestart(state, actor);
        out.push(
          { p: odds.blocked * (1 - cornerShare), tag: "blocked", pieces, carrierId: blocker.id, to: blocker, shot: true },
          {
            p: odds.blocked * cornerShare,
            tag: "corner",
            pieces: corner.pieces,
            carrierId: corner.carrierId,
            to: corner.at,
            shot: true,
            corner: true,
          },
        );
      }
      return out.filter((raw) => raw.p > 0);
    }

    case "takeOn": {
      const defender = pieceById(state, action.defenderId);
      const odds = takeOnOdds(state, actor, defender);
      const landing = takeOnLanding(actor, defender);
      return [
        { p: odds.win, tag: "beat", pieces: place(pieces, actor.id, landing), carrierId, to: landing },
        { p: 1 - odds.win, tag: "lost", pieces, carrierId: defender.id, to: defender },
      ];
    }

    case "tackle": {
      const carrier = carrierOf(state);
      const odds = tackleOdds(state, actor, carrier);
      return [
        { p: odds.win, tag: "won", pieces, carrierId: actor.id, to: carrier },
        {
          p: 1 - odds.win,
          tag: "missed",
          pieces: patchPiece(pieces, actor.id, { noTackleUntil: state.ply + 3, restUntil: state.ply + 3 }),
          carrierId,
          to: carrier,
        },
      ];
    }

    case "slide": {
      const carrier = carrierOf(state);
      const odds = slideOdds(state, actor, carrier);
      const middle = slideMiddle(actor, carrier);
      const grounded = place(pieces, actor.id, middle, { restUntil: state.ply + 3 });
      const red = actor.yellow;
      const booked = patchPiece(grounded, actor.id, red ? { yellow: false, offFor: sinBinActions } : { yellow: true });
      const miss = 1 - odds.win;
      return [
        { p: odds.win, tag: "won", pieces: place(pieces, actor.id, middle), carrierId: actor.id, to: carrier },
        { p: miss * (1 - foulChance), tag: "missed", pieces: grounded, carrierId, to: carrier },
        {
          p: miss * foulChance,
          tag: "foul",
          pieces: booked,
          carrierId,
          to: carrier,
          foul: true,
          card: red ? "red" : "yellow",
          sentOffId: red ? actor.id : undefined,
          penalty: inPenaltyArea(actor.side, carrier),
        },
      ];
    }
  }
}

/** Sin-bin countdown for the side that just acted, bringing pieces back on. */
function serveSinBin(pieces: readonly Piece[], side: Side, justSentOff: string | undefined): Piece[] {
  let out = [...pieces];
  for (const piece of pieces) {
    if (piece.side !== side || piece.offFor === 0 || piece.id === justSentOff) continue;
    const left = piece.offFor - 1;
    if (left > 0) {
      out = patchPiece(out, piece.id, { offFor: left });
    } else {
      const spot = nearestFreeSquare(out, { col: piece.homeCol, row: piece.homeRow });
      out = place(out, piece.id, spot, { offFor: 0 });
    }
  }
  return out;
}

/** After each attacking action both keepers take one step toward the ball's row. */
function stepKeepers(pieces: readonly Piece[], carrierId: string): Piece[] {
  const carrier = pieces.find((piece) => piece.id === carrierId);
  if (carrier === undefined) return [...pieces];
  const target = clamp(carrier.row, 1, 3);
  return pieces.map((piece) =>
    piece.cls === "keeper" && piece.id !== carrierId
      ? { ...piece, row: piece.row + Math.sign(target - piece.row) }
      : piece,
  );
}

/** Passive play: the nearest opponent to the carrier is given the ball. */
function passiveTurnover(pieces: readonly Piece[], carrierId: string): string {
  const carrier = pieces.find((piece) => piece.id === carrierId) as Piece;
  const rivals = pieces
    .filter((piece) => piece.side !== carrier.side && onBoard(piece))
    .sort((a, b) => cheb(a, carrier) - cheb(b, carrier) || squadIndex(a) - squadIndex(b));
  return rivals[0]?.id ?? (carrier.side === "home" ? "ak" : "hk");
}

function addStats(
  stats: GameState["stats"],
  side: Side,
  patch: Partial<SideStats>,
): GameState["stats"] {
  const current = stats[side];
  return {
    ...stats,
    [side]: {
      shots: current.shots + (patch.shots ?? 0),
      passives: current.passives + (patch.passives ?? 0),
      fouls: current.fouls + (patch.fouls ?? 0),
      cards: current.cards + (patch.cards ?? 0),
    },
  };
}

function finish(state: GameState, action: Action, raw: Raw): GameState {
  const config = state.setup.config;
  const actor = pieceById(state, action.pieceId);
  const side = actor.side;
  const before = carrierOf(state).side;
  const penaltyKick = state.phase === "penalty";

  let pieces: readonly Piece[] = serveSinBin(raw.pieces, side, raw.sentOffId);
  let carrierId = raw.carrierId;
  let attackClock = state.attackClock;
  let skillSpent = raw.skillUsed === true ? true : state.skillSpent;
  let score = state.score;
  let stats = state.stats;
  let phase: Phase = "play";
  let penaltyTakerId: string | null = null;
  let passive = false;
  let halfTime = false;
  let fullTime = false;
  let half = state.half;
  let turn: Side = other(side);
  let kickoff: Side | null = null;
  let actionsLeft = penaltyKick
    ? state.actionsLeft
    : { ...state.actionsLeft, [side]: Math.max(0, state.actionsLeft[side] - 1) };

  if (raw.shot === true) stats = addStats(stats, side, { shots: 1 });
  if (raw.foul === true) stats = addStats(stats, side, { fouls: 1, cards: raw.card === "none" ? 0 : 1 });

  if (raw.goalFor !== undefined) {
    score = { ...score, [raw.goalFor]: score[raw.goalFor] + 1 };
    kickoff = other(raw.goalFor);
  } else {
    const after = pieces.find((piece) => piece.id === carrierId)?.side ?? before;
    if (after !== before) {
      attackClock = config.attackClock;
      skillSpent = false;
    } else if (raw.shot === true) {
      attackClock = raw.corner === true ? Math.min(config.attackClock, cornerAttackClock) : config.attackClock;
      skillSpent = false;
    } else if (side === before && config.attackClock > 0) {
      attackClock -= 1;
      if (attackClock <= 0) {
        carrierId = passiveTurnover(pieces, carrierId);
        passive = true;
        attackClock = config.attackClock;
        skillSpent = false;
        stats = addStats(stats, side, { passives: 1 });
      }
    }
    if (raw.penalty === true) {
      phase = "penalty";
      penaltyTakerId = carrierId;
    }
    if (side === before && !passive) pieces = stepKeepers(pieces, carrierId);
  }

  if (phase !== "penalty" && actionsLeft.home <= 0 && actionsLeft.away <= 0) {
    if (half === 1) {
      half = 2;
      halfTime = true;
      kickoff = secondHalfKickoff(state.setup);
      actionsLeft = { home: config.actionsPerHalf, away: config.actionsPerHalf };
    } else {
      phase = "fullTime";
      fullTime = true;
      kickoff = null;
    }
  }

  if (kickoff !== null) {
    const restart = kickoffPieces(pieces, kickoff);
    pieces = restart.pieces;
    carrierId = restart.carrierId;
    turn = kickoff;
    attackClock = config.attackClock;
    skillSpent = false;
  }

  // A penalty can leave one side with an action the other no longer has.
  if (phase === "play" && actionsLeft[turn] <= 0 && actionsLeft[other(turn)] > 0) turn = other(turn);

  return {
    ...state,
    pieces,
    carrierId,
    turn,
    half,
    actionsLeft,
    attackClock,
    skillSpent,
    score,
    stats,
    phase,
    penaltyTakerId,
    ply: state.ply + 1,
    last: {
      side,
      actorId: actor.id,
      action,
      tag: raw.tag,
      p: raw.p,
      from: { col: actor.col, row: actor.row },
      to: raw.to,
      card: raw.card ?? "none",
      penaltyAwarded: phase === "penalty",
      penaltyKick,
      passive,
      goalFor: raw.goalFor ?? null,
      halfTime,
      fullTime,
    },
  };
}

/**
 * Every outcome of a (legal) action with its probability, which sum to 1.
 * The returned states leave `rng` and `log` untouched; `step` sets those.
 */
export function outcomes(state: GameState, action: Action): Outcome[] {
  return rawOutcomes(state, action).map((raw) => ({
    p: raw.p,
    tag: raw.tag,
    state: finish(state, action, raw),
  }));
}
