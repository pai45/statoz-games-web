import * as THREE from "three";
import {refImage,referenceManifest} from "./reference-assets";
import { poses, type CarPose } from "./art";
import { sampleTrack, vehicles, propSpacing, roadsideProp,modulo } from "./data";
import { projectedCar, roadProjection, CAMERA_TRAIL, cameraDistance, mapPoints } from "./projection";
import {drawRaceHud,pixelText} from "./presentation";
import type { CarState, RaceSnapshot, TrackDefinition } from "./types";
import {paintEnhancedPanorama,paintEnhancedProp,paintObstacle} from './environment-art';

/** One production renderer for live play and deterministic review captures. */
export class CircuitRenderer {
  readonly renderer:THREE.WebGLRenderer;
  private scene=new THREE.Scene();
  private camera=new THREE.OrthographicCamera(0,480,0,270,-100,100);
  private road:THREE.Mesh<THREE.BufferGeometry,THREE.MeshBasicMaterial>;
  private positions=new Float32Array(80*24*6*3);
  private colors=new Float32Array(80*24*6*3);
  private textures:THREE.Texture[]=[];
  private materials=new Map<string,THREE.MeshBasicMaterial>();
  private cars:THREE.Mesh<THREE.PlaneGeometry,THREE.MeshBasicMaterial>[]=[];
  private scenery:THREE.Mesh<THREE.PlaneGeometry,THREE.MeshBasicMaterial>[]=[];
  private sceneryMaterials:THREE.MeshBasicMaterial[]=[];
  private propMaterials:THREE.MeshBasicMaterial[]=[];
  private geometry=new THREE.PlaneGeometry(1,1);
  private disposed=false;
  private onLost:(event:Event)=>void;
  private scratchColor=new THREE.Color();
  private billboardMaterials:THREE.MeshBasicMaterial[]=[];
  private panorama:THREE.Mesh<THREE.PlaneGeometry,THREE.MeshBasicMaterial>;
  private hudCanvas=document.createElement('canvas');
  private hudTexture:THREE.CanvasTexture;
  private map;
  private shadows:THREE.Mesh<THREE.PlaneGeometry,THREE.MeshBasicMaterial>[]=[];
  private obstacles:THREE.Mesh<THREE.PlaneGeometry,THREE.MeshBasicMaterial>[]=[];
  private obstacleMaterials=new Map<string,THREE.MeshBasicMaterial>();
  inspection=false;
  constructor(canvas:HTMLCanvasElement,readonly track:TrackDefinition,onError:(message:string)=>void){
    this.renderer=new THREE.WebGLRenderer({canvas,antialias:false,alpha:false,powerPreference:"low-power",preserveDrawingBuffer:true});
    this.renderer.setPixelRatio(1);this.renderer.setSize(480,270,false);this.renderer.outputColorSpace=THREE.SRGBColorSpace;
    this.renderer.localClippingEnabled=true;
    this.scene.background=new THREE.Color(track.sky);
    const geom=new THREE.BufferGeometry();geom.setAttribute("position",new THREE.BufferAttribute(this.positions,3).setUsage(THREE.DynamicDrawUsage));geom.setAttribute("color",new THREE.BufferAttribute(this.colors,3).setUsage(THREE.DynamicDrawUsage));
    this.road=new THREE.Mesh(geom,new THREE.MeshBasicMaterial({vertexColors:true,depthTest:false,side:THREE.DoubleSide}));this.road.frustumCulled=false;this.road.renderOrder=2;this.scene.add(this.road);
    const panoramaCanvas=document.createElement('canvas');panoramaCanvas.width=1024;panoramaCanvas.height=140;const pc=panoramaCanvas.getContext('2d')!;pc.imageSmoothingEnabled=false;paintEnhancedPanorama(pc,track);
    const panoramaTexture=new THREE.CanvasTexture(panoramaCanvas);panoramaTexture.magFilter=panoramaTexture.minFilter=THREE.NearestFilter;panoramaTexture.colorSpace=THREE.SRGBColorSpace;panoramaTexture.wrapS=THREE.RepeatWrapping;this.textures.push(panoramaTexture);
    const panoramaMaterial=new THREE.MeshBasicMaterial({map:panoramaTexture,depthTest:false,side:THREE.DoubleSide});this.sceneryMaterials.push(panoramaMaterial);this.panorama=new THREE.Mesh(this.geometry,panoramaMaterial);this.panorama.position.set(240,50,0);this.panorama.scale.set(1024,-100,1);this.panorama.renderOrder=1;this.scene.add(this.panorama);
    this.rect(0,100,480,170,track.ground,0);
    this.hudCanvas.width=480;this.hudCanvas.height=270;this.hudTexture=new THREE.CanvasTexture(this.hudCanvas);this.hudTexture.magFilter=this.hudTexture.minFilter=THREE.NearestFilter;this.hudTexture.colorSpace=THREE.SRGBColorSpace;this.textures.push(this.hudTexture);
    const hudMaterial=new THREE.MeshBasicMaterial({map:this.hudTexture,transparent:true,depthTest:false,side:THREE.DoubleSide});this.sceneryMaterials.push(hudMaterial);const hud=new THREE.Mesh(this.geometry,hudMaterial);hud.position.set(240,135,0);hud.scale.set(480,-270,1);hud.renderOrder=10000;this.scene.add(hud);this.map=mapPoints(track);
    const carTextures=new Map<string,THREE.Texture>();
    for(const vehicle of vehicles)for(const pose of poses)for(let edition=0;edition<3;edition++){
      const id=vehicle.id==='vector'?(pose==='left'?'white-left-visible':pose==='right'?'white-right-visible':'white-straight'):vehicle.id==='comet'?(pose==='left'?'orange-left-visible':'orange-near'):vehicle.id==='kestrel'?(pose==='left'?'purple-left-visible':pose==='right'?'purple-right-visible':'purple-straight'):'black-near';
      let texture=carTextures.get(id);if(!texture){texture=new THREE.Texture(refImage(id));texture.needsUpdate=true;texture.magFilter=texture.minFilter=THREE.NearestFilter;texture.colorSpace=THREE.SRGBColorSpace;this.textures.push(texture);carTextures.set(id,texture);}
      this.materials.set(vehicle.id+'/'+pose+'/'+edition,new THREE.MeshBasicMaterial({map:texture,transparent:true,depthTest:false,side:THREE.DoubleSide}));
    }
    for(const [vehicle,id]of [['comet','orange-distant'],['nomad','black-distant']]){const a=referenceManifest.assets.find(a=>a.id===id)!,im=refImage(id),c=document.createElement('canvas');c.width=80;c.height=40;const ctx=c.getContext('2d')!;ctx.imageSmoothingEnabled=false;ctx.drawImage(im,40-a.anchor[0]*1.9,34-a.anchor[1]*1.9,im.width*1.9,im.height*1.9);const t=new THREE.CanvasTexture(c);t.magFilter=t.minFilter=THREE.NearestFilter;t.colorSpace=THREE.SRGBColorSpace;this.textures.push(t);this.materials.set(vehicle+'/far',new THREE.MeshBasicMaterial({map:t,transparent:true,depthTest:false,side:THREE.DoubleSide}));}
    const shadowCanvas=document.createElement('canvas');shadowCanvas.width=80;shadowCanvas.height=12;const sc=shadowCanvas.getContext('2d')!;sc.fillStyle='#111318';sc.beginPath();sc.ellipse(40,6,26,4,0,0,Math.PI*2);sc.fill();const shadowTexture=new THREE.CanvasTexture(shadowCanvas);shadowTexture.magFilter=shadowTexture.minFilter=THREE.NearestFilter;this.textures.push(shadowTexture);
    for(let i=0;i<20;i++){const material=this.materials.get('vector/straight/0')!.clone();material.clippingPlanes=[new THREE.Plane(new THREE.Vector3(0,-1,0),270)];this.billboardMaterials.push(material);const mesh=new THREE.Mesh(this.geometry,material);mesh.frustumCulled=false;this.cars.push(mesh);this.scene.add(mesh);const sm=new THREE.MeshBasicMaterial({map:shadowTexture,transparent:true,opacity:.6,depthTest:false,side:THREE.DoubleSide});sm.clippingPlanes=[new THREE.Plane(new THREE.Vector3(0,-1,0),270)];this.billboardMaterials.push(sm);const shadow=new THREE.Mesh(this.geometry,sm);this.shadows.push(shadow);this.scene.add(shadow);}
    for(let kind=0;kind<8;kind++)this.propMaterials.push(this.makeScenery(kind));
    for(let i=0;i<44;i++){const material=this.propMaterials[0].clone();material.clippingPlanes=[new THREE.Plane(new THREE.Vector3(0,-1,0),270)];this.billboardMaterials.push(material);const mesh=new THREE.Mesh(this.geometry,material);mesh.frustumCulled=false;this.scenery.push(mesh);this.scene.add(mesh);}
    for(const kind of ['cone','barrel','barrier','rock'] as const){const c=document.createElement('canvas');c.width=c.height=64;paintObstacle(c.getContext('2d')!,kind);const t=new THREE.CanvasTexture(c);t.magFilter=t.minFilter=THREE.NearestFilter;t.colorSpace=THREE.SRGBColorSpace;this.textures.push(t);const m=new THREE.MeshBasicMaterial({map:t,transparent:true,depthTest:false,side:THREE.DoubleSide});this.obstacleMaterials.set(kind,m);}
    for(const obstacle of track.obstacles){const m=this.obstacleMaterials.get(obstacle.kind)!.clone();m.clippingPlanes=[new THREE.Plane(new THREE.Vector3(0,-1,0),270)];this.billboardMaterials.push(m);const mesh=new THREE.Mesh(this.geometry,m);mesh.frustumCulled=false;this.obstacles.push(mesh);this.scene.add(mesh);}
    this.onLost=event=>{event.preventDefault();onError("Graphics interrupted. Return to the garage and retry.");};canvas.addEventListener("webglcontextlost",this.onLost);
  }
  private rect(x:number,y:number,w:number,h:number,color:string,order=0){const material=new THREE.MeshBasicMaterial({color,depthTest:false,side:THREE.DoubleSide});this.sceneryMaterials.push(material);const mesh=new THREE.Mesh(this.geometry,material);mesh.position.set(x+w/2,y+h/2,0);mesh.scale.set(w,h,1);mesh.renderOrder=order;this.scene.add(mesh);}
  private makeScenery(kind:number){
    const c=document.createElement('canvas');c.width=64;c.height=96;const ctx=c.getContext('2d')!;ctx.imageSmoothingEnabled=false;paintEnhancedProp(ctx,this.track,kind);
    const texture=new THREE.CanvasTexture(c);texture.magFilter=texture.minFilter=THREE.NearestFilter;texture.colorSpace=THREE.SRGBColorSpace;this.textures.push(texture);return new THREE.MeshBasicMaterial({map:texture,transparent:true,depthTest:false,side:THREE.DoubleSide});
  }

