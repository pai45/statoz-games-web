"use client";
import {useCallback,useEffect,useLayoutEffect,useRef,useState,type KeyboardEvent as ReactKeyboardEvent,type PointerEvent} from 'react';
import {closeMenuDisclosure} from '../shared/menu-disclosure';
import {at,clamp,DEFAULT_OPTIONS,DIFFICULTIES,emptyInput,GRID_SIZE,gridSlot,LAPS,newRace,position,recover,standings,STEP,step,type Chassis,type Difficulty,type Input,type Options,type Race,type RaceEvent} from './engine';
import {createRenderer,loadKit} from './renderer';
import {captureCurrent,capturePrevious,createMotion} from './motion';
import {circuitFor,defaultCircuit} from './geometry';
import {CAREER_KEY,STAGES,TIERS,emptyCareer,readCareer,recordCareer,continueStage,stageFor,setupFor,unlocked,totalStars,starsFor,careerComplete,type CareerSave,type CareerStage} from './career';
import {RacerAudio} from './audio';
import styles from './screen.module.css';
import {keyMap,RacerInput,type Action} from './input';

type Props={onExit:()=>void;onEvent?:(event:{type:string;payload:Record<string,unknown>})=>void;hostCommand?:{id:number;type:'pause'|'resume'|'dispose'}};
type Status='loading'|'ready'|'career'|'racing'|'paused'|'finished'|'error';
type Stats={schemaVersion:1;best:number|null;races:number;wins:number};
type Settings={schemaVersion:1;sound:boolean;reducedShake:boolean;difficulty:Difficulty;chassis:Chassis};
type Toast={id:number;text:string;tone:'good'|'bad'|'info'|'big'};
type Classified={rank:number;name:string;color:string;time:number|null;player:boolean};
type InspectionWindow=Window&{__RACER_INSPECT__?:()=>Record<string,unknown>;__STATOZ_BOOT__?:{assetRoot?:string}};
const SAVE='racer.silverstone.progress.v1',SETTINGS='racer.settings.v1';
const blankStats=():Stats=>({schemaVersion:1,best:null,races:0,wins:0});
const defaultSettings=():Settings=>({schemaVersion:1,sound:true,reducedShake:false,difficulty:'pro',chassis:'race'});
function readStats():Stats{try{const v=JSON.parse(localStorage.getItem(SAVE)||'null');if(v?.schemaVersion===1&&Number.isSafeInteger(v.races)&&v.races>=0&&Number.isSafeInteger(v.wins)&&v.wins>=0&&(v.best===null||(Number.isFinite(v.best)&&v.best>0)))return v;}catch{}return blankStats();}
function readSettings():Settings{try{const v=JSON.parse(localStorage.getItem(SETTINGS)||'null');if(v?.schemaVersion===1)return{...defaultSettings(),sound:v.sound!==false,reducedShake:v.reducedShake===true,difficulty:v.difficulty in DIFFICULTIES?v.difficulty:'pro',chassis:v.chassis==='race-future'?'race-future':'race'};}catch{}return defaultSettings();}
const clock=(n:number)=>`${Math.floor(n/60)}:${(n%60).toFixed(2).padStart(5,'0')}`;
const colors=['#20bfd0','#ff674f','#f4c641'];
const initialPoint=at(gridSlot(GRID_SIZE-1).distance),initialMap=defaultCircuit.mapPosition(initialPoint.x,initialPoint.z);
/** Five lights come on half a second apart; all out = go. */
const litLights=(countdown:number)=>countdown<=0?0:clamp(Math.floor((3-countdown)/.5+1e-6),0,5);
function assetBase(){const boot=(window as InspectionWindow).__STATOZ_BOOT__,base=boot?.assetRoot??`${location.pathname.split(/\/embedded-games\/|\/play\//)[0]}/games/f1-racing/`;return new URL(base,document.baseURI).href;}
function classify(r:Race):Classified[]{return standings(r).map((c,i)=>({rank:i+1,name:c.name,color:c.color,time:c.finishTime,player:c===r.player}));}

type DriveButtonProps={action:Action;label:string;text:string;active:boolean;onDrive:(event:PointerEvent<HTMLButtonElement>,action:Action,down:boolean)=>void;onPedalKey:(event:ReactKeyboardEvent<HTMLButtonElement>,action:Action,down:boolean)=>void;onRelease:(action:Action)=>void};
function DriveButton({action,label,text,active,onDrive,onPedalKey,onRelease}:DriveButtonProps){
 return <button className={styles.driveButton} aria-label={label} aria-pressed={active} onPointerDown={e=>onDrive(e,action,true)} onPointerUp={e=>onDrive(e,action,false)} onPointerCancel={e=>onDrive(e,action,false)} onLostPointerCapture={e=>onDrive(e,action,false)} onKeyDown={e=>onPedalKey(e,action,true)} onKeyUp={e=>onPedalKey(e,action,false)} onBlur={()=>onRelease(action)} onContextMenu={e=>e.preventDefault()}>{text}</button>;
}

