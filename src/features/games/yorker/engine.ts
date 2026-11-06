import {
  BOWLERS, DELIVERIES, PITCHES, VENUES, batterById, quickMatch,
  type Batter, type Bowler, type BowlerKind, type Challenge, type Conditions, type DeliveryId, type DeliverySpec, type FieldPreset, type StarRule, type Venue,
} from './data';
import {BOWLING_POPPING, POPPING, crossing, fly, solveRelease, stumpTest, type Flight, type FlightParams, type V3} from './physics';
import {
  analyseLbw, fieldBall, fieldPositions, gauss, lengthName, playDelivery, random, wideCheck,
  type BatResult, type Dismissal, type FieldEvent, type Fielder, type LbwAnalysis, type Rng,
} from './batting';

export const STEP = 1/120;
export const BETWEEN = 1.9, APPEAL = 1.75, REVIEW_WINDOW = 8, TRACKING = 5.2;
/** Release meter: the needle reaches 1 just before release. Gold is centred on SWEET; at OVERSTEP the front foot is over. */
export const SWEET = .86, OVERSTEP = .985, EARLY_EDGE = .7;
export const TARGET_BOUNDS = {xMin: -1.25, xMax: 1.25, zMin: -12.6, zMax: -.7};

export type Phase = 'plan' | 'runup' | 'delivery' | 'appeal' | 'review' | 'tracking' | 'between' | 'finished';
export type ReleaseGrade = 'perfect' | 'good' | 'late' | 'early' | 'no-ball';
export type Plan = {delivery: DeliveryId; target: {x: number; z: number}; field: FieldPreset};
/** One completed ball as the player played it. `meter` -1 means no tap (the bowler oversteps). */
export type BowlInput = Plan & {meter: number; assist: boolean; review?: boolean};
export type BatterState = {id: string; runs: number; balls: number; out: Dismissal | null};
export type BallEventType = 'release' | 'bounce' | 'bat' | 'edge' | 'pad' | 'body' | 'stumps' | 'keeper' | 'catch' | 'drop' | 'field' | 'boundary' | 'land' | 'throw';
export type BallEvent = {t: number; type: BallEventType; p: V3; level?: number};
export type Tone = 'wicket' | 'boundary' | 'runs' | 'dot' | 'extra';
export type Outcome = {
  input: BowlInput; spec: DeliverySpec; grade: ReleaseGrade; quality: number; speedKmh: number;
  release: V3; aim: {x: number; z: number}; params: FlightParams; flight: Flight; bounce: V3 | null; length: string;
  batter: string | null; hand: 'R' | 'L'; field: Fielder[];
  bat: BatResult | null; hit: Flight | null; fielding: FieldEvent | null; stumps: {t: number; p: V3} | null; keeperT: number;
  runs: number; wide: boolean; noBall: boolean; noBallReason: 'overstep' | 'beamer' | 'bouncer' | null; bouncer: boolean; freeHit: boolean;
  dismissal: Dismissal | null; lbw: LbwAnalysis | null; umpireOut: boolean; battingReview: boolean;
  events: BallEvent[]; end: number; title: string; detail: string; tone: Tone;
  beaten: boolean; edged: boolean; inZone: boolean;
};
export type BallRecord = {runs: number; extras: number; wicket: Dismissal | null; label: string; tone: Tone; pitch: {x: number; z: number} | null; speed: number; grade: ReleaseGrade; legal: boolean; delivery: DeliveryId; batter: string | null; over: number};
export type Decision = {umpireOut: boolean; reviewed: 'bowling' | 'batting' | null; overturned: boolean; out: boolean; retained: boolean};
export type Match = {
  challenge: Challenge; bowler: Bowler; venue: Venue; conditions: Conditions; quickSeed: number | null;
  seed: number; initialSeed: number; phase: Phase; age: number; time: number;
  plan: Plan; meter: number | null; assist: boolean;
  runs: number; wickets: number; legal: number; overBalls: number; extras: number; freeHit: boolean; bouncers: number;
  batters: BatterState[]; striker: number; nonStriker: number; next: number;
  reviews: {bowling: number; batting: number};
  current: Outcome | null; decision: Decision | null;
  results: BallRecord[]; inputs: BowlInput[];
  /** The batters' read of recent balls, and consecutive dot balls (pressure). */
  recent: {len: number; move: number; speed: number}[]; dots: number;
  progress: {zone: number; releases: number; beaten: number};
  result: {won: boolean; stars: number; reason: string} | null;
  checkpoint: number;
};
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

