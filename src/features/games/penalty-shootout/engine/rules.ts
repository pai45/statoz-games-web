import type { KickResult, ShotCommand, Vec3 } from "../game-types";
import { GOAL } from "../game-types";

export const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
export const mix = (a: number, b: number, t: number) => a + (b - a) * t;
export const smooth = (v: number) => { const t = clamp(v, 0, 1); return t * t * (3 - 2 * t); };
export function seeded(seed: number) {
  let s = seed >>> 0;
  const random = () => { s = (s + 0x6d2b79f5) >>> 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t ^= t + Math.imul(t ^ t >>> 7, 61 | t); return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  random.state = () => s;
  random.restore = (state: number) => { s = state >>> 0; };
  return random;
}
export function matchStatus(kicks: Pick<KickResult, "role" | "outcome">[], rules: import("../game-types").MatchRules = {}) {
  const a = kicks.filter(k => k.role === "shooting"), b = kicks.filter(k => k.role === "keeping");
  const score: [number, number] = [a.filter(k => k.outcome === "goal").length, b.filter(k => k.outcome === "goal").length];
  const early = rules.earlyClinch !== false && a.length <= 5 && b.length <= 5 && (score[0] > score[1] + 5 - b.length || score[1] > score[0] + 5 - a.length);
  const pair = a.length >= 5 && a.length === b.length && score[0] !== score[1];
  const complete = early || pair || !!rules.allowDraw && a.length === 5 && b.length === 5;
  const outcome = complete ? score[0] === score[1] ? "draw" as const : score[0] > score[1] ? "win" as const : "loss" as const : null;
  return { complete, outcome, score, suddenDeath: !rules.allowDraw && kicks.length >= 10 && !early && (!pair || a.length > 5), winner: early || pair ? score[0] > score[1] ? "player" as const : "opponent" as const : null };
}
export function accuracy(command: Pick<ShotCommand, "composure" | "power" | "style">) {
  return (0.035 + (1 - command.composure) * 0.7 + Math.max(0, command.power - 0.78) ** 2 * 7) * (command.style === "placed" ? 0.72 : command.style === "chip" ? 1.2 : 1);
}
export function launch(command: ShotCommand, random: () => number): { velocity: Vec3; target: { x: number; y: number } } {
  const spread = accuracy(command), angle = random() * Math.PI * 2, radius = Math.sqrt(random()) * spread;
  const target = { x: command.target.x + Math.cos(angle) * radius, y: command.target.y + Math.sin(angle) * radius };
  const speed = command.style === "chip" ? mix(9, 15, command.power) : command.style === "placed" ? mix(13, 25, command.power) : mix(15, 34, command.power);
  const time = GOAL.spot / speed;
  return { target, velocity: { x: target.x / time, y: (target.y - GOAL.ballRadius + 4.905 * time * time) / time, z: -speed } };
}
/** Full sphere over the line; opening excludes the ball radius. */
export function crossesGoal(previous: Vec3, current: Vec3): boolean {
  const plane = -GOAL.ballRadius;
  if (previous.z <= plane || current.z > plane) return false;
  const t = (plane - previous.z) / (current.z - previous.z), x = mix(previous.x, current.x, t), y = mix(previous.y, current.y, t);
  return Math.abs(x) + GOAL.ballRadius < GOAL.halfWidth && y - GOAL.ballRadius >= -0.005 && y + GOAL.ballRadius < GOAL.height;
}
/** Decisions made before launch see history only, never a pending shot command. */
export function anticipate(history: KickResult[], level: number, random: () => number) {
  const recent = history.filter(k => k.role === "shooting").slice(-5);
  const habit = recent.length ? recent.reduce((s, k) => s + Math.sign(k.target.x), 0) / recent.length : 0;
  const side = recent.length > 1 && Math.abs(habit) > 0.5 && random() < mix(0.2, 0.55, level / 12) ? Math.sign(habit) : random() < 0.5 ? -1 : 1;
  return { early: random() < 0.48, x: side, y: [-0.7, 0, 0.85][Math.floor(random() * 3)], reaction: mix(0.38, 0.18, clamp((level - 1) / 11, 0, 1)) };
}
