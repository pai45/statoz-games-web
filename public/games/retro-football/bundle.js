var rM=Object.create;var u0=Object.defineProperty;var oM=Object.getOwnPropertyDescriptor;var lM=Object.getOwnPropertyNames;var cM=Object.getPrototypeOf,uM=Object.prototype.hasOwnProperty;var Hi=(e,t)=>()=>{try{return t||e((t={exports:{}}).exports,t),t.exports}catch(n){throw t=0,n}};var hM=(e,t,n,i)=>{if(t&&typeof t=="object"||typeof t=="function")for(let s of lM(t))!uM.call(e,s)&&s!==n&&u0(e,s,{get:()=>t[s],enumerable:!(i=oM(t,s))||i.enumerable});return e};var pc=(e,t,n)=>(n=e!=null?rM(cM(e)):{},hM(t||!e||!e.__esModule?u0(n,"default",{value:e,enumerable:!0}):n,e));var S0=Hi(Pt=>{"use strict";var Jf=Symbol.for("react.transitional.element"),fM=Symbol.for("react.portal"),dM=Symbol.for("react.fragment"),pM=Symbol.for("react.strict_mode"),mM=Symbol.for("react.profiler"),gM=Symbol.for("react.consumer"),yM=Symbol.for("react.context"),vM=Symbol.for("react.forward_ref"),xM=Symbol.for("react.suspense"),_M=Symbol.for("react.memo"),m0=Symbol.for("react.lazy"),SM=Symbol.for("react.activity"),h0=Symbol.iterator;function bM(e){return e===null||typeof e!="object"?null:(e=h0&&e[h0]||e["@@iterator"],typeof e=="function"?e:null)}var g0={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},y0=Object.assign,v0={};function cr(e,t,n){this.props=e,this.context=t,this.refs=v0,this.updater=n||g0}cr.prototype.isReactComponent={};cr.prototype.setState=function(e,t){if(typeof e!="object"&&typeof e!="function"&&e!=null)throw Error("takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,e,t,"setState")};cr.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")};function x0(){}x0.prototype=cr.prototype;function Qf(e,t,n){this.props=e,this.context=t,this.refs=v0,this.updater=n||g0}var jf=Qf.prototype=new x0;jf.constructor=Qf;y0(jf,cr.prototype);jf.isPureReactComponent=!0;var f0=Array.isArray;function Kf(){}var be={H:null,A:null,T:null,S:null},_0=Object.prototype.hasOwnProperty;function $f(e,t,n){var i=n.ref;return{$$typeof:Jf,type:e,key:t,ref:i!==void 0?i:null,props:n}}function MM(e,t){return $f(e.type,t,e.props)}function td(e){return typeof e=="object"&&e!==null&&e.$$typeof===Jf}function EM(e){var t={"=":"=0",":":"=2"};return"$"+e.replace(/[=:]/g,function(n){return t[n]})}var d0=/\/+/g;function Zf(e,t){return typeof e=="object"&&e!==null&&e.key!=null?EM(""+e.key):t.toString(36)}function TM(e){switch(e.status){case"fulfilled":return e.value;case"rejected":throw e.reason;default:switch(typeof e.status=="string"?e.then(Kf,Kf):(e.status="pending",e.then(function(t){e.status==="pending"&&(e.status="fulfilled",e.value=t)},function(t){e.status==="pending"&&(e.status="rejected",e.reason=t)})),e.status){case"fulfilled":return e.value;case"rejected":throw e.reason}}throw e}function lr(e,t,n,i,s){var a=typeof e;(a==="undefined"||a==="boolean")&&(e=null);var r=!1;if(e===null)r=!0;else switch(a){case"bigint":case"string":case"number":r=!0;break;case"object":switch(e.$$typeof){case Jf:case fM:r=!0;break;case m0:return r=e._init,lr(r(e._payload),t,n,i,s)}}if(r)return s=s(e),r=i===""?"."+Zf(e,0):i,f0(s)?(n="",r!=null&&(n=r.replace(d0,"$&/")+"/"),lr(s,t,n,"",function(c){return c})):s!=null&&(td(s)&&(s=MM(s,n+(s.key==null||e&&e.key===s.key?"":(""+s.key).replace(d0,"$&/")+"/")+r)),t.push(s)),1;r=0;var o=i===""?".":i+":";if(f0(e))for(var l=0;l<e.length;l++)i=e[l],a=o+Zf(i,l),r+=lr(i,t,n,a,s);else if(l=bM(e),typeof l=="function")for(e=l.call(e),l=0;!(i=e.next()).done;)i=i.value,a=o+Zf(i,l++),r+=lr(i,t,n,a,s);else if(a==="object"){if(typeof e.then=="function")return lr(TM(e),t,n,i,s);throw t=String(e),Error("Objects are not valid as a React child (found: "+(t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t)+"). If you meant to render a collection of children, use an array instead.")}return r}function mc(e,t,n){if(e==null)return e;var i=[],s=0;return lr(e,i,"","",function(a){return t.call(n,a,s++)}),i}function AM(e){if(e._status===-1){var t=e._result;t=t(),t.then(function(n){(e._status===0||e._status===-1)&&(e._status=1,e._result=n)},function(n){(e._status===0||e._status===-1)&&(e._status=2,e._result=n)}),e._status===-1&&(e._status=0,e._result=t)}if(e._status===1)return e._result.default;throw e._result}var p0=typeof reportError=="function"?reportError:function(e){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var t=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof e=="object"&&e!==null&&typeof e.message=="string"?String(e.message):String(e),error:e});if(!window.dispatchEvent(t))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",e);return}console.error(e)},wM={map:mc,forEach:function(e,t,n){mc(e,function(){t.apply(this,arguments)},n)},count:function(e){var t=0;return mc(e,function(){t++}),t},toArray:function(e){return mc(e,function(t){return t})||[]},only:function(e){if(!td(e))throw Error("React.Children.only expected to receive a single React element child.");return e}};Pt.Activity=SM;Pt.Children=wM;Pt.Component=cr;Pt.Fragment=dM;Pt.Profiler=mM;Pt.PureComponent=Qf;Pt.StrictMode=pM;Pt.Suspense=xM;Pt.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=be;Pt.__COMPILER_RUNTIME={__proto__:null,c:function(e){return be.H.useMemoCache(e)}};Pt.cache=function(e){return function(){return e.apply(null,arguments)}};Pt.cacheSignal=function(){return null};Pt.cloneElement=function(e,t,n){if(e==null)throw Error("The argument must be a React element, but you passed "+e+".");var i=y0({},e.props),s=e.key;if(t!=null)for(a in t.key!==void 0&&(s=""+t.key),t)!_0.call(t,a)||a==="key"||a==="__self"||a==="__source"||a==="ref"&&t.ref===void 0||(i[a]=t[a]);var a=arguments.length-2;if(a===1)i.children=n;else if(1<a){for(var r=Array(a),o=0;o<a;o++)r[o]=arguments[o+2];i.children=r}return $f(e.type,s,i)};Pt.createContext=function(e){return e={$$typeof:yM,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null},e.Provider=e,e.Consumer={$$typeof:gM,_context:e},e};Pt.createElement=function(e,t,n){var i,s={},a=null;if(t!=null)for(i in t.key!==void 0&&(a=""+t.key),t)_0.call(t,i)&&i!=="key"&&i!=="__self"&&i!=="__source"&&(s[i]=t[i]);var r=arguments.length-2;if(r===1)s.children=n;else if(1<r){for(var o=Array(r),l=0;l<r;l++)o[l]=arguments[l+2];s.children=o}if(e&&e.defaultProps)for(i in r=e.defaultProps,r)s[i]===void 0&&(s[i]=r[i]);return $f(e,a,s)};Pt.createRef=function(){return{current:null}};Pt.forwardRef=function(e){return{$$typeof:vM,render:e}};Pt.isValidElement=td;Pt.lazy=function(e){return{$$typeof:m0,_payload:{_status:-1,_result:e},_init:AM}};Pt.memo=function(e,t){return{$$typeof:_M,type:e,compare:t===void 0?null:t}};Pt.startTransition=function(e){var t=be.T,n={};be.T=n;try{var i=e(),s=be.S;s!==null&&s(n,i),typeof i=="object"&&i!==null&&typeof i.then=="function"&&i.then(Kf,p0)}catch(a){p0(a)}finally{t!==null&&n.types!==null&&(t.types=n.types),be.T=t}};Pt.unstable_useCacheRefresh=function(){return be.H.useCacheRefresh()};Pt.use=function(e){return be.H.use(e)};Pt.useActionState=function(e,t,n){return be.H.useActionState(e,t,n)};Pt.useCallback=function(e,t){return be.H.useCallback(e,t)};Pt.useContext=function(e){return be.H.useContext(e)};Pt.useDebugValue=function(){};Pt.useDeferredValue=function(e,t){return be.H.useDeferredValue(e,t)};Pt.useEffect=function(e,t){return be.H.useEffect(e,t)};Pt.useEffectEvent=function(e){return be.H.useEffectEvent(e)};Pt.useId=function(){return be.H.useId()};Pt.useImperativeHandle=function(e,t,n){return be.H.useImperativeHandle(e,t,n)};Pt.useInsertionEffect=function(e,t){return be.H.useInsertionEffect(e,t)};Pt.useLayoutEffect=function(e,t){return be.H.useLayoutEffect(e,t)};Pt.useMemo=function(e,t){return be.H.useMemo(e,t)};Pt.useOptimistic=function(e,t){return be.H.useOptimistic(e,t)};Pt.useReducer=function(e,t,n){return be.H.useReducer(e,t,n)};Pt.useRef=function(e){return be.H.useRef(e)};Pt.useState=function(e){return be.H.useState(e)};Pt.useSyncExternalStore=function(e,t,n){return be.H.useSyncExternalStore(e,t,n)};Pt.useTransition=function(){return be.H.useTransition()};Pt.version="19.2.8"});var gc=Hi((F2,b0)=>{"use strict";b0.exports=S0()});var L0=Hi(Re=>{"use strict";function sd(e,t){var n=e.length;e.push(t);t:for(;0<n;){var i=n-1>>>1,s=e[i];if(0<yc(s,t))e[i]=t,e[n]=s,n=i;else break t}}function ki(e){return e.length===0?null:e[0]}function xc(e){if(e.length===0)return null;var t=e[0],n=e.pop();if(n!==t){e[0]=n;t:for(var i=0,s=e.length,a=s>>>1;i<a;){var r=2*(i+1)-1,o=e[r],l=r+1,c=e[l];if(0>yc(o,n))l<s&&0>yc(c,o)?(e[i]=c,e[l]=n,i=l):(e[i]=o,e[r]=n,i=r);else if(l<s&&0>yc(c,n))e[i]=c,e[l]=n,i=l;else break t}}return t}function yc(e,t){var n=e.sortIndex-t.sortIndex;return n!==0?n:e.id-t.id}Re.unstable_now=void 0;typeof performance=="object"&&typeof performance.now=="function"?(M0=performance,Re.unstable_now=function(){return M0.now()}):(ed=Date,E0=ed.now(),Re.unstable_now=function(){return ed.now()-E0});var M0,ed,E0,ss=[],Is=[],CM=1,ai=null,vn=3,ad=!1,Do=!1,No=!1,rd=!1,w0=typeof setTimeout=="function"?setTimeout:null,C0=typeof clearTimeout=="function"?clearTimeout:null,T0=typeof setImmediate<"u"?setImmediate:null;function vc(e){for(var t=ki(Is);t!==null;){if(t.callback===null)xc(Is);else if(t.startTime<=e)xc(Is),t.sortIndex=t.expirationTime,sd(ss,t);else break;t=ki(Is)}}function od(e){if(No=!1,vc(e),!Do)if(ki(ss)!==null)Do=!0,hr||(hr=!0,ur());else{var t=ki(Is);t!==null&&ld(od,t.startTime-e)}}var hr=!1,Lo=-1,R0=5,D0=-1;function N0(){return rd?!0:!(Re.unstable_now()-D0<R0)}function nd(){if(rd=!1,hr){var e=Re.unstable_now();D0=e;var t=!0;try{t:{Do=!1,No&&(No=!1,C0(Lo),Lo=-1),ad=!0;var n=vn;try{e:{for(vc(e),ai=ki(ss);ai!==null&&!(ai.expirationTime>e&&N0());){var i=ai.callback;if(typeof i=="function"){ai.callback=null,vn=ai.priorityLevel;var s=i(ai.expirationTime<=e);if(e=Re.unstable_now(),typeof s=="function"){ai.callback=s,vc(e),t=!0;break e}ai===ki(ss)&&xc(ss),vc(e)}else xc(ss);ai=ki(ss)}if(ai!==null)t=!0;else{var a=ki(Is);a!==null&&ld(od,a.startTime-e),t=!1}}break t}finally{ai=null,vn=n,ad=!1}t=void 0}}finally{t?ur():hr=!1}}}var ur;typeof T0=="function"?ur=function(){T0(nd)}:typeof MessageChannel<"u"?(id=new MessageChannel,A0=id.port2,id.port1.onmessage=nd,ur=function(){A0.postMessage(null)}):ur=function(){w0(nd,0)};var id,A0;function ld(e,t){Lo=w0(function(){e(Re.unstable_now())},t)}Re.unstable_IdlePriority=5;Re.unstable_ImmediatePriority=1;Re.unstable_LowPriority=4;Re.unstable_NormalPriority=3;Re.unstable_Profiling=null;Re.unstable_UserBlockingPriority=2;Re.unstable_cancelCallback=function(e){e.callback=null};Re.unstable_forceFrameRate=function(e){0>e||125<e?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):R0=0<e?Math.floor(1e3/e):5};Re.unstable_getCurrentPriorityLevel=function(){return vn};Re.unstable_next=function(e){switch(vn){case 1:case 2:case 3:var t=3;break;default:t=vn}var n=vn;vn=t;try{return e()}finally{vn=n}};Re.unstable_requestPaint=function(){rd=!0};Re.unstable_runWithPriority=function(e,t){switch(e){case 1:case 2:case 3:case 4:case 5:break;default:e=3}var n=vn;vn=e;try{return t()}finally{vn=n}};Re.unstable_scheduleCallback=function(e,t,n){var i=Re.unstable_now();switch(typeof n=="object"&&n!==null?(n=n.delay,n=typeof n=="number"&&0<n?i+n:i):n=i,e){case 1:var s=-1;break;case 2:s=250;break;case 5:s=1073741823;break;case 4:s=1e4;break;default:s=5e3}return s=n+s,e={id:CM++,callback:t,priorityLevel:e,startTime:n,expirationTime:s,sortIndex:-1},n>i?(e.sortIndex=n,sd(Is,e),ki(ss)===null&&e===ki(Is)&&(No?(C0(Lo),Lo=-1):No=!0,ld(od,n-i))):(e.sortIndex=s,sd(ss,e),Do||ad||(Do=!0,hr||(hr=!0,ur()))),e};Re.unstable_shouldYield=N0;Re.unstable_wrapCallback=function(e){var t=vn;return function(){var n=vn;vn=t;try{return e.apply(this,arguments)}finally{vn=n}}}});var O0=Hi((H2,U0)=>{"use strict";U0.exports=L0()});var P0=Hi(An=>{"use strict";var RM=gc();function I0(e){var t="https://react.dev/errors/"+e;if(1<arguments.length){t+="?args[]="+encodeURIComponent(arguments[1]);for(var n=2;n<arguments.length;n++)t+="&args[]="+encodeURIComponent(arguments[n])}return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function Ps(){}var Tn={d:{f:Ps,r:function(){throw Error(I0(522))},D:Ps,C:Ps,L:Ps,m:Ps,X:Ps,S:Ps,M:Ps},p:0,findDOMNode:null},DM=Symbol.for("react.portal");function NM(e,t,n){var i=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:DM,key:i==null?null:""+i,children:e,containerInfo:t,implementation:n}}var Uo=RM.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;function _c(e,t){if(e==="font")return"";if(typeof t=="string")return t==="use-credentials"?t:""}An.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=Tn;An.createPortal=function(e,t){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)throw Error(I0(299));return NM(e,t,null,n)};An.flushSync=function(e){var t=Uo.T,n=Tn.p;try{if(Uo.T=null,Tn.p=2,e)return e()}finally{Uo.T=t,Tn.p=n,Tn.d.f()}};An.preconnect=function(e,t){typeof e=="string"&&(t?(t=t.crossOrigin,t=typeof t=="string"?t==="use-credentials"?t:"":void 0):t=null,Tn.d.C(e,t))};An.prefetchDNS=function(e){typeof e=="string"&&Tn.d.D(e)};An.preinit=function(e,t){if(typeof e=="string"&&t&&typeof t.as=="string"){var n=t.as,i=_c(n,t.crossOrigin),s=typeof t.integrity=="string"?t.integrity:void 0,a=typeof t.fetchPriority=="string"?t.fetchPriority:void 0;n==="style"?Tn.d.S(e,typeof t.precedence=="string"?t.precedence:void 0,{crossOrigin:i,integrity:s,fetchPriority:a}):n==="script"&&Tn.d.X(e,{crossOrigin:i,integrity:s,fetchPriority:a,nonce:typeof t.nonce=="string"?t.nonce:void 0})}};An.preinitModule=function(e,t){if(typeof e=="string")if(typeof t=="object"&&t!==null){if(t.as==null||t.as==="script"){var n=_c(t.as,t.crossOrigin);Tn.d.M(e,{crossOrigin:n,integrity:typeof t.integrity=="string"?t.integrity:void 0,nonce:typeof t.nonce=="string"?t.nonce:void 0})}}else t==null&&Tn.d.M(e)};An.preload=function(e,t){if(typeof e=="string"&&typeof t=="object"&&t!==null&&typeof t.as=="string"){var n=t.as,i=_c(n,t.crossOrigin);Tn.d.L(e,n,{crossOrigin:i,integrity:typeof t.integrity=="string"?t.integrity:void 0,nonce:typeof t.nonce=="string"?t.nonce:void 0,type:typeof t.type=="string"?t.type:void 0,fetchPriority:typeof t.fetchPriority=="string"?t.fetchPriority:void 0,referrerPolicy:typeof t.referrerPolicy=="string"?t.referrerPolicy:void 0,imageSrcSet:typeof t.imageSrcSet=="string"?t.imageSrcSet:void 0,imageSizes:typeof t.imageSizes=="string"?t.imageSizes:void 0,media:typeof t.media=="string"?t.media:void 0})}};An.preloadModule=function(e,t){if(typeof e=="string")if(t){var n=_c(t.as,t.crossOrigin);Tn.d.m(e,{as:typeof t.as=="string"&&t.as!=="script"?t.as:void 0,crossOrigin:n,integrity:typeof t.integrity=="string"?t.integrity:void 0})}else Tn.d.m(e)};An.requestFormReset=function(e){Tn.d.r(e)};An.unstable_batchedUpdates=function(e,t){return e(t)};An.useFormState=function(e,t,n){return Uo.H.useFormState(e,t,n)};An.useFormStatus=function(){return Uo.H.useHostTransitionStatus()};An.version="19.2.8"});var F0=Hi((G2,z0)=>{"use strict";function B0(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(B0)}catch(e){console.error(e)}}B0(),z0.exports=P0()});var Q_=Hi(Xu=>{"use strict";var je=O0(),hv=gc(),LM=F0();function $(e){var t="https://react.dev/errors/"+e;if(1<arguments.length){t+="?args[]="+encodeURIComponent(arguments[1]);for(var n=2;n<arguments.length;n++)t+="&args[]="+encodeURIComponent(arguments[n])}return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function fv(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function xl(e){var t=e,n=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,(t.flags&4098)!==0&&(n=t.return),e=t.return;while(e)}return t.tag===3?n:null}function dv(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function pv(e){if(e.tag===31){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function V0(e){if(xl(e)!==e)throw Error($(188))}function UM(e){var t=e.alternate;if(!t){if(t=xl(e),t===null)throw Error($(188));return t!==e?null:e}for(var n=e,i=t;;){var s=n.return;if(s===null)break;var a=s.alternate;if(a===null){if(i=s.return,i!==null){n=i;continue}break}if(s.child===a.child){for(a=s.child;a;){if(a===n)return V0(s),e;if(a===i)return V0(s),t;a=a.sibling}throw Error($(188))}if(n.return!==i.return)n=s,i=a;else{for(var r=!1,o=s.child;o;){if(o===n){r=!0,n=s,i=a;break}if(o===i){r=!0,i=s,n=a;break}o=o.sibling}if(!r){for(o=a.child;o;){if(o===n){r=!0,n=a,i=s;break}if(o===i){r=!0,i=a,n=s;break}o=o.sibling}if(!r)throw Error($(189))}}if(n.alternate!==i)throw Error($(190))}if(n.tag!==3)throw Error($(188));return n.stateNode.current===n?e:t}function mv(e){var t=e.tag;if(t===5||t===26||t===27||t===6)return e;for(e=e.child;e!==null;){if(t=mv(e),t!==null)return t;e=e.sibling}return null}var Te=Object.assign,OM=Symbol.for("react.element"),Sc=Symbol.for("react.transitional.element"),Ho=Symbol.for("react.portal"),yr=Symbol.for("react.fragment"),gv=Symbol.for("react.strict_mode"),kd=Symbol.for("react.profiler"),yv=Symbol.for("react.consumer"),fs=Symbol.for("react.context"),Bp=Symbol.for("react.forward_ref"),Gd=Symbol.for("react.suspense"),Wd=Symbol.for("react.suspense_list"),zp=Symbol.for("react.memo"),Bs=Symbol.for("react.lazy"),Xd=Symbol.for("react.activity"),IM=Symbol.for("react.memo_cache_sentinel"),H0=Symbol.iterator;function Oo(e){return e===null||typeof e!="object"?null:(e=H0&&e[H0]||e["@@iterator"],typeof e=="function"?e:null)}var PM=Symbol.for("react.client.reference");function qd(e){if(e==null)return null;if(typeof e=="function")return e.$$typeof===PM?null:e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case yr:return"Fragment";case kd:return"Profiler";case gv:return"StrictMode";case Gd:return"Suspense";case Wd:return"SuspenseList";case Xd:return"Activity"}if(typeof e=="object")switch(e.$$typeof){case Ho:return"Portal";case fs:return e.displayName||"Context";case yv:return(e._context.displayName||"Context")+".Consumer";case Bp:var t=e.render;return e=e.displayName,e||(e=t.displayName||t.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case zp:return t=e.displayName||null,t!==null?t:qd(e.type)||"Memo";case Bs:t=e._payload,e=e._init;try{return qd(e(t))}catch{}}return null}var ko=Array.isArray,Lt=hv.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,ae=LM.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,Ua={pending:!1,data:null,method:null,action:null},Yd=[],vr=-1;function Yi(e){return{current:e}}function on(e){0>vr||(e.current=Yd[vr],Yd[vr]=null,vr--)}function _e(e,t){vr++,Yd[vr]=e.current,e.current=t}var qi=Yi(null),al=Yi(null),Zs=Yi(null),tu=Yi(null);function eu(e,t){switch(_e(Zs,t),_e(al,e),_e(qi,null),t.nodeType){case 9:case 11:e=(e=t.documentElement)&&(e=e.namespaceURI)?Zy(e):0;break;default:if(e=t.tagName,t=t.namespaceURI)t=Zy(t),e=B_(t,e);else switch(e){case"svg":e=1;break;case"math":e=2;break;default:e=0}}on(qi),_e(qi,e)}function Pr(){on(qi),on(al),on(Zs)}function Zd(e){e.memoizedState!==null&&_e(tu,e);var t=qi.current,n=B_(t,e.type);t!==n&&(_e(al,e),_e(qi,n))}function nu(e){al.current===e&&(on(qi),on(al)),tu.current===e&&(on(tu),gl._currentValue=Ua)}var cd,k0;function Ra(e){if(cd===void 0)try{throw Error()}catch(n){var t=n.stack.trim().match(/\n( *(at )?)/);cd=t&&t[1]||"",k0=-1<n.stack.indexOf(`
    at`)?" (<anonymous>)":-1<n.stack.indexOf("@")?"@unknown:0:0":""}return`
`+cd+e+k0}var ud=!1;function hd(e,t){if(!e||ud)return"";ud=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{var i={DetermineComponentFrameRoot:function(){try{if(t){var p=function(){throw Error()};if(Object.defineProperty(p.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(p,[])}catch(d){var h=d}Reflect.construct(e,[],p)}else{try{p.call()}catch(d){h=d}e.call(p.prototype)}}else{try{throw Error()}catch(d){h=d}(p=e())&&typeof p.catch=="function"&&p.catch(function(){})}}catch(d){if(d&&h&&typeof d.stack=="string")return[d.stack,h.stack]}return[null,null]}};i.DetermineComponentFrameRoot.displayName="DetermineComponentFrameRoot";var s=Object.getOwnPropertyDescriptor(i.DetermineComponentFrameRoot,"name");s&&s.configurable&&Object.defineProperty(i.DetermineComponentFrameRoot,"name",{value:"DetermineComponentFrameRoot"});var a=i.DetermineComponentFrameRoot(),r=a[0],o=a[1];if(r&&o){var l=r.split(`
`),c=o.split(`
`);for(s=i=0;i<l.length&&!l[i].includes("DetermineComponentFrameRoot");)i++;for(;s<c.length&&!c[s].includes("DetermineComponentFrameRoot");)s++;if(i===l.length||s===c.length)for(i=l.length-1,s=c.length-1;1<=i&&0<=s&&l[i]!==c[s];)s--;for(;1<=i&&0<=s;i--,s--)if(l[i]!==c[s]){if(i!==1||s!==1)do if(i--,s--,0>s||l[i]!==c[s]){var u=`
`+l[i].replace(" at new "," at ");return e.displayName&&u.includes("<anonymous>")&&(u=u.replace("<anonymous>",e.displayName)),u}while(1<=i&&0<=s);break}}}finally{ud=!1,Error.prepareStackTrace=n}return(n=e?e.displayName||e.name:"")?Ra(n):""}function BM(e,t){switch(e.tag){case 26:case 27:case 5:return Ra(e.type);case 16:return Ra("Lazy");case 13:return e.child!==t&&t!==null?Ra("Suspense Fallback"):Ra("Suspense");case 19:return Ra("SuspenseList");case 0:case 15:return hd(e.type,!1);case 11:return hd(e.type.render,!1);case 1:return hd(e.type,!0);case 31:return Ra("Activity");default:return""}}function G0(e){try{var t="",n=null;do t+=BM(e,n),n=e,e=e.return;while(e);return t}catch(i){return`
Error generating stack: `+i.message+`
`+i.stack}}var Kd=Object.prototype.hasOwnProperty,Fp=je.unstable_scheduleCallback,fd=je.unstable_cancelCallback,zM=je.unstable_shouldYield,FM=je.unstable_requestPaint,Yn=je.unstable_now,VM=je.unstable_getCurrentPriorityLevel,vv=je.unstable_ImmediatePriority,xv=je.unstable_UserBlockingPriority,iu=je.unstable_NormalPriority,HM=je.unstable_LowPriority,_v=je.unstable_IdlePriority,kM=je.log,GM=je.unstable_setDisableYieldValue,_l=null,Zn=null;function Gs(e){if(typeof kM=="function"&&GM(e),Zn&&typeof Zn.setStrictMode=="function")try{Zn.setStrictMode(_l,e)}catch{}}var Kn=Math.clz32?Math.clz32:qM,WM=Math.log,XM=Math.LN2;function qM(e){return e>>>=0,e===0?32:31-(WM(e)/XM|0)|0}var bc=256,Mc=262144,Ec=4194304;function Da(e){var t=e&42;if(t!==0)return t;switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:return 64;case 128:return 128;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:return e&261888;case 262144:case 524288:case 1048576:case 2097152:return e&3932160;case 4194304:case 8388608:case 16777216:case 33554432:return e&62914560;case 67108864:return 67108864;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 0;default:return e}}function Ru(e,t,n){var i=e.pendingLanes;if(i===0)return 0;var s=0,a=e.suspendedLanes,r=e.pingedLanes;e=e.warmLanes;var o=i&134217727;return o!==0?(i=o&~a,i!==0?s=Da(i):(r&=o,r!==0?s=Da(r):n||(n=o&~e,n!==0&&(s=Da(n))))):(o=i&~a,o!==0?s=Da(o):r!==0?s=Da(r):n||(n=i&~e,n!==0&&(s=Da(n)))),s===0?0:t!==0&&t!==s&&(t&a)===0&&(a=s&-s,n=t&-t,a>=n||a===32&&(n&4194048)!==0)?t:s}function Sl(e,t){return(e.pendingLanes&~(e.suspendedLanes&~e.pingedLanes)&t)===0}function YM(e,t){switch(e){case 1:case 2:case 4:case 8:case 64:return t+250;case 16:case 32:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:return-1;case 67108864:case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function Sv(){var e=Ec;return Ec<<=1,(Ec&62914560)===0&&(Ec=4194304),e}function dd(e){for(var t=[],n=0;31>n;n++)t.push(e);return t}function bl(e,t){e.pendingLanes|=t,t!==268435456&&(e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0)}function ZM(e,t,n,i,s,a){var r=e.pendingLanes;e.pendingLanes=n,e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0,e.expiredLanes&=n,e.entangledLanes&=n,e.errorRecoveryDisabledLanes&=n,e.shellSuspendCounter=0;var o=e.entanglements,l=e.expirationTimes,c=e.hiddenUpdates;for(n=r&~n;0<n;){var u=31-Kn(n),p=1<<u;o[u]=0,l[u]=-1;var h=c[u];if(h!==null)for(c[u]=null,u=0;u<h.length;u++){var d=h[u];d!==null&&(d.lane&=-536870913)}n&=~p}i!==0&&bv(e,i,0),a!==0&&s===0&&e.tag!==0&&(e.suspendedLanes|=a&~(r&~t))}function bv(e,t,n){e.pendingLanes|=t,e.suspendedLanes&=~t;var i=31-Kn(t);e.entangledLanes|=t,e.entanglements[i]=e.entanglements[i]|1073741824|n&261930}function Mv(e,t){var n=e.entangledLanes|=t;for(e=e.entanglements;n;){var i=31-Kn(n),s=1<<i;s&t|e[i]&t&&(e[i]|=t),n&=~s}}function Ev(e,t){var n=t&-t;return n=(n&42)!==0?1:Vp(n),(n&(e.suspendedLanes|t))!==0?0:n}function Vp(e){switch(e){case 2:e=1;break;case 8:e=4;break;case 32:e=16;break;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:e=128;break;case 268435456:e=134217728;break;default:e=0}return e}function Hp(e){return e&=-e,2<e?8<e?(e&134217727)!==0?32:268435456:8:2}function Tv(){var e=ae.p;return e!==0?e:(e=window.event,e===void 0?32:Z_(e.type))}function W0(e,t){var n=ae.p;try{return ae.p=e,t()}finally{ae.p=n}}var oa=Math.random().toString(36).slice(2),hn="__reactFiber$"+oa,Pn="__reactProps$"+oa,Yr="__reactContainer$"+oa,Jd="__reactEvents$"+oa,KM="__reactListeners$"+oa,JM="__reactHandles$"+oa,X0="__reactResources$"+oa,Ml="__reactMarker$"+oa;function kp(e){delete e[hn],delete e[Pn],delete e[Jd],delete e[KM],delete e[JM]}function xr(e){var t=e[hn];if(t)return t;for(var n=e.parentNode;n;){if(t=n[Yr]||n[hn]){if(n=t.alternate,t.child!==null||n!==null&&n.child!==null)for(e=$y(e);e!==null;){if(n=e[hn])return n;e=$y(e)}return t}e=n,n=e.parentNode}return null}function Zr(e){if(e=e[hn]||e[Yr]){var t=e.tag;if(t===5||t===6||t===13||t===31||t===26||t===27||t===3)return e}return null}function Go(e){var t=e.tag;if(t===5||t===26||t===27||t===6)return e.stateNode;throw Error($(33))}function Rr(e){var t=e[X0];return t||(t=e[X0]={hoistableStyles:new Map,hoistableScripts:new Map}),t}function rn(e){e[Ml]=!0}var Av=new Set,wv={};function Ga(e,t){Br(e,t),Br(e+"Capture",t)}function Br(e,t){for(wv[e]=t,e=0;e<t.length;e++)Av.add(t[e])}var QM=RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"),q0={},Y0={};function jM(e){return Kd.call(Y0,e)?!0:Kd.call(q0,e)?!1:QM.test(e)?Y0[e]=!0:(q0[e]=!0,!1)}function Fc(e,t,n){if(jM(t))if(n===null)e.removeAttribute(t);else{switch(typeof n){case"undefined":case"function":case"symbol":e.removeAttribute(t);return;case"boolean":var i=t.toLowerCase().slice(0,5);if(i!=="data-"&&i!=="aria-"){e.removeAttribute(t);return}}e.setAttribute(t,""+n)}}function Tc(e,t,n){if(n===null)e.removeAttribute(t);else{switch(typeof n){case"undefined":case"function":case"symbol":case"boolean":e.removeAttribute(t);return}e.setAttribute(t,""+n)}}function as(e,t,n,i){if(i===null)e.removeAttribute(n);else{switch(typeof i){case"undefined":case"function":case"symbol":case"boolean":e.removeAttribute(n);return}e.setAttributeNS(t,n,""+i)}}function oi(e){switch(typeof e){case"bigint":case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function Cv(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(t==="checkbox"||t==="radio")}function $M(e,t,n){var i=Object.getOwnPropertyDescriptor(e.constructor.prototype,t);if(!e.hasOwnProperty(t)&&typeof i<"u"&&typeof i.get=="function"&&typeof i.set=="function"){var s=i.get,a=i.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return s.call(this)},set:function(r){n=""+r,a.call(this,r)}}),Object.defineProperty(e,t,{enumerable:i.enumerable}),{getValue:function(){return n},setValue:function(r){n=""+r},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function Qd(e){if(!e._valueTracker){var t=Cv(e)?"checked":"value";e._valueTracker=$M(e,t,""+e[t])}}function Rv(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),i="";return e&&(i=Cv(e)?e.checked?"true":"false":e.value),e=i,e!==n?(t.setValue(e),!0):!1}function su(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}var t1=/[\n"\\]/g;function ui(e){return e.replace(t1,function(t){return"\\"+t.charCodeAt(0).toString(16)+" "})}function jd(e,t,n,i,s,a,r,o){e.name="",r!=null&&typeof r!="function"&&typeof r!="symbol"&&typeof r!="boolean"?e.type=r:e.removeAttribute("type"),t!=null?r==="number"?(t===0&&e.value===""||e.value!=t)&&(e.value=""+oi(t)):e.value!==""+oi(t)&&(e.value=""+oi(t)):r!=="submit"&&r!=="reset"||e.removeAttribute("value"),t!=null?$d(e,r,oi(t)):n!=null?$d(e,r,oi(n)):i!=null&&e.removeAttribute("value"),s==null&&a!=null&&(e.defaultChecked=!!a),s!=null&&(e.checked=s&&typeof s!="function"&&typeof s!="symbol"),o!=null&&typeof o!="function"&&typeof o!="symbol"&&typeof o!="boolean"?e.name=""+oi(o):e.removeAttribute("name")}function Dv(e,t,n,i,s,a,r,o){if(a!=null&&typeof a!="function"&&typeof a!="symbol"&&typeof a!="boolean"&&(e.type=a),t!=null||n!=null){if(!(a!=="submit"&&a!=="reset"||t!=null)){Qd(e);return}n=n!=null?""+oi(n):"",t=t!=null?""+oi(t):n,o||t===e.value||(e.value=t),e.defaultValue=t}i=i??s,i=typeof i!="function"&&typeof i!="symbol"&&!!i,e.checked=o?e.checked:!!i,e.defaultChecked=!!i,r!=null&&typeof r!="function"&&typeof r!="symbol"&&typeof r!="boolean"&&(e.name=r),Qd(e)}function $d(e,t,n){t==="number"&&su(e.ownerDocument)===e||e.defaultValue===""+n||(e.defaultValue=""+n)}function Dr(e,t,n,i){if(e=e.options,t){t={};for(var s=0;s<n.length;s++)t["$"+n[s]]=!0;for(n=0;n<e.length;n++)s=t.hasOwnProperty("$"+e[n].value),e[n].selected!==s&&(e[n].selected=s),s&&i&&(e[n].defaultSelected=!0)}else{for(n=""+oi(n),t=null,s=0;s<e.length;s++){if(e[s].value===n){e[s].selected=!0,i&&(e[s].defaultSelected=!0);return}t!==null||e[s].disabled||(t=e[s])}t!==null&&(t.selected=!0)}}function Nv(e,t,n){if(t!=null&&(t=""+oi(t),t!==e.value&&(e.value=t),n==null)){e.defaultValue!==t&&(e.defaultValue=t);return}e.defaultValue=n!=null?""+oi(n):""}function Lv(e,t,n,i){if(t==null){if(i!=null){if(n!=null)throw Error($(92));if(ko(i)){if(1<i.length)throw Error($(93));i=i[0]}n=i}n==null&&(n=""),t=n}n=oi(t),e.defaultValue=n,i=e.textContent,i===n&&i!==""&&i!==null&&(e.value=i),Qd(e)}function zr(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&n.nodeType===3){n.nodeValue=t;return}}e.textContent=t}var e1=new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));function Z0(e,t,n){var i=t.indexOf("--")===0;n==null||typeof n=="boolean"||n===""?i?e.setProperty(t,""):t==="float"?e.cssFloat="":e[t]="":i?e.setProperty(t,n):typeof n!="number"||n===0||e1.has(t)?t==="float"?e.cssFloat=n:e[t]=(""+n).trim():e[t]=n+"px"}function Uv(e,t,n){if(t!=null&&typeof t!="object")throw Error($(62));if(e=e.style,n!=null){for(var i in n)!n.hasOwnProperty(i)||t!=null&&t.hasOwnProperty(i)||(i.indexOf("--")===0?e.setProperty(i,""):i==="float"?e.cssFloat="":e[i]="");for(var s in t)i=t[s],t.hasOwnProperty(s)&&n[s]!==i&&Z0(e,s,i)}else for(var a in t)t.hasOwnProperty(a)&&Z0(e,a,t[a])}function Gp(e){if(e.indexOf("-")===-1)return!1;switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var n1=new Map([["acceptCharset","accept-charset"],["htmlFor","for"],["httpEquiv","http-equiv"],["crossOrigin","crossorigin"],["accentHeight","accent-height"],["alignmentBaseline","alignment-baseline"],["arabicForm","arabic-form"],["baselineShift","baseline-shift"],["capHeight","cap-height"],["clipPath","clip-path"],["clipRule","clip-rule"],["colorInterpolation","color-interpolation"],["colorInterpolationFilters","color-interpolation-filters"],["colorProfile","color-profile"],["colorRendering","color-rendering"],["dominantBaseline","dominant-baseline"],["enableBackground","enable-background"],["fillOpacity","fill-opacity"],["fillRule","fill-rule"],["floodColor","flood-color"],["floodOpacity","flood-opacity"],["fontFamily","font-family"],["fontSize","font-size"],["fontSizeAdjust","font-size-adjust"],["fontStretch","font-stretch"],["fontStyle","font-style"],["fontVariant","font-variant"],["fontWeight","font-weight"],["glyphName","glyph-name"],["glyphOrientationHorizontal","glyph-orientation-horizontal"],["glyphOrientationVertical","glyph-orientation-vertical"],["horizAdvX","horiz-adv-x"],["horizOriginX","horiz-origin-x"],["imageRendering","image-rendering"],["letterSpacing","letter-spacing"],["lightingColor","lighting-color"],["markerEnd","marker-end"],["markerMid","marker-mid"],["markerStart","marker-start"],["overlinePosition","overline-position"],["overlineThickness","overline-thickness"],["paintOrder","paint-order"],["panose-1","panose-1"],["pointerEvents","pointer-events"],["renderingIntent","rendering-intent"],["shapeRendering","shape-rendering"],["stopColor","stop-color"],["stopOpacity","stop-opacity"],["strikethroughPosition","strikethrough-position"],["strikethroughThickness","strikethrough-thickness"],["strokeDasharray","stroke-dasharray"],["strokeDashoffset","stroke-dashoffset"],["strokeLinecap","stroke-linecap"],["strokeLinejoin","stroke-linejoin"],["strokeMiterlimit","stroke-miterlimit"],["strokeOpacity","stroke-opacity"],["strokeWidth","stroke-width"],["textAnchor","text-anchor"],["textDecoration","text-decoration"],["textRendering","text-rendering"],["transformOrigin","transform-origin"],["underlinePosition","underline-position"],["underlineThickness","underline-thickness"],["unicodeBidi","unicode-bidi"],["unicodeRange","unicode-range"],["unitsPerEm","units-per-em"],["vAlphabetic","v-alphabetic"],["vHanging","v-hanging"],["vIdeographic","v-ideographic"],["vMathematical","v-mathematical"],["vectorEffect","vector-effect"],["vertAdvY","vert-adv-y"],["vertOriginX","vert-origin-x"],["vertOriginY","vert-origin-y"],["wordSpacing","word-spacing"],["writingMode","writing-mode"],["xmlnsXlink","xmlns:xlink"],["xHeight","x-height"]]),i1=/^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;function Vc(e){return i1.test(""+e)?"javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')":e}function ds(){}var tp=null;function Wp(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var _r=null,Nr=null;function K0(e){var t=Zr(e);if(t&&(e=t.stateNode)){var n=e[Pn]||null;t:switch(e=t.stateNode,t.type){case"input":if(jd(e,n.value,n.defaultValue,n.defaultValue,n.checked,n.defaultChecked,n.type,n.name),t=n.name,n.type==="radio"&&t!=null){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll('input[name="'+ui(""+t)+'"][type="radio"]'),t=0;t<n.length;t++){var i=n[t];if(i!==e&&i.form===e.form){var s=i[Pn]||null;if(!s)throw Error($(90));jd(i,s.value,s.defaultValue,s.defaultValue,s.checked,s.defaultChecked,s.type,s.name)}}for(t=0;t<n.length;t++)i=n[t],i.form===e.form&&Rv(i)}break t;case"textarea":Nv(e,n.value,n.defaultValue);break t;case"select":t=n.value,t!=null&&Dr(e,!!n.multiple,t,!1)}}}var pd=!1;function Ov(e,t,n){if(pd)return e(t,n);pd=!0;try{var i=e(t);return i}finally{if(pd=!1,(_r!==null||Nr!==null)&&(Hu(),_r&&(t=_r,e=Nr,Nr=_r=null,K0(t),e)))for(t=0;t<e.length;t++)K0(e[t])}}function rl(e,t){var n=e.stateNode;if(n===null)return null;var i=n[Pn]||null;if(i===null)return null;n=i[t];t:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(i=!i.disabled)||(e=e.type,i=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!i;break t;default:e=!1}if(e)return null;if(n&&typeof n!="function")throw Error($(231,t,typeof n));return n}var vs=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),ep=!1;if(vs)try{fr={},Object.defineProperty(fr,"passive",{get:function(){ep=!0}}),window.addEventListener("test",fr,fr),window.removeEventListener("test",fr,fr)}catch{ep=!1}var fr,Ws=null,Xp=null,Hc=null;function Iv(){if(Hc)return Hc;var e,t=Xp,n=t.length,i,s="value"in Ws?Ws.value:Ws.textContent,a=s.length;for(e=0;e<n&&t[e]===s[e];e++);var r=n-e;for(i=1;i<=r&&t[n-i]===s[a-i];i++);return Hc=s.slice(e,1<i?1-i:void 0)}function kc(e){var t=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function Ac(){return!0}function J0(){return!1}function Bn(e){function t(n,i,s,a,r){this._reactName=n,this._targetInst=s,this.type=i,this.nativeEvent=a,this.target=r,this.currentTarget=null;for(var o in e)e.hasOwnProperty(o)&&(n=e[o],this[o]=n?n(a):a[o]);return this.isDefaultPrevented=(a.defaultPrevented!=null?a.defaultPrevented:a.returnValue===!1)?Ac:J0,this.isPropagationStopped=J0,this}return Te(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=Ac)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=Ac)},persist:function(){},isPersistent:Ac}),t}var Wa={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Du=Bn(Wa),El=Te({},Wa,{view:0,detail:0}),s1=Bn(El),md,gd,Io,Nu=Te({},El,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:qp,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==Io&&(Io&&e.type==="mousemove"?(md=e.screenX-Io.screenX,gd=e.screenY-Io.screenY):gd=md=0,Io=e),md)},movementY:function(e){return"movementY"in e?e.movementY:gd}}),Q0=Bn(Nu),a1=Te({},Nu,{dataTransfer:0}),r1=Bn(a1),o1=Te({},El,{relatedTarget:0}),yd=Bn(o1),l1=Te({},Wa,{animationName:0,elapsedTime:0,pseudoElement:0}),c1=Bn(l1),u1=Te({},Wa,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),h1=Bn(u1),f1=Te({},Wa,{data:0}),j0=Bn(f1),d1={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},p1={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},m1={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function g1(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=m1[e])?!!t[e]:!1}function qp(){return g1}var y1=Te({},El,{key:function(e){if(e.key){var t=d1[e.key]||e.key;if(t!=="Unidentified")return t}return e.type==="keypress"?(e=kc(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?p1[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:qp,charCode:function(e){return e.type==="keypress"?kc(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?kc(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),v1=Bn(y1),x1=Te({},Nu,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),$0=Bn(x1),_1=Te({},El,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:qp}),S1=Bn(_1),b1=Te({},Wa,{propertyName:0,elapsedTime:0,pseudoElement:0}),M1=Bn(b1),E1=Te({},Nu,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),T1=Bn(E1),A1=Te({},Wa,{newState:0,oldState:0}),w1=Bn(A1),C1=[9,13,27,32],Yp=vs&&"CompositionEvent"in window,qo=null;vs&&"documentMode"in document&&(qo=document.documentMode);var R1=vs&&"TextEvent"in window&&!qo,Pv=vs&&(!Yp||qo&&8<qo&&11>=qo),ty=" ",ey=!1;function Bv(e,t){switch(e){case"keyup":return C1.indexOf(t.keyCode)!==-1;case"keydown":return t.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function zv(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var Sr=!1;function D1(e,t){switch(e){case"compositionend":return zv(t);case"keypress":return t.which!==32?null:(ey=!0,ty);case"textInput":return e=t.data,e===ty&&ey?null:e;default:return null}}function N1(e,t){if(Sr)return e==="compositionend"||!Yp&&Bv(e,t)?(e=Iv(),Hc=Xp=Ws=null,Sr=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return Pv&&t.locale!=="ko"?null:t.data;default:return null}}var L1={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function ny(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t==="input"?!!L1[e.type]:t==="textarea"}function Fv(e,t,n,i){_r?Nr?Nr.push(i):Nr=[i]:_r=i,t=bu(t,"onChange"),0<t.length&&(n=new Du("onChange","change",null,n,i),e.push({event:n,listeners:t}))}var Yo=null,ol=null;function U1(e){O_(e,0)}function Lu(e){var t=Go(e);if(Rv(t))return e}function iy(e,t){if(e==="change")return t}var Vv=!1;vs&&(vs?(Cc="oninput"in document,Cc||(vd=document.createElement("div"),vd.setAttribute("oninput","return;"),Cc=typeof vd.oninput=="function"),wc=Cc):wc=!1,Vv=wc&&(!document.documentMode||9<document.documentMode));var wc,Cc,vd;function sy(){Yo&&(Yo.detachEvent("onpropertychange",Hv),ol=Yo=null)}function Hv(e){if(e.propertyName==="value"&&Lu(ol)){var t=[];Fv(t,ol,e,Wp(e)),Ov(U1,t)}}function O1(e,t,n){e==="focusin"?(sy(),Yo=t,ol=n,Yo.attachEvent("onpropertychange",Hv)):e==="focusout"&&sy()}function I1(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return Lu(ol)}function P1(e,t){if(e==="click")return Lu(t)}function B1(e,t){if(e==="input"||e==="change")return Lu(t)}function z1(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var Qn=typeof Object.is=="function"?Object.is:z1;function ll(e,t){if(Qn(e,t))return!0;if(typeof e!="object"||e===null||typeof t!="object"||t===null)return!1;var n=Object.keys(e),i=Object.keys(t);if(n.length!==i.length)return!1;for(i=0;i<n.length;i++){var s=n[i];if(!Kd.call(t,s)||!Qn(e[s],t[s]))return!1}return!0}function ay(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function ry(e,t){var n=ay(e);e=0;for(var i;n;){if(n.nodeType===3){if(i=e+n.textContent.length,e<=t&&i>=t)return{node:n,offset:t-e};e=i}t:{for(;n;){if(n.nextSibling){n=n.nextSibling;break t}n=n.parentNode}n=void 0}n=ay(n)}}function kv(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?kv(e,t.parentNode):"contains"in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function Gv(e){e=e!=null&&e.ownerDocument!=null&&e.ownerDocument.defaultView!=null?e.ownerDocument.defaultView:window;for(var t=su(e.document);t instanceof e.HTMLIFrameElement;){try{var n=typeof t.contentWindow.location.href=="string"}catch{n=!1}if(n)e=t.contentWindow;else break;t=su(e.document)}return t}function Zp(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||t==="textarea"||e.contentEditable==="true")}var F1=vs&&"documentMode"in document&&11>=document.documentMode,br=null,np=null,Zo=null,ip=!1;function oy(e,t,n){var i=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;ip||br==null||br!==su(i)||(i=br,"selectionStart"in i&&Zp(i)?i={start:i.selectionStart,end:i.selectionEnd}:(i=(i.ownerDocument&&i.ownerDocument.defaultView||window).getSelection(),i={anchorNode:i.anchorNode,anchorOffset:i.anchorOffset,focusNode:i.focusNode,focusOffset:i.focusOffset}),Zo&&ll(Zo,i)||(Zo=i,i=bu(np,"onSelect"),0<i.length&&(t=new Du("onSelect","select",null,t,n),e.push({event:t,listeners:i}),t.target=br)))}function Ca(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n["Webkit"+e]="webkit"+t,n["Moz"+e]="moz"+t,n}var Mr={animationend:Ca("Animation","AnimationEnd"),animationiteration:Ca("Animation","AnimationIteration"),animationstart:Ca("Animation","AnimationStart"),transitionrun:Ca("Transition","TransitionRun"),transitionstart:Ca("Transition","TransitionStart"),transitioncancel:Ca("Transition","TransitionCancel"),transitionend:Ca("Transition","TransitionEnd")},xd={},Wv={};vs&&(Wv=document.createElement("div").style,"AnimationEvent"in window||(delete Mr.animationend.animation,delete Mr.animationiteration.animation,delete Mr.animationstart.animation),"TransitionEvent"in window||delete Mr.transitionend.transition);function Xa(e){if(xd[e])return xd[e];if(!Mr[e])return e;var t=Mr[e],n;for(n in t)if(t.hasOwnProperty(n)&&n in Wv)return xd[e]=t[n];return e}var Xv=Xa("animationend"),qv=Xa("animationiteration"),Yv=Xa("animationstart"),V1=Xa("transitionrun"),H1=Xa("transitionstart"),k1=Xa("transitioncancel"),Zv=Xa("transitionend"),Kv=new Map,sp="abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");sp.push("scrollEnd");function Ti(e,t){Kv.set(e,t),Ga(t,[e])}var au=typeof reportError=="function"?reportError:function(e){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var t=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof e=="object"&&e!==null&&typeof e.message=="string"?String(e.message):String(e),error:e});if(!window.dispatchEvent(t))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",e);return}console.error(e)},ri=[],Er=0,Kp=0;function Uu(){for(var e=Er,t=Kp=Er=0;t<e;){var n=ri[t];ri[t++]=null;var i=ri[t];ri[t++]=null;var s=ri[t];ri[t++]=null;var a=ri[t];if(ri[t++]=null,i!==null&&s!==null){var r=i.pending;r===null?s.next=s:(s.next=r.next,r.next=s),i.pending=s}a!==0&&Jv(n,s,a)}}function Ou(e,t,n,i){ri[Er++]=e,ri[Er++]=t,ri[Er++]=n,ri[Er++]=i,Kp|=i,e.lanes|=i,e=e.alternate,e!==null&&(e.lanes|=i)}function Jp(e,t,n,i){return Ou(e,t,n,i),ru(e)}function qa(e,t){return Ou(e,null,null,t),ru(e)}function Jv(e,t,n){e.lanes|=n;var i=e.alternate;i!==null&&(i.lanes|=n);for(var s=!1,a=e.return;a!==null;)a.childLanes|=n,i=a.alternate,i!==null&&(i.childLanes|=n),a.tag===22&&(e=a.stateNode,e===null||e._visibility&1||(s=!0)),e=a,a=a.return;return e.tag===3?(a=e.stateNode,s&&t!==null&&(s=31-Kn(n),e=a.hiddenUpdates,i=e[s],i===null?e[s]=[t]:i.push(t),t.lane=n|536870912),a):null}function ru(e){if(50<il)throw il=0,Tp=null,Error($(185));for(var t=e.return;t!==null;)e=t,t=e.return;return e.tag===3?e.stateNode:null}var Tr={};function G1(e,t,n,i){this.tag=e,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.refCleanup=this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=i,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Xn(e,t,n,i){return new G1(e,t,n,i)}function Qp(e){return e=e.prototype,!(!e||!e.isReactComponent)}function ms(e,t){var n=e.alternate;return n===null?(n=Xn(e.tag,t,e.key,e.mode),n.elementType=e.elementType,n.type=e.type,n.stateNode=e.stateNode,n.alternate=e,e.alternate=n):(n.pendingProps=t,n.type=e.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=e.flags&65011712,n.childLanes=e.childLanes,n.lanes=e.lanes,n.child=e.child,n.memoizedProps=e.memoizedProps,n.memoizedState=e.memoizedState,n.updateQueue=e.updateQueue,t=e.dependencies,n.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},n.sibling=e.sibling,n.index=e.index,n.ref=e.ref,n.refCleanup=e.refCleanup,n}function Qv(e,t){e.flags&=65011714;var n=e.alternate;return n===null?(e.childLanes=0,e.lanes=t,e.child=null,e.subtreeFlags=0,e.memoizedProps=null,e.memoizedState=null,e.updateQueue=null,e.dependencies=null,e.stateNode=null):(e.childLanes=n.childLanes,e.lanes=n.lanes,e.child=n.child,e.subtreeFlags=0,e.deletions=null,e.memoizedProps=n.memoizedProps,e.memoizedState=n.memoizedState,e.updateQueue=n.updateQueue,e.type=n.type,t=n.dependencies,e.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext}),e}function Gc(e,t,n,i,s,a){var r=0;if(i=e,typeof e=="function")Qp(e)&&(r=1);else if(typeof e=="string")r=qE(e,n,qi.current)?26:e==="html"||e==="head"||e==="body"?27:5;else t:switch(e){case Xd:return e=Xn(31,n,t,s),e.elementType=Xd,e.lanes=a,e;case yr:return Oa(n.children,s,a,t);case gv:r=8,s|=24;break;case kd:return e=Xn(12,n,t,s|2),e.elementType=kd,e.lanes=a,e;case Gd:return e=Xn(13,n,t,s),e.elementType=Gd,e.lanes=a,e;case Wd:return e=Xn(19,n,t,s),e.elementType=Wd,e.lanes=a,e;default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case fs:r=10;break t;case yv:r=9;break t;case Bp:r=11;break t;case zp:r=14;break t;case Bs:r=16,i=null;break t}r=29,n=Error($(130,e===null?"null":typeof e,"")),i=null}return t=Xn(r,n,t,s),t.elementType=e,t.type=i,t.lanes=a,t}function Oa(e,t,n,i){return e=Xn(7,e,i,t),e.lanes=n,e}function _d(e,t,n){return e=Xn(6,e,null,t),e.lanes=n,e}function jv(e){var t=Xn(18,null,null,0);return t.stateNode=e,t}function Sd(e,t,n){return t=Xn(4,e.children!==null?e.children:[],e.key,t),t.lanes=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}var ly=new WeakMap;function hi(e,t){if(typeof e=="object"&&e!==null){var n=ly.get(e);return n!==void 0?n:(t={value:e,source:t,stack:G0(t)},ly.set(e,t),t)}return{value:e,source:t,stack:G0(t)}}var Ar=[],wr=0,ou=null,cl=0,li=[],ci=0,ia=null,Gi=1,Wi="";function us(e,t){Ar[wr++]=cl,Ar[wr++]=ou,ou=e,cl=t}function $v(e,t,n){li[ci++]=Gi,li[ci++]=Wi,li[ci++]=ia,ia=e;var i=Gi;e=Wi;var s=32-Kn(i)-1;i&=~(1<<s),n+=1;var a=32-Kn(t)+s;if(30<a){var r=s-s%5;a=(i&(1<<r)-1).toString(32),i>>=r,s-=r,Gi=1<<32-Kn(t)+s|n<<s|i,Wi=a+e}else Gi=1<<a|n<<s|i,Wi=e}function jp(e){e.return!==null&&(us(e,1),$v(e,1,0))}function $p(e){for(;e===ou;)ou=Ar[--wr],Ar[wr]=null,cl=Ar[--wr],Ar[wr]=null;for(;e===ia;)ia=li[--ci],li[ci]=null,Wi=li[--ci],li[ci]=null,Gi=li[--ci],li[ci]=null}function tx(e,t){li[ci++]=Gi,li[ci++]=Wi,li[ci++]=ia,Gi=t.id,Wi=t.overflow,ia=e}var fn=null,Ee=null,jt=!1,Ks=null,fi=!1,ap=Error($(519));function sa(e){var t=Error($(418,1<arguments.length&&arguments[1]!==void 0&&arguments[1]?"text":"HTML",""));throw ul(hi(t,e)),ap}function cy(e){var t=e.stateNode,n=e.type,i=e.memoizedProps;switch(t[hn]=e,t[Pn]=i,n){case"dialog":Xt("cancel",t),Xt("close",t);break;case"iframe":case"object":case"embed":Xt("load",t);break;case"video":case"audio":for(n=0;n<pl.length;n++)Xt(pl[n],t);break;case"source":Xt("error",t);break;case"img":case"image":case"link":Xt("error",t),Xt("load",t);break;case"details":Xt("toggle",t);break;case"input":Xt("invalid",t),Dv(t,i.value,i.defaultValue,i.checked,i.defaultChecked,i.type,i.name,!0);break;case"select":Xt("invalid",t);break;case"textarea":Xt("invalid",t),Lv(t,i.value,i.defaultValue,i.children)}n=i.children,typeof n!="string"&&typeof n!="number"&&typeof n!="bigint"||t.textContent===""+n||i.suppressHydrationWarning===!0||P_(t.textContent,n)?(i.popover!=null&&(Xt("beforetoggle",t),Xt("toggle",t)),i.onScroll!=null&&Xt("scroll",t),i.onScrollEnd!=null&&Xt("scrollend",t),i.onClick!=null&&(t.onclick=ds),t=!0):t=!1,t||sa(e,!0)}function uy(e){for(fn=e.return;fn;)switch(fn.tag){case 5:case 31:case 13:fi=!1;return;case 27:case 3:fi=!0;return;default:fn=fn.return}}function dr(e){if(e!==fn)return!1;if(!jt)return uy(e),jt=!0,!1;var t=e.tag,n;if((n=t!==3&&t!==27)&&((n=t===5)&&(n=e.type,n=!(n!=="form"&&n!=="button")||Dp(e.type,e.memoizedProps)),n=!n),n&&Ee&&sa(e),uy(e),t===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error($(317));Ee=jy(e)}else if(t===31){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error($(317));Ee=jy(e)}else t===27?(t=Ee,la(e.type)?(e=Op,Op=null,Ee=e):Ee=t):Ee=fn?pi(e.stateNode.nextSibling):null;return!0}function za(){Ee=fn=null,jt=!1}function bd(){var e=Ks;return e!==null&&(On===null?On=e:On.push.apply(On,e),Ks=null),e}function ul(e){Ks===null?Ks=[e]:Ks.push(e)}var rp=Yi(null),Ya=null,ps=null;function Fs(e,t,n){_e(rp,t._currentValue),t._currentValue=n}function gs(e){e._currentValue=rp.current,on(rp)}function op(e,t,n){for(;e!==null;){var i=e.alternate;if((e.childLanes&t)!==t?(e.childLanes|=t,i!==null&&(i.childLanes|=t)):i!==null&&(i.childLanes&t)!==t&&(i.childLanes|=t),e===n)break;e=e.return}}function lp(e,t,n,i){var s=e.child;for(s!==null&&(s.return=e);s!==null;){var a=s.dependencies;if(a!==null){var r=s.child;a=a.firstContext;t:for(;a!==null;){var o=a;a=s;for(var l=0;l<t.length;l++)if(o.context===t[l]){a.lanes|=n,o=a.alternate,o!==null&&(o.lanes|=n),op(a.return,n,e),i||(r=null);break t}a=o.next}}else if(s.tag===18){if(r=s.return,r===null)throw Error($(341));r.lanes|=n,a=r.alternate,a!==null&&(a.lanes|=n),op(r,n,e),r=null}else r=s.child;if(r!==null)r.return=s;else for(r=s;r!==null;){if(r===e){r=null;break}if(s=r.sibling,s!==null){s.return=r.return,r=s;break}r=r.return}s=r}}function Kr(e,t,n,i){e=null;for(var s=t,a=!1;s!==null;){if(!a){if((s.flags&524288)!==0)a=!0;else if((s.flags&262144)!==0)break}if(s.tag===10){var r=s.alternate;if(r===null)throw Error($(387));if(r=r.memoizedProps,r!==null){var o=s.type;Qn(s.pendingProps.value,r.value)||(e!==null?e.push(o):e=[o])}}else if(s===tu.current){if(r=s.alternate,r===null)throw Error($(387));r.memoizedState.memoizedState!==s.memoizedState.memoizedState&&(e!==null?e.push(gl):e=[gl])}s=s.return}e!==null&&lp(t,e,n,i),t.flags|=262144}function lu(e){for(e=e.firstContext;e!==null;){if(!Qn(e.context._currentValue,e.memoizedValue))return!0;e=e.next}return!1}function Fa(e){Ya=e,ps=null,e=e.dependencies,e!==null&&(e.firstContext=null)}function dn(e){return ex(Ya,e)}function Rc(e,t){return Ya===null&&Fa(e),ex(e,t)}function ex(e,t){var n=t._currentValue;if(t={context:t,memoizedValue:n,next:null},ps===null){if(e===null)throw Error($(308));ps=t,e.dependencies={lanes:0,firstContext:t},e.flags|=524288}else ps=ps.next=t;return n}var W1=typeof AbortController<"u"?AbortController:function(){var e=[],t=this.signal={aborted:!1,addEventListener:function(n,i){e.push(i)}};this.abort=function(){t.aborted=!0,e.forEach(function(n){return n()})}},X1=je.unstable_scheduleCallback,q1=je.unstable_NormalPriority,Ye={$$typeof:fs,Consumer:null,Provider:null,_currentValue:null,_currentValue2:null,_threadCount:0};function tm(){return{controller:new W1,data:new Map,refCount:0}}function Tl(e){e.refCount--,e.refCount===0&&X1(q1,function(){e.controller.abort()})}var Ko=null,cp=0,Fr=0,Lr=null;function Y1(e,t){if(Ko===null){var n=Ko=[];cp=0,Fr=Tm(),Lr={status:"pending",value:void 0,then:function(i){n.push(i)}}}return cp++,t.then(hy,hy),t}function hy(){if(--cp===0&&Ko!==null){Lr!==null&&(Lr.status="fulfilled");var e=Ko;Ko=null,Fr=0,Lr=null;for(var t=0;t<e.length;t++)(0,e[t])()}}function Z1(e,t){var n=[],i={status:"pending",value:null,reason:null,then:function(s){n.push(s)}};return e.then(function(){i.status="fulfilled",i.value=t;for(var s=0;s<n.length;s++)(0,n[s])(t)},function(s){for(i.status="rejected",i.reason=s,s=0;s<n.length;s++)(0,n[s])(void 0)}),i}var fy=Lt.S;Lt.S=function(e,t){m_=Yn(),typeof t=="object"&&t!==null&&typeof t.then=="function"&&Y1(e,t),fy!==null&&fy(e,t)};var Ia=Yi(null);function em(){var e=Ia.current;return e!==null?e:ge.pooledCache}function Wc(e,t){t===null?_e(Ia,Ia.current):_e(Ia,t.pool)}function nx(){var e=em();return e===null?null:{parent:Ye._currentValue,pool:e}}var Jr=Error($(460)),nm=Error($(474)),Iu=Error($(542)),cu={then:function(){}};function dy(e){return e=e.status,e==="fulfilled"||e==="rejected"}function ix(e,t,n){switch(n=e[n],n===void 0?e.push(t):n!==t&&(t.then(ds,ds),t=n),t.status){case"fulfilled":return t.value;case"rejected":throw e=t.reason,my(e),e;default:if(typeof t.status=="string")t.then(ds,ds);else{if(e=ge,e!==null&&100<e.shellSuspendCounter)throw Error($(482));e=t,e.status="pending",e.then(function(i){if(t.status==="pending"){var s=t;s.status="fulfilled",s.value=i}},function(i){if(t.status==="pending"){var s=t;s.status="rejected",s.reason=i}})}switch(t.status){case"fulfilled":return t.value;case"rejected":throw e=t.reason,my(e),e}throw Pa=t,Jr}}function Na(e){try{var t=e._init;return t(e._payload)}catch(n){throw n!==null&&typeof n=="object"&&typeof n.then=="function"?(Pa=n,Jr):n}}var Pa=null;function py(){if(Pa===null)throw Error($(459));var e=Pa;return Pa=null,e}function my(e){if(e===Jr||e===Iu)throw Error($(483))}var Ur=null,hl=0;function Dc(e){var t=hl;return hl+=1,Ur===null&&(Ur=[]),ix(Ur,e,t)}function Po(e,t){t=t.props.ref,e.ref=t!==void 0?t:null}function Nc(e,t){throw t.$$typeof===OM?Error($(525)):(e=Object.prototype.toString.call(t),Error($(31,e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e)))}function sx(e){function t(f,y){if(e){var M=f.deletions;M===null?(f.deletions=[y],f.flags|=16):M.push(y)}}function n(f,y){if(!e)return null;for(;y!==null;)t(f,y),y=y.sibling;return null}function i(f){for(var y=new Map;f!==null;)f.key!==null?y.set(f.key,f):y.set(f.index,f),f=f.sibling;return y}function s(f,y){return f=ms(f,y),f.index=0,f.sibling=null,f}function a(f,y,M){return f.index=M,e?(M=f.alternate,M!==null?(M=M.index,M<y?(f.flags|=67108866,y):M):(f.flags|=67108866,y)):(f.flags|=1048576,y)}function r(f){return e&&f.alternate===null&&(f.flags|=67108866),f}function o(f,y,M,x){return y===null||y.tag!==6?(y=_d(M,f.mode,x),y.return=f,y):(y=s(y,M),y.return=f,y)}function l(f,y,M,x){var E=M.type;return E===yr?u(f,y,M.props.children,x,M.key):y!==null&&(y.elementType===E||typeof E=="object"&&E!==null&&E.$$typeof===Bs&&Na(E)===y.type)?(y=s(y,M.props),Po(y,M),y.return=f,y):(y=Gc(M.type,M.key,M.props,null,f.mode,x),Po(y,M),y.return=f,y)}function c(f,y,M,x){return y===null||y.tag!==4||y.stateNode.containerInfo!==M.containerInfo||y.stateNode.implementation!==M.implementation?(y=Sd(M,f.mode,x),y.return=f,y):(y=s(y,M.children||[]),y.return=f,y)}function u(f,y,M,x,E){return y===null||y.tag!==7?(y=Oa(M,f.mode,x,E),y.return=f,y):(y=s(y,M),y.return=f,y)}function p(f,y,M){if(typeof y=="string"&&y!==""||typeof y=="number"||typeof y=="bigint")return y=_d(""+y,f.mode,M),y.return=f,y;if(typeof y=="object"&&y!==null){switch(y.$$typeof){case Sc:return M=Gc(y.type,y.key,y.props,null,f.mode,M),Po(M,y),M.return=f,M;case Ho:return y=Sd(y,f.mode,M),y.return=f,y;case Bs:return y=Na(y),p(f,y,M)}if(ko(y)||Oo(y))return y=Oa(y,f.mode,M,null),y.return=f,y;if(typeof y.then=="function")return p(f,Dc(y),M);if(y.$$typeof===fs)return p(f,Rc(f,y),M);Nc(f,y)}return null}function h(f,y,M,x){var E=y!==null?y.key:null;if(typeof M=="string"&&M!==""||typeof M=="number"||typeof M=="bigint")return E!==null?null:o(f,y,""+M,x);if(typeof M=="object"&&M!==null){switch(M.$$typeof){case Sc:return M.key===E?l(f,y,M,x):null;case Ho:return M.key===E?c(f,y,M,x):null;case Bs:return M=Na(M),h(f,y,M,x)}if(ko(M)||Oo(M))return E!==null?null:u(f,y,M,x,null);if(typeof M.then=="function")return h(f,y,Dc(M),x);if(M.$$typeof===fs)return h(f,y,Rc(f,M),x);Nc(f,M)}return null}function d(f,y,M,x,E){if(typeof x=="string"&&x!==""||typeof x=="number"||typeof x=="bigint")return f=f.get(M)||null,o(y,f,""+x,E);if(typeof x=="object"&&x!==null){switch(x.$$typeof){case Sc:return f=f.get(x.key===null?M:x.key)||null,l(y,f,x,E);case Ho:return f=f.get(x.key===null?M:x.key)||null,c(y,f,x,E);case Bs:return x=Na(x),d(f,y,M,x,E)}if(ko(x)||Oo(x))return f=f.get(M)||null,u(y,f,x,E,null);if(typeof x.then=="function")return d(f,y,M,Dc(x),E);if(x.$$typeof===fs)return d(f,y,M,Rc(y,x),E);Nc(y,x)}return null}function m(f,y,M,x){for(var E=null,T=null,C=y,_=y=0,A=null;C!==null&&_<M.length;_++){C.index>_?(A=C,C=null):A=C.sibling;var R=h(f,C,M[_],x);if(R===null){C===null&&(C=A);break}e&&C&&R.alternate===null&&t(f,C),y=a(R,y,_),T===null?E=R:T.sibling=R,T=R,C=A}if(_===M.length)return n(f,C),jt&&us(f,_),E;if(C===null){for(;_<M.length;_++)C=p(f,M[_],x),C!==null&&(y=a(C,y,_),T===null?E=C:T.sibling=C,T=C);return jt&&us(f,_),E}for(C=i(C);_<M.length;_++)A=d(C,f,_,M[_],x),A!==null&&(e&&A.alternate!==null&&C.delete(A.key===null?_:A.key),y=a(A,y,_),T===null?E=A:T.sibling=A,T=A);return e&&C.forEach(function(I){return t(f,I)}),jt&&us(f,_),E}function b(f,y,M,x){if(M==null)throw Error($(151));for(var E=null,T=null,C=y,_=y=0,A=null,R=M.next();C!==null&&!R.done;_++,R=M.next()){C.index>_?(A=C,C=null):A=C.sibling;var I=h(f,C,R.value,x);if(I===null){C===null&&(C=A);break}e&&C&&I.alternate===null&&t(f,C),y=a(I,y,_),T===null?E=I:T.sibling=I,T=I,C=A}if(R.done)return n(f,C),jt&&us(f,_),E;if(C===null){for(;!R.done;_++,R=M.next())R=p(f,R.value,x),R!==null&&(y=a(R,y,_),T===null?E=R:T.sibling=R,T=R);return jt&&us(f,_),E}for(C=i(C);!R.done;_++,R=M.next())R=d(C,f,_,R.value,x),R!==null&&(e&&R.alternate!==null&&C.delete(R.key===null?_:R.key),y=a(R,y,_),T===null?E=R:T.sibling=R,T=R);return e&&C.forEach(function(F){return t(f,F)}),jt&&us(f,_),E}function g(f,y,M,x){if(typeof M=="object"&&M!==null&&M.type===yr&&M.key===null&&(M=M.props.children),typeof M=="object"&&M!==null){switch(M.$$typeof){case Sc:t:{for(var E=M.key;y!==null;){if(y.key===E){if(E=M.type,E===yr){if(y.tag===7){n(f,y.sibling),x=s(y,M.props.children),x.return=f,f=x;break t}}else if(y.elementType===E||typeof E=="object"&&E!==null&&E.$$typeof===Bs&&Na(E)===y.type){n(f,y.sibling),x=s(y,M.props),Po(x,M),x.return=f,f=x;break t}n(f,y);break}else t(f,y);y=y.sibling}M.type===yr?(x=Oa(M.props.children,f.mode,x,M.key),x.return=f,f=x):(x=Gc(M.type,M.key,M.props,null,f.mode,x),Po(x,M),x.return=f,f=x)}return r(f);case Ho:t:{for(E=M.key;y!==null;){if(y.key===E)if(y.tag===4&&y.stateNode.containerInfo===M.containerInfo&&y.stateNode.implementation===M.implementation){n(f,y.sibling),x=s(y,M.children||[]),x.return=f,f=x;break t}else{n(f,y);break}else t(f,y);y=y.sibling}x=Sd(M,f.mode,x),x.return=f,f=x}return r(f);case Bs:return M=Na(M),g(f,y,M,x)}if(ko(M))return m(f,y,M,x);if(Oo(M)){if(E=Oo(M),typeof E!="function")throw Error($(150));return M=E.call(M),b(f,y,M,x)}if(typeof M.then=="function")return g(f,y,Dc(M),x);if(M.$$typeof===fs)return g(f,y,Rc(f,M),x);Nc(f,M)}return typeof M=="string"&&M!==""||typeof M=="number"||typeof M=="bigint"?(M=""+M,y!==null&&y.tag===6?(n(f,y.sibling),x=s(y,M),x.return=f,f=x):(n(f,y),x=_d(M,f.mode,x),x.return=f,f=x),r(f)):n(f,y)}return function(f,y,M,x){try{hl=0;var E=g(f,y,M,x);return Ur=null,E}catch(C){if(C===Jr||C===Iu)throw C;var T=Xn(29,C,null,f.mode);return T.lanes=x,T.return=f,T}}}var Va=sx(!0),ax=sx(!1),zs=!1;function im(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,lanes:0,hiddenCallbacks:null},callbacks:null}}function up(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,callbacks:null})}function Js(e){return{lane:e,tag:0,payload:null,callback:null,next:null}}function Qs(e,t,n){var i=e.updateQueue;if(i===null)return null;if(i=i.shared,(se&2)!==0){var s=i.pending;return s===null?t.next=t:(t.next=s.next,s.next=t),i.pending=t,t=ru(e),Jv(e,null,n),t}return Ou(e,i,t,n),ru(e)}function Jo(e,t,n){if(t=t.updateQueue,t!==null&&(t=t.shared,(n&4194048)!==0)){var i=t.lanes;i&=e.pendingLanes,n|=i,t.lanes=n,Mv(e,n)}}function Md(e,t){var n=e.updateQueue,i=e.alternate;if(i!==null&&(i=i.updateQueue,n===i)){var s=null,a=null;if(n=n.firstBaseUpdate,n!==null){do{var r={lane:n.lane,tag:n.tag,payload:n.payload,callback:null,next:null};a===null?s=a=r:a=a.next=r,n=n.next}while(n!==null);a===null?s=a=t:a=a.next=t}else s=a=t;n={baseState:i.baseState,firstBaseUpdate:s,lastBaseUpdate:a,shared:i.shared,callbacks:i.callbacks},e.updateQueue=n;return}e=n.lastBaseUpdate,e===null?n.firstBaseUpdate=t:e.next=t,n.lastBaseUpdate=t}var hp=!1;function Qo(){if(hp){var e=Lr;if(e!==null)throw e}}function jo(e,t,n,i){hp=!1;var s=e.updateQueue;zs=!1;var a=s.firstBaseUpdate,r=s.lastBaseUpdate,o=s.shared.pending;if(o!==null){s.shared.pending=null;var l=o,c=l.next;l.next=null,r===null?a=c:r.next=c,r=l;var u=e.alternate;u!==null&&(u=u.updateQueue,o=u.lastBaseUpdate,o!==r&&(o===null?u.firstBaseUpdate=c:o.next=c,u.lastBaseUpdate=l))}if(a!==null){var p=s.baseState;r=0,u=c=l=null,o=a;do{var h=o.lane&-536870913,d=h!==o.lane;if(d?(Jt&h)===h:(i&h)===h){h!==0&&h===Fr&&(hp=!0),u!==null&&(u=u.next={lane:0,tag:o.tag,payload:o.payload,callback:null,next:null});t:{var m=e,b=o;h=t;var g=n;switch(b.tag){case 1:if(m=b.payload,typeof m=="function"){p=m.call(g,p,h);break t}p=m;break t;case 3:m.flags=m.flags&-65537|128;case 0:if(m=b.payload,h=typeof m=="function"?m.call(g,p,h):m,h==null)break t;p=Te({},p,h);break t;case 2:zs=!0}}h=o.callback,h!==null&&(e.flags|=64,d&&(e.flags|=8192),d=s.callbacks,d===null?s.callbacks=[h]:d.push(h))}else d={lane:h,tag:o.tag,payload:o.payload,callback:o.callback,next:null},u===null?(c=u=d,l=p):u=u.next=d,r|=h;if(o=o.next,o===null){if(o=s.shared.pending,o===null)break;d=o,o=d.next,d.next=null,s.lastBaseUpdate=d,s.shared.pending=null}}while(!0);u===null&&(l=p),s.baseState=l,s.firstBaseUpdate=c,s.lastBaseUpdate=u,a===null&&(s.shared.lanes=0),ra|=r,e.lanes=r,e.memoizedState=p}}function rx(e,t){if(typeof e!="function")throw Error($(191,e));e.call(t)}function ox(e,t){var n=e.callbacks;if(n!==null)for(e.callbacks=null,e=0;e<n.length;e++)rx(n[e],t)}var Vr=Yi(null),uu=Yi(0);function gy(e,t){e=bs,_e(uu,e),_e(Vr,t),bs=e|t.baseLanes}function fp(){_e(uu,bs),_e(Vr,Vr.current)}function sm(){bs=uu.current,on(Vr),on(uu)}var jn=Yi(null),di=null;function Vs(e){var t=e.alternate;_e(Fe,Fe.current&1),_e(jn,e),di===null&&(t===null||Vr.current!==null||t.memoizedState!==null)&&(di=e)}function dp(e){_e(Fe,Fe.current),_e(jn,e),di===null&&(di=e)}function lx(e){e.tag===22?(_e(Fe,Fe.current),_e(jn,e),di===null&&(di=e)):Hs(e)}function Hs(){_e(Fe,Fe.current),_e(jn,jn.current)}function Wn(e){on(jn),di===e&&(di=null),on(Fe)}var Fe=Yi(0);function hu(e){for(var t=e;t!==null;){if(t.tag===13){var n=t.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||Lp(n)||Up(n)))return t}else if(t.tag===19&&(t.memoizedProps.revealOrder==="forwards"||t.memoizedProps.revealOrder==="backwards"||t.memoizedProps.revealOrder==="unstable_legacy-backwards"||t.memoizedProps.revealOrder==="together")){if((t.flags&128)!==0)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var xs=0,zt=null,pe=null,Xe=null,fu=!1,Or=!1,Ha=!1,du=0,fl=0,Ir=null,K1=0;function Oe(){throw Error($(321))}function am(e,t){if(t===null)return!1;for(var n=0;n<t.length&&n<e.length;n++)if(!Qn(e[n],t[n]))return!1;return!0}function rm(e,t,n,i,s,a){return xs=a,zt=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,Lt.H=e===null||e.memoizedState===null?Fx:ym,Ha=!1,a=n(i,s),Ha=!1,Or&&(a=ux(t,n,i,s)),cx(e),a}function cx(e){Lt.H=dl;var t=pe!==null&&pe.next!==null;if(xs=0,Xe=pe=zt=null,fu=!1,fl=0,Ir=null,t)throw Error($(300));e===null||Ze||(e=e.dependencies,e!==null&&lu(e)&&(Ze=!0))}function ux(e,t,n,i){zt=e;var s=0;do{if(Or&&(Ir=null),fl=0,Or=!1,25<=s)throw Error($(301));if(s+=1,Xe=pe=null,e.updateQueue!=null){var a=e.updateQueue;a.lastEffect=null,a.events=null,a.stores=null,a.memoCache!=null&&(a.memoCache.index=0)}Lt.H=Vx,a=t(n,i)}while(Or);return a}function J1(){var e=Lt.H,t=e.useState()[0];return t=typeof t.then=="function"?Al(t):t,e=e.useState()[0],(pe!==null?pe.memoizedState:null)!==e&&(zt.flags|=1024),t}function om(){var e=du!==0;return du=0,e}function lm(e,t,n){t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~n}function cm(e){if(fu){for(e=e.memoizedState;e!==null;){var t=e.queue;t!==null&&(t.pending=null),e=e.next}fu=!1}xs=0,Xe=pe=zt=null,Or=!1,fl=du=0,Ir=null}function wn(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Xe===null?zt.memoizedState=Xe=e:Xe=Xe.next=e,Xe}function Ve(){if(pe===null){var e=zt.alternate;e=e!==null?e.memoizedState:null}else e=pe.next;var t=Xe===null?zt.memoizedState:Xe.next;if(t!==null)Xe=t,pe=e;else{if(e===null)throw zt.alternate===null?Error($(467)):Error($(310));pe=e,e={memoizedState:pe.memoizedState,baseState:pe.baseState,baseQueue:pe.baseQueue,queue:pe.queue,next:null},Xe===null?zt.memoizedState=Xe=e:Xe=Xe.next=e}return Xe}function Pu(){return{lastEffect:null,events:null,stores:null,memoCache:null}}function Al(e){var t=fl;return fl+=1,Ir===null&&(Ir=[]),e=ix(Ir,e,t),t=zt,(Xe===null?t.memoizedState:Xe.next)===null&&(t=t.alternate,Lt.H=t===null||t.memoizedState===null?Fx:ym),e}function Bu(e){if(e!==null&&typeof e=="object"){if(typeof e.then=="function")return Al(e);if(e.$$typeof===fs)return dn(e)}throw Error($(438,String(e)))}function um(e){var t=null,n=zt.updateQueue;if(n!==null&&(t=n.memoCache),t==null){var i=zt.alternate;i!==null&&(i=i.updateQueue,i!==null&&(i=i.memoCache,i!=null&&(t={data:i.data.map(function(s){return s.slice()}),index:0})))}if(t==null&&(t={data:[],index:0}),n===null&&(n=Pu(),zt.updateQueue=n),n.memoCache=t,n=t.data[t.index],n===void 0)for(n=t.data[t.index]=Array(e),i=0;i<e;i++)n[i]=IM;return t.index++,n}function _s(e,t){return typeof t=="function"?t(e):t}function Xc(e){var t=Ve();return hm(t,pe,e)}function hm(e,t,n){var i=e.queue;if(i===null)throw Error($(311));i.lastRenderedReducer=n;var s=e.baseQueue,a=i.pending;if(a!==null){if(s!==null){var r=s.next;s.next=a.next,a.next=r}t.baseQueue=s=a,i.pending=null}if(a=e.baseState,s===null)e.memoizedState=a;else{t=s.next;var o=r=null,l=null,c=t,u=!1;do{var p=c.lane&-536870913;if(p!==c.lane?(Jt&p)===p:(xs&p)===p){var h=c.revertLane;if(h===0)l!==null&&(l=l.next={lane:0,revertLane:0,gesture:null,action:c.action,hasEagerState:c.hasEagerState,eagerState:c.eagerState,next:null}),p===Fr&&(u=!0);else if((xs&h)===h){c=c.next,h===Fr&&(u=!0);continue}else p={lane:0,revertLane:c.revertLane,gesture:null,action:c.action,hasEagerState:c.hasEagerState,eagerState:c.eagerState,next:null},l===null?(o=l=p,r=a):l=l.next=p,zt.lanes|=h,ra|=h;p=c.action,Ha&&n(a,p),a=c.hasEagerState?c.eagerState:n(a,p)}else h={lane:p,revertLane:c.revertLane,gesture:c.gesture,action:c.action,hasEagerState:c.hasEagerState,eagerState:c.eagerState,next:null},l===null?(o=l=h,r=a):l=l.next=h,zt.lanes|=p,ra|=p;c=c.next}while(c!==null&&c!==t);if(l===null?r=a:l.next=o,!Qn(a,e.memoizedState)&&(Ze=!0,u&&(n=Lr,n!==null)))throw n;e.memoizedState=a,e.baseState=r,e.baseQueue=l,i.lastRenderedState=a}return s===null&&(i.lanes=0),[e.memoizedState,i.dispatch]}function Ed(e){var t=Ve(),n=t.queue;if(n===null)throw Error($(311));n.lastRenderedReducer=e;var i=n.dispatch,s=n.pending,a=t.memoizedState;if(s!==null){n.pending=null;var r=s=s.next;do a=e(a,r.action),r=r.next;while(r!==s);Qn(a,t.memoizedState)||(Ze=!0),t.memoizedState=a,t.baseQueue===null&&(t.baseState=a),n.lastRenderedState=a}return[a,i]}function hx(e,t,n){var i=zt,s=Ve(),a=jt;if(a){if(n===void 0)throw Error($(407));n=n()}else n=t();var r=!Qn((pe||s).memoizedState,n);if(r&&(s.memoizedState=n,Ze=!0),s=s.queue,fm(px.bind(null,i,s,e),[e]),s.getSnapshot!==t||r||Xe!==null&&Xe.memoizedState.tag&1){if(i.flags|=2048,Hr(9,{destroy:void 0},dx.bind(null,i,s,n,t),null),ge===null)throw Error($(349));a||(xs&127)!==0||fx(i,t,n)}return n}function fx(e,t,n){e.flags|=16384,e={getSnapshot:t,value:n},t=zt.updateQueue,t===null?(t=Pu(),zt.updateQueue=t,t.stores=[e]):(n=t.stores,n===null?t.stores=[e]:n.push(e))}function dx(e,t,n,i){t.value=n,t.getSnapshot=i,mx(t)&&gx(e)}function px(e,t,n){return n(function(){mx(t)&&gx(e)})}function mx(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!Qn(e,n)}catch{return!0}}function gx(e){var t=qa(e,2);t!==null&&In(t,e,2)}function pp(e){var t=wn();if(typeof e=="function"){var n=e;if(e=n(),Ha){Gs(!0);try{n()}finally{Gs(!1)}}}return t.memoizedState=t.baseState=e,t.queue={pending:null,lanes:0,dispatch:null,lastRenderedReducer:_s,lastRenderedState:e},t}function yx(e,t,n,i){return e.baseState=n,hm(e,pe,typeof i=="function"?i:_s)}function Q1(e,t,n,i,s){if(Fu(e))throw Error($(485));if(e=t.action,e!==null){var a={payload:s,action:e,next:null,isTransition:!0,status:"pending",value:null,reason:null,listeners:[],then:function(r){a.listeners.push(r)}};Lt.T!==null?n(!0):a.isTransition=!1,i(a),n=t.pending,n===null?(a.next=t.pending=a,vx(t,a)):(a.next=n.next,t.pending=n.next=a)}}function vx(e,t){var n=t.action,i=t.payload,s=e.state;if(t.isTransition){var a=Lt.T,r={};Lt.T=r;try{var o=n(s,i),l=Lt.S;l!==null&&l(r,o),yy(e,t,o)}catch(c){mp(e,t,c)}finally{a!==null&&r.types!==null&&(a.types=r.types),Lt.T=a}}else try{a=n(s,i),yy(e,t,a)}catch(c){mp(e,t,c)}}function yy(e,t,n){n!==null&&typeof n=="object"&&typeof n.then=="function"?n.then(function(i){vy(e,t,i)},function(i){return mp(e,t,i)}):vy(e,t,n)}function vy(e,t,n){t.status="fulfilled",t.value=n,xx(t),e.state=n,t=e.pending,t!==null&&(n=t.next,n===t?e.pending=null:(n=n.next,t.next=n,vx(e,n)))}function mp(e,t,n){var i=e.pending;if(e.pending=null,i!==null){i=i.next;do t.status="rejected",t.reason=n,xx(t),t=t.next;while(t!==i)}e.action=null}function xx(e){e=e.listeners;for(var t=0;t<e.length;t++)(0,e[t])()}function _x(e,t){return t}function xy(e,t){if(jt){var n=ge.formState;if(n!==null){t:{var i=zt;if(jt){if(Ee){e:{for(var s=Ee,a=fi;s.nodeType!==8;){if(!a){s=null;break e}if(s=pi(s.nextSibling),s===null){s=null;break e}}a=s.data,s=a==="F!"||a==="F"?s:null}if(s){Ee=pi(s.nextSibling),i=s.data==="F!";break t}}sa(i)}i=!1}i&&(t=n[0])}}return n=wn(),n.memoizedState=n.baseState=t,i={pending:null,lanes:0,dispatch:null,lastRenderedReducer:_x,lastRenderedState:t},n.queue=i,n=Px.bind(null,zt,i),i.dispatch=n,i=pp(!1),a=gm.bind(null,zt,!1,i.queue),i=wn(),s={state:t,dispatch:null,action:e,pending:null},i.queue=s,n=Q1.bind(null,zt,s,a,n),s.dispatch=n,i.memoizedState=e,[t,n,!1]}function _y(e){var t=Ve();return Sx(t,pe,e)}function Sx(e,t,n){if(t=hm(e,t,_x)[0],e=Xc(_s)[0],typeof t=="object"&&t!==null&&typeof t.then=="function")try{var i=Al(t)}catch(r){throw r===Jr?Iu:r}else i=t;t=Ve();var s=t.queue,a=s.dispatch;return n!==t.memoizedState&&(zt.flags|=2048,Hr(9,{destroy:void 0},j1.bind(null,s,n),null)),[i,a,e]}function j1(e,t){e.action=t}function Sy(e){var t=Ve(),n=pe;if(n!==null)return Sx(t,n,e);Ve(),t=t.memoizedState,n=Ve();var i=n.queue.dispatch;return n.memoizedState=e,[t,i,!1]}function Hr(e,t,n,i){return e={tag:e,create:n,deps:i,inst:t,next:null},t=zt.updateQueue,t===null&&(t=Pu(),zt.updateQueue=t),n=t.lastEffect,n===null?t.lastEffect=e.next=e:(i=n.next,n.next=e,e.next=i,t.lastEffect=e),e}function bx(){return Ve().memoizedState}function qc(e,t,n,i){var s=wn();zt.flags|=e,s.memoizedState=Hr(1|t,{destroy:void 0},n,i===void 0?null:i)}function zu(e,t,n,i){var s=Ve();i=i===void 0?null:i;var a=s.memoizedState.inst;pe!==null&&i!==null&&am(i,pe.memoizedState.deps)?s.memoizedState=Hr(t,a,n,i):(zt.flags|=e,s.memoizedState=Hr(1|t,a,n,i))}function by(e,t){qc(8390656,8,e,t)}function fm(e,t){zu(2048,8,e,t)}function $1(e){zt.flags|=4;var t=zt.updateQueue;if(t===null)t=Pu(),zt.updateQueue=t,t.events=[e];else{var n=t.events;n===null?t.events=[e]:n.push(e)}}function Mx(e){var t=Ve().memoizedState;return $1({ref:t,nextImpl:e}),function(){if((se&2)!==0)throw Error($(440));return t.impl.apply(void 0,arguments)}}function Ex(e,t){return zu(4,2,e,t)}function Tx(e,t){return zu(4,4,e,t)}function Ax(e,t){if(typeof t=="function"){e=e();var n=t(e);return function(){typeof n=="function"?n():t(null)}}if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function wx(e,t,n){n=n!=null?n.concat([e]):null,zu(4,4,Ax.bind(null,t,e),n)}function dm(){}function Cx(e,t){var n=Ve();t=t===void 0?null:t;var i=n.memoizedState;return t!==null&&am(t,i[1])?i[0]:(n.memoizedState=[e,t],e)}function Rx(e,t){var n=Ve();t=t===void 0?null:t;var i=n.memoizedState;if(t!==null&&am(t,i[1]))return i[0];if(i=e(),Ha){Gs(!0);try{e()}finally{Gs(!1)}}return n.memoizedState=[i,t],i}function pm(e,t,n){return n===void 0||(xs&1073741824)!==0&&(Jt&261930)===0?e.memoizedState=t:(e.memoizedState=n,e=y_(),zt.lanes|=e,ra|=e,n)}function Dx(e,t,n,i){return Qn(n,t)?n:Vr.current!==null?(e=pm(e,n,i),Qn(e,t)||(Ze=!0),e):(xs&42)===0||(xs&1073741824)!==0&&(Jt&261930)===0?(Ze=!0,e.memoizedState=n):(e=y_(),zt.lanes|=e,ra|=e,t)}function Nx(e,t,n,i,s){var a=ae.p;ae.p=a!==0&&8>a?a:8;var r=Lt.T,o={};Lt.T=o,gm(e,!1,t,n);try{var l=s(),c=Lt.S;if(c!==null&&c(o,l),l!==null&&typeof l=="object"&&typeof l.then=="function"){var u=Z1(l,i);$o(e,t,u,Jn(e))}else $o(e,t,i,Jn(e))}catch(p){$o(e,t,{then:function(){},status:"rejected",reason:p},Jn())}finally{ae.p=a,r!==null&&o.types!==null&&(r.types=o.types),Lt.T=r}}function tE(){}function gp(e,t,n,i){if(e.tag!==5)throw Error($(476));var s=Lx(e).queue;Nx(e,s,t,Ua,n===null?tE:function(){return Ux(e),n(i)})}function Lx(e){var t=e.memoizedState;if(t!==null)return t;t={memoizedState:Ua,baseState:Ua,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:_s,lastRenderedState:Ua},next:null};var n={};return t.next={memoizedState:n,baseState:n,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:_s,lastRenderedState:n},next:null},e.memoizedState=t,e=e.alternate,e!==null&&(e.memoizedState=t),t}function Ux(e){var t=Lx(e);t.next===null&&(t=e.alternate.memoizedState),$o(e,t.next.queue,{},Jn())}function mm(){return dn(gl)}function Ox(){return Ve().memoizedState}function Ix(){return Ve().memoizedState}function eE(e){for(var t=e.return;t!==null;){switch(t.tag){case 24:case 3:var n=Jn();e=Js(n);var i=Qs(t,e,n);i!==null&&(In(i,t,n),Jo(i,t,n)),t={cache:tm()},e.payload=t;return}t=t.return}}function nE(e,t,n){var i=Jn();n={lane:i,revertLane:0,gesture:null,action:n,hasEagerState:!1,eagerState:null,next:null},Fu(e)?Bx(t,n):(n=Jp(e,t,n,i),n!==null&&(In(n,e,i),zx(n,t,i)))}function Px(e,t,n){var i=Jn();$o(e,t,n,i)}function $o(e,t,n,i){var s={lane:i,revertLane:0,gesture:null,action:n,hasEagerState:!1,eagerState:null,next:null};if(Fu(e))Bx(t,s);else{var a=e.alternate;if(e.lanes===0&&(a===null||a.lanes===0)&&(a=t.lastRenderedReducer,a!==null))try{var r=t.lastRenderedState,o=a(r,n);if(s.hasEagerState=!0,s.eagerState=o,Qn(o,r))return Ou(e,t,s,0),ge===null&&Uu(),!1}catch{}if(n=Jp(e,t,s,i),n!==null)return In(n,e,i),zx(n,t,i),!0}return!1}function gm(e,t,n,i){if(i={lane:2,revertLane:Tm(),gesture:null,action:i,hasEagerState:!1,eagerState:null,next:null},Fu(e)){if(t)throw Error($(479))}else t=Jp(e,n,i,2),t!==null&&In(t,e,2)}function Fu(e){var t=e.alternate;return e===zt||t!==null&&t===zt}function Bx(e,t){Or=fu=!0;var n=e.pending;n===null?t.next=t:(t.next=n.next,n.next=t),e.pending=t}function zx(e,t,n){if((n&4194048)!==0){var i=t.lanes;i&=e.pendingLanes,n|=i,t.lanes=n,Mv(e,n)}}var dl={readContext:dn,use:Bu,useCallback:Oe,useContext:Oe,useEffect:Oe,useImperativeHandle:Oe,useLayoutEffect:Oe,useInsertionEffect:Oe,useMemo:Oe,useReducer:Oe,useRef:Oe,useState:Oe,useDebugValue:Oe,useDeferredValue:Oe,useTransition:Oe,useSyncExternalStore:Oe,useId:Oe,useHostTransitionStatus:Oe,useFormState:Oe,useActionState:Oe,useOptimistic:Oe,useMemoCache:Oe,useCacheRefresh:Oe};dl.useEffectEvent=Oe;var Fx={readContext:dn,use:Bu,useCallback:function(e,t){return wn().memoizedState=[e,t===void 0?null:t],e},useContext:dn,useEffect:by,useImperativeHandle:function(e,t,n){n=n!=null?n.concat([e]):null,qc(4194308,4,Ax.bind(null,t,e),n)},useLayoutEffect:function(e,t){return qc(4194308,4,e,t)},useInsertionEffect:function(e,t){qc(4,2,e,t)},useMemo:function(e,t){var n=wn();t=t===void 0?null:t;var i=e();if(Ha){Gs(!0);try{e()}finally{Gs(!1)}}return n.memoizedState=[i,t],i},useReducer:function(e,t,n){var i=wn();if(n!==void 0){var s=n(t);if(Ha){Gs(!0);try{n(t)}finally{Gs(!1)}}}else s=t;return i.memoizedState=i.baseState=s,e={pending:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:s},i.queue=e,e=e.dispatch=nE.bind(null,zt,e),[i.memoizedState,e]},useRef:function(e){var t=wn();return e={current:e},t.memoizedState=e},useState:function(e){e=pp(e);var t=e.queue,n=Px.bind(null,zt,t);return t.dispatch=n,[e.memoizedState,n]},useDebugValue:dm,useDeferredValue:function(e,t){var n=wn();return pm(n,e,t)},useTransition:function(){var e=pp(!1);return e=Nx.bind(null,zt,e.queue,!0,!1),wn().memoizedState=e,[!1,e]},useSyncExternalStore:function(e,t,n){var i=zt,s=wn();if(jt){if(n===void 0)throw Error($(407));n=n()}else{if(n=t(),ge===null)throw Error($(349));(Jt&127)!==0||fx(i,t,n)}s.memoizedState=n;var a={value:n,getSnapshot:t};return s.queue=a,by(px.bind(null,i,a,e),[e]),i.flags|=2048,Hr(9,{destroy:void 0},dx.bind(null,i,a,n,t),null),n},useId:function(){var e=wn(),t=ge.identifierPrefix;if(jt){var n=Wi,i=Gi;n=(i&~(1<<32-Kn(i)-1)).toString(32)+n,t="_"+t+"R_"+n,n=du++,0<n&&(t+="H"+n.toString(32)),t+="_"}else n=K1++,t="_"+t+"r_"+n.toString(32)+"_";return e.memoizedState=t},useHostTransitionStatus:mm,useFormState:xy,useActionState:xy,useOptimistic:function(e){var t=wn();t.memoizedState=t.baseState=e;var n={pending:null,lanes:0,dispatch:null,lastRenderedReducer:null,lastRenderedState:null};return t.queue=n,t=gm.bind(null,zt,!0,n),n.dispatch=t,[e,t]},useMemoCache:um,useCacheRefresh:function(){return wn().memoizedState=eE.bind(null,zt)},useEffectEvent:function(e){var t=wn(),n={impl:e};return t.memoizedState=n,function(){if((se&2)!==0)throw Error($(440));return n.impl.apply(void 0,arguments)}}},ym={readContext:dn,use:Bu,useCallback:Cx,useContext:dn,useEffect:fm,useImperativeHandle:wx,useInsertionEffect:Ex,useLayoutEffect:Tx,useMemo:Rx,useReducer:Xc,useRef:bx,useState:function(){return Xc(_s)},useDebugValue:dm,useDeferredValue:function(e,t){var n=Ve();return Dx(n,pe.memoizedState,e,t)},useTransition:function(){var e=Xc(_s)[0],t=Ve().memoizedState;return[typeof e=="boolean"?e:Al(e),t]},useSyncExternalStore:hx,useId:Ox,useHostTransitionStatus:mm,useFormState:_y,useActionState:_y,useOptimistic:function(e,t){var n=Ve();return yx(n,pe,e,t)},useMemoCache:um,useCacheRefresh:Ix};ym.useEffectEvent=Mx;var Vx={readContext:dn,use:Bu,useCallback:Cx,useContext:dn,useEffect:fm,useImperativeHandle:wx,useInsertionEffect:Ex,useLayoutEffect:Tx,useMemo:Rx,useReducer:Ed,useRef:bx,useState:function(){return Ed(_s)},useDebugValue:dm,useDeferredValue:function(e,t){var n=Ve();return pe===null?pm(n,e,t):Dx(n,pe.memoizedState,e,t)},useTransition:function(){var e=Ed(_s)[0],t=Ve().memoizedState;return[typeof e=="boolean"?e:Al(e),t]},useSyncExternalStore:hx,useId:Ox,useHostTransitionStatus:mm,useFormState:Sy,useActionState:Sy,useOptimistic:function(e,t){var n=Ve();return pe!==null?yx(n,pe,e,t):(n.baseState=e,[e,n.queue.dispatch])},useMemoCache:um,useCacheRefresh:Ix};Vx.useEffectEvent=Mx;function Td(e,t,n,i){t=e.memoizedState,n=n(i,t),n=n==null?t:Te({},t,n),e.memoizedState=n,e.lanes===0&&(e.updateQueue.baseState=n)}var yp={enqueueSetState:function(e,t,n){e=e._reactInternals;var i=Jn(),s=Js(i);s.payload=t,n!=null&&(s.callback=n),t=Qs(e,s,i),t!==null&&(In(t,e,i),Jo(t,e,i))},enqueueReplaceState:function(e,t,n){e=e._reactInternals;var i=Jn(),s=Js(i);s.tag=1,s.payload=t,n!=null&&(s.callback=n),t=Qs(e,s,i),t!==null&&(In(t,e,i),Jo(t,e,i))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var n=Jn(),i=Js(n);i.tag=2,t!=null&&(i.callback=t),t=Qs(e,i,n),t!==null&&(In(t,e,n),Jo(t,e,n))}};function My(e,t,n,i,s,a,r){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(i,a,r):t.prototype&&t.prototype.isPureReactComponent?!ll(n,i)||!ll(s,a):!0}function Ey(e,t,n,i){e=t.state,typeof t.componentWillReceiveProps=="function"&&t.componentWillReceiveProps(n,i),typeof t.UNSAFE_componentWillReceiveProps=="function"&&t.UNSAFE_componentWillReceiveProps(n,i),t.state!==e&&yp.enqueueReplaceState(t,t.state,null)}function ka(e,t){var n=t;if("ref"in t){n={};for(var i in t)i!=="ref"&&(n[i]=t[i])}if(e=e.defaultProps){n===t&&(n=Te({},n));for(var s in e)n[s]===void 0&&(n[s]=e[s])}return n}function Hx(e){au(e)}function kx(e){console.error(e)}function Gx(e){au(e)}function pu(e,t){try{var n=e.onUncaughtError;n(t.value,{componentStack:t.stack})}catch(i){setTimeout(function(){throw i})}}function Ty(e,t,n){try{var i=e.onCaughtError;i(n.value,{componentStack:n.stack,errorBoundary:t.tag===1?t.stateNode:null})}catch(s){setTimeout(function(){throw s})}}function vp(e,t,n){return n=Js(n),n.tag=3,n.payload={element:null},n.callback=function(){pu(e,t)},n}function Wx(e){return e=Js(e),e.tag=3,e}function Xx(e,t,n,i){var s=n.type.getDerivedStateFromError;if(typeof s=="function"){var a=i.value;e.payload=function(){return s(a)},e.callback=function(){Ty(t,n,i)}}var r=n.stateNode;r!==null&&typeof r.componentDidCatch=="function"&&(e.callback=function(){Ty(t,n,i),typeof s!="function"&&(js===null?js=new Set([this]):js.add(this));var o=i.stack;this.componentDidCatch(i.value,{componentStack:o!==null?o:""})})}function iE(e,t,n,i,s){if(n.flags|=32768,i!==null&&typeof i=="object"&&typeof i.then=="function"){if(t=n.alternate,t!==null&&Kr(t,n,s,!0),n=jn.current,n!==null){switch(n.tag){case 31:case 13:return di===null?xu():n.alternate===null&&Ie===0&&(Ie=3),n.flags&=-257,n.flags|=65536,n.lanes=s,i===cu?n.flags|=16384:(t=n.updateQueue,t===null?n.updateQueue=new Set([i]):t.add(i),Pd(e,i,s)),!1;case 22:return n.flags|=65536,i===cu?n.flags|=16384:(t=n.updateQueue,t===null?(t={transitions:null,markerInstances:null,retryQueue:new Set([i])},n.updateQueue=t):(n=t.retryQueue,n===null?t.retryQueue=new Set([i]):n.add(i)),Pd(e,i,s)),!1}throw Error($(435,n.tag))}return Pd(e,i,s),xu(),!1}if(jt)return t=jn.current,t!==null?((t.flags&65536)===0&&(t.flags|=256),t.flags|=65536,t.lanes=s,i!==ap&&(e=Error($(422),{cause:i}),ul(hi(e,n)))):(i!==ap&&(t=Error($(423),{cause:i}),ul(hi(t,n))),e=e.current.alternate,e.flags|=65536,s&=-s,e.lanes|=s,i=hi(i,n),s=vp(e.stateNode,i,s),Md(e,s),Ie!==4&&(Ie=2)),!1;var a=Error($(520),{cause:i});if(a=hi(a,n),nl===null?nl=[a]:nl.push(a),Ie!==4&&(Ie=2),t===null)return!0;i=hi(i,n),n=t;do{switch(n.tag){case 3:return n.flags|=65536,e=s&-s,n.lanes|=e,e=vp(n.stateNode,i,e),Md(n,e),!1;case 1:if(t=n.type,a=n.stateNode,(n.flags&128)===0&&(typeof t.getDerivedStateFromError=="function"||a!==null&&typeof a.componentDidCatch=="function"&&(js===null||!js.has(a))))return n.flags|=65536,s&=-s,n.lanes|=s,s=Wx(s),Xx(s,e,n,i),Md(n,s),!1}n=n.return}while(n!==null);return!1}var vm=Error($(461)),Ze=!1;function un(e,t,n,i){t.child=e===null?ax(t,null,n,i):Va(t,e.child,n,i)}function Ay(e,t,n,i,s){n=n.render;var a=t.ref;if("ref"in i){var r={};for(var o in i)o!=="ref"&&(r[o]=i[o])}else r=i;return Fa(t),i=rm(e,t,n,r,a,s),o=om(),e!==null&&!Ze?(lm(e,t,s),Ss(e,t,s)):(jt&&o&&jp(t),t.flags|=1,un(e,t,i,s),t.child)}function wy(e,t,n,i,s){if(e===null){var a=n.type;return typeof a=="function"&&!Qp(a)&&a.defaultProps===void 0&&n.compare===null?(t.tag=15,t.type=a,qx(e,t,a,i,s)):(e=Gc(n.type,null,i,t,t.mode,s),e.ref=t.ref,e.return=t,t.child=e)}if(a=e.child,!xm(e,s)){var r=a.memoizedProps;if(n=n.compare,n=n!==null?n:ll,n(r,i)&&e.ref===t.ref)return Ss(e,t,s)}return t.flags|=1,e=ms(a,i),e.ref=t.ref,e.return=t,t.child=e}function qx(e,t,n,i,s){if(e!==null){var a=e.memoizedProps;if(ll(a,i)&&e.ref===t.ref)if(Ze=!1,t.pendingProps=i=a,xm(e,s))(e.flags&131072)!==0&&(Ze=!0);else return t.lanes=e.lanes,Ss(e,t,s)}return xp(e,t,n,i,s)}function Yx(e,t,n,i){var s=i.children,a=e!==null?e.memoizedState:null;if(e===null&&t.stateNode===null&&(t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),i.mode==="hidden"){if((t.flags&128)!==0){if(a=a!==null?a.baseLanes|n:n,e!==null){for(i=t.child=e.child,s=0;i!==null;)s=s|i.lanes|i.childLanes,i=i.sibling;i=s&~a}else i=0,t.child=null;return Cy(e,t,a,n,i)}if((n&536870912)!==0)t.memoizedState={baseLanes:0,cachePool:null},e!==null&&Wc(t,a!==null?a.cachePool:null),a!==null?gy(t,a):fp(),lx(t);else return i=t.lanes=536870912,Cy(e,t,a!==null?a.baseLanes|n:n,n,i)}else a!==null?(Wc(t,a.cachePool),gy(t,a),Hs(t),t.memoizedState=null):(e!==null&&Wc(t,null),fp(),Hs(t));return un(e,t,s,n),t.child}function Wo(e,t){return e!==null&&e.tag===22||t.stateNode!==null||(t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),t.sibling}function Cy(e,t,n,i,s){var a=em();return a=a===null?null:{parent:Ye._currentValue,pool:a},t.memoizedState={baseLanes:n,cachePool:a},e!==null&&Wc(t,null),fp(),lx(t),e!==null&&Kr(e,t,i,!0),t.childLanes=s,null}function Yc(e,t){return t=mu({mode:t.mode,children:t.children},e.mode),t.ref=e.ref,e.child=t,t.return=e,t}function Ry(e,t,n){return Va(t,e.child,null,n),e=Yc(t,t.pendingProps),e.flags|=2,Wn(t),t.memoizedState=null,e}function sE(e,t,n){var i=t.pendingProps,s=(t.flags&128)!==0;if(t.flags&=-129,e===null){if(jt){if(i.mode==="hidden")return e=Yc(t,i),t.lanes=536870912,Wo(null,e);if(dp(t),(e=Ee)?(e=F_(e,fi),e=e!==null&&e.data==="&"?e:null,e!==null&&(t.memoizedState={dehydrated:e,treeContext:ia!==null?{id:Gi,overflow:Wi}:null,retryLane:536870912,hydrationErrors:null},n=jv(e),n.return=t,t.child=n,fn=t,Ee=null)):e=null,e===null)throw sa(t);return t.lanes=536870912,null}return Yc(t,i)}var a=e.memoizedState;if(a!==null){var r=a.dehydrated;if(dp(t),s)if(t.flags&256)t.flags&=-257,t=Ry(e,t,n);else if(t.memoizedState!==null)t.child=e.child,t.flags|=128,t=null;else throw Error($(558));else if(Ze||Kr(e,t,n,!1),s=(n&e.childLanes)!==0,Ze||s){if(i=ge,i!==null&&(r=Ev(i,n),r!==0&&r!==a.retryLane))throw a.retryLane=r,qa(e,r),In(i,e,r),vm;xu(),t=Ry(e,t,n)}else e=a.treeContext,Ee=pi(r.nextSibling),fn=t,jt=!0,Ks=null,fi=!1,e!==null&&tx(t,e),t=Yc(t,i),t.flags|=4096;return t}return e=ms(e.child,{mode:i.mode,children:i.children}),e.ref=t.ref,t.child=e,e.return=t,e}function Zc(e,t){var n=t.ref;if(n===null)e!==null&&e.ref!==null&&(t.flags|=4194816);else{if(typeof n!="function"&&typeof n!="object")throw Error($(284));(e===null||e.ref!==n)&&(t.flags|=4194816)}}function xp(e,t,n,i,s){return Fa(t),n=rm(e,t,n,i,void 0,s),i=om(),e!==null&&!Ze?(lm(e,t,s),Ss(e,t,s)):(jt&&i&&jp(t),t.flags|=1,un(e,t,n,s),t.child)}function Dy(e,t,n,i,s,a){return Fa(t),t.updateQueue=null,n=ux(t,i,n,s),cx(e),i=om(),e!==null&&!Ze?(lm(e,t,a),Ss(e,t,a)):(jt&&i&&jp(t),t.flags|=1,un(e,t,n,a),t.child)}function Ny(e,t,n,i,s){if(Fa(t),t.stateNode===null){var a=Tr,r=n.contextType;typeof r=="object"&&r!==null&&(a=dn(r)),a=new n(i,a),t.memoizedState=a.state!==null&&a.state!==void 0?a.state:null,a.updater=yp,t.stateNode=a,a._reactInternals=t,a=t.stateNode,a.props=i,a.state=t.memoizedState,a.refs={},im(t),r=n.contextType,a.context=typeof r=="object"&&r!==null?dn(r):Tr,a.state=t.memoizedState,r=n.getDerivedStateFromProps,typeof r=="function"&&(Td(t,n,r,i),a.state=t.memoizedState),typeof n.getDerivedStateFromProps=="function"||typeof a.getSnapshotBeforeUpdate=="function"||typeof a.UNSAFE_componentWillMount!="function"&&typeof a.componentWillMount!="function"||(r=a.state,typeof a.componentWillMount=="function"&&a.componentWillMount(),typeof a.UNSAFE_componentWillMount=="function"&&a.UNSAFE_componentWillMount(),r!==a.state&&yp.enqueueReplaceState(a,a.state,null),jo(t,i,a,s),Qo(),a.state=t.memoizedState),typeof a.componentDidMount=="function"&&(t.flags|=4194308),i=!0}else if(e===null){a=t.stateNode;var o=t.memoizedProps,l=ka(n,o);a.props=l;var c=a.context,u=n.contextType;r=Tr,typeof u=="object"&&u!==null&&(r=dn(u));var p=n.getDerivedStateFromProps;u=typeof p=="function"||typeof a.getSnapshotBeforeUpdate=="function",o=t.pendingProps!==o,u||typeof a.UNSAFE_componentWillReceiveProps!="function"&&typeof a.componentWillReceiveProps!="function"||(o||c!==r)&&Ey(t,a,i,r),zs=!1;var h=t.memoizedState;a.state=h,jo(t,i,a,s),Qo(),c=t.memoizedState,o||h!==c||zs?(typeof p=="function"&&(Td(t,n,p,i),c=t.memoizedState),(l=zs||My(t,n,l,i,h,c,r))?(u||typeof a.UNSAFE_componentWillMount!="function"&&typeof a.componentWillMount!="function"||(typeof a.componentWillMount=="function"&&a.componentWillMount(),typeof a.UNSAFE_componentWillMount=="function"&&a.UNSAFE_componentWillMount()),typeof a.componentDidMount=="function"&&(t.flags|=4194308)):(typeof a.componentDidMount=="function"&&(t.flags|=4194308),t.memoizedProps=i,t.memoizedState=c),a.props=i,a.state=c,a.context=r,i=l):(typeof a.componentDidMount=="function"&&(t.flags|=4194308),i=!1)}else{a=t.stateNode,up(e,t),r=t.memoizedProps,u=ka(n,r),a.props=u,p=t.pendingProps,h=a.context,c=n.contextType,l=Tr,typeof c=="object"&&c!==null&&(l=dn(c)),o=n.getDerivedStateFromProps,(c=typeof o=="function"||typeof a.getSnapshotBeforeUpdate=="function")||typeof a.UNSAFE_componentWillReceiveProps!="function"&&typeof a.componentWillReceiveProps!="function"||(r!==p||h!==l)&&Ey(t,a,i,l),zs=!1,h=t.memoizedState,a.state=h,jo(t,i,a,s),Qo();var d=t.memoizedState;r!==p||h!==d||zs||e!==null&&e.dependencies!==null&&lu(e.dependencies)?(typeof o=="function"&&(Td(t,n,o,i),d=t.memoizedState),(u=zs||My(t,n,u,i,h,d,l)||e!==null&&e.dependencies!==null&&lu(e.dependencies))?(c||typeof a.UNSAFE_componentWillUpdate!="function"&&typeof a.componentWillUpdate!="function"||(typeof a.componentWillUpdate=="function"&&a.componentWillUpdate(i,d,l),typeof a.UNSAFE_componentWillUpdate=="function"&&a.UNSAFE_componentWillUpdate(i,d,l)),typeof a.componentDidUpdate=="function"&&(t.flags|=4),typeof a.getSnapshotBeforeUpdate=="function"&&(t.flags|=1024)):(typeof a.componentDidUpdate!="function"||r===e.memoizedProps&&h===e.memoizedState||(t.flags|=4),typeof a.getSnapshotBeforeUpdate!="function"||r===e.memoizedProps&&h===e.memoizedState||(t.flags|=1024),t.memoizedProps=i,t.memoizedState=d),a.props=i,a.state=d,a.context=l,i=u):(typeof a.componentDidUpdate!="function"||r===e.memoizedProps&&h===e.memoizedState||(t.flags|=4),typeof a.getSnapshotBeforeUpdate!="function"||r===e.memoizedProps&&h===e.memoizedState||(t.flags|=1024),i=!1)}return a=i,Zc(e,t),i=(t.flags&128)!==0,a||i?(a=t.stateNode,n=i&&typeof n.getDerivedStateFromError!="function"?null:a.render(),t.flags|=1,e!==null&&i?(t.child=Va(t,e.child,null,s),t.child=Va(t,null,n,s)):un(e,t,n,s),t.memoizedState=a.state,e=t.child):e=Ss(e,t,s),e}function Ly(e,t,n,i){return za(),t.flags|=256,un(e,t,n,i),t.child}var Ad={dehydrated:null,treeContext:null,retryLane:0,hydrationErrors:null};function wd(e){return{baseLanes:e,cachePool:nx()}}function Cd(e,t,n){return e=e!==null?e.childLanes&~n:0,t&&(e|=qn),e}function Zx(e,t,n){var i=t.pendingProps,s=!1,a=(t.flags&128)!==0,r;if((r=a)||(r=e!==null&&e.memoizedState===null?!1:(Fe.current&2)!==0),r&&(s=!0,t.flags&=-129),r=(t.flags&32)!==0,t.flags&=-33,e===null){if(jt){if(s?Vs(t):Hs(t),(e=Ee)?(e=F_(e,fi),e=e!==null&&e.data!=="&"?e:null,e!==null&&(t.memoizedState={dehydrated:e,treeContext:ia!==null?{id:Gi,overflow:Wi}:null,retryLane:536870912,hydrationErrors:null},n=jv(e),n.return=t,t.child=n,fn=t,Ee=null)):e=null,e===null)throw sa(t);return Up(e)?t.lanes=32:t.lanes=536870912,null}var o=i.children;return i=i.fallback,s?(Hs(t),s=t.mode,o=mu({mode:"hidden",children:o},s),i=Oa(i,s,n,null),o.return=t,i.return=t,o.sibling=i,t.child=o,i=t.child,i.memoizedState=wd(n),i.childLanes=Cd(e,r,n),t.memoizedState=Ad,Wo(null,i)):(Vs(t),_p(t,o))}var l=e.memoizedState;if(l!==null&&(o=l.dehydrated,o!==null)){if(a)t.flags&256?(Vs(t),t.flags&=-257,t=Rd(e,t,n)):t.memoizedState!==null?(Hs(t),t.child=e.child,t.flags|=128,t=null):(Hs(t),o=i.fallback,s=t.mode,i=mu({mode:"visible",children:i.children},s),o=Oa(o,s,n,null),o.flags|=2,i.return=t,o.return=t,i.sibling=o,t.child=i,Va(t,e.child,null,n),i=t.child,i.memoizedState=wd(n),i.childLanes=Cd(e,r,n),t.memoizedState=Ad,t=Wo(null,i));else if(Vs(t),Up(o)){if(r=o.nextSibling&&o.nextSibling.dataset,r)var c=r.dgst;r=c,i=Error($(419)),i.stack="",i.digest=r,ul({value:i,source:null,stack:null}),t=Rd(e,t,n)}else if(Ze||Kr(e,t,n,!1),r=(n&e.childLanes)!==0,Ze||r){if(r=ge,r!==null&&(i=Ev(r,n),i!==0&&i!==l.retryLane))throw l.retryLane=i,qa(e,i),In(r,e,i),vm;Lp(o)||xu(),t=Rd(e,t,n)}else Lp(o)?(t.flags|=192,t.child=e.child,t=null):(e=l.treeContext,Ee=pi(o.nextSibling),fn=t,jt=!0,Ks=null,fi=!1,e!==null&&tx(t,e),t=_p(t,i.children),t.flags|=4096);return t}return s?(Hs(t),o=i.fallback,s=t.mode,l=e.child,c=l.sibling,i=ms(l,{mode:"hidden",children:i.children}),i.subtreeFlags=l.subtreeFlags&65011712,c!==null?o=ms(c,o):(o=Oa(o,s,n,null),o.flags|=2),o.return=t,i.return=t,i.sibling=o,t.child=i,Wo(null,i),i=t.child,o=e.child.memoizedState,o===null?o=wd(n):(s=o.cachePool,s!==null?(l=Ye._currentValue,s=s.parent!==l?{parent:l,pool:l}:s):s=nx(),o={baseLanes:o.baseLanes|n,cachePool:s}),i.memoizedState=o,i.childLanes=Cd(e,r,n),t.memoizedState=Ad,Wo(e.child,i)):(Vs(t),n=e.child,e=n.sibling,n=ms(n,{mode:"visible",children:i.children}),n.return=t,n.sibling=null,e!==null&&(r=t.deletions,r===null?(t.deletions=[e],t.flags|=16):r.push(e)),t.child=n,t.memoizedState=null,n)}function _p(e,t){return t=mu({mode:"visible",children:t},e.mode),t.return=e,e.child=t}function mu(e,t){return e=Xn(22,e,null,t),e.lanes=0,e}function Rd(e,t,n){return Va(t,e.child,null,n),e=_p(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function Uy(e,t,n){e.lanes|=t;var i=e.alternate;i!==null&&(i.lanes|=t),op(e.return,t,n)}function Dd(e,t,n,i,s,a){var r=e.memoizedState;r===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:i,tail:n,tailMode:s,treeForkCount:a}:(r.isBackwards=t,r.rendering=null,r.renderingStartTime=0,r.last=i,r.tail=n,r.tailMode=s,r.treeForkCount=a)}function Kx(e,t,n){var i=t.pendingProps,s=i.revealOrder,a=i.tail;i=i.children;var r=Fe.current,o=(r&2)!==0;if(o?(r=r&1|2,t.flags|=128):r&=1,_e(Fe,r),un(e,t,i,n),i=jt?cl:0,!o&&e!==null&&(e.flags&128)!==0)t:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&Uy(e,n,t);else if(e.tag===19)Uy(e,n,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break t;for(;e.sibling===null;){if(e.return===null||e.return===t)break t;e=e.return}e.sibling.return=e.return,e=e.sibling}switch(s){case"forwards":for(n=t.child,s=null;n!==null;)e=n.alternate,e!==null&&hu(e)===null&&(s=n),n=n.sibling;n=s,n===null?(s=t.child,t.child=null):(s=n.sibling,n.sibling=null),Dd(t,!1,s,n,a,i);break;case"backwards":case"unstable_legacy-backwards":for(n=null,s=t.child,t.child=null;s!==null;){if(e=s.alternate,e!==null&&hu(e)===null){t.child=s;break}e=s.sibling,s.sibling=n,n=s,s=e}Dd(t,!0,n,null,a,i);break;case"together":Dd(t,!1,null,null,void 0,i);break;default:t.memoizedState=null}return t.child}function Ss(e,t,n){if(e!==null&&(t.dependencies=e.dependencies),ra|=t.lanes,(n&t.childLanes)===0)if(e!==null){if(Kr(e,t,n,!1),(n&t.childLanes)===0)return null}else return null;if(e!==null&&t.child!==e.child)throw Error($(153));if(t.child!==null){for(e=t.child,n=ms(e,e.pendingProps),t.child=n,n.return=t;e.sibling!==null;)e=e.sibling,n=n.sibling=ms(e,e.pendingProps),n.return=t;n.sibling=null}return t.child}function xm(e,t){return(e.lanes&t)!==0?!0:(e=e.dependencies,!!(e!==null&&lu(e)))}function aE(e,t,n){switch(t.tag){case 3:eu(t,t.stateNode.containerInfo),Fs(t,Ye,e.memoizedState.cache),za();break;case 27:case 5:Zd(t);break;case 4:eu(t,t.stateNode.containerInfo);break;case 10:Fs(t,t.type,t.memoizedProps.value);break;case 31:if(t.memoizedState!==null)return t.flags|=128,dp(t),null;break;case 13:var i=t.memoizedState;if(i!==null)return i.dehydrated!==null?(Vs(t),t.flags|=128,null):(n&t.child.childLanes)!==0?Zx(e,t,n):(Vs(t),e=Ss(e,t,n),e!==null?e.sibling:null);Vs(t);break;case 19:var s=(e.flags&128)!==0;if(i=(n&t.childLanes)!==0,i||(Kr(e,t,n,!1),i=(n&t.childLanes)!==0),s){if(i)return Kx(e,t,n);t.flags|=128}if(s=t.memoizedState,s!==null&&(s.rendering=null,s.tail=null,s.lastEffect=null),_e(Fe,Fe.current),i)break;return null;case 22:return t.lanes=0,Yx(e,t,n,t.pendingProps);case 24:Fs(t,Ye,e.memoizedState.cache)}return Ss(e,t,n)}function Jx(e,t,n){if(e!==null)if(e.memoizedProps!==t.pendingProps)Ze=!0;else{if(!xm(e,n)&&(t.flags&128)===0)return Ze=!1,aE(e,t,n);Ze=(e.flags&131072)!==0}else Ze=!1,jt&&(t.flags&1048576)!==0&&$v(t,cl,t.index);switch(t.lanes=0,t.tag){case 16:t:{var i=t.pendingProps;if(e=Na(t.elementType),t.type=e,typeof e=="function")Qp(e)?(i=ka(e,i),t.tag=1,t=Ny(null,t,e,i,n)):(t.tag=0,t=xp(null,t,e,i,n));else{if(e!=null){var s=e.$$typeof;if(s===Bp){t.tag=11,t=Ay(null,t,e,i,n);break t}else if(s===zp){t.tag=14,t=wy(null,t,e,i,n);break t}}throw t=qd(e)||e,Error($(306,t,""))}}return t;case 0:return xp(e,t,t.type,t.pendingProps,n);case 1:return i=t.type,s=ka(i,t.pendingProps),Ny(e,t,i,s,n);case 3:t:{if(eu(t,t.stateNode.containerInfo),e===null)throw Error($(387));i=t.pendingProps;var a=t.memoizedState;s=a.element,up(e,t),jo(t,i,null,n);var r=t.memoizedState;if(i=r.cache,Fs(t,Ye,i),i!==a.cache&&lp(t,[Ye],n,!0),Qo(),i=r.element,a.isDehydrated)if(a={element:i,isDehydrated:!1,cache:r.cache},t.updateQueue.baseState=a,t.memoizedState=a,t.flags&256){t=Ly(e,t,i,n);break t}else if(i!==s){s=hi(Error($(424)),t),ul(s),t=Ly(e,t,i,n);break t}else for(e=t.stateNode.containerInfo,e.nodeType===9?e=e.body:e=e.nodeName==="HTML"?e.ownerDocument.body:e,Ee=pi(e.firstChild),fn=t,jt=!0,Ks=null,fi=!0,n=ax(t,null,i,n),t.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if(za(),i===s){t=Ss(e,t,n);break t}un(e,t,i,n)}t=t.child}return t;case 26:return Zc(e,t),e===null?(n=ev(t.type,null,t.pendingProps,null))?t.memoizedState=n:jt||(n=t.type,e=t.pendingProps,i=Mu(Zs.current).createElement(n),i[hn]=t,i[Pn]=e,pn(i,n,e),rn(i),t.stateNode=i):t.memoizedState=ev(t.type,e.memoizedProps,t.pendingProps,e.memoizedState),null;case 27:return Zd(t),e===null&&jt&&(i=t.stateNode=V_(t.type,t.pendingProps,Zs.current),fn=t,fi=!0,s=Ee,la(t.type)?(Op=s,Ee=pi(i.firstChild)):Ee=s),un(e,t,t.pendingProps.children,n),Zc(e,t),e===null&&(t.flags|=4194304),t.child;case 5:return e===null&&jt&&((s=i=Ee)&&(i=UE(i,t.type,t.pendingProps,fi),i!==null?(t.stateNode=i,fn=t,Ee=pi(i.firstChild),fi=!1,s=!0):s=!1),s||sa(t)),Zd(t),s=t.type,a=t.pendingProps,r=e!==null?e.memoizedProps:null,i=a.children,Dp(s,a)?i=null:r!==null&&Dp(s,r)&&(t.flags|=32),t.memoizedState!==null&&(s=rm(e,t,J1,null,null,n),gl._currentValue=s),Zc(e,t),un(e,t,i,n),t.child;case 6:return e===null&&jt&&((e=n=Ee)&&(n=OE(n,t.pendingProps,fi),n!==null?(t.stateNode=n,fn=t,Ee=null,e=!0):e=!1),e||sa(t)),null;case 13:return Zx(e,t,n);case 4:return eu(t,t.stateNode.containerInfo),i=t.pendingProps,e===null?t.child=Va(t,null,i,n):un(e,t,i,n),t.child;case 11:return Ay(e,t,t.type,t.pendingProps,n);case 7:return un(e,t,t.pendingProps,n),t.child;case 8:return un(e,t,t.pendingProps.children,n),t.child;case 12:return un(e,t,t.pendingProps.children,n),t.child;case 10:return i=t.pendingProps,Fs(t,t.type,i.value),un(e,t,i.children,n),t.child;case 9:return s=t.type._context,i=t.pendingProps.children,Fa(t),s=dn(s),i=i(s),t.flags|=1,un(e,t,i,n),t.child;case 14:return wy(e,t,t.type,t.pendingProps,n);case 15:return qx(e,t,t.type,t.pendingProps,n);case 19:return Kx(e,t,n);case 31:return sE(e,t,n);case 22:return Yx(e,t,n,t.pendingProps);case 24:return Fa(t),i=dn(Ye),e===null?(s=em(),s===null&&(s=ge,a=tm(),s.pooledCache=a,a.refCount++,a!==null&&(s.pooledCacheLanes|=n),s=a),t.memoizedState={parent:i,cache:s},im(t),Fs(t,Ye,s)):((e.lanes&n)!==0&&(up(e,t),jo(t,null,null,n),Qo()),s=e.memoizedState,a=t.memoizedState,s.parent!==i?(s={parent:i,cache:i},t.memoizedState=s,t.lanes===0&&(t.memoizedState=t.updateQueue.baseState=s),Fs(t,Ye,i)):(i=a.cache,Fs(t,Ye,i),i!==s.cache&&lp(t,[Ye],n,!0))),un(e,t,t.pendingProps.children,n),t.child;case 29:throw t.pendingProps}throw Error($(156,t.tag))}function rs(e){e.flags|=4}function Nd(e,t,n,i,s){if((t=(e.mode&32)!==0)&&(t=!1),t){if(e.flags|=16777216,(s&335544128)===s)if(e.stateNode.complete)e.flags|=8192;else if(__())e.flags|=8192;else throw Pa=cu,nm}else e.flags&=-16777217}function Oy(e,t){if(t.type!=="stylesheet"||(t.state.loading&4)!==0)e.flags&=-16777217;else if(e.flags|=16777216,!G_(t))if(__())e.flags|=8192;else throw Pa=cu,nm}function Lc(e,t){t!==null&&(e.flags|=4),e.flags&16384&&(t=e.tag!==22?Sv():536870912,e.lanes|=t,kr|=t)}function Bo(e,t){if(!jt)switch(e.tailMode){case"hidden":t=e.tail;for(var n=null;t!==null;)t.alternate!==null&&(n=t),t=t.sibling;n===null?e.tail=null:n.sibling=null;break;case"collapsed":n=e.tail;for(var i=null;n!==null;)n.alternate!==null&&(i=n),n=n.sibling;i===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:i.sibling=null}}function Me(e){var t=e.alternate!==null&&e.alternate.child===e.child,n=0,i=0;if(t)for(var s=e.child;s!==null;)n|=s.lanes|s.childLanes,i|=s.subtreeFlags&65011712,i|=s.flags&65011712,s.return=e,s=s.sibling;else for(s=e.child;s!==null;)n|=s.lanes|s.childLanes,i|=s.subtreeFlags,i|=s.flags,s.return=e,s=s.sibling;return e.subtreeFlags|=i,e.childLanes=n,t}function rE(e,t,n){var i=t.pendingProps;switch($p(t),t.tag){case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Me(t),null;case 1:return Me(t),null;case 3:return n=t.stateNode,i=null,e!==null&&(i=e.memoizedState.cache),t.memoizedState.cache!==i&&(t.flags|=2048),gs(Ye),Pr(),n.pendingContext&&(n.context=n.pendingContext,n.pendingContext=null),(e===null||e.child===null)&&(dr(t)?rs(t):e===null||e.memoizedState.isDehydrated&&(t.flags&256)===0||(t.flags|=1024,bd())),Me(t),null;case 26:var s=t.type,a=t.memoizedState;return e===null?(rs(t),a!==null?(Me(t),Oy(t,a)):(Me(t),Nd(t,s,null,i,n))):a?a!==e.memoizedState?(rs(t),Me(t),Oy(t,a)):(Me(t),t.flags&=-16777217):(e=e.memoizedProps,e!==i&&rs(t),Me(t),Nd(t,s,e,i,n)),null;case 27:if(nu(t),n=Zs.current,s=t.type,e!==null&&t.stateNode!=null)e.memoizedProps!==i&&rs(t);else{if(!i){if(t.stateNode===null)throw Error($(166));return Me(t),null}e=qi.current,dr(t)?cy(t,e):(e=V_(s,i,n),t.stateNode=e,rs(t))}return Me(t),null;case 5:if(nu(t),s=t.type,e!==null&&t.stateNode!=null)e.memoizedProps!==i&&rs(t);else{if(!i){if(t.stateNode===null)throw Error($(166));return Me(t),null}if(a=qi.current,dr(t))cy(t,a);else{var r=Mu(Zs.current);switch(a){case 1:a=r.createElementNS("http://www.w3.org/2000/svg",s);break;case 2:a=r.createElementNS("http://www.w3.org/1998/Math/MathML",s);break;default:switch(s){case"svg":a=r.createElementNS("http://www.w3.org/2000/svg",s);break;case"math":a=r.createElementNS("http://www.w3.org/1998/Math/MathML",s);break;case"script":a=r.createElement("div"),a.innerHTML="<script><\/script>",a=a.removeChild(a.firstChild);break;case"select":a=typeof i.is=="string"?r.createElement("select",{is:i.is}):r.createElement("select"),i.multiple?a.multiple=!0:i.size&&(a.size=i.size);break;default:a=typeof i.is=="string"?r.createElement(s,{is:i.is}):r.createElement(s)}}a[hn]=t,a[Pn]=i;t:for(r=t.child;r!==null;){if(r.tag===5||r.tag===6)a.appendChild(r.stateNode);else if(r.tag!==4&&r.tag!==27&&r.child!==null){r.child.return=r,r=r.child;continue}if(r===t)break t;for(;r.sibling===null;){if(r.return===null||r.return===t)break t;r=r.return}r.sibling.return=r.return,r=r.sibling}t.stateNode=a;t:switch(pn(a,s,i),s){case"button":case"input":case"select":case"textarea":i=!!i.autoFocus;break t;case"img":i=!0;break t;default:i=!1}i&&rs(t)}}return Me(t),Nd(t,t.type,e===null?null:e.memoizedProps,t.pendingProps,n),null;case 6:if(e&&t.stateNode!=null)e.memoizedProps!==i&&rs(t);else{if(typeof i!="string"&&t.stateNode===null)throw Error($(166));if(e=Zs.current,dr(t)){if(e=t.stateNode,n=t.memoizedProps,i=null,s=fn,s!==null)switch(s.tag){case 27:case 5:i=s.memoizedProps}e[hn]=t,e=!!(e.nodeValue===n||i!==null&&i.suppressHydrationWarning===!0||P_(e.nodeValue,n)),e||sa(t,!0)}else e=Mu(e).createTextNode(i),e[hn]=t,t.stateNode=e}return Me(t),null;case 31:if(n=t.memoizedState,e===null||e.memoizedState!==null){if(i=dr(t),n!==null){if(e===null){if(!i)throw Error($(318));if(e=t.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error($(557));e[hn]=t}else za(),(t.flags&128)===0&&(t.memoizedState=null),t.flags|=4;Me(t),e=!1}else n=bd(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=n),e=!0;if(!e)return t.flags&256?(Wn(t),t):(Wn(t),null);if((t.flags&128)!==0)throw Error($(558))}return Me(t),null;case 13:if(i=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(s=dr(t),i!==null&&i.dehydrated!==null){if(e===null){if(!s)throw Error($(318));if(s=t.memoizedState,s=s!==null?s.dehydrated:null,!s)throw Error($(317));s[hn]=t}else za(),(t.flags&128)===0&&(t.memoizedState=null),t.flags|=4;Me(t),s=!1}else s=bd(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=s),s=!0;if(!s)return t.flags&256?(Wn(t),t):(Wn(t),null)}return Wn(t),(t.flags&128)!==0?(t.lanes=n,t):(n=i!==null,e=e!==null&&e.memoizedState!==null,n&&(i=t.child,s=null,i.alternate!==null&&i.alternate.memoizedState!==null&&i.alternate.memoizedState.cachePool!==null&&(s=i.alternate.memoizedState.cachePool.pool),a=null,i.memoizedState!==null&&i.memoizedState.cachePool!==null&&(a=i.memoizedState.cachePool.pool),a!==s&&(i.flags|=2048)),n!==e&&n&&(t.child.flags|=8192),Lc(t,t.updateQueue),Me(t),null);case 4:return Pr(),e===null&&Am(t.stateNode.containerInfo),Me(t),null;case 10:return gs(t.type),Me(t),null;case 19:if(on(Fe),i=t.memoizedState,i===null)return Me(t),null;if(s=(t.flags&128)!==0,a=i.rendering,a===null)if(s)Bo(i,!1);else{if(Ie!==0||e!==null&&(e.flags&128)!==0)for(e=t.child;e!==null;){if(a=hu(e),a!==null){for(t.flags|=128,Bo(i,!1),e=a.updateQueue,t.updateQueue=e,Lc(t,e),t.subtreeFlags=0,e=n,n=t.child;n!==null;)Qv(n,e),n=n.sibling;return _e(Fe,Fe.current&1|2),jt&&us(t,i.treeForkCount),t.child}e=e.sibling}i.tail!==null&&Yn()>yu&&(t.flags|=128,s=!0,Bo(i,!1),t.lanes=4194304)}else{if(!s)if(e=hu(a),e!==null){if(t.flags|=128,s=!0,e=e.updateQueue,t.updateQueue=e,Lc(t,e),Bo(i,!0),i.tail===null&&i.tailMode==="hidden"&&!a.alternate&&!jt)return Me(t),null}else 2*Yn()-i.renderingStartTime>yu&&n!==536870912&&(t.flags|=128,s=!0,Bo(i,!1),t.lanes=4194304);i.isBackwards?(a.sibling=t.child,t.child=a):(e=i.last,e!==null?e.sibling=a:t.child=a,i.last=a)}return i.tail!==null?(e=i.tail,i.rendering=e,i.tail=e.sibling,i.renderingStartTime=Yn(),e.sibling=null,n=Fe.current,_e(Fe,s?n&1|2:n&1),jt&&us(t,i.treeForkCount),e):(Me(t),null);case 22:case 23:return Wn(t),sm(),i=t.memoizedState!==null,e!==null?e.memoizedState!==null!==i&&(t.flags|=8192):i&&(t.flags|=8192),i?(n&536870912)!==0&&(t.flags&128)===0&&(Me(t),t.subtreeFlags&6&&(t.flags|=8192)):Me(t),n=t.updateQueue,n!==null&&Lc(t,n.retryQueue),n=null,e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(n=e.memoizedState.cachePool.pool),i=null,t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(i=t.memoizedState.cachePool.pool),i!==n&&(t.flags|=2048),e!==null&&on(Ia),null;case 24:return n=null,e!==null&&(n=e.memoizedState.cache),t.memoizedState.cache!==n&&(t.flags|=2048),gs(Ye),Me(t),null;case 25:return null;case 30:return null}throw Error($(156,t.tag))}function oE(e,t){switch($p(t),t.tag){case 1:return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return gs(Ye),Pr(),e=t.flags,(e&65536)!==0&&(e&128)===0?(t.flags=e&-65537|128,t):null;case 26:case 27:case 5:return nu(t),null;case 31:if(t.memoizedState!==null){if(Wn(t),t.alternate===null)throw Error($(340));za()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 13:if(Wn(t),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error($(340));za()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return on(Fe),null;case 4:return Pr(),null;case 10:return gs(t.type),null;case 22:case 23:return Wn(t),sm(),e!==null&&on(Ia),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 24:return gs(Ye),null;case 25:return null;default:return null}}function Qx(e,t){switch($p(t),t.tag){case 3:gs(Ye),Pr();break;case 26:case 27:case 5:nu(t);break;case 4:Pr();break;case 31:t.memoizedState!==null&&Wn(t);break;case 13:Wn(t);break;case 19:on(Fe);break;case 10:gs(t.type);break;case 22:case 23:Wn(t),sm(),e!==null&&on(Ia);break;case 24:gs(Ye)}}function wl(e,t){try{var n=t.updateQueue,i=n!==null?n.lastEffect:null;if(i!==null){var s=i.next;n=s;do{if((n.tag&e)===e){i=void 0;var a=n.create,r=n.inst;i=a(),r.destroy=i}n=n.next}while(n!==s)}}catch(o){he(t,t.return,o)}}function aa(e,t,n){try{var i=t.updateQueue,s=i!==null?i.lastEffect:null;if(s!==null){var a=s.next;i=a;do{if((i.tag&e)===e){var r=i.inst,o=r.destroy;if(o!==void 0){r.destroy=void 0,s=t;var l=n,c=o;try{c()}catch(u){he(s,l,u)}}}i=i.next}while(i!==a)}}catch(u){he(t,t.return,u)}}function jx(e){var t=e.updateQueue;if(t!==null){var n=e.stateNode;try{ox(t,n)}catch(i){he(e,e.return,i)}}}function $x(e,t,n){n.props=ka(e.type,e.memoizedProps),n.state=e.memoizedState;try{n.componentWillUnmount()}catch(i){he(e,t,i)}}function tl(e,t){try{var n=e.ref;if(n!==null){switch(e.tag){case 26:case 27:case 5:var i=e.stateNode;break;case 30:i=e.stateNode;break;default:i=e.stateNode}typeof n=="function"?e.refCleanup=n(i):n.current=i}}catch(s){he(e,t,s)}}function Xi(e,t){var n=e.ref,i=e.refCleanup;if(n!==null)if(typeof i=="function")try{i()}catch(s){he(e,t,s)}finally{e.refCleanup=null,e=e.alternate,e!=null&&(e.refCleanup=null)}else if(typeof n=="function")try{n(null)}catch(s){he(e,t,s)}else n.current=null}function t_(e){var t=e.type,n=e.memoizedProps,i=e.stateNode;try{t:switch(t){case"button":case"input":case"select":case"textarea":n.autoFocus&&i.focus();break t;case"img":n.src?i.src=n.src:n.srcSet&&(i.srcset=n.srcSet)}}catch(s){he(e,e.return,s)}}function Ld(e,t,n){try{var i=e.stateNode;wE(i,e.type,n,t),i[Pn]=t}catch(s){he(e,e.return,s)}}function e_(e){return e.tag===5||e.tag===3||e.tag===26||e.tag===27&&la(e.type)||e.tag===4}function Ud(e){t:for(;;){for(;e.sibling===null;){if(e.return===null||e_(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.tag===27&&la(e.type)||e.flags&2||e.child===null||e.tag===4)continue t;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function Sp(e,t,n){var i=e.tag;if(i===5||i===6)e=e.stateNode,t?(n.nodeType===9?n.body:n.nodeName==="HTML"?n.ownerDocument.body:n).insertBefore(e,t):(t=n.nodeType===9?n.body:n.nodeName==="HTML"?n.ownerDocument.body:n,t.appendChild(e),n=n._reactRootContainer,n!=null||t.onclick!==null||(t.onclick=ds));else if(i!==4&&(i===27&&la(e.type)&&(n=e.stateNode,t=null),e=e.child,e!==null))for(Sp(e,t,n),e=e.sibling;e!==null;)Sp(e,t,n),e=e.sibling}function gu(e,t,n){var i=e.tag;if(i===5||i===6)e=e.stateNode,t?n.insertBefore(e,t):n.appendChild(e);else if(i!==4&&(i===27&&la(e.type)&&(n=e.stateNode),e=e.child,e!==null))for(gu(e,t,n),e=e.sibling;e!==null;)gu(e,t,n),e=e.sibling}function n_(e){var t=e.stateNode,n=e.memoizedProps;try{for(var i=e.type,s=t.attributes;s.length;)t.removeAttributeNode(s[0]);pn(t,i,n),t[hn]=e,t[Pn]=n}catch(a){he(e,e.return,a)}}var hs=!1,qe=!1,Od=!1,Iy=typeof WeakSet=="function"?WeakSet:Set,an=null;function lE(e,t){if(e=e.containerInfo,Cp=wu,e=Gv(e),Zp(e)){if("selectionStart"in e)var n={start:e.selectionStart,end:e.selectionEnd};else t:{n=(n=e.ownerDocument)&&n.defaultView||window;var i=n.getSelection&&n.getSelection();if(i&&i.rangeCount!==0){n=i.anchorNode;var s=i.anchorOffset,a=i.focusNode;i=i.focusOffset;try{n.nodeType,a.nodeType}catch{n=null;break t}var r=0,o=-1,l=-1,c=0,u=0,p=e,h=null;e:for(;;){for(var d;p!==n||s!==0&&p.nodeType!==3||(o=r+s),p!==a||i!==0&&p.nodeType!==3||(l=r+i),p.nodeType===3&&(r+=p.nodeValue.length),(d=p.firstChild)!==null;)h=p,p=d;for(;;){if(p===e)break e;if(h===n&&++c===s&&(o=r),h===a&&++u===i&&(l=r),(d=p.nextSibling)!==null)break;p=h,h=p.parentNode}p=d}n=o===-1||l===-1?null:{start:o,end:l}}else n=null}n=n||{start:0,end:0}}else n=null;for(Rp={focusedElem:e,selectionRange:n},wu=!1,an=t;an!==null;)if(t=an,e=t.child,(t.subtreeFlags&1028)!==0&&e!==null)e.return=t,an=e;else for(;an!==null;){switch(t=an,a=t.alternate,e=t.flags,t.tag){case 0:if((e&4)!==0&&(e=t.updateQueue,e=e!==null?e.events:null,e!==null))for(n=0;n<e.length;n++)s=e[n],s.ref.impl=s.nextImpl;break;case 11:case 15:break;case 1:if((e&1024)!==0&&a!==null){e=void 0,n=t,s=a.memoizedProps,a=a.memoizedState,i=n.stateNode;try{var m=ka(n.type,s);e=i.getSnapshotBeforeUpdate(m,a),i.__reactInternalSnapshotBeforeUpdate=e}catch(b){he(n,n.return,b)}}break;case 3:if((e&1024)!==0){if(e=t.stateNode.containerInfo,n=e.nodeType,n===9)Np(e);else if(n===1)switch(e.nodeName){case"HEAD":case"HTML":case"BODY":Np(e);break;default:e.textContent=""}}break;case 5:case 26:case 27:case 6:case 4:case 17:break;default:if((e&1024)!==0)throw Error($(163))}if(e=t.sibling,e!==null){e.return=t.return,an=e;break}an=t.return}}function i_(e,t,n){var i=n.flags;switch(n.tag){case 0:case 11:case 15:ls(e,n),i&4&&wl(5,n);break;case 1:if(ls(e,n),i&4)if(e=n.stateNode,t===null)try{e.componentDidMount()}catch(r){he(n,n.return,r)}else{var s=ka(n.type,t.memoizedProps);t=t.memoizedState;try{e.componentDidUpdate(s,t,e.__reactInternalSnapshotBeforeUpdate)}catch(r){he(n,n.return,r)}}i&64&&jx(n),i&512&&tl(n,n.return);break;case 3:if(ls(e,n),i&64&&(e=n.updateQueue,e!==null)){if(t=null,n.child!==null)switch(n.child.tag){case 27:case 5:t=n.child.stateNode;break;case 1:t=n.child.stateNode}try{ox(e,t)}catch(r){he(n,n.return,r)}}break;case 27:t===null&&i&4&&n_(n);case 26:case 5:ls(e,n),t===null&&i&4&&t_(n),i&512&&tl(n,n.return);break;case 12:ls(e,n);break;case 31:ls(e,n),i&4&&r_(e,n);break;case 13:ls(e,n),i&4&&o_(e,n),i&64&&(e=n.memoizedState,e!==null&&(e=e.dehydrated,e!==null&&(n=yE.bind(null,n),IE(e,n))));break;case 22:if(i=n.memoizedState!==null||hs,!i){t=t!==null&&t.memoizedState!==null||qe,s=hs;var a=qe;hs=i,(qe=t)&&!a?cs(e,n,(n.subtreeFlags&8772)!==0):ls(e,n),hs=s,qe=a}break;case 30:break;default:ls(e,n)}}function s_(e){var t=e.alternate;t!==null&&(e.alternate=null,s_(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&kp(t)),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}var De=null,Un=!1;function os(e,t,n){for(n=n.child;n!==null;)a_(e,t,n),n=n.sibling}function a_(e,t,n){if(Zn&&typeof Zn.onCommitFiberUnmount=="function")try{Zn.onCommitFiberUnmount(_l,n)}catch{}switch(n.tag){case 26:qe||Xi(n,t),os(e,t,n),n.memoizedState?n.memoizedState.count--:n.stateNode&&(n=n.stateNode,n.parentNode.removeChild(n));break;case 27:qe||Xi(n,t);var i=De,s=Un;la(n.type)&&(De=n.stateNode,Un=!1),os(e,t,n),sl(n.stateNode),De=i,Un=s;break;case 5:qe||Xi(n,t);case 6:if(i=De,s=Un,De=null,os(e,t,n),De=i,Un=s,De!==null)if(Un)try{(De.nodeType===9?De.body:De.nodeName==="HTML"?De.ownerDocument.body:De).removeChild(n.stateNode)}catch(a){he(n,t,a)}else try{De.removeChild(n.stateNode)}catch(a){he(n,t,a)}break;case 18:De!==null&&(Un?(e=De,Jy(e.nodeType===9?e.body:e.nodeName==="HTML"?e.ownerDocument.body:e,n.stateNode),qr(e)):Jy(De,n.stateNode));break;case 4:i=De,s=Un,De=n.stateNode.containerInfo,Un=!0,os(e,t,n),De=i,Un=s;break;case 0:case 11:case 14:case 15:aa(2,n,t),qe||aa(4,n,t),os(e,t,n);break;case 1:qe||(Xi(n,t),i=n.stateNode,typeof i.componentWillUnmount=="function"&&$x(n,t,i)),os(e,t,n);break;case 21:os(e,t,n);break;case 22:qe=(i=qe)||n.memoizedState!==null,os(e,t,n),qe=i;break;default:os(e,t,n)}}function r_(e,t){if(t.memoizedState===null&&(e=t.alternate,e!==null&&(e=e.memoizedState,e!==null))){e=e.dehydrated;try{qr(e)}catch(n){he(t,t.return,n)}}}function o_(e,t){if(t.memoizedState===null&&(e=t.alternate,e!==null&&(e=e.memoizedState,e!==null&&(e=e.dehydrated,e!==null))))try{qr(e)}catch(n){he(t,t.return,n)}}function cE(e){switch(e.tag){case 31:case 13:case 19:var t=e.stateNode;return t===null&&(t=e.stateNode=new Iy),t;case 22:return e=e.stateNode,t=e._retryCache,t===null&&(t=e._retryCache=new Iy),t;default:throw Error($(435,e.tag))}}function Uc(e,t){var n=cE(e);t.forEach(function(i){if(!n.has(i)){n.add(i);var s=vE.bind(null,e,i);i.then(s,s)}})}function Nn(e,t){var n=t.deletions;if(n!==null)for(var i=0;i<n.length;i++){var s=n[i],a=e,r=t,o=r;t:for(;o!==null;){switch(o.tag){case 27:if(la(o.type)){De=o.stateNode,Un=!1;break t}break;case 5:De=o.stateNode,Un=!1;break t;case 3:case 4:De=o.stateNode.containerInfo,Un=!0;break t}o=o.return}if(De===null)throw Error($(160));a_(a,r,s),De=null,Un=!1,a=s.alternate,a!==null&&(a.return=null),s.return=null}if(t.subtreeFlags&13886)for(t=t.child;t!==null;)l_(t,e),t=t.sibling}var Ei=null;function l_(e,t){var n=e.alternate,i=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:Nn(t,e),Ln(e),i&4&&(aa(3,e,e.return),wl(3,e),aa(5,e,e.return));break;case 1:Nn(t,e),Ln(e),i&512&&(qe||n===null||Xi(n,n.return)),i&64&&hs&&(e=e.updateQueue,e!==null&&(i=e.callbacks,i!==null&&(n=e.shared.hiddenCallbacks,e.shared.hiddenCallbacks=n===null?i:n.concat(i))));break;case 26:var s=Ei;if(Nn(t,e),Ln(e),i&512&&(qe||n===null||Xi(n,n.return)),i&4){var a=n!==null?n.memoizedState:null;if(i=e.memoizedState,n===null)if(i===null)if(e.stateNode===null){t:{i=e.type,n=e.memoizedProps,s=s.ownerDocument||s;e:switch(i){case"title":a=s.getElementsByTagName("title")[0],(!a||a[Ml]||a[hn]||a.namespaceURI==="http://www.w3.org/2000/svg"||a.hasAttribute("itemprop"))&&(a=s.createElement(i),s.head.insertBefore(a,s.querySelector("head > title"))),pn(a,i,n),a[hn]=e,rn(a),i=a;break t;case"link":var r=iv("link","href",s).get(i+(n.href||""));if(r){for(var o=0;o<r.length;o++)if(a=r[o],a.getAttribute("href")===(n.href==null||n.href===""?null:n.href)&&a.getAttribute("rel")===(n.rel==null?null:n.rel)&&a.getAttribute("title")===(n.title==null?null:n.title)&&a.getAttribute("crossorigin")===(n.crossOrigin==null?null:n.crossOrigin)){r.splice(o,1);break e}}a=s.createElement(i),pn(a,i,n),s.head.appendChild(a);break;case"meta":if(r=iv("meta","content",s).get(i+(n.content||""))){for(o=0;o<r.length;o++)if(a=r[o],a.getAttribute("content")===(n.content==null?null:""+n.content)&&a.getAttribute("name")===(n.name==null?null:n.name)&&a.getAttribute("property")===(n.property==null?null:n.property)&&a.getAttribute("http-equiv")===(n.httpEquiv==null?null:n.httpEquiv)&&a.getAttribute("charset")===(n.charSet==null?null:n.charSet)){r.splice(o,1);break e}}a=s.createElement(i),pn(a,i,n),s.head.appendChild(a);break;default:throw Error($(468,i))}a[hn]=e,rn(a),i=a}e.stateNode=i}else sv(s,e.type,e.stateNode);else e.stateNode=nv(s,i,e.memoizedProps);else a!==i?(a===null?n.stateNode!==null&&(n=n.stateNode,n.parentNode.removeChild(n)):a.count--,i===null?sv(s,e.type,e.stateNode):nv(s,i,e.memoizedProps)):i===null&&e.stateNode!==null&&Ld(e,e.memoizedProps,n.memoizedProps)}break;case 27:Nn(t,e),Ln(e),i&512&&(qe||n===null||Xi(n,n.return)),n!==null&&i&4&&Ld(e,e.memoizedProps,n.memoizedProps);break;case 5:if(Nn(t,e),Ln(e),i&512&&(qe||n===null||Xi(n,n.return)),e.flags&32){s=e.stateNode;try{zr(s,"")}catch(m){he(e,e.return,m)}}i&4&&e.stateNode!=null&&(s=e.memoizedProps,Ld(e,s,n!==null?n.memoizedProps:s)),i&1024&&(Od=!0);break;case 6:if(Nn(t,e),Ln(e),i&4){if(e.stateNode===null)throw Error($(162));i=e.memoizedProps,n=e.stateNode;try{n.nodeValue=i}catch(m){he(e,e.return,m)}}break;case 3:if(Qc=null,s=Ei,Ei=Eu(t.containerInfo),Nn(t,e),Ei=s,Ln(e),i&4&&n!==null&&n.memoizedState.isDehydrated)try{qr(t.containerInfo)}catch(m){he(e,e.return,m)}Od&&(Od=!1,c_(e));break;case 4:i=Ei,Ei=Eu(e.stateNode.containerInfo),Nn(t,e),Ln(e),Ei=i;break;case 12:Nn(t,e),Ln(e);break;case 31:Nn(t,e),Ln(e),i&4&&(i=e.updateQueue,i!==null&&(e.updateQueue=null,Uc(e,i)));break;case 13:Nn(t,e),Ln(e),e.child.flags&8192&&e.memoizedState!==null!=(n!==null&&n.memoizedState!==null)&&(Vu=Yn()),i&4&&(i=e.updateQueue,i!==null&&(e.updateQueue=null,Uc(e,i)));break;case 22:s=e.memoizedState!==null;var l=n!==null&&n.memoizedState!==null,c=hs,u=qe;if(hs=c||s,qe=u||l,Nn(t,e),qe=u,hs=c,Ln(e),i&8192)t:for(t=e.stateNode,t._visibility=s?t._visibility&-2:t._visibility|1,s&&(n===null||l||hs||qe||La(e)),n=null,t=e;;){if(t.tag===5||t.tag===26){if(n===null){l=n=t;try{if(a=l.stateNode,s)r=a.style,typeof r.setProperty=="function"?r.setProperty("display","none","important"):r.display="none";else{o=l.stateNode;var p=l.memoizedProps.style,h=p!=null&&p.hasOwnProperty("display")?p.display:null;o.style.display=h==null||typeof h=="boolean"?"":(""+h).trim()}}catch(m){he(l,l.return,m)}}}else if(t.tag===6){if(n===null){l=t;try{l.stateNode.nodeValue=s?"":l.memoizedProps}catch(m){he(l,l.return,m)}}}else if(t.tag===18){if(n===null){l=t;try{var d=l.stateNode;s?Qy(d,!0):Qy(l.stateNode,!1)}catch(m){he(l,l.return,m)}}}else if((t.tag!==22&&t.tag!==23||t.memoizedState===null||t===e)&&t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break t;for(;t.sibling===null;){if(t.return===null||t.return===e)break t;n===t&&(n=null),t=t.return}n===t&&(n=null),t.sibling.return=t.return,t=t.sibling}i&4&&(i=e.updateQueue,i!==null&&(n=i.retryQueue,n!==null&&(i.retryQueue=null,Uc(e,n))));break;case 19:Nn(t,e),Ln(e),i&4&&(i=e.updateQueue,i!==null&&(e.updateQueue=null,Uc(e,i)));break;case 30:break;case 21:break;default:Nn(t,e),Ln(e)}}function Ln(e){var t=e.flags;if(t&2){try{for(var n,i=e.return;i!==null;){if(e_(i)){n=i;break}i=i.return}if(n==null)throw Error($(160));switch(n.tag){case 27:var s=n.stateNode,a=Ud(e);gu(e,a,s);break;case 5:var r=n.stateNode;n.flags&32&&(zr(r,""),n.flags&=-33);var o=Ud(e);gu(e,o,r);break;case 3:case 4:var l=n.stateNode.containerInfo,c=Ud(e);Sp(e,c,l);break;default:throw Error($(161))}}catch(u){he(e,e.return,u)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function c_(e){if(e.subtreeFlags&1024)for(e=e.child;e!==null;){var t=e;c_(t),t.tag===5&&t.flags&1024&&t.stateNode.reset(),e=e.sibling}}function ls(e,t){if(t.subtreeFlags&8772)for(t=t.child;t!==null;)i_(e,t.alternate,t),t=t.sibling}function La(e){for(e=e.child;e!==null;){var t=e;switch(t.tag){case 0:case 11:case 14:case 15:aa(4,t,t.return),La(t);break;case 1:Xi(t,t.return);var n=t.stateNode;typeof n.componentWillUnmount=="function"&&$x(t,t.return,n),La(t);break;case 27:sl(t.stateNode);case 26:case 5:Xi(t,t.return),La(t);break;case 22:t.memoizedState===null&&La(t);break;case 30:La(t);break;default:La(t)}e=e.sibling}}function cs(e,t,n){for(n=n&&(t.subtreeFlags&8772)!==0,t=t.child;t!==null;){var i=t.alternate,s=e,a=t,r=a.flags;switch(a.tag){case 0:case 11:case 15:cs(s,a,n),wl(4,a);break;case 1:if(cs(s,a,n),i=a,s=i.stateNode,typeof s.componentDidMount=="function")try{s.componentDidMount()}catch(c){he(i,i.return,c)}if(i=a,s=i.updateQueue,s!==null){var o=i.stateNode;try{var l=s.shared.hiddenCallbacks;if(l!==null)for(s.shared.hiddenCallbacks=null,s=0;s<l.length;s++)rx(l[s],o)}catch(c){he(i,i.return,c)}}n&&r&64&&jx(a),tl(a,a.return);break;case 27:n_(a);case 26:case 5:cs(s,a,n),n&&i===null&&r&4&&t_(a),tl(a,a.return);break;case 12:cs(s,a,n);break;case 31:cs(s,a,n),n&&r&4&&r_(s,a);break;case 13:cs(s,a,n),n&&r&4&&o_(s,a);break;case 22:a.memoizedState===null&&cs(s,a,n),tl(a,a.return);break;case 30:break;default:cs(s,a,n)}t=t.sibling}}function _m(e,t){var n=null;e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(n=e.memoizedState.cachePool.pool),e=null,t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(e=t.memoizedState.cachePool.pool),e!==n&&(e!=null&&e.refCount++,n!=null&&Tl(n))}function Sm(e,t){e=null,t.alternate!==null&&(e=t.alternate.memoizedState.cache),t=t.memoizedState.cache,t!==e&&(t.refCount++,e!=null&&Tl(e))}function Mi(e,t,n,i){if(t.subtreeFlags&10256)for(t=t.child;t!==null;)u_(e,t,n,i),t=t.sibling}function u_(e,t,n,i){var s=t.flags;switch(t.tag){case 0:case 11:case 15:Mi(e,t,n,i),s&2048&&wl(9,t);break;case 1:Mi(e,t,n,i);break;case 3:Mi(e,t,n,i),s&2048&&(e=null,t.alternate!==null&&(e=t.alternate.memoizedState.cache),t=t.memoizedState.cache,t!==e&&(t.refCount++,e!=null&&Tl(e)));break;case 12:if(s&2048){Mi(e,t,n,i),e=t.stateNode;try{var a=t.memoizedProps,r=a.id,o=a.onPostCommit;typeof o=="function"&&o(r,t.alternate===null?"mount":"update",e.passiveEffectDuration,-0)}catch(l){he(t,t.return,l)}}else Mi(e,t,n,i);break;case 31:Mi(e,t,n,i);break;case 13:Mi(e,t,n,i);break;case 23:break;case 22:a=t.stateNode,r=t.alternate,t.memoizedState!==null?a._visibility&2?Mi(e,t,n,i):el(e,t):a._visibility&2?Mi(e,t,n,i):(a._visibility|=2,mr(e,t,n,i,(t.subtreeFlags&10256)!==0||!1)),s&2048&&_m(r,t);break;case 24:Mi(e,t,n,i),s&2048&&Sm(t.alternate,t);break;default:Mi(e,t,n,i)}}function mr(e,t,n,i,s){for(s=s&&((t.subtreeFlags&10256)!==0||!1),t=t.child;t!==null;){var a=e,r=t,o=n,l=i,c=r.flags;switch(r.tag){case 0:case 11:case 15:mr(a,r,o,l,s),wl(8,r);break;case 23:break;case 22:var u=r.stateNode;r.memoizedState!==null?u._visibility&2?mr(a,r,o,l,s):el(a,r):(u._visibility|=2,mr(a,r,o,l,s)),s&&c&2048&&_m(r.alternate,r);break;case 24:mr(a,r,o,l,s),s&&c&2048&&Sm(r.alternate,r);break;default:mr(a,r,o,l,s)}t=t.sibling}}function el(e,t){if(t.subtreeFlags&10256)for(t=t.child;t!==null;){var n=e,i=t,s=i.flags;switch(i.tag){case 22:el(n,i),s&2048&&_m(i.alternate,i);break;case 24:el(n,i),s&2048&&Sm(i.alternate,i);break;default:el(n,i)}t=t.sibling}}var Xo=8192;function pr(e,t,n){if(e.subtreeFlags&Xo)for(e=e.child;e!==null;)h_(e,t,n),e=e.sibling}function h_(e,t,n){switch(e.tag){case 26:pr(e,t,n),e.flags&Xo&&e.memoizedState!==null&&YE(n,Ei,e.memoizedState,e.memoizedProps);break;case 5:pr(e,t,n);break;case 3:case 4:var i=Ei;Ei=Eu(e.stateNode.containerInfo),pr(e,t,n),Ei=i;break;case 22:e.memoizedState===null&&(i=e.alternate,i!==null&&i.memoizedState!==null?(i=Xo,Xo=16777216,pr(e,t,n),Xo=i):pr(e,t,n));break;default:pr(e,t,n)}}function f_(e){var t=e.alternate;if(t!==null&&(e=t.child,e!==null)){t.child=null;do t=e.sibling,e.sibling=null,e=t;while(e!==null)}}function zo(e){var t=e.deletions;if((e.flags&16)!==0){if(t!==null)for(var n=0;n<t.length;n++){var i=t[n];an=i,p_(i,e)}f_(e)}if(e.subtreeFlags&10256)for(e=e.child;e!==null;)d_(e),e=e.sibling}function d_(e){switch(e.tag){case 0:case 11:case 15:zo(e),e.flags&2048&&aa(9,e,e.return);break;case 3:zo(e);break;case 12:zo(e);break;case 22:var t=e.stateNode;e.memoizedState!==null&&t._visibility&2&&(e.return===null||e.return.tag!==13)?(t._visibility&=-3,Kc(e)):zo(e);break;default:zo(e)}}function Kc(e){var t=e.deletions;if((e.flags&16)!==0){if(t!==null)for(var n=0;n<t.length;n++){var i=t[n];an=i,p_(i,e)}f_(e)}for(e=e.child;e!==null;){switch(t=e,t.tag){case 0:case 11:case 15:aa(8,t,t.return),Kc(t);break;case 22:n=t.stateNode,n._visibility&2&&(n._visibility&=-3,Kc(t));break;default:Kc(t)}e=e.sibling}}function p_(e,t){for(;an!==null;){var n=an;switch(n.tag){case 0:case 11:case 15:aa(8,n,t);break;case 23:case 22:if(n.memoizedState!==null&&n.memoizedState.cachePool!==null){var i=n.memoizedState.cachePool.pool;i!=null&&i.refCount++}break;case 24:Tl(n.memoizedState.cache)}if(i=n.child,i!==null)i.return=n,an=i;else t:for(n=e;an!==null;){i=an;var s=i.sibling,a=i.return;if(s_(i),i===n){an=null;break t}if(s!==null){s.return=a,an=s;break t}an=a}}}var uE={getCacheForType:function(e){var t=dn(Ye),n=t.data.get(e);return n===void 0&&(n=e(),t.data.set(e,n)),n},cacheSignal:function(){return dn(Ye).controller.signal}},hE=typeof WeakMap=="function"?WeakMap:Map,se=0,ge=null,qt=null,Jt=0,ue=0,Gn=null,Xs=!1,Qr=!1,bm=!1,bs=0,Ie=0,ra=0,Ba=0,Mm=0,qn=0,kr=0,nl=null,On=null,bp=!1,Vu=0,m_=0,yu=1/0,vu=null,js=null,Qe=0,$s=null,Gr=null,ys=0,Mp=0,Ep=null,g_=null,il=0,Tp=null;function Jn(){return(se&2)!==0&&Jt!==0?Jt&-Jt:Lt.T!==null?Tm():Tv()}function y_(){if(qn===0)if((Jt&536870912)===0||jt){var e=Mc;Mc<<=1,(Mc&3932160)===0&&(Mc=262144),qn=e}else qn=536870912;return e=jn.current,e!==null&&(e.flags|=32),qn}function In(e,t,n){(e===ge&&(ue===2||ue===9)||e.cancelPendingCommit!==null)&&(Wr(e,0),qs(e,Jt,qn,!1)),bl(e,n),((se&2)===0||e!==ge)&&(e===ge&&((se&2)===0&&(Ba|=n),Ie===4&&qs(e,Jt,qn,!1)),Zi(e))}function v_(e,t,n){if((se&6)!==0)throw Error($(327));var i=!n&&(t&127)===0&&(t&e.expiredLanes)===0||Sl(e,t),s=i?pE(e,t):Id(e,t,!0),a=i;do{if(s===0){Qr&&!i&&qs(e,t,0,!1);break}else{if(n=e.current.alternate,a&&!fE(n)){s=Id(e,t,!1),a=!1;continue}if(s===2){if(a=t,e.errorRecoveryDisabledLanes&a)var r=0;else r=e.pendingLanes&-536870913,r=r!==0?r:r&536870912?536870912:0;if(r!==0){t=r;t:{var o=e;s=nl;var l=o.current.memoizedState.isDehydrated;if(l&&(Wr(o,r).flags|=256),r=Id(o,r,!1),r!==2){if(bm&&!l){o.errorRecoveryDisabledLanes|=a,Ba|=a,s=4;break t}a=On,On=s,a!==null&&(On===null?On=a:On.push.apply(On,a))}s=r}if(a=!1,s!==2)continue}}if(s===1){Wr(e,0),qs(e,t,0,!0);break}t:{switch(i=e,a=s,a){case 0:case 1:throw Error($(345));case 4:if((t&4194048)!==t)break;case 6:qs(i,t,qn,!Xs);break t;case 2:On=null;break;case 3:case 5:break;default:throw Error($(329))}if((t&62914560)===t&&(s=Vu+300-Yn(),10<s)){if(qs(i,t,qn,!Xs),Ru(i,0,!0)!==0)break t;ys=t,i.timeoutHandle=z_(Py.bind(null,i,n,On,vu,bp,t,qn,Ba,kr,Xs,a,"Throttled",-0,0),s);break t}Py(i,n,On,vu,bp,t,qn,Ba,kr,Xs,a,null,-0,0)}}break}while(!0);Zi(e)}function Py(e,t,n,i,s,a,r,o,l,c,u,p,h,d){if(e.timeoutHandle=-1,p=t.subtreeFlags,p&8192||(p&16785408)===16785408){p={stylesheets:null,count:0,imgCount:0,imgBytes:0,suspenseyImages:[],waitingForImages:!0,waitingForViewTransition:!1,unsuspend:ds},h_(t,a,p);var m=(a&62914560)===a?Vu-Yn():(a&4194048)===a?m_-Yn():0;if(m=ZE(p,m),m!==null){ys=a,e.cancelPendingCommit=m(zy.bind(null,e,t,a,n,i,s,r,o,l,u,p,null,h,d)),qs(e,a,r,!c);return}}zy(e,t,a,n,i,s,r,o,l)}function fE(e){for(var t=e;;){var n=t.tag;if((n===0||n===11||n===15)&&t.flags&16384&&(n=t.updateQueue,n!==null&&(n=n.stores,n!==null)))for(var i=0;i<n.length;i++){var s=n[i],a=s.getSnapshot;s=s.value;try{if(!Qn(a(),s))return!1}catch{return!1}}if(n=t.child,t.subtreeFlags&16384&&n!==null)n.return=t,t=n;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function qs(e,t,n,i){t&=~Mm,t&=~Ba,e.suspendedLanes|=t,e.pingedLanes&=~t,i&&(e.warmLanes|=t),i=e.expirationTimes;for(var s=t;0<s;){var a=31-Kn(s),r=1<<a;i[a]=-1,s&=~r}n!==0&&bv(e,n,t)}function Hu(){return(se&6)===0?(Cl(0,!1),!1):!0}function Em(){if(qt!==null){if(ue===0)var e=qt.return;else e=qt,ps=Ya=null,cm(e),Ur=null,hl=0,e=qt;for(;e!==null;)Qx(e.alternate,e),e=e.return;qt=null}}function Wr(e,t){var n=e.timeoutHandle;n!==-1&&(e.timeoutHandle=-1,DE(n)),n=e.cancelPendingCommit,n!==null&&(e.cancelPendingCommit=null,n()),ys=0,Em(),ge=e,qt=n=ms(e.current,null),Jt=t,ue=0,Gn=null,Xs=!1,Qr=Sl(e,t),bm=!1,kr=qn=Mm=Ba=ra=Ie=0,On=nl=null,bp=!1,(t&8)!==0&&(t|=t&32);var i=e.entangledLanes;if(i!==0)for(e=e.entanglements,i&=t;0<i;){var s=31-Kn(i),a=1<<s;t|=e[s],i&=~a}return bs=t,Uu(),n}function x_(e,t){zt=null,Lt.H=dl,t===Jr||t===Iu?(t=py(),ue=3):t===nm?(t=py(),ue=4):ue=t===vm?8:t!==null&&typeof t=="object"&&typeof t.then=="function"?6:1,Gn=t,qt===null&&(Ie=1,pu(e,hi(t,e.current)))}function __(){var e=jn.current;return e===null?!0:(Jt&4194048)===Jt?di===null:(Jt&62914560)===Jt||(Jt&536870912)!==0?e===di:!1}function S_(){var e=Lt.H;return Lt.H=dl,e===null?dl:e}function b_(){var e=Lt.A;return Lt.A=uE,e}function xu(){Ie=4,Xs||(Jt&4194048)!==Jt&&jn.current!==null||(Qr=!0),(ra&134217727)===0&&(Ba&134217727)===0||ge===null||qs(ge,Jt,qn,!1)}function Id(e,t,n){var i=se;se|=2;var s=S_(),a=b_();(ge!==e||Jt!==t)&&(vu=null,Wr(e,t)),t=!1;var r=Ie;t:do try{if(ue!==0&&qt!==null){var o=qt,l=Gn;switch(ue){case 8:Em(),r=6;break t;case 3:case 2:case 9:case 6:jn.current===null&&(t=!0);var c=ue;if(ue=0,Gn=null,Cr(e,o,l,c),n&&Qr){r=0;break t}break;default:c=ue,ue=0,Gn=null,Cr(e,o,l,c)}}dE(),r=Ie;break}catch(u){x_(e,u)}while(!0);return t&&e.shellSuspendCounter++,ps=Ya=null,se=i,Lt.H=s,Lt.A=a,qt===null&&(ge=null,Jt=0,Uu()),r}function dE(){for(;qt!==null;)M_(qt)}function pE(e,t){var n=se;se|=2;var i=S_(),s=b_();ge!==e||Jt!==t?(vu=null,yu=Yn()+500,Wr(e,t)):Qr=Sl(e,t);t:do try{if(ue!==0&&qt!==null){t=qt;var a=Gn;e:switch(ue){case 1:ue=0,Gn=null,Cr(e,t,a,1);break;case 2:case 9:if(dy(a)){ue=0,Gn=null,By(t);break}t=function(){ue!==2&&ue!==9||ge!==e||(ue=7),Zi(e)},a.then(t,t);break t;case 3:ue=7;break t;case 4:ue=5;break t;case 7:dy(a)?(ue=0,Gn=null,By(t)):(ue=0,Gn=null,Cr(e,t,a,7));break;case 5:var r=null;switch(qt.tag){case 26:r=qt.memoizedState;case 5:case 27:var o=qt;if(r?G_(r):o.stateNode.complete){ue=0,Gn=null;var l=o.sibling;if(l!==null)qt=l;else{var c=o.return;c!==null?(qt=c,ku(c)):qt=null}break e}}ue=0,Gn=null,Cr(e,t,a,5);break;case 6:ue=0,Gn=null,Cr(e,t,a,6);break;case 8:Em(),Ie=6;break t;default:throw Error($(462))}}mE();break}catch(u){x_(e,u)}while(!0);return ps=Ya=null,Lt.H=i,Lt.A=s,se=n,qt!==null?0:(ge=null,Jt=0,Uu(),Ie)}function mE(){for(;qt!==null&&!zM();)M_(qt)}function M_(e){var t=Jx(e.alternate,e,bs);e.memoizedProps=e.pendingProps,t===null?ku(e):qt=t}function By(e){var t=e,n=t.alternate;switch(t.tag){case 15:case 0:t=Dy(n,t,t.pendingProps,t.type,void 0,Jt);break;case 11:t=Dy(n,t,t.pendingProps,t.type.render,t.ref,Jt);break;case 5:cm(t);default:Qx(n,t),t=qt=Qv(t,bs),t=Jx(n,t,bs)}e.memoizedProps=e.pendingProps,t===null?ku(e):qt=t}function Cr(e,t,n,i){ps=Ya=null,cm(t),Ur=null,hl=0;var s=t.return;try{if(iE(e,s,t,n,Jt)){Ie=1,pu(e,hi(n,e.current)),qt=null;return}}catch(a){if(s!==null)throw qt=s,a;Ie=1,pu(e,hi(n,e.current)),qt=null;return}t.flags&32768?(jt||i===1?e=!0:Qr||(Jt&536870912)!==0?e=!1:(Xs=e=!0,(i===2||i===9||i===3||i===6)&&(i=jn.current,i!==null&&i.tag===13&&(i.flags|=16384))),E_(t,e)):ku(t)}function ku(e){var t=e;do{if((t.flags&32768)!==0){E_(t,Xs);return}e=t.return;var n=rE(t.alternate,t,bs);if(n!==null){qt=n;return}if(t=t.sibling,t!==null){qt=t;return}qt=t=e}while(t!==null);Ie===0&&(Ie=5)}function E_(e,t){do{var n=oE(e.alternate,e);if(n!==null){n.flags&=32767,qt=n;return}if(n=e.return,n!==null&&(n.flags|=32768,n.subtreeFlags=0,n.deletions=null),!t&&(e=e.sibling,e!==null)){qt=e;return}qt=e=n}while(e!==null);Ie=6,qt=null}function zy(e,t,n,i,s,a,r,o,l){e.cancelPendingCommit=null;do Gu();while(Qe!==0);if((se&6)!==0)throw Error($(327));if(t!==null){if(t===e.current)throw Error($(177));if(a=t.lanes|t.childLanes,a|=Kp,ZM(e,n,a,r,o,l),e===ge&&(qt=ge=null,Jt=0),Gr=t,$s=e,ys=n,Mp=a,Ep=s,g_=i,(t.subtreeFlags&10256)!==0||(t.flags&10256)!==0?(e.callbackNode=null,e.callbackPriority=0,xE(iu,function(){return R_(),null})):(e.callbackNode=null,e.callbackPriority=0),i=(t.flags&13878)!==0,(t.subtreeFlags&13878)!==0||i){i=Lt.T,Lt.T=null,s=ae.p,ae.p=2,r=se,se|=4;try{lE(e,t,n)}finally{se=r,ae.p=s,Lt.T=i}}Qe=1,T_(),A_(),w_()}}function T_(){if(Qe===1){Qe=0;var e=$s,t=Gr,n=(t.flags&13878)!==0;if((t.subtreeFlags&13878)!==0||n){n=Lt.T,Lt.T=null;var i=ae.p;ae.p=2;var s=se;se|=4;try{l_(t,e);var a=Rp,r=Gv(e.containerInfo),o=a.focusedElem,l=a.selectionRange;if(r!==o&&o&&o.ownerDocument&&kv(o.ownerDocument.documentElement,o)){if(l!==null&&Zp(o)){var c=l.start,u=l.end;if(u===void 0&&(u=c),"selectionStart"in o)o.selectionStart=c,o.selectionEnd=Math.min(u,o.value.length);else{var p=o.ownerDocument||document,h=p&&p.defaultView||window;if(h.getSelection){var d=h.getSelection(),m=o.textContent.length,b=Math.min(l.start,m),g=l.end===void 0?b:Math.min(l.end,m);!d.extend&&b>g&&(r=g,g=b,b=r);var f=ry(o,b),y=ry(o,g);if(f&&y&&(d.rangeCount!==1||d.anchorNode!==f.node||d.anchorOffset!==f.offset||d.focusNode!==y.node||d.focusOffset!==y.offset)){var M=p.createRange();M.setStart(f.node,f.offset),d.removeAllRanges(),b>g?(d.addRange(M),d.extend(y.node,y.offset)):(M.setEnd(y.node,y.offset),d.addRange(M))}}}}for(p=[],d=o;d=d.parentNode;)d.nodeType===1&&p.push({element:d,left:d.scrollLeft,top:d.scrollTop});for(typeof o.focus=="function"&&o.focus(),o=0;o<p.length;o++){var x=p[o];x.element.scrollLeft=x.left,x.element.scrollTop=x.top}}wu=!!Cp,Rp=Cp=null}finally{se=s,ae.p=i,Lt.T=n}}e.current=t,Qe=2}}function A_(){if(Qe===2){Qe=0;var e=$s,t=Gr,n=(t.flags&8772)!==0;if((t.subtreeFlags&8772)!==0||n){n=Lt.T,Lt.T=null;var i=ae.p;ae.p=2;var s=se;se|=4;try{i_(e,t.alternate,t)}finally{se=s,ae.p=i,Lt.T=n}}Qe=3}}function w_(){if(Qe===4||Qe===3){Qe=0,FM();var e=$s,t=Gr,n=ys,i=g_;(t.subtreeFlags&10256)!==0||(t.flags&10256)!==0?Qe=5:(Qe=0,Gr=$s=null,C_(e,e.pendingLanes));var s=e.pendingLanes;if(s===0&&(js=null),Hp(n),t=t.stateNode,Zn&&typeof Zn.onCommitFiberRoot=="function")try{Zn.onCommitFiberRoot(_l,t,void 0,(t.current.flags&128)===128)}catch{}if(i!==null){t=Lt.T,s=ae.p,ae.p=2,Lt.T=null;try{for(var a=e.onRecoverableError,r=0;r<i.length;r++){var o=i[r];a(o.value,{componentStack:o.stack})}}finally{Lt.T=t,ae.p=s}}(ys&3)!==0&&Gu(),Zi(e),s=e.pendingLanes,(n&261930)!==0&&(s&42)!==0?e===Tp?il++:(il=0,Tp=e):il=0,Cl(0,!1)}}function C_(e,t){(e.pooledCacheLanes&=t)===0&&(t=e.pooledCache,t!=null&&(e.pooledCache=null,Tl(t)))}function Gu(){return T_(),A_(),w_(),R_()}function R_(){if(Qe!==5)return!1;var e=$s,t=Mp;Mp=0;var n=Hp(ys),i=Lt.T,s=ae.p;try{ae.p=32>n?32:n,Lt.T=null,n=Ep,Ep=null;var a=$s,r=ys;if(Qe=0,Gr=$s=null,ys=0,(se&6)!==0)throw Error($(331));var o=se;if(se|=4,d_(a.current),u_(a,a.current,r,n),se=o,Cl(0,!1),Zn&&typeof Zn.onPostCommitFiberRoot=="function")try{Zn.onPostCommitFiberRoot(_l,a)}catch{}return!0}finally{ae.p=s,Lt.T=i,C_(e,t)}}function Fy(e,t,n){t=hi(n,t),t=vp(e.stateNode,t,2),e=Qs(e,t,2),e!==null&&(bl(e,2),Zi(e))}function he(e,t,n){if(e.tag===3)Fy(e,e,n);else for(;t!==null;){if(t.tag===3){Fy(t,e,n);break}else if(t.tag===1){var i=t.stateNode;if(typeof t.type.getDerivedStateFromError=="function"||typeof i.componentDidCatch=="function"&&(js===null||!js.has(i))){e=hi(n,e),n=Wx(2),i=Qs(t,n,2),i!==null&&(Xx(n,i,t,e),bl(i,2),Zi(i));break}}t=t.return}}function Pd(e,t,n){var i=e.pingCache;if(i===null){i=e.pingCache=new hE;var s=new Set;i.set(t,s)}else s=i.get(t),s===void 0&&(s=new Set,i.set(t,s));s.has(n)||(bm=!0,s.add(n),e=gE.bind(null,e,t,n),t.then(e,e))}function gE(e,t,n){var i=e.pingCache;i!==null&&i.delete(t),e.pingedLanes|=e.suspendedLanes&n,e.warmLanes&=~n,ge===e&&(Jt&n)===n&&(Ie===4||Ie===3&&(Jt&62914560)===Jt&&300>Yn()-Vu?(se&2)===0&&Wr(e,0):Mm|=n,kr===Jt&&(kr=0)),Zi(e)}function D_(e,t){t===0&&(t=Sv()),e=qa(e,t),e!==null&&(bl(e,t),Zi(e))}function yE(e){var t=e.memoizedState,n=0;t!==null&&(n=t.retryLane),D_(e,n)}function vE(e,t){var n=0;switch(e.tag){case 31:case 13:var i=e.stateNode,s=e.memoizedState;s!==null&&(n=s.retryLane);break;case 19:i=e.stateNode;break;case 22:i=e.stateNode._retryCache;break;default:throw Error($(314))}i!==null&&i.delete(t),D_(e,n)}function xE(e,t){return Fp(e,t)}var _u=null,gr=null,Ap=!1,Su=!1,Bd=!1,Ys=0;function Zi(e){e!==gr&&e.next===null&&(gr===null?_u=gr=e:gr=gr.next=e),Su=!0,Ap||(Ap=!0,SE())}function Cl(e,t){if(!Bd&&Su){Bd=!0;do for(var n=!1,i=_u;i!==null;){if(!t)if(e!==0){var s=i.pendingLanes;if(s===0)var a=0;else{var r=i.suspendedLanes,o=i.pingedLanes;a=(1<<31-Kn(42|e)+1)-1,a&=s&~(r&~o),a=a&201326741?a&201326741|1:a?a|2:0}a!==0&&(n=!0,Vy(i,a))}else a=Jt,a=Ru(i,i===ge?a:0,i.cancelPendingCommit!==null||i.timeoutHandle!==-1),(a&3)===0||Sl(i,a)||(n=!0,Vy(i,a));i=i.next}while(n);Bd=!1}}function _E(){N_()}function N_(){Su=Ap=!1;var e=0;Ys!==0&&RE()&&(e=Ys);for(var t=Yn(),n=null,i=_u;i!==null;){var s=i.next,a=L_(i,t);a===0?(i.next=null,n===null?_u=s:n.next=s,s===null&&(gr=n)):(n=i,(e!==0||(a&3)!==0)&&(Su=!0)),i=s}Qe!==0&&Qe!==5||Cl(e,!1),Ys!==0&&(Ys=0)}function L_(e,t){for(var n=e.suspendedLanes,i=e.pingedLanes,s=e.expirationTimes,a=e.pendingLanes&-62914561;0<a;){var r=31-Kn(a),o=1<<r,l=s[r];l===-1?((o&n)===0||(o&i)!==0)&&(s[r]=YM(o,t)):l<=t&&(e.expiredLanes|=o),a&=~o}if(t=ge,n=Jt,n=Ru(e,e===t?n:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),i=e.callbackNode,n===0||e===t&&(ue===2||ue===9)||e.cancelPendingCommit!==null)return i!==null&&i!==null&&fd(i),e.callbackNode=null,e.callbackPriority=0;if((n&3)===0||Sl(e,n)){if(t=n&-n,t===e.callbackPriority)return t;switch(i!==null&&fd(i),Hp(n)){case 2:case 8:n=xv;break;case 32:n=iu;break;case 268435456:n=_v;break;default:n=iu}return i=U_.bind(null,e),n=Fp(n,i),e.callbackPriority=t,e.callbackNode=n,t}return i!==null&&i!==null&&fd(i),e.callbackPriority=2,e.callbackNode=null,2}function U_(e,t){if(Qe!==0&&Qe!==5)return e.callbackNode=null,e.callbackPriority=0,null;var n=e.callbackNode;if(Gu()&&e.callbackNode!==n)return null;var i=Jt;return i=Ru(e,e===ge?i:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),i===0?null:(v_(e,i,t),L_(e,Yn()),e.callbackNode!=null&&e.callbackNode===n?U_.bind(null,e):null)}function Vy(e,t){if(Gu())return null;v_(e,t,!0)}function SE(){NE(function(){(se&6)!==0?Fp(vv,_E):N_()})}function Tm(){if(Ys===0){var e=Fr;e===0&&(e=bc,bc<<=1,(bc&261888)===0&&(bc=256)),Ys=e}return Ys}function Hy(e){return e==null||typeof e=="symbol"||typeof e=="boolean"?null:typeof e=="function"?e:Vc(""+e)}function ky(e,t){var n=t.ownerDocument.createElement("input");return n.name=t.name,n.value=t.value,e.id&&n.setAttribute("form",e.id),t.parentNode.insertBefore(n,t),e=new FormData(e),n.parentNode.removeChild(n),e}function bE(e,t,n,i,s){if(t==="submit"&&n&&n.stateNode===s){var a=Hy((s[Pn]||null).action),r=i.submitter;r&&(t=(t=r[Pn]||null)?Hy(t.formAction):r.getAttribute("formAction"),t!==null&&(a=t,r=null));var o=new Du("action","action",null,i,s);e.push({event:o,listeners:[{instance:null,listener:function(){if(i.defaultPrevented){if(Ys!==0){var l=r?ky(s,r):new FormData(s);gp(n,{pending:!0,data:l,method:s.method,action:a},null,l)}}else typeof a=="function"&&(o.preventDefault(),l=r?ky(s,r):new FormData(s),gp(n,{pending:!0,data:l,method:s.method,action:a},a,l))},currentTarget:s}]})}}for(Oc=0;Oc<sp.length;Oc++)Ic=sp[Oc],Gy=Ic.toLowerCase(),Wy=Ic[0].toUpperCase()+Ic.slice(1),Ti(Gy,"on"+Wy);var Ic,Gy,Wy,Oc;Ti(Xv,"onAnimationEnd");Ti(qv,"onAnimationIteration");Ti(Yv,"onAnimationStart");Ti("dblclick","onDoubleClick");Ti("focusin","onFocus");Ti("focusout","onBlur");Ti(V1,"onTransitionRun");Ti(H1,"onTransitionStart");Ti(k1,"onTransitionCancel");Ti(Zv,"onTransitionEnd");Br("onMouseEnter",["mouseout","mouseover"]);Br("onMouseLeave",["mouseout","mouseover"]);Br("onPointerEnter",["pointerout","pointerover"]);Br("onPointerLeave",["pointerout","pointerover"]);Ga("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));Ga("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));Ga("onBeforeInput",["compositionend","keypress","textInput","paste"]);Ga("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));Ga("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));Ga("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var pl="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),ME=new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(pl));function O_(e,t){t=(t&4)!==0;for(var n=0;n<e.length;n++){var i=e[n],s=i.event;i=i.listeners;t:{var a=void 0;if(t)for(var r=i.length-1;0<=r;r--){var o=i[r],l=o.instance,c=o.currentTarget;if(o=o.listener,l!==a&&s.isPropagationStopped())break t;a=o,s.currentTarget=c;try{a(s)}catch(u){au(u)}s.currentTarget=null,a=l}else for(r=0;r<i.length;r++){if(o=i[r],l=o.instance,c=o.currentTarget,o=o.listener,l!==a&&s.isPropagationStopped())break t;a=o,s.currentTarget=c;try{a(s)}catch(u){au(u)}s.currentTarget=null,a=l}}}}function Xt(e,t){var n=t[Jd];n===void 0&&(n=t[Jd]=new Set);var i=e+"__bubble";n.has(i)||(I_(t,e,2,!1),n.add(i))}function zd(e,t,n){var i=0;t&&(i|=4),I_(n,e,i,t)}var Pc="_reactListening"+Math.random().toString(36).slice(2);function Am(e){if(!e[Pc]){e[Pc]=!0,Av.forEach(function(n){n!=="selectionchange"&&(ME.has(n)||zd(n,!1,e),zd(n,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[Pc]||(t[Pc]=!0,zd("selectionchange",!1,t))}}function I_(e,t,n,i){switch(Z_(t)){case 2:var s=QE;break;case 8:s=jE;break;default:s=Dm}n=s.bind(null,t,n,e),s=void 0,!ep||t!=="touchstart"&&t!=="touchmove"&&t!=="wheel"||(s=!0),i?s!==void 0?e.addEventListener(t,n,{capture:!0,passive:s}):e.addEventListener(t,n,!0):s!==void 0?e.addEventListener(t,n,{passive:s}):e.addEventListener(t,n,!1)}function Fd(e,t,n,i,s){var a=i;if((t&1)===0&&(t&2)===0&&i!==null)t:for(;;){if(i===null)return;var r=i.tag;if(r===3||r===4){var o=i.stateNode.containerInfo;if(o===s)break;if(r===4)for(r=i.return;r!==null;){var l=r.tag;if((l===3||l===4)&&r.stateNode.containerInfo===s)return;r=r.return}for(;o!==null;){if(r=xr(o),r===null)return;if(l=r.tag,l===5||l===6||l===26||l===27){i=a=r;continue t}o=o.parentNode}}i=i.return}Ov(function(){var c=a,u=Wp(n),p=[];t:{var h=Kv.get(e);if(h!==void 0){var d=Du,m=e;switch(e){case"keypress":if(kc(n)===0)break t;case"keydown":case"keyup":d=v1;break;case"focusin":m="focus",d=yd;break;case"focusout":m="blur",d=yd;break;case"beforeblur":case"afterblur":d=yd;break;case"click":if(n.button===2)break t;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":d=Q0;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":d=r1;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":d=S1;break;case Xv:case qv:case Yv:d=c1;break;case Zv:d=M1;break;case"scroll":case"scrollend":d=s1;break;case"wheel":d=T1;break;case"copy":case"cut":case"paste":d=h1;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":d=$0;break;case"toggle":case"beforetoggle":d=w1}var b=(t&4)!==0,g=!b&&(e==="scroll"||e==="scrollend"),f=b?h!==null?h+"Capture":null:h;b=[];for(var y=c,M;y!==null;){var x=y;if(M=x.stateNode,x=x.tag,x!==5&&x!==26&&x!==27||M===null||f===null||(x=rl(y,f),x!=null&&b.push(ml(y,x,M))),g)break;y=y.return}0<b.length&&(h=new d(h,m,null,n,u),p.push({event:h,listeners:b}))}}if((t&7)===0){t:{if(h=e==="mouseover"||e==="pointerover",d=e==="mouseout"||e==="pointerout",h&&n!==tp&&(m=n.relatedTarget||n.fromElement)&&(xr(m)||m[Yr]))break t;if((d||h)&&(h=u.window===u?u:(h=u.ownerDocument)?h.defaultView||h.parentWindow:window,d?(m=n.relatedTarget||n.toElement,d=c,m=m?xr(m):null,m!==null&&(g=xl(m),b=m.tag,m!==g||b!==5&&b!==27&&b!==6)&&(m=null)):(d=null,m=c),d!==m)){if(b=Q0,x="onMouseLeave",f="onMouseEnter",y="mouse",(e==="pointerout"||e==="pointerover")&&(b=$0,x="onPointerLeave",f="onPointerEnter",y="pointer"),g=d==null?h:Go(d),M=m==null?h:Go(m),h=new b(x,y+"leave",d,n,u),h.target=g,h.relatedTarget=M,x=null,xr(u)===c&&(b=new b(f,y+"enter",m,n,u),b.target=M,b.relatedTarget=g,x=b),g=x,d&&m)e:{for(b=EE,f=d,y=m,M=0,x=f;x;x=b(x))M++;x=0;for(var E=y;E;E=b(E))x++;for(;0<M-x;)f=b(f),M--;for(;0<x-M;)y=b(y),x--;for(;M--;){if(f===y||y!==null&&f===y.alternate){b=f;break e}f=b(f),y=b(y)}b=null}else b=null;d!==null&&Xy(p,h,d,b,!1),m!==null&&g!==null&&Xy(p,g,m,b,!0)}}t:{if(h=c?Go(c):window,d=h.nodeName&&h.nodeName.toLowerCase(),d==="select"||d==="input"&&h.type==="file")var T=iy;else if(ny(h))if(Vv)T=B1;else{T=I1;var C=O1}else d=h.nodeName,!d||d.toLowerCase()!=="input"||h.type!=="checkbox"&&h.type!=="radio"?c&&Gp(c.elementType)&&(T=iy):T=P1;if(T&&(T=T(e,c))){Fv(p,T,n,u);break t}C&&C(e,h,c),e==="focusout"&&c&&h.type==="number"&&c.memoizedProps.value!=null&&$d(h,"number",h.value)}switch(C=c?Go(c):window,e){case"focusin":(ny(C)||C.contentEditable==="true")&&(br=C,np=c,Zo=null);break;case"focusout":Zo=np=br=null;break;case"mousedown":ip=!0;break;case"contextmenu":case"mouseup":case"dragend":ip=!1,oy(p,n,u);break;case"selectionchange":if(F1)break;case"keydown":case"keyup":oy(p,n,u)}var _;if(Yp)t:{switch(e){case"compositionstart":var A="onCompositionStart";break t;case"compositionend":A="onCompositionEnd";break t;case"compositionupdate":A="onCompositionUpdate";break t}A=void 0}else Sr?Bv(e,n)&&(A="onCompositionEnd"):e==="keydown"&&n.keyCode===229&&(A="onCompositionStart");A&&(Pv&&n.locale!=="ko"&&(Sr||A!=="onCompositionStart"?A==="onCompositionEnd"&&Sr&&(_=Iv()):(Ws=u,Xp="value"in Ws?Ws.value:Ws.textContent,Sr=!0)),C=bu(c,A),0<C.length&&(A=new j0(A,e,null,n,u),p.push({event:A,listeners:C}),_?A.data=_:(_=zv(n),_!==null&&(A.data=_)))),(_=R1?D1(e,n):N1(e,n))&&(A=bu(c,"onBeforeInput"),0<A.length&&(C=new j0("onBeforeInput","beforeinput",null,n,u),p.push({event:C,listeners:A}),C.data=_)),bE(p,e,c,n,u)}O_(p,t)})}function ml(e,t,n){return{instance:e,listener:t,currentTarget:n}}function bu(e,t){for(var n=t+"Capture",i=[];e!==null;){var s=e,a=s.stateNode;if(s=s.tag,s!==5&&s!==26&&s!==27||a===null||(s=rl(e,n),s!=null&&i.unshift(ml(e,s,a)),s=rl(e,t),s!=null&&i.push(ml(e,s,a))),e.tag===3)return i;e=e.return}return[]}function EE(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5&&e.tag!==27);return e||null}function Xy(e,t,n,i,s){for(var a=t._reactName,r=[];n!==null&&n!==i;){var o=n,l=o.alternate,c=o.stateNode;if(o=o.tag,l!==null&&l===i)break;o!==5&&o!==26&&o!==27||c===null||(l=c,s?(c=rl(n,a),c!=null&&r.unshift(ml(n,c,l))):s||(c=rl(n,a),c!=null&&r.push(ml(n,c,l)))),n=n.return}r.length!==0&&e.push({event:t,listeners:r})}var TE=/\r\n?/g,AE=/\u0000|\uFFFD/g;function qy(e){return(typeof e=="string"?e:""+e).replace(TE,`
`).replace(AE,"")}function P_(e,t){return t=qy(t),qy(e)===t}function de(e,t,n,i,s,a){switch(n){case"children":typeof i=="string"?t==="body"||t==="textarea"&&i===""||zr(e,i):(typeof i=="number"||typeof i=="bigint")&&t!=="body"&&zr(e,""+i);break;case"className":Tc(e,"class",i);break;case"tabIndex":Tc(e,"tabindex",i);break;case"dir":case"role":case"viewBox":case"width":case"height":Tc(e,n,i);break;case"style":Uv(e,i,a);break;case"data":if(t!=="object"){Tc(e,"data",i);break}case"src":case"href":if(i===""&&(t!=="a"||n!=="href")){e.removeAttribute(n);break}if(i==null||typeof i=="function"||typeof i=="symbol"||typeof i=="boolean"){e.removeAttribute(n);break}i=Vc(""+i),e.setAttribute(n,i);break;case"action":case"formAction":if(typeof i=="function"){e.setAttribute(n,"javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");break}else typeof a=="function"&&(n==="formAction"?(t!=="input"&&de(e,t,"name",s.name,s,null),de(e,t,"formEncType",s.formEncType,s,null),de(e,t,"formMethod",s.formMethod,s,null),de(e,t,"formTarget",s.formTarget,s,null)):(de(e,t,"encType",s.encType,s,null),de(e,t,"method",s.method,s,null),de(e,t,"target",s.target,s,null)));if(i==null||typeof i=="symbol"||typeof i=="boolean"){e.removeAttribute(n);break}i=Vc(""+i),e.setAttribute(n,i);break;case"onClick":i!=null&&(e.onclick=ds);break;case"onScroll":i!=null&&Xt("scroll",e);break;case"onScrollEnd":i!=null&&Xt("scrollend",e);break;case"dangerouslySetInnerHTML":if(i!=null){if(typeof i!="object"||!("__html"in i))throw Error($(61));if(n=i.__html,n!=null){if(s.children!=null)throw Error($(60));e.innerHTML=n}}break;case"multiple":e.multiple=i&&typeof i!="function"&&typeof i!="symbol";break;case"muted":e.muted=i&&typeof i!="function"&&typeof i!="symbol";break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"defaultValue":case"defaultChecked":case"innerHTML":case"ref":break;case"autoFocus":break;case"xlinkHref":if(i==null||typeof i=="function"||typeof i=="boolean"||typeof i=="symbol"){e.removeAttribute("xlink:href");break}n=Vc(""+i),e.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",n);break;case"contentEditable":case"spellCheck":case"draggable":case"value":case"autoReverse":case"externalResourcesRequired":case"focusable":case"preserveAlpha":i!=null&&typeof i!="function"&&typeof i!="symbol"?e.setAttribute(n,""+i):e.removeAttribute(n);break;case"inert":case"allowFullScreen":case"async":case"autoPlay":case"controls":case"default":case"defer":case"disabled":case"disablePictureInPicture":case"disableRemotePlayback":case"formNoValidate":case"hidden":case"loop":case"noModule":case"noValidate":case"open":case"playsInline":case"readOnly":case"required":case"reversed":case"scoped":case"seamless":case"itemScope":i&&typeof i!="function"&&typeof i!="symbol"?e.setAttribute(n,""):e.removeAttribute(n);break;case"capture":case"download":i===!0?e.setAttribute(n,""):i!==!1&&i!=null&&typeof i!="function"&&typeof i!="symbol"?e.setAttribute(n,i):e.removeAttribute(n);break;case"cols":case"rows":case"size":case"span":i!=null&&typeof i!="function"&&typeof i!="symbol"&&!isNaN(i)&&1<=i?e.setAttribute(n,i):e.removeAttribute(n);break;case"rowSpan":case"start":i==null||typeof i=="function"||typeof i=="symbol"||isNaN(i)?e.removeAttribute(n):e.setAttribute(n,i);break;case"popover":Xt("beforetoggle",e),Xt("toggle",e),Fc(e,"popover",i);break;case"xlinkActuate":as(e,"http://www.w3.org/1999/xlink","xlink:actuate",i);break;case"xlinkArcrole":as(e,"http://www.w3.org/1999/xlink","xlink:arcrole",i);break;case"xlinkRole":as(e,"http://www.w3.org/1999/xlink","xlink:role",i);break;case"xlinkShow":as(e,"http://www.w3.org/1999/xlink","xlink:show",i);break;case"xlinkTitle":as(e,"http://www.w3.org/1999/xlink","xlink:title",i);break;case"xlinkType":as(e,"http://www.w3.org/1999/xlink","xlink:type",i);break;case"xmlBase":as(e,"http://www.w3.org/XML/1998/namespace","xml:base",i);break;case"xmlLang":as(e,"http://www.w3.org/XML/1998/namespace","xml:lang",i);break;case"xmlSpace":as(e,"http://www.w3.org/XML/1998/namespace","xml:space",i);break;case"is":Fc(e,"is",i);break;case"innerText":case"textContent":break;default:(!(2<n.length)||n[0]!=="o"&&n[0]!=="O"||n[1]!=="n"&&n[1]!=="N")&&(n=n1.get(n)||n,Fc(e,n,i))}}function wp(e,t,n,i,s,a){switch(n){case"style":Uv(e,i,a);break;case"dangerouslySetInnerHTML":if(i!=null){if(typeof i!="object"||!("__html"in i))throw Error($(61));if(n=i.__html,n!=null){if(s.children!=null)throw Error($(60));e.innerHTML=n}}break;case"children":typeof i=="string"?zr(e,i):(typeof i=="number"||typeof i=="bigint")&&zr(e,""+i);break;case"onScroll":i!=null&&Xt("scroll",e);break;case"onScrollEnd":i!=null&&Xt("scrollend",e);break;case"onClick":i!=null&&(e.onclick=ds);break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"innerHTML":case"ref":break;case"innerText":case"textContent":break;default:if(!wv.hasOwnProperty(n))t:{if(n[0]==="o"&&n[1]==="n"&&(s=n.endsWith("Capture"),t=n.slice(2,s?n.length-7:void 0),a=e[Pn]||null,a=a!=null?a[n]:null,typeof a=="function"&&e.removeEventListener(t,a,s),typeof i=="function")){typeof a!="function"&&a!==null&&(n in e?e[n]=null:e.hasAttribute(n)&&e.removeAttribute(n)),e.addEventListener(t,i,s);break t}n in e?e[n]=i:i===!0?e.setAttribute(n,""):Fc(e,n,i)}}}function pn(e,t,n){switch(t){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"img":Xt("error",e),Xt("load",e);var i=!1,s=!1,a;for(a in n)if(n.hasOwnProperty(a)){var r=n[a];if(r!=null)switch(a){case"src":i=!0;break;case"srcSet":s=!0;break;case"children":case"dangerouslySetInnerHTML":throw Error($(137,t));default:de(e,t,a,r,n,null)}}s&&de(e,t,"srcSet",n.srcSet,n,null),i&&de(e,t,"src",n.src,n,null);return;case"input":Xt("invalid",e);var o=a=r=s=null,l=null,c=null;for(i in n)if(n.hasOwnProperty(i)){var u=n[i];if(u!=null)switch(i){case"name":s=u;break;case"type":r=u;break;case"checked":l=u;break;case"defaultChecked":c=u;break;case"value":a=u;break;case"defaultValue":o=u;break;case"children":case"dangerouslySetInnerHTML":if(u!=null)throw Error($(137,t));break;default:de(e,t,i,u,n,null)}}Dv(e,a,o,l,c,r,s,!1);return;case"select":Xt("invalid",e),i=r=a=null;for(s in n)if(n.hasOwnProperty(s)&&(o=n[s],o!=null))switch(s){case"value":a=o;break;case"defaultValue":r=o;break;case"multiple":i=o;default:de(e,t,s,o,n,null)}t=a,n=r,e.multiple=!!i,t!=null?Dr(e,!!i,t,!1):n!=null&&Dr(e,!!i,n,!0);return;case"textarea":Xt("invalid",e),a=s=i=null;for(r in n)if(n.hasOwnProperty(r)&&(o=n[r],o!=null))switch(r){case"value":i=o;break;case"defaultValue":s=o;break;case"children":a=o;break;case"dangerouslySetInnerHTML":if(o!=null)throw Error($(91));break;default:de(e,t,r,o,n,null)}Lv(e,i,s,a);return;case"option":for(l in n)n.hasOwnProperty(l)&&(i=n[l],i!=null)&&(l==="selected"?e.selected=i&&typeof i!="function"&&typeof i!="symbol":de(e,t,l,i,n,null));return;case"dialog":Xt("beforetoggle",e),Xt("toggle",e),Xt("cancel",e),Xt("close",e);break;case"iframe":case"object":Xt("load",e);break;case"video":case"audio":for(i=0;i<pl.length;i++)Xt(pl[i],e);break;case"image":Xt("error",e),Xt("load",e);break;case"details":Xt("toggle",e);break;case"embed":case"source":case"link":Xt("error",e),Xt("load",e);case"area":case"base":case"br":case"col":case"hr":case"keygen":case"meta":case"param":case"track":case"wbr":case"menuitem":for(c in n)if(n.hasOwnProperty(c)&&(i=n[c],i!=null))switch(c){case"children":case"dangerouslySetInnerHTML":throw Error($(137,t));default:de(e,t,c,i,n,null)}return;default:if(Gp(t)){for(u in n)n.hasOwnProperty(u)&&(i=n[u],i!==void 0&&wp(e,t,u,i,n,void 0));return}}for(o in n)n.hasOwnProperty(o)&&(i=n[o],i!=null&&de(e,t,o,i,n,null))}function wE(e,t,n,i){switch(t){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"input":var s=null,a=null,r=null,o=null,l=null,c=null,u=null;for(d in n){var p=n[d];if(n.hasOwnProperty(d)&&p!=null)switch(d){case"checked":break;case"value":break;case"defaultValue":l=p;default:i.hasOwnProperty(d)||de(e,t,d,null,i,p)}}for(var h in i){var d=i[h];if(p=n[h],i.hasOwnProperty(h)&&(d!=null||p!=null))switch(h){case"type":a=d;break;case"name":s=d;break;case"checked":c=d;break;case"defaultChecked":u=d;break;case"value":r=d;break;case"defaultValue":o=d;break;case"children":case"dangerouslySetInnerHTML":if(d!=null)throw Error($(137,t));break;default:d!==p&&de(e,t,h,d,i,p)}}jd(e,r,o,l,c,u,a,s);return;case"select":d=r=o=h=null;for(a in n)if(l=n[a],n.hasOwnProperty(a)&&l!=null)switch(a){case"value":break;case"multiple":d=l;default:i.hasOwnProperty(a)||de(e,t,a,null,i,l)}for(s in i)if(a=i[s],l=n[s],i.hasOwnProperty(s)&&(a!=null||l!=null))switch(s){case"value":h=a;break;case"defaultValue":o=a;break;case"multiple":r=a;default:a!==l&&de(e,t,s,a,i,l)}t=o,n=r,i=d,h!=null?Dr(e,!!n,h,!1):!!i!=!!n&&(t!=null?Dr(e,!!n,t,!0):Dr(e,!!n,n?[]:"",!1));return;case"textarea":d=h=null;for(o in n)if(s=n[o],n.hasOwnProperty(o)&&s!=null&&!i.hasOwnProperty(o))switch(o){case"value":break;case"children":break;default:de(e,t,o,null,i,s)}for(r in i)if(s=i[r],a=n[r],i.hasOwnProperty(r)&&(s!=null||a!=null))switch(r){case"value":h=s;break;case"defaultValue":d=s;break;case"children":break;case"dangerouslySetInnerHTML":if(s!=null)throw Error($(91));break;default:s!==a&&de(e,t,r,s,i,a)}Nv(e,h,d);return;case"option":for(var m in n)h=n[m],n.hasOwnProperty(m)&&h!=null&&!i.hasOwnProperty(m)&&(m==="selected"?e.selected=!1:de(e,t,m,null,i,h));for(l in i)h=i[l],d=n[l],i.hasOwnProperty(l)&&h!==d&&(h!=null||d!=null)&&(l==="selected"?e.selected=h&&typeof h!="function"&&typeof h!="symbol":de(e,t,l,h,i,d));return;case"img":case"link":case"area":case"base":case"br":case"col":case"embed":case"hr":case"keygen":case"meta":case"param":case"source":case"track":case"wbr":case"menuitem":for(var b in n)h=n[b],n.hasOwnProperty(b)&&h!=null&&!i.hasOwnProperty(b)&&de(e,t,b,null,i,h);for(c in i)if(h=i[c],d=n[c],i.hasOwnProperty(c)&&h!==d&&(h!=null||d!=null))switch(c){case"children":case"dangerouslySetInnerHTML":if(h!=null)throw Error($(137,t));break;default:de(e,t,c,h,i,d)}return;default:if(Gp(t)){for(var g in n)h=n[g],n.hasOwnProperty(g)&&h!==void 0&&!i.hasOwnProperty(g)&&wp(e,t,g,void 0,i,h);for(u in i)h=i[u],d=n[u],!i.hasOwnProperty(u)||h===d||h===void 0&&d===void 0||wp(e,t,u,h,i,d);return}}for(var f in n)h=n[f],n.hasOwnProperty(f)&&h!=null&&!i.hasOwnProperty(f)&&de(e,t,f,null,i,h);for(p in i)h=i[p],d=n[p],!i.hasOwnProperty(p)||h===d||h==null&&d==null||de(e,t,p,h,i,d)}function Yy(e){switch(e){case"css":case"script":case"font":case"img":case"image":case"input":case"link":return!0;default:return!1}}function CE(){if(typeof performance.getEntriesByType=="function"){for(var e=0,t=0,n=performance.getEntriesByType("resource"),i=0;i<n.length;i++){var s=n[i],a=s.transferSize,r=s.initiatorType,o=s.duration;if(a&&o&&Yy(r)){for(r=0,o=s.responseEnd,i+=1;i<n.length;i++){var l=n[i],c=l.startTime;if(c>o)break;var u=l.transferSize,p=l.initiatorType;u&&Yy(p)&&(l=l.responseEnd,r+=u*(l<o?1:(o-c)/(l-c)))}if(--i,t+=8*(a+r)/(s.duration/1e3),e++,10<e)break}}if(0<e)return t/e/1e6}return navigator.connection&&(e=navigator.connection.downlink,typeof e=="number")?e:5}var Cp=null,Rp=null;function Mu(e){return e.nodeType===9?e:e.ownerDocument}function Zy(e){switch(e){case"http://www.w3.org/2000/svg":return 1;case"http://www.w3.org/1998/Math/MathML":return 2;default:return 0}}function B_(e,t){if(e===0)switch(t){case"svg":return 1;case"math":return 2;default:return 0}return e===1&&t==="foreignObject"?0:e}function Dp(e,t){return e==="textarea"||e==="noscript"||typeof t.children=="string"||typeof t.children=="number"||typeof t.children=="bigint"||typeof t.dangerouslySetInnerHTML=="object"&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var Vd=null;function RE(){var e=window.event;return e&&e.type==="popstate"?e===Vd?!1:(Vd=e,!0):(Vd=null,!1)}var z_=typeof setTimeout=="function"?setTimeout:void 0,DE=typeof clearTimeout=="function"?clearTimeout:void 0,Ky=typeof Promise=="function"?Promise:void 0,NE=typeof queueMicrotask=="function"?queueMicrotask:typeof Ky<"u"?function(e){return Ky.resolve(null).then(e).catch(LE)}:z_;function LE(e){setTimeout(function(){throw e})}function la(e){return e==="head"}function Jy(e,t){var n=t,i=0;do{var s=n.nextSibling;if(e.removeChild(n),s&&s.nodeType===8)if(n=s.data,n==="/$"||n==="/&"){if(i===0){e.removeChild(s),qr(t);return}i--}else if(n==="$"||n==="$?"||n==="$~"||n==="$!"||n==="&")i++;else if(n==="html")sl(e.ownerDocument.documentElement);else if(n==="head"){n=e.ownerDocument.head,sl(n);for(var a=n.firstChild;a;){var r=a.nextSibling,o=a.nodeName;a[Ml]||o==="SCRIPT"||o==="STYLE"||o==="LINK"&&a.rel.toLowerCase()==="stylesheet"||n.removeChild(a),a=r}}else n==="body"&&sl(e.ownerDocument.body);n=s}while(n);qr(t)}function Qy(e,t){var n=e;e=0;do{var i=n.nextSibling;if(n.nodeType===1?t?(n._stashedDisplay=n.style.display,n.style.display="none"):(n.style.display=n._stashedDisplay||"",n.getAttribute("style")===""&&n.removeAttribute("style")):n.nodeType===3&&(t?(n._stashedText=n.nodeValue,n.nodeValue=""):n.nodeValue=n._stashedText||""),i&&i.nodeType===8)if(n=i.data,n==="/$"){if(e===0)break;e--}else n!=="$"&&n!=="$?"&&n!=="$~"&&n!=="$!"||e++;n=i}while(n)}function Np(e){var t=e.firstChild;for(t&&t.nodeType===10&&(t=t.nextSibling);t;){var n=t;switch(t=t.nextSibling,n.nodeName){case"HTML":case"HEAD":case"BODY":Np(n),kp(n);continue;case"SCRIPT":case"STYLE":continue;case"LINK":if(n.rel.toLowerCase()==="stylesheet")continue}e.removeChild(n)}}function UE(e,t,n,i){for(;e.nodeType===1;){var s=n;if(e.nodeName.toLowerCase()!==t.toLowerCase()){if(!i&&(e.nodeName!=="INPUT"||e.type!=="hidden"))break}else if(i){if(!e[Ml])switch(t){case"meta":if(!e.hasAttribute("itemprop"))break;return e;case"link":if(a=e.getAttribute("rel"),a==="stylesheet"&&e.hasAttribute("data-precedence"))break;if(a!==s.rel||e.getAttribute("href")!==(s.href==null||s.href===""?null:s.href)||e.getAttribute("crossorigin")!==(s.crossOrigin==null?null:s.crossOrigin)||e.getAttribute("title")!==(s.title==null?null:s.title))break;return e;case"style":if(e.hasAttribute("data-precedence"))break;return e;case"script":if(a=e.getAttribute("src"),(a!==(s.src==null?null:s.src)||e.getAttribute("type")!==(s.type==null?null:s.type)||e.getAttribute("crossorigin")!==(s.crossOrigin==null?null:s.crossOrigin))&&a&&e.hasAttribute("async")&&!e.hasAttribute("itemprop"))break;return e;default:return e}}else if(t==="input"&&e.type==="hidden"){var a=s.name==null?null:""+s.name;if(s.type==="hidden"&&e.getAttribute("name")===a)return e}else return e;if(e=pi(e.nextSibling),e===null)break}return null}function OE(e,t,n){if(t==="")return null;for(;e.nodeType!==3;)if((e.nodeType!==1||e.nodeName!=="INPUT"||e.type!=="hidden")&&!n||(e=pi(e.nextSibling),e===null))return null;return e}function F_(e,t){for(;e.nodeType!==8;)if((e.nodeType!==1||e.nodeName!=="INPUT"||e.type!=="hidden")&&!t||(e=pi(e.nextSibling),e===null))return null;return e}function Lp(e){return e.data==="$?"||e.data==="$~"}function Up(e){return e.data==="$!"||e.data==="$?"&&e.ownerDocument.readyState!=="loading"}function IE(e,t){var n=e.ownerDocument;if(e.data==="$~")e._reactRetry=t;else if(e.data!=="$?"||n.readyState!=="loading")t();else{var i=function(){t(),n.removeEventListener("DOMContentLoaded",i)};n.addEventListener("DOMContentLoaded",i),e._reactRetry=i}}function pi(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t==="$"||t==="$!"||t==="$?"||t==="$~"||t==="&"||t==="F!"||t==="F")break;if(t==="/$"||t==="/&")return null}}return e}var Op=null;function jy(e){e=e.nextSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="/$"||n==="/&"){if(t===0)return pi(e.nextSibling);t--}else n!=="$"&&n!=="$!"&&n!=="$?"&&n!=="$~"&&n!=="&"||t++}e=e.nextSibling}return null}function $y(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="$"||n==="$!"||n==="$?"||n==="$~"||n==="&"){if(t===0)return e;t--}else n!=="/$"&&n!=="/&"||t++}e=e.previousSibling}return null}function V_(e,t,n){switch(t=Mu(n),e){case"html":if(e=t.documentElement,!e)throw Error($(452));return e;case"head":if(e=t.head,!e)throw Error($(453));return e;case"body":if(e=t.body,!e)throw Error($(454));return e;default:throw Error($(451))}}function sl(e){for(var t=e.attributes;t.length;)e.removeAttributeNode(t[0]);kp(e)}var mi=new Map,tv=new Set;function Eu(e){return typeof e.getRootNode=="function"?e.getRootNode():e.nodeType===9?e:e.ownerDocument}var Ms=ae.d;ae.d={f:PE,r:BE,D:zE,C:FE,L:VE,m:HE,X:GE,S:kE,M:WE};function PE(){var e=Ms.f(),t=Hu();return e||t}function BE(e){var t=Zr(e);t!==null&&t.tag===5&&t.type==="form"?Ux(t):Ms.r(e)}var jr=typeof document>"u"?null:document;function H_(e,t,n){var i=jr;if(i&&typeof t=="string"&&t){var s=ui(t);s='link[rel="'+e+'"][href="'+s+'"]',typeof n=="string"&&(s+='[crossorigin="'+n+'"]'),tv.has(s)||(tv.add(s),e={rel:e,crossOrigin:n,href:t},i.querySelector(s)===null&&(t=i.createElement("link"),pn(t,"link",e),rn(t),i.head.appendChild(t)))}}function zE(e){Ms.D(e),H_("dns-prefetch",e,null)}function FE(e,t){Ms.C(e,t),H_("preconnect",e,t)}function VE(e,t,n){Ms.L(e,t,n);var i=jr;if(i&&e&&t){var s='link[rel="preload"][as="'+ui(t)+'"]';t==="image"&&n&&n.imageSrcSet?(s+='[imagesrcset="'+ui(n.imageSrcSet)+'"]',typeof n.imageSizes=="string"&&(s+='[imagesizes="'+ui(n.imageSizes)+'"]')):s+='[href="'+ui(e)+'"]';var a=s;switch(t){case"style":a=Xr(e);break;case"script":a=$r(e)}mi.has(a)||(e=Te({rel:"preload",href:t==="image"&&n&&n.imageSrcSet?void 0:e,as:t},n),mi.set(a,e),i.querySelector(s)!==null||t==="style"&&i.querySelector(Rl(a))||t==="script"&&i.querySelector(Dl(a))||(t=i.createElement("link"),pn(t,"link",e),rn(t),i.head.appendChild(t)))}}function HE(e,t){Ms.m(e,t);var n=jr;if(n&&e){var i=t&&typeof t.as=="string"?t.as:"script",s='link[rel="modulepreload"][as="'+ui(i)+'"][href="'+ui(e)+'"]',a=s;switch(i){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":a=$r(e)}if(!mi.has(a)&&(e=Te({rel:"modulepreload",href:e},t),mi.set(a,e),n.querySelector(s)===null)){switch(i){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":if(n.querySelector(Dl(a)))return}i=n.createElement("link"),pn(i,"link",e),rn(i),n.head.appendChild(i)}}}function kE(e,t,n){Ms.S(e,t,n);var i=jr;if(i&&e){var s=Rr(i).hoistableStyles,a=Xr(e);t=t||"default";var r=s.get(a);if(!r){var o={loading:0,preload:null};if(r=i.querySelector(Rl(a)))o.loading=5;else{e=Te({rel:"stylesheet",href:e,"data-precedence":t},n),(n=mi.get(a))&&wm(e,n);var l=r=i.createElement("link");rn(l),pn(l,"link",e),l._p=new Promise(function(c,u){l.onload=c,l.onerror=u}),l.addEventListener("load",function(){o.loading|=1}),l.addEventListener("error",function(){o.loading|=2}),o.loading|=4,Jc(r,t,i)}r={type:"stylesheet",instance:r,count:1,state:o},s.set(a,r)}}}function GE(e,t){Ms.X(e,t);var n=jr;if(n&&e){var i=Rr(n).hoistableScripts,s=$r(e),a=i.get(s);a||(a=n.querySelector(Dl(s)),a||(e=Te({src:e,async:!0},t),(t=mi.get(s))&&Cm(e,t),a=n.createElement("script"),rn(a),pn(a,"link",e),n.head.appendChild(a)),a={type:"script",instance:a,count:1,state:null},i.set(s,a))}}function WE(e,t){Ms.M(e,t);var n=jr;if(n&&e){var i=Rr(n).hoistableScripts,s=$r(e),a=i.get(s);a||(a=n.querySelector(Dl(s)),a||(e=Te({src:e,async:!0,type:"module"},t),(t=mi.get(s))&&Cm(e,t),a=n.createElement("script"),rn(a),pn(a,"link",e),n.head.appendChild(a)),a={type:"script",instance:a,count:1,state:null},i.set(s,a))}}function ev(e,t,n,i){var s=(s=Zs.current)?Eu(s):null;if(!s)throw Error($(446));switch(e){case"meta":case"title":return null;case"style":return typeof n.precedence=="string"&&typeof n.href=="string"?(t=Xr(n.href),n=Rr(s).hoistableStyles,i=n.get(t),i||(i={type:"style",instance:null,count:0,state:null},n.set(t,i)),i):{type:"void",instance:null,count:0,state:null};case"link":if(n.rel==="stylesheet"&&typeof n.href=="string"&&typeof n.precedence=="string"){e=Xr(n.href);var a=Rr(s).hoistableStyles,r=a.get(e);if(r||(s=s.ownerDocument||s,r={type:"stylesheet",instance:null,count:0,state:{loading:0,preload:null}},a.set(e,r),(a=s.querySelector(Rl(e)))&&!a._p&&(r.instance=a,r.state.loading=5),mi.has(e)||(n={rel:"preload",as:"style",href:n.href,crossOrigin:n.crossOrigin,integrity:n.integrity,media:n.media,hrefLang:n.hrefLang,referrerPolicy:n.referrerPolicy},mi.set(e,n),a||XE(s,e,n,r.state))),t&&i===null)throw Error($(528,""));return r}if(t&&i!==null)throw Error($(529,""));return null;case"script":return t=n.async,n=n.src,typeof n=="string"&&t&&typeof t!="function"&&typeof t!="symbol"?(t=$r(n),n=Rr(s).hoistableScripts,i=n.get(t),i||(i={type:"script",instance:null,count:0,state:null},n.set(t,i)),i):{type:"void",instance:null,count:0,state:null};default:throw Error($(444,e))}}function Xr(e){return'href="'+ui(e)+'"'}function Rl(e){return'link[rel="stylesheet"]['+e+"]"}function k_(e){return Te({},e,{"data-precedence":e.precedence,precedence:null})}function XE(e,t,n,i){e.querySelector('link[rel="preload"][as="style"]['+t+"]")?i.loading=1:(t=e.createElement("link"),i.preload=t,t.addEventListener("load",function(){return i.loading|=1}),t.addEventListener("error",function(){return i.loading|=2}),pn(t,"link",n),rn(t),e.head.appendChild(t))}function $r(e){return'[src="'+ui(e)+'"]'}function Dl(e){return"script[async]"+e}function nv(e,t,n){if(t.count++,t.instance===null)switch(t.type){case"style":var i=e.querySelector('style[data-href~="'+ui(n.href)+'"]');if(i)return t.instance=i,rn(i),i;var s=Te({},n,{"data-href":n.href,"data-precedence":n.precedence,href:null,precedence:null});return i=(e.ownerDocument||e).createElement("style"),rn(i),pn(i,"style",s),Jc(i,n.precedence,e),t.instance=i;case"stylesheet":s=Xr(n.href);var a=e.querySelector(Rl(s));if(a)return t.state.loading|=4,t.instance=a,rn(a),a;i=k_(n),(s=mi.get(s))&&wm(i,s),a=(e.ownerDocument||e).createElement("link"),rn(a);var r=a;return r._p=new Promise(function(o,l){r.onload=o,r.onerror=l}),pn(a,"link",i),t.state.loading|=4,Jc(a,n.precedence,e),t.instance=a;case"script":return a=$r(n.src),(s=e.querySelector(Dl(a)))?(t.instance=s,rn(s),s):(i=n,(s=mi.get(a))&&(i=Te({},n),Cm(i,s)),e=e.ownerDocument||e,s=e.createElement("script"),rn(s),pn(s,"link",i),e.head.appendChild(s),t.instance=s);case"void":return null;default:throw Error($(443,t.type))}else t.type==="stylesheet"&&(t.state.loading&4)===0&&(i=t.instance,t.state.loading|=4,Jc(i,n.precedence,e));return t.instance}function Jc(e,t,n){for(var i=n.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'),s=i.length?i[i.length-1]:null,a=s,r=0;r<i.length;r++){var o=i[r];if(o.dataset.precedence===t)a=o;else if(a!==s)break}a?a.parentNode.insertBefore(e,a.nextSibling):(t=n.nodeType===9?n.head:n,t.insertBefore(e,t.firstChild))}function wm(e,t){e.crossOrigin==null&&(e.crossOrigin=t.crossOrigin),e.referrerPolicy==null&&(e.referrerPolicy=t.referrerPolicy),e.title==null&&(e.title=t.title)}function Cm(e,t){e.crossOrigin==null&&(e.crossOrigin=t.crossOrigin),e.referrerPolicy==null&&(e.referrerPolicy=t.referrerPolicy),e.integrity==null&&(e.integrity=t.integrity)}var Qc=null;function iv(e,t,n){if(Qc===null){var i=new Map,s=Qc=new Map;s.set(n,i)}else s=Qc,i=s.get(n),i||(i=new Map,s.set(n,i));if(i.has(e))return i;for(i.set(e,null),n=n.getElementsByTagName(e),s=0;s<n.length;s++){var a=n[s];if(!(a[Ml]||a[hn]||e==="link"&&a.getAttribute("rel")==="stylesheet")&&a.namespaceURI!=="http://www.w3.org/2000/svg"){var r=a.getAttribute(t)||"";r=e+r;var o=i.get(r);o?o.push(a):i.set(r,[a])}}return i}function sv(e,t,n){e=e.ownerDocument||e,e.head.insertBefore(n,t==="title"?e.querySelector("head > title"):null)}function qE(e,t,n){if(n===1||t.itemProp!=null)return!1;switch(e){case"meta":case"title":return!0;case"style":if(typeof t.precedence!="string"||typeof t.href!="string"||t.href==="")break;return!0;case"link":if(typeof t.rel!="string"||typeof t.href!="string"||t.href===""||t.onLoad||t.onError)break;return t.rel==="stylesheet"?(e=t.disabled,typeof t.precedence=="string"&&e==null):!0;case"script":if(t.async&&typeof t.async!="function"&&typeof t.async!="symbol"&&!t.onLoad&&!t.onError&&t.src&&typeof t.src=="string")return!0}return!1}function G_(e){return!(e.type==="stylesheet"&&(e.state.loading&3)===0)}function YE(e,t,n,i){if(n.type==="stylesheet"&&(typeof i.media!="string"||matchMedia(i.media).matches!==!1)&&(n.state.loading&4)===0){if(n.instance===null){var s=Xr(i.href),a=t.querySelector(Rl(s));if(a){t=a._p,t!==null&&typeof t=="object"&&typeof t.then=="function"&&(e.count++,e=Tu.bind(e),t.then(e,e)),n.state.loading|=4,n.instance=a,rn(a);return}a=t.ownerDocument||t,i=k_(i),(s=mi.get(s))&&wm(i,s),a=a.createElement("link"),rn(a);var r=a;r._p=new Promise(function(o,l){r.onload=o,r.onerror=l}),pn(a,"link",i),n.instance=a}e.stylesheets===null&&(e.stylesheets=new Map),e.stylesheets.set(n,t),(t=n.state.preload)&&(n.state.loading&3)===0&&(e.count++,n=Tu.bind(e),t.addEventListener("load",n),t.addEventListener("error",n))}}var Hd=0;function ZE(e,t){return e.stylesheets&&e.count===0&&jc(e,e.stylesheets),0<e.count||0<e.imgCount?function(n){var i=setTimeout(function(){if(e.stylesheets&&jc(e,e.stylesheets),e.unsuspend){var a=e.unsuspend;e.unsuspend=null,a()}},6e4+t);0<e.imgBytes&&Hd===0&&(Hd=62500*CE());var s=setTimeout(function(){if(e.waitingForImages=!1,e.count===0&&(e.stylesheets&&jc(e,e.stylesheets),e.unsuspend)){var a=e.unsuspend;e.unsuspend=null,a()}},(e.imgBytes>Hd?50:800)+t);return e.unsuspend=n,function(){e.unsuspend=null,clearTimeout(i),clearTimeout(s)}}:null}function Tu(){if(this.count--,this.count===0&&(this.imgCount===0||!this.waitingForImages)){if(this.stylesheets)jc(this,this.stylesheets);else if(this.unsuspend){var e=this.unsuspend;this.unsuspend=null,e()}}}var Au=null;function jc(e,t){e.stylesheets=null,e.unsuspend!==null&&(e.count++,Au=new Map,t.forEach(KE,e),Au=null,Tu.call(e))}function KE(e,t){if(!(t.state.loading&4)){var n=Au.get(e);if(n)var i=n.get(null);else{n=new Map,Au.set(e,n);for(var s=e.querySelectorAll("link[data-precedence],style[data-precedence]"),a=0;a<s.length;a++){var r=s[a];(r.nodeName==="LINK"||r.getAttribute("media")!=="not all")&&(n.set(r.dataset.precedence,r),i=r)}i&&n.set(null,i)}s=t.instance,r=s.getAttribute("data-precedence"),a=n.get(r)||i,a===i&&n.set(null,s),n.set(r,s),this.count++,i=Tu.bind(this),s.addEventListener("load",i),s.addEventListener("error",i),a?a.parentNode.insertBefore(s,a.nextSibling):(e=e.nodeType===9?e.head:e,e.insertBefore(s,e.firstChild)),t.state.loading|=4}}var gl={$$typeof:fs,Provider:null,Consumer:null,_currentValue:Ua,_currentValue2:Ua,_threadCount:0};function JE(e,t,n,i,s,a,r,o,l){this.tag=1,this.containerInfo=e,this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.next=this.pendingContext=this.context=this.cancelPendingCommit=null,this.callbackPriority=0,this.expirationTimes=dd(-1),this.entangledLanes=this.shellSuspendCounter=this.errorRecoveryDisabledLanes=this.expiredLanes=this.warmLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=dd(0),this.hiddenUpdates=dd(null),this.identifierPrefix=i,this.onUncaughtError=s,this.onCaughtError=a,this.onRecoverableError=r,this.pooledCache=null,this.pooledCacheLanes=0,this.formState=l,this.incompleteTransitions=new Map}function W_(e,t,n,i,s,a,r,o,l,c,u,p){return e=new JE(e,t,n,r,l,c,u,p,o),t=1,a===!0&&(t|=24),a=Xn(3,null,null,t),e.current=a,a.stateNode=e,t=tm(),t.refCount++,e.pooledCache=t,t.refCount++,a.memoizedState={element:i,isDehydrated:n,cache:t},im(a),e}function X_(e){return e?(e=Tr,e):Tr}function q_(e,t,n,i,s,a){s=X_(s),i.context===null?i.context=s:i.pendingContext=s,i=Js(t),i.payload={element:n},a=a===void 0?null:a,a!==null&&(i.callback=a),n=Qs(e,i,t),n!==null&&(In(n,e,t),Jo(n,e,t))}function av(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var n=e.retryLane;e.retryLane=n!==0&&n<t?n:t}}function Rm(e,t){av(e,t),(e=e.alternate)&&av(e,t)}function Y_(e){if(e.tag===13||e.tag===31){var t=qa(e,67108864);t!==null&&In(t,e,67108864),Rm(e,67108864)}}function rv(e){if(e.tag===13||e.tag===31){var t=Jn();t=Vp(t);var n=qa(e,t);n!==null&&In(n,e,t),Rm(e,t)}}var wu=!0;function QE(e,t,n,i){var s=Lt.T;Lt.T=null;var a=ae.p;try{ae.p=2,Dm(e,t,n,i)}finally{ae.p=a,Lt.T=s}}function jE(e,t,n,i){var s=Lt.T;Lt.T=null;var a=ae.p;try{ae.p=8,Dm(e,t,n,i)}finally{ae.p=a,Lt.T=s}}function Dm(e,t,n,i){if(wu){var s=Ip(i);if(s===null)Fd(e,t,i,Cu,n),ov(e,i);else if(tT(s,e,t,n,i))i.stopPropagation();else if(ov(e,i),t&4&&-1<$E.indexOf(e)){for(;s!==null;){var a=Zr(s);if(a!==null)switch(a.tag){case 3:if(a=a.stateNode,a.current.memoizedState.isDehydrated){var r=Da(a.pendingLanes);if(r!==0){var o=a;for(o.pendingLanes|=2,o.entangledLanes|=2;r;){var l=1<<31-Kn(r);o.entanglements[1]|=l,r&=~l}Zi(a),(se&6)===0&&(yu=Yn()+500,Cl(0,!1))}}break;case 31:case 13:o=qa(a,2),o!==null&&In(o,a,2),Hu(),Rm(a,2)}if(a=Ip(i),a===null&&Fd(e,t,i,Cu,n),a===s)break;s=a}s!==null&&i.stopPropagation()}else Fd(e,t,i,null,n)}}function Ip(e){return e=Wp(e),Nm(e)}var Cu=null;function Nm(e){if(Cu=null,e=xr(e),e!==null){var t=xl(e);if(t===null)e=null;else{var n=t.tag;if(n===13){if(e=dv(t),e!==null)return e;e=null}else if(n===31){if(e=pv(t),e!==null)return e;e=null}else if(n===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null)}}return Cu=e,null}function Z_(e){switch(e){case"beforetoggle":case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"toggle":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 2;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 8;case"message":switch(VM()){case vv:return 2;case xv:return 8;case iu:case HM:return 32;case _v:return 268435456;default:return 32}default:return 32}}var Pp=!1,ta=null,ea=null,na=null,yl=new Map,vl=new Map,ks=[],$E="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");function ov(e,t){switch(e){case"focusin":case"focusout":ta=null;break;case"dragenter":case"dragleave":ea=null;break;case"mouseover":case"mouseout":na=null;break;case"pointerover":case"pointerout":yl.delete(t.pointerId);break;case"gotpointercapture":case"lostpointercapture":vl.delete(t.pointerId)}}function Fo(e,t,n,i,s,a){return e===null||e.nativeEvent!==a?(e={blockedOn:t,domEventName:n,eventSystemFlags:i,nativeEvent:a,targetContainers:[s]},t!==null&&(t=Zr(t),t!==null&&Y_(t)),e):(e.eventSystemFlags|=i,t=e.targetContainers,s!==null&&t.indexOf(s)===-1&&t.push(s),e)}function tT(e,t,n,i,s){switch(t){case"focusin":return ta=Fo(ta,e,t,n,i,s),!0;case"dragenter":return ea=Fo(ea,e,t,n,i,s),!0;case"mouseover":return na=Fo(na,e,t,n,i,s),!0;case"pointerover":var a=s.pointerId;return yl.set(a,Fo(yl.get(a)||null,e,t,n,i,s)),!0;case"gotpointercapture":return a=s.pointerId,vl.set(a,Fo(vl.get(a)||null,e,t,n,i,s)),!0}return!1}function K_(e){var t=xr(e.target);if(t!==null){var n=xl(t);if(n!==null){if(t=n.tag,t===13){if(t=dv(n),t!==null){e.blockedOn=t,W0(e.priority,function(){rv(n)});return}}else if(t===31){if(t=pv(n),t!==null){e.blockedOn=t,W0(e.priority,function(){rv(n)});return}}else if(t===3&&n.stateNode.current.memoizedState.isDehydrated){e.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}e.blockedOn=null}function $c(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var n=Ip(e.nativeEvent);if(n===null){n=e.nativeEvent;var i=new n.constructor(n.type,n);tp=i,n.target.dispatchEvent(i),tp=null}else return t=Zr(n),t!==null&&Y_(t),e.blockedOn=n,!1;t.shift()}return!0}function lv(e,t,n){$c(e)&&n.delete(t)}function eT(){Pp=!1,ta!==null&&$c(ta)&&(ta=null),ea!==null&&$c(ea)&&(ea=null),na!==null&&$c(na)&&(na=null),yl.forEach(lv),vl.forEach(lv)}function Bc(e,t){e.blockedOn===t&&(e.blockedOn=null,Pp||(Pp=!0,je.unstable_scheduleCallback(je.unstable_NormalPriority,eT)))}var zc=null;function cv(e){zc!==e&&(zc=e,je.unstable_scheduleCallback(je.unstable_NormalPriority,function(){zc===e&&(zc=null);for(var t=0;t<e.length;t+=3){var n=e[t],i=e[t+1],s=e[t+2];if(typeof i!="function"){if(Nm(i||n)===null)continue;break}var a=Zr(n);a!==null&&(e.splice(t,3),t-=3,gp(a,{pending:!0,data:s,method:n.method,action:i},i,s))}}))}function qr(e){function t(l){return Bc(l,e)}ta!==null&&Bc(ta,e),ea!==null&&Bc(ea,e),na!==null&&Bc(na,e),yl.forEach(t),vl.forEach(t);for(var n=0;n<ks.length;n++){var i=ks[n];i.blockedOn===e&&(i.blockedOn=null)}for(;0<ks.length&&(n=ks[0],n.blockedOn===null);)K_(n),n.blockedOn===null&&ks.shift();if(n=(e.ownerDocument||e).$$reactFormReplay,n!=null)for(i=0;i<n.length;i+=3){var s=n[i],a=n[i+1],r=s[Pn]||null;if(typeof a=="function")r||cv(n);else if(r){var o=null;if(a&&a.hasAttribute("formAction")){if(s=a,r=a[Pn]||null)o=r.formAction;else if(Nm(s)!==null)continue}else o=r.action;typeof o=="function"?n[i+1]=o:(n.splice(i,3),i-=3),cv(n)}}}function J_(){function e(a){a.canIntercept&&a.info==="react-transition"&&a.intercept({handler:function(){return new Promise(function(r){return s=r})},focusReset:"manual",scroll:"manual"})}function t(){s!==null&&(s(),s=null),i||setTimeout(n,20)}function n(){if(!i&&!navigation.transition){var a=navigation.currentEntry;a&&a.url!=null&&navigation.navigate(a.url,{state:a.getState(),info:"react-transition",history:"replace"})}}if(typeof navigation=="object"){var i=!1,s=null;return navigation.addEventListener("navigate",e),navigation.addEventListener("navigatesuccess",t),navigation.addEventListener("navigateerror",t),setTimeout(n,100),function(){i=!0,navigation.removeEventListener("navigate",e),navigation.removeEventListener("navigatesuccess",t),navigation.removeEventListener("navigateerror",t),s!==null&&(s(),s=null)}}}function Lm(e){this._internalRoot=e}Wu.prototype.render=Lm.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error($(409));var n=t.current,i=Jn();q_(n,i,e,t,null,null)};Wu.prototype.unmount=Lm.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;q_(e.current,2,null,e,null,null),Hu(),t[Yr]=null}};function Wu(e){this._internalRoot=e}Wu.prototype.unstable_scheduleHydration=function(e){if(e){var t=Tv();e={blockedOn:null,target:e,priority:t};for(var n=0;n<ks.length&&t!==0&&t<ks[n].priority;n++);ks.splice(n,0,e),n===0&&K_(e)}};var uv=hv.version;if(uv!=="19.2.8")throw Error($(527,uv,"19.2.8"));ae.findDOMNode=function(e){var t=e._reactInternals;if(t===void 0)throw typeof e.render=="function"?Error($(188)):(e=Object.keys(e).join(","),Error($(268,e)));return e=UM(t),e=e!==null?mv(e):null,e=e===null?null:e.stateNode,e};var nT={bundleType:0,version:"19.2.8",rendererPackageName:"react-dom",currentDispatcherRef:Lt,reconcilerVersion:"19.2.8"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"&&(Vo=__REACT_DEVTOOLS_GLOBAL_HOOK__,!Vo.isDisabled&&Vo.supportsFiber))try{_l=Vo.inject(nT),Zn=Vo}catch{}var Vo;Xu.createRoot=function(e,t){if(!fv(e))throw Error($(299));var n=!1,i="",s=Hx,a=kx,r=Gx;return t!=null&&(t.unstable_strictMode===!0&&(n=!0),t.identifierPrefix!==void 0&&(i=t.identifierPrefix),t.onUncaughtError!==void 0&&(s=t.onUncaughtError),t.onCaughtError!==void 0&&(a=t.onCaughtError),t.onRecoverableError!==void 0&&(r=t.onRecoverableError)),t=W_(e,1,!1,null,null,n,i,null,s,a,r,J_),e[Yr]=t.current,Am(e),new Lm(t)};Xu.hydrateRoot=function(e,t,n){if(!fv(e))throw Error($(299));var i=!1,s="",a=Hx,r=kx,o=Gx,l=null;return n!=null&&(n.unstable_strictMode===!0&&(i=!0),n.identifierPrefix!==void 0&&(s=n.identifierPrefix),n.onUncaughtError!==void 0&&(a=n.onUncaughtError),n.onCaughtError!==void 0&&(r=n.onCaughtError),n.onRecoverableError!==void 0&&(o=n.onRecoverableError),n.formState!==void 0&&(l=n.formState)),t=W_(e,1,!0,t,n??null,i,s,l,a,r,o,J_),t.context=X_(null),n=t.current,i=Jn(),i=Vp(i),s=Js(i),s.callback=null,Qs(n,s,i),n=i,t.current.lanes=n,bl(t,n),Zi(t),e[Yr]=t.current,Am(e),new Wu(t)};Xu.version="19.2.8"});var tS=Hi((X2,$_)=>{"use strict";function j_(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(j_)}catch(e){console.error(e)}}j_(),$_.exports=Q_()});var Kb=Hi(Xf=>{"use strict";var U2=Symbol.for("react.transitional.element"),O2=Symbol.for("react.fragment");function Zb(e,t,n){var i=null;if(n!==void 0&&(i=""+n),t.key!==void 0&&(i=""+t.key),"key"in t){n={};for(var s in t)s!=="key"&&(n[s]=t[s])}else n=t;return t=n.ref,{$$typeof:U2,type:e,key:i,ref:t!==void 0?t:null,props:n}}Xf.Fragment=O2;Xf.jsx=Zb;Xf.jsxs=Zb});var $g=Hi((fU,Jb)=>{"use strict";Jb.exports=Kb()});var Be=pc(gc()),jb=pc(tS());var Ai={id:"retro-football",runtimeVersion:"0.6.0",rulesVersion:"exhibition-handheld-v1",assetVersion:"football-handheld-atlas-v1",simulationHz:60};var iT=["kick","tackle","save","whistle","ui","goal","result","menu","crowd"],qu=class{constructor(t=new URL("./audio/",import.meta.url)){this.base=t;this.status="locked";this.ctx=null;this.master=null;this.limiter=null;this.buffers=new Map;this.active=new Set;this.loop=null;this.mode="ready";this.settings={music:.4,sfx:.7};this.disposed=!1;this.generation=0;this.loading=null;this.played={};this.controller=new AbortController}unlock(){if(!(this.disposed||this.status==="unavailable"||this.mode==="hidden"))try{if(this.ctx||(this.ctx=new AudioContext,this.master=this.ctx.createGain(),this.master.gain.value=.38,this.limiter=this.ctx.createDynamicsCompressor(),this.limiter.threshold.value=-12,this.limiter.knee.value=8,this.limiter.ratio.value=12,this.limiter.attack.value=.003,this.limiter.release.value=.12,this.master.connect(this.limiter),this.limiter.connect(this.ctx.destination)),this.ctx.resume().catch(()=>this.fail()),!this.loading){this.status="loading";let t=this.ctx;this.loading=Promise.all(iT.map(async n=>{let i=await fetch(new URL(n+".wav",this.base),{signal:this.controller.signal});if(!i.ok)throw Error("Audio unavailable");let s=await t.decodeAudioData(await i.arrayBuffer());this.disposed||this.buffers.set(n,s)})).then(()=>{this.disposed||(this.status="ready",this.sync(this.mode,!0))}).catch(()=>{this.disposed||this.fail()})}}catch{this.fail()}}fail(){this.status="unavailable",this.stop()}play(t,n=!1){if(!this.ctx||!this.master||this.status!=="ready"||this.disposed)return null;let i=this.buffers.get(t),s=t==="menu"||t==="result"?this.settings.music:this.settings.sfx*(t==="crowd"?.32:1);if(!i||s===0||this.active.size>=4)return null;let a=this.ctx.createBufferSource(),r=this.ctx.createGain();return a.buffer=i,a.loop=n,r.gain.value=s,a.connect(r),r.connect(this.master),this.active.add(a),a.onended=()=>{this.active.delete(a),a.disconnect(),r.disconnect(),this.loop===a&&(this.loop=null)},a.start(),this.played[t]=(this.played[t]??0)+1,a}stop(){this.generation++;for(let t of this.active){try{t.stop()}catch{}t.disconnect()}this.active.clear(),this.loop=null}sync(t,n=!1){if(this.disposed||!n&&t===this.mode)return;let i=this.mode==="hidden"||this.mode==="paused";if(this.mode=t,this.stop(),t==="paused"||t==="hidden"){this.ctx?.suspend().catch(()=>{});return}this.ctx?.state==="suspended"&&this.ctx.resume().catch(()=>{}),t==="playing"?this.loop=this.play("crowd",!0):t==="ready"||t==="halftime"?(this.loop=this.play("menu",!0),t==="halftime"&&this.play("whistle")):t==="complete"&&!i&&(this.play("whistle"),this.play("result"))}event(t){if(this.mode!=="playing")return;let n=t.kind;n==="pass"||n==="shot"||n==="keeper-punt"?this.play("kick"):n==="tackle-contact"?this.play("tackle"):n==="save"?this.play("save"):n==="goal"?this.play("goal"):(n==="restart-awarded"||n==="second-half")&&this.play("whistle")}ui(){this.play("ui")}setSettings(t){this.settings={...t},this.mode==="complete"?this.stop():this.sync(this.mode,!0)}diagnostics(){return{status:this.status,active:this.active.size,context:this.ctx?.state??"none",played:{...this.played}}}dispose(){this.disposed||(this.disposed=!0,this.controller.abort(),this.stop(),this.buffers.clear(),this.master?.disconnect(),this.limiter?.disconnect(),this.ctx?.close().catch(()=>{}),this.status="disposed")}};var sT=(e,t)=>Math.hypot(e.x-t.x,e.y-t.y,e.z-t.z);function Ki(e,t,n,i,s){let a={x:e.x-n.x,y:e.y-n.y,z:e.z-n.z},r={x:t.x-e.x-i.x+n.x,y:t.y-e.y-i.y+n.y,z:t.z-e.z-i.z+n.z},o=r.x*r.x+r.y*r.y+r.z*r.z,l=2*(a.x*r.x+a.y*r.y+a.z*r.z),c=a.x*a.x+a.y*a.y+a.z*a.z-s*s,u;if(c<=0)u=0;else{if(o<1e-12)return null;let m=l*l-4*o*c;if(m<0||(u=(-l-Math.sqrt(m))/(2*o),u<0||u>1))return null}let p=(m,b)=>({x:m.x+(b.x-m.x)*u,y:m.y+(b.y-m.y)*u,z:m.z+(b.z-m.z)*u}),h=p(e,t),d=p(n,i);return{fraction:u,anchor:h,ball:d,distance:sT(h,d)}}var Pe=1/60,eS=5400,nS=75,Ae=(e,t,n)=>Math.max(t,Math.min(n,e)),Es=e=>({x:48+e.x*6,y:80+e.y*3.2}),iS=e=>{let t=Es(e);return{x:Math.round(t.x),y:Math.round(t.y)}},kt=e=>({x:e.x*6,y:e.y*3.2,z:e.z}),wi=e=>({x:e.x/6,y:e.y/3.2,z:e.z}),Ne=(e,t)=>Math.hypot(e.x-t.x,e.y-t.y),Za=(e,t)=>({x:160+(e.y-34)*16,y:t.planeY+(t.direction===-1?e.x:105-e.x)*t.depthScale,z:e.z}),sS=(e,t)=>{let n=Za(e,t);return{x:n.x,y:n.y-n.z}},Um=(e,t)=>({x:t.direction===1?105-(e.y-t.planeY)/t.depthScale:(e.y-t.planeY)/t.depthScale,y:34+(e.x-160)/16,z:e.z});var ln={maxCatchSpeed:29,maxVerticalSpeed:140,minimumHeight:6,maximumHeight:45,gripRadius:8,dropAge:80,puntAge:88,puntEnd:98,endAge:138,carrySpeed:1.8,gravity:280};function aS(e){return e<10?"standing-secure":e<46?"standing-tuck":e<58?"carry":e<70?"standing-tuck":e<80?"release-prep":e<88?"drop":e<98?"punt":e<110?"follow-through":e<120?"settle":"ready"}function rS(e,t,n){let i=Math.abs(t),s=Math.abs(n),a=e==="E"||e==="W";return i<1e-4&&s<1e-4?e:a&&s<=i*1.2?t>=0?"E":"W":!a&&i<=s*1.2?n>=0?"S":"N":i>=s?t>=0?"E":"W":n>=0?"S":"N"}function oS(e,t){let n=t.movement.cycles[e.facing],i=e.moving?n[Math.floor(((e.strideDistance??0)+1e-8)/.72)%n.length]:t.movement.idle[e.facing];return{pose:i.id,mirror:i.mirror}}var Ci={width:384,height:224,lookAhead:22};function lS(e,t,n,i=Ci.width){let s=(r,o,l)=>Math.max(o,Math.min(l,r)),a={x:s(e.x-i/2+s(t.x*.48,-Ci.lookAhead,Ci.lookAhead),0,726-i),y:s(e.y-132+s(t.y*.16,-10,10),-26,110)};return{x:Math.round(n.x+(a.x-n.x)*.22),y:Math.round(n.y+(a.y-n.y)*.22)}}var aT=[{x:4,y:34},{x:24,y:10},{x:21,y:26},{x:21,y:42},{x:24,y:58},{x:43,y:10},{x:40,y:26},{x:40,y:42},{x:43,y:58},{x:62,y:25},{x:62,y:43}],rT=[["tackle-windup",8],["tackle-entry",12],["tackle-slide",8],["tackle-follow",8],["tackle-sit",8],["tackle-crouch",6],["tackle-rise",6],["tackle-recover-ready",8],["compress",6],["settle",6],["ready",8]],to=e=>e===0?1:0,Zu=class{constructor(t,n={}){this.assets=t;this.options=n;this.viewportWidth=384;this.poses=new Map(t.records.map(i=>[i.id,i])),this.state=this.initial(1),this.formation(0)}setViewportWidth(t){let n=Ae(Math.round(t),320,640);this.state.camera.x=Ae(this.state.camera.x+(this.viewportWidth-n)/2,0,726-n),this.viewportWidth=n}initial(t){return{aerial:null,shotView:null,airContacts:[0,0],airCollections:[0,0],status:"ready",phase:"restart",tick:0,eventSerial:0,round:t,seed:4811,half:1,halfTicks:0,score:[0,0],players:[],selected:9,owner:null,ball:{x:52.5,y:34,z:0,vx:0,vy:0,vz:0},lastTouch:0,lastKicker:null,releaseTick:-999,restart:null,goalAge:0,held:{left:!1,right:!1,up:!1,down:!1},inputSources:{left:[],right:[],up:[],down:[]},events:[],message:"Two 90-second halves. Harbour attacks right first. Start exhibition.",passes:[0,0],shots:[0,0],saves:[0,0],possessionTicks:[0,0],camera:{x:220,y:40},pendingKickoff:0,noDoubleTouch:null,lastContact:null}}attack(t){return t===0==(this.state.half===1)?1:-1}emit(t,n={}){let i=this.state,s={kind:t,tick:i.tick,sequence:++i.eventSerial,...n};i.events.push(s),i.events.length>80&&i.events.shift(),i.lastContact=s}random(){let t=this.state.seed;return t^=t<<13,t^=t>>>17,t^=t<<5,this.state.seed=t>>>0,this.state.seed/4294967296}clear(){let t=this.state;for(let n of["left","right","up","down"])t.held[n]=!1,t.inputSources[n]=[]}restart(){this.state=this.initial(this.state.round+1),this.formation(0)}snapshot(){return structuredClone(this.state)}formation(t){let n=this.state;n.players=[];for(let i of[0,1])for(let s=0;s<11;s++){let a=aT[s],r=this.attack(i),o=r===1?a.x:105-a.x;s>0&&(o=i===t?r===1?Math.min(o,48):Math.max(o,57):r===1?Math.min(o,42):Math.max(o,63));let l={x:r===1?a.x:105-a.x,y:a.y};n.players.push({id:i*11+s,team:i,role:s===0?"keeper":"outfield",slot:s,x:o,y:a.y,facing:r===1?"E":"W",moving:!1,motionAge:0,home:l,action:null,cooldown:0,decisionTick:n.tick+20+s*5})}n.selected=9}setBall(t){Object.assign(this.state.ball,t,{vx:0,vy:0,vz:0})}beginRestart(t,n,i){let s=this.state;this.exitShotView("restart"),s.aerial=null,this.clear(),s.phase="restart",s.owner=null,s.noDoubleTouch=null;for(let l of s.players)l.action=null,delete l.keeperCycle,delete l.contactView,delete l.aiCarryY,l.moving=!1;let r=s.players.filter(l=>l.team===n&&(t==="goal-kick"?l.role==="keeper":l.role==="outfield")).sort((l,c)=>Ne(l,i)-Ne(c,i)||l.id-c.id)[0],o=i;s.restart={kind:t,team:n,point:{...o},taker:r.id,age:0},r.x=o.x,r.y=o.y,r.cooldown=0,r.facing=this.attack(n)===1?"E":"W";for(let l of s.players){if(l===r)continue;let c=Ne(l,o),u=l.team!==n?t==="kickoff"?10:9.15:4;if(c<u){let p=Math.atan2(l.y-o.y,l.x-o.x);l.x=Ae(o.x+Math.cos(p)*u,2,103),l.y=Ae(o.y+Math.sin(p)*u,2,66)}t==="goal-kick"&&l.team!==n&&(l.x=this.attack(n)===1?Math.max(19,l.x):Math.min(86,l.x))}n===0&&(s.selected=r.id),this.setBall({...o,z:0}),s.message=`${t.toUpperCase()} \u2014 ${n===0?"Harbour: J / K / L to take":"Orchard preparing"}.`,this.emit("restart-awarded",{restart:t,team:n,point:{...i},player:r.id})}kickoff(t){this.formation(t),this.beginRestart("kickoff",t,{x:52.5,y:34})}command(t){let n=this.state;if(t.type==="clear"){this.clear();return}if(t.type==="pause"){n.status==="playing"?(n.status="paused",this.clear()):n.status==="paused"&&(n.status="playing");return}if(t.type==="resume"){n.status==="paused"&&(n.status="playing");return}if(t.type==="start"){n.status==="ready"?(n.status="playing",this.kickoff(0)):n.status==="halftime"&&(n.half=2,n.halfTicks=0,n.status="playing",this.kickoff(1),this.emit("second-half"),n.message="Second half \u2014 Harbour attacks LEFT. Orchard kickoff.");return}if(t.type==="next"){n.status==="complete"&&this.restart();return}if(n.status!=="playing")return;if(t.type==="hold"){if(t.value&&n.shotView&&n.shotView.phase!=="aim")return;let s=n.inputSources[t.key];t.value&&!s.includes(t.source)&&s.push(t.source),t.value||(n.inputSources[t.key]=s.filter(a=>a!==t.source)),n.held[t.key]=n.inputSources[t.key].length>0;return}if(n.phase==="goal")return;let i=n.players[n.selected];if(n.shotView?.phase==="aim"){t.type==="A"&&this.confirmChance();return}if(!n.shotView){if(n.phase==="restart"){if(n.restart.team!==0||i.action)return;this.takeRestart(t.type==="B");return}if(!(i.action||i.keeperCycle||i.cooldown>0))if(n.owner===i.id)t.type==="A"?this.attackProgress(i)>70&&this.canChance(i)?this.beginChance(i):this.kick(i,this.attackProgress(i)>70?"shot":"pass"):this.kick(i,t.type==="B"?"loft":"pass",t.type==="C");else if(t.type==="C"){let s=n.players.filter(r=>r.team===0&&r.role==="outfield"&&!r.action).sort((r,o)=>Ne(r,n.ball)-Ne(o,n.ball)||r.id-o.id),a=s.findIndex(r=>r.id===n.selected);n.selected=s[(a+1)%Math.min(3,s.length)].id}else t.type==="A"&&n.owner===null&&n.aerial?.controlledBy===null?this.control(i):(t.type==="A"||t.type==="B")&&this.tackle(i)}}attackProgress(t){return this.attack(t.team)===1?t.x:105-t.x}target(t,n=!1){let i=this.state,s=this.attack(t.team),a=this.direction(),r=t.team===0&&t.id===i.selected&&Ne(a,{x:0,y:0})>.1;return i.players.filter(o=>o.team===t.team&&o.role==="outfield"&&o.id!==t.id&&!o.action).sort((o,l)=>{let c=u=>{let p=Ne(t,u),h=(u.x-t.x)/Math.max(1,p),d=(u.y-t.y)/Math.max(1,p);return p*(n?1.4:.35)-(r?(h*a.x+d*a.y)*18:(u.x-t.x)*s*.6)};return c(o)-c(l)||o.id-l.id})[0]}direction(){let t=this.state.held,n=Number(t.right)-Number(t.left),i=Number(t.down)-Number(t.up),s=Math.hypot(n,i);return s?{x:n/s,y:i/s}:{x:0,y:0}}kick(t,n,i=!1,s){if(t.action||t.cooldown>0||this.state.owner!==t.id)return;if(n==="shot"&&!this.state.shotView&&this.canChance(t)){this.beginChance(t,!1);return}let a=this.state.shotView,r=n==="shot"?{x:this.attack(t.team)===1?108:-3,y:a&&a.shooter===t.id?34+(a.aim.x-160)/16:Ae(34+(t.team===0&&t.id===this.state.selected&&this.state.held.up?-6:t.team===0&&t.id===this.state.selected&&this.state.held.down?6:(this.random()-.5)*5),28,40)}:s??this.target(t,i);t.action={kind:n,age:0,target:{x:r.x,y:r.y},targetPlayer:"id"in r?r.id:void 0,released:!1,hit:!1,direction:{x:this.attack(t.team),y:0}},t.facing=this.attack(t.team)===1?"E":"W"}takeRestart(t=!1){let n=this.state,i=n.restart,s=n.players[i.taker],a=this.target(s,!0);s.action={kind:i.kind==="throw-in"?"throw":i.kind==="penalty"?"shot":t?"loft":"pass",age:0,target:i.kind==="penalty"?{x:this.attack(s.team)===1?108:-3,y:34}:{x:a.x,y:a.y},released:!1,hit:!1,direction:{x:this.attack(s.team),y:0}}}tackle(t){if(t.role==="keeper"||t.action||t.cooldown>0)return;let n=this.direction(),i=t.team===0&&t.id===this.state.selected&&Ne(n,{x:0,y:0})>.1?n:{x:Yu(this.state.ball.x-t.x),y:0};t.facing=i.x>=0?"E":"W",t.action={kind:"tackle",age:0,target:{x:0,y:0},released:!1,hit:!1,direction:{x:i.x>=0?1:-1,y:0}}}view(t){let n,i=!1,s=t.action;if(t.contactView)return t.contactView.view;if(t.role==="keeper"){if(t.keeperCycle)return{pose:"keeper-"+aS(t.keeperCycle.age),mirror:this.attack(t.team)<0};let a=this.state.shotView;if(a?.keeper===t.id)return{pose:Math.abs(a.aim.x-160)>=26?a.age<30?"keeper-01":"keeper-03":"keeper-00",mirror:a.aim.x<160};let r=this.state.ball.vx*this.attack(t.team)<-8&&Math.abs(this.state.ball.x-t.x)<20;if(this.options.keeperCatches!==!1&&this.poses.has("keeper-reach")&&!a){let o=this.state.ball;if(Math.hypot(o.vx,o.vy)<=ln.maxCatchSpeed&&o.z>=ln.minimumHeight&&o.z<=ln.maximumHeight&&o.vx*this.attack(t.team)<-1&&Math.abs(o.x-t.x)<18)return{pose:"keeper-reach",mirror:this.attack(t.team)<0};if(!r)return{pose:"keeper-ready",mirror:this.attack(t.team)<0}}return n=r&&this.state.ball.z<24?"keeper-03":"keeper-00",i=n==="keeper-03"?this.attack(t.team)<0:this.attack(t.team)>0,{pose:n,mirror:i}}if(s?.kind==="tackle"){let a=s.age;n="ready";for(let[r,o]of rT){if(a<o){n=r;break}a-=o}i=s.direction.x<0}else if(s?.kind==="control")n=s.age<20?"signal":s.age<28?"crouch":s.age<36?"compress":s.age<44?"settle":"ready",i=s.direction.x>0;else if(s?.kind==="stagger")n=s.age<6?"crouch":s.age<12?"compress":s.age<18?"settle":"ready",i=s.direction.x>0;else if(s?.kind==="throw")n=s.age<4?"throw-hold":s.age<12?"throw-overhead":s.age<18?"throw-release":"throw-follow",i=s.target.x<t.x;else if(s)n=s.age<12?"kick-prep":s.age<18?"kick-contact":s.age<26?"kick-follow":"settle",i=s.target.x<t.x;else{let a=oS(t,this.assets);n=a.pose,i=a.mirror}return{pose:t.team===1?"orchard-"+n:n,mirror:i}}anchor(t,n="foot",i=this.view(t)){let s=this.poses.get(i.pose),[a,r]=s.anchors.ground,o=s.anchors[n]??s.anchors.boot??s.anchors.foot??s.anchors.ground,l=iS(t);return this.state.shotView?.keeper===t.id&&(n==="leftHand"||n==="rightHand")?{x:t.x,y:(Math.round(160+(t.y-34)*16)+(i.mirror?a-o[0]-1:o[0]-a)-160)/16+34,z:Math.max(0,r-o[1])}:{x:(l.x-48+(i.mirror?a-o[0]-1:o[0]-a))/6,y:(l.y-80)/3.2,z:Math.max(0,r-o[1])}}throwAnchor(t){return this.anchor(t,"ball")}attach(t){let n=this.anchor(t,t.keeperCycle&&!t.keeperCycle.dropped||t.action?.kind==="throw"?"ball":"foot");this.setBall(n)}canSecure(t,n,i){let s=this.state;if(this.options.keeperCatches===!1||s.shotView||s.owner!==null||t.keeperCycle||!this.poses.has("keeper-standing-secure")||i.vx*this.attack(t.team)>=-1||Math.hypot(i.vx,i.vy)>ln.maxCatchSpeed||Math.abs(i.vz)>ln.maxVerticalSpeed||n.z<ln.minimumHeight||n.z>ln.maximumHeight)return!1;let a=this.anchor(t,"ball",{pose:"keeper-standing-secure",mirror:this.attack(t.team)<0});return Math.hypot((a.x-n.x)*6,(a.y-n.y)*3.2,a.z-n.z)<=ln.gripRadius}secureKeeper(t,n){let i=this.state;t.keeperCycle={age:0,dropped:!1,punted:!1,releaseTick:-1},t.action=null,delete t.contactView,t.cooldown=0,t.moving=!1,i.owner=t.id,i.aerial=null,i.noDoubleTouch=null,i.lastTouch=t.team,i.lastKicker=t.id,i.releaseTick=i.tick,i.saves[t.team]++,this.attach(t),this.emit("keeper-secure",{player:t.id,team:t.team,worldBall:{...n},resolvedGrip:{...i.ball},pose:this.view(t).pose}),i.message="CAUGHT - keeper preparing distribution."}advanceKeeper(t){let n=this.state,i=t.keeperCycle;if(i.age++,t.moving=!1,!i.dropped&&n.owner!==t.id){delete t.keeperCycle,t.cooldown=24,this.emit("keeper-hold-interrupted",{player:t.id});return}if(i.dropped&&!i.punted&&(n.owner!==null||n.lastKicker!==t.id)){delete t.keeperCycle,t.cooldown=24,this.emit("keeper-drop-interrupted",{player:t.id});return}if(i.age>=46&&i.age<58&&!i.dropped&&this.move(t,{x:t.x+this.attack(t.team),y:t.y},ln.carrySpeed),i.age===ln.dropAge){let s={...n.ball},a={pose:"keeper-punt",mirror:this.attack(t.team)<0},r=this.anchor(t,"kickingFoot",a),o={...r,x:r.x+this.attack(t.team)*3/6},l=ln.puntAge-ln.dropAge+1,c=Math.pow(.995,.5),u=Pe*(1-Math.pow(c,l))/(1-c);n.owner=null,n.aerial=null,i.dropped=!0,i.releaseTick=n.tick,n.lastTouch=t.team,n.lastKicker=t.id,n.releaseTick=n.tick,n.ball.vx=(o.x-s.x)/u,n.ball.vy=(o.y-s.y)/u,n.ball.vz=(o.z-s.z+ln.gravity*Pe*Pe*l*(l-1)/2)/(l*Pe),this.emit("keeper-drop",{player:t.id,team:t.team,worldPoint:s,target:o,pose:"keeper-release-prep"}),n.message="Keeper drop - ball in play."}i.age===ln.puntEnd&&!i.punted&&(this.emit("keeper-punt-missed",{player:t.id}),n.message="Loose ball - keeper missed distribution."),i.age>=ln.endAge&&(delete t.keeperCycle,t.cooldown=1,this.emit("keeper-recovered",{player:t.id}))}puntKeeper(t,n){let i=this.state,s=t.keeperCycle;s.punted=!0,this.setBall(n);let a=this.target(t),r=a.x-n.x,o=a.y-n.y,l=Math.max(.5,Math.hypot(r,o));i.ball.vx=r/l*25,i.ball.vy=o/l*25,i.ball.vz=80,i.owner=null,i.aerial=null,i.lastTouch=t.team,i.lastKicker=t.id,i.releaseTick=i.tick,i.passes[t.team]++,this.emit("keeper-punt",{player:t.id,team:t.team,targetPlayer:a.id,worldPoint:n,pose:this.view(t).pose,anchor:"kickingFoot"}),i.message="Keeper distribution - play on."}release(t,n){let i=this.state;if(i.owner!==t.id&&!(i.phase==="restart"&&i.restart?.taker===t.id)){n.cancelled=!0,this.emit("delivery-cancelled",{player:t.id,reason:"possession-lost"});return}let s=n.kind==="throw"?this.throwAnchor(t):this.anchor(t);this.setBall(s);let a=n.target.x-s.x,r=n.target.y-s.y,o=Math.max(.5,Math.hypot(a,r)),l=n.kind==="shot"?31:n.kind==="loft"?23:22;n.kind==="throw"&&(l=14);let c=o/l;if(i.ball.vx=a/o*l,i.ball.vy=r/o*l,i.ball.vz=n.kind==="loft"?Math.min(230,c*140):n.kind==="throw"?30:n.kind==="shot"?60:0,i.owner=null,i.aerial=null,n.kind==="loft"&&this.loft(t,n,s),n.kind==="shot"&&i.shotView?.shooter===t.id){let u=i.shotView;u.phase="flight",u.age=0;let p=this.attack(t.team)===1?105-s.x:s.x,h=Math.max(1,Math.ceil(p/Math.max(.01,Math.abs(i.ball.vx))/Pe)),d=Math.pow(.995,.5),m=Pe*(1-Math.pow(d,h))/(1-d),b=h*Pe,g=this.attack(t.team)===1?105:-0,f=34+(u.aim.x-160)/16;i.ball.vx=(g-s.x)/m,i.ball.vy=(f-s.y)/m,i.ball.vz=(u.planeY-u.aim.y-s.z+140*b*b)/b}else n.kind!=="shot"&&this.exitShotView("delivery");i.lastTouch=t.team,i.lastKicker=t.id,i.releaseTick=i.tick,n.released=!0,n.kind==="shot"?i.shots[t.team]++:i.passes[t.team]++,i.phase==="restart"&&(i.phase="open",i.restart=null,i.noDoubleTouch=t.id),this.emit(n.kind==="shot"?"shot":"pass",{player:t.id,team:t.team,pose:this.view(t).pose,mirror:this.view(t).mirror,anchor:n.kind==="throw"?"ball":"foot",worldPoint:{...s},delivery:n.kind,point:Es(s)}),i.message=n.kind==="shot"?"SHOT \u2014 keeper and rebound in play.":"Ball in play \u2014 move to receive, L to switch."}move(t,n,i){n={x:Ae(n.x,1,104),y:Ae(n.y,1,67)};let s=Ne(t,n),a=Math.min(s,i*Pe),r=t.moving;if(t.moving=s>.1,!t.moving)return;r?t.motionAge++:t.motionAge=0;let o=(n.x-t.x)/s,l=(n.y-t.y)/s;t.strideDistance=r?(t.strideDistance??0)+a:0,t.x+=o*a,t.y+=l*a,t.facing=rS(t.facing,o,l)}forecastCarrier(t,n){let i=t.moving&&!t.action&&this.state.shotView?.shooter!==t.id,s=i?{x:t.facing==="E"?7.2:t.facing==="W"?-7.2:0,y:t.facing==="S"?7.2:t.facing==="N"?-7.2:0}:{x:0,y:0},a={...t,x:Ae(t.x+s.x*n*Pe,1,104),y:Ae(t.y+s.y*n*Pe,1,67),motionAge:t.motionAge+(i?n:0)};return a.action&&(a.action={...a.action,age:a.action.age+n}),a.contactView&&a.contactView.ticks<=n&&delete a.contactView,a}pressurePoint(t,n){let s=n.moving&&!n.action&&(n.facing==="E"||n.facing==="W")?n.facing==="E"?1:-1:Yu(this.state.ball.x-t.x),a=this.poses.get(t.team===0?"tackle-entry":"orchard-tackle-entry"),r=a.anchors.ground,o=a.anchors.boot,l=(s<0?r[0]-o[0]-1:o[0]-r[0])/6,c=this.anchor(this.forecastCarrier(n,8));return{x:c.x-l-s*9*Pe,y:c.y}}challengeLooksReachable(t,n){let i=Yu(this.state.ball.x-t.x),s=a=>{let r={...t,x:Ae(t.x+i*Math.max(0,a-7)*9*Pe,Math.min(1,t.x),Math.max(104,t.x)),action:{kind:"tackle",age:a,target:{x:0,y:0},released:!1,hit:!1,direction:{x:i,y:0}}};return r.contactView&&r.contactView.ticks<=a&&delete r.contactView,r};for(let a=8;a<20;a++){let r=s(a-1),o=s(a),l=this.forecastCarrier(n,a-1),c=this.forecastCarrier(n,a),u=Ki(kt(this.anchor(r)),kt(this.anchor(o)),kt(this.anchor(l)),kt(this.anchor(c)),6),p=Ki(kt({...r,z:0}),kt({...o,z:0}),kt({...l,z:0}),kt({...c,z:0}),9);if(p&&(!u||p.fraction<u.fraction))return!1;if(u)return!0}return!1}openOutlet(t){let n=this.state.players.filter(a=>a.team!==t.team),i=this.attack(t.team),s=this.state.players.filter(a=>a.team===t.team&&a.role==="outfield"&&a.id!==t.id&&!a.action&&a.cooldown<=0).flatMap(a=>{let r=a.x-t.x,o=a.y-t.y,l=Math.hypot(r,o),c=r*i;if(l<5||l>32||c<2)return[];let u=Math.min(...n.map(h=>Ne(h,a)));return u<3?[]:n.some(h=>{let d=((h.x-t.x)*r+(h.y-t.y)*o)/(l*l);return d>.12&&d<.92&&Math.hypot(h.x-t.x-r*d,h.y-t.y-o*d)<2.4})?[]:[{player:a,score:c*.8-l*.15+Math.min(u,8)*.4}]});return s.sort((a,r)=>r.score-a.score||a.player.id-r.player.id),s[0]?.player}ai(t){let n=this.state;if(t.action||t.cooldown>0)return;let i=n.shotView;if(i?.keeper===t.id){if(t.moving=!1,i.phase==="flight"&&i.age>16){let h=this.poses.get(this.view(t).pose),d=h.anchors.ground,m=h.anchors[Math.abs(i.aim.x-160)>=26?"leftHand":"rightHand"],b=i.aim.x<160?d[0]-m[0]-1:m[0]-d[0];this.move(t,{x:t.x,y:Ae(34+(i.aim.x-b-160)/16,25,43)},39/16)}return}if(n.aerial&&n.aerial.controlledBy===null&&n.owner===null){let h=n.ball,d=this.anchor(t,"upperTorso",{pose:t.team===0?"signal":"orchard-signal",mirror:h.x>t.x}),m={x:h.x+h.vx*.2,y:h.y+h.vy*.2,z:h.z+h.vz*.2-54*.04};if(t.role==="outfield"&&Math.hypot((m.x-d.x)*6,(m.y-d.y)*3.2,m.z-d.z)<15){this.control(t);return}if(n.aerial.target===t.id){this.move(t,n.aerial.spot,7.2);return}}let s=this.attack(t.team),a=n.owner===null?null:n.players[n.owner];if(t.role==="keeper"){let h=s===1?3:102;this.move(t,{x:h,y:Ae(n.ball.y,27,41)},6.8);return}if(a?.id===t.id){if(n.tick>=t.decisionTick){let h=n.players.filter(m=>m.team!==t.team&&Ne(m,t)<6&&Math.abs(m.y-t.y)<3.5).sort((m,b)=>Ne(m,t)-Ne(b,t)||m.id-b.id)[0],d=h?t.y===h.y?t.slot%2?1:-1:Yu(t.y-h.y):0;t.aiCarryY=h?Ae(t.y+d*6,12,56):Ae(34+(t.home.y-34)*.3,12,56)}if(this.move(t,{x:t.x+s*10,y:t.aiCarryY??Ae(34+(t.home.y-34)*.3,12,56)},7.2),n.tick>=t.decisionTick)if(t.decisionTick=n.tick+36,this.attackProgress(t)>75)this.kick(t,"shot");else{let h=n.players.some(m=>m.team!==t.team&&(Ne(m,t)<3||Ne(m,t)<6&&(m.x-t.x)*s>0&&Math.abs(m.y-t.y)<3.5)),d=this.openOutlet(t);d&&(h||this.random()<.12)&&this.kick(t,Ne(t,d)>18&&this.random()<.25?"loft":"pass",!1,d)}return}let r=n.players.filter(h=>h.team===t.team&&h.role==="outfield"&&!h.action&&h.cooldown<=0).sort((h,d)=>Ne(h,n.ball)-Ne(d,n.ball)||h.id-d.id);if(r[0]?.id===t.id&&(!a||a.team!==t.team)){if(a&&Ne(t,a)<9&&n.tick>=t.decisionTick&&this.challengeLooksReachable(t,a)){t.decisionTick=n.tick+90,this.tackle(t);return}this.move(t,a?this.pressurePoint(t,a):n.ball,7.2),a&&Ne(t,a)<9&&n.tick>=t.decisionTick&&(t.decisionTick=n.tick+6,this.challengeLooksReachable(t,a)&&(t.decisionTick=n.tick+90,this.tackle(t)));return}if(a&&a.team!==t.team&&r[1]?.id===t.id){this.move(t,{x:a.x-s*5,y:Ae(a.y+(t.home.y<a.y?-1.5:1.5),3,65)},7.2);return}let l=a?.team===t.team?10:-4,c=Ae((n.ball.x-52.5)*.22,-12,12),u=n.players.find(h=>h.team!==t.team&&h.slot===t.slot),p={x:Ae(t.home.x+c+s*l,5,100),y:Ae(t.home.y+(n.ball.y-34)*.18,4,64)};a&&a.team!==t.team&&u&&Ne(t,u)<14&&(p={x:u.x-s*3,y:u.y}),this.move(t,p,7.2)}canChance(t){let n=this.state.players[to(t.team)*11],i=this.attack(t.team);return this.attackProgress(t)>70&&t.y>=20&&t.y<=48&&(n.x-t.x)*i>2}beginChance(t,n=!0){let i=this.state;if(i.owner!==t.id||t.action||i.shotView)return;let s=i.players[to(t.team)*11],a=this.attack(t.team),r=Math.max(3,(s.x-t.x)*a),o=Ae(60/r,1,12),l=a===1?105-s.x:s.x;i.shotView={direction:a,phase:"aim",shooter:t.id,keeper:s.id,team:t.team,age:0,aim:n?{x:160,y:122}:{x:60+this.random()*200,y:70+this.random()*60},depthScale:o,planeY:151-l*o},t.moving=!1,this.clear(),this.emit("shooting-camera-enter",{player:t.id,team:t.team,direction:a}),i.message="CHANCE - aim with directions, J to shoot (auto release after 1.5 seconds).",n||this.confirmChance()}confirmChance(){let t=this.state,n=t.shotView;if(!n||n.phase!=="aim")return;let i=t.players[n.shooter];if(t.owner!==i.id||i.action){this.exitShotView("possession-lost");return}n.phase="windup",n.age=0,this.clear(),this.kick(i,"shot")}exitShotView(t){let n=this.state,i=n.shotView;if(!i)return;n.shotView=null;let s=n.players[i.keeper];s?.contactView&&(s.contactView.view={pose:s.contactView.view.pose,mirror:this.attack(s.team)<0}),this.clear(),this.emit("shooting-camera-return",{reason:t,ball:{...n.ball}})}updateShotView(){let t=this.state,n=t.shotView;if(n){if(n.age++,(n.phase==="aim"||n.phase==="windup")&&t.owner!==n.shooter){this.exitShotView("possession-lost");return}if(n.phase==="aim"){let i=this.direction();n.aim.x=Ae(n.aim.x+i.x*66*Pe,32,288),n.aim.y=Ae(n.aim.y+i.y*66*Pe,32,140),n.age>=90&&this.confirmChance()}n.phase==="parry"&&n.age>=16&&this.exitShotView("parry"),n.phase==="goal"&&n.age>=45&&this.exitShotView("goal")}}control(t){let n=this.state;t.role!=="outfield"||t.action||t.cooldown||n.owner!==null||!n.aerial||n.aerial.controlledBy!==null||(t.moving=!1,t.motionAge=0,delete t.contactView,t.action={kind:"control",age:0,target:{x:0,y:0},released:!1,hit:!1,direction:{x:n.ball.x>t.x?1:-1,y:0}},t.team===0&&t.id===n.selected&&this.clear(),this.emit("upper-body-control-start",{player:t.id}),n.message="CONTROL - time the upper-body contact, then recover.")}loft(t,n,i){let s=this.state,a=n.targetPlayer===void 0?s.players.filter(h=>h.team===t.team&&h.role==="outfield"&&h.id!==t.id).sort((h,d)=>Ne(h,n.target)-Ne(d,n.target))[0]:s.players[n.targetPlayer],r=i.x>a.x,o={x:a.x,y:a.y},l=this.anchor(a,"upperTorso",{pose:a.team===0?"signal":"orchard-signal",mirror:r}),c=64/60,u=Math.pow(.995,.5),p=Pe*(1-Math.pow(u,64))/(1-u);s.ball.vx=(l.x-i.x)/p,s.ball.vy=(l.y-i.y)/p,s.ball.vz=(l.z-i.z+54*c*c)/c,s.aerial={kicker:t.id,target:a.id,spot:o,age:0,controlledBy:null},t.team===0&&(s.selected=a.id,this.clear()),s.message="LOFT - J controls at the receiver; L switches player."}step(){let t=this.state;if(t.status!=="playing")return;if(t.tick++,this.updateShotView(),t.phase==="goal"){++t.goalAge>=120&&this.kickoff(t.pendingKickoff),this.updateCamera();return}if(t.phase==="restart"){let l=t.restart;l.age++;let c=t.players[l.taker];if(l.team===1&&l.age>=60&&!c.action&&this.takeRestart(l.kind==="corner"),c.action&&(c.action.age++,c.action.kind==="throw"&&c.action.age<=12&&this.setBall(this.throwAnchor(c)),c.action.age===12)){if(c.action.kind!=="throw"){let u=this.anchor(c);c.x+=l.point.x-u.x,c.y+=l.point.y-u.y}this.release(c,c.action)}this.updateCamera();return}let n=t.shotView,i=t.players.map(l=>({position:{x:l.x,y:l.y},upper:this.anchor(l,"upperTorso"),foot:this.anchor(l),body:{...l,z:25},hands:l.role==="keeper"?["leftHand","rightHand"].map(c=>({name:c,point:this.anchor(l,c)})):[]})),s={...t.ball};for(let l of t.players){l.cooldown>0&&l.cooldown--,l.contactView&&--l.contactView.ticks<=0&&delete l.contactView;let c=l.action;if(l.keeperCycle)this.advanceKeeper(l);else if(c)if(c.age++,l.moving=!1,c.kind==="control"){if(c.age>=54){let u=this.view(l);l.action=null,l.cooldown=1,l.contactView={view:u,ticks:2},this.emit("upper-body-recovery-complete",{player:l.id,hit:c.hit})}}else if(c.kind==="stagger"){if(c.age>=24){let u=this.view(l);l.action=null,l.cooldown=1,l.contactView={view:u,ticks:2},this.emit("stagger-recovered",{player:l.id,team:l.team})}}else c.kind==="tackle"?(c.age>=8&&c.age<36&&(l.x=Ae(l.x+c.direction.x*9*Pe,Math.min(1,l.x),Math.max(104,l.x)),l.moving=!0),c.age>=84&&(l.action=null,l.cooldown=1,this.emit("recovered",{player:l.id}))):(!c.released&&!c.cancelled&&c.age>=12&&this.release(l,c),c.age>=30&&(l.action=null,l.cooldown=1));else if(t.shotView?.shooter===l.id)l.moving=!1;else if(l.id===t.selected&&l.team===0&&l.role==="outfield"){let u=this.direction();if(t.shotView?.phase==="aim"&&t.shotView.shooter===l.id){l.moving=!1;continue}this.move(l,{x:l.x+u.x*10,y:l.y+u.y*10},7.2)}else this.ai(l)}if(t.shotView&&n!==t.shotView){let l=t.players[t.shotView.keeper],c=i[l.id],u=this.view(l);c.hands=["leftHand","rightHand"].map(p=>({name:p,point:this.anchor({...l,...c.position},p,u)}))}if(t.owner!==null){let l=t.players[t.owner];this.attach(l),t.possessionTicks[l.team]++}else{let l=t.ball;l.x+=l.vx*Pe,l.y+=l.vy*Pe,l.z+=l.vz*Pe;let c=t.aerial?.controlledBy!==null&&!!t.aerial;l.vz-=(c?270:t.aerial?108:280)*Pe,t.aerial&&t.aerial.age++,c&&l.z<=1&&(l.z=1,l.vz=0),l.z<0&&(t.aerial&&t.aerial.controlledBy===null&&(this.emit("aerial-bounce"),t.aerial=null),l.z=0,l.vz=Math.abs(l.vz)>25?-l.vz*.38:0);let u=Math.pow(c?.92:l.z>1?.995:.985,Pe*30);l.vx*=u,l.vy*=u}let a=this.boundary(s,t.ball),r=[];for(let l of t.players){if(l.id===t.owner)continue;let c=l.action,u=i[l.id],p=l.id===t.lastKicker&&t.tick-t.releaseTick<24;if(l.role==="keeper"){let d=l.keeperCycle;if(d){if(d.dropped&&!d.punted&&t.owner===null&&d.age>=ln.puntAge&&d.age<ln.puntEnd){let f=this.view(l),y=this.anchor({...l,...u.position},"kickingFoot",f),M=this.anchor(l,"kickingFoot",f),x=Ki(kt(y),kt(M),kt(s),kt(t.ball),4);x&&r.push({...x,p:l,kind:"keeper-punt-contact",anchor:"kickingFoot",point:wi(x.anchor),ball:wi(x.ball),segment:{anchorStart:kt(y),anchorEnd:kt(M),ballStart:kt(s),ballEnd:kt(t.ball),radius:4}})}continue}if(!(this.attack(l.team)===1?t.ball.x<17:t.ball.x>88)||t.ball.y<20||t.ball.y>48||p||l.cooldown>0)continue;let b=this.view(l),g=["leftHand","rightHand"].map(f=>({name:f,point:this.anchor({...l,...u.position},f,b)}));for(let f of g){let y=t.shotView?.keeper===l.id?E=>Za(E,t.shotView):kt,M=t.shotView?.keeper===l.id?6:7,x=Ki(y(f.point),y(this.anchor(l,f.name)),y(s),y(t.ball),M);x&&r.push({...x,p:l,kind:"save",anchor:f.name,point:t.shotView?.keeper===l.id?Um(x.anchor,t.shotView):wi(x.anchor),ball:t.shotView?.keeper===l.id?Um(x.ball,t.shotView):wi(x.ball),segment:{anchorStart:y(f.point),anchorEnd:y(this.anchor(l,f.name)),ballStart:y(s),ballEnd:y(t.ball),radius:M}})}continue}if(c?.kind==="control"&&c.age>=8&&c.age<20&&!c.hit&&t.aerial?.controlledBy===null){let d=Ki(kt(u.upper),kt(this.anchor(l,"upperTorso")),kt(s),kt(t.ball),5.5);d&&r.push({...d,p:l,kind:"upper-body-contact",anchor:"upperTorso",point:wi(d.anchor),ball:wi(d.ball),segment:{anchorStart:kt(u.upper),anchorEnd:kt(this.anchor(l,"upperTorso")),ballStart:kt(s),ballEnd:kt(t.ball),radius:5.5}});continue}if(c?.kind==="tackle"&&c.age>=8&&c.age<36&&!c.hit){let d=Ki(kt(u.foot),kt(this.anchor(l)),kt(s),kt(t.ball),6);d&&r.push({...d,p:l,kind:"tackle-contact",anchor:"boot",point:wi(d.anchor),ball:wi(d.ball)});let m=t.owner===null?null:t.players[t.owner];if(m&&m.team!==l.team){let b=Ki(kt({...i[l.id].body,z:0}),kt({...l,z:0}),kt({...i[m.id].body,z:0}),kt({...m,z:0}),9);b&&r.push({...b,p:l,kind:"foul",anchor:"body",point:{x:l.x,y:l.y,z:0},ball:{x:t.ball.x,y:t.ball.y,z:t.ball.z}})}continue}if(c||l.cooldown>0||p||t.owner!==null||t.ball.z>6||s.z>12)continue;let h=Ki(kt(u.foot),kt(this.anchor(l)),kt(s),kt(t.ball),7);h&&r.push({...h,p:l,kind:"receive",anchor:"foot",point:wi(h.anchor),ball:wi(h.ball)})}r.sort((l,c)=>l.fraction-c.fraction||(l.kind==="tackle-contact"?-1:c.kind==="tackle-contact"?1:l.p.id-c.p.id));let o=r[0];if(a&&(!o||a.fraction<o.fraction))this.applyBoundary(a);else if(o){let l=o.p;t.noDoubleTouch!==null&&t.noDoubleTouch!==l.id&&(t.noDoubleTouch=null);let c=o.kind!=="foul"&&t.noDoubleTouch===l.id;if(this.emit(c?"restart-double-touch":o.kind==="receive"&&t.aerial?.controlledBy===l.id?"aerial-foot-collection":o.kind,{segment:o.segment,contactSpace:t.shotView?.keeper===l.id?"goal-pixels":"pitch-pixels",attemptedContact:o.kind,player:l.id,team:l.team,pose:this.view(l).pose,mirror:this.view(l).mirror,anchor:o.anchor,worldPoint:o.point,worldBall:o.ball,distance:o.distance,fraction:o.fraction}),c)this.beginRestart("free-kick",to(l.team),{x:l.x,y:l.y}),t.message="Second touch after restart - free kick.";else if(o.kind==="foul"){l.action.hit=!0;let u=to(l.team),p=(this.attack(u)===1?l.x>88:l.x<17)&&l.y>20&&l.y<48;this.beginRestart(p?"penalty":"free-kick",u,p?{x:this.attack(u)===1?94:11,y:34}:{x:l.x,y:l.y})}else if(o.kind==="upper-body-contact")l.action.hit=!0,t.aerial.controlledBy=l.id,t.airContacts[l.team]++,t.lastTouch=l.team,this.setBall(o.ball),t.ball.vx=(l.action.direction.x>0?2.4:-2.4)/6,t.ball.vz=0,t.message="CONTROL CONTACT - complete recovery before collecting.";else if(o.kind==="keeper-punt-contact")this.puntKeeper(l,o.ball);else if(o.kind==="save"&&this.canSecure(l,o.ball,s))this.secureKeeper(l,o.ball);else if(o.kind==="save")l.contactView={view:this.view(l),ticks:60},t.aerial=null,t.shotView&&(t.shotView.phase="parry",t.shotView.age=0,this.emit("close-keeper-parry",{player:l.id,viewPoint:Za(this.anchor(l,o.anchor),t.shotView)})),l.contactView={view:this.view(l),ticks:60},t.saves[l.team]++,t.owner=null,t.lastTouch=l.team,t.lastKicker=l.id,t.releaseTick=t.tick,this.setBall(this.anchor(l,o.anchor)),t.ball.vx=this.attack(l.team)*12,t.ball.vy=(t.ball.y<34?-1:1)*5,t.ball.vz=40,l.cooldown=60,t.message="SAVE \u2014 live rebound.";else if(o.kind==="tackle-contact"){let u=t.owner===null?null:t.players[t.owner];l.action.hit=!0,t.aerial=null,this.exitShotView("tackle"),t.owner=null,t.lastTouch=l.team,this.setBall(this.anchor(l)),t.ball.vx=l.action.direction.x*6,t.ball.vz=22,t.lastKicker=l.id,t.releaseTick=t.tick,u&&u.team!==l.team&&(u.action&&!u.action.released&&!u.action.cancelled&&this.emit("delivery-cancelled",{player:u.id,reason:"tackled"}),u.action={kind:"stagger",age:0,target:{x:0,y:0},released:!1,hit:!1,direction:{x:u.facing==="E"?1:u.facing==="W"?-1:this.attack(u.team),y:0}},u.moving=!1,delete u.contactView,delete u.aiCarryY,this.emit("stagger-start",{player:u.id,team:u.team,tackler:l.id})),t.message="Tackle contact \u2014 recover before collecting."}else t.aerial?.controlledBy===l.id&&t.airCollections[l.team]++,t.aerial=null,this.exitShotView("possession"),t.owner=l.id,delete l.aiCarryY,l.decisionTick=Math.min(l.decisionTick,t.tick+6),t.lastTouch=l.team,t.noDoubleTouch=null,l.team===0&&(t.selected=l.id),this.attach(l),t.message=l.team===0?"HARBOUR possession \u2014 J pass / shot, K loft, L short pass.":"ORCHARD possession \u2014 J tackle, L switch."}else a&&this.applyBoundary(a);t.halfTicks++,t.halfTicks>=eS&&this.endPeriod(),this.updateCamera()}boundary(t,n){let s=[];for(let[a,r,o]of[["x",-.5,"left"],["x",105+.5,"right"],["y",-.5,"top"],["y",68+.5,"bottom"]]){let l=n[a],c=t[a];if((r<0?l<r:l>r)&&l!==c){let u=(r-c)/(l-c);u>=0&&u<=1&&s.push({fraction:u,edge:o,point:{x:t.x+(n.x-t.x)*u,y:t.y+(n.y-t.y)*u,z:t.z+(n.z-t.z)*u}})}}return s.sort((a,r)=>a.fraction-r.fraction)[0]??null}applyBoundary(t){let n=this.state,i=t.point;if(t.edge==="top"||t.edge==="bottom"){this.beginRestart("throw-in",to(n.lastTouch),{x:Ae(i.x,1,104),y:t.edge==="top"?0:68});return}let s=t.edge==="right"==(n.half===1)?0:1,a=to(s);if(i.y>=27.5&&i.y<=40.5&&i.z<=nS-3){n.score[s]++,n.owner=null,n.phase="goal",n.shotView&&(n.shotView.phase="goal",n.shotView.age=0),n.goalAge=0,n.pendingKickoff=a,this.clear();for(let r of n.players)r.action=null,delete r.keeperCycle,r.moving=!1;this.setBall(i),this.emit("goal",{team:s,score:[...n.score]}),n.message=`GOAL ${s===0?"HARBOUR":"ORCHARD"} \u2014 ${n.score[0]} : ${n.score[1]}`}else n.lastTouch===a?this.beginRestart("corner",s,{x:t.edge==="right"?104.5:.5,y:i.y<34?.5:67.5}):this.beginRestart("goal-kick",a,{x:t.edge==="right"?99:6,y:34})}endPeriod(){let t=this.state;this.exitShotView("whistle"),t.aerial=null,this.clear(),t.owner=null,t.restart=null,t.noDoubleTouch=null;for(let n of t.players)n.action=null,delete n.keeperCycle,delete n.contactView,n.moving=!1;Object.assign(t.ball,{vx:0,vy:0,vz:0}),t.half===1?(t.status="halftime",t.message=`HALFTIME ${t.score[0]} : ${t.score[1]} \u2014 Continue to switch ends.`,this.emit("halftime")):(t.status="complete",t.message=`FULL TIME ${t.score[0]} : ${t.score[1]} \u2014 ${t.score[0]===t.score[1]?"DRAW":t.score[0]>t.score[1]?"HARBOUR WINS":"ORCHARD WINS"}.`,this.emit("fulltime"))}updateCamera(){let t=this.state,n=Es(t.ball),i=t.owner===null?n:Es(t.players[t.owner]),s=t.owner===null?{x:t.ball.vx*6,y:t.ball.vy*3.2}:this.state.players[t.owner].moving?{x:this.state.players[t.owner].facing==="W"?-43.2:this.state.players[t.owner].facing==="E"?43.2:0,y:0}:{x:0,y:0};t.camera=lS(i,s,t.camera,this.viewportWidth)}},Yu=e=>e>=0?1:-1;var CS=0,lg=1,RS=2;var jl=1,DS=2,bo=3,ba=0,Cn=1,_i=2,es=0,Mo=1,cg=2,ug=3,hg=4,NS=5;var nr=100,LS=101,US=102,OS=103,IS=104,PS=200,BS=201,zS=202,FS=203,fg=204,dg=205,VS=206,HS=207,kS=208,GS=209,WS=210,XS=211,qS=212,YS=213,ZS=214,gh=0,yh=1,vh=2,go=3,xh=4,_h=5,Sh=6,bh=7,pg=0,KS=1,JS=2,Oi=0,mg=1,gg=2,yg=3,vg=4,xg=5,_g=6,Sg=7;var bg=300,Ma=301,ir=302,Zh=303,Kh=304,$l=306,Mh=1e3,Qi=1001,Eh=1002,ke=1003,QS=1004;var tc=1005;var mn=1006,Jh=1007;var Ea=1008;var ii=1009,Mg=1010,Eg=1011,Eo=1012,Qh=1013,Ii=1014,Pi=1015,Bi=1016,jh=1017,$h=1018,To=1020,Tg=35902,Ag=35899,wg=1021,Cg=1022,Si=1023,ji=1026,Ta=1027,Rg=1028,tf=1029,Aa=1030,ef=1031;var nf=1033,ec=33776,nc=33777,ic=33778,sc=33779,sf=35840,af=35841,rf=35842,of=35843,lf=36196,cf=37492,uf=37496,hf=37488,ff=37489,ac=37490,df=37491,pf=37808,mf=37809,gf=37810,yf=37811,vf=37812,xf=37813,_f=37814,Sf=37815,bf=37816,Mf=37817,Ef=37818,Tf=37819,Af=37820,wf=37821,Cf=36492,Rf=36494,Df=36495,Nf=36283,Lf=36284,rc=36285,Uf=36286;var Pl=2300,Th=2301,ph=2302,ng=2303,ig=2400,sg=2401,ag=2402;var jS=3200;var Dg=0,$S=1,Ns="",Sn="srgb",Bl="srgb-linear",zl="linear",le="srgb";var mh=7680;var tb=519,eb=512,nb=513,ib=514,Of=515,sb=516,ab=517,If=518,rb=519,ob=35044;var Ng="300 es",Ui=2e3,Fl=2001;function oT(e){for(let t=e.length-1;t>=0;--t)if(e[t]>=65535)return!0;return!1}function lT(e){return ArrayBuffer.isView(e)&&!(e instanceof DataView)}function Vl(e){return document.createElementNS("http://www.w3.org/1999/xhtml",e)}function lb(){let e=Vl("canvas");return e.style.display="block",e}var cS={},yo=null;function Lg(...e){let t="THREE."+e.shift();yo?yo("log",t,...e):console.log(t,...e)}function cb(e){let t=e[0];if(typeof t=="string"&&t.startsWith("TSL:")){let n=e[1];n&&n.isStackTrace?e[0]+=" "+n.getLocation():e[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return e}function Nt(...e){e=cb(e);let t="THREE."+e.shift();if(yo)yo("warn",t,...e);else{let n=e[0];n&&n.isStackTrace?console.warn(n.getError(t)):console.warn(t,...e)}}function Ut(...e){e=cb(e);let t="THREE."+e.shift();if(yo)yo("error",t,...e);else{let n=e[0];n&&n.isStackTrace?console.error(n.getError(t)):console.error(t,...e)}}function $a(...e){let t=e.join(" ");t in cS||(cS[t]=!0,Nt(...e))}function ub(e,t,n){return new Promise(function(i,s){function a(){switch(e.clientWaitSync(t,e.SYNC_FLUSH_COMMANDS_BIT,0)){case e.WAIT_FAILED:s();break;case e.TIMEOUT_EXPIRED:setTimeout(a,n);break;default:i()}}setTimeout(a,n)})}var hb={[gh]:yh,[vh]:Sh,[xh]:bh,[go]:_h,[yh]:gh,[Sh]:vh,[bh]:xh,[_h]:go},$i=class{addEventListener(t,n){this._listeners===void 0&&(this._listeners={});let i=this._listeners;i[t]===void 0&&(i[t]=[]),i[t].indexOf(n)===-1&&i[t].push(n)}hasEventListener(t,n){let i=this._listeners;return i===void 0?!1:i[t]!==void 0&&i[t].indexOf(n)!==-1}removeEventListener(t,n){let i=this._listeners;if(i===void 0)return;let s=i[t];if(s!==void 0){let a=s.indexOf(n);a!==-1&&s.splice(a,1)}}dispatchEvent(t){let n=this._listeners;if(n===void 0)return;let i=n[t.type];if(i!==void 0){t.target=this;let s=i.slice(0);for(let a=0,r=s.length;a<r;a++)s[a].call(this,t);t.target=null}}},xn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];var Om=Math.PI/180,Ah=180/Math.PI;function oc(){let e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(xn[e&255]+xn[e>>8&255]+xn[e>>16&255]+xn[e>>24&255]+"-"+xn[t&255]+xn[t>>8&255]+"-"+xn[t>>16&15|64]+xn[t>>24&255]+"-"+xn[n&63|128]+xn[n>>8&255]+"-"+xn[n>>16&255]+xn[n>>24&255]+xn[i&255]+xn[i>>8&255]+xn[i>>16&255]+xn[i>>24&255]).toLowerCase()}function $t(e,t,n){return Math.max(t,Math.min(n,e))}function cT(e,t){return(e%t+t)%t}function Im(e,t,n){return(1-n)*e+n*t}function Nl(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return e/4294967295;case Uint16Array:return e/65535;case Uint8Array:case Uint8ClampedArray:return e/255;case Int32Array:return Math.max(e/2147483647,-1);case Int16Array:return Math.max(e/32767,-1);case Int8Array:return Math.max(e/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function zn(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return Math.round(e*4294967295);case Uint16Array:return Math.round(e*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(e*255);case Int32Array:return Math.round(e*2147483647);case Int16Array:return Math.round(e*32767);case Int8Array:return Math.round(e*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}var ee=class e{static{e.prototype.isVector2=!0}constructor(t=0,n=0){this.x=t,this.y=n}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,n){return this.x=t,this.y=n,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,n){switch(t){case 0:this.x=n;break;case 1:this.y=n;break;default:throw new Error("THREE.Vector2: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,n){return this.x=t.x+n.x,this.y=t.y+n.y,this}addScaledVector(t,n){return this.x+=t.x*n,this.y+=t.y*n,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,n){return this.x=t.x-n.x,this.y=t.y-n.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){let n=this.x,i=this.y,s=t.elements;return this.x=s[0]*n+s[3]*i+s[6],this.y=s[1]*n+s[4]*i+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,n){return this.x=$t(this.x,t.x,n.x),this.y=$t(this.y,t.y,n.y),this}clampScalar(t,n){return this.x=$t(this.x,t,n),this.y=$t(this.y,t,n),this}clampLength(t,n){let i=this.length();return this.divideScalar(i||1).multiplyScalar($t(i,t,n))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){let n=Math.sqrt(this.lengthSq()*t.lengthSq());if(n===0)return Math.PI/2;let i=this.dot(t)/n;return Math.acos($t(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let n=this.x-t.x,i=this.y-t.y;return n*n+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,n){return this.x+=(t.x-this.x)*n,this.y+=(t.y-this.y)*n,this}lerpVectors(t,n,i){return this.x=t.x+(n.x-t.x)*i,this.y=t.y+(n.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,n=0){return this.x=t[n],this.y=t[n+1],this}toArray(t=[],n=0){return t[n]=this.x,t[n+1]=this.y,t}fromBufferAttribute(t,n){return this.x=t.getX(n),this.y=t.getY(n),this}rotateAround(t,n){let i=Math.cos(n),s=Math.sin(n),a=this.x-t.x,r=this.y-t.y;return this.x=a*i-r*s+t.x,this.y=a*s+r*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},ts=class{constructor(t=0,n=0,i=0,s=1){this.isQuaternion=!0,this._x=t,this._y=n,this._z=i,this._w=s}static slerpFlat(t,n,i,s,a,r,o){let l=i[s+0],c=i[s+1],u=i[s+2],p=i[s+3],h=a[r+0],d=a[r+1],m=a[r+2],b=a[r+3];if(p!==b||l!==h||c!==d||u!==m){let g=l*h+c*d+u*m+p*b;g<0&&(h=-h,d=-d,m=-m,b=-b,g=-g);let f=1-o;if(g<.9995){let y=Math.acos(g),M=Math.sin(y);f=Math.sin(f*y)/M,o=Math.sin(o*y)/M,l=l*f+h*o,c=c*f+d*o,u=u*f+m*o,p=p*f+b*o}else{l=l*f+h*o,c=c*f+d*o,u=u*f+m*o,p=p*f+b*o;let y=1/Math.sqrt(l*l+c*c+u*u+p*p);l*=y,c*=y,u*=y,p*=y}}t[n]=l,t[n+1]=c,t[n+2]=u,t[n+3]=p}static multiplyQuaternionsFlat(t,n,i,s,a,r){let o=i[s],l=i[s+1],c=i[s+2],u=i[s+3],p=a[r],h=a[r+1],d=a[r+2],m=a[r+3];return t[n]=o*m+u*p+l*d-c*h,t[n+1]=l*m+u*h+c*p-o*d,t[n+2]=c*m+u*d+o*h-l*p,t[n+3]=u*m-o*p-l*h-c*d,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,n,i,s){return this._x=t,this._y=n,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,n=!0){let i=t._x,s=t._y,a=t._z,r=t._order,o=Math.cos,l=Math.sin,c=o(i/2),u=o(s/2),p=o(a/2),h=l(i/2),d=l(s/2),m=l(a/2);switch(r){case"XYZ":this._x=h*u*p+c*d*m,this._y=c*d*p-h*u*m,this._z=c*u*m+h*d*p,this._w=c*u*p-h*d*m;break;case"YXZ":this._x=h*u*p+c*d*m,this._y=c*d*p-h*u*m,this._z=c*u*m-h*d*p,this._w=c*u*p+h*d*m;break;case"ZXY":this._x=h*u*p-c*d*m,this._y=c*d*p+h*u*m,this._z=c*u*m+h*d*p,this._w=c*u*p-h*d*m;break;case"ZYX":this._x=h*u*p-c*d*m,this._y=c*d*p+h*u*m,this._z=c*u*m-h*d*p,this._w=c*u*p+h*d*m;break;case"YZX":this._x=h*u*p+c*d*m,this._y=c*d*p+h*u*m,this._z=c*u*m-h*d*p,this._w=c*u*p-h*d*m;break;case"XZY":this._x=h*u*p-c*d*m,this._y=c*d*p-h*u*m,this._z=c*u*m+h*d*p,this._w=c*u*p+h*d*m;break;default:Nt("Quaternion: .setFromEuler() encountered an unknown order: "+r)}return n===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,n){let i=n/2,s=Math.sin(i);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(t){let n=t.elements,i=n[0],s=n[4],a=n[8],r=n[1],o=n[5],l=n[9],c=n[2],u=n[6],p=n[10],h=i+o+p;if(h>0){let d=.5/Math.sqrt(h+1);this._w=.25/d,this._x=(u-l)*d,this._y=(a-c)*d,this._z=(r-s)*d}else if(i>o&&i>p){let d=2*Math.sqrt(1+i-o-p);this._w=(u-l)/d,this._x=.25*d,this._y=(s+r)/d,this._z=(a+c)/d}else if(o>p){let d=2*Math.sqrt(1+o-i-p);this._w=(a-c)/d,this._x=(s+r)/d,this._y=.25*d,this._z=(l+u)/d}else{let d=2*Math.sqrt(1+p-i-o);this._w=(r-s)/d,this._x=(a+c)/d,this._y=(l+u)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(t,n){let i=t.dot(n)+1;return i<1e-8?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*n.z-t.z*n.y,this._y=t.z*n.x-t.x*n.z,this._z=t.x*n.y-t.y*n.x,this._w=i),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs($t(this.dot(t),-1,1)))}rotateTowards(t,n){let i=this.angleTo(t);if(i===0)return this;let s=Math.min(1,n/i);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,n){let i=t._x,s=t._y,a=t._z,r=t._w,o=n._x,l=n._y,c=n._z,u=n._w;return this._x=i*u+r*o+s*c-a*l,this._y=s*u+r*l+a*o-i*c,this._z=a*u+r*c+i*l-s*o,this._w=r*u-i*o-s*l-a*c,this._onChangeCallback(),this}slerp(t,n){let i=t._x,s=t._y,a=t._z,r=t._w,o=this.dot(t);o<0&&(i=-i,s=-s,a=-a,r=-r,o=-o);let l=1-n;if(o<.9995){let c=Math.acos(o),u=Math.sin(c);l=Math.sin(l*c)/u,n=Math.sin(n*c)/u,this._x=this._x*l+i*n,this._y=this._y*l+s*n,this._z=this._z*l+a*n,this._w=this._w*l+r*n,this._onChangeCallback()}else this._x=this._x*l+i*n,this._y=this._y*l+s*n,this._z=this._z*l+a*n,this._w=this._w*l+r*n,this.normalize();return this}slerpQuaternions(t,n,i){return this.copy(t).slerp(n,i)}random(){let t=2*Math.PI*Math.random(),n=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),a=Math.sqrt(i);return this.set(s*Math.sin(t),s*Math.cos(t),a*Math.sin(n),a*Math.cos(n))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,n=0){return this._x=t[n],this._y=t[n+1],this._z=t[n+2],this._w=t[n+3],this._onChangeCallback(),this}toArray(t=[],n=0){return t[n]=this._x,t[n+1]=this._y,t[n+2]=this._z,t[n+3]=this._w,t}fromBufferAttribute(t,n){return this._x=t.getX(n),this._y=t.getY(n),this._z=t.getZ(n),this._w=t.getW(n),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},H=class e{static{e.prototype.isVector3=!0}constructor(t=0,n=0,i=0){this.x=t,this.y=n,this.z=i}set(t,n,i){return i===void 0&&(i=this.z),this.x=t,this.y=n,this.z=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,n){switch(t){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;default:throw new Error("THREE.Vector3: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,n){return this.x=t.x+n.x,this.y=t.y+n.y,this.z=t.z+n.z,this}addScaledVector(t,n){return this.x+=t.x*n,this.y+=t.y*n,this.z+=t.z*n,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,n){return this.x=t.x-n.x,this.y=t.y-n.y,this.z=t.z-n.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,n){return this.x=t.x*n.x,this.y=t.y*n.y,this.z=t.z*n.z,this}applyEuler(t){return this.applyQuaternion(uS.setFromEuler(t))}applyAxisAngle(t,n){return this.applyQuaternion(uS.setFromAxisAngle(t,n))}applyMatrix3(t){let n=this.x,i=this.y,s=this.z,a=t.elements;return this.x=a[0]*n+a[3]*i+a[6]*s,this.y=a[1]*n+a[4]*i+a[7]*s,this.z=a[2]*n+a[5]*i+a[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){let n=this.x,i=this.y,s=this.z,a=t.elements,r=1/(a[3]*n+a[7]*i+a[11]*s+a[15]);return this.x=(a[0]*n+a[4]*i+a[8]*s+a[12])*r,this.y=(a[1]*n+a[5]*i+a[9]*s+a[13])*r,this.z=(a[2]*n+a[6]*i+a[10]*s+a[14])*r,this}applyQuaternion(t){let n=this.x,i=this.y,s=this.z,a=t.x,r=t.y,o=t.z,l=t.w,c=2*(r*s-o*i),u=2*(o*n-a*s),p=2*(a*i-r*n);return this.x=n+l*c+r*p-o*u,this.y=i+l*u+o*c-a*p,this.z=s+l*p+a*u-r*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){let n=this.x,i=this.y,s=this.z,a=t.elements;return this.x=a[0]*n+a[4]*i+a[8]*s,this.y=a[1]*n+a[5]*i+a[9]*s,this.z=a[2]*n+a[6]*i+a[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,n){return this.x=$t(this.x,t.x,n.x),this.y=$t(this.y,t.y,n.y),this.z=$t(this.z,t.z,n.z),this}clampScalar(t,n){return this.x=$t(this.x,t,n),this.y=$t(this.y,t,n),this.z=$t(this.z,t,n),this}clampLength(t,n){let i=this.length();return this.divideScalar(i||1).multiplyScalar($t(i,t,n))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,n){return this.x+=(t.x-this.x)*n,this.y+=(t.y-this.y)*n,this.z+=(t.z-this.z)*n,this}lerpVectors(t,n,i){return this.x=t.x+(n.x-t.x)*i,this.y=t.y+(n.y-t.y)*i,this.z=t.z+(n.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,n){let i=t.x,s=t.y,a=t.z,r=n.x,o=n.y,l=n.z;return this.x=s*l-a*o,this.y=a*r-i*l,this.z=i*o-s*r,this}projectOnVector(t){let n=t.lengthSq();if(n===0)return this.set(0,0,0);let i=t.dot(this)/n;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return Pm.copy(this).projectOnVector(t),this.sub(Pm)}reflect(t){return this.sub(Pm.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){let n=Math.sqrt(this.lengthSq()*t.lengthSq());if(n===0)return Math.PI/2;let i=this.dot(t)/n;return Math.acos($t(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let n=this.x-t.x,i=this.y-t.y,s=this.z-t.z;return n*n+i*i+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,n,i){let s=Math.sin(n)*t;return this.x=s*Math.sin(i),this.y=Math.cos(n)*t,this.z=s*Math.cos(i),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,n,i){return this.x=t*Math.sin(n),this.y=i,this.z=t*Math.cos(n),this}setFromMatrixPosition(t){let n=t.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this}setFromMatrixScale(t){let n=this.setFromMatrixColumn(t,0).length(),i=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=n,this.y=i,this.z=s,this}setFromMatrixColumn(t,n){return this.fromArray(t.elements,n*4)}setFromMatrix3Column(t,n){return this.fromArray(t.elements,n*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,n=0){return this.x=t[n],this.y=t[n+1],this.z=t[n+2],this}toArray(t=[],n=0){return t[n]=this.x,t[n+1]=this.y,t[n+2]=this.z,t}fromBufferAttribute(t,n){return this.x=t.getX(n),this.y=t.getY(n),this.z=t.getZ(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let t=Math.random()*Math.PI*2,n=Math.random()*2-1,i=Math.sqrt(1-n*n);return this.x=i*Math.cos(t),this.y=n,this.z=i*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},Pm=new H,uS=new ts,Ot=class e{static{e.prototype.isMatrix3=!0}constructor(t,n,i,s,a,r,o,l,c){this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,n,i,s,a,r,o,l,c)}set(t,n,i,s,a,r,o,l,c){let u=this.elements;return u[0]=t,u[1]=s,u[2]=o,u[3]=n,u[4]=a,u[5]=l,u[6]=i,u[7]=r,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){let n=this.elements,i=t.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],this}extractBasis(t,n,i){return t.setFromMatrix3Column(this,0),n.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){let n=t.elements;return this.set(n[0],n[4],n[8],n[1],n[5],n[9],n[2],n[6],n[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,n){let i=t.elements,s=n.elements,a=this.elements,r=i[0],o=i[3],l=i[6],c=i[1],u=i[4],p=i[7],h=i[2],d=i[5],m=i[8],b=s[0],g=s[3],f=s[6],y=s[1],M=s[4],x=s[7],E=s[2],T=s[5],C=s[8];return a[0]=r*b+o*y+l*E,a[3]=r*g+o*M+l*T,a[6]=r*f+o*x+l*C,a[1]=c*b+u*y+p*E,a[4]=c*g+u*M+p*T,a[7]=c*f+u*x+p*C,a[2]=h*b+d*y+m*E,a[5]=h*g+d*M+m*T,a[8]=h*f+d*x+m*C,this}multiplyScalar(t){let n=this.elements;return n[0]*=t,n[3]*=t,n[6]*=t,n[1]*=t,n[4]*=t,n[7]*=t,n[2]*=t,n[5]*=t,n[8]*=t,this}determinant(){let t=this.elements,n=t[0],i=t[1],s=t[2],a=t[3],r=t[4],o=t[5],l=t[6],c=t[7],u=t[8];return n*r*u-n*o*c-i*a*u+i*o*l+s*a*c-s*r*l}invert(){let t=this.elements,n=t[0],i=t[1],s=t[2],a=t[3],r=t[4],o=t[5],l=t[6],c=t[7],u=t[8],p=u*r-o*c,h=o*l-u*a,d=c*a-r*l,m=n*p+i*h+s*d;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);let b=1/m;return t[0]=p*b,t[1]=(s*c-u*i)*b,t[2]=(o*i-s*r)*b,t[3]=h*b,t[4]=(u*n-s*l)*b,t[5]=(s*a-o*n)*b,t[6]=d*b,t[7]=(i*l-c*n)*b,t[8]=(r*n-i*a)*b,this}transpose(){let t,n=this.elements;return t=n[1],n[1]=n[3],n[3]=t,t=n[2],n[2]=n[6],n[6]=t,t=n[5],n[5]=n[7],n[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){let n=this.elements;return t[0]=n[0],t[1]=n[3],t[2]=n[6],t[3]=n[1],t[4]=n[4],t[5]=n[7],t[6]=n[2],t[7]=n[5],t[8]=n[8],this}setUvTransform(t,n,i,s,a,r,o){let l=Math.cos(a),c=Math.sin(a);return this.set(i*l,i*c,-i*(l*r+c*o)+r+t,-s*c,s*l,-s*(-c*r+l*o)+o+n,0,0,1),this}scale(t,n){return $a("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(Bm.makeScale(t,n)),this}rotate(t){return $a("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(Bm.makeRotation(-t)),this}translate(t,n){return $a("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(Bm.makeTranslation(t,n)),this}makeTranslation(t,n){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,n,0,0,1),this}makeRotation(t){let n=Math.cos(t),i=Math.sin(t);return this.set(n,-i,0,i,n,0,0,0,1),this}makeScale(t,n){return this.set(t,0,0,0,n,0,0,0,1),this}equals(t){let n=this.elements,i=t.elements;for(let s=0;s<9;s++)if(n[s]!==i[s])return!1;return!0}fromArray(t,n=0){for(let i=0;i<9;i++)this.elements[i]=t[i+n];return this}toArray(t=[],n=0){let i=this.elements;return t[n]=i[0],t[n+1]=i[1],t[n+2]=i[2],t[n+3]=i[3],t[n+4]=i[4],t[n+5]=i[5],t[n+6]=i[6],t[n+7]=i[7],t[n+8]=i[8],t}clone(){return new this.constructor().fromArray(this.elements)}},Bm=new Ot,hS=new Ot().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),fS=new Ot().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function uT(){let e={enabled:!0,workingColorSpace:Bl,spaces:{},convert:function(s,a,r){return this.enabled===!1||a===r||!a||!r||(this.spaces[a].transfer===le&&(s.r=Ds(s.r),s.g=Ds(s.g),s.b=Ds(s.b)),this.spaces[a].primaries!==this.spaces[r].primaries&&(s.applyMatrix3(this.spaces[a].toXYZ),s.applyMatrix3(this.spaces[r].fromXYZ)),this.spaces[r].transfer===le&&(s.r=mo(s.r),s.g=mo(s.g),s.b=mo(s.b))),s},workingToColorSpace:function(s,a){return this.convert(s,this.workingColorSpace,a)},colorSpaceToWorking:function(s,a){return this.convert(s,a,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Ns?zl:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,a=this.workingColorSpace){return s.fromArray(this.spaces[a].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,a,r){return s.copy(this.spaces[a].toXYZ).multiply(this.spaces[r].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,a){return $a("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),e.workingToColorSpace(s,a)},toWorkingColorSpace:function(s,a){return $a("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),e.colorSpaceToWorking(s,a)}},t=[.64,.33,.3,.6,.15,.06],n=[.2126,.7152,.0722],i=[.3127,.329];return e.define({[Bl]:{primaries:t,whitePoint:i,transfer:zl,toXYZ:hS,fromXYZ:fS,luminanceCoefficients:n,workingColorSpaceConfig:{unpackColorSpace:Sn},outputColorSpaceConfig:{drawingBufferColorSpace:Sn}},[Sn]:{primaries:t,whitePoint:i,transfer:le,toXYZ:hS,fromXYZ:fS,luminanceCoefficients:n,outputColorSpaceConfig:{drawingBufferColorSpace:Sn}}}),e}var Qt=uT();function Ds(e){return e<.04045?e*.0773993808:Math.pow(e*.9478672986+.0521327014,2.4)}function mo(e){return e<.0031308?e*12.92:1.055*Math.pow(e,.41666)-.055}var eo,wh=class{static getDataURL(t,n="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let i;if(t instanceof HTMLCanvasElement)i=t;else{eo===void 0&&(eo=Vl("canvas")),eo.width=t.width,eo.height=t.height;let s=eo.getContext("2d");t instanceof ImageData?s.putImageData(t,0,0):s.drawImage(t,0,0,t.width,t.height),i=eo}return i.toDataURL(n)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){let n=Vl("canvas");n.width=t.width,n.height=t.height;let i=n.getContext("2d");i.drawImage(t,0,0,t.width,t.height);let s=i.getImageData(0,0,t.width,t.height),a=s.data;for(let r=0;r<a.length;r++)a[r]=Ds(a[r]/255)*255;return i.putImageData(s,0,0),n}else if(t.data){let n=t.data.slice(0);for(let i=0;i<n.length;i++)n instanceof Uint8Array||n instanceof Uint8ClampedArray?n[i]=Math.floor(Ds(n[i]/255)*255):n[i]=Ds(n[i]);return{data:n,width:t.width,height:t.height}}else return Nt("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}},hT=0,vo=class{constructor(t=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:hT++}),this.uuid=oc(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){let n=this.data;return typeof HTMLVideoElement<"u"&&n instanceof HTMLVideoElement?t.set(n.videoWidth,n.videoHeight,0):typeof VideoFrame<"u"&&n instanceof VideoFrame?t.set(n.displayWidth,n.displayHeight,0):n!==null?t.set(n.width,n.height,n.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){let n=t===void 0||typeof t=="string";if(!n&&t.images[this.uuid]!==void 0)return t.images[this.uuid];let i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let a;if(Array.isArray(s)){a=[];for(let r=0,o=s.length;r<o;r++)s[r].isDataTexture?a.push(zm(s[r].image)):a.push(zm(s[r]))}else a=zm(s);i.url=a}return n||(t.images[this.uuid]=i),i}};function zm(e){return typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap?wh.getDataURL(e):e.data?{data:Array.from(e.data),width:e.width,height:e.height,type:e.data.constructor.name}:(Nt("Texture: Unable to serialize Texture."),{})}var fT=0,Fm=new H,bn=class e extends $i{constructor(t=e.DEFAULT_IMAGE,n=e.DEFAULT_MAPPING,i=Qi,s=Qi,a=mn,r=Ea,o=Si,l=ii,c=e.DEFAULT_ANISOTROPY,u=Ns){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:fT++}),this.uuid=oc(),this.name="",this.source=new vo(t),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=a,this.minFilter=r,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new ee(0,0),this.repeat=new ee(1,1),this.center=new ee(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ot,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Fm).x}get height(){return this.source.getSize(Fm).y}get depth(){return this.source.getSize(Fm).z}get image(){return this.source.data}set image(t){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,n){this.updateRanges.push({start:t,count:n})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.normalized=t.normalized,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(let n in t){let i=t[n];if(i===void 0){Nt(`Texture.setValues(): parameter '${n}' has value of undefined.`);continue}let s=this[n];if(s===void 0){Nt(`Texture.setValues(): property '${n}' does not exist.`);continue}s&&i&&s.isVector2&&i.isVector2||s&&i&&s.isVector3&&i.isVector3||s&&i&&s.isMatrix3&&i.isMatrix3?s.copy(i):this[n]=i}}toJSON(t){let n=t===void 0||typeof t=="string";if(!n&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];let i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),n||(t.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==bg)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Mh:t.x=t.x-Math.floor(t.x);break;case Qi:t.x=t.x<0?0:1;break;case Eh:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Mh:t.y=t.y-Math.floor(t.y);break;case Qi:t.y=t.y<0?0:1;break;case Eh:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}};bn.DEFAULT_IMAGE=null;bn.DEFAULT_MAPPING=bg;bn.DEFAULT_ANISOTROPY=1;var Ue=class e{static{e.prototype.isVector4=!0}constructor(t=0,n=0,i=0,s=1){this.x=t,this.y=n,this.z=i,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,n,i,s){return this.x=t,this.y=n,this.z=i,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,n){switch(t){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;case 3:this.w=n;break;default:throw new Error("THREE.Vector4: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,n){return this.x=t.x+n.x,this.y=t.y+n.y,this.z=t.z+n.z,this.w=t.w+n.w,this}addScaledVector(t,n){return this.x+=t.x*n,this.y+=t.y*n,this.z+=t.z*n,this.w+=t.w*n,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,n){return this.x=t.x-n.x,this.y=t.y-n.y,this.z=t.z-n.z,this.w=t.w-n.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){let n=this.x,i=this.y,s=this.z,a=this.w,r=t.elements;return this.x=r[0]*n+r[4]*i+r[8]*s+r[12]*a,this.y=r[1]*n+r[5]*i+r[9]*s+r[13]*a,this.z=r[2]*n+r[6]*i+r[10]*s+r[14]*a,this.w=r[3]*n+r[7]*i+r[11]*s+r[15]*a,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);let n=Math.sqrt(1-t.w*t.w);return n<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/n,this.y=t.y/n,this.z=t.z/n),this}setAxisAngleFromRotationMatrix(t){let n,i,s,a,l=t.elements,c=l[0],u=l[4],p=l[8],h=l[1],d=l[5],m=l[9],b=l[2],g=l[6],f=l[10];if(Math.abs(u-h)<.01&&Math.abs(p-b)<.01&&Math.abs(m-g)<.01){if(Math.abs(u+h)<.1&&Math.abs(p+b)<.1&&Math.abs(m+g)<.1&&Math.abs(c+d+f-3)<.1)return this.set(1,0,0,0),this;n=Math.PI;let M=(c+1)/2,x=(d+1)/2,E=(f+1)/2,T=(u+h)/4,C=(p+b)/4,_=(m+g)/4;return M>x&&M>E?M<.01?(i=0,s=.707106781,a=.707106781):(i=Math.sqrt(M),s=T/i,a=C/i):x>E?x<.01?(i=.707106781,s=0,a=.707106781):(s=Math.sqrt(x),i=T/s,a=_/s):E<.01?(i=.707106781,s=.707106781,a=0):(a=Math.sqrt(E),i=C/a,s=_/a),this.set(i,s,a,n),this}let y=Math.sqrt((g-m)*(g-m)+(p-b)*(p-b)+(h-u)*(h-u));return Math.abs(y)<.001&&(y=1),this.x=(g-m)/y,this.y=(p-b)/y,this.z=(h-u)/y,this.w=Math.acos((c+d+f-1)/2),this}setFromMatrixPosition(t){let n=t.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this.w=n[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,n){return this.x=$t(this.x,t.x,n.x),this.y=$t(this.y,t.y,n.y),this.z=$t(this.z,t.z,n.z),this.w=$t(this.w,t.w,n.w),this}clampScalar(t,n){return this.x=$t(this.x,t,n),this.y=$t(this.y,t,n),this.z=$t(this.z,t,n),this.w=$t(this.w,t,n),this}clampLength(t,n){let i=this.length();return this.divideScalar(i||1).multiplyScalar($t(i,t,n))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,n){return this.x+=(t.x-this.x)*n,this.y+=(t.y-this.y)*n,this.z+=(t.z-this.z)*n,this.w+=(t.w-this.w)*n,this}lerpVectors(t,n,i){return this.x=t.x+(n.x-t.x)*i,this.y=t.y+(n.y-t.y)*i,this.z=t.z+(n.z-t.z)*i,this.w=t.w+(n.w-t.w)*i,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,n=0){return this.x=t[n],this.y=t[n+1],this.z=t[n+2],this.w=t[n+3],this}toArray(t=[],n=0){return t[n]=this.x,t[n+1]=this.y,t[n+2]=this.z,t[n+3]=this.w,t}fromBufferAttribute(t,n){return this.x=t.getX(n),this.y=t.getY(n),this.z=t.getZ(n),this.w=t.getW(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Ch=class extends $i{constructor(t=1,n=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:mn,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},i),this.isRenderTarget=!0,this.width=t,this.height=n,this.depth=i.depth,this.scissor=new Ue(0,0,t,n),this.scissorTest=!1,this.viewport=new Ue(0,0,t,n),this.textures=[];let s={width:t,height:n,depth:i.depth},a=new bn(s),r=i.count;for(let o=0;o<r;o++)this.textures[o]=a.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveColorBuffer=i.resolveColorBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.storeMultisampledColorBuffer=i.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=i.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=i.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview,this.useArrayDepthTexture=i.useArrayDepthTexture}_setTextureOptions(t={}){let n={minFilter:mn,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(n.mapping=t.mapping),t.wrapS!==void 0&&(n.wrapS=t.wrapS),t.wrapT!==void 0&&(n.wrapT=t.wrapT),t.wrapR!==void 0&&(n.wrapR=t.wrapR),t.magFilter!==void 0&&(n.magFilter=t.magFilter),t.minFilter!==void 0&&(n.minFilter=t.minFilter),t.format!==void 0&&(n.format=t.format),t.type!==void 0&&(n.type=t.type),t.anisotropy!==void 0&&(n.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(n.colorSpace=t.colorSpace),t.flipY!==void 0&&(n.flipY=t.flipY),t.generateMipmaps!==void 0&&(n.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(n.internalFormat=t.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(n)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),t!==null&&t.renderTarget===null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,n,i=1){if(this.width!==t||this.height!==n||this.depth!==i){this.width=t,this.height=n,this.depth=i;for(let s=0,a=this.textures.length;s<a;s++)this.textures[s].image.width=t,this.textures[s].image.height=n,this.textures[s].image.depth=i,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,t,n),this.scissor.set(0,0,t,n)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let n=0,i=t.textures.length;n<i;n++){this.textures[n]=t.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0,this.textures[n].renderTarget=this;let s=Object.assign({},t.textures[n].image);this.textures[n].source=new vo(s)}if(this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveColorBuffer=t.resolveColorBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,this.storeMultisampledColorBuffer=t.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=t.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=t.storeMultisampledStencilBuffer,t.depthTexture!==null)if(t.depthTexture.renderTarget===t){let n=t.depthTexture.clone();n.renderTarget=null,this.depthTexture=n}else this.depthTexture=t.depthTexture;return this.samples=t.samples,this.multiview=t.multiview,this.useArrayDepthTexture=t.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}},Hn=class extends Ch{constructor(t=1,n=1,i={}){super(t,n,i),this.isWebGLRenderTarget=!0}},Hl=class extends bn{constructor(t=null,n=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:n,height:i,depth:s},this.magFilter=ke,this.minFilter=ke,this.wrapR=Qi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(t){return super.copy(t),this.wrapR=t.wrapR,this}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}};var Rh=class extends bn{constructor(t=null,n=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:n,height:i,depth:s},this.magFilter=ke,this.minFilter=ke,this.wrapR=Qi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(t){return super.copy(t),this.wrapR=t.wrapR,this}};var He=class e{static{e.prototype.isMatrix4=!0}constructor(t,n,i,s,a,r,o,l,c,u,p,h,d,m,b,g){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,n,i,s,a,r,o,l,c,u,p,h,d,m,b,g)}set(t,n,i,s,a,r,o,l,c,u,p,h,d,m,b,g){let f=this.elements;return f[0]=t,f[4]=n,f[8]=i,f[12]=s,f[1]=a,f[5]=r,f[9]=o,f[13]=l,f[2]=c,f[6]=u,f[10]=p,f[14]=h,f[3]=d,f[7]=m,f[11]=b,f[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new e().fromArray(this.elements)}copy(t){let n=this.elements,i=t.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],n[9]=i[9],n[10]=i[10],n[11]=i[11],n[12]=i[12],n[13]=i[13],n[14]=i[14],n[15]=i[15],this}copyPosition(t){let n=this.elements,i=t.elements;return n[12]=i[12],n[13]=i[13],n[14]=i[14],this}setFromMatrix3(t){let n=t.elements;return this.set(n[0],n[3],n[6],0,n[1],n[4],n[7],0,n[2],n[5],n[8],0,0,0,0,1),this}extractBasis(t,n,i){return this.determinantAffine()===0?(t.set(1,0,0),n.set(0,1,0),i.set(0,0,1),this):(t.setFromMatrixColumn(this,0),n.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(t,n,i){return this.set(t.x,n.x,i.x,0,t.y,n.y,i.y,0,t.z,n.z,i.z,0,0,0,0,1),this}extractRotation(t){if(t.determinantAffine()===0)return this.identity();let n=this.elements,i=t.elements,s=1/no.setFromMatrixColumn(t,0).length(),a=1/no.setFromMatrixColumn(t,1).length(),r=1/no.setFromMatrixColumn(t,2).length();return n[0]=i[0]*s,n[1]=i[1]*s,n[2]=i[2]*s,n[3]=0,n[4]=i[4]*a,n[5]=i[5]*a,n[6]=i[6]*a,n[7]=0,n[8]=i[8]*r,n[9]=i[9]*r,n[10]=i[10]*r,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromEuler(t){let n=this.elements,i=t.x,s=t.y,a=t.z,r=Math.cos(i),o=Math.sin(i),l=Math.cos(s),c=Math.sin(s),u=Math.cos(a),p=Math.sin(a);if(t.order==="XYZ"){let h=r*u,d=r*p,m=o*u,b=o*p;n[0]=l*u,n[4]=-l*p,n[8]=c,n[1]=d+m*c,n[5]=h-b*c,n[9]=-o*l,n[2]=b-h*c,n[6]=m+d*c,n[10]=r*l}else if(t.order==="YXZ"){let h=l*u,d=l*p,m=c*u,b=c*p;n[0]=h+b*o,n[4]=m*o-d,n[8]=r*c,n[1]=r*p,n[5]=r*u,n[9]=-o,n[2]=d*o-m,n[6]=b+h*o,n[10]=r*l}else if(t.order==="ZXY"){let h=l*u,d=l*p,m=c*u,b=c*p;n[0]=h-b*o,n[4]=-r*p,n[8]=m+d*o,n[1]=d+m*o,n[5]=r*u,n[9]=b-h*o,n[2]=-r*c,n[6]=o,n[10]=r*l}else if(t.order==="ZYX"){let h=r*u,d=r*p,m=o*u,b=o*p;n[0]=l*u,n[4]=m*c-d,n[8]=h*c+b,n[1]=l*p,n[5]=b*c+h,n[9]=d*c-m,n[2]=-c,n[6]=o*l,n[10]=r*l}else if(t.order==="YZX"){let h=r*l,d=r*c,m=o*l,b=o*c;n[0]=l*u,n[4]=b-h*p,n[8]=m*p+d,n[1]=p,n[5]=r*u,n[9]=-o*u,n[2]=-c*u,n[6]=d*p+m,n[10]=h-b*p}else if(t.order==="XZY"){let h=r*l,d=r*c,m=o*l,b=o*c;n[0]=l*u,n[4]=-p,n[8]=c*u,n[1]=h*p+b,n[5]=r*u,n[9]=d*p-m,n[2]=m*p-d,n[6]=o*u,n[10]=b*p+h}return n[3]=0,n[7]=0,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromQuaternion(t){return this.compose(dT,t,pT)}lookAt(t,n,i){let s=this.elements;return $n.subVectors(t,n),$n.lengthSq()===0&&($n.z=1),$n.normalize(),ca.crossVectors(i,$n),ca.lengthSq()===0&&(Math.abs(i.z)===1?$n.x+=1e-4:$n.z+=1e-4,$n.normalize(),ca.crossVectors(i,$n)),ca.normalize(),Ku.crossVectors($n,ca),s[0]=ca.x,s[4]=Ku.x,s[8]=$n.x,s[1]=ca.y,s[5]=Ku.y,s[9]=$n.y,s[2]=ca.z,s[6]=Ku.z,s[10]=$n.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,n){let i=t.elements,s=n.elements,a=this.elements,r=i[0],o=i[4],l=i[8],c=i[12],u=i[1],p=i[5],h=i[9],d=i[13],m=i[2],b=i[6],g=i[10],f=i[14],y=i[3],M=i[7],x=i[11],E=i[15],T=s[0],C=s[4],_=s[8],A=s[12],R=s[1],I=s[5],F=s[9],D=s[13],O=s[2],k=s[6],K=s[10],Y=s[14],it=s[3],X=s[7],tt=s[11],et=s[15];return a[0]=r*T+o*R+l*O+c*it,a[4]=r*C+o*I+l*k+c*X,a[8]=r*_+o*F+l*K+c*tt,a[12]=r*A+o*D+l*Y+c*et,a[1]=u*T+p*R+h*O+d*it,a[5]=u*C+p*I+h*k+d*X,a[9]=u*_+p*F+h*K+d*tt,a[13]=u*A+p*D+h*Y+d*et,a[2]=m*T+b*R+g*O+f*it,a[6]=m*C+b*I+g*k+f*X,a[10]=m*_+b*F+g*K+f*tt,a[14]=m*A+b*D+g*Y+f*et,a[3]=y*T+M*R+x*O+E*it,a[7]=y*C+M*I+x*k+E*X,a[11]=y*_+M*F+x*K+E*tt,a[15]=y*A+M*D+x*Y+E*et,this}multiplyScalar(t){let n=this.elements;return n[0]*=t,n[4]*=t,n[8]*=t,n[12]*=t,n[1]*=t,n[5]*=t,n[9]*=t,n[13]*=t,n[2]*=t,n[6]*=t,n[10]*=t,n[14]*=t,n[3]*=t,n[7]*=t,n[11]*=t,n[15]*=t,this}determinant(){let t=this.elements,n=t[0],i=t[4],s=t[8],a=t[12],r=t[1],o=t[5],l=t[9],c=t[13],u=t[2],p=t[6],h=t[10],d=t[14],m=t[3],b=t[7],g=t[11],f=t[15],y=l*d-c*h,M=o*d-c*p,x=o*h-l*p,E=r*d-c*u,T=r*h-l*u,C=r*p-o*u;return n*(b*y-g*M+f*x)-i*(m*y-g*E+f*T)+s*(m*M-b*E+f*C)-a*(m*x-b*T+g*C)}determinantAffine(){let t=this.elements,n=t[0],i=t[4],s=t[8],a=t[1],r=t[5],o=t[9],l=t[2],c=t[6],u=t[10];return n*(r*u-o*c)-i*(a*u-o*l)+s*(a*c-r*l)}transpose(){let t=this.elements,n;return n=t[1],t[1]=t[4],t[4]=n,n=t[2],t[2]=t[8],t[8]=n,n=t[6],t[6]=t[9],t[9]=n,n=t[3],t[3]=t[12],t[12]=n,n=t[7],t[7]=t[13],t[13]=n,n=t[11],t[11]=t[14],t[14]=n,this}setPosition(t,n,i){let s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=n,s[14]=i),this}invert(){let t=this.elements,n=t[0],i=t[1],s=t[2],a=t[3],r=t[4],o=t[5],l=t[6],c=t[7],u=t[8],p=t[9],h=t[10],d=t[11],m=t[12],b=t[13],g=t[14],f=t[15],y=n*o-i*r,M=n*l-s*r,x=n*c-a*r,E=i*l-s*o,T=i*c-a*o,C=s*c-a*l,_=u*b-p*m,A=u*g-h*m,R=u*f-d*m,I=p*g-h*b,F=p*f-d*b,D=h*f-d*g,O=y*D-M*F+x*I+E*R-T*A+C*_;if(O===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let k=1/O;return t[0]=(o*D-l*F+c*I)*k,t[1]=(s*F-i*D-a*I)*k,t[2]=(b*C-g*T+f*E)*k,t[3]=(h*T-p*C-d*E)*k,t[4]=(l*R-r*D-c*A)*k,t[5]=(n*D-s*R+a*A)*k,t[6]=(g*x-m*C-f*M)*k,t[7]=(u*C-h*x+d*M)*k,t[8]=(r*F-o*R+c*_)*k,t[9]=(i*R-n*F-a*_)*k,t[10]=(m*T-b*x+f*y)*k,t[11]=(p*x-u*T-d*y)*k,t[12]=(o*A-r*I-l*_)*k,t[13]=(n*I-i*A+s*_)*k,t[14]=(b*M-m*E-g*y)*k,t[15]=(u*E-p*M+h*y)*k,this}scale(t){let n=this.elements,i=t.x,s=t.y,a=t.z;return n[0]*=i,n[4]*=s,n[8]*=a,n[1]*=i,n[5]*=s,n[9]*=a,n[2]*=i,n[6]*=s,n[10]*=a,n[3]*=i,n[7]*=s,n[11]*=a,this}getMaxScaleOnAxis(){let t=this.elements,n=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(n,i,s))}makeTranslation(t,n,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,n,0,0,1,i,0,0,0,1),this}makeRotationX(t){let n=Math.cos(t),i=Math.sin(t);return this.set(1,0,0,0,0,n,-i,0,0,i,n,0,0,0,0,1),this}makeRotationY(t){let n=Math.cos(t),i=Math.sin(t);return this.set(n,0,i,0,0,1,0,0,-i,0,n,0,0,0,0,1),this}makeRotationZ(t){let n=Math.cos(t),i=Math.sin(t);return this.set(n,-i,0,0,i,n,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,n){let i=Math.cos(n),s=Math.sin(n),a=1-i,r=t.x,o=t.y,l=t.z,c=a*r,u=a*o;return this.set(c*r+i,c*o-s*l,c*l+s*o,0,c*o+s*l,u*o+i,u*l-s*r,0,c*l-s*o,u*l+s*r,a*l*l+i,0,0,0,0,1),this}makeScale(t,n,i){return this.set(t,0,0,0,0,n,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,n,i,s,a,r){return this.set(1,i,a,0,t,1,r,0,n,s,1,0,0,0,0,1),this}compose(t,n,i){let s=this.elements,a=n._x,r=n._y,o=n._z,l=n._w,c=a+a,u=r+r,p=o+o,h=a*c,d=a*u,m=a*p,b=r*u,g=r*p,f=o*p,y=l*c,M=l*u,x=l*p,E=i.x,T=i.y,C=i.z;return s[0]=(1-(b+f))*E,s[1]=(d+x)*E,s[2]=(m-M)*E,s[3]=0,s[4]=(d-x)*T,s[5]=(1-(h+f))*T,s[6]=(g+y)*T,s[7]=0,s[8]=(m+M)*C,s[9]=(g-y)*C,s[10]=(1-(h+b))*C,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,n,i){let s=this.elements;t.x=s[12],t.y=s[13],t.z=s[14];let a=this.determinantAffine();if(a===0)return i.set(1,1,1),n.identity(),this;let r=no.set(s[0],s[1],s[2]).length(),o=no.set(s[4],s[5],s[6]).length(),l=no.set(s[8],s[9],s[10]).length();a<0&&(r=-r),Ri.copy(this);let c=1/r,u=1/o,p=1/l;return Ri.elements[0]*=c,Ri.elements[1]*=c,Ri.elements[2]*=c,Ri.elements[4]*=u,Ri.elements[5]*=u,Ri.elements[6]*=u,Ri.elements[8]*=p,Ri.elements[9]*=p,Ri.elements[10]*=p,n.setFromRotationMatrix(Ri),i.x=r,i.y=o,i.z=l,this}makePerspective(t,n,i,s,a,r,o=Ui,l=!1){let c=this.elements,u=2*a/(n-t),p=2*a/(i-s),h=(n+t)/(n-t),d=(i+s)/(i-s),m,b;if(l)m=a/(r-a),b=r*a/(r-a);else if(o===Ui)m=-(r+a)/(r-a),b=-2*r*a/(r-a);else if(o===Fl)m=-r/(r-a),b=-r*a/(r-a);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=u,c[4]=0,c[8]=h,c[12]=0,c[1]=0,c[5]=p,c[9]=d,c[13]=0,c[2]=0,c[6]=0,c[10]=m,c[14]=b,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,n,i,s,a,r,o=Ui,l=!1){let c=this.elements,u=2/(n-t),p=2/(i-s),h=-(n+t)/(n-t),d=-(i+s)/(i-s),m,b;if(l)m=1/(r-a),b=r/(r-a);else if(o===Ui)m=-2/(r-a),b=-(r+a)/(r-a);else if(o===Fl)m=-1/(r-a),b=-a/(r-a);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=u,c[4]=0,c[8]=0,c[12]=h,c[1]=0,c[5]=p,c[9]=0,c[13]=d,c[2]=0,c[6]=0,c[10]=m,c[14]=b,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){let n=this.elements,i=t.elements;for(let s=0;s<16;s++)if(n[s]!==i[s])return!1;return!0}fromArray(t,n=0){for(let i=0;i<16;i++)this.elements[i]=t[i+n];return this}toArray(t=[],n=0){let i=this.elements;return t[n]=i[0],t[n+1]=i[1],t[n+2]=i[2],t[n+3]=i[3],t[n+4]=i[4],t[n+5]=i[5],t[n+6]=i[6],t[n+7]=i[7],t[n+8]=i[8],t[n+9]=i[9],t[n+10]=i[10],t[n+11]=i[11],t[n+12]=i[12],t[n+13]=i[13],t[n+14]=i[14],t[n+15]=i[15],t}},no=new H,Ri=new He,dT=new H(0,0,0),pT=new H(1,1,1),ca=new H,Ku=new H,$n=new H,dS=new He,pS=new ts,ma=class e{constructor(t=0,n=0,i=0,s=e.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=n,this._z=i,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,n,i,s=this._order){return this._x=t,this._y=n,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,n=this._order,i=!0){let s=t.elements,a=s[0],r=s[4],o=s[8],l=s[1],c=s[5],u=s[9],p=s[2],h=s[6],d=s[10];switch(n){case"XYZ":this._y=Math.asin($t(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-u,d),this._z=Math.atan2(-r,a)):(this._x=Math.atan2(h,c),this._z=0);break;case"YXZ":this._x=Math.asin(-$t(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(o,d),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-p,a),this._z=0);break;case"ZXY":this._x=Math.asin($t(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-p,d),this._z=Math.atan2(-r,c)):(this._y=0,this._z=Math.atan2(l,a));break;case"ZYX":this._y=Math.asin(-$t(p,-1,1)),Math.abs(p)<.9999999?(this._x=Math.atan2(h,d),this._z=Math.atan2(l,a)):(this._x=0,this._z=Math.atan2(-r,c));break;case"YZX":this._z=Math.asin($t(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-p,a)):(this._x=0,this._y=Math.atan2(o,d));break;case"XZY":this._z=Math.asin(-$t(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(h,c),this._y=Math.atan2(o,a)):(this._x=Math.atan2(-u,d),this._y=0);break;default:Nt("Euler: .setFromRotationMatrix() encountered an unknown order: "+n)}return this._order=n,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,n,i){return dS.makeRotationFromQuaternion(t),this.setFromRotationMatrix(dS,n,i)}setFromVector3(t,n=this._order){return this.set(t.x,t.y,t.z,n)}reorder(t){return pS.setFromEuler(this),this.setFromQuaternion(pS,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],n=0){return t[n]=this._x,t[n+1]=this._y,t[n+2]=this._z,t[n+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};ma.DEFAULT_ORDER="XYZ";var kl=class{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}},mT=0,mS=new H,io=new ts,Ts=new He,Ju=new H,Ll=new H,gT=new H,yT=new ts,gS=new H(1,0,0),yS=new H(0,1,0),vS=new H(0,0,1),xS={type:"added"},vT={type:"removed"},so={type:"childadded",child:null},Vm={type:"childremoved",child:null},vi=class e extends $i{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:mT++}),this.uuid=oc(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=e.DEFAULT_UP.clone();let t=new H,n=new ma,i=new ts,s=new H(1,1,1);function a(){i.setFromEuler(n,!1)}function r(){n.setFromQuaternion(i,void 0,!1)}n._onChange(a),i._onChange(r),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new He},normalMatrix:{value:new Ot}}),this.matrix=new He,this.matrixWorld=new He,this.matrixAutoUpdate=e.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=e.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new kl,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,n){this.quaternion.setFromAxisAngle(t,n)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,n){return io.setFromAxisAngle(t,n),this.quaternion.multiply(io),this}rotateOnWorldAxis(t,n){return io.setFromAxisAngle(t,n),this.quaternion.premultiply(io),this}rotateX(t){return this.rotateOnAxis(gS,t)}rotateY(t){return this.rotateOnAxis(yS,t)}rotateZ(t){return this.rotateOnAxis(vS,t)}translateOnAxis(t,n){return mS.copy(t).applyQuaternion(this.quaternion),this.position.add(mS.multiplyScalar(n)),this}translateX(t){return this.translateOnAxis(gS,t)}translateY(t){return this.translateOnAxis(yS,t)}translateZ(t){return this.translateOnAxis(vS,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Ts.copy(this.matrixWorld).invert())}lookAt(t,n,i){t.isVector3?Ju.copy(t):Ju.set(t,n,i);let s=this.parent;this.updateWorldMatrix(!0,!1),Ll.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Ts.lookAt(Ll,Ju,this.up):Ts.lookAt(Ju,Ll,this.up),this.quaternion.setFromRotationMatrix(Ts),s&&(Ts.extractRotation(s.matrixWorld),io.setFromRotationMatrix(Ts),this.quaternion.premultiply(io.invert()))}add(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.add(arguments[n]);return this}return t===this?(Ut("Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(xS),so.child=t,this.dispatchEvent(so),so.child=null):Ut("Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}let n=this.children.indexOf(t);return n!==-1&&(t.parent=null,this.children.splice(n,1),t.dispatchEvent(vT),Vm.child=t,this.dispatchEvent(Vm),Vm.child=null),this}removeFromParent(){let t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Ts.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Ts.multiply(t.parent.matrixWorld)),t.applyMatrix4(Ts),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(xS),so.child=t,this.dispatchEvent(so),so.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,n){if(this[t]===n)return this;for(let i=0,s=this.children.length;i<s;i++){let r=this.children[i].getObjectByProperty(t,n);if(r!==void 0)return r}}getObjectsByProperty(t,n,i=[]){this[t]===n&&i.push(this);let s=this.children;for(let a=0,r=s.length;a<r;a++)s[a].getObjectsByProperty(t,n,i);return i}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ll,t,gT),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ll,yT,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let n=this.matrixWorld.elements;return t.set(n[8],n[9],n[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(t){t(this);let n=this.children;for(let i=0,s=n.length;i<s;i++)n[i].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);let n=this.children;for(let i=0,s=n.length;i<s;i++)n[i].traverseVisible(t)}traverseAncestors(t){let n=this.parent;n!==null&&(t(n),n.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let t=this.pivot;if(t!==null){let n=t.x,i=t.y,s=t.z,a=this.matrix.elements;a[12]+=n-a[0]*n-a[4]*i-a[8]*s,a[13]+=i-a[1]*n-a[5]*i-a[9]*s,a[14]+=s-a[2]*n-a[6]*i-a[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);let n=this.children;for(let i=0,s=n.length;i<s;i++)n[i].updateMatrixWorld(t)}updateWorldMatrix(t,n,i=!1){let s=this.parent;if(t===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||i)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,i=!0),n===!0){let a=this.children;for(let r=0,o=a.length;r<o;r++)a[r].updateWorldMatrix(!1,!0,i)}}toJSON(t){let n=t===void 0||typeof t=="string",i={};n&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,s.name=this.name,s.castShadow=this.castShadow,s.receiveShadow=this.receiveShadow,s.visible=this.visible,s.frustumCulled=this.frustumCulled,s.renderOrder=this.renderOrder,s.static=this.static,s.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(t),s.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function a(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=a(t.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let l=o.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){let p=l[c];a(t.shapes,p)}else a(t.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(a(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(a(t.materials,this.material[l]));s.material=o}else s.material=a(t.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){let l=this.animations[o];s.animations.push(a(t.animations,l))}}if(n){let o=r(t.geometries),l=r(t.materials),c=r(t.textures),u=r(t.images),p=r(t.shapes),h=r(t.skeletons),d=r(t.animations),m=r(t.nodes);o.length>0&&(i.geometries=o),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),u.length>0&&(i.images=u),p.length>0&&(i.shapes=p),h.length>0&&(i.skeletons=h),d.length>0&&(i.animations=d),m.length>0&&(i.nodes=m)}return i.object=s,i;function r(o){let l=[];for(let c in o){let u=o[c];delete u.metadata,l.push(u)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,n=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.pivot=t.pivot!==null?t.pivot.clone():null,this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.static=t.static,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),n===!0)for(let i=0;i<t.children.length;i++){let s=t.children[i];this.add(s.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}};vi.DEFAULT_UP=new H(0,1,0);vi.DEFAULT_MATRIX_AUTO_UPDATE=!0;vi.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Vn=class extends vi{constructor(){super(),this.isGroup=!0,this.type="Group"}},xT={type:"move"},xo=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Vn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Vn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new H,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new H),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Vn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new H,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new H,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){let n=this._hand;if(n)for(let i of t.hand.values())this._getHandJoint(n,i)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,n,i){let s=null,a=null,r=null,o=this._targetRay,l=this._grip,c=this._hand;if(t&&n.session.visibilityState!=="visible-blurred"){if(c&&t.hand){r=!0;for(let b of t.hand.values()){let g=n.getJointPose(b,i),f=this._getHandJoint(c,b);g!==null&&(f.matrix.fromArray(g.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=g.radius),f.visible=g!==null}let u=c.joints["index-finger-tip"],p=c.joints["thumb-tip"],h=u.position.distanceTo(p.position),d=.02,m=.005;c.inputState.pinching&&h>d+m?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&h<=d-m&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(a=n.getPose(t.gripSpace,i),a!==null&&(l.matrix.fromArray(a.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,a.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(a.linearVelocity)):l.hasLinearVelocity=!1,a.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(a.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:t,target:this})));o!==null&&(s=n.getPose(t.targetRaySpace,i),s===null&&a!==null&&(s=a),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(xT)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=a!==null),c!==null&&(c.visible=r!==null),this}_getHandJoint(t,n){if(t.joints[n.jointName]===void 0){let i=new Vn;i.matrixAutoUpdate=!1,i.visible=!1,t.joints[n.jointName]=i,t.add(i)}return t.joints[n.jointName]}},fb={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ua={h:0,s:0,l:0},Qu={h:0,s:0,l:0};function Hm(e,t,n){return n<0&&(n+=1),n>1&&(n-=1),n<1/6?e+(t-e)*6*n:n<1/2?t:n<2/3?e+(t-e)*6*(2/3-n):e}var ne=class{constructor(t,n,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,n,i)}set(t,n,i){if(n===void 0&&i===void 0){let s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,n,i);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,n=Sn){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Qt.colorSpaceToWorking(this,n),this}setRGB(t,n,i,s=Qt.workingColorSpace){return this.r=t,this.g=n,this.b=i,Qt.colorSpaceToWorking(this,s),this}setHSL(t,n,i,s=Qt.workingColorSpace){if(t=cT(t,1),n=$t(n,0,1),i=$t(i,0,1),n===0)this.r=this.g=this.b=i;else{let a=i<=.5?i*(1+n):i+n-i*n,r=2*i-a;this.r=Hm(r,a,t+1/3),this.g=Hm(r,a,t),this.b=Hm(r,a,t-1/3)}return Qt.colorSpaceToWorking(this,s),this}setStyle(t,n=Sn){function i(a){a!==void 0&&parseFloat(a)<1&&Nt("Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let a,r=s[1],o=s[2];switch(r){case"rgb":case"rgba":if(a=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(a[4]),this.setRGB(Math.min(255,parseInt(a[1],10))/255,Math.min(255,parseInt(a[2],10))/255,Math.min(255,parseInt(a[3],10))/255,n);if(a=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(a[4]),this.setRGB(Math.min(100,parseInt(a[1],10))/100,Math.min(100,parseInt(a[2],10))/100,Math.min(100,parseInt(a[3],10))/100,n);break;case"hsl":case"hsla":if(a=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(a[4]),this.setHSL(parseFloat(a[1])/360,parseFloat(a[2])/100,parseFloat(a[3])/100,n);break;default:Nt("Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){let a=s[1],r=a.length;if(r===3)return this.setRGB(parseInt(a.charAt(0),16)/15,parseInt(a.charAt(1),16)/15,parseInt(a.charAt(2),16)/15,n);if(r===6)return this.setHex(parseInt(a,16),n);Nt("Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,n);return this}setColorName(t,n=Sn){let i=fb[t.toLowerCase()];return i!==void 0?this.setHex(i,n):Nt("Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Ds(t.r),this.g=Ds(t.g),this.b=Ds(t.b),this}copyLinearToSRGB(t){return this.r=mo(t.r),this.g=mo(t.g),this.b=mo(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Sn){return Qt.workingToColorSpace(_n.copy(this),t),Math.round($t(_n.r*255,0,255))*65536+Math.round($t(_n.g*255,0,255))*256+Math.round($t(_n.b*255,0,255))}getHexString(t=Sn){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,n=Qt.workingColorSpace){Qt.workingToColorSpace(_n.copy(this),n);let i=_n.r,s=_n.g,a=_n.b,r=Math.max(i,s,a),o=Math.min(i,s,a),l,c,u=(o+r)/2;if(o===r)l=0,c=0;else{let p=r-o;switch(c=u<=.5?p/(r+o):p/(2-r-o),r){case i:l=(s-a)/p+(s<a?6:0);break;case s:l=(a-i)/p+2;break;case a:l=(i-s)/p+4;break}l/=6}return t.h=l,t.s=c,t.l=u,t}getRGB(t,n=Qt.workingColorSpace){return Qt.workingToColorSpace(_n.copy(this),n),t.r=_n.r,t.g=_n.g,t.b=_n.b,t}getStyle(t=Sn){Qt.workingToColorSpace(_n.copy(this),t);let n=_n.r,i=_n.g,s=_n.b;return t!==Sn?`color(${t} ${n.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(n*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(t,n,i){return this.getHSL(ua),this.setHSL(ua.h+t,ua.s+n,ua.l+i)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,n){return this.r=t.r+n.r,this.g=t.g+n.g,this.b=t.b+n.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,n){return this.r+=(t.r-this.r)*n,this.g+=(t.g-this.g)*n,this.b+=(t.b-this.b)*n,this}lerpColors(t,n,i){return this.r=t.r+(n.r-t.r)*i,this.g=t.g+(n.g-t.g)*i,this.b=t.b+(n.b-t.b)*i,this}lerpHSL(t,n){this.getHSL(ua),t.getHSL(Qu);let i=Im(ua.h,Qu.h,n),s=Im(ua.s,Qu.s,n),a=Im(ua.l,Qu.l,n);return this.setHSL(i,s,a),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){let n=this.r,i=this.g,s=this.b,a=t.elements;return this.r=a[0]*n+a[3]*i+a[6]*s,this.g=a[1]*n+a[4]*i+a[7]*s,this.b=a[2]*n+a[5]*i+a[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,n=0){return this.r=t[n],this.g=t[n+1],this.b=t[n+2],this}toArray(t=[],n=0){return t[n]=this.r,t[n+1]=this.g,t[n+2]=this.b,t}fromBufferAttribute(t,n){return this.r=t.getX(n),this.g=t.getY(n),this.b=t.getZ(n),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},_n=new ne;ne.NAMES=fb;var Gl=class extends vi{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new ma,this.environmentIntensity=1,this.environmentRotation=new ma,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,n){return super.copy(t,n),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){let n=super.toJSON(t);return this.fog!==null&&(n.object.fog=this.fog.toJSON()),n.object.backgroundBlurriness=this.backgroundBlurriness,n.object.backgroundIntensity=this.backgroundIntensity,n.object.backgroundRotation=this.backgroundRotation.toArray(),n.object.environmentIntensity=this.environmentIntensity,n.object.environmentRotation=this.environmentRotation.toArray(),n}},Di=new H,As=new H,km=new H,ws=new H,ao=new H,ro=new H,_S=new H,Gm=new H,Wm=new H,Xm=new H,qm=new Ue,Ym=new Ue,Zm=new Ue,pa=class e{constructor(t=new H,n=new H,i=new H){this.a=t,this.b=n,this.c=i}static getNormal(t,n,i,s){s.subVectors(i,n),Di.subVectors(t,n),s.cross(Di);let a=s.lengthSq();return a>0?s.multiplyScalar(1/Math.sqrt(a)):s.set(0,0,0)}static getBarycoord(t,n,i,s,a){Di.subVectors(s,n),As.subVectors(i,n),km.subVectors(t,n);let r=Di.dot(Di),o=Di.dot(As),l=Di.dot(km),c=As.dot(As),u=As.dot(km),p=r*c-o*o;if(p===0)return a.set(0,0,0),null;let h=1/p,d=(c*l-o*u)*h,m=(r*u-o*l)*h;return a.set(1-d-m,m,d)}static containsPoint(t,n,i,s){return this.getBarycoord(t,n,i,s,ws)===null?!1:ws.x>=0&&ws.y>=0&&ws.x+ws.y<=1}static getInterpolation(t,n,i,s,a,r,o,l){return this.getBarycoord(t,n,i,s,ws)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(a,ws.x),l.addScaledVector(r,ws.y),l.addScaledVector(o,ws.z),l)}static getInterpolatedAttribute(t,n,i,s,a,r){return qm.setScalar(0),Ym.setScalar(0),Zm.setScalar(0),qm.fromBufferAttribute(t,n),Ym.fromBufferAttribute(t,i),Zm.fromBufferAttribute(t,s),r.setScalar(0),r.addScaledVector(qm,a.x),r.addScaledVector(Ym,a.y),r.addScaledVector(Zm,a.z),r}static isFrontFacing(t,n,i,s){return Di.subVectors(i,n),As.subVectors(t,n),Di.cross(As).dot(s)<0}set(t,n,i){return this.a.copy(t),this.b.copy(n),this.c.copy(i),this}setFromPointsAndIndices(t,n,i,s){return this.a.copy(t[n]),this.b.copy(t[i]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,n,i,s){return this.a.fromBufferAttribute(t,n),this.b.fromBufferAttribute(t,i),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Di.subVectors(this.c,this.b),As.subVectors(this.a,this.b),Di.cross(As).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return e.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,n){return e.getBarycoord(t,this.a,this.b,this.c,n)}getInterpolation(t,n,i,s,a){return e.getInterpolation(t,this.a,this.b,this.c,n,i,s,a)}containsPoint(t){return e.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return e.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,n){let i=this.a,s=this.b,a=this.c,r,o;ao.subVectors(s,i),ro.subVectors(a,i),Gm.subVectors(t,i);let l=ao.dot(Gm),c=ro.dot(Gm);if(l<=0&&c<=0)return n.copy(i);Wm.subVectors(t,s);let u=ao.dot(Wm),p=ro.dot(Wm);if(u>=0&&p<=u)return n.copy(s);let h=l*p-u*c;if(h<=0&&l>=0&&u<=0)return r=l/(l-u),n.copy(i).addScaledVector(ao,r);Xm.subVectors(t,a);let d=ao.dot(Xm),m=ro.dot(Xm);if(m>=0&&d<=m)return n.copy(a);let b=d*c-l*m;if(b<=0&&c>=0&&m<=0)return o=c/(c-m),n.copy(i).addScaledVector(ro,o);let g=u*m-d*p;if(g<=0&&p-u>=0&&d-m>=0)return _S.subVectors(a,s),o=(p-u)/(p-u+(d-m)),n.copy(s).addScaledVector(_S,o);let f=1/(g+b+h);return r=b*f,o=h*f,n.copy(i).addScaledVector(ao,r).addScaledVector(ro,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}},ga=class{constructor(t=new H(1/0,1/0,1/0),n=new H(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=n}set(t,n){return this.min.copy(t),this.max.copy(n),this}setFromArray(t){this.makeEmpty();for(let n=0,i=t.length;n<i;n+=3)this.expandByPoint(Ni.fromArray(t,n));return this}setFromBufferAttribute(t){this.makeEmpty();for(let n=0,i=t.count;n<i;n++)this.expandByPoint(Ni.fromBufferAttribute(t,n));return this}setFromPoints(t){this.makeEmpty();for(let n=0,i=t.length;n<i;n++)this.expandByPoint(t[n]);return this}setFromCenterAndSize(t,n){let i=Ni.copy(n).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}setFromObject(t,n=!1){return this.makeEmpty(),this.expandByObject(t,n)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,n=!1){t.updateWorldMatrix(!1,!1);let i=t.geometry;if(i!==void 0){let a=i.getAttribute("position");if(n===!0&&a!==void 0&&t.isInstancedMesh!==!0)for(let r=0,o=a.count;r<o;r++)t.isMesh===!0?t.getVertexPosition(r,Ni):Ni.fromBufferAttribute(a,r),Ni.applyMatrix4(t.matrixWorld),this.expandByPoint(Ni);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),ju.copy(t.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),ju.copy(i.boundingBox)),ju.applyMatrix4(t.matrixWorld),this.union(ju)}let s=t.children;for(let a=0,r=s.length;a<r;a++)this.expandByObject(s[a],n);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,n){return n.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Ni),Ni.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let n,i;return t.normal.x>0?(n=t.normal.x*this.min.x,i=t.normal.x*this.max.x):(n=t.normal.x*this.max.x,i=t.normal.x*this.min.x),t.normal.y>0?(n+=t.normal.y*this.min.y,i+=t.normal.y*this.max.y):(n+=t.normal.y*this.max.y,i+=t.normal.y*this.min.y),t.normal.z>0?(n+=t.normal.z*this.min.z,i+=t.normal.z*this.max.z):(n+=t.normal.z*this.max.z,i+=t.normal.z*this.min.z),n<=-t.constant&&i>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Ul),$u.subVectors(this.max,Ul),oo.subVectors(t.a,Ul),lo.subVectors(t.b,Ul),co.subVectors(t.c,Ul),ha.subVectors(lo,oo),fa.subVectors(co,lo),Ka.subVectors(oo,co);let n=[0,-ha.z,ha.y,0,-fa.z,fa.y,0,-Ka.z,Ka.y,ha.z,0,-ha.x,fa.z,0,-fa.x,Ka.z,0,-Ka.x,-ha.y,ha.x,0,-fa.y,fa.x,0,-Ka.y,Ka.x,0];return!Km(n,oo,lo,co,$u)||(n=[1,0,0,0,1,0,0,0,1],!Km(n,oo,lo,co,$u))?!1:(th.crossVectors(ha,fa),n=[th.x,th.y,th.z],Km(n,oo,lo,co,$u))}clampPoint(t,n){return n.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Ni).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Ni).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Cs[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Cs[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Cs[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Cs[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Cs[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Cs[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Cs[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Cs[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Cs),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}},Cs=[new H,new H,new H,new H,new H,new H,new H,new H],Ni=new H,ju=new ga,oo=new H,lo=new H,co=new H,ha=new H,fa=new H,Ka=new H,Ul=new H,$u=new H,th=new H,Ja=new H;function Km(e,t,n,i,s){for(let a=0,r=e.length-3;a<=r;a+=3){Ja.fromArray(e,a);let o=s.x*Math.abs(Ja.x)+s.y*Math.abs(Ja.y)+s.z*Math.abs(Ja.z),l=t.dot(Ja),c=n.dot(Ja),u=i.dot(Ja);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>o)return!1}return!0}var Ke=new H,eh=new ee,_T=0,yi=class extends $i{constructor(t,n,i=!1){if(super(),Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:_T++}),this.name="",this.array=t,this.itemSize=n,this.count=t!==void 0?t.length/n:0,this.normalized=i,this.usage=ob,this.updateRanges=[],this.gpuType=Pi,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,n){this.updateRanges.push({start:t,count:n})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,n,i){t*=this.itemSize,i*=n.itemSize;for(let s=0,a=this.itemSize;s<a;s++)this.array[t+s]=n.array[i+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let n=0,i=this.count;n<i;n++)eh.fromBufferAttribute(this,n),eh.applyMatrix3(t),this.setXY(n,eh.x,eh.y);else if(this.itemSize===3)for(let n=0,i=this.count;n<i;n++)Ke.fromBufferAttribute(this,n),Ke.applyMatrix3(t),this.setXYZ(n,Ke.x,Ke.y,Ke.z);return this}applyMatrix4(t){for(let n=0,i=this.count;n<i;n++)Ke.fromBufferAttribute(this,n),Ke.applyMatrix4(t),this.setXYZ(n,Ke.x,Ke.y,Ke.z);return this}applyNormalMatrix(t){for(let n=0,i=this.count;n<i;n++)Ke.fromBufferAttribute(this,n),Ke.applyNormalMatrix(t),this.setXYZ(n,Ke.x,Ke.y,Ke.z);return this}transformDirection(t){for(let n=0,i=this.count;n<i;n++)Ke.fromBufferAttribute(this,n),Ke.transformDirection(t),this.setXYZ(n,Ke.x,Ke.y,Ke.z);return this}set(t,n=0){return this.array.set(t,n),this}getComponent(t,n){let i=this.array[t*this.itemSize+n];return this.normalized&&(i=Nl(i,this.array)),i}setComponent(t,n,i){return this.normalized&&(i=zn(i,this.array)),this.array[t*this.itemSize+n]=i,this}getX(t){let n=this.array[t*this.itemSize];return this.normalized&&(n=Nl(n,this.array)),n}setX(t,n){return this.normalized&&(n=zn(n,this.array)),this.array[t*this.itemSize]=n,this}getY(t){let n=this.array[t*this.itemSize+1];return this.normalized&&(n=Nl(n,this.array)),n}setY(t,n){return this.normalized&&(n=zn(n,this.array)),this.array[t*this.itemSize+1]=n,this}getZ(t){let n=this.array[t*this.itemSize+2];return this.normalized&&(n=Nl(n,this.array)),n}setZ(t,n){return this.normalized&&(n=zn(n,this.array)),this.array[t*this.itemSize+2]=n,this}getW(t){let n=this.array[t*this.itemSize+3];return this.normalized&&(n=Nl(n,this.array)),n}setW(t,n){return this.normalized&&(n=zn(n,this.array)),this.array[t*this.itemSize+3]=n,this}setXY(t,n,i){return t*=this.itemSize,this.normalized&&(n=zn(n,this.array),i=zn(i,this.array)),this.array[t+0]=n,this.array[t+1]=i,this}setXYZ(t,n,i,s){return t*=this.itemSize,this.normalized&&(n=zn(n,this.array),i=zn(i,this.array),s=zn(s,this.array)),this.array[t+0]=n,this.array[t+1]=i,this.array[t+2]=s,this}setXYZW(t,n,i,s,a){return t*=this.itemSize,this.normalized&&(n=zn(n,this.array),i=zn(i,this.array),s=zn(s,this.array),a=zn(a,this.array)),this.array[t+0]=n,this.array[t+1]=i,this.array[t+2]=s,this.array[t+3]=a,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return t.name=this.name,t.usage=this.usage,t.gpuType=this.gpuType,t}dispose(){this.dispatchEvent({type:"dispose"})}};var Wl=class extends yi{constructor(t,n,i){super(new Uint16Array(t),n,i)}};var Xl=class extends yi{constructor(t,n,i){super(new Uint32Array(t),n,i)}};var $e=class extends yi{constructor(t,n,i){super(new Float32Array(t),n,i)}},ST=new ga,Ol=new H,Jm=new H,_o=class{constructor(t=new H,n=-1){this.isSphere=!0,this.center=t,this.radius=n}set(t,n){return this.center.copy(t),this.radius=n,this}setFromPoints(t,n){let i=this.center;n!==void 0?i.copy(n):ST.setFromPoints(t).getCenter(i);let s=0;for(let a=0,r=t.length;a<r;a++)s=Math.max(s,i.distanceToSquared(t[a]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){let n=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=n*n}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,n){let i=this.center.distanceToSquared(t);return n.copy(t),i>this.radius*this.radius&&(n.sub(this.center).normalize(),n.multiplyScalar(this.radius).add(this.center)),n}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Ol.subVectors(t,this.center);let n=Ol.lengthSq();if(n>this.radius*this.radius){let i=Math.sqrt(n),s=(i-this.radius)*.5;this.center.addScaledVector(Ol,s/i),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Jm.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Ol.copy(t.center).add(Jm)),this.expandByPoint(Ol.copy(t.center).sub(Jm))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}},bT=0,gi=new He,Qm=new vi,uo=new H,ti=new ga,Il=new ga,cn=new H,kn=class e extends $i{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:bT++}),this.uuid=oc(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(oT(t)?Xl:Wl)(t,1):this.index=t,this}setIndirect(t,n=0){return this.indirect=t,this.indirectOffset=n,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,n){return this.attributes[t]=n,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,n,i=0){this.groups.push({start:t,count:n,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(t,n){this.drawRange.start=t,this.drawRange.count=n}applyMatrix4(t){let n=this.attributes.position;n!==void 0&&(n.applyMatrix4(t),n.needsUpdate=!0);let i=this.attributes.normal;if(i!==void 0){let a=new Ot().getNormalMatrix(t);i.applyNormalMatrix(a),i.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(t){return gi.makeRotationFromQuaternion(t),this.applyMatrix4(gi),this}rotateX(t){return gi.makeRotationX(t),this.applyMatrix4(gi),this}rotateY(t){return gi.makeRotationY(t),this.applyMatrix4(gi),this}rotateZ(t){return gi.makeRotationZ(t),this.applyMatrix4(gi),this}translate(t,n,i){return gi.makeTranslation(t,n,i),this.applyMatrix4(gi),this}scale(t,n,i){return gi.makeScale(t,n,i),this.applyMatrix4(gi),this}lookAt(t){return Qm.lookAt(t),Qm.updateMatrix(),this.applyMatrix4(Qm.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(uo).negate(),this.translate(uo.x,uo.y,uo.z),this}setFromPoints(t){let n=this.getAttribute("position");if(n===void 0){let i=[];for(let s=0,a=t.length;s<a;s++){let r=t[s];i.push(r.x,r.y,r.z||0)}this.setAttribute("position",new $e(i,3))}else{let i=Math.min(t.length,n.count);for(let s=0;s<i;s++){let a=t[s];n.setXYZ(s,a.x,a.y,a.z||0)}t.length>n.count&&Nt("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),n.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ga);let t=this.attributes.position,n=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){Ut("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new H(-1/0,-1/0,-1/0),new H(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),n)for(let i=0,s=n.length;i<s;i++){let a=n[i];ti.setFromBufferAttribute(a),this.morphTargetsRelative?(cn.addVectors(this.boundingBox.min,ti.min),this.boundingBox.expandByPoint(cn),cn.addVectors(this.boundingBox.max,ti.max),this.boundingBox.expandByPoint(cn)):(this.boundingBox.expandByPoint(ti.min),this.boundingBox.expandByPoint(ti.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Ut('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new _o);let t=this.attributes.position,n=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){Ut("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new H,1/0);return}if(t){let i=this.boundingSphere.center;if(ti.setFromBufferAttribute(t),n)for(let a=0,r=n.length;a<r;a++){let o=n[a];Il.setFromBufferAttribute(o),this.morphTargetsRelative?(cn.addVectors(ti.min,Il.min),ti.expandByPoint(cn),cn.addVectors(ti.max,Il.max),ti.expandByPoint(cn)):(ti.expandByPoint(Il.min),ti.expandByPoint(Il.max))}ti.getCenter(i);let s=0;for(let a=0,r=t.count;a<r;a++)cn.fromBufferAttribute(t,a),s=Math.max(s,i.distanceToSquared(cn));if(n)for(let a=0,r=n.length;a<r;a++){let o=n[a],l=this.morphTargetsRelative;for(let c=0,u=o.count;c<u;c++)cn.fromBufferAttribute(o,c),l&&(uo.fromBufferAttribute(t,c),cn.add(uo)),s=Math.max(s,i.distanceToSquared(cn))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&Ut('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let t=this.index,n=this.attributes;if(t===null||n.position===void 0||n.normal===void 0||n.uv===void 0){Ut("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let i=n.position,s=n.normal,a=n.uv,r=this.getAttribute("tangent");(r===void 0||r.count!==i.count)&&(r=new yi(new Float32Array(4*i.count),4),this.setAttribute("tangent",r));let o=[],l=[];for(let _=0;_<i.count;_++)o[_]=new H,l[_]=new H;let c=new H,u=new H,p=new H,h=new ee,d=new ee,m=new ee,b=new H,g=new H;function f(_,A,R){c.fromBufferAttribute(i,_),u.fromBufferAttribute(i,A),p.fromBufferAttribute(i,R),h.fromBufferAttribute(a,_),d.fromBufferAttribute(a,A),m.fromBufferAttribute(a,R),u.sub(c),p.sub(c),d.sub(h),m.sub(h);let I=1/(d.x*m.y-m.x*d.y);isFinite(I)&&(b.copy(u).multiplyScalar(m.y).addScaledVector(p,-d.y).multiplyScalar(I),g.copy(p).multiplyScalar(d.x).addScaledVector(u,-m.x).multiplyScalar(I),o[_].add(b),o[A].add(b),o[R].add(b),l[_].add(g),l[A].add(g),l[R].add(g))}let y=this.groups;y.length===0&&(y=[{start:0,count:t.count}]);for(let _=0,A=y.length;_<A;++_){let R=y[_],I=R.start,F=R.count;for(let D=I,O=I+F;D<O;D+=3)f(t.getX(D+0),t.getX(D+1),t.getX(D+2))}let M=new H,x=new H,E=new H,T=new H;function C(_){E.fromBufferAttribute(s,_),T.copy(E);let A=o[_];M.copy(A),M.sub(E.multiplyScalar(E.dot(A))).normalize(),x.crossVectors(T,A);let I=x.dot(l[_])<0?-1:1;r.setXYZW(_,M.x,M.y,M.z,I)}for(let _=0,A=y.length;_<A;++_){let R=y[_],I=R.start,F=R.count;for(let D=I,O=I+F;D<O;D+=3)C(t.getX(D+0)),C(t.getX(D+1)),C(t.getX(D+2))}this._transformed=!0}computeVertexNormals(){let t=this.index,n=this.getAttribute("position");if(n!==void 0){let i=this.getAttribute("normal");if(i===void 0||i.count!==n.count)i=new yi(new Float32Array(n.count*3),3),this.setAttribute("normal",i);else for(let h=0,d=i.count;h<d;h++)i.setXYZ(h,0,0,0);let s=new H,a=new H,r=new H,o=new H,l=new H,c=new H,u=new H,p=new H;if(t)for(let h=0,d=t.count;h<d;h+=3){let m=t.getX(h+0),b=t.getX(h+1),g=t.getX(h+2);s.fromBufferAttribute(n,m),a.fromBufferAttribute(n,b),r.fromBufferAttribute(n,g),u.subVectors(r,a),p.subVectors(s,a),u.cross(p),o.fromBufferAttribute(i,m),l.fromBufferAttribute(i,b),c.fromBufferAttribute(i,g),o.add(u),l.add(u),c.add(u),i.setXYZ(m,o.x,o.y,o.z),i.setXYZ(b,l.x,l.y,l.z),i.setXYZ(g,c.x,c.y,c.z)}else for(let h=0,d=n.count;h<d;h+=3)s.fromBufferAttribute(n,h+0),a.fromBufferAttribute(n,h+1),r.fromBufferAttribute(n,h+2),u.subVectors(r,a),p.subVectors(s,a),u.cross(p),i.setXYZ(h+0,u.x,u.y,u.z),i.setXYZ(h+1,u.x,u.y,u.z),i.setXYZ(h+2,u.x,u.y,u.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){let t=this.attributes.normal;for(let n=0,i=t.count;n<i;n++)cn.fromBufferAttribute(t,n),cn.normalize(),t.setXYZ(n,cn.x,cn.y,cn.z)}toNonIndexed(){function t(o,l){let c=o.array,u=o.itemSize,p=o.normalized,h=new c.constructor(l.length*u),d=0,m=0;for(let b=0,g=l.length;b<g;b++){o.isInterleavedBufferAttribute?d=l[b]*o.data.stride+o.offset:d=l[b]*u;for(let f=0;f<u;f++)h[m++]=c[d++]}return new yi(h,u,p)}if(this.index===null)return Nt("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let n=new e,i=this.index.array,s=this.attributes;for(let o in s){let l=s[o],c=t(l,i);n.setAttribute(o,c)}let a=this.morphAttributes;for(let o in a){let l=[],c=a[o];for(let u=0,p=c.length;u<p;u++){let h=c[u],d=t(h,i);l.push(d)}n.morphAttributes[o]=l}n.morphTargetsRelative=this.morphTargetsRelative;let r=this.groups;for(let o=0,l=r.length;o<l;o++){let c=r[o];n.addGroup(c.start,c.count,c.materialIndex)}return n}toJSON(){let t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,t.name=this.name,Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};let n=this.index;n!==null&&(t.data.index={type:n.array.constructor.name,array:Array.prototype.slice.call(n.array)});let i=this.attributes;for(let l in i){let c=i[l];t.data.attributes[l]=c.toJSON(t.data)}let s={},a=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],u=[];for(let p=0,h=c.length;p<h;p++){let d=c[p];u.push(d.toJSON(t.data))}u.length>0&&(s[l]=u,a=!0)}a&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);let r=this.groups;r.length>0&&(t.data.groups=JSON.parse(JSON.stringify(r)));let o=this.boundingSphere;return o!==null&&(t.data.boundingSphere=o.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let n={};this.name=t.name;let i=t.index;i!==null&&this.setIndex(i.clone());let s=t.attributes;for(let c in s){let u=s[c];this.setAttribute(c,u.clone(n))}let a=t.morphAttributes;for(let c in a){let u=[],p=a[c];for(let h=0,d=p.length;h<d;h++)u.push(p[h].clone(n));this.morphAttributes[c]=u}this.morphTargetsRelative=t.morphTargetsRelative;let r=t.groups;for(let c=0,u=r.length;c<u;c++){let p=r[c];this.addGroup(p.start,p.count,p.materialIndex)}let o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());let l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this._transformed=t._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}};var jm=new H,MT=new H,ET=new Ot,Li=class{constructor(t=new H(1,0,0),n=0){this.isPlane=!0,this.normal=t,this.constant=n}set(t,n){return this.normal.copy(t),this.constant=n,this}setComponents(t,n,i,s){return this.normal.set(t,n,i),this.constant=s,this}setFromNormalAndCoplanarPoint(t,n){return this.normal.copy(t),this.constant=-n.dot(this.normal),this}setFromCoplanarPoints(t,n,i){let s=jm.subVectors(i,n).cross(MT.subVectors(t,n)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){let t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,n){return n.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,n,i=!0){let s=t.delta(jm),a=this.normal.dot(s);if(a===0)return this.distanceToPoint(t.start)===0?n.copy(t.start):null;let r=-(t.start.dot(this.normal)+this.constant)/a;return i===!0&&(r<0||r>1)?null:n.copy(t.start).addScaledVector(s,r)}intersectsLine(t){let n=this.distanceToPoint(t.start),i=this.distanceToPoint(t.end);return n<0&&i>0||i<0&&n>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,n){let i=n||ET.getNormalMatrix(t),s=this.coplanarPoint(jm).applyMatrix4(t),a=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(a),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(t){return this.normal.fromArray(t.normal),this.constant=t.constant,this}},TT=0,tr=class extends $i{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:TT++}),this.uuid=oc(),this.name="",this.type="Material",this.blending=Mo,this.side=ba,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=fg,this.blendDst=dg,this.blendEquation=nr,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new ne(0,0,0),this.blendAlpha=0,this.depthFunc=go,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=tb,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=mh,this.stencilZFail=mh,this.stencilZPass=mh,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(let n in t){let i=t[n];if(i===void 0){Nt(`Material: parameter '${n}' has value of undefined.`);continue}let s=this[n];if(s===void 0){Nt(`Material: '${n}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector2&&i&&i.isVector2||s&&s.isEuler&&i&&i.isEuler||s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[n]=i}}toJSON(t){let n=t===void 0||typeof t=="string";n&&(t={textures:{},images:{}});let i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,i.blending=this.blending,i.side=this.side,i.shadowSide=this.shadowSide,i.vertexColors=this.vertexColors,i.opacity=this.opacity,i.transparent=this.transparent,i.blendSrc=this.blendSrc,i.blendDst=this.blendDst,i.blendEquation=this.blendEquation,i.blendSrcAlpha=this.blendSrcAlpha,i.blendDstAlpha=this.blendDstAlpha,i.blendEquationAlpha=this.blendEquationAlpha,i.blendColor=this.blendColor.getHex(),i.blendAlpha=this.blendAlpha,i.depthFunc=this.depthFunc,i.depthTest=this.depthTest,i.depthWrite=this.depthWrite,i.colorWrite=this.colorWrite,i.clipIntersection=this.clipIntersection,i.clipShadows=this.clipShadows,i.stencilWriteMask=this.stencilWriteMask,i.stencilFunc=this.stencilFunc,i.stencilRef=this.stencilRef,i.stencilFuncMask=this.stencilFuncMask,i.stencilFail=this.stencilFail,i.stencilZFail=this.stencilZFail,i.stencilZPass=this.stencilZPass,i.stencilWrite=this.stencilWrite,i.polygonOffset=this.polygonOffset,i.polygonOffsetFactor=this.polygonOffsetFactor,i.polygonOffsetUnits=this.polygonOffsetUnits,i.dithering=this.dithering,i.alphaTest=this.alphaTest,i.alphaHash=this.alphaHash,i.alphaToCoverage=this.alphaToCoverage,i.premultipliedAlpha=this.premultipliedAlpha,i.forceSinglePass=this.forceSinglePass,i.allowOverride=this.allowOverride,i.visible=this.visible,i.toneMapped=this.toneMapped,i.name=this.name,this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(i.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(t).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(t).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(t).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(t).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(t).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(i.clippingPlanes=this.clippingPlanes.map(a=>a.toJSON())),this.rotation!==void 0&&(i.rotation=this.rotation),this.depthPacking!==void 0&&(i.depthPacking=this.depthPacking),this.linewidth!==void 0&&(i.linewidth=this.linewidth),this.linecap!==void 0&&(i.linecap=this.linecap),this.linejoin!==void 0&&(i.linejoin=this.linejoin),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.wireframe!==void 0&&(i.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(i.flatShading=this.flatShading),this.fog!==void 0&&(i.fog=this.fog),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(a){let r=[];for(let o in a){let l=a[o];delete l.metadata,r.push(l)}return r}if(n){let a=s(t.textures),r=s(t.images);a.length>0&&(i.textures=a),r.length>0&&(i.images=r)}return i}fromJSON(t,n){if(t.uuid!==void 0&&(this.uuid=t.uuid),t.name!==void 0&&(this.name=t.name),t.color!==void 0&&this.color!==void 0&&this.color.setHex(t.color),t.roughness!==void 0&&(this.roughness=t.roughness),t.metalness!==void 0&&(this.metalness=t.metalness),t.sheen!==void 0&&(this.sheen=t.sheen),t.sheenColor!==void 0&&(this.sheenColor=new ne().setHex(t.sheenColor)),t.sheenRoughness!==void 0&&(this.sheenRoughness=t.sheenRoughness),t.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(t.emissive),t.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(t.specular),t.specularIntensity!==void 0&&(this.specularIntensity=t.specularIntensity),t.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(t.specularColor),t.shininess!==void 0&&(this.shininess=t.shininess),t.clearcoat!==void 0&&(this.clearcoat=t.clearcoat),t.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=t.clearcoatRoughness),t.dispersion!==void 0&&(this.dispersion=t.dispersion),t.retroreflectivity!==void 0&&(this.retroreflectivity=t.retroreflectivity),t.iridescence!==void 0&&(this.iridescence=t.iridescence),t.iridescenceIOR!==void 0&&(this.iridescenceIOR=t.iridescenceIOR),t.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=t.iridescenceThicknessRange),t.transmission!==void 0&&(this.transmission=t.transmission),t.thickness!==void 0&&(this.thickness=t.thickness),t.attenuationDistance!==void 0&&(this.attenuationDistance=t.attenuationDistance),t.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(t.attenuationColor),t.anisotropy!==void 0&&(this.anisotropy=t.anisotropy),t.anisotropyRotation!==void 0&&(this.anisotropyRotation=t.anisotropyRotation),t.fog!==void 0&&(this.fog=t.fog),t.flatShading!==void 0&&(this.flatShading=t.flatShading),t.blending!==void 0&&(this.blending=t.blending),t.combine!==void 0&&(this.combine=t.combine),t.side!==void 0&&(this.side=t.side),t.shadowSide!==void 0&&(this.shadowSide=t.shadowSide),t.opacity!==void 0&&(this.opacity=t.opacity),t.transparent!==void 0&&(this.transparent=t.transparent),t.alphaTest!==void 0&&(this.alphaTest=t.alphaTest),t.alphaHash!==void 0&&(this.alphaHash=t.alphaHash),t.depthFunc!==void 0&&(this.depthFunc=t.depthFunc),t.depthTest!==void 0&&(this.depthTest=t.depthTest),t.depthWrite!==void 0&&(this.depthWrite=t.depthWrite),t.colorWrite!==void 0&&(this.colorWrite=t.colorWrite),t.clippingPlanes!==void 0&&(this.clippingPlanes=t.clippingPlanes.map(i=>new Li().fromJSON(i))),t.clipIntersection!==void 0&&(this.clipIntersection=t.clipIntersection),t.clipShadows!==void 0&&(this.clipShadows=t.clipShadows),t.depthPacking!==void 0&&(this.depthPacking=t.depthPacking),t.blendSrc!==void 0&&(this.blendSrc=t.blendSrc),t.blendDst!==void 0&&(this.blendDst=t.blendDst),t.blendEquation!==void 0&&(this.blendEquation=t.blendEquation),t.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=t.blendSrcAlpha),t.blendDstAlpha!==void 0&&(this.blendDstAlpha=t.blendDstAlpha),t.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=t.blendEquationAlpha),t.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(t.blendColor),t.blendAlpha!==void 0&&(this.blendAlpha=t.blendAlpha),t.stencilWriteMask!==void 0&&(this.stencilWriteMask=t.stencilWriteMask),t.stencilFunc!==void 0&&(this.stencilFunc=t.stencilFunc),t.stencilRef!==void 0&&(this.stencilRef=t.stencilRef),t.stencilFuncMask!==void 0&&(this.stencilFuncMask=t.stencilFuncMask),t.stencilFail!==void 0&&(this.stencilFail=t.stencilFail),t.stencilZFail!==void 0&&(this.stencilZFail=t.stencilZFail),t.stencilZPass!==void 0&&(this.stencilZPass=t.stencilZPass),t.stencilWrite!==void 0&&(this.stencilWrite=t.stencilWrite),t.wireframe!==void 0&&(this.wireframe=t.wireframe),t.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=t.wireframeLinewidth),t.wireframeLinecap!==void 0&&(this.wireframeLinecap=t.wireframeLinecap),t.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=t.wireframeLinejoin),t.rotation!==void 0&&(this.rotation=t.rotation),t.linewidth!==void 0&&(this.linewidth=t.linewidth),t.linecap!==void 0&&(this.linecap=t.linecap),t.linejoin!==void 0&&(this.linejoin=t.linejoin),t.dashSize!==void 0&&(this.dashSize=t.dashSize),t.gapSize!==void 0&&(this.gapSize=t.gapSize),t.scale!==void 0&&(this.scale=t.scale),t.polygonOffset!==void 0&&(this.polygonOffset=t.polygonOffset),t.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=t.polygonOffsetFactor),t.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=t.polygonOffsetUnits),t.dithering!==void 0&&(this.dithering=t.dithering),t.alphaToCoverage!==void 0&&(this.alphaToCoverage=t.alphaToCoverage),t.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=t.premultipliedAlpha),t.forceSinglePass!==void 0&&(this.forceSinglePass=t.forceSinglePass),t.allowOverride!==void 0&&(this.allowOverride=t.allowOverride),t.visible!==void 0&&(this.visible=t.visible),t.toneMapped!==void 0&&(this.toneMapped=t.toneMapped),t.userData!==void 0&&(this.userData=t.userData),t.vertexColors!==void 0&&(typeof t.vertexColors=="number"?this.vertexColors=t.vertexColors>0:this.vertexColors=t.vertexColors),t.size!==void 0&&(this.size=t.size),t.sizeAttenuation!==void 0&&(this.sizeAttenuation=t.sizeAttenuation),t.map!==void 0&&(this.map=n[t.map]||null),t.matcap!==void 0&&(this.matcap=n[t.matcap]||null),t.alphaMap!==void 0&&(this.alphaMap=n[t.alphaMap]||null),t.bumpMap!==void 0&&(this.bumpMap=n[t.bumpMap]||null),t.bumpScale!==void 0&&(this.bumpScale=t.bumpScale),t.normalMap!==void 0&&(this.normalMap=n[t.normalMap]||null),t.normalMapType!==void 0&&(this.normalMapType=t.normalMapType),t.normalScale!==void 0){let i=t.normalScale;Array.isArray(i)===!1&&(i=[i,i]),this.normalScale=new ee().fromArray(i)}return t.displacementMap!==void 0&&(this.displacementMap=n[t.displacementMap]||null),t.displacementScale!==void 0&&(this.displacementScale=t.displacementScale),t.displacementBias!==void 0&&(this.displacementBias=t.displacementBias),t.roughnessMap!==void 0&&(this.roughnessMap=n[t.roughnessMap]||null),t.metalnessMap!==void 0&&(this.metalnessMap=n[t.metalnessMap]||null),t.emissiveMap!==void 0&&(this.emissiveMap=n[t.emissiveMap]||null),t.emissiveIntensity!==void 0&&(this.emissiveIntensity=t.emissiveIntensity),t.specularMap!==void 0&&(this.specularMap=n[t.specularMap]||null),t.specularIntensityMap!==void 0&&(this.specularIntensityMap=n[t.specularIntensityMap]||null),t.specularColorMap!==void 0&&(this.specularColorMap=n[t.specularColorMap]||null),t.envMap!==void 0&&(this.envMap=n[t.envMap]||null),t.envMapRotation!==void 0&&this.envMapRotation.fromArray(t.envMapRotation),t.envMapIntensity!==void 0&&(this.envMapIntensity=t.envMapIntensity),t.reflectivity!==void 0&&(this.reflectivity=t.reflectivity),t.refractionRatio!==void 0&&(this.refractionRatio=t.refractionRatio),t.lightMap!==void 0&&(this.lightMap=n[t.lightMap]||null),t.lightMapIntensity!==void 0&&(this.lightMapIntensity=t.lightMapIntensity),t.aoMap!==void 0&&(this.aoMap=n[t.aoMap]||null),t.aoMapIntensity!==void 0&&(this.aoMapIntensity=t.aoMapIntensity),t.gradientMap!==void 0&&(this.gradientMap=n[t.gradientMap]||null),t.clearcoatMap!==void 0&&(this.clearcoatMap=n[t.clearcoatMap]||null),t.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=n[t.clearcoatRoughnessMap]||null),t.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=n[t.clearcoatNormalMap]||null),t.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new ee().fromArray(t.clearcoatNormalScale)),t.iridescenceMap!==void 0&&(this.iridescenceMap=n[t.iridescenceMap]||null),t.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=n[t.iridescenceThicknessMap]||null),t.transmissionMap!==void 0&&(this.transmissionMap=n[t.transmissionMap]||null),t.thicknessMap!==void 0&&(this.thicknessMap=n[t.thicknessMap]||null),t.anisotropyMap!==void 0&&(this.anisotropyMap=n[t.anisotropyMap]||null),t.sheenColorMap!==void 0&&(this.sheenColorMap=n[t.sheenColorMap]||null),t.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=n[t.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;let n=t.clippingPlanes,i=null;if(n!==null){let s=n.length;i=new Array(s);for(let a=0;a!==s;++a)i[a]=n[a].clone()}return this.clippingPlanes=i,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.allowOverride=t.allowOverride,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}};var Rs=new H,$m=new H,nh=new H,ih=new H,Dh=class{constructor(t=new H,n=new H(0,0,-1)){this.origin=t,this.direction=n}set(t,n){return this.origin.copy(t),this.direction.copy(n),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,n){return n.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Rs)),this}closestPointToPoint(t,n){n.subVectors(t,this.origin);let i=n.dot(this.direction);return i<0?n.copy(this.origin):n.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){let n=Rs.subVectors(t,this.origin).dot(this.direction);return n<0?this.origin.distanceToSquared(t):(Rs.copy(this.origin).addScaledVector(this.direction,n),Rs.distanceToSquared(t))}distanceSqToSegment(t,n,i,s){$m.copy(t).add(n).multiplyScalar(.5),nh.copy(n).sub(t).normalize(),ih.copy(this.origin).sub($m);let a=t.distanceTo(n)*.5,r=-this.direction.dot(nh),o=ih.dot(this.direction),l=-ih.dot(nh),c=ih.lengthSq(),u=Math.abs(1-r*r),p,h,d,m;if(u>0)if(p=r*l-o,h=r*o-l,m=a*u,p>=0)if(h>=-m)if(h<=m){let b=1/u;p*=b,h*=b,d=p*(p+r*h+2*o)+h*(r*p+h+2*l)+c}else h=a,p=Math.max(0,-(r*h+o)),d=-p*p+h*(h+2*l)+c;else h=-a,p=Math.max(0,-(r*h+o)),d=-p*p+h*(h+2*l)+c;else h<=-m?(p=Math.max(0,-(-r*a+o)),h=p>0?-a:Math.min(Math.max(-a,-l),a),d=-p*p+h*(h+2*l)+c):h<=m?(p=0,h=Math.min(Math.max(-a,-l),a),d=h*(h+2*l)+c):(p=Math.max(0,-(r*a+o)),h=p>0?a:Math.min(Math.max(-a,-l),a),d=-p*p+h*(h+2*l)+c);else h=r>0?-a:a,p=Math.max(0,-(r*h+o)),d=-p*p+h*(h+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,p),s&&s.copy($m).addScaledVector(nh,h),d}intersectSphere(t,n){if(t.radius<0)return null;Rs.subVectors(t.center,this.origin);let i=Rs.dot(this.direction),s=Rs.dot(Rs)-i*i,a=t.radius*t.radius;if(s>a)return null;let r=Math.sqrt(a-s),o=i-r,l=i+r;return l<0?null:o<0?this.at(l,n):this.at(o,n)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){let n=t.normal.dot(this.direction);if(n===0)return t.distanceToPoint(this.origin)===0?0:null;let i=-(this.origin.dot(t.normal)+t.constant)/n;return i>=0?i:null}intersectPlane(t,n){let i=this.distanceToPlane(t);return i===null?null:this.at(i,n)}intersectsPlane(t){let n=t.distanceToPoint(this.origin);return n===0||t.normal.dot(this.direction)*n<0}intersectBox(t,n){let i,s,a,r,o,l,c=1/this.direction.x,u=1/this.direction.y,p=1/this.direction.z,h=this.origin;return c>=0?(i=(t.min.x-h.x)*c,s=(t.max.x-h.x)*c):(i=(t.max.x-h.x)*c,s=(t.min.x-h.x)*c),u>=0?(a=(t.min.y-h.y)*u,r=(t.max.y-h.y)*u):(a=(t.max.y-h.y)*u,r=(t.min.y-h.y)*u),i>r||a>s||((a>i||isNaN(i))&&(i=a),(r<s||isNaN(s))&&(s=r),p>=0?(o=(t.min.z-h.z)*p,l=(t.max.z-h.z)*p):(o=(t.max.z-h.z)*p,l=(t.min.z-h.z)*p),i>l||o>s)||((o>i||i!==i)&&(i=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(i>=0?i:s,n)}intersectsBox(t){return this.intersectBox(t,Rs)!==null}intersectTriangle(t,n,i,s,a){let r=this.origin,o=this.direction,l=o.x,c=o.y,u=o.z,p=t.x-r.x,h=t.y-r.y,d=t.z-r.z,m=n.x-r.x,b=n.y-r.y,g=n.z-r.z,f=i.x-r.x,y=i.y-r.y,M=i.z-r.z,x=Math.abs(l),E=Math.abs(c),T=Math.abs(u),C,_,A,R,I,F,D,O,k,K,Y,it;if(x>=E&&x>=T?(A=l,F=p,k=m,it=f,l>=0?(C=c,_=u,R=h,I=d,D=b,O=g,K=y,Y=M):(C=u,_=c,R=d,I=h,D=g,O=b,K=M,Y=y)):E>=T?(A=c,F=h,k=b,it=y,c>=0?(C=u,_=l,R=d,I=p,D=g,O=m,K=M,Y=f):(C=l,_=u,R=p,I=d,D=m,O=g,K=f,Y=M)):(A=u,F=d,k=g,it=M,u>=0?(C=l,_=c,R=p,I=h,D=m,O=b,K=f,Y=y):(C=c,_=l,R=h,I=p,D=b,O=m,K=y,Y=f)),A===0)return null;let X=C/A,tt=_/A,et=1/A,st=R-X*F,gt=I-tt*F,Yt=D-X*k,Rt=O-tt*k,Zt=K-X*it,W=Y-tt*it,Q=Zt*Rt-W*Yt,St=st*W-gt*Zt,It=Yt*gt-Rt*st;if(s){if(Q<0||St<0||It<0)return null}else if((Q<0||St<0||It<0)&&(Q>0||St>0||It>0))return null;let xt=Q+St+It;if(xt===0)return null;let Ht=et*(Q*F+St*k+It*it);return(xt>0?Ht<0:Ht>0)?null:this.at(Ht/xt,a)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},xi=class extends tr{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new ne(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ma,this.combine=pg,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}},SS=new He,Qa=new Dh,sh=new _o,bS=new H,ah=new H,rh=new H,oh=new H,tg=new H,lh=new H,MS=new H,ch=new H,tn=class extends vi{constructor(t=new kn,n=new xi){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=n,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,n){return super.copy(t,n),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){let n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){let s=n[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,r=s.length;a<r;a++){let o=s[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=a}}}}getVertexPosition(t,n){let i=this.geometry,s=i.attributes.position,a=i.morphAttributes.position,r=i.morphTargetsRelative;n.fromBufferAttribute(s,t);let o=this.morphTargetInfluences;if(a&&o){lh.set(0,0,0);for(let l=0,c=a.length;l<c;l++){let u=o[l],p=a[l];u!==0&&(tg.fromBufferAttribute(p,t),r?lh.addScaledVector(tg,u):lh.addScaledVector(tg.sub(n),u))}n.add(lh)}return n}intersectsFrustum(t){return t.intersectsObject(this)}raycast(t,n){let i=this.geometry,s=this.material,a=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),sh.copy(i.boundingSphere),sh.applyMatrix4(a),Qa.copy(t.ray).recast(t.near),!(sh.containsPoint(Qa.origin)===!1&&(Qa.intersectSphere(sh,bS)===null||Qa.origin.distanceToSquared(bS)>(t.far-t.near)**2))&&(SS.copy(a).invert(),Qa.copy(t.ray).applyMatrix4(SS),!(i.boundingBox!==null&&Qa.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(t,n,Qa)))}_computeIntersections(t,n,i){let s,a=this.geometry,r=this.material,o=a.index,l=a.attributes.position,c=a.attributes.uv,u=a.attributes.uv1,p=a.attributes.normal,h=a.groups,d=a.drawRange;if(o!==null)if(Array.isArray(r))for(let m=0,b=h.length;m<b;m++){let g=h[m],f=r[g.materialIndex],y=Math.max(g.start,d.start),M=Math.min(o.count,Math.min(g.start+g.count,d.start+d.count));for(let x=y,E=M;x<E;x+=3){let T=o.getX(x),C=o.getX(x+1),_=o.getX(x+2);s=uh(this,f,t,i,c,u,p,T,C,_),s&&(s.faceIndex=Math.floor(x/3),s.face.materialIndex=g.materialIndex,n.push(s))}}else{let m=Math.max(0,d.start),b=Math.min(o.count,d.start+d.count);for(let g=m,f=b;g<f;g+=3){let y=o.getX(g),M=o.getX(g+1),x=o.getX(g+2);s=uh(this,r,t,i,c,u,p,y,M,x),s&&(s.faceIndex=Math.floor(g/3),n.push(s))}}else if(l!==void 0)if(Array.isArray(r))for(let m=0,b=h.length;m<b;m++){let g=h[m],f=r[g.materialIndex],y=Math.max(g.start,d.start),M=Math.min(l.count,Math.min(g.start+g.count,d.start+d.count));for(let x=y,E=M;x<E;x+=3){let T=x,C=x+1,_=x+2;s=uh(this,f,t,i,c,u,p,T,C,_),s&&(s.faceIndex=Math.floor(x/3),s.face.materialIndex=g.materialIndex,n.push(s))}}else{let m=Math.max(0,d.start),b=Math.min(l.count,d.start+d.count);for(let g=m,f=b;g<f;g+=3){let y=g,M=g+1,x=g+2;s=uh(this,r,t,i,c,u,p,y,M,x),s&&(s.faceIndex=Math.floor(g/3),n.push(s))}}}};function AT(e,t,n,i,s,a,r,o){let l;if(t.side===Cn?l=i.intersectTriangle(r,a,s,!0,o):l=i.intersectTriangle(s,a,r,t.side===ba,o),l===null)return null;ch.copy(o),ch.applyMatrix4(e.matrixWorld);let c=n.ray.origin.distanceTo(ch);return c<n.near||c>n.far?null:{distance:c,point:ch.clone(),object:e}}function uh(e,t,n,i,s,a,r,o,l,c){e.getVertexPosition(o,ah),e.getVertexPosition(l,rh),e.getVertexPosition(c,oh);let u=AT(e,t,n,i,ah,rh,oh,MS);if(u){let p=new H;pa.getBarycoord(MS,ah,rh,oh,p),s&&(u.uv=pa.getInterpolatedAttribute(s,o,l,c,p,new ee)),a&&(u.uv1=pa.getInterpolatedAttribute(a,o,l,c,p,new ee)),r&&(u.normal=pa.getInterpolatedAttribute(r,o,l,c,p,new H),u.normal.dot(i.direction)>0&&u.normal.multiplyScalar(-1));let h={a:o,b:l,c,normal:new H,materialIndex:0};pa.getNormal(ah,rh,oh,h.normal),u.face=h,u.barycoord=p}return u}var Nh=class extends bn{constructor(t=null,n=1,i=1,s,a,r,o,l,c=ke,u=ke,p,h){super(null,r,o,l,c,u,s,a,p,h),this.isDataTexture=!0,this.image={data:t,width:n,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var ja=new _o,wT=new ee(.5,.5),hh=new H,ql=class{constructor(t=new Li,n=new Li,i=new Li,s=new Li,a=new Li,r=new Li){this.planes=[t,n,i,s,a,r]}set(t,n,i,s,a,r){let o=this.planes;return o[0].copy(t),o[1].copy(n),o[2].copy(i),o[3].copy(s),o[4].copy(a),o[5].copy(r),this}copy(t){let n=this.planes;for(let i=0;i<6;i++)n[i].copy(t.planes[i]);return this}setFromProjectionMatrix(t,n=Ui,i=!1){let s=this.planes,a=t.elements,r=a[0],o=a[1],l=a[2],c=a[3],u=a[4],p=a[5],h=a[6],d=a[7],m=a[8],b=a[9],g=a[10],f=a[11],y=a[12],M=a[13],x=a[14],E=a[15];if(s[0].setComponents(c-r,d-u,f-m,E-y).normalize(),s[1].setComponents(c+r,d+u,f+m,E+y).normalize(),s[2].setComponents(c+o,d+p,f+b,E+M).normalize(),s[3].setComponents(c-o,d-p,f-b,E-M).normalize(),i)s[4].setComponents(l,h,g,x).normalize(),s[5].setComponents(c-l,d-h,f-g,E-x).normalize();else if(s[4].setComponents(c-l,d-h,f-g,E-x).normalize(),n===Ui)s[5].setComponents(c+l,d+h,f+g,E+x).normalize();else if(n===Fl)s[5].setComponents(l,h,g,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+n);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),ja.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{let n=t.geometry;n.boundingSphere===null&&n.computeBoundingSphere(),ja.copy(n.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(ja)}intersectsSprite(t){ja.center.set(0,0,0);let n=wT.distanceTo(t.center);return ja.radius=.7071067811865476+n,ja.applyMatrix4(t.matrixWorld),this.intersectsSphere(ja)}intersectsSphere(t){let n=this.planes,i=t.center,s=-t.radius;for(let a=0;a<6;a++)if(n[a].distanceToPoint(i)<s)return!1;return!0}intersectsBox(t){let n=this.planes;for(let i=0;i<6;i++){let s=n[i];if(hh.x=s.normal.x>0?t.max.x:t.min.x,hh.y=s.normal.y>0?t.max.y:t.min.y,hh.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(hh)<0)return!1}return!0}containsPoint(t){let n=this.planes;for(let i=0;i<6;i++)if(n[i].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var Yl=class extends bn{constructor(t=[],n=Ma,i,s,a,r,o,l,c,u){super(t,n,i,s,a,r,o,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}};var ya=class extends bn{constructor(t,n,i=Ii,s,a,r,o=ke,l=ke,c,u=ji,p=1){if(u!==ji&&u!==Ta)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let h={width:t,height:n,depth:p};super(h,s,a,r,o,l,u,i,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new vo(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){let n=super.toJSON(t);return n.compareFunction=this.compareFunction,n}},Lh=class extends ya{constructor(t,n=Ii,i=Ma,s,a,r=ke,o=ke,l,c=ji){let u={width:t,height:t,depth:1},p=[u,u,u,u,u,u];super(t,t,n,i,s,a,r,o,l,c),this.image=p,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(t){this.image=t}},Zl=class extends bn{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}},So=class e extends kn{constructor(t=1,n=1,i=1,s=1,a=1,r=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:n,depth:i,widthSegments:s,heightSegments:a,depthSegments:r};let o=this;s=Math.floor(s),a=Math.floor(a),r=Math.floor(r);let l=[],c=[],u=[],p=[],h=0,d=0;m("z","y","x",-1,-1,i,n,t,r,a,0),m("z","y","x",1,-1,i,n,-t,r,a,1),m("x","z","y",1,1,t,i,n,s,r,2),m("x","z","y",1,-1,t,i,-n,s,r,3),m("x","y","z",1,-1,t,n,i,s,a,4),m("x","y","z",-1,-1,t,n,-i,s,a,5),this.setIndex(l),this.setAttribute("position",new $e(c,3)),this.setAttribute("normal",new $e(u,3)),this.setAttribute("uv",new $e(p,2));function m(b,g,f,y,M,x,E,T,C,_,A){let R=x/C,I=E/_,F=x/2,D=E/2,O=T/2,k=C+1,K=_+1,Y=0,it=0,X=new H;for(let tt=0;tt<K;tt++){let et=tt*I-D;for(let st=0;st<k;st++){let gt=st*R-F;X[b]=gt*y,X[g]=et*M,X[f]=O,c.push(X.x,X.y,X.z),X[b]=0,X[g]=0,X[f]=T>0?1:-1,u.push(X.x,X.y,X.z),p.push(st/C),p.push(1-tt/_),Y+=1}}for(let tt=0;tt<_;tt++)for(let et=0;et<C;et++){let st=h+et+k*tt,gt=h+et+k*(tt+1),Yt=h+(et+1)+k*(tt+1),Rt=h+(et+1)+k*tt;l.push(st,gt,Rt),l.push(gt,Yt,Rt),it+=6}o.addGroup(d,it,A),d+=it,h+=Y}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}};var Kl=class e extends kn{constructor(t=1,n=32,i=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:n,thetaStart:i,thetaLength:s},n=Math.max(3,n);let a=[],r=[],o=[],l=[],c=new H,u=new ee;r.push(0,0,0),o.push(0,0,1),l.push(.5,.5);for(let p=0,h=3;p<=n;p++,h+=3){let d=i+p/n*s;c.x=t*Math.cos(d),c.y=t*Math.sin(d),r.push(c.x,c.y,c.z),o.push(0,0,1),u.x=(r[h]/t+1)/2,u.y=(r[h+1]/t+1)/2,l.push(u.x,u.y)}for(let p=1;p<=n;p++)a.push(p,p+1,0);this.setIndex(a),this.setAttribute("position",new $e(r,3)),this.setAttribute("normal",new $e(o,3)),this.setAttribute("uv",new $e(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new e(t.radius,t.segments,t.thetaStart,t.thetaLength)}};var va=class e extends kn{constructor(t=1,n=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:n,widthSegments:i,heightSegments:s};let a=t/2,r=n/2,o=Math.floor(i),l=Math.floor(s),c=o+1,u=l+1,p=t/o,h=n/l,d=[],m=[],b=[],g=[];for(let f=0;f<u;f++){let y=f*h-r;for(let M=0;M<c;M++){let x=M*p-a;m.push(x,-y,0),b.push(0,0,1),g.push(M/o),g.push(1-f/l)}}for(let f=0;f<l;f++)for(let y=0;y<o;y++){let M=y+c*f,x=y+c*(f+1),E=y+1+c*(f+1),T=y+1+c*f;d.push(M,x,T),d.push(x,E,T)}this.setIndex(d),this.setAttribute("position",new $e(m,3)),this.setAttribute("normal",new $e(b,3)),this.setAttribute("uv",new $e(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.widthSegments,t.heightSegments)}};function sr(e){let t={};for(let n in e){t[n]={};for(let i in e[n]){let s=e[n][i];if(ES(s))s.isRenderTargetTexture?(Nt("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[n][i]=null):t[n][i]=s.clone();else if(Array.isArray(s))if(ES(s[0])){let a=[];for(let r=0,o=s.length;r<o;r++)a[r]=s[r].clone();t[n][i]=a}else t[n][i]=s.slice();else t[n][i]=s}}return t}function Mn(e){let t={};for(let n=0;n<e.length;n++){let i=sr(e[n]);for(let s in i)t[s]=i[s]}return t}function ES(e){return e&&(e.isColor||e.isMatrix3||e.isMatrix4||e.isVector2||e.isVector3||e.isVector4||e.isTexture||e.isQuaternion)}function CT(e){let t=[];for(let n=0;n<e.length;n++)t.push(e[n].clone());return t}function Ug(e){let t=e.getRenderTarget();return t===null?e.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Qt.workingColorSpace}var db={clone:sr,merge:Mn},RT=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,DT=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,ei=class extends tr{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=RT,this.fragmentShader=DT,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=sr(t.uniforms),this.uniformsGroups=CT(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this.defaultAttributeValues=Object.assign({},t.defaultAttributeValues),this.index0AttributeName=t.index0AttributeName,this.uniformsNeedUpdate=t.uniformsNeedUpdate,this}toJSON(t){let n=super.toJSON(t);n.glslVersion=this.glslVersion,n.uniforms={};for(let s in this.uniforms){let r=this.uniforms[s].value;r&&r.isTexture?n.uniforms[s]={type:"t",value:r.toJSON(t).uuid}:r&&r.isColor?n.uniforms[s]={type:"c",value:r.getHex()}:r&&r.isVector2?n.uniforms[s]={type:"v2",value:r.toArray()}:r&&r.isVector3?n.uniforms[s]={type:"v3",value:r.toArray()}:r&&r.isVector4?n.uniforms[s]={type:"v4",value:r.toArray()}:r&&r.isMatrix3?n.uniforms[s]={type:"m3",value:r.toArray()}:r&&r.isMatrix4?n.uniforms[s]={type:"m4",value:r.toArray()}:n.uniforms[s]={value:r}}Object.keys(this.defines).length>0&&(n.defines=this.defines),n.vertexShader=this.vertexShader,n.fragmentShader=this.fragmentShader,n.lights=this.lights,n.clipping=this.clipping;let i={};for(let s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(n.extensions=i),n}fromJSON(t,n){if(super.fromJSON(t,n),t.uniforms!==void 0)for(let i in t.uniforms){let s=t.uniforms[i];switch(this.uniforms[i]={},s.type){case"t":this.uniforms[i].value=n[s.value]||null;break;case"c":this.uniforms[i].value=new ne().setHex(s.value);break;case"v2":this.uniforms[i].value=new ee().fromArray(s.value);break;case"v3":this.uniforms[i].value=new H().fromArray(s.value);break;case"v4":this.uniforms[i].value=new Ue().fromArray(s.value);break;case"m3":this.uniforms[i].value=new Ot().fromArray(s.value);break;case"m4":this.uniforms[i].value=new He().fromArray(s.value);break;default:this.uniforms[i].value=s.value}}if(t.defines!==void 0&&(this.defines=t.defines),t.vertexShader!==void 0&&(this.vertexShader=t.vertexShader),t.fragmentShader!==void 0&&(this.fragmentShader=t.fragmentShader),t.glslVersion!==void 0&&(this.glslVersion=t.glslVersion),t.extensions!==void 0)for(let i in t.extensions)this.extensions[i]=t.extensions[i];return t.lights!==void 0&&(this.lights=t.lights),t.clipping!==void 0&&(this.clipping=t.clipping),this}},Uh=class extends ei{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}};var Oh=class extends tr{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=jS,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}},Ih=class extends tr{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}};function ho(e,t){return!e||e.constructor===t?e:typeof t.BYTES_PER_ELEMENT=="number"?new t(e):Array.prototype.slice.call(e)}function eg(e){return e!==void 0&&e.inTangents!==void 0&&e.outTangents!==void 0}var xa=class{constructor(t,n,i,s){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new n.constructor(i),this.sampleValues=n,this.valueSize=i,this.settings=null,this.DefaultSettings_={}}evaluate(t){let n=this.parameterPositions,i=this._cachedIndex,s=n[i],a=n[i-1];t:{e:{let r;n:{i:if(!(t<s)){for(let o=i+2;;){if(s===void 0){if(t<a)break i;return i=n.length,this._cachedIndex=i,this.copySampleValue_(i-1)}if(i===o)break;if(a=s,s=n[++i],t<s)break e}r=n.length;break n}if(!(t>=a)){let o=n[1];t<o&&(i=2,a=o);for(let l=i-2;;){if(a===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===l)break;if(s=a,a=n[--i-1],t>=a)break e}r=i,i=0;break n}break t}for(;i<r;){let o=i+r>>>1;t<n[o]?r=o:i=o+1}if(s=n[i],a=n[i-1],a===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return i=n.length,this._cachedIndex=i,this.copySampleValue_(i-1)}this._cachedIndex=i,this.intervalChanged_(i,a,s)}return this.interpolate_(i,a,t,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){let n=this.resultBuffer,i=this.sampleValues,s=this.valueSize,a=t*s;for(let r=0;r!==s;++r)n[r]=i[a+r];return n}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}},Ph=class extends xa{constructor(t,n,i,s){super(t,n,i,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:ig,endingEnd:ig}}intervalChanged_(t,n,i){let s=this.parameterPositions,a=t-2,r=t+1,o=s[a],l=s[r];if(o===void 0)switch(this.getSettings_().endingStart){case sg:a=t,o=2*n-i;break;case ag:a=s.length-2,o=n+s[a]-s[a+1];break;default:a=t,o=i}if(l===void 0)switch(this.getSettings_().endingEnd){case sg:r=t,l=2*i-n;break;case ag:r=1,l=i+s[1]-s[0];break;default:r=t-1,l=n}let c=(i-n)*.5,u=this.valueSize;this._weightPrev=c/(n-o),this._weightNext=c/(l-i),this._offsetPrev=a*u,this._offsetNext=r*u}interpolate_(t,n,i,s){let a=this.resultBuffer,r=this.sampleValues,o=this.valueSize,l=t*o,c=l-o,u=this._offsetPrev,p=this._offsetNext,h=this._weightPrev,d=this._weightNext,m=(i-n)/(s-n),b=m*m,g=b*m,f=-h*g+2*h*b-h*m,y=(1+h)*g+(-1.5-2*h)*b+(-.5+h)*m+1,M=(-1-d)*g+(1.5+d)*b+.5*m,x=d*g-d*b;for(let E=0;E!==o;++E)a[E]=f*r[u+E]+y*r[c+E]+M*r[l+E]+x*r[p+E];return a}},Bh=class extends xa{constructor(t,n,i,s){super(t,n,i,s)}interpolate_(t,n,i,s){let a=this.resultBuffer,r=this.sampleValues,o=this.valueSize,l=t*o,c=l-o,u=(i-n)/(s-n),p=1-u;for(let h=0;h!==o;++h)a[h]=r[c+h]*p+r[l+h]*u;return a}},zh=class extends xa{constructor(t,n,i,s){super(t,n,i,s)}interpolate_(t){return this.copySampleValue_(t-1)}},Fh=class extends xa{interpolate_(t,n,i,s){let a=this.resultBuffer,r=this.sampleValues,o=this.valueSize,l=t*o,c=l-o,u=this.inTangents,p=this.outTangents;if(!u||!p){let m=(i-n)/(s-n),b=1-m;for(let g=0;g!==o;++g)a[g]=r[c+g]*b+r[l+g]*m;return a}let h=o*2,d=t-1;for(let m=0;m!==o;++m){let b=r[c+m],g=r[l+m],f=d*h+m*2,y=p[f],M=p[f+1],x=t*h+m*2,E=u[x],T=u[x+1],C=LT(i,n,y,E,s);a[m]=pb(C,b,M,T,g)}return a}};function pb(e,t,n,i,s){let a=1-e;return a*a*a*t+3*a*a*e*n+3*a*e*e*i+e*e*e*s}function NT(e,t,n,i,s){let a=1-e;return 3*a*a*(n-t)+6*a*e*(i-n)+3*e*e*(s-i)}function LT(e,t,n,i,s){let a=(e-t)/(s-t);for(let r=0;r<8;r++){let o=pb(a,t,n,i,s)-e;if(Math.abs(o)<1e-10)break;let l=NT(a,t,n,i,s);if(Math.abs(l)<1e-10)break;a=Math.max(0,Math.min(1,a-o/l))}return a}var ni=class{constructor(t,n,i,s){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(n===void 0||n.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=ho(n,this.TimeBufferType),this.values=ho(i,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(t){let n=t.constructor,i;if(n.toJSON!==this.toJSON)i=n.toJSON(t);else{i={name:t.name,times:ho(t.times,Array),values:ho(t.values,Array)};let s=t.getInterpolation();s!==t.DefaultInterpolation&&(i.interpolation=s),eg(t.settings)&&(i.settings={inTangents:ho(t.settings.inTangents,Array),outTangents:ho(t.settings.outTangents,Array)})}return i.type=t.ValueTypeName,i}InterpolantFactoryMethodDiscrete(t){return new zh(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new Bh(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new Ph(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodBezier(t){let n=new Fh(this.times,this.values,this.getValueSize(),t);return this.settings&&(n.inTangents=this.settings.inTangents,n.outTangents=this.settings.outTangents),n}setInterpolation(t){let n;switch(t){case Pl:n=this.InterpolantFactoryMethodDiscrete;break;case Th:n=this.InterpolantFactoryMethodLinear;break;case ph:n=this.InterpolantFactoryMethodSmooth;break;case ng:n=this.InterpolantFactoryMethodBezier;break}if(n===void 0){let i="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(i);return Nt("KeyframeTrack:",i),this}return this.createInterpolant=n,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Pl;case this.InterpolantFactoryMethodLinear:return Th;case this.InterpolantFactoryMethodSmooth:return ph;case this.InterpolantFactoryMethodBezier:return ng}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){let n=this.times;for(let i=0,s=n.length;i!==s;++i)n[i]+=t}return this}scale(t){if(t!==1){let n=this.times;for(let i=0,s=n.length;i!==s;++i)n[i]*=t;eg(this.settings)&&(TS(this.settings.inTangents,t),TS(this.settings.outTangents,t))}return this}trim(t,n){let i=this.times,s=i.length,a=0,r=s-1;for(;a!==s&&i[a]<t;)++a;for(;r!==-1&&i[r]>n;)--r;if(++r,a!==0||r!==s){a>=r&&(r=Math.max(r,1),a=r-1);let o=this.getValueSize();this.times=i.slice(a,r),this.values=this.values.slice(a*o,r*o)}return this}validate(){let t=!0,n=this.getValueSize();n-Math.floor(n)!==0&&(Ut("KeyframeTrack: Invalid value size in track.",this),t=!1);let i=this.times,s=this.values,a=i.length;a===0&&(Ut("KeyframeTrack: Track is empty.",this),t=!1);let r=null;for(let o=0;o!==a;o++){let l=i[o];if(typeof l=="number"&&isNaN(l)){Ut("KeyframeTrack: Time is not a valid number.",this,o,l),t=!1;break}if(r!==null&&r>l){Ut("KeyframeTrack: Out of order keys.",this,o,l,r),t=!1;break}r=l}if(s!==void 0&&lT(s))for(let o=0,l=s.length;o!==l;++o){let c=s[o];if(isNaN(c)){Ut("KeyframeTrack: Value is not a valid number.",this,o,c),t=!1;break}}return t}optimize(){let t=this.times.slice(),n=this.values.slice(),i=this.getValueSize(),s=this.getInterpolation()===ph,a=t.length-1,r=1;for(let o=1;o<a;++o){let l=!1,c=t[o],u=t[o+1];if(c!==u&&(o!==1||c!==t[0]))if(s)l=!0;else{let p=o*i,h=p-i,d=p+i;for(let m=0;m!==i;++m){let b=n[p+m];if(b!==n[h+m]||b!==n[d+m]){l=!0;break}}}if(l){if(o!==r){t[r]=t[o];let p=o*i,h=r*i;for(let d=0;d!==i;++d)n[h+d]=n[p+d]}++r}}if(a>0){t[r]=t[a];for(let o=a*i,l=r*i,c=0;c!==i;++c)n[l+c]=n[o+c];++r}return r!==t.length?(this.times=t.slice(0,r),this.values=n.slice(0,r*i)):(this.times=t,this.values=n),this}clone(){let t=this.times.slice(),n=this.values.slice(),i=this.constructor,s=new i(this.name,t,n);return s.createInterpolant=this.createInterpolant,eg(this.settings)&&(s.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),s}};function TS(e,t){for(let n=0,i=e.length;n!==i;n+=2)e[n]*=t}ni.prototype.ValueTypeName="";ni.prototype.TimeBufferType=Float32Array;ni.prototype.ValueBufferType=Float32Array;ni.prototype.DefaultInterpolation=Th;var _a=class extends ni{constructor(t,n,i){super(t,n,i)}};_a.prototype.ValueTypeName="bool";_a.prototype.ValueBufferType=Array;_a.prototype.DefaultInterpolation=Pl;_a.prototype.InterpolantFactoryMethodLinear=void 0;_a.prototype.InterpolantFactoryMethodSmooth=void 0;var Vh=class extends ni{constructor(t,n,i,s){super(t,n,i,s)}};Vh.prototype.ValueTypeName="color";var Hh=class extends ni{constructor(t,n,i,s){super(t,n,i,s)}};Hh.prototype.ValueTypeName="number";var kh=class extends xa{constructor(t,n,i,s){super(t,n,i,s)}interpolate_(t,n,i,s){let a=this.resultBuffer,r=this.sampleValues,o=this.valueSize,l=(i-n)/(s-n),c=t*o;for(let u=c+o;c!==u;c+=4)ts.slerpFlat(a,0,r,c-o,r,c,l);return a}},Jl=class extends ni{constructor(t,n,i,s){super(t,n,i,s)}InterpolantFactoryMethodLinear(t){return new kh(this.times,this.values,this.getValueSize(),t)}};Jl.prototype.ValueTypeName="quaternion";Jl.prototype.InterpolantFactoryMethodSmooth=void 0;var Sa=class extends ni{constructor(t,n,i){super(t,n,i)}};Sa.prototype.ValueTypeName="string";Sa.prototype.ValueBufferType=Array;Sa.prototype.DefaultInterpolation=Pl;Sa.prototype.InterpolantFactoryMethodLinear=void 0;Sa.prototype.InterpolantFactoryMethodSmooth=void 0;var Gh=class extends ni{constructor(t,n,i,s){super(t,n,i,s)}};Gh.prototype.ValueTypeName="vector";var Wh=class{constructor(t,n,i){let s=this,a=!1,r=0,o=0,l,c=[];this.onStart=void 0,this.onLoad=t,this.onProgress=n,this.onError=i,this._abortController=null,this.itemStart=function(u){o++,a===!1&&s.onStart!==void 0&&s.onStart(u,r,o),a=!0},this.itemEnd=function(u){r++,s.onProgress!==void 0&&s.onProgress(u,r,o),r===o&&(a=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(u){s.onError!==void 0&&s.onError(u)},this.resolveURL=function(u){return u=u.normalize("NFC"),l?l(u):u},this.setURLModifier=function(u){return l=u,this},this.addHandler=function(u,p){return c.push(u,p),this},this.removeHandler=function(u){let p=c.indexOf(u);return p!==-1&&c.splice(p,2),this},this.getHandler=function(u){for(let p=0,h=c.length;p<h;p+=2){let d=c[p],m=c[p+1];if(d.global&&(d.lastIndex=0),d.test(u))return m}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},mb=new Wh,Xh=class{constructor(t){this.manager=t!==void 0?t:mb,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(t,n){let i=this;return new Promise(function(s,a){i.load(t,s,n,a)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}abort(){return this}};Xh.DEFAULT_MATERIAL_NAME="__DEFAULT";var fh=new H,dh=new ts,Ji=new H,Ql=class extends vi{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new He,this.projectionMatrix=new He,this.projectionMatrixInverse=new He,this.coordinateSystem=Ui,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,n){return super.copy(t,n),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorld.decompose(fh,dh,Ji),Ji.x===1&&Ji.y===1&&Ji.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(fh,dh,Ji.set(1,1,1)).invert()}updateWorldMatrix(t,n,i=!1){super.updateWorldMatrix(t,n,i),this.matrixWorld.decompose(fh,dh,Ji),Ji.x===1&&Ji.y===1&&Ji.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(fh,dh,Ji.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},da=new H,AS=new ee,wS=new ee,Fn=class extends Ql{constructor(t=50,n=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=n,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,n){return super.copy(t,n),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){let n=.5*this.getFilmHeight()/t;this.fov=Ah*2*Math.atan(n),this.updateProjectionMatrix()}getFocalLength(){let t=Math.tan(Om*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Ah*2*Math.atan(Math.tan(Om*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,n,i){da.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(da.x,da.y).multiplyScalar(-t/da.z),da.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(da.x,da.y).multiplyScalar(-t/da.z)}getViewSize(t,n){return this.getViewBounds(t,AS,wS),n.subVectors(wS,AS)}setViewOffset(t,n,i,s,a,r){this.aspect=t/n,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=s,this.view.width=a,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=this.near,n=t*Math.tan(Om*.5*this.fov)/this.zoom,i=2*n,s=this.aspect*i,a=-.5*s,r=this.view;if(this.view!==null&&this.view.enabled){let l=r.fullWidth,c=r.fullHeight;a+=r.offsetX*s/l,n-=r.offsetY*i/c,s*=r.width/l,i*=r.height/c}let o=this.filmOffset;o!==0&&(a+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(a,a+s,n,n-i,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let n=super.toJSON(t);return n.object.fov=this.fov,n.object.zoom=this.zoom,n.object.near=this.near,n.object.far=this.far,n.object.focus=this.focus,n.object.aspect=this.aspect,this.view!==null&&(n.object.view=Object.assign({},this.view)),n.object.filmGauge=this.filmGauge,n.object.filmOffset=this.filmOffset,n}};var er=class extends Ql{constructor(t=-1,n=1,i=1,s=-1,a=.1,r=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=n,this.top=i,this.bottom=s,this.near=a,this.far=r,this.updateProjectionMatrix()}copy(t,n){return super.copy(t,n),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,n,i,s,a,r){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=s,this.view.width=a,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=(this.right-this.left)/(2*this.zoom),n=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2,a=i-t,r=i+t,o=s+n,l=s-n;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;a+=c*this.view.offsetX,r=a+c*this.view.width,o-=u*this.view.offsetY,l=o-u*this.view.height}this.projectionMatrix.makeOrthographic(a,r,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let n=super.toJSON(t);return n.object.zoom=this.zoom,n.object.left=this.left,n.object.right=this.right,n.object.top=this.top,n.object.bottom=this.bottom,n.object.near=this.near,n.object.far=this.far,this.view!==null&&(n.object.view=Object.assign({},this.view)),n}};var fo=-90,po=1,qh=class extends vi{constructor(t,n,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new Fn(fo,po,t,n);s.layers=this.layers,this.add(s);let a=new Fn(fo,po,t,n);a.layers=this.layers,this.add(a);let r=new Fn(fo,po,t,n);r.layers=this.layers,this.add(r);let o=new Fn(fo,po,t,n);o.layers=this.layers,this.add(o);let l=new Fn(fo,po,t,n);l.layers=this.layers,this.add(l);let c=new Fn(fo,po,t,n);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let t=this.coordinateSystem,n=this.children.concat(),[i,s,a,r,o,l]=n;for(let c of n)this.remove(c);if(t===Ui)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),a.up.set(0,0,-1),a.lookAt(0,1,0),r.up.set(0,0,1),r.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===Fl)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),a.up.set(0,0,1),a.lookAt(0,1,0),r.up.set(0,0,-1),r.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(let c of n)this.add(c),c.updateMatrixWorld()}update(t,n){this.parent===null&&this.updateMatrixWorld();let{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());let[a,r,o,l,c,u]=this.children,p=t.getRenderTarget(),h=t.getActiveCubeFace(),d=t.getActiveMipmapLevel(),m=t.xr.enabled;t.xr.enabled=!1;let b=i.texture.generateMipmaps;i.texture.generateMipmaps=!1;let g=!1;t.isWebGLRenderer===!0?g=t.state.buffers.depth.getReversed():g=t.reversedDepthBuffer,t.setRenderTarget(i,0,s),g&&t.autoClear===!1&&t.clearDepth(),t.render(n,a),t.setRenderTarget(i,1,s),g&&t.autoClear===!1&&t.clearDepth(),t.render(n,r),t.setRenderTarget(i,2,s),g&&t.autoClear===!1&&t.clearDepth(),t.render(n,o),t.setRenderTarget(i,3,s),g&&t.autoClear===!1&&t.clearDepth(),t.render(n,l),t.setRenderTarget(i,4,s),g&&t.autoClear===!1&&t.clearDepth(),t.render(n,c),i.texture.generateMipmaps=b,t.setRenderTarget(i,5,s),g&&t.autoClear===!1&&t.clearDepth(),t.render(n,u),t.setRenderTarget(p,h,d),t.xr.enabled=m,i.texture.needsPMREMUpdate=!0}},Yh=class extends Fn{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}};var Og="\\[\\]\\.:\\/",UT=new RegExp("["+Og+"]","g"),Ig="[^"+Og+"]",OT="[^"+Og.replace("\\.","")+"]",IT=/((?:WC+[\/:])*)/.source.replace("WC",Ig),PT=/(WCOD+)?/.source.replace("WCOD",OT),BT=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Ig),zT=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Ig),FT=new RegExp("^"+IT+PT+BT+zT+"$"),VT=["material","materials","bones","map"],rg=class{constructor(t,n,i){let s=i||we.parseTrackName(n);this._targetGroup=t,this._bindings=t.subscribe_(n,s)}getValue(t,n){this.bind();let i=this._targetGroup.nCachedObjects_,s=this._bindings[i];s!==void 0&&s.getValue(t,n)}setValue(t,n){let i=this._bindings;for(let s=this._targetGroup.nCachedObjects_,a=i.length;s!==a;++s)i[s].setValue(t,n)}bind(){let t=this._bindings;for(let n=this._targetGroup.nCachedObjects_,i=t.length;n!==i;++n)t[n].bind()}unbind(){let t=this._bindings;for(let n=this._targetGroup.nCachedObjects_,i=t.length;n!==i;++n)t[n].unbind()}},we=class e{constructor(t,n,i){this.path=n,this.parsedPath=i||e.parseTrackName(n),this.node=e.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,n,i){return t&&t.isAnimationObjectGroup?new e.Composite(t,n,i):new e(t,n,i)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(UT,"")}static parseTrackName(t){let n=FT.exec(t);if(n===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+t);let i={nodeName:n[2],objectName:n[3],objectIndex:n[4],propertyName:n[5],propertyIndex:n[6]},s=i.nodeName&&i.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let a=i.nodeName.substring(s+1);VT.indexOf(a)!==-1&&(i.nodeName=i.nodeName.substring(0,s),i.objectName=a)}if(i.propertyName===null||i.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+t);return i}static findNode(t,n){if(n===void 0||n===""||n==="."||n===-1||n===t.name||n===t.uuid)return t;if(t.skeleton){let i=t.skeleton.getBoneByName(n);if(i!==void 0)return i}if(t.children){let i=function(a){for(let r=0;r<a.length;r++){let o=a[r];if(o.name===n||o.uuid===n)return o;let l=i(o.children);if(l)return l}return null},s=i(t.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,n){t[n]=this.targetObject[this.propertyName]}_getValue_array(t,n){let i=this.resolvedProperty;for(let s=0,a=i.length;s!==a;++s)t[n++]=i[s]}_getValue_arrayElement(t,n){t[n]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,n){this.resolvedProperty.toArray(t,n)}_setValue_direct(t,n){this.targetObject[this.propertyName]=t[n]}_setValue_direct_setNeedsUpdate(t,n){this.targetObject[this.propertyName]=t[n],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,n){this.targetObject[this.propertyName]=t[n],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,n){let i=this.resolvedProperty;for(let s=0,a=i.length;s!==a;++s)i[s]=t[n++]}_setValue_array_setNeedsUpdate(t,n){let i=this.resolvedProperty;for(let s=0,a=i.length;s!==a;++s)i[s]=t[n++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,n){let i=this.resolvedProperty;for(let s=0,a=i.length;s!==a;++s)i[s]=t[n++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,n){this.resolvedProperty[this.propertyIndex]=t[n]}_setValue_arrayElement_setNeedsUpdate(t,n){this.resolvedProperty[this.propertyIndex]=t[n],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,n){this.resolvedProperty[this.propertyIndex]=t[n],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,n){this.resolvedProperty.fromArray(t,n)}_setValue_fromArray_setNeedsUpdate(t,n){this.resolvedProperty.fromArray(t,n),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,n){this.resolvedProperty.fromArray(t,n),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,n){this.bind(),this.getValue(t,n)}_setValue_unbound(t,n){this.bind(),this.setValue(t,n)}bind(){let t=this.node,n=this.parsedPath,i=n.objectName,s=n.propertyName,a=n.propertyIndex;if(t||(t=e.findNode(this.rootNode,n.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){Nt("PropertyBinding: No target node found for track: "+this.path+".");return}if(i){let c=n.objectIndex;switch(i){case"materials":if(!t.material){Ut("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){Ut("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){Ut("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let u=0;u<t.length;u++)if(t[u].name===c){c=u;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){Ut("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){Ut("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[i]===void 0){Ut("PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[i]}if(c!==void 0){if(t[c]===void 0){Ut("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[c]}}let r=t[s];if(r===void 0){let c=n.nodeName;Ut("PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",t);return}let o=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?o=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(a!==void 0){if(s==="morphTargetInfluences"){if(!t.geometry){Ut("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){Ut("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[a]!==void 0&&(a=t.morphTargetDictionary[a])}l=this.BindingType.ArrayElement,this.resolvedProperty=r,this.propertyIndex=a}else r.fromArray!==void 0&&r.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=r):Array.isArray(r)?(l=this.BindingType.EntireArray,this.resolvedProperty=r):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};we.Composite=rg;we.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};we.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};we.prototype.GetterByBindingType=[we.prototype._getValue_direct,we.prototype._getValue_array,we.prototype._getValue_arrayElement,we.prototype._getValue_toArray];we.prototype.SetterByBindingTypeAndVersioning=[[we.prototype._setValue_direct,we.prototype._setValue_direct_setNeedsUpdate,we.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[we.prototype._setValue_array,we.prototype._setValue_array_setNeedsUpdate,we.prototype._setValue_array_setMatrixWorldNeedsUpdate],[we.prototype._setValue_arrayElement,we.prototype._setValue_arrayElement_setNeedsUpdate,we.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[we.prototype._setValue_fromArray,we.prototype._setValue_fromArray_setNeedsUpdate,we.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var a3=new Float32Array(1);var og=class e{static{e.prototype.isMatrix2=!0}constructor(t,n,i,s){this.elements=[1,0,0,1],t!==void 0&&this.set(t,n,i,s)}identity(){return this.set(1,0,0,1),this}fromArray(t,n=0){for(let i=0;i<4;i++)this.elements[i]=t[i+n];return this}set(t,n,i,s){let a=this.elements;return a[0]=t,a[2]=n,a[1]=i,a[3]=s,this}};function Pg(e,t,n,i){let s=HT(i);switch(n){case wg:return e*t;case Rg:return e*t/s.components*s.byteLength;case tf:return e*t/s.components*s.byteLength;case Aa:return e*t*2/s.components*s.byteLength;case ef:return e*t*2/s.components*s.byteLength;case Cg:return e*t*3/s.components*s.byteLength;case Si:return e*t*4/s.components*s.byteLength;case nf:return e*t*4/s.components*s.byteLength;case ec:case nc:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case ic:case sc:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case af:case of:return Math.max(e,16)*Math.max(t,8)/4;case sf:case rf:return Math.max(e,8)*Math.max(t,8)/2;case lf:case cf:case hf:case ff:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case uf:case ac:case df:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case pf:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case mf:return Math.floor((e+4)/5)*Math.floor((t+3)/4)*16;case gf:return Math.floor((e+4)/5)*Math.floor((t+4)/5)*16;case yf:return Math.floor((e+5)/6)*Math.floor((t+4)/5)*16;case vf:return Math.floor((e+5)/6)*Math.floor((t+5)/6)*16;case xf:return Math.floor((e+7)/8)*Math.floor((t+4)/5)*16;case _f:return Math.floor((e+7)/8)*Math.floor((t+5)/6)*16;case Sf:return Math.floor((e+7)/8)*Math.floor((t+7)/8)*16;case bf:return Math.floor((e+9)/10)*Math.floor((t+4)/5)*16;case Mf:return Math.floor((e+9)/10)*Math.floor((t+5)/6)*16;case Ef:return Math.floor((e+9)/10)*Math.floor((t+7)/8)*16;case Tf:return Math.floor((e+9)/10)*Math.floor((t+9)/10)*16;case Af:return Math.floor((e+11)/12)*Math.floor((t+9)/10)*16;case wf:return Math.floor((e+11)/12)*Math.floor((t+11)/12)*16;case Cf:case Rf:case Df:return Math.ceil(e/4)*Math.ceil(t/4)*16;case Nf:case Lf:return Math.ceil(e/4)*Math.ceil(t/4)*8;case rc:case Uf:return Math.ceil(e/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${n} format.`)}function HT(e){switch(e){case ii:case Mg:return{byteLength:1,components:1};case Eo:case Eg:case Bi:return{byteLength:2,components:1};case jh:case $h:return{byteLength:2,components:4};case Ii:case Qh:case Pi:return{byteLength:4,components:1};case Tg:case Ag:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${e}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"186"}}));typeof window<"u"&&(window.__THREE__?Nt("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="186");function Bb(){let e=null,t=!1,n=null,i=null;function s(a,r){i=e.requestAnimationFrame(s),n(a,r)}return{start:function(){t!==!0&&n!==null&&e!==null&&(i=e.requestAnimationFrame(s),t=!0)},stop:function(){e!==null&&e.cancelAnimationFrame(i),t=!1},setAnimationLoop:function(a){n=a},setContext:function(a){e=a}}}function GT(e){let t=new WeakMap;function n(o,l){let c=o.array,u=o.usage,p=c.byteLength,h=e.createBuffer();e.bindBuffer(l,h),e.bufferData(l,c,u),o.onUploadCallback();let d;if(c instanceof Float32Array)d=e.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)d=e.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?d=e.HALF_FLOAT:d=e.UNSIGNED_SHORT;else if(c instanceof Int16Array)d=e.SHORT;else if(c instanceof Uint32Array)d=e.UNSIGNED_INT;else if(c instanceof Int32Array)d=e.INT;else if(c instanceof Int8Array)d=e.BYTE;else if(c instanceof Uint8Array)d=e.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)d=e.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:h,type:d,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:p}}function i(o,l,c){let u=l.array,p=l.updateRanges;if(e.bindBuffer(c,o),p.length===0)e.bufferSubData(c,0,u);else{p.sort((d,m)=>d.start-m.start);let h=0;for(let d=1;d<p.length;d++){let m=p[h],b=p[d];b.start<=m.start+m.count+1?m.count=Math.max(m.count,b.start+b.count-m.start):(++h,p[h]=b)}p.length=h+1;for(let d=0,m=p.length;d<m;d++){let b=p[d];e.bufferSubData(c,b.start*u.BYTES_PER_ELEMENT,u,b.start,b.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function a(o){o.isInterleavedBufferAttribute&&(o=o.data);let l=t.get(o);l&&(e.deleteBuffer(l.buffer),t.delete(o))}function r(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){let u=t.get(o);(!u||u.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}let c=t.get(o);if(c===void 0)t.set(o,n(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,o,l),c.version=o.version}}return{get:s,remove:a,update:r}}var WT=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,XT=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,qT=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,YT=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,ZT=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,KT=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,JT=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,QT=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,jT=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,$T=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,tA=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,eA=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,nA=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,iA=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,sA=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,aA=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,rA=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,oA=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,lA=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,cA=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,uA=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,hA=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,fA=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,dA=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,pA=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,mA=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,gA=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,yA=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,vA=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,xA=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,_A="gl_FragColor = linearToOutputTexel( gl_FragColor );",SA=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,bA=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,MA=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,EA=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,TA=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,AA=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,wA=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,CA=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,RA=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,DA=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,NA=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,LA=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,UA=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,OA=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,IA=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,PA=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureCubeUV( envMap, envMapRotation * retroVec, roughness );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_CUBE_UV
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,BA=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,zA=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,FA=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,VA=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,HA=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,kA=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,GA=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,WA=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,XA=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,qA=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,YA=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,ZA=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,KA=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,JA=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,QA=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,jA=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,$A=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,tw=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,ew=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,nw=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,iw=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,sw=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,aw=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,rw=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,ow=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,lw=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,cw=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,uw=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,hw=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,fw=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,dw=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,pw=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,mw=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,gw=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,yw=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,vw=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,xw=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,_w=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Sw=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,bw=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Mw=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Ew=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Tw=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Aw=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,ww=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Cw=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Rw=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Dw=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Nw=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Lw=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Uw=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Ow=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Iw=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Pw=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Bw=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,zw=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Fw=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Vw=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Hw=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,kw=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Gw=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,Ww=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Xw=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,qw=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Yw=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Zw=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Kw=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Jw=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Qw=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,jw=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,$w=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,tC=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,eC=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,nC=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,iC=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,sC=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,aC=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,rC=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,oC=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,lC=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,cC=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,uC=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,hC=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,fC=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,dC=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,pC=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,mC=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,gC=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,yC=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,vC=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,xC=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,_C=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,SC=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,bC=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,MC=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Vt={alphahash_fragment:WT,alphahash_pars_fragment:XT,alphamap_fragment:qT,alphamap_pars_fragment:YT,alphatest_fragment:ZT,alphatest_pars_fragment:KT,aomap_fragment:JT,aomap_pars_fragment:QT,batching_pars_vertex:jT,batching_vertex:$T,begin_vertex:tA,beginnormal_vertex:eA,bsdfs:nA,iridescence_fragment:iA,bumpmap_pars_fragment:sA,clipping_planes_fragment:aA,clipping_planes_pars_fragment:rA,clipping_planes_pars_vertex:oA,clipping_planes_vertex:lA,color_fragment:cA,color_pars_fragment:uA,color_pars_vertex:hA,color_vertex:fA,common:dA,cube_uv_reflection_fragment:pA,defaultnormal_vertex:mA,displacementmap_pars_vertex:gA,displacementmap_vertex:yA,emissivemap_fragment:vA,emissivemap_pars_fragment:xA,colorspace_fragment:_A,colorspace_pars_fragment:SA,envmap_fragment:bA,envmap_common_pars_fragment:MA,envmap_pars_fragment:EA,envmap_pars_vertex:TA,envmap_physical_pars_fragment:PA,envmap_vertex:AA,fog_vertex:wA,fog_pars_vertex:CA,fog_fragment:RA,fog_pars_fragment:DA,gradientmap_pars_fragment:NA,lightmap_pars_fragment:LA,lights_lambert_fragment:UA,lights_lambert_pars_fragment:OA,lights_pars_begin:IA,lights_toon_fragment:BA,lights_toon_pars_fragment:zA,lights_phong_fragment:FA,lights_phong_pars_fragment:VA,lights_physical_fragment:HA,lights_physical_pars_fragment:kA,lights_fragment_begin:GA,lights_fragment_maps:WA,lights_fragment_end:XA,lightprobes_pars_fragment:qA,logdepthbuf_fragment:YA,logdepthbuf_pars_fragment:ZA,logdepthbuf_pars_vertex:KA,logdepthbuf_vertex:JA,map_fragment:QA,map_pars_fragment:jA,map_particle_fragment:$A,map_particle_pars_fragment:tw,metalnessmap_fragment:ew,metalnessmap_pars_fragment:nw,morphinstance_vertex:iw,morphcolor_vertex:sw,morphnormal_vertex:aw,morphtarget_pars_vertex:rw,morphtarget_vertex:ow,normal_fragment_begin:lw,normal_fragment_maps:cw,normal_pars_fragment:uw,normal_pars_vertex:hw,normal_vertex:fw,normalmap_pars_fragment:dw,clearcoat_normal_fragment_begin:pw,clearcoat_normal_fragment_maps:mw,clearcoat_pars_fragment:gw,iridescence_pars_fragment:yw,opaque_fragment:vw,packing:xw,premultiplied_alpha_fragment:_w,project_vertex:Sw,dithering_fragment:bw,dithering_pars_fragment:Mw,roughnessmap_fragment:Ew,roughnessmap_pars_fragment:Tw,shadowmap_pars_fragment:Aw,shadowmap_pars_vertex:ww,shadowmap_vertex:Cw,shadowmask_pars_fragment:Rw,skinbase_vertex:Dw,skinning_pars_vertex:Nw,skinning_vertex:Lw,skinnormal_vertex:Uw,specularmap_fragment:Ow,specularmap_pars_fragment:Iw,tonemapping_fragment:Pw,tonemapping_pars_fragment:Bw,transmission_fragment:zw,transmission_pars_fragment:Fw,uv_pars_fragment:Vw,uv_pars_vertex:Hw,uv_vertex:kw,worldpos_vertex:Gw,background_vert:Ww,background_frag:Xw,backgroundCube_vert:qw,backgroundCube_frag:Yw,cube_vert:Zw,cube_frag:Kw,depth_vert:Jw,depth_frag:Qw,distance_vert:jw,distance_frag:$w,equirect_vert:tC,equirect_frag:eC,linedashed_vert:nC,linedashed_frag:iC,meshbasic_vert:sC,meshbasic_frag:aC,meshlambert_vert:rC,meshlambert_frag:oC,meshmatcap_vert:lC,meshmatcap_frag:cC,meshnormal_vert:uC,meshnormal_frag:hC,meshphong_vert:fC,meshphong_frag:dC,meshphysical_vert:pC,meshphysical_frag:mC,meshtoon_vert:gC,meshtoon_frag:yC,points_vert:vC,points_frag:xC,shadow_vert:_C,shadow_frag:SC,sprite_vert:bC,sprite_frag:MC},dt={common:{diffuse:{value:new ne(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ot},alphaMap:{value:null},alphaMapTransform:{value:new Ot},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ot}},envmap:{envMap:{value:null},envMapRotation:{value:new Ot},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ot}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ot}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ot},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ot},normalScale:{value:new ee(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ot},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ot}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ot}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ot}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new ne(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new H},probesMax:{value:new H},probesResolution:{value:new H}},points:{diffuse:{value:new ne(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ot},alphaTest:{value:0},uvTransform:{value:new Ot}},sprite:{diffuse:{value:new ne(16777215)},opacity:{value:1},center:{value:new ee(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ot},alphaMap:{value:null},alphaMapTransform:{value:new Ot},alphaTest:{value:0}}},is={basic:{uniforms:Mn([dt.common,dt.specularmap,dt.envmap,dt.aomap,dt.lightmap,dt.fog]),vertexShader:Vt.meshbasic_vert,fragmentShader:Vt.meshbasic_frag},lambert:{uniforms:Mn([dt.common,dt.specularmap,dt.envmap,dt.aomap,dt.lightmap,dt.emissivemap,dt.bumpmap,dt.normalmap,dt.displacementmap,dt.fog,dt.lights,{emissive:{value:new ne(0)},envMapIntensity:{value:1}}]),vertexShader:Vt.meshlambert_vert,fragmentShader:Vt.meshlambert_frag},phong:{uniforms:Mn([dt.common,dt.specularmap,dt.envmap,dt.aomap,dt.lightmap,dt.emissivemap,dt.bumpmap,dt.normalmap,dt.displacementmap,dt.fog,dt.lights,{emissive:{value:new ne(0)},specular:{value:new ne(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Vt.meshphong_vert,fragmentShader:Vt.meshphong_frag},standard:{uniforms:Mn([dt.common,dt.envmap,dt.aomap,dt.lightmap,dt.emissivemap,dt.bumpmap,dt.normalmap,dt.displacementmap,dt.roughnessmap,dt.metalnessmap,dt.fog,dt.lights,{emissive:{value:new ne(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Vt.meshphysical_vert,fragmentShader:Vt.meshphysical_frag},toon:{uniforms:Mn([dt.common,dt.aomap,dt.lightmap,dt.emissivemap,dt.bumpmap,dt.normalmap,dt.displacementmap,dt.gradientmap,dt.fog,dt.lights,{emissive:{value:new ne(0)}}]),vertexShader:Vt.meshtoon_vert,fragmentShader:Vt.meshtoon_frag},matcap:{uniforms:Mn([dt.common,dt.bumpmap,dt.normalmap,dt.displacementmap,dt.fog,{matcap:{value:null}}]),vertexShader:Vt.meshmatcap_vert,fragmentShader:Vt.meshmatcap_frag},points:{uniforms:Mn([dt.points,dt.fog]),vertexShader:Vt.points_vert,fragmentShader:Vt.points_frag},dashed:{uniforms:Mn([dt.common,dt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Vt.linedashed_vert,fragmentShader:Vt.linedashed_frag},depth:{uniforms:Mn([dt.common,dt.displacementmap]),vertexShader:Vt.depth_vert,fragmentShader:Vt.depth_frag},normal:{uniforms:Mn([dt.common,dt.bumpmap,dt.normalmap,dt.displacementmap,{opacity:{value:1}}]),vertexShader:Vt.meshnormal_vert,fragmentShader:Vt.meshnormal_frag},sprite:{uniforms:Mn([dt.sprite,dt.fog]),vertexShader:Vt.sprite_vert,fragmentShader:Vt.sprite_frag},background:{uniforms:{uvTransform:{value:new Ot},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Vt.background_vert,fragmentShader:Vt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ot}},vertexShader:Vt.backgroundCube_vert,fragmentShader:Vt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Vt.cube_vert,fragmentShader:Vt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Vt.equirect_vert,fragmentShader:Vt.equirect_frag},distance:{uniforms:Mn([dt.common,dt.displacementmap,{referencePosition:{value:new H},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Vt.distance_vert,fragmentShader:Vt.distance_frag},shadow:{uniforms:Mn([dt.lights,dt.fog,{color:{value:new ne(0)},opacity:{value:1}}]),vertexShader:Vt.shadow_vert,fragmentShader:Vt.shadow_frag}};is.physical={uniforms:Mn([is.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ot},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ot},clearcoatNormalScale:{value:new ee(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ot},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ot},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ot},sheen:{value:0},sheenColor:{value:new ne(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ot},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ot},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ot},transmissionSamplerSize:{value:new ee},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ot},attenuationDistance:{value:0},attenuationColor:{value:new ne(0)},specularColor:{value:new ne(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ot},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ot},anisotropyVector:{value:new ee},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ot}}]),vertexShader:Vt.meshphysical_vert,fragmentShader:Vt.meshphysical_frag};var Pf={r:0,b:0,g:0},EC=new He,zb=new Ot;zb.set(-1,0,0,0,1,0,0,0,1);function TC(e,t,n,i,s,a){let r=new ne(0),o=s===!0?0:1,l,c,u=null,p=0,h=null;function d(y){let M=y.isScene===!0?y.background:null;if(M&&M.isTexture){let x=y.backgroundBlurriness>0;M=t.get(M,x)}return M}function m(y){let M=!1,x=d(y);x===null?g(r,o):x&&x.isColor&&(g(x,1),M=!0);let E=e.xr.getEnvironmentBlendMode();E==="additive"?n.buffers.color.setClear(0,0,0,1,a):E==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(e.autoClear||M)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil))}function b(y,M){let x=d(M);x&&(x.isCubeTexture||x.mapping===$l)?(c===void 0&&(c=new tn(new So(1,1,1),new ei({name:"BackgroundCubeMaterial",uniforms:sr(is.backgroundCube.uniforms),vertexShader:is.backgroundCube.vertexShader,fragmentShader:is.backgroundCube.fragmentShader,side:Cn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(E,T,C){this.matrixWorld.copyPosition(C.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(c)),c.material.uniforms.envMap.value=x,c.material.uniforms.backgroundBlurriness.value=M.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(EC.makeRotationFromEuler(M.backgroundRotation)).transpose(),x.isCubeTexture&&x.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(zb),c.material.toneMapped=Qt.getTransfer(x.colorSpace)!==le,(u!==x||p!==x.version||h!==e.toneMapping)&&(c.material.needsUpdate=!0,u=x,p=x.version,h=e.toneMapping),c.layers.enableAll(),y.unshift(c,c.geometry,c.material,0,0,null)):x&&x.isTexture&&(l===void 0&&(l=new tn(new va(2,2),new ei({name:"BackgroundMaterial",uniforms:sr(is.background.uniforms),vertexShader:is.background.vertexShader,fragmentShader:is.background.fragmentShader,side:ba,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(l)),l.material.uniforms.t2D.value=x,l.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,l.material.toneMapped=Qt.getTransfer(x.colorSpace)!==le,x.matrixAutoUpdate===!0&&x.updateMatrix(),l.material.uniforms.uvTransform.value.copy(x.matrix),(u!==x||p!==x.version||h!==e.toneMapping)&&(l.material.needsUpdate=!0,u=x,p=x.version,h=e.toneMapping),l.layers.enableAll(),y.unshift(l,l.geometry,l.material,0,0,null))}function g(y,M){y.getRGB(Pf,Ug(e)),n.buffers.color.setClear(Pf.r,Pf.g,Pf.b,M,a)}function f(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return r},setClearColor:function(y,M=1){r.set(y),o=M,g(r,o)},getClearAlpha:function(){return o},setClearAlpha:function(y){o=y,g(r,o)},render:m,addToRenderList:b,dispose:f}}function AC(e,t){let n=e.getParameter(e.MAX_VERTEX_ATTRIBS),i={},s=h(null),a=s,r=!1;function o(I,F,D,O,k){let K=!1,Y=p(I,O,D,F);a!==Y&&(a=Y,c(a.object)),K=d(I,O,D,k),K&&m(I,O,D,k),k!==null&&t.update(k,e.ELEMENT_ARRAY_BUFFER),(K||r)&&(r=!1,x(I,F,D,O),k!==null&&e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,t.get(k).buffer))}function l(){return e.createVertexArray()}function c(I){return e.bindVertexArray(I)}function u(I){return e.deleteVertexArray(I)}function p(I,F,D,O){let k=O.wireframe===!0,K=i[F.id];K===void 0&&(K={},i[F.id]=K);let Y=I.isInstancedMesh===!0?I.id:0,it=K[Y];it===void 0&&(it={},K[Y]=it);let X=it[D.id];X===void 0&&(X={},it[D.id]=X);let tt=X[k];return tt===void 0&&(tt=h(l()),X[k]=tt),tt}function h(I){let F=[],D=[],O=[];for(let k=0;k<n;k++)F[k]=0,D[k]=0,O[k]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:F,enabledAttributes:D,attributeDivisors:O,object:I,attributes:{},index:null}}function d(I,F,D,O){let k=a.attributes,K=F.attributes,Y=0,it=D.getAttributes();for(let X in it)if(it[X].location>=0){let et=k[X],st=K[X];if(st===void 0&&(X==="instanceMatrix"&&I.instanceMatrix&&(st=I.instanceMatrix),X==="instanceColor"&&I.instanceColor&&(st=I.instanceColor)),et===void 0||et.attribute!==st||st&&et.data!==st.data)return!0;Y++}return a.attributesNum!==Y||a.index!==O}function m(I,F,D,O){let k={},K=F.attributes,Y=0,it=D.getAttributes();for(let X in it)if(it[X].location>=0){let et=K[X];et===void 0&&(X==="instanceMatrix"&&I.instanceMatrix&&(et=I.instanceMatrix),X==="instanceColor"&&I.instanceColor&&(et=I.instanceColor));let st={};st.attribute=et,et&&et.data&&(st.data=et.data),k[X]=st,Y++}a.attributes=k,a.attributesNum=Y,a.index=O}function b(){let I=a.newAttributes;for(let F=0,D=I.length;F<D;F++)I[F]=0}function g(I){f(I,0)}function f(I,F){let D=a.newAttributes,O=a.enabledAttributes,k=a.attributeDivisors;D[I]=1,O[I]===0&&(e.enableVertexAttribArray(I),O[I]=1),k[I]!==F&&(e.vertexAttribDivisor(I,F),k[I]=F)}function y(){let I=a.newAttributes,F=a.enabledAttributes;for(let D=0,O=F.length;D<O;D++)F[D]!==I[D]&&(e.disableVertexAttribArray(D),F[D]=0)}function M(I,F,D,O,k,K,Y){Y===!0?e.vertexAttribIPointer(I,F,D,k,K):e.vertexAttribPointer(I,F,D,O,k,K)}function x(I,F,D,O){b();let k=O.attributes,K=D.getAttributes(),Y=F.defaultAttributeValues;for(let it in K){let X=K[it];if(X.location>=0){let tt=k[it];if(tt===void 0&&(it==="instanceMatrix"&&I.instanceMatrix&&(tt=I.instanceMatrix),it==="instanceColor"&&I.instanceColor&&(tt=I.instanceColor)),tt!==void 0){let et=tt.normalized,st=tt.itemSize,gt=t.get(tt);if(gt===void 0)continue;let Yt=gt.buffer,Rt=gt.type,Zt=gt.bytesPerElement,W=Rt===e.INT||Rt===e.UNSIGNED_INT||tt.gpuType===Qh;if(tt.isInterleavedBufferAttribute){let Q=tt.data,St=Q.stride,It=tt.offset;if(Q.isInstancedInterleavedBuffer){for(let xt=0;xt<X.locationSize;xt++)f(X.location+xt,Q.meshPerAttribute);I.isInstancedMesh!==!0&&O._maxInstanceCount===void 0&&(O._maxInstanceCount=Q.meshPerAttribute*Q.count)}else for(let xt=0;xt<X.locationSize;xt++)g(X.location+xt);e.bindBuffer(e.ARRAY_BUFFER,Yt);for(let xt=0;xt<X.locationSize;xt++)M(X.location+xt,st/X.locationSize,Rt,et,St*Zt,(It+st/X.locationSize*xt)*Zt,W)}else{if(tt.isInstancedBufferAttribute){for(let Q=0;Q<X.locationSize;Q++)f(X.location+Q,tt.meshPerAttribute);I.isInstancedMesh!==!0&&O._maxInstanceCount===void 0&&(O._maxInstanceCount=tt.meshPerAttribute*tt.count)}else for(let Q=0;Q<X.locationSize;Q++)g(X.location+Q);e.bindBuffer(e.ARRAY_BUFFER,Yt);for(let Q=0;Q<X.locationSize;Q++)M(X.location+Q,st/X.locationSize,Rt,et,st*Zt,st/X.locationSize*Q*Zt,W)}}else if(Y!==void 0){let et=Y[it];if(et!==void 0)switch(et.length){case 2:e.vertexAttrib2fv(X.location,et);break;case 3:e.vertexAttrib3fv(X.location,et);break;case 4:e.vertexAttrib4fv(X.location,et);break;default:e.vertexAttrib1fv(X.location,et)}}}}y()}function E(){A();for(let I in i){let F=i[I];for(let D in F){let O=F[D];for(let k in O){let K=O[k];for(let Y in K)u(K[Y].object),delete K[Y];delete O[k]}}delete i[I]}}function T(I){if(i[I.id]===void 0)return;let F=i[I.id];for(let D in F){let O=F[D];for(let k in O){let K=O[k];for(let Y in K)u(K[Y].object),delete K[Y];delete O[k]}}delete i[I.id]}function C(I){for(let F in i){let D=i[F];for(let O in D){let k=D[O];if(k[I.id]===void 0)continue;let K=k[I.id];for(let Y in K)u(K[Y].object),delete K[Y];delete k[I.id]}}}function _(I){for(let F in i){let D=i[F],O=I.isInstancedMesh===!0?I.id:0,k=D[O];if(k!==void 0){for(let K in k){let Y=k[K];for(let it in Y)u(Y[it].object),delete Y[it];delete k[K]}delete D[O],Object.keys(D).length===0&&delete i[F]}}}function A(){R(),r=!0,a!==s&&(a=s,c(a.object))}function R(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:A,resetDefaultState:R,dispose:E,releaseStatesOfGeometry:T,releaseStatesOfObject:_,releaseStatesOfProgram:C,initAttributes:b,enableAttribute:g,disableUnusedAttributes:y}}function wC(e,t,n){let i;function s(l){i=l}function a(l,c){e.drawArrays(i,l,c),n.update(c,i,1)}function r(l,c,u){u!==0&&(e.drawArraysInstanced(i,l,c,u),n.update(c,i,u))}function o(l,c,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,c,0,u);let h=0;for(let d=0;d<u;d++)h+=c[d];n.update(h,i,1)}this.setMode=s,this.render=a,this.renderInstances=r,this.renderMultiDraw=o}function CC(e,t,n,i){let s;function a(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){let C=t.get("EXT_texture_filter_anisotropic");s=e.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function r(C){return!(C!==Si&&i.convert(C)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(C){let _=C===Bi&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(C!==ii&&C!==Pi&&!_&&i.convert(C)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_TYPE))}function l(C){if(C==="highp"){if(e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.HIGH_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.MEDIUM_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=n.precision!==void 0?n.precision:"highp",u=l(c);u!==c&&(Nt("WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);let p=n.logarithmicDepthBuffer===!0,h=n.reversedDepthBuffer===!0&&t.has("EXT_clip_control");n.reversedDepthBuffer===!0&&h===!1&&Nt("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");let d=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),m=e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS),b=e.getParameter(e.MAX_TEXTURE_SIZE),g=e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE),f=e.getParameter(e.MAX_VERTEX_ATTRIBS),y=e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS),M=e.getParameter(e.MAX_VARYING_VECTORS),x=e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS),E=e.getParameter(e.MAX_SAMPLES),T=e.getParameter(e.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:l,textureFormatReadable:r,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:p,reversedDepthBuffer:h,maxTextures:d,maxVertexTextures:m,maxTextureSize:b,maxCubemapSize:g,maxAttributes:f,maxVertexUniforms:y,maxVaryings:M,maxFragmentUniforms:x,maxSamples:E,samples:T}}function RC(e){let t=this,n=null,i=0,s=!1,a=!1,r=new Li,o=new Ot,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(p,h){let d=p.length!==0||h||i!==0||s;return s=h,i=p.length,d},this.beginShadows=function(){a=!0,u(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(p,h){n=u(p,h,0)},this.setState=function(p,h,d){let m=p.clippingPlanes,b=p.clipIntersection,g=p.clipShadows,f=e.get(p);if(!s||m===null||m.length===0||a&&!g)a?u(null):c();else{let y=a?0:i,M=y*4,x=f.clippingState||null;l.value=x,x=u(m,h,M,d);for(let E=0;E!==M;++E)x[E]=n[E];f.clippingState=x,this.numIntersection=b?this.numPlanes:0,this.numPlanes+=y}};function c(){l.value!==n&&(l.value=n,l.needsUpdate=i>0),t.numPlanes=i,t.numIntersection=0}function u(p,h,d,m){let b=p!==null?p.length:0,g=null;if(b!==0){if(g=l.value,m!==!0||g===null){let f=d+b*4,y=h.matrixWorldInverse;o.getNormalMatrix(y),(g===null||g.length<f)&&(g=new Float32Array(f));for(let M=0,x=d;M!==b;++M,x+=4)r.copy(p[M]).applyMatrix4(y,o),r.normal.toArray(g,x),g[x+3]=r.constant}l.value=g,l.needsUpdate=!0}return t.numPlanes=b,t.numIntersection=0,g}}var wo=4,DC=6,NC=20,LC=256,lc=new er,gb=new ne,Bg=null,zg=0,Fg=0,Vg=!1,UC=new H,ar=new H,zf=class{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(t,n=0,i=.1,s=100,a={}){let{size:r=256,position:o=UC}=a;Bg=this._renderer.getRenderTarget(),zg=this._renderer.getActiveCubeFace(),Fg=this._renderer.getActiveMipmapLevel(),Vg=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(r);let l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(t,i,s,l,o),n>0&&this._blur(l,0,0,n),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(t,n=null){return this._fromTexture(t,n)}fromCubemap(t,n=null){return this._fromTexture(t,n)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=xb(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=vb(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodMeshes.length;t++)this._lodMeshes[t].geometry.dispose()}_cleanup(t){this._renderer.setRenderTarget(Bg,zg,Fg),this._renderer.xr.enabled=Vg,t.scissorTest=!1,Ao(t,0,0,t.width,t.height)}_fromTexture(t,n){t.mapping===Ma||t.mapping===ir?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Bg=this._renderer.getRenderTarget(),zg=this._renderer.getActiveCubeFace(),Fg=this._renderer.getActiveMipmapLevel(),Vg=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let i=n||this._allocateTargets();return this._textureToCubeUV(t,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){let t=3*Math.max(this._cubeSize,112),n=4*this._cubeSize,i={magFilter:mn,minFilter:mn,generateMipmaps:!1,type:Bi,format:Si,colorSpace:Bl,depthBuffer:!1},s=yb(t,n,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==n){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=yb(t,n,i);let{_lodMax:a}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=OC(a)),this._blurMaterial=PC(a,t,n),this._ggxMaterial=IC(a,t,n)}return s}_compileMaterial(t){let n=new tn(new kn,t);this._renderer.compile(n,lc)}_sceneToCubeUV(t,n,i,s,a){let l=new Fn(90,1,n,i),c=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],p=this._renderer,h=p.autoClear,d=p.toneMapping;p.getClearColor(gb),p.toneMapping=Oi,p.autoClear=!1,p.state.buffers.depth.getReversed()&&(p.setRenderTarget(s),p.clearDepth(),p.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new tn(new So,new xi({name:"PMREM.Background",side:Cn,depthWrite:!1,depthTest:!1})));let b=this._backgroundBox,g=b.material,f=!1,y=t.background;y?y.isColor&&(g.color.copy(y),t.background=null,f=!0):(g.color.copy(gb),f=!0);for(let M=0;M<6;M++){let x=M%3;x===0?(l.up.set(0,c[M],0),l.position.set(a.x,a.y,a.z),l.lookAt(a.x+u[M],a.y,a.z)):x===1?(l.up.set(0,0,c[M]),l.position.set(a.x,a.y,a.z),l.lookAt(a.x,a.y+u[M],a.z)):(l.up.set(0,c[M],0),l.position.set(a.x,a.y,a.z),l.lookAt(a.x,a.y,a.z+u[M]));let E=this._cubeSize;Ao(s,x*E,M>2?E:0,E,E),p.setRenderTarget(s),f&&p.render(b,l),p.render(t,l)}p.toneMapping=d,p.autoClear=h,t.background=y}_textureToCubeUV(t,n){let i=this._renderer,s=t.mapping===Ma||t.mapping===ir;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=xb()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=vb());let a=s?this._cubemapMaterial:this._equirectMaterial,r=this._lodMeshes[0];r.material=a;let o=a.uniforms;o.envMap.value=t;let l=this._cubeSize;Ao(n,0,0,3*l,2*l),i.setRenderTarget(n),i.render(r,lc)}_applyPMREM(t){let n=this._renderer,i=n.autoClear;n.autoClear=!1;let s=this._lodMeshes.length;for(let a=1;a<s;a++)this._applyGGXFilter(t,a-1,a);n.autoClear=i}_applyGGXFilter(t,n,i){let s=this._renderer,a=this._pingPongRenderTarget,r=this._ggxMaterial,o=this._lodMeshes[i];o.material=r;let l=r.uniforms,c=i/(this._lodMeshes.length-1),u=n/(this._lodMeshes.length-1),p=Math.sqrt(c*c-u*u),h=c*1.25,d=p*h,{_lodMax:m}=this,b=this._sizeLods[i],g=3*b*(i>m-wo?i-m+wo:0),f=4*(this._cubeSize-b);l.envMap.value=t.texture,l.roughness.value=d,l.mipInt.value=m-n,Ao(a,g,f,3*b,2*b),s.setRenderTarget(a),s.render(o,lc),l.envMap.value=a.texture,l.roughness.value=0,l.mipInt.value=m-i,Ao(t,g,f,3*b,2*b),s.setRenderTarget(t),s.render(o,lc)}_blur(t,n,i,s){let a=this._pingPongRenderTarget,r=Math.min(s,Math.PI)/Math.SQRT2;this._blurPass(t,a,n,i,r),this._blurPass(a,t,i,i,r)}_blurPass(t,n,i,s,a){let r=this._renderer,o=this._blurMaterial,l=this._lodMeshes[s];l.material=o;let c=o.uniforms;c.envMap.value=t.texture,c.sigma.value=a,c.mipInt.value=this._lodMax-i;let u=this._sizeLods[s],p=3*u*(s>this._lodMax-wo?s-this._lodMax+wo:0),h=4*(this._cubeSize-u);Ao(n,p,h,3*u,2*u),r.setRenderTarget(n),r.render(l,lc)}};function OC(e){let t=[],n=[],i=e,s=e-wo+1+DC;for(let a=0;a<s;a++){let r=Math.pow(2,i);t.push(r);let o=1/(r-2),l=-o,c=1+o,u=[l,l,c,l,c,c,l,l,c,c,l,c],p=6,h=6,d=3,m=new Float32Array(d*h*p),b=new Float32Array(d*h*p);for(let f=0;f<p;f++){let y=f%3*2/3-1,M=f>2?0:-1,x=[y,M,0,y+2/3,M,0,y+2/3,M+1,0,y,M,0,y+2/3,M+1,0,y,M+1,0];m.set(x,d*h*f);for(let E=0;E<h;E++){let T=u[E*2]*2-1,C=u[E*2+1]*2-1;f===0?ar.set(1,C,T):f===1?ar.set(-T,1,-C):f===2?ar.set(-T,C,1):f===3?ar.set(-1,C,-T):f===4?ar.set(-T,-1,C):ar.set(T,C,-1),ar.toArray(b,(f*h+E)*d)}}let g=new kn;g.setAttribute("position",new yi(m,d)),g.setAttribute("outputDirection",new yi(b,d)),n.push(new tn(g,null)),i>wo&&i--}return{lodMeshes:n,sizeLods:t}}function yb(e,t,n){let i=new Hn(e,t,n);return i.texture.mapping=$l,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Ao(e,t,n,i,s){e.viewport.set(t,n,i,s),e.scissor.set(t,n,i,s)}function IC(e,t,n){return new ei({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:LC,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Hf(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:es,depthTest:!1,depthWrite:!1})}function PC(e,t,n){return new ei({name:"SphericalGaussianBlur",defines:{SAMPLES:NC,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:Hf(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float sigma;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359
			#define GOLDEN_ANGLE 2.39996322973

			void main() {

				if ( sigma == 0.0 ) {

					gl_FragColor = vec4( bilinearCubeUV( envMap, vOutputDirection, mipInt ), 1.0 );
					return;

				}

				vec3 outputDirection = normalize( vOutputDirection );

				vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
				vec3 tangent = normalize( cross( up, outputDirection ) );
				vec3 bitangent = cross( outputDirection, tangent );

				// Truncate the kernel at three standard deviations or at the antipode.
				float thetaMax = min( 3.0 * sigma, PI );
				float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

				vec3 accumColor = vec3( 0.0 );
				float accumWeight = 0.0;

				for ( int i = 0; i < SAMPLES; i ++ ) {

					// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
					float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
					float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
					float phi = float( i ) * GOLDEN_ANGLE;

					vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
					vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

					// Correct the planar sample density to solid angle.
					float weight = sin( theta ) / theta;

					accumColor += weight * bilinearCubeUV( envMap, sampleDirection, mipInt );
					accumWeight += weight;

				}

				gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

			}
		`,blending:es,depthTest:!1,depthWrite:!1})}function vb(){return new ei({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Hf(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:es,depthTest:!1,depthWrite:!1})}function xb(){return new ei({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Hf(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:es,depthTest:!1,depthWrite:!1})}function Hf(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}var Ff=class extends Hn{constructor(t=1,n={}){super(t,t,n),this.isWebGLCubeRenderTarget=!0;let i={width:t,height:t,depth:1},s=[i,i,i,i,i,i];this.texture=new Yl(s),this._setTextureOptions(n),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,n){this.texture.type=n.type,this.texture.colorSpace=n.colorSpace,this.texture.generateMipmaps=n.generateMipmaps,this.texture.minFilter=n.minFilter,this.texture.magFilter=n.magFilter;let i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new So(5,5,5),a=new ei({name:"CubemapFromEquirect",uniforms:sr(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Cn,blending:es});a.uniforms.tEquirect.value=n;let r=new tn(s,a),o=n.minFilter;return n.minFilter===Ea&&(n.minFilter=mn),new qh(1,10,this).update(t,r),n.minFilter=o,r.geometry.dispose(),r.material.dispose(),this}clear(t,n=!0,i=!0,s=!0){let a=t.getRenderTarget();for(let r=0;r<6;r++)t.setRenderTarget(this,r),t.clear(n,i,s);t.setRenderTarget(a)}};function BC(e){let t=new WeakMap,n=new WeakMap,i=null;function s(h,d=!1){return h==null?null:d?r(h):a(h)}function a(h){if(h&&h.isTexture){let d=h.mapping;if(d===Zh||d===Kh)if(t.has(h)){let m=t.get(h).texture;return o(m,h.mapping)}else{let m=h.image;if(m&&m.height>0){let b=new Ff(m.height);return b.fromEquirectangularTexture(e,h),t.set(h,b),h.addEventListener("dispose",c),o(b.texture,h.mapping)}else return null}}return h}function r(h){if(h&&h.isTexture){let d=h.mapping,m=d===Zh||d===Kh,b=d===Ma||d===ir;if(m||b){let g=n.get(h),f=g!==void 0?g.texture.pmremVersion:0;if(h.isRenderTargetTexture&&h.pmremVersion!==f)return i===null&&(i=new zf(e)),g=m?i.fromEquirectangular(h,g):i.fromCubemap(h,g),g.texture.pmremVersion=h.pmremVersion,n.set(h,g),g.texture;if(g!==void 0)return g.texture;{let y=h.image;return m&&y&&y.height>0||b&&y&&l(y)?(i===null&&(i=new zf(e)),g=m?i.fromEquirectangular(h):i.fromCubemap(h),g.texture.pmremVersion=h.pmremVersion,n.set(h,g),h.addEventListener("dispose",u),g.texture):null}}}return h}function o(h,d){return d===Zh?h.mapping=Ma:d===Kh&&(h.mapping=ir),h}function l(h){let d=0,m=6;for(let b=0;b<m;b++)h[b]!==void 0&&d++;return d===m}function c(h){let d=h.target;d.removeEventListener("dispose",c);let m=t.get(d);m!==void 0&&(t.delete(d),m.dispose())}function u(h){let d=h.target;d.removeEventListener("dispose",u);let m=n.get(d);m!==void 0&&(n.delete(d),m.dispose())}function p(){t=new WeakMap,n=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:s,dispose:p}}function zC(e){let t={};function n(i){if(t[i]!==void 0)return t[i];let s=e.getExtension(i);return t[i]=s,s}return{has:function(i){return n(i)!==null},init:function(){n("EXT_color_buffer_float"),n("WEBGL_clip_cull_distance"),n("OES_texture_float_linear"),n("EXT_color_buffer_half_float"),n("WEBGL_multisampled_render_to_texture"),n("WEBGL_render_shared_exponent")},get:function(i){let s=n(i);return s===null&&$a("WebGLRenderer: "+i+" extension not supported."),s}}}function FC(e,t,n,i){let s={},a=new WeakMap;function r(p){let h=p.target;h.index!==null&&t.remove(h.index);for(let m in h.attributes)t.remove(h.attributes[m]);h.removeEventListener("dispose",r),delete s[h.id];let d=a.get(h);d&&(t.remove(d),a.delete(h)),i.releaseStatesOfGeometry(h),h.isInstancedBufferGeometry===!0&&delete h._maxInstanceCount,n.memory.geometries--}function o(p,h){return s[h.id]===!0||(h.addEventListener("dispose",r),s[h.id]=!0,n.memory.geometries++),h}function l(p){let h=p.attributes;for(let d in h)t.update(h[d],e.ARRAY_BUFFER)}function c(p){let h=[],d=p.index,m=p.attributes.position,b=0;if(m===void 0)return;if(d!==null){let y=d.array;b=d.version;for(let M=0,x=y.length;M<x;M+=3){let E=y[M+0],T=y[M+1],C=y[M+2];h.push(E,T,T,C,C,E)}}else{let y=m.array;b=m.version;for(let M=0,x=y.length/3-1;M<x;M+=3){let E=M+0,T=M+1,C=M+2;h.push(E,T,T,C,C,E)}}let g=new(m.count>=65535?Xl:Wl)(h,1);g.version=b;let f=a.get(p);f&&t.remove(f),a.set(p,g)}function u(p){let h=a.get(p);if(h){let d=p.index;d!==null&&h.version<d.version&&c(p)}else c(p);return a.get(p)}return{get:o,update:l,getWireframeAttribute:u}}function VC(e,t,n){let i;function s(p){i=p}let a,r;function o(p){a=p.type,r=p.bytesPerElement}function l(p,h){e.drawElements(i,h,a,p*r),n.update(h,i,1)}function c(p,h,d){d!==0&&(e.drawElementsInstanced(i,h,a,p*r,d),n.update(h,i,d))}function u(p,h,d){if(d===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,h,0,a,p,0,d);let b=0;for(let g=0;g<d;g++)b+=h[g];n.update(b,i,1)}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=u}function HC(e){let t={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function i(a,r,o){switch(n.calls++,r){case e.TRIANGLES:n.triangles+=o*(a/3);break;case e.LINES:n.lines+=o*(a/2);break;case e.LINE_STRIP:n.lines+=o*(a-1);break;case e.LINE_LOOP:n.lines+=o*a;break;case e.POINTS:n.points+=o*a;break;default:Ut("WebGLInfo: Unknown draw mode:",r);break}}function s(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:t,render:n,programs:null,autoReset:!0,reset:s,update:i}}function kC(e,t,n){let i=new WeakMap,s=new Ue;function a(r,o,l){let c=r.morphTargetInfluences,u=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,p=u!==void 0?u.length:0,h=i.get(o);if(h===void 0||h.count!==p){let A=function(){C.dispose(),i.delete(o),o.removeEventListener("dispose",A)};h!==void 0&&h.texture.dispose();let d=o.morphAttributes.position!==void 0,m=o.morphAttributes.normal!==void 0,b=o.morphAttributes.color!==void 0,g=o.morphAttributes.position||[],f=o.morphAttributes.normal||[],y=o.morphAttributes.color||[],M=0;d===!0&&(M=1),m===!0&&(M=2),b===!0&&(M=3);let x=o.attributes.position.count*M,E=1;x>t.maxTextureSize&&(E=Math.ceil(x/t.maxTextureSize),x=t.maxTextureSize);let T=new Float32Array(x*E*4*p),C=new Hl(T,x,E,p);C.type=Pi,C.needsUpdate=!0;let _=M*4;for(let R=0;R<p;R++){let I=g[R],F=f[R],D=y[R],O=x*E*4*R;for(let k=0;k<I.count;k++){let K=k*_;d===!0&&(s.fromBufferAttribute(I,k),T[O+K+0]=s.x,T[O+K+1]=s.y,T[O+K+2]=s.z,T[O+K+3]=0),m===!0&&(s.fromBufferAttribute(F,k),T[O+K+4]=s.x,T[O+K+5]=s.y,T[O+K+6]=s.z,T[O+K+7]=0),b===!0&&(s.fromBufferAttribute(D,k),T[O+K+8]=s.x,T[O+K+9]=s.y,T[O+K+10]=s.z,T[O+K+11]=D.itemSize===4?s.w:1)}}h={count:p,texture:C,size:new ee(x,E)},i.set(o,h),o.addEventListener("dispose",A)}if(r.isInstancedMesh===!0&&r.morphTexture!==null)l.getUniforms().setValue(e,"morphTexture",r.morphTexture,n);else{let d=0;for(let b=0;b<c.length;b++)d+=c[b];let m=o.morphTargetsRelative?1:1-d;l.getUniforms().setValue(e,"morphTargetBaseInfluence",m),l.getUniforms().setValue(e,"morphTargetInfluences",c)}l.getUniforms().setValue(e,"morphTargetsTexture",h.texture,n),l.getUniforms().setValue(e,"morphTargetsTextureSize",h.size)}return{update:a}}function GC(e,t,n,i,s){let a=new WeakMap;function r(c){let u=s.render.frame,p=c.geometry,h=t.get(c,p);if(a.get(h)!==u&&(t.update(h),a.set(h,u)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),a.get(c)!==u&&(n.update(c.instanceMatrix,e.ARRAY_BUFFER),c.instanceColor!==null&&n.update(c.instanceColor,e.ARRAY_BUFFER),a.set(c,u))),c.isSkinnedMesh){let d=c.skeleton;a.get(d)!==u&&(d.update(),a.set(d,u))}return h}function o(){a=new WeakMap}function l(c){let u=c.target;u.removeEventListener("dispose",l),i.releaseStatesOfObject(u),n.remove(u.instanceMatrix),u.instanceColor!==null&&n.remove(u.instanceColor)}return{update:r,dispose:o}}var WC={[mg]:"LINEAR_TONE_MAPPING",[gg]:"REINHARD_TONE_MAPPING",[yg]:"CINEON_TONE_MAPPING",[vg]:"ACES_FILMIC_TONE_MAPPING",[_g]:"AGX_TONE_MAPPING",[Sg]:"NEUTRAL_TONE_MAPPING",[xg]:"CUSTOM_TONE_MAPPING"};function XC(e,t,n,i,s,a){let r=new Hn(t,n,{type:e,depthBuffer:s,stencilBuffer:a,samples:i?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),o=null,l=null,c=new kn;c.setAttribute("position",new $e([-1,3,0,-1,-1,0,3,-1,0],3)),c.setAttribute("uv",new $e([0,2,0,0,2,0],2));let u=new Uh({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),p=new tn(c,u),h=new er(-1,1,1,-1,0,1),d=null,m=null,b=!1,g,f=null,y=[],M=!1;this.setSize=function(x,E){r.setSize(x,E),o!==null&&o.setSize(x,E),l!==null&&l.setSize(x,E);for(let T=0;T<y.length;T++){let C=y[T];C.setSize&&C.setSize(x,E)}},this.setEffects=function(x){y=x,M=y.length>0&&y[0].isRenderPass===!0;let E=r.width,T=r.height;y.length>0&&o===null&&(o=new Hn(E,T,{type:Bi,depthBuffer:!1,stencilBuffer:!1}),l=new Hn(E,T,{type:Bi,depthBuffer:!1,stencilBuffer:!1}));for(let C=0;C<y.length;C++){let _=y[C];_.setSize&&_.setSize(E,T)}},this.begin=function(x,E){if(b||x.toneMapping===Oi&&y.length===0)return!1;if(f=E,E!==null){let T=E.width,C=E.height;(r.width!==T||r.height!==C)&&this.setSize(T,C)}return M===!1&&x.setRenderTarget(r),g=x.toneMapping,x.toneMapping=Oi,!0},this.hasRenderPass=function(){return M},this.end=function(x,E){x.toneMapping=g,b=!0;let T=r,C=o;for(let _=0;_<y.length;_++){let A=y[_];A.enabled!==!1&&(A.render(x,C,T,E),A.needsSwap!==!1&&(T=C,C=C===o?l:o))}if(d!==x.outputColorSpace||m!==x.toneMapping){d=x.outputColorSpace,m=x.toneMapping,u.defines={},Qt.getTransfer(d)===le&&(u.defines.SRGB_TRANSFER="");let _=WC[m];_&&(u.defines[_]=""),u.needsUpdate=!0}u.uniforms.tDiffuse.value=T.texture,x.setRenderTarget(f),x.render(p,h),f=null,b=!1},this.isCompositing=function(){return b},this.dispose=function(){r.dispose(),o!==null&&o.dispose(),l!==null&&l.dispose(),c.dispose(),u.dispose()}}var Fb=new bn,Gg=new ya(1,1),Vb=new Hl,Hb=new Rh,kb=new Yl,_b=[],Sb=[],bb=new Float32Array(16),Mb=new Float32Array(9),Eb=new Float32Array(4);function Ro(e,t,n){let i=e[0];if(i<=0||i>0)return e;let s=t*n,a=_b[s];if(a===void 0&&(a=new Float32Array(s),_b[s]=a),t!==0){i.toArray(a,0);for(let r=1,o=0;r!==t;++r)o+=n,e[r].toArray(a,o)}return a}function en(e,t){if(e.length!==t.length)return!1;for(let n=0,i=e.length;n<i;n++)if(e[n]!==t[n])return!1;return!0}function nn(e,t){for(let n=0,i=t.length;n<i;n++)e[n]=t[n]}function kf(e,t){let n=Sb[t];n===void 0&&(n=new Int32Array(t),Sb[t]=n);for(let i=0;i!==t;++i)n[i]=e.allocateTextureUnit();return n}function qC(e,t){let n=this.cache;n[0]!==t&&(e.uniform1f(this.addr,t),n[0]=t)}function YC(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2f(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(en(n,t))return;e.uniform2fv(this.addr,t),nn(n,t)}}function ZC(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3f(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else if(t.r!==void 0)(n[0]!==t.r||n[1]!==t.g||n[2]!==t.b)&&(e.uniform3f(this.addr,t.r,t.g,t.b),n[0]=t.r,n[1]=t.g,n[2]=t.b);else{if(en(n,t))return;e.uniform3fv(this.addr,t),nn(n,t)}}function KC(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4f(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(en(n,t))return;e.uniform4fv(this.addr,t),nn(n,t)}}function JC(e,t){let n=this.cache,i=t.elements;if(i===void 0){if(en(n,t))return;e.uniformMatrix2fv(this.addr,!1,t),nn(n,t)}else{if(en(n,i))return;Eb.set(i),e.uniformMatrix2fv(this.addr,!1,Eb),nn(n,i)}}function QC(e,t){let n=this.cache,i=t.elements;if(i===void 0){if(en(n,t))return;e.uniformMatrix3fv(this.addr,!1,t),nn(n,t)}else{if(en(n,i))return;Mb.set(i),e.uniformMatrix3fv(this.addr,!1,Mb),nn(n,i)}}function jC(e,t){let n=this.cache,i=t.elements;if(i===void 0){if(en(n,t))return;e.uniformMatrix4fv(this.addr,!1,t),nn(n,t)}else{if(en(n,i))return;bb.set(i),e.uniformMatrix4fv(this.addr,!1,bb),nn(n,i)}}function $C(e,t){let n=this.cache;n[0]!==t&&(e.uniform1i(this.addr,t),n[0]=t)}function tR(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2i(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(en(n,t))return;e.uniform2iv(this.addr,t),nn(n,t)}}function eR(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3i(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(en(n,t))return;e.uniform3iv(this.addr,t),nn(n,t)}}function nR(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4i(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(en(n,t))return;e.uniform4iv(this.addr,t),nn(n,t)}}function iR(e,t){let n=this.cache;n[0]!==t&&(e.uniform1ui(this.addr,t),n[0]=t)}function sR(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2ui(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(en(n,t))return;e.uniform2uiv(this.addr,t),nn(n,t)}}function aR(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3ui(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(en(n,t))return;e.uniform3uiv(this.addr,t),nn(n,t)}}function rR(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4ui(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(en(n,t))return;e.uniform4uiv(this.addr,t),nn(n,t)}}function oR(e,t,n){let i=this.cache,s=n.allocateTextureUnit();i[0]!==s&&(e.uniform1i(this.addr,s),i[0]=s);let a;this.type===e.SAMPLER_2D_SHADOW?(Gg.compareFunction=n.isReversedDepthBuffer()?If:Of,a=Gg):a=Fb,n.setTexture2D(t||a,s)}function lR(e,t,n){let i=this.cache,s=n.allocateTextureUnit();i[0]!==s&&(e.uniform1i(this.addr,s),i[0]=s),n.setTexture3D(t||Hb,s)}function cR(e,t,n){let i=this.cache,s=n.allocateTextureUnit();i[0]!==s&&(e.uniform1i(this.addr,s),i[0]=s),n.setTextureCube(t||kb,s)}function uR(e,t,n){let i=this.cache,s=n.allocateTextureUnit();i[0]!==s&&(e.uniform1i(this.addr,s),i[0]=s),n.setTexture2DArray(t||Vb,s)}function hR(e){switch(e){case 5126:return qC;case 35664:return YC;case 35665:return ZC;case 35666:return KC;case 35674:return JC;case 35675:return QC;case 35676:return jC;case 5124:case 35670:return $C;case 35667:case 35671:return tR;case 35668:case 35672:return eR;case 35669:case 35673:return nR;case 5125:return iR;case 36294:return sR;case 36295:return aR;case 36296:return rR;case 35678:case 36198:case 36298:case 36306:case 35682:return oR;case 35679:case 36299:case 36307:return lR;case 35680:case 36300:case 36308:case 36293:return cR;case 36289:case 36303:case 36311:case 36292:return uR}}function fR(e,t){e.uniform1fv(this.addr,t)}function dR(e,t){let n=Ro(t,this.size,2);e.uniform2fv(this.addr,n)}function pR(e,t){let n=Ro(t,this.size,3);e.uniform3fv(this.addr,n)}function mR(e,t){let n=Ro(t,this.size,4);e.uniform4fv(this.addr,n)}function gR(e,t){let n=Ro(t,this.size,4);e.uniformMatrix2fv(this.addr,!1,n)}function yR(e,t){let n=Ro(t,this.size,9);e.uniformMatrix3fv(this.addr,!1,n)}function vR(e,t){let n=Ro(t,this.size,16);e.uniformMatrix4fv(this.addr,!1,n)}function xR(e,t){e.uniform1iv(this.addr,t)}function _R(e,t){e.uniform2iv(this.addr,t)}function SR(e,t){e.uniform3iv(this.addr,t)}function bR(e,t){e.uniform4iv(this.addr,t)}function MR(e,t){e.uniform1uiv(this.addr,t)}function ER(e,t){e.uniform2uiv(this.addr,t)}function TR(e,t){e.uniform3uiv(this.addr,t)}function AR(e,t){e.uniform4uiv(this.addr,t)}function wR(e,t,n){let i=this.cache,s=t.length,a=kf(n,s);en(i,a)||(e.uniform1iv(this.addr,a),nn(i,a));let r;this.type===e.SAMPLER_2D_SHADOW?r=Gg:r=Fb;for(let o=0;o!==s;++o)n.setTexture2D(t[o]||r,a[o])}function CR(e,t,n){let i=this.cache,s=t.length,a=kf(n,s);en(i,a)||(e.uniform1iv(this.addr,a),nn(i,a));for(let r=0;r!==s;++r)n.setTexture3D(t[r]||Hb,a[r])}function RR(e,t,n){let i=this.cache,s=t.length,a=kf(n,s);en(i,a)||(e.uniform1iv(this.addr,a),nn(i,a));for(let r=0;r!==s;++r)n.setTextureCube(t[r]||kb,a[r])}function DR(e,t,n){let i=this.cache,s=t.length,a=kf(n,s);en(i,a)||(e.uniform1iv(this.addr,a),nn(i,a));for(let r=0;r!==s;++r)n.setTexture2DArray(t[r]||Vb,a[r])}function NR(e){switch(e){case 5126:return fR;case 35664:return dR;case 35665:return pR;case 35666:return mR;case 35674:return gR;case 35675:return yR;case 35676:return vR;case 5124:case 35670:return xR;case 35667:case 35671:return _R;case 35668:case 35672:return SR;case 35669:case 35673:return bR;case 5125:return MR;case 36294:return ER;case 36295:return TR;case 36296:return AR;case 35678:case 36198:case 36298:case 36306:case 35682:return wR;case 35679:case 36299:case 36307:return CR;case 35680:case 36300:case 36308:case 36293:return RR;case 36289:case 36303:case 36311:case 36292:return DR}}var Wg=class{constructor(t,n,i){this.id=t,this.addr=i,this.cache=[],this.type=n.type,this.setValue=hR(n.type)}},Xg=class{constructor(t,n,i){this.id=t,this.addr=i,this.cache=[],this.type=n.type,this.size=n.size,this.setValue=NR(n.type)}},qg=class{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,n,i){let s=this.seq;for(let a=0,r=s.length;a!==r;++a){let o=s[a];o.setValue(t,n[o.id],i)}}},Hg=/(\w+)(\])?(\[|\.)?/g;function Tb(e,t){e.seq.push(t),e.map[t.id]=t}function LR(e,t,n){let i=e.name,s=i.length;for(Hg.lastIndex=0;;){let a=Hg.exec(i),r=Hg.lastIndex,o=a[1],l=a[2]==="]",c=a[3];if(l&&(o=o|0),c===void 0||c==="["&&r+2===s){Tb(n,c===void 0?new Wg(o,e,t):new Xg(o,e,t));break}else{let p=n.map[o];p===void 0&&(p=new qg(o),Tb(n,p)),n=p}}}var Co=class{constructor(t,n){this.seq=[],this.map={};let i=t.getProgramParameter(n,t.ACTIVE_UNIFORMS);for(let r=0;r<i;++r){let o=t.getActiveUniform(n,r),l=t.getUniformLocation(n,o.name);LR(o,l,this)}let s=[],a=[];for(let r of this.seq)r.type===t.SAMPLER_2D_SHADOW||r.type===t.SAMPLER_CUBE_SHADOW||r.type===t.SAMPLER_2D_ARRAY_SHADOW?s.push(r):a.push(r);s.length>0&&(this.seq=s.concat(a))}setValue(t,n,i,s){let a=this.map[n];a!==void 0&&a.setValue(t,i,s)}setOptional(t,n,i){let s=n[i];s!==void 0&&this.setValue(t,i,s)}static upload(t,n,i,s){for(let a=0,r=n.length;a!==r;++a){let o=n[a],l=i[o.id];l.needsUpdate!==!1&&o.setValue(t,l.value,s)}}static seqWithValue(t,n){let i=[];for(let s=0,a=t.length;s!==a;++s){let r=t[s];r.id in n&&i.push(r)}return i}};function Ab(e,t,n){let i=e.createShader(t);return e.shaderSource(i,n),e.compileShader(i),i}var UR=37297,OR=0;function IR(e,t){let n=e.split(`
`),i=[],s=Math.max(t-6,0),a=Math.min(t+6,n.length);for(let r=s;r<a;r++){let o=r+1;i.push(`${o===t?">":" "} ${o}: ${n[r]}`)}return i.join(`
`)}var wb=new Ot;function PR(e){Qt._getMatrix(wb,Qt.workingColorSpace,e);let t=`mat3( ${wb.elements.map(n=>n.toFixed(4))} )`;switch(Qt.getTransfer(e)){case zl:return[t,"LinearTransferOETF"];case le:return[t,"sRGBTransferOETF"];default:return Nt("WebGLProgram: Unsupported color space: ",e),[t,"LinearTransferOETF"]}}function Cb(e,t,n){let i=e.getShaderParameter(t,e.COMPILE_STATUS),a=(e.getShaderInfoLog(t)||"").trim();if(i&&a==="")return"";let r=/ERROR: 0:(\d+)/.exec(a);if(r){let o=parseInt(r[1]);return n.toUpperCase()+`

`+a+`

`+IR(e.getShaderSource(t),o)}else return a}function BR(e,t){let n=PR(t);return[`vec4 ${e}( vec4 value ) {`,`	return ${n[1]}( vec4( value.rgb * ${n[0]}, value.a ) );`,"}"].join(`
`)}var zR={[mg]:"Linear",[gg]:"Reinhard",[yg]:"Cineon",[vg]:"ACESFilmic",[_g]:"AgX",[Sg]:"Neutral",[xg]:"Custom"};function FR(e,t){let n=zR[t];return n===void 0?(Nt("WebGLProgram: Unsupported toneMapping:",t),"vec3 "+e+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+e+"( vec3 color ) { return "+n+"ToneMapping( color ); }"}var Bf=new H;function VR(){Qt.getLuminanceCoefficients(Bf);let e=Bf.x.toFixed(4),t=Bf.y.toFixed(4),n=Bf.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${e}, ${t}, ${n} );`,"	return dot( weights, rgb );","}"].join(`
`)}function HR(e){return[e.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",e.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(uc).join(`
`)}function kR(e){let t=[];for(let n in e){let i=e[n];i!==!1&&t.push("#define "+n+" "+i)}return t.join(`
`)}function GR(e,t){let n={},i=e.getProgramParameter(t,e.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){let a=e.getActiveAttrib(t,s),r=a.name,o=1;a.type===e.FLOAT_MAT2&&(o=2),a.type===e.FLOAT_MAT3&&(o=3),a.type===e.FLOAT_MAT4&&(o=4),n[r]={type:a.type,location:e.getAttribLocation(t,r),locationSize:o}}return n}function uc(e){return e!==""}function Rb(e,t){let n=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return e.replace(/NUM_SUN_LIGHTS/g,t.numSunLights).replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,t.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Db(e,t){return e.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var WR=/^[ \t]*#include +<([\w\d./]+)>/gm;function Yg(e){return e.replace(WR,qR)}var XR=new Map;function qR(e,t){let n=Vt[t];if(n===void 0){let i=XR.get(t);if(i!==void 0)n=Vt[i],Nt('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,i);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+t+">")}return Yg(n)}var YR=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Nb(e){return e.replace(YR,ZR)}function ZR(e,t,n,i){let s="";for(let a=parseInt(t);a<parseInt(n);a++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+a+" ]").replace(/UNROLLED_LOOP_INDEX/g,a);return s}function Lb(e){let t=`precision ${e.precision} float;
	precision ${e.precision} int;
	precision ${e.precision} sampler2D;
	precision ${e.precision} samplerCube;
	precision ${e.precision} sampler3D;
	precision ${e.precision} sampler2DArray;
	precision ${e.precision} sampler2DShadow;
	precision ${e.precision} samplerCubeShadow;
	precision ${e.precision} sampler2DArrayShadow;
	precision ${e.precision} isampler2D;
	precision ${e.precision} isampler3D;
	precision ${e.precision} isamplerCube;
	precision ${e.precision} isampler2DArray;
	precision ${e.precision} usampler2D;
	precision ${e.precision} usampler3D;
	precision ${e.precision} usamplerCube;
	precision ${e.precision} usampler2DArray;
	`;return e.precision==="highp"?t+=`
#define HIGH_PRECISION`:e.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:e.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}var KR={[jl]:"SHADOWMAP_TYPE_PCF",[bo]:"SHADOWMAP_TYPE_VSM"};function JR(e){return KR[e.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}var QR={[Ma]:"ENVMAP_TYPE_CUBE",[ir]:"ENVMAP_TYPE_CUBE",[$l]:"ENVMAP_TYPE_CUBE_UV"};function jR(e){return e.envMap===!1?"ENVMAP_TYPE_CUBE":QR[e.envMapMode]||"ENVMAP_TYPE_CUBE"}var $R={[ir]:"ENVMAP_MODE_REFRACTION"};function t2(e){return e.envMap===!1?"ENVMAP_MODE_REFLECTION":$R[e.envMapMode]||"ENVMAP_MODE_REFLECTION"}var e2={[pg]:"ENVMAP_BLENDING_MULTIPLY",[KS]:"ENVMAP_BLENDING_MIX",[JS]:"ENVMAP_BLENDING_ADD"};function n2(e){return e.envMap===!1?"ENVMAP_BLENDING_NONE":e2[e.combine]||"ENVMAP_BLENDING_NONE"}function i2(e){let t=e.envMapCubeUVHeight;if(t===null)return null;let n=Math.log2(t)-2,i=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,n),112)),texelHeight:i,maxMip:n}}function s2(e,t,n,i){let s=e.getContext(),a=n.defines,r=n.vertexShader,o=n.fragmentShader,l=JR(n),c=jR(n),u=t2(n),p=n2(n),h=i2(n),d=HR(n),m=kR(a),b=s.createProgram(),g,f,y=n.glslVersion?"#version "+n.glslVersion+`
`:"";n.isRawShaderMaterial?(g=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,m].filter(uc).join(`
`),g.length>0&&(g+=`
`),f=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,m].filter(uc).join(`
`),f.length>0&&(f+=`
`)):(g=[Lb(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,m,n.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",n.batching?"#define USE_BATCHING":"",n.batchingColor?"#define USE_BATCHING_COLOR":"",n.instancing?"#define USE_INSTANCING":"",n.instancingColor?"#define USE_INSTANCING_COLOR":"",n.instancingMorph?"#define USE_INSTANCING_MORPH":"",n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.map?"#define USE_MAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+u:"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.displacementMap?"#define USE_DISPLACEMENTMAP":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.mapUv?"#define MAP_UV "+n.mapUv:"",n.alphaMapUv?"#define ALPHAMAP_UV "+n.alphaMapUv:"",n.lightMapUv?"#define LIGHTMAP_UV "+n.lightMapUv:"",n.aoMapUv?"#define AOMAP_UV "+n.aoMapUv:"",n.emissiveMapUv?"#define EMISSIVEMAP_UV "+n.emissiveMapUv:"",n.bumpMapUv?"#define BUMPMAP_UV "+n.bumpMapUv:"",n.normalMapUv?"#define NORMALMAP_UV "+n.normalMapUv:"",n.displacementMapUv?"#define DISPLACEMENTMAP_UV "+n.displacementMapUv:"",n.metalnessMapUv?"#define METALNESSMAP_UV "+n.metalnessMapUv:"",n.roughnessMapUv?"#define ROUGHNESSMAP_UV "+n.roughnessMapUv:"",n.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+n.anisotropyMapUv:"",n.clearcoatMapUv?"#define CLEARCOATMAP_UV "+n.clearcoatMapUv:"",n.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+n.clearcoatNormalMapUv:"",n.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+n.clearcoatRoughnessMapUv:"",n.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+n.iridescenceMapUv:"",n.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+n.iridescenceThicknessMapUv:"",n.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+n.sheenColorMapUv:"",n.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+n.sheenRoughnessMapUv:"",n.specularMapUv?"#define SPECULARMAP_UV "+n.specularMapUv:"",n.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+n.specularColorMapUv:"",n.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+n.specularIntensityMapUv:"",n.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+n.transmissionMapUv:"",n.thicknessMapUv?"#define THICKNESSMAP_UV "+n.thicknessMapUv:"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexNormals?"#define HAS_NORMAL":"",n.vertexColors?"#define USE_COLOR":"",n.vertexAlphas?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.flatShading?"#define FLAT_SHADED":"",n.skinning?"#define USE_SKINNING":"",n.morphTargets?"#define USE_MORPHTARGETS":"",n.morphNormals&&n.flatShading===!1?"#define USE_MORPHNORMALS":"",n.morphColors?"#define USE_MORPHCOLORS":"",n.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+n.morphTextureStride:"",n.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+n.morphTargetsCount:"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+l:"",n.sizeAttenuation?"#define USE_SIZEATTENUATION":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",n.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(uc).join(`
`),f=[Lb(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,m,n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",n.map?"#define USE_MAP":"",n.matcap?"#define USE_MATCAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+c:"",n.envMap?"#define "+u:"",n.envMap?"#define "+p:"",h?"#define CUBEUV_TEXEL_WIDTH "+h.texelWidth:"",h?"#define CUBEUV_TEXEL_HEIGHT "+h.texelHeight:"",h?"#define CUBEUV_MAX_MIP "+h.maxMip+".0":"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoat?"#define USE_CLEARCOAT":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.dispersion?"#define USE_DISPERSION":"",n.retroreflection?"#define USE_RETROREFLECTION":"",n.iridescence?"#define USE_IRIDESCENCE":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaTest?"#define USE_ALPHATEST":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.sheen?"#define USE_SHEEN":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexColors||n.instancingColor?"#define USE_COLOR":"",n.vertexAlphas||n.batchingColor?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.gradientMap?"#define USE_GRADIENTMAP":"",n.flatShading?"#define FLAT_SHADED":"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+l:"",n.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",n.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",n.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",n.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",n.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",n.toneMapping!==Oi?"#define TONE_MAPPING":"",n.toneMapping!==Oi?Vt.tonemapping_pars_fragment:"",n.toneMapping!==Oi?FR("toneMapping",n.toneMapping):"",n.dithering?"#define DITHERING":"",n.opaque?"#define OPAQUE":"",Vt.colorspace_pars_fragment,BR("linearToOutputTexel",n.outputColorSpace),VR(),n.useDepthPacking?"#define DEPTH_PACKING "+n.depthPacking:"",`
`].filter(uc).join(`
`)),r=Yg(r),r=Rb(r,n),r=Db(r,n),o=Yg(o),o=Rb(o,n),o=Db(o,n),r=Nb(r),o=Nb(o),n.isRawShaderMaterial!==!0&&(y=`#version 300 es
`,g=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,f=["#define varying in",n.glslVersion===Ng?"":"layout(location = 0) out highp vec4 pc_fragColor;",n.glslVersion===Ng?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);let M=y+g+r,x=y+f+o,E=Ab(s,s.VERTEX_SHADER,M),T=Ab(s,s.FRAGMENT_SHADER,x);s.attachShader(b,E),s.attachShader(b,T),n.index0AttributeName!==void 0?s.bindAttribLocation(b,0,n.index0AttributeName):n.hasPositionAttribute===!0&&s.bindAttribLocation(b,0,"position"),s.linkProgram(b);function C(I){if(e.debug.checkShaderErrors){let F=s.getProgramInfoLog(b)||"",D=s.getShaderInfoLog(E)||"",O=s.getShaderInfoLog(T)||"",k=F.trim(),K=D.trim(),Y=O.trim(),it=!0,X=!0;if(s.getProgramParameter(b,s.LINK_STATUS)===!1)if(it=!1,typeof e.debug.onShaderError=="function")e.debug.onShaderError(s,b,E,T);else{let tt=Cb(s,E,"vertex"),et=Cb(s,T,"fragment");Ut("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(b,s.VALIDATE_STATUS)+`

Material Name: `+I.name+`
Material Type: `+I.type+`

Program Info Log: `+k+`
`+tt+`
`+et)}else k!==""?Nt("WebGLProgram: Program Info Log:",k):(K===""||Y==="")&&(X=!1);X&&(I.diagnostics={runnable:it,programLog:k,vertexShader:{log:K,prefix:g},fragmentShader:{log:Y,prefix:f}})}s.deleteShader(E),s.deleteShader(T),_=new Co(s,b),A=GR(s,b)}let _;this.getUniforms=function(){return _===void 0&&C(this),_};let A;this.getAttributes=function(){return A===void 0&&C(this),A};let R=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return R===!1&&(R=s.getProgramParameter(b,UR)),R},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(b),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=OR++,this.cacheKey=t,this.usedTimes=1,this.program=b,this.vertexShader=E,this.fragmentShader=T,this}var a2=0,Zg=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t,n,i){let s=this._getShaderCacheForMaterial(t);return s.has(n)===!1&&(s.add(n),n.usedTimes++),s.has(i)===!1&&(s.add(i),i.usedTimes++),this}remove(t){let n=this.materialCache.get(t);for(let i of n)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(t),this}getVertexShaderStage(t){return this._getShaderStage(t.vertexShader)}getFragmentShaderStage(t){return this._getShaderStage(t.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){let n=this.materialCache,i=n.get(t);return i===void 0&&(i=new Set,n.set(t,i)),i}_getShaderStage(t){let n=this.shaderCache,i=n.get(t);return i===void 0&&(i=new Kg(t),n.set(t,i)),i}},Kg=class{constructor(t){this.id=a2++,this.code=t,this.usedTimes=0}};function r2(e){return e===Aa||e===ac||e===rc}function o2(e,t,n,i,s,a){let r=new kl,o=new Zg,l=new Set,c=[],u=new Map,p=i.logarithmicDepthBuffer,h=i.precision,d={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function m(_){return l.add(_),_===0?"uv":`uv${_}`}function b(_,A,R,I,F,D){let O=I.fog,k=F.geometry,K=_.isMeshStandardMaterial||_.isMeshLambertMaterial||_.isMeshPhongMaterial?I.environment:null,Y=_.isMeshStandardMaterial||_.isMeshLambertMaterial&&!_.envMap||_.isMeshPhongMaterial&&!_.envMap,it=t.get(_.envMap||K,Y),X=it&&it.mapping===$l?it.image.height:null,tt=d[_.type];_.precision!==null&&(h=i.getMaxPrecision(_.precision),h!==_.precision&&Nt("WebGLProgram.getParameters:",_.precision,"not supported, using",h,"instead."));let et=k.morphAttributes.position||k.morphAttributes.normal||k.morphAttributes.color,st=et!==void 0?et.length:0,gt=0;k.morphAttributes.position!==void 0&&(gt=1),k.morphAttributes.normal!==void 0&&(gt=2),k.morphAttributes.color!==void 0&&(gt=3);let Yt,Rt,Zt,W;if(tt){let ve=is[tt];Yt=ve.vertexShader,Rt=ve.fragmentShader}else{Yt=_.vertexShader,Rt=_.fragmentShader;let ve=o.getVertexShaderStage(_),re=o.getFragmentShaderStage(_);o.update(_,ve,re),Zt=ve.id,W=re.id}let Q=e.getRenderTarget(),St=e.state.buffers.depth.getReversed(),It=F.isInstancedMesh===!0,xt=F.isBatchedMesh===!0,Ht=!!_.map,Je=!!_.matcap,Gt=!!it,ie=!!_.aoMap,ye=!!_.lightMap,Kt=!!_.bumpMap&&_.wireframe===!1,Ce=!!_.normalMap,sn=!!_.displacementMap,Dn=!!_.emissiveMap,Le=!!_.metalnessMap,Ge=!!_.roughnessMap,U=_.anisotropy>0,gn=_.clearcoat>0,ce=_.dispersion>0,w=_.retroreflectivity>0,v=_.iridescence>0,P=_.sheen>0,V=_.transmission>0,q=U&&!!_.anisotropyMap,at=gn&&!!_.clearcoatMap,ot=gn&&!!_.clearcoatNormalMap,Z=gn&&!!_.clearcoatRoughnessMap,j=v&&!!_.iridescenceMap,lt=v&&!!_.iridescenceThicknessMap,At=P&&!!_.sheenColorMap,ft=P&&!!_.sheenRoughnessMap,ct=!!_.specularMap,wt=!!_.specularColorMap,Dt=!!_.specularIntensityMap,Bt=V&&!!_.transmissionMap,L=V&&!!_.thicknessMap,ut=!!_.gradientMap,J=!!_.alphaMap,ht=_.alphaTest>0,yt=!!_.alphaHash,nt=!!_.extensions,Ct=Oi;_.toneMapped&&(Q===null||Q.isXRRenderTarget===!0)&&(Ct=e.toneMapping);let Et={shaderID:tt,shaderType:_.type,shaderName:_.name,vertexShader:Yt,fragmentShader:Rt,defines:_.defines,customVertexShaderID:Zt,customFragmentShaderID:W,isRawShaderMaterial:_.isRawShaderMaterial===!0,glslVersion:_.glslVersion,precision:h,batching:xt,batchingColor:xt&&F._colorsTexture!==null,instancing:It,instancingColor:It&&F.instanceColor!==null,instancingMorph:It&&F.morphTexture!==null,outputColorSpace:Q===null?e.outputColorSpace:Q.isXRRenderTarget===!0?Q.texture.colorSpace:Qt.workingColorSpace,alphaToCoverage:!!_.alphaToCoverage,map:Ht,matcap:Je,envMap:Gt,envMapMode:Gt&&it.mapping,envMapCubeUVHeight:X,aoMap:ie,lightMap:ye,bumpMap:Kt,normalMap:Ce,displacementMap:sn,emissiveMap:Dn,normalMapObjectSpace:Ce&&_.normalMapType===$S,normalMapTangentSpace:Ce&&_.normalMapType===Dg,packedNormalMap:Ce&&_.normalMapType===Dg&&r2(_.normalMap.format),metalnessMap:Le,roughnessMap:Ge,anisotropy:U,anisotropyMap:q,clearcoat:gn,clearcoatMap:at,clearcoatNormalMap:ot,clearcoatRoughnessMap:Z,dispersion:ce,retroreflection:w,iridescence:v,iridescenceMap:j,iridescenceThicknessMap:lt,sheen:P,sheenColorMap:At,sheenRoughnessMap:ft,specularMap:ct,specularColorMap:wt,specularIntensityMap:Dt,transmission:V,transmissionMap:Bt,thicknessMap:L,gradientMap:ut,opaque:_.transparent===!1&&_.blending===Mo&&_.alphaToCoverage===!1,alphaMap:J,alphaTest:ht,alphaHash:yt,combine:_.combine,mapUv:Ht&&m(_.map.channel),aoMapUv:ie&&m(_.aoMap.channel),lightMapUv:ye&&m(_.lightMap.channel),bumpMapUv:Kt&&m(_.bumpMap.channel),normalMapUv:Ce&&m(_.normalMap.channel),displacementMapUv:sn&&m(_.displacementMap.channel),emissiveMapUv:Dn&&m(_.emissiveMap.channel),metalnessMapUv:Le&&m(_.metalnessMap.channel),roughnessMapUv:Ge&&m(_.roughnessMap.channel),anisotropyMapUv:q&&m(_.anisotropyMap.channel),clearcoatMapUv:at&&m(_.clearcoatMap.channel),clearcoatNormalMapUv:ot&&m(_.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Z&&m(_.clearcoatRoughnessMap.channel),iridescenceMapUv:j&&m(_.iridescenceMap.channel),iridescenceThicknessMapUv:lt&&m(_.iridescenceThicknessMap.channel),sheenColorMapUv:At&&m(_.sheenColorMap.channel),sheenRoughnessMapUv:ft&&m(_.sheenRoughnessMap.channel),specularMapUv:ct&&m(_.specularMap.channel),specularColorMapUv:wt&&m(_.specularColorMap.channel),specularIntensityMapUv:Dt&&m(_.specularIntensityMap.channel),transmissionMapUv:Bt&&m(_.transmissionMap.channel),thicknessMapUv:L&&m(_.thicknessMap.channel),alphaMapUv:J&&m(_.alphaMap.channel),vertexTangents:!!k.attributes.tangent&&(Ce||U),vertexNormals:!!k.attributes.normal,vertexColors:_.vertexColors,vertexAlphas:_.vertexColors===!0&&!!k.attributes.color&&k.attributes.color.itemSize===4,pointsUvs:F.isPoints===!0&&!!k.attributes.uv&&(Ht||J),fog:!!O,useFog:_.fog===!0,fogExp2:!!O&&O.isFogExp2,flatShading:_.wireframe===!1&&(_.flatShading===!0||k.attributes.normal===void 0&&Ce===!1&&(_.isMeshLambertMaterial||_.isMeshPhongMaterial||_.isMeshStandardMaterial||_.isMeshPhysicalMaterial)),sizeAttenuation:_.sizeAttenuation===!0,logarithmicDepthBuffer:p,reversedDepthBuffer:St,skinning:F.isSkinnedMesh===!0,hasPositionAttribute:k.attributes.position!==void 0,morphTargets:k.morphAttributes.position!==void 0,morphNormals:k.morphAttributes.normal!==void 0,morphColors:k.morphAttributes.color!==void 0,morphTargetsCount:st,morphTextureStride:gt,numSunLights:A.sun.length,numDirLights:A.directional.length,numPointLights:A.point.length,numSpotLights:A.spot.length,numSpotLightMaps:A.spotLightMap.length,numRectAreaLights:A.rectArea.length,numHemiLights:A.hemi.length,numSunLightShadows:A.sunShadowMap.length,numDirLightShadows:A.directionalShadowMap.length,numPointLightShadows:A.pointShadowMap.length,numSpotLightShadows:A.spotShadowMap.length,numSpotLightShadowsWithMaps:A.numSpotLightShadowsWithMaps,numLightProbes:A.numLightProbes,numLightProbeGrids:D.length,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:_.dithering,shadowMapEnabled:e.shadowMap.enabled&&R.length>0,shadowMapType:e.shadowMap.type,toneMapping:Ct,decodeVideoTexture:Ht&&_.map.isVideoTexture===!0&&Qt.getTransfer(_.map.colorSpace)===le,decodeVideoTextureEmissive:Dn&&_.emissiveMap.isVideoTexture===!0&&Qt.getTransfer(_.emissiveMap.colorSpace)===le,premultipliedAlpha:_.premultipliedAlpha,doubleSided:_.side===_i,flipSided:_.side===Cn,useDepthPacking:_.depthPacking>=0,depthPacking:_.depthPacking||0,index0AttributeName:_.index0AttributeName,extensionClipCullDistance:nt&&_.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(nt&&_.extensions.multiDraw===!0||xt)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:_.customProgramCacheKey()};return Et.vertexUv1s=l.has(1),Et.vertexUv2s=l.has(2),Et.vertexUv3s=l.has(3),l.clear(),Et}function g(_){let A=[];if(_.shaderID?A.push(_.shaderID):(A.push(_.customVertexShaderID),A.push(_.customFragmentShaderID)),_.defines!==void 0)for(let R in _.defines)A.push(R),A.push(_.defines[R]);return _.isRawShaderMaterial===!1&&(f(A,_),y(A,_),A.push(e.outputColorSpace)),A.push(_.customProgramCacheKey),A.join()}function f(_,A){_.push(A.precision),_.push(A.outputColorSpace),_.push(A.envMapMode),_.push(A.envMapCubeUVHeight),_.push(A.mapUv),_.push(A.alphaMapUv),_.push(A.lightMapUv),_.push(A.aoMapUv),_.push(A.bumpMapUv),_.push(A.normalMapUv),_.push(A.displacementMapUv),_.push(A.emissiveMapUv),_.push(A.metalnessMapUv),_.push(A.roughnessMapUv),_.push(A.anisotropyMapUv),_.push(A.clearcoatMapUv),_.push(A.clearcoatNormalMapUv),_.push(A.clearcoatRoughnessMapUv),_.push(A.iridescenceMapUv),_.push(A.iridescenceThicknessMapUv),_.push(A.sheenColorMapUv),_.push(A.sheenRoughnessMapUv),_.push(A.specularMapUv),_.push(A.specularColorMapUv),_.push(A.specularIntensityMapUv),_.push(A.transmissionMapUv),_.push(A.thicknessMapUv),_.push(A.combine),_.push(A.fogExp2),_.push(A.sizeAttenuation),_.push(A.morphTargetsCount),_.push(A.morphAttributeCount),_.push(A.numSunLights),_.push(A.numDirLights),_.push(A.numPointLights),_.push(A.numSpotLights),_.push(A.numSpotLightMaps),_.push(A.numHemiLights),_.push(A.numRectAreaLights),_.push(A.numSunLightShadows),_.push(A.numDirLightShadows),_.push(A.numPointLightShadows),_.push(A.numSpotLightShadows),_.push(A.numSpotLightShadowsWithMaps),_.push(A.numLightProbes),_.push(A.shadowMapType),_.push(A.toneMapping),_.push(A.numClippingPlanes),_.push(A.numClipIntersection),_.push(A.depthPacking)}function y(_,A){r.disableAll(),A.instancing&&r.enable(0),A.instancingColor&&r.enable(1),A.instancingMorph&&r.enable(2),A.matcap&&r.enable(3),A.envMap&&r.enable(4),A.normalMapObjectSpace&&r.enable(5),A.normalMapTangentSpace&&r.enable(6),A.clearcoat&&r.enable(7),A.iridescence&&r.enable(8),A.alphaTest&&r.enable(9),A.vertexColors&&r.enable(10),A.vertexAlphas&&r.enable(11),A.vertexUv1s&&r.enable(12),A.vertexUv2s&&r.enable(13),A.vertexUv3s&&r.enable(14),A.vertexTangents&&r.enable(15),A.anisotropy&&r.enable(16),A.alphaHash&&r.enable(17),A.batching&&r.enable(18),A.dispersion&&r.enable(19),A.retroreflection&&r.enable(24),A.batchingColor&&r.enable(20),A.gradientMap&&r.enable(21),A.packedNormalMap&&r.enable(22),A.vertexNormals&&r.enable(23),_.push(r.mask),r.disableAll(),A.fog&&r.enable(0),A.useFog&&r.enable(1),A.flatShading&&r.enable(2),A.logarithmicDepthBuffer&&r.enable(3),A.reversedDepthBuffer&&r.enable(4),A.skinning&&r.enable(5),A.morphTargets&&r.enable(6),A.morphNormals&&r.enable(7),A.morphColors&&r.enable(8),A.premultipliedAlpha&&r.enable(9),A.shadowMapEnabled&&r.enable(10),A.doubleSided&&r.enable(11),A.flipSided&&r.enable(12),A.useDepthPacking&&r.enable(13),A.dithering&&r.enable(14),A.transmission&&r.enable(15),A.sheen&&r.enable(16),A.opaque&&r.enable(17),A.pointsUvs&&r.enable(18),A.decodeVideoTexture&&r.enable(19),A.decodeVideoTextureEmissive&&r.enable(20),A.alphaToCoverage&&r.enable(21),A.numLightProbeGrids>0&&r.enable(22),A.hasPositionAttribute&&r.enable(23),_.push(r.mask)}function M(_){let A=d[_.type],R;if(A){let I=is[A];R=db.clone(I.uniforms)}else R=_.uniforms;return R}function x(_,A){let R=u.get(A);return R!==void 0?++R.usedTimes:(R=new s2(e,A,_,s),c.push(R),u.set(A,R)),R}function E(_){if(--_.usedTimes===0){let A=c.indexOf(_);c[A]=c[c.length-1],c.pop(),u.delete(_.cacheKey),_.destroy()}}function T(_){o.remove(_)}function C(){o.dispose()}return{getParameters:b,getProgramCacheKey:g,getUniforms:M,acquireProgram:x,releaseProgram:E,releaseShaderCache:T,programs:c,dispose:C}}function l2(){let e=new WeakMap;function t(r){return e.has(r)}function n(r){let o=e.get(r);return o===void 0&&(o={},e.set(r,o)),o}function i(r){e.delete(r)}function s(r,o,l){e.get(r)[o]=l}function a(){e=new WeakMap}return{has:t,get:n,remove:i,update:s,dispose:a}}function c2(e,t){return e.groupOrder!==t.groupOrder?e.groupOrder-t.groupOrder:e.renderOrder!==t.renderOrder?e.renderOrder-t.renderOrder:e.material.id!==t.material.id?e.material.id-t.material.id:e.materialVariant!==t.materialVariant?e.materialVariant-t.materialVariant:e.z!==t.z?e.z-t.z:e.id-t.id}function Ub(e,t){return e.groupOrder!==t.groupOrder?e.groupOrder-t.groupOrder:e.renderOrder!==t.renderOrder?e.renderOrder-t.renderOrder:e.z!==t.z?t.z-e.z:e.id-t.id}function Ob(){let e=[],t=0,n=[],i=[],s=[];function a(){t=0,n.length=0,i.length=0,s.length=0}function r(h){let d=0;return h.isInstancedMesh&&(d+=2),h.isSkinnedMesh&&(d+=1),d}function o(h,d,m,b,g,f){let y=e[t];return y===void 0?(y={id:h.id,object:h,geometry:d,material:m,materialVariant:r(h),groupOrder:b,renderOrder:h.renderOrder,z:g,group:f},e[t]=y):(y.id=h.id,y.object=h,y.geometry=d,y.material=m,y.materialVariant=r(h),y.groupOrder=b,y.renderOrder=h.renderOrder,y.z=g,y.group=f),t++,y}function l(h,d,m,b,g,f,y){y.reversedDepth===!0&&(g=-g);let M=o(h,d,m,b,g,f);m.transmission>0?i.push(M):m.transparent===!0?s.push(M):n.push(M)}function c(h,d,m,b,g,f){let y=o(h,d,m,b,g,f);m.transmission>0?i.unshift(y):m.transparent===!0?s.unshift(y):n.unshift(y)}function u(h,d){n.length>1&&n.sort(h||c2),i.length>1&&i.sort(d||Ub),s.length>1&&s.sort(d||Ub)}function p(){for(let h=t,d=e.length;h<d;h++){let m=e[h];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:n,transmissive:i,transparent:s,init:a,push:l,unshift:c,finish:p,sort:u}}function u2(){let e=new WeakMap;function t(i,s){let a=e.get(i),r;return a===void 0?(r=new Ob,e.set(i,[r])):s>=a.length?(r=new Ob,a.push(r)):r=a[s],r}function n(){e=new WeakMap}return{get:t,dispose:n}}function h2(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case"SunLight":case"DirectionalLight":n={direction:new H,color:new ne};break;case"SpotLight":n={position:new H,direction:new H,color:new ne,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":n={position:new H,color:new ne,distance:0,decay:0};break;case"HemisphereLight":n={direction:new H,skyColor:new ne,groundColor:new ne};break;case"RectAreaLight":n={color:new ne,position:new H,halfWidth:new H,halfHeight:new H};break}return e[t.id]=n,n}}}function f2(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case"SunLight":case"DirectionalLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ee};break;case"SpotLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ee};break;case"PointLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ee,shadowCameraNear:1,shadowCameraFar:1e3};break}return e[t.id]=n,n}}}var d2=0;function p2(e,t){return(t.castShadow?2:0)-(e.castShadow?2:0)+(t.map?1:0)-(e.map?1:0)}function m2(e){let t=new h2,n=f2(),i={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new H);let s=new H,a=new He,r=new He;function o(c){let u=0,p=0,h=0;for(let F=0;F<9;F++)i.probe[F].set(0,0,0);let d=0,m=0,b=0,g=0,f=0,y=0,M=0,x=0,E=0,T=0,C=0,_=0,A=0,R=0;c.sort(p2);for(let F=0,D=c.length;F<D;F++){let O=c[F],k=O.color,K=O.intensity,Y=O.distance,it=null;if(O.shadow&&O.shadow.map&&(O.shadow.map.texture.format===Aa?it=O.shadow.map.texture:it=O.shadow.map.depthTexture||O.shadow.map.texture),O.isAmbientLight)u+=k.r*K,p+=k.g*K,h+=k.b*K;else if(O.isLightProbe){for(let X=0;X<9;X++)i.probe[X].addScaledVector(O.sh.coefficients[X],K);R++}else if(O.isSunLight){let X=t.get(O);if(X.color.copy(O.color).multiplyScalar(O.intensity),O.castShadow){let tt=O.shadow,et=n.get(O);et.shadowIntensity=tt.intensity,et.shadowBias=tt.bias,et.shadowNormalBias=tt.normalBias,et.shadowRadius=tt.radius,et.shadowMapSize.copy(tt.mapSize).multiply(tt.getFrameExtents()),i.sunShadow[m]=et,i.sunShadowMap[m]=it;let st=tt.getViewportCount();for(let gt=0;gt<st;gt++)i.sunShadowMatrix[b+gt]=tt.getMatrix(gt),i.sunShadowCascade[b+gt]=tt._cascadeData[gt];b+=st,m++}i.sun[d]=X,d++}else if(O.isDirectionalLight){let X=t.get(O);if(X.color.copy(O.color).multiplyScalar(O.intensity),O.castShadow){let tt=O.shadow,et=n.get(O);et.shadowIntensity=tt.intensity,et.shadowBias=tt.bias,et.shadowNormalBias=tt.normalBias,et.shadowRadius=tt.radius,et.shadowMapSize=tt.mapSize,i.directionalShadow[g]=et,i.directionalShadowMap[g]=it,i.directionalShadowMatrix[g]=O.shadow.matrix,E++}i.directional[g]=X,g++}else if(O.isSpotLight){let X=t.get(O);X.position.setFromMatrixPosition(O.matrixWorld),X.color.copy(k).multiplyScalar(K),X.distance=Y,X.coneCos=Math.cos(O.angle),X.penumbraCos=Math.cos(O.angle*(1-O.penumbra)),X.decay=O.decay,i.spot[y]=X;let tt=O.shadow;if(O.map&&(i.spotLightMap[_]=O.map,_++,tt.updateMatrices(O),O.castShadow&&A++),i.spotLightMatrix[y]=tt.matrix,O.castShadow){let et=n.get(O);et.shadowIntensity=tt.intensity,et.shadowBias=tt.bias,et.shadowNormalBias=tt.normalBias,et.shadowRadius=tt.radius,et.shadowMapSize=tt.mapSize,i.spotShadow[y]=et,i.spotShadowMap[y]=it,C++}y++}else if(O.isRectAreaLight){let X=t.get(O);X.color.copy(k).multiplyScalar(K),X.halfWidth.set(O.width*.5,0,0),X.halfHeight.set(0,O.height*.5,0),i.rectArea[M]=X,M++}else if(O.isPointLight){let X=t.get(O);if(X.color.copy(O.color).multiplyScalar(O.intensity),X.distance=O.distance,X.decay=O.decay,O.castShadow){let tt=O.shadow,et=n.get(O);et.shadowIntensity=tt.intensity,et.shadowBias=tt.bias,et.shadowNormalBias=tt.normalBias,et.shadowRadius=tt.radius,et.shadowMapSize=tt.mapSize,et.shadowCameraNear=tt.camera.near,et.shadowCameraFar=tt.camera.far,i.pointShadow[f]=et,i.pointShadowMap[f]=it,i.pointShadowMatrix[f]=O.shadow.matrix,T++}i.point[f]=X,f++}else if(O.isHemisphereLight){let X=t.get(O);X.skyColor.copy(O.color).multiplyScalar(K),X.groundColor.copy(O.groundColor).multiplyScalar(K),i.hemi[x]=X,x++}}M>0&&(e.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=dt.LTC_FLOAT_1,i.rectAreaLTC2=dt.LTC_FLOAT_2):(i.rectAreaLTC1=dt.LTC_HALF_1,i.rectAreaLTC2=dt.LTC_HALF_2)),i.ambient[0]=u,i.ambient[1]=p,i.ambient[2]=h;let I=i.hash;(I.sunLength!==d||I.directionalLength!==g||I.pointLength!==f||I.spotLength!==y||I.rectAreaLength!==M||I.hemiLength!==x||I.numSunShadows!==m||I.numDirectionalShadows!==E||I.numPointShadows!==T||I.numSpotShadows!==C||I.numSpotMaps!==_||I.numLightProbes!==R)&&(i.sun.length=d,i.directional.length=g,i.spot.length=y,i.rectArea.length=M,i.point.length=f,i.hemi.length=x,i.sunShadow.length=m,i.sunShadowMap.length=m,i.sunShadowMatrix.length=b,i.sunShadowCascade.length=b,i.directionalShadow.length=E,i.directionalShadowMap.length=E,i.directionalShadowMatrix.length=E,i.pointShadow.length=T,i.pointShadowMap.length=T,i.pointShadowMatrix.length=T,i.spotShadow.length=C,i.spotShadowMap.length=C,i.spotLightMatrix.length=C+_-A,i.spotLightMap.length=_,i.numSpotLightShadowsWithMaps=A,i.numLightProbes=R,I.sunLength=d,I.directionalLength=g,I.pointLength=f,I.spotLength=y,I.rectAreaLength=M,I.hemiLength=x,I.numSunShadows=m,I.numDirectionalShadows=E,I.numPointShadows=T,I.numSpotShadows=C,I.numSpotMaps=_,I.numLightProbes=R,i.version=d2++)}function l(c,u){let p=0,h=0,d=0,m=0,b=0,g=0,f=u.matrixWorldInverse;for(let y=0,M=c.length;y<M;y++){let x=c[y];if(x.isSunLight){let E=i.sun[p];E.direction.setFromMatrixPosition(x.matrixWorld),E.direction.transformDirection(f),p++}else if(x.isDirectionalLight){let E=i.directional[h];E.direction.setFromMatrixPosition(x.matrixWorld),s.setFromMatrixPosition(x.target.matrixWorld),E.direction.sub(s),E.direction.transformDirection(f),h++}else if(x.isSpotLight){let E=i.spot[m];E.position.setFromMatrixPosition(x.matrixWorld),E.position.applyMatrix4(f),E.direction.setFromMatrixPosition(x.matrixWorld),s.setFromMatrixPosition(x.target.matrixWorld),E.direction.sub(s),E.direction.transformDirection(f),m++}else if(x.isRectAreaLight){let E=i.rectArea[b];E.position.setFromMatrixPosition(x.matrixWorld),E.position.applyMatrix4(f),r.identity(),a.copy(x.matrixWorld),a.premultiply(f),r.extractRotation(a),E.halfWidth.set(x.width*.5,0,0),E.halfHeight.set(0,x.height*.5,0),E.halfWidth.applyMatrix4(r),E.halfHeight.applyMatrix4(r),b++}else if(x.isPointLight){let E=i.point[d];E.position.setFromMatrixPosition(x.matrixWorld),E.position.applyMatrix4(f),d++}else if(x.isHemisphereLight){let E=i.hemi[g];E.direction.setFromMatrixPosition(x.matrixWorld),E.direction.transformDirection(f),g++}}}return{setup:o,setupView:l,state:i}}function Ib(e){let t=new m2(e),n=[],i=[],s=[];function a(h){p.camera=h,n.length=0,i.length=0,s.length=0}function r(h){n.push(h)}function o(h){i.push(h)}function l(h){s.push(h)}function c(){t.setup(n)}function u(h){t.setupView(n,h)}let p={lightsArray:n,shadowsArray:i,lightProbeGridArray:s,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:a,state:p,setupLights:c,setupLightsView:u,pushLight:r,pushShadow:o,pushLightProbeGrid:l}}function g2(e){let t=new WeakMap;function n(s,a=0){let r=t.get(s),o;return r===void 0?(o=new Ib(e),t.set(s,[o])):a>=r.length?(o=new Ib(e),r.push(o)):o=r[a],o}function i(){t=new WeakMap}return{get:n,dispose:i}}var y2=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,v2=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,x2=[new H(1,0,0),new H(-1,0,0),new H(0,1,0),new H(0,-1,0),new H(0,0,1),new H(0,0,-1)],_2=[new H(0,-1,0),new H(0,-1,0),new H(0,0,1),new H(0,0,-1),new H(0,-1,0),new H(0,-1,0)],Pb=new He,cc=new H,kg=new H;function S2(e,t,n){let i=new ql,s=new ee,a=new ee,r=new Ue,o=new Oh,l=new Ih,c={},u=n.maxTextureSize,p={[ba]:Cn,[Cn]:ba,[_i]:_i},h=new ei({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ee},radius:{value:4}},vertexShader:y2,fragmentShader:v2}),d=h.clone();d.defines.HORIZONTAL_PASS=1;let m=new kn;m.setAttribute("position",new yi(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let b=new tn(m,h),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=jl;let f=this.type;this.render=function(T,C,_){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||T.length===0)return;this.type===DS&&(Nt("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=jl);let A=e.getRenderTarget(),R=e.getActiveCubeFace(),I=e.getActiveMipmapLevel(),F=e.state;F.setBlending(es),F.buffers.depth.getReversed()===!0?F.buffers.color.setClear(0,0,0,0):F.buffers.color.setClear(1,1,1,1),F.buffers.depth.setTest(!0),F.setScissorTest(!1);let D=f!==this.type;D&&C.traverse(function(O){O.material&&(Array.isArray(O.material)?O.material.forEach(k=>k.needsUpdate=!0):O.material.needsUpdate=!0)});for(let O=0,k=T.length;O<k;O++){let K=T[O],Y=K.shadow;if(Y===void 0){Nt("WebGLShadowMap:",K,"has no shadow.");continue}if(Y.autoUpdate===!1&&Y.needsUpdate===!1)continue;s.copy(Y.mapSize);let it=Y.getFrameExtents();s.multiply(it),a.copy(Y.mapSize),(s.x>u||s.y>u)&&(s.x>u&&(a.x=Math.floor(u/it.x),s.x=a.x*it.x,Y.mapSize.x=a.x),s.y>u&&(a.y=Math.floor(u/it.y),s.y=a.y*it.y,Y.mapSize.y=a.y));let X=e.state.buffers.depth.getReversed();if(Y.camera._reversedDepth=X,Y.map===null||D===!0){if(Y.map!==null&&(Y.map.depthTexture!==null&&(Y.map.depthTexture.dispose(),Y.map.depthTexture=null),Y.map.dispose()),this.type===bo){if(K.isPointLight){Nt("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}Y.map=new Hn(s.x,s.y,{format:Aa,type:Bi,minFilter:mn,magFilter:mn,generateMipmaps:!1}),Y.map.texture.name=K.name+".shadowMap",Y.map.depthTexture=new ya(s.x,s.y,Pi),Y.map.depthTexture.name=K.name+".shadowMapDepth",Y.map.depthTexture.format=ji,Y.map.depthTexture.compareFunction=null,Y.map.depthTexture.minFilter=ke,Y.map.depthTexture.magFilter=ke}else K.isPointLight?(Y.map=new Ff(s.x),Y.map.depthTexture=new Lh(s.x,Ii)):(Y.map=new Hn(s.x,s.y),Y.map.depthTexture=new ya(s.x,s.y,Ii)),Y.map.depthTexture.name=K.name+".shadowMap",Y.map.depthTexture.format=ji,this.type===jl?(Y.map.depthTexture.compareFunction=X?If:Of,Y.map.depthTexture.minFilter=mn,Y.map.depthTexture.magFilter=mn):(Y.map.depthTexture.compareFunction=null,Y.map.depthTexture.minFilter=ke,Y.map.depthTexture.magFilter=ke);Y.camera.updateProjectionMatrix()}Y.map.isWebGLCubeRenderTarget!==!0&&(Y.map.width!==s.x||Y.map.height!==s.y)&&Y.map.setSize(s.x,s.y);let tt=Y.map.isWebGLCubeRenderTarget?6:Y.getViewportCount();K.isPointLight!==!0&&Y.updateMatrices(K,_);for(let et=0;et<tt;et++){let st=Y.getCamera(et);if(K.isPointLight){let gt=Y.camera,Yt=Y.matrix,Rt=K.distance||gt.far;Rt!==gt.far&&(gt.far=Rt,gt.updateProjectionMatrix()),cc.setFromMatrixPosition(K.matrixWorld),gt.position.copy(cc),kg.copy(gt.position),kg.add(x2[et]),gt.up.copy(_2[et]),gt.lookAt(kg),gt.updateMatrixWorld(),Yt.makeTranslation(-cc.x,-cc.y,-cc.z),Pb.multiplyMatrices(gt.projectionMatrix,gt.matrixWorldInverse),Y._frustum.setFromProjectionMatrix(Pb,gt.coordinateSystem,gt.reversedDepth)}if(Y.map.isWebGLCubeRenderTarget)e.setRenderTarget(Y.map,et),e.clear();else{et===0&&(e.setRenderTarget(Y.map),e.clear());let gt=Y.getViewport(et);r.set(a.x*gt.x,a.y*gt.y,a.x*gt.z,a.y*gt.w),F.viewport(r)}i=Y.getFrustum(et),x(C,_,st,K,this.type)}Y.isPointLightShadow!==!0&&this.type===bo&&y(Y,_),Y.needsUpdate=!1}f=this.type,g.needsUpdate=!1,e.setRenderTarget(A,R,I)};function y(T,C){let _=t.update(b);h.defines.VSM_SAMPLES!==T.blurSamples&&(h.defines.VSM_SAMPLES=T.blurSamples,d.defines.VSM_SAMPLES=T.blurSamples,h.needsUpdate=!0,d.needsUpdate=!0),T.mapPass===null?T.mapPass=new Hn(s.x,s.y,{format:Aa,type:Bi}):(T.mapPass.width!==T.map.width||T.mapPass.height!==T.map.height)&&T.mapPass.setSize(T.map.width,T.map.height),h.uniforms.shadow_pass.value=T.map.depthTexture,h.uniforms.resolution.value.set(T.map.width,T.map.height),h.uniforms.radius.value=T.radius,e.setRenderTarget(T.mapPass),e.clear(),e.renderBufferDirect(C,null,_,h,b,null),d.uniforms.shadow_pass.value=T.mapPass.texture,d.uniforms.resolution.value.set(T.map.width,T.map.height),d.uniforms.radius.value=T.radius,e.setRenderTarget(T.map),e.clear(),e.renderBufferDirect(C,null,_,d,b,null)}function M(T,C,_,A){let R=null,I=_.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(I!==void 0)R=I;else if(R=_.isPointLight===!0?l:o,e.localClippingEnabled&&C.clipShadows===!0&&Array.isArray(C.clippingPlanes)&&C.clippingPlanes.length!==0||C.displacementMap&&C.displacementScale!==0||C.alphaMap&&C.alphaTest>0||C.map&&C.alphaTest>0||C.alphaToCoverage===!0){let F=R.uuid,D=C.uuid,O=c[F];O===void 0&&(O={},c[F]=O);let k=O[D];k===void 0&&(k=R.clone(),O[D]=k,C.addEventListener("dispose",E)),R=k}if(R.visible=C.visible,R.wireframe=C.wireframe,A===bo?R.side=C.shadowSide!==null?C.shadowSide:C.side:R.side=C.shadowSide!==null?C.shadowSide:p[C.side],R.alphaMap=C.alphaMap,R.alphaTest=C.alphaToCoverage===!0?.5:C.alphaTest,R.map=C.map,R.clipShadows=C.clipShadows,R.clippingPlanes=C.clippingPlanes,R.clipIntersection=C.clipIntersection,R.displacementMap=C.displacementMap,R.displacementScale=C.displacementScale,R.displacementBias=C.displacementBias,R.wireframeLinewidth=C.wireframeLinewidth,R.linewidth=C.linewidth,_.isPointLight===!0&&R.isMeshDistanceMaterial===!0){let F=e.properties.get(R);F.light=_}return R}function x(T,C,_,A,R){if(T.visible===!1)return;if(T.layers.test(C.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&R===bo)&&(!T.frustumCulled||T.intersectsFrustum(i))){T.modelViewMatrix.multiplyMatrices(_.matrixWorldInverse,T.matrixWorld);let D=t.update(T),O=T.material;if(Array.isArray(O)){let k=D.groups;for(let K=0,Y=k.length;K<Y;K++){let it=k[K],X=O[it.materialIndex];if(X&&X.visible){let tt=M(T,X,A,R);T.onBeforeShadow(e,T,C,_,D,tt,it),e.renderBufferDirect(_,null,D,tt,T,it),T.onAfterShadow(e,T,C,_,D,tt,it)}}}else if(O.visible){let k=M(T,O,A,R);T.onBeforeShadow(e,T,C,_,D,k,null),e.renderBufferDirect(_,null,D,k,T,null),T.onAfterShadow(e,T,C,_,D,k,null)}}let F=T.children;for(let D=0,O=F.length;D<O;D++)x(F[D],C,_,A,R)}function E(T){T.target.removeEventListener("dispose",E);for(let _ in c){let A=c[_],R=T.target.uuid;R in A&&(A[R].dispose(),delete A[R])}}}function b2(e,t){function n(){let L=!1,ut=new Ue,J=null,ht=new Ue(0,0,0,0);return{setMask:function(yt){J!==yt&&!L&&(e.colorMask(yt,yt,yt,yt),J=yt)},setLocked:function(yt){L=yt},setClear:function(yt,nt,Ct,Et,ve){ve===!0&&(yt*=Et,nt*=Et,Ct*=Et),ut.set(yt,nt,Ct,Et),ht.equals(ut)===!1&&(e.clearColor(yt,nt,Ct,Et),ht.copy(ut))},reset:function(){L=!1,J=null,ht.set(-1,0,0,0)}}}function i(){let L=!1,ut=!1,J=null,ht=null,yt=null;return{setReversed:function(nt){if(ut!==nt){let Ct=t.get("EXT_clip_control");nt?Ct.clipControlEXT(Ct.LOWER_LEFT_EXT,Ct.ZERO_TO_ONE_EXT):Ct.clipControlEXT(Ct.LOWER_LEFT_EXT,Ct.NEGATIVE_ONE_TO_ONE_EXT),ut=nt;let Et=yt;yt=null,this.setClear(Et)}},getReversed:function(){return ut},setTest:function(nt){nt?Q(e.DEPTH_TEST):St(e.DEPTH_TEST)},setMask:function(nt){J!==nt&&!L&&(e.depthMask(nt),J=nt)},setFunc:function(nt){if(ut&&(nt=hb[nt]),ht!==nt){switch(nt){case gh:e.depthFunc(e.NEVER);break;case yh:e.depthFunc(e.ALWAYS);break;case vh:e.depthFunc(e.LESS);break;case go:e.depthFunc(e.LEQUAL);break;case xh:e.depthFunc(e.EQUAL);break;case _h:e.depthFunc(e.GEQUAL);break;case Sh:e.depthFunc(e.GREATER);break;case bh:e.depthFunc(e.NOTEQUAL);break;default:e.depthFunc(e.LEQUAL)}ht=nt}},setLocked:function(nt){L=nt},setClear:function(nt){yt!==nt&&(yt=nt,ut&&(nt=1-nt),e.clearDepth(nt))},reset:function(){L=!1,J=null,ht=null,yt=null,ut=!1}}}function s(){let L=!1,ut=null,J=null,ht=null,yt=null,nt=null,Ct=null,Et=null,ve=null;return{setTest:function(re){L||(re?Q(e.STENCIL_TEST):St(e.STENCIL_TEST))},setMask:function(re){ut!==re&&!L&&(e.stencilMask(re),ut=re)},setFunc:function(re,bi,Fi){(J!==re||ht!==bi||yt!==Fi)&&(e.stencilFunc(re,bi,Fi),J=re,ht=bi,yt=Fi)},setOp:function(re,bi,Fi){(nt!==re||Ct!==bi||Et!==Fi)&&(e.stencilOp(re,bi,Fi),nt=re,Ct=bi,Et=Fi)},setLocked:function(re){L=re},setClear:function(re){ve!==re&&(e.clearStencil(re),ve=re)},reset:function(){L=!1,ut=null,J=null,ht=null,yt=null,nt=null,Ct=null,Et=null,ve=null}}}let a=new n,r=new i,o=new s,l=new WeakMap,c=new WeakMap,u={},p={},h={},d=new WeakMap,m=[],b=null,g=!1,f=null,y=null,M=null,x=null,E=null,T=null,C=null,_=new ne(0,0,0),A=0,R=!1,I=null,F=null,D=null,O=null,k=null,K=e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS),Y=!1,it=0,X=e.getParameter(e.VERSION);X.indexOf("WebGL")!==-1?(it=parseFloat(/^WebGL (\d)/.exec(X)[1]),Y=it>=1):X.indexOf("OpenGL ES")!==-1&&(it=parseFloat(/^OpenGL ES (\d)/.exec(X)[1]),Y=it>=2);let tt=null,et={},st=e.getParameter(e.SCISSOR_BOX),gt=e.getParameter(e.VIEWPORT),Yt=new Ue().fromArray(st),Rt=new Ue().fromArray(gt);function Zt(L,ut,J,ht){let yt=new Uint8Array(4),nt=e.createTexture();e.bindTexture(L,nt),e.texParameteri(L,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(L,e.TEXTURE_MAG_FILTER,e.NEAREST);for(let Ct=0;Ct<J;Ct++)L===e.TEXTURE_3D||L===e.TEXTURE_2D_ARRAY?e.texImage3D(ut,0,e.RGBA,1,1,ht,0,e.RGBA,e.UNSIGNED_BYTE,yt):e.texImage2D(ut+Ct,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,yt);return nt}let W={};W[e.TEXTURE_2D]=Zt(e.TEXTURE_2D,e.TEXTURE_2D,1),W[e.TEXTURE_CUBE_MAP]=Zt(e.TEXTURE_CUBE_MAP,e.TEXTURE_CUBE_MAP_POSITIVE_X,6),W[e.TEXTURE_2D_ARRAY]=Zt(e.TEXTURE_2D_ARRAY,e.TEXTURE_2D_ARRAY,1,1),W[e.TEXTURE_3D]=Zt(e.TEXTURE_3D,e.TEXTURE_3D,1,1),a.setClear(0,0,0,1),r.setClear(1),o.setClear(0),Q(e.DEPTH_TEST),r.setFunc(go),Kt(!1),Ce(lg),Q(e.CULL_FACE),ie(es);function Q(L){u[L]!==!0&&(e.enable(L),u[L]=!0)}function St(L){u[L]!==!1&&(e.disable(L),u[L]=!1)}function It(L,ut){return h[L]!==ut?(e.bindFramebuffer(L,ut),h[L]=ut,L===e.DRAW_FRAMEBUFFER&&(h[e.FRAMEBUFFER]=ut),L===e.FRAMEBUFFER&&(h[e.DRAW_FRAMEBUFFER]=ut),!0):!1}function xt(L,ut){let J=m,ht=!1;if(L){J=d.get(ut),J===void 0&&(J=[],d.set(ut,J));let yt=L.textures;if(J.length!==yt.length||J[0]!==e.COLOR_ATTACHMENT0){for(let nt=0,Ct=yt.length;nt<Ct;nt++)J[nt]=e.COLOR_ATTACHMENT0+nt;J.length=yt.length,ht=!0}}else J[0]!==e.BACK&&(J[0]=e.BACK,ht=!0);ht&&e.drawBuffers(J)}function Ht(L){return b!==L?(e.useProgram(L),b=L,!0):!1}let Je={[nr]:e.FUNC_ADD,[LS]:e.FUNC_SUBTRACT,[US]:e.FUNC_REVERSE_SUBTRACT};Je[OS]=e.MIN,Je[IS]=e.MAX;let Gt={[PS]:e.ZERO,[BS]:e.ONE,[zS]:e.SRC_COLOR,[fg]:e.SRC_ALPHA,[WS]:e.SRC_ALPHA_SATURATE,[kS]:e.DST_COLOR,[VS]:e.DST_ALPHA,[FS]:e.ONE_MINUS_SRC_COLOR,[dg]:e.ONE_MINUS_SRC_ALPHA,[GS]:e.ONE_MINUS_DST_COLOR,[HS]:e.ONE_MINUS_DST_ALPHA,[XS]:e.CONSTANT_COLOR,[qS]:e.ONE_MINUS_CONSTANT_COLOR,[YS]:e.CONSTANT_ALPHA,[ZS]:e.ONE_MINUS_CONSTANT_ALPHA};function ie(L,ut,J,ht,yt,nt,Ct,Et,ve,re){if(L===es){g===!0&&(St(e.BLEND),g=!1);return}if(g===!1&&(Q(e.BLEND),g=!0),L!==NS){if(L!==f||re!==R){if((y!==nr||E!==nr)&&(e.blendEquation(e.FUNC_ADD),y=nr,E=nr),re)switch(L){case Mo:e.blendFuncSeparate(e.ONE,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case cg:e.blendFunc(e.ONE,e.ONE);break;case ug:e.blendFuncSeparate(e.ZERO,e.ONE_MINUS_SRC_COLOR,e.ZERO,e.ONE);break;case hg:e.blendFuncSeparate(e.DST_COLOR,e.ONE_MINUS_SRC_ALPHA,e.ZERO,e.ONE);break;default:Ut("WebGLState: Invalid blending: ",L);break}else switch(L){case Mo:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case cg:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE,e.ONE,e.ONE);break;case ug:Ut("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case hg:Ut("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Ut("WebGLState: Invalid blending: ",L);break}M=null,x=null,T=null,C=null,_.set(0,0,0),A=0,f=L,R=re}return}yt=yt||ut,nt=nt||J,Ct=Ct||ht,(ut!==y||yt!==E)&&(e.blendEquationSeparate(Je[ut],Je[yt]),y=ut,E=yt),(J!==M||ht!==x||nt!==T||Ct!==C)&&(e.blendFuncSeparate(Gt[J],Gt[ht],Gt[nt],Gt[Ct]),M=J,x=ht,T=nt,C=Ct),(Et.equals(_)===!1||ve!==A)&&(e.blendColor(Et.r,Et.g,Et.b,ve),_.copy(Et),A=ve),f=L,R=!1}function ye(L,ut){L.side===_i?St(e.CULL_FACE):Q(e.CULL_FACE);let J=L.side===Cn;ut&&(J=!J),Kt(J),L.blending===Mo&&L.transparent===!1?ie(es):ie(L.blending,L.blendEquation,L.blendSrc,L.blendDst,L.blendEquationAlpha,L.blendSrcAlpha,L.blendDstAlpha,L.blendColor,L.blendAlpha,L.premultipliedAlpha),r.setFunc(L.depthFunc),r.setTest(L.depthTest),r.setMask(L.depthWrite),a.setMask(L.colorWrite);let ht=L.stencilWrite;o.setTest(ht),ht&&(o.setMask(L.stencilWriteMask),o.setFunc(L.stencilFunc,L.stencilRef,L.stencilFuncMask),o.setOp(L.stencilFail,L.stencilZFail,L.stencilZPass)),Dn(L.polygonOffset,L.polygonOffsetFactor,L.polygonOffsetUnits),L.alphaToCoverage===!0?Q(e.SAMPLE_ALPHA_TO_COVERAGE):St(e.SAMPLE_ALPHA_TO_COVERAGE)}function Kt(L){I!==L&&(L?e.frontFace(e.CW):e.frontFace(e.CCW),I=L)}function Ce(L){L!==CS?(Q(e.CULL_FACE),L!==F&&(L===lg?e.cullFace(e.BACK):L===RS?e.cullFace(e.FRONT):e.cullFace(e.FRONT_AND_BACK))):St(e.CULL_FACE),F=L}function sn(L){L!==D&&(Y&&e.lineWidth(L),D=L)}function Dn(L,ut,J){L?(Q(e.POLYGON_OFFSET_FILL),(O!==ut||k!==J)&&(O=ut,k=J,r.getReversed()&&(ut=-ut),e.polygonOffset(ut,J))):St(e.POLYGON_OFFSET_FILL)}function Le(L){L?Q(e.SCISSOR_TEST):St(e.SCISSOR_TEST)}function Ge(L){L===void 0&&(L=e.TEXTURE0+K-1),tt!==L&&(e.activeTexture(L),tt=L)}function U(L,ut,J){J===void 0&&(tt===null?J=e.TEXTURE0+K-1:J=tt);let ht=et[J];ht===void 0&&(ht={type:void 0,texture:void 0},et[J]=ht),(ht.type!==L||ht.texture!==ut)&&(tt!==J&&(e.activeTexture(J),tt=J),e.bindTexture(L,ut||W[L]),ht.type=L,ht.texture=ut)}function gn(){let L=et[tt];L!==void 0&&L.type!==void 0&&(e.bindTexture(L.type,null),L.type=void 0,L.texture=void 0)}function ce(){try{e.compressedTexImage2D(...arguments)}catch(L){Ut("WebGLState:",L)}}function w(){try{e.compressedTexImage3D(...arguments)}catch(L){Ut("WebGLState:",L)}}function v(){try{e.texSubImage2D(...arguments)}catch(L){Ut("WebGLState:",L)}}function P(){try{e.texSubImage3D(...arguments)}catch(L){Ut("WebGLState:",L)}}function V(){try{e.compressedTexSubImage2D(...arguments)}catch(L){Ut("WebGLState:",L)}}function q(){try{e.compressedTexSubImage3D(...arguments)}catch(L){Ut("WebGLState:",L)}}function at(){try{e.texStorage2D(...arguments)}catch(L){Ut("WebGLState:",L)}}function ot(){try{e.texStorage3D(...arguments)}catch(L){Ut("WebGLState:",L)}}function Z(){try{e.texImage2D(...arguments)}catch(L){Ut("WebGLState:",L)}}function j(){try{e.texImage3D(...arguments)}catch(L){Ut("WebGLState:",L)}}function lt(L){return p[L]!==void 0?p[L]:e.getParameter(L)}function At(L,ut){p[L]!==ut&&(e.pixelStorei(L,ut),p[L]=ut)}function ft(L){Yt.equals(L)===!1&&(e.scissor(L.x,L.y,L.z,L.w),Yt.copy(L))}function ct(L){Rt.equals(L)===!1&&(e.viewport(L.x,L.y,L.z,L.w),Rt.copy(L))}function wt(L,ut){let J=c.get(ut);J===void 0&&(J=new WeakMap,c.set(ut,J));let ht=J.get(L);ht===void 0&&(ht=e.getUniformBlockIndex(ut,L.name),J.set(L,ht))}function Dt(L,ut){let ht=c.get(ut).get(L);l.get(ut)!==ht&&(e.uniformBlockBinding(ut,ht,L.__bindingPointIndex),l.set(ut,ht))}function Bt(){e.disable(e.BLEND),e.disable(e.CULL_FACE),e.disable(e.DEPTH_TEST),e.disable(e.POLYGON_OFFSET_FILL),e.disable(e.SCISSOR_TEST),e.disable(e.STENCIL_TEST),e.disable(e.SAMPLE_ALPHA_TO_COVERAGE),e.blendEquation(e.FUNC_ADD),e.blendFunc(e.ONE,e.ZERO),e.blendFuncSeparate(e.ONE,e.ZERO,e.ONE,e.ZERO),e.blendColor(0,0,0,0),e.colorMask(!0,!0,!0,!0),e.clearColor(0,0,0,0),e.depthMask(!0),e.depthFunc(e.LESS),r.setReversed(!1),e.clearDepth(1),e.stencilMask(4294967295),e.stencilFunc(e.ALWAYS,0,4294967295),e.stencilOp(e.KEEP,e.KEEP,e.KEEP),e.clearStencil(0),e.cullFace(e.BACK),e.frontFace(e.CCW),e.polygonOffset(0,0),e.activeTexture(e.TEXTURE0),e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),e.bindFramebuffer(e.READ_FRAMEBUFFER,null),e.useProgram(null),e.lineWidth(1),e.scissor(0,0,e.canvas.width,e.canvas.height),e.viewport(0,0,e.canvas.width,e.canvas.height),e.pixelStorei(e.PACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!1),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,e.BROWSER_DEFAULT_WEBGL),e.pixelStorei(e.PACK_ROW_LENGTH,0),e.pixelStorei(e.PACK_SKIP_PIXELS,0),e.pixelStorei(e.PACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_ROW_LENGTH,0),e.pixelStorei(e.UNPACK_IMAGE_HEIGHT,0),e.pixelStorei(e.UNPACK_SKIP_PIXELS,0),e.pixelStorei(e.UNPACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_SKIP_IMAGES,0),u={},p={},tt=null,et={},h={},d=new WeakMap,m=[],b=null,g=!1,f=null,y=null,M=null,x=null,E=null,T=null,C=null,_=new ne(0,0,0),A=0,R=!1,I=null,F=null,D=null,O=null,k=null,Yt.set(0,0,e.canvas.width,e.canvas.height),Rt.set(0,0,e.canvas.width,e.canvas.height),a.reset(),r.reset(),o.reset()}return{buffers:{color:a,depth:r,stencil:o},enable:Q,disable:St,bindFramebuffer:It,drawBuffers:xt,useProgram:Ht,setBlending:ie,setMaterial:ye,setFlipSided:Kt,setCullFace:Ce,setLineWidth:sn,setPolygonOffset:Dn,setScissorTest:Le,activeTexture:Ge,bindTexture:U,unbindTexture:gn,compressedTexImage2D:ce,compressedTexImage3D:w,texImage2D:Z,texImage3D:j,pixelStorei:At,getParameter:lt,updateUBOMapping:wt,uniformBlockBinding:Dt,texStorage2D:at,texStorage3D:ot,texSubImage2D:v,texSubImage3D:P,compressedTexSubImage2D:V,compressedTexSubImage3D:q,scissor:ft,viewport:ct,reset:Bt}}function M2(e,t,n,i,s,a,r){let o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new ee,u=new WeakMap,p=new Set,h,d=new WeakMap,m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function b(w,v){return m?new OffscreenCanvas(w,v):Vl("canvas")}function g(w,v,P){let V=1,q=ce(w);if((q.width>P||q.height>P)&&(V=P/Math.max(q.width,q.height)),V<1)if(typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&w instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&w instanceof ImageBitmap||typeof VideoFrame<"u"&&w instanceof VideoFrame){let at=Math.floor(V*q.width),ot=Math.floor(V*q.height);h===void 0&&(h=b(at,ot));let Z=v?b(at,ot):h;return Z.width=at,Z.height=ot,Z.getContext("2d").drawImage(w,0,0,at,ot),Nt("WebGLRenderer: Texture has been resized from ("+q.width+"x"+q.height+") to ("+at+"x"+ot+")."),Z}else return"data"in w&&Nt("WebGLRenderer: Image in DataTexture is too big ("+q.width+"x"+q.height+")."),w;return w}function f(w){return w.generateMipmaps}function y(w){e.generateMipmap(w)}function M(w){return w.isWebGLCubeRenderTarget?e.TEXTURE_CUBE_MAP:w.isWebGL3DRenderTarget?e.TEXTURE_3D:w.isWebGLArrayRenderTarget||w.isCompressedArrayTexture?e.TEXTURE_2D_ARRAY:e.TEXTURE_2D}function x(w,v,P,V,q,at=!1){if(w!==null){if(e[w]!==void 0)return e[w];Nt("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+w+"'")}let ot;V&&(ot=t.get("EXT_texture_norm16"),ot||Nt("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let Z=v;if(v===e.RED&&(P===e.FLOAT&&(Z=e.R32F),P===e.HALF_FLOAT&&(Z=e.R16F),P===e.UNSIGNED_BYTE&&(Z=e.R8),P===e.UNSIGNED_SHORT&&ot&&(Z=ot.R16_EXT),P===e.SHORT&&ot&&(Z=ot.R16_SNORM_EXT)),v===e.RED_INTEGER&&(P===e.UNSIGNED_BYTE&&(Z=e.R8UI),P===e.UNSIGNED_SHORT&&(Z=e.R16UI),P===e.UNSIGNED_INT&&(Z=e.R32UI),P===e.BYTE&&(Z=e.R8I),P===e.SHORT&&(Z=e.R16I),P===e.INT&&(Z=e.R32I)),v===e.RG&&(P===e.FLOAT&&(Z=e.RG32F),P===e.HALF_FLOAT&&(Z=e.RG16F),P===e.UNSIGNED_BYTE&&(Z=e.RG8),P===e.UNSIGNED_SHORT&&ot&&(Z=ot.RG16_EXT),P===e.SHORT&&ot&&(Z=ot.RG16_SNORM_EXT)),v===e.RG_INTEGER&&(P===e.UNSIGNED_BYTE&&(Z=e.RG8UI),P===e.UNSIGNED_SHORT&&(Z=e.RG16UI),P===e.UNSIGNED_INT&&(Z=e.RG32UI),P===e.BYTE&&(Z=e.RG8I),P===e.SHORT&&(Z=e.RG16I),P===e.INT&&(Z=e.RG32I)),v===e.RGB_INTEGER&&(P===e.UNSIGNED_BYTE&&(Z=e.RGB8UI),P===e.UNSIGNED_SHORT&&(Z=e.RGB16UI),P===e.UNSIGNED_INT&&(Z=e.RGB32UI),P===e.BYTE&&(Z=e.RGB8I),P===e.SHORT&&(Z=e.RGB16I),P===e.INT&&(Z=e.RGB32I)),v===e.RGBA_INTEGER&&(P===e.UNSIGNED_BYTE&&(Z=e.RGBA8UI),P===e.UNSIGNED_SHORT&&(Z=e.RGBA16UI),P===e.UNSIGNED_INT&&(Z=e.RGBA32UI),P===e.BYTE&&(Z=e.RGBA8I),P===e.SHORT&&(Z=e.RGBA16I),P===e.INT&&(Z=e.RGBA32I)),v===e.RGB&&(P===e.UNSIGNED_SHORT&&ot&&(Z=ot.RGB16_EXT),P===e.SHORT&&ot&&(Z=ot.RGB16_SNORM_EXT),P===e.UNSIGNED_INT_5_9_9_9_REV&&(Z=e.RGB9_E5),P===e.UNSIGNED_INT_10F_11F_11F_REV&&(Z=e.R11F_G11F_B10F)),v===e.RGBA){let j=at?zl:Qt.getTransfer(q);P===e.FLOAT&&(Z=e.RGBA32F),P===e.HALF_FLOAT&&(Z=e.RGBA16F),P===e.UNSIGNED_BYTE&&(Z=j===le?e.SRGB8_ALPHA8:e.RGBA8),P===e.UNSIGNED_SHORT&&ot&&(Z=ot.RGBA16_EXT),P===e.SHORT&&ot&&(Z=ot.RGBA16_SNORM_EXT),P===e.UNSIGNED_SHORT_4_4_4_4&&(Z=e.RGBA4),P===e.UNSIGNED_SHORT_5_5_5_1&&(Z=e.RGB5_A1)}return(Z===e.R16F||Z===e.R32F||Z===e.RG16F||Z===e.RG32F||Z===e.RGBA16F||Z===e.RGBA32F)&&t.get("EXT_color_buffer_float"),Z}function E(w,v){let P;return w?v===null||v===Ii||v===To?P=e.DEPTH24_STENCIL8:v===Pi?P=e.DEPTH32F_STENCIL8:v===Eo&&(P=e.DEPTH24_STENCIL8,Nt("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):v===null||v===Ii||v===To?P=e.DEPTH_COMPONENT24:v===Pi?P=e.DEPTH_COMPONENT32F:v===Eo&&(P=e.DEPTH_COMPONENT16),P}function T(w,v){return f(w)===!0||w.isFramebufferTexture&&w.minFilter!==ke&&w.minFilter!==mn?Math.log2(Math.max(v.width,v.height))+1:w.mipmaps!==void 0&&w.mipmaps.length>0?w.mipmaps.length:w.isCompressedTexture&&Array.isArray(w.image)?v.mipmaps.length:1}function C(w){let v=w.target;v.removeEventListener("dispose",C),A(v),v.isVideoTexture&&u.delete(v),v.isHTMLTexture&&p.delete(v)}function _(w){let v=w.target;v.removeEventListener("dispose",_),I(v)}function A(w){let v=i.get(w);if(v.__webglInit===void 0)return;let P=w.source,V=d.get(P);if(V){let q=V[v.__cacheKey];q.usedTimes--,q.usedTimes===0&&R(w),Object.keys(V).length===0&&d.delete(P)}i.remove(w)}function R(w){let v=i.get(w);e.deleteTexture(v.__webglTexture);let P=w.source,V=d.get(P);delete V[v.__cacheKey],r.memory.textures--}function I(w){let v=i.get(w);if(w.depthTexture&&(w.depthTexture.dispose(),i.remove(w.depthTexture)),w.isWebGLCubeRenderTarget)for(let V=0;V<6;V++){if(Array.isArray(v.__webglFramebuffer[V]))for(let q=0;q<v.__webglFramebuffer[V].length;q++)e.deleteFramebuffer(v.__webglFramebuffer[V][q]);else e.deleteFramebuffer(v.__webglFramebuffer[V]);v.__webglDepthbuffer&&e.deleteRenderbuffer(v.__webglDepthbuffer[V])}else{if(Array.isArray(v.__webglFramebuffer))for(let V=0;V<v.__webglFramebuffer.length;V++)e.deleteFramebuffer(v.__webglFramebuffer[V]);else e.deleteFramebuffer(v.__webglFramebuffer);if(v.__webglDepthbuffer&&e.deleteRenderbuffer(v.__webglDepthbuffer),v.__webglMultisampledFramebuffer&&e.deleteFramebuffer(v.__webglMultisampledFramebuffer),v.__webglColorRenderbuffer)for(let V=0;V<v.__webglColorRenderbuffer.length;V++)v.__webglColorRenderbuffer[V]&&e.deleteRenderbuffer(v.__webglColorRenderbuffer[V]);v.__webglDepthRenderbuffer&&e.deleteRenderbuffer(v.__webglDepthRenderbuffer)}let P=w.textures;for(let V=0,q=P.length;V<q;V++){let at=i.get(P[V]);at.__webglTexture&&(e.deleteTexture(at.__webglTexture),r.memory.textures--),i.remove(P[V])}i.remove(w)}let F=0;function D(){F=0}function O(){return F}function k(w){F=w}function K(){let w=F;return w>=s.maxTextures&&Nt("WebGLTextures: Trying to use "+(w+1)+" texture units while this GPU supports only "+s.maxTextures),F+=1,w}function Y(w){let v=[];return v.push(w.wrapS),v.push(w.wrapT),v.push(w.wrapR||0),v.push(w.magFilter),v.push(w.minFilter),v.push(w.anisotropy),v.push(w.internalFormat),v.push(w.format),v.push(w.type),v.push(w.generateMipmaps),v.push(w.premultiplyAlpha),v.push(w.flipY),v.push(w.unpackAlignment),v.push(w.colorSpace),v.join()}function it(w,v){let P=i.get(w);if(w.isVideoTexture&&U(w),w.isRenderTargetTexture===!1&&w.isExternalTexture!==!0&&w.version>0&&P.__version!==w.version){let V=w.image;if(V===null)Nt("WebGLRenderer: Texture marked for update but no image data found.");else if(V.complete===!1)Nt("WebGLRenderer: Texture marked for update but image is incomplete");else{St(P,w,v);return}}else w.isExternalTexture&&(P.__webglTexture=w.sourceTexture?w.sourceTexture:null);n.bindTexture(e.TEXTURE_2D,P.__webglTexture,e.TEXTURE0+v)}function X(w,v){let P=i.get(w);if(w.isRenderTargetTexture===!1&&w.version>0&&P.__version!==w.version){St(P,w,v);return}else w.isExternalTexture&&(P.__webglTexture=w.sourceTexture?w.sourceTexture:null);n.bindTexture(e.TEXTURE_2D_ARRAY,P.__webglTexture,e.TEXTURE0+v)}function tt(w,v){let P=i.get(w);if(w.isRenderTargetTexture===!1&&w.version>0&&P.__version!==w.version){St(P,w,v);return}n.bindTexture(e.TEXTURE_3D,P.__webglTexture,e.TEXTURE0+v)}function et(w,v){let P=i.get(w);if(w.isCubeDepthTexture!==!0&&w.version>0&&P.__version!==w.version){It(P,w,v);return}n.bindTexture(e.TEXTURE_CUBE_MAP,P.__webglTexture,e.TEXTURE0+v)}let st={[Mh]:e.REPEAT,[Qi]:e.CLAMP_TO_EDGE,[Eh]:e.MIRRORED_REPEAT},gt={[ke]:e.NEAREST,[QS]:e.NEAREST_MIPMAP_NEAREST,[tc]:e.NEAREST_MIPMAP_LINEAR,[mn]:e.LINEAR,[Jh]:e.LINEAR_MIPMAP_NEAREST,[Ea]:e.LINEAR_MIPMAP_LINEAR},Yt={[eb]:e.NEVER,[rb]:e.ALWAYS,[nb]:e.LESS,[Of]:e.LEQUAL,[ib]:e.EQUAL,[If]:e.GEQUAL,[sb]:e.GREATER,[ab]:e.NOTEQUAL};function Rt(w,v){if(v.type===Pi&&t.has("OES_texture_float_linear")===!1&&(v.magFilter===mn||v.magFilter===Jh||v.magFilter===tc||v.magFilter===Ea||v.minFilter===mn||v.minFilter===Jh||v.minFilter===tc||v.minFilter===Ea)&&Nt("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),e.texParameteri(w,e.TEXTURE_WRAP_S,st[v.wrapS]),e.texParameteri(w,e.TEXTURE_WRAP_T,st[v.wrapT]),(w===e.TEXTURE_3D||w===e.TEXTURE_2D_ARRAY)&&e.texParameteri(w,e.TEXTURE_WRAP_R,st[v.wrapR]),e.texParameteri(w,e.TEXTURE_MAG_FILTER,gt[v.magFilter]),e.texParameteri(w,e.TEXTURE_MIN_FILTER,gt[v.minFilter]),v.compareFunction&&(e.texParameteri(w,e.TEXTURE_COMPARE_MODE,e.COMPARE_REF_TO_TEXTURE),e.texParameteri(w,e.TEXTURE_COMPARE_FUNC,Yt[v.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(v.magFilter===ke||v.minFilter!==tc&&v.minFilter!==Ea||v.type===Pi&&t.has("OES_texture_float_linear")===!1)return;if(v.anisotropy>1||i.get(v).__currentAnisotropy){let P=t.get("EXT_texture_filter_anisotropic");e.texParameterf(w,P.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(v.anisotropy,s.getMaxAnisotropy())),i.get(v).__currentAnisotropy=v.anisotropy}}}function Zt(w,v){let P=!1;w.__webglInit===void 0&&(w.__webglInit=!0,v.addEventListener("dispose",C));let V=v.source,q=d.get(V);q===void 0&&(q={},d.set(V,q));let at=Y(v);if(at!==w.__cacheKey){q[at]===void 0&&(q[at]={texture:e.createTexture(),usedTimes:0},r.memory.textures++,P=!0),q[at].usedTimes++;let ot=q[w.__cacheKey];ot!==void 0&&(q[w.__cacheKey].usedTimes--,ot.usedTimes===0&&R(v)),w.__cacheKey=at,w.__webglTexture=q[at].texture}return P}function W(w,v,P){return Math.floor(Math.floor(w/P)/v)}function Q(w,v,P,V){let at=w.updateRanges;if(at.length===0)n.texSubImage2D(e.TEXTURE_2D,0,0,0,v.width,v.height,P,V,v.data);else{at.sort((At,ft)=>At.start-ft.start);let ot=0;for(let At=1;At<at.length;At++){let ft=at[ot],ct=at[At],wt=ft.start+ft.count,Dt=W(ct.start,v.width,4),Bt=W(ft.start,v.width,4);ct.start<=wt+1&&Dt===Bt&&W(ct.start+ct.count-1,v.width,4)===Dt?ft.count=Math.max(ft.count,ct.start+ct.count-ft.start):(++ot,at[ot]=ct)}at.length=ot+1;let Z=n.getParameter(e.UNPACK_ROW_LENGTH),j=n.getParameter(e.UNPACK_SKIP_PIXELS),lt=n.getParameter(e.UNPACK_SKIP_ROWS);n.pixelStorei(e.UNPACK_ROW_LENGTH,v.width);for(let At=0,ft=at.length;At<ft;At++){let ct=at[At],wt=Math.floor(ct.start/4),Dt=Math.ceil(ct.count/4),Bt=wt%v.width,L=Math.floor(wt/v.width),ut=Dt,J=1;n.pixelStorei(e.UNPACK_SKIP_PIXELS,Bt),n.pixelStorei(e.UNPACK_SKIP_ROWS,L),n.texSubImage2D(e.TEXTURE_2D,0,Bt,L,ut,J,P,V,v.data)}w.clearUpdateRanges(),n.pixelStorei(e.UNPACK_ROW_LENGTH,Z),n.pixelStorei(e.UNPACK_SKIP_PIXELS,j),n.pixelStorei(e.UNPACK_SKIP_ROWS,lt)}}function St(w,v,P){let V=e.TEXTURE_2D;(v.isDataArrayTexture||v.isCompressedArrayTexture)&&(V=e.TEXTURE_2D_ARRAY),v.isData3DTexture&&(V=e.TEXTURE_3D);let q=Zt(w,v),at=v.source;n.bindTexture(V,w.__webglTexture,e.TEXTURE0+P);let ot=i.get(at);if(at.version!==ot.__version||q===!0){if(n.activeTexture(e.TEXTURE0+P),(typeof ImageBitmap<"u"&&v.image instanceof ImageBitmap)===!1){let J=Qt.getPrimaries(Qt.workingColorSpace),ht=v.colorSpace===Ns?null:Qt.getPrimaries(v.colorSpace),yt=v.colorSpace===Ns||J===ht?e.NONE:e.BROWSER_DEFAULT_WEBGL;n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,v.flipY),n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,yt)}n.pixelStorei(e.UNPACK_ALIGNMENT,v.unpackAlignment);let j=g(v.image,!1,s.maxTextureSize);j=gn(v,j);let lt=a.convert(v.format,v.colorSpace),At=a.convert(v.type),ft=x(v.internalFormat,lt,At,v.normalized,v.colorSpace,v.isVideoTexture);Rt(V,v);let ct,wt=v.mipmaps,Dt=v.isVideoTexture!==!0,Bt=ot.__version===void 0||q===!0,L=at.dataReady,ut=T(v,j);if(v.isDepthTexture)ft=E(v.format===Ta,v.type),Bt&&(Dt?n.texStorage2D(e.TEXTURE_2D,1,ft,j.width,j.height):n.texImage2D(e.TEXTURE_2D,0,ft,j.width,j.height,0,lt,At,null));else if(v.isDataTexture)if(wt.length>0){Dt&&Bt&&n.texStorage2D(e.TEXTURE_2D,ut,ft,wt[0].width,wt[0].height);for(let J=0,ht=wt.length;J<ht;J++)ct=wt[J],Dt?L&&n.texSubImage2D(e.TEXTURE_2D,J,0,0,ct.width,ct.height,lt,At,ct.data):n.texImage2D(e.TEXTURE_2D,J,ft,ct.width,ct.height,0,lt,At,ct.data);v.generateMipmaps=!1}else Dt?(Bt&&n.texStorage2D(e.TEXTURE_2D,ut,ft,j.width,j.height),L&&Q(v,j,lt,At)):n.texImage2D(e.TEXTURE_2D,0,ft,j.width,j.height,0,lt,At,j.data);else if(v.isCompressedTexture)if(v.isCompressedArrayTexture){Dt&&Bt&&n.texStorage3D(e.TEXTURE_2D_ARRAY,ut,ft,wt[0].width,wt[0].height,j.depth);for(let J=0,ht=wt.length;J<ht;J++)if(ct=wt[J],v.format!==Si)if(lt!==null)if(Dt){if(L)if(v.layerUpdates.size>0){let yt=Pg(ct.width,ct.height,v.format,v.type);for(let nt of v.layerUpdates){let Ct=ct.data.subarray(nt*yt/ct.data.BYTES_PER_ELEMENT,(nt+1)*yt/ct.data.BYTES_PER_ELEMENT);n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,J,0,0,nt,ct.width,ct.height,1,lt,Ct)}}else n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,J,0,0,0,ct.width,ct.height,j.depth,lt,ct.data)}else n.compressedTexImage3D(e.TEXTURE_2D_ARRAY,J,ft,ct.width,ct.height,j.depth,0,ct.data,0,0);else Nt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Dt?L&&n.texSubImage3D(e.TEXTURE_2D_ARRAY,J,0,0,0,ct.width,ct.height,j.depth,lt,At,ct.data):n.texImage3D(e.TEXTURE_2D_ARRAY,J,ft,ct.width,ct.height,j.depth,0,lt,At,ct.data);v.layerUpdates.size>0&&v.clearLayerUpdates()}else{Dt&&Bt&&n.texStorage2D(e.TEXTURE_2D,ut,ft,wt[0].width,wt[0].height);for(let J=0,ht=wt.length;J<ht;J++)ct=wt[J],v.format!==Si?lt!==null?Dt?L&&n.compressedTexSubImage2D(e.TEXTURE_2D,J,0,0,ct.width,ct.height,lt,ct.data):n.compressedTexImage2D(e.TEXTURE_2D,J,ft,ct.width,ct.height,0,ct.data):Nt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Dt?L&&n.texSubImage2D(e.TEXTURE_2D,J,0,0,ct.width,ct.height,lt,At,ct.data):n.texImage2D(e.TEXTURE_2D,J,ft,ct.width,ct.height,0,lt,At,ct.data)}else if(v.isDataArrayTexture)if(Dt){if(Bt&&n.texStorage3D(e.TEXTURE_2D_ARRAY,ut,ft,j.width,j.height,j.depth),L)if(v.layerUpdates.size>0){let J=Pg(j.width,j.height,v.format,v.type);for(let ht of v.layerUpdates){let yt=j.data.subarray(ht*J/j.data.BYTES_PER_ELEMENT,(ht+1)*J/j.data.BYTES_PER_ELEMENT);n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,ht,j.width,j.height,1,lt,At,yt)}v.clearLayerUpdates()}else n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,0,j.width,j.height,j.depth,lt,At,j.data)}else n.texImage3D(e.TEXTURE_2D_ARRAY,0,ft,j.width,j.height,j.depth,0,lt,At,j.data);else if(v.isData3DTexture)Dt?(Bt&&n.texStorage3D(e.TEXTURE_3D,ut,ft,j.width,j.height,j.depth),L&&n.texSubImage3D(e.TEXTURE_3D,0,0,0,0,j.width,j.height,j.depth,lt,At,j.data)):n.texImage3D(e.TEXTURE_3D,0,ft,j.width,j.height,j.depth,0,lt,At,j.data);else if(v.isFramebufferTexture){if(Bt)if(Dt)n.texStorage2D(e.TEXTURE_2D,ut,ft,j.width,j.height);else{let J=j.width,ht=j.height;for(let yt=0;yt<ut;yt++)n.texImage2D(e.TEXTURE_2D,yt,ft,J,ht,0,lt,At,null),J>>=1,ht>>=1}}else if(v.isHTMLTexture){if("texElementImage2D"in e){let J=e.canvas;if(J.hasAttribute("layoutsubtree")||J.setAttribute("layoutsubtree","true"),j.parentNode!==J){J.appendChild(j),p.add(v),J.onpaint=ht=>{let yt=ht.changedElements;for(let nt of p)yt.includes(nt.image)&&(nt.needsUpdate=!0)},J.requestPaint();return}if(e.texElementImage2D.length===3)e.texElementImage2D(e.TEXTURE_2D,e.RGBA8,j);else{let yt=e.RGBA,nt=e.RGBA,Ct=e.UNSIGNED_BYTE;e.texElementImage2D(e.TEXTURE_2D,0,yt,nt,Ct,j)}e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE)}}else if(wt.length>0){if(Dt&&Bt){let J=ce(wt[0]);n.texStorage2D(e.TEXTURE_2D,ut,ft,J.width,J.height)}for(let J=0,ht=wt.length;J<ht;J++)ct=wt[J],Dt?L&&n.texSubImage2D(e.TEXTURE_2D,J,0,0,lt,At,ct):n.texImage2D(e.TEXTURE_2D,J,ft,lt,At,ct);v.generateMipmaps=!1}else if(Dt){if(Bt){let J=ce(j);n.texStorage2D(e.TEXTURE_2D,ut,ft,J.width,J.height)}L&&n.texSubImage2D(e.TEXTURE_2D,0,0,0,lt,At,j)}else n.texImage2D(e.TEXTURE_2D,0,ft,lt,At,j);f(v)&&y(V),ot.__version=at.version,v.onUpdate&&v.onUpdate(v)}w.__version=v.version}function It(w,v,P){if(v.image.length!==6)return;let V=Zt(w,v),q=v.source;n.bindTexture(e.TEXTURE_CUBE_MAP,w.__webglTexture,e.TEXTURE0+P);let at=i.get(q);if(q.version!==at.__version||V===!0){n.activeTexture(e.TEXTURE0+P);let ot=Qt.getPrimaries(Qt.workingColorSpace),Z=v.colorSpace===Ns?null:Qt.getPrimaries(v.colorSpace),j=v.colorSpace===Ns||ot===Z?e.NONE:e.BROWSER_DEFAULT_WEBGL;n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,v.flipY),n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),n.pixelStorei(e.UNPACK_ALIGNMENT,v.unpackAlignment),n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,j);let lt=v.isCompressedTexture||v.image[0].isCompressedTexture,At=v.image[0]&&v.image[0].isDataTexture,ft=[];for(let nt=0;nt<6;nt++)!lt&&!At?ft[nt]=g(v.image[nt],!0,s.maxCubemapSize):ft[nt]=At?v.image[nt].image:v.image[nt],ft[nt]=gn(v,ft[nt]);let ct=ft[0],wt=a.convert(v.format,v.colorSpace),Dt=a.convert(v.type),Bt=x(v.internalFormat,wt,Dt,v.normalized,v.colorSpace),L=v.isVideoTexture!==!0,ut=at.__version===void 0||V===!0,J=q.dataReady,ht=T(v,ct);Rt(e.TEXTURE_CUBE_MAP,v);let yt;if(lt){L&&ut&&n.texStorage2D(e.TEXTURE_CUBE_MAP,ht,Bt,ct.width,ct.height);for(let nt=0;nt<6;nt++){yt=ft[nt].mipmaps;for(let Ct=0;Ct<yt.length;Ct++){let Et=yt[Ct];v.format!==Si?wt!==null?L?J&&n.compressedTexSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+nt,Ct,0,0,Et.width,Et.height,wt,Et.data):n.compressedTexImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+nt,Ct,Bt,Et.width,Et.height,0,Et.data):Nt("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):L?J&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+nt,Ct,0,0,Et.width,Et.height,wt,Dt,Et.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+nt,Ct,Bt,Et.width,Et.height,0,wt,Dt,Et.data)}}}else{if(yt=v.mipmaps,L&&ut){yt.length>0&&ht++;let nt=ce(ft[0]);n.texStorage2D(e.TEXTURE_CUBE_MAP,ht,Bt,nt.width,nt.height)}for(let nt=0;nt<6;nt++)if(At){L?J&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+nt,0,0,0,ft[nt].width,ft[nt].height,wt,Dt,ft[nt].data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+nt,0,Bt,ft[nt].width,ft[nt].height,0,wt,Dt,ft[nt].data);for(let Ct=0;Ct<yt.length;Ct++){let ve=yt[Ct].image[nt].image;L?J&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+nt,Ct+1,0,0,ve.width,ve.height,wt,Dt,ve.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+nt,Ct+1,Bt,ve.width,ve.height,0,wt,Dt,ve.data)}}else{L?J&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+nt,0,0,0,wt,Dt,ft[nt]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+nt,0,Bt,wt,Dt,ft[nt]);for(let Ct=0;Ct<yt.length;Ct++){let Et=yt[Ct];L?J&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+nt,Ct+1,0,0,wt,Dt,Et.image[nt]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+nt,Ct+1,Bt,wt,Dt,Et.image[nt])}}}f(v)&&y(e.TEXTURE_CUBE_MAP),at.__version=q.version,v.onUpdate&&v.onUpdate(v)}w.__version=v.version}function xt(w,v,P,V,q,at){let ot=a.convert(P.format,P.colorSpace),Z=a.convert(P.type),j=x(P.internalFormat,ot,Z,P.normalized,P.colorSpace),lt=i.get(v),At=i.get(P);if(At.__renderTarget=v,!lt.__hasExternalTextures){let ft=Math.max(1,v.width>>at),ct=Math.max(1,v.height>>at);q===e.TEXTURE_3D||q===e.TEXTURE_2D_ARRAY?n.texImage3D(q,at,j,ft,ct,v.depth,0,ot,Z,null):n.texImage2D(q,at,j,ft,ct,0,ot,Z,null)}n.bindFramebuffer(e.FRAMEBUFFER,w),Ge(v)?o.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,V,q,At.__webglTexture,0,Le(v)):(q===e.TEXTURE_2D||q>=e.TEXTURE_CUBE_MAP_POSITIVE_X&&q<=e.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&e.framebufferTexture2D(e.FRAMEBUFFER,V,q,At.__webglTexture,at),n.bindFramebuffer(e.FRAMEBUFFER,null)}function Ht(w,v,P){if(e.bindRenderbuffer(e.RENDERBUFFER,w),v.depthBuffer){let V=v.depthTexture,q=V&&V.isDepthTexture?V.type:null,at=E(v.stencilBuffer,q),ot=v.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;Ge(v)?o.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,Le(v),at,v.width,v.height):P?e.renderbufferStorageMultisample(e.RENDERBUFFER,Le(v),at,v.width,v.height):e.renderbufferStorage(e.RENDERBUFFER,at,v.width,v.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,ot,e.RENDERBUFFER,w)}else{let V=v.textures;for(let q=0;q<V.length;q++){let at=V[q],ot=a.convert(at.format,at.colorSpace),Z=a.convert(at.type),j=x(at.internalFormat,ot,Z,at.normalized,at.colorSpace);Ge(v)?o.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,Le(v),j,v.width,v.height):P?e.renderbufferStorageMultisample(e.RENDERBUFFER,Le(v),j,v.width,v.height):e.renderbufferStorage(e.RENDERBUFFER,j,v.width,v.height)}}e.bindRenderbuffer(e.RENDERBUFFER,null)}function Je(w,v,P){let V=v.isWebGLCubeRenderTarget===!0;if(n.bindFramebuffer(e.FRAMEBUFFER,w),!(v.depthTexture&&v.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");let q=i.get(v.depthTexture);if(q.__renderTarget=v,(!q.__webglTexture||v.depthTexture.image.width!==v.width||v.depthTexture.image.height!==v.height)&&(v.depthTexture.image.width=v.width,v.depthTexture.image.height=v.height,v.depthTexture.needsUpdate=!0),V){if(q.__webglInit===void 0&&(q.__webglInit=!0,v.depthTexture.addEventListener("dispose",C)),q.__webglTexture===void 0){q.__webglTexture=e.createTexture(),n.bindTexture(e.TEXTURE_CUBE_MAP,q.__webglTexture),Rt(e.TEXTURE_CUBE_MAP,v.depthTexture);let lt=a.convert(v.depthTexture.format),At=a.convert(v.depthTexture.type),ft;v.depthTexture.format===ji?ft=e.DEPTH_COMPONENT24:v.depthTexture.format===Ta&&(ft=e.DEPTH24_STENCIL8);for(let ct=0;ct<6;ct++)e.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+ct,0,ft,v.width,v.height,0,lt,At,null)}}else it(v.depthTexture,0);let at=q.__webglTexture,ot=Le(v),Z=V?e.TEXTURE_CUBE_MAP_POSITIVE_X+P:e.TEXTURE_2D,j=v.depthTexture.format===Ta?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;if(v.depthTexture.format===ji)Ge(v)?o.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,j,Z,at,0,ot):e.framebufferTexture2D(e.FRAMEBUFFER,j,Z,at,0);else if(v.depthTexture.format===Ta)Ge(v)?o.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,j,Z,at,0,ot):e.framebufferTexture2D(e.FRAMEBUFFER,j,Z,at,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function Gt(w){let v=i.get(w),P=w.isWebGLCubeRenderTarget===!0;if(v.__boundDepthTexture!==w.depthTexture){let V=w.depthTexture;if(v.__depthDisposeCallback&&v.__depthDisposeCallback(),V){let q=()=>{delete v.__boundDepthTexture,delete v.__depthDisposeCallback,V.removeEventListener("dispose",q)};V.addEventListener("dispose",q),v.__depthDisposeCallback=q}v.__boundDepthTexture=V}if(w.depthTexture&&!v.__autoAllocateDepthBuffer)if(P)for(let V=0;V<6;V++)Je(v.__webglFramebuffer[V],w,V);else{let V=w.texture.mipmaps;V&&V.length>0?Je(v.__webglFramebuffer[0],w,0):Je(v.__webglFramebuffer,w,0)}else if(P){v.__webglDepthbuffer=[];for(let V=0;V<6;V++)if(n.bindFramebuffer(e.FRAMEBUFFER,v.__webglFramebuffer[V]),v.__webglDepthbuffer[V]===void 0)v.__webglDepthbuffer[V]=e.createRenderbuffer(),Ht(v.__webglDepthbuffer[V],w,!1);else{let q=w.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,at=v.__webglDepthbuffer[V];e.bindRenderbuffer(e.RENDERBUFFER,at),e.framebufferRenderbuffer(e.FRAMEBUFFER,q,e.RENDERBUFFER,at)}}else{let V=w.texture.mipmaps;if(V&&V.length>0?n.bindFramebuffer(e.FRAMEBUFFER,v.__webglFramebuffer[0]):n.bindFramebuffer(e.FRAMEBUFFER,v.__webglFramebuffer),v.__webglDepthbuffer===void 0)v.__webglDepthbuffer=e.createRenderbuffer(),Ht(v.__webglDepthbuffer,w,!1);else{let q=w.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,at=v.__webglDepthbuffer;e.bindRenderbuffer(e.RENDERBUFFER,at),e.framebufferRenderbuffer(e.FRAMEBUFFER,q,e.RENDERBUFFER,at)}}n.bindFramebuffer(e.FRAMEBUFFER,null)}function ie(w,v,P){let V=i.get(w);v!==void 0&&xt(V.__webglFramebuffer,w,w.texture,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,0),P!==void 0&&Gt(w)}function ye(w){let v=w.texture,P=i.get(w),V=i.get(v);w.addEventListener("dispose",_);let q=w.textures,at=w.isWebGLCubeRenderTarget===!0,ot=q.length>1;if(ot||(V.__webglTexture===void 0&&(V.__webglTexture=e.createTexture()),V.__version=v.version,r.memory.textures++),at){P.__webglFramebuffer=[];for(let Z=0;Z<6;Z++)if(v.mipmaps&&v.mipmaps.length>0){P.__webglFramebuffer[Z]=[];for(let j=0;j<v.mipmaps.length;j++)P.__webglFramebuffer[Z][j]=e.createFramebuffer()}else P.__webglFramebuffer[Z]=e.createFramebuffer()}else{if(v.mipmaps&&v.mipmaps.length>0){P.__webglFramebuffer=[];for(let Z=0;Z<v.mipmaps.length;Z++)P.__webglFramebuffer[Z]=e.createFramebuffer()}else P.__webglFramebuffer=e.createFramebuffer();if(ot)for(let Z=0,j=q.length;Z<j;Z++){let lt=i.get(q[Z]);lt.__webglTexture===void 0&&(lt.__webglTexture=e.createTexture(),r.memory.textures++)}if(w.samples>0&&Ge(w)===!1){P.__webglMultisampledFramebuffer=e.createFramebuffer(),P.__webglColorRenderbuffer=[],n.bindFramebuffer(e.FRAMEBUFFER,P.__webglMultisampledFramebuffer);for(let Z=0;Z<q.length;Z++){let j=q[Z];P.__webglColorRenderbuffer[Z]=e.createRenderbuffer(),e.bindRenderbuffer(e.RENDERBUFFER,P.__webglColorRenderbuffer[Z]);let lt=a.convert(j.format,j.colorSpace),At=a.convert(j.type),ft=x(j.internalFormat,lt,At,j.normalized,j.colorSpace,w.isXRRenderTarget===!0),ct=Le(w);e.renderbufferStorageMultisample(e.RENDERBUFFER,ct,ft,w.width,w.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+Z,e.RENDERBUFFER,P.__webglColorRenderbuffer[Z])}e.bindRenderbuffer(e.RENDERBUFFER,null),w.depthBuffer&&(P.__webglDepthRenderbuffer=e.createRenderbuffer(),Ht(P.__webglDepthRenderbuffer,w,!0)),n.bindFramebuffer(e.FRAMEBUFFER,null)}}if(at){n.bindTexture(e.TEXTURE_CUBE_MAP,V.__webglTexture),Rt(e.TEXTURE_CUBE_MAP,v);for(let Z=0;Z<6;Z++)if(v.mipmaps&&v.mipmaps.length>0)for(let j=0;j<v.mipmaps.length;j++)xt(P.__webglFramebuffer[Z][j],w,v,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+Z,j);else xt(P.__webglFramebuffer[Z],w,v,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0);f(v)&&y(e.TEXTURE_CUBE_MAP),n.unbindTexture()}else if(ot){for(let Z=0,j=q.length;Z<j;Z++){let lt=q[Z],At=i.get(lt),ft=e.TEXTURE_2D;(w.isWebGL3DRenderTarget||w.isWebGLArrayRenderTarget)&&(ft=w.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(ft,At.__webglTexture),Rt(ft,lt),xt(P.__webglFramebuffer,w,lt,e.COLOR_ATTACHMENT0+Z,ft,0),f(lt)&&y(ft)}n.unbindTexture()}else{let Z=e.TEXTURE_2D;if((w.isWebGL3DRenderTarget||w.isWebGLArrayRenderTarget)&&(Z=w.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(Z,V.__webglTexture),Rt(Z,v),v.mipmaps&&v.mipmaps.length>0)for(let j=0;j<v.mipmaps.length;j++)xt(P.__webglFramebuffer[j],w,v,e.COLOR_ATTACHMENT0,Z,j);else xt(P.__webglFramebuffer,w,v,e.COLOR_ATTACHMENT0,Z,0);f(v)&&y(Z),n.unbindTexture()}w.depthBuffer&&Gt(w)}function Kt(w){let v=w.textures;for(let P=0,V=v.length;P<V;P++){let q=v[P];if(f(q)){let at=M(w),ot=i.get(q).__webglTexture;n.bindTexture(at,ot),y(at),n.unbindTexture()}}}let Ce=[],sn=[];function Dn(w){if(w.samples>0){if(Ge(w)===!1){let v=w.textures,P=w.width,V=w.height,q=e.COLOR_BUFFER_BIT,at=w.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,ot=i.get(w),Z=v.length>1;if(Z)for(let lt=0;lt<v.length;lt++)n.bindFramebuffer(e.FRAMEBUFFER,ot.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+lt,e.RENDERBUFFER,null),n.bindFramebuffer(e.FRAMEBUFFER,ot.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+lt,e.TEXTURE_2D,null,0);n.bindFramebuffer(e.READ_FRAMEBUFFER,ot.__webglMultisampledFramebuffer);let j=w.texture.mipmaps;j&&j.length>0?n.bindFramebuffer(e.DRAW_FRAMEBUFFER,ot.__webglFramebuffer[0]):n.bindFramebuffer(e.DRAW_FRAMEBUFFER,ot.__webglFramebuffer);for(let lt=0;lt<v.length;lt++){if(w.resolveDepthBuffer&&(w.depthBuffer&&(q|=e.DEPTH_BUFFER_BIT),w.stencilBuffer&&w.resolveStencilBuffer&&(q|=e.STENCIL_BUFFER_BIT)),Z){e.framebufferRenderbuffer(e.READ_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.RENDERBUFFER,ot.__webglColorRenderbuffer[lt]);let At=i.get(v[lt]).__webglTexture;e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,At,0)}e.blitFramebuffer(0,0,P,V,0,0,P,V,q,e.NEAREST),l===!0&&(Ce.length=0,sn.length=0,Ce.push(e.COLOR_ATTACHMENT0+lt),w.depthBuffer&&w.storeMultisampledDepthBuffer===!1&&(Ce.push(at),sn.push(at),e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,sn)),e.invalidateFramebuffer(e.READ_FRAMEBUFFER,Ce))}if(n.bindFramebuffer(e.READ_FRAMEBUFFER,null),n.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),Z)for(let lt=0;lt<v.length;lt++){n.bindFramebuffer(e.FRAMEBUFFER,ot.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+lt,e.RENDERBUFFER,ot.__webglColorRenderbuffer[lt]);let At=i.get(v[lt]).__webglTexture;n.bindFramebuffer(e.FRAMEBUFFER,ot.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+lt,e.TEXTURE_2D,At,0)}n.bindFramebuffer(e.DRAW_FRAMEBUFFER,ot.__webglMultisampledFramebuffer)}else if(w.depthBuffer&&w.storeMultisampledDepthBuffer===!1&&l){let v=w.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,[v])}}}function Le(w){return Math.min(s.maxSamples,w.samples)}function Ge(w){let v=i.get(w);return w.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&v.__useRenderToTexture!==!1}function U(w){let v=r.render.frame;u.get(w)!==v&&(u.set(w,v),w.update())}function gn(w,v){let P=w.colorSpace,V=w.format,q=w.type;return w.isCompressedTexture===!0||w.isVideoTexture===!0||P!==Bl&&P!==Ns&&(Qt.getTransfer(P)===le?(V!==Si||q!==ii)&&Nt("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Ut("WebGLTextures: Unsupported texture color space:",P)),v}function ce(w){return typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement?(c.width=w.naturalWidth||w.width,c.height=w.naturalHeight||w.height):typeof VideoFrame<"u"&&w instanceof VideoFrame?(c.width=w.displayWidth,c.height=w.displayHeight):(c.width=w.width,c.height=w.height),c}this.allocateTextureUnit=K,this.resetTextureUnits=D,this.getTextureUnits=O,this.setTextureUnits=k,this.setTexture2D=it,this.setTexture2DArray=X,this.setTexture3D=tt,this.setTextureCube=et,this.rebindTextures=ie,this.setupRenderTarget=ye,this.updateRenderTargetMipmap=Kt,this.updateMultisampleRenderTarget=Dn,this.setupDepthRenderbuffer=Gt,this.setupFrameBufferTexture=xt,this.useMultisampledRTT=Ge,this.isReversedDepthBuffer=function(){return n.buffers.depth.getReversed()}}function E2(e,t){function n(i,s=Ns){let a,r=Qt.getTransfer(s);if(i===ii)return e.UNSIGNED_BYTE;if(i===jh)return e.UNSIGNED_SHORT_4_4_4_4;if(i===$h)return e.UNSIGNED_SHORT_5_5_5_1;if(i===Tg)return e.UNSIGNED_INT_5_9_9_9_REV;if(i===Ag)return e.UNSIGNED_INT_10F_11F_11F_REV;if(i===Mg)return e.BYTE;if(i===Eg)return e.SHORT;if(i===Eo)return e.UNSIGNED_SHORT;if(i===Qh)return e.INT;if(i===Ii)return e.UNSIGNED_INT;if(i===Pi)return e.FLOAT;if(i===Bi)return e.HALF_FLOAT;if(i===wg)return e.ALPHA;if(i===Cg)return e.RGB;if(i===Si)return e.RGBA;if(i===ji)return e.DEPTH_COMPONENT;if(i===Ta)return e.DEPTH_STENCIL;if(i===Rg)return e.RED;if(i===tf)return e.RED_INTEGER;if(i===Aa)return e.RG;if(i===ef)return e.RG_INTEGER;if(i===nf)return e.RGBA_INTEGER;if(i===ec||i===nc||i===ic||i===sc)if(r===le)if(a=t.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(i===ec)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===nc)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===ic)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===sc)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=t.get("WEBGL_compressed_texture_s3tc"),a!==null){if(i===ec)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===nc)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===ic)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===sc)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===sf||i===af||i===rf||i===of)if(a=t.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(i===sf)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===af)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===rf)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===of)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===lf||i===cf||i===uf||i===hf||i===ff||i===ac||i===df)if(a=t.get("WEBGL_compressed_texture_etc"),a!==null){if(i===lf||i===cf)return r===le?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(i===uf)return r===le?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC;if(i===hf)return a.COMPRESSED_R11_EAC;if(i===ff)return a.COMPRESSED_SIGNED_R11_EAC;if(i===ac)return a.COMPRESSED_RG11_EAC;if(i===df)return a.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===pf||i===mf||i===gf||i===yf||i===vf||i===xf||i===_f||i===Sf||i===bf||i===Mf||i===Ef||i===Tf||i===Af||i===wf)if(a=t.get("WEBGL_compressed_texture_astc"),a!==null){if(i===pf)return r===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===mf)return r===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===gf)return r===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===yf)return r===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===vf)return r===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===xf)return r===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===_f)return r===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Sf)return r===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===bf)return r===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Mf)return r===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Ef)return r===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Tf)return r===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Af)return r===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===wf)return r===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Cf||i===Rf||i===Df)if(a=t.get("EXT_texture_compression_bptc"),a!==null){if(i===Cf)return r===le?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Rf)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Df)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Nf||i===Lf||i===rc||i===Uf)if(a=t.get("EXT_texture_compression_rgtc"),a!==null){if(i===Nf)return a.COMPRESSED_RED_RGTC1_EXT;if(i===Lf)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===rc)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Uf)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===To?e.UNSIGNED_INT_24_8:e[i]!==void 0?e[i]:null}return{convert:n}}var T2=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,A2=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,Jg=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,n){if(this.texture===null){let i=new Zl(t.texture);(t.depthNear!==n.depthNear||t.depthFar!==n.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=i}}getMesh(t){if(this.texture!==null&&this.mesh===null){let n=t.cameras[0].viewport,i=new ei({vertexShader:T2,fragmentShader:A2,uniforms:{depthColor:{value:this.texture},depthWidth:{value:n.z},depthHeight:{value:n.w}}});this.mesh=new tn(new va(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Qg=class extends $i{constructor(t,n){super();let i=this,s=null,a=1,r=null,o="local-floor",l=1,c=null,u=null,p=null,h=null,d=null,m=null,b=typeof XRWebGLBinding<"u",g=new Jg,f={},y=n.getContextAttributes(),M=null,x=null,E=[],T=[],C=new ee,_=null,A=null,R=new Fn;R.viewport=new Ue;let I=new Fn;I.viewport=new Ue;let F=[R,I],D=new Yh,O=null,k=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(W){let Q=E[W];return Q===void 0&&(Q=new xo,E[W]=Q),Q.getTargetRaySpace()},this.getControllerGrip=function(W){let Q=E[W];return Q===void 0&&(Q=new xo,E[W]=Q),Q.getGripSpace()},this.getHand=function(W){let Q=E[W];return Q===void 0&&(Q=new xo,E[W]=Q),Q.getHandSpace()};function K(W){let Q=T.indexOf(W.inputSource);if(Q===-1)return;let St=E[Q];St!==void 0&&(St.update(W.inputSource,W.frame,c||r),St.dispatchEvent({type:W.type,data:W.inputSource}))}function Y(){s.removeEventListener("select",K),s.removeEventListener("selectstart",K),s.removeEventListener("selectend",K),s.removeEventListener("squeeze",K),s.removeEventListener("squeezestart",K),s.removeEventListener("squeezeend",K),s.removeEventListener("end",Y),s.removeEventListener("inputsourceschange",it);for(let W=0;W<E.length;W++){let Q=T[W];Q!==null&&(T[W]=null,E[W].disconnect(Q))}O=null,k=null,g.reset();for(let W in f)delete f[W];if(t.setRenderTarget(M),d=null,h=null,p=null,s=null,x=null,Zt.stop(),i.isPresenting=!1,t.setPixelRatio(_),t.setSize(C.width,C.height,!1),A!==null){let W=A.camera;W.fov=A.fov,W.zoom=A.zoom,W.updateProjectionMatrix(),A=null}i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(W){a=W,i.isPresenting===!0&&Nt("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(W){o=W,i.isPresenting===!0&&Nt("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||r},this.setReferenceSpace=function(W){c=W},this.getBaseLayer=function(){return h!==null?h:d},this.getBinding=function(){return p===null&&b&&(p=new XRWebGLBinding(s,n)),p},this.getFrame=function(){return m},this.getSession=function(){return s},this.setSession=async function(W){if(s=W,s!==null){if(M=t.getRenderTarget(),s.addEventListener("select",K),s.addEventListener("selectstart",K),s.addEventListener("selectend",K),s.addEventListener("squeeze",K),s.addEventListener("squeezestart",K),s.addEventListener("squeezeend",K),s.addEventListener("end",Y),s.addEventListener("inputsourceschange",it),y.xrCompatible!==!0&&await n.makeXRCompatible(),_=t.getPixelRatio(),t.getSize(C),b&&"createProjectionLayer"in XRWebGLBinding.prototype){let St=null,It=null,xt=null;y.depth&&(xt=y.stencil?n.DEPTH24_STENCIL8:n.DEPTH_COMPONENT24,St=y.stencil?Ta:ji,It=y.stencil?To:Ii);let Ht={colorFormat:n.RGBA8,depthFormat:xt,scaleFactor:a};p=this.getBinding(),h=p.createProjectionLayer(Ht),s.updateRenderState({layers:[h]}),t.setPixelRatio(1),t.setSize(h.textureWidth,h.textureHeight,!1),x=new Hn(h.textureWidth,h.textureHeight,{format:Si,type:ii,depthTexture:new ya(h.textureWidth,h.textureHeight,It,void 0,void 0,void 0,void 0,void 0,void 0,St),stencilBuffer:y.stencil,colorSpace:t.outputColorSpace,samples:y.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1,resolveStencilBuffer:h.ignoreDepthValues===!1,storeMultisampledDepthBuffer:h.ignoreDepthValues===!1,storeMultisampledStencilBuffer:h.ignoreDepthValues===!1})}else{let St={antialias:y.antialias,alpha:!0,depth:y.depth,stencil:y.stencil,framebufferScaleFactor:a};d=new XRWebGLLayer(s,n,St),s.updateRenderState({baseLayer:d}),t.setPixelRatio(1),t.setSize(d.framebufferWidth,d.framebufferHeight,!1),x=new Hn(d.framebufferWidth,d.framebufferHeight,{format:Si,type:ii,colorSpace:t.outputColorSpace,stencilBuffer:y.stencil,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}x.isXRRenderTarget=!0,this.setFoveation(l),c=null,r=await s.requestReferenceSpace(o),Zt.setContext(s),Zt.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function it(W){for(let Q=0;Q<W.removed.length;Q++){let St=W.removed[Q],It=T.indexOf(St);It>=0&&(T[It]=null,E[It].disconnect(St))}for(let Q=0;Q<W.added.length;Q++){let St=W.added[Q],It=T.indexOf(St);if(It===-1){for(let Ht=0;Ht<E.length;Ht++)if(Ht>=T.length){T.push(St),It=Ht;break}else if(T[Ht]===null){T[Ht]=St,It=Ht;break}if(It===-1)break}let xt=E[It];xt&&xt.connect(St)}}let X=new H,tt=new H;function et(W,Q,St){X.setFromMatrixPosition(Q.matrixWorld),tt.setFromMatrixPosition(St.matrixWorld);let It=X.distanceTo(tt),xt=Q.projectionMatrix.elements,Ht=St.projectionMatrix.elements,Je=xt[14]/(xt[10]-1),Gt=xt[14]/(xt[10]+1),ie=(xt[9]+1)/xt[5],ye=(xt[9]-1)/xt[5],Kt=(xt[8]-1)/xt[0],Ce=(Ht[8]+1)/Ht[0],sn=Je*Kt,Dn=Je*Ce,Le=It/(-Kt+Ce),Ge=Le*-Kt;if(Q.matrixWorld.decompose(W.position,W.quaternion,W.scale),W.translateX(Ge),W.translateZ(Le),W.matrixWorld.compose(W.position,W.quaternion,W.scale),W.matrixWorldInverse.copy(W.matrixWorld).invert(),xt[10]===-1)W.projectionMatrix.copy(Q.projectionMatrix),W.projectionMatrixInverse.copy(Q.projectionMatrixInverse);else{let U=Je+Le,gn=Gt+Le,ce=sn-Ge,w=Dn+(It-Ge),v=ie*Gt/gn*U,P=ye*Gt/gn*U;W.projectionMatrix.makePerspective(ce,w,v,P,U,gn),W.projectionMatrixInverse.copy(W.projectionMatrix).invert()}}function st(W,Q){Q===null?W.matrixWorld.copy(W.matrix):W.matrixWorld.multiplyMatrices(Q.matrixWorld,W.matrix),W.matrixWorldInverse.copy(W.matrixWorld).invert()}this.updateCamera=function(W){if(s===null)return;let Q=W.near,St=W.far;g.texture!==null&&(g.depthNear>0&&(Q=g.depthNear),g.depthFar>0&&(St=g.depthFar)),D.near=I.near=R.near=Q,D.far=I.far=R.far=St,(O!==D.near||k!==D.far)&&(s.updateRenderState({depthNear:D.near,depthFar:D.far}),O=D.near,k=D.far),D.layers.mask=W.layers.mask|6,R.layers.mask=D.layers.mask&-5,I.layers.mask=D.layers.mask&-3;let It=W.parent,xt=D.cameras;st(D,It);for(let Ht=0;Ht<xt.length;Ht++)st(xt[Ht],It);xt.length===2?et(D,R,I):D.projectionMatrix.copy(R.projectionMatrix),A===null&&W.isPerspectiveCamera&&(A={camera:W,fov:W.fov,zoom:W.zoom}),gt(W,D,It)};function gt(W,Q,St){St===null?W.matrix.copy(Q.matrixWorld):(W.matrix.copy(St.matrixWorld),W.matrix.invert(),W.matrix.multiply(Q.matrixWorld)),W.matrix.decompose(W.position,W.quaternion,W.scale),W.updateMatrixWorld(!0),W.projectionMatrix.copy(Q.projectionMatrix),W.projectionMatrixInverse.copy(Q.projectionMatrixInverse),W.isPerspectiveCamera&&(W.fov=Ah*2*Math.atan(1/W.projectionMatrix.elements[5]),W.zoom=1)}this.getCamera=function(){return D},this.getFoveation=function(){if(!(h===null&&d===null))return l},this.setFoveation=function(W){l=W,h!==null&&(h.fixedFoveation=W),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=W)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(D)},this.getCameraTexture=function(W){return f[W]};let Yt=null;function Rt(W,Q){if(u=Q.getViewerPose(c||r),m=Q,u!==null){let St=u.views;d!==null&&(t.setRenderTargetFramebuffer(x,d.framebuffer),t.setRenderTarget(x));let It=!1;St.length!==D.cameras.length&&(D.cameras.length=0,It=!0);for(let Gt=0;Gt<St.length;Gt++){let ie=St[Gt],ye=null;if(d!==null)ye=d.getViewport(ie);else{let Ce=p.getViewSubImage(h,ie);ye=Ce.viewport,Gt===0&&(t.setRenderTargetTextures(x,Ce.colorTexture,Ce.depthStencilTexture),t.setRenderTarget(x))}let Kt=F[Gt];Kt===void 0&&(Kt=new Fn,Kt.layers.enable(Gt),Kt.viewport=new Ue,F[Gt]=Kt),Kt.matrix.fromArray(ie.transform.matrix),Kt.matrix.decompose(Kt.position,Kt.quaternion,Kt.scale),Kt.projectionMatrix.fromArray(ie.projectionMatrix),Kt.projectionMatrixInverse.copy(Kt.projectionMatrix).invert(),Kt.viewport.set(ye.x,ye.y,ye.width,ye.height),Gt===0&&(D.matrix.copy(Kt.matrix),D.matrix.decompose(D.position,D.quaternion,D.scale)),It===!0&&D.cameras.push(Kt)}let xt=s.enabledFeatures;if(xt&&xt.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&b){p=i.getBinding();let Gt=p.getDepthInformation(St[0]);Gt&&Gt.isValid&&Gt.texture&&g.init(Gt,s.renderState)}if(xt&&xt.includes("camera-access")&&b){t.state.unbindTexture(),p=i.getBinding();for(let Gt=0;Gt<St.length;Gt++){let ie=St[Gt].camera;if(ie){let ye=f[ie];ye||(ye=new Zl,f[ie]=ye);let Kt=p.getCameraImage(ie);ye.sourceTexture=Kt}}}}for(let St=0;St<E.length;St++){let It=T[St],xt=E[St];It!==null&&xt!==void 0&&xt.update(It,Q,c||r)}Yt&&Yt(W,Q),Q.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:Q}),m=null}let Zt=new Bb;Zt.setAnimationLoop(Rt),this.setAnimationLoop=function(W){Yt=W},this.dispose=function(){}}},w2=new He,Gb=new Ot;Gb.set(-1,0,0,0,1,0,0,0,1);function C2(e,t){function n(g,f){g.matrixAutoUpdate===!0&&g.updateMatrix(),f.value.copy(g.matrix)}function i(g,f){f.color.getRGB(g.fogColor.value,Ug(e)),f.isFog?(g.fogNear.value=f.near,g.fogFar.value=f.far):f.isFogExp2&&(g.fogDensity.value=f.density)}function s(g,f,y,M,x){f.isNodeMaterial?f.uniformsNeedUpdate=!1:f.isMeshBasicMaterial?a(g,f):f.isMeshLambertMaterial?(a(g,f),f.envMap&&(g.envMapIntensity.value=f.envMapIntensity)):f.isMeshToonMaterial?(a(g,f),p(g,f)):f.isMeshPhongMaterial?(a(g,f),u(g,f),f.envMap&&(g.envMapIntensity.value=f.envMapIntensity)):f.isMeshStandardMaterial?(a(g,f),h(g,f),f.isMeshPhysicalMaterial&&d(g,f,x)):f.isMeshMatcapMaterial?(a(g,f),m(g,f)):f.isMeshDepthMaterial?a(g,f):f.isMeshDistanceMaterial?(a(g,f),b(g,f)):f.isMeshNormalMaterial?a(g,f):f.isLineBasicMaterial?(r(g,f),f.isLineDashedMaterial&&o(g,f)):f.isPointsMaterial?l(g,f,y,M):f.isSpriteMaterial?c(g,f):f.isShadowMaterial?(g.color.value.copy(f.color),g.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function a(g,f){g.opacity.value=f.opacity,f.color&&g.diffuse.value.copy(f.color),f.emissive&&g.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(g.map.value=f.map,n(f.map,g.mapTransform)),f.alphaMap&&(g.alphaMap.value=f.alphaMap,n(f.alphaMap,g.alphaMapTransform)),f.bumpMap&&(g.bumpMap.value=f.bumpMap,n(f.bumpMap,g.bumpMapTransform),g.bumpScale.value=f.bumpScale,f.side===Cn&&(g.bumpScale.value*=-1)),f.normalMap&&(g.normalMap.value=f.normalMap,n(f.normalMap,g.normalMapTransform),g.normalScale.value.copy(f.normalScale),f.side===Cn&&g.normalScale.value.negate()),f.displacementMap&&(g.displacementMap.value=f.displacementMap,n(f.displacementMap,g.displacementMapTransform),g.displacementScale.value=f.displacementScale,g.displacementBias.value=f.displacementBias),f.emissiveMap&&(g.emissiveMap.value=f.emissiveMap,n(f.emissiveMap,g.emissiveMapTransform)),f.specularMap&&(g.specularMap.value=f.specularMap,n(f.specularMap,g.specularMapTransform)),f.alphaTest>0&&(g.alphaTest.value=f.alphaTest);let y=t.get(f),M=y.envMap,x=y.envMapRotation;M&&(g.envMap.value=M,g.envMapRotation.value.setFromMatrix4(w2.makeRotationFromEuler(x)).transpose(),M.isCubeTexture&&M.isRenderTargetTexture===!1&&g.envMapRotation.value.premultiply(Gb),g.reflectivity.value=f.reflectivity,g.ior.value=f.ior,g.refractionRatio.value=f.refractionRatio),f.lightMap&&(g.lightMap.value=f.lightMap,g.lightMapIntensity.value=f.lightMapIntensity,n(f.lightMap,g.lightMapTransform)),f.aoMap&&(g.aoMap.value=f.aoMap,g.aoMapIntensity.value=f.aoMapIntensity,n(f.aoMap,g.aoMapTransform))}function r(g,f){g.diffuse.value.copy(f.color),g.opacity.value=f.opacity,f.map&&(g.map.value=f.map,n(f.map,g.mapTransform))}function o(g,f){g.dashSize.value=f.dashSize,g.totalSize.value=f.dashSize+f.gapSize,g.scale.value=f.scale}function l(g,f,y,M){g.diffuse.value.copy(f.color),g.opacity.value=f.opacity,g.size.value=f.size*y,g.scale.value=M*.5,f.map&&(g.map.value=f.map,n(f.map,g.uvTransform)),f.alphaMap&&(g.alphaMap.value=f.alphaMap,n(f.alphaMap,g.alphaMapTransform)),f.alphaTest>0&&(g.alphaTest.value=f.alphaTest)}function c(g,f){g.diffuse.value.copy(f.color),g.opacity.value=f.opacity,g.rotation.value=f.rotation,f.map&&(g.map.value=f.map,n(f.map,g.mapTransform)),f.alphaMap&&(g.alphaMap.value=f.alphaMap,n(f.alphaMap,g.alphaMapTransform)),f.alphaTest>0&&(g.alphaTest.value=f.alphaTest)}function u(g,f){g.specular.value.copy(f.specular),g.shininess.value=Math.max(f.shininess,1e-4)}function p(g,f){f.gradientMap&&(g.gradientMap.value=f.gradientMap)}function h(g,f){g.metalness.value=f.metalness,f.metalnessMap&&(g.metalnessMap.value=f.metalnessMap,n(f.metalnessMap,g.metalnessMapTransform)),g.roughness.value=f.roughness,f.roughnessMap&&(g.roughnessMap.value=f.roughnessMap,n(f.roughnessMap,g.roughnessMapTransform)),f.envMap&&(g.envMapIntensity.value=f.envMapIntensity)}function d(g,f,y){g.ior.value=f.ior,f.sheen>0&&(g.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),g.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(g.sheenColorMap.value=f.sheenColorMap,n(f.sheenColorMap,g.sheenColorMapTransform)),f.sheenRoughnessMap&&(g.sheenRoughnessMap.value=f.sheenRoughnessMap,n(f.sheenRoughnessMap,g.sheenRoughnessMapTransform))),f.clearcoat>0&&(g.clearcoat.value=f.clearcoat,g.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(g.clearcoatMap.value=f.clearcoatMap,n(f.clearcoatMap,g.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,n(f.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(g.clearcoatNormalMap.value=f.clearcoatNormalMap,n(f.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===Cn&&g.clearcoatNormalScale.value.negate())),f.dispersion>0&&(g.dispersion.value=f.dispersion),f.retroreflectivity>0&&(g.retroreflectivity.value=f.retroreflectivity),f.iridescence>0&&(g.iridescence.value=f.iridescence,g.iridescenceIOR.value=f.iridescenceIOR,g.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(g.iridescenceMap.value=f.iridescenceMap,n(f.iridescenceMap,g.iridescenceMapTransform)),f.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=f.iridescenceThicknessMap,n(f.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),f.transmission>0&&(g.transmission.value=f.transmission,g.transmissionSamplerMap.value=y.texture,g.transmissionSamplerSize.value.set(y.width,y.height),f.transmissionMap&&(g.transmissionMap.value=f.transmissionMap,n(f.transmissionMap,g.transmissionMapTransform)),g.thickness.value=f.thickness,f.thicknessMap&&(g.thicknessMap.value=f.thicknessMap,n(f.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=f.attenuationDistance,g.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(g.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(g.anisotropyMap.value=f.anisotropyMap,n(f.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=f.specularIntensity,g.specularColor.value.copy(f.specularColor),f.specularColorMap&&(g.specularColorMap.value=f.specularColorMap,n(f.specularColorMap,g.specularColorMapTransform)),f.specularIntensityMap&&(g.specularIntensityMap.value=f.specularIntensityMap,n(f.specularIntensityMap,g.specularIntensityMapTransform))}function m(g,f){f.matcap&&(g.matcap.value=f.matcap)}function b(g,f){let y=t.get(f).light;g.referencePosition.value.setFromMatrixPosition(y.matrixWorld),g.nearDistance.value=y.shadow.camera.near,g.farDistance.value=y.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function R2(e,t,n,i){let s={},a={},r=[],o=e.getParameter(e.MAX_UNIFORM_BUFFER_BINDINGS);function l(x,E){let T=E.program;i.uniformBlockBinding(x,T)}function c(x,E){let T=s[x.id];T===void 0&&(g(x),T=u(x),s[x.id]=T,x.addEventListener("dispose",y));let C=E.program;i.updateUBOMapping(x,C);let _=t.render.frame;a[x.id]!==_&&(h(x),a[x.id]=_)}function u(x){let E=p();x.__bindingPointIndex=E;let T=e.createBuffer(),C=x.__size,_=x.usage;return e.bindBuffer(e.UNIFORM_BUFFER,T),e.bufferData(e.UNIFORM_BUFFER,C,_),e.bindBuffer(e.UNIFORM_BUFFER,null),e.bindBufferBase(e.UNIFORM_BUFFER,E,T),T}function p(){for(let x=0;x<o;x++)if(r.indexOf(x)===-1)return r.push(x),x;return Ut("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function h(x){let E=s[x.id],T=x.uniforms,C=x.__cache;e.bindBuffer(e.UNIFORM_BUFFER,E);for(let _=0,A=T.length;_<A;_++){let R=T[_];if(Array.isArray(R))for(let I=0,F=R.length;I<F;I++)d(R[I],_,I,C);else d(R,_,0,C)}e.bindBuffer(e.UNIFORM_BUFFER,null)}function d(x,E,T,C){if(b(x,E,T,C)===!0){let _=x.__offset,A=x.value;if(Array.isArray(A)){let R=0;for(let I=0;I<A.length;I++){let F=A[I],D=f(F);m(F,x.__data,R),typeof F!="number"&&typeof F!="boolean"&&!F.isMatrix3&&!ArrayBuffer.isView(F)&&(R+=D.storage/Float32Array.BYTES_PER_ELEMENT)}}else m(A,x.__data,0);e.bufferSubData(e.UNIFORM_BUFFER,_,x.__data)}}function m(x,E,T){typeof x=="number"||typeof x=="boolean"?E[0]=x:x.isMatrix3?(E[0]=x.elements[0],E[1]=x.elements[1],E[2]=x.elements[2],E[3]=0,E[4]=x.elements[3],E[5]=x.elements[4],E[6]=x.elements[5],E[7]=0,E[8]=x.elements[6],E[9]=x.elements[7],E[10]=x.elements[8],E[11]=0):ArrayBuffer.isView(x)?E.set(new x.constructor(x.buffer,x.byteOffset,E.length)):x.toArray(E,T)}function b(x,E,T,C){let _=x.value,A=E+"_"+T;if(C[A]===void 0)return typeof _=="number"||typeof _=="boolean"?C[A]=_:ArrayBuffer.isView(_)?C[A]=_.slice():C[A]=_.clone(),!0;{let R=C[A];if(typeof _=="number"||typeof _=="boolean"){if(R!==_)return C[A]=_,!0}else{if(ArrayBuffer.isView(_))return!0;if(R.equals(_)===!1)return R.copy(_),!0}}return!1}function g(x){let E=x.uniforms,T=0,C=16;for(let A=0,R=E.length;A<R;A++){let I=Array.isArray(E[A])?E[A]:[E[A]];for(let F=0,D=I.length;F<D;F++){let O=I[F],k=Array.isArray(O.value)?O.value:[O.value];for(let K=0,Y=k.length;K<Y;K++){let it=k[K],X=f(it),tt=T%C,et=tt%X.boundary,st=tt+et;T+=et,st!==0&&C-st<X.storage&&(T+=C-st),O.__data=new Float32Array(X.storage/Float32Array.BYTES_PER_ELEMENT),O.__offset=T,T+=X.storage}}}let _=T%C;return _>0&&(T+=C-_),x.__size=T,x.__cache={},this}function f(x){let E={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(E.boundary=4,E.storage=4):x.isVector2?(E.boundary=8,E.storage=8):x.isVector3||x.isColor?(E.boundary=16,E.storage=12):x.isVector4?(E.boundary=16,E.storage=16):x.isMatrix3?(E.boundary=48,E.storage=48):x.isMatrix4?(E.boundary=64,E.storage=64):x.isTexture?Nt("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(x)?(E.boundary=16,E.storage=x.byteLength):Nt("WebGLRenderer: Unsupported uniform value type.",x),E}function y(x){let E=x.target;E.removeEventListener("dispose",y);let T=r.indexOf(E.__bindingPointIndex);r.splice(T,1),e.deleteBuffer(s[E.id]),delete s[E.id],delete a[E.id]}function M(){for(let x in s)e.deleteBuffer(s[x]);r=[],s={},a={}}return{bind:l,update:c,dispose:M}}var D2=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),ns=null;function N2(){return ns===null&&(ns=new Nh(D2,16,16,Aa,Bi),ns.name="DFG_LUT",ns.minFilter=mn,ns.magFilter=mn,ns.wrapS=Qi,ns.wrapT=Qi,ns.generateMipmaps=!1,ns.needsUpdate=!0),ns}var Vf=class{constructor(t={}){let{canvas:n=lb(),context:i=null,depth:s=!0,stencil:a=!1,alpha:r=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:p=!1,reversedDepthBuffer:h=!1,outputBufferType:d=ii}=t;this.isWebGLRenderer=!0;let m;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");m=i.getContextAttributes().alpha}else m=r;let b=d,g=new Set([nf,ef,tf]),f=new Set([ii,Ii,Eo,To,jh,$h]),y=new Uint32Array(4),M=new Int32Array(4),x=new H,E=null,T=null,C=[],_=[],A=null;this.domElement=n,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Oi,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let R=this,I=!1,F=null,D=null,O=null,k=null;this._outputColorSpace=Sn;let K=0,Y=0,it=null,X=-1,tt=null,et=new Ue,st=new Ue,gt=null,Yt=new ne(0),Rt=0,Zt=n.width,W=n.height,Q=1,St=null,It=null,xt=new Ue(0,0,Zt,W),Ht=new Ue(0,0,Zt,W),Je=!1,Gt=new ql,ie=!1,ye=!1,Kt=new He,Ce=new H,sn=new Ue,Dn={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Le=!1;function Ge(){return it===null?Q:1}let U=i;function gn(S,N){return n.getContext(S,N)}let ce,w,v,P,V,q,at,ot,Z,j,lt,At,ft,ct,wt,Dt,Bt,L,ut,J,ht,yt,nt;try{let S={alpha:!0,depth:s,stencil:a,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:p};if("setAttribute"in n&&n.setAttribute("data-engine",`three.js r${"186"}`),n.addEventListener("webglcontextlost",ve,!1),n.addEventListener("webglcontextrestored",re,!1),n.addEventListener("webglcontextcreationerror",bi,!1),U===null){let N="webgl2";if(U=gn(N,S),U===null)throw gn(N)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}Ct()}catch(S){throw n.removeEventListener("webglcontextlost",ve,!1),n.removeEventListener("webglcontextrestored",re,!1),n.removeEventListener("webglcontextcreationerror",bi,!1),Ut("WebGLRenderer: "+S.message),S}function Ct(){ce=new zC(U),ce.init(),ht=new E2(U,ce),w=new CC(U,ce,t,ht),v=new b2(U,ce),w.reversedDepthBuffer&&h&&v.buffers.depth.setReversed(!0),D=U.createFramebuffer(),O=U.createFramebuffer(),k=U.createFramebuffer(),P=new HC(U),V=new l2,q=new M2(U,ce,v,V,w,ht,P),at=new BC(R),ot=new GT(U),yt=new AC(U,ot),Z=new FC(U,ot,P,yt),j=new GC(U,Z,ot,yt,P),L=new kC(U,w,q),wt=new RC(V),lt=new o2(R,at,ce,w,yt,wt),At=new C2(R,V),ft=new u2,ct=new g2(ce),Bt=new TC(R,at,v,j,m,l),Dt=new S2(R,j,w),nt=new R2(U,P,w,v),ut=new wC(U,ce,P),J=new VC(U,ce,P),P.programs=lt.programs,R.capabilities=w,R.extensions=ce,R.properties=V,R.renderLists=ft,R.shadowMap=Dt,R.state=v,R.info=P}b!==ii&&(A=new XC(b,n.width,n.height,o,s,a));let Et=new Qg(R,U);this.xr=Et,this.getContext=function(){return U},this.getContextAttributes=function(){return U.getContextAttributes()},this.forceContextLoss=function(){let S=ce.get("WEBGL_lose_context");S&&S.loseContext()},this.forceContextRestore=function(){let S=ce.get("WEBGL_lose_context");S&&S.restoreContext()},this.getPixelRatio=function(){return Q},this.setPixelRatio=function(S){S!==void 0&&(Q=S,this.setSize(Zt,W,!1))},this.getSize=function(S){return S.set(Zt,W)},this.setSize=function(S,N,G=!0){if(Et.isPresenting){Nt("WebGLRenderer: Can't change size while VR device is presenting.");return}Zt=S,W=N,n.width=Math.floor(S*Q),n.height=Math.floor(N*Q),G===!0&&(n.style.width=S+"px",n.style.height=N+"px"),A!==null&&A.setSize(n.width,n.height),this.setViewport(0,0,S,N)},this.getDrawingBufferSize=function(S){return S.set(Zt*Q,W*Q).floor()},this.setDrawingBufferSize=function(S,N,G){Zt=S,W=N,Q=G,n.width=Math.floor(S*G),n.height=Math.floor(N*G),this.setViewport(0,0,S,N)},this.setEffects=function(S){if(b===ii){Ut("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(S){for(let N=0;N<S.length;N++)if(S[N].isOutputPass===!0){Nt("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}A.setEffects(S||[])},this.getCurrentViewport=function(S){return S.copy(et)},this.getViewport=function(S){return S.copy(xt)},this.setViewport=function(S,N,G,B){S.isVector4?xt.set(S.x,S.y,S.z,S.w):xt.set(S,N,G,B),v.viewport(et.copy(xt).multiplyScalar(Q).round())},this.getScissor=function(S){return S.copy(Ht)},this.setScissor=function(S,N,G,B){S.isVector4?Ht.set(S.x,S.y,S.z,S.w):Ht.set(S,N,G,B),v.scissor(st.copy(Ht).multiplyScalar(Q).round())},this.getScissorTest=function(){return Je},this.setScissorTest=function(S){v.setScissorTest(Je=S)},this.setOpaqueSort=function(S){St=S},this.setTransparentSort=function(S){It=S},this.getClearColor=function(S){return S.copy(Bt.getClearColor())},this.setClearColor=function(){Bt.setClearColor(...arguments)},this.getClearAlpha=function(){return Bt.getClearAlpha()},this.setClearAlpha=function(){Bt.setClearAlpha(...arguments)},this.clear=function(S=!0,N=!0,G=!0){let B=0;if(S){let z=!1;if(it!==null){let mt=it.texture.format;z=g.has(mt)}if(z){let mt=it.texture.type,_t=f.has(mt),pt=Bt.getClearColor(),bt=Bt.getClearAlpha(),Tt=pt.r,Ft=pt.g,Wt=pt.b;_t?(y[0]=Tt,y[1]=Ft,y[2]=Wt,y[3]=bt,U.clearBufferuiv(U.COLOR,0,y)):(M[0]=Tt,M[1]=Ft,M[2]=Wt,M[3]=bt,U.clearBufferiv(U.COLOR,0,M))}else B|=U.COLOR_BUFFER_BIT}N&&(B|=U.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),G&&(B|=U.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),B!==0&&U.clear(B)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(S){S.setRenderer(this),F=S},this.dispose=function(){n.removeEventListener("webglcontextlost",ve,!1),n.removeEventListener("webglcontextrestored",re,!1),n.removeEventListener("webglcontextcreationerror",bi,!1),Bt.dispose(),ft.dispose(),ct.dispose(),V.dispose(),at.dispose(),j.dispose(),yt.dispose(),nt.dispose(),lt.dispose(),Et.dispose(),Et.removeEventListener("sessionstart",e0),Et.removeEventListener("sessionend",n0),wa.stop()};function ve(S){S.preventDefault(),Lg("WebGLRenderer: Context Lost."),I=!0}function re(){Lg("WebGLRenderer: Context Restored."),I=!1;let S=P.autoReset,N=Dt.enabled,G=Dt.autoUpdate,B=Dt.needsUpdate,z=Dt.type;Ct(),P.autoReset=S,Dt.enabled=N,Dt.autoUpdate=G,Dt.needsUpdate=B,Dt.type=z}function bi(S){Ut("WebGLRenderer: A WebGL context could not be created. Reason: ",S.statusMessage)}function Fi(S){let N=S.target;N.removeEventListener("dispose",Fi),$b(N)}function $b(S){tM(S),V.remove(S)}function tM(S){let N=V.get(S).programs;N!==void 0&&(N.forEach(function(G){lt.releaseProgram(G)}),S.isShaderMaterial&&lt.releaseShaderCache(S))}this.renderBufferDirect=function(S,N,G,B,z,mt){N===null&&(N=Dn);let _t=z.isMesh&&z.matrixWorld.determinantAffine()<0,pt=iM(S,N,G,B,z);v.setMaterial(B,_t);let bt=G.index,Tt=1;if(B.wireframe===!0){if(bt=Z.getWireframeAttribute(G),bt===void 0)return;Tt=2}let Ft=G.drawRange,Wt=G.attributes.position,Mt=Ft.start*Tt,oe=(Ft.start+Ft.count)*Tt;mt!==null&&(Mt=Math.max(Mt,mt.start*Tt),oe=Math.min(oe,(mt.start+mt.count)*Tt)),bt!==null?(Mt=Math.max(Mt,0),oe=Math.min(oe,bt.count)):Wt!=null&&(Mt=Math.max(Mt,0),oe=Math.min(oe,Wt.count));let We=oe-Mt;if(We<0||We===1/0)return;yt.setup(z,B,pt,G,bt);let Se,me=ut;if(bt!==null&&(Se=ot.get(bt),me=J,me.setIndex(Se)),z.isMesh)B.wireframe===!0?(v.setLineWidth(B.wireframeLinewidth*Ge()),me.setMode(U.LINES)):me.setMode(U.TRIANGLES);else if(z.isLine){let yn=B.linewidth;yn===void 0&&(yn=1),v.setLineWidth(yn*Ge()),z.isLineSegments?me.setMode(U.LINES):z.isLineLoop?me.setMode(U.LINE_LOOP):me.setMode(U.LINE_STRIP)}else z.isPoints?me.setMode(U.POINTS):z.isSprite&&me.setMode(U.TRIANGLES);if(z.isBatchedMesh)if(ce.get("WEBGL_multi_draw"))me.renderMultiDraw(z._multiDrawStarts,z._multiDrawCounts,z._multiDrawCount);else{let yn=z._multiDrawStarts,vt=z._multiDrawCounts,En=z._multiDrawCount,te=bt?ot.get(bt).bytesPerElement:1,si=V.get(B).currentProgram.getUniforms();for(let Vi=0;Vi<En;Vi++)si.setValue(U,"_gl_DrawID",Vi),me.render(yn[Vi]/te,vt[Vi])}else if(z.isInstancedMesh)me.renderInstances(Mt,We,z.count);else if(G.isInstancedBufferGeometry){let yn=G._maxInstanceCount!==void 0?G._maxInstanceCount:1/0,vt=Math.min(G.instanceCount,yn);me.renderInstances(Mt,We,vt)}else me.render(Mt,We)};function t0(S,N,G,B){F!==null&&S.isNodeMaterial&&F.setObject(B,S),ie===!0&&wt.setState(S,G,!1),S.transparent===!0&&S.side===_i&&S.forceSinglePass===!1?(S.side=Cn,S.needsUpdate=!0,dc(S,N,B),S.side=ba,S.needsUpdate=!0,dc(S,N,B),S.side=_i):dc(S,N,B)}this.compile=function(S,N,G=null){G===null&&(G=S),F!==null&&F.renderStart(S,N,G),T=ct.get(G),T.init(N),_.push(T),G.traverseVisible(function(z){z.isLight&&z.layers.test(N.layers)&&(T.pushLight(z),z.castShadow&&T.pushShadow(z))}),S!==G&&S.traverseVisible(function(z){z.isLight&&z.layers.test(N.layers)&&(T.pushLight(z),z.castShadow&&T.pushShadow(z))}),T.setupLights(),F!==null&&F.updateLights(T.state.lightsArray),ye=this.localClippingEnabled,ie=wt.init(this.clippingPlanes,ye),ie===!0&&wt.setGlobalState(this.clippingPlanes,N),F!==null&&Dt.render(T.state.shadowsArray,G,N);let B=new Set;return S.traverse(function(z){if(!(z.isMesh||z.isPoints||z.isLine||z.isSprite))return;let mt=z.material;if(mt)if(Array.isArray(mt))for(let _t=0;_t<mt.length;_t++){let pt=mt[_t];t0(pt,G,N,z),B.add(pt)}else t0(mt,G,N,z),B.add(mt)}),T=_.pop(),F!==null&&F.renderEnd(),B},this.compileAsync=function(S,N,G=null){let B=this.compile(S,N,G);return new Promise(z=>{function mt(){if(B.forEach(function(_t){let bt=V.get(_t).currentProgram;(bt===void 0||bt.isReady())&&B.delete(_t)}),B.size===0){z(S);return}setTimeout(mt,10)}ce.get("KHR_parallel_shader_compile")!==null?mt():setTimeout(mt,10)})};let qf=null;function eM(S){qf&&qf(S)}function e0(){wa.stop()}function n0(){wa.start()}let wa=new Bb;wa.setAnimationLoop(eM),typeof self<"u"&&wa.setContext(self),this.setAnimationLoop=function(S){qf=S,Et.setAnimationLoop(S),S===null?wa.stop():wa.start()},Et.addEventListener("sessionstart",e0),Et.addEventListener("sessionend",n0),this.render=function(S,N){if(N!==void 0&&N.isCamera!==!0){Ut("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(I===!0)return;F!==null&&F.renderStart(S,N);let G=Et.enabled===!0&&Et.isPresenting===!0,B=A!==null&&(it===null||G)&&A.begin(R,it);if(S.matrixWorldAutoUpdate===!0&&S.updateMatrixWorld(),N.parent===null&&N.matrixWorldAutoUpdate===!0&&N.updateMatrixWorld(),Et.enabled===!0&&Et.isPresenting===!0&&(A===null||A.isCompositing()===!1)&&(Et.cameraAutoUpdate===!0&&Et.updateCamera(N),N=Et.getCamera()),S.isScene===!0&&S.onBeforeRender(R,S,N,it),T=ct.get(S,_.length),T.init(N),T.state.textureUnits=q.getTextureUnits(),_.push(T),Kt.multiplyMatrices(N.projectionMatrix,N.matrixWorldInverse),Gt.setFromProjectionMatrix(Kt,Ui,N.reversedDepth),ye=this.localClippingEnabled,ie=wt.init(this.clippingPlanes,ye),E=ft.get(S,C.length),E.init(),C.push(E),Et.enabled===!0&&Et.isPresenting===!0){let _t=R.xr.getDepthSensingMesh();_t!==null&&Yf(_t,N,-1/0,R.sortObjects)}Yf(S,N,0,R.sortObjects),E.finish(),F!==null&&F.updateLights(T.state.lightsArray),R.sortObjects===!0&&E.sort(St,It),Le=Et.enabled===!1||Et.isPresenting===!1||Et.hasDepthSensing()===!1,Le&&Bt.addToRenderList(E,S),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),ie===!0&&wt.beginShadows();let z=T.state.shadowsArray;if(Dt.render(z,S,N),ie===!0&&wt.endShadows(),(B&&A.hasRenderPass())===!1){let _t=E.opaque,pt=E.transmissive;if(T.setupLights(),N.isArrayCamera){let bt=N.cameras;if(pt.length>0)for(let Tt=0,Ft=bt.length;Tt<Ft;Tt++){let Wt=bt[Tt];s0(_t,pt,S,Wt)}Le&&Bt.render(S);for(let Tt=0,Ft=bt.length;Tt<Ft;Tt++){let Wt=bt[Tt];i0(E,S,Wt,Wt.viewport)}}else pt.length>0&&s0(_t,pt,S,N),Le&&Bt.render(S),i0(E,S,N)}it!==null&&Y===0&&(q.updateMultisampleRenderTarget(it),q.updateRenderTargetMipmap(it)),B&&A.end(R),S.isScene===!0&&S.onAfterRender(R,S,N),yt.resetDefaultState(),X=-1,tt=null,_.pop(),_.length>0?(T=_[_.length-1],q.setTextureUnits(T.state.textureUnits),ie===!0&&wt.setGlobalState(R.clippingPlanes,T.state.camera)):T=null,C.pop(),C.length>0?E=C[C.length-1]:E=null,F!==null&&F.renderEnd()};function Yf(S,N,G,B){if(S.visible===!1)return;if(S.layers.test(N.layers)){if(S.isGroup)G=S.renderOrder;else if(S.isLOD)S.autoUpdate===!0&&S.update(N);else if(S.isLightProbeGrid)T.pushLightProbeGrid(S);else if(S.isLight)T.pushLight(S),S.castShadow&&T.pushShadow(S);else if(S.isSprite){if(!S.frustumCulled||S.intersectsFrustum(Gt)){B&&sn.setFromMatrixPosition(S.matrixWorld).applyMatrix4(Kt);let _t=j.update(S),pt=S.material;pt.visible&&E.push(S,_t,pt,G,sn.z,null,N)}}else if((S.isMesh||S.isLine||S.isPoints)&&(!S.frustumCulled||S.intersectsFrustum(Gt))){let _t=j.update(S),pt=S.material;if(B&&(S.boundingSphere!==void 0?(S.boundingSphere===null&&S.computeBoundingSphere(),sn.copy(S.boundingSphere.center)):(_t.boundingSphere===null&&_t.computeBoundingSphere(),sn.copy(_t.boundingSphere.center)),sn.applyMatrix4(S.matrixWorld).applyMatrix4(Kt)),Array.isArray(pt)){let bt=_t.groups;for(let Tt=0,Ft=bt.length;Tt<Ft;Tt++){let Wt=bt[Tt],Mt=pt[Wt.materialIndex];Mt&&Mt.visible&&E.push(S,_t,Mt,G,sn.z,Wt,N)}}else pt.visible&&E.push(S,_t,pt,G,sn.z,null,N)}}let mt=S.children;for(let _t=0,pt=mt.length;_t<pt;_t++)Yf(mt[_t],N,G,B)}function i0(S,N,G,B){let{opaque:z,transmissive:mt,transparent:_t}=S;T.setupLightsView(G),ie===!0&&wt.setGlobalState(R.clippingPlanes,G),B&&v.viewport(et.copy(B)),z.length>0&&fc(z,N,G),mt.length>0&&fc(mt,N,G),_t.length>0&&fc(_t,N,G),v.buffers.depth.setTest(!0),v.buffers.depth.setMask(!0),v.buffers.color.setMask(!0),v.setPolygonOffset(!1)}function s0(S,N,G,B){if((G.isScene===!0?G.overrideMaterial:null)!==null)return;if(T.state.transmissionRenderTarget[B.id]===void 0){let Mt=ce.has("EXT_color_buffer_half_float")||ce.has("EXT_color_buffer_float");T.state.transmissionRenderTarget[B.id]=new Hn(1,1,{generateMipmaps:!0,type:Mt?Bi:ii,minFilter:Ea,samples:Math.max(4,w.samples),stencilBuffer:a,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:Qt.workingColorSpace})}let mt=T.state.transmissionRenderTarget[B.id],_t=B.viewport||et;mt.setSize(_t.z*R.transmissionResolutionScale,_t.w*R.transmissionResolutionScale);let pt=R.getRenderTarget(),bt=R.getActiveCubeFace(),Tt=R.getActiveMipmapLevel();R.setRenderTarget(mt),R.getClearColor(Yt),Rt=R.getClearAlpha(),Rt<1&&R.setClearColor(16777215,.5),R.clear(),Le&&Bt.render(G);let Ft=R.toneMapping;R.toneMapping=Oi;let Wt=B.viewport;if(B.viewport!==void 0&&(B.viewport=void 0),T.setupLightsView(B),ie===!0&&wt.setGlobalState(R.clippingPlanes,B),fc(S,G,B),q.updateMultisampleRenderTarget(mt),q.updateRenderTargetMipmap(mt),ce.has("WEBGL_multisampled_render_to_texture")===!1){let Mt=!1;for(let oe=0,We=N.length;oe<We;oe++){let Se=N[oe],{object:me,geometry:yn,material:vt,group:En}=Se;if(vt.side===_i&&me.layers.test(B.layers)){let te=vt.side;vt.side=Cn,vt.needsUpdate=!0,a0(me,G,B,yn,vt,En),vt.side=te,vt.needsUpdate=!0,Mt=!0}}Mt===!0&&(q.updateMultisampleRenderTarget(mt),q.updateRenderTargetMipmap(mt))}R.setRenderTarget(pt,bt,Tt),R.setClearColor(Yt,Rt),Wt!==void 0&&(B.viewport=Wt),R.toneMapping=Ft}function fc(S,N,G){let B=N.isScene===!0?N.overrideMaterial:null;for(let z=0,mt=S.length;z<mt;z++){let _t=S[z],{object:pt,geometry:bt,group:Tt}=_t,Ft=_t.material;Ft.allowOverride===!0&&B!==null&&(Ft=B),pt.layers.test(G.layers)&&a0(pt,N,G,bt,Ft,Tt)}}function a0(S,N,G,B,z,mt){F!==null&&z.isNodeMaterial&&F.setObject(S,z),S.onBeforeRender(R,N,G,B,z,mt),S.modelViewMatrix.multiplyMatrices(G.matrixWorldInverse,S.matrixWorld),S.normalMatrix.getNormalMatrix(S.modelViewMatrix),z.onBeforeRender(R,N,G,B,S,mt),z.transparent===!0&&z.side===_i&&z.forceSinglePass===!1?(z.side=Cn,z.needsUpdate=!0,R.renderBufferDirect(G,N,B,z,S,mt),z.side=ba,z.needsUpdate=!0,R.renderBufferDirect(G,N,B,z,S,mt),z.side=_i):R.renderBufferDirect(G,N,B,z,S,mt),S.onAfterRender(R,N,G,B,z,mt)}function dc(S,N,G){N.isScene!==!0&&(N=Dn);let B=V.get(S),z=T.state.lights,mt=T.state.shadowsArray,_t=z.state.version,pt=lt.getParameters(S,z.state,mt,N,G,T.state.lightProbeGridArray),bt=lt.getProgramCacheKey(pt),Tt=B.programs;B.environment=S.isMeshStandardMaterial||S.isMeshLambertMaterial||S.isMeshPhongMaterial?N.environment:null,B.fog=N.fog;let Ft=S.isMeshStandardMaterial||S.isMeshLambertMaterial&&!S.envMap||S.isMeshPhongMaterial&&!S.envMap;B.envMap=at.get(S.envMap||B.environment,Ft),B.envMapRotation=B.environment!==null&&S.envMap===null?N.environmentRotation:S.envMapRotation,Tt===void 0&&(S.addEventListener("dispose",Fi),Tt=new Map,B.programs=Tt);let Wt=Tt.get(bt);if(Wt!==void 0){if(B.currentProgram===Wt&&B.lightsStateVersion===_t)return o0(S,pt),Wt}else pt.uniforms=lt.getUniforms(S),F!==null&&S.isNodeMaterial&&F.build(S,G,pt),S.onBeforeCompile(pt,R),Wt=lt.acquireProgram(pt,bt),Tt.set(bt,Wt),B.uniforms=pt.uniforms;let Mt=B.uniforms;return(!S.isShaderMaterial&&!S.isRawShaderMaterial||S.clipping===!0)&&(Mt.clippingPlanes=wt.uniform),o0(S,pt),B.needsLights=aM(S),B.lightsStateVersion=_t,B.needsLights&&(Mt.ambientLightColor.value=z.state.ambient,Mt.lightProbe.value=z.state.probe,Mt.sunLights.value=z.state.sun,Mt.sunLightShadows.value=z.state.sunShadow,Mt.directionalLights.value=z.state.directional,Mt.directionalLightShadows.value=z.state.directionalShadow,Mt.spotLights.value=z.state.spot,Mt.spotLightShadows.value=z.state.spotShadow,Mt.rectAreaLights.value=z.state.rectArea,Mt.ltc_1.value=z.state.rectAreaLTC1,Mt.ltc_2.value=z.state.rectAreaLTC2,Mt.pointLights.value=z.state.point,Mt.pointLightShadows.value=z.state.pointShadow,Mt.hemisphereLights.value=z.state.hemi,Mt.sunShadowMatrix.value=z.state.sunShadowMatrix,Mt.sunShadowCascade.value=z.state.sunShadowCascade,Mt.directionalShadowMatrix.value=z.state.directionalShadowMatrix,Mt.spotLightMatrix.value=z.state.spotLightMatrix,Mt.spotLightMap.value=z.state.spotLightMap,Mt.pointShadowMatrix.value=z.state.pointShadowMatrix),B.lightProbeGrid=T.state.lightProbeGridArray.length>0,B.currentProgram=Wt,B.uniformsList=null,Wt}function r0(S){if(S.uniformsList===null){let N=S.currentProgram.getUniforms();S.uniformsList=Co.seqWithValue(N.seq,S.uniforms)}return S.uniformsList}function o0(S,N){let G=V.get(S);G.outputColorSpace=N.outputColorSpace,G.batching=N.batching,G.batchingColor=N.batchingColor,G.instancing=N.instancing,G.instancingColor=N.instancingColor,G.instancingMorph=N.instancingMorph,G.skinning=N.skinning,G.morphTargets=N.morphTargets,G.morphNormals=N.morphNormals,G.morphColors=N.morphColors,G.morphTargetsCount=N.morphTargetsCount,G.numClippingPlanes=N.numClippingPlanes,G.numIntersection=N.numClipIntersection,G.vertexAlphas=N.vertexAlphas,G.vertexTangents=N.vertexTangents,G.toneMapping=N.toneMapping}function nM(S,N){if(S.length===0)return null;if(S.length===1)return S[0].texture!==null?S[0]:null;x.setFromMatrixPosition(N.matrixWorld);for(let G=0,B=S.length;G<B;G++){let z=S[G];if(z.texture!==null&&z.boundingBox.containsPoint(x))return z}return null}function iM(S,N,G,B,z){N.isScene!==!0&&(N=Dn),q.resetTextureUnits();let mt=N.fog,_t=B.isMeshStandardMaterial||B.isMeshLambertMaterial||B.isMeshPhongMaterial?N.environment:null,pt=it===null?R.outputColorSpace:it.isXRRenderTarget===!0?it.texture.colorSpace:Qt.workingColorSpace,bt=B.isMeshStandardMaterial||B.isMeshLambertMaterial&&!B.envMap||B.isMeshPhongMaterial&&!B.envMap,Tt=at.get(B.envMap||_t,bt),Ft=B.vertexColors===!0&&!!G.attributes.color&&G.attributes.color.itemSize===4,Wt=!!G.attributes.tangent&&(!!B.normalMap||B.anisotropy>0),Mt=!!G.morphAttributes.position,oe=!!G.morphAttributes.normal,We=!!G.morphAttributes.color,Se=Oi;B.toneMapped&&(it===null||it.isXRRenderTarget===!0)&&(Se=R.toneMapping);let me=G.morphAttributes.position||G.morphAttributes.normal||G.morphAttributes.color,yn=me!==void 0?me.length:0,vt=V.get(B),En=T.state.lights;if(ie===!0&&(ye===!0||S!==tt)){let xe=S===tt&&B.id===X;wt.setState(B,S,xe)}let te=!1;B.version===vt.__version?(vt.needsLights&&vt.lightsStateVersion!==En.state.version||vt.outputColorSpace!==pt||z.isBatchedMesh&&vt.batching===!1||!z.isBatchedMesh&&vt.batching===!0||z.isBatchedMesh&&vt.batchingColor===!0&&z._colorsTexture===null||z.isBatchedMesh&&vt.batchingColor===!1&&z._colorsTexture!==null||z.isInstancedMesh&&vt.instancing===!1||!z.isInstancedMesh&&vt.instancing===!0||z.isSkinnedMesh&&vt.skinning===!1||!z.isSkinnedMesh&&vt.skinning===!0||z.isInstancedMesh&&vt.instancingColor===!0&&z.instanceColor===null||z.isInstancedMesh&&vt.instancingColor===!1&&z.instanceColor!==null||z.isInstancedMesh&&vt.instancingMorph===!0&&z.morphTexture===null||z.isInstancedMesh&&vt.instancingMorph===!1&&z.morphTexture!==null||vt.envMap!==Tt||B.fog===!0&&vt.fog!==mt||vt.numClippingPlanes!==void 0&&(vt.numClippingPlanes!==wt.numPlanes||vt.numIntersection!==wt.numIntersection)||vt.vertexAlphas!==Ft||vt.vertexTangents!==Wt||vt.morphTargets!==Mt||vt.morphNormals!==oe||vt.morphColors!==We||vt.toneMapping!==Se||vt.morphTargetsCount!==yn||!!vt.lightProbeGrid!=T.state.lightProbeGridArray.length>0)&&(te=!0):(te=!0,vt.__version=B.version);let si=vt.currentProgram;te===!0&&(si=dc(B,N,z),F&&B.isNodeMaterial&&F.onUpdateProgram(B,si,vt));let Vi=!1,Ls=!1,rr=!1,fe=si.getUniforms(),ze=vt.uniforms;if(v.useProgram(si.program)&&(Vi=!0,Ls=!0,rr=!0),B.id!==X&&(X=B.id,Ls=!0),vt.needsLights){let xe=nM(T.state.lightProbeGridArray,z);vt.lightProbeGrid!==xe&&(vt.lightProbeGrid=xe,Ls=!0)}if(Vi||tt!==S){v.buffers.depth.getReversed()&&S.reversedDepth!==!0&&(S._reversedDepth=!0,S.updateProjectionMatrix()),fe.setValue(U,"projectionMatrix",S.projectionMatrix),fe.setValue(U,"viewMatrix",S.matrixWorldInverse);let Os=fe.map.cameraPosition;Os!==void 0&&Os.setValue(U,Ce.setFromMatrixPosition(S.matrixWorld)),w.logarithmicDepthBuffer&&fe.setValue(U,"logDepthBufFC",2/(Math.log(S.far+1)/Math.LN2)),(B.isMeshPhongMaterial||B.isMeshToonMaterial||B.isMeshLambertMaterial||B.isMeshBasicMaterial||B.isMeshStandardMaterial||B.isShaderMaterial)&&fe.setValue(U,"isOrthographic",S.isOrthographicCamera===!0),tt!==S&&(tt=S,Ls=!0,rr=!0)}if(vt.needsLights&&(En.state.sunShadowMap.length>0&&fe.setValue(U,"sunShadowMap",En.state.sunShadowMap,q),En.state.directionalShadowMap.length>0&&fe.setValue(U,"directionalShadowMap",En.state.directionalShadowMap,q),En.state.spotShadowMap.length>0&&fe.setValue(U,"spotShadowMap",En.state.spotShadowMap,q),En.state.pointShadowMap.length>0&&fe.setValue(U,"pointShadowMap",En.state.pointShadowMap,q)),z.isSkinnedMesh){fe.setOptional(U,z,"bindMatrix"),fe.setOptional(U,z,"bindMatrixInverse");let xe=z.skeleton;xe&&(xe.boneTexture===null&&xe.computeBoneTexture(),fe.setValue(U,"boneTexture",xe.boneTexture,q))}z.isBatchedMesh&&(fe.setOptional(U,z,"batchingTexture"),fe.setValue(U,"batchingTexture",z._matricesTexture,q),fe.setOptional(U,z,"batchingIdTexture"),fe.setValue(U,"batchingIdTexture",z._indirectTexture,q),fe.setOptional(U,z,"batchingColorTexture"),z._colorsTexture!==null&&fe.setValue(U,"batchingColorTexture",z._colorsTexture,q));let Us=G.morphAttributes;if((Us.position!==void 0||Us.normal!==void 0||Us.color!==void 0)&&L.update(z,G,si),(Ls||vt.receiveShadow!==z.receiveShadow)&&(vt.receiveShadow=z.receiveShadow,fe.setValue(U,"receiveShadow",z.receiveShadow)),(B.isMeshStandardMaterial||B.isMeshLambertMaterial||B.isMeshPhongMaterial)&&B.envMap===null&&N.environment!==null&&(ze.envMapIntensity.value=N.environmentIntensity),ze.dfgLUT!==void 0&&(ze.dfgLUT.value=N2()),Ls){if(fe.setValue(U,"toneMappingExposure",R.toneMappingExposure),vt.needsLights&&sM(ze,rr),mt&&B.fog===!0&&At.refreshFogUniforms(ze,mt),At.refreshMaterialUniforms(ze,B,Q,W,T.state.transmissionRenderTarget[S.id]),vt.needsLights&&vt.lightProbeGrid){let xe=vt.lightProbeGrid;ze.probesSH.value=xe.texture,ze.probesMin.value.copy(xe.boundingBox.min),ze.probesMax.value.copy(xe.boundingBox.max),ze.probesResolution.value.copy(xe.resolution)}Co.upload(U,r0(vt),ze,q)}if(B.isShaderMaterial&&B.uniformsNeedUpdate===!0&&(Co.upload(U,r0(vt),ze,q),B.uniformsNeedUpdate=!1),B.isSpriteMaterial&&fe.setValue(U,"center",z.center),fe.setValue(U,"modelViewMatrix",z.modelViewMatrix),fe.setValue(U,"normalMatrix",z.normalMatrix),fe.setValue(U,"modelMatrix",z.matrixWorld),B.uniformsGroups!==void 0){let xe=B.uniformsGroups;for(let Os=0,or=xe.length;Os<or;Os++){let c0=xe[Os];nt.update(c0,si),nt.bind(c0,si)}}return si}function sM(S,N){S.ambientLightColor.needsUpdate=N,S.lightProbe.needsUpdate=N,S.sunLights.needsUpdate=N,S.sunLightShadows.needsUpdate=N,S.directionalLights.needsUpdate=N,S.directionalLightShadows.needsUpdate=N,S.pointLights.needsUpdate=N,S.pointLightShadows.needsUpdate=N,S.spotLights.needsUpdate=N,S.spotLightShadows.needsUpdate=N,S.rectAreaLights.needsUpdate=N,S.hemisphereLights.needsUpdate=N}function aM(S){return S.isMeshLambertMaterial||S.isMeshToonMaterial||S.isMeshPhongMaterial||S.isMeshStandardMaterial||S.isShadowMaterial||S.isShaderMaterial&&S.lights===!0}this.getActiveCubeFace=function(){return K},this.getActiveMipmapLevel=function(){return Y},this.getRenderTarget=function(){return it},this.setRenderTargetTextures=function(S,N,G){let B=V.get(S);B.__autoAllocateDepthBuffer=S.resolveDepthBuffer===!1,B.__autoAllocateDepthBuffer===!1&&(B.__useRenderToTexture=!1),V.get(S.texture).__webglTexture=N,V.get(S.depthTexture).__webglTexture=B.__autoAllocateDepthBuffer?void 0:G,B.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(S,N){let G=V.get(S);G.__webglFramebuffer=N,G.__useDefaultFramebuffer=N===void 0},this.setRenderTarget=function(S,N=0,G=0){it=S,K=N,Y=G;let B=null,z=!1,mt=!1;if(S){let pt=V.get(S);if(pt.__useDefaultFramebuffer!==void 0){v.bindFramebuffer(U.FRAMEBUFFER,pt.__webglFramebuffer),et.copy(S.viewport),st.copy(S.scissor),gt=S.scissorTest,v.viewport(et),v.scissor(st),v.setScissorTest(gt),X=-1;return}else if(pt.__webglFramebuffer===void 0)q.setupRenderTarget(S);else if(pt.__hasExternalTextures)q.rebindTextures(S,V.get(S.texture).__webglTexture,V.get(S.depthTexture).__webglTexture);else if(S.depthBuffer){let Ft=S.depthTexture;if(pt.__boundDepthTexture!==Ft){if(Ft!==null&&V.has(Ft)&&(S.width!==Ft.image.width||S.height!==Ft.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");q.setupDepthRenderbuffer(S)}}let bt=S.texture;(bt.isData3DTexture||bt.isDataArrayTexture||bt.isCompressedArrayTexture)&&(mt=!0);let Tt=V.get(S).__webglFramebuffer;S.isWebGLCubeRenderTarget?(Array.isArray(Tt[N])?B=Tt[N][G]:B=Tt[N],z=!0):S.samples>0&&q.useMultisampledRTT(S)===!1?B=V.get(S).__webglMultisampledFramebuffer:Array.isArray(Tt)?B=Tt[G]:B=Tt,et.copy(S.viewport),st.copy(S.scissor),gt=S.scissorTest}else et.copy(xt).multiplyScalar(Q).floor(),st.copy(Ht).multiplyScalar(Q).floor(),gt=Je;if(G!==0&&(B=D),v.bindFramebuffer(U.FRAMEBUFFER,B)&&v.drawBuffers(S,B),v.viewport(et),v.scissor(st),v.setScissorTest(gt),z){let pt=V.get(S.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_CUBE_MAP_POSITIVE_X+N,pt.__webglTexture,G)}else if(mt){let pt=N;for(let bt=0;bt<S.textures.length;bt++){let Tt=V.get(S.textures[bt]);U.framebufferTextureLayer(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0+bt,Tt.__webglTexture,G,pt)}}else if(S!==null&&G!==0){let pt=V.get(S.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,pt.__webglTexture,G)}X=-1};function l0(S){let N=V.get(S);return(N.__readFormat!==S.format||N.__readType!==S.type)&&(N.__readFormat=S.format,N.__readType=S.type,N.__formatReadable=w.textureFormatReadable(S.format),N.__typeReadable=w.textureTypeReadable(S.type)),N}this.readRenderTargetPixels=function(S,N,G,B,z,mt,_t,pt=0){if(!(S&&S.isWebGLRenderTarget)){Ut("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let bt=V.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&_t!==void 0&&(bt=bt[_t]),bt){v.bindFramebuffer(U.FRAMEBUFFER,bt);try{let Tt=S.textures[pt],Ft=Tt.format,Wt=Tt.type;S.textures.length>1&&U.readBuffer(U.COLOR_ATTACHMENT0+pt);let Mt=l0(Tt);if(Mt.__formatReadable===!1){Ut("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Mt.__typeReadable===!1){Ut("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}N>=0&&N<=S.width-B&&G>=0&&G<=S.height-z&&U.readPixels(N,G,B,z,ht.convert(Ft),ht.convert(Wt),mt)}finally{let Tt=it!==null?V.get(it).__webglFramebuffer:null;v.bindFramebuffer(U.FRAMEBUFFER,Tt)}}},this.readRenderTargetPixelsAsync=async function(S,N,G,B,z,mt,_t,pt=0){if(!(S&&S.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let bt=V.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&_t!==void 0&&(bt=bt[_t]),bt)if(N>=0&&N<=S.width-B&&G>=0&&G<=S.height-z){v.bindFramebuffer(U.FRAMEBUFFER,bt);let Tt=S.textures[pt],Ft=Tt.format,Wt=Tt.type;S.textures.length>1&&U.readBuffer(U.COLOR_ATTACHMENT0+pt);let Mt=l0(Tt);if(Mt.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Mt.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let oe=U.createBuffer();U.bindBuffer(U.PIXEL_PACK_BUFFER,oe),U.bufferData(U.PIXEL_PACK_BUFFER,mt.byteLength,U.STREAM_READ),U.readPixels(N,G,B,z,ht.convert(Ft),ht.convert(Wt),0),U.bindBuffer(U.PIXEL_PACK_BUFFER,null);let We=it!==null?V.get(it).__webglFramebuffer:null;v.bindFramebuffer(U.FRAMEBUFFER,We);let Se=U.fenceSync(U.SYNC_GPU_COMMANDS_COMPLETE,0);return U.flush(),await ub(U,Se,4),U.bindBuffer(U.PIXEL_PACK_BUFFER,oe),U.getBufferSubData(U.PIXEL_PACK_BUFFER,0,mt),U.bindBuffer(U.PIXEL_PACK_BUFFER,null),U.deleteBuffer(oe),U.deleteSync(Se),mt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(S,N=null,G=0){let B=Math.pow(2,-G),z=Math.floor(S.image.width*B),mt=Math.floor(S.image.height*B),_t=N!==null?N.x:0,pt=N!==null?N.y:0;q.setTexture2D(S,0),U.copyTexSubImage2D(U.TEXTURE_2D,G,0,0,_t,pt,z,mt),v.unbindTexture()},this.copyTextureToTexture=function(S,N,G=null,B=null,z=0,mt=0){let _t,pt,bt,Tt,Ft,Wt,Mt,oe,We,Se=S.isCompressedTexture?S.mipmaps[mt]:S.image;if(G!==null)_t=G.max.x-G.min.x,pt=G.max.y-G.min.y,bt=G.isBox3?G.max.z-G.min.z:1,Tt=G.min.x,Ft=G.min.y,Wt=G.isBox3?G.min.z:0;else{let ze=Math.pow(2,-z);_t=Math.floor(Se.width*ze),pt=Math.floor(Se.height*ze),S.isDataArrayTexture?bt=Se.depth:S.isData3DTexture?bt=Math.floor(Se.depth*ze):bt=1,Tt=0,Ft=0,Wt=0}B!==null?(Mt=B.x,oe=B.y,We=B.z):(Mt=0,oe=0,We=0);let me=ht.convert(N.format),yn=ht.convert(N.type),vt;N.isData3DTexture?(q.setTexture3D(N,0),vt=U.TEXTURE_3D):N.isDataArrayTexture||N.isCompressedArrayTexture?(q.setTexture2DArray(N,0),vt=U.TEXTURE_2D_ARRAY):(q.setTexture2D(N,0),vt=U.TEXTURE_2D),v.activeTexture(U.TEXTURE0),v.pixelStorei(U.UNPACK_FLIP_Y_WEBGL,N.flipY),v.pixelStorei(U.UNPACK_PREMULTIPLY_ALPHA_WEBGL,N.premultiplyAlpha),v.pixelStorei(U.UNPACK_ALIGNMENT,N.unpackAlignment);let En=v.getParameter(U.UNPACK_ROW_LENGTH),te=v.getParameter(U.UNPACK_IMAGE_HEIGHT),si=v.getParameter(U.UNPACK_SKIP_PIXELS),Vi=v.getParameter(U.UNPACK_SKIP_ROWS),Ls=v.getParameter(U.UNPACK_SKIP_IMAGES);v.pixelStorei(U.UNPACK_ROW_LENGTH,Se.width),v.pixelStorei(U.UNPACK_IMAGE_HEIGHT,Se.height),v.pixelStorei(U.UNPACK_SKIP_PIXELS,Tt),v.pixelStorei(U.UNPACK_SKIP_ROWS,Ft),v.pixelStorei(U.UNPACK_SKIP_IMAGES,Wt);let rr=S.isDataArrayTexture||S.isData3DTexture,fe=N.isDataArrayTexture||N.isData3DTexture;if(S.isDepthTexture){let ze=V.get(S),Us=V.get(N),xe=V.get(ze.__renderTarget),Os=V.get(Us.__renderTarget);v.bindFramebuffer(U.READ_FRAMEBUFFER,xe.__webglFramebuffer),v.bindFramebuffer(U.DRAW_FRAMEBUFFER,Os.__webglFramebuffer);for(let or=0;or<bt;or++)rr&&(U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,V.get(S).__webglTexture,z,Wt+or),U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,V.get(N).__webglTexture,mt,We+or)),U.blitFramebuffer(Tt,Ft,_t,pt,Mt,oe,_t,pt,U.DEPTH_BUFFER_BIT,U.NEAREST);v.bindFramebuffer(U.READ_FRAMEBUFFER,null),v.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else if(z!==0||S.isRenderTargetTexture||V.has(S)){let ze=V.get(S),Us=V.get(N);v.bindFramebuffer(U.READ_FRAMEBUFFER,O),v.bindFramebuffer(U.DRAW_FRAMEBUFFER,k);for(let xe=0;xe<bt;xe++)rr?U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,ze.__webglTexture,z,Wt+xe):U.framebufferTexture2D(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,ze.__webglTexture,z),fe?U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,Us.__webglTexture,mt,We+xe):U.framebufferTexture2D(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,Us.__webglTexture,mt),z!==0?U.blitFramebuffer(Tt,Ft,_t,pt,Mt,oe,_t,pt,U.COLOR_BUFFER_BIT,U.NEAREST):fe?U.copyTexSubImage3D(vt,mt,Mt,oe,We+xe,Tt,Ft,_t,pt):U.copyTexSubImage2D(vt,mt,Mt,oe,Tt,Ft,_t,pt);v.bindFramebuffer(U.READ_FRAMEBUFFER,null),v.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else fe?S.isDataTexture||S.isData3DTexture?U.texSubImage3D(vt,mt,Mt,oe,We,_t,pt,bt,me,yn,Se.data):N.isCompressedArrayTexture?U.compressedTexSubImage3D(vt,mt,Mt,oe,We,_t,pt,bt,me,Se.data):U.texSubImage3D(vt,mt,Mt,oe,We,_t,pt,bt,me,yn,Se):S.isDataTexture?U.texSubImage2D(U.TEXTURE_2D,mt,Mt,oe,_t,pt,me,yn,Se.data):S.isCompressedTexture?U.compressedTexSubImage2D(U.TEXTURE_2D,mt,Mt,oe,Se.width,Se.height,me,Se.data):U.texSubImage2D(U.TEXTURE_2D,mt,Mt,oe,_t,pt,me,yn,Se);v.pixelStorei(U.UNPACK_ROW_LENGTH,En),v.pixelStorei(U.UNPACK_IMAGE_HEIGHT,te),v.pixelStorei(U.UNPACK_SKIP_PIXELS,si),v.pixelStorei(U.UNPACK_SKIP_ROWS,Vi),v.pixelStorei(U.UNPACK_SKIP_IMAGES,Ls),mt===0&&N.generateMipmaps&&U.generateMipmap(vt),v.unbindTexture()},this.initRenderTarget=function(S){V.get(S).__webglFramebuffer===void 0&&q.setupRenderTarget(S)},this.initTexture=function(S){S.isCubeTexture?q.setTextureCube(S,0):S.isData3DTexture?q.setTexture3D(S,0):S.isDataArrayTexture||S.isCompressedArrayTexture?q.setTexture2DArray(S,0):q.setTexture2D(S,0),v.unbindTexture()},this.resetState=function(){K=0,Y=0,it=null,v.reset(),yt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Ui}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;let n=this.getContext();n.drawingBufferColorSpace=Qt._getDrawingBufferColorSpace(t),n.unpackColorSpace=Qt._getUnpackColorSpace()}};var zi={light:"#609724",dark:"#54851d",line:"#e7e9bd",track:"#a66036",rim:"#e5dcb2"};function jg(e,t,n,i=!1){let s=i?640:726;t(e,i?-160:-32,-82,s+224,510,zi.dark,-100);for(let c=-32,u=0;c<s+32;c+=54,u++)t(e,c,i?26:68,54,354,u%2?zi.light:zi.dark,-99);for(let c=76;c<356;c+=8)for(let u=2;u<s;u+=13){let p=(u*17+c*11)%29;p<4&&t(e,u,c,1,p%2+1,p%2?"#6fa12d":"#4b7d1b",-98)}let a=i?-4:-24;t(e,-30,40,s+60,34,zi.track,-97);for(let c of[43,48,53,58])t(e,-30,c,s+60,1,"#cf9362",-96);t(e,-30,a,s+60,64,"#29546b",-95);let r=["#e1c678","#c8d9e0","#ce785c","#6ba5b0","#31435e"];for(let c=0;c<6;c++){let u=a+5+c*9;t(e,-30,u+6,s+60,2,"#879b9b",-94);for(let p=-28;p<s+30;p+=7){let h=Math.abs(p*31+c*47)%r.length;t(e,p+1,u,2,2,"#d5aa7e",-93),t(e,p,u+2,4,4,r[h],-93)}}for(let c=20;c<s;c+=126){t(e,c,a,10,64,"#9caeae",-92);for(let u=a+4;u<a+64;u+=8)t(e,c,u,10,1,"#d2d9c5",-91)}t(e,-30,i?48:39,s+60,5,"#dfdcc4",-90);let o=["#d9d6b8","#225397","#d4a432","#244c69","#ac573e","#315e42"],l={A:["010","101","111","101","101"],R:["110","101","110","101","101"],C:["011","100","100","100","011"],D:["110","101","101","101","110"],E:["111","100","110","100","111"],F:["111","100","110","100","100"],O:["010","101","101","101","010"],T:["111","010","010","010","010"],B:["110","101","110","101","110"],L:["100","100","100","100","111"],P:["110","101","110","100","100"],K:["101","101","110","101","101"]};for(let c=-30,u=0;c<s+30;c+=90,u++){t(e,c,49,88,21,o[u%o.length],-89),t(e,c+3,52,82,1,"#eee6c0",-88);let p=u%2?"FOOTBALL":"ARCADE";for(let[h,d]of[...p].entries())for(let[m,b]of l[d].entries())for(let g=0;g<3;g++)b[g]==="1"&&t(e,c+7+h*9+g*2,55+m*2,2,2,"#eee6c0",-88);t(e,c+87,48,2,25,"#263d3b",-87)}if(t(e,-32,71,s+64,3,zi.rim,-86),!i){n(e,48,80,630,218,zi.line),t(e,363,80,1,218,zi.line,-40);for(let c of[48,579])n(e,c,144,99,90,zi.line);for(let c of[48,645])n(e,c,167,33,44,zi.line);for(let c=0;c<144;c++){let u=c*Math.PI*2/144;t(e,Math.round(363+Math.cos(u)*55),Math.round(189+Math.sin(u)*29),2,1,zi.line,-40)}for(let c of[114,612])t(e,c,188,2,2,zi.line,-40);for(let c of[48,678])for(let u of[80,298])t(e,c,u-15,1,16,"#e6d8a8",-39),t(e,c+1,u-15,5,4,"#e3b643",-38);for(let c of[-1,1]){let u=c<0?48:678,p=u+c*22,h=Math.min(u,p);t(e,h,134,22,77,"#526e57",-49);for(let d=136;d<211;d+=5)t(e,h,d,22,1,"#b2c3a0",-48);for(let d=h;d<=h+22;d+=4)t(e,d,134,1,77,"#b2c3a0",-48);t(e,p,134,2,77,"#d9dfbd",-47),t(e,u,91,2,120,"#f3efda",-46),t(e,h,134,24,2,"#f3efda",-46),t(e,h,209,24,2,"#d9dfbd",-46);for(let d=0;d<=22;d++)t(e,u+c*d,91+d*2,2,2,"#e9e4ce",-46),t(e,u+c*d,136+d*3.3,1,2,"#bec9ad",-47)}}}var Gf=class{constructor(t,n,i){this.assets=n;this.viewportWidth=Ci.width;this.scene=new Gl;this.pitch=new Vn;this.camera=new er(0,320,0,-224,.1,200);this.actors=new Map;this.decorations=new Map;this.meshes=[];this.ball=new Vn;this.close=new Vn;this.net=new Vn;this.target=new Vn;this.disposed=!1;this.selectionLabel=new Vn;this.gl=new Vf({canvas:t,antialias:!1,alpha:!1,preserveDrawingBuffer:!0,powerPreference:"low-power"}),this.gl.setPixelRatio(1),this.gl.setSize(Ci.width,Ci.height,!1),this.gl.outputColorSpace=Sn,this.gl.setClearColor("#0f172b"),this.camera.position.z=100,this.scene.add(this.pitch,this.close,this.ball),this.poses=new Map(n.records.map(s=>[s.id,s])),this.texture=new bn(i),this.texture.colorSpace=Sn,this.texture.minFilter=ke,this.texture.magFilter=ke,this.texture.generateMipmaps=!1,this.texture.needsUpdate=!0,jg(this.pitch,this.rect.bind(this),this.box.bind(this)),this.batchStatic(this.pitch),this.pitch.add(this.selectionLabel);for(let[s,a]of[["110","101","110","100","100"],["010","110","010","010","111"]].entries())for(let r=0;r<5;r++)for(let o=0;o<3;o++)a[r][o]==="1"&&this.rect(this.selectionLabel,s*4+o-3,r-88,1,1,"#ffffff",8002);for(let s=0;s<22;s++){let a=this.makeSprite();this.actors.set(s,a),this.pitch.add(a);let r=this.rect(this.pitch,0,0,10,2,s<11?"#5cdfff":"#ef6758",1),o=new tn(new Kl(1,12),new xi({color:"#102318",transparent:!0,depthTest:!1,depthWrite:!1}));o.scale.set(8,2,1),this.pitch.add(o),this.meshes.push(o);let l=new kn;l.setAttribute("position",new $e([-4,80,0,0,74,0,4,80,0],3));let c=new tn(l,new xi({color:"#ffffff",side:_i,transparent:!0,depthTest:!1,depthWrite:!1}));this.pitch.add(c),this.meshes.push(c),this.decorations.set(s,{marker:r,shadow:o,selection:c})}jg(this.close,this.rect.bind(this),this.box.bind(this),!0),this.batchStatic(this.close),this.close.add(this.net,this.target),this.rect(this.net,48,59,224,74,"#112322",-50);for(let s=48;s<=272;s+=8)this.rect(this.net,s,61,1,71,"#cad5e2",-49);for(let s=61;s<=132;s+=7)this.rect(this.net,48,s,224,1,"#cad5e2",-49);this.box(this.net,48,58,224,75,"#ffffff"),this.batchStatic(this.net),this.closeKeeper=this.makeSprite(),this.close.add(this.closeKeeper),this.closeMarker=this.rect(this.close,0,0,10,2,"#5cdfff",1),this.closeShadow=this.rect(this.close,0,0,7,2,"#162536",9e3),this.rect(this.target,-12,0,25,1,"#5cdfff",10010),this.rect(this.target,0,-12,1,25,"#5cdfff",10010),this.ballShadow=this.rect(this.pitch,0,0,6,2,"#162536",9e3),this.rect(this.ball,-3,-3,7,7,"#081019",1e4),this.rect(this.ball,-2,-2,5,5,"#ffffff",10001),this.rect(this.ball,-1,-1,2,2,"#1a253a",10002)}resize(t){this.viewportWidth=t,this.gl.setSize(t,Ci.height,!1)}rect(t,n,i,s,a,r,o){let l=new tn(new va(s,a),new xi({color:r,transparent:o>0,depthTest:!1,depthWrite:!1}));return l.position.set(n+s/2,-i-a/2,0),l.renderOrder=o,t.add(l),this.meshes.push(l),l}box(t,n,i,s,a,r,o=1){this.rect(t,n,i,s,o,r,-40),this.rect(t,n,i+a-o,s,o,r,-40),this.rect(t,n,i,o,a,r,-40),this.rect(t,n+s-o,i,o,a,r,-40)}makeSprite(){let t=new tn(new va(1,1),new xi({map:this.texture,transparent:!0,alphaTest:.01,depthTest:!1,depthWrite:!1}));return this.meshes.push(t),t}batchStatic(t){let n=t.children.filter(l=>l instanceof tn&&l.renderOrder<0);n.sort((l,c)=>l.renderOrder-c.renderOrder);let i=[],s=[];for(let l of n){l.updateMatrix();let c=l.geometry.toNonIndexed(),u=c.getAttribute("position");for(let p=0;p<u.count;p++){let h=new H().fromBufferAttribute(u,p).applyMatrix4(l.matrix);i.push(h.x,h.y,h.z),s.push(l.material.color.r,l.material.color.g,l.material.color.b)}c.dispose(),l.geometry.dispose(),l.material.dispose(),t.remove(l)}let a=new Set(n);this.meshes=this.meshes.filter(l=>!a.has(l));let r=new kn;r.setAttribute("position",new $e(i,3)),r.setAttribute("color",new $e(s,3));let o=new tn(r,new xi({vertexColors:!0,depthTest:!1,depthWrite:!1}));o.renderOrder=-50,t.add(o),this.meshes.push(o)}show(t,n,i,s,a){let r=this.poses.get(s.pose);if(!r)throw new Error("Missing atlas pose "+s.pose);let o=r.anchors.ground,[l,c,u,p]=r.atlas,[h,d]=this.assets.atlasSize,m=t.geometry.getAttribute("uv");m.setXY(0,l/h,1-c/d),m.setXY(1,(l+u)/h,1-c/d),m.setXY(2,l/h,1-(c+p)/d),m.setXY(3,(l+u)/h,1-(c+p)/d),m.needsUpdate=!0,t.scale.set(s.mirror?-u:u,p,1),t.position.set(Math.round(n)+(s.mirror?o[0]-u/2:u/2-o[0]),-(Math.round(i)+p/2-o[1]),0),t.renderOrder=a,t.visible=!0}render(t){if(this.disposed)return;let n=t.state,i=n.shotView;if(this.pitch.visible=!i,this.close.visible=!!i,i){this.camera.left=160-this.viewportWidth/2,this.camera.right=160+this.viewportWidth/2,this.camera.top=0,this.camera.bottom=-224,this.camera.updateProjectionMatrix();let r=n.players[i.keeper],o=Za({...r,z:0},i),l=sS(n.ball,i),c=Za(n.ball,i);this.net.position.y=-(i.planeY-133),this.show(this.closeKeeper,o.x,o.y,t.view(r),151),this.closeMarker.position.set(o.x,-o.y-5,0),this.closeMarker.renderOrder=152,this.closeMarker.material instanceof xi&&this.closeMarker.material.color.set(r.team===0?"#5cdfff":"#ef6758"),this.target.visible=i.phase==="aim",this.target.position.set(i.aim.x,-i.aim.y,0),this.ball.position.set(Math.round(l.x),-Math.round(l.y),0),this.closeShadow.visible=n.ball.z>3,this.closeShadow.position.set(Math.round(c.x),-Math.round(c.y),0),this.gl.render(this.scene,this.camera);return}for(let r of this.actors.values())r.visible=!1;for(let r of this.decorations.values())r.marker.visible=!1,r.shadow.visible=!1,r.selection.visible=!1;for(let r of n.players){let o=Es(r),l=Math.round(o.x),c=Math.round(o.y);this.show(this.actors.get(r.id),o.x,o.y,t.view(r),c);let u=this.decorations.get(r.id);u.marker.visible=!0,u.shadow.visible=!0,u.marker.position.set(l,-c-5,0),u.marker.renderOrder=c+.1,u.shadow.position.set(l,-c-2,0),u.shadow.renderOrder=c-.1,u.selection.visible=r.id===n.selected,u.selection.position.set(l,-c,0),u.selection.renderOrder=8e3}let s=Es(n.ball),a=Es(n.players[n.selected]);this.selectionLabel.position.set(Math.round(a.x),-Math.round(a.y),0),this.ball.position.set(Math.round(s.x),-Math.round(s.y-n.ball.z),0),this.ballShadow.visible=n.ball.z>3,this.ballShadow.position.set(Math.round(s.x),-Math.round(s.y),0),this.camera.left=n.camera.x,this.camera.right=n.camera.x+this.viewportWidth,this.camera.top=-n.camera.y,this.camera.bottom=-n.camera.y-224,this.camera.updateProjectionMatrix(),this.gl.render(this.scene,this.camera)}diagnostics(){return{disposed:this.disposed,geometries:this.gl.info.memory.geometries,textures:this.gl.info.memory.textures,drawCalls:this.gl.info.render.calls}}dispose(){if(!this.disposed){this.disposed=!0;for(let t of this.meshes){t.geometry.dispose();let n=t.material;Array.isArray(n)?n.forEach(i=>i.dispose()):n.dispose()}this.texture.dispose(),this.scene.clear(),this.actors.clear(),this.gl.renderLists.dispose(),this.gl.dispose(),this.gl.forceContextLoss()}}};var Wf=class{constructor(t,n,i,s={}){this.context=s;this.audio=new qu;this.previous=null;this.accumulated=0;this.raf=0;this.disposed=!1;this.unavailable=!1;this.backgrounded=!1;this.listeners=new Set;this.resultSent=!1;this.eventCursor=0;this.controller=new AbortController;this.subscribe=t=>(this.listeners.add(t),()=>{this.listeners.delete(t)});this.dispatch=t=>{if(this.disposed||this.unavailable)return;t.type!=="clear"&&!(t.type==="hold"&&!t.value)&&this.audio.unlock();let n=this.sim.state.round,i=this.sim.state.status;this.sim.command(t);let s=this.sim.state.round!==n;(this.sim.state.status!==i||s)&&(this.previous=null,this.accumulated=0),s&&(this.resultSent=!1,this.eventCursor=0),this.publish(),["start","resume"].includes(t.type)&&this.audio.ui()};this.loop=t=>{if(!this.disposed){if(this.sim.state.status==="playing"){this.previous!==null&&(this.accumulated+=Math.min(200,t-this.previous));let n=Math.min(12,Math.floor((this.accumulated+1e-7)/(1e3/60)));n&&(this.step(n),this.accumulated-=n*1e3/60),this.previous=t}else this.previous=null;this.raf=requestAnimationFrame(this.loop)}};this.sim=new Zu(n),this.renderer=new Gf(t,n,i),this.resizeObserver=new ResizeObserver(a=>{if(this.disposed)return;let r=a[0]?.contentRect;!r||r.height<1||(this.sim.setViewportWidth(224*r.width/r.height),this.renderer.resize(this.sim.viewportWidth),this.renderer.render(this.sim))}),this.resizeObserver.observe(t.parentElement),this.settings={music:.4,sfx:.7},this.setSettings(s.settings??{},!1),this.renderer.render(this.sim),this.raf=requestAnimationFrame(this.loop),t.addEventListener("webglcontextlost",a=>{this.disposed||(a.preventDefault(),this.pause(),this.unavailable=!0,this.context.onError?.("Graphics context lost. Retry loading to continue."))},{signal:this.controller.signal})}publish(){this.renderer.render(this.sim);for(let t of this.sim.state.events){let n=Number(t.sequence);n>this.eventCursor&&(this.eventCursor=n,this.audio.event(t),this.context.onEvent?.(structuredClone(t)))}this.audio.sync(this.backgrounded?"hidden":this.sim.state.status),this.sim.state.status==="complete"&&(this.resultSent||(this.resultSent=!0,this.context.onResult?.(this.result())));for(let t of this.listeners)t()}result(){let t=this.sim.state;return{schemaVersion:2,gameId:"retro-football",mode:"exhibition",airContacts:[...t.airContacts],airCollections:[...t.airCollections],outcome:t.score[0]===t.score[1]?"draw":t.score[0]>t.score[1]?"win":"loss",score:[...t.score],halves:2,activeSeconds:180,passes:[...t.passes],shots:[...t.shots],saves:[...t.saves],rulesVersion:Ai.rulesVersion,runtimeVersion:Ai.runtimeVersion,assetVersion:Ai.assetVersion}}step(t=1){if(!(this.disposed||this.unavailable)){for(let n=0;n<t;n++)this.sim.step();this.publish()}}start(){this.dispatch({type:"start"})}pause(){this.sim.state.status==="playing"?this.dispatch({type:"pause"}):this.dispatch({type:"clear"})}resume(){this.dispatch({type:"resume"})}setBackground(t){this.disposed||(this.backgrounded=t,t?this.pause():this.audio.sync(this.sim.state.status))}restart(){this.disposed||this.unavailable||(this.audio.unlock(),this.sim.restart(),this.previous=null,this.accumulated=0,this.resultSent=!1,this.eventCursor=0,this.publish())}setSettings(t,n=!0){if(!this.disposed){for(let i of["music","sfx"]){let s=t[i];s!==void 0&&Number.isFinite(s)&&(this.settings[i]=Math.max(0,Math.min(1,s)))}this.audio.setSettings(this.settings),n&&this.context.onSettingsChange?.({...this.settings})}}diagnostics(){return{...this.renderer.diagnostics(),listeners:this.listeners.size,audio:this.audio.diagnostics(),pendingFrame:!this.disposed}}dispose(){this.disposed||(this.disposed=!0,this.controller.abort(),this.resizeObserver.disconnect(),cancelAnimationFrame(this.raf),this.sim.clear(),this.listeners.clear(),this.renderer.dispose(),this.audio.dispose(),this.previous=null,this.accumulated=0)}};async function Wb(e,t){let n=await fetch(e,{signal:t});if(!n.ok)throw new Error("Asset manifest could not load.");let i=await n.json();if(i.schemaVersion!==1||i.version!=="football-handheld-atlas-v1"||i.approval!=="reference"||i.records.length!==79)throw new Error("Unsupported football asset manifest.");let s=new URL(i.atlasUrl,e);if(s.origin!==e.origin)throw new Error("Unexpected atlas origin.");let a=await fetch(s,{signal:t});if(!a.ok)throw new Error("Team atlas could not load.");let r=await a.arrayBuffer(),o=await crypto.subtle.digest("SHA-256",r);if(Array.from(new Uint8Array(o),u=>u.toString(16).padStart(2,"0")).join("")!==i.atlasSha256)throw new Error("Team atlas integrity check failed.");if(t.aborted)throw new DOMException("Aborted","AbortError");let c=URL.createObjectURL(new Blob([r],{type:"image/png"}));try{let u=new Image;if(u.src=c,await u.decode(),t.aborted)throw new DOMException("Aborted","AbortError");if(u.naturalWidth!==i.atlasSize[0]||u.naturalHeight!==i.atlasSize[1])throw new Error("Team atlas dimensions changed.");return{manifest:i,image:u}}finally{URL.revokeObjectURL(c)}}function Xb(e,t){let n=new AbortController,i={signal:n.signal},s={arrowleft:"left",a:"left",arrowright:"right",d:"right",arrowup:"up",w:"up",arrowdown:"down",s:"down"},a={j:"A",k:"B",l:"C"};document.addEventListener("keydown",c=>{if(c.target?.matches("input,select,textarea"))return;if(c.key==="Escape"&&!c.repeat){c.preventDefault(),t.dispatch({type:"pause"});return}let u=s[c.key.toLowerCase()];u&&(c.preventDefault(),t.dispatch({type:"hold",key:u,value:!0,source:"keyboard:"+c.code}));let p=a[c.key.toLowerCase()];p&&!c.repeat&&(c.preventDefault(),t.dispatch({type:p}))},i),document.addEventListener("keyup",c=>{let u=s[c.key.toLowerCase()];u&&t.dispatch({type:"hold",key:u,value:!1,source:"keyboard:"+c.code})},i);let r=new Set;e.addEventListener("pointerdown",c=>{let u=c.target.closest("button[data-hold],button[data-action]");if(!u||u.disabled)return;c.preventDefault(),u.setPointerCapture(c.pointerId),r.add(c.pointerId),u.dataset.pressed="true";let p=u.dataset.hold,h=u.dataset.action;p?t.dispatch({type:"hold",key:p,value:!0,source:"pointer:"+c.pointerId}):h&&t.dispatch({type:h})},i);let o=c=>{let u=c.target.closest("button[data-hold],button[data-action]");if(!u)return;delete u.dataset.pressed,r.delete(c.pointerId);let p=u.dataset.hold;p&&t.dispatch({type:"hold",key:p,value:!1,source:"pointer:"+c.pointerId})};for(let c of["pointerup","pointercancel","lostpointercapture"])e.addEventListener(c,o,i);let l=()=>{t.setBackground(!0);for(let c of e.querySelectorAll("[data-pressed]"))delete c.dataset.pressed;r.clear()};return window.addEventListener("blur",l,i),window.addEventListener("focus",()=>{document.hidden||t.setBackground(!1)},i),document.addEventListener("visibilitychange",()=>{document.hidden?l():t.setBackground(!1)},i),document.hidden&&l(),()=>{n.abort(),r.clear();for(let c of e.querySelectorAll("[data-pressed]"))delete c.dataset.pressed;t.sim.clear()}}var qb=1;function Yb(){let e=new URL(location.href).searchParams,t=e.get("session")??crypto.randomUUID(),n=window.parent!==window&&e.get("host")==="web",i=window.RetroFootballHost,s=null,a=!1,r=!n,o=0,l=new AbortController,c=(m,b={})=>{if(a)return;let g={protocolVersion:qb,gameId:Ai.id,sessionId:t,type:m,payload:b};n?parent.postMessage(g,location.origin):i?.postMessage(JSON.stringify(g))},u=m=>{if(!m||typeof m!="object")return null;let b=m,g={};for(let f of["music","sfx"])if(b[f]!==void 0){if(typeof b[f]!="number"||!Number.isFinite(b[f])||b[f]<0||b[f]>1)return null;g[f]=b[f]}return g},p=m=>{if(a||!s||!m||typeof m!="object")return;let b=m;if(!(b.protocolVersion!==qb||b.gameId!==Ai.id||b.sessionId!==t)){if(b.type==="launch"){let g=u(b.payload);if(!g)return;r=!0,s.setSettings(g),c("launched",Ai)}else if(r)if(b.type==="pause")s.pause();else if(b.type==="resume")s.resume();else if(b.type==="settings"){let g=u(b.payload);g&&s.setSettings(g)}else b.type==="dispose"&&(s.dispose(),c("disposed"),a=!0,l.abort())}};return window.addEventListener("message",m=>{n&&m.source===parent&&m.origin===location.origin&&p(m.data)},{signal:l.signal}),i&&Object.assign(window,{retroFootballHostV1:{receive:p}}),{context:{onReady:m=>{s=m,c("ready",Ai)},onResult:m=>c("result",{resultId:t+":"+ ++o,result:m}),onSettingsChange:m=>c("settings",m),onError:m=>c("error",{message:m}),onExit:n||i?()=>c("exit"):void 0},dispose(){a||(a=!0,l.abort(),s=null,i&&delete window.retroFootballHostV1)}}}var rt=pc($g()),Rn={session:null,ready:!1,mounts:0,disposals:0,lastDisposal:null,step:e=>Rn.session?.step(e),restart:()=>Rn.session?.restart(),dispose:()=>{},remount:()=>{}};window.productionLab=Rn;var hc=window.frameElement?.ownerDocument??document;function I2({context:e,manifestUrl:t}){let n=(0,Be.useRef)(null),i=(0,Be.useRef)(null),s=(0,Be.useRef)(null),[a,r]=(0,Be.useState)(null),[o,l]=(0,Be.useState)(0),[c,u]=(0,Be.useState)(0),[p,h]=(0,Be.useState)(!1),[d,m]=(0,Be.useState)(""),[b,g]=(0,Be.useState)(!1),[f,y]=(0,Be.useState)(!1),[M,x]=(0,Be.useState)(!1),[E,T]=(0,Be.useState)(!1),[C,_]=(0,Be.useState)(""),A=(0,Be.useRef)(null),R=(0,Be.useRef)(null);(0,Be.useEffect)(()=>{let st=new AbortController,gt=()=>{},Yt=()=>{};return Rn.ready=!1,Wb(t,st.signal).then(({manifest:Rt,image:Zt})=>{if(st.signal.aborted)return;let W=new Wf(i.current,Rt,Zt,{...e,onError:Q=>{m(Q),h(!1),Rn.ready=!1,e.onError?.(Q)}});s.current=W,r(W),Rn.session=W,Rn.mounts++,gt=Xb(n.current,W),Yt=W.subscribe(()=>{window.gameState=W.sim.snapshot(),l(Q=>Q+1)}),window.gameState=W.sim.snapshot(),e.onReady?.(W),h(!0),Rn.ready=!0}).catch(Rt=>{st.signal.aborted||(m(Rt instanceof Error?Rt.message:"The game could not load."),e.onError?.("Retro Football could not load."))}),()=>{st.abort(),gt(),Yt();let Rt=s.current;Rt&&(Rt.dispose(),Rn.lastDisposal=Rt.diagnostics(),Rn.disposals++),s.current=null,Rn.session=null,Rn.ready=!1}},[e,t,c]);let I=()=>{h(!1),m(""),r(null),u(st=>st+1)};(0,Be.useEffect)(()=>(Rn.remount=()=>{h(!1),m(""),r(null),u(st=>st+1)},()=>{Rn.remount=()=>{}}),[]),(0,Be.useEffect)(()=>{let st=()=>T(!!hc.fullscreenElement);return hc.addEventListener("fullscreenchange",st),()=>hc.removeEventListener("fullscreenchange",st)},[]),(0,Be.useEffect)(()=>{if(!b)return;let gt=R.current?.querySelectorAll("button,input");gt?.[0]?.focus();let Yt=Rt=>{if(Rt.key==="Escape"&&(Rt.preventDefault(),Rt.stopImmediatePropagation(),g(!1),A.current?.focus()),Rt.key==="Tab"&&gt?.length){let Zt=gt[0],W=gt[gt.length-1];Rt.shiftKey&&document.activeElement===Zt?(Rt.preventDefault(),W.focus()):!Rt.shiftKey&&document.activeElement===W&&(Rt.preventDefault(),Zt.focus())}};return document.addEventListener("keydown",Yt,!0),()=>document.removeEventListener("keydown",Yt,!0)},[b]);let F=async()=>{try{if(hc.fullscreenElement){await hc.exitFullscreen();return}await(window.frameElement instanceof HTMLIFrameElement?window.frameElement:document.documentElement).requestFullscreen(),await screen.orientation?.lock?.("landscape").catch(()=>{}),_("")}catch{_("Use landscape or add this game to your home screen for the largest view.")}},D=a?.sim.state,O=D?.status==="playing",k=D?Math.max(0,90-Math.floor(D.halfTicks/60)):90,K=D?.shotView?.phase==="aim"?"SHOOT":D?.phase==="restart"?D.restart?.kind==="throw-in"?"THROW":"KICK":D&&D.owner===D.selected?D.players[D.selected]&&a.sim.attack(0)*(D.players[D.selected].x-52.5)>18?"CHANCE":"PASS":D?.aerial&&D.aerial.controlledBy===null?"CONTROL":"TACKLE",Y=!p||!O||D?.phase==="goal"||!!D?.shotView&&D.shotView.phase!=="aim",it=d?"LOAD ERROR":p?D?.status==="playing"?D.shotView?.phase==="aim"?"CHANCE":D.phase==="restart"?"KICK OFF":D.phase==="goal"?"GOAL!":"EXHIBITION":D?.status.toUpperCase():"LOADING",X=()=>{g(!1),D?.status==="paused"?s.current?.resume():s.current?.start()},tt=()=>{s.current?.pause(),g(!0)},et=()=>{s.current?.pause(),e.onExit?e.onExit():(s.current?.restart(),g(!1))};return(0,rt.jsxs)("main",{ref:n,className:"handheld "+(f?"screen-only ":"")+(M?"portrait-allowed":""),"data-render":o,children:[(0,rt.jsx)("div",{className:"console-edge",children:(0,rt.jsxs)("div",{className:"console-body",children:[(0,rt.jsxs)("header",{className:"console-brand",children:[(0,rt.jsxs)("span",{children:["STATOZ",(0,rt.jsx)("span",{className:"brand-sub",children:"POCKET ARCADE"})]}),(0,rt.jsx)("span",{className:"brand-game",children:"RETRO FOOTBALL"}),(0,rt.jsxs)("span",{className:"power-light",children:["POWER ",(0,rt.jsx)("i",{})]})]}),(0,rt.jsxs)("aside",{className:"left-grip","aria-label":"Directional controls",children:[(0,rt.jsx)("span",{className:"grip-caption",children:"DIRECTION"}),(0,rt.jsxs)("div",{className:"dpad","aria-label":"Move or aim",children:[["up","left","down","right"].map(st=>(0,rt.jsx)("button",{className:"direction "+st,"data-hold":st,disabled:Y,"data-pressed":D?.held[st]?"true":void 0,"aria-label":"Move "+st,children:{up:"\u25B2",left:"\u25C0",down:"\u25BC",right:"\u25B6"}[st]},st)),(0,rt.jsx)("span",{className:"pad-centre"})]}),(0,rt.jsxs)("div",{className:"speaker","aria-hidden":"true",children:[(0,rt.jsx)("i",{}),(0,rt.jsx)("i",{}),(0,rt.jsx)("i",{}),(0,rt.jsx)("i",{})]}),(0,rt.jsx)("button",{className:"small-button",onClick:()=>y(st=>!st),"aria-pressed":f,children:"SCREEN +"}),(0,rt.jsx)("span",{className:"control-help",children:"WASD / ARROWS"})]}),(0,rt.jsx)("section",{className:"screen-bezel","aria-label":"Game display",children:(0,rt.jsxs)("div",{className:"glass",children:[(0,rt.jsx)("canvas",{width:Ci.width,height:Ci.height,ref:i,"aria-label":"Retro Football live pitch"},c),(0,rt.jsxs)("div",{className:"scoreboard","aria-label":"Match score and clock",children:[(0,rt.jsxs)("span",{className:"team-name harbour",children:["HARBOUR ",(0,rt.jsx)("b",{id:"home-score",children:D?.score[0]??0})]}),(0,rt.jsxs)("span",{className:"clock-block",children:[(0,rt.jsxs)("small",{children:["HALF ",D?.half??1]}),(0,rt.jsxs)("b",{id:"clock",children:[Math.floor(k/60),":",String(k%60).padStart(2,"0")]})]}),(0,rt.jsxs)("span",{className:"team-name orchard",children:[(0,rt.jsx)("b",{id:"away-score",children:D?.score[1]??0})," ORCHARD"]})]}),(0,rt.jsx)("span",{id:"state",className:"game-state",children:it}),D?.phase==="goal"&&(0,rt.jsx)("div",{className:"goal-banner",children:"GOAL!"}),(0,rt.jsxs)("div",{className:"radar",hidden:!!D?.shotView,"aria-label":"Pitch overview",children:[(0,rt.jsx)("i",{className:"halfway"}),D?.players.map(st=>(0,rt.jsx)("i",{className:"dot "+(st.team===0?"harbour":"orchard")+(st.id===D.selected?" selected":""),style:{left:st.x/105*100+"%",top:st.y/68*100+"%"}},st.id)),D&&(0,rt.jsx)("i",{className:"radar-ball",style:{left:D.ball.x/105*100+"%",top:D.ball.y/68*100+"%"}})]}),(0,rt.jsx)("p",{className:"match-message",id:"message",role:"status",children:d||D?.message||"Loading the stadium\u2026"}),(!p||d||D?.status!=="playing")&&!b&&(0,rt.jsx)("div",{className:"game-overlay",children:(0,rt.jsxs)("section",{className:"title-card",children:[(0,rt.jsx)("span",{className:"cartridge-label",children:"STATOZ INTERNATIONAL"}),(0,rt.jsx)("h1",{children:D?.status==="complete"?"FULL TIME":D?.status==="halftime"?"HALF TIME":D?.status==="paused"?"PAUSED":"RETRO FOOTBALL"}),(0,rt.jsx)("p",{children:d||(p?D?.status==="complete"?`${D.score[0]} : ${D.score[1]} \xB7 ${D.score[0]===D.score[1]?"DRAW":D.score[0]>D.score[1]?"HARBOUR WINS":"ORCHARD WINS"}`:D?.status==="halftime"?"Switch ends. One more half.":"HARBOUR ATHLETIC \xD7 ORCHARD UNITED":"Loading your cartridge\u2026")}),d?(0,rt.jsx)("button",{id:"retry",className:"primary",onClick:I,children:"RETRY CARTRIDGE"}):D?.status==="complete"?(0,rt.jsx)("button",{id:"restart",className:"primary",onClick:()=>s.current?.restart(),children:"REMATCH"}):(0,rt.jsx)("button",{id:"start",className:"primary",disabled:!p,onClick:X,children:D?.status==="paused"?"RESUME MATCH":D?.status==="halftime"?"SECOND HALF":"KICK OFF"}),(0,rt.jsx)("small",{children:"11 V 11 \xB7 TWO 90-SECOND HALVES"})]})})]})}),(0,rt.jsxs)("aside",{className:"right-grip","aria-label":"Action controls",children:[(0,rt.jsx)("span",{className:"grip-caption",children:"THREE BUTTON PLAY"}),(0,rt.jsx)("div",{className:"action-cluster",children:["A","B","C"].map((st,gt)=>(0,rt.jsxs)("button",{className:"action action-"+st,id:st,"data-action":st,disabled:Y||!!D?.shotView&&st!=="A","aria-label":st+" "+[K,"High pass","Short pass or switch"][gt],onClick:Yt=>{Yt.detail===0&&s.current?.dispatch({type:st})},children:[(0,rt.jsx)("b",{children:st}),(0,rt.jsx)("small",{children:[K,"LOFT","SWITCH"][gt]})]},st))}),(0,rt.jsx)("span",{className:"control-help",children:"J / K / L"}),(0,rt.jsx)("button",{ref:A,className:"small-button",id:"menu",onClick:tt,children:"MENU"})]}),(0,rt.jsxs)("footer",{className:"console-footer",children:[(0,rt.jsx)("button",{className:"utility",id:"pause",disabled:!p||!["playing","paused"].includes(D?.status||""),onClick:()=>s.current?.dispatch({type:"pause"}),children:D?.status==="paused"?"RESUME":"PAUSE"}),(0,rt.jsxs)("span",{className:"footer-status",children:[D?.half===2?"\u25C0":"\u25B6"," HARBOUR ATTACKS ",D?.half===2?"LEFT":"RIGHT"]}),(0,rt.jsx)("button",{className:"utility",id:"fullscreen",onClick:()=>{F()},children:E?"WINDOW":"FULL SCREEN"}),(0,rt.jsx)("button",{className:"utility",id:"exit",onClick:et,children:"EXIT"})]})]})}),C&&(0,rt.jsx)("p",{className:"screen-hint",role:"status",children:C}),(0,rt.jsxs)("div",{className:"portrait-guide",children:[(0,rt.jsx)("span",{className:"rotate-device","aria-hidden":"true",children:"\u21BB"}),(0,rt.jsx)("h2",{children:"TURN TO LANDSCAPE"}),(0,rt.jsx)("p",{children:"Your handheld fills the wide screen."}),(0,rt.jsx)("button",{className:"primary",onClick:()=>{F()},children:"ENTER FULL SCREEN"}),(0,rt.jsx)("button",{className:"utility",onClick:()=>x(!0),children:"CONTINUE IN PORTRAIT"})]}),b&&(0,rt.jsx)("div",{className:"menu-backdrop",children:(0,rt.jsxs)("div",{ref:R,className:"settings-panel",role:"dialog","aria-modal":"true","aria-labelledby":"menu-title",children:[(0,rt.jsx)("span",{className:"cartridge-label",children:"POCKET ARCADE"}),(0,rt.jsx)("h2",{id:"menu-title",children:"MATCH MENU"}),(0,rt.jsx)("button",{className:"primary",onClick:()=>{g(!1),D?.status==="paused"&&s.current?.resume()},children:"BACK TO GAME"}),(0,rt.jsx)("div",{className:"audio-settings",children:["music","sfx"].map(st=>(0,rt.jsxs)("label",{children:[st==="music"?"Music":"Sound effects",(0,rt.jsx)("input",{"aria-label":st==="music"?"Music volume":"Sound effects volume",type:"range",min:"0",max:"1",step:".05",value:a?.settings[st]??.4,onChange:gt=>{s.current?.audio.unlock(),s.current?.setSettings({[st]:Number(gt.currentTarget.value)}),l(Yt=>Yt+1)}})]},st))}),(0,rt.jsx)("p",{children:"Move / aim: arrows or WASD. J passes, tackles or shoots in CHANCE. K lofts. L switches or plays short."}),(0,rt.jsx)("p",{className:"review-note",children:"Invented clubs. Source-derived reference art. Original sound. Local exhibition."}),(0,rt.jsx)("button",{className:"utility",onClick:()=>{s.current?.restart(),g(!1)},children:"RESTART MATCH"}),(0,rt.jsx)("button",{className:"utility",onClick:et,children:"EXIT TO GAMES"})]})})]})}function P2(e,t={},n=new URL("./assets.json",import.meta.url)){let i=(0,jb.createRoot)(e),s=!1;return i.render((0,rt.jsx)(I2,{context:t,manifestUrl:n})),{definition:Ai,dispose(){s||(s=!0,i.unmount())}}}var Qb=document.getElementById("game");if(Qb){let e=Yb(),t=P2(Qb,e.context,new URL("./assets.json",import.meta.url));Rn.dispose=()=>{e.dispose(),t.dispose()}}export{P2 as mountFootball};
/*! Bundled license information:

react/cjs/react.production.js:
  (**
   * @license React
   * react.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

scheduler/cjs/scheduler.production.js:
  (**
   * @license React
   * scheduler.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react-dom/cjs/react-dom.production.js:
  (**
   * @license React
   * react-dom.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react-dom/cjs/react-dom-client.production.js:
  (**
   * @license React
   * react-dom-client.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react/cjs/react-jsx-runtime.production.js:
  (**
   * @license React
   * react-jsx-runtime.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

three/build/three.core.js:
three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2026 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