export function newMatch(challenge: Challenge, bowlerKind: BowlerKind, seed: number, quickSeed: number | null = null): Match {
  const bowler = BOWLERS[challenge.bowler === 'any' ? bowlerKind : challenge.bowler], venue = VENUES[challenge.venue];
  const batters = challenge.lineup.map(id => ({id, runs: 0, balls: 0, out: null}));
  const start = bowler.kind === 'pace' ? {x: .12, z: -5.6} : {x: .05, z: -3.8};
  return {
    challenge, bowler, venue, conditions: PITCHES[challenge.pitch].conditions, quickSeed,
    seed: seed >>> 0, initialSeed: seed >>> 0, phase: 'plan', age: 0, time: 0,
    plan: {delivery: bowler.deliveries[0], target: start, field: challenge.objective.type === 'defend' ? 'balanced' : 'attack'}, meter: null, assist: false,
    runs: 0, wickets: 0, legal: 0, overBalls: 0, extras: 0, freeHit: false, bouncers: 0,
    batters, striker: batters.length ? 0 : -1, nonStriker: batters.length > 1 ? 1 : -1, next: Math.min(2, batters.length),
    reviews: {bowling: 1, batting: 1}, current: null, decision: null, results: [], inputs: [], recent: [], dots: 0,
    progress: {zone: 0, releases: 0, beaten: 0}, result: null, checkpoint: 0,
  };
}
export const strikerBatter = (m: Match): Batter | null => m.striker >= 0 ? batterById(m.batters[m.striker].id) : null;
export const nonStrikerBatter = (m: Match): Batter | null => m.nonStriker >= 0 ? batterById(m.batters[m.nonStriker].id) : null;
export const ballsLeft = (m: Match) => Math.max(0, m.challenge.balls-m.legal);
export const overText = (legal: number) => `${Math.floor(legal/6)}.${legal%6}`;

/* ---------- Planning ---------- */
export function setDelivery(m: Match, id: DeliveryId) {if (m.phase === 'plan' && m.bowler.deliveries.includes(id)) m.plan = {...m.plan, delivery: id};}
export function setField(m: Match, field: FieldPreset) {if (m.phase === 'plan') m.plan = {...m.plan, field};}
export function setTarget(m: Match, x: number, z: number) {
  if (m.phase !== 'plan') return;
  m.plan = {...m.plan, target: {x: clamp(x, TARGET_BOUNDS.xMin, TARGET_BOUNDS.xMax), z: clamp(z, TARGET_BOUNDS.zMin, TARGET_BOUNDS.zMax)}};
}
export function startRunUp(m: Match) {if (m.phase !== 'plan' || m.result) return false; m.phase = 'runup'; m.age = 0; m.meter = null; return true;}
/** Needle position 0..1 during the run-up; it speeds up as the bowler gathers. */
export const meterAt = (m: Match, age = m.age) => Math.max(0, age/(m.bowler.runUp-.1))**1.25;
export function tapRelease(m: Match) {if (m.phase !== 'runup' || m.meter !== null) return false; m.meter = meterAt(m); return true;}
export function perfectWindow(m: Match) {return m.bowler.perfect*(m.assist ? 1.6 : 1);}
export function gradeRelease(meter: number, perfect: number, assist = false): {grade: ReleaseGrade; quality: number} {
  if (meter < 0 || meter >= (assist ? 1.02 : OVERSTEP)) return {grade: 'no-ball', quality: .3};
  const d = meter-SWEET;
  if (Math.abs(d) <= perfect) return {grade: 'perfect', quality: 1};
  if (d > 0) return {grade: 'late', quality: clamp(1-(d-perfect)/.11, .45, .88)};
  if (meter >= EARLY_EDGE-(assist ? .06 : 0)) return {grade: 'good', quality: clamp(1-(-d-perfect)/.24, .62, .92)};
  return {grade: 'early', quality: clamp(meter/EARLY_EDGE*.6, .12, .6)};
}

