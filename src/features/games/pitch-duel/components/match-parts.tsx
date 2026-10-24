"use client";

import type { CSSProperties } from "react";

import { lineKey, minuteLabel } from "../engine/match";
import { lanes } from "../engine/zones";
import type { MatchEvent, MatchState, Side } from "../engine/types";

import { primaryPosition, sideAccent } from "./card-art";
import styles from "./match.module.css";

/* ---- Lineup strip --------------------------------------------------------- */

export function LineupStrip({
  state,
  side,
  activeId,
  onInspect,
}: {
  state: MatchState;
  side: Side;
  activeId: string | null;
  onInspect: (side: Side, id: string) => void;
}) {
  const team = state.teams[side];
  const ids = [...team.outfield].reverse().concat(team.keeperId);
  return (
    <aside
      className={`${styles.strip} ${side === "away" ? styles.stripAway : ""}`}
      style={{ "--side": sideAccent[side] } as CSSProperties}
      aria-label={`${team.name} lineup`}
    >
      <div className={styles.stripTitle}>{side === "home" ? "YOUR FIVE" : team.name.toUpperCase()}</div>
      {ids.map((id) => {
        const card = team.cards[id];
        const line = state.players[lineKey(side, id)];
        const active = id === activeId;
        return (
          <button
            key={id}
            type="button"
            className={`${styles.plate} ${styles.mini} ${active ? styles.miniActive : ""} ${line?.red ? styles.miniOff : ""}`}
            onClick={() => onInspect(side, id)}
            aria-label={`${card.name}, ${primaryPosition(card)}, rated ${card.rating}${line?.red ? ", sent off" : ""}`}
            aria-current={active ? "true" : undefined}
          >
            <span className={styles.miniRating}>{card.rating}</span>
            <span className={styles.miniName}>{card.shortName}</span>
            <span className={styles.miniMeta}>
              {primaryPosition(card)}
              {line?.goals ? <span aria-label={`${line.goals} goals`}>⚽{line.goals > 1 ? line.goals : ""}</span> : null}
              {line?.red ? <i className={`${styles.booking} ${styles.bookingRed}`} aria-label="red card" /> : line?.yellow ? <i className={styles.booking} aria-label="yellow card" /> : null}
            </span>
          </button>
        );
      })}
    </aside>
  );
}

/* ---- Scoreboard ----------------------------------------------------------- */

export function Scoreboard({ state, onQuit, onLog }: { state: MatchState; onQuit: () => void; onLog: () => void }) {
  return (
    <header className={`${styles.plate} ${styles.scoreboard}`}>
      <button type="button" className={styles.iconButton} onClick={onQuit} aria-label="Leave match">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
          <path d="M15 5l-7 7 7 7" />
        </svg>
      </button>
      <span className={`${styles.team} ${styles.teamHome}`}>{state.teams.home.name}</span>
      <div className={styles.score} aria-live="polite" aria-label={`Score ${state.score.home} to ${state.score.away}, ${minuteLabel(state)}`}>
        <span style={{ color: sideAccent.home }}>{state.score.home}</span>
        <span className={styles.clock}>{state.phase === "kickoff" ? "0'" : state.phase === "halftime" ? "HT" : state.phase === "fulltime" ? "FT" : minuteLabel(state)}</span>
        <span style={{ color: sideAccent.away }}>{state.score.away}</span>
      </div>
      <span className={`${styles.team} ${styles.teamAway}`}>{state.opponentName}</span>
      <button type="button" className={styles.iconButton} onClick={onLog} aria-label="Match log">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
          <path d="M4 6h16M4 12h16M4 18h10" />
        </svg>
      </button>
    </header>
  );
}

/* ---- Minimap -------------------------------------------------------------- */

const W = 800;
const H = 210;
const col = W / 8;
const row = H / 3;

export function Minimap({ x, lane, possession, danger }: { x: number; lane: (typeof lanes)[number]; possession: Side; danger: boolean }) {
  const laneIndex = lanes.indexOf(lane);
  const cx = (x - 0.5) * col;
  const cy = (laneIndex + 0.5) * row;
  return (
    <div className={`${styles.plate} ${styles.minimap} ${danger ? styles.danger : ""}`} style={{ "--possession": sideAccent[possession] } as CSSProperties}>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" role="img" aria-label={`Ball in zone ${x} of 8, ${lane} lane`}>
        {Array.from({ length: 8 }, (_, c) =>
          lanes.map((l, r) => (
            <rect key={`${c}-${l}`} x={c * col} y={r * row} width={col} height={row} className={c + 1 === x && l === lane ? styles.zoneHot : styles.zoneCell} />
          )),
        )}
        <rect x="4" y="4" width={W - 8} height={H - 8} className={styles.pitchLine} />
        <line x1={W / 2} y1="4" x2={W / 2} y2={H - 4} className={styles.pitchLine} />
        <circle cx={W / 2} cy={H / 2} r="34" className={styles.pitchLine} />
        <rect x="4" y={row} width={col} height={row} className={styles.pitchLine} />
        <rect x={W - col - 4} y={row} width={col} height={row} className={styles.pitchLine} />
        <rect x="0" y={H / 2 - 22} width="6" height="44" fill={sideAccent.home} />
        <rect x={W - 6} y={H / 2 - 22} width="6" height="44" fill={sideAccent.away} />
        <g className={styles.ball} style={{ transform: `translate(${cx}px, ${cy}px)` }}>
          <circle r="26" className={styles.ballHalo} />
          <circle r="13" className={styles.ballDot} />
        </g>
      </svg>
    </div>
  );
}

/* ---- Log ------------------------------------------------------------------ */

export function EventTicker({ event, onOpen }: { event: MatchEvent | undefined; onOpen: () => void }) {
  return (
    <button type="button" className={styles.ticker} onClick={onOpen} aria-label="Open match log">
      {event ? (
        <>
          <em>{event.minute}</em>
          <span>{event.text}</span>
        </>
      ) : (
        <span>Match log</span>
      )}
    </button>
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
