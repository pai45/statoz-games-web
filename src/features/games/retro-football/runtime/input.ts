import type { Direction } from './contracts';
import type { FootballSession } from './session';
export function bindInput(container: HTMLElement, session: FootballSession) {
    const controller = new AbortController(), options = { signal: controller.signal }, keys: Record<string, Direction> = { arrowleft: 'left', a: 'left', arrowright: 'right', d: 'right', arrowup: 'up', w: 'up', arrowdown: 'down', s: 'down' };
    const actions: Record<string, 'A' | 'B' | 'C'> = { j: 'A', k: 'B', l: 'C' };
    document.addEventListener('keydown', e => {
        if ((e.target as HTMLElement)?.matches('input,select,textarea'))
            return;
        if (e.key === 'Escape' && !e.repeat) {
            e.preventDefault();
            session.dispatch({ type: 'pause' });
            return;
        }
        const direction = keys[e.key.toLowerCase()];
        if (direction) {
            e.preventDefault();
            session.dispatch({ type: 'hold', key: direction, value: true, source: 'keyboard:' + e.code });
        }
        const action = actions[e.key.toLowerCase()];
        if (action && !e.repeat) {
            e.preventDefault();
            session.dispatch({ type: action });
        }
    }, options);
    document.addEventListener('keyup', e => {
        const direction = keys[e.key.toLowerCase()];
        if (direction)
            session.dispatch({ type: 'hold', key: direction, value: false, source: 'keyboard:' + e.code });
    }, options);
    const pointers = new Set<number>();
    container.addEventListener('pointerdown', e => {
        const target = (e.target as HTMLElement).closest<HTMLButtonElement>('button[data-hold],button[data-action]');
        if (!target || target.disabled)
            return;
        e.preventDefault();
        target.setPointerCapture(e.pointerId);
        pointers.add(e.pointerId);
        target.dataset.pressed = 'true';
        const direction = target.dataset.hold as Direction | undefined, action = target.dataset.action as 'A' | 'B' | 'C' | undefined;
        if (direction)
            session.dispatch({ type: 'hold', key: direction, value: true, source: 'pointer:' + e.pointerId });
        else if (action)
            session.dispatch({ type: action });
    }, options);
    const release = (e: PointerEvent) => {
        const target = (e.target as HTMLElement).closest<HTMLButtonElement>('button[data-hold],button[data-action]');
        if (!target)
            return;
        delete target.dataset.pressed;
        pointers.delete(e.pointerId);
        const direction = target.dataset.hold as Direction | undefined;
        if (direction)
            session.dispatch({ type: 'hold', key: direction, value: false, source: 'pointer:' + e.pointerId });
    };
    for (const name of ['pointerup', 'pointercancel', 'lostpointercapture'])
        container.addEventListener(name, release as EventListener, options);
    const background = () => {
        session.setBackground(true);
        for (const el of container.querySelectorAll<HTMLElement>('[data-pressed]'))
            delete el.dataset.pressed;
        pointers.clear();
    };
    window.addEventListener('blur', background, options);
    window.addEventListener('focus', () => { if (!document.hidden) session.setBackground(false); }, options);
    document.addEventListener('visibilitychange', () => {
        if (document.hidden)
            background();
        else session.setBackground(false);
    }, options);
    if (document.hidden) background();
    return () => {
        controller.abort();
        pointers.clear();
        for (const el of container.querySelectorAll<HTMLElement>('[data-pressed]'))
            delete el.dataset.pressed;
        session.sim.clear();
    };
}