/* ---------- Bowling one ball ---------- */
function intentFor(m: Match, b: Batter) {
  let intent = b.aggression;
  const obj = m.challenge.objective, left = ballsLeft(m);
  if (obj.type === 'defend') intent += clamp(((obj.target-m.runs)/Math.max(1, left)-1.1)*.22, -.25, .55);
  else if (obj.type === 'economy') intent += .1;
  else if (obj.type === 'wickets') intent -= .04;
  const st = m.batters[m.striker];
  if (st && st.balls >= 6) intent += .05;
  // Dot-ball pressure: a run of tight balls makes him take a risk.
  intent += Math.min(.3, m.dots*.07);
  return clamp(intent, 0, 1);
}
/** [max batter-relative angle from straight toward off, close name, deep name]. */
const POSITION_NAMES: [number, string, string][] = [
  [-158, 'fine leg', 'fine leg'], [-70, 'square leg', 'deep square leg'], [-30, 'midwicket', 'deep midwicket'], [-6, 'mid-on', 'long-on'],
  [6, 'the bowler', 'long-off'], [30, 'mid-off', 'long-off'], [75, 'cover', 'deep cover'], [115, 'point', 'deep point'], [150, 'gully', 'third man'], [181, 'slip', 'third man'],
];
export function positionName(p: {x: number; z: number}, hand: 'R' | 'L', role?: Fielder['role']) {
  if (role === 'keeper') return 'the keeper';
  if (role === 'bowler') return 'the bowler';
  if (role === 'slip') return 'slip';
  const off = hand === 'R' ? 1 : -1, a = Math.atan2(p.x*off, -p.z)*180/Math.PI, deep = Math.hypot(p.x, p.z) > 40;
  const row = POSITION_NAMES.find(r => a <= r[0]) ?? POSITION_NAMES[POSITION_NAMES.length-1];
  return deep ? row[2] : row[1];
}

