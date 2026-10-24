/** Pure policy: gameplay/input timing never depends on graphics quality. */
export function chooseRenderProfile({quality='auto',coarse=false,dpr=1,lite=false}={}){
 const requested=['auto','performance','high'].includes(quality)?quality:'auto';
 const fast=lite||requested==='performance'||(requested==='auto'&&coarse);
 return {requested,fast,mobile:coarse,bloom:!fast,shadows:!fast,antialias:!fast,
  maxDpr:Math.min(Math.max(dpr,0.5),requested==='performance'?.8:fast?1:2),maxPixels:requested==='performance'?450000:fast?650000:Infinity,
  adaptive:requested!=='high'&&fast,minDpr:.65};
}
