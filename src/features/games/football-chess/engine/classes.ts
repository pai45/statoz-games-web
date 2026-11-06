/**
 * Piece classes, read from the card's first listed position. No new card data
 * is needed: the football pool only uses ST, LW, RW, CM, CAM, CB, CDM, LB, RB
 * and GK, and anything unexpected falls back on the card's role.
 */

import type { PieceCard, PieceClass } from "./state";

const byPosition: Record<string, PieceClass> = {
  ST: "striker",
  CF: "striker",
  SS: "striker",
  LW: "runner",
  RW: "runner",
  LM: "runner",
  RM: "runner",
  LB: "runner",
  RB: "runner",
  LWB: "runner",
  RWB: "runner",
  CM: "playmaker",
  CAM: "playmaker",
  CB: "defender",
  CDM: "defender",
  GK: "keeper",
};

export function classOf(card: PieceCard): PieceClass {
  if (card.role === "goalkeeper") return "keeper";
  const primary = card.position.split("/")[0]?.trim().toUpperCase() ?? "";
  const cls = byPosition[primary];
  if (cls !== undefined && cls !== "keeper") return cls;
  return card.role === "defender" ? "defender" : "striker";
}

export type ClassTraits = {
  label: string;
  /** Two letters, for tokens and the move list. */
  short: string;
  /** Columns from goal the class may shoot from. */
  shootRange: number;
  moves: string;
  power: string;
};

export const classTraits: Record<PieceClass, ClassTraits> = {
  striker: {
    label: "Striker",
    short: "ST",
    shootRange: 4,
    moves: "1 square, any direction",
    power: "Shoots from 4 columns out, with a finishing bonus",
  },
  runner: {
    label: "Runner",
    short: "RN",
    shootRange: 3,
    moves: "Up to 2 squares in a straight line",
    power: "Skill move: once per possession, an L-shaped jump with the ball. Bonus on take-ons",
  },
  playmaker: {
    label: "Playmaker",
    short: "PM",
    shootRange: 3,
    moves: "1 square, any direction",
    power: "Lofted pass: over any piece, and it cannot be cut out on the way",
  },
  defender: {
    label: "Defender",
    short: "DF",
    shootRange: 3,
    moves: "1 square, any direction",
    power: "Guards the 8 squares around it. Bonus on tackles and blocks",
  },
  keeper: {
    label: "Keeper",
    short: "GK",
    shootRange: 0,
    moves: "Follows the ball along the goal by itself",
    power: "Saves shots, and can throw it to any teammate (a marked one can be picked off)",
  },
};
