"use client";

import Image from "next/image";
import type { CSSProperties } from "react";

import { Button, accentVar, feedbackVar } from "@/design-system";
import type { PlayerCard as PlayerCardData } from "@/domain/cards";
import { portraitForCard } from "@/features/packs";
import { promotionCard } from "@/mocks/packs/pitch-duel-fictional";

import { formations, type ClubSetup } from "../engine/lineup";
import { divisionFor, divisions } from "../engine/setup";
import { coinsFor, type Career } from "../state/career-schema";

import { primaryPosition, roleAccent } from "./card-art";
import { laneY } from "./pitch-layout";
import styles from "./home.module.css";

const pointsPerDivision = 9;
const topDivision = 5;
const resultTone = { Victory: accentVar("lime"), Draw: accentVar("gold"), Defeat: feedbackVar("danger") } as const;
const resultLetter = { Victory: "W", Draw: "D", Defeat: "L" } as const;
/** Where one, two or three players in the same line stand across the pitch. */
const spreads = [[0.5], [0.27, 0.73], [0.18, 0.5, 0.82]];
const lineDepth = { back: 0.4, mid: 0.6, front: 0.8 } as const;

/**
 * The Pitch Duel landing screen: your five on a mini pitch on the left, the
 * matchday panel on the right (division, promotion track, form, kick-off).
 */
export function HomeScreen({
  career,
  club,
  cardFor,
  onKickOff,
  onLineup,
  onLeague,
  onGuide,
}: {
  career: Career;
  club: ClubSetup | null;
  cardFor: (id: string) => PlayerCardData | undefined;
  onKickOff: () => void;
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
      <ClubCard club={club} cardFor={cardFor} onLineup={onLineup} />

      <section className={styles.matchday} aria-label="Matchday">
        <div className={`${styles.plate} ${styles.division}`}>
          <span className={styles.emblem} aria-hidden>
            <small>DIV</small>
            <b>{division}</b>
          </span>
          <div className={styles.divisionText}>
            <small>MATCHDAY {String(career.played + 1).padStart(2, "0")}</small>
            <strong>{divisions[division - 1]}</strong>
          </div>
          <div className={styles.points}>
            <b>{career.points}</b>
            <small>PTS</small>
          </div>
        </div>

        <div className={styles.track} aria-label={top ? "Top division reached" : `${earned} of ${pointsPerDivision} points to promotion`}>
          <div className={styles.trackHead}>
            <small>{top ? "TOP OF THE LADDER" : `PROMOTION · ${pointsPerDivision - earned} PTS TO GO`}</small>
            {reward ? (
              <span className={styles.reward} title={`Reach division ${division + 1} to unlock ${reward.name}`}>
                UNLOCK <b>{reward.shortName}</b> {reward.rating}
              </span>
            ) : (
              <span className={styles.reward}>CHAMPIONS</span>
            )}
          </div>
          <div className={styles.pips} aria-hidden>
            {Array.from({ length: pointsPerDivision }, (_, i) => (
              <i key={i} data-on={i < earned || undefined} style={{ "--i": i } as CSSProperties} />
            ))}
          </div>
        </div>

        <div className={styles.formRow}>
          <small>FORM</small>
          <ol className={styles.form} aria-label="Last five results">
            {Array.from({ length: 5 }, (_, i) => {
              const r = form[i];
              return r ? (
                <li key={r.id} style={{ "--tone": resultTone[r.result], "--i": i } as CSSProperties} title={`${r.result} ${r.playerScore}–${r.opponentScore} vs ${r.opponentName}`}>
                  {resultLetter[r.result]}
                </li>
              ) : (
                <li key={`empty-${i}`} data-empty aria-label="No match yet">–</li>
              );
            })}
          </ol>
          <span className={styles.recordLine}>
            <b>{career.wins}</b>W <b>{career.draws}</b>D <b>{career.losses}</b>L · GD <b>{goalDiff > 0 ? `+${goalDiff}` : goalDiff}</b>
          </span>
        </div>

        <div className={styles.cta}>
          <Button size="lg" glow accent={accentVar("cyan")} onClick={onKickOff} label="Kick off">
            KICK OFF ▶
          </Button>
          <span className={styles.stakes}>
            WIN <b>+3 PTS</b> · <b className={styles.coin}>+{coinsFor("Victory")}</b> COINS
          </span>
        </div>

        <div className={styles.links}>
          <button type="button" className={`${styles.plate} ${styles.link}`} onClick={onLeague}>
            <small>LEAGUE</small>
            <b>LADDER &amp; RESULTS</b>
          </button>
          <button type="button" className={`${styles.plate} ${styles.link}`} onClick={onGuide} data-new={!career.tutorialSeen || undefined}>
            <small>{career.tutorialSeen ? "HOW TO PLAY" : "NEW · START HERE"}</small>
            <b>READ THE PLAY</b>
          </button>
        </div>
      </section>
    </div>
  );
}

