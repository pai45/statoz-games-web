"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";

import { FilterChips, accentVar } from "@/design-system";
import type { PlayerCard as PlayerCardData, PlayerRole } from "@/domain/cards";
import { sportModuleFor, type Sport } from "@/domain/sports";
import type { EconomySnapshot } from "@/features/economy";
import { allPlayerCards, playerCardCoinPrice, playerCardInrPrice } from "@/features/packs";

import type { BuyRequest } from "../../hooks/use-shop-actions";
import { cardAccents, cardSport, ShopPlayerCard } from "../shop-previews";
import { ownedCount, ShopShelf, ShopShelfDrawer } from "../shop-shelf";
import { CardGrid, CardTile, ShopEmptyFilter, ShopFocusTarget, ShopRail, shopItemDomId } from "../shop-tiles";

/** How many of the top-rated cards the shelf row shows. */
const RAIL_COUNT = 12;
/** How many cards the SEE ALL grid draws before asking for a filter. */
const GRID_CAP = 60;

const tierFilters = ["BRONZE", "SILVER", "GOLD", "PLATINUM"] as const;

const roleFilters: Record<Sport, [label: string, role: PlayerRole][]> = {
  football: [["ATTACKERS", "attacker"], ["DEFENDERS", "defender"], ["KEEPERS", "goalkeeper"]],
  cricket: [["BATTERS", "batsman"], ["BOWLERS", "bowler"]],
  basketball: [["GUARDS", "basketballGuard"], ["WINGS", "basketballWing"], ["BIGS", "basketballBig"]],
  tennis: [],
  motorsport: [["F1", "f1Driver"], ["F2", "f2Driver"], ["NASCAR", "nascarDriver"], ["INDYCAR", "indycarDriver"]],
};

function matchesFilter(card: PlayerCardData, sport: Sport, filter: string) {
  if (filter === "ALL") return true;
  if ((tierFilters as readonly string[]).includes(filter)) return card.tier === filter.toLowerCase();
  const role = roleFilters[sport].find(([label]) => label === filter)?.[1];
  return role ? card.role === role : true;
}

export function CardsShelf({
  sport,
  economy,
  focusId,
  buy,
}: {
  sport: Sport;
  economy: EconomySnapshot;
  focusId: string | null;
  buy: (request: BuyRequest) => void;
}) {
  const [drawerOpen, setDrawerOpen] = useState(focusId !== null);
  const cards = useMemo(
    () => allPlayerCards.filter((card) => cardSport(card) === sport).sort((a, b) => b.rating - a.rating),
    [sport],
  );
  if (!cards.length) return null;

  // Only the SEE ALL grid carries the deep-link target, so its id stays unique.
  const tile = (card: PlayerCardData, index: number, focusable = false) => {
    const accent = cardAccents[card.tier];
    const coinPrice = playerCardCoinPrice(card);
    const inrPrice = playerCardInrPrice(card);
    const preview = <ShopPlayerCard card={card} selected />;
    const body = (
      <CardTile
        key={card.id}
        index={index}
        name={card.name}
        accent={accent}
        coinPrice={coinPrice}
        inr={inrPrice}
        owned={economy.owned.playerCardIds.includes(card.id)}
        card={<ShopPlayerCard card={card} />}
        onCoins={() => buy({ kind: "playerCard", id: card.id, price: coinPrice, label: card.name, accent, preview })}
        onInr={() =>
          buy({ kind: "playerCard", id: card.id, price: inrPrice, label: card.name, accent, preview, simulatedInr: true })
        }
      />
    );
    return focusable ? (
      <ShopFocusTarget key={card.id} id={card.id} focused={focusId === card.id}>
        {body}
      </ShopFocusTarget>
    ) : body;
  };

  return (
    <ShopShelf
      id="cards"
      kicker="SIGN A PLAYER"
      title="PLAYER CARDS"
      meta={ownedCount(cards.map((card) => card.id), economy.owned.playerCardIds)}
      onSeeAll={() => setDrawerOpen(true)}
    >
      <ShopRail size="card" label="Top rated player cards">
        {cards.slice(0, RAIL_COUNT).map((card, index) => tile(card, index))}
      </ShopRail>
      <ShopShelfDrawer open={drawerOpen} title={`${sportModuleFor(sport).label.toUpperCase()} CARDS`} onClose={() => setDrawerOpen(false)}>
        {drawerOpen ? <CardCatalog key={sport} sport={sport} cards={cards} focusId={focusId} tile={tile} /> : null}
      </ShopShelfDrawer>
    </ShopShelf>
  );
}

function CardCatalog({
  sport,
  cards,
  focusId,
  tile,
}: {
  sport: Sport;
  cards: PlayerCardData[];
  focusId: string | null;
  tile: (card: PlayerCardData, index: number, focusable: boolean) => ReactNode;
}) {
  const [filter, setFilter] = useState("ALL");
  const filtered = cards.filter((card) => matchesFilter(card, sport, filter));
  const shown = filtered.slice(0, GRID_CAP);
  const focused = focusId ? filtered.find((card) => card.id === focusId) : undefined;
  if (focused && !shown.includes(focused)) shown.unshift(focused);

  useScrollToItem(focusId);

  return (
    <>
      <FilterChips
        options={["ALL", ...roleFilters[sport].map(([label]) => label), ...tierFilters]}
        selected={filter}
        onSelect={setFilter}
        accent={accentVar(sportModuleFor(sport).accent)}
        label="Filter player cards"
        className="mb-4"
      />
      {shown.length ? (
        <>
          <CardGrid>{shown.map((card, index) => tile(card, index, true))}</CardGrid>
          {filtered.length > shown.length ? (
            <p className="mt-4 text-center font-display text-2xs font-black tracking-wide text-muted">
              {`SHOWING ${shown.length} OF ${filtered.length} — FILTER TO NARROW`}
            </p>
          ) : null}
        </>
      ) : (
        <ShopEmptyFilter sport={sport} label="NO CARDS MATCH THIS FILTER" />
      )}
    </>
  );
}

/** Scrolls a deep-linked tile into view once its drawer has opened. */
export function useScrollToItem(id: string | null) {
  useEffect(() => {
    if (!id) return;
    const frame = window.requestAnimationFrame(() => {
      const tile = document.getElementById(shopItemDomId(id))?.firstElementChild;
      tile?.scrollIntoView({ block: "center", inline: "center" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [id]);
}
