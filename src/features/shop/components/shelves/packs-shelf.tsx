"use client";

import { accentVar } from "@/design-system";
import type { Sport } from "@/domain/sports";
import type { EconomySnapshot } from "@/features/economy";
import { eliteHolo, foilMagenta, packArtIds, packHolo, racingPacks, standardPacks, type ShopPack } from "@/mocks/shop";

import { ShopTag } from "../shop-card";
import { ShopShelf } from "../shop-shelf";
import { PackTile, ShopFocusTarget, ShopRail } from "../shop-tiles";

export function PacksShelf({
  sport,
  economy,
  focusId,
  onOpen,
}: {
  sport: Sport;
  economy: EconomySnapshot;
  focusId: string | null;
  onOpen: (pack: ShopPack, inr: boolean) => void;
}) {
  const packs = sport === "motorsport" ? racingPacks : standardPacks;
  const starterReady = packs.some((pack) => pack.id === "starter") && !economy.starterClaims[sport];

  return (
    <ShopShelf
      id="packs"
      kicker="RIP AND REVEAL"
      title="PACKS"
      meta={starterReady ? <ShopTag label="FREE STARTER READY" accent={accentVar("lime")} /> : `${packs.length} PACKS`}
    >
      <ShopRail size="pack" label="Packs">
        {packs.map((pack, index) => (
          <ShopFocusTarget key={pack.id} id={pack.id} focused={focusId === pack.id}>
            <PackTile
              index={index}
              label={pack.label}
              accent={pack.gradient ? foilMagenta : pack.accent}
              artSrc={`/assets/shop/packs/${packArtIds[pack.id] ?? pack.id}.png`}
              cardCount={pack.playerCount + pack.actionCount}
              coinPrice={pack.coinPrice}
              inr={pack.inr}
              starter={pack.id === "starter"}
              claimed={pack.id === "starter" && Boolean(economy.starterClaims[sport])}
              elite={Boolean(pack.gradient)}
              holo={packHolo[pack.id] ?? eliteHolo}
              onCoins={() => onOpen(pack, false)}
              onInr={() => onOpen(pack, true)}
            />
          </ShopFocusTarget>
        ))}
      </ShopRail>
    </ShopShelf>
  );
}
