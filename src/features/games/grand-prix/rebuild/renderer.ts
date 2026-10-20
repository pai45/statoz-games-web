import { drawCar } from './art';
import { clamp, nearest, pointAt, wrap } from './geometry';
import { random } from './simulation';
import type { Car, Circuit, GhostPoint, Session } from './contracts';
function path(ctx: CanvasRenderingContext2D, track: Circuit, offset = 0) {
    ctx.beginPath();
    track.points.forEach((p, i) => {
        const x = p.x - Math.sin(p.heading) * offset, y = p.y + Math.cos(p.heading) * offset;
        if (i)
            ctx.lineTo(x, y);
        else
            ctx.moveTo(x, y);
    });
    ctx.closePath();
}
function line(ctx: CanvasRenderingContext2D, track: Circuit, start: number, end: number, offset: number) {
    ctx.beginPath();
    for (let s = start; s <= end; s += 2) {
        const p = pointAt(track, s, offset);
        if (s === start)
            ctx.moveTo(p.x, p.y);
        else
            ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();
}
/** One cached, original scenery painting per selected circuit. No remote artwork. */
export function paintCircuit(ctx: CanvasRenderingContext2D, track: Circuit) {
    const b = track.bounds, rng = random(1200 + track.id.length * 29), ground = { park: '#748665', city: '#899181', sand: '#c6ad7b', sea: '#819470', forest: '#526c51' }[track.theme];
    ctx.fillStyle = ground;
    ctx.fillRect(b.x, b.y, b.width, b.height);
    if (track.theme === 'sea' || track.theme === 'city') {
        ctx.fillStyle = '#4b8e9d';
        ctx.fillRect(b.x, b.y, b.width, 65);
        for (let i = 0; i < 120; i++) {
            ctx.fillStyle = '#b4d4d330';
            ctx.fillRect(b.x + rng() * b.width, b.y + rng() * 60, 8 + rng() * 25, 1);
        }
    }
    for (let i = 0; i < 10000; i++) {
        ctx.fillStyle = i % 2 ? '#ffffff09' : '#0000000b';
        ctx.fillRect(b.x + rng() * b.width, b.y + rng() * b.height, 1 + rng() * 3, 1 + rng() * 3);
    }
    path(ctx, track);
    ctx.strokeStyle = '#555c50';
    ctx.lineWidth = track.width + 38;
    ctx.lineJoin = 'round';
    ctx.stroke();
    path(ctx, track);
    ctx.strokeStyle = track.theme === 'sand' ? '#b89b6b' : '#b7b0a1';
    ctx.lineWidth = track.width + 29;
    ctx.stroke();
    path(ctx, track);
    ctx.strokeStyle = '#3e6654';
    ctx.lineWidth = track.width + 10;
    ctx.stroke();
    path(ctx, track);
    ctx.strokeStyle = '#dbdcd5';
    ctx.lineWidth = track.width + 2;
    ctx.stroke();
    path(ctx, track);
    ctx.strokeStyle = '#626769';
    ctx.lineWidth = track.width;
    ctx.stroke();
    for (let s = 0; s < track.length; s += 5) {
        ctx.lineWidth = 1.9;
        ctx.strokeStyle = Math.floor(s / 5) % 2 ? '#e5e2d7' : '#bb4337';
        for (const side of [-1, 1])
            line(ctx, track, s, s + 5, side * (track.width / 2 + 1.6));
    }
    for (let s = 0; s < track.length; s += 3) {
        const p = pointAt(track, s);
        ctx.fillStyle = '#e2e1d009';
        ctx.fillRect(p.x + rng() * track.width - track.width / 2, p.y, 1, 1);
    }
    for (let i = 0; i < 950; i++) {
        const x = b.x + rng() * b.width, y = b.y + rng() * b.height, p = nearest(track, { x, y });
        if (p.distance < track.width / 2 + 25 || y < b.y + 70)
            continue;
        if (track.theme === 'city' && i % 3 === 0) {
            const w = 12 + rng() * 24, h = 15 + rng() * 24;
            ctx.fillStyle = '#00000025';
            ctx.fillRect(x + 4, y + 5, w, h);
            ctx.fillStyle = ['#c5bba6', '#bdc3b9', '#aca99d'][i % 3];
            ctx.fillRect(x, y, w, h);
            ctx.fillStyle = '#e0d7c4';
            ctx.fillRect(x + 2, y + 2, w - 4, 3);
            ctx.fillStyle = '#606d70';
            for (let a = 3; a < w - 3; a += 5)
                for (let d = 8; d < h - 3; d += 6)
                    ctx.fillRect(x + a, y + d, 2, 3);
        }
        else if (track.theme !== 'sand' || i % 9 === 0) {
            const radius = 4 + rng() * 7;
            ctx.fillStyle = '#00000025';
            ctx.beginPath();
            ctx.ellipse(x + 3, y + 4, radius, radius * .8, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = track.theme === 'sand' ? '#888160' : ['#3d5d3c', '#496b42', '#557847'][i % 3];
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#b0bb6133';
            ctx.beginPath();
            ctx.arc(x - 2, y - 2, radius * .6, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    // Pit lane, service apron and garage roofs share simulation geometry.
    ctx.strokeStyle = '#d2cabc';
    ctx.lineWidth = 12;
    line(ctx, track, track.pit.entry, track.pit.exit, track.width * .85);
    ctx.strokeStyle = '#757979';
    ctx.lineWidth = 8;
    line(ctx, track, track.pit.entry, track.pit.exit, track.width * .85);
    ctx.strokeStyle = '#e2c964';
    ctx.lineWidth = .45;
    line(ctx, track, track.pit.entry, track.pit.exit, track.width * .85 - 4);
    for (let i = 0; i < 10; i++) {
        const p = pointAt(track, track.pit.box + (i - 4) * 8, track.width * .85 + 9);
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.heading);
        ctx.fillStyle = i % 2 ? '#b5b7b3' : '#d9d8cf';
        ctx.fillRect(-3, -3, 6, 10);
        ctx.fillStyle = '#9d3734';
        ctx.fillRect(-3, -3, 6, 2);
        ctx.restore();
    }
    // Start line and twenty grid boxes.
    const start = pointAt(track, 0);
    ctx.save();
    ctx.translate(start.x, start.y);
    ctx.rotate(start.heading);
    for (let x = 0; x < 2; x++)
        for (let y = -Math.floor(track.width / 2); y < track.width / 2; y += 2) {
            ctx.fillStyle = ((y + Math.floor(track.width / 2)) / 2 + x) % 2 ? '#e9e5db' : '#282b2d';
            ctx.fillRect(x * 2, y, 2, 2);
        }
    ctx.restore();
    for (let i = 0; i < 20; i++) {
        const p = pointAt(track, -12 - Math.floor(i / 2) * 10, i % 2 ? -4 : 4);
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.heading);
        ctx.strokeStyle = '#dadbd277';
        ctx.lineWidth = .35;
        ctx.strokeRect(-4, -2.6, 8, 5.2);
        ctx.restore();
    }
    // Grandstand: deliberately sparse so the track remains the visual focus.
    for (let i = 0; i < 3; i++) {
        const p = pointAt(track, track.length * (.4 + i * .17), track.width / 2 + 38);
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.heading);
        ctx.fillStyle = '#535b59';
        ctx.fillRect(-22, -8, 44, 16);
        for (let row = 0; row < 5; row++)
            for (let seat = 0; seat < 22; seat++) {
                ctx.fillStyle = ['#c4c5bb', '#a84339', '#667783', '#d1b676'][(seat + row + i) % 4];
                ctx.fillRect(-21 + seat * 2, -7 + row * 2.8, 1.3, 1.6);
            }
        ctx.restore();
    }
}
export function ghostAt(samples: GhostPoint[], t: number): GhostPoint | null {
    if (!samples.length)
        return null;
    let lo = 0, hi = samples.length - 1;
    while (lo < hi) {
        const m = Math.ceil((lo + hi) / 2);
        if (samples[m].t <= t)
            lo = m;
        else
            hi = m - 1;
    }
    const a = samples[lo], b = samples[Math.min(lo + 1, samples.length - 1)], f = clamp((t - a.t) / Math.max(.001, b.t - a.t), 0, 1);
    return { t, x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f, heading: a.heading + wrap(b.heading - a.heading) * f };
}
export class RaceRenderer {
    private cache: HTMLCanvasElement;
    private camera = { x: 0, y: 0 };
    private seeded = false;
    private scenery: Circuit;
    constructor(private canvas: HTMLCanvasElement, private track: Circuit) {
        const b = track.bounds;
        this.scenery = { ...track, bounds: { x: b.x - 300, y: b.y - 300, width: b.width + 600, height: b.height + 600 } };
        this.cache = document.createElement('canvas');
        this.cache.width = Math.ceil(this.scenery.bounds.width * 2);
        this.cache.height = Math.ceil(this.scenery.bounds.height * 2);
        const ctx = this.cache.getContext('2d');
        if (!ctx)
            throw Error('Canvas 2D is unavailable');
        ctx.scale(2, 2);
        ctx.translate(-this.scenery.bounds.x, -this.scenery.bounds.y);
        paintCircuit(ctx, this.scenery);
    }
    render(s: Session, alpha: number, dt: number, reduced = false) {
        const canvas = this.canvas, ctx = canvas.getContext('2d');
        if (!ctx)
            return;
        const rect = canvas.getBoundingClientRect(), w = rect.width, h = rect.height, dpr = Math.min(2, window.devicePixelRatio || 1);
        if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
            canvas.width = Math.round(w * dpr);
            canvas.height = Math.round(h * dpr);
        }
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, w, h);
        const p = s.cars[0], lead = reduced ? 12 : Math.min(52, 15 + p.speed * .5), tx = p.x + Math.cos(p.heading) * lead, ty = p.y + Math.sin(p.heading) * lead;
        if (!this.seeded) {
            this.camera = { x: tx, y: ty };
            this.seeded = true;
        }
        else if (s.phase !== 'paused' && s.phase !== 'finished') {
            const follow = 1 - Math.exp(-Math.min(dt, .1) * 7);
            this.camera.x += (tx - this.camera.x) * follow;
            this.camera.y += (ty - this.camera.y) * follow;
        }
        const zoom = clamp(h / 175, 2.1, 4.2);
        ctx.save();
        ctx.translate(w / 2, h / 2);
        ctx.scale(zoom, zoom);
        ctx.translate(-this.camera.x, -this.camera.y);
        const b = this.scenery.bounds;
        ctx.drawImage(this.cache, b.x, b.y, b.width, b.height);
        if (s.setup.guide) {
            ctx.strokeStyle = '#e1d39299';
            ctx.lineWidth = 1;
            ctx.setLineDash([2, 3]);
            line(ctx, this.track, p.s, p.s + 135, 0);
            ctx.setLineDash([]);
        }
        if (s.setup.mode === 'trial' && s.ghost) {
            const g = ghostAt(s.ghost.samples, s.raceClock - p.lapStart);
            if (g)
                drawCar(ctx, p.team, g.x, g.y, g.heading, 1, .3);
        }
        const visible = (c: Car) => Math.abs(c.x - this.camera.x) < w / zoom / 2 + 15 && Math.abs(c.y - this.camera.y) < h / zoom / 2 + 15;
        const fraction = s.phase === 'running' || s.phase === 'qualifying' ? alpha : 1;
        for (const c of [...s.cars].sort((a, b) => Number(a.id === 0) - Number(b.id === 0))) {
            if (!visible(c))
                continue;
            const x = c.previous.x + (c.x - c.previous.x) * fraction, y = c.previous.y + (c.y - c.previous.y) * fraction, heading = c.previous.heading + wrap(c.heading - c.previous.heading) * fraction;
            ctx.save();
            ctx.fillStyle = '#00000035';
            ctx.beginPath();
            ctx.ellipse(x + 1, y + 1, 4.3, 2.5, heading, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            drawCar(ctx, c.team, x, y, heading);
            if (!c.id) {
                ctx.strokeStyle = '#f8edc9';
                ctx.lineWidth = .55;
                ctx.beginPath();
                ctx.arc(x, y, 6.5, 0, Math.PI * 2);
                ctx.stroke();
                ctx.save();
                ctx.translate(x, y);
                ctx.rotate(heading);
                ctx.fillStyle = '#f8edc9';
                ctx.beginPath();
                ctx.moveTo(11, 0);
                ctx.lineTo(8, -1.4);
                ctx.lineTo(8, 1.4);
                ctx.fill();
                ctx.restore();
            }
        }
        ctx.restore();
    }
}
