"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { usePrefersReducedMotion } from "../../shared/state/use-reduced-motion";
import { currentTurn, step } from "../engine/match";
import { PitchDuelInputError, type MatchInput, type MatchState } from "../engine/types";

/** How long a reveal holds before the next turn, unless tapped away. */
const revealHold = 2400;
const reducedRevealHold = 1500;

function buzz(pattern: number | number[], enabled: boolean) {
  if (!enabled || typeof navigator === "undefined" || typeof navigator.vibrate !== "function") return;
  try {
    navigator.vibrate(pattern);
  } catch {
    // Some browsers throw when vibration is blocked; it is only garnish.
  }
}

/**
 * One match on screen: the pure engine state plus the reveal beat that sits
 * between a decision and the next turn. Goals and period ends wait for a tap.
 */
export function usePitchDuelMatch(initial: MatchState, haptics: boolean) {
  const [state, setState] = useState(initial);
  const [revealing, setRevealing] = useState(false);
  const reduced = usePrefersReducedMotion();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clear = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  };

  const dismiss = useCallback(() => {
    clear();
    setRevealing(false);
  }, []);

  const send = useCallback(
    (input: MatchInput) => {
      if (revealing && input.type !== "continue") return;
      let next: MatchState;
      try {
        next = step(state, input);
      } catch (error) {
        if (error instanceof PitchDuelInputError) return;
        throw error;
      }
      setState(next);
      if (input.type === "continue") setRevealing(false);
      if (input.type === "mindGame" || input.type === "continue") return;
      buzz(next.lastResolution?.goal ? [40, 30, 40] : 12, haptics);
      setRevealing(true);
    },
    [state, revealing, haptics],
  );

  // Auto-advance plain reveals; anything that changes the scoreline or the period waits for a tap.
  useEffect(() => {
    clear();
    if (!revealing) return;
    const needsTap = Boolean(state.lastResolution?.goal) || state.phase !== "choose";
    if (needsTap) return;
    timer.current = setTimeout(() => setRevealing(false), reduced ? reducedRevealHold : revealHold);
    return clear;
  }, [revealing, state, reduced]);

  return { state, turn: currentTurn(state), revealing, send, dismiss, reduced };
}
