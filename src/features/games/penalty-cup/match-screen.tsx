import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { beginMatch, disposeMatch, loadShootoutRuntime, pauseMatch, startShootoutLoop, type MatchRuntime } from '../penalty-shootout/match-runtime';
import type { MatchCheckpoint, MatchRules, Settings, Snapshot, Style } from '../penalty-shootout/game-types';
import { AimStick, DivePad } from './controls';
import { Flag } from './flag';
import { Modal } from './modal';
import type { MatchResult, Nation } from './types';
import styles from './screen.module.css';

type Props={id:string;player:Nation;opponent:Nation;level:number;seed:number;label:string;rules:MatchRules;persistent:boolean;saveNotice?:string;checkpoint?:MatchCheckpoint;settings:Settings;onSettings:(s:Settings)=>void;onCheckpoint:(value:MatchCheckpoint)=>void;onComplete:(r:MatchResult)=>void;onExit:()=>void;hostCommand?:{id:number;type:'pause'|'resume'|'dispose'}};
const labels={goal:'GOAL',saved:'SAVED',wide:'WIDE',over:'OVER',woodwork:'POST'};
const toResult=(id:string,s:Snapshot):MatchResult=>({id,score:s.score,outcome:s.outcome!,kicks:s.kicks,suddenDeath:s.suddenDeath});

