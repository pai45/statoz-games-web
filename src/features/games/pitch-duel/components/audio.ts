"use client";

import { createContext, useContext } from "react";

/**
 * Fot Duel's sound. Six short CC0 recordings (crowd bed, terrace drums,
 * goal roar, crowd "ooh", referee whistle, ball kick; see
 * public/games/pitch-duel/PROVENANCE.json) plus synthesized cues for the cards:
 * whooshes, flips, reveal booms, sparkles and stings.
 *
 * Everything is optional. Nothing loads until the first tap, and if audio
 * cannot start the game simply plays silently.
 */

type Clip = "crowd" | "chant" | "goal" | "ooh" | "whistle" | "kick";
const files: Record<Clip, string> = {
  crowd: "crowd.mp3",
  chant: "chant.mp3",
  goal: "goal.mp3",
  ooh: "ooh.mp3",
  whistle: "whistle.mp3",
  kick: "kick.mp3",
};
/** The two beds loop; their ends are folded into their starts so the loop has no seam. */
const loops: Clip[] = ["crowd", "chant"];
const loopFold = 1.2;

type Bed = { source: AudioBufferSourceNode; gain: GainNode };

export class PitchDuelAudio {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private buffers: Partial<Record<Clip, AudioBuffer>> = {};
  private noise: AudioBuffer | null = null;
  private loading: Promise<void> | null = null;
  private beds: Partial<Record<Clip, Bed>> = {};
  private levels: Partial<Record<Clip, number>> = {};
  private recent: Record<string, number> = {};
  private enabled = true;

  constructor(private base: string) {}