/** Your five on a mini pitch, attacking to the right. Tapping it opens the lineup. */
function ClubCard({ club, cardFor, onLineup }: { club: ClubSetup | null; cardFor: (id: string) => PlayerCardData | undefined; onLineup: () => void }) {
  if (!club) {
    return (
      <button type="button" className={`${styles.plate} ${styles.club}`} onClick={onLineup}>
        <span className={styles.clubHead}>
          <small>YOUR FIVE</small>
        </span>
        <span className={styles.clubEmpty}>Pick a keeper and four players to build your club.</span>
        <span className={styles.clubFoot}>BUILD LINEUP ▸</span>
      </button>
    );
  }

  // Each line keeps its left-to-right order from the formation, spread evenly so faces never overlap.
  const slots = formations[club.formation].slots;
  const outfield = club.outfield.map((id, i) => {
    const slot = slots[i];
    const lean = slot ? slot.lanes.reduce((sum, lane) => sum + laneY[lane], 0) / slot.lanes.length : 0.5;
    return { id, line: slot?.line ?? "mid", lean };
  });
  const players = [
    { id: club.keeperId, x: 0.12, y: 0.5 },
    ...outfield.map((p) => {
      const mates = outfield.filter((m) => m.line === p.line).sort((a, b) => a.lean - b.lean);
      const spread = spreads[Math.min(mates.length, 3) - 1];
      return { id: p.id, x: lineDepth[p.line], y: spread[mates.indexOf(p)] ?? 0.5 };
    }),
  ];
  const cards = players.map((p) => cardFor(p.id));
  const rated = cards.filter((c): c is PlayerCardData => Boolean(c));
  const ovr = rated.length ? Math.round(rated.reduce((sum, c) => sum + c.rating, 0) / rated.length) : 0;

  return (
    <button type="button" className={`${styles.plate} ${styles.club}`} onClick={onLineup} aria-label={`Your five, ${club.formation} ${formations[club.formation].label}, overall ${ovr}. Edit lineup`}>
      <span className={styles.clubHead}>
        <small>YOUR FIVE</small>
        <strong>
          {club.formation} <em>{formations[club.formation].label}</em>
        </strong>
        <span className={styles.ovr}>
          <b>{ovr}</b>
          <small>OVR</small>
        </span>
      </span>

      <span className={styles.miniPitch} aria-hidden>
        <svg viewBox="0 0 100 60" preserveAspectRatio="none">
          <rect x="1" y="1" width="98" height="58" />
          <line x1="50" y1="1" x2="50" y2="59" />
          <ellipse cx="50" cy="30" rx="8" ry="12" />
          <rect x="1" y="18" width="13" height="24" />
          <rect x="86" y="18" width="13" height="24" />
        </svg>
        {players.map((p, i) => {
          const card = cards[i];
          if (!card) return null;
          const portrait = portraitForCard(card);
          return (
            <span
              key={p.id}
              className={styles.player}
              style={{ left: `${p.x * 100}%`, top: `${p.y * 100}%`, "--role": roleAccent[card.role] ?? accentVar("cyan"), "--i": i } as CSSProperties}
            >
              <span className={styles.face}>
                {portrait ? <Image src={portrait} alt="" fill sizes="64px" className={styles.faceImg} /> : card.shortName.slice(0, 2)}
              </span>
              <span className={styles.rating}>{card.rating}</span>
              <span className={styles.name}>
                {card.shortName}
                <small>{primaryPosition(card)}</small>
              </span>
            </span>
          );
        })}
      </span>

      <span className={styles.clubFoot}>
        <span>{club.tactics.length} TACTIC CARD{club.tactics.length === 1 ? "" : "S"}</span>
        <span>EDIT LINEUP ▸</span>
      </span>
    </button>
  );
}
