import { crews } from './crews';
import { GATES, SPLIT_GATES, STEP, SURFACES, medalFor, neutralInput, recordKey, type Car, type EventType, type Ghost, type Input, type Medal, type Result, type ResultRow, type Session, type Setup, type Stage } from './contracts';
import { clamp, forwardDistance, nearest, pointAt, random, signedDistance, wrap } from './geometry';
import { BRAKE_DECEL, GRIP, featureAt, getStage, speedAt, surfaceAt } from './stages';

export const FIELD = 6;
export const PLAYER_SLOT = 3;
const PACE = { rookie: .8, pro: .86, legend: .94 } as const;
const CONTACT = 5.4;

function makeCar(stage: Stage, id: number, crew: number, at: number, offset: number, pace: number): Car {
    const p = pointAt(stage, at, offset);
    return {
        id, crew, name: id === 0 ? 'You' : crews[crew].driver, x: p.x, y: p.y, heading: p.heading, px: p.x, py: p.y, ph: p.heading, vx: 0, vy: 0, speed: 0, steering: 0, yawRate: 0, slip: 0,
        surface: surfaceAt(stage, p.s), offroad: false, throttle: false, braking: false, handbrake: false, air: 0, airTime: 0, inWater: false, dirt: 0,
        s: p.s, safeS: p.s, progress: at, laps: 0, nextGate: 0, started: false, lapStart: 0, best: null, splits: [], lapTimes: [], finish: null,
        stuck: 0, wrongWay: 0, recoverCooldown: 0, contactCooldown: 0, pace,
    };
}

function firstNote(stage: Stage, s: number) {
    let index = 0, best = Infinity;
    stage.notes.forEach((note, i) => { const d = forwardDistance(s, note.s, stage.length); if (d < best) { best = d; index = i; } });
    return index;
}

export function createSession(setup: Setup, seed: number, id: string, ghost: Ghost | null = null, tutorial = false): Session {
    const solo = setup.mode === 'stage' || tutorial, stage = getStage(setup.stage), rng = random(seed);
    const session: Session = {
        version: 1, id, setup: { ...setup, mode: solo ? 'stage' : 'rallycross' }, stage, seed, phase: 'intro', resumePhase: 'running', clock: 0, raceClock: 0, countdown: 3, cars: [], tick: 0, events: [],
        notice: '', noticeUntil: 0, result: null, ghost: solo && !tutorial ? ghost : null, samples: [], newGhost: null, completedGhosts: [], tutorial, tutorialStep: 0, split: null,
        bestSplits: solo && !tutorial && ghost ? ghost.splits : null, nextNote: 0,
    };
    if (solo) {
        const car = makeCar(stage, 0, setup.crew, 2, 0, .97);
        Object.assign(car, { started: true, nextGate: 1, progress: 0 });
        session.cars = [car];
    }
    else {
        const rivals = crews.map((_, i) => i).filter(i => i !== setup.crew);
        session.cars = Array.from({ length: FIELD }, (_, n) => {
            const slot = n === 0 ? PLAYER_SLOT : n - 1 < PLAYER_SLOT ? n - 1 : n, row = Math.floor(slot / 2), side = slot % 2 ? -1 : 1;
            const car = makeCar(stage, n, n === 0 ? setup.crew : rivals[n - 1], -11 - row * 11, side * 4.8, n === 0 ? .97 : PACE[setup.rivals] * (.985 + rng() * .03));
            car.progress -= slot * .01;
            return car;
        });
    }
    session.nextNote = firstNote(stage, session.cars[0].s);
    return session;
}

export function startSession(s: Session) {
    if (s.phase !== 'intro') return;
    s.phase = 'countdown';
    s.countdown = 3;
}
/** Session settings that may change mid-run (from the HUD). */
export function setMuted(s: Session, muted: boolean) { s.setup.muted = muted; }
export function notice(s: Session, message: string, seconds = 2.6) { s.notice = message; s.noticeUntil = s.clock + seconds; }
function event(s: Session, type: EventType, car = 0, power = 1) { s.events.push({ type, car, power }); }
export function pauseSession(s: Session) {
    if (s.phase === 'finished' || s.phase === 'paused' || s.phase === 'intro') return;
    s.resumePhase = s.phase;
    s.phase = 'paused';
}
export function resumeSession(s: Session) { if (s.phase === 'paused') s.phase = s.resumePhase; }

