// Controlled setup only: actual contact, keeper decisions and ball integration run in shared engine.
const wait=setInterval(()=>{if(!window.productionLab?.ready)return;clearInterval(wait);install();},100);
function install(){
 const controls=document.createElement('section');controls.className='shell';controls.style.padding='16px';
 const heading=document.createElement('h2');heading.textContent='Physical action lab';controls.append(heading);
 const note=document.createElement('p');note.textContent='Isolated setup. Other actors are inactive. Physics and renderer are the match runtime. Pause, step or replay; no contact/possession result is forced.';controls.append(note);
 const pre=document.createElement('pre');pre.style.cssText='white-space:pre-wrap;max-height:240px;overflow:auto;font-size:12px';
 function fixture(team,half,kind){
  const session=productionLab.session,sim=session.sim;session.restart();session.start();const s=sim.state;
  Object.assign(s,{phase:'open',restart:null,owner:null,lastKicker:null,noDoubleTouch:null,half});
  for(const p of s.players)Object.assign(p,{x:52+p.id*.2,y:4,cooldown:100000,action:null});
  const p=s.players[team*11],d=sim.attack(team);Object.assign(p,{x:d===1?4:101,y:34,cooldown:0});s.selected=9;
  const hand=sim.anchor(p,'leftHand',{pose:'keeper-reach',mirror:d<0});
  Object.assign(s.ball,{x:hand.x+d*.7,y:hand.y,z:kind==='high'?100:hand.z+1,vx:-d*(kind==='fast'?40:16),vy:0,vz:0});s.lastTouch=team===0?1:0;
  session.step(0);
 }
 for(const [label,team,half,kind] of [['Harbour catch',0,1,'catch'],['Orchard catch',1,1,'catch'],['Harbour other end',0,2,'catch'],['Orchard other end',1,2,'catch'],['Fast parry',0,1,'fast'],['High miss',0,1,'high']]){
  const b=document.createElement('button');b.textContent=label;b.onclick=()=>fixture(team,half,kind);controls.append(b);
 }
 const step=document.createElement('button');step.textContent='Step one update';step.onclick=()=>{const session=productionLab.session;session.resume();session.step(1);session.pause();};controls.append(step);
 const freeze=document.createElement('button');freeze.textContent='Pause / resume lab';freeze.onclick=()=>productionLab.session.dispatch({type:'pause'});controls.append(freeze);
 controls.append(pre);document.body.prepend(controls);
 const overlay=document.createElement('canvas');overlay.width=320;overlay.height=224;overlay.style.cssText='position:absolute;inset:0;width:100%;height:100%;pointer-events:none;image-rendering:pixelated';document.querySelector('.arena').append(overlay);
 const paint=()=>{const sim=productionLab.session?.sim;if(!sim)return;const s=sim.state,ctx=overlay.getContext('2d');ctx.clearRect(0,0,320,224);
  for(const p of s.players.filter(p=>p.role==='keeper'))for(const name of ['leftHand','rightHand','ball','kickingFoot']){
   const pose=sim.view(p),record=sim.poses.get(pose.pose);if(!record?.anchors[name])continue;
   const a=sim.anchor(p,name),x=48+a.x*6-s.camera.x,y=80+a.y*3.2-a.z-s.camera.y;ctx.fillStyle=name==='ball'?'#fdc700':'#ffffff';ctx.fillRect(Math.round(x)-1,Math.round(y)-1,3,3);
  }
  pre.textContent=JSON.stringify({tick:s.tick,status:s.status,owner:s.owner,ball:s.ball,keepers:s.players.filter(p=>p.keeperCycle).map(p=>({id:p.id,cycle:p.keeperCycle,pose:sim.view(p)})),events:s.events.slice(-5)},null,2);
 };
 const timer=setInterval(paint,100);window.addEventListener('pagehide',()=>clearInterval(timer),{once:true});fixture(0,1,'catch');
}
