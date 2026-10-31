"use client";
import {useCallback,useEffect,useLayoutEffect,useRef,useState,type KeyboardEvent as ReactKeyboardEvent,type PointerEvent} from 'react';
import {at,clamp,cornerSpeed,DEFAULT_OPTIONS,emptyInput,GRID_SIZE,gridSlot,LAPS,newRace,position,recover,STEP,step,track,type Input,type Options} from './engine';
import {createRenderer} from './renderer';
import {captureCurrent,capturePrevious,createMotion} from './motion';
import {CIRCUIT_ID,CIRCUIT_NAME,mapPosition} from './circuit';
import styles from './screen.module.css';
import {keyMap,RacerInput,type Action} from './input';

type Props={onExit:()=>void;onEvent?:(event:{type:string;payload:Record<string,unknown>})=>void;hostCommand?:{id:number;type:'pause'|'resume'|'dispose'}};
type Status='loading'|'ready'|'racing'|'paused'|'finished'|'error';
type Stats={schemaVersion:1;best:number|null;races:number;wins:number};
type InspectionWindow=Window&{__RACER_INSPECT__?:()=>Record<string,unknown>};
const SAVE='racer.silverstone.progress.v1';
const blankStats=():Stats=>({schemaVersion:1,best:null,races:0,wins:0});
function readStats():Stats{try{const v=JSON.parse(localStorage.getItem(SAVE)||'null');if(v?.schemaVersion===1&&Number.isSafeInteger(v.races)&&v.races>=0&&Number.isSafeInteger(v.wins)&&v.wins>=0&&(v.best===null||(Number.isFinite(v.best)&&v.best>0)))return v;}catch{}return blankStats();}
const clock=(n:number)=>`${Math.floor(n/60)}:${(n%60).toFixed(2).padStart(5,'0')}`;
const colors=['#20bfd0','#ff674f','#f4c641'];
const mapPath=track.filter((_,i)=>i%6===0).map((p,i)=>{const m=mapPosition(p.x,p.z);return `${i?'L':'M'}${m.x.toFixed(1)},${m.y.toFixed(1)}`;}).join(' ')+'Z';
const initialPoint=at(gridSlot(GRID_SIZE-1).distance),initialMap=mapPosition(initialPoint.x,initialPoint.z);

type DriveButtonProps={action:Action;label:string;text:string;active:boolean;onDrive:(event:PointerEvent<HTMLButtonElement>,action:Action,down:boolean)=>void;onPedalKey:(event:ReactKeyboardEvent<HTMLButtonElement>,action:Action,down:boolean)=>void;onRelease:(action:Action)=>void};
function DriveButton({action,label,text,active,onDrive,onPedalKey,onRelease}:DriveButtonProps){
 return <button className={styles.driveButton} aria-label={label} aria-pressed={active} onPointerDown={e=>onDrive(e,action,true)} onPointerUp={e=>onDrive(e,action,false)} onPointerCancel={e=>onDrive(e,action,false)} onLostPointerCapture={e=>onDrive(e,action,false)} onKeyDown={e=>onPedalKey(e,action,true)} onKeyUp={e=>onPedalKey(e,action,false)} onBlur={()=>onRelease(action)} onContextMenu={e=>e.preventDefault()}>{text}</button>;
}

