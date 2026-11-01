// Longbow simulation. Pure and deterministic: no Three.js, no DOM, fixed 120 Hz step.
//
// World: the archer stands at the origin and shoots down -Z. Every target face sits on the
// plane z = -distance, facing the archer. The sight is a point on that plane; the bow's sight is
// set for the lane distance, so with no wind and a full draw the arrow lands on the sight point.
// The archer's job is wind, moving targets, a full draw and a steady release.
import {ARROWS_PER_END, MATCH_ENDS, TARGET_RADIUS, type Level, type Motion, type Opponent} from './levels';

export const STEP = 1 / 120;
export const DRAW_TIME = 0.6;
export const STEADY_TIME = 2.5;
export const MIN_DRAW = 0.35;
export const SPEED = 70;
export const GRAVITY = 9.81;
export const DRAG = 0.07;
export const IMPACT_TIME = 1.35;
export const AI_AIM_TIME = 1.3;
export const TARGET_HEIGHT = 1.3;
export const SWING_LENGTH = 2.2;
export const BOW = {x: 0, y: 1.5, z: 0} as const;
/** An earth bank this far behind the target catches arrows that miss. */
export const BACKSTOP = 14;
const SWAY = 0.0035;

export type Vec = {x: number; y: number; z: number};
export type Point = {x: number; y: number};
export type Shooter = 'player' | 'ai';
export type Phase = 'ready' | 'drawing' | 'ai-aim' | 'flight' | 'impact' | 'finished';
export type ArrowResult = {shooter: Shooter; score: number; x: boolean; miss: boolean; px: number; py: number};
export type Config = {mode: 'career'; level: Level} | {mode: 'match'; opponent: Opponent};
export type Flight = {pos: Vec; vel: Vec; age: number; shooter: Shooter; plane: Point | null; power: number};
export type Game = {
  config: Config;
  distance: number;
  radius: number;
  motion: Motion;
  totalArrows: number;
  seed: number;
  initialSeed: number;
  time: number;
  phase: Phase;
  age: number;
  hold: number;
  aim: Point;
  sway: [number, number, number];
  aiNoise: [number, number, number];
  wind: {x: number; z: number; speed: number};
  arrowIndex: number;
  turn: Shooter;
  flight: Flight | null;
  last: ArrowResult | null;
  results: ArrowResult[];
  score: {player: number; ai: number; playerX: number; aiX: number};
  cinematic: boolean;
  checkpoint: number;
  won: boolean;
  tied: boolean;
  stars: number;
};

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
export function random(s: {seed: number}) {s.seed = (Math.imul(s.seed, 1664525) + 1013904223) >>> 0; return s.seed / 4294967296;}
const gaussian = (a: number, b: number) => Math.sqrt(-2 * Math.log(Math.max(1e-9, a))) * Math.cos(2 * Math.PI * b);

const perEnd = (g: Game) => g.config.mode === 'career' ? ARROWS_PER_END : ARROWS_PER_END * 2;
export const shooterFor = (g: Game, index: number): Shooter => g.config.mode === 'match' && index % 2 === 1 ? 'ai' : 'player';
export const endOf = (g: Game, index = g.arrowIndex) => Math.floor(index / perEnd(g));
export const totalEnds = (g: Game) => Math.ceil(g.totalArrows / perEnd(g));

/** Centre of the target face at simulation time t. */
export function targetCentre(g: Pick<Game, 'motion'>, t: number): Point {
  const m = g.motion;
  if (m.kind === 'slide') return {x: m.amplitude * Math.sin(2 * Math.PI * t / m.period), y: TARGET_HEIGHT};
  if (m.kind === 'swing') {
    const angle = m.amplitude * Math.sin(2 * Math.PI * t / m.period);
    return {x: SWING_LENGTH * Math.sin(angle), y: TARGET_HEIGHT + SWING_LENGTH - SWING_LENGTH * Math.cos(angle)};
  }
  return {x: 0, y: TARGET_HEIGHT};
}

