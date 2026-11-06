// Procedural WebAudio: rifle reports with valley echo, mechanics, impacts, ambience, and score.
import type { Surface } from './collision.ts'
import type { RifleSpec, TimePresetId } from './data.ts'

export type UiSound = 'hover' | 'click' | 'confirm' | 'back' | 'unlock' | 'levelup' | 'lock' | 'warning' | 'round'
export type MusicMood = 'menu' | 'mission' | 'tension' | 'none'

function makeNoise(ctx: AudioContext, seconds: number): AudioBuffer {
  const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * seconds), ctx.sampleRate)
  const data = buffer.getChannelData(0)
  let brown = 0
  for (let i = 0; i < data.length; i += 1) {
    const white = Math.random() * 2 - 1
    brown = (brown + white * 0.02) / 1.02
    data[i] = white * 0.75 + brown * 2.2
  }
  return buffer
}

/** A valley impulse response: diffuse decay plus discrete slap-back echoes off the ridges. */
function makeValley(ctx: AudioContext): AudioBuffer {
  const seconds = 4.2
  const length = Math.floor(ctx.sampleRate * seconds)
  const buffer = ctx.createBuffer(2, length, ctx.sampleRate)
  const echoes = [
    [0.38, 0.55],
    [0.86, 0.38],
    [1.45, 0.26],
    [2.2, 0.16],
    [3.0, 0.08],
  ]
  for (let channel = 0; channel < 2; channel += 1) {
    const data = buffer.getChannelData(channel)
    let low = 0
    for (let i = 0; i < length; i += 1) {
      const t = i / ctx.sampleRate
      const white = Math.random() * 2 - 1
      low += (white - low) * 0.06
      let v = low * Math.exp(-t * 2.4) * 0.5
      for (const [at, gain] of echoes) {
        const local = t - at - channel * 0.017
        if (local > 0 && local < 0.5) v += low * gain * Math.exp(-local * 7) * (1 - Math.exp(-local * 60))
      }
      data[i] = v
    }
  }
  return buffer
}

export class AudioEngine {
  private ctx: AudioContext | null = null
  private master!: GainNode
  private sfx!: GainNode
  private musicBus!: GainNode
  private ambienceBus!: GainNode
  private valley!: ConvolverNode
  private valleySend!: GainNode
  private noise!: AudioBuffer
  private wind: { source: AudioBufferSourceNode; filter: BiquadFilterNode; gain: GainNode; lfo: OscillatorNode } | null = null
  private ambienceTimer = 0
  private preset: TimePresetId = 'day'
  private windSpeed = 1
  private musicMood: MusicMood = 'none'
  private musicVoices: Array<{ stop: () => void }> = []
  private musicTimer = 0
  private chordIndex = 0
  private heartbeatTimer = 0
  private heartbeatRate = 0
  private volumes = { master: 0.8, sfx: 0.9, music: 0.45 }
  private wantMood: MusicMood = 'none'
  private wantAmbience: { preset: TimePresetId | null; wind: number } | null = null

