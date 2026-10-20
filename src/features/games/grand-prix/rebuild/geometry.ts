import type { Circuit, CircuitId, TrackPoint, Vec } from './contracts';
const specs: {
    id: CircuitId;
    name: string;
    region: string;
    description: string;
    difficulty: number;
    theme: Circuit['theme'];
    width: number;
    knots: number[][];
}[] = [
    { id: 'parkland', name: 'Arden Park', region: 'PARKLAND GRAND PRIX', description: 'Flowing bends, generous runoff and a long braking zone.', difficulty: 1, theme: 'park', width: 25, knots: [[200, 200], [650, 200], [850, 330], [920, 610], [720, 780], [470, 700], [350, 850], [110, 760], [80, 490], [240, 420]] },
    { id: 'harbour', name: 'Port Bellamy', region: 'HARBOUR STREET CIRCUIT', description: 'Waterfront straights and narrow, deliberate corner entries.', difficulty: 3, theme: 'city', width: 22, knots: [[180, 180], [690, 180], [850, 270], [850, 540], [650, 570], [610, 380], [430, 390], [410, 710], [180, 720], [70, 570], [160, 430]] },
    { id: 'desert', name: 'Saffron Dunes', region: 'DESERT MOTOR PARK', description: 'Fast sweepers lead into a compact technical infield.', difficulty: 2, theme: 'sand', width: 26, knots: [[180, 190], [700, 190], [1010, 420], [890, 760], [620, 820], [430, 620], [640, 500], [520, 380], [310, 460], [100, 710], [50, 380]] },
    { id: 'coastal', name: 'Cape Solano', region: 'COASTAL GRAND PRIX', description: 'Seaside hairpins linked by a flat-out coastal section.', difficulty: 2, theme: 'sea', width: 24, knots: [[190, 190], [720, 190], [970, 360], [950, 620], [730, 800], [560, 700], [660, 530], [430, 440], [300, 680], [100, 760], [55, 450]] },
    { id: 'woodland', name: 'Pinecrest Ring', region: 'WOODLAND CIRCUIT', description: 'A rhythm of changing-radius bends through deep woodland.', difficulty: 3, theme: 'forest', width: 23, knots: [[200, 190], [670, 190], [880, 300], [810, 490], [970, 700], [730, 840], [510, 690], [330, 820], [100, 720], [80, 480], [330, 420]] },
];
const mod = (x: number, n: number) => (x % n + n) % n;
export const wrap = (x: number) => Math.atan2(Math.sin(x), Math.cos(x));
export const clamp = (n: number, a: number, b: number) => Math.max(a, Math.min(b, n));
function spline(a: number, b: number, c: number, d: number, t: number) { return .5 * ((2 * b) + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t * t + (-a + 3 * b - 3 * c + d) * t * t * t); }
function make(spec: typeof specs[number]): Circuit {
    const raw: Vec[] = [];
    const knots = spec.knots.map(([x, y]) => [x * .72, y * .72]);
    for (let i = 0; i < knots.length; i++)
        for (let j = 0; j < 48; j++) {
            const t = j / 48;
            const [a, b, c, d] = [-1, 0, 1, 2].map(k => knots[mod(i + k, knots.length)]);
            raw.push({ x: spline(a[0], b[0], c[0], d[0], t), y: spline(a[1], b[1], c[1], d[1], t) });
        }
    let length = 0;
    const points: TrackPoint[] = raw.map((p, i) => {
        if (i)
            length += Math.hypot(p.x - raw[i - 1].x, p.y - raw[i - 1].y);
        const before = raw[mod(i - 1, raw.length)], after = raw[(i + 1) % raw.length];
        return { ...p, s: length, heading: Math.atan2(after.y - before.y, after.x - before.x), curvature: 0 };
    });
    length += Math.hypot(raw[0].x - raw.at(-1)!.x, raw[0].y - raw.at(-1)!.y);
    for (let i = 0; i < points.length; i++) {
        const a = points[mod(i - 4, points.length)], b = points[(i + 4) % points.length];
        points[i].curvature = Math.abs(wrap(b.heading - a.heading)) / Math.max(1, Math.hypot(b.x - a.x, b.y - a.y));
    }
    const xs = points.map(p => p.x), ys = points.map(p => p.y);
    return { ...spec, points, length, bounds: { x: Math.min(...xs) - 100, y: Math.min(...ys) - 100, width: Math.max(...xs) - Math.min(...xs) + 200, height: Math.max(...ys) - Math.min(...ys) + 200 }, pit: { entry: length * .018, box: length * .073, exit: length * .135 } };
}
export const circuits: Circuit[] = specs.map(make);
export const getCircuit = (id: CircuitId) => circuits.find(t => t.id === id) ?? circuits[0];
export function pointAt(track: Circuit, s: number, offset = 0): TrackPoint {
    const distance = mod(s, track.length), p = track.points;
    let lo = 0, hi = p.length - 1;
    while (lo < hi) {
        const mid = Math.ceil((lo + hi) / 2);
        if (p[mid].s <= distance)
            lo = mid;
        else
            hi = mid - 1;
    }
    const a = p[lo], b = p[(lo + 1) % p.length], span = (lo === p.length - 1 ? track.length : b.s) - a.s, f = (distance - a.s) / Math.max(.001, span), heading = a.heading + wrap(b.heading - a.heading) * f;
    return { x: a.x + (b.x - a.x) * f - Math.sin(heading) * offset, y: a.y + (b.y - a.y) * f + Math.cos(heading) * offset, s: distance, heading, curvature: a.curvature + (b.curvature - a.curvature) * f };
}
export function nearest(track: Circuit, pos: Vec, hint?: number): TrackPoint & {
    distance: number;
    offset: number;
} {
    let best = Infinity, result = track.points[0], offset = 0;
    let centre = 0;
    if (hint !== undefined) {
        let lo = 0, hi = track.points.length - 1;
        while (lo < hi) {
            const m = Math.ceil((lo + hi) / 2);
            if (track.points[m].s <= hint)
                lo = m;
            else
                hi = m - 1;
        }
        centre = lo;
    }
    const count = hint === undefined ? track.points.length : 49;
    for (let index = 0; index < count; index++) {
        const i = hint === undefined ? index : mod(centre + index - 24, track.points.length);
        const a = track.points[i], b = track.points[(i + 1) % track.points.length], dx = b.x - a.x, dy = b.y - a.y, f = clamp(((pos.x - a.x) * dx + (pos.y - a.y) * dy) / (dx * dx + dy * dy), 0, 1), x = a.x + dx * f, y = a.y + dy * f, d = (pos.x - x) ** 2 + (pos.y - y) ** 2;
        if (d < best) {
            best = d;
            result = { x, y, s: a.s + Math.hypot(dx, dy) * f, heading: Math.atan2(dy, dx), curvature: a.curvature };
            offset = (pos.x - x) * -Math.sin(result.heading) + (pos.y - y) * Math.cos(result.heading);
        }
    }
    if (hint !== undefined && best > 3600)
        return nearest(track, pos);
    return { ...result, distance: Math.sqrt(best), offset };
}
export const forwardDistance = (from: number, to: number, length: number) => mod(to - from, length);
export const signedDistance = (from: number, to: number, length: number) => mod(to - from + length / 2, length) - length / 2;
export function targetSpeed(track: Circuit, s: number) {
    let limit = 68;
    for (let look = 0; look <= 150; look += 12) {
        const p = pointAt(track, s + look), corner = Math.min(68, Math.sqrt(14 / Math.max(.002, p.curvature)));
        limit = Math.min(limit, Math.sqrt(corner * corner + 2 * 18 * look));
    }
    return limit;
}
