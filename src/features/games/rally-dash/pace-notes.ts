import { SURFACES, type PaceNote, type Stage } from './contracts';
import { forwardDistance, mod } from './geometry';

/** Radius thresholds (world units) for grades 1 (hairpin) to 5; anything wider is a 6. */
const GRADES = [22, 34, 50, 72, 105];
const THRESHOLD = .0075;

/**
 * The co-driver's notes, read from the road itself: every bend graded 1–6 by its tightest radius,
 * plus jumps, splashes and the start of ice. Canvas y points down, so a rising heading is a right-hander.
 */
export function paceNotes(stage: Pick<Stage, 'points' | 'length' | 'features' | 'surfaceAt'>): PaceNote[] {
    const { points, length } = stage, n = points.length;
    let start = 0;
    while (start < n && Math.abs(points[start].turn) >= THRESHOLD) start++;
    const runs: { s: number; end: number; angle: number; peak: number }[] = [];
    let run: { s: number; end: number; angle: number; peak: number; sign: number } | null = null;
    for (let k = 0; k <= n; k++) {
        const i = (start + k) % n, p = points[i], ds = mod(points[(i + 1) % n].s - p.s, length), sign = Math.sign(p.turn);
        const bending = Math.abs(p.turn) >= THRESHOLD && k < n;
        if (run && (!bending || sign !== run.sign)) {
            const previous = runs.at(-1);
            if (previous && Math.sign(previous.angle) === run.sign && forwardDistance(previous.end, run.s, length) < 12) {
                previous.end = run.end;
                previous.angle += run.angle;
                previous.peak = Math.max(previous.peak, run.peak);
            }
            else runs.push({ s: run.s, end: run.end, angle: run.angle, peak: run.peak });
            run = null;
        }
        if (bending) {
            if (!run) run = { s: p.s, end: p.s, angle: 0, peak: 0, sign };
            run.end = mod(p.s + ds, length);
            run.angle += p.turn * ds;
            run.peak = Math.max(run.peak, Math.abs(p.turn));
        }
    }
    const notes: PaceNote[] = runs.filter(r => Math.abs(r.angle) > .3).map(r => {
        const radius = 1 / r.peak, severity = GRADES.findIndex(g => radius < g) + 1 || 6;
        return { s: r.s, end: r.end, kind: r.angle > 0 ? 'right' : 'left', severity, hairpin: severity <= 2 && Math.abs(r.angle) > 2.3, long: severity >= 3 && Math.abs(r.angle) > 1.5, into: false };
    });
    for (const f of stage.features) notes.push({ s: f.s, end: mod(f.s + f.length, length), kind: f.kind, severity: 0, hairpin: false, long: false, into: false });
    const ice = SURFACES.indexOf('ice');
    for (let i = 0; i < n; i++)
        if (stage.surfaceAt[i] === ice && stage.surfaceAt[mod(i - 1, n)] !== ice)
            notes.push({ s: points[i].s, end: points[i].s, kind: 'caution', severity: 0, hairpin: false, long: false, into: false });
    notes.sort((a, b) => a.s - b.s);
    notes.forEach((note, i) => {
        const next = notes[(i + 1) % notes.length];
        note.into = notes.length > 1 && (note.kind === 'left' || note.kind === 'right') && forwardDistance(note.end, next.s, length) < 30;
    });
    return notes;
}

/** Notes the co-driver is currently calling: the corner you are in (if any) and the next ones within reach. */
export function upcomingNotes(stage: Stage, s: number, speed: number, count = 2): PaceNote[] {
    const reach = 45 + speed * 2.8, out: { note: PaceNote; key: number }[] = [];
    let next: { note: PaceNote; key: number } | null = null;
    for (const note of stage.notes) {
        const behind = forwardDistance(note.s, s, stage.length), inside = behind <= forwardDistance(note.s, note.end, stage.length), ahead = forwardDistance(s, note.s, stage.length);
        if (inside) out.push({ note, key: -1 / (1 + behind) });
        else if (ahead < reach) out.push({ note, key: ahead });
        else if (!next || ahead < next.key) next = { note, key: ahead };
    }
    // The co-driver always has the next call ready, however far away it is.
    if (!out.some(o => o.key >= 0) && next) out.push(next);
    return out.sort((a, b) => a.key - b.key).slice(0, count).map(o => o.note);
}

export function noteLabel(note: PaceNote) {
    if (note.kind === 'jump') return 'JUMP';
    if (note.kind === 'splash') return 'SPLASH';
    if (note.kind === 'caution') return 'ICE';
    return note.hairpin ? 'HAIRPIN' : `${note.severity}`;
}
