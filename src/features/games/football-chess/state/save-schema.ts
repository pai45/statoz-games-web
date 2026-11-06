/**
 * The Football Chess v2 save: pure data and the rules for changing it.
 *
 * No React and no storage here, so migration and settlement are testable in
 * Node. `progress.ts` owns reading and writing the browser copy.
 */

import { difficulties, personalities, type Difficulty, type Personality } from "../engine/ai/bots";
import { formations, matchLengths, type Formation, type MatchLength } from "../engine/state";

export const saveKey = "statoz.games.web.football-chess.v2";
/** The v1 record. Read once to migrate, and never deleted. */
export const legacyKey = "statoz.games.web.footballchess.v1";

export const historyLimit = 30;
/** Settled match ids kept to refuse a second payout. */
export const settledLimit = 60;

export type TutorialStatus = "new" | "inProgress" | "done" | "skipped";

export type RecordStats = {
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  currentStreak: number;
  bestStreak: number;
};

export type MatchMode = "quick";

export type ResultEntry = {
  id: string;
  /** ISO time the match was settled. */
  at: string;
  mode: MatchMode;
  opponent: string;
  difficulty: Difficulty;
  personality: Personality;
  scored: number;
  conceded: number;
  result: "W" | "D" | "L";
};

export type Settings = {
  sound: boolean;
  /** The win-chance bar beside the board. */
  evalBar: boolean;
};

export type QuickSetup = {
  difficulty: Difficulty;
  formation: Formation;
  length: MatchLength;
};

export type FootballChessSave = {
  version: 2;
  /** Bumped on every write, so a stale tab can tell. */
  revision: number;
  settings: Settings;
  tutorial: TutorialStatus;
  record: RecordStats;
  byMode: Record<MatchMode, RecordStats>;
  quick: QuickSetup;
  history: ResultEntry[];
  settled: string[];
  migratedFrom: 1 | null;
};

export const emptyRecord: RecordStats = Object.freeze({
  played: 0,
  wins: 0,
  draws: 0,
  losses: 0,
  goalsFor: 0,
  goalsAgainst: 0,
  currentStreak: 0,
  bestStreak: 0,
});

export const emptySave: FootballChessSave = Object.freeze({
  version: 2,
  revision: 0,
  settings: { sound: true, evalBar: true },
  tutorial: "new",
  record: emptyRecord,
  byMode: { quick: emptyRecord },
  quick: { difficulty: "medium", formation: "box", length: "standard" },
  history: [],
  settled: [],
  migratedFrom: null,
}) as FootballChessSave;

/* ---- Cleaning untrusted input ---------------------------------------------- */

function count(value: unknown, max = 1_000_000): number {
  return typeof value === "number" && Number.isFinite(value) && value > 0 ? Math.min(max, Math.floor(value)) : 0;
}

function oneOf<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  return typeof value === "string" && (allowed as readonly string[]).includes(value) ? (value as T) : fallback;
}

