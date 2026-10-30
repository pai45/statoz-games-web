"use client";

import {useEffect, useRef, useState} from 'react';
import {useRouter} from 'next/navigation';
import Link from 'next/link';
import {Button} from '@/design-system';
import {publicAsset} from '@/shared/config';
import {useAuthSession} from '@/features/auth';
import {guideFor} from '@/features/how-to-play';
import type {GameLauncherProps} from '../../components/game-launcher';
import {gameHubHref} from '../bundled-game-config';
import {defaultPresentation, presentationKey, readPresentation} from '../retro/presentation';
import styles from './bundled-game.module.css';
type BootstrapWindow = Window & {__STATOZ_BUNDLE_BOOT__?: (session:string,child:Window)=>string|null};

export function BundledGame(props: GameLauncherProps) {
  const account = useAuthSession().email;
  return <AccountGameBundle key={`${props.game}.${account || 'guest'}`} {...props} account={account}/>;
}

function AccountGameBundle({game, entry, account}: GameLauncherProps & {account: string | null}) {
  const frame = useRef<HTMLIFrameElement>(null), router = useRouter();
  const [error, setError] = useState(''), [notice, setNotice] = useState('');
  const [ready, setReady] = useState(false), [attempt, setAttempt] = useState(0);
  const hub = gameHubHref(game), guide = guideFor(game);

  useEffect(() => {
    let active = true;
    const element = frame.current, sessionId = crypto.randomUUID();
    const hostWindow=window as BootstrapWindow;
    let bootText:string|null=null;
    const provideBoot=(requested:string,child:Window)=>active&&requested===sessionId&&child===element?.contentWindow?bootText:null;
    hostWindow.__STATOZ_BUNDLE_BOOT__=provideBoot;
    const key = 'statoz.games.web.bundle.' + game + '.' + encodeURIComponent(account || 'guest');
    const displayKey = presentationKey(account);
    let save = {schemaVersion: 1, stores: {}, resultIds: []}, invalidSave = false;
    let presentation = defaultPresentation();
    let raw: string | null = null;
    try { raw = localStorage.getItem(key); } catch { /* Storage denial still permits temporary play. */ }
    try {
      const old = JSON.parse(raw || 'null');
      if (old?.schemaVersion === 1) save = old;
      else if (old !== null) invalidSave = true;
    } catch { invalidSave = true; }
    try { presentation = readPresentation(JSON.parse(localStorage.getItem(displayKey) || 'null')) ?? defaultPresentation(); } catch {}
    const receive = (event: MessageEvent) => {
      const value = event.data;
      if (!active || event.source !== element?.contentWindow || event.origin !== location.origin || value?.protocolVersion !== 1 || value.gameId !== game || value.sessionId !== sessionId) return;
      if (value.type === 'ready') setReady(true);
      if (value.type === 'exit') router.push(hub);
      if (value.type === 'presentation') {
        const next = readPresentation(value.payload);
        if (next) { if(bootText)bootText=JSON.stringify({...JSON.parse(bootText),presentation:next});try { localStorage.setItem(displayKey, JSON.stringify(next)); } catch { setNotice('Display preferences could not be saved on this device.'); } }
      }
      if (value.type === 'save' && value.payload?.schemaVersion === 1 && JSON.stringify(value.payload).length < 600000) {
        save=value.payload;
        if(bootText)bootText=JSON.stringify({...JSON.parse(bootText),stores:save.stores,resultIds:save.resultIds});
        try { localStorage.setItem(key, JSON.stringify(value.payload)); } catch { setNotice('Progress could not be saved on this device.'); }
      }
      if (value.type === 'error') setError('The game could not continue. Try loading it again.');
    };
    window.addEventListener('message', receive);
    const abort = new AbortController();
    void fetch(publicAsset('/embedded-games/' + game + '/index.html'), {signal: abort.signal}).then(r => {
      if (!r.ok) throw Error('Missing game bundle');
      return r.text();
    }).then(async html => {
      const storageScope = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(account || 'guest')))).map(value => value.toString(16).padStart(2, '0')).join('').slice(0, 24);
      if (invalidSave) { if (active) setError('Saved progress needs a compatible game version. It has been preserved.'); return; }
      bootText=JSON.stringify({...save,presentation,sessionId,origin:location.origin,assetRoot:publicAsset('/games/'+game+'/'),storageScope,assetBuild:process.env.NEXT_PUBLIC_ASSET_BUILD_ID});
      if(active&&element){
        if(html.includes('parent.__STATOZ_BUNDLE_BOOT__')){
          const url=new URL(publicAsset('/embedded-games/'+game+'/index.html'),location.href);
          url.searchParams.set('session',sessionId);
          if(process.env.NEXT_PUBLIC_ASSET_BUILD_ID)url.searchParams.set('assetBuild',process.env.NEXT_PUBLIC_ASSET_BUILD_ID);
          element.src=url.href;element.removeAttribute('srcdoc');
        }else element.srcdoc=html.replace('/*__STATOZ_BOOT__*/','window.__STATOZ_BOOT__='+bootText.replaceAll('<','\\u003c')+';');
      }
    }).catch(e => { if (active && e.name !== 'AbortError') setError('The game files could not load. Check the local game installation and try again.'); });
    const background = () => { if (document.hidden) element?.contentWindow?.postMessage({protocolVersion: 1, gameId: game, sessionId, type: 'pause'}, location.origin); };
    document.addEventListener('visibilitychange', background);
    return () => {
      active = false; abort.abort();
      element?.contentWindow?.postMessage({protocolVersion: 1, gameId: game, sessionId, type: 'dispose'}, location.origin);
      window.removeEventListener('message', receive);
      document.removeEventListener('visibilitychange', background);
      if(hostWindow.__STATOZ_BUNDLE_BOOT__===provideBoot)delete hostWindow.__STATOZ_BUNDLE_BOOT__;
      if (element) element.srcdoc = '';
    };
  }, [game, account, router, hub, attempt]);

  const retry = () => { setError(''); setReady(false); setAttempt(value => value + 1); };
  return <section className={styles.root} data-bundled-game={game}>
    <iframe ref={frame} title={entry.title} className={styles.frame} allow="autoplay; fullscreen; gamepad" allowFullScreen onLoad={() => { if (frame.current?.contentDocument?.documentElement.dataset.game === game) setReady(true); }}/>
    {(!ready || error) && <div className={styles.overlay} role={error ? 'alert' : 'status'}>
      <h1>{entry.title}</h1><p>{error || 'Opening your game…'}</p>
      <div className={styles.actions}>
        {error && <Button onClick={retry}>Try again</Button>}
        <Button variant="surface" onClick={() => router.push(hub)}>Back to Games</Button>
        {guide && <Link href={`/how-to-play/${guide.id}`}>How to play</Link>}
      </div>
    </div>}
    {notice && <div className={styles.notice} role="status">{notice}<Button variant="surface" onClick={() => setNotice('')}>Dismiss</Button></div>}
  </section>;
}
