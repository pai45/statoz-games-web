import type { CSSProperties } from "react";

import { COLS, ROWS } from "../engine/geometry";
import { formationSquaresFor } from "../engine/setup";
import type { Formation, Side, Sq } from "../engine/state";
import styles from "./football-chess.module.css";

/**
 * A small, decorative chessboard pitch showing one or two formations: the
 * hub's centrepiece and the formation picker's diagrams.
 */

const width = COLS + 1.4;

function spot(s: Sq): CSSProperties {
  const x = s.col < 0 ? 0.35 : s.col >= COLS ? COLS + 1.05 : s.col + 1.2;
  return { left: `${(x / width) * 100}%`, top: `${((ROWS - 1 - s.row + 0.5) / ROWS) * 100}%` };
}

function tokens(formation: Formation, side: Side) {
  return [...formationSquaresFor(formation, side), { col: side === "home" ? -1 : COLS, row: 2 }];
}

export function MiniBoard({ home, away, label }: { home: Formation; away?: Formation; label?: string }) {
  const cells = [];
  for (let row = ROWS - 1; row >= 0; row -= 1) {
    cells.push(<span key={`gh${row}`} className={row >= 1 && row <= 3 ? styles.miniGoal : styles.miniGoalOff} />);
    for (let col = 0; col < COLS; col += 1) {
      cells.push(<span key={`${col}-${row}`} className={styles.miniCell} data-dark={(col + row) % 2 === 0 ? "" : undefined} />);
    }
    cells.push(<span key={`ga${row}`} className={row >= 1 && row <= 3 ? styles.miniGoal : styles.miniGoalOff} />);
  }
  return (
    <div className={styles.mini} role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      <div className={styles.miniGrid}>
        {cells}
        {tokens(home, "home").map((s, index) => (
          <span key={`h${index}`} className={`${styles.miniToken} ${styles.miniHome}`} style={spot(s)} />
        ))}
        {away !== undefined
          ? tokens(away, "away").map((s, index) => (
              <span key={`a${index}`} className={`${styles.miniToken} ${styles.miniAway}`} style={spot(s)} />
            ))
          : null}
      </div>
    </div>
  );
}
