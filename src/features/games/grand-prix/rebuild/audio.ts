import type { Event, Setup } from './contracts';
/** Original synthesized engine and cues; no sampled reference audio. */
export class RaceAudio {
    private context: AudioContext | null = null;
    private engine: OscillatorNode | null = null;
    private engineGain: GainNode | null = null;
    private effects: GainNode | null = null;
    start() {
        try {
            if (!this.context) {
                this.context = new AudioContext();
                const ctx = this.context;
                this.engine = ctx.createOscillator();
                this.engine.type = 'sawtooth';
                this.engineGain = ctx.createGain();
                this.engineGain.gain.value = 0;
                const filter = ctx.createBiquadFilter();
                filter.type = 'lowpass';
                filter.frequency.value = 650;
                this.engine.connect(filter).connect(this.engineGain).connect(ctx.destination);
                this.effects = ctx.createGain();
                this.effects.connect(ctx.destination);
                this.engine.start();
            }
            void this.context.resume().catch(() => { });
        }
        catch { /* Audio is optional; muted play remains complete. */ }
    }
    update(speed: number, settings: Setup, active: boolean) {
        if (!this.context || !this.engine || !this.engineGain || !this.effects)
            return;
        const time = this.context.currentTime;
        this.engine.frequency.setTargetAtTime(44 + speed * 3.4, time, .08);
        this.engineGain.gain.setTargetAtTime(active && !settings.muted ? settings.engineVolume * .055 : 0, time, .04);
        this.effects.gain.setTargetAtTime(settings.muted ? 0 : settings.effectsVolume * .16, time, .02);
    }
    events(events: Event[]) {
        if (!this.context || !this.effects)
            return;
        for (const e of events) {
            if (e.car !== 0 || !['lights', 'go', 'contact', 'lap', 'pit', 'finish', 'invalid'].includes(e.type))
                continue;
            const ctx = this.context, osc = ctx.createOscillator(), gain = ctx.createGain(), start = ctx.currentTime;
            osc.type = e.type === 'contact' ? 'triangle' : 'sine';
            osc.frequency.setValueAtTime(({ lights: 420, go: 840, contact: 90, lap: 660, pit: 510, finish: 990, invalid: 180 } as Record<string, number>)[e.type], start);
            gain.gain.setValueAtTime(.001, start);
            gain.gain.exponentialRampToValueAtTime(.5, start + .008);
            gain.gain.exponentialRampToValueAtTime(.001, start + .16);
            osc.connect(gain).connect(this.effects);
            osc.start(start);
            osc.stop(start + .18);
            osc.onended = () => { osc.disconnect(); gain.disconnect(); };
        }
    }
    dispose() { this.engine?.stop(); void this.context?.close().catch(() => { }); this.context = null; }
}
