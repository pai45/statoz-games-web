/**
 * Yorker sound. Crowd beds and reactions are CC0 field recordings from freesound (see PROVENANCE.json); impacts
 * are synthesised with Web Audio so every bat, pad, stump and glove sound can follow the simulation exactly.
 * Sound randomness never touches the simulation RNG.
 */
export type SoundName = 'click' | 'release' | 'step' | 'bounce' | 'bat' | 'edge' | 'pad' | 'body' | 'stumps' | 'keeper' | 'catch' | 'land' | 'throw' | 'field' | 'perfect' | 'tick'
  | 'roar' | 'cheer' | 'sigh' | 'applause' | 'appeal' | 'win' | 'lose';
export type SoundOptions = {level?: number; x?: number; z?: number};
const CLIPS = {bed: 'audio/crowd-bed.mp3', roar: 'audio/crowd-roar.mp3', cheer: 'audio/crowd-cheer.mp3', sigh: 'audio/crowd-sigh.mp3', applause: 'audio/applause.mp3'} as const;

export class YorkerAudio {
  private ctx: AudioContext | null = null; private out: GainNode | null = null; private sfx: GainNode | null = null; private crowd: GainNode | null = null; private ui: GainNode | null = null;
  private buffers = new Map<keyof typeof CLIPS, AudioBuffer>(); private raw = new Map<keyof typeof CLIPS, ArrayBuffer>();
  private bed: {source: AudioBufferSourceNode; gain: GainNode} | null = null; private noise: AudioBuffer | null = null;
  private crowdLevel = .5; private enabled = true;
  /** Fetch the recordings early; decoding waits for the first gesture (the audio context needs one). */
  async preload(base: string) {
    await Promise.all(Object.entries(CLIPS).map(async ([k, f]) => {try {const r = await fetch(base+f); if (r.ok) this.raw.set(k as keyof typeof CLIPS, await r.arrayBuffer());} catch {/* optional */}}));
  }
  unlock() {
    if (!this.enabled) return;
    if (!this.ctx) {
      const Ctx = window.AudioContext ?? (window as unknown as {webkitAudioContext: typeof AudioContext}).webkitAudioContext; if (!Ctx) return;
      const ctx = new Ctx(); this.ctx = ctx;
      const limiter = ctx.createDynamicsCompressor(); limiter.threshold.value = -10; limiter.knee.value = 6; limiter.ratio.value = 12; limiter.attack.value = .003; limiter.release.value = .2;
      this.out = ctx.createGain(); this.out.gain.value = .9; this.out.connect(limiter); limiter.connect(ctx.destination);
      this.sfx = ctx.createGain(); this.crowd = ctx.createGain(); this.ui = ctx.createGain();
      this.sfx.gain.value = .85; this.crowd.gain.value = .75; this.ui.gain.value = .5;
      for (const g of [this.sfx, this.crowd, this.ui]) g.connect(this.out);
      const n = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate), d = n.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random()*2-1; this.noise = n;
      for (const [k, data] of this.raw) ctx.decodeAudioData(data.slice(0)).then(b => {this.buffers.set(k, b); if (k === 'bed') this.startBed();}).catch(() => {});
    }
    if (this.ctx.state === 'suspended') void this.ctx.resume();
  }
  setEnabled(on: boolean) {this.enabled = on; if (!on) this.suspend(); else this.unlock();}
  suspend() {if (this.ctx?.state === 'running') void this.ctx.suspend();}
  resume() {if (this.enabled && this.ctx?.state === 'suspended') void this.ctx.resume();}
  close() {void this.ctx?.close(); this.ctx = null;}
  /** Crowd bed level: 0 silent .. 1 full house. */
  setCrowd(level: number) {
    this.crowdLevel = level;
    if (this.bed && this.ctx) this.bed.gain.gain.setTargetAtTime(.28*level, this.ctx.currentTime, .6);
  }
  private startBed() {
    const ctx = this.ctx!, buffer = this.buffers.get('bed'); if (!buffer || this.bed) return;
    const source = ctx.createBufferSource(), gain = ctx.createGain(); source.buffer = buffer; source.loop = true; gain.gain.value = 0;
    source.connect(gain); gain.connect(this.crowd!); source.start(); gain.gain.setTargetAtTime(.28*this.crowdLevel, ctx.currentTime, 1.2);
    this.bed = {source, gain};
  }
  private clip(name: keyof typeof CLIPS, level: number, rate = 1, offset = 0) {
    const ctx = this.ctx!, buffer = this.buffers.get(name); if (!buffer) return;
    const s = ctx.createBufferSource(), g = ctx.createGain(); s.buffer = buffer; s.playbackRate.value = rate*(.97+Math.random()*.06); g.gain.value = level;
    s.connect(g); g.connect(this.crowd!); s.start(ctx.currentTime, offset);
  }
  /** Short envelope helper. */
  private env(node: AudioParam, at: number, peak: number, attack: number, decay: number) {node.setValueAtTime(0, at); node.linearRampToValueAtTime(peak, at+attack); node.exponentialRampToValueAtTime(.0001, at+attack+decay);}
  private burst(bus: GainNode, type: BiquadFilterType, freq: number, q: number, level: number, decay: number, pan = 0, delay = 0) {
    const ctx = this.ctx!, s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain(), p = ctx.createStereoPanner();
    s.buffer = this.noise; f.type = type; f.frequency.value = freq; f.Q.value = q; p.pan.value = pan;
    s.connect(f); f.connect(g); g.connect(p); p.connect(bus);
    const at = ctx.currentTime+delay; this.env(g.gain, at, level, .002, decay); s.start(at, Math.random()*.5); s.stop(at+decay+.05);
  }
  private tone(bus: GainNode, from: number, to: number, level: number, decay: number, type: OscillatorType = 'sine', pan = 0, delay = 0) {
    const ctx = this.ctx!, o = ctx.createOscillator(), g = ctx.createGain(), p = ctx.createStereoPanner(); o.type = type; p.pan.value = pan;
    const at = ctx.currentTime+delay; o.frequency.setValueAtTime(from, at); o.frequency.exponentialRampToValueAtTime(Math.max(20, to), at+decay);
    o.connect(g); g.connect(p); p.connect(bus); this.env(g.gain, at, level, .003, decay); o.start(at); o.stop(at+decay+.05);
  }
  play(name: SoundName, o: SoundOptions = {}) {
    if (!this.enabled || !this.ctx || this.ctx.state !== 'running' || !this.sfx) return;
    const lv = o.level ?? 1, pan = o.x !== undefined ? Math.max(-.8, Math.min(.8, -o.x/30)) : 0, sfx = this.sfx, ui = this.ui!;
    switch (name) {
      case 'click': this.tone(ui, 1400, 900, .25, .05, 'triangle'); break;
      case 'tick': this.tone(ui, 2200, 2000, .12, .03, 'square'); break;
      case 'perfect': this.tone(ui, 1320, 1320, .22, .35); this.tone(ui, 1980, 1980, .14, .45, 'sine', 0, .06); break;
      case 'release': this.burst(sfx, 'bandpass', 900, .8, .22, .18, pan); break;
      case 'step': this.burst(sfx, 'lowpass', 520+Math.random()*180, .7, .16*lv, .06, pan); break;
      case 'bounce': this.burst(sfx, 'lowpass', 420, .8, .45*Math.min(1.2, lv), .07, pan); this.tone(sfx, 110, 60, .25*lv, .08, 'sine', pan); break;
      case 'bat': {
        const q = Math.max(.15, Math.min(1, lv));
        this.tone(sfx, 920+q*240, 300, .55*q+.2, .09, 'triangle', pan); this.burst(sfx, 'bandpass', 1800, 1.4, .5+.3*q, .05, pan); this.tone(sfx, 150, 70, .4*q, .12, 'sine', pan);
        break;
      }
      case 'edge': this.burst(sfx, 'highpass', 4200, .9, .45, .035, pan); this.tone(sfx, 2600, 1800, .18, .04, 'triangle', pan); break;
      case 'pad': this.burst(sfx, 'lowpass', 640, 1, .55, .12, pan); this.tone(sfx, 130, 70, .3, .1, 'sine', pan); break;
      case 'body': this.burst(sfx, 'lowpass', 380, 1, .5, .14, pan); break;
      case 'stumps': for (let i = 0; i < 5; i++) {this.tone(sfx, 560+Math.random()*900, 300, .4-.05*i, .08, 'triangle', pan, i*.028); this.burst(sfx, 'bandpass', 2200+Math.random()*900, 3, .22, .04, pan, i*.035+.01);} break;
      case 'keeper': case 'catch': this.burst(sfx, 'bandpass', 1150, 1.2, .5, .05, pan); this.tone(sfx, 260, 150, .25, .06, 'sine', pan); break;
      case 'land': this.burst(sfx, 'lowpass', 300, .8, .3*lv, .08, pan); break;
      case 'field': this.burst(sfx, 'lowpass', 900, .8, .18, .05, pan); break;
      case 'throw': this.burst(sfx, 'bandpass', 700, .7, .15, .2, pan); break;
      case 'roar': this.clip('roar', .9*lv); break;
      case 'cheer': this.clip('cheer', .75*lv); break;
      case 'appeal': this.clip('cheer', .55*lv, .88); break;
      case 'sigh': this.clip('sigh', .8*lv); break;
      case 'applause': this.clip('applause', .55*lv); break;
      case 'win': [523, 659, 784, 1046].forEach((f, i) => this.tone(ui, f, f, .2, .4, 'triangle', 0, i*.09)); break;
      case 'lose': [440, 370, 294].forEach((f, i) => this.tone(ui, f, f*.98, .18, .45, 'triangle', 0, i*.13)); break;
    }
  }
}
