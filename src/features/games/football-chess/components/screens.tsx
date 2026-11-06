"use client";

import { useState } from "react";

import { difficulties, difficultyInfo, personalityInfo, type Difficulty } from "../engine/ai/bots";
import { classOf, classTraits } from "../engine/classes";
import { formationInfo, squadRating } from "../engine/setup";
import { formations, matchLengths, type GameState, type MatchLength, type PieceCard } from "../engine/state";
import type { FootballChessSave, QuickSetup, ResultEntry } from "../state/progress";
import type { MatchSettlement } from "../state/progress";
import { winRate } from "../state/save-schema";
import type { QuickMatch, YourSquad } from "../state/squads";
import { ClassGlyph, Icon } from "./icons";
import { MiniBoard } from "./mini-board";
import styles from "./football-chess.module.css";

/* ---- Small shared bits ----------------------------------------------------------- */

function Header({ title, kicker, onBack, backLabel = "Back" }: { title: string; kicker?: string; onBack: () => void; backLabel?: string }) {
  return (
    <header className={styles.header}>
      <button type="button" className={styles.iconButton} onClick={onBack} aria-label={backLabel}>
        <Icon name="back" />
      </button>
      <h1 className={styles.headerTitle}>
        {kicker ? <span className={styles.kicker}>{kicker}</span> : null}
        {title}
      </h1>
    </header>
  );
}

function SquadList({ cards, side }: { cards: readonly PieceCard[]; side: "home" | "away" }) {
  return (
    <ul className={styles.squadList}>
      {cards.map((card) => {
        const cls = classOf(card);
        return (
          <li key={card.id} className={styles.squadRow}>
            <span className={`${styles.chip} ${side === "home" ? styles.chipHome : styles.chipAway}`}>
              <ClassGlyph cls={cls} size={14} />
            </span>
            <span className={styles.squadName}>
              {card.shortName}
              <span className={styles.squadClass}>
                {classTraits[cls].label} · {card.position}
              </span>
            </span>
            <span className={styles.rating}>{card.rating}</span>
          </li>
        );
      })}
    </ul>
  );
}

/* ---- Hub ---------------------------------------------------------------------------- */

