var $b=Object.create;var r0=Object.defineProperty;var tM=Object.getOwnPropertyDescriptor;var eM=Object.getOwnPropertyNames;var nM=Object.getPrototypeOf,iM=Object.prototype.hasOwnProperty;var Vi=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports);var sM=(e,t,n,i)=>{if(t&&typeof t=="object"||typeof t=="function")for(let s of eM(t))!iM.call(e,s)&&s!==n&&r0(e,s,{get:()=>t[s],enumerable:!(i=tM(t,s))||i.enumerable});return e};var hc=(e,t,n)=>(n=e!=null?$b(nM(e)):{},sM(t||!e||!e.__esModule?r0(n,"default",{value:e,enumerable:!0}):n,e));var v0=Vi(It=>{"use strict";var Yf=Symbol.for("react.transitional.element"),aM=Symbol.for("react.portal"),rM=Symbol.for("react.fragment"),oM=Symbol.for("react.strict_mode"),lM=Symbol.for("react.profiler"),cM=Symbol.for("react.consumer"),uM=Symbol.for("react.context"),hM=Symbol.for("react.forward_ref"),fM=Symbol.for("react.suspense"),dM=Symbol.for("react.memo"),d0=Symbol.for("react.lazy"),pM=Symbol.for("react.activity"),c0=Symbol.iterator;function mM(e){return e===null||typeof e!="object"?null:(e=c0&&e[c0]||e["@@iterator"],typeof e=="function"?e:null)}var p0={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},m0=Object.assign,g0={};function or(e,t,n){this.props=e,this.context=t,this.refs=g0,this.updater=n||p0}or.prototype.isReactComponent={};or.prototype.setState=function(e,t){if(typeof e!="object"&&typeof e!="function"&&e!=null)throw Error("takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,e,t,"setState")};or.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")};function y0(){}y0.prototype=or.prototype;function Zf(e,t,n){this.props=e,this.context=t,this.refs=g0,this.updater=n||p0}var Jf=Zf.prototype=new y0;Jf.constructor=Zf;m0(Jf,or.prototype);Jf.isPureReactComponent=!0;var u0=Array.isArray;function qf(){}var be={H:null,A:null,T:null,S:null},_0=Object.prototype.hasOwnProperty;function Kf(e,t,n){var i=n.ref;return{$$typeof:Yf,type:e,key:t,ref:i!==void 0?i:null,props:n}}function gM(e,t){return Kf(e.type,t,e.props)}function Qf(e){return typeof e=="object"&&e!==null&&e.$$typeof===Yf}function yM(e){var t={"=":"=0",":":"=2"};return"$"+e.replace(/[=:]/g,function(n){return t[n]})}var h0=/\/+/g;function Xf(e,t){return typeof e=="object"&&e!==null&&e.key!=null?yM(""+e.key):t.toString(36)}function _M(e){switch(e.status){case"fulfilled":return e.value;case"rejected":throw e.reason;default:switch(typeof e.status=="string"?e.then(qf,qf):(e.status="pending",e.then(function(t){e.status==="pending"&&(e.status="fulfilled",e.value=t)},function(t){e.status==="pending"&&(e.status="rejected",e.reason=t)})),e.status){case"fulfilled":return e.value;case"rejected":throw e.reason}}throw e}function rr(e,t,n,i,s){var a=typeof e;(a==="undefined"||a==="boolean")&&(e=null);var r=!1;if(e===null)r=!0;else switch(a){case"bigint":case"string":case"number":r=!0;break;case"object":switch(e.$$typeof){case Yf:case aM:r=!0;break;case d0:return r=e._init,rr(r(e._payload),t,n,i,s)}}if(r)return s=s(e),r=i===""?"."+Xf(e,0):i,u0(s)?(n="",r!=null&&(n=r.replace(h0,"$&/")+"/"),rr(s,t,n,"",function(c){return c})):s!=null&&(Qf(s)&&(s=gM(s,n+(s.key==null||e&&e.key===s.key?"":(""+s.key).replace(h0,"$&/")+"/")+r)),t.push(s)),1;r=0;var o=i===""?".":i+":";if(u0(e))for(var l=0;l<e.length;l++)i=e[l],a=o+Xf(i,l),r+=rr(i,t,n,a,s);else if(l=mM(e),typeof l=="function")for(e=l.call(e),l=0;!(i=e.next()).done;)i=i.value,a=o+Xf(i,l++),r+=rr(i,t,n,a,s);else if(a==="object"){if(typeof e.then=="function")return rr(_M(e),t,n,i,s);throw t=String(e),Error("Objects are not valid as a React child (found: "+(t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t)+"). If you meant to render a collection of children, use an array instead.")}return r}function fc(e,t,n){if(e==null)return e;var i=[],s=0;return rr(e,i,"","",function(a){return t.call(n,a,s++)}),i}function vM(e){if(e._status===-1){var t=e._result;t=t(),t.then(function(n){(e._status===0||e._status===-1)&&(e._status=1,e._result=n)},function(n){(e._status===0||e._status===-1)&&(e._status=2,e._result=n)}),e._status===-1&&(e._status=0,e._result=t)}if(e._status===1)return e._result.default;throw e._result}var f0=typeof reportError=="function"?reportError:function(e){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var t=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof e=="object"&&e!==null&&typeof e.message=="string"?String(e.message):String(e),error:e});if(!window.dispatchEvent(t))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",e);return}console.error(e)},xM={map:fc,forEach:function(e,t,n){fc(e,function(){t.apply(this,arguments)},n)},count:function(e){var t=0;return fc(e,function(){t++}),t},toArray:function(e){return fc(e,function(t){return t})||[]},only:function(e){if(!Qf(e))throw Error("React.Children.only expected to receive a single React element child.");return e}};It.Activity=pM;It.Children=xM;It.Component=or;It.Fragment=rM;It.Profiler=lM;It.PureComponent=Zf;It.StrictMode=oM;It.Suspense=fM;It.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=be;It.__COMPILER_RUNTIME={__proto__:null,c:function(e){return be.H.useMemoCache(e)}};It.cache=function(e){return function(){return e.apply(null,arguments)}};It.cacheSignal=function(){return null};It.cloneElement=function(e,t,n){if(e==null)throw Error("The argument must be a React element, but you passed "+e+".");var i=m0({},e.props),s=e.key;if(t!=null)for(a in t.key!==void 0&&(s=""+t.key),t)!_0.call(t,a)||a==="key"||a==="__self"||a==="__source"||a==="ref"&&t.ref===void 0||(i[a]=t[a]);var a=arguments.length-2;if(a===1)i.children=n;else if(1<a){for(var r=Array(a),o=0;o<a;o++)r[o]=arguments[o+2];i.children=r}return Kf(e.type,s,i)};It.createContext=function(e){return e={$$typeof:uM,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null},e.Provider=e,e.Consumer={$$typeof:cM,_context:e},e};It.createElement=function(e,t,n){var i,s={},a=null;if(t!=null)for(i in t.key!==void 0&&(a=""+t.key),t)_0.call(t,i)&&i!=="key"&&i!=="__self"&&i!=="__source"&&(s[i]=t[i]);var r=arguments.length-2;if(r===1)s.children=n;else if(1<r){for(var o=Array(r),l=0;l<r;l++)o[l]=arguments[l+2];s.children=o}if(e&&e.defaultProps)for(i in r=e.defaultProps,r)s[i]===void 0&&(s[i]=r[i]);return Kf(e,a,s)};It.createRef=function(){return{current:null}};It.forwardRef=function(e){return{$$typeof:hM,render:e}};It.isValidElement=Qf;It.lazy=function(e){return{$$typeof:d0,_payload:{_status:-1,_result:e},_init:vM}};It.memo=function(e,t){return{$$typeof:dM,type:e,compare:t===void 0?null:t}};It.startTransition=function(e){var t=be.T,n={};be.T=n;try{var i=e(),s=be.S;s!==null&&s(n,i),typeof i=="object"&&i!==null&&typeof i.then=="function"&&i.then(qf,f0)}catch(a){f0(a)}finally{t!==null&&n.types!==null&&(t.types=n.types),be.T=t}};It.unstable_useCacheRefresh=function(){return be.H.useCacheRefresh()};It.use=function(e){return be.H.use(e)};It.useActionState=function(e,t,n){return be.H.useActionState(e,t,n)};It.useCallback=function(e,t){return be.H.useCallback(e,t)};It.useContext=function(e){return be.H.useContext(e)};It.useDebugValue=function(){};It.useDeferredValue=function(e,t){return be.H.useDeferredValue(e,t)};It.useEffect=function(e,t){return be.H.useEffect(e,t)};It.useEffectEvent=function(e){return be.H.useEffectEvent(e)};It.useId=function(){return be.H.useId()};It.useImperativeHandle=function(e,t,n){return be.H.useImperativeHandle(e,t,n)};It.useInsertionEffect=function(e,t){return be.H.useInsertionEffect(e,t)};It.useLayoutEffect=function(e,t){return be.H.useLayoutEffect(e,t)};It.useMemo=function(e,t){return be.H.useMemo(e,t)};It.useOptimistic=function(e,t){return be.H.useOptimistic(e,t)};It.useReducer=function(e,t,n){return be.H.useReducer(e,t,n)};It.useRef=function(e){return be.H.useRef(e)};It.useState=function(e){return be.H.useState(e)};It.useSyncExternalStore=function(e,t,n){return be.H.useSyncExternalStore(e,t,n)};It.useTransition=function(){return be.H.useTransition()};It.version="19.2.8"});var dc=Vi((I2,x0)=>{"use strict";x0.exports=v0()});var D0=Vi(Re=>{"use strict";function ed(e,t){var n=e.length;e.push(t);t:for(;0<n;){var i=n-1>>>1,s=e[i];if(0<pc(s,t))e[i]=t,e[n]=s,n=i;else break t}}function Hi(e){return e.length===0?null:e[0]}function gc(e){if(e.length===0)return null;var t=e[0],n=e.pop();if(n!==t){e[0]=n;t:for(var i=0,s=e.length,a=s>>>1;i<a;){var r=2*(i+1)-1,o=e[r],l=r+1,c=e[l];if(0>pc(o,n))l<s&&0>pc(c,o)?(e[i]=c,e[l]=n,i=l):(e[i]=o,e[r]=n,i=r);else if(l<s&&0>pc(c,n))e[i]=c,e[l]=n,i=l;else break t}}return t}function pc(e,t){var n=e.sortIndex-t.sortIndex;return n!==0?n:e.id-t.id}Re.unstable_now=void 0;typeof performance=="object"&&typeof performance.now=="function"?(S0=performance,Re.unstable_now=function(){return S0.now()}):(jf=Date,b0=jf.now(),Re.unstable_now=function(){return jf.now()-b0});var S0,jf,b0,is=[],Ls=[],SM=1,si=null,yn=3,nd=!1,Co=!1,Ro=!1,id=!1,E0=typeof setTimeout=="function"?setTimeout:null,A0=typeof clearTimeout=="function"?clearTimeout:null,M0=typeof setImmediate<"u"?setImmediate:null;function mc(e){for(var t=Hi(Ls);t!==null;){if(t.callback===null)gc(Ls);else if(t.startTime<=e)gc(Ls),t.sortIndex=t.expirationTime,ed(is,t);else break;t=Hi(Ls)}}function sd(e){if(Ro=!1,mc(e),!Co)if(Hi(is)!==null)Co=!0,cr||(cr=!0,lr());else{var t=Hi(Ls);t!==null&&ad(sd,t.startTime-e)}}var cr=!1,Do=-1,w0=5,C0=-1;function R0(){return id?!0:!(Re.unstable_now()-C0<w0)}function $f(){if(id=!1,cr){var e=Re.unstable_now();C0=e;var t=!0;try{t:{Co=!1,Ro&&(Ro=!1,A0(Do),Do=-1),nd=!0;var n=yn;try{e:{for(mc(e),si=Hi(is);si!==null&&!(si.expirationTime>e&&R0());){var i=si.callback;if(typeof i=="function"){si.callback=null,yn=si.priorityLevel;var s=i(si.expirationTime<=e);if(e=Re.unstable_now(),typeof s=="function"){si.callback=s,mc(e),t=!0;break e}si===Hi(is)&&gc(is),mc(e)}else gc(is);si=Hi(is)}if(si!==null)t=!0;else{var a=Hi(Ls);a!==null&&ad(sd,a.startTime-e),t=!1}}break t}finally{si=null,yn=n,nd=!1}t=void 0}}finally{t?lr():cr=!1}}}var lr;typeof M0=="function"?lr=function(){M0($f)}:typeof MessageChannel<"u"?(td=new MessageChannel,T0=td.port2,td.port1.onmessage=$f,lr=function(){T0.postMessage(null)}):lr=function(){E0($f,0)};var td,T0;function ad(e,t){Do=E0(function(){e(Re.unstable_now())},t)}Re.unstable_IdlePriority=5;Re.unstable_ImmediatePriority=1;Re.unstable_LowPriority=4;Re.unstable_NormalPriority=3;Re.unstable_Profiling=null;Re.unstable_UserBlockingPriority=2;Re.unstable_cancelCallback=function(e){e.callback=null};Re.unstable_forceFrameRate=function(e){0>e||125<e?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):w0=0<e?Math.floor(1e3/e):5};Re.unstable_getCurrentPriorityLevel=function(){return yn};Re.unstable_next=function(e){switch(yn){case 1:case 2:case 3:var t=3;break;default:t=yn}var n=yn;yn=t;try{return e()}finally{yn=n}};Re.unstable_requestPaint=function(){id=!0};Re.unstable_runWithPriority=function(e,t){switch(e){case 1:case 2:case 3:case 4:case 5:break;default:e=3}var n=yn;yn=e;try{return t()}finally{yn=n}};Re.unstable_scheduleCallback=function(e,t,n){var i=Re.unstable_now();switch(typeof n=="object"&&n!==null?(n=n.delay,n=typeof n=="number"&&0<n?i+n:i):n=i,e){case 1:var s=-1;break;case 2:s=250;break;case 5:s=1073741823;break;case 4:s=1e4;break;default:s=5e3}return s=n+s,e={id:SM++,callback:t,priorityLevel:e,startTime:n,expirationTime:s,sortIndex:-1},n>i?(e.sortIndex=n,ed(Ls,e),Hi(is)===null&&e===Hi(Ls)&&(Ro?(A0(Do),Do=-1):Ro=!0,ad(sd,n-i))):(e.sortIndex=s,ed(is,e),Co||nd||(Co=!0,cr||(cr=!0,lr()))),e};Re.unstable_shouldYield=R0;Re.unstable_wrapCallback=function(e){var t=yn;return function(){var n=yn;yn=t;try{return e.apply(this,arguments)}finally{yn=n}}}});var N0=Vi((B2,U0)=>{"use strict";U0.exports=D0()});var O0=Vi(En=>{"use strict";var bM=dc();function L0(e){var t="https://react.dev/errors/"+e;if(1<arguments.length){t+="?args[]="+encodeURIComponent(arguments[1]);for(var n=2;n<arguments.length;n++)t+="&args[]="+encodeURIComponent(arguments[n])}return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function Os(){}var Tn={d:{f:Os,r:function(){throw Error(L0(522))},D:Os,C:Os,L:Os,m:Os,X:Os,S:Os,M:Os},p:0,findDOMNode:null},MM=Symbol.for("react.portal");function TM(e,t,n){var i=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:MM,key:i==null?null:""+i,children:e,containerInfo:t,implementation:n}}var Uo=bM.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;function yc(e,t){if(e==="font")return"";if(typeof t=="string")return t==="use-credentials"?t:""}En.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=Tn;En.createPortal=function(e,t){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)throw Error(L0(299));return TM(e,t,null,n)};En.flushSync=function(e){var t=Uo.T,n=Tn.p;try{if(Uo.T=null,Tn.p=2,e)return e()}finally{Uo.T=t,Tn.p=n,Tn.d.f()}};En.preconnect=function(e,t){typeof e=="string"&&(t?(t=t.crossOrigin,t=typeof t=="string"?t==="use-credentials"?t:"":void 0):t=null,Tn.d.C(e,t))};En.prefetchDNS=function(e){typeof e=="string"&&Tn.d.D(e)};En.preinit=function(e,t){if(typeof e=="string"&&t&&typeof t.as=="string"){var n=t.as,i=yc(n,t.crossOrigin),s=typeof t.integrity=="string"?t.integrity:void 0,a=typeof t.fetchPriority=="string"?t.fetchPriority:void 0;n==="style"?Tn.d.S(e,typeof t.precedence=="string"?t.precedence:void 0,{crossOrigin:i,integrity:s,fetchPriority:a}):n==="script"&&Tn.d.X(e,{crossOrigin:i,integrity:s,fetchPriority:a,nonce:typeof t.nonce=="string"?t.nonce:void 0})}};En.preinitModule=function(e,t){if(typeof e=="string")if(typeof t=="object"&&t!==null){if(t.as==null||t.as==="script"){var n=yc(t.as,t.crossOrigin);Tn.d.M(e,{crossOrigin:n,integrity:typeof t.integrity=="string"?t.integrity:void 0,nonce:typeof t.nonce=="string"?t.nonce:void 0})}}else t==null&&Tn.d.M(e)};En.preload=function(e,t){if(typeof e=="string"&&typeof t=="object"&&t!==null&&typeof t.as=="string"){var n=t.as,i=yc(n,t.crossOrigin);Tn.d.L(e,n,{crossOrigin:i,integrity:typeof t.integrity=="string"?t.integrity:void 0,nonce:typeof t.nonce=="string"?t.nonce:void 0,type:typeof t.type=="string"?t.type:void 0,fetchPriority:typeof t.fetchPriority=="string"?t.fetchPriority:void 0,referrerPolicy:typeof t.referrerPolicy=="string"?t.referrerPolicy:void 0,imageSrcSet:typeof t.imageSrcSet=="string"?t.imageSrcSet:void 0,imageSizes:typeof t.imageSizes=="string"?t.imageSizes:void 0,media:typeof t.media=="string"?t.media:void 0})}};En.preloadModule=function(e,t){if(typeof e=="string")if(t){var n=yc(t.as,t.crossOrigin);Tn.d.m(e,{as:typeof t.as=="string"&&t.as!=="script"?t.as:void 0,crossOrigin:n,integrity:typeof t.integrity=="string"?t.integrity:void 0})}else Tn.d.m(e)};En.requestFormReset=function(e){Tn.d.r(e)};En.unstable_batchedUpdates=function(e,t){return e(t)};En.useFormState=function(e,t,n){return Uo.H.useFormState(e,t,n)};En.useFormStatus=function(){return Uo.H.useHostTransitionStatus()};En.version="19.2.8"});var B0=Vi((F2,P0)=>{"use strict";function I0(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(I0)}catch(e){console.error(e)}}I0(),P0.exports=O0()});var Jx=Vi(ku=>{"use strict";var Qe=N0(),c_=dc(),EM=B0();function j(e){var t="https://react.dev/errors/"+e;if(1<arguments.length){t+="?args[]="+encodeURIComponent(arguments[1]);for(var n=2;n<arguments.length;n++)t+="&args[]="+encodeURIComponent(arguments[n])}return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function u_(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function yl(e){var t=e,n=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,(t.flags&4098)!==0&&(n=t.return),e=t.return;while(e)}return t.tag===3?n:null}function h_(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function f_(e){if(e.tag===31){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function z0(e){if(yl(e)!==e)throw Error(j(188))}function AM(e){var t=e.alternate;if(!t){if(t=yl(e),t===null)throw Error(j(188));return t!==e?null:e}for(var n=e,i=t;;){var s=n.return;if(s===null)break;var a=s.alternate;if(a===null){if(i=s.return,i!==null){n=i;continue}break}if(s.child===a.child){for(a=s.child;a;){if(a===n)return z0(s),e;if(a===i)return z0(s),t;a=a.sibling}throw Error(j(188))}if(n.return!==i.return)n=s,i=a;else{for(var r=!1,o=s.child;o;){if(o===n){r=!0,n=s,i=a;break}if(o===i){r=!0,i=s,n=a;break}o=o.sibling}if(!r){for(o=a.child;o;){if(o===n){r=!0,n=a,i=s;break}if(o===i){r=!0,i=a,n=s;break}o=o.sibling}if(!r)throw Error(j(189))}}if(n.alternate!==i)throw Error(j(190))}if(n.tag!==3)throw Error(j(188));return n.stateNode.current===n?e:t}function d_(e){var t=e.tag;if(t===5||t===26||t===27||t===6)return e;for(e=e.child;e!==null;){if(t=d_(e),t!==null)return t;e=e.sibling}return null}var Ee=Object.assign,wM=Symbol.for("react.element"),_c=Symbol.for("react.transitional.element"),Fo=Symbol.for("react.portal"),mr=Symbol.for("react.fragment"),p_=Symbol.for("react.strict_mode"),Fd=Symbol.for("react.profiler"),m_=Symbol.for("react.consumer"),hs=Symbol.for("react.context"),Op=Symbol.for("react.forward_ref"),Vd=Symbol.for("react.suspense"),Hd=Symbol.for("react.suspense_list"),Ip=Symbol.for("react.memo"),Is=Symbol.for("react.lazy");Symbol.for("react.scope");var kd=Symbol.for("react.activity");Symbol.for("react.legacy_hidden");Symbol.for("react.tracing_marker");var CM=Symbol.for("react.memo_cache_sentinel");Symbol.for("react.view_transition");var F0=Symbol.iterator;function No(e){return e===null||typeof e!="object"?null:(e=F0&&e[F0]||e["@@iterator"],typeof e=="function"?e:null)}var RM=Symbol.for("react.client.reference");function Gd(e){if(e==null)return null;if(typeof e=="function")return e.$$typeof===RM?null:e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case mr:return"Fragment";case Fd:return"Profiler";case p_:return"StrictMode";case Vd:return"Suspense";case Hd:return"SuspenseList";case kd:return"Activity"}if(typeof e=="object")switch(e.$$typeof){case Fo:return"Portal";case hs:return e.displayName||"Context";case m_:return(e._context.displayName||"Context")+".Consumer";case Op:var t=e.render;return e=e.displayName,e||(e=t.displayName||t.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case Ip:return t=e.displayName||null,t!==null?t:Gd(e.type)||"Memo";case Is:t=e._payload,e=e._init;try{return Gd(e(t))}catch{}}return null}var Vo=Array.isArray,Dt=c_.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,se=EM.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,Ua={pending:!1,data:null,method:null,action:null},Wd=[],gr=-1;function qi(e){return{current:e}}function rn(e){0>gr||(e.current=Wd[gr],Wd[gr]=null,gr--)}function xe(e,t){gr++,Wd[gr]=e.current,e.current=t}var Xi=qi(null),il=qi(null),qs=qi(null),Qc=qi(null);function jc(e,t){switch(xe(qs,t),xe(il,e),xe(Xi,null),t.nodeType){case 9:case 11:e=(e=t.documentElement)&&(e=e.namespaceURI)?qy(e):0;break;default:if(e=t.tagName,t=t.namespaceURI)t=qy(t),e=Ix(t,e);else switch(e){case"svg":e=1;break;case"math":e=2;break;default:e=0}}rn(Xi),xe(Xi,e)}function Or(){rn(Xi),rn(il),rn(qs)}function Xd(e){e.memoizedState!==null&&xe(Qc,e);var t=Xi.current,n=Ix(t,e.type);t!==n&&(xe(il,e),xe(Xi,n))}function $c(e){il.current===e&&(rn(Xi),rn(il)),Qc.current===e&&(rn(Qc),pl._currentValue=Ua)}var rd,V0;function wa(e){if(rd===void 0)try{throw Error()}catch(n){var t=n.stack.trim().match(/\n( *(at )?)/);rd=t&&t[1]||"",V0=-1<n.stack.indexOf(`
    at`)?" (<anonymous>)":-1<n.stack.indexOf("@")?"@unknown:0:0":""}return`
`+rd+e+V0}var od=!1;function ld(e,t){if(!e||od)return"";od=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{var i={DetermineComponentFrameRoot:function(){try{if(t){var p=function(){throw Error()};if(Object.defineProperty(p.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(p,[])}catch(f){var h=f}Reflect.construct(e,[],p)}else{try{p.call()}catch(f){h=f}e.call(p.prototype)}}else{try{throw Error()}catch(f){h=f}(p=e())&&typeof p.catch=="function"&&p.catch(function(){})}}catch(f){if(f&&h&&typeof f.stack=="string")return[f.stack,h.stack]}return[null,null]}};i.DetermineComponentFrameRoot.displayName="DetermineComponentFrameRoot";var s=Object.getOwnPropertyDescriptor(i.DetermineComponentFrameRoot,"name");s&&s.configurable&&Object.defineProperty(i.DetermineComponentFrameRoot,"name",{value:"DetermineComponentFrameRoot"});var a=i.DetermineComponentFrameRoot(),r=a[0],o=a[1];if(r&&o){var l=r.split(`
`),c=o.split(`
`);for(s=i=0;i<l.length&&!l[i].includes("DetermineComponentFrameRoot");)i++;for(;s<c.length&&!c[s].includes("DetermineComponentFrameRoot");)s++;if(i===l.length||s===c.length)for(i=l.length-1,s=c.length-1;1<=i&&0<=s&&l[i]!==c[s];)s--;for(;1<=i&&0<=s;i--,s--)if(l[i]!==c[s]){if(i!==1||s!==1)do if(i--,s--,0>s||l[i]!==c[s]){var u=`
`+l[i].replace(" at new "," at ");return e.displayName&&u.includes("<anonymous>")&&(u=u.replace("<anonymous>",e.displayName)),u}while(1<=i&&0<=s);break}}}finally{od=!1,Error.prepareStackTrace=n}return(n=e?e.displayName||e.name:"")?wa(n):""}function DM(e,t){switch(e.tag){case 26:case 27:case 5:return wa(e.type);case 16:return wa("Lazy");case 13:return e.child!==t&&t!==null?wa("Suspense Fallback"):wa("Suspense");case 19:return wa("SuspenseList");case 0:case 15:return ld(e.type,!1);case 11:return ld(e.type.render,!1);case 1:return ld(e.type,!0);case 31:return wa("Activity");default:return""}}function H0(e){try{var t="",n=null;do t+=DM(e,n),n=e,e=e.return;while(e);return t}catch(i){return`
Error generating stack: `+i.message+`
`+i.stack}}var qd=Object.prototype.hasOwnProperty,Pp=Qe.unstable_scheduleCallback,cd=Qe.unstable_cancelCallback,UM=Qe.unstable_shouldYield,NM=Qe.unstable_requestPaint,Xn=Qe.unstable_now,LM=Qe.unstable_getCurrentPriorityLevel,g_=Qe.unstable_ImmediatePriority,y_=Qe.unstable_UserBlockingPriority,tu=Qe.unstable_NormalPriority,OM=Qe.unstable_LowPriority,__=Qe.unstable_IdlePriority,IM=Qe.log,PM=Qe.unstable_setDisableYieldValue,_l=null,qn=null;function Hs(e){if(typeof IM=="function"&&PM(e),qn&&typeof qn.setStrictMode=="function")try{qn.setStrictMode(_l,e)}catch{}}var Yn=Math.clz32?Math.clz32:FM,BM=Math.log,zM=Math.LN2;function FM(e){return e>>>=0,e===0?32:31-(BM(e)/zM|0)|0}var vc=256,xc=262144,Sc=4194304;function Ca(e){var t=e&42;if(t!==0)return t;switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:return 64;case 128:return 128;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:return e&261888;case 262144:case 524288:case 1048576:case 2097152:return e&3932160;case 4194304:case 8388608:case 16777216:case 33554432:return e&62914560;case 67108864:return 67108864;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 0;default:return e}}function Au(e,t,n){var i=e.pendingLanes;if(i===0)return 0;var s=0,a=e.suspendedLanes,r=e.pingedLanes;e=e.warmLanes;var o=i&134217727;return o!==0?(i=o&~a,i!==0?s=Ca(i):(r&=o,r!==0?s=Ca(r):n||(n=o&~e,n!==0&&(s=Ca(n))))):(o=i&~a,o!==0?s=Ca(o):r!==0?s=Ca(r):n||(n=i&~e,n!==0&&(s=Ca(n)))),s===0?0:t!==0&&t!==s&&(t&a)===0&&(a=s&-s,n=t&-t,a>=n||a===32&&(n&4194048)!==0)?t:s}function vl(e,t){return(e.pendingLanes&~(e.suspendedLanes&~e.pingedLanes)&t)===0}function VM(e,t){switch(e){case 1:case 2:case 4:case 8:case 64:return t+250;case 16:case 32:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:return-1;case 67108864:case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function v_(){var e=Sc;return Sc<<=1,(Sc&62914560)===0&&(Sc=4194304),e}function ud(e){for(var t=[],n=0;31>n;n++)t.push(e);return t}function xl(e,t){e.pendingLanes|=t,t!==268435456&&(e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0)}function HM(e,t,n,i,s,a){var r=e.pendingLanes;e.pendingLanes=n,e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0,e.expiredLanes&=n,e.entangledLanes&=n,e.errorRecoveryDisabledLanes&=n,e.shellSuspendCounter=0;var o=e.entanglements,l=e.expirationTimes,c=e.hiddenUpdates;for(n=r&~n;0<n;){var u=31-Yn(n),p=1<<u;o[u]=0,l[u]=-1;var h=c[u];if(h!==null)for(c[u]=null,u=0;u<h.length;u++){var f=h[u];f!==null&&(f.lane&=-536870913)}n&=~p}i!==0&&x_(e,i,0),a!==0&&s===0&&e.tag!==0&&(e.suspendedLanes|=a&~(r&~t))}function x_(e,t,n){e.pendingLanes|=t,e.suspendedLanes&=~t;var i=31-Yn(t);e.entangledLanes|=t,e.entanglements[i]=e.entanglements[i]|1073741824|n&261930}function S_(e,t){var n=e.entangledLanes|=t;for(e=e.entanglements;n;){var i=31-Yn(n),s=1<<i;s&t|e[i]&t&&(e[i]|=t),n&=~s}}function b_(e,t){var n=t&-t;return n=(n&42)!==0?1:Bp(n),(n&(e.suspendedLanes|t))!==0?0:n}function Bp(e){switch(e){case 2:e=1;break;case 8:e=4;break;case 32:e=16;break;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:e=128;break;case 268435456:e=134217728;break;default:e=0}return e}function zp(e){return e&=-e,2<e?8<e?(e&134217727)!==0?32:268435456:8:2}function M_(){var e=se.p;return e!==0?e:(e=window.event,e===void 0?32:qx(e.type))}function k0(e,t){var n=se.p;try{return se.p=e,t()}finally{se.p=n}}var aa=Math.random().toString(36).slice(2),un="__reactFiber$"+aa,In="__reactProps$"+aa,Xr="__reactContainer$"+aa,Yd="__reactEvents$"+aa,kM="__reactListeners$"+aa,GM="__reactHandles$"+aa,G0="__reactResources$"+aa,Sl="__reactMarker$"+aa;function Fp(e){delete e[un],delete e[In],delete e[Yd],delete e[kM],delete e[GM]}function yr(e){var t=e[un];if(t)return t;for(var n=e.parentNode;n;){if(t=n[Xr]||n[un]){if(n=t.alternate,t.child!==null||n!==null&&n.child!==null)for(e=Qy(e);e!==null;){if(n=e[un])return n;e=Qy(e)}return t}e=n,n=e.parentNode}return null}function qr(e){if(e=e[un]||e[Xr]){var t=e.tag;if(t===5||t===6||t===13||t===31||t===26||t===27||t===3)return e}return null}function Ho(e){var t=e.tag;if(t===5||t===26||t===27||t===6)return e.stateNode;throw Error(j(33))}function wr(e){var t=e[G0];return t||(t=e[G0]={hoistableStyles:new Map,hoistableScripts:new Map}),t}function an(e){e[Sl]=!0}var T_=new Set,E_={};function Ha(e,t){Ir(e,t),Ir(e+"Capture",t)}function Ir(e,t){for(E_[e]=t,e=0;e<t.length;e++)T_.add(t[e])}var WM=RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"),W0={},X0={};function XM(e){return qd.call(X0,e)?!0:qd.call(W0,e)?!1:WM.test(e)?X0[e]=!0:(W0[e]=!0,!1)}function Pc(e,t,n){if(XM(t))if(n===null)e.removeAttribute(t);else{switch(typeof n){case"undefined":case"function":case"symbol":e.removeAttribute(t);return;case"boolean":var i=t.toLowerCase().slice(0,5);if(i!=="data-"&&i!=="aria-"){e.removeAttribute(t);return}}e.setAttribute(t,""+n)}}function bc(e,t,n){if(n===null)e.removeAttribute(t);else{switch(typeof n){case"undefined":case"function":case"symbol":case"boolean":e.removeAttribute(t);return}e.setAttribute(t,""+n)}}function ss(e,t,n,i){if(i===null)e.removeAttribute(n);else{switch(typeof i){case"undefined":case"function":case"symbol":case"boolean":e.removeAttribute(n);return}e.setAttributeNS(t,n,""+i)}}function ri(e){switch(typeof e){case"bigint":case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function A_(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(t==="checkbox"||t==="radio")}function qM(e,t,n){var i=Object.getOwnPropertyDescriptor(e.constructor.prototype,t);if(!e.hasOwnProperty(t)&&typeof i<"u"&&typeof i.get=="function"&&typeof i.set=="function"){var s=i.get,a=i.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return s.call(this)},set:function(r){n=""+r,a.call(this,r)}}),Object.defineProperty(e,t,{enumerable:i.enumerable}),{getValue:function(){return n},setValue:function(r){n=""+r},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function Zd(e){if(!e._valueTracker){var t=A_(e)?"checked":"value";e._valueTracker=qM(e,t,""+e[t])}}function w_(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),i="";return e&&(i=A_(e)?e.checked?"true":"false":e.value),e=i,e!==n?(t.setValue(e),!0):!1}function eu(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}var YM=/[\n"\\]/g;function ci(e){return e.replace(YM,function(t){return"\\"+t.charCodeAt(0).toString(16)+" "})}function Jd(e,t,n,i,s,a,r,o){e.name="",r!=null&&typeof r!="function"&&typeof r!="symbol"&&typeof r!="boolean"?e.type=r:e.removeAttribute("type"),t!=null?r==="number"?(t===0&&e.value===""||e.value!=t)&&(e.value=""+ri(t)):e.value!==""+ri(t)&&(e.value=""+ri(t)):r!=="submit"&&r!=="reset"||e.removeAttribute("value"),t!=null?Kd(e,r,ri(t)):n!=null?Kd(e,r,ri(n)):i!=null&&e.removeAttribute("value"),s==null&&a!=null&&(e.defaultChecked=!!a),s!=null&&(e.checked=s&&typeof s!="function"&&typeof s!="symbol"),o!=null&&typeof o!="function"&&typeof o!="symbol"&&typeof o!="boolean"?e.name=""+ri(o):e.removeAttribute("name")}function C_(e,t,n,i,s,a,r,o){if(a!=null&&typeof a!="function"&&typeof a!="symbol"&&typeof a!="boolean"&&(e.type=a),t!=null||n!=null){if(!(a!=="submit"&&a!=="reset"||t!=null)){Zd(e);return}n=n!=null?""+ri(n):"",t=t!=null?""+ri(t):n,o||t===e.value||(e.value=t),e.defaultValue=t}i=i??s,i=typeof i!="function"&&typeof i!="symbol"&&!!i,e.checked=o?e.checked:!!i,e.defaultChecked=!!i,r!=null&&typeof r!="function"&&typeof r!="symbol"&&typeof r!="boolean"&&(e.name=r),Zd(e)}function Kd(e,t,n){t==="number"&&eu(e.ownerDocument)===e||e.defaultValue===""+n||(e.defaultValue=""+n)}function Cr(e,t,n,i){if(e=e.options,t){t={};for(var s=0;s<n.length;s++)t["$"+n[s]]=!0;for(n=0;n<e.length;n++)s=t.hasOwnProperty("$"+e[n].value),e[n].selected!==s&&(e[n].selected=s),s&&i&&(e[n].defaultSelected=!0)}else{for(n=""+ri(n),t=null,s=0;s<e.length;s++){if(e[s].value===n){e[s].selected=!0,i&&(e[s].defaultSelected=!0);return}t!==null||e[s].disabled||(t=e[s])}t!==null&&(t.selected=!0)}}function R_(e,t,n){if(t!=null&&(t=""+ri(t),t!==e.value&&(e.value=t),n==null)){e.defaultValue!==t&&(e.defaultValue=t);return}e.defaultValue=n!=null?""+ri(n):""}function D_(e,t,n,i){if(t==null){if(i!=null){if(n!=null)throw Error(j(92));if(Vo(i)){if(1<i.length)throw Error(j(93));i=i[0]}n=i}n==null&&(n=""),t=n}n=ri(t),e.defaultValue=n,i=e.textContent,i===n&&i!==""&&i!==null&&(e.value=i),Zd(e)}function Pr(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&n.nodeType===3){n.nodeValue=t;return}}e.textContent=t}var ZM=new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));function q0(e,t,n){var i=t.indexOf("--")===0;n==null||typeof n=="boolean"||n===""?i?e.setProperty(t,""):t==="float"?e.cssFloat="":e[t]="":i?e.setProperty(t,n):typeof n!="number"||n===0||ZM.has(t)?t==="float"?e.cssFloat=n:e[t]=(""+n).trim():e[t]=n+"px"}function U_(e,t,n){if(t!=null&&typeof t!="object")throw Error(j(62));if(e=e.style,n!=null){for(var i in n)!n.hasOwnProperty(i)||t!=null&&t.hasOwnProperty(i)||(i.indexOf("--")===0?e.setProperty(i,""):i==="float"?e.cssFloat="":e[i]="");for(var s in t)i=t[s],t.hasOwnProperty(s)&&n[s]!==i&&q0(e,s,i)}else for(var a in t)t.hasOwnProperty(a)&&q0(e,a,t[a])}function Vp(e){if(e.indexOf("-")===-1)return!1;switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var JM=new Map([["acceptCharset","accept-charset"],["htmlFor","for"],["httpEquiv","http-equiv"],["crossOrigin","crossorigin"],["accentHeight","accent-height"],["alignmentBaseline","alignment-baseline"],["arabicForm","arabic-form"],["baselineShift","baseline-shift"],["capHeight","cap-height"],["clipPath","clip-path"],["clipRule","clip-rule"],["colorInterpolation","color-interpolation"],["colorInterpolationFilters","color-interpolation-filters"],["colorProfile","color-profile"],["colorRendering","color-rendering"],["dominantBaseline","dominant-baseline"],["enableBackground","enable-background"],["fillOpacity","fill-opacity"],["fillRule","fill-rule"],["floodColor","flood-color"],["floodOpacity","flood-opacity"],["fontFamily","font-family"],["fontSize","font-size"],["fontSizeAdjust","font-size-adjust"],["fontStretch","font-stretch"],["fontStyle","font-style"],["fontVariant","font-variant"],["fontWeight","font-weight"],["glyphName","glyph-name"],["glyphOrientationHorizontal","glyph-orientation-horizontal"],["glyphOrientationVertical","glyph-orientation-vertical"],["horizAdvX","horiz-adv-x"],["horizOriginX","horiz-origin-x"],["imageRendering","image-rendering"],["letterSpacing","letter-spacing"],["lightingColor","lighting-color"],["markerEnd","marker-end"],["markerMid","marker-mid"],["markerStart","marker-start"],["overlinePosition","overline-position"],["overlineThickness","overline-thickness"],["paintOrder","paint-order"],["panose-1","panose-1"],["pointerEvents","pointer-events"],["renderingIntent","rendering-intent"],["shapeRendering","shape-rendering"],["stopColor","stop-color"],["stopOpacity","stop-opacity"],["strikethroughPosition","strikethrough-position"],["strikethroughThickness","strikethrough-thickness"],["strokeDasharray","stroke-dasharray"],["strokeDashoffset","stroke-dashoffset"],["strokeLinecap","stroke-linecap"],["strokeLinejoin","stroke-linejoin"],["strokeMiterlimit","stroke-miterlimit"],["strokeOpacity","stroke-opacity"],["strokeWidth","stroke-width"],["textAnchor","text-anchor"],["textDecoration","text-decoration"],["textRendering","text-rendering"],["transformOrigin","transform-origin"],["underlinePosition","underline-position"],["underlineThickness","underline-thickness"],["unicodeBidi","unicode-bidi"],["unicodeRange","unicode-range"],["unitsPerEm","units-per-em"],["vAlphabetic","v-alphabetic"],["vHanging","v-hanging"],["vIdeographic","v-ideographic"],["vMathematical","v-mathematical"],["vectorEffect","vector-effect"],["vertAdvY","vert-adv-y"],["vertOriginX","vert-origin-x"],["vertOriginY","vert-origin-y"],["wordSpacing","word-spacing"],["writingMode","writing-mode"],["xmlnsXlink","xmlns:xlink"],["xHeight","x-height"]]),KM=/^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;function Bc(e){return KM.test(""+e)?"javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')":e}function fs(){}var Qd=null;function Hp(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var _r=null,Rr=null;function Y0(e){var t=qr(e);if(t&&(e=t.stateNode)){var n=e[In]||null;t:switch(e=t.stateNode,t.type){case"input":if(Jd(e,n.value,n.defaultValue,n.defaultValue,n.checked,n.defaultChecked,n.type,n.name),t=n.name,n.type==="radio"&&t!=null){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll('input[name="'+ci(""+t)+'"][type="radio"]'),t=0;t<n.length;t++){var i=n[t];if(i!==e&&i.form===e.form){var s=i[In]||null;if(!s)throw Error(j(90));Jd(i,s.value,s.defaultValue,s.defaultValue,s.checked,s.defaultChecked,s.type,s.name)}}for(t=0;t<n.length;t++)i=n[t],i.form===e.form&&w_(i)}break t;case"textarea":R_(e,n.value,n.defaultValue);break t;case"select":t=n.value,t!=null&&Cr(e,!!n.multiple,t,!1)}}}var hd=!1;function N_(e,t,n){if(hd)return e(t,n);hd=!0;try{var i=e(t);return i}finally{if(hd=!1,(_r!==null||Rr!==null)&&(zu(),_r&&(t=_r,e=Rr,Rr=_r=null,Y0(t),e)))for(t=0;t<e.length;t++)Y0(e[t])}}function sl(e,t){var n=e.stateNode;if(n===null)return null;var i=n[In]||null;if(i===null)return null;n=i[t];t:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(i=!i.disabled)||(e=e.type,i=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!i;break t;default:e=!1}if(e)return null;if(n&&typeof n!="function")throw Error(j(231,t,typeof n));return n}var ys=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),jd=!1;if(ys)try{ur={},Object.defineProperty(ur,"passive",{get:function(){jd=!0}}),window.addEventListener("test",ur,ur),window.removeEventListener("test",ur,ur)}catch{jd=!1}var ur,ks=null,kp=null,zc=null;function L_(){if(zc)return zc;var e,t=kp,n=t.length,i,s="value"in ks?ks.value:ks.textContent,a=s.length;for(e=0;e<n&&t[e]===s[e];e++);var r=n-e;for(i=1;i<=r&&t[n-i]===s[a-i];i++);return zc=s.slice(e,1<i?1-i:void 0)}function Fc(e){var t=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function Mc(){return!0}function Z0(){return!1}function Pn(e){function t(n,i,s,a,r){this._reactName=n,this._targetInst=s,this.type=i,this.nativeEvent=a,this.target=r,this.currentTarget=null;for(var o in e)e.hasOwnProperty(o)&&(n=e[o],this[o]=n?n(a):a[o]);return this.isDefaultPrevented=(a.defaultPrevented!=null?a.defaultPrevented:a.returnValue===!1)?Mc:Z0,this.isPropagationStopped=Z0,this}return Ee(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=Mc)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=Mc)},persist:function(){},isPersistent:Mc}),t}var ka={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},wu=Pn(ka),bl=Ee({},ka,{view:0,detail:0}),QM=Pn(bl),fd,dd,Lo,Cu=Ee({},bl,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Gp,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==Lo&&(Lo&&e.type==="mousemove"?(fd=e.screenX-Lo.screenX,dd=e.screenY-Lo.screenY):dd=fd=0,Lo=e),fd)},movementY:function(e){return"movementY"in e?e.movementY:dd}}),J0=Pn(Cu),jM=Ee({},Cu,{dataTransfer:0}),$M=Pn(jM),t1=Ee({},bl,{relatedTarget:0}),pd=Pn(t1),e1=Ee({},ka,{animationName:0,elapsedTime:0,pseudoElement:0}),n1=Pn(e1),i1=Ee({},ka,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),s1=Pn(i1),a1=Ee({},ka,{data:0}),K0=Pn(a1),r1={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},o1={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},l1={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function c1(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=l1[e])?!!t[e]:!1}function Gp(){return c1}var u1=Ee({},bl,{key:function(e){if(e.key){var t=r1[e.key]||e.key;if(t!=="Unidentified")return t}return e.type==="keypress"?(e=Fc(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?o1[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Gp,charCode:function(e){return e.type==="keypress"?Fc(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?Fc(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),h1=Pn(u1),f1=Ee({},Cu,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Q0=Pn(f1),d1=Ee({},bl,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Gp}),p1=Pn(d1),m1=Ee({},ka,{propertyName:0,elapsedTime:0,pseudoElement:0}),g1=Pn(m1),y1=Ee({},Cu,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),_1=Pn(y1),v1=Ee({},ka,{newState:0,oldState:0}),x1=Pn(v1),S1=[9,13,27,32],Wp=ys&&"CompositionEvent"in window,Wo=null;ys&&"documentMode"in document&&(Wo=document.documentMode);var b1=ys&&"TextEvent"in window&&!Wo,O_=ys&&(!Wp||Wo&&8<Wo&&11>=Wo),j0=" ",$0=!1;function I_(e,t){switch(e){case"keyup":return S1.indexOf(t.keyCode)!==-1;case"keydown":return t.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function P_(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var vr=!1;function M1(e,t){switch(e){case"compositionend":return P_(t);case"keypress":return t.which!==32?null:($0=!0,j0);case"textInput":return e=t.data,e===j0&&$0?null:e;default:return null}}function T1(e,t){if(vr)return e==="compositionend"||!Wp&&I_(e,t)?(e=L_(),zc=kp=ks=null,vr=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return O_&&t.locale!=="ko"?null:t.data;default:return null}}var E1={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function ty(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t==="input"?!!E1[e.type]:t==="textarea"}function B_(e,t,n,i){_r?Rr?Rr.push(i):Rr=[i]:_r=i,t=vu(t,"onChange"),0<t.length&&(n=new wu("onChange","change",null,n,i),e.push({event:n,listeners:t}))}var Xo=null,al=null;function A1(e){Nx(e,0)}function Ru(e){var t=Ho(e);if(w_(t))return e}function ey(e,t){if(e==="change")return t}var z_=!1;ys&&(ys?(Ec="oninput"in document,Ec||(md=document.createElement("div"),md.setAttribute("oninput","return;"),Ec=typeof md.oninput=="function"),Tc=Ec):Tc=!1,z_=Tc&&(!document.documentMode||9<document.documentMode));var Tc,Ec,md;function ny(){Xo&&(Xo.detachEvent("onpropertychange",F_),al=Xo=null)}function F_(e){if(e.propertyName==="value"&&Ru(al)){var t=[];B_(t,al,e,Hp(e)),N_(A1,t)}}function w1(e,t,n){e==="focusin"?(ny(),Xo=t,al=n,Xo.attachEvent("onpropertychange",F_)):e==="focusout"&&ny()}function C1(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return Ru(al)}function R1(e,t){if(e==="click")return Ru(t)}function D1(e,t){if(e==="input"||e==="change")return Ru(t)}function U1(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var Jn=typeof Object.is=="function"?Object.is:U1;function rl(e,t){if(Jn(e,t))return!0;if(typeof e!="object"||e===null||typeof t!="object"||t===null)return!1;var n=Object.keys(e),i=Object.keys(t);if(n.length!==i.length)return!1;for(i=0;i<n.length;i++){var s=n[i];if(!qd.call(t,s)||!Jn(e[s],t[s]))return!1}return!0}function iy(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function sy(e,t){var n=iy(e);e=0;for(var i;n;){if(n.nodeType===3){if(i=e+n.textContent.length,e<=t&&i>=t)return{node:n,offset:t-e};e=i}t:{for(;n;){if(n.nextSibling){n=n.nextSibling;break t}n=n.parentNode}n=void 0}n=iy(n)}}function V_(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?V_(e,t.parentNode):"contains"in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function H_(e){e=e!=null&&e.ownerDocument!=null&&e.ownerDocument.defaultView!=null?e.ownerDocument.defaultView:window;for(var t=eu(e.document);t instanceof e.HTMLIFrameElement;){try{var n=typeof t.contentWindow.location.href=="string"}catch{n=!1}if(n)e=t.contentWindow;else break;t=eu(e.document)}return t}function Xp(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||t==="textarea"||e.contentEditable==="true")}var N1=ys&&"documentMode"in document&&11>=document.documentMode,xr=null,$d=null,qo=null,tp=!1;function ay(e,t,n){var i=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;tp||xr==null||xr!==eu(i)||(i=xr,"selectionStart"in i&&Xp(i)?i={start:i.selectionStart,end:i.selectionEnd}:(i=(i.ownerDocument&&i.ownerDocument.defaultView||window).getSelection(),i={anchorNode:i.anchorNode,anchorOffset:i.anchorOffset,focusNode:i.focusNode,focusOffset:i.focusOffset}),qo&&rl(qo,i)||(qo=i,i=vu($d,"onSelect"),0<i.length&&(t=new wu("onSelect","select",null,t,n),e.push({event:t,listeners:i}),t.target=xr)))}function Aa(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n["Webkit"+e]="webkit"+t,n["Moz"+e]="moz"+t,n}var Sr={animationend:Aa("Animation","AnimationEnd"),animationiteration:Aa("Animation","AnimationIteration"),animationstart:Aa("Animation","AnimationStart"),transitionrun:Aa("Transition","TransitionRun"),transitionstart:Aa("Transition","TransitionStart"),transitioncancel:Aa("Transition","TransitionCancel"),transitionend:Aa("Transition","TransitionEnd")},gd={},k_={};ys&&(k_=document.createElement("div").style,"AnimationEvent"in window||(delete Sr.animationend.animation,delete Sr.animationiteration.animation,delete Sr.animationstart.animation),"TransitionEvent"in window||delete Sr.transitionend.transition);function Ga(e){if(gd[e])return gd[e];if(!Sr[e])return e;var t=Sr[e],n;for(n in t)if(t.hasOwnProperty(n)&&n in k_)return gd[e]=t[n];return e}var G_=Ga("animationend"),W_=Ga("animationiteration"),X_=Ga("animationstart"),L1=Ga("transitionrun"),O1=Ga("transitionstart"),I1=Ga("transitioncancel"),q_=Ga("transitionend"),Y_=new Map,ep="abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");ep.push("scrollEnd");function Ei(e,t){Y_.set(e,t),Ha(t,[e])}var nu=typeof reportError=="function"?reportError:function(e){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var t=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof e=="object"&&e!==null&&typeof e.message=="string"?String(e.message):String(e),error:e});if(!window.dispatchEvent(t))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",e);return}console.error(e)},ai=[],br=0,qp=0;function Du(){for(var e=br,t=qp=br=0;t<e;){var n=ai[t];ai[t++]=null;var i=ai[t];ai[t++]=null;var s=ai[t];ai[t++]=null;var a=ai[t];if(ai[t++]=null,i!==null&&s!==null){var r=i.pending;r===null?s.next=s:(s.next=r.next,r.next=s),i.pending=s}a!==0&&Z_(n,s,a)}}function Uu(e,t,n,i){ai[br++]=e,ai[br++]=t,ai[br++]=n,ai[br++]=i,qp|=i,e.lanes|=i,e=e.alternate,e!==null&&(e.lanes|=i)}function Yp(e,t,n,i){return Uu(e,t,n,i),iu(e)}function Wa(e,t){return Uu(e,null,null,t),iu(e)}function Z_(e,t,n){e.lanes|=n;var i=e.alternate;i!==null&&(i.lanes|=n);for(var s=!1,a=e.return;a!==null;)a.childLanes|=n,i=a.alternate,i!==null&&(i.childLanes|=n),a.tag===22&&(e=a.stateNode,e===null||e._visibility&1||(s=!0)),e=a,a=a.return;return e.tag===3?(a=e.stateNode,s&&t!==null&&(s=31-Yn(n),e=a.hiddenUpdates,i=e[s],i===null?e[s]=[t]:i.push(t),t.lane=n|536870912),a):null}function iu(e){if(50<el)throw el=0,bp=null,Error(j(185));for(var t=e.return;t!==null;)e=t,t=e.return;return e.tag===3?e.stateNode:null}var Mr={};function P1(e,t,n,i){this.tag=e,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.refCleanup=this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=i,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Gn(e,t,n,i){return new P1(e,t,n,i)}function Zp(e){return e=e.prototype,!(!e||!e.isReactComponent)}function ps(e,t){var n=e.alternate;return n===null?(n=Gn(e.tag,t,e.key,e.mode),n.elementType=e.elementType,n.type=e.type,n.stateNode=e.stateNode,n.alternate=e,e.alternate=n):(n.pendingProps=t,n.type=e.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=e.flags&65011712,n.childLanes=e.childLanes,n.lanes=e.lanes,n.child=e.child,n.memoizedProps=e.memoizedProps,n.memoizedState=e.memoizedState,n.updateQueue=e.updateQueue,t=e.dependencies,n.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},n.sibling=e.sibling,n.index=e.index,n.ref=e.ref,n.refCleanup=e.refCleanup,n}function J_(e,t){e.flags&=65011714;var n=e.alternate;return n===null?(e.childLanes=0,e.lanes=t,e.child=null,e.subtreeFlags=0,e.memoizedProps=null,e.memoizedState=null,e.updateQueue=null,e.dependencies=null,e.stateNode=null):(e.childLanes=n.childLanes,e.lanes=n.lanes,e.child=n.child,e.subtreeFlags=0,e.deletions=null,e.memoizedProps=n.memoizedProps,e.memoizedState=n.memoizedState,e.updateQueue=n.updateQueue,e.type=n.type,t=n.dependencies,e.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext}),e}function Vc(e,t,n,i,s,a){var r=0;if(i=e,typeof e=="function")Zp(e)&&(r=1);else if(typeof e=="string")r=FT(e,n,Xi.current)?26:e==="html"||e==="head"||e==="body"?27:5;else t:switch(e){case kd:return e=Gn(31,n,t,s),e.elementType=kd,e.lanes=a,e;case mr:return Na(n.children,s,a,t);case p_:r=8,s|=24;break;case Fd:return e=Gn(12,n,t,s|2),e.elementType=Fd,e.lanes=a,e;case Vd:return e=Gn(13,n,t,s),e.elementType=Vd,e.lanes=a,e;case Hd:return e=Gn(19,n,t,s),e.elementType=Hd,e.lanes=a,e;default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case hs:r=10;break t;case m_:r=9;break t;case Op:r=11;break t;case Ip:r=14;break t;case Is:r=16,i=null;break t}r=29,n=Error(j(130,e===null?"null":typeof e,"")),i=null}return t=Gn(r,n,t,s),t.elementType=e,t.type=i,t.lanes=a,t}function Na(e,t,n,i){return e=Gn(7,e,i,t),e.lanes=n,e}function yd(e,t,n){return e=Gn(6,e,null,t),e.lanes=n,e}function K_(e){var t=Gn(18,null,null,0);return t.stateNode=e,t}function _d(e,t,n){return t=Gn(4,e.children!==null?e.children:[],e.key,t),t.lanes=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}var ry=new WeakMap;function ui(e,t){if(typeof e=="object"&&e!==null){var n=ry.get(e);return n!==void 0?n:(t={value:e,source:t,stack:H0(t)},ry.set(e,t),t)}return{value:e,source:t,stack:H0(t)}}var Tr=[],Er=0,su=null,ol=0,oi=[],li=0,ea=null,ki=1,Gi="";function cs(e,t){Tr[Er++]=ol,Tr[Er++]=su,su=e,ol=t}function Q_(e,t,n){oi[li++]=ki,oi[li++]=Gi,oi[li++]=ea,ea=e;var i=ki;e=Gi;var s=32-Yn(i)-1;i&=~(1<<s),n+=1;var a=32-Yn(t)+s;if(30<a){var r=s-s%5;a=(i&(1<<r)-1).toString(32),i>>=r,s-=r,ki=1<<32-Yn(t)+s|n<<s|i,Gi=a+e}else ki=1<<a|n<<s|i,Gi=e}function Jp(e){e.return!==null&&(cs(e,1),Q_(e,1,0))}function Kp(e){for(;e===su;)su=Tr[--Er],Tr[Er]=null,ol=Tr[--Er],Tr[Er]=null;for(;e===ea;)ea=oi[--li],oi[li]=null,Gi=oi[--li],oi[li]=null,ki=oi[--li],oi[li]=null}function j_(e,t){oi[li++]=ki,oi[li++]=Gi,oi[li++]=ea,ki=t.id,Gi=t.overflow,ea=e}var hn=null,Te=null,Jt=!1,Ys=null,hi=!1,np=Error(j(519));function na(e){var t=Error(j(418,1<arguments.length&&arguments[1]!==void 0&&arguments[1]?"text":"HTML",""));throw ll(ui(t,e)),np}function oy(e){var t=e.stateNode,n=e.type,i=e.memoizedProps;switch(t[un]=e,t[In]=i,n){case"dialog":Wt("cancel",t),Wt("close",t);break;case"iframe":case"object":case"embed":Wt("load",t);break;case"video":case"audio":for(n=0;n<fl.length;n++)Wt(fl[n],t);break;case"source":Wt("error",t);break;case"img":case"image":case"link":Wt("error",t),Wt("load",t);break;case"details":Wt("toggle",t);break;case"input":Wt("invalid",t),C_(t,i.value,i.defaultValue,i.checked,i.defaultChecked,i.type,i.name,!0);break;case"select":Wt("invalid",t);break;case"textarea":Wt("invalid",t),D_(t,i.value,i.defaultValue,i.children)}n=i.children,typeof n!="string"&&typeof n!="number"&&typeof n!="bigint"||t.textContent===""+n||i.suppressHydrationWarning===!0||Ox(t.textContent,n)?(i.popover!=null&&(Wt("beforetoggle",t),Wt("toggle",t)),i.onScroll!=null&&Wt("scroll",t),i.onScrollEnd!=null&&Wt("scrollend",t),i.onClick!=null&&(t.onclick=fs),t=!0):t=!1,t||na(e,!0)}function ly(e){for(hn=e.return;hn;)switch(hn.tag){case 5:case 31:case 13:hi=!1;return;case 27:case 3:hi=!0;return;default:hn=hn.return}}function hr(e){if(e!==hn)return!1;if(!Jt)return ly(e),Jt=!0,!1;var t=e.tag,n;if((n=t!==3&&t!==27)&&((n=t===5)&&(n=e.type,n=!(n!=="form"&&n!=="button")||wp(e.type,e.memoizedProps)),n=!n),n&&Te&&na(e),ly(e),t===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(j(317));Te=Ky(e)}else if(t===31){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(j(317));Te=Ky(e)}else t===27?(t=Te,ra(e.type)?(e=Up,Up=null,Te=e):Te=t):Te=hn?di(e.stateNode.nextSibling):null;return!0}function Pa(){Te=hn=null,Jt=!1}function vd(){var e=Ys;return e!==null&&(Ln===null?Ln=e:Ln.push.apply(Ln,e),Ys=null),e}function ll(e){Ys===null?Ys=[e]:Ys.push(e)}var ip=qi(null),Xa=null,ds=null;function Bs(e,t,n){xe(ip,t._currentValue),t._currentValue=n}function ms(e){e._currentValue=ip.current,rn(ip)}function sp(e,t,n){for(;e!==null;){var i=e.alternate;if((e.childLanes&t)!==t?(e.childLanes|=t,i!==null&&(i.childLanes|=t)):i!==null&&(i.childLanes&t)!==t&&(i.childLanes|=t),e===n)break;e=e.return}}function ap(e,t,n,i){var s=e.child;for(s!==null&&(s.return=e);s!==null;){var a=s.dependencies;if(a!==null){var r=s.child;a=a.firstContext;t:for(;a!==null;){var o=a;a=s;for(var l=0;l<t.length;l++)if(o.context===t[l]){a.lanes|=n,o=a.alternate,o!==null&&(o.lanes|=n),sp(a.return,n,e),i||(r=null);break t}a=o.next}}else if(s.tag===18){if(r=s.return,r===null)throw Error(j(341));r.lanes|=n,a=r.alternate,a!==null&&(a.lanes|=n),sp(r,n,e),r=null}else r=s.child;if(r!==null)r.return=s;else for(r=s;r!==null;){if(r===e){r=null;break}if(s=r.sibling,s!==null){s.return=r.return,r=s;break}r=r.return}s=r}}function Yr(e,t,n,i){e=null;for(var s=t,a=!1;s!==null;){if(!a){if((s.flags&524288)!==0)a=!0;else if((s.flags&262144)!==0)break}if(s.tag===10){var r=s.alternate;if(r===null)throw Error(j(387));if(r=r.memoizedProps,r!==null){var o=s.type;Jn(s.pendingProps.value,r.value)||(e!==null?e.push(o):e=[o])}}else if(s===Qc.current){if(r=s.alternate,r===null)throw Error(j(387));r.memoizedState.memoizedState!==s.memoizedState.memoizedState&&(e!==null?e.push(pl):e=[pl])}s=s.return}e!==null&&ap(t,e,n,i),t.flags|=262144}function au(e){for(e=e.firstContext;e!==null;){if(!Jn(e.context._currentValue,e.memoizedValue))return!0;e=e.next}return!1}function Ba(e){Xa=e,ds=null,e=e.dependencies,e!==null&&(e.firstContext=null)}function fn(e){return $_(Xa,e)}function Ac(e,t){return Xa===null&&Ba(e),$_(e,t)}function $_(e,t){var n=t._currentValue;if(t={context:t,memoizedValue:n,next:null},ds===null){if(e===null)throw Error(j(308));ds=t,e.dependencies={lanes:0,firstContext:t},e.flags|=524288}else ds=ds.next=t;return n}var B1=typeof AbortController<"u"?AbortController:function(){var e=[],t=this.signal={aborted:!1,addEventListener:function(n,i){e.push(i)}};this.abort=function(){t.aborted=!0,e.forEach(function(n){return n()})}},z1=Qe.unstable_scheduleCallback,F1=Qe.unstable_NormalPriority,qe={$$typeof:hs,Consumer:null,Provider:null,_currentValue:null,_currentValue2:null,_threadCount:0};function Qp(){return{controller:new B1,data:new Map,refCount:0}}function Ml(e){e.refCount--,e.refCount===0&&z1(F1,function(){e.controller.abort()})}var Yo=null,rp=0,Br=0,Dr=null;function V1(e,t){if(Yo===null){var n=Yo=[];rp=0,Br=bm(),Dr={status:"pending",value:void 0,then:function(i){n.push(i)}}}return rp++,t.then(cy,cy),t}function cy(){if(--rp===0&&Yo!==null){Dr!==null&&(Dr.status="fulfilled");var e=Yo;Yo=null,Br=0,Dr=null;for(var t=0;t<e.length;t++)(0,e[t])()}}function H1(e,t){var n=[],i={status:"pending",value:null,reason:null,then:function(s){n.push(s)}};return e.then(function(){i.status="fulfilled",i.value=t;for(var s=0;s<n.length;s++)(0,n[s])(t)},function(s){for(i.status="rejected",i.reason=s,s=0;s<n.length;s++)(0,n[s])(void 0)}),i}var uy=Dt.S;Dt.S=function(e,t){dx=Xn(),typeof t=="object"&&t!==null&&typeof t.then=="function"&&V1(e,t),uy!==null&&uy(e,t)};var La=qi(null);function jp(){var e=La.current;return e!==null?e:me.pooledCache}function Hc(e,t){t===null?xe(La,La.current):xe(La,t.pool)}function tv(){var e=jp();return e===null?null:{parent:qe._currentValue,pool:e}}var Zr=Error(j(460)),$p=Error(j(474)),Nu=Error(j(542)),ru={then:function(){}};function hy(e){return e=e.status,e==="fulfilled"||e==="rejected"}function ev(e,t,n){switch(n=e[n],n===void 0?e.push(t):n!==t&&(t.then(fs,fs),t=n),t.status){case"fulfilled":return t.value;case"rejected":throw e=t.reason,dy(e),e;default:if(typeof t.status=="string")t.then(fs,fs);else{if(e=me,e!==null&&100<e.shellSuspendCounter)throw Error(j(482));e=t,e.status="pending",e.then(function(i){if(t.status==="pending"){var s=t;s.status="fulfilled",s.value=i}},function(i){if(t.status==="pending"){var s=t;s.status="rejected",s.reason=i}})}switch(t.status){case"fulfilled":return t.value;case"rejected":throw e=t.reason,dy(e),e}throw Oa=t,Zr}}function Ra(e){try{var t=e._init;return t(e._payload)}catch(n){throw n!==null&&typeof n=="object"&&typeof n.then=="function"?(Oa=n,Zr):n}}var Oa=null;function fy(){if(Oa===null)throw Error(j(459));var e=Oa;return Oa=null,e}function dy(e){if(e===Zr||e===Nu)throw Error(j(483))}var Ur=null,cl=0;function wc(e){var t=cl;return cl+=1,Ur===null&&(Ur=[]),ev(Ur,e,t)}function Oo(e,t){t=t.props.ref,e.ref=t!==void 0?t:null}function Cc(e,t){throw t.$$typeof===wM?Error(j(525)):(e=Object.prototype.toString.call(t),Error(j(31,e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e)))}function nv(e){function t(d,g){if(e){var M=d.deletions;M===null?(d.deletions=[g],d.flags|=16):M.push(g)}}function n(d,g){if(!e)return null;for(;g!==null;)t(d,g),g=g.sibling;return null}function i(d){for(var g=new Map;d!==null;)d.key!==null?g.set(d.key,d):g.set(d.index,d),d=d.sibling;return g}function s(d,g){return d=ps(d,g),d.index=0,d.sibling=null,d}function a(d,g,M){return d.index=M,e?(M=d.alternate,M!==null?(M=M.index,M<g?(d.flags|=67108866,g):M):(d.flags|=67108866,g)):(d.flags|=1048576,g)}function r(d){return e&&d.alternate===null&&(d.flags|=67108866),d}function o(d,g,M,v){return g===null||g.tag!==6?(g=yd(M,d.mode,v),g.return=d,g):(g=s(g,M),g.return=d,g)}function l(d,g,M,v){var T=M.type;return T===mr?u(d,g,M.props.children,v,M.key):g!==null&&(g.elementType===T||typeof T=="object"&&T!==null&&T.$$typeof===Is&&Ra(T)===g.type)?(g=s(g,M.props),Oo(g,M),g.return=d,g):(g=Vc(M.type,M.key,M.props,null,d.mode,v),Oo(g,M),g.return=d,g)}function c(d,g,M,v){return g===null||g.tag!==4||g.stateNode.containerInfo!==M.containerInfo||g.stateNode.implementation!==M.implementation?(g=_d(M,d.mode,v),g.return=d,g):(g=s(g,M.children||[]),g.return=d,g)}function u(d,g,M,v,T){return g===null||g.tag!==7?(g=Na(M,d.mode,v,T),g.return=d,g):(g=s(g,M),g.return=d,g)}function p(d,g,M){if(typeof g=="string"&&g!==""||typeof g=="number"||typeof g=="bigint")return g=yd(""+g,d.mode,M),g.return=d,g;if(typeof g=="object"&&g!==null){switch(g.$$typeof){case _c:return M=Vc(g.type,g.key,g.props,null,d.mode,M),Oo(M,g),M.return=d,M;case Fo:return g=_d(g,d.mode,M),g.return=d,g;case Is:return g=Ra(g),p(d,g,M)}if(Vo(g)||No(g))return g=Na(g,d.mode,M,null),g.return=d,g;if(typeof g.then=="function")return p(d,wc(g),M);if(g.$$typeof===hs)return p(d,Ac(d,g),M);Cc(d,g)}return null}function h(d,g,M,v){var T=g!==null?g.key:null;if(typeof M=="string"&&M!==""||typeof M=="number"||typeof M=="bigint")return T!==null?null:o(d,g,""+M,v);if(typeof M=="object"&&M!==null){switch(M.$$typeof){case _c:return M.key===T?l(d,g,M,v):null;case Fo:return M.key===T?c(d,g,M,v):null;case Is:return M=Ra(M),h(d,g,M,v)}if(Vo(M)||No(M))return T!==null?null:u(d,g,M,v,null);if(typeof M.then=="function")return h(d,g,wc(M),v);if(M.$$typeof===hs)return h(d,g,Ac(d,M),v);Cc(d,M)}return null}function f(d,g,M,v,T){if(typeof v=="string"&&v!==""||typeof v=="number"||typeof v=="bigint")return d=d.get(M)||null,o(g,d,""+v,T);if(typeof v=="object"&&v!==null){switch(v.$$typeof){case _c:return d=d.get(v.key===null?M:v.key)||null,l(g,d,v,T);case Fo:return d=d.get(v.key===null?M:v.key)||null,c(g,d,v,T);case Is:return v=Ra(v),f(d,g,M,v,T)}if(Vo(v)||No(v))return d=d.get(M)||null,u(g,d,v,T,null);if(typeof v.then=="function")return f(d,g,M,wc(v),T);if(v.$$typeof===hs)return f(d,g,M,Ac(g,v),T);Cc(g,v)}return null}function m(d,g,M,v){for(var T=null,E=null,w=g,x=g=0,A=null;w!==null&&x<M.length;x++){w.index>x?(A=w,w=null):A=w.sibling;var R=h(d,w,M[x],v);if(R===null){w===null&&(w=A);break}e&&w&&R.alternate===null&&t(d,w),g=a(R,g,x),E===null?T=R:E.sibling=R,E=R,w=A}if(x===M.length)return n(d,w),Jt&&cs(d,x),T;if(w===null){for(;x<M.length;x++)w=p(d,M[x],v),w!==null&&(g=a(w,g,x),E===null?T=w:E.sibling=w,E=w);return Jt&&cs(d,x),T}for(w=i(w);x<M.length;x++)A=f(w,d,x,M[x],v),A!==null&&(e&&A.alternate!==null&&w.delete(A.key===null?x:A.key),g=a(A,g,x),E===null?T=A:E.sibling=A,E=A);return e&&w.forEach(function(O){return t(d,O)}),Jt&&cs(d,x),T}function b(d,g,M,v){if(M==null)throw Error(j(151));for(var T=null,E=null,w=g,x=g=0,A=null,R=M.next();w!==null&&!R.done;x++,R=M.next()){w.index>x?(A=w,w=null):A=w.sibling;var O=h(d,w,R.value,v);if(O===null){w===null&&(w=A);break}e&&w&&O.alternate===null&&t(d,w),g=a(O,g,x),E===null?T=O:E.sibling=O,E=O,w=A}if(R.done)return n(d,w),Jt&&cs(d,x),T;if(w===null){for(;!R.done;x++,R=M.next())R=p(d,R.value,v),R!==null&&(g=a(R,g,x),E===null?T=R:E.sibling=R,E=R);return Jt&&cs(d,x),T}for(w=i(w);!R.done;x++,R=M.next())R=f(w,d,x,R.value,v),R!==null&&(e&&R.alternate!==null&&w.delete(R.key===null?x:R.key),g=a(R,g,x),E===null?T=R:E.sibling=R,E=R);return e&&w.forEach(function(z){return t(d,z)}),Jt&&cs(d,x),T}function y(d,g,M,v){if(typeof M=="object"&&M!==null&&M.type===mr&&M.key===null&&(M=M.props.children),typeof M=="object"&&M!==null){switch(M.$$typeof){case _c:t:{for(var T=M.key;g!==null;){if(g.key===T){if(T=M.type,T===mr){if(g.tag===7){n(d,g.sibling),v=s(g,M.props.children),v.return=d,d=v;break t}}else if(g.elementType===T||typeof T=="object"&&T!==null&&T.$$typeof===Is&&Ra(T)===g.type){n(d,g.sibling),v=s(g,M.props),Oo(v,M),v.return=d,d=v;break t}n(d,g);break}else t(d,g);g=g.sibling}M.type===mr?(v=Na(M.props.children,d.mode,v,M.key),v.return=d,d=v):(v=Vc(M.type,M.key,M.props,null,d.mode,v),Oo(v,M),v.return=d,d=v)}return r(d);case Fo:t:{for(T=M.key;g!==null;){if(g.key===T)if(g.tag===4&&g.stateNode.containerInfo===M.containerInfo&&g.stateNode.implementation===M.implementation){n(d,g.sibling),v=s(g,M.children||[]),v.return=d,d=v;break t}else{n(d,g);break}else t(d,g);g=g.sibling}v=_d(M,d.mode,v),v.return=d,d=v}return r(d);case Is:return M=Ra(M),y(d,g,M,v)}if(Vo(M))return m(d,g,M,v);if(No(M)){if(T=No(M),typeof T!="function")throw Error(j(150));return M=T.call(M),b(d,g,M,v)}if(typeof M.then=="function")return y(d,g,wc(M),v);if(M.$$typeof===hs)return y(d,g,Ac(d,M),v);Cc(d,M)}return typeof M=="string"&&M!==""||typeof M=="number"||typeof M=="bigint"?(M=""+M,g!==null&&g.tag===6?(n(d,g.sibling),v=s(g,M),v.return=d,d=v):(n(d,g),v=yd(M,d.mode,v),v.return=d,d=v),r(d)):n(d,g)}return function(d,g,M,v){try{cl=0;var T=y(d,g,M,v);return Ur=null,T}catch(w){if(w===Zr||w===Nu)throw w;var E=Gn(29,w,null,d.mode);return E.lanes=v,E.return=d,E}finally{}}}var za=nv(!0),iv=nv(!1),Ps=!1;function tm(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,lanes:0,hiddenCallbacks:null},callbacks:null}}function op(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,callbacks:null})}function Zs(e){return{lane:e,tag:0,payload:null,callback:null,next:null}}function Js(e,t,n){var i=e.updateQueue;if(i===null)return null;if(i=i.shared,(ie&2)!==0){var s=i.pending;return s===null?t.next=t:(t.next=s.next,s.next=t),i.pending=t,t=iu(e),Z_(e,null,n),t}return Uu(e,i,t,n),iu(e)}function Zo(e,t,n){if(t=t.updateQueue,t!==null&&(t=t.shared,(n&4194048)!==0)){var i=t.lanes;i&=e.pendingLanes,n|=i,t.lanes=n,S_(e,n)}}function xd(e,t){var n=e.updateQueue,i=e.alternate;if(i!==null&&(i=i.updateQueue,n===i)){var s=null,a=null;if(n=n.firstBaseUpdate,n!==null){do{var r={lane:n.lane,tag:n.tag,payload:n.payload,callback:null,next:null};a===null?s=a=r:a=a.next=r,n=n.next}while(n!==null);a===null?s=a=t:a=a.next=t}else s=a=t;n={baseState:i.baseState,firstBaseUpdate:s,lastBaseUpdate:a,shared:i.shared,callbacks:i.callbacks},e.updateQueue=n;return}e=n.lastBaseUpdate,e===null?n.firstBaseUpdate=t:e.next=t,n.lastBaseUpdate=t}var lp=!1;function Jo(){if(lp){var e=Dr;if(e!==null)throw e}}function Ko(e,t,n,i){lp=!1;var s=e.updateQueue;Ps=!1;var a=s.firstBaseUpdate,r=s.lastBaseUpdate,o=s.shared.pending;if(o!==null){s.shared.pending=null;var l=o,c=l.next;l.next=null,r===null?a=c:r.next=c,r=l;var u=e.alternate;u!==null&&(u=u.updateQueue,o=u.lastBaseUpdate,o!==r&&(o===null?u.firstBaseUpdate=c:o.next=c,u.lastBaseUpdate=l))}if(a!==null){var p=s.baseState;r=0,u=c=l=null,o=a;do{var h=o.lane&-536870913,f=h!==o.lane;if(f?(Yt&h)===h:(i&h)===h){h!==0&&h===Br&&(lp=!0),u!==null&&(u=u.next={lane:0,tag:o.tag,payload:o.payload,callback:null,next:null});t:{var m=e,b=o;h=t;var y=n;switch(b.tag){case 1:if(m=b.payload,typeof m=="function"){p=m.call(y,p,h);break t}p=m;break t;case 3:m.flags=m.flags&-65537|128;case 0:if(m=b.payload,h=typeof m=="function"?m.call(y,p,h):m,h==null)break t;p=Ee({},p,h);break t;case 2:Ps=!0}}h=o.callback,h!==null&&(e.flags|=64,f&&(e.flags|=8192),f=s.callbacks,f===null?s.callbacks=[h]:f.push(h))}else f={lane:h,tag:o.tag,payload:o.payload,callback:o.callback,next:null},u===null?(c=u=f,l=p):u=u.next=f,r|=h;if(o=o.next,o===null){if(o=s.shared.pending,o===null)break;f=o,o=f.next,f.next=null,s.lastBaseUpdate=f,s.shared.pending=null}}while(!0);u===null&&(l=p),s.baseState=l,s.firstBaseUpdate=c,s.lastBaseUpdate=u,a===null&&(s.shared.lanes=0),sa|=r,e.lanes=r,e.memoizedState=p}}function sv(e,t){if(typeof e!="function")throw Error(j(191,e));e.call(t)}function av(e,t){var n=e.callbacks;if(n!==null)for(e.callbacks=null,e=0;e<n.length;e++)sv(n[e],t)}var zr=qi(null),ou=qi(0);function py(e,t){e=Ss,xe(ou,e),xe(zr,t),Ss=e|t.baseLanes}function cp(){xe(ou,Ss),xe(zr,zr.current)}function em(){Ss=ou.current,rn(zr),rn(ou)}var Kn=qi(null),fi=null;function zs(e){var t=e.alternate;xe(ze,ze.current&1),xe(Kn,e),fi===null&&(t===null||zr.current!==null||t.memoizedState!==null)&&(fi=e)}function up(e){xe(ze,ze.current),xe(Kn,e),fi===null&&(fi=e)}function rv(e){e.tag===22?(xe(ze,ze.current),xe(Kn,e),fi===null&&(fi=e)):Fs(e)}function Fs(){xe(ze,ze.current),xe(Kn,Kn.current)}function kn(e){rn(Kn),fi===e&&(fi=null),rn(ze)}var ze=qi(0);function lu(e){for(var t=e;t!==null;){if(t.tag===13){var n=t.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||Rp(n)||Dp(n)))return t}else if(t.tag===19&&(t.memoizedProps.revealOrder==="forwards"||t.memoizedProps.revealOrder==="backwards"||t.memoizedProps.revealOrder==="unstable_legacy-backwards"||t.memoizedProps.revealOrder==="together")){if((t.flags&128)!==0)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var _s=0,Bt=null,de=null,We=null,cu=!1,Nr=!1,Fa=!1,uu=0,ul=0,Lr=null,k1=0;function Oe(){throw Error(j(321))}function nm(e,t){if(t===null)return!1;for(var n=0;n<t.length&&n<e.length;n++)if(!Jn(e[n],t[n]))return!1;return!0}function im(e,t,n,i,s,a){return _s=a,Bt=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,Dt.H=e===null||e.memoizedState===null?Bv:pm,Fa=!1,a=n(i,s),Fa=!1,Nr&&(a=lv(t,n,i,s)),ov(e),a}function ov(e){Dt.H=hl;var t=de!==null&&de.next!==null;if(_s=0,We=de=Bt=null,cu=!1,ul=0,Lr=null,t)throw Error(j(300));e===null||Ye||(e=e.dependencies,e!==null&&au(e)&&(Ye=!0))}function lv(e,t,n,i){Bt=e;var s=0;do{if(Nr&&(Lr=null),ul=0,Nr=!1,25<=s)throw Error(j(301));if(s+=1,We=de=null,e.updateQueue!=null){var a=e.updateQueue;a.lastEffect=null,a.events=null,a.stores=null,a.memoCache!=null&&(a.memoCache.index=0)}Dt.H=zv,a=t(n,i)}while(Nr);return a}function G1(){var e=Dt.H,t=e.useState()[0];return t=typeof t.then=="function"?Tl(t):t,e=e.useState()[0],(de!==null?de.memoizedState:null)!==e&&(Bt.flags|=1024),t}function sm(){var e=uu!==0;return uu=0,e}function am(e,t,n){t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~n}function rm(e){if(cu){for(e=e.memoizedState;e!==null;){var t=e.queue;t!==null&&(t.pending=null),e=e.next}cu=!1}_s=0,We=de=Bt=null,Nr=!1,ul=uu=0,Lr=null}function An(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return We===null?Bt.memoizedState=We=e:We=We.next=e,We}function Fe(){if(de===null){var e=Bt.alternate;e=e!==null?e.memoizedState:null}else e=de.next;var t=We===null?Bt.memoizedState:We.next;if(t!==null)We=t,de=e;else{if(e===null)throw Bt.alternate===null?Error(j(467)):Error(j(310));de=e,e={memoizedState:de.memoizedState,baseState:de.baseState,baseQueue:de.baseQueue,queue:de.queue,next:null},We===null?Bt.memoizedState=We=e:We=We.next=e}return We}function Lu(){return{lastEffect:null,events:null,stores:null,memoCache:null}}function Tl(e){var t=ul;return ul+=1,Lr===null&&(Lr=[]),e=ev(Lr,e,t),t=Bt,(We===null?t.memoizedState:We.next)===null&&(t=t.alternate,Dt.H=t===null||t.memoizedState===null?Bv:pm),e}function Ou(e){if(e!==null&&typeof e=="object"){if(typeof e.then=="function")return Tl(e);if(e.$$typeof===hs)return fn(e)}throw Error(j(438,String(e)))}function om(e){var t=null,n=Bt.updateQueue;if(n!==null&&(t=n.memoCache),t==null){var i=Bt.alternate;i!==null&&(i=i.updateQueue,i!==null&&(i=i.memoCache,i!=null&&(t={data:i.data.map(function(s){return s.slice()}),index:0})))}if(t==null&&(t={data:[],index:0}),n===null&&(n=Lu(),Bt.updateQueue=n),n.memoCache=t,n=t.data[t.index],n===void 0)for(n=t.data[t.index]=Array(e),i=0;i<e;i++)n[i]=CM;return t.index++,n}function vs(e,t){return typeof t=="function"?t(e):t}function kc(e){var t=Fe();return lm(t,de,e)}function lm(e,t,n){var i=e.queue;if(i===null)throw Error(j(311));i.lastRenderedReducer=n;var s=e.baseQueue,a=i.pending;if(a!==null){if(s!==null){var r=s.next;s.next=a.next,a.next=r}t.baseQueue=s=a,i.pending=null}if(a=e.baseState,s===null)e.memoizedState=a;else{t=s.next;var o=r=null,l=null,c=t,u=!1;do{var p=c.lane&-536870913;if(p!==c.lane?(Yt&p)===p:(_s&p)===p){var h=c.revertLane;if(h===0)l!==null&&(l=l.next={lane:0,revertLane:0,gesture:null,action:c.action,hasEagerState:c.hasEagerState,eagerState:c.eagerState,next:null}),p===Br&&(u=!0);else if((_s&h)===h){c=c.next,h===Br&&(u=!0);continue}else p={lane:0,revertLane:c.revertLane,gesture:null,action:c.action,hasEagerState:c.hasEagerState,eagerState:c.eagerState,next:null},l===null?(o=l=p,r=a):l=l.next=p,Bt.lanes|=h,sa|=h;p=c.action,Fa&&n(a,p),a=c.hasEagerState?c.eagerState:n(a,p)}else h={lane:p,revertLane:c.revertLane,gesture:c.gesture,action:c.action,hasEagerState:c.hasEagerState,eagerState:c.eagerState,next:null},l===null?(o=l=h,r=a):l=l.next=h,Bt.lanes|=p,sa|=p;c=c.next}while(c!==null&&c!==t);if(l===null?r=a:l.next=o,!Jn(a,e.memoizedState)&&(Ye=!0,u&&(n=Dr,n!==null)))throw n;e.memoizedState=a,e.baseState=r,e.baseQueue=l,i.lastRenderedState=a}return s===null&&(i.lanes=0),[e.memoizedState,i.dispatch]}function Sd(e){var t=Fe(),n=t.queue;if(n===null)throw Error(j(311));n.lastRenderedReducer=e;var i=n.dispatch,s=n.pending,a=t.memoizedState;if(s!==null){n.pending=null;var r=s=s.next;do a=e(a,r.action),r=r.next;while(r!==s);Jn(a,t.memoizedState)||(Ye=!0),t.memoizedState=a,t.baseQueue===null&&(t.baseState=a),n.lastRenderedState=a}return[a,i]}function cv(e,t,n){var i=Bt,s=Fe(),a=Jt;if(a){if(n===void 0)throw Error(j(407));n=n()}else n=t();var r=!Jn((de||s).memoizedState,n);if(r&&(s.memoizedState=n,Ye=!0),s=s.queue,cm(fv.bind(null,i,s,e),[e]),s.getSnapshot!==t||r||We!==null&&We.memoizedState.tag&1){if(i.flags|=2048,Fr(9,{destroy:void 0},hv.bind(null,i,s,n,t),null),me===null)throw Error(j(349));a||(_s&127)!==0||uv(i,t,n)}return n}function uv(e,t,n){e.flags|=16384,e={getSnapshot:t,value:n},t=Bt.updateQueue,t===null?(t=Lu(),Bt.updateQueue=t,t.stores=[e]):(n=t.stores,n===null?t.stores=[e]:n.push(e))}function hv(e,t,n,i){t.value=n,t.getSnapshot=i,dv(t)&&pv(e)}function fv(e,t,n){return n(function(){dv(t)&&pv(e)})}function dv(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!Jn(e,n)}catch{return!0}}function pv(e){var t=Wa(e,2);t!==null&&On(t,e,2)}function hp(e){var t=An();if(typeof e=="function"){var n=e;if(e=n(),Fa){Hs(!0);try{n()}finally{Hs(!1)}}}return t.memoizedState=t.baseState=e,t.queue={pending:null,lanes:0,dispatch:null,lastRenderedReducer:vs,lastRenderedState:e},t}function mv(e,t,n,i){return e.baseState=n,lm(e,de,typeof i=="function"?i:vs)}function W1(e,t,n,i,s){if(Pu(e))throw Error(j(485));if(e=t.action,e!==null){var a={payload:s,action:e,next:null,isTransition:!0,status:"pending",value:null,reason:null,listeners:[],then:function(r){a.listeners.push(r)}};Dt.T!==null?n(!0):a.isTransition=!1,i(a),n=t.pending,n===null?(a.next=t.pending=a,gv(t,a)):(a.next=n.next,t.pending=n.next=a)}}function gv(e,t){var n=t.action,i=t.payload,s=e.state;if(t.isTransition){var a=Dt.T,r={};Dt.T=r;try{var o=n(s,i),l=Dt.S;l!==null&&l(r,o),my(e,t,o)}catch(c){fp(e,t,c)}finally{a!==null&&r.types!==null&&(a.types=r.types),Dt.T=a}}else try{a=n(s,i),my(e,t,a)}catch(c){fp(e,t,c)}}function my(e,t,n){n!==null&&typeof n=="object"&&typeof n.then=="function"?n.then(function(i){gy(e,t,i)},function(i){return fp(e,t,i)}):gy(e,t,n)}function gy(e,t,n){t.status="fulfilled",t.value=n,yv(t),e.state=n,t=e.pending,t!==null&&(n=t.next,n===t?e.pending=null:(n=n.next,t.next=n,gv(e,n)))}function fp(e,t,n){var i=e.pending;if(e.pending=null,i!==null){i=i.next;do t.status="rejected",t.reason=n,yv(t),t=t.next;while(t!==i)}e.action=null}function yv(e){e=e.listeners;for(var t=0;t<e.length;t++)(0,e[t])()}function _v(e,t){return t}function yy(e,t){if(Jt){var n=me.formState;if(n!==null){t:{var i=Bt;if(Jt){if(Te){e:{for(var s=Te,a=hi;s.nodeType!==8;){if(!a){s=null;break e}if(s=di(s.nextSibling),s===null){s=null;break e}}a=s.data,s=a==="F!"||a==="F"?s:null}if(s){Te=di(s.nextSibling),i=s.data==="F!";break t}}na(i)}i=!1}i&&(t=n[0])}}return n=An(),n.memoizedState=n.baseState=t,i={pending:null,lanes:0,dispatch:null,lastRenderedReducer:_v,lastRenderedState:t},n.queue=i,n=Ov.bind(null,Bt,i),i.dispatch=n,i=hp(!1),a=dm.bind(null,Bt,!1,i.queue),i=An(),s={state:t,dispatch:null,action:e,pending:null},i.queue=s,n=W1.bind(null,Bt,s,a,n),s.dispatch=n,i.memoizedState=e,[t,n,!1]}function _y(e){var t=Fe();return vv(t,de,e)}function vv(e,t,n){if(t=lm(e,t,_v)[0],e=kc(vs)[0],typeof t=="object"&&t!==null&&typeof t.then=="function")try{var i=Tl(t)}catch(r){throw r===Zr?Nu:r}else i=t;t=Fe();var s=t.queue,a=s.dispatch;return n!==t.memoizedState&&(Bt.flags|=2048,Fr(9,{destroy:void 0},X1.bind(null,s,n),null)),[i,a,e]}function X1(e,t){e.action=t}function vy(e){var t=Fe(),n=de;if(n!==null)return vv(t,n,e);Fe(),t=t.memoizedState,n=Fe();var i=n.queue.dispatch;return n.memoizedState=e,[t,i,!1]}function Fr(e,t,n,i){return e={tag:e,create:n,deps:i,inst:t,next:null},t=Bt.updateQueue,t===null&&(t=Lu(),Bt.updateQueue=t),n=t.lastEffect,n===null?t.lastEffect=e.next=e:(i=n.next,n.next=e,e.next=i,t.lastEffect=e),e}function xv(){return Fe().memoizedState}function Gc(e,t,n,i){var s=An();Bt.flags|=e,s.memoizedState=Fr(1|t,{destroy:void 0},n,i===void 0?null:i)}function Iu(e,t,n,i){var s=Fe();i=i===void 0?null:i;var a=s.memoizedState.inst;de!==null&&i!==null&&nm(i,de.memoizedState.deps)?s.memoizedState=Fr(t,a,n,i):(Bt.flags|=e,s.memoizedState=Fr(1|t,a,n,i))}function xy(e,t){Gc(8390656,8,e,t)}function cm(e,t){Iu(2048,8,e,t)}function q1(e){Bt.flags|=4;var t=Bt.updateQueue;if(t===null)t=Lu(),Bt.updateQueue=t,t.events=[e];else{var n=t.events;n===null?t.events=[e]:n.push(e)}}function Sv(e){var t=Fe().memoizedState;return q1({ref:t,nextImpl:e}),function(){if((ie&2)!==0)throw Error(j(440));return t.impl.apply(void 0,arguments)}}function bv(e,t){return Iu(4,2,e,t)}function Mv(e,t){return Iu(4,4,e,t)}function Tv(e,t){if(typeof t=="function"){e=e();var n=t(e);return function(){typeof n=="function"?n():t(null)}}if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function Ev(e,t,n){n=n!=null?n.concat([e]):null,Iu(4,4,Tv.bind(null,t,e),n)}function um(){}function Av(e,t){var n=Fe();t=t===void 0?null:t;var i=n.memoizedState;return t!==null&&nm(t,i[1])?i[0]:(n.memoizedState=[e,t],e)}function wv(e,t){var n=Fe();t=t===void 0?null:t;var i=n.memoizedState;if(t!==null&&nm(t,i[1]))return i[0];if(i=e(),Fa){Hs(!0);try{e()}finally{Hs(!1)}}return n.memoizedState=[i,t],i}function hm(e,t,n){return n===void 0||(_s&1073741824)!==0&&(Yt&261930)===0?e.memoizedState=t:(e.memoizedState=n,e=mx(),Bt.lanes|=e,sa|=e,n)}function Cv(e,t,n,i){return Jn(n,t)?n:zr.current!==null?(e=hm(e,n,i),Jn(e,t)||(Ye=!0),e):(_s&42)===0||(_s&1073741824)!==0&&(Yt&261930)===0?(Ye=!0,e.memoizedState=n):(e=mx(),Bt.lanes|=e,sa|=e,t)}function Rv(e,t,n,i,s){var a=se.p;se.p=a!==0&&8>a?a:8;var r=Dt.T,o={};Dt.T=o,dm(e,!1,t,n);try{var l=s(),c=Dt.S;if(c!==null&&c(o,l),l!==null&&typeof l=="object"&&typeof l.then=="function"){var u=H1(l,i);Qo(e,t,u,Zn(e))}else Qo(e,t,i,Zn(e))}catch(p){Qo(e,t,{then:function(){},status:"rejected",reason:p},Zn())}finally{se.p=a,r!==null&&o.types!==null&&(r.types=o.types),Dt.T=r}}function Y1(){}function dp(e,t,n,i){if(e.tag!==5)throw Error(j(476));var s=Dv(e).queue;Rv(e,s,t,Ua,n===null?Y1:function(){return Uv(e),n(i)})}function Dv(e){var t=e.memoizedState;if(t!==null)return t;t={memoizedState:Ua,baseState:Ua,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:vs,lastRenderedState:Ua},next:null};var n={};return t.next={memoizedState:n,baseState:n,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:vs,lastRenderedState:n},next:null},e.memoizedState=t,e=e.alternate,e!==null&&(e.memoizedState=t),t}function Uv(e){var t=Dv(e);t.next===null&&(t=e.alternate.memoizedState),Qo(e,t.next.queue,{},Zn())}function fm(){return fn(pl)}function Nv(){return Fe().memoizedState}function Lv(){return Fe().memoizedState}function Z1(e){for(var t=e.return;t!==null;){switch(t.tag){case 24:case 3:var n=Zn();e=Zs(n);var i=Js(t,e,n);i!==null&&(On(i,t,n),Zo(i,t,n)),t={cache:Qp()},e.payload=t;return}t=t.return}}function J1(e,t,n){var i=Zn();n={lane:i,revertLane:0,gesture:null,action:n,hasEagerState:!1,eagerState:null,next:null},Pu(e)?Iv(t,n):(n=Yp(e,t,n,i),n!==null&&(On(n,e,i),Pv(n,t,i)))}function Ov(e,t,n){var i=Zn();Qo(e,t,n,i)}function Qo(e,t,n,i){var s={lane:i,revertLane:0,gesture:null,action:n,hasEagerState:!1,eagerState:null,next:null};if(Pu(e))Iv(t,s);else{var a=e.alternate;if(e.lanes===0&&(a===null||a.lanes===0)&&(a=t.lastRenderedReducer,a!==null))try{var r=t.lastRenderedState,o=a(r,n);if(s.hasEagerState=!0,s.eagerState=o,Jn(o,r))return Uu(e,t,s,0),me===null&&Du(),!1}catch{}finally{}if(n=Yp(e,t,s,i),n!==null)return On(n,e,i),Pv(n,t,i),!0}return!1}function dm(e,t,n,i){if(i={lane:2,revertLane:bm(),gesture:null,action:i,hasEagerState:!1,eagerState:null,next:null},Pu(e)){if(t)throw Error(j(479))}else t=Yp(e,n,i,2),t!==null&&On(t,e,2)}function Pu(e){var t=e.alternate;return e===Bt||t!==null&&t===Bt}function Iv(e,t){Nr=cu=!0;var n=e.pending;n===null?t.next=t:(t.next=n.next,n.next=t),e.pending=t}function Pv(e,t,n){if((n&4194048)!==0){var i=t.lanes;i&=e.pendingLanes,n|=i,t.lanes=n,S_(e,n)}}var hl={readContext:fn,use:Ou,useCallback:Oe,useContext:Oe,useEffect:Oe,useImperativeHandle:Oe,useLayoutEffect:Oe,useInsertionEffect:Oe,useMemo:Oe,useReducer:Oe,useRef:Oe,useState:Oe,useDebugValue:Oe,useDeferredValue:Oe,useTransition:Oe,useSyncExternalStore:Oe,useId:Oe,useHostTransitionStatus:Oe,useFormState:Oe,useActionState:Oe,useOptimistic:Oe,useMemoCache:Oe,useCacheRefresh:Oe};hl.useEffectEvent=Oe;var Bv={readContext:fn,use:Ou,useCallback:function(e,t){return An().memoizedState=[e,t===void 0?null:t],e},useContext:fn,useEffect:xy,useImperativeHandle:function(e,t,n){n=n!=null?n.concat([e]):null,Gc(4194308,4,Tv.bind(null,t,e),n)},useLayoutEffect:function(e,t){return Gc(4194308,4,e,t)},useInsertionEffect:function(e,t){Gc(4,2,e,t)},useMemo:function(e,t){var n=An();t=t===void 0?null:t;var i=e();if(Fa){Hs(!0);try{e()}finally{Hs(!1)}}return n.memoizedState=[i,t],i},useReducer:function(e,t,n){var i=An();if(n!==void 0){var s=n(t);if(Fa){Hs(!0);try{n(t)}finally{Hs(!1)}}}else s=t;return i.memoizedState=i.baseState=s,e={pending:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:s},i.queue=e,e=e.dispatch=J1.bind(null,Bt,e),[i.memoizedState,e]},useRef:function(e){var t=An();return e={current:e},t.memoizedState=e},useState:function(e){e=hp(e);var t=e.queue,n=Ov.bind(null,Bt,t);return t.dispatch=n,[e.memoizedState,n]},useDebugValue:um,useDeferredValue:function(e,t){var n=An();return hm(n,e,t)},useTransition:function(){var e=hp(!1);return e=Rv.bind(null,Bt,e.queue,!0,!1),An().memoizedState=e,[!1,e]},useSyncExternalStore:function(e,t,n){var i=Bt,s=An();if(Jt){if(n===void 0)throw Error(j(407));n=n()}else{if(n=t(),me===null)throw Error(j(349));(Yt&127)!==0||uv(i,t,n)}s.memoizedState=n;var a={value:n,getSnapshot:t};return s.queue=a,xy(fv.bind(null,i,a,e),[e]),i.flags|=2048,Fr(9,{destroy:void 0},hv.bind(null,i,a,n,t),null),n},useId:function(){var e=An(),t=me.identifierPrefix;if(Jt){var n=Gi,i=ki;n=(i&~(1<<32-Yn(i)-1)).toString(32)+n,t="_"+t+"R_"+n,n=uu++,0<n&&(t+="H"+n.toString(32)),t+="_"}else n=k1++,t="_"+t+"r_"+n.toString(32)+"_";return e.memoizedState=t},useHostTransitionStatus:fm,useFormState:yy,useActionState:yy,useOptimistic:function(e){var t=An();t.memoizedState=t.baseState=e;var n={pending:null,lanes:0,dispatch:null,lastRenderedReducer:null,lastRenderedState:null};return t.queue=n,t=dm.bind(null,Bt,!0,n),n.dispatch=t,[e,t]},useMemoCache:om,useCacheRefresh:function(){return An().memoizedState=Z1.bind(null,Bt)},useEffectEvent:function(e){var t=An(),n={impl:e};return t.memoizedState=n,function(){if((ie&2)!==0)throw Error(j(440));return n.impl.apply(void 0,arguments)}}},pm={readContext:fn,use:Ou,useCallback:Av,useContext:fn,useEffect:cm,useImperativeHandle:Ev,useInsertionEffect:bv,useLayoutEffect:Mv,useMemo:wv,useReducer:kc,useRef:xv,useState:function(){return kc(vs)},useDebugValue:um,useDeferredValue:function(e,t){var n=Fe();return Cv(n,de.memoizedState,e,t)},useTransition:function(){var e=kc(vs)[0],t=Fe().memoizedState;return[typeof e=="boolean"?e:Tl(e),t]},useSyncExternalStore:cv,useId:Nv,useHostTransitionStatus:fm,useFormState:_y,useActionState:_y,useOptimistic:function(e,t){var n=Fe();return mv(n,de,e,t)},useMemoCache:om,useCacheRefresh:Lv};pm.useEffectEvent=Sv;var zv={readContext:fn,use:Ou,useCallback:Av,useContext:fn,useEffect:cm,useImperativeHandle:Ev,useInsertionEffect:bv,useLayoutEffect:Mv,useMemo:wv,useReducer:Sd,useRef:xv,useState:function(){return Sd(vs)},useDebugValue:um,useDeferredValue:function(e,t){var n=Fe();return de===null?hm(n,e,t):Cv(n,de.memoizedState,e,t)},useTransition:function(){var e=Sd(vs)[0],t=Fe().memoizedState;return[typeof e=="boolean"?e:Tl(e),t]},useSyncExternalStore:cv,useId:Nv,useHostTransitionStatus:fm,useFormState:vy,useActionState:vy,useOptimistic:function(e,t){var n=Fe();return de!==null?mv(n,de,e,t):(n.baseState=e,[e,n.queue.dispatch])},useMemoCache:om,useCacheRefresh:Lv};zv.useEffectEvent=Sv;function bd(e,t,n,i){t=e.memoizedState,n=n(i,t),n=n==null?t:Ee({},t,n),e.memoizedState=n,e.lanes===0&&(e.updateQueue.baseState=n)}var pp={enqueueSetState:function(e,t,n){e=e._reactInternals;var i=Zn(),s=Zs(i);s.payload=t,n!=null&&(s.callback=n),t=Js(e,s,i),t!==null&&(On(t,e,i),Zo(t,e,i))},enqueueReplaceState:function(e,t,n){e=e._reactInternals;var i=Zn(),s=Zs(i);s.tag=1,s.payload=t,n!=null&&(s.callback=n),t=Js(e,s,i),t!==null&&(On(t,e,i),Zo(t,e,i))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var n=Zn(),i=Zs(n);i.tag=2,t!=null&&(i.callback=t),t=Js(e,i,n),t!==null&&(On(t,e,n),Zo(t,e,n))}};function Sy(e,t,n,i,s,a,r){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(i,a,r):t.prototype&&t.prototype.isPureReactComponent?!rl(n,i)||!rl(s,a):!0}function by(e,t,n,i){e=t.state,typeof t.componentWillReceiveProps=="function"&&t.componentWillReceiveProps(n,i),typeof t.UNSAFE_componentWillReceiveProps=="function"&&t.UNSAFE_componentWillReceiveProps(n,i),t.state!==e&&pp.enqueueReplaceState(t,t.state,null)}function Va(e,t){var n=t;if("ref"in t){n={};for(var i in t)i!=="ref"&&(n[i]=t[i])}if(e=e.defaultProps){n===t&&(n=Ee({},n));for(var s in e)n[s]===void 0&&(n[s]=e[s])}return n}function Fv(e){nu(e)}function Vv(e){console.error(e)}function Hv(e){nu(e)}function hu(e,t){try{var n=e.onUncaughtError;n(t.value,{componentStack:t.stack})}catch(i){setTimeout(function(){throw i})}}function My(e,t,n){try{var i=e.onCaughtError;i(n.value,{componentStack:n.stack,errorBoundary:t.tag===1?t.stateNode:null})}catch(s){setTimeout(function(){throw s})}}function mp(e,t,n){return n=Zs(n),n.tag=3,n.payload={element:null},n.callback=function(){hu(e,t)},n}function kv(e){return e=Zs(e),e.tag=3,e}function Gv(e,t,n,i){var s=n.type.getDerivedStateFromError;if(typeof s=="function"){var a=i.value;e.payload=function(){return s(a)},e.callback=function(){My(t,n,i)}}var r=n.stateNode;r!==null&&typeof r.componentDidCatch=="function"&&(e.callback=function(){My(t,n,i),typeof s!="function"&&(Ks===null?Ks=new Set([this]):Ks.add(this));var o=i.stack;this.componentDidCatch(i.value,{componentStack:o!==null?o:""})})}function K1(e,t,n,i,s){if(n.flags|=32768,i!==null&&typeof i=="object"&&typeof i.then=="function"){if(t=n.alternate,t!==null&&Yr(t,n,s,!0),n=Kn.current,n!==null){switch(n.tag){case 31:case 13:return fi===null?gu():n.alternate===null&&Ie===0&&(Ie=3),n.flags&=-257,n.flags|=65536,n.lanes=s,i===ru?n.flags|=16384:(t=n.updateQueue,t===null?n.updateQueue=new Set([i]):t.add(i),Ld(e,i,s)),!1;case 22:return n.flags|=65536,i===ru?n.flags|=16384:(t=n.updateQueue,t===null?(t={transitions:null,markerInstances:null,retryQueue:new Set([i])},n.updateQueue=t):(n=t.retryQueue,n===null?t.retryQueue=new Set([i]):n.add(i)),Ld(e,i,s)),!1}throw Error(j(435,n.tag))}return Ld(e,i,s),gu(),!1}if(Jt)return t=Kn.current,t!==null?((t.flags&65536)===0&&(t.flags|=256),t.flags|=65536,t.lanes=s,i!==np&&(e=Error(j(422),{cause:i}),ll(ui(e,n)))):(i!==np&&(t=Error(j(423),{cause:i}),ll(ui(t,n))),e=e.current.alternate,e.flags|=65536,s&=-s,e.lanes|=s,i=ui(i,n),s=mp(e.stateNode,i,s),xd(e,s),Ie!==4&&(Ie=2)),!1;var a=Error(j(520),{cause:i});if(a=ui(a,n),tl===null?tl=[a]:tl.push(a),Ie!==4&&(Ie=2),t===null)return!0;i=ui(i,n),n=t;do{switch(n.tag){case 3:return n.flags|=65536,e=s&-s,n.lanes|=e,e=mp(n.stateNode,i,e),xd(n,e),!1;case 1:if(t=n.type,a=n.stateNode,(n.flags&128)===0&&(typeof t.getDerivedStateFromError=="function"||a!==null&&typeof a.componentDidCatch=="function"&&(Ks===null||!Ks.has(a))))return n.flags|=65536,s&=-s,n.lanes|=s,s=kv(s),Gv(s,e,n,i),xd(n,s),!1}n=n.return}while(n!==null);return!1}var mm=Error(j(461)),Ye=!1;function cn(e,t,n,i){t.child=e===null?iv(t,null,n,i):za(t,e.child,n,i)}function Ty(e,t,n,i,s){n=n.render;var a=t.ref;if("ref"in i){var r={};for(var o in i)o!=="ref"&&(r[o]=i[o])}else r=i;return Ba(t),i=im(e,t,n,r,a,s),o=sm(),e!==null&&!Ye?(am(e,t,s),xs(e,t,s)):(Jt&&o&&Jp(t),t.flags|=1,cn(e,t,i,s),t.child)}function Ey(e,t,n,i,s){if(e===null){var a=n.type;return typeof a=="function"&&!Zp(a)&&a.defaultProps===void 0&&n.compare===null?(t.tag=15,t.type=a,Wv(e,t,a,i,s)):(e=Vc(n.type,null,i,t,t.mode,s),e.ref=t.ref,e.return=t,t.child=e)}if(a=e.child,!gm(e,s)){var r=a.memoizedProps;if(n=n.compare,n=n!==null?n:rl,n(r,i)&&e.ref===t.ref)return xs(e,t,s)}return t.flags|=1,e=ps(a,i),e.ref=t.ref,e.return=t,t.child=e}function Wv(e,t,n,i,s){if(e!==null){var a=e.memoizedProps;if(rl(a,i)&&e.ref===t.ref)if(Ye=!1,t.pendingProps=i=a,gm(e,s))(e.flags&131072)!==0&&(Ye=!0);else return t.lanes=e.lanes,xs(e,t,s)}return gp(e,t,n,i,s)}function Xv(e,t,n,i){var s=i.children,a=e!==null?e.memoizedState:null;if(e===null&&t.stateNode===null&&(t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),i.mode==="hidden"){if((t.flags&128)!==0){if(a=a!==null?a.baseLanes|n:n,e!==null){for(i=t.child=e.child,s=0;i!==null;)s=s|i.lanes|i.childLanes,i=i.sibling;i=s&~a}else i=0,t.child=null;return Ay(e,t,a,n,i)}if((n&536870912)!==0)t.memoizedState={baseLanes:0,cachePool:null},e!==null&&Hc(t,a!==null?a.cachePool:null),a!==null?py(t,a):cp(),rv(t);else return i=t.lanes=536870912,Ay(e,t,a!==null?a.baseLanes|n:n,n,i)}else a!==null?(Hc(t,a.cachePool),py(t,a),Fs(t),t.memoizedState=null):(e!==null&&Hc(t,null),cp(),Fs(t));return cn(e,t,s,n),t.child}function ko(e,t){return e!==null&&e.tag===22||t.stateNode!==null||(t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),t.sibling}function Ay(e,t,n,i,s){var a=jp();return a=a===null?null:{parent:qe._currentValue,pool:a},t.memoizedState={baseLanes:n,cachePool:a},e!==null&&Hc(t,null),cp(),rv(t),e!==null&&Yr(e,t,i,!0),t.childLanes=s,null}function Wc(e,t){return t=fu({mode:t.mode,children:t.children},e.mode),t.ref=e.ref,e.child=t,t.return=e,t}function wy(e,t,n){return za(t,e.child,null,n),e=Wc(t,t.pendingProps),e.flags|=2,kn(t),t.memoizedState=null,e}function Q1(e,t,n){var i=t.pendingProps,s=(t.flags&128)!==0;if(t.flags&=-129,e===null){if(Jt){if(i.mode==="hidden")return e=Wc(t,i),t.lanes=536870912,ko(null,e);if(up(t),(e=Te)?(e=Bx(e,hi),e=e!==null&&e.data==="&"?e:null,e!==null&&(t.memoizedState={dehydrated:e,treeContext:ea!==null?{id:ki,overflow:Gi}:null,retryLane:536870912,hydrationErrors:null},n=K_(e),n.return=t,t.child=n,hn=t,Te=null)):e=null,e===null)throw na(t);return t.lanes=536870912,null}return Wc(t,i)}var a=e.memoizedState;if(a!==null){var r=a.dehydrated;if(up(t),s)if(t.flags&256)t.flags&=-257,t=wy(e,t,n);else if(t.memoizedState!==null)t.child=e.child,t.flags|=128,t=null;else throw Error(j(558));else if(Ye||Yr(e,t,n,!1),s=(n&e.childLanes)!==0,Ye||s){if(i=me,i!==null&&(r=b_(i,n),r!==0&&r!==a.retryLane))throw a.retryLane=r,Wa(e,r),On(i,e,r),mm;gu(),t=wy(e,t,n)}else e=a.treeContext,Te=di(r.nextSibling),hn=t,Jt=!0,Ys=null,hi=!1,e!==null&&j_(t,e),t=Wc(t,i),t.flags|=4096;return t}return e=ps(e.child,{mode:i.mode,children:i.children}),e.ref=t.ref,t.child=e,e.return=t,e}function Xc(e,t){var n=t.ref;if(n===null)e!==null&&e.ref!==null&&(t.flags|=4194816);else{if(typeof n!="function"&&typeof n!="object")throw Error(j(284));(e===null||e.ref!==n)&&(t.flags|=4194816)}}function gp(e,t,n,i,s){return Ba(t),n=im(e,t,n,i,void 0,s),i=sm(),e!==null&&!Ye?(am(e,t,s),xs(e,t,s)):(Jt&&i&&Jp(t),t.flags|=1,cn(e,t,n,s),t.child)}function Cy(e,t,n,i,s,a){return Ba(t),t.updateQueue=null,n=lv(t,i,n,s),ov(e),i=sm(),e!==null&&!Ye?(am(e,t,a),xs(e,t,a)):(Jt&&i&&Jp(t),t.flags|=1,cn(e,t,n,a),t.child)}function Ry(e,t,n,i,s){if(Ba(t),t.stateNode===null){var a=Mr,r=n.contextType;typeof r=="object"&&r!==null&&(a=fn(r)),a=new n(i,a),t.memoizedState=a.state!==null&&a.state!==void 0?a.state:null,a.updater=pp,t.stateNode=a,a._reactInternals=t,a=t.stateNode,a.props=i,a.state=t.memoizedState,a.refs={},tm(t),r=n.contextType,a.context=typeof r=="object"&&r!==null?fn(r):Mr,a.state=t.memoizedState,r=n.getDerivedStateFromProps,typeof r=="function"&&(bd(t,n,r,i),a.state=t.memoizedState),typeof n.getDerivedStateFromProps=="function"||typeof a.getSnapshotBeforeUpdate=="function"||typeof a.UNSAFE_componentWillMount!="function"&&typeof a.componentWillMount!="function"||(r=a.state,typeof a.componentWillMount=="function"&&a.componentWillMount(),typeof a.UNSAFE_componentWillMount=="function"&&a.UNSAFE_componentWillMount(),r!==a.state&&pp.enqueueReplaceState(a,a.state,null),Ko(t,i,a,s),Jo(),a.state=t.memoizedState),typeof a.componentDidMount=="function"&&(t.flags|=4194308),i=!0}else if(e===null){a=t.stateNode;var o=t.memoizedProps,l=Va(n,o);a.props=l;var c=a.context,u=n.contextType;r=Mr,typeof u=="object"&&u!==null&&(r=fn(u));var p=n.getDerivedStateFromProps;u=typeof p=="function"||typeof a.getSnapshotBeforeUpdate=="function",o=t.pendingProps!==o,u||typeof a.UNSAFE_componentWillReceiveProps!="function"&&typeof a.componentWillReceiveProps!="function"||(o||c!==r)&&by(t,a,i,r),Ps=!1;var h=t.memoizedState;a.state=h,Ko(t,i,a,s),Jo(),c=t.memoizedState,o||h!==c||Ps?(typeof p=="function"&&(bd(t,n,p,i),c=t.memoizedState),(l=Ps||Sy(t,n,l,i,h,c,r))?(u||typeof a.UNSAFE_componentWillMount!="function"&&typeof a.componentWillMount!="function"||(typeof a.componentWillMount=="function"&&a.componentWillMount(),typeof a.UNSAFE_componentWillMount=="function"&&a.UNSAFE_componentWillMount()),typeof a.componentDidMount=="function"&&(t.flags|=4194308)):(typeof a.componentDidMount=="function"&&(t.flags|=4194308),t.memoizedProps=i,t.memoizedState=c),a.props=i,a.state=c,a.context=r,i=l):(typeof a.componentDidMount=="function"&&(t.flags|=4194308),i=!1)}else{a=t.stateNode,op(e,t),r=t.memoizedProps,u=Va(n,r),a.props=u,p=t.pendingProps,h=a.context,c=n.contextType,l=Mr,typeof c=="object"&&c!==null&&(l=fn(c)),o=n.getDerivedStateFromProps,(c=typeof o=="function"||typeof a.getSnapshotBeforeUpdate=="function")||typeof a.UNSAFE_componentWillReceiveProps!="function"&&typeof a.componentWillReceiveProps!="function"||(r!==p||h!==l)&&by(t,a,i,l),Ps=!1,h=t.memoizedState,a.state=h,Ko(t,i,a,s),Jo();var f=t.memoizedState;r!==p||h!==f||Ps||e!==null&&e.dependencies!==null&&au(e.dependencies)?(typeof o=="function"&&(bd(t,n,o,i),f=t.memoizedState),(u=Ps||Sy(t,n,u,i,h,f,l)||e!==null&&e.dependencies!==null&&au(e.dependencies))?(c||typeof a.UNSAFE_componentWillUpdate!="function"&&typeof a.componentWillUpdate!="function"||(typeof a.componentWillUpdate=="function"&&a.componentWillUpdate(i,f,l),typeof a.UNSAFE_componentWillUpdate=="function"&&a.UNSAFE_componentWillUpdate(i,f,l)),typeof a.componentDidUpdate=="function"&&(t.flags|=4),typeof a.getSnapshotBeforeUpdate=="function"&&(t.flags|=1024)):(typeof a.componentDidUpdate!="function"||r===e.memoizedProps&&h===e.memoizedState||(t.flags|=4),typeof a.getSnapshotBeforeUpdate!="function"||r===e.memoizedProps&&h===e.memoizedState||(t.flags|=1024),t.memoizedProps=i,t.memoizedState=f),a.props=i,a.state=f,a.context=l,i=u):(typeof a.componentDidUpdate!="function"||r===e.memoizedProps&&h===e.memoizedState||(t.flags|=4),typeof a.getSnapshotBeforeUpdate!="function"||r===e.memoizedProps&&h===e.memoizedState||(t.flags|=1024),i=!1)}return a=i,Xc(e,t),i=(t.flags&128)!==0,a||i?(a=t.stateNode,n=i&&typeof n.getDerivedStateFromError!="function"?null:a.render(),t.flags|=1,e!==null&&i?(t.child=za(t,e.child,null,s),t.child=za(t,null,n,s)):cn(e,t,n,s),t.memoizedState=a.state,e=t.child):e=xs(e,t,s),e}function Dy(e,t,n,i){return Pa(),t.flags|=256,cn(e,t,n,i),t.child}var Md={dehydrated:null,treeContext:null,retryLane:0,hydrationErrors:null};function Td(e){return{baseLanes:e,cachePool:tv()}}function Ed(e,t,n){return e=e!==null?e.childLanes&~n:0,t&&(e|=Wn),e}function qv(e,t,n){var i=t.pendingProps,s=!1,a=(t.flags&128)!==0,r;if((r=a)||(r=e!==null&&e.memoizedState===null?!1:(ze.current&2)!==0),r&&(s=!0,t.flags&=-129),r=(t.flags&32)!==0,t.flags&=-33,e===null){if(Jt){if(s?zs(t):Fs(t),(e=Te)?(e=Bx(e,hi),e=e!==null&&e.data!=="&"?e:null,e!==null&&(t.memoizedState={dehydrated:e,treeContext:ea!==null?{id:ki,overflow:Gi}:null,retryLane:536870912,hydrationErrors:null},n=K_(e),n.return=t,t.child=n,hn=t,Te=null)):e=null,e===null)throw na(t);return Dp(e)?t.lanes=32:t.lanes=536870912,null}var o=i.children;return i=i.fallback,s?(Fs(t),s=t.mode,o=fu({mode:"hidden",children:o},s),i=Na(i,s,n,null),o.return=t,i.return=t,o.sibling=i,t.child=o,i=t.child,i.memoizedState=Td(n),i.childLanes=Ed(e,r,n),t.memoizedState=Md,ko(null,i)):(zs(t),yp(t,o))}var l=e.memoizedState;if(l!==null&&(o=l.dehydrated,o!==null)){if(a)t.flags&256?(zs(t),t.flags&=-257,t=Ad(e,t,n)):t.memoizedState!==null?(Fs(t),t.child=e.child,t.flags|=128,t=null):(Fs(t),o=i.fallback,s=t.mode,i=fu({mode:"visible",children:i.children},s),o=Na(o,s,n,null),o.flags|=2,i.return=t,o.return=t,i.sibling=o,t.child=i,za(t,e.child,null,n),i=t.child,i.memoizedState=Td(n),i.childLanes=Ed(e,r,n),t.memoizedState=Md,t=ko(null,i));else if(zs(t),Dp(o)){if(r=o.nextSibling&&o.nextSibling.dataset,r)var c=r.dgst;r=c,i=Error(j(419)),i.stack="",i.digest=r,ll({value:i,source:null,stack:null}),t=Ad(e,t,n)}else if(Ye||Yr(e,t,n,!1),r=(n&e.childLanes)!==0,Ye||r){if(r=me,r!==null&&(i=b_(r,n),i!==0&&i!==l.retryLane))throw l.retryLane=i,Wa(e,i),On(r,e,i),mm;Rp(o)||gu(),t=Ad(e,t,n)}else Rp(o)?(t.flags|=192,t.child=e.child,t=null):(e=l.treeContext,Te=di(o.nextSibling),hn=t,Jt=!0,Ys=null,hi=!1,e!==null&&j_(t,e),t=yp(t,i.children),t.flags|=4096);return t}return s?(Fs(t),o=i.fallback,s=t.mode,l=e.child,c=l.sibling,i=ps(l,{mode:"hidden",children:i.children}),i.subtreeFlags=l.subtreeFlags&65011712,c!==null?o=ps(c,o):(o=Na(o,s,n,null),o.flags|=2),o.return=t,i.return=t,i.sibling=o,t.child=i,ko(null,i),i=t.child,o=e.child.memoizedState,o===null?o=Td(n):(s=o.cachePool,s!==null?(l=qe._currentValue,s=s.parent!==l?{parent:l,pool:l}:s):s=tv(),o={baseLanes:o.baseLanes|n,cachePool:s}),i.memoizedState=o,i.childLanes=Ed(e,r,n),t.memoizedState=Md,ko(e.child,i)):(zs(t),n=e.child,e=n.sibling,n=ps(n,{mode:"visible",children:i.children}),n.return=t,n.sibling=null,e!==null&&(r=t.deletions,r===null?(t.deletions=[e],t.flags|=16):r.push(e)),t.child=n,t.memoizedState=null,n)}function yp(e,t){return t=fu({mode:"visible",children:t},e.mode),t.return=e,e.child=t}function fu(e,t){return e=Gn(22,e,null,t),e.lanes=0,e}function Ad(e,t,n){return za(t,e.child,null,n),e=yp(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function Uy(e,t,n){e.lanes|=t;var i=e.alternate;i!==null&&(i.lanes|=t),sp(e.return,t,n)}function wd(e,t,n,i,s,a){var r=e.memoizedState;r===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:i,tail:n,tailMode:s,treeForkCount:a}:(r.isBackwards=t,r.rendering=null,r.renderingStartTime=0,r.last=i,r.tail=n,r.tailMode=s,r.treeForkCount=a)}function Yv(e,t,n){var i=t.pendingProps,s=i.revealOrder,a=i.tail;i=i.children;var r=ze.current,o=(r&2)!==0;if(o?(r=r&1|2,t.flags|=128):r&=1,xe(ze,r),cn(e,t,i,n),i=Jt?ol:0,!o&&e!==null&&(e.flags&128)!==0)t:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&Uy(e,n,t);else if(e.tag===19)Uy(e,n,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break t;for(;e.sibling===null;){if(e.return===null||e.return===t)break t;e=e.return}e.sibling.return=e.return,e=e.sibling}switch(s){case"forwards":for(n=t.child,s=null;n!==null;)e=n.alternate,e!==null&&lu(e)===null&&(s=n),n=n.sibling;n=s,n===null?(s=t.child,t.child=null):(s=n.sibling,n.sibling=null),wd(t,!1,s,n,a,i);break;case"backwards":case"unstable_legacy-backwards":for(n=null,s=t.child,t.child=null;s!==null;){if(e=s.alternate,e!==null&&lu(e)===null){t.child=s;break}e=s.sibling,s.sibling=n,n=s,s=e}wd(t,!0,n,null,a,i);break;case"together":wd(t,!1,null,null,void 0,i);break;default:t.memoizedState=null}return t.child}function xs(e,t,n){if(e!==null&&(t.dependencies=e.dependencies),sa|=t.lanes,(n&t.childLanes)===0)if(e!==null){if(Yr(e,t,n,!1),(n&t.childLanes)===0)return null}else return null;if(e!==null&&t.child!==e.child)throw Error(j(153));if(t.child!==null){for(e=t.child,n=ps(e,e.pendingProps),t.child=n,n.return=t;e.sibling!==null;)e=e.sibling,n=n.sibling=ps(e,e.pendingProps),n.return=t;n.sibling=null}return t.child}function gm(e,t){return(e.lanes&t)!==0?!0:(e=e.dependencies,!!(e!==null&&au(e)))}function j1(e,t,n){switch(t.tag){case 3:jc(t,t.stateNode.containerInfo),Bs(t,qe,e.memoizedState.cache),Pa();break;case 27:case 5:Xd(t);break;case 4:jc(t,t.stateNode.containerInfo);break;case 10:Bs(t,t.type,t.memoizedProps.value);break;case 31:if(t.memoizedState!==null)return t.flags|=128,up(t),null;break;case 13:var i=t.memoizedState;if(i!==null)return i.dehydrated!==null?(zs(t),t.flags|=128,null):(n&t.child.childLanes)!==0?qv(e,t,n):(zs(t),e=xs(e,t,n),e!==null?e.sibling:null);zs(t);break;case 19:var s=(e.flags&128)!==0;if(i=(n&t.childLanes)!==0,i||(Yr(e,t,n,!1),i=(n&t.childLanes)!==0),s){if(i)return Yv(e,t,n);t.flags|=128}if(s=t.memoizedState,s!==null&&(s.rendering=null,s.tail=null,s.lastEffect=null),xe(ze,ze.current),i)break;return null;case 22:return t.lanes=0,Xv(e,t,n,t.pendingProps);case 24:Bs(t,qe,e.memoizedState.cache)}return xs(e,t,n)}function Zv(e,t,n){if(e!==null)if(e.memoizedProps!==t.pendingProps)Ye=!0;else{if(!gm(e,n)&&(t.flags&128)===0)return Ye=!1,j1(e,t,n);Ye=(e.flags&131072)!==0}else Ye=!1,Jt&&(t.flags&1048576)!==0&&Q_(t,ol,t.index);switch(t.lanes=0,t.tag){case 16:t:{var i=t.pendingProps;if(e=Ra(t.elementType),t.type=e,typeof e=="function")Zp(e)?(i=Va(e,i),t.tag=1,t=Ry(null,t,e,i,n)):(t.tag=0,t=gp(null,t,e,i,n));else{if(e!=null){var s=e.$$typeof;if(s===Op){t.tag=11,t=Ty(null,t,e,i,n);break t}else if(s===Ip){t.tag=14,t=Ey(null,t,e,i,n);break t}}throw t=Gd(e)||e,Error(j(306,t,""))}}return t;case 0:return gp(e,t,t.type,t.pendingProps,n);case 1:return i=t.type,s=Va(i,t.pendingProps),Ry(e,t,i,s,n);case 3:t:{if(jc(t,t.stateNode.containerInfo),e===null)throw Error(j(387));i=t.pendingProps;var a=t.memoizedState;s=a.element,op(e,t),Ko(t,i,null,n);var r=t.memoizedState;if(i=r.cache,Bs(t,qe,i),i!==a.cache&&ap(t,[qe],n,!0),Jo(),i=r.element,a.isDehydrated)if(a={element:i,isDehydrated:!1,cache:r.cache},t.updateQueue.baseState=a,t.memoizedState=a,t.flags&256){t=Dy(e,t,i,n);break t}else if(i!==s){s=ui(Error(j(424)),t),ll(s),t=Dy(e,t,i,n);break t}else{switch(e=t.stateNode.containerInfo,e.nodeType){case 9:e=e.body;break;default:e=e.nodeName==="HTML"?e.ownerDocument.body:e}for(Te=di(e.firstChild),hn=t,Jt=!0,Ys=null,hi=!0,n=iv(t,null,i,n),t.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling}else{if(Pa(),i===s){t=xs(e,t,n);break t}cn(e,t,i,n)}t=t.child}return t;case 26:return Xc(e,t),e===null?(n=$y(t.type,null,t.pendingProps,null))?t.memoizedState=n:Jt||(n=t.type,e=t.pendingProps,i=xu(qs.current).createElement(n),i[un]=t,i[In]=e,dn(i,n,e),an(i),t.stateNode=i):t.memoizedState=$y(t.type,e.memoizedProps,t.pendingProps,e.memoizedState),null;case 27:return Xd(t),e===null&&Jt&&(i=t.stateNode=zx(t.type,t.pendingProps,qs.current),hn=t,hi=!0,s=Te,ra(t.type)?(Up=s,Te=di(i.firstChild)):Te=s),cn(e,t,t.pendingProps.children,n),Xc(e,t),e===null&&(t.flags|=4194304),t.child;case 5:return e===null&&Jt&&((s=i=Te)&&(i=AT(i,t.type,t.pendingProps,hi),i!==null?(t.stateNode=i,hn=t,Te=di(i.firstChild),hi=!1,s=!0):s=!1),s||na(t)),Xd(t),s=t.type,a=t.pendingProps,r=e!==null?e.memoizedProps:null,i=a.children,wp(s,a)?i=null:r!==null&&wp(s,r)&&(t.flags|=32),t.memoizedState!==null&&(s=im(e,t,G1,null,null,n),pl._currentValue=s),Xc(e,t),cn(e,t,i,n),t.child;case 6:return e===null&&Jt&&((e=n=Te)&&(n=wT(n,t.pendingProps,hi),n!==null?(t.stateNode=n,hn=t,Te=null,e=!0):e=!1),e||na(t)),null;case 13:return qv(e,t,n);case 4:return jc(t,t.stateNode.containerInfo),i=t.pendingProps,e===null?t.child=za(t,null,i,n):cn(e,t,i,n),t.child;case 11:return Ty(e,t,t.type,t.pendingProps,n);case 7:return cn(e,t,t.pendingProps,n),t.child;case 8:return cn(e,t,t.pendingProps.children,n),t.child;case 12:return cn(e,t,t.pendingProps.children,n),t.child;case 10:return i=t.pendingProps,Bs(t,t.type,i.value),cn(e,t,i.children,n),t.child;case 9:return s=t.type._context,i=t.pendingProps.children,Ba(t),s=fn(s),i=i(s),t.flags|=1,cn(e,t,i,n),t.child;case 14:return Ey(e,t,t.type,t.pendingProps,n);case 15:return Wv(e,t,t.type,t.pendingProps,n);case 19:return Yv(e,t,n);case 31:return Q1(e,t,n);case 22:return Xv(e,t,n,t.pendingProps);case 24:return Ba(t),i=fn(qe),e===null?(s=jp(),s===null&&(s=me,a=Qp(),s.pooledCache=a,a.refCount++,a!==null&&(s.pooledCacheLanes|=n),s=a),t.memoizedState={parent:i,cache:s},tm(t),Bs(t,qe,s)):((e.lanes&n)!==0&&(op(e,t),Ko(t,null,null,n),Jo()),s=e.memoizedState,a=t.memoizedState,s.parent!==i?(s={parent:i,cache:i},t.memoizedState=s,t.lanes===0&&(t.memoizedState=t.updateQueue.baseState=s),Bs(t,qe,i)):(i=a.cache,Bs(t,qe,i),i!==s.cache&&ap(t,[qe],n,!0))),cn(e,t,t.pendingProps.children,n),t.child;case 29:throw t.pendingProps}throw Error(j(156,t.tag))}function as(e){e.flags|=4}function Cd(e,t,n,i,s){if((t=(e.mode&32)!==0)&&(t=!1),t){if(e.flags|=16777216,(s&335544128)===s)if(e.stateNode.complete)e.flags|=8192;else if(_x())e.flags|=8192;else throw Oa=ru,$p}else e.flags&=-16777217}function Ny(e,t){if(t.type!=="stylesheet"||(t.state.loading&4)!==0)e.flags&=-16777217;else if(e.flags|=16777216,!Hx(t))if(_x())e.flags|=8192;else throw Oa=ru,$p}function Rc(e,t){t!==null&&(e.flags|=4),e.flags&16384&&(t=e.tag!==22?v_():536870912,e.lanes|=t,Vr|=t)}function Io(e,t){if(!Jt)switch(e.tailMode){case"hidden":t=e.tail;for(var n=null;t!==null;)t.alternate!==null&&(n=t),t=t.sibling;n===null?e.tail=null:n.sibling=null;break;case"collapsed":n=e.tail;for(var i=null;n!==null;)n.alternate!==null&&(i=n),n=n.sibling;i===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:i.sibling=null}}function Me(e){var t=e.alternate!==null&&e.alternate.child===e.child,n=0,i=0;if(t)for(var s=e.child;s!==null;)n|=s.lanes|s.childLanes,i|=s.subtreeFlags&65011712,i|=s.flags&65011712,s.return=e,s=s.sibling;else for(s=e.child;s!==null;)n|=s.lanes|s.childLanes,i|=s.subtreeFlags,i|=s.flags,s.return=e,s=s.sibling;return e.subtreeFlags|=i,e.childLanes=n,t}function $1(e,t,n){var i=t.pendingProps;switch(Kp(t),t.tag){case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Me(t),null;case 1:return Me(t),null;case 3:return n=t.stateNode,i=null,e!==null&&(i=e.memoizedState.cache),t.memoizedState.cache!==i&&(t.flags|=2048),ms(qe),Or(),n.pendingContext&&(n.context=n.pendingContext,n.pendingContext=null),(e===null||e.child===null)&&(hr(t)?as(t):e===null||e.memoizedState.isDehydrated&&(t.flags&256)===0||(t.flags|=1024,vd())),Me(t),null;case 26:var s=t.type,a=t.memoizedState;return e===null?(as(t),a!==null?(Me(t),Ny(t,a)):(Me(t),Cd(t,s,null,i,n))):a?a!==e.memoizedState?(as(t),Me(t),Ny(t,a)):(Me(t),t.flags&=-16777217):(e=e.memoizedProps,e!==i&&as(t),Me(t),Cd(t,s,e,i,n)),null;case 27:if($c(t),n=qs.current,s=t.type,e!==null&&t.stateNode!=null)e.memoizedProps!==i&&as(t);else{if(!i){if(t.stateNode===null)throw Error(j(166));return Me(t),null}e=Xi.current,hr(t)?oy(t,e):(e=zx(s,i,n),t.stateNode=e,as(t))}return Me(t),null;case 5:if($c(t),s=t.type,e!==null&&t.stateNode!=null)e.memoizedProps!==i&&as(t);else{if(!i){if(t.stateNode===null)throw Error(j(166));return Me(t),null}if(a=Xi.current,hr(t))oy(t,a);else{var r=xu(qs.current);switch(a){case 1:a=r.createElementNS("http://www.w3.org/2000/svg",s);break;case 2:a=r.createElementNS("http://www.w3.org/1998/Math/MathML",s);break;default:switch(s){case"svg":a=r.createElementNS("http://www.w3.org/2000/svg",s);break;case"math":a=r.createElementNS("http://www.w3.org/1998/Math/MathML",s);break;case"script":a=r.createElement("div"),a.innerHTML="<script><\/script>",a=a.removeChild(a.firstChild);break;case"select":a=typeof i.is=="string"?r.createElement("select",{is:i.is}):r.createElement("select"),i.multiple?a.multiple=!0:i.size&&(a.size=i.size);break;default:a=typeof i.is=="string"?r.createElement(s,{is:i.is}):r.createElement(s)}}a[un]=t,a[In]=i;t:for(r=t.child;r!==null;){if(r.tag===5||r.tag===6)a.appendChild(r.stateNode);else if(r.tag!==4&&r.tag!==27&&r.child!==null){r.child.return=r,r=r.child;continue}if(r===t)break t;for(;r.sibling===null;){if(r.return===null||r.return===t)break t;r=r.return}r.sibling.return=r.return,r=r.sibling}t.stateNode=a;t:switch(dn(a,s,i),s){case"button":case"input":case"select":case"textarea":i=!!i.autoFocus;break t;case"img":i=!0;break t;default:i=!1}i&&as(t)}}return Me(t),Cd(t,t.type,e===null?null:e.memoizedProps,t.pendingProps,n),null;case 6:if(e&&t.stateNode!=null)e.memoizedProps!==i&&as(t);else{if(typeof i!="string"&&t.stateNode===null)throw Error(j(166));if(e=qs.current,hr(t)){if(e=t.stateNode,n=t.memoizedProps,i=null,s=hn,s!==null)switch(s.tag){case 27:case 5:i=s.memoizedProps}e[un]=t,e=!!(e.nodeValue===n||i!==null&&i.suppressHydrationWarning===!0||Ox(e.nodeValue,n)),e||na(t,!0)}else e=xu(e).createTextNode(i),e[un]=t,t.stateNode=e}return Me(t),null;case 31:if(n=t.memoizedState,e===null||e.memoizedState!==null){if(i=hr(t),n!==null){if(e===null){if(!i)throw Error(j(318));if(e=t.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(j(557));e[un]=t}else Pa(),(t.flags&128)===0&&(t.memoizedState=null),t.flags|=4;Me(t),e=!1}else n=vd(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=n),e=!0;if(!e)return t.flags&256?(kn(t),t):(kn(t),null);if((t.flags&128)!==0)throw Error(j(558))}return Me(t),null;case 13:if(i=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(s=hr(t),i!==null&&i.dehydrated!==null){if(e===null){if(!s)throw Error(j(318));if(s=t.memoizedState,s=s!==null?s.dehydrated:null,!s)throw Error(j(317));s[un]=t}else Pa(),(t.flags&128)===0&&(t.memoizedState=null),t.flags|=4;Me(t),s=!1}else s=vd(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=s),s=!0;if(!s)return t.flags&256?(kn(t),t):(kn(t),null)}return kn(t),(t.flags&128)!==0?(t.lanes=n,t):(n=i!==null,e=e!==null&&e.memoizedState!==null,n&&(i=t.child,s=null,i.alternate!==null&&i.alternate.memoizedState!==null&&i.alternate.memoizedState.cachePool!==null&&(s=i.alternate.memoizedState.cachePool.pool),a=null,i.memoizedState!==null&&i.memoizedState.cachePool!==null&&(a=i.memoizedState.cachePool.pool),a!==s&&(i.flags|=2048)),n!==e&&n&&(t.child.flags|=8192),Rc(t,t.updateQueue),Me(t),null);case 4:return Or(),e===null&&Mm(t.stateNode.containerInfo),Me(t),null;case 10:return ms(t.type),Me(t),null;case 19:if(rn(ze),i=t.memoizedState,i===null)return Me(t),null;if(s=(t.flags&128)!==0,a=i.rendering,a===null)if(s)Io(i,!1);else{if(Ie!==0||e!==null&&(e.flags&128)!==0)for(e=t.child;e!==null;){if(a=lu(e),a!==null){for(t.flags|=128,Io(i,!1),e=a.updateQueue,t.updateQueue=e,Rc(t,e),t.subtreeFlags=0,e=n,n=t.child;n!==null;)J_(n,e),n=n.sibling;return xe(ze,ze.current&1|2),Jt&&cs(t,i.treeForkCount),t.child}e=e.sibling}i.tail!==null&&Xn()>pu&&(t.flags|=128,s=!0,Io(i,!1),t.lanes=4194304)}else{if(!s)if(e=lu(a),e!==null){if(t.flags|=128,s=!0,e=e.updateQueue,t.updateQueue=e,Rc(t,e),Io(i,!0),i.tail===null&&i.tailMode==="hidden"&&!a.alternate&&!Jt)return Me(t),null}else 2*Xn()-i.renderingStartTime>pu&&n!==536870912&&(t.flags|=128,s=!0,Io(i,!1),t.lanes=4194304);i.isBackwards?(a.sibling=t.child,t.child=a):(e=i.last,e!==null?e.sibling=a:t.child=a,i.last=a)}return i.tail!==null?(e=i.tail,i.rendering=e,i.tail=e.sibling,i.renderingStartTime=Xn(),e.sibling=null,n=ze.current,xe(ze,s?n&1|2:n&1),Jt&&cs(t,i.treeForkCount),e):(Me(t),null);case 22:case 23:return kn(t),em(),i=t.memoizedState!==null,e!==null?e.memoizedState!==null!==i&&(t.flags|=8192):i&&(t.flags|=8192),i?(n&536870912)!==0&&(t.flags&128)===0&&(Me(t),t.subtreeFlags&6&&(t.flags|=8192)):Me(t),n=t.updateQueue,n!==null&&Rc(t,n.retryQueue),n=null,e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(n=e.memoizedState.cachePool.pool),i=null,t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(i=t.memoizedState.cachePool.pool),i!==n&&(t.flags|=2048),e!==null&&rn(La),null;case 24:return n=null,e!==null&&(n=e.memoizedState.cache),t.memoizedState.cache!==n&&(t.flags|=2048),ms(qe),Me(t),null;case 25:return null;case 30:return null}throw Error(j(156,t.tag))}function tT(e,t){switch(Kp(t),t.tag){case 1:return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return ms(qe),Or(),e=t.flags,(e&65536)!==0&&(e&128)===0?(t.flags=e&-65537|128,t):null;case 26:case 27:case 5:return $c(t),null;case 31:if(t.memoizedState!==null){if(kn(t),t.alternate===null)throw Error(j(340));Pa()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 13:if(kn(t),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(j(340));Pa()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return rn(ze),null;case 4:return Or(),null;case 10:return ms(t.type),null;case 22:case 23:return kn(t),em(),e!==null&&rn(La),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 24:return ms(qe),null;case 25:return null;default:return null}}function Jv(e,t){switch(Kp(t),t.tag){case 3:ms(qe),Or();break;case 26:case 27:case 5:$c(t);break;case 4:Or();break;case 31:t.memoizedState!==null&&kn(t);break;case 13:kn(t);break;case 19:rn(ze);break;case 10:ms(t.type);break;case 22:case 23:kn(t),em(),e!==null&&rn(La);break;case 24:ms(qe)}}function El(e,t){try{var n=t.updateQueue,i=n!==null?n.lastEffect:null;if(i!==null){var s=i.next;n=s;do{if((n.tag&e)===e){i=void 0;var a=n.create,r=n.inst;i=a(),r.destroy=i}n=n.next}while(n!==s)}}catch(o){ue(t,t.return,o)}}function ia(e,t,n){try{var i=t.updateQueue,s=i!==null?i.lastEffect:null;if(s!==null){var a=s.next;i=a;do{if((i.tag&e)===e){var r=i.inst,o=r.destroy;if(o!==void 0){r.destroy=void 0,s=t;var l=n,c=o;try{c()}catch(u){ue(s,l,u)}}}i=i.next}while(i!==a)}}catch(u){ue(t,t.return,u)}}function Kv(e){var t=e.updateQueue;if(t!==null){var n=e.stateNode;try{av(t,n)}catch(i){ue(e,e.return,i)}}}function Qv(e,t,n){n.props=Va(e.type,e.memoizedProps),n.state=e.memoizedState;try{n.componentWillUnmount()}catch(i){ue(e,t,i)}}function jo(e,t){try{var n=e.ref;if(n!==null){switch(e.tag){case 26:case 27:case 5:var i=e.stateNode;break;case 30:i=e.stateNode;break;default:i=e.stateNode}typeof n=="function"?e.refCleanup=n(i):n.current=i}}catch(s){ue(e,t,s)}}function Wi(e,t){var n=e.ref,i=e.refCleanup;if(n!==null)if(typeof i=="function")try{i()}catch(s){ue(e,t,s)}finally{e.refCleanup=null,e=e.alternate,e!=null&&(e.refCleanup=null)}else if(typeof n=="function")try{n(null)}catch(s){ue(e,t,s)}else n.current=null}function jv(e){var t=e.type,n=e.memoizedProps,i=e.stateNode;try{t:switch(t){case"button":case"input":case"select":case"textarea":n.autoFocus&&i.focus();break t;case"img":n.src?i.src=n.src:n.srcSet&&(i.srcset=n.srcSet)}}catch(s){ue(e,e.return,s)}}function Rd(e,t,n){try{var i=e.stateNode;xT(i,e.type,n,t),i[In]=t}catch(s){ue(e,e.return,s)}}function $v(e){return e.tag===5||e.tag===3||e.tag===26||e.tag===27&&ra(e.type)||e.tag===4}function Dd(e){t:for(;;){for(;e.sibling===null;){if(e.return===null||$v(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.tag===27&&ra(e.type)||e.flags&2||e.child===null||e.tag===4)continue t;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function _p(e,t,n){var i=e.tag;if(i===5||i===6)e=e.stateNode,t?(n.nodeType===9?n.body:n.nodeName==="HTML"?n.ownerDocument.body:n).insertBefore(e,t):(t=n.nodeType===9?n.body:n.nodeName==="HTML"?n.ownerDocument.body:n,t.appendChild(e),n=n._reactRootContainer,n!=null||t.onclick!==null||(t.onclick=fs));else if(i!==4&&(i===27&&ra(e.type)&&(n=e.stateNode,t=null),e=e.child,e!==null))for(_p(e,t,n),e=e.sibling;e!==null;)_p(e,t,n),e=e.sibling}function du(e,t,n){var i=e.tag;if(i===5||i===6)e=e.stateNode,t?n.insertBefore(e,t):n.appendChild(e);else if(i!==4&&(i===27&&ra(e.type)&&(n=e.stateNode),e=e.child,e!==null))for(du(e,t,n),e=e.sibling;e!==null;)du(e,t,n),e=e.sibling}function tx(e){var t=e.stateNode,n=e.memoizedProps;try{for(var i=e.type,s=t.attributes;s.length;)t.removeAttributeNode(s[0]);dn(t,i,n),t[un]=e,t[In]=n}catch(a){ue(e,e.return,a)}}var us=!1,Xe=!1,Ud=!1,Ly=typeof WeakSet=="function"?WeakSet:Set,sn=null;function eT(e,t){if(e=e.containerInfo,Ep=Tu,e=H_(e),Xp(e)){if("selectionStart"in e)var n={start:e.selectionStart,end:e.selectionEnd};else t:{n=(n=e.ownerDocument)&&n.defaultView||window;var i=n.getSelection&&n.getSelection();if(i&&i.rangeCount!==0){n=i.anchorNode;var s=i.anchorOffset,a=i.focusNode;i=i.focusOffset;try{n.nodeType,a.nodeType}catch{n=null;break t}var r=0,o=-1,l=-1,c=0,u=0,p=e,h=null;e:for(;;){for(var f;p!==n||s!==0&&p.nodeType!==3||(o=r+s),p!==a||i!==0&&p.nodeType!==3||(l=r+i),p.nodeType===3&&(r+=p.nodeValue.length),(f=p.firstChild)!==null;)h=p,p=f;for(;;){if(p===e)break e;if(h===n&&++c===s&&(o=r),h===a&&++u===i&&(l=r),(f=p.nextSibling)!==null)break;p=h,h=p.parentNode}p=f}n=o===-1||l===-1?null:{start:o,end:l}}else n=null}n=n||{start:0,end:0}}else n=null;for(Ap={focusedElem:e,selectionRange:n},Tu=!1,sn=t;sn!==null;)if(t=sn,e=t.child,(t.subtreeFlags&1028)!==0&&e!==null)e.return=t,sn=e;else for(;sn!==null;){switch(t=sn,a=t.alternate,e=t.flags,t.tag){case 0:if((e&4)!==0&&(e=t.updateQueue,e=e!==null?e.events:null,e!==null))for(n=0;n<e.length;n++)s=e[n],s.ref.impl=s.nextImpl;break;case 11:case 15:break;case 1:if((e&1024)!==0&&a!==null){e=void 0,n=t,s=a.memoizedProps,a=a.memoizedState,i=n.stateNode;try{var m=Va(n.type,s);e=i.getSnapshotBeforeUpdate(m,a),i.__reactInternalSnapshotBeforeUpdate=e}catch(b){ue(n,n.return,b)}}break;case 3:if((e&1024)!==0){if(e=t.stateNode.containerInfo,n=e.nodeType,n===9)Cp(e);else if(n===1)switch(e.nodeName){case"HEAD":case"HTML":case"BODY":Cp(e);break;default:e.textContent=""}}break;case 5:case 26:case 27:case 6:case 4:case 17:break;default:if((e&1024)!==0)throw Error(j(163))}if(e=t.sibling,e!==null){e.return=t.return,sn=e;break}sn=t.return}}function ex(e,t,n){var i=n.flags;switch(n.tag){case 0:case 11:case 15:os(e,n),i&4&&El(5,n);break;case 1:if(os(e,n),i&4)if(e=n.stateNode,t===null)try{e.componentDidMount()}catch(r){ue(n,n.return,r)}else{var s=Va(n.type,t.memoizedProps);t=t.memoizedState;try{e.componentDidUpdate(s,t,e.__reactInternalSnapshotBeforeUpdate)}catch(r){ue(n,n.return,r)}}i&64&&Kv(n),i&512&&jo(n,n.return);break;case 3:if(os(e,n),i&64&&(e=n.updateQueue,e!==null)){if(t=null,n.child!==null)switch(n.child.tag){case 27:case 5:t=n.child.stateNode;break;case 1:t=n.child.stateNode}try{av(e,t)}catch(r){ue(n,n.return,r)}}break;case 27:t===null&&i&4&&tx(n);case 26:case 5:os(e,n),t===null&&i&4&&jv(n),i&512&&jo(n,n.return);break;case 12:os(e,n);break;case 31:os(e,n),i&4&&sx(e,n);break;case 13:os(e,n),i&4&&ax(e,n),i&64&&(e=n.memoizedState,e!==null&&(e=e.dehydrated,e!==null&&(n=uT.bind(null,n),CT(e,n))));break;case 22:if(i=n.memoizedState!==null||us,!i){t=t!==null&&t.memoizedState!==null||Xe,s=us;var a=Xe;us=i,(Xe=t)&&!a?ls(e,n,(n.subtreeFlags&8772)!==0):os(e,n),us=s,Xe=a}break;case 30:break;default:os(e,n)}}function nx(e){var t=e.alternate;t!==null&&(e.alternate=null,nx(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&Fp(t)),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}var De=null,Nn=!1;function rs(e,t,n){for(n=n.child;n!==null;)ix(e,t,n),n=n.sibling}function ix(e,t,n){if(qn&&typeof qn.onCommitFiberUnmount=="function")try{qn.onCommitFiberUnmount(_l,n)}catch{}switch(n.tag){case 26:Xe||Wi(n,t),rs(e,t,n),n.memoizedState?n.memoizedState.count--:n.stateNode&&(n=n.stateNode,n.parentNode.removeChild(n));break;case 27:Xe||Wi(n,t);var i=De,s=Nn;ra(n.type)&&(De=n.stateNode,Nn=!1),rs(e,t,n),nl(n.stateNode),De=i,Nn=s;break;case 5:Xe||Wi(n,t);case 6:if(i=De,s=Nn,De=null,rs(e,t,n),De=i,Nn=s,De!==null)if(Nn)try{(De.nodeType===9?De.body:De.nodeName==="HTML"?De.ownerDocument.body:De).removeChild(n.stateNode)}catch(a){ue(n,t,a)}else try{De.removeChild(n.stateNode)}catch(a){ue(n,t,a)}break;case 18:De!==null&&(Nn?(e=De,Zy(e.nodeType===9?e.body:e.nodeName==="HTML"?e.ownerDocument.body:e,n.stateNode),Wr(e)):Zy(De,n.stateNode));break;case 4:i=De,s=Nn,De=n.stateNode.containerInfo,Nn=!0,rs(e,t,n),De=i,Nn=s;break;case 0:case 11:case 14:case 15:ia(2,n,t),Xe||ia(4,n,t),rs(e,t,n);break;case 1:Xe||(Wi(n,t),i=n.stateNode,typeof i.componentWillUnmount=="function"&&Qv(n,t,i)),rs(e,t,n);break;case 21:rs(e,t,n);break;case 22:Xe=(i=Xe)||n.memoizedState!==null,rs(e,t,n),Xe=i;break;default:rs(e,t,n)}}function sx(e,t){if(t.memoizedState===null&&(e=t.alternate,e!==null&&(e=e.memoizedState,e!==null))){e=e.dehydrated;try{Wr(e)}catch(n){ue(t,t.return,n)}}}function ax(e,t){if(t.memoizedState===null&&(e=t.alternate,e!==null&&(e=e.memoizedState,e!==null&&(e=e.dehydrated,e!==null))))try{Wr(e)}catch(n){ue(t,t.return,n)}}function nT(e){switch(e.tag){case 31:case 13:case 19:var t=e.stateNode;return t===null&&(t=e.stateNode=new Ly),t;case 22:return e=e.stateNode,t=e._retryCache,t===null&&(t=e._retryCache=new Ly),t;default:throw Error(j(435,e.tag))}}function Dc(e,t){var n=nT(e);t.forEach(function(i){if(!n.has(i)){n.add(i);var s=hT.bind(null,e,i);i.then(s,s)}})}function Dn(e,t){var n=t.deletions;if(n!==null)for(var i=0;i<n.length;i++){var s=n[i],a=e,r=t,o=r;t:for(;o!==null;){switch(o.tag){case 27:if(ra(o.type)){De=o.stateNode,Nn=!1;break t}break;case 5:De=o.stateNode,Nn=!1;break t;case 3:case 4:De=o.stateNode.containerInfo,Nn=!0;break t}o=o.return}if(De===null)throw Error(j(160));ix(a,r,s),De=null,Nn=!1,a=s.alternate,a!==null&&(a.return=null),s.return=null}if(t.subtreeFlags&13886)for(t=t.child;t!==null;)rx(t,e),t=t.sibling}var Ti=null;function rx(e,t){var n=e.alternate,i=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:Dn(t,e),Un(e),i&4&&(ia(3,e,e.return),El(3,e),ia(5,e,e.return));break;case 1:Dn(t,e),Un(e),i&512&&(Xe||n===null||Wi(n,n.return)),i&64&&us&&(e=e.updateQueue,e!==null&&(i=e.callbacks,i!==null&&(n=e.shared.hiddenCallbacks,e.shared.hiddenCallbacks=n===null?i:n.concat(i))));break;case 26:var s=Ti;if(Dn(t,e),Un(e),i&512&&(Xe||n===null||Wi(n,n.return)),i&4){var a=n!==null?n.memoizedState:null;if(i=e.memoizedState,n===null)if(i===null)if(e.stateNode===null){t:{i=e.type,n=e.memoizedProps,s=s.ownerDocument||s;e:switch(i){case"title":a=s.getElementsByTagName("title")[0],(!a||a[Sl]||a[un]||a.namespaceURI==="http://www.w3.org/2000/svg"||a.hasAttribute("itemprop"))&&(a=s.createElement(i),s.head.insertBefore(a,s.querySelector("head > title"))),dn(a,i,n),a[un]=e,an(a),i=a;break t;case"link":var r=e_("link","href",s).get(i+(n.href||""));if(r){for(var o=0;o<r.length;o++)if(a=r[o],a.getAttribute("href")===(n.href==null||n.href===""?null:n.href)&&a.getAttribute("rel")===(n.rel==null?null:n.rel)&&a.getAttribute("title")===(n.title==null?null:n.title)&&a.getAttribute("crossorigin")===(n.crossOrigin==null?null:n.crossOrigin)){r.splice(o,1);break e}}a=s.createElement(i),dn(a,i,n),s.head.appendChild(a);break;case"meta":if(r=e_("meta","content",s).get(i+(n.content||""))){for(o=0;o<r.length;o++)if(a=r[o],a.getAttribute("content")===(n.content==null?null:""+n.content)&&a.getAttribute("name")===(n.name==null?null:n.name)&&a.getAttribute("property")===(n.property==null?null:n.property)&&a.getAttribute("http-equiv")===(n.httpEquiv==null?null:n.httpEquiv)&&a.getAttribute("charset")===(n.charSet==null?null:n.charSet)){r.splice(o,1);break e}}a=s.createElement(i),dn(a,i,n),s.head.appendChild(a);break;default:throw Error(j(468,i))}a[un]=e,an(a),i=a}e.stateNode=i}else n_(s,e.type,e.stateNode);else e.stateNode=t_(s,i,e.memoizedProps);else a!==i?(a===null?n.stateNode!==null&&(n=n.stateNode,n.parentNode.removeChild(n)):a.count--,i===null?n_(s,e.type,e.stateNode):t_(s,i,e.memoizedProps)):i===null&&e.stateNode!==null&&Rd(e,e.memoizedProps,n.memoizedProps)}break;case 27:Dn(t,e),Un(e),i&512&&(Xe||n===null||Wi(n,n.return)),n!==null&&i&4&&Rd(e,e.memoizedProps,n.memoizedProps);break;case 5:if(Dn(t,e),Un(e),i&512&&(Xe||n===null||Wi(n,n.return)),e.flags&32){s=e.stateNode;try{Pr(s,"")}catch(m){ue(e,e.return,m)}}i&4&&e.stateNode!=null&&(s=e.memoizedProps,Rd(e,s,n!==null?n.memoizedProps:s)),i&1024&&(Ud=!0);break;case 6:if(Dn(t,e),Un(e),i&4){if(e.stateNode===null)throw Error(j(162));i=e.memoizedProps,n=e.stateNode;try{n.nodeValue=i}catch(m){ue(e,e.return,m)}}break;case 3:if(Zc=null,s=Ti,Ti=Su(t.containerInfo),Dn(t,e),Ti=s,Un(e),i&4&&n!==null&&n.memoizedState.isDehydrated)try{Wr(t.containerInfo)}catch(m){ue(e,e.return,m)}Ud&&(Ud=!1,ox(e));break;case 4:i=Ti,Ti=Su(e.stateNode.containerInfo),Dn(t,e),Un(e),Ti=i;break;case 12:Dn(t,e),Un(e);break;case 31:Dn(t,e),Un(e),i&4&&(i=e.updateQueue,i!==null&&(e.updateQueue=null,Dc(e,i)));break;case 13:Dn(t,e),Un(e),e.child.flags&8192&&e.memoizedState!==null!=(n!==null&&n.memoizedState!==null)&&(Bu=Xn()),i&4&&(i=e.updateQueue,i!==null&&(e.updateQueue=null,Dc(e,i)));break;case 22:s=e.memoizedState!==null;var l=n!==null&&n.memoizedState!==null,c=us,u=Xe;if(us=c||s,Xe=u||l,Dn(t,e),Xe=u,us=c,Un(e),i&8192)t:for(t=e.stateNode,t._visibility=s?t._visibility&-2:t._visibility|1,s&&(n===null||l||us||Xe||Da(e)),n=null,t=e;;){if(t.tag===5||t.tag===26){if(n===null){l=n=t;try{if(a=l.stateNode,s)r=a.style,typeof r.setProperty=="function"?r.setProperty("display","none","important"):r.display="none";else{o=l.stateNode;var p=l.memoizedProps.style,h=p!=null&&p.hasOwnProperty("display")?p.display:null;o.style.display=h==null||typeof h=="boolean"?"":(""+h).trim()}}catch(m){ue(l,l.return,m)}}}else if(t.tag===6){if(n===null){l=t;try{l.stateNode.nodeValue=s?"":l.memoizedProps}catch(m){ue(l,l.return,m)}}}else if(t.tag===18){if(n===null){l=t;try{var f=l.stateNode;s?Jy(f,!0):Jy(l.stateNode,!1)}catch(m){ue(l,l.return,m)}}}else if((t.tag!==22&&t.tag!==23||t.memoizedState===null||t===e)&&t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break t;for(;t.sibling===null;){if(t.return===null||t.return===e)break t;n===t&&(n=null),t=t.return}n===t&&(n=null),t.sibling.return=t.return,t=t.sibling}i&4&&(i=e.updateQueue,i!==null&&(n=i.retryQueue,n!==null&&(i.retryQueue=null,Dc(e,n))));break;case 19:Dn(t,e),Un(e),i&4&&(i=e.updateQueue,i!==null&&(e.updateQueue=null,Dc(e,i)));break;case 30:break;case 21:break;default:Dn(t,e),Un(e)}}function Un(e){var t=e.flags;if(t&2){try{for(var n,i=e.return;i!==null;){if($v(i)){n=i;break}i=i.return}if(n==null)throw Error(j(160));switch(n.tag){case 27:var s=n.stateNode,a=Dd(e);du(e,a,s);break;case 5:var r=n.stateNode;n.flags&32&&(Pr(r,""),n.flags&=-33);var o=Dd(e);du(e,o,r);break;case 3:case 4:var l=n.stateNode.containerInfo,c=Dd(e);_p(e,c,l);break;default:throw Error(j(161))}}catch(u){ue(e,e.return,u)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function ox(e){if(e.subtreeFlags&1024)for(e=e.child;e!==null;){var t=e;ox(t),t.tag===5&&t.flags&1024&&t.stateNode.reset(),e=e.sibling}}function os(e,t){if(t.subtreeFlags&8772)for(t=t.child;t!==null;)ex(e,t.alternate,t),t=t.sibling}function Da(e){for(e=e.child;e!==null;){var t=e;switch(t.tag){case 0:case 11:case 14:case 15:ia(4,t,t.return),Da(t);break;case 1:Wi(t,t.return);var n=t.stateNode;typeof n.componentWillUnmount=="function"&&Qv(t,t.return,n),Da(t);break;case 27:nl(t.stateNode);case 26:case 5:Wi(t,t.return),Da(t);break;case 22:t.memoizedState===null&&Da(t);break;case 30:Da(t);break;default:Da(t)}e=e.sibling}}function ls(e,t,n){for(n=n&&(t.subtreeFlags&8772)!==0,t=t.child;t!==null;){var i=t.alternate,s=e,a=t,r=a.flags;switch(a.tag){case 0:case 11:case 15:ls(s,a,n),El(4,a);break;case 1:if(ls(s,a,n),i=a,s=i.stateNode,typeof s.componentDidMount=="function")try{s.componentDidMount()}catch(c){ue(i,i.return,c)}if(i=a,s=i.updateQueue,s!==null){var o=i.stateNode;try{var l=s.shared.hiddenCallbacks;if(l!==null)for(s.shared.hiddenCallbacks=null,s=0;s<l.length;s++)sv(l[s],o)}catch(c){ue(i,i.return,c)}}n&&r&64&&Kv(a),jo(a,a.return);break;case 27:tx(a);case 26:case 5:ls(s,a,n),n&&i===null&&r&4&&jv(a),jo(a,a.return);break;case 12:ls(s,a,n);break;case 31:ls(s,a,n),n&&r&4&&sx(s,a);break;case 13:ls(s,a,n),n&&r&4&&ax(s,a);break;case 22:a.memoizedState===null&&ls(s,a,n),jo(a,a.return);break;case 30:break;default:ls(s,a,n)}t=t.sibling}}function ym(e,t){var n=null;e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(n=e.memoizedState.cachePool.pool),e=null,t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(e=t.memoizedState.cachePool.pool),e!==n&&(e!=null&&e.refCount++,n!=null&&Ml(n))}function _m(e,t){e=null,t.alternate!==null&&(e=t.alternate.memoizedState.cache),t=t.memoizedState.cache,t!==e&&(t.refCount++,e!=null&&Ml(e))}function Mi(e,t,n,i){if(t.subtreeFlags&10256)for(t=t.child;t!==null;)lx(e,t,n,i),t=t.sibling}function lx(e,t,n,i){var s=t.flags;switch(t.tag){case 0:case 11:case 15:Mi(e,t,n,i),s&2048&&El(9,t);break;case 1:Mi(e,t,n,i);break;case 3:Mi(e,t,n,i),s&2048&&(e=null,t.alternate!==null&&(e=t.alternate.memoizedState.cache),t=t.memoizedState.cache,t!==e&&(t.refCount++,e!=null&&Ml(e)));break;case 12:if(s&2048){Mi(e,t,n,i),e=t.stateNode;try{var a=t.memoizedProps,r=a.id,o=a.onPostCommit;typeof o=="function"&&o(r,t.alternate===null?"mount":"update",e.passiveEffectDuration,-0)}catch(l){ue(t,t.return,l)}}else Mi(e,t,n,i);break;case 31:Mi(e,t,n,i);break;case 13:Mi(e,t,n,i);break;case 23:break;case 22:a=t.stateNode,r=t.alternate,t.memoizedState!==null?a._visibility&2?Mi(e,t,n,i):$o(e,t):a._visibility&2?Mi(e,t,n,i):(a._visibility|=2,dr(e,t,n,i,(t.subtreeFlags&10256)!==0||!1)),s&2048&&ym(r,t);break;case 24:Mi(e,t,n,i),s&2048&&_m(t.alternate,t);break;default:Mi(e,t,n,i)}}function dr(e,t,n,i,s){for(s=s&&((t.subtreeFlags&10256)!==0||!1),t=t.child;t!==null;){var a=e,r=t,o=n,l=i,c=r.flags;switch(r.tag){case 0:case 11:case 15:dr(a,r,o,l,s),El(8,r);break;case 23:break;case 22:var u=r.stateNode;r.memoizedState!==null?u._visibility&2?dr(a,r,o,l,s):$o(a,r):(u._visibility|=2,dr(a,r,o,l,s)),s&&c&2048&&ym(r.alternate,r);break;case 24:dr(a,r,o,l,s),s&&c&2048&&_m(r.alternate,r);break;default:dr(a,r,o,l,s)}t=t.sibling}}function $o(e,t){if(t.subtreeFlags&10256)for(t=t.child;t!==null;){var n=e,i=t,s=i.flags;switch(i.tag){case 22:$o(n,i),s&2048&&ym(i.alternate,i);break;case 24:$o(n,i),s&2048&&_m(i.alternate,i);break;default:$o(n,i)}t=t.sibling}}var Go=8192;function fr(e,t,n){if(e.subtreeFlags&Go)for(e=e.child;e!==null;)cx(e,t,n),e=e.sibling}function cx(e,t,n){switch(e.tag){case 26:fr(e,t,n),e.flags&Go&&e.memoizedState!==null&&VT(n,Ti,e.memoizedState,e.memoizedProps);break;case 5:fr(e,t,n);break;case 3:case 4:var i=Ti;Ti=Su(e.stateNode.containerInfo),fr(e,t,n),Ti=i;break;case 22:e.memoizedState===null&&(i=e.alternate,i!==null&&i.memoizedState!==null?(i=Go,Go=16777216,fr(e,t,n),Go=i):fr(e,t,n));break;default:fr(e,t,n)}}function ux(e){var t=e.alternate;if(t!==null&&(e=t.child,e!==null)){t.child=null;do t=e.sibling,e.sibling=null,e=t;while(e!==null)}}function Po(e){var t=e.deletions;if((e.flags&16)!==0){if(t!==null)for(var n=0;n<t.length;n++){var i=t[n];sn=i,fx(i,e)}ux(e)}if(e.subtreeFlags&10256)for(e=e.child;e!==null;)hx(e),e=e.sibling}function hx(e){switch(e.tag){case 0:case 11:case 15:Po(e),e.flags&2048&&ia(9,e,e.return);break;case 3:Po(e);break;case 12:Po(e);break;case 22:var t=e.stateNode;e.memoizedState!==null&&t._visibility&2&&(e.return===null||e.return.tag!==13)?(t._visibility&=-3,qc(e)):Po(e);break;default:Po(e)}}function qc(e){var t=e.deletions;if((e.flags&16)!==0){if(t!==null)for(var n=0;n<t.length;n++){var i=t[n];sn=i,fx(i,e)}ux(e)}for(e=e.child;e!==null;){switch(t=e,t.tag){case 0:case 11:case 15:ia(8,t,t.return),qc(t);break;case 22:n=t.stateNode,n._visibility&2&&(n._visibility&=-3,qc(t));break;default:qc(t)}e=e.sibling}}function fx(e,t){for(;sn!==null;){var n=sn;switch(n.tag){case 0:case 11:case 15:ia(8,n,t);break;case 23:case 22:if(n.memoizedState!==null&&n.memoizedState.cachePool!==null){var i=n.memoizedState.cachePool.pool;i!=null&&i.refCount++}break;case 24:Ml(n.memoizedState.cache)}if(i=n.child,i!==null)i.return=n,sn=i;else t:for(n=e;sn!==null;){i=sn;var s=i.sibling,a=i.return;if(nx(i),i===n){sn=null;break t}if(s!==null){s.return=a,sn=s;break t}sn=a}}}var iT={getCacheForType:function(e){var t=fn(qe),n=t.data.get(e);return n===void 0&&(n=e(),t.data.set(e,n)),n},cacheSignal:function(){return fn(qe).controller.signal}},sT=typeof WeakMap=="function"?WeakMap:Map,ie=0,me=null,Xt=null,Yt=0,ce=0,Hn=null,Gs=!1,Jr=!1,vm=!1,Ss=0,Ie=0,sa=0,Ia=0,xm=0,Wn=0,Vr=0,tl=null,Ln=null,vp=!1,Bu=0,dx=0,pu=1/0,mu=null,Ks=null,Ke=0,Qs=null,Hr=null,gs=0,xp=0,Sp=null,px=null,el=0,bp=null;function Zn(){return(ie&2)!==0&&Yt!==0?Yt&-Yt:Dt.T!==null?bm():M_()}function mx(){if(Wn===0)if((Yt&536870912)===0||Jt){var e=xc;xc<<=1,(xc&3932160)===0&&(xc=262144),Wn=e}else Wn=536870912;return e=Kn.current,e!==null&&(e.flags|=32),Wn}function On(e,t,n){(e===me&&(ce===2||ce===9)||e.cancelPendingCommit!==null)&&(kr(e,0),Ws(e,Yt,Wn,!1)),xl(e,n),((ie&2)===0||e!==me)&&(e===me&&((ie&2)===0&&(Ia|=n),Ie===4&&Ws(e,Yt,Wn,!1)),Yi(e))}function gx(e,t,n){if((ie&6)!==0)throw Error(j(327));var i=!n&&(t&127)===0&&(t&e.expiredLanes)===0||vl(e,t),s=i?oT(e,t):Nd(e,t,!0),a=i;do{if(s===0){Jr&&!i&&Ws(e,t,0,!1);break}else{if(n=e.current.alternate,a&&!aT(n)){s=Nd(e,t,!1),a=!1;continue}if(s===2){if(a=t,e.errorRecoveryDisabledLanes&a)var r=0;else r=e.pendingLanes&-536870913,r=r!==0?r:r&536870912?536870912:0;if(r!==0){t=r;t:{var o=e;s=tl;var l=o.current.memoizedState.isDehydrated;if(l&&(kr(o,r).flags|=256),r=Nd(o,r,!1),r!==2){if(vm&&!l){o.errorRecoveryDisabledLanes|=a,Ia|=a,s=4;break t}a=Ln,Ln=s,a!==null&&(Ln===null?Ln=a:Ln.push.apply(Ln,a))}s=r}if(a=!1,s!==2)continue}}if(s===1){kr(e,0),Ws(e,t,0,!0);break}t:{switch(i=e,a=s,a){case 0:case 1:throw Error(j(345));case 4:if((t&4194048)!==t)break;case 6:Ws(i,t,Wn,!Gs);break t;case 2:Ln=null;break;case 3:case 5:break;default:throw Error(j(329))}if((t&62914560)===t&&(s=Bu+300-Xn(),10<s)){if(Ws(i,t,Wn,!Gs),Au(i,0,!0)!==0)break t;gs=t,i.timeoutHandle=Px(Oy.bind(null,i,n,Ln,mu,vp,t,Wn,Ia,Vr,Gs,a,"Throttled",-0,0),s);break t}Oy(i,n,Ln,mu,vp,t,Wn,Ia,Vr,Gs,a,null,-0,0)}}break}while(!0);Yi(e)}function Oy(e,t,n,i,s,a,r,o,l,c,u,p,h,f){if(e.timeoutHandle=-1,p=t.subtreeFlags,p&8192||(p&16785408)===16785408){p={stylesheets:null,count:0,imgCount:0,imgBytes:0,suspenseyImages:[],waitingForImages:!0,waitingForViewTransition:!1,unsuspend:fs},cx(t,a,p);var m=(a&62914560)===a?Bu-Xn():(a&4194048)===a?dx-Xn():0;if(m=HT(p,m),m!==null){gs=a,e.cancelPendingCommit=m(Py.bind(null,e,t,a,n,i,s,r,o,l,u,p,null,h,f)),Ws(e,a,r,!c);return}}Py(e,t,a,n,i,s,r,o,l)}function aT(e){for(var t=e;;){var n=t.tag;if((n===0||n===11||n===15)&&t.flags&16384&&(n=t.updateQueue,n!==null&&(n=n.stores,n!==null)))for(var i=0;i<n.length;i++){var s=n[i],a=s.getSnapshot;s=s.value;try{if(!Jn(a(),s))return!1}catch{return!1}}if(n=t.child,t.subtreeFlags&16384&&n!==null)n.return=t,t=n;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function Ws(e,t,n,i){t&=~xm,t&=~Ia,e.suspendedLanes|=t,e.pingedLanes&=~t,i&&(e.warmLanes|=t),i=e.expirationTimes;for(var s=t;0<s;){var a=31-Yn(s),r=1<<a;i[a]=-1,s&=~r}n!==0&&x_(e,n,t)}function zu(){return(ie&6)===0?(Al(0,!1),!1):!0}function Sm(){if(Xt!==null){if(ce===0)var e=Xt.return;else e=Xt,ds=Xa=null,rm(e),Ur=null,cl=0,e=Xt;for(;e!==null;)Jv(e.alternate,e),e=e.return;Xt=null}}function kr(e,t){var n=e.timeoutHandle;n!==-1&&(e.timeoutHandle=-1,MT(n)),n=e.cancelPendingCommit,n!==null&&(e.cancelPendingCommit=null,n()),gs=0,Sm(),me=e,Xt=n=ps(e.current,null),Yt=t,ce=0,Hn=null,Gs=!1,Jr=vl(e,t),vm=!1,Vr=Wn=xm=Ia=sa=Ie=0,Ln=tl=null,vp=!1,(t&8)!==0&&(t|=t&32);var i=e.entangledLanes;if(i!==0)for(e=e.entanglements,i&=t;0<i;){var s=31-Yn(i),a=1<<s;t|=e[s],i&=~a}return Ss=t,Du(),n}function yx(e,t){Bt=null,Dt.H=hl,t===Zr||t===Nu?(t=fy(),ce=3):t===$p?(t=fy(),ce=4):ce=t===mm?8:t!==null&&typeof t=="object"&&typeof t.then=="function"?6:1,Hn=t,Xt===null&&(Ie=1,hu(e,ui(t,e.current)))}function _x(){var e=Kn.current;return e===null?!0:(Yt&4194048)===Yt?fi===null:(Yt&62914560)===Yt||(Yt&536870912)!==0?e===fi:!1}function vx(){var e=Dt.H;return Dt.H=hl,e===null?hl:e}function xx(){var e=Dt.A;return Dt.A=iT,e}function gu(){Ie=4,Gs||(Yt&4194048)!==Yt&&Kn.current!==null||(Jr=!0),(sa&134217727)===0&&(Ia&134217727)===0||me===null||Ws(me,Yt,Wn,!1)}function Nd(e,t,n){var i=ie;ie|=2;var s=vx(),a=xx();(me!==e||Yt!==t)&&(mu=null,kr(e,t)),t=!1;var r=Ie;t:do try{if(ce!==0&&Xt!==null){var o=Xt,l=Hn;switch(ce){case 8:Sm(),r=6;break t;case 3:case 2:case 9:case 6:Kn.current===null&&(t=!0);var c=ce;if(ce=0,Hn=null,Ar(e,o,l,c),n&&Jr){r=0;break t}break;default:c=ce,ce=0,Hn=null,Ar(e,o,l,c)}}rT(),r=Ie;break}catch(u){yx(e,u)}while(!0);return t&&e.shellSuspendCounter++,ds=Xa=null,ie=i,Dt.H=s,Dt.A=a,Xt===null&&(me=null,Yt=0,Du()),r}function rT(){for(;Xt!==null;)Sx(Xt)}function oT(e,t){var n=ie;ie|=2;var i=vx(),s=xx();me!==e||Yt!==t?(mu=null,pu=Xn()+500,kr(e,t)):Jr=vl(e,t);t:do try{if(ce!==0&&Xt!==null){t=Xt;var a=Hn;e:switch(ce){case 1:ce=0,Hn=null,Ar(e,t,a,1);break;case 2:case 9:if(hy(a)){ce=0,Hn=null,Iy(t);break}t=function(){ce!==2&&ce!==9||me!==e||(ce=7),Yi(e)},a.then(t,t);break t;case 3:ce=7;break t;case 4:ce=5;break t;case 7:hy(a)?(ce=0,Hn=null,Iy(t)):(ce=0,Hn=null,Ar(e,t,a,7));break;case 5:var r=null;switch(Xt.tag){case 26:r=Xt.memoizedState;case 5:case 27:var o=Xt;if(r?Hx(r):o.stateNode.complete){ce=0,Hn=null;var l=o.sibling;if(l!==null)Xt=l;else{var c=o.return;c!==null?(Xt=c,Fu(c)):Xt=null}break e}}ce=0,Hn=null,Ar(e,t,a,5);break;case 6:ce=0,Hn=null,Ar(e,t,a,6);break;case 8:Sm(),Ie=6;break t;default:throw Error(j(462))}}lT();break}catch(u){yx(e,u)}while(!0);return ds=Xa=null,Dt.H=i,Dt.A=s,ie=n,Xt!==null?0:(me=null,Yt=0,Du(),Ie)}function lT(){for(;Xt!==null&&!UM();)Sx(Xt)}function Sx(e){var t=Zv(e.alternate,e,Ss);e.memoizedProps=e.pendingProps,t===null?Fu(e):Xt=t}function Iy(e){var t=e,n=t.alternate;switch(t.tag){case 15:case 0:t=Cy(n,t,t.pendingProps,t.type,void 0,Yt);break;case 11:t=Cy(n,t,t.pendingProps,t.type.render,t.ref,Yt);break;case 5:rm(t);default:Jv(n,t),t=Xt=J_(t,Ss),t=Zv(n,t,Ss)}e.memoizedProps=e.pendingProps,t===null?Fu(e):Xt=t}function Ar(e,t,n,i){ds=Xa=null,rm(t),Ur=null,cl=0;var s=t.return;try{if(K1(e,s,t,n,Yt)){Ie=1,hu(e,ui(n,e.current)),Xt=null;return}}catch(a){if(s!==null)throw Xt=s,a;Ie=1,hu(e,ui(n,e.current)),Xt=null;return}t.flags&32768?(Jt||i===1?e=!0:Jr||(Yt&536870912)!==0?e=!1:(Gs=e=!0,(i===2||i===9||i===3||i===6)&&(i=Kn.current,i!==null&&i.tag===13&&(i.flags|=16384))),bx(t,e)):Fu(t)}function Fu(e){var t=e;do{if((t.flags&32768)!==0){bx(t,Gs);return}e=t.return;var n=$1(t.alternate,t,Ss);if(n!==null){Xt=n;return}if(t=t.sibling,t!==null){Xt=t;return}Xt=t=e}while(t!==null);Ie===0&&(Ie=5)}function bx(e,t){do{var n=tT(e.alternate,e);if(n!==null){n.flags&=32767,Xt=n;return}if(n=e.return,n!==null&&(n.flags|=32768,n.subtreeFlags=0,n.deletions=null),!t&&(e=e.sibling,e!==null)){Xt=e;return}Xt=e=n}while(e!==null);Ie=6,Xt=null}function Py(e,t,n,i,s,a,r,o,l){e.cancelPendingCommit=null;do Vu();while(Ke!==0);if((ie&6)!==0)throw Error(j(327));if(t!==null){if(t===e.current)throw Error(j(177));if(a=t.lanes|t.childLanes,a|=qp,HM(e,n,a,r,o,l),e===me&&(Xt=me=null,Yt=0),Hr=t,Qs=e,gs=n,xp=a,Sp=s,px=i,(t.subtreeFlags&10256)!==0||(t.flags&10256)!==0?(e.callbackNode=null,e.callbackPriority=0,fT(tu,function(){return wx(),null})):(e.callbackNode=null,e.callbackPriority=0),i=(t.flags&13878)!==0,(t.subtreeFlags&13878)!==0||i){i=Dt.T,Dt.T=null,s=se.p,se.p=2,r=ie,ie|=4;try{eT(e,t,n)}finally{ie=r,se.p=s,Dt.T=i}}Ke=1,Mx(),Tx(),Ex()}}function Mx(){if(Ke===1){Ke=0;var e=Qs,t=Hr,n=(t.flags&13878)!==0;if((t.subtreeFlags&13878)!==0||n){n=Dt.T,Dt.T=null;var i=se.p;se.p=2;var s=ie;ie|=4;try{rx(t,e);var a=Ap,r=H_(e.containerInfo),o=a.focusedElem,l=a.selectionRange;if(r!==o&&o&&o.ownerDocument&&V_(o.ownerDocument.documentElement,o)){if(l!==null&&Xp(o)){var c=l.start,u=l.end;if(u===void 0&&(u=c),"selectionStart"in o)o.selectionStart=c,o.selectionEnd=Math.min(u,o.value.length);else{var p=o.ownerDocument||document,h=p&&p.defaultView||window;if(h.getSelection){var f=h.getSelection(),m=o.textContent.length,b=Math.min(l.start,m),y=l.end===void 0?b:Math.min(l.end,m);!f.extend&&b>y&&(r=y,y=b,b=r);var d=sy(o,b),g=sy(o,y);if(d&&g&&(f.rangeCount!==1||f.anchorNode!==d.node||f.anchorOffset!==d.offset||f.focusNode!==g.node||f.focusOffset!==g.offset)){var M=p.createRange();M.setStart(d.node,d.offset),f.removeAllRanges(),b>y?(f.addRange(M),f.extend(g.node,g.offset)):(M.setEnd(g.node,g.offset),f.addRange(M))}}}}for(p=[],f=o;f=f.parentNode;)f.nodeType===1&&p.push({element:f,left:f.scrollLeft,top:f.scrollTop});for(typeof o.focus=="function"&&o.focus(),o=0;o<p.length;o++){var v=p[o];v.element.scrollLeft=v.left,v.element.scrollTop=v.top}}Tu=!!Ep,Ap=Ep=null}finally{ie=s,se.p=i,Dt.T=n}}e.current=t,Ke=2}}function Tx(){if(Ke===2){Ke=0;var e=Qs,t=Hr,n=(t.flags&8772)!==0;if((t.subtreeFlags&8772)!==0||n){n=Dt.T,Dt.T=null;var i=se.p;se.p=2;var s=ie;ie|=4;try{ex(e,t.alternate,t)}finally{ie=s,se.p=i,Dt.T=n}}Ke=3}}function Ex(){if(Ke===4||Ke===3){Ke=0,NM();var e=Qs,t=Hr,n=gs,i=px;(t.subtreeFlags&10256)!==0||(t.flags&10256)!==0?Ke=5:(Ke=0,Hr=Qs=null,Ax(e,e.pendingLanes));var s=e.pendingLanes;if(s===0&&(Ks=null),zp(n),t=t.stateNode,qn&&typeof qn.onCommitFiberRoot=="function")try{qn.onCommitFiberRoot(_l,t,void 0,(t.current.flags&128)===128)}catch{}if(i!==null){t=Dt.T,s=se.p,se.p=2,Dt.T=null;try{for(var a=e.onRecoverableError,r=0;r<i.length;r++){var o=i[r];a(o.value,{componentStack:o.stack})}}finally{Dt.T=t,se.p=s}}(gs&3)!==0&&Vu(),Yi(e),s=e.pendingLanes,(n&261930)!==0&&(s&42)!==0?e===bp?el++:(el=0,bp=e):el=0,Al(0,!1)}}function Ax(e,t){(e.pooledCacheLanes&=t)===0&&(t=e.pooledCache,t!=null&&(e.pooledCache=null,Ml(t)))}function Vu(){return Mx(),Tx(),Ex(),wx()}function wx(){if(Ke!==5)return!1;var e=Qs,t=xp;xp=0;var n=zp(gs),i=Dt.T,s=se.p;try{se.p=32>n?32:n,Dt.T=null,n=Sp,Sp=null;var a=Qs,r=gs;if(Ke=0,Hr=Qs=null,gs=0,(ie&6)!==0)throw Error(j(331));var o=ie;if(ie|=4,hx(a.current),lx(a,a.current,r,n),ie=o,Al(0,!1),qn&&typeof qn.onPostCommitFiberRoot=="function")try{qn.onPostCommitFiberRoot(_l,a)}catch{}return!0}finally{se.p=s,Dt.T=i,Ax(e,t)}}function By(e,t,n){t=ui(n,t),t=mp(e.stateNode,t,2),e=Js(e,t,2),e!==null&&(xl(e,2),Yi(e))}function ue(e,t,n){if(e.tag===3)By(e,e,n);else for(;t!==null;){if(t.tag===3){By(t,e,n);break}else if(t.tag===1){var i=t.stateNode;if(typeof t.type.getDerivedStateFromError=="function"||typeof i.componentDidCatch=="function"&&(Ks===null||!Ks.has(i))){e=ui(n,e),n=kv(2),i=Js(t,n,2),i!==null&&(Gv(n,i,t,e),xl(i,2),Yi(i));break}}t=t.return}}function Ld(e,t,n){var i=e.pingCache;if(i===null){i=e.pingCache=new sT;var s=new Set;i.set(t,s)}else s=i.get(t),s===void 0&&(s=new Set,i.set(t,s));s.has(n)||(vm=!0,s.add(n),e=cT.bind(null,e,t,n),t.then(e,e))}function cT(e,t,n){var i=e.pingCache;i!==null&&i.delete(t),e.pingedLanes|=e.suspendedLanes&n,e.warmLanes&=~n,me===e&&(Yt&n)===n&&(Ie===4||Ie===3&&(Yt&62914560)===Yt&&300>Xn()-Bu?(ie&2)===0&&kr(e,0):xm|=n,Vr===Yt&&(Vr=0)),Yi(e)}function Cx(e,t){t===0&&(t=v_()),e=Wa(e,t),e!==null&&(xl(e,t),Yi(e))}function uT(e){var t=e.memoizedState,n=0;t!==null&&(n=t.retryLane),Cx(e,n)}function hT(e,t){var n=0;switch(e.tag){case 31:case 13:var i=e.stateNode,s=e.memoizedState;s!==null&&(n=s.retryLane);break;case 19:i=e.stateNode;break;case 22:i=e.stateNode._retryCache;break;default:throw Error(j(314))}i!==null&&i.delete(t),Cx(e,n)}function fT(e,t){return Pp(e,t)}var yu=null,pr=null,Mp=!1,_u=!1,Od=!1,Xs=0;function Yi(e){e!==pr&&e.next===null&&(pr===null?yu=pr=e:pr=pr.next=e),_u=!0,Mp||(Mp=!0,pT())}function Al(e,t){if(!Od&&_u){Od=!0;do for(var n=!1,i=yu;i!==null;){if(!t)if(e!==0){var s=i.pendingLanes;if(s===0)var a=0;else{var r=i.suspendedLanes,o=i.pingedLanes;a=(1<<31-Yn(42|e)+1)-1,a&=s&~(r&~o),a=a&201326741?a&201326741|1:a?a|2:0}a!==0&&(n=!0,zy(i,a))}else a=Yt,a=Au(i,i===me?a:0,i.cancelPendingCommit!==null||i.timeoutHandle!==-1),(a&3)===0||vl(i,a)||(n=!0,zy(i,a));i=i.next}while(n);Od=!1}}function dT(){Rx()}function Rx(){_u=Mp=!1;var e=0;Xs!==0&&bT()&&(e=Xs);for(var t=Xn(),n=null,i=yu;i!==null;){var s=i.next,a=Dx(i,t);a===0?(i.next=null,n===null?yu=s:n.next=s,s===null&&(pr=n)):(n=i,(e!==0||(a&3)!==0)&&(_u=!0)),i=s}Ke!==0&&Ke!==5||Al(e,!1),Xs!==0&&(Xs=0)}function Dx(e,t){for(var n=e.suspendedLanes,i=e.pingedLanes,s=e.expirationTimes,a=e.pendingLanes&-62914561;0<a;){var r=31-Yn(a),o=1<<r,l=s[r];l===-1?((o&n)===0||(o&i)!==0)&&(s[r]=VM(o,t)):l<=t&&(e.expiredLanes|=o),a&=~o}if(t=me,n=Yt,n=Au(e,e===t?n:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),i=e.callbackNode,n===0||e===t&&(ce===2||ce===9)||e.cancelPendingCommit!==null)return i!==null&&i!==null&&cd(i),e.callbackNode=null,e.callbackPriority=0;if((n&3)===0||vl(e,n)){if(t=n&-n,t===e.callbackPriority)return t;switch(i!==null&&cd(i),zp(n)){case 2:case 8:n=y_;break;case 32:n=tu;break;case 268435456:n=__;break;default:n=tu}return i=Ux.bind(null,e),n=Pp(n,i),e.callbackPriority=t,e.callbackNode=n,t}return i!==null&&i!==null&&cd(i),e.callbackPriority=2,e.callbackNode=null,2}function Ux(e,t){if(Ke!==0&&Ke!==5)return e.callbackNode=null,e.callbackPriority=0,null;var n=e.callbackNode;if(Vu()&&e.callbackNode!==n)return null;var i=Yt;return i=Au(e,e===me?i:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),i===0?null:(gx(e,i,t),Dx(e,Xn()),e.callbackNode!=null&&e.callbackNode===n?Ux.bind(null,e):null)}function zy(e,t){if(Vu())return null;gx(e,t,!0)}function pT(){TT(function(){(ie&6)!==0?Pp(g_,dT):Rx()})}function bm(){if(Xs===0){var e=Br;e===0&&(e=vc,vc<<=1,(vc&261888)===0&&(vc=256)),Xs=e}return Xs}function Fy(e){return e==null||typeof e=="symbol"||typeof e=="boolean"?null:typeof e=="function"?e:Bc(""+e)}function Vy(e,t){var n=t.ownerDocument.createElement("input");return n.name=t.name,n.value=t.value,e.id&&n.setAttribute("form",e.id),t.parentNode.insertBefore(n,t),e=new FormData(e),n.parentNode.removeChild(n),e}function mT(e,t,n,i,s){if(t==="submit"&&n&&n.stateNode===s){var a=Fy((s[In]||null).action),r=i.submitter;r&&(t=(t=r[In]||null)?Fy(t.formAction):r.getAttribute("formAction"),t!==null&&(a=t,r=null));var o=new wu("action","action",null,i,s);e.push({event:o,listeners:[{instance:null,listener:function(){if(i.defaultPrevented){if(Xs!==0){var l=r?Vy(s,r):new FormData(s);dp(n,{pending:!0,data:l,method:s.method,action:a},null,l)}}else typeof a=="function"&&(o.preventDefault(),l=r?Vy(s,r):new FormData(s),dp(n,{pending:!0,data:l,method:s.method,action:a},a,l))},currentTarget:s}]})}}for(Uc=0;Uc<ep.length;Uc++)Nc=ep[Uc],Hy=Nc.toLowerCase(),ky=Nc[0].toUpperCase()+Nc.slice(1),Ei(Hy,"on"+ky);var Nc,Hy,ky,Uc;Ei(G_,"onAnimationEnd");Ei(W_,"onAnimationIteration");Ei(X_,"onAnimationStart");Ei("dblclick","onDoubleClick");Ei("focusin","onFocus");Ei("focusout","onBlur");Ei(L1,"onTransitionRun");Ei(O1,"onTransitionStart");Ei(I1,"onTransitionCancel");Ei(q_,"onTransitionEnd");Ir("onMouseEnter",["mouseout","mouseover"]);Ir("onMouseLeave",["mouseout","mouseover"]);Ir("onPointerEnter",["pointerout","pointerover"]);Ir("onPointerLeave",["pointerout","pointerover"]);Ha("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));Ha("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));Ha("onBeforeInput",["compositionend","keypress","textInput","paste"]);Ha("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));Ha("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));Ha("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var fl="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),gT=new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(fl));function Nx(e,t){t=(t&4)!==0;for(var n=0;n<e.length;n++){var i=e[n],s=i.event;i=i.listeners;t:{var a=void 0;if(t)for(var r=i.length-1;0<=r;r--){var o=i[r],l=o.instance,c=o.currentTarget;if(o=o.listener,l!==a&&s.isPropagationStopped())break t;a=o,s.currentTarget=c;try{a(s)}catch(u){nu(u)}s.currentTarget=null,a=l}else for(r=0;r<i.length;r++){if(o=i[r],l=o.instance,c=o.currentTarget,o=o.listener,l!==a&&s.isPropagationStopped())break t;a=o,s.currentTarget=c;try{a(s)}catch(u){nu(u)}s.currentTarget=null,a=l}}}}function Wt(e,t){var n=t[Yd];n===void 0&&(n=t[Yd]=new Set);var i=e+"__bubble";n.has(i)||(Lx(t,e,2,!1),n.add(i))}function Id(e,t,n){var i=0;t&&(i|=4),Lx(n,e,i,t)}var Lc="_reactListening"+Math.random().toString(36).slice(2);function Mm(e){if(!e[Lc]){e[Lc]=!0,T_.forEach(function(n){n!=="selectionchange"&&(gT.has(n)||Id(n,!1,e),Id(n,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[Lc]||(t[Lc]=!0,Id("selectionchange",!1,t))}}function Lx(e,t,n,i){switch(qx(t)){case 2:var s=WT;break;case 8:s=XT;break;default:s=wm}n=s.bind(null,t,n,e),s=void 0,!jd||t!=="touchstart"&&t!=="touchmove"&&t!=="wheel"||(s=!0),i?s!==void 0?e.addEventListener(t,n,{capture:!0,passive:s}):e.addEventListener(t,n,!0):s!==void 0?e.addEventListener(t,n,{passive:s}):e.addEventListener(t,n,!1)}function Pd(e,t,n,i,s){var a=i;if((t&1)===0&&(t&2)===0&&i!==null)t:for(;;){if(i===null)return;var r=i.tag;if(r===3||r===4){var o=i.stateNode.containerInfo;if(o===s)break;if(r===4)for(r=i.return;r!==null;){var l=r.tag;if((l===3||l===4)&&r.stateNode.containerInfo===s)return;r=r.return}for(;o!==null;){if(r=yr(o),r===null)return;if(l=r.tag,l===5||l===6||l===26||l===27){i=a=r;continue t}o=o.parentNode}}i=i.return}N_(function(){var c=a,u=Hp(n),p=[];t:{var h=Y_.get(e);if(h!==void 0){var f=wu,m=e;switch(e){case"keypress":if(Fc(n)===0)break t;case"keydown":case"keyup":f=h1;break;case"focusin":m="focus",f=pd;break;case"focusout":m="blur",f=pd;break;case"beforeblur":case"afterblur":f=pd;break;case"click":if(n.button===2)break t;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":f=J0;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":f=$M;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":f=p1;break;case G_:case W_:case X_:f=n1;break;case q_:f=g1;break;case"scroll":case"scrollend":f=QM;break;case"wheel":f=_1;break;case"copy":case"cut":case"paste":f=s1;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":f=Q0;break;case"toggle":case"beforetoggle":f=x1}var b=(t&4)!==0,y=!b&&(e==="scroll"||e==="scrollend"),d=b?h!==null?h+"Capture":null:h;b=[];for(var g=c,M;g!==null;){var v=g;if(M=v.stateNode,v=v.tag,v!==5&&v!==26&&v!==27||M===null||d===null||(v=sl(g,d),v!=null&&b.push(dl(g,v,M))),y)break;g=g.return}0<b.length&&(h=new f(h,m,null,n,u),p.push({event:h,listeners:b}))}}if((t&7)===0){t:{if(h=e==="mouseover"||e==="pointerover",f=e==="mouseout"||e==="pointerout",h&&n!==Qd&&(m=n.relatedTarget||n.fromElement)&&(yr(m)||m[Xr]))break t;if((f||h)&&(h=u.window===u?u:(h=u.ownerDocument)?h.defaultView||h.parentWindow:window,f?(m=n.relatedTarget||n.toElement,f=c,m=m?yr(m):null,m!==null&&(y=yl(m),b=m.tag,m!==y||b!==5&&b!==27&&b!==6)&&(m=null)):(f=null,m=c),f!==m)){if(b=J0,v="onMouseLeave",d="onMouseEnter",g="mouse",(e==="pointerout"||e==="pointerover")&&(b=Q0,v="onPointerLeave",d="onPointerEnter",g="pointer"),y=f==null?h:Ho(f),M=m==null?h:Ho(m),h=new b(v,g+"leave",f,n,u),h.target=y,h.relatedTarget=M,v=null,yr(u)===c&&(b=new b(d,g+"enter",m,n,u),b.target=M,b.relatedTarget=y,v=b),y=v,f&&m)e:{for(b=yT,d=f,g=m,M=0,v=d;v;v=b(v))M++;v=0;for(var T=g;T;T=b(T))v++;for(;0<M-v;)d=b(d),M--;for(;0<v-M;)g=b(g),v--;for(;M--;){if(d===g||g!==null&&d===g.alternate){b=d;break e}d=b(d),g=b(g)}b=null}else b=null;f!==null&&Gy(p,h,f,b,!1),m!==null&&y!==null&&Gy(p,y,m,b,!0)}}t:{if(h=c?Ho(c):window,f=h.nodeName&&h.nodeName.toLowerCase(),f==="select"||f==="input"&&h.type==="file")var E=ey;else if(ty(h))if(z_)E=D1;else{E=C1;var w=w1}else f=h.nodeName,!f||f.toLowerCase()!=="input"||h.type!=="checkbox"&&h.type!=="radio"?c&&Vp(c.elementType)&&(E=ey):E=R1;if(E&&(E=E(e,c))){B_(p,E,n,u);break t}w&&w(e,h,c),e==="focusout"&&c&&h.type==="number"&&c.memoizedProps.value!=null&&Kd(h,"number",h.value)}switch(w=c?Ho(c):window,e){case"focusin":(ty(w)||w.contentEditable==="true")&&(xr=w,$d=c,qo=null);break;case"focusout":qo=$d=xr=null;break;case"mousedown":tp=!0;break;case"contextmenu":case"mouseup":case"dragend":tp=!1,ay(p,n,u);break;case"selectionchange":if(N1)break;case"keydown":case"keyup":ay(p,n,u)}var x;if(Wp)t:{switch(e){case"compositionstart":var A="onCompositionStart";break t;case"compositionend":A="onCompositionEnd";break t;case"compositionupdate":A="onCompositionUpdate";break t}A=void 0}else vr?I_(e,n)&&(A="onCompositionEnd"):e==="keydown"&&n.keyCode===229&&(A="onCompositionStart");A&&(O_&&n.locale!=="ko"&&(vr||A!=="onCompositionStart"?A==="onCompositionEnd"&&vr&&(x=L_()):(ks=u,kp="value"in ks?ks.value:ks.textContent,vr=!0)),w=vu(c,A),0<w.length&&(A=new K0(A,e,null,n,u),p.push({event:A,listeners:w}),x?A.data=x:(x=P_(n),x!==null&&(A.data=x)))),(x=b1?M1(e,n):T1(e,n))&&(A=vu(c,"onBeforeInput"),0<A.length&&(w=new K0("onBeforeInput","beforeinput",null,n,u),p.push({event:w,listeners:A}),w.data=x)),mT(p,e,c,n,u)}Nx(p,t)})}function dl(e,t,n){return{instance:e,listener:t,currentTarget:n}}function vu(e,t){for(var n=t+"Capture",i=[];e!==null;){var s=e,a=s.stateNode;if(s=s.tag,s!==5&&s!==26&&s!==27||a===null||(s=sl(e,n),s!=null&&i.unshift(dl(e,s,a)),s=sl(e,t),s!=null&&i.push(dl(e,s,a))),e.tag===3)return i;e=e.return}return[]}function yT(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5&&e.tag!==27);return e||null}function Gy(e,t,n,i,s){for(var a=t._reactName,r=[];n!==null&&n!==i;){var o=n,l=o.alternate,c=o.stateNode;if(o=o.tag,l!==null&&l===i)break;o!==5&&o!==26&&o!==27||c===null||(l=c,s?(c=sl(n,a),c!=null&&r.unshift(dl(n,c,l))):s||(c=sl(n,a),c!=null&&r.push(dl(n,c,l)))),n=n.return}r.length!==0&&e.push({event:t,listeners:r})}var _T=/\r\n?/g,vT=/\u0000|\uFFFD/g;function Wy(e){return(typeof e=="string"?e:""+e).replace(_T,`
`).replace(vT,"")}function Ox(e,t){return t=Wy(t),Wy(e)===t}function fe(e,t,n,i,s,a){switch(n){case"children":typeof i=="string"?t==="body"||t==="textarea"&&i===""||Pr(e,i):(typeof i=="number"||typeof i=="bigint")&&t!=="body"&&Pr(e,""+i);break;case"className":bc(e,"class",i);break;case"tabIndex":bc(e,"tabindex",i);break;case"dir":case"role":case"viewBox":case"width":case"height":bc(e,n,i);break;case"style":U_(e,i,a);break;case"data":if(t!=="object"){bc(e,"data",i);break}case"src":case"href":if(i===""&&(t!=="a"||n!=="href")){e.removeAttribute(n);break}if(i==null||typeof i=="function"||typeof i=="symbol"||typeof i=="boolean"){e.removeAttribute(n);break}i=Bc(""+i),e.setAttribute(n,i);break;case"action":case"formAction":if(typeof i=="function"){e.setAttribute(n,"javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");break}else typeof a=="function"&&(n==="formAction"?(t!=="input"&&fe(e,t,"name",s.name,s,null),fe(e,t,"formEncType",s.formEncType,s,null),fe(e,t,"formMethod",s.formMethod,s,null),fe(e,t,"formTarget",s.formTarget,s,null)):(fe(e,t,"encType",s.encType,s,null),fe(e,t,"method",s.method,s,null),fe(e,t,"target",s.target,s,null)));if(i==null||typeof i=="symbol"||typeof i=="boolean"){e.removeAttribute(n);break}i=Bc(""+i),e.setAttribute(n,i);break;case"onClick":i!=null&&(e.onclick=fs);break;case"onScroll":i!=null&&Wt("scroll",e);break;case"onScrollEnd":i!=null&&Wt("scrollend",e);break;case"dangerouslySetInnerHTML":if(i!=null){if(typeof i!="object"||!("__html"in i))throw Error(j(61));if(n=i.__html,n!=null){if(s.children!=null)throw Error(j(60));e.innerHTML=n}}break;case"multiple":e.multiple=i&&typeof i!="function"&&typeof i!="symbol";break;case"muted":e.muted=i&&typeof i!="function"&&typeof i!="symbol";break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"defaultValue":case"defaultChecked":case"innerHTML":case"ref":break;case"autoFocus":break;case"xlinkHref":if(i==null||typeof i=="function"||typeof i=="boolean"||typeof i=="symbol"){e.removeAttribute("xlink:href");break}n=Bc(""+i),e.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",n);break;case"contentEditable":case"spellCheck":case"draggable":case"value":case"autoReverse":case"externalResourcesRequired":case"focusable":case"preserveAlpha":i!=null&&typeof i!="function"&&typeof i!="symbol"?e.setAttribute(n,""+i):e.removeAttribute(n);break;case"inert":case"allowFullScreen":case"async":case"autoPlay":case"controls":case"default":case"defer":case"disabled":case"disablePictureInPicture":case"disableRemotePlayback":case"formNoValidate":case"hidden":case"loop":case"noModule":case"noValidate":case"open":case"playsInline":case"readOnly":case"required":case"reversed":case"scoped":case"seamless":case"itemScope":i&&typeof i!="function"&&typeof i!="symbol"?e.setAttribute(n,""):e.removeAttribute(n);break;case"capture":case"download":i===!0?e.setAttribute(n,""):i!==!1&&i!=null&&typeof i!="function"&&typeof i!="symbol"?e.setAttribute(n,i):e.removeAttribute(n);break;case"cols":case"rows":case"size":case"span":i!=null&&typeof i!="function"&&typeof i!="symbol"&&!isNaN(i)&&1<=i?e.setAttribute(n,i):e.removeAttribute(n);break;case"rowSpan":case"start":i==null||typeof i=="function"||typeof i=="symbol"||isNaN(i)?e.removeAttribute(n):e.setAttribute(n,i);break;case"popover":Wt("beforetoggle",e),Wt("toggle",e),Pc(e,"popover",i);break;case"xlinkActuate":ss(e,"http://www.w3.org/1999/xlink","xlink:actuate",i);break;case"xlinkArcrole":ss(e,"http://www.w3.org/1999/xlink","xlink:arcrole",i);break;case"xlinkRole":ss(e,"http://www.w3.org/1999/xlink","xlink:role",i);break;case"xlinkShow":ss(e,"http://www.w3.org/1999/xlink","xlink:show",i);break;case"xlinkTitle":ss(e,"http://www.w3.org/1999/xlink","xlink:title",i);break;case"xlinkType":ss(e,"http://www.w3.org/1999/xlink","xlink:type",i);break;case"xmlBase":ss(e,"http://www.w3.org/XML/1998/namespace","xml:base",i);break;case"xmlLang":ss(e,"http://www.w3.org/XML/1998/namespace","xml:lang",i);break;case"xmlSpace":ss(e,"http://www.w3.org/XML/1998/namespace","xml:space",i);break;case"is":Pc(e,"is",i);break;case"innerText":case"textContent":break;default:(!(2<n.length)||n[0]!=="o"&&n[0]!=="O"||n[1]!=="n"&&n[1]!=="N")&&(n=JM.get(n)||n,Pc(e,n,i))}}function Tp(e,t,n,i,s,a){switch(n){case"style":U_(e,i,a);break;case"dangerouslySetInnerHTML":if(i!=null){if(typeof i!="object"||!("__html"in i))throw Error(j(61));if(n=i.__html,n!=null){if(s.children!=null)throw Error(j(60));e.innerHTML=n}}break;case"children":typeof i=="string"?Pr(e,i):(typeof i=="number"||typeof i=="bigint")&&Pr(e,""+i);break;case"onScroll":i!=null&&Wt("scroll",e);break;case"onScrollEnd":i!=null&&Wt("scrollend",e);break;case"onClick":i!=null&&(e.onclick=fs);break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"innerHTML":case"ref":break;case"innerText":case"textContent":break;default:if(!E_.hasOwnProperty(n))t:{if(n[0]==="o"&&n[1]==="n"&&(s=n.endsWith("Capture"),t=n.slice(2,s?n.length-7:void 0),a=e[In]||null,a=a!=null?a[n]:null,typeof a=="function"&&e.removeEventListener(t,a,s),typeof i=="function")){typeof a!="function"&&a!==null&&(n in e?e[n]=null:e.hasAttribute(n)&&e.removeAttribute(n)),e.addEventListener(t,i,s);break t}n in e?e[n]=i:i===!0?e.setAttribute(n,""):Pc(e,n,i)}}}function dn(e,t,n){switch(t){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"img":Wt("error",e),Wt("load",e);var i=!1,s=!1,a;for(a in n)if(n.hasOwnProperty(a)){var r=n[a];if(r!=null)switch(a){case"src":i=!0;break;case"srcSet":s=!0;break;case"children":case"dangerouslySetInnerHTML":throw Error(j(137,t));default:fe(e,t,a,r,n,null)}}s&&fe(e,t,"srcSet",n.srcSet,n,null),i&&fe(e,t,"src",n.src,n,null);return;case"input":Wt("invalid",e);var o=a=r=s=null,l=null,c=null;for(i in n)if(n.hasOwnProperty(i)){var u=n[i];if(u!=null)switch(i){case"name":s=u;break;case"type":r=u;break;case"checked":l=u;break;case"defaultChecked":c=u;break;case"value":a=u;break;case"defaultValue":o=u;break;case"children":case"dangerouslySetInnerHTML":if(u!=null)throw Error(j(137,t));break;default:fe(e,t,i,u,n,null)}}C_(e,a,o,l,c,r,s,!1);return;case"select":Wt("invalid",e),i=r=a=null;for(s in n)if(n.hasOwnProperty(s)&&(o=n[s],o!=null))switch(s){case"value":a=o;break;case"defaultValue":r=o;break;case"multiple":i=o;default:fe(e,t,s,o,n,null)}t=a,n=r,e.multiple=!!i,t!=null?Cr(e,!!i,t,!1):n!=null&&Cr(e,!!i,n,!0);return;case"textarea":Wt("invalid",e),a=s=i=null;for(r in n)if(n.hasOwnProperty(r)&&(o=n[r],o!=null))switch(r){case"value":i=o;break;case"defaultValue":s=o;break;case"children":a=o;break;case"dangerouslySetInnerHTML":if(o!=null)throw Error(j(91));break;default:fe(e,t,r,o,n,null)}D_(e,i,s,a);return;case"option":for(l in n)if(n.hasOwnProperty(l)&&(i=n[l],i!=null))switch(l){case"selected":e.selected=i&&typeof i!="function"&&typeof i!="symbol";break;default:fe(e,t,l,i,n,null)}return;case"dialog":Wt("beforetoggle",e),Wt("toggle",e),Wt("cancel",e),Wt("close",e);break;case"iframe":case"object":Wt("load",e);break;case"video":case"audio":for(i=0;i<fl.length;i++)Wt(fl[i],e);break;case"image":Wt("error",e),Wt("load",e);break;case"details":Wt("toggle",e);break;case"embed":case"source":case"link":Wt("error",e),Wt("load",e);case"area":case"base":case"br":case"col":case"hr":case"keygen":case"meta":case"param":case"track":case"wbr":case"menuitem":for(c in n)if(n.hasOwnProperty(c)&&(i=n[c],i!=null))switch(c){case"children":case"dangerouslySetInnerHTML":throw Error(j(137,t));default:fe(e,t,c,i,n,null)}return;default:if(Vp(t)){for(u in n)n.hasOwnProperty(u)&&(i=n[u],i!==void 0&&Tp(e,t,u,i,n,void 0));return}}for(o in n)n.hasOwnProperty(o)&&(i=n[o],i!=null&&fe(e,t,o,i,n,null))}function xT(e,t,n,i){switch(t){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"input":var s=null,a=null,r=null,o=null,l=null,c=null,u=null;for(f in n){var p=n[f];if(n.hasOwnProperty(f)&&p!=null)switch(f){case"checked":break;case"value":break;case"defaultValue":l=p;default:i.hasOwnProperty(f)||fe(e,t,f,null,i,p)}}for(var h in i){var f=i[h];if(p=n[h],i.hasOwnProperty(h)&&(f!=null||p!=null))switch(h){case"type":a=f;break;case"name":s=f;break;case"checked":c=f;break;case"defaultChecked":u=f;break;case"value":r=f;break;case"defaultValue":o=f;break;case"children":case"dangerouslySetInnerHTML":if(f!=null)throw Error(j(137,t));break;default:f!==p&&fe(e,t,h,f,i,p)}}Jd(e,r,o,l,c,u,a,s);return;case"select":f=r=o=h=null;for(a in n)if(l=n[a],n.hasOwnProperty(a)&&l!=null)switch(a){case"value":break;case"multiple":f=l;default:i.hasOwnProperty(a)||fe(e,t,a,null,i,l)}for(s in i)if(a=i[s],l=n[s],i.hasOwnProperty(s)&&(a!=null||l!=null))switch(s){case"value":h=a;break;case"defaultValue":o=a;break;case"multiple":r=a;default:a!==l&&fe(e,t,s,a,i,l)}t=o,n=r,i=f,h!=null?Cr(e,!!n,h,!1):!!i!=!!n&&(t!=null?Cr(e,!!n,t,!0):Cr(e,!!n,n?[]:"",!1));return;case"textarea":f=h=null;for(o in n)if(s=n[o],n.hasOwnProperty(o)&&s!=null&&!i.hasOwnProperty(o))switch(o){case"value":break;case"children":break;default:fe(e,t,o,null,i,s)}for(r in i)if(s=i[r],a=n[r],i.hasOwnProperty(r)&&(s!=null||a!=null))switch(r){case"value":h=s;break;case"defaultValue":f=s;break;case"children":break;case"dangerouslySetInnerHTML":if(s!=null)throw Error(j(91));break;default:s!==a&&fe(e,t,r,s,i,a)}R_(e,h,f);return;case"option":for(var m in n)if(h=n[m],n.hasOwnProperty(m)&&h!=null&&!i.hasOwnProperty(m))switch(m){case"selected":e.selected=!1;break;default:fe(e,t,m,null,i,h)}for(l in i)if(h=i[l],f=n[l],i.hasOwnProperty(l)&&h!==f&&(h!=null||f!=null))switch(l){case"selected":e.selected=h&&typeof h!="function"&&typeof h!="symbol";break;default:fe(e,t,l,h,i,f)}return;case"img":case"link":case"area":case"base":case"br":case"col":case"embed":case"hr":case"keygen":case"meta":case"param":case"source":case"track":case"wbr":case"menuitem":for(var b in n)h=n[b],n.hasOwnProperty(b)&&h!=null&&!i.hasOwnProperty(b)&&fe(e,t,b,null,i,h);for(c in i)if(h=i[c],f=n[c],i.hasOwnProperty(c)&&h!==f&&(h!=null||f!=null))switch(c){case"children":case"dangerouslySetInnerHTML":if(h!=null)throw Error(j(137,t));break;default:fe(e,t,c,h,i,f)}return;default:if(Vp(t)){for(var y in n)h=n[y],n.hasOwnProperty(y)&&h!==void 0&&!i.hasOwnProperty(y)&&Tp(e,t,y,void 0,i,h);for(u in i)h=i[u],f=n[u],!i.hasOwnProperty(u)||h===f||h===void 0&&f===void 0||Tp(e,t,u,h,i,f);return}}for(var d in n)h=n[d],n.hasOwnProperty(d)&&h!=null&&!i.hasOwnProperty(d)&&fe(e,t,d,null,i,h);for(p in i)h=i[p],f=n[p],!i.hasOwnProperty(p)||h===f||h==null&&f==null||fe(e,t,p,h,i,f)}function Xy(e){switch(e){case"css":case"script":case"font":case"img":case"image":case"input":case"link":return!0;default:return!1}}function ST(){if(typeof performance.getEntriesByType=="function"){for(var e=0,t=0,n=performance.getEntriesByType("resource"),i=0;i<n.length;i++){var s=n[i],a=s.transferSize,r=s.initiatorType,o=s.duration;if(a&&o&&Xy(r)){for(r=0,o=s.responseEnd,i+=1;i<n.length;i++){var l=n[i],c=l.startTime;if(c>o)break;var u=l.transferSize,p=l.initiatorType;u&&Xy(p)&&(l=l.responseEnd,r+=u*(l<o?1:(o-c)/(l-c)))}if(--i,t+=8*(a+r)/(s.duration/1e3),e++,10<e)break}}if(0<e)return t/e/1e6}return navigator.connection&&(e=navigator.connection.downlink,typeof e=="number")?e:5}var Ep=null,Ap=null;function xu(e){return e.nodeType===9?e:e.ownerDocument}function qy(e){switch(e){case"http://www.w3.org/2000/svg":return 1;case"http://www.w3.org/1998/Math/MathML":return 2;default:return 0}}function Ix(e,t){if(e===0)switch(t){case"svg":return 1;case"math":return 2;default:return 0}return e===1&&t==="foreignObject"?0:e}function wp(e,t){return e==="textarea"||e==="noscript"||typeof t.children=="string"||typeof t.children=="number"||typeof t.children=="bigint"||typeof t.dangerouslySetInnerHTML=="object"&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var Bd=null;function bT(){var e=window.event;return e&&e.type==="popstate"?e===Bd?!1:(Bd=e,!0):(Bd=null,!1)}var Px=typeof setTimeout=="function"?setTimeout:void 0,MT=typeof clearTimeout=="function"?clearTimeout:void 0,Yy=typeof Promise=="function"?Promise:void 0,TT=typeof queueMicrotask=="function"?queueMicrotask:typeof Yy<"u"?function(e){return Yy.resolve(null).then(e).catch(ET)}:Px;function ET(e){setTimeout(function(){throw e})}function ra(e){return e==="head"}function Zy(e,t){var n=t,i=0;do{var s=n.nextSibling;if(e.removeChild(n),s&&s.nodeType===8)if(n=s.data,n==="/$"||n==="/&"){if(i===0){e.removeChild(s),Wr(t);return}i--}else if(n==="$"||n==="$?"||n==="$~"||n==="$!"||n==="&")i++;else if(n==="html")nl(e.ownerDocument.documentElement);else if(n==="head"){n=e.ownerDocument.head,nl(n);for(var a=n.firstChild;a;){var r=a.nextSibling,o=a.nodeName;a[Sl]||o==="SCRIPT"||o==="STYLE"||o==="LINK"&&a.rel.toLowerCase()==="stylesheet"||n.removeChild(a),a=r}}else n==="body"&&nl(e.ownerDocument.body);n=s}while(n);Wr(t)}function Jy(e,t){var n=e;e=0;do{var i=n.nextSibling;if(n.nodeType===1?t?(n._stashedDisplay=n.style.display,n.style.display="none"):(n.style.display=n._stashedDisplay||"",n.getAttribute("style")===""&&n.removeAttribute("style")):n.nodeType===3&&(t?(n._stashedText=n.nodeValue,n.nodeValue=""):n.nodeValue=n._stashedText||""),i&&i.nodeType===8)if(n=i.data,n==="/$"){if(e===0)break;e--}else n!=="$"&&n!=="$?"&&n!=="$~"&&n!=="$!"||e++;n=i}while(n)}function Cp(e){var t=e.firstChild;for(t&&t.nodeType===10&&(t=t.nextSibling);t;){var n=t;switch(t=t.nextSibling,n.nodeName){case"HTML":case"HEAD":case"BODY":Cp(n),Fp(n);continue;case"SCRIPT":case"STYLE":continue;case"LINK":if(n.rel.toLowerCase()==="stylesheet")continue}e.removeChild(n)}}function AT(e,t,n,i){for(;e.nodeType===1;){var s=n;if(e.nodeName.toLowerCase()!==t.toLowerCase()){if(!i&&(e.nodeName!=="INPUT"||e.type!=="hidden"))break}else if(i){if(!e[Sl])switch(t){case"meta":if(!e.hasAttribute("itemprop"))break;return e;case"link":if(a=e.getAttribute("rel"),a==="stylesheet"&&e.hasAttribute("data-precedence"))break;if(a!==s.rel||e.getAttribute("href")!==(s.href==null||s.href===""?null:s.href)||e.getAttribute("crossorigin")!==(s.crossOrigin==null?null:s.crossOrigin)||e.getAttribute("title")!==(s.title==null?null:s.title))break;return e;case"style":if(e.hasAttribute("data-precedence"))break;return e;case"script":if(a=e.getAttribute("src"),(a!==(s.src==null?null:s.src)||e.getAttribute("type")!==(s.type==null?null:s.type)||e.getAttribute("crossorigin")!==(s.crossOrigin==null?null:s.crossOrigin))&&a&&e.hasAttribute("async")&&!e.hasAttribute("itemprop"))break;return e;default:return e}}else if(t==="input"&&e.type==="hidden"){var a=s.name==null?null:""+s.name;if(s.type==="hidden"&&e.getAttribute("name")===a)return e}else return e;if(e=di(e.nextSibling),e===null)break}return null}function wT(e,t,n){if(t==="")return null;for(;e.nodeType!==3;)if((e.nodeType!==1||e.nodeName!=="INPUT"||e.type!=="hidden")&&!n||(e=di(e.nextSibling),e===null))return null;return e}function Bx(e,t){for(;e.nodeType!==8;)if((e.nodeType!==1||e.nodeName!=="INPUT"||e.type!=="hidden")&&!t||(e=di(e.nextSibling),e===null))return null;return e}function Rp(e){return e.data==="$?"||e.data==="$~"}function Dp(e){return e.data==="$!"||e.data==="$?"&&e.ownerDocument.readyState!=="loading"}function CT(e,t){var n=e.ownerDocument;if(e.data==="$~")e._reactRetry=t;else if(e.data!=="$?"||n.readyState!=="loading")t();else{var i=function(){t(),n.removeEventListener("DOMContentLoaded",i)};n.addEventListener("DOMContentLoaded",i),e._reactRetry=i}}function di(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t==="$"||t==="$!"||t==="$?"||t==="$~"||t==="&"||t==="F!"||t==="F")break;if(t==="/$"||t==="/&")return null}}return e}var Up=null;function Ky(e){e=e.nextSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="/$"||n==="/&"){if(t===0)return di(e.nextSibling);t--}else n!=="$"&&n!=="$!"&&n!=="$?"&&n!=="$~"&&n!=="&"||t++}e=e.nextSibling}return null}function Qy(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="$"||n==="$!"||n==="$?"||n==="$~"||n==="&"){if(t===0)return e;t--}else n!=="/$"&&n!=="/&"||t++}e=e.previousSibling}return null}function zx(e,t,n){switch(t=xu(n),e){case"html":if(e=t.documentElement,!e)throw Error(j(452));return e;case"head":if(e=t.head,!e)throw Error(j(453));return e;case"body":if(e=t.body,!e)throw Error(j(454));return e;default:throw Error(j(451))}}function nl(e){for(var t=e.attributes;t.length;)e.removeAttributeNode(t[0]);Fp(e)}var pi=new Map,jy=new Set;function Su(e){return typeof e.getRootNode=="function"?e.getRootNode():e.nodeType===9?e:e.ownerDocument}var bs=se.d;se.d={f:RT,r:DT,D:UT,C:NT,L:LT,m:OT,X:PT,S:IT,M:BT};function RT(){var e=bs.f(),t=zu();return e||t}function DT(e){var t=qr(e);t!==null&&t.tag===5&&t.type==="form"?Uv(t):bs.r(e)}var Kr=typeof document>"u"?null:document;function Fx(e,t,n){var i=Kr;if(i&&typeof t=="string"&&t){var s=ci(t);s='link[rel="'+e+'"][href="'+s+'"]',typeof n=="string"&&(s+='[crossorigin="'+n+'"]'),jy.has(s)||(jy.add(s),e={rel:e,crossOrigin:n,href:t},i.querySelector(s)===null&&(t=i.createElement("link"),dn(t,"link",e),an(t),i.head.appendChild(t)))}}function UT(e){bs.D(e),Fx("dns-prefetch",e,null)}function NT(e,t){bs.C(e,t),Fx("preconnect",e,t)}function LT(e,t,n){bs.L(e,t,n);var i=Kr;if(i&&e&&t){var s='link[rel="preload"][as="'+ci(t)+'"]';t==="image"&&n&&n.imageSrcSet?(s+='[imagesrcset="'+ci(n.imageSrcSet)+'"]',typeof n.imageSizes=="string"&&(s+='[imagesizes="'+ci(n.imageSizes)+'"]')):s+='[href="'+ci(e)+'"]';var a=s;switch(t){case"style":a=Gr(e);break;case"script":a=Qr(e)}pi.has(a)||(e=Ee({rel:"preload",href:t==="image"&&n&&n.imageSrcSet?void 0:e,as:t},n),pi.set(a,e),i.querySelector(s)!==null||t==="style"&&i.querySelector(wl(a))||t==="script"&&i.querySelector(Cl(a))||(t=i.createElement("link"),dn(t,"link",e),an(t),i.head.appendChild(t)))}}function OT(e,t){bs.m(e,t);var n=Kr;if(n&&e){var i=t&&typeof t.as=="string"?t.as:"script",s='link[rel="modulepreload"][as="'+ci(i)+'"][href="'+ci(e)+'"]',a=s;switch(i){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":a=Qr(e)}if(!pi.has(a)&&(e=Ee({rel:"modulepreload",href:e},t),pi.set(a,e),n.querySelector(s)===null)){switch(i){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":if(n.querySelector(Cl(a)))return}i=n.createElement("link"),dn(i,"link",e),an(i),n.head.appendChild(i)}}}function IT(e,t,n){bs.S(e,t,n);var i=Kr;if(i&&e){var s=wr(i).hoistableStyles,a=Gr(e);t=t||"default";var r=s.get(a);if(!r){var o={loading:0,preload:null};if(r=i.querySelector(wl(a)))o.loading=5;else{e=Ee({rel:"stylesheet",href:e,"data-precedence":t},n),(n=pi.get(a))&&Tm(e,n);var l=r=i.createElement("link");an(l),dn(l,"link",e),l._p=new Promise(function(c,u){l.onload=c,l.onerror=u}),l.addEventListener("load",function(){o.loading|=1}),l.addEventListener("error",function(){o.loading|=2}),o.loading|=4,Yc(r,t,i)}r={type:"stylesheet",instance:r,count:1,state:o},s.set(a,r)}}}function PT(e,t){bs.X(e,t);var n=Kr;if(n&&e){var i=wr(n).hoistableScripts,s=Qr(e),a=i.get(s);a||(a=n.querySelector(Cl(s)),a||(e=Ee({src:e,async:!0},t),(t=pi.get(s))&&Em(e,t),a=n.createElement("script"),an(a),dn(a,"link",e),n.head.appendChild(a)),a={type:"script",instance:a,count:1,state:null},i.set(s,a))}}function BT(e,t){bs.M(e,t);var n=Kr;if(n&&e){var i=wr(n).hoistableScripts,s=Qr(e),a=i.get(s);a||(a=n.querySelector(Cl(s)),a||(e=Ee({src:e,async:!0,type:"module"},t),(t=pi.get(s))&&Em(e,t),a=n.createElement("script"),an(a),dn(a,"link",e),n.head.appendChild(a)),a={type:"script",instance:a,count:1,state:null},i.set(s,a))}}function $y(e,t,n,i){var s=(s=qs.current)?Su(s):null;if(!s)throw Error(j(446));switch(e){case"meta":case"title":return null;case"style":return typeof n.precedence=="string"&&typeof n.href=="string"?(t=Gr(n.href),n=wr(s).hoistableStyles,i=n.get(t),i||(i={type:"style",instance:null,count:0,state:null},n.set(t,i)),i):{type:"void",instance:null,count:0,state:null};case"link":if(n.rel==="stylesheet"&&typeof n.href=="string"&&typeof n.precedence=="string"){e=Gr(n.href);var a=wr(s).hoistableStyles,r=a.get(e);if(r||(s=s.ownerDocument||s,r={type:"stylesheet",instance:null,count:0,state:{loading:0,preload:null}},a.set(e,r),(a=s.querySelector(wl(e)))&&!a._p&&(r.instance=a,r.state.loading=5),pi.has(e)||(n={rel:"preload",as:"style",href:n.href,crossOrigin:n.crossOrigin,integrity:n.integrity,media:n.media,hrefLang:n.hrefLang,referrerPolicy:n.referrerPolicy},pi.set(e,n),a||zT(s,e,n,r.state))),t&&i===null)throw Error(j(528,""));return r}if(t&&i!==null)throw Error(j(529,""));return null;case"script":return t=n.async,n=n.src,typeof n=="string"&&t&&typeof t!="function"&&typeof t!="symbol"?(t=Qr(n),n=wr(s).hoistableScripts,i=n.get(t),i||(i={type:"script",instance:null,count:0,state:null},n.set(t,i)),i):{type:"void",instance:null,count:0,state:null};default:throw Error(j(444,e))}}function Gr(e){return'href="'+ci(e)+'"'}function wl(e){return'link[rel="stylesheet"]['+e+"]"}function Vx(e){return Ee({},e,{"data-precedence":e.precedence,precedence:null})}function zT(e,t,n,i){e.querySelector('link[rel="preload"][as="style"]['+t+"]")?i.loading=1:(t=e.createElement("link"),i.preload=t,t.addEventListener("load",function(){return i.loading|=1}),t.addEventListener("error",function(){return i.loading|=2}),dn(t,"link",n),an(t),e.head.appendChild(t))}function Qr(e){return'[src="'+ci(e)+'"]'}function Cl(e){return"script[async]"+e}function t_(e,t,n){if(t.count++,t.instance===null)switch(t.type){case"style":var i=e.querySelector('style[data-href~="'+ci(n.href)+'"]');if(i)return t.instance=i,an(i),i;var s=Ee({},n,{"data-href":n.href,"data-precedence":n.precedence,href:null,precedence:null});return i=(e.ownerDocument||e).createElement("style"),an(i),dn(i,"style",s),Yc(i,n.precedence,e),t.instance=i;case"stylesheet":s=Gr(n.href);var a=e.querySelector(wl(s));if(a)return t.state.loading|=4,t.instance=a,an(a),a;i=Vx(n),(s=pi.get(s))&&Tm(i,s),a=(e.ownerDocument||e).createElement("link"),an(a);var r=a;return r._p=new Promise(function(o,l){r.onload=o,r.onerror=l}),dn(a,"link",i),t.state.loading|=4,Yc(a,n.precedence,e),t.instance=a;case"script":return a=Qr(n.src),(s=e.querySelector(Cl(a)))?(t.instance=s,an(s),s):(i=n,(s=pi.get(a))&&(i=Ee({},n),Em(i,s)),e=e.ownerDocument||e,s=e.createElement("script"),an(s),dn(s,"link",i),e.head.appendChild(s),t.instance=s);case"void":return null;default:throw Error(j(443,t.type))}else t.type==="stylesheet"&&(t.state.loading&4)===0&&(i=t.instance,t.state.loading|=4,Yc(i,n.precedence,e));return t.instance}function Yc(e,t,n){for(var i=n.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'),s=i.length?i[i.length-1]:null,a=s,r=0;r<i.length;r++){var o=i[r];if(o.dataset.precedence===t)a=o;else if(a!==s)break}a?a.parentNode.insertBefore(e,a.nextSibling):(t=n.nodeType===9?n.head:n,t.insertBefore(e,t.firstChild))}function Tm(e,t){e.crossOrigin==null&&(e.crossOrigin=t.crossOrigin),e.referrerPolicy==null&&(e.referrerPolicy=t.referrerPolicy),e.title==null&&(e.title=t.title)}function Em(e,t){e.crossOrigin==null&&(e.crossOrigin=t.crossOrigin),e.referrerPolicy==null&&(e.referrerPolicy=t.referrerPolicy),e.integrity==null&&(e.integrity=t.integrity)}var Zc=null;function e_(e,t,n){if(Zc===null){var i=new Map,s=Zc=new Map;s.set(n,i)}else s=Zc,i=s.get(n),i||(i=new Map,s.set(n,i));if(i.has(e))return i;for(i.set(e,null),n=n.getElementsByTagName(e),s=0;s<n.length;s++){var a=n[s];if(!(a[Sl]||a[un]||e==="link"&&a.getAttribute("rel")==="stylesheet")&&a.namespaceURI!=="http://www.w3.org/2000/svg"){var r=a.getAttribute(t)||"";r=e+r;var o=i.get(r);o?o.push(a):i.set(r,[a])}}return i}function n_(e,t,n){e=e.ownerDocument||e,e.head.insertBefore(n,t==="title"?e.querySelector("head > title"):null)}function FT(e,t,n){if(n===1||t.itemProp!=null)return!1;switch(e){case"meta":case"title":return!0;case"style":if(typeof t.precedence!="string"||typeof t.href!="string"||t.href==="")break;return!0;case"link":if(typeof t.rel!="string"||typeof t.href!="string"||t.href===""||t.onLoad||t.onError)break;switch(t.rel){case"stylesheet":return e=t.disabled,typeof t.precedence=="string"&&e==null;default:return!0}case"script":if(t.async&&typeof t.async!="function"&&typeof t.async!="symbol"&&!t.onLoad&&!t.onError&&t.src&&typeof t.src=="string")return!0}return!1}function Hx(e){return!(e.type==="stylesheet"&&(e.state.loading&3)===0)}function VT(e,t,n,i){if(n.type==="stylesheet"&&(typeof i.media!="string"||matchMedia(i.media).matches!==!1)&&(n.state.loading&4)===0){if(n.instance===null){var s=Gr(i.href),a=t.querySelector(wl(s));if(a){t=a._p,t!==null&&typeof t=="object"&&typeof t.then=="function"&&(e.count++,e=bu.bind(e),t.then(e,e)),n.state.loading|=4,n.instance=a,an(a);return}a=t.ownerDocument||t,i=Vx(i),(s=pi.get(s))&&Tm(i,s),a=a.createElement("link"),an(a);var r=a;r._p=new Promise(function(o,l){r.onload=o,r.onerror=l}),dn(a,"link",i),n.instance=a}e.stylesheets===null&&(e.stylesheets=new Map),e.stylesheets.set(n,t),(t=n.state.preload)&&(n.state.loading&3)===0&&(e.count++,n=bu.bind(e),t.addEventListener("load",n),t.addEventListener("error",n))}}var zd=0;function HT(e,t){return e.stylesheets&&e.count===0&&Jc(e,e.stylesheets),0<e.count||0<e.imgCount?function(n){var i=setTimeout(function(){if(e.stylesheets&&Jc(e,e.stylesheets),e.unsuspend){var a=e.unsuspend;e.unsuspend=null,a()}},6e4+t);0<e.imgBytes&&zd===0&&(zd=62500*ST());var s=setTimeout(function(){if(e.waitingForImages=!1,e.count===0&&(e.stylesheets&&Jc(e,e.stylesheets),e.unsuspend)){var a=e.unsuspend;e.unsuspend=null,a()}},(e.imgBytes>zd?50:800)+t);return e.unsuspend=n,function(){e.unsuspend=null,clearTimeout(i),clearTimeout(s)}}:null}function bu(){if(this.count--,this.count===0&&(this.imgCount===0||!this.waitingForImages)){if(this.stylesheets)Jc(this,this.stylesheets);else if(this.unsuspend){var e=this.unsuspend;this.unsuspend=null,e()}}}var Mu=null;function Jc(e,t){e.stylesheets=null,e.unsuspend!==null&&(e.count++,Mu=new Map,t.forEach(kT,e),Mu=null,bu.call(e))}function kT(e,t){if(!(t.state.loading&4)){var n=Mu.get(e);if(n)var i=n.get(null);else{n=new Map,Mu.set(e,n);for(var s=e.querySelectorAll("link[data-precedence],style[data-precedence]"),a=0;a<s.length;a++){var r=s[a];(r.nodeName==="LINK"||r.getAttribute("media")!=="not all")&&(n.set(r.dataset.precedence,r),i=r)}i&&n.set(null,i)}s=t.instance,r=s.getAttribute("data-precedence"),a=n.get(r)||i,a===i&&n.set(null,s),n.set(r,s),this.count++,i=bu.bind(this),s.addEventListener("load",i),s.addEventListener("error",i),a?a.parentNode.insertBefore(s,a.nextSibling):(e=e.nodeType===9?e.head:e,e.insertBefore(s,e.firstChild)),t.state.loading|=4}}var pl={$$typeof:hs,Provider:null,Consumer:null,_currentValue:Ua,_currentValue2:Ua,_threadCount:0};function GT(e,t,n,i,s,a,r,o,l){this.tag=1,this.containerInfo=e,this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.next=this.pendingContext=this.context=this.cancelPendingCommit=null,this.callbackPriority=0,this.expirationTimes=ud(-1),this.entangledLanes=this.shellSuspendCounter=this.errorRecoveryDisabledLanes=this.expiredLanes=this.warmLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=ud(0),this.hiddenUpdates=ud(null),this.identifierPrefix=i,this.onUncaughtError=s,this.onCaughtError=a,this.onRecoverableError=r,this.pooledCache=null,this.pooledCacheLanes=0,this.formState=l,this.incompleteTransitions=new Map}function kx(e,t,n,i,s,a,r,o,l,c,u,p){return e=new GT(e,t,n,r,l,c,u,p,o),t=1,a===!0&&(t|=24),a=Gn(3,null,null,t),e.current=a,a.stateNode=e,t=Qp(),t.refCount++,e.pooledCache=t,t.refCount++,a.memoizedState={element:i,isDehydrated:n,cache:t},tm(a),e}function Gx(e){return e?(e=Mr,e):Mr}function Wx(e,t,n,i,s,a){s=Gx(s),i.context===null?i.context=s:i.pendingContext=s,i=Zs(t),i.payload={element:n},a=a===void 0?null:a,a!==null&&(i.callback=a),n=Js(e,i,t),n!==null&&(On(n,e,t),Zo(n,e,t))}function i_(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var n=e.retryLane;e.retryLane=n!==0&&n<t?n:t}}function Am(e,t){i_(e,t),(e=e.alternate)&&i_(e,t)}function Xx(e){if(e.tag===13||e.tag===31){var t=Wa(e,67108864);t!==null&&On(t,e,67108864),Am(e,67108864)}}function s_(e){if(e.tag===13||e.tag===31){var t=Zn();t=Bp(t);var n=Wa(e,t);n!==null&&On(n,e,t),Am(e,t)}}var Tu=!0;function WT(e,t,n,i){var s=Dt.T;Dt.T=null;var a=se.p;try{se.p=2,wm(e,t,n,i)}finally{se.p=a,Dt.T=s}}function XT(e,t,n,i){var s=Dt.T;Dt.T=null;var a=se.p;try{se.p=8,wm(e,t,n,i)}finally{se.p=a,Dt.T=s}}function wm(e,t,n,i){if(Tu){var s=Np(i);if(s===null)Pd(e,t,i,Eu,n),a_(e,i);else if(YT(s,e,t,n,i))i.stopPropagation();else if(a_(e,i),t&4&&-1<qT.indexOf(e)){for(;s!==null;){var a=qr(s);if(a!==null)switch(a.tag){case 3:if(a=a.stateNode,a.current.memoizedState.isDehydrated){var r=Ca(a.pendingLanes);if(r!==0){var o=a;for(o.pendingLanes|=2,o.entangledLanes|=2;r;){var l=1<<31-Yn(r);o.entanglements[1]|=l,r&=~l}Yi(a),(ie&6)===0&&(pu=Xn()+500,Al(0,!1))}}break;case 31:case 13:o=Wa(a,2),o!==null&&On(o,a,2),zu(),Am(a,2)}if(a=Np(i),a===null&&Pd(e,t,i,Eu,n),a===s)break;s=a}s!==null&&i.stopPropagation()}else Pd(e,t,i,null,n)}}function Np(e){return e=Hp(e),Cm(e)}var Eu=null;function Cm(e){if(Eu=null,e=yr(e),e!==null){var t=yl(e);if(t===null)e=null;else{var n=t.tag;if(n===13){if(e=h_(t),e!==null)return e;e=null}else if(n===31){if(e=f_(t),e!==null)return e;e=null}else if(n===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null)}}return Eu=e,null}function qx(e){switch(e){case"beforetoggle":case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"toggle":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 2;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 8;case"message":switch(LM()){case g_:return 2;case y_:return 8;case tu:case OM:return 32;case __:return 268435456;default:return 32}default:return 32}}var Lp=!1,js=null,$s=null,ta=null,ml=new Map,gl=new Map,Vs=[],qT="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");function a_(e,t){switch(e){case"focusin":case"focusout":js=null;break;case"dragenter":case"dragleave":$s=null;break;case"mouseover":case"mouseout":ta=null;break;case"pointerover":case"pointerout":ml.delete(t.pointerId);break;case"gotpointercapture":case"lostpointercapture":gl.delete(t.pointerId)}}function Bo(e,t,n,i,s,a){return e===null||e.nativeEvent!==a?(e={blockedOn:t,domEventName:n,eventSystemFlags:i,nativeEvent:a,targetContainers:[s]},t!==null&&(t=qr(t),t!==null&&Xx(t)),e):(e.eventSystemFlags|=i,t=e.targetContainers,s!==null&&t.indexOf(s)===-1&&t.push(s),e)}function YT(e,t,n,i,s){switch(t){case"focusin":return js=Bo(js,e,t,n,i,s),!0;case"dragenter":return $s=Bo($s,e,t,n,i,s),!0;case"mouseover":return ta=Bo(ta,e,t,n,i,s),!0;case"pointerover":var a=s.pointerId;return ml.set(a,Bo(ml.get(a)||null,e,t,n,i,s)),!0;case"gotpointercapture":return a=s.pointerId,gl.set(a,Bo(gl.get(a)||null,e,t,n,i,s)),!0}return!1}function Yx(e){var t=yr(e.target);if(t!==null){var n=yl(t);if(n!==null){if(t=n.tag,t===13){if(t=h_(n),t!==null){e.blockedOn=t,k0(e.priority,function(){s_(n)});return}}else if(t===31){if(t=f_(n),t!==null){e.blockedOn=t,k0(e.priority,function(){s_(n)});return}}else if(t===3&&n.stateNode.current.memoizedState.isDehydrated){e.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}e.blockedOn=null}function Kc(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var n=Np(e.nativeEvent);if(n===null){n=e.nativeEvent;var i=new n.constructor(n.type,n);Qd=i,n.target.dispatchEvent(i),Qd=null}else return t=qr(n),t!==null&&Xx(t),e.blockedOn=n,!1;t.shift()}return!0}function r_(e,t,n){Kc(e)&&n.delete(t)}function ZT(){Lp=!1,js!==null&&Kc(js)&&(js=null),$s!==null&&Kc($s)&&($s=null),ta!==null&&Kc(ta)&&(ta=null),ml.forEach(r_),gl.forEach(r_)}function Oc(e,t){e.blockedOn===t&&(e.blockedOn=null,Lp||(Lp=!0,Qe.unstable_scheduleCallback(Qe.unstable_NormalPriority,ZT)))}var Ic=null;function o_(e){Ic!==e&&(Ic=e,Qe.unstable_scheduleCallback(Qe.unstable_NormalPriority,function(){Ic===e&&(Ic=null);for(var t=0;t<e.length;t+=3){var n=e[t],i=e[t+1],s=e[t+2];if(typeof i!="function"){if(Cm(i||n)===null)continue;break}var a=qr(n);a!==null&&(e.splice(t,3),t-=3,dp(a,{pending:!0,data:s,method:n.method,action:i},i,s))}}))}function Wr(e){function t(l){return Oc(l,e)}js!==null&&Oc(js,e),$s!==null&&Oc($s,e),ta!==null&&Oc(ta,e),ml.forEach(t),gl.forEach(t);for(var n=0;n<Vs.length;n++){var i=Vs[n];i.blockedOn===e&&(i.blockedOn=null)}for(;0<Vs.length&&(n=Vs[0],n.blockedOn===null);)Yx(n),n.blockedOn===null&&Vs.shift();if(n=(e.ownerDocument||e).$$reactFormReplay,n!=null)for(i=0;i<n.length;i+=3){var s=n[i],a=n[i+1],r=s[In]||null;if(typeof a=="function")r||o_(n);else if(r){var o=null;if(a&&a.hasAttribute("formAction")){if(s=a,r=a[In]||null)o=r.formAction;else if(Cm(s)!==null)continue}else o=r.action;typeof o=="function"?n[i+1]=o:(n.splice(i,3),i-=3),o_(n)}}}function Zx(){function e(a){a.canIntercept&&a.info==="react-transition"&&a.intercept({handler:function(){return new Promise(function(r){return s=r})},focusReset:"manual",scroll:"manual"})}function t(){s!==null&&(s(),s=null),i||setTimeout(n,20)}function n(){if(!i&&!navigation.transition){var a=navigation.currentEntry;a&&a.url!=null&&navigation.navigate(a.url,{state:a.getState(),info:"react-transition",history:"replace"})}}if(typeof navigation=="object"){var i=!1,s=null;return navigation.addEventListener("navigate",e),navigation.addEventListener("navigatesuccess",t),navigation.addEventListener("navigateerror",t),setTimeout(n,100),function(){i=!0,navigation.removeEventListener("navigate",e),navigation.removeEventListener("navigatesuccess",t),navigation.removeEventListener("navigateerror",t),s!==null&&(s(),s=null)}}}function Rm(e){this._internalRoot=e}Hu.prototype.render=Rm.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(j(409));var n=t.current,i=Zn();Wx(n,i,e,t,null,null)};Hu.prototype.unmount=Rm.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;Wx(e.current,2,null,e,null,null),zu(),t[Xr]=null}};function Hu(e){this._internalRoot=e}Hu.prototype.unstable_scheduleHydration=function(e){if(e){var t=M_();e={blockedOn:null,target:e,priority:t};for(var n=0;n<Vs.length&&t!==0&&t<Vs[n].priority;n++);Vs.splice(n,0,e),n===0&&Yx(e)}};var l_=c_.version;if(l_!=="19.2.8")throw Error(j(527,l_,"19.2.8"));se.findDOMNode=function(e){var t=e._reactInternals;if(t===void 0)throw typeof e.render=="function"?Error(j(188)):(e=Object.keys(e).join(","),Error(j(268,e)));return e=AM(t),e=e!==null?d_(e):null,e=e===null?null:e.stateNode,e};var JT={bundleType:0,version:"19.2.8",rendererPackageName:"react-dom",currentDispatcherRef:Dt,reconcilerVersion:"19.2.8"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"&&(zo=__REACT_DEVTOOLS_GLOBAL_HOOK__,!zo.isDisabled&&zo.supportsFiber))try{_l=zo.inject(JT),qn=zo}catch{}var zo;ku.createRoot=function(e,t){if(!u_(e))throw Error(j(299));var n=!1,i="",s=Fv,a=Vv,r=Hv;return t!=null&&(t.unstable_strictMode===!0&&(n=!0),t.identifierPrefix!==void 0&&(i=t.identifierPrefix),t.onUncaughtError!==void 0&&(s=t.onUncaughtError),t.onCaughtError!==void 0&&(a=t.onCaughtError),t.onRecoverableError!==void 0&&(r=t.onRecoverableError)),t=kx(e,1,!1,null,null,n,i,null,s,a,r,Zx),e[Xr]=t.current,Mm(e),new Rm(t)};ku.hydrateRoot=function(e,t,n){if(!u_(e))throw Error(j(299));var i=!1,s="",a=Fv,r=Vv,o=Hv,l=null;return n!=null&&(n.unstable_strictMode===!0&&(i=!0),n.identifierPrefix!==void 0&&(s=n.identifierPrefix),n.onUncaughtError!==void 0&&(a=n.onUncaughtError),n.onCaughtError!==void 0&&(r=n.onCaughtError),n.onRecoverableError!==void 0&&(o=n.onRecoverableError),n.formState!==void 0&&(l=n.formState)),t=kx(e,1,!0,t,n??null,i,s,l,a,r,o,Zx),t.context=Gx(null),n=t.current,i=Zn(),i=Bp(i),s=Zs(i),s.callback=null,Js(n,s,i),n=i,t.current.lanes=n,xl(t,n),Yi(t),e[Xr]=t.current,Mm(e),new Hu(t)};ku.version="19.2.8"});var jx=Vi((H2,Qx)=>{"use strict";function Kx(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(Kx)}catch(e){console.error(e)}}Kx(),Qx.exports=Jx()});var kb=Vi(kf=>{"use strict";var A2=Symbol.for("react.transitional.element"),w2=Symbol.for("react.fragment");function Hb(e,t,n){var i=null;if(n!==void 0&&(i=""+n),t.key!==void 0&&(i=""+t.key),"key"in t){n={};for(var s in t)s!=="key"&&(n[s]=t[s])}else n=t;return t=n.ref,{$$typeof:A2,type:e,key:i,ref:t!==void 0?t:null,props:n}}kf.Fragment=w2;kf.jsx=Hb;kf.jsxs=Hb});var Jg=Vi((KN,Gb)=>{"use strict";Gb.exports=kb()});var bi={id:"retro-football",runtimeVersion:"0.5.0",rulesVersion:"exhibition-complete-v1",assetVersion:"football-complete-atlas-v1",simulationHz:60};var o0=1;function l0(){let e=new URL(location.href).searchParams,t=e.get("session")??crypto.randomUUID(),n=window.parent!==window&&e.get("host")==="web",i=window.RetroFootballHost,s=null,a=!1,r=!n,o=0,l=new AbortController,c=(m,b={})=>{if(a)return;let y={protocolVersion:o0,gameId:bi.id,sessionId:t,type:m,payload:b};n?parent.postMessage(y,location.origin):i?.postMessage(JSON.stringify(y))},u=m=>{if(!m||typeof m!="object")return null;let b=m,y={};for(let d of["music","sfx"])if(b[d]!==void 0){if(typeof b[d]!="number"||!Number.isFinite(b[d])||b[d]<0||b[d]>1)return null;y[d]=b[d]}return y},p=m=>{if(a||!s||!m||typeof m!="object")return;let b=m;if(!(b.protocolVersion!==o0||b.gameId!==bi.id||b.sessionId!==t)){if(b.type==="launch"){let y=u(b.payload);if(!y)return;r=!0,s.setSettings(y),c("launched",bi)}else if(r)if(b.type==="pause")s.pause();else if(b.type==="resume")s.resume();else if(b.type==="settings"){let y=u(b.payload);y&&s.setSettings(y)}else b.type==="dispose"&&(s.dispose(),c("disposed"),a=!0,l.abort())}};return window.addEventListener("message",m=>{n&&m.source===parent&&m.origin===location.origin&&p(m.data)},{signal:l.signal}),i&&Object.assign(window,{retroFootballHostV1:{receive:p}}),{context:{onReady:m=>{s=m,c("ready",bi)},onResult:m=>c("result",{resultId:t+":"+ ++o,result:m}),onSettingsChange:m=>c("settings",m),onError:m=>c("error",{message:m}),onExit:n||i?()=>c("exit"):void 0},dispose(){a||(a=!0,l.abort(),s=null,i&&delete window.retroFootballHostV1)}}}var Bi=hc(dc(),1),Xb=hc(jx(),1);async function $x(e,t){let n=await fetch(e,{signal:t});if(!n.ok)throw new Error("Asset manifest could not load.");let i=await n.json();if(i.schemaVersion!==1||i.version!=="football-complete-atlas-v1"||i.approval!=="reference"||i.records.length!==71)throw new Error("Unsupported football asset manifest.");let s=new URL(i.atlasUrl,e);if(s.origin!==e.origin)throw new Error("Unexpected atlas origin.");let a=await fetch(s,{signal:t});if(!a.ok)throw new Error("Team atlas could not load.");let r=await a.arrayBuffer(),o=await crypto.subtle.digest("SHA-256",r);if(Array.from(new Uint8Array(o),u=>u.toString(16).padStart(2,"0")).join("")!==i.atlasSha256)throw new Error("Team atlas integrity check failed.");if(t.aborted)throw new DOMException("Aborted","AbortError");let c=URL.createObjectURL(new Blob([r],{type:"image/png"}));try{let u=new Image;if(u.src=c,await u.decode(),t.aborted)throw new DOMException("Aborted","AbortError");if(u.naturalWidth!==i.atlasSize[0]||u.naturalHeight!==i.atlasSize[1])throw new Error("Team atlas dimensions changed.");return{manifest:i,image:u}}finally{URL.revokeObjectURL(c)}}var KT=["kick","tackle","save","whistle","ui","goal","result","menu","crowd"],Gu=class{constructor(t=new URL("./audio/",import.meta.url)){this.base=t}status="locked";ctx=null;master=null;limiter=null;buffers=new Map;active=new Set;loop=null;mode="ready";settings={music:.4,sfx:.7};disposed=!1;generation=0;loading=null;played={};controller=new AbortController;unlock(){if(!(this.disposed||this.status==="unavailable"||this.mode==="hidden"))try{if(this.ctx||(this.ctx=new AudioContext,this.master=this.ctx.createGain(),this.master.gain.value=.38,this.limiter=this.ctx.createDynamicsCompressor(),this.limiter.threshold.value=-12,this.limiter.knee.value=8,this.limiter.ratio.value=12,this.limiter.attack.value=.003,this.limiter.release.value=.12,this.master.connect(this.limiter),this.limiter.connect(this.ctx.destination)),this.ctx.resume().catch(()=>this.fail()),!this.loading){this.status="loading";let t=this.ctx;this.loading=Promise.all(KT.map(async n=>{let i=await fetch(new URL(n+".wav",this.base),{signal:this.controller.signal});if(!i.ok)throw Error("Audio unavailable");let s=await t.decodeAudioData(await i.arrayBuffer());this.disposed||this.buffers.set(n,s)})).then(()=>{this.disposed||(this.status="ready",this.sync(this.mode,!0))}).catch(()=>{this.disposed||this.fail()})}}catch{this.fail()}}fail(){this.status="unavailable",this.stop()}play(t,n=!1){if(!this.ctx||!this.master||this.status!=="ready"||this.disposed)return null;let i=this.buffers.get(t),s=t==="menu"||t==="result"?this.settings.music:this.settings.sfx*(t==="crowd"?.32:1);if(!i||s===0||this.active.size>=4)return null;let a=this.ctx.createBufferSource(),r=this.ctx.createGain();return a.buffer=i,a.loop=n,r.gain.value=s,a.connect(r),r.connect(this.master),this.active.add(a),a.onended=()=>{this.active.delete(a),a.disconnect(),r.disconnect(),this.loop===a&&(this.loop=null)},a.start(),this.played[t]=(this.played[t]??0)+1,a}stop(){this.generation++;for(let t of this.active){try{t.stop()}catch{}t.disconnect()}this.active.clear(),this.loop=null}sync(t,n=!1){if(this.disposed||!n&&t===this.mode)return;let i=this.mode==="hidden"||this.mode==="paused";if(this.mode=t,this.stop(),t==="paused"||t==="hidden"){this.ctx?.suspend().catch(()=>{});return}this.ctx?.state==="suspended"&&this.ctx.resume().catch(()=>{}),t==="playing"?this.loop=this.play("crowd",!0):t==="ready"||t==="halftime"?(this.loop=this.play("menu",!0),t==="halftime"&&this.play("whistle")):t==="complete"&&!i&&(this.play("whistle"),this.play("result"))}event(t){if(this.mode!=="playing")return;let n=t.kind;n==="pass"||n==="shot"||n==="keeper-punt"?this.play("kick"):n==="tackle-contact"?this.play("tackle"):n==="save"?this.play("save"):n==="goal"?this.play("goal"):(n==="restart-awarded"||n==="second-half")&&this.play("whistle")}ui(){this.play("ui")}setSettings(t){this.settings={...t},this.mode==="complete"?this.stop():this.sync(this.mode,!0)}diagnostics(){return{status:this.status,active:this.active.size,context:this.ctx?.state??"none",played:{...this.played}}}dispose(){this.disposed||(this.disposed=!0,this.controller.abort(),this.stop(),this.buffers.clear(),this.master?.disconnect(),this.limiter?.disconnect(),this.ctx?.close().catch(()=>{}),this.status="disposed")}};var QT=(e,t)=>Math.hypot(e.x-t.x,e.y-t.y,e.z-t.z);function Zi(e,t,n,i,s){let a={x:e.x-n.x,y:e.y-n.y,z:e.z-n.z},r={x:t.x-e.x-i.x+n.x,y:t.y-e.y-i.y+n.y,z:t.z-e.z-i.z+n.z},o=r.x*r.x+r.y*r.y+r.z*r.z,l=2*(a.x*r.x+a.y*r.y+a.z*r.z),c=a.x*a.x+a.y*a.y+a.z*a.z-s*s,u;if(c<=0)u=0;else{if(o<1e-12)return null;let m=l*l-4*o*c;if(m<0||(u=(-l-Math.sqrt(m))/(2*o),u<0||u>1))return null}let p=(m,b)=>({x:m.x+(b.x-m.x)*u,y:m.y+(b.y-m.y)*u,z:m.z+(b.z-m.z)*u}),h=p(e,t),f=p(n,i);return{fraction:u,anchor:h,ball:f,distance:QT(h,f)}}var Pe=1/60,tS=5400,eS=75,Ae=(e,t,n)=>Math.max(t,Math.min(n,e)),Ai=e=>({x:48+e.x*6,y:80+e.y*3.2}),nS=e=>{let t=Ai(e);return{x:Math.round(t.x),y:Math.round(t.y)}},Ht=e=>({x:e.x*6,y:e.y*3.2,z:e.z}),wi=e=>({x:e.x/6,y:e.y/3.2,z:e.z}),Ue=(e,t)=>Math.hypot(e.x-t.x,e.y-t.y),qa=(e,t)=>({x:160+(e.y-34)*16,y:t.planeY+(t.direction===-1?e.x:105-e.x)*t.depthScale,z:e.z}),iS=(e,t)=>{let n=qa(e,t);return{x:n.x,y:n.y-n.z}},Dm=(e,t)=>({x:t.direction===1?105-(e.y-t.planeY)/t.depthScale:(e.y-t.planeY)/t.depthScale,y:34+(e.x-160)/16,z:e.z});var on={maxCatchSpeed:29,maxVerticalSpeed:140,minimumHeight:6,maximumHeight:45,gripRadius:8,dropAge:80,puntAge:88,puntEnd:98,endAge:138,carrySpeed:1.8,gravity:280};function sS(e){return e<10?"standing-secure":e<46?"standing-tuck":e<58?"carry":e<70?"standing-tuck":e<80?"release-prep":e<88?"drop":e<98?"punt":e<110?"follow-through":e<120?"settle":"ready"}var jT=[{x:4,y:34},{x:24,y:10},{x:21,y:26},{x:21,y:42},{x:24,y:58},{x:43,y:10},{x:40,y:26},{x:40,y:42},{x:43,y:58},{x:62,y:25},{x:62,y:43}],$T=[["tackle-windup",8],["tackle-entry",12],["tackle-slide",8],["tackle-follow",8],["tackle-sit",8],["tackle-crouch",6],["tackle-rise",6],["tackle-recover-ready",8],["compress",6],["settle",6],["ready",8]],jr=e=>e===0?1:0,Xu=class{constructor(t,n={}){this.assets=t;this.options=n;this.poses=new Map(t.records.map(i=>[i.id,i])),this.state=this.initial(1),this.formation(0)}state;poses;initial(t){return{aerial:null,shotView:null,airContacts:[0,0],airCollections:[0,0],status:"ready",phase:"restart",tick:0,eventSerial:0,round:t,seed:4811,half:1,halfTicks:0,score:[0,0],players:[],selected:9,owner:null,ball:{x:52.5,y:34,z:0,vx:0,vy:0,vz:0},lastTouch:0,lastKicker:null,releaseTick:-999,restart:null,goalAge:0,held:{left:!1,right:!1,up:!1,down:!1},inputSources:{left:[],right:[],up:[],down:[]},events:[],message:"Two 90-second halves. Harbour attacks right first. Start exhibition.",passes:[0,0],shots:[0,0],saves:[0,0],possessionTicks:[0,0],camera:{x:220,y:40},pendingKickoff:0,noDoubleTouch:null,lastContact:null}}attack(t){return t===0==(this.state.half===1)?1:-1}emit(t,n={}){let i=this.state,s={kind:t,tick:i.tick,sequence:++i.eventSerial,...n};i.events.push(s),i.events.length>80&&i.events.shift(),i.lastContact=s}random(){let t=this.state.seed;return t^=t<<13,t^=t>>>17,t^=t<<5,this.state.seed=t>>>0,this.state.seed/4294967296}clear(){let t=this.state;for(let n of["left","right","up","down"])t.held[n]=!1,t.inputSources[n]=[]}restart(){this.state=this.initial(this.state.round+1),this.formation(0)}snapshot(){return structuredClone(this.state)}formation(t){let n=this.state;n.players=[];for(let i of[0,1])for(let s=0;s<11;s++){let a=jT[s],r=this.attack(i),o=r===1?a.x:105-a.x;s>0&&(o=i===t?r===1?Math.min(o,48):Math.max(o,57):r===1?Math.min(o,42):Math.max(o,63));let l={x:r===1?a.x:105-a.x,y:a.y};n.players.push({id:i*11+s,team:i,role:s===0?"keeper":"outfield",slot:s,x:o,y:a.y,facing:r===1?"E":"W",moving:!1,motionAge:0,home:l,action:null,cooldown:0,decisionTick:n.tick+20+s*5})}n.selected=9}setBall(t){Object.assign(this.state.ball,t,{vx:0,vy:0,vz:0})}beginRestart(t,n,i){let s=this.state;this.exitShotView("restart"),s.aerial=null,this.clear(),s.phase="restart",s.owner=null,s.noDoubleTouch=null;for(let l of s.players)l.action=null,delete l.keeperCycle,delete l.contactView,delete l.aiCarryY,l.moving=!1;let r=s.players.filter(l=>l.team===n&&(t==="goal-kick"?l.role==="keeper":l.role==="outfield")).sort((l,c)=>Ue(l,i)-Ue(c,i)||l.id-c.id)[0],o=i;s.restart={kind:t,team:n,point:{...o},taker:r.id,age:0},r.x=o.x,r.y=o.y,r.cooldown=0,r.facing=this.attack(n)===1?"E":"W";for(let l of s.players){if(l===r)continue;let c=Ue(l,o),u=l.team!==n?t==="kickoff"?10:9.15:4;if(c<u){let p=Math.atan2(l.y-o.y,l.x-o.x);l.x=Ae(o.x+Math.cos(p)*u,2,103),l.y=Ae(o.y+Math.sin(p)*u,2,66)}t==="goal-kick"&&l.team!==n&&(l.x=this.attack(n)===1?Math.max(19,l.x):Math.min(86,l.x))}n===0&&(s.selected=r.id),this.setBall({...o,z:0}),s.message=`${t.toUpperCase()} \u2014 ${n===0?"Harbour: J / K / L to take":"Orchard preparing"}.`,this.emit("restart-awarded",{restart:t,team:n,point:{...i},player:r.id})}kickoff(t){this.formation(t),this.beginRestart("kickoff",t,{x:52.5,y:34})}command(t){let n=this.state;if(t.type==="clear"){this.clear();return}if(t.type==="pause"){n.status==="playing"?(n.status="paused",this.clear()):n.status==="paused"&&(n.status="playing");return}if(t.type==="resume"){n.status==="paused"&&(n.status="playing");return}if(t.type==="start"){n.status==="ready"?(n.status="playing",this.kickoff(0)):n.status==="halftime"&&(n.half=2,n.halfTicks=0,n.status="playing",this.kickoff(1),this.emit("second-half"),n.message="Second half \u2014 Harbour attacks LEFT. Orchard kickoff.");return}if(t.type==="next"){n.status==="complete"&&this.restart();return}if(n.status!=="playing")return;if(t.type==="hold"){if(t.value&&n.shotView&&n.shotView.phase!=="aim")return;let s=n.inputSources[t.key];t.value&&!s.includes(t.source)&&s.push(t.source),t.value||(n.inputSources[t.key]=s.filter(a=>a!==t.source)),n.held[t.key]=n.inputSources[t.key].length>0;return}if(n.phase==="goal")return;let i=n.players[n.selected];if(n.shotView?.phase==="aim"){t.type==="A"&&this.confirmChance();return}if(!n.shotView){if(n.phase==="restart"){if(n.restart.team!==0||i.action)return;this.takeRestart(t.type==="B");return}if(!(i.action||i.keeperCycle||i.cooldown>0))if(n.owner===i.id)t.type==="A"?this.attackProgress(i)>70&&this.canChance(i)?this.beginChance(i):this.kick(i,this.attackProgress(i)>70?"shot":"pass"):this.kick(i,t.type==="B"?"loft":"pass",t.type==="C");else if(t.type==="C"){let s=n.players.filter(r=>r.team===0&&r.role==="outfield"&&!r.action).sort((r,o)=>Ue(r,n.ball)-Ue(o,n.ball)||r.id-o.id),a=s.findIndex(r=>r.id===n.selected);n.selected=s[(a+1)%Math.min(3,s.length)].id}else t.type==="A"&&n.owner===null&&n.aerial?.controlledBy===null?this.control(i):(t.type==="A"||t.type==="B")&&this.tackle(i)}}attackProgress(t){return this.attack(t.team)===1?t.x:105-t.x}target(t,n=!1){let i=this.state,s=this.attack(t.team),a=this.direction(),r=t.team===0&&t.id===i.selected&&Ue(a,{x:0,y:0})>.1;return i.players.filter(o=>o.team===t.team&&o.role==="outfield"&&o.id!==t.id&&!o.action).sort((o,l)=>{let c=u=>{let p=Ue(t,u),h=(u.x-t.x)/Math.max(1,p),f=(u.y-t.y)/Math.max(1,p);return p*(n?1.4:.35)-(r?(h*a.x+f*a.y)*18:(u.x-t.x)*s*.6)};return c(o)-c(l)||o.id-l.id})[0]}direction(){let t=this.state.held,n=Number(t.right)-Number(t.left),i=Number(t.down)-Number(t.up),s=Math.hypot(n,i);return s?{x:n/s,y:i/s}:{x:0,y:0}}kick(t,n,i=!1,s){if(t.action||t.cooldown>0||this.state.owner!==t.id)return;if(n==="shot"&&!this.state.shotView&&this.canChance(t)){this.beginChance(t,!1);return}let a=this.state.shotView,r=n==="shot"?{x:this.attack(t.team)===1?108:-3,y:a&&a.shooter===t.id?34+(a.aim.x-160)/16:Ae(34+(t.team===0&&t.id===this.state.selected&&this.state.held.up?-6:t.team===0&&t.id===this.state.selected&&this.state.held.down?6:(this.random()-.5)*5),28,40)}:s??this.target(t,i);t.action={kind:n,age:0,target:{x:r.x,y:r.y},targetPlayer:"id"in r?r.id:void 0,released:!1,hit:!1,direction:{x:this.attack(t.team),y:0}},t.facing=this.attack(t.team)===1?"E":"W"}takeRestart(t=!1){let n=this.state,i=n.restart,s=n.players[i.taker],a=this.target(s,!0);s.action={kind:i.kind==="throw-in"?"throw":i.kind==="penalty"?"shot":t?"loft":"pass",age:0,target:i.kind==="penalty"?{x:this.attack(s.team)===1?108:-3,y:34}:{x:a.x,y:a.y},released:!1,hit:!1,direction:{x:this.attack(s.team),y:0}}}tackle(t){if(t.role==="keeper"||t.action||t.cooldown>0)return;let n=this.direction(),i=t.team===0&&t.id===this.state.selected&&Ue(n,{x:0,y:0})>.1?n:{x:Wu(this.state.ball.x-t.x),y:0};t.facing=i.x>=0?"E":"W",t.action={kind:"tackle",age:0,target:{x:0,y:0},released:!1,hit:!1,direction:{x:i.x>=0?1:-1,y:0}}}view(t){let n,i=!1,s=t.action;if(t.contactView)return t.contactView.view;if(t.role==="keeper"){if(t.keeperCycle)return{pose:"keeper-"+sS(t.keeperCycle.age),mirror:this.attack(t.team)<0};let a=this.state.shotView;if(a?.keeper===t.id)return{pose:Math.abs(a.aim.x-160)>=26?a.age<30?"keeper-01":"keeper-03":"keeper-00",mirror:a.aim.x<160};let r=this.state.ball.vx*this.attack(t.team)<-8&&Math.abs(this.state.ball.x-t.x)<20;if(this.options.keeperCatches!==!1&&this.poses.has("keeper-reach")&&!a){let o=this.state.ball;if(Math.hypot(o.vx,o.vy)<=on.maxCatchSpeed&&o.z>=on.minimumHeight&&o.z<=on.maximumHeight&&o.vx*this.attack(t.team)<-1&&Math.abs(o.x-t.x)<18)return{pose:"keeper-reach",mirror:this.attack(t.team)<0};if(!r)return{pose:"keeper-ready",mirror:this.attack(t.team)<0}}return n=r&&this.state.ball.z<24?"keeper-03":"keeper-00",i=n==="keeper-03"?this.attack(t.team)<0:this.attack(t.team)>0,{pose:n,mirror:i}}if(s?.kind==="tackle"){let a=s.age;n="ready";for(let[r,o]of $T){if(a<o){n=r;break}a-=o}i=s.direction.x<0}else if(s?.kind==="control")n=s.age<20?"signal":s.age<28?"crouch":s.age<36?"compress":s.age<44?"settle":"ready",i=s.direction.x>0;else if(s?.kind==="stagger")n=s.age<6?"crouch":s.age<12?"compress":s.age<18?"settle":"ready",i=s.direction.x>0;else if(s?.kind==="throw")n=s.age<4?"throw-hold":s.age<12?"throw-overhead":s.age<18?"throw-release":"throw-follow",i=this.attack(t.team)<0;else if(s)n=s.age<12?"kick-prep":s.age<18?"kick-contact":s.age<26?"kick-follow":"settle",i=this.attack(t.team)<0;else{let a=t.moving?this.assets.movement.cycles[t.facing][Math.floor(t.motionAge/6)%this.assets.movement.cycles[t.facing].length]:this.assets.movement.idle[t.facing];n=a.id,i=a.mirror}return{pose:t.team===1?"orchard-"+n:n,mirror:i}}anchor(t,n="foot",i=this.view(t)){let s=this.poses.get(i.pose),[a,r]=s.anchors.ground,o=s.anchors[n]??s.anchors.boot??s.anchors.foot??s.anchors.ground,l=nS(t);return this.state.shotView?.keeper===t.id&&(n==="leftHand"||n==="rightHand")?{x:t.x,y:(Math.round(160+(t.y-34)*16)+(i.mirror?a-o[0]-1:o[0]-a)-160)/16+34,z:Math.max(0,r-o[1])}:{x:(l.x-48+(i.mirror?a-o[0]-1:o[0]-a))/6,y:(l.y-80)/3.2,z:Math.max(0,r-o[1])}}throwAnchor(t){return this.anchor(t,"ball")}attach(t){let n=this.anchor(t,t.keeperCycle&&!t.keeperCycle.dropped||t.action?.kind==="throw"?"ball":"foot");this.setBall(n)}canSecure(t,n,i){let s=this.state;if(this.options.keeperCatches===!1||s.shotView||s.owner!==null||t.keeperCycle||!this.poses.has("keeper-standing-secure")||i.vx*this.attack(t.team)>=-1||Math.hypot(i.vx,i.vy)>on.maxCatchSpeed||Math.abs(i.vz)>on.maxVerticalSpeed||n.z<on.minimumHeight||n.z>on.maximumHeight)return!1;let a=this.anchor(t,"ball",{pose:"keeper-standing-secure",mirror:this.attack(t.team)<0});return Math.hypot((a.x-n.x)*6,(a.y-n.y)*3.2,a.z-n.z)<=on.gripRadius}secureKeeper(t,n){let i=this.state;t.keeperCycle={age:0,dropped:!1,punted:!1,releaseTick:-1},t.action=null,delete t.contactView,t.cooldown=0,t.moving=!1,i.owner=t.id,i.aerial=null,i.noDoubleTouch=null,i.lastTouch=t.team,i.lastKicker=t.id,i.releaseTick=i.tick,i.saves[t.team]++,this.attach(t),this.emit("keeper-secure",{player:t.id,team:t.team,worldBall:{...n},resolvedGrip:{...i.ball},pose:this.view(t).pose}),i.message="CAUGHT - keeper preparing distribution."}advanceKeeper(t){let n=this.state,i=t.keeperCycle;if(i.age++,t.moving=!1,!i.dropped&&n.owner!==t.id){delete t.keeperCycle,t.cooldown=24,this.emit("keeper-hold-interrupted",{player:t.id});return}if(i.dropped&&!i.punted&&(n.owner!==null||n.lastKicker!==t.id)){delete t.keeperCycle,t.cooldown=24,this.emit("keeper-drop-interrupted",{player:t.id});return}if(i.age>=46&&i.age<58&&!i.dropped&&this.move(t,{x:t.x+this.attack(t.team),y:t.y},on.carrySpeed),i.age===on.dropAge){let s={...n.ball},a={pose:"keeper-punt",mirror:this.attack(t.team)<0},r=this.anchor(t,"kickingFoot",a),o={...r,x:r.x+this.attack(t.team)*3/6},l=on.puntAge-on.dropAge+1,c=Math.pow(.995,.5),u=Pe*(1-Math.pow(c,l))/(1-c);n.owner=null,n.aerial=null,i.dropped=!0,i.releaseTick=n.tick,n.lastTouch=t.team,n.lastKicker=t.id,n.releaseTick=n.tick,n.ball.vx=(o.x-s.x)/u,n.ball.vy=(o.y-s.y)/u,n.ball.vz=(o.z-s.z+on.gravity*Pe*Pe*l*(l-1)/2)/(l*Pe),this.emit("keeper-drop",{player:t.id,team:t.team,worldPoint:s,target:o,pose:"keeper-release-prep"}),n.message="Keeper drop - ball in play."}i.age===on.puntEnd&&!i.punted&&(this.emit("keeper-punt-missed",{player:t.id}),n.message="Loose ball - keeper missed distribution."),i.age>=on.endAge&&(delete t.keeperCycle,t.cooldown=1,this.emit("keeper-recovered",{player:t.id}))}puntKeeper(t,n){let i=this.state,s=t.keeperCycle;s.punted=!0,this.setBall(n);let a=this.target(t),r=a.x-n.x,o=a.y-n.y,l=Math.max(.5,Math.hypot(r,o));i.ball.vx=r/l*25,i.ball.vy=o/l*25,i.ball.vz=80,i.owner=null,i.aerial=null,i.lastTouch=t.team,i.lastKicker=t.id,i.releaseTick=i.tick,i.passes[t.team]++,this.emit("keeper-punt",{player:t.id,team:t.team,targetPlayer:a.id,worldPoint:n,pose:this.view(t).pose,anchor:"kickingFoot"}),i.message="Keeper distribution - play on."}release(t,n){let i=this.state;if(i.owner!==t.id&&!(i.phase==="restart"&&i.restart?.taker===t.id)){n.cancelled=!0,this.emit("delivery-cancelled",{player:t.id,reason:"possession-lost"});return}let s=n.kind==="throw"?this.throwAnchor(t):this.anchor(t);this.setBall(s);let a=n.target.x-s.x,r=n.target.y-s.y,o=Math.max(.5,Math.hypot(a,r)),l=n.kind==="shot"?31:n.kind==="loft"?23:22;n.kind==="throw"&&(l=14);let c=o/l;if(i.ball.vx=a/o*l,i.ball.vy=r/o*l,i.ball.vz=n.kind==="loft"?Math.min(230,c*140):n.kind==="throw"?30:n.kind==="shot"?60:0,i.owner=null,i.aerial=null,n.kind==="loft"&&this.loft(t,n,s),n.kind==="shot"&&i.shotView?.shooter===t.id){let u=i.shotView;u.phase="flight",u.age=0;let p=this.attack(t.team)===1?105-s.x:s.x,h=Math.max(1,Math.ceil(p/Math.max(.01,Math.abs(i.ball.vx))/Pe)),f=Math.pow(.995,.5),m=Pe*(1-Math.pow(f,h))/(1-f),b=h*Pe,y=this.attack(t.team)===1?105:-0,d=34+(u.aim.x-160)/16;i.ball.vx=(y-s.x)/m,i.ball.vy=(d-s.y)/m,i.ball.vz=(u.planeY-u.aim.y-s.z+140*b*b)/b}else n.kind!=="shot"&&this.exitShotView("delivery");i.lastTouch=t.team,i.lastKicker=t.id,i.releaseTick=i.tick,n.released=!0,n.kind==="shot"?i.shots[t.team]++:i.passes[t.team]++,i.phase==="restart"&&(i.phase="open",i.restart=null,i.noDoubleTouch=t.id),this.emit(n.kind==="shot"?"shot":"pass",{player:t.id,team:t.team,pose:this.view(t).pose,mirror:this.view(t).mirror,anchor:n.kind==="throw"?"ball":"foot",worldPoint:{...s},delivery:n.kind,point:Ai(s)}),i.message=n.kind==="shot"?"SHOT \u2014 keeper and rebound in play.":"Ball in play \u2014 move to receive, L to switch."}move(t,n,i){n={x:Ae(n.x,1,104),y:Ae(n.y,1,67)};let s=Ue(t,n),a=Math.min(s,i*Pe),r=t.moving;if(t.moving=s>.1,!t.moving)return;r?t.motionAge++:t.motionAge=0;let o=(n.x-t.x)/s,l=(n.y-t.y)/s;t.x+=o*a,t.y+=l*a,t.facing=Math.abs(o)>=Math.abs(l)?o>=0?"E":"W":l>=0?"S":"N"}forecastCarrier(t,n){let i=t.moving&&!t.action&&this.state.shotView?.shooter!==t.id,s=i?{x:t.facing==="E"?7.2:t.facing==="W"?-7.2:0,y:t.facing==="S"?7.2:t.facing==="N"?-7.2:0}:{x:0,y:0},a={...t,x:Ae(t.x+s.x*n*Pe,1,104),y:Ae(t.y+s.y*n*Pe,1,67),motionAge:t.motionAge+(i?n:0)};return a.action&&(a.action={...a.action,age:a.action.age+n}),a.contactView&&a.contactView.ticks<=n&&delete a.contactView,a}pressurePoint(t,n){let s=n.moving&&!n.action&&(n.facing==="E"||n.facing==="W")?n.facing==="E"?1:-1:Wu(this.state.ball.x-t.x),a=this.poses.get(t.team===0?"tackle-entry":"orchard-tackle-entry"),r=a.anchors.ground,o=a.anchors.boot,l=(s<0?r[0]-o[0]-1:o[0]-r[0])/6,c=this.anchor(this.forecastCarrier(n,8));return{x:c.x-l-s*9*Pe,y:c.y}}challengeLooksReachable(t,n){let i=Wu(this.state.ball.x-t.x),s=a=>{let r={...t,x:Ae(t.x+i*Math.max(0,a-7)*9*Pe,Math.min(1,t.x),Math.max(104,t.x)),action:{kind:"tackle",age:a,target:{x:0,y:0},released:!1,hit:!1,direction:{x:i,y:0}}};return r.contactView&&r.contactView.ticks<=a&&delete r.contactView,r};for(let a=8;a<20;a++){let r=s(a-1),o=s(a),l=this.forecastCarrier(n,a-1),c=this.forecastCarrier(n,a),u=Zi(Ht(this.anchor(r)),Ht(this.anchor(o)),Ht(this.anchor(l)),Ht(this.anchor(c)),6),p=Zi(Ht({...r,z:0}),Ht({...o,z:0}),Ht({...l,z:0}),Ht({...c,z:0}),9);if(p&&(!u||p.fraction<u.fraction))return!1;if(u)return!0}return!1}openOutlet(t){let n=this.state.players.filter(a=>a.team!==t.team),i=this.attack(t.team),s=this.state.players.filter(a=>a.team===t.team&&a.role==="outfield"&&a.id!==t.id&&!a.action&&a.cooldown<=0).flatMap(a=>{let r=a.x-t.x,o=a.y-t.y,l=Math.hypot(r,o),c=r*i;if(l<5||l>32||c<2)return[];let u=Math.min(...n.map(h=>Ue(h,a)));return u<3?[]:n.some(h=>{let f=((h.x-t.x)*r+(h.y-t.y)*o)/(l*l);return f>.12&&f<.92&&Math.hypot(h.x-t.x-r*f,h.y-t.y-o*f)<2.4})?[]:[{player:a,score:c*.8-l*.15+Math.min(u,8)*.4}]});return s.sort((a,r)=>r.score-a.score||a.player.id-r.player.id),s[0]?.player}ai(t){let n=this.state;if(t.action||t.cooldown>0)return;let i=n.shotView;if(i?.keeper===t.id){if(t.moving=!1,i.phase==="flight"&&i.age>16){let h=this.poses.get(this.view(t).pose),f=h.anchors.ground,m=h.anchors[Math.abs(i.aim.x-160)>=26?"leftHand":"rightHand"],b=i.aim.x<160?f[0]-m[0]-1:m[0]-f[0];this.move(t,{x:t.x,y:Ae(34+(i.aim.x-b-160)/16,25,43)},39/16)}return}if(n.aerial&&n.aerial.controlledBy===null&&n.owner===null){let h=n.ball,f=this.anchor(t,"upperTorso",{pose:t.team===0?"signal":"orchard-signal",mirror:h.x>t.x}),m={x:h.x+h.vx*.2,y:h.y+h.vy*.2,z:h.z+h.vz*.2-54*.04};if(t.role==="outfield"&&Math.hypot((m.x-f.x)*6,(m.y-f.y)*3.2,m.z-f.z)<15){this.control(t);return}if(n.aerial.target===t.id){this.move(t,n.aerial.spot,7.2);return}}let s=this.attack(t.team),a=n.owner===null?null:n.players[n.owner];if(t.role==="keeper"){let h=s===1?3:102;this.move(t,{x:h,y:Ae(n.ball.y,27,41)},6.8);return}if(a?.id===t.id){if(n.tick>=t.decisionTick){let h=n.players.filter(m=>m.team!==t.team&&Ue(m,t)<6&&Math.abs(m.y-t.y)<3.5).sort((m,b)=>Ue(m,t)-Ue(b,t)||m.id-b.id)[0],f=h?t.y===h.y?t.slot%2?1:-1:Wu(t.y-h.y):0;t.aiCarryY=h?Ae(t.y+f*6,12,56):Ae(34+(t.home.y-34)*.3,12,56)}if(this.move(t,{x:t.x+s*10,y:t.aiCarryY??Ae(34+(t.home.y-34)*.3,12,56)},7.2),n.tick>=t.decisionTick)if(t.decisionTick=n.tick+36,this.attackProgress(t)>75)this.kick(t,"shot");else{let h=n.players.some(m=>m.team!==t.team&&(Ue(m,t)<3||Ue(m,t)<6&&(m.x-t.x)*s>0&&Math.abs(m.y-t.y)<3.5)),f=this.openOutlet(t);f&&(h||this.random()<.12)&&this.kick(t,Ue(t,f)>18&&this.random()<.25?"loft":"pass",!1,f)}return}let r=n.players.filter(h=>h.team===t.team&&h.role==="outfield"&&!h.action&&h.cooldown<=0).sort((h,f)=>Ue(h,n.ball)-Ue(f,n.ball)||h.id-f.id);if(r[0]?.id===t.id&&(!a||a.team!==t.team)){if(a&&Ue(t,a)<9&&n.tick>=t.decisionTick&&this.challengeLooksReachable(t,a)){t.decisionTick=n.tick+90,this.tackle(t);return}this.move(t,a?this.pressurePoint(t,a):n.ball,7.2),a&&Ue(t,a)<9&&n.tick>=t.decisionTick&&(t.decisionTick=n.tick+6,this.challengeLooksReachable(t,a)&&(t.decisionTick=n.tick+90,this.tackle(t)));return}if(a&&a.team!==t.team&&r[1]?.id===t.id){this.move(t,{x:a.x-s*5,y:Ae(a.y+(t.home.y<a.y?-1.5:1.5),3,65)},7.2);return}let l=a?.team===t.team?10:-4,c=Ae((n.ball.x-52.5)*.22,-12,12),u=n.players.find(h=>h.team!==t.team&&h.slot===t.slot),p={x:Ae(t.home.x+c+s*l,5,100),y:Ae(t.home.y+(n.ball.y-34)*.18,4,64)};a&&a.team!==t.team&&u&&Ue(t,u)<14&&(p={x:u.x-s*3,y:u.y}),this.move(t,p,7.2)}canChance(t){let n=this.state.players[jr(t.team)*11],i=this.attack(t.team);return this.attackProgress(t)>70&&t.y>=20&&t.y<=48&&(n.x-t.x)*i>2}beginChance(t,n=!0){let i=this.state;if(i.owner!==t.id||t.action||i.shotView)return;let s=i.players[jr(t.team)*11],a=this.attack(t.team),r=Math.max(3,(s.x-t.x)*a),o=Ae(60/r,1,12),l=a===1?105-s.x:s.x;i.shotView={direction:a,phase:"aim",shooter:t.id,keeper:s.id,team:t.team,age:0,aim:n?{x:160,y:122}:{x:60+this.random()*200,y:70+this.random()*60},depthScale:o,planeY:151-l*o},t.moving=!1,this.clear(),this.emit("shooting-camera-enter",{player:t.id,team:t.team,direction:a}),i.message="CHANCE - aim with directions, J to shoot (auto release after 1.5 seconds).",n||this.confirmChance()}confirmChance(){let t=this.state,n=t.shotView;if(!n||n.phase!=="aim")return;let i=t.players[n.shooter];if(t.owner!==i.id||i.action){this.exitShotView("possession-lost");return}n.phase="windup",n.age=0,this.clear(),this.kick(i,"shot")}exitShotView(t){let n=this.state,i=n.shotView;if(!i)return;n.shotView=null;let s=n.players[i.keeper];s?.contactView&&(s.contactView.view={pose:s.contactView.view.pose,mirror:this.attack(s.team)<0}),this.clear(),this.emit("shooting-camera-return",{reason:t,ball:{...n.ball}})}updateShotView(){let t=this.state,n=t.shotView;if(n){if(n.age++,(n.phase==="aim"||n.phase==="windup")&&t.owner!==n.shooter){this.exitShotView("possession-lost");return}if(n.phase==="aim"){let i=this.direction();n.aim.x=Ae(n.aim.x+i.x*66*Pe,32,288),n.aim.y=Ae(n.aim.y+i.y*66*Pe,32,140),n.age>=90&&this.confirmChance()}n.phase==="parry"&&n.age>=16&&this.exitShotView("parry"),n.phase==="goal"&&n.age>=45&&this.exitShotView("goal")}}control(t){let n=this.state;t.role!=="outfield"||t.action||t.cooldown||n.owner!==null||!n.aerial||n.aerial.controlledBy!==null||(t.moving=!1,t.motionAge=0,delete t.contactView,t.action={kind:"control",age:0,target:{x:0,y:0},released:!1,hit:!1,direction:{x:n.ball.x>t.x?1:-1,y:0}},t.team===0&&t.id===n.selected&&this.clear(),this.emit("upper-body-control-start",{player:t.id}),n.message="CONTROL - time the upper-body contact, then recover.")}loft(t,n,i){let s=this.state,a=n.targetPlayer===void 0?s.players.filter(h=>h.team===t.team&&h.role==="outfield"&&h.id!==t.id).sort((h,f)=>Ue(h,n.target)-Ue(f,n.target))[0]:s.players[n.targetPlayer],r=i.x>a.x,o={x:a.x,y:a.y},l=this.anchor(a,"upperTorso",{pose:a.team===0?"signal":"orchard-signal",mirror:r}),c=64/60,u=Math.pow(.995,.5),p=Pe*(1-Math.pow(u,64))/(1-u);s.ball.vx=(l.x-i.x)/p,s.ball.vy=(l.y-i.y)/p,s.ball.vz=(l.z-i.z+54*c*c)/c,s.aerial={kicker:t.id,target:a.id,spot:o,age:0,controlledBy:null},t.team===0&&(s.selected=a.id,this.clear()),s.message="LOFT - J controls at the receiver; L switches player."}step(){let t=this.state;if(t.status!=="playing")return;if(t.tick++,this.updateShotView(),t.phase==="goal"){++t.goalAge>=120&&this.kickoff(t.pendingKickoff),this.updateCamera();return}if(t.phase==="restart"){let l=t.restart;l.age++;let c=t.players[l.taker];if(l.team===1&&l.age>=60&&!c.action&&this.takeRestart(l.kind==="corner"),c.action&&(c.action.age++,c.action.kind==="throw"&&c.action.age<=12&&this.setBall(this.throwAnchor(c)),c.action.age===12)){if(c.action.kind!=="throw"){let u=this.anchor(c);c.x+=l.point.x-u.x,c.y+=l.point.y-u.y}this.release(c,c.action)}this.updateCamera();return}let n=t.shotView,i=t.players.map(l=>({position:{x:l.x,y:l.y},upper:this.anchor(l,"upperTorso"),foot:this.anchor(l),body:{...l,z:25},hands:l.role==="keeper"?["leftHand","rightHand"].map(c=>({name:c,point:this.anchor(l,c)})):[]})),s={...t.ball};for(let l of t.players){l.cooldown>0&&l.cooldown--,l.contactView&&--l.contactView.ticks<=0&&delete l.contactView;let c=l.action;if(l.keeperCycle)this.advanceKeeper(l);else if(c)if(c.age++,l.moving=!1,c.kind==="control"){if(c.age>=54){let u=this.view(l);l.action=null,l.cooldown=1,l.contactView={view:u,ticks:2},this.emit("upper-body-recovery-complete",{player:l.id,hit:c.hit})}}else if(c.kind==="stagger"){if(c.age>=24){let u=this.view(l);l.action=null,l.cooldown=1,l.contactView={view:u,ticks:2},this.emit("stagger-recovered",{player:l.id,team:l.team})}}else c.kind==="tackle"?(c.age>=8&&c.age<36&&(l.x=Ae(l.x+c.direction.x*9*Pe,Math.min(1,l.x),Math.max(104,l.x)),l.moving=!0),c.age>=84&&(l.action=null,l.cooldown=1,this.emit("recovered",{player:l.id}))):(!c.released&&!c.cancelled&&c.age>=12&&this.release(l,c),c.age>=30&&(l.action=null,l.cooldown=1));else if(t.shotView?.shooter===l.id)l.moving=!1;else if(l.id===t.selected&&l.team===0&&l.role==="outfield"){let u=this.direction();if(t.shotView?.phase==="aim"&&t.shotView.shooter===l.id){l.moving=!1;continue}this.move(l,{x:l.x+u.x*10,y:l.y+u.y*10},7.2)}else this.ai(l)}if(t.shotView&&n!==t.shotView){let l=t.players[t.shotView.keeper],c=i[l.id],u=this.view(l);c.hands=["leftHand","rightHand"].map(p=>({name:p,point:this.anchor({...l,...c.position},p,u)}))}if(t.owner!==null){let l=t.players[t.owner];this.attach(l),t.possessionTicks[l.team]++}else{let l=t.ball;l.x+=l.vx*Pe,l.y+=l.vy*Pe,l.z+=l.vz*Pe;let c=t.aerial?.controlledBy!==null&&!!t.aerial;l.vz-=(c?270:t.aerial?108:280)*Pe,t.aerial&&t.aerial.age++,c&&l.z<=1&&(l.z=1,l.vz=0),l.z<0&&(t.aerial&&t.aerial.controlledBy===null&&(this.emit("aerial-bounce"),t.aerial=null),l.z=0,l.vz=Math.abs(l.vz)>25?-l.vz*.38:0);let u=Math.pow(c?.92:l.z>1?.995:.985,Pe*30);l.vx*=u,l.vy*=u}let a=this.boundary(s,t.ball),r=[];for(let l of t.players){if(l.id===t.owner)continue;let c=l.action,u=i[l.id],p=l.id===t.lastKicker&&t.tick-t.releaseTick<24;if(l.role==="keeper"){let f=l.keeperCycle;if(f){if(f.dropped&&!f.punted&&t.owner===null&&f.age>=on.puntAge&&f.age<on.puntEnd){let d=this.view(l),g=this.anchor({...l,...u.position},"kickingFoot",d),M=this.anchor(l,"kickingFoot",d),v=Zi(Ht(g),Ht(M),Ht(s),Ht(t.ball),4);v&&r.push({...v,p:l,kind:"keeper-punt-contact",anchor:"kickingFoot",point:wi(v.anchor),ball:wi(v.ball),segment:{anchorStart:Ht(g),anchorEnd:Ht(M),ballStart:Ht(s),ballEnd:Ht(t.ball),radius:4}})}continue}if(!(this.attack(l.team)===1?t.ball.x<17:t.ball.x>88)||t.ball.y<20||t.ball.y>48||p||l.cooldown>0)continue;let b=this.view(l),y=["leftHand","rightHand"].map(d=>({name:d,point:this.anchor({...l,...u.position},d,b)}));for(let d of y){let g=t.shotView?.keeper===l.id?T=>qa(T,t.shotView):Ht,M=t.shotView?.keeper===l.id?6:7,v=Zi(g(d.point),g(this.anchor(l,d.name)),g(s),g(t.ball),M);v&&r.push({...v,p:l,kind:"save",anchor:d.name,point:t.shotView?.keeper===l.id?Dm(v.anchor,t.shotView):wi(v.anchor),ball:t.shotView?.keeper===l.id?Dm(v.ball,t.shotView):wi(v.ball),segment:{anchorStart:g(d.point),anchorEnd:g(this.anchor(l,d.name)),ballStart:g(s),ballEnd:g(t.ball),radius:M}})}continue}if(c?.kind==="control"&&c.age>=8&&c.age<20&&!c.hit&&t.aerial?.controlledBy===null){let f=Zi(Ht(u.upper),Ht(this.anchor(l,"upperTorso")),Ht(s),Ht(t.ball),5.5);f&&r.push({...f,p:l,kind:"upper-body-contact",anchor:"upperTorso",point:wi(f.anchor),ball:wi(f.ball),segment:{anchorStart:Ht(u.upper),anchorEnd:Ht(this.anchor(l,"upperTorso")),ballStart:Ht(s),ballEnd:Ht(t.ball),radius:5.5}});continue}if(c?.kind==="tackle"&&c.age>=8&&c.age<36&&!c.hit){let f=Zi(Ht(u.foot),Ht(this.anchor(l)),Ht(s),Ht(t.ball),6);f&&r.push({...f,p:l,kind:"tackle-contact",anchor:"boot",point:wi(f.anchor),ball:wi(f.ball)});let m=t.owner===null?null:t.players[t.owner];if(m&&m.team!==l.team){let b=Zi(Ht({...i[l.id].body,z:0}),Ht({...l,z:0}),Ht({...i[m.id].body,z:0}),Ht({...m,z:0}),9);b&&r.push({...b,p:l,kind:"foul",anchor:"body",point:{x:l.x,y:l.y,z:0},ball:{x:t.ball.x,y:t.ball.y,z:t.ball.z}})}continue}if(c||l.cooldown>0||p||t.owner!==null||t.ball.z>6||s.z>12)continue;let h=Zi(Ht(u.foot),Ht(this.anchor(l)),Ht(s),Ht(t.ball),7);h&&r.push({...h,p:l,kind:"receive",anchor:"foot",point:wi(h.anchor),ball:wi(h.ball)})}r.sort((l,c)=>l.fraction-c.fraction||(l.kind==="tackle-contact"?-1:c.kind==="tackle-contact"?1:l.p.id-c.p.id));let o=r[0];if(a&&(!o||a.fraction<o.fraction))this.applyBoundary(a);else if(o){let l=o.p;t.noDoubleTouch!==null&&t.noDoubleTouch!==l.id&&(t.noDoubleTouch=null);let c=o.kind!=="foul"&&t.noDoubleTouch===l.id;if(this.emit(c?"restart-double-touch":o.kind==="receive"&&t.aerial?.controlledBy===l.id?"aerial-foot-collection":o.kind,{segment:o.segment,contactSpace:t.shotView?.keeper===l.id?"goal-pixels":"pitch-pixels",attemptedContact:o.kind,player:l.id,team:l.team,pose:this.view(l).pose,mirror:this.view(l).mirror,anchor:o.anchor,worldPoint:o.point,worldBall:o.ball,distance:o.distance,fraction:o.fraction}),c)this.beginRestart("free-kick",jr(l.team),{x:l.x,y:l.y}),t.message="Second touch after restart - free kick.";else if(o.kind==="foul"){l.action.hit=!0;let u=jr(l.team),p=(this.attack(u)===1?l.x>88:l.x<17)&&l.y>20&&l.y<48;this.beginRestart(p?"penalty":"free-kick",u,p?{x:this.attack(u)===1?94:11,y:34}:{x:l.x,y:l.y})}else if(o.kind==="upper-body-contact")l.action.hit=!0,t.aerial.controlledBy=l.id,t.airContacts[l.team]++,t.lastTouch=l.team,this.setBall(o.ball),t.ball.vx=(l.action.direction.x>0?2.4:-2.4)/6,t.ball.vz=0,t.message="CONTROL CONTACT - complete recovery before collecting.";else if(o.kind==="keeper-punt-contact")this.puntKeeper(l,o.ball);else if(o.kind==="save"&&this.canSecure(l,o.ball,s))this.secureKeeper(l,o.ball);else if(o.kind==="save")l.contactView={view:this.view(l),ticks:60},t.aerial=null,t.shotView&&(t.shotView.phase="parry",t.shotView.age=0,this.emit("close-keeper-parry",{player:l.id,viewPoint:qa(this.anchor(l,o.anchor),t.shotView)})),l.contactView={view:this.view(l),ticks:60},t.saves[l.team]++,t.owner=null,t.lastTouch=l.team,t.lastKicker=l.id,t.releaseTick=t.tick,this.setBall(this.anchor(l,o.anchor)),t.ball.vx=this.attack(l.team)*12,t.ball.vy=(t.ball.y<34?-1:1)*5,t.ball.vz=40,l.cooldown=60,t.message="SAVE \u2014 live rebound.";else if(o.kind==="tackle-contact"){let u=t.owner===null?null:t.players[t.owner];l.action.hit=!0,t.aerial=null,this.exitShotView("tackle"),t.owner=null,t.lastTouch=l.team,this.setBall(this.anchor(l)),t.ball.vx=l.action.direction.x*6,t.ball.vz=22,t.lastKicker=l.id,t.releaseTick=t.tick,u&&u.team!==l.team&&(u.action&&!u.action.released&&!u.action.cancelled&&this.emit("delivery-cancelled",{player:u.id,reason:"tackled"}),u.action={kind:"stagger",age:0,target:{x:0,y:0},released:!1,hit:!1,direction:{x:u.facing==="E"?1:u.facing==="W"?-1:this.attack(u.team),y:0}},u.moving=!1,delete u.contactView,delete u.aiCarryY,this.emit("stagger-start",{player:u.id,team:u.team,tackler:l.id})),t.message="Tackle contact \u2014 recover before collecting."}else t.aerial?.controlledBy===l.id&&t.airCollections[l.team]++,t.aerial=null,this.exitShotView("possession"),t.owner=l.id,delete l.aiCarryY,l.decisionTick=Math.min(l.decisionTick,t.tick+6),t.lastTouch=l.team,t.noDoubleTouch=null,l.team===0&&(t.selected=l.id),this.attach(l),t.message=l.team===0?"HARBOUR possession \u2014 J pass / shot, K loft, L short pass.":"ORCHARD possession \u2014 J tackle, L switch."}else a&&this.applyBoundary(a);t.halfTicks++,t.halfTicks>=tS&&this.endPeriod(),this.updateCamera()}boundary(t,n){let s=[];for(let[a,r,o]of[["x",-.5,"left"],["x",105+.5,"right"],["y",-.5,"top"],["y",68+.5,"bottom"]]){let l=n[a],c=t[a];if((r<0?l<r:l>r)&&l!==c){let u=(r-c)/(l-c);u>=0&&u<=1&&s.push({fraction:u,edge:o,point:{x:t.x+(n.x-t.x)*u,y:t.y+(n.y-t.y)*u,z:t.z+(n.z-t.z)*u}})}}return s.sort((a,r)=>a.fraction-r.fraction)[0]??null}applyBoundary(t){let n=this.state,i=t.point;if(t.edge==="top"||t.edge==="bottom"){this.beginRestart("throw-in",jr(n.lastTouch),{x:Ae(i.x,1,104),y:t.edge==="top"?0:68});return}let s=t.edge==="right"==(n.half===1)?0:1,a=jr(s);if(i.y>=27.5&&i.y<=40.5&&i.z<=eS-3){n.score[s]++,n.owner=null,n.phase="goal",n.shotView&&(n.shotView.phase="goal",n.shotView.age=0),n.goalAge=0,n.pendingKickoff=a,this.clear();for(let r of n.players)r.action=null,delete r.keeperCycle,r.moving=!1;this.setBall(i),this.emit("goal",{team:s,score:[...n.score]}),n.message=`GOAL ${s===0?"HARBOUR":"ORCHARD"} \u2014 ${n.score[0]} : ${n.score[1]}`}else n.lastTouch===a?this.beginRestart("corner",s,{x:t.edge==="right"?104.5:.5,y:i.y<34?.5:67.5}):this.beginRestart("goal-kick",a,{x:t.edge==="right"?99:6,y:34})}endPeriod(){let t=this.state;this.exitShotView("whistle"),t.aerial=null,this.clear(),t.owner=null,t.restart=null,t.noDoubleTouch=null;for(let n of t.players)n.action=null,delete n.keeperCycle,delete n.contactView,n.moving=!1;Object.assign(t.ball,{vx:0,vy:0,vz:0}),t.half===1?(t.status="halftime",t.message=`HALFTIME ${t.score[0]} : ${t.score[1]} \u2014 Continue to switch ends.`,this.emit("halftime")):(t.status="complete",t.message=`FULL TIME ${t.score[0]} : ${t.score[1]} \u2014 ${t.score[0]===t.score[1]?"DRAW":t.score[0]>t.score[1]?"HARBOUR WINS":"ORCHARD WINS"}.`,this.emit("fulltime"))}updateCamera(){let t=this.state,n=Ai(t.ball),i=t.owner===null?n:Ai(t.players[t.owner]);t.camera.x=Ae(Math.round(i.x-160),0,406),t.camera.y=Ae(Math.round(i.y-132),0,110)}},Wu=e=>e>=0?1:-1;var TS=0,ag=1,ES=2;var Kl=1,AS=2,xo=3,xa=0,wn=1,vi=2,ts=0,So=1,rg=2,og=3,lg=4,wS=5;var tr=100,CS=101,RS=102,DS=103,US=104,NS=200,LS=201,OS=202,IS=203,cg=204,ug=205,PS=206,BS=207,zS=208,FS=209,VS=210,HS=211,kS=212,GS=213,WS=214,dh=0,ph=1,mh=2,po=3,gh=4,yh=5,_h=6,vh=7,hg=0,XS=1,qS=2,Li=0,fg=1,dg=2,pg=3,mg=4,gg=5,yg=6,_g=7;var vg=300,Sa=301,er=302,Xh=303,qh=304,Ql=306,xh=1e3,Ki=1001,Sh=1002,He=1003,YS=1004;var jl=1005;var pn=1006,Yh=1007;var ba=1008;var ni=1009,xg=1010,Sg=1011,bo=1012,Zh=1013,Oi=1014,Ii=1015,Pi=1016,Jh=1017,Kh=1018,Mo=1020,bg=35902,Mg=35899,Tg=1021,Eg=1022,xi=1023,Qi=1026,Ma=1027,Ag=1028,Qh=1029,Ta=1030,jh=1031;var $h=1033,$l=33776,tc=33777,ec=33778,nc=33779,tf=35840,ef=35841,nf=35842,sf=35843,af=36196,rf=37492,of=37496,lf=37488,cf=37489,ic=37490,uf=37491,hf=37808,ff=37809,df=37810,pf=37811,mf=37812,gf=37813,yf=37814,_f=37815,vf=37816,xf=37817,Sf=37818,bf=37819,Mf=37820,Tf=37821,Ef=36492,Af=36494,wf=36495,Cf=36283,Rf=36284,sc=36285,Df=36286;var Ol=2300,bh=2301,hh=2302,$m=2303,tg=2400,eg=2401,ng=2402;var ZS=3200;var wg=0,JS=1,Rs="",xn="srgb",Il="srgb-linear",Pl="linear",oe="srgb";var fh=7680;var KS=519,QS=512,jS=513,$S=514,Uf=515,tb=516,eb=517,Nf=518,nb=519,ib=35044;var Cg="300 es",Ni=2e3,Bl=2001;function tE(e){for(let t=e.length-1;t>=0;--t)if(e[t]>=65535)return!0;return!1}function eE(e){return ArrayBuffer.isView(e)&&!(e instanceof DataView)}function zl(e){return document.createElementNS("http://www.w3.org/1999/xhtml",e)}function sb(){let e=zl("canvas");return e.style.display="block",e}var aS={},mo=null;function Rg(...e){let t="THREE."+e.shift();mo?mo("log",t,...e):console.log(t,...e)}function ab(e){let t=e[0];if(typeof t=="string"&&t.startsWith("TSL:")){let n=e[1];n&&n.isStackTrace?e[0]+=" "+n.getLocation():e[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return e}function Rt(...e){e=ab(e);let t="THREE."+e.shift();if(mo)mo("warn",t,...e);else{let n=e[0];n&&n.isStackTrace?console.warn(n.getError(t)):console.warn(t,...e)}}function Ut(...e){e=ab(e);let t="THREE."+e.shift();if(mo)mo("error",t,...e);else{let n=e[0];n&&n.isStackTrace?console.error(n.getError(t)):console.error(t,...e)}}function Qa(...e){let t=e.join(" ");t in aS||(aS[t]=!0,Rt(...e))}function rb(e,t,n){return new Promise(function(i,s){function a(){switch(e.clientWaitSync(t,e.SYNC_FLUSH_COMMANDS_BIT,0)){case e.WAIT_FAILED:s();break;case e.TIMEOUT_EXPIRED:setTimeout(a,n);break;default:i()}}setTimeout(a,n)})}var ob={[dh]:ph,[mh]:_h,[gh]:vh,[po]:yh,[ph]:dh,[_h]:mh,[vh]:gh,[yh]:po},ji=class{addEventListener(t,n){this._listeners===void 0&&(this._listeners={});let i=this._listeners;i[t]===void 0&&(i[t]=[]),i[t].indexOf(n)===-1&&i[t].push(n)}hasEventListener(t,n){let i=this._listeners;return i===void 0?!1:i[t]!==void 0&&i[t].indexOf(n)!==-1}removeEventListener(t,n){let i=this._listeners;if(i===void 0)return;let s=i[t];if(s!==void 0){let a=s.indexOf(n);a!==-1&&s.splice(a,1)}}dispatchEvent(t){let n=this._listeners;if(n===void 0)return;let i=n[t.type];if(i!==void 0){t.target=this;let s=i.slice(0);for(let a=0,r=s.length;a<r;a++)s[a].call(this,t);t.target=null}}},_n=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];var Um=Math.PI/180,Mh=180/Math.PI;function ac(){let e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(_n[e&255]+_n[e>>8&255]+_n[e>>16&255]+_n[e>>24&255]+"-"+_n[t&255]+_n[t>>8&255]+"-"+_n[t>>16&15|64]+_n[t>>24&255]+"-"+_n[n&63|128]+_n[n>>8&255]+"-"+_n[n>>16&255]+_n[n>>24&255]+_n[i&255]+_n[i>>8&255]+_n[i>>16&255]+_n[i>>24&255]).toLowerCase()}function Kt(e,t,n){return Math.max(t,Math.min(n,e))}function nE(e,t){return(e%t+t)%t}function Nm(e,t,n){return(1-n)*e+n*t}function Rl(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return e/4294967295;case Uint16Array:return e/65535;case Uint8Array:case Uint8ClampedArray:return e/255;case Int32Array:return Math.max(e/2147483647,-1);case Int16Array:return Math.max(e/32767,-1);case Int8Array:return Math.max(e/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function Bn(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return Math.round(e*4294967295);case Uint16Array:return Math.round(e*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(e*255);case Int32Array:return Math.round(e*2147483647);case Int16Array:return Math.round(e*32767);case Int8Array:return Math.round(e*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}var $t=class e{static{e.prototype.isVector2=!0}constructor(t=0,n=0){this.x=t,this.y=n}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,n){return this.x=t,this.y=n,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,n){switch(t){case 0:this.x=n;break;case 1:this.y=n;break;default:throw new Error("THREE.Vector2: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,n){return this.x=t.x+n.x,this.y=t.y+n.y,this}addScaledVector(t,n){return this.x+=t.x*n,this.y+=t.y*n,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,n){return this.x=t.x-n.x,this.y=t.y-n.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){let n=this.x,i=this.y,s=t.elements;return this.x=s[0]*n+s[3]*i+s[6],this.y=s[1]*n+s[4]*i+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,n){return this.x=Kt(this.x,t.x,n.x),this.y=Kt(this.y,t.y,n.y),this}clampScalar(t,n){return this.x=Kt(this.x,t,n),this.y=Kt(this.y,t,n),this}clampLength(t,n){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Kt(i,t,n))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){let n=Math.sqrt(this.lengthSq()*t.lengthSq());if(n===0)return Math.PI/2;let i=this.dot(t)/n;return Math.acos(Kt(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let n=this.x-t.x,i=this.y-t.y;return n*n+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,n){return this.x+=(t.x-this.x)*n,this.y+=(t.y-this.y)*n,this}lerpVectors(t,n,i){return this.x=t.x+(n.x-t.x)*i,this.y=t.y+(n.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,n=0){return this.x=t[n],this.y=t[n+1],this}toArray(t=[],n=0){return t[n]=this.x,t[n+1]=this.y,t}fromBufferAttribute(t,n){return this.x=t.getX(n),this.y=t.getY(n),this}rotateAround(t,n){let i=Math.cos(n),s=Math.sin(n),a=this.x-t.x,r=this.y-t.y;return this.x=a*i-r*s+t.x,this.y=a*s+r*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},$i=class{constructor(t=0,n=0,i=0,s=1){this.isQuaternion=!0,this._x=t,this._y=n,this._z=i,this._w=s}static slerpFlat(t,n,i,s,a,r,o){let l=i[s+0],c=i[s+1],u=i[s+2],p=i[s+3],h=a[r+0],f=a[r+1],m=a[r+2],b=a[r+3];if(p!==b||l!==h||c!==f||u!==m){let y=l*h+c*f+u*m+p*b;y<0&&(h=-h,f=-f,m=-m,b=-b,y=-y);let d=1-o;if(y<.9995){let g=Math.acos(y),M=Math.sin(g);d=Math.sin(d*g)/M,o=Math.sin(o*g)/M,l=l*d+h*o,c=c*d+f*o,u=u*d+m*o,p=p*d+b*o}else{l=l*d+h*o,c=c*d+f*o,u=u*d+m*o,p=p*d+b*o;let g=1/Math.sqrt(l*l+c*c+u*u+p*p);l*=g,c*=g,u*=g,p*=g}}t[n]=l,t[n+1]=c,t[n+2]=u,t[n+3]=p}static multiplyQuaternionsFlat(t,n,i,s,a,r){let o=i[s],l=i[s+1],c=i[s+2],u=i[s+3],p=a[r],h=a[r+1],f=a[r+2],m=a[r+3];return t[n]=o*m+u*p+l*f-c*h,t[n+1]=l*m+u*h+c*p-o*f,t[n+2]=c*m+u*f+o*h-l*p,t[n+3]=u*m-o*p-l*h-c*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,n,i,s){return this._x=t,this._y=n,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,n=!0){let i=t._x,s=t._y,a=t._z,r=t._order,o=Math.cos,l=Math.sin,c=o(i/2),u=o(s/2),p=o(a/2),h=l(i/2),f=l(s/2),m=l(a/2);switch(r){case"XYZ":this._x=h*u*p+c*f*m,this._y=c*f*p-h*u*m,this._z=c*u*m+h*f*p,this._w=c*u*p-h*f*m;break;case"YXZ":this._x=h*u*p+c*f*m,this._y=c*f*p-h*u*m,this._z=c*u*m-h*f*p,this._w=c*u*p+h*f*m;break;case"ZXY":this._x=h*u*p-c*f*m,this._y=c*f*p+h*u*m,this._z=c*u*m+h*f*p,this._w=c*u*p-h*f*m;break;case"ZYX":this._x=h*u*p-c*f*m,this._y=c*f*p+h*u*m,this._z=c*u*m-h*f*p,this._w=c*u*p+h*f*m;break;case"YZX":this._x=h*u*p+c*f*m,this._y=c*f*p+h*u*m,this._z=c*u*m-h*f*p,this._w=c*u*p-h*f*m;break;case"XZY":this._x=h*u*p-c*f*m,this._y=c*f*p-h*u*m,this._z=c*u*m+h*f*p,this._w=c*u*p+h*f*m;break;default:Rt("Quaternion: .setFromEuler() encountered an unknown order: "+r)}return n===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,n){let i=n/2,s=Math.sin(i);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(t){let n=t.elements,i=n[0],s=n[4],a=n[8],r=n[1],o=n[5],l=n[9],c=n[2],u=n[6],p=n[10],h=i+o+p;if(h>0){let f=.5/Math.sqrt(h+1);this._w=.25/f,this._x=(u-l)*f,this._y=(a-c)*f,this._z=(r-s)*f}else if(i>o&&i>p){let f=2*Math.sqrt(1+i-o-p);this._w=(u-l)/f,this._x=.25*f,this._y=(s+r)/f,this._z=(a+c)/f}else if(o>p){let f=2*Math.sqrt(1+o-i-p);this._w=(a-c)/f,this._x=(s+r)/f,this._y=.25*f,this._z=(l+u)/f}else{let f=2*Math.sqrt(1+p-i-o);this._w=(r-s)/f,this._x=(a+c)/f,this._y=(l+u)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,n){let i=t.dot(n)+1;return i<1e-8?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*n.z-t.z*n.y,this._y=t.z*n.x-t.x*n.z,this._z=t.x*n.y-t.y*n.x,this._w=i),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Kt(this.dot(t),-1,1)))}rotateTowards(t,n){let i=this.angleTo(t);if(i===0)return this;let s=Math.min(1,n/i);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,n){let i=t._x,s=t._y,a=t._z,r=t._w,o=n._x,l=n._y,c=n._z,u=n._w;return this._x=i*u+r*o+s*c-a*l,this._y=s*u+r*l+a*o-i*c,this._z=a*u+r*c+i*l-s*o,this._w=r*u-i*o-s*l-a*c,this._onChangeCallback(),this}slerp(t,n){let i=t._x,s=t._y,a=t._z,r=t._w,o=this.dot(t);o<0&&(i=-i,s=-s,a=-a,r=-r,o=-o);let l=1-n;if(o<.9995){let c=Math.acos(o),u=Math.sin(c);l=Math.sin(l*c)/u,n=Math.sin(n*c)/u,this._x=this._x*l+i*n,this._y=this._y*l+s*n,this._z=this._z*l+a*n,this._w=this._w*l+r*n,this._onChangeCallback()}else this._x=this._x*l+i*n,this._y=this._y*l+s*n,this._z=this._z*l+a*n,this._w=this._w*l+r*n,this.normalize();return this}slerpQuaternions(t,n,i){return this.copy(t).slerp(n,i)}random(){let t=2*Math.PI*Math.random(),n=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),a=Math.sqrt(i);return this.set(s*Math.sin(t),s*Math.cos(t),a*Math.sin(n),a*Math.cos(n))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,n=0){return this._x=t[n],this._y=t[n+1],this._z=t[n+2],this._w=t[n+3],this._onChangeCallback(),this}toArray(t=[],n=0){return t[n]=this._x,t[n+1]=this._y,t[n+2]=this._z,t[n+3]=this._w,t}fromBufferAttribute(t,n){return this._x=t.getX(n),this._y=t.getY(n),this._z=t.getZ(n),this._w=t.getW(n),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},V=class e{static{e.prototype.isVector3=!0}constructor(t=0,n=0,i=0){this.x=t,this.y=n,this.z=i}set(t,n,i){return i===void 0&&(i=this.z),this.x=t,this.y=n,this.z=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,n){switch(t){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;default:throw new Error("THREE.Vector3: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,n){return this.x=t.x+n.x,this.y=t.y+n.y,this.z=t.z+n.z,this}addScaledVector(t,n){return this.x+=t.x*n,this.y+=t.y*n,this.z+=t.z*n,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,n){return this.x=t.x-n.x,this.y=t.y-n.y,this.z=t.z-n.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,n){return this.x=t.x*n.x,this.y=t.y*n.y,this.z=t.z*n.z,this}applyEuler(t){return this.applyQuaternion(rS.setFromEuler(t))}applyAxisAngle(t,n){return this.applyQuaternion(rS.setFromAxisAngle(t,n))}applyMatrix3(t){let n=this.x,i=this.y,s=this.z,a=t.elements;return this.x=a[0]*n+a[3]*i+a[6]*s,this.y=a[1]*n+a[4]*i+a[7]*s,this.z=a[2]*n+a[5]*i+a[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){let n=this.x,i=this.y,s=this.z,a=t.elements,r=1/(a[3]*n+a[7]*i+a[11]*s+a[15]);return this.x=(a[0]*n+a[4]*i+a[8]*s+a[12])*r,this.y=(a[1]*n+a[5]*i+a[9]*s+a[13])*r,this.z=(a[2]*n+a[6]*i+a[10]*s+a[14])*r,this}applyQuaternion(t){let n=this.x,i=this.y,s=this.z,a=t.x,r=t.y,o=t.z,l=t.w,c=2*(r*s-o*i),u=2*(o*n-a*s),p=2*(a*i-r*n);return this.x=n+l*c+r*p-o*u,this.y=i+l*u+o*c-a*p,this.z=s+l*p+a*u-r*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){let n=this.x,i=this.y,s=this.z,a=t.elements;return this.x=a[0]*n+a[4]*i+a[8]*s,this.y=a[1]*n+a[5]*i+a[9]*s,this.z=a[2]*n+a[6]*i+a[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,n){return this.x=Kt(this.x,t.x,n.x),this.y=Kt(this.y,t.y,n.y),this.z=Kt(this.z,t.z,n.z),this}clampScalar(t,n){return this.x=Kt(this.x,t,n),this.y=Kt(this.y,t,n),this.z=Kt(this.z,t,n),this}clampLength(t,n){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Kt(i,t,n))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,n){return this.x+=(t.x-this.x)*n,this.y+=(t.y-this.y)*n,this.z+=(t.z-this.z)*n,this}lerpVectors(t,n,i){return this.x=t.x+(n.x-t.x)*i,this.y=t.y+(n.y-t.y)*i,this.z=t.z+(n.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,n){let i=t.x,s=t.y,a=t.z,r=n.x,o=n.y,l=n.z;return this.x=s*l-a*o,this.y=a*r-i*l,this.z=i*o-s*r,this}projectOnVector(t){let n=t.lengthSq();if(n===0)return this.set(0,0,0);let i=t.dot(this)/n;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return Lm.copy(this).projectOnVector(t),this.sub(Lm)}reflect(t){return this.sub(Lm.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){let n=Math.sqrt(this.lengthSq()*t.lengthSq());if(n===0)return Math.PI/2;let i=this.dot(t)/n;return Math.acos(Kt(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let n=this.x-t.x,i=this.y-t.y,s=this.z-t.z;return n*n+i*i+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,n,i){let s=Math.sin(n)*t;return this.x=s*Math.sin(i),this.y=Math.cos(n)*t,this.z=s*Math.cos(i),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,n,i){return this.x=t*Math.sin(n),this.y=i,this.z=t*Math.cos(n),this}setFromMatrixPosition(t){let n=t.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this}setFromMatrixScale(t){let n=this.setFromMatrixColumn(t,0).length(),i=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=n,this.y=i,this.z=s,this}setFromMatrixColumn(t,n){return this.fromArray(t.elements,n*4)}setFromMatrix3Column(t,n){return this.fromArray(t.elements,n*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,n=0){return this.x=t[n],this.y=t[n+1],this.z=t[n+2],this}toArray(t=[],n=0){return t[n]=this.x,t[n+1]=this.y,t[n+2]=this.z,t}fromBufferAttribute(t,n){return this.x=t.getX(n),this.y=t.getY(n),this.z=t.getZ(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let t=Math.random()*Math.PI*2,n=Math.random()*2-1,i=Math.sqrt(1-n*n);return this.x=i*Math.cos(t),this.y=n,this.z=i*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},Lm=new V,rS=new $i,Nt=class e{static{e.prototype.isMatrix3=!0}constructor(t,n,i,s,a,r,o,l,c){this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,n,i,s,a,r,o,l,c)}set(t,n,i,s,a,r,o,l,c){let u=this.elements;return u[0]=t,u[1]=s,u[2]=o,u[3]=n,u[4]=a,u[5]=l,u[6]=i,u[7]=r,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){let n=this.elements,i=t.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],this}extractBasis(t,n,i){return t.setFromMatrix3Column(this,0),n.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){let n=t.elements;return this.set(n[0],n[4],n[8],n[1],n[5],n[9],n[2],n[6],n[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,n){let i=t.elements,s=n.elements,a=this.elements,r=i[0],o=i[3],l=i[6],c=i[1],u=i[4],p=i[7],h=i[2],f=i[5],m=i[8],b=s[0],y=s[3],d=s[6],g=s[1],M=s[4],v=s[7],T=s[2],E=s[5],w=s[8];return a[0]=r*b+o*g+l*T,a[3]=r*y+o*M+l*E,a[6]=r*d+o*v+l*w,a[1]=c*b+u*g+p*T,a[4]=c*y+u*M+p*E,a[7]=c*d+u*v+p*w,a[2]=h*b+f*g+m*T,a[5]=h*y+f*M+m*E,a[8]=h*d+f*v+m*w,this}multiplyScalar(t){let n=this.elements;return n[0]*=t,n[3]*=t,n[6]*=t,n[1]*=t,n[4]*=t,n[7]*=t,n[2]*=t,n[5]*=t,n[8]*=t,this}determinant(){let t=this.elements,n=t[0],i=t[1],s=t[2],a=t[3],r=t[4],o=t[5],l=t[6],c=t[7],u=t[8];return n*r*u-n*o*c-i*a*u+i*o*l+s*a*c-s*r*l}invert(){let t=this.elements,n=t[0],i=t[1],s=t[2],a=t[3],r=t[4],o=t[5],l=t[6],c=t[7],u=t[8],p=u*r-o*c,h=o*l-u*a,f=c*a-r*l,m=n*p+i*h+s*f;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);let b=1/m;return t[0]=p*b,t[1]=(s*c-u*i)*b,t[2]=(o*i-s*r)*b,t[3]=h*b,t[4]=(u*n-s*l)*b,t[5]=(s*a-o*n)*b,t[6]=f*b,t[7]=(i*l-c*n)*b,t[8]=(r*n-i*a)*b,this}transpose(){let t,n=this.elements;return t=n[1],n[1]=n[3],n[3]=t,t=n[2],n[2]=n[6],n[6]=t,t=n[5],n[5]=n[7],n[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){let n=this.elements;return t[0]=n[0],t[1]=n[3],t[2]=n[6],t[3]=n[1],t[4]=n[4],t[5]=n[7],t[6]=n[2],t[7]=n[5],t[8]=n[8],this}setUvTransform(t,n,i,s,a,r,o){let l=Math.cos(a),c=Math.sin(a);return this.set(i*l,i*c,-i*(l*r+c*o)+r+t,-s*c,s*l,-s*(-c*r+l*o)+o+n,0,0,1),this}scale(t,n){return Qa("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(Om.makeScale(t,n)),this}rotate(t){return Qa("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(Om.makeRotation(-t)),this}translate(t,n){return Qa("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(Om.makeTranslation(t,n)),this}makeTranslation(t,n){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,n,0,0,1),this}makeRotation(t){let n=Math.cos(t),i=Math.sin(t);return this.set(n,-i,0,i,n,0,0,0,1),this}makeScale(t,n){return this.set(t,0,0,0,n,0,0,0,1),this}equals(t){let n=this.elements,i=t.elements;for(let s=0;s<9;s++)if(n[s]!==i[s])return!1;return!0}fromArray(t,n=0){for(let i=0;i<9;i++)this.elements[i]=t[i+n];return this}toArray(t=[],n=0){let i=this.elements;return t[n]=i[0],t[n+1]=i[1],t[n+2]=i[2],t[n+3]=i[3],t[n+4]=i[4],t[n+5]=i[5],t[n+6]=i[6],t[n+7]=i[7],t[n+8]=i[8],t}clone(){return new this.constructor().fromArray(this.elements)}},Om=new Nt,oS=new Nt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),lS=new Nt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function iE(){let e={enabled:!0,workingColorSpace:Il,spaces:{},convert:function(s,a,r){return this.enabled===!1||a===r||!a||!r||(this.spaces[a].transfer===oe&&(s.r=Cs(s.r),s.g=Cs(s.g),s.b=Cs(s.b)),this.spaces[a].primaries!==this.spaces[r].primaries&&(s.applyMatrix3(this.spaces[a].toXYZ),s.applyMatrix3(this.spaces[r].fromXYZ)),this.spaces[r].transfer===oe&&(s.r=fo(s.r),s.g=fo(s.g),s.b=fo(s.b))),s},workingToColorSpace:function(s,a){return this.convert(s,this.workingColorSpace,a)},colorSpaceToWorking:function(s,a){return this.convert(s,a,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Rs?Pl:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,a=this.workingColorSpace){return s.fromArray(this.spaces[a].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,a,r){return s.copy(this.spaces[a].toXYZ).multiply(this.spaces[r].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,a){return Qa("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),e.workingToColorSpace(s,a)},toWorkingColorSpace:function(s,a){return Qa("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),e.colorSpaceToWorking(s,a)}},t=[.64,.33,.3,.6,.15,.06],n=[.2126,.7152,.0722],i=[.3127,.329];return e.define({[Il]:{primaries:t,whitePoint:i,transfer:Pl,toXYZ:oS,fromXYZ:lS,luminanceCoefficients:n,workingColorSpaceConfig:{unpackColorSpace:xn},outputColorSpaceConfig:{drawingBufferColorSpace:xn}},[xn]:{primaries:t,whitePoint:i,transfer:oe,toXYZ:oS,fromXYZ:lS,luminanceCoefficients:n,outputColorSpaceConfig:{drawingBufferColorSpace:xn}}}),e}var Zt=iE();function Cs(e){return e<.04045?e*.0773993808:Math.pow(e*.9478672986+.0521327014,2.4)}function fo(e){return e<.0031308?e*12.92:1.055*Math.pow(e,.41666)-.055}var $r,Th=class{static getDataURL(t,n="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let i;if(t instanceof HTMLCanvasElement)i=t;else{$r===void 0&&($r=zl("canvas")),$r.width=t.width,$r.height=t.height;let s=$r.getContext("2d");t instanceof ImageData?s.putImageData(t,0,0):s.drawImage(t,0,0,t.width,t.height),i=$r}return i.toDataURL(n)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){let n=zl("canvas");n.width=t.width,n.height=t.height;let i=n.getContext("2d");i.drawImage(t,0,0,t.width,t.height);let s=i.getImageData(0,0,t.width,t.height),a=s.data;for(let r=0;r<a.length;r++)a[r]=Cs(a[r]/255)*255;return i.putImageData(s,0,0),n}else if(t.data){let n=t.data.slice(0);for(let i=0;i<n.length;i++)n instanceof Uint8Array||n instanceof Uint8ClampedArray?n[i]=Math.floor(Cs(n[i]/255)*255):n[i]=Cs(n[i]);return{data:n,width:t.width,height:t.height}}else return Rt("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}},sE=0,go=class{constructor(t=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:sE++}),this.uuid=ac(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){let n=this.data;return typeof HTMLVideoElement<"u"&&n instanceof HTMLVideoElement?t.set(n.videoWidth,n.videoHeight,0):typeof VideoFrame<"u"&&n instanceof VideoFrame?t.set(n.displayWidth,n.displayHeight,0):n!==null?t.set(n.width,n.height,n.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){let n=t===void 0||typeof t=="string";if(!n&&t.images[this.uuid]!==void 0)return t.images[this.uuid];let i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let a;if(Array.isArray(s)){a=[];for(let r=0,o=s.length;r<o;r++)s[r].isDataTexture?a.push(Im(s[r].image)):a.push(Im(s[r]))}else a=Im(s);i.url=a}return n||(t.images[this.uuid]=i),i}};function Im(e){return typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap?Th.getDataURL(e):e.data?{data:Array.from(e.data),width:e.width,height:e.height,type:e.data.constructor.name}:(Rt("Texture: Unable to serialize Texture."),{})}var aE=0,Pm=new V,Sn=class e extends ji{constructor(t=e.DEFAULT_IMAGE,n=e.DEFAULT_MAPPING,i=Ki,s=Ki,a=pn,r=ba,o=xi,l=ni,c=e.DEFAULT_ANISOTROPY,u=Rs){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:aE++}),this.uuid=ac(),this.name="",this.source=new go(t),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=a,this.minFilter=r,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new $t(0,0),this.repeat=new $t(1,1),this.center=new $t(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Nt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Pm).x}get height(){return this.source.getSize(Pm).y}get depth(){return this.source.getSize(Pm).z}get image(){return this.source.data}set image(t){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,n){this.updateRanges.push({start:t,count:n})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.normalized=t.normalized,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(let n in t){let i=t[n];if(i===void 0){Rt(`Texture.setValues(): parameter '${n}' has value of undefined.`);continue}let s=this[n];if(s===void 0){Rt(`Texture.setValues(): property '${n}' does not exist.`);continue}s&&i&&s.isVector2&&i.isVector2||s&&i&&s.isVector3&&i.isVector3||s&&i&&s.isMatrix3&&i.isMatrix3?s.copy(i):this[n]=i}}toJSON(t){let n=t===void 0||typeof t=="string";if(!n&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];let i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),n||(t.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==vg)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case xh:t.x=t.x-Math.floor(t.x);break;case Ki:t.x=t.x<0?0:1;break;case Sh:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case xh:t.y=t.y-Math.floor(t.y);break;case Ki:t.y=t.y<0?0:1;break;case Sh:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}};Sn.DEFAULT_IMAGE=null;Sn.DEFAULT_MAPPING=vg;Sn.DEFAULT_ANISOTROPY=1;var Le=class e{static{e.prototype.isVector4=!0}constructor(t=0,n=0,i=0,s=1){this.x=t,this.y=n,this.z=i,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,n,i,s){return this.x=t,this.y=n,this.z=i,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,n){switch(t){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;case 3:this.w=n;break;default:throw new Error("THREE.Vector4: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,n){return this.x=t.x+n.x,this.y=t.y+n.y,this.z=t.z+n.z,this.w=t.w+n.w,this}addScaledVector(t,n){return this.x+=t.x*n,this.y+=t.y*n,this.z+=t.z*n,this.w+=t.w*n,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,n){return this.x=t.x-n.x,this.y=t.y-n.y,this.z=t.z-n.z,this.w=t.w-n.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){let n=this.x,i=this.y,s=this.z,a=this.w,r=t.elements;return this.x=r[0]*n+r[4]*i+r[8]*s+r[12]*a,this.y=r[1]*n+r[5]*i+r[9]*s+r[13]*a,this.z=r[2]*n+r[6]*i+r[10]*s+r[14]*a,this.w=r[3]*n+r[7]*i+r[11]*s+r[15]*a,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);let n=Math.sqrt(1-t.w*t.w);return n<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/n,this.y=t.y/n,this.z=t.z/n),this}setAxisAngleFromRotationMatrix(t){let n,i,s,a,l=t.elements,c=l[0],u=l[4],p=l[8],h=l[1],f=l[5],m=l[9],b=l[2],y=l[6],d=l[10];if(Math.abs(u-h)<.01&&Math.abs(p-b)<.01&&Math.abs(m-y)<.01){if(Math.abs(u+h)<.1&&Math.abs(p+b)<.1&&Math.abs(m+y)<.1&&Math.abs(c+f+d-3)<.1)return this.set(1,0,0,0),this;n=Math.PI;let M=(c+1)/2,v=(f+1)/2,T=(d+1)/2,E=(u+h)/4,w=(p+b)/4,x=(m+y)/4;return M>v&&M>T?M<.01?(i=0,s=.707106781,a=.707106781):(i=Math.sqrt(M),s=E/i,a=w/i):v>T?v<.01?(i=.707106781,s=0,a=.707106781):(s=Math.sqrt(v),i=E/s,a=x/s):T<.01?(i=.707106781,s=.707106781,a=0):(a=Math.sqrt(T),i=w/a,s=x/a),this.set(i,s,a,n),this}let g=Math.sqrt((y-m)*(y-m)+(p-b)*(p-b)+(h-u)*(h-u));return Math.abs(g)<.001&&(g=1),this.x=(y-m)/g,this.y=(p-b)/g,this.z=(h-u)/g,this.w=Math.acos((c+f+d-1)/2),this}setFromMatrixPosition(t){let n=t.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this.w=n[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,n){return this.x=Kt(this.x,t.x,n.x),this.y=Kt(this.y,t.y,n.y),this.z=Kt(this.z,t.z,n.z),this.w=Kt(this.w,t.w,n.w),this}clampScalar(t,n){return this.x=Kt(this.x,t,n),this.y=Kt(this.y,t,n),this.z=Kt(this.z,t,n),this.w=Kt(this.w,t,n),this}clampLength(t,n){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Kt(i,t,n))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,n){return this.x+=(t.x-this.x)*n,this.y+=(t.y-this.y)*n,this.z+=(t.z-this.z)*n,this.w+=(t.w-this.w)*n,this}lerpVectors(t,n,i){return this.x=t.x+(n.x-t.x)*i,this.y=t.y+(n.y-t.y)*i,this.z=t.z+(n.z-t.z)*i,this.w=t.w+(n.w-t.w)*i,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,n=0){return this.x=t[n],this.y=t[n+1],this.z=t[n+2],this.w=t[n+3],this}toArray(t=[],n=0){return t[n]=this.x,t[n+1]=this.y,t[n+2]=this.z,t[n+3]=this.w,t}fromBufferAttribute(t,n){return this.x=t.getX(n),this.y=t.getY(n),this.z=t.getZ(n),this.w=t.getW(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Eh=class extends ji{constructor(t=1,n=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:pn,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},i),this.isRenderTarget=!0,this.width=t,this.height=n,this.depth=i.depth,this.scissor=new Le(0,0,t,n),this.scissorTest=!1,this.viewport=new Le(0,0,t,n),this.textures=[];let s={width:t,height:n,depth:i.depth},a=new Sn(s),r=i.count;for(let o=0;o<r;o++)this.textures[o]=a.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveColorBuffer=i.resolveColorBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.storeMultisampledColorBuffer=i.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=i.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=i.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview,this.useArrayDepthTexture=i.useArrayDepthTexture}_setTextureOptions(t={}){let n={minFilter:pn,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(n.mapping=t.mapping),t.wrapS!==void 0&&(n.wrapS=t.wrapS),t.wrapT!==void 0&&(n.wrapT=t.wrapT),t.wrapR!==void 0&&(n.wrapR=t.wrapR),t.magFilter!==void 0&&(n.magFilter=t.magFilter),t.minFilter!==void 0&&(n.minFilter=t.minFilter),t.format!==void 0&&(n.format=t.format),t.type!==void 0&&(n.type=t.type),t.anisotropy!==void 0&&(n.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(n.colorSpace=t.colorSpace),t.flipY!==void 0&&(n.flipY=t.flipY),t.generateMipmaps!==void 0&&(n.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(n.internalFormat=t.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(n)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),t!==null&&t.renderTarget===null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,n,i=1){if(this.width!==t||this.height!==n||this.depth!==i){this.width=t,this.height=n,this.depth=i;for(let s=0,a=this.textures.length;s<a;s++)this.textures[s].image.width=t,this.textures[s].image.height=n,this.textures[s].image.depth=i,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,t,n),this.scissor.set(0,0,t,n)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let n=0,i=t.textures.length;n<i;n++){this.textures[n]=t.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0,this.textures[n].renderTarget=this;let s=Object.assign({},t.textures[n].image);this.textures[n].source=new go(s)}if(this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveColorBuffer=t.resolveColorBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,this.storeMultisampledColorBuffer=t.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=t.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=t.storeMultisampledStencilBuffer,t.depthTexture!==null)if(t.depthTexture.renderTarget===t){let n=t.depthTexture.clone();n.renderTarget=null,this.depthTexture=n}else this.depthTexture=t.depthTexture;return this.samples=t.samples,this.multiview=t.multiview,this.useArrayDepthTexture=t.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}},Fn=class extends Eh{constructor(t=1,n=1,i={}){super(t,n,i),this.isWebGLRenderTarget=!0}},Fl=class extends Sn{constructor(t=null,n=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:n,height:i,depth:s},this.magFilter=He,this.minFilter=He,this.wrapR=Ki,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(t){return super.copy(t),this.wrapR=t.wrapR,this}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}};var Ah=class extends Sn{constructor(t=null,n=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:n,height:i,depth:s},this.magFilter=He,this.minFilter=He,this.wrapR=Ki,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(t){return super.copy(t),this.wrapR=t.wrapR,this}};var Ve=class e{static{e.prototype.isMatrix4=!0}constructor(t,n,i,s,a,r,o,l,c,u,p,h,f,m,b,y){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,n,i,s,a,r,o,l,c,u,p,h,f,m,b,y)}set(t,n,i,s,a,r,o,l,c,u,p,h,f,m,b,y){let d=this.elements;return d[0]=t,d[4]=n,d[8]=i,d[12]=s,d[1]=a,d[5]=r,d[9]=o,d[13]=l,d[2]=c,d[6]=u,d[10]=p,d[14]=h,d[3]=f,d[7]=m,d[11]=b,d[15]=y,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new e().fromArray(this.elements)}copy(t){let n=this.elements,i=t.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],n[9]=i[9],n[10]=i[10],n[11]=i[11],n[12]=i[12],n[13]=i[13],n[14]=i[14],n[15]=i[15],this}copyPosition(t){let n=this.elements,i=t.elements;return n[12]=i[12],n[13]=i[13],n[14]=i[14],this}setFromMatrix3(t){let n=t.elements;return this.set(n[0],n[3],n[6],0,n[1],n[4],n[7],0,n[2],n[5],n[8],0,0,0,0,1),this}extractBasis(t,n,i){return this.determinantAffine()===0?(t.set(1,0,0),n.set(0,1,0),i.set(0,0,1),this):(t.setFromMatrixColumn(this,0),n.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(t,n,i){return this.set(t.x,n.x,i.x,0,t.y,n.y,i.y,0,t.z,n.z,i.z,0,0,0,0,1),this}extractRotation(t){if(t.determinantAffine()===0)return this.identity();let n=this.elements,i=t.elements,s=1/to.setFromMatrixColumn(t,0).length(),a=1/to.setFromMatrixColumn(t,1).length(),r=1/to.setFromMatrixColumn(t,2).length();return n[0]=i[0]*s,n[1]=i[1]*s,n[2]=i[2]*s,n[3]=0,n[4]=i[4]*a,n[5]=i[5]*a,n[6]=i[6]*a,n[7]=0,n[8]=i[8]*r,n[9]=i[9]*r,n[10]=i[10]*r,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromEuler(t){let n=this.elements,i=t.x,s=t.y,a=t.z,r=Math.cos(i),o=Math.sin(i),l=Math.cos(s),c=Math.sin(s),u=Math.cos(a),p=Math.sin(a);if(t.order==="XYZ"){let h=r*u,f=r*p,m=o*u,b=o*p;n[0]=l*u,n[4]=-l*p,n[8]=c,n[1]=f+m*c,n[5]=h-b*c,n[9]=-o*l,n[2]=b-h*c,n[6]=m+f*c,n[10]=r*l}else if(t.order==="YXZ"){let h=l*u,f=l*p,m=c*u,b=c*p;n[0]=h+b*o,n[4]=m*o-f,n[8]=r*c,n[1]=r*p,n[5]=r*u,n[9]=-o,n[2]=f*o-m,n[6]=b+h*o,n[10]=r*l}else if(t.order==="ZXY"){let h=l*u,f=l*p,m=c*u,b=c*p;n[0]=h-b*o,n[4]=-r*p,n[8]=m+f*o,n[1]=f+m*o,n[5]=r*u,n[9]=b-h*o,n[2]=-r*c,n[6]=o,n[10]=r*l}else if(t.order==="ZYX"){let h=r*u,f=r*p,m=o*u,b=o*p;n[0]=l*u,n[4]=m*c-f,n[8]=h*c+b,n[1]=l*p,n[5]=b*c+h,n[9]=f*c-m,n[2]=-c,n[6]=o*l,n[10]=r*l}else if(t.order==="YZX"){let h=r*l,f=r*c,m=o*l,b=o*c;n[0]=l*u,n[4]=b-h*p,n[8]=m*p+f,n[1]=p,n[5]=r*u,n[9]=-o*u,n[2]=-c*u,n[6]=f*p+m,n[10]=h-b*p}else if(t.order==="XZY"){let h=r*l,f=r*c,m=o*l,b=o*c;n[0]=l*u,n[4]=-p,n[8]=c*u,n[1]=h*p+b,n[5]=r*u,n[9]=f*p-m,n[2]=m*p-f,n[6]=o*u,n[10]=b*p+h}return n[3]=0,n[7]=0,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromQuaternion(t){return this.compose(rE,t,oE)}lookAt(t,n,i){let s=this.elements;return Qn.subVectors(t,n),Qn.lengthSq()===0&&(Qn.z=1),Qn.normalize(),oa.crossVectors(i,Qn),oa.lengthSq()===0&&(Math.abs(i.z)===1?Qn.x+=1e-4:Qn.z+=1e-4,Qn.normalize(),oa.crossVectors(i,Qn)),oa.normalize(),qu.crossVectors(Qn,oa),s[0]=oa.x,s[4]=qu.x,s[8]=Qn.x,s[1]=oa.y,s[5]=qu.y,s[9]=Qn.y,s[2]=oa.z,s[6]=qu.z,s[10]=Qn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,n){let i=t.elements,s=n.elements,a=this.elements,r=i[0],o=i[4],l=i[8],c=i[12],u=i[1],p=i[5],h=i[9],f=i[13],m=i[2],b=i[6],y=i[10],d=i[14],g=i[3],M=i[7],v=i[11],T=i[15],E=s[0],w=s[4],x=s[8],A=s[12],R=s[1],O=s[5],z=s[9],G=s[13],L=s[2],H=s[6],J=s[10],Z=s[14],it=s[3],X=s[7],tt=s[11],nt=s[15];return a[0]=r*E+o*R+l*L+c*it,a[4]=r*w+o*O+l*H+c*X,a[8]=r*x+o*z+l*J+c*tt,a[12]=r*A+o*G+l*Z+c*nt,a[1]=u*E+p*R+h*L+f*it,a[5]=u*w+p*O+h*H+f*X,a[9]=u*x+p*z+h*J+f*tt,a[13]=u*A+p*G+h*Z+f*nt,a[2]=m*E+b*R+y*L+d*it,a[6]=m*w+b*O+y*H+d*X,a[10]=m*x+b*z+y*J+d*tt,a[14]=m*A+b*G+y*Z+d*nt,a[3]=g*E+M*R+v*L+T*it,a[7]=g*w+M*O+v*H+T*X,a[11]=g*x+M*z+v*J+T*tt,a[15]=g*A+M*G+v*Z+T*nt,this}multiplyScalar(t){let n=this.elements;return n[0]*=t,n[4]*=t,n[8]*=t,n[12]*=t,n[1]*=t,n[5]*=t,n[9]*=t,n[13]*=t,n[2]*=t,n[6]*=t,n[10]*=t,n[14]*=t,n[3]*=t,n[7]*=t,n[11]*=t,n[15]*=t,this}determinant(){let t=this.elements,n=t[0],i=t[4],s=t[8],a=t[12],r=t[1],o=t[5],l=t[9],c=t[13],u=t[2],p=t[6],h=t[10],f=t[14],m=t[3],b=t[7],y=t[11],d=t[15],g=l*f-c*h,M=o*f-c*p,v=o*h-l*p,T=r*f-c*u,E=r*h-l*u,w=r*p-o*u;return n*(b*g-y*M+d*v)-i*(m*g-y*T+d*E)+s*(m*M-b*T+d*w)-a*(m*v-b*E+y*w)}determinantAffine(){let t=this.elements,n=t[0],i=t[4],s=t[8],a=t[1],r=t[5],o=t[9],l=t[2],c=t[6],u=t[10];return n*(r*u-o*c)-i*(a*u-o*l)+s*(a*c-r*l)}transpose(){let t=this.elements,n;return n=t[1],t[1]=t[4],t[4]=n,n=t[2],t[2]=t[8],t[8]=n,n=t[6],t[6]=t[9],t[9]=n,n=t[3],t[3]=t[12],t[12]=n,n=t[7],t[7]=t[13],t[13]=n,n=t[11],t[11]=t[14],t[14]=n,this}setPosition(t,n,i){let s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=n,s[14]=i),this}invert(){let t=this.elements,n=t[0],i=t[1],s=t[2],a=t[3],r=t[4],o=t[5],l=t[6],c=t[7],u=t[8],p=t[9],h=t[10],f=t[11],m=t[12],b=t[13],y=t[14],d=t[15],g=n*o-i*r,M=n*l-s*r,v=n*c-a*r,T=i*l-s*o,E=i*c-a*o,w=s*c-a*l,x=u*b-p*m,A=u*y-h*m,R=u*d-f*m,O=p*y-h*b,z=p*d-f*b,G=h*d-f*y,L=g*G-M*z+v*O+T*R-E*A+w*x;if(L===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let H=1/L;return t[0]=(o*G-l*z+c*O)*H,t[1]=(s*z-i*G-a*O)*H,t[2]=(b*w-y*E+d*T)*H,t[3]=(h*E-p*w-f*T)*H,t[4]=(l*R-r*G-c*A)*H,t[5]=(n*G-s*R+a*A)*H,t[6]=(y*v-m*w-d*M)*H,t[7]=(u*w-h*v+f*M)*H,t[8]=(r*z-o*R+c*x)*H,t[9]=(i*R-n*z-a*x)*H,t[10]=(m*E-b*v+d*g)*H,t[11]=(p*v-u*E-f*g)*H,t[12]=(o*A-r*O-l*x)*H,t[13]=(n*O-i*A+s*x)*H,t[14]=(b*M-m*T-y*g)*H,t[15]=(u*T-p*M+h*g)*H,this}scale(t){let n=this.elements,i=t.x,s=t.y,a=t.z;return n[0]*=i,n[4]*=s,n[8]*=a,n[1]*=i,n[5]*=s,n[9]*=a,n[2]*=i,n[6]*=s,n[10]*=a,n[3]*=i,n[7]*=s,n[11]*=a,this}getMaxScaleOnAxis(){let t=this.elements,n=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(n,i,s))}makeTranslation(t,n,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,n,0,0,1,i,0,0,0,1),this}makeRotationX(t){let n=Math.cos(t),i=Math.sin(t);return this.set(1,0,0,0,0,n,-i,0,0,i,n,0,0,0,0,1),this}makeRotationY(t){let n=Math.cos(t),i=Math.sin(t);return this.set(n,0,i,0,0,1,0,0,-i,0,n,0,0,0,0,1),this}makeRotationZ(t){let n=Math.cos(t),i=Math.sin(t);return this.set(n,-i,0,0,i,n,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,n){let i=Math.cos(n),s=Math.sin(n),a=1-i,r=t.x,o=t.y,l=t.z,c=a*r,u=a*o;return this.set(c*r+i,c*o-s*l,c*l+s*o,0,c*o+s*l,u*o+i,u*l-s*r,0,c*l-s*o,u*l+s*r,a*l*l+i,0,0,0,0,1),this}makeScale(t,n,i){return this.set(t,0,0,0,0,n,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,n,i,s,a,r){return this.set(1,i,a,0,t,1,r,0,n,s,1,0,0,0,0,1),this}compose(t,n,i){let s=this.elements,a=n._x,r=n._y,o=n._z,l=n._w,c=a+a,u=r+r,p=o+o,h=a*c,f=a*u,m=a*p,b=r*u,y=r*p,d=o*p,g=l*c,M=l*u,v=l*p,T=i.x,E=i.y,w=i.z;return s[0]=(1-(b+d))*T,s[1]=(f+v)*T,s[2]=(m-M)*T,s[3]=0,s[4]=(f-v)*E,s[5]=(1-(h+d))*E,s[6]=(y+g)*E,s[7]=0,s[8]=(m+M)*w,s[9]=(y-g)*w,s[10]=(1-(h+b))*w,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,n,i){let s=this.elements;t.x=s[12],t.y=s[13],t.z=s[14];let a=this.determinantAffine();if(a===0)return i.set(1,1,1),n.identity(),this;let r=to.set(s[0],s[1],s[2]).length(),o=to.set(s[4],s[5],s[6]).length(),l=to.set(s[8],s[9],s[10]).length();a<0&&(r=-r),Ci.copy(this);let c=1/r,u=1/o,p=1/l;return Ci.elements[0]*=c,Ci.elements[1]*=c,Ci.elements[2]*=c,Ci.elements[4]*=u,Ci.elements[5]*=u,Ci.elements[6]*=u,Ci.elements[8]*=p,Ci.elements[9]*=p,Ci.elements[10]*=p,n.setFromRotationMatrix(Ci),i.x=r,i.y=o,i.z=l,this}makePerspective(t,n,i,s,a,r,o=Ni,l=!1){let c=this.elements,u=2*a/(n-t),p=2*a/(i-s),h=(n+t)/(n-t),f=(i+s)/(i-s),m,b;if(l)m=a/(r-a),b=r*a/(r-a);else if(o===Ni)m=-(r+a)/(r-a),b=-2*r*a/(r-a);else if(o===Bl)m=-r/(r-a),b=-r*a/(r-a);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=u,c[4]=0,c[8]=h,c[12]=0,c[1]=0,c[5]=p,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=m,c[14]=b,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,n,i,s,a,r,o=Ni,l=!1){let c=this.elements,u=2/(n-t),p=2/(i-s),h=-(n+t)/(n-t),f=-(i+s)/(i-s),m,b;if(l)m=1/(r-a),b=r/(r-a);else if(o===Ni)m=-2/(r-a),b=-(r+a)/(r-a);else if(o===Bl)m=-1/(r-a),b=-a/(r-a);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=u,c[4]=0,c[8]=0,c[12]=h,c[1]=0,c[5]=p,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=m,c[14]=b,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){let n=this.elements,i=t.elements;for(let s=0;s<16;s++)if(n[s]!==i[s])return!1;return!0}fromArray(t,n=0){for(let i=0;i<16;i++)this.elements[i]=t[i+n];return this}toArray(t=[],n=0){let i=this.elements;return t[n]=i[0],t[n+1]=i[1],t[n+2]=i[2],t[n+3]=i[3],t[n+4]=i[4],t[n+5]=i[5],t[n+6]=i[6],t[n+7]=i[7],t[n+8]=i[8],t[n+9]=i[9],t[n+10]=i[10],t[n+11]=i[11],t[n+12]=i[12],t[n+13]=i[13],t[n+14]=i[14],t[n+15]=i[15],t}},to=new V,Ci=new Ve,rE=new V(0,0,0),oE=new V(1,1,1),oa=new V,qu=new V,Qn=new V,cS=new Ve,uS=new $i,da=class e{constructor(t=0,n=0,i=0,s=e.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=n,this._z=i,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,n,i,s=this._order){return this._x=t,this._y=n,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,n=this._order,i=!0){let s=t.elements,a=s[0],r=s[4],o=s[8],l=s[1],c=s[5],u=s[9],p=s[2],h=s[6],f=s[10];switch(n){case"XYZ":this._y=Math.asin(Kt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-u,f),this._z=Math.atan2(-r,a)):(this._x=Math.atan2(h,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Kt(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-p,a),this._z=0);break;case"ZXY":this._x=Math.asin(Kt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-p,f),this._z=Math.atan2(-r,c)):(this._y=0,this._z=Math.atan2(l,a));break;case"ZYX":this._y=Math.asin(-Kt(p,-1,1)),Math.abs(p)<.9999999?(this._x=Math.atan2(h,f),this._z=Math.atan2(l,a)):(this._x=0,this._z=Math.atan2(-r,c));break;case"YZX":this._z=Math.asin(Kt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-p,a)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-Kt(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(h,c),this._y=Math.atan2(o,a)):(this._x=Math.atan2(-u,f),this._y=0);break;default:Rt("Euler: .setFromRotationMatrix() encountered an unknown order: "+n)}return this._order=n,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,n,i){return cS.makeRotationFromQuaternion(t),this.setFromRotationMatrix(cS,n,i)}setFromVector3(t,n=this._order){return this.set(t.x,t.y,t.z,n)}reorder(t){return uS.setFromEuler(this),this.setFromQuaternion(uS,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],n=0){return t[n]=this._x,t[n+1]=this._y,t[n+2]=this._z,t[n+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};da.DEFAULT_ORDER="XYZ";var Vl=class{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}},lE=0,hS=new V,eo=new $i,Ms=new Ve,Yu=new V,Dl=new V,cE=new V,uE=new $i,fS=new V(1,0,0),dS=new V(0,1,0),pS=new V(0,0,1),mS={type:"added"},hE={type:"removed"},no={type:"childadded",child:null},Bm={type:"childremoved",child:null},yi=class e extends ji{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:lE++}),this.uuid=ac(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=e.DEFAULT_UP.clone();let t=new V,n=new da,i=new $i,s=new V(1,1,1);function a(){i.setFromEuler(n,!1)}function r(){n.setFromQuaternion(i,void 0,!1)}n._onChange(a),i._onChange(r),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Ve},normalMatrix:{value:new Nt}}),this.matrix=new Ve,this.matrixWorld=new Ve,this.matrixAutoUpdate=e.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=e.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Vl,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,n){this.quaternion.setFromAxisAngle(t,n)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,n){return eo.setFromAxisAngle(t,n),this.quaternion.multiply(eo),this}rotateOnWorldAxis(t,n){return eo.setFromAxisAngle(t,n),this.quaternion.premultiply(eo),this}rotateX(t){return this.rotateOnAxis(fS,t)}rotateY(t){return this.rotateOnAxis(dS,t)}rotateZ(t){return this.rotateOnAxis(pS,t)}translateOnAxis(t,n){return hS.copy(t).applyQuaternion(this.quaternion),this.position.add(hS.multiplyScalar(n)),this}translateX(t){return this.translateOnAxis(fS,t)}translateY(t){return this.translateOnAxis(dS,t)}translateZ(t){return this.translateOnAxis(pS,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Ms.copy(this.matrixWorld).invert())}lookAt(t,n,i){t.isVector3?Yu.copy(t):Yu.set(t,n,i);let s=this.parent;this.updateWorldMatrix(!0,!1),Dl.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Ms.lookAt(Dl,Yu,this.up):Ms.lookAt(Yu,Dl,this.up),this.quaternion.setFromRotationMatrix(Ms),s&&(Ms.extractRotation(s.matrixWorld),eo.setFromRotationMatrix(Ms),this.quaternion.premultiply(eo.invert()))}add(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.add(arguments[n]);return this}return t===this?(Ut("Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(mS),no.child=t,this.dispatchEvent(no),no.child=null):Ut("Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}let n=this.children.indexOf(t);return n!==-1&&(t.parent=null,this.children.splice(n,1),t.dispatchEvent(hE),Bm.child=t,this.dispatchEvent(Bm),Bm.child=null),this}removeFromParent(){let t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Ms.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Ms.multiply(t.parent.matrixWorld)),t.applyMatrix4(Ms),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(mS),no.child=t,this.dispatchEvent(no),no.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,n){if(this[t]===n)return this;for(let i=0,s=this.children.length;i<s;i++){let r=this.children[i].getObjectByProperty(t,n);if(r!==void 0)return r}}getObjectsByProperty(t,n,i=[]){this[t]===n&&i.push(this);let s=this.children;for(let a=0,r=s.length;a<r;a++)s[a].getObjectsByProperty(t,n,i);return i}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Dl,t,cE),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Dl,uE,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let n=this.matrixWorld.elements;return t.set(n[8],n[9],n[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(t){t(this);let n=this.children;for(let i=0,s=n.length;i<s;i++)n[i].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);let n=this.children;for(let i=0,s=n.length;i<s;i++)n[i].traverseVisible(t)}traverseAncestors(t){let n=this.parent;n!==null&&(t(n),n.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let t=this.pivot;if(t!==null){let n=t.x,i=t.y,s=t.z,a=this.matrix.elements;a[12]+=n-a[0]*n-a[4]*i-a[8]*s,a[13]+=i-a[1]*n-a[5]*i-a[9]*s,a[14]+=s-a[2]*n-a[6]*i-a[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);let n=this.children;for(let i=0,s=n.length;i<s;i++)n[i].updateMatrixWorld(t)}updateWorldMatrix(t,n,i=!1){let s=this.parent;if(t===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||i)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,i=!0),n===!0){let a=this.children;for(let r=0,o=a.length;r<o;r++)a[r].updateWorldMatrix(!1,!0,i)}}toJSON(t){let n=t===void 0||typeof t=="string",i={};n&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,s.name=this.name,s.castShadow=this.castShadow,s.receiveShadow=this.receiveShadow,s.visible=this.visible,s.frustumCulled=this.frustumCulled,s.renderOrder=this.renderOrder,s.static=this.static,s.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(t),s.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function a(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=a(t.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let l=o.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){let p=l[c];a(t.shapes,p)}else a(t.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(a(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(a(t.materials,this.material[l]));s.material=o}else s.material=a(t.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){let l=this.animations[o];s.animations.push(a(t.animations,l))}}if(n){let o=r(t.geometries),l=r(t.materials),c=r(t.textures),u=r(t.images),p=r(t.shapes),h=r(t.skeletons),f=r(t.animations),m=r(t.nodes);o.length>0&&(i.geometries=o),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),u.length>0&&(i.images=u),p.length>0&&(i.shapes=p),h.length>0&&(i.skeletons=h),f.length>0&&(i.animations=f),m.length>0&&(i.nodes=m)}return i.object=s,i;function r(o){let l=[];for(let c in o){let u=o[c];delete u.metadata,l.push(u)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,n=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.pivot=t.pivot!==null?t.pivot.clone():null,this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.static=t.static,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),n===!0)for(let i=0;i<t.children.length;i++){let s=t.children[i];this.add(s.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}};yi.DEFAULT_UP=new V(0,1,0);yi.DEFAULT_MATRIX_AUTO_UPDATE=!0;yi.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var $n=class extends yi{constructor(){super(),this.isGroup=!0,this.type="Group"}},fE={type:"move"},yo=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new $n,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new $n,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new V,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new V),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new $n,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new V,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new V,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){let n=this._hand;if(n)for(let i of t.hand.values())this._getHandJoint(n,i)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,n,i){let s=null,a=null,r=null,o=this._targetRay,l=this._grip,c=this._hand;if(t&&n.session.visibilityState!=="visible-blurred"){if(c&&t.hand){r=!0;for(let b of t.hand.values()){let y=n.getJointPose(b,i),d=this._getHandJoint(c,b);y!==null&&(d.matrix.fromArray(y.transform.matrix),d.matrix.decompose(d.position,d.rotation,d.scale),d.matrixWorldNeedsUpdate=!0,d.jointRadius=y.radius),d.visible=y!==null}let u=c.joints["index-finger-tip"],p=c.joints["thumb-tip"],h=u.position.distanceTo(p.position),f=.02,m=.005;c.inputState.pinching&&h>f+m?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&h<=f-m&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(a=n.getPose(t.gripSpace,i),a!==null&&(l.matrix.fromArray(a.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,a.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(a.linearVelocity)):l.hasLinearVelocity=!1,a.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(a.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:t,target:this})));o!==null&&(s=n.getPose(t.targetRaySpace,i),s===null&&a!==null&&(s=a),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(fE)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=a!==null),c!==null&&(c.visible=r!==null),this}_getHandJoint(t,n){if(t.joints[n.jointName]===void 0){let i=new $n;i.matrixAutoUpdate=!1,i.visible=!1,t.joints[n.jointName]=i,t.add(i)}return t.joints[n.jointName]}},lb={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},la={h:0,s:0,l:0},Zu={h:0,s:0,l:0};function zm(e,t,n){return n<0&&(n+=1),n>1&&(n-=1),n<1/6?e+(t-e)*6*n:n<1/2?t:n<2/3?e+(t-e)*6*(2/3-n):e}var te=class{constructor(t,n,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,n,i)}set(t,n,i){if(n===void 0&&i===void 0){let s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,n,i);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,n=xn){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Zt.colorSpaceToWorking(this,n),this}setRGB(t,n,i,s=Zt.workingColorSpace){return this.r=t,this.g=n,this.b=i,Zt.colorSpaceToWorking(this,s),this}setHSL(t,n,i,s=Zt.workingColorSpace){if(t=nE(t,1),n=Kt(n,0,1),i=Kt(i,0,1),n===0)this.r=this.g=this.b=i;else{let a=i<=.5?i*(1+n):i+n-i*n,r=2*i-a;this.r=zm(r,a,t+1/3),this.g=zm(r,a,t),this.b=zm(r,a,t-1/3)}return Zt.colorSpaceToWorking(this,s),this}setStyle(t,n=xn){function i(a){a!==void 0&&parseFloat(a)<1&&Rt("Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let a,r=s[1],o=s[2];switch(r){case"rgb":case"rgba":if(a=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(a[4]),this.setRGB(Math.min(255,parseInt(a[1],10))/255,Math.min(255,parseInt(a[2],10))/255,Math.min(255,parseInt(a[3],10))/255,n);if(a=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(a[4]),this.setRGB(Math.min(100,parseInt(a[1],10))/100,Math.min(100,parseInt(a[2],10))/100,Math.min(100,parseInt(a[3],10))/100,n);break;case"hsl":case"hsla":if(a=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(a[4]),this.setHSL(parseFloat(a[1])/360,parseFloat(a[2])/100,parseFloat(a[3])/100,n);break;default:Rt("Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){let a=s[1],r=a.length;if(r===3)return this.setRGB(parseInt(a.charAt(0),16)/15,parseInt(a.charAt(1),16)/15,parseInt(a.charAt(2),16)/15,n);if(r===6)return this.setHex(parseInt(a,16),n);Rt("Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,n);return this}setColorName(t,n=xn){let i=lb[t.toLowerCase()];return i!==void 0?this.setHex(i,n):Rt("Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Cs(t.r),this.g=Cs(t.g),this.b=Cs(t.b),this}copyLinearToSRGB(t){return this.r=fo(t.r),this.g=fo(t.g),this.b=fo(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=xn){return Zt.workingToColorSpace(vn.copy(this),t),Math.round(Kt(vn.r*255,0,255))*65536+Math.round(Kt(vn.g*255,0,255))*256+Math.round(Kt(vn.b*255,0,255))}getHexString(t=xn){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,n=Zt.workingColorSpace){Zt.workingToColorSpace(vn.copy(this),n);let i=vn.r,s=vn.g,a=vn.b,r=Math.max(i,s,a),o=Math.min(i,s,a),l,c,u=(o+r)/2;if(o===r)l=0,c=0;else{let p=r-o;switch(c=u<=.5?p/(r+o):p/(2-r-o),r){case i:l=(s-a)/p+(s<a?6:0);break;case s:l=(a-i)/p+2;break;case a:l=(i-s)/p+4;break}l/=6}return t.h=l,t.s=c,t.l=u,t}getRGB(t,n=Zt.workingColorSpace){return Zt.workingToColorSpace(vn.copy(this),n),t.r=vn.r,t.g=vn.g,t.b=vn.b,t}getStyle(t=xn){Zt.workingToColorSpace(vn.copy(this),t);let n=vn.r,i=vn.g,s=vn.b;return t!==xn?`color(${t} ${n.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(n*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(t,n,i){return this.getHSL(la),this.setHSL(la.h+t,la.s+n,la.l+i)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,n){return this.r=t.r+n.r,this.g=t.g+n.g,this.b=t.b+n.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,n){return this.r+=(t.r-this.r)*n,this.g+=(t.g-this.g)*n,this.b+=(t.b-this.b)*n,this}lerpColors(t,n,i){return this.r=t.r+(n.r-t.r)*i,this.g=t.g+(n.g-t.g)*i,this.b=t.b+(n.b-t.b)*i,this}lerpHSL(t,n){this.getHSL(la),t.getHSL(Zu);let i=Nm(la.h,Zu.h,n),s=Nm(la.s,Zu.s,n),a=Nm(la.l,Zu.l,n);return this.setHSL(i,s,a),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){let n=this.r,i=this.g,s=this.b,a=t.elements;return this.r=a[0]*n+a[3]*i+a[6]*s,this.g=a[1]*n+a[4]*i+a[7]*s,this.b=a[2]*n+a[5]*i+a[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,n=0){return this.r=t[n],this.g=t[n+1],this.b=t[n+2],this}toArray(t=[],n=0){return t[n]=this.r,t[n+1]=this.g,t[n+2]=this.b,t}fromBufferAttribute(t,n){return this.r=t.getX(n),this.g=t.getY(n),this.b=t.getZ(n),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},vn=new te;te.NAMES=lb;var Hl=class extends yi{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new da,this.environmentIntensity=1,this.environmentRotation=new da,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,n){return super.copy(t,n),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){let n=super.toJSON(t);return this.fog!==null&&(n.object.fog=this.fog.toJSON()),n.object.backgroundBlurriness=this.backgroundBlurriness,n.object.backgroundIntensity=this.backgroundIntensity,n.object.backgroundRotation=this.backgroundRotation.toArray(),n.object.environmentIntensity=this.environmentIntensity,n.object.environmentRotation=this.environmentRotation.toArray(),n}},Ri=new V,Ts=new V,Fm=new V,Es=new V,io=new V,so=new V,gS=new V,Vm=new V,Hm=new V,km=new V,Gm=new Le,Wm=new Le,Xm=new Le,fa=class e{constructor(t=new V,n=new V,i=new V){this.a=t,this.b=n,this.c=i}static getNormal(t,n,i,s){s.subVectors(i,n),Ri.subVectors(t,n),s.cross(Ri);let a=s.lengthSq();return a>0?s.multiplyScalar(1/Math.sqrt(a)):s.set(0,0,0)}static getBarycoord(t,n,i,s,a){Ri.subVectors(s,n),Ts.subVectors(i,n),Fm.subVectors(t,n);let r=Ri.dot(Ri),o=Ri.dot(Ts),l=Ri.dot(Fm),c=Ts.dot(Ts),u=Ts.dot(Fm),p=r*c-o*o;if(p===0)return a.set(0,0,0),null;let h=1/p,f=(c*l-o*u)*h,m=(r*u-o*l)*h;return a.set(1-f-m,m,f)}static containsPoint(t,n,i,s){return this.getBarycoord(t,n,i,s,Es)===null?!1:Es.x>=0&&Es.y>=0&&Es.x+Es.y<=1}static getInterpolation(t,n,i,s,a,r,o,l){return this.getBarycoord(t,n,i,s,Es)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(a,Es.x),l.addScaledVector(r,Es.y),l.addScaledVector(o,Es.z),l)}static getInterpolatedAttribute(t,n,i,s,a,r){return Gm.setScalar(0),Wm.setScalar(0),Xm.setScalar(0),Gm.fromBufferAttribute(t,n),Wm.fromBufferAttribute(t,i),Xm.fromBufferAttribute(t,s),r.setScalar(0),r.addScaledVector(Gm,a.x),r.addScaledVector(Wm,a.y),r.addScaledVector(Xm,a.z),r}static isFrontFacing(t,n,i,s){return Ri.subVectors(i,n),Ts.subVectors(t,n),Ri.cross(Ts).dot(s)<0}set(t,n,i){return this.a.copy(t),this.b.copy(n),this.c.copy(i),this}setFromPointsAndIndices(t,n,i,s){return this.a.copy(t[n]),this.b.copy(t[i]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,n,i,s){return this.a.fromBufferAttribute(t,n),this.b.fromBufferAttribute(t,i),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Ri.subVectors(this.c,this.b),Ts.subVectors(this.a,this.b),Ri.cross(Ts).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return e.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,n){return e.getBarycoord(t,this.a,this.b,this.c,n)}getInterpolation(t,n,i,s,a){return e.getInterpolation(t,this.a,this.b,this.c,n,i,s,a)}containsPoint(t){return e.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return e.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,n){let i=this.a,s=this.b,a=this.c,r,o;io.subVectors(s,i),so.subVectors(a,i),Vm.subVectors(t,i);let l=io.dot(Vm),c=so.dot(Vm);if(l<=0&&c<=0)return n.copy(i);Hm.subVectors(t,s);let u=io.dot(Hm),p=so.dot(Hm);if(u>=0&&p<=u)return n.copy(s);let h=l*p-u*c;if(h<=0&&l>=0&&u<=0)return r=l/(l-u),n.copy(i).addScaledVector(io,r);km.subVectors(t,a);let f=io.dot(km),m=so.dot(km);if(m>=0&&f<=m)return n.copy(a);let b=f*c-l*m;if(b<=0&&c>=0&&m<=0)return o=c/(c-m),n.copy(i).addScaledVector(so,o);let y=u*m-f*p;if(y<=0&&p-u>=0&&f-m>=0)return gS.subVectors(a,s),o=(p-u)/(p-u+(f-m)),n.copy(s).addScaledVector(gS,o);let d=1/(y+b+h);return r=b*d,o=h*d,n.copy(i).addScaledVector(io,r).addScaledVector(so,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}},pa=class{constructor(t=new V(1/0,1/0,1/0),n=new V(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=n}set(t,n){return this.min.copy(t),this.max.copy(n),this}setFromArray(t){this.makeEmpty();for(let n=0,i=t.length;n<i;n+=3)this.expandByPoint(Di.fromArray(t,n));return this}setFromBufferAttribute(t){this.makeEmpty();for(let n=0,i=t.count;n<i;n++)this.expandByPoint(Di.fromBufferAttribute(t,n));return this}setFromPoints(t){this.makeEmpty();for(let n=0,i=t.length;n<i;n++)this.expandByPoint(t[n]);return this}setFromCenterAndSize(t,n){let i=Di.copy(n).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}setFromObject(t,n=!1){return this.makeEmpty(),this.expandByObject(t,n)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,n=!1){t.updateWorldMatrix(!1,!1);let i=t.geometry;if(i!==void 0){let a=i.getAttribute("position");if(n===!0&&a!==void 0&&t.isInstancedMesh!==!0)for(let r=0,o=a.count;r<o;r++)t.isMesh===!0?t.getVertexPosition(r,Di):Di.fromBufferAttribute(a,r),Di.applyMatrix4(t.matrixWorld),this.expandByPoint(Di);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Ju.copy(t.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Ju.copy(i.boundingBox)),Ju.applyMatrix4(t.matrixWorld),this.union(Ju)}let s=t.children;for(let a=0,r=s.length;a<r;a++)this.expandByObject(s[a],n);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,n){return n.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Di),Di.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let n,i;return t.normal.x>0?(n=t.normal.x*this.min.x,i=t.normal.x*this.max.x):(n=t.normal.x*this.max.x,i=t.normal.x*this.min.x),t.normal.y>0?(n+=t.normal.y*this.min.y,i+=t.normal.y*this.max.y):(n+=t.normal.y*this.max.y,i+=t.normal.y*this.min.y),t.normal.z>0?(n+=t.normal.z*this.min.z,i+=t.normal.z*this.max.z):(n+=t.normal.z*this.max.z,i+=t.normal.z*this.min.z),n<=-t.constant&&i>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Ul),Ku.subVectors(this.max,Ul),ao.subVectors(t.a,Ul),ro.subVectors(t.b,Ul),oo.subVectors(t.c,Ul),ca.subVectors(ro,ao),ua.subVectors(oo,ro),Ya.subVectors(ao,oo);let n=[0,-ca.z,ca.y,0,-ua.z,ua.y,0,-Ya.z,Ya.y,ca.z,0,-ca.x,ua.z,0,-ua.x,Ya.z,0,-Ya.x,-ca.y,ca.x,0,-ua.y,ua.x,0,-Ya.y,Ya.x,0];return!qm(n,ao,ro,oo,Ku)||(n=[1,0,0,0,1,0,0,0,1],!qm(n,ao,ro,oo,Ku))?!1:(Qu.crossVectors(ca,ua),n=[Qu.x,Qu.y,Qu.z],qm(n,ao,ro,oo,Ku))}clampPoint(t,n){return n.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Di).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Di).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(As[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),As[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),As[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),As[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),As[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),As[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),As[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),As[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(As),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}},As=[new V,new V,new V,new V,new V,new V,new V,new V],Di=new V,Ju=new pa,ao=new V,ro=new V,oo=new V,ca=new V,ua=new V,Ya=new V,Ul=new V,Ku=new V,Qu=new V,Za=new V;function qm(e,t,n,i,s){for(let a=0,r=e.length-3;a<=r;a+=3){Za.fromArray(e,a);let o=s.x*Math.abs(Za.x)+s.y*Math.abs(Za.y)+s.z*Math.abs(Za.z),l=t.dot(Za),c=n.dot(Za),u=i.dot(Za);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>o)return!1}return!0}var Ze=new V,ju=new $t,dE=0,gi=class extends ji{constructor(t,n,i=!1){if(super(),Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:dE++}),this.name="",this.array=t,this.itemSize=n,this.count=t!==void 0?t.length/n:0,this.normalized=i,this.usage=ib,this.updateRanges=[],this.gpuType=Ii,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,n){this.updateRanges.push({start:t,count:n})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,n,i){t*=this.itemSize,i*=n.itemSize;for(let s=0,a=this.itemSize;s<a;s++)this.array[t+s]=n.array[i+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let n=0,i=this.count;n<i;n++)ju.fromBufferAttribute(this,n),ju.applyMatrix3(t),this.setXY(n,ju.x,ju.y);else if(this.itemSize===3)for(let n=0,i=this.count;n<i;n++)Ze.fromBufferAttribute(this,n),Ze.applyMatrix3(t),this.setXYZ(n,Ze.x,Ze.y,Ze.z);return this}applyMatrix4(t){for(let n=0,i=this.count;n<i;n++)Ze.fromBufferAttribute(this,n),Ze.applyMatrix4(t),this.setXYZ(n,Ze.x,Ze.y,Ze.z);return this}applyNormalMatrix(t){for(let n=0,i=this.count;n<i;n++)Ze.fromBufferAttribute(this,n),Ze.applyNormalMatrix(t),this.setXYZ(n,Ze.x,Ze.y,Ze.z);return this}transformDirection(t){for(let n=0,i=this.count;n<i;n++)Ze.fromBufferAttribute(this,n),Ze.transformDirection(t),this.setXYZ(n,Ze.x,Ze.y,Ze.z);return this}set(t,n=0){return this.array.set(t,n),this}getComponent(t,n){let i=this.array[t*this.itemSize+n];return this.normalized&&(i=Rl(i,this.array)),i}setComponent(t,n,i){return this.normalized&&(i=Bn(i,this.array)),this.array[t*this.itemSize+n]=i,this}getX(t){let n=this.array[t*this.itemSize];return this.normalized&&(n=Rl(n,this.array)),n}setX(t,n){return this.normalized&&(n=Bn(n,this.array)),this.array[t*this.itemSize]=n,this}getY(t){let n=this.array[t*this.itemSize+1];return this.normalized&&(n=Rl(n,this.array)),n}setY(t,n){return this.normalized&&(n=Bn(n,this.array)),this.array[t*this.itemSize+1]=n,this}getZ(t){let n=this.array[t*this.itemSize+2];return this.normalized&&(n=Rl(n,this.array)),n}setZ(t,n){return this.normalized&&(n=Bn(n,this.array)),this.array[t*this.itemSize+2]=n,this}getW(t){let n=this.array[t*this.itemSize+3];return this.normalized&&(n=Rl(n,this.array)),n}setW(t,n){return this.normalized&&(n=Bn(n,this.array)),this.array[t*this.itemSize+3]=n,this}setXY(t,n,i){return t*=this.itemSize,this.normalized&&(n=Bn(n,this.array),i=Bn(i,this.array)),this.array[t+0]=n,this.array[t+1]=i,this}setXYZ(t,n,i,s){return t*=this.itemSize,this.normalized&&(n=Bn(n,this.array),i=Bn(i,this.array),s=Bn(s,this.array)),this.array[t+0]=n,this.array[t+1]=i,this.array[t+2]=s,this}setXYZW(t,n,i,s,a){return t*=this.itemSize,this.normalized&&(n=Bn(n,this.array),i=Bn(i,this.array),s=Bn(s,this.array),a=Bn(a,this.array)),this.array[t+0]=n,this.array[t+1]=i,this.array[t+2]=s,this.array[t+3]=a,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return t.name=this.name,t.usage=this.usage,t.gpuType=this.gpuType,t}dispose(){this.dispatchEvent({type:"dispose"})}};var kl=class extends gi{constructor(t,n,i){super(new Uint16Array(t),n,i)}};var Gl=class extends gi{constructor(t,n,i){super(new Uint32Array(t),n,i)}};var je=class extends gi{constructor(t,n,i){super(new Float32Array(t),n,i)}},pE=new pa,Nl=new V,Ym=new V,_o=class{constructor(t=new V,n=-1){this.isSphere=!0,this.center=t,this.radius=n}set(t,n){return this.center.copy(t),this.radius=n,this}setFromPoints(t,n){let i=this.center;n!==void 0?i.copy(n):pE.setFromPoints(t).getCenter(i);let s=0;for(let a=0,r=t.length;a<r;a++)s=Math.max(s,i.distanceToSquared(t[a]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){let n=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=n*n}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,n){let i=this.center.distanceToSquared(t);return n.copy(t),i>this.radius*this.radius&&(n.sub(this.center).normalize(),n.multiplyScalar(this.radius).add(this.center)),n}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Nl.subVectors(t,this.center);let n=Nl.lengthSq();if(n>this.radius*this.radius){let i=Math.sqrt(n),s=(i-this.radius)*.5;this.center.addScaledVector(Nl,s/i),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Ym.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Nl.copy(t.center).add(Ym)),this.expandByPoint(Nl.copy(t.center).sub(Ym))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}},mE=0,mi=new Ve,Zm=new yi,lo=new V,jn=new pa,Ll=new pa,ln=new V,Vn=class e extends ji{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:mE++}),this.uuid=ac(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(tE(t)?Gl:kl)(t,1):this.index=t,this}setIndirect(t,n=0){return this.indirect=t,this.indirectOffset=n,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,n){return this.attributes[t]=n,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,n,i=0){this.groups.push({start:t,count:n,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(t,n){this.drawRange.start=t,this.drawRange.count=n}applyMatrix4(t){let n=this.attributes.position;n!==void 0&&(n.applyMatrix4(t),n.needsUpdate=!0);let i=this.attributes.normal;if(i!==void 0){let a=new Nt().getNormalMatrix(t);i.applyNormalMatrix(a),i.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(t){return mi.makeRotationFromQuaternion(t),this.applyMatrix4(mi),this}rotateX(t){return mi.makeRotationX(t),this.applyMatrix4(mi),this}rotateY(t){return mi.makeRotationY(t),this.applyMatrix4(mi),this}rotateZ(t){return mi.makeRotationZ(t),this.applyMatrix4(mi),this}translate(t,n,i){return mi.makeTranslation(t,n,i),this.applyMatrix4(mi),this}scale(t,n,i){return mi.makeScale(t,n,i),this.applyMatrix4(mi),this}lookAt(t){return Zm.lookAt(t),Zm.updateMatrix(),this.applyMatrix4(Zm.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(lo).negate(),this.translate(lo.x,lo.y,lo.z),this}setFromPoints(t){let n=this.getAttribute("position");if(n===void 0){let i=[];for(let s=0,a=t.length;s<a;s++){let r=t[s];i.push(r.x,r.y,r.z||0)}this.setAttribute("position",new je(i,3))}else{let i=Math.min(t.length,n.count);for(let s=0;s<i;s++){let a=t[s];n.setXYZ(s,a.x,a.y,a.z||0)}t.length>n.count&&Rt("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),n.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new pa);let t=this.attributes.position,n=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){Ut("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new V(-1/0,-1/0,-1/0),new V(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),n)for(let i=0,s=n.length;i<s;i++){let a=n[i];jn.setFromBufferAttribute(a),this.morphTargetsRelative?(ln.addVectors(this.boundingBox.min,jn.min),this.boundingBox.expandByPoint(ln),ln.addVectors(this.boundingBox.max,jn.max),this.boundingBox.expandByPoint(ln)):(this.boundingBox.expandByPoint(jn.min),this.boundingBox.expandByPoint(jn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Ut('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new _o);let t=this.attributes.position,n=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){Ut("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new V,1/0);return}if(t){let i=this.boundingSphere.center;if(jn.setFromBufferAttribute(t),n)for(let a=0,r=n.length;a<r;a++){let o=n[a];Ll.setFromBufferAttribute(o),this.morphTargetsRelative?(ln.addVectors(jn.min,Ll.min),jn.expandByPoint(ln),ln.addVectors(jn.max,Ll.max),jn.expandByPoint(ln)):(jn.expandByPoint(Ll.min),jn.expandByPoint(Ll.max))}jn.getCenter(i);let s=0;for(let a=0,r=t.count;a<r;a++)ln.fromBufferAttribute(t,a),s=Math.max(s,i.distanceToSquared(ln));if(n)for(let a=0,r=n.length;a<r;a++){let o=n[a],l=this.morphTargetsRelative;for(let c=0,u=o.count;c<u;c++)ln.fromBufferAttribute(o,c),l&&(lo.fromBufferAttribute(t,c),ln.add(lo)),s=Math.max(s,i.distanceToSquared(ln))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&Ut('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let t=this.index,n=this.attributes;if(t===null||n.position===void 0||n.normal===void 0||n.uv===void 0){Ut("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let i=n.position,s=n.normal,a=n.uv,r=this.getAttribute("tangent");(r===void 0||r.count!==i.count)&&(r=new gi(new Float32Array(4*i.count),4),this.setAttribute("tangent",r));let o=[],l=[];for(let x=0;x<i.count;x++)o[x]=new V,l[x]=new V;let c=new V,u=new V,p=new V,h=new $t,f=new $t,m=new $t,b=new V,y=new V;function d(x,A,R){c.fromBufferAttribute(i,x),u.fromBufferAttribute(i,A),p.fromBufferAttribute(i,R),h.fromBufferAttribute(a,x),f.fromBufferAttribute(a,A),m.fromBufferAttribute(a,R),u.sub(c),p.sub(c),f.sub(h),m.sub(h);let O=1/(f.x*m.y-m.x*f.y);isFinite(O)&&(b.copy(u).multiplyScalar(m.y).addScaledVector(p,-f.y).multiplyScalar(O),y.copy(p).multiplyScalar(f.x).addScaledVector(u,-m.x).multiplyScalar(O),o[x].add(b),o[A].add(b),o[R].add(b),l[x].add(y),l[A].add(y),l[R].add(y))}let g=this.groups;g.length===0&&(g=[{start:0,count:t.count}]);for(let x=0,A=g.length;x<A;++x){let R=g[x],O=R.start,z=R.count;for(let G=O,L=O+z;G<L;G+=3)d(t.getX(G+0),t.getX(G+1),t.getX(G+2))}let M=new V,v=new V,T=new V,E=new V;function w(x){T.fromBufferAttribute(s,x),E.copy(T);let A=o[x];M.copy(A),M.sub(T.multiplyScalar(T.dot(A))).normalize(),v.crossVectors(E,A);let O=v.dot(l[x])<0?-1:1;r.setXYZW(x,M.x,M.y,M.z,O)}for(let x=0,A=g.length;x<A;++x){let R=g[x],O=R.start,z=R.count;for(let G=O,L=O+z;G<L;G+=3)w(t.getX(G+0)),w(t.getX(G+1)),w(t.getX(G+2))}this._transformed=!0}computeVertexNormals(){let t=this.index,n=this.getAttribute("position");if(n!==void 0){let i=this.getAttribute("normal");if(i===void 0||i.count!==n.count)i=new gi(new Float32Array(n.count*3),3),this.setAttribute("normal",i);else for(let h=0,f=i.count;h<f;h++)i.setXYZ(h,0,0,0);let s=new V,a=new V,r=new V,o=new V,l=new V,c=new V,u=new V,p=new V;if(t)for(let h=0,f=t.count;h<f;h+=3){let m=t.getX(h+0),b=t.getX(h+1),y=t.getX(h+2);s.fromBufferAttribute(n,m),a.fromBufferAttribute(n,b),r.fromBufferAttribute(n,y),u.subVectors(r,a),p.subVectors(s,a),u.cross(p),o.fromBufferAttribute(i,m),l.fromBufferAttribute(i,b),c.fromBufferAttribute(i,y),o.add(u),l.add(u),c.add(u),i.setXYZ(m,o.x,o.y,o.z),i.setXYZ(b,l.x,l.y,l.z),i.setXYZ(y,c.x,c.y,c.z)}else for(let h=0,f=n.count;h<f;h+=3)s.fromBufferAttribute(n,h+0),a.fromBufferAttribute(n,h+1),r.fromBufferAttribute(n,h+2),u.subVectors(r,a),p.subVectors(s,a),u.cross(p),i.setXYZ(h+0,u.x,u.y,u.z),i.setXYZ(h+1,u.x,u.y,u.z),i.setXYZ(h+2,u.x,u.y,u.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){let t=this.attributes.normal;for(let n=0,i=t.count;n<i;n++)ln.fromBufferAttribute(t,n),ln.normalize(),t.setXYZ(n,ln.x,ln.y,ln.z)}toNonIndexed(){function t(o,l){let c=o.array,u=o.itemSize,p=o.normalized,h=new c.constructor(l.length*u),f=0,m=0;for(let b=0,y=l.length;b<y;b++){o.isInterleavedBufferAttribute?f=l[b]*o.data.stride+o.offset:f=l[b]*u;for(let d=0;d<u;d++)h[m++]=c[f++]}return new gi(h,u,p)}if(this.index===null)return Rt("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let n=new e,i=this.index.array,s=this.attributes;for(let o in s){let l=s[o],c=t(l,i);n.setAttribute(o,c)}let a=this.morphAttributes;for(let o in a){let l=[],c=a[o];for(let u=0,p=c.length;u<p;u++){let h=c[u],f=t(h,i);l.push(f)}n.morphAttributes[o]=l}n.morphTargetsRelative=this.morphTargetsRelative;let r=this.groups;for(let o=0,l=r.length;o<l;o++){let c=r[o];n.addGroup(c.start,c.count,c.materialIndex)}return n}toJSON(){let t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,t.name=this.name,Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};let n=this.index;n!==null&&(t.data.index={type:n.array.constructor.name,array:Array.prototype.slice.call(n.array)});let i=this.attributes;for(let l in i){let c=i[l];t.data.attributes[l]=c.toJSON(t.data)}let s={},a=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],u=[];for(let p=0,h=c.length;p<h;p++){let f=c[p];u.push(f.toJSON(t.data))}u.length>0&&(s[l]=u,a=!0)}a&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);let r=this.groups;r.length>0&&(t.data.groups=JSON.parse(JSON.stringify(r)));let o=this.boundingSphere;return o!==null&&(t.data.boundingSphere=o.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let n={};this.name=t.name;let i=t.index;i!==null&&this.setIndex(i.clone());let s=t.attributes;for(let c in s){let u=s[c];this.setAttribute(c,u.clone(n))}let a=t.morphAttributes;for(let c in a){let u=[],p=a[c];for(let h=0,f=p.length;h<f;h++)u.push(p[h].clone(n));this.morphAttributes[c]=u}this.morphTargetsRelative=t.morphTargetsRelative;let r=t.groups;for(let c=0,u=r.length;c<u;c++){let p=r[c];this.addGroup(p.start,p.count,p.materialIndex)}let o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());let l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this._transformed=t._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}};var Jm=new V,gE=new V,yE=new Nt,Ui=class{constructor(t=new V(1,0,0),n=0){this.isPlane=!0,this.normal=t,this.constant=n}set(t,n){return this.normal.copy(t),this.constant=n,this}setComponents(t,n,i,s){return this.normal.set(t,n,i),this.constant=s,this}setFromNormalAndCoplanarPoint(t,n){return this.normal.copy(t),this.constant=-n.dot(this.normal),this}setFromCoplanarPoints(t,n,i){let s=Jm.subVectors(i,n).cross(gE.subVectors(t,n)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){let t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,n){return n.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,n,i=!0){let s=t.delta(Jm),a=this.normal.dot(s);if(a===0)return this.distanceToPoint(t.start)===0?n.copy(t.start):null;let r=-(t.start.dot(this.normal)+this.constant)/a;return i===!0&&(r<0||r>1)?null:n.copy(t.start).addScaledVector(s,r)}intersectsLine(t){let n=this.distanceToPoint(t.start),i=this.distanceToPoint(t.end);return n<0&&i>0||i<0&&n>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,n){let i=n||yE.getNormalMatrix(t),s=this.coplanarPoint(Jm).applyMatrix4(t),a=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(a),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(t){return this.normal.fromArray(t.normal),this.constant=t.constant,this}},_E=0,ja=class extends ji{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:_E++}),this.uuid=ac(),this.name="",this.type="Material",this.blending=So,this.side=xa,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=cg,this.blendDst=ug,this.blendEquation=tr,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new te(0,0,0),this.blendAlpha=0,this.depthFunc=po,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=KS,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=fh,this.stencilZFail=fh,this.stencilZPass=fh,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(let n in t){let i=t[n];if(i===void 0){Rt(`Material: parameter '${n}' has value of undefined.`);continue}let s=this[n];if(s===void 0){Rt(`Material: '${n}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector2&&i&&i.isVector2||s&&s.isEuler&&i&&i.isEuler||s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[n]=i}}toJSON(t){let n=t===void 0||typeof t=="string";n&&(t={textures:{},images:{}});let i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,i.blending=this.blending,i.side=this.side,i.shadowSide=this.shadowSide,i.vertexColors=this.vertexColors,i.opacity=this.opacity,i.transparent=this.transparent,i.blendSrc=this.blendSrc,i.blendDst=this.blendDst,i.blendEquation=this.blendEquation,i.blendSrcAlpha=this.blendSrcAlpha,i.blendDstAlpha=this.blendDstAlpha,i.blendEquationAlpha=this.blendEquationAlpha,i.blendColor=this.blendColor.getHex(),i.blendAlpha=this.blendAlpha,i.depthFunc=this.depthFunc,i.depthTest=this.depthTest,i.depthWrite=this.depthWrite,i.colorWrite=this.colorWrite,i.clipIntersection=this.clipIntersection,i.clipShadows=this.clipShadows,i.stencilWriteMask=this.stencilWriteMask,i.stencilFunc=this.stencilFunc,i.stencilRef=this.stencilRef,i.stencilFuncMask=this.stencilFuncMask,i.stencilFail=this.stencilFail,i.stencilZFail=this.stencilZFail,i.stencilZPass=this.stencilZPass,i.stencilWrite=this.stencilWrite,i.polygonOffset=this.polygonOffset,i.polygonOffsetFactor=this.polygonOffsetFactor,i.polygonOffsetUnits=this.polygonOffsetUnits,i.dithering=this.dithering,i.alphaTest=this.alphaTest,i.alphaHash=this.alphaHash,i.alphaToCoverage=this.alphaToCoverage,i.premultipliedAlpha=this.premultipliedAlpha,i.forceSinglePass=this.forceSinglePass,i.allowOverride=this.allowOverride,i.visible=this.visible,i.toneMapped=this.toneMapped,i.name=this.name,this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(i.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(t).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(t).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(t).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(t).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(t).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(i.clippingPlanes=this.clippingPlanes.map(a=>a.toJSON())),this.rotation!==void 0&&(i.rotation=this.rotation),this.depthPacking!==void 0&&(i.depthPacking=this.depthPacking),this.linewidth!==void 0&&(i.linewidth=this.linewidth),this.linecap!==void 0&&(i.linecap=this.linecap),this.linejoin!==void 0&&(i.linejoin=this.linejoin),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.wireframe!==void 0&&(i.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(i.flatShading=this.flatShading),this.fog!==void 0&&(i.fog=this.fog),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(a){let r=[];for(let o in a){let l=a[o];delete l.metadata,r.push(l)}return r}if(n){let a=s(t.textures),r=s(t.images);a.length>0&&(i.textures=a),r.length>0&&(i.images=r)}return i}fromJSON(t,n){if(t.uuid!==void 0&&(this.uuid=t.uuid),t.name!==void 0&&(this.name=t.name),t.color!==void 0&&this.color!==void 0&&this.color.setHex(t.color),t.roughness!==void 0&&(this.roughness=t.roughness),t.metalness!==void 0&&(this.metalness=t.metalness),t.sheen!==void 0&&(this.sheen=t.sheen),t.sheenColor!==void 0&&(this.sheenColor=new te().setHex(t.sheenColor)),t.sheenRoughness!==void 0&&(this.sheenRoughness=t.sheenRoughness),t.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(t.emissive),t.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(t.specular),t.specularIntensity!==void 0&&(this.specularIntensity=t.specularIntensity),t.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(t.specularColor),t.shininess!==void 0&&(this.shininess=t.shininess),t.clearcoat!==void 0&&(this.clearcoat=t.clearcoat),t.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=t.clearcoatRoughness),t.dispersion!==void 0&&(this.dispersion=t.dispersion),t.retroreflectivity!==void 0&&(this.retroreflectivity=t.retroreflectivity),t.iridescence!==void 0&&(this.iridescence=t.iridescence),t.iridescenceIOR!==void 0&&(this.iridescenceIOR=t.iridescenceIOR),t.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=t.iridescenceThicknessRange),t.transmission!==void 0&&(this.transmission=t.transmission),t.thickness!==void 0&&(this.thickness=t.thickness),t.attenuationDistance!==void 0&&(this.attenuationDistance=t.attenuationDistance),t.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(t.attenuationColor),t.anisotropy!==void 0&&(this.anisotropy=t.anisotropy),t.anisotropyRotation!==void 0&&(this.anisotropyRotation=t.anisotropyRotation),t.fog!==void 0&&(this.fog=t.fog),t.flatShading!==void 0&&(this.flatShading=t.flatShading),t.blending!==void 0&&(this.blending=t.blending),t.combine!==void 0&&(this.combine=t.combine),t.side!==void 0&&(this.side=t.side),t.shadowSide!==void 0&&(this.shadowSide=t.shadowSide),t.opacity!==void 0&&(this.opacity=t.opacity),t.transparent!==void 0&&(this.transparent=t.transparent),t.alphaTest!==void 0&&(this.alphaTest=t.alphaTest),t.alphaHash!==void 0&&(this.alphaHash=t.alphaHash),t.depthFunc!==void 0&&(this.depthFunc=t.depthFunc),t.depthTest!==void 0&&(this.depthTest=t.depthTest),t.depthWrite!==void 0&&(this.depthWrite=t.depthWrite),t.colorWrite!==void 0&&(this.colorWrite=t.colorWrite),t.clippingPlanes!==void 0&&(this.clippingPlanes=t.clippingPlanes.map(i=>new Ui().fromJSON(i))),t.clipIntersection!==void 0&&(this.clipIntersection=t.clipIntersection),t.clipShadows!==void 0&&(this.clipShadows=t.clipShadows),t.depthPacking!==void 0&&(this.depthPacking=t.depthPacking),t.blendSrc!==void 0&&(this.blendSrc=t.blendSrc),t.blendDst!==void 0&&(this.blendDst=t.blendDst),t.blendEquation!==void 0&&(this.blendEquation=t.blendEquation),t.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=t.blendSrcAlpha),t.blendDstAlpha!==void 0&&(this.blendDstAlpha=t.blendDstAlpha),t.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=t.blendEquationAlpha),t.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(t.blendColor),t.blendAlpha!==void 0&&(this.blendAlpha=t.blendAlpha),t.stencilWriteMask!==void 0&&(this.stencilWriteMask=t.stencilWriteMask),t.stencilFunc!==void 0&&(this.stencilFunc=t.stencilFunc),t.stencilRef!==void 0&&(this.stencilRef=t.stencilRef),t.stencilFuncMask!==void 0&&(this.stencilFuncMask=t.stencilFuncMask),t.stencilFail!==void 0&&(this.stencilFail=t.stencilFail),t.stencilZFail!==void 0&&(this.stencilZFail=t.stencilZFail),t.stencilZPass!==void 0&&(this.stencilZPass=t.stencilZPass),t.stencilWrite!==void 0&&(this.stencilWrite=t.stencilWrite),t.wireframe!==void 0&&(this.wireframe=t.wireframe),t.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=t.wireframeLinewidth),t.wireframeLinecap!==void 0&&(this.wireframeLinecap=t.wireframeLinecap),t.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=t.wireframeLinejoin),t.rotation!==void 0&&(this.rotation=t.rotation),t.linewidth!==void 0&&(this.linewidth=t.linewidth),t.linecap!==void 0&&(this.linecap=t.linecap),t.linejoin!==void 0&&(this.linejoin=t.linejoin),t.dashSize!==void 0&&(this.dashSize=t.dashSize),t.gapSize!==void 0&&(this.gapSize=t.gapSize),t.scale!==void 0&&(this.scale=t.scale),t.polygonOffset!==void 0&&(this.polygonOffset=t.polygonOffset),t.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=t.polygonOffsetFactor),t.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=t.polygonOffsetUnits),t.dithering!==void 0&&(this.dithering=t.dithering),t.alphaToCoverage!==void 0&&(this.alphaToCoverage=t.alphaToCoverage),t.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=t.premultipliedAlpha),t.forceSinglePass!==void 0&&(this.forceSinglePass=t.forceSinglePass),t.allowOverride!==void 0&&(this.allowOverride=t.allowOverride),t.visible!==void 0&&(this.visible=t.visible),t.toneMapped!==void 0&&(this.toneMapped=t.toneMapped),t.userData!==void 0&&(this.userData=t.userData),t.vertexColors!==void 0&&(typeof t.vertexColors=="number"?this.vertexColors=t.vertexColors>0:this.vertexColors=t.vertexColors),t.size!==void 0&&(this.size=t.size),t.sizeAttenuation!==void 0&&(this.sizeAttenuation=t.sizeAttenuation),t.map!==void 0&&(this.map=n[t.map]||null),t.matcap!==void 0&&(this.matcap=n[t.matcap]||null),t.alphaMap!==void 0&&(this.alphaMap=n[t.alphaMap]||null),t.bumpMap!==void 0&&(this.bumpMap=n[t.bumpMap]||null),t.bumpScale!==void 0&&(this.bumpScale=t.bumpScale),t.normalMap!==void 0&&(this.normalMap=n[t.normalMap]||null),t.normalMapType!==void 0&&(this.normalMapType=t.normalMapType),t.normalScale!==void 0){let i=t.normalScale;Array.isArray(i)===!1&&(i=[i,i]),this.normalScale=new $t().fromArray(i)}return t.displacementMap!==void 0&&(this.displacementMap=n[t.displacementMap]||null),t.displacementScale!==void 0&&(this.displacementScale=t.displacementScale),t.displacementBias!==void 0&&(this.displacementBias=t.displacementBias),t.roughnessMap!==void 0&&(this.roughnessMap=n[t.roughnessMap]||null),t.metalnessMap!==void 0&&(this.metalnessMap=n[t.metalnessMap]||null),t.emissiveMap!==void 0&&(this.emissiveMap=n[t.emissiveMap]||null),t.emissiveIntensity!==void 0&&(this.emissiveIntensity=t.emissiveIntensity),t.specularMap!==void 0&&(this.specularMap=n[t.specularMap]||null),t.specularIntensityMap!==void 0&&(this.specularIntensityMap=n[t.specularIntensityMap]||null),t.specularColorMap!==void 0&&(this.specularColorMap=n[t.specularColorMap]||null),t.envMap!==void 0&&(this.envMap=n[t.envMap]||null),t.envMapRotation!==void 0&&this.envMapRotation.fromArray(t.envMapRotation),t.envMapIntensity!==void 0&&(this.envMapIntensity=t.envMapIntensity),t.reflectivity!==void 0&&(this.reflectivity=t.reflectivity),t.refractionRatio!==void 0&&(this.refractionRatio=t.refractionRatio),t.lightMap!==void 0&&(this.lightMap=n[t.lightMap]||null),t.lightMapIntensity!==void 0&&(this.lightMapIntensity=t.lightMapIntensity),t.aoMap!==void 0&&(this.aoMap=n[t.aoMap]||null),t.aoMapIntensity!==void 0&&(this.aoMapIntensity=t.aoMapIntensity),t.gradientMap!==void 0&&(this.gradientMap=n[t.gradientMap]||null),t.clearcoatMap!==void 0&&(this.clearcoatMap=n[t.clearcoatMap]||null),t.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=n[t.clearcoatRoughnessMap]||null),t.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=n[t.clearcoatNormalMap]||null),t.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new $t().fromArray(t.clearcoatNormalScale)),t.iridescenceMap!==void 0&&(this.iridescenceMap=n[t.iridescenceMap]||null),t.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=n[t.iridescenceThicknessMap]||null),t.transmissionMap!==void 0&&(this.transmissionMap=n[t.transmissionMap]||null),t.thicknessMap!==void 0&&(this.thicknessMap=n[t.thicknessMap]||null),t.anisotropyMap!==void 0&&(this.anisotropyMap=n[t.anisotropyMap]||null),t.sheenColorMap!==void 0&&(this.sheenColorMap=n[t.sheenColorMap]||null),t.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=n[t.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;let n=t.clippingPlanes,i=null;if(n!==null){let s=n.length;i=new Array(s);for(let a=0;a!==s;++a)i[a]=n[a].clone()}return this.clippingPlanes=i,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.allowOverride=t.allowOverride,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}};var ws=new V,Km=new V,$u=new V,th=new V,wh=class{constructor(t=new V,n=new V(0,0,-1)){this.origin=t,this.direction=n}set(t,n){return this.origin.copy(t),this.direction.copy(n),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,n){return n.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,ws)),this}closestPointToPoint(t,n){n.subVectors(t,this.origin);let i=n.dot(this.direction);return i<0?n.copy(this.origin):n.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){let n=ws.subVectors(t,this.origin).dot(this.direction);return n<0?this.origin.distanceToSquared(t):(ws.copy(this.origin).addScaledVector(this.direction,n),ws.distanceToSquared(t))}distanceSqToSegment(t,n,i,s){Km.copy(t).add(n).multiplyScalar(.5),$u.copy(n).sub(t).normalize(),th.copy(this.origin).sub(Km);let a=t.distanceTo(n)*.5,r=-this.direction.dot($u),o=th.dot(this.direction),l=-th.dot($u),c=th.lengthSq(),u=Math.abs(1-r*r),p,h,f,m;if(u>0)if(p=r*l-o,h=r*o-l,m=a*u,p>=0)if(h>=-m)if(h<=m){let b=1/u;p*=b,h*=b,f=p*(p+r*h+2*o)+h*(r*p+h+2*l)+c}else h=a,p=Math.max(0,-(r*h+o)),f=-p*p+h*(h+2*l)+c;else h=-a,p=Math.max(0,-(r*h+o)),f=-p*p+h*(h+2*l)+c;else h<=-m?(p=Math.max(0,-(-r*a+o)),h=p>0?-a:Math.min(Math.max(-a,-l),a),f=-p*p+h*(h+2*l)+c):h<=m?(p=0,h=Math.min(Math.max(-a,-l),a),f=h*(h+2*l)+c):(p=Math.max(0,-(r*a+o)),h=p>0?a:Math.min(Math.max(-a,-l),a),f=-p*p+h*(h+2*l)+c);else h=r>0?-a:a,p=Math.max(0,-(r*h+o)),f=-p*p+h*(h+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,p),s&&s.copy(Km).addScaledVector($u,h),f}intersectSphere(t,n){if(t.radius<0)return null;ws.subVectors(t.center,this.origin);let i=ws.dot(this.direction),s=ws.dot(ws)-i*i,a=t.radius*t.radius;if(s>a)return null;let r=Math.sqrt(a-s),o=i-r,l=i+r;return l<0?null:o<0?this.at(l,n):this.at(o,n)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){let n=t.normal.dot(this.direction);if(n===0)return t.distanceToPoint(this.origin)===0?0:null;let i=-(this.origin.dot(t.normal)+t.constant)/n;return i>=0?i:null}intersectPlane(t,n){let i=this.distanceToPlane(t);return i===null?null:this.at(i,n)}intersectsPlane(t){let n=t.distanceToPoint(this.origin);return n===0||t.normal.dot(this.direction)*n<0}intersectBox(t,n){let i,s,a,r,o,l,c=1/this.direction.x,u=1/this.direction.y,p=1/this.direction.z,h=this.origin;return c>=0?(i=(t.min.x-h.x)*c,s=(t.max.x-h.x)*c):(i=(t.max.x-h.x)*c,s=(t.min.x-h.x)*c),u>=0?(a=(t.min.y-h.y)*u,r=(t.max.y-h.y)*u):(a=(t.max.y-h.y)*u,r=(t.min.y-h.y)*u),i>r||a>s||((a>i||isNaN(i))&&(i=a),(r<s||isNaN(s))&&(s=r),p>=0?(o=(t.min.z-h.z)*p,l=(t.max.z-h.z)*p):(o=(t.max.z-h.z)*p,l=(t.min.z-h.z)*p),i>l||o>s)||((o>i||i!==i)&&(i=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(i>=0?i:s,n)}intersectsBox(t){return this.intersectBox(t,ws)!==null}intersectTriangle(t,n,i,s,a){let r=this.origin,o=this.direction,l=o.x,c=o.y,u=o.z,p=t.x-r.x,h=t.y-r.y,f=t.z-r.z,m=n.x-r.x,b=n.y-r.y,y=n.z-r.z,d=i.x-r.x,g=i.y-r.y,M=i.z-r.z,v=Math.abs(l),T=Math.abs(c),E=Math.abs(u),w,x,A,R,O,z,G,L,H,J,Z,it;if(v>=T&&v>=E?(A=l,z=p,H=m,it=d,l>=0?(w=c,x=u,R=h,O=f,G=b,L=y,J=g,Z=M):(w=u,x=c,R=f,O=h,G=y,L=b,J=M,Z=g)):T>=E?(A=c,z=h,H=b,it=g,c>=0?(w=u,x=l,R=f,O=p,G=y,L=m,J=M,Z=d):(w=l,x=u,R=p,O=f,G=m,L=y,J=d,Z=M)):(A=u,z=f,H=y,it=M,u>=0?(w=l,x=c,R=p,O=h,G=m,L=b,J=d,Z=g):(w=c,x=l,R=h,O=p,G=b,L=m,J=g,Z=d)),A===0)return null;let X=w/A,tt=x/A,nt=1/A,wt=R-X*z,Et=O-tt*z,ge=G-X*H,Qt=L-tt*H,ne=J-X*it,q=Z-tt*it,$=ne*Qt-q*ge,_t=wt*q-Et*ne,Ot=ge*Et-Qt*wt;if(s){if($<0||_t<0||Ot<0)return null}else if(($<0||_t<0||Ot<0)&&($>0||_t>0||Ot>0))return null;let gt=$+_t+Ot;if(gt===0)return null;let Vt=nt*($*z+_t*H+Ot*it);return(gt>0?Vt<0:Vt>0)?null:this.at(Vt/gt,a)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},_i=class extends ja{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new te(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new da,this.combine=hg,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}},yS=new Ve,Ja=new wh,eh=new _o,_S=new V,nh=new V,ih=new V,sh=new V,Qm=new V,ah=new V,vS=new V,rh=new V,$e=class extends yi{constructor(t=new Vn,n=new _i){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=n,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,n){return super.copy(t,n),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){let n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){let s=n[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,r=s.length;a<r;a++){let o=s[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=a}}}}getVertexPosition(t,n){let i=this.geometry,s=i.attributes.position,a=i.morphAttributes.position,r=i.morphTargetsRelative;n.fromBufferAttribute(s,t);let o=this.morphTargetInfluences;if(a&&o){ah.set(0,0,0);for(let l=0,c=a.length;l<c;l++){let u=o[l],p=a[l];u!==0&&(Qm.fromBufferAttribute(p,t),r?ah.addScaledVector(Qm,u):ah.addScaledVector(Qm.sub(n),u))}n.add(ah)}return n}intersectsFrustum(t){return t.intersectsObject(this)}raycast(t,n){let i=this.geometry,s=this.material,a=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),eh.copy(i.boundingSphere),eh.applyMatrix4(a),Ja.copy(t.ray).recast(t.near),!(eh.containsPoint(Ja.origin)===!1&&(Ja.intersectSphere(eh,_S)===null||Ja.origin.distanceToSquared(_S)>(t.far-t.near)**2))&&(yS.copy(a).invert(),Ja.copy(t.ray).applyMatrix4(yS),!(i.boundingBox!==null&&Ja.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(t,n,Ja)))}_computeIntersections(t,n,i){let s,a=this.geometry,r=this.material,o=a.index,l=a.attributes.position,c=a.attributes.uv,u=a.attributes.uv1,p=a.attributes.normal,h=a.groups,f=a.drawRange;if(o!==null)if(Array.isArray(r))for(let m=0,b=h.length;m<b;m++){let y=h[m],d=r[y.materialIndex],g=Math.max(y.start,f.start),M=Math.min(o.count,Math.min(y.start+y.count,f.start+f.count));for(let v=g,T=M;v<T;v+=3){let E=o.getX(v),w=o.getX(v+1),x=o.getX(v+2);s=oh(this,d,t,i,c,u,p,E,w,x),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=y.materialIndex,n.push(s))}}else{let m=Math.max(0,f.start),b=Math.min(o.count,f.start+f.count);for(let y=m,d=b;y<d;y+=3){let g=o.getX(y),M=o.getX(y+1),v=o.getX(y+2);s=oh(this,r,t,i,c,u,p,g,M,v),s&&(s.faceIndex=Math.floor(y/3),n.push(s))}}else if(l!==void 0)if(Array.isArray(r))for(let m=0,b=h.length;m<b;m++){let y=h[m],d=r[y.materialIndex],g=Math.max(y.start,f.start),M=Math.min(l.count,Math.min(y.start+y.count,f.start+f.count));for(let v=g,T=M;v<T;v+=3){let E=v,w=v+1,x=v+2;s=oh(this,d,t,i,c,u,p,E,w,x),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=y.materialIndex,n.push(s))}}else{let m=Math.max(0,f.start),b=Math.min(l.count,f.start+f.count);for(let y=m,d=b;y<d;y+=3){let g=y,M=y+1,v=y+2;s=oh(this,r,t,i,c,u,p,g,M,v),s&&(s.faceIndex=Math.floor(y/3),n.push(s))}}}};function vE(e,t,n,i,s,a,r,o){let l;if(t.side===wn?l=i.intersectTriangle(r,a,s,!0,o):l=i.intersectTriangle(s,a,r,t.side===xa,o),l===null)return null;rh.copy(o),rh.applyMatrix4(e.matrixWorld);let c=n.ray.origin.distanceTo(rh);return c<n.near||c>n.far?null:{distance:c,point:rh.clone(),object:e}}function oh(e,t,n,i,s,a,r,o,l,c){e.getVertexPosition(o,nh),e.getVertexPosition(l,ih),e.getVertexPosition(c,sh);let u=vE(e,t,n,i,nh,ih,sh,vS);if(u){let p=new V;fa.getBarycoord(vS,nh,ih,sh,p),s&&(u.uv=fa.getInterpolatedAttribute(s,o,l,c,p,new $t)),a&&(u.uv1=fa.getInterpolatedAttribute(a,o,l,c,p,new $t)),r&&(u.normal=fa.getInterpolatedAttribute(r,o,l,c,p,new V),u.normal.dot(i.direction)>0&&u.normal.multiplyScalar(-1));let h={a:o,b:l,c,normal:new V,materialIndex:0};fa.getNormal(nh,ih,sh,h.normal),u.face=h,u.barycoord=p}return u}var Ch=class extends Sn{constructor(t=null,n=1,i=1,s,a,r,o,l,c=He,u=He,p,h){super(null,r,o,l,c,u,s,a,p,h),this.isDataTexture=!0,this.image={data:t,width:n,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Ka=new _o,xE=new $t(.5,.5),lh=new V,Wl=class{constructor(t=new Ui,n=new Ui,i=new Ui,s=new Ui,a=new Ui,r=new Ui){this.planes=[t,n,i,s,a,r]}set(t,n,i,s,a,r){let o=this.planes;return o[0].copy(t),o[1].copy(n),o[2].copy(i),o[3].copy(s),o[4].copy(a),o[5].copy(r),this}copy(t){let n=this.planes;for(let i=0;i<6;i++)n[i].copy(t.planes[i]);return this}setFromProjectionMatrix(t,n=Ni,i=!1){let s=this.planes,a=t.elements,r=a[0],o=a[1],l=a[2],c=a[3],u=a[4],p=a[5],h=a[6],f=a[7],m=a[8],b=a[9],y=a[10],d=a[11],g=a[12],M=a[13],v=a[14],T=a[15];if(s[0].setComponents(c-r,f-u,d-m,T-g).normalize(),s[1].setComponents(c+r,f+u,d+m,T+g).normalize(),s[2].setComponents(c+o,f+p,d+b,T+M).normalize(),s[3].setComponents(c-o,f-p,d-b,T-M).normalize(),i)s[4].setComponents(l,h,y,v).normalize(),s[5].setComponents(c-l,f-h,d-y,T-v).normalize();else if(s[4].setComponents(c-l,f-h,d-y,T-v).normalize(),n===Ni)s[5].setComponents(c+l,f+h,d+y,T+v).normalize();else if(n===Bl)s[5].setComponents(l,h,y,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+n);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Ka.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{let n=t.geometry;n.boundingSphere===null&&n.computeBoundingSphere(),Ka.copy(n.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Ka)}intersectsSprite(t){Ka.center.set(0,0,0);let n=xE.distanceTo(t.center);return Ka.radius=.7071067811865476+n,Ka.applyMatrix4(t.matrixWorld),this.intersectsSphere(Ka)}intersectsSphere(t){let n=this.planes,i=t.center,s=-t.radius;for(let a=0;a<6;a++)if(n[a].distanceToPoint(i)<s)return!1;return!0}intersectsBox(t){let n=this.planes;for(let i=0;i<6;i++){let s=n[i];if(lh.x=s.normal.x>0?t.max.x:t.min.x,lh.y=s.normal.y>0?t.max.y:t.min.y,lh.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(lh)<0)return!1}return!0}containsPoint(t){let n=this.planes;for(let i=0;i<6;i++)if(n[i].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var Xl=class extends Sn{constructor(t=[],n=Sa,i,s,a,r,o,l,c,u){super(t,n,i,s,a,r,o,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}};var ma=class extends Sn{constructor(t,n,i=Oi,s,a,r,o=He,l=He,c,u=Qi,p=1){if(u!==Qi&&u!==Ma)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let h={width:t,height:n,depth:p};super(h,s,a,r,o,l,u,i,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new go(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){let n=super.toJSON(t);return n.compareFunction=this.compareFunction,n}},Rh=class extends ma{constructor(t,n=Oi,i=Sa,s,a,r=He,o=He,l,c=Qi){let u={width:t,height:t,depth:1},p=[u,u,u,u,u,u];super(t,t,n,i,s,a,r,o,l,c),this.image=p,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(t){this.image=t}},ql=class extends Sn{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}},vo=class e extends Vn{constructor(t=1,n=1,i=1,s=1,a=1,r=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:n,depth:i,widthSegments:s,heightSegments:a,depthSegments:r};let o=this;s=Math.floor(s),a=Math.floor(a),r=Math.floor(r);let l=[],c=[],u=[],p=[],h=0,f=0;m("z","y","x",-1,-1,i,n,t,r,a,0),m("z","y","x",1,-1,i,n,-t,r,a,1),m("x","z","y",1,1,t,i,n,s,r,2),m("x","z","y",1,-1,t,i,-n,s,r,3),m("x","y","z",1,-1,t,n,i,s,a,4),m("x","y","z",-1,-1,t,n,-i,s,a,5),this.setIndex(l),this.setAttribute("position",new je(c,3)),this.setAttribute("normal",new je(u,3)),this.setAttribute("uv",new je(p,2));function m(b,y,d,g,M,v,T,E,w,x,A){let R=v/w,O=T/x,z=v/2,G=T/2,L=E/2,H=w+1,J=x+1,Z=0,it=0,X=new V;for(let tt=0;tt<J;tt++){let nt=tt*O-G;for(let wt=0;wt<H;wt++){let Et=wt*R-z;X[b]=Et*g,X[y]=nt*M,X[d]=L,c.push(X.x,X.y,X.z),X[b]=0,X[y]=0,X[d]=E>0?1:-1,u.push(X.x,X.y,X.z),p.push(wt/w),p.push(1-tt/x),Z+=1}}for(let tt=0;tt<x;tt++)for(let nt=0;nt<w;nt++){let wt=h+nt+H*tt,Et=h+nt+H*(tt+1),ge=h+(nt+1)+H*(tt+1),Qt=h+(nt+1)+H*tt;l.push(wt,Et,Qt),l.push(Et,ge,Qt),it+=6}o.addGroup(f,it,A),f+=it,h+=Z}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}};var Yl=class e extends Vn{constructor(t=1,n=32,i=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:n,thetaStart:i,thetaLength:s},n=Math.max(3,n);let a=[],r=[],o=[],l=[],c=new V,u=new $t;r.push(0,0,0),o.push(0,0,1),l.push(.5,.5);for(let p=0,h=3;p<=n;p++,h+=3){let f=i+p/n*s;c.x=t*Math.cos(f),c.y=t*Math.sin(f),r.push(c.x,c.y,c.z),o.push(0,0,1),u.x=(r[h]/t+1)/2,u.y=(r[h+1]/t+1)/2,l.push(u.x,u.y)}for(let p=1;p<=n;p++)a.push(p,p+1,0);this.setIndex(a),this.setAttribute("position",new je(r,3)),this.setAttribute("normal",new je(o,3)),this.setAttribute("uv",new je(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new e(t.radius,t.segments,t.thetaStart,t.thetaLength)}};var ga=class e extends Vn{constructor(t=1,n=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:n,widthSegments:i,heightSegments:s};let a=t/2,r=n/2,o=Math.floor(i),l=Math.floor(s),c=o+1,u=l+1,p=t/o,h=n/l,f=[],m=[],b=[],y=[];for(let d=0;d<u;d++){let g=d*h-r;for(let M=0;M<c;M++){let v=M*p-a;m.push(v,-g,0),b.push(0,0,1),y.push(M/o),y.push(1-d/l)}}for(let d=0;d<l;d++)for(let g=0;g<o;g++){let M=g+c*d,v=g+c*(d+1),T=g+1+c*(d+1),E=g+1+c*d;f.push(M,v,E),f.push(v,T,E)}this.setIndex(f),this.setAttribute("position",new je(m,3)),this.setAttribute("normal",new je(b,3)),this.setAttribute("uv",new je(y,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.widthSegments,t.heightSegments)}};function nr(e){let t={};for(let n in e){t[n]={};for(let i in e[n]){let s=e[n][i];if(xS(s))s.isRenderTargetTexture?(Rt("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[n][i]=null):t[n][i]=s.clone();else if(Array.isArray(s))if(xS(s[0])){let a=[];for(let r=0,o=s.length;r<o;r++)a[r]=s[r].clone();t[n][i]=a}else t[n][i]=s.slice();else t[n][i]=s}}return t}function bn(e){let t={};for(let n=0;n<e.length;n++){let i=nr(e[n]);for(let s in i)t[s]=i[s]}return t}function xS(e){return e&&(e.isColor||e.isMatrix3||e.isMatrix4||e.isVector2||e.isVector3||e.isVector4||e.isTexture||e.isQuaternion)}function SE(e){let t=[];for(let n=0;n<e.length;n++)t.push(e[n].clone());return t}function Dg(e){let t=e.getRenderTarget();return t===null?e.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Zt.workingColorSpace}var cb={clone:nr,merge:bn},bE=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,ME=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,ti=class extends ja{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=bE,this.fragmentShader=ME,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=nr(t.uniforms),this.uniformsGroups=SE(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this.defaultAttributeValues=Object.assign({},t.defaultAttributeValues),this.index0AttributeName=t.index0AttributeName,this.uniformsNeedUpdate=t.uniformsNeedUpdate,this}toJSON(t){let n=super.toJSON(t);n.glslVersion=this.glslVersion,n.uniforms={};for(let s in this.uniforms){let r=this.uniforms[s].value;r&&r.isTexture?n.uniforms[s]={type:"t",value:r.toJSON(t).uuid}:r&&r.isColor?n.uniforms[s]={type:"c",value:r.getHex()}:r&&r.isVector2?n.uniforms[s]={type:"v2",value:r.toArray()}:r&&r.isVector3?n.uniforms[s]={type:"v3",value:r.toArray()}:r&&r.isVector4?n.uniforms[s]={type:"v4",value:r.toArray()}:r&&r.isMatrix3?n.uniforms[s]={type:"m3",value:r.toArray()}:r&&r.isMatrix4?n.uniforms[s]={type:"m4",value:r.toArray()}:n.uniforms[s]={value:r}}Object.keys(this.defines).length>0&&(n.defines=this.defines),n.vertexShader=this.vertexShader,n.fragmentShader=this.fragmentShader,n.lights=this.lights,n.clipping=this.clipping;let i={};for(let s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(n.extensions=i),n}fromJSON(t,n){if(super.fromJSON(t,n),t.uniforms!==void 0)for(let i in t.uniforms){let s=t.uniforms[i];switch(this.uniforms[i]={},s.type){case"t":this.uniforms[i].value=n[s.value]||null;break;case"c":this.uniforms[i].value=new te().setHex(s.value);break;case"v2":this.uniforms[i].value=new $t().fromArray(s.value);break;case"v3":this.uniforms[i].value=new V().fromArray(s.value);break;case"v4":this.uniforms[i].value=new Le().fromArray(s.value);break;case"m3":this.uniforms[i].value=new Nt().fromArray(s.value);break;case"m4":this.uniforms[i].value=new Ve().fromArray(s.value);break;default:this.uniforms[i].value=s.value}}if(t.defines!==void 0&&(this.defines=t.defines),t.vertexShader!==void 0&&(this.vertexShader=t.vertexShader),t.fragmentShader!==void 0&&(this.fragmentShader=t.fragmentShader),t.glslVersion!==void 0&&(this.glslVersion=t.glslVersion),t.extensions!==void 0)for(let i in t.extensions)this.extensions[i]=t.extensions[i];return t.lights!==void 0&&(this.lights=t.lights),t.clipping!==void 0&&(this.clipping=t.clipping),this}},Dh=class extends ti{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}};var Uh=class extends ja{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=ZS,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}},Nh=class extends ja{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}};function co(e,t){return!e||e.constructor===t?e:typeof t.BYTES_PER_ELEMENT=="number"?new t(e):Array.prototype.slice.call(e)}function jm(e){return e!==void 0&&e.inTangents!==void 0&&e.outTangents!==void 0}var ya=class{constructor(t,n,i,s){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new n.constructor(i),this.sampleValues=n,this.valueSize=i,this.settings=null,this.DefaultSettings_={}}evaluate(t){let n=this.parameterPositions,i=this._cachedIndex,s=n[i],a=n[i-1];t:{e:{let r;n:{i:if(!(t<s)){for(let o=i+2;;){if(s===void 0){if(t<a)break i;return i=n.length,this._cachedIndex=i,this.copySampleValue_(i-1)}if(i===o)break;if(a=s,s=n[++i],t<s)break e}r=n.length;break n}if(!(t>=a)){let o=n[1];t<o&&(i=2,a=o);for(let l=i-2;;){if(a===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===l)break;if(s=a,a=n[--i-1],t>=a)break e}r=i,i=0;break n}break t}for(;i<r;){let o=i+r>>>1;t<n[o]?r=o:i=o+1}if(s=n[i],a=n[i-1],a===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return i=n.length,this._cachedIndex=i,this.copySampleValue_(i-1)}this._cachedIndex=i,this.intervalChanged_(i,a,s)}return this.interpolate_(i,a,t,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){let n=this.resultBuffer,i=this.sampleValues,s=this.valueSize,a=t*s;for(let r=0;r!==s;++r)n[r]=i[a+r];return n}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}},Lh=class extends ya{constructor(t,n,i,s){super(t,n,i,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:tg,endingEnd:tg}}intervalChanged_(t,n,i){let s=this.parameterPositions,a=t-2,r=t+1,o=s[a],l=s[r];if(o===void 0)switch(this.getSettings_().endingStart){case eg:a=t,o=2*n-i;break;case ng:a=s.length-2,o=n+s[a]-s[a+1];break;default:a=t,o=i}if(l===void 0)switch(this.getSettings_().endingEnd){case eg:r=t,l=2*i-n;break;case ng:r=1,l=i+s[1]-s[0];break;default:r=t-1,l=n}let c=(i-n)*.5,u=this.valueSize;this._weightPrev=c/(n-o),this._weightNext=c/(l-i),this._offsetPrev=a*u,this._offsetNext=r*u}interpolate_(t,n,i,s){let a=this.resultBuffer,r=this.sampleValues,o=this.valueSize,l=t*o,c=l-o,u=this._offsetPrev,p=this._offsetNext,h=this._weightPrev,f=this._weightNext,m=(i-n)/(s-n),b=m*m,y=b*m,d=-h*y+2*h*b-h*m,g=(1+h)*y+(-1.5-2*h)*b+(-.5+h)*m+1,M=(-1-f)*y+(1.5+f)*b+.5*m,v=f*y-f*b;for(let T=0;T!==o;++T)a[T]=d*r[u+T]+g*r[c+T]+M*r[l+T]+v*r[p+T];return a}},Oh=class extends ya{constructor(t,n,i,s){super(t,n,i,s)}interpolate_(t,n,i,s){let a=this.resultBuffer,r=this.sampleValues,o=this.valueSize,l=t*o,c=l-o,u=(i-n)/(s-n),p=1-u;for(let h=0;h!==o;++h)a[h]=r[c+h]*p+r[l+h]*u;return a}},Ih=class extends ya{constructor(t,n,i,s){super(t,n,i,s)}interpolate_(t){return this.copySampleValue_(t-1)}},Ph=class extends ya{interpolate_(t,n,i,s){let a=this.resultBuffer,r=this.sampleValues,o=this.valueSize,l=t*o,c=l-o,u=this.inTangents,p=this.outTangents;if(!u||!p){let m=(i-n)/(s-n),b=1-m;for(let y=0;y!==o;++y)a[y]=r[c+y]*b+r[l+y]*m;return a}let h=o*2,f=t-1;for(let m=0;m!==o;++m){let b=r[c+m],y=r[l+m],d=f*h+m*2,g=p[d],M=p[d+1],v=t*h+m*2,T=u[v],E=u[v+1],w=EE(i,n,g,T,s);a[m]=ub(w,b,M,E,y)}return a}};function ub(e,t,n,i,s){let a=1-e;return a*a*a*t+3*a*a*e*n+3*a*e*e*i+e*e*e*s}function TE(e,t,n,i,s){let a=1-e;return 3*a*a*(n-t)+6*a*e*(i-n)+3*e*e*(s-i)}function EE(e,t,n,i,s){let a=(e-t)/(s-t);for(let r=0;r<8;r++){let o=ub(a,t,n,i,s)-e;if(Math.abs(o)<1e-10)break;let l=TE(a,t,n,i,s);if(Math.abs(l)<1e-10)break;a=Math.max(0,Math.min(1,a-o/l))}return a}var ei=class{constructor(t,n,i,s){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(n===void 0||n.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=co(n,this.TimeBufferType),this.values=co(i,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(t){let n=t.constructor,i;if(n.toJSON!==this.toJSON)i=n.toJSON(t);else{i={name:t.name,times:co(t.times,Array),values:co(t.values,Array)};let s=t.getInterpolation();s!==t.DefaultInterpolation&&(i.interpolation=s),jm(t.settings)&&(i.settings={inTangents:co(t.settings.inTangents,Array),outTangents:co(t.settings.outTangents,Array)})}return i.type=t.ValueTypeName,i}InterpolantFactoryMethodDiscrete(t){return new Ih(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new Oh(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new Lh(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodBezier(t){let n=new Ph(this.times,this.values,this.getValueSize(),t);return this.settings&&(n.inTangents=this.settings.inTangents,n.outTangents=this.settings.outTangents),n}setInterpolation(t){let n;switch(t){case Ol:n=this.InterpolantFactoryMethodDiscrete;break;case bh:n=this.InterpolantFactoryMethodLinear;break;case hh:n=this.InterpolantFactoryMethodSmooth;break;case $m:n=this.InterpolantFactoryMethodBezier;break}if(n===void 0){let i="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(i);return Rt("KeyframeTrack:",i),this}return this.createInterpolant=n,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Ol;case this.InterpolantFactoryMethodLinear:return bh;case this.InterpolantFactoryMethodSmooth:return hh;case this.InterpolantFactoryMethodBezier:return $m}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){let n=this.times;for(let i=0,s=n.length;i!==s;++i)n[i]+=t}return this}scale(t){if(t!==1){let n=this.times;for(let i=0,s=n.length;i!==s;++i)n[i]*=t;jm(this.settings)&&(SS(this.settings.inTangents,t),SS(this.settings.outTangents,t))}return this}trim(t,n){let i=this.times,s=i.length,a=0,r=s-1;for(;a!==s&&i[a]<t;)++a;for(;r!==-1&&i[r]>n;)--r;if(++r,a!==0||r!==s){a>=r&&(r=Math.max(r,1),a=r-1);let o=this.getValueSize();this.times=i.slice(a,r),this.values=this.values.slice(a*o,r*o)}return this}validate(){let t=!0,n=this.getValueSize();n-Math.floor(n)!==0&&(Ut("KeyframeTrack: Invalid value size in track.",this),t=!1);let i=this.times,s=this.values,a=i.length;a===0&&(Ut("KeyframeTrack: Track is empty.",this),t=!1);let r=null;for(let o=0;o!==a;o++){let l=i[o];if(typeof l=="number"&&isNaN(l)){Ut("KeyframeTrack: Time is not a valid number.",this,o,l),t=!1;break}if(r!==null&&r>l){Ut("KeyframeTrack: Out of order keys.",this,o,l,r),t=!1;break}r=l}if(s!==void 0&&eE(s))for(let o=0,l=s.length;o!==l;++o){let c=s[o];if(isNaN(c)){Ut("KeyframeTrack: Value is not a valid number.",this,o,c),t=!1;break}}return t}optimize(){let t=this.times.slice(),n=this.values.slice(),i=this.getValueSize(),s=this.getInterpolation()===hh,a=t.length-1,r=1;for(let o=1;o<a;++o){let l=!1,c=t[o],u=t[o+1];if(c!==u&&(o!==1||c!==t[0]))if(s)l=!0;else{let p=o*i,h=p-i,f=p+i;for(let m=0;m!==i;++m){let b=n[p+m];if(b!==n[h+m]||b!==n[f+m]){l=!0;break}}}if(l){if(o!==r){t[r]=t[o];let p=o*i,h=r*i;for(let f=0;f!==i;++f)n[h+f]=n[p+f]}++r}}if(a>0){t[r]=t[a];for(let o=a*i,l=r*i,c=0;c!==i;++c)n[l+c]=n[o+c];++r}return r!==t.length?(this.times=t.slice(0,r),this.values=n.slice(0,r*i)):(this.times=t,this.values=n),this}clone(){let t=this.times.slice(),n=this.values.slice(),i=this.constructor,s=new i(this.name,t,n);return s.createInterpolant=this.createInterpolant,jm(this.settings)&&(s.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),s}};function SS(e,t){for(let n=0,i=e.length;n!==i;n+=2)e[n]*=t}ei.prototype.ValueTypeName="";ei.prototype.TimeBufferType=Float32Array;ei.prototype.ValueBufferType=Float32Array;ei.prototype.DefaultInterpolation=bh;var _a=class extends ei{constructor(t,n,i){super(t,n,i)}};_a.prototype.ValueTypeName="bool";_a.prototype.ValueBufferType=Array;_a.prototype.DefaultInterpolation=Ol;_a.prototype.InterpolantFactoryMethodLinear=void 0;_a.prototype.InterpolantFactoryMethodSmooth=void 0;var Bh=class extends ei{constructor(t,n,i,s){super(t,n,i,s)}};Bh.prototype.ValueTypeName="color";var zh=class extends ei{constructor(t,n,i,s){super(t,n,i,s)}};zh.prototype.ValueTypeName="number";var Fh=class extends ya{constructor(t,n,i,s){super(t,n,i,s)}interpolate_(t,n,i,s){let a=this.resultBuffer,r=this.sampleValues,o=this.valueSize,l=(i-n)/(s-n),c=t*o;for(let u=c+o;c!==u;c+=4)$i.slerpFlat(a,0,r,c-o,r,c,l);return a}},Zl=class extends ei{constructor(t,n,i,s){super(t,n,i,s)}InterpolantFactoryMethodLinear(t){return new Fh(this.times,this.values,this.getValueSize(),t)}};Zl.prototype.ValueTypeName="quaternion";Zl.prototype.InterpolantFactoryMethodSmooth=void 0;var va=class extends ei{constructor(t,n,i){super(t,n,i)}};va.prototype.ValueTypeName="string";va.prototype.ValueBufferType=Array;va.prototype.DefaultInterpolation=Ol;va.prototype.InterpolantFactoryMethodLinear=void 0;va.prototype.InterpolantFactoryMethodSmooth=void 0;var Vh=class extends ei{constructor(t,n,i,s){super(t,n,i,s)}};Vh.prototype.ValueTypeName="vector";var Hh=class{constructor(t,n,i){let s=this,a=!1,r=0,o=0,l,c=[];this.onStart=void 0,this.onLoad=t,this.onProgress=n,this.onError=i,this._abortController=null,this.itemStart=function(u){o++,a===!1&&s.onStart!==void 0&&s.onStart(u,r,o),a=!0},this.itemEnd=function(u){r++,s.onProgress!==void 0&&s.onProgress(u,r,o),r===o&&(a=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(u){s.onError!==void 0&&s.onError(u)},this.resolveURL=function(u){return u=u.normalize("NFC"),l?l(u):u},this.setURLModifier=function(u){return l=u,this},this.addHandler=function(u,p){return c.push(u,p),this},this.removeHandler=function(u){let p=c.indexOf(u);return p!==-1&&c.splice(p,2),this},this.getHandler=function(u){for(let p=0,h=c.length;p<h;p+=2){let f=c[p],m=c[p+1];if(f.global&&(f.lastIndex=0),f.test(u))return m}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},hb=new Hh,kh=class{constructor(t){this.manager=t!==void 0?t:hb,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(t,n){let i=this;return new Promise(function(s,a){i.load(t,s,n,a)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}abort(){return this}};kh.DEFAULT_MATERIAL_NAME="__DEFAULT";var ch=new V,uh=new $i,Ji=new V,Jl=class extends yi{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Ve,this.projectionMatrix=new Ve,this.projectionMatrixInverse=new Ve,this.coordinateSystem=Ni,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,n){return super.copy(t,n),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorld.decompose(ch,uh,Ji),Ji.x===1&&Ji.y===1&&Ji.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(ch,uh,Ji.set(1,1,1)).invert()}updateWorldMatrix(t,n,i=!1){super.updateWorldMatrix(t,n,i),this.matrixWorld.decompose(ch,uh,Ji),Ji.x===1&&Ji.y===1&&Ji.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(ch,uh,Ji.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},ha=new V,bS=new $t,MS=new $t,zn=class extends Jl{constructor(t=50,n=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=n,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,n){return super.copy(t,n),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){let n=.5*this.getFilmHeight()/t;this.fov=Mh*2*Math.atan(n),this.updateProjectionMatrix()}getFocalLength(){let t=Math.tan(Um*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Mh*2*Math.atan(Math.tan(Um*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,n,i){ha.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(ha.x,ha.y).multiplyScalar(-t/ha.z),ha.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(ha.x,ha.y).multiplyScalar(-t/ha.z)}getViewSize(t,n){return this.getViewBounds(t,bS,MS),n.subVectors(MS,bS)}setViewOffset(t,n,i,s,a,r){this.aspect=t/n,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=s,this.view.width=a,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=this.near,n=t*Math.tan(Um*.5*this.fov)/this.zoom,i=2*n,s=this.aspect*i,a=-.5*s,r=this.view;if(this.view!==null&&this.view.enabled){let l=r.fullWidth,c=r.fullHeight;a+=r.offsetX*s/l,n-=r.offsetY*i/c,s*=r.width/l,i*=r.height/c}let o=this.filmOffset;o!==0&&(a+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(a,a+s,n,n-i,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let n=super.toJSON(t);return n.object.fov=this.fov,n.object.zoom=this.zoom,n.object.near=this.near,n.object.far=this.far,n.object.focus=this.focus,n.object.aspect=this.aspect,this.view!==null&&(n.object.view=Object.assign({},this.view)),n.object.filmGauge=this.filmGauge,n.object.filmOffset=this.filmOffset,n}};var $a=class extends Jl{constructor(t=-1,n=1,i=1,s=-1,a=.1,r=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=n,this.top=i,this.bottom=s,this.near=a,this.far=r,this.updateProjectionMatrix()}copy(t,n){return super.copy(t,n),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,n,i,s,a,r){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=s,this.view.width=a,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=(this.right-this.left)/(2*this.zoom),n=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2,a=i-t,r=i+t,o=s+n,l=s-n;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;a+=c*this.view.offsetX,r=a+c*this.view.width,o-=u*this.view.offsetY,l=o-u*this.view.height}this.projectionMatrix.makeOrthographic(a,r,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let n=super.toJSON(t);return n.object.zoom=this.zoom,n.object.left=this.left,n.object.right=this.right,n.object.top=this.top,n.object.bottom=this.bottom,n.object.near=this.near,n.object.far=this.far,this.view!==null&&(n.object.view=Object.assign({},this.view)),n}};var uo=-90,ho=1,Gh=class extends yi{constructor(t,n,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new zn(uo,ho,t,n);s.layers=this.layers,this.add(s);let a=new zn(uo,ho,t,n);a.layers=this.layers,this.add(a);let r=new zn(uo,ho,t,n);r.layers=this.layers,this.add(r);let o=new zn(uo,ho,t,n);o.layers=this.layers,this.add(o);let l=new zn(uo,ho,t,n);l.layers=this.layers,this.add(l);let c=new zn(uo,ho,t,n);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let t=this.coordinateSystem,n=this.children.concat(),[i,s,a,r,o,l]=n;for(let c of n)this.remove(c);if(t===Ni)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),a.up.set(0,0,-1),a.lookAt(0,1,0),r.up.set(0,0,1),r.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===Bl)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),a.up.set(0,0,1),a.lookAt(0,1,0),r.up.set(0,0,-1),r.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(let c of n)this.add(c),c.updateMatrixWorld()}update(t,n){this.parent===null&&this.updateMatrixWorld();let{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());let[a,r,o,l,c,u]=this.children,p=t.getRenderTarget(),h=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),m=t.xr.enabled;t.xr.enabled=!1;let b=i.texture.generateMipmaps;i.texture.generateMipmaps=!1;let y=!1;t.isWebGLRenderer===!0?y=t.state.buffers.depth.getReversed():y=t.reversedDepthBuffer,t.setRenderTarget(i,0,s),y&&t.autoClear===!1&&t.clearDepth(),t.render(n,a),t.setRenderTarget(i,1,s),y&&t.autoClear===!1&&t.clearDepth(),t.render(n,r),t.setRenderTarget(i,2,s),y&&t.autoClear===!1&&t.clearDepth(),t.render(n,o),t.setRenderTarget(i,3,s),y&&t.autoClear===!1&&t.clearDepth(),t.render(n,l),t.setRenderTarget(i,4,s),y&&t.autoClear===!1&&t.clearDepth(),t.render(n,c),i.texture.generateMipmaps=b,t.setRenderTarget(i,5,s),y&&t.autoClear===!1&&t.clearDepth(),t.render(n,u),t.setRenderTarget(p,h,f),t.xr.enabled=m,i.texture.needsPMREMUpdate=!0}},Wh=class extends zn{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}};var Ug="\\[\\]\\.:\\/",AE=new RegExp("["+Ug+"]","g"),Ng="[^"+Ug+"]",wE="[^"+Ug.replace("\\.","")+"]",CE=/((?:WC+[\/:])*)/.source.replace("WC",Ng),RE=/(WCOD+)?/.source.replace("WCOD",wE),DE=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Ng),UE=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Ng),NE=new RegExp("^"+CE+RE+DE+UE+"$"),LE=["material","materials","bones","map"],ig=class{constructor(t,n,i){let s=i||we.parseTrackName(n);this._targetGroup=t,this._bindings=t.subscribe_(n,s)}getValue(t,n){this.bind();let i=this._targetGroup.nCachedObjects_,s=this._bindings[i];s!==void 0&&s.getValue(t,n)}setValue(t,n){let i=this._bindings;for(let s=this._targetGroup.nCachedObjects_,a=i.length;s!==a;++s)i[s].setValue(t,n)}bind(){let t=this._bindings;for(let n=this._targetGroup.nCachedObjects_,i=t.length;n!==i;++n)t[n].bind()}unbind(){let t=this._bindings;for(let n=this._targetGroup.nCachedObjects_,i=t.length;n!==i;++n)t[n].unbind()}},we=class e{constructor(t,n,i){this.path=n,this.parsedPath=i||e.parseTrackName(n),this.node=e.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,n,i){return t&&t.isAnimationObjectGroup?new e.Composite(t,n,i):new e(t,n,i)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(AE,"")}static parseTrackName(t){let n=NE.exec(t);if(n===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+t);let i={nodeName:n[2],objectName:n[3],objectIndex:n[4],propertyName:n[5],propertyIndex:n[6]},s=i.nodeName&&i.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let a=i.nodeName.substring(s+1);LE.indexOf(a)!==-1&&(i.nodeName=i.nodeName.substring(0,s),i.objectName=a)}if(i.propertyName===null||i.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+t);return i}static findNode(t,n){if(n===void 0||n===""||n==="."||n===-1||n===t.name||n===t.uuid)return t;if(t.skeleton){let i=t.skeleton.getBoneByName(n);if(i!==void 0)return i}if(t.children){let i=function(a){for(let r=0;r<a.length;r++){let o=a[r];if(o.name===n||o.uuid===n)return o;let l=i(o.children);if(l)return l}return null},s=i(t.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,n){t[n]=this.targetObject[this.propertyName]}_getValue_array(t,n){let i=this.resolvedProperty;for(let s=0,a=i.length;s!==a;++s)t[n++]=i[s]}_getValue_arrayElement(t,n){t[n]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,n){this.resolvedProperty.toArray(t,n)}_setValue_direct(t,n){this.targetObject[this.propertyName]=t[n]}_setValue_direct_setNeedsUpdate(t,n){this.targetObject[this.propertyName]=t[n],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,n){this.targetObject[this.propertyName]=t[n],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,n){let i=this.resolvedProperty;for(let s=0,a=i.length;s!==a;++s)i[s]=t[n++]}_setValue_array_setNeedsUpdate(t,n){let i=this.resolvedProperty;for(let s=0,a=i.length;s!==a;++s)i[s]=t[n++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,n){let i=this.resolvedProperty;for(let s=0,a=i.length;s!==a;++s)i[s]=t[n++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,n){this.resolvedProperty[this.propertyIndex]=t[n]}_setValue_arrayElement_setNeedsUpdate(t,n){this.resolvedProperty[this.propertyIndex]=t[n],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,n){this.resolvedProperty[this.propertyIndex]=t[n],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,n){this.resolvedProperty.fromArray(t,n)}_setValue_fromArray_setNeedsUpdate(t,n){this.resolvedProperty.fromArray(t,n),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,n){this.resolvedProperty.fromArray(t,n),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,n){this.bind(),this.getValue(t,n)}_setValue_unbound(t,n){this.bind(),this.setValue(t,n)}bind(){let t=this.node,n=this.parsedPath,i=n.objectName,s=n.propertyName,a=n.propertyIndex;if(t||(t=e.findNode(this.rootNode,n.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){Rt("PropertyBinding: No target node found for track: "+this.path+".");return}if(i){let c=n.objectIndex;switch(i){case"materials":if(!t.material){Ut("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){Ut("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){Ut("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let u=0;u<t.length;u++)if(t[u].name===c){c=u;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){Ut("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){Ut("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[i]===void 0){Ut("PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[i]}if(c!==void 0){if(t[c]===void 0){Ut("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[c]}}let r=t[s];if(r===void 0){let c=n.nodeName;Ut("PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",t);return}let o=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?o=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(a!==void 0){if(s==="morphTargetInfluences"){if(!t.geometry){Ut("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){Ut("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[a]!==void 0&&(a=t.morphTargetDictionary[a])}l=this.BindingType.ArrayElement,this.resolvedProperty=r,this.propertyIndex=a}else r.fromArray!==void 0&&r.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=r):Array.isArray(r)?(l=this.BindingType.EntireArray,this.resolvedProperty=r):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};we.Composite=ig;we.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};we.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};we.prototype.GetterByBindingType=[we.prototype._getValue_direct,we.prototype._getValue_array,we.prototype._getValue_arrayElement,we.prototype._getValue_toArray];we.prototype.SetterByBindingTypeAndVersioning=[[we.prototype._setValue_direct,we.prototype._setValue_direct_setNeedsUpdate,we.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[we.prototype._setValue_array,we.prototype._setValue_array_setNeedsUpdate,we.prototype._setValue_array_setMatrixWorldNeedsUpdate],[we.prototype._setValue_arrayElement,we.prototype._setValue_arrayElement_setNeedsUpdate,we.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[we.prototype._setValue_fromArray,we.prototype._setValue_fromArray_setNeedsUpdate,we.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var Q2=new Float32Array(1);var sg=class e{static{e.prototype.isMatrix2=!0}constructor(t,n,i,s){this.elements=[1,0,0,1],t!==void 0&&this.set(t,n,i,s)}identity(){return this.set(1,0,0,1),this}fromArray(t,n=0){for(let i=0;i<4;i++)this.elements[i]=t[i+n];return this}set(t,n,i,s){let a=this.elements;return a[0]=t,a[2]=n,a[1]=i,a[3]=s,this}};function Lg(e,t,n,i){let s=OE(i);switch(n){case Tg:return e*t;case Ag:return e*t/s.components*s.byteLength;case Qh:return e*t/s.components*s.byteLength;case Ta:return e*t*2/s.components*s.byteLength;case jh:return e*t*2/s.components*s.byteLength;case Eg:return e*t*3/s.components*s.byteLength;case xi:return e*t*4/s.components*s.byteLength;case $h:return e*t*4/s.components*s.byteLength;case $l:case tc:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case ec:case nc:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case ef:case sf:return Math.max(e,16)*Math.max(t,8)/4;case tf:case nf:return Math.max(e,8)*Math.max(t,8)/2;case af:case rf:case lf:case cf:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case of:case ic:case uf:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case hf:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case ff:return Math.floor((e+4)/5)*Math.floor((t+3)/4)*16;case df:return Math.floor((e+4)/5)*Math.floor((t+4)/5)*16;case pf:return Math.floor((e+5)/6)*Math.floor((t+4)/5)*16;case mf:return Math.floor((e+5)/6)*Math.floor((t+5)/6)*16;case gf:return Math.floor((e+7)/8)*Math.floor((t+4)/5)*16;case yf:return Math.floor((e+7)/8)*Math.floor((t+5)/6)*16;case _f:return Math.floor((e+7)/8)*Math.floor((t+7)/8)*16;case vf:return Math.floor((e+9)/10)*Math.floor((t+4)/5)*16;case xf:return Math.floor((e+9)/10)*Math.floor((t+5)/6)*16;case Sf:return Math.floor((e+9)/10)*Math.floor((t+7)/8)*16;case bf:return Math.floor((e+9)/10)*Math.floor((t+9)/10)*16;case Mf:return Math.floor((e+11)/12)*Math.floor((t+9)/10)*16;case Tf:return Math.floor((e+11)/12)*Math.floor((t+11)/12)*16;case Ef:case Af:case wf:return Math.ceil(e/4)*Math.ceil(t/4)*16;case Cf:case Rf:return Math.ceil(e/4)*Math.ceil(t/4)*8;case sc:case Df:return Math.ceil(e/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${n} format.`)}function OE(e){switch(e){case ni:case xg:return{byteLength:1,components:1};case bo:case Sg:case Pi:return{byteLength:2,components:1};case Jh:case Kh:return{byteLength:2,components:4};case Oi:case Zh:case Ii:return{byteLength:4,components:1};case bg:case Mg:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${e}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"186"}}));typeof window<"u"&&(window.__THREE__?Rt("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="186");function Lb(){let e=null,t=!1,n=null,i=null;function s(a,r){i=e.requestAnimationFrame(s),n(a,r)}return{start:function(){t!==!0&&n!==null&&e!==null&&(i=e.requestAnimationFrame(s),t=!0)},stop:function(){e!==null&&e.cancelAnimationFrame(i),t=!1},setAnimationLoop:function(a){n=a},setContext:function(a){e=a}}}function PE(e){let t=new WeakMap;function n(o,l){let c=o.array,u=o.usage,p=c.byteLength,h=e.createBuffer();e.bindBuffer(l,h),e.bufferData(l,c,u),o.onUploadCallback();let f;if(c instanceof Float32Array)f=e.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)f=e.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?f=e.HALF_FLOAT:f=e.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=e.SHORT;else if(c instanceof Uint32Array)f=e.UNSIGNED_INT;else if(c instanceof Int32Array)f=e.INT;else if(c instanceof Int8Array)f=e.BYTE;else if(c instanceof Uint8Array)f=e.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=e.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:h,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:p}}function i(o,l,c){let u=l.array,p=l.updateRanges;if(e.bindBuffer(c,o),p.length===0)e.bufferSubData(c,0,u);else{p.sort((f,m)=>f.start-m.start);let h=0;for(let f=1;f<p.length;f++){let m=p[h],b=p[f];b.start<=m.start+m.count+1?m.count=Math.max(m.count,b.start+b.count-m.start):(++h,p[h]=b)}p.length=h+1;for(let f=0,m=p.length;f<m;f++){let b=p[f];e.bufferSubData(c,b.start*u.BYTES_PER_ELEMENT,u,b.start,b.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function a(o){o.isInterleavedBufferAttribute&&(o=o.data);let l=t.get(o);l&&(e.deleteBuffer(l.buffer),t.delete(o))}function r(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){let u=t.get(o);(!u||u.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}let c=t.get(o);if(c===void 0)t.set(o,n(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,o,l),c.version=o.version}}return{get:s,remove:a,update:r}}var BE=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,zE=`#ifdef USE_ALPHAHASH
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
#endif`,FE=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,VE=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,HE=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,kE=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,GE=`#ifdef USE_AOMAP
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
#endif`,WE=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,XE=`#ifdef USE_BATCHING
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
#endif`,qE=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,YE=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,ZE=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,JE=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,KE=`#ifdef USE_IRIDESCENCE
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
#endif`,QE=`#ifdef USE_BUMPMAP
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
#endif`,jE=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,$E=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,tA=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,eA=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,nA=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,iA=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,sA=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,aA=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
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
#endif`,rA=`#define PI 3.141592653589793
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
} // validated`,oA=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,lA=`vec3 transformedNormal = objectNormal;
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
#endif`,cA=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,uA=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,hA=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,fA=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,dA="gl_FragColor = linearToOutputTexel( gl_FragColor );",pA=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,mA=`#ifdef USE_ENVMAP
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
#endif`,gA=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,yA=`#ifdef USE_ENVMAP
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
#endif`,_A=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,vA=`#ifdef USE_ENVMAP
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
#endif`,xA=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,SA=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,bA=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,MA=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,TA=`#ifdef USE_GRADIENTMAP
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
}`,EA=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,AA=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,wA=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,CA=`uniform bool receiveShadow;
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
#include <lightprobes_pars_fragment>`,RA=`#ifdef USE_ENVMAP
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
#endif`,DA=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,UA=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,NA=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,LA=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,OA=`PhysicalMaterial material;
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
#endif`,IA=`uniform sampler2D dfgLUT;
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
}`,PA=`
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
#endif`,BA=`#if defined( RE_IndirectDiffuse )
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
#endif`,zA=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,FA=`#ifdef USE_LIGHT_PROBES_GRID
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
#endif`,VA=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,HA=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,kA=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,GA=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,WA=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,XA=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,qA=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,YA=`#if defined( USE_POINTS_UV )
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
#endif`,ZA=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,JA=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,KA=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,QA=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,jA=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,$A=`#ifdef USE_MORPHTARGETS
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
#endif`,tw=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,ew=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,nw=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,iw=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,sw=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,aw=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,rw=`#ifdef USE_NORMALMAP
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
#endif`,ow=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,lw=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,cw=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,uw=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,hw=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,fw=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,dw=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,pw=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,mw=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,gw=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,yw=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,_w=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,vw=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,xw=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Sw=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,bw=`float getShadowMask() {
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
}`,Mw=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Tw=`#ifdef USE_SKINNING
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
#endif`,Ew=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Aw=`#ifdef USE_SKINNING
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
#endif`,ww=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Cw=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Rw=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Dw=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Uw=`#ifdef USE_TRANSMISSION
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
#endif`,Nw=`#ifdef USE_TRANSMISSION
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
#endif`,Lw=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Ow=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Iw=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Pw=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,Bw=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,zw=`uniform sampler2D t2D;
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
}`,Fw=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Vw=`#ifdef ENVMAP_TYPE_CUBE
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
}`,Hw=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,kw=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Gw=`#include <common>
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
}`,Ww=`#if DEPTH_PACKING == 3200
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
}`,Xw=`#define DISTANCE
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
}`,qw=`#define DISTANCE
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
}`,Yw=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Zw=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Jw=`uniform float scale;
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
}`,Kw=`uniform vec3 diffuse;
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
}`,Qw=`#include <common>
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
}`,jw=`uniform vec3 diffuse;
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
}`,$w=`#define LAMBERT
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
}`,tC=`#define LAMBERT
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
}`,eC=`#define MATCAP
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
}`,nC=`#define MATCAP
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
}`,iC=`#define NORMAL
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
}`,sC=`#define NORMAL
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
}`,aC=`#define PHONG
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
}`,rC=`#define PHONG
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
}`,oC=`#define STANDARD
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
}`,lC=`#define STANDARD
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
}`,cC=`#define TOON
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
}`,uC=`#define TOON
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
}`,hC=`uniform float size;
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
}`,fC=`uniform vec3 diffuse;
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
}`,dC=`#include <common>
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
}`,pC=`uniform vec3 color;
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
}`,mC=`uniform float rotation;
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
}`,gC=`uniform vec3 diffuse;
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
}`,Ft={alphahash_fragment:BE,alphahash_pars_fragment:zE,alphamap_fragment:FE,alphamap_pars_fragment:VE,alphatest_fragment:HE,alphatest_pars_fragment:kE,aomap_fragment:GE,aomap_pars_fragment:WE,batching_pars_vertex:XE,batching_vertex:qE,begin_vertex:YE,beginnormal_vertex:ZE,bsdfs:JE,iridescence_fragment:KE,bumpmap_pars_fragment:QE,clipping_planes_fragment:jE,clipping_planes_pars_fragment:$E,clipping_planes_pars_vertex:tA,clipping_planes_vertex:eA,color_fragment:nA,color_pars_fragment:iA,color_pars_vertex:sA,color_vertex:aA,common:rA,cube_uv_reflection_fragment:oA,defaultnormal_vertex:lA,displacementmap_pars_vertex:cA,displacementmap_vertex:uA,emissivemap_fragment:hA,emissivemap_pars_fragment:fA,colorspace_fragment:dA,colorspace_pars_fragment:pA,envmap_fragment:mA,envmap_common_pars_fragment:gA,envmap_pars_fragment:yA,envmap_pars_vertex:_A,envmap_physical_pars_fragment:RA,envmap_vertex:vA,fog_vertex:xA,fog_pars_vertex:SA,fog_fragment:bA,fog_pars_fragment:MA,gradientmap_pars_fragment:TA,lightmap_pars_fragment:EA,lights_lambert_fragment:AA,lights_lambert_pars_fragment:wA,lights_pars_begin:CA,lights_toon_fragment:DA,lights_toon_pars_fragment:UA,lights_phong_fragment:NA,lights_phong_pars_fragment:LA,lights_physical_fragment:OA,lights_physical_pars_fragment:IA,lights_fragment_begin:PA,lights_fragment_maps:BA,lights_fragment_end:zA,lightprobes_pars_fragment:FA,logdepthbuf_fragment:VA,logdepthbuf_pars_fragment:HA,logdepthbuf_pars_vertex:kA,logdepthbuf_vertex:GA,map_fragment:WA,map_pars_fragment:XA,map_particle_fragment:qA,map_particle_pars_fragment:YA,metalnessmap_fragment:ZA,metalnessmap_pars_fragment:JA,morphinstance_vertex:KA,morphcolor_vertex:QA,morphnormal_vertex:jA,morphtarget_pars_vertex:$A,morphtarget_vertex:tw,normal_fragment_begin:ew,normal_fragment_maps:nw,normal_pars_fragment:iw,normal_pars_vertex:sw,normal_vertex:aw,normalmap_pars_fragment:rw,clearcoat_normal_fragment_begin:ow,clearcoat_normal_fragment_maps:lw,clearcoat_pars_fragment:cw,iridescence_pars_fragment:uw,opaque_fragment:hw,packing:fw,premultiplied_alpha_fragment:dw,project_vertex:pw,dithering_fragment:mw,dithering_pars_fragment:gw,roughnessmap_fragment:yw,roughnessmap_pars_fragment:_w,shadowmap_pars_fragment:vw,shadowmap_pars_vertex:xw,shadowmap_vertex:Sw,shadowmask_pars_fragment:bw,skinbase_vertex:Mw,skinning_pars_vertex:Tw,skinning_vertex:Ew,skinnormal_vertex:Aw,specularmap_fragment:ww,specularmap_pars_fragment:Cw,tonemapping_fragment:Rw,tonemapping_pars_fragment:Dw,transmission_fragment:Uw,transmission_pars_fragment:Nw,uv_pars_fragment:Lw,uv_pars_vertex:Ow,uv_vertex:Iw,worldpos_vertex:Pw,background_vert:Bw,background_frag:zw,backgroundCube_vert:Fw,backgroundCube_frag:Vw,cube_vert:Hw,cube_frag:kw,depth_vert:Gw,depth_frag:Ww,distance_vert:Xw,distance_frag:qw,equirect_vert:Yw,equirect_frag:Zw,linedashed_vert:Jw,linedashed_frag:Kw,meshbasic_vert:Qw,meshbasic_frag:jw,meshlambert_vert:$w,meshlambert_frag:tC,meshmatcap_vert:eC,meshmatcap_frag:nC,meshnormal_vert:iC,meshnormal_frag:sC,meshphong_vert:aC,meshphong_frag:rC,meshphysical_vert:oC,meshphysical_frag:lC,meshtoon_vert:cC,meshtoon_frag:uC,points_vert:hC,points_frag:fC,shadow_vert:dC,shadow_frag:pC,sprite_vert:mC,sprite_frag:gC},ht={common:{diffuse:{value:new te(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Nt},alphaMap:{value:null},alphaMapTransform:{value:new Nt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Nt}},envmap:{envMap:{value:null},envMapRotation:{value:new Nt},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Nt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Nt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Nt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Nt},normalScale:{value:new $t(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Nt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Nt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Nt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Nt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new te(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new V},probesMax:{value:new V},probesResolution:{value:new V}},points:{diffuse:{value:new te(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Nt},alphaTest:{value:0},uvTransform:{value:new Nt}},sprite:{diffuse:{value:new te(16777215)},opacity:{value:1},center:{value:new $t(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Nt},alphaMap:{value:null},alphaMapTransform:{value:new Nt},alphaTest:{value:0}}},ns={basic:{uniforms:bn([ht.common,ht.specularmap,ht.envmap,ht.aomap,ht.lightmap,ht.fog]),vertexShader:Ft.meshbasic_vert,fragmentShader:Ft.meshbasic_frag},lambert:{uniforms:bn([ht.common,ht.specularmap,ht.envmap,ht.aomap,ht.lightmap,ht.emissivemap,ht.bumpmap,ht.normalmap,ht.displacementmap,ht.fog,ht.lights,{emissive:{value:new te(0)},envMapIntensity:{value:1}}]),vertexShader:Ft.meshlambert_vert,fragmentShader:Ft.meshlambert_frag},phong:{uniforms:bn([ht.common,ht.specularmap,ht.envmap,ht.aomap,ht.lightmap,ht.emissivemap,ht.bumpmap,ht.normalmap,ht.displacementmap,ht.fog,ht.lights,{emissive:{value:new te(0)},specular:{value:new te(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Ft.meshphong_vert,fragmentShader:Ft.meshphong_frag},standard:{uniforms:bn([ht.common,ht.envmap,ht.aomap,ht.lightmap,ht.emissivemap,ht.bumpmap,ht.normalmap,ht.displacementmap,ht.roughnessmap,ht.metalnessmap,ht.fog,ht.lights,{emissive:{value:new te(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ft.meshphysical_vert,fragmentShader:Ft.meshphysical_frag},toon:{uniforms:bn([ht.common,ht.aomap,ht.lightmap,ht.emissivemap,ht.bumpmap,ht.normalmap,ht.displacementmap,ht.gradientmap,ht.fog,ht.lights,{emissive:{value:new te(0)}}]),vertexShader:Ft.meshtoon_vert,fragmentShader:Ft.meshtoon_frag},matcap:{uniforms:bn([ht.common,ht.bumpmap,ht.normalmap,ht.displacementmap,ht.fog,{matcap:{value:null}}]),vertexShader:Ft.meshmatcap_vert,fragmentShader:Ft.meshmatcap_frag},points:{uniforms:bn([ht.points,ht.fog]),vertexShader:Ft.points_vert,fragmentShader:Ft.points_frag},dashed:{uniforms:bn([ht.common,ht.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ft.linedashed_vert,fragmentShader:Ft.linedashed_frag},depth:{uniforms:bn([ht.common,ht.displacementmap]),vertexShader:Ft.depth_vert,fragmentShader:Ft.depth_frag},normal:{uniforms:bn([ht.common,ht.bumpmap,ht.normalmap,ht.displacementmap,{opacity:{value:1}}]),vertexShader:Ft.meshnormal_vert,fragmentShader:Ft.meshnormal_frag},sprite:{uniforms:bn([ht.sprite,ht.fog]),vertexShader:Ft.sprite_vert,fragmentShader:Ft.sprite_frag},background:{uniforms:{uvTransform:{value:new Nt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ft.background_vert,fragmentShader:Ft.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Nt}},vertexShader:Ft.backgroundCube_vert,fragmentShader:Ft.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ft.cube_vert,fragmentShader:Ft.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ft.equirect_vert,fragmentShader:Ft.equirect_frag},distance:{uniforms:bn([ht.common,ht.displacementmap,{referencePosition:{value:new V},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ft.distance_vert,fragmentShader:Ft.distance_frag},shadow:{uniforms:bn([ht.lights,ht.fog,{color:{value:new te(0)},opacity:{value:1}}]),vertexShader:Ft.shadow_vert,fragmentShader:Ft.shadow_frag}};ns.physical={uniforms:bn([ns.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Nt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Nt},clearcoatNormalScale:{value:new $t(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Nt},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Nt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Nt},sheen:{value:0},sheenColor:{value:new te(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Nt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Nt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Nt},transmissionSamplerSize:{value:new $t},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Nt},attenuationDistance:{value:0},attenuationColor:{value:new te(0)},specularColor:{value:new te(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Nt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Nt},anisotropyVector:{value:new $t},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Nt}}]),vertexShader:Ft.meshphysical_vert,fragmentShader:Ft.meshphysical_frag};var Lf={r:0,b:0,g:0},yC=new Ve,Ob=new Nt;Ob.set(-1,0,0,0,1,0,0,0,1);function _C(e,t,n,i,s,a){let r=new te(0),o=s===!0?0:1,l,c,u=null,p=0,h=null;function f(g){let M=g.isScene===!0?g.background:null;if(M&&M.isTexture){let v=g.backgroundBlurriness>0;M=t.get(M,v)}return M}function m(g){let M=!1,v=f(g);v===null?y(r,o):v&&v.isColor&&(y(v,1),M=!0);let T=e.xr.getEnvironmentBlendMode();T==="additive"?n.buffers.color.setClear(0,0,0,1,a):T==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(e.autoClear||M)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil))}function b(g,M){let v=f(M);v&&(v.isCubeTexture||v.mapping===Ql)?(c===void 0&&(c=new $e(new vo(1,1,1),new ti({name:"BackgroundCubeMaterial",uniforms:nr(ns.backgroundCube.uniforms),vertexShader:ns.backgroundCube.vertexShader,fragmentShader:ns.backgroundCube.fragmentShader,side:wn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(T,E,w){this.matrixWorld.copyPosition(w.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(c)),c.material.uniforms.envMap.value=v,c.material.uniforms.backgroundBlurriness.value=M.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(yC.makeRotationFromEuler(M.backgroundRotation)).transpose(),v.isCubeTexture&&v.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(Ob),c.material.toneMapped=Zt.getTransfer(v.colorSpace)!==oe,(u!==v||p!==v.version||h!==e.toneMapping)&&(c.material.needsUpdate=!0,u=v,p=v.version,h=e.toneMapping),c.layers.enableAll(),g.unshift(c,c.geometry,c.material,0,0,null)):v&&v.isTexture&&(l===void 0&&(l=new $e(new ga(2,2),new ti({name:"BackgroundMaterial",uniforms:nr(ns.background.uniforms),vertexShader:ns.background.vertexShader,fragmentShader:ns.background.fragmentShader,side:xa,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(l)),l.material.uniforms.t2D.value=v,l.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,l.material.toneMapped=Zt.getTransfer(v.colorSpace)!==oe,v.matrixAutoUpdate===!0&&v.updateMatrix(),l.material.uniforms.uvTransform.value.copy(v.matrix),(u!==v||p!==v.version||h!==e.toneMapping)&&(l.material.needsUpdate=!0,u=v,p=v.version,h=e.toneMapping),l.layers.enableAll(),g.unshift(l,l.geometry,l.material,0,0,null))}function y(g,M){g.getRGB(Lf,Dg(e)),n.buffers.color.setClear(Lf.r,Lf.g,Lf.b,M,a)}function d(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return r},setClearColor:function(g,M=1){r.set(g),o=M,y(r,o)},getClearAlpha:function(){return o},setClearAlpha:function(g){o=g,y(r,o)},render:m,addToRenderList:b,dispose:d}}function vC(e,t){let n=e.getParameter(e.MAX_VERTEX_ATTRIBS),i={},s=h(null),a=s,r=!1;function o(O,z,G,L,H){let J=!1,Z=p(O,L,G,z);a!==Z&&(a=Z,c(a.object)),J=f(O,L,G,H),J&&m(O,L,G,H),H!==null&&t.update(H,e.ELEMENT_ARRAY_BUFFER),(J||r)&&(r=!1,v(O,z,G,L),H!==null&&e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,t.get(H).buffer))}function l(){return e.createVertexArray()}function c(O){return e.bindVertexArray(O)}function u(O){return e.deleteVertexArray(O)}function p(O,z,G,L){let H=L.wireframe===!0,J=i[z.id];J===void 0&&(J={},i[z.id]=J);let Z=O.isInstancedMesh===!0?O.id:0,it=J[Z];it===void 0&&(it={},J[Z]=it);let X=it[G.id];X===void 0&&(X={},it[G.id]=X);let tt=X[H];return tt===void 0&&(tt=h(l()),X[H]=tt),tt}function h(O){let z=[],G=[],L=[];for(let H=0;H<n;H++)z[H]=0,G[H]=0,L[H]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:z,enabledAttributes:G,attributeDivisors:L,object:O,attributes:{},index:null}}function f(O,z,G,L){let H=a.attributes,J=z.attributes,Z=0,it=G.getAttributes();for(let X in it)if(it[X].location>=0){let nt=H[X],wt=J[X];if(wt===void 0&&(X==="instanceMatrix"&&O.instanceMatrix&&(wt=O.instanceMatrix),X==="instanceColor"&&O.instanceColor&&(wt=O.instanceColor)),nt===void 0||nt.attribute!==wt||wt&&nt.data!==wt.data)return!0;Z++}return a.attributesNum!==Z||a.index!==L}function m(O,z,G,L){let H={},J=z.attributes,Z=0,it=G.getAttributes();for(let X in it)if(it[X].location>=0){let nt=J[X];nt===void 0&&(X==="instanceMatrix"&&O.instanceMatrix&&(nt=O.instanceMatrix),X==="instanceColor"&&O.instanceColor&&(nt=O.instanceColor));let wt={};wt.attribute=nt,nt&&nt.data&&(wt.data=nt.data),H[X]=wt,Z++}a.attributes=H,a.attributesNum=Z,a.index=L}function b(){let O=a.newAttributes;for(let z=0,G=O.length;z<G;z++)O[z]=0}function y(O){d(O,0)}function d(O,z){let G=a.newAttributes,L=a.enabledAttributes,H=a.attributeDivisors;G[O]=1,L[O]===0&&(e.enableVertexAttribArray(O),L[O]=1),H[O]!==z&&(e.vertexAttribDivisor(O,z),H[O]=z)}function g(){let O=a.newAttributes,z=a.enabledAttributes;for(let G=0,L=z.length;G<L;G++)z[G]!==O[G]&&(e.disableVertexAttribArray(G),z[G]=0)}function M(O,z,G,L,H,J,Z){Z===!0?e.vertexAttribIPointer(O,z,G,H,J):e.vertexAttribPointer(O,z,G,L,H,J)}function v(O,z,G,L){b();let H=L.attributes,J=G.getAttributes(),Z=z.defaultAttributeValues;for(let it in J){let X=J[it];if(X.location>=0){let tt=H[it];if(tt===void 0&&(it==="instanceMatrix"&&O.instanceMatrix&&(tt=O.instanceMatrix),it==="instanceColor"&&O.instanceColor&&(tt=O.instanceColor)),tt!==void 0){let nt=tt.normalized,wt=tt.itemSize,Et=t.get(tt);if(Et===void 0)continue;let ge=Et.buffer,Qt=Et.type,ne=Et.bytesPerElement,q=Qt===e.INT||Qt===e.UNSIGNED_INT||tt.gpuType===Zh;if(tt.isInterleavedBufferAttribute){let $=tt.data,_t=$.stride,Ot=tt.offset;if($.isInstancedInterleavedBuffer){for(let gt=0;gt<X.locationSize;gt++)d(X.location+gt,$.meshPerAttribute);O.isInstancedMesh!==!0&&L._maxInstanceCount===void 0&&(L._maxInstanceCount=$.meshPerAttribute*$.count)}else for(let gt=0;gt<X.locationSize;gt++)y(X.location+gt);e.bindBuffer(e.ARRAY_BUFFER,ge);for(let gt=0;gt<X.locationSize;gt++)M(X.location+gt,wt/X.locationSize,Qt,nt,_t*ne,(Ot+wt/X.locationSize*gt)*ne,q)}else{if(tt.isInstancedBufferAttribute){for(let $=0;$<X.locationSize;$++)d(X.location+$,tt.meshPerAttribute);O.isInstancedMesh!==!0&&L._maxInstanceCount===void 0&&(L._maxInstanceCount=tt.meshPerAttribute*tt.count)}else for(let $=0;$<X.locationSize;$++)y(X.location+$);e.bindBuffer(e.ARRAY_BUFFER,ge);for(let $=0;$<X.locationSize;$++)M(X.location+$,wt/X.locationSize,Qt,nt,wt*ne,wt/X.locationSize*$*ne,q)}}else if(Z!==void 0){let nt=Z[it];if(nt!==void 0)switch(nt.length){case 2:e.vertexAttrib2fv(X.location,nt);break;case 3:e.vertexAttrib3fv(X.location,nt);break;case 4:e.vertexAttrib4fv(X.location,nt);break;default:e.vertexAttrib1fv(X.location,nt)}}}}g()}function T(){A();for(let O in i){let z=i[O];for(let G in z){let L=z[G];for(let H in L){let J=L[H];for(let Z in J)u(J[Z].object),delete J[Z];delete L[H]}}delete i[O]}}function E(O){if(i[O.id]===void 0)return;let z=i[O.id];for(let G in z){let L=z[G];for(let H in L){let J=L[H];for(let Z in J)u(J[Z].object),delete J[Z];delete L[H]}}delete i[O.id]}function w(O){for(let z in i){let G=i[z];for(let L in G){let H=G[L];if(H[O.id]===void 0)continue;let J=H[O.id];for(let Z in J)u(J[Z].object),delete J[Z];delete H[O.id]}}}function x(O){for(let z in i){let G=i[z],L=O.isInstancedMesh===!0?O.id:0,H=G[L];if(H!==void 0){for(let J in H){let Z=H[J];for(let it in Z)u(Z[it].object),delete Z[it];delete H[J]}delete G[L],Object.keys(G).length===0&&delete i[z]}}}function A(){R(),r=!0,a!==s&&(a=s,c(a.object))}function R(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:A,resetDefaultState:R,dispose:T,releaseStatesOfGeometry:E,releaseStatesOfObject:x,releaseStatesOfProgram:w,initAttributes:b,enableAttribute:y,disableUnusedAttributes:g}}function xC(e,t,n){let i;function s(l){i=l}function a(l,c){e.drawArrays(i,l,c),n.update(c,i,1)}function r(l,c,u){u!==0&&(e.drawArraysInstanced(i,l,c,u),n.update(c,i,u))}function o(l,c,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,c,0,u);let h=0;for(let f=0;f<u;f++)h+=c[f];n.update(h,i,1)}this.setMode=s,this.render=a,this.renderInstances=r,this.renderMultiDraw=o}function SC(e,t,n,i){let s;function a(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){let w=t.get("EXT_texture_filter_anisotropic");s=e.getParameter(w.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function r(w){return!(w!==xi&&i.convert(w)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(w){let x=w===Pi&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(w!==ni&&w!==Ii&&!x&&i.convert(w)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_TYPE))}function l(w){if(w==="highp"){if(e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.HIGH_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.HIGH_FLOAT).precision>0)return"highp";w="mediump"}return w==="mediump"&&e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.MEDIUM_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=n.precision!==void 0?n.precision:"highp",u=l(c);u!==c&&(Rt("WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);let p=n.logarithmicDepthBuffer===!0,h=n.reversedDepthBuffer===!0&&t.has("EXT_clip_control");n.reversedDepthBuffer===!0&&h===!1&&Rt("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");let f=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),m=e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS),b=e.getParameter(e.MAX_TEXTURE_SIZE),y=e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE),d=e.getParameter(e.MAX_VERTEX_ATTRIBS),g=e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS),M=e.getParameter(e.MAX_VARYING_VECTORS),v=e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS),T=e.getParameter(e.MAX_SAMPLES),E=e.getParameter(e.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:l,textureFormatReadable:r,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:p,reversedDepthBuffer:h,maxTextures:f,maxVertexTextures:m,maxTextureSize:b,maxCubemapSize:y,maxAttributes:d,maxVertexUniforms:g,maxVaryings:M,maxFragmentUniforms:v,maxSamples:T,samples:E}}function bC(e){let t=this,n=null,i=0,s=!1,a=!1,r=new Ui,o=new Nt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(p,h){let f=p.length!==0||h||i!==0||s;return s=h,i=p.length,f},this.beginShadows=function(){a=!0,u(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(p,h){n=u(p,h,0)},this.setState=function(p,h,f){let m=p.clippingPlanes,b=p.clipIntersection,y=p.clipShadows,d=e.get(p);if(!s||m===null||m.length===0||a&&!y)a?u(null):c();else{let g=a?0:i,M=g*4,v=d.clippingState||null;l.value=v,v=u(m,h,M,f);for(let T=0;T!==M;++T)v[T]=n[T];d.clippingState=v,this.numIntersection=b?this.numPlanes:0,this.numPlanes+=g}};function c(){l.value!==n&&(l.value=n,l.needsUpdate=i>0),t.numPlanes=i,t.numIntersection=0}function u(p,h,f,m){let b=p!==null?p.length:0,y=null;if(b!==0){if(y=l.value,m!==!0||y===null){let d=f+b*4,g=h.matrixWorldInverse;o.getNormalMatrix(g),(y===null||y.length<d)&&(y=new Float32Array(d));for(let M=0,v=f;M!==b;++M,v+=4)r.copy(p[M]).applyMatrix4(g,o),r.normal.toArray(y,v),y[v+3]=r.constant}l.value=y,l.needsUpdate=!0}return t.numPlanes=b,t.numIntersection=0,y}}var Eo=4,MC=6,TC=20,EC=256,rc=new $a,fb=new te,Og=null,Ig=0,Pg=0,Bg=!1,AC=new V,ir=new V,If=class{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(t,n=0,i=.1,s=100,a={}){let{size:r=256,position:o=AC}=a;Og=this._renderer.getRenderTarget(),Ig=this._renderer.getActiveCubeFace(),Pg=this._renderer.getActiveMipmapLevel(),Bg=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(r);let l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(t,i,s,l,o),n>0&&this._blur(l,0,0,n),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(t,n=null){return this._fromTexture(t,n)}fromCubemap(t,n=null){return this._fromTexture(t,n)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=mb(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=pb(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodMeshes.length;t++)this._lodMeshes[t].geometry.dispose()}_cleanup(t){this._renderer.setRenderTarget(Og,Ig,Pg),this._renderer.xr.enabled=Bg,t.scissorTest=!1,To(t,0,0,t.width,t.height)}_fromTexture(t,n){t.mapping===Sa||t.mapping===er?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Og=this._renderer.getRenderTarget(),Ig=this._renderer.getActiveCubeFace(),Pg=this._renderer.getActiveMipmapLevel(),Bg=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let i=n||this._allocateTargets();return this._textureToCubeUV(t,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){let t=3*Math.max(this._cubeSize,112),n=4*this._cubeSize,i={magFilter:pn,minFilter:pn,generateMipmaps:!1,type:Pi,format:xi,colorSpace:Il,depthBuffer:!1},s=db(t,n,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==n){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=db(t,n,i);let{_lodMax:a}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=wC(a)),this._blurMaterial=RC(a,t,n),this._ggxMaterial=CC(a,t,n)}return s}_compileMaterial(t){let n=new $e(new Vn,t);this._renderer.compile(n,rc)}_sceneToCubeUV(t,n,i,s,a){let l=new zn(90,1,n,i),c=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],p=this._renderer,h=p.autoClear,f=p.toneMapping;p.getClearColor(fb),p.toneMapping=Li,p.autoClear=!1,p.state.buffers.depth.getReversed()&&(p.setRenderTarget(s),p.clearDepth(),p.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new $e(new vo,new _i({name:"PMREM.Background",side:wn,depthWrite:!1,depthTest:!1})));let b=this._backgroundBox,y=b.material,d=!1,g=t.background;g?g.isColor&&(y.color.copy(g),t.background=null,d=!0):(y.color.copy(fb),d=!0);for(let M=0;M<6;M++){let v=M%3;v===0?(l.up.set(0,c[M],0),l.position.set(a.x,a.y,a.z),l.lookAt(a.x+u[M],a.y,a.z)):v===1?(l.up.set(0,0,c[M]),l.position.set(a.x,a.y,a.z),l.lookAt(a.x,a.y+u[M],a.z)):(l.up.set(0,c[M],0),l.position.set(a.x,a.y,a.z),l.lookAt(a.x,a.y,a.z+u[M]));let T=this._cubeSize;To(s,v*T,M>2?T:0,T,T),p.setRenderTarget(s),d&&p.render(b,l),p.render(t,l)}p.toneMapping=f,p.autoClear=h,t.background=g}_textureToCubeUV(t,n){let i=this._renderer,s=t.mapping===Sa||t.mapping===er;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=mb()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=pb());let a=s?this._cubemapMaterial:this._equirectMaterial,r=this._lodMeshes[0];r.material=a;let o=a.uniforms;o.envMap.value=t;let l=this._cubeSize;To(n,0,0,3*l,2*l),i.setRenderTarget(n),i.render(r,rc)}_applyPMREM(t){let n=this._renderer,i=n.autoClear;n.autoClear=!1;let s=this._lodMeshes.length;for(let a=1;a<s;a++)this._applyGGXFilter(t,a-1,a);n.autoClear=i}_applyGGXFilter(t,n,i){let s=this._renderer,a=this._pingPongRenderTarget,r=this._ggxMaterial,o=this._lodMeshes[i];o.material=r;let l=r.uniforms,c=i/(this._lodMeshes.length-1),u=n/(this._lodMeshes.length-1),p=Math.sqrt(c*c-u*u),h=c*1.25,f=p*h,{_lodMax:m}=this,b=this._sizeLods[i],y=3*b*(i>m-Eo?i-m+Eo:0),d=4*(this._cubeSize-b);l.envMap.value=t.texture,l.roughness.value=f,l.mipInt.value=m-n,To(a,y,d,3*b,2*b),s.setRenderTarget(a),s.render(o,rc),l.envMap.value=a.texture,l.roughness.value=0,l.mipInt.value=m-i,To(t,y,d,3*b,2*b),s.setRenderTarget(t),s.render(o,rc)}_blur(t,n,i,s){let a=this._pingPongRenderTarget,r=Math.min(s,Math.PI)/Math.SQRT2;this._blurPass(t,a,n,i,r),this._blurPass(a,t,i,i,r)}_blurPass(t,n,i,s,a){let r=this._renderer,o=this._blurMaterial,l=this._lodMeshes[s];l.material=o;let c=o.uniforms;c.envMap.value=t.texture,c.sigma.value=a,c.mipInt.value=this._lodMax-i;let u=this._sizeLods[s],p=3*u*(s>this._lodMax-Eo?s-this._lodMax+Eo:0),h=4*(this._cubeSize-u);To(n,p,h,3*u,2*u),r.setRenderTarget(n),r.render(l,rc)}};function wC(e){let t=[],n=[],i=e,s=e-Eo+1+MC;for(let a=0;a<s;a++){let r=Math.pow(2,i);t.push(r);let o=1/(r-2),l=-o,c=1+o,u=[l,l,c,l,c,c,l,l,c,c,l,c],p=6,h=6,f=3,m=new Float32Array(f*h*p),b=new Float32Array(f*h*p);for(let d=0;d<p;d++){let g=d%3*2/3-1,M=d>2?0:-1,v=[g,M,0,g+2/3,M,0,g+2/3,M+1,0,g,M,0,g+2/3,M+1,0,g,M+1,0];m.set(v,f*h*d);for(let T=0;T<h;T++){let E=u[T*2]*2-1,w=u[T*2+1]*2-1;d===0?ir.set(1,w,E):d===1?ir.set(-E,1,-w):d===2?ir.set(-E,w,1):d===3?ir.set(-1,w,-E):d===4?ir.set(-E,-1,w):ir.set(E,w,-1),ir.toArray(b,(d*h+T)*f)}}let y=new Vn;y.setAttribute("position",new gi(m,f)),y.setAttribute("outputDirection",new gi(b,f)),n.push(new $e(y,null)),i>Eo&&i--}return{lodMeshes:n,sizeLods:t}}function db(e,t,n){let i=new Fn(e,t,n);return i.texture.mapping=Ql,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function To(e,t,n,i,s){e.viewport.set(t,n,i,s),e.scissor.set(t,n,i,s)}function CC(e,t,n){return new ti({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:EC,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:zf(),fragmentShader:`

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
		`,blending:ts,depthTest:!1,depthWrite:!1})}function RC(e,t,n){return new ti({name:"SphericalGaussianBlur",defines:{SAMPLES:TC,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:zf(),fragmentShader:`

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
		`,blending:ts,depthTest:!1,depthWrite:!1})}function pb(){return new ti({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:zf(),fragmentShader:`

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
		`,blending:ts,depthTest:!1,depthWrite:!1})}function mb(){return new ti({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:zf(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:ts,depthTest:!1,depthWrite:!1})}function zf(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}var Pf=class extends Fn{constructor(t=1,n={}){super(t,t,n),this.isWebGLCubeRenderTarget=!0;let i={width:t,height:t,depth:1},s=[i,i,i,i,i,i];this.texture=new Xl(s),this._setTextureOptions(n),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,n){this.texture.type=n.type,this.texture.colorSpace=n.colorSpace,this.texture.generateMipmaps=n.generateMipmaps,this.texture.minFilter=n.minFilter,this.texture.magFilter=n.magFilter;let i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new vo(5,5,5),a=new ti({name:"CubemapFromEquirect",uniforms:nr(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:wn,blending:ts});a.uniforms.tEquirect.value=n;let r=new $e(s,a),o=n.minFilter;return n.minFilter===ba&&(n.minFilter=pn),new Gh(1,10,this).update(t,r),n.minFilter=o,r.geometry.dispose(),r.material.dispose(),this}clear(t,n=!0,i=!0,s=!0){let a=t.getRenderTarget();for(let r=0;r<6;r++)t.setRenderTarget(this,r),t.clear(n,i,s);t.setRenderTarget(a)}};function DC(e){let t=new WeakMap,n=new WeakMap,i=null;function s(h,f=!1){return h==null?null:f?r(h):a(h)}function a(h){if(h&&h.isTexture){let f=h.mapping;if(f===Xh||f===qh)if(t.has(h)){let m=t.get(h).texture;return o(m,h.mapping)}else{let m=h.image;if(m&&m.height>0){let b=new Pf(m.height);return b.fromEquirectangularTexture(e,h),t.set(h,b),h.addEventListener("dispose",c),o(b.texture,h.mapping)}else return null}}return h}function r(h){if(h&&h.isTexture){let f=h.mapping,m=f===Xh||f===qh,b=f===Sa||f===er;if(m||b){let y=n.get(h),d=y!==void 0?y.texture.pmremVersion:0;if(h.isRenderTargetTexture&&h.pmremVersion!==d)return i===null&&(i=new If(e)),y=m?i.fromEquirectangular(h,y):i.fromCubemap(h,y),y.texture.pmremVersion=h.pmremVersion,n.set(h,y),y.texture;if(y!==void 0)return y.texture;{let g=h.image;return m&&g&&g.height>0||b&&g&&l(g)?(i===null&&(i=new If(e)),y=m?i.fromEquirectangular(h):i.fromCubemap(h),y.texture.pmremVersion=h.pmremVersion,n.set(h,y),h.addEventListener("dispose",u),y.texture):null}}}return h}function o(h,f){return f===Xh?h.mapping=Sa:f===qh&&(h.mapping=er),h}function l(h){let f=0,m=6;for(let b=0;b<m;b++)h[b]!==void 0&&f++;return f===m}function c(h){let f=h.target;f.removeEventListener("dispose",c);let m=t.get(f);m!==void 0&&(t.delete(f),m.dispose())}function u(h){let f=h.target;f.removeEventListener("dispose",u);let m=n.get(f);m!==void 0&&(n.delete(f),m.dispose())}function p(){t=new WeakMap,n=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:s,dispose:p}}function UC(e){let t={};function n(i){if(t[i]!==void 0)return t[i];let s=e.getExtension(i);return t[i]=s,s}return{has:function(i){return n(i)!==null},init:function(){n("EXT_color_buffer_float"),n("WEBGL_clip_cull_distance"),n("OES_texture_float_linear"),n("EXT_color_buffer_half_float"),n("WEBGL_multisampled_render_to_texture"),n("WEBGL_render_shared_exponent")},get:function(i){let s=n(i);return s===null&&Qa("WebGLRenderer: "+i+" extension not supported."),s}}}function NC(e,t,n,i){let s={},a=new WeakMap;function r(p){let h=p.target;h.index!==null&&t.remove(h.index);for(let m in h.attributes)t.remove(h.attributes[m]);h.removeEventListener("dispose",r),delete s[h.id];let f=a.get(h);f&&(t.remove(f),a.delete(h)),i.releaseStatesOfGeometry(h),h.isInstancedBufferGeometry===!0&&delete h._maxInstanceCount,n.memory.geometries--}function o(p,h){return s[h.id]===!0||(h.addEventListener("dispose",r),s[h.id]=!0,n.memory.geometries++),h}function l(p){let h=p.attributes;for(let f in h)t.update(h[f],e.ARRAY_BUFFER)}function c(p){let h=[],f=p.index,m=p.attributes.position,b=0;if(m===void 0)return;if(f!==null){let g=f.array;b=f.version;for(let M=0,v=g.length;M<v;M+=3){let T=g[M+0],E=g[M+1],w=g[M+2];h.push(T,E,E,w,w,T)}}else{let g=m.array;b=m.version;for(let M=0,v=g.length/3-1;M<v;M+=3){let T=M+0,E=M+1,w=M+2;h.push(T,E,E,w,w,T)}}let y=new(m.count>=65535?Gl:kl)(h,1);y.version=b;let d=a.get(p);d&&t.remove(d),a.set(p,y)}function u(p){let h=a.get(p);if(h){let f=p.index;f!==null&&h.version<f.version&&c(p)}else c(p);return a.get(p)}return{get:o,update:l,getWireframeAttribute:u}}function LC(e,t,n){let i;function s(p){i=p}let a,r;function o(p){a=p.type,r=p.bytesPerElement}function l(p,h){e.drawElements(i,h,a,p*r),n.update(h,i,1)}function c(p,h,f){f!==0&&(e.drawElementsInstanced(i,h,a,p*r,f),n.update(h,i,f))}function u(p,h,f){if(f===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,h,0,a,p,0,f);let b=0;for(let y=0;y<f;y++)b+=h[y];n.update(b,i,1)}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=u}function OC(e){let t={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function i(a,r,o){switch(n.calls++,r){case e.TRIANGLES:n.triangles+=o*(a/3);break;case e.LINES:n.lines+=o*(a/2);break;case e.LINE_STRIP:n.lines+=o*(a-1);break;case e.LINE_LOOP:n.lines+=o*a;break;case e.POINTS:n.points+=o*a;break;default:Ut("WebGLInfo: Unknown draw mode:",r);break}}function s(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:t,render:n,programs:null,autoReset:!0,reset:s,update:i}}function IC(e,t,n){let i=new WeakMap,s=new Le;function a(r,o,l){let c=r.morphTargetInfluences,u=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,p=u!==void 0?u.length:0,h=i.get(o);if(h===void 0||h.count!==p){let A=function(){w.dispose(),i.delete(o),o.removeEventListener("dispose",A)};h!==void 0&&h.texture.dispose();let f=o.morphAttributes.position!==void 0,m=o.morphAttributes.normal!==void 0,b=o.morphAttributes.color!==void 0,y=o.morphAttributes.position||[],d=o.morphAttributes.normal||[],g=o.morphAttributes.color||[],M=0;f===!0&&(M=1),m===!0&&(M=2),b===!0&&(M=3);let v=o.attributes.position.count*M,T=1;v>t.maxTextureSize&&(T=Math.ceil(v/t.maxTextureSize),v=t.maxTextureSize);let E=new Float32Array(v*T*4*p),w=new Fl(E,v,T,p);w.type=Ii,w.needsUpdate=!0;let x=M*4;for(let R=0;R<p;R++){let O=y[R],z=d[R],G=g[R],L=v*T*4*R;for(let H=0;H<O.count;H++){let J=H*x;f===!0&&(s.fromBufferAttribute(O,H),E[L+J+0]=s.x,E[L+J+1]=s.y,E[L+J+2]=s.z,E[L+J+3]=0),m===!0&&(s.fromBufferAttribute(z,H),E[L+J+4]=s.x,E[L+J+5]=s.y,E[L+J+6]=s.z,E[L+J+7]=0),b===!0&&(s.fromBufferAttribute(G,H),E[L+J+8]=s.x,E[L+J+9]=s.y,E[L+J+10]=s.z,E[L+J+11]=G.itemSize===4?s.w:1)}}h={count:p,texture:w,size:new $t(v,T)},i.set(o,h),o.addEventListener("dispose",A)}if(r.isInstancedMesh===!0&&r.morphTexture!==null)l.getUniforms().setValue(e,"morphTexture",r.morphTexture,n);else{let f=0;for(let b=0;b<c.length;b++)f+=c[b];let m=o.morphTargetsRelative?1:1-f;l.getUniforms().setValue(e,"morphTargetBaseInfluence",m),l.getUniforms().setValue(e,"morphTargetInfluences",c)}l.getUniforms().setValue(e,"morphTargetsTexture",h.texture,n),l.getUniforms().setValue(e,"morphTargetsTextureSize",h.size)}return{update:a}}function PC(e,t,n,i,s){let a=new WeakMap;function r(c){let u=s.render.frame,p=c.geometry,h=t.get(c,p);if(a.get(h)!==u&&(t.update(h),a.set(h,u)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),a.get(c)!==u&&(n.update(c.instanceMatrix,e.ARRAY_BUFFER),c.instanceColor!==null&&n.update(c.instanceColor,e.ARRAY_BUFFER),a.set(c,u))),c.isSkinnedMesh){let f=c.skeleton;a.get(f)!==u&&(f.update(),a.set(f,u))}return h}function o(){a=new WeakMap}function l(c){let u=c.target;u.removeEventListener("dispose",l),i.releaseStatesOfObject(u),n.remove(u.instanceMatrix),u.instanceColor!==null&&n.remove(u.instanceColor)}return{update:r,dispose:o}}var BC={[fg]:"LINEAR_TONE_MAPPING",[dg]:"REINHARD_TONE_MAPPING",[pg]:"CINEON_TONE_MAPPING",[mg]:"ACES_FILMIC_TONE_MAPPING",[yg]:"AGX_TONE_MAPPING",[_g]:"NEUTRAL_TONE_MAPPING",[gg]:"CUSTOM_TONE_MAPPING"};function zC(e,t,n,i,s,a){let r=new Fn(t,n,{type:e,depthBuffer:s,stencilBuffer:a,samples:i?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),o=null,l=null,c=new Vn;c.setAttribute("position",new je([-1,3,0,-1,-1,0,3,-1,0],3)),c.setAttribute("uv",new je([0,2,0,0,2,0],2));let u=new Dh({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),p=new $e(c,u),h=new $a(-1,1,1,-1,0,1),f=null,m=null,b=!1,y,d=null,g=[],M=!1;this.setSize=function(v,T){r.setSize(v,T),o!==null&&o.setSize(v,T),l!==null&&l.setSize(v,T);for(let E=0;E<g.length;E++){let w=g[E];w.setSize&&w.setSize(v,T)}},this.setEffects=function(v){g=v,M=g.length>0&&g[0].isRenderPass===!0;let T=r.width,E=r.height;g.length>0&&o===null&&(o=new Fn(T,E,{type:Pi,depthBuffer:!1,stencilBuffer:!1}),l=new Fn(T,E,{type:Pi,depthBuffer:!1,stencilBuffer:!1}));for(let w=0;w<g.length;w++){let x=g[w];x.setSize&&x.setSize(T,E)}},this.begin=function(v,T){if(b||v.toneMapping===Li&&g.length===0)return!1;if(d=T,T!==null){let E=T.width,w=T.height;(r.width!==E||r.height!==w)&&this.setSize(E,w)}return M===!1&&v.setRenderTarget(r),y=v.toneMapping,v.toneMapping=Li,!0},this.hasRenderPass=function(){return M},this.end=function(v,T){v.toneMapping=y,b=!0;let E=r,w=o;for(let x=0;x<g.length;x++){let A=g[x];A.enabled!==!1&&(A.render(v,w,E,T),A.needsSwap!==!1&&(E=w,w=w===o?l:o))}if(f!==v.outputColorSpace||m!==v.toneMapping){f=v.outputColorSpace,m=v.toneMapping,u.defines={},Zt.getTransfer(f)===oe&&(u.defines.SRGB_TRANSFER="");let x=BC[m];x&&(u.defines[x]=""),u.needsUpdate=!0}u.uniforms.tDiffuse.value=E.texture,v.setRenderTarget(d),v.render(p,h),d=null,b=!1},this.isCompositing=function(){return b},this.dispose=function(){r.dispose(),o!==null&&o.dispose(),l!==null&&l.dispose(),c.dispose(),u.dispose()}}var Ib=new Sn,Vg=new ma(1,1),Pb=new Fl,Bb=new Ah,zb=new Xl,gb=[],yb=[],_b=new Float32Array(16),vb=new Float32Array(9),xb=new Float32Array(4);function wo(e,t,n){let i=e[0];if(i<=0||i>0)return e;let s=t*n,a=gb[s];if(a===void 0&&(a=new Float32Array(s),gb[s]=a),t!==0){i.toArray(a,0);for(let r=1,o=0;r!==t;++r)o+=n,e[r].toArray(a,o)}return a}function tn(e,t){if(e.length!==t.length)return!1;for(let n=0,i=e.length;n<i;n++)if(e[n]!==t[n])return!1;return!0}function en(e,t){for(let n=0,i=t.length;n<i;n++)e[n]=t[n]}function Ff(e,t){let n=yb[t];n===void 0&&(n=new Int32Array(t),yb[t]=n);for(let i=0;i!==t;++i)n[i]=e.allocateTextureUnit();return n}function FC(e,t){let n=this.cache;n[0]!==t&&(e.uniform1f(this.addr,t),n[0]=t)}function VC(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2f(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(tn(n,t))return;e.uniform2fv(this.addr,t),en(n,t)}}function HC(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3f(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else if(t.r!==void 0)(n[0]!==t.r||n[1]!==t.g||n[2]!==t.b)&&(e.uniform3f(this.addr,t.r,t.g,t.b),n[0]=t.r,n[1]=t.g,n[2]=t.b);else{if(tn(n,t))return;e.uniform3fv(this.addr,t),en(n,t)}}function kC(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4f(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(tn(n,t))return;e.uniform4fv(this.addr,t),en(n,t)}}function GC(e,t){let n=this.cache,i=t.elements;if(i===void 0){if(tn(n,t))return;e.uniformMatrix2fv(this.addr,!1,t),en(n,t)}else{if(tn(n,i))return;xb.set(i),e.uniformMatrix2fv(this.addr,!1,xb),en(n,i)}}function WC(e,t){let n=this.cache,i=t.elements;if(i===void 0){if(tn(n,t))return;e.uniformMatrix3fv(this.addr,!1,t),en(n,t)}else{if(tn(n,i))return;vb.set(i),e.uniformMatrix3fv(this.addr,!1,vb),en(n,i)}}function XC(e,t){let n=this.cache,i=t.elements;if(i===void 0){if(tn(n,t))return;e.uniformMatrix4fv(this.addr,!1,t),en(n,t)}else{if(tn(n,i))return;_b.set(i),e.uniformMatrix4fv(this.addr,!1,_b),en(n,i)}}function qC(e,t){let n=this.cache;n[0]!==t&&(e.uniform1i(this.addr,t),n[0]=t)}function YC(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2i(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(tn(n,t))return;e.uniform2iv(this.addr,t),en(n,t)}}function ZC(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3i(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(tn(n,t))return;e.uniform3iv(this.addr,t),en(n,t)}}function JC(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4i(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(tn(n,t))return;e.uniform4iv(this.addr,t),en(n,t)}}function KC(e,t){let n=this.cache;n[0]!==t&&(e.uniform1ui(this.addr,t),n[0]=t)}function QC(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2ui(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(tn(n,t))return;e.uniform2uiv(this.addr,t),en(n,t)}}function jC(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3ui(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(tn(n,t))return;e.uniform3uiv(this.addr,t),en(n,t)}}function $C(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4ui(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(tn(n,t))return;e.uniform4uiv(this.addr,t),en(n,t)}}function tR(e,t,n){let i=this.cache,s=n.allocateTextureUnit();i[0]!==s&&(e.uniform1i(this.addr,s),i[0]=s);let a;this.type===e.SAMPLER_2D_SHADOW?(Vg.compareFunction=n.isReversedDepthBuffer()?Nf:Uf,a=Vg):a=Ib,n.setTexture2D(t||a,s)}function eR(e,t,n){let i=this.cache,s=n.allocateTextureUnit();i[0]!==s&&(e.uniform1i(this.addr,s),i[0]=s),n.setTexture3D(t||Bb,s)}function nR(e,t,n){let i=this.cache,s=n.allocateTextureUnit();i[0]!==s&&(e.uniform1i(this.addr,s),i[0]=s),n.setTextureCube(t||zb,s)}function iR(e,t,n){let i=this.cache,s=n.allocateTextureUnit();i[0]!==s&&(e.uniform1i(this.addr,s),i[0]=s),n.setTexture2DArray(t||Pb,s)}function sR(e){switch(e){case 5126:return FC;case 35664:return VC;case 35665:return HC;case 35666:return kC;case 35674:return GC;case 35675:return WC;case 35676:return XC;case 5124:case 35670:return qC;case 35667:case 35671:return YC;case 35668:case 35672:return ZC;case 35669:case 35673:return JC;case 5125:return KC;case 36294:return QC;case 36295:return jC;case 36296:return $C;case 35678:case 36198:case 36298:case 36306:case 35682:return tR;case 35679:case 36299:case 36307:return eR;case 35680:case 36300:case 36308:case 36293:return nR;case 36289:case 36303:case 36311:case 36292:return iR}}function aR(e,t){e.uniform1fv(this.addr,t)}function rR(e,t){let n=wo(t,this.size,2);e.uniform2fv(this.addr,n)}function oR(e,t){let n=wo(t,this.size,3);e.uniform3fv(this.addr,n)}function lR(e,t){let n=wo(t,this.size,4);e.uniform4fv(this.addr,n)}function cR(e,t){let n=wo(t,this.size,4);e.uniformMatrix2fv(this.addr,!1,n)}function uR(e,t){let n=wo(t,this.size,9);e.uniformMatrix3fv(this.addr,!1,n)}function hR(e,t){let n=wo(t,this.size,16);e.uniformMatrix4fv(this.addr,!1,n)}function fR(e,t){e.uniform1iv(this.addr,t)}function dR(e,t){e.uniform2iv(this.addr,t)}function pR(e,t){e.uniform3iv(this.addr,t)}function mR(e,t){e.uniform4iv(this.addr,t)}function gR(e,t){e.uniform1uiv(this.addr,t)}function yR(e,t){e.uniform2uiv(this.addr,t)}function _R(e,t){e.uniform3uiv(this.addr,t)}function vR(e,t){e.uniform4uiv(this.addr,t)}function xR(e,t,n){let i=this.cache,s=t.length,a=Ff(n,s);tn(i,a)||(e.uniform1iv(this.addr,a),en(i,a));let r;this.type===e.SAMPLER_2D_SHADOW?r=Vg:r=Ib;for(let o=0;o!==s;++o)n.setTexture2D(t[o]||r,a[o])}function SR(e,t,n){let i=this.cache,s=t.length,a=Ff(n,s);tn(i,a)||(e.uniform1iv(this.addr,a),en(i,a));for(let r=0;r!==s;++r)n.setTexture3D(t[r]||Bb,a[r])}function bR(e,t,n){let i=this.cache,s=t.length,a=Ff(n,s);tn(i,a)||(e.uniform1iv(this.addr,a),en(i,a));for(let r=0;r!==s;++r)n.setTextureCube(t[r]||zb,a[r])}function MR(e,t,n){let i=this.cache,s=t.length,a=Ff(n,s);tn(i,a)||(e.uniform1iv(this.addr,a),en(i,a));for(let r=0;r!==s;++r)n.setTexture2DArray(t[r]||Pb,a[r])}function TR(e){switch(e){case 5126:return aR;case 35664:return rR;case 35665:return oR;case 35666:return lR;case 35674:return cR;case 35675:return uR;case 35676:return hR;case 5124:case 35670:return fR;case 35667:case 35671:return dR;case 35668:case 35672:return pR;case 35669:case 35673:return mR;case 5125:return gR;case 36294:return yR;case 36295:return _R;case 36296:return vR;case 35678:case 36198:case 36298:case 36306:case 35682:return xR;case 35679:case 36299:case 36307:return SR;case 35680:case 36300:case 36308:case 36293:return bR;case 36289:case 36303:case 36311:case 36292:return MR}}var Hg=class{constructor(t,n,i){this.id=t,this.addr=i,this.cache=[],this.type=n.type,this.setValue=sR(n.type)}},kg=class{constructor(t,n,i){this.id=t,this.addr=i,this.cache=[],this.type=n.type,this.size=n.size,this.setValue=TR(n.type)}},Gg=class{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,n,i){let s=this.seq;for(let a=0,r=s.length;a!==r;++a){let o=s[a];o.setValue(t,n[o.id],i)}}},zg=/(\w+)(\])?(\[|\.)?/g;function Sb(e,t){e.seq.push(t),e.map[t.id]=t}function ER(e,t,n){let i=e.name,s=i.length;for(zg.lastIndex=0;;){let a=zg.exec(i),r=zg.lastIndex,o=a[1],l=a[2]==="]",c=a[3];if(l&&(o=o|0),c===void 0||c==="["&&r+2===s){Sb(n,c===void 0?new Hg(o,e,t):new kg(o,e,t));break}else{let p=n.map[o];p===void 0&&(p=new Gg(o),Sb(n,p)),n=p}}}var Ao=class{constructor(t,n){this.seq=[],this.map={};let i=t.getProgramParameter(n,t.ACTIVE_UNIFORMS);for(let r=0;r<i;++r){let o=t.getActiveUniform(n,r),l=t.getUniformLocation(n,o.name);ER(o,l,this)}let s=[],a=[];for(let r of this.seq)r.type===t.SAMPLER_2D_SHADOW||r.type===t.SAMPLER_CUBE_SHADOW||r.type===t.SAMPLER_2D_ARRAY_SHADOW?s.push(r):a.push(r);s.length>0&&(this.seq=s.concat(a))}setValue(t,n,i,s){let a=this.map[n];a!==void 0&&a.setValue(t,i,s)}setOptional(t,n,i){let s=n[i];s!==void 0&&this.setValue(t,i,s)}static upload(t,n,i,s){for(let a=0,r=n.length;a!==r;++a){let o=n[a],l=i[o.id];l.needsUpdate!==!1&&o.setValue(t,l.value,s)}}static seqWithValue(t,n){let i=[];for(let s=0,a=t.length;s!==a;++s){let r=t[s];r.id in n&&i.push(r)}return i}};function bb(e,t,n){let i=e.createShader(t);return e.shaderSource(i,n),e.compileShader(i),i}var AR=37297,wR=0;function CR(e,t){let n=e.split(`
`),i=[],s=Math.max(t-6,0),a=Math.min(t+6,n.length);for(let r=s;r<a;r++){let o=r+1;i.push(`${o===t?">":" "} ${o}: ${n[r]}`)}return i.join(`
`)}var Mb=new Nt;function RR(e){Zt._getMatrix(Mb,Zt.workingColorSpace,e);let t=`mat3( ${Mb.elements.map(n=>n.toFixed(4))} )`;switch(Zt.getTransfer(e)){case Pl:return[t,"LinearTransferOETF"];case oe:return[t,"sRGBTransferOETF"];default:return Rt("WebGLProgram: Unsupported color space: ",e),[t,"LinearTransferOETF"]}}function Tb(e,t,n){let i=e.getShaderParameter(t,e.COMPILE_STATUS),a=(e.getShaderInfoLog(t)||"").trim();if(i&&a==="")return"";let r=/ERROR: 0:(\d+)/.exec(a);if(r){let o=parseInt(r[1]);return n.toUpperCase()+`

`+a+`

`+CR(e.getShaderSource(t),o)}else return a}function DR(e,t){let n=RR(t);return[`vec4 ${e}( vec4 value ) {`,`	return ${n[1]}( vec4( value.rgb * ${n[0]}, value.a ) );`,"}"].join(`
`)}var UR={[fg]:"Linear",[dg]:"Reinhard",[pg]:"Cineon",[mg]:"ACESFilmic",[yg]:"AgX",[_g]:"Neutral",[gg]:"Custom"};function NR(e,t){let n=UR[t];return n===void 0?(Rt("WebGLProgram: Unsupported toneMapping:",t),"vec3 "+e+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+e+"( vec3 color ) { return "+n+"ToneMapping( color ); }"}var Of=new V;function LR(){Zt.getLuminanceCoefficients(Of);let e=Of.x.toFixed(4),t=Of.y.toFixed(4),n=Of.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${e}, ${t}, ${n} );`,"	return dot( weights, rgb );","}"].join(`
`)}function OR(e){return[e.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",e.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(lc).join(`
`)}function IR(e){let t=[];for(let n in e){let i=e[n];i!==!1&&t.push("#define "+n+" "+i)}return t.join(`
`)}function PR(e,t){let n={},i=e.getProgramParameter(t,e.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){let a=e.getActiveAttrib(t,s),r=a.name,o=1;a.type===e.FLOAT_MAT2&&(o=2),a.type===e.FLOAT_MAT3&&(o=3),a.type===e.FLOAT_MAT4&&(o=4),n[r]={type:a.type,location:e.getAttribLocation(t,r),locationSize:o}}return n}function lc(e){return e!==""}function Eb(e,t){let n=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return e.replace(/NUM_SUN_LIGHTS/g,t.numSunLights).replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,t.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Ab(e,t){return e.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var BR=/^[ \t]*#include +<([\w\d./]+)>/gm;function Wg(e){return e.replace(BR,FR)}var zR=new Map;function FR(e,t){let n=Ft[t];if(n===void 0){let i=zR.get(t);if(i!==void 0)n=Ft[i],Rt('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,i);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+t+">")}return Wg(n)}var VR=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function wb(e){return e.replace(VR,HR)}function HR(e,t,n,i){let s="";for(let a=parseInt(t);a<parseInt(n);a++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+a+" ]").replace(/UNROLLED_LOOP_INDEX/g,a);return s}function Cb(e){let t=`precision ${e.precision} float;
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
#define LOW_PRECISION`),t}var kR={[Kl]:"SHADOWMAP_TYPE_PCF",[xo]:"SHADOWMAP_TYPE_VSM"};function GR(e){return kR[e.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}var WR={[Sa]:"ENVMAP_TYPE_CUBE",[er]:"ENVMAP_TYPE_CUBE",[Ql]:"ENVMAP_TYPE_CUBE_UV"};function XR(e){return e.envMap===!1?"ENVMAP_TYPE_CUBE":WR[e.envMapMode]||"ENVMAP_TYPE_CUBE"}var qR={[er]:"ENVMAP_MODE_REFRACTION"};function YR(e){return e.envMap===!1?"ENVMAP_MODE_REFLECTION":qR[e.envMapMode]||"ENVMAP_MODE_REFLECTION"}var ZR={[hg]:"ENVMAP_BLENDING_MULTIPLY",[XS]:"ENVMAP_BLENDING_MIX",[qS]:"ENVMAP_BLENDING_ADD"};function JR(e){return e.envMap===!1?"ENVMAP_BLENDING_NONE":ZR[e.combine]||"ENVMAP_BLENDING_NONE"}function KR(e){let t=e.envMapCubeUVHeight;if(t===null)return null;let n=Math.log2(t)-2,i=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,n),112)),texelHeight:i,maxMip:n}}function QR(e,t,n,i){let s=e.getContext(),a=n.defines,r=n.vertexShader,o=n.fragmentShader,l=GR(n),c=XR(n),u=YR(n),p=JR(n),h=KR(n),f=OR(n),m=IR(a),b=s.createProgram(),y,d,g=n.glslVersion?"#version "+n.glslVersion+`
`:"";n.isRawShaderMaterial?(y=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,m].filter(lc).join(`
`),y.length>0&&(y+=`
`),d=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,m].filter(lc).join(`
`),d.length>0&&(d+=`
`)):(y=[Cb(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,m,n.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",n.batching?"#define USE_BATCHING":"",n.batchingColor?"#define USE_BATCHING_COLOR":"",n.instancing?"#define USE_INSTANCING":"",n.instancingColor?"#define USE_INSTANCING_COLOR":"",n.instancingMorph?"#define USE_INSTANCING_MORPH":"",n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.map?"#define USE_MAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+u:"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.displacementMap?"#define USE_DISPLACEMENTMAP":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.mapUv?"#define MAP_UV "+n.mapUv:"",n.alphaMapUv?"#define ALPHAMAP_UV "+n.alphaMapUv:"",n.lightMapUv?"#define LIGHTMAP_UV "+n.lightMapUv:"",n.aoMapUv?"#define AOMAP_UV "+n.aoMapUv:"",n.emissiveMapUv?"#define EMISSIVEMAP_UV "+n.emissiveMapUv:"",n.bumpMapUv?"#define BUMPMAP_UV "+n.bumpMapUv:"",n.normalMapUv?"#define NORMALMAP_UV "+n.normalMapUv:"",n.displacementMapUv?"#define DISPLACEMENTMAP_UV "+n.displacementMapUv:"",n.metalnessMapUv?"#define METALNESSMAP_UV "+n.metalnessMapUv:"",n.roughnessMapUv?"#define ROUGHNESSMAP_UV "+n.roughnessMapUv:"",n.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+n.anisotropyMapUv:"",n.clearcoatMapUv?"#define CLEARCOATMAP_UV "+n.clearcoatMapUv:"",n.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+n.clearcoatNormalMapUv:"",n.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+n.clearcoatRoughnessMapUv:"",n.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+n.iridescenceMapUv:"",n.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+n.iridescenceThicknessMapUv:"",n.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+n.sheenColorMapUv:"",n.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+n.sheenRoughnessMapUv:"",n.specularMapUv?"#define SPECULARMAP_UV "+n.specularMapUv:"",n.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+n.specularColorMapUv:"",n.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+n.specularIntensityMapUv:"",n.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+n.transmissionMapUv:"",n.thicknessMapUv?"#define THICKNESSMAP_UV "+n.thicknessMapUv:"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexNormals?"#define HAS_NORMAL":"",n.vertexColors?"#define USE_COLOR":"",n.vertexAlphas?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.flatShading?"#define FLAT_SHADED":"",n.skinning?"#define USE_SKINNING":"",n.morphTargets?"#define USE_MORPHTARGETS":"",n.morphNormals&&n.flatShading===!1?"#define USE_MORPHNORMALS":"",n.morphColors?"#define USE_MORPHCOLORS":"",n.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+n.morphTextureStride:"",n.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+n.morphTargetsCount:"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+l:"",n.sizeAttenuation?"#define USE_SIZEATTENUATION":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",n.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(lc).join(`
`),d=[Cb(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,m,n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",n.map?"#define USE_MAP":"",n.matcap?"#define USE_MATCAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+c:"",n.envMap?"#define "+u:"",n.envMap?"#define "+p:"",h?"#define CUBEUV_TEXEL_WIDTH "+h.texelWidth:"",h?"#define CUBEUV_TEXEL_HEIGHT "+h.texelHeight:"",h?"#define CUBEUV_MAX_MIP "+h.maxMip+".0":"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoat?"#define USE_CLEARCOAT":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.dispersion?"#define USE_DISPERSION":"",n.retroreflection?"#define USE_RETROREFLECTION":"",n.iridescence?"#define USE_IRIDESCENCE":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaTest?"#define USE_ALPHATEST":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.sheen?"#define USE_SHEEN":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexColors||n.instancingColor?"#define USE_COLOR":"",n.vertexAlphas||n.batchingColor?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.gradientMap?"#define USE_GRADIENTMAP":"",n.flatShading?"#define FLAT_SHADED":"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+l:"",n.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",n.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",n.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",n.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",n.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",n.toneMapping!==Li?"#define TONE_MAPPING":"",n.toneMapping!==Li?Ft.tonemapping_pars_fragment:"",n.toneMapping!==Li?NR("toneMapping",n.toneMapping):"",n.dithering?"#define DITHERING":"",n.opaque?"#define OPAQUE":"",Ft.colorspace_pars_fragment,DR("linearToOutputTexel",n.outputColorSpace),LR(),n.useDepthPacking?"#define DEPTH_PACKING "+n.depthPacking:"",`
`].filter(lc).join(`
`)),r=Wg(r),r=Eb(r,n),r=Ab(r,n),o=Wg(o),o=Eb(o,n),o=Ab(o,n),r=wb(r),o=wb(o),n.isRawShaderMaterial!==!0&&(g=`#version 300 es
`,y=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+y,d=["#define varying in",n.glslVersion===Cg?"":"layout(location = 0) out highp vec4 pc_fragColor;",n.glslVersion===Cg?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+d);let M=g+y+r,v=g+d+o,T=bb(s,s.VERTEX_SHADER,M),E=bb(s,s.FRAGMENT_SHADER,v);s.attachShader(b,T),s.attachShader(b,E),n.index0AttributeName!==void 0?s.bindAttribLocation(b,0,n.index0AttributeName):n.hasPositionAttribute===!0&&s.bindAttribLocation(b,0,"position"),s.linkProgram(b);function w(O){if(e.debug.checkShaderErrors){let z=s.getProgramInfoLog(b)||"",G=s.getShaderInfoLog(T)||"",L=s.getShaderInfoLog(E)||"",H=z.trim(),J=G.trim(),Z=L.trim(),it=!0,X=!0;if(s.getProgramParameter(b,s.LINK_STATUS)===!1)if(it=!1,typeof e.debug.onShaderError=="function")e.debug.onShaderError(s,b,T,E);else{let tt=Tb(s,T,"vertex"),nt=Tb(s,E,"fragment");Ut("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(b,s.VALIDATE_STATUS)+`

Material Name: `+O.name+`
Material Type: `+O.type+`

Program Info Log: `+H+`
`+tt+`
`+nt)}else H!==""?Rt("WebGLProgram: Program Info Log:",H):(J===""||Z==="")&&(X=!1);X&&(O.diagnostics={runnable:it,programLog:H,vertexShader:{log:J,prefix:y},fragmentShader:{log:Z,prefix:d}})}s.deleteShader(T),s.deleteShader(E),x=new Ao(s,b),A=PR(s,b)}let x;this.getUniforms=function(){return x===void 0&&w(this),x};let A;this.getAttributes=function(){return A===void 0&&w(this),A};let R=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return R===!1&&(R=s.getProgramParameter(b,AR)),R},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(b),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=wR++,this.cacheKey=t,this.usedTimes=1,this.program=b,this.vertexShader=T,this.fragmentShader=E,this}var jR=0,Xg=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t,n,i){let s=this._getShaderCacheForMaterial(t);return s.has(n)===!1&&(s.add(n),n.usedTimes++),s.has(i)===!1&&(s.add(i),i.usedTimes++),this}remove(t){let n=this.materialCache.get(t);for(let i of n)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(t),this}getVertexShaderStage(t){return this._getShaderStage(t.vertexShader)}getFragmentShaderStage(t){return this._getShaderStage(t.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){let n=this.materialCache,i=n.get(t);return i===void 0&&(i=new Set,n.set(t,i)),i}_getShaderStage(t){let n=this.shaderCache,i=n.get(t);return i===void 0&&(i=new qg(t),n.set(t,i)),i}},qg=class{constructor(t){this.id=jR++,this.code=t,this.usedTimes=0}};function $R(e){return e===Ta||e===ic||e===sc}function t2(e,t,n,i,s,a){let r=new Vl,o=new Xg,l=new Set,c=[],u=new Map,p=i.logarithmicDepthBuffer,h=i.precision,f={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function m(x){return l.add(x),x===0?"uv":`uv${x}`}function b(x,A,R,O,z,G){let L=O.fog,H=z.geometry,J=x.isMeshStandardMaterial||x.isMeshLambertMaterial||x.isMeshPhongMaterial?O.environment:null,Z=x.isMeshStandardMaterial||x.isMeshLambertMaterial&&!x.envMap||x.isMeshPhongMaterial&&!x.envMap,it=t.get(x.envMap||J,Z),X=it&&it.mapping===Ql?it.image.height:null,tt=f[x.type];x.precision!==null&&(h=i.getMaxPrecision(x.precision),h!==x.precision&&Rt("WebGLProgram.getParameters:",x.precision,"not supported, using",h,"instead."));let nt=H.morphAttributes.position||H.morphAttributes.normal||H.morphAttributes.color,wt=nt!==void 0?nt.length:0,Et=0;H.morphAttributes.position!==void 0&&(Et=1),H.morphAttributes.normal!==void 0&&(Et=2),H.morphAttributes.color!==void 0&&(Et=3);let ge,Qt,ne,q;if(tt){let _e=ns[tt];ge=_e.vertexShader,Qt=_e.fragmentShader}else{ge=x.vertexShader,Qt=x.fragmentShader;let _e=o.getVertexShaderStage(x),ae=o.getFragmentShaderStage(x);o.update(x,_e,ae),ne=_e.id,q=ae.id}let $=e.getRenderTarget(),_t=e.state.buffers.depth.getReversed(),Ot=z.isInstancedMesh===!0,gt=z.isBatchedMesh===!0,Vt=!!x.map,Je=!!x.matcap,kt=!!it,ee=!!x.aoMap,ye=!!x.lightMap,qt=!!x.bumpMap&&x.wireframe===!1,Ce=!!x.normalMap,nn=!!x.displacementMap,Rn=!!x.emissiveMap,Ne=!!x.metalnessMap,ke=!!x.roughnessMap,N=x.anisotropy>0,mn=x.clearcoat>0,le=x.dispersion>0,C=x.retroreflectivity>0,_=x.iridescence>0,I=x.sheen>0,F=x.transmission>0,W=N&&!!x.anisotropyMap,st=mn&&!!x.clearcoatMap,at=mn&&!!x.clearcoatNormalMap,Y=mn&&!!x.clearcoatRoughnessMap,Q=_&&!!x.iridescenceMap,rt=_&&!!x.iridescenceThicknessMap,Mt=I&&!!x.sheenColorMap,ut=I&&!!x.sheenRoughnessMap,ot=!!x.specularMap,Tt=!!x.specularColorMap,Ct=!!x.specularIntensityMap,Pt=F&&!!x.transmissionMap,U=F&&!!x.thicknessMap,lt=!!x.gradientMap,K=!!x.alphaMap,ct=x.alphaTest>0,pt=!!x.alphaHash,et=!!x.extensions,At=Li;x.toneMapped&&($===null||$.isXRRenderTarget===!0)&&(At=e.toneMapping);let St={shaderID:tt,shaderType:x.type,shaderName:x.name,vertexShader:ge,fragmentShader:Qt,defines:x.defines,customVertexShaderID:ne,customFragmentShaderID:q,isRawShaderMaterial:x.isRawShaderMaterial===!0,glslVersion:x.glslVersion,precision:h,batching:gt,batchingColor:gt&&z._colorsTexture!==null,instancing:Ot,instancingColor:Ot&&z.instanceColor!==null,instancingMorph:Ot&&z.morphTexture!==null,outputColorSpace:$===null?e.outputColorSpace:$.isXRRenderTarget===!0?$.texture.colorSpace:Zt.workingColorSpace,alphaToCoverage:!!x.alphaToCoverage,map:Vt,matcap:Je,envMap:kt,envMapMode:kt&&it.mapping,envMapCubeUVHeight:X,aoMap:ee,lightMap:ye,bumpMap:qt,normalMap:Ce,displacementMap:nn,emissiveMap:Rn,normalMapObjectSpace:Ce&&x.normalMapType===JS,normalMapTangentSpace:Ce&&x.normalMapType===wg,packedNormalMap:Ce&&x.normalMapType===wg&&$R(x.normalMap.format),metalnessMap:Ne,roughnessMap:ke,anisotropy:N,anisotropyMap:W,clearcoat:mn,clearcoatMap:st,clearcoatNormalMap:at,clearcoatRoughnessMap:Y,dispersion:le,retroreflection:C,iridescence:_,iridescenceMap:Q,iridescenceThicknessMap:rt,sheen:I,sheenColorMap:Mt,sheenRoughnessMap:ut,specularMap:ot,specularColorMap:Tt,specularIntensityMap:Ct,transmission:F,transmissionMap:Pt,thicknessMap:U,gradientMap:lt,opaque:x.transparent===!1&&x.blending===So&&x.alphaToCoverage===!1,alphaMap:K,alphaTest:ct,alphaHash:pt,combine:x.combine,mapUv:Vt&&m(x.map.channel),aoMapUv:ee&&m(x.aoMap.channel),lightMapUv:ye&&m(x.lightMap.channel),bumpMapUv:qt&&m(x.bumpMap.channel),normalMapUv:Ce&&m(x.normalMap.channel),displacementMapUv:nn&&m(x.displacementMap.channel),emissiveMapUv:Rn&&m(x.emissiveMap.channel),metalnessMapUv:Ne&&m(x.metalnessMap.channel),roughnessMapUv:ke&&m(x.roughnessMap.channel),anisotropyMapUv:W&&m(x.anisotropyMap.channel),clearcoatMapUv:st&&m(x.clearcoatMap.channel),clearcoatNormalMapUv:at&&m(x.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Y&&m(x.clearcoatRoughnessMap.channel),iridescenceMapUv:Q&&m(x.iridescenceMap.channel),iridescenceThicknessMapUv:rt&&m(x.iridescenceThicknessMap.channel),sheenColorMapUv:Mt&&m(x.sheenColorMap.channel),sheenRoughnessMapUv:ut&&m(x.sheenRoughnessMap.channel),specularMapUv:ot&&m(x.specularMap.channel),specularColorMapUv:Tt&&m(x.specularColorMap.channel),specularIntensityMapUv:Ct&&m(x.specularIntensityMap.channel),transmissionMapUv:Pt&&m(x.transmissionMap.channel),thicknessMapUv:U&&m(x.thicknessMap.channel),alphaMapUv:K&&m(x.alphaMap.channel),vertexTangents:!!H.attributes.tangent&&(Ce||N),vertexNormals:!!H.attributes.normal,vertexColors:x.vertexColors,vertexAlphas:x.vertexColors===!0&&!!H.attributes.color&&H.attributes.color.itemSize===4,pointsUvs:z.isPoints===!0&&!!H.attributes.uv&&(Vt||K),fog:!!L,useFog:x.fog===!0,fogExp2:!!L&&L.isFogExp2,flatShading:x.wireframe===!1&&(x.flatShading===!0||H.attributes.normal===void 0&&Ce===!1&&(x.isMeshLambertMaterial||x.isMeshPhongMaterial||x.isMeshStandardMaterial||x.isMeshPhysicalMaterial)),sizeAttenuation:x.sizeAttenuation===!0,logarithmicDepthBuffer:p,reversedDepthBuffer:_t,skinning:z.isSkinnedMesh===!0,hasPositionAttribute:H.attributes.position!==void 0,morphTargets:H.morphAttributes.position!==void 0,morphNormals:H.morphAttributes.normal!==void 0,morphColors:H.morphAttributes.color!==void 0,morphTargetsCount:wt,morphTextureStride:Et,numSunLights:A.sun.length,numDirLights:A.directional.length,numPointLights:A.point.length,numSpotLights:A.spot.length,numSpotLightMaps:A.spotLightMap.length,numRectAreaLights:A.rectArea.length,numHemiLights:A.hemi.length,numSunLightShadows:A.sunShadowMap.length,numDirLightShadows:A.directionalShadowMap.length,numPointLightShadows:A.pointShadowMap.length,numSpotLightShadows:A.spotShadowMap.length,numSpotLightShadowsWithMaps:A.numSpotLightShadowsWithMaps,numLightProbes:A.numLightProbes,numLightProbeGrids:G.length,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:x.dithering,shadowMapEnabled:e.shadowMap.enabled&&R.length>0,shadowMapType:e.shadowMap.type,toneMapping:At,decodeVideoTexture:Vt&&x.map.isVideoTexture===!0&&Zt.getTransfer(x.map.colorSpace)===oe,decodeVideoTextureEmissive:Rn&&x.emissiveMap.isVideoTexture===!0&&Zt.getTransfer(x.emissiveMap.colorSpace)===oe,premultipliedAlpha:x.premultipliedAlpha,doubleSided:x.side===vi,flipSided:x.side===wn,useDepthPacking:x.depthPacking>=0,depthPacking:x.depthPacking||0,index0AttributeName:x.index0AttributeName,extensionClipCullDistance:et&&x.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(et&&x.extensions.multiDraw===!0||gt)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:x.customProgramCacheKey()};return St.vertexUv1s=l.has(1),St.vertexUv2s=l.has(2),St.vertexUv3s=l.has(3),l.clear(),St}function y(x){let A=[];if(x.shaderID?A.push(x.shaderID):(A.push(x.customVertexShaderID),A.push(x.customFragmentShaderID)),x.defines!==void 0)for(let R in x.defines)A.push(R),A.push(x.defines[R]);return x.isRawShaderMaterial===!1&&(d(A,x),g(A,x),A.push(e.outputColorSpace)),A.push(x.customProgramCacheKey),A.join()}function d(x,A){x.push(A.precision),x.push(A.outputColorSpace),x.push(A.envMapMode),x.push(A.envMapCubeUVHeight),x.push(A.mapUv),x.push(A.alphaMapUv),x.push(A.lightMapUv),x.push(A.aoMapUv),x.push(A.bumpMapUv),x.push(A.normalMapUv),x.push(A.displacementMapUv),x.push(A.emissiveMapUv),x.push(A.metalnessMapUv),x.push(A.roughnessMapUv),x.push(A.anisotropyMapUv),x.push(A.clearcoatMapUv),x.push(A.clearcoatNormalMapUv),x.push(A.clearcoatRoughnessMapUv),x.push(A.iridescenceMapUv),x.push(A.iridescenceThicknessMapUv),x.push(A.sheenColorMapUv),x.push(A.sheenRoughnessMapUv),x.push(A.specularMapUv),x.push(A.specularColorMapUv),x.push(A.specularIntensityMapUv),x.push(A.transmissionMapUv),x.push(A.thicknessMapUv),x.push(A.combine),x.push(A.fogExp2),x.push(A.sizeAttenuation),x.push(A.morphTargetsCount),x.push(A.morphAttributeCount),x.push(A.numSunLights),x.push(A.numDirLights),x.push(A.numPointLights),x.push(A.numSpotLights),x.push(A.numSpotLightMaps),x.push(A.numHemiLights),x.push(A.numRectAreaLights),x.push(A.numSunLightShadows),x.push(A.numDirLightShadows),x.push(A.numPointLightShadows),x.push(A.numSpotLightShadows),x.push(A.numSpotLightShadowsWithMaps),x.push(A.numLightProbes),x.push(A.shadowMapType),x.push(A.toneMapping),x.push(A.numClippingPlanes),x.push(A.numClipIntersection),x.push(A.depthPacking)}function g(x,A){r.disableAll(),A.instancing&&r.enable(0),A.instancingColor&&r.enable(1),A.instancingMorph&&r.enable(2),A.matcap&&r.enable(3),A.envMap&&r.enable(4),A.normalMapObjectSpace&&r.enable(5),A.normalMapTangentSpace&&r.enable(6),A.clearcoat&&r.enable(7),A.iridescence&&r.enable(8),A.alphaTest&&r.enable(9),A.vertexColors&&r.enable(10),A.vertexAlphas&&r.enable(11),A.vertexUv1s&&r.enable(12),A.vertexUv2s&&r.enable(13),A.vertexUv3s&&r.enable(14),A.vertexTangents&&r.enable(15),A.anisotropy&&r.enable(16),A.alphaHash&&r.enable(17),A.batching&&r.enable(18),A.dispersion&&r.enable(19),A.retroreflection&&r.enable(24),A.batchingColor&&r.enable(20),A.gradientMap&&r.enable(21),A.packedNormalMap&&r.enable(22),A.vertexNormals&&r.enable(23),x.push(r.mask),r.disableAll(),A.fog&&r.enable(0),A.useFog&&r.enable(1),A.flatShading&&r.enable(2),A.logarithmicDepthBuffer&&r.enable(3),A.reversedDepthBuffer&&r.enable(4),A.skinning&&r.enable(5),A.morphTargets&&r.enable(6),A.morphNormals&&r.enable(7),A.morphColors&&r.enable(8),A.premultipliedAlpha&&r.enable(9),A.shadowMapEnabled&&r.enable(10),A.doubleSided&&r.enable(11),A.flipSided&&r.enable(12),A.useDepthPacking&&r.enable(13),A.dithering&&r.enable(14),A.transmission&&r.enable(15),A.sheen&&r.enable(16),A.opaque&&r.enable(17),A.pointsUvs&&r.enable(18),A.decodeVideoTexture&&r.enable(19),A.decodeVideoTextureEmissive&&r.enable(20),A.alphaToCoverage&&r.enable(21),A.numLightProbeGrids>0&&r.enable(22),A.hasPositionAttribute&&r.enable(23),x.push(r.mask)}function M(x){let A=f[x.type],R;if(A){let O=ns[A];R=cb.clone(O.uniforms)}else R=x.uniforms;return R}function v(x,A){let R=u.get(A);return R!==void 0?++R.usedTimes:(R=new QR(e,A,x,s),c.push(R),u.set(A,R)),R}function T(x){if(--x.usedTimes===0){let A=c.indexOf(x);c[A]=c[c.length-1],c.pop(),u.delete(x.cacheKey),x.destroy()}}function E(x){o.remove(x)}function w(){o.dispose()}return{getParameters:b,getProgramCacheKey:y,getUniforms:M,acquireProgram:v,releaseProgram:T,releaseShaderCache:E,programs:c,dispose:w}}function e2(){let e=new WeakMap;function t(r){return e.has(r)}function n(r){let o=e.get(r);return o===void 0&&(o={},e.set(r,o)),o}function i(r){e.delete(r)}function s(r,o,l){e.get(r)[o]=l}function a(){e=new WeakMap}return{has:t,get:n,remove:i,update:s,dispose:a}}function n2(e,t){return e.groupOrder!==t.groupOrder?e.groupOrder-t.groupOrder:e.renderOrder!==t.renderOrder?e.renderOrder-t.renderOrder:e.material.id!==t.material.id?e.material.id-t.material.id:e.materialVariant!==t.materialVariant?e.materialVariant-t.materialVariant:e.z!==t.z?e.z-t.z:e.id-t.id}function Rb(e,t){return e.groupOrder!==t.groupOrder?e.groupOrder-t.groupOrder:e.renderOrder!==t.renderOrder?e.renderOrder-t.renderOrder:e.z!==t.z?t.z-e.z:e.id-t.id}function Db(){let e=[],t=0,n=[],i=[],s=[];function a(){t=0,n.length=0,i.length=0,s.length=0}function r(h){let f=0;return h.isInstancedMesh&&(f+=2),h.isSkinnedMesh&&(f+=1),f}function o(h,f,m,b,y,d){let g=e[t];return g===void 0?(g={id:h.id,object:h,geometry:f,material:m,materialVariant:r(h),groupOrder:b,renderOrder:h.renderOrder,z:y,group:d},e[t]=g):(g.id=h.id,g.object=h,g.geometry=f,g.material=m,g.materialVariant=r(h),g.groupOrder=b,g.renderOrder=h.renderOrder,g.z=y,g.group=d),t++,g}function l(h,f,m,b,y,d,g){g.reversedDepth===!0&&(y=-y);let M=o(h,f,m,b,y,d);m.transmission>0?i.push(M):m.transparent===!0?s.push(M):n.push(M)}function c(h,f,m,b,y,d){let g=o(h,f,m,b,y,d);m.transmission>0?i.unshift(g):m.transparent===!0?s.unshift(g):n.unshift(g)}function u(h,f){n.length>1&&n.sort(h||n2),i.length>1&&i.sort(f||Rb),s.length>1&&s.sort(f||Rb)}function p(){for(let h=t,f=e.length;h<f;h++){let m=e[h];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:n,transmissive:i,transparent:s,init:a,push:l,unshift:c,finish:p,sort:u}}function i2(){let e=new WeakMap;function t(i,s){let a=e.get(i),r;return a===void 0?(r=new Db,e.set(i,[r])):s>=a.length?(r=new Db,a.push(r)):r=a[s],r}function n(){e=new WeakMap}return{get:t,dispose:n}}function s2(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case"SunLight":case"DirectionalLight":n={direction:new V,color:new te};break;case"SpotLight":n={position:new V,direction:new V,color:new te,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":n={position:new V,color:new te,distance:0,decay:0};break;case"HemisphereLight":n={direction:new V,skyColor:new te,groundColor:new te};break;case"RectAreaLight":n={color:new te,position:new V,halfWidth:new V,halfHeight:new V};break}return e[t.id]=n,n}}}function a2(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case"SunLight":case"DirectionalLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new $t};break;case"SpotLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new $t};break;case"PointLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new $t,shadowCameraNear:1,shadowCameraFar:1e3};break}return e[t.id]=n,n}}}var r2=0;function o2(e,t){return(t.castShadow?2:0)-(e.castShadow?2:0)+(t.map?1:0)-(e.map?1:0)}function l2(e){let t=new s2,n=a2(),i={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new V);let s=new V,a=new Ve,r=new Ve;function o(c){let u=0,p=0,h=0;for(let z=0;z<9;z++)i.probe[z].set(0,0,0);let f=0,m=0,b=0,y=0,d=0,g=0,M=0,v=0,T=0,E=0,w=0,x=0,A=0,R=0;c.sort(o2);for(let z=0,G=c.length;z<G;z++){let L=c[z],H=L.color,J=L.intensity,Z=L.distance,it=null;if(L.shadow&&L.shadow.map&&(L.shadow.map.texture.format===Ta?it=L.shadow.map.texture:it=L.shadow.map.depthTexture||L.shadow.map.texture),L.isAmbientLight)u+=H.r*J,p+=H.g*J,h+=H.b*J;else if(L.isLightProbe){for(let X=0;X<9;X++)i.probe[X].addScaledVector(L.sh.coefficients[X],J);R++}else if(L.isSunLight){let X=t.get(L);if(X.color.copy(L.color).multiplyScalar(L.intensity),L.castShadow){let tt=L.shadow,nt=n.get(L);nt.shadowIntensity=tt.intensity,nt.shadowBias=tt.bias,nt.shadowNormalBias=tt.normalBias,nt.shadowRadius=tt.radius,nt.shadowMapSize.copy(tt.mapSize).multiply(tt.getFrameExtents()),i.sunShadow[m]=nt,i.sunShadowMap[m]=it;let wt=tt.getViewportCount();for(let Et=0;Et<wt;Et++)i.sunShadowMatrix[b+Et]=tt.getMatrix(Et),i.sunShadowCascade[b+Et]=tt._cascadeData[Et];b+=wt,m++}i.sun[f]=X,f++}else if(L.isDirectionalLight){let X=t.get(L);if(X.color.copy(L.color).multiplyScalar(L.intensity),L.castShadow){let tt=L.shadow,nt=n.get(L);nt.shadowIntensity=tt.intensity,nt.shadowBias=tt.bias,nt.shadowNormalBias=tt.normalBias,nt.shadowRadius=tt.radius,nt.shadowMapSize=tt.mapSize,i.directionalShadow[y]=nt,i.directionalShadowMap[y]=it,i.directionalShadowMatrix[y]=L.shadow.matrix,T++}i.directional[y]=X,y++}else if(L.isSpotLight){let X=t.get(L);X.position.setFromMatrixPosition(L.matrixWorld),X.color.copy(H).multiplyScalar(J),X.distance=Z,X.coneCos=Math.cos(L.angle),X.penumbraCos=Math.cos(L.angle*(1-L.penumbra)),X.decay=L.decay,i.spot[g]=X;let tt=L.shadow;if(L.map&&(i.spotLightMap[x]=L.map,x++,tt.updateMatrices(L),L.castShadow&&A++),i.spotLightMatrix[g]=tt.matrix,L.castShadow){let nt=n.get(L);nt.shadowIntensity=tt.intensity,nt.shadowBias=tt.bias,nt.shadowNormalBias=tt.normalBias,nt.shadowRadius=tt.radius,nt.shadowMapSize=tt.mapSize,i.spotShadow[g]=nt,i.spotShadowMap[g]=it,w++}g++}else if(L.isRectAreaLight){let X=t.get(L);X.color.copy(H).multiplyScalar(J),X.halfWidth.set(L.width*.5,0,0),X.halfHeight.set(0,L.height*.5,0),i.rectArea[M]=X,M++}else if(L.isPointLight){let X=t.get(L);if(X.color.copy(L.color).multiplyScalar(L.intensity),X.distance=L.distance,X.decay=L.decay,L.castShadow){let tt=L.shadow,nt=n.get(L);nt.shadowIntensity=tt.intensity,nt.shadowBias=tt.bias,nt.shadowNormalBias=tt.normalBias,nt.shadowRadius=tt.radius,nt.shadowMapSize=tt.mapSize,nt.shadowCameraNear=tt.camera.near,nt.shadowCameraFar=tt.camera.far,i.pointShadow[d]=nt,i.pointShadowMap[d]=it,i.pointShadowMatrix[d]=L.shadow.matrix,E++}i.point[d]=X,d++}else if(L.isHemisphereLight){let X=t.get(L);X.skyColor.copy(L.color).multiplyScalar(J),X.groundColor.copy(L.groundColor).multiplyScalar(J),i.hemi[v]=X,v++}}M>0&&(e.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=ht.LTC_FLOAT_1,i.rectAreaLTC2=ht.LTC_FLOAT_2):(i.rectAreaLTC1=ht.LTC_HALF_1,i.rectAreaLTC2=ht.LTC_HALF_2)),i.ambient[0]=u,i.ambient[1]=p,i.ambient[2]=h;let O=i.hash;(O.sunLength!==f||O.directionalLength!==y||O.pointLength!==d||O.spotLength!==g||O.rectAreaLength!==M||O.hemiLength!==v||O.numSunShadows!==m||O.numDirectionalShadows!==T||O.numPointShadows!==E||O.numSpotShadows!==w||O.numSpotMaps!==x||O.numLightProbes!==R)&&(i.sun.length=f,i.directional.length=y,i.spot.length=g,i.rectArea.length=M,i.point.length=d,i.hemi.length=v,i.sunShadow.length=m,i.sunShadowMap.length=m,i.sunShadowMatrix.length=b,i.sunShadowCascade.length=b,i.directionalShadow.length=T,i.directionalShadowMap.length=T,i.directionalShadowMatrix.length=T,i.pointShadow.length=E,i.pointShadowMap.length=E,i.pointShadowMatrix.length=E,i.spotShadow.length=w,i.spotShadowMap.length=w,i.spotLightMatrix.length=w+x-A,i.spotLightMap.length=x,i.numSpotLightShadowsWithMaps=A,i.numLightProbes=R,O.sunLength=f,O.directionalLength=y,O.pointLength=d,O.spotLength=g,O.rectAreaLength=M,O.hemiLength=v,O.numSunShadows=m,O.numDirectionalShadows=T,O.numPointShadows=E,O.numSpotShadows=w,O.numSpotMaps=x,O.numLightProbes=R,i.version=r2++)}function l(c,u){let p=0,h=0,f=0,m=0,b=0,y=0,d=u.matrixWorldInverse;for(let g=0,M=c.length;g<M;g++){let v=c[g];if(v.isSunLight){let T=i.sun[p];T.direction.setFromMatrixPosition(v.matrixWorld),T.direction.transformDirection(d),p++}else if(v.isDirectionalLight){let T=i.directional[h];T.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),T.direction.sub(s),T.direction.transformDirection(d),h++}else if(v.isSpotLight){let T=i.spot[m];T.position.setFromMatrixPosition(v.matrixWorld),T.position.applyMatrix4(d),T.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),T.direction.sub(s),T.direction.transformDirection(d),m++}else if(v.isRectAreaLight){let T=i.rectArea[b];T.position.setFromMatrixPosition(v.matrixWorld),T.position.applyMatrix4(d),r.identity(),a.copy(v.matrixWorld),a.premultiply(d),r.extractRotation(a),T.halfWidth.set(v.width*.5,0,0),T.halfHeight.set(0,v.height*.5,0),T.halfWidth.applyMatrix4(r),T.halfHeight.applyMatrix4(r),b++}else if(v.isPointLight){let T=i.point[f];T.position.setFromMatrixPosition(v.matrixWorld),T.position.applyMatrix4(d),f++}else if(v.isHemisphereLight){let T=i.hemi[y];T.direction.setFromMatrixPosition(v.matrixWorld),T.direction.transformDirection(d),y++}}}return{setup:o,setupView:l,state:i}}function Ub(e){let t=new l2(e),n=[],i=[],s=[];function a(h){p.camera=h,n.length=0,i.length=0,s.length=0}function r(h){n.push(h)}function o(h){i.push(h)}function l(h){s.push(h)}function c(){t.setup(n)}function u(h){t.setupView(n,h)}let p={lightsArray:n,shadowsArray:i,lightProbeGridArray:s,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:a,state:p,setupLights:c,setupLightsView:u,pushLight:r,pushShadow:o,pushLightProbeGrid:l}}function c2(e){let t=new WeakMap;function n(s,a=0){let r=t.get(s),o;return r===void 0?(o=new Ub(e),t.set(s,[o])):a>=r.length?(o=new Ub(e),r.push(o)):o=r[a],o}function i(){t=new WeakMap}return{get:n,dispose:i}}var u2=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,h2=`uniform sampler2D shadow_pass;
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
}`,f2=[new V(1,0,0),new V(-1,0,0),new V(0,1,0),new V(0,-1,0),new V(0,0,1),new V(0,0,-1)],d2=[new V(0,-1,0),new V(0,-1,0),new V(0,0,1),new V(0,0,-1),new V(0,-1,0),new V(0,-1,0)],Nb=new Ve,oc=new V,Fg=new V;function p2(e,t,n){let i=new Wl,s=new $t,a=new $t,r=new Le,o=new Uh,l=new Nh,c={},u=n.maxTextureSize,p={[xa]:wn,[wn]:xa,[vi]:vi},h=new ti({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new $t},radius:{value:4}},vertexShader:u2,fragmentShader:h2}),f=h.clone();f.defines.HORIZONTAL_PASS=1;let m=new Vn;m.setAttribute("position",new gi(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let b=new $e(m,h),y=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Kl;let d=this.type;this.render=function(E,w,x){if(y.enabled===!1||y.autoUpdate===!1&&y.needsUpdate===!1||E.length===0)return;this.type===AS&&(Rt("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=Kl);let A=e.getRenderTarget(),R=e.getActiveCubeFace(),O=e.getActiveMipmapLevel(),z=e.state;z.setBlending(ts),z.buffers.depth.getReversed()===!0?z.buffers.color.setClear(0,0,0,0):z.buffers.color.setClear(1,1,1,1),z.buffers.depth.setTest(!0),z.setScissorTest(!1);let G=d!==this.type;G&&w.traverse(function(L){L.material&&(Array.isArray(L.material)?L.material.forEach(H=>H.needsUpdate=!0):L.material.needsUpdate=!0)});for(let L=0,H=E.length;L<H;L++){let J=E[L],Z=J.shadow;if(Z===void 0){Rt("WebGLShadowMap:",J,"has no shadow.");continue}if(Z.autoUpdate===!1&&Z.needsUpdate===!1)continue;s.copy(Z.mapSize);let it=Z.getFrameExtents();s.multiply(it),a.copy(Z.mapSize),(s.x>u||s.y>u)&&(s.x>u&&(a.x=Math.floor(u/it.x),s.x=a.x*it.x,Z.mapSize.x=a.x),s.y>u&&(a.y=Math.floor(u/it.y),s.y=a.y*it.y,Z.mapSize.y=a.y));let X=e.state.buffers.depth.getReversed();if(Z.camera._reversedDepth=X,Z.map===null||G===!0){if(Z.map!==null&&(Z.map.depthTexture!==null&&(Z.map.depthTexture.dispose(),Z.map.depthTexture=null),Z.map.dispose()),this.type===xo){if(J.isPointLight){Rt("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}Z.map=new Fn(s.x,s.y,{format:Ta,type:Pi,minFilter:pn,magFilter:pn,generateMipmaps:!1}),Z.map.texture.name=J.name+".shadowMap",Z.map.depthTexture=new ma(s.x,s.y,Ii),Z.map.depthTexture.name=J.name+".shadowMapDepth",Z.map.depthTexture.format=Qi,Z.map.depthTexture.compareFunction=null,Z.map.depthTexture.minFilter=He,Z.map.depthTexture.magFilter=He}else J.isPointLight?(Z.map=new Pf(s.x),Z.map.depthTexture=new Rh(s.x,Oi)):(Z.map=new Fn(s.x,s.y),Z.map.depthTexture=new ma(s.x,s.y,Oi)),Z.map.depthTexture.name=J.name+".shadowMap",Z.map.depthTexture.format=Qi,this.type===Kl?(Z.map.depthTexture.compareFunction=X?Nf:Uf,Z.map.depthTexture.minFilter=pn,Z.map.depthTexture.magFilter=pn):(Z.map.depthTexture.compareFunction=null,Z.map.depthTexture.minFilter=He,Z.map.depthTexture.magFilter=He);Z.camera.updateProjectionMatrix()}Z.map.isWebGLCubeRenderTarget!==!0&&(Z.map.width!==s.x||Z.map.height!==s.y)&&Z.map.setSize(s.x,s.y);let tt=Z.map.isWebGLCubeRenderTarget?6:Z.getViewportCount();J.isPointLight!==!0&&Z.updateMatrices(J,x);for(let nt=0;nt<tt;nt++){let wt=Z.getCamera(nt);if(J.isPointLight){let Et=Z.camera,ge=Z.matrix,Qt=J.distance||Et.far;Qt!==Et.far&&(Et.far=Qt,Et.updateProjectionMatrix()),oc.setFromMatrixPosition(J.matrixWorld),Et.position.copy(oc),Fg.copy(Et.position),Fg.add(f2[nt]),Et.up.copy(d2[nt]),Et.lookAt(Fg),Et.updateMatrixWorld(),ge.makeTranslation(-oc.x,-oc.y,-oc.z),Nb.multiplyMatrices(Et.projectionMatrix,Et.matrixWorldInverse),Z._frustum.setFromProjectionMatrix(Nb,Et.coordinateSystem,Et.reversedDepth)}if(Z.map.isWebGLCubeRenderTarget)e.setRenderTarget(Z.map,nt),e.clear();else{nt===0&&(e.setRenderTarget(Z.map),e.clear());let Et=Z.getViewport(nt);r.set(a.x*Et.x,a.y*Et.y,a.x*Et.z,a.y*Et.w),z.viewport(r)}i=Z.getFrustum(nt),v(w,x,wt,J,this.type)}Z.isPointLightShadow!==!0&&this.type===xo&&g(Z,x),Z.needsUpdate=!1}d=this.type,y.needsUpdate=!1,e.setRenderTarget(A,R,O)};function g(E,w){let x=t.update(b);h.defines.VSM_SAMPLES!==E.blurSamples&&(h.defines.VSM_SAMPLES=E.blurSamples,f.defines.VSM_SAMPLES=E.blurSamples,h.needsUpdate=!0,f.needsUpdate=!0),E.mapPass===null?E.mapPass=new Fn(s.x,s.y,{format:Ta,type:Pi}):(E.mapPass.width!==E.map.width||E.mapPass.height!==E.map.height)&&E.mapPass.setSize(E.map.width,E.map.height),h.uniforms.shadow_pass.value=E.map.depthTexture,h.uniforms.resolution.value.set(E.map.width,E.map.height),h.uniforms.radius.value=E.radius,e.setRenderTarget(E.mapPass),e.clear(),e.renderBufferDirect(w,null,x,h,b,null),f.uniforms.shadow_pass.value=E.mapPass.texture,f.uniforms.resolution.value.set(E.map.width,E.map.height),f.uniforms.radius.value=E.radius,e.setRenderTarget(E.map),e.clear(),e.renderBufferDirect(w,null,x,f,b,null)}function M(E,w,x,A){let R=null,O=x.isPointLight===!0?E.customDistanceMaterial:E.customDepthMaterial;if(O!==void 0)R=O;else if(R=x.isPointLight===!0?l:o,e.localClippingEnabled&&w.clipShadows===!0&&Array.isArray(w.clippingPlanes)&&w.clippingPlanes.length!==0||w.displacementMap&&w.displacementScale!==0||w.alphaMap&&w.alphaTest>0||w.map&&w.alphaTest>0||w.alphaToCoverage===!0){let z=R.uuid,G=w.uuid,L=c[z];L===void 0&&(L={},c[z]=L);let H=L[G];H===void 0&&(H=R.clone(),L[G]=H,w.addEventListener("dispose",T)),R=H}if(R.visible=w.visible,R.wireframe=w.wireframe,A===xo?R.side=w.shadowSide!==null?w.shadowSide:w.side:R.side=w.shadowSide!==null?w.shadowSide:p[w.side],R.alphaMap=w.alphaMap,R.alphaTest=w.alphaToCoverage===!0?.5:w.alphaTest,R.map=w.map,R.clipShadows=w.clipShadows,R.clippingPlanes=w.clippingPlanes,R.clipIntersection=w.clipIntersection,R.displacementMap=w.displacementMap,R.displacementScale=w.displacementScale,R.displacementBias=w.displacementBias,R.wireframeLinewidth=w.wireframeLinewidth,R.linewidth=w.linewidth,x.isPointLight===!0&&R.isMeshDistanceMaterial===!0){let z=e.properties.get(R);z.light=x}return R}function v(E,w,x,A,R){if(E.visible===!1)return;if(E.layers.test(w.layers)&&(E.isMesh||E.isLine||E.isPoints)&&(E.castShadow||E.receiveShadow&&R===xo)&&(!E.frustumCulled||E.intersectsFrustum(i))){E.modelViewMatrix.multiplyMatrices(x.matrixWorldInverse,E.matrixWorld);let G=t.update(E),L=E.material;if(Array.isArray(L)){let H=G.groups;for(let J=0,Z=H.length;J<Z;J++){let it=H[J],X=L[it.materialIndex];if(X&&X.visible){let tt=M(E,X,A,R);E.onBeforeShadow(e,E,w,x,G,tt,it),e.renderBufferDirect(x,null,G,tt,E,it),E.onAfterShadow(e,E,w,x,G,tt,it)}}}else if(L.visible){let H=M(E,L,A,R);E.onBeforeShadow(e,E,w,x,G,H,null),e.renderBufferDirect(x,null,G,H,E,null),E.onAfterShadow(e,E,w,x,G,H,null)}}let z=E.children;for(let G=0,L=z.length;G<L;G++)v(z[G],w,x,A,R)}function T(E){E.target.removeEventListener("dispose",T);for(let x in c){let A=c[x],R=E.target.uuid;R in A&&(A[R].dispose(),delete A[R])}}}function m2(e,t){function n(){let U=!1,lt=new Le,K=null,ct=new Le(0,0,0,0);return{setMask:function(pt){K!==pt&&!U&&(e.colorMask(pt,pt,pt,pt),K=pt)},setLocked:function(pt){U=pt},setClear:function(pt,et,At,St,_e){_e===!0&&(pt*=St,et*=St,At*=St),lt.set(pt,et,At,St),ct.equals(lt)===!1&&(e.clearColor(pt,et,At,St),ct.copy(lt))},reset:function(){U=!1,K=null,ct.set(-1,0,0,0)}}}function i(){let U=!1,lt=!1,K=null,ct=null,pt=null;return{setReversed:function(et){if(lt!==et){let At=t.get("EXT_clip_control");et?At.clipControlEXT(At.LOWER_LEFT_EXT,At.ZERO_TO_ONE_EXT):At.clipControlEXT(At.LOWER_LEFT_EXT,At.NEGATIVE_ONE_TO_ONE_EXT),lt=et;let St=pt;pt=null,this.setClear(St)}},getReversed:function(){return lt},setTest:function(et){et?$(e.DEPTH_TEST):_t(e.DEPTH_TEST)},setMask:function(et){K!==et&&!U&&(e.depthMask(et),K=et)},setFunc:function(et){if(lt&&(et=ob[et]),ct!==et){switch(et){case dh:e.depthFunc(e.NEVER);break;case ph:e.depthFunc(e.ALWAYS);break;case mh:e.depthFunc(e.LESS);break;case po:e.depthFunc(e.LEQUAL);break;case gh:e.depthFunc(e.EQUAL);break;case yh:e.depthFunc(e.GEQUAL);break;case _h:e.depthFunc(e.GREATER);break;case vh:e.depthFunc(e.NOTEQUAL);break;default:e.depthFunc(e.LEQUAL)}ct=et}},setLocked:function(et){U=et},setClear:function(et){pt!==et&&(pt=et,lt&&(et=1-et),e.clearDepth(et))},reset:function(){U=!1,K=null,ct=null,pt=null,lt=!1}}}function s(){let U=!1,lt=null,K=null,ct=null,pt=null,et=null,At=null,St=null,_e=null;return{setTest:function(ae){U||(ae?$(e.STENCIL_TEST):_t(e.STENCIL_TEST))},setMask:function(ae){lt!==ae&&!U&&(e.stencilMask(ae),lt=ae)},setFunc:function(ae,Si,zi){(K!==ae||ct!==Si||pt!==zi)&&(e.stencilFunc(ae,Si,zi),K=ae,ct=Si,pt=zi)},setOp:function(ae,Si,zi){(et!==ae||At!==Si||St!==zi)&&(e.stencilOp(ae,Si,zi),et=ae,At=Si,St=zi)},setLocked:function(ae){U=ae},setClear:function(ae){_e!==ae&&(e.clearStencil(ae),_e=ae)},reset:function(){U=!1,lt=null,K=null,ct=null,pt=null,et=null,At=null,St=null,_e=null}}}let a=new n,r=new i,o=new s,l=new WeakMap,c=new WeakMap,u={},p={},h={},f=new WeakMap,m=[],b=null,y=!1,d=null,g=null,M=null,v=null,T=null,E=null,w=null,x=new te(0,0,0),A=0,R=!1,O=null,z=null,G=null,L=null,H=null,J=e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS),Z=!1,it=0,X=e.getParameter(e.VERSION);X.indexOf("WebGL")!==-1?(it=parseFloat(/^WebGL (\d)/.exec(X)[1]),Z=it>=1):X.indexOf("OpenGL ES")!==-1&&(it=parseFloat(/^OpenGL ES (\d)/.exec(X)[1]),Z=it>=2);let tt=null,nt={},wt=e.getParameter(e.SCISSOR_BOX),Et=e.getParameter(e.VIEWPORT),ge=new Le().fromArray(wt),Qt=new Le().fromArray(Et);function ne(U,lt,K,ct){let pt=new Uint8Array(4),et=e.createTexture();e.bindTexture(U,et),e.texParameteri(U,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(U,e.TEXTURE_MAG_FILTER,e.NEAREST);for(let At=0;At<K;At++)U===e.TEXTURE_3D||U===e.TEXTURE_2D_ARRAY?e.texImage3D(lt,0,e.RGBA,1,1,ct,0,e.RGBA,e.UNSIGNED_BYTE,pt):e.texImage2D(lt+At,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,pt);return et}let q={};q[e.TEXTURE_2D]=ne(e.TEXTURE_2D,e.TEXTURE_2D,1),q[e.TEXTURE_CUBE_MAP]=ne(e.TEXTURE_CUBE_MAP,e.TEXTURE_CUBE_MAP_POSITIVE_X,6),q[e.TEXTURE_2D_ARRAY]=ne(e.TEXTURE_2D_ARRAY,e.TEXTURE_2D_ARRAY,1,1),q[e.TEXTURE_3D]=ne(e.TEXTURE_3D,e.TEXTURE_3D,1,1),a.setClear(0,0,0,1),r.setClear(1),o.setClear(0),$(e.DEPTH_TEST),r.setFunc(po),qt(!1),Ce(ag),$(e.CULL_FACE),ee(ts);function $(U){u[U]!==!0&&(e.enable(U),u[U]=!0)}function _t(U){u[U]!==!1&&(e.disable(U),u[U]=!1)}function Ot(U,lt){return h[U]!==lt?(e.bindFramebuffer(U,lt),h[U]=lt,U===e.DRAW_FRAMEBUFFER&&(h[e.FRAMEBUFFER]=lt),U===e.FRAMEBUFFER&&(h[e.DRAW_FRAMEBUFFER]=lt),!0):!1}function gt(U,lt){let K=m,ct=!1;if(U){K=f.get(lt),K===void 0&&(K=[],f.set(lt,K));let pt=U.textures;if(K.length!==pt.length||K[0]!==e.COLOR_ATTACHMENT0){for(let et=0,At=pt.length;et<At;et++)K[et]=e.COLOR_ATTACHMENT0+et;K.length=pt.length,ct=!0}}else K[0]!==e.BACK&&(K[0]=e.BACK,ct=!0);ct&&e.drawBuffers(K)}function Vt(U){return b!==U?(e.useProgram(U),b=U,!0):!1}let Je={[tr]:e.FUNC_ADD,[CS]:e.FUNC_SUBTRACT,[RS]:e.FUNC_REVERSE_SUBTRACT};Je[DS]=e.MIN,Je[US]=e.MAX;let kt={[NS]:e.ZERO,[LS]:e.ONE,[OS]:e.SRC_COLOR,[cg]:e.SRC_ALPHA,[VS]:e.SRC_ALPHA_SATURATE,[zS]:e.DST_COLOR,[PS]:e.DST_ALPHA,[IS]:e.ONE_MINUS_SRC_COLOR,[ug]:e.ONE_MINUS_SRC_ALPHA,[FS]:e.ONE_MINUS_DST_COLOR,[BS]:e.ONE_MINUS_DST_ALPHA,[HS]:e.CONSTANT_COLOR,[kS]:e.ONE_MINUS_CONSTANT_COLOR,[GS]:e.CONSTANT_ALPHA,[WS]:e.ONE_MINUS_CONSTANT_ALPHA};function ee(U,lt,K,ct,pt,et,At,St,_e,ae){if(U===ts){y===!0&&(_t(e.BLEND),y=!1);return}if(y===!1&&($(e.BLEND),y=!0),U!==wS){if(U!==d||ae!==R){if((g!==tr||T!==tr)&&(e.blendEquation(e.FUNC_ADD),g=tr,T=tr),ae)switch(U){case So:e.blendFuncSeparate(e.ONE,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case rg:e.blendFunc(e.ONE,e.ONE);break;case og:e.blendFuncSeparate(e.ZERO,e.ONE_MINUS_SRC_COLOR,e.ZERO,e.ONE);break;case lg:e.blendFuncSeparate(e.DST_COLOR,e.ONE_MINUS_SRC_ALPHA,e.ZERO,e.ONE);break;default:Ut("WebGLState: Invalid blending: ",U);break}else switch(U){case So:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case rg:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE,e.ONE,e.ONE);break;case og:Ut("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case lg:Ut("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Ut("WebGLState: Invalid blending: ",U);break}M=null,v=null,E=null,w=null,x.set(0,0,0),A=0,d=U,R=ae}return}pt=pt||lt,et=et||K,At=At||ct,(lt!==g||pt!==T)&&(e.blendEquationSeparate(Je[lt],Je[pt]),g=lt,T=pt),(K!==M||ct!==v||et!==E||At!==w)&&(e.blendFuncSeparate(kt[K],kt[ct],kt[et],kt[At]),M=K,v=ct,E=et,w=At),(St.equals(x)===!1||_e!==A)&&(e.blendColor(St.r,St.g,St.b,_e),x.copy(St),A=_e),d=U,R=!1}function ye(U,lt){U.side===vi?_t(e.CULL_FACE):$(e.CULL_FACE);let K=U.side===wn;lt&&(K=!K),qt(K),U.blending===So&&U.transparent===!1?ee(ts):ee(U.blending,U.blendEquation,U.blendSrc,U.blendDst,U.blendEquationAlpha,U.blendSrcAlpha,U.blendDstAlpha,U.blendColor,U.blendAlpha,U.premultipliedAlpha),r.setFunc(U.depthFunc),r.setTest(U.depthTest),r.setMask(U.depthWrite),a.setMask(U.colorWrite);let ct=U.stencilWrite;o.setTest(ct),ct&&(o.setMask(U.stencilWriteMask),o.setFunc(U.stencilFunc,U.stencilRef,U.stencilFuncMask),o.setOp(U.stencilFail,U.stencilZFail,U.stencilZPass)),Rn(U.polygonOffset,U.polygonOffsetFactor,U.polygonOffsetUnits),U.alphaToCoverage===!0?$(e.SAMPLE_ALPHA_TO_COVERAGE):_t(e.SAMPLE_ALPHA_TO_COVERAGE)}function qt(U){O!==U&&(U?e.frontFace(e.CW):e.frontFace(e.CCW),O=U)}function Ce(U){U!==TS?($(e.CULL_FACE),U!==z&&(U===ag?e.cullFace(e.BACK):U===ES?e.cullFace(e.FRONT):e.cullFace(e.FRONT_AND_BACK))):_t(e.CULL_FACE),z=U}function nn(U){U!==G&&(Z&&e.lineWidth(U),G=U)}function Rn(U,lt,K){U?($(e.POLYGON_OFFSET_FILL),(L!==lt||H!==K)&&(L=lt,H=K,r.getReversed()&&(lt=-lt),e.polygonOffset(lt,K))):_t(e.POLYGON_OFFSET_FILL)}function Ne(U){U?$(e.SCISSOR_TEST):_t(e.SCISSOR_TEST)}function ke(U){U===void 0&&(U=e.TEXTURE0+J-1),tt!==U&&(e.activeTexture(U),tt=U)}function N(U,lt,K){K===void 0&&(tt===null?K=e.TEXTURE0+J-1:K=tt);let ct=nt[K];ct===void 0&&(ct={type:void 0,texture:void 0},nt[K]=ct),(ct.type!==U||ct.texture!==lt)&&(tt!==K&&(e.activeTexture(K),tt=K),e.bindTexture(U,lt||q[U]),ct.type=U,ct.texture=lt)}function mn(){let U=nt[tt];U!==void 0&&U.type!==void 0&&(e.bindTexture(U.type,null),U.type=void 0,U.texture=void 0)}function le(){try{e.compressedTexImage2D(...arguments)}catch(U){Ut("WebGLState:",U)}}function C(){try{e.compressedTexImage3D(...arguments)}catch(U){Ut("WebGLState:",U)}}function _(){try{e.texSubImage2D(...arguments)}catch(U){Ut("WebGLState:",U)}}function I(){try{e.texSubImage3D(...arguments)}catch(U){Ut("WebGLState:",U)}}function F(){try{e.compressedTexSubImage2D(...arguments)}catch(U){Ut("WebGLState:",U)}}function W(){try{e.compressedTexSubImage3D(...arguments)}catch(U){Ut("WebGLState:",U)}}function st(){try{e.texStorage2D(...arguments)}catch(U){Ut("WebGLState:",U)}}function at(){try{e.texStorage3D(...arguments)}catch(U){Ut("WebGLState:",U)}}function Y(){try{e.texImage2D(...arguments)}catch(U){Ut("WebGLState:",U)}}function Q(){try{e.texImage3D(...arguments)}catch(U){Ut("WebGLState:",U)}}function rt(U){return p[U]!==void 0?p[U]:e.getParameter(U)}function Mt(U,lt){p[U]!==lt&&(e.pixelStorei(U,lt),p[U]=lt)}function ut(U){ge.equals(U)===!1&&(e.scissor(U.x,U.y,U.z,U.w),ge.copy(U))}function ot(U){Qt.equals(U)===!1&&(e.viewport(U.x,U.y,U.z,U.w),Qt.copy(U))}function Tt(U,lt){let K=c.get(lt);K===void 0&&(K=new WeakMap,c.set(lt,K));let ct=K.get(U);ct===void 0&&(ct=e.getUniformBlockIndex(lt,U.name),K.set(U,ct))}function Ct(U,lt){let ct=c.get(lt).get(U);l.get(lt)!==ct&&(e.uniformBlockBinding(lt,ct,U.__bindingPointIndex),l.set(lt,ct))}function Pt(){e.disable(e.BLEND),e.disable(e.CULL_FACE),e.disable(e.DEPTH_TEST),e.disable(e.POLYGON_OFFSET_FILL),e.disable(e.SCISSOR_TEST),e.disable(e.STENCIL_TEST),e.disable(e.SAMPLE_ALPHA_TO_COVERAGE),e.blendEquation(e.FUNC_ADD),e.blendFunc(e.ONE,e.ZERO),e.blendFuncSeparate(e.ONE,e.ZERO,e.ONE,e.ZERO),e.blendColor(0,0,0,0),e.colorMask(!0,!0,!0,!0),e.clearColor(0,0,0,0),e.depthMask(!0),e.depthFunc(e.LESS),r.setReversed(!1),e.clearDepth(1),e.stencilMask(4294967295),e.stencilFunc(e.ALWAYS,0,4294967295),e.stencilOp(e.KEEP,e.KEEP,e.KEEP),e.clearStencil(0),e.cullFace(e.BACK),e.frontFace(e.CCW),e.polygonOffset(0,0),e.activeTexture(e.TEXTURE0),e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),e.bindFramebuffer(e.READ_FRAMEBUFFER,null),e.useProgram(null),e.lineWidth(1),e.scissor(0,0,e.canvas.width,e.canvas.height),e.viewport(0,0,e.canvas.width,e.canvas.height),e.pixelStorei(e.PACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!1),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,e.BROWSER_DEFAULT_WEBGL),e.pixelStorei(e.PACK_ROW_LENGTH,0),e.pixelStorei(e.PACK_SKIP_PIXELS,0),e.pixelStorei(e.PACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_ROW_LENGTH,0),e.pixelStorei(e.UNPACK_IMAGE_HEIGHT,0),e.pixelStorei(e.UNPACK_SKIP_PIXELS,0),e.pixelStorei(e.UNPACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_SKIP_IMAGES,0),u={},p={},tt=null,nt={},h={},f=new WeakMap,m=[],b=null,y=!1,d=null,g=null,M=null,v=null,T=null,E=null,w=null,x=new te(0,0,0),A=0,R=!1,O=null,z=null,G=null,L=null,H=null,ge.set(0,0,e.canvas.width,e.canvas.height),Qt.set(0,0,e.canvas.width,e.canvas.height),a.reset(),r.reset(),o.reset()}return{buffers:{color:a,depth:r,stencil:o},enable:$,disable:_t,bindFramebuffer:Ot,drawBuffers:gt,useProgram:Vt,setBlending:ee,setMaterial:ye,setFlipSided:qt,setCullFace:Ce,setLineWidth:nn,setPolygonOffset:Rn,setScissorTest:Ne,activeTexture:ke,bindTexture:N,unbindTexture:mn,compressedTexImage2D:le,compressedTexImage3D:C,texImage2D:Y,texImage3D:Q,pixelStorei:Mt,getParameter:rt,updateUBOMapping:Tt,uniformBlockBinding:Ct,texStorage2D:st,texStorage3D:at,texSubImage2D:_,texSubImage3D:I,compressedTexSubImage2D:F,compressedTexSubImage3D:W,scissor:ut,viewport:ot,reset:Pt}}function g2(e,t,n,i,s,a,r){let o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new $t,u=new WeakMap,p=new Set,h,f=new WeakMap,m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function b(C,_){return m?new OffscreenCanvas(C,_):zl("canvas")}function y(C,_,I){let F=1,W=le(C);if((W.width>I||W.height>I)&&(F=I/Math.max(W.width,W.height)),F<1)if(typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&C instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&C instanceof ImageBitmap||typeof VideoFrame<"u"&&C instanceof VideoFrame){let st=Math.floor(F*W.width),at=Math.floor(F*W.height);h===void 0&&(h=b(st,at));let Y=_?b(st,at):h;return Y.width=st,Y.height=at,Y.getContext("2d").drawImage(C,0,0,st,at),Rt("WebGLRenderer: Texture has been resized from ("+W.width+"x"+W.height+") to ("+st+"x"+at+")."),Y}else return"data"in C&&Rt("WebGLRenderer: Image in DataTexture is too big ("+W.width+"x"+W.height+")."),C;return C}function d(C){return C.generateMipmaps}function g(C){e.generateMipmap(C)}function M(C){return C.isWebGLCubeRenderTarget?e.TEXTURE_CUBE_MAP:C.isWebGL3DRenderTarget?e.TEXTURE_3D:C.isWebGLArrayRenderTarget||C.isCompressedArrayTexture?e.TEXTURE_2D_ARRAY:e.TEXTURE_2D}function v(C,_,I,F,W,st=!1){if(C!==null){if(e[C]!==void 0)return e[C];Rt("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+C+"'")}let at;F&&(at=t.get("EXT_texture_norm16"),at||Rt("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let Y=_;if(_===e.RED&&(I===e.FLOAT&&(Y=e.R32F),I===e.HALF_FLOAT&&(Y=e.R16F),I===e.UNSIGNED_BYTE&&(Y=e.R8),I===e.UNSIGNED_SHORT&&at&&(Y=at.R16_EXT),I===e.SHORT&&at&&(Y=at.R16_SNORM_EXT)),_===e.RED_INTEGER&&(I===e.UNSIGNED_BYTE&&(Y=e.R8UI),I===e.UNSIGNED_SHORT&&(Y=e.R16UI),I===e.UNSIGNED_INT&&(Y=e.R32UI),I===e.BYTE&&(Y=e.R8I),I===e.SHORT&&(Y=e.R16I),I===e.INT&&(Y=e.R32I)),_===e.RG&&(I===e.FLOAT&&(Y=e.RG32F),I===e.HALF_FLOAT&&(Y=e.RG16F),I===e.UNSIGNED_BYTE&&(Y=e.RG8),I===e.UNSIGNED_SHORT&&at&&(Y=at.RG16_EXT),I===e.SHORT&&at&&(Y=at.RG16_SNORM_EXT)),_===e.RG_INTEGER&&(I===e.UNSIGNED_BYTE&&(Y=e.RG8UI),I===e.UNSIGNED_SHORT&&(Y=e.RG16UI),I===e.UNSIGNED_INT&&(Y=e.RG32UI),I===e.BYTE&&(Y=e.RG8I),I===e.SHORT&&(Y=e.RG16I),I===e.INT&&(Y=e.RG32I)),_===e.RGB_INTEGER&&(I===e.UNSIGNED_BYTE&&(Y=e.RGB8UI),I===e.UNSIGNED_SHORT&&(Y=e.RGB16UI),I===e.UNSIGNED_INT&&(Y=e.RGB32UI),I===e.BYTE&&(Y=e.RGB8I),I===e.SHORT&&(Y=e.RGB16I),I===e.INT&&(Y=e.RGB32I)),_===e.RGBA_INTEGER&&(I===e.UNSIGNED_BYTE&&(Y=e.RGBA8UI),I===e.UNSIGNED_SHORT&&(Y=e.RGBA16UI),I===e.UNSIGNED_INT&&(Y=e.RGBA32UI),I===e.BYTE&&(Y=e.RGBA8I),I===e.SHORT&&(Y=e.RGBA16I),I===e.INT&&(Y=e.RGBA32I)),_===e.RGB&&(I===e.UNSIGNED_SHORT&&at&&(Y=at.RGB16_EXT),I===e.SHORT&&at&&(Y=at.RGB16_SNORM_EXT),I===e.UNSIGNED_INT_5_9_9_9_REV&&(Y=e.RGB9_E5),I===e.UNSIGNED_INT_10F_11F_11F_REV&&(Y=e.R11F_G11F_B10F)),_===e.RGBA){let Q=st?Pl:Zt.getTransfer(W);I===e.FLOAT&&(Y=e.RGBA32F),I===e.HALF_FLOAT&&(Y=e.RGBA16F),I===e.UNSIGNED_BYTE&&(Y=Q===oe?e.SRGB8_ALPHA8:e.RGBA8),I===e.UNSIGNED_SHORT&&at&&(Y=at.RGBA16_EXT),I===e.SHORT&&at&&(Y=at.RGBA16_SNORM_EXT),I===e.UNSIGNED_SHORT_4_4_4_4&&(Y=e.RGBA4),I===e.UNSIGNED_SHORT_5_5_5_1&&(Y=e.RGB5_A1)}return(Y===e.R16F||Y===e.R32F||Y===e.RG16F||Y===e.RG32F||Y===e.RGBA16F||Y===e.RGBA32F)&&t.get("EXT_color_buffer_float"),Y}function T(C,_){let I;return C?_===null||_===Oi||_===Mo?I=e.DEPTH24_STENCIL8:_===Ii?I=e.DEPTH32F_STENCIL8:_===bo&&(I=e.DEPTH24_STENCIL8,Rt("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):_===null||_===Oi||_===Mo?I=e.DEPTH_COMPONENT24:_===Ii?I=e.DEPTH_COMPONENT32F:_===bo&&(I=e.DEPTH_COMPONENT16),I}function E(C,_){return d(C)===!0||C.isFramebufferTexture&&C.minFilter!==He&&C.minFilter!==pn?Math.log2(Math.max(_.width,_.height))+1:C.mipmaps!==void 0&&C.mipmaps.length>0?C.mipmaps.length:C.isCompressedTexture&&Array.isArray(C.image)?_.mipmaps.length:1}function w(C){let _=C.target;_.removeEventListener("dispose",w),A(_),_.isVideoTexture&&u.delete(_),_.isHTMLTexture&&p.delete(_)}function x(C){let _=C.target;_.removeEventListener("dispose",x),O(_)}function A(C){let _=i.get(C);if(_.__webglInit===void 0)return;let I=C.source,F=f.get(I);if(F){let W=F[_.__cacheKey];W.usedTimes--,W.usedTimes===0&&R(C),Object.keys(F).length===0&&f.delete(I)}i.remove(C)}function R(C){let _=i.get(C);e.deleteTexture(_.__webglTexture);let I=C.source,F=f.get(I);delete F[_.__cacheKey],r.memory.textures--}function O(C){let _=i.get(C);if(C.depthTexture&&(C.depthTexture.dispose(),i.remove(C.depthTexture)),C.isWebGLCubeRenderTarget)for(let F=0;F<6;F++){if(Array.isArray(_.__webglFramebuffer[F]))for(let W=0;W<_.__webglFramebuffer[F].length;W++)e.deleteFramebuffer(_.__webglFramebuffer[F][W]);else e.deleteFramebuffer(_.__webglFramebuffer[F]);_.__webglDepthbuffer&&e.deleteRenderbuffer(_.__webglDepthbuffer[F])}else{if(Array.isArray(_.__webglFramebuffer))for(let F=0;F<_.__webglFramebuffer.length;F++)e.deleteFramebuffer(_.__webglFramebuffer[F]);else e.deleteFramebuffer(_.__webglFramebuffer);if(_.__webglDepthbuffer&&e.deleteRenderbuffer(_.__webglDepthbuffer),_.__webglMultisampledFramebuffer&&e.deleteFramebuffer(_.__webglMultisampledFramebuffer),_.__webglColorRenderbuffer)for(let F=0;F<_.__webglColorRenderbuffer.length;F++)_.__webglColorRenderbuffer[F]&&e.deleteRenderbuffer(_.__webglColorRenderbuffer[F]);_.__webglDepthRenderbuffer&&e.deleteRenderbuffer(_.__webglDepthRenderbuffer)}let I=C.textures;for(let F=0,W=I.length;F<W;F++){let st=i.get(I[F]);st.__webglTexture&&(e.deleteTexture(st.__webglTexture),r.memory.textures--),i.remove(I[F])}i.remove(C)}let z=0;function G(){z=0}function L(){return z}function H(C){z=C}function J(){let C=z;return C>=s.maxTextures&&Rt("WebGLTextures: Trying to use "+(C+1)+" texture units while this GPU supports only "+s.maxTextures),z+=1,C}function Z(C){let _=[];return _.push(C.wrapS),_.push(C.wrapT),_.push(C.wrapR||0),_.push(C.magFilter),_.push(C.minFilter),_.push(C.anisotropy),_.push(C.internalFormat),_.push(C.format),_.push(C.type),_.push(C.generateMipmaps),_.push(C.premultiplyAlpha),_.push(C.flipY),_.push(C.unpackAlignment),_.push(C.colorSpace),_.join()}function it(C,_){let I=i.get(C);if(C.isVideoTexture&&N(C),C.isRenderTargetTexture===!1&&C.isExternalTexture!==!0&&C.version>0&&I.__version!==C.version){let F=C.image;if(F===null)Rt("WebGLRenderer: Texture marked for update but no image data found.");else if(F.complete===!1)Rt("WebGLRenderer: Texture marked for update but image is incomplete");else{_t(I,C,_);return}}else C.isExternalTexture&&(I.__webglTexture=C.sourceTexture?C.sourceTexture:null);n.bindTexture(e.TEXTURE_2D,I.__webglTexture,e.TEXTURE0+_)}function X(C,_){let I=i.get(C);if(C.isRenderTargetTexture===!1&&C.version>0&&I.__version!==C.version){_t(I,C,_);return}else C.isExternalTexture&&(I.__webglTexture=C.sourceTexture?C.sourceTexture:null);n.bindTexture(e.TEXTURE_2D_ARRAY,I.__webglTexture,e.TEXTURE0+_)}function tt(C,_){let I=i.get(C);if(C.isRenderTargetTexture===!1&&C.version>0&&I.__version!==C.version){_t(I,C,_);return}n.bindTexture(e.TEXTURE_3D,I.__webglTexture,e.TEXTURE0+_)}function nt(C,_){let I=i.get(C);if(C.isCubeDepthTexture!==!0&&C.version>0&&I.__version!==C.version){Ot(I,C,_);return}n.bindTexture(e.TEXTURE_CUBE_MAP,I.__webglTexture,e.TEXTURE0+_)}let wt={[xh]:e.REPEAT,[Ki]:e.CLAMP_TO_EDGE,[Sh]:e.MIRRORED_REPEAT},Et={[He]:e.NEAREST,[YS]:e.NEAREST_MIPMAP_NEAREST,[jl]:e.NEAREST_MIPMAP_LINEAR,[pn]:e.LINEAR,[Yh]:e.LINEAR_MIPMAP_NEAREST,[ba]:e.LINEAR_MIPMAP_LINEAR},ge={[QS]:e.NEVER,[nb]:e.ALWAYS,[jS]:e.LESS,[Uf]:e.LEQUAL,[$S]:e.EQUAL,[Nf]:e.GEQUAL,[tb]:e.GREATER,[eb]:e.NOTEQUAL};function Qt(C,_){if(_.type===Ii&&t.has("OES_texture_float_linear")===!1&&(_.magFilter===pn||_.magFilter===Yh||_.magFilter===jl||_.magFilter===ba||_.minFilter===pn||_.minFilter===Yh||_.minFilter===jl||_.minFilter===ba)&&Rt("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),e.texParameteri(C,e.TEXTURE_WRAP_S,wt[_.wrapS]),e.texParameteri(C,e.TEXTURE_WRAP_T,wt[_.wrapT]),(C===e.TEXTURE_3D||C===e.TEXTURE_2D_ARRAY)&&e.texParameteri(C,e.TEXTURE_WRAP_R,wt[_.wrapR]),e.texParameteri(C,e.TEXTURE_MAG_FILTER,Et[_.magFilter]),e.texParameteri(C,e.TEXTURE_MIN_FILTER,Et[_.minFilter]),_.compareFunction&&(e.texParameteri(C,e.TEXTURE_COMPARE_MODE,e.COMPARE_REF_TO_TEXTURE),e.texParameteri(C,e.TEXTURE_COMPARE_FUNC,ge[_.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(_.magFilter===He||_.minFilter!==jl&&_.minFilter!==ba||_.type===Ii&&t.has("OES_texture_float_linear")===!1)return;if(_.anisotropy>1||i.get(_).__currentAnisotropy){let I=t.get("EXT_texture_filter_anisotropic");e.texParameterf(C,I.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(_.anisotropy,s.getMaxAnisotropy())),i.get(_).__currentAnisotropy=_.anisotropy}}}function ne(C,_){let I=!1;C.__webglInit===void 0&&(C.__webglInit=!0,_.addEventListener("dispose",w));let F=_.source,W=f.get(F);W===void 0&&(W={},f.set(F,W));let st=Z(_);if(st!==C.__cacheKey){W[st]===void 0&&(W[st]={texture:e.createTexture(),usedTimes:0},r.memory.textures++,I=!0),W[st].usedTimes++;let at=W[C.__cacheKey];at!==void 0&&(W[C.__cacheKey].usedTimes--,at.usedTimes===0&&R(_)),C.__cacheKey=st,C.__webglTexture=W[st].texture}return I}function q(C,_,I){return Math.floor(Math.floor(C/I)/_)}function $(C,_,I,F){let st=C.updateRanges;if(st.length===0)n.texSubImage2D(e.TEXTURE_2D,0,0,0,_.width,_.height,I,F,_.data);else{st.sort((Mt,ut)=>Mt.start-ut.start);let at=0;for(let Mt=1;Mt<st.length;Mt++){let ut=st[at],ot=st[Mt],Tt=ut.start+ut.count,Ct=q(ot.start,_.width,4),Pt=q(ut.start,_.width,4);ot.start<=Tt+1&&Ct===Pt&&q(ot.start+ot.count-1,_.width,4)===Ct?ut.count=Math.max(ut.count,ot.start+ot.count-ut.start):(++at,st[at]=ot)}st.length=at+1;let Y=n.getParameter(e.UNPACK_ROW_LENGTH),Q=n.getParameter(e.UNPACK_SKIP_PIXELS),rt=n.getParameter(e.UNPACK_SKIP_ROWS);n.pixelStorei(e.UNPACK_ROW_LENGTH,_.width);for(let Mt=0,ut=st.length;Mt<ut;Mt++){let ot=st[Mt],Tt=Math.floor(ot.start/4),Ct=Math.ceil(ot.count/4),Pt=Tt%_.width,U=Math.floor(Tt/_.width),lt=Ct,K=1;n.pixelStorei(e.UNPACK_SKIP_PIXELS,Pt),n.pixelStorei(e.UNPACK_SKIP_ROWS,U),n.texSubImage2D(e.TEXTURE_2D,0,Pt,U,lt,K,I,F,_.data)}C.clearUpdateRanges(),n.pixelStorei(e.UNPACK_ROW_LENGTH,Y),n.pixelStorei(e.UNPACK_SKIP_PIXELS,Q),n.pixelStorei(e.UNPACK_SKIP_ROWS,rt)}}function _t(C,_,I){let F=e.TEXTURE_2D;(_.isDataArrayTexture||_.isCompressedArrayTexture)&&(F=e.TEXTURE_2D_ARRAY),_.isData3DTexture&&(F=e.TEXTURE_3D);let W=ne(C,_),st=_.source;n.bindTexture(F,C.__webglTexture,e.TEXTURE0+I);let at=i.get(st);if(st.version!==at.__version||W===!0){if(n.activeTexture(e.TEXTURE0+I),(typeof ImageBitmap<"u"&&_.image instanceof ImageBitmap)===!1){let K=Zt.getPrimaries(Zt.workingColorSpace),ct=_.colorSpace===Rs?null:Zt.getPrimaries(_.colorSpace),pt=_.colorSpace===Rs||K===ct?e.NONE:e.BROWSER_DEFAULT_WEBGL;n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,_.flipY),n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,pt)}n.pixelStorei(e.UNPACK_ALIGNMENT,_.unpackAlignment);let Q=y(_.image,!1,s.maxTextureSize);Q=mn(_,Q);let rt=a.convert(_.format,_.colorSpace),Mt=a.convert(_.type),ut=v(_.internalFormat,rt,Mt,_.normalized,_.colorSpace,_.isVideoTexture);Qt(F,_);let ot,Tt=_.mipmaps,Ct=_.isVideoTexture!==!0,Pt=at.__version===void 0||W===!0,U=st.dataReady,lt=E(_,Q);if(_.isDepthTexture)ut=T(_.format===Ma,_.type),Pt&&(Ct?n.texStorage2D(e.TEXTURE_2D,1,ut,Q.width,Q.height):n.texImage2D(e.TEXTURE_2D,0,ut,Q.width,Q.height,0,rt,Mt,null));else if(_.isDataTexture)if(Tt.length>0){Ct&&Pt&&n.texStorage2D(e.TEXTURE_2D,lt,ut,Tt[0].width,Tt[0].height);for(let K=0,ct=Tt.length;K<ct;K++)ot=Tt[K],Ct?U&&n.texSubImage2D(e.TEXTURE_2D,K,0,0,ot.width,ot.height,rt,Mt,ot.data):n.texImage2D(e.TEXTURE_2D,K,ut,ot.width,ot.height,0,rt,Mt,ot.data);_.generateMipmaps=!1}else Ct?(Pt&&n.texStorage2D(e.TEXTURE_2D,lt,ut,Q.width,Q.height),U&&$(_,Q,rt,Mt)):n.texImage2D(e.TEXTURE_2D,0,ut,Q.width,Q.height,0,rt,Mt,Q.data);else if(_.isCompressedTexture)if(_.isCompressedArrayTexture){Ct&&Pt&&n.texStorage3D(e.TEXTURE_2D_ARRAY,lt,ut,Tt[0].width,Tt[0].height,Q.depth);for(let K=0,ct=Tt.length;K<ct;K++)if(ot=Tt[K],_.format!==xi)if(rt!==null)if(Ct){if(U)if(_.layerUpdates.size>0){let pt=Lg(ot.width,ot.height,_.format,_.type);for(let et of _.layerUpdates){let At=ot.data.subarray(et*pt/ot.data.BYTES_PER_ELEMENT,(et+1)*pt/ot.data.BYTES_PER_ELEMENT);n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,K,0,0,et,ot.width,ot.height,1,rt,At)}}else n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,K,0,0,0,ot.width,ot.height,Q.depth,rt,ot.data)}else n.compressedTexImage3D(e.TEXTURE_2D_ARRAY,K,ut,ot.width,ot.height,Q.depth,0,ot.data,0,0);else Rt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ct?U&&n.texSubImage3D(e.TEXTURE_2D_ARRAY,K,0,0,0,ot.width,ot.height,Q.depth,rt,Mt,ot.data):n.texImage3D(e.TEXTURE_2D_ARRAY,K,ut,ot.width,ot.height,Q.depth,0,rt,Mt,ot.data);_.layerUpdates.size>0&&_.clearLayerUpdates()}else{Ct&&Pt&&n.texStorage2D(e.TEXTURE_2D,lt,ut,Tt[0].width,Tt[0].height);for(let K=0,ct=Tt.length;K<ct;K++)ot=Tt[K],_.format!==xi?rt!==null?Ct?U&&n.compressedTexSubImage2D(e.TEXTURE_2D,K,0,0,ot.width,ot.height,rt,ot.data):n.compressedTexImage2D(e.TEXTURE_2D,K,ut,ot.width,ot.height,0,ot.data):Rt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ct?U&&n.texSubImage2D(e.TEXTURE_2D,K,0,0,ot.width,ot.height,rt,Mt,ot.data):n.texImage2D(e.TEXTURE_2D,K,ut,ot.width,ot.height,0,rt,Mt,ot.data)}else if(_.isDataArrayTexture)if(Ct){if(Pt&&n.texStorage3D(e.TEXTURE_2D_ARRAY,lt,ut,Q.width,Q.height,Q.depth),U)if(_.layerUpdates.size>0){let K=Lg(Q.width,Q.height,_.format,_.type);for(let ct of _.layerUpdates){let pt=Q.data.subarray(ct*K/Q.data.BYTES_PER_ELEMENT,(ct+1)*K/Q.data.BYTES_PER_ELEMENT);n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,ct,Q.width,Q.height,1,rt,Mt,pt)}_.clearLayerUpdates()}else n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,0,Q.width,Q.height,Q.depth,rt,Mt,Q.data)}else n.texImage3D(e.TEXTURE_2D_ARRAY,0,ut,Q.width,Q.height,Q.depth,0,rt,Mt,Q.data);else if(_.isData3DTexture)Ct?(Pt&&n.texStorage3D(e.TEXTURE_3D,lt,ut,Q.width,Q.height,Q.depth),U&&n.texSubImage3D(e.TEXTURE_3D,0,0,0,0,Q.width,Q.height,Q.depth,rt,Mt,Q.data)):n.texImage3D(e.TEXTURE_3D,0,ut,Q.width,Q.height,Q.depth,0,rt,Mt,Q.data);else if(_.isFramebufferTexture){if(Pt)if(Ct)n.texStorage2D(e.TEXTURE_2D,lt,ut,Q.width,Q.height);else{let K=Q.width,ct=Q.height;for(let pt=0;pt<lt;pt++)n.texImage2D(e.TEXTURE_2D,pt,ut,K,ct,0,rt,Mt,null),K>>=1,ct>>=1}}else if(_.isHTMLTexture){if("texElementImage2D"in e){let K=e.canvas;if(K.hasAttribute("layoutsubtree")||K.setAttribute("layoutsubtree","true"),Q.parentNode!==K){K.appendChild(Q),p.add(_),K.onpaint=ct=>{let pt=ct.changedElements;for(let et of p)pt.includes(et.image)&&(et.needsUpdate=!0)},K.requestPaint();return}if(e.texElementImage2D.length===3)e.texElementImage2D(e.TEXTURE_2D,e.RGBA8,Q);else{let pt=e.RGBA,et=e.RGBA,At=e.UNSIGNED_BYTE;e.texElementImage2D(e.TEXTURE_2D,0,pt,et,At,Q)}e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE)}}else if(Tt.length>0){if(Ct&&Pt){let K=le(Tt[0]);n.texStorage2D(e.TEXTURE_2D,lt,ut,K.width,K.height)}for(let K=0,ct=Tt.length;K<ct;K++)ot=Tt[K],Ct?U&&n.texSubImage2D(e.TEXTURE_2D,K,0,0,rt,Mt,ot):n.texImage2D(e.TEXTURE_2D,K,ut,rt,Mt,ot);_.generateMipmaps=!1}else if(Ct){if(Pt){let K=le(Q);n.texStorage2D(e.TEXTURE_2D,lt,ut,K.width,K.height)}U&&n.texSubImage2D(e.TEXTURE_2D,0,0,0,rt,Mt,Q)}else n.texImage2D(e.TEXTURE_2D,0,ut,rt,Mt,Q);d(_)&&g(F),at.__version=st.version,_.onUpdate&&_.onUpdate(_)}C.__version=_.version}function Ot(C,_,I){if(_.image.length!==6)return;let F=ne(C,_),W=_.source;n.bindTexture(e.TEXTURE_CUBE_MAP,C.__webglTexture,e.TEXTURE0+I);let st=i.get(W);if(W.version!==st.__version||F===!0){n.activeTexture(e.TEXTURE0+I);let at=Zt.getPrimaries(Zt.workingColorSpace),Y=_.colorSpace===Rs?null:Zt.getPrimaries(_.colorSpace),Q=_.colorSpace===Rs||at===Y?e.NONE:e.BROWSER_DEFAULT_WEBGL;n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,_.flipY),n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),n.pixelStorei(e.UNPACK_ALIGNMENT,_.unpackAlignment),n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,Q);let rt=_.isCompressedTexture||_.image[0].isCompressedTexture,Mt=_.image[0]&&_.image[0].isDataTexture,ut=[];for(let et=0;et<6;et++)!rt&&!Mt?ut[et]=y(_.image[et],!0,s.maxCubemapSize):ut[et]=Mt?_.image[et].image:_.image[et],ut[et]=mn(_,ut[et]);let ot=ut[0],Tt=a.convert(_.format,_.colorSpace),Ct=a.convert(_.type),Pt=v(_.internalFormat,Tt,Ct,_.normalized,_.colorSpace),U=_.isVideoTexture!==!0,lt=st.__version===void 0||F===!0,K=W.dataReady,ct=E(_,ot);Qt(e.TEXTURE_CUBE_MAP,_);let pt;if(rt){U&&lt&&n.texStorage2D(e.TEXTURE_CUBE_MAP,ct,Pt,ot.width,ot.height);for(let et=0;et<6;et++){pt=ut[et].mipmaps;for(let At=0;At<pt.length;At++){let St=pt[At];_.format!==xi?Tt!==null?U?K&&n.compressedTexSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+et,At,0,0,St.width,St.height,Tt,St.data):n.compressedTexImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+et,At,Pt,St.width,St.height,0,St.data):Rt("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):U?K&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+et,At,0,0,St.width,St.height,Tt,Ct,St.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+et,At,Pt,St.width,St.height,0,Tt,Ct,St.data)}}}else{if(pt=_.mipmaps,U&&lt){pt.length>0&&ct++;let et=le(ut[0]);n.texStorage2D(e.TEXTURE_CUBE_MAP,ct,Pt,et.width,et.height)}for(let et=0;et<6;et++)if(Mt){U?K&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+et,0,0,0,ut[et].width,ut[et].height,Tt,Ct,ut[et].data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+et,0,Pt,ut[et].width,ut[et].height,0,Tt,Ct,ut[et].data);for(let At=0;At<pt.length;At++){let _e=pt[At].image[et].image;U?K&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+et,At+1,0,0,_e.width,_e.height,Tt,Ct,_e.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+et,At+1,Pt,_e.width,_e.height,0,Tt,Ct,_e.data)}}else{U?K&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+et,0,0,0,Tt,Ct,ut[et]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+et,0,Pt,Tt,Ct,ut[et]);for(let At=0;At<pt.length;At++){let St=pt[At];U?K&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+et,At+1,0,0,Tt,Ct,St.image[et]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+et,At+1,Pt,Tt,Ct,St.image[et])}}}d(_)&&g(e.TEXTURE_CUBE_MAP),st.__version=W.version,_.onUpdate&&_.onUpdate(_)}C.__version=_.version}function gt(C,_,I,F,W,st){let at=a.convert(I.format,I.colorSpace),Y=a.convert(I.type),Q=v(I.internalFormat,at,Y,I.normalized,I.colorSpace),rt=i.get(_),Mt=i.get(I);if(Mt.__renderTarget=_,!rt.__hasExternalTextures){let ut=Math.max(1,_.width>>st),ot=Math.max(1,_.height>>st);W===e.TEXTURE_3D||W===e.TEXTURE_2D_ARRAY?n.texImage3D(W,st,Q,ut,ot,_.depth,0,at,Y,null):n.texImage2D(W,st,Q,ut,ot,0,at,Y,null)}n.bindFramebuffer(e.FRAMEBUFFER,C),ke(_)?o.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,F,W,Mt.__webglTexture,0,Ne(_)):(W===e.TEXTURE_2D||W>=e.TEXTURE_CUBE_MAP_POSITIVE_X&&W<=e.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&e.framebufferTexture2D(e.FRAMEBUFFER,F,W,Mt.__webglTexture,st),n.bindFramebuffer(e.FRAMEBUFFER,null)}function Vt(C,_,I){if(e.bindRenderbuffer(e.RENDERBUFFER,C),_.depthBuffer){let F=_.depthTexture,W=F&&F.isDepthTexture?F.type:null,st=T(_.stencilBuffer,W),at=_.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;ke(_)?o.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,Ne(_),st,_.width,_.height):I?e.renderbufferStorageMultisample(e.RENDERBUFFER,Ne(_),st,_.width,_.height):e.renderbufferStorage(e.RENDERBUFFER,st,_.width,_.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,at,e.RENDERBUFFER,C)}else{let F=_.textures;for(let W=0;W<F.length;W++){let st=F[W],at=a.convert(st.format,st.colorSpace),Y=a.convert(st.type),Q=v(st.internalFormat,at,Y,st.normalized,st.colorSpace);ke(_)?o.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,Ne(_),Q,_.width,_.height):I?e.renderbufferStorageMultisample(e.RENDERBUFFER,Ne(_),Q,_.width,_.height):e.renderbufferStorage(e.RENDERBUFFER,Q,_.width,_.height)}}e.bindRenderbuffer(e.RENDERBUFFER,null)}function Je(C,_,I){let F=_.isWebGLCubeRenderTarget===!0;if(n.bindFramebuffer(e.FRAMEBUFFER,C),!(_.depthTexture&&_.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");let W=i.get(_.depthTexture);if(W.__renderTarget=_,(!W.__webglTexture||_.depthTexture.image.width!==_.width||_.depthTexture.image.height!==_.height)&&(_.depthTexture.image.width=_.width,_.depthTexture.image.height=_.height,_.depthTexture.needsUpdate=!0),F){if(W.__webglInit===void 0&&(W.__webglInit=!0,_.depthTexture.addEventListener("dispose",w)),W.__webglTexture===void 0){W.__webglTexture=e.createTexture(),n.bindTexture(e.TEXTURE_CUBE_MAP,W.__webglTexture),Qt(e.TEXTURE_CUBE_MAP,_.depthTexture);let rt=a.convert(_.depthTexture.format),Mt=a.convert(_.depthTexture.type),ut;_.depthTexture.format===Qi?ut=e.DEPTH_COMPONENT24:_.depthTexture.format===Ma&&(ut=e.DEPTH24_STENCIL8);for(let ot=0;ot<6;ot++)e.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+ot,0,ut,_.width,_.height,0,rt,Mt,null)}}else it(_.depthTexture,0);let st=W.__webglTexture,at=Ne(_),Y=F?e.TEXTURE_CUBE_MAP_POSITIVE_X+I:e.TEXTURE_2D,Q=_.depthTexture.format===Ma?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;if(_.depthTexture.format===Qi)ke(_)?o.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,Q,Y,st,0,at):e.framebufferTexture2D(e.FRAMEBUFFER,Q,Y,st,0);else if(_.depthTexture.format===Ma)ke(_)?o.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,Q,Y,st,0,at):e.framebufferTexture2D(e.FRAMEBUFFER,Q,Y,st,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function kt(C){let _=i.get(C),I=C.isWebGLCubeRenderTarget===!0;if(_.__boundDepthTexture!==C.depthTexture){let F=C.depthTexture;if(_.__depthDisposeCallback&&_.__depthDisposeCallback(),F){let W=()=>{delete _.__boundDepthTexture,delete _.__depthDisposeCallback,F.removeEventListener("dispose",W)};F.addEventListener("dispose",W),_.__depthDisposeCallback=W}_.__boundDepthTexture=F}if(C.depthTexture&&!_.__autoAllocateDepthBuffer)if(I)for(let F=0;F<6;F++)Je(_.__webglFramebuffer[F],C,F);else{let F=C.texture.mipmaps;F&&F.length>0?Je(_.__webglFramebuffer[0],C,0):Je(_.__webglFramebuffer,C,0)}else if(I){_.__webglDepthbuffer=[];for(let F=0;F<6;F++)if(n.bindFramebuffer(e.FRAMEBUFFER,_.__webglFramebuffer[F]),_.__webglDepthbuffer[F]===void 0)_.__webglDepthbuffer[F]=e.createRenderbuffer(),Vt(_.__webglDepthbuffer[F],C,!1);else{let W=C.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,st=_.__webglDepthbuffer[F];e.bindRenderbuffer(e.RENDERBUFFER,st),e.framebufferRenderbuffer(e.FRAMEBUFFER,W,e.RENDERBUFFER,st)}}else{let F=C.texture.mipmaps;if(F&&F.length>0?n.bindFramebuffer(e.FRAMEBUFFER,_.__webglFramebuffer[0]):n.bindFramebuffer(e.FRAMEBUFFER,_.__webglFramebuffer),_.__webglDepthbuffer===void 0)_.__webglDepthbuffer=e.createRenderbuffer(),Vt(_.__webglDepthbuffer,C,!1);else{let W=C.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,st=_.__webglDepthbuffer;e.bindRenderbuffer(e.RENDERBUFFER,st),e.framebufferRenderbuffer(e.FRAMEBUFFER,W,e.RENDERBUFFER,st)}}n.bindFramebuffer(e.FRAMEBUFFER,null)}function ee(C,_,I){let F=i.get(C);_!==void 0&&gt(F.__webglFramebuffer,C,C.texture,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,0),I!==void 0&&kt(C)}function ye(C){let _=C.texture,I=i.get(C),F=i.get(_);C.addEventListener("dispose",x);let W=C.textures,st=C.isWebGLCubeRenderTarget===!0,at=W.length>1;if(at||(F.__webglTexture===void 0&&(F.__webglTexture=e.createTexture()),F.__version=_.version,r.memory.textures++),st){I.__webglFramebuffer=[];for(let Y=0;Y<6;Y++)if(_.mipmaps&&_.mipmaps.length>0){I.__webglFramebuffer[Y]=[];for(let Q=0;Q<_.mipmaps.length;Q++)I.__webglFramebuffer[Y][Q]=e.createFramebuffer()}else I.__webglFramebuffer[Y]=e.createFramebuffer()}else{if(_.mipmaps&&_.mipmaps.length>0){I.__webglFramebuffer=[];for(let Y=0;Y<_.mipmaps.length;Y++)I.__webglFramebuffer[Y]=e.createFramebuffer()}else I.__webglFramebuffer=e.createFramebuffer();if(at)for(let Y=0,Q=W.length;Y<Q;Y++){let rt=i.get(W[Y]);rt.__webglTexture===void 0&&(rt.__webglTexture=e.createTexture(),r.memory.textures++)}if(C.samples>0&&ke(C)===!1){I.__webglMultisampledFramebuffer=e.createFramebuffer(),I.__webglColorRenderbuffer=[],n.bindFramebuffer(e.FRAMEBUFFER,I.__webglMultisampledFramebuffer);for(let Y=0;Y<W.length;Y++){let Q=W[Y];I.__webglColorRenderbuffer[Y]=e.createRenderbuffer(),e.bindRenderbuffer(e.RENDERBUFFER,I.__webglColorRenderbuffer[Y]);let rt=a.convert(Q.format,Q.colorSpace),Mt=a.convert(Q.type),ut=v(Q.internalFormat,rt,Mt,Q.normalized,Q.colorSpace,C.isXRRenderTarget===!0),ot=Ne(C);e.renderbufferStorageMultisample(e.RENDERBUFFER,ot,ut,C.width,C.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+Y,e.RENDERBUFFER,I.__webglColorRenderbuffer[Y])}e.bindRenderbuffer(e.RENDERBUFFER,null),C.depthBuffer&&(I.__webglDepthRenderbuffer=e.createRenderbuffer(),Vt(I.__webglDepthRenderbuffer,C,!0)),n.bindFramebuffer(e.FRAMEBUFFER,null)}}if(st){n.bindTexture(e.TEXTURE_CUBE_MAP,F.__webglTexture),Qt(e.TEXTURE_CUBE_MAP,_);for(let Y=0;Y<6;Y++)if(_.mipmaps&&_.mipmaps.length>0)for(let Q=0;Q<_.mipmaps.length;Q++)gt(I.__webglFramebuffer[Y][Q],C,_,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+Y,Q);else gt(I.__webglFramebuffer[Y],C,_,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+Y,0);d(_)&&g(e.TEXTURE_CUBE_MAP),n.unbindTexture()}else if(at){for(let Y=0,Q=W.length;Y<Q;Y++){let rt=W[Y],Mt=i.get(rt),ut=e.TEXTURE_2D;(C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(ut=C.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(ut,Mt.__webglTexture),Qt(ut,rt),gt(I.__webglFramebuffer,C,rt,e.COLOR_ATTACHMENT0+Y,ut,0),d(rt)&&g(ut)}n.unbindTexture()}else{let Y=e.TEXTURE_2D;if((C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(Y=C.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(Y,F.__webglTexture),Qt(Y,_),_.mipmaps&&_.mipmaps.length>0)for(let Q=0;Q<_.mipmaps.length;Q++)gt(I.__webglFramebuffer[Q],C,_,e.COLOR_ATTACHMENT0,Y,Q);else gt(I.__webglFramebuffer,C,_,e.COLOR_ATTACHMENT0,Y,0);d(_)&&g(Y),n.unbindTexture()}C.depthBuffer&&kt(C)}function qt(C){let _=C.textures;for(let I=0,F=_.length;I<F;I++){let W=_[I];if(d(W)){let st=M(C),at=i.get(W).__webglTexture;n.bindTexture(st,at),g(st),n.unbindTexture()}}}let Ce=[],nn=[];function Rn(C){if(C.samples>0){if(ke(C)===!1){let _=C.textures,I=C.width,F=C.height,W=e.COLOR_BUFFER_BIT,st=C.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,at=i.get(C),Y=_.length>1;if(Y)for(let rt=0;rt<_.length;rt++)n.bindFramebuffer(e.FRAMEBUFFER,at.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+rt,e.RENDERBUFFER,null),n.bindFramebuffer(e.FRAMEBUFFER,at.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+rt,e.TEXTURE_2D,null,0);n.bindFramebuffer(e.READ_FRAMEBUFFER,at.__webglMultisampledFramebuffer);let Q=C.texture.mipmaps;Q&&Q.length>0?n.bindFramebuffer(e.DRAW_FRAMEBUFFER,at.__webglFramebuffer[0]):n.bindFramebuffer(e.DRAW_FRAMEBUFFER,at.__webglFramebuffer);for(let rt=0;rt<_.length;rt++){if(C.resolveDepthBuffer&&(C.depthBuffer&&(W|=e.DEPTH_BUFFER_BIT),C.stencilBuffer&&C.resolveStencilBuffer&&(W|=e.STENCIL_BUFFER_BIT)),Y){e.framebufferRenderbuffer(e.READ_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.RENDERBUFFER,at.__webglColorRenderbuffer[rt]);let Mt=i.get(_[rt]).__webglTexture;e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,Mt,0)}e.blitFramebuffer(0,0,I,F,0,0,I,F,W,e.NEAREST),l===!0&&(Ce.length=0,nn.length=0,Ce.push(e.COLOR_ATTACHMENT0+rt),C.depthBuffer&&C.storeMultisampledDepthBuffer===!1&&(Ce.push(st),nn.push(st),e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,nn)),e.invalidateFramebuffer(e.READ_FRAMEBUFFER,Ce))}if(n.bindFramebuffer(e.READ_FRAMEBUFFER,null),n.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),Y)for(let rt=0;rt<_.length;rt++){n.bindFramebuffer(e.FRAMEBUFFER,at.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+rt,e.RENDERBUFFER,at.__webglColorRenderbuffer[rt]);let Mt=i.get(_[rt]).__webglTexture;n.bindFramebuffer(e.FRAMEBUFFER,at.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+rt,e.TEXTURE_2D,Mt,0)}n.bindFramebuffer(e.DRAW_FRAMEBUFFER,at.__webglMultisampledFramebuffer)}else if(C.depthBuffer&&C.storeMultisampledDepthBuffer===!1&&l){let _=C.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,[_])}}}function Ne(C){return Math.min(s.maxSamples,C.samples)}function ke(C){let _=i.get(C);return C.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&_.__useRenderToTexture!==!1}function N(C){let _=r.render.frame;u.get(C)!==_&&(u.set(C,_),C.update())}function mn(C,_){let I=C.colorSpace,F=C.format,W=C.type;return C.isCompressedTexture===!0||C.isVideoTexture===!0||I!==Il&&I!==Rs&&(Zt.getTransfer(I)===oe?(F!==xi||W!==ni)&&Rt("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Ut("WebGLTextures: Unsupported texture color space:",I)),_}function le(C){return typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement?(c.width=C.naturalWidth||C.width,c.height=C.naturalHeight||C.height):typeof VideoFrame<"u"&&C instanceof VideoFrame?(c.width=C.displayWidth,c.height=C.displayHeight):(c.width=C.width,c.height=C.height),c}this.allocateTextureUnit=J,this.resetTextureUnits=G,this.getTextureUnits=L,this.setTextureUnits=H,this.setTexture2D=it,this.setTexture2DArray=X,this.setTexture3D=tt,this.setTextureCube=nt,this.rebindTextures=ee,this.setupRenderTarget=ye,this.updateRenderTargetMipmap=qt,this.updateMultisampleRenderTarget=Rn,this.setupDepthRenderbuffer=kt,this.setupFrameBufferTexture=gt,this.useMultisampledRTT=ke,this.isReversedDepthBuffer=function(){return n.buffers.depth.getReversed()}}function y2(e,t){function n(i,s=Rs){let a,r=Zt.getTransfer(s);if(i===ni)return e.UNSIGNED_BYTE;if(i===Jh)return e.UNSIGNED_SHORT_4_4_4_4;if(i===Kh)return e.UNSIGNED_SHORT_5_5_5_1;if(i===bg)return e.UNSIGNED_INT_5_9_9_9_REV;if(i===Mg)return e.UNSIGNED_INT_10F_11F_11F_REV;if(i===xg)return e.BYTE;if(i===Sg)return e.SHORT;if(i===bo)return e.UNSIGNED_SHORT;if(i===Zh)return e.INT;if(i===Oi)return e.UNSIGNED_INT;if(i===Ii)return e.FLOAT;if(i===Pi)return e.HALF_FLOAT;if(i===Tg)return e.ALPHA;if(i===Eg)return e.RGB;if(i===xi)return e.RGBA;if(i===Qi)return e.DEPTH_COMPONENT;if(i===Ma)return e.DEPTH_STENCIL;if(i===Ag)return e.RED;if(i===Qh)return e.RED_INTEGER;if(i===Ta)return e.RG;if(i===jh)return e.RG_INTEGER;if(i===$h)return e.RGBA_INTEGER;if(i===$l||i===tc||i===ec||i===nc)if(r===oe)if(a=t.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(i===$l)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===tc)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===ec)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===nc)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=t.get("WEBGL_compressed_texture_s3tc"),a!==null){if(i===$l)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===tc)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===ec)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===nc)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===tf||i===ef||i===nf||i===sf)if(a=t.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(i===tf)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===ef)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===nf)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===sf)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===af||i===rf||i===of||i===lf||i===cf||i===ic||i===uf)if(a=t.get("WEBGL_compressed_texture_etc"),a!==null){if(i===af||i===rf)return r===oe?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(i===of)return r===oe?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC;if(i===lf)return a.COMPRESSED_R11_EAC;if(i===cf)return a.COMPRESSED_SIGNED_R11_EAC;if(i===ic)return a.COMPRESSED_RG11_EAC;if(i===uf)return a.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===hf||i===ff||i===df||i===pf||i===mf||i===gf||i===yf||i===_f||i===vf||i===xf||i===Sf||i===bf||i===Mf||i===Tf)if(a=t.get("WEBGL_compressed_texture_astc"),a!==null){if(i===hf)return r===oe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===ff)return r===oe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===df)return r===oe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===pf)return r===oe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===mf)return r===oe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===gf)return r===oe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===yf)return r===oe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===_f)return r===oe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===vf)return r===oe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===xf)return r===oe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Sf)return r===oe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===bf)return r===oe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Mf)return r===oe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Tf)return r===oe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Ef||i===Af||i===wf)if(a=t.get("EXT_texture_compression_bptc"),a!==null){if(i===Ef)return r===oe?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Af)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===wf)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Cf||i===Rf||i===sc||i===Df)if(a=t.get("EXT_texture_compression_rgtc"),a!==null){if(i===Cf)return a.COMPRESSED_RED_RGTC1_EXT;if(i===Rf)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===sc)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Df)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Mo?e.UNSIGNED_INT_24_8:e[i]!==void 0?e[i]:null}return{convert:n}}var _2=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,v2=`
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

}`,Yg=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,n){if(this.texture===null){let i=new ql(t.texture);(t.depthNear!==n.depthNear||t.depthFar!==n.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=i}}getMesh(t){if(this.texture!==null&&this.mesh===null){let n=t.cameras[0].viewport,i=new ti({vertexShader:_2,fragmentShader:v2,uniforms:{depthColor:{value:this.texture},depthWidth:{value:n.z},depthHeight:{value:n.w}}});this.mesh=new $e(new ga(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Zg=class extends ji{constructor(t,n){super();let i=this,s=null,a=1,r=null,o="local-floor",l=1,c=null,u=null,p=null,h=null,f=null,m=null,b=typeof XRWebGLBinding<"u",y=new Yg,d={},g=n.getContextAttributes(),M=null,v=null,T=[],E=[],w=new $t,x=null,A=null,R=new zn;R.viewport=new Le;let O=new zn;O.viewport=new Le;let z=[R,O],G=new Wh,L=null,H=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(q){let $=T[q];return $===void 0&&($=new yo,T[q]=$),$.getTargetRaySpace()},this.getControllerGrip=function(q){let $=T[q];return $===void 0&&($=new yo,T[q]=$),$.getGripSpace()},this.getHand=function(q){let $=T[q];return $===void 0&&($=new yo,T[q]=$),$.getHandSpace()};function J(q){let $=E.indexOf(q.inputSource);if($===-1)return;let _t=T[$];_t!==void 0&&(_t.update(q.inputSource,q.frame,c||r),_t.dispatchEvent({type:q.type,data:q.inputSource}))}function Z(){s.removeEventListener("select",J),s.removeEventListener("selectstart",J),s.removeEventListener("selectend",J),s.removeEventListener("squeeze",J),s.removeEventListener("squeezestart",J),s.removeEventListener("squeezeend",J),s.removeEventListener("end",Z),s.removeEventListener("inputsourceschange",it);for(let q=0;q<T.length;q++){let $=E[q];$!==null&&(E[q]=null,T[q].disconnect($))}L=null,H=null,y.reset();for(let q in d)delete d[q];if(t.setRenderTarget(M),f=null,h=null,p=null,s=null,v=null,ne.stop(),i.isPresenting=!1,t.setPixelRatio(x),t.setSize(w.width,w.height,!1),A!==null){let q=A.camera;q.fov=A.fov,q.zoom=A.zoom,q.updateProjectionMatrix(),A=null}i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(q){a=q,i.isPresenting===!0&&Rt("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(q){o=q,i.isPresenting===!0&&Rt("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||r},this.setReferenceSpace=function(q){c=q},this.getBaseLayer=function(){return h!==null?h:f},this.getBinding=function(){return p===null&&b&&(p=new XRWebGLBinding(s,n)),p},this.getFrame=function(){return m},this.getSession=function(){return s},this.setSession=async function(q){if(s=q,s!==null){if(M=t.getRenderTarget(),s.addEventListener("select",J),s.addEventListener("selectstart",J),s.addEventListener("selectend",J),s.addEventListener("squeeze",J),s.addEventListener("squeezestart",J),s.addEventListener("squeezeend",J),s.addEventListener("end",Z),s.addEventListener("inputsourceschange",it),g.xrCompatible!==!0&&await n.makeXRCompatible(),x=t.getPixelRatio(),t.getSize(w),b&&"createProjectionLayer"in XRWebGLBinding.prototype){let _t=null,Ot=null,gt=null;g.depth&&(gt=g.stencil?n.DEPTH24_STENCIL8:n.DEPTH_COMPONENT24,_t=g.stencil?Ma:Qi,Ot=g.stencil?Mo:Oi);let Vt={colorFormat:n.RGBA8,depthFormat:gt,scaleFactor:a};p=this.getBinding(),h=p.createProjectionLayer(Vt),s.updateRenderState({layers:[h]}),t.setPixelRatio(1),t.setSize(h.textureWidth,h.textureHeight,!1),v=new Fn(h.textureWidth,h.textureHeight,{format:xi,type:ni,depthTexture:new ma(h.textureWidth,h.textureHeight,Ot,void 0,void 0,void 0,void 0,void 0,void 0,_t),stencilBuffer:g.stencil,colorSpace:t.outputColorSpace,samples:g.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1,resolveStencilBuffer:h.ignoreDepthValues===!1,storeMultisampledDepthBuffer:h.ignoreDepthValues===!1,storeMultisampledStencilBuffer:h.ignoreDepthValues===!1})}else{let _t={antialias:g.antialias,alpha:!0,depth:g.depth,stencil:g.stencil,framebufferScaleFactor:a};f=new XRWebGLLayer(s,n,_t),s.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),v=new Fn(f.framebufferWidth,f.framebufferHeight,{format:xi,type:ni,colorSpace:t.outputColorSpace,stencilBuffer:g.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}v.isXRRenderTarget=!0,this.setFoveation(l),c=null,r=await s.requestReferenceSpace(o),ne.setContext(s),ne.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return y.getDepthTexture()};function it(q){for(let $=0;$<q.removed.length;$++){let _t=q.removed[$],Ot=E.indexOf(_t);Ot>=0&&(E[Ot]=null,T[Ot].disconnect(_t))}for(let $=0;$<q.added.length;$++){let _t=q.added[$],Ot=E.indexOf(_t);if(Ot===-1){for(let Vt=0;Vt<T.length;Vt++)if(Vt>=E.length){E.push(_t),Ot=Vt;break}else if(E[Vt]===null){E[Vt]=_t,Ot=Vt;break}if(Ot===-1)break}let gt=T[Ot];gt&&gt.connect(_t)}}let X=new V,tt=new V;function nt(q,$,_t){X.setFromMatrixPosition($.matrixWorld),tt.setFromMatrixPosition(_t.matrixWorld);let Ot=X.distanceTo(tt),gt=$.projectionMatrix.elements,Vt=_t.projectionMatrix.elements,Je=gt[14]/(gt[10]-1),kt=gt[14]/(gt[10]+1),ee=(gt[9]+1)/gt[5],ye=(gt[9]-1)/gt[5],qt=(gt[8]-1)/gt[0],Ce=(Vt[8]+1)/Vt[0],nn=Je*qt,Rn=Je*Ce,Ne=Ot/(-qt+Ce),ke=Ne*-qt;if($.matrixWorld.decompose(q.position,q.quaternion,q.scale),q.translateX(ke),q.translateZ(Ne),q.matrixWorld.compose(q.position,q.quaternion,q.scale),q.matrixWorldInverse.copy(q.matrixWorld).invert(),gt[10]===-1)q.projectionMatrix.copy($.projectionMatrix),q.projectionMatrixInverse.copy($.projectionMatrixInverse);else{let N=Je+Ne,mn=kt+Ne,le=nn-ke,C=Rn+(Ot-ke),_=ee*kt/mn*N,I=ye*kt/mn*N;q.projectionMatrix.makePerspective(le,C,_,I,N,mn),q.projectionMatrixInverse.copy(q.projectionMatrix).invert()}}function wt(q,$){$===null?q.matrixWorld.copy(q.matrix):q.matrixWorld.multiplyMatrices($.matrixWorld,q.matrix),q.matrixWorldInverse.copy(q.matrixWorld).invert()}this.updateCamera=function(q){if(s===null)return;let $=q.near,_t=q.far;y.texture!==null&&(y.depthNear>0&&($=y.depthNear),y.depthFar>0&&(_t=y.depthFar)),G.near=O.near=R.near=$,G.far=O.far=R.far=_t,(L!==G.near||H!==G.far)&&(s.updateRenderState({depthNear:G.near,depthFar:G.far}),L=G.near,H=G.far),G.layers.mask=q.layers.mask|6,R.layers.mask=G.layers.mask&-5,O.layers.mask=G.layers.mask&-3;let Ot=q.parent,gt=G.cameras;wt(G,Ot);for(let Vt=0;Vt<gt.length;Vt++)wt(gt[Vt],Ot);gt.length===2?nt(G,R,O):G.projectionMatrix.copy(R.projectionMatrix),A===null&&q.isPerspectiveCamera&&(A={camera:q,fov:q.fov,zoom:q.zoom}),Et(q,G,Ot)};function Et(q,$,_t){_t===null?q.matrix.copy($.matrixWorld):(q.matrix.copy(_t.matrixWorld),q.matrix.invert(),q.matrix.multiply($.matrixWorld)),q.matrix.decompose(q.position,q.quaternion,q.scale),q.updateMatrixWorld(!0),q.projectionMatrix.copy($.projectionMatrix),q.projectionMatrixInverse.copy($.projectionMatrixInverse),q.isPerspectiveCamera&&(q.fov=Mh*2*Math.atan(1/q.projectionMatrix.elements[5]),q.zoom=1)}this.getCamera=function(){return G},this.getFoveation=function(){if(!(h===null&&f===null))return l},this.setFoveation=function(q){l=q,h!==null&&(h.fixedFoveation=q),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=q)},this.hasDepthSensing=function(){return y.texture!==null},this.getDepthSensingMesh=function(){return y.getMesh(G)},this.getCameraTexture=function(q){return d[q]};let ge=null;function Qt(q,$){if(u=$.getViewerPose(c||r),m=$,u!==null){let _t=u.views;f!==null&&(t.setRenderTargetFramebuffer(v,f.framebuffer),t.setRenderTarget(v));let Ot=!1;_t.length!==G.cameras.length&&(G.cameras.length=0,Ot=!0);for(let kt=0;kt<_t.length;kt++){let ee=_t[kt],ye=null;if(f!==null)ye=f.getViewport(ee);else{let Ce=p.getViewSubImage(h,ee);ye=Ce.viewport,kt===0&&(t.setRenderTargetTextures(v,Ce.colorTexture,Ce.depthStencilTexture),t.setRenderTarget(v))}let qt=z[kt];qt===void 0&&(qt=new zn,qt.layers.enable(kt),qt.viewport=new Le,z[kt]=qt),qt.matrix.fromArray(ee.transform.matrix),qt.matrix.decompose(qt.position,qt.quaternion,qt.scale),qt.projectionMatrix.fromArray(ee.projectionMatrix),qt.projectionMatrixInverse.copy(qt.projectionMatrix).invert(),qt.viewport.set(ye.x,ye.y,ye.width,ye.height),kt===0&&(G.matrix.copy(qt.matrix),G.matrix.decompose(G.position,G.quaternion,G.scale)),Ot===!0&&G.cameras.push(qt)}let gt=s.enabledFeatures;if(gt&&gt.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&b){p=i.getBinding();let kt=p.getDepthInformation(_t[0]);kt&&kt.isValid&&kt.texture&&y.init(kt,s.renderState)}if(gt&&gt.includes("camera-access")&&b){t.state.unbindTexture(),p=i.getBinding();for(let kt=0;kt<_t.length;kt++){let ee=_t[kt].camera;if(ee){let ye=d[ee];ye||(ye=new ql,d[ee]=ye);let qt=p.getCameraImage(ee);ye.sourceTexture=qt}}}}for(let _t=0;_t<T.length;_t++){let Ot=E[_t],gt=T[_t];Ot!==null&&gt!==void 0&&gt.update(Ot,$,c||r)}ge&&ge(q,$),$.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:$}),m=null}let ne=new Lb;ne.setAnimationLoop(Qt),this.setAnimationLoop=function(q){ge=q},this.dispose=function(){}}},x2=new Ve,Fb=new Nt;Fb.set(-1,0,0,0,1,0,0,0,1);function S2(e,t){function n(y,d){y.matrixAutoUpdate===!0&&y.updateMatrix(),d.value.copy(y.matrix)}function i(y,d){d.color.getRGB(y.fogColor.value,Dg(e)),d.isFog?(y.fogNear.value=d.near,y.fogFar.value=d.far):d.isFogExp2&&(y.fogDensity.value=d.density)}function s(y,d,g,M,v){d.isNodeMaterial?d.uniformsNeedUpdate=!1:d.isMeshBasicMaterial?a(y,d):d.isMeshLambertMaterial?(a(y,d),d.envMap&&(y.envMapIntensity.value=d.envMapIntensity)):d.isMeshToonMaterial?(a(y,d),p(y,d)):d.isMeshPhongMaterial?(a(y,d),u(y,d),d.envMap&&(y.envMapIntensity.value=d.envMapIntensity)):d.isMeshStandardMaterial?(a(y,d),h(y,d),d.isMeshPhysicalMaterial&&f(y,d,v)):d.isMeshMatcapMaterial?(a(y,d),m(y,d)):d.isMeshDepthMaterial?a(y,d):d.isMeshDistanceMaterial?(a(y,d),b(y,d)):d.isMeshNormalMaterial?a(y,d):d.isLineBasicMaterial?(r(y,d),d.isLineDashedMaterial&&o(y,d)):d.isPointsMaterial?l(y,d,g,M):d.isSpriteMaterial?c(y,d):d.isShadowMaterial?(y.color.value.copy(d.color),y.opacity.value=d.opacity):d.isShaderMaterial&&(d.uniformsNeedUpdate=!1)}function a(y,d){y.opacity.value=d.opacity,d.color&&y.diffuse.value.copy(d.color),d.emissive&&y.emissive.value.copy(d.emissive).multiplyScalar(d.emissiveIntensity),d.map&&(y.map.value=d.map,n(d.map,y.mapTransform)),d.alphaMap&&(y.alphaMap.value=d.alphaMap,n(d.alphaMap,y.alphaMapTransform)),d.bumpMap&&(y.bumpMap.value=d.bumpMap,n(d.bumpMap,y.bumpMapTransform),y.bumpScale.value=d.bumpScale,d.side===wn&&(y.bumpScale.value*=-1)),d.normalMap&&(y.normalMap.value=d.normalMap,n(d.normalMap,y.normalMapTransform),y.normalScale.value.copy(d.normalScale),d.side===wn&&y.normalScale.value.negate()),d.displacementMap&&(y.displacementMap.value=d.displacementMap,n(d.displacementMap,y.displacementMapTransform),y.displacementScale.value=d.displacementScale,y.displacementBias.value=d.displacementBias),d.emissiveMap&&(y.emissiveMap.value=d.emissiveMap,n(d.emissiveMap,y.emissiveMapTransform)),d.specularMap&&(y.specularMap.value=d.specularMap,n(d.specularMap,y.specularMapTransform)),d.alphaTest>0&&(y.alphaTest.value=d.alphaTest);let g=t.get(d),M=g.envMap,v=g.envMapRotation;M&&(y.envMap.value=M,y.envMapRotation.value.setFromMatrix4(x2.makeRotationFromEuler(v)).transpose(),M.isCubeTexture&&M.isRenderTargetTexture===!1&&y.envMapRotation.value.premultiply(Fb),y.reflectivity.value=d.reflectivity,y.ior.value=d.ior,y.refractionRatio.value=d.refractionRatio),d.lightMap&&(y.lightMap.value=d.lightMap,y.lightMapIntensity.value=d.lightMapIntensity,n(d.lightMap,y.lightMapTransform)),d.aoMap&&(y.aoMap.value=d.aoMap,y.aoMapIntensity.value=d.aoMapIntensity,n(d.aoMap,y.aoMapTransform))}function r(y,d){y.diffuse.value.copy(d.color),y.opacity.value=d.opacity,d.map&&(y.map.value=d.map,n(d.map,y.mapTransform))}function o(y,d){y.dashSize.value=d.dashSize,y.totalSize.value=d.dashSize+d.gapSize,y.scale.value=d.scale}function l(y,d,g,M){y.diffuse.value.copy(d.color),y.opacity.value=d.opacity,y.size.value=d.size*g,y.scale.value=M*.5,d.map&&(y.map.value=d.map,n(d.map,y.uvTransform)),d.alphaMap&&(y.alphaMap.value=d.alphaMap,n(d.alphaMap,y.alphaMapTransform)),d.alphaTest>0&&(y.alphaTest.value=d.alphaTest)}function c(y,d){y.diffuse.value.copy(d.color),y.opacity.value=d.opacity,y.rotation.value=d.rotation,d.map&&(y.map.value=d.map,n(d.map,y.mapTransform)),d.alphaMap&&(y.alphaMap.value=d.alphaMap,n(d.alphaMap,y.alphaMapTransform)),d.alphaTest>0&&(y.alphaTest.value=d.alphaTest)}function u(y,d){y.specular.value.copy(d.specular),y.shininess.value=Math.max(d.shininess,1e-4)}function p(y,d){d.gradientMap&&(y.gradientMap.value=d.gradientMap)}function h(y,d){y.metalness.value=d.metalness,d.metalnessMap&&(y.metalnessMap.value=d.metalnessMap,n(d.metalnessMap,y.metalnessMapTransform)),y.roughness.value=d.roughness,d.roughnessMap&&(y.roughnessMap.value=d.roughnessMap,n(d.roughnessMap,y.roughnessMapTransform)),d.envMap&&(y.envMapIntensity.value=d.envMapIntensity)}function f(y,d,g){y.ior.value=d.ior,d.sheen>0&&(y.sheenColor.value.copy(d.sheenColor).multiplyScalar(d.sheen),y.sheenRoughness.value=d.sheenRoughness,d.sheenColorMap&&(y.sheenColorMap.value=d.sheenColorMap,n(d.sheenColorMap,y.sheenColorMapTransform)),d.sheenRoughnessMap&&(y.sheenRoughnessMap.value=d.sheenRoughnessMap,n(d.sheenRoughnessMap,y.sheenRoughnessMapTransform))),d.clearcoat>0&&(y.clearcoat.value=d.clearcoat,y.clearcoatRoughness.value=d.clearcoatRoughness,d.clearcoatMap&&(y.clearcoatMap.value=d.clearcoatMap,n(d.clearcoatMap,y.clearcoatMapTransform)),d.clearcoatRoughnessMap&&(y.clearcoatRoughnessMap.value=d.clearcoatRoughnessMap,n(d.clearcoatRoughnessMap,y.clearcoatRoughnessMapTransform)),d.clearcoatNormalMap&&(y.clearcoatNormalMap.value=d.clearcoatNormalMap,n(d.clearcoatNormalMap,y.clearcoatNormalMapTransform),y.clearcoatNormalScale.value.copy(d.clearcoatNormalScale),d.side===wn&&y.clearcoatNormalScale.value.negate())),d.dispersion>0&&(y.dispersion.value=d.dispersion),d.retroreflectivity>0&&(y.retroreflectivity.value=d.retroreflectivity),d.iridescence>0&&(y.iridescence.value=d.iridescence,y.iridescenceIOR.value=d.iridescenceIOR,y.iridescenceThicknessMinimum.value=d.iridescenceThicknessRange[0],y.iridescenceThicknessMaximum.value=d.iridescenceThicknessRange[1],d.iridescenceMap&&(y.iridescenceMap.value=d.iridescenceMap,n(d.iridescenceMap,y.iridescenceMapTransform)),d.iridescenceThicknessMap&&(y.iridescenceThicknessMap.value=d.iridescenceThicknessMap,n(d.iridescenceThicknessMap,y.iridescenceThicknessMapTransform))),d.transmission>0&&(y.transmission.value=d.transmission,y.transmissionSamplerMap.value=g.texture,y.transmissionSamplerSize.value.set(g.width,g.height),d.transmissionMap&&(y.transmissionMap.value=d.transmissionMap,n(d.transmissionMap,y.transmissionMapTransform)),y.thickness.value=d.thickness,d.thicknessMap&&(y.thicknessMap.value=d.thicknessMap,n(d.thicknessMap,y.thicknessMapTransform)),y.attenuationDistance.value=d.attenuationDistance,y.attenuationColor.value.copy(d.attenuationColor)),d.anisotropy>0&&(y.anisotropyVector.value.set(d.anisotropy*Math.cos(d.anisotropyRotation),d.anisotropy*Math.sin(d.anisotropyRotation)),d.anisotropyMap&&(y.anisotropyMap.value=d.anisotropyMap,n(d.anisotropyMap,y.anisotropyMapTransform))),y.specularIntensity.value=d.specularIntensity,y.specularColor.value.copy(d.specularColor),d.specularColorMap&&(y.specularColorMap.value=d.specularColorMap,n(d.specularColorMap,y.specularColorMapTransform)),d.specularIntensityMap&&(y.specularIntensityMap.value=d.specularIntensityMap,n(d.specularIntensityMap,y.specularIntensityMapTransform))}function m(y,d){d.matcap&&(y.matcap.value=d.matcap)}function b(y,d){let g=t.get(d).light;y.referencePosition.value.setFromMatrixPosition(g.matrixWorld),y.nearDistance.value=g.shadow.camera.near,y.farDistance.value=g.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function b2(e,t,n,i){let s={},a={},r=[],o=e.getParameter(e.MAX_UNIFORM_BUFFER_BINDINGS);function l(v,T){let E=T.program;i.uniformBlockBinding(v,E)}function c(v,T){let E=s[v.id];E===void 0&&(y(v),E=u(v),s[v.id]=E,v.addEventListener("dispose",g));let w=T.program;i.updateUBOMapping(v,w);let x=t.render.frame;a[v.id]!==x&&(h(v),a[v.id]=x)}function u(v){let T=p();v.__bindingPointIndex=T;let E=e.createBuffer(),w=v.__size,x=v.usage;return e.bindBuffer(e.UNIFORM_BUFFER,E),e.bufferData(e.UNIFORM_BUFFER,w,x),e.bindBuffer(e.UNIFORM_BUFFER,null),e.bindBufferBase(e.UNIFORM_BUFFER,T,E),E}function p(){for(let v=0;v<o;v++)if(r.indexOf(v)===-1)return r.push(v),v;return Ut("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function h(v){let T=s[v.id],E=v.uniforms,w=v.__cache;e.bindBuffer(e.UNIFORM_BUFFER,T);for(let x=0,A=E.length;x<A;x++){let R=E[x];if(Array.isArray(R))for(let O=0,z=R.length;O<z;O++)f(R[O],x,O,w);else f(R,x,0,w)}e.bindBuffer(e.UNIFORM_BUFFER,null)}function f(v,T,E,w){if(b(v,T,E,w)===!0){let x=v.__offset,A=v.value;if(Array.isArray(A)){let R=0;for(let O=0;O<A.length;O++){let z=A[O],G=d(z);m(z,v.__data,R),typeof z!="number"&&typeof z!="boolean"&&!z.isMatrix3&&!ArrayBuffer.isView(z)&&(R+=G.storage/Float32Array.BYTES_PER_ELEMENT)}}else m(A,v.__data,0);e.bufferSubData(e.UNIFORM_BUFFER,x,v.__data)}}function m(v,T,E){typeof v=="number"||typeof v=="boolean"?T[0]=v:v.isMatrix3?(T[0]=v.elements[0],T[1]=v.elements[1],T[2]=v.elements[2],T[3]=0,T[4]=v.elements[3],T[5]=v.elements[4],T[6]=v.elements[5],T[7]=0,T[8]=v.elements[6],T[9]=v.elements[7],T[10]=v.elements[8],T[11]=0):ArrayBuffer.isView(v)?T.set(new v.constructor(v.buffer,v.byteOffset,T.length)):v.toArray(T,E)}function b(v,T,E,w){let x=v.value,A=T+"_"+E;if(w[A]===void 0)return typeof x=="number"||typeof x=="boolean"?w[A]=x:ArrayBuffer.isView(x)?w[A]=x.slice():w[A]=x.clone(),!0;{let R=w[A];if(typeof x=="number"||typeof x=="boolean"){if(R!==x)return w[A]=x,!0}else{if(ArrayBuffer.isView(x))return!0;if(R.equals(x)===!1)return R.copy(x),!0}}return!1}function y(v){let T=v.uniforms,E=0,w=16;for(let A=0,R=T.length;A<R;A++){let O=Array.isArray(T[A])?T[A]:[T[A]];for(let z=0,G=O.length;z<G;z++){let L=O[z],H=Array.isArray(L.value)?L.value:[L.value];for(let J=0,Z=H.length;J<Z;J++){let it=H[J],X=d(it),tt=E%w,nt=tt%X.boundary,wt=tt+nt;E+=nt,wt!==0&&w-wt<X.storage&&(E+=w-wt),L.__data=new Float32Array(X.storage/Float32Array.BYTES_PER_ELEMENT),L.__offset=E,E+=X.storage}}}let x=E%w;return x>0&&(E+=w-x),v.__size=E,v.__cache={},this}function d(v){let T={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(T.boundary=4,T.storage=4):v.isVector2?(T.boundary=8,T.storage=8):v.isVector3||v.isColor?(T.boundary=16,T.storage=12):v.isVector4?(T.boundary=16,T.storage=16):v.isMatrix3?(T.boundary=48,T.storage=48):v.isMatrix4?(T.boundary=64,T.storage=64):v.isTexture?Rt("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(v)?(T.boundary=16,T.storage=v.byteLength):Rt("WebGLRenderer: Unsupported uniform value type.",v),T}function g(v){let T=v.target;T.removeEventListener("dispose",g);let E=r.indexOf(T.__bindingPointIndex);r.splice(E,1),e.deleteBuffer(s[T.id]),delete s[T.id],delete a[T.id]}function M(){for(let v in s)e.deleteBuffer(s[v]);r=[],s={},a={}}return{bind:l,update:c,dispose:M}}var M2=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),es=null;function T2(){return es===null&&(es=new Ch(M2,16,16,Ta,Pi),es.name="DFG_LUT",es.minFilter=pn,es.magFilter=pn,es.wrapS=Ki,es.wrapT=Ki,es.generateMipmaps=!1,es.needsUpdate=!0),es}var Bf=class{constructor(t={}){let{canvas:n=sb(),context:i=null,depth:s=!0,stencil:a=!1,alpha:r=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:p=!1,reversedDepthBuffer:h=!1,outputBufferType:f=ni}=t;this.isWebGLRenderer=!0;let m;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");m=i.getContextAttributes().alpha}else m=r;let b=f,y=new Set([$h,jh,Qh]),d=new Set([ni,Oi,bo,Mo,Jh,Kh]),g=new Uint32Array(4),M=new Int32Array(4),v=new V,T=null,E=null,w=[],x=[],A=null;this.domElement=n,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Li,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let R=this,O=!1,z=null,G=null,L=null,H=null;this._outputColorSpace=xn;let J=0,Z=0,it=null,X=-1,tt=null,nt=new Le,wt=new Le,Et=null,ge=new te(0),Qt=0,ne=n.width,q=n.height,$=1,_t=null,Ot=null,gt=new Le(0,0,ne,q),Vt=new Le(0,0,ne,q),Je=!1,kt=new Wl,ee=!1,ye=!1,qt=new Ve,Ce=new V,nn=new Le,Rn={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Ne=!1;function ke(){return it===null?$:1}let N=i;function mn(S,D){return n.getContext(S,D)}let le,C,_,I,F,W,st,at,Y,Q,rt,Mt,ut,ot,Tt,Ct,Pt,U,lt,K,ct,pt,et;try{let S={alpha:!0,depth:s,stencil:a,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:p};if("setAttribute"in n&&n.setAttribute("data-engine",`three.js r${"186"}`),n.addEventListener("webglcontextlost",_e,!1),n.addEventListener("webglcontextrestored",ae,!1),n.addEventListener("webglcontextcreationerror",Si,!1),N===null){let D="webgl2";if(N=mn(D,S),N===null)throw mn(D)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}At()}catch(S){throw n.removeEventListener("webglcontextlost",_e,!1),n.removeEventListener("webglcontextrestored",ae,!1),n.removeEventListener("webglcontextcreationerror",Si,!1),Ut("WebGLRenderer: "+S.message),S}function At(){le=new UC(N),le.init(),ct=new y2(N,le),C=new SC(N,le,t,ct),_=new m2(N,le),C.reversedDepthBuffer&&h&&_.buffers.depth.setReversed(!0),G=N.createFramebuffer(),L=N.createFramebuffer(),H=N.createFramebuffer(),I=new OC(N),F=new e2,W=new g2(N,le,_,F,C,ct,I),st=new DC(R),at=new PE(N),pt=new vC(N,at),Y=new NC(N,at,I,pt),Q=new PC(N,Y,at,pt,I),U=new IC(N,C,W),Tt=new bC(F),rt=new t2(R,st,le,C,pt,Tt),Mt=new S2(R,F),ut=new i2,ot=new c2(le),Pt=new _C(R,st,_,Q,m,l),Ct=new p2(R,Q,C),et=new b2(N,I,C,_),lt=new xC(N,le,I),K=new LC(N,le,I),I.programs=rt.programs,R.capabilities=C,R.extensions=le,R.properties=F,R.renderLists=ut,R.shadowMap=Ct,R.state=_,R.info=I}b!==ni&&(A=new zC(b,n.width,n.height,o,s,a));let St=new Zg(R,N);this.xr=St,this.getContext=function(){return N},this.getContextAttributes=function(){return N.getContextAttributes()},this.forceContextLoss=function(){let S=le.get("WEBGL_lose_context");S&&S.loseContext()},this.forceContextRestore=function(){let S=le.get("WEBGL_lose_context");S&&S.restoreContext()},this.getPixelRatio=function(){return $},this.setPixelRatio=function(S){S!==void 0&&($=S,this.setSize(ne,q,!1))},this.getSize=function(S){return S.set(ne,q)},this.setSize=function(S,D,k=!0){if(St.isPresenting){Rt("WebGLRenderer: Can't change size while VR device is presenting.");return}ne=S,q=D,n.width=Math.floor(S*$),n.height=Math.floor(D*$),k===!0&&(n.style.width=S+"px",n.style.height=D+"px"),A!==null&&A.setSize(n.width,n.height),this.setViewport(0,0,S,D)},this.getDrawingBufferSize=function(S){return S.set(ne*$,q*$).floor()},this.setDrawingBufferSize=function(S,D,k){ne=S,q=D,$=k,n.width=Math.floor(S*k),n.height=Math.floor(D*k),this.setViewport(0,0,S,D)},this.setEffects=function(S){if(b===ni){Ut("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(S){for(let D=0;D<S.length;D++)if(S[D].isOutputPass===!0){Rt("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}A.setEffects(S||[])},this.getCurrentViewport=function(S){return S.copy(nt)},this.getViewport=function(S){return S.copy(gt)},this.setViewport=function(S,D,k,P){S.isVector4?gt.set(S.x,S.y,S.z,S.w):gt.set(S,D,k,P),_.viewport(nt.copy(gt).multiplyScalar($).round())},this.getScissor=function(S){return S.copy(Vt)},this.setScissor=function(S,D,k,P){S.isVector4?Vt.set(S.x,S.y,S.z,S.w):Vt.set(S,D,k,P),_.scissor(wt.copy(Vt).multiplyScalar($).round())},this.getScissorTest=function(){return Je},this.setScissorTest=function(S){_.setScissorTest(Je=S)},this.setOpaqueSort=function(S){_t=S},this.setTransparentSort=function(S){Ot=S},this.getClearColor=function(S){return S.copy(Pt.getClearColor())},this.setClearColor=function(){Pt.setClearColor(...arguments)},this.getClearAlpha=function(){return Pt.getClearAlpha()},this.setClearAlpha=function(){Pt.setClearAlpha(...arguments)},this.clear=function(S=!0,D=!0,k=!0){let P=0;if(S){let B=!1;if(it!==null){let dt=it.texture.format;B=y.has(dt)}if(B){let dt=it.texture.type,yt=d.has(dt),ft=Pt.getClearColor(),vt=Pt.getClearAlpha(),bt=ft.r,zt=ft.g,Gt=ft.b;yt?(g[0]=bt,g[1]=zt,g[2]=Gt,g[3]=vt,N.clearBufferuiv(N.COLOR,0,g)):(M[0]=bt,M[1]=zt,M[2]=Gt,M[3]=vt,N.clearBufferiv(N.COLOR,0,M))}else P|=N.COLOR_BUFFER_BIT}D&&(P|=N.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),k&&(P|=N.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),P!==0&&N.clear(P)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(S){S.setRenderer(this),z=S},this.dispose=function(){n.removeEventListener("webglcontextlost",_e,!1),n.removeEventListener("webglcontextrestored",ae,!1),n.removeEventListener("webglcontextcreationerror",Si,!1),Pt.dispose(),ut.dispose(),ot.dispose(),F.dispose(),st.dispose(),Q.dispose(),pt.dispose(),et.dispose(),rt.dispose(),St.dispose(),St.removeEventListener("sessionstart",Qg),St.removeEventListener("sessionend",jg),Ea.stop()};function _e(S){S.preventDefault(),Rg("WebGLRenderer: Context Lost."),O=!0}function ae(){Rg("WebGLRenderer: Context Restored."),O=!1;let S=I.autoReset,D=Ct.enabled,k=Ct.autoUpdate,P=Ct.needsUpdate,B=Ct.type;At(),I.autoReset=S,Ct.enabled=D,Ct.autoUpdate=k,Ct.needsUpdate=P,Ct.type=B}function Si(S){Ut("WebGLRenderer: A WebGL context could not be created. Reason: ",S.statusMessage)}function zi(S){let D=S.target;D.removeEventListener("dispose",zi),qb(D)}function qb(S){Yb(S),F.remove(S)}function Yb(S){let D=F.get(S).programs;D!==void 0&&(D.forEach(function(k){rt.releaseProgram(k)}),S.isShaderMaterial&&rt.releaseShaderCache(S))}this.renderBufferDirect=function(S,D,k,P,B,dt){D===null&&(D=Rn);let yt=B.isMesh&&B.matrixWorld.determinantAffine()<0,ft=Kb(S,D,k,P,B);_.setMaterial(P,yt);let vt=k.index,bt=1;if(P.wireframe===!0){if(vt=Y.getWireframeAttribute(k),vt===void 0)return;bt=2}let zt=k.drawRange,Gt=k.attributes.position,xt=zt.start*bt,re=(zt.start+zt.count)*bt;dt!==null&&(xt=Math.max(xt,dt.start*bt),re=Math.min(re,(dt.start+dt.count)*bt)),vt!==null?(xt=Math.max(xt,0),re=Math.min(re,vt.count)):Gt!=null&&(xt=Math.max(xt,0),re=Math.min(re,Gt.count));let Ge=re-xt;if(Ge<0||Ge===1/0)return;pt.setup(B,P,ft,k,vt);let Se,pe=lt;if(vt!==null&&(Se=at.get(vt),pe=K,pe.setIndex(Se)),B.isMesh)P.wireframe===!0?(_.setLineWidth(P.wireframeLinewidth*ke()),pe.setMode(N.LINES)):pe.setMode(N.TRIANGLES);else if(B.isLine){let gn=P.linewidth;gn===void 0&&(gn=1),_.setLineWidth(gn*ke()),B.isLineSegments?pe.setMode(N.LINES):B.isLineLoop?pe.setMode(N.LINE_LOOP):pe.setMode(N.LINE_STRIP)}else B.isPoints?pe.setMode(N.POINTS):B.isSprite&&pe.setMode(N.TRIANGLES);if(B.isBatchedMesh)if(le.get("WEBGL_multi_draw"))pe.renderMultiDraw(B._multiDrawStarts,B._multiDrawCounts,B._multiDrawCount);else{let gn=B._multiDrawStarts,mt=B._multiDrawCounts,Mn=B._multiDrawCount,jt=vt?at.get(vt).bytesPerElement:1,ii=F.get(P).currentProgram.getUniforms();for(let Fi=0;Fi<Mn;Fi++)ii.setValue(N,"_gl_DrawID",Fi),pe.render(gn[Fi]/jt,mt[Fi])}else if(B.isInstancedMesh)pe.renderInstances(xt,Ge,B.count);else if(k.isInstancedBufferGeometry){let gn=k._maxInstanceCount!==void 0?k._maxInstanceCount:1/0,mt=Math.min(k.instanceCount,gn);pe.renderInstances(xt,Ge,mt)}else pe.render(xt,Ge)};function Kg(S,D,k,P){z!==null&&S.isNodeMaterial&&z.setObject(P,S),ee===!0&&Tt.setState(S,k,!1),S.transparent===!0&&S.side===vi&&S.forceSinglePass===!1?(S.side=wn,S.needsUpdate=!0,uc(S,D,P),S.side=xa,S.needsUpdate=!0,uc(S,D,P),S.side=vi):uc(S,D,P)}this.compile=function(S,D,k=null){k===null&&(k=S),z!==null&&z.renderStart(S,D,k),E=ot.get(k),E.init(D),x.push(E),k.traverseVisible(function(B){B.isLight&&B.layers.test(D.layers)&&(E.pushLight(B),B.castShadow&&E.pushShadow(B))}),S!==k&&S.traverseVisible(function(B){B.isLight&&B.layers.test(D.layers)&&(E.pushLight(B),B.castShadow&&E.pushShadow(B))}),E.setupLights(),z!==null&&z.updateLights(E.state.lightsArray),ye=this.localClippingEnabled,ee=Tt.init(this.clippingPlanes,ye),ee===!0&&Tt.setGlobalState(this.clippingPlanes,D),z!==null&&Ct.render(E.state.shadowsArray,k,D);let P=new Set;return S.traverse(function(B){if(!(B.isMesh||B.isPoints||B.isLine||B.isSprite))return;let dt=B.material;if(dt)if(Array.isArray(dt))for(let yt=0;yt<dt.length;yt++){let ft=dt[yt];Kg(ft,k,D,B),P.add(ft)}else Kg(dt,k,D,B),P.add(dt)}),E=x.pop(),z!==null&&z.renderEnd(),P},this.compileAsync=function(S,D,k=null){let P=this.compile(S,D,k);return new Promise(B=>{function dt(){if(P.forEach(function(yt){let vt=F.get(yt).currentProgram;(vt===void 0||vt.isReady())&&P.delete(yt)}),P.size===0){B(S);return}setTimeout(dt,10)}le.get("KHR_parallel_shader_compile")!==null?dt():setTimeout(dt,10)})};let Gf=null;function Zb(S){Gf&&Gf(S)}function Qg(){Ea.stop()}function jg(){Ea.start()}let Ea=new Lb;Ea.setAnimationLoop(Zb),typeof self<"u"&&Ea.setContext(self),this.setAnimationLoop=function(S){Gf=S,St.setAnimationLoop(S),S===null?Ea.stop():Ea.start()},St.addEventListener("sessionstart",Qg),St.addEventListener("sessionend",jg),this.render=function(S,D){if(D!==void 0&&D.isCamera!==!0){Ut("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(O===!0)return;z!==null&&z.renderStart(S,D);let k=St.enabled===!0&&St.isPresenting===!0,P=A!==null&&(it===null||k)&&A.begin(R,it);if(S.matrixWorldAutoUpdate===!0&&S.updateMatrixWorld(),D.parent===null&&D.matrixWorldAutoUpdate===!0&&D.updateMatrixWorld(),St.enabled===!0&&St.isPresenting===!0&&(A===null||A.isCompositing()===!1)&&(St.cameraAutoUpdate===!0&&St.updateCamera(D),D=St.getCamera()),S.isScene===!0&&S.onBeforeRender(R,S,D,it),E=ot.get(S,x.length),E.init(D),E.state.textureUnits=W.getTextureUnits(),x.push(E),qt.multiplyMatrices(D.projectionMatrix,D.matrixWorldInverse),kt.setFromProjectionMatrix(qt,Ni,D.reversedDepth),ye=this.localClippingEnabled,ee=Tt.init(this.clippingPlanes,ye),T=ut.get(S,w.length),T.init(),w.push(T),St.enabled===!0&&St.isPresenting===!0){let yt=R.xr.getDepthSensingMesh();yt!==null&&Wf(yt,D,-1/0,R.sortObjects)}Wf(S,D,0,R.sortObjects),T.finish(),z!==null&&z.updateLights(E.state.lightsArray),R.sortObjects===!0&&T.sort(_t,Ot),Ne=St.enabled===!1||St.isPresenting===!1||St.hasDepthSensing()===!1,Ne&&Pt.addToRenderList(T,S),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),ee===!0&&Tt.beginShadows();let B=E.state.shadowsArray;if(Ct.render(B,S,D),ee===!0&&Tt.endShadows(),(P&&A.hasRenderPass())===!1){let yt=T.opaque,ft=T.transmissive;if(E.setupLights(),D.isArrayCamera){let vt=D.cameras;if(ft.length>0)for(let bt=0,zt=vt.length;bt<zt;bt++){let Gt=vt[bt];t0(yt,ft,S,Gt)}Ne&&Pt.render(S);for(let bt=0,zt=vt.length;bt<zt;bt++){let Gt=vt[bt];$g(T,S,Gt,Gt.viewport)}}else ft.length>0&&t0(yt,ft,S,D),Ne&&Pt.render(S),$g(T,S,D)}it!==null&&Z===0&&(W.updateMultisampleRenderTarget(it),W.updateRenderTargetMipmap(it)),P&&A.end(R),S.isScene===!0&&S.onAfterRender(R,S,D),pt.resetDefaultState(),X=-1,tt=null,x.pop(),x.length>0?(E=x[x.length-1],W.setTextureUnits(E.state.textureUnits),ee===!0&&Tt.setGlobalState(R.clippingPlanes,E.state.camera)):E=null,w.pop(),w.length>0?T=w[w.length-1]:T=null,z!==null&&z.renderEnd()};function Wf(S,D,k,P){if(S.visible===!1)return;if(S.layers.test(D.layers)){if(S.isGroup)k=S.renderOrder;else if(S.isLOD)S.autoUpdate===!0&&S.update(D);else if(S.isLightProbeGrid)E.pushLightProbeGrid(S);else if(S.isLight)E.pushLight(S),S.castShadow&&E.pushShadow(S);else if(S.isSprite){if(!S.frustumCulled||S.intersectsFrustum(kt)){P&&nn.setFromMatrixPosition(S.matrixWorld).applyMatrix4(qt);let yt=Q.update(S),ft=S.material;ft.visible&&T.push(S,yt,ft,k,nn.z,null,D)}}else if((S.isMesh||S.isLine||S.isPoints)&&(!S.frustumCulled||S.intersectsFrustum(kt))){let yt=Q.update(S),ft=S.material;if(P&&(S.boundingSphere!==void 0?(S.boundingSphere===null&&S.computeBoundingSphere(),nn.copy(S.boundingSphere.center)):(yt.boundingSphere===null&&yt.computeBoundingSphere(),nn.copy(yt.boundingSphere.center)),nn.applyMatrix4(S.matrixWorld).applyMatrix4(qt)),Array.isArray(ft)){let vt=yt.groups;for(let bt=0,zt=vt.length;bt<zt;bt++){let Gt=vt[bt],xt=ft[Gt.materialIndex];xt&&xt.visible&&T.push(S,yt,xt,k,nn.z,Gt,D)}}else ft.visible&&T.push(S,yt,ft,k,nn.z,null,D)}}let dt=S.children;for(let yt=0,ft=dt.length;yt<ft;yt++)Wf(dt[yt],D,k,P)}function $g(S,D,k,P){let{opaque:B,transmissive:dt,transparent:yt}=S;E.setupLightsView(k),ee===!0&&Tt.setGlobalState(R.clippingPlanes,k),P&&_.viewport(nt.copy(P)),B.length>0&&cc(B,D,k),dt.length>0&&cc(dt,D,k),yt.length>0&&cc(yt,D,k),_.buffers.depth.setTest(!0),_.buffers.depth.setMask(!0),_.buffers.color.setMask(!0),_.setPolygonOffset(!1)}function t0(S,D,k,P){if((k.isScene===!0?k.overrideMaterial:null)!==null)return;if(E.state.transmissionRenderTarget[P.id]===void 0){let xt=le.has("EXT_color_buffer_half_float")||le.has("EXT_color_buffer_float");E.state.transmissionRenderTarget[P.id]=new Fn(1,1,{generateMipmaps:!0,type:xt?Pi:ni,minFilter:ba,samples:Math.max(4,C.samples),stencilBuffer:a,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:Zt.workingColorSpace})}let dt=E.state.transmissionRenderTarget[P.id],yt=P.viewport||nt;dt.setSize(yt.z*R.transmissionResolutionScale,yt.w*R.transmissionResolutionScale);let ft=R.getRenderTarget(),vt=R.getActiveCubeFace(),bt=R.getActiveMipmapLevel();R.setRenderTarget(dt),R.getClearColor(ge),Qt=R.getClearAlpha(),Qt<1&&R.setClearColor(16777215,.5),R.clear(),Ne&&Pt.render(k);let zt=R.toneMapping;R.toneMapping=Li;let Gt=P.viewport;if(P.viewport!==void 0&&(P.viewport=void 0),E.setupLightsView(P),ee===!0&&Tt.setGlobalState(R.clippingPlanes,P),cc(S,k,P),W.updateMultisampleRenderTarget(dt),W.updateRenderTargetMipmap(dt),le.has("WEBGL_multisampled_render_to_texture")===!1){let xt=!1;for(let re=0,Ge=D.length;re<Ge;re++){let Se=D[re],{object:pe,geometry:gn,material:mt,group:Mn}=Se;if(mt.side===vi&&pe.layers.test(P.layers)){let jt=mt.side;mt.side=wn,mt.needsUpdate=!0,e0(pe,k,P,gn,mt,Mn),mt.side=jt,mt.needsUpdate=!0,xt=!0}}xt===!0&&(W.updateMultisampleRenderTarget(dt),W.updateRenderTargetMipmap(dt))}R.setRenderTarget(ft,vt,bt),R.setClearColor(ge,Qt),Gt!==void 0&&(P.viewport=Gt),R.toneMapping=zt}function cc(S,D,k){let P=D.isScene===!0?D.overrideMaterial:null;for(let B=0,dt=S.length;B<dt;B++){let yt=S[B],{object:ft,geometry:vt,group:bt}=yt,zt=yt.material;zt.allowOverride===!0&&P!==null&&(zt=P),ft.layers.test(k.layers)&&e0(ft,D,k,vt,zt,bt)}}function e0(S,D,k,P,B,dt){z!==null&&B.isNodeMaterial&&z.setObject(S,B),S.onBeforeRender(R,D,k,P,B,dt),S.modelViewMatrix.multiplyMatrices(k.matrixWorldInverse,S.matrixWorld),S.normalMatrix.getNormalMatrix(S.modelViewMatrix),B.onBeforeRender(R,D,k,P,S,dt),B.transparent===!0&&B.side===vi&&B.forceSinglePass===!1?(B.side=wn,B.needsUpdate=!0,R.renderBufferDirect(k,D,P,B,S,dt),B.side=xa,B.needsUpdate=!0,R.renderBufferDirect(k,D,P,B,S,dt),B.side=vi):R.renderBufferDirect(k,D,P,B,S,dt),S.onAfterRender(R,D,k,P,B,dt)}function uc(S,D,k){D.isScene!==!0&&(D=Rn);let P=F.get(S),B=E.state.lights,dt=E.state.shadowsArray,yt=B.state.version,ft=rt.getParameters(S,B.state,dt,D,k,E.state.lightProbeGridArray),vt=rt.getProgramCacheKey(ft),bt=P.programs;P.environment=S.isMeshStandardMaterial||S.isMeshLambertMaterial||S.isMeshPhongMaterial?D.environment:null,P.fog=D.fog;let zt=S.isMeshStandardMaterial||S.isMeshLambertMaterial&&!S.envMap||S.isMeshPhongMaterial&&!S.envMap;P.envMap=st.get(S.envMap||P.environment,zt),P.envMapRotation=P.environment!==null&&S.envMap===null?D.environmentRotation:S.envMapRotation,bt===void 0&&(S.addEventListener("dispose",zi),bt=new Map,P.programs=bt);let Gt=bt.get(vt);if(Gt!==void 0){if(P.currentProgram===Gt&&P.lightsStateVersion===yt)return i0(S,ft),Gt}else ft.uniforms=rt.getUniforms(S),z!==null&&S.isNodeMaterial&&z.build(S,k,ft),S.onBeforeCompile(ft,R),Gt=rt.acquireProgram(ft,vt),bt.set(vt,Gt),P.uniforms=ft.uniforms;let xt=P.uniforms;return(!S.isShaderMaterial&&!S.isRawShaderMaterial||S.clipping===!0)&&(xt.clippingPlanes=Tt.uniform),i0(S,ft),P.needsLights=jb(S),P.lightsStateVersion=yt,P.needsLights&&(xt.ambientLightColor.value=B.state.ambient,xt.lightProbe.value=B.state.probe,xt.sunLights.value=B.state.sun,xt.sunLightShadows.value=B.state.sunShadow,xt.directionalLights.value=B.state.directional,xt.directionalLightShadows.value=B.state.directionalShadow,xt.spotLights.value=B.state.spot,xt.spotLightShadows.value=B.state.spotShadow,xt.rectAreaLights.value=B.state.rectArea,xt.ltc_1.value=B.state.rectAreaLTC1,xt.ltc_2.value=B.state.rectAreaLTC2,xt.pointLights.value=B.state.point,xt.pointLightShadows.value=B.state.pointShadow,xt.hemisphereLights.value=B.state.hemi,xt.sunShadowMatrix.value=B.state.sunShadowMatrix,xt.sunShadowCascade.value=B.state.sunShadowCascade,xt.directionalShadowMatrix.value=B.state.directionalShadowMatrix,xt.spotLightMatrix.value=B.state.spotLightMatrix,xt.spotLightMap.value=B.state.spotLightMap,xt.pointShadowMatrix.value=B.state.pointShadowMatrix),P.lightProbeGrid=E.state.lightProbeGridArray.length>0,P.currentProgram=Gt,P.uniformsList=null,Gt}function n0(S){if(S.uniformsList===null){let D=S.currentProgram.getUniforms();S.uniformsList=Ao.seqWithValue(D.seq,S.uniforms)}return S.uniformsList}function i0(S,D){let k=F.get(S);k.outputColorSpace=D.outputColorSpace,k.batching=D.batching,k.batchingColor=D.batchingColor,k.instancing=D.instancing,k.instancingColor=D.instancingColor,k.instancingMorph=D.instancingMorph,k.skinning=D.skinning,k.morphTargets=D.morphTargets,k.morphNormals=D.morphNormals,k.morphColors=D.morphColors,k.morphTargetsCount=D.morphTargetsCount,k.numClippingPlanes=D.numClippingPlanes,k.numIntersection=D.numClipIntersection,k.vertexAlphas=D.vertexAlphas,k.vertexTangents=D.vertexTangents,k.toneMapping=D.toneMapping}function Jb(S,D){if(S.length===0)return null;if(S.length===1)return S[0].texture!==null?S[0]:null;v.setFromMatrixPosition(D.matrixWorld);for(let k=0,P=S.length;k<P;k++){let B=S[k];if(B.texture!==null&&B.boundingBox.containsPoint(v))return B}return null}function Kb(S,D,k,P,B){D.isScene!==!0&&(D=Rn),W.resetTextureUnits();let dt=D.fog,yt=P.isMeshStandardMaterial||P.isMeshLambertMaterial||P.isMeshPhongMaterial?D.environment:null,ft=it===null?R.outputColorSpace:it.isXRRenderTarget===!0?it.texture.colorSpace:Zt.workingColorSpace,vt=P.isMeshStandardMaterial||P.isMeshLambertMaterial&&!P.envMap||P.isMeshPhongMaterial&&!P.envMap,bt=st.get(P.envMap||yt,vt),zt=P.vertexColors===!0&&!!k.attributes.color&&k.attributes.color.itemSize===4,Gt=!!k.attributes.tangent&&(!!P.normalMap||P.anisotropy>0),xt=!!k.morphAttributes.position,re=!!k.morphAttributes.normal,Ge=!!k.morphAttributes.color,Se=Li;P.toneMapped&&(it===null||it.isXRRenderTarget===!0)&&(Se=R.toneMapping);let pe=k.morphAttributes.position||k.morphAttributes.normal||k.morphAttributes.color,gn=pe!==void 0?pe.length:0,mt=F.get(P),Mn=E.state.lights;if(ee===!0&&(ye===!0||S!==tt)){let ve=S===tt&&P.id===X;Tt.setState(P,S,ve)}let jt=!1;P.version===mt.__version?(mt.needsLights&&mt.lightsStateVersion!==Mn.state.version||mt.outputColorSpace!==ft||B.isBatchedMesh&&mt.batching===!1||!B.isBatchedMesh&&mt.batching===!0||B.isBatchedMesh&&mt.batchingColor===!0&&B._colorsTexture===null||B.isBatchedMesh&&mt.batchingColor===!1&&B._colorsTexture!==null||B.isInstancedMesh&&mt.instancing===!1||!B.isInstancedMesh&&mt.instancing===!0||B.isSkinnedMesh&&mt.skinning===!1||!B.isSkinnedMesh&&mt.skinning===!0||B.isInstancedMesh&&mt.instancingColor===!0&&B.instanceColor===null||B.isInstancedMesh&&mt.instancingColor===!1&&B.instanceColor!==null||B.isInstancedMesh&&mt.instancingMorph===!0&&B.morphTexture===null||B.isInstancedMesh&&mt.instancingMorph===!1&&B.morphTexture!==null||mt.envMap!==bt||P.fog===!0&&mt.fog!==dt||mt.numClippingPlanes!==void 0&&(mt.numClippingPlanes!==Tt.numPlanes||mt.numIntersection!==Tt.numIntersection)||mt.vertexAlphas!==zt||mt.vertexTangents!==Gt||mt.morphTargets!==xt||mt.morphNormals!==re||mt.morphColors!==Ge||mt.toneMapping!==Se||mt.morphTargetsCount!==gn||!!mt.lightProbeGrid!=E.state.lightProbeGridArray.length>0)&&(jt=!0):(jt=!0,mt.__version=P.version);let ii=mt.currentProgram;jt===!0&&(ii=uc(P,D,B),z&&P.isNodeMaterial&&z.onUpdateProgram(P,ii,mt));let Fi=!1,Ds=!1,sr=!1,he=ii.getUniforms(),Be=mt.uniforms;if(_.useProgram(ii.program)&&(Fi=!0,Ds=!0,sr=!0),P.id!==X&&(X=P.id,Ds=!0),mt.needsLights){let ve=Jb(E.state.lightProbeGridArray,B);mt.lightProbeGrid!==ve&&(mt.lightProbeGrid=ve,Ds=!0)}if(Fi||tt!==S){_.buffers.depth.getReversed()&&S.reversedDepth!==!0&&(S._reversedDepth=!0,S.updateProjectionMatrix()),he.setValue(N,"projectionMatrix",S.projectionMatrix),he.setValue(N,"viewMatrix",S.matrixWorldInverse);let Ns=he.map.cameraPosition;Ns!==void 0&&Ns.setValue(N,Ce.setFromMatrixPosition(S.matrixWorld)),C.logarithmicDepthBuffer&&he.setValue(N,"logDepthBufFC",2/(Math.log(S.far+1)/Math.LN2)),(P.isMeshPhongMaterial||P.isMeshToonMaterial||P.isMeshLambertMaterial||P.isMeshBasicMaterial||P.isMeshStandardMaterial||P.isShaderMaterial)&&he.setValue(N,"isOrthographic",S.isOrthographicCamera===!0),tt!==S&&(tt=S,Ds=!0,sr=!0)}if(mt.needsLights&&(Mn.state.sunShadowMap.length>0&&he.setValue(N,"sunShadowMap",Mn.state.sunShadowMap,W),Mn.state.directionalShadowMap.length>0&&he.setValue(N,"directionalShadowMap",Mn.state.directionalShadowMap,W),Mn.state.spotShadowMap.length>0&&he.setValue(N,"spotShadowMap",Mn.state.spotShadowMap,W),Mn.state.pointShadowMap.length>0&&he.setValue(N,"pointShadowMap",Mn.state.pointShadowMap,W)),B.isSkinnedMesh){he.setOptional(N,B,"bindMatrix"),he.setOptional(N,B,"bindMatrixInverse");let ve=B.skeleton;ve&&(ve.boneTexture===null&&ve.computeBoneTexture(),he.setValue(N,"boneTexture",ve.boneTexture,W))}B.isBatchedMesh&&(he.setOptional(N,B,"batchingTexture"),he.setValue(N,"batchingTexture",B._matricesTexture,W),he.setOptional(N,B,"batchingIdTexture"),he.setValue(N,"batchingIdTexture",B._indirectTexture,W),he.setOptional(N,B,"batchingColorTexture"),B._colorsTexture!==null&&he.setValue(N,"batchingColorTexture",B._colorsTexture,W));let Us=k.morphAttributes;if((Us.position!==void 0||Us.normal!==void 0||Us.color!==void 0)&&U.update(B,k,ii),(Ds||mt.receiveShadow!==B.receiveShadow)&&(mt.receiveShadow=B.receiveShadow,he.setValue(N,"receiveShadow",B.receiveShadow)),(P.isMeshStandardMaterial||P.isMeshLambertMaterial||P.isMeshPhongMaterial)&&P.envMap===null&&D.environment!==null&&(Be.envMapIntensity.value=D.environmentIntensity),Be.dfgLUT!==void 0&&(Be.dfgLUT.value=T2()),Ds){if(he.setValue(N,"toneMappingExposure",R.toneMappingExposure),mt.needsLights&&Qb(Be,sr),dt&&P.fog===!0&&Mt.refreshFogUniforms(Be,dt),Mt.refreshMaterialUniforms(Be,P,$,q,E.state.transmissionRenderTarget[S.id]),mt.needsLights&&mt.lightProbeGrid){let ve=mt.lightProbeGrid;Be.probesSH.value=ve.texture,Be.probesMin.value.copy(ve.boundingBox.min),Be.probesMax.value.copy(ve.boundingBox.max),Be.probesResolution.value.copy(ve.resolution)}Ao.upload(N,n0(mt),Be,W)}if(P.isShaderMaterial&&P.uniformsNeedUpdate===!0&&(Ao.upload(N,n0(mt),Be,W),P.uniformsNeedUpdate=!1),P.isSpriteMaterial&&he.setValue(N,"center",B.center),he.setValue(N,"modelViewMatrix",B.modelViewMatrix),he.setValue(N,"normalMatrix",B.normalMatrix),he.setValue(N,"modelMatrix",B.matrixWorld),P.uniformsGroups!==void 0){let ve=P.uniformsGroups;for(let Ns=0,ar=ve.length;Ns<ar;Ns++){let a0=ve[Ns];et.update(a0,ii),et.bind(a0,ii)}}return ii}function Qb(S,D){S.ambientLightColor.needsUpdate=D,S.lightProbe.needsUpdate=D,S.sunLights.needsUpdate=D,S.sunLightShadows.needsUpdate=D,S.directionalLights.needsUpdate=D,S.directionalLightShadows.needsUpdate=D,S.pointLights.needsUpdate=D,S.pointLightShadows.needsUpdate=D,S.spotLights.needsUpdate=D,S.spotLightShadows.needsUpdate=D,S.rectAreaLights.needsUpdate=D,S.hemisphereLights.needsUpdate=D}function jb(S){return S.isMeshLambertMaterial||S.isMeshToonMaterial||S.isMeshPhongMaterial||S.isMeshStandardMaterial||S.isShadowMaterial||S.isShaderMaterial&&S.lights===!0}this.getActiveCubeFace=function(){return J},this.getActiveMipmapLevel=function(){return Z},this.getRenderTarget=function(){return it},this.setRenderTargetTextures=function(S,D,k){let P=F.get(S);P.__autoAllocateDepthBuffer=S.resolveDepthBuffer===!1,P.__autoAllocateDepthBuffer===!1&&(P.__useRenderToTexture=!1),F.get(S.texture).__webglTexture=D,F.get(S.depthTexture).__webglTexture=P.__autoAllocateDepthBuffer?void 0:k,P.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(S,D){let k=F.get(S);k.__webglFramebuffer=D,k.__useDefaultFramebuffer=D===void 0},this.setRenderTarget=function(S,D=0,k=0){it=S,J=D,Z=k;let P=null,B=!1,dt=!1;if(S){let ft=F.get(S);if(ft.__useDefaultFramebuffer!==void 0){_.bindFramebuffer(N.FRAMEBUFFER,ft.__webglFramebuffer),nt.copy(S.viewport),wt.copy(S.scissor),Et=S.scissorTest,_.viewport(nt),_.scissor(wt),_.setScissorTest(Et),X=-1;return}else if(ft.__webglFramebuffer===void 0)W.setupRenderTarget(S);else if(ft.__hasExternalTextures)W.rebindTextures(S,F.get(S.texture).__webglTexture,F.get(S.depthTexture).__webglTexture);else if(S.depthBuffer){let zt=S.depthTexture;if(ft.__boundDepthTexture!==zt){if(zt!==null&&F.has(zt)&&(S.width!==zt.image.width||S.height!==zt.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");W.setupDepthRenderbuffer(S)}}let vt=S.texture;(vt.isData3DTexture||vt.isDataArrayTexture||vt.isCompressedArrayTexture)&&(dt=!0);let bt=F.get(S).__webglFramebuffer;S.isWebGLCubeRenderTarget?(Array.isArray(bt[D])?P=bt[D][k]:P=bt[D],B=!0):S.samples>0&&W.useMultisampledRTT(S)===!1?P=F.get(S).__webglMultisampledFramebuffer:Array.isArray(bt)?P=bt[k]:P=bt,nt.copy(S.viewport),wt.copy(S.scissor),Et=S.scissorTest}else nt.copy(gt).multiplyScalar($).floor(),wt.copy(Vt).multiplyScalar($).floor(),Et=Je;if(k!==0&&(P=G),_.bindFramebuffer(N.FRAMEBUFFER,P)&&_.drawBuffers(S,P),_.viewport(nt),_.scissor(wt),_.setScissorTest(Et),B){let ft=F.get(S.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_CUBE_MAP_POSITIVE_X+D,ft.__webglTexture,k)}else if(dt){let ft=D;for(let vt=0;vt<S.textures.length;vt++){let bt=F.get(S.textures[vt]);N.framebufferTextureLayer(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0+vt,bt.__webglTexture,k,ft)}}else if(S!==null&&k!==0){let ft=F.get(S.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,ft.__webglTexture,k)}X=-1};function s0(S){let D=F.get(S);return(D.__readFormat!==S.format||D.__readType!==S.type)&&(D.__readFormat=S.format,D.__readType=S.type,D.__formatReadable=C.textureFormatReadable(S.format),D.__typeReadable=C.textureTypeReadable(S.type)),D}this.readRenderTargetPixels=function(S,D,k,P,B,dt,yt,ft=0){if(!(S&&S.isWebGLRenderTarget)){Ut("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let vt=F.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&yt!==void 0&&(vt=vt[yt]),vt){_.bindFramebuffer(N.FRAMEBUFFER,vt);try{let bt=S.textures[ft],zt=bt.format,Gt=bt.type;S.textures.length>1&&N.readBuffer(N.COLOR_ATTACHMENT0+ft);let xt=s0(bt);if(xt.__formatReadable===!1){Ut("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(xt.__typeReadable===!1){Ut("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}D>=0&&D<=S.width-P&&k>=0&&k<=S.height-B&&N.readPixels(D,k,P,B,ct.convert(zt),ct.convert(Gt),dt)}finally{let bt=it!==null?F.get(it).__webglFramebuffer:null;_.bindFramebuffer(N.FRAMEBUFFER,bt)}}},this.readRenderTargetPixelsAsync=async function(S,D,k,P,B,dt,yt,ft=0){if(!(S&&S.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let vt=F.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&yt!==void 0&&(vt=vt[yt]),vt)if(D>=0&&D<=S.width-P&&k>=0&&k<=S.height-B){_.bindFramebuffer(N.FRAMEBUFFER,vt);let bt=S.textures[ft],zt=bt.format,Gt=bt.type;S.textures.length>1&&N.readBuffer(N.COLOR_ATTACHMENT0+ft);let xt=s0(bt);if(xt.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(xt.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let re=N.createBuffer();N.bindBuffer(N.PIXEL_PACK_BUFFER,re),N.bufferData(N.PIXEL_PACK_BUFFER,dt.byteLength,N.STREAM_READ),N.readPixels(D,k,P,B,ct.convert(zt),ct.convert(Gt),0),N.bindBuffer(N.PIXEL_PACK_BUFFER,null);let Ge=it!==null?F.get(it).__webglFramebuffer:null;_.bindFramebuffer(N.FRAMEBUFFER,Ge);let Se=N.fenceSync(N.SYNC_GPU_COMMANDS_COMPLETE,0);return N.flush(),await rb(N,Se,4),N.bindBuffer(N.PIXEL_PACK_BUFFER,re),N.getBufferSubData(N.PIXEL_PACK_BUFFER,0,dt),N.bindBuffer(N.PIXEL_PACK_BUFFER,null),N.deleteBuffer(re),N.deleteSync(Se),dt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(S,D=null,k=0){let P=Math.pow(2,-k),B=Math.floor(S.image.width*P),dt=Math.floor(S.image.height*P),yt=D!==null?D.x:0,ft=D!==null?D.y:0;W.setTexture2D(S,0),N.copyTexSubImage2D(N.TEXTURE_2D,k,0,0,yt,ft,B,dt),_.unbindTexture()},this.copyTextureToTexture=function(S,D,k=null,P=null,B=0,dt=0){let yt,ft,vt,bt,zt,Gt,xt,re,Ge,Se=S.isCompressedTexture?S.mipmaps[dt]:S.image;if(k!==null)yt=k.max.x-k.min.x,ft=k.max.y-k.min.y,vt=k.isBox3?k.max.z-k.min.z:1,bt=k.min.x,zt=k.min.y,Gt=k.isBox3?k.min.z:0;else{let Be=Math.pow(2,-B);yt=Math.floor(Se.width*Be),ft=Math.floor(Se.height*Be),S.isDataArrayTexture?vt=Se.depth:S.isData3DTexture?vt=Math.floor(Se.depth*Be):vt=1,bt=0,zt=0,Gt=0}P!==null?(xt=P.x,re=P.y,Ge=P.z):(xt=0,re=0,Ge=0);let pe=ct.convert(D.format),gn=ct.convert(D.type),mt;D.isData3DTexture?(W.setTexture3D(D,0),mt=N.TEXTURE_3D):D.isDataArrayTexture||D.isCompressedArrayTexture?(W.setTexture2DArray(D,0),mt=N.TEXTURE_2D_ARRAY):(W.setTexture2D(D,0),mt=N.TEXTURE_2D),_.activeTexture(N.TEXTURE0),_.pixelStorei(N.UNPACK_FLIP_Y_WEBGL,D.flipY),_.pixelStorei(N.UNPACK_PREMULTIPLY_ALPHA_WEBGL,D.premultiplyAlpha),_.pixelStorei(N.UNPACK_ALIGNMENT,D.unpackAlignment);let Mn=_.getParameter(N.UNPACK_ROW_LENGTH),jt=_.getParameter(N.UNPACK_IMAGE_HEIGHT),ii=_.getParameter(N.UNPACK_SKIP_PIXELS),Fi=_.getParameter(N.UNPACK_SKIP_ROWS),Ds=_.getParameter(N.UNPACK_SKIP_IMAGES);_.pixelStorei(N.UNPACK_ROW_LENGTH,Se.width),_.pixelStorei(N.UNPACK_IMAGE_HEIGHT,Se.height),_.pixelStorei(N.UNPACK_SKIP_PIXELS,bt),_.pixelStorei(N.UNPACK_SKIP_ROWS,zt),_.pixelStorei(N.UNPACK_SKIP_IMAGES,Gt);let sr=S.isDataArrayTexture||S.isData3DTexture,he=D.isDataArrayTexture||D.isData3DTexture;if(S.isDepthTexture){let Be=F.get(S),Us=F.get(D),ve=F.get(Be.__renderTarget),Ns=F.get(Us.__renderTarget);_.bindFramebuffer(N.READ_FRAMEBUFFER,ve.__webglFramebuffer),_.bindFramebuffer(N.DRAW_FRAMEBUFFER,Ns.__webglFramebuffer);for(let ar=0;ar<vt;ar++)sr&&(N.framebufferTextureLayer(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,F.get(S).__webglTexture,B,Gt+ar),N.framebufferTextureLayer(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,F.get(D).__webglTexture,dt,Ge+ar)),N.blitFramebuffer(bt,zt,yt,ft,xt,re,yt,ft,N.DEPTH_BUFFER_BIT,N.NEAREST);_.bindFramebuffer(N.READ_FRAMEBUFFER,null),_.bindFramebuffer(N.DRAW_FRAMEBUFFER,null)}else if(B!==0||S.isRenderTargetTexture||F.has(S)){let Be=F.get(S),Us=F.get(D);_.bindFramebuffer(N.READ_FRAMEBUFFER,L),_.bindFramebuffer(N.DRAW_FRAMEBUFFER,H);for(let ve=0;ve<vt;ve++)sr?N.framebufferTextureLayer(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,Be.__webglTexture,B,Gt+ve):N.framebufferTexture2D(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,Be.__webglTexture,B),he?N.framebufferTextureLayer(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,Us.__webglTexture,dt,Ge+ve):N.framebufferTexture2D(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,Us.__webglTexture,dt),B!==0?N.blitFramebuffer(bt,zt,yt,ft,xt,re,yt,ft,N.COLOR_BUFFER_BIT,N.NEAREST):he?N.copyTexSubImage3D(mt,dt,xt,re,Ge+ve,bt,zt,yt,ft):N.copyTexSubImage2D(mt,dt,xt,re,bt,zt,yt,ft);_.bindFramebuffer(N.READ_FRAMEBUFFER,null),_.bindFramebuffer(N.DRAW_FRAMEBUFFER,null)}else he?S.isDataTexture||S.isData3DTexture?N.texSubImage3D(mt,dt,xt,re,Ge,yt,ft,vt,pe,gn,Se.data):D.isCompressedArrayTexture?N.compressedTexSubImage3D(mt,dt,xt,re,Ge,yt,ft,vt,pe,Se.data):N.texSubImage3D(mt,dt,xt,re,Ge,yt,ft,vt,pe,gn,Se):S.isDataTexture?N.texSubImage2D(N.TEXTURE_2D,dt,xt,re,yt,ft,pe,gn,Se.data):S.isCompressedTexture?N.compressedTexSubImage2D(N.TEXTURE_2D,dt,xt,re,Se.width,Se.height,pe,Se.data):N.texSubImage2D(N.TEXTURE_2D,dt,xt,re,yt,ft,pe,gn,Se);_.pixelStorei(N.UNPACK_ROW_LENGTH,Mn),_.pixelStorei(N.UNPACK_IMAGE_HEIGHT,jt),_.pixelStorei(N.UNPACK_SKIP_PIXELS,ii),_.pixelStorei(N.UNPACK_SKIP_ROWS,Fi),_.pixelStorei(N.UNPACK_SKIP_IMAGES,Ds),dt===0&&D.generateMipmaps&&N.generateMipmap(mt),_.unbindTexture()},this.initRenderTarget=function(S){F.get(S).__webglFramebuffer===void 0&&W.setupRenderTarget(S)},this.initTexture=function(S){S.isCubeTexture?W.setTextureCube(S,0):S.isData3DTexture?W.setTexture3D(S,0):S.isDataArrayTexture||S.isCompressedArrayTexture?W.setTexture2DArray(S,0):W.setTexture2D(S,0),_.unbindTexture()},this.resetState=function(){J=0,Z=0,it=null,_.reset(),pt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Ni}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;let n=this.getContext();n.drawingBufferColorSpace=Zt._getDrawingBufferColorSpace(t),n.unpackColorSpace=Zt._getUnpackColorSpace()}};var Vf=class{constructor(t,n,i){this.assets=n;this.gl=new Bf({canvas:t,antialias:!1,alpha:!1,preserveDrawingBuffer:!0,powerPreference:"low-power"}),this.gl.setPixelRatio(1),this.gl.setSize(320,224,!1),this.gl.outputColorSpace=xn,this.gl.setClearColor("#0f172b"),this.camera.position.z=100,this.scene.add(this.pitch,this.close,this.ball),this.poses=new Map(n.records.map(s=>[s.id,s])),this.texture=new Sn(i),this.texture.colorSpace=xn,this.texture.minFilter=He,this.texture.magFilter=He,this.texture.generateMipmaps=!1,this.texture.needsUpdate=!0;for(let s=0;s<14;s++)this.rect(this.pitch,s*54,34,54,344,s%2?"#285c36":"#2b6539",-100);this.rect(this.pitch,0,0,726,34,"#162536",-99);for(let s=6;s<30;s+=5)for(let a=2;a<726;a+=7)this.rect(this.pitch,a,s,2,2,(a+s)%3?"#586b72":"#83979a",-98);this.box(this.pitch,48,80,630,218,"#cad5e2"),this.rect(this.pitch,363,80,1,218,"#cad5e2",-50);for(let s of[48,579])this.box(this.pitch,s,144,99,90,"#cad5e2");for(let s of[48,645])this.box(this.pitch,s,167,33,44,"#cad5e2");for(let s=0;s<90;s++){let a=s*Math.PI*2/90;this.rect(this.pitch,Math.round(363+Math.cos(a)*55),Math.round(189+Math.sin(a)*29),1,1,"#cad5e2",-50)}for(let s of[27,678]){this.box(this.pitch,s,91,21,120,"#eaf4ff");for(let a=0;a<120;a+=7)this.rect(this.pitch,s,91+a,21,1,"#748783",-49);for(let a=0;a<22;a+=7)this.rect(this.pitch,s+a,91,1,120,"#748783",-49)}this.batchStatic(this.pitch);for(let s=0;s<22;s++){let a=this.makeSprite();this.actors.set(s,a),this.pitch.add(a);let r=this.rect(this.pitch,0,0,10,2,s<11?"#5cdfff":"#ef6758",1),o=new $e(new Yl(1,12),new _i({color:"#102318",transparent:!0,depthTest:!1,depthWrite:!1}));o.scale.set(8,2,1),this.pitch.add(o),this.meshes.push(o);let l=new Vn;l.setAttribute("position",new je([-4,80,0,0,74,0,4,80,0],3));let c=new $e(l,new _i({color:"#ffffff",side:vi,transparent:!0,depthTest:!1,depthWrite:!1}));this.pitch.add(c),this.meshes.push(c),this.decorations.set(s,{marker:r,shadow:o,selection:c})}for(let s=0;s<8;s++)this.rect(this.close,s*40,27,40,197,s%2?"#285c36":"#2b6539",-100);this.rect(this.close,0,0,320,27,"#162536",-99);for(let s=6;s<23;s+=5)for(let a=2;a<320;a+=7)this.rect(this.close,a,s,2,2,(a+s)%3?"#586b72":"#83979a",-98);this.batchStatic(this.close),this.close.add(this.net,this.target),this.rect(this.net,48,59,224,74,"#112322",-50);for(let s=48;s<=272;s+=8)this.rect(this.net,s,61,1,71,"#cad5e2",-49);for(let s=61;s<=132;s+=7)this.rect(this.net,48,s,224,1,"#cad5e2",-49);this.box(this.net,48,58,224,75,"#ffffff"),this.batchStatic(this.net),this.closeKeeper=this.makeSprite(),this.close.add(this.closeKeeper),this.closeMarker=this.rect(this.close,0,0,10,2,"#5cdfff",1),this.closeShadow=this.rect(this.close,0,0,7,2,"#162536",9e3),this.rect(this.target,-12,0,25,1,"#5cdfff",10010),this.rect(this.target,0,-12,1,25,"#5cdfff",10010),this.ballShadow=this.rect(this.pitch,0,0,6,2,"#162536",9e3),this.rect(this.ball,-3,-3,7,7,"#081019",1e4),this.rect(this.ball,-2,-2,5,5,"#ffffff",10001),this.rect(this.ball,-1,-1,2,2,"#1a253a",10002)}gl;scene=new Hl;pitch=new $n;camera=new $a(0,320,0,-224,.1,200);texture;poses;actors=new Map;decorations=new Map;meshes=[];ball=new $n;ballShadow;close=new $n;net=new $n;closeKeeper;target=new $n;closeShadow;closeMarker;disposed=!1;rect(t,n,i,s,a,r,o){let l=new $e(new ga(s,a),new _i({color:r,transparent:o>0,depthTest:!1,depthWrite:!1}));return l.position.set(n+s/2,-i-a/2,0),l.renderOrder=o,t.add(l),this.meshes.push(l),l}box(t,n,i,s,a,r,o=1){this.rect(t,n,i,s,o,r,-40),this.rect(t,n,i+a-o,s,o,r,-40),this.rect(t,n,i,o,a,r,-40),this.rect(t,n+s-o,i,o,a,r,-40)}makeSprite(){let t=new $e(new ga(1,1),new _i({map:this.texture,transparent:!0,alphaTest:.01,depthTest:!1,depthWrite:!1}));return this.meshes.push(t),t}batchStatic(t){let n=t.children.filter(l=>l instanceof $e&&l.renderOrder<0);n.sort((l,c)=>l.renderOrder-c.renderOrder);let i=[],s=[];for(let l of n){l.updateMatrix();let c=l.geometry.toNonIndexed(),u=c.getAttribute("position");for(let p=0;p<u.count;p++){let h=new V().fromBufferAttribute(u,p).applyMatrix4(l.matrix);i.push(h.x,h.y,h.z),s.push(l.material.color.r,l.material.color.g,l.material.color.b)}c.dispose(),l.geometry.dispose(),l.material.dispose(),t.remove(l)}let a=new Set(n);this.meshes=this.meshes.filter(l=>!a.has(l));let r=new Vn;r.setAttribute("position",new je(i,3)),r.setAttribute("color",new je(s,3));let o=new $e(r,new _i({vertexColors:!0,depthTest:!1,depthWrite:!1}));o.renderOrder=-50,t.add(o),this.meshes.push(o)}show(t,n,i,s,a){let r=this.poses.get(s.pose);if(!r)throw new Error("Missing atlas pose "+s.pose);let o=r.anchors.ground,[l,c,u,p]=r.atlas,[h,f]=this.assets.atlasSize,m=t.geometry.getAttribute("uv");m.setXY(0,l/h,1-c/f),m.setXY(1,(l+u)/h,1-c/f),m.setXY(2,l/h,1-(c+p)/f),m.setXY(3,(l+u)/h,1-(c+p)/f),m.needsUpdate=!0,t.scale.set(s.mirror?-u:u,p,1),t.position.set(Math.round(n)+(s.mirror?o[0]-u/2:u/2-o[0]),-(Math.round(i)+p/2-o[1]),0),t.renderOrder=a,t.visible=!0}render(t){if(this.disposed)return;let n=t.state,i=n.shotView;if(this.pitch.visible=!i,this.close.visible=!!i,i){this.camera.left=0,this.camera.right=320,this.camera.top=0,this.camera.bottom=-224,this.camera.updateProjectionMatrix();let a=n.players[i.keeper],r=qa({...a,z:0},i),o=iS(n.ball,i),l=qa(n.ball,i);this.net.position.y=-(i.planeY-133),this.show(this.closeKeeper,r.x,r.y,t.view(a),151),this.closeMarker.position.set(r.x,-r.y-5,0),this.closeMarker.renderOrder=152,this.closeMarker.material instanceof _i&&this.closeMarker.material.color.set(a.team===0?"#5cdfff":"#ef6758"),this.target.visible=i.phase==="aim",this.target.position.set(i.aim.x,-i.aim.y,0),this.ball.position.set(Math.round(o.x),-Math.round(o.y),0),this.closeShadow.visible=n.ball.z>3,this.closeShadow.position.set(Math.round(l.x),-Math.round(l.y),0),this.gl.render(this.scene,this.camera);return}for(let a of this.actors.values())a.visible=!1;for(let a of this.decorations.values())a.marker.visible=!1,a.shadow.visible=!1,a.selection.visible=!1;for(let a of n.players){let r=Ai(a),o=Math.round(r.x),l=Math.round(r.y);this.show(this.actors.get(a.id),r.x,r.y,t.view(a),l);let c=this.decorations.get(a.id);c.marker.visible=!0,c.shadow.visible=!0,c.marker.position.set(o,-l-5,0),c.marker.renderOrder=l+.1,c.shadow.position.set(o,-l-2,0),c.shadow.renderOrder=l-.1,c.selection.visible=a.id===n.selected,c.selection.position.set(o,-l,0),c.selection.renderOrder=8e3}let s=Ai(n.ball);this.ball.position.set(Math.round(s.x),-Math.round(s.y-n.ball.z),0),this.ballShadow.visible=n.ball.z>3,this.ballShadow.position.set(Math.round(s.x),-Math.round(s.y),0),this.camera.left=n.camera.x,this.camera.right=n.camera.x+320,this.camera.top=-n.camera.y,this.camera.bottom=-n.camera.y-224,this.camera.updateProjectionMatrix(),this.gl.render(this.scene,this.camera)}diagnostics(){return{disposed:this.disposed,geometries:this.gl.info.memory.geometries,textures:this.gl.info.memory.textures,drawCalls:this.gl.info.render.calls}}dispose(){if(!this.disposed){this.disposed=!0;for(let t of this.meshes){t.geometry.dispose();let n=t.material;Array.isArray(n)?n.forEach(i=>i.dispose()):n.dispose()}this.texture.dispose(),this.scene.clear(),this.actors.clear(),this.gl.renderLists.dispose(),this.gl.dispose(),this.gl.forceContextLoss()}}};var Hf=class{constructor(t,n,i,s={}){this.context=s;this.sim=new Xu(n),this.renderer=new Vf(t,n,i),this.settings={music:.4,sfx:.7},this.setSettings(s.settings??{},!1),this.renderer.render(this.sim),this.raf=requestAnimationFrame(this.loop),t.addEventListener("webglcontextlost",a=>{this.disposed||(a.preventDefault(),this.pause(),this.unavailable=!0,this.context.onError?.("Graphics context lost. Retry loading to continue."))},{signal:this.controller.signal})}audio=new Gu;sim;renderer;settings;previous=null;accumulated=0;raf=0;disposed=!1;unavailable=!1;backgrounded=!1;listeners=new Set;resultSent=!1;eventCursor=0;controller=new AbortController;subscribe=t=>(this.listeners.add(t),()=>{this.listeners.delete(t)});publish(){this.renderer.render(this.sim);for(let t of this.sim.state.events){let n=Number(t.sequence);n>this.eventCursor&&(this.eventCursor=n,this.audio.event(t),this.context.onEvent?.(structuredClone(t)))}this.audio.sync(this.backgrounded?"hidden":this.sim.state.status),this.sim.state.status==="complete"&&(this.resultSent||(this.resultSent=!0,this.context.onResult?.(this.result())));for(let t of this.listeners)t()}result(){let t=this.sim.state;return{schemaVersion:2,gameId:"retro-football",mode:"exhibition",airContacts:[...t.airContacts],airCollections:[...t.airCollections],outcome:t.score[0]===t.score[1]?"draw":t.score[0]>t.score[1]?"win":"loss",score:[...t.score],halves:2,activeSeconds:180,passes:[...t.passes],shots:[...t.shots],saves:[...t.saves],rulesVersion:bi.rulesVersion,runtimeVersion:bi.runtimeVersion,assetVersion:bi.assetVersion}}dispatch=t=>{if(this.disposed||this.unavailable)return;t.type!=="clear"&&!(t.type==="hold"&&!t.value)&&this.audio.unlock();let n=this.sim.state.round,i=this.sim.state.status;this.sim.command(t);let s=this.sim.state.round!==n;(this.sim.state.status!==i||s)&&(this.previous=null,this.accumulated=0),s&&(this.resultSent=!1,this.eventCursor=0),this.publish(),["start","resume"].includes(t.type)&&this.audio.ui()};step(t=1){if(!(this.disposed||this.unavailable)){for(let n=0;n<t;n++)this.sim.step();this.publish()}}loop=t=>{if(!this.disposed){if(this.sim.state.status==="playing"){this.previous!==null&&(this.accumulated+=Math.min(200,t-this.previous));let n=Math.min(12,Math.floor((this.accumulated+1e-7)/(1e3/60)));n&&(this.step(n),this.accumulated-=n*1e3/60),this.previous=t}else this.previous=null;this.raf=requestAnimationFrame(this.loop)}};start(){this.dispatch({type:"start"})}pause(){this.sim.state.status==="playing"?this.dispatch({type:"pause"}):this.dispatch({type:"clear"})}resume(){this.dispatch({type:"resume"})}setBackground(t){this.disposed||(this.backgrounded=t,t?this.pause():this.audio.sync(this.sim.state.status))}restart(){this.disposed||this.unavailable||(this.audio.unlock(),this.sim.restart(),this.previous=null,this.accumulated=0,this.resultSent=!1,this.eventCursor=0,this.publish())}setSettings(t,n=!0){if(!this.disposed){for(let i of["music","sfx"]){let s=t[i];s!==void 0&&Number.isFinite(s)&&(this.settings[i]=Math.max(0,Math.min(1,s)))}this.audio.setSettings(this.settings),n&&this.context.onSettingsChange?.({...this.settings})}}diagnostics(){return{...this.renderer.diagnostics(),listeners:this.listeners.size,audio:this.audio.diagnostics(),pendingFrame:!this.disposed}}dispose(){this.disposed||(this.disposed=!0,this.controller.abort(),cancelAnimationFrame(this.raf),this.sim.clear(),this.listeners.clear(),this.renderer.dispose(),this.audio.dispose(),this.previous=null,this.accumulated=0)}};function Vb(e,t){let n=new AbortController,i={signal:n.signal},s={arrowleft:"left",a:"left",arrowright:"right",d:"right",arrowup:"up",w:"up",arrowdown:"down",s:"down"},a={j:"A",k:"B",l:"C"};document.addEventListener("keydown",c=>{if(c.target?.matches("input,select,textarea"))return;if(c.key==="Escape"&&!c.repeat){c.preventDefault(),t.dispatch({type:"pause"});return}let u=s[c.key.toLowerCase()];u&&(c.preventDefault(),t.dispatch({type:"hold",key:u,value:!0,source:"keyboard:"+c.code}));let p=a[c.key.toLowerCase()];p&&!c.repeat&&(c.preventDefault(),t.dispatch({type:p}))},i),document.addEventListener("keyup",c=>{let u=s[c.key.toLowerCase()];u&&t.dispatch({type:"hold",key:u,value:!1,source:"keyboard:"+c.code})},i);let r=new Set;e.addEventListener("pointerdown",c=>{let u=c.target.closest("button[data-hold],button[data-action]");if(!u||u.disabled)return;c.preventDefault(),u.setPointerCapture(c.pointerId),r.add(c.pointerId),u.dataset.pressed="true";let p=u.dataset.hold,h=u.dataset.action;p?t.dispatch({type:"hold",key:p,value:!0,source:"pointer:"+c.pointerId}):h&&t.dispatch({type:h})},i);let o=c=>{let u=c.target.closest("button[data-hold],button[data-action]");if(!u)return;delete u.dataset.pressed,r.delete(c.pointerId);let p=u.dataset.hold;p&&t.dispatch({type:"hold",key:p,value:!1,source:"pointer:"+c.pointerId})};for(let c of["pointerup","pointercancel","lostpointercapture"])e.addEventListener(c,o,i);let l=()=>{t.setBackground(!0);for(let c of e.querySelectorAll("[data-pressed]"))delete c.dataset.pressed;r.clear()};return window.addEventListener("blur",l,i),window.addEventListener("focus",()=>{document.hidden||t.setBackground(!1)},i),document.addEventListener("visibilitychange",()=>{document.hidden?l():t.setBackground(!1)},i),document.hidden&&l(),()=>{n.abort(),r.clear();for(let c of e.querySelectorAll("[data-pressed]"))delete c.dataset.pressed;t.sim.clear()}}var Lt=hc(Jg(),1),Cn={session:null,ready:!1,mounts:0,disposals:0,lastDisposal:null,step:e=>Cn.session?.step(e),restart:()=>Cn.session?.restart(),dispose:()=>{},remount:()=>{}};window.productionLab=Cn;function C2({manifestUrl:e,context:t}){let n=(0,Bi.useRef)(null),i=(0,Bi.useRef)(null),s=(0,Bi.useRef)(null),[a,r]=(0,Bi.useState)(0),[o,l]=(0,Bi.useState)(0),[c,u]=(0,Bi.useState)(""),[p,h]=(0,Bi.useState)(!1);(0,Bi.useEffect)(()=>{let g=new AbortController,M=()=>{},v=()=>{};return h(!1),Cn.ready=!1,u(""),$x(e,g.signal).then(({manifest:T,image:E})=>{if(g.signal.aborted)return;let w=new Hf(n.current,T,E,{...t,onError:x=>{u(x),h(!1),Cn.ready=!1,t.onError?.(x)}});s.current=w,Cn.session=w,Cn.mounts++,t.onReady?.(w),M=Vb(i.current,w),v=w.subscribe(()=>{window.gameState=w.sim.snapshot(),l(x=>x+1)}),window.gameState=w.sim.snapshot(),h(!0),Cn.ready=!0}).catch(T=>{g.signal.aborted||(u(T instanceof Error?T.message:"Football could not load."),t.onError?.(String(T)))}),()=>{g.abort(),M(),v();let T=s.current;T&&(T.dispose(),Cn.lastDisposal=T.diagnostics(),Cn.disposals++),s.current=null,Cn.session=null,Cn.ready=!1}},[e,t,a]),Cn.remount=()=>r(g=>g+1);let f=s.current?.sim.state,m=f?.status==="playing",b=f?Math.max(0,90-Math.floor(f.halfTicks/60)):90,y=f?.half===2?"LEFT":"RIGHT",d=f?.shotView?.phase==="aim"?"SHOOT":f?.owner===null&&f?.aerial?.controlledBy===null?"CONTROL":f?.phase==="restart"?f.restart?.kind==="throw-in"?"THROW IN":"TAKE RESTART":f?.owner===f?.selected?(f&&s.current.sim.attack(0)===1?f.players[f.selected].x>70:f&&f.players[f.selected].x<35)?"CHANCE":"PASS":"TACKLE";return(0,Lt.jsxs)("main",{className:"app",ref:i,"data-render":o,children:[(0,Lt.jsxs)("header",{className:"heading",children:[(0,Lt.jsx)("p",{className:"eyebrow",children:"STATOZ / RETRO FOOTBALL / EXHIBITION STUDY"}),(0,Lt.jsx)("h1",{children:"HARBOUR vs ORCHARD."})]}),(0,Lt.jsx)("section",{className:"shell play",children:(0,Lt.jsxs)("div",{className:"panel",children:[(0,Lt.jsxs)("div",{className:"hud",children:[(0,Lt.jsx)("span",{id:"state",className:"eyebrow",children:c?"LOAD ERROR":p?f?.status==="playing"?f.shotView?{aim:"CHANCE",windup:"SHOOT",flight:"SHOT",parry:"SAVE",goal:"GOAL"}[f.shotView.phase]:f.phase.toUpperCase():f?.status.toUpperCase():"LOADING"}),(0,Lt.jsxs)("span",{className:"metric",children:[(0,Lt.jsx)("small",{children:"HARBOUR / ORCHARD"}),(0,Lt.jsxs)("b",{id:"score",children:[f?.score[0]??0," : ",f?.score[1]??0]})]}),(0,Lt.jsxs)("span",{className:"metric",children:[(0,Lt.jsxs)("small",{children:["HALF ",f?.half??1," / 2"]}),(0,Lt.jsxs)("b",{id:"clock",children:[Math.floor(b/60),":",String(b%60).padStart(2,"0")]})]}),(0,Lt.jsxs)("span",{className:"metric",children:[(0,Lt.jsx)("small",{children:"HARBOUR ATTACKS"}),(0,Lt.jsx)("b",{children:y})]})]}),(0,Lt.jsxs)("div",{className:"arena",children:[(0,Lt.jsx)("canvas",{ref:n,width:"320",height:"224","aria-label":"Retro Football exhibition pitch"},a),(0,Lt.jsxs)("div",{className:"minimap",hidden:!!f?.shotView,style:{top:f&&Ai(f.ball).y-f.ball.z-f.camera.y>112?8:void 0,bottom:f&&Ai(f.ball).y-f.ball.z-f.camera.y>112?"auto":8},"aria-label":"Pitch overview",children:[(0,Lt.jsx)("i",{className:"centre-line"}),f?.players.map(g=>(0,Lt.jsx)("i",{className:"map-player "+(g.team===0?"harbour":"orchard")+(g.id===f.selected?" chosen":""),style:{left:g.x/105*100+"%",top:g.y/68*100+"%"}},g.id)),f&&(0,Lt.jsx)("i",{className:"map-ball",style:{left:f.ball.x/105*100+"%",top:f.ball.y/68*100+"%"}})]})]})]})}),(0,Lt.jsxs)("section",{className:"side",children:[(0,Lt.jsx)("p",{id:"message",role:"status",children:c||f?.message||"Loading the local team atlas."}),(0,Lt.jsxs)("div",{className:"controls",children:[(0,Lt.jsx)("div",{className:"dpad",children:["up","left","down","right"].map(g=>(0,Lt.jsx)("button",{"data-hold":g,"aria-label":(f?.shotView?.phase==="aim"?"Aim ":"Move ")+g,disabled:!p||!m||!!f?.shotView&&f.shotView.phase!=="aim","data-pressed":f?.held[g]?"true":void 0,children:{up:"\u2191",left:"\u2190",down:"\u2193",right:"\u2192"}[g]},g))}),(0,Lt.jsx)("div",{className:"actions",children:["A","B","C"].map((g,M)=>(0,Lt.jsx)("button",{id:g,"data-action":g,disabled:!p||!m||f?.phase==="goal"||!!f?.shotView&&(f.shotView.phase!=="aim"||g!=="A"),onClick:v=>{v.detail===0&&s.current?.dispatch({type:g})},children:(0,Lt.jsx)("span",{children:[d,"HIGH PASS","SHORT / SWITCH"][M]})},g))})]}),(0,Lt.jsxs)("div",{className:"session",children:[(0,Lt.jsx)("button",{id:"start",hidden:!["ready","halftime"].includes(f?.status||"")||!!c,disabled:!p,onClick:()=>s.current?.start(),children:f?.status==="halftime"?"Start second half":"Start exhibition"}),(0,Lt.jsx)("button",{id:"pause",disabled:!p||!["playing","paused"].includes(f?.status||""),onClick:()=>s.current?.dispatch({type:"pause"}),children:f?.status==="paused"?"Resume":"Pause"}),(0,Lt.jsx)("button",{id:"restart",disabled:!p,onClick:()=>s.current?.restart(),children:f?.status==="complete"?"Rematch":"Restart"}),(0,Lt.jsx)("button",{id:"exit",onClick:()=>{s.current?.pause(),t.onExit?t.onExit():s.current?.restart()},children:"Exit"}),c&&(0,Lt.jsx)("button",{id:"retry",onClick:()=>r(g=>g+1),children:"Retry loading"})]}),(0,Lt.jsx)("div",{className:"audio-settings","aria-label":"Audio settings",children:["music","sfx"].map(g=>(0,Lt.jsxs)("label",{children:[g==="music"?"Music":"Sound effects"," ",(0,Lt.jsx)("input",{"aria-label":g==="music"?"Music volume":"Sound effects volume",type:"range",min:"0",max:"1",step:"0.05",value:s.current?.settings[g]??(g==="music"?.4:.7),onChange:M=>{s.current?.audio.unlock(),s.current?.setSettings({[g]:Number(M.currentTarget.value)}),l(v=>v+1)}})]},g))}),(0,Lt.jsx)("p",{className:"muted",children:"Arrows / WASD \xB7 J / K / L \xB7 Escape to pause. Two 90-second active-play halves; clock stops at restarts."}),(0,Lt.jsx)("p",{className:"muted",children:"Cyan: Harbour Athletic. Red: Orchard United. Invented teams. Source-derived reference art; exhibition foundation under review. Loft: J times control; recover before collecting. CHANCE: aim, then J shoots. Original synthesized audio. Standing catches use the pitch camera; close-view saves retain parries."})]})]})}function R2(e,t={},n=new URL("../assets.json",import.meta.url)){let i=(0,Xb.createRoot)(e),s=!1;return i.render((0,Lt.jsx)(C2,{manifestUrl:n,context:t})),{definition:bi,dispose(){s||(s=!0,i.unmount(),Cn.ready=!1)}}}var Wb=document.getElementById("game");if(Wb){let e=l0(),t=R2(Wb,e.context,new URL("./assets.json",import.meta.url));Cn.dispose=()=>{e.dispose(),t.dispose()}}export{R2 as mountFootball};
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
//# sourceMappingURL=bundle.js.map
