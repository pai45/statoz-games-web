'use client';
import { useEffect, useRef, useState } from 'react';
import type { MatchCheckpoint, Settings } from '../penalty-shootout/game-types';
import { seeded } from '../penalty-shootout/engine/rules';
import { nations } from './nations';
import { acceptResult, cpuLevel, currentFixture, nation, newCup, randomOpponent, retryFixture, storeCheckpoint, storePending } from './tournament';
import { emptySave, resultId, updateCup } from './storage';
import { useCupSave } from './use-cup-save';
import { CupMatch } from './match';
import { Home, TeamSelect, CupHub, MatchResultView, History } from './views';
import { Landscape } from './landscape';
import { Modal } from './modal';
import { CupIcon } from './menu-icons';
import { useCupMusic } from './use-cup-music';
import { stageNames, type MatchResult } from './types';
import { menuStyles as styles } from './menu-styles';

type HostCommand = {id:number;type:'pause'|'resume'|'dispose'};
type Props = {onExit:()=>void;onEvent?:(event:{type:string;payload:Record<string,unknown>})=>void;hostCommand?:HostCommand};
type Exhibition = {team:string;opponent:string;seed:number;id:string};
const freshSeed = () => crypto.getRandomValues(new Uint32Array(1))[0];
const settingsKey = 'penalty-cup.settings.v1';
type CupSettings=Settings&{music:number};
const initialSettings = ():CupSettings => ({effects:.65,crowd:.45,music:.55,muted:false,reducedMotion:matchMedia('(prefers-reduced-motion: reduce)').matches});

