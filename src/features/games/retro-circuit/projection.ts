import { modulo, sampleTrack,courseFor,physicalSeparation,terrainHeight } from "./data";
import type { RaceSnapshot, TrackDefinition } from "./types";
export type RoadPoint={x:number;y:number;half:number;scale:number;distance:number;curve:number;pit:boolean;stripe:boolean};
export const CAMERA_TRAIL=22;
export const cameraDistance=(world:number,player:number,length=5400)=>physicalSeparation(world,player,length)+CAMERA_TRAIL;
/** Original visual elevation, periodic at the lap seam; simulation stays on track distance. */
export const roadElevation=terrainHeight;
export function roadProjection(state: RaceSnapshot,track: TrackDefinition): RoadPoint[]{
  const result:RoadPoint[]=[];let offset=0,heading=0;
  const egoScale=1+(125/149-1)*CAMERA_TRAIL/24;
  const cameraShift=state.player.x*370*egoScale-Math.max(-160,Math.min(160,state.player.x*130));
  for(let i=0;i<=80;i++){
    const distance=i*24,world=state.player.distance-CAMERA_TRAIL+distance,road=sampleTrack(track,world),scale=125/(125+distance);
    heading+=road.curve*0.0035;offset+=heading;
    const elevation=(roadElevation(track,world)-roadElevation(track,state.player.distance))*3.2;
    result.push({x:240+offset*330*scale-cameraShift,y:70+(200-elevation)*scale,half:370*scale,scale,distance,curve:road.curve,pit:road.s>=track.pit.start&&road.s<=track.pit.end,stripe:Math.floor(world/38)%2===0});
  }return result;
}
export function projectedCar(distance:number,x:number,points:RoadPoint[]){
  const i=Math.floor(distance/24);if(i<0||i>=points.length-1)return null;
  const t=distance/24-i,a=points[i],b=points[i+1];
  const center=a.x+(b.x-a.x)*t,scale=a.scale+(b.scale-a.scale)*t;
  const y=a.y+(b.y-a.y)*t,occlusion=Math.min(...points.slice(0,i+1).map(p=>p.y));
  return {x:center+x*(a.half+(b.half-a.half)*t),y,scale,occlusion,visible:y<=occlusion+3};
}
/** Compact distance diagram, derived from the canonical sectors. Non-metric: the
 * positive radial envelope keeps the closed course legible without false crossings.
 * Car markers and pit position still use the same ordered track distance as racing.
 */
export function mapPoints(track:TrackDefinition){const courseSamples=courseFor(track).points,minX=Math.min(...courseSamples.map(p=>p.x)),minY=Math.min(...courseSamples.map(p=>p.y)),w=Math.max(...courseSamples.map(p=>p.x))-minX,h=Math.max(...courseSamples.map(p=>p.y))-minY;return courseSamples.map(p=>({x:8+(p.x-minX)/w*84,y:8+(p.y-minY)/h*52}));}

export const localDistance=(world:number,track:TrackDefinition)=>modulo(world,track.length);
