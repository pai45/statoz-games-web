import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {pathToFileURL} from 'node:url';
import {chromium} from '@playwright/test';
const root=process.cwd(),out=path.join(root,'test-results/vibe-basketball'),chrome=process.env.VIBE_CHROMIUM||'C:/Program Files/Google/Chrome/Application/chrome.exe';
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.jpg':'image/jpeg','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml','.glb':'model/gltf-binary','.txt':'text/plain','.woff2':'font/woff2','.ttf':'font/ttf'};
const server=http.createServer(async(req,res)=>{
 try{
  let pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname).replace(/^\/statoz-games-web(?=\/)/,'');
  if(!path.extname(pathname))pathname=pathname.replace(/\/$/,'')+'/index.html';
  const filename=path.resolve(root,'out','.'+pathname);
  if(!filename.startsWith(path.join(root,'out')+path.sep))throw Error('path');
  res.setHeader('Content-Type',mime[path.extname(filename)]||'application/octet-stream');res.end(await fs.readFile(filename));
 }catch{res.writeHead(404);res.end('Not found');}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const origin='http://127.0.0.1:'+server.address().port,base=origin+'/statoz-games-web';
const browser=await chromium.launch({executablePath:chrome,headless:true,args:['--enable-unsafe-swiftshader']});
const report={input:false,host:false,guestGate:false,errorRetry:false,sourceSmoke:false,physicalDevices:false};
try{
 const page=await browser.newPage({viewport:{width:844,height:390},isMobile:true,hasTouch:true});
 await page.goto(base+'/embedded-games/vibe-basketball/?mode=1v1&lite=1');
 await page.waitForFunction(()=>window.__game&&document.getElementById('loading').classList.contains('done'));
 await page.evaluate(()=>window.advanceTime(1));
 const cdp=await page.context().newCDPSession(page);
 async function press(code,dt=1/60,hold=0){
  const box=await page.locator('[data-key="'+code+'"]').boundingBox();
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:box.x+box.width/2,y:box.y+box.height/2,id:7}]});
  await page.waitForFunction(code=>window.__input.keys.has(code),code);
  const during=await page.evaluate(dt=>({...window.__input.poll(null,dt)}),dt);
  if(hold)await page.waitForTimeout(hold);
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  await page.waitForFunction(code=>!window.__input.keys.has(code),code);
  const after=await page.evaluate(()=>({...window.__input.poll(null,1/60)}));
  return {during,after};
 }
 const fake=await press('Space');assert.ok(fake.after.shootReleased&&!fake.after.shootReleasedCommitted,'Quick tap remains a fake');
 const shot=await press('Space',1/60,190);assert.ok(shot.after.shootReleasedCommitted,'Held touch remains a committed shot');
 // Directional skill gesture and cancellation coverage lives in verify-vibe-mobile.mjs.
 assert.ok((await press('ShiftLeft')).during.sprint);

 assert.equal((await press('KeyK')).during.dribbleMove,'spin');
 await page.evaluate(()=>{window.__game.offenseIdx=1-window.__game.userPlayer.team;});await page.waitForFunction(()=>document.documentElement.dataset.vibeRole==='defense');assert.ok((await press('ControlLeft')).during.physical);assert.ok((await press('KeyE')).during.stealPressed);
 report.input=true;await page.close();

 const guest=await browser.newPage();await guest.goto(base+'/play/vibe-basketball/');await guest.getByRole('heading',{name:'LOG IN TO PLAY'}).waitFor();report.guestGate=true;await guest.close();
 const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 await context.addInitScript(()=>{
  localStorage.setItem('statoz.games.web.auth.v2',JSON.stringify({version:2,authenticated:true,email:'vibe-qa@example.test'}));
  localStorage.setItem('statoz.games.web.accounts.v1',JSON.stringify({version:1,accounts:{'vibe-qa@example.test':{onboardingComplete:true}}}));
 });
 const app=await context.newPage(),errors=[];app.on('pageerror',error=>errors.push(error.message));
 await app.goto(base+'/games/basketball/');
 const card=app.getByRole('link',{name:'Play VIBE BASKETBALL',exact:true});await card.waitFor();
 assert.ok(await app.getByRole('link',{name:'Play RIMFORGE 3',exact:true}).count(),'Existing basketball game retained');
 await app.screenshot({path:path.join(out,'app-basketball-library.png')});await card.click();
 const frame=app.frameLocator('iframe[title^="Vibe Basketball"]');
 await frame.locator('#mode-menu.show').waitFor({timeout:120000});
 assert.match(await app.locator('meta[name=viewport]').getAttribute('content'),/viewport-fit=cover/,'Game route enables device safe areas');
 await app.getByRole('heading',{name:'Vibe Basketball',exact:true}).waitFor({state:'hidden'});
 await frame.locator('#mode-1v1').click();await frame.locator('#vibe-shoot').waitFor();
 await frame.locator('#loading.done').waitFor({state:'attached'});await app.waitForTimeout(650);
 await app.screenshot({path:path.join(out,'app-mobile-game.png')});
 await app.setViewportSize({width:844,height:390});
 await app.waitForTimeout(150);if(await frame.locator('#vibe-pause').isVisible())await frame.locator('[data-command=resume]').click();
 const landscapeFrame=await app.locator('iframe').boundingBox();assert.ok(landscapeFrame.y>=16,'Landscape status bar has reserved space');
 await app.screenshot({path:path.join(out,'app-landscape-safe-area.png')});
 await app.setViewportSize({width:390,height:844});
 await app.waitForTimeout(150);if(await frame.locator('#vibe-pause').isVisible())await frame.locator('[data-command=resume]').click();
 await app.locator('iframe').evaluate(frame=>{frame.parentElement.style.padding='20px 18px 24px';});
 const safeFrame=await app.locator('iframe').boundingBox();assert.ok(safeFrame.x>=18&&safeFrame.y>=20&&safeFrame.y+safeFrame.height<=820,'Parent safe areas reserve space outside the iframe');
 await app.screenshot({path:path.join(out,'app-mobile-safe-area.png')});
 await app.locator('iframe').evaluate(frame=>{frame.parentElement.style.padding='';});
 await app.evaluate(()=>{Object.defineProperty(window.visualViewport,'height',{configurable:true,value:620});window.visualViewport.dispatchEvent(new Event('resize'));});
 assert.ok((await app.locator('iframe').boundingBox()).height<=620,'Visible viewport height constrains the game frame');report.safeAreas=true;report.landscapeStatusBar=true;report.visualViewport=true;
 await app.evaluate(()=>{delete window.visualViewport.height;window.visualViewport.dispatchEvent(new Event('resize'));});

 await frame.locator('#vibe-toolbar [data-command=pause]').click();await frame.locator('[data-command=resume]').click();
 await frame.locator('#vibe-toolbar').evaluate(()=>parent.postMessage({protocolVersion:1,gameId:'vibe-basketball',sessionId:'wrong-session',type:'exit'},location.origin));
 await app.waitForTimeout(100);assert.ok(app.url().includes('/play/vibe-basketball'),'Rejects wrong-session messages');
 await frame.locator('#vibe-toolbar [data-command=exit]').click();await app.waitForURL('**/games/basketball/**');
 assert.equal(await app.locator('iframe[title^="Vibe Basketball"]').count(),0,'Exiting releases the game frame');
 assert.deepEqual(errors,[]);report.host=true;
 // Verify failed module load is surfaced and recoverable instead of leaving an endless loader.
 await context.route('**/embedded-games/vibe-basketball/game.js',route=>route.abort());
 await app.goto(base+'/play/vibe-basketball/');
 await app.getByRole('button',{name:'Retry',exact:true}).waitFor({timeout:70000});
 await context.unroute('**/embedded-games/vibe-basketball/game.js');await app.getByRole('button',{name:'Retry',exact:true}).click();
 await app.frameLocator('iframe').locator('#mode-menu.show').waitFor({timeout:120000});report.errorRetry=true;await context.close();

 // The upstream smoke assertions run unchanged; adapt only runner paths and browser launch.
 const smoke=await fs.readFile(path.join(root,'vendor/vibebasketball/tools/smoke.mjs'),'utf8');
 const adapted=smoke.replace("from 'playwright'",'from '+JSON.stringify(pathToFileURL(path.join(root,'node_modules/@playwright/test/index.mjs')).href))
  .replace(/const port = 5198;[\s\S]*?(?=const waitForServer)/,'const origin = '+JSON.stringify(base+'/embedded-games/vibe-basketball')+'; const server = {kill(){}};\n')
  .replace('await waitForServer();','')
  .replace('headless: !localMac,','headless: true, executablePath: '+JSON.stringify(chrome)+',')
  .replace("args: localMac ? ['--use-angle=metal'] : [],","args: ['--enable-unsafe-swiftshader'],");
 const smokePath=path.join(root,'.cache/vibe-smoke.mjs');await fs.writeFile(smokePath,adapted);
 await new Promise((resolve,reject)=>{const child=spawn(process.execPath,[smokePath],{cwd:root,stdio:['ignore','pipe','pipe']});let log='';child.stdout.on('data',data=>{log+=data;process.stdout.write(data);});child.stderr.on('data',data=>{log+=data;process.stderr.write(data);});child.on('error',reject);child.on('exit',async code=>{await fs.writeFile(path.join(out,'upstream-smoke.log'),log);if(code===0)resolve();else reject(Error('Upstream smoke failed: '+code));});});
 report.sourceSmoke=true;
 await fs.writeFile(path.join(out,'extra-validation.json'),JSON.stringify(report,null,2));
 console.log('Vibe Basketball input timing, app launch/exit, guest gate, retry and upstream smoke passed.');
}finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
