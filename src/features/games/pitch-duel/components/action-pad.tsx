"use client";

import { useEffect, useState, type CSSProperties } from "react";

import { GoalMouthStructure, accentVar } from "@/design-system";

import { attacks, defenses } from "../engine/actions";
import type { Turn } from "../engine/match";
import { defenderOptions, takerOptions } from "../engine/set-pieces";
import { blueprintOf, effectFor, tacticPlayable } from "../engine/tactics";
import type { Family, MatchInput, SetPieceOption, TacticSlot } from "../engine/types";

import styles from "./match.module.css";

const familyTone: Record<Family, string> = {
  PASS: accentVar("cyan"),
  CARRY: accentVar("lime"),
  THROUGH: accentVar("violet"),
  WIDE: accentVar("gold"),
  SHOT: accentVar("orange"),
};

const defenseTone = accentVar("violet");

export type TacticInfo = { id: string; title: string };

export function ActionPad({
  turn,
  tactics,
  tacticTitles,
  disabled,
  continueLabel,
  onSend,
}: {
  turn: Turn;
  tactics: TacticSlot[];
  tacticTitles: Record<string, string>;
  disabled: boolean;
  continueLabel: string;
  onSend: (input: MatchInput) => void;
}) {
  const [armed, setArmed] = useState<string | null>(null);
  const role = turn.kind === "attack" ? "attack" : turn.kind === "defend" ? "defend" : turn.kind === "setPiece" ? "setPiece" : null;
  const armedSlot = tactics.find((t) => t.id === armed && !t.used);
  const tacticId = armedSlot && role && tacticPlayable(armedSlot, role) ? armedSlot.id : undefined;

  const send = (input: MatchInput) => {
    if (disabled) return;
    if (input.type === "attack" || input.type === "defend" || input.type === "setPiece") {
      onSend({ ...input, tacticId });
      setArmed(null);
    } else onSend(input);
  };

  // Number keys pick options; Enter continues.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (disabled || event.altKey || event.ctrlKey || event.metaKey) return;
      const target = event.target as HTMLElement | null;
      if (target && /INPUT|TEXTAREA|SELECT/.test(target.tagName)) return;
      const n = Number(event.key);
      if (turn.kind === "continue" && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        onSend({ type: "continue" });
        return;
      }
      if (!Number.isInteger(n) || n < 1) return;
      if (turn.kind === "attack" && turn.options[n - 1]) send({ type: "attack", action: turn.options[n - 1] });
      if (turn.kind === "defend" && turn.options[n - 1]) send({ type: "defend", action: turn.options[n - 1] });
      if (turn.kind === "setPiece" && turn.options[n - 1]) send({ type: "setPiece", option: turn.options[n - 1] });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (turn.kind === "over" || turn.kind === "continue") {
    return (
      <div className={styles.pad}>
        <button type="button" className={`${styles.plate} ${styles.continue}`} onClick={() => onSend({ type: "continue" })} disabled={disabled}>
          {continueLabel}
        </button>
      </div>
    );
  }

  return (
    <div className={styles.pad}>
      {turn.kind === "setPiece" && turn.setPiece.kind === "penalty" ? (
        <PenaltyGoal turn={turn} disabled={disabled} onPick={(option) => send({ type: "setPiece", option })} />
      ) : (
        <div className={styles.options} style={{ "--count": turn.options.length } as CSSProperties} role="group" aria-label="Your options">
          {turn.kind === "attack" &&
            turn.options.map((id, i) => (
              <button
                key={id}
                type="button"
                className={`${styles.plate} ${styles.option}`}
                style={{ "--tone": familyTone[attacks[id].family] } as CSSProperties}
                disabled={disabled}
                onClick={() => send({ type: "attack", action: id })}
                data-pitch-duel-option={id}
              >
                <span className={styles.optionKey}>{i + 1} · {attacks[id].family}</span>
                <b>{attacks[id].label}</b>
                <small>{attacks[id].hint}</small>
              </button>
            ))}
          {turn.kind === "defend" &&
            turn.options.map((id, i) => (
              <button
                key={id}
                type="button"
                className={`${styles.plate} ${styles.option}`}
                style={{ "--tone": defenseTone } as CSSProperties}
                disabled={disabled}
                onClick={() => send({ type: "defend", action: id })}
                data-pitch-duel-option={id}
              >
                <span className={styles.optionKey}>{i + 1} · {defenses[id].full.length ? `STOPS ${defenses[id].full.join("/")}` : "GAMBLE"}</span>
                <b>{defenses[id].label}</b>
                <small>{defenses[id].hint}</small>
              </button>
            ))}
          {turn.kind === "setPiece" &&
            (turn.role === "taker" ? takerOptions : defenderOptions)[turn.setPiece.kind].map((o, i) => (
              <button
                key={o.id}
                type="button"
                className={`${styles.plate} ${styles.option}`}
                style={{ "--tone": turn.role === "taker" ? accentVar("orange") : defenseTone } as CSSProperties}
                disabled={disabled}
                onClick={() => send({ type: "setPiece", option: o.id as SetPieceOption })}
                data-pitch-duel-option={o.id}
              >
                <span className={styles.optionKey}>{i + 1}</span>
                <b>{o.label}</b>
                {o.hint ? <small>{o.hint}</small> : null}
              </button>
            ))}
        </div>
      )}

      {tactics.length > 0 ? (
        <div className={styles.tactics} role="group" aria-label="Tactic cards">
          <span className={styles.tacticsLabel}>TACTICS</span>
          {tactics.map((t) => {
            const isMind = blueprintOf(t.id) === "act15";
            const playable = !t.used && role !== null && tacticPlayable(t, role) && !(isMind && role === "setPiece");
            return (
              <button
                key={t.id}
                type="button"
                className={`${styles.plate} ${styles.tactic}`}
                disabled={!playable || disabled}
                aria-pressed={armed === t.id}
                data-used={t.used}
                title={t.used ? "Used this match" : effectFor(t).summary}
                onClick={() => {
                  if (isMind) onSend({ type: "mindGame", tacticId: t.id });
                  else setArmed((current) => (current === t.id ? null : t.id));
                }}
              >
                {tacticTitles[t.id] ?? "TACTIC"}
                {isMind ? " · REVEAL" : armed === t.id ? " · ARMED" : ""}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

const penaltyLayout: { id: string; area: string }[] = [
  { id: "TL", area: "1 / 1" },
  { id: "C", area: "1 / 2 / 3 / 3" },
  { id: "TR", area: "1 / 3" },
  { id: "BL", area: "2 / 1" },
  { id: "BR", area: "2 / 3" },
];

const diveLayout: { id: string; area: string }[] = [
  { id: "L", area: "1 / 1 / 3 / 2" },
  { id: "C", area: "1 / 2 / 3 / 3" },
  { id: "R", area: "1 / 3 / 3 / 4" },
];

function PenaltyGoal({ turn, disabled, onPick }: { turn: Extract<Turn, { kind: "setPiece" }>; disabled: boolean; onPick: (o: SetPieceOption) => void }) {
  const taker = turn.role === "taker";
  const labels = Object.fromEntries((taker ? takerOptions : defenderOptions).penalty.map((o) => [o.id, o.label]));
  const layout = taker ? penaltyLayout : diveLayout;
  return (
    <div className={styles.goal} style={{ "--tone": taker ? accentVar("orange") : accentVar("violet") } as CSSProperties}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
        <GoalMouthStructure />
      </svg>
      <div className={styles.goalTargets} role="group" aria-label={taker ? "Pick your spot" : "Pick your dive"}>
        {layout.map(({ id, area }) => (
          <button
            key={id}
            type="button"
            className={styles.goalTarget}
            style={{ gridArea: area }}
            disabled={disabled}
            onClick={() => onPick(id as SetPieceOption)}
            data-pitch-duel-option={id}
          >
            {labels[id]}
          </button>
        ))}
      </div>
    </div>
  );
}
