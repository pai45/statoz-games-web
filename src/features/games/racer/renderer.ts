import * as T from 'three';
import source from './assets.json';
import {angle,angleLerp,at,damp,GRID_SIZE,gridSlot,project,track,TRACK_LENGTH,type Race} from './engine';
import {interpolate,type Motion,type Pose} from './motion';

type Asset=keyof typeof source;
export function createRenderer(canvas:HTMLCanvasElement){
 const renderer=new T.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'high-performance'});
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.12;
 renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;
 const scene=new T.Scene();scene.background=new T.Color('#b6d0df');scene.fog=new T.Fog('#c8d6d4',180,650);
 const camera=new T.PerspectiveCamera(58,1,.15,950),sun=new T.DirectionalLight('#fff4df',2.5);
 scene.add(new T.HemisphereLight('#e4f2fa','#6b8059',1.9));sun.position.set(-70,110,40);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-65;sun.shadow.camera.right=65;sun.shadow.camera.top=65;sun.shadow.camera.bottom=-65;sun.shadow.camera.near=1;sun.shadow.camera.far=240;sun.shadow.bias=-.0004;sun.shadow.normalBias=.035;scene.add(sun);scene.add(sun.target);
 const geometries:T.BufferGeometry[]=[],materials:T.Material[]=[],textures:T.Texture[]=[];
 const material=(color:string,roughness=.85)=>{const m=new T.MeshStandardMaterial({color,roughness,metalness:.02});materials.push(m);return m;};
 const grass=material('#789766'),dark=material('#182b35'),white=material('#fff6df'),red=material('#d44e46'),concrete=material('#b5b7b1'),teal=material('#64868d');
 const geo=(g:T.BufferGeometry)=>{geometries.push(g);return g;};
 const meshes=new Map<Asset,T.BufferGeometry>();
 const recovered=(id:Asset)=>{if(meshes.has(id))return meshes.get(id)!;const data=source[id],g=geo(new T.BufferGeometry());g.setAttribute('position',new T.Float32BufferAttribute(data.positions,3));g.setAttribute('normal',new T.Float32BufferAttribute(data.normals,3));g.setIndex(data.indices);g.computeBoundingBox();meshes.set(id,g);return g;};
 const add=(geometry:T.BufferGeometry,mat:T.Material,parent:T.Object3D=scene)=>{const mesh=new T.Mesh(geometry,mat);parent.add(mesh);mesh.receiveShadow=true;return mesh;};
 const boxGeometry=geo(new T.BoxGeometry(1,1,1));
 const box=(x:number,y:number,z:number,w:number,h:number,d:number,mat:T.Material,parent:T.Object3D=scene)=>{const mesh=add(boxGeometry,mat,parent);mesh.position.set(x,y,z);mesh.scale.set(w,h,d);mesh.castShadow=true;return mesh;};
 const ground=add(geo(new T.PlaneGeometry(2600,2600)),grass);ground.rotation.x=-Math.PI/2;ground.position.y=-.07;
 function ribbon(inner:number,outer:number,mat:T.Material,height:number,alternating=false){
  const positions:number[]=[],colors:number[]=[],indices:number[]=[];
  for(let i=0;i<track.length-1;i++){
   const a=at(track[i].distance),b=at(track[i+1].distance),points=[[a.x+a.nx*inner,a.z+a.nz*inner],[a.x+a.nx*outer,a.z+a.nz*outer],[b.x+b.nx*inner,b.z+b.nz*inner],[b.x+b.nx*outer,b.z+b.nz*outer]];
   for(const p of points)positions.push(p[0],height,p[1]);const k=i*4;indices.push(k,k+1,k+2,k+1,k+3,k+2);
   if(alternating){const c=new T.Color(Math.floor(track[i].distance/3)%2?'#ecebdd':'#ca5248');for(let j=0;j<4;j++)colors.push(c.r,c.g,c.b);}
  }
  const g=geo(new T.BufferGeometry());g.setAttribute('position',new T.Float32BufferAttribute(positions,3));g.setIndex(indices);g.computeVertexNormals();let m=mat;
  if(alternating){g.setAttribute('color',new T.Float32BufferAttribute(colors,3));m=new T.MeshStandardMaterial({vertexColors:true,roughness:.95,side:T.DoubleSide});materials.push(m);}else (m as T.MeshStandardMaterial).side=T.DoubleSide;
  return add(g,m);
 }
 ribbon(-11,11,material('#a5aea0'),.005);ribbon(-8.6,8.6,material('#444d51'),.018);ribbon(-8.7,-7.8,white,.038,true);ribbon(7.8,8.7,white,.038,true);ribbon(-7.65,-7.55,white,.05);ribbon(7.55,7.65,white,.05);
 // Grand Prix start/finish and twenty staggered grid boxes on Hamilton Straight.
 const grid=new T.Group(),start=at(0);grid.position.set(start.x,0,start.z);grid.rotation.y=start.heading;scene.add(grid);
 for(let x=-7;x<8;x++)for(let z=0;z<2;z++)box(x+.5,.067,z*.65,1,.02,.65,(x+z+20)%2?white:dark,grid);
 for(let i=0;i<GRID_SIZE;i++){const slot=gridSlot(i),p=at(slot.distance,slot.lane),node=new T.Group();node.position.set(p.x,.065,p.z);node.rotation.y=p.heading;scene.add(node);box(0,0,2.4,2.7,.02,.12,white,node);box(-1.3,0,1.8,.12,.02,1.3,white,node);box(1.3,0,1.8,.12,.02,1.3,white,node);}
 const banner=document.createElement('canvas');banner.width=1024;banner.height=180;const ctx=banner.getContext('2d')!;
 ctx.fillStyle='#153244';ctx.fillRect(0,0,1024,180);ctx.fillStyle='#ef654c';ctx.fillRect(0,165,1024,15);ctx.fillStyle='#ffffff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='700 83px "Space Grotesk",Arial,sans-serif';ctx.fillText('StatOz CIRCUITS',512,86);const bannerTexture=new T.CanvasTexture(banner);bannerTexture.colorSpace=T.SRGBColorSpace;textures.push(bannerTexture);
 const bannerMat=new T.MeshStandardMaterial({map:bannerTexture,roughness:.9,side:T.FrontSide});materials.push(bannerMat);const bannerGeo=geo(new T.PlaneGeometry(18,3.16));
 const board=(parent:T.Object3D,y:number,depth=.025)=>{for(const side of [-1,1]){const face=add(bannerGeo,bannerMat,parent);face.position.set(0,y,side*depth);face.rotation.y=side<0?Math.PI:0;}};
 const sign=(distance:number,lane:number)=>{const p=at(distance,lane);if(Math.abs(project(p.x,p.z).lane)<12)return;const node=new T.Group();node.position.set(p.x,0,p.z);node.rotation.y=p.heading+(lane>0?Math.PI/2:-Math.PI/2);scene.add(node);box(-7,1.7,0,.15,3.4,.15,dark,node);box(7,1.7,0,.15,3.4,.15,dark,node);board(node,3.2);};
 for(let d=65;d<TRACK_LENGTH;d+=130)sign(d,Math.floor(d/130)%2?16:-16);
 const gantryAt=at(50),startGantry=new T.Group();startGantry.position.set(gantryAt.x,0,gantryAt.z);startGantry.rotation.y=gantryAt.heading;scene.add(startGantry);box(-10,4,0,.6,8,.6,white,startGantry);box(10,4,0,.6,8,.6,white,startGantry);box(0,7.9,0,21,1.2,1,red,startGantry);board(startGantry,7.7,.56);
 const standGeo=recovered('grandstand').clone();geometries.push(standGeo);standGeo.computeBoundingBox();const bounds=standGeo.boundingBox!,center=bounds.getCenter(new T.Vector3()),extent=bounds.getSize(new T.Vector3());standGeo.translate(-center.x,-bounds.min.y,-center.z);
 for(const [fraction,lane] of [[.01,-28],[.055,-28],[.28,27],[.5,-30],[.76,28],[.92,-30]]){const p=at(fraction*TRACK_LENGTH,lane),stand=add(standGeo,material('#84929c'));stand.scale.setScalar(30/Math.max(extent.x,extent.z));stand.position.set(p.x,0,p.z);stand.rotation.y=p.heading;stand.castShadow=true;}
 const trussGeo=recovered('gantry').clone();geometries.push(trussGeo);trussGeo.computeBoundingBox();trussGeo.translate(0,-trussGeo.boundingBox!.min.y,0);
 for(const fraction of [.42,.8]){const p=at(fraction*TRACK_LENGTH),truss=add(trussGeo,white);truss.position.set(p.x,0,p.z);truss.rotation.y=p.heading;truss.scale.set(1.6,.63,1.2);truss.castShadow=true;const node=new T.Group();node.position.set(p.x,7,p.z);node.rotation.y=p.heading;scene.add(node);board(node,0);}
 const pit=at(45,30),pitNode=new T.Group();pitNode.position.set(pit.x,0,pit.z);pitNode.rotation.y=pit.heading;scene.add(pitNode);box(0,3,0,12,6,65,concrete,pitNode);box(0,6.2,0,14,.6,68,teal,pitNode);
 for(let z=-25;z<=25;z+=10){box(6.03,2.2,z,.08,3.6,7,dark,pitNode);box(6.09,4.8,z,.08,.55,7,red,pitNode);}
 // Silverstone is a flat airfield setting: low hedges and tree lines, no coastal mountains.
 const trunkGeo=geo(new T.CylinderGeometry(.35,.5,3,5)),leafGeo=geo(new T.IcosahedronGeometry(3.5,0)),trunk=material('#77644c'),leaf=material('#4e755c');
 for(let i=0;i<100;i++){const d=i*TRACK_LENGTH/100,p=at(d,(i%2?1:-1)*(42+(i*17%45)));if(d<150||d>TRACK_LENGTH-130||Math.abs(project(p.x,p.z).lane)<18)continue;const t=add(trunkGeo,trunk);t.position.set(p.x,1.4,p.z);const top=add(leafGeo,leaf);top.position.set(p.x,5,p.z);top.scale.set(1,1.2+(i%3)*.2,1);}
 const black=material('#16212b',.45),metal=material('#64717d',.35);metal.metalness=.6;
 const bodyMat=material('#ffffff',.37);bodyMat.metalness=.25;
 const instance=(g:T.BufferGeometry,m:T.Material,count:number,shadow=false)=>{const mesh=new T.InstancedMesh(g,m,count);mesh.instanceMatrix.setUsage(T.DynamicDrawUsage);mesh.frustumCulled=false;mesh.castShadow=shadow;mesh.receiveShadow=true;scene.add(mesh);return mesh;};
 const body=instance(recovered('body'),bodyMat,GRID_SIZE,true),chassis=instance(recovered('chassis'),black,GRID_SIZE,true),front=instance(recovered('frontWheel'),black,GRID_SIZE*2),rear=instance(recovered('rearWheel'),black,GRID_SIZE*2),hubs=instance(geo(new T.CylinderGeometry(.15,.15,.045,10).rotateZ(Math.PI/2)),metal,GRID_SIZE*4),helmets=instance(geo(new T.SphereGeometry(.28,12,8)),white,GRID_SIZE),visors=instance(boxGeometry,black,GRID_SIZE),wings=instance(boxGeometry,bodyMat,GRID_SIZE);
 const shadowTexture=(()=>{const c=document.createElement('canvas');c.width=c.height=64;const cx=c.getContext('2d')!,gradient=cx.createRadialGradient(32,32,2,32,32,31);gradient.addColorStop(0,'#0008');gradient.addColorStop(1,'#0000');cx.fillStyle=gradient;cx.fillRect(0,0,64,64);const t=new T.CanvasTexture(c);textures.push(t);return t;})();
 const shadowMat=new T.MeshBasicMaterial({map:shadowTexture,transparent:true,depthWrite:false});materials.push(shadowMat);const shadows=instance(geo(new T.PlaneGeometry(1,1)),shadowMat,GRID_SIZE);
 const batches=[body,chassis,front,rear,hubs,helmets,visors,wings,shadows],poses:Pose[]=Array.from({length:GRID_SIZE},()=>({x:0,z:0,heading:0,speed:0,steer:0,acceleration:0})),spin=new Float64Array(GRID_SIZE),pitch=new Float64Array(GRID_SIZE),roll=new Float64Array(GRID_SIZE),painted:string[]=[];
 const rootMatrix=new T.Matrix4(),localMatrix=new T.Matrix4(),resultMatrix=new T.Matrix4(),dummy=new T.Object3D(),euler=new T.Euler(0,0,0,'YXZ'),quaternion=new T.Quaternion(),scale=new T.Vector3(.82,.82,.82),carPosition=new T.Vector3(),color=new T.Color();
 const part=(mesh:T.InstancedMesh,index:number,x:number,y:number,z:number,rx=0,ry=0,sx=1,sy=1,sz=1)=>{dummy.position.set(x,y,z);dummy.rotation.set(rx,ry,0,'YXZ');dummy.scale.set(sx,sy,sz);dummy.updateMatrix();localMatrix.copy(dummy.matrix);resultMatrix.multiplyMatrices(rootMatrix,localMatrix);mesh.setMatrixAt(index,resultMatrix);};
 let initialized=false,view=0,camHeading=0,lastMotion:Motion|null=null;
 const look=new T.Vector3(),lookTarget=new T.Vector3(),target=new T.Vector3(),sunPoint=new T.Vector3(),lightOffset=new T.Vector3(-70,110,40);
 function draw(race:Race,motion:Motion,alpha:number,dt:number,preview:boolean,animate:boolean){
  const reset=lastMotion!==motion;if(reset){initialized=false;lastMotion=motion;spin.fill(0);pitch.fill(0);roll.fill(0);}
  const cars=[race.player,...race.opponents],motionDt=animate?Math.min(dt,.1):0;
  for(let i=0;i<GRID_SIZE;i++){
   const p=interpolate(motion,i,alpha,poses[i]);spin[i]+=p.speed*motionDt/.48;pitch[i]=damp(pitch[i],-Math.max(-40,Math.min(20,p.acceleration))*.0012,7,motionDt);roll[i]=damp(roll[i],p.steer*Math.min(p.speed/40,1)*.025,7,motionDt);
   carPosition.set(p.x,.075,p.z);euler.set(pitch[i],p.heading,roll[i],'YXZ');quaternion.setFromEuler(euler);rootMatrix.compose(carPosition,quaternion,scale);body.setMatrixAt(i,rootMatrix);chassis.setMatrixAt(i,rootMatrix);
   for(let j=0;j<4;j++){const x=j%2?1.02:-1.02,z=j<2?1.75:-1.65,steer=j<2?-p.steer*.35:0;part(j<2?front:rear,i*2+j%2,x,.48,z,spin[i],steer);part(hubs,i*4+j,x+(x<0?-.26:.26),.48,z,spin[i],steer);}
   part(helmets,i,0,1.27,-.37);part(visors,i,0,1.29,-.15,0,0,.4,.12,.07);part(wings,i,0,1.1,-2.55,0,0,1.95,.045,.18);
   dummy.position.set(p.x,.075,p.z);dummy.rotation.set(-Math.PI/2,p.heading,0,'YXZ');dummy.scale.set(3.5,6,1);dummy.updateMatrix();shadows.setMatrixAt(i,dummy.matrix);
   if(painted[i]!==cars[i].color){painted[i]=cars[i].color;color.set(cars[i].color);body.setColorAt(i,color);wings.setColorAt(i,color);}
  }
  for(const mesh of batches)mesh.instanceMatrix.needsUpdate=true;if(body.instanceColor)body.instanceColor.needsUpdate=true;if(wings.instanceColor)wings.instanceColor.needsUpdate=true;
  const p=poses[0],cameraDt=animate||preview?Math.min(dt,.1):0;
  if(!initialized)camHeading=p.heading;else camHeading=angleLerp(camHeading,p.heading,1-Math.exp(-7*cameraDt));
  const fx=Math.sin(camHeading),fz=Math.cos(camHeading);
  if(preview){target.set(p.x-fx*27+fz*13,15,p.z-fz*27-fx*13);lookTarget.set(p.x+fx*27,1,p.z+fz*27);}else{const gap=view?14:9.5;target.set(p.x-fx*gap,4.8+(view?2.1:0),p.z-fz*gap);lookTarget.set(p.x+fx*15,1.3,p.z+fz*15);}
  if(!initialized||Math.hypot(camera.position.x-target.x,camera.position.z-target.z)>55){camera.position.copy(target);look.copy(lookTarget);initialized=true;}else{camera.position.lerp(target,1-Math.exp(-7*cameraDt));look.lerp(lookTarget,1-Math.exp(-10*cameraDt));}
  camera.lookAt(look);const fov=damp(camera.fov,58+(race.boosting?5:0),4,cameraDt);if(Math.abs(fov-camera.fov)>.0001){camera.fov=fov;camera.updateProjectionMatrix();}
  sunPoint.set(p.x,0,p.z);sun.target.position.copy(sunPoint);sun.position.copy(sunPoint).add(lightOffset);renderer.render(scene,camera);
 }
 return{draw,resize(width:number,height:number){renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix();},camera(){view=1-view;},diagnostics(){return{cars:GRID_SIZE,vehicleBatches:batches.length,drawCalls:renderer.info.render.calls,triangles:renderer.info.render.triangles,cameraHeading:angle(camHeading),fov:camera.fov,playerPose:{...poses[0]}};},dispose(){for(const mesh of batches)mesh.dispose();for(const g of geometries)g.dispose();for(const m of materials)m.dispose();for(const t of textures)t.dispose();sun.shadow.map?.dispose();renderer.dispose();}};
}
