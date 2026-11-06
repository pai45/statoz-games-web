"use client";

import {useCallback, useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode} from 'react';
import {closeMenuDisclosure} from '../shared/menu-disclosure';
import {BOWLERS, COACH, DELIVERIES, FIELD_NAMES, LESSONS, PITCHES, SPELLS, TEAMS, TIERS, VENUES, batterById, challengeById, quickMatch, type BowlerKind, type Challenge, type CoachStep, type DeliveryId, type FieldPreset, type Weakness} from './data';
import {
  APPEAL, EARLY_EDGE, OVERSTEP, REVIEW_WINDOW, STEP, SWEET, TARGET_BOUNDS, TRACKING, ballsLeft, meterAt, newMatch, overText, perfectWindow, review, setDelivery, setField, setTarget, skip, startRunUp, step, strikerBatter, nonStrikerBatter, tapRelease,
  type Match,
} from './engine';
import {lengthName} from './batting';
import {SAVE_KEY, emptySave, readSave, record, resumed, totalStars, type Save} from './save';
import type {YorkerView} from './renderer';
import {YorkerAudio} from './audio';
import styles from './screen.module.css';

type Mode = 'loading' | 'menu' | 'career' | 'academy' | 'brief' | 'playing' | 'paused' | 'finished' | 'error';
type Props = {onExit: () => void; onEvent?: (event: {type: string; payload?: Record<string, unknown>}) => void; hostCommand?: {id: number; type: string}};
type Inspect = {snapshot: () => unknown; view: () => unknown; advance?: (seconds: number) => void; act: Record<string, (...args: never[]) => unknown>};
type GameWindow = Window & {__STATOZ_BOOT__?: {assetRoot?: string}; __YORKER_INSPECT__?: Inspect};
const WEAK: Record<Weakness, string> = {short: 'Short ball', full: 'Full length', yorker: 'Yorker', outswing: 'Outswing', inswing: 'Inswing', spin: 'Spin', slower: 'Slower ball', pace: 'Pace'};
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