/** Puts a car back on the road at its last safe point. The lost time is the only penalty. */
export function recover(s: Session, id = 0) {
    const c = s.cars[id];
    if (!c || c.recoverCooldown > 0 || c.finish !== null || c.air > 0 || s.phase !== 'running') return;
    const p = pointAt(s.stage, c.safeS - 3, id === 0 ? 0 : 2.5);
    c.progress += signedDistance(c.s, p.s, s.stage.length);
    Object.assign(c, { x: p.x, y: p.y, heading: p.heading, px: p.x, py: p.y, ph: p.heading, vx: 0, vy: 0, speed: 0, yawRate: 0, steering: 0, s: p.s, stuck: 0, wrongWay: 0, recoverCooldown: 2.5, inWater: false });
    if (!id) notice(s, 'BACK ON THE STAGE');
    event(s, 'recover', id);
}

export function aiInput(s: Session, c: Car): Input {
    const st = s.stage, L = st.length, look = clamp(8 + c.speed * .62, 10, 38);
    let offset = c.id ? ((c.id % 3) - 1) * 1.8 : 0, desired = speedAt(st, c.s + 3) * c.pace * (c.finish !== null ? .55 : 1);
    // Overtaking: pick the nearest car ahead, move to the other side of the road and commit.
    // Only lift when still directly behind it, so a pass that has started is completed.
    let ahead: Car | null = null, closest = 20;
    for (const o of s.cars) {
        if (o === c || o.finish !== null || o.air > 0) continue;
        const gap = forwardDistance(c.s, o.s, L);
        if (gap > 0 && gap < closest) { closest = gap; ahead = o; }
    }
    if (ahead) {
        const mine = nearest(st, c, c.s).offset, theirs = nearest(st, ahead, ahead.s).offset, apart = Math.abs(mine - theirs);
        if (apart < 4.8 && ahead.speed < c.speed + 2) {
            offset = theirs + (theirs > 0 ? -5.5 : 5.5);
            if (closest < 6 && apart < 2.6) desired = Math.min(desired, Math.max(8, ahead.speed - .5));
        }
    }
    // Stay near the middle into tight bends; use the full width only where the road is open.
    const bend = Math.max(pointAt(st, c.s + look * .6).curvature, pointAt(st, c.s + look * 1.4).curvature), room = st.width * (bend > .03 ? .12 : bend > .015 ? .22 : .34);
    const target = pointAt(st, c.s + look, clamp(offset, -room, room));
    const travel = c.speed > 6 ? Math.atan2(c.vy, c.vx) : c.heading, aim = c.heading + wrap(travel - c.heading) * .4;
    const error = wrap(Math.atan2(target.y - c.y, target.x - c.x) - aim);
    const hairpin = pointAt(st, c.s + look * .7).curvature > .04 && c.speed > 12 && Math.abs(error) > .3;
    return { steer: clamp(error * 2.6, -1, 1), throttle: c.speed < desired && !hairpin, brake: c.speed > desired + 1.8, handbrake: hairpin };
}

function playerInput(s: Session, c: Car, input: Input): Input {
    const out = { ...input };
    if (s.setup.autoThrottle) out.throttle = !input.brake && !input.handbrake;
    if (s.setup.brakeAssist && c.speed > speedAt(s.stage, c.s + 3) + 1.5) { out.brake = true; out.throttle = false; }
    return out;
}

/**
 * Arcade rally handling. The heading turns first; the velocity is then re-read in the new heading frame,
 * so turning creates sideways slip that the surface bleeds away (loose surfaces slowly, tarmac quickly).
 */
