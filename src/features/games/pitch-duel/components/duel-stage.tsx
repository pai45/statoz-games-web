"use client";

import type { CSSProperties } from "react";

import { attacks, defenses } from "../engine/actions";
import { highThreshold } from "../engine/duel";
import { formations } from "../engine/lineup";
import { defenderOptions, setPieceTitles, takerOptions } from "../engine/set-pieces";
import { divisions } from "../engine/setup";
import type { CpuIntent, MatchState, Resolution, Side } from "../engine/types";

import { DuelCard, duelStatKeys, sideAccent } from "./card-art";
import { BallIcon, BoltIcon } from "./icons";
import { PeriodStats } from "./match-parts";
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
const gold = "#fbbf24";

/** Tag on the reveal, worded from the human's side and honest about the result. */
function relationTag(res: Resolution): { text: string; tone: string } | null {
  if (res.surges.length) {
    const both = res.surges.length === 2;
    if (both) return { text: "⚡ SURGE VS SURGE", tone: gold };
    return res.surges[0] === "home" ? { text: res.userWon ? "⚡ SURGE PAID OFF" : "⚡ SURGE, STILL STOPPED", tone: gold } : { text: "⚡ THEY SURGED", tone: bad };
  }
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
  if (state.momentum.away >= 100) return { text: "READ THEIR MOVE", hint: "Their surge is ready — they spend it near your goal" };
  if (state.momentum.home >= 100) return { text: "PICK YOUR MOVE", hint: "Your surge is ready. Arm it for a big moment" };
  return state.possession.side === "home"
    ? { text: "PICK YOUR MOVE", hint: "Study the duel — they have locked in a counter" }
    : { text: "READ THEIR MOVE", hint: "Their move is locked in. Guess it and stop it" };
}

/** How a duel landed, in words: the closer the margin, the louder the call. */
function marginWord(userMargin: number): string {
  const m = Math.abs(userMargin);
  if (m <= 3) return userMargin >= 0 ? "BY A WHISKER" : "SO CLOSE";
  if (m >= 22) return userMargin > 0 ? "DOMINANT" : "OVERPOWERED";
  return "";
}

/**
 * Two player cards, a pink VS between them. The card with the ball wears the
 * possession triangle and the ball at its foot. During a reveal the cards
 * clash with a flash at the VS, the winner lifts and the headline drops in
 * with a meter showing how close the duel was. Kick-off, half-time and
 * full-time take over the stage with the teams and the numbers.
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
  if (!res && state.phase !== "choose") return <PhasePanel state={state} />;

  const home = state.teams.home.cards[faceoff.home];
  const away = state.teams.away.cards[faceoff.away];
  const prompt = promptFor(state);
  const tag = res ? relationTag(res) : null;
  const booking = res?.events.find((e) => e.kind === "red" || e.kind === "yellow")?.kind;
  const mine = res ? (res.attackingSide === "home" ? res.attackLabel : res.defenseLabel) : null;
  const theirs = res ? (res.attackingSide === "home" ? res.defenseLabel : res.attackLabel) : null;
  const revealedIntent = !res && state.intentRevealed ? intentLabel(state.cpuIntent, state) : null;
  // After a duel, each card lights the stats the move was decided on.
  const decided = res?.kind === "duel" ? duelStatKeys(res.attackLabel) : null;
  const lit = (side: Side) => (decided && res ? (res.attackingSide === side ? decided.attacker : decided.defender) : undefined);
  const userMargin = res?.margin == null ? null : res.attackingSide === "home" ? res.margin : -res.margin;
  const big = Boolean(res && (res.goal || res.outcome === "success_high" || res.outcome === "fail_high"));
  const word = userMargin == null ? "" : marginWord(userMargin);

  return (
    <section className={styles.duel} aria-label="Duel" data-revealing={res ? true : undefined} data-big={big || undefined}>
      <div className={styles.cards}>
        <Slot
          side="home"
          cardId={faceoff.home}
          card={home}
          stats={state.teams.home.stats[faceoff.home]}
          highlight={lit("home")}
          ball={faceoff.ball === "home"}
          result={res ? (res.userWon ? "win" : "lose") : undefined}
          tag={mine ?? (faceoff.ball === "home" ? "ON THE BALL" : "DEFENDING")}
          surge={res ? res.surges.includes("home") : false}
          onInspect={() => onInspect("home", faceoff.home)}
        />
        <div className={styles.vsWrap}>
          <span className={styles.vs} aria-hidden>VS</span>
          {res ? (
            <span key={`x${state.decisions}`} className={styles.impact} data-big={big || undefined} style={{ "--tone": res.userWon ? good : bad } as CSSProperties} aria-hidden>
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
            </span>
          ) : null}
          {booking ? <i className={booking === "red" ? styles.refRed : styles.refYellow} aria-label={booking === "red" ? "Red card" : "Yellow card"} /> : null}
        </div>
        <Slot
          side="away"
          cardId={faceoff.away}
          card={away}
          stats={state.teams.away.stats[faceoff.away]}
          highlight={lit("away")}
          ball={faceoff.ball === "away"}
          result={res ? (res.userWon ? "lose" : "win") : undefined}
          tag={theirs ?? revealedIntent ?? "LOCKED IN"}
          locked={!theirs && !revealedIntent}
          surge={res ? res.surges.includes("away") : state.momentum.away >= 100}
          surgeWaiting={!res && state.momentum.away >= 100}
          onInspect={() => onInspect("away", faceoff.away)}
        />
      </div>

      <div className={styles.callout}>
        {res ? (
          <div key={`r${state.decisions}`} className={styles.verdict} role="status" style={{ "--tone": res.goal ? sideAccent[res.goal] : res.userWon ? good : bad } as CSSProperties}>
            {userMargin != null ? <DuelMeter margin={userMargin} /> : null}
            {tag || word ? (
              <span className={styles.verdictTags}>
                {tag ? <span className={styles.verdictTag} style={{ "--tag": tag.tone } as CSSProperties}>{tag.text}</span> : null}
                {word ? <span className={styles.verdictTag} data-word style={{ "--tag": "#e9d5ff" } as CSSProperties}>{word}</span> : null}
              </span>
            ) : null}
            <strong>{res.headline}</strong>
            <span>{res.detail}</span>
          </div>
        ) : (
          <p key={prompt.hint} className={styles.tip}>
            <b>Tip:</b> {prompt.hint}
          </p>
        )}
      </div>
    </section>
  );
}

/**
 * A tug-of-war bar along the top edge of the verdict: the needle swings out
 * from the centre to where the duel landed, from your side. The ticks mark
 * the outcome bands: big loss, loss, win, big win.
 */
