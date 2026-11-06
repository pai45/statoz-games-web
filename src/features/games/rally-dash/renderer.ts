import { BOX_H, BOX_W, CAR_L, CAR_W, PALETTES, carSprite, dirtSprite, type Palette } from './art';
import { Marks, P, Particles } from './effects';
import { SURFACES, type Car, type CameraMode, type GhostPoint, type RaceEvent, type Session, type Stage, type Surface, type Vec } from './contracts';
import { clamp, forwardDistance, nearest, pointAt, random, wrap } from './geometry';

const TILE_PX = 512, CELL = 40, LIFT = .0042, SUN = { x: .55, y: .83 };
type View = { x0: number; y0: number; x1: number; y1: number };
type PropKind = 'pine' | 'spruce' | 'oak' | 'bush' | 'rock' | 'boulder' | 'cactus' | 'house' | 'bale' | 'tyres' | 'fan';
type Prop = { x: number; y: number; kind: PropKind; r: number; h: number; tone: number; a: number; seed: number };
const TALL: Record<PropKind, boolean> = { pine: true, spruce: true, oak: true, bush: false, rock: false, boulder: true, cactus: true, house: true, bale: false, tyres: false, fan: false };
const SHIRTS = ['#ff5b14', '#ffc629', '#f6f1e7', '#c8202e', '#1f3f8f', '#2f6b3a', '#6d3fa8', '#1b1714'];
const DUST: Record<Surface, number> = { tarmac: P.smoke, gravel: P.gravel, sand: P.sand, mud: P.mud, snow: P.snow, ice: P.ice };

const hash = (text: string) => { let h = 2166136261; for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619); return h >>> 0; };

/** Consecutive road samples that share a surface, as reusable paths. */
function surfaceRuns(stage: Stage) {
    const pts = stage.points, n = pts.length, runs: { surface: Surface; path: Path2D; from: number; to: number }[] = [];
    let start = 0;
    while (start < n && stage.surfaceAt[start] === stage.surfaceAt[n - 1]) start++;
    if (start === n) { const path = new Path2D(); pts.forEach((p, i) => i ? path.lineTo(p.x, p.y) : path.moveTo(p.x, p.y)); path.closePath(); return [{ surface: SURFACES[stage.surfaceAt[0]], path, from: 0, to: n }]; }
    for (let k = 0; k < n;) {
        const i0 = (start + k) % n, surface = stage.surfaceAt[i0], path = new Path2D();
        path.moveTo(pts[i0].x, pts[i0].y);
        let j = k;
        while (j < n && stage.surfaceAt[(start + j) % n] === surface) { const p = pts[(start + j + 1) % n]; path.lineTo(p.x, p.y); j++; }
        runs.push({ surface: SURFACES[surface], path, from: i0, to: (start + j) % n });
        k = j;
    }
    return runs;
}
function loopPath(stage: Stage, offset = 0) {
    const path = new Path2D();
    stage.points.forEach((p, i) => { const x = p.x - Math.sin(p.heading) * offset, y = p.y + Math.cos(p.heading) * offset; if (i) path.lineTo(x, y); else path.moveTo(x, y); });
    path.closePath();
    return path;
}

/** A soft patch stretched along the road (`a` is its heading), so smears read as gravel and mud rather than dots. */
type Blob = { x: number; y: number; r: number; color: string; alpha: number; a: number; stretch: number };
type Puddle = { x: number; y: number; reach: number; heading: number; shapes: { cx: number; cy: number; r: number; water: Path2D; rim: Path2D }[]; clip: Path2D };
type Painter = { stage: Stage; pal: Palette; loop: Path2D; runs: ReturnType<typeof surfaceRuns>; seaY: number; blends: Blob[]; shoulders: Blob[]; puddles: Puddle[] };

/**
 * Where one surface meets the next, the boundary is ragged: patches of each surface intrude into the
 * other, and loose material is carried along the wheel tracks onto the next surface.
 */
function blendBlobs(stage: Stage, pal: Palette, runs: ReturnType<typeof surfaceRuns>) {
    const out: Blob[] = [], half = stage.width / 2;
    if (runs.length < 2) return out;
    runs.forEach((run, k) => {
        const next = runs[(k + 1) % runs.length], s0 = stage.points[run.to].s, from = run.surface, to = next.surface, rng = random(hash(`${stage.id}:blend:${k}`));
        for (let i = 0; i < 220; i++) {
            const u = (rng() * 2 - 1) * 9, v = (rng() * 2 - 1) * (half - .4);
            if (rng() > Math.pow(1 - Math.abs(u) / 9, 1.5)) continue;
            const p = pointAt(stage, s0 + u, v);
            out.push({ x: p.x, y: p.y, r: .5 + rng() * 1.5, color: pal.road[u < 0 ? to : from], alpha: .92, a: p.heading + (rng() - .5) * .5, stretch: 1.5 + rng() * 1.2 });
        }
        if (from === to) return;
        for (const track of [-2.4, 2.4]) {
            const length = 7 + rng() * 12;
            for (let u = 0; u < length; u += .45 + rng() * .8) {
                const p = pointAt(stage, s0 + u, track + (rng() - .5) * .9);
                out.push({ x: p.x, y: p.y, r: .3 + rng() * .45, color: pal.road[from], alpha: .8 * (1 - u / length), a: p.heading, stretch: 2.2 });
            }
        }
    });
    return out;
}

/** Loose road shoulders are uneven: verge material bites into the edge and road grit spills outwards. Tarmac stays crisp. */
function shoulderBlobs(stage: Stage, pal: Palette) {
    const out: Blob[] = [], half = stage.width / 2, rng = random(hash(`${stage.id}:shoulder`)), verge = stage.theme === 'snow' ? '#f4f8fa' : pal.verge;
    stage.points.forEach((p, i) => {
        const surface = SURFACES[stage.surfaceAt[i]];
        if (surface === 'tarmac') return;
        const nx = -Math.sin(p.heading), ny = Math.cos(p.heading);
        for (const side of [-1, 1]) {
            if (rng() < .25) continue;
            const off = side * (half + .5 + (rng() - .5) * 1.8), along = (rng() - .5) * 3, x = p.x + nx * off + Math.cos(p.heading) * along, y = p.y + ny * off + Math.sin(p.heading) * along;
            out.push({ x, y, r: .5 + rng() * 1.2, color: rng() < .6 ? pal.edge : verge, alpha: .85, a: p.heading + (rng() - .5) * .4, stretch: 1.6 + rng() * 1.2 });
            if (rng() < .35) {
                const spill = side * (half + .2 + rng() * 1.2);
                out.push({ x: p.x + nx * spill, y: p.y + ny * spill, r: .3 + rng() * .5, color: pal.road[surface], alpha: .7, a: p.heading + (rng() - .5) * .4, stretch: 2 + rng() });
            }
        }
    });
    return out;
}

