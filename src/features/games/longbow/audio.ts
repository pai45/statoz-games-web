// Longbow sound. Plays slices of local CC0 recordings (see public/games/longbow/CREDITS.md) and a few
// synthesized cues. Everything is optional: if audio cannot start, the game plays silently.
type Clip = 'release' | 'hit' | 'flyby' | 'ambience';
const FILES: Record<Clip, string> = {release: 'bow-release.mp3', hit: 'arrow-hit.mp3', flyby: 'arrow-flyby.mp3', ambience: 'meadow-ambience.mp3'};
/** Onsets measured from the recordings: [start, length] in seconds. */
const HIT_SLICES: [number, number][] = [[2.86, 0.7], [0.28, 0.7], [6.16, 0.7]];

export class LongbowAudio {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private buffers: Partial<Record<Clip, AudioBuffer>> = {};
  private loading: Promise<void> | null = null;
  private ambience: AudioBufferSourceNode | null = null;
  private creak: {source: AudioBufferSourceNode; gain: GainNode} | null = null;
  private hits = 0;
  enabled = true;

  constructor(private base: string) {}

  /** Call from a user gesture. Creates the context on first use and loads the clips once. */
  unlock() {
    if (!this.enabled) return;
    try {
      if (!this.ctx) {
        this.ctx = new AudioContext();
        this.master = this.ctx.createGain(); this.master.gain.value = 0.9; this.master.connect(this.ctx.destination);
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
    this.startAmbience();
  }
  private get live() {return this.enabled && this.ctx?.state === 'running' ? this.ctx : null;}

  private play(clip: Clip, offset: number, length: number, gain: number, delay = 0, rate = 1) {
    const ctx = this.live, buffer = this.buffers[clip];
    if (!ctx || !buffer || !this.master) return;
    const source = ctx.createBufferSource(), amp = ctx.createGain();
    source.buffer = buffer; source.playbackRate.value = rate;
    const t = ctx.currentTime + delay;
    amp.gain.setValueAtTime(gain, t); amp.gain.setValueAtTime(gain, t + length * 0.7); amp.gain.linearRampToValueAtTime(0, t + length);
    source.connect(amp); amp.connect(this.master);
    source.start(t, offset, length + 0.05);
    source.onended = () => {source.disconnect(); amp.disconnect();};
  }
  private noise(seconds: number) {
    const ctx = this.ctx!, buffer = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * seconds), ctx.sampleRate), data = buffer.getChannelData(0);
    let seed = 7; for (let i = 0; i < data.length; i++) {seed = (seed * 16807) % 2147483647; data[i] = seed / 1073741823.5 - 1;}
    return buffer;
  }

  private startAmbience() {
    const ctx = this.ctx, buffer = this.buffers.ambience;
    if (!ctx || !buffer || !this.master || this.ambience) return;
    const source = ctx.createBufferSource(), gain = ctx.createGain();
    source.buffer = buffer; source.loop = true; gain.gain.value = 0.14;
    source.connect(gain); gain.connect(this.master); source.start();
    this.ambience = source;
  }

  /** A soft rising creak while the string is drawn. */
  drawStart() {
    const ctx = this.live; if (!ctx || !this.master) return;
    this.drawStop();
    const source = ctx.createBufferSource(), filter = ctx.createBiquadFilter(), gain = ctx.createGain();
    source.buffer = this.noise(1.2); filter.type = 'bandpass'; filter.Q.value = 9;
    filter.frequency.setValueAtTime(260, ctx.currentTime); filter.frequency.linearRampToValueAtTime(620, ctx.currentTime + 0.6);
    gain.gain.setValueAtTime(0, ctx.currentTime); gain.gain.linearRampToValueAtTime(0.16, ctx.currentTime + 0.12); gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.65);
    source.connect(filter); filter.connect(gain); gain.connect(this.master); source.start();
    source.onended = () => {source.disconnect(); filter.disconnect(); gain.disconnect();};
    this.creak = {source, gain};
  }
  drawStop() {try {this.creak?.source.stop();} catch {/* already stopped */} this.creak = null;}

  release(power: number) {
    this.drawStop();
    this.play('release', 0.02, 0.55, 0.55 + 0.4 * power);
    this.play('flyby', 0.12, 0.42, 0.22, 0.06, 1.05);
  }
  hit(score: number) {
    const [offset, length] = HIT_SLICES[this.hits++ % HIT_SLICES.length];
    this.play('hit', offset, length, 0.95);
    if (score >= 10) this.chime([784, 1175], 0.12);
  }
  miss() {
    const ctx = this.live; if (!ctx || !this.master) return;
    const source = ctx.createBufferSource(), filter = ctx.createBiquadFilter(), gain = ctx.createGain(), t = ctx.currentTime;
    source.buffer = this.noise(0.3); filter.type = 'lowpass'; filter.frequency.value = 380;
    gain.gain.setValueAtTime(0.4, t); gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
    source.connect(filter); filter.connect(gain); gain.connect(this.master); source.start(t);
    source.onended = () => {source.disconnect(); filter.disconnect(); gain.disconnect();};
  }
  /** A short bell figure: bullseyes, wins and level clears. */
  chime(notes: number[], spacing = 0.14, volume = 0.09) {
    const ctx = this.live; if (!ctx || !this.master) return;
    notes.forEach((frequency, i) => {
      const osc = ctx.createOscillator(), gain = ctx.createGain(), t = ctx.currentTime + i * spacing;
      osc.type = 'triangle'; osc.frequency.setValueAtTime(frequency, t);
      gain.gain.setValueAtTime(0, t); gain.gain.linearRampToValueAtTime(volume, t + 0.01); gain.gain.exponentialRampToValueAtTime(0.001, t + 0.7);
      osc.connect(gain); gain.connect(this.master!); osc.start(t); osc.stop(t + 0.75);
      osc.onended = () => {osc.disconnect(); gain.disconnect();};
    });
  }
  setEnabled(on: boolean) {
    this.enabled = on;
    if (on) this.unlock(); else void this.ctx?.suspend();
  }
  suspend() {this.drawStop(); void this.ctx?.suspend();}
  resume() {if (this.enabled) void this.ctx?.resume();}
  dispose() {this.drawStop(); try {this.ambience?.stop();} catch {/* already stopped */} void this.ctx?.close(); this.ctx = null;}
}
