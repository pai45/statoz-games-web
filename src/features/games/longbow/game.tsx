"use client";

import {useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode} from 'react';
import {closeMenuDisclosure} from '../shared/menu-disclosure';
import {LEVELS, MATCH_ENDS, OPPONENTS, RANGES, RANGE_UNLOCK_STARS, type Level, type Opponent} from './levels';
import {
  STEP, DRAW_TIME, STEADY_TIME, cancelDraw, drawAmount, endOf, newGame, nudgeAim, release, skipImpact, startDraw, steadiness, step, totalEnds,
  type ArrowResult, type Config, type Game,
} from './engine';
import {SAVE_KEY, emptySave, levelUnlocked, rangeStars, rangeUnlocked, readSave, record, resumed, rivalUnlocked, totalStars, type Save} from './save';
import {LongbowAudio} from './audio';
import type {LongbowView} from './renderer';
import styles from './screen.module.css';

type Mode = 'loading' | 'menu' | 'career' | 'rivals' | 'playing' | 'paused' | 'finished' | 'error';
type Props = {onExit: () => void; onEvent?: (event: {type: string; payload?: Record<string, unknown>}) => void; hostCommand?: {id: number; type: string}};
type Inspect = {snapshot: () => unknown; view: () => unknown; advance?: (seconds: number) => void; aim?: (x: number, y: number) => void};
type GameWindow = Window & {__STATOZ_BOOT__?: {assetRoot?: string}; __LONGBOW_INSPECT__?: Inspect};
type Hud = Pick<Game, 'phase' | 'turn' | 'hold' | 'distance' | 'totalArrows' | 'arrowIndex' | 'cinematic' | 'won' | 'tied' | 'stars' | 'config' | 'checkpoint'> & {
  results: ArrowResult[]; score: Game['score']; wind: Game['wind']; last: ArrowResult | null; draw: number; end: number; ends: number;
};
const AIM_KEYS: Record<string, [number, number]> = {ArrowLeft: [-1, 0], KeyA: [-1, 0], ArrowRight: [1, 0], KeyD: [1, 0], ArrowUp: [0, 1], KeyW: [0, 1], ArrowDown: [0, -1], KeyS: [0, -1]};
const snapshotHud = (g: Game): Hud => ({
  phase: g.phase, turn: g.turn, hold: g.hold, distance: g.distance, totalArrows: g.totalArrows, arrowIndex: g.arrowIndex, cinematic: g.cinematic,
  won: g.won, tied: g.tied, stars: g.stars, config: g.config, checkpoint: g.checkpoint, results: [...g.results], score: {...g.score}, wind: {...g.wind},
  last: g.last && {...g.last}, draw: drawAmount(g), end: endOf(g, Math.min(g.arrowIndex, g.totalArrows - 1)), ends: totalEnds(g),
});
const rangeOf = (c: Config) => c.mode === 'career' ? c.level.range : OPPONENTS.findIndex(o => o.id === c.opponent.id);
const starText = (n: number) => '★★★'.slice(0, n) + '☆☆☆'.slice(0, 3 - n);
const motionLabel = (l: Level) => l.motion.kind === 'slide' ? 'Sliding' : l.motion.kind === 'swing' ? 'Swinging' : l.target === 'small' ? 'Small face' : '';

