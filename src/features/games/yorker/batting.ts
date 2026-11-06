import {DELIVERIES, type Batter, type Conditions, type DeliveryId, type DeliverySpec, type FieldPreset, type BowlerKind} from './data';
import {
  BALL_R, BAIL_TOP, PITCH, POPPING, STUMP_HALF, WIDE_LINE, crossing, endTime, fly, positionAt, stateAt, stumpTest, velocityAt,
  type Flight, type FlightParams, type V3,
} from './physics';

/** Seeded RNG shared with the engine (LCG, same as the other bundled games). */
export type Rng = {seed: number};
export function random(s: Rng) {s.seed = (Math.imul(s.seed, 1664525)+1013904223) >>> 0; return s.seed/4294967296;}
export function gauss(s: Rng) {const u = Math.max(1e-9, random(s)), v = random(s); return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);}
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const rad = (d: number) => d*Math.PI/180;

export type Shot = 'leave' | 'duck' | 'defend' | 'block' | 'drive' | 'loft' | 'punch' | 'cut' | 'pull' | 'flick' | 'sweep';
type ShotSpec = {bat: 'v' | 'h' | 'none'; foot: 'front' | 'back'; speed: number; elev: number};
export const SHOTS: Record<Shot, ShotSpec> = {
  leave: {bat: 'none', foot: 'front', speed: 0, elev: 0},
  duck: {bat: 'none', foot: 'back', speed: 0, elev: 0},
  defend: {bat: 'v', foot: 'front', speed: 6, elev: -10},
  block: {bat: 'v', foot: 'back', speed: 5, elev: -14},
  drive: {bat: 'v', foot: 'front', speed: 31, elev: -1},
  loft: {bat: 'v', foot: 'front', speed: 33, elev: 27},
  punch: {bat: 'v', foot: 'back', speed: 26, elev: -1},
  cut: {bat: 'h', foot: 'back', speed: 30, elev: 1},
  pull: {bat: 'h', foot: 'back', speed: 32, elev: 9},
  flick: {bat: 'v', foot: 'front', speed: 27, elev: 2},
  sweep: {bat: 'h', foot: 'front', speed: 25, elev: 7},
};
export type Contact = 'none' | 'middle' | 'mistimed' | 'outside-edge' | 'inside-edge' | 'top-edge' | 'bottom-edge';
export type Dismissal = 'bowled' | 'lbw' | 'caught' | 'caught-behind' | 'played-on';

/* ---------- Fielding positions (batter-relative: +x is the batter's off side, θ from straight toward off) ---------- */
type Spot = {x: number; z: number; role: 'keeper' | 'slip' | 'close' | 'ring' | 'deep'};
const polar = (deg: number, d: number, role: Spot['role']): Spot => ({x: Math.sin(rad(deg))*d, z: -Math.cos(rad(deg))*d, role});
const PACE_FIELDS: Record<FieldPreset, Spot[]> = {
  attack: [polar(172, 13.5, 'slip'), polar(166, 13.9, 'slip'), polar(138, 10, 'close'), polar(95, 24, 'ring'), polar(60, 26, 'ring'), polar(12, 27, 'ring'), polar(-12, 27, 'ring'), polar(-95, 24, 'ring'), polar(-160, 60, 'deep')],
  balanced: [polar(172, 13.5, 'slip'), polar(98, 26, 'ring'), polar(62, 30, 'ring'), polar(14, 30, 'ring'), polar(-14, 30, 'ring'), polar(-55, 29, 'ring'), polar(-95, 26, 'ring'), polar(150, 60, 'deep'), polar(-155, 60, 'deep')],
  defend: [polar(148, 62, 'deep'), polar(100, 63, 'deep'), polar(62, 64, 'deep'), polar(14, 68, 'deep'), polar(-14, 68, 'deep'), polar(-58, 65, 'deep'), polar(-100, 63, 'deep'), polar(-158, 62, 'deep'), polar(55, 24, 'ring')],
};
const SPIN_FIELDS: Record<FieldPreset, Spot[]> = {
  attack: [{x: 1.25, z: 1.7, role: 'slip'}, polar(-110, 5, 'close'), polar(75, 4.6, 'close'), polar(60, 24, 'ring'), polar(14, 26, 'ring'), polar(-14, 26, 'ring'), polar(-55, 25, 'ring'), polar(-95, 60, 'deep'), polar(-10, 66, 'deep')],
  balanced: [{x: 1.25, z: 1.7, role: 'slip'}, polar(95, 22, 'ring'), polar(60, 26, 'ring'), polar(14, 27, 'ring'), polar(-14, 27, 'ring'), polar(-55, 26, 'ring'), polar(-95, 24, 'ring'), polar(-60, 62, 'deep'), polar(12, 66, 'deep')],
  defend: [polar(100, 62, 'deep'), polar(62, 63, 'deep'), polar(12, 67, 'deep'), polar(-12, 67, 'deep'), polar(-58, 64, 'deep'), polar(-100, 62, 'deep'), polar(-150, 24, 'ring'), polar(60, 26, 'ring'), polar(-55, 26, 'ring')],
};
export type Fielder = {x: number; z: number; role: Spot['role'] | 'bowler'};
/** World fielder positions: index 0 is the wicketkeeper, the last is the bowler after the follow-through. */
export function fieldPositions(kind: BowlerKind, preset: FieldPreset, hand: 'R' | 'L'): Fielder[] {
  const off = hand === 'R' ? 1 : -1, spots = (kind === 'pace' ? PACE_FIELDS : SPIN_FIELDS)[preset];
  const keeper: Fielder = kind === 'pace' ? {x: .35*off, z: 13, role: 'keeper'} : {x: .2*off, z: .95, role: 'keeper'};
  return [keeper, ...spots.map(s => ({x: s.x*off, z: s.z, role: s.role})), {x: 1.1, z: kind === 'pace' ? -14.2 : -16.4, role: 'bowler'}];
}

