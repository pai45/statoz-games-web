"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CSSProperties } from "react";

import { accentVar, BrandIcon, FlameIcon, PlusIcon } from "@/design-system";
import { useEconomy } from "@/features/economy";
import { currentStreak, useIsStreakHydrated, useStreakSnapshot } from "@/features/streaks";
import { formatInt } from "@/shared/utils";

import styles from "./platform-top-bar.module.css";

export type PlatformTopBarProps = {
  title?: string;
  coins?: number;
  /** Accent for the wordmark glow and the add-coins button. */
  accent?: string;
};

const GOLD = accentVar("gold");

/** The persistent header: wordmark, streak, and coin balance. */
export function PlatformTopBar({
  title,
  coins,
  accent = accentVar("cyan"),
}: PlatformTopBarProps) {
  const pathname = usePathname();
  const resolvedTitle = title ?? (pathname.startsWith("/shop")
    ? "Shop"
    : pathname === "/decks"
      ? "Deck Locker"
      : pathname.startsWith("/decks/")
        ? "Loadout"
        : "StatOz");
  return (
    <header
      className={`${styles.bar} flex h-19.5 shrink-0 items-center gap-3 px-4 pr-3.5 phone-land:h-12`}
      style={{
        "--bar-bg": pathname === "/" ? "color-mix(in srgb, var(--ds-color-background-nav) 84%, transparent)" : "var(--ds-color-background-nav)",
        "--bar-line": `color-mix(in srgb, ${accent} 26%, transparent)`,
      } as CSSProperties}
    >
      <h1
        className="flex-1 truncate font-display text-2xl font-black leading-compact tracking-tight phone-land:text-lg"
        style={{ textShadow: `0 0 12px color-mix(in srgb, ${accent} 30%, transparent)` }}
      >
        {resolvedTitle}
      </h1>

      <AuthenticatedStats coins={coins} accent={accent} />
    </header>
  );
}

function AuthenticatedStats({
  coins,
  accent,
}: {
  coins?: number;
  accent: string;
}) {
  const economy = useEconomy();
  const streakSnapshot = useStreakSnapshot();
  const streakHydrated = useIsStreakHydrated();
  const streak = currentStreak(streakSnapshot, "overall");
  const resolvedCoins = coins ?? economy.coins;

  return (
    <>
      <Link
        href="/streaks"
        className="flex items-center gap-1.5 px-1 py-2"
        aria-label={`Daily streak: ${streak} days`}
      >
        <FlameIcon size={22} style={{ color: GOLD }} />
        <span className="ds-tabular font-display text-sm font-black">
          {streakHydrated ? formatInt(streak) : "—"}
        </span>
      </Link>

      <div className="flex items-center gap-2 pl-2">
        <BrandIcon name="ozCoins" size={18} alt="" />
        <span className="ds-tabular font-display text-sm font-black">
          {formatInt(resolvedCoins)}
        </span>
        <Link
          href="/shop?tab=coins"
          aria-label="Add coins"
          className="grid size-7 place-items-center text-inverse"
          style={{ background: accent }}
        >
          <PlusIcon size={17} />
        </Link>
      </div>
    </>
  );
}
