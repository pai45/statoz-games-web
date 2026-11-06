import { SURFACES, type Feature, type FeatureKind, type Stage, type StageId, type Surface, type Theme } from './contracts';
import { buildLoop, clamp, mod, sampleIndex } from './geometry';
import { paceNotes } from './pace-notes';

export { SURFACES };
/**
 * Handling per surface. `lateral` is how fast sideways slip dies away (low = slides),
 * `corner` the lateral grip rivals plan around, `redirect` how much slide speed turns back into forward speed.
 */
export const GRIP: Record<Surface, { lateral: number; yaw: number; top: number; accel: number; brake: number; corner: number; redirect: number; drag: number }> = {
    tarmac: { lateral: 9.5, yaw: 1, top: 52, accel: 13, brake: 1, corner: 13, redirect: .72, drag: 0 },
    gravel: { lateral: 4.6, yaw: .88, top: 48, accel: 11.5, brake: .8, corner: 10, redirect: .64, drag: .1 },
    sand: { lateral: 3.9, yaw: .84, top: 45, accel: 10.5, brake: .74, corner: 9, redirect: .6, drag: .3 },
    mud: { lateral: 3.4, yaw: .8, top: 40, accel: 9.5, brake: .66, corner: 8, redirect: .56, drag: .5 },
    snow: { lateral: 3, yaw: .76, top: 45, accel: 10, brake: .62, corner: 7.6, redirect: .55, drag: .15 },
    ice: { lateral: 1.7, yaw: .62, top: 43, accel: 7.5, brake: .42, corner: 5.4, redirect: .48, drag: .05 },
};
export const BRAKE_DECEL = 24;

type Spec = {
    id: StageId;
    name: string;
    region: string;
    description: string;
    difficulty: 1 | 2 | 3;
    theme: Theme;
    width: number;
    scale: number;
    knots: number[][];
    surfaces: [number, Surface][];
    verge: Surface;
    barrier: { distance: number; hardness: number };
    features: [FeatureKind, number, number][];
    /** Gold, silver and bronze stage times in seconds, calibrated against headless runs (see tests/rally-dash.test.ts). */
    targets: [number, number, number];
};

const specs: Spec[] = [
    {
        id: 'pine-ridge', name: 'Pine Ridge', region: 'FOREST GRAVEL', description: 'Fast gravel through tall pines, with a water splash to keep you honest.', difficulty: 1, theme: 'forest', width: 17, scale: .66,
        knots: [[150, 150], [500, 110], [800, 170], [910, 360], [760, 470], [880, 650], [730, 850], [460, 770], [300, 870], [110, 730], [210, 520], [80, 330]],
        surfaces: [[0, 'gravel'], [.52, 'tarmac'], [.64, 'gravel']], verge: 'mud', barrier: { distance: 7, hardness: .8 },
        features: [['splash', .27, 16], ['jump', .79, 6]], targets: [60.5, 64.5, 72.5],
    },
    {
        id: 'red-mesa', name: 'Red Mesa', region: 'DESERT RUN', description: 'Long sandy blasts, wide run-off and a jump that rewards a brave right foot.', difficulty: 2, theme: 'desert', width: 19, scale: .68,
        knots: [[120, 200], [600, 140], [900, 250], [960, 500], [800, 580], [640, 460], [500, 560], [700, 760], [480, 890], [200, 830], [70, 560]],
        surfaces: [[0, 'tarmac'], [.1, 'sand'], [.46, 'gravel'], [.74, 'sand']], verge: 'sand', barrier: { distance: 22, hardness: .5 },
        features: [['jump', .17, 7], ['jump', .6, 6]], targets: [61.5, 65.5, 74],
    },
    {
        id: 'frostvale', name: 'Frostvale', region: 'SNOW & ICE', description: 'Packed snow, glassy ice patches and soft banks. Small inputs win here.', difficulty: 3, theme: 'snow', width: 17, scale: .6,
        knots: [[200, 150], [700, 130], [890, 300], [710, 430], [890, 570], [830, 810], [560, 870], [490, 650], [300, 790], [110, 650], [260, 430], [100, 280]],
        surfaces: [[0, 'snow'], [.24, 'ice'], [.31, 'snow'], [.66, 'ice'], [.72, 'snow']], verge: 'snow', barrier: { distance: 5, hardness: .25 },
        features: [['jump', .48, 6]], targets: [74, 79, 89],
    },
    {
        id: 'harbour-hill', name: 'Harbour Hill', region: 'COASTAL TARMAC', description: 'Grippy harbour tarmac between stone walls, with a gravel climb and a crest.', difficulty: 2, theme: 'coast', width: 16, scale: .7,
        knots: [[150, 180], [650, 150], [880, 240], [870, 520], [650, 570], [600, 420], [420, 440], [400, 760], [160, 800], [60, 560], [160, 420]],
        surfaces: [[0, 'tarmac'], [.58, 'gravel'], [.78, 'tarmac']], verge: 'gravel', barrier: { distance: 3, hardness: 1 },
        features: [['jump', .4, 5]], targets: [57.5, 61, 68.5],
    },
    {
        id: 'mudbank-farm', name: 'Mudbank Farm', region: 'MUD & GRAVEL', description: 'A farmyard brawl of mud, gravel and puddles. Built for elbows-out rallycross.', difficulty: 2, theme: 'farm', width: 20, scale: .68,
        knots: [[180, 200], [720, 170], [920, 400], [760, 620], [880, 800], [560, 870], [420, 640], [260, 820], [90, 640], [140, 420]],
        surfaces: [[0, 'tarmac'], [.12, 'gravel'], [.3, 'mud'], [.45, 'gravel'], [.62, 'mud'], [.78, 'gravel']], verge: 'mud', barrier: { distance: 10, hardness: .4 },
        features: [['splash', .48, 18], ['jump', .7, 6]], targets: [64.5, 68.5, 77],
    },
];

