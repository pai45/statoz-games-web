"use client";

import { useMemo } from "react";

import { Progress, TimerIcon, accentVar } from "@/design-system";
import type { Sport } from "@/domain/sports";
import type { EconomySnapshot } from "@/features/economy";
import { DailyDrop } from "@/features/packs";
import { dailyDealConfig } from "@/mocks/shop";
import { useClock } from "@/shared/hooks";

import type { BuyRequest } from "../hooks/use-shop-actions";
import { dayKey, formatCountdown, msUntilReset, pickDailyDeals } from "../lib/daily-deals";
import { buildDealPools, DealTile, describeDeal } from "./shop-deals";
import { ShopRail } from "./shop-tiles";
import styles from "./shop-screen.module.css";

/**
 * TODAY'S MARKET: the free daily card and three discounted deals. Both reset
 * on a timer, so there is a reason to come back tomorrow.
 */
export function ShopMarket({
  sport,
  economy,
  buy,
}: {
  sport: Sport;
  economy: EconomySnapshot;
  buy: (request: BuyRequest) => void;
}) {
  const now = useClock();
  // Null until the client clock is known, so the server and first paint agree.
  const today = now === null ? null : dayKey(now);
  const deals = useMemo(
    () =>
      today === null
        ? []
        : pickDailyDeals(`${sport}:${today}`, dailyDealConfig.slots, buildDealPools(sport), dailyDealConfig.discounts),
    [sport, today],
  );
  const claimed = deals.filter((deal) => describeDeal(deal.item, economy).owned).length;
  const allClaimed = deals.length > 0 && claimed === deals.length;
  const countdown = now === null ? "--:--:--" : formatCountdown(msUntilReset(now));
  const gold = accentVar("gold");

  return (
    <section id="market" aria-labelledby="shop-market-title" className={styles.market}>
      <header className={styles.marketHead}>
        <div>
          <p className={styles.kicker}>{"// TODAY'S MARKET"}</p>
          <h1 id="shop-market-title" className={styles.marketTitle}>SHOP</h1>
        </div>
        <p className={styles.resetClock}>
          <TimerIcon size={16} />
          <span>DEALS RESET IN</span>
          <b aria-live="off">{countdown}</b>
        </p>
      </header>

      <div className={styles.marketGrid}>
        <div className={styles.dropSlot}>
          <DailyDrop sport={sport} actionLabel="BACK TO SHOP" />
        </div>

        <div className={styles.dealsPanel}>
          <div className={styles.dealsHead}>
            <h2 className={styles.dealsTitle}>DAILY DEALS</h2>
            <span className={styles.meta}>{`${claimed}/${deals.length || dailyDealConfig.slots.length} CLAIMED`}</span>
          </div>
          <Progress
            value={deals.length ? claimed / deals.length : 0}
            accent={gold}
            label="Daily deals claimed"
            className="mb-3"
          />
          {allClaimed ? (
            <p className={styles.allClaimed}>{`ALL DEALS CLAIMED — FRESH DEALS IN ${countdown}`}</p>
          ) : null}
          {deals.length ? (
            <ShopRail size="deal" label="Daily deals">
              {deals.map((deal, index) => (
                <DealTile key={`${deal.slot}-${index}`} deal={deal} economy={economy} index={index} buy={buy} />
              ))}
            </ShopRail>
          ) : (
            <div className={styles.dealsLoading} aria-hidden />
          )}
        </div>
      </div>
    </section>
  );
}
