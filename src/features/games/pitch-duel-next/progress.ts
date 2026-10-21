"use client";

import { useSyncExternalStore } from "react";
import type { Deck, Match } from "./rules";
import { divisionFor } from "./rules";
import { recordStreakActivity } from "@/features/streaks/activity";

const key = "statoz.games.web.pitch-duel.reboot.v2";
export type Result = { id: string; at: string; playedAt: string; opponent: string; opponentName: string; home: number; away: number; playerScore: number; opponentScore: number; result: "Victory" | "Draw" | "Defeat"; points: number; division: number; decisions: Match["decisions"] };
export type Career = { version: 2; deck: Deck | null; points: number; xp: number; wins: number; played: number; currentStreak: number; bestStreak: number; tutorialSeen: boolean; history: Result[]; rewardedDivisions: number[] };
const empty: Career = { version: 2, deck: null, points: 0, xp: 0, wins: 0, played: 0, currentStreak: 0, bestStreak: 0, tutorialSeen: false, history: [], rewardedDivisions: [] };
const listeners = new Set<() => void>();
let lastRaw: string | null = null; let snapshot: Career = empty;
function safe(value: unknown): Career { if (!value || typeof value !== "object") return empty; const c = value as Partial<Career>; return { ...empty, ...c, version: 2, deck: c.deck && Array.isArray(c.deck.attackers) && Array.isArray(c.deck.tactics) ? c.deck : null, points: Math.max(0, Number(c.points) || 0), xp: Math.max(0, Number(c.xp) || 0), wins: Math.max(0, Number(c.wins) || 0), played: Math.max(0, Number(c.played) || 0), history: Array.isArray(c.history) ? c.history.slice(0, 30) : [], rewardedDivisions: Array.isArray(c.rewardedDivisions) ? c.rewardedDivisions : [] }; }
function read(): Career { if (typeof window === "undefined") return empty; let raw: string | null = null; try { raw = localStorage.getItem(key); } catch { return snapshot; } if (raw === lastRaw) return snapshot; lastRaw = raw; try { snapshot = raw ? safe(JSON.parse(raw)) : empty; } catch { snapshot = empty; } return snapshot; }
function subscribe(fn: () => void) { listeners.add(fn); const onStorage = (e: StorageEvent) => { if (e.key === key || e.key === null) { lastRaw = null; fn(); } }; window.addEventListener("storage", onStorage); return () => { listeners.delete(fn); window.removeEventListener("storage", onStorage); }; }
function write(next: Career) { const value = safe(next); try { localStorage.setItem(key, JSON.stringify(value)); lastRaw = null; } catch { snapshot = value; } for (const fn of listeners) fn(); }
export function usePitchDuelCareer(): Career { return useSyncExternalStore(subscribe, read, () => empty); }
export function saveDeck(deck: Deck) { write({ ...read(), deck }); }
export function markTutorialSeen() { write({ ...read(), tutorialSeen: true }); }
export function settleMatch(match: Match): { result: Result; promoted: number | null } {
  if (match.index !== 6) throw new Error("Match unfinished");
  const current = read(); const existing = current.history.find(r => r.id === match.id); if (existing) return { result: existing, promoted: null };
  const earned = match.home > match.away ? 3 : match.home === match.away ? 1 : 0;
  const points = current.points + earned; const division = divisionFor(points); const promoted = division > divisionFor(current.points) ? division : null;
  const win = match.home > match.away; const streak = win ? current.currentStreak + 1 : 0;
  const at = new Date().toISOString();
  const result: Result = { id: match.id, at, playedAt: at, opponent: match.opponent, opponentName: match.opponent, home: match.home, away: match.away, playerScore: match.home, opponentScore: match.away, result: win ? "Victory" : match.home === match.away ? "Draw" : "Defeat", points: earned, division: match.division, decisions: match.decisions };
  write({ ...current, points, xp: points * 40, wins: current.wins + Number(win), played: current.played + 1, currentStreak: streak, bestStreak: Math.max(current.bestStreak, streak), history: [result, ...current.history].slice(0, 30), rewardedDivisions: promoted ? [...current.rewardedDivisions, promoted] : current.rewardedDivisions });
  recordStreakActivity("pitchDuel", new Date(at));
  return { result, promoted };
}
