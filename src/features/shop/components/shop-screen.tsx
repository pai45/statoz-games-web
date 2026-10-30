"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, type CSSProperties } from "react";

import { FilterChips, SearchIcon, accentVar } from "@/design-system";
import { sportModuleFor, sportOrder, type Sport } from "@/domain/sports";
import { useEconomy } from "@/features/economy";

import { useShopActions } from "../hooks/use-shop-actions";
import { ShopMarket } from "./shop-hero";
import { shopItemDomId } from "./shop-tiles";
import { CardsShelf } from "./shelves/cards-shelf";
import { CoinsShelf } from "./shelves/coins-shelf";
import { PacksShelf } from "./shelves/packs-shelf";
import { StyleShelf, type StyleKind } from "./shelves/style-shelf";
import styles from "./shop-screen.module.css";

/**
 * The storefront: one scrolling page instead of a sport-by-category grid.
 *
 * TODAY'S MARKET (the free daily card and three daily deals) leads, then one
 * shelf each for packs, player cards, style and coins. The sport chips at the
 * top switch every shelf at once.
 *
 * Deep links keep working: `?tab=` names the shelf to scroll to (the old
 * category ids map onto the new shelves) and `?focus=` names an item to open
 * and light up.
 */

type ShelfId = "packs" | "cards" | "style" | "coins";

const styleKinds: StyleKind[] = ["avatars", "frames", "banners", "kits"];

function shelfFor(tab: string | null): ShelfId | null {
  if (tab === "packs" || tab === "cards" || tab === "coins" || tab === "style") return tab;
  if (styleKinds.includes(tab as StyleKind)) return "style";
  return null;
}

function sportFrom(value: string | null): Sport {
  return sportOrder.includes(value as Sport) ? (value as Sport) : "football";
}

export function ShopScreen() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");
  const focus = searchParams.get("focus");
  // A new deep link remounts the storefront so it opens where the link points.
  return (
    <ShopStorefront
      key={`${tab ?? ""}|${focus ?? ""}`}
      initialSport={sportFrom(searchParams.get("sport"))}
      tab={tab}
      focus={focus}
    />
  );
}

function ShopStorefront({ initialSport, tab, focus }: { initialSport: Sport; tab: string | null; focus: string | null }) {
  const economy = useEconomy();
  const [sport, setSport] = useState<Sport>(initialSport);
  const { buy, buyCoins, openPack, overlays } = useShopActions(sport);
  const accent = accentVar(sportModuleFor(sport).accent);
  const target = shelfFor(tab);

  useEffect(() => {
    if (!target) return;
    const tile = target === "packs" && focus ? document.getElementById(shopItemDomId(focus))?.firstElementChild : null;
    (tile ?? document.getElementById(target))?.scrollIntoView({ block: tile ? "center" : "start" });
  }, [target, focus]);

  function changeSport(label: string) {
    const next = sportOrder.find((entry) => sportModuleFor(entry).label.toUpperCase() === label);
    if (!next) return;
    setSport(next);
    const url = new URL(window.location.href);
    url.searchParams.set("sport", next);
    window.history.replaceState(null, "", `${url.pathname}${url.search}`);
  }

  return (
    <section
      className={`${styles.shell} relative isolate flex min-h-full flex-1 flex-col`}
      style={{ "--shop-accent": accent } as CSSProperties}
    >
      <div className="sticky top-0 z-10 flex items-center gap-1 border-b border-line-muted bg-surface-nav/95 px-3 backdrop-blur-sm sm:px-5">
        <FilterChips
          options={sportOrder.map((entry) => sportModuleFor(entry).label.toUpperCase())}
          selected={sportModuleFor(sport).label.toUpperCase()}
          onSelect={changeSport}
          accent={accent}
          label="Shop sport"
          className="min-w-0 flex-1 py-1.5"
        />
        <Link
          href="/shop/search"
          aria-label="Search the shop"
          className="grid size-11 shrink-0 place-items-center text-muted hover:text-cyan focus-visible:outline-2 focus-visible:outline-cyan"
        >
          <SearchIcon size={20} />
        </Link>
      </div>

      <div className="relative z-[1] mx-auto flex w-full max-w-[1500px] flex-1 flex-col gap-9 px-3 py-5 sm:px-5 lg:px-7">
        <ShopMarket sport={sport} economy={economy} buy={buy} />
        <PacksShelf sport={sport} economy={economy} focusId={target === "packs" ? focus : null} onOpen={openPack} />
        <CardsShelf sport={sport} economy={economy} focusId={target === "cards" ? focus : null} buy={buy} />
        <StyleShelf
          sport={sport}
          economy={economy}
          initialKind={styleKinds.includes(tab as StyleKind) ? (tab as StyleKind) : null}
          focusId={target === "style" ? focus : null}
          buy={buy}
        />
        <CoinsShelf onBuy={buyCoins} />
      </div>

      {overlays}
    </section>
  );
}
