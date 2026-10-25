"use client";
import type { GameEntry } from "@/mocks/games";

/**
 * Games open directly for guests and signed-in players alike.
 */
export type GameLaunch = { href: string; onClick?: undefined } | { href?: undefined; onClick: () => void };

export function useGameLaunch(entry: GameEntry): GameLaunch {
  return { href: entry.href };
}
