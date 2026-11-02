/**
 * Cricketer sound: every effect is synthesised with Web Audio, so no recorded audio ships and no
 * third-party sound licence applies. Sounds route through three buses (effects, crowd, interface)
 * into a limiter. Repeated sounds get small random pitch and level changes.
 * Randomness here uses Math.random and never touches the simulation's seeded RNG.
 */
export type CueName =
  | 'step' | 'release' | 'bounce' | 'swing' | 'hit' | 'gloves' | 'land' | 'pickup' | 'throw' | 'catch' | 'rope'
  | 'applause' | 'four' | 'six' | 'groan' | 'wicketCheer' | 'win' | 'lose' | 'click' | 'perfect';
/** World position (metres, camera behind the striker) and an intensity, usually 0..1. */
export type CueOptions = {x?: number; z?: number; level?: number; quality?: number};

const LISTENER = {x: .9, z: 6.4};
const rand = (a: number, b: number) => a+Math.random()*(b-a);

export class CricketAudio {
  private ctx: AudioContext | null = null;
  private buses: {sfx: GainNode; crowd: GainNode; ui: GainNode} | null = null;
  private noise: AudioBuffer | null = null; private applauseBuffer: AudioBuffer | null = null; private roarBuffer: AudioBuffer | null = null;
  private bed: {source: AudioBufferSourceNode; gain: GainNode} | null = null; private crowdLevel = .5;

  /** Create or wake the context. Call from a user gesture (browsers block audio until one). */
  unlock() {
    try {
      if (!this.ctx) this.build(new AudioContext());
      void this.ctx!.resume();
    } catch {/* Sound is optional. */}
  }
  get ready() {return !!this.ctx && this.ctx.state === 'running';}
  suspend() {void this.ctx?.suspend();}
  resume() {void this.ctx?.resume();}
  close() {void this.ctx?.close(); this.ctx = null; this.buses = null; this.bed = null;}
  /** Crowd murmur level: full during play, softer behind menus. */
  setCrowd(level: number) {this.crowdLevel = level; if (this.bed && this.ctx) this.bed.gain.gain.setTargetAtTime(.22*level, this.ctx.currentTime, .4);}

  private build(ctx: AudioContext) {
    this.ctx = ctx;
    const limiter = ctx.createDynamicsCompressor();
    limiter.threshold.value = -6; limiter.knee.value = 4; limiter.ratio.value = 12; limiter.attack.value = .003; limiter.release.value = .2;
    const master = ctx.createGain(); master.gain.value = .85; master.connect(limiter); limiter.connect(ctx.destination);
    const bus = (gain: number) => {const g = ctx.createGain(); g.gain.value = gain; g.connect(master); return g;};
    this.buses = {sfx: bus(1), crowd: bus(.6), ui: bus(.45)};
    this.noise = this.makeNoise(2);
    this.applauseBuffer = this.makeApplause(2.6);
    this.roarBuffer = this.makeRoar(3.2);
    this.startBed();
  }

  // ---------- Buffers ----------
  private makeNoise(seconds: number) {
    const ctx = this.ctx!, b = ctx.createBuffer(1, Math.floor(ctx.sampleRate*seconds), ctx.sampleRate), d = b.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random()*2-1;
    return b;
  }
  /** Many short, filtered hand claps scattered over the buffer, fading out. */
  private makeApplause(seconds: number) {
    const rate = 22050, ctx = this.ctx!, b = ctx.createBuffer(2, Math.floor(rate*seconds), rate);
    for (let ch = 0; ch < 2; ch++) {
      const d = b.getChannelData(ch);
      for (let n = 0; n < 340; n++) {
        const at = Math.pow(Math.random(), 1.4)*(seconds-.05), start = Math.floor(at*rate), amp = rand(.15, .5)*(1-at/seconds*.7), len = Math.floor(rate*rand(.006, .014));
        let prev = 0;
        for (let i = 0; i < len && start+i < d.length; i++) {const w = Math.random()*2-1, hp = w-prev; prev = w; d[start+i] += hp*amp*Math.exp(-i/(len*.3));}
      }
      for (let i = 0; i < d.length; i++) d[i] = Math.tanh(d[i]);
    }
    return b;
  }
  /** Crowd roar: brown noise with slow swells, used for boundaries and catches. */
  private makeRoar(seconds: number) {
    const rate = 22050, ctx = this.ctx!, b = ctx.createBuffer(2, Math.floor(rate*seconds), rate);
    for (let ch = 0; ch < 2; ch++) {
      const d = b.getChannelData(ch); let brown = 0;
      for (let i = 0; i < d.length; i++) {
        brown = (brown+.02*(Math.random()*2-1))/1.02;
        const t = i/rate, swell = .75+.25*Math.sin(t*5.3+ch)*Math.sin(t*2.1);
        d[i] = brown*3.2*swell+(Math.random()*2-1)*.06;
      }
    }
    return b;
  }

