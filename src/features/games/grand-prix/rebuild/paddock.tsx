'use client';

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { racingTeams } from '@/mocks/games/grand-prix-racing';
import { carSvg } from './art';
import { timeLabel, type Circuit, type Setup } from './contracts';
import { circuits, getCircuit } from './geometry';
import type { RacingStore } from './persistence';
import { paintCircuit } from './renderer';
import './paddock.css';

type Stage = 'car' | 'track' | 'distance' | 'difficulty' | 'options' | 'ready';
const raceStages: Stage[] = ['car', 'track', 'distance', 'difficulty', 'options', 'ready'];
const trialStages: Stage[] = ['car', 'track', 'options', 'ready'];
const stageNames: Record<Stage, string> = { car: 'Car', track: 'Track', distance: 'Distance', difficulty: 'Difficulty', options: 'Driving', ready: 'Ready' };
const stageCopy: Record<Stage, [string, string]> = {
    car: ['PICK YOUR MACHINE.', 'Ten teams. Equal machinery. Choose the colours you want to take to the grid.'],
    track: ['FIND YOUR NEXT CORNER.', 'Five circuits. Five different challenges. Where are we racing?'],
    distance: ['HOW FAR WILL YOU GO?', 'A short sprint or a longer battle. Make every lap count.'],
    difficulty: ['SET THE CHALLENGE.', 'Choose the pace of the drivers you will be racing against.'],
    options: ['MAKE IT YOUR DRIVE.', 'Dial in your assists, then get ready to hit the circuit.'],
    ready: ['YOU ARE GOOD TO GO.', 'Your machine is ready. Your circuit is set. The next move is yours.'],
};

function Car({ team }: { team: number }) {
    return <div className="gp-car-art" role="img" aria-label={`${racingTeams[team].name} Formula car`} dangerouslySetInnerHTML={{ __html: carSvg(team) }} />;
}

function CircuitArt({ track }: { track: Circuit }) {
    const ref = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const ctx = ref.current?.getContext('2d');
        if (!ctx) return;
        const b = track.bounds, scale = Math.min(1000 / b.width, 700 / b.height);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, 1000, 700);
        ctx.translate((1000 - b.width * scale) / 2, (700 - b.height * scale) / 2);
        ctx.scale(scale, scale);
        ctx.translate(-b.x, -b.y);
        paintCircuit(ctx, track);
    }, [track]);
    return <canvas ref={ref} width="1000" height="700" role="img" aria-label={`${track.name} overhead preview`} />;
}

function Toggle({ label, detail, checked, onChange }: { label: string; detail: string; checked: boolean; onChange: (value: boolean) => void }) {
    return <label className="gp-option"><span><strong>{label}</strong><small>{detail}</small></span><input type="checkbox" checked={checked} onChange={event => onChange(event.target.checked)} /></label>;
}

function Choice({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: ReactNode }) {
    return <button className={`gp-choice ${selected ? 'selected' : ''}`} aria-pressed={selected} onClick={onClick}>{children}<span className="gp-choice-check" aria-hidden="true">{selected ? '✓' : '+'}</span></button>;
}

type PaddockProps = {
    title: string;
    setup: Setup;
    store: RacingStore;
    warning: string;
    onChange: (patch: Partial<Setup>) => void;
    onLaunch: () => void;
    onHelp: () => void;
};

