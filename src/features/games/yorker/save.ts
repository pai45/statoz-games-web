import {BOWLERS, DELIVERIES, LESSONS, SPELLS, challengeById, type BowlerKind} from './data';
import {challengeFor, restore, type BowlInput, type Checkpoint, type Match} from './engine';

export const SAVE_KEY = 'yorker.progress.v1';
export type SpellRecord = {stars: number; best: number | null; plays: number; wins: number};
export type Save = {
  schemaVersion: 1;
  spells: Record<string, SpellRecord>; lessons: string[]; unlocked: number;
  bowler: BowlerKind; sound: boolean; reducedMotion: boolean; assist: boolean;
  checkpoint: Checkpoint | null; resultId: string | null;
  stats: {balls: number; wickets: number; runs: number; fastest: number; perfect: number};
};
export const emptySave = (): Save => ({schemaVersion: 1, spells: {}, lessons: [], unlocked: 0, bowler: 'pace', sound: true, reducedMotion: false, assist: false, checkpoint: null, resultId: null, stats: {balls: 0, wickets: 0, runs: 0, fastest: 0, perfect: 0}});

const finite = (v: unknown, min: number, max: number) => typeof v === 'number' && Number.isFinite(v) && v >= min && v <= max;
function validInput(v: unknown, bowler: BowlerKind): v is BowlInput {
  const i = v as BowlInput;
  return !!i && typeof i === 'object' && BOWLERS[bowler].deliveries.includes(i.delivery) && !!DELIVERIES[i.delivery] && !!i.target && finite(i.target.x, -2, 2) && finite(i.target.z, -14, 0)
    && ['attack', 'balanced', 'defend'].includes(i.field) && finite(i.meter, -1, 3) && typeof i.assist === 'boolean' && (i.review === undefined || typeof i.review === 'boolean');
}
function validCheckpoint(v: unknown): v is Checkpoint {
  const c = v as Checkpoint;
  if (!c || typeof c !== 'object' || (c.bowler !== 'pace' && c.bowler !== 'spin') || !finite(c.initialSeed, 0, 4294967295) || !Array.isArray(c.inputs) || c.inputs.length > 80) return false;
  if (c.quickSeed !== null && !finite(c.quickSeed, 0, 4294967295)) return false;
  const challenge = challengeFor(c.challengeId, c.bowler, c.quickSeed, challengeById);
  if (!challenge || (challenge.bowler !== 'any' && challenge.bowler !== c.bowler)) return false;
  return c.inputs.every(i => validInput(i, c.bowler));
}
/** Validates every field. A broken or newer save is reported as incompatible and left untouched. */
export function readSave(raw: string | null): {save: Save; incompatible: boolean} {
  if (!raw) return {save: emptySave(), incompatible: false};
  try {
    const s = JSON.parse(raw) as Save;
    if (s?.schemaVersion !== 1) throw Error('version');
    const ids = new Set(SPELLS.map(c => c.id)), lessonIds = new Set(LESSONS.map(c => c.id));
    if (!s.spells || typeof s.spells !== 'object') throw Error('spells');
    for (const [id, r] of Object.entries(s.spells)) if (!ids.has(id) || !finite(r.stars, 0, 3) || !(r.best === null || finite(r.best, 0, 999)) || !finite(r.plays, 0, 1e6) || !finite(r.wins, 0, 1e6)) throw Error('spell');
    if (!Array.isArray(s.lessons) || s.lessons.some(id => !lessonIds.has(id))) throw Error('lessons');
    if (!finite(s.unlocked, 0, SPELLS.length-1) || !Number.isInteger(s.unlocked)) throw Error('unlocked');
    if (s.bowler !== 'pace' && s.bowler !== 'spin') throw Error('bowler');
    if (typeof s.sound !== 'boolean' || typeof s.reducedMotion !== 'boolean' || typeof s.assist !== 'boolean') throw Error('prefs');
    if (s.checkpoint !== null && !validCheckpoint(s.checkpoint)) throw Error('checkpoint');
    if (s.resultId !== null && typeof s.resultId !== 'string') throw Error('result');
    const st = s.stats;
    if (!st || !finite(st.balls, 0, 1e7) || !finite(st.wickets, 0, 1e7) || !finite(st.runs, 0, 1e8) || !finite(st.fastest, 0, 200) || !finite(st.perfect, 0, 1e7)) throw Error('stats');
    return {save: s, incompatible: false};
  } catch {return {save: emptySave(), incompatible: true};}
}
/** Rebuild an unfinished spell from its checkpoint. */
export function resumed(s: Save): Match | null {
  const c = s.checkpoint; if (!c) return null;
  const challenge = challengeFor(c.challengeId, c.bowler, c.quickSeed, challengeById);
  if (!challenge) return null;
  const m = restore(challenge, c);
  return m.phase === 'finished' ? null : m;
}
/** Fold a match into the save: checkpoint while playing, records and unlocks when finished. */
export function record(s: Save, m: Match): Save {
  const next: Save = {...s, spells: {...s.spells}, lessons: [...s.lessons], stats: {...s.stats}};
  if (!m.result) {next.checkpoint = {challengeId: m.challenge.id, bowler: m.bowler.kind, initialSeed: m.initialSeed, quickSeed: m.quickSeed, inputs: m.inputs.map(i => ({...i, target: {...i.target}}))}; return next;}
  next.checkpoint = null;
  const c = m.challenge;
  if (c.lesson) {if (m.result.won && !next.lessons.includes(c.id)) next.lessons.push(c.id);}
  else if (c.id !== 'quick') {
    const old = next.spells[c.id] ?? {stars: 0, best: null, plays: 0, wins: 0};
    next.spells[c.id] = {stars: Math.max(old.stars, m.result.stars), best: m.result.won ? Math.min(old.best ?? 999, m.runs) : old.best, plays: old.plays+1, wins: old.wins+(m.result.won ? 1 : 0)};
    const index = SPELLS.findIndex(x => x.id === c.id);
    if (m.result.won && index >= 0) next.unlocked = Math.min(SPELLS.length-1, Math.max(next.unlocked, index+1));
  }
  next.stats.balls += m.results.filter(r => r.legal).length; next.stats.wickets += m.wickets; next.stats.runs += m.runs;
  next.stats.fastest = Math.max(next.stats.fastest, ...m.results.map(r => Math.round(r.speed*10)/10), 0);
  next.stats.perfect += m.results.filter(r => r.grade === 'perfect').length;
  return next;
}
export const totalStars = (s: Save) => Object.values(s.spells).reduce((n, r) => n+r.stars, 0);
