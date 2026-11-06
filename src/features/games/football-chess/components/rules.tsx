"use client";

import { useState, type ReactNode } from "react";

import { classTraits } from "../engine/classes";
import { defaultAttackClock, matchLengths, type PieceClass } from "../engine/state";
import { BallIcon, CardGlyph, ClassGlyph, Icon } from "./icons";
import styles from "./football-chess.module.css";

/**
 * How to play, as a few short pages. Each page fits one landscape phone
 * screen; the pager replaces scrolling.
 */

type Rule = { icon: ReactNode; title: string; body: string };

const glyph = (cls: PieceClass) => (
  <span className={`${styles.chip} ${styles.chipHome}`}>
    <ClassGlyph cls={cls} size={15} />
  </span>
);

const pages: { title: string; rules: Rule[] }[] = [
  {
    title: "The pitch",
    rules: [
      {
        icon: <BallIcon size={24} />,
        title: "A chessboard pitch",
        body: "Seven columns from goal to goal and five rows. You are ivory and attack the right-hand goal.",
      },
      {
        icon: <Icon name="play" size={22} />,
        title: "One action a turn",
        body: "Move one piece, pass, shoot or challenge. Then it is their turn.",
      },
      {
        icon: <Icon name="whistle" size={22} />,
        title: "Two halves",
        body: `Each side gets ${matchLengths.standard} actions a half in a standard match (${matchLengths.short} short, ${matchLengths.long} long). Most goals wins.`,
      },
      {
        icon: <span className={styles.rating}>%</span>,
        title: "You see the odds",
        body: "Every risky action shows its chance before you play it, and why. Position matters more than rating.",
      },
    ],
  },
  {
    title: "Your five",
    rules: (["striker", "runner", "playmaker", "defender", "keeper"] as const).map((cls) => ({
      icon: glyph(cls),
      title: classTraits[cls].label,
      body: `${classTraits[cls].moves}. ${classTraits[cls].power}.`,
    })),
  },
  {
    title: "With the ball",
    rules: [
      {
        icon: <Icon name="next" size={22} />,
        title: "Carry it",
        body: "The carrier moves like any piece. A Defender guards the 8 squares around him: a Runner's two-square dash stops on a guarded square.",
      },
      {
        icon: glyph("playmaker"),
        title: "Pass",
        body: "To a teammate in a straight line, any distance. A rival in the lane blocks it, and a guarded lane can be cut out. Playmakers and keepers loft it over everyone.",
      },
      {
        icon: glyph("striker"),
        title: "Shoot",
        body: "Pick the top, middle or bottom of the goal. Closer, straighter and away from the keeper is better. Blockers in the path can deflect it.",
      },
      {
        icon: glyph("runner"),
        title: "Take on",
        body: "Beat the rival next to you and land on the square behind him. Lose and he has the ball.",
      },
    ],
  },
  {
    title: "Without the ball",
    rules: [
      {
        icon: glyph("defender"),
        title: "Tackle",
        body: "From a square next to the carrier, but never from behind. Teammates closing in help. Miss and that piece sits out your next turn.",
      },
      {
        icon: <CardGlyph colour="yellow" size={20} />,
        title: "Slide",
        body: "From two squares away in a straight line. Better odds, but a miss puts you on the floor and may be a foul.",
      },
      {
        icon: <CardGlyph colour="red" size={20} />,
        title: "Cards and penalties",
        body: "A foul is a yellow; a second is a red and six actions off. A foul in your own box gives a penalty.",
      },
      {
        icon: glyph("keeper"),
        title: "Keepers",
        body: "They follow the ball along the goal line by themselves. Switch play to catch one out of position.",
      },
    ],
  },
  {
    title: "Tempo",
    rules: [
      {
        icon: <span className={styles.rating}>{defaultAttackClock}</span>,
        title: "The attack clock",
        body: `Keep the ball for ${defaultAttackClock} of your actions without shooting and it is passive play: the ball goes to them.`,
      },
      {
        icon: <Icon name="whistle" size={22} />,
        title: "Corners",
        body: "A blocked shot can run out for a corner: you keep the ball near their goal with a short clock.",
      },
      {
        icon: <span className={styles.rating}>+</span>,
        title: "Shot on!",
        body: "Like check in chess: when they can score from where the ball is, you are warned and the lanes are shown.",
      },
      {
        icon: <span className={styles.rating}>#</span>,
        title: "The move list",
        body: "Every action is written down like a chess game. # marks a goal and + a shot on.",
      },
    ],
  },
];

export function RulesSheet({ onClose }: { onClose: () => void }) {
  const [page, setPage] = useState(0);
  const current = pages[page];
  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="How to play" onClick={onClose}>
      <div className={`${styles.panel} ${styles.sheetDialog}`} onClick={(event) => event.stopPropagation()} data-rules="">
        <div className={styles.dialogHead}>
          <h2 className={styles.dialogTitle}>
            <span className={styles.kicker}>How to play</span>
            {current.title}
          </h2>
          <button type="button" className={styles.iconButton} onClick={onClose} aria-label="Close">
            <Icon name="close" />
          </button>
        </div>
        <div className={styles.rulesPage}>
          {current.rules.map((rule) => (
            <div key={rule.title} className={styles.rule}>
              <span style={{ display: "grid", placeItems: "center", minHeight: 28 }}>{rule.icon}</span>
              <div>
                <p className={styles.ruleTitle}>{rule.title}</p>
                <p className={styles.ruleBody}>{rule.body}</p>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.pager}>
          <button type="button" className={styles.iconButton} disabled={page === 0} onClick={() => setPage(page - 1)} aria-label="Previous page">
            <Icon name="back" />
          </button>
          <span className={styles.dots} aria-label={`Page ${page + 1} of ${pages.length}`}>
            {pages.map((entry, index) => (
              <span key={entry.title} className={styles.dot} data-on={index === page ? "" : undefined} />
            ))}
          </span>
          {page < pages.length - 1 ? (
            <button type="button" className={styles.iconButton} onClick={() => setPage(page + 1)} aria-label="Next page">
              <Icon name="next" />
            </button>
          ) : (
            <button type="button" className={`${styles.button} ${styles.primary}`} onClick={onClose}>
              Got it
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