/* ---------- Batter geometry (batter-relative, then mirrored) ---------- */
const PAD_HALF = .095, PAD_TOP = .62;
/** What the batter has seen recently: average length (m), movement direction (-1..1, + away) and pace (km/h). */
export type Expectation = {len: number; move: number; speed: number; count: number};
export type BatterSetup = {batter: Batter; intent: number; set: boolean; freeHit: boolean; conditions: Conditions; bowler: BowlerKind; stock: DeliveryId; expect: Expectation};
export type BatResult = {
  shot: Shot; contact: Contact; contactT: number; contactP: V3 | null; batP: V3 | null; quality: number; timing: number;
  hit: Flight | null; pad: {t: number; p: V3} | null; body: {t: number; p: V3} | null;
  read: boolean; beaten: boolean; foot: 'front' | 'back'; contactZ: number;
};

export type DeliveryView = {
  spec: DeliverySpec; params: FlightParams; flight: Flight; releaseT: number;
  bounce: V3 | null; speed: number; disguised: number;
};

/** Pitch length band from the striker's stumps. */
export function lengthName(bounceZ: number | null) {
  if (bounceZ === null || bounceZ > POPPING+.25) return 'Full toss';
  const m = -bounceZ;
  return m < 2 ? 'Yorker' : m < 3.8 ? 'Full' : m < 6.2 ? 'Good length' : m < 8.2 ? 'Back of a length' : 'Short';
}

/**
 * The batter's response to one delivery. All randomness comes from `rng` in a fixed order per branch,
 * so replaying the same inputs rebuilds the same result.
 */
