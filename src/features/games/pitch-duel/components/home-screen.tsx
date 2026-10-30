"use client";

import type { CSSProperties } from "react";

import type { PlayerCard as PlayerCardData } from "@/domain/cards";
import { isAcademyId } from "@/mocks/packs/pitch-duel-academy";
import { promotionCard } from "@/mocks/packs/pitch-duel-fictional";

import { formations, type ClubSetup } from "../engine/lineup";
import { divisionFor, divisions } from "../engine/setup";
import { coinsFor, type Career } from "../state/career-schema";

import { BallIcon, PitchIcon, StarIcon } from "./icons";
import { Pill } from "./ui";
import styles from "./home.module.css";

const pointsPerDivision = 9;
const topDivision = 5;
const resultTone = { Victory: "#4ade80", Draw: "#fbbf24", Defeat: "#f87171" } as const;
const resultLetter = { Victory: "W", Draw: "D", Defeat: "L" } as const;

/**
 * The Pitch Duel club house: the wordmark and division badge, PLAY MATCH,
 * the promotion track and form, and your eleven on a mini pitch.
 */
export function HomeScreen({
  career,
  club,
  cardFor,
  onPlay,
  onLineup,
  onLeague,
  onGuide,
}: {
  career: Career;
  club: ClubSetup | null;
  cardFor: (id: string) => PlayerCardData | undefined;
  onPlay: () => void;
  onLineup: () => void;
  onLeague: () => void;
  onGuide: () => void;
}) {
  const division = divisionFor(career.points);
  const top = division >= topDivision;
  const earned = top ? pointsPerDivision : career.points % pointsPerDivision;
  const reward = top ? undefined : promotionCard(division + 1);
  const form = career.history.slice(0, 5);
  const goalDiff = career.goalsFor - career.goalsAgainst;

  return (
    <div className={styles.home}>
      <section className={styles.hero} aria-label="Pitch Duel">
        <span className={styles.badge}>
          <i aria-hidden />
          DIV {division} · {divisions[division - 1]}
          <i aria-hidden />
        </span>
        <h1 className={styles.wordmark}>
          <span className={styles.wordBall} aria-hidden>
            <BallIcon size={44} />
          </span>
          PITCH <em>DUEL</em>
        </h1>
        <p className={styles.tagline}>Eleven a side · one duel at a time</p>
      </section>

      <div className={styles.ctaStack}>
        <Pill tone="violet" wide pulse onClick={onPlay} icon={<BallIcon size={22} />} optionId="play-match">
          PLAY MATCH!
        </Pill>
        <p className={styles.stakes}>
          WIN <b>+3 PTS</b> · <b className={styles.coin}>+{coinsFor("Victory")}</b> COINS
        </p>
        <div className={styles.ctaRow}>
          <Pill tone="light" onClick={onLineup} icon={<PitchIcon />}>
            LINEUP
          </Pill>
          <Pill tone="light" onClick={onLeague}>
            LEAGUE
          </Pill>
        </div>
        <button type="button" className={styles.guideLink} onClick={onGuide} data-new={!career.tutorialSeen || undefined}>
          {career.tutorialSeen ? "How to play" : "New here? Read how to play ▸"}
        </button>
      </div>

      <section className={styles.panel} aria-label={top ? "Top division reached" : `${earned} of ${pointsPerDivision} points to promotion`}>
        <header className={styles.panelHead}>
          <small>{top ? "TOP OF THE LADDER" : `PROMOTION · ${pointsPerDivision - earned} PTS TO GO`}</small>
          {reward ? (
            <span className={styles.reward}>
              UNLOCK <b>{reward.shortName}</b> {reward.rating}
            </span>
          ) : (
            <span className={styles.reward}>CHAMPIONS</span>
          )}
        </header>
        <div className={styles.pips} aria-hidden>
          {Array.from({ length: pointsPerDivision }, (_, i) => (
            <i key={i} data-on={i < earned || undefined} style={{ "--i": i } as CSSProperties} />
          ))}
        </div>
        <div className={styles.formRow}>
          <ol className={styles.form} aria-label="Last five results">
            {Array.from({ length: 5 }, (_, i) => {
              const r = form[i];
              return r ? (
                <li key={r.id} style={{ "--tone": resultTone[r.result] } as CSSProperties} title={`${r.result} ${r.playerScore}–${r.opponentScore} vs ${r.opponentName}`}>
                  {resultLetter[r.result]}
                </li>
              ) : (
                <li key={`empty-${i}`} data-empty aria-label="No match yet">
                  –
                </li>
              );
            })}
          </ol>
          <span className={styles.record}>
            <b>{career.wins}</b>W <b>{career.draws}</b>D <b>{career.losses}</b>L · GD <b>{goalDiff > 0 ? `+${goalDiff}` : goalDiff}</b>
          </span>
        </div>
      </section>

      <ClubPitch club={club} cardFor={cardFor} onLineup={onLineup} />
    </div>
  );
}

