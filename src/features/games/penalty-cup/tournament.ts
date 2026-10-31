import { matchStatus, seeded } from '../penalty-shootout/engine/rules';
import { nations, groups, dataVersion } from './nations';
import thirdRoutes from './third-routes.json';
import type { Cup, Fixture, MatchResult, Stage, Standing } from './types';
import type { MatchCheckpoint } from '../penalty-shootout/game-types';

export const nation = (id: string) => { const found=nations.find(n=>n.id===id); if(!found)throw Error('Unknown nation');return found; };
const rows = (teams: string[], fixtures: Fixture[]): Standing[] => teams.map(team=>{
 const row: Standing={team,played:0,won:0,drawn:0,lost:0,gf:0,ga:0,gd:0,points:0};
 for(const f of fixtures){if(!f.score || f.home!==team && f.away!==team)continue;const [a,b]=f.home===team?f.score:[f.score[1],f.score[0]];row.played++;row.gf+=a;row.ga+=b;if(a>b)row.won++;else if(a===b)row.drawn++;else row.lost++;}
 row.gd=row.gf-row.ga;row.points=row.won*3+row.drawn;return row;
});
function buckets<T>(items: T[], compare: (a:T,b:T)=>number): T[][] {
 const sorted=[...items].sort(compare), result:T[][]=[];
 for(const item of sorted){const last=result.at(-1);if(last&&compare(last[0],item)===0)last.push(item);else result.push([item]);}return result;
}
const overall=(a:Standing,b:Standing)=>b.gd-a.gd||b.gf-a.gf||nation(a.team).rank-nation(b.team).rank;
/** FIFA article 13: mini-table, reapply to remaining tied teams, then overall criteria. Conduct scores are all zero. */
function breakTie(tied: Standing[], fixtures: Fixture[], reapply=true): Standing[] {
 if(tied.length<2)return tied;
 const ids=tied.map(r=>r.team), mini=rows(ids,fixtures.filter(f=>ids.includes(f.home)&&ids.includes(f.away)));
 const parts=buckets(mini,(a,b)=>b.points-a.points||b.gd-a.gd||b.gf-a.gf);
 if(parts.length===1)return [...tied].sort(overall);
 return parts.flatMap(part=>{const original=part.map(r=>tied.find(t=>t.team===r.team)!);return part.length>1&&reapply?breakTie(original,fixtures,true):original;});
}
export function standings(cup: Cup, group: string): Standing[] {
 const ids=nations.filter(n=>n.group===group).map(n=>n.id), fixtures=cup.fixtures.filter(f=>f.stage==='group');
 return buckets(rows(ids,fixtures),(a,b)=>b.points-a.points).flatMap(part=>breakTie(part,fixtures));
}
export function thirdStandings(cup: Cup): Standing[] {return groups.map(g=>standings(cup,g)[2]).sort((a,b)=>b.points-a.points||overall(a,b));}
const hash=(seed:number,text:string)=>{let n=seed>>>0;for(const c of text)n=Math.imul(n^c.charCodeAt(0),16777619)>>>0;return n;};
const makeFixture=(cup: Pick<Cup,'id'|'seed'>,stage:Stage,day:number,id:string,home:string,away:string):Fixture=>({id,stage,day,home,away,seed:hash(cup.seed,id),attempts:0});
export function newCup(team:string,seed:number,id:string): Cup {
 nation(team);
 const cup:Cup={version:2,dataVersion,id,team,seed:seed>>>0,stage:'group',day:0,fixtures:[],status:'active',pending:null,checkpoint:null,updatedAt:new Date().toISOString()};
 const pairs=[[[0,1],[2,3]],[[0,2],[3,1]],[[3,0],[1,2]]];
 for(const g of groups){const teams=nations.filter(n=>n.group===g);pairs.forEach((day,d)=>day.forEach(([a,b],i)=>cup.fixtures.push(makeFixture(cup,'group',d,`G${g}-${d}-${i}`,teams[a].id,teams[b].id))));}
 return cup;
}
export function currentFixture(cup:Cup):Fixture|undefined {return cup.status==='active'?cup.fixtures.find(f=>f.stage===cup.stage&&f.day===cup.day&&!f.score&&(f.home===cup.team||f.away===cup.team)):undefined;}
/** One balanced competition, with a small stage-based progression. */
export function cpuLevel(stage:Stage):number {return {group:5,round32:6,round16:7,quarter:8,semi:9,bronze:9,final:10}[stage];}
export function randomOpponent(team:string,seed:number):string {nation(team);const pool=nations.filter(n=>n.id!==team);return pool[Math.floor(seeded(seed)()*pool.length)].id;}
export function simulateFixture(f:Fixture):Fixture {
 if(f.score)return f;
 const random=seeded(f.seed), kicks:{role:'shooting'|'keeping';outcome:'goal'|'saved'}[]=[];
 const score:[number,number]=[0,0];
 for(let i=0;;i++){
  const goal=random()<0.74,side=i%2;kicks.push({role:side===0?'shooting':'keeping',outcome:goal?'goal':'saved'});if(goal)score[side]++;
  if(f.stage==='group'){if(i===9)break;}else if(matchStatus(kicks).winner)break;
 }
 const winner=score[0]===score[1]?undefined:score[0]>score[1]?f.home:f.away;
 return {...f,score,winner};
}
/** Mapping is keyed by the qualifying groups, never by their relative third-place ranking. */
export function knockout32(cup:Cup):Fixture[] {
 const tables=Object.fromEntries(groups.map(g=>[g,standings(cup,g)])),thirds=thirdStandings(cup).slice(0,8),key=thirds.map(r=>nation(r.team).group).sort().join('');
 const route=(thirdRoutes as Record<string,string[]>)[key];if(!route)throw Error('Third-place combination missing');
 const slots=Object.fromEntries(['A','B','D','E','G','I','K','L'].map((g,i)=>[g,tables[route[i]][2].team]));
 const first=(g:string)=>tables[g][0].team,second=(g:string)=>tables[g][1].team;
 const pairs=[ [second('A'),second('B')], [first('E'),slots.E], [first('F'),second('C')], [first('C'),second('F')], [first('I'),slots.I], [second('E'),second('I')], [first('A'),slots.A], [first('L'),slots.L], [first('D'),slots.D], [first('G'),slots.G], [second('K'),second('L')], [first('H'),second('J')], [first('B'),slots.B], [first('J'),second('H')], [first('K'),slots.K], [second('D'),second('G')] ];
 return pairs.map(([home,away],i)=>makeFixture(cup,'round32',0,`M${73+i}`,home,away));
}
const nextStages:Partial<Record<Stage,Stage>>={round32:'round16',round16:'quarter',quarter:'semi',semi:'final'};
const wiring:Record<string,[number,number][]>={round16:[[74,77],[73,75],[76,78],[79,80],[83,84],[81,82],[86,88],[85,87]],quarter:[[89,90],[93,94],[91,92],[95,96]],semi:[[97,98],[99,100]],final:[[101,102]]};
const starts:Record<string,number>={round16:89,quarter:97,semi:101,final:104};
function buildRound(cup:Cup,stage:Stage):Fixture[]{return wiring[stage].map(([a,b],i)=>{
 const fa=cup.fixtures.find(f=>f.id===`M${a}`),fb=cup.fixtures.find(f=>f.id===`M${b}`);if(!fa?.winner||!fb?.winner)throw Error('Unresolved previous round');return makeFixture(cup,stage,0,`M${starts[stage]+i}`,fa.winner,fb.winner);
});}
export function storePending(cup:Cup,result:MatchResult):Cup {
 const fixture=currentFixture(cup);if(!fixture||result.id!==`${cup.id}:${fixture.id}:${fixture.attempts}`||cup.pending)return cup;
 if(result.score.some(n=>!Number.isInteger(n)||n<0)||result.score.length!==2)throw Error('Invalid result');
 const expected=result.score[0]===result.score[1]?'draw':result.score[0]>result.score[1]?'win':'loss';
 if(result.outcome!==expected||fixture.stage!=='group'&&expected==='draw'||fixture.stage==='group'&&result.score.some(n=>n>5))throw Error('Invalid outcome');
 return {...cup,pending:result,checkpoint:null,updatedAt:new Date().toISOString()};
}
export function storeCheckpoint(cup:Cup,id:string,match:MatchCheckpoint):Cup {
 const f=currentFixture(cup);
 if(!f||cup.pending||id!==`${cup.id}:${f.id}:${f.attempts}`||match.seed!==f.seed||match.level!==cpuLevel(f.stage))return cup;
 if(cup.checkpoint && cup.checkpoint.match.kicks.length>=match.kicks.length)return cup;
 const status=matchStatus(match.kicks,f.stage==='group'?{allowDraw:true,earlyClinch:false}:{});
 if(status.complete&&status.outcome)return storePending(cup,{id,score:status.score,outcome:status.outcome,kicks:match.kicks,suddenDeath:status.suddenDeath});
 return {...cup,checkpoint:{id,match},updatedAt:new Date().toISOString()};
}
export function retryFixture(cup:Cup):Cup {
 const f=currentFixture(cup);if(!f||f.stage==='group'||cup.pending?.outcome!=='loss')return cup;
 return {...cup,pending:null,checkpoint:null,fixtures:cup.fixtures.map(x=>x.id===f.id?{...x,attempts:x.attempts+1,seed:hash(cup.seed,`${x.id}:${x.attempts+1}`)}:x),updatedAt:new Date().toISOString()};
}
export function acceptResult(cup:Cup):Cup {
 const f=currentFixture(cup),result=cup.pending;if(!f||!result)return cup;
 const score:[number,number]=f.home===cup.team?result.score:[result.score[1],result.score[0]];
 const next:Cup={...cup,pending:null,checkpoint:null,updatedAt:new Date().toISOString(),fixtures:cup.fixtures.map(x=>x.id===f.id?{...x,score,winner:score[0]===score[1]?undefined:score[0]>score[1]?x.home:x.away}:x)};
 // Finish the entire matchday/round atomically; subsequent visits never reroll CPU fixtures.
 next.fixtures=next.fixtures.map(x=>x.stage===cup.stage&&x.day===cup.day?simulateFixture(x):x);
 if(cup.stage==='group'){
  if(cup.day<2)return {...next,day:cup.day+1};
  const round=knockout32(next);next.fixtures.push(...round);next.stage='round32';next.day=0;
  if(!round.some(x=>x.home===cup.team||x.away===cup.team))next.status='eliminated';
 }else if(cup.stage==='final')next.status=result.outcome==='win'?'champion':'runner-up';
 else if(cup.stage==='bronze')next.status=result.outcome==='win'?'third':'fourth';
 else {
  if(cup.stage==='semi'){
   const semis=next.fixtures.filter(x=>x.stage==='semi'),losers=semis.map(x=>x.winner===x.home?x.away:x.home);
   next.fixtures.push(makeFixture(cup,'bronze',0,'M103',losers[0],losers[1]));
   next.fixtures.push(...buildRound(next,'final'));
   if(result.outcome==='loss'){next.stage='bronze';return next;}
   next.fixtures=next.fixtures.map(x=>x.stage==='bronze'?simulateFixture(x):x);next.stage='final';return next;
  }
  const stage=nextStages[cup.stage]!;next.fixtures.push(...buildRound(next,stage));next.stage=stage;
  if(result.outcome==='loss')next.status='eliminated';
 }
 return next.status==='active'?next:finishOtherFixtures(next);
}
function finishOtherFixtures(cup:Cup):Cup {
 const finished={...cup,fixtures:[...cup.fixtures]};
 for(const stage of ['round32','round16','quarter','semi','final'] as Stage[]){
  if(!finished.fixtures.some(f=>f.stage===stage))finished.fixtures.push(...(stage==='round32'?knockout32(finished):buildRound(finished,stage)));
  finished.fixtures=finished.fixtures.map(f=>f.stage===stage?simulateFixture(f):f);
 }
 if(!finished.fixtures.some(f=>f.stage==='bronze')){const losers=finished.fixtures.filter(f=>f.stage==='semi').map(f=>f.winner===f.home?f.away:f.home);finished.fixtures.push(makeFixture(finished,'bronze',0,'M103',losers[0],losers[1]));}
 finished.fixtures=finished.fixtures.map(f=>f.stage==='bronze'?simulateFixture(f):f);return finished;
}
