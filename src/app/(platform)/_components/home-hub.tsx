"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useLayoutEffect, type ReactNode } from "react";
import { gameSportOrder, type GameSport } from "@/domain/game-sports";
import { AdSlot } from "@/features/ads";
import { FeaturedGameSpotlight } from "@/features/games/components/featured-game-spotlight";
import { GameSportTabs } from "@/features/games/components/game-sport-tabs";
import { useHomeHubTheme } from "@/features/shell/components/home-hub-surface";

export type HomeHubProps = {gamesFeed:ReactNode;sportDecks:Record<GameSport,ReactNode>};
export function HomeHub({gamesFeed,sportDecks}:HomeHubProps) {
  const router=useRouter(),query=useSearchParams();
  const requested=query.get("sport");
  const selected=gameSportOrder.includes(requested as GameSport)?requested as GameSport:null;
  const publishTheme=useHomeHubTheme();
  useLayoutEffect(()=>publishTheme(selected === "golf" ? "tennis" : selected??"trending"),[selected,publishTheme]);
  function select(sport:GameSport|null) {router.replace(sport?`/?sport=${sport}`:"/",{scroll:false});}
  return <div className="flex min-h-0 flex-1 flex-col">
    <GameSportTabs selected={selected} onSelect={select}/>
    <div role="tabpanel" aria-label={selected?`${selected} games`:"All games"} className="flex-1 overflow-y-auto px-4 py-4">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5">
        {selected === null ? <FeaturedGameSpotlight sport={null}/> : null}
        <AdSlot placement="home-feed"/>
        {selected?sportDecks[selected]:gamesFeed}
      </div>
    </div>
  </div>;
}
