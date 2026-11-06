import { crews } from './crews';
import type { Surface, Theme } from './contracts';

/**
 * Original top-down rally hatchback, nose up, in a 100×206 box (anchor at the centre).
 * World size is CAR_W × CAR_L units. The same paths draw menu art (SVG) and race sprites (canvas).
 */
export const CAR_W = 4.4, CAR_L = 9, BOX_W = 100, BOX_H = 206;
const BODY = 'M24 6Q50 0 76 6L90 22L94 60V176L88 196Q50 204 12 196L6 176V60L10 22Z';
export function carShapes(index: number): { d: string; fill: string; opacity?: number }[] {
    const c = crews[index % crews.length];
    return [
        { d: 'M-2 30h14v32h-14z M88 30h14v32h-14z M-2 140h14v34h-14z M88 140h14v34h-14z', fill: '#15120f' },
        { d: BODY, fill: c.body },
        { d: 'M37 3h10v198h-10z M53 3h10v198h-10z', fill: c.stripe },
        { d: 'M6 112h88v10h-88z', fill: c.trim },
        { d: 'M10 26L22 20V58L8 62Z M90 26L78 20V58L92 62Z', fill: '#ffffff', opacity: .16 },
        { d: 'M20 62H80L74 86H26Z', fill: '#1d2730' },
        { d: 'M24 68H44L40 80H28Z', fill: '#ffffff', opacity: .22 },
        { d: 'M26 150H74L78 170H22Z', fill: '#1d2730' },
        { d: 'M0 64h7v7h-7z M93 64h7v7h-7z', fill: c.trim },
        { d: 'M41 92h18v9h-18z', fill: '#15120f' },
        { d: 'M7 180h86v14h-86z', fill: c.trim },
        { d: 'M4 176h6v18h-6z M90 176h6v18h-6z', fill: '#15120f' },
        { d: 'M14 194h12v5h-12z M74 194h12v5h-12z', fill: '#7a1d14' },
        { d: 'M18 9h64v13h-64z', fill: '#15120f' },
    ];
}
const LAMPS = [26, 42, 58, 74];
export function carSvg(index: number) {
    const c = crews[index % crews.length];
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-8 -8 116 222"><ellipse cx="54" cy="108" rx="52" ry="106" fill="#000" opacity=".22"/>${carShapes(index).map(p => `<path d="${p.d}" fill="${p.fill}"${p.opacity ? ` opacity="${p.opacity}"` : ''}/>`).join('')}${LAMPS.map(x => `<circle cx="${x}" cy="15" r="6" fill="#fff6d8" stroke="#15120f" stroke-width="2"/>`).join('')}<circle cx="50" cy="128" r="17" fill="#f6f1e7" stroke="#15120f" stroke-width="3"/><text x="50" y="136" text-anchor="middle" font-family="Arial Black,Arial,sans-serif" font-weight="900" font-size="${c.number > 9 ? 19 : 23}" fill="#15120f">${c.number}</text></svg>`;
}

