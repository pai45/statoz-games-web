import * as T from 'three';
import {CricketerPlayer} from './character';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {ballPosition, contactAt, PITCH, RELEASE, WINDUP, type Match} from './engine';

type Rig = CricketerPlayer;
const Y=new T.Vector3(0,1,0), v=(x=0,y=0,z=0)=>new T.Vector3(x,y,z);
const mat=(color:T.ColorRepresentation, roughness=.8)=>new T.MeshStandardMaterial({color,roughness});
function mesh(g:T.BufferGeometry,m:T.Material,p:T.Vector3, parent:T.Object3D) {const o=new T.Mesh(g,m);o.position.copy(p);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;}
function box(parent:T.Object3D,m:T.Material,x:number,y:number,z:number,w:number,h:number,d:number) {return mesh(new T.BoxGeometry(w,h,d),m,v(x,y,z),parent);}
function rod(parent:T.Object3D,m:T.Material,a:T.Vector3,b:T.Vector3,r:number,r2=r) {const o=mesh(new T.CylinderGeometry(r2,r,1,8),m,v(),parent);segment(o,a,b);return o;}
function segment(o:T.Object3D,a:T.Vector3,b:T.Vector3){o.position.copy(a).add(b).multiplyScalar(.5);const delta=b.clone().sub(a);o.scale.y=delta.length();o.quaternion.setFromUnitVectors(Y,delta.normalize());}
function sphere(parent:T.Object3D,m:T.Material,x:number,y:number,z:number,r:number,sx=1,sy=1,sz=1){const o=mesh(new T.SphereGeometry(r,12,10),m,v(x,y,z),parent);o.scale.set(sx,sy,sz);return o;}
function label(text:string,bg:string,fg:string,w=512,h=128){const c=document.createElement('canvas');c.width=w;c.height=h;const ctx=c.getContext('2d')!;ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);ctx.font=`900 ${h*.61}px 'Arial Narrow',sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle=fg;ctx.fillText(text,w/2,h*.53,w*.91);const tex=new T.CanvasTexture(c);tex.colorSpace=T.SRGBColorSpace;return new T.MeshBasicMaterial({map:tex,side:T.DoubleSide});}

export class CricketView {
  renderer:T.WebGLRenderer; scene=new T.Scene(); camera=new T.PerspectiveCamera(48,16/9,.1,400);
  batter!:Rig; bowler!:Rig; runner!:Rig; fielders:Rig[]=[]; ball:T.Mesh; shadow:T.Mesh; trail:T.Mesh[]=[];
  private observer:ResizeObserver; private disposed=false; private lastTier=-1; private goal=v(); private eye=v(); private resources=new Set<T.Object3D>();
  private wicketTemplate:T.Group|null=null;
  constructor(private canvas:HTMLCanvasElement) {
    this.renderer=new T.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'high-performance'});
    this.renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=T.PCFSoftShadowMap;
    this.renderer.outputColorSpace=T.SRGBColorSpace;this.renderer.toneMapping=T.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.06;
    this.scene.background=new T.Color('#b4d9d3');this.scene.fog=new T.Fog('#b4d9d3',105,230);
    this.scene.add(new T.HemisphereLight('#eff9ff','#526b32',2.3));
    const sun=new T.DirectionalLight('#fff0cd',3);sun.position.set(-22,45,25);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-35;sun.shadow.camera.right=35;sun.shadow.camera.top=25;sun.shadow.camera.bottom=-35;sun.shadow.bias=-.0004;this.scene.add(sun);
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
    for(let i=0;i<14;i++){const x=Math.sin(i*67.2)*130,z=-110-Math.cos(i*39.3)*35;rod(this.scene,mat('#775c39'),v(x,0,z),v(x,8,z),.8,.4);sphere(this.scene,mat(i%2?'#426747':'#557947'),x,10,z,7,1,1.5,1);}
  }
  async loadAssets(base:string) {
    const loader=new GLTFLoader();const [pavilion, wicket, shared, motion]=await Promise.all([loader.loadAsync(base+'pavilion.glb'),loader.loadAsync(base+'wicket.glb'),loader.loadAsync(base+'player-shared.glb'),loader.loadAsync(base+'source-motion.local.glb')]);
    if(this.disposed){for(const gltf of [pavilion,wicket,shared,motion])this.disposeObject(gltf.scene);return;}
    this.batter=new CricketerPlayer(shared,motion,true,'#be412d','07');this.scene.add(this.batter.root);
    this.runner=new CricketerPlayer(shared,motion,true,'#be412d','11');this.runner.root.position.set(1.8,0,-PITCH);this.runner.root.rotation.y=Math.PI;this.scene.add(this.runner.root);
    this.bowler=new CricketerPlayer(shared,motion,false,'#22634d','23');this.scene.add(this.bowler.root);
    for(let i=0;i<8;i++){const f=new CricketerPlayer(shared,motion,false,'#22634d',String(i+12));const a=(i+.4)/8*Math.PI*2;f.root.position.set(Math.sin(a)*(i%2?45:32),0,-12+Math.cos(a)*36);f.root.rotation.y=Math.atan2(-f.root.position.x,-f.root.position.z);this.fielders.push(f);this.scene.add(f.root);}
    const normalize=(object:T.Group,size:number)=>{const b=new T.Box3().setFromObject(object),dim=b.getSize(v()),center=b.getCenter(v());const scale=size/dim.y;object.scale.setScalar(scale);object.position.set(-center.x*scale,-b.min.y*scale,-center.z*scale);const group=new T.Group();group.add(object);return group;};
    const p=normalize(pavilion.scene,6);p.position.set(32,0,-82);p.rotation.y=-.25;this.scene.add(p);this.resources.add(p);
    this.wicketTemplate=normalize(wicket.scene,.711);
    for(const z of [.4,-PITCH]){const w=this.wicketTemplate.clone(true);w.position.set(0,0,z);this.scene.add(w);this.resources.add(w);}
  }
  draw(s:Match|null,time:number,reduced=false) {
    const tier=s?.challenge.tier||0;
    if(tier!==this.lastTier){this.lastTier=tier;const color=tier===0?'#badbd3':tier===1?'#e7bda0':'#91aab9';this.scene.background=new T.Color(color);this.scene.fog=new T.Fog(color,105,230);}
    const running=s?.phase==='running', runProgress=running?Math.min(1,s.age/(s.outcome!.runs*.7)):0;
    const runZ=running?-(Math.sin(runProgress*s.outcome!.runs*Math.PI/2)**2)*PITCH:0;
    const contactOffset=.16+.63*Math.sin(.9);
    this.batter.root.position.x=s?s.delivery.line-contactOffset:-.52;this.batter.root.position.z=.1+runZ;
    this.batter.root.rotation.y=running?Math.cos(runProgress*s!.outcome!.runs*Math.PI)<0?Math.PI:0:0;
    const swinging=s?.input&&s.phase==='delivery';
    const swingAge=swinging?s.age-s.input!.at:s?.outcome&&s.phase==='flight'?s.age+WINDUP:10;
    const swingProgress=swinging?Math.min(.5,.5*swingAge/Math.max(1/120,contactAt(s!)-s!.input!.at)):Math.min(1,.5+(s?.phase==='flight'?s.age:0)/.42);
    const kind=s?.phase==='finished'&&s.won?'celebrate':running?'run':swingAge<.65?'swing':'ready';
    this.batter.pose(time,kind,swingProgress,s?.delivery.side==='left'?1:-1,s?.delivery.shot,s?.delivery.contactHeight);
    this.runner.root.position.z=-PITCH-runZ;this.runner.root.rotation.y=running?this.batter.root.rotation.y+Math.PI:Math.PI;this.runner.pose(time,running?'run':'ready');
    const bowling=s?.phase==='delivery', progress=bowling?Math.min(1,s.age/RELEASE):1;
    this.bowler.root.position.set(.38,0,-PITCH-8*(1-progress));this.bowler.pose(time,bowling?'bowl':'field',progress);
    this.bowler.root.rotation.y=Math.PI;
    const p=s?ballPosition(s):{x:0,y:2,z:-PITCH};this.ball.position.set(p.x,p.y,p.z);this.ball.rotation.x=time*8;this.ball.visible=!!s&&(!bowling||s.age>=RELEASE);
    this.shadow.position.set(p.x,.023,p.z);this.shadow.scale.setScalar(1+p.y*.08);this.shadow.visible=this.ball.visible;
    for(let i=0;i<this.trail.length;i++){const tr=this.trail[i];tr.visible=!!s&&s.phase==='flight'&&!reduced;if(tr.visible){const t=Math.max(0,s!.age-i*.016),sample=ballPosition({...s!,age:t});tr.position.set(sample.x,sample.y,sample.z);}}
    this.fielders.forEach((f,i)=>{const a=(i+.4)/8*Math.PI*2;const origin=v(Math.sin(a)*(i%2?45:32),0,-12+Math.cos(a)*36);const pursuit=s?.phase==='flight'&&i===0||running&&i===0;const alpha=pursuit?Math.min(1,s!.age/(s!.phase==='flight'?s!.trajectory.duration:.7)):0;f.root.position.copy(origin).lerp(v(s?.trajectory.landing.x||0,0,s?.trajectory.landing.z||0),alpha);f.pose(time,pursuit?alpha>.86?'field':'run':'field');});
    if(!s){this.eye.set(7,3.4,9);this.goal.set(0,1.0,-6);}
    else if(s.phase==='flight'&&!reduced){this.eye.set(p.x*.38+4,Math.max(3.6,p.y*.4+3),p.z*.43+7);this.goal.set(p.x,p.y*.6,p.z-4);}
    else {this.eye.set(.95,2.7,6.4);this.goal.set(0,1.0,-7);}
    this.camera.position.copy(this.eye);this.camera.lookAt(this.goal);this.renderer.render(this.scene,this.camera);
  }
  contactInspection(s:Match){this.batter.root.updateMatrixWorld(true);const blade=v(0,-.63,0).applyMatrix4(this.batter.bat.matrixWorld);return {expectedContact:contactAt(s),ball:ballPosition(s),blade:blade.toArray(),phase:s.phase,drawCalls:this.renderer.info.render.calls,triangles:this.renderer.info.render.triangles,character:this.batter.inspection()};}
  private disposeObject(root:T.Object3D){root.traverse(o=>{if(o instanceof T.Mesh){o.geometry.dispose();const materials=Array.isArray(o.material)?o.material:[o.material];materials.forEach(m=>{for(const value of Object.values(m))if(value instanceof T.Texture)value.dispose();m.dispose();});}});}
  dispose(){this.disposed=true;this.observer.disconnect();this.disposeObject(this.scene);if(this.wicketTemplate)this.disposeObject(this.wicketTemplate);this.renderer.dispose();this.renderer.forceContextLoss();}
}
