import {courtPoint} from "./view";
import type {CharacterAnchors} from "./presentation";
import type {Match} from './simulation';
/** Original articulated grip overlay. The authoritative ball drives its endpoint.
 * Body/arm layers share foot origin (72,116); no outcome is computed here. */
export function drawContactArm(canvas:HTMLCanvasElement,s:Match,rig?:CharacterAnchors){
 if(canvas.width!==90||canvas.height!==80){canvas.width=90;canvas.height=80;}
 const a=s.ball.owner===null?null:s.actors[s.ball.owner],c=canvas.getContext('2d')!;c.clearRect(0,0,90,80);
 if(!a||!['shoot','pass','dunk','fake','receive'].includes(a.action))return null;
 c.imageSmoothingEnabled=false;c.save();if(a.face===-1){c.translate(90,0);c.scale(-1,1);}
 const ground=courtPoint(a.x,a.y,a.z),ball=courtPoint(s.ball.x,s.ball.y,s.ball.z);
 const shoulder={x:rig?.shoulders?.[0]?(a.face===1?rig.shoulders[0][0]:144-rig.shoulders[0][0]):67,y:rig?.shoulders?.[0]?.[1]??47},wrist={x:72+(ball.x-ground.x)/ground.scale*a.face,y:116+(ball.y-ground.y)/ground.scale};
 const dx=wrist.x-shoulder.x,dy=wrist.y-shoulder.y,d=Math.max(.01,Math.hypot(dx,dy)),reach=Math.max(1.1,Math.min(d,40.9)),u=(21*21-20*20+reach*reach)/(2*reach),h=Math.sqrt(Math.max(0,21*21-u*u));
 const bend=wrist.y<shoulder.y+12?(wrist.x>=shoulder.x?1:-1):(wrist.x>=shoulder.x?-1:1);
 const elbow={x:shoulder.x+dx/d*u-dy/d*h*bend,y:shoulder.y+dy/d*u+dx/d*h*bend};
 const skin=a.team===0?["#6c341b","#bb6120","#ef9a36","#ffd270"]:["#754125","#c87937","#f3b266","#ffe0a0"];
 const polygon=(points:number[][],fill:string,outline=false)=>{
  c.fillStyle=fill;c.beginPath();points.forEach((v,i)=>i?c.lineTo(Math.round(v[0]*.625),Math.round(v[1]*.625)):c.moveTo(Math.round(v[0]*.625),Math.round(v[1]*.625)));c.closePath();c.fill();
  if(outline){c.strokeStyle=skin[0];c.lineWidth=1;c.stroke();}
 };
 // V10: same slender joint widths and broad, quiet light clusters as the authored rig.
 const segment=(p:{x:number;y:number},q:{x:number;y:number},wa:number,wb:number)=>{
  const dx=q.x-p.x,dy=q.y-p.y,l=Math.max(.01,Math.hypot(dx,dy)),nx=-dy/l,ny=dx/l;
  const at=(t:number,w:number)=>[p.x+dx*t+nx*w,p.y+dy*t+ny*w];
  polygon([at(0,wa*.44),at(.28,wa*.5),at(.8,wb*.48),at(1,wb*.4),at(1,-wb*.4),at(.65,-wb*.46),at(.16,-wa*.46)],skin[2],true);
  polygon([at(.08,wa*.22),at(.32,wa*.43),at(.82,wb*.4),at(.98,wb*.12),at(.68,wb*.07),at(.25,0)],skin[0]);
  polygon([at(.16,-wa*.23),at(.32,-wa*.35),at(.66,-wb*.3),at(.78,-wb*.12),at(.35,-wa*.06)],skin[3]);
 };
 segment(shoulder,elbow,9,7);c.fillStyle=skin[2];c.beginPath();c.ellipse(Math.round(elbow.x*.625),Math.round(elbow.y*.625),2,1.5,0,0,Math.PI*2);c.fill();segment(elbow,wrist,7,4.5);
 if(a.team===1){const cuff={x:shoulder.x+(elbow.x-shoulder.x)*.42,y:shoulder.y+(elbow.y-shoulder.y)*.42};const dx=cuff.x-shoulder.x,dy=cuff.y-shoulder.y,l=Math.max(1,Math.hypot(dx,dy)),nx=-dy/l,ny=dx/l;polygon([[shoulder.x+nx*5.5,shoulder.y+ny*5.5],[cuff.x+nx*4.5,cuff.y+ny*4.5],[cuff.x-nx*4.5,cuff.y-ny*4.5],[shoulder.x-nx*5.5,shoulder.y-ny*5.5]],"#ede8d3",true);}
 polygon([[wrist.x-3,wrist.y-2],[wrist.x,wrist.y-3],[wrist.x+3,wrist.y-1],[wrist.x+3,wrist.y+2],[wrist.x+1,wrist.y+4],[wrist.x-2,wrist.y+3]],skin[2],true);
 c.fillStyle=skin[3];c.fillRect(Math.round(wrist.x*.625),Math.round(wrist.y*.625)-1,1,1);c.restore();
 const pixels=c.getImageData(0,0,90,80);for(let i=3;i<pixels.data.length;i+=4)pixels.data[i]=pixels.data[i]>=128?255:0;c.putImageData(pixels,0,0);
 return {actor:a.id,wrist:{x:wrist.x,y:wrist.y},shoulder};
}