/** Pre-rendered car sprite at `scale` px per box unit, with a margin for wheels. */
export function carSprite(index: number, scale: number) {
    const c = crews[index % crews.length], pad = 6, canvas = document.createElement('canvas');
    canvas.width = Math.ceil((BOX_W + pad * 2) * scale);
    canvas.height = Math.ceil((BOX_H + pad * 2) * scale);
    const ctx = canvas.getContext('2d')!;
    ctx.scale(scale, scale);
    ctx.translate(pad, pad);
    for (const shape of carShapes(index)) { ctx.globalAlpha = shape.opacity ?? 1; ctx.fillStyle = shape.fill; ctx.fill(new Path2D(shape.d)); }
    ctx.globalAlpha = 1;
    for (const x of LAMPS) { ctx.beginPath(); ctx.arc(x, 15, 6, 0, Math.PI * 2); ctx.fillStyle = '#fff6d8'; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = '#15120f'; ctx.stroke(); }
    ctx.beginPath();
    ctx.arc(50, 128, 17, 0, Math.PI * 2);
    ctx.fillStyle = '#f6f1e7';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#15120f';
    ctx.stroke();
    ctx.fillStyle = '#15120f';
    ctx.font = `900 ${c.number > 9 ? 19 : 23}px "Arial Black", Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(c.number), 50, 129);
    return { canvas, pad };
}

/** Grime that builds up over a run, clipped to the body. Colour follows the stage. */
export function dirtSprite(color: string, scale: number, seed = 7) {
    const pad = 6, canvas = document.createElement('canvas');
    canvas.width = Math.ceil((BOX_W + pad * 2) * scale);
    canvas.height = Math.ceil((BOX_H + pad * 2) * scale);
    const ctx = canvas.getContext('2d')!;
    ctx.scale(scale, scale);
    ctx.translate(pad, pad);
    ctx.clip(new Path2D(BODY));
    let n = seed;
    const rnd = () => { n = (Math.imul(n, 1664525) + 1013904223) >>> 0; return n / 4294967296; };
    ctx.fillStyle = color;
    for (let i = 0; i < 260; i++) {
        const side = rnd() < .5 ? rnd() * 26 : 74 + rnd() * 26, y = 30 + rnd() * 176, r = 1.5 + rnd() * 5 * (y / 206);
        ctx.globalAlpha = .25 + rnd() * .5;
        ctx.beginPath();
        ctx.arc(rnd() < .75 ? side : rnd() * 100, y, r, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.globalAlpha = .45;
    ctx.fillRect(0, 170, 100, 36);
    return canvas;
}

export type Palette = { ground: string; groundDark: string; groundLight: string; verge: string; edge: string; dirt: string; fog: string; road: Record<Surface, string>; detail: Record<Surface, string> };
const ROAD: Record<Surface, string> = { tarmac: '#3f3c3a', gravel: '#b38b5d', sand: '#e2bd84', mud: '#5e3f27', snow: '#dfe6ea', ice: '#b9d6e2' };
const DETAIL: Record<Surface, string> = { tarmac: '#2c2a29', gravel: '#8a6740', sand: '#c79c62', mud: '#3f2a19', snow: '#b8c3ca', ice: '#eef7fb' };
export const PALETTES: Record<Theme, Palette> = {
    forest: { ground: '#3d5b33', groundDark: '#2c4626', groundLight: '#56783f', verge: '#6b5236', edge: '#4a3826', dirt: '#6a4a2a', fog: 'rgba(20,32,18,.55)', road: ROAD, detail: DETAIL },
    desert: { ground: '#d39a5c', groundDark: '#b97c43', groundLight: '#e7b679', verge: '#e0b47a', edge: '#b88653', dirt: '#b98b55', fog: 'rgba(80,40,10,.45)', road: { ...ROAD, sand: '#ecc993' }, detail: DETAIL },
    snow: { ground: '#e8eef1', groundDark: '#c9d5dc', groundLight: '#ffffff', verge: '#f4f8fa', edge: '#aebdc6', dirt: '#e9eef0', fog: 'rgba(40,60,75,.45)', road: { ...ROAD, snow: '#d4dde3' }, detail: { ...DETAIL, snow: '#a9b7c0' } },
    coast: { ground: '#6e8e4a', groundDark: '#557336', groundLight: '#8aa95e', verge: '#9c8c6c', edge: '#77705f', dirt: '#8a7458', fog: 'rgba(20,35,30,.5)', road: ROAD, detail: DETAIL },
    farm: { ground: '#7f8b3e', groundDark: '#66722f', groundLight: '#9aa553', verge: '#5e4128', edge: '#47301d', dirt: '#4f3520', fog: 'rgba(35,28,10,.5)', road: ROAD, detail: DETAIL },
};
