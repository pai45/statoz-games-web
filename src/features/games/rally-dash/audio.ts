import type { Car, Medal, RaceEvent, Setup } from './contracts';

const GEARS = [0, 13, 22, 31, 40, 60];
/** Original WebAudio synthesis only: engine, surface noise and short cues. No recordings. */
export class RallyAudio {
    private ctx: AudioContext | null = null;
    private master: GainNode | null = null;
    private engineGain: GainNode | null = null;
    private engineFilter: BiquadFilterNode | null = null;
    private oscA: OscillatorNode | null = null;
    private oscB: OscillatorNode | null = null;
    private noise: AudioBuffer | null = null;
    private surfaceGain: GainNode | null = null;
    private surfaceFilter: BiquadFilterNode | null = null;
    private skidGain: GainNode | null = null;
    private effects: GainNode | null = null;
    private settings: Pick<Setup, 'muted' | 'engineVolume' | 'effectsVolume' | 'noteSounds'> = { muted: false, engineVolume: .45, effectsVolume: .6, noteSounds: true };
    start() {
        try {
            if (!this.ctx) {
                const ctx = this.ctx = new AudioContext(), rate = ctx.sampleRate;
                this.master = ctx.createGain();
                this.master.connect(ctx.destination);
                this.noise = ctx.createBuffer(1, rate, rate);
                const data = this.noise.getChannelData(0);
                let seed = 17;
                for (let i = 0; i < data.length; i++) { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; data[i] = seed / 2147483648 - 1; }
                this.engineGain = ctx.createGain();
                this.engineGain.gain.value = 0;
                this.engineFilter = ctx.createBiquadFilter();
                this.engineFilter.type = 'lowpass';
                this.engineFilter.frequency.value = 700;
                this.engineFilter.Q.value = 3;
                this.oscA = ctx.createOscillator();
                this.oscA.type = 'sawtooth';
                this.oscB = ctx.createOscillator();
                this.oscB.type = 'square';
                this.oscB.detune.value = -1200;
                const mixB = ctx.createGain();
                mixB.gain.value = .45;
                this.oscA.connect(this.engineFilter);
                this.oscB.connect(mixB).connect(this.engineFilter);
                this.engineFilter.connect(this.engineGain).connect(this.master);
                this.oscA.start();
                this.oscB.start();
                const loop = ctx.createBufferSource();
                loop.buffer = this.noise;
                loop.loop = true;
                this.surfaceFilter = ctx.createBiquadFilter();
                this.surfaceFilter.type = 'bandpass';
                this.surfaceFilter.frequency.value = 1400;
                this.surfaceFilter.Q.value = .8;
                this.surfaceGain = ctx.createGain();
                this.surfaceGain.gain.value = 0;
                loop.connect(this.surfaceFilter).connect(this.surfaceGain).connect(this.master);
                const skid = ctx.createBufferSource();
                skid.buffer = this.noise;
                skid.loop = true;
                skid.playbackRate.value = .7;
                const skidFilter = ctx.createBiquadFilter();
                skidFilter.type = 'bandpass';
                skidFilter.frequency.value = 2600;
                skidFilter.Q.value = 6;
                this.skidGain = ctx.createGain();
                this.skidGain.gain.value = 0;
                skid.connect(skidFilter).connect(this.skidGain).connect(this.master);
                loop.start();
                skid.start();
                this.effects = ctx.createGain();
                this.effects.connect(this.master);
            }
            void this.ctx.resume().catch(() => { });
        }
        catch { /* Audio is optional; the race is complete without it. */ }
    }
    configure(settings: Pick<Setup, 'muted' | 'engineVolume' | 'effectsVolume' | 'noteSounds'>) { this.settings = settings; }
    /** Called every frame with the player's car. */
    update(car: Car | null, active: boolean) {
        const ctx = this.ctx;
        if (!ctx || !this.engineGain || !this.oscA || !this.oscB || !this.engineFilter || !this.surfaceGain || !this.surfaceFilter || !this.skidGain || !this.effects || !this.master) return;
        const t = ctx.currentTime, on = active && !this.settings.muted && !!car;
        this.master.gain.setTargetAtTime(this.settings.muted ? 0 : 1, t, .05);
        this.effects.gain.setTargetAtTime(this.settings.effectsVolume * .5, t, .05);
        if (!car || !on) {
            this.engineGain.gain.setTargetAtTime(0, t, .06);
            this.surfaceGain.gain.setTargetAtTime(0, t, .05);
            this.skidGain.gain.setTargetAtTime(0, t, .05);
            return;
        }
        let gear = 1;
        while (gear < GEARS.length - 1 && car.speed > GEARS[gear]) gear++;
        const low = GEARS[gear - 1], high = GEARS[gear], rpm = car.air > 0 ? 1 : Math.min(1, Math.max(0, (car.speed - low) / (high - low)));
        const base = 48 + rpm * 92 + gear * 6 + (car.throttle ? 8 : 0);
        this.oscA.frequency.setTargetAtTime(base, t, car.air > 0 ? .02 : .05);
        this.oscB.frequency.setTargetAtTime(base, t, .05);
        this.engineFilter.frequency.setTargetAtTime(car.throttle ? 900 + rpm * 900 : 480, t, .06);
        this.engineGain.gain.setTargetAtTime(this.settings.engineVolume * (car.throttle ? .11 : .06), t, .05);
        const loose = car.surface !== 'tarmac' && car.air <= 0;
        const freq = { tarmac: 900, gravel: 1500, sand: 1100, mud: 520, snow: 2600, ice: 3400 }[car.surface];
        this.surfaceFilter.frequency.setTargetAtTime(freq, t, .08);
        this.surfaceGain.gain.setTargetAtTime(loose ? this.settings.effectsVolume * Math.min(.22, car.speed * .003 + car.slip * .012) : 0, t, .06);
        const squeal = car.surface === 'tarmac' && car.air <= 0 ? Math.max(0, car.slip - 3) : 0;
        this.skidGain.gain.setTargetAtTime(this.settings.effectsVolume * Math.min(.12, squeal * .02), t, .04);
    }
    events(events: RaceEvent[], follow = 0) {
        if (!this.ctx || !this.effects || this.settings.muted) return;
        for (const e of events) {
            if (e.car !== follow) continue;
            if (e.type === 'count') this.tone(520, .12, 'square', .3);
            if (e.type === 'go') this.tone(1040, .32, 'square', .35);
            if (e.type === 'crash') { this.burst(.25 + e.power * .35, 380, .9 * e.power + .2); this.tone(58, .22, 'sine', .6 * e.power + .2); }
            if (e.type === 'contact') this.burst(.12, 900, .35 * e.power + .15);
            if (e.type === 'land') { this.tone(64, .2, 'sine', .5); this.burst(.16, 500, .3); }
            if (e.type === 'splash') this.burst(.45, 1800, .55, 'highpass');
            if (e.type === 'split') this.chime(e.power ? [880, 1175] : [660, 523], .1);
            if (e.type === 'note' && this.settings.noteSounds) this.chime(e.power < 0 ? [740, 988] : e.power > 0 ? [988, 740] : [880, 880], .05, .18);
            if (e.type === 'finish') this.chime([784, 988, 1175, 1568], .11);
            if (e.type === 'recover') this.tone(330, .15, 'triangle', .25);
        }
    }
    medal(medal: Medal | null) {
        if (!medal || !this.ctx || this.settings.muted) return;
        this.chime(medal === 'gold' ? [1047, 1319, 1568, 2093] : medal === 'silver' ? [988, 1245, 1480] : [880, 1109], .12, .32);
    }
    private tone(freq: number, length: number, type: OscillatorType, volume: number) {
        const ctx = this.ctx!, osc = ctx.createOscillator(), gain = ctx.createGain(), start = ctx.currentTime;
        osc.type = type;
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(.0001, start);
        gain.gain.exponentialRampToValueAtTime(volume, start + .01);
        gain.gain.exponentialRampToValueAtTime(.0001, start + length);
        osc.connect(gain).connect(this.effects!);
        osc.start(start);
        osc.stop(start + length + .02);
        osc.onended = () => { osc.disconnect(); gain.disconnect(); };
    }
    private burst(length: number, freq: number, volume: number, type: BiquadFilterType = 'lowpass') {
        const ctx = this.ctx!, src = ctx.createBufferSource(), filter = ctx.createBiquadFilter(), gain = ctx.createGain(), start = ctx.currentTime;
        src.buffer = this.noise;
        filter.type = type;
        filter.frequency.value = freq;
        gain.gain.setValueAtTime(volume, start);
        gain.gain.exponentialRampToValueAtTime(.0001, start + length);
        src.connect(filter).connect(gain).connect(this.effects!);
        src.start(start, Math.random() * .5, length + .05);
        src.onended = () => { src.disconnect(); filter.disconnect(); gain.disconnect(); };
    }
    private chime(notes: number[], gap: number, volume = .25) {
        const ctx = this.ctx!, start = ctx.currentTime;
        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator(), gain = ctx.createGain(), at = start + i * gap;
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, at);
            gain.gain.setValueAtTime(.0001, at);
            gain.gain.exponentialRampToValueAtTime(volume, at + .01);
            gain.gain.exponentialRampToValueAtTime(.0001, at + .22);
            osc.connect(gain).connect(this.effects!);
            osc.start(at);
            osc.stop(at + .25);
            osc.onended = () => { osc.disconnect(); gain.disconnect(); };
        });
    }
    suspend() { void this.ctx?.suspend().catch(() => { }); }
    dispose() {
        try { this.oscA?.stop(); this.oscB?.stop(); } catch { /* already stopped */ }
        void this.ctx?.close().catch(() => { });
        this.ctx = null;
    }
}
