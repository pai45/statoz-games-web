"use client";
import {useEffect,useRef,useState} from 'react';
import {useRouter} from 'next/navigation';
import {publicAsset} from '@/shared/config';
import styles from './screen.module.css';

export function VibeBasketball(){
 const router=useRouter();
 const frame=useRef<HTMLIFrameElement>(null),viewportRoot=useRef<HTMLElement>(null);
 useEffect(()=>{const viewport=window.visualViewport;const sync=()=>{if(viewport&&viewport.scale===1){const node=viewportRoot.current;node?.style.setProperty("--vibe-viewport-height",viewport.height+"px");}};sync();viewport?.addEventListener("resize",sync);window.addEventListener("resize",sync);return()=>{viewport?.removeEventListener("resize",sync);window.removeEventListener("resize",sync);};},[]);
 const [attempt,setAttempt]=useState(0);
 const [failure,setFailure]=useState('');
 const [ready,setReady]=useState(false);
 useEffect(()=>{
  const element=frame.current;if(!element)return;
  const session=crypto.randomUUID();let timer:ReturnType<typeof setTimeout>;
  const command=(type:string)=>element.contentWindow?.postMessage({protocolVersion:1,gameId:'vibe-basketball',sessionId:session,type},location.origin);
  const receive=(event:MessageEvent)=>{
   if(event.source!==element.contentWindow||event.origin!==location.origin)return;
   const data=event.data;
   if(!data||data.protocolVersion!==1||data.gameId!=='vibe-basketball'||data.sessionId!==session)return;
   if(data.type==='loading'){setReady(false);clearTimeout(timer);timer=setTimeout(()=>setFailure('The park is taking too long to load. Retry or return to basketball.'),60000);}
   if(data.type==='ready'){clearTimeout(timer);setReady(true);setFailure('');if(document.hidden)command('pause');}
   if(data.type==='error'){clearTimeout(timer);setFailure('The game could not start. Check WebGL support, then retry.');}
   if(data.type==='exit')router.push('/games/basketball');
  };
  const hide=()=>{if(document.hidden)command('pause');};
  window.addEventListener('message',receive);document.addEventListener('visibilitychange',hide);
  timer=setTimeout(()=>setFailure('The local game bundle could not load. Retry or return to basketball.'),60000);
  element.src=publicAsset('/embedded-games/vibe-basketball/index.html')+'?session='+session;
  return()=>{clearTimeout(timer);command('dispose');window.removeEventListener('message',receive);document.removeEventListener('visibilitychange',hide);element.src='about:blank';};
 },[attempt,router]);
 return <main ref={viewportRoot} className={styles.root}>
  <iframe ref={frame} title="Vibe Basketball — 1v1 and 3-Point Contest" className={styles.frame} allow="autoplay; fullscreen; gamepad" allowFullScreen/>
  {(!ready||failure)&&<div className={styles.status} role={failure?'alert':'status'}><h1>Vibe Basketball</h1><p>{failure||'Building the park…'}</p>{failure&&<button onClick={()=>{setFailure('');setReady(false);setAttempt(n=>n+1);}}>Retry</button>}<button onClick={()=>router.push('/games/basketball')}>Back to basketball</button></div>}
 </main>;
}
