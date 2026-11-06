"use client";

import { useEffect, useState, type CSSProperties } from "react";

import type { PlayerCard as PlayerCardData } from "@/domain/cards";

import { usePrefersReducedMotion } from "../../shared/state/use-reduced-motion";
import { attacks, defenses, families } from "../engine/actions";
import { formations, type ClubSetup } from "../engine/lineup";
import { lineKey, mvp, ratings } from "../engine/match";
import { momentumFull, surgeBoost } from "../engine/momentum";
import { divisionFor, divisions, type Opponent } from "../engine/setup";
import type { MatchState } from "../engine/types";
import type { Career } from "../state/career-schema";
import type { MatchSettlement } from "../state/progress";

import { useSound } from "./audio";
import { DuelCard, primaryPosition, sideAccent } from "./card-art";
import { SwapIcon } from "./icons";
import { Eyebrow, Pill } from "./ui";
import styles from "./pitch-duel.module.css";

const resultTone = { Victory: "#4ade80", Draw: "#fbbf24", Defeat: "#f87171" } as const;

/** Counts up to `target`, ticking as it goes; instant with reduced motion. */
function useCountUp(target: number, delay = 0): number {
  const sound = useSound();
  const reduced = usePrefersReducedMotion();
  const [shown, setShown] = useState(0);
  const [started, setStarted] = useState(delay === 0);
  useEffect(() => {
    if (started) return;
    const t = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(t);
  }, [started, delay]);
  useEffect(() => {
    if (!started || shown >= target) return;
    const t = setTimeout(
      () => {
        const next = reduced ? target : Math.min(target, shown + Math.max(1, Math.ceil((target - shown) / 6)));
        setShown(next);
        sound.tick(next);
      },
      reduced ? 0 : 55,
    );
    return () => clearTimeout(t);
  }, [started, shown, target, reduced, sound]);
  return shown;
}

/** Confetti for a win: thirty pieces in the game's colours. */
const confetti = Array.from({ length: 30 }, (_, i) => ({
  x: (i * 41) % 100,
  delay: ((i * 37) % 30) / 100,
  spin: ((i * 67) % 360) - 180,
  drift: ((i * 23) % 24) - 12,
  colour: ["#4ade80", "#fbbf24", "#ffffff", "#a855f7", "#38bdf8", "#ec4899"][i % 6],
}));

function teamOvr(ids: string[], cardFor: (id: string) => PlayerCardData | undefined): number {
  const cards = ids.map(cardFor).filter((c): c is PlayerCardData => Boolean(c));
  return cards.length ? Math.round(cards.reduce((sum, c) => sum + c.rating, 0) / cards.length) : 0;
}

/**
 * One side's eleven as a broadcast team sheet: position, name, overall, one
 * row each, keeper first. The rows share the height of the column.
 */
