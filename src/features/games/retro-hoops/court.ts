import {drawHoopsCrowd} from "./crowd";
import {THREE_POINT_ARC} from "./simulation";
import {courtPoint} from "./view";
/** Original reconstruction of the user's GameLog exhibition venue.
 * Dense spectators, dark banners, scaffold supports and unpainted court are observed;
 * all scenery is code-drawn and timings/proportions remain authored adaptations. */
export function drawParkCourt(c:CanvasRenderingContext2D,frame=0){
  c.imageSmoothingEnabled=false;
  const rect=(x:number,y:number,w:number,h:number,color:string)=>{c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),w,h);};
  rect(0,0,900,360,"#4a4c43");drawHoopsCrowd(c,frame);
  // Scaffold towers sit behind the baskets and do not alter legal ball/rim anchors.
  for(const x of [68,808]){c.lineWidth=3;c.strokeStyle="#b0b19d";c.beginPath();c.moveTo(x,12);c.lineTo(x,161);c.moveTo(x+25,12);c.lineTo(x+25,161);for(let y=18;y<150;y+=28){c.moveTo(x,y);c.lineTo(x+25,y);c.lineTo(x,y+28);c.moveTo(x+25,y);c.lineTo(x+25,y+28);}c.stroke();rect(x-3,12,5,5,"#e3dfc5");rect(x+23,12,5,5,"#e3dfc5");}
  for(const x of [40,130,773,856]){rect(x,149,7,7,"#c17832");rect(x+3,149,1,7,"#563a22");rect(x,152,7,1,"#563a22");}
  rect(0,164,900,196,"#505248");
  for(let i=0;i<7200;i++){const x=(Math.imul(i+13,15485863)>>>0)%900,y=165+(Math.imul(i+41,32452843)>>>0)%195;rect(x,y,i%13===0?2:1,1,i%3?"#56584d":"#494c43");}
  // Project all court markings through the same ground plane as actors and ball.
  const path=(points:{x:number;y:number}[],color:string,fill=false,close=false)=>{c.beginPath();points.forEach((p,i)=>{const q=courtPoint(p.x,p.y);if(i===0)c.moveTo(q.x,q.y);else c.lineTo(q.x,q.y);});if(close)c.closePath();if(fill){c.fillStyle=color;c.fill();}else{c.strokeStyle=color;c.stroke();}};
  const box=(x:number,y:number,w:number,h:number,color:string,fill=false)=>path([{x,y},{x:x+w,y},{x:x+w,y:y+h},{x,y:y+h}],color,fill,true);
  const arc=(x:number,y:number,rx:number,ry:number,start=0,end=Math.PI*2)=>Array.from({length:65},(_,i)=>({x:x+Math.cos(start+(end-start)*i/64)*rx,y:y+Math.sin(start+(end-start)*i/64)*ry}));
  c.save();c.beginPath();[{x:60,y:164},{x:840,y:164},{x:840,y:330},{x:60,y:330}].forEach((p,i)=>{const q=courtPoint(p.x,p.y);if(i===0)c.moveTo(q.x,q.y);else c.lineTo(q.x,q.y);});c.closePath();c.clip();
  c.lineWidth=2;
  for(const left of [true,false]){const x=left?60:710,center=left?190:710;

    box(x,207,130,80,"#bfc0a0");path(arc(center,247,45,40),"#bfc0a0");
    path(arc(left?60:840,247,THREE_POINT_ARC.xRadius,THREE_POINT_ARC.yRadius,left?-Math.PI/2:Math.PI/2,left?Math.PI/2:Math.PI*1.5),"#b6b895");
  }
  path([{x:450,y:164},{x:450,y:330}],"#bfc0a0");

  path(arc(450,247,57,35),"#bfc0a0");
  path([{x:450,y:212},{x:450,y:282}],"#bfc0a0");
  c.restore();box(60,164,780,166,"#bfc0a0");
}
