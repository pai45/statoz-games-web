// Rim Rush simulation. Fixed 1/120 s steps, seeded randomness, no DOM. The renderer and UI only read it.
import {
  BALL_R, BIG_RIM_R, BODY_LOW, BODY_R, BODY_REACH, BUZZER_WINDOW, COUNTDOWN, JUMP_SPEED, MATCH_SECONDS, MAX_ANGLE, MAX_SPEED, MIN_ANGLE, MIN_SPEED,
  OVERTIME_SECONDS, RELEASE_X, RELEASE_Y, RIM_R, RIM_Y, SPOTS, START_SPOT, TARGET_SCORE, WALK_SPEED, GRAVITY, type Court, type Rival,
} from './levels';
import {BODY_E, ballistic, bounceBalls, bounceSegment, hoopX, integrate, speedFor, type Body, type Contact, type Hoop, type HoopSide, type Vec} from './physics';
import {aiThink, newAiState, type AiState} from './ai';

export const STEP = 1 / 120;
const SUBSTEPS = 2;
export type Side = 0 | 1;
export const facing = (side: Side) => (side === 0 ? 1 : -1);
/** The hoop a side shoots at: the player on the left attacks the right hoop. */
export const targetHoop = (side: Side): HoopSide => (side === 0 ? 1 : -1);
export const spotX = (side: Side, spot: number) => -facing(side) * SPOTS[spot];

export type Config = {mode: 'quick' | 'cup'; rival: Rival; court: Court; cup?: string; round?: number; /** Lets an AI play the left side (attract mode and tests). */ autopilot?: Rival};
export type Shooter = {
  x: number; spot: number; y: number; vy: number; airborne: boolean; jumpCooldown: number;
  frozen: number; double: boolean; shotAt: number; jumpedAt: number; landedAt: number; ai: AiState | null;
};
export type BallState = 'held' | 'flight' | 'loose';
export type Ball = Body & {
  owner: Side; state: BallState; returnIn: number; flight: number; age: number;
  rim: boolean; bank: boolean; blocked: boolean; buzzer: boolean; scored: boolean;
};
export type PowerKind = 'bigRim' | 'freeze' | 'double';
export const POWER_KINDS: PowerKind[] = ['bigRim', 'freeze', 'double'];
export const POWER_R = 0.38;
export const BIG_RIM_SECONDS = 6;
export const FREEZE_SECONDS = 2;
const POWER_LIFE = 9;
export type PowerUp = {kind: PowerKind; x0: number; x: number; y: number; age: number};
export type Phase = 'countdown' | 'play' | 'buzzer' | 'overtime' | 'finished';
export type Score = {side: Side; points: number; swish: boolean; bank: boolean; buzzer: boolean; double: boolean; time: number};
export type GameEvent =
  | {type: 'whistle' | 'buzzer' | 'overtime' | 'final'}
  | {type: 'shot' | 'jump' | 'land' | 'catch' | 'miss'; side: Side}
  | {type: 'score'; score: Score}
  | {type: 'block'; side: Side}
  | {type: 'contact'; kind: Contact; speed: number; ball: Side; hoop?: HoopSide}
  | {type: 'power'; side: Side; kind: PowerKind}
  | {type: 'spawn'; kind: PowerKind};
export type Stats = {shots: number; makes: number; swishes: number; banks: number; blocks: number};
export type Game = {
  config: Config; seed: number; rng: number; tick: number; time: number; phase: Phase;
  countdown: number; clock: number; overtime: number; buzzerWait: number; playTime: number;
  score: [number, number]; players: [Shooter, Shooter]; balls: [Ball, Ball];
  hoops: [Hoop, Hoop]; rimTimer: [number, number];
  power: PowerUp | null; nextPower: number; flights: number;
  pending: [{shot: {angle: number; power: number} | null; jump: boolean}, {shot: {angle: number; power: number} | null; jump: boolean}];
  /** The player's aim while dragging; display only, never read by the simulation. */
  aim: {angle: number; power: number} | null;
  events: GameEvent[]; stats: [Stats, Stats]; last: Score | null; winner: Side | null; tied: boolean;
};

