'use client';
import { useEffect, useState } from 'react';
import { crews } from './crews';
import { SPLIT_GATES, GATES, deltaLabel, timeLabel, type Medal, type PaceNote, type Session } from './contracts';
import { forwardDistance } from './geometry';
import { noteLabel, upcomingNotes } from './pace-notes';
import { orderedCars, tutorialPrompts } from './simulation';
import styles from './rally.module.css';

/** Tiny pub/sub so only the HUD re-renders on its 10 Hz beat, never the canvas or controls. */
export class HudClock {
    private listeners = new Set<() => void>();
    subscribe(listener: () => void) { this.listeners.add(listener); return () => { this.listeners.delete(listener); }; }
    tick() { for (const listener of this.listeners) listener(); }
}
function useBeat(clock: HudClock) {
    const [, set] = useState(0);
    useEffect(() => clock.subscribe(() => set(n => (n + 1) % 1e6)), [clock]);
}

/** A bend arrow that turns further the tighter the corner: grade 6 barely bends, a hairpin doubles back. */
function bendPath(degrees: number) {
    const r = 13, cx = 37, cy = 40, a = Math.PI + degrees * Math.PI / 180, ex = cx + r * Math.cos(a), ey = cy + r * Math.sin(a), h = a + Math.PI / 2;
    const tx = ex + Math.cos(h) * 12, ty = ey + Math.sin(h) * 12, head = (turn: number) => `${(tx + Math.cos(h + turn) * 11).toFixed(1)} ${(ty + Math.sin(h + turn) * 11).toFixed(1)}`;
    return `M24 60V40A${r} ${r} 0 ${degrees > 180 ? 1 : 0} 1 ${ex.toFixed(1)} ${ey.toFixed(1)}L${tx.toFixed(1)} ${ty.toFixed(1)}M${head(2.6)}L${tx.toFixed(1)} ${ty.toFixed(1)}L${head(-2.6)}`;
}
export function NoteIcon({ note, size = 56 }: { note: PaceNote; size?: number }) {
    let path: string;
    if (note.kind === 'jump') path = 'M4 50h56M8 50l26-20 8 6M42 18l10-7M46 30l13-4';
    else if (note.kind === 'splash') path = 'M32 8c-8 12-13 19-13 27a13 13 0 0 0 26 0c0-8-5-15-13-27zM6 56c6-4 10-4 16 0s10 4 16 0 10-4 20 0';
    else if (note.kind === 'caution') path = 'M32 7L59 55H5zM32 24v13M32 45v2';
    else path = bendPath(note.hairpin ? 178 : [0, 140, 110, 85, 62, 42, 24][note.severity]);
    return <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden="true"><g transform={note.kind === 'left' ? 'translate(64 0) scale(-1 1)' : undefined} fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round"><path d={path} /></g></svg>;
}

const noteName = (note: PaceNote) => note.kind === 'left' || note.kind === 'right' ? `${note.kind} ${note.hairpin ? 'hairpin' : note.severity}` : noteLabel(note).toLowerCase();

export function MedalBadge({ medal, size = 'small' }: { medal: Medal | null; size?: 'small' | 'large' }) {
    if (!medal) return null;
    return <span className={`${styles.medal} ${styles[medal]} ${size === 'large' ? styles.medalLarge : ''}`} aria-label={`${medal} medal`}>{size === 'large' ? medal.toUpperCase() : medal[0].toUpperCase()}</span>;
}

const TOUCH_PROMPTS = ['HOLD GAS TO GET MOVING', 'SLIDE THE LEFT PAD TO STEER', 'HOLD HANDBRAKE + STEER INTO A BEND', 'FOLLOW THE PACE NOTES TO THE FINISH'];

