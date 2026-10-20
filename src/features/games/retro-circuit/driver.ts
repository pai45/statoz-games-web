import {sampleTrack,targetSpeed,vehicleById,nearbyObstacles} from './data';import {neutralInput,type RaceInput} from './types';import type {RaceSimulation} from './simulation';
/** Review driver uses only public inputs; it never changes race state. */
export function drive(g:Pick<RaceSimulation,'cars'|'track'|'phase'|'elapsed'>):RaceInput{
 if(g.phase==='countdown')return neutralInput();
 const p=g.cars[0],r=sampleTrack(g.track,p.distance),v=vehicleById(p.vehicle),pit=p.fuel<44&&r.s>g.track.pit.start-350&&r.s<g.track.pit.end;
 let x=pit?1.2:-.36;
 if(!pit){const hazards=nearbyObstacles(g.track,p.distance,280).filter(o=>o.distance>0);if(hazards.some(o=>Math.abs(o.x-x)<o.radius+.23)){x=[-.70,0,.70].find(candidate=>hazards.every(o=>Math.abs(o.x-candidate)>o.radius+.22))??x;}}
 const wanted=pit?(r.s<g.track.pit.start||p.x<1.04?17:0):targetSpeed(g.track,p.distance,v)*.98;
 const correction=(x-p.x)*7+r.curve*(p.speed/v.maxSpeed)**2*.95;
 return {left:correction<-.04,right:correction>.04,throttle:p.inPit?p.fuel>=93:p.speed<wanted,brake:p.inPit?p.fuel<93:p.speed>wanted+1,nitro:!pit&&p.nitro>0&&p.boost===0&&g.elapsed>15&&g.elapsed%45<.03&&Math.abs(r.curve)<.2};
}
