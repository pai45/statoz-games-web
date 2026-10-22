import {THREE_POINT_ARC} from "./simulation";
import {courtPoint} from "./view";
/** Original reconstruction of the user's GameLog exhibition venue.
 * Dense spectators, dark banners, scaffold supports and unpainted court are observed;
 * all scenery is code-drawn and timings/proportions remain authored adaptations. */
export function drawParkCourt(c:CanvasRenderingContext2D,frame=0){
  c.imageSmoothingEnabled=false;
  const rect=(x:number,y:number,w:number,h:number,color:string)=>{c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),w,h);};
  rect(0,0,900,360,"#4a4c43");rect(0,0,900,161,"#151914");
  // Dark draped exhibition backdrop and warm spotlight pools, rather than beach scenery.
  for(let x=0;x<900;x+=96){const colors=["#252b20","#35261d","#20302c"];rect(x,0,86,78,colors[Math.floor(x/96)%3]);rect(x+8,0,2,78,"#41432a");rect(x+70,0,3,78,"#101510");c.fillStyle="#6b593333";c.beginPath();c.moveTo(x+30,0);c.lineTo(x-18,125);c.lineTo(x+83,125);c.closePath();c.fill();}
  function person(x:number,y:number,i:number,seated:boolean){
    const skin=["#bc8554","#875636","#d2a16b"][i%3],shirt=["#756543","#3b4a44","#5f514b","#40403c"][i%4],wave=(frame+i)%4===0;
    rect(x-9,y+35,21,3,"#161b16");rect(x-7,y+21,6,seated?12:18,"#292b25");rect(x+3,y+21,6,seated?12:18,"#30352a");rect(x-10,y+32,10,4,"#111713");rect(x+2,y+32,10,4,"#121813");
    rect(x-8,y+5,18,19,shirt);rect(x-5,y+2,12,8,shirt);rect(x-4,y-8,10,13,skin);rect(x-5,y-10,11,4,"#191c16");rect(x-3,y-2,2,2,"#24241b");rect(x+3,y-2,2,2,"#24241b");rect(x-2,y+2,6,1,"#64412c");rect(x-7,y+9,3,12,"#9b7d55");rect(x+7,y+7,4,14,skin);
    if(wave){rect(x-13,y-4,4,17,skin);rect(x-14,y-8,5,5,skin);rect(x-10,y+6,4,7,shirt);}else{rect(x-11,y+8,4,15,skin);rect(x-9,y+20,7,3,skin);}
    if(seated){rect(x-9,y+22,12,5,"#575747");rect(x+4,y+22,11,5,"#5a5949");}rect(x-7,y+24,4,2,"#968057");
  }
  // Alternating rows and irregular spacing prevent a repeated cardboard crowd.
  for(let row=0;row<3;row++)for(let x=18+row%2*17;x<900;x+=34)person(x,44+row*32,Math.floor(x/34)+row*7,row===2);
  rect(0,151,900,10,"#30362c");rect(0,159,900,3,"#b3b397");
  // Original DJ desk and speaker stacks; no reference logos or text are copied.
  for(const x of [350,650]){rect(x,94,66,45,"#233d49");rect(x+2,97,62,3,"#a7a48b");rect(x+5,109,55,17,"#3a3430");c.fillStyle="#d4c39b";c.font="bold 10px monospace";c.fillText("STREET MIX",x+5,122);rect(x-19,90,14,49,"#1c211c");rect(x+72,90,14,49,"#1c211c");for(const xx of [x-17,x+74]){rect(xx,98,10,12,"#363d30");rect(xx,118,10,12,"#363d30");}person(x+32,66,3,false);rect(x+10,91,45,4,"#9b9b7e");}
  // Scaffold towers sit behind the baskets and do not alter legal ball/rim anchors.
  for(const x of [68,808]){c.lineWidth=3;c.strokeStyle="#b0b19d";c.beginPath();c.moveTo(x,12);c.lineTo(x,161);c.moveTo(x+25,12);c.lineTo(x+25,161);for(let y=18;y<150;y+=28){c.moveTo(x,y);c.lineTo(x+25,y);c.lineTo(x,y+28);c.moveTo(x+25,y);c.lineTo(x+25,y+28);}c.stroke();rect(x-3,12,5,5,"#e3dfc5");rect(x+23,12,5,5,"#e3dfc5");}
  for(const x of [40,130,773,856]){rect(x,149,7,7,"#c17832");rect(x+3,149,1,7,"#563a22");rect(x,152,7,1,"#563a22");}
  rect(0,164,900,196,"#505248");
  for(let y=165;y<360;y+=3)for(let x=(y%7)*2;x<900;x+=13)rect(x,y,1,1,(x+y)%3?"#55574b":"#494d43");
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
