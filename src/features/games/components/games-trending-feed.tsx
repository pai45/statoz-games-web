import { gameRegistry, gamesTrendingCatalog, sportGameDecks } from "@/mocks/games";
import { sportOrder } from "@/domain/sports";
import type { GameId } from "../types";
import { QuickGameTile } from "./quick-game-tile";

/** Curated order first, then any active games the old trending grid omitted. */
export function GamesTrendingFeed() {
  const ordered=[...new Set<GameId>([
    ...gamesTrendingCatalog.map(item=>item.sourceId),
    ...sportOrder.flatMap(sport=>sportGameDecks[sport]),
  ])];
  return <section aria-label="All games"><ul className="grid grid-cols-2 gap-3 lg:grid-cols-3">
    {ordered.map(id=><li key={id}><QuickGameTile game={id} entry={gameRegistry[id]}/></li>)}
  </ul></section>;
}