function drive(s: Session, c: Car, input: Input) {
    const st = s.stage, near = nearest(st, c, c.s), road = st.width / 2;
    c.offroad = near.distance > road + .6;
    c.surface = c.offroad ? st.verge : SURFACES[st.surfaceAt[near.index]];
    c.throttle = input.throttle;
    c.braking = input.brake;
    c.handbrake = input.handbrake;
    if (c.air > 0) {
        c.air = Math.max(0, c.air - STEP);
        c.heading = wrap(c.heading + c.yawRate * STEP);
        c.yawRate *= .97;
        c.x += c.vx * STEP;
        c.y += c.vy * STEP;
        c.speed = Math.hypot(c.vx, c.vy);
        if (c.air === 0) {
            c.vx *= .96;
            c.vy *= .96;
            c.dirt = Math.min(1, c.dirt + .03);
            event(s, 'land', c.id, c.airTime);
        }
        return;
    }
    const g = GRIP[c.surface], off = c.offroad;
    c.steering += (input.steer - c.steering) * Math.min(1, STEP * 10);
    const forward0 = c.vx * Math.cos(c.heading) + c.vy * Math.sin(c.heading), hb = input.handbrake && forward0 > 4;
    const turn = c.steering * (.55 / (1 + Math.abs(forward0) / 40));
    let yaw = forward0 / 2.8 * Math.tan(turn), maxYaw = 13.5 * g.yaw * (off ? .8 : 1) / Math.max(7, Math.abs(forward0));
    if (hb) { yaw = yaw * 1.5 + c.steering * 1.3 * clamp(forward0 / 12, 0, 1); maxYaw *= 1.9; }
    else if (input.throttle && Math.abs(c.steering) > .3 && c.surface !== 'tarmac') yaw *= 1.12;
    c.yawRate += (clamp(yaw, -maxYaw, maxYaw) - c.yawRate) * Math.min(1, STEP * (hb ? 7 : 14));
    c.heading = wrap(c.heading + c.yawRate * STEP);
    const cos = Math.cos(c.heading), sin = Math.sin(c.heading);
    const f = c.vx * cos + c.vy * sin, l = -c.vx * sin + c.vy * cos, top = g.top * (off ? .62 : 1);
    const ratio = Math.max(0, f) / top, accel = input.throttle ? g.accel * (off ? .65 : 1) * Math.max(0, 1 - ratio * ratio) : 0;
    const decel = (input.brake ? BRAKE_DECEL * g.brake : 0) + (hb ? 6 : 0) + .35 + Math.abs(f) * (.008 + g.drag * .02) + (off ? Math.abs(f) * .32 : 0) + (c.inWater ? Math.abs(f) * .45 : 0);
    let nf = f > 0 ? Math.max(0, f + (accel - decel) * STEP) : Math.min(top, f + (accel + decel) * STEP);
    nf = clamp(nf, 0, top + 4);
    const nl = l * Math.exp(-STEP * g.lateral * (off ? .7 : 1) * (hb ? .32 : 1));
    const kept = Math.sqrt(Math.max(0, nf * nf + l * l - nl * nl));
    nf += (kept - nf) * g.redirect * (hb ? .45 : 1);
    const maxSlip = Math.max(2, nf * .85), fl = clamp(nl, -maxSlip, maxSlip);
    c.vx = cos * nf - sin * fl;
    c.vy = sin * nf + cos * fl;
    c.x += c.vx * STEP;
    c.y += c.vy * STEP;
    c.speed = Math.hypot(c.vx, c.vy);
    c.slip = Math.abs(fl);
    if (c.surface !== 'tarmac') c.dirt = Math.min(1, c.dirt + c.speed * STEP * (c.surface === 'mud' ? .0008 : .0003));
    // Stage edge: trees, rocks, walls or snowbanks. Soft edges sink and slow; hard edges stop.
    const edge = road + st.barrier.distance;
    if (near.distance > edge) {
        const sign = Math.sign(near.offset) || 1, nx = -Math.sin(near.heading) * sign, ny = Math.cos(near.heading) * sign, hard = st.barrier.hardness;
        const push = Math.min(near.distance - edge, .6 + hard * 2.4);
        c.x -= nx * push;
        c.y -= ny * push;
        const out = c.vx * nx + c.vy * ny;
        if (out > 0) {
            c.vx -= nx * out * (1 + .25 * hard);
            c.vy -= ny * out * (1 + .25 * hard);
        }
        const scrape = 1 - (1.2 + 2.2 * hard) * STEP;
        c.vx *= scrape;
        c.vy *= scrape;
        c.speed = Math.hypot(c.vx, c.vy);
        if (out > 3 && c.contactCooldown <= 0) {
            event(s, 'crash', c.id, clamp(out / 22, .15, 1) * (.4 + hard * .6));
            c.contactCooldown = .45;
        }
    }
}

/** Ordered gates make shortcuts and teleports worthless; nearest-point snaps across a hairpin still count. */
export function updateProgress(s: Session, c: Car, previousS: number) {
    const st = s.stage, L = st.length, near = nearest(st, c, previousS), delta = signedDistance(previousS, near.s, L);
    const moved = Math.hypot(c.x - c.px, c.y - c.py);
    c.s = near.s;
    if (moved > Math.max(4, (c.speed + 4) * STEP * 3) || Math.abs(delta) > 140) return;
    c.progress += delta;
    const onRoad = near.distance < st.width / 2 + 1;
    if (onRoad && delta >= 0) c.safeS = near.s;
    if (delta < -.05 && c.speed > 3) c.wrongWay += STEP;
    else if (delta > 0) c.wrongWay = 0;
    if (delta > 0 && onRoad && c.air <= 0 && c.speed > 12)
        for (const f of st.features)
            if (f.kind === 'jump' && forwardDistance(previousS, f.s + f.length, L) <= delta) {
                c.airTime = c.air = clamp(.16 + c.speed * .012, .25, .8);
                event(s, 'launch', c.id, c.airTime);
            }
    const water = near.distance < st.width / 2 + 2 && featureAt(st, near.s, 'splash') !== null;
    if (water && !c.inWater) {
        event(s, 'splash', c.id, clamp(c.speed / 35, .2, 1));
        c.dirt = Math.min(1, c.dirt + .12);
    }
    c.inWater = water;
    if (c.finish !== null || delta <= 0) return;
    for (let guard = 0; guard < GATES && c.finish === null; guard++) {
        const gate = c.nextGate, travel = forwardDistance(previousS, gate * L / GATES, L);
        if (travel > delta + .02) break;
        passGate(s, c, gate);
    }
}