function record(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

function text(value: unknown, max: number): string {
  return typeof value === "string" ? value.slice(0, max) : "";
}

/**
 * Counts that do not add up are rebuilt from wins, draws and losses rather
 * than trusted: `played` is always their sum.
 */
export function sanitizeRecord(value: unknown): RecordStats {
  const raw = record(value);
  const wins = count(raw.wins);
  const draws = count(raw.draws);
  const losses = count(raw.losses);
  const played = wins + draws + losses;
  const bestStreak = Math.min(count(raw.bestStreak), wins);
  return {
    played,
    wins,
    draws,
    losses,
    goalsFor: count(raw.goalsFor),
    goalsAgainst: count(raw.goalsAgainst),
    currentStreak: Math.min(count(raw.currentStreak), bestStreak),
    bestStreak,
  };
}

function sanitizeEntry(value: unknown): ResultEntry | null {
  const raw = record(value);
  const id = text(raw.id, 80);
  if (!id) return null;
  const scored = count(raw.scored, 99);
  const conceded = count(raw.conceded, 99);
  return {
    id,
    at: text(raw.at, 40),
    mode: "quick",
    opponent: text(raw.opponent, 40),
    difficulty: oneOf(raw.difficulty, difficulties, "medium"),
    personality: oneOf(raw.personality, personalities, "balanced"),
    scored,
    conceded,
    result: scored > conceded ? "W" : scored < conceded ? "L" : "D",
  };
}

export function sanitizeSave(value: unknown): FootballChessSave {
  const raw = record(value);
  if (raw.version !== 2) return emptySave;
  const settings = record(raw.settings);
  const quick = record(raw.quick);
  const byMode = record(raw.byMode);
  const history = Array.isArray(raw.history)
    ? raw.history.map(sanitizeEntry).filter((entry): entry is ResultEntry => entry !== null).slice(0, historyLimit)
    : [];
  const settled = Array.isArray(raw.settled)
    ? raw.settled.filter((id): id is string => typeof id === "string" && id.length <= 80).slice(-settledLimit)
    : [];
  return {
    version: 2,
    revision: count(raw.revision),
    settings: {
      sound: typeof settings.sound === "boolean" ? settings.sound : true,
      evalBar: typeof settings.evalBar === "boolean" ? settings.evalBar : true,
    },
    tutorial: oneOf(raw.tutorial, ["new", "inProgress", "done", "skipped"] as const, "new"),
    record: sanitizeRecord(raw.record),
    byMode: { quick: sanitizeRecord(byMode.quick) },
    quick: {
      difficulty: oneOf(quick.difficulty, difficulties, "medium"),
      formation: oneOf(quick.formation, formations, "box"),
      length: oneOf(quick.length, Object.keys(matchLengths) as MatchLength[], "standard"),
    },
    history,
    settled,
    migratedFrom: raw.migratedFrom === 1 ? 1 : null,
  };
}

/* ---- v1 ---------------------------------------------------------------------- */

/**
 * Carries the v1 record over: results and streaks, and the formation (v1 used
 * the same four ids). Goals were never stored in v1, so they start at zero.
 * A v1 player already knows the game, so the tutorial counts as skipped.
 */
export function migrateV1(raw: string | null): FootballChessSave {
  if (raw === null || raw === "") return emptySave;
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return emptySave;
  }
  const v1 = record(parsed);
  const carried = sanitizeRecord(v1);
  if (carried.played === 0 && v1.formation === undefined) return emptySave;
  return {
    ...emptySave,
    tutorial: "skipped",
    record: carried,
    byMode: { quick: carried },
    quick: { ...emptySave.quick, formation: oneOf(v1.formation, formations, "box") },
    migratedFrom: 1,
  };
}

/* ---- Settling a match ---------------------------------------------------------- */

export function coinsFor(result: ResultEntry["result"]): number {
  return result === "W" ? 50 : result === "D" ? 20 : 10;
}

function addResult(stats: RecordStats, scored: number, conceded: number): RecordStats {
  const won = scored > conceded;
  const drew = scored === conceded;
  const currentStreak = won ? stats.currentStreak + 1 : 0;
  return {
    played: stats.played + 1,
    wins: stats.wins + (won ? 1 : 0),
    draws: stats.draws + (drew ? 1 : 0),
    losses: stats.losses + (!won && !drew ? 1 : 0),
    goalsFor: stats.goalsFor + scored,
    goalsAgainst: stats.goalsAgainst + conceded,
    currentStreak,
    bestStreak: Math.max(stats.bestStreak, currentStreak),
  };
}

export type Settlement = { save: FootballChessSave; entry: ResultEntry; duplicate: boolean };

/** Banks one finished match. A match id already settled changes nothing. */
export function applyResult(save: FootballChessSave, entry: Omit<ResultEntry, "result">): Settlement {
  const full = sanitizeEntry({ ...entry });
  if (full === null) throw new Error("A result needs an id");
  if (save.settled.includes(full.id)) return { save, entry: full, duplicate: true };
  return {
    save: {
      ...save,
      revision: save.revision + 1,
      record: addResult(save.record, full.scored, full.conceded),
      byMode: { ...save.byMode, [full.mode]: addResult(save.byMode[full.mode], full.scored, full.conceded) },
      history: [full, ...save.history].slice(0, historyLimit),
      settled: [...save.settled, full.id].slice(-settledLimit),
    },
    entry: full,
    duplicate: false,
  };
}

export function winRate(stats: RecordStats): string {
  return stats.played === 0 ? "—" : `${Math.round((stats.wins / stats.played) * 100)}%`;
}
