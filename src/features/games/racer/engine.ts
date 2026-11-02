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
export type Chassis='race'|'race-future';
export type Difficulty='rookie'|'pro'|'elite';
/** CPU driver character. Fixed per grid slot and difficulty; never reads the player's position. */
export type Profile={pace:number;torque:number;aggression:number;consistency:number;boostUse:number;line:number};
export type Car={x:number;z:number;heading:number;speed:number;progress:number;lane:number;steer:number;color:string;name:string;finishTime:number|null;acceleration:number;impact:number;sideVelocity:number;gear:number;rpm:number;throttle:number;brake:number;waypointsPassed:number;nextGate:number;validatedProgress:number;lapTimes:number[];lapStart:number;stuckTime:number;reversing:boolean;targetLane:number;targetSpeed:number;chassis:Chassis;profile:Profile;boostCharge:number;boostActive:boolean;passLane:number;passTimer:number;mistake:number;lastGate:number;rng:number;progressMark:number;progressTimer:number;yaw:number;spin:number;slide:number;damage:number;scrape:number;impactCooldown:number};
export type RaceEvent=
 |{type:'launch';quality:'perfect'|'jumped'}
 |{type:'impact';kind:'wall'|'car';car:number;other:number;x:number;z:number;intensity:number;heavy:boolean}
 |{type:'position';position:number;gained:number;reward:number}
 |{type:'lap';lap:number;time:number;best:boolean}
 |{type:'final-lap'}
 |{type:'reset'};
export type Race={player:Car;opponents:Car[];time:number;countdown:number;boost:number;boosting:boolean;slipstream:boolean;finished:boolean;finishTime:number;hits:number;contactCooldown:number;checkpoints:number;nextCheckpoint:number;lastDistance:number;lapStart:number;lapTimes:number[];offroad:boolean;recovery:number;overtakes:number;previousPosition:number;lap:number;wrongWay:boolean;wrongWayTime:number;difficulty:Difficulty;events:RaceEvent[];launch:'none'|'perfect'|'jumped';launchHeld:number;wheelspin:number;kerb:boolean;skid:number;bestLap:number|null;bestPosition:number};
export const GATES_PER_LAP=Math.ceil(TRACK_LENGTH/24),GATE_SPACING=TRACK_LENGTH/GATES_PER_LAP;
export const waypoints=Array.from({length:GATES_PER_LAP},(_,i)=>({distance:i*GATE_SPACING,...at(i*GATE_SPACING),targetSpeed:cornerSpeed(i*GATE_SPACING)}));
/** Racing line: lateral offset from the centreline, sampled every 2 m. A centred "Mexican hat" filter over
 * signed curvature puts cars on the outside before a corner, the inside at the apex and back out on exit. */
const LINE_STEP=2,LINE_SAMPLES=Math.ceil(TRACK_LENGTH/LINE_STEP),LINE_LIMIT=5.4;
const lineCurvature=Array.from({length:LINE_SAMPLES},(_,i)=>angle(at(i*LINE_STEP+4).heading-at(i*LINE_STEP-4).heading)/8);
/** Strongest signed curvature within +/-8 m of each sample (used to keep lanes drivable). */
const peakCurvature=lineCurvature.map((_,i)=>{let k=0;for(let j=-4;j<=4;j++){const c=lineCurvature[wrap(i+j,LINE_SAMPLES)];if(Math.abs(c)>Math.abs(k))k=c;}return k;});
/** Never aim further inside a bend than its radius allows (keeps a turning radius of at least ~9 m). */
export function drivableLane(distance:number,lane:number){
 const k=peakCurvature[Math.round(wrap(distance,TRACK_LENGTH)/LINE_STEP)%LINE_SAMPLES];
 return lane*k<0?Math.sign(lane)*Math.min(Math.abs(lane),Math.max(0,1/Math.max(Math.abs(k),1e-4)-9)):lane;
}
export const racingLine=(()=>{
 const sigma=15,reach=26,raw=lineCurvature.map((_,i)=>{let sum=0;for(let j=-reach;j<=reach;j++){const s=j*LINE_STEP/sigma;sum+=lineCurvature[wrap(i+j,LINE_SAMPLES)]*(1-s*s)*Math.exp(-s*s/2);}return-sum;});
 const sorted=raw.map(Math.abs).sort((a,b)=>a-b),scale=LINE_LIMIT/(sorted[Math.floor(sorted.length*.95)]||1);
 const line=raw.map(v=>clamp(v*scale,-LINE_LIMIT,LINE_LIMIT));
 // Light smoothing removes kinks where neighbouring corners overlap.
 return line.map((_,i)=>{let sum=0;for(let j=-3;j<=3;j++)sum+=line[wrap(i+j,LINE_SAMPLES)];return drivableLane(i*LINE_STEP,sum/7);});
})();
export function lineAt(distance:number){const d=wrap(distance,TRACK_LENGTH)/LINE_STEP,i=Math.floor(d),t=d-i;return racingLine[i%LINE_SAMPLES]*(1-t)+racingLine[(i+1)%LINE_SAMPLES]*t;}
/** Circuit boundary: a continuous barrier line on each side, sampled every 2 m and shared by the
 * physics and the renderer. Concrete wall and catch fence on the start/finish straight, a tyre wall
 * behind the gravel on the outside of slow corners, guardrail everywhere else. Where two parts of the
 * circuit run close together the wall moves to the midline between them. */