export function YorkerGame({onExit, onEvent, hostCommand}: Props) {
  const canvas = useRef<HTMLCanvasElement>(null), root = useRef<HTMLElement>(null), view = useRef<YorkerView | null>(null);
  const match = useRef<Match | null>(null), mode = useRef<Mode>('loading'), save = useRef<Save>(emptySave()), blocked = useRef(false), events = useRef(onEvent);
  const [status, setStatus] = useState<Mode>('loading'), [progress, setProgress] = useState<Save>(emptySave()), [hud, setHud] = useState<Match | null>(null);
  /** Render from a snapshot of the mutable match, refreshed by the loop and by input. */
  const tick = useCallback(() => setHud(match.current ? {...match.current} : null), []);
  const [notice, setNotice] = useState(''), [error, setError] = useState(''), [tier, setTier] = useState(0), [attempt, setAttempt] = useState(0);
  const [brief, setBrief] = useState<{challenge: Challenge; quickSeed: number | null} | null>(null);
  const brief0 = useRef<Challenge | null>(SPELLS[0]);
  const [coach, setCoach] = useState(0);
  const coachRef = useRef(0), coachBase = useRef({checkpoint: 0, target: {x: 0, z: 0}});
  const lastCheckpoint = useRef(-1), resultSent = useRef<string | null>(null), resumeMode = useRef<Mode>('playing'), drag = useRef<{id: number; start: {x: number; z: number}; from: {x: number; z: number}; moved: boolean} | null>(null);
  const [audio] = useState(() => new YorkerAudio());
  const setMode = useCallback((next: Mode) => {mode.current = next; setStatus(next); audio.setCrowd(next === 'playing' ? 1 : .55);}, [audio]);
  const persist = useCallback((next: Save) => {
    save.current = next; setProgress(next);
    if (blocked.current) return;
    try {localStorage.setItem(SAVE_KEY, JSON.stringify(next));} catch {setNotice('Progress is temporary. This browser could not save it.');}
  }, []);
  const pause = useCallback(() => {if (mode.current === 'playing') {setMode('paused'); audio.suspend();}}, [audio, setMode]);
  const resume = useCallback(() => {if (mode.current === 'paused' && innerWidth >= innerHeight) {setMode(resumeMode.current); if (save.current.sound) audio.resume(); canvas.current?.focus();}}, [audio, setMode]);
  const unlock = useCallback(() => {if (save.current.sound) audio.unlock();}, [audio]);
  useEffect(() => {events.current = onEvent;}, [onEvent]);

  /* ---------- Coach (Academy) ---------- */
  const advanceCoach = useCallback(() => {coachRef.current++; setCoach(coachRef.current); const m = match.current; if (m) coachBase.current = {checkpoint: m.checkpoint, target: {...m.plan.target}};}, []);
  const coachCheck = useCallback(() => {
    const m = match.current; if (!m?.challenge.lesson) return;
    const s = COACH[m.challenge.lesson][coachRef.current]; if (!s) return;
    const z = s.zone ?? (m.challenge.objective.type === 'target' ? m.challenge.objective.zone : null), t = m.plan.target;
    const inZone = !!z && t.x >= z.xMin && t.x <= z.xMax && t.z >= z.zMin && t.z <= z.zMax;
    const done = s.until === 'zone' ? inZone : s.until === 'target' ? (z ? inZone : Math.hypot(t.x-coachBase.current.target.x, t.z-coachBase.current.target.z) > .3)
      : s.until === 'delivery' ? m.plan.delivery === s.delivery : s.until === 'bowl' ? m.phase === 'runup' : s.until === 'release' ? m.meter !== null || m.checkpoint > coachBase.current.checkpoint
      : s.until === 'ball' ? m.checkpoint > coachBase.current.checkpoint : false;
    if (done) advanceCoach();
  }, [advanceCoach]);

  const finish = (m: Match) => {
    if (mode.current === 'finished') return;
    persist(record(save.current, m)); setMode('finished'); audio.play(m.result?.won ? 'win' : 'lose');
    const id = save.current.resultId;
    if (id && resultSent.current !== id) {resultSent.current = id; events.current?.({type: 'result', payload: {id, game: 'yorker', challengeId: m.challenge.id, won: !!m.result?.won, stars: m.result?.stars ?? 0, runs: m.runs, wickets: m.wickets, balls: m.legal}});}
  };
  const begin = (challenge: Challenge, opts: {quickSeed?: number | null; continuing?: boolean; seed?: number} = {}) => {
    unlock();
    const existing = opts.continuing ? resumed(save.current) : null;
    const bowler: BowlerKind = challenge.bowler === 'any' ? save.current.bowler : challenge.bowler;
    const m = existing ?? newMatch(challenge, bowler, opts.seed ?? crypto.getRandomValues(new Uint32Array(1))[0], opts.quickSeed ?? null);
    m.assist = save.current.assist;
    match.current = m; lastCheckpoint.current = m.checkpoint;
    coachRef.current = 0; setCoach(0); coachBase.current = {checkpoint: m.checkpoint, target: {...m.plan.target}};
    persist({...record(save.current, m), resultId: opts.continuing && save.current.resultId ? save.current.resultId : crypto.randomUUID()});
    resumeMode.current = 'playing'; setMode(innerHeight > innerWidth ? 'paused' : 'playing'); canvas.current?.focus(); tick();
  };
  const coachBlocks = (m: Match | null) => {const s = m?.challenge.lesson ? COACH[m.challenge.lesson][coachRef.current] : null; return !!s && s.until === 'tap';};

  /* ---------- Boot and loop ---------- */
  useEffect(() => {
    let active = true, frame = 0, last = 0, accumulator = 0, updated = 0, prevPhase = '', prevDecision = '';
    const saved = (() => {try {return readSave(localStorage.getItem(SAVE_KEY));} catch {return {save: emptySave(), incompatible: false};}})();
    save.current = saved.save; blocked.current = saved.incompatible;
    queueMicrotask(() => {if (!active) return; setProgress(saved.save); if (saved.incompatible) setNotice('Saved progress belongs to an incompatible version. It is preserved; this session is temporary.');});
    const boot = async () => {
      let created: YorkerView | null = null;
      try {
        const {YorkerView} = await import('./renderer'); if (!active || !canvas.current) return;
        created = new YorkerView(canvas.current); view.current = created;
        const base = (window as GameWindow).__STATOZ_BOOT__?.assetRoot ?? new URL('../../games/yorker/', location.href).href;
        await Promise.all([created.load(base), audio.preload(base)]); if (!active) {created.dispose(); return;}
        created.onCue = (name, o) => {
          const out = match.current?.current;
          if (name === 'stumps') {audio.play('stumps', o); if (out?.dismissal) audio.play('roar'); return;}
          if (name === 'catch') {audio.play('catch', o); if (out?.dismissal) audio.play('roar'); return;}
          if (name === 'drop') {audio.play('catch', o); audio.play('sigh'); return;}
          if (name === 'boundary') {audio.play(o?.level === 6 ? 'roar' : 'cheer'); return;}
          if (name === 'keeper') {audio.play('keeper', o); if (out?.beaten) audio.play('sigh', {level: .7}); return;}
          if (name === 'edge') {audio.play('edge', o); return;}
          if (name === 'pad') {audio.play('pad', o); return;}
          audio.play(name as never, o);
        };
        setMode('menu'); events.current?.({type: 'ready', payload: {gameId: 'yorker', title: 'Yorker', engine: 'Original Three.js bowling game'}});
        const manual = new URLSearchParams(location.search).get('clock') === 'manual';
        const react = (m: Match) => {
          const o = m.current;
          if (m.phase === 'runup' && prevPhase === 'plan') audio.play('tick');
          if (m.phase === 'delivery' && prevPhase === 'runup' && o?.grade === 'perfect') audio.play('perfect');
          if (m.phase === 'between' && prevPhase === 'delivery' && o && o.runs > 0 && o.runs < 4) audio.play('applause', {level: .5+o.runs*.15});
          if (m.phase === 'appeal' && prevPhase !== 'appeal') audio.play('appeal');
          const decision = m.decision ? `${m.decision.out}:${m.decision.reviewed}` : '';
          if (decision !== prevDecision && m.decision && (m.phase === 'between' || m.phase === 'tracking' || m.phase === 'review')) {
            if (m.phase !== 'tracking') audio.play(m.decision.out ? 'roar' : 'sigh', {level: m.decision.out ? 1 : .8});
          }
          if (m.phase === 'between' && prevPhase === 'tracking' && m.decision) audio.play(m.decision.out ? 'roar' : 'sigh');
          prevDecision = decision;
        };
        const tickFrame = (now: number) => {
          if (!active) return;
          const dt = last ? Math.min(.1, (now-last)/1000) : 0; last = now;
          const m = match.current;
          if (mode.current === 'playing' && m) {
            accumulator += manual ? 0 : dt;
            while (accumulator+1e-9 >= STEP) {step(m); accumulator -= STEP; if (m.phase !== prevPhase) {react(m); prevPhase = m.phase;}}
            if (m.checkpoint !== lastCheckpoint.current) {lastCheckpoint.current = m.checkpoint; persist(record(save.current, m)); coachCheck();}
            if (m.phase === 'finished') finish(m);
            if (now-updated > 66) {coachCheck(); tick(); updated = now;}
          } else accumulator = 0;
          created!.draw(m && mode.current !== 'menu' && mode.current !== 'career' && mode.current !== 'academy' && mode.current !== 'brief' ? m : null, now/1000, {reduced: save.current.reducedMotion, menuVenue: brief0.current ? VENUES[brief0.current.venue] : undefined, menuTeam: brief0.current?.team});
          frame = requestAnimationFrame(tickFrame);
        };
        (window as GameWindow).__YORKER_INSPECT__ = {
          snapshot: () => {const m = match.current; return {mode: mode.current, coach: coachRef.current, save: JSON.parse(JSON.stringify(save.current)), match: m ? {phase: m.phase, age: m.age, runs: m.runs, wickets: m.wickets, legal: m.legal, checkpoint: m.checkpoint, plan: m.plan, meter: m.meter, freeHit: m.freeHit, reviews: m.reviews, result: m.result, decision: m.decision, current: m.current ? {title: m.current.title, detail: m.current.detail, grade: m.current.grade, speed: m.current.speedKmh, bounce: m.current.bounce, dismissal: m.current.dismissal, lbw: m.current.lbw ? {appeal: m.current.lbw.appeal, out: m.current.lbw.out} : null, shot: m.current.bat?.shot ?? null, contact: m.current.bat?.contact ?? null, runs: m.current.runs} : null, results: m.results} : null};},
          view: () => created!.inspection(),
          act: {
            target: (x: number, z: number) => {if (match.current) setTarget(match.current, x, z);},
            delivery: (id: DeliveryId) => {if (match.current) setDelivery(match.current, id);},
            field: (f: FieldPreset) => {if (match.current) setField(match.current, f);},
            bowl: () => match.current ? startRunUp(match.current) : false,
            release: () => match.current ? tapRelease(match.current) : false,
            /** Release at a chosen meter value (tests): steps the clock to that needle position. */
            releaseAt: (meter: number) => {const m = match.current; if (!m || m.phase !== 'runup') return false; while (m.phase === 'runup' && meterAt(m) < meter) step(m); return tapRelease(m);},
            review: (take: boolean) => match.current ? review(match.current, take) : false,
            /** Start a spell or lesson by id (tests and cover capture). */
            start: (id: string, seed?: number) => {const c = challengeById(id); if (c) begin(c, {seed});},
          },
          ...(manual ? {advance: (seconds: number) => {const m = match.current; if (!m || mode.current !== 'playing') return; for (let i = 0; i < Math.round(Math.min(seconds, 30)/STEP); i++) {step(m); if (m.phase !== prevPhase) {react(m); prevPhase = m.phase;} if (m.phase === 'finished') break;} if (m.checkpoint !== lastCheckpoint.current) {lastCheckpoint.current = m.checkpoint; persist(record(save.current, m));} coachCheck(); if (m.phase === 'finished') finish(m); created!.draw(m, performance.now()/1000, {reduced: save.current.reducedMotion}); tick();}} : {}),
        };
        frame = requestAnimationFrame(tickFrame);
      } catch (e) {created?.dispose(); if (active) {view.current = null; setError(e instanceof Error ? e.message : String(e)); setMode('error');}}
    };
    void boot();
    const onLost = (e: Event) => {e.preventDefault(); setError('The graphics context was interrupted. Reload to continue from your last completed ball.'); setMode('error'); cancelAnimationFrame(frame);};
    const element = canvas.current; element?.addEventListener('webglcontextlost', onLost);
    return () => {active = false; cancelAnimationFrame(frame); element?.removeEventListener('webglcontextlost', onLost); view.current?.dispose(); view.current = null; delete (window as GameWindow).__YORKER_INSPECT__;};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempt, audio, persist, setMode, coachCheck, tick]);


  /* ---------- Input ---------- */
  const bowl = useCallback(() => {const m = match.current; if (m && mode.current === 'playing' && startRunUp(m)) {unlock(); tick();}}, [unlock, tick]);
  const release = useCallback(() => {const m = match.current; if (m && mode.current === 'playing' && tapRelease(m)) tick();}, [tick]);
  const nudge = useCallback((dx: number, dz: number) => {const m = match.current; if (m && m.phase === 'plan') {setTarget(m, m.plan.target.x+dx, m.plan.target.z+dz); tick();}}, [tick]);
  useEffect(() => {
    const keyboard = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement && e.target.closest('input,select,textarea')) return;
      const m = match.current;
      if (['Escape', 'KeyP'].includes(e.code)) {e.preventDefault(); if (mode.current === 'paused') resume(); else if (['career','academy','brief'].includes(mode.current)) setMode('menu'); else pause(); return;}
      if (mode.current !== 'playing' || !m) return;
      const off = strikerBatter(m)?.hand === 'L' ? -1 : 1;
      const map: Record<string, [number, number]> = {ArrowLeft: [.05*off, 0], KeyA: [.05*off, 0], ArrowRight: [-.05*off, 0], KeyD: [-.05*off, 0], ArrowUp: [0, .25], KeyW: [0, .25], ArrowDown: [0, -.25], KeyS: [0, -.25]};
      if (map[e.code] && m.phase === 'plan') {e.preventDefault(); nudge(map[e.code][0], map[e.code][1]); return;}
      if (e.repeat) return;
      if (/^Digit[1-4]$/.test(e.code) && m.phase === 'plan') {const id = m.bowler.deliveries[Number(e.code.slice(5))-1]; if (id) {setDelivery(m, id); audio.play('click'); tick();} return;}
      if (e.code === 'KeyF' && m.phase === 'plan') {const order: FieldPreset[] = ['attack', 'balanced', 'defend']; setField(m, order[(order.indexOf(m.plan.field)+1)%3]); audio.play('click'); tick(); return;}
      if (e.code === 'KeyR' && m.phase === 'review') {review(m, true); tick(); return;}
      if (e.code === 'KeyN' && m.phase === 'review') {review(m, false); tick(); return;}
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        if (m.phase === 'plan') {if (coachBlocks(m)) return; bowl();} else if (m.phase === 'runup') release(); else if (skip(m)) tick();
      }
    };
    const interrupt = () => pause(), visibility = () => {if (document.hidden) pause();}, rotate = () => {if (innerHeight > innerWidth) pause();};
    window.addEventListener('keydown', keyboard); window.addEventListener('blur', interrupt); window.addEventListener('resize', rotate); document.addEventListener('visibilitychange', visibility);
    return () => {window.removeEventListener('keydown', keyboard); window.removeEventListener('blur', interrupt); window.removeEventListener('resize', rotate); document.removeEventListener('visibilitychange', visibility);};
  }, [audio, bowl, nudge, pause, release, resume, tick, setMode]);
  useEffect(() => {if (!hostCommand) return; const t = setTimeout(() => {if (hostCommand.type === 'pause') pause(); else if (hostCommand.type === 'resume') resume(); else if (hostCommand.type === 'dispose') audio.suspend();}, 0); return () => clearTimeout(t);}, [audio, hostCommand, pause, resume]);
  useEffect(() => () => audio.close(), [audio]);
  // Focus trap for dialogs.
  useEffect(() => {
    if (['playing', 'loading', 'error'].includes(status)) return;
    const panel = root.current?.querySelector<HTMLElement>('[role="dialog"]'); panel?.querySelector<HTMLButtonElement>('[data-primary],button')?.focus();
    const trap = (e: KeyboardEvent) => {if (e.key !== 'Tab' || !panel) return; const items = Array.from(panel.querySelectorAll<HTMLElement>('button:not(:disabled),input,summary,select,a[href]')).filter(item => item.getClientRects().length > 0 && (!item.closest('details:not([open])') || item.tagName === 'SUMMARY')); const first = items[0], last = items.at(-1); if (e.shiftKey && document.activeElement === first) {e.preventDefault(); last?.focus();} else if (!e.shiftKey && document.activeElement === last) {e.preventDefault(); first?.focus();}};
    document.addEventListener('keydown', trap); return () => document.removeEventListener('keydown', trap);
  }, [status]);

  /** Pointer on the field: drag moves the target (planning), a tap releases (run-up) or skips (replays). */
  const pointerDown = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    const m = match.current; if (!m || mode.current !== 'playing') return;
    unlock();
    if (m.phase === 'runup') {release(); return;}
    if (m.phase !== 'plan') {if (skip(m)) tick(); return;}
    const p = pitchAt(e); if (!p) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = {id: e.pointerId, start: p, from: {...m.plan.target}, moved: false};
  };
  const pointerMove = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    const d = drag.current, m = match.current; if (!d || d.id !== e.pointerId || !m || m.phase !== 'plan') return;
    const p = pitchAt(e); if (!p) return;
    if (Math.hypot(p.x-d.start.x, p.z-d.start.z) > .05) d.moved = true;
    if (d.moved) {setTarget(m, d.from.x+(p.x-d.start.x), d.from.z+(p.z-d.start.z)*.8); tick();}
  };
  const pointerUp = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    const d = drag.current, m = match.current; drag.current = null; if (!d || !m || m.phase !== 'plan') return;
    if (!d.moved) {const p = pitchAt(e); if (p && p.z > TARGET_BOUNDS.zMin-2 && p.z < 1 && Math.abs(p.x) < 2.5) {setTarget(m, p.x, p.z); tick();}}
  };
  const pitchAt = (e: ReactPointerEvent<HTMLElement>) => {
    const r = canvas.current!.getBoundingClientRect(), p = view.current?.pitchPoint((e.clientX-r.left)/r.width*2-1, -((e.clientY-r.top)/r.height*2-1));
    return p ? {x: p.x, z: p.z} : null;
  };
  /** The mini pitch map doubles as a precise target pad: top is the batter's stumps, left is a right-hander's off side. */
  const mapPoint = (e: ReactPointerEvent<SVGSVGElement>) => {
    const m = match.current; if (!m || m.phase !== 'plan') return;
    const r = e.currentTarget.getBoundingClientRect(), u = (e.clientX-r.left)/r.width, v = (e.clientY-r.top)/r.height;
    setTarget(m, (.5-u)*3.2, -v*13.4); tick();
  };

  /* ---------- Flow ---------- */
  const openBrief = (challenge: Challenge, quickSeed: number | null = null) => {brief0.current = challenge; setBrief({challenge, quickSeed}); setMode('brief');};
  const toMenu = () => {match.current = null; setMode('menu'); tick();};
  const leave = () => {audio.suspend(); onExit();};
  const setPref = (patch: Partial<Save>) => {persist({...save.current, ...patch}); if ('sound' in patch) audio.setEnabled(!!patch.sound); if ('assist' in patch && match.current) match.current.assist = !!patch.assist;};

  /* ---------- Render ---------- */
  const m = hud, o = m?.current ?? null, phase = m?.phase ?? null;
  const active = status === 'playing' || status === 'paused' || status === 'finished';
  const batter = m ? strikerBatter(m) : null, partner = m ? nonStrikerBatter(m) : null, off = batter?.hand === 'L' ? -1 : 1;
  const bState = m && m.striker >= 0 ? m.batters[m.striker] : null, pState = m && m.nonStriker >= 0 ? m.batters[m.nonStriker] : null;
  const team = m ? TEAMS[m.challenge.team] : null;
  const resumable = useMemo(() => progress.checkpoint ? resumed(progress) : null, [progress]);
  const canContinue = !!resumable;
  const panel = (children: ReactNode, label: string, extra = '') => <div className={`${styles.scrim} ${extra}`}><article className={styles.panel} role="dialog" aria-modal="true" aria-label={label}>{children}</article></div>;
  const objective = m ? objectiveLine(m) : null;
  const overBalls = m ? overHistory(m) : [];
  // Once released, the needle locks where the player tapped.
  const meter = m?.meter ?? (m && phase === 'runup' ? meterAt(m) : 0);
  const pw = m ? perfectWindow(m) : .045;
  const t = m?.plan.target, lenLabel = t ? lengthName(t.z) : '', lineLabel = t ? lineName(t.x*off) : '';
  const lessonSteps: CoachStep[] = m?.challenge.lesson ? COACH[m.challenge.lesson] : [];
  const coachNow = active ? lessonSteps[coach] ?? null : null;
  const stars = totalStars(progress);
  const nextSpell = SPELLS[Math.min(progress.unlocked, SPELLS.length - 1)];
  const current = m?.challenge;
  const decision = m?.decision;

  return <section onKeyDownCapture={closeMenuDisclosure} className={styles.root} ref={root} data-yorker data-mode={status} data-phase={phase ?? ''} onPointerDownCapture={e => {const b = (e.target as HTMLElement).closest('button,label'); if (b) {unlock(); audio.play('click');}}}>
    <canvas ref={canvas} className={styles.canvas} tabIndex={0} aria-label="Yorker 3D cricket ground. Drag to aim, then bowl." onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerUp} onPointerCancel={() => {drag.current = null;}}/>
    <div className={styles.vignette}/>
    <header className={styles.header}>
      <button className={styles.ghost} aria-label="Back to Cricket" onClick={leave}>← <span>EXIT</span></button>
      {!active && status !== 'menu' && <div className={styles.brand}>YORKER<span>BOWLING · 3D CRICKET</span></div>}
      <div className={styles.tools}>
        {status === 'playing' && <button className={styles.ghost} onClick={pause} aria-label="Pause game">❚❚</button>}
        <button className={styles.ghost} aria-label={progress.sound ? 'Mute sound' : 'Enable sound'} onClick={() => setPref({sound: !save.current.sound})}>{progress.sound ? 'SOUND ON' : 'SOUND OFF'}</button>
      </div>
    </header>

    {active && m && current && <>
      <div className={styles.scorebug} aria-label="Score">
        <div className={styles.bugTeam}><i style={{background: team?.shirt}}/>{team?.short ?? 'ACADEMY'}</div>
        <div className={styles.bugScore}>{m.runs}<small>/{m.wickets}</small></div>
        <div className={styles.bugOvers}>{overText(m.legal)}<small> OV</small></div>
        {objective && <div className={styles.bugTarget}><b>{objective.main}</b><span>{objective.sub}</span></div>}
        {m.freeHit && <div className={styles.freeHit}>FREE HIT</div>}
      </div>
      <div className={styles.venueTag}><b>{current.lesson ? 'BOWLING ACADEMY' : current.name}</b><span>{VENUES[current.venue].short} · {PITCHES[current.pitch].name}</span></div>
      {batter && bState && <aside className={styles.batter} data-focus={coachNow?.focus === 'batter' || undefined}>
        <span className={styles.label}>ON STRIKE · {batter.hand === 'L' ? 'LEFT-HANDED' : 'RIGHT-HANDED'}</span>
        <h3>{batter.name}<em>{bState.runs}<small>({bState.balls})</small></em></h3>
        <p>{batter.scouting}</p>
        <div className={styles.chips}>{Object.entries(batter.weak).sort((a, b) => (b[1] ?? 0)-(a[1] ?? 0)).slice(0, 3).map(([k]) => <i key={k}>{WEAK[k as Weakness]}</i>)}</div>
        {partner && pState && <footer>{partner.name} <b>{pState.runs}</b><small>({pState.balls})</small></footer>}
      </aside>}
      <aside className={styles.over} aria-label="This over">
        <span className={styles.label}>THIS OVER</span>
        <div>{overBalls.map((b, i) => <i key={i} data-tone={b.tone}>{b.text}</i>)}{Array.from({length: Math.max(0, 6-overBalls.filter(b => b.legal).length)}).map((_, i) => <i key={'e'+i} data-empty/>)}</div>
        <footer><span>DRS</span>{Array.from({length: m.reviews.bowling}).map((_, i) => <b key={i}/>)}{m.reviews.bowling === 0 && <em>NONE</em>}</footer>
      </aside>

      {status === 'playing' && phase === 'plan' && <div className={styles.plan}>
        <div className={styles.cards} data-focus={coachNow?.focus === 'cards' || undefined} role="radiogroup" aria-label="Delivery">
          {m.bowler.deliveries.map((id, i) => {const d = DELIVERIES[id]; return <button key={id} role="radio" aria-checked={m.plan.delivery === id} onClick={() => {setDelivery(m, id); tick();}}>
            <Movement id={id} off={off}/><b>{d.name}</b><small>{Math.round(d.speed)} KM/H · {i+1}</small>
          </button>;})}
        </div>
        <div className={styles.planSide}>
          <div className={styles.fieldPick} data-focus={coachNow?.focus === 'field' || undefined} role="radiogroup" aria-label="Field setting">{(['attack', 'balanced', 'defend'] as FieldPreset[]).map(f => <button key={f} role="radio" aria-checked={m.plan.field === f} onClick={() => {setField(m, f); tick();}}>{FIELD_NAMES[f]}</button>)}</div>
          <div className={styles.aim}><b>{lenLabel}</b><span>{lineLabel} · {Math.abs(t?.z ?? 0).toFixed(1)} M</span></div>
          <button className={styles.bowl} data-primary data-focus={coachNow?.focus === 'bowl' || undefined} disabled={!!coachNow && coachNow.until === 'tap'} onClick={bowl}>BOWL <span>SPACE</span></button>
        </div>
        <p className={styles.hint}>{DELIVERIES[m.plan.delivery].tip}</p>
      </div>}
      {status === 'playing' && (phase === 'plan' || phase === 'between') && <PitchMap m={m} focus={coachNow?.focus === 'map' || coachNow?.focus === 'pitch'} onPick={mapPoint}/>}
      {status === 'playing' && phase === 'runup' && <div className={styles.meter} data-focus={coachNow?.focus === 'meter' || undefined} aria-label="Release meter">
        <div className={styles.meterBar}>
          <i style={{left: 0, width: `${EARLY_EDGE/1.05*100}%`}} data-zone="early"/>
          <i style={{left: `${EARLY_EDGE/1.05*100}%`, width: `${(SWEET-pw-EARLY_EDGE)/1.05*100}%`}} data-zone="good"/>
          <i style={{left: `${(SWEET-pw)/1.05*100}%`, width: `${2*pw/1.05*100}%`}} data-zone="perfect"/>
          <i style={{left: `${(SWEET+pw)/1.05*100}%`, width: `${(OVERSTEP-SWEET-pw)/1.05*100}%`}} data-zone="late"/>
          <i style={{left: `${OVERSTEP/1.05*100}%`, width: `${(1.05-OVERSTEP)/1.05*100}%`}} data-zone="noball"/>
          <b style={{left: `${clamp(meter, 0, 1.05)/1.05*100}%`}} data-locked={m.meter !== null || undefined}/>
        </div>
        <span>{m.meter !== null ? 'RELEASED' : 'TAP OR PRESS SPACE IN THE GOLD'}</span>
      </div>}
      {status === 'playing' && o && (phase === 'delivery' || phase === 'between' || phase === 'appeal' || phase === 'review' || phase === 'tracking') && <>
        {phase !== 'review' && phase !== 'tracking' && <div className={styles.speed}><b>{o.speedKmh.toFixed(1)}<small> KM/H</small></b><span data-grade={o.grade}>{({perfect: 'PERFECT RELEASE', good: 'GOOD RELEASE', late: 'LATE RELEASE', early: 'EARLY RELEASE', 'no-ball': 'OVERSTEPPED'} as const)[o.grade]}</span><em>{o.length.toUpperCase()}</em></div>}
        {(phase === 'between' || (phase === 'delivery' && m.age > resultAt(o)) || phase === 'appeal') && <div className={styles.banner} data-tone={phase === 'appeal' ? 'appeal' : o.tone} key={`${m.checkpoint}-${phase === 'appeal' ? 'a' : 'b'}-${o.title}`}>
          <strong>{phase === 'appeal' ? 'HOWZAT?' : o.title}</strong><span>{phase === 'appeal' ? (m.age > APPEAL-.6 ? (o.umpireOut ? 'The finger goes up!' : 'Not out, says the umpire') : 'Huge appeal for LBW') : o.detail}</span>
          {phase === 'delivery' && o.hit && <button className={styles.skip} onClick={() => {if (skip(m)) tick();}}>SKIP →</button>}
        </div>}
      </>}
      {status === 'playing' && phase === 'review' && decision && <div className={styles.review} role="alertdialog" aria-label="Review the decision">
        <span className={styles.label}>ON-FIELD DECISION</span><strong>NOT OUT</strong><p>Was it hitting the stumps? Ball tracking decides. You have {m.reviews.bowling} review.</p>
        <div><button className={styles.primary} data-primary onClick={() => {review(m, true); tick();}}>REVIEW <span>R</span></button><button className={styles.secondary} onClick={() => {review(m, false); tick();}}>ACCEPT <span>N</span></button></div>
        <i style={{width: `${(1-m.age/REVIEW_WINDOW)*100}%`}}/>
      </div>}
      {status === 'playing' && phase === 'tracking' && o?.lbw && decision && <Tracking m={m}/>}
      {coachNow && status === 'playing' && <div className={styles.coach} data-wide={coachNow.until === 'tap' || undefined}>
        <span className={styles.label}>COACH · {coach+1}/{lessonSteps.length}</span><p>{coachNow.text}</p>
        {coachNow.until === 'tap' && <button className={styles.primary} data-primary onClick={advanceCoach}>GOT IT</button>}
      </div>}
      {!coachNow && m.challenge.lesson && status === 'playing' && objective && <div className={styles.goal}><span className={styles.label}>GOAL</span><b>{objective.main}</b></div>}
    </>}

    {status === 'menu' && <main className={styles.menu} role="dialog" aria-modal="true" aria-label="Yorker main menu" data-ui-role="game-lobby">
      <div className={styles.hero}>
        <div className={styles.eyebrow}><i/>ORIGINAL 3D CRICKET · YOU BOWL</div>
        <h1>YORKER</h1>
        <p>Pick a delivery, hit your length and outthink the batter.</p>
        <div className={styles.menuActions}>
          {canContinue && resumable ? <button data-primary className={styles.primary} onClick={() => begin(resumable.challenge, {continuing: true, quickSeed: resumable.quickSeed})}>CONTINUE SPELL <span>↗</span></button> : <button data-primary className={styles.primary} onClick={() => openBrief(nextSpell)}>PLAY {nextSpell.name.toUpperCase()} <span>↗</span></button>}
          <button className={styles.secondary} onClick={() => setMode('career')}>BROWSE SPELLS <span>{stars}/{SPELLS.length*3} ★</span></button>
          <button className={styles.secondary} onClick={() => setMode('academy')}>ACADEMY <span>{progress.lessons.length}/{LESSONS.length}</span></button>
        </div>
      </div>
    </main>}

    {status === 'career' && panel(<>
      <div className={styles.panelTop}><span className={styles.eyebrow}><i/>CAREER · {stars}/{SPELLS.length*3} STARS</span><button className={styles.ghost} onClick={() => setMode('menu')}>BACK</button></div>
      <h2>TWELVE SPELLS.<br/><em>ONE BALL AT A TIME.</em></h2>
      <div className={styles.tabs} role="tablist">{TIERS.map((name, i) => <button role="tab" aria-selected={tier === i} key={name} onClick={() => setTier(i)}>{String(i+1).padStart(2, '0')} · {name}</button>)}</div>
      <button className={styles.secondary} onClick={() => {const seed = crypto.getRandomValues(new Uint32Array(1))[0]; openBrief(quickMatch(seed), seed);}}>QUICK MATCH</button>
      <div className={styles.spells}>{SPELLS.filter(c => c.tier === tier).map(c => {const index = SPELLS.indexOf(c), locked = index > progress.unlocked, rec = progress.spells[c.id]; return <button key={c.id} data-primary={index === Math.min(progress.unlocked, SPELLS.length-1) || undefined} disabled={locked} onClick={() => openBrief(c)} aria-label={`${c.name}. ${c.brief}${locked ? ' Locked.' : ''}`}>
        <span className={styles.spellTop}><b>{String(index+1).padStart(2, '0')}</b><i>{locked ? 'LOCKED' : rec?.stars ? <span aria-label={`${rec.stars} stars`}>{[0, 1, 2].map(i => <Star key={i} on={i < rec.stars} small/>)}</span> : 'NEW'}</i></span>
        <h3>{c.name}</h3><p>{c.brief}</p>
        <footer><span>{objectiveShort(c)}</span><span>{c.bowler === 'any' ? 'ANY BOWLER' : BOWLERS[c.bowler].title} · {VENUES[c.venue].short}</span></footer>
      </button>;})}</div>
      <p className={styles.footnote}>Win a spell to unlock the next. Stars reward economy and wickets. Progress stays on this device.</p>
    </>, 'Career spells', styles.wide)}

    {status === 'academy' && panel(<>
      <div className={styles.panelTop}><span className={styles.eyebrow}><i/>BOWLING ACADEMY</span><button className={styles.ghost} onClick={() => setMode('menu')}>BACK</button></div>
      <h2>LEARN TO<br/><em>TAKE WICKETS.</em></h2>
      <div className={styles.lessons}>{LESSONS.map((c, i) => <button key={c.id} onClick={() => begin(c)}><b>0{i+1}</b><div><h3>{c.name}</h3><p>{c.brief}</p></div><i>{progress.lessons.includes(c.id) ? '✓' : '→'}</i></button>)}</div>
    </>, 'Bowling Academy lessons', styles.wide)}

    {status === 'brief' && brief && panel(<Brief challenge={brief.challenge} save={progress} onBowler={k => setPref({bowler: k})} onStart={() => begin(brief.challenge, {quickSeed: brief.quickSeed})} onBack={() => setMode(brief.challenge.id === 'quick' ? 'menu' : 'career')}/>, 'Spell briefing', styles.wide)}

    {status === 'paused' && panel(<>
      <span className={styles.eyebrow}><i/>PAUSED</span><h2>SPELL<br/><em>PAUSED.</em></h2>
      <details><summary>SETTINGS</summary><label><span>Sound</span><input type="checkbox" checked={progress.sound} onChange={e => setPref({sound: e.target.checked})}/></label>
      <label><span>Reduced camera motion</span><input type="checkbox" checked={progress.reducedMotion} onChange={e => setPref({reducedMotion: e.target.checked})}/></label>
      <label><span>Release assist (wider gold zone)</span><input type="checkbox" checked={progress.assist} onChange={e => setPref({assist: e.target.checked})}/></label>
      </details>
      <details><summary>HELP</summary><p>Choose a delivery, drag the target, then tap in the gold to release.</p></details>
      <button data-primary className={styles.primary} onClick={resume}>RESUME →</button>
      <button className={styles.secondary} onClick={toMenu}>EXIT TO MENU</button>
    </>, 'Yorker paused')}

    {status === 'finished' && m && m.result && panel(<>
      <span className={styles.eyebrow}><i/>{m.challenge.lesson ? 'ACADEMY' : m.challenge.name.toUpperCase()}</span>
      <h2>{m.result.won ? (m.challenge.lesson ? 'LESSON' : 'SPELL') : 'NOT THIS'}<br/><em>{m.result.won ? 'COMPLETE.' : 'TIME.'}</em></h2>
      {!m.challenge.lesson && <div className={styles.stars} aria-label={`${m.result.stars} stars`}>{[0, 1, 2].map(i => <Star key={i} on={i < m.result!.stars}/>)}</div>}
      <p>{m.result.reason}.</p>
      <div className={styles.summary}><div><b>{m.runs}</b><span>RUNS</span></div><div><b>{m.wickets}</b><span>WICKETS</span></div></div>
      <details><summary>MATCH DETAILS</summary><div className={styles.summary}><div><b>{m.legal}</b><span>BALLS</span></div><div><b>{m.results.filter(r => r.legal && r.runs === 0 && !r.extras).length}</b><span>DOTS</span></div><div><b>{Math.max(0, ...m.results.map(r => r.speed)).toFixed(0)}</b><span>FASTEST</span></div></div></details>
      <button data-primary className={styles.primary} onClick={() => {const list = m.challenge.lesson ? LESSONS : SPELLS, i = list.findIndex(c => c.id === m.challenge.id), next = m.result!.won && list[i+1] ? list[i+1] : null; if (m.challenge.id === 'quick') {const seed = crypto.getRandomValues(new Uint32Array(1))[0]; openBrief(quickMatch(seed), seed);} else if (next && !m.challenge.lesson) openBrief(next); else begin(next ?? m.challenge, {quickSeed: m.quickSeed});}}>{m.result.won && m.challenge.id !== 'quick' ? 'NEXT →' : m.challenge.id === 'quick' ? 'NEW QUICK MATCH →' : 'TRY AGAIN →'}</button>
      <button className={styles.secondary} onClick={toMenu}>MENU</button>
    </>, 'Spell result')}

    {status === 'loading' && <div className={styles.scrim} role="status"><div className={styles.loading}>YORKER<span>PREPARING THE PITCH…</span><i/></div></div>}
    {status === 'error' && panel(<><span className={styles.eyebrow}><i/>RAIN DELAY</span><h2>THE GROUND<br/><em>DIDN’T LOAD.</em></h2><p>{error}</p><button className={styles.primary} onClick={() => {setMode('loading'); setError(''); setAttempt(a => a+1);}}>RETRY</button><button className={styles.secondary} onClick={leave}>BACK TO CRICKET</button></>, 'Game unavailable')}
    {(status === 'menu' || status === 'brief') && <div className={styles.credit}>Players: <a href="https://sketchfab.com/3d-models/virat-kohli-cricket-batting-animation-low-poly-a21f5e7ee14f4b6aa5cf6c94a1016932" target="_blank" rel="noreferrer">bhagathartworks</a> (CC BY 4.0) · Gear and stumps: 3DAssets.dev (CC0) · Skies: Poly Haven (CC0)</div>}
    {notice && <div role="status" className={styles.notice}>{notice}<button onClick={() => setNotice('')}>Dismiss</button></div>}
    <div className={styles.rotate} role="status"><b>TURN FOR THE OVER.</b><span>Hold your device in landscape, then resume.</span></div>
  </section>;
}

