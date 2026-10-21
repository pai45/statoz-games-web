import { sportModuleFor, type Sport } from "@/domain/sports";
import { deckFor, gameRegistry } from "@/mocks/games";
import { QuickGameTile } from "./quick-game-tile";

export function SportGameDeck({sport}:{sport:Sport}) {
  const {heroes,quick}=deckFor(sport);
  return <section aria-label={`${sportModuleFor(sport).label} games`}>
    <ul className="grid grid-cols-2 gap-3 lg:grid-cols-3">
      {[...heroes,...quick].map(id=><li key={id}><QuickGameTile game={id} entry={gameRegistry[id]}/></li>)}
    </ul>
  </section>;
}
