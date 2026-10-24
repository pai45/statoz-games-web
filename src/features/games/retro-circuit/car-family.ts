/**
 * Original APEXBREAK car family, revision 1 (2026-10-23).
 * Editable scanline pixel construction. No commercial sprite pixels, masks,
 * traced contours, fonts or logos are incorporated. Reference observations:
 * low rear camera; visible tyre contacts; strong vehicle colour identities;
 * readable flank views. All dimensions, details and holds below are designed.
 */
export type CarId = 'vector' | 'comet' | 'kestrel' | 'nomad';
export type CarPose = 'straight' | 'left' | 'right' | 'brake' | 'boost' | 'contact';
export type PixelRect = {x:number;y:number;width:number;height:number;color:string};
export const carIds:readonly CarId[] = ['vector','comet','kestrel','nomad'];
export const poses:readonly CarPose[] = ['straight','left','right','brake','boost','contact'];
export const carPaint = {
  vector:{light:'#f1ece7',body:'#c7c1c9',shade:'#817a94',deep:'#514b65',shine:'#fffbee'},
  comet:{light:'#ffc17c',body:'#e87530',shade:'#a83c23',deep:'#572b2d',shine:'#fff0b9'},
  kestrel:{light:'#e885d6',body:'#a6389b',shade:'#6a286d',deep:'#351f47',shine:'#ffd8ef'},
  nomad:{light:'#9397a9',body:'#4a4c60',shade:'#292b3c',deep:'#1d1e2b',shine:'#d7d5df'},
} as const;
const ink='#15131e', rubber='#201d28', rim='#777786', chrome='#b6adb3', glass='#252c42', glassMid='#4d506a', glassLight='#8a839a';
function painter(){
  const pixels:PixelRect[]=[];
  const rect=(x:number,y:number,width:number,height:number,color:string)=>{if(width>0&&height>0)pixels.push({x:Math.round(x),y:Math.round(y),width:Math.round(width),height:Math.round(height),color});};
  const poly=(points:readonly (readonly number[])[],color:string)=>{
    const minY=Math.floor(Math.min(...points.map(p=>p[1]))),maxY=Math.ceil(Math.max(...points.map(p=>p[1])));
    for(let y=minY;y<maxY;y++){
      const crossings:number[]=[];
      for(let i=0;i<points.length;i++){const a=points[i],b=points[(i+1)%points.length];if((a[1]<=y+.5&&b[1]>y+.5)||(b[1]<=y+.5&&a[1]>y+.5))crossings.push(a[0]+(y+.5-a[1])*(b[0]-a[0])/(b[1]-a[1]));}
      crossings.sort((a,b)=>a-b);for(let i=0;i+1<crossings.length;i+=2){const x=Math.ceil(crossings[i]-.5),right=Math.ceil(crossings[i+1]-.5);rect(x,y,right-x,1,color);}
    }
  };
  return {pixels,rect,poly};
}
/** 80×40. Ground at [40,34]. Shadow is intentionally a separate renderer layer. */
export function carPixels(id:CarId,pose:CarPose,frame=0):PixelRect[]{
  const {pixels,rect:r,poly:p}=painter(),c=carPaint[id];
  const turn=pose==='left'?-1:pose==='right'?1:0;
  // The near rear shifts only two pixels; the cabin/forward axle moves farther.
  // A separately constructed side face gains depth. The sprite is never rotated.
  const rear=40+turn*2,roof=40-turn*5,low=id==='comet'?10:id==='kestrel'?6:8;
  const left=rear-25,right=rear+25;
  const x=(offset:number)=>rear+offset;
  const roofX=(offset:number)=>roof+offset;
  // Both rubber contacts share y34 in every pose; forward tyre stays above it.
  r(left+1,24,7,10,rubber);r(right-8,24,7,10,rubber);
  r(left+2,27,2,5,rim);r(right-4,27,2,5,rim);
  if(turn){
    const side=turn<0?right:left,forward=side-turn*12;
    p([[side,21],[forward,16],[forward-turn*2,25],[side-turn*2,33]],ink);
    p([[side,22],[forward,17],[forward-turn,24],[side-turn*2,30]],c.shade);
    p([[side-turn,22],[forward,17],[forward,19],[side-turn,24]],c.light);
    p([[side-turn*2,25],[forward-turn,21],[forward-turn,23],[side-turn*2,28]],c.deep);
    const tyre=turn<0?forward-3:forward-2;
    r(tyre,22,5,8,rubber);r(tyre+2,23,1,5,chrome);
    r(turn<0?side-2:side,25,2,7,rubber);
    r(turn<0?side-1:side,26,1,5,chrome);
  }
  // Chassis silhouette and stepped shoulder, not a stretched rectangular car.
  p([[left+1,20],[roofX(-20),low+5],[roofX(-14),low],[roofX(13),low],[roofX(20),low+5],[right-1,20],[right+1,25],[right-2,32],[left+2,32],[left-1,26]],ink);
  p([[left+2,20],[roofX(-19),low+5],[roofX(-13),low+1],[roofX(12),low+1],[roofX(19),low+5],[right-2,20],[right-1,25],[left+1,25]],c.shade);
  p([[roofX(-18),low+5],[roofX(-13),low+1],[roofX(12),low+1],[roofX(18),low+5],[roofX(18),19],[roofX(-18),19]],c.body);
  r(roofX(-12),low+1,24,1,c.shine);
  // Rear glass is recessed in a solid pillar frame, with one quiet reflection.
  p([[roofX(-15),low+5],[roofX(-11),low+3],[roofX(11),low+3],[roofX(15),low+5],[roofX(17),17],[roofX(-17),17]],ink);
  p([[roofX(-13),low+5],[roofX(-10),low+4],[roofX(10),low+4],[roofX(13),low+5],[roofX(15),16],[roofX(-15),16]],glass);
  p([[roofX(-12),low+5],[roofX(10),low+5],[roofX(12),low+7],[roofX(-13),low+7]],glassLight);
  r(roofX(-14),low+8,27,1,glassMid);r(roofX(-15),16,30,1,c.light);
  // Two mirrors remain attached to the cabin shoulder rather than floating.
  r(roofX(-23),15,6,3,ink);r(roofX(-22),15,4,1,c.light);
  r(roofX(17),15,6,3,ink);r(roofX(18),15,4,1,c.light);
  p([[left+1,21],[roofX(-18),18],[roofX(18),18],[right-1,21],[right,24],[right-2,30],[left+2,30],[left,24]],c.body);
  p([[left+3,20],[roofX(-17),18],[roofX(17),18],[right-3,20],[right-3,22],[left+3,22]],c.light);
  r(left+4,21,right-left-8,1,c.shine);
  r(left+1,24,3,5,c.light);r(right-4,24,3,5,c.shade);
  // Rear fascia and lamps deliberately differ between all four silhouettes.
  r(x(-21),23,42,6,c.deep);r(x(-20),24,40,4,ink);
  const red=pose==='brake'?'#ff4841':'#a3293c',hot=pose==='brake'?'#fff1a6':'#ee6970';
  if(id==='vector'){
    for(const lamp of [-19,-12,8,15]){r(x(lamp),24,5,3,red);r(x(lamp),24,4,1,hot);}
    r(x(-5),24,10,2,c.shade);r(x(-2),24,4,1,chrome);
    r(x(-16),19,32,1,c.shade);r(x(-18),29,36,1,c.shine);
  }else if(id==='comet'){
    // Low engine cover, rear louvres and an integrated narrow wing.
    r(roofX(-19),17,38,2,ink);r(roofX(-18),17,36,1,c.light);
    for(let line=19;line<22;line++)r(roofX(-11),line,22,1,line%2?c.deep:c.shade);
    r(x(-20),24,10,4,red);r(x(10),24,10,4,red);
    r(x(-20),24,8,1,hot);r(x(12),24,8,1,hot);
    r(x(-8),24,16,1,c.light);r(x(-4),26,8,1,c.shade);
  }else if(id==='kestrel'){
    // Tall liftback, split glass, narrow upright outer lamps and broad shoulders.
    r(roofX(-1),low+4,2,12,c.shade);r(roofX(0),low+4,1,10,c.light);
    for(const lamp of [-20,15]){r(x(lamp),23,5,6,red);r(x(lamp+1),24,3,2,hot);r(x(lamp+1),27,3,1,'#d7c8b7');}
    r(x(-12),25,24,2,c.body);r(x(-8),26,16,1,c.shade);
    r(x(-22),20,7,2,c.shine);r(x(15),20,7,2,c.shine);
  }else{
    // Black long-tail touring coupe: wide red strips, silver boot trim, twin pipes.
    r(roofX(-14),low,28,1,chrome);r(roofX(-16),low+1,2,5,c.light);r(roofX(14),low+1,2,5,c.light);
    r(x(-21),24,13,3,red);r(x(8),24,13,3,red);
    r(x(-20),24,11,1,hot);r(x(9),24,11,1,hot);
    r(x(-8),24,16,1,chrome);r(x(-2),25,4,1,c.shine);
    r(x(-22),28,44,1,chrome);
  }
  // Bumper, wheel wells and shared plate position; plate has no borrowed mark.
  p([[left+3,29],[right-3,29],[right-4,32],[left+4,32]],c.light);
  r(x(-20),30,40,1,c.shine);r(x(-19),32,38,1,c.shade);
  r(x(-7),28,14,5,ink);r(x(-6),29,12,2,'#e0d8cc');r(x(-3),30,6,1,c.shade);
  r(x(-18),31,7,2,ink);r(x(11),31,7,2,ink);
  r(x(-17),31,2,1,chrome);r(x(-14),31,2,1,chrome);
  r(x(12),31,2,1,chrome);r(x(15),31,2,1,chrome);
  r(x(-14),33,28,1,ink);
  if(pose==='boost'){
    const length=frame%2?6:4;
    for(const jet of [-16,14]){p([[x(jet-2),33],[x(jet+3),33],[x(jet+1),33+length],[x(jet-1),35+Math.floor(length/2)]],'#e76229');p([[x(jet-1),33],[x(jet+2),33],[x(jet),34+Math.floor(length*.6)]],'#fff3ba');}
  }
  if(pose==='contact'){
    const side=frame%2?1:-1,edge=side<0?left-3:right+1;
    r(edge,23,2,3,'#fff3bd');r(edge+side*3,24,3,1,'#ffc465');r(edge+side*2,28,2,2,'#f18435');
    r(edge+side*5,20,1,2,'#fff3bd');
  }
  return pixels;
}
/** Deliberately redrawn 24×14 LOD, not a resized near sprite. */
export function farCarPixels(id:CarId):PixelRect[]{
  const {pixels,rect:r,poly:p}=painter(),c=carPaint[id],roof=id==='kestrel'?2:id==='comet'?4:3;
  r(3,9,3,3,rubber);r(18,9,3,3,rubber);
  p([[3,7],[6,roof+1],[8,roof],[16,roof],[18,roof+1],[21,7],[21,11],[3,11]],ink);
  p([[5,7],[8,roof+1],[16,roof+1],[19,7],[20,10],[4,10]],c.body);
  r(8,roof+1,8,1,c.light);r(7,roof+2,10,2,glass);
  r(4,7,16,1,c.light);r(4,8,16,2,c.deep);
  r(4,8,id==='kestrel'?2:5,1,'#dd5763');r(id==='kestrel'?18:15,8,id==='kestrel'?2:5,1,'#dd5763');
  r(4,10,16,1,c.light);r(10,10,4,1,'#ded4c5');
  if(id==='comet')r(6,6,12,1,c.shade);if(id==='nomad')r(6,10,12,1,chrome);
  return pixels;
}
/** Nose-up overhead, 48×80; rear axle ground anchor [24,72]. */
export function overheadCarPixels(id:CarId):PixelRect[]{
  const {pixels,rect:r,poly:p}=painter(),c=carPaint[id],wide=id==='kestrel'?1:0;
  r(7,19,5,13,rubber);r(36,19,5,13,rubber);r(6,57,5,15,rubber);r(37,57,5,15,rubber);
  p([[15,5],[33,5],[38,10],[40+wide,25],[39+wide,65],[36,73],[12,73],[9-wide,65],[8-wide,25],[10,11]],ink);
  p([[15,6],[33,6],[37,11],[39,26],[38,65],[35,72],[13,72],[10,65],[9,26],[11,12]],c.body);
  p([[15,7],[33,7],[36,12],[37,28],[11,28],[12,13]],c.light);
  r(16,8,16,1,c.shine);r(11,19,2,31,c.light);r(35,19,2,31,c.shade);
  // Bonnet crease, inset headlight clusters and two longitudinal highlights.
  r(14,12,3,5,c.shine);r(31,12,3,5,c.shine);r(15,18,1,10,c.body);r(32,18,1,10,c.shade);
  p([[13,30],[35,30],[34,39],[14,39]],ink);p([[14,31],[34,31],[33,37],[15,37]],glass);
  r(15,32,17,2,glassLight);r(17,34,15,1,glassMid);
  p([[15,40],[33,40],[34,53],[14,53]],c.light);r(16,40,16,1,c.shine);r(16,42,1,9,c.body);r(31,42,1,9,c.shade);
  p([[14,54],[34,54],[35,63],[13,63]],ink);p([[15,55],[33,55],[34,61],[14,61]],glass);r(16,56,16,1,glassLight);
  r(12,65,24,5,c.light);r(13,69,22,1,c.shine);r(12,71,24,1,c.shade);
  r(10,33,3,17,c.shade);r(35,33,3,17,c.deep);r(6,34,5,3,ink);r(37,34,5,3,ink);r(7,34,3,1,c.light);r(38,34,3,1,c.light);
  r(12,70,7,2,'#a3293c');r(29,70,7,2,'#a3293c');
  if(id==='vector'){r(19,23,10,1,c.body);r(16,64,16,1,c.shade);}
  if(id==='comet'){for(let y=56;y<65;y+=2)r(14,y,20,1,c.deep);r(10,66,28,2,ink);r(11,66,26,1,c.light);r(21,17,6,9,c.shade);}
  if(id==='kestrel'){r(23,55,2,7,c.shade);r(13,54,2,9,c.body);r(33,54,2,9,c.body);r(13,26,22,2,c.shade);}
  if(id==='nomad'){r(12,68,24,1,chrome);r(13,41,1,10,chrome);r(34,41,1,10,chrome);r(16,23,16,1,c.shade);}
  return pixels;
}
export function paintPixels(ctx:Pick<CanvasRenderingContext2D,'fillStyle'|'fillRect'>,pixels:readonly PixelRect[]){for(const pixel of pixels){ctx.fillStyle=pixel.color;ctx.fillRect(pixel.x,pixel.y,pixel.width,pixel.height);}}
export const carFamilyMetadata={
  schemaVersion:1,id:'apexbreak-original-car-family-v1',version:'1.0.0',created:'2026-10-23',
  provenance:{kind:'original-code-authored',source:'car-family.ts',commercialPixelsUsed:false,tracedContoursUsed:false,approval:'reviewed-locally-not-user-accepted',referenceStudy:['https://www.youtube.com/watch?v=E9QJZSBpvg0','https://www.youtube.com/watch?v=gFMgYrdlTF8'],observed:['low rear view','separate tyre contact','colour-readable opponents','flank change'],designed:['all pixel clusters','car body details','dimensions and anchors','two boost/contact effect holds']},
  near:{width:80,height:40,anchor:[40,34],collisionPixels:{left:15,right:65,front:24,rear:34},shadow:'separate plane at road anchor'},
  far:{width:24,height:14,anchor:[12,12],lod:'deliberately redrawn; preserve physical width via anchor/extent ratio'},
  overhead:{width:48,height:80,anchor:[24,72],orientation:'nose-up'},
  poses:poses.map(name=>({name,frames:name==='boost'||name==='contact'?2:1,holdsMs:name==='boost'?[80,80]:name==='contact'?[80,80]:[120],loop:name==='boost'||name==='contact',timing:'designed; state-driven; not recovered native timing'})),
  palette:carPaint,vehicles:{vector:{description:'white rounded coupe / paired rectangular lamps'},comet:{description:'orange low wedge / louvres and integrated wing'},kestrel:{description:'purple tall liftback / split glass and upright lamps'},nomad:{description:'black long-tail touring coupe / chrome trim and wide lamps'}},
};
