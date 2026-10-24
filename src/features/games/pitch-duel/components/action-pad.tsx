"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

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

type Option = { id: string; verb?: string; tag: string; label: string; hint?: string; tone: string; input: MatchInput };

function optionsFor(turn: Turn): Option[] {
  if (turn.kind === "attack")
    return turn.options.map((id) => ({ id, tag: attacks[id].family, label: attacks[id].label, hint: attacks[id].hint, tone: familyTone[attacks[id].family], input: { type: "attack", action: id } }));
  if (turn.kind === "defend")
    return turn.options.map((id) => ({
      id,
      verb: defenses[id].full.length ? "STOPS" : undefined,
      tag: defenses[id].full.length ? defenses[id].full.join("/") : "GAMBLE",
      label: defenses[id].label,
      hint: defenses[id].hint,
      tone: defenseTone,
      input: { type: "defend", action: id },
    }));
  if (turn.kind === "setPiece")
    return (turn.role === "taker" ? takerOptions : defenderOptions)[turn.setPiece.kind].map((o) => ({
      id: o.id,
      tag: turn.role === "taker" ? "TAKE" : "DEFEND",
      label: o.label,
      hint: o.hint,
      tone: turn.role === "taker" ? accentVar("orange") : defenseTone,
      input: { type: "setPiece", option: o.id as SetPieceOption },
    }));
  return [];
}

export function ActionPad({
  turn,
  turnKey,
  tactics,
  tacticTitles,
  continueLabel,
  onSend,
}: {
  turn: Turn;
  /** Changes every decision, so the buttons deal in afresh. */
  turnKey: string;
  tactics: TacticSlot[];
  tacticTitles: Record<string, string>;
  continueLabel: string;
  onSend: (input: MatchInput) => void;
}) {
  const [armed, setArmed] = useState<string | null>(null);
  const role = turn.kind === "attack" ? "attack" : turn.kind === "defend" ? "defend" : turn.kind === "setPiece" ? "setPiece" : null;
  const armedSlot = tactics.find((t) => t.id === armed && !t.used);
  const tacticId = armedSlot && role && tacticPlayable(armedSlot, role) ? armedSlot.id : undefined;
  const options = optionsFor(turn);

  const send = (input: MatchInput) => {
    if (input.type === "attack" || input.type === "defend" || input.type === "setPiece") {
      onSend({ ...input, tacticId });
      setArmed(null);
    } else onSend(input);
  };

  // Number keys pick options; Enter continues.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      const target = event.target as HTMLElement | null;
      if (target && /INPUT|TEXTAREA|SELECT/.test(target.tagName)) return;
      if ((turn.kind === "continue" || turn.kind === "over") && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        onSend({ type: "continue" });
        return;
      }
      const n = Number(event.key);
      if (!Number.isInteger(n) || n < 1) return;
      const option = options[n - 1];
      if (option) send(option.input);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (turn.kind === "over" || turn.kind === "continue") {
    return (
      <div className={styles.bar}>
        <button type="button" className={`${styles.plate} ${styles.continue}`} onClick={() => onSend({ type: "continue" })}>
          {continueLabel}
        </button>
      </div>
    );
  }

  const penalty = turn.kind === "setPiece" && turn.setPiece.kind === "penalty";

  return (
    <div className={styles.bar} data-penalty={penalty || undefined}>
      {penalty ? (
        <PenaltyGoal key={turnKey} turn={turn} onPick={(option) => send({ type: "setPiece", option })} />
      ) : (
        <div key={turnKey} className={styles.options} style={{ "--count": options.length } as CSSProperties} role="group" aria-label="Your options">
          {options.map((o, i) => (
            <button
              key={o.id}
              type="button"
              className={`${styles.plate} ${styles.option}`}
              style={{ "--tone": o.tone, "--i": i } as CSSProperties}
              onClick={() => send(o.input)}
              data-pitch-duel-option={o.id}
            >
              <span className={styles.optionKey}>
                <kbd>{i + 1}</kbd>
                {o.verb ? <span className={styles.optionVerb}>{o.verb}</span> : null}
                {o.tag}
              </span>
              <b>{o.label}</b>
              {o.hint ? <small>{o.hint}</small> : null}
            </button>
          ))}
        </div>
      )}

      {tactics.length > 0 ? (
        <TacticTray
          tactics={tactics}
          titles={tacticTitles}
          role={role}
          armed={armedSlot ? armedSlot.id : null}
          onArm={(id) => setArmed((current) => (current === id ? null : id))}
          onMindGame={(id) => onSend({ type: "mindGame", tacticId: id })}
        />
      ) : null}
    </div>
  );
}

function TacticTray({
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
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const playable = (t: TacticSlot) => {
    const isMind = blueprintOf(t.id) === "act15";
    return !t.used && role !== null && tacticPlayable(t, role) && !(isMind && role === "setPiece");
  };
  const ready = tactics.filter(playable).length;
  const left = tactics.filter((t) => !t.used).length;

  useEffect(() => {
    if (!open) return;
    const close = (event: Event) => {
      if (event instanceof KeyboardEvent && event.key !== "Escape") return;
      if (event instanceof PointerEvent && root.current?.contains(event.target as Node)) return;
      setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", close);
    };
  }, [open]);

  return (
    <div ref={root} className={styles.tacticWrap}>
      <button
        type="button"
        className={`${styles.plate} ${styles.tacticToggle}`}
        aria-expanded={open}
        aria-haspopup="true"
        data-armed={armed ? true : undefined}
        data-ready={ready > 0 || undefined}
        onClick={() => setOpen((v) => !v)}
      >
        <small>{armed ? "ARMED" : "TACTICS"}</small>
        <b>{armed ? titles[armed] ?? "TACTIC" : `${left}/${tactics.length}`}</b>
      </button>
      {open ? (
        <div className={`${styles.plate} ${styles.tray}`} role="group" aria-label="Tactic cards">
          <span className={styles.trayTitle}>TACTIC CARDS · ONE USE EACH</span>
          {tactics.map((t) => {
            const isMind = blueprintOf(t.id) === "act15";
            const can = playable(t);
            return (
              <button
                key={t.id}
                type="button"
                className={`${styles.plate} ${styles.tactic}`}
                disabled={!can}
                aria-pressed={armed === t.id}
                data-used={t.used || undefined}
                onClick={() => {
                  if (isMind) onMindGame(t.id);
                  else onArm(t.id);
                  setOpen(false);
                }}
              >
                <b>{titles[t.id] ?? "TACTIC"}</b>
                <small>{t.used ? "Used this match" : !can ? "Not now" : isMind ? "Reveal their pick now" : armed === t.id ? "Armed · tap to cancel" : effectFor(t).summary}</small>
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

function PenaltyGoal({ turn, onPick }: { turn: Extract<Turn, { kind: "setPiece" }>; onPick: (o: SetPieceOption) => void }) {
  const taker = turn.role === "taker";
  const labels = Object.fromEntries((taker ? takerOptions : defenderOptions).penalty.map((o) => [o.id, o.label]));
  const layout = taker ? penaltyLayout : diveLayout;
  return (
    <div className={styles.goal} style={{ "--tone": taker ? accentVar("orange") : accentVar("violet") } as CSSProperties}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
        <GoalMouthStructure />
      </svg>
      <div className={styles.goalTargets} role="group" aria-label={taker ? "Pick your spot" : "Pick your dive"}>
        {layout.map(({ id, area }, i) => (
          <button
            key={id}
            type="button"
            className={styles.goalTarget}
            style={{ gridArea: area, "--i": i } as CSSProperties}
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
