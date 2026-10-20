import * as THREE from 'three';
type Rect=(group:THREE.Group,x:number,y:number,w:number,h:number,color:string,order:number)=>unknown;
type Box=(group:THREE.Group,x:number,y:number,w:number,h:number,color:string,t?:number)=>unknown;
export const TURF={light:'#609724',dark:'#54851d',line:'#e7e9bd',track:'#a66036',rim:'#e5dcb2'};
/** Original pixel construction from observed venue layers; no source logos or video texture. */
export function drawStadium(group:THREE.Group,rect:Rect,box:Box,close=false){
    const width=close?640:726;
    rect(group,close?-160:-32,-82,width+224,510,TURF.dark,-100);
    // Broad alternating mowing bands with sparse, deterministic grass blades.
    for(let x=-32,n=0;x<width+32;x+=54,n++)rect(group,x,close?26:68,54,354,n%2?TURF.light:TURF.dark,-99);
    for(let y=76;y<356;y+=8)for(let x=2;x<width;x+=13){
        const n=(x*17+y*11)%29;
        if(n<4)rect(group,x,y,1,n%2+1,n%2?'#6fa12d':'#4b7d1b',-98);
    }
    // Athletic track, retaining wall, pitch-side boards, upper seating and aisle rails.
    const standTop=close?-4:-24;
    rect(group,-30,40,width+60,34,TURF.track,-97);
    for(const y of [43,48,53,58])rect(group,-30,y,width+60,1,'#cf9362',-96);
    rect(group,-30,standTop,width+60,64,'#29546b',-95);
    const shirts=['#e1c678','#c8d9e0','#ce785c','#6ba5b0','#31435e'];
    for(let row=0;row<6;row++){
        const y=standTop+5+row*9;
        rect(group,-30,y+6,width+60,2,'#879b9b',-94);
        for(let x=-28;x<width+30;x+=7){
            const n=Math.abs(x*31+row*47)%shirts.length;
            rect(group,x+1,y,2,2,'#d5aa7e',-93);
            rect(group,x,y+2,4,4,shirts[n],-93);
        }
    }
    for(let x=20;x<width;x+=126){rect(group,x,standTop,10,64,'#9caeae',-92);for(let y=standTop+4;y<standTop+64;y+=8)rect(group,x,y,10,1,'#d2d9c5',-91);}
    rect(group,-30,close?48:39,width+60,5,'#dfdcc4',-90);
    const colors=['#d9d6b8','#225397','#d4a432','#244c69','#ac573e','#315e42'];
    const glyphs:Record<string,string[]>={A:['010','101','111','101','101'],R:['110','101','110','101','101'],C:['011','100','100','100','011'],D:['110','101','101','101','110'],E:['111','100','110','100','111'],F:['111','100','110','100','100'],O:['010','101','101','101','010'],T:['111','010','010','010','010'],B:['110','101','110','101','110'],L:['100','100','100','100','111'],P:['110','101','110','100','100'],K:['101','101','110','101','101']};
    for(let x=-30,i=0;x<width+30;x+=90,i++){
        rect(group,x,49,88,21,colors[i%colors.length],-89);
        rect(group,x+3,52,82,1,'#eee6c0',-88);
        const word=i%2?'FOOTBALL':'ARCADE';
        for(const [n,char]of [...word].entries())for(const [row,line]of glyphs[char].entries())for(let col=0;col<3;col++)if(line[col]==='1')rect(group,x+7+n*9+col*2,55+row*2,2,2,'#eee6c0',-88);
        rect(group,x+87,48,2,25,'#263d3b',-87);
    }
    rect(group,-32,71,width+64,3,TURF.rim,-86);
    if(close)return;
    // Match geometry: 105x68 world units projected to the same contact plane.
    box(group,48,80,630,218,TURF.line);
    rect(group,363,80,1,218,TURF.line,-40);
    for(const x of [48,579])box(group,x,144,99,90,TURF.line);
    for(const x of [48,645])box(group,x,167,33,44,TURF.line);
    for(let n=0;n<144;n++){const a=n*Math.PI*2/144;rect(group,Math.round(363+Math.cos(a)*55),Math.round(189+Math.sin(a)*29),2,1,TURF.line,-40);}
    for(const x of [114,612])rect(group,x,188,2,2,TURF.line,-40);
    for(const x of [48,678])for(const y of [80,298]){rect(group,x,y-15,1,16,'#e6d8a8',-39);rect(group,x+1,y-15,5,4,'#e3b643',-38);}
    for(const side of [-1,1]){
        const front=side<0?48:678,back=front+side*22,left=Math.min(front,back);
        // Side goal roofs, supports and fine mesh. White posts stay distinguishable from the ball.
        rect(group,left,134,22,77,'#526e57',-49);
        for(let y=136;y<211;y+=5)rect(group,left,y,22,1,'#b2c3a0',-48);
        for(let x=left;x<=left+22;x+=4)rect(group,x,134,1,77,'#b2c3a0',-48);
        rect(group,back,134,2,77,'#d9dfbd',-47);rect(group,front,91,2,120,'#f3efda',-46);
        rect(group,left,134,24,2,'#f3efda',-46);rect(group,left,209,24,2,'#d9dfbd',-46);
        for(let n=0;n<=22;n++){rect(group,front+side*n,91+n*2,2,2,'#e9e4ce',-46);rect(group,front+side*n,136+n*3.3,1,2,'#bec9ad',-47);}
    }
}
