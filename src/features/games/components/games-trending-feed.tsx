import { allGamesInFeedOrder } from "../home-catalog";
import { GameLibrary } from "./game-library";

/** Curated order first, then any active games the old trending grid omitted. */
export function GamesTrendingFeed() {
  return <GameLibrary games={allGamesInFeedOrder()} label="All games" collection="GAME LIBRARY" />;
}
