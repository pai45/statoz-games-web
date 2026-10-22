import * as THREE from 'three';

export function characterConfig(config){
 const skin=({VOLT:0x825333,NOVA:0xa87351,MIRA:0xc58e69,JETT:0x694a36,REYES:0xa77753})[String(config.name||'').toUpperCase()];
 return {...config,skin:skin??config.skin};
}

// Original procedural art for the imported game. Skeleton dimensions and contacts stay upstream.
export function buildCharacterHead(config,put,skin,hair,trim,h){
 const {ringLoft,ellipsoid,limbTube,torus,allow}=h;
 const name=String(config.name||'REYES').toUpperCase();
 const style=({VOLT:'curls',NOVA:'bun',MIRA:'braids',JETT:'sweep',REYES:'fade'})[name]||'fade';
 const details={light:[],ink:[],accent:[],style,name};
 const add=(bucket,geo)=>put(bucket,geo,allow);
 // An open, clearly readable face. Hair starts above the brow instead of covering the eyes.
 add(skin,ringLoft([
  [1.587,.053,.054,.007],[1.613,.067,.070,.014],[1.641,.082,.082,.010],
  [1.678,.092,.094,.003],[1.718,.094,.097,-.003],
  [1.755,.088,.092,-.009],[1.790,.064,.068,-.012],[1.807,.025,.030,-.012],
 ],{capBottom:false}));
 for(const s of [-1,1]){
  add(skin,ellipsoid([s*.093,1.681,-.002],[.014,.025,.020]));
  add(details.light,ellipsoid([s*.039,1.696,.091],[.018,.006,.005],12));
  add(details.ink,ellipsoid([s*.037,1.695,.096],[.006,.005,.0025],10));
  add(details.ink,limbTube([s*.020,1.711,.089],[s*.057,1.715,.081],[[0,.0025],[1,.003]],{N:8,round:true}));
 }
 add(skin,limbTube([0,1.700,.089],[0,1.667,.103],[[0,.006],[1,.009]],{N:10,round:true}));
 add(details.ink,limbTube([-.019,1.640,.090],[.019,1.640,.090],[[0,.002],[.5,.003],[1,.002]],{N:8,round:true}));
 // All five hair silhouettes are solid geometry and follow the head's skin weights.
 add(hair,ringLoft([[1.736,.095,.100,-.006],[1.769,.091,.095,-.010],[1.800,.064,.068,-.013],[1.815,.022,.026,-.012]],{capBottom:false}));
 if(style==='curls'){
  for(let row=0;row<2;row++)for(let i=0;i<10;i++){
   const angle=i*Math.PI/5+row*.25,r=.071-row*.025;
   add(hair,ellipsoid([Math.cos(angle)*r,1.793+row*.018,-.008+Math.sin(angle)*r],[.020,.017,.020],10));
  }
  add(trim,torus([0,1.745,-.002],.095,.009,[1,.7,1.05]));
 }else if(style==='bun'){
  add(hair,ellipsoid([0,1.804,-.075],[.050,.051,.046],14));
  add(details.accent,torus([0,1.785,-.070],.034,.006,[1,.7,1]));
 }else if(style==='braids'){
  for(let strand=-2;strand<=2;strand++){
   const x=strand*.027;
   add(hair,limbTube([x,1.750,.050],[x,1.792,-.060],[[0,.010],[.5,.013],[1,.010]],{N:8,round:true}));
  }
  for(let i=0;i<5;i++)add(hair,ellipsoid([.012,1.775-i*.024,-.108-i*.007],[.023,.021,.023],10));
  add(details.accent,ellipsoid([.012,1.678,-.136],[.022,.009,.023],10));
 }else if(style==='sweep'){
  for(let i=0;i<5;i++)add(hair,ellipsoid([-.052+i*.023,1.807+i*.003,-.012-i*.003],[.025,.030,.066],12));
 }else{
  // Close fade and a shaped goatee distinguish the second 1v1 athlete.
  for(const s of [-1,1])add(hair,limbTube([s*.082,1.723,-.018],[s*.082,1.684,-.016],[[0,.012],[1,.008]],{N:8,round:false}));
  add(hair,ellipsoid([0,1.620,.086],[.030,.012,.008],12));
  add(hair,ellipsoid([0,1.650,.098],[.021,.004,.004],10));
 }
 return details;
}

export function addCharacterKit(config,details,put,h){
 const {ringLoft,limbTube,ellipsoid,torus,allow,J}=h;
 const {light,ink,accent}=details;
 // Thin collar and hem binding, rather than oversized jewelry/headbands.
 put(accent,torus([0,1.488,.004],.086,.008,[1.03,.55,.88]),allow.torso);
 put(accent,ringLoft([[1.047,.211,.151,.004],[1.065,.203,.145,.004]],{capTop:false,capBottom:false}),allow.torso);
 for(const side of ['Left','Right']){
  const s=side==='Left'?1:-1,leg=allow[side==='Left'?'legL':'legR'],foot=allow[side==='Left'?'footL':'footR'];
  // Tailored side piping follows the shorts leg instead of crossing the groin.
  put(accent,limbTube([s*.213,.968,.018],[s*.220,.718,.045],[[0,.010],[1,.009]],{N:8,round:false}),leg);
  // Three contrasting laces and a small heel counter read in close views.
  for(let i=0;i<3;i++)put(light,limbTube([s*.115-.028,.113-i*.003,.025+i*.023],[s*.115+.028,.113-i*.003,.035+i*.023],[[0,.003],[1,.003]],{N:6,round:false}),foot);
  put(accent,ellipsoid([s*.115,.087,-.075],[.044,.027,.014],12),foot);
 }
 const armSide=details.name==='REYES'?'Right':'Left';
 const arm=allow[armSide==='Left'?'armL':'armR'];
 const elbow=J[armSide+'ForeArm'],wrist=J[armSide+'Hand'];
 const lerp=(a,b,t)=>a.map((value,i)=>value+(b[i]-value)*t);
 if(details.name==='REYES')put(ink,limbTube(lerp(elbow,wrist,.05),lerp(elbow,wrist,.82),[[0,.058,.059],[.35,.057,.056],[1,.039,.039]],{N:12,round:false}),arm);
 else put(light,limbTube(lerp(elbow,wrist,.71),lerp(elbow,wrist,.88),[[0,.043],[1,.038]],{N:12,round:false}),arm);
 if(details.name==='VOLT'||details.name==='JETT'){
  const s=details.name==='VOLT'?1:-1;
  put(ink,limbTube([s*.115,.600,.020],[s*.115,.452,.035],[[0,.079],[.5,.073],[1,.069]],{N:12,round:false}),allow[s===1?'legL':'legR']);
 }
}

export function makeJerseyMark(number,color,name=''){
 const canvas=document.createElement('canvas');canvas.width=256;canvas.height=320;
 const ctx=canvas.getContext('2d');
 ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle=color;
 ctx.font='800 29px Arial';ctx.fillText(String(name).toUpperCase().slice(0,8),128,49,228);
 ctx.font='900 190px Arial';ctx.lineWidth=7;ctx.strokeStyle='#11151bcc';ctx.lineJoin='round';
 ctx.strokeText(String(number),128,173,230);ctx.fillText(String(number),128,173,230);
 ctx.fillRect(83,279,90,5);
 const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;return texture;
}