/** Resolve the whole ball at the moment of release. The phases afterwards only play it out. */
function launch(m: Match) {
  const rng: Rng = m, input: BowlInput = {...m.plan, target: {...m.plan.target}, meter: m.meter ?? -1, assist: m.assist};
  const spec = DELIVERIES[input.delivery], bowler = m.bowler, venue = m.venue, c = m.conditions;
  const {grade, quality} = gradeRelease(input.meter, bowler.perfect*(input.assist ? 1.6 : 1), input.assist);
  const batter = strikerBatter(m), hand = batter?.hand ?? 'R', off = hand === 'R' ? 1 : -1;
  const speedKmh = spec.speed*(.9+.1*quality)*(grade === 'perfect' ? 1.015 : 1)*(bowler.kind === 'pace' ? c.pace : 1)+gauss(rng)*1.1;
  const sigma = bowler.scatter*(1+2.6*(1-quality)**1.4);
  const aim = {x: input.target.x+gauss(rng)*sigma*.55, z: Math.min(-.35, input.target.z+gauss(rng)*sigma)};
  const move = .6+.5*quality;
  const params: FlightParams = {
    swing: spec.swing*off*c.swing*venue.swing*move, drift: spec.drift*move,
    deviation: (random(rng)*2-1)*spec.seam*c.seam*move+spec.turn*c.turn*move,
    restitution: (bowler.kind === 'pace' ? .58 : .6)*spec.bounce*c.bounce,
    retention: clamp((bowler.kind === 'pace' ? .87 : .83)*spec.skid*c.pace, .6, .97),
  };
  const overstep = grade === 'no-ball';
  const releaseP = {x: bowler.releaseX, y: bowler.releaseHeight, z: BOWLING_POPPING+(overstep ? .52 : .32)};
  const rel = solveRelease(releaseP, speedKmh/3.6, aim, params);
  const field = fieldPositions(bowler.kind, input.field, hand), keeper = field[0];
  const flight = fly(rel.p, rel.v, params, keeper.z+.6, 3.2);
  const bounce = flight.bounce, length = lengthName(bounce?.z ?? null);
  const view = {spec, params, flight, releaseT: 0, bounce, speed: rel.speed, disguised: spec.disguise*(.6+.4*quality)};
  const freeHit = m.freeHit;
  const crease = crossing(flight, POPPING), bounced = !!bounce && bounce.z < POPPING;
  const beamer = !bounced && !!crease && crease.p.y > 1.02;
  const bouncer = bounced && !!crease && crease.p.y > 1.45 && crease.p.y <= 1.95;
  let noBall = overstep, noBallReason: Outcome['noBallReason'] = overstep ? 'overstep' : null;
  if (!noBall && beamer && batter) {noBall = true; noBallReason = 'beamer';}
  if (!noBall && bouncer && batter && m.bouncers >= 1) {noBall = true; noBallReason = 'bouncer';}
  const protectedBall = noBall || freeHit;
  const events: BallEvent[] = [{t: 0, type: 'release', p: rel.p, level: rel.speed/40}];
  if (bounce) events.push({t: flight.bounceT, type: 'bounce', p: bounce, level: rel.speed/40});
  const o: Outcome = {
    input, spec, grade, quality, speedKmh, release: rel.p, aim, params, flight, bounce, length, batter: batter?.id ?? null, hand, field,
    bat: null, hit: null, fielding: null, stumps: null, keeperT: -1, runs: 0, wide: false, noBall, noBallReason, bouncer, freeHit,
    dismissal: null, lbw: null, umpireOut: false, battingReview: false, events, end: 1, title: '', detail: '', tone: 'dot',
    beaten: false, edged: false, inZone: false,
  };
  const zone = m.challenge.objective.type === 'target' ? m.challenge.objective.zone : null;
  o.inZone = !!zone && !!bounce && bounce.x >= zone.xMin && bounce.x <= zone.xMax && bounce.z >= zone.zMin && bounce.z <= zone.zMax;
  let end = 0;
  const keeperTake = () => {const at = crossing(flight, keeper.z-.4); o.keeperT = at ? at.t : flight.data[(flight.count-1)*4]; events.push({t: o.keeperT, type: 'keeper', p: at?.p ?? {x: keeper.x, y: .8, z: keeper.z}}); end = o.keeperT+.9;};
  const stumpsCheck = (f: Flight) => {const at = crossing(f, 0); return at && stumpTest(at.p).hit ? {t: at.t, p: at.p} : null;};

  if (!batter) {
    o.stumps = stumpsCheck(flight);
    if (o.stumps) {events.push({t: o.stumps.t, type: 'stumps', p: o.stumps.p}); end = o.stumps.t+2.1;} else keeperTake();
  } else {
    const intent = intentFor(m, batter);
    const n = m.recent.length, expect = {len: n ? m.recent.reduce((a, r) => a+r.len, 0)/n : 5, move: n ? m.recent.reduce((a, r) => a+r.move, 0)/n : 0, speed: n ? m.recent.reduce((a, r) => a+r.speed, 0)/n : spec.speed, count: n};
    const bat = playDelivery(rng, view, {batter, intent, set: (m.batters[m.striker]?.balls ?? 0) >= 6, freeHit, conditions: c, bowler: bowler.kind, stock: bowler.deliveries[0], expect});
    o.bat = bat; o.beaten = bat.beaten; o.edged = bat.contact === 'outside-edge' || bat.contact === 'inside-edge' || bat.contact === 'top-edge' || bat.contact === 'bottom-edge';
    if (bat.hit) {
      o.hit = bat.hit;
      events.push({t: bat.contactT, type: o.edged ? 'edge' : 'bat', p: bat.contactP!, level: bat.quality});
      const playedOn = bat.contact === 'inside-edge' || bat.contact === 'bottom-edge' ? stumpsCheck(bat.hit) : null;
      if (playedOn) {
        o.stumps = playedOn; events.push({t: playedOn.t, type: 'stumps', p: playedOn.p});
        if (!protectedBall) o.dismissal = 'played-on';
        end = playedOn.t+2.2;
      } else {
        const fe = fieldBall(rng, bat.hit, field, venue.boundary, bat.contactT, freeHit ? 1 : intent);
        o.fielding = fe;
        if (bat.hit.bounce && bat.hit.bounceT < fe.t) events.push({t: bat.hit.bounceT, type: 'land', p: bat.hit.bounce});
        if (fe.kind === 'catch') {
          events.push({t: fe.t, type: 'catch', p: fe.p});
          if (!protectedBall) o.dismissal = field[fe.fielder].role === 'keeper' || (field[fe.fielder].role === 'slip' && o.edged) ? 'caught-behind' : 'caught';
          end = fe.t+2.2;
        } else if (fe.kind === 'four' || fe.kind === 'six') {o.runs = fe.runs; events.push({t: fe.t, type: 'boundary', p: fe.p, level: fe.runs}); end = fe.t+1.5;}
        else {
          o.runs = fe.runs;
          events.push({t: fe.t, type: fe.kind === 'drop' ? 'drop' : 'field', p: fe.p});
          if (fe.kind !== 'dead') events.push({t: fe.t+.5, type: 'throw', p: fe.p});
          end = Math.max(fe.t+1.5, bat.contactT+.55+fe.runs*2.95+.4);
        }
      }
    } else if (bat.pad) {
      events.push({t: bat.pad.t, type: 'pad', p: bat.pad.p});
      const lbw = analyseLbw(view, bat.pad, hand, bat.shot);
      o.lbw = lbw; end = bat.pad.t+1.1;
      if (lbw.appeal && !protectedBall) {
        const far = lbw.impactP.z < -2.6, r = random(rng), r2 = random(rng);
        o.umpireOut = lbw.out ? r < (far ? .7 : .9) : lbw.marginal ? r < (far ? .36 : .5) : lbw.near < .03 && r < .06;
        o.battingReview = o.umpireOut && m.reviews.batting > 0 && (!lbw.out && !lbw.marginal ? r2 < .85 : lbw.marginal ? r2 < .35 : r2 < .06);
      } else o.lbw = {...lbw, appeal: false};
    } else if (bat.body) {events.push({t: bat.body.t, type: 'body', p: bat.body.p}); end = bat.body.t+1.2;}
    else {
      o.stumps = stumpsCheck(flight);
      if (o.stumps) {events.push({t: o.stumps.t, type: 'stumps', p: o.stumps.p}); if (!protectedBall) o.dismissal = 'bowled'; end = o.stumps.t+2.3;}
      else {o.wide = !noBall && wideCheck(flight, hand); keeperTake();}
    }
  }
  o.end = Math.min(9, Math.max(end, .9));
  label(o);
  m.current = o; m.decision = null; m.phase = 'delivery'; m.age = 0;
}

