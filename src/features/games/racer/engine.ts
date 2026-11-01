/** Authored arcade simulation. Positive steering always means screen-right. */
import {circuitPoints} from './circuit';
import {REFERENCE,steeringAuthority,torqueAtRpm,transmission} from './reference';
export const LAPS=2,GRID_SIZE=20,ROAD_HALF=7.8,STEP=1/120;
const TAU=Math.PI*2;
export const clamp=(n:number,a:number,b:number)=>Math.max(a,Math.min(b,n));
const wrap=(n:number,m:number)=>(n%m+m)%m;
export const angle=(n:number)=>wrap(n+Math.PI,TAU)-Math.PI;
export const angleLerp=(a:number,b:number,t:number)=>a+angle(b-a)*t;
export const damp=(a:number,b:number,rate:number,dt:number)=>a+(b-a)*(1-Math.exp(-rate*dt));
const points=circuitPoints;
type Vec={x:number;z:number};
function spline(t:number):Vec{
 const index=Math.floor(t),u=t-index,p0=points[wrap(index-1,points.length)],p1=points[wrap(index,points.length)],p2=points[wrap(index+1,points.length)],p3=points[wrap(index+2,points.length)];
 const value=(axis:number)=>.5*((2*p1[axis])+(-p0[axis]+p2[axis])*u+(2*p0[axis]-5*p1[axis]+4*p2[axis]-p3[axis])*u*u+(-p0[axis]+3*p1[axis]-3*p2[axis]+p3[axis])*u*u*u);
 return{x:value(0),z:value(1)};
}
const SAMPLES=2400;
const sampled=Array.from({length:SAMPLES+1},(_,i)=>{const t=i/SAMPLES*points.length,p=spline(t),before=spline(t-.0001),after=spline(t+.0001);return{...p,distance:0,heading:Math.atan2(after.x-before.x,after.z-before.z)};});
for(let i=1;i<sampled.length;i++)sampled[i].distance=sampled[i-1].distance+Math.hypot(sampled[i].x-sampled[i-1].x,sampled[i].z-sampled[i-1].z);
// Move the timing stripe along Hamilton Straight so all ten grid rows sit on
// the straight, rather than wrapping the rear rows into the preceding bend.
const first=sampled.findIndex(p=>p.distance>=60);
export const track=[...sampled.slice(first,-1),...sampled.slice(0,first+1)].map(p=>({...p,distance:0}));
for(let i=1;i<track.length;i++)track[i].distance=track[i-1].distance+Math.hypot(track[i].x-track[i-1].x,track[i].z-track[i-1].z);
export const TRACK_LENGTH=track.at(-1)!.distance;
export function at(distance:number,lane=0){
 const d=wrap(distance,TRACK_LENGTH);let lo=0,hi=track.length-1;
 while(hi-lo>1){const mid=(hi+lo)>>1;if(track[mid].distance<=d)lo=mid;else hi=mid;}
 const a=track[lo],b=track[hi],t=(d-a.distance)/(b.distance-a.distance),heading=angleLerp(a.heading,b.heading,t),nx=-Math.cos(heading),nz=Math.sin(heading);
 return{x:a.x+(b.x-a.x)*t+nx*lane,z:a.z+(b.z-a.z)*t+nz*lane,nx,nz,heading};
}
export function cornerSpeed(progress:number){
 let curvature=.001;
 for(let d=0;d<=42;d+=6)curvature=Math.max(curvature,Math.abs(angle(at(progress+d+10).heading-at(progress+d).heading))/10);
 return clamp(1.05/curvature,10,49);
}
export function project(x:number,z:number,hint?:number){
 let best=Infinity,index=0,fraction=0;
 let centre=0;
 if(hint!==undefined){const distance=wrap(hint,TRACK_LENGTH);let lo=0,hi=SAMPLES;while(hi-lo>1){const mid=(hi+lo)>>1;if(track[mid].distance<=distance)lo=mid;else hi=mid;}centre=lo;}
 const radius=hint===undefined?SAMPLES:40;
 for(let n=hint===undefined?0:-radius;n<(hint===undefined?SAMPLES:radius+1);n++){
  const i=hint===undefined?n:wrap(centre+n,SAMPLES);
  if(hint!==undefined&&Math.abs(angle((track[i].distance-hint)/TRACK_LENGTH*TAU))*TRACK_LENGTH/TAU>8)continue;
  const a=track[i],b=track[i+1],dx=b.x-a.x,dz=b.z-a.z,len2=dx*dx+dz*dz,t=clamp(((x-a.x)*dx+(z-a.z)*dz)/len2,0,1),px=a.x+dx*t,pz=a.z+dz*t,dist=(x-px)**2+(z-pz)**2;
  if(dist<best){best=dist;index=i;fraction=t;}
 }
 if(hint!==undefined&&best>400)return project(x,z);
 const a=track[index],b=track[index+1],dx=b.x-a.x,dz=b.z-a.z,px=a.x+dx*fraction,pz=a.z+dz*fraction,length=Math.hypot(dx,dz);
 return{distance:a.distance+(b.distance-a.distance)*fraction,lane:((z-pz)*dx-(x-px)*dz)/length,heading:angleLerp(a.heading,b.heading,fraction),x:px,z:pz};
}
export type Input={steer:number;brake:boolean;boost:boolean;gas:boolean;lookBack?:boolean};
export const emptyInput=():Input=>({steer:0,brake:false,boost:false,gas:false});
export type Car={x:number;z:number;heading:number;speed:number;progress:number;lane:number;steer:number;color:string;name:string;finishTime:number|null;acceleration:number;impact:number;sideVelocity:number;gear:number;rpm:number;throttle:number;brake:number;waypointsPassed:number;nextGate:number;validatedProgress:number;lapTimes:number[];lapStart:number;stuckTime:number;reversing:boolean;targetLane:number;targetSpeed:number};
export type Race={player:Car;opponents:Car[];time:number;countdown:number;boost:number;boosting:boolean;slipstream:boolean;finished:boolean;finishTime:number;hits:number;contactCooldown:number;checkpoints:number;nextCheckpoint:number;lastDistance:number;lapStart:number;lapTimes:number[];offroad:boolean;recovery:number;overtakes:number;previousPosition:number;lap:number;wrongWay:boolean;wrongWayTime:number};
export const GATES_PER_LAP=Math.ceil(TRACK_LENGTH/24),GATE_SPACING=TRACK_LENGTH/GATES_PER_LAP;
export const waypoints=Array.from({length:GATES_PER_LAP},(_,i)=>({distance:i*GATE_SPACING,...at(i*GATE_SPACING),targetSpeed:cornerSpeed(i*GATE_SPACING)}));
const liveries=['#ffc63b','#ff5860','#7c6bf5','#f4f0df','#76bf63','#4b96d8','#ec8e39','#d77cb2','#a9bbcd','#d5d250'];
const names=['SOL','NOVA','ACE','RIO','JET','FINN','ASH','KAI','REMY','BLAKE','SKYE','JULES','MAX','ELI','ALEX','DREW','SAGE','ARI','JAMIE'];
export function gridSlot(index:number){return{distance:-8-Math.floor(index/2)*8-(index%2)*2,lane:index%2?2.6:-2.6};}
export function newRace(color='#20bfd0'):Race{
 const make=(index:number,name:string,color:string):Car=>{const slot=gridSlot(index);return{...at(slot.distance,slot.lane),speed:0,progress:slot.distance,lane:slot.lane,steer:0,color,name,finishTime:null,acceleration:0,impact:0,sideVelocity:0,gear:1,rpm:REFERENCE.idleRpm,throttle:0,brake:0,waypointsPassed:-1,nextGate:0,validatedProgress:slot.distance,lapTimes:[],lapStart:0,stuckTime:0,reversing:false,targetLane:slot.lane,targetSpeed:0};};
 const player=make(GRID_SIZE-1,'YOU',color),opponents=Array.from({length:GRID_SIZE-1},(_,i)=>make(i,names[i],liveries[i%liveries.length]));
 return{player,opponents,time:0,countdown:3,boost:75,boosting:false,slipstream:false,finished:false,finishTime:0,hits:0,contactCooldown:0,checkpoints:0,nextCheckpoint:0,lastDistance:wrap(player.progress,TRACK_LENGTH),lapStart:0,lapTimes:player.lapTimes,offroad:false,recovery:0,overtakes:0,previousPosition:GRID_SIZE,lap:1,wrongWay:false,wrongWayTime:0};
}
export function standings(race:Race){return[race.player,...race.opponents].sort((a,b)=>a.finishTime!==null&&b.finishTime!==null?a.finishTime-b.finishTime:a.finishTime!==null?-1:b.finishTime!==null?1:b.validatedProgress-a.validatedProgress);}
export function position(race:Race){return standings(race).indexOf(race.player)+1;}
function resetCar(p:Car){
 // A reset never bypasses an unvisited waypoint or awards forward distance.
 const distance=Math.min(p.progress,p.nextGate-.5),point=at(distance);
 p.progress=distance;p.x=point.x;p.z=point.z;p.heading=point.heading;p.lane=0;p.speed=Math.min(Math.max(0,p.speed),8);p.steer=0;p.impact=0;p.sideVelocity=0;p.stuckTime=0;p.reversing=false;p.targetLane=0;
}
export function recover(race:Race){
 const p=race.player;resetCar(p);race.lastDistance=wrap(p.progress,TRACK_LENGTH);race.recovery=1.5;race.boosting=false;race.wrongWay=false;race.wrongWayTime=0;
}
export type Options={autoAccelerate:boolean;sensitivity:number};
export const DEFAULT_OPTIONS:Options={autoAccelerate:false,sensitivity:1};
/** Brake always wins, including when gas/boost or automatic acceleration is held. */
export function pedalSpeed(speed:number,input:Input,dt:number,autoAccelerate:boolean,offroad:boolean,boosting:boolean,impact=0,torque=1){
 const throttle=!input.brake&&(autoAccelerate||input.gas||input.boost),top=offroad?21:boosting?61:49;
 let acceleration=input.brake?-(32+speed*.16):throttle?22*torque*Math.max(0,1-(speed/top)**2):-(1.6+speed*.055);
 if(speed>top)acceleration=Math.min(acceleration,-Math.max(3,(speed-top)*3));
 if(offroad)acceleration-=speed>top?5:0;
 let next=Math.max(0,speed+(acceleration-impact)*dt);
 if(speed<=top&&throttle)next=Math.min(next,top);
 return next;
}
/** Ordered route gates are shared by the player and every CPU. */
export function updateRoute(c:Car,previous:number,time:number,dt=STEP){
 const forward=c.progress>previous&&Math.cos(angle(c.heading-at(c.progress).heading))>0;
 if(forward&&previous<=c.nextGate&&c.progress>=c.nextGate&&Math.abs(c.lane)<ROAD_HALF+2){
  const crossedAt=time-(time>0?(c.progress-c.nextGate)/Math.max(.01,c.progress-previous)*dt:0);
  c.waypointsPassed++;c.nextGate+=GATE_SPACING;
  if(c.waypointsPassed>0&&c.waypointsPassed%GATES_PER_LAP===0){
   c.lapTimes.push(crossedAt-c.lapStart);c.lapStart=crossedAt;
   if(c.lapTimes.length===LAPS)c.finishTime=crossedAt;
  }
 }
 c.validatedProgress=Math.min(c.progress,c.nextGate);
}
/** All drivers use world motion and the same pedals, grip, gearing and contact. */
function driveCar(c:Car,input:Input,dt:number,cars:Car[],auto:boolean,boosting:boolean,torque:number){
 const near=project(c.x,c.z,c.progress),oldSpeed=c.speed,oldProgress=c.progress;
 const offroad=Math.abs(near.lane)>ROAD_HALF;
 c.impact=damp(c.impact,0,5,dt);
 const gear=transmission(c.speed,c.gear);c.gear=gear.gear;c.rpm=gear.rpm;
 c.throttle=!input.brake&&(auto||input.gas||input.boost)?1:0;c.brake=input.brake?1:0;
 if(c.reversing)c.speed=Math.max(-5,c.speed-10*dt);
 else c.speed=pedalSpeed(Math.max(0,c.speed),input,dt,auto,offroad,boosting,c.impact,torque*(.75+.25*torqueAtRpm(c.rpm)/REFERENCE.playerTorque));
 const fx=Math.sin(c.heading),fz=Math.cos(c.heading);
 for(const other of cars){
  if(other.name===c.name)continue;
  if(Math.cos(angle(other.heading-c.heading))<.4||Math.abs(angle((other.progress-c.progress)/TRACK_LENGTH*TAU))*TRACK_LENGTH/TAU>12)continue;
  const dx=other.x-c.x,dz=other.z-c.z,along=dx*fx+dz*fz,across=dx*-fz+dz*fx;
  if(c.speed>=0&&along>0&&along<8&&Math.abs(across)<1.7)c.speed=Math.min(c.speed,Math.max(0,(along-5.4)/dt));
  if(c.speed<0&&along<0&&along>-8&&Math.abs(across)<1.7)c.speed=Math.max(c.speed,Math.min(0,(along+5.4)/dt));
 }
 c.acceleration=clamp((c.speed-oldSpeed)/dt,-65,30);
 c.steer=damp(c.steer,clamp(input.steer,-1,1),9,dt);
 const grip=1.8/(1+Math.abs(c.speed)*.014)*steeringAuthority(c.speed)/.8;
 const turn=-c.steer*grip*clamp(c.speed/8,-1,1);
 // A weak yaw stabilizer is an arcade adapter for the recovered steering helper.
 const alignment=Math.abs(c.speed)>1?clamp(angle(near.heading-c.heading),-.55,.55)*(.18-Math.abs(c.steer)*.15):0;
 c.heading=angle(c.heading+(turn+alignment)*dt);
 c.sideVelocity=damp(c.sideVelocity,0,6,dt);
 c.x+=Math.sin(c.heading)*c.speed*dt+(-Math.cos(near.heading))*c.sideVelocity*dt;
 c.z+=Math.cos(c.heading)*c.speed*dt+Math.sin(near.heading)*c.sideVelocity*dt;
 const current=project(c.x,c.z,c.progress);c.lane=current.lane;
 let delta=current.distance-wrap(c.progress,TRACK_LENGTH);if(delta>TRACK_LENGTH/2)delta-=TRACK_LENGTH;if(delta<-TRACK_LENGTH/2)delta+=TRACK_LENGTH;
 if(Math.abs(delta)<Math.abs(c.speed)*dt*2+2)c.progress+=delta;
 Object.assign(c,transmission(c.speed,c.gear));
 return oldProgress;
}
/** Waypoint target-speed/brake-zone adapter. No player-position or catch-up multiplier. */
export function navigation(c:Car,index:number,cars:Car[],dt:number):Input{
 const gapTo=(o:Car)=>wrap(o.progress-c.progress,TRACK_LENGTH);
 const nearest=cars.filter(o=>o.name!==c.name&&o.finishTime===null&&gapTo(o)>0&&gapTo(o)<23&&Math.abs(o.lane-c.lane)<2.1).sort((a,b)=>gapTo(a)-gapTo(b))[0];
 // The original scene disables raycasts. Persistent, clearance-checked passing
 // lanes are a Racer addition for the requested expanded twenty-car grid.
 if(nearest&&nearest.speed<c.speed+2){
  const candidate=c.targetLane>0?-2.8:2.8;
  const clear=!cars.some(o=>o.name!==c.name&&Math.min(gapTo(o),TRACK_LENGTH-gapTo(o))<9&&Math.abs(o.lane-candidate)<2.1);
  if(clear&&Math.abs(c.lane-c.targetLane)<.7)c.targetLane=candidate;
 }
 const aimDistance=clamp(Math.abs(c.speed)*.28,4,13),aim=at(c.progress+aimDistance,c.targetLane);
 const heading=Math.atan2(aim.x-c.x,aim.z-c.z),error=angle(heading-c.heading);
 let target=49;
 for(let d=0;d<=105;d+=GATE_SPACING){
  const w=waypoints[Math.floor(wrap(c.progress+d,TRACK_LENGTH)/GATE_SPACING)%GATES_PER_LAP];
  target=Math.min(target,Math.sqrt((w.targetSpeed*(.96+(index%5)*.009))**2+2*18*d));
 }
 if(nearest&&Math.abs(c.lane-nearest.lane)<1.9)target=Math.min(target,Math.max(0,nearest.speed+(gapTo(nearest)-6)*2));
 // Native Navigation adds abs(steer)/3 brake and subtracts abs(steer)/5
 // throttle above speed 30. Here target reduction avoids binary pedal chatter.
 target=Math.max(6,target-Math.max(0,Math.abs(error)-.2)*3);
 if(Math.abs(error)>.5)target=Math.min(target,Math.max(8,14/Math.abs(error)));
 if(Math.abs(c.lane-c.targetLane)>2)target=Math.min(target,Math.max(8,25-Math.abs(c.lane-c.targetLane)*3));
 c.targetSpeed=target;
 c.stuckTime=c.reversing||Math.abs(c.speed)<5/3.6?c.stuckTime+dt:0;
 if(c.stuckTime>=2)c.reversing=true;
 if(c.stuckTime>=4||c.speed>=25/3.6){c.reversing=false;c.stuckTime=0;}
 return{steer:clamp(-error*3,-1,1)*(c.reversing?-1:1),gas:!c.reversing&&c.speed<target+.25,brake:!c.reversing&&c.speed>target+.6,boost:false};
}
export function step(race:Race,input:Input,dt:number,options:Options=DEFAULT_OPTIONS){
 if(race.finished||dt<=0)return;
 dt=Math.min(dt,.05);
 if(race.countdown>0){race.countdown=Math.max(0,race.countdown-dt);return;}
 race.time+=dt;race.contactCooldown=Math.max(0,race.contactCooldown-dt);race.recovery=Math.max(0,race.recovery-dt);
 const p=race.player,near=project(p.x,p.z,p.progress);
 race.offroad=Math.abs(near.lane)>ROAD_HALF;
 race.slipstream=race.opponents.some(c=>c.progress>p.progress&&c.progress-p.progress<25&&Math.abs(c.lane-near.lane)<2.2);
 // Boost remains a separately documented Racer arcade addition; shipped NOS is disabled.
 race.boosting=input.boost&&race.boost>0&&!input.brake&&!race.offroad&&race.recovery===0;
 race.boost=clamp(race.boost+(race.boosting?-24:race.slipstream?13:3.8)*dt,0,100);
 const cars=[p,...race.opponents],snapshot=cars.map(c=>({...c}));
 const decisions=race.opponents.map((c,i)=>navigation(c,i,snapshot,dt));
 const previous=driveCar(p,{...input,steer:input.steer*options.sensitivity},dt,snapshot,options.autoAccelerate,race.boosting,1);
 updateRoute(p,previous,race.time,dt);
 race.wrongWayTime=p.speed>3&&Math.cos(angle(p.heading-near.heading))<-.2?race.wrongWayTime+dt:0;
 race.wrongWay=race.wrongWayTime>.5;
 if(Math.abs(p.lane)>ROAD_HALF+14){recover(race);race.hits++;}
 race.lastDistance=wrap(p.progress,TRACK_LENGTH);race.checkpoints=Math.max(0,p.waypointsPassed);race.nextCheckpoint=p.nextGate;race.lap=p.lapTimes.length+1;race.lapStart=p.lapStart;
 for(let i=0;i<race.opponents.length;i++){
  const c=race.opponents[i];
  if(c.finishTime!==null){c.speed=damp(c.speed,0,1,dt);c.x+=Math.sin(c.heading)*c.speed*dt;c.z+=Math.cos(c.heading)*c.speed*dt;continue;}
  const old=driveCar(c,decisions[i],dt,snapshot,false,false,REFERENCE.aiTorque/REFERENCE.playerTorque);updateRoute(c,old,race.time,dt);
  if(Math.abs(c.lane)>ROAD_HALF+14||c.progress>c.nextGate+GATE_SPACING*1.5)resetCar(c);
  const dx=p.x-c.x,dz=p.z-c.z,along=dx*Math.sin(c.heading)+dz*Math.cos(c.heading),across=dx*-Math.cos(c.heading)+dz*Math.sin(c.heading);
  if(Math.abs(along)<4.2&&Math.abs(across)<1.7&&race.contactCooldown===0){const side=across>=0?1:-1;p.impact=Math.max(p.impact,24);p.sideVelocity+=side*2;c.sideVelocity-=side*1.2;race.hits++;race.contactCooldown=.65;race.boost=Math.max(0,race.boost-5);}
 }
 const pos=position(race);if(pos<race.previousPosition&&race.time>2)race.overtakes+=race.previousPosition-pos;race.previousPosition=pos;
 if(p.finishTime!==null){race.finished=true;race.boosting=false;race.finishTime=p.finishTime;}
}
