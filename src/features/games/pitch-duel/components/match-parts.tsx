"use client";

import type { CSSProperties } from "react";

import { lineKey, minuteLabel, playerRating } from "../engine/match";
import type { MatchEvent, MatchState, Side } from "../engine/types";

import { primaryPosition, sideAccent } from "./card-art";
import { LogIcon, PitchIcon } from "./icons";
import { columnX, laneY, type PitchScene } from "./pitch-layout";
import styles from "./match.module.css";

/* ---- Scoreboard ----------------------------------------------------------- */

export function clockFor(state: MatchState): string {
  return state.phase === "kickoff" ? "0'" : state.phase === "halftime" ? "HT" : state.phase === "fulltime" ? "FT" : minuteLabel(state);
}

/**
 * The top bar: back, your lineup, the trapezoid scorebug (YOUR TEAM · GAME
 * TIME · OPP. TEAM on one row, with the shimmer under it), their lineup, events.
 */
export function Scoreboard({
  state,
  onQuit,
  onLog,
  onSquad,
}: {
  state: MatchState;
  onQuit: () => void;
  onLog: () => void;
  onSquad: (side: Side) => void;
}) {
  const clock = clockFor(state);
  return (
    <header className={styles.scoreboard}>
      <button type="button" className={styles.scoreIcon} onClick={onQuit} aria-label="Leave match">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" aria-hidden>
          <path d="M15 5l-7 7 7 7" />
        </svg>
      </button>
      <button type="button" className={styles.tab} data-side="home" onClick={() => onSquad("home")} aria-label="Your lineup">
        <PitchIcon size={16} /> <span>YOUR XI</span>
      </button>
      <div className={styles.scoreTrap} aria-live="polite" aria-label={`You ${state.score.home}, ${state.opponentName} ${state.score.away}, ${clock}`}>
        <div className={styles.scoreTeam} data-side="home" style={{ "--side": sideAccent.home } as CSSProperties}>
          <small>YOUR TEAM</small>
          <b key={`h${state.score.home}`}>{state.score.home}</b>
        </div>
        <div className={styles.gameTime}>
          <small>GAME TIME</small>
          <b key={clock}>{clock}</b>
        </div>
        <div className={styles.scoreTeam} data-side="away" style={{ "--side": sideAccent.away } as CSSProperties}>
          <small title={state.opponentName}>{state.opponentName}</small>
          <b key={`a${state.score.away}`}>{state.score.away}</b>
        </div>
        <i className={styles.shimmer} aria-hidden />
      </div>
      <button type="button" className={styles.tab} data-side="away" onClick={() => onSquad("away")} aria-label="Opponent lineup">
        <PitchIcon size={16} /> <span>OPP. XI</span>
      </button>
      <button type="button" className={styles.scoreIcon} onClick={onLog} aria-label="Match events and stats">
        <LogIcon size={16} />
      </button>
    </header>
  );
}

/* ---- Match map ------------------------------------------------------------ */

/**
 * The neon match map: a landscape pitch with all twenty-two players, home
 * attacking to the right (scene coordinates map straight onto it). It turns
 * red when they are near your goal.
 */
