import * as THREE from 'three';
import type {CharacterLook} from '../../src/game/world/Character';
import {paintAuthoredPrints} from './prints';
import type {SetAssets} from './assets';

const color=(value:string)=>new THREE.Color(value);
type Shader=Parameters<THREE.Material['onBeforeCompile']>[0];
function vary(shader:Shader,zone=false,regions=false) {
  const declarations=`varying vec2 vAssetUV;varying vec3 vAssetP;${zone?'attribute float assetZone;varying float vAssetZone;':''}${regions?'attribute vec3 assetRegions;varying vec3 vAssetRegions;':''}`;
  shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\n'+declarations)
    .replace('#include <begin_vertex>',`#include <begin_vertex>\nvAssetUV=uv;vAssetP=position;${zone?'vAssetZone=assetZone;':''}${regions?'vAssetRegions=assetRegions;':''}`);
  shader.fragmentShader=shader.fragmentShader.replace('#include <common>',`#include <common>\nvarying vec2 vAssetUV;varying vec3 vAssetP;${zone?'varying float vAssetZone;':''}${regions?'varying vec3 vAssetRegions;':''}`);
}
export function skinMaterial(set:SetAssets,look:CharacterLook,head:boolean) {
  const ap=look.appearance,region=head?'head':'body';
  const m=new THREE.MeshPhysicalMaterial({color:0xffffff,map:set.textures.get(region+'-detail'),normalMap:set.textures.get(region+'-normal'),normalScale:new THREE.Vector2(.85,.85),roughnessMap:set.textures.get(region+'-orm'),aoMap:set.textures.get(region+'-orm'),aoMapIntensity:.45,roughness:.94,metalness:0,clearcoat:.08,clearcoatRoughness:.48,specularIntensity:.6});
  const facial=ap.facialHair||(ap.beard?'beard':'clean');
  const uniforms={uSkin:{value:color(ap.skin)},uHair:{value:color(ap.hairColor)},uBeard:{value:facial==='clean'?0:facial==='stubble'?.22:facial==='goatee'?.58:facial==='full'?.8:.66},uFull:{value:facial==='full'?1:0},uGoatee:{value:facial==='goatee'?1:0},uSock:{value:color(ap.sockColor)},uArm:{value:color(ap.armSleeve||ap.skin)},uLeg:{value:color(ap.legSleeve||ap.skin)},uHasArm:{value:ap.armSleeve?1:0},uHasLeg:{value:ap.legSleeve?1:0},uSweat:{value:0}};
  m.userData.uniforms=uniforms;
  m.onBeforeCompile=shader=>{
    Object.assign(shader.uniforms,uniforms);vary(shader,false,!head);
    shader.fragmentShader=shader.fragmentShader.replace('#include <common>',`#include <common>\nuniform vec3 uSkin,uHair,uSock,uArm,uLeg;uniform float uBeard,uFull,uGoatee,uHasArm,uHasLeg,uSweat;`);
    shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>',`
      vec4 detail=texture2D(map,vAssetUV);vec3 skin=uSkin*mix(.88,1.12,detail.r*2.0-.5);
      skin=mix(skin,skin*vec3(1.08,.88,.84),detail.g*.22);
      skin*=1.0-detail.b*.11;
      skin=mix(skin,skin*vec3(1.08,.69,.68),detail.a*.55);
      ${head?`float top=.914+.012*uFull;
      float jaw=(1.0-smoothstep(top,top+.012,vAssetP.y))*smoothstep(.87,.890,vAssetP.y)*smoothstep(.025,.054,vAssetP.z);
      float cheek=1.0-smoothstep(.030,.050,abs(vAssetP.x));jaw*=mix(1.0,cheek,uGoatee);
      float moustache=smoothstep(.905,.909,vAssetP.y)*(1.0-smoothstep(.912,.917,vAssetP.y))*(1.0-smoothstep(.012,.023,abs(vAssetP.x)))*smoothstep(.055,.08,vAssetP.z);
      jaw=max(jaw,moustache*.8);
      float grain=fract(sin(dot(floor(vAssetUV*1400.0),vec2(12.9898,78.233)))*43758.5453);
      skin=mix(skin,uHair,jaw*uBeard*(.62+.38*grain)*(1.0-detail.a));`:
      `skin=mix(skin,uArm,vAssetRegions.x*uHasArm*(1.0-smoothstep(.68,.745,vAssetP.y)));
       skin=mix(skin,uLeg,vAssetRegions.y*uHasLeg*(1.0-smoothstep(.19,.28,vAssetP.y)));
       skin=mix(skin,uSock,vAssetRegions.z);`}
      diffuseColor.rgb=skin;
    `).replace('#include <roughnessmap_fragment>','#include <roughnessmap_fragment>\nroughnessFactor=max(.32,roughnessFactor-uSweat*.12);');
  };
  m.customProgramCacheKey=()=>`hl-skin-v2-${head?'head':'body'}`;return m;
}
export function uniformMaterial(look:CharacterLook,owned:{dispose():void}[]) {
  const j=look.jersey;
  const {front,shorts}=paintAuthoredPrints(look,1024);owned.push(front,shorts);
  const m=new THREE.MeshPhysicalMaterial({color:0xffffff,roughness:.84,sheen:.18,sheenRoughness:.8,side:THREE.DoubleSide});
  m.onBeforeCompile=shader=>{
    vary(shader,true);Object.assign(shader.uniforms,{uBase:{value:color(j.base)},uShorts:{value:color(j.shorts)},uTrim:{value:color(j.trim)},uJerseyPrint:{value:front},uShortsPrint:{value:shorts}});
    shader.fragmentShader=shader.fragmentShader.replace('#include <common>','#include <common>\nuniform vec3 uBase,uShorts,uTrim;uniform sampler2D uJerseyPrint,uShortsPrint;');
    shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>',`
      vec3 base=mix(uBase,uShorts,step(.75,vAssetZone));
      float binding=1.0-step(.08,abs(vAssetZone-.5));
      float sidePanel=step(.93,abs(sin((vAssetUV.x-.5)*6.2831853)));
      base=mix(base,uTrim,max(binding,sidePanel*.78));
      vec4 ink=mix(texture2D(uJerseyPrint,vAssetUV),texture2D(uShortsPrint,vAssetUV),step(.75,vAssetZone));
      base=mix(base,ink.rgb,ink.a*(1.0-binding));
      float weave=sin(vAssetUV.x*1900.0)*sin(vAssetUV.y*2200.0);
      diffuseColor.rgb=base*(.97+.03*weave);
    `);
  };m.customProgramCacheKey=()=> 'hl-uniform-v2';return m;
}
export function shoeMaterial(look:CharacterLook) {
  const ap=look.appearance,m=new THREE.MeshStandardMaterial({color:0xffffff,roughness:.64});
  m.onBeforeCompile=shader=>{
    vary(shader,true);Object.assign(shader.uniforms,{uUpper:{value:color(ap.shoeColor)},uAccent:{value:color(ap.shoeAccent)}});
    shader.fragmentShader=shader.fragmentShader.replace('#include <common>','#include <common>\nuniform vec3 uUpper,uAccent;');
    shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>',`vec3 tone=uUpper;if(vAssetZone>.1)tone=uAccent;if(vAssetZone>.3)tone=vec3(.87,.86,.82);if(vAssetZone>.5)tone=vec3(.085,.08,.075);if(vAssetZone>.7)tone=vec3(.93);diffuseColor.rgb=tone;`);
  };m.customProgramCacheKey=()=> 'hl-shoes-v2';return m;
}
export function hairMaterial(look:CharacterLook,set:SetAssets) {
  const short=['buzz','fade','waves'].includes(look.appearance.hair);
  if(['afro','hightop'].includes(look.appearance.hair)) {
    const material=new THREE.MeshStandardMaterial({color:look.appearance.hairColor,map:set.textures.get('hair-afro'),alphaTest:.35,side:THREE.DoubleSide,roughness:.95});
    material.onBeforeCompile=shader=>{
      shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>','vec4 fibre=texture2D(map,vMapUv);diffuseColor.rgb*=.72+sqrt(fibre.rgb)*2.4;diffuseColor.a*=fibre.a;');
    };
    material.customProgramCacheKey=()=> 'hl-card-hair-v2';
    return material;
  }
  const m=new THREE.MeshPhysicalMaterial({color:look.appearance.hairColor,roughness:.94,metalness:0,sheen:.04,sheenColor:new THREE.Color('#827568'),sheenRoughness:.9,alphaTest:.4});
  m.onBeforeCompile=shader=>{
    vary(shader,true);shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>',`
      float strand=fract(sin(dot(floor(vAssetP.xz*9500.0+vAssetP.y*2100.0),vec2(12.9898,78.233)))*43758.5453);
      diffuseColor.rgb*=.72+.42*strand;
      float front=clamp((vAssetP.z-.018)/.055,0.0,1.0);
      float edge=.942+.029*front;
      float fade=smoothstep(edge-.002,edge+.010,vAssetP.y);
      diffuseColor.a=vAssetZone>.5?1.0:step(strand,fade);
    `).replace('#include <normal_fragment_maps>',`#include <normal_fragment_maps>
      vec3 fibre=normalize(vec3(sin(vAssetP.y*15500.0)*.08,cos(vAssetP.x*17000.0)*.08,1.0));
      normal=normalize(normal+vec3(dFdx(strand),dFdy(strand),0.0)*.03);
    `);
  };m.customProgramCacheKey=()=>`hl-hair-v4-${short}`;
  return m;
}
export function faceMaterial(set:SetAssets,name:string,look:CharacterLook) {
  if(name==='eyes')return new THREE.MeshPhysicalMaterial({map:set.textures.get('eye'),alphaTest:.1,roughness:.23,clearcoat:.7,clearcoatRoughness:.16,specularIntensity:.65});
  const material=new THREE.MeshStandardMaterial({map:set.textures.get('brow'),color:look.appearance.hairColor,alphaTest:.35,side:THREE.DoubleSide,roughness:.88,depthWrite:true});
  material.onBeforeCompile=shader=>{vary(shader,true);shader.uniforms.uLashes={value:set.textures.get('lash')};shader.fragmentShader=shader.fragmentShader.replace('#include <common>','#include <common>\nuniform sampler2D uLashes;').replace('#include <map_fragment>','diffuseColor*=mix(texture2D(map,vAssetUV),texture2D(uLashes,vAssetUV),step(.5,vAssetZone));');};
  material.customProgramCacheKey=()=> 'hl-face-cards-v2';return material;
}
export function gearMaterial(look:CharacterLook) {
  const ap=look.appearance,material=new THREE.MeshStandardMaterial({color:0xffffff,roughness:.82,alphaTest:.5});
  material.onBeforeCompile=shader=>{
    vary(shader,true);Object.assign(shader.uniforms,{uHeadBand:{value:color(ap.headband||'#ffffff')},uWristBand:{value:color(ap.wristbands||'#ffffff')},uHeadOn:{value:ap.headband?1:0},uWristOn:{value:ap.wristbands?1:0}});
    shader.fragmentShader=shader.fragmentShader.replace('#include <common>','#include <common>\nuniform vec3 uHeadBand,uWristBand;uniform float uHeadOn,uWristOn;').replace('#include <color_fragment>','diffuseColor.rgb=mix(uHeadBand,uWristBand,step(.5,vAssetZone));diffuseColor.a=mix(uHeadOn,uWristOn,step(.5,vAssetZone));');
  };material.customProgramCacheKey=()=> 'hl-gear-v2';return material;
}