export function playDelivery(rng: Rng, d: DeliveryView, s: BatterSetup): BatResult {
  const b = s.batter, off = b.hand === 'R' ? 1 : -1;
  const weak = (k: keyof Batter['weak']) => b.weak[k] ?? 0;
  const skill = clamp(b.skill+(s.set ? .05 : 0), .05, .97);
  // Reading the hand: disguised variations are picked up less often.
  const read = random(rng) < clamp(1-d.disguised*(1.15-skill)*1.15-(d.spec.kind === 'spin' ? weak('spin')*.4 : 0)-(d.spec.id === 'slower' ? weak('slower')*.5 : 0), .08, 1);
  const bounceZ = d.bounce ? d.bounce.z : null, full = bounceZ === null || bounceZ > POPPING+.25;
  // Perceived length (the early read) chooses the shot.
  const lenNoise = gauss(rng)*(.22+.55*(1-skill));
  const lenM = full ? 0 : Math.max(0, -bounceZ!+lenNoise);
  const atStumps = crossing(d.flight, 0) ?? crossing(d.flight, -.6);
  const lineOff = (atStumps ? atStumps.p.x : d.flight.data[(d.flight.count-1)*4+1])*off;
  const crease = crossing(d.flight, POPPING);
  const height = crease ? crease.p.y : .5;
  const intent = s.freeHit ? 1 : s.intent;
  const shot = chooseShot(rng, {lenM, lineOff, height, full, intent, b, spin: d.spec.kind === 'spin'});
  const spec = SHOTS[shot];
  const contactZ = spec.foot === 'back' ? -.8 : full ? -1.75 : clamp((bounceZ ?? -2)+.3, -2.05, -1.25);
  const at = crossing(d.flight, contactZ);
  const pad = padFor(shot, off, contactZ, lineOff);
  const body = bodyHit(d.flight, off);
  if (!at) return {shot, contact: 'none', contactT: endTime(d.flight), contactP: null, batP: null, quality: 0, timing: 0, hit: null, pad: null, body, read, beaten: false, foot: spec.foot, contactZ};

  // What the batter commits to: the flight extrapolated from the moment of decision, without the late movement he cannot see.
  const reaction = .23-.06*skill;
  const seeT = Math.max(d.releaseT+.12, at.t-reaction);
  const expected = read ? d.spec : DELIVERIES[s.stock];
  const seen = stateAt(d.flight, seeT), seenBounced = d.bounce !== null && seeT > d.flight.bounceT;
  const predict = fly(seen.p, seen.v, {swing: 0, drift: 0, deviation: d.spec.kind === 'spin' ? expected.turn*s.conditions.turn : 0, restitution: d.params.restitution*(expected.bounce/d.spec.bounce), retention: d.params.retention}, contactZ+.5, 2, seeT, seenBounced);
  // Skilled batters adjust late with their hands, cancelling part of the movement they could not see.
  const seenAt = crossing(predict, contactZ)?.p ?? at.p, adjust = 1-.45*skill;
  const guess = {x: at.p.x+(seenAt.x-at.p.x)*adjust, y: at.p.y+(seenAt.y-at.p.y)*adjust, z: contactZ};
  // Difficulty: pace, length, the corridor outside off, weaknesses.
  const pace = (d.speed/40)**2;
  const lengthBand = full ? -.25 : lenM < 2 ? .4 : lenM < 3.8 ? -.05 : lenM < 6.2 ? .26 : lenM < 8.2 ? .12 : .18;
  const corridor = lineOff > .06 && lineOff < .42 ? .2 : 0;
  const movement = d.spec.swing > 0 ? weak('outswing') : d.spec.swing < 0 ? weak('inswing') : 0;
  const lengthWeak = full ? 0 : lenM < 2 ? weak('yorker') : lenM < 3.8 ? weak('full') : lenM > 7.6 ? weak('short') : 0;
  const styleWeak = (d.spec.kind === 'spin' ? weak('spin') : weak('pace'))*.6;
  // Breaking the pattern: a change of length or of movement direction from what he has been seeing.
  const actualMove = Math.sign(d.spec.swing)+(d.spec.kind === 'spin' ? Math.sign(d.spec.turn)*off*.8 : 0);
  const surprise = s.expect.count < 2 ? 0 : clamp(Math.abs((full ? 0 : -bounceZ!)-s.expect.len)/6, 0, 1)*.6+(Math.abs(actualMove-s.expect.move) > 1 ? .55 : Math.abs(actualMove-s.expect.move) > .5 ? .25 : 0);
  const difficulty = clamp(.5+.45*pace+lengthBand+corridor+movement*.9+lengthWeak*.9+styleWeak+surprise*.45, .2, 2.6);
  // The wrong shot for the length is harder to execute and pays less.
  const suit = suitFor(shot, full ? 0 : -bounceZ!, full, lineOff, d.spec.kind === 'spin');
  const sx = (.008+.034*(1-skill)*difficulty)*(1+.6*(1-suit)), sy = (.012+.04*(1-skill)*difficulty)*(1+.4*(1-suit)), st = (.008+.026*(1-skill)*difficulty)*(1+1.2*(1-suit));
  const batP = {x: guess.x+gauss(rng)*sx, y: guess.y+gauss(rng)*sy, z: contactZ};
  // Timing: a misread slower ball has the batter through the shot early.
  const flightTime = at.t-d.releaseT, stockArrival = !read && expected.speed > d.spec.speed+6 ? flightTime*(d.spec.speed/expected.speed) : flightTime;
  const timing = (stockArrival-flightTime)*.6+gauss(rng)*st;
  const base: BatResult = {shot, contact: 'none', contactT: at.t, contactP: at.p, batP, quality: 0, timing, hit: null, pad: null, body, read, beaten: false, foot: spec.foot, contactZ};
  if (spec.bat === 'none') return {...base, batP: null, pad: padStrike(d.flight, pad)};

  const ex = (at.p.x-batP.x)*off, ey = at.p.y-batP.y;
  let contact: Contact = 'none';
  if (Math.abs(timing) <= .09) {
    if (spec.bat === 'v') {
      if (at.p.y < .13 && ey < -.05) contact = 'none';
      else if (ey > .3 || at.p.y > 1.35) contact = 'top-edge';
      else if (Math.abs(ex) <= .045) contact = Math.abs(timing) > .042 ? 'mistimed' : 'middle';
      else if (Math.abs(ex) <= .08) contact = ex > 0 ? 'outside-edge' : 'inside-edge';
    } else {
      if (Math.abs(ex) > .4) contact = 'none';
      else if (Math.abs(ey) <= .048) contact = Math.abs(timing) > .042 ? 'mistimed' : 'middle';
      else if (Math.abs(ey) <= .088) contact = ey > 0 ? 'top-edge' : 'bottom-edge';
    }
  }
  const quality = contact === 'middle' || contact === 'mistimed' ? clamp((1-Math.abs(spec.bat === 'v' ? ex : ey)/.045*.5-Math.abs(timing)/.042*.3)*suit, .05, 1) : 0;
  const result: BatResult = {...base, contact, quality, beaten: contact === 'none' && Math.abs(ex) < .2 && lineOff > -.05};
  if (contact === 'none') return {...result, pad: padStrike(d.flight, pad)};
  return {...result, hit: strike(rng, s, result, at.p, velocityAt(d.flight, at.t), off, lineOff)};
}

