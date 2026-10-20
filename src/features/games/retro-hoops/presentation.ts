import {drawParkCourt} from "./court";
import {gaitFrame,bodyBob,defenseFrame,LOCOMOTION_CLIPS} from "./motion";
import { anchor, COURT, type Actor, type Match } from "./simulation";

export type Pictures = Record<string, HTMLImageElement>;
export const POSES = ["d-push","d-low","d-down","s-ready","s-rise","s-release","s-follow","p-pass-gather-left","p-pass-extend-left","a-reach","a-overhead","carry-low","carry-front","dunk-gather","dunk-contact","land-recover","neutral-a","neutral-b"];
export function poseFor(s:Match,a:Actor) {
  let pose="s-ready";
  const age=s.tick-a.started,has=s.ball.owner===a.id;
  if(a.action==="shoot")pose=age<10?"s-ready":age<22?"s-rise":age<26?"s-release":"s-follow";
  else if(a.action==="dunk")pose=!has?(a.z>20?"dunk-contact":"land-recover"):a.z===0&&age>6?"neutral-a":age<15?"dunk-gather":"dunk-contact";
  else if(a.action==="block")pose=a.z>16?"a-overhead":age>20?"land-recover":"a-reach";
  else if(a.action==="steal"||a.action==="gather")pose="d-low";
  else if(a.action==="recoil")pose=age<8?"d-low":age<16?"neutral-b":"neutral-a";
  else if(a.action==="pass")pose=age<12?"p-pass-gather-left":"p-pass-extend-left";
  else if(has&&a.z>0)pose="a-overhead";
  else if(a.action==="receive")pose=a.z>0?"a-overhead":has?(s.ball.age<6?"s-ready":"carry-front"):age<6?"land-recover":"neutral-a";
  else if(has)pose=(a.moving||(a.dribbleTick??-1)>=0)?`dribble-body-${String(a.moving?gaitFrame(a.travel??0):0).padStart(2,"0")}`:"carry-front";
  else if(a.action==="idle"){
    const travel=a.travel??a.id*7,defending=s.ball.owner!==null&&s.actors[s.ball.owner].team!==a.team&&Math.hypot(s.ball.x-a.x,s.ball.y-a.y)<180;
    if(a.moving)pose=defending?`defend-${String(defenseFrame(travel)).padStart(2,"0")}`:`run-${String(gaitFrame(travel)).padStart(2,"0")}`;
    else if(a.lastMoved!==undefined&&s.tick-a.lastMoved<8)pose=`brake-${String(Math.floor((s.tick-a.lastMoved)/2)).padStart(2,"0")}`;
    else pose=defending?"defend-00":Math.floor((s.tick+a.id*11)/24)%2?"neutral-a":"neutral-b";
  }
  return `${a.team===0?"navy":"amber"}-${pose}-${a.face===1?"source":"mirrored"}`;
}
export function overlayFor(s:Match,a:Actor){
  if(s.ball.owner!==a.id||a.action!=="idle"||(!a.moving&&(a.dribbleTick??-1)<0))return null;
  return {key:`${a.team===0?"navy":"amber"}-dribble-arm-${String(((a.dribbleTick??0)%18+18)%18).padStart(2,"0")}-${a.face===1?"source":"mirrored"}`,y:bodyBob(a.moving?(a.travel??0):0)};
}
export function courtCanvas() {
  const canvas=document.createElement("canvas");canvas.width=900;canvas.height=360;
  drawParkCourt(canvas.getContext("2d")!);
  return canvas;
}
export function drawCanvas(c:CanvasRenderingContext2D,s:Match,p:Pictures,debug=false) {
  const width=c.canvas.width,cam=Math.max(0,Math.min(900-width,Math.round(s.camera+(480-width)/2)));c.imageSmoothingEnabled=false;c.clearRect(0,0,width,360);
  c.drawImage(p.court, -cam,0);
  const rows=s.actors.map(a=>({y:a.y,kind:"actor",a}));
  rows.push({y:s.ball.y+.1,kind:"ball",a:s.actors[0]});
  for(const row of rows.sort((a,b)=>a.y-b.y)) {
    if(row.kind==="ball"){c.fillStyle="#0007";c.beginPath();c.ellipse(s.ball.x-cam,s.ball.y,6,2,0,0,Math.PI*2);c.fill();c.drawImage(p.ball,Math.round(s.ball.x-cam-5.5),Math.round(s.ball.y-s.ball.z-5.5));continue;}
    const a=row.a,x=Math.round(a.x-cam),y=Math.round(a.y-a.z);
    c.fillStyle="#0005";c.beginPath();c.ellipse(x,a.y,17,4,0,0,Math.PI*2);c.fill();
    if(a.id===s.selected){c.strokeStyle="#5cdfff";c.lineWidth=2;c.beginPath();c.ellipse(x,a.y+1,20,6,0,0,Math.PI*2);c.stroke();}
    c.drawImage(p[poseFor(s,a)],x-72,y-116);
    const overlay=overlayFor(s,a);if(overlay)c.drawImage(p[overlay.key],x-72,y-116+overlay.y);
    if(debug){c.strokeStyle="#51ff94";c.strokeRect(x-13,a.y-8,26,16);c.font="9px monospace";c.fillStyle="white";c.fillText(`${a.id} ${a.action}`,x-20,y-120);const hand=anchor(a);c.fillRect(hand.x-cam-2,hand.y-hand.z-2,4,4);}
  }
  c.drawImage(p.left,85-cam-31,COURT.rimY-COURT.rimZ-48);
  c.drawImage(p.right,815-cam-13,COURT.rimY-COURT.rimZ-48);
}
export async function loadPictures(base:string,signal:AbortSignal):Promise<Pictures> {
  const names=POSES.flatMap(p=>["navy","amber"].flatMap(team=>["source","mirrored"].map(f=>`${team}-${p}-${f}`)));
  names.push("ball","left","right");
  const locomotion=Object.entries(LOCOMOTION_CLIPS).flatMap(([clip,count])=>Array.from({length:count},(_,i)=>["navy","amber"].flatMap(team=>["source","mirrored"].map(f=>`${team}-${clip}-${String(i).padStart(2,"0")}-${f}`)))).flat();
  names.push(...locomotion);const newNames=new Set(locomotion);
  const result:Pictures={};
  await Promise.all(names.map(async name=>{
    const response=await fetch(`${base}/${newNames.has(name)?"../locomotion-v2/":""}${name}.png`,{signal});if(!response.ok)throw Error(`Cannot load ${name}`);
    const blob=await response.blob();if(signal.aborted)throw new DOMException("Cancelled","AbortError");
    const url=URL.createObjectURL(blob),img=new Image();
    try{img.src=url;await img.decode();if(signal.aborted)throw new DOMException("Cancelled","AbortError");result[name]=img;}finally{URL.revokeObjectURL(url);}
  }));
  const canvas=courtCanvas(),img=new Image();img.src=canvas.toDataURL();await img.decode();result.court=img;return result;
}
