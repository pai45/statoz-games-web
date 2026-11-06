'use client';
import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from 'react';
import type { Action, RaceInput } from './input';
import styles from './rally.module.css';

const ICONS = {
    back: 'M15 5l-7 7 7 7M8 12h13',
    help: 'M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18zM9.5 9.3a2.6 2.6 0 0 1 5 .9c0 1.8-2.5 2.3-2.5 3.8M12 17.2v.1',
    trophy: 'M7 4h10v5a5 5 0 0 1-10 0zM7 6H4v1a3 3 0 0 0 3 3M17 6h3v1a3 3 0 0 1-3 3M12 14v4M8 21h8M9 18h6',
    gear: 'M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM19.4 13.5l1.6 1.2-2 3.4-1.9-.7a7 7 0 0 1-1.7 1l-.3 2h-4l-.3-2a7 7 0 0 1-1.7-1l-1.9.7-2-3.4 1.6-1.2a7 7 0 0 1 0-2L3 10.3l2-3.4 1.9.7a7 7 0 0 1 1.7-1l.3-2h4l.3 2a7 7 0 0 1 1.7 1l1.9-.7 2 3.4-1.6 1.2a7 7 0 0 1 0 2z',
    sound: 'M4 9h4l5-4v14l-5-4H4zM16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12',
    mute: 'M4 9h4l5-4v14l-5-4H4zM17 9l5 6M22 9l-5 6',
    pause: 'M8 5v14M16 5v14',
    play: 'M7 4l13 8-13 8z',
    recover: 'M4 12a8 8 0 1 0 2.3-5.7M4 4v5h5',
    close: 'M6 6l12 12M18 6L6 18',
} as const;
export type IconName = keyof typeof ICONS;
export function Icon({ name, size = 22 }: { name: IconName; size?: number }) {
    return <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false"><path d={ICONS[name]} fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

/** Square icon button with an accessible name; the visible label appears only where there is room. */
export function IconButton({ icon, label, onClick, disabled, active }: { icon: IconName; label: string; onClick: () => void; disabled?: boolean; active?: boolean }) {
    return <button type="button" className={`${styles.iconButton} ${active ? styles.on : ''}`} aria-label={label} title={label} onClick={onClick} disabled={disabled}><Icon name={icon} /><span>{label}</span></button>;
}

/** Modal with focus moved in, trapped, and returned on close. Escape closes when allowed. */
export function Dialog({ title, children, onClose, wide = false }: { title: string; children: ReactNode; onClose?: () => void; wide?: boolean }) {
    const ref = useRef<HTMLElement>(null);
    useEffect(() => {
        const previous = document.activeElement, root = ref.current;
        (root?.querySelector<HTMLElement>('[data-autofocus]') ?? root?.querySelector<HTMLElement>('button,input,select'))?.focus({ preventScroll: true });
        return () => { if (previous instanceof HTMLElement && previous.isConnected) previous.focus({ preventScroll: true }); };
    }, []);
    return <div className={styles.scrim}>
        <section ref={ref} role="dialog" aria-modal="true" aria-label={title} className={`${styles.dialog} ${wide ? styles.dialogWide : ''}`} onKeyDown={e => {
            if (e.key === 'Escape' && onClose) { e.stopPropagation(); onClose(); }
            if (e.key !== 'Tab') return;
            const items = Array.from(e.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled),input,select,a[href]'));
            const first = items[0], last = items.at(-1);
            if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
            else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
        }}>
            <header><h2>{title}</h2>{onClose && <button type="button" className={styles.close} aria-label="Close" onClick={onClose}><Icon name="close" /></button>}</header>
            <div className={styles.dialogBody}>{children}</div>
        </section>
    </div>;
}

export function Toggle({ label, detail, checked, onChange }: { label: string; detail?: string; checked: boolean; onChange: (value: boolean) => void }) {
    return <label className={styles.toggle}><span><strong>{label}</strong>{detail && <small>{detail}</small>}</span><input type="checkbox" role="switch" checked={checked} onChange={e => onChange(e.target.checked)} /><i aria-hidden="true" /></label>;
}

export function Chips<T extends string | number>({ label, value, options, onChange }: { label: string; value: T; options: { value: T; label: string; detail?: string }[]; onChange: (value: T) => void }) {
    return <fieldset className={styles.chips}><legend>{label}</legend><div>{options.map(o => <button key={String(o.value)} type="button" aria-pressed={value === o.value} className={value === o.value ? styles.on : ''} onClick={() => onChange(o.value)}><strong>{o.label}</strong>{o.detail && <small>{o.detail}</small>}</button>)}</div></fieldset>;
}

/** Touch button that holds an action for as long as its own finger stays down. */
export function Hold({ action, label, input, className, children, onPress }: { action: Action; label: string; input: RaceInput; className?: string; children: ReactNode; onPress?: () => void }) {
    const [held, setHeld] = useState(false);
    const release = (e: PointerEvent<HTMLButtonElement>) => { input.hold(`pointer:${e.pointerId}`, action, false); setHeld(false); };
    return <button type="button" className={`${styles.hold} ${className ?? ''} ${held ? styles.held : ''}`} aria-label={label} onContextMenu={e => e.preventDefault()}
        onPointerDown={e => { e.preventDefault(); try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* capture is a nicety; the hold still works */ } input.hold(`pointer:${e.pointerId}`, action, true); setHeld(true); onPress?.(); }}
        onPointerUp={release} onPointerCancel={release} onLostPointerCapture={release}>{children}</button>;
}

/**
 * Slide-to-steer pad: the thumb's position across the pad is the steering angle. A tap near either end
 * is full lock, the middle is straight, anything between is partial. The knob moves without re-rendering React.
 */
export function SteerPad({ input, onPress }: { input: RaceInput; onPress?: () => void }) {
    const pad = useRef<HTMLDivElement>(null), knob = useRef<HTMLSpanElement>(null), owner = useRef<number | null>(null);
    const place = (value: number | null) => {
        const el = knob.current;
        if (!el) return;
        el.style.left = `calc(50% + ${(value ?? 0).toFixed(3)} * (50% - var(--knob) / 2))`;
        pad.current?.toggleAttribute('data-active', value !== null);
    };
    const update = (e: PointerEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect(), raw = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2 * .72);
        const value = Math.abs(raw) < .1 ? 0 : Math.max(-1, Math.min(1, raw));
        input.steer(`pad:${e.pointerId}`, value);
        place(value);
    };
    const release = (e: PointerEvent<HTMLDivElement>) => {
        if (owner.current !== e.pointerId) return;
        owner.current = null;
        input.steer(`pad:${e.pointerId}`, null);
        place(null);
    };
    return <div ref={pad} className={styles.steerPad} role="group" aria-label="Steering pad: slide left or right" onContextMenu={e => e.preventDefault()}
        onPointerDown={e => { e.preventDefault(); if (owner.current !== null) return; owner.current = e.pointerId; try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* still works without capture */ } update(e); onPress?.(); }}
        onPointerMove={e => { if (owner.current === e.pointerId) update(e); }}
        onPointerUp={release} onPointerCancel={release} onLostPointerCapture={release}>
        <b aria-hidden="true">◀</b><span className={styles.track} aria-hidden="true"><span ref={knob} className={styles.knob} /></span><b aria-hidden="true">▶</b>
    </div>;
}
