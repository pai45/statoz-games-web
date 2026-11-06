import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {MeshoptDecoder} from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import {B} from '../../src/game/world/character/rig';
import {store} from '../../src/state/store';
import {detectQuality, isHandheld,type QualityLevel} from '../../src/game/engine/quality';

export type Detail = 'lod1'|'lod0'|'hero';
type File = {file:string;bytes:number;sha256:string};
type RecordAsset = {slot:string;variant:string|null;glb:File;triangles:number;meshes:{name:string;morphs:string[]}[]};
export type Part = {geometry:THREE.BufferGeometry;morphs:string[]};
export type SetAssets = {level:Detail;assets:Map<string,{record:RecordAsset;parts:Part[]}>;textures:Map<string,THREE.Texture>;ms:number;bytes:number};
type Manifest = {version:number;bones:string[];levels:Record<Detail,{bytes:number;assets:Record<string,RecordAsset>;textures:Record<string,File&{srgb:boolean}>}>};
const base = `${import.meta.env.BASE_URL}athletes-v2/`;
const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
let manifestPromise:Promise<Manifest>|undefined;
const sets=new Map<Detail,SetAssets>(), pending=new Map<Detail,Promise<SetAssets>>();
const textureCache=new Map<string,Promise<THREE.Texture>>();
const geometryCache=new Map<string,Promise<Part[]>>();
let preferred:Detail='lod0';
let qualityRequest=0;
const gameLevel=(quality:QualityLevel):Detail=>quality==='low'||(quality==='medium'&&isHandheld())?'lod1':'lod0';
export const authoredStats={ready:false,fallback:false,loads:[] as {level:Detail;bytes:number;requestedBytes:number;reusedGeometries:number;ms:number}[],constructed:[] as number[]};
const floats=(a:THREE.BufferAttribute|THREE.InterleavedBufferAttribute)=>{
  const out=new Float32Array(a.count*a.itemSize);for(let i=0;i<a.count;i++)for(let k=0;k<a.itemSize;k++)out[i*a.itemSize+k]=a.getComponent(i,k);return out;
};
function extract(mesh:THREE.SkinnedMesh,morphs:string[],slot:string):Part {
  const source=mesh.geometry,g=new THREE.BufferGeometry(),matrix=mesh.matrixWorld.clone();
  if(mesh.skeleton){mesh.skeleton.update();matrix.multiply(mesh.bindMatrixInverse).multiply(new THREE.Matrix4().fromArray(mesh.skeleton.boneMatrices!,0)).multiply(mesh.bindMatrix);}
  const linear=matrix.clone().setPosition(0,0,0), normal=new THREE.Matrix3().getNormalMatrix(matrix);
  const remap=mesh.skeleton?.bones.map(b=>B[b.name as keyof typeof B]);
  for(const [name,attribute] of Object.entries(source.attributes)) {
    const a=attribute as THREE.BufferAttribute;
    if(name==='skinIndex') {
      const out=new Uint16Array(a.count*4);for(let i=0;i<a.count;i++)for(let k=0;k<4;k++)out[i*4+k]=remap?.[a.getComponent(i,k)]??a.getComponent(i,k);
      g.setAttribute(name,new THREE.BufferAttribute(out,4));continue;
    }
    const next=new THREE.BufferAttribute(floats(a),a.itemSize);
    if(name==='position')next.applyMatrix4(matrix);
    if(name==='normal')next.applyNormalMatrix(normal);
    g.setAttribute(name,next);
  }
  g.setIndex(source.index?.clone()||null);
  for(const [name,attributes] of Object.entries(source.morphAttributes)) {
    (g.morphAttributes as Record<string,THREE.BufferAttribute[]>)[name]=attributes.map(attribute=>{
      const next=new THREE.BufferAttribute(floats(attribute as THREE.BufferAttribute),3);
      if(name==='position')next.applyMatrix4(linear);
      if(name==='normal') {
        const scale=Math.cbrt(Math.abs(normal.determinant()))||1,v=new THREE.Vector3();
        for(let i=0;i<next.count;i++){v.fromBufferAttribute(next,i).applyMatrix3(normal).divideScalar(scale);next.setXYZ(i,v.x,v.y,v.z);}
      }
      return next;
    });
  }
  g.morphTargetsRelative=true;
  if(!['body','head','eyes'].includes(slot)) {
    const sourceZone=g.getAttribute('color'),zone=new Float32Array(g.getAttribute('position').count);
    if(sourceZone)for(let i=0;i<zone.length;i++)zone[i]=sourceZone.getX(i);
    g.setAttribute('assetZone',new THREE.BufferAttribute(zone,1));
  }
  g.deleteAttribute('color');
  if(slot==='body') {
  const p=g.getAttribute('position'),j=g.getAttribute('skinIndex'),w=g.getAttribute('skinWeight');
  const regions=new Float32Array(p.count*3);
  for(let i=0;i<p.count;i++)for(let k=0;k<4;k++) {
    const bone=j.getComponent(i,k),weight=w.getComponent(i,k);
    if(bone>=5&&bone<=10)regions[i*3]+=weight;
    if(bone>=11&&bone<=16)regions[i*3+1]+=weight;
  }
  for(let i=0;i<p.count;i++)regions[i*3+2]=p.getY(i)<.152?regions[i*3+1]:0;
  g.setAttribute('assetRegions',new THREE.BufferAttribute(regions,3));
  }
  g.computeBoundingSphere();return {geometry:g,morphs};
}
export async function loadSet(level:Detail):Promise<SetAssets> {
  if(sets.has(level))return sets.get(level)!;
  if(pending.has(level))return pending.get(level)!;
  const promise=(async()=>{
    const start=performance.now();let requestedBytes=0,reusedGeometries=0;
    manifestPromise??=fetch(base+'manifest.json',{cache:'no-cache'}).then(r=>{if(!r.ok)throw Error('Athlete manifest unavailable');return r.json();});
    const manifest=await manifestPromise;
    if(manifest.version!==2||manifest.bones.some((name,i)=>B[name as keyof typeof B]!==i))throw Error('Athlete rig contract mismatch');
    const data=manifest.levels[level];const textures=new Map<string,THREE.Texture>();
    await Promise.all(Object.entries(data.textures).map(async([name,file])=>{
      let loading=textureCache.get(file.sha256);
      if(!loading){requestedBytes+=file.bytes;loading=new THREE.TextureLoader().loadAsync(base+file.file).then(texture=>{texture.flipY=false;texture.colorSpace=file.srgb?THREE.SRGBColorSpace:THREE.NoColorSpace;texture.anisotropy=4;return texture;});textureCache.set(file.sha256,loading);}
      textures.set(name,await loading);
    }));
    const assets=new Map<string,{record:RecordAsset;parts:Part[]}>();
    await Promise.all(Object.entries(data.assets).map(async([name,record])=>{
      let geometry=geometryCache.get(record.glb.sha256);
      if(!geometry) {
        requestedBytes+=record.glb.bytes;
        geometry=(async()=>{
          const gltf=await loader.loadAsync(base+record.glb.file);gltf.scene.updateMatrixWorld(true);const parts:Part[]=[];
          gltf.scene.traverse(object=>{const mesh=object as THREE.SkinnedMesh;if(mesh.isMesh){parts.push(extract(mesh,record.meshes.find(m=>m.name===mesh.name)?.morphs||record.meshes[0].morphs,record.slot));mesh.geometry.dispose();for(const material of Array.isArray(mesh.material)?mesh.material:[mesh.material])material.dispose();mesh.skeleton?.dispose();}});
          return parts;
        })();
        geometryCache.set(record.glb.sha256,geometry);
        geometry.catch(()=>geometryCache.delete(record.glb.sha256));
      }else reusedGeometries++;
      assets.set(name,{record,parts:await geometry});
    }));
    const result={level,assets,textures,ms:performance.now()-start,bytes:data.bytes};sets.set(level,result);
    authoredStats.loads.push({level,bytes:data.bytes,requestedBytes,reusedGeometries,ms:result.ms});return result;
  })();
  pending.set(level,promise);promise.catch(()=>pending.delete(level));return promise;
}
export function gameSet(){return authoredStats.fallback?null:sets.get(preferred)||null;}
export function readySet(level:Detail){return sets.get(level)||null;}
export async function selectGameQuality(quality:QualityLevel) {
  const request=++qualityRequest,next=gameLevel(quality);
  if(next===preferred||authoredStats.fallback)return;
  await loadSet(next);
  if(request===qualityRequest)preferred=next;
}
export async function preloadAthletes() {
  const setting=store.get().settings.quality;
  const quality=setting==='auto'?detectQuality():setting;
  preferred=gameLevel(quality);
  let timeout:ReturnType<typeof setTimeout>|undefined;
  try {
    await Promise.race([loadSet(preferred),new Promise((_,reject)=>{timeout=setTimeout(()=>reject(Error('Athlete loading timed out')),10000);})]);
    authoredStats.ready=true;
  }catch(error){authoredStats.fallback=true;console.warn('Authored athletes unavailable; using procedural fallback.',error);}
  finally{if(timeout)clearTimeout(timeout);}
}
