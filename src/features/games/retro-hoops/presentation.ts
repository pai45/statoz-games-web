import {REFERENCE_TUNING as T} from "./reference-tuning";
import {courtPoint,cameraOrigin} from "./view";
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
  else if(a.action==="pass")pose=age<T.passGatherTicks?"p-pass-gather-left":"p-pass-extend-left";
  else if(has&&a.z>0)pose="a-overhead";
  else if(a.action==="receive")pose=a.z>0?"a-overhead":has?(s.ball.age<6?"s-ready":"carry-front"):age<6?"land-recover":"neutral-a";
  else if(has)pose=(a.moving||(a.dribbleTick??-1)>=0)?`dribble-body-${String(a.moving?gaitFrame(a.travel??0):0).padStart(2,"0")}`:"carry-front";
  else if(a.action==="idle"){
    const travel=a.travel??a.id*7,mark=a.intent?.mark===undefined?undefined:s.actors[a.intent.mark],marking=!!mark&&(a.intent?.role==="mark"||a.intent?.role==="pressure")&&Math.hypot(mark.x-a.x,mark.y-a.y)<120,defending=marking||(s.ball.owner!==null&&s.actors[s.ball.owner].team!==a.team&&Math.hypot(s.ball.x-a.x,s.ball.y-a.y)<180);
    if(a.turnedAt!==undefined&&s.tick-a.turnedAt<8)pose=`pivot-${String(Math.floor((s.tick-a.turnedAt)/2)).padStart(2,"0")}`;
    else if(a.moving&&defending&&(a.moveX??0)*a.face<-.1)pose=`backpedal-${String(defenseFrame(travel)).padStart(2,"0")}`;
    else if(a.moving)pose=defending?`defend-${String(defenseFrame(travel)).padStart(2,"0")}`:`run-${String(gaitFrame(travel)).padStart(2,"0")}`;
    else if(a.lastMoved!==undefined&&s.tick-a.lastMoved<8)pose=`brake-${String(Math.floor((s.tick-a.lastMoved)/2)).padStart(2,"0")}`;
    else pose=defending?"defend-00":Math.floor((s.tick+a.id*11)/24)%2?"neutral-a":"neutral-b";
  }
  return `${a.team===0?"navy":"amber"}-${pose}-${a.face===1?"source":"mirrored"}`;
}
export function overlayFor(s:Match,a:Actor){
  if(s.ball.owner!==a.id||a.action!=="idle"||(!a.moving&&(a.dribbleTick??-1)<0))return null;
  const phase=((a.dribbleTick??0)%18+18)%18,blend=(a.dribbleFacing??a.face)/a.face,switching=blend<1,frame=switching?phase*4+Math.max(0,Math.min(3,Math.round((blend+1)*2))):phase;
  return {key:`${a.team===0?"navy":"amber"}-${switching?"dribble-switch":"dribble-arm"}-${String(frame).padStart(2,"0")}-${a.face===1?"source":"mirrored"}`,y:bodyBob(a.moving?(a.travel??0):0)};
}
export function courtCanvas(frame=0) {
  const canvas=document.createElement("canvas");canvas.width=900;canvas.height=360;
  drawParkCourt(canvas.getContext("2d")!,frame);
  return canvas;
}
export function drawCanvas(c:CanvasRenderingContext2D,s:Match,p:Pictures,debug=false) {
  const width=c.canvas.width,cam=cameraOrigin(s,width);c.imageSmoothingEnabled=false;c.clearRect(0,0,width,360);
  c.drawImage(p["court-"+(Math.floor(s.tick/T.crowdFrameTicks)%T.crowdFrames)]??p.court, -cam,0);
  const rows=s.actors.map(a=>({y:a.y,kind:"actor",a}));
  rows.push({y:s.ball.y+.1,kind:"ball",a:s.actors[0]});
  for(const row of rows.sort((a,b)=>a.y-b.y)) {
    if(row.kind==="ball"){const p0=courtPoint(s.ball.x,s.ball.y),p1=courtPoint(s.ball.x,s.ball.y,s.ball.z);c.fillStyle="#0007";c.beginPath();c.ellipse(p0.x-cam,p0.y,6*p0.scale,2*p0.scale,0,0,Math.PI*2);c.fill();c.drawImage(p.ball,Math.round(p1.x-cam-5.5*p1.scale),Math.round(p1.y-5.5*p1.scale),11*p1.scale,11*p1.scale);continue;}
    const a=row.a,p0=courtPoint(a.x,a.y,a.z),scale=p0.scale,x=Math.round(p0.x-cam),y=Math.round(p0.y);
    c.fillStyle="#0005";c.beginPath();c.ellipse(x,a.y,17*scale,4*scale,0,0,Math.PI*2);c.fill();
    if(a.id===s.selected){c.save();c.translate(x,y);c.scale(scale,scale);c.font="bold 10px monospace";c.textAlign="center";c.fillStyle="#191810";c.fillText("1P",1,-121);c.fillStyle="#ef3c27";c.fillText("1P",0,-122);c.beginPath();c.moveTo(-4,-120);c.lineTo(4,-120);c.lineTo(0,-116);c.fill();c.restore();}
    c.drawImage(p[poseFor(s,a)],x-72*scale,y-116*scale,144*scale,128*scale);
    const overlay=overlayFor(s,a);if(overlay)c.drawImage(p[overlay.key],x-72*scale,y+(-116+overlay.y)*scale,144*scale,128*scale);
    if(debug){c.strokeStyle="#51ff94";c.strokeRect(x-13*scale,a.y-8*scale,26*scale,16*scale);c.font="9px monospace";c.fillStyle="white";c.fillText(a.id+" "+a.action,x-20,y-120*scale);const hand=anchor(a),hp=courtPoint(hand.x,hand.y,hand.z);c.fillRect(hp.x-cam-2,hp.y-2,4,4);}
  }
  for(const [key,x,offset,w] of [["left",85,31,47],["right",815,13,92]] as const){const p0=courtPoint(x,COURT.rimY);c.drawImage(p[key],p0.x-cam-offset*p0.scale,p0.y-(COURT.rimZ+48)*p0.scale,w*p0.scale,75*p0.scale);}

}
export async function loadPictures(base:string,signal:AbortSignal):Promise<Pictures> {
  const names=POSES.flatMap(p=>["navy","amber"].flatMap(team=>["source","mirrored"].map(f=>`${team}-${p}-${f}`)));
  names.push("ball","left","right");
  const locomotion=Object.entries(LOCOMOTION_CLIPS).flatMap(([clip,count])=>Array.from({length:count},(_,i)=>["navy","amber"].flatMap(team=>["source","mirrored"].map(f=>`${team}-${clip}-${String(i).padStart(2,"0")}-${f}`)))).flat();
  names.push(...locomotion);const newNames=new Set(locomotion);
  const result:Pictures={};
  await Promise.all(names.map(async name=>{
    const response=await fetch(`${base}/${newNames.has(name)?"../locomotion-v4/":"../player-look-v1/"}${name}.png`,{signal});if(!response.ok)throw Error(`Cannot load ${name}`);
    const blob=await response.blob();if(signal.aborted)throw new DOMException("Cancelled","AbortError");
    const url=URL.createObjectURL(blob),img=new Image();
    try{img.src=url;await img.decode();if(signal.aborted)throw new DOMException("Cancelled","AbortError");result[name]=img;}finally{URL.revokeObjectURL(url);}
  }));
  for(let frame=0;frame<T.crowdFrames;frame++){const canvas=courtCanvas(frame),img=new Image();img.src=canvas.toDataURL();await img.decode();result["court-"+frame]=img;}result.court=result["court-0"];return result;
}
