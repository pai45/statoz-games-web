/**
 * Move notation, and a compact way to write a position as a diagram.
 *
 * Moves read like a chess move list: the class, the square it started on, a
 * symbol for the verb and where it went.
 *
 *   ST e3-f3     move            RN c2~d4    skill move
 *   PM c2>>f2    lofted pass     DF b2>d2    pass
 *   ST f3xG3     shot at row 3   RN d3^e3    take-on
 *   DF d4Te3     tackle          DF b2Sd2    slide
 *
 * `#` marks a goal and `+` a shot on, as `#` and `+` mark mate and check.
 */

import { carrierOf, pieceById } from "./board";
import { classOf, classTraits } from "./classes";
import { COLS, FILES, inBounds, parseSq, ROWS, sqName } from "./geometry";
import { hashString } from "./rng";
import { threatOf } from "./threats";
import {
  matchConfig,
  type Action,
  type GameState,
  type LogEntry,
  type MatchConfig,
  type Piece,
  type PieceCard,
  type PieceClass,
  type Side,
} from "./state";

function short(piece: Piece): string {
  return classTraits[piece.cls].short;
}

/** The notation for an action, read against the state before it is played. */
export function formatAction(state: GameState, action: Action): string {
  const actor = pieceById(state, action.pieceId);
  const from = actor.cls === "keeper" ? "" : sqName(actor);
  switch (action.kind) {
    case "move":
      return `${short(actor)} ${from}-${sqName(action.to)}`;
    case "skill":
      return `${short(actor)} ${from}~${sqName(action.to)}`;
    case "pass": {
      const to = sqName(pieceById(state, action.targetId));
      if (actor.cls === "keeper") return `GK>${to}`;
      return `${short(actor)} ${from}${actor.cls === "playmaker" ? ">>" : ">"}${to}`;
    }
    case "shoot":
      return `${short(actor)} ${from}xG${action.target + 1}`;
    case "takeOn":
      return `${short(actor)} ${from}^${sqName(pieceById(state, action.defenderId))}`;
    case "tackle":
      return `${short(actor)} ${from}T${sqName(carrierOf(state))}`;
    case "slide":
      return `${short(actor)} ${from}S${sqName(carrierOf(state))}`;
    case "hold":
      return `${short(actor)} ${from}=`;
  }
}

const tagSuffix: Partial<Record<LogEntry["tag"], string>> = {
  goal: "#",
  saved: " saved",
  blocked: " blocked",
  corner: " corner",
  intercepted: " cut out",
  lost: " lost",
  missed: " missed",
  foul: " foul",
};

/** A log entry as it reads in the move list, given the states either side. */
export function formatEntry(before: GameState, entry: LogEntry, after: GameState): string {
  let text = formatAction(before, entry.action) + (tagSuffix[entry.tag] ?? "");
  if (entry.tag !== "goal" && after.phase === "play" && threatOf(after, entry.side).on) text += "+";
  return text;
}

/* ---- Diagrams --------------------------------------------------------------- */

const letterClass: Record<string, PieceClass> = { s: "striker", r: "runner", p: "playmaker", d: "defender" };
const classPosition: Record<Exclude<PieceClass, "keeper">, string> = {
  striker: "ST",
  runner: "LW",
  playmaker: "CM",
  defender: "CB",
};

export type DiagramOptions = {
  /**
   * Five rows, top (row 5) first, seven characters each. `.` is empty;
   * `S R P D` are home's Striker, Runner, Playmaker and Defender, and
   * lower case are away's.
   */
  rows: readonly string[];
  /** The ball: a square name, or `hk` / `ak` for a keeper. */
  carrier: string;
  turn?: Side;
  /** Keeper rows, 1–3 (0-based, so 2 is the middle of the goal). */
  keepers?: { home?: number; away?: number };
  /** Ratings by square name; everyone else is 80. */
  ratings?: Record<string, number>;
  config?: Partial<MatchConfig>;
  seed?: number;
  attackClock?: number;
  actionsLeft?: number;
  skillSpent?: boolean;
};

