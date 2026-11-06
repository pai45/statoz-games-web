/**
 * Procedural WebAudio sound design: no audio files needed.
 *
 * Buses: sfx, crowd and PA (arena organ, air horn) run through a generated arena reverb; music stays dry.
 * The crowd is a rendered bank (babble, roar, ooh, aww, boo, chants, claps) built once with an
 * OfflineAudioContext at unlock and normalised to a fixed loudness, so the mix below is set in decibels:
 * a clip at gain 1 plays at about -14 dBFS RMS.
 */

type Formants = [number, number, number]

/** Vowel formants (F1, F2, F3 in Hz), adult averages. */
const VOWEL: Record<'oo' | 'oh' | 'ah' | 'aw' | 'eh' | 'ee' | 'uh' | 'ay', Formants> = {
  oo: [300, 870, 2240],
  oh: [500, 900, 2400],
  ah: [730, 1090, 2440],
  aw: [570, 840, 2410],
  eh: [530, 1840, 2480],
  ee: [270, 2290, 3010],
  uh: [640, 1190, 2390],
  ay: [660, 1720, 2410],
}
const BABBLE_VOWELS: Formants[] = [VOWEL.ah, VOWEL.eh, VOWEL.ee, VOWEL.oh, VOWEL.uh, VOWEL.ay, VOWEL.oo, VOWEL.aw]

type Clip = 'walla' | 'roar' | 'applause' | 'ooh' | 'aww' | 'boo' | 'defense' | 'clap'

/** Crowd clips render at a low rate: the content sits below 8 kHz and the cost halves. */
const CROWD_RATE = 22050
/** Normalised clip loudness (RMS, about -14 dBFS). */
const CLIP_RMS = 0.2

const db = (d: number) => Math.pow(10, d / 20)
const rand = (a: number, b: number) => a + Math.random() * (b - a)
const pick = <T,>(xs: T[]) => xs[Math.floor(Math.random() * xs.length)]

interface VoiceOpts {
  dur: number
  voices: number
  /** vowel sequence over a syllable (from -> to) */
  from: Formants
  to: Formants
  /** pitch multipliers over the clip */
  pitchFrom: number
  pitchTo: number
  /** base F0 for men / women; shouting raises both */
  male: number
  female: number
  femaleShare: number
  /** onset spread across voices (s) */
  jitter: number
  attack: number
  release: number
  /** fraction of the clip the voice sustains before releasing */
  hold: number
  /** breath noise mixed into each voice */
  breath: number
}

function normalise(buf: AudioBuffer, rms = CLIP_RMS) {
  let sum = 0
  let peak = 0
  for (let c = 0; c < buf.numberOfChannels; c++) {
    const d = buf.getChannelData(c)
    for (let i = 0; i < d.length; i++) {
      sum += d[i] * d[i]
      const a = Math.abs(d[i])
      if (a > peak) peak = a
    }
  }
  const cur = Math.sqrt(sum / (buf.length * buf.numberOfChannels)) || 1
  const k = Math.min(rms / cur, 0.95 / (peak || 1))
  for (let c = 0; c < buf.numberOfChannels; c++) {
    const d = buf.getChannelData(c)
    for (let i = 0; i < d.length; i++) d[i] *= k
  }
  return buf
}

function offline(dur: number) {
  const Ctx = window.OfflineAudioContext || (window as unknown as { webkitOfflineAudioContext?: typeof OfflineAudioContext }).webkitOfflineAudioContext
  if (!Ctx) return null
  return new Ctx(2, Math.ceil(dur * CROWD_RATE), CROWD_RATE)
}

function noiseBuffer(ctx: BaseAudioContext, seconds: number) {
  const len = Math.ceil(ctx.sampleRate * seconds)
  const b = ctx.createBuffer(1, len, ctx.sampleRate)
  const d = b.getChannelData(0)
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1
  return b
}

interface Syllable {
  t0: number
  t1: number
  from: Formants
  to: Formants
  /** pitch multipliers at the start and end of the syllable */
  p0: number
  p1: number
  attack: number
  release: number
  peak: number
}

/**
 * One crowd member: a sawtooth glottal source through three formant band-passes, speaking a list of
 * syllables. One node chain per voice; each syllable is just automation on it.
 */
