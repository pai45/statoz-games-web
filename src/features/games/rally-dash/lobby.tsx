'use client';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { useRouter } from 'next/navigation';
import { carSvg } from './art';
import { crews } from './crews';
import { DEFAULT_SETUP, SURFACES, STEP, timeLabel, type Setup } from './contracts';
import { MedalBadge } from './hud';
import type { RallyStore } from './persistence';
import { RallyRenderer, stageOverview } from './renderer';
import { aiInput, createSession, startSession, step } from './simulation';
import { describeSurface, getStage, stages } from './stages';
import { Chips, Dialog, Icon, IconButton, Toggle } from './ui';
import styles from './rally.module.css';

const SURFACE_COLORS: Record<string, string> = { tarmac: '#4a4644', gravel: '#b38b5d', sand: '#e2bd84', mud: '#6b4429', snow: '#e8eef1', ice: '#9fd0e2' };

/** Live background: rival crews racing the selected stage on the real renderer, at low resolution and 30 fps. */
function Attract({ stageId, crew }: { stageId: Setup['stage']; crew: number }) {
    const ref = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const canvas = ref.current, box = canvas?.parentElement;
        if (!canvas || !box) return;
        const stage = getStage(stageId), reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        let renderer: RallyRenderer;
        try { renderer = new RallyRenderer(canvas, stage, { attract: true }); }
        catch { return; }
        renderer.camera = 'chase';
        const fresh = () => {
            const s = createSession({ ...DEFAULT_SETUP, stage: stageId, crew, mode: 'rallycross', rivals: 'legend', laps: 5 }, Math.floor(Math.random() * 1e9), 'attract');
            startSession(s);
            s.phase = 'running';
            for (let i = 0; i < 60 * 4; i++) step(s, aiInput(s, s.cars[0]));
            return s;
        };
        let s = fresh(), request = 0, last = 0, acc = 0;
        const size = () => { const r = box.getBoundingClientRect(); renderer.resize(r.width, r.height, 1); renderer.render(s, 1, 0, true); };
        size();
        const observer = new ResizeObserver(size);
        observer.observe(box);
        const frame = (now: number) => {
            const dt = last ? Math.min(.1, (now - last) / 1000) : 0;
            last = now;
            acc += dt;
            if (acc >= 1 / 30) {
                for (let i = 0; i < Math.round(acc / STEP) && i < 6; i++) { step(s, aiInput(s, s.cars[0])); renderer.events(s.events, s, true); }
                if (s.phase === 'finished') s = fresh();
                renderer.render(s, 1, acc, true);
                acc = 0;
            }
            request = requestAnimationFrame(frame);
        };
        const visibility = () => { cancelAnimationFrame(request); last = 0; if (!document.hidden && !reduced) request = requestAnimationFrame(frame); };
        if (!reduced) request = requestAnimationFrame(frame);
        document.addEventListener('visibilitychange', visibility);
        return () => { cancelAnimationFrame(request); observer.disconnect(); renderer.dispose(); document.removeEventListener('visibilitychange', visibility); };
    }, [stageId, crew]);
    return <div className={styles.attract} aria-hidden="true"><canvas ref={ref} /></div>;
}

function Car({ crew }: { crew: number }) {
    return <span className={styles.carArt} role="img" aria-label={`${crews[crew].team} rally car, number ${crews[crew].number}`} dangerouslySetInnerHTML={{ __html: carSvg(crew) }} />;
}

function StageArt({ stageId }: { stageId: Setup['stage'] }) {
    const ref = useRef<HTMLCanvasElement>(null);
    // Painted at the frame's own size and shape, so the map always fills it sharply.
    useEffect(() => {
        const canvas = ref.current, box = canvas?.parentElement;
        if (!canvas || !box) return;
        const draw = () => {
            const r = box.getBoundingClientRect(), ratio = Math.min(2, window.devicePixelRatio || 1);
            const w = Math.max(64, Math.round(r.width * ratio / 8) * 8), h = Math.max(64, Math.round(r.height * ratio / 8) * 8);
            canvas.width = w;
            canvas.height = h;
            canvas.getContext('2d')?.drawImage(stageOverview(getStage(stageId), w, h), 0, 0);
        };
        draw();
        const observer = new ResizeObserver(draw);
        observer.observe(box);
        return () => observer.disconnect();
    }, [stageId]);
    return <canvas ref={ref} className={styles.stageImage} role="img" aria-label={`${getStage(stageId).name} stage map`} />;
}