function chooseShot(rng: Rng, o: {lenM: number; lineOff: number; height: number; full: boolean; intent: number; b: Batter; spin: boolean}): Shot {
  const r = random(rng), r2 = random(rng), {lenM, lineOff, height, intent, b} = o;
  const likes = (k: Batter['strong'][number]) => b.strong.includes(k) ? .18 : 0;
  if (lineOff > 1.05 || lineOff < -.75) return 'leave';
  if (o.full) return intent+likes('loft') > .55+r*.3 ? 'loft' : lineOff < -.12 ? 'flick' : 'drive';
  if (height > 1.45) return intent+likes('pull')-(b.weak.short ?? 0)*.4 > .35+r*.55 ? 'pull' : 'duck';
  if (lenM >= 8.2) return lineOff > .32 ? (intent+likes('cut') > r*.9 ? 'cut' : 'leave') : (intent+likes('pull') > .2+r*.6 ? 'pull' : 'block');
  if (lenM >= 6.2) {
    if (lineOff > .48) return intent+likes('cut') > .3+r*.5 ? 'cut' : 'leave';
    return intent > .35+r*.5 ? (lineOff < -.05 ? 'pull' : 'punch') : 'block';
  }
  if (lenM >= 3.8) {
    if (lineOff > .5) return r < .7-intent*.55 ? 'leave' : 'drive';
    if (o.spin && lineOff < .2 && intent > .45 && r2 < .25+likes('sweep')) return 'sweep';
    if (lineOff > .12) return r < .16*(1-intent) ? 'leave' : intent > .25+r2*.75 ? (intent > .78 && r2 < .5 ? 'loft' : 'drive') : 'defend';
    return intent > .3+r*.7 ? (intent > .74 && r2 < .45 ? 'loft' : lineOff < -.1 ? 'flick' : 'drive') : 'defend';
  }
  if (lenM >= 1.9) {
    if (lineOff < -.12) return intent > .25+r*.4 ? 'flick' : 'defend';
    if (o.spin && intent > .55 && r2 < .2+likes('sweep')) return 'sweep';
    return intent+likes('loft') > .6+r*.35 ? 'loft' : intent > .15+r*.45 ? 'drive' : 'defend';
  }
  return intent > .55+r*.4 ? 'drive' : 'block';
}