export type WallKind='rail'|'tyres'|'concrete'|'none';
/** Barrier-free lane used where a hairpin apex has a grass island instead of a wall. */
const NO_WALL=40;
export const CAR_HALF_WIDTH=1.05,WALL_STEP=2,WALL_SAMPLES=LINE_SAMPLES;
const curvatureAt=(d:number)=>lineCurvature[Math.round(wrap(d,TRACK_LENGTH)/LINE_STEP)%LINE_SAMPLES];
export const outsideBend=(d:number,side:number)=>{let k=0;for(let s=-24;s<=24;s+=8)k=Math.max(k,-curvatureAt(d+s)*side);return k>.045;};
const onMainStraight=(d:number)=>wrap(d+125,TRACK_LENGTH)<150;
export const walls=(()=>{
 const CELL=12,cells=new Map<string,number[]>();
 for(let i=0;i<track.length-1;i+=2){const p=track[i],key=Math.floor(p.x/CELL)+','+Math.floor(p.z/CELL);if(!cells.has(key))cells.set(key,[]);cells.get(key)!.push(i);}
 const nearestDistance=(x:number,z:number)=>{let best=Infinity,distance=NaN;const cx=Math.floor(x/CELL),cz=Math.floor(z/CELL);for(let a=-3;a<=3;a++)for(let b=-3;b<=3;b++)for(const i of cells.get((cx+a)+','+(cz+b))??[]){const d2=(track[i].x-x)**2+(track[i].z-z)**2;if(d2<best){best=d2;distance=track[i].distance;}}return distance;};
 const build=(side:number)=>{
  const kind:WallKind[]=[],base:number[]=[];
  for(let i=0;i<WALL_SAMPLES;i++){const d=i*WALL_STEP;kind.push(onMainStraight(d)?'concrete':outsideBend(d,side)?'tyres':'rail');base.push(kind[i]==='concrete'?12.5:kind[i]==='tyres'?22:14.5);}
  const eased=base.map((_,i)=>{let sum=0;for(let j=-6;j<=6;j++)sum+=base[wrap(i+j,WALL_SAMPLES)];return sum/13;});
  const lanes=eased.map((target,i)=>{
   const d=i*WALL_STEP,k=peakCurvature[i];let lane=target;
   // Inside a bend the wall cannot sit beyond the bend's own centre.
   if(side*k<0)lane=Math.min(lane,Math.max(9.6,.8/Math.max(Math.abs(k),1e-4)));
   // Stop short of the midline to any other part of the circuit.
   for(let l=9.5;l<=lane;l+=.5){const p=at(d,side*l),other=nearestDistance(p.x,p.z);if(Number.isNaN(other))continue;const gap=Math.abs(wrap(other-d+TRACK_LENGTH/2,TRACK_LENGTH)-TRACK_LENGTH/2);if(gap>35){lane=Math.max(9.6,l-1.5);break;}}
   return lane;
  });
  // Remove single-sample notches, then soften the joins.
  const opened=lanes.map((_,i)=>{let m=Infinity;for(let j=-2;j<=2;j++)m=Math.min(m,lanes[wrap(i+j,WALL_SAMPLES)]);return m;});
  const smooth=opened.map((_,i)=>{let sum=0;for(let j=-2;j<=2;j++)sum+=opened[wrap(i+j,WALL_SAMPLES)];return Math.max(9.6,sum/5);});
  // Hairpin apexes tighter than the minimum wall offset would fold the barrier across the road:
  // leave a grass island there (no barrier), widened by one sample either side.
  const fold=smooth.map((lane,i)=>{const p=at(i*WALL_STEP,side*lane),q=project(p.x,p.z);return Math.abs(q.lane)<9.2&&Math.abs(wrap(q.distance-i*WALL_STEP+TRACK_LENGTH/2,TRACK_LENGTH)-TRACK_LENGTH/2)>4;});
  fold.forEach((f,i)=>{if(f||fold[wrap(i-1,WALL_SAMPLES)]||fold[wrap(i+1,WALL_SAMPLES)]){kind[i]='none';}});
  return{kind,lanes:smooth.map((lane,i)=>kind[i]==='none'?NO_WALL:lane)};
 };
 return{left:build(-1),right:build(1)};
})();
/** Distance from the centreline to the barrier face on one side (positive), interpolated. */
export function wallLane(distance:number,side:number){const w=(side>0?walls.right:walls.left).lanes,d=wrap(distance,TRACK_LENGTH)/WALL_STEP,i=Math.floor(d),t=d-i;return w[i%WALL_SAMPLES]*(1-t)+w[(i+1)%WALL_SAMPLES]*t;}
export function wallKind(distance:number,side:number){return(side>0?walls.right:walls.left).kind[Math.round(wrap(distance,TRACK_LENGTH)/WALL_STEP)%WALL_SAMPLES];}
const liveries=['#ffc63b','#ff5860','#7c6bf5','#f4f0df','#76bf63','#4b96d8','#ec8e39','#d77cb2','#a9bbcd','#d5d250'];
const names=['SOL','NOVA','ACE','RIO','JET','FINN','ASH','KAI','REMY','BLAKE','SKYE','JULES','MAX','ELI','ALEX','DREW','SAGE','ARI','JAMIE'];
export const DIFFICULTIES:Record<Difficulty,{label:string;pace:number;torque:number;consistency:number;boost:number}>={
 rookie:{label:'Rookie',pace:.87,torque:.78,consistency:.55,boost:.35},
 pro:{label:'Pro',pace:.948,torque:1,consistency:.74,boost:.8},
 elite:{label:'Elite',pace:.978,torque:1.05,consistency:.9,boost:1},
};
/** Deterministic per-slot character. Faster drivers start nearer the front, as if after qualifying. */
export function profileFor(index:number,difficulty:Difficulty='pro'):Profile{
 const d=DIFFICULTIES[difficulty],hash=(n:number)=>{const v=Math.sin((index+1)*n)*43758.5453;return v-Math.floor(v);};
 return{pace:d.pace+(1-index/(GRID_SIZE-2))*.032+hash(12.9898)*.012,torque:d.torque,aggression:hash(78.233),consistency:clamp(d.consistency+hash(39.425)*.1,0,1),boostUse:d.boost*(.55+hash(9.173)*.45),line:.78+hash(3.31)*.22};
}
export function gridSlot(index:number){return{distance:-8-Math.floor(index/2)*8-(index%2)*2,lane:index%2?2.6:-2.6};}
export type RaceSetup={difficulty?:Difficulty;chassis?:Chassis};
export function newRace(color='#20bfd0',setup:RaceSetup={}):Race{
 const difficulty=setup.difficulty??'pro';
 const make=(index:number,name:string,color:string,chassis:Chassis):Car=>{const slot=gridSlot(index);return{...at(slot.distance,slot.lane),speed:0,progress:slot.distance,lane:slot.lane,steer:0,color,name,finishTime:null,acceleration:0,impact:0,sideVelocity:0,gear:1,rpm:REFERENCE.idleRpm,throttle:0,brake:0,waypointsPassed:-1,nextGate:0,validatedProgress:slot.distance,lapTimes:[],lapStart:0,stuckTime:0,reversing:false,targetLane:slot.lane,targetSpeed:0,chassis,profile:profileFor(index,difficulty),boostCharge:60,boostActive:false,passLane:slot.lane,passTimer:0,mistake:0,lastGate:-1,rng:(index+1)*2654435761>>>0,progressMark:slot.distance,progressTimer:0,yaw:0,spin:0,slide:0,damage:0,scrape:0,impactCooldown:0};};
 const player=make(GRID_SIZE-1,'YOU',color,setup.chassis??'race'),opponents=Array.from({length:GRID_SIZE-1},(_,i)=>make(i,names[i],liveries[i%liveries.length],i%3===1?'race-future':'race'));
 return{player,opponents,time:0,countdown:3,boost:75,boosting:false,slipstream:false,finished:false,finishTime:0,hits:0,contactCooldown:0,checkpoints:0,nextCheckpoint:0,lastDistance:wrap(player.progress,TRACK_LENGTH),lapStart:0,lapTimes:player.lapTimes,offroad:false,recovery:0,overtakes:0,previousPosition:GRID_SIZE,lap:1,wrongWay:false,wrongWayTime:0,difficulty,events:[],launch:'none',launchHeld:0,wheelspin:0,kerb:false,skid:0,bestLap:null,bestPosition:GRID_SIZE};
}
/** Small seeded generator stored on the car, so CPU mistakes replay identically. */
function random(c:Car){c.rng=(c.rng+0x6D2B79F5)>>>0;let t=c.rng;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;}
function emit(race:Race,event:RaceEvent){if(race.events.length<48)race.events.push(event);}
export function standings(race:Race){return[race.player,...race.opponents].sort((a,b)=>a.finishTime!==null&&b.finishTime!==null?a.finishTime-b.finishTime:a.finishTime!==null?-1:b.finishTime!==null?1:b.validatedProgress-a.validatedProgress);}
export function position(race:Race){return standings(race).indexOf(race.player)+1;}
function resetCar(p:Car){
 // A reset never bypasses an unvisited waypoint or awards forward distance.
 const distance=Math.min(p.progress,p.nextGate-.5),point=at(distance);
 p.progress=distance;p.x=point.x;p.z=point.z;p.heading=point.heading;p.lane=0;p.speed=Math.min(Math.max(0,p.speed),8);p.steer=0;p.impact=0;p.sideVelocity=0;p.stuckTime=0;p.reversing=false;p.targetLane=0;p.passTimer=0;p.mistake=0;p.boostActive=false;p.progressMark=p.progress;p.progressTimer=0;p.yaw=0;p.spin=0;p.slide=p.heading;p.scrape=0;
}
export function recover(race:Race){
 const p=race.player;resetCar(p);race.lastDistance=wrap(p.progress,TRACK_LENGTH);race.recovery=1.5;race.boosting=false;race.wrongWay=false;race.wrongWayTime=0;
}
export type Options={autoAccelerate:boolean;sensitivity:number};
export const DEFAULT_OPTIONS:Options={autoAccelerate:false,sensitivity:1};
/** Brake always wins, including when gas/boost or automatic acceleration is held. */
export function pedalSpeed(speed:number,input:Input,dt:number,autoAccelerate:boolean,offroad:boolean,boosting:boolean,impact=0,torque=1,topScale=1){
 const throttle=!input.brake&&(autoAccelerate||input.gas||input.boost),top=(offroad?21:boosting?61:49)*topScale;
 let acceleration=input.brake?-(32+speed*.16):throttle?22*torque*Math.max(0,1-(speed/top)**2):-(1.6+speed*.055);
 if(speed>top)acceleration=Math.min(acceleration,-Math.max(3,(speed-top)*3));
 if(offroad)acceleration-=speed>top?5:0;
 let next=Math.max(0,speed+(acceleration-impact)*dt);
 if(speed<=top&&throttle)next=Math.min(next,top);
 return next;
}
/** Ordered route gates are shared by the player and every CPU. */
export function updateRoute(c:Car,previous:number,time:number,dt=STEP){
 // Direction of travel, so a car sliding forward through a spin still collects its gate.
 const forward=c.progress>previous&&Math.cos(angle(travelHeading(c)-at(c.progress).heading))>0;
 if(forward&&previous<=c.nextGate&&c.progress>=c.nextGate&&Math.abs(c.lane)<Math.min(ROAD_HALF+14,wallLane(c.progress,c.lane>=0?1:-1)+.5)){
  const crossedAt=time-(time>0?(c.progress-c.nextGate)/Math.max(.01,c.progress-previous)*dt:0);
  c.waypointsPassed++;c.nextGate+=GATE_SPACING;
  if(c.waypointsPassed>0&&c.waypointsPassed%GATES_PER_LAP===0){
   c.lapTimes.push(crossedAt-c.lapStart);c.lapStart=crossedAt;
   if(c.lapTimes.length===LAPS)c.finishTime=crossedAt;
  }
 }
 c.validatedProgress=Math.min(c.progress,c.nextGate);
}
/** Direction of travel. During a spin-out the car keeps sliding along its old path while it rotates. */
const travelHeading=(c:Car)=>c.spin>0?c.slide:c.heading;
/** All drivers use world motion and the same pedals, grip, gearing, barriers and contact. */
function driveCar(c:Car,input:Input,dt:number,cars:Car[],auto:boolean,boosting:boolean,torque:number,race:Race,index:number){
 const near=project(c.x,c.z,c.progress),oldSpeed=c.speed,oldProgress=c.progress;
 const offroad=Math.abs(near.lane)>ROAD_HALF;
 c.impact=damp(c.impact,0,5,dt);c.impactCooldown=Math.max(0,c.impactCooldown-dt);c.scrape=Math.max(0,c.scrape-dt*5);
 const gear=transmission(c.speed,c.gear);c.gear=gear.gear;c.rpm=gear.rpm;
 if(c.spin>0){
  // Spinning: no drive or steering, tyres scrub speed, the body rotates and slowly regains grip.
  c.spin=Math.max(0,c.spin-dt);c.throttle=0;c.brake=1;
  c.speed=damp(c.speed,0,1.5,dt);c.yaw=damp(c.yaw,0,1.3,dt);c.heading=angle(c.heading+c.yaw*dt);c.slide=angleLerp(c.slide,c.heading,1-Math.exp(-.9*dt));
  if(c.spin===0){c.speed*=Math.max(0,Math.cos(angle(c.heading-c.slide)));c.yaw*=.2;}
  c.steer=damp(c.steer,0,9,dt);
 }else{
  c.throttle=!input.brake&&(auto||input.gas||input.boost)?1:0;c.brake=input.brake?1:0;
  // Damage costs up to 15% power and 8% top speed.
  if(c.reversing)c.speed=Math.max(-5,c.speed-10*dt);
  else c.speed=pedalSpeed(Math.max(0,c.speed),input,dt,auto,offroad,boosting,c.impact,torque*(.75+.25*torqueAtRpm(c.rpm)/REFERENCE.playerTorque)*(1-c.damage*.0015),1-c.damage*.0008);
  const fx=Math.sin(c.heading),fz=Math.cos(c.heading);
  for(const other of cars){
   if(other.name===c.name)continue;
   if(Math.cos(angle(other.heading-c.heading))<.4||Math.abs(angle((other.progress-c.progress)/TRACK_LENGTH*TAU))*TRACK_LENGTH/TAU>12)continue;
   const dx=other.x-c.x,dz=other.z-c.z,along=dx*fx+dz*fz,across=dx*-fz+dz*fx;
   if(c.speed>=0&&along>0&&along<8&&Math.abs(across)<1.7)c.speed=Math.min(c.speed,Math.max(0,(along-5.4)/dt));
   if(c.speed<0&&along<0&&along>-8&&Math.abs(across)<1.7)c.speed=Math.max(c.speed,Math.min(0,(along+5.4)/dt));
  }
  c.steer=damp(c.steer,clamp(input.steer,-1,1),9,dt);
  const grip=1.8/(1+Math.abs(c.speed)*.014)*steeringAuthority(c.speed)/.8;
  const turn=-c.steer*grip*clamp(c.speed/8,-1,1);
  // A weak yaw stabilizer is an arcade adapter for the recovered steering helper.
  const alignment=Math.abs(c.speed)>1?clamp(angle(near.heading-c.heading),-.55,.55)*(.18-Math.abs(c.steer)*.15):0;
  c.yaw=damp(c.yaw,0,6,dt);
  c.heading=angle(c.heading+(turn+alignment+c.yaw)*dt);c.slide=c.heading;
 }
 c.acceleration=clamp((c.speed-oldSpeed)/dt,-65,30);
 c.sideVelocity=damp(c.sideVelocity,0,6,dt);
 const move=travelHeading(c);
 c.x+=Math.sin(move)*c.speed*dt+(-Math.cos(near.heading))*c.sideVelocity*dt;
 c.z+=Math.cos(move)*c.speed*dt+Math.sin(near.heading)*c.sideVelocity*dt;
 const current=project(c.x,c.z,c.progress);c.lane=current.lane;
 hitBarrier(c,current,near.heading,race,index);
 let delta=current.distance-wrap(c.progress,TRACK_LENGTH);if(delta>TRACK_LENGTH/2)delta-=TRACK_LENGTH;if(delta<-TRACK_LENGTH/2)delta+=TRACK_LENGTH;
 if(Math.abs(delta)<Math.abs(c.speed)*dt*2+2)c.progress+=delta;
 Object.assign(c,transmission(c.speed,c.gear));
 return oldProgress;
}
/** Barrier contact: push the car back to the barrier face, remove the velocity into the wall with a
 * little bounce, scrub speed with friction and turn the car parallel. Hard hits spin the car out. */
