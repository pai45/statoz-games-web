import {test} from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {createCricketSimulation} from '../src/features/games/retro-innings/runtime/simulation.mjs';
const baseline=JSON.parse(fs.readFileSync('tests/retro-innings-crease-baseline.json','utf8'));
import {deliveryLandingMarker} from '../src/features/games/retro-innings/runtime/cricket-delivery-cue';
const data=JSON.parse(fs.readFileSync('src/features/games/retro-innings/runtime/assets.json','utf8')).runtime;
function bowling(lane='leg',style='pace'){
 const s=createCricketSimulation(data);s.primary();Object.assign(s.state,{innings:2,first:998,target:999,phase:'dead'});s.settings.line=lane;s.settings.style=style;s.beginDelivery();return s;
}
test('Manual p15 control: held directions move the intended landing spot; release locks it and the ball meets it',()=>{
 for(const lane of ['leg','off','defend','wide'])for(const style of ['pace','spin'])for(const direction of ['left','right','up','down']){
  const s=bowling(lane,style),before={...s.landingPoint()};s.held[direction].add('test');s.advance(300);s.held[direction].clear();const aimed={...s.landingPoint()};assert.notDeepEqual(aimed,before);
  assert.deepEqual(deliveryLandingMarker(s.state,data.families)!.point,aimed);s.release();const release={...s.state.ball};assert.equal(release.y,s.bowlerPosition().y);assert.ok(release.y>=475);
  s.held[direction].add('test');s.advance(s.state.plan.duration*.67);for(const axis of ['x','y','z'] as const)assert.ok(Math.abs(s.state.ball[axis]-aimed[axis])<1e-6,`${lane}/${style}/${direction}/${axis}`);
  assert.deepEqual(s.landingPoint(),aimed);assert.deepEqual(deliveryLandingMarker(s.state,data.families)!.point,aimed);
 }
});
test('Default delivery retains the accepted post-bounce path; no unrelated batting change',()=>{
 for(const lane of ['leg','off','defend','wide'])for(const style of ['pace','spin']){
  const a=bowling(lane,style),expected=baseline.find((entry:{lane:string;style:string})=>entry.lane===lane&&entry.style===style);a.advance(350);a.release();
  assert.equal(a.state.plan.duration,expected.duration);assert.equal(a.state.plan.aiAt,expected.aiAt+200-a.strokeTiming(lane==='wide'?'off':lane).leadMs);
  for(const {fraction,point}of expected.path)for(const axis of ['x','y','z'] as const)assert.ok(Math.abs(a.incomingAt(a.state.plan.duration*fraction)[axis]-point[axis])<1e-8);
 }
 const s=createCricketSimulation(data);s.primary();s.advance(1200);s.strike('leg');s.advance(500);assert.ok(s.state.contact);
});
test('Aim is bounded, frame-step independent, pause-safe, reset per ball and unavailable during batting',()=>{
 const run=(chunk:number)=>{const s=bowling();s.held.right.add('test');s.held.down.add('test');for(let t=0;t<600;t+=chunk)s.advance(chunk);return s;};
 const a=run(10),b=run(100);assert.ok(Math.abs(a.landingPoint().x-b.landingPoint().x)<1e-8);assert.ok(Math.abs(a.landingPoint().y-b.landingPoint().y)<1e-8);
 a.advance(4000);assert.ok(a.landingPoint().x<=466&&a.landingPoint().y<=420);const point={...a.landingPoint()};a.state.paused=true;a.advance(500);assert.deepEqual(a.landingPoint(),point);
 a.state.paused=false;a.state.phase='dead';a.beginDelivery();assert.notDeepEqual(a.landingPoint(),point);assert.equal(a.held.right.size,0);
 const bat=createCricketSimulation(data);bat.primary();const origin={...bat.landingPoint()};bat.held.up.add('test');bat.advance(200);assert.deepEqual(bat.landingPoint(),origin);
});