/** Each splash is a cluster of wobbly pools along the road, each with a muddy wet rim. */
function puddleShapes(stage: Stage): Puddle[] {
    const half = stage.width / 2;
    return stage.features.filter(f => f.kind === 'splash').map((f, k) => {
        const rng = random(hash(`${stage.id}:puddle:${k}`)), centre = pointAt(stage, f.s + f.length / 2), clip = new Path2D(), shapes: Puddle['shapes'] = [];
        for (let b = 0; b < 3; b++) {
            const c = pointAt(stage, f.s + f.length / 2 + (b - 1) * f.length * .36 + (rng() - .5) * 2, (rng() - .5) * 3.5);
            const along = f.length * .3 + 1.5 + rng() * 3, across = half * (.62 + rng() * .3), p1 = rng() * 6.28, p2 = rng() * 6.28, cos = Math.cos(c.heading), sin = Math.sin(c.heading);
            const outline = (grow: number) => {
                const path = new Path2D();
                for (let j = 0; j <= 28; j++) {
                    const t = j / 28 * Math.PI * 2, wobble = 1 + .13 * Math.sin(3 * t + p1) + .07 * Math.sin(5 * t + p2), lx = Math.cos(t) * (along + grow) * wobble, ly = Math.sin(t) * (across + grow) * wobble;
                    const x = c.x + lx * cos - ly * sin, y = c.y + lx * sin + ly * cos;
                    if (j) path.lineTo(x, y); else path.moveTo(x, y);
                }
                path.closePath();
                return path;
            };
            const water = outline(0);
            clip.addPath(water);
            shapes.push({ cx: c.x, cy: c.y, r: Math.max(along, across) * 1.2, water, rim: outline(1.6) });
        }
        return { x: centre.x, y: centre.y, heading: centre.heading, reach: f.length + half + 8, shapes, clip };
    });
}

export function painterFor(stage: Stage): Painter {
    const minY = Math.min(...stage.points.map(p => p.y)), edge = stage.width / 2 + stage.barrier.distance, pal = PALETTES[stage.theme], runs = surfaceRuns(stage);
    return { stage, pal, loop: loopPath(stage), runs, seaY: minY - edge - 14, blends: blendBlobs(stage, pal, runs), shoulders: shoulderBlobs(stage, pal), puddles: puddleShapes(stage) };
}

function drawBlobs(ctx: CanvasRenderingContext2D, blobs: Blob[], x0: number, y0: number, x1: number, y1: number) {
    for (const b of blobs) {
        if (b.x < x0 - 3 || b.x > x1 + 3 || b.y < y0 - 3 || b.y > y1 + 3) continue;
        ctx.globalAlpha = b.alpha;
        ctx.fillStyle = b.color;
        ctx.beginPath();
        ctx.ellipse(b.x, b.y, b.r * b.stretch, b.r, b.a, 0, 6.2832);
        ctx.fill();
    }
    ctx.globalAlpha = 1;
}

function drawPuddle(ctx: CanvasRenderingContext2D, puddle: Puddle) {
    ctx.fillStyle = 'rgba(48,35,22,.5)';
    for (const shape of puddle.shapes) ctx.fill(shape.rim);
    // Stroke every pool first: the water fills then cover the inner overlaps, leaving only the outer shoreline lit.
    ctx.strokeStyle = 'rgba(226,240,242,.45)';
    ctx.lineWidth = .8;
    for (const shape of puddle.shapes) ctx.stroke(shape.water);
    for (const shape of puddle.shapes) {
        const g = ctx.createRadialGradient(shape.cx, shape.cy, 0, shape.cx, shape.cy, shape.r);
        g.addColorStop(0, 'rgba(38,62,66,.97)');
        g.addColorStop(.7, 'rgba(66,96,99,.95)');
        g.addColorStop(1, 'rgba(104,124,116,.9)');
        ctx.fillStyle = g;
        ctx.fill(shape.water);
    }
    // Sky reflections: soft light streaks at a fixed world angle, clipped to the water.
    ctx.save();
    ctx.clip(puddle.clip);
    ctx.lineCap = 'round';
    const angle = -.55, dx = Math.cos(angle), dy = Math.sin(angle);
    for (let k = -3; k <= 3; k++) {
        const ox = puddle.x - dy * k * 3.4, oy = puddle.y + dx * k * 3.4, len = 3 + (k * k * 7) % 7;
        ctx.strokeStyle = `rgba(214,234,238,${k % 2 ? .1 : .2})`;
        ctx.lineWidth = k % 3 ? .4 : .8;
        ctx.beginPath();
        ctx.moveTo(ox - dx * len, oy - dy * len);
        ctx.lineTo(ox + dx * len, oy + dy * len);
        ctx.stroke();
    }
    ctx.restore();
}

