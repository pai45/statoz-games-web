import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { DEFAULT_SETUP, STEP, recordKey, neutralInput, type Setup } from '../src/features/games/grand-prix/rebuild/contracts';
import { circuits, nearest, pointAt } from '../src/features/games/grand-prix/rebuild/geometry';
import { aiInput, createSession, endQualifying, finishSession, pauseSession, recover, requestPit, resumeSession, startSession, step, updateProgress } from '../src/features/games/grand-prix/rebuild/simulation';
import { RacingStore, SAVE_KEY, cleanSetup, validGhost } from '../src/features/games/grand-prix/rebuild/persistence';
import { RaceInput } from '../src/features/games/grand-prix/rebuild/input';
import { racingTeams } from '../src/mocks/games/grand-prix-racing';
const setup = (patch: Partial<Setup> = {}): Setup => ({ ...DEFAULT_SETUP, ...patch });
test('five closed world circuits provide consistent sampling and pit geometry', () => {
    for (const t of circuits) {
        assert.ok(t.length > 1500);
        assert.ok(t.pit.entry < t.pit.box && t.pit.box < t.pit.exit);
        for (let s = 0; s < t.length; s += 11) {
            const p = pointAt(t, s);
            assert.ok(Math.abs(nearest(t, p).s - s) < 3);
            assert.ok(Number.isFinite(p.curvature));
        }
        assert.ok(Math.hypot(pointAt(t, 0).x - pointAt(t, t.length).x, pointAt(t, 0).y - pointAt(t, t.length).y) < .01);
    }
});
test('exactly twenty drivers, ten free teams, deterministic world-space driving', () => {
    const a = createSession(setup(), 42, 'a'), b = createSession(setup(), 42, 'b');
    assert.equal(a.cars.length, 20);
    for (let team = 0; team < 10; team++)
        assert.equal(a.cars.filter(c => c.team === team).length, 2);
    assert.equal(new Set(a.cars.map(c => c.name)).size, 20);
    startSession(a);
    startSession(b);
    for (let i = 0; i < 600; i++) {
        const input = aiInput(a, a.cars[0]);
        step(a, input);
        step(b, input);
    }
    assert.deepEqual(a.cars, b.cars);
    assert.ok(a.cars[0].speed > 0);
});
test('pause freezes simulation and independent input sources release safely', () => {
    const s = createSession(setup(), 1, 'pause');
    startSession(s);
    step(s);
    pauseSession(s);
    const before = JSON.stringify(s);
    for (let i = 0; i < 100; i++)
        step(s);
    assert.equal(JSON.stringify(s), before);
    resumeSession(s);
    step(s);
    assert.ok(s.clock > STEP);
    const input = new RaceInput();
    input.hold('key', 'left', true);
    input.hold('finger', 'left', true);
    input.hold('pedal', 'throttle', true);
    input.hold('finger', 'left', false);
    assert.equal(input.read().steer, -1);
    assert.equal(input.read().throttle, true);
    input.clear();
    assert.deepEqual(input.read(), neutralInput());
});
test('time trial strips opponents, recovery invalidates and teleport cannot complete a lap', () => { const s = createSession(setup({ mode: 'trial' }), 2, 'tt'), p = s.cars[0]; assert.equal(s.cars.length, 1); s.phase = 'running'; p.nextGate = 0; p.started = true; const prior = s.track.length - 20; Object.assign(p, pointAt(s.track, 2)); updateProgress(s, p, prior); assert.equal(p.laps, 0); assert.equal(p.valid, false); recover(s); assert.equal(p.speed, 0); assert.equal(p.valid, false); });
test('mandatory stop missing disqualifies and time trial has no pit request', () => { const s = createSession(setup({ strategy: true }), 2, 'pit'); assert.equal(s.setup.laps, 10); s.phase = 'running'; const c = s.cars[0]; c.laps = 9; c.nextGate = 0; c.started = true; c.lapStart = 0; s.raceClock = 50; const p = pointAt(s.track, 1); Object.assign(c, { x: p.x, y: p.y, speed: 60 }); updateProgress(s, c, s.track.length - .1); assert.equal(c.disqualified, true); finishSession(s); assert.equal(s.result?.status, 'disqualified'); const tt = createSession(setup({ mode: 'trial' }), 2, 'tt'); requestPit(tt, 'soft'); assert.equal(tt.cars[0].pitRequested, false); });
test('qualifying orders actual valid times and resets race wear and clocks', () => { const s = createSession(setup({ qualifying: true }), 3, 'q'); startSession(s); assert.equal(s.phase, 'qualifying'); s.cars.forEach((c, i) => c.qualBest = i === 0 ? 65 : 60 + i); s.cars[0].wear = .1; s.raceClock = 180; endQualifying(s); assert.equal(s.grid, 5); assert.equal(s.phase, 'grid'); assert.equal(s.raceClock, 0); assert.equal(s.cars[0].wear, 1); assert.equal(s.cars[0].laps, 0); startSession(s); assert.equal(s.phase, 'countdown'); });
test('local saves survive blocked storage, reject bad ghosts and preserve unknown schemas', () => { let writes = 0; const store = new RacingStore({ getItem: () => JSON.stringify({ version: 99 }), setItem: () => writes++ }); store.settings(setup({ team: 3 })); assert.equal(writes, 0); const blocked = new RacingStore({ getItem: () => { throw Error('denied'); }, setItem: () => { throw Error('denied'); } }); blocked.settings(setup({ team: 8 })); assert.equal(blocked.data.setup.team, 8); assert.match(blocked.status, /Storage unavailable/); assert.equal(validGhost({ samples: [{ x: NaN }] }, 'x'), false); assert.equal(cleanSetup({ team: 999, engineVolume: -2 }).team, 9); assert.equal(recordKey(setup()), recordKey(setup({ guide: true }))); assert.notEqual(recordKey(setup()), recordKey(setup({ brakeAssist: true }))); assert.equal(SAVE_KEY, 'statoz.games.web.grandprix.v2'); });
test('result collection is idempotent and never settles shared currency', () => { const data = new Map<string, string>(); const store = new RacingStore({ getItem: k => data.get(k) ?? null, setItem: (k, v) => { data.set(k, v); } }); const s = createSession(setup(), 4, 'unique'); finishSession(s, true); store.collect(s); store.collect(s); assert.equal(store.data.recent.length, 1); assert.equal(data.size, 1); const source = readFileSync('src/features/games/grand-prix/rebuild/screen.tsx', 'utf8'); assert.doesNotMatch(source, /settleCoinReward|activeLoadout|useEconomy|design-system/); assert.equal(racingTeams.length, 10); });
test('headless field completes each circuit with autonomous player', { timeout: 240000 }, () => {
    for (const track of circuits) {
        const s = createSession(setup({ circuit: track.id, laps: 3, difficulty: 'expert' }), 51, 'soak-' + track.id);
        startSession(s);
        for (let i = 0; i < 36000 && s.phase !== 'finished'; i++)
            step(s, aiInput(s, s.cars[0]));
        assert.equal(s.phase, 'finished', `${track.id}: ${JSON.stringify(s.cars.map(c => ({ id: c.id, laps: c.laps, s: c.s, speed: c.speed, gate: c.nextGate })))}`);
        assert.equal(s.result?.laps, 3);
        assert.ok(s.cars.filter(c => c.laps >= 2).length >= 16, track.id + ' AI completion');
    }
});
test('time trial produces a valid persisted ghost after a complete driven lap', () => {
    const s = createSession(setup({ mode: 'trial', strategy: true, qualifying: true }), 9, 'ghost');
    assert.equal(s.setup.strategy, false);
    assert.equal(s.setup.qualifying, false);
    startSession(s);
    for (let i = 0; i < 16000 && s.cars[0].laps < 1; i++)
        step(s, aiInput(s, s.cars[0]));
    assert.ok(s.ghost, 'clean driven lap');
    assert.equal(s.ghost.sectors.length, 3);
    assert.ok(validGhost(s.ghost, recordKey(s.setup)));
    const memory = new Map<string, string>();
    const store = new RacingStore({ getItem: k => memory.get(k) ?? null, setItem: (k, v) => { memory.set(k, v); } });
    store.collect(s);
    assert.equal(store.best(s.setup)?.best, s.ghost.time);
    assert.equal(new RacingStore({ getItem: k => memory.get(k) ?? null, setItem: () => { } }).best(s.setup)?.ghost?.samples.length, s.ghost.samples.length);
});
test('ten-lap strategy runs actual tyre service for player and AI', { timeout: 180000 }, () => {
    const s = createSession(setup({ strategy: true, difficulty: 'expert' }), 19, 'strategy');
    startSession(s);
    for (let i = 0; i < 65000 && s.phase !== 'finished'; i++) {
        const p = s.cars[0];
        if (p.laps >= 5 && !p.stops && !p.inPit && !p.pitRequested)
            requestPit(s, 'hard');
        step(s, aiInput(s, p));
    }
    assert.equal(s.phase, 'finished');
    assert.equal(s.cars[0].stops, 1);
    assert.equal(s.result?.status, 'finished');
    assert.equal(s.cars[0].compound, 'hard');
    assert.ok(s.cars.slice(1).every(c => c.stops >= 1), 'all opponents service tyres');
});