/** How far the sight wanders, in metres on the target plane, after holding for `hold` seconds. */
export function swayAmount(hold: number) {
  if (hold < DRAW_TIME) return 1;
  const steady = hold - DRAW_TIME;
  if (steady < 0.5) return 1 - 0.7 * (steady / 0.5);
  if (steady < STEADY_TIME) return 0.3;
  return Math.min(3, 0.3 + (steady - STEADY_TIME) * 0.6);
}
export const steadiness = (hold: number) => hold < DRAW_TIME + 0.5 ? 'settling' : hold < DRAW_TIME + STEADY_TIME ? 'steady' : 'tiring';
export function swayOffset(g: Pick<Game, 'sway' | 'distance'>, hold: number): Point {
  const [a, b, c] = g.sway, amp = SWAY * swayAmount(hold) * g.distance;
  return {
    x: amp * (Math.sin(1.3 * hold + a) + 0.5 * Math.sin(2.9 * hold + b)) / 1.5,
    y: amp * (0.8 * Math.cos(1.1 * hold + c) + 0.4 * Math.sin(3.7 * hold + a)) / 1.2,
  };
}
export const sightPoint = (g: Game): Point => {
  if (g.phase !== 'drawing') return {...g.aim};
  const s = swayOffset(g, g.hold);
  return {x: g.aim.x + s.x, y: g.aim.y + s.y};
};
export const drawAmount = (g: Game) => g.phase === 'drawing' ? Math.min(1, g.hold / DRAW_TIME) : 0;

function integrate(f: {pos: Vec; vel: Vec}, wind: {x: number; z: number}) {
  f.vel.x += DRAG * (wind.x - f.vel.x) * STEP;
  f.vel.y += (-GRAVITY - DRAG * f.vel.y) * STEP;
  f.vel.z += DRAG * (wind.z - f.vel.z) * STEP;
  f.pos.x += f.vel.x * STEP; f.pos.y += f.vel.y * STEP; f.pos.z += f.vel.z * STEP;
}

/** Where an arrow launched with `vel` crosses the target plane, and how long it takes. */
// Used only for aiming maths, so the ground is ignored: a guess that dips below it still teaches the solver.
function crossPlane(distance: number, vel: Vec, wind: {x: number; z: number}): (Point & {t: number}) | null {
  const f = {pos: {...BOW}, vel: {...vel}};
  for (let t = 0; t < 6; t += STEP) {
    const prev = {...f.pos};
    integrate(f, wind);
    if (f.pos.z <= -distance) {
      const k = (prev.z + distance) / (prev.z - f.pos.z);
      return {x: prev.x + (f.pos.x - prev.x) * k, y: prev.y + (f.pos.y - prev.y) * k, t: t + k * STEP};
    }
  }
  return null;
}

/** Launch velocity for a sight point. The sight is zeroed for the lane: no wind, full draw. */
export function launchVelocity(distance: number, sight: Point, power = 1): Vec {
  const t = distance / SPEED, goal = {x: sight.x, y: sight.y + 0.5 * GRAVITY * t * t};
  let dir = {x: 0, y: 0, z: -1};
  for (let i = 0; i < 6; i++) {
    const dx = goal.x - BOW.x, dy = goal.y - BOW.y, dz = -distance - BOW.z, len = Math.hypot(dx, dy, dz);
    dir = {x: dx / len, y: dy / len, z: dz / len};
    const hit = crossPlane(distance, {x: dir.x * SPEED, y: dir.y * SPEED, z: dir.z * SPEED}, {x: 0, z: 0});
    if (!hit) break;
    goal.x += sight.x - hit.x; goal.y += sight.y - hit.y;
  }
  const speed = SPEED * (0.55 + 0.45 * clamp(power, 0, 1));
  return {x: dir.x * speed, y: dir.y * speed, z: dir.z * speed};
}

/**
 * The sight point that puts a full-draw arrow released right now into the centre of the target,
 * leading moving targets and allowing for `wind` (defaults to the current wind).
 */
export function perfectAim(g: Game, wind: {x: number; z: number} = g.wind): Point {
  let aim = targetCentre(g, g.time);
  for (let i = 0; i < 6; i++) {
    const hit = crossPlane(g.distance, launchVelocity(g.distance, aim), wind);
    if (!hit) break;
    const goal = targetCentre(g, g.time + hit.t);
    aim = {x: aim.x + goal.x - hit.x, y: aim.y + goal.y - hit.y};
  }
  return aim;
}

export function scoreFor(radius: number, r: number) {
  if (r > radius) return 0;
  return Math.max(1, 10 - Math.floor(r / (radius / 10)));
}