function voiceTrack(oc: OfflineAudioContext, out: AudioNode, noise: AudioBuffer, f0: number, syls: Syllable[], breath: number) {
  if (!syls.length) return
  const first = syls[0]
  const last = syls[syls.length - 1]
  const osc = oc.createOscillator()
  osc.type = 'sawtooth'
  const vib = oc.createOscillator()
  vib.frequency.value = rand(4.2, 6.5)
  const vg = oc.createGain()
  vg.gain.value = f0 * rand(0.008, 0.02)
  vib.connect(vg).connect(osc.frequency)
  const env = oc.createGain()
  env.gain.setValueAtTime(0, 0)
  const pan = oc.createStereoPanner()
  pan.pan.value = rand(-0.9, 0.9)
  const q = [6, 9, 11]
  const w = [1, 0.55, 0.22]
  const jit = [rand(0.92, 1.08), rand(0.92, 1.08), rand(0.94, 1.06)]
  const bps: BiquadFilterNode[] = []
  for (let k = 0; k < 3; k++) {
    const bp = oc.createBiquadFilter()
    bp.type = 'bandpass'
    bp.Q.value = q[k]
    bp.frequency.setValueAtTime(first.from[k] * jit[k], 0)
    const g = oc.createGain()
    g.gain.value = w[k]
    osc.connect(bp).connect(g).connect(env)
    bps.push(bp)
  }
  let breathFilter: BiquadFilterNode | null = null
  if (breath > 0) {
    const n = oc.createBufferSource()
    n.buffer = noise
    n.loop = true
    breathFilter = oc.createBiquadFilter()
    breathFilter.type = 'bandpass'
    breathFilter.Q.value = 1.5
    breathFilter.frequency.setValueAtTime(first.to[1], 0)
    const g = oc.createGain()
    g.gain.value = breath
    n.connect(breathFilter).connect(g).connect(env)
    n.start(first.t0, Math.random() * 1.5)
    n.stop(last.t1 + 0.02)
  }
  for (const s of syls) {
    osc.frequency.setValueAtTime(f0 * s.p0, s.t0)
    osc.frequency.linearRampToValueAtTime(f0 * s.p1, s.t1)
    env.gain.setValueAtTime(0, s.t0)
    env.gain.linearRampToValueAtTime(s.peak, s.t0 + s.attack)
    env.gain.setValueAtTime(s.peak, Math.max(s.t0 + s.attack, s.t1 - s.release))
    env.gain.linearRampToValueAtTime(0, s.t1)
    for (let k = 0; k < 3; k++) {
      bps[k].frequency.setValueAtTime(s.from[k] * jit[k], s.t0)
      bps[k].frequency.linearRampToValueAtTime(s.to[k] * jit[k], s.t1)
    }
    breathFilter?.frequency.setValueAtTime(s.to[1], s.t0)
  }
  env.connect(pan).connect(out)
  osc.start(first.t0)
  vib.start(first.t0)
  osc.stop(last.t1 + 0.02)
  vib.stop(last.t1 + 0.02)
}

/** A crowd vocalisation (ooh, aww, boo): many voices gliding through one vowel together. */
async function renderVoices(o: VoiceOpts) {
  const oc = offline(o.dur)
  if (!oc) return null
  const noise = noiseBuffer(oc, 2)
  const out = oc.createGain()
  out.connect(oc.destination)
  for (let i = 0; i < o.voices; i++) {
    const fem = Math.random() < o.femaleShare
    const f0 = (fem ? o.female : o.male) * rand(0.85, 1.2)
    const t0 = Math.random() * o.jitter
    const t1 = Math.min(o.dur - 0.02, t0 + o.dur * o.hold * rand(0.8, 1))
    const syl: Syllable = { t0, t1, from: o.from, to: o.to, p0: o.pitchFrom * rand(0.95, 1.05), p1: o.pitchTo * rand(0.95, 1.05), attack: o.attack * rand(0.7, 1.3), release: Math.min((t1 - t0) * 0.6, o.release * rand(0.7, 1.2)), peak: 1 }
    voiceTrack(oc, out, noise, f0, [syl], o.breath)
  }
  return normalise(await oc.startRendering())
}

/** Crowd babble: many people talking at once, every syllable a random vowel and intonation. */
async function renderWalla(dur: number, voices: number, shout: number) {
  const oc = offline(dur)
  if (!oc) return null
  const noise = noiseBuffer(oc, 2)
  const out = oc.createGain()
  out.connect(oc.destination)
  for (let i = 0; i < voices; i++) {
    const fem = Math.random() < 0.45
    const f0 = (fem ? 205 : 118) * rand(0.85, 1.2) * (1 + shout * 0.7)
    const syls: Syllable[] = []
    let t = Math.random() * 0.6
    while (t < dur - 0.3) {
      const len = rand(0.1, 0.26) * (1 + shout * 2.2)
      const t1 = Math.min(dur - 0.02, t + len)
      const p = rand(0.9, 1.12)
      syls.push({ t0: t, t1, from: pick(BABBLE_VOWELS), to: pick(BABBLE_VOWELS), p0: p, p1: p * rand(0.88, 1.06), attack: Math.min(0.05, len * 0.3), release: Math.min(0.08, len * 0.4), peak: rand(0.5, 1) })
      t = t1 + rand(0.02, 0.3) * (1 - shout * 0.7)
    }
    voiceTrack(oc, out, noise, f0, syls, 0.25 + shout * 0.3)
  }
  return normalise(await oc.startRendering())
}

/** Applause: thousands of hand claps (short resonant noise bursts) scattered over a loop, written directly. */
function renderClaps(ctx: BaseAudioContext, dur: number, perSecond: number, jitter: number, synced: boolean) {
  const sr = CROWD_RATE
  const len = Math.ceil(dur * sr)
  const buf = ctx.createBuffer(2, len, sr)
  const L = buf.getChannelData(0)
  const R = buf.getChannelData(1)
  const count = Math.round(perSecond * dur)
  const clapLen = Math.round(0.03 * sr)
  for (let c = 0; c < count; c++) {
    const start = synced ? Math.max(0, Math.round((0.02 + (Math.random() - 0.5) * 2 * jitter) * sr)) : Math.floor(Math.random() * (len - clapLen))
    // resonant band-pass (RBJ biquad) per clap: palms cup at 0.9-2.6 kHz
    const f = rand(900, 2600)
    const Q = rand(1.2, 3)
    const w0 = (2 * Math.PI * f) / sr
    const alpha = Math.sin(w0) / (2 * Q)
    const a0 = 1 + alpha
    const b0 = alpha / a0
    const b2 = -alpha / a0
    const a1 = (-2 * Math.cos(w0)) / a0
    const a2 = (1 - alpha) / a0
    let x1 = 0, x2 = 0, y1 = 0, y2 = 0
    const gain = rand(0.3, 1)
    const pan = Math.random()
    const gl = Math.cos(pan * Math.PI * 0.5) * gain
    const gr = Math.sin(pan * Math.PI * 0.5) * gain
    const tau = rand(0.003, 0.007) * sr
    for (let i = 0; i < clapLen && start + i < len; i++) {
      const env = i < 12 ? i / 12 : Math.exp(-(i - 12) / tau)
      const x = (Math.random() * 2 - 1) * env
      const y = b0 * x + b2 * x2 - a1 * y1 - a2 * y2
      x2 = x1
      x1 = x
      y2 = y1
      y1 = y
      L[start + i] += y * gl
      R[start + i] += y * gr
    }
  }
  return normalise(buf)
}