function hitBarrier(c:Car,point:{lane:number;distance:number;heading:number},trackHeading:number,race:Race,index:number){
 const side=point.lane>=0?1:-1,limit=wallLane(point.distance,side)-CAR_HALF_WIDTH;
 if(Math.abs(point.lane)<=limit)return;
 const nx=-Math.cos(point.heading)*side,nz=Math.sin(point.heading)*side,penetration=Math.abs(point.lane)-limit;
 c.x-=nx*penetration;c.z-=nz*penetration;c.lane=side*limit;
 const move=travelHeading(c),vx=Math.sin(move)*c.speed-Math.cos(trackHeading)*c.sideVelocity,vz=Math.cos(move)*c.speed+Math.sin(trackHeading)*c.sideVelocity,into=vx*nx+vz*nz;
 if(into<=0)return;
 const tx=vx-into*nx,tz=vz-into*nz,along=Math.hypot(tx,tz),friction=Math.min(along,into*.5+along*(1-Math.exp(-.9*STEP)));
 const tangent=Math.cos(angle(c.heading-point.heading))>=0?point.heading:angle(point.heading+Math.PI);
 c.speed=Math.sign(c.speed||1)*(along-friction);c.sideVelocity=-side*into*.28;c.scrape=1;
 // Glancing hits slide straight along the barrier; harder ones swing round over a few ticks.
 if(c.spin===0)c.heading=into<7?tangent:angleLerp(c.heading,tangent,.35);
 c.slide=c.spin>0?tangent:c.heading;
 const intensity=clamp(into/16,0,1),heavy=into>10.5;
 if(into>4){c.damage=Math.min(100,c.damage+into*1.4);c.impact=Math.max(c.impact,into*1.2);}
 if(heavy&&c.spin===0){c.spin=.7+intensity*.9;c.slide=tangent;c.yaw=side*(2.4+3.2*intensity);}
 if(into>2.5&&c.impactCooldown===0){
  c.impactCooldown=.3;emit(race,{type:'impact',kind:'wall',car:index,other:-1,x:c.x+nx*CAR_HALF_WIDTH,z:c.z+nz*CAR_HALF_WIDTH,intensity,heavy});
  if(index===0){race.hits++;race.boost=Math.max(0,race.boost-intensity*8);}
 }
}
/** Car-to-car contact between every pair: side overlaps are separated, closing velocity is exchanged
 * along the contact normal (equal masses, restitution 0.35) and off-centre hits add yaw. A hard hit
 * on a rear quarter spins the car out. Nose-to-tail spacing stays with the traffic limiter above. */