export function Paddock({ title, setup, store, warning, onChange, onLaunch, onHelp }: PaddockProps) {
    const router = useRouter();
    const [page, setPage] = useState<'home' | 'setup' | 'records' | 'settings'>('home');
    const [stage, setStage] = useState<Stage>('car');
    const heading = useRef<HTMLHeadingElement>(null);
    const main = useRef<HTMLElement>(null);
    const mounted = useRef(false);
    const track = getCircuit(setup.circuit), team = racingTeams[setup.team];
    const stages = setup.mode === 'race' ? raceStages : trialStages;
    const index = stages.indexOf(stage);
    const modeLabel = setup.mode === 'race' ? 'QUICK RACE' : 'TIME TRIAL';
    const teamStyle = { '--team-color': team.color } as CSSProperties;

    useEffect(() => {
        if (!mounted.current) { mounted.current = true; return; }
        heading.current?.focus({ preventScroll: true });
        main.current?.scrollIntoView({ block: 'start' });
    }, [page, stage]);

    const begin = (mode: Setup['mode']) => {
        onChange({ mode, ...(mode === 'trial' ? { strategy: false, qualifying: false } : {}) });
        setStage('car');
        setPage('setup');
    };
    const back = () => {
        if (page === 'home') router.push('/games/motorsport');
        else if (page !== 'setup' || index === 0) setPage('home');
        else setStage(stages[index - 1]);
    };
    const settings = <div className="gp-preferences">
        <Toggle label="Mute all sounds" detail="Keep the circuit quiet." checked={setup.muted} onChange={muted => onChange({ muted })} />
        {(['engineVolume', 'effectsVolume'] as const).map(key => <label className="gp-preference" key={key}><span>{key === 'engineVolume' ? 'Engine volume' : 'Effects volume'} <output>{Math.round(setup[key] * 100)}%</output></span><input type="range" min="0" max="1" step=".05" value={setup[key]} onChange={e => onChange({ [key]: Number(e.target.value) })} /></label>)}
        <label className="gp-preference"><span>Touch button size <output>{setup.touchSize}px</output></span><input type="range" min="48" max="88" step="4" value={setup.touchSize} onChange={e => onChange({ touchSize: Number(e.target.value) })} /></label>
        <label className="gp-preference"><span>Touch button opacity <output>{Math.round(setup.touchOpacity * 100)}%</output></span><input type="range" min=".2" max="1" step=".05" value={setup.touchOpacity} onChange={e => onChange({ touchOpacity: Number(e.target.value) })} /></label>
        <p className="gp-small-note">WASD / arrows to drive · Escape to pause · R to recover.</p>
    </div>;

    return <main ref={main} className={`gp-game gp-lobby gp-paddock ${page === 'home' ? 'gp-home' : ''}`} aria-label={title}>
        <header className="gp-header"><button className="gp-back" onClick={back}>← <span>{page === 'home' ? 'MOTORSPORT' : page === 'setup' && index > 0 ? 'PREVIOUS STEP' : 'BACK TO HOME'}</span></button><span className="gp-wordmark">GP<span>DASH</span><i /></span><button onClick={() => setPage(page === 'settings' ? 'home' : 'settings')} aria-label="Open racing settings">SETTINGS</button></header>
        {warning && <p className="gp-warning" role="status">{warning}</p>}

        {page === 'home' ? <>
            <section className="gp-landing-hero" style={teamStyle}>
                <div className="gp-landing-copy"><p className="gp-kicker">PICK A MODE. OWN THE CIRCUIT.</p><h1 ref={heading} tabIndex={-1}>GRAND PRIX<br /><em>DASH.</em></h1><p>Find your line.<br /><strong>Make your move.</strong></p><span className="gp-landing-spec">10 TEAMS <i /> 5 CIRCUITS <i /> YOUR RACE</span></div>
                <div className="gp-landing-machine" aria-hidden="true"><span className="gp-speed-line">FULL SEND</span><span className="gp-landing-road" /><Car team={setup.team} /><span className="gp-landing-car-name">{team.name}<small>FORMULA CLASS / {String(setup.team + 1).padStart(2, '0')}</small></span></div>
            </section>
            <div className="gp-mode-cards" aria-label="Choose a game mode">
                <button className="gp-mode-card" onClick={() => begin('race')}><span className="gp-mode-top">01 / WHEEL TO WHEEL <span aria-hidden="true">↗</span></span><h2>QUICK RACE</h2><p>20 cars. One finish line.</p><span className="gp-mode-action">BUILD YOUR RACE <span aria-hidden="true">→</span></span></button>
                <button className="gp-mode-card gp-mode-trial" onClick={() => begin('trial')}><span className="gp-mode-top">02 / AGAINST THE CLOCK <span aria-hidden="true">↗</span></span><h2>TIME TRIAL</h2><p>A clear circuit. A new personal best.</p><span className="gp-mode-action">CHASE YOUR BEST <span aria-hidden="true">→</span></span></button>
            </div>
        </> : page === 'setup' ? <>
            <nav className="gp-journey" aria-label="Race setup progress"><span>{modeLabel}</span><ol>{stages.map((item, n) => <li key={item} aria-current={stage === item ? 'step' : undefined}><button disabled={n > index} onClick={() => setStage(item)} aria-label={`Step ${n + 1}: ${stageNames[item]}`}><b>{n < index ? '✓' : String(n + 1).padStart(2, '0')}</b><span>{stageNames[item]}</span></button></li>)}</ol></nav>
            <section className="gp-step" aria-labelledby="gp-stage-title">
                <div className="gp-step-heading"><p className="gp-kicker">{String(index + 1).padStart(2, '0')} / {String(stages.length).padStart(2, '0')} · {modeLabel}</p><h1 id="gp-stage-title" ref={heading} tabIndex={-1}>{stageCopy[stage][0]}</h1><p>{stageCopy[stage][1]}</p></div>
                <div key={stage} className={`gp-step-body gp-step-${stage}`}>
                    {stage === 'car' && <>
                        <div className="gp-showcase" style={teamStyle}><span className="gp-showcase-number">{String(setup.team + 1).padStart(2, '0')}</span><Car team={setup.team} /><div><span className="gp-kicker">YOUR MACHINE</span><h2>{team.name}</h2><p>Same performance. Your signature.</p></div><div className="gp-cycle"><button aria-label="Previous car" onClick={() => onChange({ team: (setup.team + 9) % 10 })}>←</button><span>{setup.team + 1} / 10</span><button aria-label="Next car" onClick={() => onChange({ team: (setup.team + 1) % 10 })}>→</button></div></div>
                        <div className="gp-car-picks" aria-label="Choose car">{racingTeams.map((t, n) => <button key={t.id} className={setup.team === n ? 'selected' : ''} aria-pressed={setup.team === n} onClick={() => onChange({ team: n })} style={{ '--team-color': t.color } as CSSProperties}><Car team={n} /><span>{t.name}</span><small>{setup.team === n ? 'SELECTED ✓' : `CAR ${String(n + 1).padStart(2, '0')}`}</small></button>)}</div>
                    </>}
                    {stage === 'track' && <>
                        <div className="gp-circuit-showcase"><CircuitArt track={track} /><div><p className="gp-kicker">{track.region}</p><h2>{track.name}</h2><p>{track.description}</p><span>{(track.length / 1000).toFixed(2)} KM · {['', 'FLOWING', 'TECHNICAL', 'DEMANDING'][track.difficulty]} · BEST {timeLabel(store.best(setup)?.best)}</span></div></div>
                        <div className="gp-track-picks" aria-label="Choose track">{circuits.map((t, n) => <Choice key={t.id} selected={setup.circuit === t.id} onClick={() => onChange({ circuit: t.id })}><small>CIRCUIT 0{n + 1}</small><strong>{t.name}</strong><span>{(t.length / 1000).toFixed(2)} KM</span></Choice>)}</div>
                    </>}
                    {stage === 'distance' && <div className="gp-big-choices">{([3, 5, 10] as const).map((laps, n) => <Choice key={laps} selected={setup.laps === laps} onClick={() => onChange({ laps, ...(laps !== 10 ? { strategy: false } : {}) })}><span className="gp-choice-eyebrow">{['A QUICK BLAST', 'FIND YOUR RHYTHM', 'PLAY THE LONG GAME'][n]}</span><b className="gp-big-number">{laps}<small>LAPS</small></b><strong>{['SPRINT', 'GRAND PRIX', 'ENDURANCE'][n]}</strong><p>{['Straight into the action.', 'More room to make your move.', 'Longer battles. Optional tyre strategy.'][n]}</p></Choice>)}</div>}
                    {stage === 'difficulty' && <div className="gp-big-choices">{(['club', 'sport', 'expert'] as const).map((difficulty, n) => <Choice key={difficulty} selected={setup.difficulty === difficulty} onClick={() => onChange({ difficulty })}><span className="gp-difficulty-bars" aria-hidden="true">{[0, 1, 2].map(bar => <i key={bar} className={bar <= n ? 'lit' : ''} />)}</span><strong>{difficulty.toUpperCase()}</strong><p>{['A gentler field. Learn the circuit and build confidence.', 'A competitive grid. Make your overtakes count.', 'A demanding pace. Bring your best racing line.'][n]}</p><small>{['SETTLE IN', 'STEP IT UP', 'PUSH YOUR LIMIT'][n]}</small></Choice>)}</div>}
                    {stage === 'options' && <div className="gp-options-grid"><div className="gp-option-panel"><h2>DRIVING ASSISTS</h2><Toggle label="Auto throttle" detail="Accelerates for you. Focus on steering and braking." checked={setup.autoThrottle} onChange={autoThrottle => onChange({ autoThrottle })} /><Toggle label="Braking assistance" detail="Helps you slow down before corners." checked={setup.brakeAssist} onChange={brakeAssist => onChange({ brakeAssist })} /><Toggle label="Racing-line guide" detail="Shows a suggested route around the circuit." checked={setup.guide} onChange={guide => onChange({ guide })} /><p className="gp-small-note">Time Trial records are separated by throttle and braking assists.</p></div><div className="gp-option-panel"><h2>{setup.mode === 'race' ? 'RACE RULES' : 'JUST YOU. YOUR GHOST.'}</h2>{setup.mode === 'race' ? <><Toggle label="Qualifying" detail="Three minutes to earn your grid position." checked={setup.qualifying} onChange={qualifying => onChange({ qualifying })} /><Toggle label="Tyre strategy" detail="Sets 10 laps. One mandatory pit stop." checked={setup.strategy} onChange={strategy => onChange({ strategy, ...(strategy ? { laps: 10 } : {}) })} />{setup.strategy && <fieldset className="gp-tyre-picks"><legend>Starting tyres</legend>{(['soft', 'medium', 'hard'] as const).map(compound => <button key={compound} className={setup.compound === compound ? 'selected' : ''} aria-pressed={setup.compound === compound} onClick={() => onChange({ compound })}>{compound.toUpperCase()}</button>)}</fieldset>}</> : <p className="gp-trial-note">No opponents. No lap limit. Your best clean lap comes back as a ghost to chase. End the session whenever you are ready.</p>}<details className="gp-extra-settings"><summary>Sound & touch controls</summary>{settings}</details></div></div>}
                    {stage === 'ready' && <div className="gp-ready-grid"><div className="gp-ready-art" style={teamStyle}><CircuitArt track={track} /><Car team={setup.team} /><span className="gp-kicker">{modeLabel} / READY</span></div><div className="gp-race-ticket"><p className="gp-kicker">YOUR SESSION TICKET</p><h2>{track.name}</h2><dl><div><dt>Car</dt><dd>{team.name}</dd><button onClick={() => setStage('car')}>Edit car</button></div><div><dt>Track</dt><dd>{track.name}</dd><button onClick={() => setStage('track')}>Edit track</button></div>{setup.mode === 'race' ? <><div><dt>Distance</dt><dd>{setup.laps} laps{setup.strategy ? ' · one stop' : ''}</dd><button onClick={() => setStage('distance')}>Edit distance</button></div><div><dt>Difficulty</dt><dd>{setup.difficulty}</dd><button onClick={() => setStage('difficulty')}>Edit difficulty</button></div><div><dt>Grid</dt><dd>{setup.qualifying ? '3-minute qualifying' : 'Start P10 / 20 cars'}</dd></div></> : <div><dt>Session</dt><dd>Unlimited laps · solo + best-lap ghost</dd></div>}<div><dt>Assists</dt><dd>{[setup.autoThrottle && 'Auto throttle', setup.brakeAssist && 'Brake assist', setup.guide && 'Racing line'].filter(Boolean).join(' · ') || 'All off'}</dd><button onClick={() => setStage('options')}>Edit driving</button></div></dl><p className="gp-small-note">{setup.strategy ? `Starting on ${setup.compound} tyres. Remember your mandatory stop.` : setup.mode === 'race' ? 'Brake before the corner. Commit on the exit.' : 'Keep it clean. Leaving the track invalidates the lap.'}</p></div></div>}
                </div>
                <div className="gp-step-actions"><button className="gp-secondary" onClick={back}>← {index === 0 ? 'CHANGE MODE' : 'BACK'}</button><p>{stage === 'ready' ? 'SEE YOU AT THE START LINE.' : 'YOUR SELECTIONS ARE SAVED AS YOU GO.'}</p><button className="gp-primary" onClick={() => stage === 'ready' ? onLaunch() : setStage(stages[index + 1])}>{stage === 'ready' ? setup.mode === 'race' ? 'START RACE' : 'START TIME TRIAL' : `CONTINUE · ${stageNames[stages[index + 1]].toUpperCase()}`} <span aria-hidden="true">→</span></button></div>
            </section>
        </> : page === 'settings' ? <section className="gp-utility"><p className="gp-kicker">MAKE YOURSELF COMFORTABLE</p><h1 ref={heading} tabIndex={-1}>SOUND & CONTROLS.</h1>{settings}<button className="gp-primary" onClick={() => setPage('home')}>BACK TO HOME →</button></section> : <section className="gp-utility gp-records"><p className="gp-kicker">YOUR OWN RACING HISTORY</p><h1 ref={heading} tabIndex={-1}>LOCAL RECORDS.</h1><p>Best clean laps for your current throttle and braking assists.</p><div className="gp-record-grid">{circuits.map(t => <article key={t.id}><h3>{t.name}</h3><strong>{timeLabel(store.best({ ...setup, circuit: t.id })?.best)}</strong></article>)}</div><h2>RECENT SESSIONS</h2>{store.data.recent.length ? <div className="gp-recent">{store.data.recent.map(r => <p key={r.id}><span>{getCircuit(r.circuit).name}</span><span>{r.mode === 'trial' ? 'TIME TRIAL' : `P${r.position} / ${r.fieldSize}`}</span><span>{timeLabel(r.bestLap)}</span><span>{r.laps} laps</span></p>)}</div> : <p>Your completed sessions will appear here.</p>}</section>}

        <footer className="gp-footer"><span>ORIGINAL TEAMS. PURE CIRCUIT RACING.</span><div><button onClick={onHelp}>HOW TO DRIVE ↗</button><button onClick={() => setPage('records')}>LOCAL RECORDS ↗</button></div></footer>
    </main>;
}
