/* Authored offline platform for the recovered native client. No remote provider SDK. */
(()=>{'use strict';
 const noop=()=>{};let send=null;
 const unavailable={code:'offline',message:'This online service is unavailable in the local game.'};
 const userResult=callback=>callback?.(unavailable,null);
 const sdk={game:{gameplayStart(){send?.('gameplay-start')},gameplayStop(){send?.('gameplay-stop')},happytime:noop},ad:{requestAd(_type,callbacks){callbacks?.adError?.(unavailable);send?.('service-unavailable',{service:'advertising'})},hasAdblock:cb=>cb?.(null,false)},banner:{requestOverlayBanners(banners,callback){for(const item of banners||[])callback?.(item.id,'bannerError',unavailable)}},user:{getUser:userResult,getUserToken:userResult,getXsollaUserToken:userResult,showAuthPrompt:userResult,showAccountLinkPrompt:userResult,addAuthListener:noop,addScore:noop},addInitCallback:noop};
 window.CrazyGames={SDK:sdk};
 window.F1LocalPlatform={setReporter(fn){send=fn},init(version,objectName,sendMessage,stringify){
  window.unityStringify=stringify;
  window.UnitySDK={version,objectName,userObjectName:'CrazyGames.CrazyUser',isSdkLoaded:true,waitingForLoad:[],ensureLoaded:fn=>fn(),unlockPointer:noop,lockPointer:noop};
  // Offline state is explicit. No authenticated user, cloud save, ad completion or purchase success.
  setTimeout(()=>{sendMessage(objectName,'InitCallback',JSON.stringify({countryCode:'',locale:'en-US',device:{type:'desktop'},sdkGameId:'local-crazy-grand-prix',sdkType:'local',environment:'local',isOnCrazyGames:false}));sendMessage(objectName,'AdblockNotDetected');send?.('sdk-ready',{platform:'local',version});},0);
  return true;
 }};
})();
