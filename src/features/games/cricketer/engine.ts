import type {Challenge} from './data';

export const STEP = 1/120;
export const RELEASE = 1.25;
export const WINDUP = .15;
export const PITCH = 20.12;
export type Side = 'left' | 'right';
export type Shot = 'drive' | 'cut' | 'pull' | 'hook' | 'sweep' | 'scoop';
export type Vec = {x: number; y: number; z: number};
export type Delivery = {side: Side; line: number; length: number; speed: number; flight: number; kind: 'pace' | 'slower' | 'spin'; shot: Shot; bounce: number; contactHeight: number};
export type BallResult = {runs: number; feedback: string; quality: number; offset: number | null; shot: Shot; caught: boolean};
export type Match = {
  challenge: Challenge; seed: number; initialSeed: number; ball: number; score: number; results: BallResult[];
  phase: 'delivery' | 'flight' | 'running' | 'between' | 'finished'; age: number; time: number;
  delivery: Delivery; input: {side: Side; at: number} | null; outcome: BallResult | null;
  trajectory: {vx: number; vy: number; vz: number; duration: number; landing: Vec};
  won: boolean; checkpoint: number;
};
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
export function random(s: {seed: number}) {s.seed = (Math.imul(s.seed, 1664525)+1013904223) >>> 0; return s.seed/4294967296;}
export function nextDelivery(s: {seed: number}, c: Challenge, index: number): Delivery {
  const side: Side = c.lesson === 'direction' ? index%2 ? 'right' : 'left' : random(s) < .5 ? 'left' : 'right';
  const variety = random(s), length = c.lesson === 'direction' ? .55 : random(s);
  const kind = c.tier === 0 || c.lesson === 'direction' ? 'pace' : variety < .28 ? 'spin' : variety < .48 ? 'slower' : 'pace';
  const speed = kind === 'spin' ? 78+random(s)*17 : kind === 'slower' ? 96+random(s)*12 : 108+c.tier*12+random(s)*12;
  // Authored arcade flight is slower than physical km/h, allowing readable mobile play.
  const flight = (PITCH/(speed/3.6))*1.55;
  const shot: Shot = length > .8 ? side === 'right' ? 'hook' : 'cut' : length > .62 ? side === 'right' ? 'pull' : 'cut' : length < .18 ? side === 'right' ? 'scoop' : 'sweep' : 'drive';
  return {side, line: (side === 'left' ? -1 : 1)*(.25+random(s)*.65), length, speed, flight, kind, shot, bounce: .55+length*.31, contactHeight: .22+length*1.1};
}
export function newMatch(challenge: Challenge, seed: number): Match {
  const s: Match = {challenge, seed: seed >>> 0, initialSeed: seed >>> 0, ball: 0, score: 0, results: [], phase:'delivery', age:0, time:0, delivery: null!, input:null, outcome:null, trajectory:{vx:0, vy:0, vz:0, duration:0, landing:{x:0,y:0,z:0}}, won:false, checkpoint:0};
  s.delivery=nextDelivery(s, challenge, 0); return s;
}
export const contactAt = (s: Match) => RELEASE+s.delivery.flight;
export function swing(s: Match, side: Side) {
  if(s.phase!=='delivery'||s.input||s.age<RELEASE-.1||s.age>contactAt(s)) return false;
  s.input={side, at:s.age}; return true;
}
export function evaluate(s: Match): BallResult {
  const offset = s.input ? s.input.at+WINDUP-contactAt(s) : null;
  const window = s.challenge.lesson === 'direction' ? .52 : .28-s.challenge.tier*.025;
  const quality = offset === null ? 0 : clamp(1-Math.abs(offset)/window, 0, 1);
  const wrong = s.input && s.input.side!==s.delivery.side;
  const feedback = !s.input ? 'NO SHOT' : wrong ? 'WRONG SIDE' : quality===0 ? (offset! < 0 ? 'TOO EARLY' : 'TOO LATE') : quality>.78 ? 'MIDDLE OF THE BAT' : quality>.48 ? 'GOOD TIMING' : offset!<0 ? 'EARLY' : 'LATE';
  // A ball-limited arcade chase. A missed/caught ball costs one delivery, not an invented wicket budget.
  const caught = !wrong && quality>0 && quality<.23 && s.delivery.length>.65;
  const runs = wrong || caught ? 0 : quality>.83 ? 6 : quality>.66 ? 4 : quality>.45 ? 3 : quality>.26 ? 2 : quality>0 ? 1 : 0;
  return {runs, feedback:caught?'CAUGHT':feedback, quality:wrong?0:quality, offset, shot:s.delivery.shot, caught};
}
function hit(s: Match) {
  s.outcome=evaluate(s);
  const result=s.outcome;
  if(result.runs===0&&!result.caught) {s.phase='between'; s.age=0; return;}
  // Short shots are collected; four crosses after a bounce; six clears the rope in flight.
  const direction = (s.delivery.side==='left' ? -1 : 1)*(.4+s.delivery.length*.95+(result.offset||0)*1.4);
  const ropeDistance=10*Math.cos(direction)+Math.sqrt(65*65-100*Math.sin(direction)**2);
  const distance = result.runs===6 ? ropeDistance+8 : result.runs===4 ? ropeDistance+3 : 12+result.runs*9;
  const duration = result.runs===6 ? 2.9 : result.runs===4 ? 2.3 : 1.6;
  const vy = result.runs===6 ? 15 : result.caught ? 8 : 3+result.quality*4;
  s.trajectory={vx: Math.sin(direction)*distance/duration, vz:-Math.cos(direction)*distance/duration, vy, duration, landing:{x:Math.sin(direction)*distance,y:0,z:-Math.cos(direction)*distance}};
  s.phase='flight'; s.age=0;
}
export function settle(s: Match) {
  if(!s.outcome) return;
  s.score+=s.outcome.runs; s.results.push({...s.outcome}); s.ball++; s.checkpoint++;
  if(s.score>=s.challenge.target||s.ball>=s.challenge.balls) {s.won=s.score>=s.challenge.target;s.phase='finished';s.age=0;return;}
  s.delivery=nextDelivery(s,s.challenge,s.ball);s.phase='delivery';s.age=0;s.input=null;s.outcome=null;
}
export function step(s: Match, dt=STEP) {
  if(s.phase==='finished') return;
  s.time+=dt; s.age+=dt;
  if(s.phase==='delivery'&&s.age>=contactAt(s)) hit(s);
  else if(s.phase==='flight'&&s.age>=s.trajectory.duration) {s.phase=s.outcome!.runs>0&&s.outcome!.runs<4?'running':'between';s.age=0;}
  else if(s.phase==='running'&&s.age>=s.outcome!.runs*.7) {s.phase='between';s.age=0;}
  else if(s.phase==='between'&&s.age>=1.15) settle(s);
}
export function skipHighlight(s: Match) {if(s.phase==='flight'&&(s.outcome?.runs||0)>=4){s.phase='between';s.age=0;return true;}return false;}
export function ballPosition(s: Match): Vec {
  const d=s.delivery;
  if(s.phase==='delivery') {
    const p=clamp((s.age-RELEASE)/d.flight,0,1);
    const before=p<d.bounce, q=before?p/d.bounce:(p-d.bounce)/(1-d.bounce);
    const y=before ? 2*(1-q)+.65*Math.sin(q*Math.PI) : d.contactHeight*q+.35*Math.sin(q*Math.PI);
    return {x:.16*(1-p)+d.line*p*p, y:Math.max(.05,y), z:-PITCH*(1-p)};
  }
  if(s.phase==='flight') {
    const t=s.age, tr=s.trajectory, p=clamp(t/tr.duration,0,1);
    const y = s.outcome?.runs===6 || s.outcome?.caught ? Math.max(.06,d.contactHeight*(1-p)+(s.outcome?.caught ? .75 : 0)*p+Math.sin(p*Math.PI)*tr.vy) : Math.max(.06,p<.6?d.contactHeight*(1-p/.6)+Math.sin(p/.6*Math.PI)*tr.vy:Math.sin((p-.6)/.4*Math.PI)*tr.vy*.2);
    return {x:d.line+tr.vx*t,y,z:tr.vz*t};
  }
  return s.outcome?.runs ? {...s.trajectory.landing, y:.09} : {x:d.line,y:.06,z:2.4};
}
export function checkpoint(s: Match) {
  // Never persist half a delivery: rebuild from the initial seed and the completed results.
  return {challengeId:s.challenge.id, initialSeed:s.initialSeed, seed:s.phase==='delivery'?s.seed:null, results:s.results.map(r=>({...r}))};
}
export function restore(challenge: Challenge, saved: ReturnType<typeof checkpoint>) {
  const s=newMatch(challenge,saved.initialSeed);
  for(const r of saved.results) {
    s.outcome={...r}; settle(s);
    if(s.phase==='finished') break;
  }
  return s;
}
