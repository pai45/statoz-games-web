import fs from 'node:fs/promises';
import path from 'node:path';
export async function buildOpenGolf({prelude}) {
 const root=path.join(process.cwd(),'vendor/open-golf');
 const runtime=await fs.readFile(path.join(root,'golf.js'),'utf8');
 const worker=await fs.readFile(path.join(root,'golf.worker.js'),'utf8');
 const wasm=(await fs.readFile(path.join(root,'golf.wasm'))).toString('base64');
 const notices=await fs.readFile(path.join(root,'THIRD-PARTY-NOTICES.txt'),'utf8');
 const configuration=`
const runtimeSource=${JSON.stringify(runtime)};
const runtimeBlob=new Blob([runtimeSource],{type:'application/javascript'});
const workerURL=URL.createObjectURL(new Blob([${JSON.stringify(worker)}],{type:'application/javascript'}));
let paused=false,disposed=false;const waiting=new Map(),raf=requestAnimationFrame.bind(window),caf=cancelAnimationFrame.bind(window);
window.requestAnimationFrame=callback=>{let id;id=raf(time=>{if(disposed)return;if(paused)waiting.set(id,callback);else callback(time);});return id;};
window.cancelAnimationFrame=id=>{waiting.delete(id);caf(id);};
var Module={canvas:document.getElementById('canvas'),wasmBinary:Uint8Array.from(atob('${wasm}'),c=>c.charCodeAt(0)),mainScriptUrlOrBlob:runtimeBlob,locateFile:name=>{if(name.endsWith('.worker.js'))return workerURL;if(name.endsWith('.wasm'))return name;throw Error('Unexpected Open Golf resource: '+name);},preRun:[()=>{
  const mount=FS.mount.bind(FS);
  FS.mount=(type,options,target)=>mount(target==='/opengolf_persistent_data'?MEMFS:type,options,target);
  FS.syncfs=(populate,callback)=>{if(typeof populate==='function'){callback=populate;populate=false;}try{
    const file='/opengolf_persistent_data/storage.json';
    if(populate){const saved=localStorage.getItem('open-golf.storage');if(saved)FS.writeFile(file,saved);}
    else{try{localStorage.setItem('open-golf.storage',FS.readFile(file,{encoding:'utf8'}));}catch(e){if(e.errno!==44)throw e;}}
    callback(null);
  }catch(error){callback(error);}};
}],onRuntimeInitialized:()=>{window.__STATOZ_HOST__.emit('ready');document.getElementById('loading').remove();},onAbort:()=>window.__STATOZ_HOST__.emit('error',{message:'Open Golf could not start.'})};
window.__STATOZ_HOST__.command=command=>{if(command==='pause'){paused=true;Module._saudio_context?.suspend();document.getElementById('resume').hidden=false;}else if(command==='resume'){paused=false;for(const callback of waiting.values())raf(callback);waiting.clear();Module._saudio_context?.resume();document.getElementById('resume').hidden=true;}else if(command==='dispose'){disposed=true;waiting.clear();PThread.terminateAllThreads();Module._saudio_context?.close();URL.revokeObjectURL(workerURL);}};
document.getElementById('resume').onclick=()=>window.__STATOZ_HOST__.command('resume');
`;
 const escape=s=>s.replaceAll('</script','<\\/script');
 return `<!doctype html><html lang="en" data-game="open-golf"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><title>Open Golf</title><style>html,body{margin:0;background:#000;width:100%;height:100%;overflow:hidden}canvas{position:absolute;width:100%;height:100%;display:block;touch-action:none}#loading,#resume{position:absolute;inset:40% 20%;z-index:2;color:white;background:#172d21;font:20px sans-serif;text-align:center;padding:24px}#resume[hidden]{display:none}</style></head><body><canvas id="canvas" oncontextmenu="event.preventDefault()"></canvas><div id="loading">Loading Open Golf…</div><button id="resume" hidden>Resume Open Golf</button><script type="application/json" id="open-golf-credits">${escape(JSON.stringify(notices))}</script>${prelude}<script>${escape(configuration)}</script><script>${escape(runtime)}</script></body></html>`;
}


