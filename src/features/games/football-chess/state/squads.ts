import type { PlayerCard } from "@/domain/cards";
import {
  footballAttackers,
  footballDefenders,
  footballGoalkeepers,
  footballPlayerCards,
} from "@/features/packs";
import { footballChessAcademy } from "@/mocks/packs/football-chess-academy";

import { randomOpponentName } from "../../shared/data/opponent-names";
import { personalities, type Difficulty, type Personality } from "../engine/ai/bots";
import { seededSource } from "../engine/rng";
import { draftSquad, squadRating } from "../engine/setup";
import { matchConfig, type Formation, type MatchSetup } from "../engine/state";
import type { QuickSetup } from "./save-schema";

/**
 * Who takes the field. Your five come from your active football deck; when
 * that deck is not complete, the Academy five play instead, so the game
 * never turns a player away.
 */

type FootballLoadout = { attackers: string[]; defenders: string[]; keeperId: string | null };

export type YourSquad = { cards: PlayerCard[]; academy: boolean };

export function squadFromLoadout(loadout: FootballLoadout | undefined): YourSquad {
  const academy = { cards: [...footballChessAcademy], academy: true };
  if (loadout === undefined || loadout.keeperId === null) return academy;
  const find = (id: string) => footballPlayerCards.find((card) => card.id === id);
  const attackers = loadout.attackers.map(find).filter((card): card is PlayerCard => card !== undefined);
  const defenders = loadout.defenders.map(find).filter((card): card is PlayerCard => card !== undefined);
  const keeper = find(loadout.keeperId);
  if (attackers.length < 2 || defenders.length < 2 || keeper === undefined) return academy;
  return { cards: [attackers[0], attackers[1], defenders[0], defenders[1], keeper], academy: false };
}

/** A rival manager's habits suggest a shape. */
const preferredShape: Record<Personality, Formation[]> = {
  balanced: ["box", "diamond"],
  parkTheBus: ["defensive"],
  tikiTaka: ["diamond"],
  gegenpress: ["attacking"],
  longBall: ["attacking", "box"],
  maverick: ["box", "attacking", "diamond"],
};

export type QuickMatch = {
  id: string;
  setup: MatchSetup;
  opponentName: string;
  difficulty: Difficulty;
  personality: Personality;
  /** You called the toss right, and kick off. */
  tossWon: boolean;
};

/**
 * Draws everything a quick match needs in one go: the seed, the rival's
 * name, habits, shape and squad (within two points of yours), and the toss.
 * Call it from a handler, never during render.
 */
export function drawQuickMatch(quick: QuickSetup, squad: YourSquad, seed = Math.floor(Math.random() * 2 ** 31)): QuickMatch {
  const random = seededSource(seed);
  const personality = personalities[Math.floor(random() * personalities.length)];
  const shapes = preferredShape[personality];
  const formation = shapes[Math.floor(random() * shapes.length)];
  const target = squadRating(squad.cards) + Math.floor(random() * 5) - 2;
  const awaySquad = draftSquad(
    target,
    { attackers: footballAttackers, defenders: footballDefenders, keepers: footballGoalkeepers },
    random,
    new Set(squad.cards.map((card) => card.id)),
  );
  const tossWon = random() < 0.5;
  const opponentName = randomOpponentName(random);
  return {
    id: `${Date.now().toString(36)}-${seed.toString(36)}`,
    setup: {
      seed,
      home: { name: "You", formation: quick.formation, squad: squad.cards },
      away: { name: opponentName, formation, squad: awaySquad },
      config: matchConfig(quick.length),
      kickoff: tossWon ? "home" : "away",
    },
    opponentName,
    difficulty: quick.difficulty,
    personality,
    tossWon,
  };
}
