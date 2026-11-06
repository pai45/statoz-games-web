import * as THREE from 'three';
import type {CharacterLook} from '../../src/game/world/Character';
import {B,OFFSETS,createBones,clavicleAngles} from '../../src/game/world/character/rig';
import {characterQuality} from '../../src/game/world/character/materials';
import {isHandheld,type QualityLevel} from '../../src/game/engine/quality';
import {LAYER_REFLECT} from '../../src/game/engine/reflection';
import {mulberry32} from '../../src/data/rng';
import {gameSet,loadSet,selectGameQuality,authoredStats,type SetAssets,type Detail} from './assets';
import {skinMaterial,uniformMaterial,shoeMaterial,hairMaterial,faceMaterial,gearMaterial} from './materials';

const live=new Set<AuthoredCharacter>();
export function syncAuthoredQuality(quality:QualityLevel) {
  // Demote hero meshes immediately; switch texture tiers once the local pack is ready.
  for(const character of live)character.refreshDetail();
  void selectGameQuality(quality).then(()=>{for(const character of live)character.refreshDetail();}).catch(()=>{});
}

export function constructAuthored(look:CharacterLook) {
  const set=gameSet();if(!set)return null;const start=performance.now();const result=new AuthoredCharacter(look,set);authoredStats.constructed.push(performance.now()-start);if(authoredStats.constructed.length>256)authoredStats.constructed.shift();return result;
}
export class AuthoredCharacter {
  readonly authored=true;
  group=new THREE.Group();rig=new THREE.Group();bones=createBones();skeleton:THREE.Skeleton;
  meshes:THREE.SkinnedMesh[]=[];mesh!:THREE.SkinnedMesh;height:number;bindHipY:number;
  private owned:{dispose():void}[]=[];private sweat:THREE.Material[]=[];private look:CharacterLook;private gone=false;private detail:Detail;
  private tmp=new THREE.Vector3();private qa=new THREE.Quaternion();private qc=new THREE.Quaternion();private eu=new THREE.Euler();private clav={y:0,z:0};
  private morphWeights:Record<string,number>={};
  private detailRequest=0;
  private requestedDetail:'game'|'hero'='game';
  private readonly bindMatrix=new THREE.Matrix4();
  private materials=new Map<string,{key:string;material:THREE.Material}>();
  constructor(look:CharacterLook,set:SetAssets) {
    this.look=look;this.detail=set.level;this.height=look.heightCm/100;this.bindHipY=OFFSETS[0][1]*this.height;
    this.rig.scale.setScalar(this.height);this.rig.add(this.bones[0]);this.group.add(this.rig);this.group.updateMatrixWorld(true);this.skeleton=new THREE.Skeleton(this.bones);
    this.bindMatrix.copy(this.rig.matrixWorld);
    const seed=(look.seed??look.number*977+look.heightCm*131)>>>0,rng=mulberry32(seed);
    const bulk=look.bulk??1+(look.heightCm-200)/260;
    this.morphWeights.build_lean=Math.min(.65,Math.max(0,(1-bulk)*7));this.morphWeights.build_heavy=Math.min(.65,Math.max(0,(bulk-1)*5));this.morphWeights.build_muscular=.15+rng()*.3;
    for(const pair of [['face_head_wide','face_head_narrow'],['face_head_long','face_head_short'],['face_jaw_wide','face_jaw_narrow'],['face_cheeks_full','face_cheeks_hollow'],['face_nose_wide','face_nose_narrow'],['face_lips_full','face_lips_thin'],['face_chin_forward','face_chin_back']]) {
      const v=rng()*2-1;this.morphWeights[pair[v<0?1:0]]=Math.abs(v)*.55;
    }
    for(const name of ['face_cheekbones','face_chin_wide','face_nose_flare','face_nose_hump','face_nose_tip_up','face_mouth_wide','face_eyes_big','face_brow_ridge','face_brow_low','face_ears_out'])this.morphWeights[name]=rng()*.35;
    this.assemble(set);
    for(const bone of this.bones)bone.rotation.set(0,0,0);
    live.add(this);
  }
  private assemble(set:SetAssets) {
    for(const mesh of this.meshes)mesh.removeFromParent();this.meshes=[];this.sweat=[];
    const look=this.look;
    const selected=['body','head','uniform','shoes','eyes','faceCards'];
    if(look.appearance.hair!=='bald')selected.push('hair-'+look.appearance.hair);
    if(look.appearance.headband||look.appearance.wristbands)selected.push('gear');
    for(const name of selected) {
      const asset=set.assets.get(name);if(!asset)continue;
      const roles=name==='body'||name==='head'?[name+'-detail',name+'-normal',name+'-orm']:name==='eyes'?['eye']:name==='faceCards'?['brow','lash']:['hair-afro','hair-hightop'].includes(name)?['hair-afro']:[];
      const key=roles.map(role=>set.textures.get(role)?.uuid).join('|');
      const cached=this.materials.get(name);
      let material:THREE.Material;
      if(cached?.key===key)material=cached.material;
      else {
      if(name==='body'||name==='head')material=skinMaterial(set,look,name==='head');
      else if(name==='uniform')material=uniformMaterial(look,this.owned);
      else if(name==='shoes')material=shoeMaterial(look);
      else if(name.startsWith('hair-'))material=hairMaterial(look,set);
      else if(name==='gear')material=gearMaterial(look);
      else material=faceMaterial(set,name,look);
      cached?.material.dispose();this.materials.set(name,{key,material});
      }
      if(name==='body'||name==='head')this.sweat.push(material);
      for(const part of asset.parts) {
        const mesh=new THREE.SkinnedMesh(part.geometry,material);mesh.name='authored-'+name;mesh.frustumCulled=false;mesh.castShadow=!['faceCards','eyes'].includes(name);mesh.receiveShadow=false;
        this.rig.add(mesh);
        // Skeleton inverses were captured at construction in the origin A-pose.
        // Court position, facing and jump transforms must never enter this matrix.
        mesh.bind(this.skeleton,this.bindMatrix);
        part.morphs.forEach((m,i)=>{if(mesh.morphTargetInfluences)mesh.morphTargetInfluences[i]=this.morphWeights[m]||0;});
        if(!['faceCards','eyes'].includes(name))mesh.layers.enable(LAYER_REFLECT);
        mesh.userData.detail=set.level;this.meshes.push(mesh);if(name==='body')this.mesh=mesh;
      }
    }
    this.group.updateMatrixWorld(true);
    this.detail=set.level;
    this.group.userData.authoredAthlete={detail:set.level,triangles:this.meshes.reduce((n,m)=>n+(m.geometry.index?.count||0)/3,0),calls:this.meshes.length};
  }
  async setDetail(detail:'game'|'hero') {
    this.requestedDetail=detail;
    const request=++this.detailRequest;
    if(this.gone)return;
    const hero=detail==='hero'&&characterQuality()!=='low'&&!(characterQuality()==='medium'&&isHandheld());
    const next=hero?'hero':gameSet()?.level;if(!next||next===this.detail)return;
    try{const set=hero?await loadSet('hero'):gameSet();if(set&&!this.gone&&request===this.detailRequest)this.assemble(set);}catch{/* Keep the visible gameplay mesh on a load failure. */}
  }
  refreshDetail(){void this.setDetail(this.requestedDetail);}
  applyPose(rot:Float32Array,hipX:number,hipY:number,hipZ:number) {
    for(let i=0;i<17;i++)if(i!==B.upperArmL&&i!==B.upperArmR)this.bones[i].rotation.set(rot[i*3],rot[i*3+1],rot[i*3+2]);
    for(const side of[1,-1]as const){const upper=side>0?B.upperArmL:B.upperArmR;this.eu.set(rot[upper*3],rot[upper*3+1],rot[upper*3+2]);this.qa.setFromEuler(this.eu);clavicleAngles(this.qa,side,this.clav);const clav=this.bones[side>0?B.clavicleL:B.clavicleR];clav.rotation.set(0,this.clav.y,this.clav.z);this.qc.setFromEuler(clav.rotation).invert();this.bones[upper].quaternion.copy(this.qc.multiply(this.qa));}
    this.bones[0].position.set(hipX/this.height,OFFSETS[0][1]+hipY/this.height,hipZ/this.height);
  }
  setSweat(value:number){for(const material of this.sweat)if(material.userData.uniforms?.uSweat)material.userData.uniforms.uSweat.value=value;}
  handWorld(right:boolean,out:THREE.Vector3){const bone=this.bones[right?B.handR:B.handL];this.tmp.set(0,-.036,.004);bone.updateWorldMatrix(true,false);return out.copy(this.tmp).applyMatrix4(bone.matrixWorld);}
  boneWorld(index:number,out:THREE.Vector3){const bone=this.bones[index];bone.updateWorldMatrix(true,false);return out.setFromMatrixPosition(bone.matrixWorld);}
  dispose(){this.gone=true;live.delete(this);for(const owned of this.owned)owned.dispose();for(const {material}of this.materials.values())material.dispose();this.materials.clear();this.skeleton.dispose();this.group.removeFromParent();}
}
