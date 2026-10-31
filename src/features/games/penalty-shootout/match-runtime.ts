import { initializePhysics, ShootoutSimulation } from './engine/simulation';
import { ShootoutScene } from './rendering/scene';
import { ShootoutInput } from './input';
import { ShootoutAudio } from './audio';
import { STEP, type Frame, type Settings, type Snapshot, type MatchRules } from './game-types';

export type MatchRuntime = { simulation: ShootoutSimulation; scene: ShootoutScene; input: ShootoutInput; audio: ShootoutAudio; active: boolean; paused: boolean; accumulator: number; previous: Frame | null };

/** The same 120 Hz simulation and interpolated renderer serve both games. */
export function startShootoutLoop(rt:MatchRuntime, settings:()=>Settings, publish:(s:Snapshot)=>void, options:{maxRenderFps?:number;hudFps?:number;onCheckpoint?:(c:import('./game-types').MatchCheckpoint)=>void}={}):()=>void {
 let raf=0,previousTime=performance.now(),lastHud=0,lastRender=0,disposed=false,seenKicks=rt.simulation.kicks.length,renderedPaused=false;
 const draw=(now:number)=>{
  if(disposed)return;
  const dt=Math.min(.05,Math.max(0,(now-previousTime)/1000));previousTime=now;
  if(rt.active&&!rt.paused){rt.accumulator+=dt;while(rt.accumulator>=STEP){rt.previous=rt.simulation.frame();rt.input.setRole(rt.simulation.role);rt.simulation.step(rt.input.sample());rt.accumulator-=STEP;}rt.audio.events(rt.simulation.consumeEvents());}
  if(rt.simulation.kicks.length>seenKicks){seenKicks=rt.simulation.kicks.length;options.onCheckpoint?.(rt.simulation.checkpoint());}
  if(options.maxRenderFps&&rt.paused&&renderedPaused){raf=requestAnimationFrame(draw);return;}
  if(!options.maxRenderFps||now-lastRender>=1000/options.maxRenderFps-.5){
   const snapshot=rt.simulation.snapshot();
   if(!options.maxRenderFps||!rt.paused||!renderedPaused)rt.scene.render(rt.simulation.frame(),rt.previous,rt.accumulator/STEP,snapshot,settings().reducedMotion);
   renderedPaused=rt.paused;lastRender=now;
   if(now-lastHud>1000/(options.hudFps??20)){lastHud=now;publish(snapshot);}
  }raf=requestAnimationFrame(draw);
 };raf=requestAnimationFrame(draw);
 return ()=>{disposed=true;cancelAnimationFrame(raf);};
}
export async function loadShootoutRuntime(host:HTMLElement,settings:Settings,pause:()=>void,onLost:()=>void,onRestored:()=>void):Promise<MatchRuntime>{
 await initializePhysics();
 const scene=new ShootoutScene(host,onLost,onRestored);
 try {await scene.load();const simulation=new ShootoutSimulation('shootout',1,1);return {scene,simulation,input:new ShootoutInput(pause),audio:new ShootoutAudio(settings),active:false,paused:false,accumulator:0,previous:null};}
 catch(error){scene.dispose();throw error;}
}
export function beginMatch(rt:MatchRuntime,level:number,seed:number,rules:MatchRules){
 rt.simulation.dispose();rt.simulation=new ShootoutSimulation('shootout',level,seed,rules);rt.input.setPaused(false);rt.input.setRole(rt.simulation.role);rt.input.style='driven';rt.previous=null;rt.accumulator=0;rt.paused=false;rt.active=true;rt.audio.reset();rt.audio.unlock();
}
export function pauseMatch(rt:MatchRuntime){rt.paused=true;rt.accumulator=0;rt.input.setPaused(true);rt.simulation.cancelInput();rt.audio.pause();}
export function disposeMatch(rt:MatchRuntime){rt.active=false;rt.input.dispose();rt.audio.dispose();rt.scene.dispose();rt.simulation.dispose();}
