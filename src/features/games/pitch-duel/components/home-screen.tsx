"use client";

import type { CSSProperties } from "react";

import type { PlayerCard as PlayerCardData } from "@/domain/cards";
import { isAcademyId } from "@/mocks/packs/pitch-duel-academy";
import { promotionCard } from "@/mocks/packs/pitch-duel-fictional";

import { formations, type ClubSetup } from "../engine/lineup";
import { divisionFor, divisions } from "../engine/setup";
import type { Career } from "../state/career-schema";

import { BallIcon, StarIcon } from "./icons";
import { keeperAt, placeSpot } from "./pitch-layout";
import { Pill } from "./ui";
import styles from "./home.module.css";

const pointsPerDivision = 9;
const topDivision = 5;

/**
 * The Fot Duel club house, in landscape: on the left the wordmark,
 * division badge and PLAY MATCH; on the right the promotion track and form
 * over your eleven on a sideways mini pitch.
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

  return (
    <div className={styles.home}>
      <div className={styles.lobby}>
        <section className={styles.hero} aria-label="Fot Duel">
          <span className={styles.badge}>
            <i aria-hidden />
            DIV {division} · {divisions[division - 1]}
            <i aria-hidden />
          </span>
          <h1 className={styles.wordmark}>
            <span className={styles.wordBall} aria-hidden>
              <BallIcon size={44} />
            </span>
            FOT <em>DUEL</em>
          </h1>
        </section>

        <div className={styles.ctaStack}>
          <Pill tone="violet" wide pulse onClick={onPlay} icon={<BallIcon size={22} />} optionId="play-match">
            NEXT MATCH
          </Pill>
          <div className={styles.ctaRow}>
            <button type="button" className={styles.guideLink} onClick={onLeague}>League</button>
            <button type="button" className={styles.guideLink} onClick={onGuide} data-new={!career.tutorialSeen || undefined}>Guide</button>
          </div>
        </div>
      </div>

      <div className={styles.clubSide}>
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
        </section>

        <ClubPitch club={club} cardFor={cardFor} onLineup={onLineup} />
      </div>
    </div>
  );
}

/** Your eleven on a landscape mini pitch, attacking right. Tapping it opens the lineup. */
function ClubPitch({ club, cardFor, onLineup }: { club: ClubSetup | null; cardFor: (id: string) => PlayerCardData | undefined; onLineup: () => void }) {
  if (!club) {
    return (
      <button type="button" className={styles.club} onClick={onLineup}>
        <span className={styles.clubHead}>YOUR SQUAD</span>
        <span className={styles.clubEmpty}>Pick a keeper to build your club.</span>
      </button>
    );
  }
  const shape = formations[club.formation];
  const players = [{ id: club.keeperId, ...placeSpot(keeperAt) }, ...club.outfield.map((id, i) => ({ id, ...placeSpot(shape.slots[i].at) }))];
  const cards = players.map((p) => cardFor(p.id));
  const rated = cards.filter((c): c is PlayerCardData => Boolean(c));
  const ovr = rated.length ? Math.round(rated.reduce((sum, c) => sum + c.rating, 0) / rated.length) : 0;
  const academy = club.outfield.filter(isAcademyId).length + Number(isAcademyId(club.keeperId));

  return (
    <button type="button" className={styles.club} onClick={onLineup} aria-label={`Your squad, ${club.formation} ${shape.label}, overall ${ovr}. Open squad`}>
      <span className={styles.clubHead}>
        <span>YOUR SQUAD</span>
        <span className={styles.formation}>
          {club.formation} <em>{shape.label}</em>
        </span>
        <span className={styles.ovr}>
          <StarIcon size={14} /> {ovr}
        </span>
      </span>
      <span className={styles.miniPitch} aria-hidden>
        <svg viewBox="0 0 90 60" preserveAspectRatio="none">
          <rect x="1" y="1" width="88" height="58" rx="1" />
          <line x1="45" y1="1" x2="45" y2="59" />
          <circle cx="45" cy="30" r="6" />
          <rect x="1" y="16" width="12" height="28" />
          <rect x="77" y="16" width="12" height="28" />
        </svg>
        {players.map((p, i) => {
          const card = cards[i];
          if (!card) return null;
          return (
            <span
              key={p.id}
              className={styles.token}
              data-tier={card.tier}
              data-academy={isAcademyId(card.id) || undefined}
              style={{ left: `${p.x * 100}%`, top: `${p.y * 100}%`, "--i": i } as CSSProperties}
            >
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
        <span>OPEN SQUAD ▸</span>
      </span>
    </button>
  );
}