export const shotName = (s?: string | null) => ({leave: 'Left', duck: 'Ducked', defend: 'Defended', block: 'Blocked', drive: 'Driven', loft: 'Lofted', punch: 'Punched', cut: 'Cut', pull: 'Pulled', flick: 'Flicked', sweep: 'Swept'} as Record<string, string>)[s ?? ''] ?? 'Struck';
function label(o: Outcome) {
  const bat = o.bat, fe = o.fielding, where = fe && fe.fielder >= 0 ? positionName(o.field[fe.fielder], o.hand, o.field[fe.fielder].role) : '';
  if (o.dismissal) {
    o.tone = 'wicket';
    o.title = o.dismissal === 'bowled' ? 'BOWLED!' : o.dismissal === 'played-on' ? 'PLAYED ON!' : o.dismissal === 'lbw' ? 'LBW!' : o.dismissal === 'caught-behind' ? 'CAUGHT BEHIND!' : 'CAUGHT!';
    o.detail = o.dismissal === 'bowled' ? (bat?.shot === 'leave' ? 'Shouldered arms, and the stumps go' : o.length === 'Yorker' ? 'Yorked him!' : 'Through the gate')
      : o.dismissal === 'played-on' ? 'Dragged onto his own stumps' : o.dismissal === 'caught' ? `Caught at ${where}`
      : o.dismissal === 'caught-behind' ? (where === 'slip' ? 'Edged and taken at slip' : 'Edged through to the keeper') : 'Trapped in front';
    return;
  }
  if (o.runs >= 4) {o.tone = 'boundary'; o.title = o.runs === 6 ? 'SIX!' : 'FOUR!'; o.detail = `${shotName(bat?.shot)}${o.noBall ? ' off a no-ball' : ''}`; return;}
  if (o.wide) {o.tone = 'extra'; o.title = 'WIDE'; o.detail = 'Too wide of the batter. One run, bowl it again'; return;}
  if (o.noBall) {
    const why = o.noBallReason === 'overstep' ? 'Front foot over the line' : o.noBallReason === 'beamer' ? 'Full toss above the waist' : 'Second bouncer of the over';
    o.tone = 'extra'; o.title = 'NO BALL'; o.detail = `${why}. Free hit next${o.runs ? ` · ${o.runs} off the bat` : ''}`; return;
  }
  if (o.runs > 0) {o.tone = 'runs'; o.title = o.runs === 1 ? '1 RUN' : `${o.runs} RUNS`; o.detail = `${shotName(bat?.shot)}${where ? ` to ${where}` : ''}`; return;}
  o.tone = 'dot';
  if (!o.batter) {o.title = o.stumps ? 'STUMPS!' : o.inZone ? 'ON THE SPOT' : 'BALL DONE'; o.detail = `${o.length} · ${({perfect: 'Perfect release', good: 'Good release', late: 'Late release', early: 'Early release', 'no-ball': 'No ball'} as const)[o.grade]}`; return;}
  o.title = 'DOT BALL';
  if (o.lbw?.appeal && !o.freeHit) {o.title = 'HOWZAT?'; o.detail = 'Big appeal for LBW'; return;}
  if (fe?.kind === 'drop') {o.detail = `Dropped at ${where}!`; return;}
  if (o.freeHit && (o.stumps || fe?.kind === 'catch')) {o.detail = 'Free hit: no wicket'; return;}
  if (bat?.pad) {o.detail = 'Hit on the pad'; return;}
  if (bat?.body) {o.detail = 'Hit on the body'; return;}
  if (o.edged) {o.detail = 'Edged! Falls short of the fielder'; return;}
  if (o.beaten) {o.detail = 'Beaten! Past the outside edge'; return;}
  o.detail = bat?.shot === 'leave' ? 'Left alone' : bat?.shot === 'duck' ? 'Ducks under it' : bat?.shot === 'defend' || bat?.shot === 'block' ? 'Solid defence' : bat?.contact === 'none' ? 'Swing and a miss' : `Fielded at ${where}`;
}

