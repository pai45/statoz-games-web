"use client";

import { useCallback, useEffect, useMemo, useReducer, useState } from "react";

import { botMove, botProfile, type Difficulty, type Personality } from "../engine/ai/bots";
import { createGame, step } from "../engine/game";
import { formatEntry } from "../engine/notation";
import { seededSource } from "../engine/rng";
import type { Action, GameState, MatchEvent, MatchSetup, OutcomeTag, Side } from "../engine/state";

/**
 * One match, driven for the screen.
 *
 * The reducer only ever calls the pure `step`, whose dice live in the match
 * state, so React running a reducer twice changes nothing. The opponent is
 * asked for its move outside the reducer, after the last move's beat has
 * played, and its answer is committed the same way the player's is.
 */

export type MoveLine = { ply: number; side: Side; text: string; tag: OutcomeTag; p: number };

type Store = {
  game: GameState;
  /** The position the last action was played from, for the goal replay beat. */
  before: GameState | null;
  moves: MoveLine[];
  selected: string | null;
  /** A risky action waiting for the player to confirm it. */
  pending: Action | null;
};

type Msg =
  | { type: "select"; id: string | null }
  | { type: "stage"; action: Action | null }
  | { type: "commit"; action: Action; by: Side };

function reducer(store: Store, msg: Msg): Store {
  switch (msg.type) {
    case "select":
      return { ...store, selected: msg.id, pending: null };
    case "stage":
      return { ...store, pending: msg.action };
    case "commit": {
      if (store.game.turn !== msg.by || store.game.phase === "fullTime") return store;
      let next: GameState;
      try {
        next = step(store.game, msg.action);
      } catch {
        return store;
      }
      const entry = next.log[next.log.length - 1];
      const line: MoveLine = {
        ply: next.log.length,
        side: entry.side,
        text: formatEntry(store.game, entry, next),
        tag: entry.tag,
        p: entry.p,
      };
      return { game: next, before: store.game, moves: [...store.moves, line], selected: null, pending: null };
    }
  }
}

/** How long the board holds after an action before play moves on, in ms. */
export function beatFor(event: MatchEvent | null): number {
  if (event === null) return 0;
  if (event.goalFor !== null) return 1900;
  if (event.fullTime) return 1300;
  if (event.halfTime) return 1800;
  if (event.penaltyAwarded || event.card !== "none") return 1400;
  if (event.passive) return 1200;
  if (event.tag === "saved" || event.tag === "blocked" || event.tag === "corner") return 900;
  return 420;
}

/** How long the opponent appears to think. */
const thinkMs = 520;

export type GameOptions = { difficulty: Difficulty; personality: Personality };

export function useGame(setup: MatchSetup, options: GameOptions) {
  const [store, dispatch] = useReducer(reducer, setup, (s) => ({
    game: createGame(s),
    before: null,
    moves: [],
    selected: null,
    pending: null,
  }));
  const { game } = store;
  const profile = useMemo(() => botProfile(options.difficulty, options.personality), [options.difficulty, options.personality]);
  // The opponent's own stream for breaking ties, separate from the match dice.
  const [decide] = useState(() => seededSource((setup.seed ^ 0x2545f491) >>> 0));

  const [settled, setSettled] = useState(0);
  const played = game.log.length;
  const busy = settled < played;

  useEffect(() => {
    if (settled >= played) return;
    const timer = window.setTimeout(() => setSettled(played), beatFor(game.last));
    return () => window.clearTimeout(timer);
  }, [played, settled, game.last]);

  const thinking = !busy && game.phase !== "fullTime" && game.turn === "away";

  useEffect(() => {
    if (!thinking) return;
    const timer = window.setTimeout(() => {
      const { action } = botMove(game, profile, decide);
      dispatch({ type: "commit", action, by: "away" });
    }, thinkMs);
    return () => window.clearTimeout(timer);
  }, [thinking, game, profile, decide]);

  const yourTurn = !busy && game.phase !== "fullTime" && game.turn === "home";

  const select = useCallback((id: string | null) => dispatch({ type: "select", id }), []);
  const stage = useCallback((action: Action | null) => dispatch({ type: "stage", action }), []);
  const play = useCallback((action: Action) => dispatch({ type: "commit", action, by: "home" }), []);

  return {
    game,
    before: store.before,
    moves: store.moves,
    selected: store.selected,
    pending: store.pending,
    busy,
    thinking,
    yourTurn,
    select,
    stage,
    play,
  };
}

export type GameController = ReturnType<typeof useGame>;
