import {chromium,expect} from '@playwright/test';
import next from 'next';
import http from 'node:http';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const out='test-results/penalty-cup';await fs.mkdir(out,{recursive:true});
const app=next({dev:false,dir:process.cwd()});await app.prepare();
const handler=app.getRequestHandler(),server=http.createServer((req,res)=>handler(req,res));await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const browser=await chromium.launch({headless:true}),errors=[];let activePage;
try{
 const context=await browser.newContext({viewport:{width:1280,height:850},hasTouch:true,isMobile:true,serviceWorkers:'block'});
 await context.addInitScript(()=>Object.defineProperty(window,'isSecureContext',{value:false}));
 await context.addInitScript(()=>{localStorage.setItem('statoz.games.web.auth.v2',JSON.stringify({version:2,authenticated:true,email:'penalty-cup@example.test'}));localStorage.setItem('statoz.games.web.accounts.v1',JSON.stringify({version:1,accounts:{'penalty-cup@example.test':{onboardingComplete:true}}}));localStorage.setItem('statoz.games.web.account-data-owner.v1','penalty-cup@example.test');});
 const page=await context.newPage();activePage=page;page.setDefaultTimeout(25000);page.on('pageerror',e=>errors.push(e.message));const origin=`http://127.0.0.1:${server.address().port}`;
 async function enterApp(){for(const f of page.frames()){const online=f.getByRole('button',{name:'Play online',exact:true});if(await online.isVisible())await online.click();}}
 await page.goto(origin+'/games/football');await expect.poll(async()=>{await enterApp();return page.locator('a[href="/play/penalty-cup"]').first().isVisible();},{timeout:60000}).toBe(true);
 await page.setViewportSize({width:390,height:844});await page.goto(origin+'/play/penalty-cup');const frame=page.frameLocator('iframe[title="PENALTY CUP"]');await expect.poll(async()=>{await enterApp();return frame.getByRole('button',{name:/THE COMPLETE JOURNEY/}).isVisible().catch(()=>false);},{timeout:60000}).toBe(true);
 assert.equal(await page.locator('[data-mobile-game-frame]').count(),0,'Penalty Cup must preserve a portrait viewport');
 await page.screenshot({path:out+'/app-portrait-home.png'});
 await frame.getByRole('button',{name:/THE COMPLETE JOURNEY/}).click();await frame.getByRole('button',{name:/Start Penalty Cup/}).click();await frame.getByRole('heading',{name:'Your road to the cup'}).waitFor();
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('statoz.games.web.bundle.penalty-cup.penalty-cup%40example.test')));assert.equal(saved.schemaVersion,1);assert.ok(Object.keys(saved.stores).some(k=>k.startsWith('penalty-cup.v1.')));
 await page.reload();await expect.poll(async()=>{await enterApp();return frame.getByRole('button',{name:/Continue Cup/}).isVisible().catch(()=>false);},{timeout:60000}).toBe(true);await frame.getByRole('button',{name:/Continue Cup/}).click();await frame.getByRole('heading',{name:'Your road to the cup'}).waitFor();
 await page.screenshot({path:out+'/app-portrait-restored-cup.png'});
 await page.setViewportSize({width:1280,height:850});await page.goto(origin+'/how-to-play/penalty-cup');await enterApp();await page.getByRole('heading',{name:'PENALTY CUP',exact:true}).first().waitFor();
 assert.deepEqual(errors,[]);await fs.writeFile(out+'/app-validation.json',JSON.stringify({productionRoute:true,footballDiscovery:true,portraitViewport:true,accountSaveReload:true,helpRoute:true,errors},null,2));console.log('Production route, football discovery, portrait viewport, durable host save/reload, and help page passed.');
}catch(error){process.exitCode=1;if(activePage)await activePage.screenshot({path:out+'/app-failure.png'}).catch(()=>{});await fs.writeFile(out+'/app-failure.json',JSON.stringify({error:String(error),errors},null,2));throw error;}finally{await browser.close();server.closeAllConnections();await new Promise(resolve=>server.close(resolve));await app.close();}
