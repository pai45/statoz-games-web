/** Authored motion tuning, not measured native Street Hoop timing. */
export const DRIBBLE_TICKS=18;
export function dribbleSample(tick:number){
  const phase=((tick%DRIBBLE_TICKS)+DRIBBLE_TICKS)%DRIBBLE_TICKS;
  const index=Math.floor(phase/6),t=(phase%6)/6,ease=t*t*(3-2*t),offsets=[-12,8,-20,-12];
  return {frame:index,x:offsets[index]+(offsets[index+1]-offsets[index])*ease,z:6+30*Math.abs(1-phase/9),contact:phase===9};
}
export function gaitFrame(distance:number){return Math.floor(Math.max(0,distance)/10.8)%3;}
