import { dataVersion, nations } from './nations';
import { currentFixture } from './tournament';
import type { Cup, CupSave, Fixture } from './types';

const ids=new Set(nations.map(n=>n.id));
const stages=new Set(['group','round32','round16','quarter','semi','bronze','final']);
const statuses=new Set(['active','eliminated','champion','runner-up','third','fourth']);
export const emptySave=():CupSave=>({version:1,active:null,history:[]});
export function storageKey(scope:string){return `penalty-cup.v1.${scope}`;}
export function validCup(value:unknown):value is Cup {
 if(!value||typeof value!=='object')return false;const c=value as Cup;
 if(c.version!==1||c.dataVersion!==dataVersion||!ids.has(c.team)||typeof c.id!=='string'||c.id.length>100||!['easy','normal','hard'].includes(c.difficulty)||!stages.has(c.stage)||!statuses.has(c.status)||!Number.isInteger(c.seed)||!Number.isInteger(c.day)||c.day<0||c.day>2||typeof c.updatedAt!=='string'||!Array.isArray(c.fixtures)||c.fixtures.length<72||c.fixtures.length>104)return false;
 const fixtureIds=new Set<string>();
 for(const f of c.fixtures){if(!f||typeof f.id!=='string'||fixtureIds.has(f.id)||!stages.has(f.stage)||!ids.has(f.home)||!ids.has(f.away)||f.home===f.away||!Number.isInteger(f.seed)||!Number.isInteger(f.attempts)||f.attempts<0||!Number.isInteger(f.day)||f.day<0||f.day>2)return false;fixtureIds.add(f.id);
  if(f.score&&(!Array.isArray(f.score)||f.score.length!==2||f.score.some(n=>!Number.isInteger(n)||n<0)||f.stage==='group'&&f.score.some(n=>n>5)||f.stage!=='group'&&f.score[0]===f.score[1]))return false;
  if(f.score){const winner=f.score[0]===f.score[1]?undefined:f.score[0]>f.score[1]?f.home:f.away;if(f.winner!==winner)return false;}
 }
 const groups=c.fixtures.filter(f=>f.stage==='group');if(groups.length!==72)return false;
 for(const n of nations){const fixtures=groups.filter(f=>f.home===n.id||f.away===n.id);if(fixtures.length!==3||new Set(fixtures.map(f=>f.home===n.id?f.away:f.home)).size!==3||fixtures.some(f=>nations.find(t=>t.id===(f.home===n.id?f.away:f.home))?.group!==n.group))return false;}
 if(c.status==='active'&&!currentFixture(c))return false;
 if(c.pending){const f=currentFixture(c),p=c.pending;if(!f||p.id!==`${c.id}:${f.id}:${f.attempts}`||!Array.isArray(p.score)||p.score.length!==2||p.score.some(n=>!Number.isInteger(n)||n<0)||!Array.isArray(p.kicks)||p.kicks.length>500||!['win','loss','draw'].includes(p.outcome))return false;const expected=p.score[0]===p.score[1]?'draw':p.score[0]>p.score[1]?'win':'loss';if(p.outcome!==expected||f.stage!=='group'&&expected==='draw'||f.stage==='group'&&p.score.some(n=>n>5))return false;}
 return true;
}
export function readSave(storage:Pick<Storage,'getItem'>,scope:string):{save:CupSave;error:string;unavailable?:boolean}{
 let raw:string|null;try{raw=storage.getItem(storageKey(scope));}catch{return {save:emptySave(),error:'',unavailable:true};}
 try{if(raw===null)return {save:emptySave(),error:''};const v=JSON.parse(raw);if(v?.version!==1||v.active!==null&&!validCup(v.active)||!Array.isArray(v.history)||v.history.length>12||!v.history.every(validCup))throw Error('incompatible');return {save:v,error:''};}
 catch{return {save:emptySave(),error:'Saved progress could not be read. It has been preserved. Reset this save to start again.'};}
}
export function writeSave(storage:Pick<Storage,'setItem'>,scope:string,save:CupSave):boolean {try{storage.setItem(storageKey(scope),JSON.stringify(save));return true;}catch{return false;}}
export function updateCup(save:CupSave,cup:Cup):CupSave {
 const history=cup.status==='active'?save.history:[cup,...save.history.filter(c=>c.id!==cup.id)].slice(0,12);
 return {version:1,active:cup,history};
}
export function resultId(cup:Cup,fixture:Fixture){return `${cup.id}:${fixture.id}:${fixture.attempts}`;}
