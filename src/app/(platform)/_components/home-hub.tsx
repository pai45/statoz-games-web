"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useLayoutEffect, useRef } from "react";
import { gameSportOrder, type GameSport } from "@/domain/game-sports";
import { allGamesInFeedOrder, sportGamesInDeckOrder } from "@/features/games/home-catalog";
import { AllGamesList } from "@/features/games/components/all-games-list";
import { GameCoverflow } from "@/features/games/components/game-coverflow";
import { GameSportTabs } from "@/features/games/components/game-sport-tabs";
import { useHomeHubTheme } from "@/features/shell/components/home-hub-surface";

/** `/`, `/?sport=…`, and either with `view=all` when the full list is open. */
function hubHref(sport: GameSport | null, viewAll: boolean) {
  const params = new URLSearchParams();
  if (sport) params.set("sport", sport);
  if (viewAll) params.set("view", "all");
  const query = params.toString();
  return query ? `/?${query}` : "/";
}

/**
 * The games tab: sport tabs, then the coverflow of every game in that view
 * with a VIEW ALL GAMES list on top. The list lives in the URL (`view=all`)
 * so the phone's back button closes it.
 */
export function HomeHub() {
  const router = useRouter(), query = useSearchParams();
  const requested = query.get("sport");
  const selected = gameSportOrder.includes(requested as GameSport) ? requested as GameSport : null;
  const viewAll = query.get("view") === "all";
  const openedHere = useRef(false);
  const publishTheme = useHomeHubTheme();
  useLayoutEffect(() => publishTheme(selected === "golf" ? "tennis" : selected === "archery" ? "trending" : selected ?? "trending"), [selected, publishTheme]);

  const select = (sport: GameSport | null) => router.replace(hubHref(sport, false), { scroll: false });
  const openList = () => { openedHere.current = true; router.push(hubHref(selected, true), { scroll: false }); };
  const closeList = () => {
    if (openedHere.current) { openedHere.current = false; router.back(); }
    else router.replace(hubHref(selected, false), { scroll: false });
  };
  const games = selected ? sportGamesInDeckOrder(selected) : allGamesInFeedOrder();

  return <div className="flex min-h-0 flex-1 flex-col">
    <GameSportTabs selected={selected} onSelect={select} />
    <div role="tabpanel" aria-label={selected ? `${selected} games` : "All games"} className="flex min-h-0 flex-1 flex-col">
      <GameCoverflow key={selected ?? "all"} games={games} label={selected ? `${selected} games` : "Featured games"} onViewAll={openList} />
    </div>
    {viewAll ? <AllGamesList initialSport={selected} onClose={closeList} /> : null}
  </div>;
}
