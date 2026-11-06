"use client";

import {useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent, type ReactNode} from 'react';
import {closeMenuDisclosure} from '../shared/menu-disclosure';
import {COURTS, CUPS, PLAYER_LOOK, RIVALS, ROUND_NAMES, TARGET_SCORE, courtFor, rivalFor, type Court, type Rival} from './levels';
import {STEP, assistShot, canShoot, clampAngle, idealSpeed, powerOf, clockText, drain, newGame, queueJump, queueShot, step, type Config, type Game, type GameEvent, type PowerKind} from './engine';
import {SAVE_KEY, buy, cupProgress, cupUnlocked, emptySave, equip, readSave, record, rivalUnlocked, titles, type Reward, type Save} from './save';
import {BALLS, OUTFITS, ballFor, outfitFor} from './shop';
import {RimRushAudio} from './audio';
import type {RimRushView} from './renderer';
import styles from './screen.module.css';

type Mode = 'loading' | 'menu' | 'cup' | 'quick' | 'locker' | 'playing' | 'paused' | 'finished' | 'error';
type Props = {onExit: () => void; onEvent?: (event: {type: string; payload?: Record<string, unknown>}) => void; hostCommand?: {id: number; type: string}};
type Inspect = {snapshot: () => unknown; view: () => unknown; advance?: (seconds: number) => void; shoot?: (angle: number, power: number) => boolean; jump?: () => boolean; ideal?: (degrees: number) => number | null};
type GameWindow = Window & {__STATOZ_BOOT__?: {assetRoot?: string}; __RIM_RUSH_INSPECT__?: Inspect};
type Hud = {score: [number, number]; clock: string; phase: Game['phase']; countdown: number; double: [boolean, boolean]; frozen: [number, number]; bigRim: [number, number]; held: boolean; aim: Game['aim']};
type Pop = {id: number; side: 0 | 1; big: string; label: string; tone: 'make' | 'block' | 'power' | 'rival'; x: number; y: number};
type Finish = {game: Game; reward: Reward};

const POWER_NAMES: Record<PowerKind, string> = {bigRim: 'BIG RIM', freeze: 'FREEZE', double: 'DOUBLE POINTS'};
const POWER_HELP: Record<PowerKind, string> = {bigRim: 'Your hoop is wider for 6 s', freeze: 'Rival frozen for 2 s', double: 'Next basket counts double'};
const DEMO_RIVALS = ['kai', 'zara', 'june', 'otto'];
const snapshotHud = (g: Game): Hud => ({
  score: [g.score[0], g.score[1]], clock: clockText(g), phase: g.phase, countdown: g.countdown,
  double: [g.players[0].double, g.players[1].double], frozen: [g.players[0].frozen, g.players[1].frozen],
  bigRim: [g.rimTimer[1], g.rimTimer[0]], held: g.balls[0].state === 'held', aim: g.aim,
});
const initials = (name: string) => name.split(' ').map(w => w[0]).join('');
const rivalStyle = (r: Rival) => ({'--jersey': r.look.jersey, '--trim': r.look.trim, '--skin': r.look.skin}) as CSSProperties;

