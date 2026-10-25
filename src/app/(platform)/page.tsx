import { Suspense, type ReactNode } from "react";

import { gameSportOrder, type GameSport } from "@/domain/game-sports";
import { GamesTrendingFeed, SportGameDeck } from "@/features/games";


import { HomeHub } from "./_components/home-hub";

/** Every sport's deck, rendered up front so the browse strip switches locally. */
const sportDecks = Object.fromEntries(
  gameSportOrder.map((sport) => [sport, <SportGameDeck key={sport} sport={sport} />]),
) as Record<GameSport, ReactNode>;

export default function HomePage() {
  return (
    <Suspense fallback={<div className="flex-1 bg-background" />}>
      <HomeHub
        gamesFeed={<GamesTrendingFeed />}
        sportDecks={sportDecks}
      />
    </Suspense>
  );
}