function resolveContacts(race:Race,cars:Car[]){
 for(let i=0;i<cars.length;i++)for(let j=i+1;j<cars.length;j++){
  const a=cars[i],b=cars[j];if(a.finishTime!==null&&b.finishTime!==null)continue;
  const dx=b.x-a.x,dz=b.z-a.z;if(dx*dx+dz*dz>30)continue;
  const fx=Math.sin(a.heading),fz=Math.cos(a.heading),along=dx*fx+dz*fz,across=dx*-fz+dz*fx;
  const overAlong=4.3-Math.abs(along),overAcross=2.05-Math.abs(across);
  if(overAlong<=0||overAcross<=0)continue;
  const sideways=overAcross<overAlong,sx=sideways?-fz*Math.sign(across):fx*Math.sign(along),sz=sideways?fx*Math.sign(across):fz*Math.sign(along);
  if(sideways){a.x-=sx*overAcross/2;a.z-=sz*overAcross/2;b.x+=sx*overAcross/2;b.z+=sz*overAcross/2;}
  const velocity=(c:Car)=>{const m=travelHeading(c),t=at(c.progress).heading;return[Math.sin(m)*c.speed-Math.cos(t)*c.sideVelocity,Math.cos(m)*c.speed+Math.sin(t)*c.sideVelocity];};
  const [ax,az]=velocity(a),[bx,bz]=velocity(b),closing=(bx-ax)*sx+(bz-az)*sz;
  if(closing>=0)continue;
  const impulse=-(1+.35)*closing/2;
  for(const [car,sign] of [[a,-1],[b,1]] as const){
   const jx=sx*impulse*sign,jz=sz*impulse*sign,m=travelHeading(car),t=at(car.progress).heading;
   car.speed+=jx*Math.sin(m)+jz*Math.cos(m);if(!car.reversing)car.speed=Math.max(0,car.speed);
   car.sideVelocity+=-jx*Math.cos(t)+jz*Math.sin(t);
   // Torque from a contact point halfway between the two cars.
   const rx=dx/2*-sign,rz=dz/2*-sign,kick=clamp((rz*jx-rx*jz)*.09,-3,3);car.yaw+=kick;
   if(impulse>6.5&&Math.abs(kick)>1.1&&car.spin===0){car.spin=.6+Math.min(.8,impulse/20);car.slide=m;car.yaw=Math.sign(kick)*(2.2+impulse*.15);}
   if(impulse>3)car.damage=Math.min(100,car.damage+impulse*.9);
  }
  const intensity=clamp(impulse/9,0,1);
  if(impulse>1.2&&(a.impactCooldown===0||b.impactCooldown===0)){
   a.impactCooldown=b.impactCooldown=.3;
   emit(race,{type:'impact',kind:'car',car:i,other:j,x:a.x+dx/2,z:a.z+dz/2,intensity,heavy:impulse>6.5});
   if(i===0){race.hits++;race.boost=Math.max(0,race.boost-intensity*6);}
  }
 }
}
/** Waypoint target-speed/brake-zone adapter. No player-position or catch-up multiplier:
 * pace comes only from the car's fixed profile and the cars physically around it. */
