"use client";

import { useMemo, useState, type CSSProperties } from "react";

import { Button, FilterChips, accentVar, feedbackVar } from "@/design-system";
import type { ActionCard, PlayerCard as PlayerCardData } from "@/domain/cards";

import { attacks, defenses, families } from "../engine/actions";
import { formationIds, formations, lineupErrors, maxTactics, type ClubSetup } from "../engine/lineup";
import { lineKey, mvp, ratings } from "../engine/match";
import { divisionFor, divisions } from "../engine/setup";
import { deriveStats } from "../engine/stats";
import { effectFor } from "../engine/tactics";
import type { FormationId, MatchState } from "../engine/types";
import type { Career } from "../state/career-schema";
import type { MatchSettlement } from "../state/progress";

import { DuelCard, StatBlock, primaryPosition, roleAccent, sideAccent } from "./card-art";
import styles from "./pitch-duel.module.css";

const resultTone = { Victory: accentVar("lime"), Draw: accentVar("gold"), Defeat: feedbackVar("danger") } as const;

/* ---- Lineup --------------------------------------------------------------- */

type SlotKey = "keeper" | 0 | 1 | 2 | 3;

export function LineupScreen({
  initial,
  ownedPlayers,
  ownedActions,
  cardFor,
  actionFor,
  onSave,
}: {
  initial: ClubSetup;
  ownedPlayers: string[];
  ownedActions: string[];
  cardFor: (id: string) => PlayerCardData | undefined;
  actionFor: (id: string) => ActionCard | undefined;
  onSave: (club: ClubSetup) => void;
}) {
  const [club, setClub] = useState<ClubSetup>(initial);
  const [slot, setSlot] = useState<SlotKey>("keeper");
  const [tab, setTab] = useState<"PLAYERS" | "TACTICS">("PLAYERS");
  const errors = lineupErrors(club, ownedPlayers, ownedActions, cardFor);
  const shape = formations[club.formation];
  const lineOrder = ["back", "mid", "front"] as const;
  const lines = lineOrder.filter((line) => shape.slots.some((s) => s.line === line));

  const pool = useMemo(
    () =>
      ownedPlayers
        .map(cardFor)
        .filter((c): c is PlayerCardData => Boolean(c))
        .filter((c) => (slot === "keeper" ? c.role === "goalkeeper" : c.role !== "goalkeeper"))
        .sort((a, b) => b.rating - a.rating),
    [ownedPlayers, cardFor, slot],
  );

  const selectedId = slot === "keeper" ? club.keeperId : club.outfield[slot];
  const selected = selectedId ? cardFor(selectedId) : undefined;

  const assign = (id: string) => {
    if (slot === "keeper") return setClub({ ...club, keeperId: id });
    const outfield = [...club.outfield];
    const existing = outfield.indexOf(id);
    if (existing >= 0) outfield[existing] = outfield[slot] ?? "";
    outfield[slot] = id;
    setClub({ ...club, outfield });
  };

  const toggleTactic = (id: string) => {
    const has = club.tactics.includes(id);
    if (has) setClub({ ...club, tactics: club.tactics.filter((t) => t !== id) });
    else if (club.tactics.length < maxTactics) setClub({ ...club, tactics: [...club.tactics, id] });
  };

  const actions = ownedActions.map(actionFor).filter((a): a is ActionCard => Boolean(a)).sort((a, b) => b.power - a.power);

  const slotButton = (key: SlotKey, label: string) => {
    const id = key === "keeper" ? club.keeperId : club.outfield[key];
    const card = id ? cardFor(id) : undefined;
    const tone = key === "keeper" ? roleAccent.goalkeeper : card ? roleAccent[card.role] : accentVar("cyan");
    return (
      <button key={String(key)} type="button" className={`${styles.plate} ${styles.slot}`} style={{ "--tone": tone } as CSSProperties} aria-pressed={slot === key} onClick={() => { setSlot(key); setTab("PLAYERS"); }}>
        <small>{label}{card ? ` · ${card.rating}` : ""}</small>
        <b>{card?.shortName ?? "EMPTY"}</b>
      </button>
    );
  };

  return (
    <div className={styles.lineup}>
      <section className={`${styles.plate} ${styles.panel}`} aria-label="Formation">
        <div className={styles.panelHead}>
          <div>
            <div className={styles.kicker}>FORMATION</div>
            <strong>{club.formation} {shape.label}</strong>
          </div>
          <FilterChips label="Formation" options={formationIds} selected={club.formation} onSelect={(f) => setClub({ ...club, formation: f as FormationId })} />
        </div>
        <div className={`${styles.plate} ${styles.field}`} style={{ "--lines": lines.length } as CSSProperties}>
          <div className={styles.fieldLine}>{slotButton("keeper", "GK")}</div>
          {lines.map((line) => (
            <div key={line} className={styles.fieldLine}>
              {shape.slots.map((s, i) => (s.line === line ? slotButton(i as SlotKey, `${line.toUpperCase()} · ${s.lanes.length === 3 ? "ALL" : s.lanes.map((l) => l[0].toUpperCase()).join("")}`) : null))}
            </div>
          ))}
        </div>
        <p className={styles.muted} style={{ margin: 0, fontSize: "var(--ds-text-2xs)" }}>{shape.blurb}</p>
      </section>

      <section className={`${styles.plate} ${styles.panel}`} aria-label="Squad">
        <div className={styles.panelHead}>
          <FilterChips label="Squad view" options={["PLAYERS", `TACTICS ${club.tactics.length}/${maxTactics}`]} selected={tab === "PLAYERS" ? "PLAYERS" : `TACTICS ${club.tactics.length}/${maxTactics}`} onSelect={(v) => setTab(v === "PLAYERS" ? "PLAYERS" : "TACTICS")} />
          <Button size="md" accent={accentVar("lime")} glow disabled={errors.length > 0} onClick={() => onSave(club)}>SAVE ▶</Button>
        </div>

        {tab === "PLAYERS" ? (
          <div className={styles.collection} role="listbox" aria-label={slot === "keeper" ? "Keepers" : "Outfield players"}>
            {pool.map((card) => {
              const stats = deriveStats(card);
              return (
                <button
                  key={card.id}
                  type="button"
                  role="option"
                  aria-selected={card.id === selectedId}
                  className={`${styles.plate} ${styles.pickCard}`}
                  style={{ "--tone": roleAccent[card.role] } as CSSProperties}
                  onClick={() => assign(card.id)}
                >
                  <span className={styles.pickRating}>{card.rating}</span>
                  <b>{card.shortName}</b>
                  <small>{card.id.startsWith("pd2-") ? "FICTIONAL · " : ""}{primaryPosition(card)} · {card.role === "goalkeeper" ? `KEEP ${stats.keep}` : `SHO ${stats.sho} · DEF ${stats.def}`}</small>
                </button>
              );
            })}
            {!pool.length ? <p className={styles.muted}>Open packs to add {slot === "keeper" ? "a keeper" : "outfield players"}.</p> : null}
          </div>
        ) : (
          <div className={styles.collection} role="listbox" aria-label="Tactic cards">
            {actions.map((a) => {
              const picked = club.tactics.includes(a.id);
              return (
                <button key={a.id} type="button" role="option" aria-selected={picked} disabled={!picked && club.tactics.length >= maxTactics} className={`${styles.plate} ${styles.pickCard}`} style={{ "--tone": accentVar("pink") } as CSSProperties} onClick={() => toggleTactic(a.id)}>
                  <span className={styles.pickRating}>{a.power}</span>
                  <b>{a.title}</b>
                  <small>{a.tier.toUpperCase()} · {effectFor(a).summary}</small>
                </button>
              );
            })}
            {!actions.length ? <p className={styles.muted}>No tactic cards yet — they come in packs.</p> : null}
          </div>
        )}

        <div className={styles.detailRow}>
          {tab === "PLAYERS" && selected ? <StatBlock stats={deriveStats(selected)} keeper={selected.role === "goalkeeper"} /> : null}
          {errors.length ? <p className={styles.errors}>{errors[0]}</p> : null}
        </div>
      </section>
    </div>
  );
}