/* ---------- Pieces ---------- */
function Star({on, small}: {on: boolean; small?: boolean}) {
  return <svg className={small ? styles.starSmall : styles.star} data-on={on || undefined} viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.6l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.4l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z"/></svg>;
}
function resultAt(o: NonNullable<Match['current']>) {
  const stop = o.events.find(e => e.type === 'stumps' || e.type === 'catch' || e.type === 'boundary' || e.type === 'keeper' || e.type === 'pad' || e.type === 'body' || e.type === 'field' || e.type === 'drop');
  return (stop?.t ?? o.end-.6)+.25;
}
function lineName(xOff: number) {
  if (xOff > .55) return 'Wide outside off';
  if (xOff > .16) return 'Outside off';
  if (xOff > .06) return 'Off stump';
  if (xOff > -.06) return 'Middle stump';
  if (xOff > -.16) return 'Leg stump';
  return 'Down leg';
}
function objectiveLine(m: Match): {main: string; sub: string} {
  const obj = m.challenge.objective, left = ballsLeft(m);
  switch (obj.type) {
    case 'defend': return {main: m.runs >= obj.target ? 'TARGET REACHED' : `NEED ${obj.target-m.runs} OFF ${left}`, sub: `TARGET ${obj.target} · ${m.challenge.wicketsInHand-m.wickets} WKTS LEFT`};
    case 'wickets': return {main: `WICKETS ${m.wickets}/${obj.wickets}`, sub: `${left} BALLS LEFT`};
    case 'economy': return {main: `CONCEDED ${m.runs}/${obj.runs}`, sub: `${left} BALLS LEFT`};
    case 'target': return {main: `ON THE SPOT ${m.progress.zone}/${obj.count}`, sub: `${left} BALLS LEFT`};
    case 'release': return {main: `GOOD RELEASES ${m.progress.releases}/${obj.count}`, sub: `${left} BALLS LEFT`};
    case 'beat': return {main: `BEATEN ${Math.min(obj.count, m.progress.beaten)}/${obj.count}`, sub: `${left} BALLS LEFT`};
  }
}
function objectiveShort(c: Challenge) {
  const o = c.objective;
  return o.type === 'defend' ? `DEFEND ${o.target} · ${c.balls} BALLS` : o.type === 'wickets' ? `${o.wickets} WICKET${o.wickets > 1 ? 'S' : ''} · ${c.balls} BALLS` : o.type === 'economy' ? `≤${o.runs} RUNS · ${c.balls} BALLS` : c.brief;
}
function overHistory(m: Match) {
  const over = Math.floor(m.legal/6);
  return m.results.filter(r => r.over === over).map(ballText);
}
function ballText(r: Match['results'][number]) {
  const text = r.wicket ? 'W' : r.extras && !r.legal ? (r.label === 'WIDE' ? 'wd' : 'nb') : r.runs ? String(r.runs) : '•';
  return {text, tone: r.wicket ? 'wicket' : r.runs >= 4 ? 'boundary' : r.extras ? 'extra' : r.runs ? 'runs' : 'dot', legal: r.legal};
}

