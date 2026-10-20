import type {TrackDefinition,TrackId,VehicleId,VehicleDefinition,TrackObstacle} from './types';
/** Faster arcade tuning, not recovered console physics. */
export const vehicles:readonly VehicleDefinition[]=[
 {id:'vector',name:'WHITE / GT',role:'Fast balanced player',maxSpeed:350/3.6,acceleration:32,grip:1.12,fuelRate:1,color:'#e5e5eb',silhouette:'coupe'},
 {id:'comet',name:'ORANGE / GT',role:'Straight-line rival',maxSpeed:352/3.6,acceleration:31,grip:1.02,fuelRate:1.03,color:'#b66825',silhouette:'wedge'},
 {id:'kestrel',name:'PURPLE / GT',role:'Cornering rival',maxSpeed:340/3.6,acceleration:33,grip:1.23,fuelRate:.97,color:'#aa53b1',silhouette:'hatch'},
 {id:'nomad',name:'BLACK / GT',role:'Patient rival',maxSpeed:344/3.6,acceleration:30,grip:1.16,fuelRate:.91,color:'#383640',silhouette:'tourer'}];
export const vehicleById=(id:VehicleId)=>vehicles.find(v=>v.id===id)!;
export const modulo=(n:number,l:number)=>((n%l)+l)%l;
export const physicalSeparation=(a:number,b:number,length:number)=>modulo(a-b+length/2,length)-length/2;
const hazards=(length:number,offset=0):TrackObstacle[]=>[
 {id:'cone-a',s:1350+offset,x:.58,kind:'cone',radius:.11},{id:'barrel-a',s:2130+offset,x:-.57,kind:'barrel',radius:.14},
 {id:'barrier-a',s:2890+offset,x:.60,kind:'barrier',radius:.24},{id:'barrier-b',s:3070+offset,x:-.60,kind:'barrier',radius:.24},{id:'rock-a',s:Math.min(length-1500,3620+offset),x:.08,kind:'rock',radius:.17},
 {id:'cone-b',s:length-780,x:-.66,kind:'cone',radius:.11}];
/** Original reference-led layouts, not recovered source courses. */
export const tracks:readonly TrackDefinition[]=[
 {id:'desert',name:'CANYON RUN',description:'Desert mesas, rolling crests and broad sweepers',difficulty:'FAST / ROLLING',length:5400,laps:3,pit:{start:440,end:900},sky:'#24c5ea',ground:'#c7926b',verge:'#d8a982',horizon:'#daac88',road:['#35494e','#3c5055'],elevation:[63,24,0],controlPoints:[[0,0],[.25,-.02],[.52,.16],[.92,.43],[1,.76],[.76,1],[.45,.94],[.22,.68],[.04,.32]],sectors:[{length:5400,curve:0,scenery:'rocks'}],obstacles:hazards(5400)},
 {id:'coast',name:'PACIFIC HEIGHTS',description:'Ocean cliffs, palm-lined straights and long climbs',difficulty:'FLOW / HIGH CRESTS',length:5600,laps:3,pit:{start:440,end:900},sky:'#7dd8ed',ground:'#5b9753',verge:'#79ab62',horizon:'#80b6ad',road:['#3b4d50','#42565a'],elevation:[88,19,.45],controlPoints:[[0,0],[.34,-.05],[.74,.07],[1,.35],[.90,.66],[.65,.77],[.53,1],[.25,.91],[.08,.59],[-.08,.23]],sectors:[{length:5600,curve:0,scenery:'palms'}],obstacles:hazards(5600,120)},
 {id:'city',name:'NEON METRO',description:'Dusk skyline, concrete rises and tighter sequences',difficulty:'TECHNICAL / DUSK',length:5200,laps:3,pit:{start:440,end:900},sky:'#39375e',ground:'#655d6a',verge:'#786b78',horizon:'#a57986',road:['#303340','#383c49'],elevation:[42,18,.8],controlPoints:[[0,0],[.35,0],[.57,.18],[.84,.16],[1,.40],[.83,.60],[.92,.84],[.56,1],[.29,.86],[.09,.63],[-.10,.24]],sectors:[{length:5200,curve:0,scenery:'buildings'}],obstacles:hazards(5200,-120)}];