export function RacerGame({onExit,onEvent,hostCommand}:Props){
 const canvas=useRef<HTMLCanvasElement>(null),root=useRef<HTMLElement>(null),race=useRef(newRace()),renderer=useRef<ReturnType<typeof createRenderer>|null>(null),mode=useRef<Status>('loading'),controls=useRef(new RacerInput()),input=useRef<Input>(emptyInput()),recorded=useRef(false),events=useRef(onEvent),audio=useRef<RacerAudio|null>(null),toastId=useRef(0),slowUntil=useRef(0);
 const [status,setStatus]=useState<Status>('loading'),[error,setError]=useState(''),[stats,setStats]=useState<Stats>(blankStats),[color,setColor]=useState(colors[0]),[hud,setHud]=useState({speed:0,gear:1,rpm:4500,wrongWay:false,lookBack:false,order:[] as {name:string;rank:number;color:string;gap:string}[],dots:[] as {x:number;y:number;color:string}[],pos:GRID_SIZE,lap:1,time:0,boost:75,count:3,lights:0,offroad:false,slipstream:false,boosting:false,mapX:initialMap.x,mapY:initialMap.y,gas:false,brake:false,boostHeld:false,best:null as number|null,damage:0,spinning:false}),[options,setOptions]=useState<Options>({...DEFAULT_OPTIONS}),[touch,setTouch]=useState(false),[notice,setNotice]=useState(''),[steering,setSteering]=useState(0),[result,setResult]=useState({time:0,lap:0,overtakes:0,position:GRID_SIZE,launch:'none' as Race['launch'],table:[] as Classified[],difficulty:'pro' as Difficulty,damage:0,contacts:0}),[settings,setSettings]=useState<Settings>(defaultSettings),[toasts,setToasts]=useState<Toast[]>([]);
 const options$=useRef(options),settings$=useRef(settings),careerSave=useRef<CareerSave>(emptyCareer()),careerBlocked=useRef(false);
 const [career,setCareer]=useState<CareerSave>(emptyCareer),[tier,setTier]=useState(0);
 const [raceConfig,setRaceConfig]=useState({circuit:defaultCircuit,gridSize:GRID_SIZE,laps:LAPS,stageId:null as string|null});
 const persistCareer=useCallback((next:CareerSave)=>{careerSave.current=next;setCareer(next);if(careerBlocked.current)return;try{localStorage.setItem(CAREER_KEY,JSON.stringify(next));}catch{setNotice('Career progress is temporary: device storage could not save it.');}},[]);
 useLayoutEffect(()=>{options$.current=options;settings$.current=settings;events.current=onEvent;if(audio.current)audio.current.enabled=settings.sound;renderer.current?.setShakeScale(settings.reducedShake?.25:1);},[options,settings,onEvent]);
 const saveSettings=useCallback((next:Settings)=>{setSettings(next);try{localStorage.setItem(SETTINGS,JSON.stringify(next));}catch{}},[]);
 const transition=useCallback((next:Status)=>{mode.current=next;setStatus(next);if(next!=='racing')audio.current?.silence();},[]);
 const clear=useCallback(()=>{controls.current.clear();input.current=emptyInput();setSteering(0);},[]);
 const merge=useCallback(()=>{input.current=controls.current.read();},[]);
 const pause=useCallback(()=>{if(mode.current!=='racing')return;clear();transition('paused');},[clear,transition]);
 const resume=useCallback(()=>{if(mode.current!=='paused')return;clear();audio.current?.unlock();transition('racing');canvas.current?.focus();},[clear,transition]);
 const toast=useCallback((text:string,tone:Toast['tone'],replace?:RegExp)=>{const id=++toastId.current;setToasts(list=>[...list.filter(t=>!replace||!replace.test(t.text)).slice(-2),{id,text,tone}]);setTimeout(()=>setToasts(list=>list.filter(t=>t.id!==id)),tone==='big'?2200:1700);},[]);
 /** Turns simulation events into layered feedback: camera trauma, sound and a short call-out. */
 const feedback=useCallback((event:RaceEvent)=>{
  const view=renderer.current,sound=audio.current;
  if(event.type==='launch'){if(event.quality==='perfect'){toast('PERFECT START · +15 BOOST','good');sound?.chime();view?.impulse(.25);}else{toast('WHEELSPIN · TOO EARLY','bad');view?.impulse(.35);}}
  if(event.type==='impact'){
   const r=race.current,list=[r.player,...r.opponents],mine=event.car===0||event.other===0,rival=list[event.car===0?event.other:event.car];
   view?.crash(event,list);
   const distance=Math.hypot(event.x-r.player.x,event.z-r.player.z);sound?.impact(event.intensity*(mine?1:Math.max(0,1-distance/70)));
   if(mine){
    // Hit-stop: a brief slow-motion beat sells a big crash without taking control away for long.
    if(event.heavy){slowUntil.current=performance.now()+320;toast(r.player.spin>0?'SPUN OUT':event.kind==='wall'?'BIG HIT · BARRIER':`HEAVY CONTACT · ${rival?.name??''}`,'bad',/^(SPUN|BIG|HEAVY|CONTACT)/);}
    else if(event.kind==='car'&&event.intensity>.3&&rival)toast(`CONTACT · ${rival.name}`,'info',/^(CONTACT|HEAVY)/);
   }
  }
  if(event.type==='position'){if(event.gained>0){toast(`P${event.position}${event.reward?` · +${event.reward} BOOST`:''}`,'good',/^P\d/);if(event.reward)sound?.chime();}else toast(`P${event.position}`,'bad',/^P\d/);}
  if(event.type==='lap')toast(`LAP ${event.lap} · ${clock(event.time)}${event.best&&event.lap>1?' · FASTEST':''}`,'info');
  if(event.type==='final-lap')toast('FINAL LAP','big');
 },[toast]);
 useEffect(()=>{
  const el=canvas.current;if(!el)return;const owners=controls.current;let active=true,frame=0,last=0,accumulator=0,updated=0,renderAlpha=1,lights=-1;let visualRace=race.current,motion=createMotion(visualRace);const frameTimes:number[]=[];let observer:ResizeObserver|undefined;
  const boot=async()=>{try{
   await document.fonts.ready;if(!active)return;
   const base=assetBase(),kit=await loadKit(base);if(!active)return;
   try{const loaded=readCareer(localStorage.getItem(CAREER_KEY));careerSave.current=loaded.save;setCareer(loaded.save);careerBlocked.current=loaded.incompatible;if(loaded.incompatible)setNotice('Saved career is incompatible or damaged. It is preserved; this session is temporary.');}catch{careerBlocked.current=true;setNotice('Career progress is temporary: device storage is unavailable.');}
   const saved=readSettings();setSettings(saved);settings$.current=saved;race.current.player.chassis=saved.chassis;
   audio.current??=new RacerAudio(base);audio.current.enabled=saved.sound;
   let view=createRenderer(el,kit);renderer.current=view;view.setShakeScale(saved.reducedShake?.25:1);
   // Read-only diagnostics: no clock stepping, score assignment or simulation commands.
   (window as InspectionWindow).__RACER_INSPECT__=()=>{const r=race.current,p=r.player,aim=r.circuit.at(p.progress+clamp(p.speed*.28,4,13));return structuredClone({status:mode.current,player:p,time:r.time,countdown:r.countdown,boost:r.boost,input:input.current,checkpoints:r.checkpoints,lapTimes:r.lapTimes,finished:r.finished,position:position(r),gridSize:r.gridSize,laps:r.laps,circuit:r.circuit.definition.id,careerStageId:r.careerStageId,career:structuredClone(careerSave.current),wrongWay:r.wrongWay,route:{nextGate:p.nextGate,passed:p.waypointsPassed,validatedProgress:p.validatedProgress},options:{...options$.current},settings:{...settings$.current},difficulty:r.difficulty,launch:r.launch,cornerSpeed:r.circuit.cornerSpeed(p.progress),opponents:r.opponents.map(c=>({x:c.x,z:c.z,heading:c.heading,speed:c.speed,progress:c.progress,lane:c.lane,name:c.name,gear:c.gear,rpm:c.rpm,throttle:c.throttle,brake:c.brake,waypointsPassed:c.waypointsPassed,finishTime:c.finishTime,reversing:c.reversing,targetSpeed:c.targetSpeed,targetLane:c.targetLane,boostActive:c.boostActive,chassis:c.chassis})),render:view.diagnostics(),frameTimes:[...frameTimes],stats:readStats(),aim,curve:Math.abs(((r.circuit.at(p.progress+43).heading-r.circuit.at(p.progress+7).heading+Math.PI*3)%(Math.PI*2))-Math.PI)});};
   observer=new ResizeObserver(()=>{const rect=el.getBoundingClientRect();view.resize(Math.max(1,rect.width),Math.max(1,rect.height));});observer.observe(el);
   setStats(readStats());setTouch(matchMedia('(pointer:coarse)').matches);transition('ready');events.current?.({type:'ready',payload:{gameId:'f1-racing',title:'Racer',runtime:'authored-threejs-arcade'}});
   const tick=(now:number)=>{if(!active)return;const elapsed=last?(now-last)/1000:0,dt=Math.min(elapsed,.1);last=now;
    if(mode.current==='racing'&&dt>0){frameTimes.push(elapsed*1000);if(frameTimes.length>360)frameTimes.shift();}
    if(visualRace!==race.current){visualRace=race.current;if(view.circuitId!==visualRace.circuit.definition.id||view.gridSize!==visualRace.gridSize){view.dispose(false);view=createRenderer(el,kit,visualRace.circuit,visualRace.gridSize,view.webgl);renderer.current=view;view.setShakeScale(settings$.current.reducedShake?.25:1);const rect=el.getBoundingClientRect();view.resize(Math.max(1,rect.width),Math.max(1,rect.height));}motion=createMotion(visualRace);accumulator=0;renderAlpha=1;lights=-1;}
    if(mode.current==='racing'){
     accumulator+=dt*(now<slowUntil.current?.3:1);while(accumulator>=STEP){capturePrevious(motion);step(race.current,input.current,STEP,options$.current);captureCurrent(motion,race.current);accumulator-=STEP;}renderAlpha=accumulator/STEP;
     for(const event of race.current.events.splice(0))feedback(event);
     const lit=litLights(race.current.countdown);if(lit!==lights){if(lights>=0||lit>0)audio.current?.beep(lit===0);lights=lit;}
     if(race.current.finished&&!recorded.current){
      recorded.current=true;clear();transition('finished');
      const r=race.current,place=position(r),stage=r.careerStageId?stageFor(r.careerStageId):undefined;
      setResult({time:r.finishTime,lap:Math.min(...r.lapTimes),overtakes:r.overtakes,position:place,launch:r.launch,table:classify(r),difficulty:r.difficulty,damage:Math.round(r.player.damage),contacts:r.hits});
      if(stage)persistCareer(recordCareer(careerSave.current,stage,place,r.finishTime));
      else{
       const previous=readStats(),next:Stats={schemaVersion:1,best:previous.best===null?r.finishTime:Math.min(previous.best,r.finishTime),races:previous.races+1,wins:previous.wins+(place===1?1:0)};
       try{localStorage.setItem(SAVE,JSON.stringify(next));}catch{setNotice('Your result is available; device storage could not save it.');}setStats(next);
      }
      events.current?.({type:'result',payload:{id:crypto.randomUUID(),game:'racer',mode:stage?'career':'quick-race',circuit:r.circuit.definition.id,difficulty:r.difficulty,position:place,time:r.finishTime,laps:r.laps,contacts:r.hits,overtakes:r.overtakes,...(stage?{stageId:stage.id,stars:starsFor(place)}:{})}});
     }
    }else accumulator=0;
    view.draw(race.current,motion,mode.current==='finished'?1:renderAlpha,dt,mode.current==='ready',mode.current==='racing',input.current.lookBack===true);
    if(mode.current==='racing'){
     const r=race.current,p=r.player,rival=r.opponents.reduce((best,c)=>{const d=Math.hypot(c.x-p.x,c.z-p.z);return d<best.d?{d,rpm:c.rpm}:best;},{d:999,rpm:4500}),revving=r.countdown>0&&(input.current.gas||input.current.boost);
     audio.current?.update({running:true,rpm:revving?9000+Math.sin(now*.02)*900:p.rpm,throttle:revving?1:p.throttle,boosting:r.boosting,skid:r.skid,kerb:r.kerb,offroad:r.offroad,speed:Math.abs(p.speed),rivalDistance:rival.d,rivalRpm:rival.rpm,scrape:p.scrape});
    }
    if(now-updated>65){const r=race.current,p=r.player,order=standings(r),rank=order.indexOf(p),gap=(c:typeof p)=>{if(c===p)return '';const seconds=(c.validatedProgress-p.validatedProgress)/Math.max(14,p.speed);return(seconds>0?'+':'−')+Math.min(99,Math.abs(seconds)).toFixed(1);};
     setHud({speed:Math.round(p.speed*3.6),gear:p.gear,rpm:Math.round(p.rpm),wrongWay:r.wrongWay,lookBack:input.current.lookBack===true,order:order.slice(Math.max(0,rank-1),Math.max(3,rank+2)).map(c=>({name:c.name,rank:order.indexOf(c)+1,color:c.color,gap:c.finishTime===null&&p.finishTime===null?gap(c):''})),dots:r.opponents.map(c=>({...r.circuit.mapPosition(c.x,c.z),color:c.color})),pos:position(r),lap:Math.min(r.laps,r.lap),time:r.time,boost:r.boost,count:Math.ceil(r.countdown),lights:litLights(r.countdown),offroad:r.offroad,slipstream:r.slipstream,boosting:r.boosting,mapX:r.circuit.mapPosition(p.x,p.z).x,mapY:r.circuit.mapPosition(p.x,p.z).y,gas:options$.current.autoAccelerate||input.current.gas||input.current.boost,brake:input.current.brake,boostHeld:input.current.boost,best:r.bestLap,damage:Math.round(p.damage),spinning:p.spin>0});updated=now;}
    frame=requestAnimationFrame(tick);
   };frame=requestAnimationFrame(tick);
  }catch(e){if(active){setError(String(e instanceof Error?e.message:e));transition('error');events.current?.({type:'error',payload:{message:'Racer could not create its 3D renderer.'}});}}};void boot();
  return()=>{active=false;cancelAnimationFrame(frame);observer?.disconnect();renderer.current?.dispose();renderer.current=null;audio.current?.dispose();audio.current=null;delete (window as InspectionWindow).__RACER_INSPECT__;owners.clear();input.current=emptyInput();};
 },[clear,transition,feedback,persistCareer]);
 useEffect(()=>{
  const keyboard=(e:KeyboardEvent)=>{
   const action=keyMap[e.code];
   // Always accept release, including after focus moves to settings or a button.
   if(e.type==='keyup'&&action){controls.current.release('key:'+e.code);merge();return;}
   if(e.defaultPrevented||e.target instanceof HTMLElement&&e.target.closest('input,select,textarea,[contenteditable=true]'))return;
   if(e.code==='Escape'&&!e.repeat){e.preventDefault();if(mode.current==='racing')pause();else if(mode.current==='paused')resume();else if(mode.current==='career')transition('ready');return;}
   if(e.code==='KeyR'&&!e.repeat&&mode.current==='racing'){recover(race.current);clear();return;}
   if(e.code==='KeyC'&&!e.repeat){renderer.current?.camera();return;}
   if(!action||mode.current!=='racing')return;
   e.preventDefault();controls.current.hold('key:'+e.code,action);merge();
  };
  const blur=()=>{clear();pause();},visibility=()=>{if(document.hidden)blur();};
  window.addEventListener('keydown',keyboard);window.addEventListener('keyup',keyboard);window.addEventListener('blur',blur);document.addEventListener('visibilitychange',visibility);
  return()=>{window.removeEventListener('keydown',keyboard);window.removeEventListener('keyup',keyboard);window.removeEventListener('blur',blur);document.removeEventListener('visibilitychange',visibility);};
 },[clear,merge,pause,resume,transition]);
 useEffect(()=>{if(!hostCommand)return;const id=setTimeout(()=>{if(hostCommand.type==='pause')pause();if(hostCommand.type==='resume')resume();if(hostCommand.type==='dispose'){clear();pause();}},0);return()=>clearTimeout(id);},[hostCommand,clear,pause,resume]);
 useEffect(()=>{if(!['ready','career','paused','finished'].includes(status))return;const panel=root.current?.querySelector<HTMLElement>('[role="dialog"]'),previous=document.activeElement,focusCanvas=canvas.current;panel?.querySelector<HTMLButtonElement>('[data-primary]')?.focus();const key=(e:KeyboardEvent)=>{if(e.key!=='Tab'||!panel)return;const controls=[...panel.querySelectorAll<HTMLElement>('button:not(:disabled),input:not(:disabled),summary')].filter(item=>item.getClientRects().length>0&&(!item.closest('details:not([open])')||item.tagName==='SUMMARY')),first=controls[0],last=controls.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}};document.addEventListener('keydown',key);return()=>{document.removeEventListener('keydown',key);if(mode.current==='racing')focusCanvas?.focus();else if(previous instanceof HTMLElement)previous.focus();};},[status]);
 const start=(stage?:CareerStage)=>{if(stage&&!unlocked(careerSave.current,stage))return;clear();setToasts([]);race.current=newRace(color,{...(stage?setupFor(stage):{difficulty:settings.difficulty}),chassis:settings.chassis});setRaceConfig({circuit:race.current.circuit,gridSize:race.current.gridSize,laps:race.current.laps,stageId:race.current.careerStageId});if(stage)persistCareer({...careerSave.current,selected:stage.id});recorded.current=false;audio.current?.unlock();transition('racing');canvas.current?.focus();};
 const toCareer=()=>{clear();setToasts([]);setTier(continueStage(careerSave.current).tier);transition('career');};
 const activeStage=raceConfig.stageId?stageFor(raceConfig.stageId):undefined;
 const nextStage=activeStage&&starsFor(result.position)>0?STAGES[activeStage.index+1]:undefined;
 const circuit=raceConfig.circuit;
 const restart=()=>start(activeStage);
 const starText=(n:number)=>'★'.repeat(n)+'☆'.repeat(3-n);

 const drive=useCallback((event:PointerEvent<HTMLButtonElement>,action:Action,down:boolean)=>{event.preventDefault();const owner='pointer:'+event.pointerId;if(down){if(mode.current!=='racing'||event.button!==0)return;event.currentTarget.setPointerCapture(event.pointerId);controls.current.hold(owner,action);}else controls.current.release(owner);merge();},[merge]);
 const pedalKey=useCallback((event:ReactKeyboardEvent<HTMLButtonElement>,action:Action,down:boolean)=>{if(!['Space','Enter'].includes(event.code))return;event.preventDefault();event.stopPropagation();const owner='button:'+action+':'+event.code;if(down&&mode.current==='racing')controls.current.hold(owner,action);else controls.current.release(owner);merge();},[merge]);
 const releaseButton=useCallback((action:Action)=>{controls.current.release('button:'+action+':Space');controls.current.release('button:'+action+':Enter');merge();},[merge]);
 const control=(action:Action,label:string,text:string)=><DriveButton action={action} label={label} text={text} active={action==='brake'?hud.brake:action==='gas'?hud.gas&&!hud.brake:action==='boost'?hud.boosting:action==='lookBack'?hud.lookBack:false} onDrive={drive} onPedalKey={pedalKey} onRelease={releaseButton}/>;
 const joystick=(event:PointerEvent<HTMLDivElement>,down:boolean)=>{event.preventDefault();if(down){if(mode.current!=='racing')return;if(event.type==='pointerdown')event.currentTarget.setPointerCapture(event.pointerId);const b=event.currentTarget.getBoundingClientRect();const value=clamp((event.clientX-b.x-b.width/2)/(b.width*.36),-1,1);controls.current.steer(value);setSteering(value);}else{controls.current.steer(0);setSteering(0);}merge();};
 const fullscreen=()=>{if(document.fullscreenElement)void document.exitFullscreen();else void root.current?.requestFullscreen?.().catch(()=>setNotice('Fullscreen is unavailable in this browser.'));};
 const leave=()=>{clear();pause();onExit();};
 const chooseChassis=(chassis:Chassis)=>{saveSettings({...settings,chassis});race.current.player.chassis=chassis;};
 const resultRows=(()=>{const t=result.table,me=t.findIndex(c=>c.player),rows=t.slice(0,5);if(me>=5)rows.push(...t.slice(Math.max(5,me-1),me+2));return rows;})(),winner=result.table[0]?.time??null;
 const soundToggle=<label><span>Sound</span><input type="checkbox" checked={settings.sound} onChange={e=>{saveSettings({...settings,sound:e.target.checked});if(e.target.checked)audio.current?.unlock();}}/></label>;
 return <section onKeyDownCapture={closeMenuDisclosure} ref={root} className={styles.root} data-racer data-state={status} data-boosting={hud.boosting} data-manual={!options.autoAccelerate} data-touch={touch}>
  <canvas ref={canvas} tabIndex={-1} className={styles.canvas} aria-label="Racer 3D circuit. Use arrows or WASD to steer, up to accelerate, down to brake, space to boost."/>
  {hud.boosting&&status==='racing'&&<div className={styles.speedLines} aria-hidden="true"/>}
  <header className={styles.header}><div className={styles.wordmark}>RACER<span>STATOZ CIRCUITS</span></div><div className={styles.tools}>{status==='racing'&&control('lookBack','Look back','REAR')}<button aria-label="Camera" onClick={()=>renderer.current?.camera()}>Camera</button><button aria-label="Fullscreen" onClick={fullscreen}>Fullscreen</button><button onClick={()=>status==='racing'?pause():leave()}>{status==='racing'?'Pause':'Exit'}</button></div></header>
  {(status==='racing'||status==='paused'||status==='finished')&&<><div className={styles.hud} aria-label="Race status"><div><small>POSITION</small><b>{hud.pos}<em>/ {raceConfig.gridSize}</em></b></div><div><small>LAP</small><b>{hud.lap}<em>/ {raceConfig.laps}</em></b></div><div><small>TIME</small><b className={styles.timer}>{clock(hud.time)}</b>{hud.best!==null&&<small className={styles.bestLap}>BEST LAP {clock(hud.best)}</small>}</div></div><ol className={styles.raceOrder} aria-label="Nearby race positions">{hud.order.map(c=><li key={c.name} data-player={c.name==='YOU'}><b>{c.rank}</b><i style={{background:c.color}}/>{c.name}{c.gap&&<span className={styles.gap}>{c.gap}s</span>}</li>)}</ol><div className={styles.map}><svg viewBox="0 0 155 144" aria-label={`${circuit.definition.name} circuit map`}><path d={circuit.mapPath} fill="none" stroke="#ffffff40" strokeWidth="7" strokeLinejoin="round"/><path d={circuit.mapPath} fill="none" stroke="#ffffffc0" strokeWidth="2"/>{hud.dots.map((p,i)=><circle key={i} cx={p.x} cy={p.y} r="1.8" fill={p.color}/>)}<circle cx={hud.mapX} cy={hud.mapY} r="5" fill="#ffcc53" stroke="#142f40" strokeWidth="2"/></svg><span>{circuit.definition.name}</span></div><div className={styles.telemetry}><div className={styles.speed}><b>{hud.speed}</b><span>KM/H</span></div><div className={styles.gear}>G{hud.gear}<span>{hud.rpm.toLocaleString('en-US')} RPM</span></div><div className={styles.rpmBar} aria-hidden="true"><i style={{width:`${clamp((hud.rpm-4500)/11500,0,1)*100}%`}} data-redline={hud.rpm>13000}/></div><div className={styles.pedalStatus} role="status">{hud.spinning?'SPINNING':hud.brake?'BRAKING':hud.boosting?'BOOSTING':hud.gas?'ACCELERATING':hud.speed>0?'COASTING':'HOLD GAS TO START'}</div><div className={styles.damageMeter} data-level={hud.damage>60?'high':hud.damage>25?'mid':'low'} aria-label={`Car damage ${hud.damage}%`}><span>DAMAGE</span><div><i style={{width:hud.damage+'%'}}/></div></div><div className={styles.boostMeter}><span>{hud.slipstream?'SLIPSTREAM +':'BOOST'}<b>{Math.round(hud.boost)}%</b></span><div><i style={{width:Math.max(0,hud.boost)+'%'}}/></div></div></div></>}
  {status==='racing'&&<>{hud.count>0&&<div className={styles.lights} role="status" aria-label={`Start lights: ${hud.lights} of 5`}><div>{[1,2,3,4,5].map(n=><i key={n} data-on={hud.lights>=n}/>)}</div><small>{hud.lights>=5?'GAS NOW FOR A PERFECT START':'WAIT FOR THE FIFTH LIGHT'}</small></div>}{hud.count===0&&hud.time<1.3&&<div className={styles.countdown}>GO!</div>}<div className={styles.toasts} aria-live="polite">{toasts.map(t=><div key={t.id} data-tone={t.tone}>{t.text}</div>)}</div>{(hud.offroad||hud.wrongWay)&&<div className={styles.warning}>{hud.wrongWay?'WRONG WAY · TURN AROUND':'OFF TRACK · EASE BACK ON'}</div>}{touch&&<div className={styles.touch} aria-label="Touch driving controls"><div className={styles.steerArea}><div className={styles.joystick} aria-label="Analog steering pad" role="group" onPointerDown={e=>joystick(e,true)} onPointerMove={e=>{if(e.currentTarget.hasPointerCapture(e.pointerId))joystick(e,true);}} onPointerUp={e=>joystick(e,false)} onPointerCancel={e=>joystick(e,false)} onLostPointerCapture={e=>joystick(e,false)}><span>‹</span><i style={{transform:`translateX(${steering*51}px)`}}/><span>›</span></div><div className={styles.steerFallback}>{control('left','Steer left','‹')}{control('right','Steer right','›')}</div></div><div className={styles.pedals}>{control('brake','Brake','BRAKE')}{!options.autoAccelerate&&control('gas','Accelerate','GAS')}{control('boost','Boost','BOOST')}</div></div>}<div className={styles.recover}><button aria-label="Recover car" onClick={()=>{recover(race.current);clear();}}>Reset car</button></div></>}
  {status==='ready'&&<div className={styles.welcome}><article className={styles.intro} role="dialog" aria-modal="true" aria-label="Racer menu" data-ui-role="game-lobby"><h1>CHASE <br/>THE <span>LEAD.</span></h1><p>Take the next podium and unlock the grid.</p>
   <button data-primary className={styles.primary} onClick={()=>start(continueStage(careerSave.current))}>{Object.keys(career.records).length?'CONTINUE CAREER':'START CAREER'} <span>→</span></button><button className={styles.secondary} onClick={toCareer}>BROWSE RACES <span>→</span></button><button className={styles.secondary} onClick={()=>start()}>QUICK RACE <span>→</span></button>
   <details><summary>CUSTOMIZE</summary><div className={styles.setup}><div className={styles.segment} role="group" aria-label="Car">{(['race','race-future'] as Chassis[]).map(c=><button key={c} aria-pressed={settings.chassis===c} onClick={()=>chooseChassis(c)}>{c==='race'?'Classic':'Future'}</button>)}</div><div className={styles.liveries} aria-label="Car colour">{colors.map((c,i)=><button key={c} aria-label={['Lagoon car','Coral car','Sunburst car'][i]} aria-pressed={color===c} style={{background:c}} onClick={()=>{setColor(c);race.current.player.color=c;}}/>)}</div></div><div className={styles.segment} role="group" aria-label="Quick Race rival skill">{(Object.keys(DIFFICULTIES) as Difficulty[]).map(d=><button key={d} aria-pressed={settings.difficulty===d} onClick={()=>saveSettings({...settings,difficulty:d})}>{DIFFICULTIES[d].label}</button>)}</div></details>
   </article></div>}
  {status==='career'&&<div className={styles.careerScreen}><article className={styles.careerPanel} role="dialog" aria-modal="true" aria-label="Racer career">
   <div className={styles.careerHeading}><div><div className={styles.kicker}>ROAD TO THE FRONT</div><h2>CAREER <small>{totalStars(career)} / 36 ★</small></h2></div><button onClick={()=>transition('ready')}>Back</button></div>
   <div className={styles.tiers} role="tablist" aria-label="Career tiers">{TIERS.map((name,i)=><button key={name} role="tab" id={`racer-tier-${i}`} aria-controls="racer-career-races" aria-selected={tier===i} tabIndex={tier===i?0:-1} onKeyDown={e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();const next=(tier+(e.key==='ArrowRight'?1:2))%3;setTier(next);root.current?.querySelector<HTMLButtonElement>(`#racer-tier-${next}`)?.focus();}}} onClick={()=>setTier(i)}>{name}</button>)}</div>
   <div className={styles.careerCards} id="racer-career-races" role="tabpanel" aria-labelledby={`racer-tier-${tier}`}>{STAGES.filter(s=>s.tier===tier).map(stage=>{const open=unlocked(career,stage),record=career.records[stage.id],track=circuitFor(stage.circuit);return <button key={stage.id} className={styles.careerCard} disabled={!open} onClick={()=>start(stage)} aria-label={`Race ${stage.index+1}: ${stage.name}, ${stage.opponents} opponents, ${stage.laps} laps, ${open?`${record?.stars??0} stars`:'locked'}`}>
    <svg viewBox="0 0 155 144" aria-hidden="true"><path d={track.mapPath}/></svg><span className={styles.raceNumber}>{String(stage.index+1).padStart(2,'0')}</span><b>{stage.name}</b><span>{track.definition.name}</span><small>{stage.opponents} OPPONENTS · {stage.laps} {stage.laps===1?'LAP':'LAPS'}</small><strong>{open?starText(record?.stars??0):'LOCKED'}</strong>
   </button>;})}</div>
   <div className={styles.careerFoot}><p>{careerComplete(career)?'Career complete. Replay any race to collect all 36 stars.':'Finish top three to advance. 3rd ★ · 2nd ★★ · 1st ★★★'}</p><button data-primary className={styles.primary} onClick={()=>start(continueStage(careerSave.current))}>CONTINUE CAREER <span>→</span></button></div>
  </article></div>}
  {(status==='paused'||status==='finished')&&<div className={styles.scrim}><article className={styles.panel} data-result={status==='finished'} data-career={!!activeStage} role="dialog" aria-modal="true" aria-label={status==='paused'?'Racer paused':'Race result'}><div className={styles.kicker}>{status==='paused'?'TAKE A BREATHER':`CHEQUERED FLAG · ${DIFFICULTIES[result.difficulty].label.toUpperCase()}`}</div><h2>{status==='paused'?'RACE PAUSED':result.position===1?'P1. NICE DRIVE.':`P${result.position}. NEXT TIME?`}</h2>{status==='finished'?<>{activeStage&&<div className={styles.careerOutcome}><strong aria-label={`${starsFor(result.position)} stars`}>{starText(starsFor(result.position))}</strong><p>{starsFor(result.position)>0?activeStage.index===11?'Career complete! Every race cleared.':'Podium secured. Next race unlocked.':'Finish in the top three to unlock the next race.'}</p></div>}<div className={styles.resultStats}><span>RACE TIME<b>{clock(result.time)}</b></span><span>BEST LAP<b>{clock(result.lap)}</b></span></div><details><summary>RACE DETAILS</summary><div className={styles.resultStats}><span>OVERTAKES<b>{result.overtakes}</b></span><span>START<b>{result.launch==='perfect'?'PERFECT':result.launch==='jumped'?'WHEELSPIN':'—'}</b></span><span>DAMAGE<b>{result.damage}%</b></span><span>HITS<b>{result.contacts}</b></span></div></details>
    <details><summary>CLASSIFICATION</summary><ol className={styles.classification} aria-label="Classification">{resultRows.map(c=><li key={c.name} data-player={c.player}><b>{c.rank}</b><i style={{background:c.color}}/><span>{c.name}</span><em>{c.time===null?'RUNNING':c.rank===1||winner===null?clock(c.time):`+${(c.time-winner).toFixed(2)}`}</em></li>)}</ol></details>
    {!activeStage&&<p>Your best {stats.best===null?'—':clock(stats.best)} · {stats.races} races · {stats.wins} wins</p>}</>:<><details><summary>SETTINGS</summary><label><span>Automatic acceleration</span><input type="checkbox" checked={options.autoAccelerate} onChange={e=>{clear();setOptions({...options,autoAccelerate:e.target.checked});}}/></label><label><span>Steering sensitivity</span><input aria-label="Steering sensitivity" type="range" min="0.6" max="1.5" step="0.1" value={options.sensitivity} onChange={e=>setOptions({...options,sensitivity:Number(e.target.value)})}/></label><label><span>Touch controls</span><input type="checkbox" checked={touch} onChange={e=>setTouch(e.target.checked)}/></label>{soundToggle}<label><span>Reduce camera shake</span><input type="checkbox" checked={settings.reducedShake} onChange={e=>saveSettings({...settings,reducedShake:e.target.checked})}/></label><button className={styles.secondary} onClick={restart}>Restart race</button></details><details><summary>HELP</summary><p>Arrows / WASD · Space boost · B look back · C camera · R reset<br/>Follow the darker racing line, brake before the corner, boost on the exit.</p></details></>}
   <button data-primary className={styles.primary} onClick={()=>status==='paused'?resume():nextStage?start(nextStage):restart()}>{status==='paused'?'RESUME RACE':nextStage?'NEXT RACE':activeStage?'RETRY RACE':'RACE AGAIN'} <span>→</span></button>{activeStage&&<button className={styles.secondary} onClick={toCareer}>BACK TO CAREER</button>}{!activeStage&&<button className={styles.secondary} onClick={leave}>Back to Motorsport</button>}</article></div>}
  {status==='loading'&&<div className={styles.scrim} role="status"><div className={styles.loading}>RACER<small>PREPARING SILVERSTONE GP…</small></div></div>}
  {status==='error'&&<div className={styles.scrim} role="alert"><article className={styles.panel}><h2>PIT STOP</h2><p>The 3D race could not start. {error}</p><button className={styles.primary} onClick={()=>location.reload()}>Reload Racer</button>{!activeStage&&<button className={styles.secondary} onClick={leave}>Back to Motorsport</button>}</article></div>}
  {notice&&<button className={styles.notice} onClick={()=>setNotice('')}>{notice} Dismiss</button>}
 </section>;
}
