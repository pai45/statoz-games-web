/** Authored arcade simulation. Positive steering always means screen-right. */
import {circuitPoints} from './circuit';
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
export const track=Array.from({length:SAMPLES+1},(_,i)=>{const t=i/SAMPLES*points.length,p=spline(t),before=spline(t-.0001),after=spline(t+.0001);return{...p,distance:0,heading:Math.atan2(after.x-before.x,after.z-before.z)};});
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
export function project(x:number,z:number){
 let best=Infinity,index=0,fraction=0;
 for(let i=0;i<track.length-1;i++){
  const a=track[i],b=track[i+1],dx=b.x-a.x,dz=b.z-a.z,len2=dx*dx+dz*dz,t=clamp(((x-a.x)*dx+(z-a.z)*dz)/len2,0,1),px=a.x+dx*t,pz=a.z+dz*t,dist=(x-px)**2+(z-pz)**2;
  if(dist<best){best=dist;index=i;fraction=t;}
 }
 const a=track[index],b=track[index+1],dx=b.x-a.x,dz=b.z-a.z,px=a.x+dx*fraction,pz=a.z+dz*fraction,length=Math.hypot(dx,dz);
 return{distance:a.distance+(b.distance-a.distance)*fraction,lane:((z-pz)*dx-(x-px)*dz)/length,heading:angleLerp(a.heading,b.heading,fraction),x:px,z:pz};
}
export type Input={steer:number;brake:boolean;boost:boolean;gas:boolean};
export const emptyInput=():Input=>({steer:0,brake:false,boost:false,gas:false});
export type Car={x:number;z:number;heading:number;speed:number;progress:number;lane:number;steer:number;color:string;name:string;finishTime:number|null;acceleration:number;impact:number;sideVelocity:number};
export type Race={player:Car;opponents:Car[];time:number;countdown:number;boost:number;boosting:boolean;slipstream:boolean;finished:boolean;finishTime:number;hits:number;contactCooldown:number;checkpoints:number;nextCheckpoint:number;lastDistance:number;lapStart:number;lapTimes:number[];offroad:boolean;recovery:number;overtakes:number;previousPosition:number;lap:number};
const liveries=['#ffc63b','#ff5860','#7c6bf5','#f4f0df','#76bf63','#4b96d8','#ec8e39','#d77cb2','#a9bbcd','#d5d250'];
const names=['SOL','NOVA','ACE','RIO','JET','FINN','ASH','KAI','REMY','BLAKE','SKYE','JULES','MAX','ELI','ALEX','DREW','SAGE','ARI','JAMIE'];
export function gridSlot(index:number){return{distance:45-index*4,lane:index%2?2.6:-2.6};}
export function newRace(color='#20bfd0'):Race{
 const make=(index:number,name:string,color:string):Car=>{const slot=gridSlot(index);return{...at(slot.distance,slot.lane),speed:0,progress:slot.distance,lane:slot.lane,steer:0,color,name,finishTime:null,acceleration:0,impact:0,sideVelocity:0};};
 const player=make(GRID_SIZE-1,'YOU',color),opponents=Array.from({length:GRID_SIZE-1},(_,i)=>make(i,names[i],liveries[i%liveries.length]));
 return{player,opponents,time:0,countdown:3,boost:75,boosting:false,slipstream:false,finished:false,finishTime:0,hits:0,contactCooldown:0,checkpoints:0,nextCheckpoint:TRACK_LENGTH/8,lastDistance:wrap(player.progress,TRACK_LENGTH),lapStart:0,lapTimes:[],offroad:false,recovery:0,overtakes:0,previousPosition:GRID_SIZE,lap:1};
}
export function position(race:Race){return 1+race.opponents.filter(car=>car.finishTime!==null?(race.player.finishTime===null||car.finishTime<race.player.finishTime):car.progress>race.player.progress).length;}
export function recover(race:Race){
 const p=race.player,point=at(p.progress);p.x=point.x;p.z=point.z;p.heading=point.heading;p.lane=0;p.speed=Math.min(p.speed,8);p.steer=0;p.impact=0;p.sideVelocity=0;race.lastDistance=wrap(p.progress,TRACK_LENGTH);race.recovery=1.5;race.boosting=false;
}
export type Options={autoAccelerate:boolean;sensitivity:number};
export const DEFAULT_OPTIONS:Options={autoAccelerate:false,sensitivity:1};
/** Brake always wins, including when gas/boost or automatic acceleration is held. */
export function pedalSpeed(speed:number,input:Input,dt:number,autoAccelerate:boolean,offroad:boolean,boosting:boolean,impact=0){
 const throttle=!input.brake&&(autoAccelerate||input.gas||input.boost),top=offroad?21:boosting?61:49;
 let acceleration=input.brake?-(32+speed*.16):throttle?22*Math.max(0,1-(speed/top)**2):-(1.6+speed*.055);
 if(speed>top)acceleration=Math.min(acceleration,-Math.max(3,(speed-top)*3));
 if(offroad)acceleration-=speed>top?5:0;
 let next=Math.max(0,speed+(acceleration-impact)*dt);
 if(speed<=top&&throttle)next=Math.min(next,top);
 return next;
}
export function step(race:Race,input:Input,dt:number,options:Options=DEFAULT_OPTIONS){
 if(race.finished||dt<=0)return;
 dt=Math.min(dt,.05);
 if(race.countdown>0){race.countdown=Math.max(0,race.countdown-dt);return;}
 race.time+=dt;race.contactCooldown=Math.max(0,race.contactCooldown-dt);race.recovery=Math.max(0,race.recovery-dt);
 const p=race.player,near=project(p.x,p.z),oldSpeed=p.speed;
 race.offroad=Math.abs(near.lane)>ROAD_HALF;
 race.slipstream=race.opponents.some(c=>c.progress>p.progress&&c.progress-p.progress<25&&Math.abs(c.lane-near.lane)<2.2);
 race.boosting=input.boost&&race.boost>0&&!input.brake&&!race.offroad&&race.recovery===0;
 race.boost=clamp(race.boost+(race.boosting?-24:race.slipstream?13:3.8)*dt,0,100);
 p.impact=damp(p.impact,0,5,dt);p.speed=pedalSpeed(p.speed,input,dt,options.autoAccelerate,race.offroad,race.boosting,p.impact);
 // Resolve forward contact in world space. The speedometer and animation must
 // report the distance the car can actually travel, not a hidden engine speed.
 const fx=Math.sin(p.heading),fz=Math.cos(p.heading);
 for(const c of race.opponents){
  const dx=c.x-p.x,dz=c.z-p.z,along=dx*fx+dz*fz,across=dx*-fz+dz*fx;
  if(along>0&&along<8&&Math.abs(across)<1.7)p.speed=Math.min(p.speed,Math.max(0,(along-5.4)/dt));
 }
 p.acceleration=clamp((p.speed-oldSpeed)/dt,-65,30);
 p.steer=damp(p.steer,clamp(input.steer*options.sensitivity,-1,1),9,dt);
 const grip=1.8/(1+p.speed*.014),turn=-p.steer*grip*clamp(p.speed/8,0,1);
 const alignment=clamp(angle(near.heading-p.heading),-.55,.55)*(.65-Math.abs(p.steer)*.55);
 p.heading=angle(p.heading+(turn+alignment)*dt);
 const normal=at(p.progress);p.sideVelocity=damp(p.sideVelocity,0,6,dt);
 const travel=p.speed*dt;
 p.x+=Math.sin(p.heading)*travel+normal.nx*p.sideVelocity*dt;p.z+=Math.cos(p.heading)*travel+normal.nz*p.sideVelocity*dt;
 const current=project(p.x,p.z);p.lane=current.lane;
 let delta=current.distance-race.lastDistance;if(delta>TRACK_LENGTH/2)delta-=TRACK_LENGTH;if(delta<-TRACK_LENGTH/2)delta+=TRACK_LENGTH;
 if(Math.abs(delta)<p.speed*dt*2+2)p.progress+=delta;
 race.lastDistance=current.distance;
 if(Math.abs(current.lane)>ROAD_HALF+14){recover(race);race.hits++;}
 if(p.progress>=race.nextCheckpoint&&Math.abs(p.lane)<ROAD_HALF+3){race.checkpoints++;race.nextCheckpoint+=TRACK_LENGTH/8;}
 if(race.checkpoints>=race.lap*8){race.lapTimes.push(race.time-race.lapStart);race.lapStart=race.time;race.lap++;}
 const cars=[p,...race.opponents];
 for(let i=0;i<race.opponents.length;i++){
  const c=race.opponents[i];if(c.finishTime!==null){c.speed=damp(c.speed,18,2,dt);c.progress+=c.speed*dt;const point=at(c.progress,c.lane);c.x=point.x;c.z=point.z;c.heading=point.heading;continue;}
  const a=at(c.progress),b=at(c.progress+24),curve=angle(b.heading-a.heading),base=35.5+(i%7)*.65;
  let target=clamp(base-Math.abs(curve)*32,14,41),laneTarget=(i%2?2.45:-2.45)+Math.sin(c.progress*.002+i)*.35;
  let nearest:Car|null=null;
  for(const other of cars)if(other!==c&&other.finishTime===null&&other.progress>c.progress&&other.progress-c.progress<16&&Math.abs(other.lane-c.lane)<2.1&&(!nearest||other.progress<nearest.progress))nearest=other;
  if(nearest){
   const passing=c.lane>0?-2.6:2.6,clear=!cars.some(other=>other!==c&&Math.abs(other.progress-c.progress)<10&&Math.abs(other.lane-passing)<2);
   if(clear)laneTarget=passing;
   // The stationary staggered grid needs a shared launch, not a zero-speed
   // following chain that propagates through nineteen rivals one car at a time.
   const gap=nearest.progress-c.progress,followingDistance=6+c.speed*.2;
   if(gap<followingDistance)target=Math.min(target,Math.max(0,nearest.speed+(gap-6)*3));
  }
  const old=c.speed;c.speed=damp(c.speed,target,nearest?4:1.1,dt);c.acceleration=(c.speed-old)/dt;const advance=nearest?Math.min(c.speed*dt,Math.max(0,nearest.progress-c.progress-6)):c.speed*dt;c.progress+=advance;
  c.lane=damp(c.lane,laneTarget,1.3,dt);const point=at(c.progress,c.lane);c.x=point.x;c.z=point.z;c.heading=point.heading;c.steer=damp(c.steer,clamp(-curve*1.8,-1,1),6,dt);
  if(c.progress>=TRACK_LENGTH*LAPS)c.finishTime=race.time;
  const dx=p.x-c.x,dz=p.z-c.z,along=dx*Math.sin(c.heading)+dz*Math.cos(c.heading),across=dx*-Math.cos(c.heading)+dz*Math.sin(c.heading);
  if(Math.abs(along)<4.2&&Math.abs(across)<1.7&&race.contactCooldown===0){const side=across>=0?1:-1;p.impact=Math.max(p.impact,24);p.sideVelocity+=side*2;c.speed=Math.max(6,c.speed-2);race.hits++;race.contactCooldown=.65;race.boost=Math.max(0,race.boost-5);}
 }
 const pos=position(race);if(pos<race.previousPosition&&race.time>2)race.overtakes+=race.previousPosition-pos;race.previousPosition=pos;
 if(race.lap>LAPS){race.finished=true;race.boosting=false;p.finishTime=race.time;race.finishTime=race.time;}
}