type Band = 'yorker' | 'full' | 'good' | 'back' | 'short';
const SUIT: Partial<Record<Shot, Record<Band, number>>> = {
  drive: {yorker: .4, full: 1, good: .85, back: .6, short: .45}, loft: {yorker: .35, full: 1, good: .7, back: .5, short: .4},
  punch: {yorker: .3, full: .6, good: .8, back: 1, short: .85}, cut: {yorker: .2, full: .35, good: .6, back: .9, short: 1},
  pull: {yorker: .2, full: .3, good: .5, back: .8, short: 1}, flick: {yorker: .55, full: 1, good: .85, back: .6, short: .4},
  sweep: {yorker: .3, full: .9, good: 1, back: .5, short: .3},
};
/** How well a shot suits the actual length and line (1 = textbook). */
export function suitFor(shot: Shot, lenM: number, full: boolean, lineOff: number, spin: boolean) {
  const table = SUIT[shot];
  if (!table) return 1;
  const band: Band = full ? 'full' : lenM < 1.9 ? 'yorker' : lenM < 3.8 ? 'full' : lenM < 6.2 ? 'good' : lenM < 8.2 ? 'back' : 'short';
  let s = table[band];
  if (shot === 'cut' && lineOff < .25) s *= .6;
  if (shot === 'sweep' && !spin) s *= .45;
  return s;
}

/** Where the leading pad is for each shot (batter-relative x around a guard on middle-and-leg). */
export function padFor(shot: Shot, off: number, contactZ: number, lineOff: number) {
  const front = SHOTS[shot].foot === 'front';
  const x = shot === 'leave' ? -.06 : shot === 'duck' ? -.2 : front ? clamp(lineOff-.13, -.32, .4) : clamp(lineOff*.35-.06, -.22, .2);
  return {x: x*off, z: shot === 'leave' ? -1.42 : front ? contactZ+.22 : -.5};
}
function padStrike(f: Flight, pad: {x: number; z: number}) {
  const at = crossing(f, pad.z);
  return at && Math.abs(at.p.x-pad.x) <= PAD_HALF+BALL_R && at.p.y <= PAD_TOP ? {t: at.t, p: at.p} : null;
}
function bodyHit(f: Flight, off: number) {
  const at = crossing(f, -.78);
  if (!at) return null;
  const x = at.p.x*off;
  return at.p.y > .88 && at.p.y < 1.62 && x > -.5 && x < -.02 ? {t: at.t, p: at.p} : null;
}

const HIT: FlightParams = {swing: 0, drift: 0, deviation: 0, restitution: .42, retention: .7, grass: true};
/** Velocity off the bat for clean, mistimed and edged contact. */
function strike(rng: Rng, s: BatterSetup, r: BatResult, p: V3, vin: V3, off: number, lineOff: number): Flight {
  const spec = SHOTS[r.shot], incoming = Math.hypot(vin.x, vin.y, vin.z), b = s.batter;
  let theta: number, elev: number, speed: number;
  const n1 = gauss(rng), n2 = gauss(rng), n3 = random(rng);
  if (r.contact === 'middle' || r.contact === 'mistimed') {
    const base = r.shot === 'drive' || r.shot === 'loft' ? clamp(lineOff*170, -28, 62) : r.shot === 'punch' ? 35+lineOff*60 : r.shot === 'cut' ? 92+n3*20 : r.shot === 'pull' ? -(70+n3*30) : r.shot === 'flick' ? -(30+n3*28) : r.shot === 'sweep' ? -(78+n3*40) : (n3-.5)*44;
    theta = base-r.timing*320+n1*7;
    const power = .82+.36*b.power;
    speed = r.shot === 'defend' || r.shot === 'block' ? 3.5+3.5*r.quality+n3*1.5 : spec.speed*(.45+.55*r.quality)*power+.1*incoming;
    elev = spec.elev+n2*(r.shot === 'loft' || r.shot === 'pull' ? 5 : 2.6)+(r.shot === 'loft' ? b.power*5 : 0);
    if (r.contact === 'mistimed') {speed *= .62; if (r.timing < 0) elev += 15+n3*10; else {elev -= 4; theta += 14;}}
  } else if (r.contact === 'outside-edge') {
    theta = 150+n3*22; speed = incoming*(.62+.22*random(rng)); elev = Math.atan2(vin.y*.6+(n1*1.2+1), speed)*180/Math.PI;
  } else if (r.contact === 'inside-edge') {
    const turn = rad(8+n3*16)*-off, c = Math.cos(turn), sn = Math.sin(turn);
    return fly(p, {x: (vin.x*c+vin.z*sn)*.78, y: vin.y*.7, z: (-vin.x*sn+vin.z*c)*.78}, HIT, 999, 6, r.contactT, true);
  } else if (r.contact === 'top-edge') {
    theta = (r.shot === 'cut' ? 1 : -1)*(110+n3*65); speed = 13+random(rng)*9; elev = 52+n1*9;
  } else {
    // Bottom edge: down into the pitch, on toward the stumps or the keeper.
    return fly(p, {x: vin.x*.5+n1*.6, y: -2.5-n3*2, z: vin.z*.45}, HIT, 999, 6, r.contactT, true);
  }
  const t = rad(theta), e = rad(clamp(elev, -25, 80));
  return fly(p, {x: Math.sin(t)*off*Math.cos(e)*speed, y: Math.sin(e)*speed, z: -Math.cos(t)*Math.cos(e)*speed}, HIT, 999, 7, r.contactT, true);
}

