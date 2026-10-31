'use client';
import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode, type PointerEvent } from 'react';
import type { GameLauncherProps } from '../../components/game-launcher';
import { racingTeams } from '@/mocks/games/grand-prix-racing';
import { RaceAudio } from './audio';
import { STEP, timeLabel, type Circuit, type Compound, type Session, type Setup } from './contracts';
import { RaceInput } from './input';
import { browserStore, type RacingStore } from './persistence';
import { RaceRenderer } from './renderer';
import { Paddock } from './paddock';
import { createSession, endQualifying, finishSession, orderedCars, pauseSession, recover, requestPit, resumeSession, startSession, step, toggleMute } from './simulation';
import './racing.css';
export type GrandPrixProps = GameLauncherProps;
export function TrackMap({ track, small = false, player }: {
    track: Circuit;
    small?: boolean;
    player?: {
        x: number;
        y: number;
    };
}) { const b = track.bounds; return <svg className={small ? 'gp-map small' : 'gp-map'} viewBox={`${b.x} ${b.y} ${b.width} ${b.height}`} role="img" aria-label={`${track.name} circuit outline`}><path d={`${track.points.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')}Z`} fill="none" stroke="currentColor" strokeWidth={small ? 14 : 18} strokeLinejoin="round"/>{player && <circle cx={player.x} cy={player.y} r={20} fill="#e44036" stroke="#fff6dc" strokeWidth="5"/>}</svg>; }
function Dialog({ title, children, onClose }: {
    title: string;
    children: ReactNode;
    onClose?: () => void;
}) {
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const previous = document.activeElement;
        const root = ref.current;
        root?.querySelector<HTMLElement>('button,input,select')?.focus();
        return () => {
            if (previous instanceof HTMLElement && previous.isConnected)
                previous.focus();
        };
    }, []);
    return <div className="gp-scrim"><section ref={ref} role="dialog" aria-modal="true" aria-label={title} className="gp-dialog" onKeyDown={e => {
            if (e.key === 'Escape' && onClose) {
                e.stopPropagation();
                onClose();
            }
            if (e.key === 'Tab') {
                const items = Array.from(e.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled),input,select,a[href]'));
                const first = items[0], last = items.at(-1);
                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last?.focus();
                }
                else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first?.focus();
                }
            }
        }}><header><h2>{title}</h2>{onClose && <button aria-label="Close" onClick={onClose}>×</button>}</header>{children}</section></div>;
}
export function GrandPrix(props: GrandPrixProps) {
    const [store] = useState(browserStore);
    const [setup, setSetup] = useState<Setup>(() => store.data.setup);
    const [session, setSession] = useState<Session | null>(null);
    const [help, setHelp] = useState(false);
    const [warning, setWarning] = useState('');
    const change = (patch: Partial<Setup>) => {
        const next = { ...setup, ...patch };
        store.settings(next);
        setSetup({ ...store.data.setup });
        setWarning(store.status);
    };
    const launch = (tutorial = false) => {
        const selected = { ...setup, mode: tutorial ? 'trial' as const : setup.mode, strategy: !tutorial && setup.mode === 'race' && setup.strategy, qualifying: !tutorial && setup.mode === 'race' && setup.qualifying };
        setSession(createSession(selected, Math.floor(Math.random() * 0xffffffff), crypto.randomUUID(), store.best(selected)?.ghost ?? null, tutorial));
    };
    const leave = useCallback(() => { setSession(null); setSetup({ ...store.data.setup }); setWarning(store.status); }, [store]);
    if (session)
        return <RaceScreen key={session.id} session={session} store={store} onExit={leave} onRestart={() => launch(session.tutorial)}/>;
    return <>
        <Paddock title={props.entry.title} setup={setup} store={store} warning={warning || store.status} onChange={change} onLaunch={() => launch()} onHelp={() => setHelp(true)} />
        {help && <div className="gp-game gp-help"><Dialog title="FIND YOUR LINE" onClose={() => setHelp(false)}><p>Accelerate along the straight. Brake before turning, then feed the throttle back in as the road opens.</p><p>Use arrows or WASD on a keyboard. On touch screens, hold a steering button and a pedal together.</p><p>Follow the circuit in order. Leaving the racing surface invalidates Time Trial laps. R recovers a stranded car and invalidates that lap.</p><p>With strategy enabled, request a pit stop before entry. The limiter and crew take control in the lane for a three-second tyre change.</p><div className="gp-dialog-actions"><button className="gp-secondary" onClick={() => setHelp(false)}>GOT IT</button><button className="gp-primary" onClick={() => { setHelp(false); launch(true); }}>START DRIVING TUTORIAL →</button></div></Dialog></div>}
    </>;
}

