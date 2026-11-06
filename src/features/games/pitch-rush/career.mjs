// Original, game-owned career content. No host economy or remote services.
export const DIVISIONS = [
  {name:'Local', clubs:['Brook FC','Vale FC','Hill FC','Mill FC','Park FC'], difficulty:'easy'},
  {name:'Regional', clubs:['Coast FC','Oak FC','River FC','Dale FC','Grove FC'], difficulty:'regional'},
  {name:'National', clubs:['Union FC','City FC','Port FC','Atlas FC','Metro FC'], difficulty:'normal'},
  {name:'Premier', clubs:['Crown FC','Royal FC','Summit FC','Orbit FC','Peak FC'], difficulty:'hard'},
];
export const KITS = [
  {id:'blue', name:'Rush blue', colour:'#267eb8', rgb:[38,126,184]},
  {id:'regional', name:'Regional cream', colour:'#e6d8af', rgb:[230,216,175]},
  {id:'national', name:'National green', colour:'#23745a', rgb:[35,116,90]},
  {id:'premier', name:'Premier slate', colour:'#536d8b', rgb:[83,109,139]},
  {id:'champion', name:'Champion gold', colour:'#e6b63e', rgb:[230,182,62]},
];
export const BADGES = ['Local','Regional','National','Premier','Champion'];
const clone = value => JSON.parse(JSON.stringify(value));
export function random(seed) {
  let x=seed|0;x^=x<<13;x^=x>>>17;x^=x<<5;
  return {seed:x||1, value:(x>>>0)/4294967296};
}
export function clubsFor(division) {
  return [{id:0,name:'Rush FC'},...DIVISIONS[division].clubs.map((name,i)=>({id:i+1,name}))];
}
export function makeSeason(division, number, seed) {
  let ring=[0,1,2,3,4,5];const rounds=[];
  for(let round=0;round<5;round++) {
    rounds.push(Array.from({length:3},(_,i)=>({
      id:`${number}:${division}:${round}:${i}`,
      home:ring[i],away:ring[5-i],score:null,
    })));
    ring=[ring[0],ring[5],...ring.slice(1,5)];
  }
  return {division,number,seed:seed|0||1,round:0,rounds,summary:null};
}
export function createCareer(seed=1) {
  return {season:makeSeason(0,1,seed),unlocked:0,kit:'blue',badge:0,trophies:[0,0,0,0],champion:false,history:[]};
}
export function currentFixture(career) {
  const season=career.season;
  return season.rounds[season.round]?.find(f=>f.home===0||f.away===0)??null;
}
export function standings(season) {
  const rows=clubsFor(season.division).map(club=>({...club,played:0,won:0,drawn:0,lost:0,gf:0,ga:0,points:0}));
  for(const fixture of season.rounds.flat()) {
    if(!fixture.score)continue;
    const [a,b]=fixture.score,home=rows[fixture.home],away=rows[fixture.away];
    home.played++;away.played++;home.gf+=a;home.ga+=b;away.gf+=b;away.ga+=a;
    if(a===b){home.drawn++;away.drawn++;home.points++;away.points++;}
    else {const win=a>b?home:away,lose=a>b?away:home;win.won++;win.points+=3;lose.lost++;}
  }
  return rows.sort((a,b)=>b.points-a.points||(b.gf-b.ga)-(a.gf-a.ga)||b.gf-a.gf||a.id-b.id);
}
export function recordResult(career, fixtureId, score) {
  const fixture=currentFixture(career);
  if(!fixture||fixture.id!==fixtureId||fixture.score||!Array.isArray(score)||score.length!==2||score.some(n=>!Number.isInteger(n)||n<0||n>999))return career;
  const next=clone(career),season=next.season,round=season.rounds[season.round];
  const player=round.find(f=>f.id===fixtureId);
  player.score=player.home===0?[...score]:[score[1],score[0]];
  // Off-screen matches are drawn once from the season RNG, then persisted.
  const goals=[0,0,0,1,1,1,1,2,2,2,3,3,4];
  for(const other of round)if(!other.score){
    other.score=[];
    for(let i=0;i<2;i++){const draw=random(season.seed);season.seed=draw.seed;other.score.push(goals[Math.floor(draw.value*goals.length)]);}
  }
  season.round++;
  if(season.round===5){
    const rank=standings(season).findIndex(row=>row.id===0)+1;
    const promoted=rank<=2&&season.division<3;
    const first=rank===1;
    if(first)next.trophies[season.division]++;
    if(promoted)next.unlocked=Math.max(next.unlocked,season.division+1);
    if(first&&season.division===3){next.champion=true;next.unlocked=4;}
    season.summary={rank,promoted,champion:first&&season.division===3};
    next.history=[...next.history,{division:season.division,number:season.number,...season.summary}].slice(-20);
  }
  return next;
}
export function nextSeason(career) {
  if(!career.season.summary)return career;
  const next=clone(career),old=next.season;
  next.season=makeSeason(old.division+(old.summary.promoted?1:0),old.number+1,random(old.seed).seed);
  return next;
}
export function careerDifficulty(level, levels) {
  if(level!=='regional')return levels[level];
  return Object.fromEntries(Object.entries(levels.normal).map(([key,value])=>[
    key,typeof value==='number'?(key.endsWith('Ticks')?Math.round((value+levels.easy[key])/2):(value+levels.easy[key])/2):key==='label'?'REGIONAL':'regional',
  ]));
}