/* ---------- After the ball ---------- */
function afterPlay(m: Match) {
  const o = m.current!;
  m.phase = o.lbw?.appeal && !o.noBall && !o.freeHit ? 'appeal' : 'between'; m.age = 0;
}
function afterAppeal(m: Match) {
  const o = m.current!;
  m.decision = {umpireOut: o.umpireOut, reviewed: null, overturned: false, out: o.umpireOut, retained: false};
  if (o.umpireOut) {if (o.battingReview) beginTracking(m, 'batting'); else finalise(m);}
  else if (m.reviews.bowling > 0) {m.phase = 'review'; m.age = 0;}
  else finalise(m);
}
/** The player's DRS choice after a not-out decision. */
export function review(m: Match, take: boolean) {
  if (m.phase !== 'review') return false;
  m.current!.input.review = take;
  if (take) beginTracking(m, 'bowling'); else finalise(m);
  return true;
}
function beginTracking(m: Match, by: 'bowling' | 'batting') {
  const o = m.current!, lbw = o.lbw!;
  let out = o.umpireOut, overturned = false, retained = false;
  if (by === 'bowling') {if (lbw.out) {out = true; overturned = true;} else if (lbw.marginal) retained = true; else m.reviews.bowling--;}
  else {if (!lbw.out && !lbw.marginal) {out = false; overturned = true;} else if (lbw.marginal) retained = true; else m.reviews.batting--;}
  m.decision = {umpireOut: o.umpireOut, reviewed: by, overturned, out, retained};
  m.phase = 'tracking'; m.age = 0;
  if (out) applyLbw(m);
  else {o.tone = 'dot'; o.title = 'NOT OUT'; o.detail = lbw.pitching === 'outside-leg' ? 'Pitched outside leg' : lbw.impact.startsWith('outside') ? 'Impact outside the line' : lbw.wickets === 'missing' ? 'Missing the stumps' : "Umpire's call stands";}
}
function applyLbw(m: Match) {const o = m.current!; o.dismissal = 'lbw'; label(o); if (m.decision?.overturned) o.detail = 'Overturned on review!'; else if (m.decision?.reviewed) o.detail = "Review lost: umpire's call stands";}
function finalise(m: Match) {
  const o = m.current!;
  if (m.decision?.out) applyLbw(m);
  else if (o.lbw?.appeal) {o.tone = 'dot'; o.title = 'NOT OUT'; o.detail = 'The umpire shakes his head';}
  m.phase = 'between'; m.age = 0;
}

