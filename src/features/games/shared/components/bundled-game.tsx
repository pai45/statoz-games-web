"use client";
import {useEffect, useRef, useState} from 'react';
import {useRouter} from 'next/navigation';
import {publicAsset} from '@/shared/config';
import {useAuthSession} from '@/features/auth';
import type {GameLauncherProps} from '../../components/game-launcher';
import {defaultPresentation, presentationKey, readPresentation} from '../retro/presentation';

export function BundledGame({game, entry}: GameLauncherProps) {
  const frame = useRef<HTMLIFrameElement>(null), router = useRouter(), account = useAuthSession().email;
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    const element = frame.current, sessionId = crypto.randomUUID();
    const key = 'statoz.games.web.bundle.' + game + '.' + encodeURIComponent(account || 'guest');
    const displayKey = presentationKey(account);
    let save = {schemaVersion: 1, stores: {}, resultIds: []}, invalidSave = false;
    let presentation = defaultPresentation();
    // Storage denial is temporary play, while malformed existing progress stays preserved.
    let raw: string | null = null;
    try { raw = localStorage.getItem(key); } catch { /* Play without persistent storage. */ }
    try {
      const old = JSON.parse(raw || 'null');
      if (old?.schemaVersion === 1) save = old;
      else if (old !== null) invalidSave = true;
    } catch { invalidSave = true; }
    try { presentation = readPresentation(JSON.parse(localStorage.getItem(displayKey) || 'null')) ?? defaultPresentation(); } catch {}
    const receive = (event: MessageEvent) => {
      const value = event.data;
      if (!active || event.source !== element?.contentWindow || event.origin !== location.origin || value?.protocolVersion !== 1 || value.gameId !== game || value.sessionId !== sessionId) return;
      if (value.type === 'exit') router.push('/games/' + (game === 'archery-test' ? 'archery' : game === 'open-golf' ? 'golf' : game === 'retro-hoops' ? 'basketball' : game === 'retro-circuit' ? 'motorsport' : ['stick-cricket','retro-innings'].includes(game) ? 'cricket' : 'football'));
      if (value.type === 'presentation') {
        const next = readPresentation(value.payload);
        if (next) try { localStorage.setItem(displayKey, JSON.stringify(next)); } catch { setError('Display preferences could not be saved on this device.'); }
      }
      if (value.type === 'save' && value.payload?.schemaVersion === 1 && JSON.stringify(value.payload).length < 600000) {
        try { localStorage.setItem(key, JSON.stringify(value.payload)); } catch { setError('Progress could not be saved on this device.'); }
      }
      if (value.type === 'error') setError('The demo game could not continue. Return to Games and retry.');
    };
    window.addEventListener('message', receive);
    const abort = new AbortController();
    void fetch(publicAsset('/embedded-games/' + game + '/index.html'), {signal: abort.signal}).then(r => {
      if (!r.ok) throw Error('Missing game bundle');
      return r.text();
    }).then(async html => {
      const storageScope = ['retro-hoops','retro-football-2','stick-cricket','archery-test'].includes(game) ? Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(account || 'guest')))).map(value => value.toString(16).padStart(2, '0')).join('').slice(0, 24) : undefined;
      if (active) setError('');
      if (invalidSave) { if (active) setError('Saved progress needs a compatible game version. It has been preserved.'); return; }
      if (active && element) element.srcdoc = html.replace('/*__STATOZ_BOOT__*/', 'window.__STATOZ_BOOT__=' + JSON.stringify({...save, presentation, sessionId, origin: location.origin, assetRoot: publicAsset("/games/" + game + "/"), storageScope}).replaceAll('<', '\\u003c') + ';');
    }).catch(e => { if (active && e.name !== 'AbortError') setError('The demo bundle could not load. Return to Games and retry.'); });
    const background = () => { if (document.hidden) element?.contentWindow?.postMessage({protocolVersion: 1, gameId: game, sessionId, type: 'pause'}, location.origin); };
    document.addEventListener('visibilitychange', background);
    return () => {
      active = false; abort.abort();
      element?.contentWindow?.postMessage({protocolVersion: 1, gameId: game, sessionId, type: 'dispose'}, location.origin);
      window.removeEventListener('message', receive);
      document.removeEventListener('visibilitychange', background);
      if (element) element.srcdoc = '';
    };
  }, [game, account, router]);
  return <section className="fixed inset-0 z-[60] h-dvh w-full"><iframe ref={frame} title={entry.title} className="h-full w-full border-0" allow={game === "pitch-rush" ? "autoplay; fullscreen; gamepad" : "autoplay; fullscreen"} allowFullScreen/>{game === 'open-golf' && <button aria-label="Return to Golf" className="absolute left-3 top-3 rounded bg-black/70 px-4 py-2 text-white" onClick={()=>router.push('/?sport=golf')}>← GOLF</button>}{error && <div role="alert" className="absolute inset-x-0 top-0 bg-background p-4">{error}<button onClick={() => router.push('/')}>Return to Games</button></div>}</section>;
}
