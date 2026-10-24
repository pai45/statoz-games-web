import type { PlayerCard } from "@/domain/cards";

import { laneFit, weighted } from "./stats";
import type { FormationId, FormationSlot, Lane, Line, Progress, StatKey, TeamSheet } from "./types";

const all: Lane[] = ["left", "center", "right"];

export const formations: Record<FormationId, { label: string; blurb: string; slots: FormationSlot[] }> = {
  "2-2": {
    label: "BALANCED",
    blurb: "Two at the back, two up top. No weak spot.",
    slots: [
      { line: "back", lanes: ["left", "center"] },
      { line: "back", lanes: ["center", "right"] },
      { line: "front", lanes: ["left", "center"] },
      { line: "front", lanes: ["center", "right"] },
    ],
  },
  "1-2-1": {
    label: "DIAMOND",
    blurb: "Own the middle lane; the wings are thinner.",
    slots: [
      { line: "back", lanes: all },
      { line: "mid", lanes: ["left", "center"] },
      { line: "mid", lanes: ["center", "right"] },
      { line: "front", lanes: all },
    ],
  },
  "3-1": {
    label: "LOCKDOWN",
    blurb: "Three across the back. Hard to break, slow to score.",
    slots: [
      { line: "back", lanes: ["left"] },
      { line: "back", lanes: ["center"] },
      { line: "back", lanes: ["right"] },
      { line: "front", lanes: all },
    ],
  },
  "1-3": {
    label: "ALL-OUT",
    blurb: "Three forwards. Dangerous in their box, open in yours.",
    slots: [
      { line: "back", lanes: all },
      { line: "front", lanes: ["left"] },
      { line: "front", lanes: ["center"] },
      { line: "front", lanes: ["right"] },
    ],
  },
};

export const formationIds = Object.keys(formations) as FormationId[];

/** The k modifier a formation adds to one duel, from that team's side. */
export function formationModifier(
  formation: FormationId,
  role: "attack" | "defend",
  attackerProgress: Progress,
  lane: Lane,
): number {
  switch (formation) {
    case "1-2-1":
      return lane === "center" ? 2 : -2;
    case "3-1":
      if (attackerProgress < 6) return 0;
      return role === "defend" ? 3 : -3;
    case "1-3":
      if (attackerProgress < 6) return 0;
      return role === "attack" ? 3 : -3;
    default:
      return 0;
  }
}

function lineFor(progress: Progress, formation: FormationId): Line[] {
  const hasMid = formations[formation].slots.some((s) => s.line === "mid");
  if (progress <= 3) return ["back", "mid", "front"];
  if (progress >= 6) return ["front", "mid", "back"];
  if (hasMid) return progress === 4 ? ["mid", "back", "front"] : ["mid", "front", "back"];
  return progress === 4 ? ["back", "front"] : ["front", "back"];
}

/**
 * Who contests this duel for a team: the best-suited available player in the
 * line the zone calls for (Ballers' position pools, on a five-a-side sheet).
 * `progress` is from this team's own point of view.
 */
export function participantFor(
  team: TeamSheet,
  progress: Progress,
  lane: Lane,
  weights: Partial<Record<StatKey, number>>,
  sentOff: ReadonlySet<string>,
): string {
  const slots = formations[team.formation].slots;
  const available = team.outfield
    .map((id, index) => ({ id, slot: slots[index] }))
    .filter((entry) => entry.slot && !sentOff.has(entry.id));
  if (!available.length) return team.keeperId;

  const score = (id: string) => weighted(team.stats[id], weights) + laneFit(team.cards[id], lane);
  const best = (pool: typeof available) =>
    pool.reduce((a, b) => (score(b.id) > score(a.id) ? b : a)).id;

  for (const line of lineFor(progress, team.formation)) {
    const inLine = available.filter((e) => e.slot.line === line);
    if (!inLine.length) continue;
    const covering = inLine.filter((e) => e.slot.lanes.includes(lane));
    return best(covering.length ? covering : inLine);
  }
  return best(available);
}

export type ClubSetup = {
  formation: FormationId;
  keeperId: string;
  outfield: string[];
  tactics: string[];
};

export const maxTactics = 3;

export function lineupErrors(
  club: ClubSetup,
  ownedPlayers: readonly string[],
  ownedActions: readonly string[],
  cardFor: (id: string) => PlayerCard | undefined,
): string[] {
  const errors: string[] = [];
  if (!(club.formation in formations)) errors.push("Choose a formation");
  const keeper = cardFor(club.keeperId);
  if (!keeper || keeper.role !== "goalkeeper" || !ownedPlayers.includes(club.keeperId)) errors.push("Pick a keeper you own");
  const outfield = club.outfield.filter(Boolean);
  if (outfield.length !== 4) errors.push("Fill all four outfield slots");
  if (new Set(outfield).size !== outfield.length) errors.push("Each player can fill one slot");
  if (outfield.some((id) => !ownedPlayers.includes(id) || !cardFor(id) || cardFor(id)?.role === "goalkeeper"))
    errors.push("Outfield slots need owned outfield players");
  if (club.tactics.length > maxTactics || new Set(club.tactics).size !== club.tactics.length || club.tactics.some((id) => !ownedActions.includes(id)))
    errors.push(`Pick up to ${maxTactics} different owned tactics`);
  return errors;
}

/**
 * A playable first club from whatever the player owns: the keeper, then
 * defenders at the back and attackers up front, preferring the active loadout.
 */
export function defaultClub(
  ownedPlayers: readonly string[],
  ownedActions: readonly string[],
  cardFor: (id: string) => PlayerCard | undefined,
  preferred?: { attackers?: string[]; defenders?: string[]; keeperId?: string | null; actionCardIds?: string[] },
  actionCategory?: (id: string) => string | undefined,
): ClubSetup | null {
  const owned = (ids: readonly string[] | undefined) => (ids ?? []).filter((id) => ownedPlayers.includes(id));
  const order = [...new Set([...owned(preferred?.defenders), ...owned(preferred?.attackers), ...ownedPlayers])];
  const byRole = (role: PlayerCard["role"]) => order.filter((id) => cardFor(id)?.role === role);

  const keeperId = [...owned(preferred?.keeperId ? [preferred.keeperId] : []), ...byRole("goalkeeper")][0];
  const defenders = byRole("defender");
  const attackers = byRole("attacker");
  const outfield = [...defenders.slice(0, 2), ...attackers.slice(0, 2)];
  for (const id of [...defenders, ...attackers]) if (outfield.length < 4 && !outfield.includes(id)) outfield.push(id);
  if (!keeperId || outfield.length < 4) return null;

  const pool = [...new Set([...(preferred?.actionCardIds ?? []), ...ownedActions])].filter((id) => ownedActions.includes(id));
  const tactics: string[] = [];
  for (const category of ["attack", "defense", "special"]) {
    const hit = pool.find((id) => !tactics.includes(id) && actionCategory?.(id) === category);
    if (hit) tactics.push(hit);
  }
  for (const id of pool) if (tactics.length < maxTactics && !tactics.includes(id)) tactics.push(id);

  return { formation: "2-2", keeperId, outfield: outfield.slice(0, 4), tactics: tactics.slice(0, maxTactics) };
}