function settle(m: Match) {
  const o = m.current!, legal = !o.wide && !o.noBall, extras = (o.wide ? 1 : 0)+(o.noBall ? 1 : 0), over = Math.floor(m.legal/6);
  m.runs += o.runs+extras; m.extras += extras;
  const st = m.striker >= 0 ? m.batters[m.striker] : null;
  if (st) {if (!o.wide) st.balls++; st.runs += o.runs;}
  if (legal) {m.legal++; m.overBalls++;}
  if (o.bouncer && !o.noBall) m.bouncers++;
  m.freeHit = o.noBall ? true : o.wide ? m.freeHit : false;
  if (o.grade === 'perfect' || o.grade === 'good') m.progress.releases++;
  if (o.inZone) m.progress.zone++;
  if (o.beaten || o.edged) m.progress.beaten++;
  if (o.batter) {
    const off = o.hand === 'R' ? 1 : -1;
    m.recent = [...m.recent, {len: o.bounce && o.bounce.z < POPPING+.25 ? -o.bounce.z : 0, move: Math.sign(o.spec.swing)+(o.spec.kind === 'spin' ? Math.sign(o.spec.turn)*off*.8 : 0), speed: o.speedKmh}].slice(-3);
    m.dots = o.runs === 0 && extras === 0 && !o.dismissal ? m.dots+1 : 0;
  }
  if (o.dismissal && st) {
    st.out = o.dismissal; m.wickets++; m.recent = []; m.dots = 0;
    m.striker = m.next < m.batters.length && m.wickets < m.challenge.wicketsInHand ? m.next++ : -1;
  } else if (o.runs%2 === 1 && m.nonStriker >= 0) [m.striker, m.nonStriker] = [m.nonStriker, m.striker];
  if (legal && m.overBalls === 6) {
    m.overBalls = 0; m.bouncers = 0;
    if (m.nonStriker >= 0 && m.striker >= 0) [m.striker, m.nonStriker] = [m.nonStriker, m.striker];
  }
  m.results.push({runs: o.runs, extras, wicket: o.dismissal, label: o.title, tone: o.tone, pitch: o.bounce ? {x: o.bounce.x, z: o.bounce.z} : null, speed: o.speedKmh, grade: o.grade, legal, delivery: o.input.delivery, batter: o.batter, over});
  m.inputs.push({...o.input, target: {...o.input.target}});
  m.checkpoint++;
  m.current = null; m.decision = null; m.meter = null;
  const result = endState(m);
  if (result) {m.result = result; m.phase = 'finished';} else m.phase = 'plan';
  m.age = 0;
}