export function Hud({ session: s, clock, touch = false }: { session: Session; clock: HudClock; touch?: boolean }) {
    useBeat(clock);
    const p = s.cars[0], stage = s.stage, stageMode = s.setup.mode === 'stage', active = s.phase === 'running';
    const notes = s.phase === 'running' || s.phase === 'countdown' || s.phase === 'paused' ? upcomingNotes(stage, p.s, p.speed, 2) : [];
    const total = stageMode ? stage.length : stage.length * s.setup.laps;
    const progress = Math.max(0, Math.min(1, p.progress / total));
    const ordered = stageMode ? [] : orderedCars(s), position = ordered.indexOf(p) + 1;
    const split = s.split && s.clock - s.split.at < 3.2 ? s.split : null;
    const showNotice = s.notice && s.clock < s.noticeUntil;
    const recoverKey = touch ? 'TAP ↺' : 'PRESS R';
    const hint = active && p.finish === null ? (p.wrongWay > 1 ? `WRONG WAY: TURN AROUND OR ${recoverKey}` : p.stuck > 1.6 ? `STUCK? ${recoverKey} TO RECOVER` : '') : '';
    // Top three plus you: enough to race against, never long enough to reach the pedals on a phone.
    const standings = ordered.map((c, i) => ({ c, rank: i + 1 })).filter(({ c, rank }) => rank <= 3 || c.id === 0);
    const prompts = touch ? TOUCH_PROMPTS.map((text, i) => i === 0 && s.setup.autoThrottle ? 'AUTO GAS IS ON: GET ROLLING' : text) : tutorialPrompts;
    return <>
        <div className={styles.progress} aria-hidden="true"><i style={{ transform: `scaleX(${progress})` }} />{stageMode && SPLIT_GATES.map(g => <b key={g} style={{ left: `${g / GATES * 100}%` }} />)}</div>
        <div className={styles.hudLeft}>
            {stageMode ? <>
                <p className={styles.timer}><span>STAGE TIME</span><strong>{timeLabel(s.raceClock)}</strong></p>
                {split && <p className={`${styles.split} ${split.delta === null ? '' : split.delta <= 0 ? styles.good : styles.bad}`} role="status"><span>SPLIT {split.index + 1}</span><strong>{split.delta === null ? timeLabel(split.time) : deltaLabel(split.delta)}</strong></p>}
            </> : <>
                <p className={styles.timer}><span>POSITION</span><strong>P{position}<small>/{s.cars.length}</small></strong></p>
                <p className={styles.lapChip}>LAP {Math.min(s.setup.laps, p.laps + 1)} / {s.setup.laps}</p>
            </>}
        </div>
        {notes.length > 0 && <div className={styles.notes} aria-live="polite">
            {notes.map((note, i) => {
                const away = forwardDistance(p.s, note.s, stage.length), distance = away < stage.length / 2 && away > 15 ? Math.round(away / 10) * 10 : null;
                return <div key={`${note.s}-${i}`} className={`${styles.note} ${i ? styles.noteNext : ''} ${note.severity && note.severity <= 2 ? styles.noteTight : ''} ${note.kind === 'jump' || note.kind === 'splash' || note.kind === 'caution' ? styles.noteFeature : ''}`} aria-label={`${noteName(note)}${distance ? ` in ${distance} metres` : ''}`}>
                    <NoteIcon note={note} size={i ? 30 : 46} />
                    <strong>{noteLabel(note)}</strong>
                    {i === 0 && note.into && <em>INTO</em>}
                    {i === 0 && note.long && <em>LONG</em>}
                    {i === 0 && distance && <small>{distance}</small>}
                </div>;
            })}
        </div>}
        <div className={styles.hudRight}>
            {stageMode ? <ol className={styles.ladder} aria-label="Medal times">
                {(['gold', 'silver', 'bronze'] as const).map(m => <li key={m} className={s.raceClock > stage.targets[m] ? styles.gone : ''}><MedalBadge medal={m} /><span>{timeLabel(stage.targets[m])}</span></li>)}
                {s.ghost && <li className={styles.ghostRow}><i /> <span>BEST {timeLabel(s.ghost.time)}</span></li>}
            </ol> : <ol className={styles.standings} aria-label="Standings">
                {standings.map(({ c, rank }) => <li key={c.id} className={c.id === 0 ? styles.you : ''}><b>{rank}</b><i style={{ background: crews[c.crew].body, borderColor: crews[c.crew].stripe }} /><span>{c.id === 0 ? 'YOU' : c.name.split(' ')[1]?.toUpperCase() ?? c.name}</span>{c.finish !== null && <em>✓</em>}</li>)}
            </ol>}
        </div>
        <div className={styles.speed} aria-label={`${Math.round(p.speed * 3.6)} kilometres per hour`}><strong>{Math.round(p.speed * 3.6)}</strong><small>KM/H</small></div>
        {s.phase === 'countdown' && (stageMode ? <div className={styles.countBoard} role="status"><strong>{Math.ceil(s.countdown)}</strong><span>{s.tutorial ? 'DRIVING SCHOOL' : stage.name.toUpperCase()}</span></div>
            : <div className={styles.lights} role="status" aria-label={`Start in ${Math.ceil(s.countdown)}`}>{[0, 1, 2, 3, 4].map(i => <i key={i} className={3 - s.countdown > i * .6 ? styles.lit : ''} />)}</div>)}
        {active && s.raceClock < .9 && <div className={styles.go} role="status">GO!</div>}
        {showNotice && active && s.raceClock >= .9 && <div className={styles.notice} role="status">{s.notice}</div>}
        {hint && <div className={styles.hint} role="alert">{hint}</div>}
        {s.tutorial && active && <div className={styles.tutorial}><b>{Math.min(4, s.tutorialStep + 1)} / 4</b><span>{prompts[s.tutorialStep]}</span></div>}
    </>;
}