/** Paints the ground, verge, road surfaces, ruts, jumps, splashes and start line for one world region. */
export function paintRegion(ctx: CanvasRenderingContext2D, painter: Painter, x0: number, y0: number, x1: number, y1: number, seed: number, detail = 1) {
    const { stage, pal } = painter, rng = random(seed), w = x1 - x0, h = y1 - y0, road = stage.width;
    ctx.fillStyle = pal.ground;
    ctx.fillRect(x0, y0, w, h);
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    // Theme ground texture, laid out in world space so tiles meet cleanly.
    if (stage.theme === 'farm') {
        const cell = 70;
        for (let cx = Math.floor(x0 / cell); cx * cell < x1; cx++)
            for (let cy = Math.floor(y0 / cell); cy * cell < y1; cy++) {
                const r = random(hash(`${cx}:${cy}`))(), tone = r < .33 ? pal.groundDark : r < .66 ? pal.groundLight : '#8c7a3d';
                ctx.globalAlpha = .55;
                ctx.fillStyle = tone;
                ctx.fillRect(cx * cell, cy * cell, cell, cell);
                ctx.globalAlpha = .18;
                ctx.strokeStyle = '#3d3a1a';
                ctx.lineWidth = .8;
                ctx.beginPath();
                const across = r > .5;
                for (let k = 3; k < cell; k += 5) { if (across) { ctx.moveTo(cx * cell, cy * cell + k); ctx.lineTo(cx * cell + cell, cy * cell + k); } else { ctx.moveTo(cx * cell + k, cy * cell); ctx.lineTo(cx * cell + k, cy * cell + cell); } }
                ctx.stroke();
            }
        ctx.globalAlpha = 1;
    }
    if (stage.theme === 'desert') {
        ctx.strokeStyle = pal.groundDark;
        ctx.globalAlpha = .22;
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        for (let k = Math.floor(y0 / 11); k * 11 < y1 + 11; k++) for (let x = x0; x <= x1; x += 6) { const y = k * 11 + Math.sin(x * .045 + k * 1.7) * 3.2; if (x === x0) ctx.moveTo(x, y); else ctx.lineTo(x, y); }
        ctx.stroke();
        ctx.globalAlpha = 1;
    }
    const specks = Math.round(w * h / 38 * detail);
    for (let i = 0; i < specks; i++) {
        ctx.globalAlpha = .3 + rng() * .3;
        ctx.fillStyle = i % 3 ? pal.groundDark : pal.groundLight;
        const size = .5 + rng() * (stage.theme === 'snow' ? 1.2 : 2);
        ctx.fillRect(x0 + rng() * w, y0 + rng() * h, size, size);
    }
    ctx.globalAlpha = 1;
    if (stage.theme === 'coast' && y0 < painter.seaY) {
        ctx.fillStyle = '#2f6f86';
        ctx.fillRect(x0, y0, w, painter.seaY - y0);
        ctx.strokeStyle = '#9fd0dc';
        ctx.globalAlpha = .35;
        ctx.lineWidth = .9;
        ctx.beginPath();
        for (let k = Math.floor(y0 / 9); k * 9 < painter.seaY - 6; k++) for (let x = Math.floor(x0 / 30) * 30; x < x1; x += 30) { const y = k * 9 + Math.sin(x * .3 + k) * 2; ctx.moveTo(x + (k % 2) * 15, y); ctx.lineTo(x + (k % 2) * 15 + 12, y); }
        ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#8a8377';
        ctx.fillRect(x0, painter.seaY - 2, w, 4);
    }
    if (stage.theme === 'forest' || stage.theme === 'snow') {
        for (let i = 0; i < 14 * detail * w * h / 16000; i++) {
            ctx.globalAlpha = stage.theme === 'snow' ? .45 : .22;
            ctx.fillStyle = stage.theme === 'snow' ? '#cdd9e0' : pal.groundDark;
            ctx.beginPath();
            ctx.ellipse(x0 + rng() * w, y0 + rng() * h, 6 + rng() * 14, 3 + rng() * 7, rng() * 3, 0, 6.28);
            ctx.fill();
        }
    }
    ctx.globalAlpha = 1;
    // Verge out to the stage edge, then the road shoulder.
    const verge = road + stage.barrier.distance * 2;
    if (stage.theme === 'snow') {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = verge + 5;
        ctx.stroke(painter.loop);
        ctx.strokeStyle = '#c4d1d9';
        ctx.lineWidth = verge + 1;
        ctx.stroke(painter.loop);
    }
    ctx.globalAlpha = stage.theme === 'desert' ? .5 : .7;
    ctx.strokeStyle = pal.verge;
    ctx.lineWidth = verge;
    ctx.stroke(painter.loop);
    ctx.globalAlpha = 1;
    ctx.strokeStyle = pal.edge;
    ctx.lineWidth = road + 2.6;
    ctx.stroke(painter.loop);
    // Surfaces end flat (no round caps), then a ragged blend hides the seam.
    ctx.lineCap = 'butt';
    for (const run of painter.runs) {
        ctx.strokeStyle = pal.road[run.surface];
        ctx.lineWidth = road;
        ctx.stroke(run.path);
    }
    drawBlobs(ctx, painter.shoulders, x0, y0, x1, y1);
    drawBlobs(ctx, painter.blends, x0, y0, x1, y1);
    // Road detail: ruts on loose surfaces, painted lines on tarmac, gloss on ice.
    const pts = stage.points, n = pts.length;
    for (const run of painter.runs) {
        const surface = run.surface;
        if (surface === 'tarmac') {
            ctx.strokeStyle = '#efe6cf';
            ctx.globalAlpha = .75;
            ctx.lineWidth = .45;
            ctx.setLineDash([4, 5]);
            ctx.stroke(run.path);
            ctx.setLineDash([]);
            ctx.globalAlpha = 1;
            continue;
        }
        ctx.strokeStyle = pal.detail[surface];
        ctx.globalAlpha = surface === 'ice' ? .65 : .4;
        ctx.lineWidth = surface === 'ice' ? .7 : 1.5;
        for (const off of [-2.4, 2.4]) {
            ctx.beginPath();
            let i = run.from, started = false, guard = 0;
            while (guard++ <= n) {
                const p = pts[i];
                if (p.x > x0 - 20 && p.x < x1 + 20 && p.y > y0 - 20 && p.y < y1 + 20) {
                    const x = p.x - Math.sin(p.heading) * off, y = p.y + Math.cos(p.heading) * off;
                    if (started) ctx.lineTo(x, y); else { ctx.moveTo(x, y); started = true; }
                }
                else started = false;
                if (i === run.to) break;
                i = (i + 1) % n;
            }
            ctx.stroke();
        }
        ctx.globalAlpha = 1;
    }
    for (let i = 0; i < n; i++) {
        const p = pts[i];
        if (p.x < x0 - road || p.x > x1 + road || p.y < y0 - road || p.y > y1 + road) continue;
        const surface = SURFACES[stage.surfaceAt[i]];
        if (surface === 'tarmac') continue;
        ctx.fillStyle = pal.detail[surface];
        for (let k = 0; k < 5 * detail; k++) {
            const off = (rng() - .5) * road * .95, along = (rng() - .5) * 4, x = p.x + Math.cos(p.heading) * along - Math.sin(p.heading) * off, y = p.y + Math.sin(p.heading) * along + Math.cos(p.heading) * off;
            ctx.globalAlpha = .35 + rng() * .35;
            ctx.fillRect(x, y, .5 + rng() * .8, .5 + rng() * .8);
        }
    }
    ctx.globalAlpha = 1;
    // Jump crests, then the puddles.
    for (const f of stage.features) {
        if (f.kind !== 'jump') continue;
        const mid = pointAt(stage, f.s + f.length / 2);
        if (mid.x < x0 - 40 || mid.x > x1 + 40 || mid.y < y0 - 40 || mid.y > y1 + 40) continue;
        ctx.save();
        ctx.translate(mid.x, mid.y);
        ctx.rotate(mid.heading);
        const g = ctx.createLinearGradient(-f.length / 2, 0, f.length / 2, 0);
        g.addColorStop(0, 'rgba(255,255,255,0)');
        g.addColorStop(.85, 'rgba(255,246,216,.55)');
        g.addColorStop(1, 'rgba(255,246,216,.7)');
        ctx.fillStyle = g;
        ctx.fillRect(-f.length / 2, -road / 2, f.length, road);
        ctx.fillStyle = 'rgba(0,0,0,.32)';
        ctx.fillRect(f.length / 2, -road / 2, 2.2, road);
        ctx.fillStyle = '#ffc629';
        for (const side of [-1, 1]) for (let k = 0; k < 3; k++) ctx.fillRect(-f.length / 2 + k * 2.6, side * (road / 2 + 1.2) - .5, 1.6, 1);
        ctx.restore();
    }
    for (const puddle of painter.puddles)
        if (puddle.x > x0 - puddle.reach && puddle.x < x1 + puddle.reach && puddle.y > y0 - puddle.reach && puddle.y < y1 + puddle.reach) drawPuddle(ctx, puddle);
    // Start and finish line.
    const start = pointAt(stage, 0);
    ctx.save();
    ctx.translate(start.x, start.y);
    ctx.rotate(start.heading);
    for (let x = 0; x < 2; x++) for (let y = -road / 2; y < road / 2 - .1; y += 1.4) { ctx.fillStyle = (Math.round((y + road / 2) / 1.4) + x) % 2 ? '#f6f1e7' : '#15120f'; ctx.fillRect(x * 1.4 - 1.4, y, 1.4, 1.4); }
    ctx.restore();
}