export function LongbowGame({onExit, onEvent, hostCommand}: Props) {
  const canvas = useRef<HTMLCanvasElement>(null), root = useRef<HTMLElement>(null), view = useRef<LongbowView | null>(null);
  const game = useRef<Game | null>(null), mode = useRef<Mode>('loading'), save = useRef<Save>(emptySave()), blocked = useRef(false), events = useRef(onEvent);
  const audio = useRef<LongbowAudio | null>(null), owner = useRef<number | 'key' | null>(null), pointer = useRef({x: 0, y: 0}), keys = useRef(new Set<string>());
  const resultSent = useRef<string | null>(null), skipSlow = useRef(false), menuRange = useRef(0);
  const [status, setStatus] = useState<Mode>('loading'), [progress, setProgress] = useState<Save>(emptySave()), [hud, setHud] = useState<Hud | null>(null);
  const [notice, setNotice] = useState(''), [error, setError] = useState(''), [attempt, setAttempt] = useState(0), [tab, setTab] = useState(0), [hint, setHint] = useState('');
  const [lanePage, setLanePage] = useState(0);
  const setMode = useCallback((next: Mode) => {mode.current = next; setStatus(next);}, []);
  const refresh = useCallback(() => {if (game.current) setHud(snapshotHud(game.current));}, []);
  const persist = useCallback((next: Save) => {
    save.current = next; setProgress(next);
    if (blocked.current) return;
    try {localStorage.setItem(SAVE_KEY, JSON.stringify(next));} catch {setNotice('Progress is temporary. This browser could not save it.');}
  }, []);
  const letGo = useCallback(() => {owner.current = null; keys.current.clear(); if (game.current) cancelDraw(game.current); audio.current?.drawStop();}, []);
  const pause = useCallback(() => {if (mode.current === 'playing') {letGo(); setMode('paused'); audio.current?.suspend(); refresh();}}, [letGo, refresh, setMode]);
  const resume = useCallback(() => {if (mode.current === 'paused' && innerWidth >= innerHeight) {setMode('playing'); audio.current?.resume(); canvas.current?.focus();}}, [setMode]);

  useEffect(() => {events.current = onEvent;}, [onEvent]);

  // Boot: read the save, load the renderer and assets, then run the fixed-step loop.
  useEffect(() => {
    let active = true, frame = 0, last = 0, accumulator = 0, updated = 0;
    const saved = (() => {try {return readSave(localStorage.getItem(SAVE_KEY));} catch {return {save: emptySave(), incompatible: false};}})();
    save.current = saved.save; blocked.current = saved.incompatible;
    queueMicrotask(() => {if (!active) return; setProgress(saved.save); if (saved.incompatible) setNotice('Saved progress belongs to an incompatible version. It is kept safe; this session is temporary.');});
    const base = (window as GameWindow).__STATOZ_BOOT__?.assetRoot ?? new URL('../../games/longbow/', location.href).href;
    audio.current ??= new LongbowAudio(base);
    audio.current.enabled = saved.save.sound;

    const onTransition = (g: Game, before: Game['phase']) => {
      if (before === 'ai-aim' && g.phase === 'flight') audio.current?.release(1);
      if (before === 'flight' && g.phase === 'impact' && g.last) {
        if (g.last.miss) audio.current?.miss(); else audio.current?.hit(g.last.score);
        skipSlow.current = false;
      }
    };
    const boot = async () => {
      let created: LongbowView | null = null;
      try {
        const {LongbowView} = await import('./renderer'); if (!active || !canvas.current) return;
        created = new LongbowView(canvas.current); view.current = created;
        await created.loadAssets(base); if (!active) {created.dispose(); return;}
        setMode('menu');
        events.current?.({type: 'ready', payload: {gameId: 'longbow', title: 'Longbow', engine: 'Original Three.js archery'}});
        const manual = new URLSearchParams(location.search).get('clock') === 'manual';
        const advanceSteps = (g: Game, steps: number) => {
          for (let i = 0; i < steps && g.phase !== 'finished'; i++) {const before = g.phase; step(g); if (g.phase !== before) onTransition(g, before);}
        };
        let lastCheckpoint = -1;
        const settle = (g: Game) => {
          if (g.checkpoint !== lastCheckpoint) {lastCheckpoint = g.checkpoint; persist(record(save.current, g));}
          if (g.phase === 'finished' && mode.current === 'playing') {
            persist(record(save.current, g)); letGo(); setMode('finished'); refresh();
            const id = save.current.resultId;
            if (g.won) audio.current?.chime([523, 659, 784, 1047]); else audio.current?.chime([392, 330], 0.2, 0.06);
            if (id && resultSent.current !== id) {
              resultSent.current = id;
              events.current?.({type: 'result', payload: {
                id, game: 'longbow', mode: g.config.mode, challengeId: g.config.mode === 'career' ? g.config.level.id : g.config.opponent.id,
                score: g.score.player, rivalScore: g.config.mode === 'match' ? g.score.ai : null, stars: g.stars, won: g.won,
              }});
            }
          }
        };
        const tick = (now: number) => {
          if (!active) return;
          const dt = last ? Math.min(0.1, (now - last) / 1000) : 0; last = now;
          const g = game.current, reduced = save.current.reducedMotion;
          if (mode.current === 'playing' && g) {
            // Held aim keys move the sight at a steady share of the visible view.
            if (g.turn === 'player' && (g.phase === 'ready' || g.phase === 'drawing') && keys.current.size) {
              let dx = 0, dy = 0; for (const k of keys.current) {const d = AIM_KEYS[k]; if (d) {dx += d[0]; dy += d[1];}}
              const rate = created!.metresPerPixel(g.distance) * (canvas.current?.clientHeight ?? 400) * 0.35 * dt;
              nudgeAim(g, dx * rate, dy * rate);
            }
            const slow = g.phase === 'flight' && g.cinematic && !reduced && !skipSlow.current ? 0.3 : 1;
            accumulator += manual ? 0 : dt * slow;
            const steps = Math.floor((accumulator + 1e-9) / STEP); accumulator -= steps * STEP;
            advanceSteps(g, steps);
            settle(g);
          } else accumulator = 0;
          created!.draw(game.current, mode.current === 'paused' ? 0 : dt, reduced, menuRange.current);
          if (now - updated > 65 && game.current && (mode.current === 'playing' || mode.current === 'finished')) {refresh(); updated = now;}
          frame = requestAnimationFrame(tick);
        };
        (window as GameWindow).__LONGBOW_INSPECT__ = {
          snapshot: () => ({mode: mode.current, game: game.current ? JSON.parse(JSON.stringify(game.current)) : null, save: JSON.parse(JSON.stringify(save.current)), owner: owner.current}),
          view: () => created!.inspect(),
          aim: (x: number, y: number) => {const g = game.current; if (g && g.turn === 'player') g.aim = {x, y};},
          ...(manual ? {advance: (seconds: number) => {
            const g = game.current; if (mode.current !== 'playing' || !g) return;
            advanceSteps(g, Math.round(Math.min(seconds, 20) / STEP)); settle(g);
            created!.draw(g, seconds, save.current.reducedMotion); refresh();
          }} : {}),
        };
        frame = requestAnimationFrame(tick);
      } catch (e) {created?.dispose(); if (active) {view.current = null; setError(e instanceof Error ? e.message : String(e)); setMode('error');}}
    };
    void boot();
    const onLost = (e: Event) => {e.preventDefault(); letGo(); setError('The graphics context was interrupted. Reload to continue from your last completed arrow.'); setMode('error'); cancelAnimationFrame(frame);};
    const element = canvas.current; element?.addEventListener('webglcontextlost', onLost);
    return () => {active = false; cancelAnimationFrame(frame); element?.removeEventListener('webglcontextlost', onLost); view.current?.dispose(); view.current = null; delete (window as GameWindow).__LONGBOW_INSPECT__;};
  }, [attempt, letGo, persist, refresh, setMode]);

  const press = useCallback(() => {
    const g = game.current;
    if (mode.current !== 'playing' || !g) return false;
    if (g.phase === 'impact') {skipImpact(g); return false;}
    if (g.phase === 'flight' && g.cinematic) {skipSlow.current = true; return false;}
    if (!startDraw(g)) return false;
    audio.current?.unlock(); audio.current?.drawStart(); setHint('');
    return true;
  }, []);
  const letFly = useCallback(() => {
    const g = game.current; if (!g) return;
    const power = drawAmount(g);
    if (release(g)) audio.current?.release(power);
    else {audio.current?.drawStop(); setHint('Hold until the bow is fully drawn, then release.');}
    refresh();
  }, [refresh]);

  // Keyboard and window lifecycle.
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement && e.target.closest('input,select,textarea')) return;
      if (['Escape', 'KeyP'].includes(e.code)) {if (!e.repeat) {e.preventDefault(); if (mode.current === 'paused') resume(); else if (mode.current === 'career' || mode.current === 'rivals') setMode('menu'); else pause();} return;}
      if (mode.current !== 'playing') return;
      if (e.code === 'Space') {e.preventDefault(); if (!e.repeat && owner.current === null && press()) owner.current = 'key'; return;}
      if (AIM_KEYS[e.code]) {e.preventDefault(); keys.current.add(e.code);}
    };
    const up = (e: KeyboardEvent) => {
      keys.current.delete(e.code);
      if (e.code === 'Space' && owner.current === 'key') {owner.current = null; letFly();}
    };
    const interrupt = () => pause(), visibility = () => {if (document.hidden) pause();}, rotate = () => {if (innerHeight > innerWidth) pause();};
    window.addEventListener('keydown', down); window.addEventListener('keyup', up); window.addEventListener('blur', interrupt); window.addEventListener('resize', rotate); document.addEventListener('visibilitychange', visibility);
    return () => {window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); window.removeEventListener('blur', interrupt); window.removeEventListener('resize', rotate); document.removeEventListener('visibilitychange', visibility);};
  }, [letFly, pause, press, resume, setMode]);
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
  }, [status, tab]);

  const start = (config: Config | null, continuing = false) => {
    audio.current?.unlock(); letGo();
    const g = continuing ? resumed(save.current) : config ? newGame(config, crypto.getRandomValues(new Uint32Array(1))[0]) : null;
    if (!g) return;
    game.current = g; skipSlow.current = false; setHint('');
    menuRange.current = rangeOf(g.config);
    persist({...record(save.current, g), resultId: continuing && save.current.resultId ? save.current.resultId : crypto.randomUUID()});
    setHud(snapshotHud(g)); setMode(innerHeight > innerWidth ? 'paused' : 'playing'); canvas.current?.focus();
  };
  const toMenu = (next: Mode = 'menu') => {letGo(); game.current = null; setHud(null); setMode(next);};
  const leave = () => {letGo(); audio.current?.suspend(); onExit();};

  // Pointer: press anywhere on the range to draw, drag to aim, lift to shoot.
  const onDown = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    if (owner.current !== null) return;
    if (!press()) return;
    e.preventDefault(); owner.current = e.pointerId; pointer.current = {x: e.clientX, y: e.clientY};
    try {e.currentTarget.setPointerCapture(e.pointerId);} catch {/* synthetic pointers cannot be captured */}
  };
  const onMove = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    const g = game.current; if (owner.current !== e.pointerId || !g || !view.current) return;
    const mpp = view.current.metresPerPixel(g.distance) * 0.6;
    nudgeAim(g, (e.clientX - pointer.current.x) * mpp, -(e.clientY - pointer.current.y) * mpp);
    pointer.current = {x: e.clientX, y: e.clientY};
  };
  const onUp = (e: ReactPointerEvent<HTMLCanvasElement>) => {if (owner.current !== e.pointerId) return; owner.current = null; letFly();};
  const onCancel = (e: ReactPointerEvent<HTMLCanvasElement>) => {if (owner.current !== e.pointerId) return; letGo(); refresh();};

  const canContinue = !!progress.checkpoint && !!resumed(progress);
  const nextCareerLevel = LEVELS.find(level => levelUnlocked(progress, level.index) && !(progress.stars[level.id] > 0)) ?? LEVELS.filter(level => levelUnlocked(progress, level.index)).at(-1) ?? LEVELS[0];
  const playing = ['playing', 'paused', 'finished'].includes(status) && hud;
  const career = hud?.config.mode === 'career' ? hud.config.level : null, rival = hud?.config.mode === 'match' ? hud.config.opponent : null;
  const aiming = status === 'playing' && hud?.turn === 'player' && (hud.phase === 'ready' || hud.phase === 'drawing');
  const steady = hud?.phase === 'drawing' ? steadiness(hud.hold) : null;
  const panel = (children: ReactNode, label: string, extra = '') => <div className={`${styles.scrim} ${extra}`}><article className={styles.panel} role="dialog" aria-modal="true" aria-label={label}>{children}</article></div>;
  const toggleSound = (on: boolean) => {persist({...save.current, sound: on}); audio.current?.setEnabled(on);};
  const nextLevel = career && LEVELS[career.index + 1] && levelUnlocked(progress, career.index + 1) ? LEVELS[career.index + 1] : null;
  const nextRival = rival && hud?.won ? OPPONENTS[OPPONENTS.indexOf(rival) + 1] : undefined;

  return <section onKeyDownCapture={closeMenuDisclosure} className={styles.root} ref={root} data-longbow data-mode={status}>
    <canvas ref={canvas} className={styles.canvas} tabIndex={0} aria-label="Longbow archery range. Press and hold to draw, drag to aim, release to shoot. Space and arrow keys also work."
      onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onCancel} onLostPointerCapture={onCancel} onContextMenu={e => e.preventDefault()}/>
    <header className={styles.header}>
      <button className={styles.chip} aria-label="Back to Archery" onClick={leave}>← <span>EXIT</span></button>
      <div className={styles.wordmark} aria-hidden="true">LONGBOW</div>
      <div className={styles.tools}>
        {status === 'playing' && <button className={styles.chip} onClick={pause} aria-label="Pause game">Ⅱ</button>}
        <button className={styles.chip} aria-label={progress.sound ? 'Mute sound' : 'Enable sound'} onClick={() => toggleSound(!save.current.sound)}>{progress.sound ? 'SOUND ON' : 'SOUND OFF'}</button>
      </div>
    </header>

    {playing && hud && <>
      {career && <div className={styles.board} aria-label="Score">
        <div><span>{RANGES[career.range].name.toUpperCase()} · {String(career.index + 1).padStart(2, '0')}</span><b>{career.name}</b></div>
        <div className={styles.total}><span>SCORE</span><strong>{hud.score.player}</strong><small>{(() => {const next = career.stars.find(s => hud.score.player < s); return next ? `${'★'.repeat(career.stars.indexOf(next) + 1)} at ${next}` : '★★★ earned';})()}</small></div>
        <ol className={styles.quiver} aria-label="Arrows">{Array.from({length: hud.totalArrows}, (_, i) => {const r = hud.results[i]; return <li key={i} data-done={!!r} data-x={r?.x}>{r ? r.miss ? 'M' : r.x ? 'X' : r.score : ''}</li>;})}</ol>
      </div>}
      {rival && <div className={`${styles.board} ${styles.duel}`} aria-label="Match score">
        <div className={styles.side}><span>YOU</span><strong>{hud.score.player}</strong><small>{hud.score.playerX} X</small></div>
        <div className={styles.endLabel}><span>END {Math.min(hud.end + 1, MATCH_ENDS)} OF {MATCH_ENDS}</span><b>{rival.distance} m</b></div>
        <div className={`${styles.side} ${styles.rivalSide}`}><span>{rival.name.split(' ')[0].toUpperCase()}</span><strong>{hud.score.ai}</strong><small>{hud.score.aiX} X</small></div>
      </div>}
      <div className={styles.wind} aria-label={`Wind ${hud.wind.speed} metres per second`}>
        <span>WIND</span>
        <i style={{transform: `rotate(${Math.atan2(hud.wind.x, -hud.wind.z)}rad)`, opacity: hud.wind.speed < 0.2 ? 0.25 : 1}}>↑</i>
        <b>{hud.wind.speed.toFixed(1)}<small> m/s</small></b>
        <em>{hud.distance} m</em>
      </div>
      {aiming && <div className={styles.sight} data-steady={steady ?? 'ready'} aria-hidden="true"><i/><i/><i/><i/><b/></div>}
      {aiming && <div className={styles.meter} aria-live="polite">
        <div className={styles.bar}><i style={{width: `${Math.round((hud.phase === 'drawing' ? hud.draw : 0) * 100)}%`}}/><b style={{left: `${(DRAW_TIME / (DRAW_TIME + STEADY_TIME + 0.5)) * 100}%`}}/></div>
        <span>{hint || (hud.phase === 'ready' ? 'Hold anywhere to draw · drag to aim · let go to shoot' : steady === 'steady' ? 'Steady. Release when the sight is on gold.' : steady === 'tiring' ? 'Your arms are tiring. Release soon.' : 'Drawing…')}</span>
      </div>}
      {status === 'playing' && hud.turn === 'ai' && hud.phase === 'ai-aim' && <div className={styles.banner}>{rival?.name} is aiming…</div>}
      {status === 'playing' && hud.phase === 'flight' && hud.cinematic && <div className={styles.banner}>Tap to skip</div>}
      {status === 'playing' && hud.phase === 'impact' && hud.last && <div className={styles.pop} key={hud.checkpoint} data-shooter={hud.last.shooter} data-score={hud.last.miss ? 0 : hud.last.score}>
        <strong>{hud.last.miss ? 'MISS' : hud.last.x ? 'X' : hud.last.score}</strong>
        <span>{hud.last.shooter === 'ai' ? rival?.name : hud.last.miss ? 'Watch the wind' : hud.last.x ? 'Dead centre' : hud.last.score >= 9 ? 'In the gold' : hud.last.score >= 7 ? 'Good arrow' : 'On the board'}</span>
      </div>}
    </>}

    {status === 'menu' && <main className={styles.welcome} role="dialog" aria-modal="true" aria-label="Longbow main menu">
      <div className={styles.heroCopy}>
        <div className={styles.eyebrow}>AN ORIGINAL ARCHERY GAME</div>
        <h1>DRAW.<br/>READ THE WIND.<br/><em>LET IT FLY.</em></h1>
        <p>Read the wind and clear the next lane.</p>
        <div className={styles.actions}>
          {canContinue ? <button data-primary className={styles.primary} onClick={() => start(null, true)}>CONTINUE <span>→</span></button> : <button data-primary className={styles.primary} onClick={() => start({mode: 'career', level: nextCareerLevel})}>PLAY {nextCareerLevel.name.toUpperCase()} <span>→</span></button>}
          <button className={styles.secondary} onClick={() => {setTab(LEVELS.reduce((r, l) => levelUnlocked(progress, l.index) ? l.range : r, 0)); setLanePage(0); setMode('career');}}>BROWSE LANES <span>{totalStars(progress)} / 90 ★</span></button>
          <button className={styles.secondary} onClick={() => setMode('rivals')}>DUEL A RIVAL <span>3 ARCHERS</span></button>
        </div>
      </div>
    </main>}

    {status === 'career' && panel(<>
      <div className={styles.panelTop}><span className={styles.eyebrow}>CAREER</span><button className={styles.chip} onClick={() => toMenu()}>Back</button></div>
      <div className={styles.tabs} role="tablist">{RANGES.map((r, i) => <button role="tab" key={r.name} aria-selected={tab === i} disabled={!rangeUnlocked(progress, i)} onClick={() => {setTab(i); setLanePage(0); menuRange.current = i;}}>
        {r.name}<small>{rangeUnlocked(progress, i) ? `${rangeStars(progress, i)} / 30 ★` : `${RANGE_UNLOCK_STARS} ★ in ${RANGES[i - 1].name}`}</small></button>)}</div>
      <div className={styles.levels}>{LEVELS.filter(l => l.range === tab).filter(l => levelUnlocked(progress, l.index)).slice(lanePage * 8, lanePage * 8 + 8).map(l => {
        const open = levelUnlocked(progress, l.index), stars = progress.stars[l.id] ?? 0;
        return <button key={l.id} disabled={!open} onClick={() => start({mode: 'career', level: l})} aria-label={`${l.index + 1}. ${l.name}, ${l.distance} metres${open ? `, ${stars} stars` : ', locked'}`}>
          <span>{String(l.index + 1).padStart(2, '0')}</span><b>{l.name}</b><small>{l.distance} m{l.wind[1] > 0 ? ` · wind ${l.wind[1]}` : ''}{motionLabel(l) ? ` · ${motionLabel(l)}` : ''}</small><i>{open ? starText(stars) : 'LOCKED'}</i>
        </button>;
      })}</div>
      <div className={styles.panelTop}><button className={styles.chip} disabled={lanePage === 0} onClick={() => setLanePage(0)}>Previous</button><span>{lanePage + 1} / {Math.max(1, Math.ceil(LEVELS.filter(l => l.range === tab && levelUnlocked(progress, l.index)).length / 8))}</span><button className={styles.chip} disabled={lanePage > 0 || LEVELS.filter(l => l.range === tab && levelUnlocked(progress, l.index)).length <= 8} onClick={() => setLanePage(1)}>Next</button></div>
      <p className={styles.footnote}>{LEVELS.filter(l => l.range === tab && !levelUnlocked(progress, l.index)).length} lanes locked · Earn a star to open the next.</p>
    </>, 'Choose a level', styles.wide)}

    {status === 'rivals' && panel(<>
      <div className={styles.panelTop}><span className={styles.eyebrow}>DUEL A RIVAL</span><button className={styles.chip} onClick={() => toMenu()}>Back</button></div>
      <p className={styles.lede}>Five ends, three arrows each, shooting in turn. Highest total wins; X rings break a tie.</p>
      <div className={styles.rivals}>{OPPONENTS.map((o: Opponent, i) => {
        const open = rivalUnlocked(progress, i), record_ = progress.rivals[o.id];
        return <button key={o.id} disabled={!open} onClick={() => start({mode: 'match', opponent: o})} aria-label={`${o.name}, ${o.title}, ${o.distance} metres${open ? '' : ', locked'}`}>
          <span>{o.title.toUpperCase()}</span><b>{o.name}</b><small>{o.distance} m · {RANGES[i].name}</small>
          <i>{!open ? `Beat ${OPPONENTS[i - 1].name.split(' ')[0]} to unlock` : record_ ? `Won ${record_.won} of ${record_.played} · best ${record_.best}` : 'Not yet played'}</i>
        </button>;
      })}</div>
    </>, 'Choose a rival', styles.wide)}

    {status === 'paused' && panel(<>
      <span className={styles.eyebrow}>PAUSED</span>
      <h2>Take a breath.</h2>
      <details><summary>SETTINGS</summary><label><span>Sound</span><input type="checkbox" checked={progress.sound} onChange={e => toggleSound(e.target.checked)}/></label>
      <label><span>Reduce motion (no shake, flashes or slow motion)</span><input type="checkbox" checked={progress.reducedMotion} onChange={e => persist({...save.current, reducedMotion: e.target.checked})}/></label>
      </details>
      <details><summary>HELP</summary><p>Hold to draw, drag to aim, then release while the sight is steady; aim into the wind.</p></details>
      <button data-primary className={styles.primary} onClick={resume}>RESUME <span>→</span></button>
      <button className={styles.secondary} onClick={() => toMenu()}>EXIT TO MENU</button>
    </>, 'Paused')}

    {status === 'finished' && hud && panel(<>
      {career && <>
        <span className={styles.eyebrow}>{RANGES[career.range].name.toUpperCase()} · {career.name.toUpperCase()}</span>
        <h2>{hud.won ? hud.stars === 3 ? 'Perfect form.' : 'Lane cleared.' : 'Not this time.'}</h2>
        <div className={styles.result}><strong>{hud.score.player}</strong><span className={styles.stars} aria-label={`${hud.stars} stars`}>{starText(hud.stars)}</span><small>{career.stars.map((s, i) => `${'★'.repeat(i + 1)} ${s}`).join(' · ')}</small></div>
        <button data-primary className={styles.primary} onClick={() => start({mode: 'career', level: hud.won && nextLevel ? nextLevel : career})}>{hud.won && nextLevel ? 'NEXT LANE' : 'TRY AGAIN'} <span>→</span></button>
      </>}
      {rival && <>
        <span className={styles.eyebrow}>DUEL · {rival.name.toUpperCase()}</span>
        <h2>{hud.won ? 'Victory.' : hud.tied ? 'Dead level.' : `${rival.name.split(' ')[0]} takes it.`}</h2>
        <div className={styles.result}><strong>{hud.score.player}<small> – {hud.score.ai}</small></strong><small>X rings {hud.score.playerX} – {hud.score.aiX}</small></div>
        <button data-primary className={styles.primary} onClick={() => start({mode: 'match', opponent: nextRival ?? rival})}>{nextRival ? 'NEXT RIVAL' : 'REMATCH'} <span>→</span></button>
      </>}
      <button className={styles.secondary} onClick={() => toMenu(career ? 'career' : 'rivals')}>BACK TO {career ? 'LANES' : 'RIVALS'}</button>
    </>, 'Result')}

    {status === 'loading' && <div className={styles.scrim} role="status"><div className={styles.loading}>LONGBOW<span>Setting up the range…</span><i/></div></div>}
    {status === 'error' && panel(<>
      <span className={styles.eyebrow}>THE RANGE IS CLOSED</span>
      <h2>Let’s try that again.</h2>
      <p>The 3D range could not load. {error}</p>
      <button data-primary className={styles.primary} onClick={() => {setMode('loading'); setError(''); setAttempt(a => a + 1);}}>RETRY LOADING</button>
      <button className={styles.secondary} onClick={leave}>BACK TO ARCHERY</button>
    </>, 'Game unavailable')}
    {status === 'menu' && <div className={styles.credit}>Scenery and sounds: Poly Haven, ambientCG and freesound contributors (CC0).</div>}
    {notice && <div role="status" className={styles.notice}>{notice}<button className={styles.chip} onClick={() => setNotice('')}>Dismiss</button></div>}
    <div className={styles.rotate} role="status"><b>Turn your device sideways.</b><span>Longbow plays in landscape. Resume once it is turned.</span></div>
  </section>;
}
