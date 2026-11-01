"use client";

import {useCallback,useEffect,useRef,useState,type PointerEvent} from 'react';
import {CHASES,LESSONS,TIERS,VENUES,lessonCopy,type Challenge} from './data';
import {STEP,RELEASE,newMatch,step,swing,skipHighlight,type Match,type Side} from './engine';
import {SAVE_KEY,emptySave,readSave,record,resumed,type Save} from './save';
import type {CricketView} from './renderer';
import styles from './screen.module.css';

type Mode='menu'|'ladder'|'lessons'|'playing'|'paused'|'finished'|'loading'|'error';
type Props={onExit:()=>void;onEvent?:(event:{type:string;payload?:Record<string,unknown>})=>void;hostCommand?:{id:number;type:string}};
type Inspect={snapshot:()=>unknown;advance?:(seconds:number)=>void;view:()=>unknown};
type GameWindow=Window&{__STATOZ_BOOT__?:{assetRoot?:string};__CRICKETER_INSPECT__?:Inspect};
const keySide=(code:string):Side|null=>['ArrowLeft','KeyA'].includes(code)?'left':['ArrowRight','KeyD'].includes(code)?'right':null;

export function CricketerGame({onExit,onEvent,hostCommand}:Props) {
  const canvas=useRef<HTMLCanvasElement>(null),root=useRef<HTMLElement>(null),view=useRef<CricketView|null>(null);
  const match=useRef<Match|null>(null),mode=useRef<Mode>('loading'),save=useRef<Save>(emptySave()),blocked=useRef(false),events=useRef(onEvent);
  const [status,setStatus]=useState<Mode>('loading'),[progress,setProgress]=useState<Save>(emptySave()),[hud,setHud]=useState<Match|null>(null),[notice,setNotice]=useState(''),[error,setError]=useState(''),[tier,setTier]=useState(0),[attempt,setAttempt]=useState(0);
  const [held,setHeld]=useState<Side|null>(null);
  const owners=useRef(new Set<string>()),sound=useRef<AudioContext|null>(null),lastCheckpoint=useRef(-1),resultSent=useRef<string|null>(null),resumeMode=useRef<Mode>('playing');
  const setMode=useCallback((next:Mode)=>{mode.current=next;setStatus(next);},[]);
  const clear=useCallback(()=>{owners.current.clear();setHeld(null);},[]);
  const persist=useCallback((next:Save)=>{
    save.current=next;setProgress(next);
    if(blocked.current)return;
    try{localStorage.setItem(SAVE_KEY,JSON.stringify(next));}catch{setNotice('Progress is temporary. This browser could not save it.');}
  },[]);
  const pause=useCallback(()=>{if(mode.current==='playing'){clear();setMode('paused');void sound.current?.suspend();}},[clear,setMode]);
  const resume=useCallback(()=>{if(mode.current==='paused'&&innerWidth>=innerHeight){setMode(resumeMode.current);void sound.current?.resume();canvas.current?.focus();}},[setMode]);
  const unlock=()=>{if(!save.current.sound)return;try{sound.current??=new AudioContext();void sound.current.resume();}catch{/* Sound is optional. */}};
  const tone=useCallback((boundary:boolean)=>{
    const ctx=sound.current;if(!save.current.sound||!ctx||ctx.state!=='running')return;
    for(let i=0;i<(boundary?3:1);i++){const osc=ctx.createOscillator(),gain=ctx.createGain(),t=ctx.currentTime+i*.09;osc.type=boundary?'triangle':'sine';osc.frequency.setValueAtTime(boundary?440+i*110:170,t);osc.frequency.exponentialRampToValueAtTime(boundary?600:65,t+.12);gain.gain.setValueAtTime(.045,t);gain.gain.exponentialRampToValueAtTime(.001,t+.18);osc.connect(gain);gain.connect(ctx.destination);osc.start(t);osc.stop(t+.2);osc.onended=()=>{osc.disconnect();gain.disconnect();};}
  },[]);
  useEffect(()=>{events.current=onEvent;},[onEvent]);
  useEffect(()=>{
    let active=true,frame=0,last=0,accumulator=0,updated=0,previousPhase='',elapsed=0;
    const saved=(()=>{try{return readSave(localStorage.getItem(SAVE_KEY));}catch{return {save:emptySave(),incompatible:false};}})();
    save.current=saved.save;blocked.current=saved.incompatible;
    queueMicrotask(()=>{if(!active)return;setProgress(saved.save);if(saved.incompatible)setNotice('Saved progress belongs to an incompatible version. It is preserved; this session is temporary.');});
    const boot=async()=>{
      let created:CricketView|null=null;
      try{
        const {CricketView}=await import('./renderer');if(!active||!canvas.current)return;
        created=new CricketView(canvas.current);view.current=created;
        const base=(window as GameWindow).__STATOZ_BOOT__?.assetRoot??new URL('../../games/cricketer/',location.href).href;
        await created.loadAssets(base);if(!active){created.dispose();return;}
        setMode('menu');events.current?.({type:'ready',payload:{gameId:'cricketer',title:'Cricketer',engine:'Original Three.js batting chase'}});
        const manual=new URLSearchParams(location.search).get('clock')==='manual';
        const tick=(now:number)=>{
          if(!active)return;
          const dt=last?Math.min(.1,(now-last)/1000):0;last=now;
          const s=match.current;
          if(mode.current==='playing'&&s){
            accumulator+=manual?0:dt;
            while(accumulator+1e-9>=STEP){step(s);accumulator-=STEP;}
            if(s.phase!==previousPhase){if(s.phase==='flight')tone((s.outcome?.runs||0)>=4);previousPhase=s.phase;}
            if(s.checkpoint!==lastCheckpoint.current){lastCheckpoint.current=s.checkpoint;persist(record(save.current,s));}
            if(s.phase==='finished'){
              persist(record(save.current,s));clear();setMode('finished');
              const id=save.current.resultId;
              if(id&&resultSent.current!==id){resultSent.current=id;events.current?.({type:'result',payload:{id,game:'cricketer',challengeId:s.challenge.id,score:s.score,target:s.challenge.target,balls:s.ball,won:s.won}});}
            }
          }else accumulator=0;
          if(mode.current!=='paused')elapsed+=dt;
          created!.draw(s,s?s.time:elapsed,save.current.reducedMotion);
          if(now-updated>65){if(s)setHud({...s,results:[...s.results]});updated=now;}
          frame=requestAnimationFrame(tick);
        };
        (window as GameWindow).__CRICKETER_INSPECT__={snapshot:()=>({mode:mode.current,match:match.current?JSON.parse(JSON.stringify(match.current)):null,save:JSON.parse(JSON.stringify(save.current)),held:[...owners.current]}),view:()=>match.current?created!.contactInspection(match.current):null,...(manual?{advance:(seconds:number)=>{if(mode.current!=='playing'||!match.current)return;const checkpoint=match.current.checkpoint;for(let i=0;i<Math.round(Math.min(seconds,20)/STEP);i++){step(match.current);if(match.current.checkpoint!==checkpoint||match.current.phase==='finished')break;}created!.draw(match.current,match.current.time,save.current.reducedMotion);}}:{})};
        frame=requestAnimationFrame(tick);
      }catch(e){created?.dispose();if(active){view.current=null;setError(e instanceof Error?e.message:String(e));setMode('error');}}
    };void boot();
    const onLost=(e:Event)=>{e.preventDefault();clear();setError('The graphics context was interrupted. Reload the game to continue from your last completed delivery.');setMode('error');cancelAnimationFrame(frame);};
    const element=canvas.current;element?.addEventListener('webglcontextlost',onLost);
    return()=>{active=false;cancelAnimationFrame(frame);element?.removeEventListener('webglcontextlost',onLost);view.current?.dispose();view.current=null;delete (window as GameWindow).__CRICKETER_INSPECT__;};
  },[attempt,clear,persist,setMode,tone]);
  useEffect(()=>{
    const keyboard=(e:KeyboardEvent)=>{
      const side=keySide(e.code),owner='key:'+e.code;
      if(e.type==='keyup'){owners.current.delete(owner);if(!owners.current.size)setHeld(null);return;}
      if(e.target instanceof HTMLElement&&e.target.closest('input,select,textarea'))return;
      if(e.repeat)return;
      if(['Escape','KeyP'].includes(e.code)){e.preventDefault();if(mode.current==='paused')resume();else pause();return;}
      if(!side||mode.current!=='playing')return;e.preventDefault();owners.current.add(owner);setHeld(side);if(match.current)swing(match.current,side);
    };
    const interrupt=()=>pause(),visibility=()=>{if(document.hidden)pause();},rotate=()=>{if(innerHeight>innerWidth)pause();};
    window.addEventListener('keydown',keyboard);window.addEventListener('keyup',keyboard);window.addEventListener('blur',interrupt);window.addEventListener('resize',rotate);document.addEventListener('visibilitychange',visibility);
    return()=>{window.removeEventListener('keydown',keyboard);window.removeEventListener('keyup',keyboard);window.removeEventListener('blur',interrupt);window.removeEventListener('resize',rotate);document.removeEventListener('visibilitychange',visibility);};
  },[pause,resume]);
  useEffect(()=>{if(!hostCommand)return;const t=setTimeout(()=>{if(hostCommand.type==='pause')pause();else if(hostCommand.type==='resume')resume();else if(hostCommand.type==='dispose'){clear();void sound.current?.suspend();}},0);return()=>clearTimeout(t);},[hostCommand,pause,resume,clear]);
  useEffect(()=>()=>{void sound.current?.close();},[]);
  useEffect(()=>{
    if(['playing','loading','error'].includes(status))return;
    const panel=root.current?.querySelector<HTMLElement>('[role="dialog"]');panel?.querySelector<HTMLButtonElement>('[data-primary],button')?.focus();
    const trap=(e:KeyboardEvent)=>{if(e.key!=='Tab'||!panel)return;const buttons=Array.from(panel.querySelectorAll<HTMLElement>('button:not(:disabled),input'));const first=buttons[0],last=buttons.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}};
    document.addEventListener('keydown',trap);return()=>document.removeEventListener('keydown',trap);
  },[status]);
  const start=(c:Challenge,continuing=false)=>{
    unlock();clear();const existing=continuing?resumed(save.current):null;
    match.current=existing??newMatch(c,crypto.getRandomValues(new Uint32Array(1))[0]);lastCheckpoint.current=-1;
    persist({...record(save.current,match.current),resultId:continuing&&save.current.resultId?save.current.resultId:crypto.randomUUID()});
    setHud({...match.current});resumeMode.current='playing';setMode(innerHeight>innerWidth?'paused':'playing');canvas.current?.focus();
  };
  const returnToMenu=()=>{clear();setMode('menu');match.current=null;setHud(null);};
  const leave=()=>{clear();void sound.current?.suspend();onExit();};
  const tap=(e:PointerEvent<HTMLButtonElement>,side:Side)=>{e.preventDefault();if(e.button!==0||mode.current!=='playing')return;const owner='pointer:'+e.pointerId;if(owners.current.has(owner))return;owners.current.add(owner);e.currentTarget.setPointerCapture(e.pointerId);setHeld(side);unlock();if(match.current)swing(match.current,side);};
  const release=(e:PointerEvent<HTMLButtonElement>)=>{owners.current.delete('pointer:'+e.pointerId);if(!owners.current.size)setHeld(null);};
  const canContinue=progress.checkpoint&&progress.checkpoint.results.length<( [...CHASES,...LESSONS].find(c=>c.id===progress.checkpoint?.challengeId)?.balls||0)&&resumed(progress)?.phase!=='finished';
  const current=hud?.challenge;
  const active=['playing','paused','finished'].includes(status);
  const windowProgress=hud?Math.max(0,Math.min(1,(hud.age-RELEASE)/hud.delivery.flight)):0;
  const feedback=hud?.outcome?.feedback;
  const result=hud?.outcome?.runs||0;
  const panel=(children:React.ReactNode,label:string,extra='')=><div className={`${styles.scrim} ${extra}`}><article className={styles.panel} role="dialog" aria-modal="true" aria-label={label}>{children}</article></div>;
  return <section className={styles.root} ref={root} data-cricketer data-mode={status}>
    <canvas ref={canvas} className={styles.canvas} tabIndex={0} aria-label="Cricketer 3D cricket ground. Use left and right arrows to bat."/>
    <div className={styles.vignette}/>
    <header className={styles.header}><button aria-label="Back to Cricket" onClick={leave}>← <span>EXIT</span></button><div className={styles.wordmark}>CRICKETER<span>THE CHASE IS YOURS.</span></div><div className={styles.tools}>{status==='playing'&&<button onClick={pause} aria-label="Pause game">Ⅱ</button>}<button aria-label={progress.sound?'Mute sound':'Enable sound'} onClick={()=>{const next={...save.current,sound:!save.current.sound};persist(next);if(next.sound)unlock();else void sound.current?.suspend();}}>{progress.sound?'SOUND ON':'SOUND OFF'}</button></div></header>
    {active&&current&&<>
      <div className={styles.scoreboard}><div><span>YOUR SCORE</span><strong>{hud?.score}<small> / {current.target}</small></strong></div><div className={styles.chaseLabel}><span>{current.lesson?'BATTING ACADEMY':VENUES[current.tier]}</span><b>{current.name}</b></div><div><span>BALLS LEFT</span><strong>{Math.max(0,current.balls-(hud?.ball||0))}<small> BALLS</small></strong></div></div>
      <div className={styles.delivery}><span>{hud?.delivery.kind.toUpperCase()}</span><b>{Math.round(hud?.delivery.speed||0)} <small>KM/H</small></b><div className={styles.recent} aria-label="Recent ball scores">{hud?.results.slice(-6).map((r,i)=><i key={i} data-boundary={r.runs>=4}>{r.runs||'•'}</i>)}</div></div>
      {status==='playing'&&hud?.phase==='delivery'&&<div className={styles.timing} aria-label="Delivery timing"><span>RELEASE</span><div><i style={{left:`${windowProgress*100}%`}}/><b/></div><span>CONTACT</span></div>}
      {current.lesson&&status==='playing'&&<div className={styles.lessonHint}>{lessonCopy(current.lesson)}</div>}
      {status==='playing'&&feedback&&<div className={styles.feedback} key={`${hud?.ball}-${hud?.phase}`}><strong>{result>=4?result===6?'SIX.':'FOUR.':result>0?`+${result}`:feedback}</strong><span>{result>0?`${hud?.outcome?.shot.toUpperCase()} · ${feedback}`:'WATCH THE NEXT ONE'}</span>{result>=4&&hud?.phase==='flight'&&<button onClick={()=>{if(match.current)skipHighlight(match.current);}}>Skip highlight →</button>}</div>}
      {status==='playing'&&<div className={styles.controls}>{(['left','right'] as const).map(side=><button key={side} aria-label={`Bat ${side}`} data-held={held===side} data-hint={current.lesson==='direction'&&hud?.delivery.side===side} onPointerDown={e=>tap(e,side)} onPointerUp={release} onPointerCancel={release} onLostPointerCapture={release} onClick={e=>{if(e.detail===0&&match.current)swing(match.current,side);}}><b>{side==='left'?'←':'→'}</b><span>BAT {side.toUpperCase()}</span><small>{side==='left'?'A / ←':'D / →'}</small></button>)}</div>}
    </>}
    {status==='menu'&&<main className={styles.welcome} role="dialog" aria-modal="true" aria-label="Cricketer main menu"><div className={styles.heroCopy}><div className={styles.eyebrow}><i/> ORIGINAL ARCADE CRICKET</div><h1>ONE BALL.<br/>YOUR <em>MOMENT.</em></h1><p>Read the line. Find the middle.<br/>Turn a little timing into a big finish.</p><div className={styles.actions}>{canContinue&&<button data-primary className={styles.primary} onClick={()=>start(resumed(progress)!.challenge,true)}>CONTINUE CHASE <span>↗</span></button>}<button data-primary={!canContinue||undefined} className={canContinue?styles.secondary:styles.primary} onClick={()=>setMode('ladder')}>START THE CHASE <span>↗</span></button><button className={styles.secondary} onClick={()=>setMode('lessons')}>BATTING ACADEMY <span>03 LESSONS</span></button></div><div className={styles.facts}><span>12 CHASES</span><span>3 TIERS</span><span>ONE PERFECT SHOT</span></div></div><div className={styles.venueTag}><span>WELCOME TO</span><b>WILLOW<br/>PARK.</b><small>FICTIONAL VENUE / ORIGINAL PLAYERS</small></div></main>}
    {status==='ladder'&&panel(<><div className={styles.panelTop}><span className={styles.eyebrow}>THE CHASE LADDER</span><button onClick={returnToMenu}>Back</button></div><h2>CHASE YOUR<br/><em>NEXT MOMENT.</em></h2><div className={styles.tabs}>{TIERS.map((name,i)=><button aria-pressed={tier===i} key={name} onClick={()=>setTier(i)}>{String(i+1).padStart(2,'0')} · {name}</button>)}</div><div className={styles.cards}>{CHASES.slice(tier*4,tier*4+4).map((c,i)=>{const index=tier*4+i,locked=index>progress.unlocked;return <button key={c.id} disabled={locked} onClick={()=>start(c)} aria-label={`${c.name}, ${c.target} runs from ${c.balls} balls${locked?', locked':''}`}><span>{String(index+1).padStart(2,'0')} <i>{locked?'LOCKED':progress.best[c.id]>=c.target?'COMPLETED':'READY'}</i></span><h3>{c.name}</h3><b>{c.target}<small> RUNS</small></b><footer>{c.balls} BALLS <strong>{locked?'⌑':'PLAY →'}</strong></footer>{progress.best[c.id]!==undefined&&<small>BEST {progress.best[c.id]}</small>}</button>;})}</div><p className={styles.footnote}>Win to unlock the next chase. Your best scores stay on this device.</p></>,'Choose a chase',styles.wide)}
    {status==='lessons'&&panel(<><div className={styles.panelTop}><span className={styles.eyebrow}>BATTING ACADEMY</span><button onClick={returnToMenu}>Back</button></div><h2>SMALL TAPS.<br/><em>BIG DIFFERENCE.</em></h2><div className={styles.lessons}>{LESSONS.map((c,i)=><button key={c.id} onClick={()=>start(c)}><span>0{i+1}</span><div><h3>{c.name}</h3><p>{lessonCopy(c.lesson)}</p></div><b>{progress.lessons.includes(c.id)?'✓':'→'}</b></button>)}</div></>,'Batting lessons',styles.wide)}
    {status==='paused'&&panel(<><span className={styles.eyebrow}>TAKE YOUR TIME</span><h2>CHASE<br/><em>PAUSED.</em></h2><p>Watch the ball. Tap left or right just before it reaches your bat. Running and fielding are automatic.</p><label><span>Sound effects</span><input type="checkbox" checked={progress.sound} onChange={e=>persist({...save.current,sound:e.target.checked})}/></label><label><span>Reduced camera motion</span><input type="checkbox" checked={progress.reducedMotion} onChange={e=>persist({...save.current,reducedMotion:e.target.checked})}/></label><button data-primary className={styles.primary} onClick={resume}>RESUME CHASE →</button><button className={styles.secondary} onClick={returnToMenu}>SAVE & RETURN TO MENU</button></>,'Cricketer paused')}
    {status==='finished'&&hud&&panel(<><span className={styles.eyebrow}>{hud.challenge.lesson?'ACADEMY RESULT':'THE FINAL BALL'}</span><h2>{hud.won?'CHASE':'SO CLOSE.'}<br/><em>{hud.won?'COMPLETE.':'GO AGAIN.'}</em></h2><div className={styles.result}><strong>{hud.score}</strong><span>RUNS<br/>TARGET {hud.challenge.target} · {hud.ball} BALLS FACED</span></div><p>{hud.won?'You found your moment. Ready for another?':'Find the middle a little more often. Every delivery is another chance.'}</p><button data-primary className={styles.primary} onClick={()=>{const i=(hud.challenge.lesson?LESSONS:CHASES).findIndex(c=>c.id===hud.challenge.id),list=hud.challenge.lesson?LESSONS:CHASES;start(hud.won&&list[i+1]?list[i+1]:hud.challenge);}}>{hud.won&&(hud.challenge.lesson?LESSONS:CHASES).some((c,i,list)=>i>0&&list[i-1].id===hud.challenge.id)?'NEXT CHALLENGE':'PLAY AGAIN'} →</button><button className={styles.secondary} onClick={returnToMenu}>BACK TO MENU</button></>,'Chase result')}
    {status==='loading'&&<div className={styles.scrim} role="status"><div className={styles.loading}>CRICKETER<span>PREPARING THE GROUND…</span><i/></div></div>}
    {status==='error'&&panel(<><span className={styles.eyebrow}>A SHORT RAIN BREAK</span><h2>LET’S GET<br/><em>YOU PLAYING.</em></h2><p>The 3D ground could not load. {error}</p><button className={styles.primary} onClick={()=>{setMode('loading');setError('');setAttempt(a=>a+1);}}>RETRY LOADING</button><button className={styles.secondary} onClick={leave}>BACK TO CRICKET</button></>,'Game unavailable')}
    {status==='menu'&&<div className={styles.credit}>Player model: <a href="https://sketchfab.com/3d-models/indian-cricket-player-rigged-a1001b602e4f430bb9de68c24d9a4aa7" target="_blank" rel="noreferrer">numaan.k99</a> · <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">CC BY 4.0</a></div>}
    {notice&&<div role="status" className={styles.notice}>{notice}<button onClick={()=>setNotice('')}>Dismiss</button></div>}
    <div className={styles.rotate} role="status"><b>TURN FOR THE CHASE.</b><span>Hold your device landscape, then resume.</span></div>
  </section>;
}