export function RimRushGame({onExit, onEvent, hostCommand}: Props) {
  const canvas = useRef<HTMLCanvasElement>(null), root = useRef<HTMLElement>(null), view = useRef<RimRushView | null>(null);
  const game = useRef<Game | null>(null), demo = useRef<Game | null>(null), mode = useRef<Mode>('loading');
  const save = useRef<Save>(emptySave()), blocked = useRef(false), events = useRef(onEvent), audio = useRef<RimRushAudio | null>(null);
  const owner = useRef<number | null>(null), start = useRef({x: 0, y: 0}), keyAim = useRef({angle: 55 * Math.PI / 180, power: 0.45, active: false});
  const finishing = useRef<number | null>(null), resultSent = useRef<string | null>(null), popId = useRef(0), demoCourt = useRef(0);
  const [status, setStatus] = useState<Mode>('loading'), [progress, setProgress] = useState<Save>(emptySave()), [hud, setHud] = useState<Hud | null>(null);
  const [pops, setPops] = useState<Pop[]>([]), [finish, setFinish] = useState<Finish | null>(null), [notice, setNotice] = useState(''), [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0), [cupTab, setCupTab] = useState(0), [lockerTab, setLockerTab] = useState<'outfit' | 'ball'>('outfit');
  const [rivalPage, setRivalPage] = useState(0);
  const [pick, setPick] = useState<{rival: string; court: Court['id']}>({rival: 'milo', court: 'rooftop'}), [hint, setHint] = useState('');
  const [match, setMatch] = useState<Config | null>(null);
  const setMode = useCallback((next: Mode) => {mode.current = next; setStatus(next);}, []);
  const persist = useCallback((next: Save) => {
    save.current = next; setProgress(next);
    if (blocked.current) return;
    try {localStorage.setItem(SAVE_KEY, JSON.stringify(next));} catch {setNotice('Progress is temporary. This browser could not save it.');}
  }, []);
  const letGo = useCallback(() => {owner.current = null; keyAim.current.active = false; if (game.current) game.current.aim = null;}, []);
  const pause = useCallback(() => {if (mode.current === 'playing') {letGo(); setMode('paused'); audio.current?.suspend();}}, [letGo, setMode]);
  const resume = useCallback(() => {if (mode.current === 'paused' && innerWidth >= innerHeight) {setMode('playing'); audio.current?.resume(); canvas.current?.focus();}}, [setMode]);

  useEffect(() => {events.current = onEvent;}, [onEvent]);

  const looksFor = useCallback((g: Game) => {
    const s = save.current, auto = g.config.autopilot;
    view.current?.setLooks(auto ? auto.look : PLAYER_LOOK, g.config.rival.look, auto ? null : outfitFor(s.outfit), auto ? BALLS[2] : ballFor(s.ball) ?? BALLS[0], {...BALLS[0], trail: g.config.rival.look.jersey});
  }, []);
  const newDemo = useCallback(() => {
    const court = COURTS[demoCourt.current++ % COURTS.length], [a, b] = [DEMO_RIVALS[demoCourt.current % 4], DEMO_RIVALS[(demoCourt.current + 1) % 4]];
    const g = newGame({mode: 'quick', court, rival: rivalFor(b)!, autopilot: rivalFor(a)!}, (Math.random() * 2 ** 32) >>> 0);
    g.countdown = 0.5; demo.current = g; looksFor(g);
  }, [looksFor]);

  // Boot: read the save, load the renderer and assets, then run the fixed-step loop.
  useEffect(() => {
    let active = true, frame = 0, last = 0, accumulator = 0, updated = 0;
    const saved = (() => {try {return readSave(localStorage.getItem(SAVE_KEY));} catch {return {save: emptySave(), incompatible: false};}})();
    save.current = saved.save; blocked.current = saved.incompatible;
    queueMicrotask(() => {if (!active) return; setProgress(saved.save); if (saved.incompatible) setNotice('Saved progress belongs to an incompatible version. It is kept safe; this session is temporary.');});
    const base = (window as GameWindow).__STATOZ_BOOT__?.assetRoot ?? new URL('../../games/rim-rush/', location.href).href;
    audio.current ??= new RimRushAudio(base);
    audio.current.enabled = saved.save.sound;
    const manual = new URLSearchParams(location.search).get('clock') === 'manual';

    const handle = (g: Game, list: GameEvent[], real: boolean) => {
      const v = view.current; if (!v) return;
      v.react(list, g, save.current.reducedMotion);
      if (!real) return;
      audio.current?.events(list, side => g.balls[side].x);
      const add: Pop[] = [];
      for (const e of list) {
        if (e.type === 'score') {
          const s = e.score, raw = v.toScreen((s.side === 0 ? 1 : -1) * 4.7, 3.9), w = canvas.current?.clientWidth ?? 800;
          // Keep the label clear of the header buttons and the screen edges.
          const at = {x: Math.min(w - 130, Math.max(130, raw.x)), y: Math.max(118, raw.y)};
          const label = [s.buzzer && 'BUZZER BEATER', s.double && 'DOUBLE', s.swish && 'SWISH', s.bank && 'BANK SHOT'].filter(Boolean).join(' · ') || (s.side === 0 ? 'NICE' : '');
          add.push({id: ++popId.current, side: s.side, big: `+${s.points}`, label, tone: s.side === 0 ? 'make' : 'rival', ...at});
        }
        if (e.type === 'block') {const p = g.players[e.side], at = v.toScreen(p.x, 3.2); add.push({id: ++popId.current, side: e.side, big: e.side === 0 ? 'BLOCKED!' : 'SWATTED', label: '', tone: 'block', ...at});}
        if (e.type === 'power') {const at = v.toScreen(0, 4.4); add.push({id: ++popId.current, side: e.side, big: POWER_NAMES[e.kind], label: e.side === 0 ? POWER_HELP[e.kind] : 'Rival power-up', tone: 'power', ...at});}
        if (e.type === 'overtime') add.push({id: ++popId.current, side: 0, big: 'SUDDEN DEATH', label: 'Next basket wins', tone: 'power', ...v.toScreen(0, 4.2)});
      }
      if (add.length) {
        setPops(p => [...p, ...add].slice(-5));
        for (const p of add) setTimeout(() => setPops(list => list.filter(x => x.id !== p.id)), 1400);
      }
    };
    const settle = (g: Game) => {
      if (g.phase !== 'finished' || mode.current !== 'playing' || finishing.current !== null) return;
      letGo();
      const result = record(save.current, g), id = save.current.resultId;
      persist({...result.save, resultId: null});
      setFinish({game: g, reward: result.reward});
      audio.current?.sting(g.winner === 0);
      finishing.current = window.setTimeout(() => {finishing.current = null; if (mode.current === 'playing') {setMode('finished'); audio.current?.stopCrowd();}}, 1500);
      if (id && resultSent.current !== id) {
        resultSent.current = id;
        events.current?.({type: 'result', payload: {
          id, game: 'rim-rush', mode: g.config.mode, rival: g.config.rival.id, court: g.config.court.id, cup: g.config.cup ?? null, round: g.config.round ?? null,
          score: g.score[0], rivalScore: g.score[1], won: g.winner === 0, tied: g.tied, coins: result.reward.coins,
        }});
      }
    };
    const boot = async () => {
      let created: RimRushView | null = null;
      try {
        const {RimRushView} = await import('./renderer'); if (!active || !canvas.current) return;
        created = new RimRushView(canvas.current); view.current = created;
        await created.loadAssets(base); if (!active) {created.dispose(); return;}
        newDemo();
        setMode('menu');
        events.current?.({type: 'ready', payload: {gameId: 'rim-rush', title: 'Rim Rush', engine: 'Original Three.js basketball'}});
        const tick = (now: number) => {
          if (!active) return;
          const dt = last ? Math.min(0.1, (now - last) / 1000) : 0; last = now;
          const playing = ['playing', 'finished'].includes(mode.current) && game.current;
          const g = playing ? game.current! : ['menu', 'cup', 'quick', 'locker'].includes(mode.current) ? demo.current : game.current;
          if (g && (mode.current === 'playing' || (!playing && g === demo.current))) {
            accumulator += manual && playing ? 0 : dt;
            const steps = Math.floor((accumulator + 1e-9) / STEP); accumulator -= steps * STEP;
            for (let i = 0; i < Math.min(steps, 24); i++) step(g);
            handle(g, drain(g), !!playing);
            if (playing) settle(g);
            else if (g.phase === 'finished' && g.time > 1) {demo.current = null; newDemo();}
          } else accumulator = 0;
          created!.draw(g ?? null, mode.current === 'paused' ? 0 : dt, save.current.reducedMotion, !!g && g === demo.current);
          if (now - updated > 66 && game.current && playing) {setHud(snapshotHud(game.current)); updated = now;}
          frame = requestAnimationFrame(tick);
        };
        (window as GameWindow).__RIM_RUSH_INSPECT__ = {
          snapshot: () => ({mode: mode.current, game: game.current ? JSON.parse(JSON.stringify({...game.current, events: []})) : null, save: JSON.parse(JSON.stringify(save.current)), owner: owner.current}),
          view: () => created!.inspect(),
          shoot: (angle: number, power: number) => {const g = game.current; return !!g && mode.current === 'playing' && queueShot(g, 0, angle, power);},
          jump: () => {const g = game.current; return !!g && mode.current === 'playing' && queueJump(g, 0);},
          ideal: (degrees: number) => {const g = game.current, v = g && idealSpeed(g, 0, degrees * Math.PI / 180); return v ? powerOf(v) : null;},
          ...(manual ? {advance: (seconds: number) => {
            const g = game.current; if (mode.current !== 'playing' || !g) return;
            for (let i = 0, n = Math.round(Math.min(seconds, 120) / STEP); i < n && g.phase !== 'finished'; i++) step(g);
            handle(g, drain(g), true); settle(g); created!.draw(g, seconds, save.current.reducedMotion, false); setHud(snapshotHud(g));
          }} : {}),
        };
        frame = requestAnimationFrame(tick);
      } catch (e) {created?.dispose(); if (active) {view.current = null; setError(e instanceof Error ? e.message : String(e)); setMode('error');}}
    };
    void boot();
    const onLost = (e: Event) => {e.preventDefault(); letGo(); setError('The graphics context was interrupted. Reload to keep playing; your coins and cup progress are saved.'); setMode('error'); cancelAnimationFrame(frame);};
    const element = canvas.current; element?.addEventListener('webglcontextlost', onLost);
    return () => {
      active = false; cancelAnimationFrame(frame); element?.removeEventListener('webglcontextlost', onLost);
      if (finishing.current !== null) {clearTimeout(finishing.current); finishing.current = null;}
      view.current?.dispose(); view.current = null; delete (window as GameWindow).__RIM_RUSH_INSPECT__;
    };
  }, [attempt, letGo, newDemo, persist, setMode]);

  const jump = useCallback(() => {
    const g = game.current; if (mode.current !== 'playing' || !g) return;
    audio.current?.unlock();
    queueJump(g, 0);
  }, []);
  const fire = useCallback((angle: number, power: number) => {
    const g = game.current; if (!g) return;
    if (queueShot(g, 0, angle, assistShot(g, 0, angle, power))) setHint('');
    else if (g.players[0].frozen > 0) setHint('Frozen! Wait a moment.');
    else if (g.balls[0].state !== 'held') setHint('Wait for the ball to come back.');
  }, []);

  // Keyboard and window lifecycle.
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement && e.target.closest('input,select,textarea')) return;
      if (['Escape', 'KeyP'].includes(e.code)) {if (!e.repeat) {e.preventDefault(); if (mode.current === 'paused') resume(); else if (['cup','quick','locker'].includes(mode.current)) setMode('menu'); else pause();} return;}
      if (mode.current !== 'playing' || !game.current) return;
      const g = game.current, k = keyAim.current;
      if (e.code === 'Space') {e.preventDefault(); if (!e.repeat) jump(); return;}
      const turn = ({ArrowUp: 1, KeyW: 1, ArrowDown: -1, KeyS: -1} as Record<string, number>)[e.code], push = ({ArrowRight: 1, KeyD: 1, ArrowLeft: -1, KeyA: -1} as Record<string, number>)[e.code];
      if (turn || push) {
        e.preventDefault(); audio.current?.unlock();
        k.active = true; k.angle = clampAngle(k.angle + (turn ?? 0) * Math.PI / 180 * 1.5); k.power = Math.max(0, Math.min(1, k.power + (push ?? 0) * 0.01));
        g.aim = {angle: k.angle, power: k.power}; return;
      }
      if ((e.code === 'Enter' || e.code === 'KeyF') && !e.repeat) {e.preventDefault(); audio.current?.unlock(); fire(k.angle, k.power); if (!owner.current) g.aim = k.active ? {angle: k.angle, power: k.power} : null;}
    };
    const interrupt = () => pause(), visibility = () => {if (document.hidden) pause();}, rotate = () => {if (innerHeight > innerWidth) pause();};
    window.addEventListener('keydown', down); window.addEventListener('blur', interrupt); window.addEventListener('resize', rotate); document.addEventListener('visibilitychange', visibility);
    return () => {window.removeEventListener('keydown', down); window.removeEventListener('blur', interrupt); window.removeEventListener('resize', rotate); document.removeEventListener('visibilitychange', visibility);};
  }, [fire, jump, pause, resume, setMode]);
  useEffect(() => {
    if (!hostCommand) return;
    const t = setTimeout(() => {if (hostCommand.type === 'pause') pause(); else if (hostCommand.type === 'resume') resume(); else if (hostCommand.type === 'dispose') {letGo(); audio.current?.suspend();}}, 0);
    return () => clearTimeout(t);
  }, [hostCommand, letGo, pause, resume]);
  useEffect(() => () => audio.current?.dispose(), []);
  // Menus are modal: focus the primary action and keep Tab inside the panel.
  useEffect(() => {
    if (['playing', 'loading'].includes(status)) return;
    const panel = root.current?.querySelector<HTMLElement>('[role="dialog"]');
    panel?.querySelector<HTMLButtonElement>('[data-primary],button:not(:disabled)')?.focus();
    const trap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !panel) return;
      const items = Array.from(panel.querySelectorAll<HTMLElement>('button:not(:disabled),input,summary,select,a[href]')).filter(item => item.getClientRects().length > 0 && (!item.closest('details:not([open])') || item.tagName === 'SUMMARY'));
      const first = items[0], last = items.at(-1);
      if (e.shiftKey && document.activeElement === first) {e.preventDefault(); last?.focus();}
      else if (!e.shiftKey && document.activeElement === last) {e.preventDefault(); first?.focus();}
    };
    document.addEventListener('keydown', trap); return () => document.removeEventListener('keydown', trap);
  }, [status, cupTab, lockerTab]);

  const begin = (config: Config) => {
    audio.current?.unlock(); audio.current?.click(); letGo();
    if (finishing.current !== null) {clearTimeout(finishing.current); finishing.current = null;}
    const g = newGame(config, crypto.getRandomValues(new Uint32Array(1))[0]);
    game.current = g; looksFor(g); setMatch(config); setFinish(null); setPops([]); setHint('');
    persist({...save.current, resultId: crypto.randomUUID()});
    setHud(snapshotHud(g)); setMode(innerHeight > innerWidth ? 'paused' : 'playing'); canvas.current?.focus();
    audio.current?.startCrowd(0.045);
  };
  const playCup = (cupIndex: number) => {
    const cup = CUPS[cupIndex], round = cupProgress(save.current, cup.id).round, r = cup.rounds[round];
    begin({mode: 'cup', rival: rivalFor(r.rival)!, court: courtFor(r.court)!, cup: cup.id, round});
  };
  const toMenu = (next: Mode = 'menu') => {
    letGo(); audio.current?.stopCrowd(); audio.current?.click();
    if (finishing.current !== null) {clearTimeout(finishing.current); finishing.current = null;}
    game.current = null; setMatch(null); setHud(null); setFinish(null); setPops([]);
    if (demo.current) looksFor(demo.current);
    setMode(next);
  };
  const leave = () => {letGo(); audio.current?.suspend(); onExit();};

  // Pointer: press anywhere, pull back to aim (the dots show the first part of the arc), let go to shoot.
  const aimFrom = (x: number, y: number) => {
    const h = canvas.current?.clientHeight ?? 400, dx = x - start.current.x, dy = y - start.current.y;
    const length = Math.hypot(dx, dy), power = Math.min(1, length / (0.4 * h));
    return {angle: clampAngle(Math.atan2(dy, -dx)), power, length, h};
  };
  const onDown = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (mode.current !== 'playing' || !game.current) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    audio.current?.unlock();
    // A second finger while aiming jumps, so jump shots need only one hand per action.
    if (owner.current !== null) {jump(); return;}
    e.preventDefault(); owner.current = e.pointerId; start.current = {x: e.clientX, y: e.clientY};
    try {e.currentTarget.setPointerCapture(e.pointerId);} catch {/* synthetic pointers cannot be captured */}
  };
  const onMove = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    const g = game.current; if (owner.current !== e.pointerId || !g) return;
    const a = aimFrom(e.clientX, e.clientY);
    g.aim = a.length > a.h * 0.03 ? {angle: a.angle, power: a.power} : null;
  };
  const onUp = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    const g = game.current; if (owner.current !== e.pointerId || !g) return;
    owner.current = null;
    const a = aimFrom(e.clientX, e.clientY);
    g.aim = null;
    if (a.length > a.h * 0.03) fire(a.angle, a.power);
    else if (canShoot(g, 0)) setHint('Pull back and let go to shoot.');
  };
  const onCancel = (e: ReactPointerEvent<HTMLCanvasElement>) => {if (owner.current !== e.pointerId) return; letGo();};

  const panel = (children: ReactNode, label: string, extra = '') => <div className={`${styles.scrim} ${extra}`}><article className={styles.panel} role="dialog" aria-modal="true" aria-label={label}>{children}</article></div>;
  const toggleSound = (on: boolean) => {persist({...save.current, sound: on}); audio.current?.setEnabled(on);};
  const coins = <span className={styles.coins} aria-label={`${progress.coins} coins`}><i aria-hidden="true"/>{progress.coins}</span>;
  const config = finish?.game.config ?? match, rival = config?.rival;
  const playing = (status === 'playing' || status === 'paused' || status === 'finished') && hud && config;
  const nextCupRound = finish && config?.mode === 'cup' && finish.game.winner === 0 && !finish.reward.cupWon;
  const defaultCupIndex = Math.max(0, CUPS.reduce((n, _, i) => cupUnlocked(progress, i) ? i : n, 0));

  return <section onKeyDownCapture={closeMenuDisclosure} className={styles.root} ref={root} data-rim-rush data-mode={status}>
    <canvas ref={canvas} className={styles.canvas} tabIndex={0}
      aria-label="Rim Rush court. Press and pull back to aim, let go to shoot. Tap with a second finger or press Space to jump. Arrow keys and Enter also aim and shoot."
      onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onCancel} onLostPointerCapture={onCancel} onContextMenu={e => e.preventDefault()}/>
    <header className={styles.header}>
      <button className={styles.chip} aria-label="Back to Basketball" onClick={leave}>← <span>EXIT</span></button>
      {!playing && <div className={styles.wordmark} aria-hidden="true">RIM<b>RUSH</b></div>}
      <div className={styles.tools}>
        {status === 'menu' && <button className={styles.chip} onClick={() => setMode('locker')}>LOCKER</button>}
        {!playing && status !== 'loading' && coins}
        {status === 'playing' && <button className={styles.chip} onClick={pause} aria-label="Pause game">Ⅱ</button>}
        <button className={styles.chip} aria-label={progress.sound ? 'Mute sound' : 'Enable sound'} onClick={() => toggleSound(!save.current.sound)}>{progress.sound ? '♪ ON' : '♪ OFF'}</button>
      </div>
    </header>

    {playing && hud && rival && <>
      <div className={styles.scorebug} aria-label={`Score: you ${hud.score[0]}, ${rival.name} ${hud.score[1]}. ${hud.clock} left.`}>
        <div className={styles.team} data-side="you"><span>YOU</span><strong>{hud.score[0]}</strong>{hud.double[0] && <em title="Double points">×2</em>}{hud.frozen[0] > 0 && <em data-ice title="Frozen">❄</em>}{hud.bigRim[0] > 0 && <em title="Big rim">◎</em>}</div>
        <div className={styles.clock} data-urgent={hud.phase === 'play' && parseInt(hud.clock.split(':')[1] ?? '99') <= 10 && hud.clock.startsWith('0:')}>
          <b>{hud.phase === 'countdown' ? '1:00' : hud.clock}</b><small>{config?.mode === 'cup' ? `${CUPS.find(c => c.id === config.cup)?.name.toUpperCase()} · ${ROUND_NAMES[config.round ?? 0].toUpperCase()}` : `FIRST TO ${TARGET_SCORE}`}</small>
        </div>
        <div className={styles.team} data-side="rival" style={rivalStyle(rival)}>{hud.bigRim[1] > 0 && <em title="Big rim">◎</em>}{hud.frozen[1] > 0 && <em data-ice title="Frozen">❄</em>}{hud.double[1] && <em title="Double points">×2</em>}<strong>{hud.score[1]}</strong><span>{rival.name.split(' ')[0].toUpperCase()}</span></div>
      </div>
      {status === 'playing' && hud.phase === 'countdown' && <div className={styles.countdown} key={Math.ceil(hud.countdown)} aria-live="assertive">{Math.ceil(hud.countdown) || 'GO!'}</div>}
      {status === 'playing' && hud.phase === 'play' && hud.clock === '1:00' && <div className={styles.countdown} data-go>GO!</div>}
      {pops.map(p => <div key={p.id} className={styles.pop} data-tone={p.tone} style={{left: p.x, top: p.y}} aria-live="polite"><strong>{p.big}</strong>{p.label && <span>{p.label}</span>}</div>)}
      {status === 'playing' && <>
        <div className={styles.help} aria-live="polite">{hint || (hud.aim ? `Power ${Math.round(hud.aim.power * 100)}% · ${Math.round(hud.aim.angle * 180 / Math.PI)}°` : hud.phase === 'countdown' ? 'Pull back to aim · let go to shoot · JUMP to block' : '')}</div>
        {hud.aim && <div className={styles.power} aria-hidden="true"><i style={{height: `${Math.round(hud.aim.power * 100)}%`}}/></div>}
        <button className={styles.jump} aria-label="Jump" onPointerDown={e => {e.preventDefault(); jump();}} onClick={e => e.detail === 0 && jump()}>JUMP</button>
      </>}
    </>}

    {status === 'menu' && <main className={styles.title} role="dialog" aria-modal="true" aria-label="Rim Rush main menu">
      <div className={styles.titleCopy}>
        <div className={styles.eyebrow}>AN ORIGINAL 1-ON-1 BASKETBALL DUEL</div>
        <h1><span>RIM</span> <em>RUSH</em></h1>
        <p>First to {TARGET_SCORE}, or lead when the minute ends.</p>
        <div className={styles.actions}>
          <button data-primary className={styles.primary} onClick={() => {audio.current?.unlock(); audio.current?.click(); playCup(defaultCupIndex);}}>NEXT ROUND <span>{CUPS[defaultCupIndex].name}</span></button>
          <button className={styles.secondary} onClick={() => {setCupTab(defaultCupIndex); setMode('cup');}}>BROWSE CUPS <span>{titles(progress)} 🏆</span></button>
          <button className={styles.secondary} onClick={() => {audio.current?.unlock(); audio.current?.click(); setMode('quick');}}>QUICK MATCH</button>
        </div>
      </div>
    </main>}

    {status === 'cup' && panel(<>
      <div className={styles.panelTop}><span className={styles.eyebrow}>TOURNAMENT</span>{coins}<button className={styles.chip} onClick={() => toMenu()}>Back</button></div>
      <div className={styles.tabs} role="tablist">{CUPS.map((c, i) => <button role="tab" key={c.id} aria-selected={cupTab === i} disabled={!cupUnlocked(progress, i)} onClick={() => setCupTab(i)}>
        {c.name}<small>{cupUnlocked(progress, i) ? `${cupProgress(progress, c.id).titles} title${cupProgress(progress, c.id).titles === 1 ? '' : 's'} · +${c.reward} coins` : `Win the ${CUPS[i - 1].name}`}</small></button>)}</div>
      <ol className={styles.bracket}>{CUPS[cupTab].rounds.map((r, i) => {
        const opp = rivalFor(r.rival)!, at = cupProgress(progress, CUPS[cupTab].id).round, state = i < at ? 'won' : i === at ? 'next' : 'locked';
        return <li key={r.rival} data-state={state} style={rivalStyle(opp)}>
          <span className={styles.avatar}>{initials(opp.name)}</span>
          <div><small>{ROUND_NAMES[i].toUpperCase()} · {courtFor(r.court)!.name.toUpperCase()}</small><b>{opp.name}</b><em>“{opp.nickname}”</em></div>
          <i>{state === 'won' ? 'BEATEN' : state === 'next' ? 'NEXT UP' : 'LOCKED'}</i>
        </li>;
      })}</ol>
      <button data-primary className={styles.primary} onClick={() => playCup(cupTab)}>PLAY {ROUND_NAMES[cupProgress(progress, CUPS[cupTab].id).round].toUpperCase()} <span>→</span></button>
    </>, 'Tournament', styles.wide)}

    {status === 'quick' && panel(<>
      <div className={styles.panelTop}><span className={styles.eyebrow}>QUICK MATCH</span><button className={styles.chip} onClick={() => toMenu()}>Back</button></div>
      <div className={styles.rivals}>{RIVALS.filter(r => rivalUnlocked(progress, r.id)).slice(rivalPage * 8, rivalPage * 8 + 8).map(r => {
        const open = rivalUnlocked(progress, r.id), rec = progress.rivals[r.id];
        return <button key={r.id} disabled={!open} aria-pressed={pick.rival === r.id} style={rivalStyle(r)} onClick={() => setPick(p => ({...p, rival: r.id}))}
          aria-label={`${r.name}, ${r.nickname}, tier ${r.tier}${open ? '' : ', locked'}`}>
          <span className={styles.avatar}>{initials(r.name)}</span><b>{r.name.split(' ')[0]}</b><small>{open ? rec ? `${rec.won}–${rec.played - rec.won}` : '★'.repeat(r.tier) : 'LOCKED'}</small>
        </button>;
      })}</div>
      <div className={styles.panelTop}><button className={styles.chip} disabled={rivalPage === 0} onClick={() => setRivalPage(0)}>Previous</button><span>{RIVALS.filter(r => !rivalUnlocked(progress, r.id)).length} rivals locked</span><button className={styles.chip} disabled={rivalPage > 0 || RIVALS.filter(r => rivalUnlocked(progress, r.id)).length <= 8} onClick={() => setRivalPage(1)}>Next</button></div>
      <div className={styles.courts} role="radiogroup" aria-label="Court">{COURTS.map(c => <button key={c.id} role="radio" aria-checked={pick.court === c.id} onClick={() => setPick(p => ({...p, court: c.id}))} data-court={c.id}>{c.name}</button>)}</div>
      <button data-primary className={styles.primary} disabled={!rivalUnlocked(progress, pick.rival)} onClick={() => begin({mode: 'quick', rival: rivalFor(pick.rival)!, court: courtFor(pick.court)!})}>
        PLAY {rivalFor(pick.rival)!.name.split(' ')[0].toUpperCase()} <span>→</span></button>
    </>, 'Quick match', styles.wide)}

    {status === 'locker' && panel(<>
      <div className={styles.panelTop}><span className={styles.eyebrow}>LOCKER</span>{coins}<button className={styles.chip} onClick={() => toMenu()}>Back</button></div>
      <div className={styles.tabs} role="tablist">
        <button role="tab" aria-selected={lockerTab === 'outfit'} onClick={() => setLockerTab('outfit')}>Outfits<small>{progress.owned.outfits.length} / {OUTFITS.length} owned</small></button>
        <button role="tab" aria-selected={lockerTab === 'ball'} onClick={() => setLockerTab('ball')}>Balls<small>{progress.owned.balls.length} / {BALLS.length} owned</small></button>
      </div>
      <div className={styles.items}>{(lockerTab === 'outfit' ? OUTFITS : BALLS).map(item => {
        const owned = (lockerTab === 'outfit' ? progress.owned.outfits : progress.owned.balls).includes(item.id), on = (lockerTab === 'outfit' ? progress.outfit : progress.ball) === item.id;
        const swatch = 'jersey' in item
          ? <span className={styles.shirt} style={{'--jersey': item.jersey, '--trim': item.trim, '--shorts': item.shorts} as CSSProperties}>9</span>
          : <span className={styles.ball} style={{'--base': item.base, '--seam': item.seam, '--stripe': item.stripe ?? item.base} as CSSProperties}/>;
        return <button key={item.id} data-on={on} disabled={!owned && progress.coins < item.price}
          onClick={() => {const next = owned ? equip(save.current, lockerTab, item.id) : buy(save.current, lockerTab, item.id); if (next) {persist(next); audio.current?.click();}}}
          aria-label={`${item.name}. ${on ? 'Equipped' : owned ? 'Owned, select to equip' : `${item.price} coins`}`}>
          {swatch}<b>{item.name}</b><small>{on ? 'EQUIPPED' : owned ? 'EQUIP' : <><i className={styles.coin} aria-hidden="true"/>{item.price}</>}</small>
        </button>;
      })}</div>
    </>, 'Locker', styles.wide)}

    {status === 'paused' && panel(<>
      <span className={styles.eyebrow}>TIMEOUT</span>
      <h2>Catch your breath.</h2>
      <details><summary>SETTINGS</summary><label><span>Sound</span><input type="checkbox" checked={progress.sound} onChange={e => toggleSound(e.target.checked)}/></label>
      <label><span>Reduce motion (no shake or confetti)</span><input type="checkbox" checked={progress.reducedMotion} onChange={e => persist({...save.current, reducedMotion: e.target.checked})}/></label>
      </details>
      <details><summary>HELP</summary><p>Pull back and release to shoot; tap JUMP, Space or a second finger to jump and block.</p></details>
      <button data-primary className={styles.primary} onClick={resume}>RESUME <span>→</span></button>
      <button className={styles.secondary} onClick={() => toMenu(config?.mode === 'cup' ? 'cup' : 'quick')}>QUIT MATCH</button>
    </>, 'Paused')}

    {status === 'finished' && finish && rival && panel(<>
      <span className={styles.eyebrow}>{config?.mode === 'cup' ? `${CUPS.find(c => c.id === config.cup)?.name.toUpperCase()} · ${ROUND_NAMES[config.round ?? 0].toUpperCase()}` : `QUICK MATCH · ${config?.court.name.toUpperCase()}`}</span>
      <h2 data-result={finish.game.winner === 0 ? 'win' : finish.game.tied ? 'draw' : 'loss'}>
        {finish.reward.cupWon ? 'CHAMPIONS!' : finish.game.winner === 0 ? 'YOU WIN!' : finish.game.tied ? 'DEAD EVEN' : `${rival.name.split(' ')[0].toUpperCase()} WINS`}</h2>
      <div className={styles.final}><strong>{finish.game.score[0]}</strong><small>–</small><strong>{finish.game.score[1]}</strong></div>
      <details><summary>MATCH DETAILS</summary><dl className={styles.stats}>
        <div><dt>Made</dt><dd>{finish.game.stats[0].makes} / {finish.game.stats[0].shots}</dd></div>
        <div><dt>Swish</dt><dd>{finish.game.stats[0].swishes}</dd></div>
        <div><dt>Bank</dt><dd>{finish.game.stats[0].banks}</dd></div>
        <div><dt>Blocks</dt><dd>{finish.game.stats[0].blocks}</dd></div>
      </dl></details>
      <p className={styles.earned}><i className={styles.coin} aria-hidden="true"/>+{finish.reward.coins}</p>
      <div className={styles.row}>
        {nextCupRound ? <button data-primary className={styles.primary} onClick={() => playCup(CUPS.findIndex(c => c.id === config!.cup))}>NEXT ROUND <span>{ROUND_NAMES[(config!.round ?? 0) + 1].toUpperCase()} →</span></button>
          : <button data-primary className={styles.primary} onClick={() => config && (config.mode === 'cup' && finish.reward.cupWon ? toMenu('cup') : begin({...config, round: config.round}))}>{finish.reward.cupWon ? 'TROPHY ROOM' : 'REMATCH'} <span>→</span></button>}
        <button className={styles.secondary} onClick={() => toMenu()}>MENU</button>
      </div>
    </>, 'Result')}

    {status === 'loading' && <div className={styles.scrim} role="status"><div className={styles.loading}>RIM<b>RUSH</b><span>Sweeping the court…</span><i/></div></div>}
    {status === 'error' && panel(<>
      <span className={styles.eyebrow}>COURT CLOSED</span>
      <h2>Let’s try that again.</h2>
      <p>The 3D court could not load. {error}</p>
      <button data-primary className={styles.primary} onClick={() => {setMode('loading'); setError(''); setAttempt(a => a + 1);}}>RETRY LOADING</button>
      <button className={styles.secondary} onClick={leave}>BACK TO BASKETBALL</button>
    </>, 'Game unavailable')}
    {status === 'menu' && <div className={styles.credit}>Floors and sounds: ambientCG and freesound contributors (CC0). Players, courts and game are original.</div>}
    {notice && <div role="status" className={styles.notice}>{notice}<button className={styles.chip} onClick={() => setNotice('')}>Dismiss</button></div>}
    <div className={styles.rotate} role="status"><b>Turn your device sideways.</b><span>Rim Rush plays in landscape.</span></div>
  </section>;
}
