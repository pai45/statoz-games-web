var w1=Object.create;var M0=Object.defineProperty;var C1=Object.getOwnPropertyDescriptor;var R1=Object.getOwnPropertyNames;var D1=Object.getPrototypeOf,N1=Object.prototype.hasOwnProperty;var Xi=(e,t)=>()=>{try{return t||e((t={exports:{}}).exports,t),t.exports}catch(n){throw t=0,n}};var L1=(e,t,n,i)=>{if(t&&typeof t=="object"||typeof t=="function")for(let s of R1(t))!N1.call(e,s)&&s!==n&&M0(e,s,{get:()=>t[s],enumerable:!(i=C1(t,s))||i.enumerable});return e};var ks=(e,t,n)=>(n=e!=null?w1(D1(e)):{},L1(t||!e||!e.__esModule?M0(n,"default",{value:e,enumerable:!0}):n,e));var B0=Xi(Bt=>{"use strict";var cd=Symbol.for("react.transitional.element"),O1=Symbol.for("react.portal"),I1=Symbol.for("react.fragment"),P1=Symbol.for("react.strict_mode"),B1=Symbol.for("react.profiler"),z1=Symbol.for("react.consumer"),F1=Symbol.for("react.context"),k1=Symbol.for("react.forward_ref"),H1=Symbol.for("react.suspense"),V1=Symbol.for("react.memo"),N0=Symbol.for("react.lazy"),G1=Symbol.for("react.activity"),w0=Symbol.iterator;function W1(e){return e===null||typeof e!="object"?null:(e=w0&&e[w0]||e["@@iterator"],typeof e=="function"?e:null)}var L0={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},U0=Object.assign,O0={};function xr(e,t,n){this.props=e,this.context=t,this.refs=O0,this.updater=n||L0}xr.prototype.isReactComponent={};xr.prototype.setState=function(e,t){if(typeof e!="object"&&typeof e!="function"&&e!=null)throw Error("takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,e,t,"setState")};xr.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")};function I0(){}I0.prototype=xr.prototype;function ud(e,t,n){this.props=e,this.context=t,this.refs=O0,this.updater=n||L0}var hd=ud.prototype=new I0;hd.constructor=ud;U0(hd,xr.prototype);hd.isPureReactComponent=!0;var C0=Array.isArray;function ld(){}var Te={H:null,A:null,T:null,S:null},P0=Object.prototype.hasOwnProperty;function fd(e,t,n){var i=n.ref;return{$$typeof:cd,type:e,key:t,ref:i!==void 0?i:null,props:n}}function X1(e,t){return fd(e.type,t,e.props)}function dd(e){return typeof e=="object"&&e!==null&&e.$$typeof===cd}function q1(e){var t={"=":"=0",":":"=2"};return"$"+e.replace(/[=:]/g,function(n){return t[n]})}var R0=/\/+/g;function od(e,t){return typeof e=="object"&&e!==null&&e.key!=null?q1(""+e.key):t.toString(36)}function Y1(e){switch(e.status){case"fulfilled":return e.value;case"rejected":throw e.reason;default:switch(typeof e.status=="string"?e.then(ld,ld):(e.status="pending",e.then(function(t){e.status==="pending"&&(e.status="fulfilled",e.value=t)},function(t){e.status==="pending"&&(e.status="rejected",e.reason=t)})),e.status){case"fulfilled":return e.value;case"rejected":throw e.reason}}throw e}function yr(e,t,n,i,s){var a=typeof e;(a==="undefined"||a==="boolean")&&(e=null);var r=!1;if(e===null)r=!0;else switch(a){case"bigint":case"string":case"number":r=!0;break;case"object":switch(e.$$typeof){case cd:case O1:r=!0;break;case N0:return r=e._init,yr(r(e._payload),t,n,i,s)}}if(r)return s=s(e),r=i===""?"."+od(e,0):i,C0(s)?(n="",r!=null&&(n=r.replace(R0,"$&/")+"/"),yr(s,t,n,"",function(c){return c})):s!=null&&(dd(s)&&(s=X1(s,n+(s.key==null||e&&e.key===s.key?"":(""+s.key).replace(R0,"$&/")+"/")+r)),t.push(s)),1;r=0;var o=i===""?".":i+":";if(C0(e))for(var l=0;l<e.length;l++)i=e[l],a=o+od(i,l),r+=yr(i,t,n,a,s);else if(l=W1(e),typeof l=="function")for(e=l.call(e),l=0;!(i=e.next()).done;)i=i.value,a=o+od(i,l++),r+=yr(i,t,n,a,s);else if(a==="object"){if(typeof e.then=="function")return yr(Y1(e),t,n,i,s);throw t=String(e),Error("Objects are not valid as a React child (found: "+(t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t)+"). If you meant to render a collection of children, use an array instead.")}return r}function Tc(e,t,n){if(e==null)return e;var i=[],s=0;return yr(e,i,"","",function(a){return t.call(n,a,s++)}),i}function Z1(e){if(e._status===-1){var t=e._result;t=t(),t.then(function(n){(e._status===0||e._status===-1)&&(e._status=1,e._result=n)},function(n){(e._status===0||e._status===-1)&&(e._status=2,e._result=n)}),e._status===-1&&(e._status=0,e._result=t)}if(e._status===1)return e._result.default;throw e._result}var D0=typeof reportError=="function"?reportError:function(e){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var t=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof e=="object"&&e!==null&&typeof e.message=="string"?String(e.message):String(e),error:e});if(!window.dispatchEvent(t))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",e);return}console.error(e)},K1={map:Tc,forEach:function(e,t,n){Tc(e,function(){t.apply(this,arguments)},n)},count:function(e){var t=0;return Tc(e,function(){t++}),t},toArray:function(e){return Tc(e,function(t){return t})||[]},only:function(e){if(!dd(e))throw Error("React.Children.only expected to receive a single React element child.");return e}};Bt.Activity=G1;Bt.Children=K1;Bt.Component=xr;Bt.Fragment=I1;Bt.Profiler=B1;Bt.PureComponent=ud;Bt.StrictMode=P1;Bt.Suspense=H1;Bt.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=Te;Bt.__COMPILER_RUNTIME={__proto__:null,c:function(e){return Te.H.useMemoCache(e)}};Bt.cache=function(e){return function(){return e.apply(null,arguments)}};Bt.cacheSignal=function(){return null};Bt.cloneElement=function(e,t,n){if(e==null)throw Error("The argument must be a React element, but you passed "+e+".");var i=U0({},e.props),s=e.key;if(t!=null)for(a in t.key!==void 0&&(s=""+t.key),t)!P0.call(t,a)||a==="key"||a==="__self"||a==="__source"||a==="ref"&&t.ref===void 0||(i[a]=t[a]);var a=arguments.length-2;if(a===1)i.children=n;else if(1<a){for(var r=Array(a),o=0;o<a;o++)r[o]=arguments[o+2];i.children=r}return fd(e.type,s,i)};Bt.createContext=function(e){return e={$$typeof:F1,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null},e.Provider=e,e.Consumer={$$typeof:z1,_context:e},e};Bt.createElement=function(e,t,n){var i,s={},a=null;if(t!=null)for(i in t.key!==void 0&&(a=""+t.key),t)P0.call(t,i)&&i!=="key"&&i!=="__self"&&i!=="__source"&&(s[i]=t[i]);var r=arguments.length-2;if(r===1)s.children=n;else if(1<r){for(var o=Array(r),l=0;l<r;l++)o[l]=arguments[l+2];s.children=o}if(e&&e.defaultProps)for(i in r=e.defaultProps,r)s[i]===void 0&&(s[i]=r[i]);return fd(e,a,s)};Bt.createRef=function(){return{current:null}};Bt.forwardRef=function(e){return{$$typeof:k1,render:e}};Bt.isValidElement=dd;Bt.lazy=function(e){return{$$typeof:N0,_payload:{_status:-1,_result:e},_init:Z1}};Bt.memo=function(e,t){return{$$typeof:V1,type:e,compare:t===void 0?null:t}};Bt.startTransition=function(e){var t=Te.T,n={};Te.T=n;try{var i=e(),s=Te.S;s!==null&&s(n,i),typeof i=="object"&&i!==null&&typeof i.then=="function"&&i.then(ld,D0)}catch(a){D0(a)}finally{t!==null&&n.types!==null&&(t.types=n.types),Te.T=t}};Bt.unstable_useCacheRefresh=function(){return Te.H.useCacheRefresh()};Bt.use=function(e){return Te.H.use(e)};Bt.useActionState=function(e,t,n){return Te.H.useActionState(e,t,n)};Bt.useCallback=function(e,t){return Te.H.useCallback(e,t)};Bt.useContext=function(e){return Te.H.useContext(e)};Bt.useDebugValue=function(){};Bt.useDeferredValue=function(e,t){return Te.H.useDeferredValue(e,t)};Bt.useEffect=function(e,t){return Te.H.useEffect(e,t)};Bt.useEffectEvent=function(e){return Te.H.useEffectEvent(e)};Bt.useId=function(){return Te.H.useId()};Bt.useImperativeHandle=function(e,t,n){return Te.H.useImperativeHandle(e,t,n)};Bt.useInsertionEffect=function(e,t){return Te.H.useInsertionEffect(e,t)};Bt.useLayoutEffect=function(e,t){return Te.H.useLayoutEffect(e,t)};Bt.useMemo=function(e,t){return Te.H.useMemo(e,t)};Bt.useOptimistic=function(e,t){return Te.H.useOptimistic(e,t)};Bt.useReducer=function(e,t,n){return Te.H.useReducer(e,t,n)};Bt.useRef=function(e){return Te.H.useRef(e)};Bt.useState=function(e){return Te.H.useState(e)};Bt.useSyncExternalStore=function(e,t,n){return Te.H.useSyncExternalStore(e,t,n)};Bt.useTransition=function(){return Te.H.useTransition()};Bt.version="19.2.8"});var vr=Xi((d3,z0)=>{"use strict";z0.exports=B0()});var J0=Xi(Le=>{"use strict";function yd(e,t){var n=e.length;e.push(t);t:for(;0<n;){var i=n-1>>>1,s=e[i];if(0<Ac(s,t))e[i]=t,e[n]=s,n=i;else break t}}function qi(e){return e.length===0?null:e[0]}function Cc(e){if(e.length===0)return null;var t=e[0],n=e.pop();if(n!==t){e[0]=n;t:for(var i=0,s=e.length,a=s>>>1;i<a;){var r=2*(i+1)-1,o=e[r],l=r+1,c=e[l];if(0>Ac(o,n))l<s&&0>Ac(c,o)?(e[i]=c,e[l]=n,i=l):(e[i]=o,e[r]=n,i=r);else if(l<s&&0>Ac(c,n))e[i]=c,e[l]=n,i=l;else break t}}return t}function Ac(e,t){var n=e.sortIndex-t.sortIndex;return n!==0?n:e.id-t.id}Le.unstable_now=void 0;typeof performance=="object"&&typeof performance.now=="function"?(H0=performance,Le.unstable_now=function(){return H0.now()}):(pd=Date,V0=pd.now(),Le.unstable_now=function(){return pd.now()-V0});var H0,pd,V0,cs=[],Hs=[],J1=1,ui=null,Sn=3,xd=!1,Fo=!1,ko=!1,vd=!1,X0=typeof setTimeout=="function"?setTimeout:null,q0=typeof clearTimeout=="function"?clearTimeout:null,G0=typeof setImmediate<"u"?setImmediate:null;function wc(e){for(var t=qi(Hs);t!==null;){if(t.callback===null)Cc(Hs);else if(t.startTime<=e)Cc(Hs),t.sortIndex=t.expirationTime,yd(cs,t);else break;t=qi(Hs)}}function _d(e){if(ko=!1,wc(e),!Fo)if(qi(cs)!==null)Fo=!0,br||(br=!0,_r());else{var t=qi(Hs);t!==null&&bd(_d,t.startTime-e)}}var br=!1,Ho=-1,Y0=5,Z0=-1;function K0(){return vd?!0:!(Le.unstable_now()-Z0<Y0)}function md(){if(vd=!1,br){var e=Le.unstable_now();Z0=e;var t=!0;try{t:{Fo=!1,ko&&(ko=!1,q0(Ho),Ho=-1),xd=!0;var n=Sn;try{e:{for(wc(e),ui=qi(cs);ui!==null&&!(ui.expirationTime>e&&K0());){var i=ui.callback;if(typeof i=="function"){ui.callback=null,Sn=ui.priorityLevel;var s=i(ui.expirationTime<=e);if(e=Le.unstable_now(),typeof s=="function"){ui.callback=s,wc(e),t=!0;break e}ui===qi(cs)&&Cc(cs),wc(e)}else Cc(cs);ui=qi(cs)}if(ui!==null)t=!0;else{var a=qi(Hs);a!==null&&bd(_d,a.startTime-e),t=!1}}break t}finally{ui=null,Sn=n,xd=!1}t=void 0}}finally{t?_r():br=!1}}}var _r;typeof G0=="function"?_r=function(){G0(md)}:typeof MessageChannel<"u"?(gd=new MessageChannel,W0=gd.port2,gd.port1.onmessage=md,_r=function(){W0.postMessage(null)}):_r=function(){X0(md,0)};var gd,W0;function bd(e,t){Ho=X0(function(){e(Le.unstable_now())},t)}Le.unstable_IdlePriority=5;Le.unstable_ImmediatePriority=1;Le.unstable_LowPriority=4;Le.unstable_NormalPriority=3;Le.unstable_Profiling=null;Le.unstable_UserBlockingPriority=2;Le.unstable_cancelCallback=function(e){e.callback=null};Le.unstable_forceFrameRate=function(e){0>e||125<e?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):Y0=0<e?Math.floor(1e3/e):5};Le.unstable_getCurrentPriorityLevel=function(){return Sn};Le.unstable_next=function(e){switch(Sn){case 1:case 2:case 3:var t=3;break;default:t=Sn}var n=Sn;Sn=t;try{return e()}finally{Sn=n}};Le.unstable_requestPaint=function(){vd=!0};Le.unstable_runWithPriority=function(e,t){switch(e){case 1:case 2:case 3:case 4:case 5:break;default:e=3}var n=Sn;Sn=e;try{return t()}finally{Sn=n}};Le.unstable_scheduleCallback=function(e,t,n){var i=Le.unstable_now();switch(typeof n=="object"&&n!==null?(n=n.delay,n=typeof n=="number"&&0<n?i+n:i):n=i,e){case 1:var s=-1;break;case 2:s=250;break;case 5:s=1073741823;break;case 4:s=1e4;break;default:s=5e3}return s=n+s,e={id:J1++,callback:t,priorityLevel:e,startTime:n,expirationTime:s,sortIndex:-1},n>i?(e.sortIndex=n,yd(Hs,e),qi(cs)===null&&e===qi(Hs)&&(ko?(q0(Ho),Ho=-1):ko=!0,bd(_d,n-i))):(e.sortIndex=s,yd(cs,e),Fo||xd||(Fo=!0,br||(br=!0,_r()))),e};Le.unstable_shouldYield=K0;Le.unstable_wrapCallback=function(e){var t=Sn;return function(){var n=Sn;Sn=t;try{return e.apply(this,arguments)}finally{Sn=n}}}});var j0=Xi((g3,Q0)=>{"use strict";Q0.exports=J0()});var ty=Xi(Dn=>{"use strict";var Q1=vr();function $0(e){var t="https://react.dev/errors/"+e;if(1<arguments.length){t+="?args[]="+encodeURIComponent(arguments[1]);for(var n=2;n<arguments.length;n++)t+="&args[]="+encodeURIComponent(arguments[n])}return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function Vs(){}var Rn={d:{f:Vs,r:function(){throw Error($0(522))},D:Vs,C:Vs,L:Vs,m:Vs,X:Vs,S:Vs,M:Vs},p:0,findDOMNode:null},j1=Symbol.for("react.portal");function $1(e,t,n){var i=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:j1,key:i==null?null:""+i,children:e,containerInfo:t,implementation:n}}var Vo=Q1.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;function Rc(e,t){if(e==="font")return"";if(typeof t=="string")return t==="use-credentials"?t:""}Dn.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=Rn;Dn.createPortal=function(e,t){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)throw Error($0(299));return $1(e,t,null,n)};Dn.flushSync=function(e){var t=Vo.T,n=Rn.p;try{if(Vo.T=null,Rn.p=2,e)return e()}finally{Vo.T=t,Rn.p=n,Rn.d.f()}};Dn.preconnect=function(e,t){typeof e=="string"&&(t?(t=t.crossOrigin,t=typeof t=="string"?t==="use-credentials"?t:"":void 0):t=null,Rn.d.C(e,t))};Dn.prefetchDNS=function(e){typeof e=="string"&&Rn.d.D(e)};Dn.preinit=function(e,t){if(typeof e=="string"&&t&&typeof t.as=="string"){var n=t.as,i=Rc(n,t.crossOrigin),s=typeof t.integrity=="string"?t.integrity:void 0,a=typeof t.fetchPriority=="string"?t.fetchPriority:void 0;n==="style"?Rn.d.S(e,typeof t.precedence=="string"?t.precedence:void 0,{crossOrigin:i,integrity:s,fetchPriority:a}):n==="script"&&Rn.d.X(e,{crossOrigin:i,integrity:s,fetchPriority:a,nonce:typeof t.nonce=="string"?t.nonce:void 0})}};Dn.preinitModule=function(e,t){if(typeof e=="string")if(typeof t=="object"&&t!==null){if(t.as==null||t.as==="script"){var n=Rc(t.as,t.crossOrigin);Rn.d.M(e,{crossOrigin:n,integrity:typeof t.integrity=="string"?t.integrity:void 0,nonce:typeof t.nonce=="string"?t.nonce:void 0})}}else t==null&&Rn.d.M(e)};Dn.preload=function(e,t){if(typeof e=="string"&&typeof t=="object"&&t!==null&&typeof t.as=="string"){var n=t.as,i=Rc(n,t.crossOrigin);Rn.d.L(e,n,{crossOrigin:i,integrity:typeof t.integrity=="string"?t.integrity:void 0,nonce:typeof t.nonce=="string"?t.nonce:void 0,type:typeof t.type=="string"?t.type:void 0,fetchPriority:typeof t.fetchPriority=="string"?t.fetchPriority:void 0,referrerPolicy:typeof t.referrerPolicy=="string"?t.referrerPolicy:void 0,imageSrcSet:typeof t.imageSrcSet=="string"?t.imageSrcSet:void 0,imageSizes:typeof t.imageSizes=="string"?t.imageSizes:void 0,media:typeof t.media=="string"?t.media:void 0})}};Dn.preloadModule=function(e,t){if(typeof e=="string")if(t){var n=Rc(t.as,t.crossOrigin);Rn.d.m(e,{as:typeof t.as=="string"&&t.as!=="script"?t.as:void 0,crossOrigin:n,integrity:typeof t.integrity=="string"?t.integrity:void 0})}else Rn.d.m(e)};Dn.requestFormReset=function(e){Rn.d.r(e)};Dn.unstable_batchedUpdates=function(e,t){return e(t)};Dn.useFormState=function(e,t,n){return Vo.H.useFormState(e,t,n)};Dn.useFormStatus=function(){return Vo.H.useHostTransitionStatus()};Dn.version="19.2.8"});var iy=Xi((x3,ny)=>{"use strict";function ey(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(ey)}catch(e){console.error(e)}}ey(),ny.exports=ty()});var mb=Xi(th=>{"use strict";var nn=j0(),Rx=vr(),tM=iy();function tt(e){var t="https://react.dev/errors/"+e;if(1<arguments.length){t+="?args[]="+encodeURIComponent(arguments[1]);for(var n=2;n<arguments.length;n++)t+="&args[]="+encodeURIComponent(arguments[n])}return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function Dx(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function Cl(e){var t=e,n=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,(t.flags&4098)!==0&&(n=t.return),e=t.return;while(e)}return t.tag===3?n:null}function Nx(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function Lx(e){if(e.tag===31){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function sy(e){if(Cl(e)!==e)throw Error(tt(188))}function eM(e){var t=e.alternate;if(!t){if(t=Cl(e),t===null)throw Error(tt(188));return t!==e?null:e}for(var n=e,i=t;;){var s=n.return;if(s===null)break;var a=s.alternate;if(a===null){if(i=s.return,i!==null){n=i;continue}break}if(s.child===a.child){for(a=s.child;a;){if(a===n)return sy(s),e;if(a===i)return sy(s),t;a=a.sibling}throw Error(tt(188))}if(n.return!==i.return)n=s,i=a;else{for(var r=!1,o=s.child;o;){if(o===n){r=!0,n=s,i=a;break}if(o===i){r=!0,i=s,n=a;break}o=o.sibling}if(!r){for(o=a.child;o;){if(o===n){r=!0,n=a,i=s;break}if(o===i){r=!0,i=a,n=s;break}o=o.sibling}if(!r)throw Error(tt(189))}}if(n.alternate!==i)throw Error(tt(190))}if(n.tag!==3)throw Error(tt(188));return n.stateNode.current===n?e:t}function Ux(e){var t=e.tag;if(t===5||t===26||t===27||t===6)return e;for(e=e.child;e!==null;){if(t=Ux(e),t!==null)return t;e=e.sibling}return null}var Ce=Object.assign,nM=Symbol.for("react.element"),Dc=Symbol.for("react.transitional.element"),Jo=Symbol.for("react.portal"),wr=Symbol.for("react.fragment"),Ox=Symbol.for("react.strict_mode"),ep=Symbol.for("react.profiler"),Ix=Symbol.for("react.consumer"),ys=Symbol.for("react.context"),Jp=Symbol.for("react.forward_ref"),np=Symbol.for("react.suspense"),ip=Symbol.for("react.suspense_list"),Qp=Symbol.for("react.memo"),Gs=Symbol.for("react.lazy"),sp=Symbol.for("react.activity"),iM=Symbol.for("react.memo_cache_sentinel"),ay=Symbol.iterator;function Go(e){return e===null||typeof e!="object"?null:(e=ay&&e[ay]||e["@@iterator"],typeof e=="function"?e:null)}var sM=Symbol.for("react.client.reference");function ap(e){if(e==null)return null;if(typeof e=="function")return e.$$typeof===sM?null:e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case wr:return"Fragment";case ep:return"Profiler";case Ox:return"StrictMode";case np:return"Suspense";case ip:return"SuspenseList";case sp:return"Activity"}if(typeof e=="object")switch(e.$$typeof){case Jo:return"Portal";case ys:return e.displayName||"Context";case Ix:return(e._context.displayName||"Context")+".Consumer";case Jp:var t=e.render;return e=e.displayName,e||(e=t.displayName||t.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case Qp:return t=e.displayName||null,t!==null?t:ap(e.type)||"Memo";case Gs:t=e._payload,e=e._init;try{return ap(e(t))}catch{}}return null}var Qo=Array.isArray,Lt=Rx.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,le=tM.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,ka={pending:!1,data:null,method:null,action:null},rp=[],Cr=-1;function Qi(e){return{current:e}}function hn(e){0>Cr||(e.current=rp[Cr],rp[Cr]=null,Cr--)}function Me(e,t){Cr++,rp[Cr]=e.current,e.current=t}var Ji=Qi(null),pl=Qi(null),ta=Qi(null),cu=Qi(null);function uu(e,t){switch(Me(ta,t),Me(pl,e),Me(Ji,null),t.nodeType){case 9:case 11:e=(e=t.documentElement)&&(e=e.namespaceURI)?fx(e):0;break;default:if(e=t.tagName,t=t.namespaceURI)t=fx(t),e=eb(t,e);else switch(e){case"svg":e=1;break;case"math":e=2;break;default:e=0}}hn(Ji),Me(Ji,e)}function qr(){hn(Ji),hn(pl),hn(ta)}function op(e){e.memoizedState!==null&&Me(cu,e);var t=Ji.current,n=eb(t,e.type);t!==n&&(Me(pl,e),Me(Ji,n))}function hu(e){pl.current===e&&(hn(Ji),hn(pl)),cu.current===e&&(hn(cu),Tl._currentValue=ka)}var Sd,ry;function Pa(e){if(Sd===void 0)try{throw Error()}catch(n){var t=n.stack.trim().match(/\n( *(at )?)/);Sd=t&&t[1]||"",ry=-1<n.stack.indexOf(`
    at`)?" (<anonymous>)":-1<n.stack.indexOf("@")?"@unknown:0:0":""}return`
`+Sd+e+ry}var Md=!1;function Ed(e,t){if(!e||Md)return"";Md=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{var i={DetermineComponentFrameRoot:function(){try{if(t){var f=function(){throw Error()};if(Object.defineProperty(f.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(f,[])}catch(d){var h=d}Reflect.construct(e,[],f)}else{try{f.call()}catch(d){h=d}e.call(f.prototype)}}else{try{throw Error()}catch(d){h=d}(f=e())&&typeof f.catch=="function"&&f.catch(function(){})}}catch(d){if(d&&h&&typeof d.stack=="string")return[d.stack,h.stack]}return[null,null]}};i.DetermineComponentFrameRoot.displayName="DetermineComponentFrameRoot";var s=Object.getOwnPropertyDescriptor(i.DetermineComponentFrameRoot,"name");s&&s.configurable&&Object.defineProperty(i.DetermineComponentFrameRoot,"name",{value:"DetermineComponentFrameRoot"});var a=i.DetermineComponentFrameRoot(),r=a[0],o=a[1];if(r&&o){var l=r.split(`
`),c=o.split(`
`);for(s=i=0;i<l.length&&!l[i].includes("DetermineComponentFrameRoot");)i++;for(;s<c.length&&!c[s].includes("DetermineComponentFrameRoot");)s++;if(i===l.length||s===c.length)for(i=l.length-1,s=c.length-1;1<=i&&0<=s&&l[i]!==c[s];)s--;for(;1<=i&&0<=s;i--,s--)if(l[i]!==c[s]){if(i!==1||s!==1)do if(i--,s--,0>s||l[i]!==c[s]){var u=`
`+l[i].replace(" at new "," at ");return e.displayName&&u.includes("<anonymous>")&&(u=u.replace("<anonymous>",e.displayName)),u}while(1<=i&&0<=s);break}}}finally{Md=!1,Error.prepareStackTrace=n}return(n=e?e.displayName||e.name:"")?Pa(n):""}function aM(e,t){switch(e.tag){case 26:case 27:case 5:return Pa(e.type);case 16:return Pa("Lazy");case 13:return e.child!==t&&t!==null?Pa("Suspense Fallback"):Pa("Suspense");case 19:return Pa("SuspenseList");case 0:case 15:return Ed(e.type,!1);case 11:return Ed(e.type.render,!1);case 1:return Ed(e.type,!0);case 31:return Pa("Activity");default:return""}}function oy(e){try{var t="",n=null;do t+=aM(e,n),n=e,e=e.return;while(e);return t}catch(i){return`
Error generating stack: `+i.message+`
`+i.stack}}var lp=Object.prototype.hasOwnProperty,jp=nn.unstable_scheduleCallback,Td=nn.unstable_cancelCallback,rM=nn.unstable_shouldYield,oM=nn.unstable_requestPaint,jn=nn.unstable_now,lM=nn.unstable_getCurrentPriorityLevel,Px=nn.unstable_ImmediatePriority,Bx=nn.unstable_UserBlockingPriority,fu=nn.unstable_NormalPriority,cM=nn.unstable_LowPriority,zx=nn.unstable_IdlePriority,uM=nn.log,hM=nn.unstable_setDisableYieldValue,Rl=null,$n=null;function Ks(e){if(typeof uM=="function"&&hM(e),$n&&typeof $n.setStrictMode=="function")try{$n.setStrictMode(Rl,e)}catch{}}var ti=Math.clz32?Math.clz32:pM,fM=Math.log,dM=Math.LN2;function pM(e){return e>>>=0,e===0?32:31-(fM(e)/dM|0)|0}var Nc=256,Lc=262144,Uc=4194304;function Ba(e){var t=e&42;if(t!==0)return t;switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:return 64;case 128:return 128;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:return e&261888;case 262144:case 524288:case 1048576:case 2097152:return e&3932160;case 4194304:case 8388608:case 16777216:case 33554432:return e&62914560;case 67108864:return 67108864;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 0;default:return e}}function zu(e,t,n){var i=e.pendingLanes;if(i===0)return 0;var s=0,a=e.suspendedLanes,r=e.pingedLanes;e=e.warmLanes;var o=i&134217727;return o!==0?(i=o&~a,i!==0?s=Ba(i):(r&=o,r!==0?s=Ba(r):n||(n=o&~e,n!==0&&(s=Ba(n))))):(o=i&~a,o!==0?s=Ba(o):r!==0?s=Ba(r):n||(n=i&~e,n!==0&&(s=Ba(n)))),s===0?0:t!==0&&t!==s&&(t&a)===0&&(a=s&-s,n=t&-t,a>=n||a===32&&(n&4194048)!==0)?t:s}function Dl(e,t){return(e.pendingLanes&~(e.suspendedLanes&~e.pingedLanes)&t)===0}function mM(e,t){switch(e){case 1:case 2:case 4:case 8:case 64:return t+250;case 16:case 32:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:return-1;case 67108864:case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function Fx(){var e=Uc;return Uc<<=1,(Uc&62914560)===0&&(Uc=4194304),e}function Ad(e){for(var t=[],n=0;31>n;n++)t.push(e);return t}function Nl(e,t){e.pendingLanes|=t,t!==268435456&&(e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0)}function gM(e,t,n,i,s,a){var r=e.pendingLanes;e.pendingLanes=n,e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0,e.expiredLanes&=n,e.entangledLanes&=n,e.errorRecoveryDisabledLanes&=n,e.shellSuspendCounter=0;var o=e.entanglements,l=e.expirationTimes,c=e.hiddenUpdates;for(n=r&~n;0<n;){var u=31-ti(n),f=1<<u;o[u]=0,l[u]=-1;var h=c[u];if(h!==null)for(c[u]=null,u=0;u<h.length;u++){var d=h[u];d!==null&&(d.lane&=-536870913)}n&=~f}i!==0&&kx(e,i,0),a!==0&&s===0&&e.tag!==0&&(e.suspendedLanes|=a&~(r&~t))}function kx(e,t,n){e.pendingLanes|=t,e.suspendedLanes&=~t;var i=31-ti(t);e.entangledLanes|=t,e.entanglements[i]=e.entanglements[i]|1073741824|n&261930}function Hx(e,t){var n=e.entangledLanes|=t;for(e=e.entanglements;n;){var i=31-ti(n),s=1<<i;s&t|e[i]&t&&(e[i]|=t),n&=~s}}function Vx(e,t){var n=t&-t;return n=(n&42)!==0?1:$p(n),(n&(e.suspendedLanes|t))!==0?0:n}function $p(e){switch(e){case 2:e=1;break;case 8:e=4;break;case 32:e=16;break;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:e=128;break;case 268435456:e=134217728;break;default:e=0}return e}function tm(e){return e&=-e,2<e?8<e?(e&134217727)!==0?32:268435456:8:2}function Gx(){var e=le.p;return e!==0?e:(e=window.event,e===void 0?32:fb(e.type))}function ly(e,t){var n=le.p;try{return le.p=e,t()}finally{le.p=n}}var da=Math.random().toString(36).slice(2),mn="__reactFiber$"+da,Hn="__reactProps$"+da,io="__reactContainer$"+da,cp="__reactEvents$"+da,yM="__reactListeners$"+da,xM="__reactHandles$"+da,cy="__reactResources$"+da,Ll="__reactMarker$"+da;function em(e){delete e[mn],delete e[Hn],delete e[cp],delete e[yM],delete e[xM]}function Rr(e){var t=e[mn];if(t)return t;for(var n=e.parentNode;n;){if(t=n[io]||n[mn]){if(n=t.alternate,t.child!==null||n!==null&&n.child!==null)for(e=yx(e);e!==null;){if(n=e[mn])return n;e=yx(e)}return t}e=n,n=e.parentNode}return null}function so(e){if(e=e[mn]||e[io]){var t=e.tag;if(t===5||t===6||t===13||t===31||t===26||t===27||t===3)return e}return null}function jo(e){var t=e.tag;if(t===5||t===26||t===27||t===6)return e.stateNode;throw Error(tt(33))}function Fr(e){var t=e[cy];return t||(t=e[cy]={hoistableStyles:new Map,hoistableScripts:new Map}),t}function un(e){e[Ll]=!0}var Wx=new Set,Xx={};function Ja(e,t){Yr(e,t),Yr(e+"Capture",t)}function Yr(e,t){for(Xx[e]=t,e=0;e<t.length;e++)Wx.add(t[e])}var vM=RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"),uy={},hy={};function _M(e){return lp.call(hy,e)?!0:lp.call(uy,e)?!1:vM.test(e)?hy[e]=!0:(uy[e]=!0,!1)}function Zc(e,t,n){if(_M(t))if(n===null)e.removeAttribute(t);else{switch(typeof n){case"undefined":case"function":case"symbol":e.removeAttribute(t);return;case"boolean":var i=t.toLowerCase().slice(0,5);if(i!=="data-"&&i!=="aria-"){e.removeAttribute(t);return}}e.setAttribute(t,""+n)}}function Oc(e,t,n){if(n===null)e.removeAttribute(t);else{switch(typeof n){case"undefined":case"function":case"symbol":case"boolean":e.removeAttribute(t);return}e.setAttribute(t,""+n)}}function us(e,t,n,i){if(i===null)e.removeAttribute(n);else{switch(typeof i){case"undefined":case"function":case"symbol":case"boolean":e.removeAttribute(n);return}e.setAttributeNS(t,n,""+i)}}function fi(e){switch(typeof e){case"bigint":case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function qx(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(t==="checkbox"||t==="radio")}function bM(e,t,n){var i=Object.getOwnPropertyDescriptor(e.constructor.prototype,t);if(!e.hasOwnProperty(t)&&typeof i<"u"&&typeof i.get=="function"&&typeof i.set=="function"){var s=i.get,a=i.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return s.call(this)},set:function(r){n=""+r,a.call(this,r)}}),Object.defineProperty(e,t,{enumerable:i.enumerable}),{getValue:function(){return n},setValue:function(r){n=""+r},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function up(e){if(!e._valueTracker){var t=qx(e)?"checked":"value";e._valueTracker=bM(e,t,""+e[t])}}function Yx(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),i="";return e&&(i=qx(e)?e.checked?"true":"false":e.value),e=i,e!==n?(t.setValue(e),!0):!1}function du(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}var SM=/[\n"\\]/g;function mi(e){return e.replace(SM,function(t){return"\\"+t.charCodeAt(0).toString(16)+" "})}function hp(e,t,n,i,s,a,r,o){e.name="",r!=null&&typeof r!="function"&&typeof r!="symbol"&&typeof r!="boolean"?e.type=r:e.removeAttribute("type"),t!=null?r==="number"?(t===0&&e.value===""||e.value!=t)&&(e.value=""+fi(t)):e.value!==""+fi(t)&&(e.value=""+fi(t)):r!=="submit"&&r!=="reset"||e.removeAttribute("value"),t!=null?fp(e,r,fi(t)):n!=null?fp(e,r,fi(n)):i!=null&&e.removeAttribute("value"),s==null&&a!=null&&(e.defaultChecked=!!a),s!=null&&(e.checked=s&&typeof s!="function"&&typeof s!="symbol"),o!=null&&typeof o!="function"&&typeof o!="symbol"&&typeof o!="boolean"?e.name=""+fi(o):e.removeAttribute("name")}function Zx(e,t,n,i,s,a,r,o){if(a!=null&&typeof a!="function"&&typeof a!="symbol"&&typeof a!="boolean"&&(e.type=a),t!=null||n!=null){if(!(a!=="submit"&&a!=="reset"||t!=null)){up(e);return}n=n!=null?""+fi(n):"",t=t!=null?""+fi(t):n,o||t===e.value||(e.value=t),e.defaultValue=t}i=i??s,i=typeof i!="function"&&typeof i!="symbol"&&!!i,e.checked=o?e.checked:!!i,e.defaultChecked=!!i,r!=null&&typeof r!="function"&&typeof r!="symbol"&&typeof r!="boolean"&&(e.name=r),up(e)}function fp(e,t,n){t==="number"&&du(e.ownerDocument)===e||e.defaultValue===""+n||(e.defaultValue=""+n)}function kr(e,t,n,i){if(e=e.options,t){t={};for(var s=0;s<n.length;s++)t["$"+n[s]]=!0;for(n=0;n<e.length;n++)s=t.hasOwnProperty("$"+e[n].value),e[n].selected!==s&&(e[n].selected=s),s&&i&&(e[n].defaultSelected=!0)}else{for(n=""+fi(n),t=null,s=0;s<e.length;s++){if(e[s].value===n){e[s].selected=!0,i&&(e[s].defaultSelected=!0);return}t!==null||e[s].disabled||(t=e[s])}t!==null&&(t.selected=!0)}}function Kx(e,t,n){if(t!=null&&(t=""+fi(t),t!==e.value&&(e.value=t),n==null)){e.defaultValue!==t&&(e.defaultValue=t);return}e.defaultValue=n!=null?""+fi(n):""}function Jx(e,t,n,i){if(t==null){if(i!=null){if(n!=null)throw Error(tt(92));if(Qo(i)){if(1<i.length)throw Error(tt(93));i=i[0]}n=i}n==null&&(n=""),t=n}n=fi(t),e.defaultValue=n,i=e.textContent,i===n&&i!==""&&i!==null&&(e.value=i),up(e)}function Zr(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&n.nodeType===3){n.nodeValue=t;return}}e.textContent=t}var MM=new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));function fy(e,t,n){var i=t.indexOf("--")===0;n==null||typeof n=="boolean"||n===""?i?e.setProperty(t,""):t==="float"?e.cssFloat="":e[t]="":i?e.setProperty(t,n):typeof n!="number"||n===0||MM.has(t)?t==="float"?e.cssFloat=n:e[t]=(""+n).trim():e[t]=n+"px"}function Qx(e,t,n){if(t!=null&&typeof t!="object")throw Error(tt(62));if(e=e.style,n!=null){for(var i in n)!n.hasOwnProperty(i)||t!=null&&t.hasOwnProperty(i)||(i.indexOf("--")===0?e.setProperty(i,""):i==="float"?e.cssFloat="":e[i]="");for(var s in t)i=t[s],t.hasOwnProperty(s)&&n[s]!==i&&fy(e,s,i)}else for(var a in t)t.hasOwnProperty(a)&&fy(e,a,t[a])}function nm(e){if(e.indexOf("-")===-1)return!1;switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var EM=new Map([["acceptCharset","accept-charset"],["htmlFor","for"],["httpEquiv","http-equiv"],["crossOrigin","crossorigin"],["accentHeight","accent-height"],["alignmentBaseline","alignment-baseline"],["arabicForm","arabic-form"],["baselineShift","baseline-shift"],["capHeight","cap-height"],["clipPath","clip-path"],["clipRule","clip-rule"],["colorInterpolation","color-interpolation"],["colorInterpolationFilters","color-interpolation-filters"],["colorProfile","color-profile"],["colorRendering","color-rendering"],["dominantBaseline","dominant-baseline"],["enableBackground","enable-background"],["fillOpacity","fill-opacity"],["fillRule","fill-rule"],["floodColor","flood-color"],["floodOpacity","flood-opacity"],["fontFamily","font-family"],["fontSize","font-size"],["fontSizeAdjust","font-size-adjust"],["fontStretch","font-stretch"],["fontStyle","font-style"],["fontVariant","font-variant"],["fontWeight","font-weight"],["glyphName","glyph-name"],["glyphOrientationHorizontal","glyph-orientation-horizontal"],["glyphOrientationVertical","glyph-orientation-vertical"],["horizAdvX","horiz-adv-x"],["horizOriginX","horiz-origin-x"],["imageRendering","image-rendering"],["letterSpacing","letter-spacing"],["lightingColor","lighting-color"],["markerEnd","marker-end"],["markerMid","marker-mid"],["markerStart","marker-start"],["overlinePosition","overline-position"],["overlineThickness","overline-thickness"],["paintOrder","paint-order"],["panose-1","panose-1"],["pointerEvents","pointer-events"],["renderingIntent","rendering-intent"],["shapeRendering","shape-rendering"],["stopColor","stop-color"],["stopOpacity","stop-opacity"],["strikethroughPosition","strikethrough-position"],["strikethroughThickness","strikethrough-thickness"],["strokeDasharray","stroke-dasharray"],["strokeDashoffset","stroke-dashoffset"],["strokeLinecap","stroke-linecap"],["strokeLinejoin","stroke-linejoin"],["strokeMiterlimit","stroke-miterlimit"],["strokeOpacity","stroke-opacity"],["strokeWidth","stroke-width"],["textAnchor","text-anchor"],["textDecoration","text-decoration"],["textRendering","text-rendering"],["transformOrigin","transform-origin"],["underlinePosition","underline-position"],["underlineThickness","underline-thickness"],["unicodeBidi","unicode-bidi"],["unicodeRange","unicode-range"],["unitsPerEm","units-per-em"],["vAlphabetic","v-alphabetic"],["vHanging","v-hanging"],["vIdeographic","v-ideographic"],["vMathematical","v-mathematical"],["vectorEffect","vector-effect"],["vertAdvY","vert-adv-y"],["vertOriginX","vert-origin-x"],["vertOriginY","vert-origin-y"],["wordSpacing","word-spacing"],["writingMode","writing-mode"],["xmlnsXlink","xmlns:xlink"],["xHeight","x-height"]]),TM=/^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;function Kc(e){return TM.test(""+e)?"javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')":e}function xs(){}var dp=null;function im(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var Dr=null,Hr=null;function dy(e){var t=so(e);if(t&&(e=t.stateNode)){var n=e[Hn]||null;t:switch(e=t.stateNode,t.type){case"input":if(hp(e,n.value,n.defaultValue,n.defaultValue,n.checked,n.defaultChecked,n.type,n.name),t=n.name,n.type==="radio"&&t!=null){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll('input[name="'+mi(""+t)+'"][type="radio"]'),t=0;t<n.length;t++){var i=n[t];if(i!==e&&i.form===e.form){var s=i[Hn]||null;if(!s)throw Error(tt(90));hp(i,s.value,s.defaultValue,s.defaultValue,s.checked,s.defaultChecked,s.type,s.name)}}for(t=0;t<n.length;t++)i=n[t],i.form===e.form&&Yx(i)}break t;case"textarea":Kx(e,n.value,n.defaultValue);break t;case"select":t=n.value,t!=null&&kr(e,!!n.multiple,t,!1)}}}var wd=!1;function jx(e,t,n){if(wd)return e(t,n);wd=!0;try{var i=e(t);return i}finally{if(wd=!1,(Dr!==null||Hr!==null)&&(Ju(),Dr&&(t=Dr,e=Hr,Hr=Dr=null,dy(t),e)))for(t=0;t<e.length;t++)dy(e[t])}}function ml(e,t){var n=e.stateNode;if(n===null)return null;var i=n[Hn]||null;if(i===null)return null;n=i[t];t:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(i=!i.disabled)||(e=e.type,i=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!i;break t;default:e=!1}if(e)return null;if(n&&typeof n!="function")throw Error(tt(231,t,typeof n));return n}var Ms=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),pp=!1;if(Ms)try{Sr={},Object.defineProperty(Sr,"passive",{get:function(){pp=!0}}),window.addEventListener("test",Sr,Sr),window.removeEventListener("test",Sr,Sr)}catch{pp=!1}var Sr,Js=null,sm=null,Jc=null;function $x(){if(Jc)return Jc;var e,t=sm,n=t.length,i,s="value"in Js?Js.value:Js.textContent,a=s.length;for(e=0;e<n&&t[e]===s[e];e++);var r=n-e;for(i=1;i<=r&&t[n-i]===s[a-i];i++);return Jc=s.slice(e,1<i?1-i:void 0)}function Qc(e){var t=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function Ic(){return!0}function py(){return!1}function Vn(e){function t(n,i,s,a,r){this._reactName=n,this._targetInst=s,this.type=i,this.nativeEvent=a,this.target=r,this.currentTarget=null;for(var o in e)e.hasOwnProperty(o)&&(n=e[o],this[o]=n?n(a):a[o]);return this.isDefaultPrevented=(a.defaultPrevented!=null?a.defaultPrevented:a.returnValue===!1)?Ic:py,this.isPropagationStopped=py,this}return Ce(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=Ic)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=Ic)},persist:function(){},isPersistent:Ic}),t}var Qa={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Fu=Vn(Qa),Ul=Ce({},Qa,{view:0,detail:0}),AM=Vn(Ul),Cd,Rd,Wo,ku=Ce({},Ul,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:am,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==Wo&&(Wo&&e.type==="mousemove"?(Cd=e.screenX-Wo.screenX,Rd=e.screenY-Wo.screenY):Rd=Cd=0,Wo=e),Cd)},movementY:function(e){return"movementY"in e?e.movementY:Rd}}),my=Vn(ku),wM=Ce({},ku,{dataTransfer:0}),CM=Vn(wM),RM=Ce({},Ul,{relatedTarget:0}),Dd=Vn(RM),DM=Ce({},Qa,{animationName:0,elapsedTime:0,pseudoElement:0}),NM=Vn(DM),LM=Ce({},Qa,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),UM=Vn(LM),OM=Ce({},Qa,{data:0}),gy=Vn(OM),IM={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},PM={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},BM={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function zM(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=BM[e])?!!t[e]:!1}function am(){return zM}var FM=Ce({},Ul,{key:function(e){if(e.key){var t=IM[e.key]||e.key;if(t!=="Unidentified")return t}return e.type==="keypress"?(e=Qc(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?PM[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:am,charCode:function(e){return e.type==="keypress"?Qc(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?Qc(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),kM=Vn(FM),HM=Ce({},ku,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),yy=Vn(HM),VM=Ce({},Ul,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:am}),GM=Vn(VM),WM=Ce({},Qa,{propertyName:0,elapsedTime:0,pseudoElement:0}),XM=Vn(WM),qM=Ce({},ku,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),YM=Vn(qM),ZM=Ce({},Qa,{newState:0,oldState:0}),KM=Vn(ZM),JM=[9,13,27,32],rm=Ms&&"CompositionEvent"in window,el=null;Ms&&"documentMode"in document&&(el=document.documentMode);var QM=Ms&&"TextEvent"in window&&!el,tv=Ms&&(!rm||el&&8<el&&11>=el),xy=" ",vy=!1;function ev(e,t){switch(e){case"keyup":return JM.indexOf(t.keyCode)!==-1;case"keydown":return t.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function nv(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var Nr=!1;function jM(e,t){switch(e){case"compositionend":return nv(t);case"keypress":return t.which!==32?null:(vy=!0,xy);case"textInput":return e=t.data,e===xy&&vy?null:e;default:return null}}function $M(e,t){if(Nr)return e==="compositionend"||!rm&&ev(e,t)?(e=$x(),Jc=sm=Js=null,Nr=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return tv&&t.locale!=="ko"?null:t.data;default:return null}}var tE={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function _y(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t==="input"?!!tE[e.type]:t==="textarea"}function iv(e,t,n,i){Dr?Hr?Hr.push(i):Hr=[i]:Dr=i,t=Nu(t,"onChange"),0<t.length&&(n=new Fu("onChange","change",null,n,i),e.push({event:n,listeners:t}))}var nl=null,gl=null;function eE(e){j_(e,0)}function Hu(e){var t=jo(e);if(Yx(t))return e}function by(e,t){if(e==="change")return t}var sv=!1;Ms&&(Ms?(Bc="oninput"in document,Bc||(Nd=document.createElement("div"),Nd.setAttribute("oninput","return;"),Bc=typeof Nd.oninput=="function"),Pc=Bc):Pc=!1,sv=Pc&&(!document.documentMode||9<document.documentMode));var Pc,Bc,Nd;function Sy(){nl&&(nl.detachEvent("onpropertychange",av),gl=nl=null)}function av(e){if(e.propertyName==="value"&&Hu(gl)){var t=[];iv(t,gl,e,im(e)),jx(eE,t)}}function nE(e,t,n){e==="focusin"?(Sy(),nl=t,gl=n,nl.attachEvent("onpropertychange",av)):e==="focusout"&&Sy()}function iE(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return Hu(gl)}function sE(e,t){if(e==="click")return Hu(t)}function aE(e,t){if(e==="input"||e==="change")return Hu(t)}function rE(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var ni=typeof Object.is=="function"?Object.is:rE;function yl(e,t){if(ni(e,t))return!0;if(typeof e!="object"||e===null||typeof t!="object"||t===null)return!1;var n=Object.keys(e),i=Object.keys(t);if(n.length!==i.length)return!1;for(i=0;i<n.length;i++){var s=n[i];if(!lp.call(t,s)||!ni(e[s],t[s]))return!1}return!0}function My(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function Ey(e,t){var n=My(e);e=0;for(var i;n;){if(n.nodeType===3){if(i=e+n.textContent.length,e<=t&&i>=t)return{node:n,offset:t-e};e=i}t:{for(;n;){if(n.nextSibling){n=n.nextSibling;break t}n=n.parentNode}n=void 0}n=My(n)}}function rv(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?rv(e,t.parentNode):"contains"in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function ov(e){e=e!=null&&e.ownerDocument!=null&&e.ownerDocument.defaultView!=null?e.ownerDocument.defaultView:window;for(var t=du(e.document);t instanceof e.HTMLIFrameElement;){try{var n=typeof t.contentWindow.location.href=="string"}catch{n=!1}if(n)e=t.contentWindow;else break;t=du(e.document)}return t}function om(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||t==="textarea"||e.contentEditable==="true")}var oE=Ms&&"documentMode"in document&&11>=document.documentMode,Lr=null,mp=null,il=null,gp=!1;function Ty(e,t,n){var i=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;gp||Lr==null||Lr!==du(i)||(i=Lr,"selectionStart"in i&&om(i)?i={start:i.selectionStart,end:i.selectionEnd}:(i=(i.ownerDocument&&i.ownerDocument.defaultView||window).getSelection(),i={anchorNode:i.anchorNode,anchorOffset:i.anchorOffset,focusNode:i.focusNode,focusOffset:i.focusOffset}),il&&yl(il,i)||(il=i,i=Nu(mp,"onSelect"),0<i.length&&(t=new Fu("onSelect","select",null,t,n),e.push({event:t,listeners:i}),t.target=Lr)))}function Ia(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n["Webkit"+e]="webkit"+t,n["Moz"+e]="moz"+t,n}var Ur={animationend:Ia("Animation","AnimationEnd"),animationiteration:Ia("Animation","AnimationIteration"),animationstart:Ia("Animation","AnimationStart"),transitionrun:Ia("Transition","TransitionRun"),transitionstart:Ia("Transition","TransitionStart"),transitioncancel:Ia("Transition","TransitionCancel"),transitionend:Ia("Transition","TransitionEnd")},Ld={},lv={};Ms&&(lv=document.createElement("div").style,"AnimationEvent"in window||(delete Ur.animationend.animation,delete Ur.animationiteration.animation,delete Ur.animationstart.animation),"TransitionEvent"in window||delete Ur.transitionend.transition);function ja(e){if(Ld[e])return Ld[e];if(!Ur[e])return e;var t=Ur[e],n;for(n in t)if(t.hasOwnProperty(n)&&n in lv)return Ld[e]=t[n];return e}var cv=ja("animationend"),uv=ja("animationiteration"),hv=ja("animationstart"),lE=ja("transitionrun"),cE=ja("transitionstart"),uE=ja("transitioncancel"),fv=ja("transitionend"),dv=new Map,yp="abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");yp.push("scrollEnd");function Ni(e,t){dv.set(e,t),Ja(t,[e])}var pu=typeof reportError=="function"?reportError:function(e){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var t=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof e=="object"&&e!==null&&typeof e.message=="string"?String(e.message):String(e),error:e});if(!window.dispatchEvent(t))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",e);return}console.error(e)},hi=[],Or=0,lm=0;function Vu(){for(var e=Or,t=lm=Or=0;t<e;){var n=hi[t];hi[t++]=null;var i=hi[t];hi[t++]=null;var s=hi[t];hi[t++]=null;var a=hi[t];if(hi[t++]=null,i!==null&&s!==null){var r=i.pending;r===null?s.next=s:(s.next=r.next,r.next=s),i.pending=s}a!==0&&pv(n,s,a)}}function Gu(e,t,n,i){hi[Or++]=e,hi[Or++]=t,hi[Or++]=n,hi[Or++]=i,lm|=i,e.lanes|=i,e=e.alternate,e!==null&&(e.lanes|=i)}function cm(e,t,n,i){return Gu(e,t,n,i),mu(e)}function $a(e,t){return Gu(e,null,null,t),mu(e)}function pv(e,t,n){e.lanes|=n;var i=e.alternate;i!==null&&(i.lanes|=n);for(var s=!1,a=e.return;a!==null;)a.childLanes|=n,i=a.alternate,i!==null&&(i.childLanes|=n),a.tag===22&&(e=a.stateNode,e===null||e._visibility&1||(s=!0)),e=a,a=a.return;return e.tag===3?(a=e.stateNode,s&&t!==null&&(s=31-ti(n),e=a.hiddenUpdates,i=e[s],i===null?e[s]=[t]:i.push(t),t.lane=n|536870912),a):null}function mu(e){if(50<fl)throw fl=0,zp=null,Error(tt(185));for(var t=e.return;t!==null;)e=t,t=e.return;return e.tag===3?e.stateNode:null}var Ir={};function hE(e,t,n,i){this.tag=e,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.refCleanup=this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=i,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Jn(e,t,n,i){return new hE(e,t,n,i)}function um(e){return e=e.prototype,!(!e||!e.isReactComponent)}function _s(e,t){var n=e.alternate;return n===null?(n=Jn(e.tag,t,e.key,e.mode),n.elementType=e.elementType,n.type=e.type,n.stateNode=e.stateNode,n.alternate=e,e.alternate=n):(n.pendingProps=t,n.type=e.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=e.flags&65011712,n.childLanes=e.childLanes,n.lanes=e.lanes,n.child=e.child,n.memoizedProps=e.memoizedProps,n.memoizedState=e.memoizedState,n.updateQueue=e.updateQueue,t=e.dependencies,n.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},n.sibling=e.sibling,n.index=e.index,n.ref=e.ref,n.refCleanup=e.refCleanup,n}function mv(e,t){e.flags&=65011714;var n=e.alternate;return n===null?(e.childLanes=0,e.lanes=t,e.child=null,e.subtreeFlags=0,e.memoizedProps=null,e.memoizedState=null,e.updateQueue=null,e.dependencies=null,e.stateNode=null):(e.childLanes=n.childLanes,e.lanes=n.lanes,e.child=n.child,e.subtreeFlags=0,e.deletions=null,e.memoizedProps=n.memoizedProps,e.memoizedState=n.memoizedState,e.updateQueue=n.updateQueue,e.type=n.type,t=n.dependencies,e.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext}),e}function jc(e,t,n,i,s,a){var r=0;if(i=e,typeof e=="function")um(e)&&(r=1);else if(typeof e=="string")r=pT(e,n,Ji.current)?26:e==="html"||e==="head"||e==="body"?27:5;else t:switch(e){case sp:return e=Jn(31,n,t,s),e.elementType=sp,e.lanes=a,e;case wr:return Ha(n.children,s,a,t);case Ox:r=8,s|=24;break;case ep:return e=Jn(12,n,t,s|2),e.elementType=ep,e.lanes=a,e;case np:return e=Jn(13,n,t,s),e.elementType=np,e.lanes=a,e;case ip:return e=Jn(19,n,t,s),e.elementType=ip,e.lanes=a,e;default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case ys:r=10;break t;case Ix:r=9;break t;case Jp:r=11;break t;case Qp:r=14;break t;case Gs:r=16,i=null;break t}r=29,n=Error(tt(130,e===null?"null":typeof e,"")),i=null}return t=Jn(r,n,t,s),t.elementType=e,t.type=i,t.lanes=a,t}function Ha(e,t,n,i){return e=Jn(7,e,i,t),e.lanes=n,e}function Ud(e,t,n){return e=Jn(6,e,null,t),e.lanes=n,e}function gv(e){var t=Jn(18,null,null,0);return t.stateNode=e,t}function Od(e,t,n){return t=Jn(4,e.children!==null?e.children:[],e.key,t),t.lanes=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}var Ay=new WeakMap;function gi(e,t){if(typeof e=="object"&&e!==null){var n=Ay.get(e);return n!==void 0?n:(t={value:e,source:t,stack:oy(t)},Ay.set(e,t),t)}return{value:e,source:t,stack:oy(t)}}var Pr=[],Br=0,gu=null,xl=0,di=[],pi=0,ca=null,Yi=1,Zi="";function ms(e,t){Pr[Br++]=xl,Pr[Br++]=gu,gu=e,xl=t}function yv(e,t,n){di[pi++]=Yi,di[pi++]=Zi,di[pi++]=ca,ca=e;var i=Yi;e=Zi;var s=32-ti(i)-1;i&=~(1<<s),n+=1;var a=32-ti(t)+s;if(30<a){var r=s-s%5;a=(i&(1<<r)-1).toString(32),i>>=r,s-=r,Yi=1<<32-ti(t)+s|n<<s|i,Zi=a+e}else Yi=1<<a|n<<s|i,Zi=e}function hm(e){e.return!==null&&(ms(e,1),yv(e,1,0))}function fm(e){for(;e===gu;)gu=Pr[--Br],Pr[Br]=null,xl=Pr[--Br],Pr[Br]=null;for(;e===ca;)ca=di[--pi],di[pi]=null,Zi=di[--pi],di[pi]=null,Yi=di[--pi],di[pi]=null}function xv(e,t){di[pi++]=Yi,di[pi++]=Zi,di[pi++]=ca,Yi=t.id,Zi=t.overflow,ca=e}var gn=null,we=null,$t=!1,ea=null,yi=!1,xp=Error(tt(519));function ua(e){var t=Error(tt(418,1<arguments.length&&arguments[1]!==void 0&&arguments[1]?"text":"HTML",""));throw vl(gi(t,e)),xp}function wy(e){var t=e.stateNode,n=e.type,i=e.memoizedProps;switch(t[mn]=e,t[Hn]=i,n){case"dialog":Zt("cancel",t),Zt("close",t);break;case"iframe":case"object":case"embed":Zt("load",t);break;case"video":case"audio":for(n=0;n<Ml.length;n++)Zt(Ml[n],t);break;case"source":Zt("error",t);break;case"img":case"image":case"link":Zt("error",t),Zt("load",t);break;case"details":Zt("toggle",t);break;case"input":Zt("invalid",t),Zx(t,i.value,i.defaultValue,i.checked,i.defaultChecked,i.type,i.name,!0);break;case"select":Zt("invalid",t);break;case"textarea":Zt("invalid",t),Jx(t,i.value,i.defaultValue,i.children)}n=i.children,typeof n!="string"&&typeof n!="number"&&typeof n!="bigint"||t.textContent===""+n||i.suppressHydrationWarning===!0||tb(t.textContent,n)?(i.popover!=null&&(Zt("beforetoggle",t),Zt("toggle",t)),i.onScroll!=null&&Zt("scroll",t),i.onScrollEnd!=null&&Zt("scrollend",t),i.onClick!=null&&(t.onclick=xs),t=!0):t=!1,t||ua(e,!0)}function Cy(e){for(gn=e.return;gn;)switch(gn.tag){case 5:case 31:case 13:yi=!1;return;case 27:case 3:yi=!0;return;default:gn=gn.return}}function Mr(e){if(e!==gn)return!1;if(!$t)return Cy(e),$t=!0,!1;var t=e.tag,n;if((n=t!==3&&t!==27)&&((n=t===5)&&(n=e.type,n=!(n!=="form"&&n!=="button")||Gp(e.type,e.memoizedProps)),n=!n),n&&we&&ua(e),Cy(e),t===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(tt(317));we=gx(e)}else if(t===31){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(tt(317));we=gx(e)}else t===27?(t=we,pa(e.type)?(e=Yp,Yp=null,we=e):we=t):we=gn?vi(e.stateNode.nextSibling):null;return!0}function Xa(){we=gn=null,$t=!1}function Id(){var e=ea;return e!==null&&(Fn===null?Fn=e:Fn.push.apply(Fn,e),ea=null),e}function vl(e){ea===null?ea=[e]:ea.push(e)}var vp=Qi(null),tr=null,vs=null;function Xs(e,t,n){Me(vp,t._currentValue),t._currentValue=n}function bs(e){e._currentValue=vp.current,hn(vp)}function _p(e,t,n){for(;e!==null;){var i=e.alternate;if((e.childLanes&t)!==t?(e.childLanes|=t,i!==null&&(i.childLanes|=t)):i!==null&&(i.childLanes&t)!==t&&(i.childLanes|=t),e===n)break;e=e.return}}function bp(e,t,n,i){var s=e.child;for(s!==null&&(s.return=e);s!==null;){var a=s.dependencies;if(a!==null){var r=s.child;a=a.firstContext;t:for(;a!==null;){var o=a;a=s;for(var l=0;l<t.length;l++)if(o.context===t[l]){a.lanes|=n,o=a.alternate,o!==null&&(o.lanes|=n),_p(a.return,n,e),i||(r=null);break t}a=o.next}}else if(s.tag===18){if(r=s.return,r===null)throw Error(tt(341));r.lanes|=n,a=r.alternate,a!==null&&(a.lanes|=n),_p(r,n,e),r=null}else r=s.child;if(r!==null)r.return=s;else for(r=s;r!==null;){if(r===e){r=null;break}if(s=r.sibling,s!==null){s.return=r.return,r=s;break}r=r.return}s=r}}function ao(e,t,n,i){e=null;for(var s=t,a=!1;s!==null;){if(!a){if((s.flags&524288)!==0)a=!0;else if((s.flags&262144)!==0)break}if(s.tag===10){var r=s.alternate;if(r===null)throw Error(tt(387));if(r=r.memoizedProps,r!==null){var o=s.type;ni(s.pendingProps.value,r.value)||(e!==null?e.push(o):e=[o])}}else if(s===cu.current){if(r=s.alternate,r===null)throw Error(tt(387));r.memoizedState.memoizedState!==s.memoizedState.memoizedState&&(e!==null?e.push(Tl):e=[Tl])}s=s.return}e!==null&&bp(t,e,n,i),t.flags|=262144}function yu(e){for(e=e.firstContext;e!==null;){if(!ni(e.context._currentValue,e.memoizedValue))return!0;e=e.next}return!1}function qa(e){tr=e,vs=null,e=e.dependencies,e!==null&&(e.firstContext=null)}function yn(e){return vv(tr,e)}function zc(e,t){return tr===null&&qa(e),vv(e,t)}function vv(e,t){var n=t._currentValue;if(t={context:t,memoizedValue:n,next:null},vs===null){if(e===null)throw Error(tt(308));vs=t,e.dependencies={lanes:0,firstContext:t},e.flags|=524288}else vs=vs.next=t;return n}var fE=typeof AbortController<"u"?AbortController:function(){var e=[],t=this.signal={aborted:!1,addEventListener:function(n,i){e.push(i)}};this.abort=function(){t.aborted=!0,e.forEach(function(n){return n()})}},dE=nn.unstable_scheduleCallback,pE=nn.unstable_NormalPriority,Qe={$$typeof:ys,Consumer:null,Provider:null,_currentValue:null,_currentValue2:null,_threadCount:0};function dm(){return{controller:new fE,data:new Map,refCount:0}}function Ol(e){e.refCount--,e.refCount===0&&dE(pE,function(){e.controller.abort()})}var sl=null,Sp=0,Kr=0,Vr=null;function mE(e,t){if(sl===null){var n=sl=[];Sp=0,Kr=zm(),Vr={status:"pending",value:void 0,then:function(i){n.push(i)}}}return Sp++,t.then(Ry,Ry),t}function Ry(){if(--Sp===0&&sl!==null){Vr!==null&&(Vr.status="fulfilled");var e=sl;sl=null,Kr=0,Vr=null;for(var t=0;t<e.length;t++)(0,e[t])()}}function gE(e,t){var n=[],i={status:"pending",value:null,reason:null,then:function(s){n.push(s)}};return e.then(function(){i.status="fulfilled",i.value=t;for(var s=0;s<n.length;s++)(0,n[s])(t)},function(s){for(i.status="rejected",i.reason=s,s=0;s<n.length;s++)(0,n[s])(void 0)}),i}var Dy=Lt.S;Lt.S=function(e,t){U_=jn(),typeof t=="object"&&t!==null&&typeof t.then=="function"&&mE(e,t),Dy!==null&&Dy(e,t)};var Va=Qi(null);function pm(){var e=Va.current;return e!==null?e:ve.pooledCache}function $c(e,t){t===null?Me(Va,Va.current):Me(Va,t.pool)}function _v(){var e=pm();return e===null?null:{parent:Qe._currentValue,pool:e}}var ro=Error(tt(460)),mm=Error(tt(474)),Wu=Error(tt(542)),xu={then:function(){}};function Ny(e){return e=e.status,e==="fulfilled"||e==="rejected"}function bv(e,t,n){switch(n=e[n],n===void 0?e.push(t):n!==t&&(t.then(xs,xs),t=n),t.status){case"fulfilled":return t.value;case"rejected":throw e=t.reason,Uy(e),e;default:if(typeof t.status=="string")t.then(xs,xs);else{if(e=ve,e!==null&&100<e.shellSuspendCounter)throw Error(tt(482));e=t,e.status="pending",e.then(function(i){if(t.status==="pending"){var s=t;s.status="fulfilled",s.value=i}},function(i){if(t.status==="pending"){var s=t;s.status="rejected",s.reason=i}})}switch(t.status){case"fulfilled":return t.value;case"rejected":throw e=t.reason,Uy(e),e}throw Ga=t,ro}}function za(e){try{var t=e._init;return t(e._payload)}catch(n){throw n!==null&&typeof n=="object"&&typeof n.then=="function"?(Ga=n,ro):n}}var Ga=null;function Ly(){if(Ga===null)throw Error(tt(459));var e=Ga;return Ga=null,e}function Uy(e){if(e===ro||e===Wu)throw Error(tt(483))}var Gr=null,_l=0;function Fc(e){var t=_l;return _l+=1,Gr===null&&(Gr=[]),bv(Gr,e,t)}function Xo(e,t){t=t.props.ref,e.ref=t!==void 0?t:null}function kc(e,t){throw t.$$typeof===nM?Error(tt(525)):(e=Object.prototype.toString.call(t),Error(tt(31,e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e)))}function Sv(e){function t(p,y){if(e){var S=p.deletions;S===null?(p.deletions=[y],p.flags|=16):S.push(y)}}function n(p,y){if(!e)return null;for(;y!==null;)t(p,y),y=y.sibling;return null}function i(p){for(var y=new Map;p!==null;)p.key!==null?y.set(p.key,p):y.set(p.index,p),p=p.sibling;return y}function s(p,y){return p=_s(p,y),p.index=0,p.sibling=null,p}function a(p,y,S){return p.index=S,e?(S=p.alternate,S!==null?(S=S.index,S<y?(p.flags|=67108866,y):S):(p.flags|=67108866,y)):(p.flags|=1048576,y)}function r(p){return e&&p.alternate===null&&(p.flags|=67108866),p}function o(p,y,S,v){return y===null||y.tag!==6?(y=Ud(S,p.mode,v),y.return=p,y):(y=s(y,S),y.return=p,y)}function l(p,y,S,v){var E=S.type;return E===wr?u(p,y,S.props.children,v,S.key):y!==null&&(y.elementType===E||typeof E=="object"&&E!==null&&E.$$typeof===Gs&&za(E)===y.type)?(y=s(y,S.props),Xo(y,S),y.return=p,y):(y=jc(S.type,S.key,S.props,null,p.mode,v),Xo(y,S),y.return=p,y)}function c(p,y,S,v){return y===null||y.tag!==4||y.stateNode.containerInfo!==S.containerInfo||y.stateNode.implementation!==S.implementation?(y=Od(S,p.mode,v),y.return=p,y):(y=s(y,S.children||[]),y.return=p,y)}function u(p,y,S,v,E){return y===null||y.tag!==7?(y=Ha(S,p.mode,v,E),y.return=p,y):(y=s(y,S),y.return=p,y)}function f(p,y,S){if(typeof y=="string"&&y!==""||typeof y=="number"||typeof y=="bigint")return y=Ud(""+y,p.mode,S),y.return=p,y;if(typeof y=="object"&&y!==null){switch(y.$$typeof){case Dc:return S=jc(y.type,y.key,y.props,null,p.mode,S),Xo(S,y),S.return=p,S;case Jo:return y=Od(y,p.mode,S),y.return=p,y;case Gs:return y=za(y),f(p,y,S)}if(Qo(y)||Go(y))return y=Ha(y,p.mode,S,null),y.return=p,y;if(typeof y.then=="function")return f(p,Fc(y),S);if(y.$$typeof===ys)return f(p,zc(p,y),S);kc(p,y)}return null}function h(p,y,S,v){var E=y!==null?y.key:null;if(typeof S=="string"&&S!==""||typeof S=="number"||typeof S=="bigint")return E!==null?null:o(p,y,""+S,v);if(typeof S=="object"&&S!==null){switch(S.$$typeof){case Dc:return S.key===E?l(p,y,S,v):null;case Jo:return S.key===E?c(p,y,S,v):null;case Gs:return S=za(S),h(p,y,S,v)}if(Qo(S)||Go(S))return E!==null?null:u(p,y,S,v,null);if(typeof S.then=="function")return h(p,y,Fc(S),v);if(S.$$typeof===ys)return h(p,y,zc(p,S),v);kc(p,S)}return null}function d(p,y,S,v,E){if(typeof v=="string"&&v!==""||typeof v=="number"||typeof v=="bigint")return p=p.get(S)||null,o(y,p,""+v,E);if(typeof v=="object"&&v!==null){switch(v.$$typeof){case Dc:return p=p.get(v.key===null?S:v.key)||null,l(y,p,v,E);case Jo:return p=p.get(v.key===null?S:v.key)||null,c(y,p,v,E);case Gs:return v=za(v),d(p,y,S,v,E)}if(Qo(v)||Go(v))return p=p.get(S)||null,u(y,p,v,E,null);if(typeof v.then=="function")return d(p,y,S,Fc(v),E);if(v.$$typeof===ys)return d(p,y,S,zc(y,v),E);kc(y,v)}return null}function m(p,y,S,v){for(var E=null,T=null,C=y,x=y=0,A=null;C!==null&&x<S.length;x++){C.index>x?(A=C,C=null):A=C.sibling;var R=h(p,C,S[x],v);if(R===null){C===null&&(C=A);break}e&&C&&R.alternate===null&&t(p,C),y=a(R,y,x),T===null?E=R:T.sibling=R,T=R,C=A}if(x===S.length)return n(p,C),$t&&ms(p,x),E;if(C===null){for(;x<S.length;x++)C=f(p,S[x],v),C!==null&&(y=a(C,y,x),T===null?E=C:T.sibling=C,T=C);return $t&&ms(p,x),E}for(C=i(C);x<S.length;x++)A=d(C,p,x,S[x],v),A!==null&&(e&&A.alternate!==null&&C.delete(A.key===null?x:A.key),y=a(A,y,x),T===null?E=A:T.sibling=A,T=A);return e&&C.forEach(function(O){return t(p,O)}),$t&&ms(p,x),E}function b(p,y,S,v){if(S==null)throw Error(tt(151));for(var E=null,T=null,C=y,x=y=0,A=null,R=S.next();C!==null&&!R.done;x++,R=S.next()){C.index>x?(A=C,C=null):A=C.sibling;var O=h(p,C,R.value,v);if(O===null){C===null&&(C=A);break}e&&C&&O.alternate===null&&t(p,C),y=a(O,y,x),T===null?E=O:T.sibling=O,T=O,C=A}if(R.done)return n(p,C),$t&&ms(p,x),E;if(C===null){for(;!R.done;x++,R=S.next())R=f(p,R.value,v),R!==null&&(y=a(R,y,x),T===null?E=R:T.sibling=R,T=R);return $t&&ms(p,x),E}for(C=i(C);!R.done;x++,R=S.next())R=d(C,p,x,R.value,v),R!==null&&(e&&R.alternate!==null&&C.delete(R.key===null?x:R.key),y=a(R,y,x),T===null?E=R:T.sibling=R,T=R);return e&&C.forEach(function(F){return t(p,F)}),$t&&ms(p,x),E}function g(p,y,S,v){if(typeof S=="object"&&S!==null&&S.type===wr&&S.key===null&&(S=S.props.children),typeof S=="object"&&S!==null){switch(S.$$typeof){case Dc:t:{for(var E=S.key;y!==null;){if(y.key===E){if(E=S.type,E===wr){if(y.tag===7){n(p,y.sibling),v=s(y,S.props.children),v.return=p,p=v;break t}}else if(y.elementType===E||typeof E=="object"&&E!==null&&E.$$typeof===Gs&&za(E)===y.type){n(p,y.sibling),v=s(y,S.props),Xo(v,S),v.return=p,p=v;break t}n(p,y);break}else t(p,y);y=y.sibling}S.type===wr?(v=Ha(S.props.children,p.mode,v,S.key),v.return=p,p=v):(v=jc(S.type,S.key,S.props,null,p.mode,v),Xo(v,S),v.return=p,p=v)}return r(p);case Jo:t:{for(E=S.key;y!==null;){if(y.key===E)if(y.tag===4&&y.stateNode.containerInfo===S.containerInfo&&y.stateNode.implementation===S.implementation){n(p,y.sibling),v=s(y,S.children||[]),v.return=p,p=v;break t}else{n(p,y);break}else t(p,y);y=y.sibling}v=Od(S,p.mode,v),v.return=p,p=v}return r(p);case Gs:return S=za(S),g(p,y,S,v)}if(Qo(S))return m(p,y,S,v);if(Go(S)){if(E=Go(S),typeof E!="function")throw Error(tt(150));return S=E.call(S),b(p,y,S,v)}if(typeof S.then=="function")return g(p,y,Fc(S),v);if(S.$$typeof===ys)return g(p,y,zc(p,S),v);kc(p,S)}return typeof S=="string"&&S!==""||typeof S=="number"||typeof S=="bigint"?(S=""+S,y!==null&&y.tag===6?(n(p,y.sibling),v=s(y,S),v.return=p,p=v):(n(p,y),v=Ud(S,p.mode,v),v.return=p,p=v),r(p)):n(p,y)}return function(p,y,S,v){try{_l=0;var E=g(p,y,S,v);return Gr=null,E}catch(C){if(C===ro||C===Wu)throw C;var T=Jn(29,C,null,p.mode);return T.lanes=v,T.return=p,T}}}var Ya=Sv(!0),Mv=Sv(!1),Ws=!1;function gm(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,lanes:0,hiddenCallbacks:null},callbacks:null}}function Mp(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,callbacks:null})}function na(e){return{lane:e,tag:0,payload:null,callback:null,next:null}}function ia(e,t,n){var i=e.updateQueue;if(i===null)return null;if(i=i.shared,(oe&2)!==0){var s=i.pending;return s===null?t.next=t:(t.next=s.next,s.next=t),i.pending=t,t=mu(e),pv(e,null,n),t}return Gu(e,i,t,n),mu(e)}function al(e,t,n){if(t=t.updateQueue,t!==null&&(t=t.shared,(n&4194048)!==0)){var i=t.lanes;i&=e.pendingLanes,n|=i,t.lanes=n,Hx(e,n)}}function Pd(e,t){var n=e.updateQueue,i=e.alternate;if(i!==null&&(i=i.updateQueue,n===i)){var s=null,a=null;if(n=n.firstBaseUpdate,n!==null){do{var r={lane:n.lane,tag:n.tag,payload:n.payload,callback:null,next:null};a===null?s=a=r:a=a.next=r,n=n.next}while(n!==null);a===null?s=a=t:a=a.next=t}else s=a=t;n={baseState:i.baseState,firstBaseUpdate:s,lastBaseUpdate:a,shared:i.shared,callbacks:i.callbacks},e.updateQueue=n;return}e=n.lastBaseUpdate,e===null?n.firstBaseUpdate=t:e.next=t,n.lastBaseUpdate=t}var Ep=!1;function rl(){if(Ep){var e=Vr;if(e!==null)throw e}}function ol(e,t,n,i){Ep=!1;var s=e.updateQueue;Ws=!1;var a=s.firstBaseUpdate,r=s.lastBaseUpdate,o=s.shared.pending;if(o!==null){s.shared.pending=null;var l=o,c=l.next;l.next=null,r===null?a=c:r.next=c,r=l;var u=e.alternate;u!==null&&(u=u.updateQueue,o=u.lastBaseUpdate,o!==r&&(o===null?u.firstBaseUpdate=c:o.next=c,u.lastBaseUpdate=l))}if(a!==null){var f=s.baseState;r=0,u=c=l=null,o=a;do{var h=o.lane&-536870913,d=h!==o.lane;if(d?(Qt&h)===h:(i&h)===h){h!==0&&h===Kr&&(Ep=!0),u!==null&&(u=u.next={lane:0,tag:o.tag,payload:o.payload,callback:null,next:null});t:{var m=e,b=o;h=t;var g=n;switch(b.tag){case 1:if(m=b.payload,typeof m=="function"){f=m.call(g,f,h);break t}f=m;break t;case 3:m.flags=m.flags&-65537|128;case 0:if(m=b.payload,h=typeof m=="function"?m.call(g,f,h):m,h==null)break t;f=Ce({},f,h);break t;case 2:Ws=!0}}h=o.callback,h!==null&&(e.flags|=64,d&&(e.flags|=8192),d=s.callbacks,d===null?s.callbacks=[h]:d.push(h))}else d={lane:h,tag:o.tag,payload:o.payload,callback:o.callback,next:null},u===null?(c=u=d,l=f):u=u.next=d,r|=h;if(o=o.next,o===null){if(o=s.shared.pending,o===null)break;d=o,o=d.next,d.next=null,s.lastBaseUpdate=d,s.shared.pending=null}}while(!0);u===null&&(l=f),s.baseState=l,s.firstBaseUpdate=c,s.lastBaseUpdate=u,a===null&&(s.shared.lanes=0),fa|=r,e.lanes=r,e.memoizedState=f}}function Ev(e,t){if(typeof e!="function")throw Error(tt(191,e));e.call(t)}function Tv(e,t){var n=e.callbacks;if(n!==null)for(e.callbacks=null,e=0;e<n.length;e++)Ev(n[e],t)}var Jr=Qi(null),vu=Qi(0);function Oy(e,t){e=ws,Me(vu,e),Me(Jr,t),ws=e|t.baseLanes}function Tp(){Me(vu,ws),Me(Jr,Jr.current)}function ym(){ws=vu.current,hn(Jr),hn(vu)}var ii=Qi(null),xi=null;function qs(e){var t=e.alternate;Me(He,He.current&1),Me(ii,e),xi===null&&(t===null||Jr.current!==null||t.memoizedState!==null)&&(xi=e)}function Ap(e){Me(He,He.current),Me(ii,e),xi===null&&(xi=e)}function Av(e){e.tag===22?(Me(He,He.current),Me(ii,e),xi===null&&(xi=e)):Ys(e)}function Ys(){Me(He,He.current),Me(ii,ii.current)}function Kn(e){hn(ii),xi===e&&(xi=null),hn(He)}var He=Qi(0);function _u(e){for(var t=e;t!==null;){if(t.tag===13){var n=t.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||Xp(n)||qp(n)))return t}else if(t.tag===19&&(t.memoizedProps.revealOrder==="forwards"||t.memoizedProps.revealOrder==="backwards"||t.memoizedProps.revealOrder==="unstable_legacy-backwards"||t.memoizedProps.revealOrder==="together")){if((t.flags&128)!==0)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var Es=0,Ft=null,ye=null,Ke=null,bu=!1,Wr=!1,Za=!1,Su=0,bl=0,Xr=null,yE=0;function Be(){throw Error(tt(321))}function xm(e,t){if(t===null)return!1;for(var n=0;n<t.length&&n<e.length;n++)if(!ni(e[n],t[n]))return!1;return!0}function vm(e,t,n,i,s,a){return Es=a,Ft=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,Lt.H=e===null||e.memoizedState===null?i_:Dm,Za=!1,a=n(i,s),Za=!1,Wr&&(a=Cv(t,n,i,s)),wv(e),a}function wv(e){Lt.H=Sl;var t=ye!==null&&ye.next!==null;if(Es=0,Ke=ye=Ft=null,bu=!1,bl=0,Xr=null,t)throw Error(tt(300));e===null||je||(e=e.dependencies,e!==null&&yu(e)&&(je=!0))}function Cv(e,t,n,i){Ft=e;var s=0;do{if(Wr&&(Xr=null),bl=0,Wr=!1,25<=s)throw Error(tt(301));if(s+=1,Ke=ye=null,e.updateQueue!=null){var a=e.updateQueue;a.lastEffect=null,a.events=null,a.stores=null,a.memoCache!=null&&(a.memoCache.index=0)}Lt.H=s_,a=t(n,i)}while(Wr);return a}function xE(){var e=Lt.H,t=e.useState()[0];return t=typeof t.then=="function"?Il(t):t,e=e.useState()[0],(ye!==null?ye.memoizedState:null)!==e&&(Ft.flags|=1024),t}function _m(){var e=Su!==0;return Su=0,e}function bm(e,t,n){t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~n}function Sm(e){if(bu){for(e=e.memoizedState;e!==null;){var t=e.queue;t!==null&&(t.pending=null),e=e.next}bu=!1}Es=0,Ke=ye=Ft=null,Wr=!1,bl=Su=0,Xr=null}function Nn(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Ke===null?Ft.memoizedState=Ke=e:Ke=Ke.next=e,Ke}function Ve(){if(ye===null){var e=Ft.alternate;e=e!==null?e.memoizedState:null}else e=ye.next;var t=Ke===null?Ft.memoizedState:Ke.next;if(t!==null)Ke=t,ye=e;else{if(e===null)throw Ft.alternate===null?Error(tt(467)):Error(tt(310));ye=e,e={memoizedState:ye.memoizedState,baseState:ye.baseState,baseQueue:ye.baseQueue,queue:ye.queue,next:null},Ke===null?Ft.memoizedState=Ke=e:Ke=Ke.next=e}return Ke}function Xu(){return{lastEffect:null,events:null,stores:null,memoCache:null}}function Il(e){var t=bl;return bl+=1,Xr===null&&(Xr=[]),e=bv(Xr,e,t),t=Ft,(Ke===null?t.memoizedState:Ke.next)===null&&(t=t.alternate,Lt.H=t===null||t.memoizedState===null?i_:Dm),e}function qu(e){if(e!==null&&typeof e=="object"){if(typeof e.then=="function")return Il(e);if(e.$$typeof===ys)return yn(e)}throw Error(tt(438,String(e)))}function Mm(e){var t=null,n=Ft.updateQueue;if(n!==null&&(t=n.memoCache),t==null){var i=Ft.alternate;i!==null&&(i=i.updateQueue,i!==null&&(i=i.memoCache,i!=null&&(t={data:i.data.map(function(s){return s.slice()}),index:0})))}if(t==null&&(t={data:[],index:0}),n===null&&(n=Xu(),Ft.updateQueue=n),n.memoCache=t,n=t.data[t.index],n===void 0)for(n=t.data[t.index]=Array(e),i=0;i<e;i++)n[i]=iM;return t.index++,n}function Ts(e,t){return typeof t=="function"?t(e):t}function tu(e){var t=Ve();return Em(t,ye,e)}function Em(e,t,n){var i=e.queue;if(i===null)throw Error(tt(311));i.lastRenderedReducer=n;var s=e.baseQueue,a=i.pending;if(a!==null){if(s!==null){var r=s.next;s.next=a.next,a.next=r}t.baseQueue=s=a,i.pending=null}if(a=e.baseState,s===null)e.memoizedState=a;else{t=s.next;var o=r=null,l=null,c=t,u=!1;do{var f=c.lane&-536870913;if(f!==c.lane?(Qt&f)===f:(Es&f)===f){var h=c.revertLane;if(h===0)l!==null&&(l=l.next={lane:0,revertLane:0,gesture:null,action:c.action,hasEagerState:c.hasEagerState,eagerState:c.eagerState,next:null}),f===Kr&&(u=!0);else if((Es&h)===h){c=c.next,h===Kr&&(u=!0);continue}else f={lane:0,revertLane:c.revertLane,gesture:null,action:c.action,hasEagerState:c.hasEagerState,eagerState:c.eagerState,next:null},l===null?(o=l=f,r=a):l=l.next=f,Ft.lanes|=h,fa|=h;f=c.action,Za&&n(a,f),a=c.hasEagerState?c.eagerState:n(a,f)}else h={lane:f,revertLane:c.revertLane,gesture:c.gesture,action:c.action,hasEagerState:c.hasEagerState,eagerState:c.eagerState,next:null},l===null?(o=l=h,r=a):l=l.next=h,Ft.lanes|=f,fa|=f;c=c.next}while(c!==null&&c!==t);if(l===null?r=a:l.next=o,!ni(a,e.memoizedState)&&(je=!0,u&&(n=Vr,n!==null)))throw n;e.memoizedState=a,e.baseState=r,e.baseQueue=l,i.lastRenderedState=a}return s===null&&(i.lanes=0),[e.memoizedState,i.dispatch]}function Bd(e){var t=Ve(),n=t.queue;if(n===null)throw Error(tt(311));n.lastRenderedReducer=e;var i=n.dispatch,s=n.pending,a=t.memoizedState;if(s!==null){n.pending=null;var r=s=s.next;do a=e(a,r.action),r=r.next;while(r!==s);ni(a,t.memoizedState)||(je=!0),t.memoizedState=a,t.baseQueue===null&&(t.baseState=a),n.lastRenderedState=a}return[a,i]}function Rv(e,t,n){var i=Ft,s=Ve(),a=$t;if(a){if(n===void 0)throw Error(tt(407));n=n()}else n=t();var r=!ni((ye||s).memoizedState,n);if(r&&(s.memoizedState=n,je=!0),s=s.queue,Tm(Lv.bind(null,i,s,e),[e]),s.getSnapshot!==t||r||Ke!==null&&Ke.memoizedState.tag&1){if(i.flags|=2048,Qr(9,{destroy:void 0},Nv.bind(null,i,s,n,t),null),ve===null)throw Error(tt(349));a||(Es&127)!==0||Dv(i,t,n)}return n}function Dv(e,t,n){e.flags|=16384,e={getSnapshot:t,value:n},t=Ft.updateQueue,t===null?(t=Xu(),Ft.updateQueue=t,t.stores=[e]):(n=t.stores,n===null?t.stores=[e]:n.push(e))}function Nv(e,t,n,i){t.value=n,t.getSnapshot=i,Uv(t)&&Ov(e)}function Lv(e,t,n){return n(function(){Uv(t)&&Ov(e)})}function Uv(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!ni(e,n)}catch{return!0}}function Ov(e){var t=$a(e,2);t!==null&&kn(t,e,2)}function wp(e){var t=Nn();if(typeof e=="function"){var n=e;if(e=n(),Za){Ks(!0);try{n()}finally{Ks(!1)}}}return t.memoizedState=t.baseState=e,t.queue={pending:null,lanes:0,dispatch:null,lastRenderedReducer:Ts,lastRenderedState:e},t}function Iv(e,t,n,i){return e.baseState=n,Em(e,ye,typeof i=="function"?i:Ts)}function vE(e,t,n,i,s){if(Zu(e))throw Error(tt(485));if(e=t.action,e!==null){var a={payload:s,action:e,next:null,isTransition:!0,status:"pending",value:null,reason:null,listeners:[],then:function(r){a.listeners.push(r)}};Lt.T!==null?n(!0):a.isTransition=!1,i(a),n=t.pending,n===null?(a.next=t.pending=a,Pv(t,a)):(a.next=n.next,t.pending=n.next=a)}}function Pv(e,t){var n=t.action,i=t.payload,s=e.state;if(t.isTransition){var a=Lt.T,r={};Lt.T=r;try{var o=n(s,i),l=Lt.S;l!==null&&l(r,o),Iy(e,t,o)}catch(c){Cp(e,t,c)}finally{a!==null&&r.types!==null&&(a.types=r.types),Lt.T=a}}else try{a=n(s,i),Iy(e,t,a)}catch(c){Cp(e,t,c)}}function Iy(e,t,n){n!==null&&typeof n=="object"&&typeof n.then=="function"?n.then(function(i){Py(e,t,i)},function(i){return Cp(e,t,i)}):Py(e,t,n)}function Py(e,t,n){t.status="fulfilled",t.value=n,Bv(t),e.state=n,t=e.pending,t!==null&&(n=t.next,n===t?e.pending=null:(n=n.next,t.next=n,Pv(e,n)))}function Cp(e,t,n){var i=e.pending;if(e.pending=null,i!==null){i=i.next;do t.status="rejected",t.reason=n,Bv(t),t=t.next;while(t!==i)}e.action=null}function Bv(e){e=e.listeners;for(var t=0;t<e.length;t++)(0,e[t])()}function zv(e,t){return t}function By(e,t){if($t){var n=ve.formState;if(n!==null){t:{var i=Ft;if($t){if(we){e:{for(var s=we,a=yi;s.nodeType!==8;){if(!a){s=null;break e}if(s=vi(s.nextSibling),s===null){s=null;break e}}a=s.data,s=a==="F!"||a==="F"?s:null}if(s){we=vi(s.nextSibling),i=s.data==="F!";break t}}ua(i)}i=!1}i&&(t=n[0])}}return n=Nn(),n.memoizedState=n.baseState=t,i={pending:null,lanes:0,dispatch:null,lastRenderedReducer:zv,lastRenderedState:t},n.queue=i,n=t_.bind(null,Ft,i),i.dispatch=n,i=wp(!1),a=Rm.bind(null,Ft,!1,i.queue),i=Nn(),s={state:t,dispatch:null,action:e,pending:null},i.queue=s,n=vE.bind(null,Ft,s,a,n),s.dispatch=n,i.memoizedState=e,[t,n,!1]}function zy(e){var t=Ve();return Fv(t,ye,e)}function Fv(e,t,n){if(t=Em(e,t,zv)[0],e=tu(Ts)[0],typeof t=="object"&&t!==null&&typeof t.then=="function")try{var i=Il(t)}catch(r){throw r===ro?Wu:r}else i=t;t=Ve();var s=t.queue,a=s.dispatch;return n!==t.memoizedState&&(Ft.flags|=2048,Qr(9,{destroy:void 0},_E.bind(null,s,n),null)),[i,a,e]}function _E(e,t){e.action=t}function Fy(e){var t=Ve(),n=ye;if(n!==null)return Fv(t,n,e);Ve(),t=t.memoizedState,n=Ve();var i=n.queue.dispatch;return n.memoizedState=e,[t,i,!1]}function Qr(e,t,n,i){return e={tag:e,create:n,deps:i,inst:t,next:null},t=Ft.updateQueue,t===null&&(t=Xu(),Ft.updateQueue=t),n=t.lastEffect,n===null?t.lastEffect=e.next=e:(i=n.next,n.next=e,e.next=i,t.lastEffect=e),e}function kv(){return Ve().memoizedState}function eu(e,t,n,i){var s=Nn();Ft.flags|=e,s.memoizedState=Qr(1|t,{destroy:void 0},n,i===void 0?null:i)}function Yu(e,t,n,i){var s=Ve();i=i===void 0?null:i;var a=s.memoizedState.inst;ye!==null&&i!==null&&xm(i,ye.memoizedState.deps)?s.memoizedState=Qr(t,a,n,i):(Ft.flags|=e,s.memoizedState=Qr(1|t,a,n,i))}function ky(e,t){eu(8390656,8,e,t)}function Tm(e,t){Yu(2048,8,e,t)}function bE(e){Ft.flags|=4;var t=Ft.updateQueue;if(t===null)t=Xu(),Ft.updateQueue=t,t.events=[e];else{var n=t.events;n===null?t.events=[e]:n.push(e)}}function Hv(e){var t=Ve().memoizedState;return bE({ref:t,nextImpl:e}),function(){if((oe&2)!==0)throw Error(tt(440));return t.impl.apply(void 0,arguments)}}function Vv(e,t){return Yu(4,2,e,t)}function Gv(e,t){return Yu(4,4,e,t)}function Wv(e,t){if(typeof t=="function"){e=e();var n=t(e);return function(){typeof n=="function"?n():t(null)}}if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function Xv(e,t,n){n=n!=null?n.concat([e]):null,Yu(4,4,Wv.bind(null,t,e),n)}function Am(){}function qv(e,t){var n=Ve();t=t===void 0?null:t;var i=n.memoizedState;return t!==null&&xm(t,i[1])?i[0]:(n.memoizedState=[e,t],e)}function Yv(e,t){var n=Ve();t=t===void 0?null:t;var i=n.memoizedState;if(t!==null&&xm(t,i[1]))return i[0];if(i=e(),Za){Ks(!0);try{e()}finally{Ks(!1)}}return n.memoizedState=[i,t],i}function wm(e,t,n){return n===void 0||(Es&1073741824)!==0&&(Qt&261930)===0?e.memoizedState=t:(e.memoizedState=n,e=I_(),Ft.lanes|=e,fa|=e,n)}function Zv(e,t,n,i){return ni(n,t)?n:Jr.current!==null?(e=wm(e,n,i),ni(e,t)||(je=!0),e):(Es&42)===0||(Es&1073741824)!==0&&(Qt&261930)===0?(je=!0,e.memoizedState=n):(e=I_(),Ft.lanes|=e,fa|=e,t)}function Kv(e,t,n,i,s){var a=le.p;le.p=a!==0&&8>a?a:8;var r=Lt.T,o={};Lt.T=o,Rm(e,!1,t,n);try{var l=s(),c=Lt.S;if(c!==null&&c(o,l),l!==null&&typeof l=="object"&&typeof l.then=="function"){var u=gE(l,i);ll(e,t,u,ei(e))}else ll(e,t,i,ei(e))}catch(f){ll(e,t,{then:function(){},status:"rejected",reason:f},ei())}finally{le.p=a,r!==null&&o.types!==null&&(r.types=o.types),Lt.T=r}}function SE(){}function Rp(e,t,n,i){if(e.tag!==5)throw Error(tt(476));var s=Jv(e).queue;Kv(e,s,t,ka,n===null?SE:function(){return Qv(e),n(i)})}function Jv(e){var t=e.memoizedState;if(t!==null)return t;t={memoizedState:ka,baseState:ka,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:Ts,lastRenderedState:ka},next:null};var n={};return t.next={memoizedState:n,baseState:n,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:Ts,lastRenderedState:n},next:null},e.memoizedState=t,e=e.alternate,e!==null&&(e.memoizedState=t),t}function Qv(e){var t=Jv(e);t.next===null&&(t=e.alternate.memoizedState),ll(e,t.next.queue,{},ei())}function Cm(){return yn(Tl)}function jv(){return Ve().memoizedState}function $v(){return Ve().memoizedState}function ME(e){for(var t=e.return;t!==null;){switch(t.tag){case 24:case 3:var n=ei();e=na(n);var i=ia(t,e,n);i!==null&&(kn(i,t,n),al(i,t,n)),t={cache:dm()},e.payload=t;return}t=t.return}}function EE(e,t,n){var i=ei();n={lane:i,revertLane:0,gesture:null,action:n,hasEagerState:!1,eagerState:null,next:null},Zu(e)?e_(t,n):(n=cm(e,t,n,i),n!==null&&(kn(n,e,i),n_(n,t,i)))}function t_(e,t,n){var i=ei();ll(e,t,n,i)}function ll(e,t,n,i){var s={lane:i,revertLane:0,gesture:null,action:n,hasEagerState:!1,eagerState:null,next:null};if(Zu(e))e_(t,s);else{var a=e.alternate;if(e.lanes===0&&(a===null||a.lanes===0)&&(a=t.lastRenderedReducer,a!==null))try{var r=t.lastRenderedState,o=a(r,n);if(s.hasEagerState=!0,s.eagerState=o,ni(o,r))return Gu(e,t,s,0),ve===null&&Vu(),!1}catch{}if(n=cm(e,t,s,i),n!==null)return kn(n,e,i),n_(n,t,i),!0}return!1}function Rm(e,t,n,i){if(i={lane:2,revertLane:zm(),gesture:null,action:i,hasEagerState:!1,eagerState:null,next:null},Zu(e)){if(t)throw Error(tt(479))}else t=cm(e,n,i,2),t!==null&&kn(t,e,2)}function Zu(e){var t=e.alternate;return e===Ft||t!==null&&t===Ft}function e_(e,t){Wr=bu=!0;var n=e.pending;n===null?t.next=t:(t.next=n.next,n.next=t),e.pending=t}function n_(e,t,n){if((n&4194048)!==0){var i=t.lanes;i&=e.pendingLanes,n|=i,t.lanes=n,Hx(e,n)}}var Sl={readContext:yn,use:qu,useCallback:Be,useContext:Be,useEffect:Be,useImperativeHandle:Be,useLayoutEffect:Be,useInsertionEffect:Be,useMemo:Be,useReducer:Be,useRef:Be,useState:Be,useDebugValue:Be,useDeferredValue:Be,useTransition:Be,useSyncExternalStore:Be,useId:Be,useHostTransitionStatus:Be,useFormState:Be,useActionState:Be,useOptimistic:Be,useMemoCache:Be,useCacheRefresh:Be};Sl.useEffectEvent=Be;var i_={readContext:yn,use:qu,useCallback:function(e,t){return Nn().memoizedState=[e,t===void 0?null:t],e},useContext:yn,useEffect:ky,useImperativeHandle:function(e,t,n){n=n!=null?n.concat([e]):null,eu(4194308,4,Wv.bind(null,t,e),n)},useLayoutEffect:function(e,t){return eu(4194308,4,e,t)},useInsertionEffect:function(e,t){eu(4,2,e,t)},useMemo:function(e,t){var n=Nn();t=t===void 0?null:t;var i=e();if(Za){Ks(!0);try{e()}finally{Ks(!1)}}return n.memoizedState=[i,t],i},useReducer:function(e,t,n){var i=Nn();if(n!==void 0){var s=n(t);if(Za){Ks(!0);try{n(t)}finally{Ks(!1)}}}else s=t;return i.memoizedState=i.baseState=s,e={pending:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:s},i.queue=e,e=e.dispatch=EE.bind(null,Ft,e),[i.memoizedState,e]},useRef:function(e){var t=Nn();return e={current:e},t.memoizedState=e},useState:function(e){e=wp(e);var t=e.queue,n=t_.bind(null,Ft,t);return t.dispatch=n,[e.memoizedState,n]},useDebugValue:Am,useDeferredValue:function(e,t){var n=Nn();return wm(n,e,t)},useTransition:function(){var e=wp(!1);return e=Kv.bind(null,Ft,e.queue,!0,!1),Nn().memoizedState=e,[!1,e]},useSyncExternalStore:function(e,t,n){var i=Ft,s=Nn();if($t){if(n===void 0)throw Error(tt(407));n=n()}else{if(n=t(),ve===null)throw Error(tt(349));(Qt&127)!==0||Dv(i,t,n)}s.memoizedState=n;var a={value:n,getSnapshot:t};return s.queue=a,ky(Lv.bind(null,i,a,e),[e]),i.flags|=2048,Qr(9,{destroy:void 0},Nv.bind(null,i,a,n,t),null),n},useId:function(){var e=Nn(),t=ve.identifierPrefix;if($t){var n=Zi,i=Yi;n=(i&~(1<<32-ti(i)-1)).toString(32)+n,t="_"+t+"R_"+n,n=Su++,0<n&&(t+="H"+n.toString(32)),t+="_"}else n=yE++,t="_"+t+"r_"+n.toString(32)+"_";return e.memoizedState=t},useHostTransitionStatus:Cm,useFormState:By,useActionState:By,useOptimistic:function(e){var t=Nn();t.memoizedState=t.baseState=e;var n={pending:null,lanes:0,dispatch:null,lastRenderedReducer:null,lastRenderedState:null};return t.queue=n,t=Rm.bind(null,Ft,!0,n),n.dispatch=t,[e,t]},useMemoCache:Mm,useCacheRefresh:function(){return Nn().memoizedState=ME.bind(null,Ft)},useEffectEvent:function(e){var t=Nn(),n={impl:e};return t.memoizedState=n,function(){if((oe&2)!==0)throw Error(tt(440));return n.impl.apply(void 0,arguments)}}},Dm={readContext:yn,use:qu,useCallback:qv,useContext:yn,useEffect:Tm,useImperativeHandle:Xv,useInsertionEffect:Vv,useLayoutEffect:Gv,useMemo:Yv,useReducer:tu,useRef:kv,useState:function(){return tu(Ts)},useDebugValue:Am,useDeferredValue:function(e,t){var n=Ve();return Zv(n,ye.memoizedState,e,t)},useTransition:function(){var e=tu(Ts)[0],t=Ve().memoizedState;return[typeof e=="boolean"?e:Il(e),t]},useSyncExternalStore:Rv,useId:jv,useHostTransitionStatus:Cm,useFormState:zy,useActionState:zy,useOptimistic:function(e,t){var n=Ve();return Iv(n,ye,e,t)},useMemoCache:Mm,useCacheRefresh:$v};Dm.useEffectEvent=Hv;var s_={readContext:yn,use:qu,useCallback:qv,useContext:yn,useEffect:Tm,useImperativeHandle:Xv,useInsertionEffect:Vv,useLayoutEffect:Gv,useMemo:Yv,useReducer:Bd,useRef:kv,useState:function(){return Bd(Ts)},useDebugValue:Am,useDeferredValue:function(e,t){var n=Ve();return ye===null?wm(n,e,t):Zv(n,ye.memoizedState,e,t)},useTransition:function(){var e=Bd(Ts)[0],t=Ve().memoizedState;return[typeof e=="boolean"?e:Il(e),t]},useSyncExternalStore:Rv,useId:jv,useHostTransitionStatus:Cm,useFormState:Fy,useActionState:Fy,useOptimistic:function(e,t){var n=Ve();return ye!==null?Iv(n,ye,e,t):(n.baseState=e,[e,n.queue.dispatch])},useMemoCache:Mm,useCacheRefresh:$v};s_.useEffectEvent=Hv;function zd(e,t,n,i){t=e.memoizedState,n=n(i,t),n=n==null?t:Ce({},t,n),e.memoizedState=n,e.lanes===0&&(e.updateQueue.baseState=n)}var Dp={enqueueSetState:function(e,t,n){e=e._reactInternals;var i=ei(),s=na(i);s.payload=t,n!=null&&(s.callback=n),t=ia(e,s,i),t!==null&&(kn(t,e,i),al(t,e,i))},enqueueReplaceState:function(e,t,n){e=e._reactInternals;var i=ei(),s=na(i);s.tag=1,s.payload=t,n!=null&&(s.callback=n),t=ia(e,s,i),t!==null&&(kn(t,e,i),al(t,e,i))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var n=ei(),i=na(n);i.tag=2,t!=null&&(i.callback=t),t=ia(e,i,n),t!==null&&(kn(t,e,n),al(t,e,n))}};function Hy(e,t,n,i,s,a,r){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(i,a,r):t.prototype&&t.prototype.isPureReactComponent?!yl(n,i)||!yl(s,a):!0}function Vy(e,t,n,i){e=t.state,typeof t.componentWillReceiveProps=="function"&&t.componentWillReceiveProps(n,i),typeof t.UNSAFE_componentWillReceiveProps=="function"&&t.UNSAFE_componentWillReceiveProps(n,i),t.state!==e&&Dp.enqueueReplaceState(t,t.state,null)}function Ka(e,t){var n=t;if("ref"in t){n={};for(var i in t)i!=="ref"&&(n[i]=t[i])}if(e=e.defaultProps){n===t&&(n=Ce({},n));for(var s in e)n[s]===void 0&&(n[s]=e[s])}return n}function a_(e){pu(e)}function r_(e){console.error(e)}function o_(e){pu(e)}function Mu(e,t){try{var n=e.onUncaughtError;n(t.value,{componentStack:t.stack})}catch(i){setTimeout(function(){throw i})}}function Gy(e,t,n){try{var i=e.onCaughtError;i(n.value,{componentStack:n.stack,errorBoundary:t.tag===1?t.stateNode:null})}catch(s){setTimeout(function(){throw s})}}function Np(e,t,n){return n=na(n),n.tag=3,n.payload={element:null},n.callback=function(){Mu(e,t)},n}function l_(e){return e=na(e),e.tag=3,e}function c_(e,t,n,i){var s=n.type.getDerivedStateFromError;if(typeof s=="function"){var a=i.value;e.payload=function(){return s(a)},e.callback=function(){Gy(t,n,i)}}var r=n.stateNode;r!==null&&typeof r.componentDidCatch=="function"&&(e.callback=function(){Gy(t,n,i),typeof s!="function"&&(sa===null?sa=new Set([this]):sa.add(this));var o=i.stack;this.componentDidCatch(i.value,{componentStack:o!==null?o:""})})}function TE(e,t,n,i,s){if(n.flags|=32768,i!==null&&typeof i=="object"&&typeof i.then=="function"){if(t=n.alternate,t!==null&&ao(t,n,s,!0),n=ii.current,n!==null){switch(n.tag){case 31:case 13:return xi===null?Cu():n.alternate===null&&ze===0&&(ze=3),n.flags&=-257,n.flags|=65536,n.lanes=s,i===xu?n.flags|=16384:(t=n.updateQueue,t===null?n.updateQueue=new Set([i]):t.add(i),Kd(e,i,s)),!1;case 22:return n.flags|=65536,i===xu?n.flags|=16384:(t=n.updateQueue,t===null?(t={transitions:null,markerInstances:null,retryQueue:new Set([i])},n.updateQueue=t):(n=t.retryQueue,n===null?t.retryQueue=new Set([i]):n.add(i)),Kd(e,i,s)),!1}throw Error(tt(435,n.tag))}return Kd(e,i,s),Cu(),!1}if($t)return t=ii.current,t!==null?((t.flags&65536)===0&&(t.flags|=256),t.flags|=65536,t.lanes=s,i!==xp&&(e=Error(tt(422),{cause:i}),vl(gi(e,n)))):(i!==xp&&(t=Error(tt(423),{cause:i}),vl(gi(t,n))),e=e.current.alternate,e.flags|=65536,s&=-s,e.lanes|=s,i=gi(i,n),s=Np(e.stateNode,i,s),Pd(e,s),ze!==4&&(ze=2)),!1;var a=Error(tt(520),{cause:i});if(a=gi(a,n),hl===null?hl=[a]:hl.push(a),ze!==4&&(ze=2),t===null)return!0;i=gi(i,n),n=t;do{switch(n.tag){case 3:return n.flags|=65536,e=s&-s,n.lanes|=e,e=Np(n.stateNode,i,e),Pd(n,e),!1;case 1:if(t=n.type,a=n.stateNode,(n.flags&128)===0&&(typeof t.getDerivedStateFromError=="function"||a!==null&&typeof a.componentDidCatch=="function"&&(sa===null||!sa.has(a))))return n.flags|=65536,s&=-s,n.lanes|=s,s=l_(s),c_(s,e,n,i),Pd(n,s),!1}n=n.return}while(n!==null);return!1}var Nm=Error(tt(461)),je=!1;function pn(e,t,n,i){t.child=e===null?Mv(t,null,n,i):Ya(t,e.child,n,i)}function Wy(e,t,n,i,s){n=n.render;var a=t.ref;if("ref"in i){var r={};for(var o in i)o!=="ref"&&(r[o]=i[o])}else r=i;return qa(t),i=vm(e,t,n,r,a,s),o=_m(),e!==null&&!je?(bm(e,t,s),As(e,t,s)):($t&&o&&hm(t),t.flags|=1,pn(e,t,i,s),t.child)}function Xy(e,t,n,i,s){if(e===null){var a=n.type;return typeof a=="function"&&!um(a)&&a.defaultProps===void 0&&n.compare===null?(t.tag=15,t.type=a,u_(e,t,a,i,s)):(e=jc(n.type,null,i,t,t.mode,s),e.ref=t.ref,e.return=t,t.child=e)}if(a=e.child,!Lm(e,s)){var r=a.memoizedProps;if(n=n.compare,n=n!==null?n:yl,n(r,i)&&e.ref===t.ref)return As(e,t,s)}return t.flags|=1,e=_s(a,i),e.ref=t.ref,e.return=t,t.child=e}function u_(e,t,n,i,s){if(e!==null){var a=e.memoizedProps;if(yl(a,i)&&e.ref===t.ref)if(je=!1,t.pendingProps=i=a,Lm(e,s))(e.flags&131072)!==0&&(je=!0);else return t.lanes=e.lanes,As(e,t,s)}return Lp(e,t,n,i,s)}function h_(e,t,n,i){var s=i.children,a=e!==null?e.memoizedState:null;if(e===null&&t.stateNode===null&&(t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),i.mode==="hidden"){if((t.flags&128)!==0){if(a=a!==null?a.baseLanes|n:n,e!==null){for(i=t.child=e.child,s=0;i!==null;)s=s|i.lanes|i.childLanes,i=i.sibling;i=s&~a}else i=0,t.child=null;return qy(e,t,a,n,i)}if((n&536870912)!==0)t.memoizedState={baseLanes:0,cachePool:null},e!==null&&$c(t,a!==null?a.cachePool:null),a!==null?Oy(t,a):Tp(),Av(t);else return i=t.lanes=536870912,qy(e,t,a!==null?a.baseLanes|n:n,n,i)}else a!==null?($c(t,a.cachePool),Oy(t,a),Ys(t),t.memoizedState=null):(e!==null&&$c(t,null),Tp(),Ys(t));return pn(e,t,s,n),t.child}function $o(e,t){return e!==null&&e.tag===22||t.stateNode!==null||(t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),t.sibling}function qy(e,t,n,i,s){var a=pm();return a=a===null?null:{parent:Qe._currentValue,pool:a},t.memoizedState={baseLanes:n,cachePool:a},e!==null&&$c(t,null),Tp(),Av(t),e!==null&&ao(e,t,i,!0),t.childLanes=s,null}function nu(e,t){return t=Eu({mode:t.mode,children:t.children},e.mode),t.ref=e.ref,e.child=t,t.return=e,t}function Yy(e,t,n){return Ya(t,e.child,null,n),e=nu(t,t.pendingProps),e.flags|=2,Kn(t),t.memoizedState=null,e}function AE(e,t,n){var i=t.pendingProps,s=(t.flags&128)!==0;if(t.flags&=-129,e===null){if($t){if(i.mode==="hidden")return e=nu(t,i),t.lanes=536870912,$o(null,e);if(Ap(t),(e=we)?(e=ib(e,yi),e=e!==null&&e.data==="&"?e:null,e!==null&&(t.memoizedState={dehydrated:e,treeContext:ca!==null?{id:Yi,overflow:Zi}:null,retryLane:536870912,hydrationErrors:null},n=gv(e),n.return=t,t.child=n,gn=t,we=null)):e=null,e===null)throw ua(t);return t.lanes=536870912,null}return nu(t,i)}var a=e.memoizedState;if(a!==null){var r=a.dehydrated;if(Ap(t),s)if(t.flags&256)t.flags&=-257,t=Yy(e,t,n);else if(t.memoizedState!==null)t.child=e.child,t.flags|=128,t=null;else throw Error(tt(558));else if(je||ao(e,t,n,!1),s=(n&e.childLanes)!==0,je||s){if(i=ve,i!==null&&(r=Vx(i,n),r!==0&&r!==a.retryLane))throw a.retryLane=r,$a(e,r),kn(i,e,r),Nm;Cu(),t=Yy(e,t,n)}else e=a.treeContext,we=vi(r.nextSibling),gn=t,$t=!0,ea=null,yi=!1,e!==null&&xv(t,e),t=nu(t,i),t.flags|=4096;return t}return e=_s(e.child,{mode:i.mode,children:i.children}),e.ref=t.ref,t.child=e,e.return=t,e}function iu(e,t){var n=t.ref;if(n===null)e!==null&&e.ref!==null&&(t.flags|=4194816);else{if(typeof n!="function"&&typeof n!="object")throw Error(tt(284));(e===null||e.ref!==n)&&(t.flags|=4194816)}}function Lp(e,t,n,i,s){return qa(t),n=vm(e,t,n,i,void 0,s),i=_m(),e!==null&&!je?(bm(e,t,s),As(e,t,s)):($t&&i&&hm(t),t.flags|=1,pn(e,t,n,s),t.child)}function Zy(e,t,n,i,s,a){return qa(t),t.updateQueue=null,n=Cv(t,i,n,s),wv(e),i=_m(),e!==null&&!je?(bm(e,t,a),As(e,t,a)):($t&&i&&hm(t),t.flags|=1,pn(e,t,n,a),t.child)}function Ky(e,t,n,i,s){if(qa(t),t.stateNode===null){var a=Ir,r=n.contextType;typeof r=="object"&&r!==null&&(a=yn(r)),a=new n(i,a),t.memoizedState=a.state!==null&&a.state!==void 0?a.state:null,a.updater=Dp,t.stateNode=a,a._reactInternals=t,a=t.stateNode,a.props=i,a.state=t.memoizedState,a.refs={},gm(t),r=n.contextType,a.context=typeof r=="object"&&r!==null?yn(r):Ir,a.state=t.memoizedState,r=n.getDerivedStateFromProps,typeof r=="function"&&(zd(t,n,r,i),a.state=t.memoizedState),typeof n.getDerivedStateFromProps=="function"||typeof a.getSnapshotBeforeUpdate=="function"||typeof a.UNSAFE_componentWillMount!="function"&&typeof a.componentWillMount!="function"||(r=a.state,typeof a.componentWillMount=="function"&&a.componentWillMount(),typeof a.UNSAFE_componentWillMount=="function"&&a.UNSAFE_componentWillMount(),r!==a.state&&Dp.enqueueReplaceState(a,a.state,null),ol(t,i,a,s),rl(),a.state=t.memoizedState),typeof a.componentDidMount=="function"&&(t.flags|=4194308),i=!0}else if(e===null){a=t.stateNode;var o=t.memoizedProps,l=Ka(n,o);a.props=l;var c=a.context,u=n.contextType;r=Ir,typeof u=="object"&&u!==null&&(r=yn(u));var f=n.getDerivedStateFromProps;u=typeof f=="function"||typeof a.getSnapshotBeforeUpdate=="function",o=t.pendingProps!==o,u||typeof a.UNSAFE_componentWillReceiveProps!="function"&&typeof a.componentWillReceiveProps!="function"||(o||c!==r)&&Vy(t,a,i,r),Ws=!1;var h=t.memoizedState;a.state=h,ol(t,i,a,s),rl(),c=t.memoizedState,o||h!==c||Ws?(typeof f=="function"&&(zd(t,n,f,i),c=t.memoizedState),(l=Ws||Hy(t,n,l,i,h,c,r))?(u||typeof a.UNSAFE_componentWillMount!="function"&&typeof a.componentWillMount!="function"||(typeof a.componentWillMount=="function"&&a.componentWillMount(),typeof a.UNSAFE_componentWillMount=="function"&&a.UNSAFE_componentWillMount()),typeof a.componentDidMount=="function"&&(t.flags|=4194308)):(typeof a.componentDidMount=="function"&&(t.flags|=4194308),t.memoizedProps=i,t.memoizedState=c),a.props=i,a.state=c,a.context=r,i=l):(typeof a.componentDidMount=="function"&&(t.flags|=4194308),i=!1)}else{a=t.stateNode,Mp(e,t),r=t.memoizedProps,u=Ka(n,r),a.props=u,f=t.pendingProps,h=a.context,c=n.contextType,l=Ir,typeof c=="object"&&c!==null&&(l=yn(c)),o=n.getDerivedStateFromProps,(c=typeof o=="function"||typeof a.getSnapshotBeforeUpdate=="function")||typeof a.UNSAFE_componentWillReceiveProps!="function"&&typeof a.componentWillReceiveProps!="function"||(r!==f||h!==l)&&Vy(t,a,i,l),Ws=!1,h=t.memoizedState,a.state=h,ol(t,i,a,s),rl();var d=t.memoizedState;r!==f||h!==d||Ws||e!==null&&e.dependencies!==null&&yu(e.dependencies)?(typeof o=="function"&&(zd(t,n,o,i),d=t.memoizedState),(u=Ws||Hy(t,n,u,i,h,d,l)||e!==null&&e.dependencies!==null&&yu(e.dependencies))?(c||typeof a.UNSAFE_componentWillUpdate!="function"&&typeof a.componentWillUpdate!="function"||(typeof a.componentWillUpdate=="function"&&a.componentWillUpdate(i,d,l),typeof a.UNSAFE_componentWillUpdate=="function"&&a.UNSAFE_componentWillUpdate(i,d,l)),typeof a.componentDidUpdate=="function"&&(t.flags|=4),typeof a.getSnapshotBeforeUpdate=="function"&&(t.flags|=1024)):(typeof a.componentDidUpdate!="function"||r===e.memoizedProps&&h===e.memoizedState||(t.flags|=4),typeof a.getSnapshotBeforeUpdate!="function"||r===e.memoizedProps&&h===e.memoizedState||(t.flags|=1024),t.memoizedProps=i,t.memoizedState=d),a.props=i,a.state=d,a.context=l,i=u):(typeof a.componentDidUpdate!="function"||r===e.memoizedProps&&h===e.memoizedState||(t.flags|=4),typeof a.getSnapshotBeforeUpdate!="function"||r===e.memoizedProps&&h===e.memoizedState||(t.flags|=1024),i=!1)}return a=i,iu(e,t),i=(t.flags&128)!==0,a||i?(a=t.stateNode,n=i&&typeof n.getDerivedStateFromError!="function"?null:a.render(),t.flags|=1,e!==null&&i?(t.child=Ya(t,e.child,null,s),t.child=Ya(t,null,n,s)):pn(e,t,n,s),t.memoizedState=a.state,e=t.child):e=As(e,t,s),e}function Jy(e,t,n,i){return Xa(),t.flags|=256,pn(e,t,n,i),t.child}var Fd={dehydrated:null,treeContext:null,retryLane:0,hydrationErrors:null};function kd(e){return{baseLanes:e,cachePool:_v()}}function Hd(e,t,n){return e=e!==null?e.childLanes&~n:0,t&&(e|=Qn),e}function f_(e,t,n){var i=t.pendingProps,s=!1,a=(t.flags&128)!==0,r;if((r=a)||(r=e!==null&&e.memoizedState===null?!1:(He.current&2)!==0),r&&(s=!0,t.flags&=-129),r=(t.flags&32)!==0,t.flags&=-33,e===null){if($t){if(s?qs(t):Ys(t),(e=we)?(e=ib(e,yi),e=e!==null&&e.data!=="&"?e:null,e!==null&&(t.memoizedState={dehydrated:e,treeContext:ca!==null?{id:Yi,overflow:Zi}:null,retryLane:536870912,hydrationErrors:null},n=gv(e),n.return=t,t.child=n,gn=t,we=null)):e=null,e===null)throw ua(t);return qp(e)?t.lanes=32:t.lanes=536870912,null}var o=i.children;return i=i.fallback,s?(Ys(t),s=t.mode,o=Eu({mode:"hidden",children:o},s),i=Ha(i,s,n,null),o.return=t,i.return=t,o.sibling=i,t.child=o,i=t.child,i.memoizedState=kd(n),i.childLanes=Hd(e,r,n),t.memoizedState=Fd,$o(null,i)):(qs(t),Up(t,o))}var l=e.memoizedState;if(l!==null&&(o=l.dehydrated,o!==null)){if(a)t.flags&256?(qs(t),t.flags&=-257,t=Vd(e,t,n)):t.memoizedState!==null?(Ys(t),t.child=e.child,t.flags|=128,t=null):(Ys(t),o=i.fallback,s=t.mode,i=Eu({mode:"visible",children:i.children},s),o=Ha(o,s,n,null),o.flags|=2,i.return=t,o.return=t,i.sibling=o,t.child=i,Ya(t,e.child,null,n),i=t.child,i.memoizedState=kd(n),i.childLanes=Hd(e,r,n),t.memoizedState=Fd,t=$o(null,i));else if(qs(t),qp(o)){if(r=o.nextSibling&&o.nextSibling.dataset,r)var c=r.dgst;r=c,i=Error(tt(419)),i.stack="",i.digest=r,vl({value:i,source:null,stack:null}),t=Vd(e,t,n)}else if(je||ao(e,t,n,!1),r=(n&e.childLanes)!==0,je||r){if(r=ve,r!==null&&(i=Vx(r,n),i!==0&&i!==l.retryLane))throw l.retryLane=i,$a(e,i),kn(r,e,i),Nm;Xp(o)||Cu(),t=Vd(e,t,n)}else Xp(o)?(t.flags|=192,t.child=e.child,t=null):(e=l.treeContext,we=vi(o.nextSibling),gn=t,$t=!0,ea=null,yi=!1,e!==null&&xv(t,e),t=Up(t,i.children),t.flags|=4096);return t}return s?(Ys(t),o=i.fallback,s=t.mode,l=e.child,c=l.sibling,i=_s(l,{mode:"hidden",children:i.children}),i.subtreeFlags=l.subtreeFlags&65011712,c!==null?o=_s(c,o):(o=Ha(o,s,n,null),o.flags|=2),o.return=t,i.return=t,i.sibling=o,t.child=i,$o(null,i),i=t.child,o=e.child.memoizedState,o===null?o=kd(n):(s=o.cachePool,s!==null?(l=Qe._currentValue,s=s.parent!==l?{parent:l,pool:l}:s):s=_v(),o={baseLanes:o.baseLanes|n,cachePool:s}),i.memoizedState=o,i.childLanes=Hd(e,r,n),t.memoizedState=Fd,$o(e.child,i)):(qs(t),n=e.child,e=n.sibling,n=_s(n,{mode:"visible",children:i.children}),n.return=t,n.sibling=null,e!==null&&(r=t.deletions,r===null?(t.deletions=[e],t.flags|=16):r.push(e)),t.child=n,t.memoizedState=null,n)}function Up(e,t){return t=Eu({mode:"visible",children:t},e.mode),t.return=e,e.child=t}function Eu(e,t){return e=Jn(22,e,null,t),e.lanes=0,e}function Vd(e,t,n){return Ya(t,e.child,null,n),e=Up(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function Qy(e,t,n){e.lanes|=t;var i=e.alternate;i!==null&&(i.lanes|=t),_p(e.return,t,n)}function Gd(e,t,n,i,s,a){var r=e.memoizedState;r===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:i,tail:n,tailMode:s,treeForkCount:a}:(r.isBackwards=t,r.rendering=null,r.renderingStartTime=0,r.last=i,r.tail=n,r.tailMode=s,r.treeForkCount=a)}function d_(e,t,n){var i=t.pendingProps,s=i.revealOrder,a=i.tail;i=i.children;var r=He.current,o=(r&2)!==0;if(o?(r=r&1|2,t.flags|=128):r&=1,Me(He,r),pn(e,t,i,n),i=$t?xl:0,!o&&e!==null&&(e.flags&128)!==0)t:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&Qy(e,n,t);else if(e.tag===19)Qy(e,n,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break t;for(;e.sibling===null;){if(e.return===null||e.return===t)break t;e=e.return}e.sibling.return=e.return,e=e.sibling}switch(s){case"forwards":for(n=t.child,s=null;n!==null;)e=n.alternate,e!==null&&_u(e)===null&&(s=n),n=n.sibling;n=s,n===null?(s=t.child,t.child=null):(s=n.sibling,n.sibling=null),Gd(t,!1,s,n,a,i);break;case"backwards":case"unstable_legacy-backwards":for(n=null,s=t.child,t.child=null;s!==null;){if(e=s.alternate,e!==null&&_u(e)===null){t.child=s;break}e=s.sibling,s.sibling=n,n=s,s=e}Gd(t,!0,n,null,a,i);break;case"together":Gd(t,!1,null,null,void 0,i);break;default:t.memoizedState=null}return t.child}function As(e,t,n){if(e!==null&&(t.dependencies=e.dependencies),fa|=t.lanes,(n&t.childLanes)===0)if(e!==null){if(ao(e,t,n,!1),(n&t.childLanes)===0)return null}else return null;if(e!==null&&t.child!==e.child)throw Error(tt(153));if(t.child!==null){for(e=t.child,n=_s(e,e.pendingProps),t.child=n,n.return=t;e.sibling!==null;)e=e.sibling,n=n.sibling=_s(e,e.pendingProps),n.return=t;n.sibling=null}return t.child}function Lm(e,t){return(e.lanes&t)!==0?!0:(e=e.dependencies,!!(e!==null&&yu(e)))}function wE(e,t,n){switch(t.tag){case 3:uu(t,t.stateNode.containerInfo),Xs(t,Qe,e.memoizedState.cache),Xa();break;case 27:case 5:op(t);break;case 4:uu(t,t.stateNode.containerInfo);break;case 10:Xs(t,t.type,t.memoizedProps.value);break;case 31:if(t.memoizedState!==null)return t.flags|=128,Ap(t),null;break;case 13:var i=t.memoizedState;if(i!==null)return i.dehydrated!==null?(qs(t),t.flags|=128,null):(n&t.child.childLanes)!==0?f_(e,t,n):(qs(t),e=As(e,t,n),e!==null?e.sibling:null);qs(t);break;case 19:var s=(e.flags&128)!==0;if(i=(n&t.childLanes)!==0,i||(ao(e,t,n,!1),i=(n&t.childLanes)!==0),s){if(i)return d_(e,t,n);t.flags|=128}if(s=t.memoizedState,s!==null&&(s.rendering=null,s.tail=null,s.lastEffect=null),Me(He,He.current),i)break;return null;case 22:return t.lanes=0,h_(e,t,n,t.pendingProps);case 24:Xs(t,Qe,e.memoizedState.cache)}return As(e,t,n)}function p_(e,t,n){if(e!==null)if(e.memoizedProps!==t.pendingProps)je=!0;else{if(!Lm(e,n)&&(t.flags&128)===0)return je=!1,wE(e,t,n);je=(e.flags&131072)!==0}else je=!1,$t&&(t.flags&1048576)!==0&&yv(t,xl,t.index);switch(t.lanes=0,t.tag){case 16:t:{var i=t.pendingProps;if(e=za(t.elementType),t.type=e,typeof e=="function")um(e)?(i=Ka(e,i),t.tag=1,t=Ky(null,t,e,i,n)):(t.tag=0,t=Lp(null,t,e,i,n));else{if(e!=null){var s=e.$$typeof;if(s===Jp){t.tag=11,t=Wy(null,t,e,i,n);break t}else if(s===Qp){t.tag=14,t=Xy(null,t,e,i,n);break t}}throw t=ap(e)||e,Error(tt(306,t,""))}}return t;case 0:return Lp(e,t,t.type,t.pendingProps,n);case 1:return i=t.type,s=Ka(i,t.pendingProps),Ky(e,t,i,s,n);case 3:t:{if(uu(t,t.stateNode.containerInfo),e===null)throw Error(tt(387));i=t.pendingProps;var a=t.memoizedState;s=a.element,Mp(e,t),ol(t,i,null,n);var r=t.memoizedState;if(i=r.cache,Xs(t,Qe,i),i!==a.cache&&bp(t,[Qe],n,!0),rl(),i=r.element,a.isDehydrated)if(a={element:i,isDehydrated:!1,cache:r.cache},t.updateQueue.baseState=a,t.memoizedState=a,t.flags&256){t=Jy(e,t,i,n);break t}else if(i!==s){s=gi(Error(tt(424)),t),vl(s),t=Jy(e,t,i,n);break t}else for(e=t.stateNode.containerInfo,e.nodeType===9?e=e.body:e=e.nodeName==="HTML"?e.ownerDocument.body:e,we=vi(e.firstChild),gn=t,$t=!0,ea=null,yi=!0,n=Mv(t,null,i,n),t.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if(Xa(),i===s){t=As(e,t,n);break t}pn(e,t,i,n)}t=t.child}return t;case 26:return iu(e,t),e===null?(n=vx(t.type,null,t.pendingProps,null))?t.memoizedState=n:$t||(n=t.type,e=t.pendingProps,i=Lu(ta.current).createElement(n),i[mn]=t,i[Hn]=e,xn(i,n,e),un(i),t.stateNode=i):t.memoizedState=vx(t.type,e.memoizedProps,t.pendingProps,e.memoizedState),null;case 27:return op(t),e===null&&$t&&(i=t.stateNode=sb(t.type,t.pendingProps,ta.current),gn=t,yi=!0,s=we,pa(t.type)?(Yp=s,we=vi(i.firstChild)):we=s),pn(e,t,t.pendingProps.children,n),iu(e,t),e===null&&(t.flags|=4194304),t.child;case 5:return e===null&&$t&&((s=i=we)&&(i=eT(i,t.type,t.pendingProps,yi),i!==null?(t.stateNode=i,gn=t,we=vi(i.firstChild),yi=!1,s=!0):s=!1),s||ua(t)),op(t),s=t.type,a=t.pendingProps,r=e!==null?e.memoizedProps:null,i=a.children,Gp(s,a)?i=null:r!==null&&Gp(s,r)&&(t.flags|=32),t.memoizedState!==null&&(s=vm(e,t,xE,null,null,n),Tl._currentValue=s),iu(e,t),pn(e,t,i,n),t.child;case 6:return e===null&&$t&&((e=n=we)&&(n=nT(n,t.pendingProps,yi),n!==null?(t.stateNode=n,gn=t,we=null,e=!0):e=!1),e||ua(t)),null;case 13:return f_(e,t,n);case 4:return uu(t,t.stateNode.containerInfo),i=t.pendingProps,e===null?t.child=Ya(t,null,i,n):pn(e,t,i,n),t.child;case 11:return Wy(e,t,t.type,t.pendingProps,n);case 7:return pn(e,t,t.pendingProps,n),t.child;case 8:return pn(e,t,t.pendingProps.children,n),t.child;case 12:return pn(e,t,t.pendingProps.children,n),t.child;case 10:return i=t.pendingProps,Xs(t,t.type,i.value),pn(e,t,i.children,n),t.child;case 9:return s=t.type._context,i=t.pendingProps.children,qa(t),s=yn(s),i=i(s),t.flags|=1,pn(e,t,i,n),t.child;case 14:return Xy(e,t,t.type,t.pendingProps,n);case 15:return u_(e,t,t.type,t.pendingProps,n);case 19:return d_(e,t,n);case 31:return AE(e,t,n);case 22:return h_(e,t,n,t.pendingProps);case 24:return qa(t),i=yn(Qe),e===null?(s=pm(),s===null&&(s=ve,a=dm(),s.pooledCache=a,a.refCount++,a!==null&&(s.pooledCacheLanes|=n),s=a),t.memoizedState={parent:i,cache:s},gm(t),Xs(t,Qe,s)):((e.lanes&n)!==0&&(Mp(e,t),ol(t,null,null,n),rl()),s=e.memoizedState,a=t.memoizedState,s.parent!==i?(s={parent:i,cache:i},t.memoizedState=s,t.lanes===0&&(t.memoizedState=t.updateQueue.baseState=s),Xs(t,Qe,i)):(i=a.cache,Xs(t,Qe,i),i!==s.cache&&bp(t,[Qe],n,!0))),pn(e,t,t.pendingProps.children,n),t.child;case 29:throw t.pendingProps}throw Error(tt(156,t.tag))}function hs(e){e.flags|=4}function Wd(e,t,n,i,s){if((t=(e.mode&32)!==0)&&(t=!1),t){if(e.flags|=16777216,(s&335544128)===s)if(e.stateNode.complete)e.flags|=8192;else if(z_())e.flags|=8192;else throw Ga=xu,mm}else e.flags&=-16777217}function jy(e,t){if(t.type!=="stylesheet"||(t.state.loading&4)!==0)e.flags&=-16777217;else if(e.flags|=16777216,!ob(t))if(z_())e.flags|=8192;else throw Ga=xu,mm}function Hc(e,t){t!==null&&(e.flags|=4),e.flags&16384&&(t=e.tag!==22?Fx():536870912,e.lanes|=t,jr|=t)}function qo(e,t){if(!$t)switch(e.tailMode){case"hidden":t=e.tail;for(var n=null;t!==null;)t.alternate!==null&&(n=t),t=t.sibling;n===null?e.tail=null:n.sibling=null;break;case"collapsed":n=e.tail;for(var i=null;n!==null;)n.alternate!==null&&(i=n),n=n.sibling;i===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:i.sibling=null}}function Ae(e){var t=e.alternate!==null&&e.alternate.child===e.child,n=0,i=0;if(t)for(var s=e.child;s!==null;)n|=s.lanes|s.childLanes,i|=s.subtreeFlags&65011712,i|=s.flags&65011712,s.return=e,s=s.sibling;else for(s=e.child;s!==null;)n|=s.lanes|s.childLanes,i|=s.subtreeFlags,i|=s.flags,s.return=e,s=s.sibling;return e.subtreeFlags|=i,e.childLanes=n,t}function CE(e,t,n){var i=t.pendingProps;switch(fm(t),t.tag){case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Ae(t),null;case 1:return Ae(t),null;case 3:return n=t.stateNode,i=null,e!==null&&(i=e.memoizedState.cache),t.memoizedState.cache!==i&&(t.flags|=2048),bs(Qe),qr(),n.pendingContext&&(n.context=n.pendingContext,n.pendingContext=null),(e===null||e.child===null)&&(Mr(t)?hs(t):e===null||e.memoizedState.isDehydrated&&(t.flags&256)===0||(t.flags|=1024,Id())),Ae(t),null;case 26:var s=t.type,a=t.memoizedState;return e===null?(hs(t),a!==null?(Ae(t),jy(t,a)):(Ae(t),Wd(t,s,null,i,n))):a?a!==e.memoizedState?(hs(t),Ae(t),jy(t,a)):(Ae(t),t.flags&=-16777217):(e=e.memoizedProps,e!==i&&hs(t),Ae(t),Wd(t,s,e,i,n)),null;case 27:if(hu(t),n=ta.current,s=t.type,e!==null&&t.stateNode!=null)e.memoizedProps!==i&&hs(t);else{if(!i){if(t.stateNode===null)throw Error(tt(166));return Ae(t),null}e=Ji.current,Mr(t)?wy(t,e):(e=sb(s,i,n),t.stateNode=e,hs(t))}return Ae(t),null;case 5:if(hu(t),s=t.type,e!==null&&t.stateNode!=null)e.memoizedProps!==i&&hs(t);else{if(!i){if(t.stateNode===null)throw Error(tt(166));return Ae(t),null}if(a=Ji.current,Mr(t))wy(t,a);else{var r=Lu(ta.current);switch(a){case 1:a=r.createElementNS("http://www.w3.org/2000/svg",s);break;case 2:a=r.createElementNS("http://www.w3.org/1998/Math/MathML",s);break;default:switch(s){case"svg":a=r.createElementNS("http://www.w3.org/2000/svg",s);break;case"math":a=r.createElementNS("http://www.w3.org/1998/Math/MathML",s);break;case"script":a=r.createElement("div"),a.innerHTML="<script><\/script>",a=a.removeChild(a.firstChild);break;case"select":a=typeof i.is=="string"?r.createElement("select",{is:i.is}):r.createElement("select"),i.multiple?a.multiple=!0:i.size&&(a.size=i.size);break;default:a=typeof i.is=="string"?r.createElement(s,{is:i.is}):r.createElement(s)}}a[mn]=t,a[Hn]=i;t:for(r=t.child;r!==null;){if(r.tag===5||r.tag===6)a.appendChild(r.stateNode);else if(r.tag!==4&&r.tag!==27&&r.child!==null){r.child.return=r,r=r.child;continue}if(r===t)break t;for(;r.sibling===null;){if(r.return===null||r.return===t)break t;r=r.return}r.sibling.return=r.return,r=r.sibling}t.stateNode=a;t:switch(xn(a,s,i),s){case"button":case"input":case"select":case"textarea":i=!!i.autoFocus;break t;case"img":i=!0;break t;default:i=!1}i&&hs(t)}}return Ae(t),Wd(t,t.type,e===null?null:e.memoizedProps,t.pendingProps,n),null;case 6:if(e&&t.stateNode!=null)e.memoizedProps!==i&&hs(t);else{if(typeof i!="string"&&t.stateNode===null)throw Error(tt(166));if(e=ta.current,Mr(t)){if(e=t.stateNode,n=t.memoizedProps,i=null,s=gn,s!==null)switch(s.tag){case 27:case 5:i=s.memoizedProps}e[mn]=t,e=!!(e.nodeValue===n||i!==null&&i.suppressHydrationWarning===!0||tb(e.nodeValue,n)),e||ua(t,!0)}else e=Lu(e).createTextNode(i),e[mn]=t,t.stateNode=e}return Ae(t),null;case 31:if(n=t.memoizedState,e===null||e.memoizedState!==null){if(i=Mr(t),n!==null){if(e===null){if(!i)throw Error(tt(318));if(e=t.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(tt(557));e[mn]=t}else Xa(),(t.flags&128)===0&&(t.memoizedState=null),t.flags|=4;Ae(t),e=!1}else n=Id(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=n),e=!0;if(!e)return t.flags&256?(Kn(t),t):(Kn(t),null);if((t.flags&128)!==0)throw Error(tt(558))}return Ae(t),null;case 13:if(i=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(s=Mr(t),i!==null&&i.dehydrated!==null){if(e===null){if(!s)throw Error(tt(318));if(s=t.memoizedState,s=s!==null?s.dehydrated:null,!s)throw Error(tt(317));s[mn]=t}else Xa(),(t.flags&128)===0&&(t.memoizedState=null),t.flags|=4;Ae(t),s=!1}else s=Id(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=s),s=!0;if(!s)return t.flags&256?(Kn(t),t):(Kn(t),null)}return Kn(t),(t.flags&128)!==0?(t.lanes=n,t):(n=i!==null,e=e!==null&&e.memoizedState!==null,n&&(i=t.child,s=null,i.alternate!==null&&i.alternate.memoizedState!==null&&i.alternate.memoizedState.cachePool!==null&&(s=i.alternate.memoizedState.cachePool.pool),a=null,i.memoizedState!==null&&i.memoizedState.cachePool!==null&&(a=i.memoizedState.cachePool.pool),a!==s&&(i.flags|=2048)),n!==e&&n&&(t.child.flags|=8192),Hc(t,t.updateQueue),Ae(t),null);case 4:return qr(),e===null&&Fm(t.stateNode.containerInfo),Ae(t),null;case 10:return bs(t.type),Ae(t),null;case 19:if(hn(He),i=t.memoizedState,i===null)return Ae(t),null;if(s=(t.flags&128)!==0,a=i.rendering,a===null)if(s)qo(i,!1);else{if(ze!==0||e!==null&&(e.flags&128)!==0)for(e=t.child;e!==null;){if(a=_u(e),a!==null){for(t.flags|=128,qo(i,!1),e=a.updateQueue,t.updateQueue=e,Hc(t,e),t.subtreeFlags=0,e=n,n=t.child;n!==null;)mv(n,e),n=n.sibling;return Me(He,He.current&1|2),$t&&ms(t,i.treeForkCount),t.child}e=e.sibling}i.tail!==null&&jn()>Au&&(t.flags|=128,s=!0,qo(i,!1),t.lanes=4194304)}else{if(!s)if(e=_u(a),e!==null){if(t.flags|=128,s=!0,e=e.updateQueue,t.updateQueue=e,Hc(t,e),qo(i,!0),i.tail===null&&i.tailMode==="hidden"&&!a.alternate&&!$t)return Ae(t),null}else 2*jn()-i.renderingStartTime>Au&&n!==536870912&&(t.flags|=128,s=!0,qo(i,!1),t.lanes=4194304);i.isBackwards?(a.sibling=t.child,t.child=a):(e=i.last,e!==null?e.sibling=a:t.child=a,i.last=a)}return i.tail!==null?(e=i.tail,i.rendering=e,i.tail=e.sibling,i.renderingStartTime=jn(),e.sibling=null,n=He.current,Me(He,s?n&1|2:n&1),$t&&ms(t,i.treeForkCount),e):(Ae(t),null);case 22:case 23:return Kn(t),ym(),i=t.memoizedState!==null,e!==null?e.memoizedState!==null!==i&&(t.flags|=8192):i&&(t.flags|=8192),i?(n&536870912)!==0&&(t.flags&128)===0&&(Ae(t),t.subtreeFlags&6&&(t.flags|=8192)):Ae(t),n=t.updateQueue,n!==null&&Hc(t,n.retryQueue),n=null,e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(n=e.memoizedState.cachePool.pool),i=null,t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(i=t.memoizedState.cachePool.pool),i!==n&&(t.flags|=2048),e!==null&&hn(Va),null;case 24:return n=null,e!==null&&(n=e.memoizedState.cache),t.memoizedState.cache!==n&&(t.flags|=2048),bs(Qe),Ae(t),null;case 25:return null;case 30:return null}throw Error(tt(156,t.tag))}function RE(e,t){switch(fm(t),t.tag){case 1:return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return bs(Qe),qr(),e=t.flags,(e&65536)!==0&&(e&128)===0?(t.flags=e&-65537|128,t):null;case 26:case 27:case 5:return hu(t),null;case 31:if(t.memoizedState!==null){if(Kn(t),t.alternate===null)throw Error(tt(340));Xa()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 13:if(Kn(t),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(tt(340));Xa()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return hn(He),null;case 4:return qr(),null;case 10:return bs(t.type),null;case 22:case 23:return Kn(t),ym(),e!==null&&hn(Va),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 24:return bs(Qe),null;case 25:return null;default:return null}}function m_(e,t){switch(fm(t),t.tag){case 3:bs(Qe),qr();break;case 26:case 27:case 5:hu(t);break;case 4:qr();break;case 31:t.memoizedState!==null&&Kn(t);break;case 13:Kn(t);break;case 19:hn(He);break;case 10:bs(t.type);break;case 22:case 23:Kn(t),ym(),e!==null&&hn(Va);break;case 24:bs(Qe)}}function Pl(e,t){try{var n=t.updateQueue,i=n!==null?n.lastEffect:null;if(i!==null){var s=i.next;n=s;do{if((n.tag&e)===e){i=void 0;var a=n.create,r=n.inst;i=a(),r.destroy=i}n=n.next}while(n!==s)}}catch(o){pe(t,t.return,o)}}function ha(e,t,n){try{var i=t.updateQueue,s=i!==null?i.lastEffect:null;if(s!==null){var a=s.next;i=a;do{if((i.tag&e)===e){var r=i.inst,o=r.destroy;if(o!==void 0){r.destroy=void 0,s=t;var l=n,c=o;try{c()}catch(u){pe(s,l,u)}}}i=i.next}while(i!==a)}}catch(u){pe(t,t.return,u)}}function g_(e){var t=e.updateQueue;if(t!==null){var n=e.stateNode;try{Tv(t,n)}catch(i){pe(e,e.return,i)}}}function y_(e,t,n){n.props=Ka(e.type,e.memoizedProps),n.state=e.memoizedState;try{n.componentWillUnmount()}catch(i){pe(e,t,i)}}function cl(e,t){try{var n=e.ref;if(n!==null){switch(e.tag){case 26:case 27:case 5:var i=e.stateNode;break;case 30:i=e.stateNode;break;default:i=e.stateNode}typeof n=="function"?e.refCleanup=n(i):n.current=i}}catch(s){pe(e,t,s)}}function Ki(e,t){var n=e.ref,i=e.refCleanup;if(n!==null)if(typeof i=="function")try{i()}catch(s){pe(e,t,s)}finally{e.refCleanup=null,e=e.alternate,e!=null&&(e.refCleanup=null)}else if(typeof n=="function")try{n(null)}catch(s){pe(e,t,s)}else n.current=null}function x_(e){var t=e.type,n=e.memoizedProps,i=e.stateNode;try{t:switch(t){case"button":case"input":case"select":case"textarea":n.autoFocus&&i.focus();break t;case"img":n.src?i.src=n.src:n.srcSet&&(i.srcset=n.srcSet)}}catch(s){pe(e,e.return,s)}}function Xd(e,t,n){try{var i=e.stateNode;KE(i,e.type,n,t),i[Hn]=t}catch(s){pe(e,e.return,s)}}function v_(e){return e.tag===5||e.tag===3||e.tag===26||e.tag===27&&pa(e.type)||e.tag===4}function qd(e){t:for(;;){for(;e.sibling===null;){if(e.return===null||v_(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.tag===27&&pa(e.type)||e.flags&2||e.child===null||e.tag===4)continue t;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function Op(e,t,n){var i=e.tag;if(i===5||i===6)e=e.stateNode,t?(n.nodeType===9?n.body:n.nodeName==="HTML"?n.ownerDocument.body:n).insertBefore(e,t):(t=n.nodeType===9?n.body:n.nodeName==="HTML"?n.ownerDocument.body:n,t.appendChild(e),n=n._reactRootContainer,n!=null||t.onclick!==null||(t.onclick=xs));else if(i!==4&&(i===27&&pa(e.type)&&(n=e.stateNode,t=null),e=e.child,e!==null))for(Op(e,t,n),e=e.sibling;e!==null;)Op(e,t,n),e=e.sibling}function Tu(e,t,n){var i=e.tag;if(i===5||i===6)e=e.stateNode,t?n.insertBefore(e,t):n.appendChild(e);else if(i!==4&&(i===27&&pa(e.type)&&(n=e.stateNode),e=e.child,e!==null))for(Tu(e,t,n),e=e.sibling;e!==null;)Tu(e,t,n),e=e.sibling}function __(e){var t=e.stateNode,n=e.memoizedProps;try{for(var i=e.type,s=t.attributes;s.length;)t.removeAttributeNode(s[0]);xn(t,i,n),t[mn]=e,t[Hn]=n}catch(a){pe(e,e.return,a)}}var gs=!1,Je=!1,Yd=!1,$y=typeof WeakSet=="function"?WeakSet:Set,cn=null;function DE(e,t){if(e=e.containerInfo,Hp=Pu,e=ov(e),om(e)){if("selectionStart"in e)var n={start:e.selectionStart,end:e.selectionEnd};else t:{n=(n=e.ownerDocument)&&n.defaultView||window;var i=n.getSelection&&n.getSelection();if(i&&i.rangeCount!==0){n=i.anchorNode;var s=i.anchorOffset,a=i.focusNode;i=i.focusOffset;try{n.nodeType,a.nodeType}catch{n=null;break t}var r=0,o=-1,l=-1,c=0,u=0,f=e,h=null;e:for(;;){for(var d;f!==n||s!==0&&f.nodeType!==3||(o=r+s),f!==a||i!==0&&f.nodeType!==3||(l=r+i),f.nodeType===3&&(r+=f.nodeValue.length),(d=f.firstChild)!==null;)h=f,f=d;for(;;){if(f===e)break e;if(h===n&&++c===s&&(o=r),h===a&&++u===i&&(l=r),(d=f.nextSibling)!==null)break;f=h,h=f.parentNode}f=d}n=o===-1||l===-1?null:{start:o,end:l}}else n=null}n=n||{start:0,end:0}}else n=null;for(Vp={focusedElem:e,selectionRange:n},Pu=!1,cn=t;cn!==null;)if(t=cn,e=t.child,(t.subtreeFlags&1028)!==0&&e!==null)e.return=t,cn=e;else for(;cn!==null;){switch(t=cn,a=t.alternate,e=t.flags,t.tag){case 0:if((e&4)!==0&&(e=t.updateQueue,e=e!==null?e.events:null,e!==null))for(n=0;n<e.length;n++)s=e[n],s.ref.impl=s.nextImpl;break;case 11:case 15:break;case 1:if((e&1024)!==0&&a!==null){e=void 0,n=t,s=a.memoizedProps,a=a.memoizedState,i=n.stateNode;try{var m=Ka(n.type,s);e=i.getSnapshotBeforeUpdate(m,a),i.__reactInternalSnapshotBeforeUpdate=e}catch(b){pe(n,n.return,b)}}break;case 3:if((e&1024)!==0){if(e=t.stateNode.containerInfo,n=e.nodeType,n===9)Wp(e);else if(n===1)switch(e.nodeName){case"HEAD":case"HTML":case"BODY":Wp(e);break;default:e.textContent=""}}break;case 5:case 26:case 27:case 6:case 4:case 17:break;default:if((e&1024)!==0)throw Error(tt(163))}if(e=t.sibling,e!==null){e.return=t.return,cn=e;break}cn=t.return}}function b_(e,t,n){var i=n.flags;switch(n.tag){case 0:case 11:case 15:ds(e,n),i&4&&Pl(5,n);break;case 1:if(ds(e,n),i&4)if(e=n.stateNode,t===null)try{e.componentDidMount()}catch(r){pe(n,n.return,r)}else{var s=Ka(n.type,t.memoizedProps);t=t.memoizedState;try{e.componentDidUpdate(s,t,e.__reactInternalSnapshotBeforeUpdate)}catch(r){pe(n,n.return,r)}}i&64&&g_(n),i&512&&cl(n,n.return);break;case 3:if(ds(e,n),i&64&&(e=n.updateQueue,e!==null)){if(t=null,n.child!==null)switch(n.child.tag){case 27:case 5:t=n.child.stateNode;break;case 1:t=n.child.stateNode}try{Tv(e,t)}catch(r){pe(n,n.return,r)}}break;case 27:t===null&&i&4&&__(n);case 26:case 5:ds(e,n),t===null&&i&4&&x_(n),i&512&&cl(n,n.return);break;case 12:ds(e,n);break;case 31:ds(e,n),i&4&&E_(e,n);break;case 13:ds(e,n),i&4&&T_(e,n),i&64&&(e=n.memoizedState,e!==null&&(e=e.dehydrated,e!==null&&(n=FE.bind(null,n),iT(e,n))));break;case 22:if(i=n.memoizedState!==null||gs,!i){t=t!==null&&t.memoizedState!==null||Je,s=gs;var a=Je;gs=i,(Je=t)&&!a?ps(e,n,(n.subtreeFlags&8772)!==0):ds(e,n),gs=s,Je=a}break;case 30:break;default:ds(e,n)}}function S_(e){var t=e.alternate;t!==null&&(e.alternate=null,S_(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&em(t)),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}var Ue=null,zn=!1;function fs(e,t,n){for(n=n.child;n!==null;)M_(e,t,n),n=n.sibling}function M_(e,t,n){if($n&&typeof $n.onCommitFiberUnmount=="function")try{$n.onCommitFiberUnmount(Rl,n)}catch{}switch(n.tag){case 26:Je||Ki(n,t),fs(e,t,n),n.memoizedState?n.memoizedState.count--:n.stateNode&&(n=n.stateNode,n.parentNode.removeChild(n));break;case 27:Je||Ki(n,t);var i=Ue,s=zn;pa(n.type)&&(Ue=n.stateNode,zn=!1),fs(e,t,n),dl(n.stateNode),Ue=i,zn=s;break;case 5:Je||Ki(n,t);case 6:if(i=Ue,s=zn,Ue=null,fs(e,t,n),Ue=i,zn=s,Ue!==null)if(zn)try{(Ue.nodeType===9?Ue.body:Ue.nodeName==="HTML"?Ue.ownerDocument.body:Ue).removeChild(n.stateNode)}catch(a){pe(n,t,a)}else try{Ue.removeChild(n.stateNode)}catch(a){pe(n,t,a)}break;case 18:Ue!==null&&(zn?(e=Ue,px(e.nodeType===9?e.body:e.nodeName==="HTML"?e.ownerDocument.body:e,n.stateNode),no(e)):px(Ue,n.stateNode));break;case 4:i=Ue,s=zn,Ue=n.stateNode.containerInfo,zn=!0,fs(e,t,n),Ue=i,zn=s;break;case 0:case 11:case 14:case 15:ha(2,n,t),Je||ha(4,n,t),fs(e,t,n);break;case 1:Je||(Ki(n,t),i=n.stateNode,typeof i.componentWillUnmount=="function"&&y_(n,t,i)),fs(e,t,n);break;case 21:fs(e,t,n);break;case 22:Je=(i=Je)||n.memoizedState!==null,fs(e,t,n),Je=i;break;default:fs(e,t,n)}}function E_(e,t){if(t.memoizedState===null&&(e=t.alternate,e!==null&&(e=e.memoizedState,e!==null))){e=e.dehydrated;try{no(e)}catch(n){pe(t,t.return,n)}}}function T_(e,t){if(t.memoizedState===null&&(e=t.alternate,e!==null&&(e=e.memoizedState,e!==null&&(e=e.dehydrated,e!==null))))try{no(e)}catch(n){pe(t,t.return,n)}}function NE(e){switch(e.tag){case 31:case 13:case 19:var t=e.stateNode;return t===null&&(t=e.stateNode=new $y),t;case 22:return e=e.stateNode,t=e._retryCache,t===null&&(t=e._retryCache=new $y),t;default:throw Error(tt(435,e.tag))}}function Vc(e,t){var n=NE(e);t.forEach(function(i){if(!n.has(i)){n.add(i);var s=kE.bind(null,e,i);i.then(s,s)}})}function Pn(e,t){var n=t.deletions;if(n!==null)for(var i=0;i<n.length;i++){var s=n[i],a=e,r=t,o=r;t:for(;o!==null;){switch(o.tag){case 27:if(pa(o.type)){Ue=o.stateNode,zn=!1;break t}break;case 5:Ue=o.stateNode,zn=!1;break t;case 3:case 4:Ue=o.stateNode.containerInfo,zn=!0;break t}o=o.return}if(Ue===null)throw Error(tt(160));M_(a,r,s),Ue=null,zn=!1,a=s.alternate,a!==null&&(a.return=null),s.return=null}if(t.subtreeFlags&13886)for(t=t.child;t!==null;)A_(t,e),t=t.sibling}var Di=null;function A_(e,t){var n=e.alternate,i=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:Pn(t,e),Bn(e),i&4&&(ha(3,e,e.return),Pl(3,e),ha(5,e,e.return));break;case 1:Pn(t,e),Bn(e),i&512&&(Je||n===null||Ki(n,n.return)),i&64&&gs&&(e=e.updateQueue,e!==null&&(i=e.callbacks,i!==null&&(n=e.shared.hiddenCallbacks,e.shared.hiddenCallbacks=n===null?i:n.concat(i))));break;case 26:var s=Di;if(Pn(t,e),Bn(e),i&512&&(Je||n===null||Ki(n,n.return)),i&4){var a=n!==null?n.memoizedState:null;if(i=e.memoizedState,n===null)if(i===null)if(e.stateNode===null){t:{i=e.type,n=e.memoizedProps,s=s.ownerDocument||s;e:switch(i){case"title":a=s.getElementsByTagName("title")[0],(!a||a[Ll]||a[mn]||a.namespaceURI==="http://www.w3.org/2000/svg"||a.hasAttribute("itemprop"))&&(a=s.createElement(i),s.head.insertBefore(a,s.querySelector("head > title"))),xn(a,i,n),a[mn]=e,un(a),i=a;break t;case"link":var r=bx("link","href",s).get(i+(n.href||""));if(r){for(var o=0;o<r.length;o++)if(a=r[o],a.getAttribute("href")===(n.href==null||n.href===""?null:n.href)&&a.getAttribute("rel")===(n.rel==null?null:n.rel)&&a.getAttribute("title")===(n.title==null?null:n.title)&&a.getAttribute("crossorigin")===(n.crossOrigin==null?null:n.crossOrigin)){r.splice(o,1);break e}}a=s.createElement(i),xn(a,i,n),s.head.appendChild(a);break;case"meta":if(r=bx("meta","content",s).get(i+(n.content||""))){for(o=0;o<r.length;o++)if(a=r[o],a.getAttribute("content")===(n.content==null?null:""+n.content)&&a.getAttribute("name")===(n.name==null?null:n.name)&&a.getAttribute("property")===(n.property==null?null:n.property)&&a.getAttribute("http-equiv")===(n.httpEquiv==null?null:n.httpEquiv)&&a.getAttribute("charset")===(n.charSet==null?null:n.charSet)){r.splice(o,1);break e}}a=s.createElement(i),xn(a,i,n),s.head.appendChild(a);break;default:throw Error(tt(468,i))}a[mn]=e,un(a),i=a}e.stateNode=i}else Sx(s,e.type,e.stateNode);else e.stateNode=_x(s,i,e.memoizedProps);else a!==i?(a===null?n.stateNode!==null&&(n=n.stateNode,n.parentNode.removeChild(n)):a.count--,i===null?Sx(s,e.type,e.stateNode):_x(s,i,e.memoizedProps)):i===null&&e.stateNode!==null&&Xd(e,e.memoizedProps,n.memoizedProps)}break;case 27:Pn(t,e),Bn(e),i&512&&(Je||n===null||Ki(n,n.return)),n!==null&&i&4&&Xd(e,e.memoizedProps,n.memoizedProps);break;case 5:if(Pn(t,e),Bn(e),i&512&&(Je||n===null||Ki(n,n.return)),e.flags&32){s=e.stateNode;try{Zr(s,"")}catch(m){pe(e,e.return,m)}}i&4&&e.stateNode!=null&&(s=e.memoizedProps,Xd(e,s,n!==null?n.memoizedProps:s)),i&1024&&(Yd=!0);break;case 6:if(Pn(t,e),Bn(e),i&4){if(e.stateNode===null)throw Error(tt(162));i=e.memoizedProps,n=e.stateNode;try{n.nodeValue=i}catch(m){pe(e,e.return,m)}}break;case 3:if(ru=null,s=Di,Di=Uu(t.containerInfo),Pn(t,e),Di=s,Bn(e),i&4&&n!==null&&n.memoizedState.isDehydrated)try{no(t.containerInfo)}catch(m){pe(e,e.return,m)}Yd&&(Yd=!1,w_(e));break;case 4:i=Di,Di=Uu(e.stateNode.containerInfo),Pn(t,e),Bn(e),Di=i;break;case 12:Pn(t,e),Bn(e);break;case 31:Pn(t,e),Bn(e),i&4&&(i=e.updateQueue,i!==null&&(e.updateQueue=null,Vc(e,i)));break;case 13:Pn(t,e),Bn(e),e.child.flags&8192&&e.memoizedState!==null!=(n!==null&&n.memoizedState!==null)&&(Ku=jn()),i&4&&(i=e.updateQueue,i!==null&&(e.updateQueue=null,Vc(e,i)));break;case 22:s=e.memoizedState!==null;var l=n!==null&&n.memoizedState!==null,c=gs,u=Je;if(gs=c||s,Je=u||l,Pn(t,e),Je=u,gs=c,Bn(e),i&8192)t:for(t=e.stateNode,t._visibility=s?t._visibility&-2:t._visibility|1,s&&(n===null||l||gs||Je||Fa(e)),n=null,t=e;;){if(t.tag===5||t.tag===26){if(n===null){l=n=t;try{if(a=l.stateNode,s)r=a.style,typeof r.setProperty=="function"?r.setProperty("display","none","important"):r.display="none";else{o=l.stateNode;var f=l.memoizedProps.style,h=f!=null&&f.hasOwnProperty("display")?f.display:null;o.style.display=h==null||typeof h=="boolean"?"":(""+h).trim()}}catch(m){pe(l,l.return,m)}}}else if(t.tag===6){if(n===null){l=t;try{l.stateNode.nodeValue=s?"":l.memoizedProps}catch(m){pe(l,l.return,m)}}}else if(t.tag===18){if(n===null){l=t;try{var d=l.stateNode;s?mx(d,!0):mx(l.stateNode,!1)}catch(m){pe(l,l.return,m)}}}else if((t.tag!==22&&t.tag!==23||t.memoizedState===null||t===e)&&t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break t;for(;t.sibling===null;){if(t.return===null||t.return===e)break t;n===t&&(n=null),t=t.return}n===t&&(n=null),t.sibling.return=t.return,t=t.sibling}i&4&&(i=e.updateQueue,i!==null&&(n=i.retryQueue,n!==null&&(i.retryQueue=null,Vc(e,n))));break;case 19:Pn(t,e),Bn(e),i&4&&(i=e.updateQueue,i!==null&&(e.updateQueue=null,Vc(e,i)));break;case 30:break;case 21:break;default:Pn(t,e),Bn(e)}}function Bn(e){var t=e.flags;if(t&2){try{for(var n,i=e.return;i!==null;){if(v_(i)){n=i;break}i=i.return}if(n==null)throw Error(tt(160));switch(n.tag){case 27:var s=n.stateNode,a=qd(e);Tu(e,a,s);break;case 5:var r=n.stateNode;n.flags&32&&(Zr(r,""),n.flags&=-33);var o=qd(e);Tu(e,o,r);break;case 3:case 4:var l=n.stateNode.containerInfo,c=qd(e);Op(e,c,l);break;default:throw Error(tt(161))}}catch(u){pe(e,e.return,u)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function w_(e){if(e.subtreeFlags&1024)for(e=e.child;e!==null;){var t=e;w_(t),t.tag===5&&t.flags&1024&&t.stateNode.reset(),e=e.sibling}}function ds(e,t){if(t.subtreeFlags&8772)for(t=t.child;t!==null;)b_(e,t.alternate,t),t=t.sibling}function Fa(e){for(e=e.child;e!==null;){var t=e;switch(t.tag){case 0:case 11:case 14:case 15:ha(4,t,t.return),Fa(t);break;case 1:Ki(t,t.return);var n=t.stateNode;typeof n.componentWillUnmount=="function"&&y_(t,t.return,n),Fa(t);break;case 27:dl(t.stateNode);case 26:case 5:Ki(t,t.return),Fa(t);break;case 22:t.memoizedState===null&&Fa(t);break;case 30:Fa(t);break;default:Fa(t)}e=e.sibling}}function ps(e,t,n){for(n=n&&(t.subtreeFlags&8772)!==0,t=t.child;t!==null;){var i=t.alternate,s=e,a=t,r=a.flags;switch(a.tag){case 0:case 11:case 15:ps(s,a,n),Pl(4,a);break;case 1:if(ps(s,a,n),i=a,s=i.stateNode,typeof s.componentDidMount=="function")try{s.componentDidMount()}catch(c){pe(i,i.return,c)}if(i=a,s=i.updateQueue,s!==null){var o=i.stateNode;try{var l=s.shared.hiddenCallbacks;if(l!==null)for(s.shared.hiddenCallbacks=null,s=0;s<l.length;s++)Ev(l[s],o)}catch(c){pe(i,i.return,c)}}n&&r&64&&g_(a),cl(a,a.return);break;case 27:__(a);case 26:case 5:ps(s,a,n),n&&i===null&&r&4&&x_(a),cl(a,a.return);break;case 12:ps(s,a,n);break;case 31:ps(s,a,n),n&&r&4&&E_(s,a);break;case 13:ps(s,a,n),n&&r&4&&T_(s,a);break;case 22:a.memoizedState===null&&ps(s,a,n),cl(a,a.return);break;case 30:break;default:ps(s,a,n)}t=t.sibling}}function Um(e,t){var n=null;e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(n=e.memoizedState.cachePool.pool),e=null,t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(e=t.memoizedState.cachePool.pool),e!==n&&(e!=null&&e.refCount++,n!=null&&Ol(n))}function Om(e,t){e=null,t.alternate!==null&&(e=t.alternate.memoizedState.cache),t=t.memoizedState.cache,t!==e&&(t.refCount++,e!=null&&Ol(e))}function Ri(e,t,n,i){if(t.subtreeFlags&10256)for(t=t.child;t!==null;)C_(e,t,n,i),t=t.sibling}function C_(e,t,n,i){var s=t.flags;switch(t.tag){case 0:case 11:case 15:Ri(e,t,n,i),s&2048&&Pl(9,t);break;case 1:Ri(e,t,n,i);break;case 3:Ri(e,t,n,i),s&2048&&(e=null,t.alternate!==null&&(e=t.alternate.memoizedState.cache),t=t.memoizedState.cache,t!==e&&(t.refCount++,e!=null&&Ol(e)));break;case 12:if(s&2048){Ri(e,t,n,i),e=t.stateNode;try{var a=t.memoizedProps,r=a.id,o=a.onPostCommit;typeof o=="function"&&o(r,t.alternate===null?"mount":"update",e.passiveEffectDuration,-0)}catch(l){pe(t,t.return,l)}}else Ri(e,t,n,i);break;case 31:Ri(e,t,n,i);break;case 13:Ri(e,t,n,i);break;case 23:break;case 22:a=t.stateNode,r=t.alternate,t.memoizedState!==null?a._visibility&2?Ri(e,t,n,i):ul(e,t):a._visibility&2?Ri(e,t,n,i):(a._visibility|=2,Tr(e,t,n,i,(t.subtreeFlags&10256)!==0||!1)),s&2048&&Um(r,t);break;case 24:Ri(e,t,n,i),s&2048&&Om(t.alternate,t);break;default:Ri(e,t,n,i)}}function Tr(e,t,n,i,s){for(s=s&&((t.subtreeFlags&10256)!==0||!1),t=t.child;t!==null;){var a=e,r=t,o=n,l=i,c=r.flags;switch(r.tag){case 0:case 11:case 15:Tr(a,r,o,l,s),Pl(8,r);break;case 23:break;case 22:var u=r.stateNode;r.memoizedState!==null?u._visibility&2?Tr(a,r,o,l,s):ul(a,r):(u._visibility|=2,Tr(a,r,o,l,s)),s&&c&2048&&Um(r.alternate,r);break;case 24:Tr(a,r,o,l,s),s&&c&2048&&Om(r.alternate,r);break;default:Tr(a,r,o,l,s)}t=t.sibling}}function ul(e,t){if(t.subtreeFlags&10256)for(t=t.child;t!==null;){var n=e,i=t,s=i.flags;switch(i.tag){case 22:ul(n,i),s&2048&&Um(i.alternate,i);break;case 24:ul(n,i),s&2048&&Om(i.alternate,i);break;default:ul(n,i)}t=t.sibling}}var tl=8192;function Er(e,t,n){if(e.subtreeFlags&tl)for(e=e.child;e!==null;)R_(e,t,n),e=e.sibling}function R_(e,t,n){switch(e.tag){case 26:Er(e,t,n),e.flags&tl&&e.memoizedState!==null&&mT(n,Di,e.memoizedState,e.memoizedProps);break;case 5:Er(e,t,n);break;case 3:case 4:var i=Di;Di=Uu(e.stateNode.containerInfo),Er(e,t,n),Di=i;break;case 22:e.memoizedState===null&&(i=e.alternate,i!==null&&i.memoizedState!==null?(i=tl,tl=16777216,Er(e,t,n),tl=i):Er(e,t,n));break;default:Er(e,t,n)}}function D_(e){var t=e.alternate;if(t!==null&&(e=t.child,e!==null)){t.child=null;do t=e.sibling,e.sibling=null,e=t;while(e!==null)}}function Yo(e){var t=e.deletions;if((e.flags&16)!==0){if(t!==null)for(var n=0;n<t.length;n++){var i=t[n];cn=i,L_(i,e)}D_(e)}if(e.subtreeFlags&10256)for(e=e.child;e!==null;)N_(e),e=e.sibling}function N_(e){switch(e.tag){case 0:case 11:case 15:Yo(e),e.flags&2048&&ha(9,e,e.return);break;case 3:Yo(e);break;case 12:Yo(e);break;case 22:var t=e.stateNode;e.memoizedState!==null&&t._visibility&2&&(e.return===null||e.return.tag!==13)?(t._visibility&=-3,su(e)):Yo(e);break;default:Yo(e)}}function su(e){var t=e.deletions;if((e.flags&16)!==0){if(t!==null)for(var n=0;n<t.length;n++){var i=t[n];cn=i,L_(i,e)}D_(e)}for(e=e.child;e!==null;){switch(t=e,t.tag){case 0:case 11:case 15:ha(8,t,t.return),su(t);break;case 22:n=t.stateNode,n._visibility&2&&(n._visibility&=-3,su(t));break;default:su(t)}e=e.sibling}}function L_(e,t){for(;cn!==null;){var n=cn;switch(n.tag){case 0:case 11:case 15:ha(8,n,t);break;case 23:case 22:if(n.memoizedState!==null&&n.memoizedState.cachePool!==null){var i=n.memoizedState.cachePool.pool;i!=null&&i.refCount++}break;case 24:Ol(n.memoizedState.cache)}if(i=n.child,i!==null)i.return=n,cn=i;else t:for(n=e;cn!==null;){i=cn;var s=i.sibling,a=i.return;if(S_(i),i===n){cn=null;break t}if(s!==null){s.return=a,cn=s;break t}cn=a}}}var LE={getCacheForType:function(e){var t=yn(Qe),n=t.data.get(e);return n===void 0&&(n=e(),t.data.set(e,n)),n},cacheSignal:function(){return yn(Qe).controller.signal}},UE=typeof WeakMap=="function"?WeakMap:Map,oe=0,ve=null,Kt=null,Qt=0,de=0,Zn=null,Qs=!1,oo=!1,Im=!1,ws=0,ze=0,fa=0,Wa=0,Pm=0,Qn=0,jr=0,hl=null,Fn=null,Ip=!1,Ku=0,U_=0,Au=1/0,wu=null,sa=null,en=0,aa=null,$r=null,Ss=0,Pp=0,Bp=null,O_=null,fl=0,zp=null;function ei(){return(oe&2)!==0&&Qt!==0?Qt&-Qt:Lt.T!==null?zm():Gx()}function I_(){if(Qn===0)if((Qt&536870912)===0||$t){var e=Lc;Lc<<=1,(Lc&3932160)===0&&(Lc=262144),Qn=e}else Qn=536870912;return e=ii.current,e!==null&&(e.flags|=32),Qn}function kn(e,t,n){(e===ve&&(de===2||de===9)||e.cancelPendingCommit!==null)&&(to(e,0),js(e,Qt,Qn,!1)),Nl(e,n),((oe&2)===0||e!==ve)&&(e===ve&&((oe&2)===0&&(Wa|=n),ze===4&&js(e,Qt,Qn,!1)),ji(e))}function P_(e,t,n){if((oe&6)!==0)throw Error(tt(327));var i=!n&&(t&127)===0&&(t&e.expiredLanes)===0||Dl(e,t),s=i?PE(e,t):Zd(e,t,!0),a=i;do{if(s===0){oo&&!i&&js(e,t,0,!1);break}else{if(n=e.current.alternate,a&&!OE(n)){s=Zd(e,t,!1),a=!1;continue}if(s===2){if(a=t,e.errorRecoveryDisabledLanes&a)var r=0;else r=e.pendingLanes&-536870913,r=r!==0?r:r&536870912?536870912:0;if(r!==0){t=r;t:{var o=e;s=hl;var l=o.current.memoizedState.isDehydrated;if(l&&(to(o,r).flags|=256),r=Zd(o,r,!1),r!==2){if(Im&&!l){o.errorRecoveryDisabledLanes|=a,Wa|=a,s=4;break t}a=Fn,Fn=s,a!==null&&(Fn===null?Fn=a:Fn.push.apply(Fn,a))}s=r}if(a=!1,s!==2)continue}}if(s===1){to(e,0),js(e,t,0,!0);break}t:{switch(i=e,a=s,a){case 0:case 1:throw Error(tt(345));case 4:if((t&4194048)!==t)break;case 6:js(i,t,Qn,!Qs);break t;case 2:Fn=null;break;case 3:case 5:break;default:throw Error(tt(329))}if((t&62914560)===t&&(s=Ku+300-jn(),10<s)){if(js(i,t,Qn,!Qs),zu(i,0,!0)!==0)break t;Ss=t,i.timeoutHandle=nb(tx.bind(null,i,n,Fn,wu,Ip,t,Qn,Wa,jr,Qs,a,"Throttled",-0,0),s);break t}tx(i,n,Fn,wu,Ip,t,Qn,Wa,jr,Qs,a,null,-0,0)}}break}while(!0);ji(e)}function tx(e,t,n,i,s,a,r,o,l,c,u,f,h,d){if(e.timeoutHandle=-1,f=t.subtreeFlags,f&8192||(f&16785408)===16785408){f={stylesheets:null,count:0,imgCount:0,imgBytes:0,suspenseyImages:[],waitingForImages:!0,waitingForViewTransition:!1,unsuspend:xs},R_(t,a,f);var m=(a&62914560)===a?Ku-jn():(a&4194048)===a?U_-jn():0;if(m=gT(f,m),m!==null){Ss=a,e.cancelPendingCommit=m(nx.bind(null,e,t,a,n,i,s,r,o,l,u,f,null,h,d)),js(e,a,r,!c);return}}nx(e,t,a,n,i,s,r,o,l)}function OE(e){for(var t=e;;){var n=t.tag;if((n===0||n===11||n===15)&&t.flags&16384&&(n=t.updateQueue,n!==null&&(n=n.stores,n!==null)))for(var i=0;i<n.length;i++){var s=n[i],a=s.getSnapshot;s=s.value;try{if(!ni(a(),s))return!1}catch{return!1}}if(n=t.child,t.subtreeFlags&16384&&n!==null)n.return=t,t=n;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function js(e,t,n,i){t&=~Pm,t&=~Wa,e.suspendedLanes|=t,e.pingedLanes&=~t,i&&(e.warmLanes|=t),i=e.expirationTimes;for(var s=t;0<s;){var a=31-ti(s),r=1<<a;i[a]=-1,s&=~r}n!==0&&kx(e,n,t)}function Ju(){return(oe&6)===0?(Bl(0,!1),!1):!0}function Bm(){if(Kt!==null){if(de===0)var e=Kt.return;else e=Kt,vs=tr=null,Sm(e),Gr=null,_l=0,e=Kt;for(;e!==null;)m_(e.alternate,e),e=e.return;Kt=null}}function to(e,t){var n=e.timeoutHandle;n!==-1&&(e.timeoutHandle=-1,jE(n)),n=e.cancelPendingCommit,n!==null&&(e.cancelPendingCommit=null,n()),Ss=0,Bm(),ve=e,Kt=n=_s(e.current,null),Qt=t,de=0,Zn=null,Qs=!1,oo=Dl(e,t),Im=!1,jr=Qn=Pm=Wa=fa=ze=0,Fn=hl=null,Ip=!1,(t&8)!==0&&(t|=t&32);var i=e.entangledLanes;if(i!==0)for(e=e.entanglements,i&=t;0<i;){var s=31-ti(i),a=1<<s;t|=e[s],i&=~a}return ws=t,Vu(),n}function B_(e,t){Ft=null,Lt.H=Sl,t===ro||t===Wu?(t=Ly(),de=3):t===mm?(t=Ly(),de=4):de=t===Nm?8:t!==null&&typeof t=="object"&&typeof t.then=="function"?6:1,Zn=t,Kt===null&&(ze=1,Mu(e,gi(t,e.current)))}function z_(){var e=ii.current;return e===null?!0:(Qt&4194048)===Qt?xi===null:(Qt&62914560)===Qt||(Qt&536870912)!==0?e===xi:!1}function F_(){var e=Lt.H;return Lt.H=Sl,e===null?Sl:e}function k_(){var e=Lt.A;return Lt.A=LE,e}function Cu(){ze=4,Qs||(Qt&4194048)!==Qt&&ii.current!==null||(oo=!0),(fa&134217727)===0&&(Wa&134217727)===0||ve===null||js(ve,Qt,Qn,!1)}function Zd(e,t,n){var i=oe;oe|=2;var s=F_(),a=k_();(ve!==e||Qt!==t)&&(wu=null,to(e,t)),t=!1;var r=ze;t:do try{if(de!==0&&Kt!==null){var o=Kt,l=Zn;switch(de){case 8:Bm(),r=6;break t;case 3:case 2:case 9:case 6:ii.current===null&&(t=!0);var c=de;if(de=0,Zn=null,zr(e,o,l,c),n&&oo){r=0;break t}break;default:c=de,de=0,Zn=null,zr(e,o,l,c)}}IE(),r=ze;break}catch(u){B_(e,u)}while(!0);return t&&e.shellSuspendCounter++,vs=tr=null,oe=i,Lt.H=s,Lt.A=a,Kt===null&&(ve=null,Qt=0,Vu()),r}function IE(){for(;Kt!==null;)H_(Kt)}function PE(e,t){var n=oe;oe|=2;var i=F_(),s=k_();ve!==e||Qt!==t?(wu=null,Au=jn()+500,to(e,t)):oo=Dl(e,t);t:do try{if(de!==0&&Kt!==null){t=Kt;var a=Zn;e:switch(de){case 1:de=0,Zn=null,zr(e,t,a,1);break;case 2:case 9:if(Ny(a)){de=0,Zn=null,ex(t);break}t=function(){de!==2&&de!==9||ve!==e||(de=7),ji(e)},a.then(t,t);break t;case 3:de=7;break t;case 4:de=5;break t;case 7:Ny(a)?(de=0,Zn=null,ex(t)):(de=0,Zn=null,zr(e,t,a,7));break;case 5:var r=null;switch(Kt.tag){case 26:r=Kt.memoizedState;case 5:case 27:var o=Kt;if(r?ob(r):o.stateNode.complete){de=0,Zn=null;var l=o.sibling;if(l!==null)Kt=l;else{var c=o.return;c!==null?(Kt=c,Qu(c)):Kt=null}break e}}de=0,Zn=null,zr(e,t,a,5);break;case 6:de=0,Zn=null,zr(e,t,a,6);break;case 8:Bm(),ze=6;break t;default:throw Error(tt(462))}}BE();break}catch(u){B_(e,u)}while(!0);return vs=tr=null,Lt.H=i,Lt.A=s,oe=n,Kt!==null?0:(ve=null,Qt=0,Vu(),ze)}function BE(){for(;Kt!==null&&!rM();)H_(Kt)}function H_(e){var t=p_(e.alternate,e,ws);e.memoizedProps=e.pendingProps,t===null?Qu(e):Kt=t}function ex(e){var t=e,n=t.alternate;switch(t.tag){case 15:case 0:t=Zy(n,t,t.pendingProps,t.type,void 0,Qt);break;case 11:t=Zy(n,t,t.pendingProps,t.type.render,t.ref,Qt);break;case 5:Sm(t);default:m_(n,t),t=Kt=mv(t,ws),t=p_(n,t,ws)}e.memoizedProps=e.pendingProps,t===null?Qu(e):Kt=t}function zr(e,t,n,i){vs=tr=null,Sm(t),Gr=null,_l=0;var s=t.return;try{if(TE(e,s,t,n,Qt)){ze=1,Mu(e,gi(n,e.current)),Kt=null;return}}catch(a){if(s!==null)throw Kt=s,a;ze=1,Mu(e,gi(n,e.current)),Kt=null;return}t.flags&32768?($t||i===1?e=!0:oo||(Qt&536870912)!==0?e=!1:(Qs=e=!0,(i===2||i===9||i===3||i===6)&&(i=ii.current,i!==null&&i.tag===13&&(i.flags|=16384))),V_(t,e)):Qu(t)}function Qu(e){var t=e;do{if((t.flags&32768)!==0){V_(t,Qs);return}e=t.return;var n=CE(t.alternate,t,ws);if(n!==null){Kt=n;return}if(t=t.sibling,t!==null){Kt=t;return}Kt=t=e}while(t!==null);ze===0&&(ze=5)}function V_(e,t){do{var n=RE(e.alternate,e);if(n!==null){n.flags&=32767,Kt=n;return}if(n=e.return,n!==null&&(n.flags|=32768,n.subtreeFlags=0,n.deletions=null),!t&&(e=e.sibling,e!==null)){Kt=e;return}Kt=e=n}while(e!==null);ze=6,Kt=null}function nx(e,t,n,i,s,a,r,o,l){e.cancelPendingCommit=null;do ju();while(en!==0);if((oe&6)!==0)throw Error(tt(327));if(t!==null){if(t===e.current)throw Error(tt(177));if(a=t.lanes|t.childLanes,a|=lm,gM(e,n,a,r,o,l),e===ve&&(Kt=ve=null,Qt=0),$r=t,aa=e,Ss=n,Pp=a,Bp=s,O_=i,(t.subtreeFlags&10256)!==0||(t.flags&10256)!==0?(e.callbackNode=null,e.callbackPriority=0,HE(fu,function(){return Y_(),null})):(e.callbackNode=null,e.callbackPriority=0),i=(t.flags&13878)!==0,(t.subtreeFlags&13878)!==0||i){i=Lt.T,Lt.T=null,s=le.p,le.p=2,r=oe,oe|=4;try{DE(e,t,n)}finally{oe=r,le.p=s,Lt.T=i}}en=1,G_(),W_(),X_()}}function G_(){if(en===1){en=0;var e=aa,t=$r,n=(t.flags&13878)!==0;if((t.subtreeFlags&13878)!==0||n){n=Lt.T,Lt.T=null;var i=le.p;le.p=2;var s=oe;oe|=4;try{A_(t,e);var a=Vp,r=ov(e.containerInfo),o=a.focusedElem,l=a.selectionRange;if(r!==o&&o&&o.ownerDocument&&rv(o.ownerDocument.documentElement,o)){if(l!==null&&om(o)){var c=l.start,u=l.end;if(u===void 0&&(u=c),"selectionStart"in o)o.selectionStart=c,o.selectionEnd=Math.min(u,o.value.length);else{var f=o.ownerDocument||document,h=f&&f.defaultView||window;if(h.getSelection){var d=h.getSelection(),m=o.textContent.length,b=Math.min(l.start,m),g=l.end===void 0?b:Math.min(l.end,m);!d.extend&&b>g&&(r=g,g=b,b=r);var p=Ey(o,b),y=Ey(o,g);if(p&&y&&(d.rangeCount!==1||d.anchorNode!==p.node||d.anchorOffset!==p.offset||d.focusNode!==y.node||d.focusOffset!==y.offset)){var S=f.createRange();S.setStart(p.node,p.offset),d.removeAllRanges(),b>g?(d.addRange(S),d.extend(y.node,y.offset)):(S.setEnd(y.node,y.offset),d.addRange(S))}}}}for(f=[],d=o;d=d.parentNode;)d.nodeType===1&&f.push({element:d,left:d.scrollLeft,top:d.scrollTop});for(typeof o.focus=="function"&&o.focus(),o=0;o<f.length;o++){var v=f[o];v.element.scrollLeft=v.left,v.element.scrollTop=v.top}}Pu=!!Hp,Vp=Hp=null}finally{oe=s,le.p=i,Lt.T=n}}e.current=t,en=2}}function W_(){if(en===2){en=0;var e=aa,t=$r,n=(t.flags&8772)!==0;if((t.subtreeFlags&8772)!==0||n){n=Lt.T,Lt.T=null;var i=le.p;le.p=2;var s=oe;oe|=4;try{b_(e,t.alternate,t)}finally{oe=s,le.p=i,Lt.T=n}}en=3}}function X_(){if(en===4||en===3){en=0,oM();var e=aa,t=$r,n=Ss,i=O_;(t.subtreeFlags&10256)!==0||(t.flags&10256)!==0?en=5:(en=0,$r=aa=null,q_(e,e.pendingLanes));var s=e.pendingLanes;if(s===0&&(sa=null),tm(n),t=t.stateNode,$n&&typeof $n.onCommitFiberRoot=="function")try{$n.onCommitFiberRoot(Rl,t,void 0,(t.current.flags&128)===128)}catch{}if(i!==null){t=Lt.T,s=le.p,le.p=2,Lt.T=null;try{for(var a=e.onRecoverableError,r=0;r<i.length;r++){var o=i[r];a(o.value,{componentStack:o.stack})}}finally{Lt.T=t,le.p=s}}(Ss&3)!==0&&ju(),ji(e),s=e.pendingLanes,(n&261930)!==0&&(s&42)!==0?e===zp?fl++:(fl=0,zp=e):fl=0,Bl(0,!1)}}function q_(e,t){(e.pooledCacheLanes&=t)===0&&(t=e.pooledCache,t!=null&&(e.pooledCache=null,Ol(t)))}function ju(){return G_(),W_(),X_(),Y_()}function Y_(){if(en!==5)return!1;var e=aa,t=Pp;Pp=0;var n=tm(Ss),i=Lt.T,s=le.p;try{le.p=32>n?32:n,Lt.T=null,n=Bp,Bp=null;var a=aa,r=Ss;if(en=0,$r=aa=null,Ss=0,(oe&6)!==0)throw Error(tt(331));var o=oe;if(oe|=4,N_(a.current),C_(a,a.current,r,n),oe=o,Bl(0,!1),$n&&typeof $n.onPostCommitFiberRoot=="function")try{$n.onPostCommitFiberRoot(Rl,a)}catch{}return!0}finally{le.p=s,Lt.T=i,q_(e,t)}}function ix(e,t,n){t=gi(n,t),t=Np(e.stateNode,t,2),e=ia(e,t,2),e!==null&&(Nl(e,2),ji(e))}function pe(e,t,n){if(e.tag===3)ix(e,e,n);else for(;t!==null;){if(t.tag===3){ix(t,e,n);break}else if(t.tag===1){var i=t.stateNode;if(typeof t.type.getDerivedStateFromError=="function"||typeof i.componentDidCatch=="function"&&(sa===null||!sa.has(i))){e=gi(n,e),n=l_(2),i=ia(t,n,2),i!==null&&(c_(n,i,t,e),Nl(i,2),ji(i));break}}t=t.return}}function Kd(e,t,n){var i=e.pingCache;if(i===null){i=e.pingCache=new UE;var s=new Set;i.set(t,s)}else s=i.get(t),s===void 0&&(s=new Set,i.set(t,s));s.has(n)||(Im=!0,s.add(n),e=zE.bind(null,e,t,n),t.then(e,e))}function zE(e,t,n){var i=e.pingCache;i!==null&&i.delete(t),e.pingedLanes|=e.suspendedLanes&n,e.warmLanes&=~n,ve===e&&(Qt&n)===n&&(ze===4||ze===3&&(Qt&62914560)===Qt&&300>jn()-Ku?(oe&2)===0&&to(e,0):Pm|=n,jr===Qt&&(jr=0)),ji(e)}function Z_(e,t){t===0&&(t=Fx()),e=$a(e,t),e!==null&&(Nl(e,t),ji(e))}function FE(e){var t=e.memoizedState,n=0;t!==null&&(n=t.retryLane),Z_(e,n)}function kE(e,t){var n=0;switch(e.tag){case 31:case 13:var i=e.stateNode,s=e.memoizedState;s!==null&&(n=s.retryLane);break;case 19:i=e.stateNode;break;case 22:i=e.stateNode._retryCache;break;default:throw Error(tt(314))}i!==null&&i.delete(t),Z_(e,n)}function HE(e,t){return jp(e,t)}var Ru=null,Ar=null,Fp=!1,Du=!1,Jd=!1,$s=0;function ji(e){e!==Ar&&e.next===null&&(Ar===null?Ru=Ar=e:Ar=Ar.next=e),Du=!0,Fp||(Fp=!0,GE())}function Bl(e,t){if(!Jd&&Du){Jd=!0;do for(var n=!1,i=Ru;i!==null;){if(!t)if(e!==0){var s=i.pendingLanes;if(s===0)var a=0;else{var r=i.suspendedLanes,o=i.pingedLanes;a=(1<<31-ti(42|e)+1)-1,a&=s&~(r&~o),a=a&201326741?a&201326741|1:a?a|2:0}a!==0&&(n=!0,sx(i,a))}else a=Qt,a=zu(i,i===ve?a:0,i.cancelPendingCommit!==null||i.timeoutHandle!==-1),(a&3)===0||Dl(i,a)||(n=!0,sx(i,a));i=i.next}while(n);Jd=!1}}function VE(){K_()}function K_(){Du=Fp=!1;var e=0;$s!==0&&QE()&&(e=$s);for(var t=jn(),n=null,i=Ru;i!==null;){var s=i.next,a=J_(i,t);a===0?(i.next=null,n===null?Ru=s:n.next=s,s===null&&(Ar=n)):(n=i,(e!==0||(a&3)!==0)&&(Du=!0)),i=s}en!==0&&en!==5||Bl(e,!1),$s!==0&&($s=0)}function J_(e,t){for(var n=e.suspendedLanes,i=e.pingedLanes,s=e.expirationTimes,a=e.pendingLanes&-62914561;0<a;){var r=31-ti(a),o=1<<r,l=s[r];l===-1?((o&n)===0||(o&i)!==0)&&(s[r]=mM(o,t)):l<=t&&(e.expiredLanes|=o),a&=~o}if(t=ve,n=Qt,n=zu(e,e===t?n:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),i=e.callbackNode,n===0||e===t&&(de===2||de===9)||e.cancelPendingCommit!==null)return i!==null&&i!==null&&Td(i),e.callbackNode=null,e.callbackPriority=0;if((n&3)===0||Dl(e,n)){if(t=n&-n,t===e.callbackPriority)return t;switch(i!==null&&Td(i),tm(n)){case 2:case 8:n=Bx;break;case 32:n=fu;break;case 268435456:n=zx;break;default:n=fu}return i=Q_.bind(null,e),n=jp(n,i),e.callbackPriority=t,e.callbackNode=n,t}return i!==null&&i!==null&&Td(i),e.callbackPriority=2,e.callbackNode=null,2}function Q_(e,t){if(en!==0&&en!==5)return e.callbackNode=null,e.callbackPriority=0,null;var n=e.callbackNode;if(ju()&&e.callbackNode!==n)return null;var i=Qt;return i=zu(e,e===ve?i:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),i===0?null:(P_(e,i,t),J_(e,jn()),e.callbackNode!=null&&e.callbackNode===n?Q_.bind(null,e):null)}function sx(e,t){if(ju())return null;P_(e,t,!0)}function GE(){$E(function(){(oe&6)!==0?jp(Px,VE):K_()})}function zm(){if($s===0){var e=Kr;e===0&&(e=Nc,Nc<<=1,(Nc&261888)===0&&(Nc=256)),$s=e}return $s}function ax(e){return e==null||typeof e=="symbol"||typeof e=="boolean"?null:typeof e=="function"?e:Kc(""+e)}function rx(e,t){var n=t.ownerDocument.createElement("input");return n.name=t.name,n.value=t.value,e.id&&n.setAttribute("form",e.id),t.parentNode.insertBefore(n,t),e=new FormData(e),n.parentNode.removeChild(n),e}function WE(e,t,n,i,s){if(t==="submit"&&n&&n.stateNode===s){var a=ax((s[Hn]||null).action),r=i.submitter;r&&(t=(t=r[Hn]||null)?ax(t.formAction):r.getAttribute("formAction"),t!==null&&(a=t,r=null));var o=new Fu("action","action",null,i,s);e.push({event:o,listeners:[{instance:null,listener:function(){if(i.defaultPrevented){if($s!==0){var l=r?rx(s,r):new FormData(s);Rp(n,{pending:!0,data:l,method:s.method,action:a},null,l)}}else typeof a=="function"&&(o.preventDefault(),l=r?rx(s,r):new FormData(s),Rp(n,{pending:!0,data:l,method:s.method,action:a},a,l))},currentTarget:s}]})}}for(Gc=0;Gc<yp.length;Gc++)Wc=yp[Gc],ox=Wc.toLowerCase(),lx=Wc[0].toUpperCase()+Wc.slice(1),Ni(ox,"on"+lx);var Wc,ox,lx,Gc;Ni(cv,"onAnimationEnd");Ni(uv,"onAnimationIteration");Ni(hv,"onAnimationStart");Ni("dblclick","onDoubleClick");Ni("focusin","onFocus");Ni("focusout","onBlur");Ni(lE,"onTransitionRun");Ni(cE,"onTransitionStart");Ni(uE,"onTransitionCancel");Ni(fv,"onTransitionEnd");Yr("onMouseEnter",["mouseout","mouseover"]);Yr("onMouseLeave",["mouseout","mouseover"]);Yr("onPointerEnter",["pointerout","pointerover"]);Yr("onPointerLeave",["pointerout","pointerover"]);Ja("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));Ja("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));Ja("onBeforeInput",["compositionend","keypress","textInput","paste"]);Ja("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));Ja("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));Ja("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Ml="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),XE=new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(Ml));function j_(e,t){t=(t&4)!==0;for(var n=0;n<e.length;n++){var i=e[n],s=i.event;i=i.listeners;t:{var a=void 0;if(t)for(var r=i.length-1;0<=r;r--){var o=i[r],l=o.instance,c=o.currentTarget;if(o=o.listener,l!==a&&s.isPropagationStopped())break t;a=o,s.currentTarget=c;try{a(s)}catch(u){pu(u)}s.currentTarget=null,a=l}else for(r=0;r<i.length;r++){if(o=i[r],l=o.instance,c=o.currentTarget,o=o.listener,l!==a&&s.isPropagationStopped())break t;a=o,s.currentTarget=c;try{a(s)}catch(u){pu(u)}s.currentTarget=null,a=l}}}}function Zt(e,t){var n=t[cp];n===void 0&&(n=t[cp]=new Set);var i=e+"__bubble";n.has(i)||($_(t,e,2,!1),n.add(i))}function Qd(e,t,n){var i=0;t&&(i|=4),$_(n,e,i,t)}var Xc="_reactListening"+Math.random().toString(36).slice(2);function Fm(e){if(!e[Xc]){e[Xc]=!0,Wx.forEach(function(n){n!=="selectionchange"&&(XE.has(n)||Qd(n,!1,e),Qd(n,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[Xc]||(t[Xc]=!0,Qd("selectionchange",!1,t))}}function $_(e,t,n,i){switch(fb(t)){case 2:var s=vT;break;case 8:s=_T;break;default:s=Gm}n=s.bind(null,t,n,e),s=void 0,!pp||t!=="touchstart"&&t!=="touchmove"&&t!=="wheel"||(s=!0),i?s!==void 0?e.addEventListener(t,n,{capture:!0,passive:s}):e.addEventListener(t,n,!0):s!==void 0?e.addEventListener(t,n,{passive:s}):e.addEventListener(t,n,!1)}function jd(e,t,n,i,s){var a=i;if((t&1)===0&&(t&2)===0&&i!==null)t:for(;;){if(i===null)return;var r=i.tag;if(r===3||r===4){var o=i.stateNode.containerInfo;if(o===s)break;if(r===4)for(r=i.return;r!==null;){var l=r.tag;if((l===3||l===4)&&r.stateNode.containerInfo===s)return;r=r.return}for(;o!==null;){if(r=Rr(o),r===null)return;if(l=r.tag,l===5||l===6||l===26||l===27){i=a=r;continue t}o=o.parentNode}}i=i.return}jx(function(){var c=a,u=im(n),f=[];t:{var h=dv.get(e);if(h!==void 0){var d=Fu,m=e;switch(e){case"keypress":if(Qc(n)===0)break t;case"keydown":case"keyup":d=kM;break;case"focusin":m="focus",d=Dd;break;case"focusout":m="blur",d=Dd;break;case"beforeblur":case"afterblur":d=Dd;break;case"click":if(n.button===2)break t;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":d=my;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":d=CM;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":d=GM;break;case cv:case uv:case hv:d=NM;break;case fv:d=XM;break;case"scroll":case"scrollend":d=AM;break;case"wheel":d=YM;break;case"copy":case"cut":case"paste":d=UM;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":d=yy;break;case"toggle":case"beforetoggle":d=KM}var b=(t&4)!==0,g=!b&&(e==="scroll"||e==="scrollend"),p=b?h!==null?h+"Capture":null:h;b=[];for(var y=c,S;y!==null;){var v=y;if(S=v.stateNode,v=v.tag,v!==5&&v!==26&&v!==27||S===null||p===null||(v=ml(y,p),v!=null&&b.push(El(y,v,S))),g)break;y=y.return}0<b.length&&(h=new d(h,m,null,n,u),f.push({event:h,listeners:b}))}}if((t&7)===0){t:{if(h=e==="mouseover"||e==="pointerover",d=e==="mouseout"||e==="pointerout",h&&n!==dp&&(m=n.relatedTarget||n.fromElement)&&(Rr(m)||m[io]))break t;if((d||h)&&(h=u.window===u?u:(h=u.ownerDocument)?h.defaultView||h.parentWindow:window,d?(m=n.relatedTarget||n.toElement,d=c,m=m?Rr(m):null,m!==null&&(g=Cl(m),b=m.tag,m!==g||b!==5&&b!==27&&b!==6)&&(m=null)):(d=null,m=c),d!==m)){if(b=my,v="onMouseLeave",p="onMouseEnter",y="mouse",(e==="pointerout"||e==="pointerover")&&(b=yy,v="onPointerLeave",p="onPointerEnter",y="pointer"),g=d==null?h:jo(d),S=m==null?h:jo(m),h=new b(v,y+"leave",d,n,u),h.target=g,h.relatedTarget=S,v=null,Rr(u)===c&&(b=new b(p,y+"enter",m,n,u),b.target=S,b.relatedTarget=g,v=b),g=v,d&&m)e:{for(b=qE,p=d,y=m,S=0,v=p;v;v=b(v))S++;v=0;for(var E=y;E;E=b(E))v++;for(;0<S-v;)p=b(p),S--;for(;0<v-S;)y=b(y),v--;for(;S--;){if(p===y||y!==null&&p===y.alternate){b=p;break e}p=b(p),y=b(y)}b=null}else b=null;d!==null&&cx(f,h,d,b,!1),m!==null&&g!==null&&cx(f,g,m,b,!0)}}t:{if(h=c?jo(c):window,d=h.nodeName&&h.nodeName.toLowerCase(),d==="select"||d==="input"&&h.type==="file")var T=by;else if(_y(h))if(sv)T=aE;else{T=iE;var C=nE}else d=h.nodeName,!d||d.toLowerCase()!=="input"||h.type!=="checkbox"&&h.type!=="radio"?c&&nm(c.elementType)&&(T=by):T=sE;if(T&&(T=T(e,c))){iv(f,T,n,u);break t}C&&C(e,h,c),e==="focusout"&&c&&h.type==="number"&&c.memoizedProps.value!=null&&fp(h,"number",h.value)}switch(C=c?jo(c):window,e){case"focusin":(_y(C)||C.contentEditable==="true")&&(Lr=C,mp=c,il=null);break;case"focusout":il=mp=Lr=null;break;case"mousedown":gp=!0;break;case"contextmenu":case"mouseup":case"dragend":gp=!1,Ty(f,n,u);break;case"selectionchange":if(oE)break;case"keydown":case"keyup":Ty(f,n,u)}var x;if(rm)t:{switch(e){case"compositionstart":var A="onCompositionStart";break t;case"compositionend":A="onCompositionEnd";break t;case"compositionupdate":A="onCompositionUpdate";break t}A=void 0}else Nr?ev(e,n)&&(A="onCompositionEnd"):e==="keydown"&&n.keyCode===229&&(A="onCompositionStart");A&&(tv&&n.locale!=="ko"&&(Nr||A!=="onCompositionStart"?A==="onCompositionEnd"&&Nr&&(x=$x()):(Js=u,sm="value"in Js?Js.value:Js.textContent,Nr=!0)),C=Nu(c,A),0<C.length&&(A=new gy(A,e,null,n,u),f.push({event:A,listeners:C}),x?A.data=x:(x=nv(n),x!==null&&(A.data=x)))),(x=QM?jM(e,n):$M(e,n))&&(A=Nu(c,"onBeforeInput"),0<A.length&&(C=new gy("onBeforeInput","beforeinput",null,n,u),f.push({event:C,listeners:A}),C.data=x)),WE(f,e,c,n,u)}j_(f,t)})}function El(e,t,n){return{instance:e,listener:t,currentTarget:n}}function Nu(e,t){for(var n=t+"Capture",i=[];e!==null;){var s=e,a=s.stateNode;if(s=s.tag,s!==5&&s!==26&&s!==27||a===null||(s=ml(e,n),s!=null&&i.unshift(El(e,s,a)),s=ml(e,t),s!=null&&i.push(El(e,s,a))),e.tag===3)return i;e=e.return}return[]}function qE(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5&&e.tag!==27);return e||null}function cx(e,t,n,i,s){for(var a=t._reactName,r=[];n!==null&&n!==i;){var o=n,l=o.alternate,c=o.stateNode;if(o=o.tag,l!==null&&l===i)break;o!==5&&o!==26&&o!==27||c===null||(l=c,s?(c=ml(n,a),c!=null&&r.unshift(El(n,c,l))):s||(c=ml(n,a),c!=null&&r.push(El(n,c,l)))),n=n.return}r.length!==0&&e.push({event:t,listeners:r})}var YE=/\r\n?/g,ZE=/\u0000|\uFFFD/g;function ux(e){return(typeof e=="string"?e:""+e).replace(YE,`
`).replace(ZE,"")}function tb(e,t){return t=ux(t),ux(e)===t}function ge(e,t,n,i,s,a){switch(n){case"children":typeof i=="string"?t==="body"||t==="textarea"&&i===""||Zr(e,i):(typeof i=="number"||typeof i=="bigint")&&t!=="body"&&Zr(e,""+i);break;case"className":Oc(e,"class",i);break;case"tabIndex":Oc(e,"tabindex",i);break;case"dir":case"role":case"viewBox":case"width":case"height":Oc(e,n,i);break;case"style":Qx(e,i,a);break;case"data":if(t!=="object"){Oc(e,"data",i);break}case"src":case"href":if(i===""&&(t!=="a"||n!=="href")){e.removeAttribute(n);break}if(i==null||typeof i=="function"||typeof i=="symbol"||typeof i=="boolean"){e.removeAttribute(n);break}i=Kc(""+i),e.setAttribute(n,i);break;case"action":case"formAction":if(typeof i=="function"){e.setAttribute(n,"javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");break}else typeof a=="function"&&(n==="formAction"?(t!=="input"&&ge(e,t,"name",s.name,s,null),ge(e,t,"formEncType",s.formEncType,s,null),ge(e,t,"formMethod",s.formMethod,s,null),ge(e,t,"formTarget",s.formTarget,s,null)):(ge(e,t,"encType",s.encType,s,null),ge(e,t,"method",s.method,s,null),ge(e,t,"target",s.target,s,null)));if(i==null||typeof i=="symbol"||typeof i=="boolean"){e.removeAttribute(n);break}i=Kc(""+i),e.setAttribute(n,i);break;case"onClick":i!=null&&(e.onclick=xs);break;case"onScroll":i!=null&&Zt("scroll",e);break;case"onScrollEnd":i!=null&&Zt("scrollend",e);break;case"dangerouslySetInnerHTML":if(i!=null){if(typeof i!="object"||!("__html"in i))throw Error(tt(61));if(n=i.__html,n!=null){if(s.children!=null)throw Error(tt(60));e.innerHTML=n}}break;case"multiple":e.multiple=i&&typeof i!="function"&&typeof i!="symbol";break;case"muted":e.muted=i&&typeof i!="function"&&typeof i!="symbol";break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"defaultValue":case"defaultChecked":case"innerHTML":case"ref":break;case"autoFocus":break;case"xlinkHref":if(i==null||typeof i=="function"||typeof i=="boolean"||typeof i=="symbol"){e.removeAttribute("xlink:href");break}n=Kc(""+i),e.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",n);break;case"contentEditable":case"spellCheck":case"draggable":case"value":case"autoReverse":case"externalResourcesRequired":case"focusable":case"preserveAlpha":i!=null&&typeof i!="function"&&typeof i!="symbol"?e.setAttribute(n,""+i):e.removeAttribute(n);break;case"inert":case"allowFullScreen":case"async":case"autoPlay":case"controls":case"default":case"defer":case"disabled":case"disablePictureInPicture":case"disableRemotePlayback":case"formNoValidate":case"hidden":case"loop":case"noModule":case"noValidate":case"open":case"playsInline":case"readOnly":case"required":case"reversed":case"scoped":case"seamless":case"itemScope":i&&typeof i!="function"&&typeof i!="symbol"?e.setAttribute(n,""):e.removeAttribute(n);break;case"capture":case"download":i===!0?e.setAttribute(n,""):i!==!1&&i!=null&&typeof i!="function"&&typeof i!="symbol"?e.setAttribute(n,i):e.removeAttribute(n);break;case"cols":case"rows":case"size":case"span":i!=null&&typeof i!="function"&&typeof i!="symbol"&&!isNaN(i)&&1<=i?e.setAttribute(n,i):e.removeAttribute(n);break;case"rowSpan":case"start":i==null||typeof i=="function"||typeof i=="symbol"||isNaN(i)?e.removeAttribute(n):e.setAttribute(n,i);break;case"popover":Zt("beforetoggle",e),Zt("toggle",e),Zc(e,"popover",i);break;case"xlinkActuate":us(e,"http://www.w3.org/1999/xlink","xlink:actuate",i);break;case"xlinkArcrole":us(e,"http://www.w3.org/1999/xlink","xlink:arcrole",i);break;case"xlinkRole":us(e,"http://www.w3.org/1999/xlink","xlink:role",i);break;case"xlinkShow":us(e,"http://www.w3.org/1999/xlink","xlink:show",i);break;case"xlinkTitle":us(e,"http://www.w3.org/1999/xlink","xlink:title",i);break;case"xlinkType":us(e,"http://www.w3.org/1999/xlink","xlink:type",i);break;case"xmlBase":us(e,"http://www.w3.org/XML/1998/namespace","xml:base",i);break;case"xmlLang":us(e,"http://www.w3.org/XML/1998/namespace","xml:lang",i);break;case"xmlSpace":us(e,"http://www.w3.org/XML/1998/namespace","xml:space",i);break;case"is":Zc(e,"is",i);break;case"innerText":case"textContent":break;default:(!(2<n.length)||n[0]!=="o"&&n[0]!=="O"||n[1]!=="n"&&n[1]!=="N")&&(n=EM.get(n)||n,Zc(e,n,i))}}function kp(e,t,n,i,s,a){switch(n){case"style":Qx(e,i,a);break;case"dangerouslySetInnerHTML":if(i!=null){if(typeof i!="object"||!("__html"in i))throw Error(tt(61));if(n=i.__html,n!=null){if(s.children!=null)throw Error(tt(60));e.innerHTML=n}}break;case"children":typeof i=="string"?Zr(e,i):(typeof i=="number"||typeof i=="bigint")&&Zr(e,""+i);break;case"onScroll":i!=null&&Zt("scroll",e);break;case"onScrollEnd":i!=null&&Zt("scrollend",e);break;case"onClick":i!=null&&(e.onclick=xs);break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"innerHTML":case"ref":break;case"innerText":case"textContent":break;default:if(!Xx.hasOwnProperty(n))t:{if(n[0]==="o"&&n[1]==="n"&&(s=n.endsWith("Capture"),t=n.slice(2,s?n.length-7:void 0),a=e[Hn]||null,a=a!=null?a[n]:null,typeof a=="function"&&e.removeEventListener(t,a,s),typeof i=="function")){typeof a!="function"&&a!==null&&(n in e?e[n]=null:e.hasAttribute(n)&&e.removeAttribute(n)),e.addEventListener(t,i,s);break t}n in e?e[n]=i:i===!0?e.setAttribute(n,""):Zc(e,n,i)}}}function xn(e,t,n){switch(t){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"img":Zt("error",e),Zt("load",e);var i=!1,s=!1,a;for(a in n)if(n.hasOwnProperty(a)){var r=n[a];if(r!=null)switch(a){case"src":i=!0;break;case"srcSet":s=!0;break;case"children":case"dangerouslySetInnerHTML":throw Error(tt(137,t));default:ge(e,t,a,r,n,null)}}s&&ge(e,t,"srcSet",n.srcSet,n,null),i&&ge(e,t,"src",n.src,n,null);return;case"input":Zt("invalid",e);var o=a=r=s=null,l=null,c=null;for(i in n)if(n.hasOwnProperty(i)){var u=n[i];if(u!=null)switch(i){case"name":s=u;break;case"type":r=u;break;case"checked":l=u;break;case"defaultChecked":c=u;break;case"value":a=u;break;case"defaultValue":o=u;break;case"children":case"dangerouslySetInnerHTML":if(u!=null)throw Error(tt(137,t));break;default:ge(e,t,i,u,n,null)}}Zx(e,a,o,l,c,r,s,!1);return;case"select":Zt("invalid",e),i=r=a=null;for(s in n)if(n.hasOwnProperty(s)&&(o=n[s],o!=null))switch(s){case"value":a=o;break;case"defaultValue":r=o;break;case"multiple":i=o;default:ge(e,t,s,o,n,null)}t=a,n=r,e.multiple=!!i,t!=null?kr(e,!!i,t,!1):n!=null&&kr(e,!!i,n,!0);return;case"textarea":Zt("invalid",e),a=s=i=null;for(r in n)if(n.hasOwnProperty(r)&&(o=n[r],o!=null))switch(r){case"value":i=o;break;case"defaultValue":s=o;break;case"children":a=o;break;case"dangerouslySetInnerHTML":if(o!=null)throw Error(tt(91));break;default:ge(e,t,r,o,n,null)}Jx(e,i,s,a);return;case"option":for(l in n)n.hasOwnProperty(l)&&(i=n[l],i!=null)&&(l==="selected"?e.selected=i&&typeof i!="function"&&typeof i!="symbol":ge(e,t,l,i,n,null));return;case"dialog":Zt("beforetoggle",e),Zt("toggle",e),Zt("cancel",e),Zt("close",e);break;case"iframe":case"object":Zt("load",e);break;case"video":case"audio":for(i=0;i<Ml.length;i++)Zt(Ml[i],e);break;case"image":Zt("error",e),Zt("load",e);break;case"details":Zt("toggle",e);break;case"embed":case"source":case"link":Zt("error",e),Zt("load",e);case"area":case"base":case"br":case"col":case"hr":case"keygen":case"meta":case"param":case"track":case"wbr":case"menuitem":for(c in n)if(n.hasOwnProperty(c)&&(i=n[c],i!=null))switch(c){case"children":case"dangerouslySetInnerHTML":throw Error(tt(137,t));default:ge(e,t,c,i,n,null)}return;default:if(nm(t)){for(u in n)n.hasOwnProperty(u)&&(i=n[u],i!==void 0&&kp(e,t,u,i,n,void 0));return}}for(o in n)n.hasOwnProperty(o)&&(i=n[o],i!=null&&ge(e,t,o,i,n,null))}function KE(e,t,n,i){switch(t){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"input":var s=null,a=null,r=null,o=null,l=null,c=null,u=null;for(d in n){var f=n[d];if(n.hasOwnProperty(d)&&f!=null)switch(d){case"checked":break;case"value":break;case"defaultValue":l=f;default:i.hasOwnProperty(d)||ge(e,t,d,null,i,f)}}for(var h in i){var d=i[h];if(f=n[h],i.hasOwnProperty(h)&&(d!=null||f!=null))switch(h){case"type":a=d;break;case"name":s=d;break;case"checked":c=d;break;case"defaultChecked":u=d;break;case"value":r=d;break;case"defaultValue":o=d;break;case"children":case"dangerouslySetInnerHTML":if(d!=null)throw Error(tt(137,t));break;default:d!==f&&ge(e,t,h,d,i,f)}}hp(e,r,o,l,c,u,a,s);return;case"select":d=r=o=h=null;for(a in n)if(l=n[a],n.hasOwnProperty(a)&&l!=null)switch(a){case"value":break;case"multiple":d=l;default:i.hasOwnProperty(a)||ge(e,t,a,null,i,l)}for(s in i)if(a=i[s],l=n[s],i.hasOwnProperty(s)&&(a!=null||l!=null))switch(s){case"value":h=a;break;case"defaultValue":o=a;break;case"multiple":r=a;default:a!==l&&ge(e,t,s,a,i,l)}t=o,n=r,i=d,h!=null?kr(e,!!n,h,!1):!!i!=!!n&&(t!=null?kr(e,!!n,t,!0):kr(e,!!n,n?[]:"",!1));return;case"textarea":d=h=null;for(o in n)if(s=n[o],n.hasOwnProperty(o)&&s!=null&&!i.hasOwnProperty(o))switch(o){case"value":break;case"children":break;default:ge(e,t,o,null,i,s)}for(r in i)if(s=i[r],a=n[r],i.hasOwnProperty(r)&&(s!=null||a!=null))switch(r){case"value":h=s;break;case"defaultValue":d=s;break;case"children":break;case"dangerouslySetInnerHTML":if(s!=null)throw Error(tt(91));break;default:s!==a&&ge(e,t,r,s,i,a)}Kx(e,h,d);return;case"option":for(var m in n)h=n[m],n.hasOwnProperty(m)&&h!=null&&!i.hasOwnProperty(m)&&(m==="selected"?e.selected=!1:ge(e,t,m,null,i,h));for(l in i)h=i[l],d=n[l],i.hasOwnProperty(l)&&h!==d&&(h!=null||d!=null)&&(l==="selected"?e.selected=h&&typeof h!="function"&&typeof h!="symbol":ge(e,t,l,h,i,d));return;case"img":case"link":case"area":case"base":case"br":case"col":case"embed":case"hr":case"keygen":case"meta":case"param":case"source":case"track":case"wbr":case"menuitem":for(var b in n)h=n[b],n.hasOwnProperty(b)&&h!=null&&!i.hasOwnProperty(b)&&ge(e,t,b,null,i,h);for(c in i)if(h=i[c],d=n[c],i.hasOwnProperty(c)&&h!==d&&(h!=null||d!=null))switch(c){case"children":case"dangerouslySetInnerHTML":if(h!=null)throw Error(tt(137,t));break;default:ge(e,t,c,h,i,d)}return;default:if(nm(t)){for(var g in n)h=n[g],n.hasOwnProperty(g)&&h!==void 0&&!i.hasOwnProperty(g)&&kp(e,t,g,void 0,i,h);for(u in i)h=i[u],d=n[u],!i.hasOwnProperty(u)||h===d||h===void 0&&d===void 0||kp(e,t,u,h,i,d);return}}for(var p in n)h=n[p],n.hasOwnProperty(p)&&h!=null&&!i.hasOwnProperty(p)&&ge(e,t,p,null,i,h);for(f in i)h=i[f],d=n[f],!i.hasOwnProperty(f)||h===d||h==null&&d==null||ge(e,t,f,h,i,d)}function hx(e){switch(e){case"css":case"script":case"font":case"img":case"image":case"input":case"link":return!0;default:return!1}}function JE(){if(typeof performance.getEntriesByType=="function"){for(var e=0,t=0,n=performance.getEntriesByType("resource"),i=0;i<n.length;i++){var s=n[i],a=s.transferSize,r=s.initiatorType,o=s.duration;if(a&&o&&hx(r)){for(r=0,o=s.responseEnd,i+=1;i<n.length;i++){var l=n[i],c=l.startTime;if(c>o)break;var u=l.transferSize,f=l.initiatorType;u&&hx(f)&&(l=l.responseEnd,r+=u*(l<o?1:(o-c)/(l-c)))}if(--i,t+=8*(a+r)/(s.duration/1e3),e++,10<e)break}}if(0<e)return t/e/1e6}return navigator.connection&&(e=navigator.connection.downlink,typeof e=="number")?e:5}var Hp=null,Vp=null;function Lu(e){return e.nodeType===9?e:e.ownerDocument}function fx(e){switch(e){case"http://www.w3.org/2000/svg":return 1;case"http://www.w3.org/1998/Math/MathML":return 2;default:return 0}}function eb(e,t){if(e===0)switch(t){case"svg":return 1;case"math":return 2;default:return 0}return e===1&&t==="foreignObject"?0:e}function Gp(e,t){return e==="textarea"||e==="noscript"||typeof t.children=="string"||typeof t.children=="number"||typeof t.children=="bigint"||typeof t.dangerouslySetInnerHTML=="object"&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var $d=null;function QE(){var e=window.event;return e&&e.type==="popstate"?e===$d?!1:($d=e,!0):($d=null,!1)}var nb=typeof setTimeout=="function"?setTimeout:void 0,jE=typeof clearTimeout=="function"?clearTimeout:void 0,dx=typeof Promise=="function"?Promise:void 0,$E=typeof queueMicrotask=="function"?queueMicrotask:typeof dx<"u"?function(e){return dx.resolve(null).then(e).catch(tT)}:nb;function tT(e){setTimeout(function(){throw e})}function pa(e){return e==="head"}function px(e,t){var n=t,i=0;do{var s=n.nextSibling;if(e.removeChild(n),s&&s.nodeType===8)if(n=s.data,n==="/$"||n==="/&"){if(i===0){e.removeChild(s),no(t);return}i--}else if(n==="$"||n==="$?"||n==="$~"||n==="$!"||n==="&")i++;else if(n==="html")dl(e.ownerDocument.documentElement);else if(n==="head"){n=e.ownerDocument.head,dl(n);for(var a=n.firstChild;a;){var r=a.nextSibling,o=a.nodeName;a[Ll]||o==="SCRIPT"||o==="STYLE"||o==="LINK"&&a.rel.toLowerCase()==="stylesheet"||n.removeChild(a),a=r}}else n==="body"&&dl(e.ownerDocument.body);n=s}while(n);no(t)}function mx(e,t){var n=e;e=0;do{var i=n.nextSibling;if(n.nodeType===1?t?(n._stashedDisplay=n.style.display,n.style.display="none"):(n.style.display=n._stashedDisplay||"",n.getAttribute("style")===""&&n.removeAttribute("style")):n.nodeType===3&&(t?(n._stashedText=n.nodeValue,n.nodeValue=""):n.nodeValue=n._stashedText||""),i&&i.nodeType===8)if(n=i.data,n==="/$"){if(e===0)break;e--}else n!=="$"&&n!=="$?"&&n!=="$~"&&n!=="$!"||e++;n=i}while(n)}function Wp(e){var t=e.firstChild;for(t&&t.nodeType===10&&(t=t.nextSibling);t;){var n=t;switch(t=t.nextSibling,n.nodeName){case"HTML":case"HEAD":case"BODY":Wp(n),em(n);continue;case"SCRIPT":case"STYLE":continue;case"LINK":if(n.rel.toLowerCase()==="stylesheet")continue}e.removeChild(n)}}function eT(e,t,n,i){for(;e.nodeType===1;){var s=n;if(e.nodeName.toLowerCase()!==t.toLowerCase()){if(!i&&(e.nodeName!=="INPUT"||e.type!=="hidden"))break}else if(i){if(!e[Ll])switch(t){case"meta":if(!e.hasAttribute("itemprop"))break;return e;case"link":if(a=e.getAttribute("rel"),a==="stylesheet"&&e.hasAttribute("data-precedence"))break;if(a!==s.rel||e.getAttribute("href")!==(s.href==null||s.href===""?null:s.href)||e.getAttribute("crossorigin")!==(s.crossOrigin==null?null:s.crossOrigin)||e.getAttribute("title")!==(s.title==null?null:s.title))break;return e;case"style":if(e.hasAttribute("data-precedence"))break;return e;case"script":if(a=e.getAttribute("src"),(a!==(s.src==null?null:s.src)||e.getAttribute("type")!==(s.type==null?null:s.type)||e.getAttribute("crossorigin")!==(s.crossOrigin==null?null:s.crossOrigin))&&a&&e.hasAttribute("async")&&!e.hasAttribute("itemprop"))break;return e;default:return e}}else if(t==="input"&&e.type==="hidden"){var a=s.name==null?null:""+s.name;if(s.type==="hidden"&&e.getAttribute("name")===a)return e}else return e;if(e=vi(e.nextSibling),e===null)break}return null}function nT(e,t,n){if(t==="")return null;for(;e.nodeType!==3;)if((e.nodeType!==1||e.nodeName!=="INPUT"||e.type!=="hidden")&&!n||(e=vi(e.nextSibling),e===null))return null;return e}function ib(e,t){for(;e.nodeType!==8;)if((e.nodeType!==1||e.nodeName!=="INPUT"||e.type!=="hidden")&&!t||(e=vi(e.nextSibling),e===null))return null;return e}function Xp(e){return e.data==="$?"||e.data==="$~"}function qp(e){return e.data==="$!"||e.data==="$?"&&e.ownerDocument.readyState!=="loading"}function iT(e,t){var n=e.ownerDocument;if(e.data==="$~")e._reactRetry=t;else if(e.data!=="$?"||n.readyState!=="loading")t();else{var i=function(){t(),n.removeEventListener("DOMContentLoaded",i)};n.addEventListener("DOMContentLoaded",i),e._reactRetry=i}}function vi(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t==="$"||t==="$!"||t==="$?"||t==="$~"||t==="&"||t==="F!"||t==="F")break;if(t==="/$"||t==="/&")return null}}return e}var Yp=null;function gx(e){e=e.nextSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="/$"||n==="/&"){if(t===0)return vi(e.nextSibling);t--}else n!=="$"&&n!=="$!"&&n!=="$?"&&n!=="$~"&&n!=="&"||t++}e=e.nextSibling}return null}function yx(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="$"||n==="$!"||n==="$?"||n==="$~"||n==="&"){if(t===0)return e;t--}else n!=="/$"&&n!=="/&"||t++}e=e.previousSibling}return null}function sb(e,t,n){switch(t=Lu(n),e){case"html":if(e=t.documentElement,!e)throw Error(tt(452));return e;case"head":if(e=t.head,!e)throw Error(tt(453));return e;case"body":if(e=t.body,!e)throw Error(tt(454));return e;default:throw Error(tt(451))}}function dl(e){for(var t=e.attributes;t.length;)e.removeAttributeNode(t[0]);em(e)}var _i=new Map,xx=new Set;function Uu(e){return typeof e.getRootNode=="function"?e.getRootNode():e.nodeType===9?e:e.ownerDocument}var Cs=le.d;le.d={f:sT,r:aT,D:rT,C:oT,L:lT,m:cT,X:hT,S:uT,M:fT};function sT(){var e=Cs.f(),t=Ju();return e||t}function aT(e){var t=so(e);t!==null&&t.tag===5&&t.type==="form"?Qv(t):Cs.r(e)}var lo=typeof document>"u"?null:document;function ab(e,t,n){var i=lo;if(i&&typeof t=="string"&&t){var s=mi(t);s='link[rel="'+e+'"][href="'+s+'"]',typeof n=="string"&&(s+='[crossorigin="'+n+'"]'),xx.has(s)||(xx.add(s),e={rel:e,crossOrigin:n,href:t},i.querySelector(s)===null&&(t=i.createElement("link"),xn(t,"link",e),un(t),i.head.appendChild(t)))}}function rT(e){Cs.D(e),ab("dns-prefetch",e,null)}function oT(e,t){Cs.C(e,t),ab("preconnect",e,t)}function lT(e,t,n){Cs.L(e,t,n);var i=lo;if(i&&e&&t){var s='link[rel="preload"][as="'+mi(t)+'"]';t==="image"&&n&&n.imageSrcSet?(s+='[imagesrcset="'+mi(n.imageSrcSet)+'"]',typeof n.imageSizes=="string"&&(s+='[imagesizes="'+mi(n.imageSizes)+'"]')):s+='[href="'+mi(e)+'"]';var a=s;switch(t){case"style":a=eo(e);break;case"script":a=co(e)}_i.has(a)||(e=Ce({rel:"preload",href:t==="image"&&n&&n.imageSrcSet?void 0:e,as:t},n),_i.set(a,e),i.querySelector(s)!==null||t==="style"&&i.querySelector(zl(a))||t==="script"&&i.querySelector(Fl(a))||(t=i.createElement("link"),xn(t,"link",e),un(t),i.head.appendChild(t)))}}function cT(e,t){Cs.m(e,t);var n=lo;if(n&&e){var i=t&&typeof t.as=="string"?t.as:"script",s='link[rel="modulepreload"][as="'+mi(i)+'"][href="'+mi(e)+'"]',a=s;switch(i){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":a=co(e)}if(!_i.has(a)&&(e=Ce({rel:"modulepreload",href:e},t),_i.set(a,e),n.querySelector(s)===null)){switch(i){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":if(n.querySelector(Fl(a)))return}i=n.createElement("link"),xn(i,"link",e),un(i),n.head.appendChild(i)}}}function uT(e,t,n){Cs.S(e,t,n);var i=lo;if(i&&e){var s=Fr(i).hoistableStyles,a=eo(e);t=t||"default";var r=s.get(a);if(!r){var o={loading:0,preload:null};if(r=i.querySelector(zl(a)))o.loading=5;else{e=Ce({rel:"stylesheet",href:e,"data-precedence":t},n),(n=_i.get(a))&&km(e,n);var l=r=i.createElement("link");un(l),xn(l,"link",e),l._p=new Promise(function(c,u){l.onload=c,l.onerror=u}),l.addEventListener("load",function(){o.loading|=1}),l.addEventListener("error",function(){o.loading|=2}),o.loading|=4,au(r,t,i)}r={type:"stylesheet",instance:r,count:1,state:o},s.set(a,r)}}}function hT(e,t){Cs.X(e,t);var n=lo;if(n&&e){var i=Fr(n).hoistableScripts,s=co(e),a=i.get(s);a||(a=n.querySelector(Fl(s)),a||(e=Ce({src:e,async:!0},t),(t=_i.get(s))&&Hm(e,t),a=n.createElement("script"),un(a),xn(a,"link",e),n.head.appendChild(a)),a={type:"script",instance:a,count:1,state:null},i.set(s,a))}}function fT(e,t){Cs.M(e,t);var n=lo;if(n&&e){var i=Fr(n).hoistableScripts,s=co(e),a=i.get(s);a||(a=n.querySelector(Fl(s)),a||(e=Ce({src:e,async:!0,type:"module"},t),(t=_i.get(s))&&Hm(e,t),a=n.createElement("script"),un(a),xn(a,"link",e),n.head.appendChild(a)),a={type:"script",instance:a,count:1,state:null},i.set(s,a))}}function vx(e,t,n,i){var s=(s=ta.current)?Uu(s):null;if(!s)throw Error(tt(446));switch(e){case"meta":case"title":return null;case"style":return typeof n.precedence=="string"&&typeof n.href=="string"?(t=eo(n.href),n=Fr(s).hoistableStyles,i=n.get(t),i||(i={type:"style",instance:null,count:0,state:null},n.set(t,i)),i):{type:"void",instance:null,count:0,state:null};case"link":if(n.rel==="stylesheet"&&typeof n.href=="string"&&typeof n.precedence=="string"){e=eo(n.href);var a=Fr(s).hoistableStyles,r=a.get(e);if(r||(s=s.ownerDocument||s,r={type:"stylesheet",instance:null,count:0,state:{loading:0,preload:null}},a.set(e,r),(a=s.querySelector(zl(e)))&&!a._p&&(r.instance=a,r.state.loading=5),_i.has(e)||(n={rel:"preload",as:"style",href:n.href,crossOrigin:n.crossOrigin,integrity:n.integrity,media:n.media,hrefLang:n.hrefLang,referrerPolicy:n.referrerPolicy},_i.set(e,n),a||dT(s,e,n,r.state))),t&&i===null)throw Error(tt(528,""));return r}if(t&&i!==null)throw Error(tt(529,""));return null;case"script":return t=n.async,n=n.src,typeof n=="string"&&t&&typeof t!="function"&&typeof t!="symbol"?(t=co(n),n=Fr(s).hoistableScripts,i=n.get(t),i||(i={type:"script",instance:null,count:0,state:null},n.set(t,i)),i):{type:"void",instance:null,count:0,state:null};default:throw Error(tt(444,e))}}function eo(e){return'href="'+mi(e)+'"'}function zl(e){return'link[rel="stylesheet"]['+e+"]"}function rb(e){return Ce({},e,{"data-precedence":e.precedence,precedence:null})}function dT(e,t,n,i){e.querySelector('link[rel="preload"][as="style"]['+t+"]")?i.loading=1:(t=e.createElement("link"),i.preload=t,t.addEventListener("load",function(){return i.loading|=1}),t.addEventListener("error",function(){return i.loading|=2}),xn(t,"link",n),un(t),e.head.appendChild(t))}function co(e){return'[src="'+mi(e)+'"]'}function Fl(e){return"script[async]"+e}function _x(e,t,n){if(t.count++,t.instance===null)switch(t.type){case"style":var i=e.querySelector('style[data-href~="'+mi(n.href)+'"]');if(i)return t.instance=i,un(i),i;var s=Ce({},n,{"data-href":n.href,"data-precedence":n.precedence,href:null,precedence:null});return i=(e.ownerDocument||e).createElement("style"),un(i),xn(i,"style",s),au(i,n.precedence,e),t.instance=i;case"stylesheet":s=eo(n.href);var a=e.querySelector(zl(s));if(a)return t.state.loading|=4,t.instance=a,un(a),a;i=rb(n),(s=_i.get(s))&&km(i,s),a=(e.ownerDocument||e).createElement("link"),un(a);var r=a;return r._p=new Promise(function(o,l){r.onload=o,r.onerror=l}),xn(a,"link",i),t.state.loading|=4,au(a,n.precedence,e),t.instance=a;case"script":return a=co(n.src),(s=e.querySelector(Fl(a)))?(t.instance=s,un(s),s):(i=n,(s=_i.get(a))&&(i=Ce({},n),Hm(i,s)),e=e.ownerDocument||e,s=e.createElement("script"),un(s),xn(s,"link",i),e.head.appendChild(s),t.instance=s);case"void":return null;default:throw Error(tt(443,t.type))}else t.type==="stylesheet"&&(t.state.loading&4)===0&&(i=t.instance,t.state.loading|=4,au(i,n.precedence,e));return t.instance}function au(e,t,n){for(var i=n.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'),s=i.length?i[i.length-1]:null,a=s,r=0;r<i.length;r++){var o=i[r];if(o.dataset.precedence===t)a=o;else if(a!==s)break}a?a.parentNode.insertBefore(e,a.nextSibling):(t=n.nodeType===9?n.head:n,t.insertBefore(e,t.firstChild))}function km(e,t){e.crossOrigin==null&&(e.crossOrigin=t.crossOrigin),e.referrerPolicy==null&&(e.referrerPolicy=t.referrerPolicy),e.title==null&&(e.title=t.title)}function Hm(e,t){e.crossOrigin==null&&(e.crossOrigin=t.crossOrigin),e.referrerPolicy==null&&(e.referrerPolicy=t.referrerPolicy),e.integrity==null&&(e.integrity=t.integrity)}var ru=null;function bx(e,t,n){if(ru===null){var i=new Map,s=ru=new Map;s.set(n,i)}else s=ru,i=s.get(n),i||(i=new Map,s.set(n,i));if(i.has(e))return i;for(i.set(e,null),n=n.getElementsByTagName(e),s=0;s<n.length;s++){var a=n[s];if(!(a[Ll]||a[mn]||e==="link"&&a.getAttribute("rel")==="stylesheet")&&a.namespaceURI!=="http://www.w3.org/2000/svg"){var r=a.getAttribute(t)||"";r=e+r;var o=i.get(r);o?o.push(a):i.set(r,[a])}}return i}function Sx(e,t,n){e=e.ownerDocument||e,e.head.insertBefore(n,t==="title"?e.querySelector("head > title"):null)}function pT(e,t,n){if(n===1||t.itemProp!=null)return!1;switch(e){case"meta":case"title":return!0;case"style":if(typeof t.precedence!="string"||typeof t.href!="string"||t.href==="")break;return!0;case"link":if(typeof t.rel!="string"||typeof t.href!="string"||t.href===""||t.onLoad||t.onError)break;return t.rel==="stylesheet"?(e=t.disabled,typeof t.precedence=="string"&&e==null):!0;case"script":if(t.async&&typeof t.async!="function"&&typeof t.async!="symbol"&&!t.onLoad&&!t.onError&&t.src&&typeof t.src=="string")return!0}return!1}function ob(e){return!(e.type==="stylesheet"&&(e.state.loading&3)===0)}function mT(e,t,n,i){if(n.type==="stylesheet"&&(typeof i.media!="string"||matchMedia(i.media).matches!==!1)&&(n.state.loading&4)===0){if(n.instance===null){var s=eo(i.href),a=t.querySelector(zl(s));if(a){t=a._p,t!==null&&typeof t=="object"&&typeof t.then=="function"&&(e.count++,e=Ou.bind(e),t.then(e,e)),n.state.loading|=4,n.instance=a,un(a);return}a=t.ownerDocument||t,i=rb(i),(s=_i.get(s))&&km(i,s),a=a.createElement("link"),un(a);var r=a;r._p=new Promise(function(o,l){r.onload=o,r.onerror=l}),xn(a,"link",i),n.instance=a}e.stylesheets===null&&(e.stylesheets=new Map),e.stylesheets.set(n,t),(t=n.state.preload)&&(n.state.loading&3)===0&&(e.count++,n=Ou.bind(e),t.addEventListener("load",n),t.addEventListener("error",n))}}var tp=0;function gT(e,t){return e.stylesheets&&e.count===0&&ou(e,e.stylesheets),0<e.count||0<e.imgCount?function(n){var i=setTimeout(function(){if(e.stylesheets&&ou(e,e.stylesheets),e.unsuspend){var a=e.unsuspend;e.unsuspend=null,a()}},6e4+t);0<e.imgBytes&&tp===0&&(tp=62500*JE());var s=setTimeout(function(){if(e.waitingForImages=!1,e.count===0&&(e.stylesheets&&ou(e,e.stylesheets),e.unsuspend)){var a=e.unsuspend;e.unsuspend=null,a()}},(e.imgBytes>tp?50:800)+t);return e.unsuspend=n,function(){e.unsuspend=null,clearTimeout(i),clearTimeout(s)}}:null}function Ou(){if(this.count--,this.count===0&&(this.imgCount===0||!this.waitingForImages)){if(this.stylesheets)ou(this,this.stylesheets);else if(this.unsuspend){var e=this.unsuspend;this.unsuspend=null,e()}}}var Iu=null;function ou(e,t){e.stylesheets=null,e.unsuspend!==null&&(e.count++,Iu=new Map,t.forEach(yT,e),Iu=null,Ou.call(e))}function yT(e,t){if(!(t.state.loading&4)){var n=Iu.get(e);if(n)var i=n.get(null);else{n=new Map,Iu.set(e,n);for(var s=e.querySelectorAll("link[data-precedence],style[data-precedence]"),a=0;a<s.length;a++){var r=s[a];(r.nodeName==="LINK"||r.getAttribute("media")!=="not all")&&(n.set(r.dataset.precedence,r),i=r)}i&&n.set(null,i)}s=t.instance,r=s.getAttribute("data-precedence"),a=n.get(r)||i,a===i&&n.set(null,s),n.set(r,s),this.count++,i=Ou.bind(this),s.addEventListener("load",i),s.addEventListener("error",i),a?a.parentNode.insertBefore(s,a.nextSibling):(e=e.nodeType===9?e.head:e,e.insertBefore(s,e.firstChild)),t.state.loading|=4}}var Tl={$$typeof:ys,Provider:null,Consumer:null,_currentValue:ka,_currentValue2:ka,_threadCount:0};function xT(e,t,n,i,s,a,r,o,l){this.tag=1,this.containerInfo=e,this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.next=this.pendingContext=this.context=this.cancelPendingCommit=null,this.callbackPriority=0,this.expirationTimes=Ad(-1),this.entangledLanes=this.shellSuspendCounter=this.errorRecoveryDisabledLanes=this.expiredLanes=this.warmLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Ad(0),this.hiddenUpdates=Ad(null),this.identifierPrefix=i,this.onUncaughtError=s,this.onCaughtError=a,this.onRecoverableError=r,this.pooledCache=null,this.pooledCacheLanes=0,this.formState=l,this.incompleteTransitions=new Map}function lb(e,t,n,i,s,a,r,o,l,c,u,f){return e=new xT(e,t,n,r,l,c,u,f,o),t=1,a===!0&&(t|=24),a=Jn(3,null,null,t),e.current=a,a.stateNode=e,t=dm(),t.refCount++,e.pooledCache=t,t.refCount++,a.memoizedState={element:i,isDehydrated:n,cache:t},gm(a),e}function cb(e){return e?(e=Ir,e):Ir}function ub(e,t,n,i,s,a){s=cb(s),i.context===null?i.context=s:i.pendingContext=s,i=na(t),i.payload={element:n},a=a===void 0?null:a,a!==null&&(i.callback=a),n=ia(e,i,t),n!==null&&(kn(n,e,t),al(n,e,t))}function Mx(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var n=e.retryLane;e.retryLane=n!==0&&n<t?n:t}}function Vm(e,t){Mx(e,t),(e=e.alternate)&&Mx(e,t)}function hb(e){if(e.tag===13||e.tag===31){var t=$a(e,67108864);t!==null&&kn(t,e,67108864),Vm(e,67108864)}}function Ex(e){if(e.tag===13||e.tag===31){var t=ei();t=$p(t);var n=$a(e,t);n!==null&&kn(n,e,t),Vm(e,t)}}var Pu=!0;function vT(e,t,n,i){var s=Lt.T;Lt.T=null;var a=le.p;try{le.p=2,Gm(e,t,n,i)}finally{le.p=a,Lt.T=s}}function _T(e,t,n,i){var s=Lt.T;Lt.T=null;var a=le.p;try{le.p=8,Gm(e,t,n,i)}finally{le.p=a,Lt.T=s}}function Gm(e,t,n,i){if(Pu){var s=Zp(i);if(s===null)jd(e,t,i,Bu,n),Tx(e,i);else if(ST(s,e,t,n,i))i.stopPropagation();else if(Tx(e,i),t&4&&-1<bT.indexOf(e)){for(;s!==null;){var a=so(s);if(a!==null)switch(a.tag){case 3:if(a=a.stateNode,a.current.memoizedState.isDehydrated){var r=Ba(a.pendingLanes);if(r!==0){var o=a;for(o.pendingLanes|=2,o.entangledLanes|=2;r;){var l=1<<31-ti(r);o.entanglements[1]|=l,r&=~l}ji(a),(oe&6)===0&&(Au=jn()+500,Bl(0,!1))}}break;case 31:case 13:o=$a(a,2),o!==null&&kn(o,a,2),Ju(),Vm(a,2)}if(a=Zp(i),a===null&&jd(e,t,i,Bu,n),a===s)break;s=a}s!==null&&i.stopPropagation()}else jd(e,t,i,null,n)}}function Zp(e){return e=im(e),Wm(e)}var Bu=null;function Wm(e){if(Bu=null,e=Rr(e),e!==null){var t=Cl(e);if(t===null)e=null;else{var n=t.tag;if(n===13){if(e=Nx(t),e!==null)return e;e=null}else if(n===31){if(e=Lx(t),e!==null)return e;e=null}else if(n===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null)}}return Bu=e,null}function fb(e){switch(e){case"beforetoggle":case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"toggle":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 2;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 8;case"message":switch(lM()){case Px:return 2;case Bx:return 8;case fu:case cM:return 32;case zx:return 268435456;default:return 32}default:return 32}}var Kp=!1,ra=null,oa=null,la=null,Al=new Map,wl=new Map,Zs=[],bT="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");function Tx(e,t){switch(e){case"focusin":case"focusout":ra=null;break;case"dragenter":case"dragleave":oa=null;break;case"mouseover":case"mouseout":la=null;break;case"pointerover":case"pointerout":Al.delete(t.pointerId);break;case"gotpointercapture":case"lostpointercapture":wl.delete(t.pointerId)}}function Zo(e,t,n,i,s,a){return e===null||e.nativeEvent!==a?(e={blockedOn:t,domEventName:n,eventSystemFlags:i,nativeEvent:a,targetContainers:[s]},t!==null&&(t=so(t),t!==null&&hb(t)),e):(e.eventSystemFlags|=i,t=e.targetContainers,s!==null&&t.indexOf(s)===-1&&t.push(s),e)}function ST(e,t,n,i,s){switch(t){case"focusin":return ra=Zo(ra,e,t,n,i,s),!0;case"dragenter":return oa=Zo(oa,e,t,n,i,s),!0;case"mouseover":return la=Zo(la,e,t,n,i,s),!0;case"pointerover":var a=s.pointerId;return Al.set(a,Zo(Al.get(a)||null,e,t,n,i,s)),!0;case"gotpointercapture":return a=s.pointerId,wl.set(a,Zo(wl.get(a)||null,e,t,n,i,s)),!0}return!1}function db(e){var t=Rr(e.target);if(t!==null){var n=Cl(t);if(n!==null){if(t=n.tag,t===13){if(t=Nx(n),t!==null){e.blockedOn=t,ly(e.priority,function(){Ex(n)});return}}else if(t===31){if(t=Lx(n),t!==null){e.blockedOn=t,ly(e.priority,function(){Ex(n)});return}}else if(t===3&&n.stateNode.current.memoizedState.isDehydrated){e.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}e.blockedOn=null}function lu(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var n=Zp(e.nativeEvent);if(n===null){n=e.nativeEvent;var i=new n.constructor(n.type,n);dp=i,n.target.dispatchEvent(i),dp=null}else return t=so(n),t!==null&&hb(t),e.blockedOn=n,!1;t.shift()}return!0}function Ax(e,t,n){lu(e)&&n.delete(t)}function MT(){Kp=!1,ra!==null&&lu(ra)&&(ra=null),oa!==null&&lu(oa)&&(oa=null),la!==null&&lu(la)&&(la=null),Al.forEach(Ax),wl.forEach(Ax)}function qc(e,t){e.blockedOn===t&&(e.blockedOn=null,Kp||(Kp=!0,nn.unstable_scheduleCallback(nn.unstable_NormalPriority,MT)))}var Yc=null;function wx(e){Yc!==e&&(Yc=e,nn.unstable_scheduleCallback(nn.unstable_NormalPriority,function(){Yc===e&&(Yc=null);for(var t=0;t<e.length;t+=3){var n=e[t],i=e[t+1],s=e[t+2];if(typeof i!="function"){if(Wm(i||n)===null)continue;break}var a=so(n);a!==null&&(e.splice(t,3),t-=3,Rp(a,{pending:!0,data:s,method:n.method,action:i},i,s))}}))}function no(e){function t(l){return qc(l,e)}ra!==null&&qc(ra,e),oa!==null&&qc(oa,e),la!==null&&qc(la,e),Al.forEach(t),wl.forEach(t);for(var n=0;n<Zs.length;n++){var i=Zs[n];i.blockedOn===e&&(i.blockedOn=null)}for(;0<Zs.length&&(n=Zs[0],n.blockedOn===null);)db(n),n.blockedOn===null&&Zs.shift();if(n=(e.ownerDocument||e).$$reactFormReplay,n!=null)for(i=0;i<n.length;i+=3){var s=n[i],a=n[i+1],r=s[Hn]||null;if(typeof a=="function")r||wx(n);else if(r){var o=null;if(a&&a.hasAttribute("formAction")){if(s=a,r=a[Hn]||null)o=r.formAction;else if(Wm(s)!==null)continue}else o=r.action;typeof o=="function"?n[i+1]=o:(n.splice(i,3),i-=3),wx(n)}}}function pb(){function e(a){a.canIntercept&&a.info==="react-transition"&&a.intercept({handler:function(){return new Promise(function(r){return s=r})},focusReset:"manual",scroll:"manual"})}function t(){s!==null&&(s(),s=null),i||setTimeout(n,20)}function n(){if(!i&&!navigation.transition){var a=navigation.currentEntry;a&&a.url!=null&&navigation.navigate(a.url,{state:a.getState(),info:"react-transition",history:"replace"})}}if(typeof navigation=="object"){var i=!1,s=null;return navigation.addEventListener("navigate",e),navigation.addEventListener("navigatesuccess",t),navigation.addEventListener("navigateerror",t),setTimeout(n,100),function(){i=!0,navigation.removeEventListener("navigate",e),navigation.removeEventListener("navigatesuccess",t),navigation.removeEventListener("navigateerror",t),s!==null&&(s(),s=null)}}}function Xm(e){this._internalRoot=e}$u.prototype.render=Xm.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(tt(409));var n=t.current,i=ei();ub(n,i,e,t,null,null)};$u.prototype.unmount=Xm.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;ub(e.current,2,null,e,null,null),Ju(),t[io]=null}};function $u(e){this._internalRoot=e}$u.prototype.unstable_scheduleHydration=function(e){if(e){var t=Gx();e={blockedOn:null,target:e,priority:t};for(var n=0;n<Zs.length&&t!==0&&t<Zs[n].priority;n++);Zs.splice(n,0,e),n===0&&db(e)}};var Cx=Rx.version;if(Cx!=="19.2.8")throw Error(tt(527,Cx,"19.2.8"));le.findDOMNode=function(e){var t=e._reactInternals;if(t===void 0)throw typeof e.render=="function"?Error(tt(188)):(e=Object.keys(e).join(","),Error(tt(268,e)));return e=eM(t),e=e!==null?Ux(e):null,e=e===null?null:e.stateNode,e};var ET={bundleType:0,version:"19.2.8",rendererPackageName:"react-dom",currentDispatcherRef:Lt,reconcilerVersion:"19.2.8"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"&&(Ko=__REACT_DEVTOOLS_GLOBAL_HOOK__,!Ko.isDisabled&&Ko.supportsFiber))try{Rl=Ko.inject(ET),$n=Ko}catch{}var Ko;th.createRoot=function(e,t){if(!Dx(e))throw Error(tt(299));var n=!1,i="",s=a_,a=r_,r=o_;return t!=null&&(t.unstable_strictMode===!0&&(n=!0),t.identifierPrefix!==void 0&&(i=t.identifierPrefix),t.onUncaughtError!==void 0&&(s=t.onUncaughtError),t.onCaughtError!==void 0&&(a=t.onCaughtError),t.onRecoverableError!==void 0&&(r=t.onRecoverableError)),t=lb(e,1,!1,null,null,n,i,null,s,a,r,pb),e[io]=t.current,Fm(e),new Xm(t)};th.hydrateRoot=function(e,t,n){if(!Dx(e))throw Error(tt(299));var i=!1,s="",a=a_,r=r_,o=o_,l=null;return n!=null&&(n.unstable_strictMode===!0&&(i=!0),n.identifierPrefix!==void 0&&(s=n.identifierPrefix),n.onUncaughtError!==void 0&&(a=n.onUncaughtError),n.onCaughtError!==void 0&&(r=n.onCaughtError),n.onRecoverableError!==void 0&&(o=n.onRecoverableError),n.formState!==void 0&&(l=n.formState)),t=lb(e,1,!0,t,n??null,i,s,l,a,r,o,pb),t.context=cb(null),n=t.current,i=ei(),i=$p(i),s=na(i),s.callback=null,ia(n,s,i),n=i,t.current.lanes=n,Nl(t,n),ji(t),e[io]=t.current,Fm(e),new $u(t)};th.version="19.2.8"});var xb=Xi((_3,yb)=>{"use strict";function gb(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(gb)}catch(e){console.error(e)}}gb(),yb.exports=mb()});var p1=Xi(td=>{"use strict";var e3=Symbol.for("react.transitional.element"),n3=Symbol.for("react.fragment");function d1(e,t,n){var i=null;if(n!==void 0&&(i=""+n),t.key!==void 0&&(i=""+t.key),"key"in t){n={};for(var s in t)s!=="key"&&(n[s]=t[s])}else n=t;return t=n.ref,{$$typeof:e3,type:e,key:i,ref:t!==void 0?t:null,props:n}}td.Fragment=n3;td.jsx=d1;td.jsxs=d1});var Sc=Xi((QU,m1)=>{"use strict";m1.exports=p1()});var id=()=>({schemaVersion:1,layout:"onscreen",fullscreen:!0});function E0(e){if(!e||typeof e!="object")return null;let t=e;return t.schemaVersion===1&&(t.layout==="onscreen"||t.layout==="handheld")&&typeof t.fullscreen=="boolean"?{schemaVersion:1,layout:t.layout,fullscreen:t.fullscreen}:null}var U1=()=>window.__STATOZ_HOST__,Yn=id(),sd="",ad,T0="statoz.retro.presentation.v1",rd=class extends HTMLElement{constructor(){super(...arguments);this.sync=()=>{let n=this.querySelector("select"),i=this.querySelector("input");n&&(n.value=Yn.layout),i&&(i.checked=Yn.fullscreen);let s=this.querySelector(".retro-screen-status");s&&(s.textContent=sd)}}connectedCallback(){this.innerHTML='<fieldset class="retro-presentation"><legend>DISPLAY &amp; CONTROLS &middot; ALL RETRO GAMES</legend><label>Control layout<select aria-label="Control layout"><option value="onscreen">On-screen buttons</option><option value="handheld">Handheld side buttons</option></select></label><label>Fullscreen by default<input aria-label="Fullscreen by default" type="checkbox"></label><p>Shared across all four retro games. Rotate your phone to landscape.</p><p class="retro-screen-status" role="status"></p></fieldset>',this.onchange=()=>{let n=this.querySelector("select").value;ad?.({...Yn,layout:n==="handheld"?"handheld":"onscreen",fullscreen:this.querySelector("input").checked})},window.addEventListener("retro-presentation-change",this.sync),this.sync()}disconnectedCallback(){window.removeEventListener("retro-presentation-change",this.sync)}};function A0(e,t){customElements.get("retro-presentation-settings")||customElements.define("retro-presentation-settings",rd);let n=U1();sd="";let i;if(!n)try{i=JSON.parse(localStorage.getItem(T0)||"null")}catch{}Yn=E0(n?.presentation??i)??id();let s=()=>{document.documentElement.dataset.retroLayout=Yn.layout};s(),window.dispatchEvent(new Event("retro-presentation-change"));let a=new AbortController,{signal:r}=a,o=window.frameElement??document.documentElement,l=o.ownerDocument,c=!1,u=!1,f=!1,h=!1,d=v=>{sd=v,document.querySelectorAll(".retro-screen-status").forEach(E=>{E.textContent=v})},m=async()=>{if(!(f||c||!Yn.fullscreen||h)){f=!0;try{if(l.fullscreenElement||await o.requestFullscreen(),c)return;h=!0;let v=screen.orientation;try{await v.lock?.("landscape")}catch{}c||d("")}catch{c||d("Fullscreen is unavailable or was blocked. The game fills the available viewport.")}finally{f=!1}}};ad=v=>{let E=Yn.fullscreen;if(t(),Yn=v,s(),n)n.presentation=Yn,n.emit("presentation",Yn);else try{localStorage.setItem(T0,JSON.stringify(Yn))}catch{d("Display preferences could not be saved on this device.")}window.dispatchEvent(new Event("retro-presentation-change")),Yn.fullscreen&&!E?(h=!1,u=!0,m()):!Yn.fullscreen&&l.fullscreenElement===o&&l.exitFullscreen().catch(()=>{})};let b=document.createElement("aside");b.className="retro-rotation",b.setAttribute("aria-label","Landscape orientation required"),b.innerHTML='<span aria-hidden="true">&#8635;</span><h2>TURN TO LANDSCAPE</h2><p>Rotate your phone for the wide handheld screen.</p><button type="button">Settings</button>';let g=document.createElement("dialog");g.className="retro-rotation-settings",g.setAttribute("aria-label","Retro display settings"),g.innerHTML='<h2>SETTINGS</h2><retro-presentation-settings></retro-presentation-settings><form method="dialog"><button>Done</button></form>',document.body.append(b,g),b.querySelector("button").onclick=()=>{t(),g.showModal()};let p=!1,y=()=>{let v=innerWidth<innerHeight&&innerWidth<900;v&&!p&&t(),p=v,b.hidden=!p,e.inert=p};window.addEventListener("resize",y,{signal:r}),window.addEventListener("orientationchange",()=>{t(),y()},{signal:r}),window.addEventListener("blur",t,{signal:r}),document.addEventListener("visibilitychange",()=>{document.hidden&&t()},{signal:r});let S=()=>{!u&&!f&&(u=!0,m())};return window.addEventListener("pointerdown",S,{capture:!0,signal:r}),window.addEventListener("keydown",v=>{if(p&&!g.open&&!["Tab","Escape","Enter"," "].includes(v.key)){v.preventDefault(),v.stopImmediatePropagation();return}if(p&&!g.open&&v.target!==b.querySelector("button")){v.stopImmediatePropagation();return}v.key!=="Escape"&&S()},{capture:!0,signal:r}),l.addEventListener("fullscreenchange",()=>{h&&!l.fullscreenElement&&(u=!0)},{signal:r}),y(),m(),()=>{c=!0,a.abort(),e.inert=!1,b.remove(),g.remove(),ad=void 0,delete document.documentElement.dataset.retroLayout}}var F0=ks(vr());function k0(){return(0,F0.createElement)("retro-presentation-settings")}var qe=ks(vr()),v1=ks(xb());var Li={id:"retro-football",runtimeVersion:"0.11.0",rulesVersion:"exhibition-explicit-controls-v1",assetVersion:"football-chance-atlas-v2",simulationHz:60};var TT=["kick","tackle","save","whistle","ui","goal","result","menu","crowd"],eh=class{constructor(t=new URL("./audio/",import.meta.url)){this.base=t;this.status="locked";this.ctx=null;this.master=null;this.limiter=null;this.buffers=new Map;this.active=new Set;this.loop=null;this.mode="ready";this.settings={music:.4,sfx:.7};this.disposed=!1;this.generation=0;this.loading=null;this.played={};this.controller=new AbortController}unlock(){if(!(this.disposed||this.status==="unavailable"||this.mode==="hidden"))try{if(this.ctx||(this.ctx=new AudioContext,this.master=this.ctx.createGain(),this.master.gain.value=.38,this.limiter=this.ctx.createDynamicsCompressor(),this.limiter.threshold.value=-12,this.limiter.knee.value=8,this.limiter.ratio.value=12,this.limiter.attack.value=.003,this.limiter.release.value=.12,this.master.connect(this.limiter),this.limiter.connect(this.ctx.destination)),this.ctx.resume().catch(()=>this.fail()),!this.loading){this.status="loading";let t=this.ctx;this.loading=Promise.all(TT.map(async n=>{let i=await fetch(new URL(n+".wav",this.base),{signal:this.controller.signal});if(!i.ok)throw Error("Audio unavailable");let s=await t.decodeAudioData(await i.arrayBuffer());this.disposed||this.buffers.set(n,s)})).then(()=>{this.disposed||(this.status="ready",this.sync(this.mode,!0))}).catch(()=>{this.disposed||this.fail()})}}catch{this.fail()}}fail(){this.status="unavailable",this.stop()}play(t,n=!1){if(!this.ctx||!this.master||this.status!=="ready"||this.disposed)return null;let i=this.buffers.get(t),s=t==="menu"||t==="result"?this.settings.music:this.settings.sfx*(t==="crowd"?.32:1);if(!i||s===0||this.active.size>=4)return null;let a=this.ctx.createBufferSource(),r=this.ctx.createGain();return a.buffer=i,a.loop=n,r.gain.value=s,a.connect(r),r.connect(this.master),this.active.add(a),a.onended=()=>{this.active.delete(a),a.disconnect(),r.disconnect(),this.loop===a&&(this.loop=null)},a.start(),this.played[t]=(this.played[t]??0)+1,a}stop(){this.generation++;for(let t of this.active){try{t.stop()}catch{}t.disconnect()}this.active.clear(),this.loop=null}sync(t,n=!1){if(this.disposed||!n&&t===this.mode)return;let i=this.mode==="hidden"||this.mode==="paused";if(this.mode=t,this.stop(),t==="paused"||t==="hidden"){this.ctx?.suspend().catch(()=>{});return}this.ctx?.state==="suspended"&&this.ctx.resume().catch(()=>{}),t==="playing"?this.loop=this.play("crowd",!0):t==="ready"||t==="halftime"?(this.loop=this.play("menu",!0),t==="halftime"&&this.play("whistle")):t==="complete"&&!i&&(this.play("whistle"),this.play("result"))}event(t){if(this.mode!=="playing")return;let n=t.kind;n==="pass"||n==="shot"||n==="keeper-punt"?this.play("kick"):n==="tackle-contact"?this.play("tackle"):n==="save"?this.play("save"):n==="goal"?this.play("goal"):(n==="restart-awarded"||n==="second-half")&&this.play("whistle")}ui(){this.play("ui")}setSettings(t){this.settings={...t},this.mode==="complete"?this.stop():this.sync(this.mode,!0)}diagnostics(){return{status:this.status,active:this.active.size,context:this.ctx?.state??"none",played:{...this.played}}}dispose(){this.disposed||(this.disposed=!0,this.controller.abort(),this.stop(),this.buffers.clear(),this.master?.disconnect(),this.limiter?.disconnect(),this.ctx?.close().catch(()=>{}),this.status="disposed")}};var ne={centreX:125,lateralScale:13.4,keeperY:110,separation:105,basePlane:96};function vb(e,t){if(e.phase==="aim")return e.age<30?null:e.age<66?Math.floor((e.age-30)/6)%2?"entry-alt":"entry":"ready";let n=t.action?.kind==="shot"?t.action.age:99;return n<4?"ready":n<8?"windup":n<12?"plant":n<16?"contact":n<26?"follow":"recover"}var AT=(e,t)=>Math.hypot(e.x-t.x,e.y-t.y,e.z-t.z);function $i(e,t,n,i,s){let a={x:e.x-n.x,y:e.y-n.y,z:e.z-n.z},r={x:t.x-e.x-i.x+n.x,y:t.y-e.y-i.y+n.y,z:t.z-e.z-i.z+n.z},o=r.x*r.x+r.y*r.y+r.z*r.z,l=2*(a.x*r.x+a.y*r.y+a.z*r.z),c=a.x*a.x+a.y*a.y+a.z*a.z-s*s,u;if(c<=0)u=0;else{if(o<1e-12)return null;let m=l*l-4*o*c;if(m<0||(u=(-l-Math.sqrt(m))/(2*o),u<0||u>1))return null}let f=(m,b)=>({x:m.x+(b.x-m.x)*u,y:m.y+(b.y-m.y)*u,z:m.z+(b.z-m.z)*u}),h=f(e,t),d=f(n,i);return{fraction:u,anchor:h,ball:d,distance:AT(h,d)}}var Fe=1/60,bb=5400,er=75,Ut={x:48,y:80,scaleX:23,scaleY:4.5,length:105,width:68,centreRadius:9.15,goalTop:27.5,goalBottom:40.5},nr={width:Ut.x*2+Ut.length*Ut.scaleX,bottom:Ut.y+Ut.width*Ut.scaleY},kl=.8,Rs={receive:6,boot:5,body:7,upper:5,punt:4},_b=new WeakMap;function Hl(e){let t=_b.get(e);if(t)return t;let n=Math.round(e.width*kl),i=Math.round(e.height*kl),s=Object.fromEntries(Object.entries(e.anchors).map(([r,[o,l]])=>[r,[Math.round((o+.5)*n/e.width-.5),Math.round((l+.5)*i/e.height-.5)]])),a={...e,width:n,height:i,anchors:s};return _b.set(e,a),a}var Re=(e,t,n)=>Math.max(t,Math.min(n,e)),Ge=e=>({x:Ut.x+e.x*Ut.scaleX,y:Ut.y+e.y*Ut.scaleY}),Sb=e=>{let t=Ge(e);return{x:Math.round(t.x),y:Math.round(t.y)}},Xt=e=>({x:e.x*Ut.scaleX,y:e.y*Ut.scaleY,z:e.z}),Ui=e=>({x:e.x/Ut.scaleX,y:e.y/Ut.scaleY,z:e.z}),Oe=(e,t)=>Math.hypot(e.x-t.x,e.y-t.y),ir=(e,t)=>({x:ne.centreX+(e.y-34)*ne.lateralScale,y:t.planeY+(t.direction===-1?e.x:105-e.x)*t.depthScale,z:e.z}),qm=(e,t)=>{let n=ir(e,t);return{x:n.x,y:n.y-n.z}},Ym=(e,t)=>({x:t.direction===1?105-(e.y-t.planeY)/t.depthScale:(e.y-t.planeY)/t.depthScale,y:34+(e.x-ne.centreX)/ne.lateralScale,z:e.z});var fn={maxCatchSpeed:29,maxVerticalSpeed:140,minimumHeight:6,maximumHeight:45,gripRadius:8,dropAge:80,puntAge:88,puntEnd:98,endAge:138,carrySpeed:1.8,gravity:280};function Mb(e){return e<10?"standing-secure":e<46?"standing-tuck":e<58?"carry":e<70?"standing-tuck":e<80?"release-prep":e<88?"drop":e<98?"punt":e<110?"follow-through":e<120?"settle":"ready"}function Eb(e,t,n){let i=Math.abs(t),s=Math.abs(n),a=e==="E"||e==="W";return i<1e-4&&s<1e-4?e:a&&s<=i*1.2?t>=0?"E":"W":!a&&i<=s*1.2?n>=0?"S":"N":i>=s?t>=0?"E":"W":n>=0?"S":"N"}function Tb(e,t){let n=t.movement.cycles[e.facing],i=e.moving?n[Math.floor(((e.strideDistance??0)+1e-8)/.72)%n.length]:t.movement.idle[e.facing];return{pose:i.id,mirror:i.mirror}}var bi={width:384,height:224,lookAhead:22};function Ab(e,t,n,i=bi.width){let s=(r,o,l)=>Math.max(o,Math.min(l,r)),a={x:s(e.x-i/2+s(t.x*.48,-bi.lookAhead,bi.lookAhead),0,nr.width-i),y:s(e.y-113+s(t.y*.16,-10,10),-26,nr.bottom+24-bi.height)};return{x:Math.round(n.x+(a.x-n.x)*.22),y:Math.round(n.y+(a.y-n.y)*.22)}}var wT=[{x:4,y:34},{x:24,y:10},{x:21,y:26},{x:21,y:42},{x:24,y:58},{x:43,y:10},{x:40,y:26},{x:40,y:42},{x:43,y:58},{x:62,y:25},{x:62,y:43}],CT=[["tackle-windup",8],["tackle-entry",12],["tackle-slide",8],["tackle-follow",8],["tackle-sit",8],["tackle-crouch",6],["tackle-rise",6],["tackle-recover-ready",8],["compress",6],["settle",6],["ready",8]],ma=e=>e===0?1:0,ih=class{constructor(t,n={}){this.assets=t;this.options=n;this.viewportWidth=384;this.poses=new Map(t.records.map(i=>[i.id,i])),this.state=this.initial(1),this.formation(0)}setViewportWidth(t){let n=Re(Math.round(t),320,640);this.state.camera.x=Re(this.state.camera.x+(this.viewportWidth-n)/2,0,nr.width-n),this.viewportWidth=n}initial(t){return{aerial:null,shotView:null,airContacts:[0,0],airCollections:[0,0],status:"ready",phase:"restart",tick:0,eventSerial:0,round:t,seed:4811,half:1,halfTicks:0,score:[0,0],players:[],selected:9,owner:null,ball:{x:52.5,y:34,z:0,vx:0,vy:0,vz:0},lastTouch:0,lastKicker:null,releaseTick:-999,restart:null,goalAge:0,held:{left:!1,right:!1,up:!1,down:!1},inputSources:{left:[],right:[],up:[],down:[]},events:[],message:"Two 90-second halves. Harbour attacks right first. Start exhibition.",passes:[0,0],shots:[0,0],saves:[0,0],possessionTicks:[0,0],camera:{x:Ge({x:52.5,y:34}).x-this.viewportWidth/2,y:Ge({x:52.5,y:34}).y-113},pendingKickoff:0,noDoubleTouch:null,lastContact:null}}attack(t){return t===0==(this.state.half===1)?1:-1}emit(t,n={}){let i=this.state,s={kind:t,tick:i.tick,sequence:++i.eventSerial,...n};i.events.push(s),i.events.length>80&&i.events.shift(),i.lastContact=s}random(){let t=this.state.seed;return t^=t<<13,t^=t>>>17,t^=t<<5,this.state.seed=t>>>0,this.state.seed/4294967296}clear(){let t=this.state;for(let n of["left","right","up","down"])t.held[n]=!1,t.inputSources[n]=[]}restart(){this.state=this.initial(this.state.round+1),this.formation(0)}snapshot(){return structuredClone(this.state)}formation(t){let n=this.state;n.players=[];for(let s of[0,1])for(let a=0;a<11;a++){let r=wT[a],o=this.attack(s),l=o===1?r.x:105-r.x;a>0&&(l=s===t?o===1?Math.min(l,48):Math.max(l,57):o===1?Math.min(l,42):Math.max(l,63));let c={x:o===1?r.x:105-r.x,y:r.y};n.players.push({id:s*11+a,team:s,role:a===0?"keeper":"outfield",slot:a,x:l,y:r.y,facing:o===1?"E":"W",moving:!1,motionAge:0,home:c,action:null,cooldown:0,decisionTick:n.tick+20+a*5})}let i=(s,a,r,o)=>{let l=n.players[s*11+a];l.x=this.attack(s)===1?r:105-r,l.y=o};i(t,9,52.5,34),i(t,10,48.5,34),i(t,5,48.2,26),i(ma(t),5,47,22),i(ma(t),8,52,58),n.selected=9}setBall(t){Object.assign(this.state.ball,t,{vx:0,vy:0,vz:0})}beginRestart(t,n,i){let s=this.state;this.exitShotView("restart"),s.aerial=null,this.clear(),s.phase="restart",s.owner=null,s.noDoubleTouch=null;for(let l of s.players)l.action=null,delete l.keeperCycle,delete l.contactView,delete l.aiCarryY,l.moving=!1;let r=s.players.filter(l=>l.team===n&&(t==="goal-kick"?l.role==="keeper":l.role==="outfield")).sort((l,c)=>Oe(l,i)-Oe(c,i)||l.id-c.id)[0],o=i;s.restart={kind:t,team:n,point:{...o},taker:r.id,age:0},r.x=o.x,r.y=o.y,r.cooldown=0,r.facing=this.attack(n)===1?"E":"W";for(let l of s.players){if(l===r)continue;let c=Oe(l,o),u=l.team!==n?t==="kickoff"?10:9.15:4;if(c<u){let f=Math.atan2(l.y-o.y,l.x-o.x);l.x=Re(o.x+Math.cos(f)*u,2,103),l.y=Re(o.y+Math.sin(f)*u,2,66)}t==="goal-kick"&&l.team!==n&&(l.x=this.attack(n)===1?Math.max(19,l.x):Math.min(86,l.x))}n===0&&(s.selected=r.id),this.setBall({...o,z:0}),s.message=`${t.toUpperCase()} \u2014 ${n===0?"Harbour: P pass / L loft / S shoot":"Orchard preparing"}.`,this.emit("restart-awarded",{restart:t,team:n,point:{...i},player:r.id})}kickoff(t){this.formation(t),this.beginRestart("kickoff",t,{x:52.5,y:34})}command(t){let n=this.state;if(t.type==="clear"){this.clear();return}if(t.type==="pause"){n.status==="playing"?(n.status="paused",this.clear()):n.status==="paused"&&(n.status="playing");return}if(t.type==="resume"){n.status==="paused"&&(n.status="playing");return}if(t.type==="start"){n.status==="ready"?(n.status="playing",this.kickoff(0)):n.status==="halftime"&&(n.half=2,n.halfTicks=0,n.status="playing",this.kickoff(1),this.emit("second-half"),n.message="Second half \u2014 Harbour attacks LEFT. Orchard kickoff.");return}if(t.type==="next"){n.status==="complete"&&this.restart();return}if(n.status!=="playing")return;if(t.type==="hold"){if(t.value&&n.shotView&&n.shotView.phase!=="aim")return;let s=n.inputSources[t.key];t.value&&!s.includes(t.source)&&s.push(t.source),t.value||(n.inputSources[t.key]=s.filter(a=>a!==t.source)),n.held[t.key]=n.inputSources[t.key].length>0;return}if(n.phase==="goal")return;let i=n.players[n.selected];if(["pass","loft","shoot","tackle","switch","slide"].includes(t.type)){if(n.shotView?.phase==="aim"){t.type==="shoot"&&this.confirmChance();return}if(n.shotView)return;if(n.phase==="restart"){n.restart?.team===0&&!i.action&&this.takeRestart(t.type==="loft",t.type==="shoot");return}if(t.type==="switch"){n.owner!==n.selected&&this.command({type:"C"});return}if(i.action||i.keeperCycle||i.cooldown>0)return;n.owner===i.id?t.type==="pass"?this.kick(i,"pass"):t.type==="loft"?this.kick(i,"loft"):t.type==="shoot"&&(this.canChance(i)?this.beginChance(i):this.kick(i,"shot")):t.type==="tackle"?n.owner===null&&n.aerial?.controlledBy===null?this.control(i):this.tackle(i,"standing"):t.type==="slide"&&this.tackle(i,"slide");return}if(n.shotView?.phase==="aim"){t.type==="A"&&this.confirmChance();return}if(!n.shotView){if(n.phase==="restart"){if(n.restart.team!==0||i.action)return;this.takeRestart(t.type==="B");return}if(!(i.action||i.keeperCycle||i.cooldown>0))if(n.owner===i.id)t.type==="A"?this.attackProgress(i)>70&&this.canChance(i)?this.beginChance(i):this.kick(i,this.attackProgress(i)>70?"shot":"pass"):this.kick(i,t.type==="B"?"loft":"pass",t.type==="C");else if(t.type==="C"){let s=n.players.filter(r=>r.team===0&&r.role==="outfield"&&!r.action).sort((r,o)=>Oe(r,n.ball)-Oe(o,n.ball)||r.id-o.id),a=s.findIndex(r=>r.id===n.selected);n.selected=s[(a+1)%Math.min(3,s.length)].id}else t.type==="A"&&n.owner===null&&n.aerial?.controlledBy===null?this.control(i):(t.type==="A"||t.type==="B")&&this.tackle(i)}}attackingControls(){let t=this.state;return!!t.shotView||t.phase==="restart"&&t.restart?.team===0||t.owner===t.selected}shootPrompt(){let t=this.state,n=t.players[t.selected];return t.status==="playing"&&t.phase==="open"&&!t.shotView&&t.owner===n.id&&!n.action&&n.cooldown===0&&this.attackProgress(n)>70}attackProgress(t){return this.attack(t.team)===1?t.x:105-t.x}primaryAction(){let t=this.state,n=t.players[t.selected];return t.shotView?.phase==="aim"?"SHOOT":t.shotView?"SHOT":t.phase==="restart"?t.restart?.kind==="throw-in"?"THROW":"KICK":t.owner===n.id?this.attackProgress(n)>70?this.canChance(n)?"CHANCE":"SHOOT":"PASS":t.owner===null&&t.aerial?.controlledBy===null?"CONTROL":"TACKLE"}secondaryAction(){let t=this.state;return t.shotView?"WATCH":t.phase==="restart"?t.restart?.kind==="throw-in"?"THROW":"LOFT":t.owner===t.selected?"LOFT":"SLIDE"}tertiaryAction(){let t=this.state;return t.shotView?"WATCH":t.phase==="restart"?"KICK":t.owner===t.selected?"SHORT":"SWITCH"}target(t,n=!1){let i=this.state,s=this.attack(t.team),a=this.direction(),r=t.team===0&&t.id===i.selected&&Oe(a,{x:0,y:0})>.1;return i.players.filter(o=>o.team===t.team&&o.role==="outfield"&&o.id!==t.id&&!o.action).sort((o,l)=>{let c=u=>{let f=Oe(t,u),h=(u.x-t.x)/Math.max(1,f),d=(u.y-t.y)/Math.max(1,f);return f*(n?1.4:.35)-(r?(h*a.x+d*a.y)*18:(u.x-t.x)*s*.6)};return c(o)-c(l)||o.id-l.id})[0]}direction(){let t=this.state.held,n=Number(t.right)-Number(t.left),i=Number(t.down)-Number(t.up),s=Math.hypot(n,i);return s?{x:n/s,y:i/s}:{x:0,y:0}}kick(t,n,i=!1,s){if(t.action||t.cooldown>0||this.state.owner!==t.id)return;if(n==="shot"&&!this.state.shotView&&this.canChance(t)){this.beginChance(t,!1);return}let a=this.state.shotView,r=n==="shot"?{x:this.attack(t.team)===1?108:-3,y:a&&a.shooter===t.id?34+(a.aim.x-ne.centreX)/ne.lateralScale:Re(34+(t.team===0&&t.id===this.state.selected&&this.state.held.up?-6:t.team===0&&t.id===this.state.selected&&this.state.held.down?6:(this.random()-.5)*5),28,40)}:s??this.target(t,i);t.action={kind:n,age:0,target:{x:r.x,y:r.y},targetPlayer:"id"in r?r.id:void 0,released:!1,hit:!1,direction:{x:this.attack(t.team),y:0}},t.facing=this.attack(t.team)===1?"E":"W"}takeRestart(t=!1,n=!1){let i=this.state,s=i.restart,a=i.players[s.taker],r=this.target(a,!0),o=s.kind!=="throw-in"&&(s.kind==="penalty"||n);a.action={kind:s.kind==="throw-in"?"throw":o?"shot":t?"loft":"pass",age:0,target:o?{x:this.attack(a.team)===1?108:-3,y:34}:{x:r.x,y:r.y},released:!1,hit:!1,direction:{x:this.attack(a.team),y:0}}}tackle(t,n="slide"){if(t.role==="keeper"||t.action||t.cooldown>0)return;let i=this.direction(),s=t.team===0&&t.id===this.state.selected&&Oe(i,{x:0,y:0})>.1?i:{x:nh(this.state.ball.x-t.x),y:0};t.facing=s.x>=0?"E":"W",t.action={tackleStyle:n,kind:"tackle",age:0,target:{x:0,y:0},released:!1,hit:!1,direction:{x:s.x>=0?1:-1,y:0}}}view(t){let n,i=!1,s=t.action;if(t.contactView)return t.contactView.view;if(t.role==="keeper"){if(t.keeperCycle)return{pose:"keeper-"+Mb(t.keeperCycle.age),mirror:this.attack(t.team)<0};let a=this.state.shotView;if(a?.keeper===t.id)return{pose:Math.abs(a.aim.x-ne.centreX)>=26?a.age<30?"keeper-01":"keeper-03":"keeper-00",mirror:a.aim.x<ne.centreX};let r=this.state.ball.vx*this.attack(t.team)<-8&&Math.abs(this.state.ball.x-t.x)<20;if(this.options.keeperCatches!==!1&&this.poses.has("keeper-reach")&&!a){let o=this.state.ball;if(Math.hypot(o.vx,o.vy)<=fn.maxCatchSpeed&&o.z>=fn.minimumHeight&&o.z<=fn.maximumHeight&&o.vx*this.attack(t.team)<-1&&Math.abs(o.x-t.x)<18)return{pose:"keeper-reach",mirror:this.attack(t.team)<0};if(!r)return{pose:"keeper-ready",mirror:this.attack(t.team)<0}}return n=r&&this.state.ball.z<24?"keeper-03":"keeper-00",i=n==="keeper-03"?this.attack(t.team)<0:this.attack(t.team)>0,{pose:n,mirror:i}}if(s?.kind==="tackle"){let a=s.age;n="ready";for(let[r,o]of s.tackleStyle==="standing"?[["compress",8],["settle",8],["ready",14]]:CT){if(a<o){n=r;break}a-=o}i=s.direction.x<0}else if(s?.kind==="control")n=s.age<20?"signal":s.age<28?"crouch":s.age<(s.tackleStyle==="standing"?16:36)?"compress":s.age<44?"settle":"ready",i=s.direction.x>0;else if(s?.kind==="stagger")n=s.age<6?"crouch":s.age<12?"compress":s.age<18?"settle":"ready",i=s.direction.x>0;else if(s?.kind==="throw")n=s.age<4?"throw-hold":s.age<12?"throw-overhead":s.age<18?"throw-release":"throw-follow",i=s.target.x<t.x;else if(s)n=s.age<12?"kick-prep":s.age<18?"kick-contact":s.age<26?"kick-follow":"settle",i=s.target.x<t.x;else{let a=Tb(t,this.assets);n=a.pose,i=a.mirror}return{pose:t.team===1?"orchard-"+n:n,mirror:i}}anchor(t,n="foot",i=this.view(t)){let s=this.poses.get(i.pose),r=this.state.shotView?.keeper===t.id&&(n==="leftHand"||n==="rightHand")?s:Hl(s),[o,l]=r.anchors.ground,c=r.anchors[n]??r.anchors.boot??r.anchors.foot??r.anchors.ground,u=Sb(t);return this.state.shotView?.keeper===t.id&&(n==="leftHand"||n==="rightHand")?{x:t.x,y:(Math.round(ne.centreX+(t.y-34)*ne.lateralScale)+(i.mirror?o-c[0]-1:c[0]-o)-ne.centreX)/ne.lateralScale+34,z:Math.max(0,l-c[1])}:{x:(u.x-Ut.x+(i.mirror?o-c[0]-1:c[0]-o))/Ut.scaleX,y:(u.y-Ut.y)/Ut.scaleY,z:Math.max(0,l-c[1])}}throwAnchor(t){return this.anchor(t,"ball")}attach(t){let n=this.anchor(t,t.keeperCycle&&!t.keeperCycle.dropped||t.action?.kind==="throw"?"ball":"foot");this.setBall(n)}canSecure(t,n,i){let s=this.state;if(this.options.keeperCatches===!1||s.shotView||s.owner!==null||t.keeperCycle||!this.poses.has("keeper-standing-secure")||i.vx*this.attack(t.team)>=-1||Math.hypot(i.vx,i.vy)>fn.maxCatchSpeed||Math.abs(i.vz)>fn.maxVerticalSpeed||n.z<fn.minimumHeight||n.z>fn.maximumHeight)return!1;let a=this.anchor(t,"ball",{pose:"keeper-standing-secure",mirror:this.attack(t.team)<0});return Math.hypot((a.x-n.x)*Ut.scaleX,(a.y-n.y)*Ut.scaleY,a.z-n.z)<=fn.gripRadius}secureKeeper(t,n){let i=this.state;t.keeperCycle={age:0,dropped:!1,punted:!1,releaseTick:-1},t.action=null,delete t.contactView,t.cooldown=0,t.moving=!1,i.owner=t.id,i.aerial=null,i.noDoubleTouch=null,i.lastTouch=t.team,i.lastKicker=t.id,i.releaseTick=i.tick,i.saves[t.team]++,this.attach(t),this.emit("keeper-secure",{player:t.id,team:t.team,worldBall:{...n},resolvedGrip:{...i.ball},pose:this.view(t).pose}),i.message="CAUGHT - keeper preparing distribution."}advanceKeeper(t){let n=this.state,i=t.keeperCycle;if(i.age++,t.moving=!1,!i.dropped&&n.owner!==t.id){delete t.keeperCycle,t.cooldown=24,this.emit("keeper-hold-interrupted",{player:t.id});return}if(i.dropped&&!i.punted&&(n.owner!==null||n.lastKicker!==t.id)){delete t.keeperCycle,t.cooldown=24,this.emit("keeper-drop-interrupted",{player:t.id});return}if(i.age>=46&&i.age<58&&!i.dropped&&this.move(t,{x:t.x+this.attack(t.team),y:t.y},fn.carrySpeed),i.age===fn.dropAge){let s={...n.ball},a={pose:"keeper-punt",mirror:this.attack(t.team)<0},r=this.anchor(t,"kickingFoot",a),o={...r,x:r.x+this.attack(t.team)*3/Ut.scaleX},l=fn.puntAge-fn.dropAge+1,c=Math.pow(.995,.5),u=Fe*(1-Math.pow(c,l))/(1-c);n.owner=null,n.aerial=null,i.dropped=!0,i.releaseTick=n.tick,n.lastTouch=t.team,n.lastKicker=t.id,n.releaseTick=n.tick,n.ball.vx=(o.x-s.x)/u,n.ball.vy=(o.y-s.y)/u,n.ball.vz=(o.z-s.z+fn.gravity*Fe*Fe*l*(l-1)/2)/(l*Fe),this.emit("keeper-drop",{player:t.id,team:t.team,worldPoint:s,target:o,pose:"keeper-release-prep"}),n.message="Keeper drop - ball in play."}i.age===fn.puntEnd&&!i.punted&&(this.emit("keeper-punt-missed",{player:t.id}),n.message="Loose ball - keeper missed distribution."),i.age>=fn.endAge&&(delete t.keeperCycle,t.cooldown=1,this.emit("keeper-recovered",{player:t.id}))}puntKeeper(t,n){let i=this.state,s=t.keeperCycle;s.punted=!0,this.setBall(n);let a=this.target(t),r=a.x-n.x,o=a.y-n.y,l=Math.max(.5,Math.hypot(r,o));i.ball.vx=r/l*25,i.ball.vy=o/l*25,i.ball.vz=80,i.owner=null,i.aerial=null,i.lastTouch=t.team,i.lastKicker=t.id,i.releaseTick=i.tick,i.passes[t.team]++,this.emit("keeper-punt",{player:t.id,team:t.team,targetPlayer:a.id,worldPoint:n,pose:this.view(t).pose,anchor:"kickingFoot"}),i.message="Keeper distribution - play on."}release(t,n){let i=this.state;if(i.owner!==t.id&&!(i.phase==="restart"&&i.restart?.taker===t.id)){n.cancelled=!0,this.emit("delivery-cancelled",{player:t.id,reason:"possession-lost"});return}let s=n.kind==="throw"?this.throwAnchor(t):this.anchor(t);this.setBall(s);let a=n.target.x-s.x,r=n.target.y-s.y,o=Math.max(.5,Math.hypot(a,r)),l=n.kind==="shot"?31:n.kind==="loft"?23:22;n.kind==="throw"&&(l=14);let c=o/l;if(i.ball.vx=a/o*l,i.ball.vy=r/o*l,i.ball.vz=n.kind==="loft"?Math.min(230,c*140):n.kind==="throw"?30:n.kind==="shot"?60:0,i.owner=null,i.aerial=null,n.kind==="loft"&&this.loft(t,n,s),n.kind==="shot"&&i.shotView?.shooter===t.id){let u=i.shotView;u.phase="flight",u.age=0;let f=this.attack(t.team)===1?105-s.x:s.x,h=Math.max(1,Math.ceil(f/Math.max(.01,Math.abs(i.ball.vx))/Fe)),d=Math.pow(.995,.5),m=Fe*(1-Math.pow(d,h))/(1-d),b=h*Fe,g=this.attack(t.team)===1?105:-0,p=34+(u.aim.x-ne.centreX)/ne.lateralScale;i.ball.vx=(g-s.x)/m,i.ball.vy=(p-s.y)/m,i.ball.vz=(u.planeY-u.aim.y-s.z+140*b*b)/b}else n.kind!=="shot"&&this.exitShotView("delivery");i.lastTouch=t.team,i.lastKicker=t.id,i.releaseTick=i.tick,n.released=!0,n.kind==="shot"?i.shots[t.team]++:i.passes[t.team]++,i.phase==="restart"&&(i.phase="open",i.restart=null,i.noDoubleTouch=t.id),this.emit(n.kind==="shot"?"shot":"pass",{player:t.id,team:t.team,pose:this.view(t).pose,mirror:this.view(t).mirror,anchor:n.kind==="throw"?"ball":"foot",worldPoint:{...s},delivery:n.kind,point:Ge(s)}),i.message=n.kind==="shot"?"SHOT \u2014 keeper and rebound in play.":"Ball in play \u2014 move to receive, S to switch."}move(t,n,i){n={x:Re(n.x,1,104),y:Re(n.y,1,67)};let s=Oe(t,n),a=Math.min(s,i*Fe),r=t.moving;if(t.moving=s>.1,!t.moving)return;r?t.motionAge++:t.motionAge=0;let o=(n.x-t.x)/s,l=(n.y-t.y)/s;t.strideDistance=r?(t.strideDistance??0)+a:0,t.x+=o*a,t.y+=l*a,t.facing=Eb(t.facing,o,l)}forecastCarrier(t,n){let i=t.moving&&!t.action&&this.state.shotView?.shooter!==t.id,s=i?{x:t.facing==="E"?7.2:t.facing==="W"?-7.2:0,y:t.facing==="S"?7.2:t.facing==="N"?-7.2:0}:{x:0,y:0},a={...t,x:Re(t.x+s.x*n*Fe,1,104),y:Re(t.y+s.y*n*Fe,1,67),motionAge:t.motionAge+(i?n:0)};return a.action&&(a.action={...a.action,age:a.action.age+n}),a.contactView&&a.contactView.ticks<=n&&delete a.contactView,a}pressurePoint(t,n){let s=n.moving&&!n.action&&(n.facing==="E"||n.facing==="W")?n.facing==="E"?1:-1:nh(this.state.ball.x-t.x),a=Hl(this.poses.get(t.team===0?"tackle-entry":"orchard-tackle-entry")),r=a.anchors.ground,o=a.anchors.boot,l=(s<0?r[0]-o[0]-1:o[0]-r[0])/Ut.scaleX,c=this.anchor(this.forecastCarrier(n,8));return{x:c.x-l-s*9*Fe,y:c.y}}challengeLooksReachable(t,n){let i=nh(this.state.ball.x-t.x),s=a=>{let r={...t,x:Re(t.x+i*Math.max(0,a-7)*9*Fe,Math.min(1,t.x),Math.max(104,t.x)),action:{kind:"tackle",age:a,target:{x:0,y:0},released:!1,hit:!1,direction:{x:i,y:0}}};return r.contactView&&r.contactView.ticks<=a&&delete r.contactView,r};for(let a=8;a<20;a++){let r=s(a-1),o=s(a),l=this.forecastCarrier(n,a-1),c=this.forecastCarrier(n,a),u=$i(Xt(this.anchor(r)),Xt(this.anchor(o)),Xt(this.anchor(l)),Xt(this.anchor(c)),Rs.boot),f=$i(Xt({...r,z:0}),Xt({...o,z:0}),Xt({...l,z:0}),Xt({...c,z:0}),Rs.body);if(f&&(!u||f.fraction<u.fraction))return!1;if(u)return!0}return!1}openOutlet(t){let n=this.state.players.filter(a=>a.team!==t.team),i=this.attack(t.team),s=this.state.players.filter(a=>a.team===t.team&&a.role==="outfield"&&a.id!==t.id&&!a.action&&a.cooldown<=0).flatMap(a=>{let r=a.x-t.x,o=a.y-t.y,l=Math.hypot(r,o),c=r*i;if(l<5||l>32||c<2)return[];let u=Math.min(...n.map(h=>Oe(h,a)));return u<3?[]:n.some(h=>{let d=((h.x-t.x)*r+(h.y-t.y)*o)/(l*l);return d>.12&&d<.92&&Math.hypot(h.x-t.x-r*d,h.y-t.y-o*d)<2.4})?[]:[{player:a,score:c*.8-l*.15+Math.min(u,8)*.4}]});return s.sort((a,r)=>r.score-a.score||a.player.id-r.player.id),s[0]?.player}ai(t){let n=this.state;if(t.action||t.cooldown>0)return;let i=n.shotView;if(i?.keeper===t.id){if(t.moving=!1,i.phase==="flight"&&i.age>16){let h=this.poses.get(this.view(t).pose),d=h.anchors.ground,m=h.anchors[Math.abs(i.aim.x-ne.centreX)>=26?"leftHand":"rightHand"],b=i.aim.x<ne.centreX?d[0]-m[0]-1:m[0]-d[0];this.move(t,{x:t.x,y:Re(34+(i.aim.x-b-ne.centreX)/ne.lateralScale,25,43)},39/ne.lateralScale)}return}if(n.aerial&&n.aerial.controlledBy===null&&n.owner===null){let h=n.ball,d=this.anchor(t,"upperTorso",{pose:t.team===0?"signal":"orchard-signal",mirror:h.x>t.x}),m={x:h.x+h.vx*.2,y:h.y+h.vy*.2,z:h.z+h.vz*.2-54*.04};if(t.role==="outfield"&&Math.hypot((m.x-d.x)*Ut.scaleX,(m.y-d.y)*Ut.scaleY,m.z-d.z)<15){this.control(t);return}if(n.aerial.target===t.id){this.move(t,n.aerial.spot,7.2);return}}let s=this.attack(t.team),a=n.owner===null?null:n.players[n.owner];if(t.role==="keeper"){let h=s===1?3:102;this.move(t,{x:h,y:Re(n.ball.y,27,41)},6.8);return}if(a?.id===t.id){if(n.tick>=t.decisionTick){let h=n.players.filter(m=>m.team!==t.team&&Oe(m,t)<6&&Math.abs(m.y-t.y)<3.5).sort((m,b)=>Oe(m,t)-Oe(b,t)||m.id-b.id)[0],d=h?t.y===h.y?t.slot%2?1:-1:nh(t.y-h.y):0;t.aiCarryY=h?Re(t.y+d*6,12,56):Re(34+(t.home.y-34)*.3,12,56)}if(this.move(t,{x:t.x+s*10,y:t.aiCarryY??Re(34+(t.home.y-34)*.3,12,56)},7.2),n.tick>=t.decisionTick)if(t.decisionTick=n.tick+36,this.attackProgress(t)>75)this.kick(t,"shot");else{let h=n.players.some(m=>m.team!==t.team&&(Oe(m,t)<3||Oe(m,t)<6&&(m.x-t.x)*s>0&&Math.abs(m.y-t.y)<3.5)),d=this.openOutlet(t);d&&(h||this.random()<.12)&&this.kick(t,Oe(t,d)>18&&this.random()<.25?"loft":"pass",!1,d)}return}let r=n.players.filter(h=>h.team===t.team&&h.role==="outfield"&&!h.action&&h.cooldown<=0).sort((h,d)=>Oe(h,n.ball)-Oe(d,n.ball)||h.id-d.id);if(r[0]?.id===t.id&&(!a||a.team!==t.team)){if(a&&Oe(t,a)<9&&n.tick>=t.decisionTick&&this.challengeLooksReachable(t,a)){t.decisionTick=n.tick+90,this.tackle(t);return}this.move(t,a?this.pressurePoint(t,a):n.ball,7.2),a&&Oe(t,a)<9&&n.tick>=t.decisionTick&&(t.decisionTick=n.tick+6,this.challengeLooksReachable(t,a)&&(t.decisionTick=n.tick+90,this.tackle(t)));return}if(a&&a.team!==t.team&&r[1]?.id===t.id){this.move(t,{x:a.x-s*5,y:Re(a.y+(t.home.y<a.y?-1.5:1.5),3,65)},7.2);return}let l=a?.team===t.team?10:-4,c=Re((n.ball.x-52.5)*.22,-12,12),u=n.players.find(h=>h.team!==t.team&&h.slot===t.slot),f={x:Re(t.home.x+c+s*l,5,100),y:Re(t.home.y+(n.ball.y-34)*.18,4,64)};a&&a.team!==t.team&&u&&Oe(t,u)<14&&(f={x:u.x-s*3,y:u.y}),this.move(t,f,7.2)}canChance(t){let n=this.state.players[ma(t.team)*11],i=this.attack(t.team);return this.attackProgress(t)>70&&t.y>=20&&t.y<=48&&(n.x-t.x)*i>2}beginChance(t,n=!0){let i=this.state;if(i.owner!==t.id||t.action||i.shotView)return;let s=i.players[ma(t.team)*11],a=this.attack(t.team),r=Math.max(3,(s.x-t.x)*a),o=Re(ne.separation/r,1,16),l=a===1?105-s.x:s.x,c=ne.keeperY-l*o;i.shotView={direction:a,phase:"aim",shooter:t.id,keeper:s.id,team:t.team,age:0,aim:n?{x:ne.centreX,y:c-32}:{x:ne.centreX-75+this.random()*150,y:c-10-this.random()*50},depthScale:o,planeY:c},t.moving=!1,this.clear(),this.emit("shooting-camera-enter",{player:t.id,team:t.team,direction:a}),i.message="CHANCE - aim with arrow keys, S to shoot (auto release after 1.5 seconds).",n||this.confirmChance()}confirmChance(){let t=this.state,n=t.shotView;if(!n||n.phase!=="aim")return;let i=t.players[n.shooter];if(t.owner!==i.id||i.action){this.exitShotView("possession-lost");return}n.phase="windup",n.age=0,this.clear(),this.kick(i,"shot")}exitShotView(t){let n=this.state,i=n.shotView;if(!i)return;n.shotView=null;let s=n.players[i.keeper];s?.contactView&&(s.contactView.view={pose:s.contactView.view.pose,mirror:this.attack(s.team)<0}),this.clear(),this.emit("shooting-camera-return",{reason:t,ball:{...n.ball}})}updateShotView(){let t=this.state,n=t.shotView;if(n){if(n.age++,(n.phase==="aim"||n.phase==="windup")&&t.owner!==n.shooter){this.exitShotView("possession-lost");return}if(n.phase==="aim"){let i=this.direction();n.aim.x=Re(n.aim.x+i.x*66*Fe,24,226),n.aim.y=Re(n.aim.y+i.y*66*Fe,5,120),n.age>=90&&this.confirmChance()}n.phase==="parry"&&n.age>=16&&this.exitShotView("parry"),n.phase==="goal"&&n.age>=45&&this.exitShotView("goal")}}control(t){let n=this.state;t.role!=="outfield"||t.action||t.cooldown||n.owner!==null||!n.aerial||n.aerial.controlledBy!==null||(t.moving=!1,t.motionAge=0,delete t.contactView,t.action={kind:"control",age:0,target:{x:0,y:0},released:!1,hit:!1,direction:{x:n.ball.x>t.x?1:-1,y:0}},t.team===0&&t.id===n.selected&&this.clear(),this.emit("upper-body-control-start",{player:t.id}),n.message="CONTROL - time the upper-body contact, then recover.")}loft(t,n,i){let s=this.state,a=n.targetPlayer===void 0?s.players.filter(h=>h.team===t.team&&h.role==="outfield"&&h.id!==t.id).sort((h,d)=>Oe(h,n.target)-Oe(d,n.target))[0]:s.players[n.targetPlayer],r=i.x>a.x,o={x:a.x,y:a.y},l=this.anchor(a,"upperTorso",{pose:a.team===0?"signal":"orchard-signal",mirror:r}),c=64/60,u=Math.pow(.995,.5),f=Fe*(1-Math.pow(u,64))/(1-u);s.ball.vx=(l.x-i.x)/f,s.ball.vy=(l.y-i.y)/f,s.ball.vz=(l.z-i.z+54*c*c)/c,s.aerial={kicker:t.id,target:a.id,spot:o,age:0,controlledBy:null},t.team===0&&(s.selected=a.id,this.clear()),s.message="LOFT - T controls the aerial ball; S switches player."}step(){let t=this.state;if(t.status!=="playing")return;if(t.tick++,this.updateShotView(),t.phase==="goal"){++t.goalAge>=120&&this.kickoff(t.pendingKickoff),this.updateCamera();return}if(t.phase==="restart"){let l=t.restart;l.age++;let c=t.players[l.taker];if(l.team===1&&l.age>=60&&!c.action&&this.takeRestart(l.kind==="corner"),c.action&&(c.action.age++,c.action.kind==="throw"&&c.action.age<=12&&this.setBall(this.throwAnchor(c)),c.action.age===12)){if(c.action.kind!=="throw"){let u=this.anchor(c);c.x+=l.point.x-u.x,c.y+=l.point.y-u.y}this.release(c,c.action)}this.updateCamera();return}let n=t.shotView,i=t.players.map(l=>({position:{x:l.x,y:l.y},upper:this.anchor(l,"upperTorso"),foot:this.anchor(l),body:{...l,z:25},hands:l.role==="keeper"?["leftHand","rightHand"].map(c=>({name:c,point:this.anchor(l,c)})):[]})),s={...t.ball};for(let l of t.players){l.cooldown>0&&l.cooldown--,l.contactView&&--l.contactView.ticks<=0&&delete l.contactView;let c=l.action;if(l.keeperCycle)this.advanceKeeper(l);else if(c)if(c.age++,l.moving=!1,c.kind==="control"){if(c.age>=54){let u=this.view(l);l.action=null,l.cooldown=1,l.contactView={view:u,ticks:2},this.emit("upper-body-recovery-complete",{player:l.id,hit:c.hit})}}else if(c.kind==="stagger"){if(c.age>=24){let u=this.view(l);l.action=null,l.cooldown=1,l.contactView={view:u,ticks:2},this.emit("stagger-recovered",{player:l.id,team:l.team})}}else c.kind==="tackle"?(c.age>=8&&c.age<36&&(l.x=Re(l.x+c.direction.x*(c.tackleStyle==="standing"?3:9)*Fe,Math.min(1,l.x),Math.max(104,l.x)),l.moving=!0),c.age>=(c.tackleStyle==="standing"?30:84)&&(l.action=null,l.cooldown=1,this.emit("recovered",{player:l.id}))):(!c.released&&!c.cancelled&&c.age>=12&&this.release(l,c),c.age>=30&&(l.action=null,l.cooldown=1));else if(t.shotView?.shooter===l.id)l.moving=!1;else if(l.id===t.selected&&l.team===0&&l.role==="outfield"){let u=this.direction();if(t.shotView?.phase==="aim"&&t.shotView.shooter===l.id){l.moving=!1;continue}this.move(l,{x:l.x+u.x*10,y:l.y+u.y*10},7.2)}else this.ai(l)}if(t.shotView&&n!==t.shotView){let l=t.players[t.shotView.keeper],c=i[l.id],u=this.view(l);c.hands=["leftHand","rightHand"].map(f=>({name:f,point:this.anchor({...l,...c.position},f,u)}))}if(t.owner!==null){let l=t.players[t.owner];this.attach(l),t.possessionTicks[l.team]++}else{let l=t.ball;l.x+=l.vx*Fe,l.y+=l.vy*Fe,l.z+=l.vz*Fe;let c=t.aerial?.controlledBy!==null&&!!t.aerial;l.vz-=(c?270:t.aerial?108:280)*Fe,t.aerial&&t.aerial.age++,c&&l.z<=1&&(l.z=1,l.vz=0),l.z<0&&(t.aerial&&t.aerial.controlledBy===null&&(this.emit("aerial-bounce"),t.aerial=null),l.z=0,l.vz=Math.abs(l.vz)>25?-l.vz*.38:0);let u=Math.pow(c?.92:l.z>1?.995:.985,Fe*30);l.vx*=u,l.vy*=u}let a=this.boundary(s,t.ball),r=[];for(let l of t.players){if(l.id===t.owner)continue;let c=l.action,u=i[l.id],f=l.id===t.lastKicker&&t.tick-t.releaseTick<24;if(l.role==="keeper"){let d=l.keeperCycle;if(d){if(d.dropped&&!d.punted&&t.owner===null&&d.age>=fn.puntAge&&d.age<fn.puntEnd){let p=this.view(l),y=this.anchor({...l,...u.position},"kickingFoot",p),S=this.anchor(l,"kickingFoot",p),v=$i(Xt(y),Xt(S),Xt(s),Xt(t.ball),4);v&&r.push({...v,p:l,kind:"keeper-punt-contact",anchor:"kickingFoot",point:Ui(v.anchor),ball:Ui(v.ball),segment:{anchorStart:Xt(y),anchorEnd:Xt(S),ballStart:Xt(s),ballEnd:Xt(t.ball),radius:4}})}continue}if(!(this.attack(l.team)===1?t.ball.x<17:t.ball.x>88)||t.ball.y<20||t.ball.y>48||f||l.cooldown>0)continue;let b=this.view(l),g=["leftHand","rightHand"].map(p=>({name:p,point:this.anchor({...l,...u.position},p,b)}));for(let p of g){let y=t.shotView?.keeper===l.id?E=>ir(E,t.shotView):Xt,S=t.shotView?.keeper===l.id?6:Rs.receive,v=$i(y(p.point),y(this.anchor(l,p.name)),y(s),y(t.ball),S);v&&r.push({...v,p:l,kind:"save",anchor:p.name,point:t.shotView?.keeper===l.id?Ym(v.anchor,t.shotView):Ui(v.anchor),ball:t.shotView?.keeper===l.id?Ym(v.ball,t.shotView):Ui(v.ball),segment:{anchorStart:y(p.point),anchorEnd:y(this.anchor(l,p.name)),ballStart:y(s),ballEnd:y(t.ball),radius:S}})}continue}if(c?.kind==="control"&&c.age>=8&&c.age<20&&!c.hit&&t.aerial?.controlledBy===null){let d=$i(Xt(u.upper),Xt(this.anchor(l,"upperTorso")),Xt(s),Xt(t.ball),Rs.upper);d&&r.push({...d,p:l,kind:"upper-body-contact",anchor:"upperTorso",point:Ui(d.anchor),ball:Ui(d.ball),segment:{anchorStart:Xt(u.upper),anchorEnd:Xt(this.anchor(l,"upperTorso")),ballStart:Xt(s),ballEnd:Xt(t.ball),radius:Rs.upper}});continue}if(c?.kind==="tackle"&&c.age>=8&&c.age<36&&!c.hit){let d=$i(Xt(u.foot),Xt(this.anchor(l)),Xt(s),Xt(t.ball),Rs.boot);d&&r.push({...d,p:l,kind:"tackle-contact",anchor:"boot",point:Ui(d.anchor),ball:Ui(d.ball)});let m=t.owner===null?null:t.players[t.owner];if(m&&m.team!==l.team){let b=$i(Xt({...i[l.id].body,z:0}),Xt({...l,z:0}),Xt({...i[m.id].body,z:0}),Xt({...m,z:0}),Rs.body);b&&r.push({...b,p:l,kind:"foul",anchor:"body",point:{x:l.x,y:l.y,z:0},ball:{x:t.ball.x,y:t.ball.y,z:t.ball.z}})}continue}if(c||l.cooldown>0||f||t.owner!==null||t.ball.z>6||s.z>12)continue;let h=$i(Xt(u.foot),Xt(this.anchor(l)),Xt(s),Xt(t.ball),Rs.receive);h&&r.push({...h,p:l,kind:"receive",anchor:"foot",point:Ui(h.anchor),ball:Ui(h.ball)})}r.sort((l,c)=>l.fraction-c.fraction||(l.kind==="tackle-contact"?-1:c.kind==="tackle-contact"?1:l.p.id-c.p.id));let o=r[0];if(a&&(!o||a.fraction<o.fraction))this.applyBoundary(a);else if(o){let l=o.p;t.noDoubleTouch!==null&&t.noDoubleTouch!==l.id&&(t.noDoubleTouch=null);let c=o.kind!=="foul"&&t.noDoubleTouch===l.id;if(this.emit(c?"restart-double-touch":o.kind==="receive"&&t.aerial?.controlledBy===l.id?"aerial-foot-collection":o.kind,{segment:o.segment,contactSpace:t.shotView?.keeper===l.id?"goal-pixels":"pitch-pixels",attemptedContact:o.kind,player:l.id,team:l.team,pose:this.view(l).pose,mirror:this.view(l).mirror,anchor:o.anchor,worldPoint:o.point,worldBall:o.ball,distance:o.distance,fraction:o.fraction}),c)this.beginRestart("free-kick",ma(l.team),{x:l.x,y:l.y}),t.message="Second touch after restart - free kick.";else if(o.kind==="foul"){l.action.hit=!0;let u=ma(l.team),f=(this.attack(u)===1?l.x>88:l.x<17)&&l.y>20&&l.y<48;this.beginRestart(f?"penalty":"free-kick",u,f?{x:this.attack(u)===1?94:11,y:34}:{x:l.x,y:l.y})}else if(o.kind==="upper-body-contact")l.action.hit=!0,t.aerial.controlledBy=l.id,t.airContacts[l.team]++,t.lastTouch=l.team,this.setBall(o.ball),t.ball.vx=(l.action.direction.x>0?2.4:-2.4)/Ut.scaleX,t.ball.vz=0,t.message="CONTROL CONTACT - complete recovery before collecting.";else if(o.kind==="keeper-punt-contact")this.puntKeeper(l,o.ball);else if(o.kind==="save"&&this.canSecure(l,o.ball,s))this.secureKeeper(l,o.ball);else if(o.kind==="save")l.contactView={view:this.view(l),ticks:60},t.aerial=null,t.shotView&&(t.shotView.phase="parry",t.shotView.age=0,this.emit("close-keeper-parry",{player:l.id,viewPoint:ir(this.anchor(l,o.anchor),t.shotView)})),l.contactView={view:this.view(l),ticks:60},t.saves[l.team]++,t.owner=null,t.lastTouch=l.team,t.lastKicker=l.id,t.releaseTick=t.tick,this.setBall(this.anchor(l,o.anchor)),t.ball.vx=this.attack(l.team)*12,t.ball.vy=(t.ball.y<34?-1:1)*5,t.ball.vz=40,l.cooldown=60,t.message="SAVE \u2014 live rebound.";else if(o.kind==="tackle-contact"){let u=t.owner===null?null:t.players[t.owner];l.action.hit=!0,t.aerial=null,this.exitShotView("tackle"),t.owner=null,t.lastTouch=l.team,this.setBall(this.anchor(l)),t.ball.vx=l.action.direction.x*6,t.ball.vz=22,t.lastKicker=l.id,t.releaseTick=t.tick,u&&u.team!==l.team&&(u.action&&!u.action.released&&!u.action.cancelled&&this.emit("delivery-cancelled",{player:u.id,reason:"tackled"}),u.action={kind:"stagger",age:0,target:{x:0,y:0},released:!1,hit:!1,direction:{x:u.facing==="E"?1:u.facing==="W"?-1:this.attack(u.team),y:0}},u.moving=!1,delete u.contactView,delete u.aiCarryY,this.emit("stagger-start",{player:u.id,team:u.team,tackler:l.id})),t.message="Tackle contact \u2014 recover before collecting."}else t.aerial?.controlledBy===l.id&&t.airCollections[l.team]++,t.aerial=null,this.exitShotView("possession"),t.owner=l.id,delete l.aiCarryY,l.decisionTick=Math.min(l.decisionTick,t.tick+6),t.lastTouch=l.team,t.noDoubleTouch=null,l.team===0&&(t.selected=l.id),this.attach(l),t.message=l.team===0?"HARBOUR possession \u2014 P pass, L loft, S shoot.":"ORCHARD possession \u2014 T tackle, S switch, D slide."}else a&&this.applyBoundary(a);t.halfTicks++,t.halfTicks>=bb&&this.endPeriod(),this.updateCamera()}boundary(t,n){let s=[];for(let[a,r,o]of[["x",-.5,"left"],["x",105+.5,"right"],["y",-.5,"top"],["y",68+.5,"bottom"]]){let l=n[a],c=t[a];if((r<0?l<r:l>r)&&l!==c){let u=(r-c)/(l-c);u>=0&&u<=1&&s.push({fraction:u,edge:o,point:{x:t.x+(n.x-t.x)*u,y:t.y+(n.y-t.y)*u,z:t.z+(n.z-t.z)*u}})}}return s.sort((a,r)=>a.fraction-r.fraction)[0]??null}applyBoundary(t){let n=this.state,i=t.point;if(t.edge==="top"||t.edge==="bottom"){this.beginRestart("throw-in",ma(n.lastTouch),{x:Re(i.x,1,104),y:t.edge==="top"?0:68});return}let s=t.edge==="right"==(n.half===1)?0:1,a=ma(s);if(i.y>=Ut.goalTop&&i.y<=Ut.goalBottom&&i.z<=er-3){n.score[s]++,n.owner=null,n.phase="goal",n.shotView&&(n.shotView.phase="goal",n.shotView.age=0),n.goalAge=0,n.pendingKickoff=a,this.clear();for(let r of n.players)r.action=null,delete r.keeperCycle,r.moving=!1;this.setBall(i),this.emit("goal",{team:s,score:[...n.score]}),n.message=`GOAL ${s===0?"HARBOUR":"ORCHARD"} \u2014 ${n.score[0]} : ${n.score[1]}`}else n.lastTouch===a?this.beginRestart("corner",s,{x:t.edge==="right"?104.5:.5,y:i.y<34?.5:67.5}):this.beginRestart("goal-kick",a,{x:t.edge==="right"?99:6,y:34})}endPeriod(){let t=this.state;this.exitShotView("whistle"),t.aerial=null,this.clear(),t.owner=null,t.restart=null,t.noDoubleTouch=null;for(let n of t.players)n.action=null,delete n.keeperCycle,delete n.contactView,n.moving=!1;Object.assign(t.ball,{vx:0,vy:0,vz:0}),t.half===1?(t.status="halftime",t.message=`HALFTIME ${t.score[0]} : ${t.score[1]} \u2014 Continue to switch ends.`,this.emit("halftime")):(t.status="complete",t.message=`FULL TIME ${t.score[0]} : ${t.score[1]} \u2014 ${t.score[0]===t.score[1]?"DRAW":t.score[0]>t.score[1]?"HARBOUR WINS":"ORCHARD WINS"}.`,this.emit("fulltime"))}updateCamera(){let t=this.state,n=Ge(t.ball),i=t.owner===null?n:Ge(t.players[t.owner]),s=t.owner===null?{x:t.ball.vx*Ut.scaleX,y:t.ball.vy*Ut.scaleY}:this.state.players[t.owner].moving?{x:(this.state.players[t.owner].facing==="W"?-7.2:this.state.players[t.owner].facing==="E"?7.2:0)*Ut.scaleX,y:0}:{x:0,y:0};t.camera=Ab(i,s,t.camera,this.viewportWidth)}},nh=e=>e>=0?1:-1;var qb=0,Sg=1,Yb=2;var cc=1,Zb=2,No=3,Ra=0,Un=1,Ai=2,as=0,Lo=1,Mg=2,Eg=3,Tg=4,Kb=5;var hr=100,Jb=101,Qb=102,jb=103,$b=104,tS=200,eS=201,nS=202,iS=203,Ag=204,wg=205,sS=206,aS=207,rS=208,oS=209,lS=210,cS=211,uS=212,hS=213,fS=214,Th=0,Ah=1,wh=2,To=3,Ch=4,Rh=5,Dh=6,Nh=7,Cg=0,dS=1,pS=2,Fi=0,Rg=1,Dg=2,Ng=3,Lg=4,Ug=5,Og=6,Ig=7;var Pg=300,Da=301,fr=302,sf=303,af=304,uc=306,Lh=1e3,es=1001,Uh=1002,Xe=1003,mS=1004;var hc=1005;var vn=1006,rf=1007;var Na=1008;var li=1009,Bg=1010,zg=1011,Uo=1012,of=1013,ki=1014,Hi=1015,Vi=1016,lf=1017,cf=1018,Oo=1020,Fg=35902,kg=35899,Hg=1021,Vg=1022,wi=1023,ns=1026,La=1027,Gg=1028,uf=1029,Ua=1030,hf=1031;var ff=1033,fc=33776,dc=33777,pc=33778,mc=33779,df=35840,pf=35841,mf=35842,gf=35843,yf=36196,xf=37492,vf=37496,_f=37488,bf=37489,gc=37490,Sf=37491,Mf=37808,Ef=37809,Tf=37810,Af=37811,wf=37812,Cf=37813,Rf=37814,Df=37815,Nf=37816,Lf=37817,Uf=37818,Of=37819,If=37820,Pf=37821,Bf=36492,zf=36494,Ff=36495,kf=36283,Hf=36284,yc=36285,Vf=36286;var Yl=2300,Oh=2301,Mh=2302,gg=2303,yg=2400,xg=2401,vg=2402;var gS=3200;var Wg=0,yS=1,Ps="",Tn="srgb",Zl="srgb-linear",Kl="linear",he="srgb";var Eh=7680;var xS=519,vS=512,_S=513,bS=514,Gf=515,SS=516,MS=517,Wf=518,ES=519,TS=35044;var Xg="300 es",zi=2e3,Jl=2001;function RT(e){for(let t=e.length-1;t>=0;--t)if(e[t]>=65535)return!0;return!1}function DT(e){return ArrayBuffer.isView(e)&&!(e instanceof DataView)}function Ql(e){return document.createElementNS("http://www.w3.org/1999/xhtml",e)}function AS(){let e=Ql("canvas");return e.style.display="block",e}var wb={},Ao=null;function qg(...e){let t="THREE."+e.shift();Ao?Ao("log",t,...e):console.log(t,...e)}function wS(e){let t=e[0];if(typeof t=="string"&&t.startsWith("TSL:")){let n=e[1];n&&n.isStackTrace?e[0]+=" "+n.getLocation():e[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return e}function Nt(...e){e=wS(e);let t="THREE."+e.shift();if(Ao)Ao("warn",t,...e);else{let n=e[0];n&&n.isStackTrace?console.warn(n.getError(t)):console.warn(t,...e)}}function Ot(...e){e=wS(e);let t="THREE."+e.shift();if(Ao)Ao("error",t,...e);else{let n=e[0];n&&n.isStackTrace?console.error(n.getError(t)):console.error(t,...e)}}function lr(...e){let t=e.join(" ");t in wb||(wb[t]=!0,Nt(...e))}function CS(e,t,n){return new Promise(function(i,s){function a(){switch(e.clientWaitSync(t,e.SYNC_FLUSH_COMMANDS_BIT,0)){case e.WAIT_FAILED:s();break;case e.TIMEOUT_EXPIRED:setTimeout(a,n);break;default:i()}}setTimeout(a,n)})}var RS={[Th]:Ah,[wh]:Dh,[Ch]:Nh,[To]:Rh,[Ah]:Th,[Dh]:wh,[Nh]:Ch,[Rh]:To},is=class{addEventListener(t,n){this._listeners===void 0&&(this._listeners={});let i=this._listeners;i[t]===void 0&&(i[t]=[]),i[t].indexOf(n)===-1&&i[t].push(n)}hasEventListener(t,n){let i=this._listeners;return i===void 0?!1:i[t]!==void 0&&i[t].indexOf(n)!==-1}removeEventListener(t,n){let i=this._listeners;if(i===void 0)return;let s=i[t];if(s!==void 0){let a=s.indexOf(n);a!==-1&&s.splice(a,1)}}dispatchEvent(t){let n=this._listeners;if(n===void 0)return;let i=n[t.type];if(i!==void 0){t.target=this;let s=i.slice(0);for(let a=0,r=s.length;a<r;a++)s[a].call(this,t);t.target=null}}},Mn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];var Zm=Math.PI/180,Ih=180/Math.PI;function xc(){let e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Mn[e&255]+Mn[e>>8&255]+Mn[e>>16&255]+Mn[e>>24&255]+"-"+Mn[t&255]+Mn[t>>8&255]+"-"+Mn[t>>16&15|64]+Mn[t>>24&255]+"-"+Mn[n&63|128]+Mn[n>>8&255]+"-"+Mn[n>>16&255]+Mn[n>>24&255]+Mn[i&255]+Mn[i>>8&255]+Mn[i>>16&255]+Mn[i>>24&255]).toLowerCase()}function te(e,t,n){return Math.max(t,Math.min(n,e))}function NT(e,t){return(e%t+t)%t}function Km(e,t,n){return(1-n)*e+n*t}function Vl(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return e/4294967295;case Uint16Array:return e/65535;case Uint8Array:case Uint8ClampedArray:return e/255;case Int32Array:return Math.max(e/2147483647,-1);case Int16Array:return Math.max(e/32767,-1);case Int8Array:return Math.max(e/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function Gn(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return Math.round(e*4294967295);case Uint16Array:return Math.round(e*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(e*255);case Int32Array:return Math.round(e*2147483647);case Int16Array:return Math.round(e*32767);case Int8Array:return Math.round(e*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}var ie=class e{static{e.prototype.isVector2=!0}constructor(t=0,n=0){this.x=t,this.y=n}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,n){return this.x=t,this.y=n,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,n){switch(t){case 0:this.x=n;break;case 1:this.y=n;break;default:throw new Error("THREE.Vector2: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,n){return this.x=t.x+n.x,this.y=t.y+n.y,this}addScaledVector(t,n){return this.x+=t.x*n,this.y+=t.y*n,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,n){return this.x=t.x-n.x,this.y=t.y-n.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){let n=this.x,i=this.y,s=t.elements;return this.x=s[0]*n+s[3]*i+s[6],this.y=s[1]*n+s[4]*i+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,n){return this.x=te(this.x,t.x,n.x),this.y=te(this.y,t.y,n.y),this}clampScalar(t,n){return this.x=te(this.x,t,n),this.y=te(this.y,t,n),this}clampLength(t,n){let i=this.length();return this.divideScalar(i||1).multiplyScalar(te(i,t,n))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){let n=Math.sqrt(this.lengthSq()*t.lengthSq());if(n===0)return Math.PI/2;let i=this.dot(t)/n;return Math.acos(te(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let n=this.x-t.x,i=this.y-t.y;return n*n+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,n){return this.x+=(t.x-this.x)*n,this.y+=(t.y-this.y)*n,this}lerpVectors(t,n,i){return this.x=t.x+(n.x-t.x)*i,this.y=t.y+(n.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,n=0){return this.x=t[n],this.y=t[n+1],this}toArray(t=[],n=0){return t[n]=this.x,t[n+1]=this.y,t}fromBufferAttribute(t,n){return this.x=t.getX(n),this.y=t.getY(n),this}rotateAround(t,n){let i=Math.cos(n),s=Math.sin(n),a=this.x-t.x,r=this.y-t.y;return this.x=a*i-r*s+t.x,this.y=a*s+r*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},ss=class{constructor(t=0,n=0,i=0,s=1){this.isQuaternion=!0,this._x=t,this._y=n,this._z=i,this._w=s}static slerpFlat(t,n,i,s,a,r,o){let l=i[s+0],c=i[s+1],u=i[s+2],f=i[s+3],h=a[r+0],d=a[r+1],m=a[r+2],b=a[r+3];if(f!==b||l!==h||c!==d||u!==m){let g=l*h+c*d+u*m+f*b;g<0&&(h=-h,d=-d,m=-m,b=-b,g=-g);let p=1-o;if(g<.9995){let y=Math.acos(g),S=Math.sin(y);p=Math.sin(p*y)/S,o=Math.sin(o*y)/S,l=l*p+h*o,c=c*p+d*o,u=u*p+m*o,f=f*p+b*o}else{l=l*p+h*o,c=c*p+d*o,u=u*p+m*o,f=f*p+b*o;let y=1/Math.sqrt(l*l+c*c+u*u+f*f);l*=y,c*=y,u*=y,f*=y}}t[n]=l,t[n+1]=c,t[n+2]=u,t[n+3]=f}static multiplyQuaternionsFlat(t,n,i,s,a,r){let o=i[s],l=i[s+1],c=i[s+2],u=i[s+3],f=a[r],h=a[r+1],d=a[r+2],m=a[r+3];return t[n]=o*m+u*f+l*d-c*h,t[n+1]=l*m+u*h+c*f-o*d,t[n+2]=c*m+u*d+o*h-l*f,t[n+3]=u*m-o*f-l*h-c*d,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,n,i,s){return this._x=t,this._y=n,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,n=!0){let i=t._x,s=t._y,a=t._z,r=t._order,o=Math.cos,l=Math.sin,c=o(i/2),u=o(s/2),f=o(a/2),h=l(i/2),d=l(s/2),m=l(a/2);switch(r){case"XYZ":this._x=h*u*f+c*d*m,this._y=c*d*f-h*u*m,this._z=c*u*m+h*d*f,this._w=c*u*f-h*d*m;break;case"YXZ":this._x=h*u*f+c*d*m,this._y=c*d*f-h*u*m,this._z=c*u*m-h*d*f,this._w=c*u*f+h*d*m;break;case"ZXY":this._x=h*u*f-c*d*m,this._y=c*d*f+h*u*m,this._z=c*u*m+h*d*f,this._w=c*u*f-h*d*m;break;case"ZYX":this._x=h*u*f-c*d*m,this._y=c*d*f+h*u*m,this._z=c*u*m-h*d*f,this._w=c*u*f+h*d*m;break;case"YZX":this._x=h*u*f+c*d*m,this._y=c*d*f+h*u*m,this._z=c*u*m-h*d*f,this._w=c*u*f-h*d*m;break;case"XZY":this._x=h*u*f-c*d*m,this._y=c*d*f-h*u*m,this._z=c*u*m+h*d*f,this._w=c*u*f+h*d*m;break;default:Nt("Quaternion: .setFromEuler() encountered an unknown order: "+r)}return n===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,n){let i=n/2,s=Math.sin(i);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(t){let n=t.elements,i=n[0],s=n[4],a=n[8],r=n[1],o=n[5],l=n[9],c=n[2],u=n[6],f=n[10],h=i+o+f;if(h>0){let d=.5/Math.sqrt(h+1);this._w=.25/d,this._x=(u-l)*d,this._y=(a-c)*d,this._z=(r-s)*d}else if(i>o&&i>f){let d=2*Math.sqrt(1+i-o-f);this._w=(u-l)/d,this._x=.25*d,this._y=(s+r)/d,this._z=(a+c)/d}else if(o>f){let d=2*Math.sqrt(1+o-i-f);this._w=(a-c)/d,this._x=(s+r)/d,this._y=.25*d,this._z=(l+u)/d}else{let d=2*Math.sqrt(1+f-i-o);this._w=(r-s)/d,this._x=(a+c)/d,this._y=(l+u)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(t,n){let i=t.dot(n)+1;return i<1e-8?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*n.z-t.z*n.y,this._y=t.z*n.x-t.x*n.z,this._z=t.x*n.y-t.y*n.x,this._w=i),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(te(this.dot(t),-1,1)))}rotateTowards(t,n){let i=this.angleTo(t);if(i===0)return this;let s=Math.min(1,n/i);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,n){let i=t._x,s=t._y,a=t._z,r=t._w,o=n._x,l=n._y,c=n._z,u=n._w;return this._x=i*u+r*o+s*c-a*l,this._y=s*u+r*l+a*o-i*c,this._z=a*u+r*c+i*l-s*o,this._w=r*u-i*o-s*l-a*c,this._onChangeCallback(),this}slerp(t,n){let i=t._x,s=t._y,a=t._z,r=t._w,o=this.dot(t);o<0&&(i=-i,s=-s,a=-a,r=-r,o=-o);let l=1-n;if(o<.9995){let c=Math.acos(o),u=Math.sin(c);l=Math.sin(l*c)/u,n=Math.sin(n*c)/u,this._x=this._x*l+i*n,this._y=this._y*l+s*n,this._z=this._z*l+a*n,this._w=this._w*l+r*n,this._onChangeCallback()}else this._x=this._x*l+i*n,this._y=this._y*l+s*n,this._z=this._z*l+a*n,this._w=this._w*l+r*n,this.normalize();return this}slerpQuaternions(t,n,i){return this.copy(t).slerp(n,i)}random(){let t=2*Math.PI*Math.random(),n=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),a=Math.sqrt(i);return this.set(s*Math.sin(t),s*Math.cos(t),a*Math.sin(n),a*Math.cos(n))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,n=0){return this._x=t[n],this._y=t[n+1],this._z=t[n+2],this._w=t[n+3],this._onChangeCallback(),this}toArray(t=[],n=0){return t[n]=this._x,t[n+1]=this._y,t[n+2]=this._z,t[n+3]=this._w,t}fromBufferAttribute(t,n){return this._x=t.getX(n),this._y=t.getY(n),this._z=t.getZ(n),this._w=t.getW(n),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},H=class e{static{e.prototype.isVector3=!0}constructor(t=0,n=0,i=0){this.x=t,this.y=n,this.z=i}set(t,n,i){return i===void 0&&(i=this.z),this.x=t,this.y=n,this.z=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,n){switch(t){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;default:throw new Error("THREE.Vector3: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,n){return this.x=t.x+n.x,this.y=t.y+n.y,this.z=t.z+n.z,this}addScaledVector(t,n){return this.x+=t.x*n,this.y+=t.y*n,this.z+=t.z*n,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,n){return this.x=t.x-n.x,this.y=t.y-n.y,this.z=t.z-n.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,n){return this.x=t.x*n.x,this.y=t.y*n.y,this.z=t.z*n.z,this}applyEuler(t){return this.applyQuaternion(Cb.setFromEuler(t))}applyAxisAngle(t,n){return this.applyQuaternion(Cb.setFromAxisAngle(t,n))}applyMatrix3(t){let n=this.x,i=this.y,s=this.z,a=t.elements;return this.x=a[0]*n+a[3]*i+a[6]*s,this.y=a[1]*n+a[4]*i+a[7]*s,this.z=a[2]*n+a[5]*i+a[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){let n=this.x,i=this.y,s=this.z,a=t.elements,r=1/(a[3]*n+a[7]*i+a[11]*s+a[15]);return this.x=(a[0]*n+a[4]*i+a[8]*s+a[12])*r,this.y=(a[1]*n+a[5]*i+a[9]*s+a[13])*r,this.z=(a[2]*n+a[6]*i+a[10]*s+a[14])*r,this}applyQuaternion(t){let n=this.x,i=this.y,s=this.z,a=t.x,r=t.y,o=t.z,l=t.w,c=2*(r*s-o*i),u=2*(o*n-a*s),f=2*(a*i-r*n);return this.x=n+l*c+r*f-o*u,this.y=i+l*u+o*c-a*f,this.z=s+l*f+a*u-r*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){let n=this.x,i=this.y,s=this.z,a=t.elements;return this.x=a[0]*n+a[4]*i+a[8]*s,this.y=a[1]*n+a[5]*i+a[9]*s,this.z=a[2]*n+a[6]*i+a[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,n){return this.x=te(this.x,t.x,n.x),this.y=te(this.y,t.y,n.y),this.z=te(this.z,t.z,n.z),this}clampScalar(t,n){return this.x=te(this.x,t,n),this.y=te(this.y,t,n),this.z=te(this.z,t,n),this}clampLength(t,n){let i=this.length();return this.divideScalar(i||1).multiplyScalar(te(i,t,n))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,n){return this.x+=(t.x-this.x)*n,this.y+=(t.y-this.y)*n,this.z+=(t.z-this.z)*n,this}lerpVectors(t,n,i){return this.x=t.x+(n.x-t.x)*i,this.y=t.y+(n.y-t.y)*i,this.z=t.z+(n.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,n){let i=t.x,s=t.y,a=t.z,r=n.x,o=n.y,l=n.z;return this.x=s*l-a*o,this.y=a*r-i*l,this.z=i*o-s*r,this}projectOnVector(t){let n=t.lengthSq();if(n===0)return this.set(0,0,0);let i=t.dot(this)/n;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return Jm.copy(this).projectOnVector(t),this.sub(Jm)}reflect(t){return this.sub(Jm.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){let n=Math.sqrt(this.lengthSq()*t.lengthSq());if(n===0)return Math.PI/2;let i=this.dot(t)/n;return Math.acos(te(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let n=this.x-t.x,i=this.y-t.y,s=this.z-t.z;return n*n+i*i+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,n,i){let s=Math.sin(n)*t;return this.x=s*Math.sin(i),this.y=Math.cos(n)*t,this.z=s*Math.cos(i),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,n,i){return this.x=t*Math.sin(n),this.y=i,this.z=t*Math.cos(n),this}setFromMatrixPosition(t){let n=t.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this}setFromMatrixScale(t){let n=this.setFromMatrixColumn(t,0).length(),i=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=n,this.y=i,this.z=s,this}setFromMatrixColumn(t,n){return this.fromArray(t.elements,n*4)}setFromMatrix3Column(t,n){return this.fromArray(t.elements,n*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,n=0){return this.x=t[n],this.y=t[n+1],this.z=t[n+2],this}toArray(t=[],n=0){return t[n]=this.x,t[n+1]=this.y,t[n+2]=this.z,t}fromBufferAttribute(t,n){return this.x=t.getX(n),this.y=t.getY(n),this.z=t.getZ(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let t=Math.random()*Math.PI*2,n=Math.random()*2-1,i=Math.sqrt(1-n*n);return this.x=i*Math.cos(t),this.y=n,this.z=i*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},Jm=new H,Cb=new ss,It=class e{static{e.prototype.isMatrix3=!0}constructor(t,n,i,s,a,r,o,l,c){this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,n,i,s,a,r,o,l,c)}set(t,n,i,s,a,r,o,l,c){let u=this.elements;return u[0]=t,u[1]=s,u[2]=o,u[3]=n,u[4]=a,u[5]=l,u[6]=i,u[7]=r,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){let n=this.elements,i=t.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],this}extractBasis(t,n,i){return t.setFromMatrix3Column(this,0),n.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){let n=t.elements;return this.set(n[0],n[4],n[8],n[1],n[5],n[9],n[2],n[6],n[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,n){let i=t.elements,s=n.elements,a=this.elements,r=i[0],o=i[3],l=i[6],c=i[1],u=i[4],f=i[7],h=i[2],d=i[5],m=i[8],b=s[0],g=s[3],p=s[6],y=s[1],S=s[4],v=s[7],E=s[2],T=s[5],C=s[8];return a[0]=r*b+o*y+l*E,a[3]=r*g+o*S+l*T,a[6]=r*p+o*v+l*C,a[1]=c*b+u*y+f*E,a[4]=c*g+u*S+f*T,a[7]=c*p+u*v+f*C,a[2]=h*b+d*y+m*E,a[5]=h*g+d*S+m*T,a[8]=h*p+d*v+m*C,this}multiplyScalar(t){let n=this.elements;return n[0]*=t,n[3]*=t,n[6]*=t,n[1]*=t,n[4]*=t,n[7]*=t,n[2]*=t,n[5]*=t,n[8]*=t,this}determinant(){let t=this.elements,n=t[0],i=t[1],s=t[2],a=t[3],r=t[4],o=t[5],l=t[6],c=t[7],u=t[8];return n*r*u-n*o*c-i*a*u+i*o*l+s*a*c-s*r*l}invert(){let t=this.elements,n=t[0],i=t[1],s=t[2],a=t[3],r=t[4],o=t[5],l=t[6],c=t[7],u=t[8],f=u*r-o*c,h=o*l-u*a,d=c*a-r*l,m=n*f+i*h+s*d;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);let b=1/m;return t[0]=f*b,t[1]=(s*c-u*i)*b,t[2]=(o*i-s*r)*b,t[3]=h*b,t[4]=(u*n-s*l)*b,t[5]=(s*a-o*n)*b,t[6]=d*b,t[7]=(i*l-c*n)*b,t[8]=(r*n-i*a)*b,this}transpose(){let t,n=this.elements;return t=n[1],n[1]=n[3],n[3]=t,t=n[2],n[2]=n[6],n[6]=t,t=n[5],n[5]=n[7],n[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){let n=this.elements;return t[0]=n[0],t[1]=n[3],t[2]=n[6],t[3]=n[1],t[4]=n[4],t[5]=n[7],t[6]=n[2],t[7]=n[5],t[8]=n[8],this}setUvTransform(t,n,i,s,a,r,o){let l=Math.cos(a),c=Math.sin(a);return this.set(i*l,i*c,-i*(l*r+c*o)+r+t,-s*c,s*l,-s*(-c*r+l*o)+o+n,0,0,1),this}scale(t,n){return lr("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(Qm.makeScale(t,n)),this}rotate(t){return lr("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(Qm.makeRotation(-t)),this}translate(t,n){return lr("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(Qm.makeTranslation(t,n)),this}makeTranslation(t,n){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,n,0,0,1),this}makeRotation(t){let n=Math.cos(t),i=Math.sin(t);return this.set(n,-i,0,i,n,0,0,0,1),this}makeScale(t,n){return this.set(t,0,0,0,n,0,0,0,1),this}equals(t){let n=this.elements,i=t.elements;for(let s=0;s<9;s++)if(n[s]!==i[s])return!1;return!0}fromArray(t,n=0){for(let i=0;i<9;i++)this.elements[i]=t[i+n];return this}toArray(t=[],n=0){let i=this.elements;return t[n]=i[0],t[n+1]=i[1],t[n+2]=i[2],t[n+3]=i[3],t[n+4]=i[4],t[n+5]=i[5],t[n+6]=i[6],t[n+7]=i[7],t[n+8]=i[8],t}clone(){return new this.constructor().fromArray(this.elements)}},Qm=new It,Rb=new It().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Db=new It().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function LT(){let e={enabled:!0,workingColorSpace:Zl,spaces:{},convert:function(s,a,r){return this.enabled===!1||a===r||!a||!r||(this.spaces[a].transfer===he&&(s.r=Is(s.r),s.g=Is(s.g),s.b=Is(s.b)),this.spaces[a].primaries!==this.spaces[r].primaries&&(s.applyMatrix3(this.spaces[a].toXYZ),s.applyMatrix3(this.spaces[r].fromXYZ)),this.spaces[r].transfer===he&&(s.r=Eo(s.r),s.g=Eo(s.g),s.b=Eo(s.b))),s},workingToColorSpace:function(s,a){return this.convert(s,this.workingColorSpace,a)},colorSpaceToWorking:function(s,a){return this.convert(s,a,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Ps?Kl:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,a=this.workingColorSpace){return s.fromArray(this.spaces[a].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,a,r){return s.copy(this.spaces[a].toXYZ).multiply(this.spaces[r].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,a){return lr("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),e.workingToColorSpace(s,a)},toWorkingColorSpace:function(s,a){return lr("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),e.colorSpaceToWorking(s,a)}},t=[.64,.33,.3,.6,.15,.06],n=[.2126,.7152,.0722],i=[.3127,.329];return e.define({[Zl]:{primaries:t,whitePoint:i,transfer:Kl,toXYZ:Rb,fromXYZ:Db,luminanceCoefficients:n,workingColorSpaceConfig:{unpackColorSpace:Tn},outputColorSpaceConfig:{drawingBufferColorSpace:Tn}},[Tn]:{primaries:t,whitePoint:i,transfer:he,toXYZ:Rb,fromXYZ:Db,luminanceCoefficients:n,outputColorSpaceConfig:{drawingBufferColorSpace:Tn}}}),e}var jt=LT();function Is(e){return e<.04045?e*.0773993808:Math.pow(e*.9478672986+.0521327014,2.4)}function Eo(e){return e<.0031308?e*12.92:1.055*Math.pow(e,.41666)-.055}var uo,Ph=class{static getDataURL(t,n="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let i;if(t instanceof HTMLCanvasElement)i=t;else{uo===void 0&&(uo=Ql("canvas")),uo.width=t.width,uo.height=t.height;let s=uo.getContext("2d");t instanceof ImageData?s.putImageData(t,0,0):s.drawImage(t,0,0,t.width,t.height),i=uo}return i.toDataURL(n)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){let n=Ql("canvas");n.width=t.width,n.height=t.height;let i=n.getContext("2d");i.drawImage(t,0,0,t.width,t.height);let s=i.getImageData(0,0,t.width,t.height),a=s.data;for(let r=0;r<a.length;r++)a[r]=Is(a[r]/255)*255;return i.putImageData(s,0,0),n}else if(t.data){let n=t.data.slice(0);for(let i=0;i<n.length;i++)n instanceof Uint8Array||n instanceof Uint8ClampedArray?n[i]=Math.floor(Is(n[i]/255)*255):n[i]=Is(n[i]);return{data:n,width:t.width,height:t.height}}else return Nt("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}},UT=0,wo=class{constructor(t=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:UT++}),this.uuid=xc(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){let n=this.data;return typeof HTMLVideoElement<"u"&&n instanceof HTMLVideoElement?t.set(n.videoWidth,n.videoHeight,0):typeof VideoFrame<"u"&&n instanceof VideoFrame?t.set(n.displayWidth,n.displayHeight,0):n!==null?t.set(n.width,n.height,n.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){let n=t===void 0||typeof t=="string";if(!n&&t.images[this.uuid]!==void 0)return t.images[this.uuid];let i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let a;if(Array.isArray(s)){a=[];for(let r=0,o=s.length;r<o;r++)s[r].isDataTexture?a.push(jm(s[r].image)):a.push(jm(s[r]))}else a=jm(s);i.url=a}return n||(t.images[this.uuid]=i),i}};function jm(e){return typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap?Ph.getDataURL(e):e.data?{data:Array.from(e.data),width:e.width,height:e.height,type:e.data.constructor.name}:(Nt("Texture: Unable to serialize Texture."),{})}var OT=0,$m=new H,An=class e extends is{constructor(t=e.DEFAULT_IMAGE,n=e.DEFAULT_MAPPING,i=es,s=es,a=vn,r=Na,o=wi,l=li,c=e.DEFAULT_ANISOTROPY,u=Ps){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:OT++}),this.uuid=xc(),this.name="",this.source=new wo(t),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=a,this.minFilter=r,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new ie(0,0),this.repeat=new ie(1,1),this.center=new ie(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new It,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize($m).x}get height(){return this.source.getSize($m).y}get depth(){return this.source.getSize($m).z}get image(){return this.source.data}set image(t){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,n){this.updateRanges.push({start:t,count:n})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.normalized=t.normalized,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(let n in t){let i=t[n];if(i===void 0){Nt(`Texture.setValues(): parameter '${n}' has value of undefined.`);continue}let s=this[n];if(s===void 0){Nt(`Texture.setValues(): property '${n}' does not exist.`);continue}s&&i&&s.isVector2&&i.isVector2||s&&i&&s.isVector3&&i.isVector3||s&&i&&s.isMatrix3&&i.isMatrix3?s.copy(i):this[n]=i}}toJSON(t){let n=t===void 0||typeof t=="string";if(!n&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];let i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),n||(t.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Pg)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Lh:t.x=t.x-Math.floor(t.x);break;case es:t.x=t.x<0?0:1;break;case Uh:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Lh:t.y=t.y-Math.floor(t.y);break;case es:t.y=t.y<0?0:1;break;case Uh:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}};An.DEFAULT_IMAGE=null;An.DEFAULT_MAPPING=Pg;An.DEFAULT_ANISOTROPY=1;var Pe=class e{static{e.prototype.isVector4=!0}constructor(t=0,n=0,i=0,s=1){this.x=t,this.y=n,this.z=i,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,n,i,s){return this.x=t,this.y=n,this.z=i,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,n){switch(t){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;case 3:this.w=n;break;default:throw new Error("THREE.Vector4: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,n){return this.x=t.x+n.x,this.y=t.y+n.y,this.z=t.z+n.z,this.w=t.w+n.w,this}addScaledVector(t,n){return this.x+=t.x*n,this.y+=t.y*n,this.z+=t.z*n,this.w+=t.w*n,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,n){return this.x=t.x-n.x,this.y=t.y-n.y,this.z=t.z-n.z,this.w=t.w-n.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){let n=this.x,i=this.y,s=this.z,a=this.w,r=t.elements;return this.x=r[0]*n+r[4]*i+r[8]*s+r[12]*a,this.y=r[1]*n+r[5]*i+r[9]*s+r[13]*a,this.z=r[2]*n+r[6]*i+r[10]*s+r[14]*a,this.w=r[3]*n+r[7]*i+r[11]*s+r[15]*a,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);let n=Math.sqrt(1-t.w*t.w);return n<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/n,this.y=t.y/n,this.z=t.z/n),this}setAxisAngleFromRotationMatrix(t){let n,i,s,a,l=t.elements,c=l[0],u=l[4],f=l[8],h=l[1],d=l[5],m=l[9],b=l[2],g=l[6],p=l[10];if(Math.abs(u-h)<.01&&Math.abs(f-b)<.01&&Math.abs(m-g)<.01){if(Math.abs(u+h)<.1&&Math.abs(f+b)<.1&&Math.abs(m+g)<.1&&Math.abs(c+d+p-3)<.1)return this.set(1,0,0,0),this;n=Math.PI;let S=(c+1)/2,v=(d+1)/2,E=(p+1)/2,T=(u+h)/4,C=(f+b)/4,x=(m+g)/4;return S>v&&S>E?S<.01?(i=0,s=.707106781,a=.707106781):(i=Math.sqrt(S),s=T/i,a=C/i):v>E?v<.01?(i=.707106781,s=0,a=.707106781):(s=Math.sqrt(v),i=T/s,a=x/s):E<.01?(i=.707106781,s=.707106781,a=0):(a=Math.sqrt(E),i=C/a,s=x/a),this.set(i,s,a,n),this}let y=Math.sqrt((g-m)*(g-m)+(f-b)*(f-b)+(h-u)*(h-u));return Math.abs(y)<.001&&(y=1),this.x=(g-m)/y,this.y=(f-b)/y,this.z=(h-u)/y,this.w=Math.acos((c+d+p-1)/2),this}setFromMatrixPosition(t){let n=t.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this.w=n[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,n){return this.x=te(this.x,t.x,n.x),this.y=te(this.y,t.y,n.y),this.z=te(this.z,t.z,n.z),this.w=te(this.w,t.w,n.w),this}clampScalar(t,n){return this.x=te(this.x,t,n),this.y=te(this.y,t,n),this.z=te(this.z,t,n),this.w=te(this.w,t,n),this}clampLength(t,n){let i=this.length();return this.divideScalar(i||1).multiplyScalar(te(i,t,n))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,n){return this.x+=(t.x-this.x)*n,this.y+=(t.y-this.y)*n,this.z+=(t.z-this.z)*n,this.w+=(t.w-this.w)*n,this}lerpVectors(t,n,i){return this.x=t.x+(n.x-t.x)*i,this.y=t.y+(n.y-t.y)*i,this.z=t.z+(n.z-t.z)*i,this.w=t.w+(n.w-t.w)*i,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,n=0){return this.x=t[n],this.y=t[n+1],this.z=t[n+2],this.w=t[n+3],this}toArray(t=[],n=0){return t[n]=this.x,t[n+1]=this.y,t[n+2]=this.z,t[n+3]=this.w,t}fromBufferAttribute(t,n){return this.x=t.getX(n),this.y=t.getY(n),this.z=t.getZ(n),this.w=t.getW(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Bh=class extends is{constructor(t=1,n=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:vn,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},i),this.isRenderTarget=!0,this.width=t,this.height=n,this.depth=i.depth,this.scissor=new Pe(0,0,t,n),this.scissorTest=!1,this.viewport=new Pe(0,0,t,n),this.textures=[];let s={width:t,height:n,depth:i.depth},a=new An(s),r=i.count;for(let o=0;o<r;o++)this.textures[o]=a.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveColorBuffer=i.resolveColorBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.storeMultisampledColorBuffer=i.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=i.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=i.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview,this.useArrayDepthTexture=i.useArrayDepthTexture}_setTextureOptions(t={}){let n={minFilter:vn,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(n.mapping=t.mapping),t.wrapS!==void 0&&(n.wrapS=t.wrapS),t.wrapT!==void 0&&(n.wrapT=t.wrapT),t.wrapR!==void 0&&(n.wrapR=t.wrapR),t.magFilter!==void 0&&(n.magFilter=t.magFilter),t.minFilter!==void 0&&(n.minFilter=t.minFilter),t.format!==void 0&&(n.format=t.format),t.type!==void 0&&(n.type=t.type),t.anisotropy!==void 0&&(n.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(n.colorSpace=t.colorSpace),t.flipY!==void 0&&(n.flipY=t.flipY),t.generateMipmaps!==void 0&&(n.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(n.internalFormat=t.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(n)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),t!==null&&t.renderTarget===null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,n,i=1){if(this.width!==t||this.height!==n||this.depth!==i){this.width=t,this.height=n,this.depth=i;for(let s=0,a=this.textures.length;s<a;s++)this.textures[s].image.width=t,this.textures[s].image.height=n,this.textures[s].image.depth=i,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,t,n),this.scissor.set(0,0,t,n)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let n=0,i=t.textures.length;n<i;n++){this.textures[n]=t.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0,this.textures[n].renderTarget=this;let s=Object.assign({},t.textures[n].image);this.textures[n].source=new wo(s)}if(this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveColorBuffer=t.resolveColorBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,this.storeMultisampledColorBuffer=t.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=t.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=t.storeMultisampledStencilBuffer,t.depthTexture!==null)if(t.depthTexture.renderTarget===t){let n=t.depthTexture.clone();n.renderTarget=null,this.depthTexture=n}else this.depthTexture=t.depthTexture;return this.samples=t.samples,this.multiview=t.multiview,this.useArrayDepthTexture=t.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}},Xn=class extends Bh{constructor(t=1,n=1,i={}){super(t,n,i),this.isWebGLRenderTarget=!0}},jl=class extends An{constructor(t=null,n=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:n,height:i,depth:s},this.magFilter=Xe,this.minFilter=Xe,this.wrapR=es,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(t){return super.copy(t),this.wrapR=t.wrapR,this}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}};var zh=class extends An{constructor(t=null,n=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:n,height:i,depth:s},this.magFilter=Xe,this.minFilter=Xe,this.wrapR=es,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(t){return super.copy(t),this.wrapR=t.wrapR,this}};var We=class e{static{e.prototype.isMatrix4=!0}constructor(t,n,i,s,a,r,o,l,c,u,f,h,d,m,b,g){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,n,i,s,a,r,o,l,c,u,f,h,d,m,b,g)}set(t,n,i,s,a,r,o,l,c,u,f,h,d,m,b,g){let p=this.elements;return p[0]=t,p[4]=n,p[8]=i,p[12]=s,p[1]=a,p[5]=r,p[9]=o,p[13]=l,p[2]=c,p[6]=u,p[10]=f,p[14]=h,p[3]=d,p[7]=m,p[11]=b,p[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new e().fromArray(this.elements)}copy(t){let n=this.elements,i=t.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],n[9]=i[9],n[10]=i[10],n[11]=i[11],n[12]=i[12],n[13]=i[13],n[14]=i[14],n[15]=i[15],this}copyPosition(t){let n=this.elements,i=t.elements;return n[12]=i[12],n[13]=i[13],n[14]=i[14],this}setFromMatrix3(t){let n=t.elements;return this.set(n[0],n[3],n[6],0,n[1],n[4],n[7],0,n[2],n[5],n[8],0,0,0,0,1),this}extractBasis(t,n,i){return this.determinantAffine()===0?(t.set(1,0,0),n.set(0,1,0),i.set(0,0,1),this):(t.setFromMatrixColumn(this,0),n.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(t,n,i){return this.set(t.x,n.x,i.x,0,t.y,n.y,i.y,0,t.z,n.z,i.z,0,0,0,0,1),this}extractRotation(t){if(t.determinantAffine()===0)return this.identity();let n=this.elements,i=t.elements,s=1/ho.setFromMatrixColumn(t,0).length(),a=1/ho.setFromMatrixColumn(t,1).length(),r=1/ho.setFromMatrixColumn(t,2).length();return n[0]=i[0]*s,n[1]=i[1]*s,n[2]=i[2]*s,n[3]=0,n[4]=i[4]*a,n[5]=i[5]*a,n[6]=i[6]*a,n[7]=0,n[8]=i[8]*r,n[9]=i[9]*r,n[10]=i[10]*r,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromEuler(t){let n=this.elements,i=t.x,s=t.y,a=t.z,r=Math.cos(i),o=Math.sin(i),l=Math.cos(s),c=Math.sin(s),u=Math.cos(a),f=Math.sin(a);if(t.order==="XYZ"){let h=r*u,d=r*f,m=o*u,b=o*f;n[0]=l*u,n[4]=-l*f,n[8]=c,n[1]=d+m*c,n[5]=h-b*c,n[9]=-o*l,n[2]=b-h*c,n[6]=m+d*c,n[10]=r*l}else if(t.order==="YXZ"){let h=l*u,d=l*f,m=c*u,b=c*f;n[0]=h+b*o,n[4]=m*o-d,n[8]=r*c,n[1]=r*f,n[5]=r*u,n[9]=-o,n[2]=d*o-m,n[6]=b+h*o,n[10]=r*l}else if(t.order==="ZXY"){let h=l*u,d=l*f,m=c*u,b=c*f;n[0]=h-b*o,n[4]=-r*f,n[8]=m+d*o,n[1]=d+m*o,n[5]=r*u,n[9]=b-h*o,n[2]=-r*c,n[6]=o,n[10]=r*l}else if(t.order==="ZYX"){let h=r*u,d=r*f,m=o*u,b=o*f;n[0]=l*u,n[4]=m*c-d,n[8]=h*c+b,n[1]=l*f,n[5]=b*c+h,n[9]=d*c-m,n[2]=-c,n[6]=o*l,n[10]=r*l}else if(t.order==="YZX"){let h=r*l,d=r*c,m=o*l,b=o*c;n[0]=l*u,n[4]=b-h*f,n[8]=m*f+d,n[1]=f,n[5]=r*u,n[9]=-o*u,n[2]=-c*u,n[6]=d*f+m,n[10]=h-b*f}else if(t.order==="XZY"){let h=r*l,d=r*c,m=o*l,b=o*c;n[0]=l*u,n[4]=-f,n[8]=c*u,n[1]=h*f+b,n[5]=r*u,n[9]=d*f-m,n[2]=m*f-d,n[6]=o*u,n[10]=b*f+h}return n[3]=0,n[7]=0,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromQuaternion(t){return this.compose(IT,t,PT)}lookAt(t,n,i){let s=this.elements;return si.subVectors(t,n),si.lengthSq()===0&&(si.z=1),si.normalize(),ga.crossVectors(i,si),ga.lengthSq()===0&&(Math.abs(i.z)===1?si.x+=1e-4:si.z+=1e-4,si.normalize(),ga.crossVectors(i,si)),ga.normalize(),sh.crossVectors(si,ga),s[0]=ga.x,s[4]=sh.x,s[8]=si.x,s[1]=ga.y,s[5]=sh.y,s[9]=si.y,s[2]=ga.z,s[6]=sh.z,s[10]=si.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,n){let i=t.elements,s=n.elements,a=this.elements,r=i[0],o=i[4],l=i[8],c=i[12],u=i[1],f=i[5],h=i[9],d=i[13],m=i[2],b=i[6],g=i[10],p=i[14],y=i[3],S=i[7],v=i[11],E=i[15],T=s[0],C=s[4],x=s[8],A=s[12],R=s[1],O=s[5],F=s[9],V=s[13],U=s[2],G=s[6],J=s[10],q=s[14],it=s[3],P=s[7],K=s[11],$=s[15];return a[0]=r*T+o*R+l*U+c*it,a[4]=r*C+o*O+l*G+c*P,a[8]=r*x+o*F+l*J+c*K,a[12]=r*A+o*V+l*q+c*$,a[1]=u*T+f*R+h*U+d*it,a[5]=u*C+f*O+h*G+d*P,a[9]=u*x+f*F+h*J+d*K,a[13]=u*A+f*V+h*q+d*$,a[2]=m*T+b*R+g*U+p*it,a[6]=m*C+b*O+g*G+p*P,a[10]=m*x+b*F+g*J+p*K,a[14]=m*A+b*V+g*q+p*$,a[3]=y*T+S*R+v*U+E*it,a[7]=y*C+S*O+v*G+E*P,a[11]=y*x+S*F+v*J+E*K,a[15]=y*A+S*V+v*q+E*$,this}multiplyScalar(t){let n=this.elements;return n[0]*=t,n[4]*=t,n[8]*=t,n[12]*=t,n[1]*=t,n[5]*=t,n[9]*=t,n[13]*=t,n[2]*=t,n[6]*=t,n[10]*=t,n[14]*=t,n[3]*=t,n[7]*=t,n[11]*=t,n[15]*=t,this}determinant(){let t=this.elements,n=t[0],i=t[4],s=t[8],a=t[12],r=t[1],o=t[5],l=t[9],c=t[13],u=t[2],f=t[6],h=t[10],d=t[14],m=t[3],b=t[7],g=t[11],p=t[15],y=l*d-c*h,S=o*d-c*f,v=o*h-l*f,E=r*d-c*u,T=r*h-l*u,C=r*f-o*u;return n*(b*y-g*S+p*v)-i*(m*y-g*E+p*T)+s*(m*S-b*E+p*C)-a*(m*v-b*T+g*C)}determinantAffine(){let t=this.elements,n=t[0],i=t[4],s=t[8],a=t[1],r=t[5],o=t[9],l=t[2],c=t[6],u=t[10];return n*(r*u-o*c)-i*(a*u-o*l)+s*(a*c-r*l)}transpose(){let t=this.elements,n;return n=t[1],t[1]=t[4],t[4]=n,n=t[2],t[2]=t[8],t[8]=n,n=t[6],t[6]=t[9],t[9]=n,n=t[3],t[3]=t[12],t[12]=n,n=t[7],t[7]=t[13],t[13]=n,n=t[11],t[11]=t[14],t[14]=n,this}setPosition(t,n,i){let s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=n,s[14]=i),this}invert(){let t=this.elements,n=t[0],i=t[1],s=t[2],a=t[3],r=t[4],o=t[5],l=t[6],c=t[7],u=t[8],f=t[9],h=t[10],d=t[11],m=t[12],b=t[13],g=t[14],p=t[15],y=n*o-i*r,S=n*l-s*r,v=n*c-a*r,E=i*l-s*o,T=i*c-a*o,C=s*c-a*l,x=u*b-f*m,A=u*g-h*m,R=u*p-d*m,O=f*g-h*b,F=f*p-d*b,V=h*p-d*g,U=y*V-S*F+v*O+E*R-T*A+C*x;if(U===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let G=1/U;return t[0]=(o*V-l*F+c*O)*G,t[1]=(s*F-i*V-a*O)*G,t[2]=(b*C-g*T+p*E)*G,t[3]=(h*T-f*C-d*E)*G,t[4]=(l*R-r*V-c*A)*G,t[5]=(n*V-s*R+a*A)*G,t[6]=(g*v-m*C-p*S)*G,t[7]=(u*C-h*v+d*S)*G,t[8]=(r*F-o*R+c*x)*G,t[9]=(i*R-n*F-a*x)*G,t[10]=(m*T-b*v+p*y)*G,t[11]=(f*v-u*T-d*y)*G,t[12]=(o*A-r*O-l*x)*G,t[13]=(n*O-i*A+s*x)*G,t[14]=(b*S-m*E-g*y)*G,t[15]=(u*E-f*S+h*y)*G,this}scale(t){let n=this.elements,i=t.x,s=t.y,a=t.z;return n[0]*=i,n[4]*=s,n[8]*=a,n[1]*=i,n[5]*=s,n[9]*=a,n[2]*=i,n[6]*=s,n[10]*=a,n[3]*=i,n[7]*=s,n[11]*=a,this}getMaxScaleOnAxis(){let t=this.elements,n=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(n,i,s))}makeTranslation(t,n,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,n,0,0,1,i,0,0,0,1),this}makeRotationX(t){let n=Math.cos(t),i=Math.sin(t);return this.set(1,0,0,0,0,n,-i,0,0,i,n,0,0,0,0,1),this}makeRotationY(t){let n=Math.cos(t),i=Math.sin(t);return this.set(n,0,i,0,0,1,0,0,-i,0,n,0,0,0,0,1),this}makeRotationZ(t){let n=Math.cos(t),i=Math.sin(t);return this.set(n,-i,0,0,i,n,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,n){let i=Math.cos(n),s=Math.sin(n),a=1-i,r=t.x,o=t.y,l=t.z,c=a*r,u=a*o;return this.set(c*r+i,c*o-s*l,c*l+s*o,0,c*o+s*l,u*o+i,u*l-s*r,0,c*l-s*o,u*l+s*r,a*l*l+i,0,0,0,0,1),this}makeScale(t,n,i){return this.set(t,0,0,0,0,n,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,n,i,s,a,r){return this.set(1,i,a,0,t,1,r,0,n,s,1,0,0,0,0,1),this}compose(t,n,i){let s=this.elements,a=n._x,r=n._y,o=n._z,l=n._w,c=a+a,u=r+r,f=o+o,h=a*c,d=a*u,m=a*f,b=r*u,g=r*f,p=o*f,y=l*c,S=l*u,v=l*f,E=i.x,T=i.y,C=i.z;return s[0]=(1-(b+p))*E,s[1]=(d+v)*E,s[2]=(m-S)*E,s[3]=0,s[4]=(d-v)*T,s[5]=(1-(h+p))*T,s[6]=(g+y)*T,s[7]=0,s[8]=(m+S)*C,s[9]=(g-y)*C,s[10]=(1-(h+b))*C,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,n,i){let s=this.elements;t.x=s[12],t.y=s[13],t.z=s[14];let a=this.determinantAffine();if(a===0)return i.set(1,1,1),n.identity(),this;let r=ho.set(s[0],s[1],s[2]).length(),o=ho.set(s[4],s[5],s[6]).length(),l=ho.set(s[8],s[9],s[10]).length();a<0&&(r=-r),Oi.copy(this);let c=1/r,u=1/o,f=1/l;return Oi.elements[0]*=c,Oi.elements[1]*=c,Oi.elements[2]*=c,Oi.elements[4]*=u,Oi.elements[5]*=u,Oi.elements[6]*=u,Oi.elements[8]*=f,Oi.elements[9]*=f,Oi.elements[10]*=f,n.setFromRotationMatrix(Oi),i.x=r,i.y=o,i.z=l,this}makePerspective(t,n,i,s,a,r,o=zi,l=!1){let c=this.elements,u=2*a/(n-t),f=2*a/(i-s),h=(n+t)/(n-t),d=(i+s)/(i-s),m,b;if(l)m=a/(r-a),b=r*a/(r-a);else if(o===zi)m=-(r+a)/(r-a),b=-2*r*a/(r-a);else if(o===Jl)m=-r/(r-a),b=-r*a/(r-a);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=u,c[4]=0,c[8]=h,c[12]=0,c[1]=0,c[5]=f,c[9]=d,c[13]=0,c[2]=0,c[6]=0,c[10]=m,c[14]=b,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,n,i,s,a,r,o=zi,l=!1){let c=this.elements,u=2/(n-t),f=2/(i-s),h=-(n+t)/(n-t),d=-(i+s)/(i-s),m,b;if(l)m=1/(r-a),b=r/(r-a);else if(o===zi)m=-2/(r-a),b=-(r+a)/(r-a);else if(o===Jl)m=-1/(r-a),b=-a/(r-a);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=u,c[4]=0,c[8]=0,c[12]=h,c[1]=0,c[5]=f,c[9]=0,c[13]=d,c[2]=0,c[6]=0,c[10]=m,c[14]=b,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){let n=this.elements,i=t.elements;for(let s=0;s<16;s++)if(n[s]!==i[s])return!1;return!0}fromArray(t,n=0){for(let i=0;i<16;i++)this.elements[i]=t[i+n];return this}toArray(t=[],n=0){let i=this.elements;return t[n]=i[0],t[n+1]=i[1],t[n+2]=i[2],t[n+3]=i[3],t[n+4]=i[4],t[n+5]=i[5],t[n+6]=i[6],t[n+7]=i[7],t[n+8]=i[8],t[n+9]=i[9],t[n+10]=i[10],t[n+11]=i[11],t[n+12]=i[12],t[n+13]=i[13],t[n+14]=i[14],t[n+15]=i[15],t}},ho=new H,Oi=new We,IT=new H(0,0,0),PT=new H(1,1,1),ga=new H,sh=new H,si=new H,Nb=new We,Lb=new ss,Sa=class e{constructor(t=0,n=0,i=0,s=e.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=n,this._z=i,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,n,i,s=this._order){return this._x=t,this._y=n,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,n=this._order,i=!0){let s=t.elements,a=s[0],r=s[4],o=s[8],l=s[1],c=s[5],u=s[9],f=s[2],h=s[6],d=s[10];switch(n){case"XYZ":this._y=Math.asin(te(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-u,d),this._z=Math.atan2(-r,a)):(this._x=Math.atan2(h,c),this._z=0);break;case"YXZ":this._x=Math.asin(-te(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(o,d),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-f,a),this._z=0);break;case"ZXY":this._x=Math.asin(te(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-f,d),this._z=Math.atan2(-r,c)):(this._y=0,this._z=Math.atan2(l,a));break;case"ZYX":this._y=Math.asin(-te(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(h,d),this._z=Math.atan2(l,a)):(this._x=0,this._z=Math.atan2(-r,c));break;case"YZX":this._z=Math.asin(te(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-f,a)):(this._x=0,this._y=Math.atan2(o,d));break;case"XZY":this._z=Math.asin(-te(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(h,c),this._y=Math.atan2(o,a)):(this._x=Math.atan2(-u,d),this._y=0);break;default:Nt("Euler: .setFromRotationMatrix() encountered an unknown order: "+n)}return this._order=n,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,n,i){return Nb.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Nb,n,i)}setFromVector3(t,n=this._order){return this.set(t.x,t.y,t.z,n)}reorder(t){return Lb.setFromEuler(this),this.setFromQuaternion(Lb,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],n=0){return t[n]=this._x,t[n+1]=this._y,t[n+2]=this._z,t[n+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Sa.DEFAULT_ORDER="XYZ";var $l=class{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}},BT=0,Ub=new H,fo=new ss,Ds=new We,ah=new H,Gl=new H,zT=new H,FT=new ss,Ob=new H(1,0,0),Ib=new H(0,1,0),Pb=new H(0,0,1),Bb={type:"added"},kT={type:"removed"},po={type:"childadded",child:null},tg={type:"childremoved",child:null},Ei=class e extends is{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:BT++}),this.uuid=xc(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=e.DEFAULT_UP.clone();let t=new H,n=new Sa,i=new ss,s=new H(1,1,1);function a(){i.setFromEuler(n,!1)}function r(){n.setFromQuaternion(i,void 0,!1)}n._onChange(a),i._onChange(r),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new We},normalMatrix:{value:new It}}),this.matrix=new We,this.matrixWorld=new We,this.matrixAutoUpdate=e.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=e.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new $l,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,n){this.quaternion.setFromAxisAngle(t,n)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,n){return fo.setFromAxisAngle(t,n),this.quaternion.multiply(fo),this}rotateOnWorldAxis(t,n){return fo.setFromAxisAngle(t,n),this.quaternion.premultiply(fo),this}rotateX(t){return this.rotateOnAxis(Ob,t)}rotateY(t){return this.rotateOnAxis(Ib,t)}rotateZ(t){return this.rotateOnAxis(Pb,t)}translateOnAxis(t,n){return Ub.copy(t).applyQuaternion(this.quaternion),this.position.add(Ub.multiplyScalar(n)),this}translateX(t){return this.translateOnAxis(Ob,t)}translateY(t){return this.translateOnAxis(Ib,t)}translateZ(t){return this.translateOnAxis(Pb,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Ds.copy(this.matrixWorld).invert())}lookAt(t,n,i){t.isVector3?ah.copy(t):ah.set(t,n,i);let s=this.parent;this.updateWorldMatrix(!0,!1),Gl.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Ds.lookAt(Gl,ah,this.up):Ds.lookAt(ah,Gl,this.up),this.quaternion.setFromRotationMatrix(Ds),s&&(Ds.extractRotation(s.matrixWorld),fo.setFromRotationMatrix(Ds),this.quaternion.premultiply(fo.invert()))}add(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.add(arguments[n]);return this}return t===this?(Ot("Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Bb),po.child=t,this.dispatchEvent(po),po.child=null):Ot("Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}let n=this.children.indexOf(t);return n!==-1&&(t.parent=null,this.children.splice(n,1),t.dispatchEvent(kT),tg.child=t,this.dispatchEvent(tg),tg.child=null),this}removeFromParent(){let t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Ds.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Ds.multiply(t.parent.matrixWorld)),t.applyMatrix4(Ds),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Bb),po.child=t,this.dispatchEvent(po),po.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,n){if(this[t]===n)return this;for(let i=0,s=this.children.length;i<s;i++){let r=this.children[i].getObjectByProperty(t,n);if(r!==void 0)return r}}getObjectsByProperty(t,n,i=[]){this[t]===n&&i.push(this);let s=this.children;for(let a=0,r=s.length;a<r;a++)s[a].getObjectsByProperty(t,n,i);return i}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Gl,t,zT),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Gl,FT,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let n=this.matrixWorld.elements;return t.set(n[8],n[9],n[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(t){t(this);let n=this.children;for(let i=0,s=n.length;i<s;i++)n[i].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);let n=this.children;for(let i=0,s=n.length;i<s;i++)n[i].traverseVisible(t)}traverseAncestors(t){let n=this.parent;n!==null&&(t(n),n.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let t=this.pivot;if(t!==null){let n=t.x,i=t.y,s=t.z,a=this.matrix.elements;a[12]+=n-a[0]*n-a[4]*i-a[8]*s,a[13]+=i-a[1]*n-a[5]*i-a[9]*s,a[14]+=s-a[2]*n-a[6]*i-a[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);let n=this.children;for(let i=0,s=n.length;i<s;i++)n[i].updateMatrixWorld(t)}updateWorldMatrix(t,n,i=!1){let s=this.parent;if(t===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||i)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,i=!0),n===!0){let a=this.children;for(let r=0,o=a.length;r<o;r++)a[r].updateWorldMatrix(!1,!0,i)}}toJSON(t){let n=t===void 0||typeof t=="string",i={};n&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,s.name=this.name,s.castShadow=this.castShadow,s.receiveShadow=this.receiveShadow,s.visible=this.visible,s.frustumCulled=this.frustumCulled,s.renderOrder=this.renderOrder,s.static=this.static,s.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(t),s.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function a(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=a(t.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let l=o.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){let f=l[c];a(t.shapes,f)}else a(t.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(a(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(a(t.materials,this.material[l]));s.material=o}else s.material=a(t.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){let l=this.animations[o];s.animations.push(a(t.animations,l))}}if(n){let o=r(t.geometries),l=r(t.materials),c=r(t.textures),u=r(t.images),f=r(t.shapes),h=r(t.skeletons),d=r(t.animations),m=r(t.nodes);o.length>0&&(i.geometries=o),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),u.length>0&&(i.images=u),f.length>0&&(i.shapes=f),h.length>0&&(i.skeletons=h),d.length>0&&(i.animations=d),m.length>0&&(i.nodes=m)}return i.object=s,i;function r(o){let l=[];for(let c in o){let u=o[c];delete u.metadata,l.push(u)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,n=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.pivot=t.pivot!==null?t.pivot.clone():null,this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.static=t.static,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),n===!0)for(let i=0;i<t.children.length;i++){let s=t.children[i];this.add(s.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}};Ei.DEFAULT_UP=new H(0,1,0);Ei.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ei.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Ln=class extends Ei{constructor(){super(),this.isGroup=!0,this.type="Group"}},HT={type:"move"},Co=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Ln,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Ln,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new H,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new H),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Ln,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new H,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new H,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){let n=this._hand;if(n)for(let i of t.hand.values())this._getHandJoint(n,i)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,n,i){let s=null,a=null,r=null,o=this._targetRay,l=this._grip,c=this._hand;if(t&&n.session.visibilityState!=="visible-blurred"){if(c&&t.hand){r=!0;for(let b of t.hand.values()){let g=n.getJointPose(b,i),p=this._getHandJoint(c,b);g!==null&&(p.matrix.fromArray(g.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=g.radius),p.visible=g!==null}let u=c.joints["index-finger-tip"],f=c.joints["thumb-tip"],h=u.position.distanceTo(f.position),d=.02,m=.005;c.inputState.pinching&&h>d+m?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&h<=d-m&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(a=n.getPose(t.gripSpace,i),a!==null&&(l.matrix.fromArray(a.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,a.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(a.linearVelocity)):l.hasLinearVelocity=!1,a.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(a.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:t,target:this})));o!==null&&(s=n.getPose(t.targetRaySpace,i),s===null&&a!==null&&(s=a),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(HT)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=a!==null),c!==null&&(c.visible=r!==null),this}_getHandJoint(t,n){if(t.joints[n.jointName]===void 0){let i=new Ln;i.matrixAutoUpdate=!1,i.visible=!1,t.joints[n.jointName]=i,t.add(i)}return t.joints[n.jointName]}},DS={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ya={h:0,s:0,l:0},rh={h:0,s:0,l:0};function eg(e,t,n){return n<0&&(n+=1),n>1&&(n-=1),n<1/6?e+(t-e)*6*n:n<1/2?t:n<2/3?e+(t-e)*6*(2/3-n):e}var se=class{constructor(t,n,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,n,i)}set(t,n,i){if(n===void 0&&i===void 0){let s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,n,i);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,n=Tn){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,jt.colorSpaceToWorking(this,n),this}setRGB(t,n,i,s=jt.workingColorSpace){return this.r=t,this.g=n,this.b=i,jt.colorSpaceToWorking(this,s),this}setHSL(t,n,i,s=jt.workingColorSpace){if(t=NT(t,1),n=te(n,0,1),i=te(i,0,1),n===0)this.r=this.g=this.b=i;else{let a=i<=.5?i*(1+n):i+n-i*n,r=2*i-a;this.r=eg(r,a,t+1/3),this.g=eg(r,a,t),this.b=eg(r,a,t-1/3)}return jt.colorSpaceToWorking(this,s),this}setStyle(t,n=Tn){function i(a){a!==void 0&&parseFloat(a)<1&&Nt("Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let a,r=s[1],o=s[2];switch(r){case"rgb":case"rgba":if(a=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(a[4]),this.setRGB(Math.min(255,parseInt(a[1],10))/255,Math.min(255,parseInt(a[2],10))/255,Math.min(255,parseInt(a[3],10))/255,n);if(a=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(a[4]),this.setRGB(Math.min(100,parseInt(a[1],10))/100,Math.min(100,parseInt(a[2],10))/100,Math.min(100,parseInt(a[3],10))/100,n);break;case"hsl":case"hsla":if(a=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(a[4]),this.setHSL(parseFloat(a[1])/360,parseFloat(a[2])/100,parseFloat(a[3])/100,n);break;default:Nt("Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){let a=s[1],r=a.length;if(r===3)return this.setRGB(parseInt(a.charAt(0),16)/15,parseInt(a.charAt(1),16)/15,parseInt(a.charAt(2),16)/15,n);if(r===6)return this.setHex(parseInt(a,16),n);Nt("Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,n);return this}setColorName(t,n=Tn){let i=DS[t.toLowerCase()];return i!==void 0?this.setHex(i,n):Nt("Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Is(t.r),this.g=Is(t.g),this.b=Is(t.b),this}copyLinearToSRGB(t){return this.r=Eo(t.r),this.g=Eo(t.g),this.b=Eo(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Tn){return jt.workingToColorSpace(En.copy(this),t),Math.round(te(En.r*255,0,255))*65536+Math.round(te(En.g*255,0,255))*256+Math.round(te(En.b*255,0,255))}getHexString(t=Tn){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,n=jt.workingColorSpace){jt.workingToColorSpace(En.copy(this),n);let i=En.r,s=En.g,a=En.b,r=Math.max(i,s,a),o=Math.min(i,s,a),l,c,u=(o+r)/2;if(o===r)l=0,c=0;else{let f=r-o;switch(c=u<=.5?f/(r+o):f/(2-r-o),r){case i:l=(s-a)/f+(s<a?6:0);break;case s:l=(a-i)/f+2;break;case a:l=(i-s)/f+4;break}l/=6}return t.h=l,t.s=c,t.l=u,t}getRGB(t,n=jt.workingColorSpace){return jt.workingToColorSpace(En.copy(this),n),t.r=En.r,t.g=En.g,t.b=En.b,t}getStyle(t=Tn){jt.workingToColorSpace(En.copy(this),t);let n=En.r,i=En.g,s=En.b;return t!==Tn?`color(${t} ${n.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(n*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(t,n,i){return this.getHSL(ya),this.setHSL(ya.h+t,ya.s+n,ya.l+i)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,n){return this.r=t.r+n.r,this.g=t.g+n.g,this.b=t.b+n.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,n){return this.r+=(t.r-this.r)*n,this.g+=(t.g-this.g)*n,this.b+=(t.b-this.b)*n,this}lerpColors(t,n,i){return this.r=t.r+(n.r-t.r)*i,this.g=t.g+(n.g-t.g)*i,this.b=t.b+(n.b-t.b)*i,this}lerpHSL(t,n){this.getHSL(ya),t.getHSL(rh);let i=Km(ya.h,rh.h,n),s=Km(ya.s,rh.s,n),a=Km(ya.l,rh.l,n);return this.setHSL(i,s,a),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){let n=this.r,i=this.g,s=this.b,a=t.elements;return this.r=a[0]*n+a[3]*i+a[6]*s,this.g=a[1]*n+a[4]*i+a[7]*s,this.b=a[2]*n+a[5]*i+a[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,n=0){return this.r=t[n],this.g=t[n+1],this.b=t[n+2],this}toArray(t=[],n=0){return t[n]=this.r,t[n+1]=this.g,t[n+2]=this.b,t}fromBufferAttribute(t,n){return this.r=t.getX(n),this.g=t.getY(n),this.b=t.getZ(n),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},En=new se;se.NAMES=DS;var tc=class extends Ei{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Sa,this.environmentIntensity=1,this.environmentRotation=new Sa,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,n){return super.copy(t,n),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){let n=super.toJSON(t);return this.fog!==null&&(n.object.fog=this.fog.toJSON()),n.object.backgroundBlurriness=this.backgroundBlurriness,n.object.backgroundIntensity=this.backgroundIntensity,n.object.backgroundRotation=this.backgroundRotation.toArray(),n.object.environmentIntensity=this.environmentIntensity,n.object.environmentRotation=this.environmentRotation.toArray(),n}},Ii=new H,Ns=new H,ng=new H,Ls=new H,mo=new H,go=new H,zb=new H,ig=new H,sg=new H,ag=new H,rg=new Pe,og=new Pe,lg=new Pe,ba=class e{constructor(t=new H,n=new H,i=new H){this.a=t,this.b=n,this.c=i}static getNormal(t,n,i,s){s.subVectors(i,n),Ii.subVectors(t,n),s.cross(Ii);let a=s.lengthSq();return a>0?s.multiplyScalar(1/Math.sqrt(a)):s.set(0,0,0)}static getBarycoord(t,n,i,s,a){Ii.subVectors(s,n),Ns.subVectors(i,n),ng.subVectors(t,n);let r=Ii.dot(Ii),o=Ii.dot(Ns),l=Ii.dot(ng),c=Ns.dot(Ns),u=Ns.dot(ng),f=r*c-o*o;if(f===0)return a.set(0,0,0),null;let h=1/f,d=(c*l-o*u)*h,m=(r*u-o*l)*h;return a.set(1-d-m,m,d)}static containsPoint(t,n,i,s){return this.getBarycoord(t,n,i,s,Ls)===null?!1:Ls.x>=0&&Ls.y>=0&&Ls.x+Ls.y<=1}static getInterpolation(t,n,i,s,a,r,o,l){return this.getBarycoord(t,n,i,s,Ls)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(a,Ls.x),l.addScaledVector(r,Ls.y),l.addScaledVector(o,Ls.z),l)}static getInterpolatedAttribute(t,n,i,s,a,r){return rg.setScalar(0),og.setScalar(0),lg.setScalar(0),rg.fromBufferAttribute(t,n),og.fromBufferAttribute(t,i),lg.fromBufferAttribute(t,s),r.setScalar(0),r.addScaledVector(rg,a.x),r.addScaledVector(og,a.y),r.addScaledVector(lg,a.z),r}static isFrontFacing(t,n,i,s){return Ii.subVectors(i,n),Ns.subVectors(t,n),Ii.cross(Ns).dot(s)<0}set(t,n,i){return this.a.copy(t),this.b.copy(n),this.c.copy(i),this}setFromPointsAndIndices(t,n,i,s){return this.a.copy(t[n]),this.b.copy(t[i]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,n,i,s){return this.a.fromBufferAttribute(t,n),this.b.fromBufferAttribute(t,i),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Ii.subVectors(this.c,this.b),Ns.subVectors(this.a,this.b),Ii.cross(Ns).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return e.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,n){return e.getBarycoord(t,this.a,this.b,this.c,n)}getInterpolation(t,n,i,s,a){return e.getInterpolation(t,this.a,this.b,this.c,n,i,s,a)}containsPoint(t){return e.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return e.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,n){let i=this.a,s=this.b,a=this.c,r,o;mo.subVectors(s,i),go.subVectors(a,i),ig.subVectors(t,i);let l=mo.dot(ig),c=go.dot(ig);if(l<=0&&c<=0)return n.copy(i);sg.subVectors(t,s);let u=mo.dot(sg),f=go.dot(sg);if(u>=0&&f<=u)return n.copy(s);let h=l*f-u*c;if(h<=0&&l>=0&&u<=0)return r=l/(l-u),n.copy(i).addScaledVector(mo,r);ag.subVectors(t,a);let d=mo.dot(ag),m=go.dot(ag);if(m>=0&&d<=m)return n.copy(a);let b=d*c-l*m;if(b<=0&&c>=0&&m<=0)return o=c/(c-m),n.copy(i).addScaledVector(go,o);let g=u*m-d*f;if(g<=0&&f-u>=0&&d-m>=0)return zb.subVectors(a,s),o=(f-u)/(f-u+(d-m)),n.copy(s).addScaledVector(zb,o);let p=1/(g+b+h);return r=b*p,o=h*p,n.copy(i).addScaledVector(mo,r).addScaledVector(go,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}},Ma=class{constructor(t=new H(1/0,1/0,1/0),n=new H(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=n}set(t,n){return this.min.copy(t),this.max.copy(n),this}setFromArray(t){this.makeEmpty();for(let n=0,i=t.length;n<i;n+=3)this.expandByPoint(Pi.fromArray(t,n));return this}setFromBufferAttribute(t){this.makeEmpty();for(let n=0,i=t.count;n<i;n++)this.expandByPoint(Pi.fromBufferAttribute(t,n));return this}setFromPoints(t){this.makeEmpty();for(let n=0,i=t.length;n<i;n++)this.expandByPoint(t[n]);return this}setFromCenterAndSize(t,n){let i=Pi.copy(n).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}setFromObject(t,n=!1){return this.makeEmpty(),this.expandByObject(t,n)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,n=!1){t.updateWorldMatrix(!1,!1);let i=t.geometry;if(i!==void 0){let a=i.getAttribute("position");if(n===!0&&a!==void 0&&t.isInstancedMesh!==!0)for(let r=0,o=a.count;r<o;r++)t.isMesh===!0?t.getVertexPosition(r,Pi):Pi.fromBufferAttribute(a,r),Pi.applyMatrix4(t.matrixWorld),this.expandByPoint(Pi);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),oh.copy(t.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),oh.copy(i.boundingBox)),oh.applyMatrix4(t.matrixWorld),this.union(oh)}let s=t.children;for(let a=0,r=s.length;a<r;a++)this.expandByObject(s[a],n);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,n){return n.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Pi),Pi.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let n,i;return t.normal.x>0?(n=t.normal.x*this.min.x,i=t.normal.x*this.max.x):(n=t.normal.x*this.max.x,i=t.normal.x*this.min.x),t.normal.y>0?(n+=t.normal.y*this.min.y,i+=t.normal.y*this.max.y):(n+=t.normal.y*this.max.y,i+=t.normal.y*this.min.y),t.normal.z>0?(n+=t.normal.z*this.min.z,i+=t.normal.z*this.max.z):(n+=t.normal.z*this.max.z,i+=t.normal.z*this.min.z),n<=-t.constant&&i>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Wl),lh.subVectors(this.max,Wl),yo.subVectors(t.a,Wl),xo.subVectors(t.b,Wl),vo.subVectors(t.c,Wl),xa.subVectors(xo,yo),va.subVectors(vo,xo),sr.subVectors(yo,vo);let n=[0,-xa.z,xa.y,0,-va.z,va.y,0,-sr.z,sr.y,xa.z,0,-xa.x,va.z,0,-va.x,sr.z,0,-sr.x,-xa.y,xa.x,0,-va.y,va.x,0,-sr.y,sr.x,0];return!cg(n,yo,xo,vo,lh)||(n=[1,0,0,0,1,0,0,0,1],!cg(n,yo,xo,vo,lh))?!1:(ch.crossVectors(xa,va),n=[ch.x,ch.y,ch.z],cg(n,yo,xo,vo,lh))}clampPoint(t,n){return n.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Pi).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Pi).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Us[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Us[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Us[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Us[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Us[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Us[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Us[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Us[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Us),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}},Us=[new H,new H,new H,new H,new H,new H,new H,new H],Pi=new H,oh=new Ma,yo=new H,xo=new H,vo=new H,xa=new H,va=new H,sr=new H,Wl=new H,lh=new H,ch=new H,ar=new H;function cg(e,t,n,i,s){for(let a=0,r=e.length-3;a<=r;a+=3){ar.fromArray(e,a);let o=s.x*Math.abs(ar.x)+s.y*Math.abs(ar.y)+s.z*Math.abs(ar.z),l=t.dot(ar),c=n.dot(ar),u=i.dot(ar);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>o)return!1}return!0}var $e=new H,uh=new ie,VT=0,Mi=class extends is{constructor(t,n,i=!1){if(super(),Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:VT++}),this.name="",this.array=t,this.itemSize=n,this.count=t!==void 0?t.length/n:0,this.normalized=i,this.usage=TS,this.updateRanges=[],this.gpuType=Hi,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,n){this.updateRanges.push({start:t,count:n})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,n,i){t*=this.itemSize,i*=n.itemSize;for(let s=0,a=this.itemSize;s<a;s++)this.array[t+s]=n.array[i+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let n=0,i=this.count;n<i;n++)uh.fromBufferAttribute(this,n),uh.applyMatrix3(t),this.setXY(n,uh.x,uh.y);else if(this.itemSize===3)for(let n=0,i=this.count;n<i;n++)$e.fromBufferAttribute(this,n),$e.applyMatrix3(t),this.setXYZ(n,$e.x,$e.y,$e.z);return this}applyMatrix4(t){for(let n=0,i=this.count;n<i;n++)$e.fromBufferAttribute(this,n),$e.applyMatrix4(t),this.setXYZ(n,$e.x,$e.y,$e.z);return this}applyNormalMatrix(t){for(let n=0,i=this.count;n<i;n++)$e.fromBufferAttribute(this,n),$e.applyNormalMatrix(t),this.setXYZ(n,$e.x,$e.y,$e.z);return this}transformDirection(t){for(let n=0,i=this.count;n<i;n++)$e.fromBufferAttribute(this,n),$e.transformDirection(t),this.setXYZ(n,$e.x,$e.y,$e.z);return this}set(t,n=0){return this.array.set(t,n),this}getComponent(t,n){let i=this.array[t*this.itemSize+n];return this.normalized&&(i=Vl(i,this.array)),i}setComponent(t,n,i){return this.normalized&&(i=Gn(i,this.array)),this.array[t*this.itemSize+n]=i,this}getX(t){let n=this.array[t*this.itemSize];return this.normalized&&(n=Vl(n,this.array)),n}setX(t,n){return this.normalized&&(n=Gn(n,this.array)),this.array[t*this.itemSize]=n,this}getY(t){let n=this.array[t*this.itemSize+1];return this.normalized&&(n=Vl(n,this.array)),n}setY(t,n){return this.normalized&&(n=Gn(n,this.array)),this.array[t*this.itemSize+1]=n,this}getZ(t){let n=this.array[t*this.itemSize+2];return this.normalized&&(n=Vl(n,this.array)),n}setZ(t,n){return this.normalized&&(n=Gn(n,this.array)),this.array[t*this.itemSize+2]=n,this}getW(t){let n=this.array[t*this.itemSize+3];return this.normalized&&(n=Vl(n,this.array)),n}setW(t,n){return this.normalized&&(n=Gn(n,this.array)),this.array[t*this.itemSize+3]=n,this}setXY(t,n,i){return t*=this.itemSize,this.normalized&&(n=Gn(n,this.array),i=Gn(i,this.array)),this.array[t+0]=n,this.array[t+1]=i,this}setXYZ(t,n,i,s){return t*=this.itemSize,this.normalized&&(n=Gn(n,this.array),i=Gn(i,this.array),s=Gn(s,this.array)),this.array[t+0]=n,this.array[t+1]=i,this.array[t+2]=s,this}setXYZW(t,n,i,s,a){return t*=this.itemSize,this.normalized&&(n=Gn(n,this.array),i=Gn(i,this.array),s=Gn(s,this.array),a=Gn(a,this.array)),this.array[t+0]=n,this.array[t+1]=i,this.array[t+2]=s,this.array[t+3]=a,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return t.name=this.name,t.usage=this.usage,t.gpuType=this.gpuType,t}dispose(){this.dispatchEvent({type:"dispose"})}};var ec=class extends Mi{constructor(t,n,i){super(new Uint16Array(t),n,i)}};var nc=class extends Mi{constructor(t,n,i){super(new Uint32Array(t),n,i)}};var sn=class extends Mi{constructor(t,n,i){super(new Float32Array(t),n,i)}},GT=new Ma,Xl=new H,ug=new H,Ro=class{constructor(t=new H,n=-1){this.isSphere=!0,this.center=t,this.radius=n}set(t,n){return this.center.copy(t),this.radius=n,this}setFromPoints(t,n){let i=this.center;n!==void 0?i.copy(n):GT.setFromPoints(t).getCenter(i);let s=0;for(let a=0,r=t.length;a<r;a++)s=Math.max(s,i.distanceToSquared(t[a]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){let n=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=n*n}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,n){let i=this.center.distanceToSquared(t);return n.copy(t),i>this.radius*this.radius&&(n.sub(this.center).normalize(),n.multiplyScalar(this.radius).add(this.center)),n}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Xl.subVectors(t,this.center);let n=Xl.lengthSq();if(n>this.radius*this.radius){let i=Math.sqrt(n),s=(i-this.radius)*.5;this.center.addScaledVector(Xl,s/i),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(ug.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Xl.copy(t.center).add(ug)),this.expandByPoint(Xl.copy(t.center).sub(ug))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}},WT=0,Si=new We,hg=new Ei,_o=new H,ai=new Ma,ql=new Ma,dn=new H,qn=class e extends is{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:WT++}),this.uuid=xc(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(RT(t)?nc:ec)(t,1):this.index=t,this}setIndirect(t,n=0){return this.indirect=t,this.indirectOffset=n,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,n){return this.attributes[t]=n,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,n,i=0){this.groups.push({start:t,count:n,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(t,n){this.drawRange.start=t,this.drawRange.count=n}applyMatrix4(t){let n=this.attributes.position;n!==void 0&&(n.applyMatrix4(t),n.needsUpdate=!0);let i=this.attributes.normal;if(i!==void 0){let a=new It().getNormalMatrix(t);i.applyNormalMatrix(a),i.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(t){return Si.makeRotationFromQuaternion(t),this.applyMatrix4(Si),this}rotateX(t){return Si.makeRotationX(t),this.applyMatrix4(Si),this}rotateY(t){return Si.makeRotationY(t),this.applyMatrix4(Si),this}rotateZ(t){return Si.makeRotationZ(t),this.applyMatrix4(Si),this}translate(t,n,i){return Si.makeTranslation(t,n,i),this.applyMatrix4(Si),this}scale(t,n,i){return Si.makeScale(t,n,i),this.applyMatrix4(Si),this}lookAt(t){return hg.lookAt(t),hg.updateMatrix(),this.applyMatrix4(hg.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(_o).negate(),this.translate(_o.x,_o.y,_o.z),this}setFromPoints(t){let n=this.getAttribute("position");if(n===void 0){let i=[];for(let s=0,a=t.length;s<a;s++){let r=t[s];i.push(r.x,r.y,r.z||0)}this.setAttribute("position",new sn(i,3))}else{let i=Math.min(t.length,n.count);for(let s=0;s<i;s++){let a=t[s];n.setXYZ(s,a.x,a.y,a.z||0)}t.length>n.count&&Nt("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),n.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Ma);let t=this.attributes.position,n=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){Ot("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new H(-1/0,-1/0,-1/0),new H(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),n)for(let i=0,s=n.length;i<s;i++){let a=n[i];ai.setFromBufferAttribute(a),this.morphTargetsRelative?(dn.addVectors(this.boundingBox.min,ai.min),this.boundingBox.expandByPoint(dn),dn.addVectors(this.boundingBox.max,ai.max),this.boundingBox.expandByPoint(dn)):(this.boundingBox.expandByPoint(ai.min),this.boundingBox.expandByPoint(ai.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Ot('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ro);let t=this.attributes.position,n=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){Ot("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new H,1/0);return}if(t){let i=this.boundingSphere.center;if(ai.setFromBufferAttribute(t),n)for(let a=0,r=n.length;a<r;a++){let o=n[a];ql.setFromBufferAttribute(o),this.morphTargetsRelative?(dn.addVectors(ai.min,ql.min),ai.expandByPoint(dn),dn.addVectors(ai.max,ql.max),ai.expandByPoint(dn)):(ai.expandByPoint(ql.min),ai.expandByPoint(ql.max))}ai.getCenter(i);let s=0;for(let a=0,r=t.count;a<r;a++)dn.fromBufferAttribute(t,a),s=Math.max(s,i.distanceToSquared(dn));if(n)for(let a=0,r=n.length;a<r;a++){let o=n[a],l=this.morphTargetsRelative;for(let c=0,u=o.count;c<u;c++)dn.fromBufferAttribute(o,c),l&&(_o.fromBufferAttribute(t,c),dn.add(_o)),s=Math.max(s,i.distanceToSquared(dn))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&Ot('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let t=this.index,n=this.attributes;if(t===null||n.position===void 0||n.normal===void 0||n.uv===void 0){Ot("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let i=n.position,s=n.normal,a=n.uv,r=this.getAttribute("tangent");(r===void 0||r.count!==i.count)&&(r=new Mi(new Float32Array(4*i.count),4),this.setAttribute("tangent",r));let o=[],l=[];for(let x=0;x<i.count;x++)o[x]=new H,l[x]=new H;let c=new H,u=new H,f=new H,h=new ie,d=new ie,m=new ie,b=new H,g=new H;function p(x,A,R){c.fromBufferAttribute(i,x),u.fromBufferAttribute(i,A),f.fromBufferAttribute(i,R),h.fromBufferAttribute(a,x),d.fromBufferAttribute(a,A),m.fromBufferAttribute(a,R),u.sub(c),f.sub(c),d.sub(h),m.sub(h);let O=1/(d.x*m.y-m.x*d.y);isFinite(O)&&(b.copy(u).multiplyScalar(m.y).addScaledVector(f,-d.y).multiplyScalar(O),g.copy(f).multiplyScalar(d.x).addScaledVector(u,-m.x).multiplyScalar(O),o[x].add(b),o[A].add(b),o[R].add(b),l[x].add(g),l[A].add(g),l[R].add(g))}let y=this.groups;y.length===0&&(y=[{start:0,count:t.count}]);for(let x=0,A=y.length;x<A;++x){let R=y[x],O=R.start,F=R.count;for(let V=O,U=O+F;V<U;V+=3)p(t.getX(V+0),t.getX(V+1),t.getX(V+2))}let S=new H,v=new H,E=new H,T=new H;function C(x){E.fromBufferAttribute(s,x),T.copy(E);let A=o[x];S.copy(A),S.sub(E.multiplyScalar(E.dot(A))).normalize(),v.crossVectors(T,A);let O=v.dot(l[x])<0?-1:1;r.setXYZW(x,S.x,S.y,S.z,O)}for(let x=0,A=y.length;x<A;++x){let R=y[x],O=R.start,F=R.count;for(let V=O,U=O+F;V<U;V+=3)C(t.getX(V+0)),C(t.getX(V+1)),C(t.getX(V+2))}this._transformed=!0}computeVertexNormals(){let t=this.index,n=this.getAttribute("position");if(n!==void 0){let i=this.getAttribute("normal");if(i===void 0||i.count!==n.count)i=new Mi(new Float32Array(n.count*3),3),this.setAttribute("normal",i);else for(let h=0,d=i.count;h<d;h++)i.setXYZ(h,0,0,0);let s=new H,a=new H,r=new H,o=new H,l=new H,c=new H,u=new H,f=new H;if(t)for(let h=0,d=t.count;h<d;h+=3){let m=t.getX(h+0),b=t.getX(h+1),g=t.getX(h+2);s.fromBufferAttribute(n,m),a.fromBufferAttribute(n,b),r.fromBufferAttribute(n,g),u.subVectors(r,a),f.subVectors(s,a),u.cross(f),o.fromBufferAttribute(i,m),l.fromBufferAttribute(i,b),c.fromBufferAttribute(i,g),o.add(u),l.add(u),c.add(u),i.setXYZ(m,o.x,o.y,o.z),i.setXYZ(b,l.x,l.y,l.z),i.setXYZ(g,c.x,c.y,c.z)}else for(let h=0,d=n.count;h<d;h+=3)s.fromBufferAttribute(n,h+0),a.fromBufferAttribute(n,h+1),r.fromBufferAttribute(n,h+2),u.subVectors(r,a),f.subVectors(s,a),u.cross(f),i.setXYZ(h+0,u.x,u.y,u.z),i.setXYZ(h+1,u.x,u.y,u.z),i.setXYZ(h+2,u.x,u.y,u.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){let t=this.attributes.normal;for(let n=0,i=t.count;n<i;n++)dn.fromBufferAttribute(t,n),dn.normalize(),t.setXYZ(n,dn.x,dn.y,dn.z)}toNonIndexed(){function t(o,l){let c=o.array,u=o.itemSize,f=o.normalized,h=new c.constructor(l.length*u),d=0,m=0;for(let b=0,g=l.length;b<g;b++){o.isInterleavedBufferAttribute?d=l[b]*o.data.stride+o.offset:d=l[b]*u;for(let p=0;p<u;p++)h[m++]=c[d++]}return new Mi(h,u,f)}if(this.index===null)return Nt("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let n=new e,i=this.index.array,s=this.attributes;for(let o in s){let l=s[o],c=t(l,i);n.setAttribute(o,c)}let a=this.morphAttributes;for(let o in a){let l=[],c=a[o];for(let u=0,f=c.length;u<f;u++){let h=c[u],d=t(h,i);l.push(d)}n.morphAttributes[o]=l}n.morphTargetsRelative=this.morphTargetsRelative;let r=this.groups;for(let o=0,l=r.length;o<l;o++){let c=r[o];n.addGroup(c.start,c.count,c.materialIndex)}return n}toJSON(){let t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,t.name=this.name,Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};let n=this.index;n!==null&&(t.data.index={type:n.array.constructor.name,array:Array.prototype.slice.call(n.array)});let i=this.attributes;for(let l in i){let c=i[l];t.data.attributes[l]=c.toJSON(t.data)}let s={},a=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],u=[];for(let f=0,h=c.length;f<h;f++){let d=c[f];u.push(d.toJSON(t.data))}u.length>0&&(s[l]=u,a=!0)}a&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);let r=this.groups;r.length>0&&(t.data.groups=JSON.parse(JSON.stringify(r)));let o=this.boundingSphere;return o!==null&&(t.data.boundingSphere=o.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let n={};this.name=t.name;let i=t.index;i!==null&&this.setIndex(i.clone());let s=t.attributes;for(let c in s){let u=s[c];this.setAttribute(c,u.clone(n))}let a=t.morphAttributes;for(let c in a){let u=[],f=a[c];for(let h=0,d=f.length;h<d;h++)u.push(f[h].clone(n));this.morphAttributes[c]=u}this.morphTargetsRelative=t.morphTargetsRelative;let r=t.groups;for(let c=0,u=r.length;c<u;c++){let f=r[c];this.addGroup(f.start,f.count,f.materialIndex)}let o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());let l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this._transformed=t._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}};var fg=new H,XT=new H,qT=new It,Bi=class{constructor(t=new H(1,0,0),n=0){this.isPlane=!0,this.normal=t,this.constant=n}set(t,n){return this.normal.copy(t),this.constant=n,this}setComponents(t,n,i,s){return this.normal.set(t,n,i),this.constant=s,this}setFromNormalAndCoplanarPoint(t,n){return this.normal.copy(t),this.constant=-n.dot(this.normal),this}setFromCoplanarPoints(t,n,i){let s=fg.subVectors(i,n).cross(XT.subVectors(t,n)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){let t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,n){return n.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,n,i=!0){let s=t.delta(fg),a=this.normal.dot(s);if(a===0)return this.distanceToPoint(t.start)===0?n.copy(t.start):null;let r=-(t.start.dot(this.normal)+this.constant)/a;return i===!0&&(r<0||r>1)?null:n.copy(t.start).addScaledVector(s,r)}intersectsLine(t){let n=this.distanceToPoint(t.start),i=this.distanceToPoint(t.end);return n<0&&i>0||i<0&&n>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,n){let i=n||qT.getNormalMatrix(t),s=this.coplanarPoint(fg).applyMatrix4(t),a=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(a),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(t){return this.normal.fromArray(t.normal),this.constant=t.constant,this}},YT=0,cr=class extends is{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:YT++}),this.uuid=xc(),this.name="",this.type="Material",this.blending=Lo,this.side=Ra,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Ag,this.blendDst=wg,this.blendEquation=hr,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new se(0,0,0),this.blendAlpha=0,this.depthFunc=To,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=xS,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Eh,this.stencilZFail=Eh,this.stencilZPass=Eh,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(let n in t){let i=t[n];if(i===void 0){Nt(`Material: parameter '${n}' has value of undefined.`);continue}let s=this[n];if(s===void 0){Nt(`Material: '${n}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector2&&i&&i.isVector2||s&&s.isEuler&&i&&i.isEuler||s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[n]=i}}toJSON(t){let n=t===void 0||typeof t=="string";n&&(t={textures:{},images:{}});let i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,i.blending=this.blending,i.side=this.side,i.shadowSide=this.shadowSide,i.vertexColors=this.vertexColors,i.opacity=this.opacity,i.transparent=this.transparent,i.blendSrc=this.blendSrc,i.blendDst=this.blendDst,i.blendEquation=this.blendEquation,i.blendSrcAlpha=this.blendSrcAlpha,i.blendDstAlpha=this.blendDstAlpha,i.blendEquationAlpha=this.blendEquationAlpha,i.blendColor=this.blendColor.getHex(),i.blendAlpha=this.blendAlpha,i.depthFunc=this.depthFunc,i.depthTest=this.depthTest,i.depthWrite=this.depthWrite,i.colorWrite=this.colorWrite,i.clipIntersection=this.clipIntersection,i.clipShadows=this.clipShadows,i.stencilWriteMask=this.stencilWriteMask,i.stencilFunc=this.stencilFunc,i.stencilRef=this.stencilRef,i.stencilFuncMask=this.stencilFuncMask,i.stencilFail=this.stencilFail,i.stencilZFail=this.stencilZFail,i.stencilZPass=this.stencilZPass,i.stencilWrite=this.stencilWrite,i.polygonOffset=this.polygonOffset,i.polygonOffsetFactor=this.polygonOffsetFactor,i.polygonOffsetUnits=this.polygonOffsetUnits,i.dithering=this.dithering,i.alphaTest=this.alphaTest,i.alphaHash=this.alphaHash,i.alphaToCoverage=this.alphaToCoverage,i.premultipliedAlpha=this.premultipliedAlpha,i.forceSinglePass=this.forceSinglePass,i.allowOverride=this.allowOverride,i.visible=this.visible,i.toneMapped=this.toneMapped,i.name=this.name,this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(i.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(t).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(t).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(t).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(t).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(t).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(i.clippingPlanes=this.clippingPlanes.map(a=>a.toJSON())),this.rotation!==void 0&&(i.rotation=this.rotation),this.depthPacking!==void 0&&(i.depthPacking=this.depthPacking),this.linewidth!==void 0&&(i.linewidth=this.linewidth),this.linecap!==void 0&&(i.linecap=this.linecap),this.linejoin!==void 0&&(i.linejoin=this.linejoin),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.wireframe!==void 0&&(i.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(i.flatShading=this.flatShading),this.fog!==void 0&&(i.fog=this.fog),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(a){let r=[];for(let o in a){let l=a[o];delete l.metadata,r.push(l)}return r}if(n){let a=s(t.textures),r=s(t.images);a.length>0&&(i.textures=a),r.length>0&&(i.images=r)}return i}fromJSON(t,n){if(t.uuid!==void 0&&(this.uuid=t.uuid),t.name!==void 0&&(this.name=t.name),t.color!==void 0&&this.color!==void 0&&this.color.setHex(t.color),t.roughness!==void 0&&(this.roughness=t.roughness),t.metalness!==void 0&&(this.metalness=t.metalness),t.sheen!==void 0&&(this.sheen=t.sheen),t.sheenColor!==void 0&&(this.sheenColor=new se().setHex(t.sheenColor)),t.sheenRoughness!==void 0&&(this.sheenRoughness=t.sheenRoughness),t.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(t.emissive),t.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(t.specular),t.specularIntensity!==void 0&&(this.specularIntensity=t.specularIntensity),t.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(t.specularColor),t.shininess!==void 0&&(this.shininess=t.shininess),t.clearcoat!==void 0&&(this.clearcoat=t.clearcoat),t.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=t.clearcoatRoughness),t.dispersion!==void 0&&(this.dispersion=t.dispersion),t.retroreflectivity!==void 0&&(this.retroreflectivity=t.retroreflectivity),t.iridescence!==void 0&&(this.iridescence=t.iridescence),t.iridescenceIOR!==void 0&&(this.iridescenceIOR=t.iridescenceIOR),t.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=t.iridescenceThicknessRange),t.transmission!==void 0&&(this.transmission=t.transmission),t.thickness!==void 0&&(this.thickness=t.thickness),t.attenuationDistance!==void 0&&(this.attenuationDistance=t.attenuationDistance),t.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(t.attenuationColor),t.anisotropy!==void 0&&(this.anisotropy=t.anisotropy),t.anisotropyRotation!==void 0&&(this.anisotropyRotation=t.anisotropyRotation),t.fog!==void 0&&(this.fog=t.fog),t.flatShading!==void 0&&(this.flatShading=t.flatShading),t.blending!==void 0&&(this.blending=t.blending),t.combine!==void 0&&(this.combine=t.combine),t.side!==void 0&&(this.side=t.side),t.shadowSide!==void 0&&(this.shadowSide=t.shadowSide),t.opacity!==void 0&&(this.opacity=t.opacity),t.transparent!==void 0&&(this.transparent=t.transparent),t.alphaTest!==void 0&&(this.alphaTest=t.alphaTest),t.alphaHash!==void 0&&(this.alphaHash=t.alphaHash),t.depthFunc!==void 0&&(this.depthFunc=t.depthFunc),t.depthTest!==void 0&&(this.depthTest=t.depthTest),t.depthWrite!==void 0&&(this.depthWrite=t.depthWrite),t.colorWrite!==void 0&&(this.colorWrite=t.colorWrite),t.clippingPlanes!==void 0&&(this.clippingPlanes=t.clippingPlanes.map(i=>new Bi().fromJSON(i))),t.clipIntersection!==void 0&&(this.clipIntersection=t.clipIntersection),t.clipShadows!==void 0&&(this.clipShadows=t.clipShadows),t.depthPacking!==void 0&&(this.depthPacking=t.depthPacking),t.blendSrc!==void 0&&(this.blendSrc=t.blendSrc),t.blendDst!==void 0&&(this.blendDst=t.blendDst),t.blendEquation!==void 0&&(this.blendEquation=t.blendEquation),t.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=t.blendSrcAlpha),t.blendDstAlpha!==void 0&&(this.blendDstAlpha=t.blendDstAlpha),t.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=t.blendEquationAlpha),t.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(t.blendColor),t.blendAlpha!==void 0&&(this.blendAlpha=t.blendAlpha),t.stencilWriteMask!==void 0&&(this.stencilWriteMask=t.stencilWriteMask),t.stencilFunc!==void 0&&(this.stencilFunc=t.stencilFunc),t.stencilRef!==void 0&&(this.stencilRef=t.stencilRef),t.stencilFuncMask!==void 0&&(this.stencilFuncMask=t.stencilFuncMask),t.stencilFail!==void 0&&(this.stencilFail=t.stencilFail),t.stencilZFail!==void 0&&(this.stencilZFail=t.stencilZFail),t.stencilZPass!==void 0&&(this.stencilZPass=t.stencilZPass),t.stencilWrite!==void 0&&(this.stencilWrite=t.stencilWrite),t.wireframe!==void 0&&(this.wireframe=t.wireframe),t.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=t.wireframeLinewidth),t.wireframeLinecap!==void 0&&(this.wireframeLinecap=t.wireframeLinecap),t.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=t.wireframeLinejoin),t.rotation!==void 0&&(this.rotation=t.rotation),t.linewidth!==void 0&&(this.linewidth=t.linewidth),t.linecap!==void 0&&(this.linecap=t.linecap),t.linejoin!==void 0&&(this.linejoin=t.linejoin),t.dashSize!==void 0&&(this.dashSize=t.dashSize),t.gapSize!==void 0&&(this.gapSize=t.gapSize),t.scale!==void 0&&(this.scale=t.scale),t.polygonOffset!==void 0&&(this.polygonOffset=t.polygonOffset),t.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=t.polygonOffsetFactor),t.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=t.polygonOffsetUnits),t.dithering!==void 0&&(this.dithering=t.dithering),t.alphaToCoverage!==void 0&&(this.alphaToCoverage=t.alphaToCoverage),t.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=t.premultipliedAlpha),t.forceSinglePass!==void 0&&(this.forceSinglePass=t.forceSinglePass),t.allowOverride!==void 0&&(this.allowOverride=t.allowOverride),t.visible!==void 0&&(this.visible=t.visible),t.toneMapped!==void 0&&(this.toneMapped=t.toneMapped),t.userData!==void 0&&(this.userData=t.userData),t.vertexColors!==void 0&&(typeof t.vertexColors=="number"?this.vertexColors=t.vertexColors>0:this.vertexColors=t.vertexColors),t.size!==void 0&&(this.size=t.size),t.sizeAttenuation!==void 0&&(this.sizeAttenuation=t.sizeAttenuation),t.map!==void 0&&(this.map=n[t.map]||null),t.matcap!==void 0&&(this.matcap=n[t.matcap]||null),t.alphaMap!==void 0&&(this.alphaMap=n[t.alphaMap]||null),t.bumpMap!==void 0&&(this.bumpMap=n[t.bumpMap]||null),t.bumpScale!==void 0&&(this.bumpScale=t.bumpScale),t.normalMap!==void 0&&(this.normalMap=n[t.normalMap]||null),t.normalMapType!==void 0&&(this.normalMapType=t.normalMapType),t.normalScale!==void 0){let i=t.normalScale;Array.isArray(i)===!1&&(i=[i,i]),this.normalScale=new ie().fromArray(i)}return t.displacementMap!==void 0&&(this.displacementMap=n[t.displacementMap]||null),t.displacementScale!==void 0&&(this.displacementScale=t.displacementScale),t.displacementBias!==void 0&&(this.displacementBias=t.displacementBias),t.roughnessMap!==void 0&&(this.roughnessMap=n[t.roughnessMap]||null),t.metalnessMap!==void 0&&(this.metalnessMap=n[t.metalnessMap]||null),t.emissiveMap!==void 0&&(this.emissiveMap=n[t.emissiveMap]||null),t.emissiveIntensity!==void 0&&(this.emissiveIntensity=t.emissiveIntensity),t.specularMap!==void 0&&(this.specularMap=n[t.specularMap]||null),t.specularIntensityMap!==void 0&&(this.specularIntensityMap=n[t.specularIntensityMap]||null),t.specularColorMap!==void 0&&(this.specularColorMap=n[t.specularColorMap]||null),t.envMap!==void 0&&(this.envMap=n[t.envMap]||null),t.envMapRotation!==void 0&&this.envMapRotation.fromArray(t.envMapRotation),t.envMapIntensity!==void 0&&(this.envMapIntensity=t.envMapIntensity),t.reflectivity!==void 0&&(this.reflectivity=t.reflectivity),t.refractionRatio!==void 0&&(this.refractionRatio=t.refractionRatio),t.lightMap!==void 0&&(this.lightMap=n[t.lightMap]||null),t.lightMapIntensity!==void 0&&(this.lightMapIntensity=t.lightMapIntensity),t.aoMap!==void 0&&(this.aoMap=n[t.aoMap]||null),t.aoMapIntensity!==void 0&&(this.aoMapIntensity=t.aoMapIntensity),t.gradientMap!==void 0&&(this.gradientMap=n[t.gradientMap]||null),t.clearcoatMap!==void 0&&(this.clearcoatMap=n[t.clearcoatMap]||null),t.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=n[t.clearcoatRoughnessMap]||null),t.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=n[t.clearcoatNormalMap]||null),t.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new ie().fromArray(t.clearcoatNormalScale)),t.iridescenceMap!==void 0&&(this.iridescenceMap=n[t.iridescenceMap]||null),t.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=n[t.iridescenceThicknessMap]||null),t.transmissionMap!==void 0&&(this.transmissionMap=n[t.transmissionMap]||null),t.thicknessMap!==void 0&&(this.thicknessMap=n[t.thicknessMap]||null),t.anisotropyMap!==void 0&&(this.anisotropyMap=n[t.anisotropyMap]||null),t.sheenColorMap!==void 0&&(this.sheenColorMap=n[t.sheenColorMap]||null),t.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=n[t.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;let n=t.clippingPlanes,i=null;if(n!==null){let s=n.length;i=new Array(s);for(let a=0;a!==s;++a)i[a]=n[a].clone()}return this.clippingPlanes=i,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.allowOverride=t.allowOverride,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}};var Os=new H,dg=new H,hh=new H,fh=new H,Fh=class{constructor(t=new H,n=new H(0,0,-1)){this.origin=t,this.direction=n}set(t,n){return this.origin.copy(t),this.direction.copy(n),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,n){return n.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Os)),this}closestPointToPoint(t,n){n.subVectors(t,this.origin);let i=n.dot(this.direction);return i<0?n.copy(this.origin):n.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){let n=Os.subVectors(t,this.origin).dot(this.direction);return n<0?this.origin.distanceToSquared(t):(Os.copy(this.origin).addScaledVector(this.direction,n),Os.distanceToSquared(t))}distanceSqToSegment(t,n,i,s){dg.copy(t).add(n).multiplyScalar(.5),hh.copy(n).sub(t).normalize(),fh.copy(this.origin).sub(dg);let a=t.distanceTo(n)*.5,r=-this.direction.dot(hh),o=fh.dot(this.direction),l=-fh.dot(hh),c=fh.lengthSq(),u=Math.abs(1-r*r),f,h,d,m;if(u>0)if(f=r*l-o,h=r*o-l,m=a*u,f>=0)if(h>=-m)if(h<=m){let b=1/u;f*=b,h*=b,d=f*(f+r*h+2*o)+h*(r*f+h+2*l)+c}else h=a,f=Math.max(0,-(r*h+o)),d=-f*f+h*(h+2*l)+c;else h=-a,f=Math.max(0,-(r*h+o)),d=-f*f+h*(h+2*l)+c;else h<=-m?(f=Math.max(0,-(-r*a+o)),h=f>0?-a:Math.min(Math.max(-a,-l),a),d=-f*f+h*(h+2*l)+c):h<=m?(f=0,h=Math.min(Math.max(-a,-l),a),d=h*(h+2*l)+c):(f=Math.max(0,-(r*a+o)),h=f>0?a:Math.min(Math.max(-a,-l),a),d=-f*f+h*(h+2*l)+c);else h=r>0?-a:a,f=Math.max(0,-(r*h+o)),d=-f*f+h*(h+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,f),s&&s.copy(dg).addScaledVector(hh,h),d}intersectSphere(t,n){if(t.radius<0)return null;Os.subVectors(t.center,this.origin);let i=Os.dot(this.direction),s=Os.dot(Os)-i*i,a=t.radius*t.radius;if(s>a)return null;let r=Math.sqrt(a-s),o=i-r,l=i+r;return l<0?null:o<0?this.at(l,n):this.at(o,n)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){let n=t.normal.dot(this.direction);if(n===0)return t.distanceToPoint(this.origin)===0?0:null;let i=-(this.origin.dot(t.normal)+t.constant)/n;return i>=0?i:null}intersectPlane(t,n){let i=this.distanceToPlane(t);return i===null?null:this.at(i,n)}intersectsPlane(t){let n=t.distanceToPoint(this.origin);return n===0||t.normal.dot(this.direction)*n<0}intersectBox(t,n){let i,s,a,r,o,l,c=1/this.direction.x,u=1/this.direction.y,f=1/this.direction.z,h=this.origin;return c>=0?(i=(t.min.x-h.x)*c,s=(t.max.x-h.x)*c):(i=(t.max.x-h.x)*c,s=(t.min.x-h.x)*c),u>=0?(a=(t.min.y-h.y)*u,r=(t.max.y-h.y)*u):(a=(t.max.y-h.y)*u,r=(t.min.y-h.y)*u),i>r||a>s||((a>i||isNaN(i))&&(i=a),(r<s||isNaN(s))&&(s=r),f>=0?(o=(t.min.z-h.z)*f,l=(t.max.z-h.z)*f):(o=(t.max.z-h.z)*f,l=(t.min.z-h.z)*f),i>l||o>s)||((o>i||i!==i)&&(i=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(i>=0?i:s,n)}intersectsBox(t){return this.intersectBox(t,Os)!==null}intersectTriangle(t,n,i,s,a){let r=this.origin,o=this.direction,l=o.x,c=o.y,u=o.z,f=t.x-r.x,h=t.y-r.y,d=t.z-r.z,m=n.x-r.x,b=n.y-r.y,g=n.z-r.z,p=i.x-r.x,y=i.y-r.y,S=i.z-r.z,v=Math.abs(l),E=Math.abs(c),T=Math.abs(u),C,x,A,R,O,F,V,U,G,J,q,it;if(v>=E&&v>=T?(A=l,F=f,G=m,it=p,l>=0?(C=c,x=u,R=h,O=d,V=b,U=g,J=y,q=S):(C=u,x=c,R=d,O=h,V=g,U=b,J=S,q=y)):E>=T?(A=c,F=h,G=b,it=y,c>=0?(C=u,x=l,R=d,O=f,V=g,U=m,J=S,q=p):(C=l,x=u,R=f,O=d,V=m,U=g,J=p,q=S)):(A=u,F=d,G=g,it=S,u>=0?(C=l,x=c,R=f,O=h,V=m,U=b,J=p,q=y):(C=c,x=l,R=h,O=f,V=b,U=m,J=y,q=p)),A===0)return null;let P=C/A,K=x/A,$=1/A,ht=R-P*F,_t=O-K*F,Gt=V-P*G,Vt=U-K*G,re=J-P*it,Y=q-K*it,et=re*Vt-Y*Gt,bt=ht*Y-_t*re,Pt=Gt*_t-Vt*ht;if(s){if(et<0||bt<0||Pt<0)return null}else if((et<0||bt<0||Pt<0)&&(et>0||bt>0||Pt>0))return null;let xt=et+bt+Pt;if(xt===0)return null;let Wt=$*(et*F+bt*G+Pt*it);return(xt>0?Wt<0:Wt>0)?null:this.at(Wt/xt,a)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},Ti=class extends cr{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new se(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Sa,this.combine=Cg,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}},Fb=new We,rr=new Fh,dh=new Ro,kb=new H,ph=new H,mh=new H,gh=new H,pg=new H,yh=new H,Hb=new H,xh=new H,an=class extends Ei{constructor(t=new qn,n=new Ti){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=n,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,n){return super.copy(t,n),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){let n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){let s=n[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,r=s.length;a<r;a++){let o=s[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=a}}}}getVertexPosition(t,n){let i=this.geometry,s=i.attributes.position,a=i.morphAttributes.position,r=i.morphTargetsRelative;n.fromBufferAttribute(s,t);let o=this.morphTargetInfluences;if(a&&o){yh.set(0,0,0);for(let l=0,c=a.length;l<c;l++){let u=o[l],f=a[l];u!==0&&(pg.fromBufferAttribute(f,t),r?yh.addScaledVector(pg,u):yh.addScaledVector(pg.sub(n),u))}n.add(yh)}return n}intersectsFrustum(t){return t.intersectsObject(this)}raycast(t,n){let i=this.geometry,s=this.material,a=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),dh.copy(i.boundingSphere),dh.applyMatrix4(a),rr.copy(t.ray).recast(t.near),!(dh.containsPoint(rr.origin)===!1&&(rr.intersectSphere(dh,kb)===null||rr.origin.distanceToSquared(kb)>(t.far-t.near)**2))&&(Fb.copy(a).invert(),rr.copy(t.ray).applyMatrix4(Fb),!(i.boundingBox!==null&&rr.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(t,n,rr)))}_computeIntersections(t,n,i){let s,a=this.geometry,r=this.material,o=a.index,l=a.attributes.position,c=a.attributes.uv,u=a.attributes.uv1,f=a.attributes.normal,h=a.groups,d=a.drawRange;if(o!==null)if(Array.isArray(r))for(let m=0,b=h.length;m<b;m++){let g=h[m],p=r[g.materialIndex],y=Math.max(g.start,d.start),S=Math.min(o.count,Math.min(g.start+g.count,d.start+d.count));for(let v=y,E=S;v<E;v+=3){let T=o.getX(v),C=o.getX(v+1),x=o.getX(v+2);s=vh(this,p,t,i,c,u,f,T,C,x),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=g.materialIndex,n.push(s))}}else{let m=Math.max(0,d.start),b=Math.min(o.count,d.start+d.count);for(let g=m,p=b;g<p;g+=3){let y=o.getX(g),S=o.getX(g+1),v=o.getX(g+2);s=vh(this,r,t,i,c,u,f,y,S,v),s&&(s.faceIndex=Math.floor(g/3),n.push(s))}}else if(l!==void 0)if(Array.isArray(r))for(let m=0,b=h.length;m<b;m++){let g=h[m],p=r[g.materialIndex],y=Math.max(g.start,d.start),S=Math.min(l.count,Math.min(g.start+g.count,d.start+d.count));for(let v=y,E=S;v<E;v+=3){let T=v,C=v+1,x=v+2;s=vh(this,p,t,i,c,u,f,T,C,x),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=g.materialIndex,n.push(s))}}else{let m=Math.max(0,d.start),b=Math.min(l.count,d.start+d.count);for(let g=m,p=b;g<p;g+=3){let y=g,S=g+1,v=g+2;s=vh(this,r,t,i,c,u,f,y,S,v),s&&(s.faceIndex=Math.floor(g/3),n.push(s))}}}};function ZT(e,t,n,i,s,a,r,o){let l;if(t.side===Un?l=i.intersectTriangle(r,a,s,!0,o):l=i.intersectTriangle(s,a,r,t.side===Ra,o),l===null)return null;xh.copy(o),xh.applyMatrix4(e.matrixWorld);let c=n.ray.origin.distanceTo(xh);return c<n.near||c>n.far?null:{distance:c,point:xh.clone(),object:e}}function vh(e,t,n,i,s,a,r,o,l,c){e.getVertexPosition(o,ph),e.getVertexPosition(l,mh),e.getVertexPosition(c,gh);let u=ZT(e,t,n,i,ph,mh,gh,Hb);if(u){let f=new H;ba.getBarycoord(Hb,ph,mh,gh,f),s&&(u.uv=ba.getInterpolatedAttribute(s,o,l,c,f,new ie)),a&&(u.uv1=ba.getInterpolatedAttribute(a,o,l,c,f,new ie)),r&&(u.normal=ba.getInterpolatedAttribute(r,o,l,c,f,new H),u.normal.dot(i.direction)>0&&u.normal.multiplyScalar(-1));let h={a:o,b:l,c,normal:new H,materialIndex:0};ba.getNormal(ph,mh,gh,h.normal),u.face=h,u.barycoord=f}return u}var kh=class extends An{constructor(t=null,n=1,i=1,s,a,r,o,l,c=Xe,u=Xe,f,h){super(null,r,o,l,c,u,s,a,f,h),this.isDataTexture=!0,this.image={data:t,width:n,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var or=new Ro,KT=new ie(.5,.5),_h=new H,ic=class{constructor(t=new Bi,n=new Bi,i=new Bi,s=new Bi,a=new Bi,r=new Bi){this.planes=[t,n,i,s,a,r]}set(t,n,i,s,a,r){let o=this.planes;return o[0].copy(t),o[1].copy(n),o[2].copy(i),o[3].copy(s),o[4].copy(a),o[5].copy(r),this}copy(t){let n=this.planes;for(let i=0;i<6;i++)n[i].copy(t.planes[i]);return this}setFromProjectionMatrix(t,n=zi,i=!1){let s=this.planes,a=t.elements,r=a[0],o=a[1],l=a[2],c=a[3],u=a[4],f=a[5],h=a[6],d=a[7],m=a[8],b=a[9],g=a[10],p=a[11],y=a[12],S=a[13],v=a[14],E=a[15];if(s[0].setComponents(c-r,d-u,p-m,E-y).normalize(),s[1].setComponents(c+r,d+u,p+m,E+y).normalize(),s[2].setComponents(c+o,d+f,p+b,E+S).normalize(),s[3].setComponents(c-o,d-f,p-b,E-S).normalize(),i)s[4].setComponents(l,h,g,v).normalize(),s[5].setComponents(c-l,d-h,p-g,E-v).normalize();else if(s[4].setComponents(c-l,d-h,p-g,E-v).normalize(),n===zi)s[5].setComponents(c+l,d+h,p+g,E+v).normalize();else if(n===Jl)s[5].setComponents(l,h,g,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+n);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),or.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{let n=t.geometry;n.boundingSphere===null&&n.computeBoundingSphere(),or.copy(n.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(or)}intersectsSprite(t){or.center.set(0,0,0);let n=KT.distanceTo(t.center);return or.radius=.7071067811865476+n,or.applyMatrix4(t.matrixWorld),this.intersectsSphere(or)}intersectsSphere(t){let n=this.planes,i=t.center,s=-t.radius;for(let a=0;a<6;a++)if(n[a].distanceToPoint(i)<s)return!1;return!0}intersectsBox(t){let n=this.planes;for(let i=0;i<6;i++){let s=n[i];if(_h.x=s.normal.x>0?t.max.x:t.min.x,_h.y=s.normal.y>0?t.max.y:t.min.y,_h.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(_h)<0)return!1}return!0}containsPoint(t){let n=this.planes;for(let i=0;i<6;i++)if(n[i].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var sc=class extends An{constructor(t=[],n=Da,i,s,a,r,o,l,c,u){super(t,n,i,s,a,r,o,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}};var Ea=class extends An{constructor(t,n,i=ki,s,a,r,o=Xe,l=Xe,c,u=ns,f=1){if(u!==ns&&u!==La)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let h={width:t,height:n,depth:f};super(h,s,a,r,o,l,u,i,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new wo(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){let n=super.toJSON(t);return n.compareFunction=this.compareFunction,n}},Hh=class extends Ea{constructor(t,n=ki,i=Da,s,a,r=Xe,o=Xe,l,c=ns){let u={width:t,height:t,depth:1},f=[u,u,u,u,u,u];super(t,t,n,i,s,a,r,o,l,c),this.image=f,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(t){this.image=t}},ac=class extends An{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}},Do=class e extends qn{constructor(t=1,n=1,i=1,s=1,a=1,r=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:n,depth:i,widthSegments:s,heightSegments:a,depthSegments:r};let o=this;s=Math.floor(s),a=Math.floor(a),r=Math.floor(r);let l=[],c=[],u=[],f=[],h=0,d=0;m("z","y","x",-1,-1,i,n,t,r,a,0),m("z","y","x",1,-1,i,n,-t,r,a,1),m("x","z","y",1,1,t,i,n,s,r,2),m("x","z","y",1,-1,t,i,-n,s,r,3),m("x","y","z",1,-1,t,n,i,s,a,4),m("x","y","z",-1,-1,t,n,-i,s,a,5),this.setIndex(l),this.setAttribute("position",new sn(c,3)),this.setAttribute("normal",new sn(u,3)),this.setAttribute("uv",new sn(f,2));function m(b,g,p,y,S,v,E,T,C,x,A){let R=v/C,O=E/x,F=v/2,V=E/2,U=T/2,G=C+1,J=x+1,q=0,it=0,P=new H;for(let K=0;K<J;K++){let $=K*O-V;for(let ht=0;ht<G;ht++){let _t=ht*R-F;P[b]=_t*y,P[g]=$*S,P[p]=U,c.push(P.x,P.y,P.z),P[b]=0,P[g]=0,P[p]=T>0?1:-1,u.push(P.x,P.y,P.z),f.push(ht/C),f.push(1-K/x),q+=1}}for(let K=0;K<x;K++)for(let $=0;$<C;$++){let ht=h+$+G*K,_t=h+$+G*(K+1),Gt=h+($+1)+G*(K+1),Vt=h+($+1)+G*K;l.push(ht,_t,Vt),l.push(_t,Gt,Vt),it+=6}o.addGroup(d,it,A),d+=it,h+=q}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}};var rc=class e extends qn{constructor(t=1,n=32,i=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:n,thetaStart:i,thetaLength:s},n=Math.max(3,n);let a=[],r=[],o=[],l=[],c=new H,u=new ie;r.push(0,0,0),o.push(0,0,1),l.push(.5,.5);for(let f=0,h=3;f<=n;f++,h+=3){let d=i+f/n*s;c.x=t*Math.cos(d),c.y=t*Math.sin(d),r.push(c.x,c.y,c.z),o.push(0,0,1),u.x=(r[h]/t+1)/2,u.y=(r[h+1]/t+1)/2,l.push(u.x,u.y)}for(let f=1;f<=n;f++)a.push(f,f+1,0);this.setIndex(a),this.setAttribute("position",new sn(r,3)),this.setAttribute("normal",new sn(o,3)),this.setAttribute("uv",new sn(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new e(t.radius,t.segments,t.thetaStart,t.thetaLength)}};var Ta=class e extends qn{constructor(t=1,n=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:n,widthSegments:i,heightSegments:s};let a=t/2,r=n/2,o=Math.floor(i),l=Math.floor(s),c=o+1,u=l+1,f=t/o,h=n/l,d=[],m=[],b=[],g=[];for(let p=0;p<u;p++){let y=p*h-r;for(let S=0;S<c;S++){let v=S*f-a;m.push(v,-y,0),b.push(0,0,1),g.push(S/o),g.push(1-p/l)}}for(let p=0;p<l;p++)for(let y=0;y<o;y++){let S=y+c*p,v=y+c*(p+1),E=y+1+c*(p+1),T=y+1+c*p;d.push(S,v,T),d.push(v,E,T)}this.setIndex(d),this.setAttribute("position",new sn(m,3)),this.setAttribute("normal",new sn(b,3)),this.setAttribute("uv",new sn(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.widthSegments,t.heightSegments)}};function dr(e){let t={};for(let n in e){t[n]={};for(let i in e[n]){let s=e[n][i];if(Vb(s))s.isRenderTargetTexture?(Nt("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[n][i]=null):t[n][i]=s.clone();else if(Array.isArray(s))if(Vb(s[0])){let a=[];for(let r=0,o=s.length;r<o;r++)a[r]=s[r].clone();t[n][i]=a}else t[n][i]=s.slice();else t[n][i]=s}}return t}function wn(e){let t={};for(let n=0;n<e.length;n++){let i=dr(e[n]);for(let s in i)t[s]=i[s]}return t}function Vb(e){return e&&(e.isColor||e.isMatrix3||e.isMatrix4||e.isVector2||e.isVector3||e.isVector4||e.isTexture||e.isQuaternion)}function JT(e){let t=[];for(let n=0;n<e.length;n++)t.push(e[n].clone());return t}function Yg(e){let t=e.getRenderTarget();return t===null?e.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:jt.workingColorSpace}var NS={clone:dr,merge:wn},QT=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,jT=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,ri=class extends cr{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=QT,this.fragmentShader=jT,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=dr(t.uniforms),this.uniformsGroups=JT(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this.defaultAttributeValues=Object.assign({},t.defaultAttributeValues),this.index0AttributeName=t.index0AttributeName,this.uniformsNeedUpdate=t.uniformsNeedUpdate,this}toJSON(t){let n=super.toJSON(t);n.glslVersion=this.glslVersion,n.uniforms={};for(let s in this.uniforms){let r=this.uniforms[s].value;r&&r.isTexture?n.uniforms[s]={type:"t",value:r.toJSON(t).uuid}:r&&r.isColor?n.uniforms[s]={type:"c",value:r.getHex()}:r&&r.isVector2?n.uniforms[s]={type:"v2",value:r.toArray()}:r&&r.isVector3?n.uniforms[s]={type:"v3",value:r.toArray()}:r&&r.isVector4?n.uniforms[s]={type:"v4",value:r.toArray()}:r&&r.isMatrix3?n.uniforms[s]={type:"m3",value:r.toArray()}:r&&r.isMatrix4?n.uniforms[s]={type:"m4",value:r.toArray()}:n.uniforms[s]={value:r}}Object.keys(this.defines).length>0&&(n.defines=this.defines),n.vertexShader=this.vertexShader,n.fragmentShader=this.fragmentShader,n.lights=this.lights,n.clipping=this.clipping;let i={};for(let s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(n.extensions=i),n}fromJSON(t,n){if(super.fromJSON(t,n),t.uniforms!==void 0)for(let i in t.uniforms){let s=t.uniforms[i];switch(this.uniforms[i]={},s.type){case"t":this.uniforms[i].value=n[s.value]||null;break;case"c":this.uniforms[i].value=new se().setHex(s.value);break;case"v2":this.uniforms[i].value=new ie().fromArray(s.value);break;case"v3":this.uniforms[i].value=new H().fromArray(s.value);break;case"v4":this.uniforms[i].value=new Pe().fromArray(s.value);break;case"m3":this.uniforms[i].value=new It().fromArray(s.value);break;case"m4":this.uniforms[i].value=new We().fromArray(s.value);break;default:this.uniforms[i].value=s.value}}if(t.defines!==void 0&&(this.defines=t.defines),t.vertexShader!==void 0&&(this.vertexShader=t.vertexShader),t.fragmentShader!==void 0&&(this.fragmentShader=t.fragmentShader),t.glslVersion!==void 0&&(this.glslVersion=t.glslVersion),t.extensions!==void 0)for(let i in t.extensions)this.extensions[i]=t.extensions[i];return t.lights!==void 0&&(this.lights=t.lights),t.clipping!==void 0&&(this.clipping=t.clipping),this}},Vh=class extends ri{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}};var Gh=class extends cr{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=gS,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}},Wh=class extends cr{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}};function bo(e,t){return!e||e.constructor===t?e:typeof t.BYTES_PER_ELEMENT=="number"?new t(e):Array.prototype.slice.call(e)}function mg(e){return e!==void 0&&e.inTangents!==void 0&&e.outTangents!==void 0}var Aa=class{constructor(t,n,i,s){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new n.constructor(i),this.sampleValues=n,this.valueSize=i,this.settings=null,this.DefaultSettings_={}}evaluate(t){let n=this.parameterPositions,i=this._cachedIndex,s=n[i],a=n[i-1];t:{e:{let r;n:{i:if(!(t<s)){for(let o=i+2;;){if(s===void 0){if(t<a)break i;return i=n.length,this._cachedIndex=i,this.copySampleValue_(i-1)}if(i===o)break;if(a=s,s=n[++i],t<s)break e}r=n.length;break n}if(!(t>=a)){let o=n[1];t<o&&(i=2,a=o);for(let l=i-2;;){if(a===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===l)break;if(s=a,a=n[--i-1],t>=a)break e}r=i,i=0;break n}break t}for(;i<r;){let o=i+r>>>1;t<n[o]?r=o:i=o+1}if(s=n[i],a=n[i-1],a===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return i=n.length,this._cachedIndex=i,this.copySampleValue_(i-1)}this._cachedIndex=i,this.intervalChanged_(i,a,s)}return this.interpolate_(i,a,t,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){let n=this.resultBuffer,i=this.sampleValues,s=this.valueSize,a=t*s;for(let r=0;r!==s;++r)n[r]=i[a+r];return n}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}},Xh=class extends Aa{constructor(t,n,i,s){super(t,n,i,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:yg,endingEnd:yg}}intervalChanged_(t,n,i){let s=this.parameterPositions,a=t-2,r=t+1,o=s[a],l=s[r];if(o===void 0)switch(this.getSettings_().endingStart){case xg:a=t,o=2*n-i;break;case vg:a=s.length-2,o=n+s[a]-s[a+1];break;default:a=t,o=i}if(l===void 0)switch(this.getSettings_().endingEnd){case xg:r=t,l=2*i-n;break;case vg:r=1,l=i+s[1]-s[0];break;default:r=t-1,l=n}let c=(i-n)*.5,u=this.valueSize;this._weightPrev=c/(n-o),this._weightNext=c/(l-i),this._offsetPrev=a*u,this._offsetNext=r*u}interpolate_(t,n,i,s){let a=this.resultBuffer,r=this.sampleValues,o=this.valueSize,l=t*o,c=l-o,u=this._offsetPrev,f=this._offsetNext,h=this._weightPrev,d=this._weightNext,m=(i-n)/(s-n),b=m*m,g=b*m,p=-h*g+2*h*b-h*m,y=(1+h)*g+(-1.5-2*h)*b+(-.5+h)*m+1,S=(-1-d)*g+(1.5+d)*b+.5*m,v=d*g-d*b;for(let E=0;E!==o;++E)a[E]=p*r[u+E]+y*r[c+E]+S*r[l+E]+v*r[f+E];return a}},qh=class extends Aa{constructor(t,n,i,s){super(t,n,i,s)}interpolate_(t,n,i,s){let a=this.resultBuffer,r=this.sampleValues,o=this.valueSize,l=t*o,c=l-o,u=(i-n)/(s-n),f=1-u;for(let h=0;h!==o;++h)a[h]=r[c+h]*f+r[l+h]*u;return a}},Yh=class extends Aa{constructor(t,n,i,s){super(t,n,i,s)}interpolate_(t){return this.copySampleValue_(t-1)}},Zh=class extends Aa{interpolate_(t,n,i,s){let a=this.resultBuffer,r=this.sampleValues,o=this.valueSize,l=t*o,c=l-o,u=this.inTangents,f=this.outTangents;if(!u||!f){let m=(i-n)/(s-n),b=1-m;for(let g=0;g!==o;++g)a[g]=r[c+g]*b+r[l+g]*m;return a}let h=o*2,d=t-1;for(let m=0;m!==o;++m){let b=r[c+m],g=r[l+m],p=d*h+m*2,y=f[p],S=f[p+1],v=t*h+m*2,E=u[v],T=u[v+1],C=tA(i,n,y,E,s);a[m]=LS(C,b,S,T,g)}return a}};function LS(e,t,n,i,s){let a=1-e;return a*a*a*t+3*a*a*e*n+3*a*e*e*i+e*e*e*s}function $T(e,t,n,i,s){let a=1-e;return 3*a*a*(n-t)+6*a*e*(i-n)+3*e*e*(s-i)}function tA(e,t,n,i,s){let a=(e-t)/(s-t);for(let r=0;r<8;r++){let o=LS(a,t,n,i,s)-e;if(Math.abs(o)<1e-10)break;let l=$T(a,t,n,i,s);if(Math.abs(l)<1e-10)break;a=Math.max(0,Math.min(1,a-o/l))}return a}var oi=class{constructor(t,n,i,s){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(n===void 0||n.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=bo(n,this.TimeBufferType),this.values=bo(i,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(t){let n=t.constructor,i;if(n.toJSON!==this.toJSON)i=n.toJSON(t);else{i={name:t.name,times:bo(t.times,Array),values:bo(t.values,Array)};let s=t.getInterpolation();s!==t.DefaultInterpolation&&(i.interpolation=s),mg(t.settings)&&(i.settings={inTangents:bo(t.settings.inTangents,Array),outTangents:bo(t.settings.outTangents,Array)})}return i.type=t.ValueTypeName,i}InterpolantFactoryMethodDiscrete(t){return new Yh(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new qh(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new Xh(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodBezier(t){let n=new Zh(this.times,this.values,this.getValueSize(),t);return this.settings&&(n.inTangents=this.settings.inTangents,n.outTangents=this.settings.outTangents),n}setInterpolation(t){let n;switch(t){case Yl:n=this.InterpolantFactoryMethodDiscrete;break;case Oh:n=this.InterpolantFactoryMethodLinear;break;case Mh:n=this.InterpolantFactoryMethodSmooth;break;case gg:n=this.InterpolantFactoryMethodBezier;break}if(n===void 0){let i="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(i);return Nt("KeyframeTrack:",i),this}return this.createInterpolant=n,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Yl;case this.InterpolantFactoryMethodLinear:return Oh;case this.InterpolantFactoryMethodSmooth:return Mh;case this.InterpolantFactoryMethodBezier:return gg}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){let n=this.times;for(let i=0,s=n.length;i!==s;++i)n[i]+=t}return this}scale(t){if(t!==1){let n=this.times;for(let i=0,s=n.length;i!==s;++i)n[i]*=t;mg(this.settings)&&(Gb(this.settings.inTangents,t),Gb(this.settings.outTangents,t))}return this}trim(t,n){let i=this.times,s=i.length,a=0,r=s-1;for(;a!==s&&i[a]<t;)++a;for(;r!==-1&&i[r]>n;)--r;if(++r,a!==0||r!==s){a>=r&&(r=Math.max(r,1),a=r-1);let o=this.getValueSize();this.times=i.slice(a,r),this.values=this.values.slice(a*o,r*o)}return this}validate(){let t=!0,n=this.getValueSize();n-Math.floor(n)!==0&&(Ot("KeyframeTrack: Invalid value size in track.",this),t=!1);let i=this.times,s=this.values,a=i.length;a===0&&(Ot("KeyframeTrack: Track is empty.",this),t=!1);let r=null;for(let o=0;o!==a;o++){let l=i[o];if(typeof l=="number"&&isNaN(l)){Ot("KeyframeTrack: Time is not a valid number.",this,o,l),t=!1;break}if(r!==null&&r>l){Ot("KeyframeTrack: Out of order keys.",this,o,l,r),t=!1;break}r=l}if(s!==void 0&&DT(s))for(let o=0,l=s.length;o!==l;++o){let c=s[o];if(isNaN(c)){Ot("KeyframeTrack: Value is not a valid number.",this,o,c),t=!1;break}}return t}optimize(){let t=this.times.slice(),n=this.values.slice(),i=this.getValueSize(),s=this.getInterpolation()===Mh,a=t.length-1,r=1;for(let o=1;o<a;++o){let l=!1,c=t[o],u=t[o+1];if(c!==u&&(o!==1||c!==t[0]))if(s)l=!0;else{let f=o*i,h=f-i,d=f+i;for(let m=0;m!==i;++m){let b=n[f+m];if(b!==n[h+m]||b!==n[d+m]){l=!0;break}}}if(l){if(o!==r){t[r]=t[o];let f=o*i,h=r*i;for(let d=0;d!==i;++d)n[h+d]=n[f+d]}++r}}if(a>0){t[r]=t[a];for(let o=a*i,l=r*i,c=0;c!==i;++c)n[l+c]=n[o+c];++r}return r!==t.length?(this.times=t.slice(0,r),this.values=n.slice(0,r*i)):(this.times=t,this.values=n),this}clone(){let t=this.times.slice(),n=this.values.slice(),i=this.constructor,s=new i(this.name,t,n);return s.createInterpolant=this.createInterpolant,mg(this.settings)&&(s.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),s}};function Gb(e,t){for(let n=0,i=e.length;n!==i;n+=2)e[n]*=t}oi.prototype.ValueTypeName="";oi.prototype.TimeBufferType=Float32Array;oi.prototype.ValueBufferType=Float32Array;oi.prototype.DefaultInterpolation=Oh;var wa=class extends oi{constructor(t,n,i){super(t,n,i)}};wa.prototype.ValueTypeName="bool";wa.prototype.ValueBufferType=Array;wa.prototype.DefaultInterpolation=Yl;wa.prototype.InterpolantFactoryMethodLinear=void 0;wa.prototype.InterpolantFactoryMethodSmooth=void 0;var Kh=class extends oi{constructor(t,n,i,s){super(t,n,i,s)}};Kh.prototype.ValueTypeName="color";var Jh=class extends oi{constructor(t,n,i,s){super(t,n,i,s)}};Jh.prototype.ValueTypeName="number";var Qh=class extends Aa{constructor(t,n,i,s){super(t,n,i,s)}interpolate_(t,n,i,s){let a=this.resultBuffer,r=this.sampleValues,o=this.valueSize,l=(i-n)/(s-n),c=t*o;for(let u=c+o;c!==u;c+=4)ss.slerpFlat(a,0,r,c-o,r,c,l);return a}},oc=class extends oi{constructor(t,n,i,s){super(t,n,i,s)}InterpolantFactoryMethodLinear(t){return new Qh(this.times,this.values,this.getValueSize(),t)}};oc.prototype.ValueTypeName="quaternion";oc.prototype.InterpolantFactoryMethodSmooth=void 0;var Ca=class extends oi{constructor(t,n,i){super(t,n,i)}};Ca.prototype.ValueTypeName="string";Ca.prototype.ValueBufferType=Array;Ca.prototype.DefaultInterpolation=Yl;Ca.prototype.InterpolantFactoryMethodLinear=void 0;Ca.prototype.InterpolantFactoryMethodSmooth=void 0;var jh=class extends oi{constructor(t,n,i,s){super(t,n,i,s)}};jh.prototype.ValueTypeName="vector";var $h=class{constructor(t,n,i){let s=this,a=!1,r=0,o=0,l,c=[];this.onStart=void 0,this.onLoad=t,this.onProgress=n,this.onError=i,this._abortController=null,this.itemStart=function(u){o++,a===!1&&s.onStart!==void 0&&s.onStart(u,r,o),a=!0},this.itemEnd=function(u){r++,s.onProgress!==void 0&&s.onProgress(u,r,o),r===o&&(a=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(u){s.onError!==void 0&&s.onError(u)},this.resolveURL=function(u){return u=u.normalize("NFC"),l?l(u):u},this.setURLModifier=function(u){return l=u,this},this.addHandler=function(u,f){return c.push(u,f),this},this.removeHandler=function(u){let f=c.indexOf(u);return f!==-1&&c.splice(f,2),this},this.getHandler=function(u){for(let f=0,h=c.length;f<h;f+=2){let d=c[f],m=c[f+1];if(d.global&&(d.lastIndex=0),d.test(u))return m}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},US=new $h,tf=class{constructor(t){this.manager=t!==void 0?t:US,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(t,n){let i=this;return new Promise(function(s,a){i.load(t,s,n,a)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}abort(){return this}};tf.DEFAULT_MATERIAL_NAME="__DEFAULT";var bh=new H,Sh=new ss,ts=new H,lc=class extends Ei{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new We,this.projectionMatrix=new We,this.projectionMatrixInverse=new We,this.coordinateSystem=zi,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,n){return super.copy(t,n),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorld.decompose(bh,Sh,ts),ts.x===1&&ts.y===1&&ts.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(bh,Sh,ts.set(1,1,1)).invert()}updateWorldMatrix(t,n,i=!1){super.updateWorldMatrix(t,n,i),this.matrixWorld.decompose(bh,Sh,ts),ts.x===1&&ts.y===1&&ts.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(bh,Sh,ts.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},_a=new H,Wb=new ie,Xb=new ie,Wn=class extends lc{constructor(t=50,n=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=n,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,n){return super.copy(t,n),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){let n=.5*this.getFilmHeight()/t;this.fov=Ih*2*Math.atan(n),this.updateProjectionMatrix()}getFocalLength(){let t=Math.tan(Zm*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Ih*2*Math.atan(Math.tan(Zm*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,n,i){_a.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(_a.x,_a.y).multiplyScalar(-t/_a.z),_a.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(_a.x,_a.y).multiplyScalar(-t/_a.z)}getViewSize(t,n){return this.getViewBounds(t,Wb,Xb),n.subVectors(Xb,Wb)}setViewOffset(t,n,i,s,a,r){this.aspect=t/n,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=s,this.view.width=a,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=this.near,n=t*Math.tan(Zm*.5*this.fov)/this.zoom,i=2*n,s=this.aspect*i,a=-.5*s,r=this.view;if(this.view!==null&&this.view.enabled){let l=r.fullWidth,c=r.fullHeight;a+=r.offsetX*s/l,n-=r.offsetY*i/c,s*=r.width/l,i*=r.height/c}let o=this.filmOffset;o!==0&&(a+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(a,a+s,n,n-i,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let n=super.toJSON(t);return n.object.fov=this.fov,n.object.zoom=this.zoom,n.object.near=this.near,n.object.far=this.far,n.object.focus=this.focus,n.object.aspect=this.aspect,this.view!==null&&(n.object.view=Object.assign({},this.view)),n.object.filmGauge=this.filmGauge,n.object.filmOffset=this.filmOffset,n}};var ur=class extends lc{constructor(t=-1,n=1,i=1,s=-1,a=.1,r=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=n,this.top=i,this.bottom=s,this.near=a,this.far=r,this.updateProjectionMatrix()}copy(t,n){return super.copy(t,n),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,n,i,s,a,r){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=s,this.view.width=a,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=(this.right-this.left)/(2*this.zoom),n=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2,a=i-t,r=i+t,o=s+n,l=s-n;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;a+=c*this.view.offsetX,r=a+c*this.view.width,o-=u*this.view.offsetY,l=o-u*this.view.height}this.projectionMatrix.makeOrthographic(a,r,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let n=super.toJSON(t);return n.object.zoom=this.zoom,n.object.left=this.left,n.object.right=this.right,n.object.top=this.top,n.object.bottom=this.bottom,n.object.near=this.near,n.object.far=this.far,this.view!==null&&(n.object.view=Object.assign({},this.view)),n}};var So=-90,Mo=1,ef=class extends Ei{constructor(t,n,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new Wn(So,Mo,t,n);s.layers=this.layers,this.add(s);let a=new Wn(So,Mo,t,n);a.layers=this.layers,this.add(a);let r=new Wn(So,Mo,t,n);r.layers=this.layers,this.add(r);let o=new Wn(So,Mo,t,n);o.layers=this.layers,this.add(o);let l=new Wn(So,Mo,t,n);l.layers=this.layers,this.add(l);let c=new Wn(So,Mo,t,n);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let t=this.coordinateSystem,n=this.children.concat(),[i,s,a,r,o,l]=n;for(let c of n)this.remove(c);if(t===zi)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),a.up.set(0,0,-1),a.lookAt(0,1,0),r.up.set(0,0,1),r.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===Jl)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),a.up.set(0,0,1),a.lookAt(0,1,0),r.up.set(0,0,-1),r.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(let c of n)this.add(c),c.updateMatrixWorld()}update(t,n){this.parent===null&&this.updateMatrixWorld();let{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());let[a,r,o,l,c,u]=this.children,f=t.getRenderTarget(),h=t.getActiveCubeFace(),d=t.getActiveMipmapLevel(),m=t.xr.enabled;t.xr.enabled=!1;let b=i.texture.generateMipmaps;i.texture.generateMipmaps=!1;let g=!1;t.isWebGLRenderer===!0?g=t.state.buffers.depth.getReversed():g=t.reversedDepthBuffer,t.setRenderTarget(i,0,s),g&&t.autoClear===!1&&t.clearDepth(),t.render(n,a),t.setRenderTarget(i,1,s),g&&t.autoClear===!1&&t.clearDepth(),t.render(n,r),t.setRenderTarget(i,2,s),g&&t.autoClear===!1&&t.clearDepth(),t.render(n,o),t.setRenderTarget(i,3,s),g&&t.autoClear===!1&&t.clearDepth(),t.render(n,l),t.setRenderTarget(i,4,s),g&&t.autoClear===!1&&t.clearDepth(),t.render(n,c),i.texture.generateMipmaps=b,t.setRenderTarget(i,5,s),g&&t.autoClear===!1&&t.clearDepth(),t.render(n,u),t.setRenderTarget(f,h,d),t.xr.enabled=m,i.texture.needsPMREMUpdate=!0}},nf=class extends Wn{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}};var Zg="\\[\\]\\.:\\/",eA=new RegExp("["+Zg+"]","g"),Kg="[^"+Zg+"]",nA="[^"+Zg.replace("\\.","")+"]",iA=/((?:WC+[\/:])*)/.source.replace("WC",Kg),sA=/(WCOD+)?/.source.replace("WCOD",nA),aA=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Kg),rA=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Kg),oA=new RegExp("^"+iA+sA+aA+rA+"$"),lA=["material","materials","bones","map"],_g=class{constructor(t,n,i){let s=i||De.parseTrackName(n);this._targetGroup=t,this._bindings=t.subscribe_(n,s)}getValue(t,n){this.bind();let i=this._targetGroup.nCachedObjects_,s=this._bindings[i];s!==void 0&&s.getValue(t,n)}setValue(t,n){let i=this._bindings;for(let s=this._targetGroup.nCachedObjects_,a=i.length;s!==a;++s)i[s].setValue(t,n)}bind(){let t=this._bindings;for(let n=this._targetGroup.nCachedObjects_,i=t.length;n!==i;++n)t[n].bind()}unbind(){let t=this._bindings;for(let n=this._targetGroup.nCachedObjects_,i=t.length;n!==i;++n)t[n].unbind()}},De=class e{constructor(t,n,i){this.path=n,this.parsedPath=i||e.parseTrackName(n),this.node=e.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,n,i){return t&&t.isAnimationObjectGroup?new e.Composite(t,n,i):new e(t,n,i)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(eA,"")}static parseTrackName(t){let n=oA.exec(t);if(n===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+t);let i={nodeName:n[2],objectName:n[3],objectIndex:n[4],propertyName:n[5],propertyIndex:n[6]},s=i.nodeName&&i.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let a=i.nodeName.substring(s+1);lA.indexOf(a)!==-1&&(i.nodeName=i.nodeName.substring(0,s),i.objectName=a)}if(i.propertyName===null||i.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+t);return i}static findNode(t,n){if(n===void 0||n===""||n==="."||n===-1||n===t.name||n===t.uuid)return t;if(t.skeleton){let i=t.skeleton.getBoneByName(n);if(i!==void 0)return i}if(t.children){let i=function(a){for(let r=0;r<a.length;r++){let o=a[r];if(o.name===n||o.uuid===n)return o;let l=i(o.children);if(l)return l}return null},s=i(t.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,n){t[n]=this.targetObject[this.propertyName]}_getValue_array(t,n){let i=this.resolvedProperty;for(let s=0,a=i.length;s!==a;++s)t[n++]=i[s]}_getValue_arrayElement(t,n){t[n]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,n){this.resolvedProperty.toArray(t,n)}_setValue_direct(t,n){this.targetObject[this.propertyName]=t[n]}_setValue_direct_setNeedsUpdate(t,n){this.targetObject[this.propertyName]=t[n],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,n){this.targetObject[this.propertyName]=t[n],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,n){let i=this.resolvedProperty;for(let s=0,a=i.length;s!==a;++s)i[s]=t[n++]}_setValue_array_setNeedsUpdate(t,n){let i=this.resolvedProperty;for(let s=0,a=i.length;s!==a;++s)i[s]=t[n++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,n){let i=this.resolvedProperty;for(let s=0,a=i.length;s!==a;++s)i[s]=t[n++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,n){this.resolvedProperty[this.propertyIndex]=t[n]}_setValue_arrayElement_setNeedsUpdate(t,n){this.resolvedProperty[this.propertyIndex]=t[n],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,n){this.resolvedProperty[this.propertyIndex]=t[n],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,n){this.resolvedProperty.fromArray(t,n)}_setValue_fromArray_setNeedsUpdate(t,n){this.resolvedProperty.fromArray(t,n),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,n){this.resolvedProperty.fromArray(t,n),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,n){this.bind(),this.getValue(t,n)}_setValue_unbound(t,n){this.bind(),this.setValue(t,n)}bind(){let t=this.node,n=this.parsedPath,i=n.objectName,s=n.propertyName,a=n.propertyIndex;if(t||(t=e.findNode(this.rootNode,n.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){Nt("PropertyBinding: No target node found for track: "+this.path+".");return}if(i){let c=n.objectIndex;switch(i){case"materials":if(!t.material){Ot("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){Ot("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){Ot("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let u=0;u<t.length;u++)if(t[u].name===c){c=u;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){Ot("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){Ot("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[i]===void 0){Ot("PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[i]}if(c!==void 0){if(t[c]===void 0){Ot("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[c]}}let r=t[s];if(r===void 0){let c=n.nodeName;Ot("PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",t);return}let o=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?o=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(a!==void 0){if(s==="morphTargetInfluences"){if(!t.geometry){Ot("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){Ot("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[a]!==void 0&&(a=t.morphTargetDictionary[a])}l=this.BindingType.ArrayElement,this.resolvedProperty=r,this.propertyIndex=a}else r.fromArray!==void 0&&r.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=r):Array.isArray(r)?(l=this.BindingType.EntireArray,this.resolvedProperty=r):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};De.Composite=_g;De.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};De.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};De.prototype.GetterByBindingType=[De.prototype._getValue_direct,De.prototype._getValue_array,De.prototype._getValue_arrayElement,De.prototype._getValue_toArray];De.prototype.SetterByBindingTypeAndVersioning=[[De.prototype._setValue_direct,De.prototype._setValue_direct_setNeedsUpdate,De.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[De.prototype._setValue_array,De.prototype._setValue_array_setNeedsUpdate,De.prototype._setValue_array_setMatrixWorldNeedsUpdate],[De.prototype._setValue_arrayElement,De.prototype._setValue_arrayElement_setNeedsUpdate,De.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[De.prototype._setValue_fromArray,De.prototype._setValue_fromArray_setNeedsUpdate,De.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var z3=new Float32Array(1);var bg=class e{static{e.prototype.isMatrix2=!0}constructor(t,n,i,s){this.elements=[1,0,0,1],t!==void 0&&this.set(t,n,i,s)}identity(){return this.set(1,0,0,1),this}fromArray(t,n=0){for(let i=0;i<4;i++)this.elements[i]=t[i+n];return this}set(t,n,i,s){let a=this.elements;return a[0]=t,a[2]=n,a[1]=i,a[3]=s,this}};function Jg(e,t,n,i){let s=cA(i);switch(n){case Hg:return e*t;case Gg:return e*t/s.components*s.byteLength;case uf:return e*t/s.components*s.byteLength;case Ua:return e*t*2/s.components*s.byteLength;case hf:return e*t*2/s.components*s.byteLength;case Vg:return e*t*3/s.components*s.byteLength;case wi:return e*t*4/s.components*s.byteLength;case ff:return e*t*4/s.components*s.byteLength;case fc:case dc:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case pc:case mc:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case pf:case gf:return Math.max(e,16)*Math.max(t,8)/4;case df:case mf:return Math.max(e,8)*Math.max(t,8)/2;case yf:case xf:case _f:case bf:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case vf:case gc:case Sf:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case Mf:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case Ef:return Math.floor((e+4)/5)*Math.floor((t+3)/4)*16;case Tf:return Math.floor((e+4)/5)*Math.floor((t+4)/5)*16;case Af:return Math.floor((e+5)/6)*Math.floor((t+4)/5)*16;case wf:return Math.floor((e+5)/6)*Math.floor((t+5)/6)*16;case Cf:return Math.floor((e+7)/8)*Math.floor((t+4)/5)*16;case Rf:return Math.floor((e+7)/8)*Math.floor((t+5)/6)*16;case Df:return Math.floor((e+7)/8)*Math.floor((t+7)/8)*16;case Nf:return Math.floor((e+9)/10)*Math.floor((t+4)/5)*16;case Lf:return Math.floor((e+9)/10)*Math.floor((t+5)/6)*16;case Uf:return Math.floor((e+9)/10)*Math.floor((t+7)/8)*16;case Of:return Math.floor((e+9)/10)*Math.floor((t+9)/10)*16;case If:return Math.floor((e+11)/12)*Math.floor((t+9)/10)*16;case Pf:return Math.floor((e+11)/12)*Math.floor((t+11)/12)*16;case Bf:case zf:case Ff:return Math.ceil(e/4)*Math.ceil(t/4)*16;case kf:case Hf:return Math.ceil(e/4)*Math.ceil(t/4)*8;case yc:case Vf:return Math.ceil(e/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${n} format.`)}function cA(e){switch(e){case li:case Bg:return{byteLength:1,components:1};case Uo:case zg:case Vi:return{byteLength:2,components:1};case lf:case cf:return{byteLength:2,components:4};case ki:case of:case Hi:return{byteLength:4,components:1};case Fg:case kg:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${e}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"186"}}));typeof window<"u"&&(window.__THREE__?Nt("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="186");function e1(){let e=null,t=!1,n=null,i=null;function s(a,r){i=e.requestAnimationFrame(s),n(a,r)}return{start:function(){t!==!0&&n!==null&&e!==null&&(i=e.requestAnimationFrame(s),t=!0)},stop:function(){e!==null&&e.cancelAnimationFrame(i),t=!1},setAnimationLoop:function(a){n=a},setContext:function(a){e=a}}}function hA(e){let t=new WeakMap;function n(o,l){let c=o.array,u=o.usage,f=c.byteLength,h=e.createBuffer();e.bindBuffer(l,h),e.bufferData(l,c,u),o.onUploadCallback();let d;if(c instanceof Float32Array)d=e.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)d=e.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?d=e.HALF_FLOAT:d=e.UNSIGNED_SHORT;else if(c instanceof Int16Array)d=e.SHORT;else if(c instanceof Uint32Array)d=e.UNSIGNED_INT;else if(c instanceof Int32Array)d=e.INT;else if(c instanceof Int8Array)d=e.BYTE;else if(c instanceof Uint8Array)d=e.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)d=e.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:h,type:d,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:f}}function i(o,l,c){let u=l.array,f=l.updateRanges;if(e.bindBuffer(c,o),f.length===0)e.bufferSubData(c,0,u);else{f.sort((d,m)=>d.start-m.start);let h=0;for(let d=1;d<f.length;d++){let m=f[h],b=f[d];b.start<=m.start+m.count+1?m.count=Math.max(m.count,b.start+b.count-m.start):(++h,f[h]=b)}f.length=h+1;for(let d=0,m=f.length;d<m;d++){let b=f[d];e.bufferSubData(c,b.start*u.BYTES_PER_ELEMENT,u,b.start,b.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function a(o){o.isInterleavedBufferAttribute&&(o=o.data);let l=t.get(o);l&&(e.deleteBuffer(l.buffer),t.delete(o))}function r(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){let u=t.get(o);(!u||u.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}let c=t.get(o);if(c===void 0)t.set(o,n(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,o,l),c.version=o.version}}return{get:s,remove:a,update:r}}var fA=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,dA=`#ifdef USE_ALPHAHASH
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
#endif`,pA=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,mA=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,gA=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,yA=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,xA=`#ifdef USE_AOMAP
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
#endif`,vA=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,_A=`#ifdef USE_BATCHING
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
#endif`,bA=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,SA=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,MA=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,EA=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,TA=`#ifdef USE_IRIDESCENCE
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
#endif`,AA=`#ifdef USE_BUMPMAP
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
#endif`,wA=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,CA=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,RA=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,DA=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,NA=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,LA=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,UA=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,OA=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
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
#endif`,IA=`#define PI 3.141592653589793
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
} // validated`,PA=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,BA=`vec3 transformedNormal = objectNormal;
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
#endif`,zA=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,FA=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,kA=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,HA=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,VA="gl_FragColor = linearToOutputTexel( gl_FragColor );",GA=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,WA=`#ifdef USE_ENVMAP
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
#endif`,XA=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,qA=`#ifdef USE_ENVMAP
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
#endif`,YA=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,ZA=`#ifdef USE_ENVMAP
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
#endif`,KA=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,JA=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,QA=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,jA=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,$A=`#ifdef USE_GRADIENTMAP
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
}`,tw=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,ew=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,nw=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,iw=`uniform bool receiveShadow;
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
#include <lightprobes_pars_fragment>`,sw=`#ifdef USE_ENVMAP
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
#endif`,aw=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,rw=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,ow=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,lw=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,cw=`PhysicalMaterial material;
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
#endif`,uw=`uniform sampler2D dfgLUT;
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
}`,hw=`
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
#endif`,fw=`#if defined( RE_IndirectDiffuse )
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
#endif`,dw=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,pw=`#ifdef USE_LIGHT_PROBES_GRID
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
#endif`,mw=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,gw=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,yw=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,xw=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,vw=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,_w=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,bw=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Sw=`#if defined( USE_POINTS_UV )
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
#endif`,Mw=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Ew=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Tw=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Aw=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,ww=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Cw=`#ifdef USE_MORPHTARGETS
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
#endif`,Rw=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Dw=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Nw=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Lw=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Uw=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Ow=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,Iw=`#ifdef USE_NORMALMAP
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
#endif`,Pw=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Bw=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,zw=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Fw=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,kw=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Hw=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Vw=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Gw=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Ww=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Xw=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,qw=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Yw=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Zw=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Kw=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Jw=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Qw=`float getShadowMask() {
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
}`,jw=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,$w=`#ifdef USE_SKINNING
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
#endif`,t2=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,e2=`#ifdef USE_SKINNING
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
#endif`,n2=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,i2=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,s2=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,a2=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,r2=`#ifdef USE_TRANSMISSION
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
#endif`,o2=`#ifdef USE_TRANSMISSION
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
#endif`,l2=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,c2=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,u2=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,h2=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,f2=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,d2=`uniform sampler2D t2D;
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
}`,p2=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,m2=`#ifdef ENVMAP_TYPE_CUBE
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
}`,g2=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,y2=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,x2=`#include <common>
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
}`,v2=`#if DEPTH_PACKING == 3200
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
}`,_2=`#define DISTANCE
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
}`,b2=`#define DISTANCE
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
}`,S2=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,M2=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,E2=`uniform float scale;
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
}`,T2=`uniform vec3 diffuse;
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
}`,A2=`#include <common>
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
}`,w2=`uniform vec3 diffuse;
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
}`,C2=`#define LAMBERT
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
}`,R2=`#define LAMBERT
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
}`,D2=`#define MATCAP
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
}`,N2=`#define MATCAP
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
}`,L2=`#define NORMAL
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
}`,U2=`#define NORMAL
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
}`,O2=`#define PHONG
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
}`,I2=`#define PHONG
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
}`,P2=`#define STANDARD
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
}`,B2=`#define STANDARD
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
}`,z2=`#define TOON
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
}`,F2=`#define TOON
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
}`,k2=`uniform float size;
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
}`,H2=`uniform vec3 diffuse;
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
}`,V2=`#include <common>
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
}`,G2=`uniform vec3 color;
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
}`,W2=`uniform float rotation;
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
}`,X2=`uniform vec3 diffuse;
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
}`,Ht={alphahash_fragment:fA,alphahash_pars_fragment:dA,alphamap_fragment:pA,alphamap_pars_fragment:mA,alphatest_fragment:gA,alphatest_pars_fragment:yA,aomap_fragment:xA,aomap_pars_fragment:vA,batching_pars_vertex:_A,batching_vertex:bA,begin_vertex:SA,beginnormal_vertex:MA,bsdfs:EA,iridescence_fragment:TA,bumpmap_pars_fragment:AA,clipping_planes_fragment:wA,clipping_planes_pars_fragment:CA,clipping_planes_pars_vertex:RA,clipping_planes_vertex:DA,color_fragment:NA,color_pars_fragment:LA,color_pars_vertex:UA,color_vertex:OA,common:IA,cube_uv_reflection_fragment:PA,defaultnormal_vertex:BA,displacementmap_pars_vertex:zA,displacementmap_vertex:FA,emissivemap_fragment:kA,emissivemap_pars_fragment:HA,colorspace_fragment:VA,colorspace_pars_fragment:GA,envmap_fragment:WA,envmap_common_pars_fragment:XA,envmap_pars_fragment:qA,envmap_pars_vertex:YA,envmap_physical_pars_fragment:sw,envmap_vertex:ZA,fog_vertex:KA,fog_pars_vertex:JA,fog_fragment:QA,fog_pars_fragment:jA,gradientmap_pars_fragment:$A,lightmap_pars_fragment:tw,lights_lambert_fragment:ew,lights_lambert_pars_fragment:nw,lights_pars_begin:iw,lights_toon_fragment:aw,lights_toon_pars_fragment:rw,lights_phong_fragment:ow,lights_phong_pars_fragment:lw,lights_physical_fragment:cw,lights_physical_pars_fragment:uw,lights_fragment_begin:hw,lights_fragment_maps:fw,lights_fragment_end:dw,lightprobes_pars_fragment:pw,logdepthbuf_fragment:mw,logdepthbuf_pars_fragment:gw,logdepthbuf_pars_vertex:yw,logdepthbuf_vertex:xw,map_fragment:vw,map_pars_fragment:_w,map_particle_fragment:bw,map_particle_pars_fragment:Sw,metalnessmap_fragment:Mw,metalnessmap_pars_fragment:Ew,morphinstance_vertex:Tw,morphcolor_vertex:Aw,morphnormal_vertex:ww,morphtarget_pars_vertex:Cw,morphtarget_vertex:Rw,normal_fragment_begin:Dw,normal_fragment_maps:Nw,normal_pars_fragment:Lw,normal_pars_vertex:Uw,normal_vertex:Ow,normalmap_pars_fragment:Iw,clearcoat_normal_fragment_begin:Pw,clearcoat_normal_fragment_maps:Bw,clearcoat_pars_fragment:zw,iridescence_pars_fragment:Fw,opaque_fragment:kw,packing:Hw,premultiplied_alpha_fragment:Vw,project_vertex:Gw,dithering_fragment:Ww,dithering_pars_fragment:Xw,roughnessmap_fragment:qw,roughnessmap_pars_fragment:Yw,shadowmap_pars_fragment:Zw,shadowmap_pars_vertex:Kw,shadowmap_vertex:Jw,shadowmask_pars_fragment:Qw,skinbase_vertex:jw,skinning_pars_vertex:$w,skinning_vertex:t2,skinnormal_vertex:e2,specularmap_fragment:n2,specularmap_pars_fragment:i2,tonemapping_fragment:s2,tonemapping_pars_fragment:a2,transmission_fragment:r2,transmission_pars_fragment:o2,uv_pars_fragment:l2,uv_pars_vertex:c2,uv_vertex:u2,worldpos_vertex:h2,background_vert:f2,background_frag:d2,backgroundCube_vert:p2,backgroundCube_frag:m2,cube_vert:g2,cube_frag:y2,depth_vert:x2,depth_frag:v2,distance_vert:_2,distance_frag:b2,equirect_vert:S2,equirect_frag:M2,linedashed_vert:E2,linedashed_frag:T2,meshbasic_vert:A2,meshbasic_frag:w2,meshlambert_vert:C2,meshlambert_frag:R2,meshmatcap_vert:D2,meshmatcap_frag:N2,meshnormal_vert:L2,meshnormal_frag:U2,meshphong_vert:O2,meshphong_frag:I2,meshphysical_vert:P2,meshphysical_frag:B2,meshtoon_vert:z2,meshtoon_frag:F2,points_vert:k2,points_frag:H2,shadow_vert:V2,shadow_frag:G2,sprite_vert:W2,sprite_frag:X2},dt={common:{diffuse:{value:new se(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new It},alphaMap:{value:null},alphaMapTransform:{value:new It},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new It}},envmap:{envMap:{value:null},envMapRotation:{value:new It},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new It}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new It}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new It},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new It},normalScale:{value:new ie(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new It},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new It}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new It}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new It}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new se(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new H},probesMax:{value:new H},probesResolution:{value:new H}},points:{diffuse:{value:new se(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new It},alphaTest:{value:0},uvTransform:{value:new It}},sprite:{diffuse:{value:new se(16777215)},opacity:{value:1},center:{value:new ie(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new It},alphaMap:{value:null},alphaMapTransform:{value:new It},alphaTest:{value:0}}},os={basic:{uniforms:wn([dt.common,dt.specularmap,dt.envmap,dt.aomap,dt.lightmap,dt.fog]),vertexShader:Ht.meshbasic_vert,fragmentShader:Ht.meshbasic_frag},lambert:{uniforms:wn([dt.common,dt.specularmap,dt.envmap,dt.aomap,dt.lightmap,dt.emissivemap,dt.bumpmap,dt.normalmap,dt.displacementmap,dt.fog,dt.lights,{emissive:{value:new se(0)},envMapIntensity:{value:1}}]),vertexShader:Ht.meshlambert_vert,fragmentShader:Ht.meshlambert_frag},phong:{uniforms:wn([dt.common,dt.specularmap,dt.envmap,dt.aomap,dt.lightmap,dt.emissivemap,dt.bumpmap,dt.normalmap,dt.displacementmap,dt.fog,dt.lights,{emissive:{value:new se(0)},specular:{value:new se(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Ht.meshphong_vert,fragmentShader:Ht.meshphong_frag},standard:{uniforms:wn([dt.common,dt.envmap,dt.aomap,dt.lightmap,dt.emissivemap,dt.bumpmap,dt.normalmap,dt.displacementmap,dt.roughnessmap,dt.metalnessmap,dt.fog,dt.lights,{emissive:{value:new se(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ht.meshphysical_vert,fragmentShader:Ht.meshphysical_frag},toon:{uniforms:wn([dt.common,dt.aomap,dt.lightmap,dt.emissivemap,dt.bumpmap,dt.normalmap,dt.displacementmap,dt.gradientmap,dt.fog,dt.lights,{emissive:{value:new se(0)}}]),vertexShader:Ht.meshtoon_vert,fragmentShader:Ht.meshtoon_frag},matcap:{uniforms:wn([dt.common,dt.bumpmap,dt.normalmap,dt.displacementmap,dt.fog,{matcap:{value:null}}]),vertexShader:Ht.meshmatcap_vert,fragmentShader:Ht.meshmatcap_frag},points:{uniforms:wn([dt.points,dt.fog]),vertexShader:Ht.points_vert,fragmentShader:Ht.points_frag},dashed:{uniforms:wn([dt.common,dt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ht.linedashed_vert,fragmentShader:Ht.linedashed_frag},depth:{uniforms:wn([dt.common,dt.displacementmap]),vertexShader:Ht.depth_vert,fragmentShader:Ht.depth_frag},normal:{uniforms:wn([dt.common,dt.bumpmap,dt.normalmap,dt.displacementmap,{opacity:{value:1}}]),vertexShader:Ht.meshnormal_vert,fragmentShader:Ht.meshnormal_frag},sprite:{uniforms:wn([dt.sprite,dt.fog]),vertexShader:Ht.sprite_vert,fragmentShader:Ht.sprite_frag},background:{uniforms:{uvTransform:{value:new It},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ht.background_vert,fragmentShader:Ht.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new It}},vertexShader:Ht.backgroundCube_vert,fragmentShader:Ht.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ht.cube_vert,fragmentShader:Ht.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ht.equirect_vert,fragmentShader:Ht.equirect_frag},distance:{uniforms:wn([dt.common,dt.displacementmap,{referencePosition:{value:new H},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ht.distance_vert,fragmentShader:Ht.distance_frag},shadow:{uniforms:wn([dt.lights,dt.fog,{color:{value:new se(0)},opacity:{value:1}}]),vertexShader:Ht.shadow_vert,fragmentShader:Ht.shadow_frag}};os.physical={uniforms:wn([os.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new It},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new It},clearcoatNormalScale:{value:new ie(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new It},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new It},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new It},sheen:{value:0},sheenColor:{value:new se(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new It},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new It},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new It},transmissionSamplerSize:{value:new ie},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new It},attenuationDistance:{value:0},attenuationColor:{value:new se(0)},specularColor:{value:new se(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new It},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new It},anisotropyVector:{value:new ie},anisotropyMap:{value:null},anisotropyMapTransform:{value:new It}}]),vertexShader:Ht.meshphysical_vert,fragmentShader:Ht.meshphysical_frag};var Xf={r:0,b:0,g:0},q2=new We,n1=new It;n1.set(-1,0,0,0,1,0,0,0,1);function Y2(e,t,n,i,s,a){let r=new se(0),o=s===!0?0:1,l,c,u=null,f=0,h=null;function d(y){let S=y.isScene===!0?y.background:null;if(S&&S.isTexture){let v=y.backgroundBlurriness>0;S=t.get(S,v)}return S}function m(y){let S=!1,v=d(y);v===null?g(r,o):v&&v.isColor&&(g(v,1),S=!0);let E=e.xr.getEnvironmentBlendMode();E==="additive"?n.buffers.color.setClear(0,0,0,1,a):E==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(e.autoClear||S)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil))}function b(y,S){let v=d(S);v&&(v.isCubeTexture||v.mapping===uc)?(c===void 0&&(c=new an(new Do(1,1,1),new ri({name:"BackgroundCubeMaterial",uniforms:dr(os.backgroundCube.uniforms),vertexShader:os.backgroundCube.vertexShader,fragmentShader:os.backgroundCube.fragmentShader,side:Un,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(E,T,C){this.matrixWorld.copyPosition(C.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(c)),c.material.uniforms.envMap.value=v,c.material.uniforms.backgroundBlurriness.value=S.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(q2.makeRotationFromEuler(S.backgroundRotation)).transpose(),v.isCubeTexture&&v.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(n1),c.material.toneMapped=jt.getTransfer(v.colorSpace)!==he,(u!==v||f!==v.version||h!==e.toneMapping)&&(c.material.needsUpdate=!0,u=v,f=v.version,h=e.toneMapping),c.layers.enableAll(),y.unshift(c,c.geometry,c.material,0,0,null)):v&&v.isTexture&&(l===void 0&&(l=new an(new Ta(2,2),new ri({name:"BackgroundMaterial",uniforms:dr(os.background.uniforms),vertexShader:os.background.vertexShader,fragmentShader:os.background.fragmentShader,side:Ra,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(l)),l.material.uniforms.t2D.value=v,l.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,l.material.toneMapped=jt.getTransfer(v.colorSpace)!==he,v.matrixAutoUpdate===!0&&v.updateMatrix(),l.material.uniforms.uvTransform.value.copy(v.matrix),(u!==v||f!==v.version||h!==e.toneMapping)&&(l.material.needsUpdate=!0,u=v,f=v.version,h=e.toneMapping),l.layers.enableAll(),y.unshift(l,l.geometry,l.material,0,0,null))}function g(y,S){y.getRGB(Xf,Yg(e)),n.buffers.color.setClear(Xf.r,Xf.g,Xf.b,S,a)}function p(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return r},setClearColor:function(y,S=1){r.set(y),o=S,g(r,o)},getClearAlpha:function(){return o},setClearAlpha:function(y){o=y,g(r,o)},render:m,addToRenderList:b,dispose:p}}function Z2(e,t){let n=e.getParameter(e.MAX_VERTEX_ATTRIBS),i={},s=h(null),a=s,r=!1;function o(O,F,V,U,G){let J=!1,q=f(O,U,V,F);a!==q&&(a=q,c(a.object)),J=d(O,U,V,G),J&&m(O,U,V,G),G!==null&&t.update(G,e.ELEMENT_ARRAY_BUFFER),(J||r)&&(r=!1,v(O,F,V,U),G!==null&&e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,t.get(G).buffer))}function l(){return e.createVertexArray()}function c(O){return e.bindVertexArray(O)}function u(O){return e.deleteVertexArray(O)}function f(O,F,V,U){let G=U.wireframe===!0,J=i[F.id];J===void 0&&(J={},i[F.id]=J);let q=O.isInstancedMesh===!0?O.id:0,it=J[q];it===void 0&&(it={},J[q]=it);let P=it[V.id];P===void 0&&(P={},it[V.id]=P);let K=P[G];return K===void 0&&(K=h(l()),P[G]=K),K}function h(O){let F=[],V=[],U=[];for(let G=0;G<n;G++)F[G]=0,V[G]=0,U[G]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:F,enabledAttributes:V,attributeDivisors:U,object:O,attributes:{},index:null}}function d(O,F,V,U){let G=a.attributes,J=F.attributes,q=0,it=V.getAttributes();for(let P in it)if(it[P].location>=0){let $=G[P],ht=J[P];if(ht===void 0&&(P==="instanceMatrix"&&O.instanceMatrix&&(ht=O.instanceMatrix),P==="instanceColor"&&O.instanceColor&&(ht=O.instanceColor)),$===void 0||$.attribute!==ht||ht&&$.data!==ht.data)return!0;q++}return a.attributesNum!==q||a.index!==U}function m(O,F,V,U){let G={},J=F.attributes,q=0,it=V.getAttributes();for(let P in it)if(it[P].location>=0){let $=J[P];$===void 0&&(P==="instanceMatrix"&&O.instanceMatrix&&($=O.instanceMatrix),P==="instanceColor"&&O.instanceColor&&($=O.instanceColor));let ht={};ht.attribute=$,$&&$.data&&(ht.data=$.data),G[P]=ht,q++}a.attributes=G,a.attributesNum=q,a.index=U}function b(){let O=a.newAttributes;for(let F=0,V=O.length;F<V;F++)O[F]=0}function g(O){p(O,0)}function p(O,F){let V=a.newAttributes,U=a.enabledAttributes,G=a.attributeDivisors;V[O]=1,U[O]===0&&(e.enableVertexAttribArray(O),U[O]=1),G[O]!==F&&(e.vertexAttribDivisor(O,F),G[O]=F)}function y(){let O=a.newAttributes,F=a.enabledAttributes;for(let V=0,U=F.length;V<U;V++)F[V]!==O[V]&&(e.disableVertexAttribArray(V),F[V]=0)}function S(O,F,V,U,G,J,q){q===!0?e.vertexAttribIPointer(O,F,V,G,J):e.vertexAttribPointer(O,F,V,U,G,J)}function v(O,F,V,U){b();let G=U.attributes,J=V.getAttributes(),q=F.defaultAttributeValues;for(let it in J){let P=J[it];if(P.location>=0){let K=G[it];if(K===void 0&&(it==="instanceMatrix"&&O.instanceMatrix&&(K=O.instanceMatrix),it==="instanceColor"&&O.instanceColor&&(K=O.instanceColor)),K!==void 0){let $=K.normalized,ht=K.itemSize,_t=t.get(K);if(_t===void 0)continue;let Gt=_t.buffer,Vt=_t.type,re=_t.bytesPerElement,Y=Vt===e.INT||Vt===e.UNSIGNED_INT||K.gpuType===of;if(K.isInterleavedBufferAttribute){let et=K.data,bt=et.stride,Pt=K.offset;if(et.isInstancedInterleavedBuffer){for(let xt=0;xt<P.locationSize;xt++)p(P.location+xt,et.meshPerAttribute);O.isInstancedMesh!==!0&&U._maxInstanceCount===void 0&&(U._maxInstanceCount=et.meshPerAttribute*et.count)}else for(let xt=0;xt<P.locationSize;xt++)g(P.location+xt);e.bindBuffer(e.ARRAY_BUFFER,Gt);for(let xt=0;xt<P.locationSize;xt++)S(P.location+xt,ht/P.locationSize,Vt,$,bt*re,(Pt+ht/P.locationSize*xt)*re,Y)}else{if(K.isInstancedBufferAttribute){for(let et=0;et<P.locationSize;et++)p(P.location+et,K.meshPerAttribute);O.isInstancedMesh!==!0&&U._maxInstanceCount===void 0&&(U._maxInstanceCount=K.meshPerAttribute*K.count)}else for(let et=0;et<P.locationSize;et++)g(P.location+et);e.bindBuffer(e.ARRAY_BUFFER,Gt);for(let et=0;et<P.locationSize;et++)S(P.location+et,ht/P.locationSize,Vt,$,ht*re,ht/P.locationSize*et*re,Y)}}else if(q!==void 0){let $=q[it];if($!==void 0)switch($.length){case 2:e.vertexAttrib2fv(P.location,$);break;case 3:e.vertexAttrib3fv(P.location,$);break;case 4:e.vertexAttrib4fv(P.location,$);break;default:e.vertexAttrib1fv(P.location,$)}}}}y()}function E(){A();for(let O in i){let F=i[O];for(let V in F){let U=F[V];for(let G in U){let J=U[G];for(let q in J)u(J[q].object),delete J[q];delete U[G]}}delete i[O]}}function T(O){if(i[O.id]===void 0)return;let F=i[O.id];for(let V in F){let U=F[V];for(let G in U){let J=U[G];for(let q in J)u(J[q].object),delete J[q];delete U[G]}}delete i[O.id]}function C(O){for(let F in i){let V=i[F];for(let U in V){let G=V[U];if(G[O.id]===void 0)continue;let J=G[O.id];for(let q in J)u(J[q].object),delete J[q];delete G[O.id]}}}function x(O){for(let F in i){let V=i[F],U=O.isInstancedMesh===!0?O.id:0,G=V[U];if(G!==void 0){for(let J in G){let q=G[J];for(let it in q)u(q[it].object),delete q[it];delete G[J]}delete V[U],Object.keys(V).length===0&&delete i[F]}}}function A(){R(),r=!0,a!==s&&(a=s,c(a.object))}function R(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:A,resetDefaultState:R,dispose:E,releaseStatesOfGeometry:T,releaseStatesOfObject:x,releaseStatesOfProgram:C,initAttributes:b,enableAttribute:g,disableUnusedAttributes:y}}function K2(e,t,n){let i;function s(l){i=l}function a(l,c){e.drawArrays(i,l,c),n.update(c,i,1)}function r(l,c,u){u!==0&&(e.drawArraysInstanced(i,l,c,u),n.update(c,i,u))}function o(l,c,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,c,0,u);let h=0;for(let d=0;d<u;d++)h+=c[d];n.update(h,i,1)}this.setMode=s,this.render=a,this.renderInstances=r,this.renderMultiDraw=o}function J2(e,t,n,i){let s;function a(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){let C=t.get("EXT_texture_filter_anisotropic");s=e.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function r(C){return!(C!==wi&&i.convert(C)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(C){let x=C===Vi&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(C!==li&&C!==Hi&&!x&&i.convert(C)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_TYPE))}function l(C){if(C==="highp"){if(e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.HIGH_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.MEDIUM_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=n.precision!==void 0?n.precision:"highp",u=l(c);u!==c&&(Nt("WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);let f=n.logarithmicDepthBuffer===!0,h=n.reversedDepthBuffer===!0&&t.has("EXT_clip_control");n.reversedDepthBuffer===!0&&h===!1&&Nt("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");let d=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),m=e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS),b=e.getParameter(e.MAX_TEXTURE_SIZE),g=e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE),p=e.getParameter(e.MAX_VERTEX_ATTRIBS),y=e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS),S=e.getParameter(e.MAX_VARYING_VECTORS),v=e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS),E=e.getParameter(e.MAX_SAMPLES),T=e.getParameter(e.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:l,textureFormatReadable:r,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:f,reversedDepthBuffer:h,maxTextures:d,maxVertexTextures:m,maxTextureSize:b,maxCubemapSize:g,maxAttributes:p,maxVertexUniforms:y,maxVaryings:S,maxFragmentUniforms:v,maxSamples:E,samples:T}}function Q2(e){let t=this,n=null,i=0,s=!1,a=!1,r=new Bi,o=new It,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(f,h){let d=f.length!==0||h||i!==0||s;return s=h,i=f.length,d},this.beginShadows=function(){a=!0,u(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(f,h){n=u(f,h,0)},this.setState=function(f,h,d){let m=f.clippingPlanes,b=f.clipIntersection,g=f.clipShadows,p=e.get(f);if(!s||m===null||m.length===0||a&&!g)a?u(null):c();else{let y=a?0:i,S=y*4,v=p.clippingState||null;l.value=v,v=u(m,h,S,d);for(let E=0;E!==S;++E)v[E]=n[E];p.clippingState=v,this.numIntersection=b?this.numPlanes:0,this.numPlanes+=y}};function c(){l.value!==n&&(l.value=n,l.needsUpdate=i>0),t.numPlanes=i,t.numIntersection=0}function u(f,h,d,m){let b=f!==null?f.length:0,g=null;if(b!==0){if(g=l.value,m!==!0||g===null){let p=d+b*4,y=h.matrixWorldInverse;o.getNormalMatrix(y),(g===null||g.length<p)&&(g=new Float32Array(p));for(let S=0,v=d;S!==b;++S,v+=4)r.copy(f[S]).applyMatrix4(y,o),r.normal.toArray(g,v),g[v+3]=r.constant}l.value=g,l.needsUpdate=!0}return t.numPlanes=b,t.numIntersection=0,g}}var Po=4,j2=6,$2=20,tC=256,vc=new ur,OS=new se,Qg=null,jg=0,$g=0,t0=!1,eC=new H,pr=new H,Yf=class{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(t,n=0,i=.1,s=100,a={}){let{size:r=256,position:o=eC}=a;Qg=this._renderer.getRenderTarget(),jg=this._renderer.getActiveCubeFace(),$g=this._renderer.getActiveMipmapLevel(),t0=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(r);let l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(t,i,s,l,o),n>0&&this._blur(l,0,0,n),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(t,n=null){return this._fromTexture(t,n)}fromCubemap(t,n=null){return this._fromTexture(t,n)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=BS(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=PS(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodMeshes.length;t++)this._lodMeshes[t].geometry.dispose()}_cleanup(t){this._renderer.setRenderTarget(Qg,jg,$g),this._renderer.xr.enabled=t0,t.scissorTest=!1,Io(t,0,0,t.width,t.height)}_fromTexture(t,n){t.mapping===Da||t.mapping===fr?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Qg=this._renderer.getRenderTarget(),jg=this._renderer.getActiveCubeFace(),$g=this._renderer.getActiveMipmapLevel(),t0=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let i=n||this._allocateTargets();return this._textureToCubeUV(t,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){let t=3*Math.max(this._cubeSize,112),n=4*this._cubeSize,i={magFilter:vn,minFilter:vn,generateMipmaps:!1,type:Vi,format:wi,colorSpace:Zl,depthBuffer:!1},s=IS(t,n,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==n){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=IS(t,n,i);let{_lodMax:a}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=nC(a)),this._blurMaterial=sC(a,t,n),this._ggxMaterial=iC(a,t,n)}return s}_compileMaterial(t){let n=new an(new qn,t);this._renderer.compile(n,vc)}_sceneToCubeUV(t,n,i,s,a){let l=new Wn(90,1,n,i),c=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],f=this._renderer,h=f.autoClear,d=f.toneMapping;f.getClearColor(OS),f.toneMapping=Fi,f.autoClear=!1,f.state.buffers.depth.getReversed()&&(f.setRenderTarget(s),f.clearDepth(),f.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new an(new Do,new Ti({name:"PMREM.Background",side:Un,depthWrite:!1,depthTest:!1})));let b=this._backgroundBox,g=b.material,p=!1,y=t.background;y?y.isColor&&(g.color.copy(y),t.background=null,p=!0):(g.color.copy(OS),p=!0);for(let S=0;S<6;S++){let v=S%3;v===0?(l.up.set(0,c[S],0),l.position.set(a.x,a.y,a.z),l.lookAt(a.x+u[S],a.y,a.z)):v===1?(l.up.set(0,0,c[S]),l.position.set(a.x,a.y,a.z),l.lookAt(a.x,a.y+u[S],a.z)):(l.up.set(0,c[S],0),l.position.set(a.x,a.y,a.z),l.lookAt(a.x,a.y,a.z+u[S]));let E=this._cubeSize;Io(s,v*E,S>2?E:0,E,E),f.setRenderTarget(s),p&&f.render(b,l),f.render(t,l)}f.toneMapping=d,f.autoClear=h,t.background=y}_textureToCubeUV(t,n){let i=this._renderer,s=t.mapping===Da||t.mapping===fr;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=BS()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=PS());let a=s?this._cubemapMaterial:this._equirectMaterial,r=this._lodMeshes[0];r.material=a;let o=a.uniforms;o.envMap.value=t;let l=this._cubeSize;Io(n,0,0,3*l,2*l),i.setRenderTarget(n),i.render(r,vc)}_applyPMREM(t){let n=this._renderer,i=n.autoClear;n.autoClear=!1;let s=this._lodMeshes.length;for(let a=1;a<s;a++)this._applyGGXFilter(t,a-1,a);n.autoClear=i}_applyGGXFilter(t,n,i){let s=this._renderer,a=this._pingPongRenderTarget,r=this._ggxMaterial,o=this._lodMeshes[i];o.material=r;let l=r.uniforms,c=i/(this._lodMeshes.length-1),u=n/(this._lodMeshes.length-1),f=Math.sqrt(c*c-u*u),h=c*1.25,d=f*h,{_lodMax:m}=this,b=this._sizeLods[i],g=3*b*(i>m-Po?i-m+Po:0),p=4*(this._cubeSize-b);l.envMap.value=t.texture,l.roughness.value=d,l.mipInt.value=m-n,Io(a,g,p,3*b,2*b),s.setRenderTarget(a),s.render(o,vc),l.envMap.value=a.texture,l.roughness.value=0,l.mipInt.value=m-i,Io(t,g,p,3*b,2*b),s.setRenderTarget(t),s.render(o,vc)}_blur(t,n,i,s){let a=this._pingPongRenderTarget,r=Math.min(s,Math.PI)/Math.SQRT2;this._blurPass(t,a,n,i,r),this._blurPass(a,t,i,i,r)}_blurPass(t,n,i,s,a){let r=this._renderer,o=this._blurMaterial,l=this._lodMeshes[s];l.material=o;let c=o.uniforms;c.envMap.value=t.texture,c.sigma.value=a,c.mipInt.value=this._lodMax-i;let u=this._sizeLods[s],f=3*u*(s>this._lodMax-Po?s-this._lodMax+Po:0),h=4*(this._cubeSize-u);Io(n,f,h,3*u,2*u),r.setRenderTarget(n),r.render(l,vc)}};function nC(e){let t=[],n=[],i=e,s=e-Po+1+j2;for(let a=0;a<s;a++){let r=Math.pow(2,i);t.push(r);let o=1/(r-2),l=-o,c=1+o,u=[l,l,c,l,c,c,l,l,c,c,l,c],f=6,h=6,d=3,m=new Float32Array(d*h*f),b=new Float32Array(d*h*f);for(let p=0;p<f;p++){let y=p%3*2/3-1,S=p>2?0:-1,v=[y,S,0,y+2/3,S,0,y+2/3,S+1,0,y,S,0,y+2/3,S+1,0,y,S+1,0];m.set(v,d*h*p);for(let E=0;E<h;E++){let T=u[E*2]*2-1,C=u[E*2+1]*2-1;p===0?pr.set(1,C,T):p===1?pr.set(-T,1,-C):p===2?pr.set(-T,C,1):p===3?pr.set(-1,C,-T):p===4?pr.set(-T,-1,C):pr.set(T,C,-1),pr.toArray(b,(p*h+E)*d)}}let g=new qn;g.setAttribute("position",new Mi(m,d)),g.setAttribute("outputDirection",new Mi(b,d)),n.push(new an(g,null)),i>Po&&i--}return{lodMeshes:n,sizeLods:t}}function IS(e,t,n){let i=new Xn(e,t,n);return i.texture.mapping=uc,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Io(e,t,n,i,s){e.viewport.set(t,n,i,s),e.scissor.set(t,n,i,s)}function iC(e,t,n){return new ri({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:tC,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Jf(),fragmentShader:`

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
		`,blending:as,depthTest:!1,depthWrite:!1})}function sC(e,t,n){return new ri({name:"SphericalGaussianBlur",defines:{SAMPLES:$2,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:Jf(),fragmentShader:`

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
		`,blending:as,depthTest:!1,depthWrite:!1})}function PS(){return new ri({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Jf(),fragmentShader:`

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
		`,blending:as,depthTest:!1,depthWrite:!1})}function BS(){return new ri({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Jf(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:as,depthTest:!1,depthWrite:!1})}function Jf(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}var Zf=class extends Xn{constructor(t=1,n={}){super(t,t,n),this.isWebGLCubeRenderTarget=!0;let i={width:t,height:t,depth:1},s=[i,i,i,i,i,i];this.texture=new sc(s),this._setTextureOptions(n),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,n){this.texture.type=n.type,this.texture.colorSpace=n.colorSpace,this.texture.generateMipmaps=n.generateMipmaps,this.texture.minFilter=n.minFilter,this.texture.magFilter=n.magFilter;let i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new Do(5,5,5),a=new ri({name:"CubemapFromEquirect",uniforms:dr(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Un,blending:as});a.uniforms.tEquirect.value=n;let r=new an(s,a),o=n.minFilter;return n.minFilter===Na&&(n.minFilter=vn),new ef(1,10,this).update(t,r),n.minFilter=o,r.geometry.dispose(),r.material.dispose(),this}clear(t,n=!0,i=!0,s=!0){let a=t.getRenderTarget();for(let r=0;r<6;r++)t.setRenderTarget(this,r),t.clear(n,i,s);t.setRenderTarget(a)}};function aC(e){let t=new WeakMap,n=new WeakMap,i=null;function s(h,d=!1){return h==null?null:d?r(h):a(h)}function a(h){if(h&&h.isTexture){let d=h.mapping;if(d===sf||d===af)if(t.has(h)){let m=t.get(h).texture;return o(m,h.mapping)}else{let m=h.image;if(m&&m.height>0){let b=new Zf(m.height);return b.fromEquirectangularTexture(e,h),t.set(h,b),h.addEventListener("dispose",c),o(b.texture,h.mapping)}else return null}}return h}function r(h){if(h&&h.isTexture){let d=h.mapping,m=d===sf||d===af,b=d===Da||d===fr;if(m||b){let g=n.get(h),p=g!==void 0?g.texture.pmremVersion:0;if(h.isRenderTargetTexture&&h.pmremVersion!==p)return i===null&&(i=new Yf(e)),g=m?i.fromEquirectangular(h,g):i.fromCubemap(h,g),g.texture.pmremVersion=h.pmremVersion,n.set(h,g),g.texture;if(g!==void 0)return g.texture;{let y=h.image;return m&&y&&y.height>0||b&&y&&l(y)?(i===null&&(i=new Yf(e)),g=m?i.fromEquirectangular(h):i.fromCubemap(h),g.texture.pmremVersion=h.pmremVersion,n.set(h,g),h.addEventListener("dispose",u),g.texture):null}}}return h}function o(h,d){return d===sf?h.mapping=Da:d===af&&(h.mapping=fr),h}function l(h){let d=0,m=6;for(let b=0;b<m;b++)h[b]!==void 0&&d++;return d===m}function c(h){let d=h.target;d.removeEventListener("dispose",c);let m=t.get(d);m!==void 0&&(t.delete(d),m.dispose())}function u(h){let d=h.target;d.removeEventListener("dispose",u);let m=n.get(d);m!==void 0&&(n.delete(d),m.dispose())}function f(){t=new WeakMap,n=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:s,dispose:f}}function rC(e){let t={};function n(i){if(t[i]!==void 0)return t[i];let s=e.getExtension(i);return t[i]=s,s}return{has:function(i){return n(i)!==null},init:function(){n("EXT_color_buffer_float"),n("WEBGL_clip_cull_distance"),n("OES_texture_float_linear"),n("EXT_color_buffer_half_float"),n("WEBGL_multisampled_render_to_texture"),n("WEBGL_render_shared_exponent")},get:function(i){let s=n(i);return s===null&&lr("WebGLRenderer: "+i+" extension not supported."),s}}}function oC(e,t,n,i){let s={},a=new WeakMap;function r(f){let h=f.target;h.index!==null&&t.remove(h.index);for(let m in h.attributes)t.remove(h.attributes[m]);h.removeEventListener("dispose",r),delete s[h.id];let d=a.get(h);d&&(t.remove(d),a.delete(h)),i.releaseStatesOfGeometry(h),h.isInstancedBufferGeometry===!0&&delete h._maxInstanceCount,n.memory.geometries--}function o(f,h){return s[h.id]===!0||(h.addEventListener("dispose",r),s[h.id]=!0,n.memory.geometries++),h}function l(f){let h=f.attributes;for(let d in h)t.update(h[d],e.ARRAY_BUFFER)}function c(f){let h=[],d=f.index,m=f.attributes.position,b=0;if(m===void 0)return;if(d!==null){let y=d.array;b=d.version;for(let S=0,v=y.length;S<v;S+=3){let E=y[S+0],T=y[S+1],C=y[S+2];h.push(E,T,T,C,C,E)}}else{let y=m.array;b=m.version;for(let S=0,v=y.length/3-1;S<v;S+=3){let E=S+0,T=S+1,C=S+2;h.push(E,T,T,C,C,E)}}let g=new(m.count>=65535?nc:ec)(h,1);g.version=b;let p=a.get(f);p&&t.remove(p),a.set(f,g)}function u(f){let h=a.get(f);if(h){let d=f.index;d!==null&&h.version<d.version&&c(f)}else c(f);return a.get(f)}return{get:o,update:l,getWireframeAttribute:u}}function lC(e,t,n){let i;function s(f){i=f}let a,r;function o(f){a=f.type,r=f.bytesPerElement}function l(f,h){e.drawElements(i,h,a,f*r),n.update(h,i,1)}function c(f,h,d){d!==0&&(e.drawElementsInstanced(i,h,a,f*r,d),n.update(h,i,d))}function u(f,h,d){if(d===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,h,0,a,f,0,d);let b=0;for(let g=0;g<d;g++)b+=h[g];n.update(b,i,1)}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=u}function cC(e){let t={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function i(a,r,o){switch(n.calls++,r){case e.TRIANGLES:n.triangles+=o*(a/3);break;case e.LINES:n.lines+=o*(a/2);break;case e.LINE_STRIP:n.lines+=o*(a-1);break;case e.LINE_LOOP:n.lines+=o*a;break;case e.POINTS:n.points+=o*a;break;default:Ot("WebGLInfo: Unknown draw mode:",r);break}}function s(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:t,render:n,programs:null,autoReset:!0,reset:s,update:i}}function uC(e,t,n){let i=new WeakMap,s=new Pe;function a(r,o,l){let c=r.morphTargetInfluences,u=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,f=u!==void 0?u.length:0,h=i.get(o);if(h===void 0||h.count!==f){let A=function(){C.dispose(),i.delete(o),o.removeEventListener("dispose",A)};h!==void 0&&h.texture.dispose();let d=o.morphAttributes.position!==void 0,m=o.morphAttributes.normal!==void 0,b=o.morphAttributes.color!==void 0,g=o.morphAttributes.position||[],p=o.morphAttributes.normal||[],y=o.morphAttributes.color||[],S=0;d===!0&&(S=1),m===!0&&(S=2),b===!0&&(S=3);let v=o.attributes.position.count*S,E=1;v>t.maxTextureSize&&(E=Math.ceil(v/t.maxTextureSize),v=t.maxTextureSize);let T=new Float32Array(v*E*4*f),C=new jl(T,v,E,f);C.type=Hi,C.needsUpdate=!0;let x=S*4;for(let R=0;R<f;R++){let O=g[R],F=p[R],V=y[R],U=v*E*4*R;for(let G=0;G<O.count;G++){let J=G*x;d===!0&&(s.fromBufferAttribute(O,G),T[U+J+0]=s.x,T[U+J+1]=s.y,T[U+J+2]=s.z,T[U+J+3]=0),m===!0&&(s.fromBufferAttribute(F,G),T[U+J+4]=s.x,T[U+J+5]=s.y,T[U+J+6]=s.z,T[U+J+7]=0),b===!0&&(s.fromBufferAttribute(V,G),T[U+J+8]=s.x,T[U+J+9]=s.y,T[U+J+10]=s.z,T[U+J+11]=V.itemSize===4?s.w:1)}}h={count:f,texture:C,size:new ie(v,E)},i.set(o,h),o.addEventListener("dispose",A)}if(r.isInstancedMesh===!0&&r.morphTexture!==null)l.getUniforms().setValue(e,"morphTexture",r.morphTexture,n);else{let d=0;for(let b=0;b<c.length;b++)d+=c[b];let m=o.morphTargetsRelative?1:1-d;l.getUniforms().setValue(e,"morphTargetBaseInfluence",m),l.getUniforms().setValue(e,"morphTargetInfluences",c)}l.getUniforms().setValue(e,"morphTargetsTexture",h.texture,n),l.getUniforms().setValue(e,"morphTargetsTextureSize",h.size)}return{update:a}}function hC(e,t,n,i,s){let a=new WeakMap;function r(c){let u=s.render.frame,f=c.geometry,h=t.get(c,f);if(a.get(h)!==u&&(t.update(h),a.set(h,u)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),a.get(c)!==u&&(n.update(c.instanceMatrix,e.ARRAY_BUFFER),c.instanceColor!==null&&n.update(c.instanceColor,e.ARRAY_BUFFER),a.set(c,u))),c.isSkinnedMesh){let d=c.skeleton;a.get(d)!==u&&(d.update(),a.set(d,u))}return h}function o(){a=new WeakMap}function l(c){let u=c.target;u.removeEventListener("dispose",l),i.releaseStatesOfObject(u),n.remove(u.instanceMatrix),u.instanceColor!==null&&n.remove(u.instanceColor)}return{update:r,dispose:o}}var fC={[Rg]:"LINEAR_TONE_MAPPING",[Dg]:"REINHARD_TONE_MAPPING",[Ng]:"CINEON_TONE_MAPPING",[Lg]:"ACES_FILMIC_TONE_MAPPING",[Og]:"AGX_TONE_MAPPING",[Ig]:"NEUTRAL_TONE_MAPPING",[Ug]:"CUSTOM_TONE_MAPPING"};function dC(e,t,n,i,s,a){let r=new Xn(t,n,{type:e,depthBuffer:s,stencilBuffer:a,samples:i?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),o=null,l=null,c=new qn;c.setAttribute("position",new sn([-1,3,0,-1,-1,0,3,-1,0],3)),c.setAttribute("uv",new sn([0,2,0,0,2,0],2));let u=new Vh({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),f=new an(c,u),h=new ur(-1,1,1,-1,0,1),d=null,m=null,b=!1,g,p=null,y=[],S=!1;this.setSize=function(v,E){r.setSize(v,E),o!==null&&o.setSize(v,E),l!==null&&l.setSize(v,E);for(let T=0;T<y.length;T++){let C=y[T];C.setSize&&C.setSize(v,E)}},this.setEffects=function(v){y=v,S=y.length>0&&y[0].isRenderPass===!0;let E=r.width,T=r.height;y.length>0&&o===null&&(o=new Xn(E,T,{type:Vi,depthBuffer:!1,stencilBuffer:!1}),l=new Xn(E,T,{type:Vi,depthBuffer:!1,stencilBuffer:!1}));for(let C=0;C<y.length;C++){let x=y[C];x.setSize&&x.setSize(E,T)}},this.begin=function(v,E){if(b||v.toneMapping===Fi&&y.length===0)return!1;if(p=E,E!==null){let T=E.width,C=E.height;(r.width!==T||r.height!==C)&&this.setSize(T,C)}return S===!1&&v.setRenderTarget(r),g=v.toneMapping,v.toneMapping=Fi,!0},this.hasRenderPass=function(){return S},this.end=function(v,E){v.toneMapping=g,b=!0;let T=r,C=o;for(let x=0;x<y.length;x++){let A=y[x];A.enabled!==!1&&(A.render(v,C,T,E),A.needsSwap!==!1&&(T=C,C=C===o?l:o))}if(d!==v.outputColorSpace||m!==v.toneMapping){d=v.outputColorSpace,m=v.toneMapping,u.defines={},jt.getTransfer(d)===he&&(u.defines.SRGB_TRANSFER="");let x=fC[m];x&&(u.defines[x]=""),u.needsUpdate=!0}u.uniforms.tDiffuse.value=T.texture,v.setRenderTarget(p),v.render(f,h),p=null,b=!1},this.isCompositing=function(){return b},this.dispose=function(){r.dispose(),o!==null&&o.dispose(),l!==null&&l.dispose(),c.dispose(),u.dispose()}}var i1=new An,i0=new Ea(1,1),s1=new jl,a1=new zh,r1=new sc,zS=[],FS=[],kS=new Float32Array(16),HS=new Float32Array(9),VS=new Float32Array(4);function zo(e,t,n){let i=e[0];if(i<=0||i>0)return e;let s=t*n,a=zS[s];if(a===void 0&&(a=new Float32Array(s),zS[s]=a),t!==0){i.toArray(a,0);for(let r=1,o=0;r!==t;++r)o+=n,e[r].toArray(a,o)}return a}function rn(e,t){if(e.length!==t.length)return!1;for(let n=0,i=e.length;n<i;n++)if(e[n]!==t[n])return!1;return!0}function on(e,t){for(let n=0,i=t.length;n<i;n++)e[n]=t[n]}function Qf(e,t){let n=FS[t];n===void 0&&(n=new Int32Array(t),FS[t]=n);for(let i=0;i!==t;++i)n[i]=e.allocateTextureUnit();return n}function pC(e,t){let n=this.cache;n[0]!==t&&(e.uniform1f(this.addr,t),n[0]=t)}function mC(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2f(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(rn(n,t))return;e.uniform2fv(this.addr,t),on(n,t)}}function gC(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3f(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else if(t.r!==void 0)(n[0]!==t.r||n[1]!==t.g||n[2]!==t.b)&&(e.uniform3f(this.addr,t.r,t.g,t.b),n[0]=t.r,n[1]=t.g,n[2]=t.b);else{if(rn(n,t))return;e.uniform3fv(this.addr,t),on(n,t)}}function yC(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4f(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(rn(n,t))return;e.uniform4fv(this.addr,t),on(n,t)}}function xC(e,t){let n=this.cache,i=t.elements;if(i===void 0){if(rn(n,t))return;e.uniformMatrix2fv(this.addr,!1,t),on(n,t)}else{if(rn(n,i))return;VS.set(i),e.uniformMatrix2fv(this.addr,!1,VS),on(n,i)}}function vC(e,t){let n=this.cache,i=t.elements;if(i===void 0){if(rn(n,t))return;e.uniformMatrix3fv(this.addr,!1,t),on(n,t)}else{if(rn(n,i))return;HS.set(i),e.uniformMatrix3fv(this.addr,!1,HS),on(n,i)}}function _C(e,t){let n=this.cache,i=t.elements;if(i===void 0){if(rn(n,t))return;e.uniformMatrix4fv(this.addr,!1,t),on(n,t)}else{if(rn(n,i))return;kS.set(i),e.uniformMatrix4fv(this.addr,!1,kS),on(n,i)}}function bC(e,t){let n=this.cache;n[0]!==t&&(e.uniform1i(this.addr,t),n[0]=t)}function SC(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2i(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(rn(n,t))return;e.uniform2iv(this.addr,t),on(n,t)}}function MC(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3i(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(rn(n,t))return;e.uniform3iv(this.addr,t),on(n,t)}}function EC(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4i(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(rn(n,t))return;e.uniform4iv(this.addr,t),on(n,t)}}function TC(e,t){let n=this.cache;n[0]!==t&&(e.uniform1ui(this.addr,t),n[0]=t)}function AC(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2ui(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(rn(n,t))return;e.uniform2uiv(this.addr,t),on(n,t)}}function wC(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3ui(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(rn(n,t))return;e.uniform3uiv(this.addr,t),on(n,t)}}function CC(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4ui(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(rn(n,t))return;e.uniform4uiv(this.addr,t),on(n,t)}}function RC(e,t,n){let i=this.cache,s=n.allocateTextureUnit();i[0]!==s&&(e.uniform1i(this.addr,s),i[0]=s);let a;this.type===e.SAMPLER_2D_SHADOW?(i0.compareFunction=n.isReversedDepthBuffer()?Wf:Gf,a=i0):a=i1,n.setTexture2D(t||a,s)}function DC(e,t,n){let i=this.cache,s=n.allocateTextureUnit();i[0]!==s&&(e.uniform1i(this.addr,s),i[0]=s),n.setTexture3D(t||a1,s)}function NC(e,t,n){let i=this.cache,s=n.allocateTextureUnit();i[0]!==s&&(e.uniform1i(this.addr,s),i[0]=s),n.setTextureCube(t||r1,s)}function LC(e,t,n){let i=this.cache,s=n.allocateTextureUnit();i[0]!==s&&(e.uniform1i(this.addr,s),i[0]=s),n.setTexture2DArray(t||s1,s)}function UC(e){switch(e){case 5126:return pC;case 35664:return mC;case 35665:return gC;case 35666:return yC;case 35674:return xC;case 35675:return vC;case 35676:return _C;case 5124:case 35670:return bC;case 35667:case 35671:return SC;case 35668:case 35672:return MC;case 35669:case 35673:return EC;case 5125:return TC;case 36294:return AC;case 36295:return wC;case 36296:return CC;case 35678:case 36198:case 36298:case 36306:case 35682:return RC;case 35679:case 36299:case 36307:return DC;case 35680:case 36300:case 36308:case 36293:return NC;case 36289:case 36303:case 36311:case 36292:return LC}}function OC(e,t){e.uniform1fv(this.addr,t)}function IC(e,t){let n=zo(t,this.size,2);e.uniform2fv(this.addr,n)}function PC(e,t){let n=zo(t,this.size,3);e.uniform3fv(this.addr,n)}function BC(e,t){let n=zo(t,this.size,4);e.uniform4fv(this.addr,n)}function zC(e,t){let n=zo(t,this.size,4);e.uniformMatrix2fv(this.addr,!1,n)}function FC(e,t){let n=zo(t,this.size,9);e.uniformMatrix3fv(this.addr,!1,n)}function kC(e,t){let n=zo(t,this.size,16);e.uniformMatrix4fv(this.addr,!1,n)}function HC(e,t){e.uniform1iv(this.addr,t)}function VC(e,t){e.uniform2iv(this.addr,t)}function GC(e,t){e.uniform3iv(this.addr,t)}function WC(e,t){e.uniform4iv(this.addr,t)}function XC(e,t){e.uniform1uiv(this.addr,t)}function qC(e,t){e.uniform2uiv(this.addr,t)}function YC(e,t){e.uniform3uiv(this.addr,t)}function ZC(e,t){e.uniform4uiv(this.addr,t)}function KC(e,t,n){let i=this.cache,s=t.length,a=Qf(n,s);rn(i,a)||(e.uniform1iv(this.addr,a),on(i,a));let r;this.type===e.SAMPLER_2D_SHADOW?r=i0:r=i1;for(let o=0;o!==s;++o)n.setTexture2D(t[o]||r,a[o])}function JC(e,t,n){let i=this.cache,s=t.length,a=Qf(n,s);rn(i,a)||(e.uniform1iv(this.addr,a),on(i,a));for(let r=0;r!==s;++r)n.setTexture3D(t[r]||a1,a[r])}function QC(e,t,n){let i=this.cache,s=t.length,a=Qf(n,s);rn(i,a)||(e.uniform1iv(this.addr,a),on(i,a));for(let r=0;r!==s;++r)n.setTextureCube(t[r]||r1,a[r])}function jC(e,t,n){let i=this.cache,s=t.length,a=Qf(n,s);rn(i,a)||(e.uniform1iv(this.addr,a),on(i,a));for(let r=0;r!==s;++r)n.setTexture2DArray(t[r]||s1,a[r])}function $C(e){switch(e){case 5126:return OC;case 35664:return IC;case 35665:return PC;case 35666:return BC;case 35674:return zC;case 35675:return FC;case 35676:return kC;case 5124:case 35670:return HC;case 35667:case 35671:return VC;case 35668:case 35672:return GC;case 35669:case 35673:return WC;case 5125:return XC;case 36294:return qC;case 36295:return YC;case 36296:return ZC;case 35678:case 36198:case 36298:case 36306:case 35682:return KC;case 35679:case 36299:case 36307:return JC;case 35680:case 36300:case 36308:case 36293:return QC;case 36289:case 36303:case 36311:case 36292:return jC}}var s0=class{constructor(t,n,i){this.id=t,this.addr=i,this.cache=[],this.type=n.type,this.setValue=UC(n.type)}},a0=class{constructor(t,n,i){this.id=t,this.addr=i,this.cache=[],this.type=n.type,this.size=n.size,this.setValue=$C(n.type)}},r0=class{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,n,i){let s=this.seq;for(let a=0,r=s.length;a!==r;++a){let o=s[a];o.setValue(t,n[o.id],i)}}},e0=/(\w+)(\])?(\[|\.)?/g;function GS(e,t){e.seq.push(t),e.map[t.id]=t}function tR(e,t,n){let i=e.name,s=i.length;for(e0.lastIndex=0;;){let a=e0.exec(i),r=e0.lastIndex,o=a[1],l=a[2]==="]",c=a[3];if(l&&(o=o|0),c===void 0||c==="["&&r+2===s){GS(n,c===void 0?new s0(o,e,t):new a0(o,e,t));break}else{let f=n.map[o];f===void 0&&(f=new r0(o),GS(n,f)),n=f}}}var Bo=class{constructor(t,n){this.seq=[],this.map={};let i=t.getProgramParameter(n,t.ACTIVE_UNIFORMS);for(let r=0;r<i;++r){let o=t.getActiveUniform(n,r),l=t.getUniformLocation(n,o.name);tR(o,l,this)}let s=[],a=[];for(let r of this.seq)r.type===t.SAMPLER_2D_SHADOW||r.type===t.SAMPLER_CUBE_SHADOW||r.type===t.SAMPLER_2D_ARRAY_SHADOW?s.push(r):a.push(r);s.length>0&&(this.seq=s.concat(a))}setValue(t,n,i,s){let a=this.map[n];a!==void 0&&a.setValue(t,i,s)}setOptional(t,n,i){let s=n[i];s!==void 0&&this.setValue(t,i,s)}static upload(t,n,i,s){for(let a=0,r=n.length;a!==r;++a){let o=n[a],l=i[o.id];l.needsUpdate!==!1&&o.setValue(t,l.value,s)}}static seqWithValue(t,n){let i=[];for(let s=0,a=t.length;s!==a;++s){let r=t[s];r.id in n&&i.push(r)}return i}};function WS(e,t,n){let i=e.createShader(t);return e.shaderSource(i,n),e.compileShader(i),i}var eR=37297,nR=0;function iR(e,t){let n=e.split(`
`),i=[],s=Math.max(t-6,0),a=Math.min(t+6,n.length);for(let r=s;r<a;r++){let o=r+1;i.push(`${o===t?">":" "} ${o}: ${n[r]}`)}return i.join(`
`)}var XS=new It;function sR(e){jt._getMatrix(XS,jt.workingColorSpace,e);let t=`mat3( ${XS.elements.map(n=>n.toFixed(4))} )`;switch(jt.getTransfer(e)){case Kl:return[t,"LinearTransferOETF"];case he:return[t,"sRGBTransferOETF"];default:return Nt("WebGLProgram: Unsupported color space: ",e),[t,"LinearTransferOETF"]}}function qS(e,t,n){let i=e.getShaderParameter(t,e.COMPILE_STATUS),a=(e.getShaderInfoLog(t)||"").trim();if(i&&a==="")return"";let r=/ERROR: 0:(\d+)/.exec(a);if(r){let o=parseInt(r[1]);return n.toUpperCase()+`

`+a+`

`+iR(e.getShaderSource(t),o)}else return a}function aR(e,t){let n=sR(t);return[`vec4 ${e}( vec4 value ) {`,`	return ${n[1]}( vec4( value.rgb * ${n[0]}, value.a ) );`,"}"].join(`
`)}var rR={[Rg]:"Linear",[Dg]:"Reinhard",[Ng]:"Cineon",[Lg]:"ACESFilmic",[Og]:"AgX",[Ig]:"Neutral",[Ug]:"Custom"};function oR(e,t){let n=rR[t];return n===void 0?(Nt("WebGLProgram: Unsupported toneMapping:",t),"vec3 "+e+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+e+"( vec3 color ) { return "+n+"ToneMapping( color ); }"}var qf=new H;function lR(){jt.getLuminanceCoefficients(qf);let e=qf.x.toFixed(4),t=qf.y.toFixed(4),n=qf.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${e}, ${t}, ${n} );`,"	return dot( weights, rgb );","}"].join(`
`)}function cR(e){return[e.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",e.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(bc).join(`
`)}function uR(e){let t=[];for(let n in e){let i=e[n];i!==!1&&t.push("#define "+n+" "+i)}return t.join(`
`)}function hR(e,t){let n={},i=e.getProgramParameter(t,e.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){let a=e.getActiveAttrib(t,s),r=a.name,o=1;a.type===e.FLOAT_MAT2&&(o=2),a.type===e.FLOAT_MAT3&&(o=3),a.type===e.FLOAT_MAT4&&(o=4),n[r]={type:a.type,location:e.getAttribLocation(t,r),locationSize:o}}return n}function bc(e){return e!==""}function YS(e,t){let n=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return e.replace(/NUM_SUN_LIGHTS/g,t.numSunLights).replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,t.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function ZS(e,t){return e.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var fR=/^[ \t]*#include +<([\w\d./]+)>/gm;function o0(e){return e.replace(fR,pR)}var dR=new Map;function pR(e,t){let n=Ht[t];if(n===void 0){let i=dR.get(t);if(i!==void 0)n=Ht[i],Nt('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,i);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+t+">")}return o0(n)}var mR=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function KS(e){return e.replace(mR,gR)}function gR(e,t,n,i){let s="";for(let a=parseInt(t);a<parseInt(n);a++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+a+" ]").replace(/UNROLLED_LOOP_INDEX/g,a);return s}function JS(e){let t=`precision ${e.precision} float;
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
#define LOW_PRECISION`),t}var yR={[cc]:"SHADOWMAP_TYPE_PCF",[No]:"SHADOWMAP_TYPE_VSM"};function xR(e){return yR[e.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}var vR={[Da]:"ENVMAP_TYPE_CUBE",[fr]:"ENVMAP_TYPE_CUBE",[uc]:"ENVMAP_TYPE_CUBE_UV"};function _R(e){return e.envMap===!1?"ENVMAP_TYPE_CUBE":vR[e.envMapMode]||"ENVMAP_TYPE_CUBE"}var bR={[fr]:"ENVMAP_MODE_REFRACTION"};function SR(e){return e.envMap===!1?"ENVMAP_MODE_REFLECTION":bR[e.envMapMode]||"ENVMAP_MODE_REFLECTION"}var MR={[Cg]:"ENVMAP_BLENDING_MULTIPLY",[dS]:"ENVMAP_BLENDING_MIX",[pS]:"ENVMAP_BLENDING_ADD"};function ER(e){return e.envMap===!1?"ENVMAP_BLENDING_NONE":MR[e.combine]||"ENVMAP_BLENDING_NONE"}function TR(e){let t=e.envMapCubeUVHeight;if(t===null)return null;let n=Math.log2(t)-2,i=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,n),112)),texelHeight:i,maxMip:n}}function AR(e,t,n,i){let s=e.getContext(),a=n.defines,r=n.vertexShader,o=n.fragmentShader,l=xR(n),c=_R(n),u=SR(n),f=ER(n),h=TR(n),d=cR(n),m=uR(a),b=s.createProgram(),g,p,y=n.glslVersion?"#version "+n.glslVersion+`
`:"";n.isRawShaderMaterial?(g=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,m].filter(bc).join(`
`),g.length>0&&(g+=`
`),p=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,m].filter(bc).join(`
`),p.length>0&&(p+=`
`)):(g=[JS(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,m,n.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",n.batching?"#define USE_BATCHING":"",n.batchingColor?"#define USE_BATCHING_COLOR":"",n.instancing?"#define USE_INSTANCING":"",n.instancingColor?"#define USE_INSTANCING_COLOR":"",n.instancingMorph?"#define USE_INSTANCING_MORPH":"",n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.map?"#define USE_MAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+u:"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.displacementMap?"#define USE_DISPLACEMENTMAP":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.mapUv?"#define MAP_UV "+n.mapUv:"",n.alphaMapUv?"#define ALPHAMAP_UV "+n.alphaMapUv:"",n.lightMapUv?"#define LIGHTMAP_UV "+n.lightMapUv:"",n.aoMapUv?"#define AOMAP_UV "+n.aoMapUv:"",n.emissiveMapUv?"#define EMISSIVEMAP_UV "+n.emissiveMapUv:"",n.bumpMapUv?"#define BUMPMAP_UV "+n.bumpMapUv:"",n.normalMapUv?"#define NORMALMAP_UV "+n.normalMapUv:"",n.displacementMapUv?"#define DISPLACEMENTMAP_UV "+n.displacementMapUv:"",n.metalnessMapUv?"#define METALNESSMAP_UV "+n.metalnessMapUv:"",n.roughnessMapUv?"#define ROUGHNESSMAP_UV "+n.roughnessMapUv:"",n.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+n.anisotropyMapUv:"",n.clearcoatMapUv?"#define CLEARCOATMAP_UV "+n.clearcoatMapUv:"",n.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+n.clearcoatNormalMapUv:"",n.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+n.clearcoatRoughnessMapUv:"",n.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+n.iridescenceMapUv:"",n.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+n.iridescenceThicknessMapUv:"",n.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+n.sheenColorMapUv:"",n.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+n.sheenRoughnessMapUv:"",n.specularMapUv?"#define SPECULARMAP_UV "+n.specularMapUv:"",n.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+n.specularColorMapUv:"",n.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+n.specularIntensityMapUv:"",n.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+n.transmissionMapUv:"",n.thicknessMapUv?"#define THICKNESSMAP_UV "+n.thicknessMapUv:"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexNormals?"#define HAS_NORMAL":"",n.vertexColors?"#define USE_COLOR":"",n.vertexAlphas?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.flatShading?"#define FLAT_SHADED":"",n.skinning?"#define USE_SKINNING":"",n.morphTargets?"#define USE_MORPHTARGETS":"",n.morphNormals&&n.flatShading===!1?"#define USE_MORPHNORMALS":"",n.morphColors?"#define USE_MORPHCOLORS":"",n.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+n.morphTextureStride:"",n.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+n.morphTargetsCount:"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+l:"",n.sizeAttenuation?"#define USE_SIZEATTENUATION":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",n.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(bc).join(`
`),p=[JS(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,m,n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",n.map?"#define USE_MAP":"",n.matcap?"#define USE_MATCAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+c:"",n.envMap?"#define "+u:"",n.envMap?"#define "+f:"",h?"#define CUBEUV_TEXEL_WIDTH "+h.texelWidth:"",h?"#define CUBEUV_TEXEL_HEIGHT "+h.texelHeight:"",h?"#define CUBEUV_MAX_MIP "+h.maxMip+".0":"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoat?"#define USE_CLEARCOAT":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.dispersion?"#define USE_DISPERSION":"",n.retroreflection?"#define USE_RETROREFLECTION":"",n.iridescence?"#define USE_IRIDESCENCE":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaTest?"#define USE_ALPHATEST":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.sheen?"#define USE_SHEEN":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexColors||n.instancingColor?"#define USE_COLOR":"",n.vertexAlphas||n.batchingColor?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.gradientMap?"#define USE_GRADIENTMAP":"",n.flatShading?"#define FLAT_SHADED":"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+l:"",n.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",n.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",n.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",n.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",n.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",n.toneMapping!==Fi?"#define TONE_MAPPING":"",n.toneMapping!==Fi?Ht.tonemapping_pars_fragment:"",n.toneMapping!==Fi?oR("toneMapping",n.toneMapping):"",n.dithering?"#define DITHERING":"",n.opaque?"#define OPAQUE":"",Ht.colorspace_pars_fragment,aR("linearToOutputTexel",n.outputColorSpace),lR(),n.useDepthPacking?"#define DEPTH_PACKING "+n.depthPacking:"",`
`].filter(bc).join(`
`)),r=o0(r),r=YS(r,n),r=ZS(r,n),o=o0(o),o=YS(o,n),o=ZS(o,n),r=KS(r),o=KS(o),n.isRawShaderMaterial!==!0&&(y=`#version 300 es
`,g=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,p=["#define varying in",n.glslVersion===Xg?"":"layout(location = 0) out highp vec4 pc_fragColor;",n.glslVersion===Xg?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);let S=y+g+r,v=y+p+o,E=WS(s,s.VERTEX_SHADER,S),T=WS(s,s.FRAGMENT_SHADER,v);s.attachShader(b,E),s.attachShader(b,T),n.index0AttributeName!==void 0?s.bindAttribLocation(b,0,n.index0AttributeName):n.hasPositionAttribute===!0&&s.bindAttribLocation(b,0,"position"),s.linkProgram(b);function C(O){if(e.debug.checkShaderErrors){let F=s.getProgramInfoLog(b)||"",V=s.getShaderInfoLog(E)||"",U=s.getShaderInfoLog(T)||"",G=F.trim(),J=V.trim(),q=U.trim(),it=!0,P=!0;if(s.getProgramParameter(b,s.LINK_STATUS)===!1)if(it=!1,typeof e.debug.onShaderError=="function")e.debug.onShaderError(s,b,E,T);else{let K=qS(s,E,"vertex"),$=qS(s,T,"fragment");Ot("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(b,s.VALIDATE_STATUS)+`

Material Name: `+O.name+`
Material Type: `+O.type+`

Program Info Log: `+G+`
`+K+`
`+$)}else G!==""?Nt("WebGLProgram: Program Info Log:",G):(J===""||q==="")&&(P=!1);P&&(O.diagnostics={runnable:it,programLog:G,vertexShader:{log:J,prefix:g},fragmentShader:{log:q,prefix:p}})}s.deleteShader(E),s.deleteShader(T),x=new Bo(s,b),A=hR(s,b)}let x;this.getUniforms=function(){return x===void 0&&C(this),x};let A;this.getAttributes=function(){return A===void 0&&C(this),A};let R=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return R===!1&&(R=s.getProgramParameter(b,eR)),R},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(b),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=nR++,this.cacheKey=t,this.usedTimes=1,this.program=b,this.vertexShader=E,this.fragmentShader=T,this}var wR=0,l0=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t,n,i){let s=this._getShaderCacheForMaterial(t);return s.has(n)===!1&&(s.add(n),n.usedTimes++),s.has(i)===!1&&(s.add(i),i.usedTimes++),this}remove(t){let n=this.materialCache.get(t);for(let i of n)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(t),this}getVertexShaderStage(t){return this._getShaderStage(t.vertexShader)}getFragmentShaderStage(t){return this._getShaderStage(t.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){let n=this.materialCache,i=n.get(t);return i===void 0&&(i=new Set,n.set(t,i)),i}_getShaderStage(t){let n=this.shaderCache,i=n.get(t);return i===void 0&&(i=new c0(t),n.set(t,i)),i}},c0=class{constructor(t){this.id=wR++,this.code=t,this.usedTimes=0}};function CR(e){return e===Ua||e===gc||e===yc}function RR(e,t,n,i,s,a){let r=new $l,o=new l0,l=new Set,c=[],u=new Map,f=i.logarithmicDepthBuffer,h=i.precision,d={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function m(x){return l.add(x),x===0?"uv":`uv${x}`}function b(x,A,R,O,F,V){let U=O.fog,G=F.geometry,J=x.isMeshStandardMaterial||x.isMeshLambertMaterial||x.isMeshPhongMaterial?O.environment:null,q=x.isMeshStandardMaterial||x.isMeshLambertMaterial&&!x.envMap||x.isMeshPhongMaterial&&!x.envMap,it=t.get(x.envMap||J,q),P=it&&it.mapping===uc?it.image.height:null,K=d[x.type];x.precision!==null&&(h=i.getMaxPrecision(x.precision),h!==x.precision&&Nt("WebGLProgram.getParameters:",x.precision,"not supported, using",h,"instead."));let $=G.morphAttributes.position||G.morphAttributes.normal||G.morphAttributes.color,ht=$!==void 0?$.length:0,_t=0;G.morphAttributes.position!==void 0&&(_t=1),G.morphAttributes.normal!==void 0&&(_t=2),G.morphAttributes.color!==void 0&&(_t=3);let Gt,Vt,re,Y;if(K){let be=os[K];Gt=be.vertexShader,Vt=be.fragmentShader}else{Gt=x.vertexShader,Vt=x.fragmentShader;let be=o.getVertexShaderStage(x),ce=o.getFragmentShaderStage(x);o.update(x,be,ce),re=be.id,Y=ce.id}let et=e.getRenderTarget(),bt=e.state.buffers.depth.getReversed(),Pt=F.isInstancedMesh===!0,xt=F.isBatchedMesh===!0,Wt=!!x.map,tn=!!x.matcap,qt=!!it,ae=!!x.aoMap,_e=!!x.lightMap,Jt=!!x.bumpMap&&x.wireframe===!1,Ne=!!x.normalMap,ln=!!x.displacementMap,In=!!x.emissiveMap,Ie=!!x.metalnessMap,Ye=!!x.roughnessMap,L=x.anisotropy>0,_n=x.clearcoat>0,fe=x.dispersion>0,w=x.retroreflectivity>0,_=x.iridescence>0,I=x.sheen>0,k=x.transmission>0,X=L&&!!x.anisotropyMap,st=_n&&!!x.clearcoatMap,at=_n&&!!x.clearcoatNormalMap,Z=_n&&!!x.clearcoatRoughnessMap,j=_&&!!x.iridescenceMap,ot=_&&!!x.iridescenceThicknessMap,At=I&&!!x.sheenColorMap,ft=I&&!!x.sheenRoughnessMap,lt=!!x.specularMap,wt=!!x.specularColorMap,Dt=!!x.specularIntensityMap,zt=k&&!!x.transmissionMap,N=k&&!!x.thicknessMap,ct=!!x.gradientMap,Q=!!x.alphaMap,ut=x.alphaTest>0,gt=!!x.alphaHash,nt=!!x.extensions,Ct=Fi;x.toneMapped&&(et===null||et.isXRRenderTarget===!0)&&(Ct=e.toneMapping);let Et={shaderID:K,shaderType:x.type,shaderName:x.name,vertexShader:Gt,fragmentShader:Vt,defines:x.defines,customVertexShaderID:re,customFragmentShaderID:Y,isRawShaderMaterial:x.isRawShaderMaterial===!0,glslVersion:x.glslVersion,precision:h,batching:xt,batchingColor:xt&&F._colorsTexture!==null,instancing:Pt,instancingColor:Pt&&F.instanceColor!==null,instancingMorph:Pt&&F.morphTexture!==null,outputColorSpace:et===null?e.outputColorSpace:et.isXRRenderTarget===!0?et.texture.colorSpace:jt.workingColorSpace,alphaToCoverage:!!x.alphaToCoverage,map:Wt,matcap:tn,envMap:qt,envMapMode:qt&&it.mapping,envMapCubeUVHeight:P,aoMap:ae,lightMap:_e,bumpMap:Jt,normalMap:Ne,displacementMap:ln,emissiveMap:In,normalMapObjectSpace:Ne&&x.normalMapType===yS,normalMapTangentSpace:Ne&&x.normalMapType===Wg,packedNormalMap:Ne&&x.normalMapType===Wg&&CR(x.normalMap.format),metalnessMap:Ie,roughnessMap:Ye,anisotropy:L,anisotropyMap:X,clearcoat:_n,clearcoatMap:st,clearcoatNormalMap:at,clearcoatRoughnessMap:Z,dispersion:fe,retroreflection:w,iridescence:_,iridescenceMap:j,iridescenceThicknessMap:ot,sheen:I,sheenColorMap:At,sheenRoughnessMap:ft,specularMap:lt,specularColorMap:wt,specularIntensityMap:Dt,transmission:k,transmissionMap:zt,thicknessMap:N,gradientMap:ct,opaque:x.transparent===!1&&x.blending===Lo&&x.alphaToCoverage===!1,alphaMap:Q,alphaTest:ut,alphaHash:gt,combine:x.combine,mapUv:Wt&&m(x.map.channel),aoMapUv:ae&&m(x.aoMap.channel),lightMapUv:_e&&m(x.lightMap.channel),bumpMapUv:Jt&&m(x.bumpMap.channel),normalMapUv:Ne&&m(x.normalMap.channel),displacementMapUv:ln&&m(x.displacementMap.channel),emissiveMapUv:In&&m(x.emissiveMap.channel),metalnessMapUv:Ie&&m(x.metalnessMap.channel),roughnessMapUv:Ye&&m(x.roughnessMap.channel),anisotropyMapUv:X&&m(x.anisotropyMap.channel),clearcoatMapUv:st&&m(x.clearcoatMap.channel),clearcoatNormalMapUv:at&&m(x.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Z&&m(x.clearcoatRoughnessMap.channel),iridescenceMapUv:j&&m(x.iridescenceMap.channel),iridescenceThicknessMapUv:ot&&m(x.iridescenceThicknessMap.channel),sheenColorMapUv:At&&m(x.sheenColorMap.channel),sheenRoughnessMapUv:ft&&m(x.sheenRoughnessMap.channel),specularMapUv:lt&&m(x.specularMap.channel),specularColorMapUv:wt&&m(x.specularColorMap.channel),specularIntensityMapUv:Dt&&m(x.specularIntensityMap.channel),transmissionMapUv:zt&&m(x.transmissionMap.channel),thicknessMapUv:N&&m(x.thicknessMap.channel),alphaMapUv:Q&&m(x.alphaMap.channel),vertexTangents:!!G.attributes.tangent&&(Ne||L),vertexNormals:!!G.attributes.normal,vertexColors:x.vertexColors,vertexAlphas:x.vertexColors===!0&&!!G.attributes.color&&G.attributes.color.itemSize===4,pointsUvs:F.isPoints===!0&&!!G.attributes.uv&&(Wt||Q),fog:!!U,useFog:x.fog===!0,fogExp2:!!U&&U.isFogExp2,flatShading:x.wireframe===!1&&(x.flatShading===!0||G.attributes.normal===void 0&&Ne===!1&&(x.isMeshLambertMaterial||x.isMeshPhongMaterial||x.isMeshStandardMaterial||x.isMeshPhysicalMaterial)),sizeAttenuation:x.sizeAttenuation===!0,logarithmicDepthBuffer:f,reversedDepthBuffer:bt,skinning:F.isSkinnedMesh===!0,hasPositionAttribute:G.attributes.position!==void 0,morphTargets:G.morphAttributes.position!==void 0,morphNormals:G.morphAttributes.normal!==void 0,morphColors:G.morphAttributes.color!==void 0,morphTargetsCount:ht,morphTextureStride:_t,numSunLights:A.sun.length,numDirLights:A.directional.length,numPointLights:A.point.length,numSpotLights:A.spot.length,numSpotLightMaps:A.spotLightMap.length,numRectAreaLights:A.rectArea.length,numHemiLights:A.hemi.length,numSunLightShadows:A.sunShadowMap.length,numDirLightShadows:A.directionalShadowMap.length,numPointLightShadows:A.pointShadowMap.length,numSpotLightShadows:A.spotShadowMap.length,numSpotLightShadowsWithMaps:A.numSpotLightShadowsWithMaps,numLightProbes:A.numLightProbes,numLightProbeGrids:V.length,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:x.dithering,shadowMapEnabled:e.shadowMap.enabled&&R.length>0,shadowMapType:e.shadowMap.type,toneMapping:Ct,decodeVideoTexture:Wt&&x.map.isVideoTexture===!0&&jt.getTransfer(x.map.colorSpace)===he,decodeVideoTextureEmissive:In&&x.emissiveMap.isVideoTexture===!0&&jt.getTransfer(x.emissiveMap.colorSpace)===he,premultipliedAlpha:x.premultipliedAlpha,doubleSided:x.side===Ai,flipSided:x.side===Un,useDepthPacking:x.depthPacking>=0,depthPacking:x.depthPacking||0,index0AttributeName:x.index0AttributeName,extensionClipCullDistance:nt&&x.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(nt&&x.extensions.multiDraw===!0||xt)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:x.customProgramCacheKey()};return Et.vertexUv1s=l.has(1),Et.vertexUv2s=l.has(2),Et.vertexUv3s=l.has(3),l.clear(),Et}function g(x){let A=[];if(x.shaderID?A.push(x.shaderID):(A.push(x.customVertexShaderID),A.push(x.customFragmentShaderID)),x.defines!==void 0)for(let R in x.defines)A.push(R),A.push(x.defines[R]);return x.isRawShaderMaterial===!1&&(p(A,x),y(A,x),A.push(e.outputColorSpace)),A.push(x.customProgramCacheKey),A.join()}function p(x,A){x.push(A.precision),x.push(A.outputColorSpace),x.push(A.envMapMode),x.push(A.envMapCubeUVHeight),x.push(A.mapUv),x.push(A.alphaMapUv),x.push(A.lightMapUv),x.push(A.aoMapUv),x.push(A.bumpMapUv),x.push(A.normalMapUv),x.push(A.displacementMapUv),x.push(A.emissiveMapUv),x.push(A.metalnessMapUv),x.push(A.roughnessMapUv),x.push(A.anisotropyMapUv),x.push(A.clearcoatMapUv),x.push(A.clearcoatNormalMapUv),x.push(A.clearcoatRoughnessMapUv),x.push(A.iridescenceMapUv),x.push(A.iridescenceThicknessMapUv),x.push(A.sheenColorMapUv),x.push(A.sheenRoughnessMapUv),x.push(A.specularMapUv),x.push(A.specularColorMapUv),x.push(A.specularIntensityMapUv),x.push(A.transmissionMapUv),x.push(A.thicknessMapUv),x.push(A.combine),x.push(A.fogExp2),x.push(A.sizeAttenuation),x.push(A.morphTargetsCount),x.push(A.morphAttributeCount),x.push(A.numSunLights),x.push(A.numDirLights),x.push(A.numPointLights),x.push(A.numSpotLights),x.push(A.numSpotLightMaps),x.push(A.numHemiLights),x.push(A.numRectAreaLights),x.push(A.numSunLightShadows),x.push(A.numDirLightShadows),x.push(A.numPointLightShadows),x.push(A.numSpotLightShadows),x.push(A.numSpotLightShadowsWithMaps),x.push(A.numLightProbes),x.push(A.shadowMapType),x.push(A.toneMapping),x.push(A.numClippingPlanes),x.push(A.numClipIntersection),x.push(A.depthPacking)}function y(x,A){r.disableAll(),A.instancing&&r.enable(0),A.instancingColor&&r.enable(1),A.instancingMorph&&r.enable(2),A.matcap&&r.enable(3),A.envMap&&r.enable(4),A.normalMapObjectSpace&&r.enable(5),A.normalMapTangentSpace&&r.enable(6),A.clearcoat&&r.enable(7),A.iridescence&&r.enable(8),A.alphaTest&&r.enable(9),A.vertexColors&&r.enable(10),A.vertexAlphas&&r.enable(11),A.vertexUv1s&&r.enable(12),A.vertexUv2s&&r.enable(13),A.vertexUv3s&&r.enable(14),A.vertexTangents&&r.enable(15),A.anisotropy&&r.enable(16),A.alphaHash&&r.enable(17),A.batching&&r.enable(18),A.dispersion&&r.enable(19),A.retroreflection&&r.enable(24),A.batchingColor&&r.enable(20),A.gradientMap&&r.enable(21),A.packedNormalMap&&r.enable(22),A.vertexNormals&&r.enable(23),x.push(r.mask),r.disableAll(),A.fog&&r.enable(0),A.useFog&&r.enable(1),A.flatShading&&r.enable(2),A.logarithmicDepthBuffer&&r.enable(3),A.reversedDepthBuffer&&r.enable(4),A.skinning&&r.enable(5),A.morphTargets&&r.enable(6),A.morphNormals&&r.enable(7),A.morphColors&&r.enable(8),A.premultipliedAlpha&&r.enable(9),A.shadowMapEnabled&&r.enable(10),A.doubleSided&&r.enable(11),A.flipSided&&r.enable(12),A.useDepthPacking&&r.enable(13),A.dithering&&r.enable(14),A.transmission&&r.enable(15),A.sheen&&r.enable(16),A.opaque&&r.enable(17),A.pointsUvs&&r.enable(18),A.decodeVideoTexture&&r.enable(19),A.decodeVideoTextureEmissive&&r.enable(20),A.alphaToCoverage&&r.enable(21),A.numLightProbeGrids>0&&r.enable(22),A.hasPositionAttribute&&r.enable(23),x.push(r.mask)}function S(x){let A=d[x.type],R;if(A){let O=os[A];R=NS.clone(O.uniforms)}else R=x.uniforms;return R}function v(x,A){let R=u.get(A);return R!==void 0?++R.usedTimes:(R=new AR(e,A,x,s),c.push(R),u.set(A,R)),R}function E(x){if(--x.usedTimes===0){let A=c.indexOf(x);c[A]=c[c.length-1],c.pop(),u.delete(x.cacheKey),x.destroy()}}function T(x){o.remove(x)}function C(){o.dispose()}return{getParameters:b,getProgramCacheKey:g,getUniforms:S,acquireProgram:v,releaseProgram:E,releaseShaderCache:T,programs:c,dispose:C}}function DR(){let e=new WeakMap;function t(r){return e.has(r)}function n(r){let o=e.get(r);return o===void 0&&(o={},e.set(r,o)),o}function i(r){e.delete(r)}function s(r,o,l){e.get(r)[o]=l}function a(){e=new WeakMap}return{has:t,get:n,remove:i,update:s,dispose:a}}function NR(e,t){return e.groupOrder!==t.groupOrder?e.groupOrder-t.groupOrder:e.renderOrder!==t.renderOrder?e.renderOrder-t.renderOrder:e.material.id!==t.material.id?e.material.id-t.material.id:e.materialVariant!==t.materialVariant?e.materialVariant-t.materialVariant:e.z!==t.z?e.z-t.z:e.id-t.id}function QS(e,t){return e.groupOrder!==t.groupOrder?e.groupOrder-t.groupOrder:e.renderOrder!==t.renderOrder?e.renderOrder-t.renderOrder:e.z!==t.z?t.z-e.z:e.id-t.id}function jS(){let e=[],t=0,n=[],i=[],s=[];function a(){t=0,n.length=0,i.length=0,s.length=0}function r(h){let d=0;return h.isInstancedMesh&&(d+=2),h.isSkinnedMesh&&(d+=1),d}function o(h,d,m,b,g,p){let y=e[t];return y===void 0?(y={id:h.id,object:h,geometry:d,material:m,materialVariant:r(h),groupOrder:b,renderOrder:h.renderOrder,z:g,group:p},e[t]=y):(y.id=h.id,y.object=h,y.geometry=d,y.material=m,y.materialVariant=r(h),y.groupOrder=b,y.renderOrder=h.renderOrder,y.z=g,y.group=p),t++,y}function l(h,d,m,b,g,p,y){y.reversedDepth===!0&&(g=-g);let S=o(h,d,m,b,g,p);m.transmission>0?i.push(S):m.transparent===!0?s.push(S):n.push(S)}function c(h,d,m,b,g,p){let y=o(h,d,m,b,g,p);m.transmission>0?i.unshift(y):m.transparent===!0?s.unshift(y):n.unshift(y)}function u(h,d){n.length>1&&n.sort(h||NR),i.length>1&&i.sort(d||QS),s.length>1&&s.sort(d||QS)}function f(){for(let h=t,d=e.length;h<d;h++){let m=e[h];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:n,transmissive:i,transparent:s,init:a,push:l,unshift:c,finish:f,sort:u}}function LR(){let e=new WeakMap;function t(i,s){let a=e.get(i),r;return a===void 0?(r=new jS,e.set(i,[r])):s>=a.length?(r=new jS,a.push(r)):r=a[s],r}function n(){e=new WeakMap}return{get:t,dispose:n}}function UR(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case"SunLight":case"DirectionalLight":n={direction:new H,color:new se};break;case"SpotLight":n={position:new H,direction:new H,color:new se,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":n={position:new H,color:new se,distance:0,decay:0};break;case"HemisphereLight":n={direction:new H,skyColor:new se,groundColor:new se};break;case"RectAreaLight":n={color:new se,position:new H,halfWidth:new H,halfHeight:new H};break}return e[t.id]=n,n}}}function OR(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case"SunLight":case"DirectionalLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ie};break;case"SpotLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ie};break;case"PointLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ie,shadowCameraNear:1,shadowCameraFar:1e3};break}return e[t.id]=n,n}}}var IR=0;function PR(e,t){return(t.castShadow?2:0)-(e.castShadow?2:0)+(t.map?1:0)-(e.map?1:0)}function BR(e){let t=new UR,n=OR(),i={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new H);let s=new H,a=new We,r=new We;function o(c){let u=0,f=0,h=0;for(let F=0;F<9;F++)i.probe[F].set(0,0,0);let d=0,m=0,b=0,g=0,p=0,y=0,S=0,v=0,E=0,T=0,C=0,x=0,A=0,R=0;c.sort(PR);for(let F=0,V=c.length;F<V;F++){let U=c[F],G=U.color,J=U.intensity,q=U.distance,it=null;if(U.shadow&&U.shadow.map&&(U.shadow.map.texture.format===Ua?it=U.shadow.map.texture:it=U.shadow.map.depthTexture||U.shadow.map.texture),U.isAmbientLight)u+=G.r*J,f+=G.g*J,h+=G.b*J;else if(U.isLightProbe){for(let P=0;P<9;P++)i.probe[P].addScaledVector(U.sh.coefficients[P],J);R++}else if(U.isSunLight){let P=t.get(U);if(P.color.copy(U.color).multiplyScalar(U.intensity),U.castShadow){let K=U.shadow,$=n.get(U);$.shadowIntensity=K.intensity,$.shadowBias=K.bias,$.shadowNormalBias=K.normalBias,$.shadowRadius=K.radius,$.shadowMapSize.copy(K.mapSize).multiply(K.getFrameExtents()),i.sunShadow[m]=$,i.sunShadowMap[m]=it;let ht=K.getViewportCount();for(let _t=0;_t<ht;_t++)i.sunShadowMatrix[b+_t]=K.getMatrix(_t),i.sunShadowCascade[b+_t]=K._cascadeData[_t];b+=ht,m++}i.sun[d]=P,d++}else if(U.isDirectionalLight){let P=t.get(U);if(P.color.copy(U.color).multiplyScalar(U.intensity),U.castShadow){let K=U.shadow,$=n.get(U);$.shadowIntensity=K.intensity,$.shadowBias=K.bias,$.shadowNormalBias=K.normalBias,$.shadowRadius=K.radius,$.shadowMapSize=K.mapSize,i.directionalShadow[g]=$,i.directionalShadowMap[g]=it,i.directionalShadowMatrix[g]=U.shadow.matrix,E++}i.directional[g]=P,g++}else if(U.isSpotLight){let P=t.get(U);P.position.setFromMatrixPosition(U.matrixWorld),P.color.copy(G).multiplyScalar(J),P.distance=q,P.coneCos=Math.cos(U.angle),P.penumbraCos=Math.cos(U.angle*(1-U.penumbra)),P.decay=U.decay,i.spot[y]=P;let K=U.shadow;if(U.map&&(i.spotLightMap[x]=U.map,x++,K.updateMatrices(U),U.castShadow&&A++),i.spotLightMatrix[y]=K.matrix,U.castShadow){let $=n.get(U);$.shadowIntensity=K.intensity,$.shadowBias=K.bias,$.shadowNormalBias=K.normalBias,$.shadowRadius=K.radius,$.shadowMapSize=K.mapSize,i.spotShadow[y]=$,i.spotShadowMap[y]=it,C++}y++}else if(U.isRectAreaLight){let P=t.get(U);P.color.copy(G).multiplyScalar(J),P.halfWidth.set(U.width*.5,0,0),P.halfHeight.set(0,U.height*.5,0),i.rectArea[S]=P,S++}else if(U.isPointLight){let P=t.get(U);if(P.color.copy(U.color).multiplyScalar(U.intensity),P.distance=U.distance,P.decay=U.decay,U.castShadow){let K=U.shadow,$=n.get(U);$.shadowIntensity=K.intensity,$.shadowBias=K.bias,$.shadowNormalBias=K.normalBias,$.shadowRadius=K.radius,$.shadowMapSize=K.mapSize,$.shadowCameraNear=K.camera.near,$.shadowCameraFar=K.camera.far,i.pointShadow[p]=$,i.pointShadowMap[p]=it,i.pointShadowMatrix[p]=U.shadow.matrix,T++}i.point[p]=P,p++}else if(U.isHemisphereLight){let P=t.get(U);P.skyColor.copy(U.color).multiplyScalar(J),P.groundColor.copy(U.groundColor).multiplyScalar(J),i.hemi[v]=P,v++}}S>0&&(e.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=dt.LTC_FLOAT_1,i.rectAreaLTC2=dt.LTC_FLOAT_2):(i.rectAreaLTC1=dt.LTC_HALF_1,i.rectAreaLTC2=dt.LTC_HALF_2)),i.ambient[0]=u,i.ambient[1]=f,i.ambient[2]=h;let O=i.hash;(O.sunLength!==d||O.directionalLength!==g||O.pointLength!==p||O.spotLength!==y||O.rectAreaLength!==S||O.hemiLength!==v||O.numSunShadows!==m||O.numDirectionalShadows!==E||O.numPointShadows!==T||O.numSpotShadows!==C||O.numSpotMaps!==x||O.numLightProbes!==R)&&(i.sun.length=d,i.directional.length=g,i.spot.length=y,i.rectArea.length=S,i.point.length=p,i.hemi.length=v,i.sunShadow.length=m,i.sunShadowMap.length=m,i.sunShadowMatrix.length=b,i.sunShadowCascade.length=b,i.directionalShadow.length=E,i.directionalShadowMap.length=E,i.directionalShadowMatrix.length=E,i.pointShadow.length=T,i.pointShadowMap.length=T,i.pointShadowMatrix.length=T,i.spotShadow.length=C,i.spotShadowMap.length=C,i.spotLightMatrix.length=C+x-A,i.spotLightMap.length=x,i.numSpotLightShadowsWithMaps=A,i.numLightProbes=R,O.sunLength=d,O.directionalLength=g,O.pointLength=p,O.spotLength=y,O.rectAreaLength=S,O.hemiLength=v,O.numSunShadows=m,O.numDirectionalShadows=E,O.numPointShadows=T,O.numSpotShadows=C,O.numSpotMaps=x,O.numLightProbes=R,i.version=IR++)}function l(c,u){let f=0,h=0,d=0,m=0,b=0,g=0,p=u.matrixWorldInverse;for(let y=0,S=c.length;y<S;y++){let v=c[y];if(v.isSunLight){let E=i.sun[f];E.direction.setFromMatrixPosition(v.matrixWorld),E.direction.transformDirection(p),f++}else if(v.isDirectionalLight){let E=i.directional[h];E.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),E.direction.sub(s),E.direction.transformDirection(p),h++}else if(v.isSpotLight){let E=i.spot[m];E.position.setFromMatrixPosition(v.matrixWorld),E.position.applyMatrix4(p),E.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),E.direction.sub(s),E.direction.transformDirection(p),m++}else if(v.isRectAreaLight){let E=i.rectArea[b];E.position.setFromMatrixPosition(v.matrixWorld),E.position.applyMatrix4(p),r.identity(),a.copy(v.matrixWorld),a.premultiply(p),r.extractRotation(a),E.halfWidth.set(v.width*.5,0,0),E.halfHeight.set(0,v.height*.5,0),E.halfWidth.applyMatrix4(r),E.halfHeight.applyMatrix4(r),b++}else if(v.isPointLight){let E=i.point[d];E.position.setFromMatrixPosition(v.matrixWorld),E.position.applyMatrix4(p),d++}else if(v.isHemisphereLight){let E=i.hemi[g];E.direction.setFromMatrixPosition(v.matrixWorld),E.direction.transformDirection(p),g++}}}return{setup:o,setupView:l,state:i}}function $S(e){let t=new BR(e),n=[],i=[],s=[];function a(h){f.camera=h,n.length=0,i.length=0,s.length=0}function r(h){n.push(h)}function o(h){i.push(h)}function l(h){s.push(h)}function c(){t.setup(n)}function u(h){t.setupView(n,h)}let f={lightsArray:n,shadowsArray:i,lightProbeGridArray:s,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:a,state:f,setupLights:c,setupLightsView:u,pushLight:r,pushShadow:o,pushLightProbeGrid:l}}function zR(e){let t=new WeakMap;function n(s,a=0){let r=t.get(s),o;return r===void 0?(o=new $S(e),t.set(s,[o])):a>=r.length?(o=new $S(e),r.push(o)):o=r[a],o}function i(){t=new WeakMap}return{get:n,dispose:i}}var FR=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,kR=`uniform sampler2D shadow_pass;
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
}`,HR=[new H(1,0,0),new H(-1,0,0),new H(0,1,0),new H(0,-1,0),new H(0,0,1),new H(0,0,-1)],VR=[new H(0,-1,0),new H(0,-1,0),new H(0,0,1),new H(0,0,-1),new H(0,-1,0),new H(0,-1,0)],t1=new We,_c=new H,n0=new H;function GR(e,t,n){let i=new ic,s=new ie,a=new ie,r=new Pe,o=new Gh,l=new Wh,c={},u=n.maxTextureSize,f={[Ra]:Un,[Un]:Ra,[Ai]:Ai},h=new ri({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ie},radius:{value:4}},vertexShader:FR,fragmentShader:kR}),d=h.clone();d.defines.HORIZONTAL_PASS=1;let m=new qn;m.setAttribute("position",new Mi(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let b=new an(m,h),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=cc;let p=this.type;this.render=function(T,C,x){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||T.length===0)return;this.type===Zb&&(Nt("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=cc);let A=e.getRenderTarget(),R=e.getActiveCubeFace(),O=e.getActiveMipmapLevel(),F=e.state;F.setBlending(as),F.buffers.depth.getReversed()===!0?F.buffers.color.setClear(0,0,0,0):F.buffers.color.setClear(1,1,1,1),F.buffers.depth.setTest(!0),F.setScissorTest(!1);let V=p!==this.type;V&&C.traverse(function(U){U.material&&(Array.isArray(U.material)?U.material.forEach(G=>G.needsUpdate=!0):U.material.needsUpdate=!0)});for(let U=0,G=T.length;U<G;U++){let J=T[U],q=J.shadow;if(q===void 0){Nt("WebGLShadowMap:",J,"has no shadow.");continue}if(q.autoUpdate===!1&&q.needsUpdate===!1)continue;s.copy(q.mapSize);let it=q.getFrameExtents();s.multiply(it),a.copy(q.mapSize),(s.x>u||s.y>u)&&(s.x>u&&(a.x=Math.floor(u/it.x),s.x=a.x*it.x,q.mapSize.x=a.x),s.y>u&&(a.y=Math.floor(u/it.y),s.y=a.y*it.y,q.mapSize.y=a.y));let P=e.state.buffers.depth.getReversed();if(q.camera._reversedDepth=P,q.map===null||V===!0){if(q.map!==null&&(q.map.depthTexture!==null&&(q.map.depthTexture.dispose(),q.map.depthTexture=null),q.map.dispose()),this.type===No){if(J.isPointLight){Nt("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}q.map=new Xn(s.x,s.y,{format:Ua,type:Vi,minFilter:vn,magFilter:vn,generateMipmaps:!1}),q.map.texture.name=J.name+".shadowMap",q.map.depthTexture=new Ea(s.x,s.y,Hi),q.map.depthTexture.name=J.name+".shadowMapDepth",q.map.depthTexture.format=ns,q.map.depthTexture.compareFunction=null,q.map.depthTexture.minFilter=Xe,q.map.depthTexture.magFilter=Xe}else J.isPointLight?(q.map=new Zf(s.x),q.map.depthTexture=new Hh(s.x,ki)):(q.map=new Xn(s.x,s.y),q.map.depthTexture=new Ea(s.x,s.y,ki)),q.map.depthTexture.name=J.name+".shadowMap",q.map.depthTexture.format=ns,this.type===cc?(q.map.depthTexture.compareFunction=P?Wf:Gf,q.map.depthTexture.minFilter=vn,q.map.depthTexture.magFilter=vn):(q.map.depthTexture.compareFunction=null,q.map.depthTexture.minFilter=Xe,q.map.depthTexture.magFilter=Xe);q.camera.updateProjectionMatrix()}q.map.isWebGLCubeRenderTarget!==!0&&(q.map.width!==s.x||q.map.height!==s.y)&&q.map.setSize(s.x,s.y);let K=q.map.isWebGLCubeRenderTarget?6:q.getViewportCount();J.isPointLight!==!0&&q.updateMatrices(J,x);for(let $=0;$<K;$++){let ht=q.getCamera($);if(J.isPointLight){let _t=q.camera,Gt=q.matrix,Vt=J.distance||_t.far;Vt!==_t.far&&(_t.far=Vt,_t.updateProjectionMatrix()),_c.setFromMatrixPosition(J.matrixWorld),_t.position.copy(_c),n0.copy(_t.position),n0.add(HR[$]),_t.up.copy(VR[$]),_t.lookAt(n0),_t.updateMatrixWorld(),Gt.makeTranslation(-_c.x,-_c.y,-_c.z),t1.multiplyMatrices(_t.projectionMatrix,_t.matrixWorldInverse),q._frustum.setFromProjectionMatrix(t1,_t.coordinateSystem,_t.reversedDepth)}if(q.map.isWebGLCubeRenderTarget)e.setRenderTarget(q.map,$),e.clear();else{$===0&&(e.setRenderTarget(q.map),e.clear());let _t=q.getViewport($);r.set(a.x*_t.x,a.y*_t.y,a.x*_t.z,a.y*_t.w),F.viewport(r)}i=q.getFrustum($),v(C,x,ht,J,this.type)}q.isPointLightShadow!==!0&&this.type===No&&y(q,x),q.needsUpdate=!1}p=this.type,g.needsUpdate=!1,e.setRenderTarget(A,R,O)};function y(T,C){let x=t.update(b);h.defines.VSM_SAMPLES!==T.blurSamples&&(h.defines.VSM_SAMPLES=T.blurSamples,d.defines.VSM_SAMPLES=T.blurSamples,h.needsUpdate=!0,d.needsUpdate=!0),T.mapPass===null?T.mapPass=new Xn(s.x,s.y,{format:Ua,type:Vi}):(T.mapPass.width!==T.map.width||T.mapPass.height!==T.map.height)&&T.mapPass.setSize(T.map.width,T.map.height),h.uniforms.shadow_pass.value=T.map.depthTexture,h.uniforms.resolution.value.set(T.map.width,T.map.height),h.uniforms.radius.value=T.radius,e.setRenderTarget(T.mapPass),e.clear(),e.renderBufferDirect(C,null,x,h,b,null),d.uniforms.shadow_pass.value=T.mapPass.texture,d.uniforms.resolution.value.set(T.map.width,T.map.height),d.uniforms.radius.value=T.radius,e.setRenderTarget(T.map),e.clear(),e.renderBufferDirect(C,null,x,d,b,null)}function S(T,C,x,A){let R=null,O=x.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(O!==void 0)R=O;else if(R=x.isPointLight===!0?l:o,e.localClippingEnabled&&C.clipShadows===!0&&Array.isArray(C.clippingPlanes)&&C.clippingPlanes.length!==0||C.displacementMap&&C.displacementScale!==0||C.alphaMap&&C.alphaTest>0||C.map&&C.alphaTest>0||C.alphaToCoverage===!0){let F=R.uuid,V=C.uuid,U=c[F];U===void 0&&(U={},c[F]=U);let G=U[V];G===void 0&&(G=R.clone(),U[V]=G,C.addEventListener("dispose",E)),R=G}if(R.visible=C.visible,R.wireframe=C.wireframe,A===No?R.side=C.shadowSide!==null?C.shadowSide:C.side:R.side=C.shadowSide!==null?C.shadowSide:f[C.side],R.alphaMap=C.alphaMap,R.alphaTest=C.alphaToCoverage===!0?.5:C.alphaTest,R.map=C.map,R.clipShadows=C.clipShadows,R.clippingPlanes=C.clippingPlanes,R.clipIntersection=C.clipIntersection,R.displacementMap=C.displacementMap,R.displacementScale=C.displacementScale,R.displacementBias=C.displacementBias,R.wireframeLinewidth=C.wireframeLinewidth,R.linewidth=C.linewidth,x.isPointLight===!0&&R.isMeshDistanceMaterial===!0){let F=e.properties.get(R);F.light=x}return R}function v(T,C,x,A,R){if(T.visible===!1)return;if(T.layers.test(C.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&R===No)&&(!T.frustumCulled||T.intersectsFrustum(i))){T.modelViewMatrix.multiplyMatrices(x.matrixWorldInverse,T.matrixWorld);let V=t.update(T),U=T.material;if(Array.isArray(U)){let G=V.groups;for(let J=0,q=G.length;J<q;J++){let it=G[J],P=U[it.materialIndex];if(P&&P.visible){let K=S(T,P,A,R);T.onBeforeShadow(e,T,C,x,V,K,it),e.renderBufferDirect(x,null,V,K,T,it),T.onAfterShadow(e,T,C,x,V,K,it)}}}else if(U.visible){let G=S(T,U,A,R);T.onBeforeShadow(e,T,C,x,V,G,null),e.renderBufferDirect(x,null,V,G,T,null),T.onAfterShadow(e,T,C,x,V,G,null)}}let F=T.children;for(let V=0,U=F.length;V<U;V++)v(F[V],C,x,A,R)}function E(T){T.target.removeEventListener("dispose",E);for(let x in c){let A=c[x],R=T.target.uuid;R in A&&(A[R].dispose(),delete A[R])}}}function WR(e,t){function n(){let N=!1,ct=new Pe,Q=null,ut=new Pe(0,0,0,0);return{setMask:function(gt){Q!==gt&&!N&&(e.colorMask(gt,gt,gt,gt),Q=gt)},setLocked:function(gt){N=gt},setClear:function(gt,nt,Ct,Et,be){be===!0&&(gt*=Et,nt*=Et,Ct*=Et),ct.set(gt,nt,Ct,Et),ut.equals(ct)===!1&&(e.clearColor(gt,nt,Ct,Et),ut.copy(ct))},reset:function(){N=!1,Q=null,ut.set(-1,0,0,0)}}}function i(){let N=!1,ct=!1,Q=null,ut=null,gt=null;return{setReversed:function(nt){if(ct!==nt){let Ct=t.get("EXT_clip_control");nt?Ct.clipControlEXT(Ct.LOWER_LEFT_EXT,Ct.ZERO_TO_ONE_EXT):Ct.clipControlEXT(Ct.LOWER_LEFT_EXT,Ct.NEGATIVE_ONE_TO_ONE_EXT),ct=nt;let Et=gt;gt=null,this.setClear(Et)}},getReversed:function(){return ct},setTest:function(nt){nt?et(e.DEPTH_TEST):bt(e.DEPTH_TEST)},setMask:function(nt){Q!==nt&&!N&&(e.depthMask(nt),Q=nt)},setFunc:function(nt){if(ct&&(nt=RS[nt]),ut!==nt){switch(nt){case Th:e.depthFunc(e.NEVER);break;case Ah:e.depthFunc(e.ALWAYS);break;case wh:e.depthFunc(e.LESS);break;case To:e.depthFunc(e.LEQUAL);break;case Ch:e.depthFunc(e.EQUAL);break;case Rh:e.depthFunc(e.GEQUAL);break;case Dh:e.depthFunc(e.GREATER);break;case Nh:e.depthFunc(e.NOTEQUAL);break;default:e.depthFunc(e.LEQUAL)}ut=nt}},setLocked:function(nt){N=nt},setClear:function(nt){gt!==nt&&(gt=nt,ct&&(nt=1-nt),e.clearDepth(nt))},reset:function(){N=!1,Q=null,ut=null,gt=null,ct=!1}}}function s(){let N=!1,ct=null,Q=null,ut=null,gt=null,nt=null,Ct=null,Et=null,be=null;return{setTest:function(ce){N||(ce?et(e.STENCIL_TEST):bt(e.STENCIL_TEST))},setMask:function(ce){ct!==ce&&!N&&(e.stencilMask(ce),ct=ce)},setFunc:function(ce,Ci,Gi){(Q!==ce||ut!==Ci||gt!==Gi)&&(e.stencilFunc(ce,Ci,Gi),Q=ce,ut=Ci,gt=Gi)},setOp:function(ce,Ci,Gi){(nt!==ce||Ct!==Ci||Et!==Gi)&&(e.stencilOp(ce,Ci,Gi),nt=ce,Ct=Ci,Et=Gi)},setLocked:function(ce){N=ce},setClear:function(ce){be!==ce&&(e.clearStencil(ce),be=ce)},reset:function(){N=!1,ct=null,Q=null,ut=null,gt=null,nt=null,Ct=null,Et=null,be=null}}}let a=new n,r=new i,o=new s,l=new WeakMap,c=new WeakMap,u={},f={},h={},d=new WeakMap,m=[],b=null,g=!1,p=null,y=null,S=null,v=null,E=null,T=null,C=null,x=new se(0,0,0),A=0,R=!1,O=null,F=null,V=null,U=null,G=null,J=e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS),q=!1,it=0,P=e.getParameter(e.VERSION);P.indexOf("WebGL")!==-1?(it=parseFloat(/^WebGL (\d)/.exec(P)[1]),q=it>=1):P.indexOf("OpenGL ES")!==-1&&(it=parseFloat(/^OpenGL ES (\d)/.exec(P)[1]),q=it>=2);let K=null,$={},ht=e.getParameter(e.SCISSOR_BOX),_t=e.getParameter(e.VIEWPORT),Gt=new Pe().fromArray(ht),Vt=new Pe().fromArray(_t);function re(N,ct,Q,ut){let gt=new Uint8Array(4),nt=e.createTexture();e.bindTexture(N,nt),e.texParameteri(N,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(N,e.TEXTURE_MAG_FILTER,e.NEAREST);for(let Ct=0;Ct<Q;Ct++)N===e.TEXTURE_3D||N===e.TEXTURE_2D_ARRAY?e.texImage3D(ct,0,e.RGBA,1,1,ut,0,e.RGBA,e.UNSIGNED_BYTE,gt):e.texImage2D(ct+Ct,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,gt);return nt}let Y={};Y[e.TEXTURE_2D]=re(e.TEXTURE_2D,e.TEXTURE_2D,1),Y[e.TEXTURE_CUBE_MAP]=re(e.TEXTURE_CUBE_MAP,e.TEXTURE_CUBE_MAP_POSITIVE_X,6),Y[e.TEXTURE_2D_ARRAY]=re(e.TEXTURE_2D_ARRAY,e.TEXTURE_2D_ARRAY,1,1),Y[e.TEXTURE_3D]=re(e.TEXTURE_3D,e.TEXTURE_3D,1,1),a.setClear(0,0,0,1),r.setClear(1),o.setClear(0),et(e.DEPTH_TEST),r.setFunc(To),Jt(!1),Ne(Sg),et(e.CULL_FACE),ae(as);function et(N){u[N]!==!0&&(e.enable(N),u[N]=!0)}function bt(N){u[N]!==!1&&(e.disable(N),u[N]=!1)}function Pt(N,ct){return h[N]!==ct?(e.bindFramebuffer(N,ct),h[N]=ct,N===e.DRAW_FRAMEBUFFER&&(h[e.FRAMEBUFFER]=ct),N===e.FRAMEBUFFER&&(h[e.DRAW_FRAMEBUFFER]=ct),!0):!1}function xt(N,ct){let Q=m,ut=!1;if(N){Q=d.get(ct),Q===void 0&&(Q=[],d.set(ct,Q));let gt=N.textures;if(Q.length!==gt.length||Q[0]!==e.COLOR_ATTACHMENT0){for(let nt=0,Ct=gt.length;nt<Ct;nt++)Q[nt]=e.COLOR_ATTACHMENT0+nt;Q.length=gt.length,ut=!0}}else Q[0]!==e.BACK&&(Q[0]=e.BACK,ut=!0);ut&&e.drawBuffers(Q)}function Wt(N){return b!==N?(e.useProgram(N),b=N,!0):!1}let tn={[hr]:e.FUNC_ADD,[Jb]:e.FUNC_SUBTRACT,[Qb]:e.FUNC_REVERSE_SUBTRACT};tn[jb]=e.MIN,tn[$b]=e.MAX;let qt={[tS]:e.ZERO,[eS]:e.ONE,[nS]:e.SRC_COLOR,[Ag]:e.SRC_ALPHA,[lS]:e.SRC_ALPHA_SATURATE,[rS]:e.DST_COLOR,[sS]:e.DST_ALPHA,[iS]:e.ONE_MINUS_SRC_COLOR,[wg]:e.ONE_MINUS_SRC_ALPHA,[oS]:e.ONE_MINUS_DST_COLOR,[aS]:e.ONE_MINUS_DST_ALPHA,[cS]:e.CONSTANT_COLOR,[uS]:e.ONE_MINUS_CONSTANT_COLOR,[hS]:e.CONSTANT_ALPHA,[fS]:e.ONE_MINUS_CONSTANT_ALPHA};function ae(N,ct,Q,ut,gt,nt,Ct,Et,be,ce){if(N===as){g===!0&&(bt(e.BLEND),g=!1);return}if(g===!1&&(et(e.BLEND),g=!0),N!==Kb){if(N!==p||ce!==R){if((y!==hr||E!==hr)&&(e.blendEquation(e.FUNC_ADD),y=hr,E=hr),ce)switch(N){case Lo:e.blendFuncSeparate(e.ONE,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case Mg:e.blendFunc(e.ONE,e.ONE);break;case Eg:e.blendFuncSeparate(e.ZERO,e.ONE_MINUS_SRC_COLOR,e.ZERO,e.ONE);break;case Tg:e.blendFuncSeparate(e.DST_COLOR,e.ONE_MINUS_SRC_ALPHA,e.ZERO,e.ONE);break;default:Ot("WebGLState: Invalid blending: ",N);break}else switch(N){case Lo:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case Mg:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE,e.ONE,e.ONE);break;case Eg:Ot("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Tg:Ot("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Ot("WebGLState: Invalid blending: ",N);break}S=null,v=null,T=null,C=null,x.set(0,0,0),A=0,p=N,R=ce}return}gt=gt||ct,nt=nt||Q,Ct=Ct||ut,(ct!==y||gt!==E)&&(e.blendEquationSeparate(tn[ct],tn[gt]),y=ct,E=gt),(Q!==S||ut!==v||nt!==T||Ct!==C)&&(e.blendFuncSeparate(qt[Q],qt[ut],qt[nt],qt[Ct]),S=Q,v=ut,T=nt,C=Ct),(Et.equals(x)===!1||be!==A)&&(e.blendColor(Et.r,Et.g,Et.b,be),x.copy(Et),A=be),p=N,R=!1}function _e(N,ct){N.side===Ai?bt(e.CULL_FACE):et(e.CULL_FACE);let Q=N.side===Un;ct&&(Q=!Q),Jt(Q),N.blending===Lo&&N.transparent===!1?ae(as):ae(N.blending,N.blendEquation,N.blendSrc,N.blendDst,N.blendEquationAlpha,N.blendSrcAlpha,N.blendDstAlpha,N.blendColor,N.blendAlpha,N.premultipliedAlpha),r.setFunc(N.depthFunc),r.setTest(N.depthTest),r.setMask(N.depthWrite),a.setMask(N.colorWrite);let ut=N.stencilWrite;o.setTest(ut),ut&&(o.setMask(N.stencilWriteMask),o.setFunc(N.stencilFunc,N.stencilRef,N.stencilFuncMask),o.setOp(N.stencilFail,N.stencilZFail,N.stencilZPass)),In(N.polygonOffset,N.polygonOffsetFactor,N.polygonOffsetUnits),N.alphaToCoverage===!0?et(e.SAMPLE_ALPHA_TO_COVERAGE):bt(e.SAMPLE_ALPHA_TO_COVERAGE)}function Jt(N){O!==N&&(N?e.frontFace(e.CW):e.frontFace(e.CCW),O=N)}function Ne(N){N!==qb?(et(e.CULL_FACE),N!==F&&(N===Sg?e.cullFace(e.BACK):N===Yb?e.cullFace(e.FRONT):e.cullFace(e.FRONT_AND_BACK))):bt(e.CULL_FACE),F=N}function ln(N){N!==V&&(q&&e.lineWidth(N),V=N)}function In(N,ct,Q){N?(et(e.POLYGON_OFFSET_FILL),(U!==ct||G!==Q)&&(U=ct,G=Q,r.getReversed()&&(ct=-ct),e.polygonOffset(ct,Q))):bt(e.POLYGON_OFFSET_FILL)}function Ie(N){N?et(e.SCISSOR_TEST):bt(e.SCISSOR_TEST)}function Ye(N){N===void 0&&(N=e.TEXTURE0+J-1),K!==N&&(e.activeTexture(N),K=N)}function L(N,ct,Q){Q===void 0&&(K===null?Q=e.TEXTURE0+J-1:Q=K);let ut=$[Q];ut===void 0&&(ut={type:void 0,texture:void 0},$[Q]=ut),(ut.type!==N||ut.texture!==ct)&&(K!==Q&&(e.activeTexture(Q),K=Q),e.bindTexture(N,ct||Y[N]),ut.type=N,ut.texture=ct)}function _n(){let N=$[K];N!==void 0&&N.type!==void 0&&(e.bindTexture(N.type,null),N.type=void 0,N.texture=void 0)}function fe(){try{e.compressedTexImage2D(...arguments)}catch(N){Ot("WebGLState:",N)}}function w(){try{e.compressedTexImage3D(...arguments)}catch(N){Ot("WebGLState:",N)}}function _(){try{e.texSubImage2D(...arguments)}catch(N){Ot("WebGLState:",N)}}function I(){try{e.texSubImage3D(...arguments)}catch(N){Ot("WebGLState:",N)}}function k(){try{e.compressedTexSubImage2D(...arguments)}catch(N){Ot("WebGLState:",N)}}function X(){try{e.compressedTexSubImage3D(...arguments)}catch(N){Ot("WebGLState:",N)}}function st(){try{e.texStorage2D(...arguments)}catch(N){Ot("WebGLState:",N)}}function at(){try{e.texStorage3D(...arguments)}catch(N){Ot("WebGLState:",N)}}function Z(){try{e.texImage2D(...arguments)}catch(N){Ot("WebGLState:",N)}}function j(){try{e.texImage3D(...arguments)}catch(N){Ot("WebGLState:",N)}}function ot(N){return f[N]!==void 0?f[N]:e.getParameter(N)}function At(N,ct){f[N]!==ct&&(e.pixelStorei(N,ct),f[N]=ct)}function ft(N){Gt.equals(N)===!1&&(e.scissor(N.x,N.y,N.z,N.w),Gt.copy(N))}function lt(N){Vt.equals(N)===!1&&(e.viewport(N.x,N.y,N.z,N.w),Vt.copy(N))}function wt(N,ct){let Q=c.get(ct);Q===void 0&&(Q=new WeakMap,c.set(ct,Q));let ut=Q.get(N);ut===void 0&&(ut=e.getUniformBlockIndex(ct,N.name),Q.set(N,ut))}function Dt(N,ct){let ut=c.get(ct).get(N);l.get(ct)!==ut&&(e.uniformBlockBinding(ct,ut,N.__bindingPointIndex),l.set(ct,ut))}function zt(){e.disable(e.BLEND),e.disable(e.CULL_FACE),e.disable(e.DEPTH_TEST),e.disable(e.POLYGON_OFFSET_FILL),e.disable(e.SCISSOR_TEST),e.disable(e.STENCIL_TEST),e.disable(e.SAMPLE_ALPHA_TO_COVERAGE),e.blendEquation(e.FUNC_ADD),e.blendFunc(e.ONE,e.ZERO),e.blendFuncSeparate(e.ONE,e.ZERO,e.ONE,e.ZERO),e.blendColor(0,0,0,0),e.colorMask(!0,!0,!0,!0),e.clearColor(0,0,0,0),e.depthMask(!0),e.depthFunc(e.LESS),r.setReversed(!1),e.clearDepth(1),e.stencilMask(4294967295),e.stencilFunc(e.ALWAYS,0,4294967295),e.stencilOp(e.KEEP,e.KEEP,e.KEEP),e.clearStencil(0),e.cullFace(e.BACK),e.frontFace(e.CCW),e.polygonOffset(0,0),e.activeTexture(e.TEXTURE0),e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),e.bindFramebuffer(e.READ_FRAMEBUFFER,null),e.useProgram(null),e.lineWidth(1),e.scissor(0,0,e.canvas.width,e.canvas.height),e.viewport(0,0,e.canvas.width,e.canvas.height),e.pixelStorei(e.PACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!1),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,e.BROWSER_DEFAULT_WEBGL),e.pixelStorei(e.PACK_ROW_LENGTH,0),e.pixelStorei(e.PACK_SKIP_PIXELS,0),e.pixelStorei(e.PACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_ROW_LENGTH,0),e.pixelStorei(e.UNPACK_IMAGE_HEIGHT,0),e.pixelStorei(e.UNPACK_SKIP_PIXELS,0),e.pixelStorei(e.UNPACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_SKIP_IMAGES,0),u={},f={},K=null,$={},h={},d=new WeakMap,m=[],b=null,g=!1,p=null,y=null,S=null,v=null,E=null,T=null,C=null,x=new se(0,0,0),A=0,R=!1,O=null,F=null,V=null,U=null,G=null,Gt.set(0,0,e.canvas.width,e.canvas.height),Vt.set(0,0,e.canvas.width,e.canvas.height),a.reset(),r.reset(),o.reset()}return{buffers:{color:a,depth:r,stencil:o},enable:et,disable:bt,bindFramebuffer:Pt,drawBuffers:xt,useProgram:Wt,setBlending:ae,setMaterial:_e,setFlipSided:Jt,setCullFace:Ne,setLineWidth:ln,setPolygonOffset:In,setScissorTest:Ie,activeTexture:Ye,bindTexture:L,unbindTexture:_n,compressedTexImage2D:fe,compressedTexImage3D:w,texImage2D:Z,texImage3D:j,pixelStorei:At,getParameter:ot,updateUBOMapping:wt,uniformBlockBinding:Dt,texStorage2D:st,texStorage3D:at,texSubImage2D:_,texSubImage3D:I,compressedTexSubImage2D:k,compressedTexSubImage3D:X,scissor:ft,viewport:lt,reset:zt}}function XR(e,t,n,i,s,a,r){let o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new ie,u=new WeakMap,f=new Set,h,d=new WeakMap,m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function b(w,_){return m?new OffscreenCanvas(w,_):Ql("canvas")}function g(w,_,I){let k=1,X=fe(w);if((X.width>I||X.height>I)&&(k=I/Math.max(X.width,X.height)),k<1)if(typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&w instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&w instanceof ImageBitmap||typeof VideoFrame<"u"&&w instanceof VideoFrame){let st=Math.floor(k*X.width),at=Math.floor(k*X.height);h===void 0&&(h=b(st,at));let Z=_?b(st,at):h;return Z.width=st,Z.height=at,Z.getContext("2d").drawImage(w,0,0,st,at),Nt("WebGLRenderer: Texture has been resized from ("+X.width+"x"+X.height+") to ("+st+"x"+at+")."),Z}else return"data"in w&&Nt("WebGLRenderer: Image in DataTexture is too big ("+X.width+"x"+X.height+")."),w;return w}function p(w){return w.generateMipmaps}function y(w){e.generateMipmap(w)}function S(w){return w.isWebGLCubeRenderTarget?e.TEXTURE_CUBE_MAP:w.isWebGL3DRenderTarget?e.TEXTURE_3D:w.isWebGLArrayRenderTarget||w.isCompressedArrayTexture?e.TEXTURE_2D_ARRAY:e.TEXTURE_2D}function v(w,_,I,k,X,st=!1){if(w!==null){if(e[w]!==void 0)return e[w];Nt("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+w+"'")}let at;k&&(at=t.get("EXT_texture_norm16"),at||Nt("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let Z=_;if(_===e.RED&&(I===e.FLOAT&&(Z=e.R32F),I===e.HALF_FLOAT&&(Z=e.R16F),I===e.UNSIGNED_BYTE&&(Z=e.R8),I===e.UNSIGNED_SHORT&&at&&(Z=at.R16_EXT),I===e.SHORT&&at&&(Z=at.R16_SNORM_EXT)),_===e.RED_INTEGER&&(I===e.UNSIGNED_BYTE&&(Z=e.R8UI),I===e.UNSIGNED_SHORT&&(Z=e.R16UI),I===e.UNSIGNED_INT&&(Z=e.R32UI),I===e.BYTE&&(Z=e.R8I),I===e.SHORT&&(Z=e.R16I),I===e.INT&&(Z=e.R32I)),_===e.RG&&(I===e.FLOAT&&(Z=e.RG32F),I===e.HALF_FLOAT&&(Z=e.RG16F),I===e.UNSIGNED_BYTE&&(Z=e.RG8),I===e.UNSIGNED_SHORT&&at&&(Z=at.RG16_EXT),I===e.SHORT&&at&&(Z=at.RG16_SNORM_EXT)),_===e.RG_INTEGER&&(I===e.UNSIGNED_BYTE&&(Z=e.RG8UI),I===e.UNSIGNED_SHORT&&(Z=e.RG16UI),I===e.UNSIGNED_INT&&(Z=e.RG32UI),I===e.BYTE&&(Z=e.RG8I),I===e.SHORT&&(Z=e.RG16I),I===e.INT&&(Z=e.RG32I)),_===e.RGB_INTEGER&&(I===e.UNSIGNED_BYTE&&(Z=e.RGB8UI),I===e.UNSIGNED_SHORT&&(Z=e.RGB16UI),I===e.UNSIGNED_INT&&(Z=e.RGB32UI),I===e.BYTE&&(Z=e.RGB8I),I===e.SHORT&&(Z=e.RGB16I),I===e.INT&&(Z=e.RGB32I)),_===e.RGBA_INTEGER&&(I===e.UNSIGNED_BYTE&&(Z=e.RGBA8UI),I===e.UNSIGNED_SHORT&&(Z=e.RGBA16UI),I===e.UNSIGNED_INT&&(Z=e.RGBA32UI),I===e.BYTE&&(Z=e.RGBA8I),I===e.SHORT&&(Z=e.RGBA16I),I===e.INT&&(Z=e.RGBA32I)),_===e.RGB&&(I===e.UNSIGNED_SHORT&&at&&(Z=at.RGB16_EXT),I===e.SHORT&&at&&(Z=at.RGB16_SNORM_EXT),I===e.UNSIGNED_INT_5_9_9_9_REV&&(Z=e.RGB9_E5),I===e.UNSIGNED_INT_10F_11F_11F_REV&&(Z=e.R11F_G11F_B10F)),_===e.RGBA){let j=st?Kl:jt.getTransfer(X);I===e.FLOAT&&(Z=e.RGBA32F),I===e.HALF_FLOAT&&(Z=e.RGBA16F),I===e.UNSIGNED_BYTE&&(Z=j===he?e.SRGB8_ALPHA8:e.RGBA8),I===e.UNSIGNED_SHORT&&at&&(Z=at.RGBA16_EXT),I===e.SHORT&&at&&(Z=at.RGBA16_SNORM_EXT),I===e.UNSIGNED_SHORT_4_4_4_4&&(Z=e.RGBA4),I===e.UNSIGNED_SHORT_5_5_5_1&&(Z=e.RGB5_A1)}return(Z===e.R16F||Z===e.R32F||Z===e.RG16F||Z===e.RG32F||Z===e.RGBA16F||Z===e.RGBA32F)&&t.get("EXT_color_buffer_float"),Z}function E(w,_){let I;return w?_===null||_===ki||_===Oo?I=e.DEPTH24_STENCIL8:_===Hi?I=e.DEPTH32F_STENCIL8:_===Uo&&(I=e.DEPTH24_STENCIL8,Nt("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):_===null||_===ki||_===Oo?I=e.DEPTH_COMPONENT24:_===Hi?I=e.DEPTH_COMPONENT32F:_===Uo&&(I=e.DEPTH_COMPONENT16),I}function T(w,_){return p(w)===!0||w.isFramebufferTexture&&w.minFilter!==Xe&&w.minFilter!==vn?Math.log2(Math.max(_.width,_.height))+1:w.mipmaps!==void 0&&w.mipmaps.length>0?w.mipmaps.length:w.isCompressedTexture&&Array.isArray(w.image)?_.mipmaps.length:1}function C(w){let _=w.target;_.removeEventListener("dispose",C),A(_),_.isVideoTexture&&u.delete(_),_.isHTMLTexture&&f.delete(_)}function x(w){let _=w.target;_.removeEventListener("dispose",x),O(_)}function A(w){let _=i.get(w);if(_.__webglInit===void 0)return;let I=w.source,k=d.get(I);if(k){let X=k[_.__cacheKey];X.usedTimes--,X.usedTimes===0&&R(w),Object.keys(k).length===0&&d.delete(I)}i.remove(w)}function R(w){let _=i.get(w);e.deleteTexture(_.__webglTexture);let I=w.source,k=d.get(I);delete k[_.__cacheKey],r.memory.textures--}function O(w){let _=i.get(w);if(w.depthTexture&&(w.depthTexture.dispose(),i.remove(w.depthTexture)),w.isWebGLCubeRenderTarget)for(let k=0;k<6;k++){if(Array.isArray(_.__webglFramebuffer[k]))for(let X=0;X<_.__webglFramebuffer[k].length;X++)e.deleteFramebuffer(_.__webglFramebuffer[k][X]);else e.deleteFramebuffer(_.__webglFramebuffer[k]);_.__webglDepthbuffer&&e.deleteRenderbuffer(_.__webglDepthbuffer[k])}else{if(Array.isArray(_.__webglFramebuffer))for(let k=0;k<_.__webglFramebuffer.length;k++)e.deleteFramebuffer(_.__webglFramebuffer[k]);else e.deleteFramebuffer(_.__webglFramebuffer);if(_.__webglDepthbuffer&&e.deleteRenderbuffer(_.__webglDepthbuffer),_.__webglMultisampledFramebuffer&&e.deleteFramebuffer(_.__webglMultisampledFramebuffer),_.__webglColorRenderbuffer)for(let k=0;k<_.__webglColorRenderbuffer.length;k++)_.__webglColorRenderbuffer[k]&&e.deleteRenderbuffer(_.__webglColorRenderbuffer[k]);_.__webglDepthRenderbuffer&&e.deleteRenderbuffer(_.__webglDepthRenderbuffer)}let I=w.textures;for(let k=0,X=I.length;k<X;k++){let st=i.get(I[k]);st.__webglTexture&&(e.deleteTexture(st.__webglTexture),r.memory.textures--),i.remove(I[k])}i.remove(w)}let F=0;function V(){F=0}function U(){return F}function G(w){F=w}function J(){let w=F;return w>=s.maxTextures&&Nt("WebGLTextures: Trying to use "+(w+1)+" texture units while this GPU supports only "+s.maxTextures),F+=1,w}function q(w){let _=[];return _.push(w.wrapS),_.push(w.wrapT),_.push(w.wrapR||0),_.push(w.magFilter),_.push(w.minFilter),_.push(w.anisotropy),_.push(w.internalFormat),_.push(w.format),_.push(w.type),_.push(w.generateMipmaps),_.push(w.premultiplyAlpha),_.push(w.flipY),_.push(w.unpackAlignment),_.push(w.colorSpace),_.join()}function it(w,_){let I=i.get(w);if(w.isVideoTexture&&L(w),w.isRenderTargetTexture===!1&&w.isExternalTexture!==!0&&w.version>0&&I.__version!==w.version){let k=w.image;if(k===null)Nt("WebGLRenderer: Texture marked for update but no image data found.");else if(k.complete===!1)Nt("WebGLRenderer: Texture marked for update but image is incomplete");else{bt(I,w,_);return}}else w.isExternalTexture&&(I.__webglTexture=w.sourceTexture?w.sourceTexture:null);n.bindTexture(e.TEXTURE_2D,I.__webglTexture,e.TEXTURE0+_)}function P(w,_){let I=i.get(w);if(w.isRenderTargetTexture===!1&&w.version>0&&I.__version!==w.version){bt(I,w,_);return}else w.isExternalTexture&&(I.__webglTexture=w.sourceTexture?w.sourceTexture:null);n.bindTexture(e.TEXTURE_2D_ARRAY,I.__webglTexture,e.TEXTURE0+_)}function K(w,_){let I=i.get(w);if(w.isRenderTargetTexture===!1&&w.version>0&&I.__version!==w.version){bt(I,w,_);return}n.bindTexture(e.TEXTURE_3D,I.__webglTexture,e.TEXTURE0+_)}function $(w,_){let I=i.get(w);if(w.isCubeDepthTexture!==!0&&w.version>0&&I.__version!==w.version){Pt(I,w,_);return}n.bindTexture(e.TEXTURE_CUBE_MAP,I.__webglTexture,e.TEXTURE0+_)}let ht={[Lh]:e.REPEAT,[es]:e.CLAMP_TO_EDGE,[Uh]:e.MIRRORED_REPEAT},_t={[Xe]:e.NEAREST,[mS]:e.NEAREST_MIPMAP_NEAREST,[hc]:e.NEAREST_MIPMAP_LINEAR,[vn]:e.LINEAR,[rf]:e.LINEAR_MIPMAP_NEAREST,[Na]:e.LINEAR_MIPMAP_LINEAR},Gt={[vS]:e.NEVER,[ES]:e.ALWAYS,[_S]:e.LESS,[Gf]:e.LEQUAL,[bS]:e.EQUAL,[Wf]:e.GEQUAL,[SS]:e.GREATER,[MS]:e.NOTEQUAL};function Vt(w,_){if(_.type===Hi&&t.has("OES_texture_float_linear")===!1&&(_.magFilter===vn||_.magFilter===rf||_.magFilter===hc||_.magFilter===Na||_.minFilter===vn||_.minFilter===rf||_.minFilter===hc||_.minFilter===Na)&&Nt("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),e.texParameteri(w,e.TEXTURE_WRAP_S,ht[_.wrapS]),e.texParameteri(w,e.TEXTURE_WRAP_T,ht[_.wrapT]),(w===e.TEXTURE_3D||w===e.TEXTURE_2D_ARRAY)&&e.texParameteri(w,e.TEXTURE_WRAP_R,ht[_.wrapR]),e.texParameteri(w,e.TEXTURE_MAG_FILTER,_t[_.magFilter]),e.texParameteri(w,e.TEXTURE_MIN_FILTER,_t[_.minFilter]),_.compareFunction&&(e.texParameteri(w,e.TEXTURE_COMPARE_MODE,e.COMPARE_REF_TO_TEXTURE),e.texParameteri(w,e.TEXTURE_COMPARE_FUNC,Gt[_.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(_.magFilter===Xe||_.minFilter!==hc&&_.minFilter!==Na||_.type===Hi&&t.has("OES_texture_float_linear")===!1)return;if(_.anisotropy>1||i.get(_).__currentAnisotropy){let I=t.get("EXT_texture_filter_anisotropic");e.texParameterf(w,I.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(_.anisotropy,s.getMaxAnisotropy())),i.get(_).__currentAnisotropy=_.anisotropy}}}function re(w,_){let I=!1;w.__webglInit===void 0&&(w.__webglInit=!0,_.addEventListener("dispose",C));let k=_.source,X=d.get(k);X===void 0&&(X={},d.set(k,X));let st=q(_);if(st!==w.__cacheKey){X[st]===void 0&&(X[st]={texture:e.createTexture(),usedTimes:0},r.memory.textures++,I=!0),X[st].usedTimes++;let at=X[w.__cacheKey];at!==void 0&&(X[w.__cacheKey].usedTimes--,at.usedTimes===0&&R(_)),w.__cacheKey=st,w.__webglTexture=X[st].texture}return I}function Y(w,_,I){return Math.floor(Math.floor(w/I)/_)}function et(w,_,I,k){let st=w.updateRanges;if(st.length===0)n.texSubImage2D(e.TEXTURE_2D,0,0,0,_.width,_.height,I,k,_.data);else{st.sort((At,ft)=>At.start-ft.start);let at=0;for(let At=1;At<st.length;At++){let ft=st[at],lt=st[At],wt=ft.start+ft.count,Dt=Y(lt.start,_.width,4),zt=Y(ft.start,_.width,4);lt.start<=wt+1&&Dt===zt&&Y(lt.start+lt.count-1,_.width,4)===Dt?ft.count=Math.max(ft.count,lt.start+lt.count-ft.start):(++at,st[at]=lt)}st.length=at+1;let Z=n.getParameter(e.UNPACK_ROW_LENGTH),j=n.getParameter(e.UNPACK_SKIP_PIXELS),ot=n.getParameter(e.UNPACK_SKIP_ROWS);n.pixelStorei(e.UNPACK_ROW_LENGTH,_.width);for(let At=0,ft=st.length;At<ft;At++){let lt=st[At],wt=Math.floor(lt.start/4),Dt=Math.ceil(lt.count/4),zt=wt%_.width,N=Math.floor(wt/_.width),ct=Dt,Q=1;n.pixelStorei(e.UNPACK_SKIP_PIXELS,zt),n.pixelStorei(e.UNPACK_SKIP_ROWS,N),n.texSubImage2D(e.TEXTURE_2D,0,zt,N,ct,Q,I,k,_.data)}w.clearUpdateRanges(),n.pixelStorei(e.UNPACK_ROW_LENGTH,Z),n.pixelStorei(e.UNPACK_SKIP_PIXELS,j),n.pixelStorei(e.UNPACK_SKIP_ROWS,ot)}}function bt(w,_,I){let k=e.TEXTURE_2D;(_.isDataArrayTexture||_.isCompressedArrayTexture)&&(k=e.TEXTURE_2D_ARRAY),_.isData3DTexture&&(k=e.TEXTURE_3D);let X=re(w,_),st=_.source;n.bindTexture(k,w.__webglTexture,e.TEXTURE0+I);let at=i.get(st);if(st.version!==at.__version||X===!0){if(n.activeTexture(e.TEXTURE0+I),(typeof ImageBitmap<"u"&&_.image instanceof ImageBitmap)===!1){let Q=jt.getPrimaries(jt.workingColorSpace),ut=_.colorSpace===Ps?null:jt.getPrimaries(_.colorSpace),gt=_.colorSpace===Ps||Q===ut?e.NONE:e.BROWSER_DEFAULT_WEBGL;n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,_.flipY),n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,gt)}n.pixelStorei(e.UNPACK_ALIGNMENT,_.unpackAlignment);let j=g(_.image,!1,s.maxTextureSize);j=_n(_,j);let ot=a.convert(_.format,_.colorSpace),At=a.convert(_.type),ft=v(_.internalFormat,ot,At,_.normalized,_.colorSpace,_.isVideoTexture);Vt(k,_);let lt,wt=_.mipmaps,Dt=_.isVideoTexture!==!0,zt=at.__version===void 0||X===!0,N=st.dataReady,ct=T(_,j);if(_.isDepthTexture)ft=E(_.format===La,_.type),zt&&(Dt?n.texStorage2D(e.TEXTURE_2D,1,ft,j.width,j.height):n.texImage2D(e.TEXTURE_2D,0,ft,j.width,j.height,0,ot,At,null));else if(_.isDataTexture)if(wt.length>0){Dt&&zt&&n.texStorage2D(e.TEXTURE_2D,ct,ft,wt[0].width,wt[0].height);for(let Q=0,ut=wt.length;Q<ut;Q++)lt=wt[Q],Dt?N&&n.texSubImage2D(e.TEXTURE_2D,Q,0,0,lt.width,lt.height,ot,At,lt.data):n.texImage2D(e.TEXTURE_2D,Q,ft,lt.width,lt.height,0,ot,At,lt.data);_.generateMipmaps=!1}else Dt?(zt&&n.texStorage2D(e.TEXTURE_2D,ct,ft,j.width,j.height),N&&et(_,j,ot,At)):n.texImage2D(e.TEXTURE_2D,0,ft,j.width,j.height,0,ot,At,j.data);else if(_.isCompressedTexture)if(_.isCompressedArrayTexture){Dt&&zt&&n.texStorage3D(e.TEXTURE_2D_ARRAY,ct,ft,wt[0].width,wt[0].height,j.depth);for(let Q=0,ut=wt.length;Q<ut;Q++)if(lt=wt[Q],_.format!==wi)if(ot!==null)if(Dt){if(N)if(_.layerUpdates.size>0){let gt=Jg(lt.width,lt.height,_.format,_.type);for(let nt of _.layerUpdates){let Ct=lt.data.subarray(nt*gt/lt.data.BYTES_PER_ELEMENT,(nt+1)*gt/lt.data.BYTES_PER_ELEMENT);n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,Q,0,0,nt,lt.width,lt.height,1,ot,Ct)}}else n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,Q,0,0,0,lt.width,lt.height,j.depth,ot,lt.data)}else n.compressedTexImage3D(e.TEXTURE_2D_ARRAY,Q,ft,lt.width,lt.height,j.depth,0,lt.data,0,0);else Nt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Dt?N&&n.texSubImage3D(e.TEXTURE_2D_ARRAY,Q,0,0,0,lt.width,lt.height,j.depth,ot,At,lt.data):n.texImage3D(e.TEXTURE_2D_ARRAY,Q,ft,lt.width,lt.height,j.depth,0,ot,At,lt.data);_.layerUpdates.size>0&&_.clearLayerUpdates()}else{Dt&&zt&&n.texStorage2D(e.TEXTURE_2D,ct,ft,wt[0].width,wt[0].height);for(let Q=0,ut=wt.length;Q<ut;Q++)lt=wt[Q],_.format!==wi?ot!==null?Dt?N&&n.compressedTexSubImage2D(e.TEXTURE_2D,Q,0,0,lt.width,lt.height,ot,lt.data):n.compressedTexImage2D(e.TEXTURE_2D,Q,ft,lt.width,lt.height,0,lt.data):Nt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Dt?N&&n.texSubImage2D(e.TEXTURE_2D,Q,0,0,lt.width,lt.height,ot,At,lt.data):n.texImage2D(e.TEXTURE_2D,Q,ft,lt.width,lt.height,0,ot,At,lt.data)}else if(_.isDataArrayTexture)if(Dt){if(zt&&n.texStorage3D(e.TEXTURE_2D_ARRAY,ct,ft,j.width,j.height,j.depth),N)if(_.layerUpdates.size>0){let Q=Jg(j.width,j.height,_.format,_.type);for(let ut of _.layerUpdates){let gt=j.data.subarray(ut*Q/j.data.BYTES_PER_ELEMENT,(ut+1)*Q/j.data.BYTES_PER_ELEMENT);n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,ut,j.width,j.height,1,ot,At,gt)}_.clearLayerUpdates()}else n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,0,j.width,j.height,j.depth,ot,At,j.data)}else n.texImage3D(e.TEXTURE_2D_ARRAY,0,ft,j.width,j.height,j.depth,0,ot,At,j.data);else if(_.isData3DTexture)Dt?(zt&&n.texStorage3D(e.TEXTURE_3D,ct,ft,j.width,j.height,j.depth),N&&n.texSubImage3D(e.TEXTURE_3D,0,0,0,0,j.width,j.height,j.depth,ot,At,j.data)):n.texImage3D(e.TEXTURE_3D,0,ft,j.width,j.height,j.depth,0,ot,At,j.data);else if(_.isFramebufferTexture){if(zt)if(Dt)n.texStorage2D(e.TEXTURE_2D,ct,ft,j.width,j.height);else{let Q=j.width,ut=j.height;for(let gt=0;gt<ct;gt++)n.texImage2D(e.TEXTURE_2D,gt,ft,Q,ut,0,ot,At,null),Q>>=1,ut>>=1}}else if(_.isHTMLTexture){if("texElementImage2D"in e){let Q=e.canvas;if(Q.hasAttribute("layoutsubtree")||Q.setAttribute("layoutsubtree","true"),j.parentNode!==Q){Q.appendChild(j),f.add(_),Q.onpaint=ut=>{let gt=ut.changedElements;for(let nt of f)gt.includes(nt.image)&&(nt.needsUpdate=!0)},Q.requestPaint();return}if(e.texElementImage2D.length===3)e.texElementImage2D(e.TEXTURE_2D,e.RGBA8,j);else{let gt=e.RGBA,nt=e.RGBA,Ct=e.UNSIGNED_BYTE;e.texElementImage2D(e.TEXTURE_2D,0,gt,nt,Ct,j)}e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE)}}else if(wt.length>0){if(Dt&&zt){let Q=fe(wt[0]);n.texStorage2D(e.TEXTURE_2D,ct,ft,Q.width,Q.height)}for(let Q=0,ut=wt.length;Q<ut;Q++)lt=wt[Q],Dt?N&&n.texSubImage2D(e.TEXTURE_2D,Q,0,0,ot,At,lt):n.texImage2D(e.TEXTURE_2D,Q,ft,ot,At,lt);_.generateMipmaps=!1}else if(Dt){if(zt){let Q=fe(j);n.texStorage2D(e.TEXTURE_2D,ct,ft,Q.width,Q.height)}N&&n.texSubImage2D(e.TEXTURE_2D,0,0,0,ot,At,j)}else n.texImage2D(e.TEXTURE_2D,0,ft,ot,At,j);p(_)&&y(k),at.__version=st.version,_.onUpdate&&_.onUpdate(_)}w.__version=_.version}function Pt(w,_,I){if(_.image.length!==6)return;let k=re(w,_),X=_.source;n.bindTexture(e.TEXTURE_CUBE_MAP,w.__webglTexture,e.TEXTURE0+I);let st=i.get(X);if(X.version!==st.__version||k===!0){n.activeTexture(e.TEXTURE0+I);let at=jt.getPrimaries(jt.workingColorSpace),Z=_.colorSpace===Ps?null:jt.getPrimaries(_.colorSpace),j=_.colorSpace===Ps||at===Z?e.NONE:e.BROWSER_DEFAULT_WEBGL;n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,_.flipY),n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),n.pixelStorei(e.UNPACK_ALIGNMENT,_.unpackAlignment),n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,j);let ot=_.isCompressedTexture||_.image[0].isCompressedTexture,At=_.image[0]&&_.image[0].isDataTexture,ft=[];for(let nt=0;nt<6;nt++)!ot&&!At?ft[nt]=g(_.image[nt],!0,s.maxCubemapSize):ft[nt]=At?_.image[nt].image:_.image[nt],ft[nt]=_n(_,ft[nt]);let lt=ft[0],wt=a.convert(_.format,_.colorSpace),Dt=a.convert(_.type),zt=v(_.internalFormat,wt,Dt,_.normalized,_.colorSpace),N=_.isVideoTexture!==!0,ct=st.__version===void 0||k===!0,Q=X.dataReady,ut=T(_,lt);Vt(e.TEXTURE_CUBE_MAP,_);let gt;if(ot){N&&ct&&n.texStorage2D(e.TEXTURE_CUBE_MAP,ut,zt,lt.width,lt.height);for(let nt=0;nt<6;nt++){gt=ft[nt].mipmaps;for(let Ct=0;Ct<gt.length;Ct++){let Et=gt[Ct];_.format!==wi?wt!==null?N?Q&&n.compressedTexSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+nt,Ct,0,0,Et.width,Et.height,wt,Et.data):n.compressedTexImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+nt,Ct,zt,Et.width,Et.height,0,Et.data):Nt("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):N?Q&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+nt,Ct,0,0,Et.width,Et.height,wt,Dt,Et.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+nt,Ct,zt,Et.width,Et.height,0,wt,Dt,Et.data)}}}else{if(gt=_.mipmaps,N&&ct){gt.length>0&&ut++;let nt=fe(ft[0]);n.texStorage2D(e.TEXTURE_CUBE_MAP,ut,zt,nt.width,nt.height)}for(let nt=0;nt<6;nt++)if(At){N?Q&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+nt,0,0,0,ft[nt].width,ft[nt].height,wt,Dt,ft[nt].data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+nt,0,zt,ft[nt].width,ft[nt].height,0,wt,Dt,ft[nt].data);for(let Ct=0;Ct<gt.length;Ct++){let be=gt[Ct].image[nt].image;N?Q&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+nt,Ct+1,0,0,be.width,be.height,wt,Dt,be.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+nt,Ct+1,zt,be.width,be.height,0,wt,Dt,be.data)}}else{N?Q&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+nt,0,0,0,wt,Dt,ft[nt]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+nt,0,zt,wt,Dt,ft[nt]);for(let Ct=0;Ct<gt.length;Ct++){let Et=gt[Ct];N?Q&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+nt,Ct+1,0,0,wt,Dt,Et.image[nt]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+nt,Ct+1,zt,wt,Dt,Et.image[nt])}}}p(_)&&y(e.TEXTURE_CUBE_MAP),st.__version=X.version,_.onUpdate&&_.onUpdate(_)}w.__version=_.version}function xt(w,_,I,k,X,st){let at=a.convert(I.format,I.colorSpace),Z=a.convert(I.type),j=v(I.internalFormat,at,Z,I.normalized,I.colorSpace),ot=i.get(_),At=i.get(I);if(At.__renderTarget=_,!ot.__hasExternalTextures){let ft=Math.max(1,_.width>>st),lt=Math.max(1,_.height>>st);X===e.TEXTURE_3D||X===e.TEXTURE_2D_ARRAY?n.texImage3D(X,st,j,ft,lt,_.depth,0,at,Z,null):n.texImage2D(X,st,j,ft,lt,0,at,Z,null)}n.bindFramebuffer(e.FRAMEBUFFER,w),Ye(_)?o.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,k,X,At.__webglTexture,0,Ie(_)):(X===e.TEXTURE_2D||X>=e.TEXTURE_CUBE_MAP_POSITIVE_X&&X<=e.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&e.framebufferTexture2D(e.FRAMEBUFFER,k,X,At.__webglTexture,st),n.bindFramebuffer(e.FRAMEBUFFER,null)}function Wt(w,_,I){if(e.bindRenderbuffer(e.RENDERBUFFER,w),_.depthBuffer){let k=_.depthTexture,X=k&&k.isDepthTexture?k.type:null,st=E(_.stencilBuffer,X),at=_.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;Ye(_)?o.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,Ie(_),st,_.width,_.height):I?e.renderbufferStorageMultisample(e.RENDERBUFFER,Ie(_),st,_.width,_.height):e.renderbufferStorage(e.RENDERBUFFER,st,_.width,_.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,at,e.RENDERBUFFER,w)}else{let k=_.textures;for(let X=0;X<k.length;X++){let st=k[X],at=a.convert(st.format,st.colorSpace),Z=a.convert(st.type),j=v(st.internalFormat,at,Z,st.normalized,st.colorSpace);Ye(_)?o.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,Ie(_),j,_.width,_.height):I?e.renderbufferStorageMultisample(e.RENDERBUFFER,Ie(_),j,_.width,_.height):e.renderbufferStorage(e.RENDERBUFFER,j,_.width,_.height)}}e.bindRenderbuffer(e.RENDERBUFFER,null)}function tn(w,_,I){let k=_.isWebGLCubeRenderTarget===!0;if(n.bindFramebuffer(e.FRAMEBUFFER,w),!(_.depthTexture&&_.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");let X=i.get(_.depthTexture);if(X.__renderTarget=_,(!X.__webglTexture||_.depthTexture.image.width!==_.width||_.depthTexture.image.height!==_.height)&&(_.depthTexture.image.width=_.width,_.depthTexture.image.height=_.height,_.depthTexture.needsUpdate=!0),k){if(X.__webglInit===void 0&&(X.__webglInit=!0,_.depthTexture.addEventListener("dispose",C)),X.__webglTexture===void 0){X.__webglTexture=e.createTexture(),n.bindTexture(e.TEXTURE_CUBE_MAP,X.__webglTexture),Vt(e.TEXTURE_CUBE_MAP,_.depthTexture);let ot=a.convert(_.depthTexture.format),At=a.convert(_.depthTexture.type),ft;_.depthTexture.format===ns?ft=e.DEPTH_COMPONENT24:_.depthTexture.format===La&&(ft=e.DEPTH24_STENCIL8);for(let lt=0;lt<6;lt++)e.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+lt,0,ft,_.width,_.height,0,ot,At,null)}}else it(_.depthTexture,0);let st=X.__webglTexture,at=Ie(_),Z=k?e.TEXTURE_CUBE_MAP_POSITIVE_X+I:e.TEXTURE_2D,j=_.depthTexture.format===La?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;if(_.depthTexture.format===ns)Ye(_)?o.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,j,Z,st,0,at):e.framebufferTexture2D(e.FRAMEBUFFER,j,Z,st,0);else if(_.depthTexture.format===La)Ye(_)?o.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,j,Z,st,0,at):e.framebufferTexture2D(e.FRAMEBUFFER,j,Z,st,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function qt(w){let _=i.get(w),I=w.isWebGLCubeRenderTarget===!0;if(_.__boundDepthTexture!==w.depthTexture){let k=w.depthTexture;if(_.__depthDisposeCallback&&_.__depthDisposeCallback(),k){let X=()=>{delete _.__boundDepthTexture,delete _.__depthDisposeCallback,k.removeEventListener("dispose",X)};k.addEventListener("dispose",X),_.__depthDisposeCallback=X}_.__boundDepthTexture=k}if(w.depthTexture&&!_.__autoAllocateDepthBuffer)if(I)for(let k=0;k<6;k++)tn(_.__webglFramebuffer[k],w,k);else{let k=w.texture.mipmaps;k&&k.length>0?tn(_.__webglFramebuffer[0],w,0):tn(_.__webglFramebuffer,w,0)}else if(I){_.__webglDepthbuffer=[];for(let k=0;k<6;k++)if(n.bindFramebuffer(e.FRAMEBUFFER,_.__webglFramebuffer[k]),_.__webglDepthbuffer[k]===void 0)_.__webglDepthbuffer[k]=e.createRenderbuffer(),Wt(_.__webglDepthbuffer[k],w,!1);else{let X=w.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,st=_.__webglDepthbuffer[k];e.bindRenderbuffer(e.RENDERBUFFER,st),e.framebufferRenderbuffer(e.FRAMEBUFFER,X,e.RENDERBUFFER,st)}}else{let k=w.texture.mipmaps;if(k&&k.length>0?n.bindFramebuffer(e.FRAMEBUFFER,_.__webglFramebuffer[0]):n.bindFramebuffer(e.FRAMEBUFFER,_.__webglFramebuffer),_.__webglDepthbuffer===void 0)_.__webglDepthbuffer=e.createRenderbuffer(),Wt(_.__webglDepthbuffer,w,!1);else{let X=w.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,st=_.__webglDepthbuffer;e.bindRenderbuffer(e.RENDERBUFFER,st),e.framebufferRenderbuffer(e.FRAMEBUFFER,X,e.RENDERBUFFER,st)}}n.bindFramebuffer(e.FRAMEBUFFER,null)}function ae(w,_,I){let k=i.get(w);_!==void 0&&xt(k.__webglFramebuffer,w,w.texture,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,0),I!==void 0&&qt(w)}function _e(w){let _=w.texture,I=i.get(w),k=i.get(_);w.addEventListener("dispose",x);let X=w.textures,st=w.isWebGLCubeRenderTarget===!0,at=X.length>1;if(at||(k.__webglTexture===void 0&&(k.__webglTexture=e.createTexture()),k.__version=_.version,r.memory.textures++),st){I.__webglFramebuffer=[];for(let Z=0;Z<6;Z++)if(_.mipmaps&&_.mipmaps.length>0){I.__webglFramebuffer[Z]=[];for(let j=0;j<_.mipmaps.length;j++)I.__webglFramebuffer[Z][j]=e.createFramebuffer()}else I.__webglFramebuffer[Z]=e.createFramebuffer()}else{if(_.mipmaps&&_.mipmaps.length>0){I.__webglFramebuffer=[];for(let Z=0;Z<_.mipmaps.length;Z++)I.__webglFramebuffer[Z]=e.createFramebuffer()}else I.__webglFramebuffer=e.createFramebuffer();if(at)for(let Z=0,j=X.length;Z<j;Z++){let ot=i.get(X[Z]);ot.__webglTexture===void 0&&(ot.__webglTexture=e.createTexture(),r.memory.textures++)}if(w.samples>0&&Ye(w)===!1){I.__webglMultisampledFramebuffer=e.createFramebuffer(),I.__webglColorRenderbuffer=[],n.bindFramebuffer(e.FRAMEBUFFER,I.__webglMultisampledFramebuffer);for(let Z=0;Z<X.length;Z++){let j=X[Z];I.__webglColorRenderbuffer[Z]=e.createRenderbuffer(),e.bindRenderbuffer(e.RENDERBUFFER,I.__webglColorRenderbuffer[Z]);let ot=a.convert(j.format,j.colorSpace),At=a.convert(j.type),ft=v(j.internalFormat,ot,At,j.normalized,j.colorSpace,w.isXRRenderTarget===!0),lt=Ie(w);e.renderbufferStorageMultisample(e.RENDERBUFFER,lt,ft,w.width,w.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+Z,e.RENDERBUFFER,I.__webglColorRenderbuffer[Z])}e.bindRenderbuffer(e.RENDERBUFFER,null),w.depthBuffer&&(I.__webglDepthRenderbuffer=e.createRenderbuffer(),Wt(I.__webglDepthRenderbuffer,w,!0)),n.bindFramebuffer(e.FRAMEBUFFER,null)}}if(st){n.bindTexture(e.TEXTURE_CUBE_MAP,k.__webglTexture),Vt(e.TEXTURE_CUBE_MAP,_);for(let Z=0;Z<6;Z++)if(_.mipmaps&&_.mipmaps.length>0)for(let j=0;j<_.mipmaps.length;j++)xt(I.__webglFramebuffer[Z][j],w,_,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+Z,j);else xt(I.__webglFramebuffer[Z],w,_,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0);p(_)&&y(e.TEXTURE_CUBE_MAP),n.unbindTexture()}else if(at){for(let Z=0,j=X.length;Z<j;Z++){let ot=X[Z],At=i.get(ot),ft=e.TEXTURE_2D;(w.isWebGL3DRenderTarget||w.isWebGLArrayRenderTarget)&&(ft=w.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(ft,At.__webglTexture),Vt(ft,ot),xt(I.__webglFramebuffer,w,ot,e.COLOR_ATTACHMENT0+Z,ft,0),p(ot)&&y(ft)}n.unbindTexture()}else{let Z=e.TEXTURE_2D;if((w.isWebGL3DRenderTarget||w.isWebGLArrayRenderTarget)&&(Z=w.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(Z,k.__webglTexture),Vt(Z,_),_.mipmaps&&_.mipmaps.length>0)for(let j=0;j<_.mipmaps.length;j++)xt(I.__webglFramebuffer[j],w,_,e.COLOR_ATTACHMENT0,Z,j);else xt(I.__webglFramebuffer,w,_,e.COLOR_ATTACHMENT0,Z,0);p(_)&&y(Z),n.unbindTexture()}w.depthBuffer&&qt(w)}function Jt(w){let _=w.textures;for(let I=0,k=_.length;I<k;I++){let X=_[I];if(p(X)){let st=S(w),at=i.get(X).__webglTexture;n.bindTexture(st,at),y(st),n.unbindTexture()}}}let Ne=[],ln=[];function In(w){if(w.samples>0){if(Ye(w)===!1){let _=w.textures,I=w.width,k=w.height,X=e.COLOR_BUFFER_BIT,st=w.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,at=i.get(w),Z=_.length>1;if(Z)for(let ot=0;ot<_.length;ot++)n.bindFramebuffer(e.FRAMEBUFFER,at.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+ot,e.RENDERBUFFER,null),n.bindFramebuffer(e.FRAMEBUFFER,at.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+ot,e.TEXTURE_2D,null,0);n.bindFramebuffer(e.READ_FRAMEBUFFER,at.__webglMultisampledFramebuffer);let j=w.texture.mipmaps;j&&j.length>0?n.bindFramebuffer(e.DRAW_FRAMEBUFFER,at.__webglFramebuffer[0]):n.bindFramebuffer(e.DRAW_FRAMEBUFFER,at.__webglFramebuffer);for(let ot=0;ot<_.length;ot++){if(w.resolveDepthBuffer&&(w.depthBuffer&&(X|=e.DEPTH_BUFFER_BIT),w.stencilBuffer&&w.resolveStencilBuffer&&(X|=e.STENCIL_BUFFER_BIT)),Z){e.framebufferRenderbuffer(e.READ_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.RENDERBUFFER,at.__webglColorRenderbuffer[ot]);let At=i.get(_[ot]).__webglTexture;e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,At,0)}e.blitFramebuffer(0,0,I,k,0,0,I,k,X,e.NEAREST),l===!0&&(Ne.length=0,ln.length=0,Ne.push(e.COLOR_ATTACHMENT0+ot),w.depthBuffer&&w.storeMultisampledDepthBuffer===!1&&(Ne.push(st),ln.push(st),e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,ln)),e.invalidateFramebuffer(e.READ_FRAMEBUFFER,Ne))}if(n.bindFramebuffer(e.READ_FRAMEBUFFER,null),n.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),Z)for(let ot=0;ot<_.length;ot++){n.bindFramebuffer(e.FRAMEBUFFER,at.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+ot,e.RENDERBUFFER,at.__webglColorRenderbuffer[ot]);let At=i.get(_[ot]).__webglTexture;n.bindFramebuffer(e.FRAMEBUFFER,at.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+ot,e.TEXTURE_2D,At,0)}n.bindFramebuffer(e.DRAW_FRAMEBUFFER,at.__webglMultisampledFramebuffer)}else if(w.depthBuffer&&w.storeMultisampledDepthBuffer===!1&&l){let _=w.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,[_])}}}function Ie(w){return Math.min(s.maxSamples,w.samples)}function Ye(w){let _=i.get(w);return w.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&_.__useRenderToTexture!==!1}function L(w){let _=r.render.frame;u.get(w)!==_&&(u.set(w,_),w.update())}function _n(w,_){let I=w.colorSpace,k=w.format,X=w.type;return w.isCompressedTexture===!0||w.isVideoTexture===!0||I!==Zl&&I!==Ps&&(jt.getTransfer(I)===he?(k!==wi||X!==li)&&Nt("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Ot("WebGLTextures: Unsupported texture color space:",I)),_}function fe(w){return typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement?(c.width=w.naturalWidth||w.width,c.height=w.naturalHeight||w.height):typeof VideoFrame<"u"&&w instanceof VideoFrame?(c.width=w.displayWidth,c.height=w.displayHeight):(c.width=w.width,c.height=w.height),c}this.allocateTextureUnit=J,this.resetTextureUnits=V,this.getTextureUnits=U,this.setTextureUnits=G,this.setTexture2D=it,this.setTexture2DArray=P,this.setTexture3D=K,this.setTextureCube=$,this.rebindTextures=ae,this.setupRenderTarget=_e,this.updateRenderTargetMipmap=Jt,this.updateMultisampleRenderTarget=In,this.setupDepthRenderbuffer=qt,this.setupFrameBufferTexture=xt,this.useMultisampledRTT=Ye,this.isReversedDepthBuffer=function(){return n.buffers.depth.getReversed()}}function qR(e,t){function n(i,s=Ps){let a,r=jt.getTransfer(s);if(i===li)return e.UNSIGNED_BYTE;if(i===lf)return e.UNSIGNED_SHORT_4_4_4_4;if(i===cf)return e.UNSIGNED_SHORT_5_5_5_1;if(i===Fg)return e.UNSIGNED_INT_5_9_9_9_REV;if(i===kg)return e.UNSIGNED_INT_10F_11F_11F_REV;if(i===Bg)return e.BYTE;if(i===zg)return e.SHORT;if(i===Uo)return e.UNSIGNED_SHORT;if(i===of)return e.INT;if(i===ki)return e.UNSIGNED_INT;if(i===Hi)return e.FLOAT;if(i===Vi)return e.HALF_FLOAT;if(i===Hg)return e.ALPHA;if(i===Vg)return e.RGB;if(i===wi)return e.RGBA;if(i===ns)return e.DEPTH_COMPONENT;if(i===La)return e.DEPTH_STENCIL;if(i===Gg)return e.RED;if(i===uf)return e.RED_INTEGER;if(i===Ua)return e.RG;if(i===hf)return e.RG_INTEGER;if(i===ff)return e.RGBA_INTEGER;if(i===fc||i===dc||i===pc||i===mc)if(r===he)if(a=t.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(i===fc)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===dc)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===pc)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===mc)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=t.get("WEBGL_compressed_texture_s3tc"),a!==null){if(i===fc)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===dc)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===pc)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===mc)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===df||i===pf||i===mf||i===gf)if(a=t.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(i===df)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===pf)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===mf)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===gf)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===yf||i===xf||i===vf||i===_f||i===bf||i===gc||i===Sf)if(a=t.get("WEBGL_compressed_texture_etc"),a!==null){if(i===yf||i===xf)return r===he?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(i===vf)return r===he?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC;if(i===_f)return a.COMPRESSED_R11_EAC;if(i===bf)return a.COMPRESSED_SIGNED_R11_EAC;if(i===gc)return a.COMPRESSED_RG11_EAC;if(i===Sf)return a.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===Mf||i===Ef||i===Tf||i===Af||i===wf||i===Cf||i===Rf||i===Df||i===Nf||i===Lf||i===Uf||i===Of||i===If||i===Pf)if(a=t.get("WEBGL_compressed_texture_astc"),a!==null){if(i===Mf)return r===he?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Ef)return r===he?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Tf)return r===he?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Af)return r===he?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===wf)return r===he?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Cf)return r===he?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Rf)return r===he?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Df)return r===he?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Nf)return r===he?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Lf)return r===he?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Uf)return r===he?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Of)return r===he?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===If)return r===he?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Pf)return r===he?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Bf||i===zf||i===Ff)if(a=t.get("EXT_texture_compression_bptc"),a!==null){if(i===Bf)return r===he?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===zf)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Ff)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===kf||i===Hf||i===yc||i===Vf)if(a=t.get("EXT_texture_compression_rgtc"),a!==null){if(i===kf)return a.COMPRESSED_RED_RGTC1_EXT;if(i===Hf)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===yc)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Vf)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Oo?e.UNSIGNED_INT_24_8:e[i]!==void 0?e[i]:null}return{convert:n}}var YR=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,ZR=`
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

}`,u0=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,n){if(this.texture===null){let i=new ac(t.texture);(t.depthNear!==n.depthNear||t.depthFar!==n.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=i}}getMesh(t){if(this.texture!==null&&this.mesh===null){let n=t.cameras[0].viewport,i=new ri({vertexShader:YR,fragmentShader:ZR,uniforms:{depthColor:{value:this.texture},depthWidth:{value:n.z},depthHeight:{value:n.w}}});this.mesh=new an(new Ta(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},h0=class extends is{constructor(t,n){super();let i=this,s=null,a=1,r=null,o="local-floor",l=1,c=null,u=null,f=null,h=null,d=null,m=null,b=typeof XRWebGLBinding<"u",g=new u0,p={},y=n.getContextAttributes(),S=null,v=null,E=[],T=[],C=new ie,x=null,A=null,R=new Wn;R.viewport=new Pe;let O=new Wn;O.viewport=new Pe;let F=[R,O],V=new nf,U=null,G=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Y){let et=E[Y];return et===void 0&&(et=new Co,E[Y]=et),et.getTargetRaySpace()},this.getControllerGrip=function(Y){let et=E[Y];return et===void 0&&(et=new Co,E[Y]=et),et.getGripSpace()},this.getHand=function(Y){let et=E[Y];return et===void 0&&(et=new Co,E[Y]=et),et.getHandSpace()};function J(Y){let et=T.indexOf(Y.inputSource);if(et===-1)return;let bt=E[et];bt!==void 0&&(bt.update(Y.inputSource,Y.frame,c||r),bt.dispatchEvent({type:Y.type,data:Y.inputSource}))}function q(){s.removeEventListener("select",J),s.removeEventListener("selectstart",J),s.removeEventListener("selectend",J),s.removeEventListener("squeeze",J),s.removeEventListener("squeezestart",J),s.removeEventListener("squeezeend",J),s.removeEventListener("end",q),s.removeEventListener("inputsourceschange",it);for(let Y=0;Y<E.length;Y++){let et=T[Y];et!==null&&(T[Y]=null,E[Y].disconnect(et))}U=null,G=null,g.reset();for(let Y in p)delete p[Y];if(t.setRenderTarget(S),d=null,h=null,f=null,s=null,v=null,re.stop(),i.isPresenting=!1,t.setPixelRatio(x),t.setSize(C.width,C.height,!1),A!==null){let Y=A.camera;Y.fov=A.fov,Y.zoom=A.zoom,Y.updateProjectionMatrix(),A=null}i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Y){a=Y,i.isPresenting===!0&&Nt("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Y){o=Y,i.isPresenting===!0&&Nt("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||r},this.setReferenceSpace=function(Y){c=Y},this.getBaseLayer=function(){return h!==null?h:d},this.getBinding=function(){return f===null&&b&&(f=new XRWebGLBinding(s,n)),f},this.getFrame=function(){return m},this.getSession=function(){return s},this.setSession=async function(Y){if(s=Y,s!==null){if(S=t.getRenderTarget(),s.addEventListener("select",J),s.addEventListener("selectstart",J),s.addEventListener("selectend",J),s.addEventListener("squeeze",J),s.addEventListener("squeezestart",J),s.addEventListener("squeezeend",J),s.addEventListener("end",q),s.addEventListener("inputsourceschange",it),y.xrCompatible!==!0&&await n.makeXRCompatible(),x=t.getPixelRatio(),t.getSize(C),b&&"createProjectionLayer"in XRWebGLBinding.prototype){let bt=null,Pt=null,xt=null;y.depth&&(xt=y.stencil?n.DEPTH24_STENCIL8:n.DEPTH_COMPONENT24,bt=y.stencil?La:ns,Pt=y.stencil?Oo:ki);let Wt={colorFormat:n.RGBA8,depthFormat:xt,scaleFactor:a};f=this.getBinding(),h=f.createProjectionLayer(Wt),s.updateRenderState({layers:[h]}),t.setPixelRatio(1),t.setSize(h.textureWidth,h.textureHeight,!1),v=new Xn(h.textureWidth,h.textureHeight,{format:wi,type:li,depthTexture:new Ea(h.textureWidth,h.textureHeight,Pt,void 0,void 0,void 0,void 0,void 0,void 0,bt),stencilBuffer:y.stencil,colorSpace:t.outputColorSpace,samples:y.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1,resolveStencilBuffer:h.ignoreDepthValues===!1,storeMultisampledDepthBuffer:h.ignoreDepthValues===!1,storeMultisampledStencilBuffer:h.ignoreDepthValues===!1})}else{let bt={antialias:y.antialias,alpha:!0,depth:y.depth,stencil:y.stencil,framebufferScaleFactor:a};d=new XRWebGLLayer(s,n,bt),s.updateRenderState({baseLayer:d}),t.setPixelRatio(1),t.setSize(d.framebufferWidth,d.framebufferHeight,!1),v=new Xn(d.framebufferWidth,d.framebufferHeight,{format:wi,type:li,colorSpace:t.outputColorSpace,stencilBuffer:y.stencil,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}v.isXRRenderTarget=!0,this.setFoveation(l),c=null,r=await s.requestReferenceSpace(o),re.setContext(s),re.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function it(Y){for(let et=0;et<Y.removed.length;et++){let bt=Y.removed[et],Pt=T.indexOf(bt);Pt>=0&&(T[Pt]=null,E[Pt].disconnect(bt))}for(let et=0;et<Y.added.length;et++){let bt=Y.added[et],Pt=T.indexOf(bt);if(Pt===-1){for(let Wt=0;Wt<E.length;Wt++)if(Wt>=T.length){T.push(bt),Pt=Wt;break}else if(T[Wt]===null){T[Wt]=bt,Pt=Wt;break}if(Pt===-1)break}let xt=E[Pt];xt&&xt.connect(bt)}}let P=new H,K=new H;function $(Y,et,bt){P.setFromMatrixPosition(et.matrixWorld),K.setFromMatrixPosition(bt.matrixWorld);let Pt=P.distanceTo(K),xt=et.projectionMatrix.elements,Wt=bt.projectionMatrix.elements,tn=xt[14]/(xt[10]-1),qt=xt[14]/(xt[10]+1),ae=(xt[9]+1)/xt[5],_e=(xt[9]-1)/xt[5],Jt=(xt[8]-1)/xt[0],Ne=(Wt[8]+1)/Wt[0],ln=tn*Jt,In=tn*Ne,Ie=Pt/(-Jt+Ne),Ye=Ie*-Jt;if(et.matrixWorld.decompose(Y.position,Y.quaternion,Y.scale),Y.translateX(Ye),Y.translateZ(Ie),Y.matrixWorld.compose(Y.position,Y.quaternion,Y.scale),Y.matrixWorldInverse.copy(Y.matrixWorld).invert(),xt[10]===-1)Y.projectionMatrix.copy(et.projectionMatrix),Y.projectionMatrixInverse.copy(et.projectionMatrixInverse);else{let L=tn+Ie,_n=qt+Ie,fe=ln-Ye,w=In+(Pt-Ye),_=ae*qt/_n*L,I=_e*qt/_n*L;Y.projectionMatrix.makePerspective(fe,w,_,I,L,_n),Y.projectionMatrixInverse.copy(Y.projectionMatrix).invert()}}function ht(Y,et){et===null?Y.matrixWorld.copy(Y.matrix):Y.matrixWorld.multiplyMatrices(et.matrixWorld,Y.matrix),Y.matrixWorldInverse.copy(Y.matrixWorld).invert()}this.updateCamera=function(Y){if(s===null)return;let et=Y.near,bt=Y.far;g.texture!==null&&(g.depthNear>0&&(et=g.depthNear),g.depthFar>0&&(bt=g.depthFar)),V.near=O.near=R.near=et,V.far=O.far=R.far=bt,(U!==V.near||G!==V.far)&&(s.updateRenderState({depthNear:V.near,depthFar:V.far}),U=V.near,G=V.far),V.layers.mask=Y.layers.mask|6,R.layers.mask=V.layers.mask&-5,O.layers.mask=V.layers.mask&-3;let Pt=Y.parent,xt=V.cameras;ht(V,Pt);for(let Wt=0;Wt<xt.length;Wt++)ht(xt[Wt],Pt);xt.length===2?$(V,R,O):V.projectionMatrix.copy(R.projectionMatrix),A===null&&Y.isPerspectiveCamera&&(A={camera:Y,fov:Y.fov,zoom:Y.zoom}),_t(Y,V,Pt)};function _t(Y,et,bt){bt===null?Y.matrix.copy(et.matrixWorld):(Y.matrix.copy(bt.matrixWorld),Y.matrix.invert(),Y.matrix.multiply(et.matrixWorld)),Y.matrix.decompose(Y.position,Y.quaternion,Y.scale),Y.updateMatrixWorld(!0),Y.projectionMatrix.copy(et.projectionMatrix),Y.projectionMatrixInverse.copy(et.projectionMatrixInverse),Y.isPerspectiveCamera&&(Y.fov=Ih*2*Math.atan(1/Y.projectionMatrix.elements[5]),Y.zoom=1)}this.getCamera=function(){return V},this.getFoveation=function(){if(!(h===null&&d===null))return l},this.setFoveation=function(Y){l=Y,h!==null&&(h.fixedFoveation=Y),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=Y)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(V)},this.getCameraTexture=function(Y){return p[Y]};let Gt=null;function Vt(Y,et){if(u=et.getViewerPose(c||r),m=et,u!==null){let bt=u.views;d!==null&&(t.setRenderTargetFramebuffer(v,d.framebuffer),t.setRenderTarget(v));let Pt=!1;bt.length!==V.cameras.length&&(V.cameras.length=0,Pt=!0);for(let qt=0;qt<bt.length;qt++){let ae=bt[qt],_e=null;if(d!==null)_e=d.getViewport(ae);else{let Ne=f.getViewSubImage(h,ae);_e=Ne.viewport,qt===0&&(t.setRenderTargetTextures(v,Ne.colorTexture,Ne.depthStencilTexture),t.setRenderTarget(v))}let Jt=F[qt];Jt===void 0&&(Jt=new Wn,Jt.layers.enable(qt),Jt.viewport=new Pe,F[qt]=Jt),Jt.matrix.fromArray(ae.transform.matrix),Jt.matrix.decompose(Jt.position,Jt.quaternion,Jt.scale),Jt.projectionMatrix.fromArray(ae.projectionMatrix),Jt.projectionMatrixInverse.copy(Jt.projectionMatrix).invert(),Jt.viewport.set(_e.x,_e.y,_e.width,_e.height),qt===0&&(V.matrix.copy(Jt.matrix),V.matrix.decompose(V.position,V.quaternion,V.scale)),Pt===!0&&V.cameras.push(Jt)}let xt=s.enabledFeatures;if(xt&&xt.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&b){f=i.getBinding();let qt=f.getDepthInformation(bt[0]);qt&&qt.isValid&&qt.texture&&g.init(qt,s.renderState)}if(xt&&xt.includes("camera-access")&&b){t.state.unbindTexture(),f=i.getBinding();for(let qt=0;qt<bt.length;qt++){let ae=bt[qt].camera;if(ae){let _e=p[ae];_e||(_e=new ac,p[ae]=_e);let Jt=f.getCameraImage(ae);_e.sourceTexture=Jt}}}}for(let bt=0;bt<E.length;bt++){let Pt=T[bt],xt=E[bt];Pt!==null&&xt!==void 0&&xt.update(Pt,et,c||r)}Gt&&Gt(Y,et),et.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:et}),m=null}let re=new e1;re.setAnimationLoop(Vt),this.setAnimationLoop=function(Y){Gt=Y},this.dispose=function(){}}},KR=new We,o1=new It;o1.set(-1,0,0,0,1,0,0,0,1);function JR(e,t){function n(g,p){g.matrixAutoUpdate===!0&&g.updateMatrix(),p.value.copy(g.matrix)}function i(g,p){p.color.getRGB(g.fogColor.value,Yg(e)),p.isFog?(g.fogNear.value=p.near,g.fogFar.value=p.far):p.isFogExp2&&(g.fogDensity.value=p.density)}function s(g,p,y,S,v){p.isNodeMaterial?p.uniformsNeedUpdate=!1:p.isMeshBasicMaterial?a(g,p):p.isMeshLambertMaterial?(a(g,p),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)):p.isMeshToonMaterial?(a(g,p),f(g,p)):p.isMeshPhongMaterial?(a(g,p),u(g,p),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)):p.isMeshStandardMaterial?(a(g,p),h(g,p),p.isMeshPhysicalMaterial&&d(g,p,v)):p.isMeshMatcapMaterial?(a(g,p),m(g,p)):p.isMeshDepthMaterial?a(g,p):p.isMeshDistanceMaterial?(a(g,p),b(g,p)):p.isMeshNormalMaterial?a(g,p):p.isLineBasicMaterial?(r(g,p),p.isLineDashedMaterial&&o(g,p)):p.isPointsMaterial?l(g,p,y,S):p.isSpriteMaterial?c(g,p):p.isShadowMaterial?(g.color.value.copy(p.color),g.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function a(g,p){g.opacity.value=p.opacity,p.color&&g.diffuse.value.copy(p.color),p.emissive&&g.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(g.map.value=p.map,n(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,n(p.alphaMap,g.alphaMapTransform)),p.bumpMap&&(g.bumpMap.value=p.bumpMap,n(p.bumpMap,g.bumpMapTransform),g.bumpScale.value=p.bumpScale,p.side===Un&&(g.bumpScale.value*=-1)),p.normalMap&&(g.normalMap.value=p.normalMap,n(p.normalMap,g.normalMapTransform),g.normalScale.value.copy(p.normalScale),p.side===Un&&g.normalScale.value.negate()),p.displacementMap&&(g.displacementMap.value=p.displacementMap,n(p.displacementMap,g.displacementMapTransform),g.displacementScale.value=p.displacementScale,g.displacementBias.value=p.displacementBias),p.emissiveMap&&(g.emissiveMap.value=p.emissiveMap,n(p.emissiveMap,g.emissiveMapTransform)),p.specularMap&&(g.specularMap.value=p.specularMap,n(p.specularMap,g.specularMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest);let y=t.get(p),S=y.envMap,v=y.envMapRotation;S&&(g.envMap.value=S,g.envMapRotation.value.setFromMatrix4(KR.makeRotationFromEuler(v)).transpose(),S.isCubeTexture&&S.isRenderTargetTexture===!1&&g.envMapRotation.value.premultiply(o1),g.reflectivity.value=p.reflectivity,g.ior.value=p.ior,g.refractionRatio.value=p.refractionRatio),p.lightMap&&(g.lightMap.value=p.lightMap,g.lightMapIntensity.value=p.lightMapIntensity,n(p.lightMap,g.lightMapTransform)),p.aoMap&&(g.aoMap.value=p.aoMap,g.aoMapIntensity.value=p.aoMapIntensity,n(p.aoMap,g.aoMapTransform))}function r(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,p.map&&(g.map.value=p.map,n(p.map,g.mapTransform))}function o(g,p){g.dashSize.value=p.dashSize,g.totalSize.value=p.dashSize+p.gapSize,g.scale.value=p.scale}function l(g,p,y,S){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.size.value=p.size*y,g.scale.value=S*.5,p.map&&(g.map.value=p.map,n(p.map,g.uvTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,n(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function c(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.rotation.value=p.rotation,p.map&&(g.map.value=p.map,n(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,n(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function u(g,p){g.specular.value.copy(p.specular),g.shininess.value=Math.max(p.shininess,1e-4)}function f(g,p){p.gradientMap&&(g.gradientMap.value=p.gradientMap)}function h(g,p){g.metalness.value=p.metalness,p.metalnessMap&&(g.metalnessMap.value=p.metalnessMap,n(p.metalnessMap,g.metalnessMapTransform)),g.roughness.value=p.roughness,p.roughnessMap&&(g.roughnessMap.value=p.roughnessMap,n(p.roughnessMap,g.roughnessMapTransform)),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)}function d(g,p,y){g.ior.value=p.ior,p.sheen>0&&(g.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),g.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(g.sheenColorMap.value=p.sheenColorMap,n(p.sheenColorMap,g.sheenColorMapTransform)),p.sheenRoughnessMap&&(g.sheenRoughnessMap.value=p.sheenRoughnessMap,n(p.sheenRoughnessMap,g.sheenRoughnessMapTransform))),p.clearcoat>0&&(g.clearcoat.value=p.clearcoat,g.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(g.clearcoatMap.value=p.clearcoatMap,n(p.clearcoatMap,g.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,n(p.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(g.clearcoatNormalMap.value=p.clearcoatNormalMap,n(p.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Un&&g.clearcoatNormalScale.value.negate())),p.dispersion>0&&(g.dispersion.value=p.dispersion),p.retroreflectivity>0&&(g.retroreflectivity.value=p.retroreflectivity),p.iridescence>0&&(g.iridescence.value=p.iridescence,g.iridescenceIOR.value=p.iridescenceIOR,g.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(g.iridescenceMap.value=p.iridescenceMap,n(p.iridescenceMap,g.iridescenceMapTransform)),p.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=p.iridescenceThicknessMap,n(p.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),p.transmission>0&&(g.transmission.value=p.transmission,g.transmissionSamplerMap.value=y.texture,g.transmissionSamplerSize.value.set(y.width,y.height),p.transmissionMap&&(g.transmissionMap.value=p.transmissionMap,n(p.transmissionMap,g.transmissionMapTransform)),g.thickness.value=p.thickness,p.thicknessMap&&(g.thicknessMap.value=p.thicknessMap,n(p.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=p.attenuationDistance,g.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(g.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(g.anisotropyMap.value=p.anisotropyMap,n(p.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=p.specularIntensity,g.specularColor.value.copy(p.specularColor),p.specularColorMap&&(g.specularColorMap.value=p.specularColorMap,n(p.specularColorMap,g.specularColorMapTransform)),p.specularIntensityMap&&(g.specularIntensityMap.value=p.specularIntensityMap,n(p.specularIntensityMap,g.specularIntensityMapTransform))}function m(g,p){p.matcap&&(g.matcap.value=p.matcap)}function b(g,p){let y=t.get(p).light;g.referencePosition.value.setFromMatrixPosition(y.matrixWorld),g.nearDistance.value=y.shadow.camera.near,g.farDistance.value=y.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function QR(e,t,n,i){let s={},a={},r=[],o=e.getParameter(e.MAX_UNIFORM_BUFFER_BINDINGS);function l(v,E){let T=E.program;i.uniformBlockBinding(v,T)}function c(v,E){let T=s[v.id];T===void 0&&(g(v),T=u(v),s[v.id]=T,v.addEventListener("dispose",y));let C=E.program;i.updateUBOMapping(v,C);let x=t.render.frame;a[v.id]!==x&&(h(v),a[v.id]=x)}function u(v){let E=f();v.__bindingPointIndex=E;let T=e.createBuffer(),C=v.__size,x=v.usage;return e.bindBuffer(e.UNIFORM_BUFFER,T),e.bufferData(e.UNIFORM_BUFFER,C,x),e.bindBuffer(e.UNIFORM_BUFFER,null),e.bindBufferBase(e.UNIFORM_BUFFER,E,T),T}function f(){for(let v=0;v<o;v++)if(r.indexOf(v)===-1)return r.push(v),v;return Ot("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function h(v){let E=s[v.id],T=v.uniforms,C=v.__cache;e.bindBuffer(e.UNIFORM_BUFFER,E);for(let x=0,A=T.length;x<A;x++){let R=T[x];if(Array.isArray(R))for(let O=0,F=R.length;O<F;O++)d(R[O],x,O,C);else d(R,x,0,C)}e.bindBuffer(e.UNIFORM_BUFFER,null)}function d(v,E,T,C){if(b(v,E,T,C)===!0){let x=v.__offset,A=v.value;if(Array.isArray(A)){let R=0;for(let O=0;O<A.length;O++){let F=A[O],V=p(F);m(F,v.__data,R),typeof F!="number"&&typeof F!="boolean"&&!F.isMatrix3&&!ArrayBuffer.isView(F)&&(R+=V.storage/Float32Array.BYTES_PER_ELEMENT)}}else m(A,v.__data,0);e.bufferSubData(e.UNIFORM_BUFFER,x,v.__data)}}function m(v,E,T){typeof v=="number"||typeof v=="boolean"?E[0]=v:v.isMatrix3?(E[0]=v.elements[0],E[1]=v.elements[1],E[2]=v.elements[2],E[3]=0,E[4]=v.elements[3],E[5]=v.elements[4],E[6]=v.elements[5],E[7]=0,E[8]=v.elements[6],E[9]=v.elements[7],E[10]=v.elements[8],E[11]=0):ArrayBuffer.isView(v)?E.set(new v.constructor(v.buffer,v.byteOffset,E.length)):v.toArray(E,T)}function b(v,E,T,C){let x=v.value,A=E+"_"+T;if(C[A]===void 0)return typeof x=="number"||typeof x=="boolean"?C[A]=x:ArrayBuffer.isView(x)?C[A]=x.slice():C[A]=x.clone(),!0;{let R=C[A];if(typeof x=="number"||typeof x=="boolean"){if(R!==x)return C[A]=x,!0}else{if(ArrayBuffer.isView(x))return!0;if(R.equals(x)===!1)return R.copy(x),!0}}return!1}function g(v){let E=v.uniforms,T=0,C=16;for(let A=0,R=E.length;A<R;A++){let O=Array.isArray(E[A])?E[A]:[E[A]];for(let F=0,V=O.length;F<V;F++){let U=O[F],G=Array.isArray(U.value)?U.value:[U.value];for(let J=0,q=G.length;J<q;J++){let it=G[J],P=p(it),K=T%C,$=K%P.boundary,ht=K+$;T+=$,ht!==0&&C-ht<P.storage&&(T+=C-ht),U.__data=new Float32Array(P.storage/Float32Array.BYTES_PER_ELEMENT),U.__offset=T,T+=P.storage}}}let x=T%C;return x>0&&(T+=C-x),v.__size=T,v.__cache={},this}function p(v){let E={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(E.boundary=4,E.storage=4):v.isVector2?(E.boundary=8,E.storage=8):v.isVector3||v.isColor?(E.boundary=16,E.storage=12):v.isVector4?(E.boundary=16,E.storage=16):v.isMatrix3?(E.boundary=48,E.storage=48):v.isMatrix4?(E.boundary=64,E.storage=64):v.isTexture?Nt("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(v)?(E.boundary=16,E.storage=v.byteLength):Nt("WebGLRenderer: Unsupported uniform value type.",v),E}function y(v){let E=v.target;E.removeEventListener("dispose",y);let T=r.indexOf(E.__bindingPointIndex);r.splice(T,1),e.deleteBuffer(s[E.id]),delete s[E.id],delete a[E.id]}function S(){for(let v in s)e.deleteBuffer(s[v]);r=[],s={},a={}}return{bind:l,update:c,dispose:S}}var jR=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),rs=null;function $R(){return rs===null&&(rs=new kh(jR,16,16,Ua,Vi),rs.name="DFG_LUT",rs.minFilter=vn,rs.magFilter=vn,rs.wrapS=es,rs.wrapT=es,rs.generateMipmaps=!1,rs.needsUpdate=!0),rs}var Kf=class{constructor(t={}){let{canvas:n=AS(),context:i=null,depth:s=!0,stencil:a=!1,alpha:r=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:f=!1,reversedDepthBuffer:h=!1,outputBufferType:d=li}=t;this.isWebGLRenderer=!0;let m;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");m=i.getContextAttributes().alpha}else m=r;let b=d,g=new Set([ff,hf,uf]),p=new Set([li,ki,Uo,Oo,lf,cf]),y=new Uint32Array(4),S=new Int32Array(4),v=new H,E=null,T=null,C=[],x=[],A=null;this.domElement=n,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Fi,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let R=this,O=!1,F=null,V=null,U=null,G=null;this._outputColorSpace=Tn;let J=0,q=0,it=null,P=-1,K=null,$=new Pe,ht=new Pe,_t=null,Gt=new se(0),Vt=0,re=n.width,Y=n.height,et=1,bt=null,Pt=null,xt=new Pe(0,0,re,Y),Wt=new Pe(0,0,re,Y),tn=!1,qt=new ic,ae=!1,_e=!1,Jt=new We,Ne=new H,ln=new Pe,In={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Ie=!1;function Ye(){return it===null?et:1}let L=i;function _n(M,D){return n.getContext(M,D)}let fe,w,_,I,k,X,st,at,Z,j,ot,At,ft,lt,wt,Dt,zt,N,ct,Q,ut,gt,nt;try{let M={alpha:!0,depth:s,stencil:a,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:f};if("setAttribute"in n&&n.setAttribute("data-engine",`three.js r${"186"}`),n.addEventListener("webglcontextlost",be,!1),n.addEventListener("webglcontextrestored",ce,!1),n.addEventListener("webglcontextcreationerror",Ci,!1),L===null){let D="webgl2";if(L=_n(D,M),L===null)throw _n(D)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}Ct()}catch(M){throw n.removeEventListener("webglcontextlost",be,!1),n.removeEventListener("webglcontextrestored",ce,!1),n.removeEventListener("webglcontextcreationerror",Ci,!1),Ot("WebGLRenderer: "+M.message),M}function Ct(){fe=new rC(L),fe.init(),ut=new qR(L,fe),w=new J2(L,fe,t,ut),_=new WR(L,fe),w.reversedDepthBuffer&&h&&_.buffers.depth.setReversed(!0),V=L.createFramebuffer(),U=L.createFramebuffer(),G=L.createFramebuffer(),I=new cC(L),k=new DR,X=new XR(L,fe,_,k,w,ut,I),st=new aC(R),at=new hA(L),gt=new Z2(L,at),Z=new oC(L,at,I,gt),j=new hC(L,Z,at,gt,I),N=new uC(L,w,X),wt=new Q2(k),ot=new RR(R,st,fe,w,gt,wt),At=new JR(R,k),ft=new LR,lt=new zR(fe),zt=new Y2(R,st,_,j,m,l),Dt=new GR(R,j,w),nt=new QR(L,I,w,_),ct=new K2(L,fe,I),Q=new lC(L,fe,I),I.programs=ot.programs,R.capabilities=w,R.extensions=fe,R.properties=k,R.renderLists=ft,R.shadowMap=Dt,R.state=_,R.info=I}b!==li&&(A=new dC(b,n.width,n.height,o,s,a));let Et=new h0(R,L);this.xr=Et,this.getContext=function(){return L},this.getContextAttributes=function(){return L.getContextAttributes()},this.forceContextLoss=function(){let M=fe.get("WEBGL_lose_context");M&&M.loseContext()},this.forceContextRestore=function(){let M=fe.get("WEBGL_lose_context");M&&M.restoreContext()},this.getPixelRatio=function(){return et},this.setPixelRatio=function(M){M!==void 0&&(et=M,this.setSize(re,Y,!1))},this.getSize=function(M){return M.set(re,Y)},this.setSize=function(M,D,W=!0){if(Et.isPresenting){Nt("WebGLRenderer: Can't change size while VR device is presenting.");return}re=M,Y=D,n.width=Math.floor(M*et),n.height=Math.floor(D*et),W===!0&&(n.style.width=M+"px",n.style.height=D+"px"),A!==null&&A.setSize(n.width,n.height),this.setViewport(0,0,M,D)},this.getDrawingBufferSize=function(M){return M.set(re*et,Y*et).floor()},this.setDrawingBufferSize=function(M,D,W){re=M,Y=D,et=W,n.width=Math.floor(M*W),n.height=Math.floor(D*W),this.setViewport(0,0,M,D)},this.setEffects=function(M){if(b===li){Ot("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(M){for(let D=0;D<M.length;D++)if(M[D].isOutputPass===!0){Nt("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}A.setEffects(M||[])},this.getCurrentViewport=function(M){return M.copy($)},this.getViewport=function(M){return M.copy(xt)},this.setViewport=function(M,D,W,B){M.isVector4?xt.set(M.x,M.y,M.z,M.w):xt.set(M,D,W,B),_.viewport($.copy(xt).multiplyScalar(et).round())},this.getScissor=function(M){return M.copy(Wt)},this.setScissor=function(M,D,W,B){M.isVector4?Wt.set(M.x,M.y,M.z,M.w):Wt.set(M,D,W,B),_.scissor(ht.copy(Wt).multiplyScalar(et).round())},this.getScissorTest=function(){return tn},this.setScissorTest=function(M){_.setScissorTest(tn=M)},this.setOpaqueSort=function(M){bt=M},this.setTransparentSort=function(M){Pt=M},this.getClearColor=function(M){return M.copy(zt.getClearColor())},this.setClearColor=function(){zt.setClearColor(...arguments)},this.getClearAlpha=function(){return zt.getClearAlpha()},this.setClearAlpha=function(){zt.setClearAlpha(...arguments)},this.clear=function(M=!0,D=!0,W=!0){let B=0;if(M){let z=!1;if(it!==null){let mt=it.texture.format;z=g.has(mt)}if(z){let mt=it.texture.type,vt=p.has(mt),pt=zt.getClearColor(),St=zt.getClearAlpha(),Tt=pt.r,kt=pt.g,Yt=pt.b;vt?(y[0]=Tt,y[1]=kt,y[2]=Yt,y[3]=St,L.clearBufferuiv(L.COLOR,0,y)):(S[0]=Tt,S[1]=kt,S[2]=Yt,S[3]=St,L.clearBufferiv(L.COLOR,0,S))}else B|=L.COLOR_BUFFER_BIT}D&&(B|=L.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),W&&(B|=L.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),B!==0&&L.clear(B)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(M){M.setRenderer(this),F=M},this.dispose=function(){n.removeEventListener("webglcontextlost",be,!1),n.removeEventListener("webglcontextrestored",ce,!1),n.removeEventListener("webglcontextcreationerror",Ci,!1),zt.dispose(),ft.dispose(),lt.dispose(),k.dispose(),st.dispose(),j.dispose(),gt.dispose(),nt.dispose(),ot.dispose(),Et.dispose(),Et.removeEventListener("sessionstart",p0),Et.removeEventListener("sessionend",m0),Oa.stop()};function be(M){M.preventDefault(),qg("WebGLRenderer: Context Lost."),O=!0}function ce(){qg("WebGLRenderer: Context Restored."),O=!1;let M=I.autoReset,D=Dt.enabled,W=Dt.autoUpdate,B=Dt.needsUpdate,z=Dt.type;Ct(),I.autoReset=M,Dt.enabled=D,Dt.autoUpdate=W,Dt.needsUpdate=B,Dt.type=z}function Ci(M){Ot("WebGLRenderer: A WebGL context could not be created. Reason: ",M.statusMessage)}function Gi(M){let D=M.target;D.removeEventListener("dispose",Gi),_1(D)}function _1(M){b1(M),k.remove(M)}function b1(M){let D=k.get(M).programs;D!==void 0&&(D.forEach(function(W){ot.releaseProgram(W)}),M.isShaderMaterial&&ot.releaseShaderCache(M))}this.renderBufferDirect=function(M,D,W,B,z,mt){D===null&&(D=In);let vt=z.isMesh&&z.matrixWorld.determinantAffine()<0,pt=E1(M,D,W,B,z);_.setMaterial(B,vt);let St=W.index,Tt=1;if(B.wireframe===!0){if(St=Z.getWireframeAttribute(W),St===void 0)return;Tt=2}let kt=W.drawRange,Yt=W.attributes.position,Mt=kt.start*Tt,ue=(kt.start+kt.count)*Tt;mt!==null&&(Mt=Math.max(Mt,mt.start*Tt),ue=Math.min(ue,(mt.start+mt.count)*Tt)),St!==null?(Mt=Math.max(Mt,0),ue=Math.min(ue,St.count)):Yt!=null&&(Mt=Math.max(Mt,0),ue=Math.min(ue,Yt.count));let Ze=ue-Mt;if(Ze<0||Ze===1/0)return;gt.setup(z,B,pt,W,St);let Ee,xe=ct;if(St!==null&&(Ee=at.get(St),xe=Q,xe.setIndex(Ee)),z.isMesh)B.wireframe===!0?(_.setLineWidth(B.wireframeLinewidth*Ye()),xe.setMode(L.LINES)):xe.setMode(L.TRIANGLES);else if(z.isLine){let bn=B.linewidth;bn===void 0&&(bn=1),_.setLineWidth(bn*Ye()),z.isLineSegments?xe.setMode(L.LINES):z.isLineLoop?xe.setMode(L.LINE_LOOP):xe.setMode(L.LINE_STRIP)}else z.isPoints?xe.setMode(L.POINTS):z.isSprite&&xe.setMode(L.TRIANGLES);if(z.isBatchedMesh)if(fe.get("WEBGL_multi_draw"))xe.renderMultiDraw(z._multiDrawStarts,z._multiDrawCounts,z._multiDrawCount);else{let bn=z._multiDrawStarts,yt=z._multiDrawCounts,Cn=z._multiDrawCount,ee=St?at.get(St).bytesPerElement:1,ci=k.get(B).currentProgram.getUniforms();for(let Wi=0;Wi<Cn;Wi++)ci.setValue(L,"_gl_DrawID",Wi),xe.render(bn[Wi]/ee,yt[Wi])}else if(z.isInstancedMesh)xe.renderInstances(Mt,Ze,z.count);else if(W.isInstancedBufferGeometry){let bn=W._maxInstanceCount!==void 0?W._maxInstanceCount:1/0,yt=Math.min(W.instanceCount,bn);xe.renderInstances(Mt,Ze,yt)}else xe.render(Mt,Ze)};function d0(M,D,W,B){F!==null&&M.isNodeMaterial&&F.setObject(B,M),ae===!0&&wt.setState(M,W,!1),M.transparent===!0&&M.side===Ai&&M.forceSinglePass===!1?(M.side=Un,M.needsUpdate=!0,Ec(M,D,B),M.side=Ra,M.needsUpdate=!0,Ec(M,D,B),M.side=Ai):Ec(M,D,B)}this.compile=function(M,D,W=null){W===null&&(W=M),F!==null&&F.renderStart(M,D,W),T=lt.get(W),T.init(D),x.push(T),W.traverseVisible(function(z){z.isLight&&z.layers.test(D.layers)&&(T.pushLight(z),z.castShadow&&T.pushShadow(z))}),M!==W&&M.traverseVisible(function(z){z.isLight&&z.layers.test(D.layers)&&(T.pushLight(z),z.castShadow&&T.pushShadow(z))}),T.setupLights(),F!==null&&F.updateLights(T.state.lightsArray),_e=this.localClippingEnabled,ae=wt.init(this.clippingPlanes,_e),ae===!0&&wt.setGlobalState(this.clippingPlanes,D),F!==null&&Dt.render(T.state.shadowsArray,W,D);let B=new Set;return M.traverse(function(z){if(!(z.isMesh||z.isPoints||z.isLine||z.isSprite))return;let mt=z.material;if(mt)if(Array.isArray(mt))for(let vt=0;vt<mt.length;vt++){let pt=mt[vt];d0(pt,W,D,z),B.add(pt)}else d0(mt,W,D,z),B.add(mt)}),T=x.pop(),F!==null&&F.renderEnd(),B},this.compileAsync=function(M,D,W=null){let B=this.compile(M,D,W);return new Promise(z=>{function mt(){if(B.forEach(function(vt){let St=k.get(vt).currentProgram;(St===void 0||St.isReady())&&B.delete(vt)}),B.size===0){z(M);return}setTimeout(mt,10)}fe.get("KHR_parallel_shader_compile")!==null?mt():setTimeout(mt,10)})};let ed=null;function S1(M){ed&&ed(M)}function p0(){Oa.stop()}function m0(){Oa.start()}let Oa=new e1;Oa.setAnimationLoop(S1),typeof self<"u"&&Oa.setContext(self),this.setAnimationLoop=function(M){ed=M,Et.setAnimationLoop(M),M===null?Oa.stop():Oa.start()},Et.addEventListener("sessionstart",p0),Et.addEventListener("sessionend",m0),this.render=function(M,D){if(D!==void 0&&D.isCamera!==!0){Ot("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(O===!0)return;F!==null&&F.renderStart(M,D);let W=Et.enabled===!0&&Et.isPresenting===!0,B=A!==null&&(it===null||W)&&A.begin(R,it);if(M.matrixWorldAutoUpdate===!0&&M.updateMatrixWorld(),D.parent===null&&D.matrixWorldAutoUpdate===!0&&D.updateMatrixWorld(),Et.enabled===!0&&Et.isPresenting===!0&&(A===null||A.isCompositing()===!1)&&(Et.cameraAutoUpdate===!0&&Et.updateCamera(D),D=Et.getCamera()),M.isScene===!0&&M.onBeforeRender(R,M,D,it),T=lt.get(M,x.length),T.init(D),T.state.textureUnits=X.getTextureUnits(),x.push(T),Jt.multiplyMatrices(D.projectionMatrix,D.matrixWorldInverse),qt.setFromProjectionMatrix(Jt,zi,D.reversedDepth),_e=this.localClippingEnabled,ae=wt.init(this.clippingPlanes,_e),E=ft.get(M,C.length),E.init(),C.push(E),Et.enabled===!0&&Et.isPresenting===!0){let vt=R.xr.getDepthSensingMesh();vt!==null&&nd(vt,D,-1/0,R.sortObjects)}nd(M,D,0,R.sortObjects),E.finish(),F!==null&&F.updateLights(T.state.lightsArray),R.sortObjects===!0&&E.sort(bt,Pt),Ie=Et.enabled===!1||Et.isPresenting===!1||Et.hasDepthSensing()===!1,Ie&&zt.addToRenderList(E,M),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),ae===!0&&wt.beginShadows();let z=T.state.shadowsArray;if(Dt.render(z,M,D),ae===!0&&wt.endShadows(),(B&&A.hasRenderPass())===!1){let vt=E.opaque,pt=E.transmissive;if(T.setupLights(),D.isArrayCamera){let St=D.cameras;if(pt.length>0)for(let Tt=0,kt=St.length;Tt<kt;Tt++){let Yt=St[Tt];y0(vt,pt,M,Yt)}Ie&&zt.render(M);for(let Tt=0,kt=St.length;Tt<kt;Tt++){let Yt=St[Tt];g0(E,M,Yt,Yt.viewport)}}else pt.length>0&&y0(vt,pt,M,D),Ie&&zt.render(M),g0(E,M,D)}it!==null&&q===0&&(X.updateMultisampleRenderTarget(it),X.updateRenderTargetMipmap(it)),B&&A.end(R),M.isScene===!0&&M.onAfterRender(R,M,D),gt.resetDefaultState(),P=-1,K=null,x.pop(),x.length>0?(T=x[x.length-1],X.setTextureUnits(T.state.textureUnits),ae===!0&&wt.setGlobalState(R.clippingPlanes,T.state.camera)):T=null,C.pop(),C.length>0?E=C[C.length-1]:E=null,F!==null&&F.renderEnd()};function nd(M,D,W,B){if(M.visible===!1)return;if(M.layers.test(D.layers)){if(M.isGroup)W=M.renderOrder;else if(M.isLOD)M.autoUpdate===!0&&M.update(D);else if(M.isLightProbeGrid)T.pushLightProbeGrid(M);else if(M.isLight)T.pushLight(M),M.castShadow&&T.pushShadow(M);else if(M.isSprite){if(!M.frustumCulled||M.intersectsFrustum(qt)){B&&ln.setFromMatrixPosition(M.matrixWorld).applyMatrix4(Jt);let vt=j.update(M),pt=M.material;pt.visible&&E.push(M,vt,pt,W,ln.z,null,D)}}else if((M.isMesh||M.isLine||M.isPoints)&&(!M.frustumCulled||M.intersectsFrustum(qt))){let vt=j.update(M),pt=M.material;if(B&&(M.boundingSphere!==void 0?(M.boundingSphere===null&&M.computeBoundingSphere(),ln.copy(M.boundingSphere.center)):(vt.boundingSphere===null&&vt.computeBoundingSphere(),ln.copy(vt.boundingSphere.center)),ln.applyMatrix4(M.matrixWorld).applyMatrix4(Jt)),Array.isArray(pt)){let St=vt.groups;for(let Tt=0,kt=St.length;Tt<kt;Tt++){let Yt=St[Tt],Mt=pt[Yt.materialIndex];Mt&&Mt.visible&&E.push(M,vt,Mt,W,ln.z,Yt,D)}}else pt.visible&&E.push(M,vt,pt,W,ln.z,null,D)}}let mt=M.children;for(let vt=0,pt=mt.length;vt<pt;vt++)nd(mt[vt],D,W,B)}function g0(M,D,W,B){let{opaque:z,transmissive:mt,transparent:vt}=M;T.setupLightsView(W),ae===!0&&wt.setGlobalState(R.clippingPlanes,W),B&&_.viewport($.copy(B)),z.length>0&&Mc(z,D,W),mt.length>0&&Mc(mt,D,W),vt.length>0&&Mc(vt,D,W),_.buffers.depth.setTest(!0),_.buffers.depth.setMask(!0),_.buffers.color.setMask(!0),_.setPolygonOffset(!1)}function y0(M,D,W,B){if((W.isScene===!0?W.overrideMaterial:null)!==null)return;if(T.state.transmissionRenderTarget[B.id]===void 0){let Mt=fe.has("EXT_color_buffer_half_float")||fe.has("EXT_color_buffer_float");T.state.transmissionRenderTarget[B.id]=new Xn(1,1,{generateMipmaps:!0,type:Mt?Vi:li,minFilter:Na,samples:Math.max(4,w.samples),stencilBuffer:a,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:jt.workingColorSpace})}let mt=T.state.transmissionRenderTarget[B.id],vt=B.viewport||$;mt.setSize(vt.z*R.transmissionResolutionScale,vt.w*R.transmissionResolutionScale);let pt=R.getRenderTarget(),St=R.getActiveCubeFace(),Tt=R.getActiveMipmapLevel();R.setRenderTarget(mt),R.getClearColor(Gt),Vt=R.getClearAlpha(),Vt<1&&R.setClearColor(16777215,.5),R.clear(),Ie&&zt.render(W);let kt=R.toneMapping;R.toneMapping=Fi;let Yt=B.viewport;if(B.viewport!==void 0&&(B.viewport=void 0),T.setupLightsView(B),ae===!0&&wt.setGlobalState(R.clippingPlanes,B),Mc(M,W,B),X.updateMultisampleRenderTarget(mt),X.updateRenderTargetMipmap(mt),fe.has("WEBGL_multisampled_render_to_texture")===!1){let Mt=!1;for(let ue=0,Ze=D.length;ue<Ze;ue++){let Ee=D[ue],{object:xe,geometry:bn,material:yt,group:Cn}=Ee;if(yt.side===Ai&&xe.layers.test(B.layers)){let ee=yt.side;yt.side=Un,yt.needsUpdate=!0,x0(xe,W,B,bn,yt,Cn),yt.side=ee,yt.needsUpdate=!0,Mt=!0}}Mt===!0&&(X.updateMultisampleRenderTarget(mt),X.updateRenderTargetMipmap(mt))}R.setRenderTarget(pt,St,Tt),R.setClearColor(Gt,Vt),Yt!==void 0&&(B.viewport=Yt),R.toneMapping=kt}function Mc(M,D,W){let B=D.isScene===!0?D.overrideMaterial:null;for(let z=0,mt=M.length;z<mt;z++){let vt=M[z],{object:pt,geometry:St,group:Tt}=vt,kt=vt.material;kt.allowOverride===!0&&B!==null&&(kt=B),pt.layers.test(W.layers)&&x0(pt,D,W,St,kt,Tt)}}function x0(M,D,W,B,z,mt){F!==null&&z.isNodeMaterial&&F.setObject(M,z),M.onBeforeRender(R,D,W,B,z,mt),M.modelViewMatrix.multiplyMatrices(W.matrixWorldInverse,M.matrixWorld),M.normalMatrix.getNormalMatrix(M.modelViewMatrix),z.onBeforeRender(R,D,W,B,M,mt),z.transparent===!0&&z.side===Ai&&z.forceSinglePass===!1?(z.side=Un,z.needsUpdate=!0,R.renderBufferDirect(W,D,B,z,M,mt),z.side=Ra,z.needsUpdate=!0,R.renderBufferDirect(W,D,B,z,M,mt),z.side=Ai):R.renderBufferDirect(W,D,B,z,M,mt),M.onAfterRender(R,D,W,B,z,mt)}function Ec(M,D,W){D.isScene!==!0&&(D=In);let B=k.get(M),z=T.state.lights,mt=T.state.shadowsArray,vt=z.state.version,pt=ot.getParameters(M,z.state,mt,D,W,T.state.lightProbeGridArray),St=ot.getProgramCacheKey(pt),Tt=B.programs;B.environment=M.isMeshStandardMaterial||M.isMeshLambertMaterial||M.isMeshPhongMaterial?D.environment:null,B.fog=D.fog;let kt=M.isMeshStandardMaterial||M.isMeshLambertMaterial&&!M.envMap||M.isMeshPhongMaterial&&!M.envMap;B.envMap=st.get(M.envMap||B.environment,kt),B.envMapRotation=B.environment!==null&&M.envMap===null?D.environmentRotation:M.envMapRotation,Tt===void 0&&(M.addEventListener("dispose",Gi),Tt=new Map,B.programs=Tt);let Yt=Tt.get(St);if(Yt!==void 0){if(B.currentProgram===Yt&&B.lightsStateVersion===vt)return _0(M,pt),Yt}else pt.uniforms=ot.getUniforms(M),F!==null&&M.isNodeMaterial&&F.build(M,W,pt),M.onBeforeCompile(pt,R),Yt=ot.acquireProgram(pt,St),Tt.set(St,Yt),B.uniforms=pt.uniforms;let Mt=B.uniforms;return(!M.isShaderMaterial&&!M.isRawShaderMaterial||M.clipping===!0)&&(Mt.clippingPlanes=wt.uniform),_0(M,pt),B.needsLights=A1(M),B.lightsStateVersion=vt,B.needsLights&&(Mt.ambientLightColor.value=z.state.ambient,Mt.lightProbe.value=z.state.probe,Mt.sunLights.value=z.state.sun,Mt.sunLightShadows.value=z.state.sunShadow,Mt.directionalLights.value=z.state.directional,Mt.directionalLightShadows.value=z.state.directionalShadow,Mt.spotLights.value=z.state.spot,Mt.spotLightShadows.value=z.state.spotShadow,Mt.rectAreaLights.value=z.state.rectArea,Mt.ltc_1.value=z.state.rectAreaLTC1,Mt.ltc_2.value=z.state.rectAreaLTC2,Mt.pointLights.value=z.state.point,Mt.pointLightShadows.value=z.state.pointShadow,Mt.hemisphereLights.value=z.state.hemi,Mt.sunShadowMatrix.value=z.state.sunShadowMatrix,Mt.sunShadowCascade.value=z.state.sunShadowCascade,Mt.directionalShadowMatrix.value=z.state.directionalShadowMatrix,Mt.spotLightMatrix.value=z.state.spotLightMatrix,Mt.spotLightMap.value=z.state.spotLightMap,Mt.pointShadowMatrix.value=z.state.pointShadowMatrix),B.lightProbeGrid=T.state.lightProbeGridArray.length>0,B.currentProgram=Yt,B.uniformsList=null,Yt}function v0(M){if(M.uniformsList===null){let D=M.currentProgram.getUniforms();M.uniformsList=Bo.seqWithValue(D.seq,M.uniforms)}return M.uniformsList}function _0(M,D){let W=k.get(M);W.outputColorSpace=D.outputColorSpace,W.batching=D.batching,W.batchingColor=D.batchingColor,W.instancing=D.instancing,W.instancingColor=D.instancingColor,W.instancingMorph=D.instancingMorph,W.skinning=D.skinning,W.morphTargets=D.morphTargets,W.morphNormals=D.morphNormals,W.morphColors=D.morphColors,W.morphTargetsCount=D.morphTargetsCount,W.numClippingPlanes=D.numClippingPlanes,W.numIntersection=D.numClipIntersection,W.vertexAlphas=D.vertexAlphas,W.vertexTangents=D.vertexTangents,W.toneMapping=D.toneMapping}function M1(M,D){if(M.length===0)return null;if(M.length===1)return M[0].texture!==null?M[0]:null;v.setFromMatrixPosition(D.matrixWorld);for(let W=0,B=M.length;W<B;W++){let z=M[W];if(z.texture!==null&&z.boundingBox.containsPoint(v))return z}return null}function E1(M,D,W,B,z){D.isScene!==!0&&(D=In),X.resetTextureUnits();let mt=D.fog,vt=B.isMeshStandardMaterial||B.isMeshLambertMaterial||B.isMeshPhongMaterial?D.environment:null,pt=it===null?R.outputColorSpace:it.isXRRenderTarget===!0?it.texture.colorSpace:jt.workingColorSpace,St=B.isMeshStandardMaterial||B.isMeshLambertMaterial&&!B.envMap||B.isMeshPhongMaterial&&!B.envMap,Tt=st.get(B.envMap||vt,St),kt=B.vertexColors===!0&&!!W.attributes.color&&W.attributes.color.itemSize===4,Yt=!!W.attributes.tangent&&(!!B.normalMap||B.anisotropy>0),Mt=!!W.morphAttributes.position,ue=!!W.morphAttributes.normal,Ze=!!W.morphAttributes.color,Ee=Fi;B.toneMapped&&(it===null||it.isXRRenderTarget===!0)&&(Ee=R.toneMapping);let xe=W.morphAttributes.position||W.morphAttributes.normal||W.morphAttributes.color,bn=xe!==void 0?xe.length:0,yt=k.get(B),Cn=T.state.lights;if(ae===!0&&(_e===!0||M!==K)){let Se=M===K&&B.id===P;wt.setState(B,M,Se)}let ee=!1;B.version===yt.__version?(yt.needsLights&&yt.lightsStateVersion!==Cn.state.version||yt.outputColorSpace!==pt||z.isBatchedMesh&&yt.batching===!1||!z.isBatchedMesh&&yt.batching===!0||z.isBatchedMesh&&yt.batchingColor===!0&&z._colorsTexture===null||z.isBatchedMesh&&yt.batchingColor===!1&&z._colorsTexture!==null||z.isInstancedMesh&&yt.instancing===!1||!z.isInstancedMesh&&yt.instancing===!0||z.isSkinnedMesh&&yt.skinning===!1||!z.isSkinnedMesh&&yt.skinning===!0||z.isInstancedMesh&&yt.instancingColor===!0&&z.instanceColor===null||z.isInstancedMesh&&yt.instancingColor===!1&&z.instanceColor!==null||z.isInstancedMesh&&yt.instancingMorph===!0&&z.morphTexture===null||z.isInstancedMesh&&yt.instancingMorph===!1&&z.morphTexture!==null||yt.envMap!==Tt||B.fog===!0&&yt.fog!==mt||yt.numClippingPlanes!==void 0&&(yt.numClippingPlanes!==wt.numPlanes||yt.numIntersection!==wt.numIntersection)||yt.vertexAlphas!==kt||yt.vertexTangents!==Yt||yt.morphTargets!==Mt||yt.morphNormals!==ue||yt.morphColors!==Ze||yt.toneMapping!==Ee||yt.morphTargetsCount!==bn||!!yt.lightProbeGrid!=T.state.lightProbeGridArray.length>0)&&(ee=!0):(ee=!0,yt.__version=B.version);let ci=yt.currentProgram;ee===!0&&(ci=Ec(B,D,z),F&&B.isNodeMaterial&&F.onUpdateProgram(B,ci,yt));let Wi=!1,Bs=!1,mr=!1,me=ci.getUniforms(),ke=yt.uniforms;if(_.useProgram(ci.program)&&(Wi=!0,Bs=!0,mr=!0),B.id!==P&&(P=B.id,Bs=!0),yt.needsLights){let Se=M1(T.state.lightProbeGridArray,z);yt.lightProbeGrid!==Se&&(yt.lightProbeGrid=Se,Bs=!0)}if(Wi||K!==M){_.buffers.depth.getReversed()&&M.reversedDepth!==!0&&(M._reversedDepth=!0,M.updateProjectionMatrix()),me.setValue(L,"projectionMatrix",M.projectionMatrix),me.setValue(L,"viewMatrix",M.matrixWorldInverse);let Fs=me.map.cameraPosition;Fs!==void 0&&Fs.setValue(L,Ne.setFromMatrixPosition(M.matrixWorld)),w.logarithmicDepthBuffer&&me.setValue(L,"logDepthBufFC",2/(Math.log(M.far+1)/Math.LN2)),(B.isMeshPhongMaterial||B.isMeshToonMaterial||B.isMeshLambertMaterial||B.isMeshBasicMaterial||B.isMeshStandardMaterial||B.isShaderMaterial)&&me.setValue(L,"isOrthographic",M.isOrthographicCamera===!0),K!==M&&(K=M,Bs=!0,mr=!0)}if(yt.needsLights&&(Cn.state.sunShadowMap.length>0&&me.setValue(L,"sunShadowMap",Cn.state.sunShadowMap,X),Cn.state.directionalShadowMap.length>0&&me.setValue(L,"directionalShadowMap",Cn.state.directionalShadowMap,X),Cn.state.spotShadowMap.length>0&&me.setValue(L,"spotShadowMap",Cn.state.spotShadowMap,X),Cn.state.pointShadowMap.length>0&&me.setValue(L,"pointShadowMap",Cn.state.pointShadowMap,X)),z.isSkinnedMesh){me.setOptional(L,z,"bindMatrix"),me.setOptional(L,z,"bindMatrixInverse");let Se=z.skeleton;Se&&(Se.boneTexture===null&&Se.computeBoneTexture(),me.setValue(L,"boneTexture",Se.boneTexture,X))}z.isBatchedMesh&&(me.setOptional(L,z,"batchingTexture"),me.setValue(L,"batchingTexture",z._matricesTexture,X),me.setOptional(L,z,"batchingIdTexture"),me.setValue(L,"batchingIdTexture",z._indirectTexture,X),me.setOptional(L,z,"batchingColorTexture"),z._colorsTexture!==null&&me.setValue(L,"batchingColorTexture",z._colorsTexture,X));let zs=W.morphAttributes;if((zs.position!==void 0||zs.normal!==void 0||zs.color!==void 0)&&N.update(z,W,ci),(Bs||yt.receiveShadow!==z.receiveShadow)&&(yt.receiveShadow=z.receiveShadow,me.setValue(L,"receiveShadow",z.receiveShadow)),(B.isMeshStandardMaterial||B.isMeshLambertMaterial||B.isMeshPhongMaterial)&&B.envMap===null&&D.environment!==null&&(ke.envMapIntensity.value=D.environmentIntensity),ke.dfgLUT!==void 0&&(ke.dfgLUT.value=$R()),Bs){if(me.setValue(L,"toneMappingExposure",R.toneMappingExposure),yt.needsLights&&T1(ke,mr),mt&&B.fog===!0&&At.refreshFogUniforms(ke,mt),At.refreshMaterialUniforms(ke,B,et,Y,T.state.transmissionRenderTarget[M.id]),yt.needsLights&&yt.lightProbeGrid){let Se=yt.lightProbeGrid;ke.probesSH.value=Se.texture,ke.probesMin.value.copy(Se.boundingBox.min),ke.probesMax.value.copy(Se.boundingBox.max),ke.probesResolution.value.copy(Se.resolution)}Bo.upload(L,v0(yt),ke,X)}if(B.isShaderMaterial&&B.uniformsNeedUpdate===!0&&(Bo.upload(L,v0(yt),ke,X),B.uniformsNeedUpdate=!1),B.isSpriteMaterial&&me.setValue(L,"center",z.center),me.setValue(L,"modelViewMatrix",z.modelViewMatrix),me.setValue(L,"normalMatrix",z.normalMatrix),me.setValue(L,"modelMatrix",z.matrixWorld),B.uniformsGroups!==void 0){let Se=B.uniformsGroups;for(let Fs=0,gr=Se.length;Fs<gr;Fs++){let S0=Se[Fs];nt.update(S0,ci),nt.bind(S0,ci)}}return ci}function T1(M,D){M.ambientLightColor.needsUpdate=D,M.lightProbe.needsUpdate=D,M.sunLights.needsUpdate=D,M.sunLightShadows.needsUpdate=D,M.directionalLights.needsUpdate=D,M.directionalLightShadows.needsUpdate=D,M.pointLights.needsUpdate=D,M.pointLightShadows.needsUpdate=D,M.spotLights.needsUpdate=D,M.spotLightShadows.needsUpdate=D,M.rectAreaLights.needsUpdate=D,M.hemisphereLights.needsUpdate=D}function A1(M){return M.isMeshLambertMaterial||M.isMeshToonMaterial||M.isMeshPhongMaterial||M.isMeshStandardMaterial||M.isShadowMaterial||M.isShaderMaterial&&M.lights===!0}this.getActiveCubeFace=function(){return J},this.getActiveMipmapLevel=function(){return q},this.getRenderTarget=function(){return it},this.setRenderTargetTextures=function(M,D,W){let B=k.get(M);B.__autoAllocateDepthBuffer=M.resolveDepthBuffer===!1,B.__autoAllocateDepthBuffer===!1&&(B.__useRenderToTexture=!1),k.get(M.texture).__webglTexture=D,k.get(M.depthTexture).__webglTexture=B.__autoAllocateDepthBuffer?void 0:W,B.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(M,D){let W=k.get(M);W.__webglFramebuffer=D,W.__useDefaultFramebuffer=D===void 0},this.setRenderTarget=function(M,D=0,W=0){it=M,J=D,q=W;let B=null,z=!1,mt=!1;if(M){let pt=k.get(M);if(pt.__useDefaultFramebuffer!==void 0){_.bindFramebuffer(L.FRAMEBUFFER,pt.__webglFramebuffer),$.copy(M.viewport),ht.copy(M.scissor),_t=M.scissorTest,_.viewport($),_.scissor(ht),_.setScissorTest(_t),P=-1;return}else if(pt.__webglFramebuffer===void 0)X.setupRenderTarget(M);else if(pt.__hasExternalTextures)X.rebindTextures(M,k.get(M.texture).__webglTexture,k.get(M.depthTexture).__webglTexture);else if(M.depthBuffer){let kt=M.depthTexture;if(pt.__boundDepthTexture!==kt){if(kt!==null&&k.has(kt)&&(M.width!==kt.image.width||M.height!==kt.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");X.setupDepthRenderbuffer(M)}}let St=M.texture;(St.isData3DTexture||St.isDataArrayTexture||St.isCompressedArrayTexture)&&(mt=!0);let Tt=k.get(M).__webglFramebuffer;M.isWebGLCubeRenderTarget?(Array.isArray(Tt[D])?B=Tt[D][W]:B=Tt[D],z=!0):M.samples>0&&X.useMultisampledRTT(M)===!1?B=k.get(M).__webglMultisampledFramebuffer:Array.isArray(Tt)?B=Tt[W]:B=Tt,$.copy(M.viewport),ht.copy(M.scissor),_t=M.scissorTest}else $.copy(xt).multiplyScalar(et).floor(),ht.copy(Wt).multiplyScalar(et).floor(),_t=tn;if(W!==0&&(B=V),_.bindFramebuffer(L.FRAMEBUFFER,B)&&_.drawBuffers(M,B),_.viewport($),_.scissor(ht),_.setScissorTest(_t),z){let pt=k.get(M.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_CUBE_MAP_POSITIVE_X+D,pt.__webglTexture,W)}else if(mt){let pt=D;for(let St=0;St<M.textures.length;St++){let Tt=k.get(M.textures[St]);L.framebufferTextureLayer(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0+St,Tt.__webglTexture,W,pt)}}else if(M!==null&&W!==0){let pt=k.get(M.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,pt.__webglTexture,W)}P=-1};function b0(M){let D=k.get(M);return(D.__readFormat!==M.format||D.__readType!==M.type)&&(D.__readFormat=M.format,D.__readType=M.type,D.__formatReadable=w.textureFormatReadable(M.format),D.__typeReadable=w.textureTypeReadable(M.type)),D}this.readRenderTargetPixels=function(M,D,W,B,z,mt,vt,pt=0){if(!(M&&M.isWebGLRenderTarget)){Ot("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let St=k.get(M).__webglFramebuffer;if(M.isWebGLCubeRenderTarget&&vt!==void 0&&(St=St[vt]),St){_.bindFramebuffer(L.FRAMEBUFFER,St);try{let Tt=M.textures[pt],kt=Tt.format,Yt=Tt.type;M.textures.length>1&&L.readBuffer(L.COLOR_ATTACHMENT0+pt);let Mt=b0(Tt);if(Mt.__formatReadable===!1){Ot("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Mt.__typeReadable===!1){Ot("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}D>=0&&D<=M.width-B&&W>=0&&W<=M.height-z&&L.readPixels(D,W,B,z,ut.convert(kt),ut.convert(Yt),mt)}finally{let Tt=it!==null?k.get(it).__webglFramebuffer:null;_.bindFramebuffer(L.FRAMEBUFFER,Tt)}}},this.readRenderTargetPixelsAsync=async function(M,D,W,B,z,mt,vt,pt=0){if(!(M&&M.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let St=k.get(M).__webglFramebuffer;if(M.isWebGLCubeRenderTarget&&vt!==void 0&&(St=St[vt]),St)if(D>=0&&D<=M.width-B&&W>=0&&W<=M.height-z){_.bindFramebuffer(L.FRAMEBUFFER,St);let Tt=M.textures[pt],kt=Tt.format,Yt=Tt.type;M.textures.length>1&&L.readBuffer(L.COLOR_ATTACHMENT0+pt);let Mt=b0(Tt);if(Mt.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Mt.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let ue=L.createBuffer();L.bindBuffer(L.PIXEL_PACK_BUFFER,ue),L.bufferData(L.PIXEL_PACK_BUFFER,mt.byteLength,L.STREAM_READ),L.readPixels(D,W,B,z,ut.convert(kt),ut.convert(Yt),0),L.bindBuffer(L.PIXEL_PACK_BUFFER,null);let Ze=it!==null?k.get(it).__webglFramebuffer:null;_.bindFramebuffer(L.FRAMEBUFFER,Ze);let Ee=L.fenceSync(L.SYNC_GPU_COMMANDS_COMPLETE,0);return L.flush(),await CS(L,Ee,4),L.bindBuffer(L.PIXEL_PACK_BUFFER,ue),L.getBufferSubData(L.PIXEL_PACK_BUFFER,0,mt),L.bindBuffer(L.PIXEL_PACK_BUFFER,null),L.deleteBuffer(ue),L.deleteSync(Ee),mt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(M,D=null,W=0){let B=Math.pow(2,-W),z=Math.floor(M.image.width*B),mt=Math.floor(M.image.height*B),vt=D!==null?D.x:0,pt=D!==null?D.y:0;X.setTexture2D(M,0),L.copyTexSubImage2D(L.TEXTURE_2D,W,0,0,vt,pt,z,mt),_.unbindTexture()},this.copyTextureToTexture=function(M,D,W=null,B=null,z=0,mt=0){let vt,pt,St,Tt,kt,Yt,Mt,ue,Ze,Ee=M.isCompressedTexture?M.mipmaps[mt]:M.image;if(W!==null)vt=W.max.x-W.min.x,pt=W.max.y-W.min.y,St=W.isBox3?W.max.z-W.min.z:1,Tt=W.min.x,kt=W.min.y,Yt=W.isBox3?W.min.z:0;else{let ke=Math.pow(2,-z);vt=Math.floor(Ee.width*ke),pt=Math.floor(Ee.height*ke),M.isDataArrayTexture?St=Ee.depth:M.isData3DTexture?St=Math.floor(Ee.depth*ke):St=1,Tt=0,kt=0,Yt=0}B!==null?(Mt=B.x,ue=B.y,Ze=B.z):(Mt=0,ue=0,Ze=0);let xe=ut.convert(D.format),bn=ut.convert(D.type),yt;D.isData3DTexture?(X.setTexture3D(D,0),yt=L.TEXTURE_3D):D.isDataArrayTexture||D.isCompressedArrayTexture?(X.setTexture2DArray(D,0),yt=L.TEXTURE_2D_ARRAY):(X.setTexture2D(D,0),yt=L.TEXTURE_2D),_.activeTexture(L.TEXTURE0),_.pixelStorei(L.UNPACK_FLIP_Y_WEBGL,D.flipY),_.pixelStorei(L.UNPACK_PREMULTIPLY_ALPHA_WEBGL,D.premultiplyAlpha),_.pixelStorei(L.UNPACK_ALIGNMENT,D.unpackAlignment);let Cn=_.getParameter(L.UNPACK_ROW_LENGTH),ee=_.getParameter(L.UNPACK_IMAGE_HEIGHT),ci=_.getParameter(L.UNPACK_SKIP_PIXELS),Wi=_.getParameter(L.UNPACK_SKIP_ROWS),Bs=_.getParameter(L.UNPACK_SKIP_IMAGES);_.pixelStorei(L.UNPACK_ROW_LENGTH,Ee.width),_.pixelStorei(L.UNPACK_IMAGE_HEIGHT,Ee.height),_.pixelStorei(L.UNPACK_SKIP_PIXELS,Tt),_.pixelStorei(L.UNPACK_SKIP_ROWS,kt),_.pixelStorei(L.UNPACK_SKIP_IMAGES,Yt);let mr=M.isDataArrayTexture||M.isData3DTexture,me=D.isDataArrayTexture||D.isData3DTexture;if(M.isDepthTexture){let ke=k.get(M),zs=k.get(D),Se=k.get(ke.__renderTarget),Fs=k.get(zs.__renderTarget);_.bindFramebuffer(L.READ_FRAMEBUFFER,Se.__webglFramebuffer),_.bindFramebuffer(L.DRAW_FRAMEBUFFER,Fs.__webglFramebuffer);for(let gr=0;gr<St;gr++)mr&&(L.framebufferTextureLayer(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,k.get(M).__webglTexture,z,Yt+gr),L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,k.get(D).__webglTexture,mt,Ze+gr)),L.blitFramebuffer(Tt,kt,vt,pt,Mt,ue,vt,pt,L.DEPTH_BUFFER_BIT,L.NEAREST);_.bindFramebuffer(L.READ_FRAMEBUFFER,null),_.bindFramebuffer(L.DRAW_FRAMEBUFFER,null)}else if(z!==0||M.isRenderTargetTexture||k.has(M)){let ke=k.get(M),zs=k.get(D);_.bindFramebuffer(L.READ_FRAMEBUFFER,U),_.bindFramebuffer(L.DRAW_FRAMEBUFFER,G);for(let Se=0;Se<St;Se++)mr?L.framebufferTextureLayer(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,ke.__webglTexture,z,Yt+Se):L.framebufferTexture2D(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,ke.__webglTexture,z),me?L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,zs.__webglTexture,mt,Ze+Se):L.framebufferTexture2D(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,zs.__webglTexture,mt),z!==0?L.blitFramebuffer(Tt,kt,vt,pt,Mt,ue,vt,pt,L.COLOR_BUFFER_BIT,L.NEAREST):me?L.copyTexSubImage3D(yt,mt,Mt,ue,Ze+Se,Tt,kt,vt,pt):L.copyTexSubImage2D(yt,mt,Mt,ue,Tt,kt,vt,pt);_.bindFramebuffer(L.READ_FRAMEBUFFER,null),_.bindFramebuffer(L.DRAW_FRAMEBUFFER,null)}else me?M.isDataTexture||M.isData3DTexture?L.texSubImage3D(yt,mt,Mt,ue,Ze,vt,pt,St,xe,bn,Ee.data):D.isCompressedArrayTexture?L.compressedTexSubImage3D(yt,mt,Mt,ue,Ze,vt,pt,St,xe,Ee.data):L.texSubImage3D(yt,mt,Mt,ue,Ze,vt,pt,St,xe,bn,Ee):M.isDataTexture?L.texSubImage2D(L.TEXTURE_2D,mt,Mt,ue,vt,pt,xe,bn,Ee.data):M.isCompressedTexture?L.compressedTexSubImage2D(L.TEXTURE_2D,mt,Mt,ue,Ee.width,Ee.height,xe,Ee.data):L.texSubImage2D(L.TEXTURE_2D,mt,Mt,ue,vt,pt,xe,bn,Ee);_.pixelStorei(L.UNPACK_ROW_LENGTH,Cn),_.pixelStorei(L.UNPACK_IMAGE_HEIGHT,ee),_.pixelStorei(L.UNPACK_SKIP_PIXELS,ci),_.pixelStorei(L.UNPACK_SKIP_ROWS,Wi),_.pixelStorei(L.UNPACK_SKIP_IMAGES,Bs),mt===0&&D.generateMipmaps&&L.generateMipmap(yt),_.unbindTexture()},this.initRenderTarget=function(M){k.get(M).__webglFramebuffer===void 0&&X.setupRenderTarget(M)},this.initTexture=function(M){M.isCubeTexture?X.setTextureCube(M,0):M.isData3DTexture?X.setTexture3D(M,0):M.isDataArrayTexture||M.isCompressedArrayTexture?X.setTexture2DArray(M,0):X.setTexture2D(M,0),_.unbindTexture()},this.resetState=function(){J=0,q=0,it=null,_.reset(),gt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return zi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;let n=this.getContext();n.drawingBufferColorSpace=jt._getDrawingBufferColorSpace(t),n.unpackColorSpace=jt._getUnpackColorSpace()}};var ls={light:"#609724",dark:"#54851d",line:"#e7e9bd",track:"#a66036",rim:"#e5dcb2"};function f0(e,t,n,i=!1){let s=i?640:nr.width;t(e,i?-160:-32,-82,s+224,510,ls.dark,-100);for(let f=-32,h=0;f<s+32;f+=54,h++)t(e,f,i?26:68,54,354,h%2?ls.light:ls.dark,-99);for(let f=76;f<356;f+=8)for(let h=2;h<s;h+=13){let d=(h*17+f*11)%29;d<4&&t(e,h,f,1,d%2+1,d%2?"#6fa12d":"#4b7d1b",-98)}let a=i?-4:-24;t(e,-30,40,s+60,34,ls.track,-97);for(let f of[43,48,53,58])t(e,-30,f,s+60,1,"#cf9362",-96);t(e,-30,a,s+60,64,"#29546b",-95);let r=["#e1c678","#c8d9e0","#ce785c","#6ba5b0","#31435e"];for(let f=0;f<6;f++){let h=a+5+f*9;t(e,-30,h+6,s+60,2,"#879b9b",-94);for(let d=-28;d<s+30;d+=7){let m=Math.abs(d*31+f*47)%r.length;t(e,d+1,h,2,2,"#d5aa7e",-93),t(e,d,h+2,4,4,r[m],-93)}}for(let f=20;f<s;f+=126){t(e,f,a,10,64,"#9caeae",-92);for(let h=a+4;h<a+64;h+=8)t(e,f,h,10,1,"#d2d9c5",-91)}t(e,-30,i?48:39,s+60,5,"#dfdcc4",-90);let o=["#d9d6b8","#225397","#d4a432","#244c69","#ac573e","#315e42"],l={A:["010","101","111","101","101"],R:["110","101","110","101","101"],C:["011","100","100","100","011"],D:["110","101","101","101","110"],E:["111","100","110","100","111"],F:["111","100","110","100","100"],O:["010","101","101","101","010"],T:["111","010","010","010","010"],B:["110","101","110","101","110"],L:["100","100","100","100","111"],P:["110","101","110","100","100"],K:["101","101","110","101","101"]};for(let f=-30,h=0;f<s+30;f+=90,h++){t(e,f,49,88,21,o[h%o.length],-89),t(e,f+3,52,82,1,"#eee6c0",-88);let d=h%2?"FOOTBALL":"ARCADE";for(let[m,b]of[...d].entries())for(let[g,p]of l[b].entries())for(let y=0;y<3;y++)p[y]==="1"&&t(e,f+7+m*9+y*2,55+g*2,2,2,"#eee6c0",-88);t(e,f+87,48,2,25,"#263d3b",-87)}if(t(e,-32,71,s+64,3,ls.rim,-86),i)return;let c=(f,h,d,m)=>{let b=Ge({x:f,y:h});n(e,b.x,b.y,d*Ut.scaleX,m*Ut.scaleY,ls.line)};c(0,0,Ut.length,Ut.width);let u=Ge({x:Ut.length/2,y:Ut.width/2});t(e,u.x,Ut.y,1,Ut.width*Ut.scaleY,ls.line,-40);for(let f of[0,88.5])c(f,20,16.5,28);for(let f of[0,99.5])c(f,27,5.5,14);for(let f=0;f<720;f++){let h=f*Math.PI*2/720,d=Ge({x:52.5+Math.cos(h)*Ut.centreRadius,y:34+Math.sin(h)*Ut.centreRadius});t(e,Math.round(d.x),Math.round(d.y),2,1,ls.line,-40)}for(let f of[11,94]){let h=Ge({x:f,y:34});t(e,h.x,h.y,2,2,ls.line,-40)}t(e,u.x,u.y,2,2,ls.line,-40);for(let f of[0,Ut.length])for(let h of[0,Ut.width]){let d=Ge({x:f,y:h});t(e,d.x,d.y-15,1,16,"#e6d8a8",-39),t(e,d.x+1,d.y-15,5,4,"#e3b643",-38)}for(let f of[-1,1]){let h=Ge({x:f<0?0:Ut.length,y:34}).x,d=22,m=h+f*d,b=Math.min(h,m),g=Ge({x:0,y:Ut.goalTop}).y,p=Ge({x:0,y:Ut.goalBottom}).y,y=g-er;t(e,b,y,d,p-y,"#526e57",-49);for(let S=y;S<=p;S+=5)t(e,b,S,d,1,"#b2c3a0",-48);for(let S=b;S<=b+d;S+=4)t(e,S,y,1,p-y,"#b2c3a0",-48);t(e,m,y,2,p-y,"#d9dfbd",-47);for(let S of[g,p])t(e,h,S-er,2,er,"#f3efda",-46),t(e,b,S-er,d+2,2,"#f3efda",-46);t(e,h,y,2,p-g,"#f3efda",-46)}}var jf=class{constructor(t,n,i){this.assets=n;this.viewportWidth=bi.width;this.scene=new tc;this.pitch=new Ln;this.camera=new ur(0,320,0,-224,.1,200);this.actors=new Map;this.decorations=new Map;this.meshes=[];this.ball=new Ln;this.close=new Ln;this.net=new Ln;this.target=new Ln;this.disposed=!1;this.selectionLabel=new Ln;this.shootLabel=new Ln;this.gl=new Kf({canvas:t,antialias:!1,alpha:!1,preserveDrawingBuffer:!0,powerPreference:"low-power"}),this.gl.setPixelRatio(1),this.gl.setSize(bi.width,bi.height,!1),this.gl.outputColorSpace=Tn,this.gl.setClearColor("#0f172b"),this.camera.position.z=100,this.scene.add(this.pitch,this.close,this.ball),this.poses=new Map(n.records.map(u=>[u.id,u])),this.texture=new An(i),this.texture.colorSpace=Tn,this.texture.minFilter=Xe,this.texture.magFilter=Xe,this.texture.generateMipmaps=!1,this.texture.needsUpdate=!0,f0(this.pitch,this.rect.bind(this),this.box.bind(this)),this.batchStatic(this.pitch),this.pitch.add(this.selectionLabel,this.shootLabel),this.rect(this.shootLabel,-23,-98,46,18,"#172346",8003),this.rect(this.shootLabel,-22,-97,44,16,"#ffdb4d",8004),this.rect(this.shootLabel,-21,-96,42,14,"#2345a3",8005);let s=["111/100/111/001/111","101/101/111/101/101","111/101/101/101/111","111/101/101/101/111","111/010/010/010/010"];for(let[u,f]of s.entries())for(let[h,d]of f.split("/").entries())for(let m=0;m<3;m++)d[m]==="1"&&(this.rect(this.shootLabel,u*8+m*2-18+1,h*2-94+1,2,2,"#142112",8006),this.rect(this.shootLabel,u*8+m*2-18,h*2-94,2,2,"#ffe05a",8007));this.batchStatic(this.shootLabel);for(let[u,f]of[["110","101","110","100","100"],["010","110","010","010","111"]].entries())for(let h=0;h<5;h++)for(let d=0;d<3;d++)f[h][d]==="1"&&this.rect(this.selectionLabel,u*4+d-3,h-72,1,1,"#ffffff",8002);for(let u=0;u<22;u++){let f=this.makeSprite();this.actors.set(u,f),this.pitch.add(f);let h=this.rect(this.pitch,0,0,10,2,u<11?"#5cdfff":"#ef6758",1),d=new an(new rc(1,12),new Ti({color:"#102318",transparent:!0,depthTest:!1,depthWrite:!1}));d.scale.set(8,2,1),this.pitch.add(d),this.meshes.push(d);let m=new qn;m.setAttribute("position",new sn([-4,80,0,0,74,0,4,80,0],3));let b=new an(m,new Ti({color:"#ffffff",side:Ai,transparent:!0,depthTest:!1,depthWrite:!1}));b.scale.set(kl,kl,1),this.pitch.add(b),this.meshes.push(b),this.decorations.set(u,{marker:h,shadow:d,selection:b})}f0(this.close,this.rect.bind(this),this.box.bind(this),!0),this.batchStatic(this.close),this.close.add(this.net,this.target);let a=ne.centreX-6.5*ne.lateralScale,r=ne.centreX+6.5*ne.lateralScale,o=ne.basePlane-75,l=ne.basePlane;for(let u=a+12;u<=r-12;u+=7)this.rect(this.net,u,o-8,1,75,"#b9c8ba",-49);for(let u=o-8;u<=l-8;u+=6)this.rect(this.net,a+12,u,r-a-24,1,"#b9c8ba",-49);let c=(u,f,h,d)=>{let m=Math.ceil(Math.hypot(h-u,d-f));for(let b=0;b<=m;b++)this.rect(this.net,Math.round(u+(h-u)*b/m),Math.round(f+(d-f)*b/m),1,1,"#d7e1c9",-48)};for(let u=a;u<=r;u+=8)c(u,o,u+12-(u-a)/(r-a)*24,o-8);for(let u=o;u<=l;u+=7)c(a,u,a+12,u-8),c(r,u,r-12,u-8);this.rect(this.net,a,o,2,75,"#ffffff",-40),this.rect(this.net,r-1,o,2,75,"#ffffff",-40),this.rect(this.net,a,o,r-a,2,"#ffffff",-40),this.batchStatic(this.net),this.closeKeeper=this.makeSprite(),this.close.add(this.closeKeeper),this.closeShooter=this.makeSprite(),this.close.add(this.closeShooter),this.closeMarker=this.rect(this.close,0,0,10,2,"#5cdfff",1),this.closeShadow=this.rect(this.close,0,0,7,2,"#162536",9e3),this.rect(this.target,-12,0,25,1,"#5cdfff",10010),this.rect(this.target,0,-12,1,25,"#5cdfff",10010),this.ballShadow=this.rect(this.pitch,0,0,6,2,"#162536",9e3),this.rect(this.ball,-3,-3,7,7,"#081019",1e4),this.rect(this.ball,-2,-2,5,5,"#ffffff",10001),this.rect(this.ball,-1,-1,2,2,"#1a253a",10002)}resize(t){this.viewportWidth=t,this.gl.setSize(t,bi.height,!1)}rect(t,n,i,s,a,r,o){let l=new an(new Ta(s,a),new Ti({color:r,transparent:o>0,depthTest:!1,depthWrite:!1}));return l.position.set(n+s/2,-i-a/2,0),l.renderOrder=o,t.add(l),this.meshes.push(l),l}box(t,n,i,s,a,r,o=1){this.rect(t,n,i,s,o,r,-40),this.rect(t,n,i+a-o,s,o,r,-40),this.rect(t,n,i,o,a,r,-40),this.rect(t,n+s-o,i,o,a,r,-40)}makeSprite(){let t=new an(new Ta(1,1),new Ti({map:this.texture,transparent:!0,alphaTest:.01,depthTest:!1,depthWrite:!1}));return this.meshes.push(t),t}batchStatic(t){let n=t.children.filter(l=>l instanceof an&&l.renderOrder<0);n.sort((l,c)=>l.renderOrder-c.renderOrder);let i=[],s=[];for(let l of n){l.updateMatrix();let c=l.geometry.toNonIndexed(),u=c.getAttribute("position");for(let f=0;f<u.count;f++){let h=new H().fromBufferAttribute(u,f).applyMatrix4(l.matrix);i.push(h.x,h.y,h.z),s.push(l.material.color.r,l.material.color.g,l.material.color.b)}c.dispose(),l.geometry.dispose(),l.material.dispose(),t.remove(l)}let a=new Set(n);this.meshes=this.meshes.filter(l=>!a.has(l));let r=new qn;r.setAttribute("position",new sn(i,3)),r.setAttribute("color",new sn(s,3));let o=new an(r,new Ti({vertexColors:!0,depthTest:!1,depthWrite:!1}));o.renderOrder=-50,t.add(o),this.meshes.push(o)}show(t,n,i,s,a,r=!0){let o=this.poses.get(s.pose),l=o?r?Hl(o):o:void 0;if(!l)throw new Error("Missing atlas pose "+s.pose);let c=l.anchors.ground,[u,f,h,d]=l.atlas,[m,b]=this.assets.atlasSize,g=l.width,p=l.height,y=t.geometry.getAttribute("uv");y.setXY(0,u/m,1-f/b),y.setXY(1,(u+h)/m,1-f/b),y.setXY(2,u/m,1-(f+d)/b),y.setXY(3,(u+h)/m,1-(f+d)/b),y.needsUpdate=!0,t.scale.set(s.mirror?-g:g,p,1),t.position.set(Math.round(n)+(s.mirror?c[0]-g/2:g/2-c[0]),-(Math.round(i)+p/2-c[1]),0),t.renderOrder=a,t.visible=!0}render(t){if(this.disposed)return;let n=t.state,i=n.shotView;if(this.pitch.visible=!i,this.close.visible=!!i,i){this.camera.left=160-this.viewportWidth/2,this.camera.right=160+this.viewportWidth/2,this.camera.top=0,this.camera.bottom=-224,this.camera.updateProjectionMatrix();let c=n.players[i.keeper],u=ir({...c,z:0},i),f=qm(n.ball,i),h=ir(n.ball,i);this.net.position.y=-(i.planeY-ne.basePlane),this.show(this.closeKeeper,u.x,u.y,t.view(c),151,!1),this.closeMarker.position.set(u.x,-u.y-5,0),this.closeMarker.renderOrder=152,this.closeMarker.material instanceof Ti&&this.closeMarker.material.color.set(c.team===0?"#5cdfff":"#ef6758"),this.target.visible=i.phase==="aim",this.target.position.set(i.aim.x,-i.aim.y,0);let d=n.players[i.shooter],m=vb(i,d),b=qm(t.anchor(d,"foot",{pose:(d.team===1?"orchard-":"")+"kick-contact",mirror:i.direction<0}),i);if(this.closeShooter.visible=!!m,m){let g=(d.team===1?"orchard-":"")+"close-"+m,p=this.poses.get(g),y=p.anchors.ground,S=p.anchors.ballContact,v=i.phase==="aim"&&i.age<66?-Math.round((66-i.age)/3):0;this.show(this.closeShooter,b.x+y[0]-S[0]+v,b.y+y[1]-S[1],{pose:g,mirror:!1},500,!1)}this.ball.position.set(Math.round(f.x),-Math.round(f.y),0),this.closeShadow.visible=n.ball.z>3,this.closeShadow.position.set(Math.round(h.x),-Math.round(h.y),0),this.gl.render(this.scene,this.camera);return}for(let c of this.actors.values())c.visible=!1;for(let c of this.decorations.values())c.marker.visible=!1,c.shadow.visible=!1,c.selection.visible=!1;for(let c of n.players){let u=Ge(c),f=Math.round(u.x),h=Math.round(u.y);this.show(this.actors.get(c.id),u.x,u.y,t.view(c),h);let d=this.decorations.get(c.id);d.marker.visible=!0,d.shadow.visible=!0,d.marker.position.set(f,-h-5,0),d.marker.renderOrder=h+.1,d.shadow.position.set(f,-h-2,0),d.shadow.renderOrder=h-.1,d.selection.visible=c.id===n.selected,d.selection.position.set(f,-h,0),d.selection.renderOrder=8e3}let s=Ge(n.ball);this.shootLabel.visible=t.shootPrompt();let a=Ge(n.players[n.selected]),r=Math.max(n.camera.x+24,Math.min(n.camera.x+this.viewportWidth-24,a.x+36)),o=Math.max(a.y-6,n.camera.y+140);this.shootLabel.position.set(Math.round(r),-Math.round(o),0);let l=Ge(n.players[n.selected]);this.selectionLabel.position.set(Math.round(l.x),-Math.round(l.y),0),this.ball.position.set(Math.round(s.x),-Math.round(s.y-n.ball.z),0),this.ballShadow.visible=n.ball.z>3,this.ballShadow.position.set(Math.round(s.x),-Math.round(s.y),0),this.camera.left=n.camera.x,this.camera.right=n.camera.x+this.viewportWidth,this.camera.top=-n.camera.y,this.camera.bottom=-n.camera.y-224,this.camera.updateProjectionMatrix(),this.gl.render(this.scene,this.camera)}diagnostics(){return{disposed:this.disposed,geometries:this.gl.info.memory.geometries,textures:this.gl.info.memory.textures,drawCalls:this.gl.info.render.calls}}dispose(){if(!this.disposed){this.disposed=!0;for(let t of this.meshes){t.geometry.dispose();let n=t.material;Array.isArray(n)?n.forEach(i=>i.dispose()):n.dispose()}this.texture.dispose(),this.scene.clear(),this.actors.clear(),this.gl.renderLists.dispose(),this.gl.dispose(),this.gl.forceContextLoss()}}};var $f=class{constructor(t,n,i,s={}){this.context=s;this.audio=new eh;this.previous=null;this.accumulated=0;this.raf=0;this.disposed=!1;this.unavailable=!1;this.backgrounded=!1;this.framing="wide";this.measuredWidth=384;this.listeners=new Set;this.resultSent=!1;this.eventCursor=0;this.controller=new AbortController;this.subscribe=t=>(this.listeners.add(t),()=>{this.listeners.delete(t)});this.dispatch=t=>{if(this.disposed||this.unavailable)return;t.type!=="clear"&&!(t.type==="hold"&&!t.value)&&this.audio.unlock();let n=this.sim.state.round,i=this.sim.state.status;this.sim.command(t);let s=this.sim.state.round!==n;(this.sim.state.status!==i||s)&&(this.previous=null,this.accumulated=0),s&&(this.resultSent=!1,this.eventCursor=0),this.publish(),["start","resume"].includes(t.type)&&this.audio.ui()};this.loop=t=>{if(!this.disposed){if(this.sim.state.status==="playing"){this.previous!==null&&(this.accumulated+=Math.min(200,t-this.previous));let n=Math.min(12,Math.floor((this.accumulated+1e-7)/(1e3/60)));n&&(this.step(n),this.accumulated-=n*1e3/60),this.previous=t}else this.previous=null;this.raf=requestAnimationFrame(this.loop)}};this.sim=new ih(n),this.renderer=new jf(t,n,i),this.resizeObserver=new ResizeObserver(a=>{if(this.disposed)return;let r=a[0]?.contentRect;!r||r.height<1||(this.measuredWidth=224*r.width/r.height,this.setFraming(this.framing))}),this.resizeObserver.observe(t.parentElement),this.settings={music:.4,sfx:.7},this.setSettings(s.settings??{},!1),this.renderer.render(this.sim),this.raf=requestAnimationFrame(this.loop),t.addEventListener("webglcontextlost",a=>{this.disposed||(a.preventDefault(),this.pause(),this.unavailable=!0,this.context.onError?.("Graphics context lost. Retry loading to continue."))},{signal:this.controller.signal})}setFraming(t){this.framing=t,this.sim.setViewportWidth(t==="reference"?320:this.measuredWidth),this.renderer.resize(this.sim.viewportWidth),this.renderer.render(this.sim)}publish(){this.renderer.render(this.sim);for(let t of this.sim.state.events){let n=Number(t.sequence);n>this.eventCursor&&(this.eventCursor=n,this.audio.event(t),this.context.onEvent?.(structuredClone(t)))}this.audio.sync(this.backgrounded?"hidden":this.sim.state.status),this.sim.state.status==="complete"&&(this.resultSent||(this.resultSent=!0,this.context.onResult?.(this.result())));for(let t of this.listeners)t()}result(){let t=this.sim.state;return{schemaVersion:2,gameId:"retro-football",mode:"exhibition",airContacts:[...t.airContacts],airCollections:[...t.airCollections],outcome:t.score[0]===t.score[1]?"draw":t.score[0]>t.score[1]?"win":"loss",score:[...t.score],halves:2,activeSeconds:180,passes:[...t.passes],shots:[...t.shots],saves:[...t.saves],rulesVersion:Li.rulesVersion,runtimeVersion:Li.runtimeVersion,assetVersion:Li.assetVersion}}step(t=1){if(!(this.disposed||this.unavailable)){for(let n=0;n<t;n++)this.sim.step();this.publish()}}start(){this.dispatch({type:"start"})}pause(){this.sim.state.status==="playing"?this.dispatch({type:"pause"}):this.dispatch({type:"clear"})}resume(){this.dispatch({type:"resume"})}setBackground(t){this.disposed||(this.backgrounded=t,t?this.pause():this.audio.sync(this.sim.state.status))}restart(){this.disposed||this.unavailable||(this.audio.unlock(),this.sim.restart(),this.previous=null,this.accumulated=0,this.resultSent=!1,this.eventCursor=0,this.publish())}setSettings(t,n=!0){if(!this.disposed){for(let i of["music","sfx"]){let s=t[i];s!==void 0&&Number.isFinite(s)&&(this.settings[i]=Math.max(0,Math.min(1,s)))}this.audio.setSettings(this.settings),n&&this.context.onSettingsChange?.({...this.settings})}}diagnostics(){return{...this.renderer.diagnostics(),listeners:this.listeners.size,audio:this.audio.diagnostics(),pendingFrame:!this.disposed}}dispose(){this.disposed||(this.disposed=!0,this.controller.abort(),this.resizeObserver.disconnect(),cancelAnimationFrame(this.raf),this.sim.clear(),this.listeners.clear(),this.renderer.dispose(),this.audio.dispose(),this.previous=null,this.accumulated=0)}};async function l1(e,t){let n=await fetch(e,{signal:t});if(!n.ok)throw new Error("Asset manifest could not load.");let i=await n.json();if(i.schemaVersion!==1||i.version!=="football-chance-atlas-v2"||i.approval!=="reference"||i.records.length!==95)throw new Error("Unsupported football asset manifest.");let s=new URL(i.atlasUrl,e);if(s.origin!==e.origin)throw new Error("Unexpected atlas origin.");let a=await fetch(s,{signal:t});if(!a.ok)throw new Error("Team atlas could not load.");let r=await a.arrayBuffer(),o=await crypto.subtle.digest("SHA-256",r);if(Array.from(new Uint8Array(o),u=>u.toString(16).padStart(2,"0")).join("")!==i.atlasSha256)throw new Error("Team atlas integrity check failed.");if(t.aborted)throw new DOMException("Aborted","AbortError");let c=URL.createObjectURL(new Blob([r],{type:"image/png"}));try{let u=new Image;if(u.src=c,await u.decode(),t.aborted)throw new DOMException("Aborted","AbortError");if(u.naturalWidth!==i.atlasSize[0]||u.naturalHeight!==i.atlasSize[1])throw new Error("Team atlas dimensions changed.");return{manifest:i,image:u}}finally{URL.revokeObjectURL(c)}}function c1(e,t,n=[]){let i=Math.hypot(e,t),s=n.length?.19:.27;if(i<s)return[];let a=Math.abs(e),r=Math.abs(t),o=Math.tan(Math.PI/8),l=a>r*o,c=r>a*o,u=[];return l&&u.push(e<0?"left":"right"),c&&u.push(t<0?"up":"down"),u}function u1(e,t){let n=new AbortController,i={signal:n.signal},s={arrowleft:"left",arrowright:"right",arrowup:"up",arrowdown:"down"};document.addEventListener("keydown",u=>{if(u.target?.matches("input,select,textarea"))return;if(u.key==="Escape"&&!u.repeat){u.preventDefault(),t.dispatch({type:"pause"});return}let f=s[u.key.toLowerCase()];f&&(u.preventDefault(),t.dispatch({type:"hold",key:f,value:!0,source:"keyboard:"+u.code}));let m=(t.sim.attackingControls()?{p:"pass",l:"loft",s:"shoot"}:{t:"tackle",s:"switch",d:"slide"})[u.key.toLowerCase()];m&&!u.repeat&&(u.preventDefault(),t.dispatch({type:m}))},i),document.addEventListener("keyup",u=>{let f=s[u.key.toLowerCase()];f&&t.dispatch({type:"hold",key:f,value:!1,source:"keyboard:"+u.code})},i);let a=new Set,r=new Map,o=u=>{let f=r.get(u.pointerId);if(!f)return;let h=f.pad.getBoundingClientRect(),d=c1((u.clientX-h.x-h.width/2)/(h.width/2),(u.clientY-h.y-h.height/2)/(h.height/2),f.directions),m="pointer:"+u.pointerId;for(let b of f.directions)d.includes(b)||t.dispatch({type:"hold",key:b,value:!1,source:m});for(let b of d)f.directions.includes(b)||t.dispatch({type:"hold",key:b,value:!0,source:m});f.directions=d};e.addEventListener("pointerdown",u=>{let f=u.target.closest("[data-stick]");if(f){if(f.getAttribute("aria-disabled")==="true")return;u.preventDefault(),f.setPointerCapture(u.pointerId),r.set(u.pointerId,{pad:f,directions:[]}),o(u);return}let h=u.target.closest("button[data-hold],button[data-action]");if(!h||h.disabled)return;u.preventDefault(),h.setPointerCapture(u.pointerId),a.add(u.pointerId),h.dataset.pressed="true";let d=h.dataset.hold,m=h.dataset.action;d?t.dispatch({type:"hold",key:d,value:!0,source:"pointer:"+u.pointerId}):m&&t.dispatch({type:m})},i),e.addEventListener("pointermove",u=>{r.has(u.pointerId)&&(u.preventDefault(),o(u))},i);let l=u=>{let f=r.get(u.pointerId);if(f){for(let m of f.directions)t.dispatch({type:"hold",key:m,value:!1,source:"pointer:"+u.pointerId});r.delete(u.pointerId);return}let h=u.target.closest("button[data-hold],button[data-action]");if(!h)return;delete h.dataset.pressed,a.delete(u.pointerId);let d=h.dataset.hold;d&&t.dispatch({type:"hold",key:d,value:!1,source:"pointer:"+u.pointerId})};for(let u of["pointerup","pointercancel","lostpointercapture"])e.addEventListener(u,l,i);let c=()=>{t.setBackground(!0);for(let u of e.querySelectorAll("[data-pressed]"))delete u.dataset.pressed;a.clear(),r.clear()};return window.addEventListener("blur",c,i),window.addEventListener("focus",()=>{document.hidden||t.setBackground(!1)},i),document.addEventListener("visibilitychange",()=>{document.hidden?c():t.setBackground(!1)},i),document.hidden&&c(),()=>{n.abort(),a.clear(),r.clear();for(let u of e.querySelectorAll("[data-pressed]"))delete u.dataset.pressed;t.sim.clear()}}var h1=1;function f1(){let e=new URL(location.href).searchParams,t=e.get("session")??crypto.randomUUID(),n=window.parent!==window&&e.get("host")==="web",i=window.RetroFootballHost,s=null,a=!1,r=!n,o=0,l=new AbortController,c=(m,b={})=>{if(a)return;let g={protocolVersion:h1,gameId:Li.id,sessionId:t,type:m,payload:b};n?parent.postMessage(g,location.origin):i?.postMessage(JSON.stringify(g))},u=m=>{if(!m||typeof m!="object")return null;let b=m,g={};for(let p of["music","sfx"])if(b[p]!==void 0){if(typeof b[p]!="number"||!Number.isFinite(b[p])||b[p]<0||b[p]>1)return null;g[p]=b[p]}return g},f=m=>{if(a||!s||!m||typeof m!="object")return;let b=m;if(!(b.protocolVersion!==h1||b.gameId!==Li.id||b.sessionId!==t)){if(b.type==="launch"){let g=u(b.payload);if(!g)return;r=!0,s.setSettings(g),c("launched",Li)}else if(r)if(b.type==="pause")s.pause();else if(b.type==="resume")s.resume();else if(b.type==="settings"){let g=u(b.payload);g&&s.setSettings(g)}else b.type==="dispose"&&(s.dispose(),c("disposed"),a=!0,l.abort())}};return window.addEventListener("message",m=>{n&&m.source===parent&&m.origin===location.origin&&f(m.data)},{signal:l.signal}),i&&Object.assign(window,{retroFootballHostV1:{receive:f}}),{context:{onReady:m=>{s=m,c("ready",Li)},onResult:m=>c("result",{resultId:t+":"+ ++o,result:m}),onSettingsChange:m=>c("settings",m),onError:m=>c("error",{message:m}),onExit:n||i?()=>c("exit"):void 0},dispose(){a||(a=!0,l.abort(),s=null,i&&delete window.retroFootballHostV1)}}}var g1=ks(vr());var Rt=ks(Sc());function y1({atlasUrl:e,onStart:t,onMenu:n}){let[i,s]=(0,g1.useState)(!1);return(0,Rt.jsxs)("section",{className:"arcade-lobby","aria-label":"Pitchflare XI lobby",children:[(0,Rt.jsx)("div",{className:"lobby-pattern","aria-hidden":"true",children:Array.from({length:18},(a,r)=>(0,Rt.jsx)("span",{children:"PITCHFLARE XI /"},r))}),(0,Rt.jsxs)("header",{className:"lobby-header",children:[(0,Rt.jsx)("span",{children:"FOOTBALL ARCADE"}),(0,Rt.jsx)("span",{children:"1 PLAYER \xB7 EXHIBITION"})]}),(0,Rt.jsxs)("div",{className:"lobby-copy",children:[(0,Rt.jsx)("span",{className:"lobby-kicker",children:"POCKET ARCADE / FOOTBALL"}),(0,Rt.jsx)("img",{src:"../../assets/games/identity/retro-football.svg",alt:"",width:"110",height:"80",style:{objectFit:"contain"}}),(0,Rt.jsxs)("h1",{children:["PITCHFLARE",(0,Rt.jsx)("br",{}),(0,Rt.jsx)("em",{children:"XI"})]}),(0,Rt.jsx)("p",{children:"THE MATCH IS YOURS."}),(0,Rt.jsxs)("div",{className:"lobby-format",children:["11 V 11 ",(0,Rt.jsx)("span",{children:" / "})," 2 \xD7 90 SECONDS"]}),(0,Rt.jsxs)("button",{id:"start",className:"primary lobby-start",onClick:t,children:["KICK OFF ",(0,Rt.jsx)("span",{"aria-hidden":"true",children:"\u25B6"})]}),(0,Rt.jsx)("button",{className:"utility lobby-help","aria-expanded":i,"aria-controls":"lobby-details",onClick:()=>s(a=>!a),children:i?"VIEW MATCHUP":"HOW TO PLAY"})]}),(0,Rt.jsxs)("div",{className:"lobby-match",id:"lobby-details",children:[(0,Rt.jsxs)("div",{className:"lobby-section-title",children:[i?"THREE BUTTON FOOTBALL":"MATCH MENU",(0,Rt.jsx)("button",{className:"utility",onClick:n,children:"SETTINGS"})]}),i?(0,Rt.jsxs)("div",{className:"lobby-instructions",children:[(0,Rt.jsx)("h2",{children:"MOVE. PASS. SHOOT."}),(0,Rt.jsx)("p",{children:"Steer with the pad. Button labels change with play."}),(0,Rt.jsxs)("dl",{children:[(0,Rt.jsxs)("div",{children:[(0,Rt.jsx)("dt",{children:"ATTACK"}),(0,Rt.jsx)("dd",{children:"P pass \xB7 L loft \xB7 S shoot"})]}),(0,Rt.jsxs)("div",{children:[(0,Rt.jsx)("dt",{children:"DEFEND"}),(0,Rt.jsx)("dd",{children:"T tackle \xB7 S switch \xB7 D slide"})]}),(0,Rt.jsxs)("div",{children:[(0,Rt.jsx)("dt",{children:"CHANCE"}),(0,Rt.jsx)("dd",{children:"Arrow keys aim \xB7 S confirms"})]})]}),(0,Rt.jsx)("small",{children:"KEYBOARD: ARROW KEYS TO MOVE"})]}):(0,Rt.jsxs)(Rt.Fragment,{children:[(0,Rt.jsxs)("div",{className:"lobby-teams",children:[["HARBOUR","ORCHARD"].map((a,r)=>(0,Rt.jsxs)("article",{className:"lobby-team "+(r?"opponent":"player"),children:[(0,Rt.jsxs)("div",{className:"team-plate",children:[(0,Rt.jsx)("span",{children:r?"CPU":"P1 / YOU"}),(0,Rt.jsx)("b",{children:a}),(0,Rt.jsx)("small",{children:r?"UNITED":"ATHLETIC"})]}),(0,Rt.jsx)("div",{className:"lobby-player","aria-hidden":"true",children:(0,Rt.jsx)("div",{style:{backgroundImage:`url("${e}")`,backgroundPosition:`-${r?86:2}px -768px`}})}),(0,Rt.jsx)("span",{className:"team-role",children:r?"LOCAL AI":"YOUR TEAM"})]},a)),(0,Rt.jsx)("b",{className:"lobby-versus","aria-hidden":"true",children:"VS"})]}),(0,Rt.jsx)("div",{className:"lobby-match-note",children:"ONE STADIUM. ONE MATCH. ALL TO PLAY FOR."})]})]}),(0,Rt.jsxs)("footer",{className:"lobby-footer",children:[(0,Rt.jsx)("span",{children:"LANDSCAPE + HEADPHONES"}),(0,Rt.jsx)("span",{children:"INVENTED CLUBS \xB7 LOCAL EXHIBITION"})]})]})}var rt=ks(Sc()),On={session:null,ready:!1,mounts:0,disposals:0,lastDisposal:null,step:e=>On.session?.step(e),restart:()=>On.session?.restart(),dispose:()=>{},remount:()=>{}};window.productionLab=On;function i3({context:e,manifestUrl:t}){let n=(0,qe.useRef)(null),i=(0,qe.useRef)(null),s=(0,qe.useRef)(null),[a,r]=(0,qe.useState)(null),[o,l]=(0,qe.useState)(0),[c,u]=(0,qe.useState)(0),[f,h]=(0,qe.useState)(!1),[d,m]=(0,qe.useState)(""),[b,g]=(0,qe.useState)(!1),[p,y]=(0,qe.useState)(!1),[S,v]=(0,qe.useState)("");(0,qe.useEffect)(()=>{a?.setFraming(p?"reference":"wide")},[a,p]);let E=(0,qe.useRef)(null),T=(0,qe.useRef)(null);(0,qe.useEffect)(()=>{let P=new AbortController,K=()=>{},$=()=>{};return On.ready=!1,l1(t,P.signal).then(({manifest:ht,image:_t})=>{if(P.signal.aborted)return;let Gt=new $f(i.current,ht,_t,{...e,onError:Vt=>{m(Vt),h(!1),On.ready=!1,e.onError?.(Vt)}});v(_t.src),s.current=Gt,r(Gt),On.session=Gt,On.mounts++,K=u1(n.current,Gt),$=Gt.subscribe(()=>{window.gameState=Gt.sim.snapshot(),l(Vt=>Vt+1)}),window.gameState=Gt.sim.snapshot(),e.onReady?.(Gt),h(!0),On.ready=!0}).catch(ht=>{P.signal.aborted||(m(ht instanceof Error?ht.message:"The game could not load."),e.onError?.("Retro Football could not load."))}),()=>{P.abort(),K(),$();let ht=s.current;ht&&(ht.dispose(),On.lastDisposal=ht.diagnostics(),On.disposals++),s.current=null,On.session=null,On.ready=!1}},[e,t,c]);let C=()=>{h(!1),m(""),r(null),u(P=>P+1)};(0,qe.useEffect)(()=>(On.remount=()=>{h(!1),m(""),r(null),u(P=>P+1)},()=>{On.remount=()=>{}}),[]),(0,qe.useEffect)(()=>A0(n.current,()=>s.current?.pause()),[]),(0,qe.useEffect)(()=>{if(!b)return;let K=T.current?.querySelectorAll("button,input,select");K?.[0]?.focus();let $=ht=>{if(ht.key==="Escape"&&(ht.preventDefault(),ht.stopImmediatePropagation(),g(!1),E.current?.focus()),ht.key==="Tab"&&K?.length){let _t=K[0],Gt=K[K.length-1];ht.shiftKey&&document.activeElement===_t?(ht.preventDefault(),Gt.focus()):!ht.shiftKey&&document.activeElement===Gt&&(ht.preventDefault(),_t.focus())}};return document.addEventListener("keydown",$,!0),()=>document.removeEventListener("keydown",$,!0)},[b]);let x=a?.sim.state,A=x?.status==="playing",R=x?Math.max(0,90-Math.floor(x.halfTicks/60)):90,O=a?.sim.attackingControls()??!0,F=O?[{type:"pass",key:"P",label:"PASS"},{type:"loft",key:"L",label:"LOFT"},{type:"shoot",key:"S",label:"SHOOT"}]:[{type:"tackle",key:"T",label:"TACKLE"},{type:"switch",key:"S",label:"SWITCH"},{type:"slide",key:"D",label:"SLIDE"}],V=f&&!d&&x?.status==="ready",U=!f||!A||x?.phase==="goal"||!!x?.shotView&&x.shotView.phase!=="aim",G=d?"LOAD ERROR":f?x?.status==="playing"?x.shotView?{aim:"CHANCE",windup:"SHOOT",flight:"SHOT",parry:"SAVE",goal:"GOAL!"}[x.shotView.phase]:x.phase==="restart"?"KICK OFF":x.phase==="goal"?"GOAL!":"EXHIBITION":x?.status.toUpperCase():"LOADING",J=()=>{g(!1),x?.status==="paused"?s.current?.resume():s.current?.start()},q=()=>{s.current?.pause(),g(!0)},it=()=>{s.current?.pause(),e.onExit?e.onExit():(s.current?.restart(),g(!1))};return(0,rt.jsxs)("main",{ref:n,"data-retro-frame":!0,className:"handheld "+(p?"reference-view ":"")+(V?"in-lobby":""),"data-render":o,children:[(0,rt.jsx)("div",{className:"console-edge",children:(0,rt.jsxs)("div",{className:"console-body","data-retro-console":!0,children:[(0,rt.jsxs)("header",{className:"console-brand",children:[(0,rt.jsxs)("span",{children:["POCKET",(0,rt.jsx)("span",{className:"brand-sub",children:"SPORTS ARCADE"})]}),(0,rt.jsx)("span",{className:"brand-game",children:"PITCHFLARE XI"}),(0,rt.jsxs)("span",{className:"power-light",children:["POWER ",(0,rt.jsx)("i",{})]})]}),(0,rt.jsxs)("aside",{className:"left-grip","data-retro-grip":"left","aria-label":"Directional controls",children:[(0,rt.jsx)("span",{"data-retro-decoration":!0,className:"grip-caption",children:"DIRECTION"}),(0,rt.jsxs)("div",{className:"dpad","data-stick":!0,"aria-label":"Eight-way movement pad","aria-disabled":U,children:[["up","left","down","right"].map(P=>(0,rt.jsx)("button",{className:"direction "+P,"data-hold":P,disabled:U,"data-pressed":x?.held[P]?"true":void 0,"aria-label":"Move "+P,children:{up:"\u25B2",left:"\u25C0",down:"\u25BC",right:"\u25B6"}[P]},P)),(0,rt.jsx)("span",{className:"pad-centre"})]}),(0,rt.jsxs)("div",{"data-retro-decoration":!0,className:"speaker","aria-hidden":"true",children:[(0,rt.jsx)("i",{}),(0,rt.jsx)("i",{}),(0,rt.jsx)("i",{}),(0,rt.jsx)("i",{})]}),(0,rt.jsx)("span",{"data-retro-decoration":!0,className:"control-help",children:"ARROW KEYS"})]}),(0,rt.jsx)("section",{className:"screen-bezel","data-retro-display":!0,"aria-label":"Game display",children:(0,rt.jsxs)("div",{className:"glass",children:[(0,rt.jsx)("canvas",{width:bi.width,height:bi.height,ref:i,"aria-label":"Retro Football live pitch"},c),(0,rt.jsxs)("div",{className:"scoreboard","aria-label":"Match score and clock",children:[(0,rt.jsxs)("span",{className:"team-name harbour",children:["HARBOUR ",(0,rt.jsx)("b",{id:"home-score",children:x?.score[0]??0})]}),(0,rt.jsxs)("span",{className:"clock-block",children:[(0,rt.jsxs)("small",{children:["HALF ",x?.half??1]}),(0,rt.jsxs)("b",{id:"clock",children:[Math.floor(R/60),":",String(R%60).padStart(2,"0")]})]}),(0,rt.jsxs)("span",{className:"team-name orchard",children:[(0,rt.jsx)("b",{id:"away-score",children:x?.score[1]??0})," ORCHARD"]})]}),(0,rt.jsx)("span",{id:"state",className:"game-state",children:G}),x?.phase==="goal"&&(0,rt.jsx)("div",{className:"goal-banner",children:"GOAL!"}),(0,rt.jsxs)("div",{className:"radar",hidden:!!x?.shotView,"aria-label":"Pitch overview",children:[(0,rt.jsx)("i",{className:"halfway"}),x?.players.map(P=>(0,rt.jsx)("i",{className:"dot "+(P.team===0?"harbour":"orchard")+(P.id===x.selected?" selected":""),style:{left:P.x/105*100+"%",top:P.y/68*100+"%"}},P.id)),x&&(0,rt.jsx)("i",{className:"radar-ball",style:{left:x.ball.x/105*100+"%",top:x.ball.y/68*100+"%"}})]}),(0,rt.jsx)("p",{className:"match-message",id:"message",role:"status",children:d||x?.message||"Loading the stadium\u2026"}),(!f||d||x?.status!=="playing")&&!V&&!b&&(0,rt.jsx)("div",{className:"game-overlay",children:(0,rt.jsxs)("section",{className:"title-card",children:[(0,rt.jsx)("span",{className:"cartridge-label",children:"ARCADE FOOTBALL"}),(0,rt.jsx)("h1",{children:x?.status==="complete"?"FULL TIME":x?.status==="halftime"?"HALF TIME":x?.status==="paused"?"PAUSED":"PITCHFLARE XI"}),(0,rt.jsx)("p",{children:d||(f?x?.status==="complete"?`${x.score[0]} : ${x.score[1]} \xB7 ${x.score[0]===x.score[1]?"DRAW":x.score[0]>x.score[1]?"HARBOUR WINS":"ORCHARD WINS"}`:x?.status==="halftime"?"Switch ends. One more half.":"HARBOUR ATHLETIC \xD7 ORCHARD UNITED":"Loading your cartridge\u2026")}),d?(0,rt.jsx)("button",{id:"retry",className:"primary",onClick:C,children:"RETRY CARTRIDGE"}):x?.status==="complete"?(0,rt.jsx)("button",{id:"restart",className:"primary",onClick:()=>{s.current?.restart(),s.current?.start()},children:"REMATCH"}):(0,rt.jsx)("button",{id:"start",className:"primary",disabled:!f,onClick:J,children:x?.status==="paused"?"RESUME MATCH":x?.status==="halftime"?"SECOND HALF":"KICK OFF"}),(0,rt.jsx)("small",{children:"11 V 11 \xB7 TWO 90-SECOND HALVES"})]})})]})}),(0,rt.jsxs)("aside",{className:"right-grip","data-retro-grip":"right","aria-label":"Action controls",children:[(0,rt.jsx)("span",{"data-retro-decoration":!0,className:"grip-caption",children:"THREE BUTTON PLAY"}),(0,rt.jsx)("div",{className:"action-cluster",children:F.map(({type:P,key:K,label:$},ht)=>(0,rt.jsxs)("button",{className:"action action-"+["A","B","C"][ht],id:["A","B","C"][ht],"data-action":P,disabled:U||!!x?.shotView&&P!=="shoot","aria-label":$+" ("+K+")",onClick:_t=>{_t.detail===0&&s.current?.dispatch({type:P})},children:[(0,rt.jsx)("b",{children:K}),(0,rt.jsx)("small",{children:$})]},ht))}),(0,rt.jsx)("span",{"data-retro-decoration":!0,className:"control-help",children:O?"P / L / S":"T / S / D"})]}),V&&(0,rt.jsx)(y1,{atlasUrl:S,onStart:J,onMenu:q}),(0,rt.jsxs)("footer",{className:"console-footer",children:[(0,rt.jsx)("button",{ref:E,className:"utility",id:"menu",onClick:q,children:"SETTINGS"}),(0,rt.jsx)("button",{className:"utility",id:"pause",disabled:!f||!["playing","paused"].includes(x?.status||""),onClick:()=>s.current?.dispatch({type:"pause"}),children:x?.status==="paused"?"RESUME":"PAUSE"}),(0,rt.jsxs)("span",{className:"footer-status",children:[x?.half===2?"\u25C0":"\u25B6"," HARBOUR ATTACKS ",x?.half===2?"LEFT":"RIGHT"]}),(0,rt.jsx)("button",{className:"utility",id:"exit",onClick:it,children:"EXIT"})]})]})}),b&&(0,rt.jsx)("div",{className:"menu-backdrop",children:(0,rt.jsxs)("div",{ref:T,className:"settings-panel",role:"dialog","aria-modal":"true","aria-labelledby":"menu-title",children:[(0,rt.jsx)("span",{className:"cartridge-label",children:"POCKET ARCADE"}),(0,rt.jsx)("h2",{id:"menu-title",children:V?"LOBBY SETTINGS":"MATCH MENU"}),(0,rt.jsx)("button",{className:"primary",onClick:()=>{g(!1),x?.status==="paused"&&s.current?.resume()},children:V?"BACK TO LOBBY":"BACK TO GAME"}),(0,rt.jsx)(k0,{}),(0,rt.jsx)("div",{className:"audio-settings",children:["music","sfx"].map(P=>(0,rt.jsxs)("label",{children:[P==="music"?"Music":"Sound effects",(0,rt.jsx)("input",{"aria-label":P==="music"?"Music volume":"Sound effects volume",type:"range",min:"0",max:"1",step:".05",value:a?.settings[P]??.4,onChange:K=>{s.current?.audio.unlock(),s.current?.setSettings({[P]:Number(K.currentTarget.value)}),l($=>$+1)}})]},P))}),(0,rt.jsxs)("button",{id:"framing",className:"utility","aria-pressed":p,onClick:()=>y(P=>!P),children:["VIEW: ",p?"REFERENCE 320 \xD7 224":"WIDE HANDHELD"]}),(0,rt.jsx)("p",{children:"Slide your thumb across the pad for eight-way movement. Keep steering while pressing A, B or C."}),(0,rt.jsx)("p",{children:"Move / aim: arrow keys. Attack: P pass, L loft, S shoot. Defence: T tackle, S switch, D slide. S confirms a CHANCE shot."}),(0,rt.jsx)("p",{className:"review-note",children:"Invented clubs. Source-derived reference art. Original sound. Local exhibition."}),!V&&(0,rt.jsx)("button",{className:"utility",onClick:()=>{s.current?.restart(),g(!1)},children:"RESTART MATCH"}),(0,rt.jsx)("button",{className:"utility",onClick:it,children:"EXIT TO GAMES"})]})})]})}function s3(e,t={},n=new URL("./assets.json",import.meta.url)){let i=(0,v1.createRoot)(e),s=!1;return i.render((0,rt.jsx)(i3,{context:t,manifestUrl:n})),{definition:Li,dispose(){s||(s=!0,i.unmount())}}}var x1=document.getElementById("game");if(x1){let e=f1(),t=s3(x1,e.context,new URL("./assets.json",import.meta.url));On.dispose=()=>{e.dispose(),t.dispose()}}export{s3 as mountFootball};
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
