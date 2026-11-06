// Rim Rush progress. The bundle host scopes localStorage per account; this file only validates and updates.
import {CUPS, RIVALS, cupFor, rivalFor} from './levels';
import {BALLS, OUTFITS, ballFor, outfitFor} from './shop';
import type {Game} from './engine';

export const SAVE_KEY = 'rim-rush.progress.v1';
const MAX_COINS = 1e7, MAX_COUNT = 1e7;
export type CupProgress = {round: number; titles: number};
export type Save = {
  schemaVersion: 1;
  coins: number;
  owned: {outfits: string[]; balls: string[]};
  outfit: string;
  ball: string;
  cups: Record<string, CupProgress>;
  rivals: Record<string, {played: number; won: number}>;
  best: number;
  totals: {makes: number; swishes: number; banks: number; blocks: number};
  sound: boolean;
  reducedMotion: boolean;
  resultId: string | null;
};
export const emptySave = (): Save => ({
  schemaVersion: 1, coins: 0, owned: {outfits: ['sunset'], balls: ['classic']}, outfit: 'sunset', ball: 'classic',
  cups: {}, rivals: {}, best: 0, totals: {makes: 0, swishes: 0, banks: 0, blocks: 0}, sound: true, reducedMotion: false, resultId: null,
});

const isCount = (n: unknown, max: number) => Number.isInteger(n) && (n as number) >= 0 && (n as number) <= max;
const isRecord = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);
const uniqueIds = (list: unknown, valid: (id: string) => unknown) =>
  Array.isArray(list) && list.length <= 64 && new Set(list).size === list.length && list.every(id => typeof id === 'string' && valid(id));

export function readSave(raw: string | null): {save: Save; incompatible: boolean} {
  if (!raw) return {save: emptySave(), incompatible: false};
  try {
    const s = JSON.parse(raw) as Save;
    const ok = isRecord(s) && s.schemaVersion === 1 && isCount(s.coins, MAX_COINS)
      && isRecord(s.owned) && uniqueIds(s.owned.outfits, outfitFor) && uniqueIds(s.owned.balls, ballFor)
      && s.owned.outfits.includes('sunset') && s.owned.balls.includes('classic')
      && s.owned.outfits.includes(s.outfit) && s.owned.balls.includes(s.ball)
      && isRecord(s.cups) && Object.entries(s.cups).every(([id, c]) => cupFor(id) && isRecord(c) && isCount(c.round, 2) && isCount(c.titles, MAX_COUNT))
      && isRecord(s.rivals) && Object.entries(s.rivals).every(([id, r]) => rivalFor(id) && isRecord(r) && isCount(r.played, MAX_COUNT) && isCount(r.won, r.played as number))
      && isCount(s.best, 999) && isRecord(s.totals) && (['makes', 'swishes', 'banks', 'blocks'] as const).every(k => isCount(s.totals[k], MAX_COUNT))
      && s.totals.swishes <= s.totals.makes && s.totals.banks <= s.totals.makes
      && typeof s.sound === 'boolean' && typeof s.reducedMotion === 'boolean'
      && (s.resultId === null || (typeof s.resultId === 'string' && s.resultId.length <= 64));
    if (!ok) throw Error('invalid');
    // Cups open in order: a later cup can only have progress once the one before it has a title.
    CUPS.forEach((cup, i) => {if (i > 0 && s.cups[cup.id] && !(s.cups[CUPS[i - 1].id]?.titles > 0)) throw Error('cup order');});
    return {save: s, incompatible: false};
  } catch {
    return {save: emptySave(), incompatible: true};
  }
}

export const cupUnlocked = (s: Save, index: number) => index === 0 || (s.cups[CUPS[index - 1].id]?.titles ?? 0) > 0;
export const cupProgress = (s: Save, id: string): CupProgress => s.cups[id] ?? {round: 0, titles: 0};
/** Quick-match rivals open once their cup is open. */
export const rivalUnlocked = (s: Save, id: string) => CUPS.some((cup, i) => cupUnlocked(s, i) && cup.rounds.some(r => r.rival === id));
export const titles = (s: Save) => CUPS.reduce((n, c) => n + (s.cups[c.id]?.titles ?? 0), 0);