  // ---------- Primitives ----------
  private place(o: CueOptions) {
    // Distance from the batting-end camera sets level; side-to-side position sets stereo pan.
    const dx = (o.x ?? 0)-LISTENER.x, dz = (o.z ?? 0)-LISTENER.z, distance = Math.hypot(dx, dz);
    return {gain: 1/(1+Math.max(0, distance-4)/10), pan: Math.max(-.85, Math.min(.85, dx/(Math.abs(dz)+6)))};
  }
  private chain(bus: GainNode, pan: number) {
    const ctx = this.ctx!;
    if (!pan || !ctx.createStereoPanner) return bus as AudioNode;
    const p = ctx.createStereoPanner(); p.pan.value = pan; p.connect(bus); return p as AudioNode;
  }
  private envelope(gain: GainNode, t: number, level: number, attack: number, dur: number) {
    gain.gain.setValueAtTime(.0001, t); gain.gain.exponentialRampToValueAtTime(Math.max(.0002, level), t+attack); gain.gain.exponentialRampToValueAtTime(.0001, t+attack+dur);
  }
  private burst(o: {at?: number; dur: number; filter: BiquadFilterType; f: number; f2?: number; q?: number; gain: number; attack?: number; bus?: GainNode; pan?: number}) {
    const ctx = this.ctx!, t = ctx.currentTime+(o.at ?? 0), src = ctx.createBufferSource(), filter = ctx.createBiquadFilter(), g = ctx.createGain();
    src.buffer = this.noise; filter.type = o.filter; filter.frequency.setValueAtTime(o.f, t); filter.Q.value = o.q ?? .8;
    if (o.f2) filter.frequency.exponentialRampToValueAtTime(o.f2, t+o.dur);
    const attack = o.attack ?? .004; this.envelope(g, t, o.gain, attack, o.dur);
    src.connect(filter); filter.connect(g); g.connect(this.chain(o.bus ?? this.buses!.sfx, o.pan ?? 0));
    src.start(t, rand(0, 1.5)); src.stop(t+attack+o.dur+.05);
    src.onended = () => {src.disconnect(); filter.disconnect(); g.disconnect();};
  }
  private tone(o: {at?: number; f: number; f2?: number; dur: number; type?: OscillatorType; gain: number; attack?: number; bus?: GainNode; pan?: number; vibrato?: number}) {
    const ctx = this.ctx!, t = ctx.currentTime+(o.at ?? 0), osc = ctx.createOscillator(), g = ctx.createGain();
    osc.type = o.type ?? 'sine'; osc.frequency.setValueAtTime(o.f, t); if (o.f2) osc.frequency.exponentialRampToValueAtTime(o.f2, t+o.dur);
    let lfo: OscillatorNode | null = null, depth: GainNode | null = null;
    if (o.vibrato) {lfo = ctx.createOscillator(); depth = ctx.createGain(); lfo.frequency.value = 6; depth.gain.value = o.vibrato; lfo.connect(depth); depth.connect(osc.frequency); lfo.start(t); lfo.stop(t+o.dur+.1);}
    const attack = o.attack ?? .005; this.envelope(g, t, o.gain, attack, o.dur);
    osc.connect(g); g.connect(this.chain(o.bus ?? this.buses!.sfx, o.pan ?? 0));
    osc.start(t); osc.stop(t+attack+o.dur+.05);
    osc.onended = () => {osc.disconnect(); g.disconnect(); lfo?.disconnect(); depth?.disconnect();};
  }
  private sample(buffer: AudioBuffer, o: {gain: number; rate?: number; attack?: number; hold?: number; release?: number; filter?: number; at?: number}) {
    const ctx = this.ctx!, t = ctx.currentTime+(o.at ?? 0), src = ctx.createBufferSource(), g = ctx.createGain(), filter = ctx.createBiquadFilter();
    src.buffer = buffer; src.playbackRate.value = o.rate ?? 1; filter.type = 'lowpass'; filter.frequency.value = o.filter ?? 6000;
    const attack = o.attack ?? .08, hold = o.hold ?? buffer.duration*.4, release = o.release ?? buffer.duration*.5;
    g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(o.gain, t+attack); g.gain.setValueAtTime(o.gain, t+attack+hold); g.gain.exponentialRampToValueAtTime(.0001, t+attack+hold+release);
    src.connect(filter); filter.connect(g); g.connect(this.buses!.crowd);
    src.start(t); src.stop(t+attack+hold+release+.05);
    src.onended = () => {src.disconnect(); filter.disconnect(); g.disconnect();};
  }
  /** A low, looping murmur of the crowd under everything else. */
  private startBed() {
    const ctx = this.ctx!, rate = 22050, seconds = 6, b = ctx.createBuffer(2, rate*seconds, rate);
    for (let ch = 0; ch < 2; ch++) {
      const d = b.getChannelData(ch); let brown = 0;
      for (let i = 0; i < d.length; i++) {brown = (brown+.02*(Math.random()*2-1))/1.02; const t = i/rate; d[i] = brown*2.4*(.8+.2*Math.sin(t*Math.PI*2/seconds*3+ch*2));}
      // Crossfade the loop seam.
      const fade = rate*.25; for (let i = 0; i < fade; i++) {const w = i/fade; d[i] = d[i]*w+d[d.length-fade+i]*(1-w);}
    }
    const source = ctx.createBufferSource(), filter = ctx.createBiquadFilter(), gain = ctx.createGain();
    source.buffer = b; source.loop = true; source.loopEnd = seconds-.25; filter.type = 'bandpass'; filter.frequency.value = 650; filter.Q.value = .5; gain.gain.value = .22*this.crowdLevel;
    source.connect(filter); filter.connect(gain); gain.connect(this.buses!.crowd); source.start();
    this.bed = {source, gain};
  }

