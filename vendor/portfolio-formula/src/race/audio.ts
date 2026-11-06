/**
 * Synthesised engine note: two detuned oscillators through a soft clipper and
 * a low-pass that opens with revs, plus road/wind noise that grows with speed.
 * Created lazily from a user gesture (the Start button) so autoplay rules are met.
 */

type Nodes = {
  ctx: AudioContext
  master: GainNode
  engine: GainNode
  filter: BiquadFilterNode
  oscA: OscillatorNode
  oscB: OscillatorNode
  noise: GainNode
  noiseFilter: BiquadFilterNode
  thud: AudioBuffer
}

function clipCurve(amount: number) {
  const n = 1024
  const curve = new Float32Array(n)
  for (let i = 0; i < n; i++) {
    const x = (i / (n - 1)) * 2 - 1
    curve[i] = Math.tanh(x * amount) / Math.tanh(amount)
  }
  return curve
}

class EngineSound {
  private nodes: Nodes | null = null
  private enabled = true
  private active = false

  /** Must be called from a user gesture. */
  start() {
    if (this.nodes) {
      void this.nodes.ctx.resume()
      return
    }
    const AC =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext
    if (!AC) return
    try {
      const ctx = new AC()
      const master = ctx.createGain()
      master.gain.value = 0
      master.connect(ctx.destination)

      const engine = ctx.createGain()
      engine.gain.value = 0.2
      const filter = ctx.createBiquadFilter()
      filter.type = "lowpass"
      filter.frequency.value = 600
      filter.Q.value = 2.5
      const shaper = ctx.createWaveShaper()
      shaper.curve = clipCurve(2.4)
      shaper.oversample = "2x"
      const oscA = ctx.createOscillator()
      oscA.type = "sawtooth"
      const oscB = ctx.createOscillator()
      oscB.type = "square"
      const subGain = ctx.createGain()
      subGain.gain.value = 0.4
      oscA.connect(shaper)
      oscB.connect(subGain).connect(shaper)
      shaper.connect(filter).connect(engine).connect(master)

      const length = ctx.sampleRate * 2
      const buffer = ctx.createBuffer(1, length, ctx.sampleRate)
      const data = buffer.getChannelData(0)
      for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1
      const source = ctx.createBufferSource()
      source.buffer = buffer
      source.loop = true
      const noiseFilter = ctx.createBiquadFilter()
      noiseFilter.type = "bandpass"
      noiseFilter.frequency.value = 700
      noiseFilter.Q.value = 0.6
      const noise = ctx.createGain()
      noise.gain.value = 0
      source.connect(noiseFilter).connect(noise).connect(master)

      const thudLength = Math.floor(ctx.sampleRate * 0.25)
      const thud = ctx.createBuffer(1, thudLength, ctx.sampleRate)
      const td = thud.getChannelData(0)
      for (let i = 0; i < thudLength; i++)
        td[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / thudLength, 3)

      oscA.start()
      oscB.start()
      source.start()
      this.nodes = {
        ctx,
        master,
        engine,
        filter,
        oscA,
        oscB,
        noise,
        noiseFilter,
        thud,
      }
    } catch {
      this.nodes = null
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled
    if (!enabled) this.silence()
  }

  /** Engine on (racing) or off (menus, pause). */
  setActive(active: boolean) {
    this.active = active
    if (!active) this.silence()
  }

  update(rpm: number, throttle: number, speed01: number) {
    const n = this.nodes
    if (!n || !this.enabled || !this.active) return
    const t = n.ctx.currentTime
    const f = 62 + rpm * 300
    n.oscA.frequency.setTargetAtTime(f, t, 0.025)
    n.oscB.frequency.setTargetAtTime(f * 0.5 + 1.5, t, 0.025)
    n.filter.frequency.setTargetAtTime(
      420 + rpm * 2200 + throttle * 900,
      t,
      0.04,
    )
    n.engine.gain.setTargetAtTime(0.13 + throttle * 0.17, t, 0.05)
    n.noise.gain.setTargetAtTime(0.02 + speed01 * 0.1, t, 0.1)
    n.noiseFilter.frequency.setTargetAtTime(500 + speed01 * 1400, t, 0.1)
    n.master.gain.setTargetAtTime(0.22, t, 0.08)
  }

  /** Barrier impact. */
  impact(strength: number) {
    const n = this.nodes
    if (!n || !this.enabled || !this.active) return
    const source = n.ctx.createBufferSource()
    source.buffer = n.thud
    const filter = n.ctx.createBiquadFilter()
    filter.type = "lowpass"
    filter.frequency.value = 380
    const gain = n.ctx.createGain()
    gain.gain.value = Math.min(1, 0.25 + strength / 20)
    source.connect(filter).connect(gain).connect(n.ctx.destination)
    source.start()
  }

  private silence() {
    const n = this.nodes
    if (!n) return
    n.master.gain.setTargetAtTime(0, n.ctx.currentTime, 0.06)
  }
}

export const engineSound = new EngineSound()
