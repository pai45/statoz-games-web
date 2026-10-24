// Runs in the upstream main module's lexical scope. The host owns persistence.
const host=window.__STATOZ_HOST__;
const coarse=matchMedia('(pointer: coarse)');
const durationSelect=document.getElementById('duration');
durationSelect.insertAdjacentHTML('afterbegin','<option value="45">Quick (2 × 45 sec)</option><option value="90">Arcade (2 × 90 sec)</option>');
if(coarse.matches)durationSelect.value='45';
const advanced=document.createElement('details');
advanced.id='matchOptions';advanced.innerHTML='<summary>Options & tactics</summary>';
document.querySelector('#menu .panelFooter').before(advanced);
for(const row of [...document.querySelectorAll('#menu > .panel > .row')]){
  if(['Sound','Commentary','Offside'].includes(row.querySelector('label')?.textContent.trim()))advanced.append(row);
}
for(const id of ['controlsBox','lineupBox','scoresBox'])advanced.append(document.getElementById(id));
const mobileHint=document.createElement('p');mobileHint.id='mobileHint';
mobileHint.textContent='DRAG TO RUN';document.getElementById('touch').append(mobileHint);
document.getElementById('stick').setAttribute('aria-label','Movement joystick');
const attackButton=document.getElementById('btnKick');
attackButton.innerHTML='<strong>ATTACK</strong><small>PASS / SHOOT</small>';
attackButton.setAttribute('aria-label','Attack: tap to pass; hold and release to shoot');
const defenceButton=document.createElement('button');
defenceButton.type='button';defenceButton.id='btnDefend';
defenceButton.innerHTML='<strong>DEFENCE</strong><small>SLIDE TACKLE</small>';
defenceButton.setAttribute('aria-label','Defence: slide tackle without the ball');
document.getElementById('touchButtons').prepend(defenceButton);
// Keep the optional manual player switch away from the two main right buttons.
document.getElementById('touch').append(document.getElementById('btnSwap'));
const attackPointers=new Set(),defencePointers=new Set();
function ownsControlledBall(){
  const state=game.state,owner=state?.ball.owner;
  return !!owner&&owner.team===0&&owner.idx===state.teams[0].controlled;
}
function syncTouchAction(){
  const active=game.state&&!game.paused&&!hostDisposed;
  const firing=active&&((ownsControlledBall()&&attackPointers.size)||(game.state.ball.owner?.team!==0&&defencePointers.size));
  touch.mask=(touch.mask&~BTN.FIRE)|(firing?BTN.FIRE:0);
}
for(const [button,pointers,attack] of [[attackButton,attackPointers,true],[defenceButton,defencePointers,false]]){
  button.addEventListener('pointerdown',event=>{
    if(!game.state||game.paused||(attack?!ownsControlledBall():game.state.ball.owner?.team===0))return;
    event.preventDefault();button.setPointerCapture(event.pointerId);
    pointers.add(event.pointerId);button.classList.add('pressed');syncTouchAction();
  });
  const release=event=>{
    pointers.delete(event.pointerId);
    if(!pointers.size)button.classList.remove('pressed');
    syncTouchAction();
  };
  for(const type of ['pointerup','pointercancel','lostpointercapture'])button.addEventListener(type,release);
}
document.getElementById('btnPause').setAttribute('aria-label','Pause match');
const help=document.createElement('p');help.className='mobileHelp';help.textContent='Left stick: move / aim · Attack: tap to pass, hold to shoot · Defence: slide tackle';
document.querySelector('#menu .tag').after(help);
if(coarse.matches)document.querySelector('[data-mode="2"]').textContent='2 controllers';
function sizePlayfield(){
  if(coarse.matches&&innerWidth>innerHeight){
    const box=canvas.getBoundingClientRect();
    canvas.height=480;canvas.width=Math.max(420,Math.round(480*box.width/box.height));
  }else{canvas.width=900;canvas.height=620;}
  renderer.ctx.imageSmoothingEnabled=false;
  if(game.state)renderer.updateCamera(game.state,true);
}
sizePlayfield();
window.addEventListener('resize',sizePlayfield);coarse.addEventListener('change',sizePlayfield);
const endActions=document.createElement('div');endActions.id='endActions';endActions.className='overlay hidden';
endActions.innerHTML='<div class="panel small"><h2>FULL TIME</h2><p id="endScore"></p><button id="rematch" class="primary">Play again</button><button id="endMenu">Match setup</button></div>';
document.getElementById('wrap').append(endActions);
document.getElementById('rematch').addEventListener('click',()=>{releaseInputs();startLocal({players:Number(mode),halfSeconds:halfSeconds()});});
document.getElementById('endMenu').addEventListener('click',toMenu);
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- Called by the adapted upstream animation loop.
function hostUpdate(){
  const finished=game.state?.phase==='fulltime'&&!pending.open&&(game.ended||game.transport?.humanSlots?.length!==1);
  endActions.classList.toggle('hidden',!finished);
  if(finished)document.getElementById('endScore').textContent=game.state.score.join(' — ');
  const attacking=ownsControlledBall();
  attackButton.setAttribute('aria-disabled',String(!attacking));
  defenceButton.setAttribute('aria-disabled',String(game.state?.ball.owner?.team===0));
  syncTouchAction();
}
function releaseInputs(){
  devices.down.clear();
  attackPointers.clear();defencePointers.clear();
  touch.mask=0;touch.stickPointer=null;
  document.getElementById('knob').style.transform='translate(-50%, -50%)';
  document.querySelectorAll('#touch .pressed').forEach(node=>node.classList.remove('pressed'));
}
function hostPause(){
  releaseInputs();setPaused(true);music.stop();audio.ctx?.suspend?.();
}
host.command=type=>{
  if(type==='pause')hostPause();
  if(type==='resume'&&!document.hidden)setPaused(false);
  if(type==='dispose'){
    hostPause();hostDisposed=true;cancelAnimationFrame(hostRaf);
    devices.detach();touch.show(false);game.transport?.dispose();game.signal?.close();audio.ctx?.close?.();
    window.removeEventListener('resize',sizePlayfield);coarse.removeEventListener('change',sizePlayfield);
  }
};
const exit=()=>{hostPause();host.emit('exit');};
for(const panel of [document.querySelector('#menu .panelFooter'),document.querySelector('#pause .panel')]){
  const button=document.createElement('button');button.type='button';button.textContent='Exit to football';
  button.addEventListener('click',exit);panel.append(button);
}
window.addEventListener('blur',hostPause);
document.getElementById('stick').addEventListener('lostpointercapture',()=>{
  touch.stickPointer=null;touch.mask&=~(BTN.UP|BTN.DOWN|BTN.LEFT|BTN.RIGHT);
  document.getElementById('knob').style.transform='translate(-50%, -50%)';
});
for(const [id,bit] of [['btnSwap',BTN.SWITCH]]){
  document.getElementById(id).addEventListener('lostpointercapture',()=>{touch.mask&=~bit;document.getElementById(id).classList.remove('pressed');});
}
document.addEventListener('visibilitychange',()=>{if(document.hidden)hostPause();});
window.addEventListener('pointerdown',()=>{
  if(!game.paused&&soundOn&&audio.ctx?.state==='suspended'){
    audio.wake();if(!game.state)music.start();
  }
});
host.emit('ready');
if(document.hidden)hostPause();
