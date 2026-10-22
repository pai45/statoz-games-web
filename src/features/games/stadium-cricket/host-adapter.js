/* Host lifecycle only. CricketV2 game.js, players.js, stadium.js and cinema.js are unchanged. */
(function(){
 'use strict';
 const host=window.__STATOZ_HOST__;
 if(!host)return;
 // srcdoc has no index.html URL. Preserve the original home-link behavior through the host.
 document.addEventListener('click',event=>{if(event.target instanceof Element&&event.target.closest('a.brand')){event.preventDefault();host.emit('reload');}});
 let disposed=false,ready=false,pauseRequested=false,request=0;
 const frames=new Set(),contexts=new Set();
 const requestFrame=window.requestAnimationFrame.bind(window),cancelFrame=window.cancelAnimationFrame.bind(window);
 window.requestAnimationFrame=callback=>{
  if(disposed)return 0;
  let id;id=requestFrame(time=>{frames.delete(id);if(!disposed)callback(time);});frames.add(id);return id;
 };
 for(const name of ['AudioContext','webkitAudioContext']){
  const Original=window[name];if(!Original)continue;
  window[name]=new Proxy(Original,{construct(Target,args){const context=Reflect.construct(Target,args);contexts.add(context);return context;}});
 }
 const pause=()=>{
  pauseRequested=true;
  const snapshot=window.CM?.snapshot?.();
  if(snapshot&&!snapshot.paused&&!['intro','over'].includes(snapshot.phase))document.getElementById('pause')?.click();
  for(const context of contexts)context.suspend().catch(()=>{});
 };
 host.command=command=>{
  if(command==='dispose'){
   pause();disposed=true;cancelFrame(request);for(const id of frames)cancelFrame(id);frames.clear();
   for(const context of contexts)context.close().catch(()=>{});contexts.clear();
   window.removeEventListener('pagehide',leave);
  }else if(command==='pause')pause();
  else if(command==='resume'){
   pauseRequested=false;const snapshot=window.CM?.snapshot?.();
   if(snapshot?.paused)document.getElementById('pause')?.click();
  }
 };
 const leave=()=>host.command('dispose');window.addEventListener('pagehide',leave);
 const check=()=>{
  if(disposed)return;
  if(window.CM?.ready){
   if(!ready){ready=true;host.emit('ready');if(pauseRequested)pause();}
   return;
  }
  const error=document.getElementById('error');
  if(error&&!error.classList.contains('hidden')){host.emit('error',{message:'The 3D stadium could not start. Check WebGL support and retry.'});return;}
  request=requestFrame(check);
 };request=requestFrame(check);
})();
