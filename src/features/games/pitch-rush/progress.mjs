import {KITS,clubsFor} from './career.mjs';

export const PROGRESS_KEY='statoz.pitch-rush.progress.v1';
export const BACKUP_KEY=PROGRESS_KEY+'.backup';
export const freshProgress=()=>({version:1,tutorial:{status:'new',completed:[]},career:null,activeMatch:null});
const integer=(n,max=1e9)=>Number.isInteger(n)&&n>=0&&n<=max;
const finiteTree=value=>{
  if(typeof value==='number')return Number.isFinite(value);
  if(value===null||typeof value==='string'||typeof value==='boolean')return true;
  if(Array.isArray(value))return value.every(finiteTree);
  return typeof value==='object'&&Object.keys(value).every(key=>!['__proto__','constructor','prototype'].includes(key)&&finiteTree(value[key]));
};
export function validMatch(s) {
  return !!s&&finiteTree(s)&&integer(s.tick)&&Number.isInteger(s.rng)&&Number.isInteger(s.seed)
    &&['kickoff','play','goal','restart','halftime','fulltime'].includes(s.phase)
    &&integer(s.phaseTimer)&&[1,2].includes(s.half)&&integer(s.halfTick)
    &&Array.isArray(s.score)&&s.score.length===2&&s.score.every(n=>integer(n,999))
    &&s.config&&integer(s.config.halfTicks)&&s.config.halfTicks>0
    &&s.ball&&['x','y','z','vx','vy','vz'].every(k=>Number.isFinite(s.ball[k]))
    &&[s.ball.owner,s.ball.lastTouch,s.ball.kicker].every(p=>p===null||(p&&integer(p.team,1)&&integer(p.idx,10)))
    &&Array.isArray(s.teams)&&s.teams.length===2&&s.teams.every(t=>
      t&&integer(t.controlled,10)&&[-1,1].includes(t.attackDir)&&t.ai&&t.formation?.length===11
      &&Array.isArray(t.players)&&t.players.length===11&&t.players.every(p=>
        p&&['x','y','vx','vy','dirX','dirY','charge','slide','down','cooldown'].every(k=>Number.isFinite(p[k]))));
}
function validCareer(c) {
  if(!c)return c===null;
  const s=c.season;
  if(!s||!integer(s.division,3)||!integer(s.number)||s.number<1||!integer(s.round,5)
    ||!Number.isInteger(s.seed)||!integer(c.unlocked,4)||!KITS.slice(0,c.unlocked+1).some(k=>k.id===c.kit)
    ||!integer(c.badge,c.unlocked)||typeof c.champion!=='boolean'
    ||!Array.isArray(c.trophies)||c.trophies.length!==4||!c.trophies.every(n=>integer(n))
    ||!Array.isArray(c.history)||c.history.length>20||!c.history.every(h=>h&&integer(h.division,3)&&integer(h.number)&&integer(h.rank,6)&&h.rank>0&&typeof h.promoted==='boolean'&&typeof h.champion==='boolean')
    ||!Array.isArray(s.rounds)||s.rounds.length!==5)return false;
  const ids=new Set(),pairs=new Set();
  for(let r=0;r<5;r++){
    const round=s.rounds[r],teams=new Set();
    if(!Array.isArray(round)||round.length!==3)return false;
    for(const f of round){
      if(!f||typeof f.id!=='string'||ids.has(f.id)||!integer(f.home,5)||!integer(f.away,5)||f.home===f.away)return false;
      ids.add(f.id);teams.add(f.home);teams.add(f.away);
      const pair=[f.home,f.away].sort().join(':');if(pairs.has(pair))return false;pairs.add(pair);
      if(r<s.round){if(!Array.isArray(f.score)||f.score.length!==2||!f.score.every(n=>integer(n,999)))return false;}
      else if(f.score!==null)return false;
    }
    if(teams.size!==clubsFor(s.division).length)return false;
  }
  return s.round===5?!!s.summary&&integer(s.summary.rank,6)&&s.summary.rank>=1
    &&s.summary.promoted===(s.summary.rank<=2&&s.division<3)
    &&s.summary.champion===(s.summary.rank===1&&s.division===3):s.summary===null;
}
export function validProgress(p) {
  if(!p||p.version!==1||!finiteTree(p)||!p.tutorial||!['new','skipped','completed'].includes(p.tutorial.status)
    ||!Array.isArray(p.tutorial.completed)||!p.tutorial.completed.every(n=>integer(n,2))||!validCareer(p.career))return false;
  const a=p.activeMatch;
  if(a===null)return true;
  if(!p.career||!a||typeof a.fixtureId!=='string'||!validMatch(a.state))return false;
  return p.career.season.rounds[p.career.season.round]?.some(f=>f.id===a.fixtureId&&(f.home===0||f.away===0)&&f.score===null)??false;
}
export function loadProgress(storage) {
  let corrupt=false;
  for(const key of [PROGRESS_KEY,BACKUP_KEY]){
    try{
      const raw=storage.getItem(key);if(!raw)continue;
      const data=JSON.parse(raw);if(validProgress(data))return {data,recovered:key===BACKUP_KEY,error:null};
      corrupt=true;
    }catch{corrupt=true;}
  }
  return {data:freshProgress(),recovered:false,error:corrupt?'Saved progress could not be read. Your original save has been kept.':null};
}
export function saveProgress(storage, progress) {
  if(!validProgress(progress))throw Error('Progress could not be saved. Please retry.');
  const raw=JSON.stringify(progress),previous=storage.getItem(PROGRESS_KEY);
  if(previous){
    let valid=false;try{valid=validProgress(JSON.parse(previous));}catch{/* Retain unreadable bytes before replacing them. */}
    if(valid)storage.setItem(BACKUP_KEY,previous);
    else if(!storage.getItem(PROGRESS_KEY+'.unreadable'))storage.setItem(PROGRESS_KEY+'.unreadable',previous);
  }
  storage.setItem(PROGRESS_KEY,raw);
}
export function checkpoint(state, fixtureId) {
  const copy=JSON.parse(JSON.stringify(state));copy.events=[];
  return {fixtureId,state:copy};
}
export function restoreMatch(activeMatch) {
  if(!activeMatch||!validMatch(activeMatch.state))throw Error('The saved match could not be restored.');
  const state=JSON.parse(JSON.stringify(activeMatch.state));state.events=[];
  // Input devices are transient. Cancel held actions instead of firing on restore.
  for(const team of state.teams){team.prevMask=0;for(const p of team.players){p.charging=false;p.charge=0;}}
  return state;
}
