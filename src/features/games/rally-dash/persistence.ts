import { crews } from './crews';
import { DEFAULT_SETUP, medalRank, recordKey, type Ghost, type Medal, type Save, type Session, type Setup } from './contracts';
import { clamp } from './geometry';
import { stageIds } from './stages';

/** Rally Dash's own save. The old Grand Prix Dash keys are never read, migrated or removed. */
export const SAVE_KEY = 'statoz.games.web.rally-dash.v1';
type StoragePort = Pick<Storage, 'getItem' | 'setItem'>;
const object = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);
const finite = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);
const medal = (v: unknown): Medal | null => v === 'gold' || v === 'silver' || v === 'bronze' ? v : null;

export function cleanSetup(value: unknown): Setup {
    const s = { ...DEFAULT_SETUP };
    if (!object(value)) return s;
    if (value.mode === 'stage' || value.mode === 'rallycross') s.mode = value.mode;
    if (stageIds.includes(value.stage as Setup['stage'])) s.stage = value.stage as Setup['stage'];
    if (finite(value.crew)) s.crew = clamp(Math.floor(value.crew), 0, crews.length - 1);
    if (value.rivals === 'rookie' || value.rivals === 'pro' || value.rivals === 'legend') s.rivals = value.rivals;
    if (value.laps === 3 || value.laps === 5) s.laps = value.laps;
    if (value.camera === 'chase' || value.camera === 'map') s.camera = value.camera;
    for (const k of ['autoThrottle', 'brakeAssist', 'noteSounds', 'vibration', 'muted'] as const) if (typeof value[k] === 'boolean') s[k] = value[k];
    for (const k of ['engineVolume', 'effectsVolume', 'touchOpacity'] as const) if (finite(value[k])) s[k] = clamp(value[k], k === 'touchOpacity' ? .2 : 0, 1);
    if (finite(value.touchSize)) s.touchSize = clamp(value.touchSize, 52, 96);
    return s;
}

export function validGhost(g: unknown, key: string): g is Ghost {
    if (!object(g) || g.version !== 1 || g.rulesVersion !== 1 || g.key !== key || !finite(g.time) || g.time < 10 || g.time > 1200 || !Array.isArray(g.samples) || g.samples.length < 2 || g.samples.length > 12002 || !Array.isArray(g.splits) || g.splits.length !== 4 || !g.splits.every(finite)) return false;
    let previous = -1;
    for (const sample of g.samples) {
        if (!object(sample) || !['t', 'x', 'y', 'heading'].every(k => finite(sample[k])) || Number(sample.t) < previous || Number(sample.t) > g.time + .1 || Math.abs(Number(sample.x)) > 5000 || Math.abs(Number(sample.y)) > 5000) return false;
        previous = Number(sample.t);
    }
    return true;
}

export class RallyStore {
    data: Save = { version: 1, rulesVersion: 1, setup: { ...DEFAULT_SETUP }, records: {}, recent: [], tutorialSeen: false };
    status = '';
    /** True when this device had no Rally Dash save yet. */
    fresh = true;
    private writable = true;
    constructor(private storage: StoragePort | null) {
        try {
            const raw = storage?.getItem(SAVE_KEY);
            if (!raw) return;
            this.fresh = false;
            if (raw.length > 5_000_000) throw Error('Save too large');
            const parsed: unknown = JSON.parse(raw);
            if (!object(parsed)) throw Error('Invalid save');
            if (parsed.version !== 1 || parsed.rulesVersion !== 1) {
                this.writable = false;
                this.status = 'A newer Rally Dash save is kept safe. This visit will not overwrite it.';
                return;
            }
            this.data.setup = cleanSetup(parsed.setup);
            this.data.tutorialSeen = parsed.tutorialSeen === true;
            if (object(parsed.records))
                for (const [key, value] of Object.entries(parsed.records).slice(0, 40))
                    if (object(value) && finite(value.best) && value.best > 10 && Array.isArray(value.splits) && value.splits.length === 4 && value.splits.every(finite))
                        this.data.records[key] = { best: value.best, splits: value.splits, ghost: validGhost(value.ghost, key) ? value.ghost : null, medal: medal(value.medal) };
            if (Array.isArray(parsed.recent))
                this.data.recent = parsed.recent.filter(r => object(r) && r.version === 1 && r.rulesVersion === 1 && typeof r.id === 'string' && ['stage', 'rallycross'].includes(String(r.mode)) && stageIds.includes(r.stage as Setup['stage']) && finite(r.elapsed) && finite(r.position) && finite(r.laps) && finite(r.crew) && Array.isArray(r.classification)).slice(0, 12) as Save['recent'];
        }
        catch {
            this.status = 'Saved rally data could not be read. You can still play.';
        }
    }
    persist() {
        if (!this.writable) return;
        try {
            if (!this.storage) throw Error('No storage');
            this.storage.setItem(SAVE_KEY, JSON.stringify(this.data));
            this.status = '';
        }
        catch {
            this.status = 'Storage unavailable. Progress is kept for this visit only.';
        }
    }
    settings(setup: Setup) { this.data.setup = cleanSetup(setup); this.persist(); }
    seenTutorial() { if (!this.data.tutorialSeen) { this.data.tutorialSeen = true; this.persist(); } }
    /** Stores new bests, ghosts and the finished result. Safe to call every tick: each result is kept once. */
    collect(session: Session) {
        let changed = false;
        for (const ghost of session.completedGhosts.splice(0)) {
            const prior = this.data.records[ghost.key];
            if (!prior || ghost.time < prior.best) {
                this.data.records[ghost.key] = { best: ghost.time, splits: ghost.splits, ghost, medal: prior?.medal ?? null };
                changed = true;
            }
        }
        const result = session.result;
        if (result && !this.data.recent.some(r => r.id === result.id)) {
            this.data.recent.unshift(result);
            this.data.recent = this.data.recent.slice(0, 12);
            if (result.mode === 'stage' && result.medal) {
                const record = this.data.records[recordKey(session.setup)];
                if (record && medalRank(result.medal) > medalRank(record.medal)) record.medal = result.medal;
            }
            changed = true;
        }
        if (changed) this.persist();
    }
    best(setup: Pick<Setup, 'stage' | 'autoThrottle' | 'brakeAssist'>) { return this.data.records[recordKey(setup)] ?? null; }
    /** Best medal on a stage across assist settings, for the stage cards. */
    medal(stage: Setup['stage']) {
        let top: Medal | null = null;
        for (const [key, record] of Object.entries(this.data.records)) if (key.startsWith(stage + ':') && medalRank(record.medal) > medalRank(top)) top = record.medal;
        return top;
    }
}

export function browserStore() {
    let store: RallyStore;
    try { store = new RallyStore(window.localStorage); }
    catch { store = new RallyStore(null); }
    // First visit on a phone or tablet: auto gas on, so one thumb steers and the other handles brake and handbrake.
    try { if (store.fresh && window.matchMedia('(pointer: coarse)').matches) store.data.setup = { ...store.data.setup, autoThrottle: true }; }
    catch { /* no media queries: keep the defaults */ }
    return store;
}
