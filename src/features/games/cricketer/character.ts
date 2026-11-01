import * as T from 'three';
import {clone} from 'three/examples/jsm/utils/SkeletonUtils.js';
import type {GLTF} from 'three/examples/jsm/loaders/GLTFLoader.js';

export type PlayerPose='ready'|'swing'|'run'|'bowl'|'field'|'celebrate';
type Joint={bone:T.Object3D;child:T.Object3D|null;parent:T.Object3D|null;restPosition:T.Vector3;restQuaternion:T.Quaternion};
type Mapping={target:Joint;source:T.Object3D;child:T.Object3D|null;parent:T.Object3D|null;correction:T.Quaternion;forward:T.Vector3};
const V=(x=0,y=0,z=0)=>new T.Vector3(x,y,z),UP=V(0,1,0),FORWARD=V(0,0,1);
const clamp=(n:number,a=0,b=1)=>Math.max(a,Math.min(b,n));
const material=(color:string,roughness=.76)=>new T.MeshStandardMaterial({color,roughness});
const links=[
 ['Hips','Spine','CATRigPelvis','CATRigSpine2'],['Spine','Spine1','CATRigSpine1','CATRigSpine2'],['Spine1','Spine2','CATRigSpine2','CATRigSpine3'],['Spine2','Neck','CATRigSpine3','CATRigShoulder'],['Neck','Head','CATRigNeck1','CATRigHead'],['Head','','CATRigHead',''],
 ...(['Left','Right'] as const).flatMap((side)=>{const s=side==='Left'?'L':'R';return [[side+'Shoulder',side+'Arm','CATRig'+s+'ArmCollarbone','CATRig'+s+'Arm1'],[side+'Arm',side+'ForeArm','CATRig'+s+'Arm1','CATRig'+s+'Arm21'],[side+'ForeArm',side+'Hand','CATRig'+s+'Arm21','CATRig'+s+'ArmPalm'],[side+'Hand',side+'HandMiddle1','CATRig'+s+'ArmPalm',''],[side+'UpLeg',side+'Leg','CATRig'+s+'Leg1','CATRig'+s+'Leg2'],[side+'Leg',side+'Foot','CATRig'+s+'Leg2','CATRig'+s+'LegAnkle'],[side+'Foot',side+'ToeBase','CATRig'+s+'LegAnkle','CATRig'+s+'LegDigit11']];}),
];
const clips:Record<string,string>={drive:'106_straight_drive_a',cut:'205_frontfoot_cut_a',pull:'204_frontfoot_pull_a',hook:'105_hook_a',sweep:'202_reverse_sweep_a',scoop:'208_scoop_a'};
function frame(primary:T.Vector3,forward:T.Vector3){const y=primary.clone().normalize(),z=forward.clone().addScaledVector(y,-forward.dot(y));if(z.lengthSq()<1e-6)z.copy(V(1,0,0)).addScaledVector(y,-y.x);z.normalize();const x=y.clone().cross(z).normalize();z.copy(x).cross(y).normalize();return new T.Quaternion().setFromRotationMatrix(new T.Matrix4().makeBasis(x,y,z));}
function direction(bone:T.Object3D,child:T.Object3D|null,parent:T.Object3D|null){return child?child.getWorldPosition(V()).sub(bone.getWorldPosition(V())):parent?bone.getWorldPosition(V()).sub(parent.getWorldPosition(V())):UP.clone();}
function addMesh(root:T.Object3D,geometry:T.BufferGeometry,mat:T.Material,x=0,y=0,z=0){const m=new T.Mesh(geometry,mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;root.add(m);return m;}
function box(root:T.Object3D,mat:T.Material,p:readonly[number,number,number],size:readonly[number,number,number]){return addMesh(root,new T.BoxGeometry(...size),mat,...p);}
function line(root:T.Object3D,mat:T.Material,a:T.Vector3,b:T.Vector3,r:number){const m=addMesh(root,new T.CylinderGeometry(r,r,a.distanceTo(b),8),mat);m.position.copy(a).add(b).multiplyScalar(.5);m.quaternion.setFromUnitVectors(UP,b.clone().sub(a).normalize());return m;}
function setWorldQuaternion(bone:T.Object3D,q:T.Quaternion){const parent=bone.parent?.getWorldQuaternion(new T.Quaternion())||new T.Quaternion();bone.quaternion.copy(parent.invert().multiply(q));bone.updateWorldMatrix(false,true);}
function numberTexture(number:string){const c=document.createElement('canvas');c.width=128;c.height=160;const ctx=c.getContext('2d')!;ctx.clearRect(0,0,128,160);ctx.fillStyle='#f7ebcf';ctx.textAlign='center';ctx.font='bold 86px Arial';ctx.fillText(number,64,125);ctx.font='bold 13px Arial';ctx.fillText('CRICKETER',64,30);const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;return t;}

/** Shared CC-BY mesh, original sports equipment, retained native-curve motion retargeting. */
export class CricketerPlayer {
  root=new T.Group();bat=new T.Group();head:T.Object3D;model:T.Object3D;
  private orient=new T.Group();private source:T.Object3D;private sourceMixer:T.AnimationMixer;
  private actions=new Map<string,T.AnimationAction>();private active='';private joints=new Map<string,Joint>();private mappings:Mapping[]=[];
  private lastKind:PlayerPose|null=null;
  private hipStart=V();private sourceHipStart=V();private gripError=0;private color:string;
  constructor(shared:GLTF,motion:GLTF,readonly batting=true,color='#c74630',number='07') {
    this.color=color;this.orient.rotation.y=Math.PI;this.root.add(this.orient);
    this.model=clone(shared.scene);this.orient.add(this.model);this.root.updateMatrixWorld(true);
    const bounds=new T.Box3().setFromObject(this.model),size=bounds.getSize(V()),center=bounds.getCenter(V()),scale=1.8/size.y;
    this.model.scale.multiplyScalar(scale);this.model.position.set(-center.x*scale,-bounds.min.y*scale,-center.z*scale);this.root.updateMatrixWorld(true);
    const jerseyNumber=numberTexture(number);
    this.model.traverse(o=>{
      if(o instanceof T.Bone){const name=o.name.replace(/_\d+$/,'');this.joints.set(name,{bone:o,child:null,parent:o.parent,restPosition:o.position.clone(),restQuaternion:o.quaternion.clone()});}
      if(o instanceof T.Mesh){o.castShadow=true;o.receiveShadow=true;o.frustumCulled=false;const mats:T.Material[]=Array.isArray(o.material)?o.material:[o.material];o.material=mats.map(m=>{
        if(m.name==='Wolf3D_Outfit_Top'){
          if(!o.geometry.hasAttribute('kitRestPosition')){const p=o.geometry.getAttribute('position'),values=new Float32Array(p.count*3);for(let i=0;i<p.count;i++){const point=o.getVertexPosition(i,V()).applyMatrix4(o.matrixWorld);this.orient.worldToLocal(point).toArray(values,i*3);}o.geometry.setAttribute('kitRestPosition',new T.BufferAttribute(values,3));}
          const kit=material(color);kit.addEventListener('dispose',()=>jerseyNumber.dispose());kit.onBeforeCompile=shader=>{shader.uniforms.kitNumber={value:jerseyNumber};shader.vertexShader='attribute vec3 kitRestPosition; varying vec3 vKitPosition;\n'+shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvKitPosition=kitRestPosition;');shader.fragmentShader='uniform sampler2D kitNumber; varying vec3 vKitPosition;\n'+shader.fragmentShader.replace('#include <map_fragment>','#include <map_fragment>\nvec2 kitUV=vec2(.5-vKitPosition.x/.24,(vKitPosition.y-1.08)/.29);if(vKitPosition.z<-.035&&kitUV.x>=0.&&kitUV.x<=1.&&kitUV.y>=0.&&kitUV.y<=1.){vec4 lettering=texture2D(kitNumber,kitUV);diffuseColor.rgb=mix(diffuseColor.rgb,lettering.rgb,lettering.a);}');};kit.customProgramCacheKey=()=> 'cricketer-kit-lettering-v2';return kit;
        }
        if(m.name==='Wolf3D_Outfit_Bottom')return material(batting?'#e9e3d1':'#204536');if(m.name==='Wolf3D_Outfit_Footwear')return material('#eeeadd',.6);
        if(m.name==='Wolf3D_Glasses'||batting&&m.name==='Wolf3D_Hair'){o.visible=false;return m;}
        const surface:T.Material=m.clone();
        if(batting&&o instanceof T.SkinnedMesh&&/Wolf3D_(Skin|Body)$/.test(m.name)){
          if(!o.geometry.hasAttribute('gloveWeight')){const indices=o.geometry.getAttribute('skinIndex'),weights=o.geometry.getAttribute('skinWeight'),mask=new Float32Array(indices.count),bones=o.skeleton.bones;for(let i=0;i<indices.count;i++){let w=0;for(let j=0;j<4;j++){const index=indices.getComponent(i,j);if(/^(Left|Right)Hand/.test(bones[index]?.name||''))w+=weights.getComponent(i,j);}mask[i]=clamp((w-.3)/.55);}o.geometry.setAttribute('gloveWeight',new T.BufferAttribute(mask,1));}
          surface.onBeforeCompile=shader=>{shader.vertexShader='attribute float gloveWeight; varying float vGloveWeight;\n'+shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvGloveWeight=gloveWeight;');shader.fragmentShader='varying float vGloveWeight;\n'+shader.fragmentShader.replace('#include <map_fragment>','#include <map_fragment>\ndiffuseColor.rgb=mix(diffuseColor.rgb,vec3(.94,.91,.83),vGloveWeight);');};surface.customProgramCacheKey=()=> 'cricketer-glove-surface-v2';
        }
        return surface;
      });if(o.material.length===1)o.material=o.material[0];}
    });
    this.head=this.joint('Head').bone;
    for(const [name,child] of links){const joint=this.joints.get(name);if(joint)joint.child=this.joints.get(child)?.bone||null;}
    this.source=clone(motion.scene);this.source.scale.setScalar(.87);this.source.position.set(-.23*.87,0,.405*.87);this.orient.add(this.source);this.source.visible=false;
    this.root.updateMatrixWorld(true);this.sourceMixer=new T.AnimationMixer(this.source);
    for(const c of motion.animations)this.actions.set(c.name,this.sourceMixer.clipAction(c));
    const forward=FORWARD.clone().applyQuaternion(this.orient.getWorldQuaternion(new T.Quaternion()));
    for(const [name,,sourceName,sourceChild] of links){const target=this.joints.get(name),source=this.source.getObjectByName(sourceName);if(!target||!source)continue;const child=sourceChild?this.source.getObjectByName(sourceChild)||null:null,parent=source.parent;
      const targetFrame=frame(direction(target.bone,target.child,target.parent),forward),sourceWorld=source.getWorldQuaternion(new T.Quaternion());
      this.mappings.push({target,source,child,parent,correction:targetFrame.invert().multiply(target.bone.getWorldQuaternion(new T.Quaternion())),forward:forward.clone().applyQuaternion(sourceWorld.clone().invert())});
    }
    this.hipStart.copy(this.joint('Hips').bone.position);
    this.sourceHipStart.copy(this.source.getObjectByName('CATRigPelvis')!.getWorldPosition(V()));
    this.makeBat();this.makeKit();this.pose(0,'ready');
  }
  private joint(name:string){const j=this.joints.get(name);if(!j)throw Error('Player rig is missing '+name);return j;}
  private reset(){for(const j of this.joints.values()){j.bone.position.copy(j.restPosition);j.bone.quaternion.copy(j.restQuaternion);}this.root.updateMatrixWorld(true);}
  private sample(name:string,time:number){
    if(this.active!==name){this.sourceMixer.stopAllAction();const action=this.actions.get(name);if(!action)throw Error('Missing cricket motion '+name);action.reset().setLoop(T.LoopOnce,1);action.clampWhenFinished=true;action.play();this.active=name;}
    const action=this.actions.get(name)!;action.paused=false;action.time=clamp(time,0,Math.max(0,action.getClip().duration-.00001));this.sourceMixer.update(0);action.paused=true;this.root.updateMatrixWorld(true);
    for(const m of this.mappings){const sourceQ=m.source.getWorldQuaternion(new T.Quaternion());const q=frame(direction(m.source,m.child,m.parent),m.forward.clone().applyQuaternion(sourceQ)).multiply(m.correction);setWorldQuaternion(m.target.bone,q);}
    // Keep the shared model's limb lengths; root motion is a relative hip offset, never a scaled absolute pose.
    const hip=this.joint('Hips').bone,parent=hip.parent!;
    const sourceHip=this.source.getObjectByName('CATRigPelvis')!.getWorldPosition(V());
    const delta=sourceHip.sub(this.sourceHipStart.clone().applyMatrix4(this.root.matrixWorld));delta.x=0;delta.z=0;delta.y=clamp(delta.y,-.08,.035);
    const localDelta=delta.applyQuaternion(parent.getWorldQuaternion(new T.Quaternion()).invert()).divide(parent.getWorldScale(V(1,1,1)));
    hip.position.copy(this.hipStart).add(localDelta);this.root.updateMatrixWorld(true);
  }
  private aim(name:string,childName:string,directionLocal:T.Vector3){const joint=this.joint(name).bone,child=this.joint(childName).bone;const current=child.getWorldPosition(V()).sub(joint.getWorldPosition(V())).normalize();const desired=directionLocal.clone().normalize().applyQuaternion(this.orient.getWorldQuaternion(new T.Quaternion()));setWorldQuaternion(joint,new T.Quaternion().setFromUnitVectors(current,desired).multiply(joint.getWorldQuaternion(new T.Quaternion())));}
  private authored(time:number,kind:PlayerPose,progress:number){
    this.reset();const running=kind==='run'||kind==='bowl'&&progress<.72,stride=running?Math.sin(time*13):0;
    for(const [side,sign] of [['Left',1],['Right',-1]] as const){
      this.aim(side+'UpLeg',side+'Leg',V(sign*.04,-1,running?stride*sign*.75:.10));
      this.aim(side+'Leg',side+'Foot',V(0,-1,running?-Math.max(0,stride*sign)*.65:-.04));
      this.aim(side+'Foot',side+'ToeBase',V(0,-.07,1));
      let upper=V(sign*.12,-1,running?-stride*sign*.7:.18),lower=V(0,-.6,running?stride*sign*.7:.55);
      if(kind==='bowl'&&progress>=.72&&side==='Right'){const a=(progress-.72)/.28*Math.PI*2;upper=V(-.10,Math.cos(a),-Math.sin(a));lower=V(0,Math.cos(a+.15),-Math.sin(a+.15));}
      if(kind==='celebrate'){upper=V(sign*.6,1,0);lower=V(sign*.15,1,0);}
      if(kind==='field'){upper=V(sign*.12,-.8,.35);lower=V(-sign*.2,-.3,.8);}
      this.aim(side+'Arm',side+'ForeArm',upper);this.aim(side+'ForeArm',side+'Hand',lower);
    }
    const stance=kind==='ready'||kind==='swing';
    if(stance){const hips=this.joint('Hips').bone;setWorldQuaternion(hips,new T.Quaternion().setFromAxisAngle(UP,.55).multiply(hips.getWorldQuaternion(new T.Quaternion())));}
    const spine=this.joint('Spine1').bone;const right=V(1,0,0).applyQuaternion(this.orient.getWorldQuaternion(new T.Quaternion()));setWorldQuaternion(spine,new T.Quaternion().setFromAxisAngle(right,kind==='field'?.20:running?.10:stance?.10:0).multiply(spine.getWorldQuaternion(new T.Quaternion())));this.root.updateMatrixWorld(true);
    if(stance){const head=this.joint('Head').bone;setWorldQuaternion(head,new T.Quaternion().setFromAxisAngle(UP,-.45).multiply(head.getWorldQuaternion(new T.Quaternion())));}
  }
  private compactStance(weight:number,time:number){const before=new Map([...this.joints].map(([name,j])=>[name,{q:j.bone.quaternion.clone(),p:j.bone.position.clone()}]));this.authored(time,'ready',0);for(const [name,j] of this.joints){const native=before.get(name)!,authored=j.bone.quaternion.clone();j.bone.quaternion.copy(native.q).slerp(authored,weight);j.bone.position.lerpVectors(native.p,j.bone.position,weight);}this.root.updateMatrixWorld(true);}
  private solveChain(upperName:string,lowerName:string,handName:string,target:T.Vector3){
    const upper=this.joint(upperName).bone,lower=this.joint(lowerName).bone,hand=this.joint(handName).bone;
    const a=upper.getWorldPosition(V()),b=lower.getWorldPosition(V()),c=hand.getWorldPosition(V()),l1=a.distanceTo(b),l2=b.distanceTo(c),dir=target.clone().sub(a),d=clamp(dir.length(),Math.abs(l1-l2)+.001,l1+l2-.001);dir.normalize();
    const pole=b.clone().sub(a).addScaledVector(dir,-b.clone().sub(a).dot(dir));if(pole.lengthSq()<1e-6)pole.copy(V(upperName.startsWith('Left')?1:-1,0,.5)).applyQuaternion(this.orient.getWorldQuaternion(new T.Quaternion()));pole.normalize();
    const cosine=clamp((l1*l1+d*d-l2*l2)/(2*l1*d),-1,1),elbow=a.clone().addScaledVector(dir,l1*cosine).addScaledVector(pole,l1*Math.sqrt(1-cosine*cosine));
    setWorldQuaternion(upper,new T.Quaternion().setFromUnitVectors(b.clone().sub(a).normalize(),elbow.clone().sub(a).normalize()).multiply(upper.getWorldQuaternion(new T.Quaternion())));
    const current=hand.getWorldPosition(V()).sub(lower.getWorldPosition(V())).normalize(),desired=target.clone().sub(lower.getWorldPosition(V())).normalize();setWorldQuaternion(lower,new T.Quaternion().setFromUnitVectors(current,desired).multiply(lower.getWorldQuaternion(new T.Quaternion())));
    return hand.getWorldPosition(V()).distanceTo(target);
  }
  private crouch(drop:number){if(drop<.001)return;const feet=['Left','Right'].map(side=>{const bone=this.joint(side+'Foot').bone;return {p:bone.getWorldPosition(V()),q:bone.getWorldQuaternion(new T.Quaternion())};});const hip=this.joint('Hips').bone,position=hip.getWorldPosition(V()).add(V(0,-drop,0));hip.position.copy(hip.parent!.worldToLocal(position));this.root.updateMatrixWorld(true);['Left','Right'].forEach((side,i)=>{this.solveChain(side+'UpLeg',side+'Leg',side+'Foot',feet[i].p);setWorldQuaternion(this.joint(side+'Foot').bone,feet[i].q);});}
  private holdBat(progress:number,contactHeight:number,side:number,shot:string){
    this.root.updateMatrixWorld(true);
    const left=this.joint('LeftHand').bone.getWorldPosition(V()),right=this.joint('RightHand').bone.getWorldPosition(V());
    const leftLocal=this.root.worldToLocal(left.clone()),rightLocal=this.root.worldToLocal(right.clone());
    const nativeBat=this.source.getObjectByName('bat')!;
    const up=V(0,0,1).applyQuaternion(nativeBat.getWorldQuaternion(new T.Quaternion())).applyQuaternion(this.root.getWorldQuaternion(new T.Quaternion()).invert()).normalize();
    this.bat.position.copy(leftLocal).add(rightLocal).multiplyScalar(.5).addScaledVector(up,.1);
    this.bat.quaternion.copy(frame(up,V(0,0,1)));
    if(progress>=0){const d=progress-.5,w=Math.exp(-Math.pow(d/.24,2));const target=V(.16+d*side*.35,contactHeight+.63*Math.cos(.9)+d*(shot==='scoop'?-1.1:.4),-.1-d*.8);const targetQ=new T.Quaternion().setFromEuler(new T.Euler(d*(shot==='sweep'?1.5:.5),d*side*.7,.9+d*(shot==='sweep'?2.5:1.65)*side));this.bat.position.lerp(target,w);this.bat.quaternion.slerp(targetQ,w);}else{this.bat.position.set(.17,1.08,-.28);this.bat.rotation.set(-.12,0,-.36);}
    this.bat.updateMatrixWorld(true);
    // Wrist targets flank the handle; finger pads close around it rather than letting the bat float.
    const q=this.bat.getWorldQuaternion(new T.Quaternion()),across=V(1,0,0).applyQuaternion(q);
    const targets=[V(0,-.045,0).applyMatrix4(this.bat.matrixWorld).addScaledVector(across,-.035),V(0,-.16,0).applyMatrix4(this.bat.matrixWorld).addScaledVector(across,.035)];
    if(progress>=0)for(let attempt=0;attempt<2;attempt++){let drop=0;for(const [i,s] of ['Left','Right'].entries()){const shoulder=this.joint(s+'Arm').bone.getWorldPosition(V()),elbow=this.joint(s+'ForeArm').bone.getWorldPosition(V()),wrist=this.joint(s+'Hand').bone.getWorldPosition(V()),reach=shoulder.distanceTo(elbow)+elbow.distanceTo(wrist)-.015,horizontal=(shoulder.x-targets[i].x)**2+(shoulder.z-targets[i].z)**2;drop=Math.max(drop,shoulder.y-targets[i].y-Math.sqrt(Math.max(.001,reach*reach-horizontal)));}if(drop>.001)this.crouch(Math.min(.18,drop));else break;}
    this.gripError=Math.max(this.solveChain('LeftArm','LeftForeArm','LeftHand',targets[0]),this.solveChain('RightArm','RightForeArm','RightHand',targets[1]));
    for(const [i,name] of ['Left','Right'].entries()){
      const hand=this.joint(name+'Hand').bone;const current=direction(hand,this.joint(name+'HandMiddle1').bone,hand.parent).normalize();const desired=across.clone().multiplyScalar(i===0?1:-1);const rotate=new T.Quaternion().setFromUnitVectors(current,desired);setWorldQuaternion(hand,rotate.multiply(hand.getWorldQuaternion(new T.Quaternion())));
      for(const joint of this.joints.values())if(joint.bone.name.startsWith(name+'Hand')&&/\d_\d+$/.test(joint.bone.name)&&!joint.bone.name.includes('end'))joint.bone.quaternion.multiply(new T.Quaternion().setFromAxisAngle(V(1,0,0),joint.bone.name.includes('Thumb')?.55:/[23]_/.test(joint.bone.name)?1.05:.55));
    }
    this.root.updateMatrixWorld(true);
  }
  pose(time:number,kind:PlayerPose,progress=0,side=1,shot='drive',contactHeight=.7){
    if((kind==='ready'||kind==='field')&&this.lastKind===kind)return;this.lastKind=kind;
    if(this.batting&&(kind==='ready'||kind==='swing'||kind==='celebrate')){
      this.reset();if(kind==='swing'){const name=clips[shot]||clips.drive,duration=this.actions.get(name)!.getClip().duration;this.sample(name,progress<=.5?.08+progress*.64:.40+(progress-.5)*2*(duration-.40));const correction=Math.exp(-Math.pow((progress-.5)/.24,2));this.compactStance(correction,time);this.crouch(clamp((.83-contactHeight)*.85,0,.43)*correction);}
      else if(kind==='celebrate')this.sample('Victory 1',time%3.3);
      else {this.sample('003_brace_for_shot_backlift',.28);this.compactStance(1,time);}
      if(kind!=='celebrate')this.holdBat(kind==='swing'?progress:-1,contactHeight,side,shot);
    }else this.authored(time,kind,progress);
    this.bat.visible=this.batting&&kind!=='run';
    this.root.updateMatrixWorld(true);
  }
  private makeBat(){this.bat.name='Cricketer_bat';this.root.add(this.bat);const willow=material('#d8b47c'),edge=material('#b98e54'),grip=material('#173e32'),label=material('#d94830');line(this.bat,grip,V(0,.015,0),V(0,-.29,0),.022);for(let i=0;i<11;i++)addMesh(this.bat,new T.TorusGeometry(.023,.003,4,12),grip,0,-.02-i*.023,0).rotation.x=Math.PI/2;const shape=new T.Shape();shape.moveTo(-.025,-.28);shape.lineTo(-.055,-.36);shape.lineTo(-.058,-.91);shape.quadraticCurveTo(0,-.97,.058,-.91);shape.lineTo(.055,-.36);shape.lineTo(.025,-.28);shape.closePath();addMesh(this.bat,new T.ExtrudeGeometry(shape,{depth:.045,bevelEnabled:true,bevelSize:.007,bevelThickness:.006,bevelSegments:2,steps:1}),willow,0,0,-.025);box(this.bat,edge,[0,-.63,.028],[.038,.51,.025]);box(this.bat,label,[0,-.42,-.034],[.075,.13,.006]);}
  private attach(gear:T.Object3D,bone:T.Object3D,position:T.Vector3,quaternion:T.Quaternion){this.root.add(gear);gear.position.copy(this.root.worldToLocal(position.clone()));gear.quaternion.copy(this.root.getWorldQuaternion(new T.Quaternion()).invert().multiply(quaternion));this.root.updateMatrixWorld(true);bone.attach(gear);}
  private makeKit(){
    const white=material('#fff4dd',.65),rib=material('#ded8c3'),dark=material('#203730',.45),red=material(this.color,.48),seam=material('#bbb8a8');
    const forward=FORWARD.clone().applyQuaternion(this.orient.getWorldQuaternion(new T.Quaternion())),orientation=this.orient.getWorldQuaternion(new T.Quaternion());
    for(const eye of ['LeftEye','RightEye']){const joint=this.joints.get(eye);if(!joint)continue;const iris=new T.Group();addMesh(iris,new T.SphereGeometry(.009,12,8),material('#54351e',.4),0,0,0).scale.z=.30;addMesh(iris,new T.SphereGeometry(.0048,10,6),material('#181d18',.35),0,0,.0025).scale.z=.28;addMesh(iris,new T.SphereGeometry(.0018,6,4),white,-.002,.003,.004);this.attach(iris,joint.bone,joint.bone.getWorldPosition(V()).addScaledVector(forward,.020),orientation);}
    if(this.batting){const helmet=new T.Group();helmet.name='Cricketer_helmet';addMesh(helmet,new T.SphereGeometry(.164,20,12,0,Math.PI*2,0,Math.PI*.56),red);box(helmet,red,[0,-.012,.15],[.31,.025,.16]);for(const y of [-.03,-.085,-.14,-.19]){line(helmet,dark,V(-.145,y,.17),V(0,y-.012,.21),.0055);line(helmet,dark,V(0,y-.012,.21),V(.145,y,.17),.0055);}for(const x of [-.145,.145]){line(helmet,dark,V(x,-.01,.075),V(x,-.19,.17),.007);line(helmet,dark,V(x*.5,-.03,.192),V(x*.5,-.19,.192),.0045);}this.attach(helmet,this.head,this.head.getWorldPosition(V()).add(V(0,.10,0)),orientation);
      for(const side of ['Left','Right']){
        const knee=this.joint(side+'Leg').bone.getWorldPosition(V()),ankle=this.joint(side+'Foot').bone.getWorldPosition(V()),pad=new T.Group();pad.name='Cricketer_'+side+'_pad';box(pad,white,[0,0,0],[.17,.40,.06]);for(let i=-2;i<=2;i++)addMesh(pad,new T.CapsuleGeometry(.016,.30,4,6),i%2?rib:white,i*.031,0,.037);box(pad,white,[0,.16,.048],[.18,.055,.05]);for(const y of [-.14,.01,.14])box(pad,seam,[0,y,-.042],[.19,.022,.017]);this.attach(pad,this.joint(side+'Leg').bone,knee.clone().lerp(ankle,.53).addScaledVector(forward,.085),frame(knee.clone().sub(ankle),forward));
        const hand=this.joint(side+'Hand').bone;const padding=new T.Group();padding.name='Cricketer_'+side+'_glove';box(padding,white,[0,.045,0],[.08,.095,.05]);box(padding,red,[0,-.002,0],[.082,.028,.057]);hand.add(padding);
        for(const finger of ['Index','Middle','Ring','Pinky','Thumb'])for(const n of [1,2,3]){const j=this.joints.get(side+'Hand'+finger+n);if(j)addMesh(j.bone,new T.CapsuleGeometry(.0105,finger==='Thumb'?.014:.021,3,6),white,0,.017,0);}
      }
    }
  }
  inspection(){this.model.traverse(o=>{if(o instanceof T.SkinnedMesh)o.computeBoundingBox();});const box=new T.Box3().setFromObject(this.model);return {skinnedMeshes:(()=>{let n=0;this.model.traverse(o=>{if(o instanceof T.SkinnedMesh)n++;});return n;})(),bones:this.joints.size,gripError:this.gripError,bounds:{min:box.min.toArray(),max:box.max.toArray()},motion:this.active};}
}