  /** Creates or resumes the context. Must be called from a user gesture first. */
  unlock(): void {
    if (!this.ctx) {
      const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!Ctor) return
      const ctx = new Ctor()
      this.ctx = ctx
      this.master = ctx.createGain()
      this.sfx = ctx.createGain()
      this.musicBus = ctx.createGain()
      this.ambienceBus = ctx.createGain()
      const compressor = ctx.createDynamicsCompressor()
      compressor.threshold.value = -14
      compressor.ratio.value = 4
      compressor.attack.value = 0.002
      compressor.release.value = 0.25
      this.sfx.connect(this.master)
      this.musicBus.connect(this.master)
      this.ambienceBus.connect(this.sfx)
      this.master.connect(compressor).connect(ctx.destination)
      this.valley = ctx.createConvolver()
      this.valley.buffer = makeValley(ctx)
      this.valleySend = ctx.createGain()
      this.valleySend.gain.value = 0.9
      this.valleySend.connect(this.valley).connect(this.sfx)
      this.noise = makeNoise(ctx, 2.5)
      this.applyVolumes()
      // Replay whatever ambience and score were requested before audio was allowed.
      const mood = this.wantMood
      this.musicMood = 'none'
      this.setMusic(mood)
      if (this.wantAmbience) this.setAmbience(this.wantAmbience.preset, this.wantAmbience.wind)
    }
    if (this.ctx.state === 'suspended') void this.ctx.resume()
  }

  get ready(): boolean {
    return this.ctx !== null && this.ctx.state === 'running'
  }

  setVolumes(master: number, sfx: number, music: number): void {
    this.volumes = { master, sfx, music }
    this.applyVolumes()
  }

  private applyVolumes(): void {
    if (!this.ctx) return
    const now = this.ctx.currentTime
    this.master.gain.setTargetAtTime(this.volumes.master, now, 0.05)
    this.sfx.gain.setTargetAtTime(this.volumes.sfx, now, 0.05)
    this.musicBus.gain.setTargetAtTime(this.volumes.music * 0.55, now, 0.2)
  }

  // -------------------------------------------------------------------------
  // Building blocks

  private noiseBurst(at: number, duration: number, filter: BiquadFilterType, frequency: number, q: number, gain: number, destination: AudioNode, decay = duration, pan = 0): void {
    const ctx = this.ctx!
    const source = ctx.createBufferSource()
    source.buffer = this.noise
    source.playbackRate.value = 0.9 + Math.random() * 0.2
    const biquad = ctx.createBiquadFilter()
    biquad.type = filter
    biquad.frequency.value = frequency
    biquad.Q.value = q
    const envelope = ctx.createGain()
    envelope.gain.setValueAtTime(0, at)
    envelope.gain.linearRampToValueAtTime(gain, at + 0.002)
    envelope.gain.exponentialRampToValueAtTime(0.0008, at + Math.max(0.01, decay))
    let node: AudioNode = envelope
    if (pan !== 0) {
      const panner = ctx.createStereoPanner()
      panner.pan.value = pan
      envelope.connect(panner)
      node = panner
    }
    source.connect(biquad).connect(envelope)
    node.connect(destination)
    source.start(at, Math.random() * 1.5)
    source.stop(at + duration + 0.05)
  }

  private tone(at: number, type: OscillatorType, from: number, to: number, duration: number, gain: number, destination: AudioNode, pan = 0): void {
    const ctx = this.ctx!
    const osc = ctx.createOscillator()
    osc.type = type
    osc.frequency.setValueAtTime(from, at)
    osc.frequency.exponentialRampToValueAtTime(Math.max(1, to), at + duration)
    const envelope = ctx.createGain()
    envelope.gain.setValueAtTime(0, at)
    envelope.gain.linearRampToValueAtTime(gain, at + 0.004)
    envelope.gain.exponentialRampToValueAtTime(0.0006, at + duration)
    let node: AudioNode = envelope
    if (pan !== 0) {
      const panner = ctx.createStereoPanner()
      panner.pan.value = pan
      envelope.connect(panner)
      node = panner
    }
    osc.connect(envelope)
    node.connect(destination)
    osc.start(at)
    osc.stop(at + duration + 0.05)
  }

  private now(delay = 0): number {
    return this.ctx!.currentTime + delay
  }

  // -------------------------------------------------------------------------
  // Weapons

  shot(rifle: RifleSpec): void {
    if (!this.ctx) return
    const t = this.now()
    if (rifle.suppressed) {
      this.noiseBurst(t, 0.09, 'bandpass', 1300, 0.9, 0.9, this.sfx, 0.08)
      this.noiseBurst(t, 0.04, 'highpass', 4200, 0.7, 0.35, this.sfx, 0.03)
      this.tone(t, 'sine', 140, 60, 0.12, 0.45, this.sfx)
      this.noiseBurst(t + 0.01, 0.3, 'lowpass', 700, 0.6, 0.18, this.valleySend, 0.25)
      return
    }
    const heavy = rifle.loudness > 1.3
    const body = heavy ? 520 : 820
    this.noiseBurst(t, 0.03, 'highpass', 2600, 0.6, 1.0, this.sfx, 0.02)
    this.noiseBurst(t, heavy ? 0.6 : 0.42, 'lowpass', body, 0.7, heavy ? 1.6 : 1.25, this.sfx, heavy ? 0.5 : 0.34)
    this.tone(t, 'sine', heavy ? 95 : 125, heavy ? 28 : 42, heavy ? 0.4 : 0.26, heavy ? 1.4 : 1.0, this.sfx)
    this.tone(t, 'triangle', heavy ? 60 : 80, 30, heavy ? 0.7 : 0.45, heavy ? 0.6 : 0.35, this.sfx)
    // Valley echo.
    this.noiseBurst(t + 0.01, 0.5, 'lowpass', heavy ? 900 : 1200, 0.5, heavy ? 1.3 : 1.0, this.valleySend, 0.45)
  }

  dryFire(): void {
    if (!this.ctx) return
    this.noiseBurst(this.now(), 0.02, 'highpass', 5000, 1, 0.3, this.sfx, 0.015)
  }

  bolt(action: RifleSpec['action'], duration: number): void {
    if (!this.ctx) return
    const t = this.now()
    const click = (at: number, f: number, gain: number) => {
      this.noiseBurst(at, 0.025, 'bandpass', f, 3, gain, this.sfx, 0.02, 0.15)
      this.tone(at, 'square', f * 0.9, f * 0.7, 0.03, gain * 0.12, this.sfx, 0.15)
    }
    if (action === 'semi') {
      click(t + 0.02, 2600, 0.35)
      return
    }
    click(t + duration * 0.12, 2400, 0.4)
    this.noiseBurst(t + duration * 0.25, 0.14, 'bandpass', 2200, 1.6, 0.35, this.sfx, 0.13, 0.15)
    click(t + duration * 0.43, 3200, 0.3)
    this.noiseBurst(t + duration * 0.5, 0.12, 'bandpass', 1800, 1.6, 0.32, this.sfx, 0.11, 0.15)
    click(t + duration * 0.68, 2000, 0.45)
    click(t + duration * 0.82, 2800, 0.35)
  }

  reload(duration: number): void {
    if (!this.ctx) return
    const t = this.now()
    this.noiseBurst(t + duration * 0.12, 0.04, 'bandpass', 2600, 2, 0.35, this.sfx, 0.03)
    this.noiseBurst(t + duration * 0.25, 0.12, 'lowpass', 700, 1, 0.4, this.sfx, 0.1)
    this.noiseBurst(t + duration * 0.62, 0.06, 'bandpass', 1900, 2, 0.45, this.sfx, 0.05)
    this.noiseBurst(t + duration * 0.7, 0.04, 'bandpass', 3100, 2, 0.4, this.sfx, 0.03)
  }

  click(kind: 'zoom' | 'zero' | 'range' | 'thermal'): void {
    if (!this.ctx) return
    const t = this.now()
    if (kind === 'range') {
      this.tone(t, 'sine', 2400, 2400, 0.06, 0.08, this.sfx)
      this.tone(t + 0.08, 'sine', 3200, 3200, 0.05, 0.06, this.sfx)
      return
    }
    if (kind === 'thermal') {
      this.tone(t, 'sawtooth', 120, 900, 0.25, 0.05, this.sfx)
      return
    }
    this.noiseBurst(t, 0.02, 'bandpass', kind === 'zoom' ? 3400 : 2600, 4, 0.22, this.sfx, 0.015)
  }

  // -------------------------------------------------------------------------
  // Ballistic feedback

  /** Distant impact heard after the bullet's flight and the sound's return trip. */
  impact(surface: Surface | 'flesh', distance: number, delay: number, pan = 0): void {
    if (!this.ctx) return
    const t = this.now(delay)
    const level = Math.min(1, 220 / Math.max(60, distance))
    if (surface === 'flesh') {
      this.noiseBurst(t, 0.12, 'lowpass', 520, 1, 0.9 * level, this.sfx, 0.1, pan)
      this.tone(t, 'sine', 160, 70, 0.12, 0.6 * level, this.sfx, pan)
      return
    }
    if (surface === 'metal') {
      this.tone(t, 'sine', 1850, 1700, 0.5, 0.3 * level, this.sfx, pan)
      this.tone(t, 'sine', 2770, 2600, 0.35, 0.15 * level, this.sfx, pan)
    }
    if (surface === 'glass') this.noiseBurst(t, 0.3, 'highpass', 4000, 0.8, 0.4 * level, this.sfx, 0.28, pan)
    this.noiseBurst(t, 0.16, 'lowpass', surface === 'wood' ? 900 : 380, 1, 0.75 * level, this.sfx, 0.14, pan)
  }

  hitConfirm(kind: 'hit' | 'kill' | 'headshot' | 'armor'): void {
    if (!this.ctx) return
    const t = this.now()
    if (kind === 'armor') {
      this.tone(t, 'square', 700, 500, 0.08, 0.06, this.sfx)
      return
    }
    this.tone(t, 'sine', 1250, 1150, 0.05, 0.12, this.sfx)
    if (kind !== 'hit') {
      this.tone(t + 0.07, 'sine', kind === 'headshot' ? 1900 : 1500, kind === 'headshot' ? 1850 : 1400, kind === 'headshot' ? 0.32 : 0.12, kind === 'headshot' ? 0.12 : 0.1, this.sfx)
      this.tone(t + 0.05, 'sine', 90, 45, 0.28, 0.35, this.sfx)
    }
  }

  /** Supersonic crack of a round passing close to the player, then the distant report. */
  incoming(distance: number, hit: boolean, heavy: boolean, pan = 0): void {
    if (!this.ctx) return
    const flight = distance / 800
    const t = this.now(flight)
    this.noiseBurst(t, 0.03, 'highpass', 3000, 0.7, hit ? 1.0 : 0.85, this.sfx, 0.025, pan)
    if (!hit) this.noiseBurst(t + 0.005, 0.18, 'bandpass', 2200, 1.4, 0.25, this.sfx, 0.16, pan)
    const report = this.now(distance / 343)
    this.noiseBurst(report, 0.5, 'lowpass', heavy ? 600 : 900, 0.6, heavy ? 0.55 : 0.4, this.sfx, 0.45, pan)
    this.noiseBurst(report, 0.4, 'lowpass', 700, 0.5, 0.35, this.valleySend, 0.4)
  }

  /** Air rush for the bullet camera. */
  whoosh(duration: number): void {
    if (!this.ctx) return
    const ctx = this.ctx
    const t = this.now()
    const source = ctx.createBufferSource()
    source.buffer = this.noise
    source.loop = true
    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.Q.value = 1.2
    filter.frequency.setValueAtTime(500, t)
    filter.frequency.exponentialRampToValueAtTime(1800, t + duration)
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0, t)
    gain.gain.linearRampToValueAtTime(0.35, t + 0.25)
    gain.gain.linearRampToValueAtTime(0.0001, t + duration)
    source.connect(filter).connect(gain).connect(this.sfx)
    source.start(t)
    source.stop(t + duration + 0.1)
    this.tone(t, 'sine', 70, 40, duration, 0.25, this.sfx)
  }

  playerHit(): void {
    if (!this.ctx) return
    const t = this.now()
    this.noiseBurst(t, 0.2, 'lowpass', 300, 1, 1.2, this.sfx, 0.18)
    this.tone(t, 'sine', 4200, 4100, 1.8, 0.05, this.sfx)
  }

  breath(inhale: boolean): void {
    if (!this.ctx) return
    const ctx = this.ctx
    const t = this.now()
    const source = ctx.createBufferSource()
    source.buffer = this.noise
    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.value = inhale ? 900 : 650
    filter.Q.value = 0.8
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0, t)
    gain.gain.linearRampToValueAtTime(inhale ? 0.12 : 0.16, t + (inhale ? 0.35 : 0.08))
    gain.gain.exponentialRampToValueAtTime(0.0005, t + (inhale ? 0.6 : 0.9))
    source.connect(filter).connect(gain).connect(this.sfx)
    source.start(t, Math.random())
    source.stop(t + 1)
  }

  setHeartbeat(rate: number): void {
    this.heartbeatRate = rate
  }

  // -------------------------------------------------------------------------
  // Interface

  ui(kind: UiSound): void {
    if (!this.ctx) return
    const t = this.now()
    switch (kind) {
      case 'hover':
        this.tone(t, 'sine', 2300, 2200, 0.025, 0.025, this.sfx)
        break
      case 'click':
        this.noiseBurst(t, 0.02, 'bandpass', 3000, 3, 0.15, this.sfx, 0.015)
        this.tone(t, 'sine', 1400, 1300, 0.05, 0.06, this.sfx)
        break
      case 'confirm':
        this.tone(t, 'sine', 880, 880, 0.09, 0.08, this.sfx)
        this.tone(t + 0.08, 'sine', 1320, 1320, 0.16, 0.08, this.sfx)
        break
      case 'back':
        this.tone(t, 'sine', 1100, 1100, 0.07, 0.06, this.sfx)
        this.tone(t + 0.07, 'sine', 740, 740, 0.12, 0.06, this.sfx)
        break
      case 'unlock':
        ;[660, 880, 1320, 1760].forEach((f, i) => this.tone(t + i * 0.07, 'triangle', f, f, 0.35, 0.06, this.sfx))
        break
      case 'levelup':
        ;[392, 523, 659, 784].forEach((f, i) => {
          this.tone(t + i * 0.09, 'sawtooth', f, f, 1.2, 0.03, this.musicBus)
          this.tone(t + i * 0.09, 'triangle', f * 2, f * 2, 0.9, 0.04, this.sfx)
        })
        break
      case 'lock':
        this.tone(t, 'square', 980, 980, 0.07, 0.03, this.sfx)
        break
      case 'warning':
        this.tone(t, 'square', 1400, 1400, 0.06, 0.04, this.sfx)
        this.tone(t + 0.09, 'square', 1400, 1400, 0.06, 0.04, this.sfx)
        break
      case 'round':
        this.tone(t, 'sine', 196, 196, 1.4, 0.18, this.sfx)
        this.noiseBurst(t, 0.8, 'lowpass', 300, 0.7, 0.3, this.valleySend, 0.7)
        break
    }
  }

  // -------------------------------------------------------------------------
  // Ambience and music

  setAmbience(preset: TimePresetId | null, windSpeed: number): void {
    this.wantAmbience = { preset, wind: windSpeed }
    if (!this.ctx) return
    const ctx = this.ctx
    this.preset = preset ?? 'day'
    this.windSpeed = windSpeed
    if (!preset) {
      if (this.wind) {
        this.wind.gain.gain.setTargetAtTime(0, ctx.currentTime, 0.4)
      }
      return
    }
    if (!this.wind) {
      const source = ctx.createBufferSource()
      source.buffer = this.noise
      source.loop = true
      const filter = ctx.createBiquadFilter()
      filter.type = 'bandpass'
      filter.frequency.value = 380
      filter.Q.value = 0.5
      const gain = ctx.createGain()
      gain.gain.value = 0
      const lfo = ctx.createOscillator()
      lfo.frequency.value = 0.09
      const lfoGain = ctx.createGain()
      lfoGain.gain.value = 140
      lfo.connect(lfoGain).connect(filter.frequency)
      source.connect(filter).connect(gain).connect(this.ambienceBus)
      source.start()
      lfo.start()
      this.wind = { source, filter, gain, lfo }
    }
    this.wind.gain.gain.setTargetAtTime(0.05 + Math.min(1, windSpeed / 6) * 0.16, ctx.currentTime, 0.8)
  }

  setMusic(mood: MusicMood): void {
    this.wantMood = mood
    if (!this.ctx || mood === this.musicMood) return
    this.musicMood = mood
    for (const voice of this.musicVoices) voice.stop()
    this.musicVoices = []
    this.musicTimer = 0
    if (mood === 'none') return
    // Sub drone underneath every mood.
    const ctx = this.ctx
    const drone = ctx.createOscillator()
    drone.type = 'sine'
    drone.frequency.value = mood === 'tension' ? 49 : 55
    const droneGain = ctx.createGain()
    droneGain.gain.value = 0
    droneGain.gain.setTargetAtTime(mood === 'menu' ? 0.22 : 0.16, ctx.currentTime, 1.5)
    drone.connect(droneGain).connect(this.musicBus)
    drone.start()
    this.musicVoices.push({
      stop: () => {
        droneGain.gain.setTargetAtTime(0, ctx.currentTime, 0.6)
        drone.stop(ctx.currentTime + 3)
      },
    })
  }

  private pad(frequencies: number[], duration: number, brightness: number, gain: number): void {
    const ctx = this.ctx!
    const t = ctx.currentTime
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(brightness * 0.6, t)
    filter.frequency.linearRampToValueAtTime(brightness, t + duration * 0.5)
    filter.frequency.linearRampToValueAtTime(brightness * 0.5, t + duration)
    filter.Q.value = 0.7
    const envelope = ctx.createGain()
    envelope.gain.setValueAtTime(0, t)
    envelope.gain.linearRampToValueAtTime(gain, t + duration * 0.35)
    envelope.gain.linearRampToValueAtTime(0, t + duration)
    filter.connect(envelope).connect(this.musicBus)
    for (const f of frequencies) {
      for (const detune of [-7, 6]) {
        const osc = ctx.createOscillator()
        osc.type = 'sawtooth'
        osc.frequency.value = f
        osc.detune.value = detune
        osc.connect(filter)
        osc.start(t)
        osc.stop(t + duration + 0.1)
      }
    }
  }

  private pulse(frequency: number, at: number, gain: number): void {
    const ctx = this.ctx!
    const osc = ctx.createOscillator()
    osc.type = 'sawtooth'
    osc.frequency.value = frequency
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(900, at)
    filter.frequency.exponentialRampToValueAtTime(180, at + 0.22)
    const envelope = ctx.createGain()
    envelope.gain.setValueAtTime(0, at)
    envelope.gain.linearRampToValueAtTime(gain, at + 0.01)
    envelope.gain.exponentialRampToValueAtTime(0.0005, at + 0.24)
    osc.connect(filter).connect(envelope).connect(this.musicBus)
    osc.start(at)
    osc.stop(at + 0.3)
  }

  /** Drives scheduled music phrases, heartbeat, and ambient life. Call every frame. */
  update(dt: number): void {
    if (!this.ctx || this.ctx.state !== 'running') return
    const ctx = this.ctx
    if (this.musicMood !== 'none') {
      this.musicTimer -= dt
      if (this.musicTimer <= 0) {
        const chords = [
          [110, 130.81, 164.81],
          [87.31, 130.81, 174.61],
          [98, 146.83, 196],
          [82.41, 123.47, 164.81],
        ]
        const chord = chords[this.chordIndex % chords.length]
        this.chordIndex += 1
        if (this.musicMood === 'menu') {
          this.pad(chord, 9.5, 900, 0.05)
          this.musicTimer = 8
        } else if (this.musicMood === 'mission') {
          this.pad([chord[0] / 2, chord[1] / 2], 12, 420, 0.035)
          this.musicTimer = 11
        } else {
          const start = ctx.currentTime
          for (let i = 0; i < 16; i += 1) this.pulse(chord[0] / 2, start + i * 0.25, i % 4 === 0 ? 0.06 : 0.035)
          this.pad([chord[0], chord[2]], 4.2, 600, 0.03)
          this.musicTimer = 4
        }
      }
    }
    if (this.heartbeatRate > 0) {
      this.heartbeatTimer -= dt
      if (this.heartbeatTimer <= 0) {
        const t = ctx.currentTime
        this.tone(t, 'sine', 62, 40, 0.16, 0.5, this.sfx)
        this.tone(t + 0.22, 'sine', 58, 38, 0.14, 0.35, this.sfx)
        this.heartbeatTimer = 60 / this.heartbeatRate
      }
    }
    if (this.wind) {
      this.ambienceTimer -= dt
      if (this.ambienceTimer <= 0) {
        const t = ctx.currentTime
        if (this.preset === 'night') {
          for (let i = 0; i < 6; i += 1) this.tone(t + i * 0.06, 'sine', 4600, 4500, 0.035, 0.012, this.ambienceBus, (Math.random() - 0.5) * 1.4)
          this.ambienceTimer = 0.9 + Math.random() * 2.2
        } else if (this.preset !== 'overcast') {
          const base = 2600 + Math.random() * 2200
          const pan = (Math.random() - 0.5) * 1.6
          for (let i = 0; i < 2 + Math.floor(Math.random() * 3); i += 1) this.tone(t + i * 0.13, 'sine', base, base * (1.2 + Math.random() * 0.3), 0.08, 0.018, this.ambienceBus, pan)
          this.ambienceTimer = 2.5 + Math.random() * 6
        } else {
          this.ambienceTimer = 5
        }
      }
    }
  }

  stopLoops(): void {
    this.setHeartbeat(0)
    this.setMusic('none')
  }
}