/** Advances one flight step. Returns the result once the arrow sticks or is lost. */
function stepFlight(g: Game, f: Flight, time: number): ArrowResult | null {
  const prev = {...f.pos};
  integrate(f, g.wind);
  f.age += STEP;
  if (prev.z > -g.distance && f.pos.z <= -g.distance) {
    const k = (prev.z + g.distance) / (prev.z - f.pos.z);
    const hit = {x: prev.x + (f.pos.x - prev.x) * k, y: prev.y + (f.pos.y - prev.y) * k};
    const centre = targetCentre(g, time - STEP + k * STEP);
    const px = hit.x - centre.x, py = hit.y - centre.y, r = Math.hypot(px, py);
    f.plane = {x: px, y: py};
    if (r <= g.radius) {
      f.pos = {x: hit.x, y: hit.y, z: -g.distance};
      return {shooter: f.shooter, score: scoreFor(g.radius, r), x: r <= g.radius / 20, miss: false, px, py};
    }
  }
  if (f.pos.y <= 0 || f.pos.z < -g.distance - BACKSTOP || f.age > 6) {
    const plane = f.plane ?? {x: f.pos.x, y: f.pos.y - TARGET_HEIGHT};
    return {shooter: f.shooter, score: 0, x: false, miss: true, px: clamp(plane.x, -20, 20), py: clamp(plane.y, -20, 20)};
  }
  return null;
}

/** Runs a copy of the flight to the end, so a perfect shot can be slowed down before it lands. */
function predict(g: Game, f: Flight) {
  const copy: Flight = {...f, pos: {...f.pos}, vel: {...f.vel}, plane: null};
  let time = g.time;
  for (let i = 0; i < 6 / STEP; i++) {time += STEP; const r = stepFlight(g, copy, time); if (r) return r;}
  return null;
}

function launch(g: Game, shooter: Shooter, sight: Point, power: number) {
  g.flight = {pos: {...BOW}, vel: launchVelocity(g.distance, sight, power), age: 0, shooter, plane: null, power};
  g.phase = 'flight'; g.age = 0;
  const predicted = predict(g, g.flight);
  g.cinematic = shooter === 'player' && !!predicted && predicted.score >= 10;
}

/** Starts the next arrow. Always consumes the same number of random values, so saves can replay. */
function beginArrow(g: Game) {
  if (g.arrowIndex % perEnd(g) === 0) {
    const [low, high] = g.config.mode === 'career' ? g.config.level.wind : g.config.opponent.wind;
    const speed = low + (high - low) * random(g), angle = random(g) * Math.PI * 2;
    // Mostly a crosswind: the head/tail component is damped so the sight stays meaningful.
    g.wind = {x: Math.round(speed * Math.cos(angle) * 10) / 10, z: Math.round(speed * Math.sin(angle) * 6) / 10, speed: 0};
    g.wind.speed = Math.round(Math.hypot(g.wind.x, g.wind.z) * 10) / 10;
  }
  g.sway = [random(g) * 6.283, random(g) * 6.283, random(g) * 6.283];
  const a = random(g) * Math.PI * 2, r = g.radius * (1 + random(g) * 0.6);
  g.aim = {x: Math.cos(a) * r, y: TARGET_HEIGHT + Math.sin(a) * r};
  const n = [random(g), random(g), random(g), random(g)];
  g.aiNoise = [gaussian(n[0], n[1]), gaussian(n[1], n[0]), gaussian(n[2], n[3])];
  g.turn = shooterFor(g, g.arrowIndex);
  g.phase = g.turn === 'player' ? 'ready' : 'ai-aim';
  g.age = 0; g.hold = 0; g.flight = null; g.cinematic = false;
}

function finish(g: Game) {
  g.phase = 'finished'; g.age = 0; g.flight = null;
  if (g.config.mode === 'career') {
    g.stars = g.config.level.stars.filter(s => g.score.player >= s).length;
    g.won = g.stars >= 1;
  } else {
    const {player, ai, playerX, aiX} = g.score;
    g.won = player > ai || (player === ai && playerX > aiX);
    g.tied = player === ai && playerX === aiX;
  }
}

function commit(g: Game, result: ArrowResult) {
  g.results.push({...result}); g.last = {...result};
  if (result.shooter === 'player') {g.score.player += result.score; if (result.x) g.score.playerX++;}
  else {g.score.ai += result.score; if (result.x) g.score.aiX++;}
  g.arrowIndex++; g.checkpoint++;
}
function next(g: Game) {if (g.arrowIndex >= g.totalArrows) finish(g); else beginArrow(g);}