function DuelMeter({ margin }: { margin: number }) {
  const span = 36;
  const at = 50 + (Math.max(-span, Math.min(span, margin)) / span) * 50;
  const tick = (v: number) => `${50 + (v / span) * 50}%`;
  return (
    <span className={styles.meter} style={{ "--at": `${at}%`, "--lo": tick(-highThreshold), "--hi": tick(highThreshold) } as CSSProperties} aria-label={`Duel margin ${margin > 0 ? "+" : ""}${margin}`} role="img">
      <i className={styles.meterNeedle} />
    </span>
  );
}

/** Kick-off, half-time and full-time: the teams, the score and the numbers so far. */
function PhasePanel({ state }: { state: MatchState }) {
  type Team = MatchState["teams"]["home"];
  const ovr = (team: Team) => Math.round([team.keeperId, ...team.outfield].reduce((sum, id) => sum + (team.cards[id]?.rating ?? 0), 0) / (team.outfield.length + 1));
  const star = (team: Team) => [team.keeperId, ...team.outfield].reduce((a, b) => ((team.cards[b]?.rating ?? 0) > (team.cards[a]?.rating ?? 0) ? b : a));
  const word = state.phase === "kickoff" ? "KICK-OFF" : state.phase === "halftime" ? "HALF-TIME" : "FULL-TIME";

  return (
    <section className={styles.phasePanel} data-phase={state.phase} aria-label={word}>
      <span className={styles.phaseKicker}>
        {state.phase === "kickoff" ? `DIV ${state.division} · ${divisions[state.division - 1]}` : word}
      </span>
      <div className={styles.phaseTeams}>
        {(["home", "away"] as const).map((side) => {
          const team = state.teams[side];
          const best = team.cards[star(team)];
          return (
            <div key={side} className={styles.crest} data-side={side} style={{ "--side": sideAccent[side] } as CSSProperties}>
              <span className={styles.crestBadge} aria-hidden>
                {side === "home" ? "YOU" : initials(state.opponentName)}
              </span>
              <b>{side === "home" ? "YOUR XI" : state.opponentName.toUpperCase()}</b>
              <small>
                {team.formation} · {formations[team.formation].label} · {ovr(team)} OVR
              </small>
              {state.phase === "kickoff" && best ? <em>★ {best.shortName} {best.rating}</em> : null}
            </div>
          );
        })}
        <div className={styles.phaseScore} aria-label={`${state.score.home} to ${state.score.away}`}>
          {state.phase === "kickoff" ? (
            <span className={styles.vs} aria-hidden>VS</span>
          ) : (
            <>
              <b style={{ color: sideAccent.home }}>{state.score.home}</b>
              <i>–</i>
              <b style={{ color: sideAccent.away }}>{state.score.away}</b>
            </>
          )}
        </div>
      </div>
      {state.phase === "kickoff" ? (
        <p className={styles.phaseNote}>
          Win a duel to fill your <b>momentum</b>. A full bar is a <b>surge</b>: one pick with a big edge.
        </p>
      ) : (
        <div className={styles.phaseStats}>
          <PeriodStats state={state} />
        </div>
      )}
    </section>
  );
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();
}

function Slot({
  side,
  cardId,
  card,
  stats,
  highlight,
  ball,
  result,
  tag,
  locked,
  surge,
  surgeWaiting,
  onInspect,
}: {
  side: Side;
  cardId: string;
  card: MatchState["teams"]["home"]["cards"][string] | undefined;
  stats: MatchState["teams"]["home"]["stats"][string] | undefined;
  highlight: readonly string[] | undefined;
  ball: boolean;
  result: "win" | "lose" | undefined;
  tag: string;
  locked?: boolean;
  surge?: boolean;
  surgeWaiting?: boolean;
  onInspect: () => void;
}) {
  return (
    <div className={styles.slot} data-side={side} data-ball={ball || undefined} data-result={result} data-surge={surge || undefined}>
      {ball ? <i className={styles.possession} style={{ "--side": sideAccent[side] } as CSSProperties} aria-label="Has the ball" /> : null}
      <div key={cardId} className={styles.deal}>
        {card ? (
          <DuelCard card={card} size="lg" stats={stats} highlight={highlight} onClick={onInspect} label={`${side === "home" ? "Your" : "Their"} player: ${card.name}. View stats`} />
        ) : null}
        {ball ? (
          <span className={styles.cardBall} aria-hidden>
            <BallIcon size={28} />
          </span>
        ) : null}
        {surge ? (
          <span className={styles.surgeBadge} data-waiting={surgeWaiting || undefined} aria-label={surgeWaiting ? "Their surge is ready" : "Surge"}>
            <BoltIcon size={14} />
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
