import * as T from 'three';
import {CricketerPlayer, STEP_LENGTH, type PlayerPose} from './character';
import type {CueName, CueOptions} from './audio';
import {KITS} from './kits';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {ballPosition, contactAt, FIELD, PITCH, RELEASE, RUN, runningTime, type Match, type Vec} from './engine';

type Rig = CricketerPlayer;
const Y=new T.Vector3(0,1,0), v=(x=0,y=0,z=0)=>new T.Vector3(x,y,z);
const mat=(color:T.ColorRepresentation, roughness=.8)=>new T.MeshStandardMaterial({color,roughness});
function mesh(g:T.BufferGeometry,m:T.Material,p:T.Vector3, parent:T.Object3D) {const o=new T.Mesh(g,m);o.position.copy(p);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;}
function box(parent:T.Object3D,m:T.Material,x:number,y:number,z:number,w:number,h:number,d:number) {return mesh(new T.BoxGeometry(w,h,d),m,v(x,y,z),parent);}
function rod(parent:T.Object3D,m:T.Material,a:T.Vector3,b:T.Vector3,r:number,r2=r) {const o=mesh(new T.CylinderGeometry(r2,r,1,8),m,v(),parent);segment(o,a,b);return o;}
function segment(o:T.Object3D,a:T.Vector3,b:T.Vector3){o.position.copy(a).add(b).multiplyScalar(.5);const delta=b.clone().sub(a);o.scale.y=delta.length();o.quaternion.setFromUnitVectors(Y,delta.normalize());}
function sphere(parent:T.Object3D,m:T.Material,x:number,y:number,z:number,r:number,sx=1,sy=1,sz=1){const o=mesh(new T.SphereGeometry(r,12,10),m,v(x,y,z),parent);o.scale.set(sx,sy,sz);return o;}
const smoothstep=(a:number,b:number,x:number)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t);};
type Cue = (name: CueName, options?: CueOptions) => void;
/** Ball line that meets the stance's native sweet spot without footwork (m). The batter takes guard here every ball. */
const GUARD = 0;
/**
 * Sideways distance the swing itself reaches; footwork after release covers the rest. Only off-side balls at a
 * comfortable height get a reach: reaching for low or leg-side balls pulls the top hand off the handle.
 */
