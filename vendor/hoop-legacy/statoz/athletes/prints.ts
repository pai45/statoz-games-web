import * as THREE from 'three';
import type {CharacterLook} from '../../src/game/world/Character';
import {drawEmblem,FONT_DISPLAY} from '../../src/game/world/textures';

/** Thin outlined, legible basketball lettering in the authored wrap UVs. */
export function paintAuthoredPrints(look:CharacterLook,size:number) {
  const jersey=look.jersey,team=look.team;
  const make=(width:number,height:number)=>{
    const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;
    return {canvas,ctx:canvas.getContext('2d')!};
  };
  const {canvas,ctx}=make(size,size/2);
  const height=size/2,span=.885-.528,pxY=height/span,pxX=size/(Math.PI*2*.09),sx=pxX/pxY;
  const vy=(y:number)=>(.885-y)/span*height;
  const base=new THREE.Color(jersey.base),luma=base.r*.2126+base.g*.7152+base.b*.0722;
  const edge=luma>.5?'#20232a':'#f4f0e5';
  const lettering=(text:string,x:number,y:number,px:number,maxWidth:number)=>{
    ctx.save();ctx.translate(x,y);ctx.font=`900 ${px}px ${FONT_DISPLAY}`;
    const width=ctx.measureText(text).width;
    ctx.scale(Math.min(sx,maxWidth/Math.max(1,width)),1);
    ctx.textAlign='center';ctx.textBaseline='middle';ctx.lineJoin='round';
    ctx.strokeStyle=edge;ctx.lineWidth=Math.max(1,px*.026);ctx.strokeText(text,0,0);
    ctx.fillStyle=jersey.number;ctx.fillText(text,0,0);ctx.restore();
  };
  const number=String(look.number);
  lettering((team?.name||'HOOP LEGACY').toUpperCase(),size*.5,vy(.755),pxY*.029,size*.25);
  lettering(number,size*.5,vy(.682),pxY*.098,size*.17);
  for(const x of [0,size]) {
    lettering((look.name||'LEGACY').toUpperCase(),x,vy(.787),pxY*.025,size*.26);
    lettering(number,x,vy(.706),pxY*.108,size*.19);
  }
  ctx.fillStyle=jersey.trim;ctx.fillRect(size*.575,vy(.575),size*.027,4);
  ctx.fillStyle=edge;ctx.font=`900 ${size*.008}px ${FONT_DISPLAY}`;ctx.fillText('HL',size*.58,vy(.575)+size*.012);
  const front=new THREE.CanvasTexture(canvas);front.colorSpace=THREE.SRGBColorSpace;front.flipY=false;front.wrapS=THREE.RepeatWrapping;front.anisotropy=4;
  const shortsCanvas=make(size/2,size/4),sctx=shortsCanvas.ctx;
  if(team){sctx.save();sctx.translate(size*.25,size*.16);sctx.scale(1.2,.7);drawEmblem(sctx,{abbr:team.abbr,primary:team.primary,secondary:team.secondary,name:team.name},0,0,size*.025);sctx.restore();}
  const shorts=new THREE.CanvasTexture(shortsCanvas.canvas);shorts.colorSpace=THREE.SRGBColorSpace;shorts.flipY=false;shorts.wrapS=THREE.RepeatWrapping;shorts.anisotropy=4;
  return {front,shorts};
}