function stars(m: Match) {
  if (m.challenge.lesson) return 3;
  const ok = (r: StarRule) => (r.maxRuns === undefined || m.runs <= r.maxRuns) && (r.minWickets === undefined || m.wickets >= r.minWickets);
  return ok(m.challenge.two) ? ok(m.challenge.three) ? 3 : 2 : 1;
}
export function endState(m: Match): Match['result'] {
  const obj = m.challenge.objective, done = m.legal >= m.challenge.balls;
  const allOut = m.challenge.lineup.length > 0 && (m.wickets >= m.challenge.wicketsInHand || m.striker < 0);
  const win = (reason: string) => ({won: true, stars: stars(m), reason}), lose = (reason: string) => ({won: false, stars: 0, reason});
  switch (obj.type) {
    case 'defend': return m.runs >= obj.target ? lose('They reached the target') : allOut ? win('Bowled them out') : done ? win(`Defended ${obj.target}`) : null;
    case 'wickets': return m.wickets >= obj.wickets ? win(obj.wickets === 1 ? 'Wicket taken' : `${obj.wickets} wickets taken`) : done || allOut ? lose('Out of balls') : null;
    case 'economy': return m.runs > obj.runs ? lose(`Conceded more than ${obj.runs}`) : done || allOut ? win(`${m.runs} conceded`) : null;
    case 'target': return m.progress.zone >= obj.count ? win('Line and length found') : done ? lose('Keep hitting the box') : null;
    case 'release': return m.progress.releases >= obj.count ? win('Release mastered') : done ? lose('Time the gold zone') : null;
    case 'beat': return m.progress.beaten >= obj.count || m.wickets > 0 ? win('Beaten him') : done ? lose('Movement beats the bat') : null;
  }
}

/* ---------- Clock ---------- */
export function step(m: Match, dt = STEP) {
  m.time += dt;
  if (m.phase === 'plan' || m.phase === 'finished') return;
  m.age += dt;
  if (m.phase === 'runup' && m.age >= m.bowler.runUp) launch(m);
  else if (m.phase === 'delivery' && m.age >= m.current!.end) afterPlay(m);
  else if (m.phase === 'appeal' && m.age >= APPEAL) afterAppeal(m);
  else if (m.phase === 'review' && m.age >= REVIEW_WINDOW) review(m, false);
  else if (m.phase === 'tracking' && m.age >= TRACKING) {m.phase = 'between'; m.age = 0;}
  else if (m.phase === 'between' && m.age >= BETWEEN) settle(m);
}
/** Skip the rest of a chase, replay or summary. The result never changes. */
export function skip(m: Match) {
  const o = m.current;
  if (m.phase === 'delivery' && o) {
    const firstStop = Math.min(o.end, ...o.events.filter(e => e.type !== 'release' && e.type !== 'bounce').map(e => e.t));
    if (m.age > firstStop+.25 && m.age < o.end) {m.age = o.end; return true;}
  }
  if (m.phase === 'tracking') {m.age = TRACKING; return true;}
  if (m.phase === 'between') {m.age = BETWEEN; return true;}
  return false;
}

/* ---------- Saves: completed balls replay through the same engine ---------- */
export type Checkpoint = {challengeId: string; bowler: BowlerKind; initialSeed: number; quickSeed: number | null; inputs: BowlInput[]};
export function checkpoint(m: Match): Checkpoint {return {challengeId: m.challenge.id, bowler: m.bowler.kind, initialSeed: m.initialSeed, quickSeed: m.quickSeed, inputs: m.inputs.map(i => ({...i, target: {...i.target}}))};}
/** Play one recorded ball instantly. */
export function playBall(m: Match, input: BowlInput) {
  if (m.phase !== 'plan') return;
  m.plan = {delivery: input.delivery, target: {...input.target}, field: input.field}; m.assist = input.assist;
  m.phase = 'runup'; m.age = m.bowler.runUp; m.meter = input.meter;
  launch(m); afterPlay(m);
  // The phase changes inside these calls; read it fresh each time.
  const phase = () => m.phase as Phase;
  if (phase() === 'appeal') {afterAppeal(m); if (phase() === 'review') review(m, !!input.review);}
  if (phase() === 'tracking' || phase() === 'between') settle(m);
}
export function restore(challenge: Challenge, saved: Checkpoint): Match {
  const m = newMatch(challenge, saved.bowler, saved.initialSeed, saved.quickSeed);
  for (const input of saved.inputs) {playBall(m, input); if (m.phase === 'finished') break;}
  m.time = 0;
  return m;
}
export function challengeFor(id: string, bowler: BowlerKind, quickSeed: number | null, find: (id: string) => Challenge | null): Challenge | null {
  void bowler;
  return id === 'quick' ? (quickSeed === null ? null : quickMatch(quickSeed)) : find(id);
}
