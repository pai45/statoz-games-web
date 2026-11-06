"use client";

/**
 * Football Chess's sound, synthesised with WebAudio: no recordings, so nothing
 * to license. A wooden clack for a piece set down, a thock for a pass, a net
 * swish for a goal, the referee's whistle, and a brass bell for "Shot on!".
 *
 * The context is created on the first sound after a tap (browsers refuse audio
 * before a gesture) and every call is a silent no-op where WebAudio is missing.
 */

export type Sfx = "clack" | "pass" | "shot" | "net" | "whistle" | "fullTime" | "bell" | "thud";

let context: AudioContext | null = null;
let noise: AudioBuffer | null = null;
let enabled = true;

export function setSoundEnabled(on: boolean): void {
  enabled = on;
}

function audio(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (context === null) {
    const Ctor =
      window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (Ctor === undefined) return null;
    try {
      context = new Ctor();
    } catch {
      return null;
    }
  }
  if (context.state === "suspended") void context.resume().catch(() => {});
  return context;
}

function noiseBuffer(ctx: AudioContext): AudioBuffer {
  if (noise !== null && noise.sampleRate === ctx.sampleRate) return noise;
  const buffer = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  // A fixed sequence, so the texture is the same every time.
  let seed = 22222;
  for (let i = 0; i < data.length; i += 1) {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    data[i] = (seed / 0x7fffffff) * 2 - 1;
  }
  noise = buffer;
  return buffer;
}

function envelope(ctx: AudioContext, at: number, peak: number, attack: number, decay: number): GainNode {
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.exponentialRampToValueAtTime(peak, at + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + attack + decay);
  gain.connect(ctx.destination);
  return gain;
}

function burst(ctx: AudioContext, at: number, filter: BiquadFilterType, freq: number, q: number, peak: number, decay: number) {
  const source = ctx.createBufferSource();
  source.buffer = noiseBuffer(ctx);
  const band = ctx.createBiquadFilter();
  band.type = filter;
  band.frequency.setValueAtTime(freq, at);
  band.Q.value = q;
  source.connect(band).connect(envelope(ctx, at, peak, 0.004, decay));
  source.start(at, Math.random() * 0.5, decay + 0.05);
  return band;
}

function tone(ctx: AudioContext, at: number, type: OscillatorType, from: number, to: number, peak: number, decay: number) {
  const osc = ctx.createOscillator();
  osc.type = type;
  osc.frequency.setValueAtTime(from, at);
  if (to !== from) osc.frequency.exponentialRampToValueAtTime(to, at + decay);
  osc.connect(envelope(ctx, at, peak, 0.005, decay));
  osc.start(at);
  osc.stop(at + decay + 0.05);
  return osc;
}

function whistle(ctx: AudioContext, at: number, length: number) {
  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.value = 2850;
  const trill = ctx.createOscillator();
  trill.frequency.value = 32;
  const depth = ctx.createGain();
  depth.gain.value = 140;
  trill.connect(depth).connect(osc.frequency);
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.exponentialRampToValueAtTime(0.09, at + 0.02);
  gain.gain.setValueAtTime(0.09, at + length - 0.04);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + length);
  gain.connect(ctx.destination);
  osc.connect(gain);
  osc.start(at);
  trill.start(at);
  osc.stop(at + length + 0.02);
  trill.stop(at + length + 0.02);
}

export function playSfx(name: Sfx): void {
  if (!enabled) return;
  const ctx = audio();
  if (ctx === null) return;
  const now = ctx.currentTime + 0.01;
  switch (name) {
    case "clack":
      burst(ctx, now, "bandpass", 2300, 5, 0.5, 0.05);
      tone(ctx, now, "triangle", 760, 540, 0.08, 0.05);
      break;
    case "pass":
      tone(ctx, now, "sine", 170, 62, 0.45, 0.12);
      burst(ctx, now, "lowpass", 1100, 0.8, 0.14, 0.05);
      break;
    case "shot":
      tone(ctx, now, "sine", 210, 48, 0.7, 0.18);
      burst(ctx, now, "lowpass", 1800, 0.8, 0.3, 0.08);
      break;
    case "net": {
      const band = burst(ctx, now, "bandpass", 700, 1.4, 0.32, 0.75);
      band.frequency.exponentialRampToValueAtTime(3200, now + 0.6);
      tone(ctx, now + 0.05, "sine", 120, 70, 0.25, 0.3);
      break;
    }
    case "whistle":
      whistle(ctx, now, 0.22);
      break;
    case "fullTime":
      whistle(ctx, now, 0.24);
      whistle(ctx, now + 0.34, 0.24);
      whistle(ctx, now + 0.68, 0.7);
      break;
    case "bell":
      for (const [ratio, peak] of [[1, 0.1], [2.76, 0.05], [5.4, 0.025]] as const) {
        tone(ctx, now, "sine", 660 * ratio, 660 * ratio, peak, 1.1);
      }
      break;
    case "thud":
      tone(ctx, now, "sine", 110, 55, 0.4, 0.14);
      burst(ctx, now, "lowpass", 500, 0.7, 0.18, 0.08);
      break;
  }
}