function SurfaceMix({ mix }: { mix: Partial<Record<string, number>> }) {
    const parts = SURFACES.filter(s => (mix[s] ?? 0) > .01);
    return <div className={styles.mix} aria-label={`Surfaces: ${parts.map(s => `${describeSurface[s]} ${Math.round((mix[s] ?? 0) * 100)}%`).join(', ')}`}>
        <div>{parts.map(s => <i key={s} style={{ flex: mix[s], background: SURFACE_COLORS[s] }} />)}</div>
        <p>{parts.map(s => <span key={s}><b style={{ background: SURFACE_COLORS[s] }} />{describeSurface[s]}</span>)}</p>
    </div>;
}

type LobbyProps = { title: string; setup: Setup; store: RallyStore; warning: string; onChange: (patch: Partial<Setup>) => void; onLaunch: (options?: { autostart?: boolean; tutorial?: boolean }) => void };
export function Lobby({ title, setup, store, warning, onChange, onLaunch }: LobbyProps) {
    const router = useRouter();
    const [page, setPage] = useState<'home' | 'event'>('home');
    const [sheet, setSheet] = useState<'settings' | 'records' | 'help' | null>(null);
    const [touch] = useState(() => window.matchMedia('(any-pointer: coarse)').matches), [canVibrate] = useState(() => 'vibrate' in navigator);
    const heading = useRef<HTMLHeadingElement>(null);
    const stage = getStage(setup.stage), index = stages.indexOf(stage), crew = crews[setup.crew], stageMode = setup.mode === 'stage';
    const best = store.best(setup), medals = stages.map(st => store.medal(st.id));
    const golds = medals.filter(m => m === 'gold').length, podiums = store.data.recent.filter(r => r.mode === 'rallycross' && r.position <= 3).length;
    useEffect(() => { heading.current?.focus({ preventScroll: true }); }, [page]);
    const open = (mode: Setup['mode']) => { onChange({ mode }); setPage('event'); };
    const cycle = (by: number) => onChange({ stage: stages[(index + by + stages.length) % stages.length].id });
    const modeName = stageMode ? 'STAGE ATTACK' : 'RALLYCROSS';
    return <main className={styles.lobby} aria-label={title}>
        <Attract stageId={setup.stage} crew={setup.crew} />
        <div className={styles.shade} />
        <header className={styles.lobbyTop}>
            <button type="button" className={styles.back} aria-label={page === 'home' ? 'Back to motorsport' : 'Back to modes'} onClick={() => page === 'home' ? router.push('/games/motorsport') : setPage('home')}><Icon name="back" /><span>{page === 'home' ? 'MOTORSPORT' : 'MODES'}</span></button>
            {page === 'event' && <span className={styles.miniMark} aria-hidden="true">RALLY<b>DASH</b></span>}
            <nav aria-label="Rally Dash menu"><IconButton icon="help" label="How to drive" onClick={() => setSheet('help')} /><IconButton icon="trophy" label="Records" onClick={() => setSheet('records')} /><IconButton icon="gear" label="Settings" onClick={() => setSheet('settings')} /></nav>
        </header>
        {warning && <p className={styles.warning} role="status">{warning}</p>}
        {page === 'home' ? <section className={styles.home}>
            <div className={styles.hero}>
                <h1 ref={heading} tabIndex={-1} className={styles.wordmark}>RALLY<span>DASH</span></h1>
                <p className={styles.tagline}>Slide it. Send it. Beat the clock.</p>
                <button type="button" data-primary className={styles.quick} onClick={() => onLaunch({ autostart: true })}><small>QUICK START</small><strong>{modeName} · {stage.name.toUpperCase()}</strong><span aria-hidden="true">→</span></button>
            </div>
            <div className={styles.modes}>
                <button type="button" className={`${styles.modeCard} ${styles.modeStage}`} aria-label={`Choose a Stage Attack course. ${golds ? `${golds} of 5 gold` : 'No medals yet'}`} onClick={() => open('stage')}>
                    <span className={styles.modeTag}>STAGE ATTACK</span><h2>CHOOSE STAGE</h2>
                    <span className={styles.modeFoot}>{golds ? `${golds} / 5 GOLD` : '5 STAGES'} <b aria-hidden="true">→</b></span>
                </button>
                <button type="button" className={`${styles.modeCard} ${styles.modeCross}`} aria-label={`Rallycross: six cars. ${podiums ? `${podiums} podiums` : 'First podium awaits'}`} onClick={() => open('rallycross')}>
                    <span className={styles.modeTag}>SIX CARS</span><h2>RALLYCROSS</h2>
                    <span className={styles.modeFoot}>{podiums ? `${podiums} PODIUMS` : 'FIRST PODIUM AWAITS'} <b aria-hidden="true">→</b></span>
                </button>
            </div>
        </section> : <section className={styles.event} aria-labelledby="rd-event-title">
            <div className={styles.stagePanel}>
                <div className={styles.stageArt}>
                    <StageArt stageId={setup.stage} />
                    <button type="button" className={styles.prev} aria-label="Previous stage" onClick={() => cycle(-1)}>◀</button>
                    <button type="button" className={styles.next} aria-label="Next stage" onClick={() => cycle(1)}>▶</button>
                    <span className={styles.stageCount}>{index + 1} / {stages.length}</span>
                </div>
                <div className={styles.stageInfo}>
                    <p className={styles.kicker}>{stage.region} · {'●'.repeat(stage.difficulty)}{'○'.repeat(3 - stage.difficulty)}</p>
                    <h1 id="rd-event-title" ref={heading} tabIndex={-1} className={styles.stageName}>{stage.name}</h1>
                    <p className={styles.description}>{stage.description}</p>
                    <SurfaceMix mix={stage.mix} />
                    <p className={styles.facts}><span>{(stage.length / 1000).toFixed(2)} KM</span><span>{stage.notes.filter(n => n.kind === 'jump').length} JUMP{stage.notes.filter(n => n.kind === 'jump').length === 1 ? '' : 'S'}</span><span>BEST {timeLabel(best?.best)}</span>{medals[index] && <MedalBadge medal={medals[index]} />}</p>
                </div>
                <div className={styles.stageDots} role="group" aria-label="Choose stage">{stages.map((st, i) => <button type="button" key={st.id} aria-pressed={i === index} aria-label={st.name} className={i === index ? styles.on : ''} onClick={() => onChange({ stage: st.id })}><span>{st.name}</span>{medals[i] && <MedalBadge medal={medals[i]} />}</button>)}</div>
            </div>
            <div className={styles.setupPanel}>
                <div className={styles.setupBody}>
                <p className={styles.kicker}>{modeName} · YOUR CREW</p>
                <div className={styles.crews} role="group" aria-label="Choose your crew">{crews.map((c, i) => <button type="button" key={c.id} aria-pressed={setup.crew === i} aria-label={`${c.team}, number ${c.number}`} className={setup.crew === i ? styles.on : ''} style={{ '--crew': c.body } as CSSProperties} onClick={() => onChange({ crew: i })}><Car crew={i} /></button>)}</div>
                <p className={styles.crewName}><strong>{crew.team}</strong><span>#{crew.number} · {crew.driver} / {crew.codriver}</span></p>
                {stageMode ? <ol className={styles.targetRow} aria-label="Medal times">{(['gold', 'silver', 'bronze'] as const).map(m => <li key={m}><MedalBadge medal={m} /><span>{timeLabel(stage.targets[m])}</span></li>)}</ol> : <div className={styles.raceOptions}>
                    <Chips label="LAPS" value={setup.laps} options={[{ value: 3, label: '3' }, { value: 5, label: '5' }]} onChange={laps => onChange({ laps })} />
                    <Chips label="RIVALS" value={setup.rivals} options={[{ value: 'rookie', label: 'ROOKIE' }, { value: 'pro', label: 'PRO' }, { value: 'legend', label: 'LEGEND' }]} onChange={rivals => onChange({ rivals })} />
                </div>}
                <div className={styles.assists}><Toggle label="Auto gas" checked={setup.autoThrottle} onChange={autoThrottle => onChange({ autoThrottle })} /><Toggle label="Brake assist" checked={setup.brakeAssist} onChange={brakeAssist => onChange({ brakeAssist })} /></div>
                </div>
                <button type="button" className={styles.launch} onClick={() => onLaunch()}>{stageMode ? 'START STAGE' : 'TO THE GRID'} <span aria-hidden="true">→</span></button>
            </div>
        </section>}
        {sheet === 'settings' && <Dialog title="SETTINGS" onClose={() => setSheet(null)} wide>
            <div className={styles.settings}>
                <div>
                    <Chips label="CAMERA" value={setup.camera} options={[{ value: 'chase', label: 'CHASE', detail: 'Turns with your car' }, { value: 'map', label: 'MAP', detail: 'North stays up' }]} onChange={camera => onChange({ camera })} />
                    <Toggle label="Auto gas" detail="Accelerates for you. Brake and steer." checked={setup.autoThrottle} onChange={autoThrottle => onChange({ autoThrottle })} />
                    <Toggle label="Brake assist" detail="Slows you before tight bends." checked={setup.brakeAssist} onChange={brakeAssist => onChange({ brakeAssist })} />
                    <Toggle label="Pace-note beeps" detail="A blip for every call." checked={setup.noteSounds} onChange={noteSounds => onChange({ noteSounds })} />
                    {canVibrate && <Toggle label="Vibration" detail="Feel landings, bumps and crashes." checked={setup.vibration} onChange={vibration => onChange({ vibration })} />}
                </div>
                <div>
                    <Toggle label="Mute all sound" checked={setup.muted} onChange={muted => onChange({ muted })} />
                    {(['engineVolume', 'effectsVolume'] as const).map(key => <label className={styles.range} key={key}><span>{key === 'engineVolume' ? 'Engine' : 'Effects'} <output>{Math.round(setup[key] * 100)}%</output></span><input type="range" min="0" max="1" step=".05" value={setup[key]} onChange={e => onChange({ [key]: Number(e.target.value) })} /></label>)}
                    <label className={styles.range}><span>Touch controls size <output>{setup.touchSize}px</output></span><input type="range" min="52" max="96" step="4" value={setup.touchSize} onChange={e => onChange({ touchSize: Number(e.target.value) })} /></label>
                    <label className={styles.range}><span>Touch opacity <output>{Math.round(setup.touchOpacity * 100)}%</output></span><input type="range" min=".2" max="1" step=".05" value={setup.touchOpacity} onChange={e => onChange({ touchOpacity: Number(e.target.value) })} /></label>
                </div>
            </div>
            <p className={styles.small}>Time records are kept separately for each assist combination.</p>
        </Dialog>}
        {sheet === 'records' && <Dialog title="RECORDS" onClose={() => setSheet(null)} wide>
            <div className={styles.records}>
                <ol>{stages.map((st, i) => <li key={st.id}><span>{st.name}</span><strong>{timeLabel(store.best({ ...setup, stage: st.id })?.best)}</strong><MedalBadge medal={medals[i]} /></li>)}</ol>
                <ol>{store.data.recent.length ? store.data.recent.slice(0, 6).map(r => <li key={r.id}><span>{getStage(r.stage).name}</span><strong>{r.mode === 'stage' ? timeLabel(r.best) : `P${r.position} / ${r.fieldSize}`}</strong><MedalBadge medal={r.medal} /></li>) : <li><span>Finished runs appear here.</span></li>}</ol>
            </div>
            <p className={styles.small}>Best times shown for your current assists ({[setup.autoThrottle && 'auto gas', setup.brakeAssist && 'brake assist'].filter(Boolean).join(' + ') || 'none'}). Saved on this device only.</p>
        </Dialog>}
        {sheet === 'help' && <Dialog title="HOW TO DRIVE" onClose={() => setSheet(null)} wide>
            <div className={styles.help}>
                {touch ? <p><b>Steer</b> slide your left thumb on the pad: the further from the middle, the harder you turn. <b>Brake</b> and <b>Handbrake</b> sit under your right thumb{setup.autoThrottle ? ' (auto gas is on; switch it off in Settings for a GAS pedal)' : ''}. <b>↺</b> puts you back on the road.</p>
                    : <p><b>Gas</b> W / ↑ · <b>Brake</b> S / ↓ · <b>Steer</b> A D / ← → · <b>Handbrake</b> Space · <b>Recover</b> R · <b>Pause</b> Esc · <b>Retry</b> Backspace</p>}
                <p>Loose surfaces slide. Turn in early, let the car swing, and feed the gas back in as it straightens. Tap the handbrake to whip the tail round hairpins.</p>
                <p>Your co-driver calls every bend: <b>6</b> is nearly flat out, <b>1</b> is a hairpin. JUMP, SPLASH and ICE warn you what is coming.</p>
            </div>
            <div className={styles.actions}><button className={styles.secondary} onClick={() => setSheet(null)}>GOT IT</button><button className={styles.primary} onClick={() => { setSheet(null); onLaunch({ tutorial: true }); }}>DRIVING SCHOOL →</button></div>
        </Dialog>}
    </main>;
}