  render(state:RaceSnapshot,previous?:readonly CarState[],alpha=1,inputSteer=0,braking=false){
    if(this.disposed)return;
    void inputSteer; // Host signature retained; pose steering comes from simulation.
    const lerp=(a:number,b:number)=>a+(b-a)*alpha;
    const player=previous?{...state.player,distance:lerp(previous[0].distance,state.player.distance),x:lerp(previous[0].x,state.player.x)}:state.player;
    if(state.phase==='finished'&&state.sequenceTime>0)player.distance+=Math.min(85,state.sequenceTime*35);
    const view={...state,player},points=roadProjection(view,this.track);let vertex=0;
    const quad=(a:{x:number;y:number;half:number},b:{x:number;y:number;half:number},left:number,right:number,color:string)=>{
      const c=this.scratchColor.set(color),xy=[a.x+a.half*left,a.y,a.x+a.half*right,a.y,b.x+b.half*right,b.y,a.x+a.half*left,a.y,b.x+b.half*right,b.y,b.x+b.half*left,b.y];
      for(let i=0;i<6;i++){const k=vertex++*3;this.positions[k]=xy[i*2];this.positions[k+1]=xy[i*2+1];this.positions[k+2]=0;this.colors[k]=c.r;this.colors[k+1]=c.g;this.colors[k+2]=c.b;}
    };
    for(let i=points.length-2;i>=0;i--){let a=points[i];const b=points[i+1],clip=Math.min(270,...points.slice(0,i).map(p=>p.y));
      if(b.y>=a.y||b.y>=clip)continue;
      if(a.y>clip){const t=(clip-a.y)/(b.y-a.y);a={...a,x:a.x+(b.x-a.x)*t,y:clip,half:a.half+(b.half-a.half)*t};}
      const ground=a.stripe?this.track.ground:this.track.verge;
      quad(a,b,-40,40,ground);quad(a,b,-1.045,1.045,a.stripe?"#efebe2":"#bd2319");quad(a,b,-1,1,this.track.road[Number(a.stripe)]);
      for(const lane of [-.333,.333])quad(a,b,lane-.022,lane+.022,a.stripe?"#e6e8df":this.track.road[1]);
      quad(a,b,1,1.5,a.pit?"#586f72":this.track.ground);quad(a,b,1.015,1.035,a.pit?"#d9c488":this.track.ground);
      // Narrow shoulder paint, a worn centre strip and stable roadside tufts.
      // These use road-distance segments, so detail advances with the road.
      quad(a,b,-.985,-.974,'#9eaaa0');quad(a,b,.974,.985,'#9eaaa0');
      quad(a,b,-.10,.10,this.track.id==='city'?(a.stripe?'#303542':'#3b414e'):(a.stripe?'#384b50':'#405256'));
      if(this.track.id!=='desert'){quad(a,b,-1.29,-1.26,a.stripe?'#c3c7be':'#788a8a');quad(a,b,1.26,1.29,a.pit?this.track.ground:a.stripe?'#c3c7be':'#788a8a');}
      const world=modulo(player.distance-CAMERA_TRAIL+a.distance,this.track.length);
      if(world<28){for(let square=0;square<18;square++)quad(a,b,-1+square/9,-1+(square+1)/9,(square+Math.floor(world/14))%2?'#f1eee2':'#111b24');}
      if(i<24){const patch=(Math.floor((player.distance-CAMERA_TRAIL+a.distance)/24)*17)%7/13;
        quad(a,b,-1.55-patch,-1.53-patch,this.track.id==='coast'?'#4e9b51':this.track.id==='desert'?'#e3b58a':'#697080');
        quad(a,b,1.7+patch,1.73+patch,this.track.id==='coast'?'#1e6e3c':this.track.id==='desert'?'#a87c60':'#30364d');}
    }
    this.road.geometry.setDrawRange(0,vertex);this.road.geometry.attributes.position.needsUpdate=true;this.road.geometry.attributes.color.needsUpdate=true;
    for(const car of state.cars){
      const mesh=this.cars[car.id],prior=previous?.[car.id],distance=car.id===0?CAMERA_TRAIL+(state.phase==='finished'?state.sequenceTime*75:0):cameraDistance(lerp(prior?.distance??car.distance,car.distance),player.distance,this.track.length);
      const x=car.id===0?player.x:lerp(prior?.x??car.x,car.x),p=projectedCar(distance,x,points);mesh.visible=!!p&&p.y-78*p.scale<p.occlusion&&distance>=0&&(car.id===0||(!car.dnf&&car.finishedAt===null));
      const shadow=this.shadows[car.id];shadow.visible=mesh.visible;if(!p)continue;
      let pose:CarPose=car.collisionCooldown>0?"contact":car.boost>0?"boost":(car.id===0&&braking)||(car.id!==0&&!!prior&&car.speed<prior.speed-.08)?"brake":car.id===0&&car.steering<-.18?"left":car.id===0&&car.steering>.18?"right":"straight";
      if(car.id!==0&&Math.abs(sampleTrack(this.track,car.distance).curve)>.25)pose=sampleTrack(this.track,car.distance).curve>0?"right":"left";
      mesh.material.map=(distance>300&&this.materials.has(car.vehicle+'/far')?this.materials.get(car.vehicle+'/far'):this.materials.get(`${car.vehicle}/${pose}/${car.id===0?0:car.id%3}`))!.map;mesh.material.clippingPlanes![0].constant=p.occlusion;
      const scale=p.scale*2.25;
      const contact=car.collisionCooldown>0?(Math.floor(state.elapsed*25)%2?2:-2):0;
      mesh.scale.set(80*scale,-40*scale,1);mesh.position.set(Math.round(p.x)+contact,Math.round(p.y-14*scale),1);mesh.renderOrder=3000-Math.floor(distance);
      shadow.visible=mesh.visible&&p.visible;shadow.position.set(Math.round(p.x),Math.round(p.y+1),0);shadow.scale.set(80*scale,-12*scale,1);shadow.renderOrder=mesh.renderOrder-.1;shadow.material.clippingPlanes![0].constant=p.occlusion;
    }
    for(let i=0;i<this.scenery.length;i++){
      const spacing=propSpacing(this.track),index=Math.floor((player.distance-CAMERA_TRAIL)/spacing)+i+1,d=cameraDistance(index*spacing,player.distance,this.track.length),prop=roadsideProp(this.track,index);
      const p=projectedCar(d,prop.x,points),mesh=this.scenery[i];mesh.visible=!!p&&p.y-104*p.scale<p.occlusion;if(!p)continue;
      mesh.material.map=this.propMaterials[prop.kind].map;mesh.material.clippingPlanes![0].constant=p.occlusion;
      mesh.position.set(p.x,p.y-72*p.scale,0);mesh.scale.set(100*p.scale,-150*p.scale,1);mesh.renderOrder=3000-Math.floor(d);
    }
    for(let i=0;i<this.track.obstacles.length;i++){const o=this.track.obstacles[i],d=cameraDistance(o.s,player.distance,this.track.length),p=projectedCar(d,o.x,points),mesh=this.obstacles[i];mesh.visible=!!p&&d>0&&p.y-100*p.scale<p.occlusion;if(!p)continue;const opaqueWidth={cone:45,barrel:30,barrier:52,rock:48}[o.kind],s=p.scale*(o.radius*740/opaqueWidth);mesh.position.set(Math.round(p.x),Math.round(p.y-28*s),0);mesh.scale.set(64*s,-64*s,1);mesh.renderOrder=3000-Math.floor(d);mesh.material.clippingPlanes![0].constant=p.occlusion;}
    this.panorama.material.map!.offset.x=state.player.distance/30000+sampleTrack(this.track,state.player.distance).curve*.045;
    const ctx=this.hudCanvas.getContext('2d')!;drawRaceHud(ctx,state,this.track,this.map);
    this.drawSequence(ctx,state);
    if(state.player.vehicle==='vector'&&state.player.inPit&&state.player.speed<.8){ctx.clearRect(0,0,480,270);ctx.imageSmoothingEnabled=false;ctx.fillStyle='#737888';ctx.fillRect(0,0,480,270);ctx.drawImage(refImage('pit-floor-patch'),0,0,480,270);ctx.drawImage(refImage('pit-bay-topdown'),0,45,480,180);ctx.drawImage(refImage('white-overhead-composite'),90,62,270,120);ctx.fillStyle='#071426';ctx.fillRect(0,0,480,39);ctx.fillRect(0,225,480,45);pixelText(ctx,'PIT LANE / REFUELLING',14,13,2,'#f7ecbd');pixelText(ctx,'FUEL '+Math.ceil(state.player.fuel)+' / 100',14,236,2,'#f7ecbd');ctx.fillStyle='#233b4b';ctx.fillRect(245,237,200,12);ctx.fillStyle='#70c54c';ctx.fillRect(245,237,Math.round(state.player.fuel*2),12);pixelText(ctx,'ACCEL TO LEAVE',308,258,1,'#eaf2df');this.hudTexture.needsUpdate=true;this.renderer.render(this.scene,this.camera);return;}
    const ego=projectedCar(CAMERA_TRAIL,player.x,points);if(ego){const s=ego.scale*2.25,x=Math.round(ego.x),y=Math.round(ego.y);
      if(state.player.boost>0){for(const dx of [-12,12]){ctx.fillStyle='#f38a2a';ctx.fillRect(Math.round(x+dx*s),y,Math.round(4*s),Math.floor(state.elapsed*30)%2?9:6);ctx.fillStyle='#fff0c4';ctx.fillRect(Math.round(x+(dx+1)*s),y,Math.round(2*s),5);}}
      if(braking&&state.player.speed>20){ctx.fillStyle='#e84a43';for(const dx of [-17,16])ctx.fillRect(Math.round(x+dx*s),Math.round(y-10*s),Math.round(5*s),2);}
      if(state.player.collisionCooldown>0&&Math.floor(state.elapsed*20)%2){ctx.fillStyle='#fff0ae';ctx.fillRect(x-52,y-20,5,2);ctx.fillRect(x+48,y-25,3,4);}
      if(this.inspection){ctx.strokeStyle='#53dcef';ctx.lineWidth=1;const l=projectedCar(CAMERA_TRAIL,player.x-.125,points)!,r=projectedCar(CAMERA_TRAIL,player.x+.125,points)!;ctx.strokeRect(Math.round(l.x),y-5,Math.round(r.x-l.x),10);ctx.fillStyle='#ffed91';ctx.fillRect(x-2,y-2,5,5);}
    }
    this.hudTexture.needsUpdate=true;
    this.renderer.render(this.scene,this.camera);
  }
  private drawSequence(c:CanvasRenderingContext2D,s:RaceSnapshot){
    if(s.phase==='countdown'){
      const progress=3-s.countdown,shift=Math.max(0,(.6-progress)*420);c.fillStyle='#091624e8';c.fillRect(107+shift,88,268,48);pixelText(c,this.track.name,121+shift,100,2,'#fff0b5');pixelText(c,'ROUND / THREE LAPS',173+shift,122,1,'#76d3e4');
      c.fillStyle='#121a24';c.fillRect(180,146,120,28);for(let i=0;i<3;i++){c.fillStyle=progress>=i?'#f15f41':'#51363c';c.fillRect(187+i*36,152,25,15);c.fillStyle=progress>=i?'#ffae68':'#70434b';c.fillRect(189+i*36,153,21,3);}pixelText(c,'READY',210,184,2);
    }else if(s.phase==='racing'&&s.elapsed<1.1){pixelText(c,'GO',215,119,4,'#d7fb92');}
    if(s.phase==='finished'){
      const t=s.sequenceTime,size=Math.min(7,2+Math.floor(t*3)),rank=String(s.position)+(s.position===1?'ST':s.position===2?'ND':s.position===3?'RD':'TH');pixelText(c,rank,240-rank.length*3*size,154-Math.min(56,t*24),size,'#fff0aa');pixelText(c,'CHEQUERED FLAG',165,188,2,'#f4ecdd');
    }else if(s.phase==='dnf'){c.fillStyle='#151a28de';c.fillRect(95,111,290,47);pixelText(c,'OUT OF FUEL',109,126,3,'#ffc18c');}
    if(s.phase==='racing'&&s.player.speed>70){const amount=Math.min(1,(s.player.speed-70)/45);for(let i=0;i<6;i++){const phase=(s.elapsed*6+i*.17)%1,x=i%2?476:4,y=150+phase*100;c.fillStyle=s.player.boost>0?'#bcecf6':'#c2c2ac';c.globalAlpha=amount*.7;c.fillRect(x,y,2,6+phase*16);}c.globalAlpha=1;}
  }
  diagnostics(){return {inspection:this.inspection,visibleCars:this.cars.filter(c=>c.visible).length,visibleObstacles:this.obstacles.filter(c=>c.visible).length,playerVisible:!!this.cars[0]?.visible,calls:this.renderer.info.render.calls,triangles:this.renderer.info.render.triangles,textures:this.renderer.info.memory.textures,geometries:this.renderer.info.memory.geometries,disposed:this.disposed};}
  dispose(){if(this.disposed)return;this.disposed=true;this.renderer.domElement.removeEventListener("webglcontextlost",this.onLost);this.road.geometry.dispose();this.road.material.dispose();this.geometry.dispose();for(const t of this.textures)t.dispose();for(const m of this.materials.values())m.dispose();for(const m of this.obstacleMaterials.values())m.dispose();for(const m of [...this.sceneryMaterials,...this.propMaterials,...this.billboardMaterials])m.dispose();this.scene.clear();this.renderer.dispose();this.renderer.forceContextLoss();}
}