/* ---------- Fielding the struck ball ---------- */
export type FieldEvent = {kind: 'catch' | 'drop' | 'stop' | 'four' | 'six' | 'dead'; fielder: number; t: number; p: V3; runs: number};
const BOUNDARY_CENTRE = -PITCH/2;
export const boundaryDistance = (p: {x: number; z: number}) => Math.hypot(p.x, p.z-BOUNDARY_CENTRE);
/** Time for a fielder of this role to cover `dist` metres from a standing start. */
export function fielderTime(role: Fielder['role'], dist: number) {
  const reaction = role === 'keeper' || role === 'slip' || role === 'close' ? .06 : role === 'bowler' ? .32 : .28;
  const top = role === 'deep' ? 7.4 : role === 'bowler' ? 5.5 : 6.9, acc = 8, dAcc = top*top/(2*acc);
  return reaction+(dist < dAcc ? Math.sqrt(2*dist/acc) : top/acc+(dist-dAcc)/top);
}
/** Earliest fielder interception, a boundary, or the ball coming to rest. Runs are judged from when the throw arrives. */
export function fieldBall(rng: Rng, hit: Flight, field: Fielder[], boundary: number, contactT: number, intent: number): FieldEvent {
  const bounceT = hit.bounce ? hit.bounceT : Infinity, last = hit.count-1;
  let best: FieldEvent | null = null;
  for (let i = 2; i <= last && !best; i += 2) {
    const t = hit.data[i*4], dt = t-contactT, x = hit.data[i*4+1], y = hit.data[i*4+2], z = hit.data[i*4+3];
    if (boundaryDistance({x, z}) >= boundary) {best = {kind: t < bounceT ? 'six' : 'four', fielder: -1, t, p: {x, y, z}, runs: t < bounceT ? 6 : 4}; break;}
    const inAir = t < bounceT;
    for (let f = 0; f < field.length; f++) {
      const F = field[f], reach = F.role === 'keeper' ? 1.5 : F.role === 'slip' || F.role === 'close' ? 1.35 : 1.1;
      const d = Math.max(0, Math.hypot(x-F.x, z-F.z)-reach);
      if (fielderTime(F.role, d) > dt) continue;
      if (inAir ? y > (F.role === 'keeper' || F.role === 'slip' ? 2.3 : 2.6) || y < .08 : y > 1.1) continue;
      if (inAir) {
        const spare = dt-fielderTime(F.role, d), prev = (i-2)*4, speed = Math.hypot(x-hit.data[prev+1], y-hit.data[prev+2], z-hit.data[prev+3])/Math.max(1e-4, t-hit.data[prev]);
        const p = clamp(.5+spare*.8, .5, F.role === 'keeper' ? .95 : .92)*(speed > 24 ? .88 : 1);
        best = {kind: random(rng) < p ? 'catch' : 'drop', fielder: f, t, p: {x, y, z}, runs: 0};
      } else best = {kind: 'stop', fielder: f, t, p: {x, y, z}, runs: 0};
      break;
    }
  }
  if (!best) {const p = positionAt(hit, endTime(hit)); best = {kind: 'dead', fielder: nearest(field, p), t: endTime(hit)+1.2, p, runs: 0};}
  if (best.kind === 'stop' || best.kind === 'drop' || best.kind === 'dead') {
    const F = field[best.fielder] ?? field[0], gather = best.kind === 'drop' ? 1.1 : .45;
    const toKeeper = Math.hypot(best.p.x, best.p.z), toBowler = Math.hypot(best.p.x, best.p.z+PITCH), throwT = gather+Math.min(toKeeper, toBowler)/26;
    const ballIn = best.t-contactT+throwT, margin = .35-intent*.2;
    let runs = 0;
    while (runs < 3 && .45+3+2.8*runs+margin+(runs >= 2 ? .7 : 0) <= ballIn) runs++;
    if (F.role === 'keeper' && best.t-contactT < 1.2) runs = 0;
    best.runs = runs;
  }
  return best;
}
const nearest = (field: Fielder[], p: V3) => field.reduce((bi, f, i) => Math.hypot(f.x-p.x, f.z-p.z) < Math.hypot(field[bi].x-p.x, field[bi].z-p.z) ? i : bi, 0);

