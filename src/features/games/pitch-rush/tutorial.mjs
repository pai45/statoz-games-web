import {createMatch} from '../../../../vendor/websoccer/src/game/state.js';
import {FIELD,LOB_CHARGE} from '../../../../vendor/websoccer/src/constants.js';

export const DRILLS=[
  {name:'Passing',description:'Move, aim, and find a teammate.'},
  {name:'Defending',description:'Close the gap. Tackle. Win it back.'},
  {name:'Scoring',description:'Charge, aim, and beat the keeper.'},
];
export const createTutorial=(drill=0)=>({drill,passes:0,moved:false,slid:false,shot:false,kicked:false,success:false,attempt:0,start:null,charge:0});
export function arrangeDrill(t) {
  const s=createMatch({seed:7061+t.drill,halfSeconds:3600,humans:[true,true],difficulty:'easy',offside:false});
  s.phase='play';s.phaseTimer=0;s.message='';
  s.teams[0].name='RUSH FC';s.teams[1].name='COACH';
  const y=t.drill===2?FIELD.top+175:FIELD.cy;
  const direction=t.passes===1?-1:1;
  for(let team=0;team<2;team++)for(const p of s.teams[team].players){
    Object.assign(p,{x:FIELD.left+20+p.idx*20,y:FIELD.bottom-25,vx:0,vy:0,down:99999,slide:0,cooldown:0});
  }
  const p=s.teams[0].players[9];
  Object.assign(p,{x:FIELD.cx-(t.drill===0?direction*65:t.drill===2?42:0),y:y+(t.drill===1?68:0),down:0,dirX:t.drill===0?direction:0,dirY:t.drill===0?0:-1});
  s.teams[0].controlled=9;s.teams[1].controlled=9;
  if(t.drill===0)Object.assign(s.teams[0].players[8],{x:FIELD.cx+direction*65,y,down:0,dirX:-direction,dirY:0});
  if(t.drill===1)Object.assign(s.teams[1].players[9],{x:FIELD.cx,y,down:0,dirX:0,dirY:1});
  if(t.drill===2)Object.assign(s.teams[1].players[0],{x:FIELD.cx+25,y:FIELD.top+16,down:0,dirX:0,dirY:1});
  const owner=t.drill===1?{team:1,idx:9}:{team:0,idx:9},carrier=s.teams[owner.team].players[owner.idx];
  Object.assign(s.ball,{x:carrier.x,y:carrier.y,z:0,vx:0,vy:0,vz:0,owner,lastTouch:owner,kicker:null,protectedFor:null,protectTicks:0});
  s.training={drill:t.drill,receiver:8};
  t.start={x:p.x,y:p.y};t.kicked=false;t.slid=false;t.shot=false;t.charge=0;t.attempt++;
  return s;
}
export function beforeTutorialStep(t,s) {
  s.halfTick=0;
  t.charge=s.teams[0].players[s.teams[0].controlled].charge;
  // Keep the receiving teammate in place; all ball control and kicks still use
  // the real simulation. Other players sit out this small training exercise.
  if(t.drill===0&&s.ball.owner?.idx!==8){
    const receiver=s.teams[0].players[8],direction=t.passes===1?-1:1;
    Object.assign(receiver,{x:FIELD.cx+direction*65,y:FIELD.cy,vx:0,vy:0});
  }
  // These are introductory drills: leave time to collect a successful tackle,
  // and keep the practice keeper on the goal line with the near corner open.
  if(t.drill===1&&s.teams[1].players[9].down>0)s.teams[1].players[9].down=120;
  if(t.drill===2){const keeper=s.teams[1].players[0];keeper.x=Math.max(FIELD.cx+5,keeper.x);keeper.y=FIELD.top+16;keeper.vy=0;}
}
export function afterTutorialStep(t,s) {
  if(t.success)return 'complete';
  const p=s.teams[0].players[9],owner=s.ball.owner;
  if(Math.hypot(p.x-t.start.x,p.y-t.start.y)>8)t.moved=true;
  const kick=s.events.find(e=>e.type==='kick');
  if(kick&&s.ball.lastTouch?.team===0){
    if(t.drill===0&&t.charge<=LOB_CHARGE)t.kicked=true;
    if(t.drill===2&&t.charge>LOB_CHARGE)t.shot=true;
  }
  if(t.drill===1&&s.events.some(e=>e.type==='slide'))t.slid=true;
  if(t.drill===0&&t.kicked&&t.moved&&owner?.team===0&&owner.idx===8){
    t.passes++;
    if(t.passes<2)return 'pass';
    t.success=true;
  }
  if(t.drill===1&&t.slid&&owner?.team===0)t.success=true;
  if(t.drill===2&&t.shot&&s.events.some(e=>e.type==='goal'&&e.team===0))t.success=true;
  if(t.success)return 'complete';
  if(s.phase!=='play'||s.tick>60*20||(t.drill===2&&owner?.team===1))return 'retry';
  if(t.drill===0&&t.kicked&&owner?.team===0&&owner.idx===9)return 'retry';
  return 'playing';
}
export function tutorialTarget(t,s) {
  if(t.drill===0)return s.teams[0].players[8];
  if(t.drill===1)return s.ball.owner?.team===1?s.teams[1].players[9]:s.ball;
  return {x:FIELD.cx,y:FIELD.top};
}
