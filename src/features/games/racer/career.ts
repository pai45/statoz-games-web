import {CIRCUIT_ID} from './circuit';
import type {RaceSetup} from './engine';

export const CAREER_KEY='racer.career.progress.v1';
export const TIERS=['Rookie','Club','Grand Prix'] as const;
export type CareerStage={id:string;index:number;tier:number;name:string;circuit:string;opponents:number;laps:number};
const tracks=['starter-oval','starter-oval','meadow-loop','meadow-loop','club-circuit','club-circuit','ridge-gp','ridge-gp',CIRCUIT_ID,CIRCUIT_ID,CIRCUIT_ID,CIRCUIT_ID];
const titles=['First Lights','Finding Pace','Meadow Run','Rookie Finale','Club Debut','Passing Practice','Ridge Run','Club Finale','Grand Prix Debut','Full Grid','Endurance Run','Final Chequered Flag'];
const fields=[3,4,5,7,9,11,13,15,17,19,19,19],lengths=[1,1,1,2,2,2,2,2,2,2,3,3];
export const STAGES:readonly CareerStage[]=Object.freeze(tracks.map((circuit,index)=>Object.freeze({id:`race-${index+1}`,index,tier:Math.floor(index/4),name:titles[index],circuit,opponents:fields[index],laps:lengths[index]})));
export type StageRecord={stars:number;bestPosition:number;bestTime:number;attempts:number};
export type CareerSave={schemaVersion:1;records:Record<string,StageRecord>;selected:string};
export const emptyCareer=():CareerSave=>({schemaVersion:1,records:{},selected:STAGES[0].id});
export const stageFor=(id:string)=>STAGES.find(s=>s.id===id);
export const starsFor=(position:number)=>position===1?3:position===2?2:position===3?1:0;
export const unlocked=(save:CareerSave,stage:CareerStage)=>stage.index===0||!!save.records[STAGES[stage.index-1].id]?.stars;
export const totalStars=(save:CareerSave)=>Object.values(save.records).reduce((n,r)=>n+r.stars,0);
export const careerComplete=(save:CareerSave)=>!!save.records[STAGES[11].id]?.stars;
export function continueStage(save:CareerSave){const selected=stageFor(save.selected);return selected&&unlocked(save,selected)?selected:STAGES[0];}
export function setupFor(stage:CareerStage):RaceSetup{
 const t=stage.index/11,lerp=(a:number,b:number)=>a+(b-a)*t;
 return {circuit:stage.circuit,opponentCount:stage.opponents,laps:stage.laps,careerStageId:stage.id,difficulty:stage.tier===0?'rookie':stage.tier===1?'pro':'elite',rivalTuning:{pace:lerp(.80,.978),torque:lerp(.70,1.05),consistency:lerp(.55,.90),boost:lerp(.15,1)}};
}
export function recordCareer(save:CareerSave,stage:CareerStage,position:number,time:number):CareerSave{
 if(!unlocked(save,stage)||!Number.isInteger(position)||position<1||position>stage.opponents+1||!Number.isFinite(time)||time<=0)throw new Error('Invalid career result');
 const old=save.records[stage.id],stars=starsFor(position),next:CareerSave={...save,records:{...save.records,[stage.id]:{stars:Math.max(old?.stars??0,stars),bestPosition:Math.min(old?.bestPosition??Infinity,position),bestTime:Math.min(old?.bestTime??Infinity,time),attempts:(old?.attempts??0)+1}},selected:stars&&STAGES[stage.index+1]?STAGES[stage.index+1].id:stage.id};
 return next;
}
/** A damaged or newer save is preserved by the caller; that session remains temporary. */
export function readCareer(raw:string|null):{save:CareerSave;incompatible:boolean}{
 if(raw===null)return {save:emptyCareer(),incompatible:false};
 try{
  const v=JSON.parse(raw),object=(n:unknown)=>!!n&&typeof n==='object'&&!Array.isArray(n);
  if(!object(v)||v.schemaVersion!==1||!object(v.records)||!stageFor(v.selected))throw new Error();
  for(const [id,value] of Object.entries(v.records)){
   const stage=stageFor(id),r=value as StageRecord;
   if(!stage||!object(r)||!Number.isInteger(r.stars)||r.stars<0||r.stars>3||!Number.isInteger(r.bestPosition)||r.bestPosition<1||r.bestPosition>stage.opponents+1||r.stars!==starsFor(r.bestPosition)||!Number.isFinite(r.bestTime)||r.bestTime<=0||!Number.isSafeInteger(r.attempts)||r.attempts<1)throw new Error();
  }
  if(STAGES.some(s=>v.records[s.id]&&!unlocked(v,s))||!unlocked(v,stageFor(v.selected)!))throw new Error();
  return {save:v,incompatible:false};
 }catch{return {save:emptyCareer(),incompatible:true};}
}
