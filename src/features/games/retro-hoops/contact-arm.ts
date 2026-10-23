import {courtPoint} from "./view";
import type {CharacterAnchors} from "./presentation";
import type {Match} from './simulation';
/** Original articulated grip overlay. The authoritative ball drives its endpoint.
 * Body/arm layers share foot origin (72,116); no outcome is computed here. */
export function drawContactArm(canvas:HTMLCanvasElement,s:Match,rig?:CharacterAnchors){
 const a=s.ball.owner===null?null:s.actors[s.ball.owner],c=canvas.getContext('2d')!;c.clearRect(0,0,144,128);
 if(!a||!['shoot','pass','dunk','fake','receive'].includes(a.action))return null;
 c.imageSmoothingEnabled=false;c.save();if(a.face===-1){c.translate(144,0);c.scale(-1,1);}
 const ground=courtPoint(a.x,a.y,a.z),ball=courtPoint(s.ball.x,s.ball.y,s.ball.z);
 const shoulder={x:rig?.shoulders?.[0]?(a.face===1?rig.shoulders[0][0]:144-rig.shoulders[0][0]):67,y:rig?.shoulders?.[0]?.[1]??47},wrist={x:72+(ball.x-ground.x)/ground.scale*a.face,y:116+(ball.y-ground.y)/ground.scale};
 const dx=wrist.x-shoulder.x,dy=wrist.y-shoulder.y,d=Math.max(.01,Math.hypot(dx,dy)),reach=Math.min(d,43.9),u=reach/2,h=Math.sqrt(Math.max(0,22*22-u*u));
 const bend=wrist.y<shoulder.y+12?(wrist.x>=shoulder.x?1:-1):(wrist.x>=shoulder.x?-1:1);
 const elbow={x:shoulder.x+dx/d*u-dy/d*h*bend,y:shoulder.y+dy/d*u+dx/d*h*bend};
 const skin=a.team===0?["#59351f","#a66431","#d9924c","#f8c679"]:["#6d4028","#b67b49","#e9ac72","#ffdb9b"];
 const polygon=(points:number[][],fill:string,outline=false)=>{
  c.fillStyle=fill;c.beginPath();points.forEach((v,i)=>i?c.lineTo(Math.round(v[0]),Math.round(v[1])):c.moveTo(Math.round(v[0]),Math.round(v[1])));c.closePath();c.fill();
  if(outline){c.strokeStyle=skin[0];c.lineWidth=1;c.stroke();}
 };
 // Match the authored atlas's tapered muscle belly and flat light clusters.
 const segment=(p:{x:number;y:number},q:{x:number;y:number},wa:number,wb:number)=>{
  const dx=q.x-p.x,dy=q.y-p.y,l=Math.max(.01,Math.hypot(dx,dy)),nx=-dy/l,ny=dx/l;
  const at=(t:number,w:number)=>[p.x+dx*t+nx*w,p.y+dy*t+ny*w];
  polygon([at(0,wa/2),at(.4,Math.max(wa,wb)*.56),at(1,wb/2),at(1,-wb/2),at(.4,-Math.max(wa,wb)*.5),at(0,-wa/2)],skin[2],true);
  polygon([at(0,wa*.3),at(.4,Math.max(wa,wb)*.4),at(1,wb*.24),at(.8,0),at(.18,0)],skin[1]);
  const p1=at(.17,-wa*.19),p2=at(.65,-wb*.2);c.strokeStyle=skin[3];c.lineWidth=2;c.beginPath();c.moveTo(Math.round(p1[0]),Math.round(p1[1]));c.lineTo(Math.round(p2[0]),Math.round(p2[1]));c.stroke();
 };
 segment(shoulder,elbow,12,9);c.fillStyle=skin[2];c.beginPath();c.ellipse(Math.round(elbow.x),Math.round(elbow.y),4,3,0,0,Math.PI*2);c.fill();segment(elbow,wrist,9,5);
 if(a.team===1){const cuff={x:shoulder.x+(elbow.x-shoulder.x)*.4,y:shoulder.y+(elbow.y-shoulder.y)*.4};const dx=cuff.x-shoulder.x,dy=cuff.y-shoulder.y,l=Math.max(1,Math.hypot(dx,dy)),nx=-dy/l,ny=dx/l;polygon([[shoulder.x+nx*6.5,shoulder.y+ny*6.5],[cuff.x+nx*5.5,cuff.y+ny*5.5],[cuff.x-nx*5.5,cuff.y-ny*5.5],[shoulder.x-nx*6.5,shoulder.y-ny*6.5]],"#e9e3ce",true);}
 polygon([[wrist.x-3,wrist.y-2],[wrist.x,wrist.y-3],[wrist.x+3,wrist.y-1],[wrist.x+3,wrist.y+2],[wrist.x+1,wrist.y+4],[wrist.x-2,wrist.y+3]],skin[2],true);
 c.fillStyle=skin[3];c.fillRect(Math.round(wrist.x),Math.round(wrist.y)-1,2,1);c.restore();
 return {actor:a.id,wrist:{x:wrist.x,y:wrist.y},shoulder};
}
