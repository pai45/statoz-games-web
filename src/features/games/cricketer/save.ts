import {CHASES, LESSONS, challengeFor} from './data';
import {checkpoint, restore, type BallResult, type Match} from './engine';
export const SAVE_KEY='cricketer.progress.v1';
export type Save = {schemaVersion:1; lessons:string[]; unlocked:number; best:Record<string,number>; sound:boolean; reducedMotion:boolean; checkpoint:ReturnType<typeof checkpoint>|null; resultId:string|null};
export const emptySave=(): Save=>({schemaVersion:1,lessons:[],unlocked:0,best:{},sound:true,reducedMotion:false,checkpoint:null,resultId:null});
const validResult=(r: BallResult)=>r&&[0,1,2,3,4,6].includes(r.runs)&&typeof r.feedback==='string'&&r.feedback.length<60&&Number.isFinite(r.quality)&&r.quality>=0&&r.quality<=1&&(r.offset===null||Number.isFinite(r.offset))&&['drive','cut','pull','hook','sweep','scoop'].includes(r.shot)&&typeof r.caught==='boolean';
export function readSave(raw:string|null): {save:Save; incompatible:boolean} {
  if(!raw)return {save:emptySave(),incompatible:false};
  try {
    const s=JSON.parse(raw) as Save;
    if(s.schemaVersion!==1||!Array.isArray(s.lessons)||s.lessons.some(id=>!LESSONS.some(c=>c.id===id))||!Number.isInteger(s.unlocked)||s.unlocked<0||s.unlocked>11||!s.best||typeof s.best!=='object'||Array.isArray(s.best)||Object.entries(s.best).some(([id,n])=>!challengeFor(id)||!Number.isInteger(n)||n<0||n>72)||typeof s.sound!=='boolean'||typeof s.reducedMotion!=='boolean'||(s.resultId!==null&&typeof s.resultId!=='string')) throw Error();
    if(s.checkpoint) {const c=challengeFor(s.checkpoint.challengeId);if(!c||!Number.isInteger(s.checkpoint.initialSeed)||s.checkpoint.initialSeed<0||s.checkpoint.initialSeed>4294967295||!Array.isArray(s.checkpoint.results)||s.checkpoint.results.length>c.balls||!s.checkpoint.results.every(validResult))throw Error();}
    return {save:s,incompatible:false};
  }catch{return {save:emptySave(),incompatible:true};}
}
export function record(s:Save, match:Match): Save {
  const next={...s,lessons:[...s.lessons],best:{...s.best},checkpoint:checkpoint(match)};
  if(match.phase==='finished') {
    next.best[match.challenge.id]=Math.max(next.best[match.challenge.id]||0,match.score);
    if(match.won){if(match.challenge.lesson&&!next.lessons.includes(match.challenge.id))next.lessons.push(match.challenge.id);const i=CHASES.findIndex(c=>c.id===match.challenge.id);if(i>=0)next.unlocked=Math.max(next.unlocked,Math.min(11,i+1));}
  }
  return next;
}
export function resumed(s:Save): Match|null {const cp=s.checkpoint,c=cp&&challengeFor(cp.challengeId);return cp&&c?restore(c,cp):null;}
