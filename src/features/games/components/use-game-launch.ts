"use client";
import type { GameEntry } from "@/mocks/games";
import { usePathname, useSearchParams } from "next/navigation";
import { gameLaunchHref } from "../shared/navigation";

/**
 * Games open directly for guests and signed-in players alike.
 */
export type GameLaunch = { href: string; onClick?: undefined } | { href?: undefined; onClick: () => void };

export function useGameLaunch(entry: GameEntry): GameLaunch {
  const pathname = usePathname(), query = useSearchParams();
  return { href: gameLaunchHref(entry.href, pathname + (query.size ? `?${query}` : "")) };
}