function TeamSheet({
  title,
  side,
  formation,
  ids,
  cardFor,
  places,
}: {
  title: string;
  side: "home" | "away";
  formation: string;
  ids: string[];
  cardFor: (id: string) => PlayerCardData | undefined;
  places: string[];
}) {
  return (
    <section className={styles.teamSheet} data-side={side} aria-label={title}>
      <header className={styles.sheetTitle}>
        <h2>{title}</h2>
        <span className={styles.formationTag}>{formation}</span>
      </header>
      <ol className={styles.squadGrid}>
        {ids.map((id, i) => {
          const card = cardFor(id);
          if (!card) return null;
          return (
            <li key={id}>
              <small>{places[i]}</small>
              <span>{card.name}</span>
              <b>{card.rating}</b>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

/* ---- Prematch -------------------------------------------------------------- */

export function PrematchScreen({
  club,
  opponent,
  division,
  cardFor,
  onKickOff,
  onReroll,
}: {
  club: ClubSetup;
  opponent: Opponent;
  division: number;
  cardFor: (id: string) => PlayerCardData | undefined;
  onKickOff: () => void;
  onReroll: () => void;
}) {
  const mine = [club.keeperId, ...club.outfield];
  const theirs = [opponent.team.keeperId, ...opponent.team.outfield];
  const theirCard = (id: string) => opponent.team.cards[id] ?? cardFor(id);
  const myPlaces = ["GK", ...formations[club.formation].slots.map((s) => s.pos)];
  const theirPlaces = ["GK", ...formations[opponent.team.formation].slots.map((s) => s.pos)];
  return (
    <div className={styles.prematch}>
      <TeamSheet title="YOUR XI" side="home" formation={club.formation} ids={mine} cardFor={cardFor} places={myPlaces} />

      <section className={styles.versus} aria-label="Opponent">
        <Eyebrow>CHOOSE YOUR RIVAL</Eyebrow>
        <h1 className={styles.bigTitle}>
          DIV {division} <span>{divisions[division - 1]}</span>
        </h1>
        <div className={styles.vsRow}>
          <span className={styles.vsOvr} data-side="home">
            <small>YOU</small>
            <b>{teamOvr(mine, cardFor)}</b>
          </span>
          <span className={styles.vsWord} aria-hidden>
            VS
          </span>
          <span className={styles.vsOvr} data-side="away">
            <small>THEM</small>
            <b>{teamOvr(theirs, theirCard)}</b>
          </span>
        </div>
        <div className={styles.rival}>
          <span className={styles.rivalDot} aria-hidden />
          <div>
            <strong>{opponent.name.toUpperCase()}</strong>
            <small>
              {opponent.team.formation} · {formations[opponent.team.formation].label}
            </small>
          </div>
        </div>
        <button type="button" className={styles.reroll} onClick={onReroll}>
          <SwapIcon /> REROLL OPPONENT
        </button>
        <Pill tone="blue" wide pulse onClick={onKickOff} optionId="kick-off">
          KICK OFF!
        </Pill>
      </section>

      <TeamSheet title={opponent.name.toUpperCase()} side="away" formation={opponent.team.formation} ids={theirs} cardFor={theirCard} places={theirPlaces} />
    </div>
  );
}

/* ---- League ---------------------------------------------------------------- */

export function LeagueScreen({ career }: { career: Career }) {
  const division = divisionFor(career.points);
  return (
    <div className={styles.columns}>
      <section className={styles.column}>
        <Eyebrow>ROAD TO THE TOP</Eyebrow>
        <ol className={styles.ladder}>
          {divisions
            .map((name, i) => ({ name, d: i + 1 }))
            .reverse()
            .map(({ name, d }) => (
              <li key={name} data-state={d === division ? "current" : d < division ? "done" : "locked"}>
                <b>DIV {d}</b>
                <span>{name}</span>
                <em>{d === division ? `${career.points % 9}/9` : d < division ? "✓" : `${(d - 1) * 9} PTS`}</em>
              </li>
            ))}
        </ol>
        <p className={styles.muted}>Win 3 · Draw 1 · Every 9 points promotes you and unlocks a fictional club card.</p>
      </section>

      <section className={styles.column}>
        <Eyebrow>RECENT RESULTS</Eyebrow>
        {career.history.length ? (
          <ol className={styles.history}>
            {career.history.slice(0, 10).map((r) => (
              <li key={r.id} style={{ "--tone": resultTone[r.result] } as CSSProperties}>
                <i>{r.result[0]}</i>
                <span>vs {r.opponentName}</span>
                <b>
                  {r.playerScore}–{r.opponentScore}
                </b>
              </li>
            ))}
          </ol>
        ) : (
          <p className={styles.muted}>No matches yet. Kick off to start your season.</p>
        )}
      </section>
    </div>
  );
}

/* ---- Guide ----------------------------------------------------------------- */

export function GuideScreen({ onReady, onReplayDebut }: { onReady: () => void; onReplayDebut?: () => void }) {
  const defs = Object.values(defenses).filter((d) => d.full.length);
  const cards: [string, string, string[]][] = [
    [
      "01 · A TURN",
      "ONE DUEL AT A TIME",
      [
        "Eleven a side. The ball moves along eight zones and three lanes; the zone decides which of your players and theirs meet.",
        "With the ball, pick a move. Without it, pick how you defend. Stats meet stats, plus a little luck.",
      ],
    ],
    [
      "02 · MIND GAMES",
      "THEY PICK IN SECRET",
      [
        "The other side locks in its choice before you tap. A full counter swings the duel hard; a wrong read swings it your way.",
        "The CPU learns your habits — higher divisions learn faster. Mix it up.",
      ],
    ],
    [
      "03 · SET PIECES",
      "TAP THE PICTURE",
      [
        "Penalty: tap one of five goal zones, or pick a dive.",
        "Free kick: over, around or under the wall. Corner: near post, far post or short. One on one: round, chip or low.",
      ],
    ],
    [
      "04 · YOUR ELEVEN",
      "PICK THE SHAPE",
      [
        "Five formations, each with its own edge. Drag cards between places or bring them in from the squad.",
        "Academy players fill any gap until your collection grows.",
      ],
    ],
    [
      "05 · MOMENTUM",
      "FILL THE BAR, THEN SURGE",
      [
        `Winning duels, reading their move, saves and goals fill your momentum bar under the score. At ${momentumFull}% it becomes a surge.`,
        `Arm the gold SURGE chip and your next pick gets a big edge (+${surgeBoost}). It waits until you use it. They have a surge too, and spend it near your goal.`,
      ],
    ],
  ];
  return (
    <div className={styles.guide}>
      {cards.map(([kicker, title, lines]) => (
        <article key={kicker} className={styles.panel}>
          <small className={styles.kicker}>{kicker}</small>
          <h2 className={styles.guideTitle}>{title}</h2>
          {lines.map((l) => (
            <p key={l}>{l}</p>
          ))}
        </article>
      ))}
      <article className={styles.panel} data-wide>
        <small className={styles.kicker}>06 · COUNTERS</small>
        <table className={styles.counterTable}>
          <thead>
            <tr>
              <th>DEFENCE</th>
              <th>STOPS</th>
              <th>HALF-STOPS</th>
            </tr>
          </thead>
          <tbody>
            {defs.map((d) => (
              <tr key={d.id}>
                <td>{d.label}</td>
                <td>{d.full.join(", ")}</td>
                <td>{d.partial.join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className={styles.muted}>
          Moves:{" "}
          {families
            .map(
              (f) =>
                `${f} (${Object.values(attacks)
                  .filter((a) => a.family === f)
                  .map((a) => a.label.toLowerCase())
                  .join(", ")})`,
            )
            .join(" · ")}
        </p>
      </article>
      <div className={styles.stickyCta}>
        {onReplayDebut ? (
          <Pill tone="light" onClick={onReplayDebut} optionId="replay-debut">
            REPLAY DEBUT XI
          </Pill>
        ) : null}
        <Pill tone="green" wide onClick={onReady}>
          GOT IT
        </Pill>
      </div>
    </div>
  );
}

/* ---- Summary --------------------------------------------------------------- */

export function SummaryScreen({
  state,
  settlement,
  onNext,
  onClub,
}: {
  state: MatchState;
  settlement: MatchSettlement;
  onNext: () => void;
  onClub: () => void;
}) {
  const verdict = settlement.result.result;
  const best = mvp(state);
  const bestCard = state.teams[best.side].cards[best.id];
  const list = ratings(state).sort((a, b) => b.rating - a.rating);
  const scorers = state.log.filter((e) => e.kind === "goal");
  const sound = useSound();
  const coins = useCountUp(settlement.coins, 700);
  const points = useCountUp(settlement.result.points, 1300);

  // The full-time sting and the crowd's verdict, once.
  useEffect(() => {
    sound.sting(verdict === "Victory" ? "win" : verdict === "Draw" ? "draw" : "loss");
    if (verdict === "Victory") sound.swell(0.45);
    sound.crowd(verdict === "Victory" ? 0.4 : 0.18);
    sound.chant(verdict === "Victory" ? 0.6 : 0);
  }, [sound, verdict]);

  return (
    <div className={styles.summary} data-pitch-duel-summary data-verdict={verdict}>
      {verdict === "Victory" ? (
        <div className={styles.winConfetti} aria-hidden>
          {confetti.map((c, i) => (
            <i key={i} style={{ left: `${c.x}%`, "--delay": `${c.delay}s`, "--spin": `${c.spin}deg`, "--drift": `${c.drift}vw`, background: c.colour } as CSSProperties} />
          ))}
        </div>
      ) : null}
      <div className={styles.resultColumn}>
        <section className={styles.resultCard} style={{ "--tone": resultTone[verdict] } as CSSProperties} aria-label="Result">
          <small className={styles.kicker}>FULL-TIME · DIVISION {state.division}</small>
          <h1 className={styles.verdict}>{verdict.toUpperCase()}</h1>
          <div className={styles.bigScore}>
            <span style={{ color: sideAccent.home }}>{state.score.home}</span>
            <i>–</i>
            <span style={{ color: sideAccent.away }}>{state.score.away}</span>
          </div>
          <p className={styles.muted}>
            You vs {state.opponentName} · {state.decisions} decisions
          </p>
          {scorers.length ? (
            <ul className={styles.scorers}>
              {scorers.map((e) => (
                <li key={e.id} style={{ color: sideAccent[e.side] }}>
                  ⚽ {e.minute} {state.teams[e.side].cards[e.playerIds[0]]?.shortName}
                </li>
              ))}
            </ul>
          ) : null}
          <div className={styles.rewards} aria-label={`+${settlement.coins} coins, +${settlement.result.points} points`}>
            <span data-counting={coins < settlement.coins || undefined}>+{coins} COINS</span>
            <span data-counting={points < settlement.result.points || undefined}>+{points} PTS</span>
            {settlement.promoted ? <span data-tone="green">PROMOTED · {divisions[settlement.promoted - 1]}</span> : null}
            {settlement.prize ? <span data-tone="gold">NEW CARD · {settlement.prize.name} (FICTIONAL)</span> : null}
          </div>
        </section>
        <div className={styles.ctaPair}>
          <Pill tone="grey" back onClick={onClub}>
            CLUB HOUSE
          </Pill>
          <Pill tone="blue" onClick={onNext} optionId="next-match">
            NEXT MATCH
          </Pill>
        </div>
      </div>

      {bestCard ? (
        <section className={styles.mvp} aria-label="Player of the match">
          <small className={styles.kicker}>PLAYER OF THE MATCH</small>
          <DuelCard card={bestCard} size="md" stats={state.teams[best.side].stats[best.id]} />
          <span>
            <strong>{bestCard.name}</strong>
            <b className={styles.mvpScore}>{best.rating.toFixed(1)}</b>
          </span>
        </section>
      ) : null}

      <section className={styles.panel} data-ratings aria-label="Ratings">
        <header className={styles.panelHead}>
          <h2>RATINGS</h2>
          <small className={styles.muted}>
            Reads {state.stats.home.readsWon}–{state.stats.away.readsWon} · Shots {state.stats.home.shots}–{state.stats.away.shots}
          </small>
        </header>
        <ol className={styles.ratingList}>
          {list.map((r) => {
            const line = state.players[lineKey(r.side, r.id)];
            const card = state.teams[r.side].cards[r.id];
            return (
              <li key={`${r.side}:${r.id}`} style={{ "--side": sideAccent[r.side] } as CSSProperties}>
                <i aria-hidden />
                <small>{card ? primaryPosition(card) : ""}</small>
                <span>
                  {card?.shortName}
                  {line.goals ? ` ⚽${line.goals > 1 ? line.goals : ""}` : ""}
                  {line.red ? " · RED" : ""}
                </span>
                <b>{r.rating.toFixed(1)}</b>
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
}
