"use client";

import { useEffect, useState, type ReactNode } from "react";

import { ConfirmDialog } from "@/design-system";
import { cardTierRank, type ActionCard, type PlayerCard as PlayerCardData } from "@/domain/cards";
import type { Sport } from "@/domain/sports";
import {
  addCoinTopUp,
  purchaseItem,
  purchasePack,
  readEconomy,
  type EconomyItemKind,
} from "@/features/economy";
import {
  PackRevealSequence,
  allActionCards,
  allPlayerCards,
  claimPack,
  packRarityOfAction,
  packRarityOfPlayer,
  rollFrom,
  rollStarterPackFor,
  type PackRevealItem,
} from "@/features/packs";
import type { CoinBundle, ShopPack } from "@/mocks/shop";
import { formatInt } from "@/shared/utils";

import { CoinTopUpCelebration, ShopAcquireOverlay, type ShopAcquisition } from "../components/shop-acquire-overlay";
import { cardSport } from "../components/shop-previews";

/**
 * Everything the storefront does when a price is tapped: the purchase itself,
 * the rupee-simulation confirm, and the celebration that follows. The shelves
 * only call `buy`, `buyCoins` and `openPack`; the screen renders `overlays`.
 */

export type BuyRequest = {
  kind: EconomyItemKind;
  id: string;
  price: number;
  label: string;
  accent: string;
  preview: ReactNode;
  simulatedInr?: boolean;
  /** Percent off, when bought from a daily deal. */
  dealDiscount?: number;
};

type ConfirmState = { title: string; message: string; action: () => void };
type Notice = { key: number; text: string; visible: boolean; getCoins?: boolean };

const NOTICE_MS = 4000;

