/**
 * Particle kinds. Soft kinds draw as pre-rendered irregular cloud sprites (dust, spray, smoke);
 * hard kinds are small crisp chips (sparks, debris, clods, droplets); rings are expanding ripples.
 */
export const PARTICLE_KINDS = [
    { color: [201, 167, 122], style: 'soft' }, // gravel dust
    { color: [236, 208, 155], style: 'soft' }, // sand
    { color: [104, 74, 48], style: 'soft' }, // mud spray
    { color: [255, 255, 255], style: 'soft' }, // snow powder
    { color: [219, 236, 240], style: 'soft' }, // water mist
    { color: [214, 209, 201], style: 'soft' }, // tyre smoke
    { color: [255, 207, 90], style: 'hard' }, // spark
    { color: [42, 36, 32], style: 'hard' }, // debris
    { color: [227, 242, 248], style: 'soft' }, // ice spray
    { color: [107, 143, 69], style: 'hard' }, // grass bits
    { color: [62, 42, 25], style: 'hard' }, // mud clods
    { color: [234, 246, 248], style: 'hard' }, // water droplets
    { color: [232, 244, 246], style: 'ring' }, // ripple
] as const;
export const P = { gravel: 0, sand: 1, mud: 2, snow: 3, water: 4, smoke: 5, spark: 6, debris: 7, ice: 8, grass: 9, clod: 10, droplet: 11, ripple: 12 } as const;
const VARIANTS = 4;

/** Irregular soft cloud: several feathered blobs, so dust reads as a plume rather than a disc. */
function cloudSprite([r, g, b]: readonly number[], seed: number) {
    const size = 96, canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return canvas;
    let n = seed * 7919 + 13;
    const rnd = () => { n = (Math.imul(n, 1664525) + 1013904223) >>> 0; return n / 4294967296; };
    // A broad feathered base, then many small soft lumps so the edge breaks up without hard curves.
    for (let i = 0; i < 14; i++) {
        const a = rnd() * Math.PI * 2, d = i ? Math.sqrt(rnd()) * size * .24 : 0, x = size / 2 + Math.cos(a) * d, y = size / 2 + Math.sin(a) * d, radius = size * (i ? .1 + rnd() * .13 : .46);
        const peak = i ? .2 + rnd() * .12 : .34, grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
        grad.addColorStop(0, `rgba(${r},${g},${b},${peak})`);
        grad.addColorStop(.35, `rgba(${r},${g},${b},${peak * .7})`);
        grad.addColorStop(.7, `rgba(${r},${g},${b},${peak * .25})`);
        grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, size, size);
    }
    return canvas;
}

