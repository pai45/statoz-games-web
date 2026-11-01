// Longbow progress. The bundle host scopes localStorage per account; this file only validates.
import {LEVELS, OPPONENTS, RANGES, RANGE_UNLOCK_STARS, levelFor, opponentFor} from './levels';
import {checkpoint, restore, shooterFor, type ArrowResult, type Checkpoint, type Config, type Game} from './engine';

export const SAVE_KEY = 'longbow.progress.v1';
export type Save = {
  schemaVersion: 1;
  stars: Record<string, number>;
  best: Record<string, number>;
  rivals: Record<string, {played: number; won: number; best: number}>;
  sound: boolean;
  reducedMotion: boolean;
  checkpoint: Checkpoint | null;
  resultId: string | null;
};
export const emptySave = (): Save => ({schemaVersion: 1, stars: {}, best: {}, rivals: {}, sound: true, reducedMotion: false, checkpoint: null, resultId: null});

const isCount = (n: unknown, max: number) => Number.isInteger(n) && (n as number) >= 0 && (n as number) <= max;
const isRecord = (value: unknown): value is Record<string, unknown> => !!value && typeof value === 'object' && !Array.isArray(value);

export function configFor(cp: Pick<Checkpoint, 'mode' | 'id'>): Config | null {
  if (cp.mode === 'career') {const level = levelFor(cp.id); return level ? {mode: 'career', level} : null;}
  const opponent = opponentFor(cp.id); return opponent ? {mode: 'match', opponent} : null;
}

function validResults(config: Config, results: unknown) {
  if (!Array.isArray(results)) return false;
  // Rebuild a game only to learn the arrow count and shooter order; it consumes no saved data.
  const probe = restore(config, {mode: config.mode, id: '', initialSeed: 1, results: []});
  if (results.length > probe.totalArrows) return false;
  return results.every((r: ArrowResult, i) => isRecord(r) && r.shooter === shooterFor(probe, i) && isCount(r.score, 10) && typeof r.x === 'boolean'
    && typeof r.miss === 'boolean' && (r.miss ? r.score === 0 && !r.x : r.score >= 1) && (!r.x || r.score === 10)
    && Number.isFinite(r.px) && Number.isFinite(r.py) && Math.abs(r.px) <= 20 && Math.abs(r.py) <= 20);
}

export function readSave(raw: string | null): {save: Save; incompatible: boolean} {
  if (!raw) return {save: emptySave(), incompatible: false};
  try {
    const s = JSON.parse(raw) as Save;
    const ok = s && s.schemaVersion === 1 && isRecord(s.stars) && isRecord(s.best) && isRecord(s.rivals)
      && Object.entries(s.stars).every(([id, n]) => levelFor(id) && isCount(n, 3))
      && Object.entries(s.best).every(([id, n]) => levelFor(id) && isCount(n, levelFor(id)!.arrows * 10))
      && Object.entries(s.rivals).every(([id, r]) => opponentFor(id) && isRecord(r) && isCount(r.played, 1e6) && isCount(r.won, r.played as number) && isCount(r.best, 150))
      && typeof s.sound === 'boolean' && typeof s.reducedMotion === 'boolean' && (s.resultId === null || (typeof s.resultId === 'string' && s.resultId.length <= 64));
    if (!ok) throw Error('invalid');
    if (s.checkpoint !== null) {
      const cp = s.checkpoint, config = isRecord(cp) && (cp.mode === 'career' || cp.mode === 'match') && typeof cp.id === 'string' ? configFor(cp) : null;
      if (!config || !isCount(cp.initialSeed, 4294967295) || !validResults(config, cp.results)) throw Error('invalid checkpoint');
    }
    return {save: s, incompatible: false};
  } catch {
    return {save: emptySave(), incompatible: true};
  }
}

/** Stores the completed arrows of `game`, and on a finish its best score, stars and rival record. */
export function record(save: Save, game: Game): Save {
  const next: Save = {...save, stars: {...save.stars}, best: {...save.best}, rivals: {...save.rivals}, checkpoint: checkpoint(game)};
  if (game.phase !== 'finished') return next;
  next.checkpoint = null;
  if (game.config.mode === 'career') {
    const id = game.config.level.id;
    next.best[id] = Math.max(next.best[id] ?? 0, game.score.player);
    next.stars[id] = Math.max(next.stars[id] ?? 0, game.stars);
  } else {
    const id = game.config.opponent.id, old = next.rivals[id] ?? {played: 0, won: 0, best: 0};
    next.rivals[id] = {played: old.played + 1, won: old.won + (game.won ? 1 : 0), best: Math.max(old.best, game.score.player)};
  }
  return next;
}

export function resumed(save: Save): Game | null {
  const cp = save.checkpoint, config = cp && configFor(cp);
  if (!cp || !config) return null;
  const game = restore(config, cp);
  return game.phase === 'finished' ? null : game;
}

export const rangeStars = (save: Save, range: number) => LEVELS.filter(l => l.range === range).reduce((sum, l) => sum + (save.stars[l.id] ?? 0), 0);
export const rangeUnlocked = (save: Save, range: number) => range === 0 || rangeStars(save, range - 1) >= RANGE_UNLOCK_STARS;
export function levelUnlocked(save: Save, index: number) {
  const level = LEVELS[index];
  if (!level || !rangeUnlocked(save, level.range)) return false;
  return index % 10 === 0 || (save.stars[LEVELS[index - 1].id] ?? 0) >= 1;
}
export const totalStars = (save: Save) => RANGES.reduce((sum, _, i) => sum + rangeStars(save, i), 0);
export const rivalUnlocked = (save: Save, index: number) => index === 0 || (save.rivals[OPPONENTS[index - 1].id]?.won ?? 0) >= 1;
