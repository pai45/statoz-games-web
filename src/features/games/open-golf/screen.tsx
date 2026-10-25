"use client";
import {useEffect, useState} from 'react';
import {publicAsset, basePath} from '@/shared/config';
import {BundledGame} from '../shared/components/bundled-game';
import type {GameLauncherProps} from '../components/game-launcher';
export function OpenGolf(props: GameLauncherProps) {
  const [ready,setReady]=useState(false),[error,setError]=useState('');
  useEffect(()=>{let active=true;
    if(window.crossOriginIsolated){queueMicrotask(()=>{if(active)setReady(true);});return()=>{active=false;};}
    void (async()=>{
      if(!navigator.serviceWorker || !window.isSecureContext) throw Error('Open Golf needs a secure browser with WebAssembly threads.');
      await navigator.serviceWorker.register(publicAsset('/game-assets-sw.js'),{scope:basePath+'/',updateViaCache:'none'});
      await navigator.serviceWorker.ready;
      if(!navigator.serviceWorker.controller) await new Promise<void>((resolve,reject)=>{const timer=setTimeout(()=>{navigator.serviceWorker.removeEventListener('controllerchange',changed);reject(Error('The game browser could not prepare. Reload to retry.'));},15000);function changed(){clearTimeout(timer);resolve();}navigator.serviceWorker.addEventListener('controllerchange',changed,{once:true});});
      if(!active)return;
      const url=new URL(location.href);
      if(url.searchParams.has('golfIsolation')) throw Error('WebAssembly threads are unavailable in this browser. Open Golf requires a browser that supports cross-origin isolation.');
      url.searchParams.set('golfIsolation','1');location.replace(url.href);
    })().catch(e=>{if(active)setError(e.message);});
    return()=>{active=false;};
  },[]);
  if(ready)return <BundledGame {...props}/>;
  return <div className="grid min-h-dvh place-content-center gap-4 p-6 text-center"><p role={error?'alert':'status'}>{error||'Preparing Open Golf…'}</p>{error&&<a href={publicAsset('/?sport=golf')}>Return to Golf</a>}</div>;
}