/* ---------- LBW ---------- */
export type LbwAnalysis = {
  pitching: 'in-line' | 'outside-off' | 'outside-leg' | 'full-toss';
  impact: 'in-line' | 'umpires-call' | 'outside-off' | 'outside-leg';
  wickets: 'hitting' | 'umpires-call' | 'missing';
  impactP: V3; impactT: number; projection: V3 | null; projected: Flight;
  /** Ball-tracking truth: out on review when every criterion is clear. */
  out: boolean; marginal: boolean; appeal: boolean; shotOffered: boolean; near: number;
};
export function analyseLbw(d: DeliveryView, pad: {t: number; p: V3}, hand: 'R' | 'L', shot: Shot): LbwAnalysis {
  const off = hand === 'R' ? 1 : -1, shotOffered = shot !== 'leave' && shot !== 'duck';
  const bounced = d.bounce !== null && d.flight.bounceT < pad.t;
  const pitchOff = bounced ? d.bounce!.x*off : 0;
  const pitching = !bounced ? 'full-toss' : pitchOff < -STUMP_HALF ? 'outside-leg' : pitchOff > STUMP_HALF ? 'outside-off' : 'in-line';
  const ix = pad.p.x*off;
  const impact = Math.abs(pad.p.x) <= STUMP_HALF ? 'in-line' : Math.abs(pad.p.x) <= STUMP_HALF+BALL_R ? 'umpires-call' : ix > 0 ? 'outside-off' : 'outside-leg';
  const v = velocityAt(d.flight, pad.t);
  const projected = fly(pad.p, v, {...d.params, deviation: bounced ? 0 : d.params.deviation}, .5, 1.5, pad.t, bounced);
  const at = crossing(projected, 0), test = stumpTest(at?.p ?? null);
  const wickets = test.clear ? 'hitting' : test.hit ? 'umpires-call' : 'missing';
  const impactOk = impact === 'in-line' || impact === 'umpires-call' || (impact === 'outside-off' && !shotOffered);
  const out = pitching !== 'outside-leg' && (impact === 'in-line' || (impact === 'outside-off' && !shotOffered)) && wickets === 'hitting';
  const marginal = pitching !== 'outside-leg' && impactOk && wickets !== 'missing' && !out;
  const near = at ? Math.max(Math.abs(at.p.x)-(STUMP_HALF+BALL_R), at.p.y-(BAIL_TOP+BALL_R)) : 1;
  const appeal = pitching !== 'outside-leg' && impact !== 'outside-leg' && (wickets !== 'missing' || near < .09);
  return {pitching, impact, wickets, impactP: pad.p, impactT: pad.t, projection: at?.p ?? null, projected, out, marginal, appeal, shotOffered, near};
}
/** Wides apply only when the batter did not touch the ball. */
export function wideCheck(f: Flight, hand: 'R' | 'L') {
  const off = hand === 'R' ? 1 : -1, at = crossing(f, POPPING);
  if (!at) return false;
  const x = at.p.x*off;
  return x > WIDE_LINE || x < -(STUMP_HALF+.32) || at.p.y > 1.95;
}