  // ---------- Cues ----------
  play(name: CueName, o: CueOptions = {}) {
    if (!this.ready || !this.buses) return;
    const {gain, pan} = this.place(o), level = o.level ?? 1, ui = this.buses.ui;
    switch (name) {
      case 'step': {
        // Spikes on turf: a soft thud with a short grassy scuff.
        const g = gain*level*rand(.8, 1.1);
        this.burst({dur: .06, filter: 'lowpass', f: rand(700, 950), f2: 260, gain: .16*g, pan});
        this.tone({f: rand(85, 105), f2: 55, dur: .05, gain: .12*g, pan});
        break;
      }
      case 'release': {
        // Front-foot plant and the arm coming over.
        this.tone({f: 95, f2: 50, dur: .09, gain: .22*gain, pan});
        this.burst({at: .04, dur: .2, filter: 'bandpass', f: 380, f2: 1700, q: 1.2, gain: .1*gain, attack: .05, pan});
        break;
      }
      case 'bounce': {
        // Leather on a hard strip: a dull thock plus a little grit.
        this.tone({f: rand(170, 200), f2: 85, dur: .07, gain: .3*gain*level, pan});
        this.burst({dur: .03, filter: 'bandpass', f: 2200, q: 1.5, gain: .1*gain*level, pan});
        break;
      }
      case 'swing': {
        const g = rand(.85, 1.05);
        this.burst({dur: .17, filter: 'bandpass', f: rand(260, 320), f2: rand(1300, 1600), q: 2.2, gain: .2*g, attack: .06, pan: -.1});
        break;
      }
      case 'hit': {
        // Bat on ball. A clean strike is a deep, round "tock"; a poor one is a thin, short click.
        const q = Math.max(0, Math.min(1, o.quality ?? .5)), clean = q > .5;
        this.burst({dur: .025, filter: 'highpass', f: clean ? 2600 : 3800, gain: .3+.25*q});
        for (const [f, d, a] of (clean ? [[620, .14, .3], [1050, .1, .18], [1580, .07, .1]] : [[1900, .05, .12], [2700, .035, .08]]) as [number, number, number][])
          this.tone({f: f*rand(.97, 1.03), dur: d, type: 'triangle', gain: a*(.6+.6*q)});
        if (clean) this.tone({f: 120, f2: 70, dur: .09, gain: .28*q});
        break;
      }
      case 'perfect':
        this.tone({at: .03, f: 2093, dur: .35, gain: .05, bus: ui}); this.tone({at: .06, f: 3136, dur: .3, gain: .035, bus: ui});
        break;
      case 'gloves':
        this.burst({dur: .05, filter: 'lowpass', f: 1100, gain: .3*gain*level, pan});
        this.tone({f: 150, f2: 80, dur: .07, gain: .22*gain*level, pan});
        break;
      case 'land':
        this.tone({f: 110, f2: 60, dur: .08, gain: .25*gain*level, pan});
        this.burst({dur: .05, filter: 'lowpass', f: 500, gain: .12*gain*level, pan});
        break;
      case 'pickup':
        this.burst({dur: .08, filter: 'bandpass', f: 1400, q: .7, gain: .1*gain, pan});
        break;
      case 'throw':
        this.burst({dur: .22, filter: 'bandpass', f: 500, f2: 1500, q: 1.6, gain: .14*gain, attack: .05, pan});
        break;
      case 'catch':
        this.burst({dur: .06, filter: 'lowpass', f: 900, gain: .32*gain, pan});
        this.tone({f: 130, f2: 70, dur: .08, gain: .25*gain, pan});
        break;
      case 'rope':
        this.tone({f: 90, f2: 55, dur: .12, gain: .2*gain, pan});
        break;
      case 'applause':
        this.sample(this.applauseBuffer!, {gain: .5*level, rate: rand(.95, 1.05), attack: .12, hold: .7, release: 1.4});
        break;
      case 'four':
        this.sample(this.roarBuffer!, {gain: .6, rate: rand(.95, 1.05), attack: .25, hold: .9, release: 1.6, filter: 2600});
        this.sample(this.applauseBuffer!, {gain: .55, at: .35, hold: 1, release: 1.2});
        break;
      case 'six':
        this.sample(this.roarBuffer!, {gain: .9, rate: rand(1, 1.08), attack: .18, hold: 1.4, release: 1.6, filter: 3200});
        this.sample(this.applauseBuffer!, {gain: .65, at: .4, hold: 1.2, release: 1.2});
        for (let i = 0; i < 3; i++) this.tone({at: .3+i*rand(.25, .45), f: rand(2300, 2900), dur: rand(.25, .45), gain: .025, vibrato: 40, bus: this.buses.crowd});
        break;
      case 'groan': {
        // "Ooh": crowd vowel falling away.
        const ctx = this.ctx!, t = ctx.currentTime, src = ctx.createBufferSource(), f1 = ctx.createBiquadFilter(), g = ctx.createGain();
        src.buffer = this.roarBuffer; f1.type = 'bandpass'; f1.Q.value = 3; f1.frequency.setValueAtTime(720, t); f1.frequency.exponentialRampToValueAtTime(340, t+.9);
        this.envelope(g, t, .5*level, .15, .9);
        src.connect(f1); f1.connect(g); g.connect(this.buses.crowd); src.start(t, rand(0, 1)); src.stop(t+1.2);
        src.onended = () => {src.disconnect(); f1.disconnect(); g.disconnect();};
        break;
      }
      case 'wicketCheer':
        this.sample(this.roarBuffer!, {gain: .55, attack: .2, hold: .6, release: 1.2, filter: 1800});
        break;
      case 'win':
        [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => this.tone({at: i*.11, f, dur: i === 3 ? .6 : .16, type: 'triangle', gain: .09, bus: ui}));
        this.sample(this.applauseBuffer!, {gain: .6, at: .2, hold: 1.4, release: 1.5});
        break;
      case 'lose':
        [392, 329.63, 261.63].forEach((f, i) => this.tone({at: i*.18, f, dur: .3, type: 'triangle', gain: .07, bus: ui}));
        break;
      case 'click':
        this.tone({f: 1250, f2: 900, dur: .03, gain: .06, bus: ui}); this.burst({dur: .015, filter: 'highpass', f: 3000, gain: .03, bus: ui});
        break;
    }
  }
}
