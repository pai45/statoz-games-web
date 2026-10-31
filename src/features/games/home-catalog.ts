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
const bundledCoverGames: readonly string[] = ["penalty-cup", "f1-racing", "football-shooting", "retro-football-2", "stick-cricket", "archery-test", "soccer-real", "tennis-bits"];

export const hasBundledCover = (id: GameId) => bundledCoverGames.includes(id);

/** Public path of a game's cover art (pass through `publicAsset`). */
export function gameCoverPath(id: GameId): string {
  if (id === "f1-racing") return "/games/f1-racing/racer-cover.png";
  return hasBundledCover(id) ? `/games/${id}/cover.png` : `/assets/games/covers/${id}.webp`;
}

/**
 * Where game `index` sits in the home coverflow relative to the centre card:
 * 0 is the centre, negative to the left, positive to the right. Lists of five
 * or more wrap around, so there are always games on both sides. `centre` may
 * be fractional while a drag is between two games.
 */
export function coverflowOffset(index: number, centre: number, count: number): number {
  const offset = index - centre;
  if (count < 5) return offset;
  return offset - count * Math.round(offset / count);
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
