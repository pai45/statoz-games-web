"use client";

import { useEffect, useState, type CSSProperties } from "react";

import { accentVar, feedbackVar } from "@/design-system";

import { attacks, defenses } from "../engine/actions";
import { defenderOptions, setPieceTitles, takerOptions } from "../engine/set-pieces";
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

/** What the prompt line asks for this turn. */
function promptFor(state: MatchState): { text: string; hint: string } {
  if (state.phase === "kickoff") return { text: "KICK-OFF", hint: `${state.teams.home.name} vs ${state.opponentName}` };
  if (state.phase === "halftime") return { text: "HALF-TIME", hint: "Second half next" };
  if (state.phase === "fulltime") return { text: "FULL-TIME", hint: "See how your five rated" };
  if (state.pending.kind === "setPiece") {
    const sp = state.pending.setPiece;
    return sp.side === "home"
      ? { text: `${setPieceTitles[sp.kind]} · YOUR CALL`, hint: "Their keeper has already picked a side" }
      : { text: `${setPieceTitles[sp.kind]} · STOP IT`, hint: "They have picked their plan. Guess it" };
  }
  return state.possession.side === "home"
    ? { text: "PICK YOUR MOVE", hint: "They have locked in a counter. Don't be predictable" }
    : { text: "READ THEIR MOVE", hint: "Their move is locked in. Guess the type and stop it" };
}

export function DuelStage({
  state,
  faceoff,
  res,
  onSkip,
  onInspect,
}: {
  state: MatchState;
  faceoff: Faceoff;
  res: Resolution | null;
  onSkip: () => void;
  onInspect: (side: Side, id: string) => void;
}) {
  const [cardsRef, zoom] = useFitZoom();
  const home = state.teams.home.cards[faceoff.home];
  const away = state.teams.away.cards[faceoff.away];
  const userWon = res?.userWon;
  const tone = res ? (res.goal ? sideAccent[res.goal] : userWon ? accentVar("lime") : feedbackVar("danger")) : accentVar("cyan");
  const prompt = promptFor(state);
  const tag = res ? relationTag(res) : null;
  const booking = res?.events.find((e) => e.kind === "red" || e.kind === "yellow")?.kind;
  const phaseBanner = !res && state.phase !== "choose";

  const mine = res ? (res.attackingSide === "home" ? res.attackLabel : res.defenseLabel) : null;
  const theirs = res ? (res.attackingSide === "home" ? res.defenseLabel : res.attackLabel) : null;
  const revealedIntent = !res && state.intentRevealed ? intentLabel(state.cpuIntent, state) : null;

  return (
    <section className={styles.duel} aria-label="Duel" style={{ "--tone": tone } as CSSProperties} data-revealing={res ? true : undefined}>
      <div className={styles.duelHead}>
        {res ? (
          tag ? (
            <span key={`t${state.decisions}`} className={styles.relation} style={{ "--tone": tag.tone } as CSSProperties}>{tag.text}</span>
          ) : (
            <span className={styles.prompt}>{res.kind === "setPiece" ? "SET PIECE" : "RESULT"}</span>
          )
        ) : (
          <span key={prompt.text} className={styles.prompt}>{prompt.text}</span>
        )}
      </div>

      <div ref={cardsRef} className={styles.duelCards} style={{ "--card-zoom": zoom } as CSSProperties}>
        <CardSlot
          side="home"
          cardId={faceoff.home}
          card={home}
          ball={faceoff.ball === "home"}
          result={res ? (userWon ? "win" : "lose") : undefined}
          tagLabel="YOU"
          tagValue={mine ?? (state.phase === "choose" ? (faceoff.ball === "home" ? "ON THE BALL" : "DEFENDING") : "READY")}
          tagFlip={false}
          onInspect={res ? undefined : () => onInspect("home", faceoff.home)}
        />

        <div className={styles.duelMid}>
          {res ? (
            <>
              <strong key={`h${state.decisions}`} className={styles.headline} role="status">{res.headline}</strong>
              {booking ? <i className={styles.refCard} data-red={booking === "red" || undefined} aria-label={booking === "red" ? "Red card" : "Yellow card"} /> : null}
            </>
          ) : phaseBanner ? (
            <strong key={state.phase} className={styles.phaseBanner}>{prompt.text}</strong>
          ) : (
            <span className={styles.vsBadge}>VS</span>
          )}
        </div>

        <CardSlot
          side="away"
          cardId={faceoff.away}
          card={away}
          ball={faceoff.ball === "away"}
          result={res ? (userWon ? "lose" : "win") : undefined}
          tagLabel="THEM"
          tagValue={theirs ?? revealedIntent ?? (state.phase === "choose" ? "LOCKED IN" : "READY")}
          tagFlip={Boolean(theirs || revealedIntent)}
          locked={!theirs && !revealedIntent && state.phase === "choose"}
          onInspect={res ? undefined : () => onInspect("away", faceoff.away)}
        />
      </div>

      <p key={res ? `d${state.decisions}` : prompt.hint} className={styles.duelFoot}>
        {res ? res.detail : prompt.hint}
      </p>

      {res ? (
        <button type="button" className={styles.tapLayer} onClick={onSkip} aria-label="Continue">
          <span className={styles.srOnly}>Continue</span>
        </button>
      ) : null}
    </section>
  );
}

function CardSlot({
  side,
  cardId,
  card,
  ball,
  result,
  tagLabel,
  tagValue,
  tagFlip,
  locked,
  onInspect,
}: {
  side: Side;
  cardId: string;
  card: MatchState["teams"]["home"]["cards"][string] | undefined;
  ball: boolean;
  result: "win" | "lose" | undefined;
  tagLabel: string;
  tagValue: string;
  tagFlip: boolean;
  locked?: boolean;
  onInspect?: () => void;
}) {
  return (
    <div className={styles.slot} data-side={side} data-ball={ball || undefined} data-result={result} style={{ "--side": sideAccent[side] } as CSSProperties}>
      <div key={cardId} className={styles.slotDeal}>
        <div className={styles.slotClash}>
          {card ? <DuelCard card={card} label={`${side === "home" ? "Your" : "Their"} player: ${card.name}. View stats`} onClick={onInspect} /> : null}
        </div>
      </div>
      <span className={`${styles.plate} ${styles.pickTag}`} data-locked={locked || undefined}>
        <small>{tagLabel}</small>
        <b key={tagValue} className={tagFlip ? styles.flip : undefined}>{tagValue}</b>
      </span>
    </div>
  );
}

/** A small "sm" card is 128×192; scale it to the room the row leaves (the pick tag sits under it). */
const cardW = 128;
const cardH = 192;
const tagH = 30;

function useFitZoom(): [(node: HTMLElement | null) => void, number] {
  const [node, setNode] = useState<HTMLElement | null>(null);
  const [value, setValue] = useState(0.8);
  useEffect(() => {
    if (!node || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(([entry]) => {
      const byHeight = (entry.contentRect.height - tagH) / cardH;
      const byWidth = (entry.contentRect.width * 0.34) / cardW;
      setValue(Math.round(Math.min(1.9, Math.max(0.45, Math.min(byHeight, byWidth))) * 100) / 100);
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [node]);
  return [setNode, value];
}