export function newGame(config: Config, seed: number): Game {
  const distance = config.mode === 'career' ? config.level.distance : config.opponent.distance;
  const g: Game = {
    config, distance, radius: TARGET_RADIUS[config.mode === 'career' ? config.level.target : 'standard'],
    motion: config.mode === 'career' ? config.level.motion : {kind: 'none'},
    totalArrows: config.mode === 'career' ? config.level.arrows : MATCH_ENDS * ARROWS_PER_END * 2,
    seed: seed >>> 0, initialSeed: seed >>> 0, time: 0, phase: 'ready', age: 0, hold: 0, aim: {x: 0, y: TARGET_HEIGHT},
    sway: [0, 0, 0], aiNoise: [0, 0, 0], wind: {x: 0, z: 0, speed: 0}, arrowIndex: 0, turn: 'player', flight: null, last: null,
    results: [], score: {player: 0, ai: 0, playerX: 0, aiX: 0}, cinematic: false, checkpoint: 0, won: false, tied: false, stars: 0,
  };
  beginArrow(g);
  return g;
}

export function startDraw(g: Game) {
  if (g.phase !== 'ready' || g.turn !== 'player') return false;
  g.phase = 'drawing'; g.hold = 0; g.age = 0; return true;
}
export function cancelDraw(g: Game) {if (g.phase === 'drawing') {g.phase = 'ready'; g.hold = 0;}}
export function setAim(g: Game, x: number, y: number) {
  if (g.turn !== 'player' || (g.phase !== 'ready' && g.phase !== 'drawing')) return;
  g.aim = {x: clamp(x, -8, 8), y: clamp(y, -1, 9)};
}
export const nudgeAim = (g: Game, dx: number, dy: number) => setAim(g, g.aim.x + dx, g.aim.y + dy);

/** Lets the arrow go. Returns false for a dry release (drawn too little), which just resets the draw. */
export function release(g: Game) {
  if (g.phase !== 'drawing') return false;
  const power = Math.min(1, g.hold / DRAW_TIME);
  if (power < MIN_DRAW) {cancelDraw(g); return false;}
  launch(g, 'player', sightPoint(g), power);
  return true;
}

function aiRelease(g: Game) {
  if (g.config.mode !== 'match') return;
  const {spread, windError} = g.config.opponent;
  const read = perfectAim(g), calm = perfectAim(g, {x: 0, z: 0});
  const [nx, ny, nw] = g.aiNoise, judged = 1 + windError * nw;
  launch(g, 'ai', {x: calm.x + (read.x - calm.x) * judged + spread * nx, y: calm.y + (read.y - calm.y) * judged + spread * ny}, 1);
}

/** Ends the impact pause early. It never changes a result. */
export function skipImpact(g: Game) {if (g.phase === 'impact') {g.age = IMPACT_TIME; return true;} return false;}

export function step(g: Game) {
  if (g.phase === 'finished') return;
  g.time += STEP; g.age += STEP;
  if (g.phase === 'drawing') g.hold += STEP;
  else if (g.phase === 'ai-aim' && g.age >= AI_AIM_TIME) aiRelease(g);
  else if (g.phase === 'flight' && g.flight) {
    const result = stepFlight(g, g.flight, g.time);
    if (result) {commit(g, result); g.phase = 'impact'; g.age = 0;}
  } else if (g.phase === 'impact' && g.age >= (g.last?.miss ? IMPACT_TIME * 0.75 : IMPACT_TIME)) next(g);
}

/** Arrows already in the target this end (the boss is cleared between ends). */
export function arrowsThisEnd(g: Game) {
  const start = Math.floor((g.phase === 'impact' ? g.arrowIndex - 1 : g.arrowIndex) / perEnd(g)) * perEnd(g);
  return g.results.slice(start).filter(r => !r.miss);
}

// Saves keep only completed arrows. A half-drawn or mid-air arrow is replayed from the start.
export type Checkpoint = {mode: 'career' | 'match'; id: string; initialSeed: number; results: ArrowResult[]};
export function checkpoint(g: Game): Checkpoint {
  return {mode: g.config.mode, id: g.config.mode === 'career' ? g.config.level.id : g.config.opponent.id, initialSeed: g.initialSeed, results: g.results.map(r => ({...r}))};
}
export function restore(config: Config, saved: Checkpoint) {
  const g = newGame(config, saved.initialSeed);
  for (const r of saved.results) {
    if (g.phase === 'finished') break;
    commit(g, r); next(g);
  }
  return g;
}
