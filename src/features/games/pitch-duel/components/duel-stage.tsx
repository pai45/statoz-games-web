"use client";

import type { CSSProperties } from "react";

import { attacks, defenses } from "../engine/actions";
import { defenderOptions, setPieceTitles, takerOptions } from "../engine/set-pieces";
import type { CpuIntent, MatchState, Resolution, Side } from "../engine/types";

import { ShieldCard, sideAccent } from "./card-art";
import { BallIcon } from "./icons";
import styles from "./match.module.css";

export type Faceoff = { home: string; away: string; ball: Side };

function intentLabel(intent: CpuIntent | null, state: MatchState): string {
  if (!intent) return "???";
  if (intent.kind === "attack") return attacks[intent.action].label;
  if (intent.kind === "defend") return defenses[intent.action].label;
  if (state.pending.kind !== "setPiece") return "???";
  const kind = state.pending.setPiece.kind;
  const options = state.pending.setPiece.side === "away" ? takerOptions[kind] : defenderOptions[kind];
  return options.find((o) => o.id === intent.option)?.label ?? "???";
}

const good = "#4ade80";
const bad = "#f87171";

/** Tag on the reveal, worded from the human's side and honest about the result. */
function relationTag(res: Resolution): { text: string; tone: string } | null {
  if (!res.relation) return null;
  if (res.relation === "partial") return { text: "HALF READ", tone: "#fbbf24" };
  const attacking = res.attackingSide === "home";
  const won = res.userWon;
  if (res.relation === "full") {
    if (attacking) return won ? { text: "READ, BUT BEATEN", tone: good } : { text: "THEY READ YOU", tone: bad };
    return won ? { text: "YOU READ IT", tone: good } : { text: "READ IT, STILL BEATEN", tone: bad };
  }
  if (attacking) return won ? { text: "WRONG READ — GO!", tone: good } : { text: "OPEN, BUT STOPPED", tone: bad };
  return won ? { text: "FOOLED, BUT SAVED", tone: good } : { text: "THEY FOOLED YOU", tone: bad };
}

/** The tip line under the cards. */
export function promptFor(state: MatchState): { text: string; hint: string } {
  if (state.phase === "kickoff") return { text: "KICK-OFF", hint: `Eleven a side · you vs ${state.opponentName}` };
  if (state.phase === "halftime") return { text: "HALF-TIME", hint: "Second half next" };
  if (state.phase === "fulltime") return { text: "FULL-TIME", hint: "See how your eleven rated" };
  if (state.pending.kind === "setPiece") {
    const sp = state.pending.setPiece;
    return sp.side === "home"
      ? { text: `${setPieceTitles[sp.kind]} · YOUR CALL`, hint: "Their keeper has already picked a side" }
      : { text: `${setPieceTitles[sp.kind]} · STOP IT`, hint: "They have picked their plan. Guess it" };
  }
  return state.possession.side === "home"
    ? { text: "PICK YOUR MOVE", hint: "Study the duel — they have locked in a counter" }
    : { text: "READ THEIR MOVE", hint: "Their move is locked in. Guess it and stop it" };
}

/**
 * Two shield cards, a pink VS between them. The card with the ball wears the
 * possession triangle and the ball at its foot. During a reveal the cards
 * clash, the winner lifts and the headline drops in.
 */
export function DuelStage({
  state,
  faceoff,
  res,
  onInspect,
}: {
  state: MatchState;
  faceoff: Faceoff;
  res: Resolution | null;
  onInspect: (side: Side, id: string) => void;
}) {
  const home = state.teams.home.cards[faceoff.home];
  const away = state.teams.away.cards[faceoff.away];
  const prompt = promptFor(state);
  const tag = res ? relationTag(res) : null;
  const booking = res?.events.find((e) => e.kind === "red" || e.kind === "yellow")?.kind;
  const mine = res ? (res.attackingSide === "home" ? res.attackLabel : res.defenseLabel) : null;
  const theirs = res ? (res.attackingSide === "home" ? res.defenseLabel : res.attackLabel) : null;
  const revealedIntent = !res && state.intentRevealed ? intentLabel(state.cpuIntent, state) : null;
  const phaseBanner = !res && state.phase !== "choose" ? prompt.text : null;

  return (
    <section className={styles.duel} aria-label="Duel" data-revealing={res ? true : undefined}>
      <div className={styles.cards}>
        <Slot
          side="home"
          cardId={faceoff.home}
          card={home}
          ball={faceoff.ball === "home"}
          result={res ? (res.userWon ? "win" : "lose") : undefined}
          tag={mine ?? (state.phase === "choose" ? (faceoff.ball === "home" ? "ON THE BALL" : "DEFENDING") : "READY")}
          onInspect={() => onInspect("home", faceoff.home)}
        />
        <div className={styles.vsWrap}>
          {phaseBanner ? (
            <strong key={state.phase} className={styles.phaseWord}>{phaseBanner}</strong>
          ) : (
            <span className={styles.vs} aria-hidden>VS</span>
          )}
          {booking ? <i className={booking === "red" ? styles.refRed : styles.refYellow} aria-label={booking === "red" ? "Red card" : "Yellow card"} /> : null}
        </div>
        <Slot
          side="away"
          cardId={faceoff.away}
          card={away}
          ball={faceoff.ball === "away"}
          result={res ? (res.userWon ? "lose" : "win") : undefined}
          tag={theirs ?? revealedIntent ?? (state.phase === "choose" ? "LOCKED IN" : "READY")}
          locked={!theirs && !revealedIntent && state.phase === "choose"}
          onInspect={() => onInspect("away", faceoff.away)}
        />
      </div>

      {res ? (
        <div key={`r${state.decisions}`} className={styles.verdict} role="status" style={{ "--tone": res.goal ? sideAccent[res.goal] : res.userWon ? good : bad } as CSSProperties}>
          {tag ? <span className={styles.verdictTag} style={{ "--tag": tag.tone } as CSSProperties}>{tag.text}</span> : null}
          <strong>{res.headline}</strong>
          <span>{res.detail}</span>
        </div>
      ) : (
        <p key={prompt.hint} className={styles.tip}>
          <b>Tip:</b> {prompt.hint}
        </p>
      )}
    </section>
  );
}

function Slot({
  side,
  cardId,
  card,
  ball,
  result,
  tag,
  locked,
  onInspect,
}: {
  side: Side;
  cardId: string;
  card: MatchState["teams"]["home"]["cards"][string] | undefined;
  ball: boolean;
  result: "win" | "lose" | undefined;
  tag: string;
  locked?: boolean;
  onInspect: () => void;
}) {
  return (
    <div className={styles.slot} data-side={side} data-ball={ball || undefined} data-result={result}>
      {ball ? <i className={styles.possession} style={{ "--side": sideAccent[side] } as CSSProperties} aria-label="Has the ball" /> : null}
      <div key={cardId} className={styles.deal}>
        {card ? (
          <ShieldCard card={card} size="lg" onClick={onInspect} label={`${side === "home" ? "Your" : "Their"} player: ${card.name}. View stats`} />
        ) : null}
        {ball ? (
          <span className={styles.cardBall} aria-hidden>
            <BallIcon size={28} />
          </span>
        ) : null}
      </div>
      <span className={styles.pickTag} data-locked={locked || undefined} style={{ "--side": sideAccent[side] } as CSSProperties}>
        <small>{side === "home" ? "YOU" : "THEM"}</small>
        <b key={tag}>{tag}</b>
      </span>
    </div>
  );
}
