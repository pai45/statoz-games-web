"use client";

import type { CSSProperties, ReactNode } from "react";

import { lineKey, minuteLabel, playerRating } from "../engine/match";
import type { Lane, MatchEvent, MatchState, Side } from "../engine/types";

import { primaryPosition, sideAccent } from "./card-art";
import { columnX, laneY, type PitchScene } from "./pitch-layout";
import styles from "./match.module.css";

/* ---- Scoreboard ----------------------------------------------------------- */

export function Scoreboard({ state, onQuit, onLog }: { state: MatchState; onQuit: () => void; onLog: () => void }) {
  const clock = state.phase === "kickoff" ? "0'" : state.phase === "halftime" ? "HT" : state.phase === "fulltime" ? "FT" : minuteLabel(state);
  const elapsed = Math.min(1, state.phase === "kickoff" ? 0 : state.minute / 90);
  return (
    <header className={styles.topbar} style={{ "--elapsed": elapsed } as CSSProperties}>
      <button type="button" className={styles.iconButton} onClick={onQuit} aria-label="Leave match">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
          <path d="M15 5l-7 7 7 7" />
        </svg>
      </button>
      <div className={styles.scoreline} aria-live="polite" aria-label={`${state.teams.home.name} ${state.score.home}, ${state.opponentName} ${state.score.away}, ${clock}`}>
        <span className={`${styles.team} ${styles.teamHome}`}>{state.teams.home.name}</span>
        <b key={`h${state.score.home}`} className={styles.scoreNum} style={{ "--side": sideAccent.home } as CSSProperties}>{state.score.home}</b>
        <span key={clock} className={styles.clock}>{clock}</span>
        <b key={`a${state.score.away}`} className={styles.scoreNum} style={{ "--side": sideAccent.away } as CSSProperties}>{state.score.away}</b>
        <span className={`${styles.team} ${styles.teamAway}`}>{state.opponentName}</span>
      </div>
      <button type="button" className={styles.iconButton} onClick={onLog} aria-label="Squads and match log">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
          <path d="M4 6h16M4 12h16M4 18h10" />
        </svg>
      </button>
      <i className={styles.timeBar} aria-hidden />
    </header>
  );
}

/* ---- Pitch: every player, the ball and the live zone ---------------------- */

/** The drawn pitch sits inside the panel with room for the nets at each end. */
const VB_W = 100;
const VB_H = 64;
const INSET_X = 4;
const INSET_Y = 3;
const FIELD_W = VB_W - INSET_X * 2;
const FIELD_H = VB_H - INSET_Y * 2;
const left = (x: number) => `${((INSET_X + x * FIELD_W) / VB_W) * 100}%`;
const top = (y: number) => `${((INSET_Y + y * FIELD_H) / VB_H) * 100}%`;
const laneRows: Lane[] = ["left", "center", "right"];

export function PitchView({
  state,
  scene,
  zone,
  possession,
  danger,
  moving,
  goal,
  header,
  footer,
  onOpen,
}: {
  state: MatchState;
  scene: PitchScene;
  zone: { x: number; lane: Lane } | null;
  possession: Side;
  danger: boolean;
  /** A reveal is playing: the pitch moves after the cards clash. */
  moving: boolean;
  goal: Side | null;
  header: ReactNode;
  footer: ReactNode;
  onOpen: () => void;
}) {
  const col = FIELD_W / 8;
  const row = FIELD_H / 3;
  const zoneRow = zone ? laneRows.indexOf(zone.x === 1 || zone.x === 8 ? "center" : zone.lane) : -1;
  // The two duellists stand close together: the higher one labels above, the lower one below.
  const duellists = scene.tokens.filter((t) => t.duel);
  const upper = duellists.length === 2 ? (duellists[0].y <= duellists[1].y ? duellists[0] : duellists[1]) : null;
  return (
    <button
      type="button"
      className={styles.pitchPanel}
      onClick={onOpen}
      aria-label="Pitch view. Open squads and match log"
      data-danger={danger || undefined}
      data-moving={moving || undefined}
      data-goal={goal ?? undefined}
      style={{ "--possession": sideAccent[possession] } as CSSProperties}
    >
      {header}
      <span className={styles.pitch}>
        <svg viewBox={`0 0 ${VB_W} ${VB_H}`} preserveAspectRatio="none" aria-hidden>
          {Array.from({ length: 8 }, (_, c) => (
            <rect key={c} x={INSET_X + c * col} y={INSET_Y} width={col} height={FIELD_H} className={c % 2 ? styles.stripeB : styles.stripeA} />
          ))}
          {zone && zoneRow >= 0 ? (
            <rect
              className={styles.zoneHot}
              x={INSET_X + (zone.x - 1) * col}
              y={INSET_Y + zoneRow * row}
              width={col}
              height={row}
            />
          ) : null}
          <rect x={INSET_X} y={INSET_Y} width={FIELD_W} height={FIELD_H} className={styles.pitchLine} />
          <line x1={VB_W / 2} y1={INSET_Y} x2={VB_W / 2} y2={VB_H - INSET_Y} className={styles.pitchLine} />
          <ellipse cx={VB_W / 2} cy={VB_H / 2} rx="6.5" ry="9" className={styles.pitchLine} />
          <rect x={INSET_X} y={INSET_Y + row} width={col} height={row} className={styles.pitchLine} />
          <rect x={VB_W - INSET_X - col} y={INSET_Y + row} width={col} height={row} className={styles.pitchLine} />
          <rect x={INSET_X} y={VB_H / 2 - 5} width={col * 0.4} height="10" className={styles.pitchLine} />
          <rect x={VB_W - INSET_X - col * 0.4} y={VB_H / 2 - 5} width={col * 0.4} height="10" className={styles.pitchLine} />
          <rect x={INSET_X - 2.6} y={VB_H / 2 - 4} width="2.6" height="8" className={`${styles.net} ${goal === "away" ? styles.netHit : ""}`} style={{ "--side": sideAccent.home } as CSSProperties} />
          <rect x={VB_W - INSET_X} y={VB_H / 2 - 4} width="2.6" height="8" className={`${styles.net} ${goal === "home" ? styles.netHit : ""}`} style={{ "--side": sideAccent.away } as CSSProperties} />
        </svg>

        {scene.tokens.map((t) => {
          const card = state.teams[t.side].cards[t.id];
          return (
            <span
              key={`${t.side}:${t.id}`}
              className={styles.token}
              data-carrier={t.carrier || undefined}
              data-duel={t.duel || undefined}
              data-keeper={t.keeper || undefined}
              data-up={(upper ? t === upper : t.y > 0.68) || undefined}
              style={{ left: left(t.x), top: top(t.y), "--side": sideAccent[t.side] } as CSSProperties}
              aria-hidden
            >
              <span className={styles.tokenDisc}>{card?.rating}</span>
              {t.duel ? <span className={styles.tokenName}>{card?.shortName}</span> : null}
            </span>
          );
        })}
        <span className={styles.ball} style={{ left: left(scene.ball.x), top: top(scene.ball.y) }} aria-hidden />
      </span>
      {footer}
    </button>
  );
}