/** Movement icon: from the bowler (bottom) to the batter (top), as seen from behind the bowler. */
function Movement({id, off}: {id: DeliveryId; off: number}) {
  const d = DELIVERIES[id];
  // World +x is screen left from behind the bowler.
  const air = -Math.sign(d.swing)*off*14, turn = -Math.sign(d.turn)*14*(d.kind === 'spin' ? 1 : .4);
  const path = d.kind === 'spin' ? `M30 56 L30 30 L${30+turn} 6` : d.swing ? `M30 56 Q30 24 ${30+air} 6` : `M30 56 L30 6`;
  return <svg className={styles.move} viewBox="0 0 60 60" aria-hidden="true"><rect x="22" y="2" width="16" height="3" rx="1.5"/><path d={path} data-slow={id === 'slower' || undefined} data-low={id === 'slider' || undefined}/>{d.kind === 'spin' && <circle cx="30" cy="30" r="3"/>}{id === 'topspin' && <path d="M24 30 Q30 18 36 30" data-thin/>}</svg>;
}

function PitchMap({m, focus, onPick}: {m: Match; focus: boolean; onPick: (e: ReactPointerEvent<SVGSVGElement>) => void}) {
  const X = (x: number) => (.5-x/3.2)*46, Y = (z: number) => -z/13.4*100;
  const t = m.plan.target, zone = m.challenge.objective.type === 'target' ? m.challenge.objective.zone : null;
  return <svg className={styles.map} data-focus={focus || undefined} viewBox="0 0 46 100" aria-label="Pitch map: tap to place the target"
    onPointerDown={e => {e.currentTarget.setPointerCapture(e.pointerId); onPick(e);}} onPointerMove={e => {if (e.buttons) onPick(e);}}>
    <rect x={X(1.52)} y="0" width={X(-1.52)-X(1.52)} height="100" data-pitch/>
    {[[2, 3.8, 'FULL'], [3.8, 6.2, 'GOOD'], [6.2, 8.2, 'BACK'], [8.2, 13.4, 'SHORT']].map(([a, b, n]) => <g key={String(n)}><line x1={X(1.52)} x2={X(-1.52)} y1={Y(-Number(a))} y2={Y(-Number(a))}/><text x={X(-1.45)} y={(Y(-Number(a))+Y(-Number(b)))/2}>{n}</text></g>)}
    <line x1={X(1.32)} x2={X(-1.32)} y1={Y(-1.22)} y2={Y(-1.22)} data-crease/>
    <rect x={X(.1143)} y="0" width={X(-.1143)-X(.1143)} height={Y(-.3)} data-stumps/>
    {zone && <rect x={X(zone.xMax)} y={Y(zone.zMax)} width={X(zone.xMin)-X(zone.xMax)} height={Y(zone.zMin)-Y(zone.zMax)} data-zone/>}
    {m.results.filter(r => r.pitch).slice(-12).map((r, i) => <circle key={i} cx={X(r.pitch!.x)} cy={Y(r.pitch!.z)} r="1.6" data-tone={r.tone}/>)}
    <circle cx={X(t.x)} cy={Y(t.z)} r="2.6" data-target/>
  </svg>;
}