/** "DE-FENSE!" shouted by the whole building. */
async function renderDefense() {
  const dur = 1.1
  const oc = offline(dur)
  if (!oc) return null
  const noise = noiseBuffer(oc, 2)
  const out = oc.createGain()
  out.connect(oc.destination)
  const burst = (t: number, len: number, type: BiquadFilterType, f: number, g: number) => {
    const n = oc.createBufferSource()
    n.buffer = noise
    const bp = oc.createBiquadFilter()
    bp.type = type
    bp.frequency.value = f
    const e = oc.createGain()
    e.gain.setValueAtTime(0, t)
    e.gain.linearRampToValueAtTime(g, t + 0.01)
    e.gain.linearRampToValueAtTime(0, t + len)
    n.connect(bp).connect(e).connect(out)
    n.start(t, Math.random())
    n.stop(t + len + 0.02)
  }
  for (let i = 0; i < 26; i++) {
    const fem = Math.random() < 0.4
    const f0 = (fem ? 330 : 185) * rand(0.88, 1.15)
    // onsets spread over 60 ms (never negative: start() rejects times before zero)
    const j = Math.random() * 0.06
    // "dee" ... "fense"
    burst(0.02 + j, 0.025, 'lowpass', 2500, 0.25)
    burst(0.4 + j, 0.07, 'bandpass', 4200, 0.35)
    burst(0.76 + j, 0.14, 'highpass', 5000, 0.3)
    voiceTrack(
      oc,
      out,
      noise,
      f0,
      [
        { t0: 0.04 + j, t1: 0.3 + j, from: VOWEL.ee, to: VOWEL.ee, p0: 1.05, p1: 1.0, attack: 0.03, release: 0.06, peak: 1 },
        { t0: 0.45 + j, t1: 0.78 + j, from: VOWEL.eh, to: VOWEL.eh, p0: 0.9, p1: 0.82, attack: 0.03, release: 0.1, peak: 1 },
      ],
      0.3,
    )
  }
  return normalise(await oc.startRendering())
}

/**
 * A big-room impulse response: early reflections off the bowl, then a dense tail (RT60 about 2.1 s)
 * that darkens as it decays, the way an arena swallows the highs.
 */
function arenaImpulse(ctx: BaseAudioContext) {
  const sr = ctx.sampleRate
  const len = Math.floor(sr * 2.0)
  const ir = ctx.createBuffer(2, len, sr)
  const tau = 2.1 / 6.9
  const taps = [0.019, 0.027, 0.041, 0.053, 0.071, 0.089]
  for (let c = 0; c < 2; c++) {
    const d = ir.getChannelData(c)
    let y = 0
    for (let i = 0; i < len; i++) {
      const t = i / sr
      const a = 0.85 - 0.72 * Math.min(1, t / 1.6)
      y += a * (Math.random() * 2 - 1 - y)
      const onset = Math.min(1, t / 0.012)
      d[i] = y * Math.exp(-t / tau) * onset * 0.6
    }
    for (const tp of taps) {
      const i = Math.floor((tp + (c ? 0.0031 : 0)) * sr)
      if (i < len) d[i] += (Math.random() < 0.5 ? -1 : 1) * 0.5 * Math.exp(-tp / 0.08)
    }
  }
  return ir
}

export class AudioEngine {
  ctx: AudioContext | null = null
  private master!: GainNode
  private sfx!: GainNode
  private crowdBus!: GainNode
  private crowdDuck!: GainNode
  private musicBus!: GainNode
  private musicDuck!: GainNode
  private paBus!: GainNode
  private verb!: GainNode
  private noise!: AudioBuffer
  private bank: Partial<Record<Clip, AudioBuffer>> = {}
  private banking = false
  private crowd: { input: GainNode; walla: GainNode; roar: GainNode; roarTone: BiquadFilterNode; applause: GainNode; rumble: GainNode; started: Set<Clip> } | null = null
  private crowdBase = 0.05
  private tension = 0
  private chantUntil = 0
  private musicTimer: number | null = null
  private musicStep = 0
  private nextNoteTime = 0
  volumes = { sfx: 0.9, crowd: 0.7, music: 0.5 }
  muted = false

  unlock(ctx?: AudioContext) {
    if (!this.ctx) {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (!Ctx && !ctx) return
      this.ctx = ctx ?? new Ctx()
      const c = this.ctx
      this.master = c.createGain()
      const comp = c.createDynamicsCompressor()
      comp.threshold.value = -14
      comp.knee.value = 6
      comp.ratio.value = 4
      comp.attack.value = 0.004
      comp.release.value = 0.2
      this.master.connect(comp).connect(c.destination)
      // reverb return
      const conv = c.createConvolver()
      conv.buffer = arenaImpulse(c)
      this.verb = c.createGain()
      const hp = c.createBiquadFilter()
      hp.type = 'highpass'
      hp.frequency.value = 160
      const ret = c.createGain()
      ret.gain.value = 0.9
      this.verb.connect(hp).connect(conv).connect(ret).connect(this.master)
      this.sfx = c.createGain()
      this.crowdBus = c.createGain()
      this.crowdDuck = c.createGain()
      this.musicBus = c.createGain()
      this.musicDuck = c.createGain()
      this.paBus = c.createGain()
      this.sfx.connect(this.master)
      this.sfx.connect(this.send(0.2))
      this.crowdBus.connect(this.crowdDuck).connect(this.master)
      this.crowdBus.connect(this.send(0.07))
      this.musicBus.connect(this.musicDuck).connect(this.master)
      this.paBus.connect(this.crowdDuck)
      this.paBus.connect(this.send(0.55))
      this.noise = noiseBuffer(c, 2)
      this.applyVolumes()
      void this.buildBank()
    }
    if (this.ctx.state === 'suspended') this.ctx.resume?.().catch(() => undefined)
  }