function passGate(s: Session, c: Car, gate: number) {
    c.nextGate = (gate + 1) % GATES;
    if (!c.started) {
        if (gate === 0) { c.started = true; c.lapStart = s.raceClock; c.splits = []; }
        return;
    }
    const split = (SPLIT_GATES as readonly number[]).indexOf(gate);
    if (split >= 0) {
        const time = s.raceClock - c.lapStart;
        c.splits.push(time);
        if (c.id === 0 && s.setup.mode === 'stage') {
            const best = s.bestSplits?.[split], delta = best == null ? null : time - best;
            s.split = { index: split, time, delta, at: s.clock };
            event(s, 'split', 0, delta !== null && delta <= 0 ? 1 : 0);
        }
    }
    if (gate !== 0) return;
    const lap = s.raceClock - c.lapStart, total = s.setup.mode === 'stage' ? 1 : s.setup.laps;
    c.laps++;
    c.lapTimes.push(lap);
    c.best = c.best === null ? lap : Math.min(c.best, lap);
    if (c.id === 0) {
        event(s, 'lap');
        if (s.setup.mode === 'stage' && !s.tutorial) {
            const ghost: Ghost = { version: 1, rulesVersion: 1, key: recordKey(s.setup), time: lap, splits: [...c.splits, lap], samples: [...s.samples, { t: lap, x: c.x, y: c.y, heading: c.heading }] };
            if (!s.ghost || lap < s.ghost.time) { s.newGhost = ghost; s.completedGhosts.push(ghost); }
        }
        else if (c.laps < total) notice(s, c.laps === total - 1 ? 'FINAL LAP' : `LAP ${c.laps + 1} / ${total}`);
    }
    if (c.laps >= total) {
        c.finish = s.raceClock;
        event(s, 'finish', c.id);
    }
    c.lapStart = s.raceClock;
    c.splits = [];
    if (c.id === 0) s.samples = [{ t: 0, x: c.x, y: c.y, heading: c.heading }];
}

function contacts(s: Session) {
    const cars = s.cars;
    for (let i = 0; i < cars.length; i++)
        for (let j = i + 1; j < cars.length; j++) {
            const a = cars[i], b = cars[j];
            if (a.finish !== null || b.finish !== null || a.air > 0 || b.air > 0) continue;
            const dx = b.x - a.x, dy = b.y - a.y, dist = Math.hypot(dx, dy);
            if (dist >= CONTACT) continue;
            const nx = dist > .01 ? dx / dist : Math.cos(a.heading + Math.PI / 2), ny = dist > .01 ? dy / dist : Math.sin(a.heading + Math.PI / 2), push = (CONTACT - dist) * .51;
            a.x -= nx * push;
            a.y -= ny * push;
            b.x += nx * push;
            b.y += ny * push;
            const closing = (a.vx - b.vx) * nx + (a.vy - b.vy) * ny;
            if (closing > 0) {
                a.vx -= nx * closing * .55;
                a.vy -= ny * closing * .55;
                b.vx += nx * closing * .45;
                b.vy += ny * closing * .45;
            }
            if (a.contactCooldown <= 0 && b.contactCooldown <= 0) {
                event(s, 'contact', i === 0 ? 0 : j, clamp(closing / 15, .1, 1));
                a.contactCooldown = b.contactCooldown = .5;
            }
        }
}

export function orderedCars(s: Session) {
    return [...s.cars].sort((a, b) => a.finish !== null && b.finish !== null ? a.finish - b.finish : a.finish !== null ? -1 : b.finish !== null ? 1 : b.progress - a.progress);
}

/** Finish time for a car still running when the race closes, from its average pace so far. */
function projected(s: Session, c: Car) {
    const total = (s.setup.mode === 'stage' ? 1 : s.setup.laps) * s.stage.length, pace = Math.max(8, c.progress / Math.max(1, s.raceClock));
    return s.raceClock + Math.max(0, total - c.progress) / pace;
}