export function CupMatch(props:Props) {
  const canvas=useRef<HTMLDivElement>(null),rt=useRef<MatchRuntime|null>(null),refs=useRef(props),reported=useRef(false),advance=useRef<()=>void>(()=>{}),requestedPause=useRef(false);
  useLayoutEffect(()=>{refs.current=props;});
  const [snapshot,setSnapshot]=useState<Snapshot|null>(null),[ready,setReady]=useState(false),[paused,setPaused]=useState(false),[error,setError]=useState(''),[retry,setRetry]=useState(0),[help,setHelp]=useState(false);
  const pause=useCallback(()=>{requestedPause.current=true;if(rt.current)pauseMatch(rt.current);setPaused(true);},[]);
  const resume=useCallback(()=>{requestedPause.current=false;setPaused(false);const r=rt.current;if(!r)return;r.input.setPaused(false);r.audio.unlock();r.accumulator=0;r.paused=false;},[]);
  useEffect(()=>{
    let alive=true,stop=()=>{};
    const visibility=()=>{if(document.hidden)pause();};document.addEventListener('visibilitychange',visibility);
    void loadShootoutRuntime(canvas.current!,refs.current.settings,pause,()=>{pause();setError('Pitch interrupted');},()=>pause()).then(async r=>{
      if(!alive){disposeMatch(r);return;}
      const p=refs.current;
      try{await r.scene.setTeamColors(p.player.primary,p.opponent.primary,p.player.secondary,p.opponent.secondary);}catch(cause){disposeMatch(r);throw cause;}
      if(!alive){disposeMatch(r);return;}
      r.scene.optimizeForCup();rt.current=r;beginMatch(r,p.level,p.seed,p.rules);
      if(p.checkpoint)r.simulation.restoreCheckpoint(p.checkpoint);
      r.input.setRole(r.simulation.role);
      stop=startShootoutLoop(r,()=>refs.current.settings,setSnapshot,{maxRenderFps:60,hudFps:15,onCheckpoint:p.persistent?value=>refs.current.onCheckpoint(value):undefined});
      setError('');setReady(true);
      if(document.hidden||requestedPause.current)pause();else setPaused(false);
    }).catch(()=>{if(alive)setError('Pitch unavailable');});
    return()=>{alive=false;stop();document.removeEventListener('visibilitychange',visibility);if(rt.current){disposeMatch(rt.current);rt.current=null;}};
  },[retry,pause]);
  useEffect(()=>{rt.current?.audio.configure(props.settings);},[props.settings]);
  useEffect(()=>{
    if(snapshot?.phase!=='summary'||!snapshot.complete||!snapshot.outcome||reported.current)return;
    reported.current=true;refs.current.onComplete(toResult(refs.current.id,snapshot));
  },[snapshot]);
  const phase=snapshot?.phase,count=snapshot?.kicks.length;
  useEffect(()=>{
    if(phase!=='resolution'||paused)return;
    const timer=setTimeout(()=>advance.current(),2200);return()=>clearTimeout(timer);
  },[phase,count,paused]);
  useEffect(()=>{
    if(!props.hostCommand)return;
    const type=props.hostCommand.type,timer=setTimeout(()=>{if(type==='pause')pause();else if(type==='resume'&&!error)resume();},0);
    return()=>clearTimeout(timer);
  },[props.hostCommand,pause,resume,error]);
  const next=()=>{const r=rt.current;if(!r)return;r.input.clear();r.simulation.next();r.input.setRole(r.simulation.role);r.previous=null;setSnapshot(r.simulation.snapshot());};
  useLayoutEffect(()=>{advance.current=next;});
  const reload=()=>{
    const s=rt.current?.simulation.snapshot();
    if(s?.complete&&s.outcome){refs.current.onComplete(toResult(refs.current.id,s));return;}
    if(s&&s.kicks.length&&['resolution','replay'].includes(s.phase))refs.current.onCheckpoint(rt.current!.simulation.checkpoint());
    setReady(false);setError('');setRetry(n=>n+1);
  };
  const s=snapshot,taking=s?.role==='shooting',inResult=phase==='resolution'||phase==='replay',busy=phase!=='preparation'&&phase!=='charging';
  return <div className={styles.match} data-cup-match data-phase={phase} data-role={s?.role} data-kicks={count??0} data-aim-x={s?.aim.x} data-aim-y={s?.aim.y} style={{'--marker':`${(s?.marker??.5)*100}%`,'--charge':`${(s?.power??0)*100}%`} as CSSProperties}>
    <div className={styles.canvas} ref={canvas}/>
    <header className={styles.matchHeader}><button aria-label="Pause match" onClick={pause}>Ⅱ</button><span>{props.label}</span><button aria-label={props.settings.muted?'Unmute audio':'Mute audio'} onClick={()=>props.onSettings({...props.settings,muted:!props.settings.muted})}>{props.settings.muted?'♪ off':'♪'}</button></header>
    <div className={styles.scoreboard}>
      <div><Flag id={props.player.id}/><b>{props.player.id}</b><KickDots s={s} side="shooting"/></div>
      <strong>{s?.score[0]??0}<span>–</span>{s?.score[1]??0}</strong>
      <div><Flag id={props.opponent.id}/><b>{props.opponent.id}</b><KickDots s={s} side="keeping"/></div>
      <small>{s?.suddenDeath?'SUDDEN DEATH':`${Math.min(5,Math.floor((count??0)/2)+1)} / 5`} · {taking?'SHOOT':'SAVE'}</small>
    </div>
    {!paused&&ready&&!error&&s&&<>
      {inResult?<div className={styles.resultStrip}><b>{s.result?labels[s.result.outcome]:''}</b>{phase!=='replay'&&<button onClick={()=>rt.current?.simulation.replay()}>Replay</button>}<button className={styles.primary} onClick={next}>{phase==='replay'?'Skip replay':s.complete?'Result':'Next'} →</button></div>:<>
        <div className={styles.leftControls}>
          {taking&&<div className={styles.shotStyles}>{(['driven','placed','chip'] as Style[]).map(style=><button key={style} disabled={phase!=='preparation'} aria-pressed={s.style===style} onClick={()=>{if(rt.current)rt.current.input.style=style;}}>{style}</button>)}</div>}
          <AimStick onAim={(x,y)=>rt.current?.input.aim(x,y)} disabled={!!taking&&phase!=='preparation'} label={taking?'AIM':'MOVE'}/>
        </div>
        {taking&&<div className={styles.meterArea}><small>{phase==='preparation'?'COMPOSURE':`POWER ${Math.round(s.power*100)}%`}</small><div className={phase==='preparation'?styles.composure:styles.power}><i/><b/></div></div>}
        <div className={styles.rightControls}>{taking?<button className={styles.shoot} aria-label="Hold to shoot" disabled={busy} onPointerDown={e=>{e.preventDefault();e.currentTarget.setPointerCapture(e.pointerId);rt.current?.audio.unlock();rt.current?.input.shoot(true);}} onPointerUp={()=>rt.current?.input.shoot(false)} onPointerCancel={()=>{rt.current?.input.shoot(false);rt.current?.simulation.cancelInput();}} onLostPointerCapture={()=>rt.current?.input.shoot(false)} onKeyDown={e=>{if(e.code==='Enter')rt.current?.input.shoot(true);}} onKeyUp={e=>{if(e.code==='Enter')rt.current?.input.shoot(false);}}>SHOOT</button>:<DivePad disabled={!['preparation','runup','flight'].includes(s.phase)} onDive={(x,y)=>rt.current?.input.dive(x,y)}/>}</div>
      </>}
    </>}
    {!ready&&!error&&<div className={styles.loading} role="status">Loading pitch…</div>}
    {(paused||error)&&<Modal title={error||'Paused'} onClose={error?undefined:resume}>
      <div className={styles.dialogActions}>{error?<button className={styles.primary} onClick={reload}>Reload pitch</button>:<button className={styles.primary} onClick={resume}>Resume</button>}<button onClick={props.onExit}>{props.persistent?'Save & exit':'Exit match'}</button><button onClick={()=>setHelp(v=>!v)}>Controls</button></div>
      {help&&<div className={styles.helpGrid}><p>Aim · Hold · Release</p><p>Move · Tap to dive</p><p>WASD / Space / Arrows</p><p>Left stick / B / Right stick</p></div>}
      {props.persistent&&<small role="status">{props.saveNotice||'Completed penalties are kept.'}</small>}
    </Modal>}
    <span className={styles.sr} aria-live="polite">{inResult&&s?.result?`${labels[s.result.outcome]}. ${props.player.id} ${s.score[0]}, ${props.opponent.id} ${s.score[1]}.`:''}</span>
  </div>;
}
function KickDots({s,side}:{s:Snapshot|null;side:'shooting'|'keeping'}) {
  const kicks=s?.kicks.filter(k=>k.role===side)??[],last=kicks.slice(-5);
  return <div className={styles.kickDots} aria-label={`${side} penalty history`}>{Array.from({length:5},(_,i)=><i key={i} data-goal={last[i]?last[i].outcome==='goal':undefined}>{last[i]?last[i].outcome==='goal'?'●':'×':'○'}</i>)}</div>;
}
