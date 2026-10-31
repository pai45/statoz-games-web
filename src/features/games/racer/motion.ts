import {angleLerp,type Car,type Race} from './engine';
export type Pose=Pick<Car,'x'|'z'|'heading'|'speed'|'steer'|'acceleration'>;
export type Motion={previous:Pose[];current:Pose[]};
const pose=(c:Car):Pose=>({x:c.x,z:c.z,heading:c.heading,speed:c.speed,steer:c.steer,acceleration:c.acceleration});
export function createMotion(race:Race):Motion{const current=[race.player,...race.opponents].map(pose);return{previous:current.map(p=>({...p})),current};}
export function capturePrevious(motion:Motion){for(let i=0;i<motion.current.length;i++)Object.assign(motion.previous[i],motion.current[i]);}
export function captureCurrent(motion:Motion,race:Race){for(let i=0;i<motion.current.length;i++){const c=i===0?race.player:race.opponents[i-1],target=motion.current[i];if(Math.hypot(c.x-target.x,c.z-target.z)>10)Object.assign(motion.previous[i],c);target.x=c.x;target.z=c.z;target.heading=c.heading;target.speed=c.speed;target.steer=c.steer;target.acceleration=c.acceleration;}}
export function interpolate(motion:Motion,index:number,alpha:number,out:Pose){const a=motion.previous[index],b=motion.current[index];out.x=a.x+(b.x-a.x)*alpha;out.z=a.z+(b.z-a.z)*alpha;out.heading=angleLerp(a.heading,b.heading,alpha);out.speed=a.speed+(b.speed-a.speed)*alpha;out.steer=a.steer+(b.steer-a.steer)*alpha;out.acceleration=a.acceleration+(b.acceleration-a.acceleration)*alpha;return out;}
