import { gameSportOrder, type GameSport } from "@/domain/game-sports";
import { deckFor, gamesTrendingCatalog, sportGameDecks } from "@/mocks/games";
import type { GameId } from "./types";

/** Curated trending order first, then any active game the curated list omits. */
export function allGamesInFeedOrder(): GameId[] {
  return [...new Set<GameId>([
    ...gamesTrendingCatalog.map((item) => item.sourceId),
    ...gameSportOrder.flatMap((sport) => sportGameDecks[sport]),
  ])];
}

/** A sport's games as its deck lists them: heroes first, then quick games. */
export function sportGamesInDeckOrder(sport: GameSport): GameId[] {
  const { heroes, quick } = deckFor(sport);
  return [...heroes, ...quick];
}

/** Games whose cover ships with the game bundle rather than the shared covers folder. */
const bundledCoverGames: readonly string[] = ["football-shooting", "retro-football-2", "stick-cricket", "archery-test"];

/** Public path of a game's cover art (pass through `publicAsset`). */
export function gameCoverPath(id: GameId): string {
  if (id === "f1-racing") return "/assets/games/covers/grand-prix-dash.webp";
  return bundledCoverGames.includes(id) ? `/games/${id}/cover.png` : `/assets/games/covers/${id}.webp`;
}

/** How many games the home banner rotates through. */
export const spotlightLimit = { all: 3, sport: 3 } as const;

/** The games the featured banner rotates through for the selected view. */
export function spotlightGames(sport: GameSport | null): GameId[] {
  return sport
    ? sportGamesInDeckOrder(sport).slice(0, spotlightLimit.sport)
    : allGamesInFeedOrder().slice(0, spotlightLimit.all);
}

/**
 * Where a card sits in the library bento.
 *
 * Wide screens use six columns: `feature` cards take half a row, ordinary cards
 * a third. The first two lead as features; the tail is evened out so no row is
 * left short: one leftover card goes `wide` (a full row), two leftovers become
 * a pair of features. Phones and tablets ignore this: a plain two-column grid.
 */
export type LibraryCardLayout = { feature: boolean; wide: boolean };

export function libraryCardLayout(count: number, index: number): LibraryCardLayout {
  const leading = count >= 4 || count === 2 ? 2 : 0;
  const leftover = (count - leading) % 3;
  const last = index === count - 1;
  const feature = index < leading || (leftover === 2 && index >= count - 2);
  const wide = count === 1 || (last && leftover === 1);
  return { feature, wide };
}

/** Cards in the first row of the two-column touch grid play their hover treatment unprompted. */
export const liveCardCount = 2;
