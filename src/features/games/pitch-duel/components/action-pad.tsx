"use client";

import { useEffect, useRef, type CSSProperties } from "react";

import { attacks, defenses } from "../engine/actions";
import type { Turn } from "../engine/match";
import { blueprintOf, effectFor, tacticPlayable } from "../engine/tactics";
import type { MatchInput, TacticSlot } from "../engine/types";

import styles from "./match.module.css";

export type MoveOption = { id: string; label: string; hint?: string; tag: string; input: MatchInput };

/** The buttons for an open-play turn. Set pieces draw their own scene. */
export function moveOptions(turn: Turn): MoveOption[] {
  if (turn.kind === "attack")
    return turn.options.map((id) => ({ id, label: attacks[id].label, hint: attacks[id].hint, tag: attacks[id].family, input: { type: "attack", action: id } }));
  if (turn.kind === "defend")
    return turn.options.map((id) => ({
      id,
      label: defenses[id].label,
      hint: defenses[id].hint,
      tag: defenses[id].full.length ? `STOPS ${defenses[id].full.join("/")}` : "GAMBLE",
      input: { type: "defend", action: id },
    }));
  return [];
}

/** Number keys pick options 1–9; Enter or Space continues. */
export function useNumberKeys(count: number, pick: (index: number) => void, onContinue?: () => void) {
  const latest = useRef({ count, pick, onContinue });
  useEffect(() => {
    latest.current = { count, pick, onContinue };
  });
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      const target = event.target as HTMLElement | null;
      if (target && /INPUT|TEXTAREA|SELECT/.test(target.tagName)) return;
      if (target?.closest("[role='dialog']")) return;
      const { count: n, pick: choose, onContinue: next } = latest.current;
      if (next && (event.key === "Enter" || event.key === " ") && !(target instanceof HTMLButtonElement)) {
        event.preventDefault();
        next();
        return;
      }
      const index = Number(event.key) - 1;
      if (Number.isInteger(index) && index >= 0 && index < n) choose(index);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
}

/**
 * The thumb zone: the moves as violet pills (two to a row), the tactic tray,
 * or one CONTINUE pill between turns.
 */
export function ActionPad({
  turn,
  turnKey,
  tactics,
  tacticTitles,
  armed,
  onArm,
  onSend,
}: {
  turn: Turn;
  turnKey: string;
  tactics: TacticSlot[];
  tacticTitles: Record<string, string>;
  armed: string | null;
  onArm: (id: string | null) => void;
  onSend: (input: MatchInput) => void;
}) {
  const options = moveOptions(turn);
  const role = turn.kind === "attack" ? "attack" : turn.kind === "defend" ? "defend" : turn.kind === "setPiece" ? "setPiece" : null;
  const armedSlot = tactics.find((t) => t.id === armed && !t.used);
  const tacticId = armedSlot && role && tacticPlayable(armedSlot, role) ? armedSlot.id : undefined;

  const send = (input: MatchInput) => {
    if (input.type === "attack" || input.type === "defend") {
      onSend({ ...input, tacticId });
      onArm(null);
    } else onSend(input);
  };

  useNumberKeys(options.length, (i) => send(options[i].input));

  return (
    <div className={styles.pad}>
      <div key={turnKey} className={styles.moves} role="group" aria-label={turn.kind === "attack" ? "Your move" : "Your defence"} data-count={options.length}>
        {options.map((o, i) => (
          <button
            key={o.id}
            type="button"
            className={styles.move}
            style={{ "--i": i } as CSSProperties}
            onClick={() => send(o.input)}
            data-pitch-duel-option={o.id}
            title={o.hint}
          >
            <b>{o.label}</b>
            <small>{o.tag}</small>
            <kbd aria-hidden>{i + 1}</kbd>
          </button>
        ))}
      </div>
      {tactics.length ? (
        <TacticTray
          tactics={tactics}
          titles={tacticTitles}
          role={role}
          armed={armedSlot ? armedSlot.id : null}
          onArm={(id) => onArm(armed === id ? null : id)}
          onMindGame={(id) => onSend({ type: "mindGame", tacticId: id })}
        />
      ) : null}
    </div>
  );
}

/** The tactic cards as a chip row: tap to arm for the next pick; Mind Game plays at once. */
export function TacticTray({
  tactics,
  titles,
  role,
  armed,
  onArm,
  onMindGame,
}: {
  tactics: TacticSlot[];
  titles: Record<string, string>;
  role: "attack" | "defend" | "setPiece" | null;
  armed: string | null;
  onArm: (id: string) => void;
  onMindGame: (id: string) => void;
}) {
  return (
    <div className={styles.tactics} role="group" aria-label="Tactic cards, one use each">
      <span className={styles.tacticsLabel}>TACTICS</span>
      {tactics.map((t) => {
        const isMind = blueprintOf(t.id) === "act15";
        const can = !t.used && role !== null && tacticPlayable(t, role) && !(isMind && role === "setPiece");
        const summary = t.used ? "Used" : !can ? "Not now" : isMind ? "Reveal their pick" : effectFor(t).summary;
        return (
          <button
            key={t.id}
            type="button"
            className={styles.tactic}
            disabled={!can}
            aria-pressed={armed === t.id}
            data-used={t.used || undefined}
            onClick={() => (isMind ? onMindGame(t.id) : onArm(t.id))}
            title={summary}
            aria-label={`${titles[t.id] ?? "Tactic"}: ${summary}`}
          >
            {titles[t.id] ?? "TACTIC"}
          </button>
        );
      })}
      {armed ? <span className={styles.tacticsHint}>ARMED · plays with your next pick</span> : null}
    </div>
  );
}