  private send(amount: number) {
    const g = this.ctx!.createGain()
    g.gain.value = amount
    g.connect(this.verb)
    return g
  }

  /** Renders the crowd bank one clip at a time (each render runs on the audio thread). */
  private async buildBank() {
    if (this.banking || !this.ctx) return
    this.banking = true
    try {
      const c = this.ctx
      this.bank.applause = renderClaps(c, 4, 260, 0, false)
      this.bank.clap = renderClaps(c, 0.12, 900, 0.016, true)
      this.attachCrowdLoops()
      const jobs: [Clip, () => Promise<AudioBuffer | null>][] = [
        ['walla', () => renderWalla(6, 18, 0)],
        ['ooh', () => renderVoices({ dur: 1.7, voices: 24, from: VOWEL.oo, to: VOWEL.oh, pitchFrom: 1.18, pitchTo: 0.8, male: 150, female: 260, femaleShare: 0.45, jitter: 0.14, attack: 0.18, release: 0.8, hold: 0.95, breath: 0.25 })],
        ['roar', () => renderWalla(5, 20, 1)],
        ['aww', () => renderVoices({ dur: 1.5, voices: 22, from: VOWEL.aw, to: VOWEL.uh, pitchFrom: 1.12, pitchTo: 0.74, male: 140, female: 240, femaleShare: 0.45, jitter: 0.1, attack: 0.12, release: 0.7, hold: 0.95, breath: 0.3 })],
        ['defense', () => renderDefense()],
        ['boo', () => renderVoices({ dur: 2.1, voices: 22, from: VOWEL.oo, to: VOWEL.oo, pitchFrom: 1.0, pitchTo: 0.94, male: 128, female: 215, femaleShare: 0.35, jitter: 0.25, attack: 0.3, release: 0.7, hold: 0.95, breath: 0.35 })],
      ]
      for (const [name, job] of jobs) {
        const b = await job()
        if (b) this.bank[name] = b
        this.attachCrowdLoops()
      }
    } catch {
      // no offline rendering: the synthesized fallbacks below keep working
    }
  }

  setVolumes(v: Partial<AudioEngine['volumes']>) {
    Object.assign(this.volumes, v)
    this.applyVolumes()
  }

  private applyVolumes() {
    if (!this.ctx) return
    const m = this.muted ? 0 : 1
    this.sfx.gain.value = this.volumes.sfx * m
    this.crowdBus.gain.value = this.volumes.crowd * m
    this.paBus.gain.value = this.volumes.crowd * 0.9 * m
    this.musicBus.gain.value = this.volumes.music * 0.55 * m
  }

  private get now() {
    return this.ctx ? this.ctx.currentTime : 0
  }