function syntheticCard(side: Side, cls: PieceClass, index: number, rating: number): PieceCard {
  const position = cls === "keeper" ? "GK" : classPosition[cls];
  const label = `${side === "home" ? "H" : "A"}-${classTraits[cls].short}${index + 1}`;
  return {
    id: `diagram-${side}-${index}`,
    name: label,
    shortName: label,
    position,
    role: cls === "keeper" ? "goalkeeper" : cls === "defender" ? "defender" : "attacker",
    rating,
  };
}

/** Build a match state from a diagram — for lessons, puzzles and tests. */
export function positionFromDiagram(options: DiagramOptions): GameState {
  if (options.rows.length !== ROWS) throw new Error(`A diagram has ${ROWS} rows`);
  const config: MatchConfig = { ...matchConfig("standard"), ...options.config };
  const pieces: Piece[] = [];
  const counts = { home: 0, away: 0 };
  const squads: Record<Side, PieceCard[]> = { home: [], away: [] };

  options.rows.forEach((line, top) => {
    if (line.length !== COLS) throw new Error(`Diagram row "${line}" needs ${COLS} squares`);
    const row = ROWS - 1 - top;
    [...line].forEach((ch, col) => {
      if (ch === ".") return;
      const cls = letterClass[ch.toLowerCase()];
      if (cls === undefined || !inBounds(col, row)) throw new Error(`Unknown piece "${ch}"`);
      const side: Side = ch === ch.toUpperCase() ? "home" : "away";
      const index = counts[side];
      if (index > 3) throw new Error(`${side} has more than four outfielders`);
      counts[side] += 1;
      const name = `${FILES[col]}${row + 1}`;
      const card = syntheticCard(side, cls, index, options.ratings?.[name] ?? 80);
      squads[side].push(card);
      pieces.push({
        id: `${side === "home" ? "h" : "a"}${index}`,
        side,
        cls: classOf(card),
        card,
        col,
        row,
        homeCol: col,
        homeRow: row,
        yellow: false,
        offFor: 0,
        restUntil: 0,
        noTackleUntil: 0,
      });
    });
  });

  for (const side of ["home", "away"] as const) {
    const card = syntheticCard(side, "keeper", 4, options.ratings?.[side === "home" ? "hk" : "ak"] ?? 80);
    squads[side].push(card);
    const row = options.keepers?.[side] ?? 2;
    pieces.push({
      id: side === "home" ? "hk" : "ak",
      side,
      cls: "keeper",
      card,
      col: side === "home" ? -1 : COLS,
      row,
      homeCol: side === "home" ? -1 : COLS,
      homeRow: 2,
      yellow: false,
      offFor: 0,
      restUntil: 0,
      noTackleUntil: 0,
    });
  }

  let carrierId: string;
  if (options.carrier === "hk" || options.carrier === "ak") {
    carrierId = options.carrier;
  } else {
    const s = parseSq(options.carrier);
    const found = pieces.find((piece) => piece.cls !== "keeper" && piece.col === s.col && piece.row === s.row);
    if (found === undefined) throw new Error(`No piece on ${options.carrier} to carry the ball`);
    carrierId = found.id;
  }
  const carrierSide = pieces.find((piece) => piece.id === carrierId)?.side ?? "home";
  const seed = options.seed ?? 1;
  const actions = options.actionsLeft ?? config.actionsPerHalf;
  const emptyStats = { shots: 0, passives: 0, fouls: 0, cards: 0 };

  return {
    setup: {
      seed,
      home: { name: "Home", formation: "box", squad: squads.home },
      away: { name: "Away", formation: "box", squad: squads.away },
      config,
      kickoff: options.turn ?? carrierSide,
    },
    pieces,
    carrierId,
    turn: options.turn ?? carrierSide,
    half: 1,
    actionsLeft: { home: actions, away: actions },
    attackClock: options.attackClock ?? config.attackClock,
    skillSpent: options.skillSpent ?? false,
    score: { home: 0, away: 0 },
    stats: { home: emptyStats, away: emptyStats },
    phase: "play",
    penaltyTakerId: null,
    ply: 0,
    rng: hashString(`football-chess:${seed}`),
    log: [],
    last: null,
  };
}
