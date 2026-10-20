import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {build} from 'esbuild';
const root=process.cwd(),source=path.join(root,'src/features/games/retro-innings/runtime'),out=path.join(root,'public/games/retro-innings');
const base=await fs.readFile(path.join(source,'match-template.html'),'utf8'),css=await fs.readFile(path.join(source,'cricket-console.css'),'utf8');
const pinned={name:'cricket-local-source',setup(api){api.onResolve({filter:/.*/},args=>({path:args.path==='three'?path.join(root,'node_modules/three/build/three.module.js'):path.resolve(args.resolveDir,/\.(js|ts)$/.test(args.path)?args.path:args.path+'.ts'),namespace:'local'}));api.onLoad({filter:/.*/,namespace:'local'},async args=>({contents:await fs.readFile(args.path,'utf8'),loader:args.path.endsWith('.ts')?'ts':'js',resolveDir:path.dirname(args.path)}));}};
const result=await build({stdin:{contents:await fs.readFile(path.join(source,'three-cricket-entry.ts'),'utf8'),resolveDir:source,loader:'ts'},plugins:[pinned],tsconfigRaw:{compilerOptions:{}},bundle:true,write:false,format:'iife',target:'es2022',minify:true});
const bridge=`window.presentationBridge={canvas,images,data:DATA,view:()=>({batterPose:batterPose(),batterOrigin:batterOrigin(),keeperPose:keeperPose(),fieldPoses:S.fielders.map(f=>fieldPose(f)),runnerPositions:runnerPositions(),bowlerPosition:bowlerPosition(),broadcast:broadcastModel(),runningInset:runningInsetModel()})};`;
const html=base.replace('</head>','<style>'+css+'</style></head>').replace('width=device-width,initial-scale=1','width=device-width,initial-scale=1,viewport-fit=cover').replace('</script></body>',()=>bridge+'</script><script>'+result.outputFiles[0].text.replaceAll('</script','<\\/script')+'</script></body>');
await fs.mkdir(out,{recursive:true});await fs.writeFile(path.join(out,'index.html'),html);console.log('Built private handheld Retro Innings: '+Buffer.byteLength(html)+' bytes.');

const provenanceFile=path.join(out,'provenance.json');const provenance=JSON.parse(await fs.readFile(provenanceFile,'utf8'));provenance.sha256=createHash('sha256').update(html).digest('hex');await fs.writeFile(provenanceFile,JSON.stringify(provenance,null,2)+'\n');