  private env(g: GainNode, t: number, peak: number, attack: number, decay: number) {
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak), t + attack)
    g.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay)
  }

  private noiseBurst(t: number, dur: number, filter: BiquadFilterType, freq: number, q: number, peak: number, dest: AudioNode = this.sfx, attack = 0.002) {
    const ctx = this.ctx!
    const src = ctx.createBufferSource()
    src.buffer = this.noise
    src.playbackRate.value = 0.8 + Math.random() * 0.4
    const f = ctx.createBiquadFilter()
    f.type = filter
    f.frequency.value = freq
    f.Q.value = q
    const g = ctx.createGain()
    this.env(g, t, peak, attack, dur)
    src.connect(f).connect(g).connect(dest)
    src.start(t, Math.random() * 1.5)
    src.stop(t + attack + dur + 0.05)
    return f
  }

  private tone(t: number, type: OscillatorType, f0: number, f1: number, dur: number, peak: number, dest: AudioNode = this.sfx, attack = 0.003) {
    const ctx = this.ctx!
    const o = ctx.createOscillator()
    o.type = type
    o.frequency.setValueAtTime(f0, t)
    if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(Math.max(1, f1), t + dur)
    const g = ctx.createGain()
    this.env(g, t, peak, attack, dur)
    o.connect(g).connect(dest)
    o.start(t)
    o.stop(t + attack + dur + 0.05)
    return o
  }

  /** Plays a bank clip once; returns false when it has not rendered yet. */
  private clip(name: Clip, gain: number, opts: { at?: number; rate?: number; dest?: AudioNode; offset?: number } = {}) {
    const b = this.bank[name]
    if (!b || !this.ctx) return false
    const c = this.ctx
    const s = c.createBufferSource()
    s.buffer = b
    s.playbackRate.value = opts.rate ?? rand(0.96, 1.04)
    const g = c.createGain()
    g.gain.value = gain
    s.connect(g).connect(opts.dest ?? this.crowd?.input ?? this.crowdBus)
    s.start(opts.at ?? this.now, opts.offset ?? 0)
    return true
  }

  // ---------------------------------------------------------------- ball, rim, floor
  bounce(intensity = 1) {
    if (!this.ctx) return
    const t = this.now
    const v = Math.min(1, intensity) * rand(0.85, 1.05)
    const p = rand(0.94, 1.06)
    // the ball's cavity thump, the floor's body, the slap of leather on lacquer
    this.tone(t, 'sine', 128 * p, 50 * p, 0.12, 0.5 * v)
    this.tone(t, 'sine', 240 * p, 150 * p, 0.05, 0.14 * v)
    this.noiseBurst(t, 0.03, 'bandpass', 1700 * p, 1.3, 0.2 * v)
  }

  swish() {
    if (!this.ctx) return
    const t = this.now
    const f = this.noiseBurst(t, rand(0.36, 0.46), 'bandpass', rand(5000, 6000), 0.8, 0.3, this.sfx, 0.018)
    f.frequency.exponentialRampToValueAtTime(rand(2100, 2600), t + 0.4)
    this.noiseBurst(t + 0.015, 0.11, 'highpass', 6500, 0.7, 0.1)
    // the cords snapping back
    this.noiseBurst(t + 0.05, 0.16, 'lowpass', 520, 0.9, 0.12, this.sfx, 0.01)
  }

  rim(intensity = 1) {
    if (!this.ctx) return
    const t = this.now
    const v = Math.min(1, 0.25 + intensity * 0.18)
    for (const [f, d, a] of [
      [415, 0.55, 0.22],
      [1060, 0.38, 0.14],
      [1870, 0.26, 0.1],
      [2960, 0.18, 0.07],
      [4120, 0.12, 0.035],
    ]) {
      this.tone(t, 'sine', f * rand(0.97, 1.03), f * 0.995, d, a * v)
    }
    this.noiseBurst(t, 0.04, 'highpass', 3000, 0.7, 0.25 * v)
    if (intensity > 2) this.tone(t, 'sine', 95, 45, 0.25, 0.4)
  }

  board(intensity = 1) {
    if (!this.ctx) return
    const t = this.now
    const v = Math.min(1, 0.3 + intensity * 0.15)
    this.noiseBurst(t, 0.13, 'lowpass', 700, 0.8, 0.5 * v)
    this.tone(t, 'sine', 190 * rand(0.96, 1.04), 120, 0.12, 0.35 * v)
    this.noiseBurst(t, 0.06, 'bandpass', 3200, 2, 0.08 * v)
  }

  /** Sneaker on hardwood: a harmonic chirp through the rubber's resonance, never twice the same. */
  squeak() {
    if (!this.ctx) return
    const t = this.now
    const ctx = this.ctx
    const base = rand(1800, 3400)
    const kind = Math.random()
    const dur = rand(0.06, 0.15)
    const out = ctx.createGain()
    this.env(out, t, rand(0.11, 0.19), 0.004, dur)
    const bp = ctx.createBiquadFilter()
    bp.type = 'bandpass'
    bp.frequency.value = base * 1.08
    bp.Q.value = 1.3
    bp.connect(out).connect(this.sfx)
    const jit = ctx.createOscillator()
    jit.frequency.value = rand(30, 75)
    const jg = ctx.createGain()
    jg.gain.value = base * rand(0.03, 0.07)
    for (const [mul, type, g] of [
      [1, 'triangle', 1],
      [2, 'sine', 0.35],
    ] as const) {
      const o = ctx.createOscillator()
      o.type = type
      const f0 = base * mul
      o.frequency.setValueAtTime(f0, t)
      // chirp up, skid down, or a double catch
      if (kind < 0.45) o.frequency.linearRampToValueAtTime(f0 * 1.3, t + dur)
      else if (kind < 0.8) o.frequency.linearRampToValueAtTime(f0 * 0.75, t + dur)
      else {
        o.frequency.linearRampToValueAtTime(f0 * 1.2, t + dur * 0.4)
        o.frequency.linearRampToValueAtTime(f0 * 0.95, t + dur)
      }
      jit.connect(jg).connect(o.frequency)
      const og = ctx.createGain()
      og.gain.value = g
      o.connect(og).connect(bp)
      o.start(t)
      o.stop(t + dur + 0.05)
    }
    jit.start(t)
    jit.stop(t + dur + 0.05)
  }

  buzzer() {
    if (!this.ctx) return
    const t = this.now
    const ctx = this.ctx
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(0.18, t + 0.02)
    g.gain.setValueAtTime(0.18, t + 1.0)
    g.gain.exponentialRampToValueAtTime(0.0001, t + 1.15)
    const f = ctx.createBiquadFilter()
    f.type = 'lowpass'
    f.frequency.value = 1800
    for (const fr of [196, 233.1, 98]) {
      const o = ctx.createOscillator()
      o.type = 'square'
      o.frequency.value = fr
      o.connect(f)
      o.start(t)
      o.stop(t + 1.2)
    }
    f.connect(g).connect(this.sfx)
  }

  /** Referee whistle (a pea whistle trill); two blasts for a foul. */
  whistle(blasts = 1) {
    if (!this.ctx) return
    const ctx = this.ctx
    for (let b = 0; b < blasts; b++) {
      const t = this.now + b * 0.24
      const len = blasts > 1 && b === 0 ? 0.14 : 0.32
      const o = ctx.createOscillator()
      o.frequency.value = rand(2850, 3050)
      const lfo = ctx.createOscillator()
      lfo.frequency.value = rand(24, 32)
      const lg = ctx.createGain()
      lg.gain.value = 140
      lfo.connect(lg).connect(o.frequency)
      const g = ctx.createGain()
      this.env(g, t, 0.08, 0.01, len)
      o.connect(g).connect(this.sfx)
      o.start(t)
      lfo.start(t)
      o.stop(t + len + 0.08)
      lfo.stop(t + len + 0.08)
    }
  }

  green() {
    if (!this.ctx) return
    const t = this.now
    this.tone(t, 'sine', 1568, 1568, 0.35, 0.16)
    this.tone(t + 0.05, 'sine', 2093, 2093, 0.4, 0.12)
    this.tone(t + 0.1, 'triangle', 3136, 3136, 0.3, 0.05)
  }

  /** A rising whoosh when a player catches fire. */
  ignite() {
    if (!this.ctx) return
    const t = this.now
    const f = this.noiseBurst(t, 0.9, 'bandpass', 300, 1.2, 0.28, this.sfx, 0.25)
    f.frequency.exponentialRampToValueAtTime(2800, t + 0.9)
    this.tone(t + 0.1, 'sawtooth', 110, 440, 0.8, 0.05)
    this.tone(t + 0.6, 'sine', 1760, 1760, 0.5, 0.06)
  }

  click() {
    if (!this.ctx) return
    this.tone(this.now, 'sine', 1300, 900, 0.04, 0.08)
  }

  confirm() {
    if (!this.ctx) return
    const t = this.now
    this.tone(t, 'triangle', 660, 660, 0.08, 0.1)
    this.tone(t + 0.07, 'triangle', 990, 990, 0.12, 0.1)
  }

  levelUp() {
    if (!this.ctx) return
    const t = this.now
    ;[523, 659, 784, 1046].forEach((f, i) => this.tone(t + i * 0.08, 'triangle', f, f, 0.25, 0.12))
  }

  // ---------------------------------------------------------------- crowd
  /**
   * Starts the crowd bed: a low rumble of the building, a babble loop, a roar layer that swells on big plays
   * and an applause loop. `level` is the bed gain (0.06 is about -38 dBFS).
   */
  startCrowd(level = 0.05) {
    this.crowdBase = level
    if (!this.ctx) return
    if (!this.crowd) {
      const c = this.ctx
      const input = c.createGain()
      input.connect(this.crowdBus)
      const mk = (v: number) => {
        const g = c.createGain()
        g.gain.value = v
        return g
      }
      const rumble = mk(0)
      const n = c.createBufferSource()
      n.buffer = this.noise
      n.loop = true
      n.playbackRate.value = 0.5
      const lp = c.createBiquadFilter()
      lp.type = 'lowpass'
      lp.frequency.value = 260
      n.connect(lp).connect(rumble).connect(input)
      n.start()
      const roarTone = c.createBiquadFilter()
      roarTone.type = 'peaking'
      roarTone.frequency.value = 1400
      roarTone.gain.value = 0
      const roar = mk(0)
      roar.connect(roarTone).connect(input)
      this.crowd = { input, walla: mk(0), roar, roarTone, applause: mk(0), rumble, started: new Set() }
      this.crowd.walla.connect(input)
      this.crowd.applause.connect(input)
    }
    this.attachCrowdLoops()
    this.applyCrowdBed(0.6)
  }

  /** Starts each loop of the bank once it has rendered (two decorrelated copies hide the loop point). */
  private attachCrowdLoops() {
    const cr = this.crowd
    if (!cr || !this.ctx) return
    const loop = (name: Clip, dest: GainNode, rates: number[]) => {
      const b = this.bank[name]
      if (!b || cr.started.has(name)) return
      cr.started.add(name)
      rates.forEach((r, i) => {
        const s = this.ctx!.createBufferSource()
        s.buffer = b
        s.loop = true
        s.playbackRate.value = r
        s.connect(dest)
        s.start(this.now, (i * b.duration * 0.43) % b.duration)
      })
    }
    loop('walla', cr.walla, [1, 0.97])
    loop('roar', cr.roar, [1, 0.955])
    loop('applause', cr.applause, [1, 1.04])
    this.applyCrowdBed(0.3)
  }

  /** Bed level from the base and the game's tension (a close game late gets loud and restless). */
  private applyCrowdBed(tc: number) {
    const cr = this.crowd
    if (!cr || !this.ctx) return
    const t = this.now
    const base = this.crowdBase
    const ten = this.tension
    const wallaReady = !!this.bank.walla
    cr.walla.gain.setTargetAtTime(base * (1 + ten * 0.8), t, tc)
    // without the babble the rumble carries the bed on its own
    cr.rumble.gain.setTargetAtTime(base * (wallaReady ? 0.9 : 2.2) * (1 + ten * 0.5), t, tc)
    cr.roar.gain.setTargetAtTime(base * ten * 1.6, t, tc)
  }

  setCrowdBase(level: number) {
    this.crowdBase = level
    this.applyCrowdBed(0.6)
  }

  /** 0..1: how much is riding on the moment; lifts the bed and the restless roar layer. */
  setTension(x: number) {
    const v = Math.max(0, Math.min(1, x))
    if (Math.abs(v - this.tension) < 0.02) return
    this.tension = v
    this.applyCrowdBed(1.2)
  }

  /** A crowd reaction: the roar swells, applause breaks out, the odd fan whistle on the biggest plays. */
  cheer(level = 1) {
    if (!this.ctx) return
    if (!this.crowd) this.startCrowd(this.crowdBase)
    const cr = this.crowd!
    const t = this.now
    const peak = db(-6) * level
    const g = cr.roar.gain
    g.cancelScheduledValues(t)
    g.setTargetAtTime(peak + this.crowdBase * this.tension * 1.6, t, 0.09)
    g.setTargetAtTime(this.crowdBase * this.tension * 1.6, t + 1.1 + level * 1.2, 0.8)
    cr.roarTone.gain.cancelScheduledValues(t)
    cr.roarTone.gain.setTargetAtTime(4 * level, t, 0.1)
    cr.roarTone.gain.setTargetAtTime(0, t + 1.5, 0.8)
    const a = cr.applause.gain
    a.cancelScheduledValues(t)
    a.setTargetAtTime(db(-10) * Math.min(1, 0.4 + level * 0.6), t + 0.15, 0.12)
    a.setTargetAtTime(0, t + 1.6 + level * 1.4, 0.6)
    if (!this.bank.roar) {
      // fallback while the bank renders: a bright noise swell
      const f = this.noiseBurst(t, 1.4 + level, 'bandpass', 1300, 0.6, 0.25 * level, cr.input, 0.12)
      f.frequency.setTargetAtTime(850, t + 1, 0.6)
    }
    if (level > 0.75) for (let i = 0; i < 3; i++) this.fanWhistle(t + 0.2 + Math.random() * 1.2)
  }

  private fanWhistle(t: number) {
    const f0 = rand(1900, 2900)
    const o = this.tone(t, 'sine', f0, f0 * rand(1.15, 1.4), rand(0.25, 0.55), 0.03, this.crowd?.input ?? this.crowdBus, 0.03)
    o.detune.value = rand(-30, 30)
  }

  /** Collective "ooooh": a near miss, a block, a crossover that drops someone. */
  ooh() {
    if (!this.ctx) return
    if (this.clip('ooh', db(-8))) return
    const ctx = this.ctx
    const t = this.now
    const f = ctx.createBiquadFilter()
    f.type = 'bandpass'
    f.Q.value = 3
    f.frequency.setValueAtTime(820, t)
    f.frequency.exponentialRampToValueAtTime(420, t + 1.1)
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(0.09, t + 0.18)
    g.gain.exponentialRampToValueAtTime(0.0001, t + 1.3)
    for (let i = 0; i < 9; i++) {
      const o = ctx.createOscillator()
      o.type = 'sawtooth'
      o.frequency.value = 170 + Math.random() * 120
      o.connect(f)
      o.start(t)
      o.stop(t + 1.4)
    }
    f.connect(g).connect(this.crowdBus)
  }

  /** Disappointed "awww" (the home side misses a big one). */
  aww() {
    if (this.ctx) this.clip('aww', db(-9))
  }

  /** Boos: a call against the home side, the visitors celebrating. */
  boo() {
    if (this.ctx) this.clip('boo', db(-10))
  }

  /** The building goes quiet (the home shooter at the line). */
  hush(on: boolean) {
    const cr = this.crowd
    if (!cr || !this.ctx) return
    const t = this.now
    cr.walla.gain.cancelScheduledValues(t)
    cr.rumble.gain.cancelScheduledValues(t)
    if (on) {
      cr.walla.gain.setTargetAtTime(this.crowdBase * 0.25, t, 0.35)
      cr.rumble.gain.setTargetAtTime(this.crowdBase * 0.4, t, 0.35)
      cr.roar.gain.setTargetAtTime(0, t, 0.3)
    } else this.applyCrowdBed(0.4)
  }

  /** "DE-FENSE!" (clap, clap) x reps, when the home side gets a stop in a big moment. */
  chantDefense(reps = 3) {
    if (!this.ctx || !this.bank.defense || this.now < this.chantUntil) return
    const t0 = this.now + 0.05
    const beat = 0.5
    for (let r = 0; r < reps; r++) {
      const t = t0 + r * beat * 4
      this.clip('defense', db(-7) * (0.8 + r * 0.1), { at: t, rate: 1 })
      this.clip('clap', db(-9), { at: t + beat * 2, rate: 1 })
      this.clip('clap', db(-9), { at: t + beat * 3, rate: 1 })
    }
    this.chantUntil = t0 + reps * beat * 4 + 2
  }

  /** The arena's "let's go" rhythm (clap clap, clap-clap-clap), led by the organ. */
  rhythmClap(reps = 2) {
    if (!this.ctx || !this.bank.clap || this.now < this.chantUntil) return
    const t0 = this.now + 0.05
    const beat = 0.46
    for (let r = 0; r < reps; r++) {
      const t = t0 + r * beat * 4
      for (const b of [0, 1, 2, 2.5, 3]) this.clip('clap', db(-9) * (0.85 + r * 0.08), { at: t + b * beat, rate: 1 })
    }
    this.chantUntil = t0 + reps * beat * 4 + 1.5
  }

  stopCrowd() {
    const cr = this.crowd
    if (!cr || !this.ctx) return
    const t = this.now
    for (const g of [cr.walla, cr.rumble, cr.roar, cr.applause]) {
      g.gain.cancelScheduledValues(t)
      g.gain.setTargetAtTime(0.0001, t, 0.3)
    }
  }

  /** Dips the crowd and music while the commentators talk (0 = none, 1 = full duck). */
  duck(amount: number) {
    if (!this.ctx) return
    const t = this.now
    const a = Math.max(0, Math.min(1, amount))
    const tc = a > 0 ? 0.12 : 0.45
    this.crowdDuck.gain.setTargetAtTime(1 - 0.45 * a, t, tc)
    this.musicDuck.gain.setTargetAtTime(1 - 0.6 * a, t, tc)
  }

  // ---------------------------------------------------------------- arena PA
  /** Hammond-style organ through the PA: drawbar harmonics with a Leslie wobble. */
  private organNote(t: number, midi: number, dur: number, vel = 1) {
    const ctx = this.ctx!
    const f = 440 * Math.pow(2, (midi - 69) / 12)
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.0001, t)
    g.gain.linearRampToValueAtTime(0.05 * vel, t + 0.012)
    g.gain.setValueAtTime(0.05 * vel, t + dur)
    g.gain.linearRampToValueAtTime(0.0001, t + dur + 0.06)
    const leslie = ctx.createOscillator()
    leslie.frequency.value = 6.4
    const lg = ctx.createGain()
    lg.gain.value = f * 0.004
    for (const [h, a] of [
      [1, 1],
      [2, 0.7],
      [3, 0.45],
      [4, 0.3],
      [6, 0.18],
      [8, 0.12],
    ]) {
      const o = ctx.createOscillator()
      o.frequency.value = f * h
      leslie.connect(lg).connect(o.frequency)
      const og = ctx.createGain()
      og.gain.value = a
      o.connect(og).connect(g)
      o.start(t)
      o.stop(t + dur + 0.1)
    }
    leslie.start(t)
    leslie.stop(t + dur + 0.1)
    g.connect(this.paBus)
  }

  /** The organ's "Charge!" (G C E G, E G) and the crowd answering. */
  organCharge() {
    if (!this.ctx) return
    const t = this.now + 0.05
    const s = 0.15
    const notes: [number, number, number][] = [
      [67, 0, s * 0.85],
      [72, s, s * 0.85],
      [76, s * 2, s * 0.85],
      [79, s * 3, s * 1.6],
      [76, s * 5, s * 0.85],
      [79, s * 6, s * 4],
    ]
    for (const [m, at, d] of notes) {
      this.organNote(t + at, m, d)
      this.organNote(t + at, m - 12, d, 0.6)
    }
    window.setTimeout(() => this.cheer(0.55), (s * 6 + 0.15) * 1000)
  }

  /** A climbing chromatic organ riff for the dead ball between possessions. */
  organRiff() {
    if (!this.ctx) return
    const t = this.now + 0.05
    const s = 0.13
    const seq = [60, 61, 62, 63, 64, 65, 66, 67]
    seq.forEach((m, i) => this.organNote(t + i * s, m + 7, s * 0.8, 0.8))
    this.organNote(t + seq.length * s, 79, s * 3, 1)
  }

  /** Stadium air horn: detuned saws through a hard clipper, three blasts. */
  airHorn() {
    if (!this.ctx) return
    const ctx = this.ctx
    const shaper = ctx.createWaveShaper()
    const curve = new Float32Array(1024)
    for (let i = 0; i < 1024; i++) {
      const x = (i / 1023) * 2 - 1
      curve[i] = Math.tanh(x * 3.2)
    }
    shaper.curve = curve
    const bp = ctx.createBiquadFilter()
    bp.type = 'lowpass'
    bp.frequency.value = 2400
    const out = ctx.createGain()
    out.gain.value = 0.11
    shaper.connect(bp).connect(out).connect(this.paBus)
    const blasts: [number, number][] = [
      [0, 0.3],
      [0.38, 0.3],
      [0.76, 0.85],
    ]
    for (const [at, len] of blasts) {
      const t = this.now + 0.05 + at
      const g = ctx.createGain()
      g.gain.setValueAtTime(0.0001, t)
      g.gain.linearRampToValueAtTime(0.5, t + 0.02)
      g.gain.setValueAtTime(0.5, t + len)
      g.gain.linearRampToValueAtTime(0.0001, t + len + 0.05)
      g.connect(shaper)
      for (const f of [349, 352.5, 440, 443]) {
        const o = ctx.createOscillator()
        o.type = 'sawtooth'
        o.frequency.setValueAtTime(f * 1.02, t)
        o.frequency.exponentialRampToValueAtTime(f, t + 0.08)
        o.connect(g)
        o.start(t)
        o.stop(t + len + 0.1)
      }
    }
  }

  // ---------------------------------------------------------------- menu music
  /** A laid-back boom-bap loop for menus. */
  startMusic() {
    if (!this.ctx || this.musicTimer !== null) return
    this.musicBus.gain.cancelScheduledValues(this.now)
    this.musicBus.gain.setTargetAtTime(this.muted ? 0 : this.volumes.music * 0.55, this.now, 0.3)
    this.nextNoteTime = this.now + 0.1
    this.musicStep = 0
    this.musicTimer = window.setInterval(() => this.schedule(), 60)
  }

  stopMusic() {
    if (this.musicTimer !== null) {
      window.clearInterval(this.musicTimer)
      this.musicTimer = null
    }
  }

  private schedule() {
    if (!this.ctx) return
    const bpm = 88
    const sixteenth = 60 / bpm / 4
    const chords = [
      [57, 60, 64],
      [53, 57, 60],
      [48, 52, 55],
      [55, 59, 62],
    ]
    const bassLine = [45, 41, 36, 43]
    const midi = (n: number) => 440 * Math.pow(2, (n - 69) / 12)
    while (this.nextNoteTime < this.now + 0.25) {
      const t = this.nextNoteTime
      const s = this.musicStep % 16
      const bar = Math.floor(this.musicStep / 16) % 4
      const out = this.musicBus
      if (s === 0 || s === 7 || s === 10) this.tone(t, 'sine', 120, 42, 0.22, 0.5, out)
      if (s === 4 || s === 12) {
        this.noiseBurst(t, 0.16, 'bandpass', 1800, 0.7, 0.22, out)
        this.tone(t, 'triangle', 220, 160, 0.08, 0.12, out)
      }
      if (s % 2 === 0) this.noiseBurst(t, s % 4 === 2 ? 0.06 : 0.03, 'highpass', 8000, 0.7, s % 4 === 2 ? 0.07 : 0.045, out)
      if (s === 0 || s === 6 || s === 11) this.tone(t, 'triangle', midi(bassLine[bar]), midi(bassLine[bar]), 0.32, 0.2, out)
      if (s === 0 || s === 8) {
        for (const n of chords[bar]) {
          const o = this.tone(t, 'sawtooth', midi(n + 12), midi(n + 12), 0.9, 0.028, out, 0.06)
          o.detune.value = (Math.random() - 0.5) * 12
        }
      }
      this.nextNoteTime += sixteenth * (s % 2 === 0 ? 1.08 : 0.92)
      this.musicStep++
    }
  }

  setMuted(m: boolean) {
    this.muted = m
    this.applyVolumes()
  }
}
