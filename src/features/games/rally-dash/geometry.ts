import type { TrackPoint, Vec } from './contracts';

/** A closed, arc-length-sampled loop. Carried over from the Grand Prix Dash geometry, plus signed turn rate. */
export type Loop = { points: TrackPoint[]; length: number };
export const mod = (x: number, n: number) => (x % n + n) % n;
export const wrap = (x: number) => Math.atan2(Math.sin(x), Math.cos(x));
export const clamp = (n: number, a: number, b: number) => Math.max(a, Math.min(b, n));
export const forwardDistance = (from: number, to: number, length: number) => mod(to - from, length);
export const signedDistance = (from: number, to: number, length: number) => mod(to - from + length / 2, length) - length / 2;
export function random(seed: number) { let n = seed >>> 0; return () => { n = (Math.imul(n, 1664525) + 1013904223) >>> 0; return n / 4294967296; }; }
function spline(a: number, b: number, c: number, d: number, t: number) { return .5 * ((2 * b) + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t * t + (-a + 3 * b - 3 * c + d) * t * t * t); }

/** Samples a closed Catmull-Rom spline through the knots at a roughly even spacing. */
export function buildLoop(knots: number[][], spacing = 4): Loop {
    const dense: Vec[] = [];
    for (let i = 0; i < knots.length; i++)
        for (let j = 0; j < 64; j++) {
            const t = j / 64, [a, b, c, d] = [-1, 0, 1, 2].map(k => knots[mod(i + k, knots.length)]);
            dense.push({ x: spline(a[0], b[0], c[0], d[0], t), y: spline(a[1], b[1], c[1], d[1], t) });
        }
    // Resample by arc length so lookups, curvature and surfaces are uniform along the road.
    const cumulative = [0];
    for (let i = 1; i <= dense.length; i++) cumulative.push(cumulative[i - 1] + Math.hypot(dense[i % dense.length].x - dense[i - 1].x, dense[i % dense.length].y - dense[i - 1].y));
    const total = cumulative[dense.length], count = Math.max(64, Math.round(total / spacing)), raw: Vec[] = [];
    for (let i = 0, k = 0; i < count; i++) {
        const target = i * total / count;
        while (cumulative[k + 1] < target) k++;
        const a = dense[k], b = dense[(k + 1) % dense.length], f = (target - cumulative[k]) / Math.max(1e-6, cumulative[k + 1] - cumulative[k]);
        raw.push({ x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f });
    }
    let length = 0;
    const points: TrackPoint[] = raw.map((p, i) => {
        if (i) length += Math.hypot(p.x - raw[i - 1].x, p.y - raw[i - 1].y);
        const before = raw[mod(i - 1, raw.length)], after = raw[(i + 1) % raw.length];
        return { ...p, s: length, heading: Math.atan2(after.y - before.y, after.x - before.x), curvature: 0, turn: 0 };
    });
    length += Math.hypot(raw[0].x - raw.at(-1)!.x, raw[0].y - raw.at(-1)!.y);
    for (let i = 0; i < points.length; i++) {
        const a = points[mod(i - 3, points.length)], b = points[(i + 3) % points.length];
        const turn = wrap(b.heading - a.heading) / Math.max(1, Math.hypot(b.x - a.x, b.y - a.y));
        points[i].turn = turn;
        points[i].curvature = Math.abs(turn);
    }
    return { points, length };
}

function indexAt(loop: Loop, s: number) {
    const p = loop.points;
    let lo = 0, hi = p.length - 1;
    while (lo < hi) {
        const mid = Math.ceil((lo + hi) / 2);
        if (p[mid].s <= s) lo = mid;
        else hi = mid - 1;
    }
    return lo;
}
export const sampleIndex = (loop: Loop, s: number) => indexAt(loop, mod(s, loop.length));

export function pointAt(loop: Loop, s: number, offset = 0): TrackPoint {
    const distance = mod(s, loop.length), p = loop.points, lo = indexAt(loop, distance);
    const a = p[lo], b = p[(lo + 1) % p.length], span = (lo === p.length - 1 ? loop.length : b.s) - a.s, f = (distance - a.s) / Math.max(.001, span), heading = a.heading + wrap(b.heading - a.heading) * f;
    return { x: a.x + (b.x - a.x) * f - Math.sin(heading) * offset, y: a.y + (b.y - a.y) * f + Math.cos(heading) * offset, s: distance, heading, curvature: a.curvature + (b.curvature - a.curvature) * f, turn: a.turn + (b.turn - a.turn) * f };
}

export type Nearest = { x: number; y: number; s: number; heading: number; index: number; distance: number; offset: number };
/** Closest road point. With a hint it searches a local window first, falling back to the full loop. */
export function nearest(loop: Loop, pos: Vec, hint?: number): Nearest {
    const pts = loop.points, n = pts.length;
    let best = Infinity, bx = 0, by = 0, bs = 0, bh = 0, bi = 0;
    const centre = hint === undefined ? 0 : indexAt(loop, mod(hint, loop.length)), count = hint === undefined ? n : Math.min(n, 41);
    for (let k = 0; k < count; k++) {
        const i = hint === undefined ? k : mod(centre + k - 20, n);
        const a = pts[i], b = pts[(i + 1) % n], dx = b.x - a.x, dy = b.y - a.y, f = clamp(((pos.x - a.x) * dx + (pos.y - a.y) * dy) / (dx * dx + dy * dy || 1), 0, 1), x = a.x + dx * f, y = a.y + dy * f, d = (pos.x - x) ** 2 + (pos.y - y) ** 2;
        if (d < best) { best = d; bx = x; by = y; bs = a.s + Math.hypot(dx, dy) * f; bh = Math.atan2(dy, dx); bi = i; }
    }
    if (hint !== undefined && best > 2500) return nearest(loop, pos);
    const offset = (pos.x - bx) * -Math.sin(bh) + (pos.y - by) * Math.cos(bh);
    return { x: bx, y: by, s: mod(bs, loop.length), heading: bh, index: bi, distance: Math.sqrt(best), offset };
}
