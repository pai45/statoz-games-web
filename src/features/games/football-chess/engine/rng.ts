import type { RandomSource } from "../../shared/engine/random-source";

/**
 * Football Chess's own seeded generator (Mulberry32), a local copy of the one
 * Pitch Duel uses so the two games share no files.
 *
 * The stream position lives in the match state, not in a closure, so every
 * step is pure and replayable: React StrictMode runs reducers twice, and a
 * closure-held stream would advance twice.
 */
export function nextRandom(state: number): [value: number, next: number] {
  const next = (state + 0x6d2b79f5) >>> 0;
  let r = Math.imul(next ^ (next >>> 15), 1 | next);
  r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
  return [((r ^ (r >>> 14)) >>> 0) / 4294967296, next];
}

/** A stateful cursor over a stored stream; read `state` back when done. */
export class Stream {
  constructor(public state: number) {}
  next: RandomSource = () => {
    const [value, next] = nextRandom(this.state);
    this.state = next;
    return value;
  };
}

/** A standalone seeded source, for tests, drafting and the AI's tie-breaks. */
export function seededSource(seed: number): RandomSource {
  return new Stream(seed >>> 0).next;
}

/** FNV-1a, for deriving independent seeds from one match seed. */
export function hashString(value: string): number {
  let n = 2166136261;
  for (const c of value) n = Math.imul(n ^ c.charCodeAt(0), 16777619);
  return n >>> 0;
}
