/* Original local platform adapter. Native game, loader and asset bytes retain their source ownership. */
(() => {
 'use strict';
 const query=new URLSearchParams(location.search),session=query.get('session');
 if(!session||!/^[a-f0-9-]{20,64}$/.test(session))throw Error('Missing game session');
 const scope=/^[a-f0-9]{24}$/.test(query.get('scope')||'')?query.get('scope'):'guest';
 const emit=(type,payload={})=>parent.postMessage({protocol:'stick-cricket-local',version:1,session,type,payload},location.origin);
 const canvas=document.querySelector('#game');
 let unity,receiver,disposed=false,paused=false,ready=false,volume=.65;
 const held=new Set(),pending=[];
 const clock=performance.now.bind(performance);let pausedAt=0,pausedTime=0;
 const gameTime=()=> (paused?pausedAt:clock())-pausedTime;
 Object.defineProperty(performance,'now',{value:gameTime});
 const contexts=new Map(),connect=AudioNode.prototype.connect;
 AudioNode.prototype.connect=function(destination,...args){const gain=contexts.get(this.context);return connect.call(this,gain&&destination===this.context.destination&&this!==gain?gain:destination,...args)};
 const NativeAudioContext=window.AudioContext;
 if(NativeAudioContext)window.AudioContext=class extends NativeAudioContext{constructor(...args){super(...args);const gain=this.createGain();gain.gain.value=volume;connect.call(gain,this.destination);contexts.set(this,gain)}};
 const debug=window.__stickCricketDebug={ready:false,paused:false,frames:0,inputCount:0,scope,platform:'local',get held(){return [...held]},requests:[]};
 // Each host account and this game have an independent native save namespace.
 for(const method of ['open','deleteDatabase']){
  const original=IDBFactory.prototype[method];
  IDBFactory.prototype[method]=function(name,...args){return original.call(this,`statoz.stick-cricket.${scope}.${name}`,...args)};
 }
 const storage=window.localStorage,prefix=`statoz.stick-cricket.${scope}.`;
 const get=Storage.prototype.getItem,set=Storage.prototype.setItem,remove=Storage.prototype.removeItem,nativeKey=Storage.prototype.key,nativeClear=Storage.prototype.clear;
 const ownKeys=()=>{const keys=[];for(let i=0;i<storage.length;i++){const key=nativeKey.call(storage,i);if(key?.startsWith(prefix))keys.push(key.slice(prefix.length))}return keys};
 Storage.prototype.key=function(index){return this===storage?ownKeys()[index]??null:nativeKey.call(this,index)};
 Storage.prototype.clear=function(){if(this!==storage)return nativeClear.call(this);for(const key of ownKeys())remove.call(this,prefix+key)};
 Storage.prototype.getItem=function(key){return get.call(this,this===storage?prefix+key:key)};
 Storage.prototype.setItem=function(key,value){return set.call(this,this===storage?prefix+key:key,value)};
 Storage.prototype.removeItem=function(key){return remove.call(this,this===storage?prefix+key:key)};
 // Capture Unity's scheduled callbacks so interruption never leaves its loop running behind a dialog.
 const raf=requestAnimationFrame.bind(window),caf=cancelAnimationFrame.bind(window),deferred=new Map(),scheduled=new Map();let ticket=0;
 window.requestAnimationFrame=callback=>{const id=++ticket;const run=()=>{scheduled.delete(id);if(disposed)return;if(paused)deferred.set(id,callback);else{debug.frames++;callback(gameTime())}};scheduled.set(id,raf(run));return id};
 window.cancelAnimationFrame=id=>{if(scheduled.has(id))caf(scheduled.get(id));scheduled.delete(id);deferred.delete(id)};
 const sendUnity=(method,value)=>{if(disposed)return;if(unity&&receiver)unity.SendMessage(receiver,method,value??'');else pending.push([method,value])};
 // This adapter supplies local platform lifecycle only; it never fakes an ad impression or a reward.
 window.PokiSDK={gameLoadingFinished(){debug.nativeLoaded=true},gameplayStart(){debug.playing=true},gameplayStop(){debug.playing=false},measure(){}};
 window.initPokiBridge=name=>{receiver=name;sendUnity('ready');debug.receiver=name};
 window.commercialBreak=()=>sendUnity('commercialBreakCompleted');
 window.rewardedBreak=()=>sendUnity('rewardedBreakCompleted','false');
 window.getUser=()=>sendUnity('getUserRejected');window.getToken=()=>sendUnity('getTokenRejected');window.login=()=>sendUnity('loginRejected');window.shareableURL=()=>sendUnity('shareableURLRejected');
 // Keep the reviewed game local. A remote resource remains a visible integration error, not a fallback.
 const fetchOriginal=fetch.bind(window);
 window.fetch=(input,options)=>{const url=new URL(typeof input==='string'?input:input instanceof URL?input.href:input.url,location.href);debug.requests.push(url.pathname);if(url.origin!==location.origin)return Promise.reject(Error('Remote game resource unavailable in local play: '+url.origin));return fetchOriginal(input,options)};
 const key=(direction,value)=>{if(!ready||disposed||paused&&value||!['left','right'].includes(direction))return;const code=direction==='left'?'ArrowLeft':'ArrowRight',number=direction==='left'?37:39;if(value)held.add(direction);else held.delete(direction);const event=new KeyboardEvent(value?'keydown':'keyup',{key:code,code,bubbles:true,cancelable:true,keyCode:number,which:number});canvas.dispatchEvent(event);debug.inputCount++};
 const clear=()=>{for(const direction of [...held])key(direction,0)};
 const audio=()=>{for(const context of contexts.keys())context.resume().catch(()=>{})};
 const pause=()=>{clear();if(!paused)pausedAt=clock();paused=true;debug.paused=true;for(const context of contexts.keys())context.suspend().catch(()=>{})};
 const resume=()=>{if(paused)pausedTime+=clock()-pausedAt;paused=false;debug.paused=false;audio();audioVolume(volume);for(const [id,callback] of deferred){deferred.delete(id);scheduled.set(id,raf(()=>{scheduled.delete(id);if(!disposed){if(paused)deferred.set(id,callback);else{debug.frames++;callback(gameTime())}}}))}};
 const audioVolume=value=>{debug.volume=value;for(const gain of contexts.values())gain.gain.value=value};
 window.__stickCricketUnlock=audio;
 addEventListener('message',event=>{
  const m=event.data;if(event.source!==parent||event.origin!==location.origin||m?.protocol!=='stick-cricket-local'||m.version!==1||m.session!==session||disposed)return;
  if(m.type==='input')key(m.direction,m.value===1?1:0);
  else if(m.type==='release')clear();else if(m.type==='pause')pause();else if(m.type==='resume')resume();
  else if(m.type==='volume'&&Number.isFinite(m.value)){volume=Math.max(0,Math.min(1,m.value));audioVolume(paused?0:volume)}
  else if(m.type==='dispose'){clear();disposed=true;for(const id of scheduled.values())caf(id);scheduled.clear();deferred.clear();unity?.Quit().catch(()=>{})}
 });
 addEventListener('blur',clear);document.addEventListener('visibilitychange',()=>{if(document.hidden){pause();emit('interrupted')}});
 window.startStickCricket=async()=>{
  try{
   unity=await createUnityInstance(canvas,{dataUrl:'Build/e6b3b1a38819775b7daab3e7aed9983e.data',frameworkUrl:'Build/6fb0739827ecb9473c0c24a7414d2065.framework.js',codeUrl:'Build/6c91f4163ca45d08346b05f4325e525e.wasm',streamingAssetsUrl:'StreamingAssets',companyName:'Stick Sports',productName:'Stick Cricket Chase',productVersion:'2.3.5',autoSyncPersistentDataPath:true,devicePixelRatio:Math.min(devicePixelRatio,1.5),matchWebGLToCanvasSize:true,showBanner:message=>console.warn(message)},progress=>emit('progress',{value:progress}));
   window.unityGame=unity;debug.moduleKeys=Object.keys(unity.Module);for(const [method,value] of pending.splice(0))sendUnity(method,value);
   ready=true;debug.ready=true;audioVolume(volume);canvas.focus({preventScroll:true});emit('ready');
  }catch(error){const message=error instanceof Error?error.message:String(error);document.querySelector('#error').textContent=message;document.querySelector('#error').style.display='block';emit('error',{message})}
 };
})();
