import {CIRCUITS, type CircuitDefinition} from './circuit';
import {angle,angleLerp,clamp,wrap,TAU} from './math';
export type WallKind='rail'|'tyres'|'concrete'|'none';
function buildCircuit(definition:CircuitDefinition){
const points=definition.points;
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
const first=sampled.findIndex(p=>p.distance>=definition.startOffset);
const track=[...sampled.slice(first,-1),...sampled.slice(0,first+1)].map(p=>({...p,distance:0}));
for(let i=1;i<track.length;i++)track[i].distance=track[i-1].distance+Math.hypot(track[i].x-track[i-1].x,track[i].z-track[i-1].z);
const TRACK_LENGTH=track.at(-1)!.distance;
function at(distance:number,lane=0){
 const d=wrap(distance,TRACK_LENGTH);let lo=0,hi=track.length-1;
 while(hi-lo>1){const mid=(hi+lo)>>1;if(track[mid].distance<=d)lo=mid;else hi=mid;}
 const a=track[lo],b=track[hi],t=(d-a.distance)/(b.distance-a.distance),heading=angleLerp(a.heading,b.heading,t),nx=-Math.cos(heading),nz=Math.sin(heading);
 return{x:a.x+(b.x-a.x)*t+nx*lane,z:a.z+(b.z-a.z)*t+nz*lane,nx,nz,heading};
}
function cornerSpeed(progress:number){
 let curvature=.001;
 for(let d=0;d<=42;d+=6)curvature=Math.max(curvature,Math.abs(angle(at(progress+d+10).heading-at(progress+d).heading))/10);
 return clamp(1.05/curvature,10,49);
}
function project(x:number,z:number,hint?:number){
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
const GATES_PER_LAP=Math.ceil(TRACK_LENGTH/24),GATE_SPACING=TRACK_LENGTH/GATES_PER_LAP;
const waypoints=Array.from({length:GATES_PER_LAP},(_,i)=>({distance:i*GATE_SPACING,...at(i*GATE_SPACING),targetSpeed:cornerSpeed(i*GATE_SPACING)}));
/** Racing line: lateral offset from the centreline, sampled every 2 m. A centred "Mexican hat" filter over
 * signed curvature puts cars on the outside before a corner, the inside at the apex and back out on exit. */
const LINE_STEP=2,LINE_SAMPLES=Math.ceil(TRACK_LENGTH/LINE_STEP),LINE_LIMIT=5.4;
const lineCurvature=Array.from({length:LINE_SAMPLES},(_,i)=>angle(at(i*LINE_STEP+4).heading-at(i*LINE_STEP-4).heading)/8);
/** Strongest signed curvature within +/-8 m of each sample (used to keep lanes drivable). */
const peakCurvature=lineCurvature.map((_,i)=>{let k=0;for(let j=-4;j<=4;j++){const c=lineCurvature[wrap(i+j,LINE_SAMPLES)];if(Math.abs(c)>Math.abs(k))k=c;}return k;});
/** Never aim further inside a bend than its radius allows (keeps a turning radius of at least ~9 m). */
function drivableLane(distance:number,lane:number){
 const k=peakCurvature[Math.round(wrap(distance,TRACK_LENGTH)/LINE_STEP)%LINE_SAMPLES];
 return lane*k<0?Math.sign(lane)*Math.min(Math.abs(lane),Math.max(0,1/Math.max(Math.abs(k),1e-4)-9)):lane;
}
const racingLine=(()=>{
 const sigma=15,reach=26,raw=lineCurvature.map((_,i)=>{let sum=0;for(let j=-reach;j<=reach;j++){const s=j*LINE_STEP/sigma;sum+=lineCurvature[wrap(i+j,LINE_SAMPLES)]*(1-s*s)*Math.exp(-s*s/2);}return-sum;});
 const sorted=raw.map(Math.abs).sort((a,b)=>a-b),scale=LINE_LIMIT/(sorted[Math.floor(sorted.length*.95)]||1);
 const line=raw.map(v=>clamp(v*scale,-LINE_LIMIT,LINE_LIMIT));
 // Light smoothing removes kinks where neighbouring corners overlap.
 return line.map((_,i)=>{let sum=0;for(let j=-3;j<=3;j++)sum+=line[wrap(i+j,LINE_SAMPLES)];return drivableLane(i*LINE_STEP,sum/7);});
})();
function lineAt(distance:number){const d=wrap(distance,TRACK_LENGTH)/LINE_STEP,i=Math.floor(d),t=d-i;return racingLine[i%LINE_SAMPLES]*(1-t)+racingLine[(i+1)%LINE_SAMPLES]*t;}
/** Circuit boundary: a continuous barrier line on each side, sampled every 2 m and shared by the
 * physics and the renderer. Concrete wall and catch fence on the start/finish straight, a tyre wall
 * behind the gravel on the outside of slow corners, guardrail everywhere else. Where two parts of the
 * circuit run close together the wall moves to the midline between them. */

/** Barrier-free lane used where a hairpin apex has a grass island instead of a wall. */
const NO_WALL=40;
const CAR_HALF_WIDTH=1.05,WALL_STEP=2,WALL_SAMPLES=LINE_SAMPLES;
const curvatureAt=(d:number)=>lineCurvature[Math.round(wrap(d,TRACK_LENGTH)/LINE_STEP)%LINE_SAMPLES];
const outsideBend=(d:number,side:number)=>{let k=0;for(let s=-24;s<=24;s+=8)k=Math.max(k,-curvatureAt(d+s)*side);return k>.045;};
const onMainStraight=(d:number)=>wrap(d+125,TRACK_LENGTH)<150;
const walls=(()=>{
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
function wallLane(distance:number,side:number){const w=(side>0?walls.right:walls.left).lanes,d=wrap(distance,TRACK_LENGTH)/WALL_STEP,i=Math.floor(d),t=d-i;return w[i%WALL_SAMPLES]*(1-t)+w[(i+1)%WALL_SAMPLES]*t;}
function wallKind(distance:number,side:number){return(side>0?walls.right:walls.left).kind[Math.round(wrap(distance,TRACK_LENGTH)/WALL_STEP)%WALL_SAMPLES];}

 const xs=track.map(p=>p.x),zs=track.map(p=>p.z),minX=Math.min(...xs),minZ=Math.min(...zs),width=Math.max(...xs)-minX,height=Math.max(...zs)-minZ,scale=Math.min(135/width,124/height);
 const mapPosition=(x:number,z:number)=>({x:10+(135-width*scale)/2+(x-minX)*scale,y:10+(124-height*scale)/2+(z-minZ)*scale});
 const mapPath=track.filter((_,i)=>i%6===0).map((p,i)=>{const m=mapPosition(p.x,p.z);return `${i?'L':'M'}${m.x.toFixed(1)},${m.y.toFixed(1)}`;}).join(' ')+'Z';
 const freeze=<T>(v:T):T=>{if(v&&typeof v==='object'){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
 return freeze({definition,mapPosition,mapPath,track,TRACK_LENGTH,at,cornerSpeed,project,GATES_PER_LAP,GATE_SPACING,waypoints,drivableLane,racingLine,lineAt,CAR_HALF_WIDTH,WALL_STEP,WALL_SAMPLES,outsideBend,walls,wallLane,wallKind});
}
export type CircuitRuntime=ReturnType<typeof buildCircuit>;
const cache=new Map<string,CircuitRuntime>();
export function circuitFor(id:string=CIRCUITS[0].id):CircuitRuntime{
 const definition=CIRCUITS.find(c=>c.id===id);if(!definition)throw new Error(`Unknown Racer circuit: ${id}`);
 let runtime=cache.get(id);if(!runtime){runtime=buildCircuit(definition);cache.set(id,runtime);}return runtime;
}
export const defaultCircuit=circuitFor();
export const {track,TRACK_LENGTH,at,cornerSpeed,project,GATES_PER_LAP,GATE_SPACING,waypoints,drivableLane,racingLine,lineAt,CAR_HALF_WIDTH,WALL_STEP,WALL_SAMPLES,outsideBend,walls,wallLane,wallKind}=defaultCircuit;
