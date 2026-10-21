"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useLayoutEffect, type ReactNode } from "react";
import { sportOrder, type Sport } from "@/domain/sports";
import { AdSlot } from "@/features/ads";
import { GameSportTabs } from "@/features/games/components/game-sport-tabs";
import { useHomeHubTheme } from "@/features/shell/components/home-hub-surface";

export type HomeHubProps = {gamesFeed:ReactNode;sportDecks:Record<Sport,ReactNode>};
export function HomeHub({gamesFeed,sportDecks}:HomeHubProps) {
  const router=useRouter(),query=useSearchParams();
  const requested=query.get("sport");
  const selected=sportOrder.includes(requested as Sport)?requested as Sport:null;
  const publishTheme=useHomeHubTheme();
  useLayoutEffect(()=>publishTheme(selected??"trending"),[selected,publishTheme]);
  function select(sport:Sport|null) {router.replace(sport?`/?sport=${sport}`:"/",{scroll:false});}
  return <div className="flex min-h-0 flex-1 flex-col">
    <GameSportTabs selected={selected} onSelect={select}/>
    <div role="tabpanel" aria-label={selected?`${selected} games`:"All games"} className="flex-1 overflow-y-auto px-4 py-4">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5">
        <AdSlot placement="home-feed"/>
        {selected?sportDecks[selected]:gamesFeed}
      </div>
    </div>
  </div>;
}
