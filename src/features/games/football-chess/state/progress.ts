"use client";

import { useSyncExternalStore } from "react";

import { settleCoinReward } from "@/features/economy";

import {
  applyResult,
  coinsFor,
  emptySave,
  legacyKey,
  migrateV1,
  sanitizeSave,
  saveKey,
  type FootballChessSave,
  type QuickSetup,
  type ResultEntry,
  type Settings,
  type TutorialStatus,
} from "./save-schema";

export type { FootballChessSave, QuickSetup, ResultEntry, Settings } from "./save-schema";

/**
 * Browser-local store for the v2 save. A v1 record is migrated in memory on
 * read (nothing is written during render) and persisted by `ensureMigrated`
 * from an effect, or by the next write. The v1 key is never deleted.
 */

const listeners = new Set<() => void>();
let lastRaw: string | null = null;
let snapshot: FootballChessSave = emptySave;

function rawPair(): string | null {
  try {
    return [saveKey, legacyKey].map((key) => localStorage.getItem(key) ?? "").join("\u0000");
  } catch {
    return null;
  }
}

function read(): FootballChessSave {
  if (typeof window === "undefined") return emptySave;
  const raw = rawPair();
  if (raw === null || raw === lastRaw) return snapshot;
  lastRaw = raw;
  const [current, legacy] = raw.split("\u0000");
  try {
    snapshot = current ? sanitizeSave(JSON.parse(current)) : migrateV1(legacy || null);
  } catch {
    snapshot = emptySave;
  }
  return snapshot;
}

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);
  const onStorage = (event: StorageEvent) => {
    // `null` is storage cleared, which an account switch does.
    if (event.key === saveKey || event.key === legacyKey || event.key === null) {
      lastRaw = null;
      onChange();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onStorage);
  };
}

function write(next: FootballChessSave): void {
  const value = sanitizeSave(next);
  try {
    localStorage.setItem(saveKey, JSON.stringify(value));
    lastRaw = null;
  } catch {
    // Storage refused (a private window): the value still stands for this visit.
    snapshot = value;
  }
  for (const listener of listeners) listener();
}

export function useFootballChessSave(): FootballChessSave {
  return useSyncExternalStore(subscribe, read, () => emptySave);
}

export function readFootballChessSave(): FootballChessSave {
  return read();
}

/** Persists a migrated v1 record the first time v2 opens. Safe to call repeatedly. */
export function ensureMigrated(): void {
  try {
    if (localStorage.getItem(saveKey) || !localStorage.getItem(legacyKey)) return;
  } catch {
    return;
  }
  write(read());
}

export function updateSettings(patch: Partial<Settings>): void {
  const current = read();
  write({ ...current, revision: current.revision + 1, settings: { ...current.settings, ...patch } });
}

export function saveQuickSetup(quick: QuickSetup): void {
  const current = read();
  write({ ...current, revision: current.revision + 1, quick });
}

export function setTutorial(tutorial: TutorialStatus): void {
  const current = read();
  if (current.tutorial === tutorial) return;
  write({ ...current, revision: current.revision + 1, tutorial });
}

export type MatchSettlement = { entry: ResultEntry; coins: number; duplicate: boolean };

/**
 * Banks a finished match and pays its coins. Idempotent by match id; call it
 * from an effect or a handler, never during render.
 */
export function settleMatch(result: Omit<ResultEntry, "result" | "at">): MatchSettlement {
  const settlement = applyResult(read(), { ...result, at: new Date().toISOString() });
  const coins = coinsFor(settlement.entry.result);
  if (settlement.duplicate) return { entry: settlement.entry, coins, duplicate: true };
  write(settlement.save);
  settleCoinReward({
    id: `football-chess-v2-${result.id}`,
    coins,
    title: "FOOTBALL CHESS",
    subtitle: `${result.scored}-${result.conceded} vs ${result.opponent}`,
  });
  return { entry: settlement.entry, coins, duplicate: false };
}