export type Reward = {coins: number; cupWon: boolean; breakdown: {label: string; coins: number}[]};

/** Coins for a finished match, from the player's side only. */
export function rewardFor(game: Game): Reward {
  const st = game.stats[0], won = game.winner === 0, tier = game.config.rival.tier;
  const breakdown: Reward['breakdown'] = [{label: won ? 'Win' : game.tied ? 'Draw' : 'Played', coins: won ? 20 + 10 * tier : game.tied ? 12 : 8}];
  if (st.swishes) breakdown.push({label: `${st.swishes} swish${st.swishes === 1 ? '' : 'es'}`, coins: st.swishes * 2});
  if (st.banks) breakdown.push({label: `${st.banks} bank${st.banks === 1 ? '' : 's'}`, coins: st.banks * 2});
  if (st.blocks) breakdown.push({label: `${st.blocks} block${st.blocks === 1 ? '' : 's'}`, coins: st.blocks * 3});
  const cup = game.config.mode === 'cup' && game.config.cup ? cupFor(game.config.cup) : null;
  const cupWon = !!cup && won && game.config.round === cup.rounds.length - 1;
  if (cupWon) breakdown.push({label: `${cup!.name} title`, coins: cup!.reward});
  return {coins: breakdown.reduce((n, b) => n + b.coins, 0), cupWon, breakdown};
}

/** Applies a finished match to the save. */
export function record(save: Save, game: Game): {save: Save; reward: Reward} {
  const reward = rewardFor(game), st = game.stats[0], rival = game.config.rival.id;
  const old = save.rivals[rival] ?? {played: 0, won: 0};
  const next: Save = {
    ...save, coins: Math.min(MAX_COINS, save.coins + reward.coins), best: Math.min(999, Math.max(save.best, game.score[0])),
    rivals: {...save.rivals, [rival]: {played: old.played + 1, won: old.won + (game.winner === 0 ? 1 : 0)}},
    totals: {makes: save.totals.makes + st.makes, swishes: save.totals.swishes + st.swishes, banks: save.totals.banks + st.banks, blocks: save.totals.blocks + st.blocks},
    cups: {...save.cups},
  };
  const cup = game.config.mode === 'cup' && game.config.cup ? cupFor(game.config.cup) : null;
  if (cup && game.winner === 0 && game.config.round !== undefined) {
    const progress = cupProgress(save, cup.id);
    next.cups[cup.id] = reward.cupWon ? {round: 0, titles: progress.titles + 1} : {round: Math.min(cup.rounds.length - 1, game.config.round + 1), titles: progress.titles};
  }
  return {save: next, reward};
}

export function buy(save: Save, kind: 'outfit' | 'ball', id: string): Save | null {
  const item = kind === 'outfit' ? outfitFor(id) : ballFor(id), list = kind === 'outfit' ? save.owned.outfits : save.owned.balls;
  if (!item || list.includes(id) || save.coins < item.price) return null;
  const owned = kind === 'outfit' ? {...save.owned, outfits: [...list, id]} : {...save.owned, balls: [...list, id]};
  return {...save, coins: save.coins - item.price, owned, ...(kind === 'outfit' ? {outfit: id} : {ball: id})};
}
export function equip(save: Save, kind: 'outfit' | 'ball', id: string): Save | null {
  const list = kind === 'outfit' ? save.owned.outfits : save.owned.balls;
  if (!list.includes(id)) return null;
  return kind === 'outfit' ? {...save, outfit: id} : {...save, ball: id};
}
export const counts = {outfits: OUTFITS.length, balls: BALLS.length, rivals: RIVALS.length};