/* ---- League --------------------------------------------------------------- */

export function LeagueScreen({ career }: { career: Career }) {
  const division = divisionFor(career.points);
  return (
    <div className={styles.columns}>
      <section className={`${styles.plate} ${styles.guideCard}`} aria-label="Divisions">
        <div className={styles.kicker}>ROAD TO THE TOP</div>
        <div className={styles.ladder}>
          {divisions.map((name, i) => {
            const d = 5 - i;
            const label = divisions[d - 1];
            return (
              <div key={name} className={`${styles.plate} ${styles.rung} ${d === division ? styles.rungCurrent : d < division ? styles.rungDone : ""}`}>
                <span>DIV {d} · {label}</span>
                <span>{d === division ? `${career.points % 9}/9` : d < division ? "✓" : `${(d - 1) * 9} PTS`}</span>
              </div>
            );
          })}
        </div>
        <p className={styles.muted} style={{ fontSize: "var(--ds-text-2xs)" }}>Win 3 · Draw 1 · Every 9 points promotes you and unlocks a fictional club card.</p>
      </section>
      <section className={`${styles.plate} ${styles.guideCard}`} aria-label="Recent results">
        <div className={styles.kicker}>RECENT RESULTS</div>
        {career.history.length ? (
          <ol className={styles.history}>
            {career.history.slice(0, 10).map((r) => (
              <li key={r.id}>
                <span className={styles.resultMark} style={{ "--tone": resultTone[r.result] } as CSSProperties}>{r.result[0]}</span>
                <span>vs {r.opponentName}</span>
                <b>{r.playerScore}–{r.opponentScore}</b>
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

/* ---- Guide ---------------------------------------------------------------- */

export function GuideScreen({ onReady }: { onReady: () => void }) {
  const defs = Object.values(defenses).filter((d) => d.full.length);
  return (
    <div style={{ display: "grid", gap: "var(--gap)" }}>
      <div className={styles.guide}>
        <article className={`${styles.plate} ${styles.guideCard}`}>
          <div className={styles.kicker}>01 · A TURN</div>
          <h2>ONE DUEL AT A TIME</h2>
          <p>The ball moves along eight zones and three lanes. With the ball, pick a move from the buttons for that spot. Without it, pick how you defend.</p>
          <p>Your card&apos;s stats meet theirs, plus a little luck.</p>
        </article>
        <article className={`${styles.plate} ${styles.guideCard}`}>
          <div className={styles.kicker}>02 · MIND GAMES</div>
          <h2>THEY PICK IN SECRET</h2>
          <p>The other side locks in its choice before you tap. A full counter swings the duel hard; a wrong read swings it your way.</p>
          <p>The CPU learns your habits — higher divisions learn faster. Mix it up.</p>
        </article>
        <article className={`${styles.plate} ${styles.guideCard}`}>
          <div className={styles.kicker}>03 · SET PIECES</div>
          <h2>PICK ONE, THEY PICK ONE</h2>
          <ul>
            <li>Penalty: aim vs dive</li>
            <li>Free kick: over / around / low vs the wall</li>
            <li>Corner: near / far / short vs marking</li>
            <li>One on one: round / chip / low vs rush or stay</li>
          </ul>
        </article>
        <article className={`${styles.plate} ${styles.guideCard}`}>
          <div className={styles.kicker}>04 · COUNTERS</div>
          <table className={styles.counterTable}>
            <thead><tr><th>DEFENCE</th><th>STOPS</th><th>HALF-STOPS</th></tr></thead>
            <tbody>
              {defs.map((d) => <tr key={d.id}><td>{d.label}</td><td>{d.full.join(", ")}</td><td>{d.partial.join(", ")}</td></tr>)}
            </tbody>
          </table>
          <p>Moves: {families.map((f) => `${f} (${Object.values(attacks).filter((a) => a.family === f).map((a) => a.label.toLowerCase()).join(", ")})`).join(" · ")}</p>
        </article>
      </div>
      <div className={styles.actions}>
        <Button size="lg" glow accent={accentVar("lime")} onClick={onReady}>GOT IT ▶</Button>
      </div>
    </div>
  );
}

/* ---- Summary -------------------------------------------------------------- */

export function SummaryScreen({ state, settlement, onNext, onClub }: { state: MatchState; settlement: MatchSettlement; onNext: () => void; onClub: () => void }) {
  const verdict = settlement.result.result;
  const tone = resultTone[verdict];
  const best = mvp(state);
  const bestCard = state.teams[best.side].cards[best.id];
  const list = ratings(state).sort((a, b) => b.rating - a.rating);
  const scorers = state.log.filter((e) => e.kind === "goal");
  return (
    <div className={styles.summary}>
      <section className={`${styles.plate} ${styles.scoreCard}`} style={{ "--tone": tone } as CSSProperties} aria-label="Result">
        <div className={styles.kicker}>FULL-TIME · DIVISION {state.division}</div>
        <h1 className={styles.verdict}>{verdict.toUpperCase()}</h1>
        <div className={styles.bigScore}>
          <span style={{ color: sideAccent.home }}>{state.score.home}</span> – <span style={{ color: sideAccent.away }}>{state.score.away}</span>
        </div>
        <div className={styles.muted}>{state.teams.home.name} vs {state.opponentName} · {state.decisions} decisions</div>
        {scorers.length ? (
          <ul className={styles.scorers}>
            {scorers.map((e) => <li key={e.id} style={{ color: sideAccent[e.side] }}>{e.minute} {state.teams[e.side].cards[e.playerIds[0]]?.shortName}</li>)}
          </ul>
        ) : null}
        <div className={styles.rewards}>
          <span className={`${styles.plate} ${styles.chip}`}>+{settlement.coins} COINS</span>
          <span className={`${styles.plate} ${styles.chip}`}>+{settlement.result.points} PTS</span>
          {settlement.promoted ? <span className={`${styles.plate} ${styles.chip}`} style={{ "--accent": accentVar("lime") } as CSSProperties}>PROMOTED · {divisions[settlement.promoted - 1]}</span> : null}
          {settlement.prize ? <span className={`${styles.plate} ${styles.chip}`} style={{ "--accent": accentVar("gold") } as CSSProperties}>NEW CARD · {settlement.prize.name} (FICTIONAL)</span> : null}
        </div>
        <div className={styles.actions}>
          <Button size="lg" glow accent={accentVar("lime")} onClick={onNext}>NEXT MATCH ▶</Button>
          <Button size="lg" variant="tonal" accent={accentVar("cyan")} onClick={onClub}>CLUB HOUSE</Button>
        </div>
      </section>

      <section className={styles.mvp} aria-label="Player of the match">
        <div className={styles.kicker}>PLAYER OF THE MATCH</div>
        {bestCard ? <DuelCard card={bestCard} size="sm" /> : null}
        <strong style={{ fontFamily: "var(--ds-font-display)" }}>{best.rating.toFixed(1)}</strong>
      </section>

      <section className={`${styles.plate} ${styles.ratings}`} aria-label="Ratings">
        <div className={styles.kicker}>RATINGS</div>
        <ol className={styles.ratingList}>
          {list.map((r) => {
            const line = state.players[lineKey(r.side, r.id)];
            return (
              <li key={`${r.side}:${r.id}`} style={{ "--side": sideAccent[r.side] } as CSSProperties}>
                <i aria-hidden />
                <span>{state.teams[r.side].cards[r.id]?.shortName}{line.goals ? ` ⚽${line.goals > 1 ? line.goals : ""}` : ""}{line.red ? " · RED" : ""}</span>
                <b>{r.rating.toFixed(1)}</b>
              </li>
            );
          })}
        </ol>
        <div className={styles.muted} style={{ fontSize: "var(--ds-text-2xs)" }}>
          Reads won {state.stats.home.readsWon}–{state.stats.away.readsWon} · Shots {state.stats.home.shots}–{state.stats.away.shots}
        </div>
      </section>
    </div>
  );
}
