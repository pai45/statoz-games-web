import { dataVersion, nations } from './nations';
import { cpuLevel, currentFixture } from './tournament';
import type { Cup, CupSave, Fixture } from './types';
import type { MatchCheckpoint } from '../penalty-shootout/game-types';

const ids = new Set(nations.map(n => n.id));
const stages = new Set(['group', 'round32', 'round16', 'quarter', 'semi', 'bronze', 'final']);
const statuses = new Set(['active', 'eliminated', 'champion', 'runner-up', 'third', 'fourth']);
const integer = (v: unknown) => Number.isSafeInteger(v) && Number(v) >= 0;
const uint32 = (v: unknown) => integer(v) && Number(v) <= 0xffffffff;
export const emptySave = (): CupSave => ({ version: 2, revision: 0, active: null, history: [] });
// Retain the original key to discover existing cups during the upgrade.
export const storageKey = (scope: string) => `penalty-cup.v1.${scope}`;
export const resultId = (cup: Cup, fixture: Fixture) => `${cup.id}:${fixture.id}:${fixture.attempts}`;

export function validCheckpoint(value: unknown): value is MatchCheckpoint {
  if (!value || typeof value !== 'object') return false;
  const c = value as MatchCheckpoint;
  if (c.version !== 1 || !uint32(c.seed) || !integer(c.tick) || !uint32(c.randomState) || !integer(c.level) || c.level < 1 || c.level > 12 || !Array.isArray(c.kicks) || !c.kicks.length || c.kicks.length > 500) return false;
  return c.kicks.every((k, i) => k && k.id === i + 1 && k.role === (i % 2 ? 'keeping' : 'shooting') && ['goal', 'saved', 'wide', 'over', 'woodwork'].includes(k.outcome) && ['driven', 'placed', 'chip'].includes(k.style) && Number.isFinite(k.power) && Number.isFinite(k.composure) && Number.isFinite(k.target?.x) && Number.isFinite(k.target?.y) && Array.isArray(k.contacts) && Number.isFinite(k.flightSeconds));
}
export function validCup(value: unknown): value is Cup {
  if (!value || typeof value !== 'object') return false;
  const c = value as Cup;
  if (c.version !== 2 || c.dataVersion !== dataVersion || !ids.has(c.team) || typeof c.id !== 'string' || c.id.length > 100 || !stages.has(c.stage) || !statuses.has(c.status) || !integer(c.seed) || !integer(c.day) || c.day > 2 || typeof c.updatedAt !== 'string' || !Array.isArray(c.fixtures) || c.fixtures.length < 72 || c.fixtures.length > 104) return false;
  const fixtureIds = new Set<string>();
  for (const f of c.fixtures) {
    if (!f || typeof f.id !== 'string' || fixtureIds.has(f.id) || !stages.has(f.stage) || !ids.has(f.home) || !ids.has(f.away) || f.home === f.away || !integer(f.seed) || !integer(f.attempts) || !integer(f.day) || f.day > 2) return false;
    fixtureIds.add(f.id);
    if (f.score && (!Array.isArray(f.score) || f.score.length !== 2 || !f.score.every(integer) || f.stage === 'group' && f.score.some(n => n > 5) || f.stage !== 'group' && f.score[0] === f.score[1])) return false;
    if (f.score && f.winner !== (f.score[0] === f.score[1] ? undefined : f.score[0] > f.score[1] ? f.home : f.away)) return false;
  }
  const all = c.fixtures.filter(f => f.stage === 'group');
  if (all.length !== 72) return false;
  for (const n of nations) {
    const fixtures = all.filter(f => f.home === n.id || f.away === n.id);
    if (fixtures.length !== 3 || new Set(fixtures.map(f => f.home === n.id ? f.away : f.home)).size !== 3 || fixtures.some(f => nations.find(t => t.id === (f.home === n.id ? f.away : f.home))?.group !== n.group)) return false;
  }
  const fixture = currentFixture(c);
  if (c.status === 'active' && !fixture) return false;
  if (c.pending) {
    const p = c.pending;
    if (!fixture || p.id !== resultId(c, fixture) || !Array.isArray(p.score) || p.score.length !== 2 || !p.score.every(integer) || !Array.isArray(p.kicks) || p.kicks.length > 500) return false;
    const expected = p.score[0] === p.score[1] ? 'draw' : p.score[0] > p.score[1] ? 'win' : 'loss';
    if (p.outcome !== expected || fixture.stage !== 'group' && expected === 'draw' || fixture.stage === 'group' && p.score.some(n => n > 5)) return false;
  }
  if (c.checkpoint && (!fixture || c.pending || c.checkpoint.id !== resultId(c, fixture) || !validCheckpoint(c.checkpoint.match) || c.checkpoint.match.seed !== fixture.seed || c.checkpoint.match.level !== cpuLevel(fixture.stage))) return false;
  return true;
}
function migrateCup(value: unknown): unknown {
  if (!value || typeof value !== 'object') return value;
  const cup = structuredClone(value) as Record<string, unknown>;
  if (cup.version === 1) { cup.version = 2; delete cup.difficulty; cup.checkpoint = null; }
  return cup;
}
function parseSave(raw: string): CupSave | null {
  try {
    const v = JSON.parse(raw);
    if (v?.version === 1 && Array.isArray(v.history)) { v.version = 2; v.revision = 0; v.active = migrateCup(v.active); v.history = v.history.map(migrateCup); }
    if (v?.version !== 2 || !integer(v.revision) || v.active !== null && !validCup(v.active) || !Array.isArray(v.history) || v.history.length > 12 || !v.history.every(validCup)) return null;
    return v;
  } catch { return null; }
}
export function readSave(storage: Pick<Storage, 'getItem'>, scope: string): { save: CupSave; error: string; unavailable?: boolean; recovered?: boolean } {
  let raw: string | null, backup: string | null;
  try { raw = storage.getItem(storageKey(scope)); backup = storage.getItem(storageKey(scope) + '.backup'); }
  catch { return { save: emptySave(), error: '', unavailable: true }; }
  const saved = raw ? parseSave(raw) : null;
  if (saved) return { save: saved, error: '' };
  const restored = backup ? parseSave(backup) : null;
  if (restored) return { save: restored, error: '', recovered: true };
  return { save: emptySave(), error: raw || backup ? 'Saved cup unavailable. Your original save is preserved.' : '' };
}
export function writeSave(storage: Pick<Storage, 'getItem' | 'setItem'>, scope: string, save: CupSave): boolean {
  try {
    const key = storageKey(scope), previous = storage.getItem(key), old = previous ? parseSave(previous) : null;
    if (old && old.revision >= save.revision) return old.revision === save.revision && JSON.stringify(old) === JSON.stringify(save);
    if (previous && old) storage.setItem(key + '.backup', previous);
    const serialized = JSON.stringify(save);
    storage.setItem(key, serialized); storage.setItem(key + '.backup', serialized);
    return true;
  } catch { return false; }
}
export function updateCup(save: CupSave, cup: Cup): CupSave {
  const history = cup.status === 'active' ? save.history : [cup, ...save.history.filter(c => c.id !== cup.id)].slice(0, 12);
  return { ...save, active: cup, history };
}
