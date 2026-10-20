import { DEFAULT_SETUP, recordKey, type Ghost, type Save, type Session, type Setup } from './contracts';
import { circuits, clamp } from './geometry';
export const SAVE_KEY = 'statoz.games.web.grandprix.v2';
type StoragePort = Pick<Storage, 'getItem' | 'setItem'>;
const object = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);
const finite = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);
export function cleanSetup(value: unknown): Setup {
    const s = { ...DEFAULT_SETUP };
    if (!object(value))
        return s;
    if (value.mode === 'race' || value.mode === 'trial')
        s.mode = value.mode;
    if (circuits.some(t => t.id === value.circuit))
        s.circuit = value.circuit as Setup['circuit'];
    if (finite(value.team))
        s.team = clamp(Math.floor(value.team), 0, 9);
    if (['club', 'sport', 'expert'].includes(String(value.difficulty)))
        s.difficulty = value.difficulty as Setup['difficulty'];
    if (value.laps === 3 || value.laps === 5 || value.laps === 10)
        s.laps = value.laps;
    if (['soft', 'medium', 'hard'].includes(String(value.compound)))
        s.compound = value.compound as Setup['compound'];
    for (const k of ['qualifying', 'strategy', 'autoThrottle', 'brakeAssist', 'guide', 'muted'] as const)
        if (typeof value[k] === 'boolean')
            s[k] = value[k];
    for (const k of ['engineVolume', 'effectsVolume', 'touchOpacity'] as const)
        if (finite(value[k]))
            s[k] = clamp(value[k], k === 'touchOpacity' ? .2 : 0, 1);
    if (finite(value.touchSize))
        s.touchSize = clamp(value.touchSize, 48, 88);
    return s;
}
export function validGhost(g: unknown, key: string): g is Ghost {
    if (!object(g) || g.version !== 2 || g.rulesVersion !== 2 || g.key !== key || !finite(g.time) || g.time < 5 || g.time > 1200 || !Array.isArray(g.samples) || g.samples.length < 2 || g.samples.length > 12002 || !Array.isArray(g.sectors) || g.sectors.length !== 3 || !g.sectors.every(finite))
        return false;
    let previous = -1;
    for (const sample of g.samples) {
        if (!object(sample) || !['t', 'x', 'y', 'heading'].every(k => finite(sample[k])) || Number(sample.t) < previous || Number(sample.t) > g.time + .1 || Math.abs(Number(sample.x)) > 5000 || Math.abs(Number(sample.y)) > 5000)
            return false;
        previous = Number(sample.t);
    }
    return true;
}
export class RacingStore {
    data: Save = { version: 2, rulesVersion: 2, setup: { ...DEFAULT_SETUP }, records: {}, recent: [], tutorialSeen: false };
    status = '';
    private writable = true;
    constructor(private storage: StoragePort | null) {
        try {
            const raw = storage?.getItem(SAVE_KEY);
            if (!raw)
                return;
            if (raw.length > 5000000)
                throw Error('Save too large');
            const parsed: unknown = JSON.parse(raw);
            if (!object(parsed))
                throw Error('Invalid save');
            if (parsed.version !== 2 || parsed.rulesVersion !== 2) {
                this.writable = false;
                this.status = 'A newer racing save is preserved. This session will not overwrite it.';
                return;
            }
            this.data.setup = cleanSetup(parsed.setup);
            this.data.tutorialSeen = parsed.tutorialSeen === true;
            if (object(parsed.records))
                for (const [key, value] of Object.entries(parsed.records).slice(0, 40)) {
                    if (object(value) && finite(value.best) && value.best > 5 && Array.isArray(value.sectors) && value.sectors.length === 3 && value.sectors.every(finite))
                        this.data.records[key] = { best: value.best, sectors: value.sectors, ghost: validGhost(value.ghost, key) ? value.ghost : null };
                }
            if (Array.isArray(parsed.recent))
                this.data.recent = parsed.recent.filter(r => object(r) && r.version === 2 && r.rulesVersion === 2 && typeof r.id === 'string' && ['race', 'trial'].includes(String(r.mode)) && circuits.some(c => c.id === r.circuit) && finite(r.elapsed) && finite(r.position) && finite(r.laps) && finite(r.team) && Array.isArray(r.classification)).slice(0, 12) as Save['recent'];
        }
        catch {
            this.status = 'Saved racing data could not be read. You can still play.';
        }
    }
    persist() {
        if (!this.writable)
            return;
        try {
            if (!this.storage)
                throw Error('No storage');
            this.storage.setItem(SAVE_KEY, JSON.stringify(this.data));
            this.status = '';
        }
        catch {
            this.status = 'Storage unavailable. Progress is kept for this visit only.';
        }
    }
    settings(setup: Setup) { this.data.setup = cleanSetup(setup); this.persist(); }
    collect(session: Session) {
        let changed = false;
        for (const ghost of session.completedGhosts.splice(0)) {
            const prior = this.data.records[ghost.key];
            if (!prior || ghost.time < prior.best) {
                this.data.records[ghost.key] = { best: ghost.time, sectors: ghost.sectors, ghost };
                changed = true;
            }
        }
        if (session.result && !this.data.recent.some(r => r.id === session.result!.id)) {
            this.data.recent.unshift(session.result);
            this.data.recent = this.data.recent.slice(0, 12);
            changed = true;
        }
        if (changed)
            this.persist();
    }
    best(setup: Setup) { return this.data.records[recordKey(setup)] ?? null; }
}
export function browserStore() {
    try {
        return new RacingStore(window.localStorage);
    }
    catch {
        return new RacingStore(null);
    }
}
