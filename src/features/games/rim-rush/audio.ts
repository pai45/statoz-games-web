// Rim Rush sound. Plays slices of local CC0 recordings (see public/games/rim-rush/PROVENANCE.json)
// and a few synthesized cues. Everything is optional: if audio cannot start, the game plays silently.
import type {GameEvent} from './engine';

type Clip = 'bounce' | 'swish' | 'board' | 'rim' | 'buzzer' | 'cheer' | 'whistle';
const FILES: Record<Clip, string> = {bounce: 'ball-bounce.mp3', swish: 'net-swish.mp3', board: 'backboard.mp3', rim: 'rim-shot.mp3', buzzer: 'buzzer.mp3', cheer: 'crowd-cheer.mp3', whistle: 'whistle.mp3'};
/** Onsets measured from the recordings: [start, length] in seconds. */
const SLICES: Record<Clip, [number, number][]> = {
  bounce: [[0.08, 0.32], [1.07, 0.3], [2.78, 0.3]],
  swish: [[3.52, 0.8], [4.98, 0.8]],
  board: [[0.03, 0.5]],
  rim: [[0.15, 0.45], [1.7, 0.45], [3.19, 0.45], [5.91, 0.45]],
  buzzer: [[0.02, 1.3]],
  cheer: [[0.45, 4.2]],
  whistle: [[0.11, 0.75]],
};

export class RimRushAudio {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private buffers: Partial<Record<Clip, AudioBuffer>> = {};
  private loading: Promise<void> | null = null;
  private murmur: {source: AudioBufferSourceNode; gain: GainNode} | null = null;
  private turn: Partial<Record<Clip, number>> = {};
  private recent: Partial<Record<Clip, number>> = {};
  enabled = true;

  constructor(private base: string) {}

  /** Call from a user gesture. Creates the context on first use and loads the clips once. */
  unlock() {
    if (!this.enabled) return;
    try {
      if (!this.ctx) {
        this.ctx = new AudioContext();
        this.master = this.ctx.createGain(); this.master.gain.value = 0.85; this.master.connect(this.ctx.destination);
      }
      void this.ctx.resume();
      this.loading ??= this.load();
    } catch {/* Sound is optional. */}
  }
  private async load() {
    const ctx = this.ctx!;
    await Promise.all((Object.keys(FILES) as Clip[]).map(async clip => {
      try {
        const response = await fetch(this.base + 'audio/' + FILES[clip]);
        this.buffers[clip] = await ctx.decodeAudioData(await response.arrayBuffer());
      } catch {/* A missing clip simply stays silent. */}
    }));
  }
  private get live() {return this.enabled && this.ctx?.state === 'running' ? this.ctx : null;}

  private play(clip: Clip, gain: number, rate = 1, pan = 0) {
    const ctx = this.live, buffer = this.buffers[clip];
    if (!ctx || !buffer || !this.master) return;
    // Avoid machine-gun repeats of the same clip within a few frames.
    if (ctx.currentTime - (this.recent[clip] ?? -1) < 0.04) return;
    this.recent[clip] = ctx.currentTime;
    const slices = SLICES[clip], i = (this.turn[clip] = ((this.turn[clip] ?? -1) + 1) % slices.length), [offset, length] = slices[i];
    const source = ctx.createBufferSource(), amp = ctx.createGain(), panner = ctx.createStereoPanner();
    source.buffer = buffer; source.playbackRate.value = rate; panner.pan.value = Math.max(-1, Math.min(1, pan));
    const t = ctx.currentTime;
    amp.gain.setValueAtTime(gain, t); amp.gain.setValueAtTime(gain, t + length * 0.75); amp.gain.linearRampToValueAtTime(0, t + length);
    source.connect(amp); amp.connect(panner); panner.connect(this.master);
    source.start(t, offset, length + 0.05);
    source.onended = () => {source.disconnect(); amp.disconnect(); panner.disconnect();};
  }
  private tone(freq: number, length: number, volume: number, type: OscillatorType = 'triangle', delay = 0, slide = 0) {
    const ctx = this.live; if (!ctx || !this.master) return;
    const osc = ctx.createOscillator(), gain = ctx.createGain(), t = ctx.currentTime + delay;
    osc.type = type; osc.frequency.setValueAtTime(freq, t); if (slide) osc.frequency.exponentialRampToValueAtTime(freq * slide, t + length);
    gain.gain.setValueAtTime(0, t); gain.gain.linearRampToValueAtTime(volume, t + 0.01); gain.gain.exponentialRampToValueAtTime(0.001, t + length);
    osc.connect(gain); gain.connect(this.master); osc.start(t); osc.stop(t + length + 0.05);
    osc.onended = () => {osc.disconnect(); gain.disconnect();};
  }

