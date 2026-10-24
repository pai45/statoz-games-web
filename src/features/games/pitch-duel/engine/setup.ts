import type { ActionCard, PlayerCard } from "@/domain/cards";

import type { RandomSource } from "../../shared/engine/random-source";
import { generateShootoutOpponent } from "../../shared/engine/opponent";

import { formationIds, type ClubSetup } from "./lineup";
import type { FormationId, MatchSetup } from "./types";

export const divisions = ["LOCAL LEAGUE", "CITY CIRCUIT", "REGIONAL CUP", "NATIONAL LEAGUE", "CHAMPIONS DIVISION"];

export const opponentClubs = [
  ["Mill Town", "Harbour FC", "Kingsbridge", "Ashford Rovers"],
  ["Northside", "Riverside City", "Old Quay", "Bramley United"],
  ["Union Eleven", "Castlegate", "Westmoor", "Redcliff Athletic"],
  ["Royal Borough", "Eastport", "Highfield", "Calder Vale"],
  ["Metro Stars", "Crown Athletic", "Ironbridge", "Atlas FC"],
];

/** Division level for the shared opponent drafter (ratings ~76 → 88). */
const opponentLevel = [5, 6, 7, 9, 11];

/** Three points a win; promotion every nine, five divisions. */
export function divisionFor(points: number): number {
  return Math.min(5, Math.floor(Math.max(0, points) / 9) + 1);
}

export type TeamInput = MatchSetup["home"];

export function teamFromClub(
  club: ClubSetup,
  name: string,
  cardFor: (id: string) => PlayerCard | undefined,
  actionFor: (id: string) => Pick<ActionCard, "id" | "power"> | undefined,
): TeamInput {
  const ids = [club.keeperId, ...club.outfield];
  const cards = Object.fromEntries(ids.map((id) => [id, cardFor(id)]).filter((e): e is [string, PlayerCard] => Boolean(e[1])));
  return {
    name,
    formation: club.formation,
    keeperId: club.keeperId,
    outfield: club.outfield,
    cards,
    tactics: club.tactics.map(actionFor).filter((c): c is Pick<ActionCard, "id" | "power"> => Boolean(c)).map((c) => ({ id: c.id, power: c.power })),
  };
}

export type Opponent = { name: string; team: TeamInput };

/** The CPU club for a division: a name, a formation and five cards near the division's level. */
export function draftOpponent(
  division: number,
  pools: { attackers: PlayerCard[]; defenders: PlayerCard[]; keepers: PlayerCard[] },
  random: RandomSource,
): Opponent {
  const tier = Math.min(4, Math.max(0, division - 1));
  const names = opponentClubs[tier];
  const name = names[Math.floor(random() * names.length)];
  const squad = generateShootoutOpponent(opponentLevel[tier], pools.attackers, pools.defenders, pools.keepers, random);
  const [a1, a2, d1, d2, keeper] = squad.shooters;
  // Two attackers and two defenders suit every shape except All-Out, which would push a defender up front.
  const shapes = formationIds.filter((f) => f !== "1-3");
  const formation: FormationId = shapes[Math.floor(random() * shapes.length)];
  const outfield = formation === "3-1" ? [d1.id, d2.id, a2.id, a1.id] : [d1.id, d2.id, a1.id, a2.id];
  const cards = Object.fromEntries(squad.shooters.map((c) => [c.id, c]));
  return { name, team: { name, formation, keeperId: keeper.id, outfield, cards, tactics: [] } };
}
