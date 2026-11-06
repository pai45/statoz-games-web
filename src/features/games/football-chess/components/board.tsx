"use client";

import { useEffect, useId, useState, type CSSProperties, type ReactNode, type RefObject } from "react";

import { classTraits } from "../engine/classes";
import { COLS, FILES, ROWS, sqName } from "../engine/geometry";
import type { ShotLane } from "../engine/threats";
import type { Action, Piece, Sq } from "../engine/state";
import { BallIcon, CardGlyph, ClassGlyph } from "./icons";
import styles from "./match.module.css";

/**
 * The pitch as a chessboard: 7 columns by 5 rows of mown grass, a goal at
 * each end (0.7 of a square deep), chalk lines, and the pieces on top.
 * Everything is placed in "square" units and scaled by `--sq`.
 */

/** Board width in squares: the grid plus a goal at each end. */
export const boardWidth = COLS + 1.4;

export type TargetKind = "move" | "skill" | "pass" | "duel" | "shot";

export type BoardTarget = {
  key: string;
  action: Action;
  col: number;
  row: number;
  kind: TargetKind;
  /** The chance it works, shown as a chip; null for a sure thing. */
  chance: number | null;
  label: string;
};

/** Measures the space a board may use and returns the square size in px. */
export function useSquareSize(slot: RefObject<HTMLElement | null>): number {
  const [size, setSize] = useState(0);
  useEffect(() => {
    const element = slot.current;
    if (element === null) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      // The walnut frame adds 0.2 of a square on every side.
      const fit = Math.min(width / (boardWidth + 0.4), height / (ROWS + 0.4));
      setSize(Math.max(24, Math.floor(fit)));
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [slot]);
  return size;
}

/** The left edge of a column, in squares (keeper columns are -1 and 7). */
function leftOf(col: number): number {
  if (col < 0) return 0;
  if (col >= COLS) return COLS + 0.7;
  return col + 0.7;
}

/** The centre of a square, in squares. */
export function centreOf(s: Sq): { x: number; y: number } {
  const x = s.col < 0 ? 0.35 : s.col >= COLS ? COLS + 1.05 : s.col + 1.2;
  return { x, y: ROWS - 1 - s.row + 0.5 };
}

function sideName(piece: Piece): string {
  return piece.side === "home" ? "Your" : "Rival";
}

export function pieceLabel(piece: Piece, hasBall: boolean): string {
  const where = piece.cls === "keeper" ? "in goal" : `on ${sqName(piece)}`;
  const extra = [hasBall ? "has the ball" : null, piece.yellow ? "booked" : null].filter(Boolean).join(", ");
  return `${sideName(piece)} ${classTraits[piece.cls].label} ${piece.card.shortName} ${where}, rated ${piece.card.rating}${
    extra ? `, ${extra}` : ""
  }`;
}

type BoardProps = {
  sq: number;
  pieces: readonly Piece[];
  carrierId: string;
  /** Where the ball is drawn: the carrier's square, or a goal mouth after a goal. */
  ballAt: Sq;
  selectedId: string | null;
  liveIds: ReadonlySet<string>;
  restedIds: ReadonlySet<string>;
  targets: readonly BoardTarget[];
  pendingKey: string | null;
  lastMove: { from: Sq; to: Sq } | null;
  threatLanes: readonly ShotLane[];
  onPiece: (piece: Piece) => void;
  onTarget: (target: BoardTarget) => void;
  children?: ReactNode;
};

export function Board({
  sq,
  pieces,
  carrierId,
  ballAt,
  selectedId,
  liveIds,
  restedIds,
  targets,
  pendingKey,
  lastMove,
  threatLanes,
  onPiece,
  onTarget,
  children,
}: BoardProps) {
  const arrowId = useId().replace(/:/g, "");
  const lastFrom = lastMove?.from;
  const lastTo = lastMove?.to;
  const threatFrom = threatLanes[0]?.from;
  const squares: ReactNode[] = [];
  for (let row = ROWS - 1; row >= 0; row -= 1) {
    for (let col = 0; col < COLS; col += 1) {
      const isLast =
        (lastFrom !== undefined && lastFrom.col === col && lastFrom.row === row) ||
        (lastTo !== undefined && lastTo.col === col && lastTo.row === row);
      const isThreat = threatFrom !== undefined && threatFrom.col === col && threatFrom.row === row;
      squares.push(
        <div
          key={`${col}-${row}`}
          className={styles.square}
          data-dark={(col + row) % 2 === 0 ? "" : undefined}
          data-last={isLast ? "" : undefined}
          data-threat={isThreat ? "" : undefined}
          style={{ "--c": col, "--r": row } as CSSProperties}
        >
          {col === 0 ? (
            <span className={styles.coord} style={{ top: "5%", left: "6%" }}>
              {row + 1}
            </span>
          ) : null}
          {row === 0 ? (
            <span className={styles.coord} style={{ bottom: "5%", right: "7%" }}>
              {FILES[col]}
            </span>
          ) : null}
        </div>,
      );
    }
  }

  const ball = centreOf(ballAt);
  const inGoal = ballAt.col < 0 || ballAt.col >= COLS;
  const ballCarrier = pieces.find((piece) => piece.id === carrierId);
  const keeperBall = ballCarrier?.cls === "keeper" && !inGoal;
  const ballX = ball.x - 0.14 + (inGoal ? 0 : keeperBall ? 0.12 : 0.2);
  const ballY = ball.y - 0.14 + (inGoal ? 0 : 0.2);

  return (
    <div className={styles.frame} style={{ "--sq": `${sq}px` } as CSSProperties}>
      <div className={styles.board} data-board="">
        <div className={`${styles.goal} ${styles.goalHome}`} aria-hidden="true" />
        <div className={`${styles.goal} ${styles.goalAway}`} aria-hidden="true" />
        {squares}
        <Chalk />

        <svg className={styles.overlaySvg} viewBox={`0 0 ${boardWidth} ${ROWS}`} aria-hidden="true">
          <defs>
            <marker id={`${arrowId}-a`} viewBox="0 0 10 10" refX="7" refY="5" markerWidth="3.2" markerHeight="3.2" orient="auto-start-reverse">
              <path d="M0 0 10 5 0 10Z" fill="rgba(240, 214, 140, 0.92)" />
            </marker>
            <marker id={`${arrowId}-t`} viewBox="0 0 10 10" refX="7" refY="5" markerWidth="3" markerHeight="3" orient="auto-start-reverse">
              <path d="M0 0 10 5 0 10Z" fill="rgba(226, 98, 86, 0.9)" />
            </marker>
          </defs>
          {threatLanes.slice(0, 3).map((lane, index) => {
            const a = centreOf(lane.from);
            const b = centreOf({ col: -1, row: lane.target });
            return (
              <line
                key={index}
                x1={a.x}
                y1={a.y}
                x2={b.x + 0.2}
                y2={b.y}
                stroke="rgba(226, 98, 86, 0.85)"
                strokeWidth={0.06}
                strokeDasharray="0.14 0.1"
                markerEnd={`url(#${arrowId}-t)`}
              />
            );
          })}
          {lastMove !== null ? <Arrow from={lastMove.from} to={lastMove.to} marker={`${arrowId}-a`} /> : null}
        </svg>

        {pieces.map((piece) => {
          const keeper = piece.cls === "keeper";
          const live = liveIds.has(piece.id);
          return (
            <button
              key={piece.id}
              type="button"
              className={`${styles.token} ${piece.side === "home" ? styles.home : styles.away} ${keeper ? styles.keeperToken : ""}`}
              style={{ "--x": leftOf(piece.col), "--y": ROWS - 1 - piece.row } as CSSProperties}
              aria-pressed={piece.id === selectedId}
              aria-label={pieceLabel(piece, piece.id === carrierId)}
              data-live={live ? "" : undefined}
              data-rested={restedIds.has(piece.id) ? "" : undefined}
              data-piece={piece.id}
              onClick={() => onPiece(piece)}
            >
              <span className={styles.piece}>
                <ClassGlyph cls={piece.cls} className={styles.glyph} />
                <span className={styles.tokenRating}>{piece.card.rating}</span>
                {piece.yellow ? (
                  <span className={styles.booking}>
                    <CardGlyph colour="yellow" size={Math.max(10, sq * 0.2)} />
                  </span>
                ) : null}
              </span>
              <span className={styles.tokenName}>{piece.card.shortName}</span>
            </button>
          );
        })}

        <span className={styles.ball} style={{ "--x": ballX, "--y": ballY } as CSSProperties} data-ball="">
          <BallIcon />
        </span>

        {targets.map((target) => (
          <button
            key={target.key}
            type="button"
            className={styles.target}
            style={{ "--c": target.col, "--r": target.row } as CSSProperties}
            data-goal={target.kind === "shot" ? (target.col < 0 ? "home" : "away") : undefined}
            data-pending={target.key === pendingKey ? "" : undefined}
            data-target={target.kind}
            aria-label={target.label}
            onClick={() => onTarget(target)}
          >
            <TargetMark target={target} />
          </button>
        ))}

        {children}
      </div>
    </div>
  );
}

function TargetMark({ target }: { target: BoardTarget }) {
  const chip =
    target.chance !== null ? (
      <span className={styles.odds} data-low={target.chance < 0.35 ? "" : undefined}>
        {Math.round(target.chance * 100)}%
      </span>
    ) : null;
  switch (target.kind) {
    case "move":
      return <span className={styles.moveDot} />;
    case "skill":
      return <span className={styles.skillDot} />;
    case "pass":
      return (
        <>
          <span className={styles.ring} />
          {chip}
        </>
      );
    case "duel":
      return (
        <>
          <span className={styles.ring} data-kind="duel" />
          {chip}
        </>
      );
    case "shot":
      return (
        <>
          <span className={styles.ring} data-kind="shot" />
          {chip}
        </>
      );
  }
}

function Arrow({ from, to, marker }: { from: Sq; to: Sq; marker: string }) {
  const a = centreOf(from);
  const b = centreOf(to);
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const length = Math.hypot(dx, dy);
  if (length < 0.2) return null;
  // Stop short of the centre so the head sits beside the piece, not under it.
  const trim = Math.min(0.32, length / 3);
  const x2 = b.x - (dx / length) * trim;
  const y2 = b.y - (dy / length) * trim;
  return (
    <line
      x1={a.x}
      y1={a.y}
      x2={x2}
      y2={y2}
      stroke="rgba(240, 214, 140, 0.78)"
      strokeWidth={0.09}
      strokeLinecap="round"
      markerEnd={`url(#${marker})`}
    />
  );
}

/** The chalk markings: touchlines, halfway line, centre circle and boxes. */
function Chalk() {
  const line = { fill: "none", stroke: "rgba(242, 239, 225, 0.7)", strokeWidth: 2, vectorEffect: "non-scaling-stroke" } as const;
  return (
    <svg className={styles.chalk} viewBox={`0 0 ${boardWidth} ${ROWS}`} aria-hidden="true">
      <rect x={0.7} y={0} width={COLS} height={ROWS} {...line} />
      <line x1={0.7 + COLS / 2} y1={0} x2={0.7 + COLS / 2} y2={ROWS} {...line} />
      <circle cx={0.7 + COLS / 2} cy={ROWS / 2} r={0.85} {...line} />
      <circle cx={0.7 + COLS / 2} cy={ROWS / 2} r={0.05} fill="rgba(242, 239, 225, 0.8)" />
      <rect x={0.7} y={1} width={2} height={3} {...line} />
      <rect x={0.7} y={1.6} width={0.55} height={1.8} {...line} />
      <rect x={0.7 + COLS - 2} y={1} width={2} height={3} {...line} />
      <rect x={0.7 + COLS - 0.55} y={1.6} width={0.55} height={1.8} {...line} />
      <path d={`M2.7 1.9A0.75 0.75 0 0 1 2.7 3.1`} {...line} />
      <path d={`M${0.7 + COLS - 2} 1.9A0.75 0.75 0 0 0 ${0.7 + COLS - 2} 3.1`} {...line} />
    </svg>
  );
}
