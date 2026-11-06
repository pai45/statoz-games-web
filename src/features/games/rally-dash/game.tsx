'use client';
import { useCallback, useState } from 'react';
import type { GameLauncherProps } from '../components/game-launcher';
import type { Session, Setup } from './contracts';
import { rallyFonts } from './fonts';
import { Lobby } from './lobby';
import { browserStore } from './persistence';
import { RaceScreen } from './race-screen';
import { createSession } from './simulation';
import { nextStage } from './stages';
import styles from './rally.module.css';

const uid = () => typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `run-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;

/**
 * Rally Dash, the rally remake of Grand Prix Dash. The host still knows it as `grand-prix-dash`;
 * everything inside is rally-owned: stages, crews, saves, art and sound.
 */
export function RallyDash({ entry }: GameLauncherProps) {
    const [store] = useState(browserStore);
    const [setup, setSetup] = useState<Setup>(() => store.data.setup);
    const [run, setRun] = useState<{ session: Session; autostart: boolean } | null>(null);
    const [warning, setWarning] = useState(store.status);
    const change = useCallback((patch: Partial<Setup>) => {
        store.settings({ ...store.data.setup, ...patch });
        setSetup({ ...store.data.setup });
        setWarning(store.status);
    }, [store]);
    const launch = useCallback((options: { autostart?: boolean; tutorial?: boolean; stage?: Setup['stage'] } = {}) => {
        if (options.stage) change({ stage: options.stage });
        const base = store.data.setup, tutorial = !!options.tutorial;
        const chosen: Setup = tutorial ? { ...base, mode: 'stage', stage: 'pine-ridge' } : base;
        const ghost = chosen.mode === 'stage' && !tutorial ? store.best(chosen)?.ghost ?? null : null;
        setRun({ session: createSession(chosen, Math.floor(Math.random() * 0xffffffff), uid(), ghost, tutorial), autostart: !!options.autostart });
    }, [change, store]);
    const leave = useCallback(() => { setRun(null); setSetup({ ...store.data.setup }); setWarning(store.status); }, [store]);
    return <div className={`${rallyFonts} ${styles.root}`}>
        {run ? <RaceScreen key={run.session.id} session={run.session} store={store} autostart={run.autostart} onExit={leave}
            onRestart={() => launch({ autostart: true, tutorial: run.session.tutorial })}
            onNext={() => launch({ stage: nextStage(run.session.setup.stage) })}
            onSetup={change} />
            : <Lobby title={entry.title} setup={setup} store={store} warning={warning} onChange={change} onLaunch={launch} />}
    </div>;
}