function Hold({ action, label, children, input }: {
    action: string;
    label: string;
    children: ReactNode;
    input: RaceInput;
}) { const [held, setHeld] = useState(false); const current = input.read(); const pressed = held || (action === 'left' ? current.steer < 0 : action === 'right' ? current.steer > 0 : action === 'throttle' ? current.throttle : current.brake); const release = (e: PointerEvent<HTMLButtonElement>) => { input.hold(`pointer:${e.pointerId}`, action, false); setHeld(false); }; return <button className={`gp-hold ${pressed ? 'held' : ''} ${action}`} aria-label={label} onContextMenu={e => e.preventDefault()} onPointerDown={e => { e.preventDefault(); e.currentTarget.setPointerCapture(e.pointerId); input.hold(`pointer:${e.pointerId}`, action, true); setHeld(true); }} onPointerUp={release} onPointerCancel={release} onLostPointerCapture={release}>{children}</button>; }
function RaceScreen({ session: s, store, onExit, onRestart }: {
    session: Session;
    store: RacingStore;
    onExit: () => void;
    onRestart: () => void;
}) {
    const canvas = useRef<HTMLCanvasElement>(null), audio = useRef<RaceAudio | null>(null);
    const [input] = useState(() => new RaceInput());
    const [, repaint] = useState(0);
    const [error, setError] = useState('');
    const [compound, setCompound] = useState<Compound>(s.cars[0].nextCompound);
    const [confirmExit, setConfirmExit] = useState(false);
    const sound = () => {
        if (!audio.current)
            audio.current = new RaceAudio();
        audio.current.start();
    };
    const changePhase = () => {
        input.clear();
        if (s.phase === 'paused') {
            sound();
            resumeSession(s);
        }
        else
            pauseSession(s);
        repaint(n => n + 1);
    };
    useEffect(() => {
        const target = canvas.current;
        if (!target)
            return;
        let renderer: RaceRenderer;
        try {
            renderer = new RaceRenderer(target, s.track);
        }
        catch {
            setTimeout(() => setError('Your browser could not start the circuit renderer. Try reloading or use another browser.'), 0);
            return;
        }
        let request = 0, last = 0, accumulator = 0, lastHud = 0;
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
        const frame = (now: number) => {
            const dt = last ? Math.min(.1, (now - last) / 1000) : 0;
            last = now;
            accumulator += dt;
            while (accumulator >= STEP) {
                step(s, input.read());
                audio.current?.events(s.events);
                store.collect(s);
                accumulator -= STEP;
            }
            audio.current?.update(s.cars[0].speed, s.setup, s.phase === 'running' || s.phase === 'qualifying');
            renderer.render(s, accumulator / STEP, dt, reduced.matches);
            if (now - lastHud > 90) {
                repaint(n => n + 1);
                lastHud = now;
            }
            request = requestAnimationFrame(frame);
        };
        const keys: Record<string, string> = { ArrowLeft: 'left', KeyA: 'left', ArrowRight: 'right', KeyD: 'right', ArrowUp: 'throttle', KeyW: 'throttle', ArrowDown: 'brake', KeyS: 'brake' };
        const down = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLElement && ['INPUT', 'SELECT'].includes(e.target.tagName))
                return;
            if (e.code === 'Escape' && !e.repeat) {
                e.preventDefault();
                input.clear();
                if (s.phase === 'paused')
                    resumeSession(s);
                else
                    pauseSession(s);
                repaint(n => n + 1);
            }
            if (e.code === 'KeyR' && !e.repeat && (s.phase === 'running' || s.phase === 'qualifying'))
                recover(s);
            if (keys[e.code] && (s.phase === 'running' || s.phase === 'qualifying' || s.phase === 'countdown')) {
                e.preventDefault();
                input.hold(e.code, keys[e.code], true);
            }
        };
        const up = (e: KeyboardEvent) => {
            if (keys[e.code])
                input.hold(e.code, keys[e.code], false);
        };
        const interrupt = () => { input.clear(); pauseSession(s); last = 0; accumulator = 0; audio.current?.update(0, s.setup, false); repaint(n => n + 1); };
        const hidden = () => {
            if (document.hidden)
                interrupt();
        };
        window.addEventListener('keydown', down);
        window.addEventListener('keyup', up);
        window.addEventListener('blur', interrupt);
        document.addEventListener('visibilitychange', hidden);
        request = requestAnimationFrame(frame);
        return () => { cancelAnimationFrame(request); input.clear(); audio.current?.dispose(); window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); window.removeEventListener('blur', interrupt); document.removeEventListener('visibilitychange', hidden); };
    }, [s, input, store]);
    const player = s.cars[0], ordered = orderedCars(s), position = ordered.indexOf(player) + 1, active = s.phase === 'running' || s.phase === 'qualifying';
    const quit = () => {
        if (s.phase !== 'finished') {
            finishSession(s, s.setup.mode === 'race');
            store.collect(s);
        }
        onExit();
    };
    const best = store.best(s.setup), current = s.raceClock - player.lapStart;
    const splitDelta = s.lastSector !== null && best ? s.lastSector - best.sectors[player.sectors.length - 1] : null;
    return <main className="gp-game gp-race" style={{ '--touch-size': `${s.setup.touchSize}px`, '--touch-opacity': s.setup.touchOpacity } as CSSProperties}>
  <header className="gp-race-header"><span className="gp-wordmark">GP<span>DASH</span></span><strong>{s.tutorial ? 'DRIVING TUTORIAL' : s.phase === 'qualifying' ? `QUALIFYING ${timeLabel(s.qualRemaining)}` : s.setup.mode === 'trial' ? 'TIME TRIAL' : `LAP ${Math.min(s.setup.laps, player.laps + 1)} / ${s.setup.laps}`}</strong><span>{s.track.name}</span><button onClick={() => { toggleMute(s); store.settings({ ...store.data.setup, muted: s.setup.muted }); repaint(n => n + 1); }} aria-label={s.setup.muted ? 'Unmute audio' : 'Mute audio'}>{s.setup.muted ? 'SOUND OFF' : 'SOUND ON'}</button><button onClick={changePhase} disabled={s.phase === 'finished' || s.phase === 'grid'} aria-label={s.phase === 'paused' ? 'Resume race' : 'Pause race'}>Ⅱ</button></header>
  <div className="gp-playfield"><canvas ref={canvas} aria-label="Live overhead circuit racing" role="img"/>
   <div className="gp-race-position"><strong>{s.setup.mode === 'trial' ? timeLabel(current) : `P${position}`}</strong><span>{s.setup.mode === 'trial' ? (player.valid ? 'CURRENT LAP' : 'INVALID LAP') : `OF ${s.cars.length}`}</span></div>
   <div className="gp-timing"><p><span>BEST LAP</span><strong>{timeLabel(best?.best ?? player.best)}</strong></p><p><span>{s.setup.mode === 'trial' ? 'LAST LAP' : 'LAP TIME'}</span><strong>{timeLabel(s.setup.mode === 'trial' ? player.lapTimes.at(-1) : current)}</strong></p>{splitDelta !== null && Number.isFinite(splitDelta) && <p className={splitDelta <= 0 ? 'faster' : 'slower'}><span>SECTOR {player.sectors.length}</span><strong>{splitDelta > 0 ? '+' : ''}{splitDelta.toFixed(3)}</strong></p>}</div>
   <div className="gp-mini"><TrackMap track={s.track} small player={player}/><span>{player.valid ? 'CLEAN LAP' : 'LAP INVALID'}</span></div>
   {s.setup.mode === 'race' && <div className="gp-order">{ordered.slice(0, 4).map((c, i) => <p key={c.id} className={!c.id ? 'you' : ''}><span>{i + 1}</span><i style={{ background: racingTeams[c.team].color }}/><span>{c.name}</span></p>)}</div>}
   {s.notice && s.clock < s.noticeUntil && active && <div className="gp-notice" role="status">{s.notice}</div>}
   {s.tutorial && active && <div className="gp-tutorial"><strong>0{Math.min(4, s.tutorialStep + 1)} / 04</strong><span>{['Hold W / ↑ or the accelerator to build speed.', 'Hold A / D or the arrows to steer into the bend.', 'Press S / ↓ or the brake pedal to slow down.', 'Complete a clean lap. Brake before corners and follow the circuit.'][s.tutorialStep]}</span></div>}
   {player.inPit && active && <div className="gp-pit-message"><strong>{player.service > 0 && !player.serviced ? 'TYRE CHANGE' : 'PIT LIMITER'}</strong><span>{player.service > 0 && !player.serviced ? `${Math.max(0, 3 - player.service).toFixed(1)}s` : '50 KM/H'}</span></div>}
   {s.phase === 'countdown' && <div className="gp-lights" aria-label={`Race starts in ${Math.ceil(s.countdown)} seconds`}>{[0, 1, 2, 3, 4].map(i => <i className={3 - s.countdown > i * .45 ? 'on' : ''} key={i}/>)}</div>}
   {error && <Dialog title="CIRCUIT UNAVAILABLE"><p role="alert">{error}</p><button className="gp-primary" onClick={onExit}>RETURN TO PADDOCK</button></Dialog>}
   {!error && s.phase === 'grid' && <Dialog title={s.setup.mode === 'trial' ? 'YOUR NEXT BEST LAP.' : `ON THE GRID · P${s.grid}`}><p className="gp-kicker">{s.track.name} · {s.setup.mode === 'trial' ? 'OPEN PRACTICE' : `${s.setup.laps} LAPS · 20 CARS`}</p><TrackMap track={s.track} small/><p>{s.tutorial ? 'Follow four driving exercises on a clear circuit.' : s.setup.qualifying ? 'Three minutes to set your fastest clean lap. The race grid follows your qualifying time.' : s.cars.some(c => c.qualBest !== null) ? 'Qualifying complete. Your grid position is ready.' : 'Brake before the corner. Find space on the exit.'}</p>{s.cars.some(c => c.qualBest !== null) && <div className="gp-qual-results">{[...s.cars].sort((a, b) => (a.qualBest ?? Infinity) - (b.qualBest ?? Infinity)).map((c, i) => <p key={c.id}><span>P{i + 1} {c.name}</span><strong>{timeLabel(c.qualBest)}</strong></p>)}</div>}<div className="gp-dialog-actions"><button className="gp-secondary" onClick={onExit}>BACK</button><button className="gp-primary" onClick={() => { sound(); startSession(s); repaint(n => n + 1); }}>{s.setup.qualifying ? 'START QUALIFYING' : 'LIGHTS OUT'} →</button></div></Dialog>}
   {s.phase === 'paused' && <Dialog title="TAKE A BREATHER."><p>Your session is paused.</p><div className="gp-dialog-actions"><button className="gp-primary" onClick={changePhase}>RESUME →</button><button className="gp-secondary" onClick={() => setConfirmExit(true)}>END SESSION</button></div><button className="gp-text" onClick={onRestart}>RESTART SESSION</button></Dialog>}
   {confirmExit && <Dialog title="END THIS SESSION?" onClose={() => setConfirmExit(false)}><p>{s.setup.mode === 'trial' ? 'Completed personal-best laps are already saved.' : 'Leaving now records this race as retired.'}</p><div className="gp-dialog-actions"><button className="gp-secondary" onClick={() => setConfirmExit(false)}>KEEP DRIVING</button><button className="gp-primary" onClick={quit}>END SESSION</button></div></Dialog>}
   {s.phase === 'finished' && s.result && <Dialog title={s.tutorial ? 'PRACTICE COMPLETE.' : s.result.status === 'disqualified' ? 'MANDATORY STOP MISSED.' : s.setup.mode === 'trial' ? 'SESSION COMPLETE.' : s.result.status === 'retired' ? 'RACE RETIRED.' : position === 1 ? 'FIRST TO THE FLAG.' : 'CHEQUERED FLAG.'}><div className="gp-result-summary"><strong>{s.setup.mode === 'trial' ? timeLabel(player.best) : `P${s.result.position}`}</strong><div><p>{s.track.name}</p><p>{player.laps} LAPS · {timeLabel(s.raceClock)}</p><p>BEST {timeLabel(player.best)} · {player.stops} STOPS</p></div></div>{s.setup.mode === 'race' && <div className="gp-classification"><table><thead><tr><th>POS</th><th>DRIVER / TEAM</th><th>BEST LAP</th><th>STATUS</th></tr></thead><tbody>{s.result.classification.map(row => <tr key={row.name} className={row.name === 'You' ? 'you' : ''}><td>{row.position}</td><td>{row.name}<small>{racingTeams[row.team].name}</small></td><td>{timeLabel(row.best)}</td><td>{row.status === 'Running' ? `${row.laps} laps` : row.status}</td></tr>)}</tbody></table></div>}{store.status && <p role="status">{store.status}</p>}<div className="gp-dialog-actions"><button className="gp-secondary" onClick={onExit}>PADDOCK</button><button className="gp-primary" onClick={onRestart}>DRIVE AGAIN →</button></div></Dialog>}
   <div className="gp-rotate"><strong>TURN TO LANDSCAPE.</strong><p>A wider circuit. A clearer racing line.</p><button className="gp-primary" onClick={() => { pauseSession(s); onExit(); }}>RETURN TO PADDOCK</button></div>
  </div>
  <footer className="gp-controls"><div className="gp-steering"><Hold action="left" label="Steer left" input={input}>◀</Hold><Hold action="right" label="Steer right" input={input}>▶</Hold></div><div className="gp-telemetry"><strong>{Math.round(player.speed * 3.6)}<small>KM/H</small></strong><span>{s.setup.strategy ? `${player.compound.toUpperCase()} · ${Math.round(player.wear * 100)}%` : 'FORMULA'}</span></div><div className="gp-race-actions"><button onClick={() => { recover(s); repaint(n => n + 1); }} disabled={!active || player.inPit}>RECOVER</button>{s.phase === 'qualifying' ? <button onClick={() => { endQualifying(s); input.clear(); repaint(n => n + 1); }}>FINISH QUALIFYING</button> : s.setup.mode === 'trial' ? <button onClick={() => { finishSession(s); store.collect(s); input.clear(); repaint(n => n + 1); }}>END SESSION</button> : s.setup.strategy && <label><select aria-label="Next pit tyre compound" value={compound} onChange={e => setCompound(e.target.value as Compound)}><option value="soft">SOFT</option><option value="medium">MEDIUM</option><option value="hard">HARD</option></select><button disabled={!active || player.inPit} className={player.pitRequested ? 'selected' : ''} onClick={() => { requestPit(s, compound); repaint(n => n + 1); }}>{player.pitRequested ? 'CANCEL PIT' : 'PIT'}</button></label>}</div><div className="gp-pedals"><Hold action="brake" label="Brake" input={input}>BRAKE</Hold><Hold action="throttle" label="Accelerate" input={input}>ACCEL</Hold></div></footer>
 </main>;
}
