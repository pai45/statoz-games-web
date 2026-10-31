import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { beginMatch, disposeMatch, loadShootoutRuntime, pauseMatch, startShootoutLoop, type MatchRuntime } from '../penalty-shootout/match-runtime';
import type { MatchRules, Settings, Snapshot, Style } from '../penalty-shootout/game-types';
import { AimStick, DivePad } from './controls';
import { Flag } from './flag';
import { Modal } from './modal';
import type { MatchResult, Nation } from './types';
import styles from './screen.module.css';

type Props={id:string;player:Nation;opponent:Nation;level:number;seed:number;label:string;rules:MatchRules;settings:Settings;onSettings:(s:Settings)=>void;onResolved:(r:MatchResult)=>void;onComplete:(r:MatchResult)=>void;onExit:()=>void;hostCommand?:{id:number;type:'pause'|'resume'|'dispose'}};
const labels={goal:'GOAL',saved:'SAVED',wide:'WIDE',over:'OVER THE BAR',woodwork:'OFF THE FRAME'};
export function CupMatch(props:Props){
 const canvas=useRef<HTMLDivElement>(null),rt=useRef<MatchRuntime|null>(null),refs=useRef(props),reported=useRef(false),saved=useRef(false);
 useLayoutEffect(()=>{refs.current=props;});
 const [snapshot,setSnapshot]=useState<Snapshot|null>(null),[ready,setReady]=useState(false),[paused,setPaused]=useState(false),[error,setError]=useState(''),[retry,setRetry]=useState(0),[help,setHelp]=useState(false);
 const pause=useCallback(()=>{if(rt.current){pauseMatch(rt.current);setPaused(true);}},[]);
 const resume=()=>{const r=rt.current;if(!r||error)return;r.input.setPaused(false);r.audio.unlock();r.accumulator=0;r.paused=false;setPaused(false);};
 useEffect(()=>{
  let alive=true,stop=()=>{};
  const visibility=()=>{if(document.hidden)pause();};document.addEventListener('visibilitychange',visibility);
  void loadShootoutRuntime(canvas.current!,refs.current.settings,pause,()=>{pause();setError('The pitch graphics were interrupted. Reload the pitch to restart this fixture.');},()=>{pause();}).then(async r=>{
   if(!alive){disposeMatch(r);return;}const p=refs.current;
   try{await r.scene.setTeamColors(p.player.primary,p.opponent.primary,p.player.secondary,p.opponent.secondary);}catch(error){disposeMatch(r);throw error;}
   if(!alive){disposeMatch(r);return;}rt.current=r;
   beginMatch(r,p.level,p.seed,p.rules);stop=startShootoutLoop(r,()=>refs.current.settings,setSnapshot);setError('');setReady(true);setPaused(false);
   if(document.hidden)pause();
  }).catch(()=>{if(alive)setError('The pitch could not load. Retry to restart this fixture.');});
  return ()=>{alive=false;stop();document.removeEventListener('visibilitychange',visibility);if(rt.current){disposeMatch(rt.current);rt.current=null;}};
 },[retry,pause]);
 useEffect(()=>{rt.current?.audio.configure(props.settings);},[props.settings]);
 useEffect(()=>{if(!snapshot?.complete||!snapshot.outcome||saved.current)return;saved.current=true;refs.current.onResolved({id:refs.current.id,score:snapshot.score,outcome:snapshot.outcome,kicks:snapshot.kicks,suddenDeath:snapshot.suddenDeath});},[snapshot]);
 useEffect(()=>{if(!snapshot||snapshot.phase!=='summary'||!snapshot.complete||!snapshot.outcome||reported.current)return;reported.current=true;refs.current.onComplete({id:refs.current.id,score:snapshot.score,outcome:snapshot.outcome,kicks:snapshot.kicks,suddenDeath:snapshot.suddenDeath});},[snapshot]);
 useEffect(()=>{const command=props.hostCommand;if(!command)return;const timer=setTimeout(()=>{if(command.type==='pause')pause();else if(command.type==='resume'){const r=rt.current;if(r&&!error){r.input.setPaused(false);r.audio.unlock();r.paused=false;r.accumulator=0;setPaused(false);}}},0);return ()=>clearTimeout(timer);},[props.hostCommand,pause,error]);
 const next=()=>{const r=rt.current;if(!r)return;r.input.clear();r.simulation.next();r.input.setRole(r.simulation.role);r.previous=null;setSnapshot(r.simulation.snapshot());};
 const reloadPitch=()=>{const s=rt.current?.simulation.snapshot();if(s?.complete&&s.outcome){refs.current.onComplete({id:refs.current.id,score:s.score,outcome:s.outcome,kicks:s.kicks,suddenDeath:s.suddenDeath});return;}saved.current=false;reported.current=false;setReady(false);setError('');setRetry(n=>n+1);};
 const s=snapshot,taking=s?.role==='shooting',inResult=s?.phase==='resolution'||s?.phase==='replay',busy=s?.phase!=='preparation'&&s?.phase!=='charging';
 return <div className={styles.match} data-cup-match data-phase={s?.phase} data-role={s?.role} data-aim-x={s?.aim.x} data-aim-y={s?.aim.y} style={{'--marker':`${(s?.marker??.5)*100}%`,'--charge':`${(s?.power??0)*100}%`} as CSSProperties}>
  <div className={styles.canvas} ref={canvas}/>
  <header className={styles.matchHeader}><button onClick={pause} aria-label="Pause match">Ⅱ <span>Pause</span></button><span>{props.label}</span><button aria-label={props.settings.muted?'Unmute audio':'Mute audio'} onClick={()=>props.onSettings({...props.settings,muted:!props.settings.muted})}>{props.settings.muted?'Sound off':'Sound on'}</button></header>
  <div className={styles.scoreboard}><div><Flag id={props.player.id}/><b>{props.player.id}</b><KickDots s={s} side="shooting"/></div><strong>{s?.score[0]??0}<span>–</span>{s?.score[1]??0}</strong><div><Flag id={props.opponent.id}/><b>{props.opponent.id}</b><KickDots s={s} side="keeping"/></div><small>{s?.suddenDeath?'SUDDEN DEATH':`PENALTY ${Math.min(5,Math.floor((s?.kicks.length??0)/2)+1)} / 5`}</small></div>
  {!paused&&ready&&!error&&s&&<>
   <div className={styles.turn}><b>{taking?'YOUR PENALTY':'YOU’RE IN GOAL'}</b><span>{s.notice}</span></div>
   <div className={styles.matchControls}>{inResult?<div className={styles.resultStrip}><div><small>{s.phase==='replay'?'REPLAY':'PENALTY RESULT'}</small><h2>{s.result?labels[s.result.outcome]:''}</h2></div><div>{s.phase!=='replay'&&<button onClick={()=>rt.current?.simulation.replay()}>Replay</button>}<button className={styles.primary} onClick={next}>{s.phase==='replay'?'Skip replay':s.complete?'View result':'Next penalty →'}</button></div></div>:<>
    <div className={styles.meterArea}>{taking?<><div className={styles.meterLabel}><b>{s.phase==='preparation'?'COMPOSURE':'SHOT POWER'}</b><span>{s.phase==='preparation'?'PRESS IN THE GREEN':`${Math.round(s.power*100)}%`}</span></div><div className={s.phase==='preparation'?styles.composure:styles.power}><i/><b/></div><div className={styles.shotStyles}>{(['driven','placed','chip'] as Style[]).map(style=><button key={style} disabled={s.phase!=='preparation'} aria-pressed={s.style===style} onClick={()=>{if(rt.current)rt.current.input.style=style;}}>{style}</button>)}</div></>:<div className={styles.keeperHint}><b>READ THE TAKER</b><span>Move on the line. Time your dive.<br/>Early commitment reaches farther.</span></div>}</div>
    <div className={styles.touchRow}><AimStick onAim={(x,y)=>rt.current?.input.aim(x,y)} disabled={!!taking&&s.phase!=='preparation'} label={taking?'1 / AIM':'MOVE'}/>{taking?<button className={styles.shoot} disabled={busy} onPointerDown={e=>{e.preventDefault();e.currentTarget.setPointerCapture(e.pointerId);rt.current?.audio.unlock();rt.current?.input.shoot(true);}} onPointerUp={()=>rt.current?.input.shoot(false)} onPointerCancel={()=>{rt.current?.input.shoot(false);rt.current?.simulation.cancelInput();}} onLostPointerCapture={()=>rt.current?.input.shoot(false)} onKeyDown={e=>{if(e.code==='Enter')rt.current?.input.shoot(true);}} onKeyUp={e=>{if(e.code==='Enter')rt.current?.input.shoot(false);}}>SHOOT<small>HOLD · RELEASE</small></button>:<DivePad disabled={!['preparation','runup','flight'].includes(s.phase)} onDive={(x,y)=>rt.current?.input.dive(x,y)}/>}</div>
   </>}</div>
  </>}
  {!ready&&!error&&<div className={styles.loading} role="status">Preparing the pitch…</div>}
  {(paused||error)&&<Modal title={error?'Pitch interrupted':'Match paused'} onClose={error?undefined:resume}><p>{error||'Your match is paused.'}</p>{error?<button onClick={reloadPitch}>{s?.complete?'View result':'Reload pitch'}</button>:<button className={styles.primary} onClick={resume}>Resume match</button>}<button onClick={()=>setHelp(v=>!v)}>Controls</button>{help&&<p>Aim: WASD / left stick. Hold Space / B to charge, release to shoot. 1 / 2 / 3 changes shot style. Keep: A / D to position; arrow keys / right stick to dive, Space / A to hold centre. On touch, use both pads together.</p>}<label>Effects <input type="range" min="0" max="1" step="0.05" value={props.settings.effects} onChange={e=>props.onSettings({...props.settings,effects:+e.target.value})}/></label><label>Crowd <input type="range" min="0" max="1" step="0.05" value={props.settings.crowd} onChange={e=>props.onSettings({...props.settings,crowd:+e.target.value})}/></label><label><input type="checkbox" checked={props.settings.reducedMotion} onChange={e=>props.onSettings({...props.settings,reducedMotion:e.target.checked})}/> Reduced motion</label><button onClick={props.onExit}>Leave match</button><small>Leaving restarts this fixture when you return.</small></Modal>}
  <span className={styles.sr} aria-live="polite">{inResult&&s?.result?`${labels[s.result.outcome]}. ${props.player.name} ${s.score[0]}, ${props.opponent.name} ${s.score[1]}.`:''}</span>
 </div>;
}
function KickDots({s,side}:{s:Snapshot|null;side:'shooting'|'keeping'}){const kicks=s?.kicks.filter(k=>k.role===side)??[];return <div className={styles.kickDots} aria-label={`${side} penalty history`}>{Array.from({length:Math.max(5,kicks.length)},(_,i)=><i key={i} title={kicks[i]?.outcome??'Not taken'} data-goal={kicks[i]?kicks[i].outcome==='goal':undefined}>{kicks[i]?kicks[i].outcome==='goal'?'●':'×':'○'}</i>)}</div>;}
