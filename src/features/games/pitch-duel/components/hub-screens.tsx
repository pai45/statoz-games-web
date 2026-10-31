"use client";

import type { CSSProperties } from "react";

import type { PlayerCard as PlayerCardData } from "@/domain/cards";

import { attacks, defenses, families } from "../engine/actions";
import { formations, type ClubSetup } from "../engine/lineup";
import { lineKey, mvp, ratings } from "../engine/match";
import { divisionFor, divisions, type Opponent } from "../engine/setup";
import type { MatchState } from "../engine/types";
import type { Career } from "../state/career-schema";
import type { MatchSettlement } from "../state/progress";

import { DuelCard, primaryPosition, sideAccent } from "./card-art";
import { StarIcon, SwapIcon } from "./icons";
import { Eyebrow, Pill } from "./ui";
import styles from "./pitch-duel.module.css";

const resultTone = { Victory: "#4ade80", Draw: "#fbbf24", Defeat: "#f87171" } as const;

function teamOvr(ids: string[], cardFor: (id: string) => PlayerCardData | undefined): number {
  const cards = ids.map(cardFor).filter((c): c is PlayerCardData => Boolean(c));
  return cards.length ? Math.round(cards.reduce((sum, c) => sum + c.rating, 0) / cards.length) : 0;
}

/** One squad as a two-column list: position, name, overall. */
function SquadGrid({ ids, cardFor, places }: { ids: string[]; cardFor: (id: string) => PlayerCardData | undefined; places: string[] }) {
  return (
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
      <Eyebrow>CHOOSE YOUR RIVAL</Eyebrow>
      <h1 className={styles.bigTitle}>
        MATCHDAY <span>{divisions[division - 1]}</span>
      </h1>

      <button type="button" className={styles.reroll} onClick={onReroll}>
        <SwapIcon /> REROLL OPPONENT
      </button>

      <section className={styles.rival} aria-label="Opponent">
        <span className={styles.rivalDot} aria-hidden />
        <div>
          <strong>{opponent.name.toUpperCase()}</strong>
          <small>
            {opponent.team.formation} · {formations[opponent.team.formation].label}
          </small>
        </div>
        <b className={styles.rivalOvr}>{teamOvr(theirs, theirCard)}</b>
      </section>

      <section className={styles.panel}>
        <header className={styles.panelHead}>
          <h2>THEIR XI</h2>
        </header>
        <SquadGrid ids={theirs} cardFor={theirCard} places={theirPlaces} />
      </section>

      <section className={styles.panel}>
        <header className={styles.panelHead}>
          <h2>YOUR SQUAD</h2>
          <span className={styles.formationTag}>{club.formation}</span>
        </header>
        <SquadGrid ids={mine} cardFor={cardFor} places={myPlaces} />
        <div className={styles.ovrBig}>
          <StarIcon size={22} /> {teamOvr(mine, cardFor)} OVR
        </div>
      </section>

      <div className={styles.stickyCta}>
        <Pill tone="blue" wide pulse onClick={onKickOff} optionId="kick-off">
          KICK OFF!
        </Pill>
      </div>
    </div>
  );
}

/* ---- League ---------------------------------------------------------------- */

export function LeagueScreen({ career }: { career: Career }) {
  const division = divisionFor(career.points);
  return (
    <div className={styles.stack}>
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
    </div>
  );
}

/* ---- Guide ----------------------------------------------------------------- */

export function GuideScreen({ onReady }: { onReady: () => void }) {
  const defs = Object.values(defenses).filter((d) => d.full.length);
  const cards: [string, string, string[]][] = [
    ["01 · A TURN", "ONE DUEL AT A TIME", [
      "Eleven a side. The ball moves along eight zones and three lanes; the zone decides which of your players and theirs meet.",
      "With the ball, pick a move. Without it, pick how you defend. Stats meet stats, plus a little luck.",
    ]],
    ["02 · MIND GAMES", "THEY PICK IN SECRET", [
      "The other side locks in its choice before you tap. A full counter swings the duel hard; a wrong read swings it your way.",
      "The CPU learns your habits — higher divisions learn faster. Mix it up.",
    ]],
    ["03 · SET PIECES", "TAP THE PICTURE", [
      "Penalty: tap one of five goal zones, or pick a dive.",
      "Free kick: over, around or under the wall. Corner: near post, far post or short. One on one: round, chip or low.",
    ]],
    ["04 · YOUR ELEVEN", "PICK THE SHAPE", [
      "Five formations, each with its own edge. Drag cards between places or bring them in from the squad.",
      "Academy players fill any gap until your collection grows.",
    ]],
  ];
  return (
    <div className={styles.stack}>
      {cards.map(([kicker, title, lines]) => (
        <article key={kicker} className={styles.panel}>
          <small className={styles.kicker}>{kicker}</small>
          <h2 className={styles.guideTitle}>{title}</h2>
          {lines.map((l) => (
            <p key={l}>{l}</p>
          ))}
        </article>
      ))}
      <article className={styles.panel}>
        <small className={styles.kicker}>05 · COUNTERS</small>
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
            .map((f) => `${f} (${Object.values(attacks).filter((a) => a.family === f).map((a) => a.label.toLowerCase()).join(", ")})`)
            .join(" · ")}
        </p>
      </article>
      <div className={styles.stickyCta}>
        <Pill tone="green" wide onClick={onReady}>
          GOT IT
        </Pill>
      </div>
    </div>
  );
}

/* ---- Summary --------------------------------------------------------------- */

export function SummaryScreen({ state, settlement, onNext, onClub }: { state: MatchState; settlement: MatchSettlement; onNext: () => void; onClub: () => void }) {
  const verdict = settlement.result.result;
  const best = mvp(state);
  const bestCard = state.teams[best.side].cards[best.id];
  const list = ratings(state).sort((a, b) => b.rating - a.rating);
  const scorers = state.log.filter((e) => e.kind === "goal");
  return (
    <div className={styles.stack} data-pitch-duel-summary>
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
        <div className={styles.rewards}>
          <span>+{settlement.coins} COINS</span>
          <span>+{settlement.result.points} PTS</span>
          {settlement.promoted ? <span data-tone="green">PROMOTED · {divisions[settlement.promoted - 1]}</span> : null}
          {settlement.prize ? <span data-tone="gold">NEW CARD · {settlement.prize.name} (FICTIONAL)</span> : null}
        </div>
      </section>

      {bestCard ? (
        <section className={styles.mvp} aria-label="Player of the match">
          <DuelCard card={bestCard} size="md" stats={state.teams[best.side].stats[best.id]} />
          <div>
            <small className={styles.kicker}>PLAYER OF THE MATCH</small>
            <strong>{bestCard.name}</strong>
            <b className={styles.mvpScore}>{best.rating.toFixed(1)}</b>
          </div>
        </section>
      ) : null}

      <section className={styles.panel} aria-label="Ratings">
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

      <div className={styles.stickyCta} data-two>
        <Pill tone="grey" back onClick={onClub}>
          CLUB HOUSE
        </Pill>
        <Pill tone="blue" onClick={onNext} optionId="next-match">
          NEXT MATCH
        </Pill>
      </div>
    </div>
  );
}
