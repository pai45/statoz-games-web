"use client";

import { useEffect, useState, type CSSProperties } from "react";

import { accentVar, feedbackVar } from "@/design-system";

import { attacks, defenses } from "../engine/actions";
import { setPieceTitles, takerOptions, defenderOptions } from "../engine/set-pieces";
import type { CpuIntent, MatchState, Resolution, Side } from "../engine/types";

import { DuelCard, sideAccent } from "./card-art";
import styles from "./match.module.css";

type Faceoff = { home: string; away: string; ball: Side };

function intentLabel(intent: CpuIntent | null, state: MatchState): string {
  if (!intent) return "???";
  if (intent.kind === "attack") return attacks[intent.action].label;
  if (intent.kind === "defend") return defenses[intent.action].label;
  if (state.pending.kind !== "setPiece") return "???";
  const kind = state.pending.setPiece.kind;
  const options = state.pending.setPiece.side === "away" ? takerOptions[kind] : defenderOptions[kind];
  return options.find((o) => o.id === intent.option)?.label ?? "???";
}

/** Tag on the reveal, worded from the human's side and honest about the result. */
function relationTag(res: Resolution): { text: string; tone: string } | null {
  if (!res.relation) return null;
  const good = accentVar("lime");
  const bad = feedbackVar("danger");
  if (res.relation === "partial") return { text: "HALF READ", tone: feedbackVar("warning") };
  const attacking = res.attackingSide === "home";
  const won = res.userWon;
  if (res.relation === "full") {
    if (attacking) return won ? { text: "READ, BUT BEATEN", tone: good } : { text: "THEY READ YOU", tone: bad };
    return won ? { text: "YOU READ IT", tone: good } : { text: "READ IT, STILL BEATEN", tone: bad };
  }
  if (attacking) return won ? { text: "WRONG READ — GO!", tone: good } : { text: "OPEN, BUT STOPPED", tone: bad };
  return won ? { text: "FOOLED, BUT SAVED", tone: good } : { text: "THEY FOOLED YOU", tone: bad };
}

export function DuelStage({
  state,
  faceoff,
  revealing,
  onSkip,
}: {
  state: MatchState;
  faceoff: Faceoff;
  revealing: boolean;
  onSkip: () => void;
}) {
  const res = revealing ? state.lastResolution : null;
  const [stageRef, zoom] = useFitZoom();
  const home = state.teams.home.cards[faceoff.home];
  const away = state.teams.away.cards[faceoff.away];
  const userWon = res?.userWon;
  const tone = res ? (res.goal ? sideAccent[res.goal] : userWon ? accentVar("lime") : feedbackVar("danger")) : accentVar("cyan");

  return (
    <section ref={stageRef} className={styles.stage} aria-label="Duel" style={{ "--tone": tone, "--card-zoom": zoom } as CSSProperties}>
      <div
        className={`${styles.cardSlot} ${faceoff.ball === "home" ? styles.cardSlotBall : ""} ${res ? (userWon ? styles.cardWin : styles.cardLose) : ""}`}
        style={{ "--side": sideAccent.home } as CSSProperties}
      >
        {home ? <DuelCard card={home} label={`Your player: ${home.name}`} /> : null}
      </div>

      <div className={styles.versus}>{res ? <Reveal res={res} /> : <Prompt state={state} />}</div>

      <div
        className={`${styles.cardSlot} ${faceoff.ball === "away" ? styles.cardSlotBall : ""} ${res ? (userWon ? styles.cardLose : styles.cardWin) : ""}`}
        style={{ "--side": sideAccent.away } as CSSProperties}
      >
        {away ? <DuelCard card={away} label={`Their player: ${away.name}`} /> : null}
      </div>

      {res ? (
        <button type="button" className={styles.tapLayer} onClick={onSkip} aria-label="Continue">
          <span className={styles.srOnly}>Continue</span>
        </button>
      ) : null}
    </section>
  );
}

/** A small "sm" card is 128×192; scale it so the card (plus its ball marker) fills the stage height. */
const cardHeight = 192 + 14;

function useFitZoom(): [(node: HTMLElement | null) => void, number] {
  const [node, setNode] = useState<HTMLElement | null>(null);
  const [value, setValue] = useState(0.7);
  useEffect(() => {
    if (!node || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(([entry]) => {
      const byHeight = entry.contentRect.height / cardHeight;
      const byWidth = (entry.contentRect.width * 0.3) / 128;
      setValue(Math.round(Math.min(1.25, Math.max(0.42, Math.min(byHeight, byWidth))) * 100) / 100);
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [node]);
  return [setNode, value];
}

function Prompt({ state }: { state: MatchState }) {
  if (state.phase === "kickoff") return <><span className={styles.vsBadge}>VS</span><span className={styles.prompt}>KICK-OFF</span></>;
  if (state.phase === "halftime") return <><span className={styles.vsBadge}>HT</span><span className={styles.prompt}>HALF-TIME</span></>;
  if (state.phase === "fulltime") return <><span className={styles.vsBadge}>FT</span><span className={styles.prompt}>FULL-TIME</span></>;

  const setPiece = state.pending.kind === "setPiece" ? state.pending.setPiece : null;
  const userBall = setPiece ? setPiece.side === "home" : state.possession.side === "home";
  const prompt = setPiece
    ? `${setPieceTitles[setPiece.kind]} · ${userBall ? "YOUR CALL" : "STOP IT"}`
    : userBall ? "PICK YOUR MOVE" : "READ THEIR MOVE";
  const cpuSide: Side = "away";
  const revealed = state.intentRevealed;

  return (
    <>
      <span className={styles.vsBadge}>VS</span>
      <span className={styles.prompt}>{prompt}</span>
      <div className={styles.pickRow}>
        <div className={`${styles.plate} ${styles.pick} ${styles.pickHidden}`} style={{ "--side": sideAccent.home } as CSSProperties}>
          <small>YOU</small>
          <b>CHOOSING…</b>
        </div>
        <div
          className={`${styles.plate} ${styles.pick} ${revealed ? styles.flip : styles.pickHidden}`}
          style={{ "--side": sideAccent[cpuSide] } as CSSProperties}
        >
          <small>{userBall ? "THEIR READ" : "THEIR MOVE"}</small>
          <b>{revealed ? intentLabel(state.cpuIntent, state) : "LOCKED IN ?"}</b>
        </div>
      </div>
    </>
  );
}

function Reveal({ res }: { res: Resolution }) {
  const userAttacking = res.attackingSide === "home";
  const mine = userAttacking ? res.attackLabel : res.defenseLabel;
  const theirs = userAttacking ? res.defenseLabel : res.attackLabel;
  const tag = relationTag(res);
  return (
    <>
      <div className={styles.pickRow}>
        <div className={`${styles.plate} ${styles.pick}`} style={{ "--side": sideAccent.home } as CSSProperties}>
          <small>YOU</small>
          <b>{mine}</b>
        </div>
        <div className={`${styles.plate} ${styles.pick} ${styles.flip}`} style={{ "--side": sideAccent.away } as CSSProperties}>
          <small>THEM</small>
          <b>{theirs}</b>
        </div>
      </div>
      {tag ? <span className={styles.relation} style={{ "--tone": tag.tone } as CSSProperties}>{tag.text}</span> : null}
      <strong className={styles.headline} role="status">{res.headline}</strong>
      <span className={styles.detail}>{res.detail}</span>
      <span className={styles.tapHint}>TAP TO CONTINUE</span>
    </>
  );
}
