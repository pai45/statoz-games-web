import * as THREE from 'three';
import {mergeGeometries} from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import {chooseRenderProfile} from './render-profile.mjs';
const params=new URLSearchParams(location.search);
export const renderProfile=chooseRenderProfile({quality:params.get('quality')||'auto',coarse:matchMedia('(any-pointer:coarse)').matches,dpr:devicePixelRatio||1,lite:params.has('lite')});
document.documentElement.dataset.vibeGraphics=renderProfile.fast?'performance':'high';

function batchEnvironment(scene,nodes,env){
 const protectedNodes=new Set();
 for(const object of [...(env.nearFence||[]),...(env.beacons||[])])object.traverse(node=>protectedNodes.add(node));
 scene.updateMatrixWorld(true);const groups=new Map();let removed=0;
 for(const node of nodes){
  if(!node.isMesh||node.isSkinnedMesh||protectedNodes.has(node)||!node.visible||Array.isArray(node.material)||node.material.transparent||!node.geometry.attributes.normal)continue;
  const geo=node.geometry;
  if(Object.keys(geo.morphAttributes).length)continue;
  const key=[node.material.uuid,!!geo.index,Object.keys(geo.attributes).sort().map(name=>name+geo.attributes[name].itemSize).join(','),node.castShadow,node.receiveShadow,node.renderOrder].join('|');
  if(!groups.has(key))groups.set(key,[]);groups.get(key).push(node);
 }
 for(const items of groups.values()){
  if(items.length<2)continue;
  const copies=items.map(node=>node.geometry.clone().applyMatrix4(node.matrixWorld));
  const geometry=mergeGeometries(copies,false);for(const copy of copies)copy.dispose();if(!geometry)continue;
  const first=items[0],mesh=new THREE.Mesh(geometry,first.material);mesh.castShadow=first.castShadow;mesh.receiveShadow=first.receiveShadow;mesh.renderOrder=first.renderOrder;mesh.name='vibe-static-batch';
  for(const node of items)node.removeFromParent();scene.add(mesh);removed+=items.length-1;
 }
 nodes.clear();return removed;
}
function simplifyMaterials(scene){
 const done=new Set();
 scene.traverse(object=>{
  if(!object.isMesh)return;
  for(const mat of Array.isArray(object.material)?object.material:[object.material]){
   if(!mat||done.has(mat))continue;done.add(mat);
   if(mat.isMeshPhysicalMaterial){
    // Alpha glass keeps the backboard legible without a second full-scene transmission render.
    if(mat.transmission>0){mat.transmission=0;mat.opacity=.58;mat.transparent=true;}
    mat.clearcoat=0;mat.sheen=0;mat.needsUpdate=true;
   }
  }
 });
}
export function prepareMobileScene(scene,env,nodes){
 if(!renderProfile.fast){nodes.clear();return 0;}
 for(const {spot} of env.floods.slice(2))spot.visible=false;
 return batchEnvironment(scene,nodes,env);
}
export function createPerformanceController(renderer,scene,batched){
 if(renderProfile.fast)simplifyMaterials(scene);
 let ratio=renderProfile.maxDpr,last=0,start=0,count=0,total=0,changedAt=0,changes=0;
 function resize(){
  const app=document.getElementById('app'),w=app.clientWidth,h=app.clientHeight;
  const next=Math.min(ratio,Math.sqrt(renderProfile.maxPixels/Math.max(1,w*h)));
  if(Math.abs(renderer.getPixelRatio()-next)>.01)renderer.setPixelRatio(next);
 }
 function frame(now){
  const gap=last?now-last:0;last=now;if(!renderProfile.adaptive||document.hidden||window.__VIBE_HOST__?.paused){start=0;count=0;total=0;return;}
  if(!start){start=now;return;}
  if(gap>0&&gap<120){count++;total+=gap;}
  if(now-start<2000)return;
  if(count>=20&&total/count>24&&ratio>renderProfile.minDpr&&now-changedAt>3500){ratio=Math.max(renderProfile.minDpr,ratio-.15);resize();changedAt=now;changes++;}
  start=now;count=0;total=0;
 }
 const api={resize,frame,snapshot:()=>({requested:renderProfile.requested,fast:renderProfile.fast,shadows:renderer.shadowMap.enabled,bloom:renderProfile.bloom,pixelRatio:renderer.getPixelRatio(),buffer:[renderer.domElement.width,renderer.domElement.height],batchedDrawsSaved:batched,adaptiveChanges:changes,drawCalls:renderer.info.render.calls,triangles:renderer.info.render.triangles})};
 window.__VIBE_PERFORMANCE__=api;resize();return api;
}
