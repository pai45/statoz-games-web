// Graphics quality tiers. Phones start low; desktops start high and step down if frames run slow.
export type Tier = 'high' | 'low';

type QualityWindow = Window & {__LONGBOW_QUALITY__?: string};

/** A tier forced by QA (`window.__LONGBOW_QUALITY__ = 'high' | 'low'`), if any. */
export function forcedTier(): Tier | null {
  const forced = (window as QualityWindow).__LONGBOW_QUALITY__;
  return forced === 'high' || forced === 'low' ? forced : null;
}

export function pickTier(): Tier {
  return forcedTier() ?? (matchMedia('(pointer: coarse)').matches || Math.min(innerWidth, innerHeight) < 500 ? 'low' : 'high');
}

export const TIER_SETTINGS = {
  high: {pixelRatio: 1.6, shadows: true, shadowMap: 2048, post: true, blobOpacity: 0.32},
  low: {pixelRatio: 1.25, shadows: false, shadowMap: 1024, post: false, blobOpacity: 0.5},
} as const;

/** Watches frame times and reports when the average stays over budget for a few seconds. */
export class FrameBudget {
  private times: number[] = [];
  private total = 0;
  private warm = 0;

  constructor(private limitMs = 22, private windowS = 3, private warmupS = 2.5) {}

  /** Restarts the watch, for example after loading or a scene change compiles new shaders. */
  reset() {this.times = []; this.total = 0; this.warm = 0;}

  over(dt: number) {
    if (dt <= 0) return false;
    this.warm += dt;
    if (this.warm < this.warmupS) return false;
    this.times.push(dt); this.total += dt;
    while (this.total > this.windowS && this.times.length > 1) this.total -= this.times.shift()!;
    return this.total >= this.windowS * 0.9 && this.total / this.times.length * 1000 > this.limitMs;
  }
}