/** Your eleven on a portrait mini pitch, attacking up. Tapping it opens the lineup. */
function ClubPitch({ club, cardFor, onLineup }: { club: ClubSetup | null; cardFor: (id: string) => PlayerCardData | undefined; onLineup: () => void }) {
  if (!club) {
    return (
      <button type="button" className={styles.club} onClick={onLineup}>
        <span className={styles.clubHead}>YOUR XI</span>
        <span className={styles.clubEmpty}>Pick a keeper to build your club.</span>
      </button>
    );
  }
  const shape = formations[club.formation];
  const players = [
    { id: club.keeperId, x: 0.5, y: 0.9 },
    ...club.outfield.map((id, i) => ({ id, x: shape.slots[i].at.across, y: 0.9 - (shape.slots[i].at.depth / 0.56) * 0.76 })),
  ];
  const cards = players.map((p) => cardFor(p.id));
  const rated = cards.filter((c): c is PlayerCardData => Boolean(c));
  const ovr = rated.length ? Math.round(rated.reduce((sum, c) => sum + c.rating, 0) / rated.length) : 0;
  const academy = club.outfield.filter(isAcademyId).length + Number(isAcademyId(club.keeperId));

  return (
    <button type="button" className={styles.club} onClick={onLineup} aria-label={`Your eleven, ${club.formation} ${shape.label}, overall ${ovr}. Edit lineup`}>
      <span className={styles.clubHead}>
        <span>YOUR XI</span>
        <span className={styles.formation}>
          {club.formation} <em>{shape.label}</em>
        </span>
        <span className={styles.ovr}>
          <StarIcon size={14} /> {ovr}
        </span>
      </span>
      <span className={styles.miniPitch} aria-hidden>
        <svg viewBox="0 0 60 80" preserveAspectRatio="none">
          <rect x="1" y="1" width="58" height="78" rx="1" />
          <line x1="1" y1="40" x2="59" y2="40" />
          <circle cx="30" cy="40" r="6" />
          <rect x="16" y="1" width="28" height="11" />
          <rect x="16" y="68" width="28" height="11" />
        </svg>
        {players.map((p, i) => {
          const card = cards[i];
          if (!card) return null;
          return (
            <span key={p.id} className={styles.token} data-tier={card.tier} data-academy={isAcademyId(card.id) || undefined} style={{ left: `${p.x * 100}%`, top: `${p.y * 100}%`, "--i": i } as CSSProperties}>
              <b>{card.rating}</b>
              <small>{card.shortName}</small>
            </span>
          );
        })}
      </span>
      <span className={styles.clubFoot}>
        <span>
          {club.tactics.length} TACTIC CARD{club.tactics.length === 1 ? "" : "S"}
          {academy ? ` · ${academy} ACADEMY` : ""}
        </span>
        <span>EDIT LINEUP ▸</span>
      </span>
    </button>
  );
}