function Tracking({m}: {m: Match}) {
  const o = m.current!, lbw = o.lbw!, d = m.decision!, a = m.age;
  const row = (at: number, label: string, value: string, good: boolean | null) => a > at && <div data-verdict={good === null ? 'call' : good ? 'yes' : 'no'}><span>{label}</span><b>{value}</b></div>;
  const pitching = lbw.pitching === 'in-line' ? 'IN LINE' : lbw.pitching === 'outside-off' ? 'OUTSIDE OFF' : lbw.pitching === 'full-toss' ? 'FULL TOSS' : 'OUTSIDE LEG';
  const impact = lbw.impact === 'in-line' ? 'IN LINE' : lbw.impact === 'umpires-call' ? "UMPIRE'S CALL" : lbw.impact === 'outside-off' ? (lbw.shotOffered ? 'OUTSIDE OFF' : 'OUTSIDE · NO SHOT') : 'OUTSIDE LEG';
  const wickets = lbw.wickets === 'hitting' ? 'HITTING' : lbw.wickets === 'umpires-call' ? "UMPIRE'S CALL" : 'MISSING';
  return <div className={styles.tracking} aria-live="polite">
    <span className={styles.label}>BALL TRACKING · {d.reviewed === 'bowling' ? 'YOUR REVIEW' : 'BATTER REVIEW'}</span>
    {row(1.4, 'PITCHING', pitching, lbw.pitching !== 'outside-leg')}
    {row(2.2, 'IMPACT', impact, lbw.impact === 'umpires-call' ? null : lbw.impact === 'in-line' || (lbw.impact === 'outside-off' && !lbw.shotOffered))}
    {row(3, 'WICKETS', wickets, lbw.wickets === 'umpires-call' ? null : lbw.wickets === 'hitting')}
    {a > 3.8 && <strong data-out={d.out || undefined}>{d.out ? 'OUT' : 'NOT OUT'}<small>{d.overturned ? 'DECISION OVERTURNED' : d.retained ? "UMPIRE'S CALL · REVIEW RETAINED" : 'ORIGINAL DECISION STANDS'}</small></strong>}
    <i style={{width: `${Math.min(1, a/TRACKING)*100}%`}}/>
  </div>;
}

