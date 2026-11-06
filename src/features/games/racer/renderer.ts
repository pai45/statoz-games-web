import * as T from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {angle,angleLerp,CAR_HALF_WIDTH,damp,defaultCircuit,GRID_SIZE,gridSlot,ROAD_HALF,type Car,type Chassis,type Race,type RaceEvent} from './engine';
import {interpolate,type Motion,type Pose} from './motion';

/** Kenney CC0 models packed by scripts/import-racer-kenney.mjs (see public/games/f1-racing/kenney/PROVENANCE.json). */
export async function loadKit(assetRoot:string){
 const gltf=await new GLTFLoader().loadAsync(new URL('kenney/racer-kit.glb',assetRoot).href);
 gltf.scene.updateMatrixWorld(true);
 return gltf.scene;
}
export type Kit=Awaited<ReturnType<typeof loadKit>>;

const CAR_SCALE=1.8;
const CHASSIS:Chassis[]=['race','race-future'];
/** Brightest channel of each chassis' original paint texel (linear), so liveries keep Kenney's shading. */
const PAINT_VALUE:Record<Chassis,number>={race:.83,'race-future':.62};
const WHEELS=['wheel-front-left','wheel-front-right','wheel-back-left','wheel-back-right'];
/** GLTFLoader suffixes duplicate node names (body, body_1), so match a car part by prefix within its chassis. */
const part=(root:T.Object3D,name:string)=>root.children.find(o=>o.name===name||o.name.startsWith(name+'_')) as T.Mesh;


/** Fullscreen-free particle points with per-particle colour, alpha and size. */
function particles(count:number,additive:boolean){
 const geometry=new T.BufferGeometry(),position=new Float32Array(count*3),color=new Float32Array(count*3),alpha=new Float32Array(count),size=new Float32Array(count);
 geometry.setAttribute('position',new T.BufferAttribute(position,3).setUsage(T.DynamicDrawUsage));geometry.setAttribute('color',new T.BufferAttribute(color,3).setUsage(T.DynamicDrawUsage));
 geometry.setAttribute('alpha',new T.BufferAttribute(alpha,1).setUsage(T.DynamicDrawUsage));geometry.setAttribute('size',new T.BufferAttribute(size,1).setUsage(T.DynamicDrawUsage));
 const material=new T.ShaderMaterial({transparent:true,depthWrite:false,blending:additive?T.AdditiveBlending:T.NormalBlending,uniforms:{scale:{value:400}},
  vertexShader:'attribute float alpha;attribute float size;attribute vec3 color;varying float vAlpha;varying vec3 vColor;uniform float scale;void main(){vAlpha=alpha;vColor=color;vec4 mv=modelViewMatrix*vec4(position,1.);gl_PointSize=size*scale/max(.1,-mv.z);gl_Position=projectionMatrix*mv;}',
  fragmentShader:'varying float vAlpha;varying vec3 vColor;void main(){vec2 p=gl_PointCoord-.5;float d=dot(p,p)*4.;if(d>1.)discard;gl_FragColor=vec4(vColor,vAlpha*(1.-d));}'});
 const points=new T.Points(geometry,material);points.frustumCulled=false;
 const life=new Float32Array(count),age=new Float32Array(count),velocity=new Float32Array(count*3),grow=new Float32Array(count),base=new Float32Array(count),gravity=new Float32Array(count);let next=0;
 return{points,geometry,material,
  emit(x:number,y:number,z:number,vx:number,vy:number,vz:number,r:number,g:number,b:number,a:number,s:number,growth:number,duration:number,fall=0){const i=next;next=(next+1)%count;position.set([x,y,z],i*3);velocity.set([vx,vy,vz],i*3);color.set([r,g,b],i*3);base[i]=a;alpha[i]=a;size[i]=s;grow[i]=growth;life[i]=duration;age[i]=0;gravity[i]=fall;},
  update(dt:number){for(let i=0;i<count;i++){if(life[i]<=0)continue;age[i]+=dt;if(age[i]>=life[i]){life[i]=0;alpha[i]=0;continue;}const k=i*3;velocity[k+1]-=gravity[i]*dt;position[k]+=velocity[k]*dt;position[k+1]+=velocity[k+1]*dt;position[k+2]+=velocity[k+2]*dt;velocity[k]*=.96;velocity[k+2]*=.96;if(position[k+1]<.05&&velocity[k+1]<0){position[k+1]=.05;velocity[k+1]*=-.3;}size[i]+=grow[i]*dt;alpha[i]=base[i]*(1-age[i]/life[i]);}
   for(const name of ['position','alpha','size','color'])geometry.getAttribute(name).needsUpdate=true;},
 };
}

