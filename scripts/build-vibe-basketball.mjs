import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {build} from 'esbuild';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const source=path.join(root,'vendor/vibebasketball');
const feature=path.join(root,'src/features/games/vibe-basketball');
export async function verifyVibeSource(){
 const manifest=JSON.parse(await fs.readFile(path.join(source,'SOURCE.json'),'utf8'));
 if(manifest.commit!=='184a5b27ee259869744f0b32de9954ab7983c1bb')throw Error('Unexpected Vibe Basketball revision');
 for(const [name,hash] of Object.entries(manifest.files)){
  if(path.isAbsolute(name)||name.split(/[\\/]/).includes('..'))throw Error('Invalid baseline path');
  const bytes=await fs.readFile(path.join(source,name));
  if(createHash('sha256').update(bytes).digest('hex')!==hash)throw Error('Vibe Basketball baseline changed: '+name);
 }
 return manifest;
}
export async function buildVibeBasketball(){
 await verifyVibeSource();
 const pkg=JSON.parse(await fs.readFile(path.join(source,'node_modules/three/package.json'),'utf8').catch(()=>{throw Error('Run npm ci --prefix vendor/vibebasketball before building Vibe Basketball');}));
 if(pkg.version!=='0.170.0')throw Error('Vibe Basketball requires Three.js 0.170.0');
 const out=path.join(root,'public/embedded-games/vibe-basketball');
 await fs.mkdir(out,{recursive:true});
 const replace=(text,from,to)=>{if(!text.includes(from))throw Error('Upstream integration anchor changed: '+from);return text.replace(from,to);};
 await build({entryPoints:[path.join(source,'src/main.js')],outfile:path.join(out,'game.js'),bundle:true,format:'esm',target:'es2022',minify:true,keepNames:true,alias:{three:path.join(source,'node_modules/three')},legalComments:'eof',plugins:[{name:'vibe-host',setup(b){
  b.onLoad({filter:/[\\/]src[\\/]main\.js$/},async args=>{
   let text=await fs.readFile(args.path,'utf8');
   text=replace(text,'if (manualTime) return;', 'if (window.__VIBE_HOST__.paused) { clock.getDelta(); lastNow = performance.now(); return; } if (manualTime) return;');
   text=replace(text,'manualTime = true;', 'if (window.__VIBE_HOST__.paused) return; manualTime = true;');
   text=replace(text,'hud.doneLoading();','hud.doneLoading(); window.__VIBE_HOST__.ready();');
   text=replace(text,'location.href = location.pathname;', "location.href = location.pathname + '?session=' + encodeURIComponent(new URLSearchParams(location.search).get('session') || '');");
   return {contents:text,loader:'js'};
  });
  b.onLoad({filter:/[\\/]contestRacks\.js$/},async args=>({contents:replace(await fs.readFile(args.path,'utf8'),"'/models/contest/vibe-contest-props.glb'","new URL('./models/contest/vibe-contest-props.glb', location.href).href"),loader:'js'}));
  b.onLoad({filter:/[\\/]courtSfx\.js$/},async args=>({contents:replace(await fs.readFile(args.path,'utf8'),'unlock() {','unlock() { if (window.__VIBE_HOST__?.paused) return;'),loader:'js'}));
  b.onLoad({filter:/[\\/]rig\.js$/},async args=>{
   let text=(await fs.readFile(args.path,'utf8')).replaceAll('\r\n','\n');
   text="import { characterConfig, buildCharacterHead, addCharacterKit, makeJerseyMark } from "+JSON.stringify(path.join(feature,'character-design.js'))+";\n"+text;
   text=replace(text,'    this.config = config;','    config = characterConfig(config); this.config = config;');
   text=replace(text,'ringLoft(SEAT_SHORTS,','ringLoft([...SEAT_SHORTS].reverse(),');
   text=replace(text,'limbTube([s * 0.120, 0.958, 0.004]','limbTube([s * 0.120, 1.040, 0.004]');
   // The source's round pectoral overlays poke through its jersey; the torso loft already supplies the chest.
   text=text.replace(/    put\(skin, ellipsoid\(\[[-\d.]+, 1\.352, 0\.104\][^\n]+\n/g,'');
   text=replace(text,'normalScale: new THREE.Vector2(0.22, 0.22)','normalScale: new THREE.Vector2(0.10, 0.10)');
   text=replace(text,'normalScale: new THREE.Vector2(0.28, 0.28)','normalScale: new THREE.Vector2(0.12, 0.12)');
   text=replace(text,'normalScale: new THREE.Vector2(0.26, 0.26)','normalScale: new THREE.Vector2(0.12, 0.12)');
   const start=text.indexOf('  buildHead(put, skin, hair, trim) {');
   const end=text.indexOf('  /** reset all bones to bind */',start);
   if(start<0||end<0)throw Error('Upstream head method changed');
   text=text.slice(0,start)+"  buildHead(put, skin, hair, trim) { this.characterDesign = buildCharacterHead(this.config,put,skin,hair,trim,{ringLoft,ellipsoid,limbTube,torus,allow:ALLOW.head}); }\n\n"+text.slice(end);
   text=replace(text,'    // ---------------------------------------------------------- skeleton',"    addCharacterKit(config,this.characterDesign,put,{ringLoft,limbTube,ellipsoid,torus,allow:ALLOW,J});\n    // ---------------------------------------------------------- skeleton");
   text=replace(text,'    // jersey number (front + back), skinned to chest',"    this.meshFaceLight=mk(this.characterDesign.light,new THREE.MeshStandardMaterial({color:0xf6eee0,roughness:.78}));\n    this.meshFaceInk=mk(this.characterDesign.ink,new THREE.MeshStandardMaterial({color:0x24232a,roughness:.85}));\n    this.meshKitAccent=mk(this.characterDesign.accent,new THREE.MeshStandardMaterial({color:config.shoes??0xf4ac61,roughness:.75}));\n    this.group.userData.characterDesign={version:2,name:this.characterDesign.name,hair:this.characterDesign.style};\n    // jersey number (front + back), skinned to chest");
   text=replace(text,'makeNumberTexture(cfg.number, cfg.numberColor)','makeJerseyMark(cfg.number, cfg.numberColor, config.name)');
   text=replace(text,'        g.translate(0, 1.335, z);\n        if (back) g.rotateY(Math.PI);','        if (back) g.rotateY(Math.PI);\n        g.translate(0, 1.335, z);');
   return {contents:text,loader:'js'};
  });
  b.onLoad({filter:/[\\/]input\.js$/},async args=>({contents:replace(await fs.readFile(args.path,'utf8'),'let mag = Math.hypot(ix, iz);','if (window.__VIBE_HOST__?.move) { ix = window.__VIBE_HOST__.move.x; iz = window.__VIBE_HOST__.move.z; } let mag = Math.hypot(ix, iz);'),loader:'js'}));
 }}]});
 let html=await fs.readFile(path.join(source,'index.html'),'utf8');
 html=replace(html,'href="/src/style.css"','href="./original.css"');
 html=replace(html,'<script type="module" src="/src/main.js"></script>','<script src="./adapter.js"></script><script type="module" src="./game.js"></script>');
 html=replace(html,'</head>','<link rel="stylesheet" href="./mobile.css"></head>');
 html=html.replace('width=device-width, initial-scale=1.0','width=device-width, initial-scale=1.0, viewport-fit=cover');
 await fs.writeFile(path.join(out,'index.html'),html);
 await fs.copyFile(path.join(source,'src/style.css'),path.join(out,'original.css'));
 for(const name of ['adapter.js','mobile.css'])await fs.copyFile(path.join(feature,name),path.join(out,name));
 await fs.mkdir(path.join(out,'models/contest'),{recursive:true});
 await fs.copyFile(path.join(source,'public/models/contest/vibe-contest-props.glb'),path.join(out,'models/contest/vibe-contest-props.glb'));
 const notices=await Promise.all(['LICENSE','THIRD_PARTY_NOTICES.md','node_modules/three/LICENSE'].map(async name=>name+'\n\n'+await fs.readFile(path.join(source,name),'utf8')));
 await fs.writeFile(path.join(out,'LICENSES.txt'),notices.join('\n\n---\n\n'));
 console.log('Vibe Basketball: pinned Three.js 0.170.0, local models, responsive touch adapter');
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))await buildVibeBasketball();