function buildProps(stage: Stage): Prop[] {
    const rng = random(hash(stage.id)), props: Prop[] = [], L = stage.length, edge = stage.width / 2 + stage.barrier.distance, theme = stage.theme;
    const clear = (x: number, y: number, r: number, gap = .6) => nearest(stage, { x, y }).distance > edge + r * gap;
    const add = (x: number, y: number, kind: PropKind, r: number, h: number) => props.push({ x, y, kind, r, h, tone: rng(), a: rng() * Math.PI, seed: Math.floor(rng() * 1000) });
    const sizes: Record<PropKind, [number, number, number, number]> = { pine: [3.2, 5.4, 11, 16], spruce: [3, 5, 10, 15], oak: [5, 8, 8, 11], bush: [1.6, 3, 1, 1.6], rock: [1.2, 2.6, 1.2, 2.4], boulder: [3, 7, 4, 8], cactus: [1.1, 1.6, 4, 6], house: [6, 9, 6, 8], bale: [1.4, 1.7, 1.8, 2.2], tyres: [1.3, 1.4, 1.1, 1.3], fan: [.55, .65, 1.6, 1.8] };
    const make = (kind: PropKind, x: number, y: number, gap = .6) => {
        const [r0, r1, h0, h1] = sizes[kind], r = r0 + rng() * (r1 - r0), h = h0 + rng() * (h1 - h0);
        if (clear(x, y, r, gap)) add(x, y, kind, r, h);
    };
    const rowKind = (): PropKind | null => theme === 'forest' ? (rng() < .86 ? 'pine' : 'rock') : theme === 'snow' ? (rng() < .9 ? 'spruce' : 'rock') : theme === 'desert' ? (rng() < .55 ? 'boulder' : 'cactus') : theme === 'farm' ? (rng() < .55 ? 'bale' : 'tyres') : null;
    const rowStep = { forest: 6, snow: 7, desert: 24, coast: 0, farm: 6 }[theme];
    if (rowStep)
        for (let s = 0; s < L; s += rowStep * (.7 + rng() * .6))
            for (const side of [-1, 1]) {
                if (rng() < (theme === 'farm' ? .35 : .1)) continue;
                const kind = rowKind();
                if (!kind) continue;
                const p = pointAt(stage, s, side * (edge + sizes[kind][1] * .7 + rng() * 2.5));
                make(kind, p.x, p.y, .3);
            }
    const b = stage.bounds, fill = { forest: 1000, snow: 650, desert: 150, coast: 420, farm: 130 }[theme];
    const fillKind = (): PropKind => theme === 'forest' ? (rng() < .9 ? 'pine' : 'bush') : theme === 'snow' ? (rng() < .85 ? 'spruce' : 'rock') : theme === 'desert' ? (rng() < .45 ? 'cactus' : rng() < .6 ? 'boulder' : 'bush') : theme === 'coast' ? (rng() < .3 ? 'house' : rng() < .5 ? 'oak' : 'bush') : (rng() < .6 ? 'oak' : 'bush');
    const seaY = Math.min(...stage.points.map(p => p.y)) - edge - 14;
    for (let i = 0; i < fill; i++) {
        const kind = fillKind(), x = b.x + rng() * b.width, y = b.y + rng() * b.height;
        if (theme === 'coast' && y < seaY + 8) continue;
        make(kind, x, y, kind === 'house' ? 2.2 : 1.2);
    }
    // Spectators on the outside of hairpins and beside the jumps.
    for (const note of stage.notes) {
        if (!((note.kind === 'left' || note.kind === 'right') && note.severity <= 2) && note.kind !== 'jump') continue;
        const mid = note.kind === 'jump' ? note.s : note.s + forwardDistance(note.s, note.end, L) / 2, side = note.kind === 'right' ? -1 : note.kind === 'left' ? 1 : rng() < .5 ? -1 : 1;
        for (let k = 0; k < 14; k++) {
            const p = pointAt(stage, mid + (rng() - .5) * 18, side * (edge + 2.2 + rng() * 4.5));
            if (nearest(stage, p).distance > edge + 1.5) add(p.x, p.y, 'fan', .9, 1.9);
        }
    }
    return props;
}