function Brief({challenge: c, save, onBowler, onStart, onBack}: {challenge: Challenge; save: Save; onBowler: (k: BowlerKind) => void; onStart: () => void; onBack: () => void}) {
  const venue = VENUES[c.venue], pitch = PITCHES[c.pitch], team = TEAMS[c.team], rec = save.spells[c.id];
  const kind: BowlerKind = c.bowler === 'any' ? save.bowler : c.bowler;
  const star = (r: {maxRuns?: number; minWickets?: number}) => [r.maxRuns !== undefined ? `concede ${r.maxRuns} or fewer` : '', r.minWickets !== undefined ? `take ${r.minWickets}+ wicket${r.minWickets > 1 ? 's' : ''}` : ''].filter(Boolean).join(' and ');
  return <>
    <div className={styles.panelTop}><span className={styles.eyebrow}><i/>{c.id === 'quick' ? 'QUICK MATCH' : `SPELL ${SPELLS.indexOf(c)+1} · ${TIERS[c.tier]}`}</span><button className={styles.ghost} onClick={onBack}>BACK</button></div>
    <div className={styles.briefGrid}>
      <div>
        <h2>{c.name.toUpperCase()}</h2>
        <p className={styles.briefLead}>{c.brief}</p>
        <div className={styles.facts}><span><b>{objectiveShort(c)}</b>OBJECTIVE</span><span><b>{venue.short}</b>{venue.time.toUpperCase()} · {venue.ball.toUpperCase()} BALL</span><span><b>{pitch.name.toUpperCase()}</b>{pitch.note}</span></div>
        {c.id !== 'quick' && <p className={styles.starRules}>2 stars: {star(c.two)} · 3 stars: {star({...c.two, ...c.three})}{rec?.stars ? ` · Best: ${rec.stars} star${rec.stars > 1 ? 's' : ''}` : ''}</p>}
        <div className={styles.prefs}><span>BOWLER</span>{(['pace', 'spin'] as BowlerKind[]).map(k => <button key={k} disabled={c.bowler !== 'any' && c.bowler !== k} aria-pressed={kind === k} onClick={() => onBowler(k)}>{BOWLERS[k].title}<small>{BOWLERS[k].style}</small></button>)}</div>
        <button data-primary className={styles.primary} onClick={onStart}>TAKE THE BALL →</button>
      </div>
      <div className={styles.scout}>
        <span className={styles.label}>SCOUTING · {team.name.toUpperCase()}</span>
        {c.lineup.slice(0, 4).map(id => {const b = batterById(id)!; return <div key={id}><b>{b.name}<small>{b.hand === 'L' ? 'LHB' : 'RHB'}</small></b><p>{b.scouting}</p></div>;})}
        {c.lineup.length === 0 && <div><b>No batter</b><p>Just you, the stumps and the pitch.</p></div>}
      </div>
    </div>
  </>;
}