/** Where the ball sits for a set piece: the corner flag or the spot. */
export function setPieceSpot(state: MatchState): { x: number; y: number } | undefined {
  if (state.pending.kind !== "setPiece") return undefined;
  const sp = state.pending.setPiece;
  const toRight = sp.side === "home";
  if (sp.kind === "corner") return { x: toRight ? 0.99 : 0.01, y: sp.lane === "right" ? 0.97 : 0.03 };
  if (sp.kind === "penalty") return { x: toRight ? 0.885 : 0.115, y: laneY.center };
  if (sp.kind === "oneOnOne") return { x: toRight ? columnX(7.6) : columnX(1.4), y: laneY.center };
  return undefined;
}

/* ---- Log ------------------------------------------------------------------ */

export function EventTicker({ event }: { event: MatchEvent | undefined }) {
  return (
    <span className={styles.ticker}>
      {event ? (
        <span key={event.id} className={styles.tickerLine} style={{ "--side": sideAccent[event.side] } as CSSProperties}>
          <em>{event.minute}</em>
          <span>{event.text}</span>
        </span>
      ) : (
        <span className={styles.tickerLine}>
          <span>Tap the pitch for squads and the match log</span>
        </span>
      )}
    </span>
  );
}

export function EventLog({ events }: { events: MatchEvent[] }) {
  const shown = events.filter((e) => e.kind !== "duel").slice().reverse();
  return (
    <ol className={styles.log}>
      {shown.map((e) => (
        <li key={e.id} style={{ "--side": sideAccent[e.side] } as CSSProperties}>
          <time>{e.minute}</time>
          <i className={styles.logBar} aria-hidden />
          <span className={e.kind === "goal" ? styles.logGoal : undefined}>{e.text}</span>
        </li>
      ))}
    </ol>
  );
}

/* ---- Squads (in the match drawer) ----------------------------------------- */

export function SquadLists({ state, onInspect }: { state: MatchState; onInspect: (side: Side, id: string) => void }) {
  return (
    <div className={styles.squads}>
      {(["home", "away"] as const).map((side) => {
        const team = state.teams[side];
        return (
          <section key={side} style={{ "--side": sideAccent[side] } as CSSProperties} aria-label={`${team.name} squad`}>
            <h3 className={styles.squadTitle}>{side === "home" ? "YOUR FIVE" : team.name.toUpperCase()}</h3>
            {[...team.outfield, team.keeperId].map((id) => {
              const card = team.cards[id];
              const line = state.players[lineKey(side, id)];
              const keeper = id === team.keeperId;
              return (
                <button
                  key={id}
                  type="button"
                  className={styles.squadRow}
                  data-off={line?.red || undefined}
                  onClick={() => onInspect(side, id)}
                  aria-label={`${card.name}, ${primaryPosition(card)}, rated ${card.rating}${line?.red ? ", sent off" : ""}`}
                >
                  <b>{card.rating}</b>
                  <span>{card.shortName}</span>
                  <small>{primaryPosition(card)}</small>
                  <em>
                    {line?.goals ? `⚽${line.goals > 1 ? line.goals : ""} ` : ""}
                    {line?.red ? <i className={`${styles.booking} ${styles.bookingRed}`} /> : line?.yellow ? <i className={styles.booking} /> : null}
                    {line ? playerRating(line, keeper).toFixed(1) : ""}
                  </em>
                </button>
              );
            })}
          </section>
        );
      })}
    </div>
  );
}
