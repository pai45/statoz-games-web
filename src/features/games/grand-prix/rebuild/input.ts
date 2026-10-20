import type { Input } from './contracts';
/** Each key/finger owns a token. Releasing one does not release another held source. */
export class RaceInput {
    private sources = new Map<string, string>();
    hold(source: string, action: string, down: boolean) {
        if (down)
            this.sources.set(source, action);
        else
            this.sources.delete(source);
    }
    clear() { this.sources.clear(); }
    read(): Input { const values = [...this.sources.values()]; return { steer: Number(values.includes('right')) - Number(values.includes('left')), throttle: values.includes('throttle'), brake: values.includes('brake') }; }
}
