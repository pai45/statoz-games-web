import type { Point, World, ShotView } from './contracts';
export { sweep } from './sweep';
export const DT = 1 / 60, HALF_TICKS = 90 * 60;
export const GOAL_HEIGHT=75;
export const clamp = (n: number, a: number, b: number) => Math.max(a, Math.min(b, n));
export const project = (p: Point): Point => ({ x: 48 + p.x * 6, y: 80 + p.y * 3.2 });
export const root = (p: Point): Point => { const q = project(p); return { x: Math.round(q.x), y: Math.round(q.y) }; };
export const space = (p: World): World => ({ x: p.x * 6, y: p.y * 3.2, z: p.z });
export const fromSpace = (p: World): World => ({ x: p.x / 6, y: p.y / 3.2, z: p.z });
export const length = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);
// Original front-goal projection; the same live world ball is retained.
export const goalSpace = (p: World, v: ShotView): World => ({ x: 160 + (p.y - 34) * 16, y: v.planeY + (v.direction === -1 ? p.x : 105 - p.x) * v.depthScale, z: p.z });
export const goalProject = (p: World, v: ShotView): Point => { const q = goalSpace(p, v); return { x: q.x, y: q.y - q.z }; };
export const fromGoalSpace = (p: World, v: ShotView): World => ({ x: v.direction === 1 ? 105 - (p.y - v.planeY) / v.depthScale : (p.y - v.planeY) / v.depthScale, y: 34 + (p.x - 160) / 16, z: p.z });
