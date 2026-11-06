import type { Input } from './contracts';

export type Action = 'left' | 'right' | 'throttle' | 'brake' | 'handbrake';
/**
 * Each key or finger owns a token, so releasing one never releases another held source.
 * Steering can also be analog (a thumb on the slide pad), from -1 (full left) to 1 (full right).
 */
export class RaceInput {
    private sources = new Map<string, Action>();
    private analog = new Map<string, number>();
    private cached: Input | null = null;
    hold(source: string, action: Action, down: boolean) {
        if (down) this.sources.set(source, action);
        else this.sources.delete(source);
        this.cached = null;
    }
    steer(source: string, value: number | null) {
        if (value === null) this.analog.delete(source);
        else this.analog.set(source, Math.max(-1, Math.min(1, value)));
        this.cached = null;
    }
    clear() { this.sources.clear(); this.analog.clear(); this.cached = null; }
    has(action: Action) { for (const value of this.sources.values()) if (value === action) return true; return false; }
    read(): Input {
        if (!this.cached) {
            let steer = Number(this.has('right')) - Number(this.has('left'));
            for (const value of this.analog.values()) steer += value;
            this.cached = { steer: Math.max(-1, Math.min(1, steer)), throttle: this.has('throttle'), brake: this.has('brake'), handbrake: this.has('handbrake') };
        }
        return this.cached;
    }
}