export function finishSession(s: Session, retired = false): Result {
    const ordered = orderedCars(s), p = s.cars[0], position = ordered.indexOf(p) + 1;
    const times = ordered.map(c => c.finish ?? (c.id === 0 && retired ? null : projected(s, c)));
    const leader = times.find(t => t !== null) ?? null;
    const classification: ResultRow[] = ordered.map((c, i) => ({ name: c.name, crew: c.crew, position: i + 1, time: times[i], best: c.best, laps: c.laps, gap: times[i] !== null && leader !== null && i > 0 ? times[i]! - leader : null, status: c.finish !== null ? 'Finished' : c.id === 0 && retired ? 'Retired' : 'Running' }));
    let medal: Medal | null = null;
    if (!retired && !s.tutorial) medal = s.setup.mode === 'stage' ? medalFor(p.finish, s.stage.targets) : (['gold', 'silver', 'bronze'] as const)[position - 1] ?? null;
    s.result = { version: 1, rulesVersion: 1, id: s.id, mode: s.setup.mode, stage: s.setup.stage, crew: p.crew, position, fieldSize: s.cars.length, elapsed: s.raceClock, best: p.best, laps: p.laps, medal, status: retired ? 'retired' : 'finished', classification };
    s.phase = 'finished';
    return s.result;
}

const TUTORIAL = [
    'NICE. NOW STEER INTO THE NEXT BEND',
    'GOOD. HOLD HANDBRAKE + STEER TO SWING IT ROUND',
    'THAT IS A RALLY DRIFT. NOW FINISH THE STAGE',
];

export function step(s: Session, input: Input = neutralInput()) {
    s.events = [];
    if (s.phase === 'paused' || s.phase === 'finished' || s.phase === 'intro') return;
    s.tick++;
    s.clock += STEP;
    if (s.phase === 'countdown') {
        const previous = Math.ceil(s.countdown);
        s.countdown -= STEP;
        for (const c of s.cars) { c.px = c.x; c.py = c.y; c.ph = c.heading; }
        if (s.countdown <= 0) {
            s.phase = 'running';
            event(s, 'go');
            notice(s, 'GO!', 1.2);
        }
        else if (Math.ceil(s.countdown) !== previous) event(s, 'count', 0, Math.ceil(s.countdown));
        return;
    }
    s.raceClock += STEP;
    for (const c of s.cars) {
        c.px = c.x;
        c.py = c.y;
        c.ph = c.heading;
        c.recoverCooldown = Math.max(0, c.recoverCooldown - STEP);
        c.contactCooldown = Math.max(0, c.contactCooldown - STEP);
        const previousS = c.s;
        drive(s, c, c.id ? aiInput(s, c) : playerInput(s, c, input));
        updateProgress(s, c, previousS);
        c.stuck = c.speed < 2 && c.air <= 0 ? c.stuck + STEP : 0;
        if (c.id && (c.stuck > 3 || c.wrongWay > 2)) recover(s, c.id);
    }
    contacts(s);
    const player = s.cars[0], notes = s.stage.notes;
    if (s.setup.mode === 'stage' && s.tick % 6 === 0 && s.samples.length < 12000)
        s.samples.push({ t: s.raceClock - player.lapStart, x: player.x, y: player.y, heading: player.heading });
    if (notes.length && player.finish === null) {
        const reach = 45 + player.speed * 2.8;
        for (let guard = 0; guard < notes.length && forwardDistance(player.s, notes[s.nextNote].s, s.stage.length) < reach; guard++) {
            const note = notes[s.nextNote];
            event(s, 'note', 0, note.kind === 'left' ? -1 : note.kind === 'right' ? 1 : 0);
            s.nextNote = (s.nextNote + 1) % notes.length;
        }
    }
    if (s.tutorial && s.tutorialStep < 3) {
        const done = [player.speed > 8, player.speed > 9 && Math.abs(input.steer) > .4, input.handbrake && player.speed > 8 && Math.abs(input.steer) > .3][s.tutorialStep];
        if (done) { notice(s, TUTORIAL[s.tutorialStep], 3.4); s.tutorialStep++; }
    }
    if (player.finish !== null) finishSession(s);
}

export const tutorialPrompts = ['HOLD GAS (W / ↑) TO GET MOVING', 'STEER WITH A / D OR ◀ ▶', 'HANDBRAKE (SPACE) + STEER INTO A BEND', 'FOLLOW THE PACE NOTES TO THE FINISH'];