export function PenaltyCupGame({onExit,onEvent,hostCommand}:Props) {
  const [screen,setScreen]=useState<'home'|'select'|'hub'|'match'|'result'>('home');
  const [mode,setMode]=useState<'cup'|'random'>('cup'),[selected,setSelected]=useState('ARG');
  const [random,setRandom]=useState<Exhibition|null>(null),[result,setResult]=useState<MatchResult|null>(null);
  const [dialog,setDialog]=useState<'help'|'history'|'replace'|null>(null),[settings,setSettings]=useState<CupSettings>(initialSettings),[matchPaused,setMatchPaused]=useState(false);
  const audioState=useCupMusic({volume:settings.music,muted:settings.muted,match:screen==='match',matchPaused,hostCommand});
  const scope=(window as Window&{__STATOZ_BOOT__?:{storageScope?:string}}).__STATOZ_BOOT__?.storageScope??'guest';
  const {save,ready,error,notice,commit,clearError}=useCupSave(scope);
  const sentReady=useRef(false);
  useEffect(()=>{if(ready&&!sentReady.current){sentReady.current=true;onEvent?.({type:'ready',payload:{game:'penalty-cup'}});}},[ready,onEvent]);
  useEffect(()=>{const timer=setTimeout(()=>{try{const old=JSON.parse(localStorage.getItem(settingsKey)??'null');if(old&&typeof old.muted==='boolean')setSettings({...initialSettings(),muted:old.muted,reducedMotion:!!old.reducedMotion,music:typeof old.music==='number'&&Number.isFinite(old.music)?Math.max(0,Math.min(1,old.music)):.55});}catch{}},0);return()=>clearTimeout(timer);},[]);
  const configure=(value:Settings&{music?:number})=>{const next={...value,music:value.music??settings.music};setSettings(next);try{localStorage.setItem(settingsKey,JSON.stringify(next));}catch{}};
  const cup=save.active,fixture=cup?currentFixture(cup):undefined;
  const choose=(value:typeof mode)=>{setMode(value);setScreen('select');};
  const continueCup=()=>{if(!cup)return;setMode('cup');setSelected(cup.team);setResult(cup.pending);setScreen(cup.pending?'result':'hub');};
  const create=()=>{
    if(mode==='random'){setRandom({team:selected,opponent:randomOpponent(selected,freshSeed()),seed:freshSeed(),id:crypto.randomUUID()});setResult(null);setScreen('match');return;}
    if(cup?.status==='active'&&dialog!=='replace'){setDialog('replace');return;}
    const next=newCup(selected,freshSeed(),crypto.randomUUID());commit(previous=>({...previous,active:next}));setDialog(null);setScreen('hub');
  };
  const checkpoint=(id:string,match:MatchCheckpoint)=>commit(previous=>{
    if(!previous.active)return previous;
    const next=storeCheckpoint(previous.active,id,match);
    return next===previous.active?previous:updateCup(previous,next);
  });
  const finish=(value:MatchResult)=>{
    setResult(value);
    if(mode==='cup')commit(previous=>previous.active?updateCup(previous,storePending(previous.active,value)):previous);
    else onEvent?.({type:'result',payload:{id:value.id,mode:'random',outcome:value.outcome,score:value.score}});
    setScreen('result');
  };
  const accept=()=>{
    if(!cup)return;
    const next=acceptResult(cup);commit(previous=>updateCup(previous,next));setScreen('hub');
    if(cup.status==='active'&&next.status!=='active')onEvent?.({type:'result',payload:{id:cup.id,mode:'cup',team:cup.team,outcome:next.status}});
  };
  const retry=()=>{commit(previous=>previous.active?updateCup(previous,retryFixture(previous.active)):previous);setResult(null);setScreen('match');};
  const playCup=()=>{if(cup?.pending){setResult(cup.pending);setScreen('result');}else setScreen('match');};
  const newRandom=(same:boolean)=>{
    if(!random)return;
    const pool=nations.filter(n=>n.id!==random.team&&n.id!==random.opponent);
    setRandom({...random,opponent:same?random.opponent:pool[Math.floor(seeded(freshSeed())()*pool.length)].id,seed:freshSeed(),id:crypto.randomUUID()});setResult(null);setScreen('match');
  };
  const player=mode==='cup'&&cup?nation(cup.team):random?nation(random.team):nation(selected);
  const opponent=mode==='cup'&&fixture?nation(fixture.home===cup?.team?fixture.away:fixture.home):random?nation(random.opponent):null;
  const matchId=mode==='cup'&&cup&&fixture?resultId(cup,fixture):random?.id;
  const displayResult=mode==='cup'?cup?.pending??result:result;

  if(screen==='match'&&opponent&&matchId&&(mode==='cup'?cup&&fixture:random))return <Landscape><CupMatch
    key={matchId} id={matchId} player={player} opponent={opponent}
    level={cpuLevel(mode==='cup'?cup!.stage:'group')} seed={mode==='cup'?fixture!.seed:random!.seed}
    label={mode==='cup'?stageNames[cup!.stage]:'Random Game'}
    rules={{responsiveKeeping:true,...(mode==='cup'&&cup!.stage==='group'?{allowDraw:true,earlyClinch:false}:{})}}
    persistent={mode==='cup'} saveNotice={notice} checkpoint={mode==='cup'?cup!.checkpoint?.match:undefined}
    onCheckpoint={value=>{if(mode==='cup')checkpoint(matchId,value);}}
    settings={settings} onSettings={configure} onComplete={finish} onPauseChange={setMatchPaused}
    onExit={()=>setScreen(mode==='cup'?'hub':'home')} hostCommand={hostCommand}
  /></Landscape>;

  return <Landscape><section className={styles.game} data-penalty-cup data-screen={screen} data-audio={audioState}>
    <header className={styles.header}>
      <button aria-label={screen==='home'?'Exit to games':'Back'} onClick={()=>screen==='home'?onExit():setScreen('home')}><CupIcon name="back"/></button>
      <div className={styles.headerBrand}><CupIcon name="cup"/>PENALTY CUP<span className={styles.headerStatus}><i/>MATCH NIGHT</span></div>
      <div>{notice&&<small role="status">{notice}</small>}<button aria-label={settings.muted?'Unmute audio':'Mute audio'} onClick={()=>configure({...settings,muted:!settings.muted})}><CupIcon name={settings.muted?'mute':'sound'}/></button><button aria-label="Controls and settings" onClick={()=>setDialog('help')}><CupIcon name="settings"/></button></div>
    </header>
    {error?<main className={styles.error} data-screen-content><h2>Saved cup unavailable</h2><p>{error}</p><button onClick={()=>{commit(()=>emptySave());clearError();}}>Reset save</button></main>:<>
      {screen==='home'&&<Home cup={cup} ready={ready} onCup={()=>choose('cup')} onRandom={()=>choose('random')} onContinue={continueCup} onHistory={()=>setDialog('history')}/>}
      {screen==='select'&&<TeamSelect selected={selected} onSelect={setSelected} random={mode==='random'} onPlay={create}/>}
      {screen==='hub'&&cup&&<CupHub cup={cup} onPlay={playCup} onNew={()=>choose('cup')}/>}
      {screen==='result'&&displayResult&&opponent&&<MatchResultView result={displayResult} team={player.id} opponent={opponent.id} cup={mode==='cup'?cup:null} onAccept={accept} onRetry={retry} onRematch={()=>newRandom(true)} onNewOpponent={()=>newRandom(false)} onHome={()=>setScreen('home')}/>}
    </>}
    {dialog==='replace'&&<Modal title="Replace this cup?" onClose={()=>setDialog(null)}><p>Your unfinished run will be replaced.</p><div className={styles.dialogActions}><button className={styles.primary} onClick={create}>New Cup</button><button onClick={()=>setDialog(null)}>Cancel</button></div></Modal>}
    {dialog==='history'&&<Modal title="Cup history" onClose={()=>setDialog(null)}><History cups={save.history}/><button onClick={()=>setDialog(null)}>Close</button></Modal>}
    {dialog==='help'&&<Modal title="Match settings" onClose={()=>setDialog(null)}><div className={styles.helpGrid}><p><b>SHOOT</b>Aim, hold to charge, release.</p><p><b>SAVE</b>Move left. Tap the right pad to dive.</p><p><b>KEYBOARD</b>WASD · Space · Arrows</p><p><b>GAMEPAD</b>Left stick · B · Right stick</p></div><div className={styles.soundSettings}><label>Music<input type="range" aria-label="Music volume" min="0" max="1" step=".05" value={settings.music} onChange={e=>configure({...settings,music:Number(e.target.value)})}/><output>{Math.round(settings.music*100)}%</output></label><button onClick={()=>configure({...settings,muted:!settings.muted})}>{settings.muted?'Unmute audio':'Mute audio'}</button></div><label><input type="checkbox" checked={settings.reducedMotion} onChange={e=>configure({...settings,reducedMotion:e.target.checked})}/> Reduced motion</label><button className={styles.primary} onClick={()=>setDialog(null)}>Done</button></Modal>}
  </section></Landscape>;
}