export function navigation(c:Car,index:number,cars:Car[],dt:number):Input{
 const gapTo=(o:Car)=>wrap(o.progress-c.progress,TRACK_LENGTH),pr=c.profile;
 c.passTimer=Math.max(0,c.passTimer-dt);c.mistake=Math.max(0,c.mistake-dt);
 const aimDistance=clamp(Math.abs(c.speed)*.28,5.5,13),line=lineAt(c.progress+aimDistance)*pr.line;
 const nearest=cars.filter(o=>o.name!==c.name&&o.finishTime===null&&gapTo(o)>0&&gapTo(o)<26&&Math.abs(o.lane-c.lane)<2.3).sort((a,b)=>gapTo(a)-gapTo(b))[0];
 // The original scene disables raycasts. Clearance-checked passing lanes are a Racer
 // addition: pick the side away from the blocker, try the other side if it is busy.
 if(nearest&&c.passTimer===0&&nearest.speed<c.speed+1.5+pr.aggression*2){
  const away=nearest.lane>line?-1:1;
  for(const side of [away,-away]){
   const candidate=clamp(nearest.lane+side*3.3,-6.2,6.2);
   if(Math.abs(candidate-nearest.lane)<2.6)continue;
   const clear=!cars.some(o=>o.name!==c.name&&o!==nearest&&Math.min(gapTo(o),TRACK_LENGTH-gapTo(o))<10&&Math.abs(o.lane-candidate)<2.1);
   if(clear){c.passLane=candidate;c.passTimer=1.4+pr.aggression*.8;break;}
  }
 }
 c.targetLane=drivableLane(c.progress+aimDistance,c.passTimer>0?c.passLane:line);
 // Assertive drivers cover the inside on straights when a faster car closes from behind (one move only).
 if(c.passTimer===0&&pr.aggression>.55&&Math.abs(line)<1.6){
  const attacker=cars.find(o=>o.name!==c.name&&o.finishTime===null&&TRACK_LENGTH-gapTo(o)<9&&o.speed>c.speed+1);
  if(attacker)c.targetLane=drivableLane(c.progress+aimDistance,clamp(line+clamp(attacker.lane-line,-1.6,1.6),-6,6));
 }
 // Never squeeze a car that is alongside: keep at least a car's width of lateral room to it.
 for(const o of cars){
  if(o.name===c.name||o.finishTime!==null)continue;const ahead=gapTo(o);
  if(Math.min(ahead,TRACK_LENGTH-ahead)>(ahead<TRACK_LENGTH/2?7:4.5)||Math.abs(o.lane-c.lane)<.9)continue;
  c.targetLane=o.lane<c.lane?Math.max(c.targetLane,o.lane+3):Math.min(c.targetLane,o.lane-3);
 }
 c.targetLane=clamp(c.targetLane,-6.4,6.4);
 // A seeded misjudgement: braking a little late into the next slow corner and running wide.
 const gate=Math.floor(wrap(c.progress,TRACK_LENGTH)/GATE_SPACING);
 if(gate!==c.lastGate){c.lastGate=gate;if(waypoints[(gate+2)%GATES_PER_LAP].targetSpeed<30&&random(c)<(1-pr.consistency)*.3)c.mistake=1.3;}
 // Sweep across gradually: the aim point is never more than 1.3 m to the side of the car's lane.
 const aim=at(c.progress+aimDistance,c.lane+clamp(c.targetLane-c.lane,-1.3,1.3));
 const heading=Math.atan2(aim.x-c.x,aim.z-c.z),error=angle(heading-c.heading);
 let target=61,ahead=49;
 for(let d=0;d<=105;d+=GATE_SPACING){
  const w=waypoints[Math.floor(wrap(c.progress+d,TRACK_LENGTH)/GATE_SPACING)%GATES_PER_LAP];
  target=Math.min(target,Math.sqrt((w.targetSpeed*pr.pace+(c.mistake>0?4.5:0))**2+2*18*d));
  if(d<=72)ahead=Math.min(ahead,w.targetSpeed);
 }
 // Boost on long straights: sooner when chasing someone, with a reserve kept by cautious drivers.
 const boost=!c.reversing&&ahead>44&&c.speed>28&&c.boostCharge>(nearest?18:30+(1-pr.boostUse)*45)&&pr.boostUse>.3;
 if(!boost)target=Math.min(target,49);
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
 return{steer:clamp(-error*3,-1,1)*(c.reversing?-1:1),gas:!c.reversing&&c.speed<target+.25,brake:!c.reversing&&c.speed>target+.6,boost};
}
/** Hit the gas once all five start lights are lit (the last half second) for a perfect launch. */
export const LAUNCH_WINDOW=.5;
export function step(race:Race,input:Input,dt:number,options:Options=DEFAULT_OPTIONS){
 if(race.finished||dt<=0)return;
 dt=Math.min(dt,.05);
 if(race.countdown>0){
  race.launchHeld=(input.gas||input.boost)&&!input.brake?race.launchHeld+dt:0;
  race.countdown=Math.max(0,race.countdown-dt);
  if(race.countdown===0&&race.launchHeld>0){
   // Held too early = wheelspin; timed with the fifth light = a clean, boosted getaway.
   if(race.launchHeld<=LAUNCH_WINDOW+1e-9){race.launch='perfect';race.player.speed=9;race.boost=clamp(race.boost+15,0,100);}else{race.launch='jumped';race.wheelspin=.9;}
   emit(race,{type:'launch',quality:race.launch});
  }
  return;
 }
 race.time+=dt;race.contactCooldown=Math.max(0,race.contactCooldown-dt);race.recovery=Math.max(0,race.recovery-dt);race.wheelspin=Math.max(0,race.wheelspin-dt);
 const p=race.player,near=project(p.x,p.z,p.progress);
 race.offroad=Math.abs(near.lane)>ROAD_HALF;
 race.slipstream=race.opponents.some(c=>c.progress>p.progress&&c.progress-p.progress<25&&Math.abs(c.lane-near.lane)<2.2);
 // Boost remains a separately documented Racer arcade addition; shipped NOS is disabled.
 race.boosting=input.boost&&race.boost>0&&!input.brake&&!race.offroad&&race.recovery===0&&race.player.spin===0;
 race.boost=clamp(race.boost+(race.boosting?-24:race.slipstream?13:3.8)*dt,0,100);
 p.boostActive=race.boosting;p.boostCharge=race.boost;
 const cars=[p,...race.opponents],snapshot=cars.map(c=>({...c}));
 const decisions=race.opponents.map((c,i)=>navigation(c,i,snapshot,dt));
 const laps=p.lapTimes.length;
 const previous=driveCar(p,{...input,steer:input.steer*options.sensitivity},dt,snapshot,options.autoAccelerate,race.boosting,race.wheelspin>0?.4:1,race,0);
 updateRoute(p,previous,race.time,dt);
 if(p.lapTimes.length>laps){
  const time=p.lapTimes.at(-1)!,best=race.bestLap===null||time<race.bestLap;if(best)race.bestLap=time;
  emit(race,{type:'lap',lap:p.lapTimes.length,time,best});if(p.lapTimes.length===LAPS-1)emit(race,{type:'final-lap'});
 }
 race.wrongWayTime=p.speed>3&&Math.cos(angle(p.heading-near.heading))<-.2?race.wrongWayTime+dt:0;
 race.wrongWay=race.wrongWayTime>.5;
 if(Math.abs(p.lane)>ROAD_HALF+14){recover(race);race.hits++;emit(race,{type:'reset'});}
 // Presentation signals (sound, smoke, camera rumble). They do not feed back into the simulation.
 const lane=Math.abs(p.lane),slide=Math.abs(p.steer)*p.speed/49;
 race.kerb=p.speed>8&&lane>7.3&&lane<9.2;
 race.skid=clamp(Math.max(p.spin>0&&Math.abs(p.speed)>3?1:0,p.brake&&p.spin===0?(p.speed-12)/30:0,(slide-.62)*3,race.wheelspin>0&&p.throttle?1:0),0,1);
 race.lastDistance=wrap(p.progress,TRACK_LENGTH);race.checkpoints=Math.max(0,p.waypointsPassed);race.nextCheckpoint=p.nextGate;race.lap=p.lapTimes.length+1;race.lapStart=p.lapStart;
 for(let i=0;i<race.opponents.length;i++){
  const c=race.opponents[i];
  if(c.finishTime!==null){c.boostActive=false;c.brake=0;c.speed=damp(c.speed,0,1,dt);c.x+=Math.sin(c.heading)*c.speed*dt;c.z+=Math.cos(c.heading)*c.speed*dt;continue;}
  // CPUs share the player's boost rules: the same drain, passive charge and slipstream charge.
  const decision=decisions[i],cpuSlip=snapshot.some(o=>o.name!==c.name&&wrap(o.progress-c.progress,TRACK_LENGTH)<25&&wrap(o.progress-c.progress,TRACK_LENGTH)>0&&Math.abs(o.lane-c.lane)<2.2);
  c.boostActive=decision.boost&&c.boostCharge>0&&!decision.brake&&Math.abs(c.lane)<=ROAD_HALF;
  c.boostCharge=clamp(c.boostCharge+(c.boostActive?-24:cpuSlip?13:3.8)*dt,0,100);
  const old=driveCar(c,decision,dt,snapshot,false,c.boostActive,REFERENCE.aiTorque/REFERENCE.playerTorque*c.profile.torque,race,i+1);updateRoute(c,old,race.time,dt);
  // A CPU that keeps moving without gaining ground (spun, or orbiting a hairpin) is put back on the road.
  if(c.progress>c.progressMark+3){c.progressMark=c.progress;c.progressTimer=0;}else if(!c.reversing&&c.speed>3)c.progressTimer+=dt;
  if(Math.abs(c.lane)>ROAD_HALF+14||c.progress>c.nextGate+GATE_SPACING*1.5||c.progressTimer>4)resetCar(c);
 }
 resolveContacts(race,cars);
 const pos=position(race);
 if(pos!==race.previousPosition&&race.time>2){
  const gained=race.previousPosition-pos;if(gained>0)race.overtakes+=gained;
  // Boost is earned only for new ground, so trading places back and forth cannot farm it.
  const reward=pos<race.bestPosition?6*(race.bestPosition-pos):0;if(reward)race.boost=clamp(race.boost+reward,0,100);
  emit(race,{type:'position',position:pos,gained,reward});
 }
 race.bestPosition=Math.min(race.bestPosition,race.time>2?pos:race.bestPosition);race.previousPosition=pos;
 if(p.finishTime!==null){race.finished=true;race.boosting=false;race.finishTime=p.finishTime;}
}