export type RenderOptions = { follow?: number; attract?: boolean };
export class RallyRenderer {
    private ctx: CanvasRenderingContext2D;
    private painter: Painter;
    private props: Prop[];
    private grid = new Map<number, Prop[]>();
    private tiles = new Map<string, HTMLCanvasElement>();
    private ppu = 3;
    private tileWorld = TILE_PX / 3;
    /** Tiles kept painted: what is on screen plus a small margin, so a lap never holds the whole stage. */
    private tileCap = 12;
    private w = 1;
    private h = 1;
    private dpr = 1;
    private sprites = new Map<number, { canvas: HTMLCanvasElement; pad: number }>();
    private dirt: HTMLCanvasElement | null = null;
    private spriteScale = .55;
    private vignette: HTMLCanvasElement | null = null;
    private cam = { x: 0, y: 0, angle: 0, zoom: 3, seeded: false };
    private shake = 0;
    private rng = random(99);
    private emitCarry = new Float32Array(8);
    private lastMark = new Float32Array(8 * 4).fill(NaN);
    readonly particles: Particles;
    readonly marks: Marks;
    camera: CameraMode = 'chase';
    /** Extra camera zoom, used for staged stills such as the cover render. */
    zoomScale = 1;
    quality = 1;
    paintedTiles = 0;
    lastRenderMs = 0;
    constructor(private canvas: HTMLCanvasElement, readonly stage: Stage, private options: RenderOptions = {}) {
        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) throw Error('Canvas 2D is unavailable');
        this.ctx = ctx;
        this.painter = painterFor(stage);
        this.props = buildProps(stage);
        for (const p of this.props) {
            const key = Math.floor(p.x / CELL) * 65536 + Math.floor(p.y / CELL);
            const list = this.grid.get(key);
            if (list) list.push(p); else this.grid.set(key, [p]);
        }
        this.particles = new Particles(options.attract ? 300 : 700);
        this.marks = new Marks(options.attract ? 1200 : 2400);
    }
    resize(w: number, h: number, dpr: number) {
        const ratio = Math.min(dpr, this.quality ? 2 : 1.25, this.options.attract ? 1 : 3);
        this.w = Math.max(1, w);
        this.h = Math.max(1, h);
        this.dpr = ratio;
        this.canvas.width = Math.round(this.w * ratio);
        this.canvas.height = Math.round(this.h * ratio);
        const ppu = Math.round(clamp(this.baseZoom() * ratio * .6, 2, 4) * 4) / 4;
        if (Math.abs(ppu - this.ppu) > .01) { this.ppu = ppu; this.tileWorld = TILE_PX / ppu; this.tiles.clear(); }
        const scale = Math.round(clamp(this.baseZoom() * ratio * CAR_W / BOX_W * 1.4, .25, 1.2) * 20) / 20;
        if (scale !== this.spriteScale) { this.spriteScale = scale; this.sprites.clear(); this.dirt = null; }
        this.vignette = null;
    }
    setQuality(level: number) {
        this.quality = level;
        this.particles.budget = level ? 1 : .45;
    }
    /** Closer on short (phone) screens so the cars read clearly; capped on big screens to keep look-ahead. */
    private baseZoom() { return clamp(this.h / 86, 3.6, 7); }
    private sprite(crew: number) {
        let s = this.sprites.get(crew);
        if (!s) { s = carSprite(crew, this.spriteScale); this.sprites.set(crew, s); }
        return s;
    }
    private tile(tx: number, ty: number, paint: boolean) {
        const key = `${tx},${ty}`, found = this.tiles.get(key);
        if (found) { this.tiles.delete(key); this.tiles.set(key, found); return found; }
        if (!paint) return null;
        const canvas = document.createElement('canvas'), pad = 2;
        canvas.width = canvas.height = TILE_PX + pad * 2;
        const ctx = canvas.getContext('2d', { alpha: false })!, x0 = tx * this.tileWorld - pad / this.ppu, y0 = ty * this.tileWorld - pad / this.ppu;
        ctx.setTransform(this.ppu, 0, 0, this.ppu, -x0 * this.ppu, -y0 * this.ppu);
        paintRegion(ctx, this.painter, x0, y0, x0 + (TILE_PX + pad * 2) / this.ppu, y0 + (TILE_PX + pad * 2) / this.ppu, hash(`${this.stage.id}:${tx}:${ty}`));
        this.tiles.set(key, canvas);
        this.paintedTiles++;
        while (this.tiles.size > this.tileCap) this.tiles.delete(this.tiles.keys().next().value!);
        return canvas;
    }
    /** Screen-space shake, puffs and bursts for simulation events. */
    events(events: RaceEvent[], s: Session, reduced: boolean) {
        const follow = this.options.follow ?? 0;
        for (const e of events) {
            const c = s.cars[e.car];
            if (!c) continue;
            const mine = e.car === follow, dust = DUST[c.surface];
            if (e.type === 'land') { this.puffs(c, dust, 10, 7, .45); if (c.surface === 'mud') this.chips(c, P.clod, 10, 12); if (mine && !reduced) this.shake = Math.max(this.shake, 3 + e.power * 7); }
            if (e.type === 'crash') { this.chips(c, P.debris, 10, 13); this.puffs(c, dust, 7, 6, .4); if (mine && !reduced) this.shake = Math.max(this.shake, 4 + e.power * 10); }
            if (e.type === 'contact') { this.chips(c, P.spark, 12, 16); if (mine && !reduced) this.shake = Math.max(this.shake, 3 + e.power * 4); }
            if (e.type === 'splash') { this.chips(c, P.droplet, 34, 15); this.puffs(c, P.water, 10, 8, .45); if (mine && !reduced) this.shake = Math.max(this.shake, 2.5); }
            if (e.type === 'launch') this.puffs(c, dust, 5, 4, .35);
            if (e.type === 'recover') this.puffs(c, P.smoke, 8, 3, .4);
        }
    }
    /** Soft billowing cloud around a car. */
    private puffs(c: Car, kind: number, count: number, speed: number, alpha: number) {
        for (let i = 0; i < count; i++) {
            const a = this.rng() * Math.PI * 2, v = speed * (.3 + this.rng() * .8);
            this.particles.emit(c.x + Math.cos(a) * 2, c.y + Math.sin(a) * 2, Math.cos(a) * v + c.vx * .25, Math.sin(a) * v + c.vy * .25, 1 + this.rng() * 1.2, 1.8 + this.rng() * 1.4, 3.2, alpha, kind, 1, 1.4);
        }
    }
    /** Small crisp pieces flung outwards: sparks, debris, clods, droplets. */
    private chips(c: Car, kind: number, count: number, speed: number) {
        for (let i = 0; i < count; i++) {
            const a = this.rng() * Math.PI * 2, v = speed * (.4 + this.rng() * .8);
            this.particles.emit(c.x + Math.cos(a) * 1.4, c.y + Math.sin(a) * 1.4, Math.cos(a) * v + c.vx * .3, Math.sin(a) * v + c.vy * .3, .3 + this.rng() * .35, kind === P.spark ? .28 : .42, 0, .95, kind, 0, 3.4);
        }
    }
    /** Continuous dust, spray, smoke, ripples and tyre tracks, emitted at frame rate from interpolated poses. */
    private emit(c: Car, x: number, y: number, heading: number, dt: number, mine: boolean) {
        const slot = c.id % 8, o = slot * 4;
        if (c.air > 0 || c.speed < 1.5) { this.lastMark[o] = this.lastMark[o + 2] = NaN; return; }
        const cos = Math.cos(heading), sin = Math.sin(heading), surface = c.surface, loose = surface !== 'tarmac';
        const rate = loose ? (c.speed * .45 + c.slip * 2) * (mine ? 1 : .6) : c.slip > 3.5 || c.handbrake ? c.slip * 1.8 : 0;
        this.emitCarry[slot] += rate * dt;
        while (this.emitCarry[slot] >= 1) {
            this.emitCarry[slot]--;
            const side = this.rng() < .5 ? -1 : 1, rx = x - cos * 2.8 - sin * side * 1.5, ry = y - sin * 2.8 + cos * side * 1.5;
            const back = c.speed * (.1 + this.rng() * .12), fling = (this.rng() - .5) * 5 + side * c.slip * .45;
            const alpha = surface === 'snow' ? .62 : surface === 'ice' ? .45 : surface === 'mud' ? .42 : loose ? .5 : .32;
            this.particles.emit(rx, ry, -cos * back - sin * fling, -sin * back + cos * fling, 1 + this.rng() * (loose ? 1.3 : .8), 1.3 + this.rng() * .9, loose ? 2.8 : 2.2, alpha, DUST[surface], 1, 1.5);
            if (surface === 'mud' && this.rng() < .55) this.particles.emit(rx, ry, -cos * c.speed * .3 + (this.rng() - .5) * 9, -sin * c.speed * .3 + (this.rng() - .5) * 9, .4 + this.rng() * .2, .42, 0, .95, P.clod, 0, 2.6);
            if (c.offroad && (this.stage.theme === 'forest' || this.stage.theme === 'farm') && this.rng() < .3) this.particles.emit(rx, ry, (this.rng() - .5) * 6, (this.rng() - .5) * 6, .5, .32, 0, .9, P.grass, 0, 3);
        }
        if (c.inWater) {
            for (const side of [-1, 1]) {
                const wx = x - sin * side * 1.7, wy = y + cos * side * 1.7;
                this.particles.emit(wx, wy, -sin * side * (5 + this.rng() * 8) + c.vx * .25, cos * side * (5 + this.rng() * 8) + c.vy * .25, .35 + this.rng() * .25, .3, 0, .9, P.droplet, 1, 2.4);
                if (this.rng() < .2) this.particles.emit(wx - cos * 2.6, wy - sin * 2.6, c.vx * .05, c.vy * .05, .8, .5, 3, .38, P.ripple, 0, 3);
            }
            if (this.rng() < .5) this.particles.emit(x - cos * 3, y - sin * 3, -cos * 3 + (this.rng() - .5) * 4, -sin * 3 + (this.rng() - .5) * 4, .8, 1.2, 2.4, .42, P.water, 1, 1.8);
        }
        // Tyre tracks: grooves on loose ground, rubber on tarmac when sliding. Each rear wheel keeps its own last
        // point; a gap longer than a few units (off screen, a recovery, a jump) starts a new track instead of bridging it.
        const kind: 0 | 1 = loose ? 1 : 0;
        const marking = !c.inWater && (kind === 0 ? c.slip > 3.2 || (c.braking && c.speed > 12) || c.handbrake : mine || c.slip >= 2.5);
        if (!marking) { this.lastMark[o] = this.lastMark[o + 2] = NaN; return; }
        for (const side of [-1, 1]) {
            const k = o + (side < 0 ? 0 : 2), wx = x - cos * 2.6 - sin * side * 1.55, wy = y - sin * 2.6 + cos * side * 1.55, lx = this.lastMark[k], ly = this.lastMark[k + 1];
            if (!Number.isNaN(lx)) {
                const d = Math.hypot(wx - lx, wy - ly);
                if (d < 1.1) continue;
                if (d < 3.5) this.marks.add(lx, ly, wx, wy, kind);
            }
            this.lastMark[k] = wx;
            this.lastMark[k + 1] = wy;
        }
    }
    private view(ax: number, ay: number): View {
        const { cam } = this, rot = this.camera === 'chase' ? cam.angle + Math.PI / 2 : 0, c = Math.cos(rot), s = Math.sin(rot);
        let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
        for (const [sx, sy] of [[0, 0], [this.w, 0], [0, this.h], [this.w, this.h]]) {
            const dx = (sx - ax) / cam.zoom, dy = (sy - ay) / cam.zoom, x = cam.x + dx * c - dy * s, y = cam.y + dx * s + dy * c;
            x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y);
        }
        return { x0: x0 - 14, y0: y0 - 14, x1: x1 + 14, y1: y1 + 14 };
    }
    render(s: Session, alpha: number, dt: number, reduced = false) {
        const started = performance.now(), ctx = this.ctx, follow = s.cars[this.options.follow ?? 0] ?? s.cars[0];
        const moving = s.phase === 'running', f = moving ? alpha : 1;
        const pose = (c: Car) => ({ x: c.px + (c.x - c.px) * f, y: c.py + (c.y - c.py) * f, heading: c.ph + wrap(c.heading - c.ph) * f });
        const me = pose(follow), chase = this.camera === 'chase';
        const travel = follow.speed > 4 ? Math.atan2(follow.vy, follow.vx) : me.heading, aim = me.heading + wrap(travel - me.heading) * .5;
        const speedFactor = clamp(follow.speed / 50, 0, 1), zoom = this.baseZoom() * (1 - .14 * speedFactor) * (chase ? 1 : .92) * this.zoomScale;
        const lead = reduced ? 6 : Math.min(chase ? 10 : 30, follow.speed * (chase ? .2 : .5)), tx = me.x + Math.cos(aim) * lead, ty = me.y + Math.sin(aim) * lead;
        const cam = this.cam, k = 1 - Math.exp(-Math.min(dt, .1) * 9);
        if (!cam.seeded || dt === 0 || Math.hypot(tx - cam.x, ty - cam.y) > 80) { Object.assign(cam, { x: tx, y: ty, angle: aim, zoom, seeded: true }); }
        else {
            cam.x += (tx - cam.x) * k;
            cam.y += (ty - cam.y) * k;
            cam.angle += wrap(aim - cam.angle) * (1 - Math.exp(-Math.min(dt, .1) * 4.5));
            cam.zoom += (zoom - cam.zoom) * (1 - Math.exp(-Math.min(dt, .1) * 2));
        }
        this.shake *= Math.exp(-Math.min(dt, .1) * 8);
        if (this.shake < .05 || reduced) this.shake = 0;
        const ax = this.w / 2 + (this.rng() - .5) * this.shake, ay = (chase ? this.h * .7 : this.h / 2) + (this.rng() - .5) * this.shake;
        ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
        ctx.fillStyle = this.painter.pal.ground;
        ctx.fillRect(0, 0, this.w, this.h);
        ctx.save();
        ctx.translate(ax, ay);
        ctx.scale(cam.zoom, cam.zoom);
        if (chase) ctx.rotate(-cam.angle - Math.PI / 2);
        ctx.translate(-cam.x, -cam.y);
        const view = this.view(ax, ay);
        // Ground tiles: paint at most two new tiles a frame once the race is under way.
        let budget = this.paintedTiles === 0 || s.phase === 'intro' ? 99 : 2;
        const tw = this.tileWorld, pad = 2 / this.ppu;
        this.tileCap = Math.max(12, (Math.floor(view.x1 / tw) - Math.floor(view.x0 / tw) + 1) * (Math.floor(view.y1 / tw) - Math.floor(view.y0 / tw) + 1) + 6);
        for (let ty = Math.floor(view.y0 / tw); ty * tw < view.y1; ty++)
            for (let tx = Math.floor(view.x0 / tw); tx * tw < view.x1; tx++) {
                const had = this.tiles.has(`${tx},${ty}`), tile = this.tile(tx, ty, budget > 0);
                if (!had && tile) budget--;
                if (tile) ctx.drawImage(tile, tx * tw - pad, ty * tw - pad, tw + pad * 2, tw + pad * 2);
            }
        // Tyre tracks, ghost and the low layer of scenery.
        const pal = this.painter.pal;
        this.marks.draw(ctx, 1, '#1a120a', .2, .62, view);
        this.marks.draw(ctx, 0, '#120f0d', .45, .64, view);
        if (s.ghost && s.setup.mode === 'stage' && s.phase !== 'intro') {
            const g = ghostAt(s.ghost.samples, s.raceClock - s.cars[0].lapStart);
            if (g) this.drawCar(s.cars[0].crew, g.x, g.y, g.heading, 1, .35, null);
        }
        const props = this.visibleProps(view);
        const t = s.clock;
        for (const p of props) this.drawShadow(p);
        if (this.stage.theme === 'coast') this.drawWalls(view);
        for (const p of props) if (!TALL[p.kind]) this.drawLow(p, t, me);
        // Cars: shadow, spray below, body, dirt.
        const poses = s.cars.map(pose);
        for (let i = 0; i < s.cars.length; i++) {
            const c = s.cars[i], p = poses[i];
            if (p.x < view.x0 || p.x > view.x1 || p.y < view.y0 || p.y > view.y1) continue;
            if (moving && dt > 0) this.emit(c, p.x, p.y, p.heading, dt, i === (this.options.follow ?? 0));
            const lift = c.air > 0 && c.airTime > 0 ? Math.sin(Math.PI * (1 - c.air / c.airTime)) : 0;
            ctx.save();
            ctx.translate(p.x + .5 + SUN.x * lift * 4, p.y + .8 + SUN.y * lift * 4);
            ctx.rotate(p.heading + Math.PI / 2);
            ctx.fillStyle = `rgba(0,0,0,${.32 - lift * .14})`;
            ctx.beginPath();
            ctx.ellipse(0, 0, CAR_W * .62, CAR_L * .56, 0, 0, 6.28);
            ctx.fill();
            ctx.restore();
        }
        this.particles.draw(ctx, 0, view);
        const followIndex = this.options.follow ?? 0;
        const car = (i: number) => {
            const c = s.cars[i], p = poses[i];
            if (p.x < view.x0 || p.x > view.x1 || p.y < view.y0 || p.y > view.y1) return;
            const lift = c.air > 0 && c.airTime > 0 ? Math.sin(Math.PI * (1 - c.air / c.airTime)) : 0;
            if (i === 0 && s.setup.mode === 'rallycross' && !this.options.attract) {
                ctx.strokeStyle = 'rgba(255,198,41,.85)';
                ctx.lineWidth = .5;
                ctx.beginPath();
                ctx.arc(p.x, p.y, 6.2, 0, 6.28);
                ctx.stroke();
            }
            this.drawCar(c.crew, p.x, p.y, p.heading, 1 + lift * .32, 1, c, pal.dirt);
        };
        for (let i = 0; i < s.cars.length; i++) if (i !== followIndex) car(i);
        if (moving) this.particles.update(dt);
        // Rivals disappear into the dust; your own car always stays readable on top of it.
        this.particles.draw(ctx, 1, view);
        car(followIndex);
        for (const p of props) if (TALL[p.kind]) this.drawTall(p, me);
        this.drawArch(me);
        ctx.restore();
        if (!this.vignette) this.vignette = makeVignette(this.w, this.h, pal.fog);
        ctx.drawImage(this.vignette, 0, 0, this.w, this.h);
        this.lastRenderMs = performance.now() - started;
    }
    private drawCar(crew: number, x: number, y: number, heading: number, scale: number, alpha: number, c: Car | null, dirt?: string) {
        const ctx = this.ctx, sprite = this.sprite(crew), u = CAR_W / BOX_W * scale;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(heading + Math.PI / 2);
        ctx.scale(u, u);
        ctx.globalAlpha = alpha;
        const w = sprite.canvas.width / this.spriteScale, h = sprite.canvas.height / this.spriteScale;
        ctx.drawImage(sprite.canvas, -BOX_W / 2 - sprite.pad, -BOX_H / 2 - sprite.pad, w, h);
        if (c && dirt && c.dirt > .02) {
            if (!this.dirt) this.dirt = dirtSprite(dirt, this.spriteScale);
            ctx.globalAlpha = Math.min(.9, c.dirt);
            ctx.drawImage(this.dirt, -BOX_W / 2 - sprite.pad, -BOX_H / 2 - sprite.pad, w, h);
        }
        if (c && c.braking && c.air <= 0) {
            ctx.globalAlpha = .9;
            ctx.fillStyle = '#ff3b22';
            ctx.fillRect(-36, BOX_H / 2 - 12, 12, 6);
            ctx.fillRect(24, BOX_H / 2 - 12, 12, 6);
            ctx.globalAlpha = .28;
            ctx.beginPath();
            ctx.arc(-30, BOX_H / 2 - 6, 16, 0, 6.28);
            ctx.arc(30, BOX_H / 2 - 6, 16, 0, 6.28);
            ctx.fill();
        }
        ctx.restore();
    }
    private visibleProps(view: View) {
        const out: Prop[] = [];
        for (let cx = Math.floor((view.x0 - 12) / CELL); cx <= Math.floor((view.x1 + 12) / CELL); cx++)
            for (let cy = Math.floor((view.y0 - 12) / CELL); cy <= Math.floor((view.y1 + 12) / CELL); cy++) {
                const list = this.grid.get(cx * 65536 + cy);
                if (list) for (const p of list) out.push(p);
            }
        return out;
    }
    private lift(p: Vec, h: number) { return { x: p.x + (p.x - this.cam.x) * LIFT * h, y: p.y + (p.y - this.cam.y) * LIFT * h }; }
    private drawShadow(p: Prop) {
        if (p.h < 1.5) return;
        const ctx = this.ctx, len = p.h * .16;
        ctx.fillStyle = 'rgba(0,0,0,.22)';
        ctx.beginPath();
        if (p.kind === 'house') { ctx.save(); ctx.translate(p.x + SUN.x * len, p.y + SUN.y * len); ctx.rotate(p.a); ctx.fillRect(-p.r, -p.r * .65, p.r * 2, p.r * 1.3); ctx.restore(); return; }
        ctx.ellipse(p.x + SUN.x * len, p.y + SUN.y * len, p.r * 1.05, p.r * .95, 0, 0, 6.28);
        ctx.fill();
    }
    private drawLow(p: Prop, t: number, me: Vec) {
        const ctx = this.ctx;
        if (p.kind === 'fan') {
            const near = Math.hypot(p.x - me.x, p.y - me.y) < 70, bob = near ? Math.abs(Math.sin(t * 9 + p.seed)) * .5 : 0;
            const body = this.lift(p, .9), head = this.lift(p, p.h + bob);
            ctx.fillStyle = SHIRTS[p.seed % SHIRTS.length];
            ctx.beginPath(); ctx.arc(body.x, body.y, p.r, 0, 6.28); ctx.fill();
            ctx.fillStyle = ['#f1c9a5', '#c68f62', '#8a5a3c', '#e8b48a'][p.seed % 4];
            ctx.beginPath(); ctx.arc(head.x, head.y, p.r * .62, 0, 6.28); ctx.fill();
            if (near && p.seed % 3 === 0) { ctx.strokeStyle = ctx.fillStyle; ctx.lineWidth = .22; ctx.beginPath(); ctx.moveTo(head.x, head.y); ctx.lineTo(head.x + (head.x - body.x) * 1.4 + .4, head.y + (head.y - body.y) * 1.4 - .4); ctx.stroke(); }
            return;
        }
        const top = this.lift(p, p.h), colors: Record<string, [string, string]> = {
            bush: this.stage.theme === 'desert' ? ['#7a7a3c', '#9a9a52'] : ['#2d4a26', '#456b34'], rock: this.stage.theme === 'snow' ? ['#7d8a92', '#f2f6f8'] : ['#5e5a52', '#8f897c'],
            bale: ['#a7802f', '#e2bb5b'], tyres: ['#141414', '#2c2c2c'],
        };
        const [base, cap] = colors[p.kind] ?? ['#555', '#888'];
        ctx.fillStyle = base;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.28); ctx.fill();
        ctx.fillStyle = cap;
        ctx.beginPath(); ctx.arc(top.x, top.y, p.r * (p.kind === 'bush' ? .85 : .92), 0, 6.28); ctx.fill();
        if (p.kind === 'bale') { ctx.strokeStyle = '#a7802f'; ctx.lineWidth = .18; ctx.beginPath(); ctx.arc(top.x, top.y, p.r * .55, 0, 5); ctx.stroke(); }
        if (p.kind === 'tyres') { ctx.fillStyle = '#0b0b0b'; ctx.beginPath(); ctx.arc(top.x, top.y, p.r * .45, 0, 6.28); ctx.fill(); }
    }
    private drawTall(p: Prop, me: Vec) {
        const ctx = this.ctx, near = Math.hypot(p.x - me.x, p.y - me.y) < p.r + 5;
        ctx.globalAlpha = near ? .45 : 1;
        if (p.kind === 'pine' || p.kind === 'spruce') {
            const snow = p.kind === 'spruce', shades = snow ? ['#213d30', '#2e5340', '#3f6a52'] : ['#1d3720', p.tone < .5 ? '#2a4f2c' : '#2f5630', p.tone < .5 ? '#3d6a37' : '#47733c'];
            const layers = [[.38, 1], [.68, .7], [1, .4]] as const;
            layers.forEach(([lh, lr], i) => {
                const c = this.lift(p, p.h * lh);
                ctx.fillStyle = shades[i];
                ctx.beginPath(); ctx.arc(c.x, c.y, p.r * lr, 0, 6.28); ctx.fill();
                if (snow) { ctx.fillStyle = '#f4f8fa'; ctx.beginPath(); ctx.arc(c.x - SUN.x * p.r * lr * .3, c.y - SUN.y * p.r * lr * .3, p.r * lr * .55, 0, 6.28); ctx.fill(); }
            });
        }
        else if (p.kind === 'oak') {
            for (const [lh, lr, color] of [[.6, 1, '#34502a'], [1, .72, '#4d7036']] as const) {
                const c = this.lift(p, p.h * lh);
                ctx.fillStyle = color;
                ctx.beginPath(); ctx.arc(c.x, c.y, p.r * lr, 0, 6.28); ctx.fill();
            }
            const c = this.lift(p, p.h);
            ctx.fillStyle = '#5f8743';
            ctx.beginPath(); ctx.arc(c.x - SUN.x * p.r * .25, c.y - SUN.y * p.r * .25, p.r * .35, 0, 6.28); ctx.fill();
        }
        else if (p.kind === 'boulder') {
            const top = this.lift(p, p.h);
            ctx.fillStyle = '#8c4527';
            ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.28); ctx.fill();
            const mid = this.lift(p, p.h * .5);
            ctx.beginPath(); ctx.arc(mid.x, mid.y, p.r * .96, 0, 6.28); ctx.fill();
            ctx.fillStyle = '#c4703f';
            ctx.beginPath(); ctx.arc(top.x, top.y, p.r * .9, 0, 6.28); ctx.fill();
            ctx.fillStyle = '#dc8a52';
            ctx.beginPath(); ctx.arc(top.x - SUN.x * p.r * .25, top.y - SUN.y * p.r * .25, p.r * .45, 0, 6.28); ctx.fill();
        }
        else if (p.kind === 'cactus') {
            const top = this.lift(p, p.h), arm = this.lift(p, p.h * .7), dx = Math.cos(p.a) * p.r * 1.6, dy = Math.sin(p.a) * p.r * 1.6;
            ctx.fillStyle = '#3f6a33';
            ctx.beginPath(); ctx.arc(arm.x + dx, arm.y + dy, p.r * .6, 0, 6.28); ctx.arc(arm.x - dx * .8, arm.y - dy * .8, p.r * .55, 0, 6.28); ctx.fill();
            ctx.fillStyle = '#5a8a45';
            ctx.beginPath(); ctx.arc(top.x, top.y, p.r, 0, 6.28); ctx.fill();
        }
        else if (p.kind === 'house') {
            const top = this.lift(p, p.h), w = p.r, d = p.r * .65;
            ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a); ctx.fillStyle = '#cfc2a6'; ctx.fillRect(-w, -d, w * 2, d * 2); ctx.restore();
            ctx.save(); ctx.translate(top.x, top.y); ctx.rotate(p.a);
            ctx.fillStyle = p.tone < .5 ? '#b5523b' : '#58636d';
            ctx.fillRect(-w, -d, w * 2, d);
            ctx.fillStyle = p.tone < .5 ? '#94402d' : '#46505a';
            ctx.fillRect(-w, 0, w * 2, d);
            ctx.restore();
        }
        ctx.globalAlpha = 1;
    }
    private drawWalls(view: View) {
        const ctx = this.ctx;
        for (const side of [-1, 1]) {
            const off = side * (this.stage.width / 2 + this.stage.barrier.distance + .8);
            for (const [h, color, width] of [[0, '#5d5950', 1.7], [1.5, '#bcb4a2', 1.4]] as const) {
                ctx.strokeStyle = color;
                ctx.lineWidth = width;
                ctx.beginPath();
                let open = false;
                for (const p of this.stage.points) {
                    const x = p.x - Math.sin(p.heading) * off, y = p.y + Math.cos(p.heading) * off;
                    if (x < view.x0 || x > view.x1 || y < view.y0 || y > view.y1) { open = false; continue; }
                    const q = h ? this.lift({ x, y }, h) : { x, y };
                    if (open) ctx.lineTo(q.x, q.y); else { ctx.moveTo(q.x, q.y); open = true; }
                }
                ctx.stroke();
            }
        }
    }
    private drawArch(me: Vec) {
        const p = pointAt(this.stage, 0), half = this.stage.width / 2 + 2.6;
        if (Math.hypot(p.x - me.x, p.y - me.y) > 160) return;
        const ctx = this.ctx, nx = -Math.sin(p.heading), ny = Math.cos(p.heading);
        const a = { x: p.x - nx * half, y: p.y - ny * half }, b = { x: p.x + nx * half, y: p.y + ny * half };
        const ta = this.lift(a, 6.5), tb = this.lift(b, 6.5);
        ctx.strokeStyle = '#1b1714';
        ctx.lineWidth = .9;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(ta.x, ta.y); ctx.moveTo(b.x, b.y); ctx.lineTo(tb.x, tb.y); ctx.stroke();
        ctx.lineCap = 'butt';
        ctx.strokeStyle = '#ffc629';
        ctx.lineWidth = 2.6;
        ctx.beginPath(); ctx.moveTo(ta.x, ta.y); ctx.lineTo(tb.x, tb.y); ctx.stroke();
        ctx.strokeStyle = '#1b1714';
        ctx.lineWidth = 2.6;
        ctx.setLineDash([1.3, 1.3]);
        ctx.beginPath(); ctx.moveTo(ta.x, ta.y); ctx.lineTo(ta.x + (tb.x - ta.x) * .14, ta.y + (tb.y - ta.y) * .14); ctx.moveTo(tb.x + (ta.x - tb.x) * .14, tb.y + (ta.y - tb.y) * .14); ctx.lineTo(tb.x, tb.y); ctx.stroke();
        ctx.setLineDash([]);
        ctx.lineCap = 'round';
    }
    get tileCount() { return this.tiles.size; }
    get tileBytes() { return this.tiles.size * (TILE_PX + 4) ** 2 * 4; }
    dispose() { this.tiles.clear(); this.sprites.clear(); this.particles.clear(); this.marks.clear(); }
}

