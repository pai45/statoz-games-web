import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createCricketSimulation} from '../src/features/games/retro-innings/runtime/simulation.mjs';
import {deliveryLandingMarker} from '../src/features/games/retro-innings/runtime/cricket-delivery-cue';

const data=JSON.parse(fs.readFileSync('src/features/games/retro-innings/runtime/assets.json','utf8')).runtime;

function bowling(direction?:string,button='A'){
 const s=createCricketSimulation(data);s.primary();
 Object.assign(s.state,{innings:2,first:19,target:20,phase:'ready'});
 if(direction)s.held[direction].add('test');
 s.nesBowl(button);
 return s;
}

test('NES A/B captures a coarse direction once and releases from the crease',()=>{
 for(const button of ['A','B'])for(const direction of ['left','right','up','down']){
  const s=bowling(direction,button),aimed={...s.landingPoint()};
  assert.equal(s.state.plan.nesIntent.button,button);
  assert.equal(s.state.plan.nesIntent.direction[direction==='left'||direction==='right'?'x':'y'],direction==='left'||direction==='up'?-1:1);
  assert.deepEqual(deliveryLandingMarker(s.state,data.families)!.point,aimed);
  s.held[direction].clear();s.advance(500);
  assert.equal(s.state.phase,'delivery');
  assert.equal(s.state.events.filter((e:{type:string})=>e.type==='release').length,1);
  assert.ok(s.bowlerPosition().y<=475);
  s.advance(s.state.plan.duration*.67);
  for(const axis of ['x','y','z'] as const)assert.ok(Math.abs(s.state.ball[axis]-aimed[axis])<1e-6,`${button}/${direction}/${axis}`);
 }
});

test('NES bowling intention is repeatable, bounded and unavailable during batting',()=>{
 const a=bowling('right'),b=bowling('right');
 assert.deepEqual(a.landingPoint(),b.landingPoint());
 assert.ok(a.landingPoint().x>=400&&a.landingPoint().x<=466);
 const aimed={...a.landingPoint()};a.held.left.add('late');a.advance(250);
 assert.deepEqual(a.landingPoint(),aimed);
 a.state.paused=true;a.advance(500);assert.deepEqual(a.landingPoint(),aimed);
 const bat=createCricketSimulation(data);bat.primary();bat.nesBowl();assert.equal(bat.state.innings,1);
 assert.equal(bat.state.events.some((e:{type:string})=>e.type==='nes-bowl-intent'),false);
});

test('NES ground and air shots use the same contact engine but distinct flight',()=>{
 function contact(kind:'ground'|'air'){
  const s=createCricketSimulation(data);s.primary();s.advance(500);
  s.advance(s.state.plan.duration-s.strokeTiming('leg').leadMs-150);
  s.nesShot(kind);for(let i=0;i<300&&!s.state.contact;i++)s.advance(5);
  assert.ok(s.state.contact);return s;
 }
 const ground=contact('ground'),air=contact('air');
 assert.equal(ground.state.contact.nesKind,'ground');
 assert.equal(air.state.contact.nesKind,'air');
 assert.ok(air.state.ball.vz>ground.state.ball.vz);
});

test('D-pad placement changes exit direction without selecting a mismatched contact pose',()=>{
 function contact(direction:'left'|'right'){
  const s=createCricketSimulation(data);s.primary();s.advance(500);
  s.advance(s.state.plan.duration-s.strokeTiming('leg').leadMs-150);
  s.held[direction].add('test');s.nesShot('ground');
  for(let i=0;i<300&&!s.state.contact;i++)s.advance(5);
  assert.ok(s.state.contact);assert.equal(s.state.contact.family,'leg');return s;
 }
 assert.ok(contact('left').state.ball.vx<0);
 assert.ok(contact('right').state.ball.vx>0);
});
