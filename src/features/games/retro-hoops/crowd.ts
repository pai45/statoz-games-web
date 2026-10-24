/** Original spectator illustrations, with seated/standing silhouettes and varied clothes. */
export function drawHoopsCrowd(c:CanvasRenderingContext2D,frame:number){
 const hash=(n:number)=>{let x=Math.imul(n+31,1597334677);x^=x>>>16;return(x>>>0)/4294967296;};
 const rect=(x:number,y:number,w:number,h:number,fill:string)=>{c.fillStyle=fill;c.fillRect(Math.round(x),Math.round(y),w,h);};
 const poly=(points:number[][],fill:string,ink?:string)=>{c.beginPath();points.forEach((p,i)=>i?c.lineTo(Math.round(p[0]),Math.round(p[1])):c.moveTo(Math.round(p[0]),Math.round(p[1])));c.closePath();c.fillStyle=fill;c.fill();if(ink){c.strokeStyle=ink;c.lineWidth=1;c.stroke();}};
 rect(0,0,900,164,'#101714');
 for(let i=0;i<12;i++){const x=i*81;poly([[x,0],[x+75,0],[x+68,103],[x+12,110]],['#18231c','#26201c','#182825'][i%3]);rect(x+9,0,3,104,'#0d1713');rect(x+58,0,2,98,'#343b27');}
 for(const [x,color]of [[135,'#8b7a3022'],[470,'#5c6c3c22'],[765,'#b4773422']]as const)poly([[x,0],[x-65,126],[x+55,126]],color);
 const skin=['#b7804e','#8e593c','#d29f68','#9d703f','#c18b50'],shirts=['#3e514a','#625b45','#61504b','#293f43','#696044','#3f4142','#3e4532'],pants=['#293233','#35352c','#424544','#333126'];
 function person(x:number,y:number,id:number,seated:boolean,far:boolean){
  const h=hash(id),tone=skin[id%skin.length],cloth=shirts[(id*3+2)%shirts.length],trouser=pants[id%pants.length],ink='#0e1714',headX=x+(h-.5)*4,headY=y,lean=(hash(id+7)-.5)*5,jacket=id%3===0,cap=id%5===0;
  c.save();if(far)c.globalAlpha=.8;
  // Head/ear/jaw silhouette, dark hair and clustered brows, rather than square faces.
  poly([[headX-5,headY-7],[headX+3,headY-7],[headX+6,headY-3],[headX+5,headY+4],[headX+1,headY+7],[headX-4,headY+4],[headX-6,headY]],tone,ink);
  poly([[headX-5,headY-2],[headX-2,headY],[headX-2,headY+4],[headX+1,headY+6],[headX-4,headY+4]],'#6c4a30');
  poly([[headX-6,headY-3],[headX-5,headY-8],[headX+2,headY-9],[headX+6,headY-5],[headX+3,headY-3],[headX,headY-5]],cap?'#45564b':'#24251e',ink);
  if(cap)rect(headX-2,headY-4,10,2,'#596253');
  rect(headX-3,headY+1,2,1,ink);rect(headX+2,headY+1,2,1,ink);rect(headX-1,headY+4,3,1,'#4c3624');
  const shoulder=x+lean,hip=x-lean;
  poly([[shoulder-6,y+7],[shoulder+6,y+7],[shoulder+12,y+13],[hip+10,y+31],[hip-10,y+31],[shoulder-13,y+16]],cloth,ink);
  poly([[shoulder+5,y+9],[shoulder+11,y+14],[hip+8,y+28],[hip+3,y+29],[shoulder+3,y+16]],'#24342f');
  if(jacket){poly([[shoulder-6,y+8],[shoulder-2,y+14],[hip-2,y+29],[hip-8,y+29],[shoulder-10,y+15]],'#78816b');rect(shoulder-1,y+12,2,15,'#aaa27c');}
  else{rect(shoulder-5,y+10,7,2,'#8c8e6d');rect(shoulder-2,y+14,3,5,'#79856a');}
  if(seated){
   poly([[hip-9,y+28],[hip+7,y+29],[hip+18,y+39],[hip+10,y+45],[hip-4,y+36],[hip-15,y+41],[hip-21,y+36]],trouser,ink);
   poly([[hip-16,y+37],[hip-6,y+40],[hip-9,y+50],[hip-18,y+52],[hip-21,y+48]],trouser,ink);
   poly([[hip+9,y+39],[hip+17,y+40],[hip+14,y+49],[hip+3,y+52],[hip,y+48]],'#3d4944',ink);
   poly([[hip-18,y+48],[hip-8,y+48],[hip-6,y+52],[hip-22,y+53],[hip-24,y+51]],'#202826',ink);
   poly([[hip+5,y+47],[hip+14,y+47],[hip+18,y+51],[hip+16,y+53],[hip+1,y+53]],'#202826',ink);
   rect(hip-21,y+51,12,1,'#808575');rect(hip+3,y+51,12,1,'#808575');
  }else{
   poly([[hip-10,y+29],[hip+9,y+29],[hip+10,y+40],[hip+7,y+55],[hip+1,y+55],[hip-1,y+39],[hip-5,y+54],[hip-12,y+54]],trouser,ink);
   rect(hip-13,y+53,10,3,'#141e1b');rect(hip,y+54,11,3,'#141e1b');rect(hip-12,y+55,8,1,'#6d7768');
  }
  const cheering=id%7===0&&(frame+id)%4<2;
  if(cheering){poly([[shoulder-11,y+12],[shoulder-18,y+5],[shoulder-17,y-8],[shoulder-12,y-8],[shoulder-12,y+2],[shoulder-7,y+8]],cloth,ink);poly([[shoulder-17,y-8],[shoulder-17,y-14],[shoulder-13,y-17],[shoulder-10,y-12],[shoulder-12,y-7]],tone,ink);}
  else{poly([[shoulder-11,y+12],[shoulder-15,y+18],[hip-11,y+28],[hip-2,y+31],[hip+1,y+27],[hip-7,y+23],[shoulder-7,y+16]],cloth,ink);poly([[hip-7,y+24],[hip-1,y+25],[hip+3,y+29],[hip,y+32],[hip-6,y+30]],tone,ink);}
  poly([[shoulder+9,y+11],[shoulder+15,y+15],[hip+13,y+25],[hip+5,y+29],[hip+2,y+26],[hip+8,y+21],[shoulder+7,y+16]],cloth,ink);poly([[hip+7,y+24],[hip+12,y+23],[hip+12,y+28],[hip+5,y+31],[hip+2,y+28]],tone,ink);
  if(id%4===1){rect(shoulder+3,y+15,4,2,'#c3ac71');rect(shoulder+4,y+17,2,2,'#8e986d');}
  c.restore();
 }
 // Sparse back row, taller middle silhouettes, and a deliberately seated front row.
 for(let i=0;i<24;i++)person(i*40+12,30+Math.round(hash(i)*9),i+30,false,true);
 for(let i=0;i<23;i++)person(i*42+29,62+Math.round(hash(i+20)*6),i+61,false,false);
 for(let i=0;i<23;i++)person(i*42+10,104+Math.round(hash(i+52)*3),i+103,true,false);
 rect(0,159,900,4,'#1d2720');rect(0,162,900,2,'#9c9e84');
 // One exhibition DJ booth, with an original fictional sign, not two cloned desks.
 for(const x of [357,516]){rect(x,92,24,62,'#121d1b');rect(x+3,96,18,25,'#293832');rect(x+4,125,16,24,'#293832');for(const y of [108,137]){c.strokeStyle='#718071';c.lineWidth=2;c.beginPath();c.arc(x+12,y,7,0,Math.PI*2);c.stroke();rect(x+10,y-2,4,4,'#121c17');}}
 rect(384,99,125,51,'#123b46');poly([[384,99],[509,99],[503,107],[388,107]],'#82948b');rect(390,113,112,25,'#26352f');c.fillStyle='#d7c49b';c.font='bold 11px monospace';c.fillText('COURT SESSION',394,129);
 person(443,62,5,false,false);rect(394,98,102,5,'#9e9b80');rect(402,95,26,3,'#26342d');rect(458,95,29,3,'#26342d');rect(432,94,18,4,'#18251f');
}