function makeVignette(w: number, h: number, fog: string) {
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(w / 2));
    canvas.height = Math.max(1, Math.round(h / 2));
    const ctx = canvas.getContext('2d')!, g = ctx.createRadialGradient(canvas.width / 2, canvas.height * .6, Math.min(canvas.width, canvas.height) * .35, canvas.width / 2, canvas.height * .6, Math.max(canvas.width, canvas.height) * .75);
    g.addColorStop(0, 'rgba(0,0,0,0)');
    g.addColorStop(1, fog);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    return canvas;
}

export function ghostAt(samples: GhostPoint[], t: number): GhostPoint | null {
    if (!samples.length) return null;
    let lo = 0, hi = samples.length - 1;
    while (lo < hi) { const m = Math.ceil((lo + hi) / 2); if (samples[m].t <= t) lo = m; else hi = m - 1; }
    const a = samples[lo], b = samples[Math.min(lo + 1, samples.length - 1)], f = clamp((t - a.t) / Math.max(.001, b.t - a.t), 0, 1);
    return { t, x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f, heading: a.heading + wrap(b.heading - a.heading) * f };
}

const overviews = new Map<string, HTMLCanvasElement>();
/** Small painted overview of a stage for menus. Rendered once per stage and cached. */
export function stageOverview(stage: Stage, width = 360, height = 240) {
    const key = `${stage.id}:${width}x${height}`, cached = overviews.get(key);
    if (cached) return cached;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return canvas;
    // Fit the whole loop, then paint exactly the world area the frame shows, whatever its shape.
    const b = stage.bounds, scale = Math.min(width / b.width, height / b.height) * 1.08, cx = b.x + b.width / 2, cy = b.y + b.height / 2, hw = width / 2 / scale, hh = height / 2 / scale;
    ctx.translate(width / 2, height / 2);
    ctx.scale(scale, scale);
    ctx.translate(-cx, -cy);
    const painter = painterFor(stage);
    paintRegion(ctx, painter, cx - hw, cy - hh, cx + hw, cy + hh, hash(stage.id), .05);
    ctx.lineWidth = stage.width * .9;
    ctx.strokeStyle = 'rgba(255,255,255,.25)';
    ctx.stroke(painter.loop);
    for (const run of painter.runs) { ctx.strokeStyle = painter.pal.road[run.surface]; ctx.lineWidth = stage.width * .75; ctx.stroke(run.path); }
    const start = pointAt(stage, 0);
    ctx.fillStyle = '#ffc629';
    ctx.strokeStyle = '#1b1714';
    ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(start.x, start.y, 16, 0, 6.28); ctx.fill(); ctx.stroke();
    overviews.set(key, canvas);
    while (overviews.size > 16) overviews.delete(overviews.keys().next().value!);
    return canvas;
}
