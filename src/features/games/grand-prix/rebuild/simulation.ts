import { racingTeams } from '@/mocks/games/grand-prix-racing';
import { STEP, RULES_VERSION, recordKey, neutralInput, type Car, type Compound, type Ghost, type Input, type Result, type Session, type Setup } from './contracts';
import { clamp, forwardDistance, getCircuit, nearest, pointAt, signedDistance, targetSpeed, wrap } from './geometry';
const GATES = 24;
const life: Record<Compound, number> = { soft: 5, medium: 8, hard: 12 };
export function random(seed: number) { let n = seed >>> 0; return () => { n = (Math.imul(n, 1664525) + 1013904223) >>> 0; return n / 4294967296; }; }
function makeCar(session: Session, id: number, slot: number): Car {
    let roster = id - 1;
    if (roster >= session.setup.team * 2)
        roster++;
    const team = id === 0 ? session.setup.team : Math.floor(roster / 2);
    const p = pointAt(session.track, -12 - Math.floor(slot / 2) * 10, slot % 2 ? -4 : 4);
    return { id, team, name: id === 0 ? 'You' : racingTeams[team].drivers[roster % 2], x: p.x, y: p.y, heading: p.heading, previous: { x: p.x, y: p.y, heading: p.heading }, vx: 0, vy: 0, s: p.s, progress: -12 - Math.floor(slot / 2) * 10, speed: 0, steering: 0, laps: 0, nextGate: 0, started: false, valid: true, lapStart: 0, best: null, sectors: [], lapTimes: [], wear: 1, compound: session.setup.compound, nextCompound: session.setup.compound === 'hard' ? 'medium' : 'hard', pitRequested: false, inPit: false, pitS: 0, service: 0, serviced: false, stops: 0, finish: null, disqualified: false, stuck: 0, recoverCooldown: 0, contactCooldown: 0, qualBest: null };
}
export function createSession(setup: Setup, seed: number, id: string, ghost: Ghost | null = null, tutorial = false): Session {
    const session: Session = { version: 2, id, setup: { ...setup, laps: setup.mode === 'race' && setup.strategy ? 10 : setup.laps, strategy: setup.mode === 'race' && setup.strategy, qualifying: setup.mode === 'race' && setup.qualifying }, track: getCircuit(setup.circuit), seed, phase: 'grid', resumePhase: 'running', clock: 0, raceClock: 0, countdown: 3, qualRemaining: 180, cars: [], tick: 0, events: [], notice: '', noticeUntil: 0, grid: 10, result: null, ghost, lapSamples: [], newGhost: null, completedGhosts: [], tutorial, tutorialStep: 0, lastSector: null };
    session.cars = Array.from({ length: setup.mode === 'trial' || tutorial ? 1 : 20 }, (_, i) => makeCar(session, i, i === 0 ? 9 : i <= 9 ? i - 1 : i));
    if (setup.mode === 'trial' || tutorial) {
        const car = session.cars[0], p = pointAt(session.track, 0);
        Object.assign(car, p, { previous: { x: p.x, y: p.y, heading: p.heading }, started: true, nextGate: 1, progress: 0 });
    }
    return session;
}
export function startSession(s: Session) {
    s.phase = s.setup.qualifying && s.setup.mode === 'race' && !s.tutorial ? 'qualifying' : 'countdown';
    s.countdown = 3;
    if (s.phase === 'qualifying') {
        s.cars.forEach((car, i) => { const p = pointAt(s.track, i * s.track.length / 20); Object.assign(car, p, { previous: { x: p.x, y: p.y, heading: p.heading }, speed: 30, vx: Math.cos(p.heading) * 30, vy: Math.sin(p.heading) * 30, started: i === 0, nextGate: i === 0 ? 1 : Math.floor(p.s / s.track.length * GATES) + 1, lapStart: 0 }); car.nextGate %= GATES; });
        notice(s, 'QUALIFYING · 3 MINUTES · SET A CLEAN LAP');
    }
}
export function notice(s: Session, message: string) { s.notice = message; s.noticeUntil = s.clock + 4; }
export function toggleMute(s: Session) { s.setup.muted = !s.setup.muted; }
function event(s: Session, type: Session['events'][number]['type'], car = 0) { s.events.push({ type, car, time: s.clock }); }
export function pauseSession(s: Session) {
    if (s.phase === 'finished' || s.phase === 'paused' || s.phase === 'grid')
        return;
    s.resumePhase = s.phase;
    s.phase = 'paused';
}
export function resumeSession(s: Session) {
    if (s.phase === 'paused')
        s.phase = s.resumePhase;
}
export function requestPit(s: Session, compound: Compound) {
    if (s.setup.mode !== 'race' || !s.setup.strategy || s.phase === 'qualifying')
        return;
    const c = s.cars[0];
    c.nextCompound = compound;
    c.pitRequested = !c.pitRequested;
    notice(s, c.pitRequested ? 'PIT REQUESTED · KEEP TO THE RIGHT AT ENTRY' : 'PIT REQUEST CANCELLED');
}
export function recover(s: Session, id = 0) {
    const c = s.cars[id];
    if (!c || c.recoverCooldown > 0 || c.inPit || c.finish !== null)
        return;
    const p = pointAt(s.track, c.s, id === 0 ? 0 : 3);
    Object.assign(c, { x: p.x, y: p.y, heading: p.heading, vx: 0, vy: 0, speed: 0, valid: false, stuck: 0, recoverCooldown: 4, previous: { x: p.x, y: p.y, heading: p.heading } });
    if (!id)
        notice(s, 'RECOVERED · THIS LAP IS INVALID');
    event(s, 'recover', id);
}
export function aiInput(s: Session, c: Car): Input {
    const p = nearest(s.track, c, c.s), look = clamp(10 + c.speed * .5, 12, 43);
    let offset = ((c.id % 3) - 1) * 1.3, desired = targetSpeed(s.track, c.s) * ({ club: .77, sport: .88, expert: .98 }[s.setup.difficulty]) * (.965 + random(s.seed + c.id)() * .06);
    for (const other of s.cars) {
        if (other === c || other.finish !== null || other.inPit)
            continue;
        const gap = forwardDistance(c.s, other.s, s.track.length);
        if (gap > 0 && gap < 24 && Math.abs(p.offset - nearest(s.track, other, other.s).offset) < 5) {
            offset += (c.id % 2 ? 1 : -1) * 5;
            if (gap < 9)
                desired = Math.min(desired, Math.max(12, other.speed - 2));
            break;
        }
    }
    const target = pointAt(s.track, c.s + look, clamp(offset, -s.track.width * .32, s.track.width * .32));
    const error = wrap(Math.atan2(target.y - c.y, target.x - c.x) - c.heading);
    return { steer: clamp(error * 2.3, -1, 1), throttle: c.speed < desired, brake: c.speed > desired + 1.7 };
}
function pitStep(s: Session, c: Car) {
    const pit = s.track.pit;
    if (!c.serviced && c.pitS >= pit.box) {
        c.service += STEP;
        c.speed = 0;
        if (c.service >= 3) {
            c.serviced = true;
            c.wear = 1;
            c.compound = c.nextCompound;
            c.stops++;
            event(s, 'pit', c.id);
            if (c.id === 0)
                notice(s, 'TYRES CHANGED · PIT LIMITER ACTIVE');
        }
    }
    else {
        c.speed = Math.min(13.8, c.speed + 12 * STEP);
        c.pitS += c.speed * STEP;
    }
    const blend = Math.min(clamp((c.pitS - pit.entry) / 24, 0, 1), clamp((pit.exit - c.pitS) / 24, 0, 1));
    const p = pointAt(s.track, c.pitS, s.track.width * .85 * blend);
    c.x = p.x;
    c.y = p.y;
    c.heading = p.heading;
    c.vx = Math.cos(p.heading) * c.speed;
    c.vy = Math.sin(p.heading) * c.speed;
    if (c.pitS >= pit.exit) {
        c.inPit = false;
        c.pitRequested = false;
        c.service = 0;
        c.serviced = false;
    }
}
function drive(s: Session, c: Car, input: Input) {
    if (c.inPit) {
        pitStep(s, c);
        return;
    }
    const surface = nearest(s.track, c, c.s), off = surface.distance > s.track.width / 2 + 1;
    let throttle = input.throttle, brake = input.brake;
    if (c.id === 0 && s.setup.autoThrottle)
        throttle = true;
    if (c.id === 0 && s.setup.brakeAssist && c.speed > targetSpeed(s.track, c.s))
        brake = true;
    c.steering += (input.steer - c.steering) * Math.min(1, STEP * 11);
    const grip = off ? .50 : 1, tyre = s.setup.strategy ? clamp(.64 + c.wear * .4, .64, 1) : 1;
    const forward = c.vx * Math.cos(c.heading) + c.vy * Math.sin(c.heading), side = -c.vx * Math.sin(c.heading) + c.vy * Math.cos(c.heading);
    const turn = c.steering * (.46 / (1 + Math.abs(forward) / 60)), yaw = forward / 5.1 * Math.tan(turn);
    const maxYaw = 16 * grip * tyre / Math.max(10, Math.abs(forward));
    c.heading = wrap(c.heading + clamp(yaw, -maxYaw, maxYaw) * STEP);
    let velocity = forward + ((throttle ? 16 * (1 - Math.max(0, forward) / 80) : 0) - (brake ? 29 : 0) - .45 - forward * .012 - (off ? forward * .8 : 0)) * STEP;
    velocity = clamp(velocity, 0, 69);
    const lateral = side * Math.exp(-STEP * (off ? 4 : 11) * tyre);
    c.vx = Math.cos(c.heading) * velocity - Math.sin(c.heading) * lateral;
    c.vy = Math.sin(c.heading) * velocity + Math.cos(c.heading) * lateral;
    c.x += c.vx * STEP;
    c.y += c.vy * STEP;
    c.speed = Math.hypot(c.vx, c.vy);
    const edge = s.track.width / 2 + (s.track.theme === 'city' ? 6 : 18);
    if (surface.distance > edge) {
        const excess = surface.distance - edge;
        c.x -= Math.sin(surface.heading) * Math.sign(surface.offset) * -Math.min(excess, 4);
        c.y -= Math.cos(surface.heading) * Math.sign(surface.offset) * Math.min(excess, 4);
        c.vx *= .65;
        c.vy *= .65;
        if (c.contactCooldown <= 0) {
            event(s, 'contact', c.id);
            c.contactCooldown = .5;
        }
    }
}
/** Gate processing is independent of rendering and rejects teleports, shortcuts and reverse laps. */
export function updateProgress(s: Session, c: Car, previousS: number) {
    const p = nearest(s.track, c, previousS), delta = signedDistance(previousS, p.s, s.track.length), plausible = Math.abs(delta) < Math.max(10, c.speed * STEP * 4 + 3), onCourse = p.distance <= s.track.width / 2 + 4 || c.inPit;
    c.s = p.s;
    if (!onCourse && !c.inPit && c.valid) {
        c.valid = false;
        if (c.id === 0) {
            notice(s, 'TRACK LIMITS · LAP INVALID');
            event(s, 'invalid');
        }
    }
    if (!plausible) {
        c.valid = false;
        return;
    }
    c.progress += delta;
    if (delta <= 0 || !onCourse)
        return;
    const gateS = c.nextGate * s.track.length / GATES, travel = forwardDistance(previousS, gateS, s.track.length);
    if (travel > delta + .02)
        return;
    const gate = c.nextGate;
    c.nextGate = (gate + 1) % GATES;
    if (gate === 8 || gate === 16) {
        c.sectors.push(s.raceClock - c.lapStart);
        if (!c.id)
            s.lastSector = c.sectors.at(-1)!;
    }
    if (gate !== 0)
        return;
    if (c.started) {
        const lap = s.raceClock - c.lapStart;
        if (c.valid && lap > 5) {
            c.laps++;
            c.lapTimes.push(lap);
            c.best = c.best === null ? lap : Math.min(c.best, lap);
            if (s.phase === 'qualifying')
                c.qualBest = c.qualBest === null ? lap : Math.min(c.qualBest, lap);
            if (!c.id) {
                event(s, 'lap');
                notice(s, `LAP ${c.laps} · ${lap.toFixed(3)}s`);
                if (s.setup.mode === 'trial' && !s.tutorial) {
                    const ghost: Ghost = { version: 2, rulesVersion: RULES_VERSION, key: recordKey(s.setup), time: lap, sectors: [...c.sectors, lap], samples: [...s.lapSamples, { t: lap, x: c.x, y: c.y, heading: c.heading }] };
                    if (!s.ghost || lap < s.ghost.time) {
                        s.ghost = ghost;
                        s.newGhost = ghost;
                        s.completedGhosts.push(ghost);
                    }
                }
            }
        }
        else if (s.setup.mode === 'race' && s.phase !== 'qualifying') {
            // Invalid race laps count toward distance; cut laps incur a time penalty.
            c.laps++;
            c.lapTimes.push(lap + 5);
            c.progress -= 5 * 40;
            if (!c.id)
                notice(s, 'LAP COMPLETE · 5s TRACK-LIMIT PENALTY');
        }
        if (s.setup.mode === 'race' && s.phase !== 'qualifying' && c.laps >= s.setup.laps) {
            c.finish = s.raceClock + (c.valid ? 0 : 5);
            c.disqualified = s.setup.strategy && c.stops === 0;
            event(s, 'finish', c.id);
        }
    }
    c.started = true;
    c.valid = true;
    c.lapStart = s.raceClock;
    c.sectors = [];
    if (!c.id)
        s.lapSamples = [{ t: 0, x: c.x, y: c.y, heading: c.heading }];
}
function contacts(s: Session) {
    for (let i = 0; i < s.cars.length; i++)
        for (let j = i + 1; j < s.cars.length; j++) {
            const a = s.cars[i], b = s.cars[j];
            if (a.inPit || b.inPit || a.finish !== null || b.finish !== null)
                continue;
            const dx = b.x - a.x, dy = b.y - a.y, dist = Math.hypot(dx, dy);
            if (dist >= 4.4)
                continue;
            const nx = dist > .01 ? dx / dist : Math.cos(a.heading + Math.PI / 2), ny = dist > .01 ? dy / dist : Math.sin(a.heading + Math.PI / 2), push = (4.4 - dist) * .51;
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
                event(s, 'contact', i === 0 ? 0 : j);
                a.contactCooldown = b.contactCooldown = .5;
            }
        }
}
export function orderedCars(s: Session) { return [...s.cars].sort((a, b) => Number(a.disqualified) - Number(b.disqualified) || (a.finish !== null && b.finish !== null ? a.finish - b.finish : a.finish !== null ? -1 : b.finish !== null ? 1 : b.progress - a.progress)); }
export function finishSession(s: Session, retired = false): Result {
    const ordered = orderedCars(s), p = s.cars[0];
    const result: Result = { version: 2, rulesVersion: RULES_VERSION, id: s.id, mode: s.setup.mode, circuit: s.setup.circuit, team: p.team, position: ordered.indexOf(p) + 1, fieldSize: s.cars.length, elapsed: s.raceClock, bestLap: p.best, laps: p.laps, status: p.disqualified ? 'disqualified' : retired ? 'retired' : 'finished', classification: ordered.map((c, i) => ({ name: c.name, team: c.team, position: i + 1, time: c.finish, best: c.best, laps: c.laps, stops: c.stops, status: c.disqualified ? 'DSQ' : c.finish !== null ? 'Finished' : c.id === 0 && retired ? 'Retired' : 'Running' })) };
    s.result = result;
    s.phase = 'finished';
    return result;
}
export function endQualifying(s: Session) {
    const ordered = [...s.cars].sort((a, b) => (a.qualBest ?? Infinity) - (b.qualBest ?? Infinity) || (a.qualBest === null && b.qualBest === null ? Number(a.id === 0) - Number(b.id === 0) : a.id - b.id));
    s.grid = ordered.findIndex(c => c.id === 0) + 1;
    const qualifying = s.cars.map(c => c.qualBest);
    s.cars = s.cars.map(c => ({ ...makeCar(s, c.id, ordered.findIndex(o => o.id === c.id)), qualBest: qualifying[c.id] }));
    s.raceClock = 0;
    s.phase = 'grid';
    s.setup.qualifying = false;
    notice(s, `QUALIFYING COMPLETE · GRID P${s.grid}`);
}
export function step(s: Session, input: Input = neutralInput()) {
    s.events = [];
    if (['paused', 'finished', 'grid'].includes(s.phase))
        return;
    s.tick++;
    s.clock += STEP;
    if (s.phase === 'countdown') {
        const previous = Math.ceil(s.countdown);
        s.countdown -= STEP;
        if (Math.ceil(s.countdown) !== previous)
            event(s, 'lights');
        if (s.countdown <= 0) {
            s.phase = 'running';
            event(s, 'go');
            notice(s, 'LIGHTS OUT');
        }
        return;
    }
    s.raceClock += STEP;
    if (s.phase === 'qualifying') {
        s.qualRemaining -= STEP;
        if (s.qualRemaining <= 0) {
            endQualifying(s);
            return;
        }
    }
    for (const c of s.cars) {
        c.previous = { x: c.x, y: c.y, heading: c.heading };
        c.recoverCooldown = Math.max(0, c.recoverCooldown - STEP);
        c.contactCooldown = Math.max(0, c.contactCooldown - STEP);
        if (c.finish !== null)
            continue;
        const previousS = c.s;
        if (c.id && s.setup.strategy && s.phase !== 'qualifying' && !c.stops && (c.laps >= 5 || c.wear < .2)) {
            c.pitRequested = true;
            c.nextCompound = 'hard';
        }
        if (c.pitRequested && !c.inPit && s.phase !== 'qualifying' && forwardDistance(c.s, s.track.pit.entry, s.track.length) < Math.max(2, c.speed * STEP + 1) && nearest(s.track, c, c.s).distance < s.track.width / 2 + 2) {
            c.inPit = true;
            c.pitS = s.track.pit.entry;
            c.service = 0;
            c.serviced = false;
            event(s, 'pit', c.id);
        }
        drive(s, c, c.id ? aiInput(s, c) : input);
        updateProgress(s, c, previousS);
        if (s.setup.strategy && s.phase !== 'qualifying' && !c.inPit)
            c.wear = Math.max(0, c.wear - c.speed * STEP / (s.track.length * life[c.compound]));
        c.stuck = c.speed < 2 ? c.stuck + STEP : 0;
        if (c.id && c.stuck > 4)
            recover(s, c.id);
    }
    contacts(s);
    const player = s.cars[0];
    if (s.setup.mode === 'trial' && s.tick % 6 === 0 && s.lapSamples.length < 12000)
        s.lapSamples.push({ t: s.raceClock - player.lapStart, x: player.x, y: player.y, heading: player.heading });
    if (s.tutorial) {
        const actions = [input.throttle || s.setup.autoThrottle, player.speed > 10 && Math.abs(input.steer) > .4, input.brake && player.speed > 1, player.laps > 0];
        if (actions[s.tutorialStep]) {
            s.tutorialStep++;
            notice(s, ['ACCELERATION COMPLETE · STEER INTO THE NEXT BEND', 'STEERING COMPLETE · TRY THE BRAKE', 'BRAKING COMPLETE · FINISH A CLEAN LAP', 'PRACTICE COMPLETE'][s.tutorialStep - 1]);
        }
        if (s.tutorialStep >= 4)
            finishSession(s);
    }
    if (player.finish !== null && s.phase !== 'finished')
        finishSession(s);
}
