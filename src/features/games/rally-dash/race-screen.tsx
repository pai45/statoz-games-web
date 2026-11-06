'use client';
import { memo, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { RallyAudio } from './audio';
import { crews } from './crews';
import { STEP, deltaLabel, neutralInput, timeLabel, type Input, type Phase, type RaceEvent, type Session, type Setup } from './contracts';
import { Hud, HudClock, MedalBadge } from './hud';
import { RaceInput, type Action } from './input';
import { upcomingNotes } from './pace-notes';
import type { RallyStore } from './persistence';
import { RallyRenderer } from './renderer';
import { aiInput, finishSession, pauseSession, recover, resumeSession, setMuted as muteSession, startSession, step } from './simulation';
import { getStage, nextStage } from './stages';
import { Dialog, Hold, IconButton, SteerPad } from './ui';
import styles from './rally.module.css';

declare global { interface Window { __RALLY_DASH_INSPECT__?: Record<string, unknown> } }

const KEYS: Record<string, Action> = { ArrowLeft: 'left', KeyA: 'left', ArrowRight: 'right', KeyD: 'right', ArrowUp: 'throttle', KeyW: 'throttle', ArrowDown: 'brake', KeyS: 'brake', Space: 'handbrake' };
const isTouch = () => typeof window !== 'undefined' && window.matchMedia('(any-pointer: coarse)').matches;

/** Left thumb: slide-to-steer pad. Right thumb: handbrake and brake (plus gas when auto gas is off). */
const Controls = memo(function Controls({ input, size, opacity, autoGas }: { input: RaceInput; size: number; opacity: number; autoGas: boolean }) {
    return <div className={styles.controls} style={{ '--touch': `${size}px`, '--touch-opacity': opacity } as CSSProperties}>
        <SteerPad input={input} />
        <div className={`${styles.pedals} ${autoGas ? styles.pedalsAuto : ''}`}>
            <Hold action="handbrake" label="Handbrake" input={input} className={styles.handbrake}>HAND<br />BRAKE</Hold>
            <Hold action="brake" label="Brake" input={input} className={styles.brake}>BRAKE</Hold>
            {!autoGas && <Hold action="throttle" label="Accelerate" input={input} className={styles.gas}>GAS</Hold>}
        </div>
    </div>;
});

/** Short vibrations for the bumps you feel through the wheel (phones that support it; never more than one at a time). */
function haptics(events: RaceEvent[], last: { at: number }) {
    if (typeof navigator === 'undefined' || !('vibrate' in navigator)) return;
    const now = performance.now();
    if (now - last.at < 120) return;
    for (const e of events) {
        if (e.car !== 0) continue;
        const ms = e.type === 'crash' ? 18 + e.power * 40 : e.type === 'land' ? 22 : e.type === 'contact' ? 14 : e.type === 'splash' ? 12 : 0;
        if (!ms) continue;
        navigator.vibrate(Math.round(ms));
        last.at = now;
        return;
    }
}

type Props = { session: Session; store: RallyStore; autostart: boolean; onExit: () => void; onRestart: () => void; onNext: () => void; onSetup: (patch: Partial<Setup>) => void };
export function RaceScreen({ session: s, store, autostart, onExit, onRestart, onNext, onSetup }: Props) {
    const canvas = useRef<HTMLCanvasElement>(null), audio = useRef<RallyAudio | null>(null);
    const [input] = useState(() => new RaceInput()), [hud] = useState(() => new HudClock()), [touch] = useState(isTouch);
    const [phase, setPhase] = useState<Phase>(() => { if (autostart) startSession(s); return s.phase; }), [error, setError] = useState(''), [confirm, setConfirm] = useState(false), [muted, setMuted] = useState(s.setup.muted);
    const prior = useMemo(() => store.best(s.setup)?.best ?? null, [store, s.setup]);
    const sound = () => {
        if (!audio.current) audio.current = new RallyAudio();
        audio.current.configure(s.setup);
        audio.current.start();
    };
    const begin = () => {
        sound();
        if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
        startSession(s);
        setPhase(s.phase);
    };
    const togglePause = () => {
        input.clear();
        if (s.phase === 'paused') { sound(); resumeSession(s); }
        else pauseSession(s);
        setPhase(s.phase);
    };
    const quit = () => {
        if (s.phase !== 'finished' && s.phase !== 'intro') { finishSession(s, true); store.collect(s); }
        onExit();
    };
    const restartRef = useRef(onRestart);
    useEffect(() => { restartRef.current = onRestart; }, [onRestart]);

    useEffect(() => {
        const target = canvas.current, box = target?.parentElement;
        if (!target || !box) return;
        let renderer: RallyRenderer;
        try { renderer = new RallyRenderer(target, s.stage); }
        catch { setTimeout(() => setError('This browser could not start the stage renderer. Try reloading, or use another browser.'), 0); return; }
        renderer.camera = s.setup.camera;
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)'), manual = new URLSearchParams(location.search).get('clock') === 'manual';
        let request = 0, last = 0, acc = 0, lastHud = 0, phase = s.phase, dirty = true, slowFor = 0, active = true, autopilot = false;
        const perf = { frames: 0, stepMs: 0, renderMs: 0, worstMs: 0, downgraded: false }, buzz = { at: 0 };
        // Keep the screen awake while racing; let it sleep when paused or finished.
        let lock: WakeLockSentinel | null = null;
        const wake = (on: boolean) => {
            if (on && !lock && 'wakeLock' in navigator) navigator.wakeLock.request('screen').then(l => { if (active && (s.phase === 'running' || s.phase === 'countdown')) lock = l; else void l.release(); }).catch(() => { });
            if (!on && lock) { void lock.release().catch(() => { }); lock = null; }
        };
        const size = () => { const r = box.getBoundingClientRect(); renderer.resize(r.width, r.height, window.devicePixelRatio || 1); dirty = true; };
        size();
        const observer = new ResizeObserver(size);
        observer.observe(box);
        const tick = (control: Input) => {
            step(s, control);
            if (s.events.length) {
                audio.current?.events(s.events);
                renderer.events(s.events, s, reduced.matches);
                if (s.setup.vibration) haptics(s.events, buzz);
            }
            store.collect(s);
        };
        const frame = (now: number) => {
            if (!active) return;
            const dt = last ? Math.min(.1, (now - last) / 1000) : 0;
            last = now;
            const t0 = performance.now();
            if (!manual) {
                acc += dt;
                let steps = 0;
                while (acc >= STEP && steps < 8) { tick(autopilot ? aiInput(s, s.cars[0]) : input.read()); acc -= STEP; steps++; }
                if (steps === 8) acc = 0;
            }
            const t1 = performance.now();
            audio.current?.update(s.cars[0], s.phase === 'running');
            const live = s.phase === 'running' || s.phase === 'countdown';
            if (live || dirty) {
                renderer.render(s, manual ? 1 : acc / STEP, manual ? (dirty ? 0 : STEP) : dt, reduced.matches);
                dirty = false;
                const stepMs = t1 - t0, total = stepMs + renderer.lastRenderMs;
                perf.frames++;
                perf.stepMs += (stepMs - perf.stepMs) * .05;
                perf.renderMs += (renderer.lastRenderMs - perf.renderMs) * .05;
                perf.worstMs = Math.max(perf.worstMs * .995, total);
                // Adaptive quality: if frames stay heavy for ~2 seconds, drop resolution and particle count once.
                slowFor = live && total > 11 ? slowFor + dt : Math.max(0, slowFor - dt);
                if (slowFor > 2 && !perf.downgraded) { perf.downgraded = true; renderer.setQuality(0); size(); }
            }
            if (s.phase !== phase) {
                phase = s.phase;
                setPhase(phase);
                wake(phase === 'running' || phase === 'countdown');
                if (phase === 'finished') {
                    audio.current?.medal(s.result?.medal ?? null);
                    audio.current?.update(null, false);
                    if (s.tutorial) store.seenTutorial();
                    if (s.setup.vibration && s.result?.medal && 'vibrate' in navigator) navigator.vibrate([30, 60, 30, 60, 60]);
                }
                dirty = true;
            }
            if (now - lastHud > 100) { hud.tick(); lastHud = now; }
            request = requestAnimationFrame(frame);
        };
        const down = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLElement && ['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) return;
            if ((e.code === 'Escape' || e.code === 'KeyP') && !e.repeat && (s.phase === 'running' || s.phase === 'countdown' || s.phase === 'paused')) { e.preventDefault(); togglePause(); return; }
            if (e.code === 'KeyR' && !e.repeat && s.phase === 'running') { recover(s); return; }
            if (e.code === 'Backspace' && !e.repeat && (s.phase === 'running' || s.phase === 'finished')) { e.preventDefault(); restartRef.current(); return; }
            const action = KEYS[e.code];
            if (action && (s.phase === 'running' || s.phase === 'countdown')) { e.preventDefault(); input.hold(`key:${e.code}`, action, true); }
        };
        const up = (e: KeyboardEvent) => { const action = KEYS[e.code]; if (action) input.hold(`key:${e.code}`, action, false); };
        const interrupt = () => { input.clear(); pauseSession(s); last = 0; acc = 0; audio.current?.update(null, false); if (s.phase !== phase) { phase = s.phase; setPhase(phase); wake(false); } dirty = true; };
        const hidden = () => { if (document.hidden) interrupt(); };
        window.addEventListener('keydown', down);
        window.addEventListener('keyup', up);
        window.addEventListener('blur', interrupt);
        document.addEventListener('visibilitychange', hidden);
        window.__RALLY_DASH_INSPECT__ = {
            session: s,
            snapshot: () => { const p = s.cars[0]; return { phase: s.phase, raceClock: s.raceClock, mode: s.setup.mode, stage: s.stage.id, camera: renderer.camera, input: input.read(), player: { s: p.s, speed: p.speed, laps: p.laps, slip: p.slip, surface: p.surface, air: p.air, dirt: p.dirt, finish: p.finish }, notes: upcomingNotes(s.stage, p.s, p.speed).map(n => ({ kind: n.kind, severity: n.severity })), result: s.result, particles: renderer.particles.live, marks: renderer.marks.size, longestMark: renderer.marks.longest() }; },
            advance: (ms: number, held: Partial<Input> | 'auto' = {}) => { const n = Math.round(ms / 1000 / STEP); for (let i = 0; i < n && s.phase !== 'finished'; i++) tick(held === 'auto' ? aiInput(s, s.cars[0]) : { ...neutralInput(), ...input.read(), ...held }); renderer.render(s, 1, STEP, reduced.matches); dirty = true; },
            autopilot: (on: boolean) => { autopilot = on; },
            zoom: (factor: number) => { renderer.zoomScale = factor; dirty = true; },
            perf: () => ({ ...perf, tiles: renderer.tileCount, tileMB: +(renderer.tileBytes / 1048576).toFixed(1), painted: renderer.paintedTiles, quality: renderer.quality, canvas: [target.width, target.height] }),
        };
        request = requestAnimationFrame(frame);
        if (autostart) { sound(); wake(true); }
        return () => {
            active = false;
            cancelAnimationFrame(request);
            observer.disconnect();
            input.clear();
            wake(false);
            audio.current?.dispose();
            audio.current = null;
            renderer.dispose();
            window.removeEventListener('keydown', down);
            window.removeEventListener('keyup', up);
            window.removeEventListener('blur', interrupt);
            document.removeEventListener('visibilitychange', hidden);
            delete window.__RALLY_DASH_INSPECT__;
        };
        // The session object is stable for this screen; the parent remounts with a new key on restart.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [s]);

    const p = s.cars[0], stage = s.stage, stageMode = s.setup.mode === 'stage', result = s.result;
    const toggleMute = () => { const next = !muted; setMuted(next); muteSession(s, next); onSetup({ muted: next }); audio.current?.configure(s.setup); };
    const improved = stageMode && result?.status === 'finished' && p.finish !== null && (prior === null || p.finish < prior);
    const finishTitle = !result ? '' : s.tutorial ? 'SCHOOL DONE.' : result.status === 'retired' ? 'RETIRED.' : stageMode ? (result.medal ? `${result.medal.toUpperCase()}!` : 'STAGE CLEAR.') : result.position === 1 ? 'WINNER!' : result.position <= 3 ? 'PODIUM!' : 'CHEQUERED FLAG.';
    const controlsHelp = touch ? <>Slide your <b>left thumb</b> on the pad to steer. Hold <b>HANDBRAKE</b> to swing round hairpins.{s.setup.autoThrottle ? ' Auto gas is on.' : ''}</> : <>Steer <b>A D / ← →</b>, gas <b>W / ↑</b>, brake <b>S / ↓</b>, handbrake <b>Space</b>.</>;
    return <main className={styles.race} aria-label={`${stage.name} ${stageMode ? 'stage attack' : 'rallycross'}`}>
        <div className={styles.playfield}>
            <canvas ref={canvas} className={styles.canvas} role="img" aria-label="Overhead rally stage" />
            {!error && <Hud session={s} clock={hud} touch={touch} />}
            <div className={styles.topButtons}>
                <IconButton icon="recover" label="Recover" onClick={() => recover(s)} disabled={phase !== 'running'} />
                <IconButton icon={muted ? 'mute' : 'sound'} label={muted ? 'Sound off' : 'Sound on'} onClick={toggleMute} />
                <IconButton icon={phase === 'paused' ? 'play' : 'pause'} label={phase === 'paused' ? 'Resume' : 'Pause'} onClick={togglePause} disabled={phase === 'finished' || phase === 'intro'} />
            </div>
            <Controls input={input} size={s.setup.touchSize} opacity={s.setup.touchOpacity} autoGas={s.setup.autoThrottle} />
            {error && <Dialog title="STAGE UNAVAILABLE"><p role="alert">{error}</p><div className={styles.actions}><button className={styles.primary} onClick={onExit}>BACK TO MENU</button></div></Dialog>}
            {!error && phase === 'intro' && <Dialog title={s.tutorial ? 'DRIVING SCHOOL' : stage.name.toUpperCase()}>
                <p className={styles.kicker}>{s.tutorial ? 'FOUR QUICK LESSONS ON A CLEAR STAGE' : stageMode ? `STAGE ATTACK · ${stage.region}` : `RALLYCROSS · ${s.setup.laps} LAPS · ${s.setup.rivals.toUpperCase()} RIVALS`}</p>
                {stageMode && !s.tutorial ? <ol className={styles.introTargets}>{(['gold', 'silver', 'bronze'] as const).map(m => <li key={m}><MedalBadge medal={m} /><strong>{timeLabel(stage.targets[m])}</strong></li>)}{s.ghost && <li><span>BEST</span><strong>{timeLabel(s.ghost.time)}</strong></li>}</ol>
                    : <p>{s.tutorial ? 'Gas, steer, handbrake, then follow the pace notes home.' : `You start fourth of six. ${crews[s.setup.crew].team} against five rival crews.`}</p>}
                <p className={styles.small}>{controlsHelp}</p>
                <div className={styles.actions}><button className={styles.secondary} onClick={onExit}>BACK</button><button className={styles.primary} data-autofocus onClick={begin}>{stageMode ? 'START STAGE' : 'TO THE GRID'} →</button></div>
            </Dialog>}
            {phase === 'paused' && <Dialog title="PAUSED"><p>The clock is stopped.</p><div className={styles.actions}><button className={styles.secondary} onClick={() => setConfirm(true)}>QUIT</button><button className={styles.secondary} onClick={onRestart}>RESTART</button><button className={styles.primary} data-autofocus onClick={togglePause}>RESUME →</button></div></Dialog>}
            {confirm && <Dialog title="LEAVE THIS RUN?" onClose={() => setConfirm(false)}><p>{stageMode ? 'This run will not count. Your best times are already saved.' : 'Leaving now records this race as retired.'}</p><div className={styles.actions}><button className={styles.secondary} onClick={() => setConfirm(false)}>KEEP DRIVING</button><button className={styles.primary} onClick={quit}>LEAVE</button></div></Dialog>}
            {phase === 'finished' && result && <Dialog title={finishTitle} wide={!stageMode}>
                <div className={stageMode ? styles.resultStage : styles.resultGrid}>
                    <div className={styles.result}>
                        <div className={styles.resultMain}>
                            <strong>{stageMode ? timeLabel(p.finish ?? s.raceClock) : `P${result.position}`}</strong>
                            <span>{stage.name.toUpperCase()} · {stageMode ? 'STAGE ATTACK' : `RALLYCROSS · ${s.setup.laps} LAPS`}</span>
                            {improved && <em className={styles.good}>NEW BEST{prior !== null ? ` ${deltaLabel(p.finish! - prior)}` : ''}</em>}
                            {stageMode && !improved && prior !== null && p.finish !== null && <em className={styles.bad}>{deltaLabel(p.finish - prior)} TO YOUR BEST</em>}
                        </div>
                        {result.medal && <div className={styles.stamp}><MedalBadge medal={result.medal} size="large" /></div>}
                    </div>
                    {stageMode && !s.tutorial && <ol className={styles.introTargets}>{(['gold', 'silver', 'bronze'] as const).map(m => <li key={m} className={result.medal === m ? styles.on : ''}><MedalBadge medal={m} /><strong>{timeLabel(stage.targets[m])}</strong></li>)}</ol>}
                    {!stageMode && <table className={styles.table}><thead><tr><th>POS</th><th>CREW</th><th>TIME</th></tr></thead><tbody>{result.classification.map(row => <tr key={row.name} className={row.name === 'You' ? styles.you : ''}><td>{row.position}</td><td><i style={{ background: crews[row.crew].body, borderColor: crews[row.crew].stripe }} />{row.name}<small>{crews[row.crew].team}</small></td><td>{row.position === 1 ? timeLabel(row.time) : row.gap !== null ? `+${row.gap.toFixed(2)}${row.status === 'Running' ? '*' : ''}` : row.status}</td></tr>)}</tbody></table>}
                </div>
                {!stageMode && result.classification.some(r => r.status === 'Running') && <p className={styles.small}>* Still running at the flag: projected from their pace.</p>}
                {store.status && <p role="status" className={styles.small}>{store.status}</p>}
                <div className={styles.actions}>
                    <button className={styles.secondary} onClick={onExit}>MENU</button>
                    {!s.tutorial && <button className={styles.secondary} onClick={onNext}>NEXT: {getStage(nextStage(stage.id)).name.toUpperCase()}</button>}
                    <button className={styles.primary} data-autofocus onClick={onRestart}>{s.tutorial ? 'AGAIN' : 'RETRY'} ↻</button>
                </div>
            </Dialog>}
            <div className={styles.rotate}><strong>TURN TO LANDSCAPE</strong><p>Rally Dash needs the full width of your screen.</p><button className={styles.primary} onClick={() => { pauseSession(s); onExit(); }}>BACK TO MENU</button></div>
        </div>
    </main>;
}
