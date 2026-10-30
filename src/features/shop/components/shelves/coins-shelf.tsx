"use client";

import { coinBundles, type CoinBundle } from "@/mocks/shop";
import { formatInt } from "@/shared/utils";

import { ShopShelf } from "../shop-shelf";
import { CoinTile, ShopRail } from "../shop-tiles";

/** Coin bundles are the same in every sport. Rupee prices are a local simulation. */
export function CoinsShelf({ onBuy }: { onBuy: (bundle: CoinBundle) => void }) {
  return (
    <ShopShelf id="coins" kicker="TOP UP · ₹ SIMULATION" title="OZ COINS" meta="NO REAL PAYMENT">
      <ShopRail size="portrait" label="Coin bundles">
        {coinBundles.map((bundle, index) => (
          <CoinTile
            key={bundle.id}
            index={index}
            label={bundle.label}
            coins={formatInt(bundle.coins)}
            inr={bundle.inr}
            accent={bundle.accent}
            artSrc={`/assets/shop/coins/${bundle.id}.png`}
            bonus={bundle.bonus}
            tag={bundle.tag}
            onBuy={() => onBuy(bundle)}
          />
        ))}
      </ShopRail>
    </ShopShelf>
  );
}
