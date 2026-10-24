import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {build} from 'esbuild';

export async function buildPitchRush({prelude}) {
  const root=process.cwd(), source=path.join(root,'vendor/websoccer');
  const provenance=JSON.parse(await fs.readFile(path.join(source,'SOURCE.json'),'utf8'));
  for(const [name,hash] of Object.entries(provenance.files)) {
    if(createHash('sha256').update(await fs.readFile(path.join(source,name))).digest('hex')!==hash) throw Error('WebSoccer source changed: '+name);
  }
  const bridge=await fs.readFile(path.join(root,'src/features/games/pitch-rush/bridge.js'),'utf8');
  const result=await build({entryPoints:[path.join(source,'src/main.js')],bundle:true,write:false,format:'iife',target:'es2020',minify:true,plugins:[{name:'pitch-rush-adaptation',setup(b){
    b.onLoad({filter:/[\\/]config\.js$/},()=>({contents:"export const DEFAULT_RELAY=''; export const relayFor=()=>null; export const boardFor=()=>null;",loader:'js'}));
    b.onLoad({filter:/[\\/]touch\.js$/},async args=>({contents:(await fs.readFile(args.path,'utf8')).replace('const MAX_THROW = 46;','const MAX_THROW = 28;').replace('    this.button(kick, BTN.FIRE);','    // Separate attack and defence bindings are supplied by the game adapter.'),loader:'js'}));
    b.onLoad({filter:/[\\/]main\.js$/},async args=>{
      let js=await fs.readFile(args.path,'utf8');
      js=js.replace('import { FRAME_TIME, TICK_RATE }','import { BTN, FRAME_TIME, TICK_RATE }');
      js='let hostDisposed=false,hostRaf=0;\n'+js.replaceAll('requestAnimationFrame(frame)', 'hostRaf=requestAnimationFrame(frame)');
      js=js.replace('function frame(now) {','function frame(now) {\n if(hostDisposed)return;\n hostUpdate();');
      js=js.replace('game.transport.sample(tick);','syncTouchAction(); game.transport.sample(tick);');
      js=js.replace('function beginMatch(state, transport) {','function beginMatch(state, transport) {\n releaseInputs();');
      js=js.replace('  game.paused = on;',"  game.paused = on;\n  if(on){music.stop();audio.ctx?.suspend?.();}else if(soundOn){audio.wake();}");
      js=js.replace('function toMenu() {','function toMenu() {\n game.paused=false; if(soundOn)audio.wake();');
      return {contents:js+'\n'+bridge,loader:'js'};
    });
  }}]});
  let html=await fs.readFile(path.join(source,'index.html'),'utf8');
  const css=await fs.readFile(path.join(source,'styles.css'),'utf8');
  const skin=await fs.readFile(path.join(root,'src/features/games/pitch-rush/presentation.css'),'utf8');
  const cover='data:image/webp;base64,'+(await fs.readFile(path.join(root,'public/games/pitch-rush/cover.webp'))).toString('base64');
  html=html.replace('<html lang="en">','<html lang="en" data-game="pitch-rush">')
    .replaceAll('WebSoccer','Pitch Rush')
    .replace('<h1>WEB<span>SOCCER</span></h1>','<h1>PITCH<span>RUSH</span></h1>')
    .replace('HTML / JavaScript &middot; local &amp; online','ELEVEN A SIDE. ONE MORE MATCH.')
    .replace('<button data-mode="online">Online</button>','<button data-mode="online" hidden disabled>Online</button>')
    .replace('<link rel="stylesheet" href="styles.css">',()=>'<style>'+css+'\n'+skin+'</style>')
    .replace(/<link rel="(?:manifest|apple-touch-icon)"[^>]*>/g,'')
    .replace('<div id="menu" class="overlay">',()=>'<div id="menu" class="overlay" style="--cover:url('+cover+')">')
    .replace('<div class="panelFooter">','<p class="fineprint">Offline edition · CPU or two players on one device. Two-player mode uses keyboard or gamepads.</p><div class="panelFooter">')
    .replace('</body>','<footer id="gameCredits">Based on WebSoccer by Mark Clausing · MIT license</footer></body>')
    .replace('<script type="module" src="src/main.js"></script>',()=>prelude+'<script>'+result.outputFiles[0].text.replaceAll('</script','<\\/script')+'</script>');
  return html;
}