/** Mulberry32: small, fast and identical everywhere. */
export function random(g: Pick<Game, 'rng'>) {
  g.rng = (g.rng + 0x6d2b79f5) >>> 0;
  let t = g.rng;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
export const gauss = (g: Pick<Game, 'rng'>) => Math.sqrt(-2 * Math.log(1 - random(g))) * Math.cos(2 * Math.PI * random(g));

const shooter = (side: Side, ai: AiState | null): Shooter => ({
  x: spotX(side, START_SPOT), spot: START_SPOT, y: 0, vy: 0, airborne: false, jumpCooldown: 0, frozen: 0, double: false,
  shotAt: -10, jumpedAt: -10, landedAt: -10, ai,
});
const ball = (owner: Side): Ball => ({
  x: 0, y: 0, vx: 0, vy: 0, owner, state: 'held', returnIn: 0, flight: 0, age: 0, rim: false, bank: false, blocked: false, buzzer: false, scored: false,
});
const stats = (): Stats => ({shots: 0, makes: 0, swishes: 0, banks: 0, blocks: 0});

export function newGame(config: Config, seed: number): Game {
  const g: Game = {
    config, seed: seed >>> 0, rng: seed >>> 0, tick: 0, time: 0, phase: 'countdown',
    countdown: COUNTDOWN, clock: MATCH_SECONDS, overtime: 0, buzzerWait: 0, playTime: 0,
    score: [0, 0], players: [shooter(0, config.autopilot ? newAiState() : null), shooter(1, newAiState())], balls: [ball(0), ball(1)],
    hoops: [{side: -1, rimR: RIM_R}, {side: 1, rimR: RIM_R}], rimTimer: [0, 0],
    power: null, nextPower: 10, flights: 0,
    pending: [{shot: null, jump: false}, {shot: null, jump: false}], aim: null,
    events: [], stats: [stats(), stats()], last: null, winner: null, tied: false,
  };
  for (const side of [0, 1] as const) holdBall(g, side);
  return g;
}

export const rivalOf = (g: Game, side: Side) => (side === 1 ? g.config.rival : g.config.autopilot ?? null);
const hoopIndex = (side: HoopSide) => (side === -1 ? 0 : 1);
export const hoopFor = (g: Game, side: HoopSide) => g.hoops[hoopIndex(side)];
export const atSpot = (p: Shooter, side: Side) => Math.abs(p.x - spotX(side, p.spot)) < 1e-6;
export const releasePoint = (g: Game, side: Side): Vec => {const p = g.players[side]; return {x: p.x + facing(side) * RELEASE_X, y: p.y + RELEASE_Y};};
export const handPoint = (g: Game, side: Side): Vec => {const p = g.players[side]; return {x: p.x + facing(side) * 0.2, y: p.y + 2.2};};
export const speedOf = (power: number) => MIN_SPEED + Math.max(0, Math.min(1, power)) * (MAX_SPEED - MIN_SPEED);
export const clampAngle = (a: number) => Math.max(MIN_ANGLE, Math.min(MAX_ANGLE, a));
export function launchVelocity(side: Side, angle: number, power: number): Vec {
  const a = clampAngle(angle), s = speedOf(power);
  return {x: facing(side) * s * Math.cos(a), y: s * Math.sin(a)};
}
/** Launch speed that drops a shot through the middle of the rim at `angle`, or null if out of reach. */
export const idealSpeed = (g: Game, side: Side, angle: number) => speedFor(releasePoint(g, side), {x: hoopX(targetHoop(side)), y: RIM_Y}, clampAngle(angle));
export const powerOf = (speed: number) => (speed - MIN_SPEED) / (MAX_SPEED - MIN_SPEED);
/**
 * Touch aim assist for the human player: a shot whose speed is within 12% of one that would
 * drop through the rim at the chosen angle is pulled 45% of the way toward it. Applied to the
 * input before it is queued, so replays stay deterministic.
 */
export function assistShot(g: Game, side: Side, angle: number, power: number) {
  const ideal = idealSpeed(g, side, angle);
  if (!ideal) return power;
  const v = speedOf(power), miss = (v - ideal) / ideal;
  if (Math.abs(miss) > 0.12) return power;
  return Math.max(0, Math.min(1, (v + (ideal - v) * 0.45 - MIN_SPEED) / (MAX_SPEED - MIN_SPEED)));
}
/** Points along the first `seconds` of a shot, for the aim guide. */
export function previewPath(g: Game, side: Side, angle: number, power: number, seconds: number, count: number): Vec[] {
  const p = releasePoint(g, side), v = launchVelocity(side, angle, power);
  return Array.from({length: count}, (_, i) => ballistic(p, v, (seconds * (i + 1)) / count));
}

/** A function (not an inline check) so TypeScript does not narrow the phase across calls that change it. */
const over = (g: Game) => g.phase === 'finished';
export const live = (g: Game) => g.phase === 'play' || g.phase === 'overtime';
export function canShoot(g: Game, side: Side) {
  const p = g.players[side];
  return live(g) && g.balls[side].state === 'held' && atSpot(p, side) && p.frozen <= 0;
}
export const canJump = (g: Game, side: Side) => {
  const p = g.players[side];
  return g.phase !== 'finished' && g.phase !== 'countdown' && !p.airborne && p.jumpCooldown <= 0 && p.frozen <= 0;
};

/** Queues a shot for the next step. Angle in radians above horizontal toward the target hoop, power 0..1. */
export function queueShot(g: Game, side: Side, angle: number, power: number) {
  if (!canShoot(g, side) || !Number.isFinite(angle) || !Number.isFinite(power)) return false;
  g.pending[side].shot = {angle: clampAngle(angle), power: Math.max(0, Math.min(1, power))};
  return true;
}
export function queueJump(g: Game, side: Side) {
  if (!canJump(g, side)) return false;
  g.pending[side].jump = true;
  return true;
}

function holdBall(g: Game, side: Side) {
  const b = g.balls[side], h = handPoint(g, side);
  b.x = h.x; b.y = h.y; b.vx = 0; b.vy = 0;
}

function shoot(g: Game, side: Side, angle: number, power: number) {
  const b = g.balls[side], p = releasePoint(g, side), v = launchVelocity(side, angle, power);
  Object.assign(b, {x: p.x, y: p.y, vx: v.x, vy: v.y, state: 'flight', returnIn: 0, flight: ++g.flights, age: 0,
    rim: false, bank: false, blocked: false, scored: false, buzzer: g.phase === 'play' && g.clock <= BUZZER_WINDOW});
  g.players[side].shotAt = g.time;
  g.stats[side].shots++;
  g.events.push({type: 'shot', side});
}

function finish(g: Game, winner: Side | null) {
  g.phase = 'finished'; g.winner = winner; g.tied = winner === null;
  g.events.push({type: 'final'});
}

function award(g: Game, b: Ball) {
  const side = b.owner, p = g.players[side];
  const swish = !b.rim && !b.bank, double = p.double;
  let points = 2 + (swish ? 1 : 0) + (b.bank ? 1 : 0);
  if (b.buzzer) points *= 2;
  if (double) {points *= 2; p.double = false;}
  g.score[side] += points;
  const st = g.stats[side]; st.makes++; if (swish) st.swishes++; if (b.bank) st.banks++;
  const score: Score = {side, points, swish, bank: b.bank, buzzer: b.buzzer, double, time: g.time};
  g.last = score; b.scored = true;
  g.events.push({type: 'score', score});
  // A make moves the shooter to a new spot.
  const choices = SPOTS.map((_, i) => i).filter(i => i !== p.spot);
  p.spot = choices[Math.floor(random(g) * choices.length)];
  if (g.phase === 'overtime') finish(g, side);
  else if (g.phase === 'play' && g.score[side] >= TARGET_SCORE) finish(g, side);
}

function settle(b: Ball, delay: number) {
  b.state = 'loose'; b.returnIn = delay;
}

function collect(g: Game, side: Side, kind: PowerKind) {
  if (kind === 'bigRim') {const i = hoopIndex(targetHoop(side)); g.hoops[i].rimR = BIG_RIM_R; g.rimTimer[i] = BIG_RIM_SECONDS;}
  if (kind === 'freeze') {const other = g.players[side === 0 ? 1 : 0]; other.frozen = FREEZE_SECONDS; g.pending[side === 0 ? 1 : 0] = {shot: null, jump: false};}
  if (kind === 'double') g.players[side].double = true;
  g.events.push({type: 'power', side, kind});
}

function updatePlayer(g: Game, side: Side) {
  const p = g.players[side], pend = g.pending[side];
  if (pend.jump) {
    pend.jump = false;
    if (canJump(g, side)) {p.airborne = true; p.vy = JUMP_SPEED; p.jumpedAt = g.time; g.events.push({type: 'jump', side});}
  }
  if (pend.shot) {
    const s = pend.shot; pend.shot = null;
    if (canShoot(g, side)) shoot(g, side, s.angle, s.power);
  }
  if (p.frozen > 0) p.frozen = Math.max(0, p.frozen - STEP);
  if (p.jumpCooldown > 0) p.jumpCooldown = Math.max(0, p.jumpCooldown - STEP);
  if (p.airborne) {
    p.vy -= GRAVITY * STEP; p.y += p.vy * STEP;
    if (p.y <= 0) {p.y = 0; p.vy = 0; p.airborne = false; p.jumpCooldown = 0.25; p.landedAt = g.time; g.events.push({type: 'land', side});}
  } else if (g.phase !== 'finished') {
    const target = spotX(side, p.spot), dx = target - p.x, move = WALK_SPEED * STEP;
    p.x = Math.abs(dx) <= move ? target : p.x + Math.sign(dx) * move;
  }
}

function updateBall(g: Game, side: Side, dt: number) {
  const b = g.balls[side];
  if (b.state === 'held') {holdBall(g, side); return;}
  const contacts: {kind: Contact; speed: number; side?: HoopSide}[] = [];
  const prevY = b.y;
  integrate(b, dt, g.hoops, contacts);
  b.age += dt;
  if (b.state === 'flight') {
    // The defender's body and raised hands.
    const d: Side = side === 0 ? 1 : 0, p = g.players[d];
    if (!b.blocked) {
      const hit = bounceSegment(b, p.x, p.y + BODY_LOW, p.y + BODY_REACH, BODY_R, BODY_E);
      if (hit > 0) {
        if (b.y > p.y + 1.8) {
          // A swat sends the ball back the way it came.
          b.blocked = true; b.vx = -facing(side) * (1.4 + Math.abs(b.vx) * 0.3); b.vy = Math.max(b.vy, 1.6);
          g.stats[d].blocks++; g.events.push({type: 'block', side: d});
        } else contacts.push({kind: 'body', speed: hit});
      }
    }
    const target = targetHoop(side), hoop = hoopFor(g, target), cx = hoopX(target);
    if (!b.scored && !over(g) && prevY >= RIM_Y && b.y < RIM_Y && b.vy < 0 && Math.abs(b.x - cx) < hoop.rimR - BALL_R * 0.4) award(g, b);
    for (const c of contacts) {
      if (c.kind === 'rim') b.rim = true;
      if ((c.kind === 'board' && c.side === target) || c.kind === 'wall') b.bank = true;
    }
    if (g.power) {
      const dx = b.x - g.power.x, dy = b.y - g.power.y, r = POWER_R + BALL_R;
      if (dx * dx + dy * dy < r * r) {const kind = g.power.kind; g.power = null; g.nextPower = g.playTime + 14 + random(g) * 6; collect(g, side, kind);}
    }
    if (b.scored) settle(b, 0.6);
    else if (contacts.some(c => c.kind === 'floor') || b.age > 5) {settle(b, 0.8); g.events.push({type: 'miss', side});}
  }
  for (const c of contacts) g.events.push({type: 'contact', kind: c.kind, speed: c.speed, ball: side, hoop: c.side});
}

/** Advances the match by one fixed step. */
export function step(g: Game) {
  g.tick++; g.time += STEP;
  if (over(g)) {
    // After the final whistle the balls and players settle; nothing scores.
    for (const side of [0, 1] as const) updatePlayer(g, side);
    for (let s = 0; s < SUBSTEPS; s++) for (const side of [0, 1] as const) updateBall(g, side, STEP / SUBSTEPS);
    return;
  }
  if (g.phase === 'countdown') {
    g.countdown -= STEP;
    if (g.countdown <= 0) {g.countdown = 0; g.phase = 'play'; g.events.push({type: 'whistle'});}
  } else if (g.phase === 'play') {
    g.clock = Math.max(0, g.clock - STEP); g.playTime += STEP;
    if (g.clock === 0) {g.phase = 'buzzer'; g.buzzerWait = 0; g.events.push({type: 'buzzer'});}
  } else if (g.phase === 'overtime') {
    g.overtime += STEP; g.playTime += STEP;
    if (g.overtime >= OVERTIME_SECONDS) {finish(g, null); return;}
  }

  // Power-ups float above centre court for a while.
  if (live(g)) {
    if (g.power) {
      g.power.age += STEP; g.power.x = g.power.x0 + Math.sin(g.power.age * 1.3) * 0.35;
      if (g.power.age > POWER_LIFE) {g.power = null; g.nextPower = g.playTime + 10 + random(g) * 6;}
    } else if (g.playTime >= g.nextPower) {
      const kind = POWER_KINDS[Math.floor(random(g) * POWER_KINDS.length)], x0 = (random(g) - 0.5) * 1.2;
      g.power = {kind, x0, x: x0, y: 4.55 + random(g) * 0.4, age: 0};
      g.events.push({type: 'spawn', kind});
    }
  }
  for (let i = 0; i < 2; i++) if (g.rimTimer[i] > 0) {g.rimTimer[i] = Math.max(0, g.rimTimer[i] - STEP); if (g.rimTimer[i] === 0) g.hoops[i].rimR = RIM_R;}

  for (const side of [0, 1] as const) if (g.players[side].ai && g.phase !== 'countdown') aiThink(g, side);
  for (const side of [0, 1] as const) updatePlayer(g, side);
  const dt = STEP / SUBSTEPS;
  for (let s = 0; s < SUBSTEPS; s++) {
    for (const side of [0, 1] as const) updateBall(g, side, dt);
    const [a, b] = g.balls;
    if (a.state !== 'held' && b.state !== 'held') {
      const speed = bounceBalls(a, b);
      if (speed > 0.3) g.events.push({type: 'contact', kind: 'ball', speed, ball: 0});
    }
  }
  if (over(g)) return;
  for (const side of [0, 1] as const) {
    const b = g.balls[side];
    if (b.state !== 'loose') continue;
    b.returnIn -= STEP;
    if (b.returnIn <= 0 && !g.players[side].airborne) {b.state = 'held'; holdBall(g, side); g.events.push({type: 'catch', side});}
  }
  if (g.phase === 'buzzer') {
    g.buzzerWait += STEP;
    if (!g.balls.some(b => b.state === 'flight') || g.buzzerWait > 5) {
      if (g.score[0] !== g.score[1]) finish(g, g.score[0] > g.score[1] ? 0 : 1);
      else {g.phase = 'overtime'; g.overtime = 0; g.events.push({type: 'overtime'});}
    }
  }
}

/** Removes and returns the events since the last call. */
export function drain(g: Game) {
  const out = g.events; g.events = [];
  return out;
}

/** Seconds shown on the scoreboard. */
export const clockText = (g: Pick<Game, 'phase' | 'clock' | 'overtime'>) =>
  g.phase === 'overtime' ? 'OT' : `${Math.floor(Math.ceil(g.clock) / 60)}:${String(Math.ceil(g.clock) % 60).padStart(2, '0')}`;