export function HubScreen({
  save,
  squad,
  onQuick,
  onRules,
  onRecord,
  onBack,
}: {
  save: FootballChessSave;
  squad: YourSquad;
  onQuick: () => void;
  onRules: () => void;
  onRecord: () => void;
  onBack: () => void;
}) {
  const { record } = save;
  return (
    <section className={`${styles.screen} ${styles.hub}`} data-screen="hub">
      <div className={styles.hubTop}>
        <button type="button" className={styles.iconButton} onClick={onBack} aria-label="Back to games">
          <Icon name="back" />
        </button>
      </div>
      <div className={styles.hubBody}>
        <div>
          <h1 className={styles.title}>
            Football <em>Chess</em>
          </h1>
          <p className={styles.tagline}>
            Move your five, read the odds and outthink a rival manager.
          </p>
          <div className={styles.hubStack}>
            <button type="button" className={`${styles.button} ${styles.primary}`} onClick={onQuick} data-action="quick-match">
              <Icon name="play" size={18} /> Quick match
            </button>
            {save.migratedFrom === 1 ? (
              <p className={styles.notice}>
                New rules this season: a bigger pitch, piece classes and visible odds. Your record carried over.
              </p>
            ) : null}
            <div className={styles.squadStrip}>
              <span>{squad.academy ? "Playing with the Academy five" : "Your deck's five"}</span>
              <b style={{ color: "var(--fc-brass-light)" }}>· rated {squadRating(squad.cards)}</b>
            </div>
          </div>
        </div>
        <div className={styles.hubStack}>
          <MiniBoard home="box" away="diamond" label="A chessboard pitch: your ivory pieces against their ebony pieces" />
          <button type="button" className={styles.hubCard} onClick={onRules} data-action="rules">
            <Icon name="book" size={22} />
            <span className={styles.hubCardText}>
              <span className={styles.hubCardTitle}>How to play</span>
              <span className={styles.hubCardSub}>Pieces, moves, odds and the attack clock</span>
            </span>
            <Icon name="next" size={18} />
          </button>
          <button type="button" className={styles.hubCard} onClick={onRecord} data-action="record">
            <Icon name="record" size={22} />
            <span className={styles.hubCardText}>
              <span className={styles.hubCardTitle}>Record</span>
              <span className={styles.hubCardSub}>
                {record.played === 0
                  ? "No matches yet"
                  : `${record.wins}W ${record.draws}D ${record.losses}L · win rate ${winRate(record)}`}
              </span>
            </span>
            <Icon name="next" size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}

/* ---- Quick match setup ----------------------------------------------------------------- */

const lengthLabel: Record<MatchLength, string> = { short: "Short", standard: "Standard", long: "Long" };

export function SetupScreen({
  initial,
  squad,
  onStart,
  onBack,
}: {
  initial: QuickSetup;
  squad: YourSquad;
  onStart: (quick: QuickSetup) => void;
  onBack: () => void;
}) {
  const [quick, setQuick] = useState<QuickSetup>(initial);
  const [customize, setCustomize] = useState(false);
  const lengths = Object.keys(matchLengths) as MatchLength[];
  return (
    <section className={styles.screen} data-screen="setup">
      <Header title="Quick match" kicker="Set up" onBack={onBack} />
      <div className={styles.setupBody} data-customize={customize}>
        {customize ? <div className={styles.setupColumn}>
          <div>
            <p className={styles.fieldLabel}>Rival</p>
            <div className={styles.segmented} role="group" aria-label="Rival difficulty">
              {difficulties.map((difficulty: Difficulty) => (
                <button
                  key={difficulty}
                  type="button"
                  className={styles.option}
                  aria-pressed={quick.difficulty === difficulty}
                  onClick={() => setQuick({ ...quick, difficulty })}
                >
                  <span className={styles.optionLabel}>{difficultyInfo[difficulty].label}</span>
                </button>
              ))}
            </div>
            <p className={styles.blurb}>{difficultyInfo[quick.difficulty].blurb}</p>
          </div>
          <div>
            <p className={styles.fieldLabel}>Length</p>
            <div className={styles.segmented} role="group" aria-label="Match length">
              {lengths.map((length) => (
                <button
                  key={length}
                  type="button"
                  className={styles.option}
                  aria-pressed={quick.length === length}
                  onClick={() => setQuick({ ...quick, length })}
                >
                  <span className={styles.optionLabel}>{lengthLabel[length]}</span>
                  <span className={styles.optionSub}>{matchLengths[length]} moves a half</span>
                </button>
              ))}
            </div>
          </div>
        </div> : <div className={`${styles.panel} ${styles.setupColumn}`} data-ui-role="recommended-setup">
          <p className={styles.fieldLabel}>Recommended setup</p>
          <p className={styles.blurb}>{difficultyInfo[quick.difficulty].label} rival · {lengthLabel[quick.length]} match · {formationInfo[quick.formation].label}</p>
          <span className={styles.spacer} />
          <button type="button" className={styles.button} onClick={() => setCustomize(true)}>Customize</button>
        </div>}
        {customize ? <div className={styles.setupColumn}>
          <div>
            <p className={styles.fieldLabel}>Your shape</p>
            <div className={styles.formationGrid} role="group" aria-label="Formation">
              {formations.map((formation) => (
                <button
                  key={formation}
                  type="button"
                  className={`${styles.option} ${styles.formationOption}`}
                  aria-pressed={quick.formation === formation}
                  onClick={() => setQuick({ ...quick, formation })}
                >
                  <MiniBoard home={formation} />
                  <span className={styles.optionLabel}>
                    {formationInfo[formation].label} <span className={styles.optionSub}>{formationInfo[formation].code}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div> : null}
        <div className={`${styles.panel} ${styles.squadPanel}`}>
          <p className={styles.fieldLabel}>{squad.academy ? "Academy five" : "Your five"}</p>
          <SquadList cards={squad.cards} side="home" />
          <p className={styles.blurb} style={{ minHeight: 0 }}>
            {formationInfo[quick.formation].blurb}
          </p>
          <span className={styles.spacer} />
          <button type="button" className={`${styles.button} ${styles.primary}`} onClick={() => onStart(quick)} data-action="find-rival">
            Find a rival
          </button>
        </div>
      </div>
    </section>
  );
}

/* ---- Prematch ------------------------------------------------------------------------------ */

export function PrematchScreen({ match, onKickOff, onBack }: { match: QuickMatch; onKickOff: () => void; onBack: () => void }) {
  const { setup } = match;
  const persona = personalityInfo[match.personality];
  return (
    <section className={styles.screen} data-screen="prematch">
      <Header title="Team sheets" kicker="Quick match" onBack={onBack} />
      <div className={styles.prematchBody}>
        <div className={`${styles.panel} ${styles.sheet}`}>
          <p className={styles.sheetName}>You</p>
          <p className={styles.sheetMeta}>
            {formationInfo[setup.home.formation].label} {formationInfo[setup.home.formation].code} · rated {squadRating(setup.home.squad)}
          </p>
          <SquadList cards={setup.home.squad} side="home" />
        </div>
        <div className={styles.versus}>
          <span className={styles.vs}>vs</span>
          <span className={styles.coin} aria-hidden="true">
            {match.tossWon ? "Y" : "R"}
          </span>
          <p className={styles.tossText} role="status">
            {match.tossWon ? "You win the toss and kick off." : `${match.opponentName} wins the toss and kicks off.`}
          </p>
          <button type="button" className={`${styles.button} ${styles.primary}`} onClick={onKickOff} data-action="kick-off">
            <Icon name="whistle" size={18} /> Kick off
          </button>
        </div>
        <div className={`${styles.panel} ${styles.sheet}`}>
          <p className={styles.sheetName}>{match.opponentName}</p>
          <p className={styles.sheetMeta}>
            {persona.label} · {difficultyInfo[match.difficulty].label} · {formationInfo[setup.away.formation].label} ·
            rated {squadRating(setup.away.squad)}
          </p>
          <SquadList cards={setup.away.squad} side="away" />
          <p className={styles.blurb} style={{ minHeight: 0 }}>
            {persona.blurb}
          </p>
        </div>
      </div>
    </section>
  );
}

/* ---- Result ------------------------------------------------------------------------------------ */

export function ResultScreen({
  match,
  game,
  settlement,
  onRematch,
  onHub,
}: {
  match: QuickMatch;
  game: GameState;
  settlement: MatchSettlement | null;
  onRematch: () => void;
  onHub: () => void;
}) {
  const { home, away } = game.score;
  const verdict = home > away ? "Victory" : home < away ? "Defeat" : "Draw";
  const rows: [string, number, number][] = [
    ["Shots", game.stats.home.shots, game.stats.away.shots],
    ["Passive play", game.stats.home.passives, game.stats.away.passives],
    ["Fouls", game.stats.home.fouls, game.stats.away.fouls],
    ["Cards", game.stats.home.cards, game.stats.away.cards],
  ];
  return (
    <section className={styles.screen} data-screen="result">
      <div className={styles.resultBody}>
        <div>
          <span className={styles.kicker}>Full time</span>
          <h1 className={`${styles.verdict} ${home < away ? styles.verdictLoss : ""}`} data-verdict={verdict.toLowerCase()}>
            {verdict}
          </h1>
          <p className={styles.scoreLine}>
            <span>You {home}</span>
            <span>–</span>
            <span>
              {away} {match.opponentName}
            </span>
          </p>
          {settlement !== null && !settlement.duplicate ? <span className={styles.reward}>+{settlement.coins} coins</span> : null}
          <div className={styles.buttonRow}>
            <button type="button" className={`${styles.button} ${styles.primary}`} onClick={onRematch} data-action="rematch">
              Play again
            </button>
            <button type="button" className={styles.button} onClick={onHub} data-action="hub">
              Back to the hub
            </button>
          </div>
        </div>
        <details className={`${styles.panel} ${styles.sheet}`}>
          <summary>Match details</summary>
          <table className={styles.statTable}>
            <thead>
              <tr>
                <th scope="col">{game.log.length} moves</th>
                <th scope="col">You</th>
                <th scope="col">{match.opponentName}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(([label, a, b]) => (
                <tr key={label}>
                  <td>{label}</td>
                  <td>{a}</td>
                  <td>{b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </details>
      </div>
    </section>
  );
}

/* ---- Record -------------------------------------------------------------------------------------- */

const perPage = 5;

export function RecordScreen({ save, onBack }: { save: FootballChessSave; onBack: () => void }) {
  const [page, setPage] = useState(0);
  const { record, history } = save;
  const pages = Math.max(1, Math.ceil(history.length / perPage));
  const shown = history.slice(page * perPage, page * perPage + perPage);
  const tiles: [string, string | number][] = [
    ["Played", record.played],
    ["Won", record.wins],
    ["Drawn", record.draws],
    ["Lost", record.losses],
    ["Win rate", winRate(record)],
    ["Best streak", record.bestStreak],
    ["Goals for", record.goalsFor],
    ["Against", record.goalsAgainst],
  ];
  return (
    <section className={styles.screen} data-screen="record">
      <Header title="Record" kicker="Football Chess" onBack={onBack} />
      <div className={styles.recordBody}>
        <div className={styles.tiles}>
          {tiles.map(([label, value]) => (
            <div key={label} className={`${styles.panel} ${styles.tile}`}>
              <span className={styles.tileValue}>{value}</span>
              <span className={styles.tileLabel}>{label}</span>
            </div>
          ))}
        </div>
        <div className={`${styles.panel} ${styles.history}`}>
          <p className={styles.fieldLabel}>Recent matches</p>
          {shown.length === 0 ? (
            <p className={styles.empty}>Your results will appear here.</p>
          ) : (
            <ul className={styles.historyList}>
              {shown.map((entry: ResultEntry) => (
                <li key={entry.id} className={styles.historyRow}>
                  <span className={`${styles.badge} ${styles[`badge${entry.result}`]}`}>{entry.result}</span>
                  <span className={styles.squadName}>
                    {entry.opponent}
                    <span className={styles.squadClass}>
                      {difficultyInfo[entry.difficulty].label} · {personalityInfo[entry.personality].label}
                    </span>
                  </span>
                  <span className={styles.rating}>
                    {entry.scored}–{entry.conceded}
                  </span>
                </li>
              ))}
            </ul>
          )}
          {pages > 1 ? (
            <div className={styles.pager}>
              <button type="button" className={styles.iconButton} disabled={page === 0} onClick={() => setPage(page - 1)} aria-label="Newer">
                <Icon name="back" />
              </button>
              <span>
                Page {page + 1} of {pages}
              </span>
              <button
                type="button"
                className={styles.iconButton}
                disabled={page >= pages - 1}
                onClick={() => setPage(page + 1)}
                aria-label="Older"
              >
                <Icon name="next" />
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