export const trackById=(id:TrackId)=>tracks.find(t=>t.id===id)??tracks[0];
type CoursePoint={x:number;y:number;s:number};
const cached=new Map<TrackId,{points:CoursePoint[];curves:number[]}>();
export function courseFor(track:TrackDefinition){
 const prior=cached.get(track.id);if(prior)return prior;
 const controls=track.controlPoints,n=controls.length;
 const cat=(i:number,t:number)=>{const p0=controls[modulo(i-1,n)],p1=controls[i],p2=controls[(i+1)%n],p3=controls[(i+2)%n];return [0,1].map(k=>.5*((2*p1[k])+(-p0[k]+p2[k])*t+(2*p0[k]-5*p1[k]+4*p2[k]-p3[k])*t*t+(-p0[k]+3*p1[k]-3*p2[k]+p3[k])*t*t*t));};
 const raw=Array.from({length:n*120+1},(_,i)=>cat(Math.floor((i%(n*120))/120),(i%120)/120)),lengths=[0];
 for(let i=1;i<raw.length;i++)lengths.push(lengths[i-1]+Math.hypot(raw[i][0]-raw[i-1][0],raw[i][1]-raw[i-1][1]));
 const original=Array.from({length:901},(_,i)=>{const s=i/900*lengths.at(-1)!;let j=lengths.findIndex(v=>v>=s);j=Math.max(1,j);const t=(s-lengths[j-1])/(lengths[j]-lengths[j-1]||1);return {x:raw[j-1][0]+(raw[j][0]-raw[j-1][0])*t,y:raw[j-1][1]+(raw[j][1]-raw[j-1][1])*t,s:i/900*track.length};});
 const points=Array.from({length:901},(_,i)=>({...original[(i+105)%900],s:i/900*track.length}));
 const curves=points.slice(0,-1).map((p,i,a)=>{const prev=a[modulo(i-5,a.length)],next=a[(i+5)%a.length],ax=p.x-prev.x,ay=p.y-prev.y,bx=next.x-p.x,by=next.y-p.y;return Math.max(-.85,Math.min(.85,Math.atan2(ax*by-ay*bx,ax*bx+ay*by)*5));});
 const result={points,curves};cached.set(track.id,result);return result;
}
export const courseSamples=courseFor(tracks[0]).points;
/** Smooth periodic height shared by simulation and projection. */
export function terrainHeight(track:TrackDefinition,distance:number){const t=modulo(distance,track.length)/track.length*Math.PI*2,[a,b,phase]=track.elevation;return a*Math.sin(t*3+phase)+b*Math.sin(t*6-phase);}
export function terrainGrade(track:TrackDefinition,distance:number){return (terrainHeight(track,distance+2)-terrainHeight(track,distance-2))/4;}
export function sampleTrack(track:TrackDefinition,distance:number){const s=modulo(distance,track.length),index=s/track.length*900,i=Math.floor(index),t=index-i,{curves}=courseFor(track);return {s,curve:curves[i]+(curves[(i+1)%900]-curves[i])*t,height:terrainHeight(track,distance),grade:terrainGrade(track,distance),scenery:track.sectors[0].scenery,sector:Math.floor(s/500)};}
export function targetSpeed(track:TrackDefinition,distance:number,vehicle:VehicleDefinition){const c=Math.max(...[0,65,135,210].map(d=>Math.abs(sampleTrack(track,distance+d).curve)));return vehicle.maxSpeed*(1-c*.30/vehicle.grip);}
export const propSpacing=(track:TrackDefinition)=>track.length/Math.round(track.length/92);
export function roadsideProp(track:TrackDefinition,index:number){index=modulo(index,Math.round(track.length/propSpacing(track)));const spacing=propSpacing(track),s=modulo(index*spacing,track.length),r=sampleTrack(track,s),pit=s>=track.pit.start-150&&s<=track.pit.end&&index%2===0,corner=Math.abs(r.curve)>.24&&index%3===0;return {x:pit?1.53:corner?(r.curve>0?-1.24:1.24):index%2?-1.55:1.63,kind:pit?5:corner?(r.curve>0?4:3):index%11===0?7:index%5===0?6:index%7===0?2:index%3===0?1:0,collides:!pit};}
export function nearbyObstacles(track:TrackDefinition,distance:number,range=1900){return track.obstacles.map(o=>({...o,distance:physicalSeparation(o.s,modulo(distance,track.length),track.length)})).filter(o=>o.distance>=-35&&o.distance<range);}