function surfaceIndex(list: [number, Surface][], fraction: number) {
    let current = list[0][1];
    for (const [from, surface] of list) if (fraction >= from) current = surface;
    return SURFACES.indexOf(current);
}

function make(spec: Spec): Stage {
    const loop = buildLoop(spec.knots.map(([x, y]) => [x * spec.scale, y * spec.scale]));
    const { points, length } = loop, n = points.length;
    const surfaceAt = new Uint8Array(n), mix: Stage['mix'] = {};
    points.forEach((p, i) => {
        surfaceAt[i] = surfaceIndex(spec.surfaces, p.s / length);
        const surface = SURFACES[surfaceAt[i]];
        mix[surface] = (mix[surface] ?? 0) + 1 / n;
    });
    // Features sit on the straightest road near their authored position.
    const features: Feature[] = spec.features.map(([kind, at, size]) => {
        let best = at * length, flat = Infinity;
        for (let d = -.06; d <= .06; d += .002) {
            const s = mod((at + d) * length, length);
            let bend = 0;
            for (let k = -24; k <= 24 + size; k += 4) bend += points[sampleIndex(loop, s + k)].curvature;
            if (bend < flat) { flat = bend; best = s; }
        }
        return { kind, s: best, length: size };
    });
    // Braking-aware target speed: corner limit, then a backward pass for braking distance (twice round the loop).
    const speedAt = new Float32Array(n);
    for (let i = 0; i < n; i++) {
        const g = GRIP[SURFACES[surfaceAt[i]]];
        speedAt[i] = Math.min(g.top - 1, Math.sqrt(g.corner / Math.max(.0004, points[i].curvature)));
    }
    for (let pass = 0; pass < 2; pass++)
        for (let k = n - 1; k >= 0; k--) {
            const next = speedAt[(k + 1) % n], ds = mod(points[(k + 1) % n].s - points[k].s, length);
            speedAt[k] = Math.min(speedAt[k], Math.sqrt(next * next + 2 * BRAKE_DECEL * GRIP[SURFACES[surfaceAt[k]]].brake * ds));
        }
    const xs = points.map(p => p.x), ys = points.map(p => p.y), pad = 140;
    const stage: Stage = {
        id: spec.id, name: spec.name, region: spec.region, description: spec.description, difficulty: spec.difficulty, theme: spec.theme, width: spec.width,
        points, length, surfaceAt, mix, verge: spec.verge, barrier: spec.barrier, features, speedAt, notes: [],
        bounds: { x: Math.min(...xs) - pad, y: Math.min(...ys) - pad, width: Math.max(...xs) - Math.min(...xs) + pad * 2, height: Math.max(...ys) - Math.min(...ys) + pad * 2 },
        targets: { gold: spec.targets[0], silver: spec.targets[1], bronze: spec.targets[2] },
    };
    stage.notes = paceNotes(stage);
    return stage;
}

export const stages: Stage[] = specs.map(make);
export const stageIds = stages.map(s => s.id);
export const getStage = (id: StageId) => stages.find(s => s.id === id) ?? stages[0];
export const surfaceAt = (stage: Stage, s: number) => SURFACES[stage.surfaceAt[sampleIndex(stage, s)]];
export const speedAt = (stage: Stage, s: number) => stage.speedAt[sampleIndex(stage, s)];
export const nextStage = (id: StageId) => stages[(stages.findIndex(s => s.id === id) + 1) % stages.length].id;
export function featureAt(stage: Stage, s: number, kind: FeatureKind) {
    for (const f of stage.features) if (f.kind === kind && mod(s - f.s, stage.length) <= f.length) return f;
    return null;
}
export const describeSurface: Record<Surface, string> = { tarmac: 'Tarmac', gravel: 'Gravel', sand: 'Sand', mud: 'Mud', snow: 'Snow', ice: 'Ice' };
export const clampWidth = (stage: Stage, offset: number) => clamp(offset, -stage.width * .32, stage.width * .32);