/** Fixed-size particle pool: typed arrays, no allocation while racing, draws batched by kind. */
export class Particles {
    readonly capacity: number;
    private x: Float32Array; private y: Float32Array; private vx: Float32Array; private vy: Float32Array;
    private life: Float32Array; private max: Float32Array; private size: Float32Array; private grow: Float32Array; private alpha: Float32Array; private drag: Float32Array; private stretch: Float32Array;
    private kind: Uint8Array; private layer: Uint8Array; private variant: Uint8Array;
    private cursor = 0;
    private sprites: HTMLCanvasElement[][] | null = null;
    budget = 1;
    constructor(capacity = 700) {
        this.capacity = capacity;
        this.x = new Float32Array(capacity); this.y = new Float32Array(capacity); this.vx = new Float32Array(capacity); this.vy = new Float32Array(capacity);
        this.life = new Float32Array(capacity); this.max = new Float32Array(capacity); this.size = new Float32Array(capacity); this.grow = new Float32Array(capacity);
        this.alpha = new Float32Array(capacity); this.drag = new Float32Array(capacity); this.stretch = new Float32Array(capacity);
        this.kind = new Uint8Array(capacity); this.layer = new Uint8Array(capacity); this.variant = new Uint8Array(capacity);
    }
    emit(x: number, y: number, vx: number, vy: number, life: number, size: number, grow: number, alpha: number, kind: number, layer = 0, drag = 2.2) {
        if (this.budget < 1 && Math.random() > this.budget) return;
        const i = this.cursor;
        this.cursor = (this.cursor + 1) % this.capacity;
        this.x[i] = x; this.y[i] = y; this.vx[i] = vx; this.vy[i] = vy; this.life[i] = life; this.max[i] = life; this.size[i] = size; this.grow[i] = grow;
        this.alpha[i] = alpha; this.kind[i] = kind; this.layer[i] = layer; this.drag[i] = drag;
        this.variant[i] = i % VARIANTS;
        this.stretch[i] = .78 + ((i * 37) % 11) / 22;
    }
    update(dt: number) {
        for (let i = 0; i < this.capacity; i++) {
            if (this.life[i] <= 0) continue;
            this.life[i] -= dt;
            const k = Math.exp(-this.drag[i] * dt);
            this.vx[i] *= k; this.vy[i] *= k;
            this.x[i] += this.vx[i] * dt; this.y[i] += this.vy[i] * dt;
            this.size[i] += this.grow[i] * dt;
        }
    }
    clear() { this.life.fill(0); }
    draw(ctx: CanvasRenderingContext2D, layer: number, view: { x0: number; y0: number; x1: number; y1: number }) {
        if (!this.sprites) this.sprites = PARTICLE_KINDS.map((kind, k) => kind.style === 'soft' ? Array.from({ length: VARIANTS }, (_, v) => cloudSprite(kind.color, k * 10 + v)) : []);
        for (let k = 0; k < PARTICLE_KINDS.length; k++) {
            const style = PARTICLE_KINDS[k].style, [r, g, b] = PARTICLE_KINDS[k].color;
            let started = false;
            for (let i = 0; i < this.capacity; i++) {
                if (this.life[i] <= 0 || this.kind[i] !== k || this.layer[i] !== layer) continue;
                const x = this.x[i], y = this.y[i], size = this.size[i];
                if (x + size * 2 < view.x0 || x - size * 2 > view.x1 || y + size * 2 < view.y0 || y - size * 2 > view.y1) continue;
                const left = this.life[i] / this.max[i], age = 1 - left;
                if (style === 'soft') {
                    // Quick swell, long feathered fade.
                    ctx.globalAlpha = this.alpha[i] * Math.min(1, age / .12) * Math.pow(left, 1.3);
                    const w = size * 2.4 * this.stretch[i], h = size * 2.4 / this.stretch[i];
                    ctx.drawImage(this.sprites[k][this.variant[i]], x - w / 2, y - h / 2, w, h);
                }
                else if (style === 'hard') {
                    if (!started) { ctx.fillStyle = `rgb(${r},${g},${b})`; started = true; }
                    ctx.globalAlpha = this.alpha[i] * Math.min(1, left * 2.5);
                    ctx.fillRect(x - size / 2, y - size / 2, size, size * this.stretch[i]);
                }
                else {
                    if (!started) { ctx.strokeStyle = `rgb(${r},${g},${b})`; ctx.lineWidth = .16; started = true; }
                    ctx.globalAlpha = this.alpha[i] * left;
                    ctx.beginPath();
                    ctx.ellipse(x, y, size * this.stretch[i], size / this.stretch[i], 0, 0, 6.2832);
                    ctx.stroke();
                }
            }
        }
        ctx.globalAlpha = 1;
    }
    get live() { let n = 0; for (let i = 0; i < this.capacity; i++) if (this.life[i] > 0) n++; return n; }
}

/** Ring buffer of tyre-mark segments in two kinds: dark rubber (tarmac) and grooves (loose surfaces). Older marks fade. */
export class Marks {
    readonly capacity: number;
    private data: Float32Array;
    private kind: Uint8Array;
    private cursor = 0;
    private count = 0;
    constructor(capacity = 2400) { this.capacity = capacity; this.data = new Float32Array(capacity * 4); this.kind = new Uint8Array(capacity); }
    add(x1: number, y1: number, x2: number, y2: number, kind: 0 | 1) {
        const i = this.cursor, o = i * 4;
        this.data[o] = x1; this.data[o + 1] = y1; this.data[o + 2] = x2; this.data[o + 3] = y2;
        this.kind[i] = kind;
        this.cursor = (this.cursor + 1) % this.capacity;
        this.count = Math.min(this.capacity, this.count + 1);
    }
    clear() { this.count = 0; this.cursor = 0; }
    get size() { return this.count; }
    /** Longest segment stored, for tests: marks must never bridge long gaps. */
    longest() { let m = 0; for (let i = 0; i < this.count; i++) { const o = i * 4; m = Math.max(m, Math.hypot(this.data[o + 2] - this.data[o], this.data[o + 3] - this.data[o + 1])); } return m; }
    draw(ctx: CanvasRenderingContext2D, kind: 0 | 1, color: string, alpha: number, width: number, view: { x0: number; y0: number; x1: number; y1: number }) {
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.lineCap = 'round';
        // Three age bands: newest marks strongest, the oldest barely there.
        for (const [from, to, fade] of [[0, .35, 1], [.35, .7, .6], [.7, 1, .3]] as const) {
            ctx.beginPath();
            let any = false;
            for (let n = Math.floor(from * this.count); n < Math.floor(to * this.count); n++) {
                const i = (this.cursor - 1 - n + this.capacity * 2) % this.capacity;
                if (this.kind[i] !== kind) continue;
                const o = i * 4, x1 = this.data[o], y1 = this.data[o + 1];
                if (x1 < view.x0 || x1 > view.x1 || y1 < view.y0 || y1 > view.y1) continue;
                ctx.moveTo(x1, y1);
                ctx.lineTo(this.data[o + 2], this.data[o + 3]);
                any = true;
            }
            if (!any) continue;
            ctx.globalAlpha = alpha * fade;
            ctx.stroke();
        }
        ctx.globalAlpha = 1;
    }
}