  /** A soft crowd bed: filtered noise that swells after big moments. */
  startCrowd(level: number) {
    const ctx = this.live; if (!ctx || !this.master) return;
    if (!this.murmur) {
      const length = ctx.sampleRate * 3, buffer = ctx.createBuffer(1, length, ctx.sampleRate), data = buffer.getChannelData(0);
      let seed = 11, last = 0;
      for (let i = 0; i < length; i++) {seed = (seed * 16807) % 2147483647; last = last * 0.96 + (seed / 1073741823.5 - 1) * 0.04; data[i] = last * 6;}
      const source = ctx.createBufferSource(), filter = ctx.createBiquadFilter(), gain = ctx.createGain();
      source.buffer = buffer; source.loop = true; filter.type = 'bandpass'; filter.frequency.value = 520; filter.Q.value = 0.6; gain.gain.value = 0;
      source.connect(filter); filter.connect(gain); gain.connect(this.master); source.start();
      this.murmur = {source, gain};
    }
    this.murmur.gain.gain.setTargetAtTime(level, ctx.currentTime, 0.4);
  }
  stopCrowd() {const ctx = this.ctx; if (ctx && this.murmur) this.murmur.gain.gain.setTargetAtTime(0, ctx.currentTime, 0.3);}

  /** Turns simulation events into sound. `x` positions pan the sound across the stereo field. */
  events(events: GameEvent[], ballX: (side: 0 | 1) => number) {
    for (const e of events) {
      if (e.type === 'whistle') this.play('whistle', 0.5);
      if (e.type === 'buzzer') this.play('buzzer', 0.35);
      if (e.type === 'shot') this.tone(220, 0.12, 0.05, 'sine', 0, 2.2);
      if (e.type === 'jump') this.tone(160, 0.1, 0.035, 'sine', 0, 1.6);
      if (e.type === 'contact') {
        const pan = ballX(e.ball) / 7, v = Math.min(1, e.speed / 8);
        if (e.kind === 'floor') this.play('bounce', 0.25 + v * 0.6, 0.95 + Math.random() * 0.1, pan);
        if (e.kind === 'rim') this.play('rim', 0.3 + v * 0.6, 1 + Math.random() * 0.1, pan);
        if (e.kind === 'board' || e.kind === 'pole') this.play('board', 0.35 + v * 0.6, 1, pan);
        if (e.kind === 'wall' || e.kind === 'body') this.play('bounce', 0.18 + v * 0.3, 0.75, pan);
        if (e.kind === 'ball') this.play('bounce', 0.3 + v * 0.4, 1.25, pan);
      }
      if (e.type === 'score') {
        const pan = (e.score.side === 0 ? 1 : -1) * 0.6;
        this.play('swish', e.score.swish ? 0.9 : 0.6, 1, pan);
        if (e.score.points >= 4 || e.score.side === 0) this.play('cheer', e.score.points >= 4 ? 0.6 : 0.35);
        if (e.score.side === 0) [523, 659, 784].forEach((f, i) => this.tone(f, 0.25, 0.05, 'triangle', 0.05 + i * 0.07));
        this.swell();
      }
      if (e.type === 'block') {this.play('board', 0.6, 0.8); this.play('cheer', 0.4); this.swell();}
      if (e.type === 'spawn') [880, 1175].forEach((f, i) => this.tone(f, 0.18, 0.04, 'sine', i * 0.08));
      if (e.type === 'power') {
        if (e.kind === 'freeze') this.tone(1400, 0.5, 0.06, 'sine', 0, 0.4);
        else [660, 880, 1320].forEach((f, i) => this.tone(f, 0.2, 0.06, 'square', i * 0.06));
      }
      if (e.type === 'overtime') this.play('whistle', 0.5);
    }
  }
  private swell() {
    const ctx = this.live; if (!ctx || !this.murmur) return;
    const g = this.murmur.gain.gain, now = ctx.currentTime, base = g.value;
    g.cancelScheduledValues(now); g.setValueAtTime(base, now); g.linearRampToValueAtTime(Math.min(0.12, base + 0.06), now + 0.2); g.setTargetAtTime(0.045, now + 0.6, 0.8);
  }
  /** Win and loss stings. */
  sting(won: boolean) {
    if (won) [523, 659, 784, 1047].forEach((f, i) => this.tone(f, 0.5, 0.07, 'triangle', i * 0.12));
    else [392, 330, 262].forEach((f, i) => this.tone(f, 0.45, 0.05, 'triangle', i * 0.16));
    if (won) this.play('cheer', 0.7);
  }
  click() {this.tone(700, 0.06, 0.03, 'square');}
  setEnabled(on: boolean) {this.enabled = on; if (on) this.unlock(); else void this.ctx?.suspend();}
  suspend() {void this.ctx?.suspend();}
  resume() {if (this.enabled) void this.ctx?.resume();}
  dispose() {try {this.murmur?.source.stop();} catch {/* already stopped */} void this.ctx?.close(); this.ctx = null; this.murmur = null;}
}
