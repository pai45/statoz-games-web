import {REFERENCE_TUNING as T} from "./reference-tuning";
import {courtPoint,cameraOrigin} from "./view";
import * as THREE from "three";
import { COURT, type Match } from "./simulation";
import { poseFor,overlayFor, type Pictures } from "./presentation";

/** Three owns presentation only. No outcome or possession changes occur here. */
export function createRenderer(canvas:HTMLCanvasElement,pictures:Pictures) {
  const renderer=new THREE.WebGLRenderer({canvas,alpha:false,antialias:false,powerPreference:"low-power"});
  let width=canvas.width;renderer.setPixelRatio(1);renderer.setSize(width,360,false);renderer.setClearColor(0x111c30);
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  const scene=new THREE.Scene(),camera=new THREE.OrthographicCamera(0,width,360,0,-1000,1000);
  camera.position.z=500;
  const textures:Record<string,THREE.Texture>={},materials:Record<string,THREE.SpriteMaterial>={};
  for(const [key,img] of Object.entries(pictures)) {
    const tex=new THREE.Texture(img);tex.needsUpdate=true;tex.magFilter=THREE.NearestFilter;tex.minFilter=THREE.NearestFilter;tex.colorSpace=THREE.SRGBColorSpace;textures[key]=tex;
    materials[key]=new THREE.SpriteMaterial({map:tex,transparent:true,depthTest:false,depthWrite:false});
  }
  const sprite=(key:string,w:number,h:number)=>{const sp=new THREE.Sprite(materials[key]);sp.scale.set(w,h,1);scene.add(sp);return sp;};
  const floor=sprite("court",900,360);floor.position.set(450,180,0);floor.renderOrder=-100;
  const actors=Array.from({length:6},()=>sprite("navy-s-ready-source",144,128));
  const arms=Array.from({length:6},()=>sprite("navy-dribble-arm-00-source",144,128));
  const ball=sprite("ball",11,11),left=sprite("left",47,75),right=sprite("right",92,75);
  left.position.set(85-31+47/2,360-(COURT.rimY-COURT.rimZ-48+75/2),0);right.position.set(815-13+46,360-(COURT.rimY-COURT.rimZ-48+37.5),0);
  left.renderOrder=right.renderOrder=1000;
  const ringCanvas=document.createElement("canvas");ringCanvas.width=48;ringCanvas.height=16;
  const ctx=ringCanvas.getContext("2d")!;ctx.font="bold 10px monospace";ctx.textAlign="center";ctx.fillStyle="#191810";ctx.fillText("1P",25,11);ctx.fillStyle="#ef3c27";ctx.fillText("1P",24,10);ctx.beginPath();ctx.moveTo(20,12);ctx.lineTo(28,12);ctx.lineTo(24,16);ctx.fill();
  const ringTexture=new THREE.CanvasTexture(ringCanvas),ringMaterial=new THREE.SpriteMaterial({map:ringTexture,depthTest:false,transparent:true});
  const ring=new THREE.Sprite(ringMaterial);ring.scale.set(48,16,1);scene.add(ring);
  const shadowCanvas=document.createElement("canvas");shadowCanvas.width=40;shadowCanvas.height=12;
  const shadowContext=shadowCanvas.getContext("2d")!;shadowContext.fillStyle="#0007";shadowContext.beginPath();shadowContext.ellipse(20,6,18,4,0,0,Math.PI*2);shadowContext.fill();
  const shadowTexture=new THREE.CanvasTexture(shadowCanvas);shadowTexture.magFilter=THREE.NearestFilter;
  const shadowMaterial=new THREE.SpriteMaterial({map:shadowTexture,transparent:true,depthTest:false,depthWrite:false});
  const shadows=Array.from({length:7},()=>{const sp=new THREE.Sprite(shadowMaterial);scene.add(sp);return sp;});
  let disposed=false;
  return {
    draw(s:Match){if(disposed)return;floor.material=materials["court-"+(Math.floor(s.tick/T.crowdFrameTicks)%T.crowdFrames)]??materials.court;camera.left=cameraOrigin(s,width);camera.right=camera.left+width;camera.updateProjectionMatrix();
      for(const a of s.actors){
        const p=courtPoint(a.x,a.y,a.z+52),scale=p.scale,sp=actors[a.id];
        sp.material=materials[poseFor(s,a)];sp.scale.set(144*scale,128*scale,1);sp.position.set(Math.round(p.x),360-Math.round(p.y),0);sp.renderOrder=a.y;
        const overlay=overlayFor(s,a),arm=arms[a.id];arm.visible=!!overlay;
        if(overlay){arm.material=materials[overlay.key];arm.scale.copy(sp.scale);arm.position.copy(sp.position);arm.position.y-=overlay.y*scale;arm.renderOrder=a.y+.01;}
        const ground=courtPoint(a.x,a.y),shadow=shadows[a.id],size=Math.max(.55,1-a.z/250)*scale;
        shadow.position.set(Math.round(ground.x),360-Math.round(ground.y),0);shadow.scale.set(40*size,12*size,1);shadow.renderOrder=a.y-.3;
      }
      const b=courtPoint(s.ball.x,s.ball.y,s.ball.z);ball.scale.set(11*b.scale,11*b.scale,1);ball.position.set(Math.round(b.x),360-Math.round(b.y),0);ball.renderOrder=s.ball.y+.1;
      const ground=courtPoint(s.ball.x,s.ball.y),ballShadow=shadows[6];ballShadow.position.set(ground.x,360-ground.y,0);ballShadow.scale.set(12*ground.scale,4*ground.scale,1);ballShadow.renderOrder=s.ball.y-.2;
      for(const [sp,x,offset,w] of [[left,85,31,47],[right,815,13,92]] as const){const p=courtPoint(x,COURT.rimY);sp.scale.set(w*p.scale,75*p.scale,1);sp.position.set(p.x+(w/2-offset)*p.scale,360-(p.y-(COURT.rimZ+48-37.5)*p.scale),0);}
      const a=s.actors[s.selected],marker=courtPoint(a.x,a.y,a.z+124);ring.scale.set(48*marker.scale,16*marker.scale,1);ring.position.set(marker.x,360-marker.y,0);ring.renderOrder=a.y+.05;
      renderer.render(scene,camera);
    },
    resize(nextWidth:number){if(disposed||!Number.isFinite(nextWidth))return;width=Math.max(320,Math.min(900,Math.round(nextWidth)));renderer.setSize(width,360,false);},
    info:()=>({drawCalls:renderer.info.render.calls,textures:renderer.info.memory.textures}),
    dispose(){if(disposed)return;disposed=true;for(const tex of Object.values(textures))tex.dispose();for(const m of Object.values(materials))m.dispose();ringTexture.dispose();ringMaterial.dispose();shadowTexture.dispose();shadowMaterial.dispose();scene.clear();renderer.dispose();renderer.forceContextLoss();}
  };
}