  /** Call from a user gesture: creates the context on first use and loads the clips once. */
  unlock() {
    if (!this.enabled || typeof window === "undefined") return;
    try {
      if (!this.ctx) {
        const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!Ctx) return;
        this.ctx = new Ctx();
        this.master = this.ctx.createGain();
        this.master.gain.value = 0.9;
        this.master.connect(this.ctx.destination);
      }
      void this.ctx.resume();
      this.loading ??= this.load();
    } catch {
      // Sound is garnish.
    }
  }

  private async load() {
    const ctx = this.ctx;
    if (!ctx) return;
    await Promise.all(
      (Object.keys(files) as Clip[]).map(async (clip) => {
        try {
          const response = await fetch(this.base + files[clip]);
          const decoded = await ctx.decodeAudioData(await response.arrayBuffer());
          this.buffers[clip] = loops.includes(clip) ? fold(ctx, decoded, loopFold) : decoded;
        } catch {
          // A missing clip stays silent.
        }
      }),
    );
    // Beds asked for while loading start now.
    for (const clip of loops) if (this.levels[clip]) this.bed(clip, this.levels[clip] ?? 0);
  }

  private get live(): AudioContext | null {
    return this.enabled && this.ctx?.state === "running" ? this.ctx : null;
  }

  /** Mutes or unmutes. Before the first tap there is no context yet; the tap creates it. */
  setEnabled(on: boolean) {
    this.enabled = on;
    if (!this.ctx) return;
    if (on) {
      this.unlock();
      for (const clip of loops) if (this.levels[clip]) this.bed(clip, this.levels[clip] ?? 0);
    } else void this.ctx.suspend();
  }

  suspend() {
    void this.ctx?.suspend();
  }

  resume() {
    if (this.enabled) void this.ctx?.resume();
  }

  dispose() {
    for (const bed of Object.values(this.beds)) {
      try {
        bed?.source.stop();
      } catch {
        // Already stopped.
      }
    }
    this.beds = {};
    void this.ctx?.close();
    this.ctx = null;
  }

  /* ---- Recordings ---------------------------------------------------------- */

  private play(clip: Clip, gain: number, { rate = 1, offset = 0, length, pan = 0, delay = 0 }: { rate?: number; offset?: number; length?: number; pan?: number; delay?: number } = {}) {
    const ctx = this.live;
    const buffer = this.buffers[clip];
    if (!ctx || !buffer || !this.master) return;
    const now = ctx.currentTime;
    if (now - (this.recent[clip] ?? -1) < 0.05) return;
    this.recent[clip] = now;
    const source = ctx.createBufferSource();
    const amp = ctx.createGain();
    const panner = ctx.createStereoPanner();
    source.buffer = buffer;
    source.playbackRate.value = rate;
    panner.pan.value = Math.max(-1, Math.min(1, pan));
    const t = now + delay;
    const span = Math.min(length ?? buffer.duration - offset, buffer.duration - offset);
    amp.gain.setValueAtTime(0, t);
    amp.gain.linearRampToValueAtTime(gain, t + 0.02);
    amp.gain.setValueAtTime(gain, t + span * 0.7);
    amp.gain.linearRampToValueAtTime(0, t + span);
    source.connect(amp).connect(panner).connect(this.master);
    source.start(t, offset, span + 0.05);
    source.onended = () => {
      source.disconnect();
      amp.disconnect();
      panner.disconnect();
    };
  }

  /** Sets a looping bed's level (0 stops it gently). Asked before the clip loads, it starts once loaded. */
  private bed(clip: Clip, level: number) {
    this.levels[clip] = level;
    const ctx = this.live;
    const buffer = this.buffers[clip];
    if (!ctx || !buffer || !this.master) return;
    let bed = this.beds[clip];
    if (!bed) {
      if (level <= 0) return;
      const source = ctx.createBufferSource();
      const gain = ctx.createGain();
      source.buffer = buffer;
      source.loop = true;
      gain.gain.value = 0;
      source.connect(gain).connect(this.master);
      source.start(ctx.currentTime, Math.random() * buffer.duration * 0.8);
      bed = { source, gain };
      this.beds[clip] = bed;
    }
    bed.gain.gain.cancelScheduledValues(ctx.currentTime);
    bed.gain.gain.setTargetAtTime(level, ctx.currentTime, level > bed.gain.gain.value ? 0.35 : 0.8);
  }

  /** The stadium murmur under everything: 0 silent, 1 a roaring ground. */
  crowd(level: number) {
    this.bed("crowd", 0.32 * Math.max(0, Math.min(1, level)));
  }

  /** The terrace drums, for big build-ups. */
  chant(level: number) {
    this.bed("chant", 0.28 * Math.max(0, Math.min(1, level)));
  }

  /** A short swell of the crowd bed after a big moment. */
  swell(amount = 0.35) {
    const ctx = this.live;
    const bed = this.beds.crowd;
    if (!ctx || !bed) return;
    const g = bed.gain.gain;
    const base = this.levels.crowd ?? 0.1;
    g.cancelScheduledValues(ctx.currentTime);
    g.setValueAtTime(g.value, ctx.currentTime);
    g.linearRampToValueAtTime(Math.min(0.75, base + amount), ctx.currentTime + 0.25);
    g.setTargetAtTime(base, ctx.currentTime + 1.2, 1.1);
  }

  whistle(kind: "short" | "long" | "end" = "short") {
    if (kind === "short") this.play("whistle", 0.4, { length: 0.3 });
    else if (kind === "long") this.play("whistle", 0.5);
    else {
      // Three blasts: the last one long.
      this.play("whistle", 0.45, { length: 0.22 });
      setTimeout(() => this.play("whistle", 0.45, { length: 0.22 }), 330);
      setTimeout(() => this.play("whistle", 0.55), 660);
    }
  }

  kick(power = 1) {
    this.play("kick", 0.35 + power * 0.4, { rate: 0.92 + Math.random() * 0.16 });
  }

  /** The goal roar: the home crowd erupts for you, a quieter rumble for them. */
  goal(yours: boolean) {
    if (yours) {
      this.play("goal", 0.95, { offset: 1.1 });
      this.swell(0.45);
      [523, 659, 784, 1047].forEach((f, i) => this.tone(f, 0.5, 0.055, "triangle", 0.15 + i * 0.09));
    } else {
      this.play("goal", 0.35, { offset: 1.2, length: 3.2, rate: 0.9 });
      this.play("ooh", 0.45, { rate: 0.85 });
      [392, 311, 262].forEach((f, i) => this.tone(f, 0.45, 0.05, "sawtooth", 0.2 + i * 0.18, 0.97));
    }
  }

  /** A near miss: a save, the post, a shot just wide. */
  ooh() {
    this.play("ooh", 0.6);
  }

  /* ---- Synthesis ----------------------------------------------------------- */

  private tone(freq: number, length: number, volume: number, type: OscillatorType = "triangle", delay = 0, slide = 0) {
    const ctx = this.live;
    if (!ctx || !this.master) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const t = ctx.currentTime + delay;
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(20, freq * slide), t + length);
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(volume, t + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0008, t + length);
    osc.connect(gain).connect(this.master);
    osc.start(t);
    osc.stop(t + length + 0.05);
    osc.onended = () => {
      osc.disconnect();
      gain.disconnect();
    };
  }

  private noiseBuffer(ctx: AudioContext): AudioBuffer {
    if (!this.noise) {
      const length = ctx.sampleRate;
      this.noise = ctx.createBuffer(1, length, ctx.sampleRate);
      const data = this.noise.getChannelData(0);
      let seed = 7;
      for (let i = 0; i < length; i += 1) {
        seed = (seed * 16807) % 2147483647;
        data[i] = seed / 1073741823.5 - 1;
      }
    }
    return this.noise;
  }

  /** Filtered noise with a moving band: whooshes, risers and impacts. */
  private sweep(length: number, volume: number, from: number, to: number, { delay = 0, q = 1.2, attack = 0.02, type = "bandpass" as BiquadFilterType } = {}) {
    const ctx = this.live;
    if (!ctx || !this.master) return;
    const source = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    const t = ctx.currentTime + delay;
    source.buffer = this.noiseBuffer(ctx);
    source.loop = true;
    filter.type = type;
    filter.Q.value = q;
    filter.frequency.setValueAtTime(from, t);
    filter.frequency.exponentialRampToValueAtTime(Math.max(30, to), t + length);
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(volume, t + Math.min(attack, length * 0.8));
    gain.gain.exponentialRampToValueAtTime(0.0008, t + length);
    source.connect(filter).connect(gain).connect(this.master);
    source.start(t, Math.random() * 0.5);
    source.stop(t + length + 0.05);
    source.onended = () => {
      source.disconnect();
      filter.disconnect();
      gain.disconnect();
    };
  }

  /** A card sliding past. */
  whoosh(up = true) {
    this.sweep(0.32, 0.22, up ? 500 : 3200, up ? 3400 : 500, { attack: 0.12, q: 0.9 });
  }

  /** A card turning over. */
  flip() {
    this.sweep(0.16, 0.18, 1800, 5200, { attack: 0.03, q: 1.6 });
    this.tone(1250, 0.05, 0.035, "square", 0.08);
  }

  /** A card landing face up: the bigger the tier, the deeper the hit. */
  boom(tier: number) {
    this.tone(120 - tier * 12, 0.7 + tier * 0.15, 0.4 + tier * 0.08, "sine", 0, 0.32);
    this.sweep(0.45, 0.25 + tier * 0.06, 1400, 90, { attack: 0.005, q: 0.7, type: "lowpass" });
    if (tier >= 2) this.sparkle(tier);
  }

  /** A glitter of high notes: gold and platinum cards, surges. */
  sparkle(tier = 2) {
    const notes = tier >= 3 ? [1319, 1568, 1976, 2349, 2637, 3136] : [1047, 1319, 1568, 2093];
    notes.forEach((f, i) => this.tone(f, 0.35, 0.03, "triangle", 0.05 + i * 0.055));
  }

  /** A rising build-up of `length` seconds for a walkout. */
  riser(length: number) {
    this.sweep(length, 0.16, 300, 6000, { attack: length * 0.9, q: 2.2 });
    this.tone(110, length, 0.06, "sawtooth", 0, 4);
  }

  /** Two cards meeting in a duel. */
  clash(big = false) {
    this.sweep(0.18, big ? 0.32 : 0.22, 4200, 700, { attack: 0.004, q: 0.8, type: "highpass" });
    this.tone(big ? 70 : 95, 0.3, big ? 0.38 : 0.26, "sine", 0, 0.5);
  }

  /** Winning or losing a duel: a quick up or down figure. */
  result(won: boolean) {
    if (won) [660, 880].forEach((f, i) => this.tone(f, 0.18, 0.05, "triangle", i * 0.07));
    else [330, 247].forEach((f, i) => this.tone(f, 0.22, 0.045, "triangle", i * 0.09));
  }

  /** A surge: a sweeping rise and the terrace drums kicking in. */
  surge() {
    this.sweep(0.6, 0.2, 400, 5000, { attack: 0.45, q: 1.4 });
    [392, 523, 659, 784, 1047].forEach((f, i) => this.tone(f, 0.28, 0.045, "sawtooth", 0.1 + i * 0.06));
    this.swell(0.3);
  }

  /** Full-time stings. */
  sting(result: "win" | "draw" | "loss") {
    if (result === "win") [523, 659, 784, 1047, 1319].forEach((f, i) => this.tone(f, 0.6, 0.06, "triangle", i * 0.11));
    else if (result === "draw") [523, 587, 523].forEach((f, i) => this.tone(f, 0.4, 0.05, "triangle", i * 0.16));
    else [440, 370, 311, 262].forEach((f, i) => this.tone(f, 0.5, 0.05, "triangle", i * 0.15));
  }

  /** A soft tap for buttons. */
  tap() {
    this.tone(880, 0.05, 0.025, "square");
  }

  /** A coin or point ticking up. */
  tick(step = 0) {
    this.tone(1200 + (step % 6) * 90, 0.06, 0.03, "square");
  }
}

/** Folds the last `seconds` of a buffer into its start, so it loops with no seam. */
function fold(ctx: AudioContext, input: AudioBuffer, seconds: number): AudioBuffer {
  const x = Math.floor(seconds * input.sampleRate);
  if (input.length < x * 3) return input;
  const length = input.length - x;
  const out = ctx.createBuffer(input.numberOfChannels, length, input.sampleRate);
  for (let c = 0; c < input.numberOfChannels; c += 1) {
    const src = input.getChannelData(c);
    const dst = out.getChannelData(c);
    for (let i = 0; i < length; i += 1) {
      if (i < x) {
        const w = i / x;
        dst[i] = src[i] * w + src[length + i] * (1 - w);
      } else dst[i] = src[i];
    }
  }
  return out;
}

/** A silent stand-in so components can call sounds before the provider exists (tests, previews). */
const silent = new PitchDuelAudio("");

export const SoundContext = createContext<PitchDuelAudio>(silent);

export function useSound(): PitchDuelAudio {
  return useContext(SoundContext);
}
