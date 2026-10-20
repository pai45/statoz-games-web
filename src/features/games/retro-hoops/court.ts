/** Original code-drawn scenery reconstructed from observed Street Hoop park composition.
 * Palette/geometry are authored approximations; no background pixels or logos are copied.
 * Primary footage 62?85s: sea/sand, low brick wall, lawn spectators, paved walk,
 * grey asphalt, yellow arc and blue/orange paint. Exact native dimensions unknown.
 */
export function drawParkCourt(c:CanvasRenderingContext2D){
  c.imageSmoothingEnabled=false;
  const rect=(x:number,y:number,w:number,h:number,color:string)=>{c.fillStyle=color;c.fillRect(x,y,w,h);};
  rect(0,0,900,360,"#81817d");rect(0,0,900,30,"#9ed5d7");rect(0,18,900,9,"#4aabb9");rect(0,27,900,4,"#d9ece0");rect(0,31,900,37,"#eedba3");
  for(let x=0;x<900;x+=60){rect(x,23,31,2,"#b4e5e4");rect(x+18,51,17,2,"#dfc88f");}
  // Low warm brick wall, with separately articulated cap and mortar.
  rect(0,66,900,17,"#b77d52");rect(0,66,900,3,"#efc891");
  for(let y=70;y<82;y+=6){rect(0,y,900,1,"#e2b17d");for(let x=(y===70?0:13);x<900;x+=27)rect(x,y,1,6,"#e2b17d");}
  rect(0,83,900,59,"#529959");
  for(let x=0;x<900;x+=7){const y=85+(x*17%54);rect(x,y,2,2,"#78af68");rect(x+3,90+(x*11%48),1,3,"#337b48");}
  // Walkway, curb and sideline establish the same raised park/court layering.
  rect(0,142,900,17,"#b9b29e");rect(0,142,900,3,"#e2d7b7");rect(0,157,900,4,"#62685e");rect(0,161,900,3,"#d2c8ad");
  for(let x=0;x<900;x+=39)rect(x,145,1,12,"#999784");
  // Original small spectator silhouettes. They are not traced source sprites.
  function person(x:number,y:number,kit:string,sitting=false){const leg=sitting?8:14;rect(x-5,y+25,6,leg,"#a96d45");rect(x+3,y+25,6,leg,"#ce9460");rect(x-9,y+25+leg+2,23,2,"#566b51");rect(x-7,y+25+leg,9,3,"#263c42");rect(x+2,y+25+leg,10,3,"#263c42");rect(x-6,y+16,15,12,"#294b69");rect(x-7,y+4,16,16,kit);rect(x-4,y+2,10,5,kit);rect(x-2,y+3,5,3,"#d69a65");rect(x-4,y+10,2,9,"#e6d3a0");rect(x+6,y+10,2,9,"#e6d3a0");rect(x-10,y+5,4,14,"#d69a65");rect(x-9,y+18,6,3,"#d69a65");rect(x+9,y+5,4,14,"#c38757");rect(x+6,y+18,6,3,"#c38757");rect(x-4,y-8,10,12,"#dba06c");rect(x-5,y-10,11,4,"#43392e");rect(x+1,y-3,5,1,"#704d37");rect(x+3,y-5,2,2,"#343a33");rect(x+1,y+1,4,1,"#ae744c");}
  for(const x of[106,383,706]){rect(x,111,64,5,"#c3a16a");rect(x+3,118,60,5,"#bb955d");rect(x+8,123,4,15,"#5a6656");rect(x+52,123,4,15,"#5a6656");}
  const colors=["#c66b47","#d5c26a","#437f9c","#ca674b","#ded7ac","#446b83"];
  [72,139,219,302,405,474,561,639,734,822].forEach((x,i)=>person(x,97+(i%3)*4,colors[i%colors.length],i%3===1));
  // A few bags and parked bicycle shapes provide readable park detail.
  for(const x of[182,515,774]){rect(x,133,14,7,"#355b77");rect(x+2,131,9,2,"#c4bf9c");}
  c.strokeStyle="#d7c59b";c.lineWidth=2;
  for(const x of[258,675]){c.beginPath();c.ellipse(x,133,11,7,0,0,Math.PI*2);c.ellipse(x+31,133,11,7,0,0,Math.PI*2);c.moveTo(x,133);c.lineTo(x+15,117);c.lineTo(x+31,133);c.lineTo(x+9,133);c.lineTo(x+21,119);c.stroke();}
  function palm(x:number){for(let y=13;y<132;y+=5){rect(x+Math.floor((132-y)/30),y,10,5,"#8f9564");rect(x+Math.floor((132-y)/30)+2,y,3,2,"#d7d19a");}c.strokeStyle="#2e7449";c.lineWidth=5;for(const dx of[-52,-32,28,51]){c.beginPath();c.moveTo(x+10,18);c.quadraticCurveTo(x+dx/2,-9,x+dx,14);c.stroke();}rect(x+2,12,16,5,"#4c8a4b");}
  palm(331);palm(781);
  // Asphalt is deliberately quieter than the active sprites; seams stay low contrast.
  rect(0,164,900,196,"#858581");
  for(let y=172;y<360;y+=7)for(let x=(y%3)*4;x<900;x+=19)rect(x,y,2,1,(x+y)%4?"#8a8983":"#7d807d");
  c.lineWidth=2;c.strokeStyle="#f4e4bf";c.strokeRect(60,164,780,166);
  // Source-inspired broad blue lane and contrasting orange free-throw half circle.
  for(const left of[true,false]){const x=left?60:710;rect(x,207,130,80,"#5796ac");c.fillStyle="#c97b42";c.beginPath();c.ellipse(left?190:710,247,45,40,0,left?-Math.PI/2:Math.PI/2,left?Math.PI/2:Math.PI*1.5);c.fill();c.strokeStyle="#f2e4c8";c.strokeRect(x,207,130,80);c.beginPath();c.ellipse(left?190:710,247,45,40,0,0,Math.PI*2);c.stroke();c.strokeStyle="#e5c34d";c.beginPath();c.ellipse(left?60:840,247,255,100,0,left?-Math.PI/2:Math.PI/2,left?Math.PI/2:Math.PI*1.5);c.stroke();}
  c.strokeStyle="#eadbbd";c.beginPath();c.moveTo(450,164);c.lineTo(450,330);c.stroke();c.fillStyle="#5796ac";c.beginPath();c.ellipse(450,247,57,35,0,0,Math.PI*2);c.fill();c.fillStyle="#c97b42";c.beginPath();c.ellipse(450,247,57,35,0,Math.PI/2,Math.PI*1.5);c.fill();c.strokeStyle="#f2e4c8";c.beginPath();c.ellipse(450,247,57,35,0,0,Math.PI*2);c.moveTo(450,212);c.lineTo(450,282);c.stroke();
}