export function createRenderer(canvas:HTMLCanvasElement,kit:Kit,circuit=defaultCircuit,gridSize=GRID_SIZE,sharedRenderer?:T.WebGLRenderer){
 const {at,project,track,TRACK_LENGTH,lineAt,wallLane,walls,WALL_SAMPLES,WALL_STEP}=circuit;
 const curvatureAt=(d:number)=>angle(at(d+4).heading-at(d-4).heading)/8;
 const renderer=sharedRenderer??new T.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'high-performance'});
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.08;
 renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;
 const geometries:T.BufferGeometry[]=[],materials:T.Material[]=[],textures:T.Texture[]=[],instanced:T.InstancedMesh[]=[];
 const canvasTexture=(w:number,h:number,paint:(c:CanvasRenderingContext2D)=>void,repeat=false)=>{const c=document.createElement('canvas');c.width=w;c.height=h;paint(c.getContext('2d')!);const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;t.anisotropy=4;if(repeat){t.wrapS=t.wrapT=T.RepeatWrapping;}textures.push(t);return t;};

 // Sky: a warm late-afternoon gradient with a hazy horizon that matches the fog.
 const scene=new T.Scene();
 scene.background=canvasTexture(4,256,c=>{const g=c.createLinearGradient(0,0,0,256);g.addColorStop(0,'#5d9ccf');g.addColorStop(.55,'#a9cde0');g.addColorStop(.78,'#dfe6dc');g.addColorStop(1,'#e9e3cf');c.fillStyle=g;c.fillRect(0,0,4,256);});
 scene.fog=new T.Fog('#d9e2da',220,820);
 const camera=new T.PerspectiveCamera(58,1,.15,1200),sun=new T.DirectionalLight('#fff0d6',2.7);
 scene.add(new T.HemisphereLight('#dcecf7','#5f7550',1.65));sun.position.set(-70,110,40);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-70,right:70,top:70,bottom:-70,near:1,far:260});sun.shadow.bias=-.0004;sun.shadow.normalBias=.035;scene.add(sun);scene.add(sun.target);
 const material=(color:string,roughness=.85)=>{const m=new T.MeshStandardMaterial({color,roughness,metalness:0});materials.push(m);return m;};
 const geo=<G extends T.BufferGeometry>(g:G)=>{geometries.push(g);return g;};
 const add=(geometry:T.BufferGeometry,mat:T.Material,parent:T.Object3D=scene)=>{const mesh=new T.Mesh(geometry,mat);parent.add(mesh);mesh.receiveShadow=true;return mesh;};
 const boxGeometry=geo(new T.BoxGeometry(1,1,1));
 const box=(x:number,y:number,z:number,w:number,h:number,d:number,mat:T.Material,parent:T.Object3D=scene)=>{const mesh=add(boxGeometry,mat,parent);mesh.position.set(x,y,z);mesh.scale.set(w,h,d);mesh.castShadow=true;return mesh;};
 const white=material('#fff6df'),dark=material('#182b35');

 // Ground: mown airfield grass with broad stripes, and a distant tree line on the horizon.
 const grassTexture=canvasTexture(256,256,c=>{c.fillStyle='#6f9a58';c.fillRect(0,0,256,256);c.fillStyle='#7ba862';c.fillRect(0,0,256,128);for(let i=0;i<2600;i++){c.fillStyle=Math.random()<.5?'#5f8a4c22':'#9cc27a22';c.fillRect(Math.random()*256,Math.random()*256,2,2);}},true);grassTexture.repeat.set(52,52);
 const ground=add(geo(new T.PlaneGeometry(2600,2600)),new T.MeshStandardMaterial({map:grassTexture,roughness:1}));materials.push(ground.material as T.Material);ground.rotation.x=-Math.PI/2;ground.position.y=-.07;
 const horizon=canvasTexture(1024,64,c=>{c.clearRect(0,0,1024,64);c.fillStyle='#5d7a63';for(let x=0;x<1024;x+=6){const h=18+Math.abs(Math.sin(x*.05)*12+Math.sin(x*.013)*14);c.beginPath();c.ellipse(x,64-h*.6,9,h*.6,0,0,Math.PI*2);c.fill();}c.fillRect(0,56,1024,8);},true);horizon.repeat.set(6,1);
 const ring=new T.Mesh(geo(new T.CylinderGeometry(780,780,46,48,1,true)),new T.MeshBasicMaterial({map:horizon,transparent:true,side:T.BackSide,fog:false,depthWrite:false,color:'#c9d6cc'}));materials.push(ring.material as T.Material);ring.position.y=15;scene.add(ring);

 // Track surfaces are ribbons along the centreline, with UVs so asphalt grain repeats every 8 m.
 function ribbon(inner:number|((d:number)=>number),outer:number|((d:number)=>number),mat:T.Material,height:number,colorAt?:(d:number,side:number)=>string){
  const positions:number[]=[],uvs:number[]=[],colors:number[]=[],indices:number[]=[],tint=new T.Color();
  const lane=(v:number|((d:number)=>number),d:number)=>typeof v==='number'?v:v(d);
  for(let i=0;i<track.length-1;i++){
   const da=track[i].distance,db=track[i+1].distance,a=at(da),b=at(db),ia=lane(inner,da),oa=lane(outer,da),ib=lane(inner,db),ob=lane(outer,db);
   positions.push(a.x+a.nx*ia,height,a.z+a.nz*ia,a.x+a.nx*oa,height,a.z+a.nz*oa,b.x+b.nx*ib,height,b.z+b.nz*ib,b.x+b.nx*ob,height,b.z+b.nz*ob);
   uvs.push(0,da/8,1,da/8,0,db/8,1,db/8);const k=i*4;indices.push(k,k+1,k+2,k+1,k+3,k+2);
   if(colorAt){tint.set(colorAt(da,Math.sign(ia+oa)));for(let j=0;j<4;j++)colors.push(tint.r,tint.g,tint.b);}
  }
  const g=geo(new T.BufferGeometry());g.setAttribute('position',new T.Float32BufferAttribute(positions,3));g.setAttribute('uv',new T.Float32BufferAttribute(uvs,2));g.setIndex(indices);g.computeVertexNormals();
  if(colorAt){g.setAttribute('color',new T.Float32BufferAttribute(colors,3));(mat as T.MeshStandardMaterial).vertexColors=true;}
  (mat as T.MeshStandardMaterial).side=T.DoubleSide;return add(g,mat);
 }
 const asphalt=canvasTexture(128,256,c=>{c.fillStyle='#4a5256';c.fillRect(0,0,128,256);for(let i=0;i<5200;i++){const v=60+Math.random()*40|0;c.fillStyle=`rgba(${v},${v+6},${v+10},.35)`;c.fillRect(Math.random()*128,Math.random()*256,1.5,1.5);}c.fillStyle='#ffffff08';c.fillRect(30,0,6,256);c.fillRect(92,0,6,256);},true);
 const asphaltMat=new T.MeshStandardMaterial({map:asphalt,roughness:.92,metalness:0});materials.push(asphaltMat);
 // Gravel traps on the outside of slow corners; green verges everywhere else.
 const outsideTrap=(d:number,side:number)=>{let k=0;for(let s=-24;s<=24;s+=8)k=Math.max(k,-curvatureAt(d+s)*side);return k>.045;};
 ribbon(8.7,22,material('#ffffff',1),.004,(d,side)=>outsideTrap(d,side)?'#d8c49a':'#86ad68');ribbon(-22,-8.7,material('#ffffff',1),.004,(d,side)=>outsideTrap(d,side)?'#d8c49a':'#86ad68');
 ribbon(-8.6,8.6,asphaltMat,.018);
 // Rubbered-in racing line: a faint darker band that also teaches the line the CPUs drive.
 const rubber=new T.MeshBasicMaterial({color:'#1d2326',transparent:true,opacity:.16,depthWrite:false});materials.push(rubber);
 ribbon(d=>lineAt(d)-1.3,d=>lineAt(d)+1.3,rubber,.024);
 const kerbMat=material('#ffffff',.9),oppositeKerb=kerbMat.clone();materials.push(oppositeKerb);const kerbColor=(d:number)=>Math.floor(d/3)%2?'#efeee2':'#cf4b42';
 ribbon(-8.7,-7.8,kerbMat,.038,kerbColor);ribbon(7.8,8.7,oppositeKerb,.038,kerbColor);ribbon(-7.65,-7.55,white,.05);ribbon(7.55,7.65,white,.05);

 // Grand Prix start/finish and twenty staggered grid boxes on Hamilton Straight.
 const grid=new T.Group(),start=at(0);grid.position.set(start.x,0,start.z);grid.rotation.y=start.heading;scene.add(grid);
 for(let x=-7;x<8;x++)for(let z=0;z<2;z++)box(x+.5,.067,z*.65,1,.02,.65,(x+z+20)%2?white:dark,grid);
 for(let i=0;i<gridSize;i++){const slot=gridSlot(i),p=at(slot.distance,slot.lane),node=new T.Group();node.position.set(p.x,.065,p.z);node.rotation.y=p.heading;scene.add(node);box(0,0,2.4,2.7,.02,.12,white,node);box(-1.3,0,1.8,.12,.02,1.3,white,node);box(1.3,0,1.8,.12,.02,1.3,white,node);}

 // StatOz CIRCUITS signage replaces Kenney's fictional sponsor in every banner slot.
 const signTexture=canvasTexture(512,256,c=>{c.fillStyle='#153244';c.fillRect(0,0,512,256);c.fillStyle='#ef654c';c.fillRect(0,214,512,42);c.fillStyle='#ffca54';c.beginPath();c.moveTo(40,128);c.lineTo(92,76);c.lineTo(118,76);c.lineTo(66,128);c.lineTo(118,180);c.lineTo(92,180);c.closePath();c.fill();c.fillStyle='#ffffff';c.textBaseline='middle';c.font='700 74px "Space Grotesk",Arial,sans-serif';c.fillText('StatOz',138,104);c.font='700 34px "Space Grotesk",Arial,sans-serif';c.fillText('C I R C U I T S',142,162);});
 // Kenney's sign faces use wrapped glTF UVs (e.g. v -1..0), so repeat and keep glTF's unflipped orientation.
 signTexture.wrapS=signTexture.wrapT=T.RepeatWrapping;signTexture.flipY=false;
 const signMat=new T.MeshStandardMaterial({map:signTexture,roughness:.75,metalness:0});materials.push(signMat);
 const kitMaterials=new Map<T.Material,T.Material>();
 const kitMaterial=(m:T.Material)=>{if(!kitMaterials.has(m)){let next:T.Material;if(m.name==='sign')next=signMat;else{next=m.clone();const s=next as T.MeshStandardMaterial;s.metalness=m.name.includes('glass')?.3:0;s.roughness=m.name.includes('glass')?.25:.8;materials.push(next);}kitMaterials.set(m,next);}return kitMaterials.get(m)!;};

 type Place={x:number;z:number;rotation:number;scale:number|[number,number,number];y?:number};
 const matrix=new T.Matrix4(),local=new T.Matrix4(),quat=new T.Quaternion(),vec=new T.Vector3(),scl=new T.Vector3(),up=new T.Vector3(0,1,0);
 /** Instances one Racing Kit prop, recentred on its footprint and standing on the ground. */
 function placeKit(name:string,places:Place[],shadow=false){
  const root=kit.getObjectByName('kit-'+name);if(!root||!places.length)return;
  const bounds=new T.Box3().setFromObject(root),centre=bounds.getCenter(new T.Vector3()),recentre=new T.Matrix4().makeTranslation(-centre.x,-bounds.min.y,-centre.z);
  root.traverse(node=>{const mesh=node as T.Mesh;if(!mesh.isMesh)return;const inst=new T.InstancedMesh(mesh.geometry,kitMaterial(mesh.material as T.Material),places.length);inst.castShadow=shadow;inst.receiveShadow=true;
   places.forEach((p,i)=>{const s=typeof p.scale==='number'?[p.scale,p.scale,p.scale]:p.scale;matrix.compose(vec.set(p.x,p.y??0,p.z),quat.setFromAxisAngle(up,p.rotation),scl.set(s[0],s[1],s[2]));local.multiplyMatrices(recentre,mesh.matrixWorld);inst.setMatrixAt(i,matrix.multiply(local));});
   inst.computeBoundingSphere();instanced.push(inst);scene.add(inst);});
 }
 const facing=(distance:number,lane:number,turn=0,scale:Place['scale']=1):Place=>{const p=at(distance,lane);return{x:p.x,z:p.z,rotation:p.heading+(lane>0?-Math.PI/2:Math.PI/2)+turn,scale};};
 const clearOfTrack=(distance:number,lane:number,margin=14)=>{const p=at(distance,lane);return Math.abs(project(p.x,p.z).lane)>margin;};

 // Covered grandstands line Hamilton Straight and the big braking zones, three bays per block.
 const stands:Place[]=[];
 for(const [fraction,lane] of [[.004,-31],[.06,-31],[.28,29],[.5,-32],[.76,30],[.92,-32]] as const)for(let bay=-1;bay<=1;bay++){const d=fraction*TRACK_LENGTH+bay*14.2;if(clearOfTrack(d,lane,20))stands.push(facing(d,lane,0,14));}
 placeKit('grandStandCovered',stands,true);
 // Pit garages, with offices above the centre bays, face the pit straight.
 const garages:Place[]=[],offices:Place[]=[];for(let i=0;i<7;i++){const d=12+i*11;garages.push(facing(d,32,0,11));if(i%3===1)offices.push(facing(d,32,0,11));}
 placeKit('pitsGarage',garages,true);placeKit('pitsOffice',offices.map(o=>({...o,y:.7*11})),true);
 // Start gantry with lights over the grid; Racing Kit billboards carry StatOz boards round the lap.
 const gantrySpan=2*(Math.max(wallLane(1,1),wallLane(1,-1))+1.4);
 placeKit('overheadLights',[{...facing(1,.0001,0,[gantrySpan/1.26,13,17]),rotation:at(1).heading}],true);
 /** A lane just behind the barrier on one side, or null where there is no barrier (hairpin islands). */
 const behind=(d:number,side:number,gap:number)=>{const w=wallLane(d,side);return w>30?null:side*(w+gap);};
 const boards:Place[]=[];for(let d=65;d<TRACK_LENGTH;d+=125){const lane=behind(d,Math.floor(d/125)%2?1:-1,4);if(lane!==null&&clearOfTrack(d,lane,13))boards.push(facing(d,lane,0,10));}
 placeKit('billboard',boards,true);
 // Circuit boundary, laid in 4 m segments exactly on the barrier line the physics uses:
 // Kenney guardrail, painted concrete wall with a catch fence on the main straight, and
 // alternating red/white tyre-wall blocks behind the gravel traps.
 const boundary:Record<'rail'|'barrierWall'|'fenceStraight'|'barrierRed'|'barrierWhite',Place[]>={rail:[],barrierWall:[],fenceStraight:[],barrierRed:[],barrierWhite:[]};
 for(const side of [-1,1]){
  const w=side>0?walls.right:walls.left;
  for(let i=0;i<WALL_SAMPLES;i+=2){
   const j=(i+2)%WALL_SAMPLES,kind=w.kind[i];if(kind==='none'||w.kind[j]==='none')continue;
   const depth=kind==='rail'?.2:.6,da=i*WALL_STEP,a=at(da,side*(w.lanes[i]+depth)),b=at(da+2*WALL_STEP,side*(w.lanes[j]+depth));
   const dx=b.x-a.x,dz=b.z-a.z,length=Math.hypot(dx,dz)+.12,heading=Math.atan2(dx,dz),x=(a.x+b.x)/2,z=(a.z+b.z)/2;
   if(length>8)continue;
   if(kind==='rail')boundary.rail.push({x,z,rotation:heading-Math.PI/2,scale:[length,6.5,8]});
   else if(kind==='concrete'){boundary.barrierWall.push({x,z,rotation:heading-Math.PI/2,scale:[length,8,10]});boundary.fenceStraight.push({x,z,y:1.04,rotation:heading-Math.PI/2,scale:[length,7,8]});}
   else boundary[(i/2)%2?'barrierRed':'barrierWhite'].push({x,z,rotation:heading-Math.PI/2,scale:[length/.25,8,10]});
  }
 }
 for(const [name,places] of Object.entries(boundary))placeKit(name,places);
 // Marshal posts and flags at the apexes; hospitality tents and timing radar behind the paddock.
 const posts:Place[]=[],flags:Place[]=[];for(let d=40;d<TRACK_LENGTH;d+=160){const side=Math.floor(d/160)%2?1:-1,lane=behind(d,side,2.2),flagLane=behind(d+3,side,2.6);if(lane!==null&&flagLane!==null&&clearOfTrack(d,lane,11)){posts.push(facing(d,lane,0,9));flags.push(facing(d+3,flagLane,0,6));}}
 placeKit('lightRedDouble',posts);placeKit('flagGreen',flags);
 placeKit('flagCheckers',[facing(0,-(wallLane(0,-1)+2.4),0,7),facing(0,wallLane(0,1)+2.4,0,7)]);
 const tents:Place[]=[];for(let i=0;i<6;i++){const d=TRACK_LENGTH-40-i*20;tents.push(facing(d,46+(i%2)*6,0,9));}
 placeKit('tentLong',tents,true);placeKit('radarEquipment',[facing(100,40,0,8)]);
 // Low-poly tree belts and copses keep the flat airfield readable without blocking the view.
 const large:Place[]=[],small:Place[]=[];
 for(let i=0;i<260;i++){const d=(i*37.7)%TRACK_LENGTH,lane=(i%2?1:-1)*(40+(i*23%70));if(!clearOfTrack(d,lane,26))continue;const p=at(d,lane),jitter=(i*13%7)-3;(i%3?large:small).push({x:p.x+jitter,z:p.z-jitter,rotation:i*1.7,scale:7+(i*7%5)});}
 placeKit('treeLarge',large,true);placeKit('treeSmall',small,true);

 // Cars: Kenney Car Kit race chassis, one instanced batch per part, paint recoloured per livery.
 const cars=gridSize,carPaint=new Map<Chassis,T.Material>(),batches:T.InstancedMesh[]=[];
 const bodyMaterial=(source:T.Material,chassis:Chassis)=>{const m=(source as T.MeshStandardMaterial).clone();m.metalness=.15;m.roughness=.45;m.onBeforeCompile=shader=>{shader.uniforms.paintValue={value:PAINT_VALUE[chassis]};shader.fragmentShader='uniform float paintValue;\n'+shader.fragmentShader.replace('#include <color_fragment>',`#if defined( USE_COLOR )
  float hiC=max(max(diffuseColor.r,diffuseColor.g),diffuseColor.b),loC=min(min(diffuseColor.r,diffuseColor.g),diffuseColor.b);
  float paint=smoothstep(.55,.7,hiC>0.?(hiC-loC)/hiC:0.);
  diffuseColor.rgb=mix(diffuseColor.rgb,vColor.rgb*(hiC/paintValue),paint);
#endif`);};m.customProgramCacheKey=()=>'racer-paint-'+chassis;materials.push(m);carPaint.set(chassis,m);return m;};
 type ChassisParts={body:T.InstancedMesh;bodyLocal:T.Matrix4;wheels:{mesh:T.InstancedMesh;hub:T.Vector3;local:T.Matrix4;front:boolean}[];slots:number[]};
 const parts=new Map<Chassis,ChassisParts>();
 for(const chassis of CHASSIS){
  const root=kit.getObjectByName('car-'+chassis)!,body=part(root,'body'),slots:number[]=[];
  const bodyMesh=new T.InstancedMesh(body.geometry,bodyMaterial(body.material as T.Material,chassis),cars);bodyMesh.castShadow=true;bodyMesh.receiveShadow=true;
  const wheels=WHEELS.map(name=>{const w=part(root,name),mesh=new T.InstancedMesh(w.geometry,kitMaterial(w.material as T.Material),cars);mesh.castShadow=false;mesh.receiveShadow=true;return{mesh,hub:new T.Vector3().setFromMatrixPosition(w.matrixWorld),local:new T.Matrix4().copy(w.matrixWorld).setPosition(0,0,0),front:name.includes('front')};});
  for(const mesh of [bodyMesh,...wheels.map(w=>w.mesh)]){mesh.instanceMatrix.setUsage(T.DynamicDrawUsage);mesh.frustumCulled=false;mesh.count=0;scene.add(mesh);batches.push(mesh);}
  parts.set(chassis,{body:bodyMesh,bodyLocal:body.matrixWorld.clone(),wheels,slots});
 }
 const glow=(color:string)=>{const m=new T.MeshBasicMaterial({color,toneMapped:false});materials.push(m);return m;};
 const brakeLights=new T.InstancedMesh(boxGeometry,glow('#ff2a2a'),cars),flames=new T.InstancedMesh(geo(new T.ConeGeometry(.22,1,8).rotateX(-Math.PI/2).translate(0,0,-.5)),new T.MeshBasicMaterial({color:'#ffb347',transparent:true,opacity:.85,blending:T.AdditiveBlending,depthWrite:false,toneMapped:false}),cars);materials.push(flames.material as T.Material);
 const shadowTexture=canvasTexture(64,64,c=>{const g=c.createRadialGradient(32,32,2,32,32,31);g.addColorStop(0,'#000a');g.addColorStop(1,'#0000');c.fillStyle=g;c.fillRect(0,0,64,64);});
 const shadowMat=new T.MeshBasicMaterial({map:shadowTexture,transparent:true,depthWrite:false});materials.push(shadowMat);const shadows=new T.InstancedMesh(geo(new T.PlaneGeometry(1,1)),shadowMat,cars);
 for(const mesh of [brakeLights,flames,shadows]){mesh.instanceMatrix.setUsage(T.DynamicDrawUsage);mesh.frustumCulled=false;scene.add(mesh);batches.push(mesh);}

 // Skid marks: a ring buffer of dark quads laid under the rear tyres.
 const MARKS=420,marks=new T.InstancedMesh(geo(new T.PlaneGeometry(.36,1).rotateX(-Math.PI/2)),new T.MeshBasicMaterial({color:'#15191b',transparent:true,opacity:.42,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2}),MARKS);materials.push(marks.material as T.Material);
 marks.frustumCulled=false;marks.count=0;scene.add(marks);let markNext=0;
 const smoke=particles(800,false),sparks=particles(520,true);for(const p of [smoke,sparks]){scene.add(p.points);geometries.push(p.geometry);materials.push(p.material);}
 // Crash debris: Kenney Car Kit parts thrown off heavy impacts, painted in the crashing car's livery,
 // with gravity, ground bounces and a shrink-out after a few seconds.
 const DEBRIS=['debris-tire','debris-spoiler-a','debris-bumper','debris-plate-a','debris-plate-small-a','debris-door','debris-bolt'],PER_TYPE=8;
 const debrisParts=DEBRIS.map(name=>{let mesh:T.Mesh|undefined;kit.getObjectByName('kit-'+name)?.traverse(n=>{if(!mesh&&(n as T.Mesh).isMesh)mesh=n as T.Mesh;});return mesh;}).filter((m):m is T.Mesh=>!!m);
 const debrisMaterial=debrisParts.length?bodyMaterial(debrisParts[0].material as T.Material,'race'):null;
 const debris=debrisParts.map(m=>{const mesh=new T.InstancedMesh(m.geometry,debrisMaterial!,PER_TYPE);mesh.instanceMatrix.setUsage(T.DynamicDrawUsage);mesh.frustumCulled=false;mesh.castShadow=true;mesh.setColorAt(0,new T.Color('#ffffff'));scene.add(mesh);return{mesh,local:m.matrixWorld.clone(),next:0,life:new Float32Array(PER_TYPE),position:new Float32Array(PER_TYPE*3),velocity:new Float32Array(PER_TYPE*3),rotation:new Float32Array(PER_TYPE*3),spinRate:new Float32Array(PER_TYPE*3)};});
 for(const d of debris)for(let i=0;i<PER_TYPE;i++)d.mesh.setMatrixAt(i,new T.Matrix4().makeScale(0,0,0));
 const debrisEuler=new T.Euler(),debrisQuat=new T.Quaternion(),debrisMatrix=new T.Matrix4();
 function throwDebris(x:number,z:number,count:number,tint:string,push:number){
  for(let n=0;n<count&&debris.length;n++){
   const d=debris[Math.floor(Math.random()*debris.length)],i=d.next;d.next=(d.next+1)%PER_TYPE;
   const a=Math.random()*Math.PI*2,v=2+Math.random()*push;
   d.position.set([x+(Math.random()-.5),.6+Math.random()*.4,z+(Math.random()-.5)],i*3);d.velocity.set([Math.cos(a)*v,3+Math.random()*4+push*.3,Math.sin(a)*v],i*3);
   d.rotation.set([Math.random()*6,Math.random()*6,Math.random()*6],i*3);d.spinRate.set([(Math.random()-.5)*16,(Math.random()-.5)*16,(Math.random()-.5)*16],i*3);d.life[i]=4+Math.random()*2;
   d.mesh.setColorAt(i,color.set(tint));if(d.mesh.instanceColor)d.mesh.instanceColor.needsUpdate=true;
  }
 }
 function updateDebris(dt:number){
  for(const d of debris){let live=false;for(let i=0;i<PER_TYPE;i++){
   if(d.life[i]<=0)continue;live=true;d.life[i]-=dt;const k=i*3,p=d.position,v=d.velocity;
   v[k+1]-=20*dt;p[k]+=v[k]*dt;p[k+1]+=v[k+1]*dt;p[k+2]+=v[k+2]*dt;
   if(p[k+1]<.08){p[k+1]=.08;if(v[k+1]<0)v[k+1]*=-.32;v[k]*=.7;v[k+2]*=.7;for(let a=0;a<3;a++)d.spinRate[k+a]*=.65;}
   for(let a=0;a<3;a++)d.rotation[k+a]+=d.spinRate[k+a]*dt;
   const size=d.life[i]<.6?Math.max(0,d.life[i]/.6):1;
   debrisQuat.setFromEuler(debrisEuler.set(d.rotation[k],d.rotation[k+1],d.rotation[k+2]));debrisMatrix.compose(vec.set(p[k],p[k+1],p[k+2]),debrisQuat,scl.setScalar(CAR_SCALE*.8*size)).multiply(d.local);d.mesh.setMatrixAt(i,debrisMatrix);
  }if(live)d.mesh.instanceMatrix.needsUpdate=true;}
 }

 const poses:Pose[]=Array.from({length:cars},()=>({x:0,z:0,heading:0,speed:0,steer:0,acceleration:0})),spin=new Float64Array(cars),pitch=new Float64Array(cars),roll=new Float64Array(cars),painted:string[]=[],chassisOf:(Chassis|undefined)[]=[],joltAmp=new Float64Array(cars),joltAge=new Float64Array(cars);
 const root=new T.Matrix4(),wheel=new T.Matrix4(),euler=new T.Euler(0,0,0,'YXZ'),carQuat=new T.Quaternion(),carScale=new T.Vector3(CAR_SCALE,CAR_SCALE,CAR_SCALE),carPosition=new T.Vector3(),color=new T.Color(),dummy=new T.Object3D(),hub=new T.Vector3(),wheelRotation=new T.Matrix4(),spinRotation=new T.Matrix4();
 const local3=(x:number,y:number,z:number,heading:number,out:T.Vector3)=>out.set(x*Math.cos(heading)+z*Math.sin(heading),y,-x*Math.sin(heading)+z*Math.cos(heading));
 let initialized=false,view=0,camHeading=0,lastMotion:Motion|null=null,rearView=false,trauma=0,shakeScale=1,shakeTime=0,lift=0;
 const look=new T.Vector3(),lookTarget=new T.Vector3(),target=new T.Vector3(),sunPoint=new T.Vector3(),lightOffset=new T.Vector3(-70,110,40),tmp=new T.Vector3();

 function assignChassis(list:Car[]){
  for(const p of parts.values())p.slots.length=0;
  list.forEach((c,i)=>{chassisOf[i]=c.chassis;parts.get(c.chassis)!.slots.push(i);});
  for(const p of parts.values()){p.body.count=p.slots.length;for(const w of p.wheels)w.mesh.count=p.slots.length;}
  painted.length=0;
 }
 const lastMarkX=new Float32Array(cars*2).fill(NaN),lastMarkZ=new Float32Array(cars*2);
 function layMark(k:number,x:number,z:number){
  if(Number.isNaN(lastMarkX[k])){lastMarkX[k]=x;lastMarkZ[k]=z;return;}
  const length=Math.hypot(x-lastMarkX[k],z-lastMarkZ[k]);if(length<.6)return;
  if(length<3){dummy.position.set((x+lastMarkX[k])/2,.03,(z+lastMarkZ[k])/2);dummy.rotation.set(0,Math.atan2(x-lastMarkX[k],z-lastMarkZ[k]),0);dummy.scale.set(1,1,length);dummy.updateMatrix();marks.setMatrixAt(markNext,dummy.matrix);markNext=(markNext+1)%MARKS;marks.count=Math.min(MARKS,Math.max(marks.count,markNext||MARKS));marks.instanceMatrix.needsUpdate=true;}
  lastMarkX[k]=x;lastMarkZ[k]=z;
 }
 function emitEffects(c:Car,p:Pose,carIndex:number,race:Race,dt:number){
  if(dt<=0)return;
  const offroad=Math.abs(c.lane)>ROAD_HALF,skid=carIndex===0?race.skid:c.spin>0&&Math.abs(p.speed)>3?.9:c.brake>0&&p.speed>24&&p.acceleration<-24?.55:0;
  if(Math.hypot(p.x-camera.position.x,p.z-camera.position.z)>90){lastMarkX[carIndex*2]=lastMarkX[carIndex*2+1]=NaN;return;}
  for(const side of [-1,1]){
   const k=carIndex*2+(side>0?1:0);
   local3(side*.62*CAR_SCALE,.25,-.9*CAR_SCALE,p.heading,hub).add(tmp.set(p.x,0,p.z));
   if(offroad&&p.speed>5&&Math.random()<dt*28)smoke.emit(hub.x,.3,hub.z,(Math.random()-.5)*2,1.2+Math.random(),(Math.random()-.5)*2,.48,.42,.3,.55,.9,2.4,.9);
   if(skid>.25&&Math.random()<dt*36*skid)smoke.emit(hub.x,.3,hub.z,(Math.random()-.5),.8+Math.random()*.6,(Math.random()-.5),.86,.86,.84,.42*skid,.8,3,1.1);
   if(!offroad&&skid>.35)layMark(k,hub.x,hub.z);else lastMarkX[k]=NaN;
  }
  // Sparks where the car is scraping along a barrier.
  if(c.scrape>.4&&Math.abs(p.speed)>5){const side=c.lane>=0?1:-1;for(let n=0;n<3;n++)if(Math.random()<dt*60){local3(-side*CAR_HALF_WIDTH,.35,(Math.random()-.5)*3,p.heading,hub).add(tmp.set(p.x,0,p.z));sparks.emit(hub.x,hub.y,hub.z,-Math.sin(p.heading)*p.speed*.3+(Math.random()-.5)*3,1+Math.random()*3,-Math.cos(p.heading)*p.speed*.3+(Math.random()-.5)*3,1,.8,.35,1,.28,-.3,.3,12);}}
  // A badly damaged car trails dark smoke.
  if(c.damage>45&&Math.random()<dt*(c.damage-40)*.25){local3(0,.9,-.6*CAR_SCALE,p.heading,hub).add(tmp.set(p.x,0,p.z));smoke.emit(hub.x,hub.y,hub.z,(Math.random()-.5),1.5+Math.random(),(Math.random()-.5),.22,.22,.24,.5,.9,2.6,1.6);}
  if(c.boostActive&&Math.random()<dt*40){local3(0,.42,-1.35*CAR_SCALE,p.heading,hub).add(tmp.set(p.x,0,p.z));sparks.emit(hub.x,hub.y,hub.z,-Math.sin(p.heading)*6+(Math.random()-.5)*2,Math.random(),-Math.cos(p.heading)*6+(Math.random()-.5)*2,1,.55,.2,.9,.5,-.4,.28);}
 }

 function draw(race:Race,motion:Motion,alpha:number,dt:number,preview:boolean,animate:boolean,lookBack=false){
  if(rearView!==lookBack){rearView=lookBack;initialized=false;}
  const list=[race.player,...race.opponents];
  const reset=lastMotion!==motion;if(reset){initialized=false;lastMotion=motion;spin.fill(0);pitch.fill(0);roll.fill(0);assignChassis(list);marks.count=0;markNext=0;lastMarkX.fill(NaN);joltAmp.fill(0);for(const d of debris){d.life.fill(0);for(let i=0;i<PER_TYPE;i++)d.mesh.setMatrixAt(i,debrisMatrix.makeScale(0,0,0));d.mesh.instanceMatrix.needsUpdate=true;}}
  if(list.some((c,i)=>c.chassis!==chassisOf[i]))assignChassis(list);
  const motionDt=animate?Math.min(dt,.1):0;
  for(const p of parts.values())p.slots.forEach((carIndex,slot)=>{
   const c=list[carIndex],pose=interpolate(motion,carIndex,alpha,poses[carIndex]);
   spin[carIndex]+=pose.speed*motionDt/(.3*CAR_SCALE);pitch[carIndex]=damp(pitch[carIndex],-Math.max(-40,Math.min(20,pose.acceleration))*.0012,7,motionDt);roll[carIndex]=damp(roll[carIndex],pose.steer*Math.min(pose.speed/40,1)*.03,7,motionDt);
   // Impact jolt: a quick hop and rattle that decays in about half a second.
   joltAge[carIndex]+=motionDt;const jolt=joltAmp[carIndex]*Math.exp(-joltAge[carIndex]*5.5),rattle=jolt*Math.sin(joltAge[carIndex]*34);
   carPosition.set(pose.x,.03+Math.abs(Math.sin(joltAge[carIndex]*20))*jolt*.22,pose.z);euler.set(pitch[carIndex]+rattle*.05,pose.heading,roll[carIndex]+rattle*.09,'YXZ');carQuat.setFromEuler(euler);root.compose(carPosition,carQuat,carScale);
   p.body.setMatrixAt(slot,wheel.multiplyMatrices(root,p.bodyLocal));
   for(const w of p.wheels){wheelRotation.makeRotationY(w.front?-pose.steer*.35:0);spinRotation.makeRotationX(spin[carIndex]);wheel.copy(root).multiply(local.makeTranslation(w.hub.x,w.hub.y,w.hub.z)).multiply(wheelRotation).multiply(spinRotation).multiply(w.local);w.mesh.setMatrixAt(slot,wheel);}
   if(painted[carIndex]!==c.color){painted[carIndex]=c.color;color.set(c.color);p.body.setColorAt(slot,color);if(p.body.instanceColor)p.body.instanceColor.needsUpdate=true;}
   // Brake lights and boost flame ride on the same root transform.
   const braking=c.brake>0&&c.speed>.5;
   wheel.copy(root).multiply(local.compose(vec.set(0,.42,-1.29),quat.identity(),scl.set(braking?.5:0,braking?.07:0,.03)));brakeLights.setMatrixAt(carIndex,wheel);
   const flicker=c.boostActive?.8+Math.sin(performance.now()*.05+carIndex)*.25:0;
   wheel.copy(root).multiply(local.compose(vec.set(0,.4,-1.28),quat.identity(),scl.set(flicker*.8,flicker*.8,flicker*1.3)));flames.setMatrixAt(carIndex,wheel);
   dummy.position.set(pose.x,.06,pose.z);dummy.rotation.set(-Math.PI/2,pose.heading,0,'YXZ');dummy.scale.set(2.6,5.2,1);dummy.updateMatrix();shadows.setMatrixAt(carIndex,dummy.matrix);
   emitEffects(c,pose,carIndex,race,motionDt);
  });
  for(const mesh of batches)mesh.instanceMatrix.needsUpdate=true;
  smoke.update(motionDt);sparks.update(motionDt);updateDebris(motionDt);

  // Chase camera: lower and wider with speed, boost widens further, impacts add decaying trauma shake.
  const p=poses[0],cameraDt=animate||preview?Math.min(dt,.1):0,speed01=Math.min(1,Math.abs(p.speed)/49);
  // While the car spins, the camera follows the direction of travel rather than the rotating nose.
  const follow=race.player.spin>0?race.player.slide:p.heading,followRate=race.player.spin>0?2.5:7;
  if(!initialized)camHeading=follow;else camHeading=angleLerp(camHeading,follow,1-Math.exp(-followRate*cameraDt));
  const fx=Math.sin(camHeading)*(rearView?-1:1),fz=Math.cos(camHeading)*(rearView?-1:1);
  // Rise over a car tucked in directly behind the player so it never hides the player's car.
  let blocked=false;for(let i=1;i<cars;i++){const o=poses[i],dx=o.x-p.x,dz=o.z-p.z,along=dx*fx+dz*fz,across=dx*fz-dz*fx;if(along<-1.5&&along>-9&&Math.abs(across)<2.6){blocked=true;break;}}
  lift=damp(lift,blocked&&!preview?2.6:0,3,cameraDt);
  if(preview){target.set(p.x-fx*27+fz*13,15,p.z-fz*27-fx*13);lookTarget.set(p.x+fx*27,1,p.z+fz*27);}else{const gap=(view?14:9.5)+speed01*1.2;target.set(p.x-fx*gap,4.9-speed01*.7+(view?2.1:0)+lift,p.z-fz*gap);lookTarget.set(p.x+fx*15,1.3,p.z+fz*15);}
  if(!initialized||Math.hypot(camera.position.x-target.x,camera.position.z-target.z)>55){camera.position.copy(target);look.copy(lookTarget);initialized=true;}else{camera.position.lerp(target,1-Math.exp(-7*cameraDt));look.lerp(lookTarget,1-Math.exp(-10*cameraDt));}
  if(animate){if(race.kerb)trauma=Math.max(trauma,.22);if(race.offroad&&p.speed>6)trauma=Math.max(trauma,.3);trauma=Math.max(0,trauma-1.4*cameraDt);shakeTime+=cameraDt*32;}
  const shake=trauma*trauma*shakeScale;
  camera.position.x+=Math.sin(shakeTime*1.7)*.32*shake;camera.position.y+=Math.sin(shakeTime*2.3)*.22*shake;
  camera.lookAt(look);if(shake)camera.rotateZ(Math.sin(shakeTime*1.1)*.025*shake);
  const fov=damp(camera.fov,57+speed01*6+(race.boosting?5:0),4,cameraDt);if(Math.abs(fov-camera.fov)>.0001){camera.fov=fov;camera.updateProjectionMatrix();}
  sunPoint.set(p.x,0,p.z);sun.target.position.copy(sunPoint);sun.position.copy(sunPoint).add(lightOffset);renderer.render(scene,camera);
  // Undo the shake offset so smoothing continues from the steady chase position.
  camera.position.x-=Math.sin(shakeTime*1.7)*.32*shake;camera.position.y-=Math.sin(shakeTime*2.3)*.22*shake;
 }
 return{draw,circuitId:circuit.definition.id,gridSize,webgl:renderer,
  resize(width:number,height:number){renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix();for(const p of [smoke,sparks])p.material.uniforms.scale.value=height*.9;},
  camera(){view=1-view;},
  /** Adds camera trauma (0-1). Shake is trauma squared, so small bumps barely move. */
  impulse(amount:number){trauma=Math.min(1,trauma+amount);},
  /** Crash presentation for a simulation impact: sparks, smoke, debris, body jolt and camera trauma. */
  crash(event:Extract<RaceEvent,{type:'impact'}>,list:Car[]){
   const {x,z,intensity,heavy}=event,near=Math.hypot(x-camera.position.x,z-camera.position.z)<120;
   for(const index of [event.car,event.other])if(index>=0){joltAmp[index]=Math.max(joltAmp[index]*Math.exp(-joltAge[index]*5.5),.25+intensity*.75);joltAge[index]=0;}
   if(event.car===0||event.other===0)trauma=Math.min(1,trauma+(heavy?.85:.2+intensity*.45));
   if(!near)return;
   const count=Math.round(6+intensity*30);
   for(let n=0;n<count;n++)sparks.emit(x,.4+Math.random()*.6,z,(Math.random()-.5)*12,2+Math.random()*6,(Math.random()-.5)*12,1,.7+Math.random()*.3,.3,1,.3+Math.random()*.35,-.4,.35+Math.random()*.4,16);
   for(let n=0;n<3+intensity*9;n++)smoke.emit(x+(Math.random()-.5)*1.5,.5,z+(Math.random()-.5)*1.5,(Math.random()-.5)*2,.8+Math.random(),(Math.random()-.5)*2,.72,.7,.66,.5,1.2,3.4,1.4);
   const pieces=heavy?3+Math.round(intensity*3):event.kind==='car'&&intensity>.45?1:0;
   if(pieces){const crashed=list[event.car]??list[0];throwDebris(x,z,pieces,crashed.color,3+intensity*6);if(event.kind==='car'&&event.other>=0&&heavy)throwDebris(x,z,2,list[event.other].color,4);}
  },
  setShakeScale(value:number){shakeScale=value;},
  diagnostics(){return{cars:gridSize,circuit:circuit.definition.id,vehicleBatches:batches.length,sceneryBatches:instanced.length,drawCalls:renderer.info.render.calls,triangles:renderer.info.render.triangles,memory:{...renderer.info.memory},cameraHeading:angle(camHeading),rearView,fov:camera.fov,playerPose:{...poses[0]},particles:{trauma}};},
  dispose(disposeKit=true){for(const mesh of [...batches,...instanced,marks,...debris.map(d=>d.mesh)])mesh.dispose();for(const g of geometries)g.dispose();for(const m of materials)m.dispose();for(const t of textures)t.dispose();if(disposeKit)kit.traverse(n=>{const m=n as T.Mesh;if(m.isMesh){m.geometry.dispose();(m.material as T.MeshStandardMaterial).map?.dispose();(m.material as T.Material).dispose();}});sun.shadow.map?.dispose();if(disposeKit)renderer.dispose();},
 };
}
