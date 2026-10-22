/* eslint-disable @next/next/no-img-element -- Local identity SVGs also render in offline game bundles. */
"use client";
import {mountRetroPresentation} from "../shared/retro/runtime";
import {RetroPresentationSettings} from "../shared/retro/settings";
import {useEffect,useRef,useState} from "react";
import {createMatch,HZ,step,type Match} from "./simulation";
import {loadPictures} from "./presentation";
import {createRenderer} from "./renderer";
import {HoopsInput,type Control} from "./input";
import {HoopsAudio} from "./audio";
import {addResult,readArchive,writeArchive,type Archive,type Settings} from "./persistence";
import styles from "./screen.module.css";

type View={score:[number,number];time:number;shot:number;charge:number;phase:string;paused:boolean;started:boolean;callout?:string};
const initial:View={score:[0,0],time:180,shot:24,charge:0,phase:"playing",paused:false,started:false};
export type HoopsHostEvent={type:"ready"|"settings"|"result"|"error"|"exit";payload:unknown};
export type HoopsGameProps={assetBase:string;onExit:()=>void;onEvent?:(event:HoopsHostEvent)=>void;hostSettings?:Settings;hostCommand?:{id:number;type:"pause"|"resume"}};
export function HoopsGame({assetBase,onExit,onEvent,hostSettings,hostCommand}:HoopsGameProps){
  const shell=useRef<HTMLElement>(null),canvas=useRef<HTMLCanvasElement>(null),session=useRef<{start:()=>void;pause:(force?:boolean)=>void;input:HoopsInput;settings:(s:Settings)=>void}|null>(null);
  const [attempt,setAttempt]=useState(0),[error,setError]=useState(""),[loaded,setLoaded]=useState(false),[view,setView]=useState(initial),[settings,setSettings]=useState<Settings>({sfx:true,music:false});
  const [options,setOptions]=useState(false);
  const eventHandler=useRef(onEvent);
  useEffect(()=>mountRetroPresentation(shell.current!,()=>session.current?.pause(true)),[]);
  useEffect(()=>{eventHandler.current=onEvent;},[onEvent]);
  useEffect(()=>{
    const onEvent=(event:HoopsHostEvent)=>eventHandler.current?.(event);
    const abort=new AbortController(),input=new HoopsInput(),audio=new HoopsAudio();let render:ReturnType<typeof createRenderer>|null=null,raf=0,dead=false,paused=false,started=false,last=0,acc=0;
    let storage:Storage|null=null;try{storage=localStorage;}catch{}
    let archive:Archive=readArchive(storage),match:Match=createMatch(crypto.getRandomValues(new Uint32Array(1))[0]),resultSaved=false,matchNumber=0;
    const id=crypto.randomUUID();setSettings(archive.settings);audio.configure(archive.settings);
    const update=()=>setView({score:[...match.score],time:Math.ceil(match.remaining/HZ),shot:Math.ceil(match.shotClock/HZ),charge:match.charge[0],phase:match.phase,paused,started,callout:match.lastScore&&match.tick-match.lastScore.tick<55?`${match.lastScore.team===0?"NAVY":"AMBER"} +${match.lastScore.value}`:""});
    const pause=()=>{paused=true;shell.current?.querySelectorAll("[data-held]").forEach(b=>b.removeAttribute("data-held"));input.clear();match.buffer=null;acc=0;last=0;audio.pause();update();};
    const start=()=>{if(!render||dead)return;if(match.phase==="result"){match=createMatch(crypto.getRandomValues(new Uint32Array(1))[0]);resultSaved=false;}started=true;paused=false;input.clear();last=0;acc=0;void audio.unlock().catch(()=>{});update();};
    session.current={start,pause:force=>force?pause():paused?start():pause(),input,settings:s=>{archive={...archive,settings:s};writeArchive(storage,archive);audio.configure(s);onEvent?.({type:"settings",payload:s});}};
    const editable=(target:EventTarget|null)=>target instanceof HTMLElement&&!!target.closest('input,textarea,select,[contenteditable="true"]');
    const key=(e:KeyboardEvent)=>{if(e.code==="Escape"&&e.type==="keydown"&&!e.repeat){if(started)session.current?.pause();return;}if(e.type==="keydown"&&editable(e.target))return;if(input.key(e.code,e.type==="keydown"))e.preventDefault();};
    const focusControl=(e:FocusEvent)=>{if(editable(e.target)){input.clear();match.buffer=null;}};
    const background=()=>{if(document.hidden&&started)pause();};
    const blur=()=>{if(started)pause();else input.clear();};
    const lost=(e:Event)=>{e.preventDefault();pause();setError("The court display stopped. Reload the game to continue.");};
    window.addEventListener("keydown",key);window.addEventListener("keyup",key);window.addEventListener("blur",blur);window.addEventListener("focusin",focusControl);document.addEventListener("visibilitychange",background);
    const element=canvas.current!;element.addEventListener("webglcontextlost",lost);
    const loop=(now:number)=>{if(dead)return;raf=requestAnimationFrame(loop);if(!render)return;
      if(started&&!paused&&match.phase!=="result"){
        if(last)acc+=Math.min(.1,(now-last)/1000);last=now;
        while(acc>=1/HZ){step(match,input.read());audio.events(match.events);acc-=1/HZ;}
        if(match.tick%6===0||String(match.phase)==="result")update();
      }else{last=0;acc=0;}
      render.draw(match);
      if(match.phase==="result"&&!resultSaved){resultSaved=true;audio.pause();const result={id:id+":"+(++matchNumber),seed:match.seed,score:[...match.score] as [number,number],completedAt:new Date().toISOString(),rulesVersion:match.version};archive=addResult(archive,result);writeArchive(storage,archive);onEvent?.({type:"result",payload:result});update();}
    };
    void loadPictures(assetBase,abort.signal).then(p=>{if(dead)return;render=createRenderer(element,p);setLoaded(true);onEvent?.({type:"ready",payload:{gameId:"retro-hoops",rulesVersion:match.version}});update();raf=requestAnimationFrame(loop);}).catch(e=>{if(!dead){const message=e instanceof Error?e.message:"The court could not load.";setError(message);onEvent?.({type:"error",payload:{message}});}});
    return()=>{dead=true;abort.abort();cancelAnimationFrame(raf);session.current=null;input.clear();render?.dispose();void audio.dispose();window.removeEventListener("keydown",key);window.removeEventListener("keyup",key);window.removeEventListener("blur",blur);window.removeEventListener("focusin",focusControl);document.removeEventListener("visibilitychange",background);element.removeEventListener("webglcontextlost",lost);};
  },[attempt,assetBase]);
  useEffect(()=>{if(hostSettings){setSettings(hostSettings);session.current?.settings(hostSettings);}},[hostSettings]);
  useEffect(()=>{if(hostCommand?.type==="pause")session.current?.pause(true);else if(hostCommand?.type==="resume")session.current?.start();},[hostCommand]);
  useEffect(()=>{if(!options)return;const previous=document.activeElement;const dialog=shell.current?.querySelector('[role="dialog"]');const key=(e:KeyboardEvent)=>{if(e.code==="Escape"){e.preventDefault();e.stopImmediatePropagation();setOptions(false);}else if(e.code==="Tab"&&dialog){const controls=Array.from(dialog.querySelectorAll<HTMLElement>('button,input,select'));const first=controls[0],last=controls[controls.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}}};document.addEventListener("keydown",key,true);return()=>{document.removeEventListener("keydown",key,true);if(previous instanceof HTMLElement)previous.focus();};},[options]);
  const change=(s:Settings)=>{setSettings(s);session.current?.settings(s);};
  const button=(control:Control,label:string,face:string)=> <button type="button" className={styles[control]} aria-label={label} onPointerDown={e=>{e.preventDefault();e.currentTarget.setPointerCapture(e.pointerId);e.currentTarget.dataset.held="true";session.current?.input.down("p"+e.pointerId,control);}} onPointerUp={e=>{delete e.currentTarget.dataset.held;session.current?.input.up("p"+e.pointerId);}} onPointerCancel={e=>{delete e.currentTarget.dataset.held;session.current?.input.up("p"+e.pointerId);}} onLostPointerCapture={e=>{delete e.currentTarget.dataset.held;session.current?.input.up("p"+e.pointerId);}}><span>{face}</span></button>;
  return <section ref={shell} data-retro-frame className={styles.root} aria-label="Rimforge 3 handheld console">
    <header className={styles.header}><button onClick={()=>{onEvent?.({type:"exit",payload:{}});onExit();}}>Exit</button><h1><img src="../../assets/games/identity/retro-hoops.svg" alt="" width="42" height="31" style={{display:"inline-block",verticalAlign:"middle",marginRight:8}}/>RIMFORGE 3 <small>POCKET ARCADE / 3V3</small></h1><div className={styles.utility}><button disabled={!loaded||!view.started||view.phase==="result"} onClick={()=>session.current?.pause()}>{view.paused?"Resume":"Pause"}</button><button aria-label="Settings" onClick={()=>{session.current?.pause(true);setOptions(true);}}>Settings</button></div></header>
    <div data-retro-console className={styles.console}>
      <aside data-retro-grip="left" className={styles.leftGrip} aria-label="Movement controls"><span data-retro-decoration className={styles.hardwareLabel}>8-WAY CONTROL</span><div className={styles.pad}>{button("up","Move up",String.fromCodePoint(0x2191))}{button("left","Move left",String.fromCodePoint(0x2190))}<i aria-hidden="true"/>{button("right","Move right",String.fromCodePoint(0x2192))}{button("down","Move down",String.fromCodePoint(0x2193))}</div><span data-retro-decoration className={styles.hardwareLabel}>WASD / ARROWS</span><div data-retro-decoration className={styles.speaker} aria-hidden="true"/></aside>
      <main data-retro-display className={styles.display}>
        <div className={styles.score} aria-live="off"><span>NAVY <strong>{String(view.score[0]).padStart(2,"0")}</strong></span><span><b>{Math.floor(view.time/60)}:{String(view.time%60).padStart(2,"0")}</b><small>SHOT {view.shot}</small></span><span><strong>{String(view.score[1]).padStart(2,"0")}</strong> AMBER</span></div>
        <div className={styles.court}><canvas ref={canvas} width={640} height={360} aria-label="Full-court three versus three basketball" />
          {view.callout&&<div className={styles.callout} aria-live="polite">{view.callout}<small>BUCKET!</small></div>}
          {(error||!loaded||!view.started||view.paused||view.phase==="result")&&<div className={styles.overlay} role={error?"alert":"status"}>
            <img src="../../assets/games/identity/retro-hoops.svg" alt="Rimforge 3" width="116" height="86" style={{objectFit:"contain",maxHeight:"22vh"}}/><span data-retro-decoration className={styles.hardwareLabel}>RIMFORGE 3 / ARCADE</span><h2>{error?"COURT UNAVAILABLE":!loaded?"LOADING COURT":view.phase==="result"?(view.score[0]===view.score[1]?"DRAW":view.score[0]>view.score[1]?"NAVY WINS":"AMBER WINS"):view.paused?"PAUSED":"TAKE THE COURT"}</h2>
            {error?<><p>{error}</p><button onClick={()=>{setError("");setLoaded(false);setView(initial);setAttempt(n=>n+1);}}>Retry loading</button></>:loaded&&<><p>Three minutes. Full court. Move + A to shoot or block. B passes or steals.</p><button onClick={()=>session.current?.start()}>{view.phase==="result"?"Rematch":view.paused?"Resume match":"Start match"}</button></>}
          </div>}
        </div>
        <div className={styles.displayFooter}><span>SUPER</span><meter min="0" max="100" value={view.charge} aria-label="Super shot charge"/><span>{view.charge===100?"READY":view.charge+"%"}</span><span className={styles.statusLamp} data-live={view.started&&!view.paused}/> <span>3V3</span></div>
      </main>
      <aside data-retro-grip="right" className={styles.rightGrip} aria-label="Action controls"><span data-retro-decoration className={styles.hardwareLabel}>TWO-BUTTON ARCADE</span><div className={styles.actions}><div>{button("shoot","Shoot or block","A")}<span>SHOOT / BLOCK <kbd>J</kbd></span></div><div>{button("pass","Pass or steal","B")}<span>PASS / STEAL <kbd>K</kbd></span></div></div><div data-retro-decoration className={styles.speaker} aria-hidden="true"/><span data-retro-decoration className={styles.hardwareLabel}>POCKET BASKETBALL</span></aside>
    </div>
    <footer className={styles.footer}><span className={styles.rotate}>Rotate to landscape for the handheld view</span><span>LOCAL ARCADE ? FICTIONAL TEAMS ? NO REWARDS</span></footer>
    {options&&<div className={styles.settingsBackdrop}><section className={styles.settings} role="dialog" aria-modal="true" aria-label="Settings"><h2>SETTINGS</h2><RetroPresentationSettings/><label><input type="checkbox" checked={settings.sfx} onChange={e=>change({...settings,sfx:e.target.checked})}/> Sound effects</label><label>Sound volume<input aria-label="Sound volume" type="range" min="0" max="1" step="0.05" value={settings.sfxVolume??.7} onChange={e=>change({...settings,sfxVolume:Number(e.target.value)})}/></label><label><input type="checkbox" checked={settings.music} onChange={e=>change({...settings,music:e.target.checked})}/> Music</label><label>Music volume<input aria-label="Music volume" type="range" min="0" max="1" step="0.05" value={settings.musicVolume??.4} onChange={e=>change({...settings,musicVolume:Number(e.target.value)})}/></label><p>Original synthesized music and sound effects.</p><button autoFocus onClick={()=>setOptions(false)}>Back to game</button><small>Resume the match when you are ready.</small></section></div>}
  </section>;
}