const reachFor = (contactHeight: number, side: number) => side < 0 ? .18*Math.max(0, Math.min(1, (contactHeight-.3)/.4)) : 0;
const FOOT_START = RELEASE+.08, FOOT_TIME = .4;
// The keeper crouches outside off stump, clear of the batting camera's view of the striker.
const KEEPER = v(-1.35, 0, 2.3), GLOVES = v(-1.2, .62, 1.85);
const NON_STRIKER = v(1.25, 0, -PITCH+.7), BACKING_UP = 1.2, FAR_Z = -PITCH+.9, NEAR_Z = -.9;
const BOWLER_X = .38, MARK = -PITCH-7, STOP = -PITCH+1.8;
/** Metres per second: fielder sprint, walking back to position, the bowler's jog back. */
const CHASE_SPEED = 7, WALK_SPEED = 2.2, JOG_SPEED = 5;
/** Batters set off once the swing finishes. */
const RUN_START = .45;
const yawTo = (dx: number, dz: number) => Math.atan2(dx, dz);
/** Eased 0..1 travel with an acceleration and a deceleration phase (fraction `a` each). */
const trap = (u: number, a = .22) => {const peak = 1/(1-a); return u < a ? .5*peak*u*u/a : u < 1-a ? peak*(u-a/2) : 1-.5*peak*(1-u)**2/a;};
function walkTo(from: T.Vector3, to: Vec, speed: number, t: number) {
  const dx = to.x-from.x, dz = to.z-from.z, dist = Math.hypot(dx, dz), m = Math.min(dist, Math.max(0, t)*speed);
  return {x: from.x+(dist ? dx/dist*m : 0), z: from.z+(dist ? dz/dist*m : 0), moving: t > 0 && m < dist-.01, yaw: yawTo(dx, dz)};
}
/** Delivery clock (age until contact, then contact time plus seconds since contact) and the post-contact window. */
function timeline(s: Match) {
  const runs = s.outcome?.runs || 0, flown = !!s.outcome && (runs > 0 || s.outcome.caught), ran = runs > 0 && runs < 4;
  const fly = flown ? s.trajectory.duration : 0, run = ran ? runningTime(s) : 0, total = fly+run+1.15;
  const since = s.phase === 'delivery' ? -1 : s.phase === 'flight' ? s.age : s.phase === 'running' ? fly+s.age : s.phase === 'between' ? fly+run+s.age : total;
  return {since, total, runs, ran, flown, clock: s.phase === 'delivery' ? s.age : contactAt(s)+since};
}
function blobTexture(){const c=document.createElement('canvas');c.width=c.height=64;const ctx=c.getContext('2d')!;const g=ctx.createRadialGradient(32,32,2,32,32,31);g.addColorStop(0,'rgba(20,34,20,.55)');g.addColorStop(1,'rgba(20,34,20,0)');ctx.fillStyle=g;ctx.fillRect(0,0,64,64);const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;return t;}
function label(text:string,bg:string,fg:string,w=512,h=128){const c=document.createElement('canvas');c.width=w;c.height=h;const ctx=c.getContext('2d')!;ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);ctx.font=`900 ${h*.61}px 'Arial Narrow',sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle=fg;ctx.fillText(text,w/2,h*.53,w*.91);const tex=new T.CanvasTexture(c);tex.colorSpace=T.SRGBColorSpace;return new T.MeshBasicMaterial({map:tex,side:T.DoubleSide});}

export class CricketView {
  renderer:T.WebGLRenderer; scene=new T.Scene(); camera=new T.PerspectiveCamera(48,16/9,.1,400);
  batter!:Rig; bowler!:Rig; runner!:Rig; keeper!:Rig; fielders:Rig[]=[];
  /** World sound cues (footsteps, bounce, gloves, throws) timed to the animation. */
  onCue:Cue|null=null;
  private strides=new Map<Rig,{last:T.Vector3;d:number;steps:number}>(); private cap=new Map<Rig,T.Vector3>();
  private key=''; private keyTime=0; private prevClock=0; private prevTime=0; private trauma=0; private lastDraw=0; ball:T.Mesh; shadow:T.Mesh; trail:T.Mesh[]=[]; private blobs=new Map<Rig,T.Mesh>(); private blobMaterial:T.MeshBasicMaterial|null=null;
  private observer:ResizeObserver; private disposed=false; private lastTier=-1; private goal=v(); private eye=v(); private resources=new Set<T.Object3D>();
  private wicketTemplate:T.Group|null=null;
  constructor(private canvas:HTMLCanvasElement) {
    this.renderer=new T.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'high-performance'});
    this.renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=T.PCFSoftShadowMap;
    this.renderer.outputColorSpace=T.SRGBColorSpace;this.renderer.toneMapping=T.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.06;
    this.scene.background=new T.Color('#b4d9d3');this.scene.fog=new T.Fog('#b4d9d3',105,230);
    this.scene.add(new T.HemisphereLight('#eff9ff','#526b32',2.3));
    // Crisp sun shadows cover the pitch; far fielders get soft contact shadows instead.
    const sun=new T.DirectionalLight('#fff0cd',3);sun.position.set(-22,45,15);sun.target.position.set(0,0,-10);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-17;sun.shadow.camera.right=17;sun.shadow.camera.top=17;sun.shadow.camera.bottom=-17;sun.shadow.camera.near=10;sun.shadow.camera.far=110;sun.shadow.bias=-.0003;sun.shadow.normalBias=.02;this.scene.add(sun,sun.target);
    this.ground();
    this.ball=sphere(this.scene,mat('#fff6e5',.4),0,2,-PITCH,.075);
    const seam=mesh(new T.TorusGeometry(.076,.005,5,18),mat('#b3412a'),v(),this.ball);seam.rotation.x=.8;
    this.shadow=mesh(new T.CircleGeometry(.17,16),new T.MeshBasicMaterial({color:'#243c24',transparent:true,opacity:.45,depthWrite:false}),v(),this.scene);this.shadow.rotation.x=-Math.PI/2;
    for(let i=0;i<14;i++)this.trail.push(sphere(this.scene,new T.MeshBasicMaterial({color:'#fff1b8',transparent:true,opacity:.33*(1-i/14),depthWrite:false}),0,0,0,.052*(1-i/18)));
    this.observer=new ResizeObserver(()=>this.resize());this.observer.observe(canvas);this.resize();
  }
  private resize(){const {width,height}=this.canvas.getBoundingClientRect();if(!width||!height)return;this.renderer.setSize(width,height,false);this.camera.aspect=width/height;this.camera.updateProjectionMatrix();}
  private ground(){
    const grass=mat('#327b36'), grass2=mat('#3d873c'), sand=mat('#cba877'), white=mat('#fff8dd'), cream=mat('#f3e8cb'), green=mat('#245347'), concrete=mat('#c8c6ac');
    const earth=mesh(new T.CylinderGeometry(100,100,.8,96),grass,v(0,-.45,-10),this.scene);
    earth.receiveShadow=true;
    for(let i=0;i<9;i++){const ring=mesh(new T.RingGeometry(8+i*8,12+i*8,96),grass2,v(0,-.039,-10),this.scene);ring.rotation.x=-Math.PI/2;}
    box(this.scene,sand,0,-.025,-PITCH/2,3.05,.06,PITCH+3.5);
    // Pitch speckle uses a deterministic hash, no simulation RNG consumption.
    const marks=new T.InstancedMesh(new T.PlaneGeometry(.018,.055),mat('#ad8d5d'),480);
    const dummy=new T.Object3D();for(let i=0;i<480;i++){dummy.position.set(Math.sin(i*176.49)*1.4,.013,-((i*17.31)%PITCH));dummy.rotation.x=-Math.PI/2;dummy.updateMatrix();marks.setMatrixAt(i,dummy.matrix);}this.scene.add(marks);
    for(const z of [0,-PITCH]){box(this.scene,white,0,.012,z,2.65,.018,.042);box(this.scene,white,0,.013,z+(z===0?-1.22:1.22),3.65,.019,.045);for(const x of [-1.32,1.32])box(this.scene,white,x,.015,z+(z===0?-.45:.45),.045,.018,2.1);}
    const boundary=mesh(new T.TorusGeometry(65,.12,6,100),cream,v(0,.08,-10),this.scene);boundary.rotation.x=Math.PI/2;
    for(let i=0;i<32;i++){
      const a=i/32*Math.PI*2, x=Math.sin(a)*69,z=-10+Math.cos(a)*69;
      const ad=mesh(new T.PlaneGeometry(11.8,1.6),label(i%3===0?'CRICKETER':i%3===1?'CHASE YOUR MOMENT':'WILLOW PARK',i%2?'#eee5ce':'#204d3f',i%2?'#244b39':'#fff1d3'),v(x,.93,z),this.scene);ad.rotation.y=a+Math.PI;
    }
    const crowd=new T.InstancedMesh(new T.SphereGeometry(.15,6,5),mat('#ffffff'),2160);
    const spectator=new T.Object3D();let crowdIndex=0;
    for(let i=0;i<24;i++){
      const a=i/24*Math.PI*2;if(i===11||i===12||i===13)continue;
      const sector=new T.Group();sector.position.set(Math.sin(a)*83,0,-10+Math.cos(a)*83);sector.rotation.y=a;
      this.scene.add(sector);
      sector.updateMatrixWorld();
      for(let row=0;row<5;row++){box(sector,concrete,0,.7+row*.7,row*1.3,20,.65,1.4);for(let j=0;j<18;j++){const color=['#ead7a6','#cd4a34','#346558','#efbf55','#dedecb'][(j*7+row*3+i)%5];spectator.position.set(-9+j,1.32+row*.7,row*1.3).applyMatrix4(sector.matrixWorld);spectator.scale.set(1,1.45,1);spectator.updateMatrix();crowd.setMatrixAt(crowdIndex,spectator.matrix);crowd.setColorAt(crowdIndex++,new T.Color(color));}}
      box(sector,green,0,5.3,2,21,.25,9);for(const x of [-9,9])box(sector,cream,x,2.8,5,.18,5.7,.18);
    }
    crowd.count=crowdIndex;this.scene.add(crowd);
    // The main stand is original geometry; the downloaded CC0 pavilion is placed beside it.
    const house=new T.Group();house.position.set(0,0,-94);this.scene.add(house);
    box(house,cream,0,4,0,30,8,12);box(house,green,0,8.3,0,34,.65,15);
    const roofShape=new T.Shape();roofShape.moveTo(-16,0);roofShape.lineTo(0,3.8);roofShape.lineTo(16,0);roofShape.closePath();
    mesh(new T.ExtrudeGeometry(roofShape,{depth:14,bevelEnabled:false}),green,v(0,8.5,-7),house);
    const clock=mesh(new T.CircleGeometry(.72,24),white,v(0,9.7,7.02),house);
    rod(house,green,v(0,9.7,7.04),v(.38,9.92,7.04),.034);rod(house,green,v(0,9.7,7.04),v(0,10.22,7.04),.034);clock.castShadow=false;
    for(let i=-4;i<=4;i++){box(house,green,i*3,4,-6.05,1.9,4,.12);box(house,white,i*3,5,6.1,1.8,2.4,.14);}
    for(const x of [-13,-7,7,13])box(house,white,x,3,8,.25,6,.25);
    box(house,green,0,6.5,7.5,30,.3,5);box(house,white,0,2.6,9.8,30,.15,.12);
    const mast=mesh(new T.PlaneGeometry(18,2.1),label('WILLOW PARK','#204d3f','#f7edcf'),v(0,7,6.08),house);mast.rotation.y=0;
    for(const x of [-57,57])for(const z of [-72,52]){rod(this.scene,concrete,v(x,0,z),v(x,27,z),.3,.15);const light=box(this.scene,white,x,27,z,7,2,.4);light.rotation.x=-.2;}
    for(let i=0;i<14;i++){const x=Math.sin(i*67.2)*130,z=-110-Math.cos(i*39.3)*35;rod(this.scene,mat('#775c39'),v(x,0,z),v(x,8,z),.8,.4);const crown=mesh(new T.IcosahedronGeometry(7,1),new T.MeshStandardMaterial({color:i%2?'#426747':'#557947',roughness:.9,flatShading:true}),v(x,10,z),this.scene);crown.scale.set(1,1.45,1);}
  }
  async loadAssets(base:string) {
    const loader=new GLTFLoader();const [pavilion, wicket, player]=await Promise.all([loader.loadAsync(base+'pavilion.glb'),loader.loadAsync(base+'wicket.glb'),loader.loadAsync(base+'cricketer-player.glb')]);
    if(this.disposed){for(const gltf of [pavilion,wicket,player])this.disposeObject(gltf.scene);return;}
    this.blobMaterial=new T.MeshBasicMaterial({map:blobTexture(),transparent:true,depthWrite:false});
    const add=(rig:Rig)=>{this.scene.add(rig.root);const blob=mesh(new T.CircleGeometry(.62,20),this.blobMaterial!,v(),this.scene);blob.rotation.x=-Math.PI/2;blob.castShadow=false;blob.receiveShadow=false;this.blobs.set(rig,blob);return rig;};
    this.batter=add(new CricketerPlayer(player,{batting:true,kit:KITS.batting[0],number:'07'}));
    this.runner=add(new CricketerPlayer(player,{batting:true,kit:KITS.batting[1],number:'11'}));this.runner.root.position.copy(NON_STRIKER);
    this.bowler=add(new CricketerPlayer(player,{batting:false,kit:KITS.fielding[0],number:'23'}));this.bowler.root.position.set(BOWLER_X,0,MARK);
    this.keeper=add(new CricketerPlayer(player,{batting:false,keeper:true,kit:KITS.keeper,number:'01'}));this.keeper.root.position.copy(KEEPER);this.keeper.root.rotation.y=Math.PI;
    FIELD.forEach((spot,i)=>{const f=add(new CricketerPlayer(player,{batting:false,kit:KITS.fielding[i+1],number:String(i+12)}));f.root.position.set(spot.x,0,spot.z);f.root.rotation.y=yawTo(-spot.x,-spot.z);this.fielders.push(f);});
    const normalize=(object:T.Group,size:number)=>{const b=new T.Box3().setFromObject(object),dim=b.getSize(v()),center=b.getCenter(v());const scale=size/dim.y;object.scale.setScalar(scale);object.position.set(-center.x*scale,-b.min.y*scale,-center.z*scale);const group=new T.Group();group.add(object);return group;};
    const p=normalize(pavilion.scene,6);p.position.set(32,0,-82);p.rotation.y=-.25;this.scene.add(p);this.resources.add(p);
    this.wicketTemplate=normalize(wicket.scene,.711);
    for(const z of [.4,-PITCH]){const w=this.wicketTemplate.clone(true);w.position.set(0,0,z);this.scene.add(w);this.resources.add(w);}
  }
  private everyone(){return [this.batter,this.runner,this.bowler,this.keeper,...this.fielders];}
  /** The strike rotates after an odd number of completed runs. */
  private strikerFor(s:Match|null){const swapped=!!s&&s.results.reduce((n,r)=>n+(r.runs%2),0)%2===1;return swapped?[this.runner,this.batter]:[this.batter,this.runner];}
  /** Distance covered drives leg cadence; a footstep sounds each time a stride length is completed. */
  private stride(rig:Rig,kind:PlayerPose,cue:Cue,level=1){
    let st=this.strides.get(rig);if(!st){st={last:rig.root.position.clone(),d:0,steps:0};this.strides.set(rig,st);}
    const p=rig.root.position,moved=Math.hypot(p.x-st.last.x,p.z-st.last.z);st.last.copy(p);
    if(moved<1.5)st.d+=moved;
    const length=STEP_LENGTH[kind];
    if(length){const n=Math.floor(st.d/length);if(n>st.steps&&n-st.steps<3&&moved>0&&moved<1.5)cue('step',{x:p.x,z:p.z,level});st.steps=n;}
    return st.d;
  }
  private place(rig:Rig,x:number,z:number,yaw:number){rig.root.position.set(x,0,z);rig.root.rotation.y=yaw;}
  /** Camera kick for a struck ball (skipped with reduced motion). */
  kick(amount:number){this.trauma=Math.min(1,this.trauma+amount);}
  draw(s:Match|null,time:number,reduced=false) {
    const tier=s?.challenge.tier||0;
    if(tier!==this.lastTier){this.lastTier=tier;const color=tier===0?'#badbd3':tier===1?'#e7bda0':'#91aab9';this.scene.background=new T.Color(color);this.scene.fog=new T.Fog(color,105,230);}
    // A new delivery (or the result screen): remember where everyone stands so they walk, never jump, to their marks.
    const key=s?`${s.initialSeed}:${s.ball}:${s.phase==='finished'}`:'menu';
    if(key!==this.key){this.key=key;this.keyTime=time;for(const rig of this.everyone())this.cap.set(rig,rig.root.position.clone());this.prevClock=-1e-6;}
    if(s&&s.time<this.prevTime)this.prevTime=-1;
    const advanced=!!s&&s.time>this.prevTime;
    const cue:Cue=(name,options)=>{if(advanced)this.onCue?.(name,options);};
    const t=s?timeline(s):null, phase=s?.phase, since=t?t.since:-1, clock=t?t.clock:0, d=s?.delivery;
    const contactT=s?contactAt(s):0, crossed=(at:number)=>this.prevClock<at&&clock>=at;
    const walkClock=s?(phase==='finished'?s.age:clock):time-this.keyTime;
    const [striker,partner]=this.strikerFor(s);
    const contact=striker.contactLocal, guardX=GUARD-contact.x, homeZ=-contact.z;

    // Striker: a fixed guard. After release the batter steps across toward the line; the swing reaches the rest.
    const line=d?d.line:GUARD, offset=line-GUARD, reach=d?reachFor(d.contactHeight,Math.sign(offset)):0, shift=s?offset-Math.max(-reach,Math.min(reach,offset)):0;
    const u=s?(phase==='delivery'?Math.max(0,Math.min(1,(s.age-FOOT_START)/FOOT_TIME)):1):0;
    const body=shift*smoothstep(.15,.85,u), lateral=line-(GUARD+body);
    const runs=t?.runs||0, ran=!!t&&t.ran&&since>=RUN_START;
    // Run path: 0 at the batter's own end, 1 at the other, accelerating away and slowing into each turn.
    let frac=0, heading=0;
    if(ran){const k=Math.min(1,(since-RUN_START)/(runs*RUN-RUN_START))*runs, seg=Math.min(runs-1,Math.floor(k)), f=trap(k-seg);frac=seg%2?1-f:f;heading=k>=runs?0:seg%2?-1:1;}
    let kind:PlayerPose='ready', progress=s&&phase==='delivery'?s.age:9, sx=guardX+body, sz=homeZ, sYaw=0;
    if(s&&phase==='finished')kind=s.won?'celebrate':'wait';
    else if(ran){sz=homeZ+(FAR_Z-homeZ)*frac;kind=heading?'run':'wait';sYaw=heading?(heading>0?Math.PI:0):(frac>.5?Math.PI:0);}
    else if(s?.input&&phase==='delivery'){kind='swing';progress=Math.min(.5,.5*(s.age-s.input.at)/Math.max(1/120,contactT-s.input.at));}
    else if(s?.input&&since>=0){if(since<.42){kind='swing';progress=.5+since/.84;}else{kind='recover';progress=since;}}
    const walkIn=this.approach(striker,s,sx,sz);if(walkIn){sx=walkIn.x;sz=walkIn.z;sYaw=walkIn.yaw;kind=walkIn.kind;}
    if(s&&phase==='finished'&&!walkIn&&!s.won)sYaw=sz<-PITCH/2?Math.PI:0;
    this.place(striker,sx,sz,sYaw);
    const aim=d?.side==='left'?-1:1;
    striker.pose(time,kind,progress,aim,d?.shot,d?.contactHeight,{lateral,step:{shift,u},stride:this.stride(striker,kind,cue)});

    // Non-striker backs up as the ball is bowled and runs the other way.
    const backing=s&&phase==='delivery'?BACKING_UP*smoothstep(RELEASE-.55,RELEASE+.35,s.age):t&&!t.ran&&since>=0?BACKING_UP*(1-smoothstep(.3,1.2,since)):t?.ran?BACKING_UP:0;
    const nsZ=NON_STRIKER.z+backing;
    let px=NON_STRIKER.x, pz=nsZ, pKind:PlayerPose='wait', pYaw=Math.PI;
    if(s&&phase==='delivery'&&s.age>RELEASE-.55&&s.age<RELEASE+.35){pKind='walk';pYaw=0;}
    else if(t&&!t.ran&&since>.3&&since<1.2){pKind='walk';pYaw=Math.PI;}
    if(ran){pz=nsZ+(NEAR_Z-nsZ)*frac;pKind=heading?'run':'wait';pYaw=heading?(heading>0?0:Math.PI):(frac>.5?0:Math.PI);}
    const partnerIn=this.approach(partner,s,px,pz);if(partnerIn){px=partnerIn.x;pz=partnerIn.z;pYaw=partnerIn.yaw;pKind=partnerIn.kind;}
    this.place(partner,px,pz,pYaw);partner.pose(time,pKind,0,1,'drive',.6,{stride:this.stride(partner,pKind,cue)});

    // Bowler: run-up from wherever the walk back reached, delivery stride, follow-through, then a jog back to the mark.
    let bz=MARK, bKind:PlayerPose='stand', bYaw=0, bProgress=0;
    if(s&&phase==='delivery'){const p=s.age/RELEASE, start=Math.min(this.cap.get(this.bowler)?.z??MARK,-PITCH-1.2);bz=p<1?start+(-PITCH-start)*p:-PITCH+(STOP+PITCH)*smoothstep(1,1.6,p);bKind='bowl';bProgress=p;}
    else if(s&&phase!=='finished'){const end=-PITCH+(STOP+PITCH)*smoothstep(1,1.6,contactT/RELEASE),room=Math.max(0,end-MARK),back=Math.min(room,Math.max(0,since-.35)*JOG_SPEED);bz=end-back;const moving=since>.35&&back<room;bKind=moving?'run':'stand';bYaw=moving?Math.PI:0;}
    else if(s)bz=this.cap.get(this.bowler)?.z??MARK;
    if(s&&phase==='finished'&&!s.won)bKind='celebrate';
    this.place(this.bowler,BOWLER_X,bz,bYaw);this.bowler.pose(time,bKind,bProgress,1,'drive',.6,{stride:this.stride(this.bowler,bKind,cue,1.1)});
    this.place(this.keeper,KEEPER.x,KEEPER.z,Math.PI);this.keeper.pose(time,s&&phase==='finished'&&!s.won?'celebrate':'keep');

    // Ball: the simulation path, then the keeper's gloves, a fielder's hands or a throw back in.
    let p:Vec=s?ballPosition(s):{x:0,y:2,z:-PITCH};
    if(s&&d&&t&&!t.flown&&since>=0){const w=Math.min(1,since/.16);p={x:d.line+(GLOVES.x-d.line)*w,y:d.contactHeight+(GLOVES.y-d.contactHeight)*w,z:GLOVES.z*w};}
    // Fielders walk back to their spots; the one nearest where the ball comes down chases it at a realistic pace.
    const home=(i:number)=>{const from=this.cap.get(this.fielders[i])??v(FIELD[i].x,0,FIELD[i].z);return walkTo(from,FIELD[i],WALK_SPEED,walkClock);};
    let chaser=-1;
    const end=s&&t?.flown?{x:d!.line+s.trajectory.vx*s.trajectory.duration,z:s.trajectory.vz*s.trajectory.duration}:null;
    if(s&&end){let best=Infinity;this.fielders.forEach((_,i)=>{const from=this.cap.get(this.fielders[i])??v(FIELD[i].x,0,FIELD[i].z),at=walkTo(from,FIELD[i],WALK_SPEED,contactT),dist=Math.hypot(at.x-end.x,at.z-end.z);if(dist<best){best=dist;chaser=i;}});}
    const lost=!!s&&phase==='finished'&&!s.won;
    this.fielders.forEach((f,i)=>{
      if(i!==chaser||!s||!t||!end){const at=home(i);this.place(f,at.x,at.z,at.moving?at.yaw:yawTo(-at.x,-at.z));const k:PlayerPose=lost?'celebrate':at.moving?'walk':'field';f.pose(time,k,0,1,'drive',.6,{stride:this.stride(f,k,cue,.7)});return;}
      const from=this.cap.get(f)??v(FIELD[i].x,0,FIELD[i].z), start=walkTo(from,FIELD[i],WALK_SPEED,contactT);
      let target={x:end.x,z:end.z};
      if(runs>=4){const cx=end.x,cz=end.z+10,r=Math.hypot(cx,cz);if(r>61)target={x:cx/r*61,z:cz/r*61-10};}
      else if(s.outcome?.caught){const r=Math.hypot(end.x,end.z);target={x:end.x+end.x/r*.35,z:end.z+end.z/r*.35};}
      const dx=target.x-start.x,dz=target.z-start.z,dist=Math.hypot(dx,dz),covered=Math.min(dist,Math.max(0,since-.25)*CHASE_SPEED);
      const x=start.x+(dist?dx/dist*covered:0),z=start.z+(dist?dz/dist*covered:0),moving=since>.25&&covered<dist-.01;
      const towardBat=yawTo(-x,-z),towardGloves=yawTo(GLOVES.x-x,GLOVES.z-z);
      let k:PlayerPose=moving?'run':'field', yaw=moving?yawTo(dx,dz):towardBat, prog=0;
      const rest=s.trajectory.duration, pick=Math.max(.25+dist/CHASE_SPEED,rest), throwAt=pick+.3, release=throwAt+.18;
      const hand=v(x,1.9,z), flightT=hand.distanceTo(GLOVES)/24+.2, inGloves=release+flightT;
      if(s.outcome?.caught){if(!moving)k=since<rest?'catch':'celebrate';if(since>=rest)p={x:x-Math.sin(towardBat)*-.3,y:1.25,z:z-Math.cos(towardBat)*-.3};if(crossed(contactT+rest)){cue('catch',{x,z});this.kick(.15);}}
      else if(runs>=4){if(!moving)k='stand';}
      else if(!moving&&since>=pick){
        if(since<throwAt){k='field';yaw=towardGloves;}
        else if(since<throwAt+.45){k='bowl';prog=.7+(since-throwAt)/.45*.6;yaw=towardGloves;}
        else{k='stand';yaw=towardGloves;}
        if(since<release)p={x,y:.3+1.6*smoothstep(pick,release,since),z};
        else if(since<inGloves){const w=(since-release)/flightT;p={x:x+(GLOVES.x-x)*w,y:1.9+(GLOVES.y-1.9)*w+hand.distanceTo(GLOVES)*.09*4*w*(1-w),z:z+(GLOVES.z-z)*w};}
        else p={x:GLOVES.x,y:GLOVES.y,z:GLOVES.z};
        if(crossed(contactT+pick))cue('pickup',{x,z});
        if(crossed(contactT+release))cue('throw',{x,z});
        if(crossed(contactT+inGloves))cue('gloves',{x:GLOVES.x,z:GLOVES.z,level:.8});
      }
      if(lost)k='celebrate';
      this.place(f,x,z,yaw);f.pose(time,k,prog,1,'drive',.6,{stride:this.stride(f,k,cue,.8)});
    });
    this.ball.position.set(p.x,p.y,p.z);this.ball.rotation.x=time*8;this.ball.visible=!!s&&(phase!=='delivery'||s.age>=RELEASE);
    this.shadow.position.set(p.x,.023,p.z);this.shadow.scale.setScalar(1+p.y*.08);this.shadow.visible=this.ball.visible;
    for(let i=0;i<this.trail.length;i++){const tr=this.trail[i];tr.visible=!!s&&phase==='flight'&&!reduced;if(tr.visible){const at=Math.max(0,s!.age-i*.016),sample=ballPosition({...s!,age:at});tr.position.set(sample.x,sample.y,sample.z);}}
    for(const [rig,blob] of this.blobs)blob.position.set(rig.root.position.x,.03,rig.root.position.z);

    // World sound cues, timed to what is on screen.
    if(s&&d){
      if(crossed(RELEASE))cue('release',{x:BOWLER_X,z:-PITCH});
      if(crossed(RELEASE+d.bounce*d.flight))cue('bounce',{x:d.line*d.bounce**2,z:-PITCH*(1-d.bounce),level:Math.min(1.2,d.speed/120)});
      if(t&&!t.flown&&crossed(contactT+.16))cue('gloves',{x:GLOVES.x,z:GLOVES.z});
      if(t?.flown&&runs>0&&runs<6&&crossed(contactT+s.trajectory.duration*.6)){const at=ballPosition({...s,phase:'flight',age:s.trajectory.duration*.6});cue('land',{x:at.x,z:at.z,level:.9});}
      if(t&&crossed(contactT)&&(runs>0||s.outcome?.caught))this.kick(.1+.22*(s.outcome?.quality||0)+(runs===6?.18:0));
    }
    this.prevClock=clock;if(s)this.prevTime=s.time;
    const dt=Math.max(0,Math.min(.1,time-this.lastDraw));this.lastDraw=time;this.trauma=Math.max(0,this.trauma-dt*1.8);
    if(!s){this.eye.set(7,3.4,9);this.goal.set(0,1.0,-6);}
    else if(phase==='flight'&&!reduced){this.eye.set(p.x*.38+4,Math.max(3.6,p.y*.4+3),p.z*.43+7);this.goal.set(p.x,p.y*.6,p.z-4);}
    else {this.eye.set(.95,2.7,6.4);this.goal.set(0,1.0,-7);}
    if(!reduced&&this.trauma>0){const k=this.trauma*this.trauma;this.eye.x+=Math.sin(time*41)*.08*k;this.eye.y+=Math.sin(time*33+1)*.06*k;this.goal.x+=Math.sin(time*27+2)*.05*k;}
    this.camera.position.copy(this.eye);this.camera.lookAt(this.goal);this.renderer.render(this.scene,this.camera);
  }
  /** Walk in from where a player stood when the delivery began. Returns null once they are in place. */
  private approach(rig:Rig,s:Match|null,x:number,z:number):{x:number;z:number;yaw:number;kind:PlayerPose}|null{
    const from=this.cap.get(rig);if(!s||!from||(s.phase!=='delivery'&&s.phase!=='finished'))return null;
    const dist=Math.hypot(x-from.x,z-from.z);if(dist<.05||dist>30)return null;
    const duration=Math.min(1,Math.max(.35,dist/2.4));if(s.age>=duration)return null;
    const w=smoothstep(0,1,s.age/duration);
    return {x:from.x+(x-from.x)*w,z:from.z+(z-from.z)*w,yaw:yawTo(x-from.x,z-from.z),kind:dist/duration>3.2?'run':'walk'};
  }
  contactInspection(s:Match){const [striker]=this.strikerFor(s);striker.root.updateMatrixWorld(true);const blade=striker.bladePoint();return {expectedContact:contactAt(s),ball:ballPosition(s),blade:blade.toArray(),phase:s.phase,drawCalls:this.renderer.info.render.calls,triangles:this.renderer.info.render.triangles,character:striker.inspection()};}
  private disposeObject(root:T.Object3D){root.traverse(o=>{if(o instanceof T.Mesh){o.geometry.dispose();const materials=Array.isArray(o.material)?o.material:[o.material];materials.forEach(m=>{for(const value of Object.values(m))if(value instanceof T.Texture)value.dispose();m.dispose();});}});}
  dispose(){this.disposed=true;this.observer.disconnect();this.disposeObject(this.scene);this.blobMaterial?.map?.dispose();if(this.wicketTemplate)this.disposeObject(this.wicketTemplate);this.renderer.dispose();this.renderer.forceContextLoss();}
}