export function useShopActions(sport: Sport) {
  const [notice, setNotice] = useState<Notice | null>(null);
  const [confirm, setConfirm] = useState<ConfirmState | null>(null);
  const [acquired, setAcquired] = useState<ShopAcquisition | null>(null);
  const [coinCelebration, setCoinCelebration] = useState<{ key: string; amount: number } | null>(null);
  const [reveal, setReveal] = useState<PackRevealItem[] | null>(null);

  useEffect(() => {
    if (!notice?.visible) return;
    const timer = window.setTimeout(() => setNotice(null), NOTICE_MS);
    return () => window.clearTimeout(timer);
  }, [notice]);

  /** Successes are celebrated by an overlay, so their notice is for screen readers only. */
  function announce(text: string, options: { visible?: boolean; getCoins?: boolean } = {}) {
    setNotice({ key: Date.now(), text, visible: options.visible ?? true, getCoins: options.getCoins });
  }

  function notEnoughCoins() {
    announce("Not enough Oz Coins for that one.", { getCoins: true });
  }

  function confirmSimulation(title: string, inr: number, detail: string, action: () => void) {
    setConfirm({ title, message: `₹${formatInt(inr)} simulation. ${detail}`, action });
  }

  function buy(request: BuyRequest) {
    const run = () => {
      const result = purchaseItem({
        kind: request.kind,
        id: request.id,
        price: request.price,
        title: request.dealDiscount ? `${request.label} (deal −${request.dealDiscount}%)` : request.label,
        simulatedInr: request.simulatedInr,
      });
      if (result.ok) {
        setAcquired({
          key: `${request.kind}-${request.id}-${Date.now()}`,
          name: request.label,
          accent: request.accent,
          coinsSpent: request.simulatedInr ? 0 : request.price,
          preview: request.preview,
          badge: request.dealDiscount ? `DEAL −${request.dealDiscount}%` : undefined,
        });
        announce(`${request.label} added to your inventory.`, { visible: false });
      } else if (result.reason === "owned") {
        announce(`${request.label} is already yours.`);
      } else {
        notEnoughCoins();
      }
    };
    if (request.simulatedInr) {
      confirmSimulation(request.label, request.price, "No real payment will be taken. This browser will receive the item.", run);
    } else {
      run();
    }
  }

  function buyCoins(bundle: CoinBundle) {
    confirmSimulation(
      `${bundle.label} coin bundle`,
      bundle.inr,
      `${formatInt(bundle.coins)} Oz Coins will be credited locally. No real payment will be taken.`,
      () => {
        addCoinTopUp({ id: bundle.id, coins: bundle.coins, title: bundle.label });
        setCoinCelebration({ key: `${bundle.id}-${Date.now()}`, amount: bundle.coins });
        announce(`${formatInt(bundle.coins)} Oz Coins added to your balance.`, { visible: false });
      },
    );
  }

  function openPack(pack: ShopPack, simulatedInr: boolean) {
    const execute = () => {
      if (pack.id === "starter") {
        if (readEconomy().starterClaims[sport]) {
          announce("This sport's Starter Pack is already claimed.");
          return;
        }
        const starter = rollStarterPackFor(sport);
        claimPack(sport, starter);
        setReveal(toReveal(starter.playerCards, starter.actionCards));
        return;
      }
      const players = allPlayerCards.filter((card) => cardSport(card) === sport);
      const pickedPlayers = Array.from({ length: pack.playerCount }, () =>
        rollFrom(players, packRarityOfPlayer, pack.odds, Math.random),
      ).filter((card): card is PlayerCardData => Boolean(card));
      const pickedActions = Array.from({ length: pack.actionCount }, () =>
        rollFrom(allActionCards, packRarityOfAction, pack.odds, Math.random),
      ).filter((card): card is ActionCard => Boolean(card));
      const result = purchasePack({
        id: pack.id,
        price: simulatedInr ? pack.inr : pack.coinPrice,
        title: pack.label,
        playerCardIds: pickedPlayers.map((card) => card.id),
        actionCardIds: pickedActions.map((card) => card.id),
        simulatedInr,
      });
      if (!result.ok) {
        notEnoughCoins();
        return;
      }
      setReveal(toReveal(pickedPlayers, pickedActions));
    };
    if (simulatedInr) {
      confirmSimulation(pack.label, pack.inr, "No real payment will be taken. Pack contents are stored only in this browser.", execute);
    } else {
      execute();
    }
  }

  const overlays = (
    <>
      <div aria-live="polite" className="sr-only">{notice?.text}</div>
      {notice?.visible ? (
        <div
          key={notice.key}
          role="status"
          className="fixed inset-x-3 bottom-24 z-40 mx-auto flex max-w-md items-center justify-between gap-3 border border-line-strong bg-surface-elevated px-4 py-3 shadow-2xl md:bottom-6"
        >
          <p className="text-xs text-foreground">{notice.text}</p>
          {notice.getCoins ? (
            <a
              href="#coins"
              onClick={() => setNotice(null)}
              className="flex min-h-11 shrink-0 items-center font-display text-2xs font-black tracking-wide text-cyan"
            >
              GET COINS
            </a>
          ) : null}
        </div>
      ) : null}
      <ConfirmDialog
        open={confirm !== null}
        title={confirm?.title ?? ""}
        message={confirm?.message ?? ""}
        confirmLabel="CONFIRM"
        cancelLabel="CANCEL"
        onConfirm={() => {
          const action = confirm?.action;
          setConfirm(null);
          action?.();
        }}
        onCancel={() => setConfirm(null)}
      />
      {acquired ? (
        <ShopAcquireOverlay key={acquired.key} acquisition={acquired} onDismissed={() => setAcquired(null)} />
      ) : null}
      {coinCelebration ? (
        <CoinTopUpCelebration
          key={coinCelebration.key}
          amount={coinCelebration.amount}
          onDone={() => setCoinCelebration(null)}
        />
      ) : null}
      {reveal ? (
        <PackRevealSequence
          items={reveal}
          actionLabel="BACK TO SHOP"
          onComplete={() => {
            setReveal(null);
            announce("Pack contents added to your collection.", { visible: false });
          }}
        />
      ) : null}
    </>
  );

  return { buy, buyCoins, openPack, overlays };
}

function toReveal(players: PlayerCardData[], actions: ActionCard[]): PackRevealItem[] {
  return [
    ...players.map((card): PackRevealItem => ({ kind: "player", card })),
    ...actions.map((card): PackRevealItem => ({ kind: "action", card })),
  ].sort(
    (a, b) =>
      cardTierRank(a.card.tier) - cardTierRank(b.card.tier) ||
      ("rating" in a.card ? a.card.rating : a.card.power) -
        ("rating" in b.card ? b.card.rating : b.card.power),
  );
}