export function MatchMap({
  state,
  scene,
  danger,
  big,
  onOpen,
}: {
  state: MatchState;
  scene: PitchScene;
  danger: boolean;
  big?: boolean;
  onOpen?: () => void;
}) {
  const ball = scene.ball;
  const body = (
    <>
      <span className={styles.mapField} aria-hidden>
        <svg viewBox="0 0 90 60" preserveAspectRatio="none">
          <rect x="1" y="1" width="88" height="58" rx="1" />
          <line x1="45" y1="1" x2="45" y2="59" />
          <circle cx="45" cy="30" r="7" />
          <rect x="1" y="15" width="13" height="30" />
          <rect x="1" y="23" width="5" height="14" />
          <rect x="76" y="15" width="13" height="30" />
          <rect x="84" y="23" width="5" height="14" />
        </svg>
        {scene.tokens.map((t) => (
            <i
              key={`${t.side}:${t.id}`}
              className={styles.mapDot}
              data-side={t.side}
              data-duel={t.duel || undefined}
              data-keeper={t.keeper || undefined}
              style={{ left: `${t.x * 100}%`, top: `${t.y * 100}%` }}
              title={big ? state.teams[t.side].cards[t.id]?.shortName : undefined}
            >
              {big && t.duel ? <em>{state.teams[t.side].cards[t.id]?.shortName}</em> : null}
            </i>
        ))}
        <i className={styles.mapBall} style={{ left: `${ball.x * 100}%`, top: `${ball.y * 100}%` }} />
      </span>
      {big ? null : <span className={styles.mapLabel}>MATCH MAP</span>}
    </>
  );
  if (onOpen)
    return (
      <button type="button" className={styles.map} data-danger={danger || undefined} onClick={onOpen} aria-label="Match map. Open the big map and stats">
        {body}
      </button>
    );
  return (
    <div className={styles.map} data-big data-danger={danger || undefined} aria-label="Match map" role="img">
      {body}
    </div>
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

/* ---- Events --------------------------------------------------------------- */

/** The latest event under the map, with a Show button for the full log. */
export function EventsBar({ event, onShow }: { event: MatchEvent | undefined; onShow: () => void }) {
  return (
    <button type="button" className={styles.eventsBar} onClick={onShow} aria-label="Show match events">
      <span className={styles.eventsTitle}>MATCH EVENTS</span>
      <span key={event?.id ?? "none"} className={styles.eventsLatest} style={{ "--side": event ? sideAccent[event.side] : undefined } as CSSProperties}>
        {event ? (
          <>
            <em>{event.minute}</em> {event.text}
          </>
        ) : (
          "Kick-off is coming"
        )}
      </span>
      <span className={styles.eventsToggle}>Show</span>
    </button>
  );
}

export function EventLog({ state }: { state: MatchState }) {
  const shown = state.log.filter((e) => e.kind !== "duel").slice().reverse();
  if (!shown.length) return <p className={styles.muted}>Nothing yet. The log fills as the match goes.</p>;
  return (
    <ol className={styles.log}>
      {shown.map((e) => (
        <li key={e.id} data-kind={e.kind} style={{ "--side": sideAccent[e.side] } as CSSProperties}>
          <time>[{e.minute}]</time>
          <span>{e.text}</span>
        </li>
      ))}
    </ol>
  );
}

export function PeriodStats({ state }: { state: MatchState }) {
  const h = state.stats.home;
  const a = state.stats.away;
  const rows: [string, number, number][] = [
    ["SHOTS", h.shots, a.shots],
    ["ON TARGET", h.onTarget, a.onTarget],
    ["DUELS WON", h.duelsWon, a.duelsWon],
    ["READS WON", h.readsWon, a.readsWon],
    ["CORNERS", h.corners, a.corners],
    ["FOULS", h.fouls, a.fouls],
  ];
  return (
    <div className={styles.periodStats}>
      {rows.map(([label, x, y]) => {
        const total = x + y || 1;
        return (
          <div key={label} className={styles.statRow} style={{ "--home": `${(x / total) * 100}%` } as CSSProperties}>
            <b>{x}</b>
            <span>{label}</span>
            <b>{y}</b>
            <i aria-hidden />
          </div>
        );
      })}
    </div>
  );
}

/* ---- Squads --------------------------------------------------------------- */

function ratingTone(value: number): string {
  return value >= 7 ? "#4ade80" : value >= 6.4 ? "#facc15" : value >= 5.8 ? "#fb923c" : "#f87171";
}

/** One side's eleven as Ballers lists them: position, name, match rating chip and overall. */
export function SquadList({ state, side, onInspect }: { state: MatchState; side: Side; onInspect: (id: string) => void }) {
  const team = state.teams[side];
  const ovr = Math.round([team.keeperId, ...team.outfield].reduce((sum, id) => sum + (team.cards[id]?.rating ?? 0), 0) / (team.outfield.length + 1));
  return (
    <section className={styles.squad} aria-label={`${side === "home" ? "Your" : team.name} lineup`}>
      <header className={styles.squadHead}>
        <span>{side === "home" ? "YOUR LINEUP" : `${team.name.toUpperCase()}`}</span>
        <b>★ {ovr} OVR</b>
      </header>
      {[team.keeperId, ...team.outfield].map((id) => {
        const card = team.cards[id];
        const line = state.players[lineKey(side, id)];
        const keeper = id === team.keeperId;
        const rating = line ? playerRating(line, keeper) : 6;
        return (
          <button
            key={id}
            type="button"
            className={styles.squadRow}
            data-off={line?.red || undefined}
            onClick={() => onInspect(id)}
            aria-label={`${card.name}, ${primaryPosition(card)}, rated ${card.rating}${line?.red ? ", sent off" : ""}`}
          >
            <small>{keeper ? "GK" : primaryPosition(card)}</small>
            <span>
              {card.name}
              {line?.goals ? <i className={styles.goalBadge}>⚽ {line.goals}</i> : null}
              {line?.red ? <i className={styles.cardRed} aria-label="Red card" /> : line?.yellow ? <i className={styles.cardYellow} aria-label="Yellow card" /> : null}
            </span>
            <em style={{ "--chip": ratingTone(rating) } as CSSProperties}>{rating.toFixed(1)}</em>
            <b>{card.rating}</b>
          </button>
        );
      })}
    </section>
  );
}