export function RacerGame({onExit,onEvent,hostCommand}:Props){
 const canvas=useRef<HTMLCanvasElement>(null),root=useRef<HTMLElement>(null),race=useRef(newRace()),renderer=useRef<ReturnType<typeof createRenderer>|null>(null),mode=useRef<Status>('loading'),controls=useRef(new RacerInput()),input=useRef<Input>(emptyInput()),recorded=useRef(false),events=useRef(onEvent);
 const [status,setStatus]=useState<Status>('loading'),[error,setError]=useState(''),[stats,setStats]=useState<Stats>(blankStats),[color,setColor]=useState(colors[0]),[hud,setHud]=useState({speed:0,pos:GRID_SIZE,lap:1,time:0,boost:75,count:3,offroad:false,slipstream:false,boosting:false,mapX:initialMap.x,mapY:initialMap.y,gas:false,brake:false,boostHeld:false}),[options,setOptions]=useState<Options>({...DEFAULT_OPTIONS}),[touch,setTouch]=useState(false),[notice,setNotice]=useState(''),[steering,setSteering]=useState(0),[result,setResult]=useState({time:0,lap:0,overtakes:0,position:GRID_SIZE});
 const settings=useRef(options);
 useLayoutEffect(()=>{settings.current=options;events.current=onEvent;},[options,onEvent]);
 const transition=useCallback((next:Status)=>{mode.current=next;setStatus(next);},[]);
 const clear=useCallback(()=>{controls.current.clear();input.current=emptyInput();setSteering(0);},[]);
 const merge=useCallback(()=>{input.current=controls.current.read();},[]);
 const pause=useCallback(()=>{if(mode.current!=='racing')return;clear();transition('paused');},[clear,transition]);
 const resume=useCallback(()=>{if(mode.current!=='paused')return;clear();transition('racing');canvas.current?.focus();},[clear,transition]);
 useEffect(()=>{
  const el=canvas.current;if(!el)return;const owners=controls.current;let active=true,frame=0,last=0,accumulator=0,updated=0,renderAlpha=1;let visualRace=race.current,motion=createMotion(visualRace);const frameTimes:number[]=[];let observer:ResizeObserver|undefined;
  const boot=async()=>{try{
   await document.fonts.ready;if(!active)return;
   const view=createRenderer(el);renderer.current=view;
   // Read-only diagnostics: no clock stepping, score assignment or simulation commands.
   (window as InspectionWindow).__RACER_INSPECT__=()=>{const r=race.current,p=r.player,aim=at(p.progress+clamp(p.speed*.28,4,13));return structuredClone({status:mode.current,player:p,time:r.time,countdown:r.countdown,boost:r.boost,input:input.current,checkpoints:r.checkpoints,lapTimes:r.lapTimes,finished:r.finished,position:position(r),gridSize:GRID_SIZE,options:{...settings.current},cornerSpeed:cornerSpeed(p.progress),opponents:r.opponents.map(c=>({x:c.x,z:c.z,heading:c.heading,speed:c.speed,progress:c.progress,name:c.name})),render:view.diagnostics(),frameTimes:[...frameTimes],stats:readStats(),aim,curve:Math.abs(((at(p.progress+43).heading-at(p.progress+7).heading+Math.PI*3)%(Math.PI*2))-Math.PI)});};
   observer=new ResizeObserver(()=>{const rect=el.getBoundingClientRect();view.resize(Math.max(1,rect.width),Math.max(1,rect.height));});observer.observe(el);
   setStats(readStats());setTouch(matchMedia('(pointer:coarse)').matches);transition('ready');events.current?.({type:'ready',payload:{gameId:'f1-racing',title:'Racer',runtime:'authored-threejs-arcade'}});
   const tick=(now:number)=>{if(!active)return;const elapsed=last?(now-last)/1000:0,dt=Math.min(elapsed,.1);last=now;
    if(mode.current==='racing'&&dt>0){frameTimes.push(elapsed*1000);if(frameTimes.length>360)frameTimes.shift();}
    if(visualRace!==race.current){visualRace=race.current;motion=createMotion(visualRace);accumulator=0;renderAlpha=1;}
    if(mode.current==='racing'){
     accumulator+=dt;while(accumulator>=STEP){capturePrevious(motion);step(race.current,input.current,STEP,settings.current);captureCurrent(motion,race.current);accumulator-=STEP;}renderAlpha=accumulator/STEP;
     if(race.current.finished&&!recorded.current){recorded.current=true;clear();transition('finished');const r=race.current,place=position(r),previous=readStats(),next:Stats={schemaVersion:1,best:previous.best===null?r.finishTime:Math.min(previous.best,r.finishTime),races:previous.races+1,wins:previous.wins+(place===1?1:0)};setResult({time:r.finishTime,lap:Math.min(...r.lapTimes),overtakes:r.overtakes,position:place});try{localStorage.setItem(SAVE,JSON.stringify(next));}catch{setNotice('Your result is available; device storage could not save it.');}setStats(next);events.current?.({type:'result',payload:{id:crypto.randomUUID(),game:'racer',mode:'quick-race',circuit:CIRCUIT_ID,position:place,time:r.finishTime,laps:LAPS,contacts:r.hits,overtakes:r.overtakes}});}
    }else accumulator=0;
    view.draw(race.current,motion,mode.current==='finished'?1:renderAlpha,dt,mode.current==='ready',mode.current==='racing');
    if(now-updated>65){const r=race.current;setHud({speed:Math.round(r.player.speed*3.6),pos:position(r),lap:Math.min(LAPS,r.lap),time:r.time,boost:r.boost,count:Math.ceil(r.countdown),offroad:r.offroad,slipstream:r.slipstream,boosting:r.boosting,mapX:mapPosition(r.player.x,r.player.z).x,mapY:mapPosition(r.player.x,r.player.z).y,gas:settings.current.autoAccelerate||input.current.gas||input.current.boost,brake:input.current.brake,boostHeld:input.current.boost});updated=now;}
    frame=requestAnimationFrame(tick);
   };frame=requestAnimationFrame(tick);
  }catch(e){if(active){setError(String(e instanceof Error?e.message:e));transition('error');events.current?.({type:'error',payload:{message:'Racer could not create its 3D renderer.'}});}}};void boot();
  return()=>{active=false;cancelAnimationFrame(frame);observer?.disconnect();renderer.current?.dispose();renderer.current=null;delete (window as InspectionWindow).__RACER_INSPECT__;owners.clear();input.current=emptyInput();};
 },[clear,transition]);
 useEffect(()=>{
  const keyboard=(e:KeyboardEvent)=>{
   const action=keyMap[e.code];
   // Always accept release, including after focus moves to settings or a button.
   if(e.type==='keyup'&&action){controls.current.release('key:'+e.code);merge();return;}
   if(e.defaultPrevented||e.target instanceof HTMLElement&&e.target.closest('input,select,textarea,[contenteditable=true]'))return;
   if(e.code==='Escape'&&!e.repeat){e.preventDefault();if(mode.current==='racing')pause();else if(mode.current==='paused')resume();return;}
   if(e.code==='KeyR'&&!e.repeat&&mode.current==='racing'){recover(race.current);clear();return;}
   if(e.code==='KeyC'&&!e.repeat){renderer.current?.camera();return;}
   if(!action||mode.current!=='racing')return;
   e.preventDefault();controls.current.hold('key:'+e.code,action);merge();
  };
  const blur=()=>{clear();pause();},visibility=()=>{if(document.hidden)blur();};
  window.addEventListener('keydown',keyboard);window.addEventListener('keyup',keyboard);window.addEventListener('blur',blur);document.addEventListener('visibilitychange',visibility);
  return()=>{window.removeEventListener('keydown',keyboard);window.removeEventListener('keyup',keyboard);window.removeEventListener('blur',blur);document.removeEventListener('visibilitychange',visibility);};
 },[clear,merge,pause,resume]);
 useEffect(()=>{if(!hostCommand)return;const id=setTimeout(()=>{if(hostCommand.type==='pause')pause();if(hostCommand.type==='resume')resume();if(hostCommand.type==='dispose'){clear();pause();}},0);return()=>clearTimeout(id);},[hostCommand,clear,pause,resume]);
 useEffect(()=>{if(!['ready','paused','finished'].includes(status))return;const panel=root.current?.querySelector<HTMLElement>('[role="dialog"]'),previous=document.activeElement;panel?.querySelector<HTMLButtonElement>('[data-primary]')?.focus();const key=(e:KeyboardEvent)=>{if(e.key!=='Tab'||!panel)return;const controls=[...panel.querySelectorAll<HTMLElement>('button,input')],first=controls[0],last=controls.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}};document.addEventListener('keydown',key);return()=>{document.removeEventListener('keydown',key);if(mode.current==='racing')canvas.current?.focus();else if(previous instanceof HTMLElement)previous.focus();};},[status]);
 const start=()=>{clear();race.current=newRace(color);recorded.current=false;transition('racing');canvas.current?.focus();};
 const drive=useCallback((event:PointerEvent<HTMLButtonElement>,action:Action,down:boolean)=>{event.preventDefault();const owner='pointer:'+event.pointerId;if(down){if(mode.current!=='racing'||event.button!==0)return;event.currentTarget.setPointerCapture(event.pointerId);controls.current.hold(owner,action);}else controls.current.release(owner);merge();},[merge]);
 const pedalKey=useCallback((event:ReactKeyboardEvent<HTMLButtonElement>,action:Action,down:boolean)=>{if(!['Space','Enter'].includes(event.code))return;event.preventDefault();event.stopPropagation();const owner='button:'+action+':'+event.code;if(down&&mode.current==='racing')controls.current.hold(owner,action);else controls.current.release(owner);merge();},[merge]);
 const releaseButton=useCallback((action:Action)=>{controls.current.release('button:'+action+':Space');controls.current.release('button:'+action+':Enter');merge();},[merge]);
 const control=(action:Action,label:string,text:string)=><DriveButton action={action} label={label} text={text} active={action==='brake'?hud.brake:action==='gas'?hud.gas&&!hud.brake:action==='boost'?hud.boosting:false} onDrive={drive} onPedalKey={pedalKey} onRelease={releaseButton}/>;
 const joystick=(event:PointerEvent<HTMLDivElement>,down:boolean)=>{event.preventDefault();if(down){if(mode.current!=='racing')return;if(event.type==='pointerdown')event.currentTarget.setPointerCapture(event.pointerId);const b=event.currentTarget.getBoundingClientRect();const value=clamp((event.clientX-b.x-b.width/2)/(b.width*.36),-1,1);controls.current.steer(value);setSteering(value);}else{controls.current.steer(0);setSteering(0);}merge();};
 const fullscreen=()=>{if(document.fullscreenElement)void document.exitFullscreen();else void root.current?.requestFullscreen?.().catch(()=>setNotice('Fullscreen is unavailable in this browser.'));};
 const leave=()=>{clear();pause();onExit();};
 return <section ref={root} className={styles.root} data-racer data-state={status} data-boosting={hud.boosting} data-manual={!options.autoAccelerate} data-touch={touch}>
  <canvas ref={canvas} tabIndex={-1} className={styles.canvas} aria-label="Racer 3D circuit. Use arrows or WASD to steer, up to accelerate, down to brake, space to boost."/>
  <header className={styles.header}><div className={styles.wordmark}>RACER<span>STATOZ CIRCUITS</span></div><div className={styles.tools}><button aria-label="Camera" onClick={()=>renderer.current?.camera()}>Camera</button><button aria-label="Fullscreen" onClick={fullscreen}>Fullscreen</button><button onClick={()=>status==='racing'?pause():leave()}>{status==='racing'?'Pause':'Exit'}</button></div></header>
  {(status==='racing'||status==='paused'||status==='finished')&&<><div className={styles.hud} aria-label="Race status"><div><small>POSITION</small><b>{hud.pos}<em>/ {GRID_SIZE}</em></b></div><div><small>LAP</small><b>{hud.lap}<em>/ {LAPS}</em></b></div><div><small>TIME</small><b className={styles.timer}>{clock(hud.time)}</b></div></div><div className={styles.map}><svg viewBox="0 0 155 144" aria-label="Silverstone Grand Prix circuit map"><path d={mapPath} fill="none" stroke="#ffffff40" strokeWidth="7" strokeLinejoin="round"/><path d={mapPath} fill="none" stroke="#ffffffc0" strokeWidth="2"/><circle cx={hud.mapX} cy={hud.mapY} r="5" fill="#ffcc53" stroke="#142f40" strokeWidth="2"/></svg><span>{CIRCUIT_NAME}</span></div><div className={styles.telemetry}><div className={styles.speed}><b>{hud.speed}</b><span>KM/H</span></div><div className={styles.pedalStatus} role="status">{hud.brake?'BRAKING':hud.boosting?'BOOSTING':hud.gas?'ACCELERATING':hud.speed>0?'COASTING':'HOLD GAS TO START'}</div><div className={styles.boostMeter}><span>{hud.slipstream?'SLIPSTREAM +':'BOOST'}<b>{Math.round(hud.boost)}%</b></span><div><i style={{width:Math.max(0,hud.boost)+'%'}}/></div></div></div></>}
  {status==='racing'&&<>{hud.count>0&&<div className={styles.countdown} role="status">{hud.count}<small>READY TO RACE</small></div>}{hud.count===0&&hud.time<1.3&&<div className={styles.countdown}>GO!</div>}{hud.offroad&&<div className={styles.warning}>OFF TRACK · EASE BACK ON</div>}{touch&&<div className={styles.touch} aria-label="Touch driving controls"><div className={styles.steerArea}><div className={styles.joystick} aria-label="Analog steering pad" role="group" onPointerDown={e=>joystick(e,true)} onPointerMove={e=>{if(e.currentTarget.hasPointerCapture(e.pointerId))joystick(e,true);}} onPointerUp={e=>joystick(e,false)} onPointerCancel={e=>joystick(e,false)} onLostPointerCapture={e=>joystick(e,false)}><span>‹</span><i style={{transform:`translateX(${steering*51}px)`}}/><span>›</span></div><div className={styles.steerFallback}>{control('left','Steer left','‹')}{control('right','Steer right','›')}</div></div><div className={styles.pedals}>{control('brake','Brake','BRAKE')}{!options.autoAccelerate&&control('gas','Accelerate','GAS')}{control('boost','Boost','BOOST')}</div></div>}<div className={styles.recover}><button aria-label="Recover car" onClick={()=>{recover(race.current);clear();}}>Reset car</button></div></>}
  {status==='ready'&&<div className={styles.welcome}><article className={styles.intro} role="dialog" aria-modal="true" aria-label="Racer quick race"><div className={styles.kicker}>ONE CIRCUIT. ONE QUICK RACE.</div><h1>CHASE<br/>THE <span>LEAD.</span></h1><p>Twenty cars. Silverstone. Two flying laps.<br/>Your next overtake starts here.</p><div className={styles.specs}><span>{CIRCUIT_NAME}</span><span>2 LAPS</span><span>20 CARS</span></div><div className={styles.liveries} aria-label="Car colour">{colors.map((c,i)=><button key={c} aria-label={['Lagoon car','Coral car','Sunburst car'][i]} aria-pressed={color===c} style={{background:c}} onClick={()=>{setColor(c);race.current.player.color=c;}}/>)}</div><button data-primary className={styles.primary} onClick={start}>QUICK RACE <span>→</span></button><p className={styles.instructions}>{touch?'Drag the left pad to steer · Brake for corners · Boost to pass':'A / D or ← / → steer · S / ↓ brake · Space boosts'}<br/>Manual acceleration ? Auto option in Pause ? Escape pauses.</p>{stats.best!==null&&<small className={styles.best}>PERSONAL BEST {clock(stats.best)}</small>}</article><div className={styles.trackLabel}><b>SILVERSTONE<br/>GP</b><span>ARCADE GRAND PRIX LAYOUT</span></div></div>}
  {(status==='paused'||status==='finished')&&<div className={styles.scrim}><article className={styles.panel} role="dialog" aria-modal="true" aria-label={status==='paused'?'Racer paused':'Race result'}><div className={styles.kicker}>{status==='paused'?'TAKE A BREATHER':'CHEQUERED FLAG'}</div><h2>{status==='paused'?'RACE PAUSED':result.position===1?'P1. NICE DRIVE.':`P${result.position}. NEXT TIME?`}</h2>{status==='finished'?<><div className={styles.resultStats}><span>RACE TIME<b>{clock(result.time)}</b></span><span>BEST LAP<b>{clock(result.lap)}</b></span><span>OVERTAKES<b>{result.overtakes}</b></span></div><p>Your best {stats.best===null?'—':clock(stats.best)} · {stats.races} races · {stats.wins} wins</p></>:<><label><span>Automatic acceleration</span><input type="checkbox" checked={options.autoAccelerate} onChange={e=>{clear();setOptions({...options,autoAccelerate:e.target.checked});}}/></label><label><span>Steering sensitivity</span><input aria-label="Steering sensitivity" type="range" min="0.6" max="1.5" step="0.1" value={options.sensitivity} onChange={e=>setOptions({...options,sensitivity:Number(e.target.value)})}/></label><label><span>Touch controls</span><input type="checkbox" checked={touch} onChange={e=>setTouch(e.target.checked)}/></label><p>Arrows / WASD · Space boost · C camera · R reset<br/>Brake before a corner, then boost on the exit.</p></>}
   <button data-primary className={styles.primary} onClick={status==='paused'?resume:start}>{status==='paused'?'RESUME RACE':'RACE AGAIN'} <span>→</span></button>{status==='paused'&&<button className={styles.secondary} onClick={start}>Restart quick race</button>}<button className={styles.secondary} onClick={leave}>Back to Motorsport</button></article></div>}
  {status==='loading'&&<div className={styles.scrim} role="status"><div className={styles.loading}>RACER<small>PREPARING SILVERSTONE GP…</small></div></div>}
  {status==='error'&&<div className={styles.scrim} role="alert"><article className={styles.panel}><h2>PIT STOP</h2><p>The 3D race could not start. {error}</p><button className={styles.primary} onClick={()=>location.reload()}>Reload Racer</button><button className={styles.secondary} onClick={leave}>Back to Motorsport</button></article></div>}
  {notice&&<button className={styles.notice} onClick={()=>setNotice('')}>{notice} Dismiss</button>}
 </section>;
}
