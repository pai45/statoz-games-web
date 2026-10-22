var x1=Object.create;var v0=Object.defineProperty;var v1=Object.getOwnPropertyDescriptor;var _1=Object.getOwnPropertyNames;var b1=Object.getPrototypeOf,S1=Object.prototype.hasOwnProperty;var Wi=(e,t)=>()=>{try{return t||e((t={exports:{}}).exports,t),t.exports}catch(n){throw t=0,n}};var M1=(e,t,n,i)=>{if(t&&typeof t=="object"||typeof t=="function")for(let s of _1(t))!S1.call(e,s)&&s!==n&&v0(e,s,{get:()=>t[s],enumerable:!(i=v1(t,s))||i.enumerable});return e};var Ua=(e,t,n)=>(n=e!=null?x1(b1(e)):{},M1(t||!e||!e.__esModule?v0(n,"default",{value:e,enumerable:!0}):n,e));var N0=Wi(zt=>{"use strict";var ad=Symbol.for("react.transitional.element"),T1=Symbol.for("react.portal"),E1=Symbol.for("react.fragment"),A1=Symbol.for("react.strict_mode"),w1=Symbol.for("react.profiler"),C1=Symbol.for("react.consumer"),R1=Symbol.for("react.context"),N1=Symbol.for("react.forward_ref"),D1=Symbol.for("react.suspense"),L1=Symbol.for("react.memo"),T0=Symbol.for("react.lazy"),U1=Symbol.for("react.activity"),_0=Symbol.iterator;function O1(e){return e===null||typeof e!="object"?null:(e=_0&&e[_0]||e["@@iterator"],typeof e=="function"?e:null)}var E0={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},A0=Object.assign,w0={};function yr(e,t,n){this.props=e,this.context=t,this.refs=w0,this.updater=n||E0}yr.prototype.isReactComponent={};yr.prototype.setState=function(e,t){if(typeof e!="object"&&typeof e!="function"&&e!=null)throw Error("takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,e,t,"setState")};yr.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")};function C0(){}C0.prototype=yr.prototype;function rd(e,t,n){this.props=e,this.context=t,this.refs=w0,this.updater=n||E0}var od=rd.prototype=new C0;od.constructor=rd;A0(od,yr.prototype);od.isPureReactComponent=!0;var b0=Array.isArray;function sd(){}var Ae={H:null,A:null,T:null,S:null},R0=Object.prototype.hasOwnProperty;function ld(e,t,n){var i=n.ref;return{$$typeof:ad,type:e,key:t,ref:i!==void 0?i:null,props:n}}function I1(e,t){return ld(e.type,t,e.props)}function cd(e){return typeof e=="object"&&e!==null&&e.$$typeof===ad}function P1(e){var t={"=":"=0",":":"=2"};return"$"+e.replace(/[=:]/g,function(n){return t[n]})}var S0=/\/+/g;function id(e,t){return typeof e=="object"&&e!==null&&e.key!=null?P1(""+e.key):t.toString(36)}function B1(e){switch(e.status){case"fulfilled":return e.value;case"rejected":throw e.reason;default:switch(typeof e.status=="string"?e.then(sd,sd):(e.status="pending",e.then(function(t){e.status==="pending"&&(e.status="fulfilled",e.value=t)},function(t){e.status==="pending"&&(e.status="rejected",e.reason=t)})),e.status){case"fulfilled":return e.value;case"rejected":throw e.reason}}throw e}function gr(e,t,n,i,s){var a=typeof e;(a==="undefined"||a==="boolean")&&(e=null);var r=!1;if(e===null)r=!0;else switch(a){case"bigint":case"string":case"number":r=!0;break;case"object":switch(e.$$typeof){case ad:case T1:r=!0;break;case T0:return r=e._init,gr(r(e._payload),t,n,i,s)}}if(r)return s=s(e),r=i===""?"."+id(e,0):i,b0(s)?(n="",r!=null&&(n=r.replace(S0,"$&/")+"/"),gr(s,t,n,"",function(c){return c})):s!=null&&(cd(s)&&(s=I1(s,n+(s.key==null||e&&e.key===s.key?"":(""+s.key).replace(S0,"$&/")+"/")+r)),t.push(s)),1;r=0;var o=i===""?".":i+":";if(b0(e))for(var l=0;l<e.length;l++)i=e[l],a=o+id(i,l),r+=gr(i,t,n,a,s);else if(l=O1(e),typeof l=="function")for(e=l.call(e),l=0;!(i=e.next()).done;)i=i.value,a=o+id(i,l++),r+=gr(i,t,n,a,s);else if(a==="object"){if(typeof e.then=="function")return gr(B1(e),t,n,i,s);throw t=String(e),Error("Objects are not valid as a React child (found: "+(t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t)+"). If you meant to render a collection of children, use an array instead.")}return r}function Ec(e,t,n){if(e==null)return e;var i=[],s=0;return gr(e,i,"","",function(a){return t.call(n,a,s++)}),i}function z1(e){if(e._status===-1){var t=e._result;t=t(),t.then(function(n){(e._status===0||e._status===-1)&&(e._status=1,e._result=n)},function(n){(e._status===0||e._status===-1)&&(e._status=2,e._result=n)}),e._status===-1&&(e._status=0,e._result=t)}if(e._status===1)return e._result.default;throw e._result}var M0=typeof reportError=="function"?reportError:function(e){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var t=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof e=="object"&&e!==null&&typeof e.message=="string"?String(e.message):String(e),error:e});if(!window.dispatchEvent(t))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",e);return}console.error(e)},F1={map:Ec,forEach:function(e,t,n){Ec(e,function(){t.apply(this,arguments)},n)},count:function(e){var t=0;return Ec(e,function(){t++}),t},toArray:function(e){return Ec(e,function(t){return t})||[]},only:function(e){if(!cd(e))throw Error("React.Children.only expected to receive a single React element child.");return e}};zt.Activity=U1;zt.Children=F1;zt.Component=yr;zt.Fragment=E1;zt.Profiler=w1;zt.PureComponent=rd;zt.StrictMode=A1;zt.Suspense=D1;zt.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=Ae;zt.__COMPILER_RUNTIME={__proto__:null,c:function(e){return Ae.H.useMemoCache(e)}};zt.cache=function(e){return function(){return e.apply(null,arguments)}};zt.cacheSignal=function(){return null};zt.cloneElement=function(e,t,n){if(e==null)throw Error("The argument must be a React element, but you passed "+e+".");var i=A0({},e.props),s=e.key;if(t!=null)for(a in t.key!==void 0&&(s=""+t.key),t)!R0.call(t,a)||a==="key"||a==="__self"||a==="__source"||a==="ref"&&t.ref===void 0||(i[a]=t[a]);var a=arguments.length-2;if(a===1)i.children=n;else if(1<a){for(var r=Array(a),o=0;o<a;o++)r[o]=arguments[o+2];i.children=r}return ld(e.type,s,i)};zt.createContext=function(e){return e={$$typeof:R1,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null},e.Provider=e,e.Consumer={$$typeof:C1,_context:e},e};zt.createElement=function(e,t,n){var i,s={},a=null;if(t!=null)for(i in t.key!==void 0&&(a=""+t.key),t)R0.call(t,i)&&i!=="key"&&i!=="__self"&&i!=="__source"&&(s[i]=t[i]);var r=arguments.length-2;if(r===1)s.children=n;else if(1<r){for(var o=Array(r),l=0;l<r;l++)o[l]=arguments[l+2];s.children=o}if(e&&e.defaultProps)for(i in r=e.defaultProps,r)s[i]===void 0&&(s[i]=r[i]);return ld(e,a,s)};zt.createRef=function(){return{current:null}};zt.forwardRef=function(e){return{$$typeof:N1,render:e}};zt.isValidElement=cd;zt.lazy=function(e){return{$$typeof:T0,_payload:{_status:-1,_result:e},_init:z1}};zt.memo=function(e,t){return{$$typeof:L1,type:e,compare:t===void 0?null:t}};zt.startTransition=function(e){var t=Ae.T,n={};Ae.T=n;try{var i=e(),s=Ae.S;s!==null&&s(n,i),typeof i=="object"&&i!==null&&typeof i.then=="function"&&i.then(sd,M0)}catch(a){M0(a)}finally{t!==null&&n.types!==null&&(t.types=n.types),Ae.T=t}};zt.unstable_useCacheRefresh=function(){return Ae.H.useCacheRefresh()};zt.use=function(e){return Ae.H.use(e)};zt.useActionState=function(e,t,n){return Ae.H.useActionState(e,t,n)};zt.useCallback=function(e,t){return Ae.H.useCallback(e,t)};zt.useContext=function(e){return Ae.H.useContext(e)};zt.useDebugValue=function(){};zt.useDeferredValue=function(e,t){return Ae.H.useDeferredValue(e,t)};zt.useEffect=function(e,t){return Ae.H.useEffect(e,t)};zt.useEffectEvent=function(e){return Ae.H.useEffectEvent(e)};zt.useId=function(){return Ae.H.useId()};zt.useImperativeHandle=function(e,t,n){return Ae.H.useImperativeHandle(e,t,n)};zt.useInsertionEffect=function(e,t){return Ae.H.useInsertionEffect(e,t)};zt.useLayoutEffect=function(e,t){return Ae.H.useLayoutEffect(e,t)};zt.useMemo=function(e,t){return Ae.H.useMemo(e,t)};zt.useOptimistic=function(e,t){return Ae.H.useOptimistic(e,t)};zt.useReducer=function(e,t,n){return Ae.H.useReducer(e,t,n)};zt.useRef=function(e){return Ae.H.useRef(e)};zt.useState=function(e){return Ae.H.useState(e)};zt.useSyncExternalStore=function(e,t,n){return Ae.H.useSyncExternalStore(e,t,n)};zt.useTransition=function(){return Ae.H.useTransition()};zt.version="19.2.8"});var Bo=Wi((QR,D0)=>{"use strict";D0.exports=N0()});var H0=Wi(Oe=>{"use strict";function dd(e,t){var n=e.length;e.push(t);t:for(;0<n;){var i=n-1>>>1,s=e[i];if(0<Ac(s,t))e[i]=t,e[n]=s,n=i;else break t}}function Xi(e){return e.length===0?null:e[0]}function Cc(e){if(e.length===0)return null;var t=e[0],n=e.pop();if(n!==t){e[0]=n;t:for(var i=0,s=e.length,a=s>>>1;i<a;){var r=2*(i+1)-1,o=e[r],l=r+1,c=e[l];if(0>Ac(o,n))l<s&&0>Ac(c,o)?(e[i]=c,e[l]=n,i=l):(e[i]=o,e[r]=n,i=r);else if(l<s&&0>Ac(c,n))e[i]=c,e[l]=n,i=l;else break t}}return t}function Ac(e,t){var n=e.sortIndex-t.sortIndex;return n!==0?n:e.id-t.id}Oe.unstable_now=void 0;typeof performance=="object"&&typeof performance.now=="function"?(L0=performance,Oe.unstable_now=function(){return L0.now()}):(ud=Date,U0=ud.now(),Oe.unstable_now=function(){return ud.now()-U0});var L0,ud,U0,ls=[],Fs=[],k1=1,ci=null,Sn=3,pd=!1,zo=!1,Fo=!1,md=!1,P0=typeof setTimeout=="function"?setTimeout:null,B0=typeof clearTimeout=="function"?clearTimeout:null,O0=typeof setImmediate<"u"?setImmediate:null;function wc(e){for(var t=Xi(Fs);t!==null;){if(t.callback===null)Cc(Fs);else if(t.startTime<=e)Cc(Fs),t.sortIndex=t.expirationTime,dd(ls,t);else break;t=Xi(Fs)}}function gd(e){if(Fo=!1,wc(e),!zo)if(Xi(ls)!==null)zo=!0,vr||(vr=!0,xr());else{var t=Xi(Fs);t!==null&&yd(gd,t.startTime-e)}}var vr=!1,ko=-1,z0=5,F0=-1;function k0(){return md?!0:!(Oe.unstable_now()-F0<z0)}function hd(){if(md=!1,vr){var e=Oe.unstable_now();F0=e;var t=!0;try{t:{zo=!1,Fo&&(Fo=!1,B0(ko),ko=-1),pd=!0;var n=Sn;try{e:{for(wc(e),ci=Xi(ls);ci!==null&&!(ci.expirationTime>e&&k0());){var i=ci.callback;if(typeof i=="function"){ci.callback=null,Sn=ci.priorityLevel;var s=i(ci.expirationTime<=e);if(e=Oe.unstable_now(),typeof s=="function"){ci.callback=s,wc(e),t=!0;break e}ci===Xi(ls)&&Cc(ls),wc(e)}else Cc(ls);ci=Xi(ls)}if(ci!==null)t=!0;else{var a=Xi(Fs);a!==null&&yd(gd,a.startTime-e),t=!1}}break t}finally{ci=null,Sn=n,pd=!1}t=void 0}}finally{t?xr():vr=!1}}}var xr;typeof O0=="function"?xr=function(){O0(hd)}:typeof MessageChannel<"u"?(fd=new MessageChannel,I0=fd.port2,fd.port1.onmessage=hd,xr=function(){I0.postMessage(null)}):xr=function(){P0(hd,0)};var fd,I0;function yd(e,t){ko=P0(function(){e(Oe.unstable_now())},t)}Oe.unstable_IdlePriority=5;Oe.unstable_ImmediatePriority=1;Oe.unstable_LowPriority=4;Oe.unstable_NormalPriority=3;Oe.unstable_Profiling=null;Oe.unstable_UserBlockingPriority=2;Oe.unstable_cancelCallback=function(e){e.callback=null};Oe.unstable_forceFrameRate=function(e){0>e||125<e?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):z0=0<e?Math.floor(1e3/e):5};Oe.unstable_getCurrentPriorityLevel=function(){return Sn};Oe.unstable_next=function(e){switch(Sn){case 1:case 2:case 3:var t=3;break;default:t=Sn}var n=Sn;Sn=t;try{return e()}finally{Sn=n}};Oe.unstable_requestPaint=function(){md=!0};Oe.unstable_runWithPriority=function(e,t){switch(e){case 1:case 2:case 3:case 4:case 5:break;default:e=3}var n=Sn;Sn=e;try{return t()}finally{Sn=n}};Oe.unstable_scheduleCallback=function(e,t,n){var i=Oe.unstable_now();switch(typeof n=="object"&&n!==null?(n=n.delay,n=typeof n=="number"&&0<n?i+n:i):n=i,e){case 1:var s=-1;break;case 2:s=250;break;case 5:s=1073741823;break;case 4:s=1e4;break;default:s=5e3}return s=n+s,e={id:k1++,callback:t,priorityLevel:e,startTime:n,expirationTime:s,sortIndex:-1},n>i?(e.sortIndex=n,dd(Fs,e),Xi(ls)===null&&e===Xi(Fs)&&(Fo?(B0(ko),ko=-1):Fo=!0,yd(gd,n-i))):(e.sortIndex=s,dd(ls,e),zo||pd||(zo=!0,vr||(vr=!0,xr()))),e};Oe.unstable_shouldYield=k0;Oe.unstable_wrapCallback=function(e){var t=Sn;return function(){var n=Sn;Sn=t;try{return e.apply(this,arguments)}finally{Sn=n}}}});var G0=Wi(($R,V0)=>{"use strict";V0.exports=H0()});var X0=Wi(Nn=>{"use strict";var H1=Bo();function W0(e){var t="https://react.dev/errors/"+e;if(1<arguments.length){t+="?args[]="+encodeURIComponent(arguments[1]);for(var n=2;n<arguments.length;n++)t+="&args[]="+encodeURIComponent(arguments[n])}return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function ks(){}var Rn={d:{f:ks,r:function(){throw Error(W0(522))},D:ks,C:ks,L:ks,m:ks,X:ks,S:ks,M:ks},p:0,findDOMNode:null},V1=Symbol.for("react.portal");function G1(e,t,n){var i=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:V1,key:i==null?null:""+i,children:e,containerInfo:t,implementation:n}}var Ho=H1.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;function Rc(e,t){if(e==="font")return"";if(typeof t=="string")return t==="use-credentials"?t:""}Nn.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=Rn;Nn.createPortal=function(e,t){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)throw Error(W0(299));return G1(e,t,null,n)};Nn.flushSync=function(e){var t=Ho.T,n=Rn.p;try{if(Ho.T=null,Rn.p=2,e)return e()}finally{Ho.T=t,Rn.p=n,Rn.d.f()}};Nn.preconnect=function(e,t){typeof e=="string"&&(t?(t=t.crossOrigin,t=typeof t=="string"?t==="use-credentials"?t:"":void 0):t=null,Rn.d.C(e,t))};Nn.prefetchDNS=function(e){typeof e=="string"&&Rn.d.D(e)};Nn.preinit=function(e,t){if(typeof e=="string"&&t&&typeof t.as=="string"){var n=t.as,i=Rc(n,t.crossOrigin),s=typeof t.integrity=="string"?t.integrity:void 0,a=typeof t.fetchPriority=="string"?t.fetchPriority:void 0;n==="style"?Rn.d.S(e,typeof t.precedence=="string"?t.precedence:void 0,{crossOrigin:i,integrity:s,fetchPriority:a}):n==="script"&&Rn.d.X(e,{crossOrigin:i,integrity:s,fetchPriority:a,nonce:typeof t.nonce=="string"?t.nonce:void 0})}};Nn.preinitModule=function(e,t){if(typeof e=="string")if(typeof t=="object"&&t!==null){if(t.as==null||t.as==="script"){var n=Rc(t.as,t.crossOrigin);Rn.d.M(e,{crossOrigin:n,integrity:typeof t.integrity=="string"?t.integrity:void 0,nonce:typeof t.nonce=="string"?t.nonce:void 0})}}else t==null&&Rn.d.M(e)};Nn.preload=function(e,t){if(typeof e=="string"&&typeof t=="object"&&t!==null&&typeof t.as=="string"){var n=t.as,i=Rc(n,t.crossOrigin);Rn.d.L(e,n,{crossOrigin:i,integrity:typeof t.integrity=="string"?t.integrity:void 0,nonce:typeof t.nonce=="string"?t.nonce:void 0,type:typeof t.type=="string"?t.type:void 0,fetchPriority:typeof t.fetchPriority=="string"?t.fetchPriority:void 0,referrerPolicy:typeof t.referrerPolicy=="string"?t.referrerPolicy:void 0,imageSrcSet:typeof t.imageSrcSet=="string"?t.imageSrcSet:void 0,imageSizes:typeof t.imageSizes=="string"?t.imageSizes:void 0,media:typeof t.media=="string"?t.media:void 0})}};Nn.preloadModule=function(e,t){if(typeof e=="string")if(t){var n=Rc(t.as,t.crossOrigin);Rn.d.m(e,{as:typeof t.as=="string"&&t.as!=="script"?t.as:void 0,crossOrigin:n,integrity:typeof t.integrity=="string"?t.integrity:void 0})}else Rn.d.m(e)};Nn.requestFormReset=function(e){Rn.d.r(e)};Nn.unstable_batchedUpdates=function(e,t){return e(t)};Nn.useFormState=function(e,t,n){return Ho.H.useFormState(e,t,n)};Nn.useFormStatus=function(){return Ho.H.useHostTransitionStatus()};Nn.version="19.2.8"});var Z0=Wi((e3,Y0)=>{"use strict";function q0(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(q0)}catch(e){console.error(e)}}q0(),Y0.exports=X0()});var rb=Wi(th=>{"use strict";var nn=G0(),_x=Bo(),W1=Z0();function $(e){var t="https://react.dev/errors/"+e;if(1<arguments.length){t+="?args[]="+encodeURIComponent(arguments[1]);for(var n=2;n<arguments.length;n++)t+="&args[]="+encodeURIComponent(arguments[n])}return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function bx(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function wl(e){var t=e,n=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,(t.flags&4098)!==0&&(n=t.return),e=t.return;while(e)}return t.tag===3?n:null}function Sx(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function Mx(e){if(e.tag===31){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function K0(e){if(wl(e)!==e)throw Error($(188))}function X1(e){var t=e.alternate;if(!t){if(t=wl(e),t===null)throw Error($(188));return t!==e?null:e}for(var n=e,i=t;;){var s=n.return;if(s===null)break;var a=s.alternate;if(a===null){if(i=s.return,i!==null){n=i;continue}break}if(s.child===a.child){for(a=s.child;a;){if(a===n)return K0(s),e;if(a===i)return K0(s),t;a=a.sibling}throw Error($(188))}if(n.return!==i.return)n=s,i=a;else{for(var r=!1,o=s.child;o;){if(o===n){r=!0,n=s,i=a;break}if(o===i){r=!0,i=s,n=a;break}o=o.sibling}if(!r){for(o=a.child;o;){if(o===n){r=!0,n=a,i=s;break}if(o===i){r=!0,i=a,n=s;break}o=o.sibling}if(!r)throw Error($(189))}}if(n.alternate!==i)throw Error($(190))}if(n.tag!==3)throw Error($(188));return n.stateNode.current===n?e:t}function Tx(e){var t=e.tag;if(t===5||t===26||t===27||t===6)return e;for(e=e.child;e!==null;){if(t=Tx(e),t!==null)return t;e=e.sibling}return null}var Re=Object.assign,q1=Symbol.for("react.element"),Nc=Symbol.for("react.transitional.element"),Ko=Symbol.for("react.portal"),Er=Symbol.for("react.fragment"),Ex=Symbol.for("react.strict_mode"),Qd=Symbol.for("react.profiler"),Ax=Symbol.for("react.consumer"),gs=Symbol.for("react.context"),qp=Symbol.for("react.forward_ref"),jd=Symbol.for("react.suspense"),$d=Symbol.for("react.suspense_list"),Yp=Symbol.for("react.memo"),Hs=Symbol.for("react.lazy"),tp=Symbol.for("react.activity"),Y1=Symbol.for("react.memo_cache_sentinel"),J0=Symbol.iterator;function Vo(e){return e===null||typeof e!="object"?null:(e=J0&&e[J0]||e["@@iterator"],typeof e=="function"?e:null)}var Z1=Symbol.for("react.client.reference");function ep(e){if(e==null)return null;if(typeof e=="function")return e.$$typeof===Z1?null:e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case Er:return"Fragment";case Qd:return"Profiler";case Ex:return"StrictMode";case jd:return"Suspense";case $d:return"SuspenseList";case tp:return"Activity"}if(typeof e=="object")switch(e.$$typeof){case Ko:return"Portal";case gs:return e.displayName||"Context";case Ax:return(e._context.displayName||"Context")+".Consumer";case qp:var t=e.render;return e=e.displayName,e||(e=t.displayName||t.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case Yp:return t=e.displayName||null,t!==null?t:ep(e.type)||"Memo";case Hs:t=e._payload,e=e._init;try{return ep(e(t))}catch{}}return null}var Jo=Array.isArray,Ut=_x.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,le=W1.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,Fa={pending:!1,data:null,method:null,action:null},np=[],Ar=-1;function Ji(e){return{current:e}}function hn(e){0>Ar||(e.current=np[Ar],np[Ar]=null,Ar--)}function Te(e,t){Ar++,np[Ar]=e.current,e.current=t}var Ki=Ji(null),dl=Ji(null),js=Ji(null),cu=Ji(null);function uu(e,t){switch(Te(js,t),Te(dl,e),Te(Ki,null),t.nodeType){case 9:case 11:e=(e=t.documentElement)&&(e=e.namespaceURI)?ix(e):0;break;default:if(e=t.tagName,t=t.namespaceURI)t=ix(t),e=q_(t,e);else switch(e){case"svg":e=1;break;case"math":e=2;break;default:e=0}}hn(Ki),Te(Ki,e)}function Wr(){hn(Ki),hn(dl),hn(js)}function ip(e){e.memoizedState!==null&&Te(cu,e);var t=Ki.current,n=q_(t,e.type);t!==n&&(Te(dl,e),Te(Ki,n))}function hu(e){dl.current===e&&(hn(Ki),hn(dl)),cu.current===e&&(hn(cu),Tl._currentValue=Fa)}var xd,Q0;function Ia(e){if(xd===void 0)try{throw Error()}catch(n){var t=n.stack.trim().match(/\n( *(at )?)/);xd=t&&t[1]||"",Q0=-1<n.stack.indexOf(`
    at`)?" (<anonymous>)":-1<n.stack.indexOf("@")?"@unknown:0:0":""}return`
`+xd+e+Q0}var vd=!1;function _d(e,t){if(!e||vd)return"";vd=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{var i={DetermineComponentFrameRoot:function(){try{if(t){var f=function(){throw Error()};if(Object.defineProperty(f.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(f,[])}catch(d){var h=d}Reflect.construct(e,[],f)}else{try{f.call()}catch(d){h=d}e.call(f.prototype)}}else{try{throw Error()}catch(d){h=d}(f=e())&&typeof f.catch=="function"&&f.catch(function(){})}}catch(d){if(d&&h&&typeof d.stack=="string")return[d.stack,h.stack]}return[null,null]}};i.DetermineComponentFrameRoot.displayName="DetermineComponentFrameRoot";var s=Object.getOwnPropertyDescriptor(i.DetermineComponentFrameRoot,"name");s&&s.configurable&&Object.defineProperty(i.DetermineComponentFrameRoot,"name",{value:"DetermineComponentFrameRoot"});var a=i.DetermineComponentFrameRoot(),r=a[0],o=a[1];if(r&&o){var l=r.split(`
`),c=o.split(`
`);for(s=i=0;i<l.length&&!l[i].includes("DetermineComponentFrameRoot");)i++;for(;s<c.length&&!c[s].includes("DetermineComponentFrameRoot");)s++;if(i===l.length||s===c.length)for(i=l.length-1,s=c.length-1;1<=i&&0<=s&&l[i]!==c[s];)s--;for(;1<=i&&0<=s;i--,s--)if(l[i]!==c[s]){if(i!==1||s!==1)do if(i--,s--,0>s||l[i]!==c[s]){var u=`
`+l[i].replace(" at new "," at ");return e.displayName&&u.includes("<anonymous>")&&(u=u.replace("<anonymous>",e.displayName)),u}while(1<=i&&0<=s);break}}}finally{vd=!1,Error.prepareStackTrace=n}return(n=e?e.displayName||e.name:"")?Ia(n):""}function K1(e,t){switch(e.tag){case 26:case 27:case 5:return Ia(e.type);case 16:return Ia("Lazy");case 13:return e.child!==t&&t!==null?Ia("Suspense Fallback"):Ia("Suspense");case 19:return Ia("SuspenseList");case 0:case 15:return _d(e.type,!1);case 11:return _d(e.type.render,!1);case 1:return _d(e.type,!0);case 31:return Ia("Activity");default:return""}}function j0(e){try{var t="",n=null;do t+=K1(e,n),n=e,e=e.return;while(e);return t}catch(i){return`
Error generating stack: `+i.message+`
`+i.stack}}var sp=Object.prototype.hasOwnProperty,Zp=nn.unstable_scheduleCallback,bd=nn.unstable_cancelCallback,J1=nn.unstable_shouldYield,Q1=nn.unstable_requestPaint,Qn=nn.unstable_now,j1=nn.unstable_getCurrentPriorityLevel,wx=nn.unstable_ImmediatePriority,Cx=nn.unstable_UserBlockingPriority,fu=nn.unstable_NormalPriority,$1=nn.unstable_LowPriority,Rx=nn.unstable_IdlePriority,tM=nn.log,eM=nn.unstable_setDisableYieldValue,Cl=null,jn=null;function Ys(e){if(typeof tM=="function"&&eM(e),jn&&typeof jn.setStrictMode=="function")try{jn.setStrictMode(Cl,e)}catch{}}var $n=Math.clz32?Math.clz32:sM,nM=Math.log,iM=Math.LN2;function sM(e){return e>>>=0,e===0?32:31-(nM(e)/iM|0)|0}var Dc=256,Lc=262144,Uc=4194304;function Pa(e){var t=e&42;if(t!==0)return t;switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:return 64;case 128:return 128;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:return e&261888;case 262144:case 524288:case 1048576:case 2097152:return e&3932160;case 4194304:case 8388608:case 16777216:case 33554432:return e&62914560;case 67108864:return 67108864;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 0;default:return e}}function zu(e,t,n){var i=e.pendingLanes;if(i===0)return 0;var s=0,a=e.suspendedLanes,r=e.pingedLanes;e=e.warmLanes;var o=i&134217727;return o!==0?(i=o&~a,i!==0?s=Pa(i):(r&=o,r!==0?s=Pa(r):n||(n=o&~e,n!==0&&(s=Pa(n))))):(o=i&~a,o!==0?s=Pa(o):r!==0?s=Pa(r):n||(n=i&~e,n!==0&&(s=Pa(n)))),s===0?0:t!==0&&t!==s&&(t&a)===0&&(a=s&-s,n=t&-t,a>=n||a===32&&(n&4194048)!==0)?t:s}function Rl(e,t){return(e.pendingLanes&~(e.suspendedLanes&~e.pingedLanes)&t)===0}function aM(e,t){switch(e){case 1:case 2:case 4:case 8:case 64:return t+250;case 16:case 32:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:return-1;case 67108864:case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function Nx(){var e=Uc;return Uc<<=1,(Uc&62914560)===0&&(Uc=4194304),e}function Sd(e){for(var t=[],n=0;31>n;n++)t.push(e);return t}function Nl(e,t){e.pendingLanes|=t,t!==268435456&&(e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0)}function rM(e,t,n,i,s,a){var r=e.pendingLanes;e.pendingLanes=n,e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0,e.expiredLanes&=n,e.entangledLanes&=n,e.errorRecoveryDisabledLanes&=n,e.shellSuspendCounter=0;var o=e.entanglements,l=e.expirationTimes,c=e.hiddenUpdates;for(n=r&~n;0<n;){var u=31-$n(n),f=1<<u;o[u]=0,l[u]=-1;var h=c[u];if(h!==null)for(c[u]=null,u=0;u<h.length;u++){var d=h[u];d!==null&&(d.lane&=-536870913)}n&=~f}i!==0&&Dx(e,i,0),a!==0&&s===0&&e.tag!==0&&(e.suspendedLanes|=a&~(r&~t))}function Dx(e,t,n){e.pendingLanes|=t,e.suspendedLanes&=~t;var i=31-$n(t);e.entangledLanes|=t,e.entanglements[i]=e.entanglements[i]|1073741824|n&261930}function Lx(e,t){var n=e.entangledLanes|=t;for(e=e.entanglements;n;){var i=31-$n(n),s=1<<i;s&t|e[i]&t&&(e[i]|=t),n&=~s}}function Ux(e,t){var n=t&-t;return n=(n&42)!==0?1:Kp(n),(n&(e.suspendedLanes|t))!==0?0:n}function Kp(e){switch(e){case 2:e=1;break;case 8:e=4;break;case 32:e=16;break;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:e=128;break;case 268435456:e=134217728;break;default:e=0}return e}function Jp(e){return e&=-e,2<e?8<e?(e&134217727)!==0?32:268435456:8:2}function Ox(){var e=le.p;return e!==0?e:(e=window.event,e===void 0?32:ib(e.type))}function $0(e,t){var n=le.p;try{return le.p=e,t()}finally{le.p=n}}var ha=Math.random().toString(36).slice(2),mn="__reactFiber$"+ha,Hn="__reactProps$"+ha,eo="__reactContainer$"+ha,ap="__reactEvents$"+ha,oM="__reactListeners$"+ha,lM="__reactHandles$"+ha,ty="__reactResources$"+ha,Dl="__reactMarker$"+ha;function Qp(e){delete e[mn],delete e[Hn],delete e[ap],delete e[oM],delete e[lM]}function wr(e){var t=e[mn];if(t)return t;for(var n=e.parentNode;n;){if(t=n[eo]||n[mn]){if(n=t.alternate,t.child!==null||n!==null&&n.child!==null)for(e=lx(e);e!==null;){if(n=e[mn])return n;e=lx(e)}return t}e=n,n=e.parentNode}return null}function no(e){if(e=e[mn]||e[eo]){var t=e.tag;if(t===5||t===6||t===13||t===31||t===26||t===27||t===3)return e}return null}function Qo(e){var t=e.tag;if(t===5||t===26||t===27||t===6)return e.stateNode;throw Error($(33))}function Br(e){var t=e[ty];return t||(t=e[ty]={hoistableStyles:new Map,hoistableScripts:new Map}),t}function un(e){e[Dl]=!0}var Ix=new Set,Px={};function Ka(e,t){Xr(e,t),Xr(e+"Capture",t)}function Xr(e,t){for(Px[e]=t,e=0;e<t.length;e++)Ix.add(t[e])}var cM=RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"),ey={},ny={};function uM(e){return sp.call(ny,e)?!0:sp.call(ey,e)?!1:cM.test(e)?ny[e]=!0:(ey[e]=!0,!1)}function Zc(e,t,n){if(uM(t))if(n===null)e.removeAttribute(t);else{switch(typeof n){case"undefined":case"function":case"symbol":e.removeAttribute(t);return;case"boolean":var i=t.toLowerCase().slice(0,5);if(i!=="data-"&&i!=="aria-"){e.removeAttribute(t);return}}e.setAttribute(t,""+n)}}function Oc(e,t,n){if(n===null)e.removeAttribute(t);else{switch(typeof n){case"undefined":case"function":case"symbol":case"boolean":e.removeAttribute(t);return}e.setAttribute(t,""+n)}}function cs(e,t,n,i){if(i===null)e.removeAttribute(n);else{switch(typeof i){case"undefined":case"function":case"symbol":case"boolean":e.removeAttribute(n);return}e.setAttributeNS(t,n,""+i)}}function hi(e){switch(typeof e){case"bigint":case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function Bx(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(t==="checkbox"||t==="radio")}function hM(e,t,n){var i=Object.getOwnPropertyDescriptor(e.constructor.prototype,t);if(!e.hasOwnProperty(t)&&typeof i<"u"&&typeof i.get=="function"&&typeof i.set=="function"){var s=i.get,a=i.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return s.call(this)},set:function(r){n=""+r,a.call(this,r)}}),Object.defineProperty(e,t,{enumerable:i.enumerable}),{getValue:function(){return n},setValue:function(r){n=""+r},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function rp(e){if(!e._valueTracker){var t=Bx(e)?"checked":"value";e._valueTracker=hM(e,t,""+e[t])}}function zx(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),i="";return e&&(i=Bx(e)?e.checked?"true":"false":e.value),e=i,e!==n?(t.setValue(e),!0):!1}function du(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}var fM=/[\n"\\]/g;function pi(e){return e.replace(fM,function(t){return"\\"+t.charCodeAt(0).toString(16)+" "})}function op(e,t,n,i,s,a,r,o){e.name="",r!=null&&typeof r!="function"&&typeof r!="symbol"&&typeof r!="boolean"?e.type=r:e.removeAttribute("type"),t!=null?r==="number"?(t===0&&e.value===""||e.value!=t)&&(e.value=""+hi(t)):e.value!==""+hi(t)&&(e.value=""+hi(t)):r!=="submit"&&r!=="reset"||e.removeAttribute("value"),t!=null?lp(e,r,hi(t)):n!=null?lp(e,r,hi(n)):i!=null&&e.removeAttribute("value"),s==null&&a!=null&&(e.defaultChecked=!!a),s!=null&&(e.checked=s&&typeof s!="function"&&typeof s!="symbol"),o!=null&&typeof o!="function"&&typeof o!="symbol"&&typeof o!="boolean"?e.name=""+hi(o):e.removeAttribute("name")}function Fx(e,t,n,i,s,a,r,o){if(a!=null&&typeof a!="function"&&typeof a!="symbol"&&typeof a!="boolean"&&(e.type=a),t!=null||n!=null){if(!(a!=="submit"&&a!=="reset"||t!=null)){rp(e);return}n=n!=null?""+hi(n):"",t=t!=null?""+hi(t):n,o||t===e.value||(e.value=t),e.defaultValue=t}i=i??s,i=typeof i!="function"&&typeof i!="symbol"&&!!i,e.checked=o?e.checked:!!i,e.defaultChecked=!!i,r!=null&&typeof r!="function"&&typeof r!="symbol"&&typeof r!="boolean"&&(e.name=r),rp(e)}function lp(e,t,n){t==="number"&&du(e.ownerDocument)===e||e.defaultValue===""+n||(e.defaultValue=""+n)}function zr(e,t,n,i){if(e=e.options,t){t={};for(var s=0;s<n.length;s++)t["$"+n[s]]=!0;for(n=0;n<e.length;n++)s=t.hasOwnProperty("$"+e[n].value),e[n].selected!==s&&(e[n].selected=s),s&&i&&(e[n].defaultSelected=!0)}else{for(n=""+hi(n),t=null,s=0;s<e.length;s++){if(e[s].value===n){e[s].selected=!0,i&&(e[s].defaultSelected=!0);return}t!==null||e[s].disabled||(t=e[s])}t!==null&&(t.selected=!0)}}function kx(e,t,n){if(t!=null&&(t=""+hi(t),t!==e.value&&(e.value=t),n==null)){e.defaultValue!==t&&(e.defaultValue=t);return}e.defaultValue=n!=null?""+hi(n):""}function Hx(e,t,n,i){if(t==null){if(i!=null){if(n!=null)throw Error($(92));if(Jo(i)){if(1<i.length)throw Error($(93));i=i[0]}n=i}n==null&&(n=""),t=n}n=hi(t),e.defaultValue=n,i=e.textContent,i===n&&i!==""&&i!==null&&(e.value=i),rp(e)}function qr(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&n.nodeType===3){n.nodeValue=t;return}}e.textContent=t}var dM=new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));function iy(e,t,n){var i=t.indexOf("--")===0;n==null||typeof n=="boolean"||n===""?i?e.setProperty(t,""):t==="float"?e.cssFloat="":e[t]="":i?e.setProperty(t,n):typeof n!="number"||n===0||dM.has(t)?t==="float"?e.cssFloat=n:e[t]=(""+n).trim():e[t]=n+"px"}function Vx(e,t,n){if(t!=null&&typeof t!="object")throw Error($(62));if(e=e.style,n!=null){for(var i in n)!n.hasOwnProperty(i)||t!=null&&t.hasOwnProperty(i)||(i.indexOf("--")===0?e.setProperty(i,""):i==="float"?e.cssFloat="":e[i]="");for(var s in t)i=t[s],t.hasOwnProperty(s)&&n[s]!==i&&iy(e,s,i)}else for(var a in t)t.hasOwnProperty(a)&&iy(e,a,t[a])}function jp(e){if(e.indexOf("-")===-1)return!1;switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var pM=new Map([["acceptCharset","accept-charset"],["htmlFor","for"],["httpEquiv","http-equiv"],["crossOrigin","crossorigin"],["accentHeight","accent-height"],["alignmentBaseline","alignment-baseline"],["arabicForm","arabic-form"],["baselineShift","baseline-shift"],["capHeight","cap-height"],["clipPath","clip-path"],["clipRule","clip-rule"],["colorInterpolation","color-interpolation"],["colorInterpolationFilters","color-interpolation-filters"],["colorProfile","color-profile"],["colorRendering","color-rendering"],["dominantBaseline","dominant-baseline"],["enableBackground","enable-background"],["fillOpacity","fill-opacity"],["fillRule","fill-rule"],["floodColor","flood-color"],["floodOpacity","flood-opacity"],["fontFamily","font-family"],["fontSize","font-size"],["fontSizeAdjust","font-size-adjust"],["fontStretch","font-stretch"],["fontStyle","font-style"],["fontVariant","font-variant"],["fontWeight","font-weight"],["glyphName","glyph-name"],["glyphOrientationHorizontal","glyph-orientation-horizontal"],["glyphOrientationVertical","glyph-orientation-vertical"],["horizAdvX","horiz-adv-x"],["horizOriginX","horiz-origin-x"],["imageRendering","image-rendering"],["letterSpacing","letter-spacing"],["lightingColor","lighting-color"],["markerEnd","marker-end"],["markerMid","marker-mid"],["markerStart","marker-start"],["overlinePosition","overline-position"],["overlineThickness","overline-thickness"],["paintOrder","paint-order"],["panose-1","panose-1"],["pointerEvents","pointer-events"],["renderingIntent","rendering-intent"],["shapeRendering","shape-rendering"],["stopColor","stop-color"],["stopOpacity","stop-opacity"],["strikethroughPosition","strikethrough-position"],["strikethroughThickness","strikethrough-thickness"],["strokeDasharray","stroke-dasharray"],["strokeDashoffset","stroke-dashoffset"],["strokeLinecap","stroke-linecap"],["strokeLinejoin","stroke-linejoin"],["strokeMiterlimit","stroke-miterlimit"],["strokeOpacity","stroke-opacity"],["strokeWidth","stroke-width"],["textAnchor","text-anchor"],["textDecoration","text-decoration"],["textRendering","text-rendering"],["transformOrigin","transform-origin"],["underlinePosition","underline-position"],["underlineThickness","underline-thickness"],["unicodeBidi","unicode-bidi"],["unicodeRange","unicode-range"],["unitsPerEm","units-per-em"],["vAlphabetic","v-alphabetic"],["vHanging","v-hanging"],["vIdeographic","v-ideographic"],["vMathematical","v-mathematical"],["vectorEffect","vector-effect"],["vertAdvY","vert-adv-y"],["vertOriginX","vert-origin-x"],["vertOriginY","vert-origin-y"],["wordSpacing","word-spacing"],["writingMode","writing-mode"],["xmlnsXlink","xmlns:xlink"],["xHeight","x-height"]]),mM=/^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;function Kc(e){return mM.test(""+e)?"javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')":e}function ys(){}var cp=null;function $p(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var Cr=null,Fr=null;function sy(e){var t=no(e);if(t&&(e=t.stateNode)){var n=e[Hn]||null;t:switch(e=t.stateNode,t.type){case"input":if(op(e,n.value,n.defaultValue,n.defaultValue,n.checked,n.defaultChecked,n.type,n.name),t=n.name,n.type==="radio"&&t!=null){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll('input[name="'+pi(""+t)+'"][type="radio"]'),t=0;t<n.length;t++){var i=n[t];if(i!==e&&i.form===e.form){var s=i[Hn]||null;if(!s)throw Error($(90));op(i,s.value,s.defaultValue,s.defaultValue,s.checked,s.defaultChecked,s.type,s.name)}}for(t=0;t<n.length;t++)i=n[t],i.form===e.form&&zx(i)}break t;case"textarea":kx(e,n.value,n.defaultValue);break t;case"select":t=n.value,t!=null&&zr(e,!!n.multiple,t,!1)}}}var Md=!1;function Gx(e,t,n){if(Md)return e(t,n);Md=!0;try{var i=e(t);return i}finally{if(Md=!1,(Cr!==null||Fr!==null)&&(Ju(),Cr&&(t=Cr,e=Fr,Fr=Cr=null,sy(t),e)))for(t=0;t<e.length;t++)sy(e[t])}}function pl(e,t){var n=e.stateNode;if(n===null)return null;var i=n[Hn]||null;if(i===null)return null;n=i[t];t:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(i=!i.disabled)||(e=e.type,i=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!i;break t;default:e=!1}if(e)return null;if(n&&typeof n!="function")throw Error($(231,t,typeof n));return n}var Ss=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),up=!1;if(Ss)try{_r={},Object.defineProperty(_r,"passive",{get:function(){up=!0}}),window.addEventListener("test",_r,_r),window.removeEventListener("test",_r,_r)}catch{up=!1}var _r,Zs=null,tm=null,Jc=null;function Wx(){if(Jc)return Jc;var e,t=tm,n=t.length,i,s="value"in Zs?Zs.value:Zs.textContent,a=s.length;for(e=0;e<n&&t[e]===s[e];e++);var r=n-e;for(i=1;i<=r&&t[n-i]===s[a-i];i++);return Jc=s.slice(e,1<i?1-i:void 0)}function Qc(e){var t=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function Ic(){return!0}function ay(){return!1}function Vn(e){function t(n,i,s,a,r){this._reactName=n,this._targetInst=s,this.type=i,this.nativeEvent=a,this.target=r,this.currentTarget=null;for(var o in e)e.hasOwnProperty(o)&&(n=e[o],this[o]=n?n(a):a[o]);return this.isDefaultPrevented=(a.defaultPrevented!=null?a.defaultPrevented:a.returnValue===!1)?Ic:ay,this.isPropagationStopped=ay,this}return Re(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=Ic)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=Ic)},persist:function(){},isPersistent:Ic}),t}var Ja={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Fu=Vn(Ja),Ll=Re({},Ja,{view:0,detail:0}),gM=Vn(Ll),Td,Ed,Go,ku=Re({},Ll,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:em,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==Go&&(Go&&e.type==="mousemove"?(Td=e.screenX-Go.screenX,Ed=e.screenY-Go.screenY):Ed=Td=0,Go=e),Td)},movementY:function(e){return"movementY"in e?e.movementY:Ed}}),ry=Vn(ku),yM=Re({},ku,{dataTransfer:0}),xM=Vn(yM),vM=Re({},Ll,{relatedTarget:0}),Ad=Vn(vM),_M=Re({},Ja,{animationName:0,elapsedTime:0,pseudoElement:0}),bM=Vn(_M),SM=Re({},Ja,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),MM=Vn(SM),TM=Re({},Ja,{data:0}),oy=Vn(TM),EM={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},AM={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},wM={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function CM(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=wM[e])?!!t[e]:!1}function em(){return CM}var RM=Re({},Ll,{key:function(e){if(e.key){var t=EM[e.key]||e.key;if(t!=="Unidentified")return t}return e.type==="keypress"?(e=Qc(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?AM[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:em,charCode:function(e){return e.type==="keypress"?Qc(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?Qc(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),NM=Vn(RM),DM=Re({},ku,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),ly=Vn(DM),LM=Re({},Ll,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:em}),UM=Vn(LM),OM=Re({},Ja,{propertyName:0,elapsedTime:0,pseudoElement:0}),IM=Vn(OM),PM=Re({},ku,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),BM=Vn(PM),zM=Re({},Ja,{newState:0,oldState:0}),FM=Vn(zM),kM=[9,13,27,32],nm=Ss&&"CompositionEvent"in window,tl=null;Ss&&"documentMode"in document&&(tl=document.documentMode);var HM=Ss&&"TextEvent"in window&&!tl,Xx=Ss&&(!nm||tl&&8<tl&&11>=tl),cy=" ",uy=!1;function qx(e,t){switch(e){case"keyup":return kM.indexOf(t.keyCode)!==-1;case"keydown":return t.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Yx(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var Rr=!1;function VM(e,t){switch(e){case"compositionend":return Yx(t);case"keypress":return t.which!==32?null:(uy=!0,cy);case"textInput":return e=t.data,e===cy&&uy?null:e;default:return null}}function GM(e,t){if(Rr)return e==="compositionend"||!nm&&qx(e,t)?(e=Wx(),Jc=tm=Zs=null,Rr=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return Xx&&t.locale!=="ko"?null:t.data;default:return null}}var WM={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function hy(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t==="input"?!!WM[e.type]:t==="textarea"}function Zx(e,t,n,i){Cr?Fr?Fr.push(i):Fr=[i]:Cr=i,t=Du(t,"onChange"),0<t.length&&(n=new Fu("onChange","change",null,n,i),e.push({event:n,listeners:t}))}var el=null,ml=null;function XM(e){G_(e,0)}function Hu(e){var t=Qo(e);if(zx(t))return e}function fy(e,t){if(e==="change")return t}var Kx=!1;Ss&&(Ss?(Bc="oninput"in document,Bc||(wd=document.createElement("div"),wd.setAttribute("oninput","return;"),Bc=typeof wd.oninput=="function"),Pc=Bc):Pc=!1,Kx=Pc&&(!document.documentMode||9<document.documentMode));var Pc,Bc,wd;function dy(){el&&(el.detachEvent("onpropertychange",Jx),ml=el=null)}function Jx(e){if(e.propertyName==="value"&&Hu(ml)){var t=[];Zx(t,ml,e,$p(e)),Gx(XM,t)}}function qM(e,t,n){e==="focusin"?(dy(),el=t,ml=n,el.attachEvent("onpropertychange",Jx)):e==="focusout"&&dy()}function YM(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return Hu(ml)}function ZM(e,t){if(e==="click")return Hu(t)}function KM(e,t){if(e==="input"||e==="change")return Hu(t)}function JM(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var ei=typeof Object.is=="function"?Object.is:JM;function gl(e,t){if(ei(e,t))return!0;if(typeof e!="object"||e===null||typeof t!="object"||t===null)return!1;var n=Object.keys(e),i=Object.keys(t);if(n.length!==i.length)return!1;for(i=0;i<n.length;i++){var s=n[i];if(!sp.call(t,s)||!ei(e[s],t[s]))return!1}return!0}function py(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function my(e,t){var n=py(e);e=0;for(var i;n;){if(n.nodeType===3){if(i=e+n.textContent.length,e<=t&&i>=t)return{node:n,offset:t-e};e=i}t:{for(;n;){if(n.nextSibling){n=n.nextSibling;break t}n=n.parentNode}n=void 0}n=py(n)}}function Qx(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?Qx(e,t.parentNode):"contains"in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function jx(e){e=e!=null&&e.ownerDocument!=null&&e.ownerDocument.defaultView!=null?e.ownerDocument.defaultView:window;for(var t=du(e.document);t instanceof e.HTMLIFrameElement;){try{var n=typeof t.contentWindow.location.href=="string"}catch{n=!1}if(n)e=t.contentWindow;else break;t=du(e.document)}return t}function im(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||t==="textarea"||e.contentEditable==="true")}var QM=Ss&&"documentMode"in document&&11>=document.documentMode,Nr=null,hp=null,nl=null,fp=!1;function gy(e,t,n){var i=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;fp||Nr==null||Nr!==du(i)||(i=Nr,"selectionStart"in i&&im(i)?i={start:i.selectionStart,end:i.selectionEnd}:(i=(i.ownerDocument&&i.ownerDocument.defaultView||window).getSelection(),i={anchorNode:i.anchorNode,anchorOffset:i.anchorOffset,focusNode:i.focusNode,focusOffset:i.focusOffset}),nl&&gl(nl,i)||(nl=i,i=Du(hp,"onSelect"),0<i.length&&(t=new Fu("onSelect","select",null,t,n),e.push({event:t,listeners:i}),t.target=Nr)))}function Oa(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n["Webkit"+e]="webkit"+t,n["Moz"+e]="moz"+t,n}var Dr={animationend:Oa("Animation","AnimationEnd"),animationiteration:Oa("Animation","AnimationIteration"),animationstart:Oa("Animation","AnimationStart"),transitionrun:Oa("Transition","TransitionRun"),transitionstart:Oa("Transition","TransitionStart"),transitioncancel:Oa("Transition","TransitionCancel"),transitionend:Oa("Transition","TransitionEnd")},Cd={},$x={};Ss&&($x=document.createElement("div").style,"AnimationEvent"in window||(delete Dr.animationend.animation,delete Dr.animationiteration.animation,delete Dr.animationstart.animation),"TransitionEvent"in window||delete Dr.transitionend.transition);function Qa(e){if(Cd[e])return Cd[e];if(!Dr[e])return e;var t=Dr[e],n;for(n in t)if(t.hasOwnProperty(n)&&n in $x)return Cd[e]=t[n];return e}var tv=Qa("animationend"),ev=Qa("animationiteration"),nv=Qa("animationstart"),jM=Qa("transitionrun"),$M=Qa("transitionstart"),tT=Qa("transitioncancel"),iv=Qa("transitionend"),sv=new Map,dp="abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");dp.push("scrollEnd");function Ni(e,t){sv.set(e,t),Ka(t,[e])}var pu=typeof reportError=="function"?reportError:function(e){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var t=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof e=="object"&&e!==null&&typeof e.message=="string"?String(e.message):String(e),error:e});if(!window.dispatchEvent(t))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",e);return}console.error(e)},ui=[],Lr=0,sm=0;function Vu(){for(var e=Lr,t=sm=Lr=0;t<e;){var n=ui[t];ui[t++]=null;var i=ui[t];ui[t++]=null;var s=ui[t];ui[t++]=null;var a=ui[t];if(ui[t++]=null,i!==null&&s!==null){var r=i.pending;r===null?s.next=s:(s.next=r.next,r.next=s),i.pending=s}a!==0&&av(n,s,a)}}function Gu(e,t,n,i){ui[Lr++]=e,ui[Lr++]=t,ui[Lr++]=n,ui[Lr++]=i,sm|=i,e.lanes|=i,e=e.alternate,e!==null&&(e.lanes|=i)}function am(e,t,n,i){return Gu(e,t,n,i),mu(e)}function ja(e,t){return Gu(e,null,null,t),mu(e)}function av(e,t,n){e.lanes|=n;var i=e.alternate;i!==null&&(i.lanes|=n);for(var s=!1,a=e.return;a!==null;)a.childLanes|=n,i=a.alternate,i!==null&&(i.childLanes|=n),a.tag===22&&(e=a.stateNode,e===null||e._visibility&1||(s=!0)),e=a,a=a.return;return e.tag===3?(a=e.stateNode,s&&t!==null&&(s=31-$n(n),e=a.hiddenUpdates,i=e[s],i===null?e[s]=[t]:i.push(t),t.lane=n|536870912),a):null}function mu(e){if(50<hl)throw hl=0,Op=null,Error($(185));for(var t=e.return;t!==null;)e=t,t=e.return;return e.tag===3?e.stateNode:null}var Ur={};function eT(e,t,n,i){this.tag=e,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.refCleanup=this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=i,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Kn(e,t,n,i){return new eT(e,t,n,i)}function rm(e){return e=e.prototype,!(!e||!e.isReactComponent)}function vs(e,t){var n=e.alternate;return n===null?(n=Kn(e.tag,t,e.key,e.mode),n.elementType=e.elementType,n.type=e.type,n.stateNode=e.stateNode,n.alternate=e,e.alternate=n):(n.pendingProps=t,n.type=e.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=e.flags&65011712,n.childLanes=e.childLanes,n.lanes=e.lanes,n.child=e.child,n.memoizedProps=e.memoizedProps,n.memoizedState=e.memoizedState,n.updateQueue=e.updateQueue,t=e.dependencies,n.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},n.sibling=e.sibling,n.index=e.index,n.ref=e.ref,n.refCleanup=e.refCleanup,n}function rv(e,t){e.flags&=65011714;var n=e.alternate;return n===null?(e.childLanes=0,e.lanes=t,e.child=null,e.subtreeFlags=0,e.memoizedProps=null,e.memoizedState=null,e.updateQueue=null,e.dependencies=null,e.stateNode=null):(e.childLanes=n.childLanes,e.lanes=n.lanes,e.child=n.child,e.subtreeFlags=0,e.deletions=null,e.memoizedProps=n.memoizedProps,e.memoizedState=n.memoizedState,e.updateQueue=n.updateQueue,e.type=n.type,t=n.dependencies,e.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext}),e}function jc(e,t,n,i,s,a){var r=0;if(i=e,typeof e=="function")rm(e)&&(r=1);else if(typeof e=="string")r=sE(e,n,Ki.current)?26:e==="html"||e==="head"||e==="body"?27:5;else t:switch(e){case tp:return e=Kn(31,n,t,s),e.elementType=tp,e.lanes=a,e;case Er:return ka(n.children,s,a,t);case Ex:r=8,s|=24;break;case Qd:return e=Kn(12,n,t,s|2),e.elementType=Qd,e.lanes=a,e;case jd:return e=Kn(13,n,t,s),e.elementType=jd,e.lanes=a,e;case $d:return e=Kn(19,n,t,s),e.elementType=$d,e.lanes=a,e;default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case gs:r=10;break t;case Ax:r=9;break t;case qp:r=11;break t;case Yp:r=14;break t;case Hs:r=16,i=null;break t}r=29,n=Error($(130,e===null?"null":typeof e,"")),i=null}return t=Kn(r,n,t,s),t.elementType=e,t.type=i,t.lanes=a,t}function ka(e,t,n,i){return e=Kn(7,e,i,t),e.lanes=n,e}function Rd(e,t,n){return e=Kn(6,e,null,t),e.lanes=n,e}function ov(e){var t=Kn(18,null,null,0);return t.stateNode=e,t}function Nd(e,t,n){return t=Kn(4,e.children!==null?e.children:[],e.key,t),t.lanes=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}var yy=new WeakMap;function mi(e,t){if(typeof e=="object"&&e!==null){var n=yy.get(e);return n!==void 0?n:(t={value:e,source:t,stack:j0(t)},yy.set(e,t),t)}return{value:e,source:t,stack:j0(t)}}var Or=[],Ir=0,gu=null,yl=0,fi=[],di=0,oa=null,qi=1,Yi="";function ps(e,t){Or[Ir++]=yl,Or[Ir++]=gu,gu=e,yl=t}function lv(e,t,n){fi[di++]=qi,fi[di++]=Yi,fi[di++]=oa,oa=e;var i=qi;e=Yi;var s=32-$n(i)-1;i&=~(1<<s),n+=1;var a=32-$n(t)+s;if(30<a){var r=s-s%5;a=(i&(1<<r)-1).toString(32),i>>=r,s-=r,qi=1<<32-$n(t)+s|n<<s|i,Yi=a+e}else qi=1<<a|n<<s|i,Yi=e}function om(e){e.return!==null&&(ps(e,1),lv(e,1,0))}function lm(e){for(;e===gu;)gu=Or[--Ir],Or[Ir]=null,yl=Or[--Ir],Or[Ir]=null;for(;e===oa;)oa=fi[--di],fi[di]=null,Yi=fi[--di],fi[di]=null,qi=fi[--di],fi[di]=null}function cv(e,t){fi[di++]=qi,fi[di++]=Yi,fi[di++]=oa,qi=t.id,Yi=t.overflow,oa=e}var gn=null,Ce=null,jt=!1,$s=null,gi=!1,pp=Error($(519));function la(e){var t=Error($(418,1<arguments.length&&arguments[1]!==void 0&&arguments[1]?"text":"HTML",""));throw xl(mi(t,e)),pp}function xy(e){var t=e.stateNode,n=e.type,i=e.memoizedProps;switch(t[mn]=e,t[Hn]=i,n){case"dialog":Yt("cancel",t),Yt("close",t);break;case"iframe":case"object":case"embed":Yt("load",t);break;case"video":case"audio":for(n=0;n<Sl.length;n++)Yt(Sl[n],t);break;case"source":Yt("error",t);break;case"img":case"image":case"link":Yt("error",t),Yt("load",t);break;case"details":Yt("toggle",t);break;case"input":Yt("invalid",t),Fx(t,i.value,i.defaultValue,i.checked,i.defaultChecked,i.type,i.name,!0);break;case"select":Yt("invalid",t);break;case"textarea":Yt("invalid",t),Hx(t,i.value,i.defaultValue,i.children)}n=i.children,typeof n!="string"&&typeof n!="number"&&typeof n!="bigint"||t.textContent===""+n||i.suppressHydrationWarning===!0||X_(t.textContent,n)?(i.popover!=null&&(Yt("beforetoggle",t),Yt("toggle",t)),i.onScroll!=null&&Yt("scroll",t),i.onScrollEnd!=null&&Yt("scrollend",t),i.onClick!=null&&(t.onclick=ys),t=!0):t=!1,t||la(e,!0)}function vy(e){for(gn=e.return;gn;)switch(gn.tag){case 5:case 31:case 13:gi=!1;return;case 27:case 3:gi=!0;return;default:gn=gn.return}}function br(e){if(e!==gn)return!1;if(!jt)return vy(e),jt=!0,!1;var t=e.tag,n;if((n=t!==3&&t!==27)&&((n=t===5)&&(n=e.type,n=!(n!=="form"&&n!=="button")||Fp(e.type,e.memoizedProps)),n=!n),n&&Ce&&la(e),vy(e),t===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error($(317));Ce=ox(e)}else if(t===31){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error($(317));Ce=ox(e)}else t===27?(t=Ce,fa(e.type)?(e=Gp,Gp=null,Ce=e):Ce=t):Ce=gn?xi(e.stateNode.nextSibling):null;return!0}function Wa(){Ce=gn=null,jt=!1}function Dd(){var e=$s;return e!==null&&(Fn===null?Fn=e:Fn.push.apply(Fn,e),$s=null),e}function xl(e){$s===null?$s=[e]:$s.push(e)}var mp=Ji(null),$a=null,xs=null;function Gs(e,t,n){Te(mp,t._currentValue),t._currentValue=n}function _s(e){e._currentValue=mp.current,hn(mp)}function gp(e,t,n){for(;e!==null;){var i=e.alternate;if((e.childLanes&t)!==t?(e.childLanes|=t,i!==null&&(i.childLanes|=t)):i!==null&&(i.childLanes&t)!==t&&(i.childLanes|=t),e===n)break;e=e.return}}function yp(e,t,n,i){var s=e.child;for(s!==null&&(s.return=e);s!==null;){var a=s.dependencies;if(a!==null){var r=s.child;a=a.firstContext;t:for(;a!==null;){var o=a;a=s;for(var l=0;l<t.length;l++)if(o.context===t[l]){a.lanes|=n,o=a.alternate,o!==null&&(o.lanes|=n),gp(a.return,n,e),i||(r=null);break t}a=o.next}}else if(s.tag===18){if(r=s.return,r===null)throw Error($(341));r.lanes|=n,a=r.alternate,a!==null&&(a.lanes|=n),gp(r,n,e),r=null}else r=s.child;if(r!==null)r.return=s;else for(r=s;r!==null;){if(r===e){r=null;break}if(s=r.sibling,s!==null){s.return=r.return,r=s;break}r=r.return}s=r}}function io(e,t,n,i){e=null;for(var s=t,a=!1;s!==null;){if(!a){if((s.flags&524288)!==0)a=!0;else if((s.flags&262144)!==0)break}if(s.tag===10){var r=s.alternate;if(r===null)throw Error($(387));if(r=r.memoizedProps,r!==null){var o=s.type;ei(s.pendingProps.value,r.value)||(e!==null?e.push(o):e=[o])}}else if(s===cu.current){if(r=s.alternate,r===null)throw Error($(387));r.memoizedState.memoizedState!==s.memoizedState.memoizedState&&(e!==null?e.push(Tl):e=[Tl])}s=s.return}e!==null&&yp(t,e,n,i),t.flags|=262144}function yu(e){for(e=e.firstContext;e!==null;){if(!ei(e.context._currentValue,e.memoizedValue))return!0;e=e.next}return!1}function Xa(e){$a=e,xs=null,e=e.dependencies,e!==null&&(e.firstContext=null)}function yn(e){return uv($a,e)}function zc(e,t){return $a===null&&Xa(e),uv(e,t)}function uv(e,t){var n=t._currentValue;if(t={context:t,memoizedValue:n,next:null},xs===null){if(e===null)throw Error($(308));xs=t,e.dependencies={lanes:0,firstContext:t},e.flags|=524288}else xs=xs.next=t;return n}var nT=typeof AbortController<"u"?AbortController:function(){var e=[],t=this.signal={aborted:!1,addEventListener:function(n,i){e.push(i)}};this.abort=function(){t.aborted=!0,e.forEach(function(n){return n()})}},iT=nn.unstable_scheduleCallback,sT=nn.unstable_NormalPriority,je={$$typeof:gs,Consumer:null,Provider:null,_currentValue:null,_currentValue2:null,_threadCount:0};function cm(){return{controller:new nT,data:new Map,refCount:0}}function Ul(e){e.refCount--,e.refCount===0&&iT(sT,function(){e.controller.abort()})}var il=null,xp=0,Yr=0,kr=null;function aT(e,t){if(il===null){var n=il=[];xp=0,Yr=Om(),kr={status:"pending",value:void 0,then:function(i){n.push(i)}}}return xp++,t.then(_y,_y),t}function _y(){if(--xp===0&&il!==null){kr!==null&&(kr.status="fulfilled");var e=il;il=null,Yr=0,kr=null;for(var t=0;t<e.length;t++)(0,e[t])()}}function rT(e,t){var n=[],i={status:"pending",value:null,reason:null,then:function(s){n.push(s)}};return e.then(function(){i.status="fulfilled",i.value=t;for(var s=0;s<n.length;s++)(0,n[s])(t)},function(s){for(i.status="rejected",i.reason=s,s=0;s<n.length;s++)(0,n[s])(void 0)}),i}var by=Ut.S;Ut.S=function(e,t){T_=Qn(),typeof t=="object"&&t!==null&&typeof t.then=="function"&&aT(e,t),by!==null&&by(e,t)};var Ha=Ji(null);function um(){var e=Ha.current;return e!==null?e:_e.pooledCache}function $c(e,t){t===null?Te(Ha,Ha.current):Te(Ha,t.pool)}function hv(){var e=um();return e===null?null:{parent:je._currentValue,pool:e}}var so=Error($(460)),hm=Error($(474)),Wu=Error($(542)),xu={then:function(){}};function Sy(e){return e=e.status,e==="fulfilled"||e==="rejected"}function fv(e,t,n){switch(n=e[n],n===void 0?e.push(t):n!==t&&(t.then(ys,ys),t=n),t.status){case"fulfilled":return t.value;case"rejected":throw e=t.reason,Ty(e),e;default:if(typeof t.status=="string")t.then(ys,ys);else{if(e=_e,e!==null&&100<e.shellSuspendCounter)throw Error($(482));e=t,e.status="pending",e.then(function(i){if(t.status==="pending"){var s=t;s.status="fulfilled",s.value=i}},function(i){if(t.status==="pending"){var s=t;s.status="rejected",s.reason=i}})}switch(t.status){case"fulfilled":return t.value;case"rejected":throw e=t.reason,Ty(e),e}throw Va=t,so}}function Ba(e){try{var t=e._init;return t(e._payload)}catch(n){throw n!==null&&typeof n=="object"&&typeof n.then=="function"?(Va=n,so):n}}var Va=null;function My(){if(Va===null)throw Error($(459));var e=Va;return Va=null,e}function Ty(e){if(e===so||e===Wu)throw Error($(483))}var Hr=null,vl=0;function Fc(e){var t=vl;return vl+=1,Hr===null&&(Hr=[]),fv(Hr,e,t)}function Wo(e,t){t=t.props.ref,e.ref=t!==void 0?t:null}function kc(e,t){throw t.$$typeof===q1?Error($(525)):(e=Object.prototype.toString.call(t),Error($(31,e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e)))}function dv(e){function t(p,y){if(e){var S=p.deletions;S===null?(p.deletions=[y],p.flags|=16):S.push(y)}}function n(p,y){if(!e)return null;for(;y!==null;)t(p,y),y=y.sibling;return null}function i(p){for(var y=new Map;p!==null;)p.key!==null?y.set(p.key,p):y.set(p.index,p),p=p.sibling;return y}function s(p,y){return p=vs(p,y),p.index=0,p.sibling=null,p}function a(p,y,S){return p.index=S,e?(S=p.alternate,S!==null?(S=S.index,S<y?(p.flags|=67108866,y):S):(p.flags|=67108866,y)):(p.flags|=1048576,y)}function r(p){return e&&p.alternate===null&&(p.flags|=67108866),p}function o(p,y,S,v){return y===null||y.tag!==6?(y=Rd(S,p.mode,v),y.return=p,y):(y=s(y,S),y.return=p,y)}function l(p,y,S,v){var T=S.type;return T===Er?u(p,y,S.props.children,v,S.key):y!==null&&(y.elementType===T||typeof T=="object"&&T!==null&&T.$$typeof===Hs&&Ba(T)===y.type)?(y=s(y,S.props),Wo(y,S),y.return=p,y):(y=jc(S.type,S.key,S.props,null,p.mode,v),Wo(y,S),y.return=p,y)}function c(p,y,S,v){return y===null||y.tag!==4||y.stateNode.containerInfo!==S.containerInfo||y.stateNode.implementation!==S.implementation?(y=Nd(S,p.mode,v),y.return=p,y):(y=s(y,S.children||[]),y.return=p,y)}function u(p,y,S,v,T){return y===null||y.tag!==7?(y=ka(S,p.mode,v,T),y.return=p,y):(y=s(y,S),y.return=p,y)}function f(p,y,S){if(typeof y=="string"&&y!==""||typeof y=="number"||typeof y=="bigint")return y=Rd(""+y,p.mode,S),y.return=p,y;if(typeof y=="object"&&y!==null){switch(y.$$typeof){case Nc:return S=jc(y.type,y.key,y.props,null,p.mode,S),Wo(S,y),S.return=p,S;case Ko:return y=Nd(y,p.mode,S),y.return=p,y;case Hs:return y=Ba(y),f(p,y,S)}if(Jo(y)||Vo(y))return y=ka(y,p.mode,S,null),y.return=p,y;if(typeof y.then=="function")return f(p,Fc(y),S);if(y.$$typeof===gs)return f(p,zc(p,y),S);kc(p,y)}return null}function h(p,y,S,v){var T=y!==null?y.key:null;if(typeof S=="string"&&S!==""||typeof S=="number"||typeof S=="bigint")return T!==null?null:o(p,y,""+S,v);if(typeof S=="object"&&S!==null){switch(S.$$typeof){case Nc:return S.key===T?l(p,y,S,v):null;case Ko:return S.key===T?c(p,y,S,v):null;case Hs:return S=Ba(S),h(p,y,S,v)}if(Jo(S)||Vo(S))return T!==null?null:u(p,y,S,v,null);if(typeof S.then=="function")return h(p,y,Fc(S),v);if(S.$$typeof===gs)return h(p,y,zc(p,S),v);kc(p,S)}return null}function d(p,y,S,v,T){if(typeof v=="string"&&v!==""||typeof v=="number"||typeof v=="bigint")return p=p.get(S)||null,o(y,p,""+v,T);if(typeof v=="object"&&v!==null){switch(v.$$typeof){case Nc:return p=p.get(v.key===null?S:v.key)||null,l(y,p,v,T);case Ko:return p=p.get(v.key===null?S:v.key)||null,c(y,p,v,T);case Hs:return v=Ba(v),d(p,y,S,v,T)}if(Jo(v)||Vo(v))return p=p.get(S)||null,u(y,p,v,T,null);if(typeof v.then=="function")return d(p,y,S,Fc(v),T);if(v.$$typeof===gs)return d(p,y,S,zc(y,v),T);kc(y,v)}return null}function m(p,y,S,v){for(var T=null,E=null,C=y,_=y=0,A=null;C!==null&&_<S.length;_++){C.index>_?(A=C,C=null):A=C.sibling;var R=h(p,C,S[_],v);if(R===null){C===null&&(C=A);break}e&&C&&R.alternate===null&&t(p,C),y=a(R,y,_),E===null?T=R:E.sibling=R,E=R,C=A}if(_===S.length)return n(p,C),jt&&ps(p,_),T;if(C===null){for(;_<S.length;_++)C=f(p,S[_],v),C!==null&&(y=a(C,y,_),E===null?T=C:E.sibling=C,E=C);return jt&&ps(p,_),T}for(C=i(C);_<S.length;_++)A=d(C,p,_,S[_],v),A!==null&&(e&&A.alternate!==null&&C.delete(A.key===null?_:A.key),y=a(A,y,_),E===null?T=A:E.sibling=A,E=A);return e&&C.forEach(function(O){return t(p,O)}),jt&&ps(p,_),T}function b(p,y,S,v){if(S==null)throw Error($(151));for(var T=null,E=null,C=y,_=y=0,A=null,R=S.next();C!==null&&!R.done;_++,R=S.next()){C.index>_?(A=C,C=null):A=C.sibling;var O=h(p,C,R.value,v);if(O===null){C===null&&(C=A);break}e&&C&&O.alternate===null&&t(p,C),y=a(O,y,_),E===null?T=O:E.sibling=O,E=O,C=A}if(R.done)return n(p,C),jt&&ps(p,_),T;if(C===null){for(;!R.done;_++,R=S.next())R=f(p,R.value,v),R!==null&&(y=a(R,y,_),E===null?T=R:E.sibling=R,E=R);return jt&&ps(p,_),T}for(C=i(C);!R.done;_++,R=S.next())R=d(C,p,_,R.value,v),R!==null&&(e&&R.alternate!==null&&C.delete(R.key===null?_:R.key),y=a(R,y,_),E===null?T=R:E.sibling=R,E=R);return e&&C.forEach(function(F){return t(p,F)}),jt&&ps(p,_),T}function g(p,y,S,v){if(typeof S=="object"&&S!==null&&S.type===Er&&S.key===null&&(S=S.props.children),typeof S=="object"&&S!==null){switch(S.$$typeof){case Nc:t:{for(var T=S.key;y!==null;){if(y.key===T){if(T=S.type,T===Er){if(y.tag===7){n(p,y.sibling),v=s(y,S.props.children),v.return=p,p=v;break t}}else if(y.elementType===T||typeof T=="object"&&T!==null&&T.$$typeof===Hs&&Ba(T)===y.type){n(p,y.sibling),v=s(y,S.props),Wo(v,S),v.return=p,p=v;break t}n(p,y);break}else t(p,y);y=y.sibling}S.type===Er?(v=ka(S.props.children,p.mode,v,S.key),v.return=p,p=v):(v=jc(S.type,S.key,S.props,null,p.mode,v),Wo(v,S),v.return=p,p=v)}return r(p);case Ko:t:{for(T=S.key;y!==null;){if(y.key===T)if(y.tag===4&&y.stateNode.containerInfo===S.containerInfo&&y.stateNode.implementation===S.implementation){n(p,y.sibling),v=s(y,S.children||[]),v.return=p,p=v;break t}else{n(p,y);break}else t(p,y);y=y.sibling}v=Nd(S,p.mode,v),v.return=p,p=v}return r(p);case Hs:return S=Ba(S),g(p,y,S,v)}if(Jo(S))return m(p,y,S,v);if(Vo(S)){if(T=Vo(S),typeof T!="function")throw Error($(150));return S=T.call(S),b(p,y,S,v)}if(typeof S.then=="function")return g(p,y,Fc(S),v);if(S.$$typeof===gs)return g(p,y,zc(p,S),v);kc(p,S)}return typeof S=="string"&&S!==""||typeof S=="number"||typeof S=="bigint"?(S=""+S,y!==null&&y.tag===6?(n(p,y.sibling),v=s(y,S),v.return=p,p=v):(n(p,y),v=Rd(S,p.mode,v),v.return=p,p=v),r(p)):n(p,y)}return function(p,y,S,v){try{vl=0;var T=g(p,y,S,v);return Hr=null,T}catch(C){if(C===so||C===Wu)throw C;var E=Kn(29,C,null,p.mode);return E.lanes=v,E.return=p,E}}}var qa=dv(!0),pv=dv(!1),Vs=!1;function fm(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,lanes:0,hiddenCallbacks:null},callbacks:null}}function vp(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,callbacks:null})}function ta(e){return{lane:e,tag:0,payload:null,callback:null,next:null}}function ea(e,t,n){var i=e.updateQueue;if(i===null)return null;if(i=i.shared,(oe&2)!==0){var s=i.pending;return s===null?t.next=t:(t.next=s.next,s.next=t),i.pending=t,t=mu(e),av(e,null,n),t}return Gu(e,i,t,n),mu(e)}function sl(e,t,n){if(t=t.updateQueue,t!==null&&(t=t.shared,(n&4194048)!==0)){var i=t.lanes;i&=e.pendingLanes,n|=i,t.lanes=n,Lx(e,n)}}function Ld(e,t){var n=e.updateQueue,i=e.alternate;if(i!==null&&(i=i.updateQueue,n===i)){var s=null,a=null;if(n=n.firstBaseUpdate,n!==null){do{var r={lane:n.lane,tag:n.tag,payload:n.payload,callback:null,next:null};a===null?s=a=r:a=a.next=r,n=n.next}while(n!==null);a===null?s=a=t:a=a.next=t}else s=a=t;n={baseState:i.baseState,firstBaseUpdate:s,lastBaseUpdate:a,shared:i.shared,callbacks:i.callbacks},e.updateQueue=n;return}e=n.lastBaseUpdate,e===null?n.firstBaseUpdate=t:e.next=t,n.lastBaseUpdate=t}var _p=!1;function al(){if(_p){var e=kr;if(e!==null)throw e}}function rl(e,t,n,i){_p=!1;var s=e.updateQueue;Vs=!1;var a=s.firstBaseUpdate,r=s.lastBaseUpdate,o=s.shared.pending;if(o!==null){s.shared.pending=null;var l=o,c=l.next;l.next=null,r===null?a=c:r.next=c,r=l;var u=e.alternate;u!==null&&(u=u.updateQueue,o=u.lastBaseUpdate,o!==r&&(o===null?u.firstBaseUpdate=c:o.next=c,u.lastBaseUpdate=l))}if(a!==null){var f=s.baseState;r=0,u=c=l=null,o=a;do{var h=o.lane&-536870913,d=h!==o.lane;if(d?(Jt&h)===h:(i&h)===h){h!==0&&h===Yr&&(_p=!0),u!==null&&(u=u.next={lane:0,tag:o.tag,payload:o.payload,callback:null,next:null});t:{var m=e,b=o;h=t;var g=n;switch(b.tag){case 1:if(m=b.payload,typeof m=="function"){f=m.call(g,f,h);break t}f=m;break t;case 3:m.flags=m.flags&-65537|128;case 0:if(m=b.payload,h=typeof m=="function"?m.call(g,f,h):m,h==null)break t;f=Re({},f,h);break t;case 2:Vs=!0}}h=o.callback,h!==null&&(e.flags|=64,d&&(e.flags|=8192),d=s.callbacks,d===null?s.callbacks=[h]:d.push(h))}else d={lane:h,tag:o.tag,payload:o.payload,callback:o.callback,next:null},u===null?(c=u=d,l=f):u=u.next=d,r|=h;if(o=o.next,o===null){if(o=s.shared.pending,o===null)break;d=o,o=d.next,d.next=null,s.lastBaseUpdate=d,s.shared.pending=null}}while(!0);u===null&&(l=f),s.baseState=l,s.firstBaseUpdate=c,s.lastBaseUpdate=u,a===null&&(s.shared.lanes=0),ua|=r,e.lanes=r,e.memoizedState=f}}function mv(e,t){if(typeof e!="function")throw Error($(191,e));e.call(t)}function gv(e,t){var n=e.callbacks;if(n!==null)for(e.callbacks=null,e=0;e<n.length;e++)mv(n[e],t)}var Zr=Ji(null),vu=Ji(0);function Ey(e,t){e=As,Te(vu,e),Te(Zr,t),As=e|t.baseLanes}function bp(){Te(vu,As),Te(Zr,Zr.current)}function dm(){As=vu.current,hn(Zr),hn(vu)}var ni=Ji(null),yi=null;function Ws(e){var t=e.alternate;Te(Ge,Ge.current&1),Te(ni,e),yi===null&&(t===null||Zr.current!==null||t.memoizedState!==null)&&(yi=e)}function Sp(e){Te(Ge,Ge.current),Te(ni,e),yi===null&&(yi=e)}function yv(e){e.tag===22?(Te(Ge,Ge.current),Te(ni,e),yi===null&&(yi=e)):Xs(e)}function Xs(){Te(Ge,Ge.current),Te(ni,ni.current)}function Zn(e){hn(ni),yi===e&&(yi=null),hn(Ge)}var Ge=Ji(0);function _u(e){for(var t=e;t!==null;){if(t.tag===13){var n=t.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||Hp(n)||Vp(n)))return t}else if(t.tag===19&&(t.memoizedProps.revealOrder==="forwards"||t.memoizedProps.revealOrder==="backwards"||t.memoizedProps.revealOrder==="unstable_legacy-backwards"||t.memoizedProps.revealOrder==="together")){if((t.flags&128)!==0)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var Ms=0,Ht=null,xe=null,Je=null,bu=!1,Vr=!1,Ya=!1,Su=0,_l=0,Gr=null,oT=0;function Fe(){throw Error($(321))}function pm(e,t){if(t===null)return!1;for(var n=0;n<t.length&&n<e.length;n++)if(!ei(e[n],t[n]))return!1;return!0}function mm(e,t,n,i,s,a){return Ms=a,Ht=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,Ut.H=e===null||e.memoizedState===null?Zv:Am,Ya=!1,a=n(i,s),Ya=!1,Vr&&(a=vv(t,n,i,s)),xv(e),a}function xv(e){Ut.H=bl;var t=xe!==null&&xe.next!==null;if(Ms=0,Je=xe=Ht=null,bu=!1,_l=0,Gr=null,t)throw Error($(300));e===null||$e||(e=e.dependencies,e!==null&&yu(e)&&($e=!0))}function vv(e,t,n,i){Ht=e;var s=0;do{if(Vr&&(Gr=null),_l=0,Vr=!1,25<=s)throw Error($(301));if(s+=1,Je=xe=null,e.updateQueue!=null){var a=e.updateQueue;a.lastEffect=null,a.events=null,a.stores=null,a.memoCache!=null&&(a.memoCache.index=0)}Ut.H=Kv,a=t(n,i)}while(Vr);return a}function lT(){var e=Ut.H,t=e.useState()[0];return t=typeof t.then=="function"?Ol(t):t,e=e.useState()[0],(xe!==null?xe.memoizedState:null)!==e&&(Ht.flags|=1024),t}function gm(){var e=Su!==0;return Su=0,e}function ym(e,t,n){t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~n}function xm(e){if(bu){for(e=e.memoizedState;e!==null;){var t=e.queue;t!==null&&(t.pending=null),e=e.next}bu=!1}Ms=0,Je=xe=Ht=null,Vr=!1,_l=Su=0,Gr=null}function Dn(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Je===null?Ht.memoizedState=Je=e:Je=Je.next=e,Je}function We(){if(xe===null){var e=Ht.alternate;e=e!==null?e.memoizedState:null}else e=xe.next;var t=Je===null?Ht.memoizedState:Je.next;if(t!==null)Je=t,xe=e;else{if(e===null)throw Ht.alternate===null?Error($(467)):Error($(310));xe=e,e={memoizedState:xe.memoizedState,baseState:xe.baseState,baseQueue:xe.baseQueue,queue:xe.queue,next:null},Je===null?Ht.memoizedState=Je=e:Je=Je.next=e}return Je}function Xu(){return{lastEffect:null,events:null,stores:null,memoCache:null}}function Ol(e){var t=_l;return _l+=1,Gr===null&&(Gr=[]),e=fv(Gr,e,t),t=Ht,(Je===null?t.memoizedState:Je.next)===null&&(t=t.alternate,Ut.H=t===null||t.memoizedState===null?Zv:Am),e}function qu(e){if(e!==null&&typeof e=="object"){if(typeof e.then=="function")return Ol(e);if(e.$$typeof===gs)return yn(e)}throw Error($(438,String(e)))}function vm(e){var t=null,n=Ht.updateQueue;if(n!==null&&(t=n.memoCache),t==null){var i=Ht.alternate;i!==null&&(i=i.updateQueue,i!==null&&(i=i.memoCache,i!=null&&(t={data:i.data.map(function(s){return s.slice()}),index:0})))}if(t==null&&(t={data:[],index:0}),n===null&&(n=Xu(),Ht.updateQueue=n),n.memoCache=t,n=t.data[t.index],n===void 0)for(n=t.data[t.index]=Array(e),i=0;i<e;i++)n[i]=Y1;return t.index++,n}function Ts(e,t){return typeof t=="function"?t(e):t}function tu(e){var t=We();return _m(t,xe,e)}function _m(e,t,n){var i=e.queue;if(i===null)throw Error($(311));i.lastRenderedReducer=n;var s=e.baseQueue,a=i.pending;if(a!==null){if(s!==null){var r=s.next;s.next=a.next,a.next=r}t.baseQueue=s=a,i.pending=null}if(a=e.baseState,s===null)e.memoizedState=a;else{t=s.next;var o=r=null,l=null,c=t,u=!1;do{var f=c.lane&-536870913;if(f!==c.lane?(Jt&f)===f:(Ms&f)===f){var h=c.revertLane;if(h===0)l!==null&&(l=l.next={lane:0,revertLane:0,gesture:null,action:c.action,hasEagerState:c.hasEagerState,eagerState:c.eagerState,next:null}),f===Yr&&(u=!0);else if((Ms&h)===h){c=c.next,h===Yr&&(u=!0);continue}else f={lane:0,revertLane:c.revertLane,gesture:null,action:c.action,hasEagerState:c.hasEagerState,eagerState:c.eagerState,next:null},l===null?(o=l=f,r=a):l=l.next=f,Ht.lanes|=h,ua|=h;f=c.action,Ya&&n(a,f),a=c.hasEagerState?c.eagerState:n(a,f)}else h={lane:f,revertLane:c.revertLane,gesture:c.gesture,action:c.action,hasEagerState:c.hasEagerState,eagerState:c.eagerState,next:null},l===null?(o=l=h,r=a):l=l.next=h,Ht.lanes|=f,ua|=f;c=c.next}while(c!==null&&c!==t);if(l===null?r=a:l.next=o,!ei(a,e.memoizedState)&&($e=!0,u&&(n=kr,n!==null)))throw n;e.memoizedState=a,e.baseState=r,e.baseQueue=l,i.lastRenderedState=a}return s===null&&(i.lanes=0),[e.memoizedState,i.dispatch]}function Ud(e){var t=We(),n=t.queue;if(n===null)throw Error($(311));n.lastRenderedReducer=e;var i=n.dispatch,s=n.pending,a=t.memoizedState;if(s!==null){n.pending=null;var r=s=s.next;do a=e(a,r.action),r=r.next;while(r!==s);ei(a,t.memoizedState)||($e=!0),t.memoizedState=a,t.baseQueue===null&&(t.baseState=a),n.lastRenderedState=a}return[a,i]}function _v(e,t,n){var i=Ht,s=We(),a=jt;if(a){if(n===void 0)throw Error($(407));n=n()}else n=t();var r=!ei((xe||s).memoizedState,n);if(r&&(s.memoizedState=n,$e=!0),s=s.queue,bm(Mv.bind(null,i,s,e),[e]),s.getSnapshot!==t||r||Je!==null&&Je.memoizedState.tag&1){if(i.flags|=2048,Kr(9,{destroy:void 0},Sv.bind(null,i,s,n,t),null),_e===null)throw Error($(349));a||(Ms&127)!==0||bv(i,t,n)}return n}function bv(e,t,n){e.flags|=16384,e={getSnapshot:t,value:n},t=Ht.updateQueue,t===null?(t=Xu(),Ht.updateQueue=t,t.stores=[e]):(n=t.stores,n===null?t.stores=[e]:n.push(e))}function Sv(e,t,n,i){t.value=n,t.getSnapshot=i,Tv(t)&&Ev(e)}function Mv(e,t,n){return n(function(){Tv(t)&&Ev(e)})}function Tv(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!ei(e,n)}catch{return!0}}function Ev(e){var t=ja(e,2);t!==null&&kn(t,e,2)}function Mp(e){var t=Dn();if(typeof e=="function"){var n=e;if(e=n(),Ya){Ys(!0);try{n()}finally{Ys(!1)}}}return t.memoizedState=t.baseState=e,t.queue={pending:null,lanes:0,dispatch:null,lastRenderedReducer:Ts,lastRenderedState:e},t}function Av(e,t,n,i){return e.baseState=n,_m(e,xe,typeof i=="function"?i:Ts)}function cT(e,t,n,i,s){if(Zu(e))throw Error($(485));if(e=t.action,e!==null){var a={payload:s,action:e,next:null,isTransition:!0,status:"pending",value:null,reason:null,listeners:[],then:function(r){a.listeners.push(r)}};Ut.T!==null?n(!0):a.isTransition=!1,i(a),n=t.pending,n===null?(a.next=t.pending=a,wv(t,a)):(a.next=n.next,t.pending=n.next=a)}}function wv(e,t){var n=t.action,i=t.payload,s=e.state;if(t.isTransition){var a=Ut.T,r={};Ut.T=r;try{var o=n(s,i),l=Ut.S;l!==null&&l(r,o),Ay(e,t,o)}catch(c){Tp(e,t,c)}finally{a!==null&&r.types!==null&&(a.types=r.types),Ut.T=a}}else try{a=n(s,i),Ay(e,t,a)}catch(c){Tp(e,t,c)}}function Ay(e,t,n){n!==null&&typeof n=="object"&&typeof n.then=="function"?n.then(function(i){wy(e,t,i)},function(i){return Tp(e,t,i)}):wy(e,t,n)}function wy(e,t,n){t.status="fulfilled",t.value=n,Cv(t),e.state=n,t=e.pending,t!==null&&(n=t.next,n===t?e.pending=null:(n=n.next,t.next=n,wv(e,n)))}function Tp(e,t,n){var i=e.pending;if(e.pending=null,i!==null){i=i.next;do t.status="rejected",t.reason=n,Cv(t),t=t.next;while(t!==i)}e.action=null}function Cv(e){e=e.listeners;for(var t=0;t<e.length;t++)(0,e[t])()}function Rv(e,t){return t}function Cy(e,t){if(jt){var n=_e.formState;if(n!==null){t:{var i=Ht;if(jt){if(Ce){e:{for(var s=Ce,a=gi;s.nodeType!==8;){if(!a){s=null;break e}if(s=xi(s.nextSibling),s===null){s=null;break e}}a=s.data,s=a==="F!"||a==="F"?s:null}if(s){Ce=xi(s.nextSibling),i=s.data==="F!";break t}}la(i)}i=!1}i&&(t=n[0])}}return n=Dn(),n.memoizedState=n.baseState=t,i={pending:null,lanes:0,dispatch:null,lastRenderedReducer:Rv,lastRenderedState:t},n.queue=i,n=Xv.bind(null,Ht,i),i.dispatch=n,i=Mp(!1),a=Em.bind(null,Ht,!1,i.queue),i=Dn(),s={state:t,dispatch:null,action:e,pending:null},i.queue=s,n=cT.bind(null,Ht,s,a,n),s.dispatch=n,i.memoizedState=e,[t,n,!1]}function Ry(e){var t=We();return Nv(t,xe,e)}function Nv(e,t,n){if(t=_m(e,t,Rv)[0],e=tu(Ts)[0],typeof t=="object"&&t!==null&&typeof t.then=="function")try{var i=Ol(t)}catch(r){throw r===so?Wu:r}else i=t;t=We();var s=t.queue,a=s.dispatch;return n!==t.memoizedState&&(Ht.flags|=2048,Kr(9,{destroy:void 0},uT.bind(null,s,n),null)),[i,a,e]}function uT(e,t){e.action=t}function Ny(e){var t=We(),n=xe;if(n!==null)return Nv(t,n,e);We(),t=t.memoizedState,n=We();var i=n.queue.dispatch;return n.memoizedState=e,[t,i,!1]}function Kr(e,t,n,i){return e={tag:e,create:n,deps:i,inst:t,next:null},t=Ht.updateQueue,t===null&&(t=Xu(),Ht.updateQueue=t),n=t.lastEffect,n===null?t.lastEffect=e.next=e:(i=n.next,n.next=e,e.next=i,t.lastEffect=e),e}function Dv(){return We().memoizedState}function eu(e,t,n,i){var s=Dn();Ht.flags|=e,s.memoizedState=Kr(1|t,{destroy:void 0},n,i===void 0?null:i)}function Yu(e,t,n,i){var s=We();i=i===void 0?null:i;var a=s.memoizedState.inst;xe!==null&&i!==null&&pm(i,xe.memoizedState.deps)?s.memoizedState=Kr(t,a,n,i):(Ht.flags|=e,s.memoizedState=Kr(1|t,a,n,i))}function Dy(e,t){eu(8390656,8,e,t)}function bm(e,t){Yu(2048,8,e,t)}function hT(e){Ht.flags|=4;var t=Ht.updateQueue;if(t===null)t=Xu(),Ht.updateQueue=t,t.events=[e];else{var n=t.events;n===null?t.events=[e]:n.push(e)}}function Lv(e){var t=We().memoizedState;return hT({ref:t,nextImpl:e}),function(){if((oe&2)!==0)throw Error($(440));return t.impl.apply(void 0,arguments)}}function Uv(e,t){return Yu(4,2,e,t)}function Ov(e,t){return Yu(4,4,e,t)}function Iv(e,t){if(typeof t=="function"){e=e();var n=t(e);return function(){typeof n=="function"?n():t(null)}}if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function Pv(e,t,n){n=n!=null?n.concat([e]):null,Yu(4,4,Iv.bind(null,t,e),n)}function Sm(){}function Bv(e,t){var n=We();t=t===void 0?null:t;var i=n.memoizedState;return t!==null&&pm(t,i[1])?i[0]:(n.memoizedState=[e,t],e)}function zv(e,t){var n=We();t=t===void 0?null:t;var i=n.memoizedState;if(t!==null&&pm(t,i[1]))return i[0];if(i=e(),Ya){Ys(!0);try{e()}finally{Ys(!1)}}return n.memoizedState=[i,t],i}function Mm(e,t,n){return n===void 0||(Ms&1073741824)!==0&&(Jt&261930)===0?e.memoizedState=t:(e.memoizedState=n,e=A_(),Ht.lanes|=e,ua|=e,n)}function Fv(e,t,n,i){return ei(n,t)?n:Zr.current!==null?(e=Mm(e,n,i),ei(e,t)||($e=!0),e):(Ms&42)===0||(Ms&1073741824)!==0&&(Jt&261930)===0?($e=!0,e.memoizedState=n):(e=A_(),Ht.lanes|=e,ua|=e,t)}function kv(e,t,n,i,s){var a=le.p;le.p=a!==0&&8>a?a:8;var r=Ut.T,o={};Ut.T=o,Em(e,!1,t,n);try{var l=s(),c=Ut.S;if(c!==null&&c(o,l),l!==null&&typeof l=="object"&&typeof l.then=="function"){var u=rT(l,i);ol(e,t,u,ti(e))}else ol(e,t,i,ti(e))}catch(f){ol(e,t,{then:function(){},status:"rejected",reason:f},ti())}finally{le.p=a,r!==null&&o.types!==null&&(r.types=o.types),Ut.T=r}}function fT(){}function Ep(e,t,n,i){if(e.tag!==5)throw Error($(476));var s=Hv(e).queue;kv(e,s,t,Fa,n===null?fT:function(){return Vv(e),n(i)})}function Hv(e){var t=e.memoizedState;if(t!==null)return t;t={memoizedState:Fa,baseState:Fa,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:Ts,lastRenderedState:Fa},next:null};var n={};return t.next={memoizedState:n,baseState:n,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:Ts,lastRenderedState:n},next:null},e.memoizedState=t,e=e.alternate,e!==null&&(e.memoizedState=t),t}function Vv(e){var t=Hv(e);t.next===null&&(t=e.alternate.memoizedState),ol(e,t.next.queue,{},ti())}function Tm(){return yn(Tl)}function Gv(){return We().memoizedState}function Wv(){return We().memoizedState}function dT(e){for(var t=e.return;t!==null;){switch(t.tag){case 24:case 3:var n=ti();e=ta(n);var i=ea(t,e,n);i!==null&&(kn(i,t,n),sl(i,t,n)),t={cache:cm()},e.payload=t;return}t=t.return}}function pT(e,t,n){var i=ti();n={lane:i,revertLane:0,gesture:null,action:n,hasEagerState:!1,eagerState:null,next:null},Zu(e)?qv(t,n):(n=am(e,t,n,i),n!==null&&(kn(n,e,i),Yv(n,t,i)))}function Xv(e,t,n){var i=ti();ol(e,t,n,i)}function ol(e,t,n,i){var s={lane:i,revertLane:0,gesture:null,action:n,hasEagerState:!1,eagerState:null,next:null};if(Zu(e))qv(t,s);else{var a=e.alternate;if(e.lanes===0&&(a===null||a.lanes===0)&&(a=t.lastRenderedReducer,a!==null))try{var r=t.lastRenderedState,o=a(r,n);if(s.hasEagerState=!0,s.eagerState=o,ei(o,r))return Gu(e,t,s,0),_e===null&&Vu(),!1}catch{}if(n=am(e,t,s,i),n!==null)return kn(n,e,i),Yv(n,t,i),!0}return!1}function Em(e,t,n,i){if(i={lane:2,revertLane:Om(),gesture:null,action:i,hasEagerState:!1,eagerState:null,next:null},Zu(e)){if(t)throw Error($(479))}else t=am(e,n,i,2),t!==null&&kn(t,e,2)}function Zu(e){var t=e.alternate;return e===Ht||t!==null&&t===Ht}function qv(e,t){Vr=bu=!0;var n=e.pending;n===null?t.next=t:(t.next=n.next,n.next=t),e.pending=t}function Yv(e,t,n){if((n&4194048)!==0){var i=t.lanes;i&=e.pendingLanes,n|=i,t.lanes=n,Lx(e,n)}}var bl={readContext:yn,use:qu,useCallback:Fe,useContext:Fe,useEffect:Fe,useImperativeHandle:Fe,useLayoutEffect:Fe,useInsertionEffect:Fe,useMemo:Fe,useReducer:Fe,useRef:Fe,useState:Fe,useDebugValue:Fe,useDeferredValue:Fe,useTransition:Fe,useSyncExternalStore:Fe,useId:Fe,useHostTransitionStatus:Fe,useFormState:Fe,useActionState:Fe,useOptimistic:Fe,useMemoCache:Fe,useCacheRefresh:Fe};bl.useEffectEvent=Fe;var Zv={readContext:yn,use:qu,useCallback:function(e,t){return Dn().memoizedState=[e,t===void 0?null:t],e},useContext:yn,useEffect:Dy,useImperativeHandle:function(e,t,n){n=n!=null?n.concat([e]):null,eu(4194308,4,Iv.bind(null,t,e),n)},useLayoutEffect:function(e,t){return eu(4194308,4,e,t)},useInsertionEffect:function(e,t){eu(4,2,e,t)},useMemo:function(e,t){var n=Dn();t=t===void 0?null:t;var i=e();if(Ya){Ys(!0);try{e()}finally{Ys(!1)}}return n.memoizedState=[i,t],i},useReducer:function(e,t,n){var i=Dn();if(n!==void 0){var s=n(t);if(Ya){Ys(!0);try{n(t)}finally{Ys(!1)}}}else s=t;return i.memoizedState=i.baseState=s,e={pending:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:s},i.queue=e,e=e.dispatch=pT.bind(null,Ht,e),[i.memoizedState,e]},useRef:function(e){var t=Dn();return e={current:e},t.memoizedState=e},useState:function(e){e=Mp(e);var t=e.queue,n=Xv.bind(null,Ht,t);return t.dispatch=n,[e.memoizedState,n]},useDebugValue:Sm,useDeferredValue:function(e,t){var n=Dn();return Mm(n,e,t)},useTransition:function(){var e=Mp(!1);return e=kv.bind(null,Ht,e.queue,!0,!1),Dn().memoizedState=e,[!1,e]},useSyncExternalStore:function(e,t,n){var i=Ht,s=Dn();if(jt){if(n===void 0)throw Error($(407));n=n()}else{if(n=t(),_e===null)throw Error($(349));(Jt&127)!==0||bv(i,t,n)}s.memoizedState=n;var a={value:n,getSnapshot:t};return s.queue=a,Dy(Mv.bind(null,i,a,e),[e]),i.flags|=2048,Kr(9,{destroy:void 0},Sv.bind(null,i,a,n,t),null),n},useId:function(){var e=Dn(),t=_e.identifierPrefix;if(jt){var n=Yi,i=qi;n=(i&~(1<<32-$n(i)-1)).toString(32)+n,t="_"+t+"R_"+n,n=Su++,0<n&&(t+="H"+n.toString(32)),t+="_"}else n=oT++,t="_"+t+"r_"+n.toString(32)+"_";return e.memoizedState=t},useHostTransitionStatus:Tm,useFormState:Cy,useActionState:Cy,useOptimistic:function(e){var t=Dn();t.memoizedState=t.baseState=e;var n={pending:null,lanes:0,dispatch:null,lastRenderedReducer:null,lastRenderedState:null};return t.queue=n,t=Em.bind(null,Ht,!0,n),n.dispatch=t,[e,t]},useMemoCache:vm,useCacheRefresh:function(){return Dn().memoizedState=dT.bind(null,Ht)},useEffectEvent:function(e){var t=Dn(),n={impl:e};return t.memoizedState=n,function(){if((oe&2)!==0)throw Error($(440));return n.impl.apply(void 0,arguments)}}},Am={readContext:yn,use:qu,useCallback:Bv,useContext:yn,useEffect:bm,useImperativeHandle:Pv,useInsertionEffect:Uv,useLayoutEffect:Ov,useMemo:zv,useReducer:tu,useRef:Dv,useState:function(){return tu(Ts)},useDebugValue:Sm,useDeferredValue:function(e,t){var n=We();return Fv(n,xe.memoizedState,e,t)},useTransition:function(){var e=tu(Ts)[0],t=We().memoizedState;return[typeof e=="boolean"?e:Ol(e),t]},useSyncExternalStore:_v,useId:Gv,useHostTransitionStatus:Tm,useFormState:Ry,useActionState:Ry,useOptimistic:function(e,t){var n=We();return Av(n,xe,e,t)},useMemoCache:vm,useCacheRefresh:Wv};Am.useEffectEvent=Lv;var Kv={readContext:yn,use:qu,useCallback:Bv,useContext:yn,useEffect:bm,useImperativeHandle:Pv,useInsertionEffect:Uv,useLayoutEffect:Ov,useMemo:zv,useReducer:Ud,useRef:Dv,useState:function(){return Ud(Ts)},useDebugValue:Sm,useDeferredValue:function(e,t){var n=We();return xe===null?Mm(n,e,t):Fv(n,xe.memoizedState,e,t)},useTransition:function(){var e=Ud(Ts)[0],t=We().memoizedState;return[typeof e=="boolean"?e:Ol(e),t]},useSyncExternalStore:_v,useId:Gv,useHostTransitionStatus:Tm,useFormState:Ny,useActionState:Ny,useOptimistic:function(e,t){var n=We();return xe!==null?Av(n,xe,e,t):(n.baseState=e,[e,n.queue.dispatch])},useMemoCache:vm,useCacheRefresh:Wv};Kv.useEffectEvent=Lv;function Od(e,t,n,i){t=e.memoizedState,n=n(i,t),n=n==null?t:Re({},t,n),e.memoizedState=n,e.lanes===0&&(e.updateQueue.baseState=n)}var Ap={enqueueSetState:function(e,t,n){e=e._reactInternals;var i=ti(),s=ta(i);s.payload=t,n!=null&&(s.callback=n),t=ea(e,s,i),t!==null&&(kn(t,e,i),sl(t,e,i))},enqueueReplaceState:function(e,t,n){e=e._reactInternals;var i=ti(),s=ta(i);s.tag=1,s.payload=t,n!=null&&(s.callback=n),t=ea(e,s,i),t!==null&&(kn(t,e,i),sl(t,e,i))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var n=ti(),i=ta(n);i.tag=2,t!=null&&(i.callback=t),t=ea(e,i,n),t!==null&&(kn(t,e,n),sl(t,e,n))}};function Ly(e,t,n,i,s,a,r){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(i,a,r):t.prototype&&t.prototype.isPureReactComponent?!gl(n,i)||!gl(s,a):!0}function Uy(e,t,n,i){e=t.state,typeof t.componentWillReceiveProps=="function"&&t.componentWillReceiveProps(n,i),typeof t.UNSAFE_componentWillReceiveProps=="function"&&t.UNSAFE_componentWillReceiveProps(n,i),t.state!==e&&Ap.enqueueReplaceState(t,t.state,null)}function Za(e,t){var n=t;if("ref"in t){n={};for(var i in t)i!=="ref"&&(n[i]=t[i])}if(e=e.defaultProps){n===t&&(n=Re({},n));for(var s in e)n[s]===void 0&&(n[s]=e[s])}return n}function Jv(e){pu(e)}function Qv(e){console.error(e)}function jv(e){pu(e)}function Mu(e,t){try{var n=e.onUncaughtError;n(t.value,{componentStack:t.stack})}catch(i){setTimeout(function(){throw i})}}function Oy(e,t,n){try{var i=e.onCaughtError;i(n.value,{componentStack:n.stack,errorBoundary:t.tag===1?t.stateNode:null})}catch(s){setTimeout(function(){throw s})}}function wp(e,t,n){return n=ta(n),n.tag=3,n.payload={element:null},n.callback=function(){Mu(e,t)},n}function $v(e){return e=ta(e),e.tag=3,e}function t_(e,t,n,i){var s=n.type.getDerivedStateFromError;if(typeof s=="function"){var a=i.value;e.payload=function(){return s(a)},e.callback=function(){Oy(t,n,i)}}var r=n.stateNode;r!==null&&typeof r.componentDidCatch=="function"&&(e.callback=function(){Oy(t,n,i),typeof s!="function"&&(na===null?na=new Set([this]):na.add(this));var o=i.stack;this.componentDidCatch(i.value,{componentStack:o!==null?o:""})})}function mT(e,t,n,i,s){if(n.flags|=32768,i!==null&&typeof i=="object"&&typeof i.then=="function"){if(t=n.alternate,t!==null&&io(t,n,s,!0),n=ni.current,n!==null){switch(n.tag){case 31:case 13:return yi===null?Cu():n.alternate===null&&ke===0&&(ke=3),n.flags&=-257,n.flags|=65536,n.lanes=s,i===xu?n.flags|=16384:(t=n.updateQueue,t===null?n.updateQueue=new Set([i]):t.add(i),Xd(e,i,s)),!1;case 22:return n.flags|=65536,i===xu?n.flags|=16384:(t=n.updateQueue,t===null?(t={transitions:null,markerInstances:null,retryQueue:new Set([i])},n.updateQueue=t):(n=t.retryQueue,n===null?t.retryQueue=new Set([i]):n.add(i)),Xd(e,i,s)),!1}throw Error($(435,n.tag))}return Xd(e,i,s),Cu(),!1}if(jt)return t=ni.current,t!==null?((t.flags&65536)===0&&(t.flags|=256),t.flags|=65536,t.lanes=s,i!==pp&&(e=Error($(422),{cause:i}),xl(mi(e,n)))):(i!==pp&&(t=Error($(423),{cause:i}),xl(mi(t,n))),e=e.current.alternate,e.flags|=65536,s&=-s,e.lanes|=s,i=mi(i,n),s=wp(e.stateNode,i,s),Ld(e,s),ke!==4&&(ke=2)),!1;var a=Error($(520),{cause:i});if(a=mi(a,n),ul===null?ul=[a]:ul.push(a),ke!==4&&(ke=2),t===null)return!0;i=mi(i,n),n=t;do{switch(n.tag){case 3:return n.flags|=65536,e=s&-s,n.lanes|=e,e=wp(n.stateNode,i,e),Ld(n,e),!1;case 1:if(t=n.type,a=n.stateNode,(n.flags&128)===0&&(typeof t.getDerivedStateFromError=="function"||a!==null&&typeof a.componentDidCatch=="function"&&(na===null||!na.has(a))))return n.flags|=65536,s&=-s,n.lanes|=s,s=$v(s),t_(s,e,n,i),Ld(n,s),!1}n=n.return}while(n!==null);return!1}var wm=Error($(461)),$e=!1;function pn(e,t,n,i){t.child=e===null?pv(t,null,n,i):qa(t,e.child,n,i)}function Iy(e,t,n,i,s){n=n.render;var a=t.ref;if("ref"in i){var r={};for(var o in i)o!=="ref"&&(r[o]=i[o])}else r=i;return Xa(t),i=mm(e,t,n,r,a,s),o=gm(),e!==null&&!$e?(ym(e,t,s),Es(e,t,s)):(jt&&o&&om(t),t.flags|=1,pn(e,t,i,s),t.child)}function Py(e,t,n,i,s){if(e===null){var a=n.type;return typeof a=="function"&&!rm(a)&&a.defaultProps===void 0&&n.compare===null?(t.tag=15,t.type=a,e_(e,t,a,i,s)):(e=jc(n.type,null,i,t,t.mode,s),e.ref=t.ref,e.return=t,t.child=e)}if(a=e.child,!Cm(e,s)){var r=a.memoizedProps;if(n=n.compare,n=n!==null?n:gl,n(r,i)&&e.ref===t.ref)return Es(e,t,s)}return t.flags|=1,e=vs(a,i),e.ref=t.ref,e.return=t,t.child=e}function e_(e,t,n,i,s){if(e!==null){var a=e.memoizedProps;if(gl(a,i)&&e.ref===t.ref)if($e=!1,t.pendingProps=i=a,Cm(e,s))(e.flags&131072)!==0&&($e=!0);else return t.lanes=e.lanes,Es(e,t,s)}return Cp(e,t,n,i,s)}function n_(e,t,n,i){var s=i.children,a=e!==null?e.memoizedState:null;if(e===null&&t.stateNode===null&&(t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),i.mode==="hidden"){if((t.flags&128)!==0){if(a=a!==null?a.baseLanes|n:n,e!==null){for(i=t.child=e.child,s=0;i!==null;)s=s|i.lanes|i.childLanes,i=i.sibling;i=s&~a}else i=0,t.child=null;return By(e,t,a,n,i)}if((n&536870912)!==0)t.memoizedState={baseLanes:0,cachePool:null},e!==null&&$c(t,a!==null?a.cachePool:null),a!==null?Ey(t,a):bp(),yv(t);else return i=t.lanes=536870912,By(e,t,a!==null?a.baseLanes|n:n,n,i)}else a!==null?($c(t,a.cachePool),Ey(t,a),Xs(t),t.memoizedState=null):(e!==null&&$c(t,null),bp(),Xs(t));return pn(e,t,s,n),t.child}function jo(e,t){return e!==null&&e.tag===22||t.stateNode!==null||(t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),t.sibling}function By(e,t,n,i,s){var a=um();return a=a===null?null:{parent:je._currentValue,pool:a},t.memoizedState={baseLanes:n,cachePool:a},e!==null&&$c(t,null),bp(),yv(t),e!==null&&io(e,t,i,!0),t.childLanes=s,null}function nu(e,t){return t=Tu({mode:t.mode,children:t.children},e.mode),t.ref=e.ref,e.child=t,t.return=e,t}function zy(e,t,n){return qa(t,e.child,null,n),e=nu(t,t.pendingProps),e.flags|=2,Zn(t),t.memoizedState=null,e}function gT(e,t,n){var i=t.pendingProps,s=(t.flags&128)!==0;if(t.flags&=-129,e===null){if(jt){if(i.mode==="hidden")return e=nu(t,i),t.lanes=536870912,jo(null,e);if(Sp(t),(e=Ce)?(e=Z_(e,gi),e=e!==null&&e.data==="&"?e:null,e!==null&&(t.memoizedState={dehydrated:e,treeContext:oa!==null?{id:qi,overflow:Yi}:null,retryLane:536870912,hydrationErrors:null},n=ov(e),n.return=t,t.child=n,gn=t,Ce=null)):e=null,e===null)throw la(t);return t.lanes=536870912,null}return nu(t,i)}var a=e.memoizedState;if(a!==null){var r=a.dehydrated;if(Sp(t),s)if(t.flags&256)t.flags&=-257,t=zy(e,t,n);else if(t.memoizedState!==null)t.child=e.child,t.flags|=128,t=null;else throw Error($(558));else if($e||io(e,t,n,!1),s=(n&e.childLanes)!==0,$e||s){if(i=_e,i!==null&&(r=Ux(i,n),r!==0&&r!==a.retryLane))throw a.retryLane=r,ja(e,r),kn(i,e,r),wm;Cu(),t=zy(e,t,n)}else e=a.treeContext,Ce=xi(r.nextSibling),gn=t,jt=!0,$s=null,gi=!1,e!==null&&cv(t,e),t=nu(t,i),t.flags|=4096;return t}return e=vs(e.child,{mode:i.mode,children:i.children}),e.ref=t.ref,t.child=e,e.return=t,e}function iu(e,t){var n=t.ref;if(n===null)e!==null&&e.ref!==null&&(t.flags|=4194816);else{if(typeof n!="function"&&typeof n!="object")throw Error($(284));(e===null||e.ref!==n)&&(t.flags|=4194816)}}function Cp(e,t,n,i,s){return Xa(t),n=mm(e,t,n,i,void 0,s),i=gm(),e!==null&&!$e?(ym(e,t,s),Es(e,t,s)):(jt&&i&&om(t),t.flags|=1,pn(e,t,n,s),t.child)}function Fy(e,t,n,i,s,a){return Xa(t),t.updateQueue=null,n=vv(t,i,n,s),xv(e),i=gm(),e!==null&&!$e?(ym(e,t,a),Es(e,t,a)):(jt&&i&&om(t),t.flags|=1,pn(e,t,n,a),t.child)}function ky(e,t,n,i,s){if(Xa(t),t.stateNode===null){var a=Ur,r=n.contextType;typeof r=="object"&&r!==null&&(a=yn(r)),a=new n(i,a),t.memoizedState=a.state!==null&&a.state!==void 0?a.state:null,a.updater=Ap,t.stateNode=a,a._reactInternals=t,a=t.stateNode,a.props=i,a.state=t.memoizedState,a.refs={},fm(t),r=n.contextType,a.context=typeof r=="object"&&r!==null?yn(r):Ur,a.state=t.memoizedState,r=n.getDerivedStateFromProps,typeof r=="function"&&(Od(t,n,r,i),a.state=t.memoizedState),typeof n.getDerivedStateFromProps=="function"||typeof a.getSnapshotBeforeUpdate=="function"||typeof a.UNSAFE_componentWillMount!="function"&&typeof a.componentWillMount!="function"||(r=a.state,typeof a.componentWillMount=="function"&&a.componentWillMount(),typeof a.UNSAFE_componentWillMount=="function"&&a.UNSAFE_componentWillMount(),r!==a.state&&Ap.enqueueReplaceState(a,a.state,null),rl(t,i,a,s),al(),a.state=t.memoizedState),typeof a.componentDidMount=="function"&&(t.flags|=4194308),i=!0}else if(e===null){a=t.stateNode;var o=t.memoizedProps,l=Za(n,o);a.props=l;var c=a.context,u=n.contextType;r=Ur,typeof u=="object"&&u!==null&&(r=yn(u));var f=n.getDerivedStateFromProps;u=typeof f=="function"||typeof a.getSnapshotBeforeUpdate=="function",o=t.pendingProps!==o,u||typeof a.UNSAFE_componentWillReceiveProps!="function"&&typeof a.componentWillReceiveProps!="function"||(o||c!==r)&&Uy(t,a,i,r),Vs=!1;var h=t.memoizedState;a.state=h,rl(t,i,a,s),al(),c=t.memoizedState,o||h!==c||Vs?(typeof f=="function"&&(Od(t,n,f,i),c=t.memoizedState),(l=Vs||Ly(t,n,l,i,h,c,r))?(u||typeof a.UNSAFE_componentWillMount!="function"&&typeof a.componentWillMount!="function"||(typeof a.componentWillMount=="function"&&a.componentWillMount(),typeof a.UNSAFE_componentWillMount=="function"&&a.UNSAFE_componentWillMount()),typeof a.componentDidMount=="function"&&(t.flags|=4194308)):(typeof a.componentDidMount=="function"&&(t.flags|=4194308),t.memoizedProps=i,t.memoizedState=c),a.props=i,a.state=c,a.context=r,i=l):(typeof a.componentDidMount=="function"&&(t.flags|=4194308),i=!1)}else{a=t.stateNode,vp(e,t),r=t.memoizedProps,u=Za(n,r),a.props=u,f=t.pendingProps,h=a.context,c=n.contextType,l=Ur,typeof c=="object"&&c!==null&&(l=yn(c)),o=n.getDerivedStateFromProps,(c=typeof o=="function"||typeof a.getSnapshotBeforeUpdate=="function")||typeof a.UNSAFE_componentWillReceiveProps!="function"&&typeof a.componentWillReceiveProps!="function"||(r!==f||h!==l)&&Uy(t,a,i,l),Vs=!1,h=t.memoizedState,a.state=h,rl(t,i,a,s),al();var d=t.memoizedState;r!==f||h!==d||Vs||e!==null&&e.dependencies!==null&&yu(e.dependencies)?(typeof o=="function"&&(Od(t,n,o,i),d=t.memoizedState),(u=Vs||Ly(t,n,u,i,h,d,l)||e!==null&&e.dependencies!==null&&yu(e.dependencies))?(c||typeof a.UNSAFE_componentWillUpdate!="function"&&typeof a.componentWillUpdate!="function"||(typeof a.componentWillUpdate=="function"&&a.componentWillUpdate(i,d,l),typeof a.UNSAFE_componentWillUpdate=="function"&&a.UNSAFE_componentWillUpdate(i,d,l)),typeof a.componentDidUpdate=="function"&&(t.flags|=4),typeof a.getSnapshotBeforeUpdate=="function"&&(t.flags|=1024)):(typeof a.componentDidUpdate!="function"||r===e.memoizedProps&&h===e.memoizedState||(t.flags|=4),typeof a.getSnapshotBeforeUpdate!="function"||r===e.memoizedProps&&h===e.memoizedState||(t.flags|=1024),t.memoizedProps=i,t.memoizedState=d),a.props=i,a.state=d,a.context=l,i=u):(typeof a.componentDidUpdate!="function"||r===e.memoizedProps&&h===e.memoizedState||(t.flags|=4),typeof a.getSnapshotBeforeUpdate!="function"||r===e.memoizedProps&&h===e.memoizedState||(t.flags|=1024),i=!1)}return a=i,iu(e,t),i=(t.flags&128)!==0,a||i?(a=t.stateNode,n=i&&typeof n.getDerivedStateFromError!="function"?null:a.render(),t.flags|=1,e!==null&&i?(t.child=qa(t,e.child,null,s),t.child=qa(t,null,n,s)):pn(e,t,n,s),t.memoizedState=a.state,e=t.child):e=Es(e,t,s),e}function Hy(e,t,n,i){return Wa(),t.flags|=256,pn(e,t,n,i),t.child}var Id={dehydrated:null,treeContext:null,retryLane:0,hydrationErrors:null};function Pd(e){return{baseLanes:e,cachePool:hv()}}function Bd(e,t,n){return e=e!==null?e.childLanes&~n:0,t&&(e|=Jn),e}function i_(e,t,n){var i=t.pendingProps,s=!1,a=(t.flags&128)!==0,r;if((r=a)||(r=e!==null&&e.memoizedState===null?!1:(Ge.current&2)!==0),r&&(s=!0,t.flags&=-129),r=(t.flags&32)!==0,t.flags&=-33,e===null){if(jt){if(s?Ws(t):Xs(t),(e=Ce)?(e=Z_(e,gi),e=e!==null&&e.data!=="&"?e:null,e!==null&&(t.memoizedState={dehydrated:e,treeContext:oa!==null?{id:qi,overflow:Yi}:null,retryLane:536870912,hydrationErrors:null},n=ov(e),n.return=t,t.child=n,gn=t,Ce=null)):e=null,e===null)throw la(t);return Vp(e)?t.lanes=32:t.lanes=536870912,null}var o=i.children;return i=i.fallback,s?(Xs(t),s=t.mode,o=Tu({mode:"hidden",children:o},s),i=ka(i,s,n,null),o.return=t,i.return=t,o.sibling=i,t.child=o,i=t.child,i.memoizedState=Pd(n),i.childLanes=Bd(e,r,n),t.memoizedState=Id,jo(null,i)):(Ws(t),Rp(t,o))}var l=e.memoizedState;if(l!==null&&(o=l.dehydrated,o!==null)){if(a)t.flags&256?(Ws(t),t.flags&=-257,t=zd(e,t,n)):t.memoizedState!==null?(Xs(t),t.child=e.child,t.flags|=128,t=null):(Xs(t),o=i.fallback,s=t.mode,i=Tu({mode:"visible",children:i.children},s),o=ka(o,s,n,null),o.flags|=2,i.return=t,o.return=t,i.sibling=o,t.child=i,qa(t,e.child,null,n),i=t.child,i.memoizedState=Pd(n),i.childLanes=Bd(e,r,n),t.memoizedState=Id,t=jo(null,i));else if(Ws(t),Vp(o)){if(r=o.nextSibling&&o.nextSibling.dataset,r)var c=r.dgst;r=c,i=Error($(419)),i.stack="",i.digest=r,xl({value:i,source:null,stack:null}),t=zd(e,t,n)}else if($e||io(e,t,n,!1),r=(n&e.childLanes)!==0,$e||r){if(r=_e,r!==null&&(i=Ux(r,n),i!==0&&i!==l.retryLane))throw l.retryLane=i,ja(e,i),kn(r,e,i),wm;Hp(o)||Cu(),t=zd(e,t,n)}else Hp(o)?(t.flags|=192,t.child=e.child,t=null):(e=l.treeContext,Ce=xi(o.nextSibling),gn=t,jt=!0,$s=null,gi=!1,e!==null&&cv(t,e),t=Rp(t,i.children),t.flags|=4096);return t}return s?(Xs(t),o=i.fallback,s=t.mode,l=e.child,c=l.sibling,i=vs(l,{mode:"hidden",children:i.children}),i.subtreeFlags=l.subtreeFlags&65011712,c!==null?o=vs(c,o):(o=ka(o,s,n,null),o.flags|=2),o.return=t,i.return=t,i.sibling=o,t.child=i,jo(null,i),i=t.child,o=e.child.memoizedState,o===null?o=Pd(n):(s=o.cachePool,s!==null?(l=je._currentValue,s=s.parent!==l?{parent:l,pool:l}:s):s=hv(),o={baseLanes:o.baseLanes|n,cachePool:s}),i.memoizedState=o,i.childLanes=Bd(e,r,n),t.memoizedState=Id,jo(e.child,i)):(Ws(t),n=e.child,e=n.sibling,n=vs(n,{mode:"visible",children:i.children}),n.return=t,n.sibling=null,e!==null&&(r=t.deletions,r===null?(t.deletions=[e],t.flags|=16):r.push(e)),t.child=n,t.memoizedState=null,n)}function Rp(e,t){return t=Tu({mode:"visible",children:t},e.mode),t.return=e,e.child=t}function Tu(e,t){return e=Kn(22,e,null,t),e.lanes=0,e}function zd(e,t,n){return qa(t,e.child,null,n),e=Rp(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function Vy(e,t,n){e.lanes|=t;var i=e.alternate;i!==null&&(i.lanes|=t),gp(e.return,t,n)}function Fd(e,t,n,i,s,a){var r=e.memoizedState;r===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:i,tail:n,tailMode:s,treeForkCount:a}:(r.isBackwards=t,r.rendering=null,r.renderingStartTime=0,r.last=i,r.tail=n,r.tailMode=s,r.treeForkCount=a)}function s_(e,t,n){var i=t.pendingProps,s=i.revealOrder,a=i.tail;i=i.children;var r=Ge.current,o=(r&2)!==0;if(o?(r=r&1|2,t.flags|=128):r&=1,Te(Ge,r),pn(e,t,i,n),i=jt?yl:0,!o&&e!==null&&(e.flags&128)!==0)t:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&Vy(e,n,t);else if(e.tag===19)Vy(e,n,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break t;for(;e.sibling===null;){if(e.return===null||e.return===t)break t;e=e.return}e.sibling.return=e.return,e=e.sibling}switch(s){case"forwards":for(n=t.child,s=null;n!==null;)e=n.alternate,e!==null&&_u(e)===null&&(s=n),n=n.sibling;n=s,n===null?(s=t.child,t.child=null):(s=n.sibling,n.sibling=null),Fd(t,!1,s,n,a,i);break;case"backwards":case"unstable_legacy-backwards":for(n=null,s=t.child,t.child=null;s!==null;){if(e=s.alternate,e!==null&&_u(e)===null){t.child=s;break}e=s.sibling,s.sibling=n,n=s,s=e}Fd(t,!0,n,null,a,i);break;case"together":Fd(t,!1,null,null,void 0,i);break;default:t.memoizedState=null}return t.child}function Es(e,t,n){if(e!==null&&(t.dependencies=e.dependencies),ua|=t.lanes,(n&t.childLanes)===0)if(e!==null){if(io(e,t,n,!1),(n&t.childLanes)===0)return null}else return null;if(e!==null&&t.child!==e.child)throw Error($(153));if(t.child!==null){for(e=t.child,n=vs(e,e.pendingProps),t.child=n,n.return=t;e.sibling!==null;)e=e.sibling,n=n.sibling=vs(e,e.pendingProps),n.return=t;n.sibling=null}return t.child}function Cm(e,t){return(e.lanes&t)!==0?!0:(e=e.dependencies,!!(e!==null&&yu(e)))}function yT(e,t,n){switch(t.tag){case 3:uu(t,t.stateNode.containerInfo),Gs(t,je,e.memoizedState.cache),Wa();break;case 27:case 5:ip(t);break;case 4:uu(t,t.stateNode.containerInfo);break;case 10:Gs(t,t.type,t.memoizedProps.value);break;case 31:if(t.memoizedState!==null)return t.flags|=128,Sp(t),null;break;case 13:var i=t.memoizedState;if(i!==null)return i.dehydrated!==null?(Ws(t),t.flags|=128,null):(n&t.child.childLanes)!==0?i_(e,t,n):(Ws(t),e=Es(e,t,n),e!==null?e.sibling:null);Ws(t);break;case 19:var s=(e.flags&128)!==0;if(i=(n&t.childLanes)!==0,i||(io(e,t,n,!1),i=(n&t.childLanes)!==0),s){if(i)return s_(e,t,n);t.flags|=128}if(s=t.memoizedState,s!==null&&(s.rendering=null,s.tail=null,s.lastEffect=null),Te(Ge,Ge.current),i)break;return null;case 22:return t.lanes=0,n_(e,t,n,t.pendingProps);case 24:Gs(t,je,e.memoizedState.cache)}return Es(e,t,n)}function a_(e,t,n){if(e!==null)if(e.memoizedProps!==t.pendingProps)$e=!0;else{if(!Cm(e,n)&&(t.flags&128)===0)return $e=!1,yT(e,t,n);$e=(e.flags&131072)!==0}else $e=!1,jt&&(t.flags&1048576)!==0&&lv(t,yl,t.index);switch(t.lanes=0,t.tag){case 16:t:{var i=t.pendingProps;if(e=Ba(t.elementType),t.type=e,typeof e=="function")rm(e)?(i=Za(e,i),t.tag=1,t=ky(null,t,e,i,n)):(t.tag=0,t=Cp(null,t,e,i,n));else{if(e!=null){var s=e.$$typeof;if(s===qp){t.tag=11,t=Iy(null,t,e,i,n);break t}else if(s===Yp){t.tag=14,t=Py(null,t,e,i,n);break t}}throw t=ep(e)||e,Error($(306,t,""))}}return t;case 0:return Cp(e,t,t.type,t.pendingProps,n);case 1:return i=t.type,s=Za(i,t.pendingProps),ky(e,t,i,s,n);case 3:t:{if(uu(t,t.stateNode.containerInfo),e===null)throw Error($(387));i=t.pendingProps;var a=t.memoizedState;s=a.element,vp(e,t),rl(t,i,null,n);var r=t.memoizedState;if(i=r.cache,Gs(t,je,i),i!==a.cache&&yp(t,[je],n,!0),al(),i=r.element,a.isDehydrated)if(a={element:i,isDehydrated:!1,cache:r.cache},t.updateQueue.baseState=a,t.memoizedState=a,t.flags&256){t=Hy(e,t,i,n);break t}else if(i!==s){s=mi(Error($(424)),t),xl(s),t=Hy(e,t,i,n);break t}else for(e=t.stateNode.containerInfo,e.nodeType===9?e=e.body:e=e.nodeName==="HTML"?e.ownerDocument.body:e,Ce=xi(e.firstChild),gn=t,jt=!0,$s=null,gi=!0,n=pv(t,null,i,n),t.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if(Wa(),i===s){t=Es(e,t,n);break t}pn(e,t,i,n)}t=t.child}return t;case 26:return iu(e,t),e===null?(n=ux(t.type,null,t.pendingProps,null))?t.memoizedState=n:jt||(n=t.type,e=t.pendingProps,i=Lu(js.current).createElement(n),i[mn]=t,i[Hn]=e,xn(i,n,e),un(i),t.stateNode=i):t.memoizedState=ux(t.type,e.memoizedProps,t.pendingProps,e.memoizedState),null;case 27:return ip(t),e===null&&jt&&(i=t.stateNode=K_(t.type,t.pendingProps,js.current),gn=t,gi=!0,s=Ce,fa(t.type)?(Gp=s,Ce=xi(i.firstChild)):Ce=s),pn(e,t,t.pendingProps.children,n),iu(e,t),e===null&&(t.flags|=4194304),t.child;case 5:return e===null&&jt&&((s=i=Ce)&&(i=XT(i,t.type,t.pendingProps,gi),i!==null?(t.stateNode=i,gn=t,Ce=xi(i.firstChild),gi=!1,s=!0):s=!1),s||la(t)),ip(t),s=t.type,a=t.pendingProps,r=e!==null?e.memoizedProps:null,i=a.children,Fp(s,a)?i=null:r!==null&&Fp(s,r)&&(t.flags|=32),t.memoizedState!==null&&(s=mm(e,t,lT,null,null,n),Tl._currentValue=s),iu(e,t),pn(e,t,i,n),t.child;case 6:return e===null&&jt&&((e=n=Ce)&&(n=qT(n,t.pendingProps,gi),n!==null?(t.stateNode=n,gn=t,Ce=null,e=!0):e=!1),e||la(t)),null;case 13:return i_(e,t,n);case 4:return uu(t,t.stateNode.containerInfo),i=t.pendingProps,e===null?t.child=qa(t,null,i,n):pn(e,t,i,n),t.child;case 11:return Iy(e,t,t.type,t.pendingProps,n);case 7:return pn(e,t,t.pendingProps,n),t.child;case 8:return pn(e,t,t.pendingProps.children,n),t.child;case 12:return pn(e,t,t.pendingProps.children,n),t.child;case 10:return i=t.pendingProps,Gs(t,t.type,i.value),pn(e,t,i.children,n),t.child;case 9:return s=t.type._context,i=t.pendingProps.children,Xa(t),s=yn(s),i=i(s),t.flags|=1,pn(e,t,i,n),t.child;case 14:return Py(e,t,t.type,t.pendingProps,n);case 15:return e_(e,t,t.type,t.pendingProps,n);case 19:return s_(e,t,n);case 31:return gT(e,t,n);case 22:return n_(e,t,n,t.pendingProps);case 24:return Xa(t),i=yn(je),e===null?(s=um(),s===null&&(s=_e,a=cm(),s.pooledCache=a,a.refCount++,a!==null&&(s.pooledCacheLanes|=n),s=a),t.memoizedState={parent:i,cache:s},fm(t),Gs(t,je,s)):((e.lanes&n)!==0&&(vp(e,t),rl(t,null,null,n),al()),s=e.memoizedState,a=t.memoizedState,s.parent!==i?(s={parent:i,cache:i},t.memoizedState=s,t.lanes===0&&(t.memoizedState=t.updateQueue.baseState=s),Gs(t,je,i)):(i=a.cache,Gs(t,je,i),i!==s.cache&&yp(t,[je],n,!0))),pn(e,t,t.pendingProps.children,n),t.child;case 29:throw t.pendingProps}throw Error($(156,t.tag))}function us(e){e.flags|=4}function kd(e,t,n,i,s){if((t=(e.mode&32)!==0)&&(t=!1),t){if(e.flags|=16777216,(s&335544128)===s)if(e.stateNode.complete)e.flags|=8192;else if(R_())e.flags|=8192;else throw Va=xu,hm}else e.flags&=-16777217}function Gy(e,t){if(t.type!=="stylesheet"||(t.state.loading&4)!==0)e.flags&=-16777217;else if(e.flags|=16777216,!j_(t))if(R_())e.flags|=8192;else throw Va=xu,hm}function Hc(e,t){t!==null&&(e.flags|=4),e.flags&16384&&(t=e.tag!==22?Nx():536870912,e.lanes|=t,Jr|=t)}function Xo(e,t){if(!jt)switch(e.tailMode){case"hidden":t=e.tail;for(var n=null;t!==null;)t.alternate!==null&&(n=t),t=t.sibling;n===null?e.tail=null:n.sibling=null;break;case"collapsed":n=e.tail;for(var i=null;n!==null;)n.alternate!==null&&(i=n),n=n.sibling;i===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:i.sibling=null}}function we(e){var t=e.alternate!==null&&e.alternate.child===e.child,n=0,i=0;if(t)for(var s=e.child;s!==null;)n|=s.lanes|s.childLanes,i|=s.subtreeFlags&65011712,i|=s.flags&65011712,s.return=e,s=s.sibling;else for(s=e.child;s!==null;)n|=s.lanes|s.childLanes,i|=s.subtreeFlags,i|=s.flags,s.return=e,s=s.sibling;return e.subtreeFlags|=i,e.childLanes=n,t}function xT(e,t,n){var i=t.pendingProps;switch(lm(t),t.tag){case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return we(t),null;case 1:return we(t),null;case 3:return n=t.stateNode,i=null,e!==null&&(i=e.memoizedState.cache),t.memoizedState.cache!==i&&(t.flags|=2048),_s(je),Wr(),n.pendingContext&&(n.context=n.pendingContext,n.pendingContext=null),(e===null||e.child===null)&&(br(t)?us(t):e===null||e.memoizedState.isDehydrated&&(t.flags&256)===0||(t.flags|=1024,Dd())),we(t),null;case 26:var s=t.type,a=t.memoizedState;return e===null?(us(t),a!==null?(we(t),Gy(t,a)):(we(t),kd(t,s,null,i,n))):a?a!==e.memoizedState?(us(t),we(t),Gy(t,a)):(we(t),t.flags&=-16777217):(e=e.memoizedProps,e!==i&&us(t),we(t),kd(t,s,e,i,n)),null;case 27:if(hu(t),n=js.current,s=t.type,e!==null&&t.stateNode!=null)e.memoizedProps!==i&&us(t);else{if(!i){if(t.stateNode===null)throw Error($(166));return we(t),null}e=Ki.current,br(t)?xy(t,e):(e=K_(s,i,n),t.stateNode=e,us(t))}return we(t),null;case 5:if(hu(t),s=t.type,e!==null&&t.stateNode!=null)e.memoizedProps!==i&&us(t);else{if(!i){if(t.stateNode===null)throw Error($(166));return we(t),null}if(a=Ki.current,br(t))xy(t,a);else{var r=Lu(js.current);switch(a){case 1:a=r.createElementNS("http://www.w3.org/2000/svg",s);break;case 2:a=r.createElementNS("http://www.w3.org/1998/Math/MathML",s);break;default:switch(s){case"svg":a=r.createElementNS("http://www.w3.org/2000/svg",s);break;case"math":a=r.createElementNS("http://www.w3.org/1998/Math/MathML",s);break;case"script":a=r.createElement("div"),a.innerHTML="<script><\/script>",a=a.removeChild(a.firstChild);break;case"select":a=typeof i.is=="string"?r.createElement("select",{is:i.is}):r.createElement("select"),i.multiple?a.multiple=!0:i.size&&(a.size=i.size);break;default:a=typeof i.is=="string"?r.createElement(s,{is:i.is}):r.createElement(s)}}a[mn]=t,a[Hn]=i;t:for(r=t.child;r!==null;){if(r.tag===5||r.tag===6)a.appendChild(r.stateNode);else if(r.tag!==4&&r.tag!==27&&r.child!==null){r.child.return=r,r=r.child;continue}if(r===t)break t;for(;r.sibling===null;){if(r.return===null||r.return===t)break t;r=r.return}r.sibling.return=r.return,r=r.sibling}t.stateNode=a;t:switch(xn(a,s,i),s){case"button":case"input":case"select":case"textarea":i=!!i.autoFocus;break t;case"img":i=!0;break t;default:i=!1}i&&us(t)}}return we(t),kd(t,t.type,e===null?null:e.memoizedProps,t.pendingProps,n),null;case 6:if(e&&t.stateNode!=null)e.memoizedProps!==i&&us(t);else{if(typeof i!="string"&&t.stateNode===null)throw Error($(166));if(e=js.current,br(t)){if(e=t.stateNode,n=t.memoizedProps,i=null,s=gn,s!==null)switch(s.tag){case 27:case 5:i=s.memoizedProps}e[mn]=t,e=!!(e.nodeValue===n||i!==null&&i.suppressHydrationWarning===!0||X_(e.nodeValue,n)),e||la(t,!0)}else e=Lu(e).createTextNode(i),e[mn]=t,t.stateNode=e}return we(t),null;case 31:if(n=t.memoizedState,e===null||e.memoizedState!==null){if(i=br(t),n!==null){if(e===null){if(!i)throw Error($(318));if(e=t.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error($(557));e[mn]=t}else Wa(),(t.flags&128)===0&&(t.memoizedState=null),t.flags|=4;we(t),e=!1}else n=Dd(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=n),e=!0;if(!e)return t.flags&256?(Zn(t),t):(Zn(t),null);if((t.flags&128)!==0)throw Error($(558))}return we(t),null;case 13:if(i=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(s=br(t),i!==null&&i.dehydrated!==null){if(e===null){if(!s)throw Error($(318));if(s=t.memoizedState,s=s!==null?s.dehydrated:null,!s)throw Error($(317));s[mn]=t}else Wa(),(t.flags&128)===0&&(t.memoizedState=null),t.flags|=4;we(t),s=!1}else s=Dd(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=s),s=!0;if(!s)return t.flags&256?(Zn(t),t):(Zn(t),null)}return Zn(t),(t.flags&128)!==0?(t.lanes=n,t):(n=i!==null,e=e!==null&&e.memoizedState!==null,n&&(i=t.child,s=null,i.alternate!==null&&i.alternate.memoizedState!==null&&i.alternate.memoizedState.cachePool!==null&&(s=i.alternate.memoizedState.cachePool.pool),a=null,i.memoizedState!==null&&i.memoizedState.cachePool!==null&&(a=i.memoizedState.cachePool.pool),a!==s&&(i.flags|=2048)),n!==e&&n&&(t.child.flags|=8192),Hc(t,t.updateQueue),we(t),null);case 4:return Wr(),e===null&&Im(t.stateNode.containerInfo),we(t),null;case 10:return _s(t.type),we(t),null;case 19:if(hn(Ge),i=t.memoizedState,i===null)return we(t),null;if(s=(t.flags&128)!==0,a=i.rendering,a===null)if(s)Xo(i,!1);else{if(ke!==0||e!==null&&(e.flags&128)!==0)for(e=t.child;e!==null;){if(a=_u(e),a!==null){for(t.flags|=128,Xo(i,!1),e=a.updateQueue,t.updateQueue=e,Hc(t,e),t.subtreeFlags=0,e=n,n=t.child;n!==null;)rv(n,e),n=n.sibling;return Te(Ge,Ge.current&1|2),jt&&ps(t,i.treeForkCount),t.child}e=e.sibling}i.tail!==null&&Qn()>Au&&(t.flags|=128,s=!0,Xo(i,!1),t.lanes=4194304)}else{if(!s)if(e=_u(a),e!==null){if(t.flags|=128,s=!0,e=e.updateQueue,t.updateQueue=e,Hc(t,e),Xo(i,!0),i.tail===null&&i.tailMode==="hidden"&&!a.alternate&&!jt)return we(t),null}else 2*Qn()-i.renderingStartTime>Au&&n!==536870912&&(t.flags|=128,s=!0,Xo(i,!1),t.lanes=4194304);i.isBackwards?(a.sibling=t.child,t.child=a):(e=i.last,e!==null?e.sibling=a:t.child=a,i.last=a)}return i.tail!==null?(e=i.tail,i.rendering=e,i.tail=e.sibling,i.renderingStartTime=Qn(),e.sibling=null,n=Ge.current,Te(Ge,s?n&1|2:n&1),jt&&ps(t,i.treeForkCount),e):(we(t),null);case 22:case 23:return Zn(t),dm(),i=t.memoizedState!==null,e!==null?e.memoizedState!==null!==i&&(t.flags|=8192):i&&(t.flags|=8192),i?(n&536870912)!==0&&(t.flags&128)===0&&(we(t),t.subtreeFlags&6&&(t.flags|=8192)):we(t),n=t.updateQueue,n!==null&&Hc(t,n.retryQueue),n=null,e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(n=e.memoizedState.cachePool.pool),i=null,t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(i=t.memoizedState.cachePool.pool),i!==n&&(t.flags|=2048),e!==null&&hn(Ha),null;case 24:return n=null,e!==null&&(n=e.memoizedState.cache),t.memoizedState.cache!==n&&(t.flags|=2048),_s(je),we(t),null;case 25:return null;case 30:return null}throw Error($(156,t.tag))}function vT(e,t){switch(lm(t),t.tag){case 1:return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return _s(je),Wr(),e=t.flags,(e&65536)!==0&&(e&128)===0?(t.flags=e&-65537|128,t):null;case 26:case 27:case 5:return hu(t),null;case 31:if(t.memoizedState!==null){if(Zn(t),t.alternate===null)throw Error($(340));Wa()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 13:if(Zn(t),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error($(340));Wa()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return hn(Ge),null;case 4:return Wr(),null;case 10:return _s(t.type),null;case 22:case 23:return Zn(t),dm(),e!==null&&hn(Ha),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 24:return _s(je),null;case 25:return null;default:return null}}function r_(e,t){switch(lm(t),t.tag){case 3:_s(je),Wr();break;case 26:case 27:case 5:hu(t);break;case 4:Wr();break;case 31:t.memoizedState!==null&&Zn(t);break;case 13:Zn(t);break;case 19:hn(Ge);break;case 10:_s(t.type);break;case 22:case 23:Zn(t),dm(),e!==null&&hn(Ha);break;case 24:_s(je)}}function Il(e,t){try{var n=t.updateQueue,i=n!==null?n.lastEffect:null;if(i!==null){var s=i.next;n=s;do{if((n.tag&e)===e){i=void 0;var a=n.create,r=n.inst;i=a(),r.destroy=i}n=n.next}while(n!==s)}}catch(o){pe(t,t.return,o)}}function ca(e,t,n){try{var i=t.updateQueue,s=i!==null?i.lastEffect:null;if(s!==null){var a=s.next;i=a;do{if((i.tag&e)===e){var r=i.inst,o=r.destroy;if(o!==void 0){r.destroy=void 0,s=t;var l=n,c=o;try{c()}catch(u){pe(s,l,u)}}}i=i.next}while(i!==a)}}catch(u){pe(t,t.return,u)}}function o_(e){var t=e.updateQueue;if(t!==null){var n=e.stateNode;try{gv(t,n)}catch(i){pe(e,e.return,i)}}}function l_(e,t,n){n.props=Za(e.type,e.memoizedProps),n.state=e.memoizedState;try{n.componentWillUnmount()}catch(i){pe(e,t,i)}}function ll(e,t){try{var n=e.ref;if(n!==null){switch(e.tag){case 26:case 27:case 5:var i=e.stateNode;break;case 30:i=e.stateNode;break;default:i=e.stateNode}typeof n=="function"?e.refCleanup=n(i):n.current=i}}catch(s){pe(e,t,s)}}function Zi(e,t){var n=e.ref,i=e.refCleanup;if(n!==null)if(typeof i=="function")try{i()}catch(s){pe(e,t,s)}finally{e.refCleanup=null,e=e.alternate,e!=null&&(e.refCleanup=null)}else if(typeof n=="function")try{n(null)}catch(s){pe(e,t,s)}else n.current=null}function c_(e){var t=e.type,n=e.memoizedProps,i=e.stateNode;try{t:switch(t){case"button":case"input":case"select":case"textarea":n.autoFocus&&i.focus();break t;case"img":n.src?i.src=n.src:n.srcSet&&(i.srcset=n.srcSet)}}catch(s){pe(e,e.return,s)}}function Hd(e,t,n){try{var i=e.stateNode;FT(i,e.type,n,t),i[Hn]=t}catch(s){pe(e,e.return,s)}}function u_(e){return e.tag===5||e.tag===3||e.tag===26||e.tag===27&&fa(e.type)||e.tag===4}function Vd(e){t:for(;;){for(;e.sibling===null;){if(e.return===null||u_(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.tag===27&&fa(e.type)||e.flags&2||e.child===null||e.tag===4)continue t;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function Np(e,t,n){var i=e.tag;if(i===5||i===6)e=e.stateNode,t?(n.nodeType===9?n.body:n.nodeName==="HTML"?n.ownerDocument.body:n).insertBefore(e,t):(t=n.nodeType===9?n.body:n.nodeName==="HTML"?n.ownerDocument.body:n,t.appendChild(e),n=n._reactRootContainer,n!=null||t.onclick!==null||(t.onclick=ys));else if(i!==4&&(i===27&&fa(e.type)&&(n=e.stateNode,t=null),e=e.child,e!==null))for(Np(e,t,n),e=e.sibling;e!==null;)Np(e,t,n),e=e.sibling}function Eu(e,t,n){var i=e.tag;if(i===5||i===6)e=e.stateNode,t?n.insertBefore(e,t):n.appendChild(e);else if(i!==4&&(i===27&&fa(e.type)&&(n=e.stateNode),e=e.child,e!==null))for(Eu(e,t,n),e=e.sibling;e!==null;)Eu(e,t,n),e=e.sibling}function h_(e){var t=e.stateNode,n=e.memoizedProps;try{for(var i=e.type,s=t.attributes;s.length;)t.removeAttributeNode(s[0]);xn(t,i,n),t[mn]=e,t[Hn]=n}catch(a){pe(e,e.return,a)}}var ms=!1,Qe=!1,Gd=!1,Wy=typeof WeakSet=="function"?WeakSet:Set,cn=null;function _T(e,t){if(e=e.containerInfo,Bp=Pu,e=jx(e),im(e)){if("selectionStart"in e)var n={start:e.selectionStart,end:e.selectionEnd};else t:{n=(n=e.ownerDocument)&&n.defaultView||window;var i=n.getSelection&&n.getSelection();if(i&&i.rangeCount!==0){n=i.anchorNode;var s=i.anchorOffset,a=i.focusNode;i=i.focusOffset;try{n.nodeType,a.nodeType}catch{n=null;break t}var r=0,o=-1,l=-1,c=0,u=0,f=e,h=null;e:for(;;){for(var d;f!==n||s!==0&&f.nodeType!==3||(o=r+s),f!==a||i!==0&&f.nodeType!==3||(l=r+i),f.nodeType===3&&(r+=f.nodeValue.length),(d=f.firstChild)!==null;)h=f,f=d;for(;;){if(f===e)break e;if(h===n&&++c===s&&(o=r),h===a&&++u===i&&(l=r),(d=f.nextSibling)!==null)break;f=h,h=f.parentNode}f=d}n=o===-1||l===-1?null:{start:o,end:l}}else n=null}n=n||{start:0,end:0}}else n=null;for(zp={focusedElem:e,selectionRange:n},Pu=!1,cn=t;cn!==null;)if(t=cn,e=t.child,(t.subtreeFlags&1028)!==0&&e!==null)e.return=t,cn=e;else for(;cn!==null;){switch(t=cn,a=t.alternate,e=t.flags,t.tag){case 0:if((e&4)!==0&&(e=t.updateQueue,e=e!==null?e.events:null,e!==null))for(n=0;n<e.length;n++)s=e[n],s.ref.impl=s.nextImpl;break;case 11:case 15:break;case 1:if((e&1024)!==0&&a!==null){e=void 0,n=t,s=a.memoizedProps,a=a.memoizedState,i=n.stateNode;try{var m=Za(n.type,s);e=i.getSnapshotBeforeUpdate(m,a),i.__reactInternalSnapshotBeforeUpdate=e}catch(b){pe(n,n.return,b)}}break;case 3:if((e&1024)!==0){if(e=t.stateNode.containerInfo,n=e.nodeType,n===9)kp(e);else if(n===1)switch(e.nodeName){case"HEAD":case"HTML":case"BODY":kp(e);break;default:e.textContent=""}}break;case 5:case 26:case 27:case 6:case 4:case 17:break;default:if((e&1024)!==0)throw Error($(163))}if(e=t.sibling,e!==null){e.return=t.return,cn=e;break}cn=t.return}}function f_(e,t,n){var i=n.flags;switch(n.tag){case 0:case 11:case 15:fs(e,n),i&4&&Il(5,n);break;case 1:if(fs(e,n),i&4)if(e=n.stateNode,t===null)try{e.componentDidMount()}catch(r){pe(n,n.return,r)}else{var s=Za(n.type,t.memoizedProps);t=t.memoizedState;try{e.componentDidUpdate(s,t,e.__reactInternalSnapshotBeforeUpdate)}catch(r){pe(n,n.return,r)}}i&64&&o_(n),i&512&&ll(n,n.return);break;case 3:if(fs(e,n),i&64&&(e=n.updateQueue,e!==null)){if(t=null,n.child!==null)switch(n.child.tag){case 27:case 5:t=n.child.stateNode;break;case 1:t=n.child.stateNode}try{gv(e,t)}catch(r){pe(n,n.return,r)}}break;case 27:t===null&&i&4&&h_(n);case 26:case 5:fs(e,n),t===null&&i&4&&c_(n),i&512&&ll(n,n.return);break;case 12:fs(e,n);break;case 31:fs(e,n),i&4&&m_(e,n);break;case 13:fs(e,n),i&4&&g_(e,n),i&64&&(e=n.memoizedState,e!==null&&(e=e.dehydrated,e!==null&&(n=RT.bind(null,n),YT(e,n))));break;case 22:if(i=n.memoizedState!==null||ms,!i){t=t!==null&&t.memoizedState!==null||Qe,s=ms;var a=Qe;ms=i,(Qe=t)&&!a?ds(e,n,(n.subtreeFlags&8772)!==0):fs(e,n),ms=s,Qe=a}break;case 30:break;default:fs(e,n)}}function d_(e){var t=e.alternate;t!==null&&(e.alternate=null,d_(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&Qp(t)),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}var Ie=null,zn=!1;function hs(e,t,n){for(n=n.child;n!==null;)p_(e,t,n),n=n.sibling}function p_(e,t,n){if(jn&&typeof jn.onCommitFiberUnmount=="function")try{jn.onCommitFiberUnmount(Cl,n)}catch{}switch(n.tag){case 26:Qe||Zi(n,t),hs(e,t,n),n.memoizedState?n.memoizedState.count--:n.stateNode&&(n=n.stateNode,n.parentNode.removeChild(n));break;case 27:Qe||Zi(n,t);var i=Ie,s=zn;fa(n.type)&&(Ie=n.stateNode,zn=!1),hs(e,t,n),fl(n.stateNode),Ie=i,zn=s;break;case 5:Qe||Zi(n,t);case 6:if(i=Ie,s=zn,Ie=null,hs(e,t,n),Ie=i,zn=s,Ie!==null)if(zn)try{(Ie.nodeType===9?Ie.body:Ie.nodeName==="HTML"?Ie.ownerDocument.body:Ie).removeChild(n.stateNode)}catch(a){pe(n,t,a)}else try{Ie.removeChild(n.stateNode)}catch(a){pe(n,t,a)}break;case 18:Ie!==null&&(zn?(e=Ie,ax(e.nodeType===9?e.body:e.nodeName==="HTML"?e.ownerDocument.body:e,n.stateNode),to(e)):ax(Ie,n.stateNode));break;case 4:i=Ie,s=zn,Ie=n.stateNode.containerInfo,zn=!0,hs(e,t,n),Ie=i,zn=s;break;case 0:case 11:case 14:case 15:ca(2,n,t),Qe||ca(4,n,t),hs(e,t,n);break;case 1:Qe||(Zi(n,t),i=n.stateNode,typeof i.componentWillUnmount=="function"&&l_(n,t,i)),hs(e,t,n);break;case 21:hs(e,t,n);break;case 22:Qe=(i=Qe)||n.memoizedState!==null,hs(e,t,n),Qe=i;break;default:hs(e,t,n)}}function m_(e,t){if(t.memoizedState===null&&(e=t.alternate,e!==null&&(e=e.memoizedState,e!==null))){e=e.dehydrated;try{to(e)}catch(n){pe(t,t.return,n)}}}function g_(e,t){if(t.memoizedState===null&&(e=t.alternate,e!==null&&(e=e.memoizedState,e!==null&&(e=e.dehydrated,e!==null))))try{to(e)}catch(n){pe(t,t.return,n)}}function bT(e){switch(e.tag){case 31:case 13:case 19:var t=e.stateNode;return t===null&&(t=e.stateNode=new Wy),t;case 22:return e=e.stateNode,t=e._retryCache,t===null&&(t=e._retryCache=new Wy),t;default:throw Error($(435,e.tag))}}function Vc(e,t){var n=bT(e);t.forEach(function(i){if(!n.has(i)){n.add(i);var s=NT.bind(null,e,i);i.then(s,s)}})}function Pn(e,t){var n=t.deletions;if(n!==null)for(var i=0;i<n.length;i++){var s=n[i],a=e,r=t,o=r;t:for(;o!==null;){switch(o.tag){case 27:if(fa(o.type)){Ie=o.stateNode,zn=!1;break t}break;case 5:Ie=o.stateNode,zn=!1;break t;case 3:case 4:Ie=o.stateNode.containerInfo,zn=!0;break t}o=o.return}if(Ie===null)throw Error($(160));p_(a,r,s),Ie=null,zn=!1,a=s.alternate,a!==null&&(a.return=null),s.return=null}if(t.subtreeFlags&13886)for(t=t.child;t!==null;)y_(t,e),t=t.sibling}var Ri=null;function y_(e,t){var n=e.alternate,i=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:Pn(t,e),Bn(e),i&4&&(ca(3,e,e.return),Il(3,e),ca(5,e,e.return));break;case 1:Pn(t,e),Bn(e),i&512&&(Qe||n===null||Zi(n,n.return)),i&64&&ms&&(e=e.updateQueue,e!==null&&(i=e.callbacks,i!==null&&(n=e.shared.hiddenCallbacks,e.shared.hiddenCallbacks=n===null?i:n.concat(i))));break;case 26:var s=Ri;if(Pn(t,e),Bn(e),i&512&&(Qe||n===null||Zi(n,n.return)),i&4){var a=n!==null?n.memoizedState:null;if(i=e.memoizedState,n===null)if(i===null)if(e.stateNode===null){t:{i=e.type,n=e.memoizedProps,s=s.ownerDocument||s;e:switch(i){case"title":a=s.getElementsByTagName("title")[0],(!a||a[Dl]||a[mn]||a.namespaceURI==="http://www.w3.org/2000/svg"||a.hasAttribute("itemprop"))&&(a=s.createElement(i),s.head.insertBefore(a,s.querySelector("head > title"))),xn(a,i,n),a[mn]=e,un(a),i=a;break t;case"link":var r=fx("link","href",s).get(i+(n.href||""));if(r){for(var o=0;o<r.length;o++)if(a=r[o],a.getAttribute("href")===(n.href==null||n.href===""?null:n.href)&&a.getAttribute("rel")===(n.rel==null?null:n.rel)&&a.getAttribute("title")===(n.title==null?null:n.title)&&a.getAttribute("crossorigin")===(n.crossOrigin==null?null:n.crossOrigin)){r.splice(o,1);break e}}a=s.createElement(i),xn(a,i,n),s.head.appendChild(a);break;case"meta":if(r=fx("meta","content",s).get(i+(n.content||""))){for(o=0;o<r.length;o++)if(a=r[o],a.getAttribute("content")===(n.content==null?null:""+n.content)&&a.getAttribute("name")===(n.name==null?null:n.name)&&a.getAttribute("property")===(n.property==null?null:n.property)&&a.getAttribute("http-equiv")===(n.httpEquiv==null?null:n.httpEquiv)&&a.getAttribute("charset")===(n.charSet==null?null:n.charSet)){r.splice(o,1);break e}}a=s.createElement(i),xn(a,i,n),s.head.appendChild(a);break;default:throw Error($(468,i))}a[mn]=e,un(a),i=a}e.stateNode=i}else dx(s,e.type,e.stateNode);else e.stateNode=hx(s,i,e.memoizedProps);else a!==i?(a===null?n.stateNode!==null&&(n=n.stateNode,n.parentNode.removeChild(n)):a.count--,i===null?dx(s,e.type,e.stateNode):hx(s,i,e.memoizedProps)):i===null&&e.stateNode!==null&&Hd(e,e.memoizedProps,n.memoizedProps)}break;case 27:Pn(t,e),Bn(e),i&512&&(Qe||n===null||Zi(n,n.return)),n!==null&&i&4&&Hd(e,e.memoizedProps,n.memoizedProps);break;case 5:if(Pn(t,e),Bn(e),i&512&&(Qe||n===null||Zi(n,n.return)),e.flags&32){s=e.stateNode;try{qr(s,"")}catch(m){pe(e,e.return,m)}}i&4&&e.stateNode!=null&&(s=e.memoizedProps,Hd(e,s,n!==null?n.memoizedProps:s)),i&1024&&(Gd=!0);break;case 6:if(Pn(t,e),Bn(e),i&4){if(e.stateNode===null)throw Error($(162));i=e.memoizedProps,n=e.stateNode;try{n.nodeValue=i}catch(m){pe(e,e.return,m)}}break;case 3:if(ru=null,s=Ri,Ri=Uu(t.containerInfo),Pn(t,e),Ri=s,Bn(e),i&4&&n!==null&&n.memoizedState.isDehydrated)try{to(t.containerInfo)}catch(m){pe(e,e.return,m)}Gd&&(Gd=!1,x_(e));break;case 4:i=Ri,Ri=Uu(e.stateNode.containerInfo),Pn(t,e),Bn(e),Ri=i;break;case 12:Pn(t,e),Bn(e);break;case 31:Pn(t,e),Bn(e),i&4&&(i=e.updateQueue,i!==null&&(e.updateQueue=null,Vc(e,i)));break;case 13:Pn(t,e),Bn(e),e.child.flags&8192&&e.memoizedState!==null!=(n!==null&&n.memoizedState!==null)&&(Ku=Qn()),i&4&&(i=e.updateQueue,i!==null&&(e.updateQueue=null,Vc(e,i)));break;case 22:s=e.memoizedState!==null;var l=n!==null&&n.memoizedState!==null,c=ms,u=Qe;if(ms=c||s,Qe=u||l,Pn(t,e),Qe=u,ms=c,Bn(e),i&8192)t:for(t=e.stateNode,t._visibility=s?t._visibility&-2:t._visibility|1,s&&(n===null||l||ms||Qe||za(e)),n=null,t=e;;){if(t.tag===5||t.tag===26){if(n===null){l=n=t;try{if(a=l.stateNode,s)r=a.style,typeof r.setProperty=="function"?r.setProperty("display","none","important"):r.display="none";else{o=l.stateNode;var f=l.memoizedProps.style,h=f!=null&&f.hasOwnProperty("display")?f.display:null;o.style.display=h==null||typeof h=="boolean"?"":(""+h).trim()}}catch(m){pe(l,l.return,m)}}}else if(t.tag===6){if(n===null){l=t;try{l.stateNode.nodeValue=s?"":l.memoizedProps}catch(m){pe(l,l.return,m)}}}else if(t.tag===18){if(n===null){l=t;try{var d=l.stateNode;s?rx(d,!0):rx(l.stateNode,!1)}catch(m){pe(l,l.return,m)}}}else if((t.tag!==22&&t.tag!==23||t.memoizedState===null||t===e)&&t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break t;for(;t.sibling===null;){if(t.return===null||t.return===e)break t;n===t&&(n=null),t=t.return}n===t&&(n=null),t.sibling.return=t.return,t=t.sibling}i&4&&(i=e.updateQueue,i!==null&&(n=i.retryQueue,n!==null&&(i.retryQueue=null,Vc(e,n))));break;case 19:Pn(t,e),Bn(e),i&4&&(i=e.updateQueue,i!==null&&(e.updateQueue=null,Vc(e,i)));break;case 30:break;case 21:break;default:Pn(t,e),Bn(e)}}function Bn(e){var t=e.flags;if(t&2){try{for(var n,i=e.return;i!==null;){if(u_(i)){n=i;break}i=i.return}if(n==null)throw Error($(160));switch(n.tag){case 27:var s=n.stateNode,a=Vd(e);Eu(e,a,s);break;case 5:var r=n.stateNode;n.flags&32&&(qr(r,""),n.flags&=-33);var o=Vd(e);Eu(e,o,r);break;case 3:case 4:var l=n.stateNode.containerInfo,c=Vd(e);Np(e,c,l);break;default:throw Error($(161))}}catch(u){pe(e,e.return,u)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function x_(e){if(e.subtreeFlags&1024)for(e=e.child;e!==null;){var t=e;x_(t),t.tag===5&&t.flags&1024&&t.stateNode.reset(),e=e.sibling}}function fs(e,t){if(t.subtreeFlags&8772)for(t=t.child;t!==null;)f_(e,t.alternate,t),t=t.sibling}function za(e){for(e=e.child;e!==null;){var t=e;switch(t.tag){case 0:case 11:case 14:case 15:ca(4,t,t.return),za(t);break;case 1:Zi(t,t.return);var n=t.stateNode;typeof n.componentWillUnmount=="function"&&l_(t,t.return,n),za(t);break;case 27:fl(t.stateNode);case 26:case 5:Zi(t,t.return),za(t);break;case 22:t.memoizedState===null&&za(t);break;case 30:za(t);break;default:za(t)}e=e.sibling}}function ds(e,t,n){for(n=n&&(t.subtreeFlags&8772)!==0,t=t.child;t!==null;){var i=t.alternate,s=e,a=t,r=a.flags;switch(a.tag){case 0:case 11:case 15:ds(s,a,n),Il(4,a);break;case 1:if(ds(s,a,n),i=a,s=i.stateNode,typeof s.componentDidMount=="function")try{s.componentDidMount()}catch(c){pe(i,i.return,c)}if(i=a,s=i.updateQueue,s!==null){var o=i.stateNode;try{var l=s.shared.hiddenCallbacks;if(l!==null)for(s.shared.hiddenCallbacks=null,s=0;s<l.length;s++)mv(l[s],o)}catch(c){pe(i,i.return,c)}}n&&r&64&&o_(a),ll(a,a.return);break;case 27:h_(a);case 26:case 5:ds(s,a,n),n&&i===null&&r&4&&c_(a),ll(a,a.return);break;case 12:ds(s,a,n);break;case 31:ds(s,a,n),n&&r&4&&m_(s,a);break;case 13:ds(s,a,n),n&&r&4&&g_(s,a);break;case 22:a.memoizedState===null&&ds(s,a,n),ll(a,a.return);break;case 30:break;default:ds(s,a,n)}t=t.sibling}}function Rm(e,t){var n=null;e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(n=e.memoizedState.cachePool.pool),e=null,t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(e=t.memoizedState.cachePool.pool),e!==n&&(e!=null&&e.refCount++,n!=null&&Ul(n))}function Nm(e,t){e=null,t.alternate!==null&&(e=t.alternate.memoizedState.cache),t=t.memoizedState.cache,t!==e&&(t.refCount++,e!=null&&Ul(e))}function Ci(e,t,n,i){if(t.subtreeFlags&10256)for(t=t.child;t!==null;)v_(e,t,n,i),t=t.sibling}function v_(e,t,n,i){var s=t.flags;switch(t.tag){case 0:case 11:case 15:Ci(e,t,n,i),s&2048&&Il(9,t);break;case 1:Ci(e,t,n,i);break;case 3:Ci(e,t,n,i),s&2048&&(e=null,t.alternate!==null&&(e=t.alternate.memoizedState.cache),t=t.memoizedState.cache,t!==e&&(t.refCount++,e!=null&&Ul(e)));break;case 12:if(s&2048){Ci(e,t,n,i),e=t.stateNode;try{var a=t.memoizedProps,r=a.id,o=a.onPostCommit;typeof o=="function"&&o(r,t.alternate===null?"mount":"update",e.passiveEffectDuration,-0)}catch(l){pe(t,t.return,l)}}else Ci(e,t,n,i);break;case 31:Ci(e,t,n,i);break;case 13:Ci(e,t,n,i);break;case 23:break;case 22:a=t.stateNode,r=t.alternate,t.memoizedState!==null?a._visibility&2?Ci(e,t,n,i):cl(e,t):a._visibility&2?Ci(e,t,n,i):(a._visibility|=2,Mr(e,t,n,i,(t.subtreeFlags&10256)!==0||!1)),s&2048&&Rm(r,t);break;case 24:Ci(e,t,n,i),s&2048&&Nm(t.alternate,t);break;default:Ci(e,t,n,i)}}function Mr(e,t,n,i,s){for(s=s&&((t.subtreeFlags&10256)!==0||!1),t=t.child;t!==null;){var a=e,r=t,o=n,l=i,c=r.flags;switch(r.tag){case 0:case 11:case 15:Mr(a,r,o,l,s),Il(8,r);break;case 23:break;case 22:var u=r.stateNode;r.memoizedState!==null?u._visibility&2?Mr(a,r,o,l,s):cl(a,r):(u._visibility|=2,Mr(a,r,o,l,s)),s&&c&2048&&Rm(r.alternate,r);break;case 24:Mr(a,r,o,l,s),s&&c&2048&&Nm(r.alternate,r);break;default:Mr(a,r,o,l,s)}t=t.sibling}}function cl(e,t){if(t.subtreeFlags&10256)for(t=t.child;t!==null;){var n=e,i=t,s=i.flags;switch(i.tag){case 22:cl(n,i),s&2048&&Rm(i.alternate,i);break;case 24:cl(n,i),s&2048&&Nm(i.alternate,i);break;default:cl(n,i)}t=t.sibling}}var $o=8192;function Sr(e,t,n){if(e.subtreeFlags&$o)for(e=e.child;e!==null;)__(e,t,n),e=e.sibling}function __(e,t,n){switch(e.tag){case 26:Sr(e,t,n),e.flags&$o&&e.memoizedState!==null&&aE(n,Ri,e.memoizedState,e.memoizedProps);break;case 5:Sr(e,t,n);break;case 3:case 4:var i=Ri;Ri=Uu(e.stateNode.containerInfo),Sr(e,t,n),Ri=i;break;case 22:e.memoizedState===null&&(i=e.alternate,i!==null&&i.memoizedState!==null?(i=$o,$o=16777216,Sr(e,t,n),$o=i):Sr(e,t,n));break;default:Sr(e,t,n)}}function b_(e){var t=e.alternate;if(t!==null&&(e=t.child,e!==null)){t.child=null;do t=e.sibling,e.sibling=null,e=t;while(e!==null)}}function qo(e){var t=e.deletions;if((e.flags&16)!==0){if(t!==null)for(var n=0;n<t.length;n++){var i=t[n];cn=i,M_(i,e)}b_(e)}if(e.subtreeFlags&10256)for(e=e.child;e!==null;)S_(e),e=e.sibling}function S_(e){switch(e.tag){case 0:case 11:case 15:qo(e),e.flags&2048&&ca(9,e,e.return);break;case 3:qo(e);break;case 12:qo(e);break;case 22:var t=e.stateNode;e.memoizedState!==null&&t._visibility&2&&(e.return===null||e.return.tag!==13)?(t._visibility&=-3,su(e)):qo(e);break;default:qo(e)}}function su(e){var t=e.deletions;if((e.flags&16)!==0){if(t!==null)for(var n=0;n<t.length;n++){var i=t[n];cn=i,M_(i,e)}b_(e)}for(e=e.child;e!==null;){switch(t=e,t.tag){case 0:case 11:case 15:ca(8,t,t.return),su(t);break;case 22:n=t.stateNode,n._visibility&2&&(n._visibility&=-3,su(t));break;default:su(t)}e=e.sibling}}function M_(e,t){for(;cn!==null;){var n=cn;switch(n.tag){case 0:case 11:case 15:ca(8,n,t);break;case 23:case 22:if(n.memoizedState!==null&&n.memoizedState.cachePool!==null){var i=n.memoizedState.cachePool.pool;i!=null&&i.refCount++}break;case 24:Ul(n.memoizedState.cache)}if(i=n.child,i!==null)i.return=n,cn=i;else t:for(n=e;cn!==null;){i=cn;var s=i.sibling,a=i.return;if(d_(i),i===n){cn=null;break t}if(s!==null){s.return=a,cn=s;break t}cn=a}}}var ST={getCacheForType:function(e){var t=yn(je),n=t.data.get(e);return n===void 0&&(n=e(),t.data.set(e,n)),n},cacheSignal:function(){return yn(je).controller.signal}},MT=typeof WeakMap=="function"?WeakMap:Map,oe=0,_e=null,Zt=null,Jt=0,de=0,Yn=null,Ks=!1,ao=!1,Dm=!1,As=0,ke=0,ua=0,Ga=0,Lm=0,Jn=0,Jr=0,ul=null,Fn=null,Dp=!1,Ku=0,T_=0,Au=1/0,wu=null,na=null,en=0,ia=null,Qr=null,bs=0,Lp=0,Up=null,E_=null,hl=0,Op=null;function ti(){return(oe&2)!==0&&Jt!==0?Jt&-Jt:Ut.T!==null?Om():Ox()}function A_(){if(Jn===0)if((Jt&536870912)===0||jt){var e=Lc;Lc<<=1,(Lc&3932160)===0&&(Lc=262144),Jn=e}else Jn=536870912;return e=ni.current,e!==null&&(e.flags|=32),Jn}function kn(e,t,n){(e===_e&&(de===2||de===9)||e.cancelPendingCommit!==null)&&(jr(e,0),Js(e,Jt,Jn,!1)),Nl(e,n),((oe&2)===0||e!==_e)&&(e===_e&&((oe&2)===0&&(Ga|=n),ke===4&&Js(e,Jt,Jn,!1)),Qi(e))}function w_(e,t,n){if((oe&6)!==0)throw Error($(327));var i=!n&&(t&127)===0&&(t&e.expiredLanes)===0||Rl(e,t),s=i?AT(e,t):Wd(e,t,!0),a=i;do{if(s===0){ao&&!i&&Js(e,t,0,!1);break}else{if(n=e.current.alternate,a&&!TT(n)){s=Wd(e,t,!1),a=!1;continue}if(s===2){if(a=t,e.errorRecoveryDisabledLanes&a)var r=0;else r=e.pendingLanes&-536870913,r=r!==0?r:r&536870912?536870912:0;if(r!==0){t=r;t:{var o=e;s=ul;var l=o.current.memoizedState.isDehydrated;if(l&&(jr(o,r).flags|=256),r=Wd(o,r,!1),r!==2){if(Dm&&!l){o.errorRecoveryDisabledLanes|=a,Ga|=a,s=4;break t}a=Fn,Fn=s,a!==null&&(Fn===null?Fn=a:Fn.push.apply(Fn,a))}s=r}if(a=!1,s!==2)continue}}if(s===1){jr(e,0),Js(e,t,0,!0);break}t:{switch(i=e,a=s,a){case 0:case 1:throw Error($(345));case 4:if((t&4194048)!==t)break;case 6:Js(i,t,Jn,!Ks);break t;case 2:Fn=null;break;case 3:case 5:break;default:throw Error($(329))}if((t&62914560)===t&&(s=Ku+300-Qn(),10<s)){if(Js(i,t,Jn,!Ks),zu(i,0,!0)!==0)break t;bs=t,i.timeoutHandle=Y_(Xy.bind(null,i,n,Fn,wu,Dp,t,Jn,Ga,Jr,Ks,a,"Throttled",-0,0),s);break t}Xy(i,n,Fn,wu,Dp,t,Jn,Ga,Jr,Ks,a,null,-0,0)}}break}while(!0);Qi(e)}function Xy(e,t,n,i,s,a,r,o,l,c,u,f,h,d){if(e.timeoutHandle=-1,f=t.subtreeFlags,f&8192||(f&16785408)===16785408){f={stylesheets:null,count:0,imgCount:0,imgBytes:0,suspenseyImages:[],waitingForImages:!0,waitingForViewTransition:!1,unsuspend:ys},__(t,a,f);var m=(a&62914560)===a?Ku-Qn():(a&4194048)===a?T_-Qn():0;if(m=rE(f,m),m!==null){bs=a,e.cancelPendingCommit=m(Yy.bind(null,e,t,a,n,i,s,r,o,l,u,f,null,h,d)),Js(e,a,r,!c);return}}Yy(e,t,a,n,i,s,r,o,l)}function TT(e){for(var t=e;;){var n=t.tag;if((n===0||n===11||n===15)&&t.flags&16384&&(n=t.updateQueue,n!==null&&(n=n.stores,n!==null)))for(var i=0;i<n.length;i++){var s=n[i],a=s.getSnapshot;s=s.value;try{if(!ei(a(),s))return!1}catch{return!1}}if(n=t.child,t.subtreeFlags&16384&&n!==null)n.return=t,t=n;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function Js(e,t,n,i){t&=~Lm,t&=~Ga,e.suspendedLanes|=t,e.pingedLanes&=~t,i&&(e.warmLanes|=t),i=e.expirationTimes;for(var s=t;0<s;){var a=31-$n(s),r=1<<a;i[a]=-1,s&=~r}n!==0&&Dx(e,n,t)}function Ju(){return(oe&6)===0?(Pl(0,!1),!1):!0}function Um(){if(Zt!==null){if(de===0)var e=Zt.return;else e=Zt,xs=$a=null,xm(e),Hr=null,vl=0,e=Zt;for(;e!==null;)r_(e.alternate,e),e=e.return;Zt=null}}function jr(e,t){var n=e.timeoutHandle;n!==-1&&(e.timeoutHandle=-1,VT(n)),n=e.cancelPendingCommit,n!==null&&(e.cancelPendingCommit=null,n()),bs=0,Um(),_e=e,Zt=n=vs(e.current,null),Jt=t,de=0,Yn=null,Ks=!1,ao=Rl(e,t),Dm=!1,Jr=Jn=Lm=Ga=ua=ke=0,Fn=ul=null,Dp=!1,(t&8)!==0&&(t|=t&32);var i=e.entangledLanes;if(i!==0)for(e=e.entanglements,i&=t;0<i;){var s=31-$n(i),a=1<<s;t|=e[s],i&=~a}return As=t,Vu(),n}function C_(e,t){Ht=null,Ut.H=bl,t===so||t===Wu?(t=My(),de=3):t===hm?(t=My(),de=4):de=t===wm?8:t!==null&&typeof t=="object"&&typeof t.then=="function"?6:1,Yn=t,Zt===null&&(ke=1,Mu(e,mi(t,e.current)))}function R_(){var e=ni.current;return e===null?!0:(Jt&4194048)===Jt?yi===null:(Jt&62914560)===Jt||(Jt&536870912)!==0?e===yi:!1}function N_(){var e=Ut.H;return Ut.H=bl,e===null?bl:e}function D_(){var e=Ut.A;return Ut.A=ST,e}function Cu(){ke=4,Ks||(Jt&4194048)!==Jt&&ni.current!==null||(ao=!0),(ua&134217727)===0&&(Ga&134217727)===0||_e===null||Js(_e,Jt,Jn,!1)}function Wd(e,t,n){var i=oe;oe|=2;var s=N_(),a=D_();(_e!==e||Jt!==t)&&(wu=null,jr(e,t)),t=!1;var r=ke;t:do try{if(de!==0&&Zt!==null){var o=Zt,l=Yn;switch(de){case 8:Um(),r=6;break t;case 3:case 2:case 9:case 6:ni.current===null&&(t=!0);var c=de;if(de=0,Yn=null,Pr(e,o,l,c),n&&ao){r=0;break t}break;default:c=de,de=0,Yn=null,Pr(e,o,l,c)}}ET(),r=ke;break}catch(u){C_(e,u)}while(!0);return t&&e.shellSuspendCounter++,xs=$a=null,oe=i,Ut.H=s,Ut.A=a,Zt===null&&(_e=null,Jt=0,Vu()),r}function ET(){for(;Zt!==null;)L_(Zt)}function AT(e,t){var n=oe;oe|=2;var i=N_(),s=D_();_e!==e||Jt!==t?(wu=null,Au=Qn()+500,jr(e,t)):ao=Rl(e,t);t:do try{if(de!==0&&Zt!==null){t=Zt;var a=Yn;e:switch(de){case 1:de=0,Yn=null,Pr(e,t,a,1);break;case 2:case 9:if(Sy(a)){de=0,Yn=null,qy(t);break}t=function(){de!==2&&de!==9||_e!==e||(de=7),Qi(e)},a.then(t,t);break t;case 3:de=7;break t;case 4:de=5;break t;case 7:Sy(a)?(de=0,Yn=null,qy(t)):(de=0,Yn=null,Pr(e,t,a,7));break;case 5:var r=null;switch(Zt.tag){case 26:r=Zt.memoizedState;case 5:case 27:var o=Zt;if(r?j_(r):o.stateNode.complete){de=0,Yn=null;var l=o.sibling;if(l!==null)Zt=l;else{var c=o.return;c!==null?(Zt=c,Qu(c)):Zt=null}break e}}de=0,Yn=null,Pr(e,t,a,5);break;case 6:de=0,Yn=null,Pr(e,t,a,6);break;case 8:Um(),ke=6;break t;default:throw Error($(462))}}wT();break}catch(u){C_(e,u)}while(!0);return xs=$a=null,Ut.H=i,Ut.A=s,oe=n,Zt!==null?0:(_e=null,Jt=0,Vu(),ke)}function wT(){for(;Zt!==null&&!J1();)L_(Zt)}function L_(e){var t=a_(e.alternate,e,As);e.memoizedProps=e.pendingProps,t===null?Qu(e):Zt=t}function qy(e){var t=e,n=t.alternate;switch(t.tag){case 15:case 0:t=Fy(n,t,t.pendingProps,t.type,void 0,Jt);break;case 11:t=Fy(n,t,t.pendingProps,t.type.render,t.ref,Jt);break;case 5:xm(t);default:r_(n,t),t=Zt=rv(t,As),t=a_(n,t,As)}e.memoizedProps=e.pendingProps,t===null?Qu(e):Zt=t}function Pr(e,t,n,i){xs=$a=null,xm(t),Hr=null,vl=0;var s=t.return;try{if(mT(e,s,t,n,Jt)){ke=1,Mu(e,mi(n,e.current)),Zt=null;return}}catch(a){if(s!==null)throw Zt=s,a;ke=1,Mu(e,mi(n,e.current)),Zt=null;return}t.flags&32768?(jt||i===1?e=!0:ao||(Jt&536870912)!==0?e=!1:(Ks=e=!0,(i===2||i===9||i===3||i===6)&&(i=ni.current,i!==null&&i.tag===13&&(i.flags|=16384))),U_(t,e)):Qu(t)}function Qu(e){var t=e;do{if((t.flags&32768)!==0){U_(t,Ks);return}e=t.return;var n=xT(t.alternate,t,As);if(n!==null){Zt=n;return}if(t=t.sibling,t!==null){Zt=t;return}Zt=t=e}while(t!==null);ke===0&&(ke=5)}function U_(e,t){do{var n=vT(e.alternate,e);if(n!==null){n.flags&=32767,Zt=n;return}if(n=e.return,n!==null&&(n.flags|=32768,n.subtreeFlags=0,n.deletions=null),!t&&(e=e.sibling,e!==null)){Zt=e;return}Zt=e=n}while(e!==null);ke=6,Zt=null}function Yy(e,t,n,i,s,a,r,o,l){e.cancelPendingCommit=null;do ju();while(en!==0);if((oe&6)!==0)throw Error($(327));if(t!==null){if(t===e.current)throw Error($(177));if(a=t.lanes|t.childLanes,a|=sm,rM(e,n,a,r,o,l),e===_e&&(Zt=_e=null,Jt=0),Qr=t,ia=e,bs=n,Lp=a,Up=s,E_=i,(t.subtreeFlags&10256)!==0||(t.flags&10256)!==0?(e.callbackNode=null,e.callbackPriority=0,DT(fu,function(){return z_(),null})):(e.callbackNode=null,e.callbackPriority=0),i=(t.flags&13878)!==0,(t.subtreeFlags&13878)!==0||i){i=Ut.T,Ut.T=null,s=le.p,le.p=2,r=oe,oe|=4;try{_T(e,t,n)}finally{oe=r,le.p=s,Ut.T=i}}en=1,O_(),I_(),P_()}}function O_(){if(en===1){en=0;var e=ia,t=Qr,n=(t.flags&13878)!==0;if((t.subtreeFlags&13878)!==0||n){n=Ut.T,Ut.T=null;var i=le.p;le.p=2;var s=oe;oe|=4;try{y_(t,e);var a=zp,r=jx(e.containerInfo),o=a.focusedElem,l=a.selectionRange;if(r!==o&&o&&o.ownerDocument&&Qx(o.ownerDocument.documentElement,o)){if(l!==null&&im(o)){var c=l.start,u=l.end;if(u===void 0&&(u=c),"selectionStart"in o)o.selectionStart=c,o.selectionEnd=Math.min(u,o.value.length);else{var f=o.ownerDocument||document,h=f&&f.defaultView||window;if(h.getSelection){var d=h.getSelection(),m=o.textContent.length,b=Math.min(l.start,m),g=l.end===void 0?b:Math.min(l.end,m);!d.extend&&b>g&&(r=g,g=b,b=r);var p=my(o,b),y=my(o,g);if(p&&y&&(d.rangeCount!==1||d.anchorNode!==p.node||d.anchorOffset!==p.offset||d.focusNode!==y.node||d.focusOffset!==y.offset)){var S=f.createRange();S.setStart(p.node,p.offset),d.removeAllRanges(),b>g?(d.addRange(S),d.extend(y.node,y.offset)):(S.setEnd(y.node,y.offset),d.addRange(S))}}}}for(f=[],d=o;d=d.parentNode;)d.nodeType===1&&f.push({element:d,left:d.scrollLeft,top:d.scrollTop});for(typeof o.focus=="function"&&o.focus(),o=0;o<f.length;o++){var v=f[o];v.element.scrollLeft=v.left,v.element.scrollTop=v.top}}Pu=!!Bp,zp=Bp=null}finally{oe=s,le.p=i,Ut.T=n}}e.current=t,en=2}}function I_(){if(en===2){en=0;var e=ia,t=Qr,n=(t.flags&8772)!==0;if((t.subtreeFlags&8772)!==0||n){n=Ut.T,Ut.T=null;var i=le.p;le.p=2;var s=oe;oe|=4;try{f_(e,t.alternate,t)}finally{oe=s,le.p=i,Ut.T=n}}en=3}}function P_(){if(en===4||en===3){en=0,Q1();var e=ia,t=Qr,n=bs,i=E_;(t.subtreeFlags&10256)!==0||(t.flags&10256)!==0?en=5:(en=0,Qr=ia=null,B_(e,e.pendingLanes));var s=e.pendingLanes;if(s===0&&(na=null),Jp(n),t=t.stateNode,jn&&typeof jn.onCommitFiberRoot=="function")try{jn.onCommitFiberRoot(Cl,t,void 0,(t.current.flags&128)===128)}catch{}if(i!==null){t=Ut.T,s=le.p,le.p=2,Ut.T=null;try{for(var a=e.onRecoverableError,r=0;r<i.length;r++){var o=i[r];a(o.value,{componentStack:o.stack})}}finally{Ut.T=t,le.p=s}}(bs&3)!==0&&ju(),Qi(e),s=e.pendingLanes,(n&261930)!==0&&(s&42)!==0?e===Op?hl++:(hl=0,Op=e):hl=0,Pl(0,!1)}}function B_(e,t){(e.pooledCacheLanes&=t)===0&&(t=e.pooledCache,t!=null&&(e.pooledCache=null,Ul(t)))}function ju(){return O_(),I_(),P_(),z_()}function z_(){if(en!==5)return!1;var e=ia,t=Lp;Lp=0;var n=Jp(bs),i=Ut.T,s=le.p;try{le.p=32>n?32:n,Ut.T=null,n=Up,Up=null;var a=ia,r=bs;if(en=0,Qr=ia=null,bs=0,(oe&6)!==0)throw Error($(331));var o=oe;if(oe|=4,S_(a.current),v_(a,a.current,r,n),oe=o,Pl(0,!1),jn&&typeof jn.onPostCommitFiberRoot=="function")try{jn.onPostCommitFiberRoot(Cl,a)}catch{}return!0}finally{le.p=s,Ut.T=i,B_(e,t)}}function Zy(e,t,n){t=mi(n,t),t=wp(e.stateNode,t,2),e=ea(e,t,2),e!==null&&(Nl(e,2),Qi(e))}function pe(e,t,n){if(e.tag===3)Zy(e,e,n);else for(;t!==null;){if(t.tag===3){Zy(t,e,n);break}else if(t.tag===1){var i=t.stateNode;if(typeof t.type.getDerivedStateFromError=="function"||typeof i.componentDidCatch=="function"&&(na===null||!na.has(i))){e=mi(n,e),n=$v(2),i=ea(t,n,2),i!==null&&(t_(n,i,t,e),Nl(i,2),Qi(i));break}}t=t.return}}function Xd(e,t,n){var i=e.pingCache;if(i===null){i=e.pingCache=new MT;var s=new Set;i.set(t,s)}else s=i.get(t),s===void 0&&(s=new Set,i.set(t,s));s.has(n)||(Dm=!0,s.add(n),e=CT.bind(null,e,t,n),t.then(e,e))}function CT(e,t,n){var i=e.pingCache;i!==null&&i.delete(t),e.pingedLanes|=e.suspendedLanes&n,e.warmLanes&=~n,_e===e&&(Jt&n)===n&&(ke===4||ke===3&&(Jt&62914560)===Jt&&300>Qn()-Ku?(oe&2)===0&&jr(e,0):Lm|=n,Jr===Jt&&(Jr=0)),Qi(e)}function F_(e,t){t===0&&(t=Nx()),e=ja(e,t),e!==null&&(Nl(e,t),Qi(e))}function RT(e){var t=e.memoizedState,n=0;t!==null&&(n=t.retryLane),F_(e,n)}function NT(e,t){var n=0;switch(e.tag){case 31:case 13:var i=e.stateNode,s=e.memoizedState;s!==null&&(n=s.retryLane);break;case 19:i=e.stateNode;break;case 22:i=e.stateNode._retryCache;break;default:throw Error($(314))}i!==null&&i.delete(t),F_(e,n)}function DT(e,t){return Zp(e,t)}var Ru=null,Tr=null,Ip=!1,Nu=!1,qd=!1,Qs=0;function Qi(e){e!==Tr&&e.next===null&&(Tr===null?Ru=Tr=e:Tr=Tr.next=e),Nu=!0,Ip||(Ip=!0,UT())}function Pl(e,t){if(!qd&&Nu){qd=!0;do for(var n=!1,i=Ru;i!==null;){if(!t)if(e!==0){var s=i.pendingLanes;if(s===0)var a=0;else{var r=i.suspendedLanes,o=i.pingedLanes;a=(1<<31-$n(42|e)+1)-1,a&=s&~(r&~o),a=a&201326741?a&201326741|1:a?a|2:0}a!==0&&(n=!0,Ky(i,a))}else a=Jt,a=zu(i,i===_e?a:0,i.cancelPendingCommit!==null||i.timeoutHandle!==-1),(a&3)===0||Rl(i,a)||(n=!0,Ky(i,a));i=i.next}while(n);qd=!1}}function LT(){k_()}function k_(){Nu=Ip=!1;var e=0;Qs!==0&&HT()&&(e=Qs);for(var t=Qn(),n=null,i=Ru;i!==null;){var s=i.next,a=H_(i,t);a===0?(i.next=null,n===null?Ru=s:n.next=s,s===null&&(Tr=n)):(n=i,(e!==0||(a&3)!==0)&&(Nu=!0)),i=s}en!==0&&en!==5||Pl(e,!1),Qs!==0&&(Qs=0)}function H_(e,t){for(var n=e.suspendedLanes,i=e.pingedLanes,s=e.expirationTimes,a=e.pendingLanes&-62914561;0<a;){var r=31-$n(a),o=1<<r,l=s[r];l===-1?((o&n)===0||(o&i)!==0)&&(s[r]=aM(o,t)):l<=t&&(e.expiredLanes|=o),a&=~o}if(t=_e,n=Jt,n=zu(e,e===t?n:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),i=e.callbackNode,n===0||e===t&&(de===2||de===9)||e.cancelPendingCommit!==null)return i!==null&&i!==null&&bd(i),e.callbackNode=null,e.callbackPriority=0;if((n&3)===0||Rl(e,n)){if(t=n&-n,t===e.callbackPriority)return t;switch(i!==null&&bd(i),Jp(n)){case 2:case 8:n=Cx;break;case 32:n=fu;break;case 268435456:n=Rx;break;default:n=fu}return i=V_.bind(null,e),n=Zp(n,i),e.callbackPriority=t,e.callbackNode=n,t}return i!==null&&i!==null&&bd(i),e.callbackPriority=2,e.callbackNode=null,2}function V_(e,t){if(en!==0&&en!==5)return e.callbackNode=null,e.callbackPriority=0,null;var n=e.callbackNode;if(ju()&&e.callbackNode!==n)return null;var i=Jt;return i=zu(e,e===_e?i:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),i===0?null:(w_(e,i,t),H_(e,Qn()),e.callbackNode!=null&&e.callbackNode===n?V_.bind(null,e):null)}function Ky(e,t){if(ju())return null;w_(e,t,!0)}function UT(){GT(function(){(oe&6)!==0?Zp(wx,LT):k_()})}function Om(){if(Qs===0){var e=Yr;e===0&&(e=Dc,Dc<<=1,(Dc&261888)===0&&(Dc=256)),Qs=e}return Qs}function Jy(e){return e==null||typeof e=="symbol"||typeof e=="boolean"?null:typeof e=="function"?e:Kc(""+e)}function Qy(e,t){var n=t.ownerDocument.createElement("input");return n.name=t.name,n.value=t.value,e.id&&n.setAttribute("form",e.id),t.parentNode.insertBefore(n,t),e=new FormData(e),n.parentNode.removeChild(n),e}function OT(e,t,n,i,s){if(t==="submit"&&n&&n.stateNode===s){var a=Jy((s[Hn]||null).action),r=i.submitter;r&&(t=(t=r[Hn]||null)?Jy(t.formAction):r.getAttribute("formAction"),t!==null&&(a=t,r=null));var o=new Fu("action","action",null,i,s);e.push({event:o,listeners:[{instance:null,listener:function(){if(i.defaultPrevented){if(Qs!==0){var l=r?Qy(s,r):new FormData(s);Ep(n,{pending:!0,data:l,method:s.method,action:a},null,l)}}else typeof a=="function"&&(o.preventDefault(),l=r?Qy(s,r):new FormData(s),Ep(n,{pending:!0,data:l,method:s.method,action:a},a,l))},currentTarget:s}]})}}for(Gc=0;Gc<dp.length;Gc++)Wc=dp[Gc],jy=Wc.toLowerCase(),$y=Wc[0].toUpperCase()+Wc.slice(1),Ni(jy,"on"+$y);var Wc,jy,$y,Gc;Ni(tv,"onAnimationEnd");Ni(ev,"onAnimationIteration");Ni(nv,"onAnimationStart");Ni("dblclick","onDoubleClick");Ni("focusin","onFocus");Ni("focusout","onBlur");Ni(jM,"onTransitionRun");Ni($M,"onTransitionStart");Ni(tT,"onTransitionCancel");Ni(iv,"onTransitionEnd");Xr("onMouseEnter",["mouseout","mouseover"]);Xr("onMouseLeave",["mouseout","mouseover"]);Xr("onPointerEnter",["pointerout","pointerover"]);Xr("onPointerLeave",["pointerout","pointerover"]);Ka("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));Ka("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));Ka("onBeforeInput",["compositionend","keypress","textInput","paste"]);Ka("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));Ka("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));Ka("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Sl="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),IT=new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(Sl));function G_(e,t){t=(t&4)!==0;for(var n=0;n<e.length;n++){var i=e[n],s=i.event;i=i.listeners;t:{var a=void 0;if(t)for(var r=i.length-1;0<=r;r--){var o=i[r],l=o.instance,c=o.currentTarget;if(o=o.listener,l!==a&&s.isPropagationStopped())break t;a=o,s.currentTarget=c;try{a(s)}catch(u){pu(u)}s.currentTarget=null,a=l}else for(r=0;r<i.length;r++){if(o=i[r],l=o.instance,c=o.currentTarget,o=o.listener,l!==a&&s.isPropagationStopped())break t;a=o,s.currentTarget=c;try{a(s)}catch(u){pu(u)}s.currentTarget=null,a=l}}}}function Yt(e,t){var n=t[ap];n===void 0&&(n=t[ap]=new Set);var i=e+"__bubble";n.has(i)||(W_(t,e,2,!1),n.add(i))}function Yd(e,t,n){var i=0;t&&(i|=4),W_(n,e,i,t)}var Xc="_reactListening"+Math.random().toString(36).slice(2);function Im(e){if(!e[Xc]){e[Xc]=!0,Ix.forEach(function(n){n!=="selectionchange"&&(IT.has(n)||Yd(n,!1,e),Yd(n,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[Xc]||(t[Xc]=!0,Yd("selectionchange",!1,t))}}function W_(e,t,n,i){switch(ib(t)){case 2:var s=cE;break;case 8:s=uE;break;default:s=Fm}n=s.bind(null,t,n,e),s=void 0,!up||t!=="touchstart"&&t!=="touchmove"&&t!=="wheel"||(s=!0),i?s!==void 0?e.addEventListener(t,n,{capture:!0,passive:s}):e.addEventListener(t,n,!0):s!==void 0?e.addEventListener(t,n,{passive:s}):e.addEventListener(t,n,!1)}function Zd(e,t,n,i,s){var a=i;if((t&1)===0&&(t&2)===0&&i!==null)t:for(;;){if(i===null)return;var r=i.tag;if(r===3||r===4){var o=i.stateNode.containerInfo;if(o===s)break;if(r===4)for(r=i.return;r!==null;){var l=r.tag;if((l===3||l===4)&&r.stateNode.containerInfo===s)return;r=r.return}for(;o!==null;){if(r=wr(o),r===null)return;if(l=r.tag,l===5||l===6||l===26||l===27){i=a=r;continue t}o=o.parentNode}}i=i.return}Gx(function(){var c=a,u=$p(n),f=[];t:{var h=sv.get(e);if(h!==void 0){var d=Fu,m=e;switch(e){case"keypress":if(Qc(n)===0)break t;case"keydown":case"keyup":d=NM;break;case"focusin":m="focus",d=Ad;break;case"focusout":m="blur",d=Ad;break;case"beforeblur":case"afterblur":d=Ad;break;case"click":if(n.button===2)break t;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":d=ry;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":d=xM;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":d=UM;break;case tv:case ev:case nv:d=bM;break;case iv:d=IM;break;case"scroll":case"scrollend":d=gM;break;case"wheel":d=BM;break;case"copy":case"cut":case"paste":d=MM;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":d=ly;break;case"toggle":case"beforetoggle":d=FM}var b=(t&4)!==0,g=!b&&(e==="scroll"||e==="scrollend"),p=b?h!==null?h+"Capture":null:h;b=[];for(var y=c,S;y!==null;){var v=y;if(S=v.stateNode,v=v.tag,v!==5&&v!==26&&v!==27||S===null||p===null||(v=pl(y,p),v!=null&&b.push(Ml(y,v,S))),g)break;y=y.return}0<b.length&&(h=new d(h,m,null,n,u),f.push({event:h,listeners:b}))}}if((t&7)===0){t:{if(h=e==="mouseover"||e==="pointerover",d=e==="mouseout"||e==="pointerout",h&&n!==cp&&(m=n.relatedTarget||n.fromElement)&&(wr(m)||m[eo]))break t;if((d||h)&&(h=u.window===u?u:(h=u.ownerDocument)?h.defaultView||h.parentWindow:window,d?(m=n.relatedTarget||n.toElement,d=c,m=m?wr(m):null,m!==null&&(g=wl(m),b=m.tag,m!==g||b!==5&&b!==27&&b!==6)&&(m=null)):(d=null,m=c),d!==m)){if(b=ry,v="onMouseLeave",p="onMouseEnter",y="mouse",(e==="pointerout"||e==="pointerover")&&(b=ly,v="onPointerLeave",p="onPointerEnter",y="pointer"),g=d==null?h:Qo(d),S=m==null?h:Qo(m),h=new b(v,y+"leave",d,n,u),h.target=g,h.relatedTarget=S,v=null,wr(u)===c&&(b=new b(p,y+"enter",m,n,u),b.target=S,b.relatedTarget=g,v=b),g=v,d&&m)e:{for(b=PT,p=d,y=m,S=0,v=p;v;v=b(v))S++;v=0;for(var T=y;T;T=b(T))v++;for(;0<S-v;)p=b(p),S--;for(;0<v-S;)y=b(y),v--;for(;S--;){if(p===y||y!==null&&p===y.alternate){b=p;break e}p=b(p),y=b(y)}b=null}else b=null;d!==null&&tx(f,h,d,b,!1),m!==null&&g!==null&&tx(f,g,m,b,!0)}}t:{if(h=c?Qo(c):window,d=h.nodeName&&h.nodeName.toLowerCase(),d==="select"||d==="input"&&h.type==="file")var E=fy;else if(hy(h))if(Kx)E=KM;else{E=YM;var C=qM}else d=h.nodeName,!d||d.toLowerCase()!=="input"||h.type!=="checkbox"&&h.type!=="radio"?c&&jp(c.elementType)&&(E=fy):E=ZM;if(E&&(E=E(e,c))){Zx(f,E,n,u);break t}C&&C(e,h,c),e==="focusout"&&c&&h.type==="number"&&c.memoizedProps.value!=null&&lp(h,"number",h.value)}switch(C=c?Qo(c):window,e){case"focusin":(hy(C)||C.contentEditable==="true")&&(Nr=C,hp=c,nl=null);break;case"focusout":nl=hp=Nr=null;break;case"mousedown":fp=!0;break;case"contextmenu":case"mouseup":case"dragend":fp=!1,gy(f,n,u);break;case"selectionchange":if(QM)break;case"keydown":case"keyup":gy(f,n,u)}var _;if(nm)t:{switch(e){case"compositionstart":var A="onCompositionStart";break t;case"compositionend":A="onCompositionEnd";break t;case"compositionupdate":A="onCompositionUpdate";break t}A=void 0}else Rr?qx(e,n)&&(A="onCompositionEnd"):e==="keydown"&&n.keyCode===229&&(A="onCompositionStart");A&&(Xx&&n.locale!=="ko"&&(Rr||A!=="onCompositionStart"?A==="onCompositionEnd"&&Rr&&(_=Wx()):(Zs=u,tm="value"in Zs?Zs.value:Zs.textContent,Rr=!0)),C=Du(c,A),0<C.length&&(A=new oy(A,e,null,n,u),f.push({event:A,listeners:C}),_?A.data=_:(_=Yx(n),_!==null&&(A.data=_)))),(_=HM?VM(e,n):GM(e,n))&&(A=Du(c,"onBeforeInput"),0<A.length&&(C=new oy("onBeforeInput","beforeinput",null,n,u),f.push({event:C,listeners:A}),C.data=_)),OT(f,e,c,n,u)}G_(f,t)})}function Ml(e,t,n){return{instance:e,listener:t,currentTarget:n}}function Du(e,t){for(var n=t+"Capture",i=[];e!==null;){var s=e,a=s.stateNode;if(s=s.tag,s!==5&&s!==26&&s!==27||a===null||(s=pl(e,n),s!=null&&i.unshift(Ml(e,s,a)),s=pl(e,t),s!=null&&i.push(Ml(e,s,a))),e.tag===3)return i;e=e.return}return[]}function PT(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5&&e.tag!==27);return e||null}function tx(e,t,n,i,s){for(var a=t._reactName,r=[];n!==null&&n!==i;){var o=n,l=o.alternate,c=o.stateNode;if(o=o.tag,l!==null&&l===i)break;o!==5&&o!==26&&o!==27||c===null||(l=c,s?(c=pl(n,a),c!=null&&r.unshift(Ml(n,c,l))):s||(c=pl(n,a),c!=null&&r.push(Ml(n,c,l)))),n=n.return}r.length!==0&&e.push({event:t,listeners:r})}var BT=/\r\n?/g,zT=/\u0000|\uFFFD/g;function ex(e){return(typeof e=="string"?e:""+e).replace(BT,`
`).replace(zT,"")}function X_(e,t){return t=ex(t),ex(e)===t}function ye(e,t,n,i,s,a){switch(n){case"children":typeof i=="string"?t==="body"||t==="textarea"&&i===""||qr(e,i):(typeof i=="number"||typeof i=="bigint")&&t!=="body"&&qr(e,""+i);break;case"className":Oc(e,"class",i);break;case"tabIndex":Oc(e,"tabindex",i);break;case"dir":case"role":case"viewBox":case"width":case"height":Oc(e,n,i);break;case"style":Vx(e,i,a);break;case"data":if(t!=="object"){Oc(e,"data",i);break}case"src":case"href":if(i===""&&(t!=="a"||n!=="href")){e.removeAttribute(n);break}if(i==null||typeof i=="function"||typeof i=="symbol"||typeof i=="boolean"){e.removeAttribute(n);break}i=Kc(""+i),e.setAttribute(n,i);break;case"action":case"formAction":if(typeof i=="function"){e.setAttribute(n,"javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");break}else typeof a=="function"&&(n==="formAction"?(t!=="input"&&ye(e,t,"name",s.name,s,null),ye(e,t,"formEncType",s.formEncType,s,null),ye(e,t,"formMethod",s.formMethod,s,null),ye(e,t,"formTarget",s.formTarget,s,null)):(ye(e,t,"encType",s.encType,s,null),ye(e,t,"method",s.method,s,null),ye(e,t,"target",s.target,s,null)));if(i==null||typeof i=="symbol"||typeof i=="boolean"){e.removeAttribute(n);break}i=Kc(""+i),e.setAttribute(n,i);break;case"onClick":i!=null&&(e.onclick=ys);break;case"onScroll":i!=null&&Yt("scroll",e);break;case"onScrollEnd":i!=null&&Yt("scrollend",e);break;case"dangerouslySetInnerHTML":if(i!=null){if(typeof i!="object"||!("__html"in i))throw Error($(61));if(n=i.__html,n!=null){if(s.children!=null)throw Error($(60));e.innerHTML=n}}break;case"multiple":e.multiple=i&&typeof i!="function"&&typeof i!="symbol";break;case"muted":e.muted=i&&typeof i!="function"&&typeof i!="symbol";break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"defaultValue":case"defaultChecked":case"innerHTML":case"ref":break;case"autoFocus":break;case"xlinkHref":if(i==null||typeof i=="function"||typeof i=="boolean"||typeof i=="symbol"){e.removeAttribute("xlink:href");break}n=Kc(""+i),e.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",n);break;case"contentEditable":case"spellCheck":case"draggable":case"value":case"autoReverse":case"externalResourcesRequired":case"focusable":case"preserveAlpha":i!=null&&typeof i!="function"&&typeof i!="symbol"?e.setAttribute(n,""+i):e.removeAttribute(n);break;case"inert":case"allowFullScreen":case"async":case"autoPlay":case"controls":case"default":case"defer":case"disabled":case"disablePictureInPicture":case"disableRemotePlayback":case"formNoValidate":case"hidden":case"loop":case"noModule":case"noValidate":case"open":case"playsInline":case"readOnly":case"required":case"reversed":case"scoped":case"seamless":case"itemScope":i&&typeof i!="function"&&typeof i!="symbol"?e.setAttribute(n,""):e.removeAttribute(n);break;case"capture":case"download":i===!0?e.setAttribute(n,""):i!==!1&&i!=null&&typeof i!="function"&&typeof i!="symbol"?e.setAttribute(n,i):e.removeAttribute(n);break;case"cols":case"rows":case"size":case"span":i!=null&&typeof i!="function"&&typeof i!="symbol"&&!isNaN(i)&&1<=i?e.setAttribute(n,i):e.removeAttribute(n);break;case"rowSpan":case"start":i==null||typeof i=="function"||typeof i=="symbol"||isNaN(i)?e.removeAttribute(n):e.setAttribute(n,i);break;case"popover":Yt("beforetoggle",e),Yt("toggle",e),Zc(e,"popover",i);break;case"xlinkActuate":cs(e,"http://www.w3.org/1999/xlink","xlink:actuate",i);break;case"xlinkArcrole":cs(e,"http://www.w3.org/1999/xlink","xlink:arcrole",i);break;case"xlinkRole":cs(e,"http://www.w3.org/1999/xlink","xlink:role",i);break;case"xlinkShow":cs(e,"http://www.w3.org/1999/xlink","xlink:show",i);break;case"xlinkTitle":cs(e,"http://www.w3.org/1999/xlink","xlink:title",i);break;case"xlinkType":cs(e,"http://www.w3.org/1999/xlink","xlink:type",i);break;case"xmlBase":cs(e,"http://www.w3.org/XML/1998/namespace","xml:base",i);break;case"xmlLang":cs(e,"http://www.w3.org/XML/1998/namespace","xml:lang",i);break;case"xmlSpace":cs(e,"http://www.w3.org/XML/1998/namespace","xml:space",i);break;case"is":Zc(e,"is",i);break;case"innerText":case"textContent":break;default:(!(2<n.length)||n[0]!=="o"&&n[0]!=="O"||n[1]!=="n"&&n[1]!=="N")&&(n=pM.get(n)||n,Zc(e,n,i))}}function Pp(e,t,n,i,s,a){switch(n){case"style":Vx(e,i,a);break;case"dangerouslySetInnerHTML":if(i!=null){if(typeof i!="object"||!("__html"in i))throw Error($(61));if(n=i.__html,n!=null){if(s.children!=null)throw Error($(60));e.innerHTML=n}}break;case"children":typeof i=="string"?qr(e,i):(typeof i=="number"||typeof i=="bigint")&&qr(e,""+i);break;case"onScroll":i!=null&&Yt("scroll",e);break;case"onScrollEnd":i!=null&&Yt("scrollend",e);break;case"onClick":i!=null&&(e.onclick=ys);break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"innerHTML":case"ref":break;case"innerText":case"textContent":break;default:if(!Px.hasOwnProperty(n))t:{if(n[0]==="o"&&n[1]==="n"&&(s=n.endsWith("Capture"),t=n.slice(2,s?n.length-7:void 0),a=e[Hn]||null,a=a!=null?a[n]:null,typeof a=="function"&&e.removeEventListener(t,a,s),typeof i=="function")){typeof a!="function"&&a!==null&&(n in e?e[n]=null:e.hasAttribute(n)&&e.removeAttribute(n)),e.addEventListener(t,i,s);break t}n in e?e[n]=i:i===!0?e.setAttribute(n,""):Zc(e,n,i)}}}function xn(e,t,n){switch(t){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"img":Yt("error",e),Yt("load",e);var i=!1,s=!1,a;for(a in n)if(n.hasOwnProperty(a)){var r=n[a];if(r!=null)switch(a){case"src":i=!0;break;case"srcSet":s=!0;break;case"children":case"dangerouslySetInnerHTML":throw Error($(137,t));default:ye(e,t,a,r,n,null)}}s&&ye(e,t,"srcSet",n.srcSet,n,null),i&&ye(e,t,"src",n.src,n,null);return;case"input":Yt("invalid",e);var o=a=r=s=null,l=null,c=null;for(i in n)if(n.hasOwnProperty(i)){var u=n[i];if(u!=null)switch(i){case"name":s=u;break;case"type":r=u;break;case"checked":l=u;break;case"defaultChecked":c=u;break;case"value":a=u;break;case"defaultValue":o=u;break;case"children":case"dangerouslySetInnerHTML":if(u!=null)throw Error($(137,t));break;default:ye(e,t,i,u,n,null)}}Fx(e,a,o,l,c,r,s,!1);return;case"select":Yt("invalid",e),i=r=a=null;for(s in n)if(n.hasOwnProperty(s)&&(o=n[s],o!=null))switch(s){case"value":a=o;break;case"defaultValue":r=o;break;case"multiple":i=o;default:ye(e,t,s,o,n,null)}t=a,n=r,e.multiple=!!i,t!=null?zr(e,!!i,t,!1):n!=null&&zr(e,!!i,n,!0);return;case"textarea":Yt("invalid",e),a=s=i=null;for(r in n)if(n.hasOwnProperty(r)&&(o=n[r],o!=null))switch(r){case"value":i=o;break;case"defaultValue":s=o;break;case"children":a=o;break;case"dangerouslySetInnerHTML":if(o!=null)throw Error($(91));break;default:ye(e,t,r,o,n,null)}Hx(e,i,s,a);return;case"option":for(l in n)n.hasOwnProperty(l)&&(i=n[l],i!=null)&&(l==="selected"?e.selected=i&&typeof i!="function"&&typeof i!="symbol":ye(e,t,l,i,n,null));return;case"dialog":Yt("beforetoggle",e),Yt("toggle",e),Yt("cancel",e),Yt("close",e);break;case"iframe":case"object":Yt("load",e);break;case"video":case"audio":for(i=0;i<Sl.length;i++)Yt(Sl[i],e);break;case"image":Yt("error",e),Yt("load",e);break;case"details":Yt("toggle",e);break;case"embed":case"source":case"link":Yt("error",e),Yt("load",e);case"area":case"base":case"br":case"col":case"hr":case"keygen":case"meta":case"param":case"track":case"wbr":case"menuitem":for(c in n)if(n.hasOwnProperty(c)&&(i=n[c],i!=null))switch(c){case"children":case"dangerouslySetInnerHTML":throw Error($(137,t));default:ye(e,t,c,i,n,null)}return;default:if(jp(t)){for(u in n)n.hasOwnProperty(u)&&(i=n[u],i!==void 0&&Pp(e,t,u,i,n,void 0));return}}for(o in n)n.hasOwnProperty(o)&&(i=n[o],i!=null&&ye(e,t,o,i,n,null))}function FT(e,t,n,i){switch(t){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"input":var s=null,a=null,r=null,o=null,l=null,c=null,u=null;for(d in n){var f=n[d];if(n.hasOwnProperty(d)&&f!=null)switch(d){case"checked":break;case"value":break;case"defaultValue":l=f;default:i.hasOwnProperty(d)||ye(e,t,d,null,i,f)}}for(var h in i){var d=i[h];if(f=n[h],i.hasOwnProperty(h)&&(d!=null||f!=null))switch(h){case"type":a=d;break;case"name":s=d;break;case"checked":c=d;break;case"defaultChecked":u=d;break;case"value":r=d;break;case"defaultValue":o=d;break;case"children":case"dangerouslySetInnerHTML":if(d!=null)throw Error($(137,t));break;default:d!==f&&ye(e,t,h,d,i,f)}}op(e,r,o,l,c,u,a,s);return;case"select":d=r=o=h=null;for(a in n)if(l=n[a],n.hasOwnProperty(a)&&l!=null)switch(a){case"value":break;case"multiple":d=l;default:i.hasOwnProperty(a)||ye(e,t,a,null,i,l)}for(s in i)if(a=i[s],l=n[s],i.hasOwnProperty(s)&&(a!=null||l!=null))switch(s){case"value":h=a;break;case"defaultValue":o=a;break;case"multiple":r=a;default:a!==l&&ye(e,t,s,a,i,l)}t=o,n=r,i=d,h!=null?zr(e,!!n,h,!1):!!i!=!!n&&(t!=null?zr(e,!!n,t,!0):zr(e,!!n,n?[]:"",!1));return;case"textarea":d=h=null;for(o in n)if(s=n[o],n.hasOwnProperty(o)&&s!=null&&!i.hasOwnProperty(o))switch(o){case"value":break;case"children":break;default:ye(e,t,o,null,i,s)}for(r in i)if(s=i[r],a=n[r],i.hasOwnProperty(r)&&(s!=null||a!=null))switch(r){case"value":h=s;break;case"defaultValue":d=s;break;case"children":break;case"dangerouslySetInnerHTML":if(s!=null)throw Error($(91));break;default:s!==a&&ye(e,t,r,s,i,a)}kx(e,h,d);return;case"option":for(var m in n)h=n[m],n.hasOwnProperty(m)&&h!=null&&!i.hasOwnProperty(m)&&(m==="selected"?e.selected=!1:ye(e,t,m,null,i,h));for(l in i)h=i[l],d=n[l],i.hasOwnProperty(l)&&h!==d&&(h!=null||d!=null)&&(l==="selected"?e.selected=h&&typeof h!="function"&&typeof h!="symbol":ye(e,t,l,h,i,d));return;case"img":case"link":case"area":case"base":case"br":case"col":case"embed":case"hr":case"keygen":case"meta":case"param":case"source":case"track":case"wbr":case"menuitem":for(var b in n)h=n[b],n.hasOwnProperty(b)&&h!=null&&!i.hasOwnProperty(b)&&ye(e,t,b,null,i,h);for(c in i)if(h=i[c],d=n[c],i.hasOwnProperty(c)&&h!==d&&(h!=null||d!=null))switch(c){case"children":case"dangerouslySetInnerHTML":if(h!=null)throw Error($(137,t));break;default:ye(e,t,c,h,i,d)}return;default:if(jp(t)){for(var g in n)h=n[g],n.hasOwnProperty(g)&&h!==void 0&&!i.hasOwnProperty(g)&&Pp(e,t,g,void 0,i,h);for(u in i)h=i[u],d=n[u],!i.hasOwnProperty(u)||h===d||h===void 0&&d===void 0||Pp(e,t,u,h,i,d);return}}for(var p in n)h=n[p],n.hasOwnProperty(p)&&h!=null&&!i.hasOwnProperty(p)&&ye(e,t,p,null,i,h);for(f in i)h=i[f],d=n[f],!i.hasOwnProperty(f)||h===d||h==null&&d==null||ye(e,t,f,h,i,d)}function nx(e){switch(e){case"css":case"script":case"font":case"img":case"image":case"input":case"link":return!0;default:return!1}}function kT(){if(typeof performance.getEntriesByType=="function"){for(var e=0,t=0,n=performance.getEntriesByType("resource"),i=0;i<n.length;i++){var s=n[i],a=s.transferSize,r=s.initiatorType,o=s.duration;if(a&&o&&nx(r)){for(r=0,o=s.responseEnd,i+=1;i<n.length;i++){var l=n[i],c=l.startTime;if(c>o)break;var u=l.transferSize,f=l.initiatorType;u&&nx(f)&&(l=l.responseEnd,r+=u*(l<o?1:(o-c)/(l-c)))}if(--i,t+=8*(a+r)/(s.duration/1e3),e++,10<e)break}}if(0<e)return t/e/1e6}return navigator.connection&&(e=navigator.connection.downlink,typeof e=="number")?e:5}var Bp=null,zp=null;function Lu(e){return e.nodeType===9?e:e.ownerDocument}function ix(e){switch(e){case"http://www.w3.org/2000/svg":return 1;case"http://www.w3.org/1998/Math/MathML":return 2;default:return 0}}function q_(e,t){if(e===0)switch(t){case"svg":return 1;case"math":return 2;default:return 0}return e===1&&t==="foreignObject"?0:e}function Fp(e,t){return e==="textarea"||e==="noscript"||typeof t.children=="string"||typeof t.children=="number"||typeof t.children=="bigint"||typeof t.dangerouslySetInnerHTML=="object"&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var Kd=null;function HT(){var e=window.event;return e&&e.type==="popstate"?e===Kd?!1:(Kd=e,!0):(Kd=null,!1)}var Y_=typeof setTimeout=="function"?setTimeout:void 0,VT=typeof clearTimeout=="function"?clearTimeout:void 0,sx=typeof Promise=="function"?Promise:void 0,GT=typeof queueMicrotask=="function"?queueMicrotask:typeof sx<"u"?function(e){return sx.resolve(null).then(e).catch(WT)}:Y_;function WT(e){setTimeout(function(){throw e})}function fa(e){return e==="head"}function ax(e,t){var n=t,i=0;do{var s=n.nextSibling;if(e.removeChild(n),s&&s.nodeType===8)if(n=s.data,n==="/$"||n==="/&"){if(i===0){e.removeChild(s),to(t);return}i--}else if(n==="$"||n==="$?"||n==="$~"||n==="$!"||n==="&")i++;else if(n==="html")fl(e.ownerDocument.documentElement);else if(n==="head"){n=e.ownerDocument.head,fl(n);for(var a=n.firstChild;a;){var r=a.nextSibling,o=a.nodeName;a[Dl]||o==="SCRIPT"||o==="STYLE"||o==="LINK"&&a.rel.toLowerCase()==="stylesheet"||n.removeChild(a),a=r}}else n==="body"&&fl(e.ownerDocument.body);n=s}while(n);to(t)}function rx(e,t){var n=e;e=0;do{var i=n.nextSibling;if(n.nodeType===1?t?(n._stashedDisplay=n.style.display,n.style.display="none"):(n.style.display=n._stashedDisplay||"",n.getAttribute("style")===""&&n.removeAttribute("style")):n.nodeType===3&&(t?(n._stashedText=n.nodeValue,n.nodeValue=""):n.nodeValue=n._stashedText||""),i&&i.nodeType===8)if(n=i.data,n==="/$"){if(e===0)break;e--}else n!=="$"&&n!=="$?"&&n!=="$~"&&n!=="$!"||e++;n=i}while(n)}function kp(e){var t=e.firstChild;for(t&&t.nodeType===10&&(t=t.nextSibling);t;){var n=t;switch(t=t.nextSibling,n.nodeName){case"HTML":case"HEAD":case"BODY":kp(n),Qp(n);continue;case"SCRIPT":case"STYLE":continue;case"LINK":if(n.rel.toLowerCase()==="stylesheet")continue}e.removeChild(n)}}function XT(e,t,n,i){for(;e.nodeType===1;){var s=n;if(e.nodeName.toLowerCase()!==t.toLowerCase()){if(!i&&(e.nodeName!=="INPUT"||e.type!=="hidden"))break}else if(i){if(!e[Dl])switch(t){case"meta":if(!e.hasAttribute("itemprop"))break;return e;case"link":if(a=e.getAttribute("rel"),a==="stylesheet"&&e.hasAttribute("data-precedence"))break;if(a!==s.rel||e.getAttribute("href")!==(s.href==null||s.href===""?null:s.href)||e.getAttribute("crossorigin")!==(s.crossOrigin==null?null:s.crossOrigin)||e.getAttribute("title")!==(s.title==null?null:s.title))break;return e;case"style":if(e.hasAttribute("data-precedence"))break;return e;case"script":if(a=e.getAttribute("src"),(a!==(s.src==null?null:s.src)||e.getAttribute("type")!==(s.type==null?null:s.type)||e.getAttribute("crossorigin")!==(s.crossOrigin==null?null:s.crossOrigin))&&a&&e.hasAttribute("async")&&!e.hasAttribute("itemprop"))break;return e;default:return e}}else if(t==="input"&&e.type==="hidden"){var a=s.name==null?null:""+s.name;if(s.type==="hidden"&&e.getAttribute("name")===a)return e}else return e;if(e=xi(e.nextSibling),e===null)break}return null}function qT(e,t,n){if(t==="")return null;for(;e.nodeType!==3;)if((e.nodeType!==1||e.nodeName!=="INPUT"||e.type!=="hidden")&&!n||(e=xi(e.nextSibling),e===null))return null;return e}function Z_(e,t){for(;e.nodeType!==8;)if((e.nodeType!==1||e.nodeName!=="INPUT"||e.type!=="hidden")&&!t||(e=xi(e.nextSibling),e===null))return null;return e}function Hp(e){return e.data==="$?"||e.data==="$~"}function Vp(e){return e.data==="$!"||e.data==="$?"&&e.ownerDocument.readyState!=="loading"}function YT(e,t){var n=e.ownerDocument;if(e.data==="$~")e._reactRetry=t;else if(e.data!=="$?"||n.readyState!=="loading")t();else{var i=function(){t(),n.removeEventListener("DOMContentLoaded",i)};n.addEventListener("DOMContentLoaded",i),e._reactRetry=i}}function xi(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t==="$"||t==="$!"||t==="$?"||t==="$~"||t==="&"||t==="F!"||t==="F")break;if(t==="/$"||t==="/&")return null}}return e}var Gp=null;function ox(e){e=e.nextSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="/$"||n==="/&"){if(t===0)return xi(e.nextSibling);t--}else n!=="$"&&n!=="$!"&&n!=="$?"&&n!=="$~"&&n!=="&"||t++}e=e.nextSibling}return null}function lx(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="$"||n==="$!"||n==="$?"||n==="$~"||n==="&"){if(t===0)return e;t--}else n!=="/$"&&n!=="/&"||t++}e=e.previousSibling}return null}function K_(e,t,n){switch(t=Lu(n),e){case"html":if(e=t.documentElement,!e)throw Error($(452));return e;case"head":if(e=t.head,!e)throw Error($(453));return e;case"body":if(e=t.body,!e)throw Error($(454));return e;default:throw Error($(451))}}function fl(e){for(var t=e.attributes;t.length;)e.removeAttributeNode(t[0]);Qp(e)}var vi=new Map,cx=new Set;function Uu(e){return typeof e.getRootNode=="function"?e.getRootNode():e.nodeType===9?e:e.ownerDocument}var ws=le.d;le.d={f:ZT,r:KT,D:JT,C:QT,L:jT,m:$T,X:eE,S:tE,M:nE};function ZT(){var e=ws.f(),t=Ju();return e||t}function KT(e){var t=no(e);t!==null&&t.tag===5&&t.type==="form"?Vv(t):ws.r(e)}var ro=typeof document>"u"?null:document;function J_(e,t,n){var i=ro;if(i&&typeof t=="string"&&t){var s=pi(t);s='link[rel="'+e+'"][href="'+s+'"]',typeof n=="string"&&(s+='[crossorigin="'+n+'"]'),cx.has(s)||(cx.add(s),e={rel:e,crossOrigin:n,href:t},i.querySelector(s)===null&&(t=i.createElement("link"),xn(t,"link",e),un(t),i.head.appendChild(t)))}}function JT(e){ws.D(e),J_("dns-prefetch",e,null)}function QT(e,t){ws.C(e,t),J_("preconnect",e,t)}function jT(e,t,n){ws.L(e,t,n);var i=ro;if(i&&e&&t){var s='link[rel="preload"][as="'+pi(t)+'"]';t==="image"&&n&&n.imageSrcSet?(s+='[imagesrcset="'+pi(n.imageSrcSet)+'"]',typeof n.imageSizes=="string"&&(s+='[imagesizes="'+pi(n.imageSizes)+'"]')):s+='[href="'+pi(e)+'"]';var a=s;switch(t){case"style":a=$r(e);break;case"script":a=oo(e)}vi.has(a)||(e=Re({rel:"preload",href:t==="image"&&n&&n.imageSrcSet?void 0:e,as:t},n),vi.set(a,e),i.querySelector(s)!==null||t==="style"&&i.querySelector(Bl(a))||t==="script"&&i.querySelector(zl(a))||(t=i.createElement("link"),xn(t,"link",e),un(t),i.head.appendChild(t)))}}function $T(e,t){ws.m(e,t);var n=ro;if(n&&e){var i=t&&typeof t.as=="string"?t.as:"script",s='link[rel="modulepreload"][as="'+pi(i)+'"][href="'+pi(e)+'"]',a=s;switch(i){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":a=oo(e)}if(!vi.has(a)&&(e=Re({rel:"modulepreload",href:e},t),vi.set(a,e),n.querySelector(s)===null)){switch(i){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":if(n.querySelector(zl(a)))return}i=n.createElement("link"),xn(i,"link",e),un(i),n.head.appendChild(i)}}}function tE(e,t,n){ws.S(e,t,n);var i=ro;if(i&&e){var s=Br(i).hoistableStyles,a=$r(e);t=t||"default";var r=s.get(a);if(!r){var o={loading:0,preload:null};if(r=i.querySelector(Bl(a)))o.loading=5;else{e=Re({rel:"stylesheet",href:e,"data-precedence":t},n),(n=vi.get(a))&&Pm(e,n);var l=r=i.createElement("link");un(l),xn(l,"link",e),l._p=new Promise(function(c,u){l.onload=c,l.onerror=u}),l.addEventListener("load",function(){o.loading|=1}),l.addEventListener("error",function(){o.loading|=2}),o.loading|=4,au(r,t,i)}r={type:"stylesheet",instance:r,count:1,state:o},s.set(a,r)}}}function eE(e,t){ws.X(e,t);var n=ro;if(n&&e){var i=Br(n).hoistableScripts,s=oo(e),a=i.get(s);a||(a=n.querySelector(zl(s)),a||(e=Re({src:e,async:!0},t),(t=vi.get(s))&&Bm(e,t),a=n.createElement("script"),un(a),xn(a,"link",e),n.head.appendChild(a)),a={type:"script",instance:a,count:1,state:null},i.set(s,a))}}function nE(e,t){ws.M(e,t);var n=ro;if(n&&e){var i=Br(n).hoistableScripts,s=oo(e),a=i.get(s);a||(a=n.querySelector(zl(s)),a||(e=Re({src:e,async:!0,type:"module"},t),(t=vi.get(s))&&Bm(e,t),a=n.createElement("script"),un(a),xn(a,"link",e),n.head.appendChild(a)),a={type:"script",instance:a,count:1,state:null},i.set(s,a))}}function ux(e,t,n,i){var s=(s=js.current)?Uu(s):null;if(!s)throw Error($(446));switch(e){case"meta":case"title":return null;case"style":return typeof n.precedence=="string"&&typeof n.href=="string"?(t=$r(n.href),n=Br(s).hoistableStyles,i=n.get(t),i||(i={type:"style",instance:null,count:0,state:null},n.set(t,i)),i):{type:"void",instance:null,count:0,state:null};case"link":if(n.rel==="stylesheet"&&typeof n.href=="string"&&typeof n.precedence=="string"){e=$r(n.href);var a=Br(s).hoistableStyles,r=a.get(e);if(r||(s=s.ownerDocument||s,r={type:"stylesheet",instance:null,count:0,state:{loading:0,preload:null}},a.set(e,r),(a=s.querySelector(Bl(e)))&&!a._p&&(r.instance=a,r.state.loading=5),vi.has(e)||(n={rel:"preload",as:"style",href:n.href,crossOrigin:n.crossOrigin,integrity:n.integrity,media:n.media,hrefLang:n.hrefLang,referrerPolicy:n.referrerPolicy},vi.set(e,n),a||iE(s,e,n,r.state))),t&&i===null)throw Error($(528,""));return r}if(t&&i!==null)throw Error($(529,""));return null;case"script":return t=n.async,n=n.src,typeof n=="string"&&t&&typeof t!="function"&&typeof t!="symbol"?(t=oo(n),n=Br(s).hoistableScripts,i=n.get(t),i||(i={type:"script",instance:null,count:0,state:null},n.set(t,i)),i):{type:"void",instance:null,count:0,state:null};default:throw Error($(444,e))}}function $r(e){return'href="'+pi(e)+'"'}function Bl(e){return'link[rel="stylesheet"]['+e+"]"}function Q_(e){return Re({},e,{"data-precedence":e.precedence,precedence:null})}function iE(e,t,n,i){e.querySelector('link[rel="preload"][as="style"]['+t+"]")?i.loading=1:(t=e.createElement("link"),i.preload=t,t.addEventListener("load",function(){return i.loading|=1}),t.addEventListener("error",function(){return i.loading|=2}),xn(t,"link",n),un(t),e.head.appendChild(t))}function oo(e){return'[src="'+pi(e)+'"]'}function zl(e){return"script[async]"+e}function hx(e,t,n){if(t.count++,t.instance===null)switch(t.type){case"style":var i=e.querySelector('style[data-href~="'+pi(n.href)+'"]');if(i)return t.instance=i,un(i),i;var s=Re({},n,{"data-href":n.href,"data-precedence":n.precedence,href:null,precedence:null});return i=(e.ownerDocument||e).createElement("style"),un(i),xn(i,"style",s),au(i,n.precedence,e),t.instance=i;case"stylesheet":s=$r(n.href);var a=e.querySelector(Bl(s));if(a)return t.state.loading|=4,t.instance=a,un(a),a;i=Q_(n),(s=vi.get(s))&&Pm(i,s),a=(e.ownerDocument||e).createElement("link"),un(a);var r=a;return r._p=new Promise(function(o,l){r.onload=o,r.onerror=l}),xn(a,"link",i),t.state.loading|=4,au(a,n.precedence,e),t.instance=a;case"script":return a=oo(n.src),(s=e.querySelector(zl(a)))?(t.instance=s,un(s),s):(i=n,(s=vi.get(a))&&(i=Re({},n),Bm(i,s)),e=e.ownerDocument||e,s=e.createElement("script"),un(s),xn(s,"link",i),e.head.appendChild(s),t.instance=s);case"void":return null;default:throw Error($(443,t.type))}else t.type==="stylesheet"&&(t.state.loading&4)===0&&(i=t.instance,t.state.loading|=4,au(i,n.precedence,e));return t.instance}function au(e,t,n){for(var i=n.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'),s=i.length?i[i.length-1]:null,a=s,r=0;r<i.length;r++){var o=i[r];if(o.dataset.precedence===t)a=o;else if(a!==s)break}a?a.parentNode.insertBefore(e,a.nextSibling):(t=n.nodeType===9?n.head:n,t.insertBefore(e,t.firstChild))}function Pm(e,t){e.crossOrigin==null&&(e.crossOrigin=t.crossOrigin),e.referrerPolicy==null&&(e.referrerPolicy=t.referrerPolicy),e.title==null&&(e.title=t.title)}function Bm(e,t){e.crossOrigin==null&&(e.crossOrigin=t.crossOrigin),e.referrerPolicy==null&&(e.referrerPolicy=t.referrerPolicy),e.integrity==null&&(e.integrity=t.integrity)}var ru=null;function fx(e,t,n){if(ru===null){var i=new Map,s=ru=new Map;s.set(n,i)}else s=ru,i=s.get(n),i||(i=new Map,s.set(n,i));if(i.has(e))return i;for(i.set(e,null),n=n.getElementsByTagName(e),s=0;s<n.length;s++){var a=n[s];if(!(a[Dl]||a[mn]||e==="link"&&a.getAttribute("rel")==="stylesheet")&&a.namespaceURI!=="http://www.w3.org/2000/svg"){var r=a.getAttribute(t)||"";r=e+r;var o=i.get(r);o?o.push(a):i.set(r,[a])}}return i}function dx(e,t,n){e=e.ownerDocument||e,e.head.insertBefore(n,t==="title"?e.querySelector("head > title"):null)}function sE(e,t,n){if(n===1||t.itemProp!=null)return!1;switch(e){case"meta":case"title":return!0;case"style":if(typeof t.precedence!="string"||typeof t.href!="string"||t.href==="")break;return!0;case"link":if(typeof t.rel!="string"||typeof t.href!="string"||t.href===""||t.onLoad||t.onError)break;return t.rel==="stylesheet"?(e=t.disabled,typeof t.precedence=="string"&&e==null):!0;case"script":if(t.async&&typeof t.async!="function"&&typeof t.async!="symbol"&&!t.onLoad&&!t.onError&&t.src&&typeof t.src=="string")return!0}return!1}function j_(e){return!(e.type==="stylesheet"&&(e.state.loading&3)===0)}function aE(e,t,n,i){if(n.type==="stylesheet"&&(typeof i.media!="string"||matchMedia(i.media).matches!==!1)&&(n.state.loading&4)===0){if(n.instance===null){var s=$r(i.href),a=t.querySelector(Bl(s));if(a){t=a._p,t!==null&&typeof t=="object"&&typeof t.then=="function"&&(e.count++,e=Ou.bind(e),t.then(e,e)),n.state.loading|=4,n.instance=a,un(a);return}a=t.ownerDocument||t,i=Q_(i),(s=vi.get(s))&&Pm(i,s),a=a.createElement("link"),un(a);var r=a;r._p=new Promise(function(o,l){r.onload=o,r.onerror=l}),xn(a,"link",i),n.instance=a}e.stylesheets===null&&(e.stylesheets=new Map),e.stylesheets.set(n,t),(t=n.state.preload)&&(n.state.loading&3)===0&&(e.count++,n=Ou.bind(e),t.addEventListener("load",n),t.addEventListener("error",n))}}var Jd=0;function rE(e,t){return e.stylesheets&&e.count===0&&ou(e,e.stylesheets),0<e.count||0<e.imgCount?function(n){var i=setTimeout(function(){if(e.stylesheets&&ou(e,e.stylesheets),e.unsuspend){var a=e.unsuspend;e.unsuspend=null,a()}},6e4+t);0<e.imgBytes&&Jd===0&&(Jd=62500*kT());var s=setTimeout(function(){if(e.waitingForImages=!1,e.count===0&&(e.stylesheets&&ou(e,e.stylesheets),e.unsuspend)){var a=e.unsuspend;e.unsuspend=null,a()}},(e.imgBytes>Jd?50:800)+t);return e.unsuspend=n,function(){e.unsuspend=null,clearTimeout(i),clearTimeout(s)}}:null}function Ou(){if(this.count--,this.count===0&&(this.imgCount===0||!this.waitingForImages)){if(this.stylesheets)ou(this,this.stylesheets);else if(this.unsuspend){var e=this.unsuspend;this.unsuspend=null,e()}}}var Iu=null;function ou(e,t){e.stylesheets=null,e.unsuspend!==null&&(e.count++,Iu=new Map,t.forEach(oE,e),Iu=null,Ou.call(e))}function oE(e,t){if(!(t.state.loading&4)){var n=Iu.get(e);if(n)var i=n.get(null);else{n=new Map,Iu.set(e,n);for(var s=e.querySelectorAll("link[data-precedence],style[data-precedence]"),a=0;a<s.length;a++){var r=s[a];(r.nodeName==="LINK"||r.getAttribute("media")!=="not all")&&(n.set(r.dataset.precedence,r),i=r)}i&&n.set(null,i)}s=t.instance,r=s.getAttribute("data-precedence"),a=n.get(r)||i,a===i&&n.set(null,s),n.set(r,s),this.count++,i=Ou.bind(this),s.addEventListener("load",i),s.addEventListener("error",i),a?a.parentNode.insertBefore(s,a.nextSibling):(e=e.nodeType===9?e.head:e,e.insertBefore(s,e.firstChild)),t.state.loading|=4}}var Tl={$$typeof:gs,Provider:null,Consumer:null,_currentValue:Fa,_currentValue2:Fa,_threadCount:0};function lE(e,t,n,i,s,a,r,o,l){this.tag=1,this.containerInfo=e,this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.next=this.pendingContext=this.context=this.cancelPendingCommit=null,this.callbackPriority=0,this.expirationTimes=Sd(-1),this.entangledLanes=this.shellSuspendCounter=this.errorRecoveryDisabledLanes=this.expiredLanes=this.warmLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Sd(0),this.hiddenUpdates=Sd(null),this.identifierPrefix=i,this.onUncaughtError=s,this.onCaughtError=a,this.onRecoverableError=r,this.pooledCache=null,this.pooledCacheLanes=0,this.formState=l,this.incompleteTransitions=new Map}function $_(e,t,n,i,s,a,r,o,l,c,u,f){return e=new lE(e,t,n,r,l,c,u,f,o),t=1,a===!0&&(t|=24),a=Kn(3,null,null,t),e.current=a,a.stateNode=e,t=cm(),t.refCount++,e.pooledCache=t,t.refCount++,a.memoizedState={element:i,isDehydrated:n,cache:t},fm(a),e}function tb(e){return e?(e=Ur,e):Ur}function eb(e,t,n,i,s,a){s=tb(s),i.context===null?i.context=s:i.pendingContext=s,i=ta(t),i.payload={element:n},a=a===void 0?null:a,a!==null&&(i.callback=a),n=ea(e,i,t),n!==null&&(kn(n,e,t),sl(n,e,t))}function px(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var n=e.retryLane;e.retryLane=n!==0&&n<t?n:t}}function zm(e,t){px(e,t),(e=e.alternate)&&px(e,t)}function nb(e){if(e.tag===13||e.tag===31){var t=ja(e,67108864);t!==null&&kn(t,e,67108864),zm(e,67108864)}}function mx(e){if(e.tag===13||e.tag===31){var t=ti();t=Kp(t);var n=ja(e,t);n!==null&&kn(n,e,t),zm(e,t)}}var Pu=!0;function cE(e,t,n,i){var s=Ut.T;Ut.T=null;var a=le.p;try{le.p=2,Fm(e,t,n,i)}finally{le.p=a,Ut.T=s}}function uE(e,t,n,i){var s=Ut.T;Ut.T=null;var a=le.p;try{le.p=8,Fm(e,t,n,i)}finally{le.p=a,Ut.T=s}}function Fm(e,t,n,i){if(Pu){var s=Wp(i);if(s===null)Zd(e,t,i,Bu,n),gx(e,i);else if(fE(s,e,t,n,i))i.stopPropagation();else if(gx(e,i),t&4&&-1<hE.indexOf(e)){for(;s!==null;){var a=no(s);if(a!==null)switch(a.tag){case 3:if(a=a.stateNode,a.current.memoizedState.isDehydrated){var r=Pa(a.pendingLanes);if(r!==0){var o=a;for(o.pendingLanes|=2,o.entangledLanes|=2;r;){var l=1<<31-$n(r);o.entanglements[1]|=l,r&=~l}Qi(a),(oe&6)===0&&(Au=Qn()+500,Pl(0,!1))}}break;case 31:case 13:o=ja(a,2),o!==null&&kn(o,a,2),Ju(),zm(a,2)}if(a=Wp(i),a===null&&Zd(e,t,i,Bu,n),a===s)break;s=a}s!==null&&i.stopPropagation()}else Zd(e,t,i,null,n)}}function Wp(e){return e=$p(e),km(e)}var Bu=null;function km(e){if(Bu=null,e=wr(e),e!==null){var t=wl(e);if(t===null)e=null;else{var n=t.tag;if(n===13){if(e=Sx(t),e!==null)return e;e=null}else if(n===31){if(e=Mx(t),e!==null)return e;e=null}else if(n===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null)}}return Bu=e,null}function ib(e){switch(e){case"beforetoggle":case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"toggle":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 2;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 8;case"message":switch(j1()){case wx:return 2;case Cx:return 8;case fu:case $1:return 32;case Rx:return 268435456;default:return 32}default:return 32}}var Xp=!1,sa=null,aa=null,ra=null,El=new Map,Al=new Map,qs=[],hE="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");function gx(e,t){switch(e){case"focusin":case"focusout":sa=null;break;case"dragenter":case"dragleave":aa=null;break;case"mouseover":case"mouseout":ra=null;break;case"pointerover":case"pointerout":El.delete(t.pointerId);break;case"gotpointercapture":case"lostpointercapture":Al.delete(t.pointerId)}}function Yo(e,t,n,i,s,a){return e===null||e.nativeEvent!==a?(e={blockedOn:t,domEventName:n,eventSystemFlags:i,nativeEvent:a,targetContainers:[s]},t!==null&&(t=no(t),t!==null&&nb(t)),e):(e.eventSystemFlags|=i,t=e.targetContainers,s!==null&&t.indexOf(s)===-1&&t.push(s),e)}function fE(e,t,n,i,s){switch(t){case"focusin":return sa=Yo(sa,e,t,n,i,s),!0;case"dragenter":return aa=Yo(aa,e,t,n,i,s),!0;case"mouseover":return ra=Yo(ra,e,t,n,i,s),!0;case"pointerover":var a=s.pointerId;return El.set(a,Yo(El.get(a)||null,e,t,n,i,s)),!0;case"gotpointercapture":return a=s.pointerId,Al.set(a,Yo(Al.get(a)||null,e,t,n,i,s)),!0}return!1}function sb(e){var t=wr(e.target);if(t!==null){var n=wl(t);if(n!==null){if(t=n.tag,t===13){if(t=Sx(n),t!==null){e.blockedOn=t,$0(e.priority,function(){mx(n)});return}}else if(t===31){if(t=Mx(n),t!==null){e.blockedOn=t,$0(e.priority,function(){mx(n)});return}}else if(t===3&&n.stateNode.current.memoizedState.isDehydrated){e.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}e.blockedOn=null}function lu(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var n=Wp(e.nativeEvent);if(n===null){n=e.nativeEvent;var i=new n.constructor(n.type,n);cp=i,n.target.dispatchEvent(i),cp=null}else return t=no(n),t!==null&&nb(t),e.blockedOn=n,!1;t.shift()}return!0}function yx(e,t,n){lu(e)&&n.delete(t)}function dE(){Xp=!1,sa!==null&&lu(sa)&&(sa=null),aa!==null&&lu(aa)&&(aa=null),ra!==null&&lu(ra)&&(ra=null),El.forEach(yx),Al.forEach(yx)}function qc(e,t){e.blockedOn===t&&(e.blockedOn=null,Xp||(Xp=!0,nn.unstable_scheduleCallback(nn.unstable_NormalPriority,dE)))}var Yc=null;function xx(e){Yc!==e&&(Yc=e,nn.unstable_scheduleCallback(nn.unstable_NormalPriority,function(){Yc===e&&(Yc=null);for(var t=0;t<e.length;t+=3){var n=e[t],i=e[t+1],s=e[t+2];if(typeof i!="function"){if(km(i||n)===null)continue;break}var a=no(n);a!==null&&(e.splice(t,3),t-=3,Ep(a,{pending:!0,data:s,method:n.method,action:i},i,s))}}))}function to(e){function t(l){return qc(l,e)}sa!==null&&qc(sa,e),aa!==null&&qc(aa,e),ra!==null&&qc(ra,e),El.forEach(t),Al.forEach(t);for(var n=0;n<qs.length;n++){var i=qs[n];i.blockedOn===e&&(i.blockedOn=null)}for(;0<qs.length&&(n=qs[0],n.blockedOn===null);)sb(n),n.blockedOn===null&&qs.shift();if(n=(e.ownerDocument||e).$$reactFormReplay,n!=null)for(i=0;i<n.length;i+=3){var s=n[i],a=n[i+1],r=s[Hn]||null;if(typeof a=="function")r||xx(n);else if(r){var o=null;if(a&&a.hasAttribute("formAction")){if(s=a,r=a[Hn]||null)o=r.formAction;else if(km(s)!==null)continue}else o=r.action;typeof o=="function"?n[i+1]=o:(n.splice(i,3),i-=3),xx(n)}}}function ab(){function e(a){a.canIntercept&&a.info==="react-transition"&&a.intercept({handler:function(){return new Promise(function(r){return s=r})},focusReset:"manual",scroll:"manual"})}function t(){s!==null&&(s(),s=null),i||setTimeout(n,20)}function n(){if(!i&&!navigation.transition){var a=navigation.currentEntry;a&&a.url!=null&&navigation.navigate(a.url,{state:a.getState(),info:"react-transition",history:"replace"})}}if(typeof navigation=="object"){var i=!1,s=null;return navigation.addEventListener("navigate",e),navigation.addEventListener("navigatesuccess",t),navigation.addEventListener("navigateerror",t),setTimeout(n,100),function(){i=!0,navigation.removeEventListener("navigate",e),navigation.removeEventListener("navigatesuccess",t),navigation.removeEventListener("navigateerror",t),s!==null&&(s(),s=null)}}}function Hm(e){this._internalRoot=e}$u.prototype.render=Hm.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error($(409));var n=t.current,i=ti();eb(n,i,e,t,null,null)};$u.prototype.unmount=Hm.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;eb(e.current,2,null,e,null,null),Ju(),t[eo]=null}};function $u(e){this._internalRoot=e}$u.prototype.unstable_scheduleHydration=function(e){if(e){var t=Ox();e={blockedOn:null,target:e,priority:t};for(var n=0;n<qs.length&&t!==0&&t<qs[n].priority;n++);qs.splice(n,0,e),n===0&&sb(e)}};var vx=_x.version;if(vx!=="19.2.8")throw Error($(527,vx,"19.2.8"));le.findDOMNode=function(e){var t=e._reactInternals;if(t===void 0)throw typeof e.render=="function"?Error($(188)):(e=Object.keys(e).join(","),Error($(268,e)));return e=X1(t),e=e!==null?Tx(e):null,e=e===null?null:e.stateNode,e};var pE={bundleType:0,version:"19.2.8",rendererPackageName:"react-dom",currentDispatcherRef:Ut,reconcilerVersion:"19.2.8"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"&&(Zo=__REACT_DEVTOOLS_GLOBAL_HOOK__,!Zo.isDisabled&&Zo.supportsFiber))try{Cl=Zo.inject(pE),jn=Zo}catch{}var Zo;th.createRoot=function(e,t){if(!bx(e))throw Error($(299));var n=!1,i="",s=Jv,a=Qv,r=jv;return t!=null&&(t.unstable_strictMode===!0&&(n=!0),t.identifierPrefix!==void 0&&(i=t.identifierPrefix),t.onUncaughtError!==void 0&&(s=t.onUncaughtError),t.onCaughtError!==void 0&&(a=t.onCaughtError),t.onRecoverableError!==void 0&&(r=t.onRecoverableError)),t=$_(e,1,!1,null,null,n,i,null,s,a,r,ab),e[eo]=t.current,Im(e),new Hm(t)};th.hydrateRoot=function(e,t,n){if(!bx(e))throw Error($(299));var i=!1,s="",a=Jv,r=Qv,o=jv,l=null;return n!=null&&(n.unstable_strictMode===!0&&(i=!0),n.identifierPrefix!==void 0&&(s=n.identifierPrefix),n.onUncaughtError!==void 0&&(a=n.onUncaughtError),n.onCaughtError!==void 0&&(r=n.onCaughtError),n.onRecoverableError!==void 0&&(o=n.onRecoverableError),n.formState!==void 0&&(l=n.formState)),t=$_(e,1,!0,t,n??null,i,s,l,a,r,o,ab),t.context=tb(null),n=t.current,i=ti(),i=Kp(i),s=ta(i),s.callback=null,ea(n,s,i),n=i,t.current.lanes=n,Nl(t,n),Qi(t),e[eo]=t.current,Im(e),new $u(t)};th.version="19.2.8"});var cb=Wi((i3,lb)=>{"use strict";function ob(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(ob)}catch(e){console.error(e)}}ob(),lb.exports=rb()});var a1=Wi(td=>{"use strict";var XR=Symbol.for("react.transitional.element"),qR=Symbol.for("react.fragment");function s1(e,t,n){var i=null;if(n!==void 0&&(i=""+n),t.key!==void 0&&(i=""+t.key),"key"in t){n={};for(var s in t)s!=="key"&&(n[s]=t[s])}else n=t;return t=n.ref,{$$typeof:XR,type:e,key:i,ref:t!==void 0?t:null,props:n}}td.Fragment=qR;td.jsx=s1;td.jsxs=s1});var bc=Wi((OU,r1)=>{"use strict";r1.exports=a1()});var Le=Ua(Bo()),u1=Ua(cb());var Di={id:"retro-football",runtimeVersion:"0.11.0",rulesVersion:"exhibition-explicit-controls-v1",assetVersion:"football-chance-atlas-v2",simulationHz:60};var mE=["kick","tackle","save","whistle","ui","goal","result","menu","crowd"],eh=class{constructor(t=new URL("./audio/",import.meta.url)){this.base=t;this.status="locked";this.ctx=null;this.master=null;this.limiter=null;this.buffers=new Map;this.active=new Set;this.loop=null;this.mode="ready";this.settings={music:.4,sfx:.7};this.disposed=!1;this.generation=0;this.loading=null;this.played={};this.controller=new AbortController}unlock(){if(!(this.disposed||this.status==="unavailable"||this.mode==="hidden"))try{if(this.ctx||(this.ctx=new AudioContext,this.master=this.ctx.createGain(),this.master.gain.value=.38,this.limiter=this.ctx.createDynamicsCompressor(),this.limiter.threshold.value=-12,this.limiter.knee.value=8,this.limiter.ratio.value=12,this.limiter.attack.value=.003,this.limiter.release.value=.12,this.master.connect(this.limiter),this.limiter.connect(this.ctx.destination)),this.ctx.resume().catch(()=>this.fail()),!this.loading){this.status="loading";let t=this.ctx;this.loading=Promise.all(mE.map(async n=>{let i=await fetch(new URL(n+".wav",this.base),{signal:this.controller.signal});if(!i.ok)throw Error("Audio unavailable");let s=await t.decodeAudioData(await i.arrayBuffer());this.disposed||this.buffers.set(n,s)})).then(()=>{this.disposed||(this.status="ready",this.sync(this.mode,!0))}).catch(()=>{this.disposed||this.fail()})}}catch{this.fail()}}fail(){this.status="unavailable",this.stop()}play(t,n=!1){if(!this.ctx||!this.master||this.status!=="ready"||this.disposed)return null;let i=this.buffers.get(t),s=t==="menu"||t==="result"?this.settings.music:this.settings.sfx*(t==="crowd"?.32:1);if(!i||s===0||this.active.size>=4)return null;let a=this.ctx.createBufferSource(),r=this.ctx.createGain();return a.buffer=i,a.loop=n,r.gain.value=s,a.connect(r),r.connect(this.master),this.active.add(a),a.onended=()=>{this.active.delete(a),a.disconnect(),r.disconnect(),this.loop===a&&(this.loop=null)},a.start(),this.played[t]=(this.played[t]??0)+1,a}stop(){this.generation++;for(let t of this.active){try{t.stop()}catch{}t.disconnect()}this.active.clear(),this.loop=null}sync(t,n=!1){if(this.disposed||!n&&t===this.mode)return;let i=this.mode==="hidden"||this.mode==="paused";if(this.mode=t,this.stop(),t==="paused"||t==="hidden"){this.ctx?.suspend().catch(()=>{});return}this.ctx?.state==="suspended"&&this.ctx.resume().catch(()=>{}),t==="playing"?this.loop=this.play("crowd",!0):t==="ready"||t==="halftime"?(this.loop=this.play("menu",!0),t==="halftime"&&this.play("whistle")):t==="complete"&&!i&&(this.play("whistle"),this.play("result"))}event(t){if(this.mode!=="playing")return;let n=t.kind;n==="pass"||n==="shot"||n==="keeper-punt"?this.play("kick"):n==="tackle-contact"?this.play("tackle"):n==="save"?this.play("save"):n==="goal"?this.play("goal"):(n==="restart-awarded"||n==="second-half")&&this.play("whistle")}ui(){this.play("ui")}setSettings(t){this.settings={...t},this.mode==="complete"?this.stop():this.sync(this.mode,!0)}diagnostics(){return{status:this.status,active:this.active.size,context:this.ctx?.state??"none",played:{...this.played}}}dispose(){this.disposed||(this.disposed=!0,this.controller.abort(),this.stop(),this.buffers.clear(),this.master?.disconnect(),this.limiter?.disconnect(),this.ctx?.close().catch(()=>{}),this.status="disposed")}};var ne={centreX:125,lateralScale:13.4,keeperY:110,separation:105,basePlane:96};function ub(e,t){if(e.phase==="aim")return e.age<30?null:e.age<66?Math.floor((e.age-30)/6)%2?"entry-alt":"entry":"ready";let n=t.action?.kind==="shot"?t.action.age:99;return n<4?"ready":n<8?"windup":n<12?"plant":n<16?"contact":n<26?"follow":"recover"}var gE=(e,t)=>Math.hypot(e.x-t.x,e.y-t.y,e.z-t.z);function ji(e,t,n,i,s){let a={x:e.x-n.x,y:e.y-n.y,z:e.z-n.z},r={x:t.x-e.x-i.x+n.x,y:t.y-e.y-i.y+n.y,z:t.z-e.z-i.z+n.z},o=r.x*r.x+r.y*r.y+r.z*r.z,l=2*(a.x*r.x+a.y*r.y+a.z*r.z),c=a.x*a.x+a.y*a.y+a.z*a.z-s*s,u;if(c<=0)u=0;else{if(o<1e-12)return null;let m=l*l-4*o*c;if(m<0||(u=(-l-Math.sqrt(m))/(2*o),u<0||u>1))return null}let f=(m,b)=>({x:m.x+(b.x-m.x)*u,y:m.y+(b.y-m.y)*u,z:m.z+(b.z-m.z)*u}),h=f(e,t),d=f(n,i);return{fraction:u,anchor:h,ball:d,distance:gE(h,d)}}var He=1/60,fb=5400,tr=75,Ot={x:48,y:80,scaleX:23,scaleY:4.5,length:105,width:68,centreRadius:9.15,goalTop:27.5,goalBottom:40.5},er={width:Ot.x*2+Ot.length*Ot.scaleX,bottom:Ot.y+Ot.width*Ot.scaleY},Fl=.8,Cs={receive:6,boot:5,body:7,upper:5,punt:4},hb=new WeakMap;function kl(e){let t=hb.get(e);if(t)return t;let n=Math.round(e.width*Fl),i=Math.round(e.height*Fl),s=Object.fromEntries(Object.entries(e.anchors).map(([r,[o,l]])=>[r,[Math.round((o+.5)*n/e.width-.5),Math.round((l+.5)*i/e.height-.5)]])),a={...e,width:n,height:i,anchors:s};return hb.set(e,a),a}var Ne=(e,t,n)=>Math.max(t,Math.min(n,e)),Xe=e=>({x:Ot.x+e.x*Ot.scaleX,y:Ot.y+e.y*Ot.scaleY}),db=e=>{let t=Xe(e);return{x:Math.round(t.x),y:Math.round(t.y)}},Wt=e=>({x:e.x*Ot.scaleX,y:e.y*Ot.scaleY,z:e.z}),Li=e=>({x:e.x/Ot.scaleX,y:e.y/Ot.scaleY,z:e.z}),Pe=(e,t)=>Math.hypot(e.x-t.x,e.y-t.y),nr=(e,t)=>({x:ne.centreX+(e.y-34)*ne.lateralScale,y:t.planeY+(t.direction===-1?e.x:105-e.x)*t.depthScale,z:e.z}),Vm=(e,t)=>{let n=nr(e,t);return{x:n.x,y:n.y-n.z}},Gm=(e,t)=>({x:t.direction===1?105-(e.y-t.planeY)/t.depthScale:(e.y-t.planeY)/t.depthScale,y:34+(e.x-ne.centreX)/ne.lateralScale,z:e.z});var fn={maxCatchSpeed:29,maxVerticalSpeed:140,minimumHeight:6,maximumHeight:45,gripRadius:8,dropAge:80,puntAge:88,puntEnd:98,endAge:138,carrySpeed:1.8,gravity:280};function pb(e){return e<10?"standing-secure":e<46?"standing-tuck":e<58?"carry":e<70?"standing-tuck":e<80?"release-prep":e<88?"drop":e<98?"punt":e<110?"follow-through":e<120?"settle":"ready"}function mb(e,t,n){let i=Math.abs(t),s=Math.abs(n),a=e==="E"||e==="W";return i<1e-4&&s<1e-4?e:a&&s<=i*1.2?t>=0?"E":"W":!a&&i<=s*1.2?n>=0?"S":"N":i>=s?t>=0?"E":"W":n>=0?"S":"N"}function gb(e,t){let n=t.movement.cycles[e.facing],i=e.moving?n[Math.floor(((e.strideDistance??0)+1e-8)/.72)%n.length]:t.movement.idle[e.facing];return{pose:i.id,mirror:i.mirror}}var _i={width:384,height:224,lookAhead:22};function yb(e,t,n,i=_i.width){let s=(r,o,l)=>Math.max(o,Math.min(l,r)),a={x:s(e.x-i/2+s(t.x*.48,-_i.lookAhead,_i.lookAhead),0,er.width-i),y:s(e.y-113+s(t.y*.16,-10,10),-26,er.bottom+24-_i.height)};return{x:Math.round(n.x+(a.x-n.x)*.22),y:Math.round(n.y+(a.y-n.y)*.22)}}var yE=[{x:4,y:34},{x:24,y:10},{x:21,y:26},{x:21,y:42},{x:24,y:58},{x:43,y:10},{x:40,y:26},{x:40,y:42},{x:43,y:58},{x:62,y:25},{x:62,y:43}],xE=[["tackle-windup",8],["tackle-entry",12],["tackle-slide",8],["tackle-follow",8],["tackle-sit",8],["tackle-crouch",6],["tackle-rise",6],["tackle-recover-ready",8],["compress",6],["settle",6],["ready",8]],da=e=>e===0?1:0,ih=class{constructor(t,n={}){this.assets=t;this.options=n;this.viewportWidth=384;this.poses=new Map(t.records.map(i=>[i.id,i])),this.state=this.initial(1),this.formation(0)}setViewportWidth(t){let n=Ne(Math.round(t),320,640);this.state.camera.x=Ne(this.state.camera.x+(this.viewportWidth-n)/2,0,er.width-n),this.viewportWidth=n}initial(t){return{aerial:null,shotView:null,airContacts:[0,0],airCollections:[0,0],status:"ready",phase:"restart",tick:0,eventSerial:0,round:t,seed:4811,half:1,halfTicks:0,score:[0,0],players:[],selected:9,owner:null,ball:{x:52.5,y:34,z:0,vx:0,vy:0,vz:0},lastTouch:0,lastKicker:null,releaseTick:-999,restart:null,goalAge:0,held:{left:!1,right:!1,up:!1,down:!1},inputSources:{left:[],right:[],up:[],down:[]},events:[],message:"Two 90-second halves. Harbour attacks right first. Start exhibition.",passes:[0,0],shots:[0,0],saves:[0,0],possessionTicks:[0,0],camera:{x:Xe({x:52.5,y:34}).x-this.viewportWidth/2,y:Xe({x:52.5,y:34}).y-113},pendingKickoff:0,noDoubleTouch:null,lastContact:null}}attack(t){return t===0==(this.state.half===1)?1:-1}emit(t,n={}){let i=this.state,s={kind:t,tick:i.tick,sequence:++i.eventSerial,...n};i.events.push(s),i.events.length>80&&i.events.shift(),i.lastContact=s}random(){let t=this.state.seed;return t^=t<<13,t^=t>>>17,t^=t<<5,this.state.seed=t>>>0,this.state.seed/4294967296}clear(){let t=this.state;for(let n of["left","right","up","down"])t.held[n]=!1,t.inputSources[n]=[]}restart(){this.state=this.initial(this.state.round+1),this.formation(0)}snapshot(){return structuredClone(this.state)}formation(t){let n=this.state;n.players=[];for(let s of[0,1])for(let a=0;a<11;a++){let r=yE[a],o=this.attack(s),l=o===1?r.x:105-r.x;a>0&&(l=s===t?o===1?Math.min(l,48):Math.max(l,57):o===1?Math.min(l,42):Math.max(l,63));let c={x:o===1?r.x:105-r.x,y:r.y};n.players.push({id:s*11+a,team:s,role:a===0?"keeper":"outfield",slot:a,x:l,y:r.y,facing:o===1?"E":"W",moving:!1,motionAge:0,home:c,action:null,cooldown:0,decisionTick:n.tick+20+a*5})}let i=(s,a,r,o)=>{let l=n.players[s*11+a];l.x=this.attack(s)===1?r:105-r,l.y=o};i(t,9,52.5,34),i(t,10,48.5,34),i(t,5,48.2,26),i(da(t),5,47,22),i(da(t),8,52,58),n.selected=9}setBall(t){Object.assign(this.state.ball,t,{vx:0,vy:0,vz:0})}beginRestart(t,n,i){let s=this.state;this.exitShotView("restart"),s.aerial=null,this.clear(),s.phase="restart",s.owner=null,s.noDoubleTouch=null;for(let l of s.players)l.action=null,delete l.keeperCycle,delete l.contactView,delete l.aiCarryY,l.moving=!1;let r=s.players.filter(l=>l.team===n&&(t==="goal-kick"?l.role==="keeper":l.role==="outfield")).sort((l,c)=>Pe(l,i)-Pe(c,i)||l.id-c.id)[0],o=i;s.restart={kind:t,team:n,point:{...o},taker:r.id,age:0},r.x=o.x,r.y=o.y,r.cooldown=0,r.facing=this.attack(n)===1?"E":"W";for(let l of s.players){if(l===r)continue;let c=Pe(l,o),u=l.team!==n?t==="kickoff"?10:9.15:4;if(c<u){let f=Math.atan2(l.y-o.y,l.x-o.x);l.x=Ne(o.x+Math.cos(f)*u,2,103),l.y=Ne(o.y+Math.sin(f)*u,2,66)}t==="goal-kick"&&l.team!==n&&(l.x=this.attack(n)===1?Math.max(19,l.x):Math.min(86,l.x))}n===0&&(s.selected=r.id),this.setBall({...o,z:0}),s.message=`${t.toUpperCase()} \u2014 ${n===0?"Harbour: P pass / L loft / S shoot":"Orchard preparing"}.`,this.emit("restart-awarded",{restart:t,team:n,point:{...i},player:r.id})}kickoff(t){this.formation(t),this.beginRestart("kickoff",t,{x:52.5,y:34})}command(t){let n=this.state;if(t.type==="clear"){this.clear();return}if(t.type==="pause"){n.status==="playing"?(n.status="paused",this.clear()):n.status==="paused"&&(n.status="playing");return}if(t.type==="resume"){n.status==="paused"&&(n.status="playing");return}if(t.type==="start"){n.status==="ready"?(n.status="playing",this.kickoff(0)):n.status==="halftime"&&(n.half=2,n.halfTicks=0,n.status="playing",this.kickoff(1),this.emit("second-half"),n.message="Second half \u2014 Harbour attacks LEFT. Orchard kickoff.");return}if(t.type==="next"){n.status==="complete"&&this.restart();return}if(n.status!=="playing")return;if(t.type==="hold"){if(t.value&&n.shotView&&n.shotView.phase!=="aim")return;let s=n.inputSources[t.key];t.value&&!s.includes(t.source)&&s.push(t.source),t.value||(n.inputSources[t.key]=s.filter(a=>a!==t.source)),n.held[t.key]=n.inputSources[t.key].length>0;return}if(n.phase==="goal")return;let i=n.players[n.selected];if(["pass","loft","shoot","tackle","switch","slide"].includes(t.type)){if(n.shotView?.phase==="aim"){t.type==="shoot"&&this.confirmChance();return}if(n.shotView)return;if(n.phase==="restart"){n.restart?.team===0&&!i.action&&this.takeRestart(t.type==="loft",t.type==="shoot");return}if(t.type==="switch"){n.owner!==n.selected&&this.command({type:"C"});return}if(i.action||i.keeperCycle||i.cooldown>0)return;n.owner===i.id?t.type==="pass"?this.kick(i,"pass"):t.type==="loft"?this.kick(i,"loft"):t.type==="shoot"&&(this.canChance(i)?this.beginChance(i):this.kick(i,"shot")):t.type==="tackle"?n.owner===null&&n.aerial?.controlledBy===null?this.control(i):this.tackle(i,"standing"):t.type==="slide"&&this.tackle(i,"slide");return}if(n.shotView?.phase==="aim"){t.type==="A"&&this.confirmChance();return}if(!n.shotView){if(n.phase==="restart"){if(n.restart.team!==0||i.action)return;this.takeRestart(t.type==="B");return}if(!(i.action||i.keeperCycle||i.cooldown>0))if(n.owner===i.id)t.type==="A"?this.attackProgress(i)>70&&this.canChance(i)?this.beginChance(i):this.kick(i,this.attackProgress(i)>70?"shot":"pass"):this.kick(i,t.type==="B"?"loft":"pass",t.type==="C");else if(t.type==="C"){let s=n.players.filter(r=>r.team===0&&r.role==="outfield"&&!r.action).sort((r,o)=>Pe(r,n.ball)-Pe(o,n.ball)||r.id-o.id),a=s.findIndex(r=>r.id===n.selected);n.selected=s[(a+1)%Math.min(3,s.length)].id}else t.type==="A"&&n.owner===null&&n.aerial?.controlledBy===null?this.control(i):(t.type==="A"||t.type==="B")&&this.tackle(i)}}attackingControls(){let t=this.state;return!!t.shotView||t.phase==="restart"&&t.restart?.team===0||t.owner===t.selected}shootPrompt(){let t=this.state,n=t.players[t.selected];return t.status==="playing"&&t.phase==="open"&&!t.shotView&&t.owner===n.id&&!n.action&&n.cooldown===0&&this.attackProgress(n)>70}attackProgress(t){return this.attack(t.team)===1?t.x:105-t.x}primaryAction(){let t=this.state,n=t.players[t.selected];return t.shotView?.phase==="aim"?"SHOOT":t.shotView?"SHOT":t.phase==="restart"?t.restart?.kind==="throw-in"?"THROW":"KICK":t.owner===n.id?this.attackProgress(n)>70?this.canChance(n)?"CHANCE":"SHOOT":"PASS":t.owner===null&&t.aerial?.controlledBy===null?"CONTROL":"TACKLE"}secondaryAction(){let t=this.state;return t.shotView?"WATCH":t.phase==="restart"?t.restart?.kind==="throw-in"?"THROW":"LOFT":t.owner===t.selected?"LOFT":"SLIDE"}tertiaryAction(){let t=this.state;return t.shotView?"WATCH":t.phase==="restart"?"KICK":t.owner===t.selected?"SHORT":"SWITCH"}target(t,n=!1){let i=this.state,s=this.attack(t.team),a=this.direction(),r=t.team===0&&t.id===i.selected&&Pe(a,{x:0,y:0})>.1;return i.players.filter(o=>o.team===t.team&&o.role==="outfield"&&o.id!==t.id&&!o.action).sort((o,l)=>{let c=u=>{let f=Pe(t,u),h=(u.x-t.x)/Math.max(1,f),d=(u.y-t.y)/Math.max(1,f);return f*(n?1.4:.35)-(r?(h*a.x+d*a.y)*18:(u.x-t.x)*s*.6)};return c(o)-c(l)||o.id-l.id})[0]}direction(){let t=this.state.held,n=Number(t.right)-Number(t.left),i=Number(t.down)-Number(t.up),s=Math.hypot(n,i);return s?{x:n/s,y:i/s}:{x:0,y:0}}kick(t,n,i=!1,s){if(t.action||t.cooldown>0||this.state.owner!==t.id)return;if(n==="shot"&&!this.state.shotView&&this.canChance(t)){this.beginChance(t,!1);return}let a=this.state.shotView,r=n==="shot"?{x:this.attack(t.team)===1?108:-3,y:a&&a.shooter===t.id?34+(a.aim.x-ne.centreX)/ne.lateralScale:Ne(34+(t.team===0&&t.id===this.state.selected&&this.state.held.up?-6:t.team===0&&t.id===this.state.selected&&this.state.held.down?6:(this.random()-.5)*5),28,40)}:s??this.target(t,i);t.action={kind:n,age:0,target:{x:r.x,y:r.y},targetPlayer:"id"in r?r.id:void 0,released:!1,hit:!1,direction:{x:this.attack(t.team),y:0}},t.facing=this.attack(t.team)===1?"E":"W"}takeRestart(t=!1,n=!1){let i=this.state,s=i.restart,a=i.players[s.taker],r=this.target(a,!0),o=s.kind!=="throw-in"&&(s.kind==="penalty"||n);a.action={kind:s.kind==="throw-in"?"throw":o?"shot":t?"loft":"pass",age:0,target:o?{x:this.attack(a.team)===1?108:-3,y:34}:{x:r.x,y:r.y},released:!1,hit:!1,direction:{x:this.attack(a.team),y:0}}}tackle(t,n="slide"){if(t.role==="keeper"||t.action||t.cooldown>0)return;let i=this.direction(),s=t.team===0&&t.id===this.state.selected&&Pe(i,{x:0,y:0})>.1?i:{x:nh(this.state.ball.x-t.x),y:0};t.facing=s.x>=0?"E":"W",t.action={tackleStyle:n,kind:"tackle",age:0,target:{x:0,y:0},released:!1,hit:!1,direction:{x:s.x>=0?1:-1,y:0}}}view(t){let n,i=!1,s=t.action;if(t.contactView)return t.contactView.view;if(t.role==="keeper"){if(t.keeperCycle)return{pose:"keeper-"+pb(t.keeperCycle.age),mirror:this.attack(t.team)<0};let a=this.state.shotView;if(a?.keeper===t.id)return{pose:Math.abs(a.aim.x-ne.centreX)>=26?a.age<30?"keeper-01":"keeper-03":"keeper-00",mirror:a.aim.x<ne.centreX};let r=this.state.ball.vx*this.attack(t.team)<-8&&Math.abs(this.state.ball.x-t.x)<20;if(this.options.keeperCatches!==!1&&this.poses.has("keeper-reach")&&!a){let o=this.state.ball;if(Math.hypot(o.vx,o.vy)<=fn.maxCatchSpeed&&o.z>=fn.minimumHeight&&o.z<=fn.maximumHeight&&o.vx*this.attack(t.team)<-1&&Math.abs(o.x-t.x)<18)return{pose:"keeper-reach",mirror:this.attack(t.team)<0};if(!r)return{pose:"keeper-ready",mirror:this.attack(t.team)<0}}return n=r&&this.state.ball.z<24?"keeper-03":"keeper-00",i=n==="keeper-03"?this.attack(t.team)<0:this.attack(t.team)>0,{pose:n,mirror:i}}if(s?.kind==="tackle"){let a=s.age;n="ready";for(let[r,o]of s.tackleStyle==="standing"?[["compress",8],["settle",8],["ready",14]]:xE){if(a<o){n=r;break}a-=o}i=s.direction.x<0}else if(s?.kind==="control")n=s.age<20?"signal":s.age<28?"crouch":s.age<(s.tackleStyle==="standing"?16:36)?"compress":s.age<44?"settle":"ready",i=s.direction.x>0;else if(s?.kind==="stagger")n=s.age<6?"crouch":s.age<12?"compress":s.age<18?"settle":"ready",i=s.direction.x>0;else if(s?.kind==="throw")n=s.age<4?"throw-hold":s.age<12?"throw-overhead":s.age<18?"throw-release":"throw-follow",i=s.target.x<t.x;else if(s)n=s.age<12?"kick-prep":s.age<18?"kick-contact":s.age<26?"kick-follow":"settle",i=s.target.x<t.x;else{let a=gb(t,this.assets);n=a.pose,i=a.mirror}return{pose:t.team===1?"orchard-"+n:n,mirror:i}}anchor(t,n="foot",i=this.view(t)){let s=this.poses.get(i.pose),r=this.state.shotView?.keeper===t.id&&(n==="leftHand"||n==="rightHand")?s:kl(s),[o,l]=r.anchors.ground,c=r.anchors[n]??r.anchors.boot??r.anchors.foot??r.anchors.ground,u=db(t);return this.state.shotView?.keeper===t.id&&(n==="leftHand"||n==="rightHand")?{x:t.x,y:(Math.round(ne.centreX+(t.y-34)*ne.lateralScale)+(i.mirror?o-c[0]-1:c[0]-o)-ne.centreX)/ne.lateralScale+34,z:Math.max(0,l-c[1])}:{x:(u.x-Ot.x+(i.mirror?o-c[0]-1:c[0]-o))/Ot.scaleX,y:(u.y-Ot.y)/Ot.scaleY,z:Math.max(0,l-c[1])}}throwAnchor(t){return this.anchor(t,"ball")}attach(t){let n=this.anchor(t,t.keeperCycle&&!t.keeperCycle.dropped||t.action?.kind==="throw"?"ball":"foot");this.setBall(n)}canSecure(t,n,i){let s=this.state;if(this.options.keeperCatches===!1||s.shotView||s.owner!==null||t.keeperCycle||!this.poses.has("keeper-standing-secure")||i.vx*this.attack(t.team)>=-1||Math.hypot(i.vx,i.vy)>fn.maxCatchSpeed||Math.abs(i.vz)>fn.maxVerticalSpeed||n.z<fn.minimumHeight||n.z>fn.maximumHeight)return!1;let a=this.anchor(t,"ball",{pose:"keeper-standing-secure",mirror:this.attack(t.team)<0});return Math.hypot((a.x-n.x)*Ot.scaleX,(a.y-n.y)*Ot.scaleY,a.z-n.z)<=fn.gripRadius}secureKeeper(t,n){let i=this.state;t.keeperCycle={age:0,dropped:!1,punted:!1,releaseTick:-1},t.action=null,delete t.contactView,t.cooldown=0,t.moving=!1,i.owner=t.id,i.aerial=null,i.noDoubleTouch=null,i.lastTouch=t.team,i.lastKicker=t.id,i.releaseTick=i.tick,i.saves[t.team]++,this.attach(t),this.emit("keeper-secure",{player:t.id,team:t.team,worldBall:{...n},resolvedGrip:{...i.ball},pose:this.view(t).pose}),i.message="CAUGHT - keeper preparing distribution."}advanceKeeper(t){let n=this.state,i=t.keeperCycle;if(i.age++,t.moving=!1,!i.dropped&&n.owner!==t.id){delete t.keeperCycle,t.cooldown=24,this.emit("keeper-hold-interrupted",{player:t.id});return}if(i.dropped&&!i.punted&&(n.owner!==null||n.lastKicker!==t.id)){delete t.keeperCycle,t.cooldown=24,this.emit("keeper-drop-interrupted",{player:t.id});return}if(i.age>=46&&i.age<58&&!i.dropped&&this.move(t,{x:t.x+this.attack(t.team),y:t.y},fn.carrySpeed),i.age===fn.dropAge){let s={...n.ball},a={pose:"keeper-punt",mirror:this.attack(t.team)<0},r=this.anchor(t,"kickingFoot",a),o={...r,x:r.x+this.attack(t.team)*3/Ot.scaleX},l=fn.puntAge-fn.dropAge+1,c=Math.pow(.995,.5),u=He*(1-Math.pow(c,l))/(1-c);n.owner=null,n.aerial=null,i.dropped=!0,i.releaseTick=n.tick,n.lastTouch=t.team,n.lastKicker=t.id,n.releaseTick=n.tick,n.ball.vx=(o.x-s.x)/u,n.ball.vy=(o.y-s.y)/u,n.ball.vz=(o.z-s.z+fn.gravity*He*He*l*(l-1)/2)/(l*He),this.emit("keeper-drop",{player:t.id,team:t.team,worldPoint:s,target:o,pose:"keeper-release-prep"}),n.message="Keeper drop - ball in play."}i.age===fn.puntEnd&&!i.punted&&(this.emit("keeper-punt-missed",{player:t.id}),n.message="Loose ball - keeper missed distribution."),i.age>=fn.endAge&&(delete t.keeperCycle,t.cooldown=1,this.emit("keeper-recovered",{player:t.id}))}puntKeeper(t,n){let i=this.state,s=t.keeperCycle;s.punted=!0,this.setBall(n);let a=this.target(t),r=a.x-n.x,o=a.y-n.y,l=Math.max(.5,Math.hypot(r,o));i.ball.vx=r/l*25,i.ball.vy=o/l*25,i.ball.vz=80,i.owner=null,i.aerial=null,i.lastTouch=t.team,i.lastKicker=t.id,i.releaseTick=i.tick,i.passes[t.team]++,this.emit("keeper-punt",{player:t.id,team:t.team,targetPlayer:a.id,worldPoint:n,pose:this.view(t).pose,anchor:"kickingFoot"}),i.message="Keeper distribution - play on."}release(t,n){let i=this.state;if(i.owner!==t.id&&!(i.phase==="restart"&&i.restart?.taker===t.id)){n.cancelled=!0,this.emit("delivery-cancelled",{player:t.id,reason:"possession-lost"});return}let s=n.kind==="throw"?this.throwAnchor(t):this.anchor(t);this.setBall(s);let a=n.target.x-s.x,r=n.target.y-s.y,o=Math.max(.5,Math.hypot(a,r)),l=n.kind==="shot"?31:n.kind==="loft"?23:22;n.kind==="throw"&&(l=14);let c=o/l;if(i.ball.vx=a/o*l,i.ball.vy=r/o*l,i.ball.vz=n.kind==="loft"?Math.min(230,c*140):n.kind==="throw"?30:n.kind==="shot"?60:0,i.owner=null,i.aerial=null,n.kind==="loft"&&this.loft(t,n,s),n.kind==="shot"&&i.shotView?.shooter===t.id){let u=i.shotView;u.phase="flight",u.age=0;let f=this.attack(t.team)===1?105-s.x:s.x,h=Math.max(1,Math.ceil(f/Math.max(.01,Math.abs(i.ball.vx))/He)),d=Math.pow(.995,.5),m=He*(1-Math.pow(d,h))/(1-d),b=h*He,g=this.attack(t.team)===1?105:-0,p=34+(u.aim.x-ne.centreX)/ne.lateralScale;i.ball.vx=(g-s.x)/m,i.ball.vy=(p-s.y)/m,i.ball.vz=(u.planeY-u.aim.y-s.z+140*b*b)/b}else n.kind!=="shot"&&this.exitShotView("delivery");i.lastTouch=t.team,i.lastKicker=t.id,i.releaseTick=i.tick,n.released=!0,n.kind==="shot"?i.shots[t.team]++:i.passes[t.team]++,i.phase==="restart"&&(i.phase="open",i.restart=null,i.noDoubleTouch=t.id),this.emit(n.kind==="shot"?"shot":"pass",{player:t.id,team:t.team,pose:this.view(t).pose,mirror:this.view(t).mirror,anchor:n.kind==="throw"?"ball":"foot",worldPoint:{...s},delivery:n.kind,point:Xe(s)}),i.message=n.kind==="shot"?"SHOT \u2014 keeper and rebound in play.":"Ball in play \u2014 move to receive, S to switch."}move(t,n,i){n={x:Ne(n.x,1,104),y:Ne(n.y,1,67)};let s=Pe(t,n),a=Math.min(s,i*He),r=t.moving;if(t.moving=s>.1,!t.moving)return;r?t.motionAge++:t.motionAge=0;let o=(n.x-t.x)/s,l=(n.y-t.y)/s;t.strideDistance=r?(t.strideDistance??0)+a:0,t.x+=o*a,t.y+=l*a,t.facing=mb(t.facing,o,l)}forecastCarrier(t,n){let i=t.moving&&!t.action&&this.state.shotView?.shooter!==t.id,s=i?{x:t.facing==="E"?7.2:t.facing==="W"?-7.2:0,y:t.facing==="S"?7.2:t.facing==="N"?-7.2:0}:{x:0,y:0},a={...t,x:Ne(t.x+s.x*n*He,1,104),y:Ne(t.y+s.y*n*He,1,67),motionAge:t.motionAge+(i?n:0)};return a.action&&(a.action={...a.action,age:a.action.age+n}),a.contactView&&a.contactView.ticks<=n&&delete a.contactView,a}pressurePoint(t,n){let s=n.moving&&!n.action&&(n.facing==="E"||n.facing==="W")?n.facing==="E"?1:-1:nh(this.state.ball.x-t.x),a=kl(this.poses.get(t.team===0?"tackle-entry":"orchard-tackle-entry")),r=a.anchors.ground,o=a.anchors.boot,l=(s<0?r[0]-o[0]-1:o[0]-r[0])/Ot.scaleX,c=this.anchor(this.forecastCarrier(n,8));return{x:c.x-l-s*9*He,y:c.y}}challengeLooksReachable(t,n){let i=nh(this.state.ball.x-t.x),s=a=>{let r={...t,x:Ne(t.x+i*Math.max(0,a-7)*9*He,Math.min(1,t.x),Math.max(104,t.x)),action:{kind:"tackle",age:a,target:{x:0,y:0},released:!1,hit:!1,direction:{x:i,y:0}}};return r.contactView&&r.contactView.ticks<=a&&delete r.contactView,r};for(let a=8;a<20;a++){let r=s(a-1),o=s(a),l=this.forecastCarrier(n,a-1),c=this.forecastCarrier(n,a),u=ji(Wt(this.anchor(r)),Wt(this.anchor(o)),Wt(this.anchor(l)),Wt(this.anchor(c)),Cs.boot),f=ji(Wt({...r,z:0}),Wt({...o,z:0}),Wt({...l,z:0}),Wt({...c,z:0}),Cs.body);if(f&&(!u||f.fraction<u.fraction))return!1;if(u)return!0}return!1}openOutlet(t){let n=this.state.players.filter(a=>a.team!==t.team),i=this.attack(t.team),s=this.state.players.filter(a=>a.team===t.team&&a.role==="outfield"&&a.id!==t.id&&!a.action&&a.cooldown<=0).flatMap(a=>{let r=a.x-t.x,o=a.y-t.y,l=Math.hypot(r,o),c=r*i;if(l<5||l>32||c<2)return[];let u=Math.min(...n.map(h=>Pe(h,a)));return u<3?[]:n.some(h=>{let d=((h.x-t.x)*r+(h.y-t.y)*o)/(l*l);return d>.12&&d<.92&&Math.hypot(h.x-t.x-r*d,h.y-t.y-o*d)<2.4})?[]:[{player:a,score:c*.8-l*.15+Math.min(u,8)*.4}]});return s.sort((a,r)=>r.score-a.score||a.player.id-r.player.id),s[0]?.player}ai(t){let n=this.state;if(t.action||t.cooldown>0)return;let i=n.shotView;if(i?.keeper===t.id){if(t.moving=!1,i.phase==="flight"&&i.age>16){let h=this.poses.get(this.view(t).pose),d=h.anchors.ground,m=h.anchors[Math.abs(i.aim.x-ne.centreX)>=26?"leftHand":"rightHand"],b=i.aim.x<ne.centreX?d[0]-m[0]-1:m[0]-d[0];this.move(t,{x:t.x,y:Ne(34+(i.aim.x-b-ne.centreX)/ne.lateralScale,25,43)},39/ne.lateralScale)}return}if(n.aerial&&n.aerial.controlledBy===null&&n.owner===null){let h=n.ball,d=this.anchor(t,"upperTorso",{pose:t.team===0?"signal":"orchard-signal",mirror:h.x>t.x}),m={x:h.x+h.vx*.2,y:h.y+h.vy*.2,z:h.z+h.vz*.2-54*.04};if(t.role==="outfield"&&Math.hypot((m.x-d.x)*Ot.scaleX,(m.y-d.y)*Ot.scaleY,m.z-d.z)<15){this.control(t);return}if(n.aerial.target===t.id){this.move(t,n.aerial.spot,7.2);return}}let s=this.attack(t.team),a=n.owner===null?null:n.players[n.owner];if(t.role==="keeper"){let h=s===1?3:102;this.move(t,{x:h,y:Ne(n.ball.y,27,41)},6.8);return}if(a?.id===t.id){if(n.tick>=t.decisionTick){let h=n.players.filter(m=>m.team!==t.team&&Pe(m,t)<6&&Math.abs(m.y-t.y)<3.5).sort((m,b)=>Pe(m,t)-Pe(b,t)||m.id-b.id)[0],d=h?t.y===h.y?t.slot%2?1:-1:nh(t.y-h.y):0;t.aiCarryY=h?Ne(t.y+d*6,12,56):Ne(34+(t.home.y-34)*.3,12,56)}if(this.move(t,{x:t.x+s*10,y:t.aiCarryY??Ne(34+(t.home.y-34)*.3,12,56)},7.2),n.tick>=t.decisionTick)if(t.decisionTick=n.tick+36,this.attackProgress(t)>75)this.kick(t,"shot");else{let h=n.players.some(m=>m.team!==t.team&&(Pe(m,t)<3||Pe(m,t)<6&&(m.x-t.x)*s>0&&Math.abs(m.y-t.y)<3.5)),d=this.openOutlet(t);d&&(h||this.random()<.12)&&this.kick(t,Pe(t,d)>18&&this.random()<.25?"loft":"pass",!1,d)}return}let r=n.players.filter(h=>h.team===t.team&&h.role==="outfield"&&!h.action&&h.cooldown<=0).sort((h,d)=>Pe(h,n.ball)-Pe(d,n.ball)||h.id-d.id);if(r[0]?.id===t.id&&(!a||a.team!==t.team)){if(a&&Pe(t,a)<9&&n.tick>=t.decisionTick&&this.challengeLooksReachable(t,a)){t.decisionTick=n.tick+90,this.tackle(t);return}this.move(t,a?this.pressurePoint(t,a):n.ball,7.2),a&&Pe(t,a)<9&&n.tick>=t.decisionTick&&(t.decisionTick=n.tick+6,this.challengeLooksReachable(t,a)&&(t.decisionTick=n.tick+90,this.tackle(t)));return}if(a&&a.team!==t.team&&r[1]?.id===t.id){this.move(t,{x:a.x-s*5,y:Ne(a.y+(t.home.y<a.y?-1.5:1.5),3,65)},7.2);return}let l=a?.team===t.team?10:-4,c=Ne((n.ball.x-52.5)*.22,-12,12),u=n.players.find(h=>h.team!==t.team&&h.slot===t.slot),f={x:Ne(t.home.x+c+s*l,5,100),y:Ne(t.home.y+(n.ball.y-34)*.18,4,64)};a&&a.team!==t.team&&u&&Pe(t,u)<14&&(f={x:u.x-s*3,y:u.y}),this.move(t,f,7.2)}canChance(t){let n=this.state.players[da(t.team)*11],i=this.attack(t.team);return this.attackProgress(t)>70&&t.y>=20&&t.y<=48&&(n.x-t.x)*i>2}beginChance(t,n=!0){let i=this.state;if(i.owner!==t.id||t.action||i.shotView)return;let s=i.players[da(t.team)*11],a=this.attack(t.team),r=Math.max(3,(s.x-t.x)*a),o=Ne(ne.separation/r,1,16),l=a===1?105-s.x:s.x,c=ne.keeperY-l*o;i.shotView={direction:a,phase:"aim",shooter:t.id,keeper:s.id,team:t.team,age:0,aim:n?{x:ne.centreX,y:c-32}:{x:ne.centreX-75+this.random()*150,y:c-10-this.random()*50},depthScale:o,planeY:c},t.moving=!1,this.clear(),this.emit("shooting-camera-enter",{player:t.id,team:t.team,direction:a}),i.message="CHANCE - aim with arrow keys, S to shoot (auto release after 1.5 seconds).",n||this.confirmChance()}confirmChance(){let t=this.state,n=t.shotView;if(!n||n.phase!=="aim")return;let i=t.players[n.shooter];if(t.owner!==i.id||i.action){this.exitShotView("possession-lost");return}n.phase="windup",n.age=0,this.clear(),this.kick(i,"shot")}exitShotView(t){let n=this.state,i=n.shotView;if(!i)return;n.shotView=null;let s=n.players[i.keeper];s?.contactView&&(s.contactView.view={pose:s.contactView.view.pose,mirror:this.attack(s.team)<0}),this.clear(),this.emit("shooting-camera-return",{reason:t,ball:{...n.ball}})}updateShotView(){let t=this.state,n=t.shotView;if(n){if(n.age++,(n.phase==="aim"||n.phase==="windup")&&t.owner!==n.shooter){this.exitShotView("possession-lost");return}if(n.phase==="aim"){let i=this.direction();n.aim.x=Ne(n.aim.x+i.x*66*He,24,226),n.aim.y=Ne(n.aim.y+i.y*66*He,5,120),n.age>=90&&this.confirmChance()}n.phase==="parry"&&n.age>=16&&this.exitShotView("parry"),n.phase==="goal"&&n.age>=45&&this.exitShotView("goal")}}control(t){let n=this.state;t.role!=="outfield"||t.action||t.cooldown||n.owner!==null||!n.aerial||n.aerial.controlledBy!==null||(t.moving=!1,t.motionAge=0,delete t.contactView,t.action={kind:"control",age:0,target:{x:0,y:0},released:!1,hit:!1,direction:{x:n.ball.x>t.x?1:-1,y:0}},t.team===0&&t.id===n.selected&&this.clear(),this.emit("upper-body-control-start",{player:t.id}),n.message="CONTROL - time the upper-body contact, then recover.")}loft(t,n,i){let s=this.state,a=n.targetPlayer===void 0?s.players.filter(h=>h.team===t.team&&h.role==="outfield"&&h.id!==t.id).sort((h,d)=>Pe(h,n.target)-Pe(d,n.target))[0]:s.players[n.targetPlayer],r=i.x>a.x,o={x:a.x,y:a.y},l=this.anchor(a,"upperTorso",{pose:a.team===0?"signal":"orchard-signal",mirror:r}),c=64/60,u=Math.pow(.995,.5),f=He*(1-Math.pow(u,64))/(1-u);s.ball.vx=(l.x-i.x)/f,s.ball.vy=(l.y-i.y)/f,s.ball.vz=(l.z-i.z+54*c*c)/c,s.aerial={kicker:t.id,target:a.id,spot:o,age:0,controlledBy:null},t.team===0&&(s.selected=a.id,this.clear()),s.message="LOFT - T controls the aerial ball; S switches player."}step(){let t=this.state;if(t.status!=="playing")return;if(t.tick++,this.updateShotView(),t.phase==="goal"){++t.goalAge>=120&&this.kickoff(t.pendingKickoff),this.updateCamera();return}if(t.phase==="restart"){let l=t.restart;l.age++;let c=t.players[l.taker];if(l.team===1&&l.age>=60&&!c.action&&this.takeRestart(l.kind==="corner"),c.action&&(c.action.age++,c.action.kind==="throw"&&c.action.age<=12&&this.setBall(this.throwAnchor(c)),c.action.age===12)){if(c.action.kind!=="throw"){let u=this.anchor(c);c.x+=l.point.x-u.x,c.y+=l.point.y-u.y}this.release(c,c.action)}this.updateCamera();return}let n=t.shotView,i=t.players.map(l=>({position:{x:l.x,y:l.y},upper:this.anchor(l,"upperTorso"),foot:this.anchor(l),body:{...l,z:25},hands:l.role==="keeper"?["leftHand","rightHand"].map(c=>({name:c,point:this.anchor(l,c)})):[]})),s={...t.ball};for(let l of t.players){l.cooldown>0&&l.cooldown--,l.contactView&&--l.contactView.ticks<=0&&delete l.contactView;let c=l.action;if(l.keeperCycle)this.advanceKeeper(l);else if(c)if(c.age++,l.moving=!1,c.kind==="control"){if(c.age>=54){let u=this.view(l);l.action=null,l.cooldown=1,l.contactView={view:u,ticks:2},this.emit("upper-body-recovery-complete",{player:l.id,hit:c.hit})}}else if(c.kind==="stagger"){if(c.age>=24){let u=this.view(l);l.action=null,l.cooldown=1,l.contactView={view:u,ticks:2},this.emit("stagger-recovered",{player:l.id,team:l.team})}}else c.kind==="tackle"?(c.age>=8&&c.age<36&&(l.x=Ne(l.x+c.direction.x*(c.tackleStyle==="standing"?3:9)*He,Math.min(1,l.x),Math.max(104,l.x)),l.moving=!0),c.age>=(c.tackleStyle==="standing"?30:84)&&(l.action=null,l.cooldown=1,this.emit("recovered",{player:l.id}))):(!c.released&&!c.cancelled&&c.age>=12&&this.release(l,c),c.age>=30&&(l.action=null,l.cooldown=1));else if(t.shotView?.shooter===l.id)l.moving=!1;else if(l.id===t.selected&&l.team===0&&l.role==="outfield"){let u=this.direction();if(t.shotView?.phase==="aim"&&t.shotView.shooter===l.id){l.moving=!1;continue}this.move(l,{x:l.x+u.x*10,y:l.y+u.y*10},7.2)}else this.ai(l)}if(t.shotView&&n!==t.shotView){let l=t.players[t.shotView.keeper],c=i[l.id],u=this.view(l);c.hands=["leftHand","rightHand"].map(f=>({name:f,point:this.anchor({...l,...c.position},f,u)}))}if(t.owner!==null){let l=t.players[t.owner];this.attach(l),t.possessionTicks[l.team]++}else{let l=t.ball;l.x+=l.vx*He,l.y+=l.vy*He,l.z+=l.vz*He;let c=t.aerial?.controlledBy!==null&&!!t.aerial;l.vz-=(c?270:t.aerial?108:280)*He,t.aerial&&t.aerial.age++,c&&l.z<=1&&(l.z=1,l.vz=0),l.z<0&&(t.aerial&&t.aerial.controlledBy===null&&(this.emit("aerial-bounce"),t.aerial=null),l.z=0,l.vz=Math.abs(l.vz)>25?-l.vz*.38:0);let u=Math.pow(c?.92:l.z>1?.995:.985,He*30);l.vx*=u,l.vy*=u}let a=this.boundary(s,t.ball),r=[];for(let l of t.players){if(l.id===t.owner)continue;let c=l.action,u=i[l.id],f=l.id===t.lastKicker&&t.tick-t.releaseTick<24;if(l.role==="keeper"){let d=l.keeperCycle;if(d){if(d.dropped&&!d.punted&&t.owner===null&&d.age>=fn.puntAge&&d.age<fn.puntEnd){let p=this.view(l),y=this.anchor({...l,...u.position},"kickingFoot",p),S=this.anchor(l,"kickingFoot",p),v=ji(Wt(y),Wt(S),Wt(s),Wt(t.ball),4);v&&r.push({...v,p:l,kind:"keeper-punt-contact",anchor:"kickingFoot",point:Li(v.anchor),ball:Li(v.ball),segment:{anchorStart:Wt(y),anchorEnd:Wt(S),ballStart:Wt(s),ballEnd:Wt(t.ball),radius:4}})}continue}if(!(this.attack(l.team)===1?t.ball.x<17:t.ball.x>88)||t.ball.y<20||t.ball.y>48||f||l.cooldown>0)continue;let b=this.view(l),g=["leftHand","rightHand"].map(p=>({name:p,point:this.anchor({...l,...u.position},p,b)}));for(let p of g){let y=t.shotView?.keeper===l.id?T=>nr(T,t.shotView):Wt,S=t.shotView?.keeper===l.id?6:Cs.receive,v=ji(y(p.point),y(this.anchor(l,p.name)),y(s),y(t.ball),S);v&&r.push({...v,p:l,kind:"save",anchor:p.name,point:t.shotView?.keeper===l.id?Gm(v.anchor,t.shotView):Li(v.anchor),ball:t.shotView?.keeper===l.id?Gm(v.ball,t.shotView):Li(v.ball),segment:{anchorStart:y(p.point),anchorEnd:y(this.anchor(l,p.name)),ballStart:y(s),ballEnd:y(t.ball),radius:S}})}continue}if(c?.kind==="control"&&c.age>=8&&c.age<20&&!c.hit&&t.aerial?.controlledBy===null){let d=ji(Wt(u.upper),Wt(this.anchor(l,"upperTorso")),Wt(s),Wt(t.ball),Cs.upper);d&&r.push({...d,p:l,kind:"upper-body-contact",anchor:"upperTorso",point:Li(d.anchor),ball:Li(d.ball),segment:{anchorStart:Wt(u.upper),anchorEnd:Wt(this.anchor(l,"upperTorso")),ballStart:Wt(s),ballEnd:Wt(t.ball),radius:Cs.upper}});continue}if(c?.kind==="tackle"&&c.age>=8&&c.age<36&&!c.hit){let d=ji(Wt(u.foot),Wt(this.anchor(l)),Wt(s),Wt(t.ball),Cs.boot);d&&r.push({...d,p:l,kind:"tackle-contact",anchor:"boot",point:Li(d.anchor),ball:Li(d.ball)});let m=t.owner===null?null:t.players[t.owner];if(m&&m.team!==l.team){let b=ji(Wt({...i[l.id].body,z:0}),Wt({...l,z:0}),Wt({...i[m.id].body,z:0}),Wt({...m,z:0}),Cs.body);b&&r.push({...b,p:l,kind:"foul",anchor:"body",point:{x:l.x,y:l.y,z:0},ball:{x:t.ball.x,y:t.ball.y,z:t.ball.z}})}continue}if(c||l.cooldown>0||f||t.owner!==null||t.ball.z>6||s.z>12)continue;let h=ji(Wt(u.foot),Wt(this.anchor(l)),Wt(s),Wt(t.ball),Cs.receive);h&&r.push({...h,p:l,kind:"receive",anchor:"foot",point:Li(h.anchor),ball:Li(h.ball)})}r.sort((l,c)=>l.fraction-c.fraction||(l.kind==="tackle-contact"?-1:c.kind==="tackle-contact"?1:l.p.id-c.p.id));let o=r[0];if(a&&(!o||a.fraction<o.fraction))this.applyBoundary(a);else if(o){let l=o.p;t.noDoubleTouch!==null&&t.noDoubleTouch!==l.id&&(t.noDoubleTouch=null);let c=o.kind!=="foul"&&t.noDoubleTouch===l.id;if(this.emit(c?"restart-double-touch":o.kind==="receive"&&t.aerial?.controlledBy===l.id?"aerial-foot-collection":o.kind,{segment:o.segment,contactSpace:t.shotView?.keeper===l.id?"goal-pixels":"pitch-pixels",attemptedContact:o.kind,player:l.id,team:l.team,pose:this.view(l).pose,mirror:this.view(l).mirror,anchor:o.anchor,worldPoint:o.point,worldBall:o.ball,distance:o.distance,fraction:o.fraction}),c)this.beginRestart("free-kick",da(l.team),{x:l.x,y:l.y}),t.message="Second touch after restart - free kick.";else if(o.kind==="foul"){l.action.hit=!0;let u=da(l.team),f=(this.attack(u)===1?l.x>88:l.x<17)&&l.y>20&&l.y<48;this.beginRestart(f?"penalty":"free-kick",u,f?{x:this.attack(u)===1?94:11,y:34}:{x:l.x,y:l.y})}else if(o.kind==="upper-body-contact")l.action.hit=!0,t.aerial.controlledBy=l.id,t.airContacts[l.team]++,t.lastTouch=l.team,this.setBall(o.ball),t.ball.vx=(l.action.direction.x>0?2.4:-2.4)/Ot.scaleX,t.ball.vz=0,t.message="CONTROL CONTACT - complete recovery before collecting.";else if(o.kind==="keeper-punt-contact")this.puntKeeper(l,o.ball);else if(o.kind==="save"&&this.canSecure(l,o.ball,s))this.secureKeeper(l,o.ball);else if(o.kind==="save")l.contactView={view:this.view(l),ticks:60},t.aerial=null,t.shotView&&(t.shotView.phase="parry",t.shotView.age=0,this.emit("close-keeper-parry",{player:l.id,viewPoint:nr(this.anchor(l,o.anchor),t.shotView)})),l.contactView={view:this.view(l),ticks:60},t.saves[l.team]++,t.owner=null,t.lastTouch=l.team,t.lastKicker=l.id,t.releaseTick=t.tick,this.setBall(this.anchor(l,o.anchor)),t.ball.vx=this.attack(l.team)*12,t.ball.vy=(t.ball.y<34?-1:1)*5,t.ball.vz=40,l.cooldown=60,t.message="SAVE \u2014 live rebound.";else if(o.kind==="tackle-contact"){let u=t.owner===null?null:t.players[t.owner];l.action.hit=!0,t.aerial=null,this.exitShotView("tackle"),t.owner=null,t.lastTouch=l.team,this.setBall(this.anchor(l)),t.ball.vx=l.action.direction.x*6,t.ball.vz=22,t.lastKicker=l.id,t.releaseTick=t.tick,u&&u.team!==l.team&&(u.action&&!u.action.released&&!u.action.cancelled&&this.emit("delivery-cancelled",{player:u.id,reason:"tackled"}),u.action={kind:"stagger",age:0,target:{x:0,y:0},released:!1,hit:!1,direction:{x:u.facing==="E"?1:u.facing==="W"?-1:this.attack(u.team),y:0}},u.moving=!1,delete u.contactView,delete u.aiCarryY,this.emit("stagger-start",{player:u.id,team:u.team,tackler:l.id})),t.message="Tackle contact \u2014 recover before collecting."}else t.aerial?.controlledBy===l.id&&t.airCollections[l.team]++,t.aerial=null,this.exitShotView("possession"),t.owner=l.id,delete l.aiCarryY,l.decisionTick=Math.min(l.decisionTick,t.tick+6),t.lastTouch=l.team,t.noDoubleTouch=null,l.team===0&&(t.selected=l.id),this.attach(l),t.message=l.team===0?"HARBOUR possession \u2014 P pass, L loft, S shoot.":"ORCHARD possession \u2014 T tackle, S switch, D slide."}else a&&this.applyBoundary(a);t.halfTicks++,t.halfTicks>=fb&&this.endPeriod(),this.updateCamera()}boundary(t,n){let s=[];for(let[a,r,o]of[["x",-.5,"left"],["x",105+.5,"right"],["y",-.5,"top"],["y",68+.5,"bottom"]]){let l=n[a],c=t[a];if((r<0?l<r:l>r)&&l!==c){let u=(r-c)/(l-c);u>=0&&u<=1&&s.push({fraction:u,edge:o,point:{x:t.x+(n.x-t.x)*u,y:t.y+(n.y-t.y)*u,z:t.z+(n.z-t.z)*u}})}}return s.sort((a,r)=>a.fraction-r.fraction)[0]??null}applyBoundary(t){let n=this.state,i=t.point;if(t.edge==="top"||t.edge==="bottom"){this.beginRestart("throw-in",da(n.lastTouch),{x:Ne(i.x,1,104),y:t.edge==="top"?0:68});return}let s=t.edge==="right"==(n.half===1)?0:1,a=da(s);if(i.y>=Ot.goalTop&&i.y<=Ot.goalBottom&&i.z<=tr-3){n.score[s]++,n.owner=null,n.phase="goal",n.shotView&&(n.shotView.phase="goal",n.shotView.age=0),n.goalAge=0,n.pendingKickoff=a,this.clear();for(let r of n.players)r.action=null,delete r.keeperCycle,r.moving=!1;this.setBall(i),this.emit("goal",{team:s,score:[...n.score]}),n.message=`GOAL ${s===0?"HARBOUR":"ORCHARD"} \u2014 ${n.score[0]} : ${n.score[1]}`}else n.lastTouch===a?this.beginRestart("corner",s,{x:t.edge==="right"?104.5:.5,y:i.y<34?.5:67.5}):this.beginRestart("goal-kick",a,{x:t.edge==="right"?99:6,y:34})}endPeriod(){let t=this.state;this.exitShotView("whistle"),t.aerial=null,this.clear(),t.owner=null,t.restart=null,t.noDoubleTouch=null;for(let n of t.players)n.action=null,delete n.keeperCycle,delete n.contactView,n.moving=!1;Object.assign(t.ball,{vx:0,vy:0,vz:0}),t.half===1?(t.status="halftime",t.message=`HALFTIME ${t.score[0]} : ${t.score[1]} \u2014 Continue to switch ends.`,this.emit("halftime")):(t.status="complete",t.message=`FULL TIME ${t.score[0]} : ${t.score[1]} \u2014 ${t.score[0]===t.score[1]?"DRAW":t.score[0]>t.score[1]?"HARBOUR WINS":"ORCHARD WINS"}.`,this.emit("fulltime"))}updateCamera(){let t=this.state,n=Xe(t.ball),i=t.owner===null?n:Xe(t.players[t.owner]),s=t.owner===null?{x:t.ball.vx*Ot.scaleX,y:t.ball.vy*Ot.scaleY}:this.state.players[t.owner].moving?{x:(this.state.players[t.owner].facing==="W"?-7.2:this.state.players[t.owner].facing==="E"?7.2:0)*Ot.scaleX,y:0}:{x:0,y:0};t.camera=yb(i,s,t.camera,this.viewportWidth)}},nh=e=>e>=0?1:-1;var Bb=0,xg=1,zb=2;var lc=1,Fb=2,Ro=3,wa=0,Un=1,Ei=2,ss=0,No=1,vg=2,_g=3,bg=4,kb=5;var ur=100,Hb=101,Vb=102,Gb=103,Wb=104,Xb=200,qb=201,Yb=202,Zb=203,Sg=204,Mg=205,Kb=206,Jb=207,Qb=208,jb=209,$b=210,tS=211,eS=212,nS=213,iS=214,Eh=0,Ah=1,wh=2,Mo=3,Ch=4,Rh=5,Nh=6,Dh=7,Tg=0,sS=1,aS=2,zi=0,Eg=1,Ag=2,wg=3,Cg=4,Rg=5,Ng=6,Dg=7;var Lg=300,Ca=301,hr=302,sf=303,af=304,cc=306,Lh=1e3,ts=1001,Uh=1002,Ye=1003,rS=1004;var uc=1005;var vn=1006,rf=1007;var Ra=1008;var oi=1009,Ug=1010,Og=1011,Do=1012,of=1013,Fi=1014,ki=1015,Hi=1016,lf=1017,cf=1018,Lo=1020,Ig=35902,Pg=35899,Bg=1021,zg=1022,Ai=1023,es=1026,Na=1027,Fg=1028,uf=1029,Da=1030,hf=1031;var ff=1033,hc=33776,fc=33777,dc=33778,pc=33779,df=35840,pf=35841,mf=35842,gf=35843,yf=36196,xf=37492,vf=37496,_f=37488,bf=37489,mc=37490,Sf=37491,Mf=37808,Tf=37809,Ef=37810,Af=37811,wf=37812,Cf=37813,Rf=37814,Nf=37815,Df=37816,Lf=37817,Uf=37818,Of=37819,If=37820,Pf=37821,Bf=36492,zf=36494,Ff=36495,kf=36283,Hf=36284,gc=36285,Vf=36286;var ql=2300,Oh=2301,Mh=2302,fg=2303,dg=2400,pg=2401,mg=2402;var oS=3200;var kg=0,lS=1,Is="",En="srgb",Yl="srgb-linear",Zl="linear",he="srgb";var Th=7680;var cS=519,uS=512,hS=513,fS=514,Gf=515,dS=516,pS=517,Wf=518,mS=519,gS=35044;var Hg="300 es",Bi=2e3,Kl=2001;function vE(e){for(let t=e.length-1;t>=0;--t)if(e[t]>=65535)return!0;return!1}function _E(e){return ArrayBuffer.isView(e)&&!(e instanceof DataView)}function Jl(e){return document.createElementNS("http://www.w3.org/1999/xhtml",e)}function yS(){let e=Jl("canvas");return e.style.display="block",e}var xb={},To=null;function Vg(...e){let t="THREE."+e.shift();To?To("log",t,...e):console.log(t,...e)}function xS(e){let t=e[0];if(typeof t=="string"&&t.startsWith("TSL:")){let n=e[1];n&&n.isStackTrace?e[0]+=" "+n.getLocation():e[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return e}function Lt(...e){e=xS(e);let t="THREE."+e.shift();if(To)To("warn",t,...e);else{let n=e[0];n&&n.isStackTrace?console.warn(n.getError(t)):console.warn(t,...e)}}function It(...e){e=xS(e);let t="THREE."+e.shift();if(To)To("error",t,...e);else{let n=e[0];n&&n.isStackTrace?console.error(n.getError(t)):console.error(t,...e)}}function or(...e){let t=e.join(" ");t in xb||(xb[t]=!0,Lt(...e))}function vS(e,t,n){return new Promise(function(i,s){function a(){switch(e.clientWaitSync(t,e.SYNC_FLUSH_COMMANDS_BIT,0)){case e.WAIT_FAILED:s();break;case e.TIMEOUT_EXPIRED:setTimeout(a,n);break;default:i()}}setTimeout(a,n)})}var _S={[Eh]:Ah,[wh]:Nh,[Ch]:Dh,[Mo]:Rh,[Ah]:Eh,[Nh]:wh,[Dh]:Ch,[Rh]:Mo},ns=class{addEventListener(t,n){this._listeners===void 0&&(this._listeners={});let i=this._listeners;i[t]===void 0&&(i[t]=[]),i[t].indexOf(n)===-1&&i[t].push(n)}hasEventListener(t,n){let i=this._listeners;return i===void 0?!1:i[t]!==void 0&&i[t].indexOf(n)!==-1}removeEventListener(t,n){let i=this._listeners;if(i===void 0)return;let s=i[t];if(s!==void 0){let a=s.indexOf(n);a!==-1&&s.splice(a,1)}}dispatchEvent(t){let n=this._listeners;if(n===void 0)return;let i=n[t.type];if(i!==void 0){t.target=this;let s=i.slice(0);for(let a=0,r=s.length;a<r;a++)s[a].call(this,t);t.target=null}}},Mn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];var Wm=Math.PI/180,Ih=180/Math.PI;function yc(){let e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Mn[e&255]+Mn[e>>8&255]+Mn[e>>16&255]+Mn[e>>24&255]+"-"+Mn[t&255]+Mn[t>>8&255]+"-"+Mn[t>>16&15|64]+Mn[t>>24&255]+"-"+Mn[n&63|128]+Mn[n>>8&255]+"-"+Mn[n>>16&255]+Mn[n>>24&255]+Mn[i&255]+Mn[i>>8&255]+Mn[i>>16&255]+Mn[i>>24&255]).toLowerCase()}function $t(e,t,n){return Math.max(t,Math.min(n,e))}function bE(e,t){return(e%t+t)%t}function Xm(e,t,n){return(1-n)*e+n*t}function Hl(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return e/4294967295;case Uint16Array:return e/65535;case Uint8Array:case Uint8ClampedArray:return e/255;case Int32Array:return Math.max(e/2147483647,-1);case Int16Array:return Math.max(e/32767,-1);case Int8Array:return Math.max(e/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function Gn(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return Math.round(e*4294967295);case Uint16Array:return Math.round(e*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(e*255);case Int32Array:return Math.round(e*2147483647);case Int16Array:return Math.round(e*32767);case Int8Array:return Math.round(e*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}var ie=class e{static{e.prototype.isVector2=!0}constructor(t=0,n=0){this.x=t,this.y=n}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,n){return this.x=t,this.y=n,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,n){switch(t){case 0:this.x=n;break;case 1:this.y=n;break;default:throw new Error("THREE.Vector2: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,n){return this.x=t.x+n.x,this.y=t.y+n.y,this}addScaledVector(t,n){return this.x+=t.x*n,this.y+=t.y*n,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,n){return this.x=t.x-n.x,this.y=t.y-n.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){let n=this.x,i=this.y,s=t.elements;return this.x=s[0]*n+s[3]*i+s[6],this.y=s[1]*n+s[4]*i+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,n){return this.x=$t(this.x,t.x,n.x),this.y=$t(this.y,t.y,n.y),this}clampScalar(t,n){return this.x=$t(this.x,t,n),this.y=$t(this.y,t,n),this}clampLength(t,n){let i=this.length();return this.divideScalar(i||1).multiplyScalar($t(i,t,n))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){let n=Math.sqrt(this.lengthSq()*t.lengthSq());if(n===0)return Math.PI/2;let i=this.dot(t)/n;return Math.acos($t(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let n=this.x-t.x,i=this.y-t.y;return n*n+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,n){return this.x+=(t.x-this.x)*n,this.y+=(t.y-this.y)*n,this}lerpVectors(t,n,i){return this.x=t.x+(n.x-t.x)*i,this.y=t.y+(n.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,n=0){return this.x=t[n],this.y=t[n+1],this}toArray(t=[],n=0){return t[n]=this.x,t[n+1]=this.y,t}fromBufferAttribute(t,n){return this.x=t.getX(n),this.y=t.getY(n),this}rotateAround(t,n){let i=Math.cos(n),s=Math.sin(n),a=this.x-t.x,r=this.y-t.y;return this.x=a*i-r*s+t.x,this.y=a*s+r*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},is=class{constructor(t=0,n=0,i=0,s=1){this.isQuaternion=!0,this._x=t,this._y=n,this._z=i,this._w=s}static slerpFlat(t,n,i,s,a,r,o){let l=i[s+0],c=i[s+1],u=i[s+2],f=i[s+3],h=a[r+0],d=a[r+1],m=a[r+2],b=a[r+3];if(f!==b||l!==h||c!==d||u!==m){let g=l*h+c*d+u*m+f*b;g<0&&(h=-h,d=-d,m=-m,b=-b,g=-g);let p=1-o;if(g<.9995){let y=Math.acos(g),S=Math.sin(y);p=Math.sin(p*y)/S,o=Math.sin(o*y)/S,l=l*p+h*o,c=c*p+d*o,u=u*p+m*o,f=f*p+b*o}else{l=l*p+h*o,c=c*p+d*o,u=u*p+m*o,f=f*p+b*o;let y=1/Math.sqrt(l*l+c*c+u*u+f*f);l*=y,c*=y,u*=y,f*=y}}t[n]=l,t[n+1]=c,t[n+2]=u,t[n+3]=f}static multiplyQuaternionsFlat(t,n,i,s,a,r){let o=i[s],l=i[s+1],c=i[s+2],u=i[s+3],f=a[r],h=a[r+1],d=a[r+2],m=a[r+3];return t[n]=o*m+u*f+l*d-c*h,t[n+1]=l*m+u*h+c*f-o*d,t[n+2]=c*m+u*d+o*h-l*f,t[n+3]=u*m-o*f-l*h-c*d,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,n,i,s){return this._x=t,this._y=n,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,n=!0){let i=t._x,s=t._y,a=t._z,r=t._order,o=Math.cos,l=Math.sin,c=o(i/2),u=o(s/2),f=o(a/2),h=l(i/2),d=l(s/2),m=l(a/2);switch(r){case"XYZ":this._x=h*u*f+c*d*m,this._y=c*d*f-h*u*m,this._z=c*u*m+h*d*f,this._w=c*u*f-h*d*m;break;case"YXZ":this._x=h*u*f+c*d*m,this._y=c*d*f-h*u*m,this._z=c*u*m-h*d*f,this._w=c*u*f+h*d*m;break;case"ZXY":this._x=h*u*f-c*d*m,this._y=c*d*f+h*u*m,this._z=c*u*m+h*d*f,this._w=c*u*f-h*d*m;break;case"ZYX":this._x=h*u*f-c*d*m,this._y=c*d*f+h*u*m,this._z=c*u*m-h*d*f,this._w=c*u*f+h*d*m;break;case"YZX":this._x=h*u*f+c*d*m,this._y=c*d*f+h*u*m,this._z=c*u*m-h*d*f,this._w=c*u*f-h*d*m;break;case"XZY":this._x=h*u*f-c*d*m,this._y=c*d*f-h*u*m,this._z=c*u*m+h*d*f,this._w=c*u*f+h*d*m;break;default:Lt("Quaternion: .setFromEuler() encountered an unknown order: "+r)}return n===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,n){let i=n/2,s=Math.sin(i);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(t){let n=t.elements,i=n[0],s=n[4],a=n[8],r=n[1],o=n[5],l=n[9],c=n[2],u=n[6],f=n[10],h=i+o+f;if(h>0){let d=.5/Math.sqrt(h+1);this._w=.25/d,this._x=(u-l)*d,this._y=(a-c)*d,this._z=(r-s)*d}else if(i>o&&i>f){let d=2*Math.sqrt(1+i-o-f);this._w=(u-l)/d,this._x=.25*d,this._y=(s+r)/d,this._z=(a+c)/d}else if(o>f){let d=2*Math.sqrt(1+o-i-f);this._w=(a-c)/d,this._x=(s+r)/d,this._y=.25*d,this._z=(l+u)/d}else{let d=2*Math.sqrt(1+f-i-o);this._w=(r-s)/d,this._x=(a+c)/d,this._y=(l+u)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(t,n){let i=t.dot(n)+1;return i<1e-8?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*n.z-t.z*n.y,this._y=t.z*n.x-t.x*n.z,this._z=t.x*n.y-t.y*n.x,this._w=i),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs($t(this.dot(t),-1,1)))}rotateTowards(t,n){let i=this.angleTo(t);if(i===0)return this;let s=Math.min(1,n/i);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,n){let i=t._x,s=t._y,a=t._z,r=t._w,o=n._x,l=n._y,c=n._z,u=n._w;return this._x=i*u+r*o+s*c-a*l,this._y=s*u+r*l+a*o-i*c,this._z=a*u+r*c+i*l-s*o,this._w=r*u-i*o-s*l-a*c,this._onChangeCallback(),this}slerp(t,n){let i=t._x,s=t._y,a=t._z,r=t._w,o=this.dot(t);o<0&&(i=-i,s=-s,a=-a,r=-r,o=-o);let l=1-n;if(o<.9995){let c=Math.acos(o),u=Math.sin(c);l=Math.sin(l*c)/u,n=Math.sin(n*c)/u,this._x=this._x*l+i*n,this._y=this._y*l+s*n,this._z=this._z*l+a*n,this._w=this._w*l+r*n,this._onChangeCallback()}else this._x=this._x*l+i*n,this._y=this._y*l+s*n,this._z=this._z*l+a*n,this._w=this._w*l+r*n,this.normalize();return this}slerpQuaternions(t,n,i){return this.copy(t).slerp(n,i)}random(){let t=2*Math.PI*Math.random(),n=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),a=Math.sqrt(i);return this.set(s*Math.sin(t),s*Math.cos(t),a*Math.sin(n),a*Math.cos(n))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,n=0){return this._x=t[n],this._y=t[n+1],this._z=t[n+2],this._w=t[n+3],this._onChangeCallback(),this}toArray(t=[],n=0){return t[n]=this._x,t[n+1]=this._y,t[n+2]=this._z,t[n+3]=this._w,t}fromBufferAttribute(t,n){return this._x=t.getX(n),this._y=t.getY(n),this._z=t.getZ(n),this._w=t.getW(n),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},V=class e{static{e.prototype.isVector3=!0}constructor(t=0,n=0,i=0){this.x=t,this.y=n,this.z=i}set(t,n,i){return i===void 0&&(i=this.z),this.x=t,this.y=n,this.z=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,n){switch(t){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;default:throw new Error("THREE.Vector3: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,n){return this.x=t.x+n.x,this.y=t.y+n.y,this.z=t.z+n.z,this}addScaledVector(t,n){return this.x+=t.x*n,this.y+=t.y*n,this.z+=t.z*n,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,n){return this.x=t.x-n.x,this.y=t.y-n.y,this.z=t.z-n.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,n){return this.x=t.x*n.x,this.y=t.y*n.y,this.z=t.z*n.z,this}applyEuler(t){return this.applyQuaternion(vb.setFromEuler(t))}applyAxisAngle(t,n){return this.applyQuaternion(vb.setFromAxisAngle(t,n))}applyMatrix3(t){let n=this.x,i=this.y,s=this.z,a=t.elements;return this.x=a[0]*n+a[3]*i+a[6]*s,this.y=a[1]*n+a[4]*i+a[7]*s,this.z=a[2]*n+a[5]*i+a[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){let n=this.x,i=this.y,s=this.z,a=t.elements,r=1/(a[3]*n+a[7]*i+a[11]*s+a[15]);return this.x=(a[0]*n+a[4]*i+a[8]*s+a[12])*r,this.y=(a[1]*n+a[5]*i+a[9]*s+a[13])*r,this.z=(a[2]*n+a[6]*i+a[10]*s+a[14])*r,this}applyQuaternion(t){let n=this.x,i=this.y,s=this.z,a=t.x,r=t.y,o=t.z,l=t.w,c=2*(r*s-o*i),u=2*(o*n-a*s),f=2*(a*i-r*n);return this.x=n+l*c+r*f-o*u,this.y=i+l*u+o*c-a*f,this.z=s+l*f+a*u-r*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){let n=this.x,i=this.y,s=this.z,a=t.elements;return this.x=a[0]*n+a[4]*i+a[8]*s,this.y=a[1]*n+a[5]*i+a[9]*s,this.z=a[2]*n+a[6]*i+a[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,n){return this.x=$t(this.x,t.x,n.x),this.y=$t(this.y,t.y,n.y),this.z=$t(this.z,t.z,n.z),this}clampScalar(t,n){return this.x=$t(this.x,t,n),this.y=$t(this.y,t,n),this.z=$t(this.z,t,n),this}clampLength(t,n){let i=this.length();return this.divideScalar(i||1).multiplyScalar($t(i,t,n))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,n){return this.x+=(t.x-this.x)*n,this.y+=(t.y-this.y)*n,this.z+=(t.z-this.z)*n,this}lerpVectors(t,n,i){return this.x=t.x+(n.x-t.x)*i,this.y=t.y+(n.y-t.y)*i,this.z=t.z+(n.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,n){let i=t.x,s=t.y,a=t.z,r=n.x,o=n.y,l=n.z;return this.x=s*l-a*o,this.y=a*r-i*l,this.z=i*o-s*r,this}projectOnVector(t){let n=t.lengthSq();if(n===0)return this.set(0,0,0);let i=t.dot(this)/n;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return qm.copy(this).projectOnVector(t),this.sub(qm)}reflect(t){return this.sub(qm.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){let n=Math.sqrt(this.lengthSq()*t.lengthSq());if(n===0)return Math.PI/2;let i=this.dot(t)/n;return Math.acos($t(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let n=this.x-t.x,i=this.y-t.y,s=this.z-t.z;return n*n+i*i+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,n,i){let s=Math.sin(n)*t;return this.x=s*Math.sin(i),this.y=Math.cos(n)*t,this.z=s*Math.cos(i),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,n,i){return this.x=t*Math.sin(n),this.y=i,this.z=t*Math.cos(n),this}setFromMatrixPosition(t){let n=t.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this}setFromMatrixScale(t){let n=this.setFromMatrixColumn(t,0).length(),i=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=n,this.y=i,this.z=s,this}setFromMatrixColumn(t,n){return this.fromArray(t.elements,n*4)}setFromMatrix3Column(t,n){return this.fromArray(t.elements,n*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,n=0){return this.x=t[n],this.y=t[n+1],this.z=t[n+2],this}toArray(t=[],n=0){return t[n]=this.x,t[n+1]=this.y,t[n+2]=this.z,t}fromBufferAttribute(t,n){return this.x=t.getX(n),this.y=t.getY(n),this.z=t.getZ(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let t=Math.random()*Math.PI*2,n=Math.random()*2-1,i=Math.sqrt(1-n*n);return this.x=i*Math.cos(t),this.y=n,this.z=i*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},qm=new V,vb=new is,Bt=class e{static{e.prototype.isMatrix3=!0}constructor(t,n,i,s,a,r,o,l,c){this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,n,i,s,a,r,o,l,c)}set(t,n,i,s,a,r,o,l,c){let u=this.elements;return u[0]=t,u[1]=s,u[2]=o,u[3]=n,u[4]=a,u[5]=l,u[6]=i,u[7]=r,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){let n=this.elements,i=t.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],this}extractBasis(t,n,i){return t.setFromMatrix3Column(this,0),n.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){let n=t.elements;return this.set(n[0],n[4],n[8],n[1],n[5],n[9],n[2],n[6],n[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,n){let i=t.elements,s=n.elements,a=this.elements,r=i[0],o=i[3],l=i[6],c=i[1],u=i[4],f=i[7],h=i[2],d=i[5],m=i[8],b=s[0],g=s[3],p=s[6],y=s[1],S=s[4],v=s[7],T=s[2],E=s[5],C=s[8];return a[0]=r*b+o*y+l*T,a[3]=r*g+o*S+l*E,a[6]=r*p+o*v+l*C,a[1]=c*b+u*y+f*T,a[4]=c*g+u*S+f*E,a[7]=c*p+u*v+f*C,a[2]=h*b+d*y+m*T,a[5]=h*g+d*S+m*E,a[8]=h*p+d*v+m*C,this}multiplyScalar(t){let n=this.elements;return n[0]*=t,n[3]*=t,n[6]*=t,n[1]*=t,n[4]*=t,n[7]*=t,n[2]*=t,n[5]*=t,n[8]*=t,this}determinant(){let t=this.elements,n=t[0],i=t[1],s=t[2],a=t[3],r=t[4],o=t[5],l=t[6],c=t[7],u=t[8];return n*r*u-n*o*c-i*a*u+i*o*l+s*a*c-s*r*l}invert(){let t=this.elements,n=t[0],i=t[1],s=t[2],a=t[3],r=t[4],o=t[5],l=t[6],c=t[7],u=t[8],f=u*r-o*c,h=o*l-u*a,d=c*a-r*l,m=n*f+i*h+s*d;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);let b=1/m;return t[0]=f*b,t[1]=(s*c-u*i)*b,t[2]=(o*i-s*r)*b,t[3]=h*b,t[4]=(u*n-s*l)*b,t[5]=(s*a-o*n)*b,t[6]=d*b,t[7]=(i*l-c*n)*b,t[8]=(r*n-i*a)*b,this}transpose(){let t,n=this.elements;return t=n[1],n[1]=n[3],n[3]=t,t=n[2],n[2]=n[6],n[6]=t,t=n[5],n[5]=n[7],n[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){let n=this.elements;return t[0]=n[0],t[1]=n[3],t[2]=n[6],t[3]=n[1],t[4]=n[4],t[5]=n[7],t[6]=n[2],t[7]=n[5],t[8]=n[8],this}setUvTransform(t,n,i,s,a,r,o){let l=Math.cos(a),c=Math.sin(a);return this.set(i*l,i*c,-i*(l*r+c*o)+r+t,-s*c,s*l,-s*(-c*r+l*o)+o+n,0,0,1),this}scale(t,n){return or("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(Ym.makeScale(t,n)),this}rotate(t){return or("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(Ym.makeRotation(-t)),this}translate(t,n){return or("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(Ym.makeTranslation(t,n)),this}makeTranslation(t,n){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,n,0,0,1),this}makeRotation(t){let n=Math.cos(t),i=Math.sin(t);return this.set(n,-i,0,i,n,0,0,0,1),this}makeScale(t,n){return this.set(t,0,0,0,n,0,0,0,1),this}equals(t){let n=this.elements,i=t.elements;for(let s=0;s<9;s++)if(n[s]!==i[s])return!1;return!0}fromArray(t,n=0){for(let i=0;i<9;i++)this.elements[i]=t[i+n];return this}toArray(t=[],n=0){let i=this.elements;return t[n]=i[0],t[n+1]=i[1],t[n+2]=i[2],t[n+3]=i[3],t[n+4]=i[4],t[n+5]=i[5],t[n+6]=i[6],t[n+7]=i[7],t[n+8]=i[8],t}clone(){return new this.constructor().fromArray(this.elements)}},Ym=new Bt,_b=new Bt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),bb=new Bt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function SE(){let e={enabled:!0,workingColorSpace:Yl,spaces:{},convert:function(s,a,r){return this.enabled===!1||a===r||!a||!r||(this.spaces[a].transfer===he&&(s.r=Os(s.r),s.g=Os(s.g),s.b=Os(s.b)),this.spaces[a].primaries!==this.spaces[r].primaries&&(s.applyMatrix3(this.spaces[a].toXYZ),s.applyMatrix3(this.spaces[r].fromXYZ)),this.spaces[r].transfer===he&&(s.r=So(s.r),s.g=So(s.g),s.b=So(s.b))),s},workingToColorSpace:function(s,a){return this.convert(s,this.workingColorSpace,a)},colorSpaceToWorking:function(s,a){return this.convert(s,a,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Is?Zl:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,a=this.workingColorSpace){return s.fromArray(this.spaces[a].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,a,r){return s.copy(this.spaces[a].toXYZ).multiply(this.spaces[r].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,a){return or("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),e.workingToColorSpace(s,a)},toWorkingColorSpace:function(s,a){return or("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),e.colorSpaceToWorking(s,a)}},t=[.64,.33,.3,.6,.15,.06],n=[.2126,.7152,.0722],i=[.3127,.329];return e.define({[Yl]:{primaries:t,whitePoint:i,transfer:Zl,toXYZ:_b,fromXYZ:bb,luminanceCoefficients:n,workingColorSpaceConfig:{unpackColorSpace:En},outputColorSpaceConfig:{drawingBufferColorSpace:En}},[En]:{primaries:t,whitePoint:i,transfer:he,toXYZ:_b,fromXYZ:bb,luminanceCoefficients:n,outputColorSpaceConfig:{drawingBufferColorSpace:En}}}),e}var Qt=SE();function Os(e){return e<.04045?e*.0773993808:Math.pow(e*.9478672986+.0521327014,2.4)}function So(e){return e<.0031308?e*12.92:1.055*Math.pow(e,.41666)-.055}var lo,Ph=class{static getDataURL(t,n="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let i;if(t instanceof HTMLCanvasElement)i=t;else{lo===void 0&&(lo=Jl("canvas")),lo.width=t.width,lo.height=t.height;let s=lo.getContext("2d");t instanceof ImageData?s.putImageData(t,0,0):s.drawImage(t,0,0,t.width,t.height),i=lo}return i.toDataURL(n)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){let n=Jl("canvas");n.width=t.width,n.height=t.height;let i=n.getContext("2d");i.drawImage(t,0,0,t.width,t.height);let s=i.getImageData(0,0,t.width,t.height),a=s.data;for(let r=0;r<a.length;r++)a[r]=Os(a[r]/255)*255;return i.putImageData(s,0,0),n}else if(t.data){let n=t.data.slice(0);for(let i=0;i<n.length;i++)n instanceof Uint8Array||n instanceof Uint8ClampedArray?n[i]=Math.floor(Os(n[i]/255)*255):n[i]=Os(n[i]);return{data:n,width:t.width,height:t.height}}else return Lt("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}},ME=0,Eo=class{constructor(t=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:ME++}),this.uuid=yc(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){let n=this.data;return typeof HTMLVideoElement<"u"&&n instanceof HTMLVideoElement?t.set(n.videoWidth,n.videoHeight,0):typeof VideoFrame<"u"&&n instanceof VideoFrame?t.set(n.displayWidth,n.displayHeight,0):n!==null?t.set(n.width,n.height,n.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){let n=t===void 0||typeof t=="string";if(!n&&t.images[this.uuid]!==void 0)return t.images[this.uuid];let i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let a;if(Array.isArray(s)){a=[];for(let r=0,o=s.length;r<o;r++)s[r].isDataTexture?a.push(Zm(s[r].image)):a.push(Zm(s[r]))}else a=Zm(s);i.url=a}return n||(t.images[this.uuid]=i),i}};function Zm(e){return typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap?Ph.getDataURL(e):e.data?{data:Array.from(e.data),width:e.width,height:e.height,type:e.data.constructor.name}:(Lt("Texture: Unable to serialize Texture."),{})}var TE=0,Km=new V,An=class e extends ns{constructor(t=e.DEFAULT_IMAGE,n=e.DEFAULT_MAPPING,i=ts,s=ts,a=vn,r=Ra,o=Ai,l=oi,c=e.DEFAULT_ANISOTROPY,u=Is){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:TE++}),this.uuid=yc(),this.name="",this.source=new Eo(t),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=a,this.minFilter=r,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new ie(0,0),this.repeat=new ie(1,1),this.center=new ie(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Bt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Km).x}get height(){return this.source.getSize(Km).y}get depth(){return this.source.getSize(Km).z}get image(){return this.source.data}set image(t){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,n){this.updateRanges.push({start:t,count:n})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.normalized=t.normalized,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(let n in t){let i=t[n];if(i===void 0){Lt(`Texture.setValues(): parameter '${n}' has value of undefined.`);continue}let s=this[n];if(s===void 0){Lt(`Texture.setValues(): property '${n}' does not exist.`);continue}s&&i&&s.isVector2&&i.isVector2||s&&i&&s.isVector3&&i.isVector3||s&&i&&s.isMatrix3&&i.isMatrix3?s.copy(i):this[n]=i}}toJSON(t){let n=t===void 0||typeof t=="string";if(!n&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];let i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),n||(t.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Lg)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Lh:t.x=t.x-Math.floor(t.x);break;case ts:t.x=t.x<0?0:1;break;case Uh:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Lh:t.y=t.y-Math.floor(t.y);break;case ts:t.y=t.y<0?0:1;break;case Uh:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}};An.DEFAULT_IMAGE=null;An.DEFAULT_MAPPING=Lg;An.DEFAULT_ANISOTROPY=1;var ze=class e{static{e.prototype.isVector4=!0}constructor(t=0,n=0,i=0,s=1){this.x=t,this.y=n,this.z=i,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,n,i,s){return this.x=t,this.y=n,this.z=i,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,n){switch(t){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;case 3:this.w=n;break;default:throw new Error("THREE.Vector4: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,n){return this.x=t.x+n.x,this.y=t.y+n.y,this.z=t.z+n.z,this.w=t.w+n.w,this}addScaledVector(t,n){return this.x+=t.x*n,this.y+=t.y*n,this.z+=t.z*n,this.w+=t.w*n,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,n){return this.x=t.x-n.x,this.y=t.y-n.y,this.z=t.z-n.z,this.w=t.w-n.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){let n=this.x,i=this.y,s=this.z,a=this.w,r=t.elements;return this.x=r[0]*n+r[4]*i+r[8]*s+r[12]*a,this.y=r[1]*n+r[5]*i+r[9]*s+r[13]*a,this.z=r[2]*n+r[6]*i+r[10]*s+r[14]*a,this.w=r[3]*n+r[7]*i+r[11]*s+r[15]*a,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);let n=Math.sqrt(1-t.w*t.w);return n<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/n,this.y=t.y/n,this.z=t.z/n),this}setAxisAngleFromRotationMatrix(t){let n,i,s,a,l=t.elements,c=l[0],u=l[4],f=l[8],h=l[1],d=l[5],m=l[9],b=l[2],g=l[6],p=l[10];if(Math.abs(u-h)<.01&&Math.abs(f-b)<.01&&Math.abs(m-g)<.01){if(Math.abs(u+h)<.1&&Math.abs(f+b)<.1&&Math.abs(m+g)<.1&&Math.abs(c+d+p-3)<.1)return this.set(1,0,0,0),this;n=Math.PI;let S=(c+1)/2,v=(d+1)/2,T=(p+1)/2,E=(u+h)/4,C=(f+b)/4,_=(m+g)/4;return S>v&&S>T?S<.01?(i=0,s=.707106781,a=.707106781):(i=Math.sqrt(S),s=E/i,a=C/i):v>T?v<.01?(i=.707106781,s=0,a=.707106781):(s=Math.sqrt(v),i=E/s,a=_/s):T<.01?(i=.707106781,s=.707106781,a=0):(a=Math.sqrt(T),i=C/a,s=_/a),this.set(i,s,a,n),this}let y=Math.sqrt((g-m)*(g-m)+(f-b)*(f-b)+(h-u)*(h-u));return Math.abs(y)<.001&&(y=1),this.x=(g-m)/y,this.y=(f-b)/y,this.z=(h-u)/y,this.w=Math.acos((c+d+p-1)/2),this}setFromMatrixPosition(t){let n=t.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this.w=n[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,n){return this.x=$t(this.x,t.x,n.x),this.y=$t(this.y,t.y,n.y),this.z=$t(this.z,t.z,n.z),this.w=$t(this.w,t.w,n.w),this}clampScalar(t,n){return this.x=$t(this.x,t,n),this.y=$t(this.y,t,n),this.z=$t(this.z,t,n),this.w=$t(this.w,t,n),this}clampLength(t,n){let i=this.length();return this.divideScalar(i||1).multiplyScalar($t(i,t,n))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,n){return this.x+=(t.x-this.x)*n,this.y+=(t.y-this.y)*n,this.z+=(t.z-this.z)*n,this.w+=(t.w-this.w)*n,this}lerpVectors(t,n,i){return this.x=t.x+(n.x-t.x)*i,this.y=t.y+(n.y-t.y)*i,this.z=t.z+(n.z-t.z)*i,this.w=t.w+(n.w-t.w)*i,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,n=0){return this.x=t[n],this.y=t[n+1],this.z=t[n+2],this.w=t[n+3],this}toArray(t=[],n=0){return t[n]=this.x,t[n+1]=this.y,t[n+2]=this.z,t[n+3]=this.w,t}fromBufferAttribute(t,n){return this.x=t.getX(n),this.y=t.getY(n),this.z=t.getZ(n),this.w=t.getW(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Bh=class extends ns{constructor(t=1,n=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:vn,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},i),this.isRenderTarget=!0,this.width=t,this.height=n,this.depth=i.depth,this.scissor=new ze(0,0,t,n),this.scissorTest=!1,this.viewport=new ze(0,0,t,n),this.textures=[];let s={width:t,height:n,depth:i.depth},a=new An(s),r=i.count;for(let o=0;o<r;o++)this.textures[o]=a.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveColorBuffer=i.resolveColorBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.storeMultisampledColorBuffer=i.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=i.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=i.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview,this.useArrayDepthTexture=i.useArrayDepthTexture}_setTextureOptions(t={}){let n={minFilter:vn,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(n.mapping=t.mapping),t.wrapS!==void 0&&(n.wrapS=t.wrapS),t.wrapT!==void 0&&(n.wrapT=t.wrapT),t.wrapR!==void 0&&(n.wrapR=t.wrapR),t.magFilter!==void 0&&(n.magFilter=t.magFilter),t.minFilter!==void 0&&(n.minFilter=t.minFilter),t.format!==void 0&&(n.format=t.format),t.type!==void 0&&(n.type=t.type),t.anisotropy!==void 0&&(n.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(n.colorSpace=t.colorSpace),t.flipY!==void 0&&(n.flipY=t.flipY),t.generateMipmaps!==void 0&&(n.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(n.internalFormat=t.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(n)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),t!==null&&t.renderTarget===null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,n,i=1){if(this.width!==t||this.height!==n||this.depth!==i){this.width=t,this.height=n,this.depth=i;for(let s=0,a=this.textures.length;s<a;s++)this.textures[s].image.width=t,this.textures[s].image.height=n,this.textures[s].image.depth=i,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,t,n),this.scissor.set(0,0,t,n)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let n=0,i=t.textures.length;n<i;n++){this.textures[n]=t.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0,this.textures[n].renderTarget=this;let s=Object.assign({},t.textures[n].image);this.textures[n].source=new Eo(s)}if(this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveColorBuffer=t.resolveColorBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,this.storeMultisampledColorBuffer=t.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=t.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=t.storeMultisampledStencilBuffer,t.depthTexture!==null)if(t.depthTexture.renderTarget===t){let n=t.depthTexture.clone();n.renderTarget=null,this.depthTexture=n}else this.depthTexture=t.depthTexture;return this.samples=t.samples,this.multiview=t.multiview,this.useArrayDepthTexture=t.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}},Xn=class extends Bh{constructor(t=1,n=1,i={}){super(t,n,i),this.isWebGLRenderTarget=!0}},Ql=class extends An{constructor(t=null,n=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:n,height:i,depth:s},this.magFilter=Ye,this.minFilter=Ye,this.wrapR=ts,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(t){return super.copy(t),this.wrapR=t.wrapR,this}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}};var zh=class extends An{constructor(t=null,n=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:n,height:i,depth:s},this.magFilter=Ye,this.minFilter=Ye,this.wrapR=ts,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(t){return super.copy(t),this.wrapR=t.wrapR,this}};var qe=class e{static{e.prototype.isMatrix4=!0}constructor(t,n,i,s,a,r,o,l,c,u,f,h,d,m,b,g){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,n,i,s,a,r,o,l,c,u,f,h,d,m,b,g)}set(t,n,i,s,a,r,o,l,c,u,f,h,d,m,b,g){let p=this.elements;return p[0]=t,p[4]=n,p[8]=i,p[12]=s,p[1]=a,p[5]=r,p[9]=o,p[13]=l,p[2]=c,p[6]=u,p[10]=f,p[14]=h,p[3]=d,p[7]=m,p[11]=b,p[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new e().fromArray(this.elements)}copy(t){let n=this.elements,i=t.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],n[9]=i[9],n[10]=i[10],n[11]=i[11],n[12]=i[12],n[13]=i[13],n[14]=i[14],n[15]=i[15],this}copyPosition(t){let n=this.elements,i=t.elements;return n[12]=i[12],n[13]=i[13],n[14]=i[14],this}setFromMatrix3(t){let n=t.elements;return this.set(n[0],n[3],n[6],0,n[1],n[4],n[7],0,n[2],n[5],n[8],0,0,0,0,1),this}extractBasis(t,n,i){return this.determinantAffine()===0?(t.set(1,0,0),n.set(0,1,0),i.set(0,0,1),this):(t.setFromMatrixColumn(this,0),n.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(t,n,i){return this.set(t.x,n.x,i.x,0,t.y,n.y,i.y,0,t.z,n.z,i.z,0,0,0,0,1),this}extractRotation(t){if(t.determinantAffine()===0)return this.identity();let n=this.elements,i=t.elements,s=1/co.setFromMatrixColumn(t,0).length(),a=1/co.setFromMatrixColumn(t,1).length(),r=1/co.setFromMatrixColumn(t,2).length();return n[0]=i[0]*s,n[1]=i[1]*s,n[2]=i[2]*s,n[3]=0,n[4]=i[4]*a,n[5]=i[5]*a,n[6]=i[6]*a,n[7]=0,n[8]=i[8]*r,n[9]=i[9]*r,n[10]=i[10]*r,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromEuler(t){let n=this.elements,i=t.x,s=t.y,a=t.z,r=Math.cos(i),o=Math.sin(i),l=Math.cos(s),c=Math.sin(s),u=Math.cos(a),f=Math.sin(a);if(t.order==="XYZ"){let h=r*u,d=r*f,m=o*u,b=o*f;n[0]=l*u,n[4]=-l*f,n[8]=c,n[1]=d+m*c,n[5]=h-b*c,n[9]=-o*l,n[2]=b-h*c,n[6]=m+d*c,n[10]=r*l}else if(t.order==="YXZ"){let h=l*u,d=l*f,m=c*u,b=c*f;n[0]=h+b*o,n[4]=m*o-d,n[8]=r*c,n[1]=r*f,n[5]=r*u,n[9]=-o,n[2]=d*o-m,n[6]=b+h*o,n[10]=r*l}else if(t.order==="ZXY"){let h=l*u,d=l*f,m=c*u,b=c*f;n[0]=h-b*o,n[4]=-r*f,n[8]=m+d*o,n[1]=d+m*o,n[5]=r*u,n[9]=b-h*o,n[2]=-r*c,n[6]=o,n[10]=r*l}else if(t.order==="ZYX"){let h=r*u,d=r*f,m=o*u,b=o*f;n[0]=l*u,n[4]=m*c-d,n[8]=h*c+b,n[1]=l*f,n[5]=b*c+h,n[9]=d*c-m,n[2]=-c,n[6]=o*l,n[10]=r*l}else if(t.order==="YZX"){let h=r*l,d=r*c,m=o*l,b=o*c;n[0]=l*u,n[4]=b-h*f,n[8]=m*f+d,n[1]=f,n[5]=r*u,n[9]=-o*u,n[2]=-c*u,n[6]=d*f+m,n[10]=h-b*f}else if(t.order==="XZY"){let h=r*l,d=r*c,m=o*l,b=o*c;n[0]=l*u,n[4]=-f,n[8]=c*u,n[1]=h*f+b,n[5]=r*u,n[9]=d*f-m,n[2]=m*f-d,n[6]=o*u,n[10]=b*f+h}return n[3]=0,n[7]=0,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromQuaternion(t){return this.compose(EE,t,AE)}lookAt(t,n,i){let s=this.elements;return ii.subVectors(t,n),ii.lengthSq()===0&&(ii.z=1),ii.normalize(),pa.crossVectors(i,ii),pa.lengthSq()===0&&(Math.abs(i.z)===1?ii.x+=1e-4:ii.z+=1e-4,ii.normalize(),pa.crossVectors(i,ii)),pa.normalize(),sh.crossVectors(ii,pa),s[0]=pa.x,s[4]=sh.x,s[8]=ii.x,s[1]=pa.y,s[5]=sh.y,s[9]=ii.y,s[2]=pa.z,s[6]=sh.z,s[10]=ii.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,n){let i=t.elements,s=n.elements,a=this.elements,r=i[0],o=i[4],l=i[8],c=i[12],u=i[1],f=i[5],h=i[9],d=i[13],m=i[2],b=i[6],g=i[10],p=i[14],y=i[3],S=i[7],v=i[11],T=i[15],E=s[0],C=s[4],_=s[8],A=s[12],R=s[1],O=s[5],F=s[9],X=s[13],U=s[2],G=s[6],J=s[10],I=s[14],it=s[3],q=s[7],tt=s[11],et=s[15];return a[0]=r*E+o*R+l*U+c*it,a[4]=r*C+o*O+l*G+c*q,a[8]=r*_+o*F+l*J+c*tt,a[12]=r*A+o*X+l*I+c*et,a[1]=u*E+f*R+h*U+d*it,a[5]=u*C+f*O+h*G+d*q,a[9]=u*_+f*F+h*J+d*tt,a[13]=u*A+f*X+h*I+d*et,a[2]=m*E+b*R+g*U+p*it,a[6]=m*C+b*O+g*G+p*q,a[10]=m*_+b*F+g*J+p*tt,a[14]=m*A+b*X+g*I+p*et,a[3]=y*E+S*R+v*U+T*it,a[7]=y*C+S*O+v*G+T*q,a[11]=y*_+S*F+v*J+T*tt,a[15]=y*A+S*X+v*I+T*et,this}multiplyScalar(t){let n=this.elements;return n[0]*=t,n[4]*=t,n[8]*=t,n[12]*=t,n[1]*=t,n[5]*=t,n[9]*=t,n[13]*=t,n[2]*=t,n[6]*=t,n[10]*=t,n[14]*=t,n[3]*=t,n[7]*=t,n[11]*=t,n[15]*=t,this}determinant(){let t=this.elements,n=t[0],i=t[4],s=t[8],a=t[12],r=t[1],o=t[5],l=t[9],c=t[13],u=t[2],f=t[6],h=t[10],d=t[14],m=t[3],b=t[7],g=t[11],p=t[15],y=l*d-c*h,S=o*d-c*f,v=o*h-l*f,T=r*d-c*u,E=r*h-l*u,C=r*f-o*u;return n*(b*y-g*S+p*v)-i*(m*y-g*T+p*E)+s*(m*S-b*T+p*C)-a*(m*v-b*E+g*C)}determinantAffine(){let t=this.elements,n=t[0],i=t[4],s=t[8],a=t[1],r=t[5],o=t[9],l=t[2],c=t[6],u=t[10];return n*(r*u-o*c)-i*(a*u-o*l)+s*(a*c-r*l)}transpose(){let t=this.elements,n;return n=t[1],t[1]=t[4],t[4]=n,n=t[2],t[2]=t[8],t[8]=n,n=t[6],t[6]=t[9],t[9]=n,n=t[3],t[3]=t[12],t[12]=n,n=t[7],t[7]=t[13],t[13]=n,n=t[11],t[11]=t[14],t[14]=n,this}setPosition(t,n,i){let s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=n,s[14]=i),this}invert(){let t=this.elements,n=t[0],i=t[1],s=t[2],a=t[3],r=t[4],o=t[5],l=t[6],c=t[7],u=t[8],f=t[9],h=t[10],d=t[11],m=t[12],b=t[13],g=t[14],p=t[15],y=n*o-i*r,S=n*l-s*r,v=n*c-a*r,T=i*l-s*o,E=i*c-a*o,C=s*c-a*l,_=u*b-f*m,A=u*g-h*m,R=u*p-d*m,O=f*g-h*b,F=f*p-d*b,X=h*p-d*g,U=y*X-S*F+v*O+T*R-E*A+C*_;if(U===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let G=1/U;return t[0]=(o*X-l*F+c*O)*G,t[1]=(s*F-i*X-a*O)*G,t[2]=(b*C-g*E+p*T)*G,t[3]=(h*E-f*C-d*T)*G,t[4]=(l*R-r*X-c*A)*G,t[5]=(n*X-s*R+a*A)*G,t[6]=(g*v-m*C-p*S)*G,t[7]=(u*C-h*v+d*S)*G,t[8]=(r*F-o*R+c*_)*G,t[9]=(i*R-n*F-a*_)*G,t[10]=(m*E-b*v+p*y)*G,t[11]=(f*v-u*E-d*y)*G,t[12]=(o*A-r*O-l*_)*G,t[13]=(n*O-i*A+s*_)*G,t[14]=(b*S-m*T-g*y)*G,t[15]=(u*T-f*S+h*y)*G,this}scale(t){let n=this.elements,i=t.x,s=t.y,a=t.z;return n[0]*=i,n[4]*=s,n[8]*=a,n[1]*=i,n[5]*=s,n[9]*=a,n[2]*=i,n[6]*=s,n[10]*=a,n[3]*=i,n[7]*=s,n[11]*=a,this}getMaxScaleOnAxis(){let t=this.elements,n=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(n,i,s))}makeTranslation(t,n,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,n,0,0,1,i,0,0,0,1),this}makeRotationX(t){let n=Math.cos(t),i=Math.sin(t);return this.set(1,0,0,0,0,n,-i,0,0,i,n,0,0,0,0,1),this}makeRotationY(t){let n=Math.cos(t),i=Math.sin(t);return this.set(n,0,i,0,0,1,0,0,-i,0,n,0,0,0,0,1),this}makeRotationZ(t){let n=Math.cos(t),i=Math.sin(t);return this.set(n,-i,0,0,i,n,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,n){let i=Math.cos(n),s=Math.sin(n),a=1-i,r=t.x,o=t.y,l=t.z,c=a*r,u=a*o;return this.set(c*r+i,c*o-s*l,c*l+s*o,0,c*o+s*l,u*o+i,u*l-s*r,0,c*l-s*o,u*l+s*r,a*l*l+i,0,0,0,0,1),this}makeScale(t,n,i){return this.set(t,0,0,0,0,n,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,n,i,s,a,r){return this.set(1,i,a,0,t,1,r,0,n,s,1,0,0,0,0,1),this}compose(t,n,i){let s=this.elements,a=n._x,r=n._y,o=n._z,l=n._w,c=a+a,u=r+r,f=o+o,h=a*c,d=a*u,m=a*f,b=r*u,g=r*f,p=o*f,y=l*c,S=l*u,v=l*f,T=i.x,E=i.y,C=i.z;return s[0]=(1-(b+p))*T,s[1]=(d+v)*T,s[2]=(m-S)*T,s[3]=0,s[4]=(d-v)*E,s[5]=(1-(h+p))*E,s[6]=(g+y)*E,s[7]=0,s[8]=(m+S)*C,s[9]=(g-y)*C,s[10]=(1-(h+b))*C,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,n,i){let s=this.elements;t.x=s[12],t.y=s[13],t.z=s[14];let a=this.determinantAffine();if(a===0)return i.set(1,1,1),n.identity(),this;let r=co.set(s[0],s[1],s[2]).length(),o=co.set(s[4],s[5],s[6]).length(),l=co.set(s[8],s[9],s[10]).length();a<0&&(r=-r),Ui.copy(this);let c=1/r,u=1/o,f=1/l;return Ui.elements[0]*=c,Ui.elements[1]*=c,Ui.elements[2]*=c,Ui.elements[4]*=u,Ui.elements[5]*=u,Ui.elements[6]*=u,Ui.elements[8]*=f,Ui.elements[9]*=f,Ui.elements[10]*=f,n.setFromRotationMatrix(Ui),i.x=r,i.y=o,i.z=l,this}makePerspective(t,n,i,s,a,r,o=Bi,l=!1){let c=this.elements,u=2*a/(n-t),f=2*a/(i-s),h=(n+t)/(n-t),d=(i+s)/(i-s),m,b;if(l)m=a/(r-a),b=r*a/(r-a);else if(o===Bi)m=-(r+a)/(r-a),b=-2*r*a/(r-a);else if(o===Kl)m=-r/(r-a),b=-r*a/(r-a);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=u,c[4]=0,c[8]=h,c[12]=0,c[1]=0,c[5]=f,c[9]=d,c[13]=0,c[2]=0,c[6]=0,c[10]=m,c[14]=b,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,n,i,s,a,r,o=Bi,l=!1){let c=this.elements,u=2/(n-t),f=2/(i-s),h=-(n+t)/(n-t),d=-(i+s)/(i-s),m,b;if(l)m=1/(r-a),b=r/(r-a);else if(o===Bi)m=-2/(r-a),b=-(r+a)/(r-a);else if(o===Kl)m=-1/(r-a),b=-a/(r-a);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=u,c[4]=0,c[8]=0,c[12]=h,c[1]=0,c[5]=f,c[9]=0,c[13]=d,c[2]=0,c[6]=0,c[10]=m,c[14]=b,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){let n=this.elements,i=t.elements;for(let s=0;s<16;s++)if(n[s]!==i[s])return!1;return!0}fromArray(t,n=0){for(let i=0;i<16;i++)this.elements[i]=t[i+n];return this}toArray(t=[],n=0){let i=this.elements;return t[n]=i[0],t[n+1]=i[1],t[n+2]=i[2],t[n+3]=i[3],t[n+4]=i[4],t[n+5]=i[5],t[n+6]=i[6],t[n+7]=i[7],t[n+8]=i[8],t[n+9]=i[9],t[n+10]=i[10],t[n+11]=i[11],t[n+12]=i[12],t[n+13]=i[13],t[n+14]=i[14],t[n+15]=i[15],t}},co=new V,Ui=new qe,EE=new V(0,0,0),AE=new V(1,1,1),pa=new V,sh=new V,ii=new V,Sb=new qe,Mb=new is,_a=class e{constructor(t=0,n=0,i=0,s=e.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=n,this._z=i,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,n,i,s=this._order){return this._x=t,this._y=n,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,n=this._order,i=!0){let s=t.elements,a=s[0],r=s[4],o=s[8],l=s[1],c=s[5],u=s[9],f=s[2],h=s[6],d=s[10];switch(n){case"XYZ":this._y=Math.asin($t(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-u,d),this._z=Math.atan2(-r,a)):(this._x=Math.atan2(h,c),this._z=0);break;case"YXZ":this._x=Math.asin(-$t(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(o,d),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-f,a),this._z=0);break;case"ZXY":this._x=Math.asin($t(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-f,d),this._z=Math.atan2(-r,c)):(this._y=0,this._z=Math.atan2(l,a));break;case"ZYX":this._y=Math.asin(-$t(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(h,d),this._z=Math.atan2(l,a)):(this._x=0,this._z=Math.atan2(-r,c));break;case"YZX":this._z=Math.asin($t(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-f,a)):(this._x=0,this._y=Math.atan2(o,d));break;case"XZY":this._z=Math.asin(-$t(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(h,c),this._y=Math.atan2(o,a)):(this._x=Math.atan2(-u,d),this._y=0);break;default:Lt("Euler: .setFromRotationMatrix() encountered an unknown order: "+n)}return this._order=n,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,n,i){return Sb.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Sb,n,i)}setFromVector3(t,n=this._order){return this.set(t.x,t.y,t.z,n)}reorder(t){return Mb.setFromEuler(this),this.setFromQuaternion(Mb,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],n=0){return t[n]=this._x,t[n+1]=this._y,t[n+2]=this._z,t[n+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};_a.DEFAULT_ORDER="XYZ";var jl=class{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}},wE=0,Tb=new V,uo=new is,Rs=new qe,ah=new V,Vl=new V,CE=new V,RE=new is,Eb=new V(1,0,0),Ab=new V(0,1,0),wb=new V(0,0,1),Cb={type:"added"},NE={type:"removed"},ho={type:"childadded",child:null},Jm={type:"childremoved",child:null},Mi=class e extends ns{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:wE++}),this.uuid=yc(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=e.DEFAULT_UP.clone();let t=new V,n=new _a,i=new is,s=new V(1,1,1);function a(){i.setFromEuler(n,!1)}function r(){n.setFromQuaternion(i,void 0,!1)}n._onChange(a),i._onChange(r),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new qe},normalMatrix:{value:new Bt}}),this.matrix=new qe,this.matrixWorld=new qe,this.matrixAutoUpdate=e.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=e.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new jl,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,n){this.quaternion.setFromAxisAngle(t,n)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,n){return uo.setFromAxisAngle(t,n),this.quaternion.multiply(uo),this}rotateOnWorldAxis(t,n){return uo.setFromAxisAngle(t,n),this.quaternion.premultiply(uo),this}rotateX(t){return this.rotateOnAxis(Eb,t)}rotateY(t){return this.rotateOnAxis(Ab,t)}rotateZ(t){return this.rotateOnAxis(wb,t)}translateOnAxis(t,n){return Tb.copy(t).applyQuaternion(this.quaternion),this.position.add(Tb.multiplyScalar(n)),this}translateX(t){return this.translateOnAxis(Eb,t)}translateY(t){return this.translateOnAxis(Ab,t)}translateZ(t){return this.translateOnAxis(wb,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Rs.copy(this.matrixWorld).invert())}lookAt(t,n,i){t.isVector3?ah.copy(t):ah.set(t,n,i);let s=this.parent;this.updateWorldMatrix(!0,!1),Vl.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Rs.lookAt(Vl,ah,this.up):Rs.lookAt(ah,Vl,this.up),this.quaternion.setFromRotationMatrix(Rs),s&&(Rs.extractRotation(s.matrixWorld),uo.setFromRotationMatrix(Rs),this.quaternion.premultiply(uo.invert()))}add(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.add(arguments[n]);return this}return t===this?(It("Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Cb),ho.child=t,this.dispatchEvent(ho),ho.child=null):It("Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}let n=this.children.indexOf(t);return n!==-1&&(t.parent=null,this.children.splice(n,1),t.dispatchEvent(NE),Jm.child=t,this.dispatchEvent(Jm),Jm.child=null),this}removeFromParent(){let t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Rs.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Rs.multiply(t.parent.matrixWorld)),t.applyMatrix4(Rs),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Cb),ho.child=t,this.dispatchEvent(ho),ho.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,n){if(this[t]===n)return this;for(let i=0,s=this.children.length;i<s;i++){let r=this.children[i].getObjectByProperty(t,n);if(r!==void 0)return r}}getObjectsByProperty(t,n,i=[]){this[t]===n&&i.push(this);let s=this.children;for(let a=0,r=s.length;a<r;a++)s[a].getObjectsByProperty(t,n,i);return i}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Vl,t,CE),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Vl,RE,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let n=this.matrixWorld.elements;return t.set(n[8],n[9],n[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(t){t(this);let n=this.children;for(let i=0,s=n.length;i<s;i++)n[i].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);let n=this.children;for(let i=0,s=n.length;i<s;i++)n[i].traverseVisible(t)}traverseAncestors(t){let n=this.parent;n!==null&&(t(n),n.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let t=this.pivot;if(t!==null){let n=t.x,i=t.y,s=t.z,a=this.matrix.elements;a[12]+=n-a[0]*n-a[4]*i-a[8]*s,a[13]+=i-a[1]*n-a[5]*i-a[9]*s,a[14]+=s-a[2]*n-a[6]*i-a[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);let n=this.children;for(let i=0,s=n.length;i<s;i++)n[i].updateMatrixWorld(t)}updateWorldMatrix(t,n,i=!1){let s=this.parent;if(t===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||i)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,i=!0),n===!0){let a=this.children;for(let r=0,o=a.length;r<o;r++)a[r].updateWorldMatrix(!1,!0,i)}}toJSON(t){let n=t===void 0||typeof t=="string",i={};n&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,s.name=this.name,s.castShadow=this.castShadow,s.receiveShadow=this.receiveShadow,s.visible=this.visible,s.frustumCulled=this.frustumCulled,s.renderOrder=this.renderOrder,s.static=this.static,s.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(t),s.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function a(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=a(t.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let l=o.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){let f=l[c];a(t.shapes,f)}else a(t.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(a(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(a(t.materials,this.material[l]));s.material=o}else s.material=a(t.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){let l=this.animations[o];s.animations.push(a(t.animations,l))}}if(n){let o=r(t.geometries),l=r(t.materials),c=r(t.textures),u=r(t.images),f=r(t.shapes),h=r(t.skeletons),d=r(t.animations),m=r(t.nodes);o.length>0&&(i.geometries=o),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),u.length>0&&(i.images=u),f.length>0&&(i.shapes=f),h.length>0&&(i.skeletons=h),d.length>0&&(i.animations=d),m.length>0&&(i.nodes=m)}return i.object=s,i;function r(o){let l=[];for(let c in o){let u=o[c];delete u.metadata,l.push(u)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,n=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.pivot=t.pivot!==null?t.pivot.clone():null,this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.static=t.static,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),n===!0)for(let i=0;i<t.children.length;i++){let s=t.children[i];this.add(s.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}};Mi.DEFAULT_UP=new V(0,1,0);Mi.DEFAULT_MATRIX_AUTO_UPDATE=!0;Mi.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Ln=class extends Mi{constructor(){super(),this.isGroup=!0,this.type="Group"}},DE={type:"move"},Ao=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Ln,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Ln,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new V,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new V),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Ln,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new V,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new V,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){let n=this._hand;if(n)for(let i of t.hand.values())this._getHandJoint(n,i)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,n,i){let s=null,a=null,r=null,o=this._targetRay,l=this._grip,c=this._hand;if(t&&n.session.visibilityState!=="visible-blurred"){if(c&&t.hand){r=!0;for(let b of t.hand.values()){let g=n.getJointPose(b,i),p=this._getHandJoint(c,b);g!==null&&(p.matrix.fromArray(g.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=g.radius),p.visible=g!==null}let u=c.joints["index-finger-tip"],f=c.joints["thumb-tip"],h=u.position.distanceTo(f.position),d=.02,m=.005;c.inputState.pinching&&h>d+m?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&h<=d-m&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(a=n.getPose(t.gripSpace,i),a!==null&&(l.matrix.fromArray(a.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,a.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(a.linearVelocity)):l.hasLinearVelocity=!1,a.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(a.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:t,target:this})));o!==null&&(s=n.getPose(t.targetRaySpace,i),s===null&&a!==null&&(s=a),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(DE)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=a!==null),c!==null&&(c.visible=r!==null),this}_getHandJoint(t,n){if(t.joints[n.jointName]===void 0){let i=new Ln;i.matrixAutoUpdate=!1,i.visible=!1,t.joints[n.jointName]=i,t.add(i)}return t.joints[n.jointName]}},bS={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ma={h:0,s:0,l:0},rh={h:0,s:0,l:0};function Qm(e,t,n){return n<0&&(n+=1),n>1&&(n-=1),n<1/6?e+(t-e)*6*n:n<1/2?t:n<2/3?e+(t-e)*6*(2/3-n):e}var se=class{constructor(t,n,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,n,i)}set(t,n,i){if(n===void 0&&i===void 0){let s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,n,i);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,n=En){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Qt.colorSpaceToWorking(this,n),this}setRGB(t,n,i,s=Qt.workingColorSpace){return this.r=t,this.g=n,this.b=i,Qt.colorSpaceToWorking(this,s),this}setHSL(t,n,i,s=Qt.workingColorSpace){if(t=bE(t,1),n=$t(n,0,1),i=$t(i,0,1),n===0)this.r=this.g=this.b=i;else{let a=i<=.5?i*(1+n):i+n-i*n,r=2*i-a;this.r=Qm(r,a,t+1/3),this.g=Qm(r,a,t),this.b=Qm(r,a,t-1/3)}return Qt.colorSpaceToWorking(this,s),this}setStyle(t,n=En){function i(a){a!==void 0&&parseFloat(a)<1&&Lt("Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let a,r=s[1],o=s[2];switch(r){case"rgb":case"rgba":if(a=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(a[4]),this.setRGB(Math.min(255,parseInt(a[1],10))/255,Math.min(255,parseInt(a[2],10))/255,Math.min(255,parseInt(a[3],10))/255,n);if(a=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(a[4]),this.setRGB(Math.min(100,parseInt(a[1],10))/100,Math.min(100,parseInt(a[2],10))/100,Math.min(100,parseInt(a[3],10))/100,n);break;case"hsl":case"hsla":if(a=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(a[4]),this.setHSL(parseFloat(a[1])/360,parseFloat(a[2])/100,parseFloat(a[3])/100,n);break;default:Lt("Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){let a=s[1],r=a.length;if(r===3)return this.setRGB(parseInt(a.charAt(0),16)/15,parseInt(a.charAt(1),16)/15,parseInt(a.charAt(2),16)/15,n);if(r===6)return this.setHex(parseInt(a,16),n);Lt("Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,n);return this}setColorName(t,n=En){let i=bS[t.toLowerCase()];return i!==void 0?this.setHex(i,n):Lt("Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Os(t.r),this.g=Os(t.g),this.b=Os(t.b),this}copyLinearToSRGB(t){return this.r=So(t.r),this.g=So(t.g),this.b=So(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=En){return Qt.workingToColorSpace(Tn.copy(this),t),Math.round($t(Tn.r*255,0,255))*65536+Math.round($t(Tn.g*255,0,255))*256+Math.round($t(Tn.b*255,0,255))}getHexString(t=En){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,n=Qt.workingColorSpace){Qt.workingToColorSpace(Tn.copy(this),n);let i=Tn.r,s=Tn.g,a=Tn.b,r=Math.max(i,s,a),o=Math.min(i,s,a),l,c,u=(o+r)/2;if(o===r)l=0,c=0;else{let f=r-o;switch(c=u<=.5?f/(r+o):f/(2-r-o),r){case i:l=(s-a)/f+(s<a?6:0);break;case s:l=(a-i)/f+2;break;case a:l=(i-s)/f+4;break}l/=6}return t.h=l,t.s=c,t.l=u,t}getRGB(t,n=Qt.workingColorSpace){return Qt.workingToColorSpace(Tn.copy(this),n),t.r=Tn.r,t.g=Tn.g,t.b=Tn.b,t}getStyle(t=En){Qt.workingToColorSpace(Tn.copy(this),t);let n=Tn.r,i=Tn.g,s=Tn.b;return t!==En?`color(${t} ${n.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(n*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(t,n,i){return this.getHSL(ma),this.setHSL(ma.h+t,ma.s+n,ma.l+i)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,n){return this.r=t.r+n.r,this.g=t.g+n.g,this.b=t.b+n.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,n){return this.r+=(t.r-this.r)*n,this.g+=(t.g-this.g)*n,this.b+=(t.b-this.b)*n,this}lerpColors(t,n,i){return this.r=t.r+(n.r-t.r)*i,this.g=t.g+(n.g-t.g)*i,this.b=t.b+(n.b-t.b)*i,this}lerpHSL(t,n){this.getHSL(ma),t.getHSL(rh);let i=Xm(ma.h,rh.h,n),s=Xm(ma.s,rh.s,n),a=Xm(ma.l,rh.l,n);return this.setHSL(i,s,a),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){let n=this.r,i=this.g,s=this.b,a=t.elements;return this.r=a[0]*n+a[3]*i+a[6]*s,this.g=a[1]*n+a[4]*i+a[7]*s,this.b=a[2]*n+a[5]*i+a[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,n=0){return this.r=t[n],this.g=t[n+1],this.b=t[n+2],this}toArray(t=[],n=0){return t[n]=this.r,t[n+1]=this.g,t[n+2]=this.b,t}fromBufferAttribute(t,n){return this.r=t.getX(n),this.g=t.getY(n),this.b=t.getZ(n),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Tn=new se;se.NAMES=bS;var $l=class extends Mi{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new _a,this.environmentIntensity=1,this.environmentRotation=new _a,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,n){return super.copy(t,n),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){let n=super.toJSON(t);return this.fog!==null&&(n.object.fog=this.fog.toJSON()),n.object.backgroundBlurriness=this.backgroundBlurriness,n.object.backgroundIntensity=this.backgroundIntensity,n.object.backgroundRotation=this.backgroundRotation.toArray(),n.object.environmentIntensity=this.environmentIntensity,n.object.environmentRotation=this.environmentRotation.toArray(),n}},Oi=new V,Ns=new V,jm=new V,Ds=new V,fo=new V,po=new V,Rb=new V,$m=new V,tg=new V,eg=new V,ng=new ze,ig=new ze,sg=new ze,va=class e{constructor(t=new V,n=new V,i=new V){this.a=t,this.b=n,this.c=i}static getNormal(t,n,i,s){s.subVectors(i,n),Oi.subVectors(t,n),s.cross(Oi);let a=s.lengthSq();return a>0?s.multiplyScalar(1/Math.sqrt(a)):s.set(0,0,0)}static getBarycoord(t,n,i,s,a){Oi.subVectors(s,n),Ns.subVectors(i,n),jm.subVectors(t,n);let r=Oi.dot(Oi),o=Oi.dot(Ns),l=Oi.dot(jm),c=Ns.dot(Ns),u=Ns.dot(jm),f=r*c-o*o;if(f===0)return a.set(0,0,0),null;let h=1/f,d=(c*l-o*u)*h,m=(r*u-o*l)*h;return a.set(1-d-m,m,d)}static containsPoint(t,n,i,s){return this.getBarycoord(t,n,i,s,Ds)===null?!1:Ds.x>=0&&Ds.y>=0&&Ds.x+Ds.y<=1}static getInterpolation(t,n,i,s,a,r,o,l){return this.getBarycoord(t,n,i,s,Ds)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(a,Ds.x),l.addScaledVector(r,Ds.y),l.addScaledVector(o,Ds.z),l)}static getInterpolatedAttribute(t,n,i,s,a,r){return ng.setScalar(0),ig.setScalar(0),sg.setScalar(0),ng.fromBufferAttribute(t,n),ig.fromBufferAttribute(t,i),sg.fromBufferAttribute(t,s),r.setScalar(0),r.addScaledVector(ng,a.x),r.addScaledVector(ig,a.y),r.addScaledVector(sg,a.z),r}static isFrontFacing(t,n,i,s){return Oi.subVectors(i,n),Ns.subVectors(t,n),Oi.cross(Ns).dot(s)<0}set(t,n,i){return this.a.copy(t),this.b.copy(n),this.c.copy(i),this}setFromPointsAndIndices(t,n,i,s){return this.a.copy(t[n]),this.b.copy(t[i]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,n,i,s){return this.a.fromBufferAttribute(t,n),this.b.fromBufferAttribute(t,i),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Oi.subVectors(this.c,this.b),Ns.subVectors(this.a,this.b),Oi.cross(Ns).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return e.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,n){return e.getBarycoord(t,this.a,this.b,this.c,n)}getInterpolation(t,n,i,s,a){return e.getInterpolation(t,this.a,this.b,this.c,n,i,s,a)}containsPoint(t){return e.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return e.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,n){let i=this.a,s=this.b,a=this.c,r,o;fo.subVectors(s,i),po.subVectors(a,i),$m.subVectors(t,i);let l=fo.dot($m),c=po.dot($m);if(l<=0&&c<=0)return n.copy(i);tg.subVectors(t,s);let u=fo.dot(tg),f=po.dot(tg);if(u>=0&&f<=u)return n.copy(s);let h=l*f-u*c;if(h<=0&&l>=0&&u<=0)return r=l/(l-u),n.copy(i).addScaledVector(fo,r);eg.subVectors(t,a);let d=fo.dot(eg),m=po.dot(eg);if(m>=0&&d<=m)return n.copy(a);let b=d*c-l*m;if(b<=0&&c>=0&&m<=0)return o=c/(c-m),n.copy(i).addScaledVector(po,o);let g=u*m-d*f;if(g<=0&&f-u>=0&&d-m>=0)return Rb.subVectors(a,s),o=(f-u)/(f-u+(d-m)),n.copy(s).addScaledVector(Rb,o);let p=1/(g+b+h);return r=b*p,o=h*p,n.copy(i).addScaledVector(fo,r).addScaledVector(po,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}},ba=class{constructor(t=new V(1/0,1/0,1/0),n=new V(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=n}set(t,n){return this.min.copy(t),this.max.copy(n),this}setFromArray(t){this.makeEmpty();for(let n=0,i=t.length;n<i;n+=3)this.expandByPoint(Ii.fromArray(t,n));return this}setFromBufferAttribute(t){this.makeEmpty();for(let n=0,i=t.count;n<i;n++)this.expandByPoint(Ii.fromBufferAttribute(t,n));return this}setFromPoints(t){this.makeEmpty();for(let n=0,i=t.length;n<i;n++)this.expandByPoint(t[n]);return this}setFromCenterAndSize(t,n){let i=Ii.copy(n).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}setFromObject(t,n=!1){return this.makeEmpty(),this.expandByObject(t,n)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,n=!1){t.updateWorldMatrix(!1,!1);let i=t.geometry;if(i!==void 0){let a=i.getAttribute("position");if(n===!0&&a!==void 0&&t.isInstancedMesh!==!0)for(let r=0,o=a.count;r<o;r++)t.isMesh===!0?t.getVertexPosition(r,Ii):Ii.fromBufferAttribute(a,r),Ii.applyMatrix4(t.matrixWorld),this.expandByPoint(Ii);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),oh.copy(t.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),oh.copy(i.boundingBox)),oh.applyMatrix4(t.matrixWorld),this.union(oh)}let s=t.children;for(let a=0,r=s.length;a<r;a++)this.expandByObject(s[a],n);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,n){return n.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Ii),Ii.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let n,i;return t.normal.x>0?(n=t.normal.x*this.min.x,i=t.normal.x*this.max.x):(n=t.normal.x*this.max.x,i=t.normal.x*this.min.x),t.normal.y>0?(n+=t.normal.y*this.min.y,i+=t.normal.y*this.max.y):(n+=t.normal.y*this.max.y,i+=t.normal.y*this.min.y),t.normal.z>0?(n+=t.normal.z*this.min.z,i+=t.normal.z*this.max.z):(n+=t.normal.z*this.max.z,i+=t.normal.z*this.min.z),n<=-t.constant&&i>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Gl),lh.subVectors(this.max,Gl),mo.subVectors(t.a,Gl),go.subVectors(t.b,Gl),yo.subVectors(t.c,Gl),ga.subVectors(go,mo),ya.subVectors(yo,go),ir.subVectors(mo,yo);let n=[0,-ga.z,ga.y,0,-ya.z,ya.y,0,-ir.z,ir.y,ga.z,0,-ga.x,ya.z,0,-ya.x,ir.z,0,-ir.x,-ga.y,ga.x,0,-ya.y,ya.x,0,-ir.y,ir.x,0];return!ag(n,mo,go,yo,lh)||(n=[1,0,0,0,1,0,0,0,1],!ag(n,mo,go,yo,lh))?!1:(ch.crossVectors(ga,ya),n=[ch.x,ch.y,ch.z],ag(n,mo,go,yo,lh))}clampPoint(t,n){return n.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Ii).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Ii).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Ls[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Ls[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Ls[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Ls[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Ls[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Ls[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Ls[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Ls[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Ls),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}},Ls=[new V,new V,new V,new V,new V,new V,new V,new V],Ii=new V,oh=new ba,mo=new V,go=new V,yo=new V,ga=new V,ya=new V,ir=new V,Gl=new V,lh=new V,ch=new V,sr=new V;function ag(e,t,n,i,s){for(let a=0,r=e.length-3;a<=r;a+=3){sr.fromArray(e,a);let o=s.x*Math.abs(sr.x)+s.y*Math.abs(sr.y)+s.z*Math.abs(sr.z),l=t.dot(sr),c=n.dot(sr),u=i.dot(sr);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>o)return!1}return!0}var tn=new V,uh=new ie,LE=0,Si=class extends ns{constructor(t,n,i=!1){if(super(),Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:LE++}),this.name="",this.array=t,this.itemSize=n,this.count=t!==void 0?t.length/n:0,this.normalized=i,this.usage=gS,this.updateRanges=[],this.gpuType=ki,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,n){this.updateRanges.push({start:t,count:n})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,n,i){t*=this.itemSize,i*=n.itemSize;for(let s=0,a=this.itemSize;s<a;s++)this.array[t+s]=n.array[i+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let n=0,i=this.count;n<i;n++)uh.fromBufferAttribute(this,n),uh.applyMatrix3(t),this.setXY(n,uh.x,uh.y);else if(this.itemSize===3)for(let n=0,i=this.count;n<i;n++)tn.fromBufferAttribute(this,n),tn.applyMatrix3(t),this.setXYZ(n,tn.x,tn.y,tn.z);return this}applyMatrix4(t){for(let n=0,i=this.count;n<i;n++)tn.fromBufferAttribute(this,n),tn.applyMatrix4(t),this.setXYZ(n,tn.x,tn.y,tn.z);return this}applyNormalMatrix(t){for(let n=0,i=this.count;n<i;n++)tn.fromBufferAttribute(this,n),tn.applyNormalMatrix(t),this.setXYZ(n,tn.x,tn.y,tn.z);return this}transformDirection(t){for(let n=0,i=this.count;n<i;n++)tn.fromBufferAttribute(this,n),tn.transformDirection(t),this.setXYZ(n,tn.x,tn.y,tn.z);return this}set(t,n=0){return this.array.set(t,n),this}getComponent(t,n){let i=this.array[t*this.itemSize+n];return this.normalized&&(i=Hl(i,this.array)),i}setComponent(t,n,i){return this.normalized&&(i=Gn(i,this.array)),this.array[t*this.itemSize+n]=i,this}getX(t){let n=this.array[t*this.itemSize];return this.normalized&&(n=Hl(n,this.array)),n}setX(t,n){return this.normalized&&(n=Gn(n,this.array)),this.array[t*this.itemSize]=n,this}getY(t){let n=this.array[t*this.itemSize+1];return this.normalized&&(n=Hl(n,this.array)),n}setY(t,n){return this.normalized&&(n=Gn(n,this.array)),this.array[t*this.itemSize+1]=n,this}getZ(t){let n=this.array[t*this.itemSize+2];return this.normalized&&(n=Hl(n,this.array)),n}setZ(t,n){return this.normalized&&(n=Gn(n,this.array)),this.array[t*this.itemSize+2]=n,this}getW(t){let n=this.array[t*this.itemSize+3];return this.normalized&&(n=Hl(n,this.array)),n}setW(t,n){return this.normalized&&(n=Gn(n,this.array)),this.array[t*this.itemSize+3]=n,this}setXY(t,n,i){return t*=this.itemSize,this.normalized&&(n=Gn(n,this.array),i=Gn(i,this.array)),this.array[t+0]=n,this.array[t+1]=i,this}setXYZ(t,n,i,s){return t*=this.itemSize,this.normalized&&(n=Gn(n,this.array),i=Gn(i,this.array),s=Gn(s,this.array)),this.array[t+0]=n,this.array[t+1]=i,this.array[t+2]=s,this}setXYZW(t,n,i,s,a){return t*=this.itemSize,this.normalized&&(n=Gn(n,this.array),i=Gn(i,this.array),s=Gn(s,this.array),a=Gn(a,this.array)),this.array[t+0]=n,this.array[t+1]=i,this.array[t+2]=s,this.array[t+3]=a,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return t.name=this.name,t.usage=this.usage,t.gpuType=this.gpuType,t}dispose(){this.dispatchEvent({type:"dispose"})}};var tc=class extends Si{constructor(t,n,i){super(new Uint16Array(t),n,i)}};var ec=class extends Si{constructor(t,n,i){super(new Uint32Array(t),n,i)}};var sn=class extends Si{constructor(t,n,i){super(new Float32Array(t),n,i)}},UE=new ba,Wl=new V,rg=new V,wo=class{constructor(t=new V,n=-1){this.isSphere=!0,this.center=t,this.radius=n}set(t,n){return this.center.copy(t),this.radius=n,this}setFromPoints(t,n){let i=this.center;n!==void 0?i.copy(n):UE.setFromPoints(t).getCenter(i);let s=0;for(let a=0,r=t.length;a<r;a++)s=Math.max(s,i.distanceToSquared(t[a]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){let n=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=n*n}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,n){let i=this.center.distanceToSquared(t);return n.copy(t),i>this.radius*this.radius&&(n.sub(this.center).normalize(),n.multiplyScalar(this.radius).add(this.center)),n}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Wl.subVectors(t,this.center);let n=Wl.lengthSq();if(n>this.radius*this.radius){let i=Math.sqrt(n),s=(i-this.radius)*.5;this.center.addScaledVector(Wl,s/i),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(rg.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Wl.copy(t.center).add(rg)),this.expandByPoint(Wl.copy(t.center).sub(rg))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}},OE=0,bi=new qe,og=new Mi,xo=new V,si=new ba,Xl=new ba,dn=new V,qn=class e extends ns{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:OE++}),this.uuid=yc(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(vE(t)?ec:tc)(t,1):this.index=t,this}setIndirect(t,n=0){return this.indirect=t,this.indirectOffset=n,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,n){return this.attributes[t]=n,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,n,i=0){this.groups.push({start:t,count:n,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(t,n){this.drawRange.start=t,this.drawRange.count=n}applyMatrix4(t){let n=this.attributes.position;n!==void 0&&(n.applyMatrix4(t),n.needsUpdate=!0);let i=this.attributes.normal;if(i!==void 0){let a=new Bt().getNormalMatrix(t);i.applyNormalMatrix(a),i.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(t){return bi.makeRotationFromQuaternion(t),this.applyMatrix4(bi),this}rotateX(t){return bi.makeRotationX(t),this.applyMatrix4(bi),this}rotateY(t){return bi.makeRotationY(t),this.applyMatrix4(bi),this}rotateZ(t){return bi.makeRotationZ(t),this.applyMatrix4(bi),this}translate(t,n,i){return bi.makeTranslation(t,n,i),this.applyMatrix4(bi),this}scale(t,n,i){return bi.makeScale(t,n,i),this.applyMatrix4(bi),this}lookAt(t){return og.lookAt(t),og.updateMatrix(),this.applyMatrix4(og.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(xo).negate(),this.translate(xo.x,xo.y,xo.z),this}setFromPoints(t){let n=this.getAttribute("position");if(n===void 0){let i=[];for(let s=0,a=t.length;s<a;s++){let r=t[s];i.push(r.x,r.y,r.z||0)}this.setAttribute("position",new sn(i,3))}else{let i=Math.min(t.length,n.count);for(let s=0;s<i;s++){let a=t[s];n.setXYZ(s,a.x,a.y,a.z||0)}t.length>n.count&&Lt("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),n.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ba);let t=this.attributes.position,n=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){It("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new V(-1/0,-1/0,-1/0),new V(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),n)for(let i=0,s=n.length;i<s;i++){let a=n[i];si.setFromBufferAttribute(a),this.morphTargetsRelative?(dn.addVectors(this.boundingBox.min,si.min),this.boundingBox.expandByPoint(dn),dn.addVectors(this.boundingBox.max,si.max),this.boundingBox.expandByPoint(dn)):(this.boundingBox.expandByPoint(si.min),this.boundingBox.expandByPoint(si.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&It('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new wo);let t=this.attributes.position,n=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){It("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new V,1/0);return}if(t){let i=this.boundingSphere.center;if(si.setFromBufferAttribute(t),n)for(let a=0,r=n.length;a<r;a++){let o=n[a];Xl.setFromBufferAttribute(o),this.morphTargetsRelative?(dn.addVectors(si.min,Xl.min),si.expandByPoint(dn),dn.addVectors(si.max,Xl.max),si.expandByPoint(dn)):(si.expandByPoint(Xl.min),si.expandByPoint(Xl.max))}si.getCenter(i);let s=0;for(let a=0,r=t.count;a<r;a++)dn.fromBufferAttribute(t,a),s=Math.max(s,i.distanceToSquared(dn));if(n)for(let a=0,r=n.length;a<r;a++){let o=n[a],l=this.morphTargetsRelative;for(let c=0,u=o.count;c<u;c++)dn.fromBufferAttribute(o,c),l&&(xo.fromBufferAttribute(t,c),dn.add(xo)),s=Math.max(s,i.distanceToSquared(dn))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&It('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let t=this.index,n=this.attributes;if(t===null||n.position===void 0||n.normal===void 0||n.uv===void 0){It("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let i=n.position,s=n.normal,a=n.uv,r=this.getAttribute("tangent");(r===void 0||r.count!==i.count)&&(r=new Si(new Float32Array(4*i.count),4),this.setAttribute("tangent",r));let o=[],l=[];for(let _=0;_<i.count;_++)o[_]=new V,l[_]=new V;let c=new V,u=new V,f=new V,h=new ie,d=new ie,m=new ie,b=new V,g=new V;function p(_,A,R){c.fromBufferAttribute(i,_),u.fromBufferAttribute(i,A),f.fromBufferAttribute(i,R),h.fromBufferAttribute(a,_),d.fromBufferAttribute(a,A),m.fromBufferAttribute(a,R),u.sub(c),f.sub(c),d.sub(h),m.sub(h);let O=1/(d.x*m.y-m.x*d.y);isFinite(O)&&(b.copy(u).multiplyScalar(m.y).addScaledVector(f,-d.y).multiplyScalar(O),g.copy(f).multiplyScalar(d.x).addScaledVector(u,-m.x).multiplyScalar(O),o[_].add(b),o[A].add(b),o[R].add(b),l[_].add(g),l[A].add(g),l[R].add(g))}let y=this.groups;y.length===0&&(y=[{start:0,count:t.count}]);for(let _=0,A=y.length;_<A;++_){let R=y[_],O=R.start,F=R.count;for(let X=O,U=O+F;X<U;X+=3)p(t.getX(X+0),t.getX(X+1),t.getX(X+2))}let S=new V,v=new V,T=new V,E=new V;function C(_){T.fromBufferAttribute(s,_),E.copy(T);let A=o[_];S.copy(A),S.sub(T.multiplyScalar(T.dot(A))).normalize(),v.crossVectors(E,A);let O=v.dot(l[_])<0?-1:1;r.setXYZW(_,S.x,S.y,S.z,O)}for(let _=0,A=y.length;_<A;++_){let R=y[_],O=R.start,F=R.count;for(let X=O,U=O+F;X<U;X+=3)C(t.getX(X+0)),C(t.getX(X+1)),C(t.getX(X+2))}this._transformed=!0}computeVertexNormals(){let t=this.index,n=this.getAttribute("position");if(n!==void 0){let i=this.getAttribute("normal");if(i===void 0||i.count!==n.count)i=new Si(new Float32Array(n.count*3),3),this.setAttribute("normal",i);else for(let h=0,d=i.count;h<d;h++)i.setXYZ(h,0,0,0);let s=new V,a=new V,r=new V,o=new V,l=new V,c=new V,u=new V,f=new V;if(t)for(let h=0,d=t.count;h<d;h+=3){let m=t.getX(h+0),b=t.getX(h+1),g=t.getX(h+2);s.fromBufferAttribute(n,m),a.fromBufferAttribute(n,b),r.fromBufferAttribute(n,g),u.subVectors(r,a),f.subVectors(s,a),u.cross(f),o.fromBufferAttribute(i,m),l.fromBufferAttribute(i,b),c.fromBufferAttribute(i,g),o.add(u),l.add(u),c.add(u),i.setXYZ(m,o.x,o.y,o.z),i.setXYZ(b,l.x,l.y,l.z),i.setXYZ(g,c.x,c.y,c.z)}else for(let h=0,d=n.count;h<d;h+=3)s.fromBufferAttribute(n,h+0),a.fromBufferAttribute(n,h+1),r.fromBufferAttribute(n,h+2),u.subVectors(r,a),f.subVectors(s,a),u.cross(f),i.setXYZ(h+0,u.x,u.y,u.z),i.setXYZ(h+1,u.x,u.y,u.z),i.setXYZ(h+2,u.x,u.y,u.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){let t=this.attributes.normal;for(let n=0,i=t.count;n<i;n++)dn.fromBufferAttribute(t,n),dn.normalize(),t.setXYZ(n,dn.x,dn.y,dn.z)}toNonIndexed(){function t(o,l){let c=o.array,u=o.itemSize,f=o.normalized,h=new c.constructor(l.length*u),d=0,m=0;for(let b=0,g=l.length;b<g;b++){o.isInterleavedBufferAttribute?d=l[b]*o.data.stride+o.offset:d=l[b]*u;for(let p=0;p<u;p++)h[m++]=c[d++]}return new Si(h,u,f)}if(this.index===null)return Lt("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let n=new e,i=this.index.array,s=this.attributes;for(let o in s){let l=s[o],c=t(l,i);n.setAttribute(o,c)}let a=this.morphAttributes;for(let o in a){let l=[],c=a[o];for(let u=0,f=c.length;u<f;u++){let h=c[u],d=t(h,i);l.push(d)}n.morphAttributes[o]=l}n.morphTargetsRelative=this.morphTargetsRelative;let r=this.groups;for(let o=0,l=r.length;o<l;o++){let c=r[o];n.addGroup(c.start,c.count,c.materialIndex)}return n}toJSON(){let t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,t.name=this.name,Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};let n=this.index;n!==null&&(t.data.index={type:n.array.constructor.name,array:Array.prototype.slice.call(n.array)});let i=this.attributes;for(let l in i){let c=i[l];t.data.attributes[l]=c.toJSON(t.data)}let s={},a=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],u=[];for(let f=0,h=c.length;f<h;f++){let d=c[f];u.push(d.toJSON(t.data))}u.length>0&&(s[l]=u,a=!0)}a&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);let r=this.groups;r.length>0&&(t.data.groups=JSON.parse(JSON.stringify(r)));let o=this.boundingSphere;return o!==null&&(t.data.boundingSphere=o.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let n={};this.name=t.name;let i=t.index;i!==null&&this.setIndex(i.clone());let s=t.attributes;for(let c in s){let u=s[c];this.setAttribute(c,u.clone(n))}let a=t.morphAttributes;for(let c in a){let u=[],f=a[c];for(let h=0,d=f.length;h<d;h++)u.push(f[h].clone(n));this.morphAttributes[c]=u}this.morphTargetsRelative=t.morphTargetsRelative;let r=t.groups;for(let c=0,u=r.length;c<u;c++){let f=r[c];this.addGroup(f.start,f.count,f.materialIndex)}let o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());let l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this._transformed=t._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}};var lg=new V,IE=new V,PE=new Bt,Pi=class{constructor(t=new V(1,0,0),n=0){this.isPlane=!0,this.normal=t,this.constant=n}set(t,n){return this.normal.copy(t),this.constant=n,this}setComponents(t,n,i,s){return this.normal.set(t,n,i),this.constant=s,this}setFromNormalAndCoplanarPoint(t,n){return this.normal.copy(t),this.constant=-n.dot(this.normal),this}setFromCoplanarPoints(t,n,i){let s=lg.subVectors(i,n).cross(IE.subVectors(t,n)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){let t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,n){return n.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,n,i=!0){let s=t.delta(lg),a=this.normal.dot(s);if(a===0)return this.distanceToPoint(t.start)===0?n.copy(t.start):null;let r=-(t.start.dot(this.normal)+this.constant)/a;return i===!0&&(r<0||r>1)?null:n.copy(t.start).addScaledVector(s,r)}intersectsLine(t){let n=this.distanceToPoint(t.start),i=this.distanceToPoint(t.end);return n<0&&i>0||i<0&&n>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,n){let i=n||PE.getNormalMatrix(t),s=this.coplanarPoint(lg).applyMatrix4(t),a=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(a),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(t){return this.normal.fromArray(t.normal),this.constant=t.constant,this}},BE=0,lr=class extends ns{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:BE++}),this.uuid=yc(),this.name="",this.type="Material",this.blending=No,this.side=wa,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Sg,this.blendDst=Mg,this.blendEquation=ur,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new se(0,0,0),this.blendAlpha=0,this.depthFunc=Mo,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=cS,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Th,this.stencilZFail=Th,this.stencilZPass=Th,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(let n in t){let i=t[n];if(i===void 0){Lt(`Material: parameter '${n}' has value of undefined.`);continue}let s=this[n];if(s===void 0){Lt(`Material: '${n}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector2&&i&&i.isVector2||s&&s.isEuler&&i&&i.isEuler||s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[n]=i}}toJSON(t){let n=t===void 0||typeof t=="string";n&&(t={textures:{},images:{}});let i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,i.blending=this.blending,i.side=this.side,i.shadowSide=this.shadowSide,i.vertexColors=this.vertexColors,i.opacity=this.opacity,i.transparent=this.transparent,i.blendSrc=this.blendSrc,i.blendDst=this.blendDst,i.blendEquation=this.blendEquation,i.blendSrcAlpha=this.blendSrcAlpha,i.blendDstAlpha=this.blendDstAlpha,i.blendEquationAlpha=this.blendEquationAlpha,i.blendColor=this.blendColor.getHex(),i.blendAlpha=this.blendAlpha,i.depthFunc=this.depthFunc,i.depthTest=this.depthTest,i.depthWrite=this.depthWrite,i.colorWrite=this.colorWrite,i.clipIntersection=this.clipIntersection,i.clipShadows=this.clipShadows,i.stencilWriteMask=this.stencilWriteMask,i.stencilFunc=this.stencilFunc,i.stencilRef=this.stencilRef,i.stencilFuncMask=this.stencilFuncMask,i.stencilFail=this.stencilFail,i.stencilZFail=this.stencilZFail,i.stencilZPass=this.stencilZPass,i.stencilWrite=this.stencilWrite,i.polygonOffset=this.polygonOffset,i.polygonOffsetFactor=this.polygonOffsetFactor,i.polygonOffsetUnits=this.polygonOffsetUnits,i.dithering=this.dithering,i.alphaTest=this.alphaTest,i.alphaHash=this.alphaHash,i.alphaToCoverage=this.alphaToCoverage,i.premultipliedAlpha=this.premultipliedAlpha,i.forceSinglePass=this.forceSinglePass,i.allowOverride=this.allowOverride,i.visible=this.visible,i.toneMapped=this.toneMapped,i.name=this.name,this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(i.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(t).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(t).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(t).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(t).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(t).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(i.clippingPlanes=this.clippingPlanes.map(a=>a.toJSON())),this.rotation!==void 0&&(i.rotation=this.rotation),this.depthPacking!==void 0&&(i.depthPacking=this.depthPacking),this.linewidth!==void 0&&(i.linewidth=this.linewidth),this.linecap!==void 0&&(i.linecap=this.linecap),this.linejoin!==void 0&&(i.linejoin=this.linejoin),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.wireframe!==void 0&&(i.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(i.flatShading=this.flatShading),this.fog!==void 0&&(i.fog=this.fog),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(a){let r=[];for(let o in a){let l=a[o];delete l.metadata,r.push(l)}return r}if(n){let a=s(t.textures),r=s(t.images);a.length>0&&(i.textures=a),r.length>0&&(i.images=r)}return i}fromJSON(t,n){if(t.uuid!==void 0&&(this.uuid=t.uuid),t.name!==void 0&&(this.name=t.name),t.color!==void 0&&this.color!==void 0&&this.color.setHex(t.color),t.roughness!==void 0&&(this.roughness=t.roughness),t.metalness!==void 0&&(this.metalness=t.metalness),t.sheen!==void 0&&(this.sheen=t.sheen),t.sheenColor!==void 0&&(this.sheenColor=new se().setHex(t.sheenColor)),t.sheenRoughness!==void 0&&(this.sheenRoughness=t.sheenRoughness),t.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(t.emissive),t.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(t.specular),t.specularIntensity!==void 0&&(this.specularIntensity=t.specularIntensity),t.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(t.specularColor),t.shininess!==void 0&&(this.shininess=t.shininess),t.clearcoat!==void 0&&(this.clearcoat=t.clearcoat),t.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=t.clearcoatRoughness),t.dispersion!==void 0&&(this.dispersion=t.dispersion),t.retroreflectivity!==void 0&&(this.retroreflectivity=t.retroreflectivity),t.iridescence!==void 0&&(this.iridescence=t.iridescence),t.iridescenceIOR!==void 0&&(this.iridescenceIOR=t.iridescenceIOR),t.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=t.iridescenceThicknessRange),t.transmission!==void 0&&(this.transmission=t.transmission),t.thickness!==void 0&&(this.thickness=t.thickness),t.attenuationDistance!==void 0&&(this.attenuationDistance=t.attenuationDistance),t.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(t.attenuationColor),t.anisotropy!==void 0&&(this.anisotropy=t.anisotropy),t.anisotropyRotation!==void 0&&(this.anisotropyRotation=t.anisotropyRotation),t.fog!==void 0&&(this.fog=t.fog),t.flatShading!==void 0&&(this.flatShading=t.flatShading),t.blending!==void 0&&(this.blending=t.blending),t.combine!==void 0&&(this.combine=t.combine),t.side!==void 0&&(this.side=t.side),t.shadowSide!==void 0&&(this.shadowSide=t.shadowSide),t.opacity!==void 0&&(this.opacity=t.opacity),t.transparent!==void 0&&(this.transparent=t.transparent),t.alphaTest!==void 0&&(this.alphaTest=t.alphaTest),t.alphaHash!==void 0&&(this.alphaHash=t.alphaHash),t.depthFunc!==void 0&&(this.depthFunc=t.depthFunc),t.depthTest!==void 0&&(this.depthTest=t.depthTest),t.depthWrite!==void 0&&(this.depthWrite=t.depthWrite),t.colorWrite!==void 0&&(this.colorWrite=t.colorWrite),t.clippingPlanes!==void 0&&(this.clippingPlanes=t.clippingPlanes.map(i=>new Pi().fromJSON(i))),t.clipIntersection!==void 0&&(this.clipIntersection=t.clipIntersection),t.clipShadows!==void 0&&(this.clipShadows=t.clipShadows),t.depthPacking!==void 0&&(this.depthPacking=t.depthPacking),t.blendSrc!==void 0&&(this.blendSrc=t.blendSrc),t.blendDst!==void 0&&(this.blendDst=t.blendDst),t.blendEquation!==void 0&&(this.blendEquation=t.blendEquation),t.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=t.blendSrcAlpha),t.blendDstAlpha!==void 0&&(this.blendDstAlpha=t.blendDstAlpha),t.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=t.blendEquationAlpha),t.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(t.blendColor),t.blendAlpha!==void 0&&(this.blendAlpha=t.blendAlpha),t.stencilWriteMask!==void 0&&(this.stencilWriteMask=t.stencilWriteMask),t.stencilFunc!==void 0&&(this.stencilFunc=t.stencilFunc),t.stencilRef!==void 0&&(this.stencilRef=t.stencilRef),t.stencilFuncMask!==void 0&&(this.stencilFuncMask=t.stencilFuncMask),t.stencilFail!==void 0&&(this.stencilFail=t.stencilFail),t.stencilZFail!==void 0&&(this.stencilZFail=t.stencilZFail),t.stencilZPass!==void 0&&(this.stencilZPass=t.stencilZPass),t.stencilWrite!==void 0&&(this.stencilWrite=t.stencilWrite),t.wireframe!==void 0&&(this.wireframe=t.wireframe),t.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=t.wireframeLinewidth),t.wireframeLinecap!==void 0&&(this.wireframeLinecap=t.wireframeLinecap),t.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=t.wireframeLinejoin),t.rotation!==void 0&&(this.rotation=t.rotation),t.linewidth!==void 0&&(this.linewidth=t.linewidth),t.linecap!==void 0&&(this.linecap=t.linecap),t.linejoin!==void 0&&(this.linejoin=t.linejoin),t.dashSize!==void 0&&(this.dashSize=t.dashSize),t.gapSize!==void 0&&(this.gapSize=t.gapSize),t.scale!==void 0&&(this.scale=t.scale),t.polygonOffset!==void 0&&(this.polygonOffset=t.polygonOffset),t.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=t.polygonOffsetFactor),t.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=t.polygonOffsetUnits),t.dithering!==void 0&&(this.dithering=t.dithering),t.alphaToCoverage!==void 0&&(this.alphaToCoverage=t.alphaToCoverage),t.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=t.premultipliedAlpha),t.forceSinglePass!==void 0&&(this.forceSinglePass=t.forceSinglePass),t.allowOverride!==void 0&&(this.allowOverride=t.allowOverride),t.visible!==void 0&&(this.visible=t.visible),t.toneMapped!==void 0&&(this.toneMapped=t.toneMapped),t.userData!==void 0&&(this.userData=t.userData),t.vertexColors!==void 0&&(typeof t.vertexColors=="number"?this.vertexColors=t.vertexColors>0:this.vertexColors=t.vertexColors),t.size!==void 0&&(this.size=t.size),t.sizeAttenuation!==void 0&&(this.sizeAttenuation=t.sizeAttenuation),t.map!==void 0&&(this.map=n[t.map]||null),t.matcap!==void 0&&(this.matcap=n[t.matcap]||null),t.alphaMap!==void 0&&(this.alphaMap=n[t.alphaMap]||null),t.bumpMap!==void 0&&(this.bumpMap=n[t.bumpMap]||null),t.bumpScale!==void 0&&(this.bumpScale=t.bumpScale),t.normalMap!==void 0&&(this.normalMap=n[t.normalMap]||null),t.normalMapType!==void 0&&(this.normalMapType=t.normalMapType),t.normalScale!==void 0){let i=t.normalScale;Array.isArray(i)===!1&&(i=[i,i]),this.normalScale=new ie().fromArray(i)}return t.displacementMap!==void 0&&(this.displacementMap=n[t.displacementMap]||null),t.displacementScale!==void 0&&(this.displacementScale=t.displacementScale),t.displacementBias!==void 0&&(this.displacementBias=t.displacementBias),t.roughnessMap!==void 0&&(this.roughnessMap=n[t.roughnessMap]||null),t.metalnessMap!==void 0&&(this.metalnessMap=n[t.metalnessMap]||null),t.emissiveMap!==void 0&&(this.emissiveMap=n[t.emissiveMap]||null),t.emissiveIntensity!==void 0&&(this.emissiveIntensity=t.emissiveIntensity),t.specularMap!==void 0&&(this.specularMap=n[t.specularMap]||null),t.specularIntensityMap!==void 0&&(this.specularIntensityMap=n[t.specularIntensityMap]||null),t.specularColorMap!==void 0&&(this.specularColorMap=n[t.specularColorMap]||null),t.envMap!==void 0&&(this.envMap=n[t.envMap]||null),t.envMapRotation!==void 0&&this.envMapRotation.fromArray(t.envMapRotation),t.envMapIntensity!==void 0&&(this.envMapIntensity=t.envMapIntensity),t.reflectivity!==void 0&&(this.reflectivity=t.reflectivity),t.refractionRatio!==void 0&&(this.refractionRatio=t.refractionRatio),t.lightMap!==void 0&&(this.lightMap=n[t.lightMap]||null),t.lightMapIntensity!==void 0&&(this.lightMapIntensity=t.lightMapIntensity),t.aoMap!==void 0&&(this.aoMap=n[t.aoMap]||null),t.aoMapIntensity!==void 0&&(this.aoMapIntensity=t.aoMapIntensity),t.gradientMap!==void 0&&(this.gradientMap=n[t.gradientMap]||null),t.clearcoatMap!==void 0&&(this.clearcoatMap=n[t.clearcoatMap]||null),t.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=n[t.clearcoatRoughnessMap]||null),t.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=n[t.clearcoatNormalMap]||null),t.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new ie().fromArray(t.clearcoatNormalScale)),t.iridescenceMap!==void 0&&(this.iridescenceMap=n[t.iridescenceMap]||null),t.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=n[t.iridescenceThicknessMap]||null),t.transmissionMap!==void 0&&(this.transmissionMap=n[t.transmissionMap]||null),t.thicknessMap!==void 0&&(this.thicknessMap=n[t.thicknessMap]||null),t.anisotropyMap!==void 0&&(this.anisotropyMap=n[t.anisotropyMap]||null),t.sheenColorMap!==void 0&&(this.sheenColorMap=n[t.sheenColorMap]||null),t.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=n[t.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;let n=t.clippingPlanes,i=null;if(n!==null){let s=n.length;i=new Array(s);for(let a=0;a!==s;++a)i[a]=n[a].clone()}return this.clippingPlanes=i,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.allowOverride=t.allowOverride,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}};var Us=new V,cg=new V,hh=new V,fh=new V,Fh=class{constructor(t=new V,n=new V(0,0,-1)){this.origin=t,this.direction=n}set(t,n){return this.origin.copy(t),this.direction.copy(n),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,n){return n.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Us)),this}closestPointToPoint(t,n){n.subVectors(t,this.origin);let i=n.dot(this.direction);return i<0?n.copy(this.origin):n.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){let n=Us.subVectors(t,this.origin).dot(this.direction);return n<0?this.origin.distanceToSquared(t):(Us.copy(this.origin).addScaledVector(this.direction,n),Us.distanceToSquared(t))}distanceSqToSegment(t,n,i,s){cg.copy(t).add(n).multiplyScalar(.5),hh.copy(n).sub(t).normalize(),fh.copy(this.origin).sub(cg);let a=t.distanceTo(n)*.5,r=-this.direction.dot(hh),o=fh.dot(this.direction),l=-fh.dot(hh),c=fh.lengthSq(),u=Math.abs(1-r*r),f,h,d,m;if(u>0)if(f=r*l-o,h=r*o-l,m=a*u,f>=0)if(h>=-m)if(h<=m){let b=1/u;f*=b,h*=b,d=f*(f+r*h+2*o)+h*(r*f+h+2*l)+c}else h=a,f=Math.max(0,-(r*h+o)),d=-f*f+h*(h+2*l)+c;else h=-a,f=Math.max(0,-(r*h+o)),d=-f*f+h*(h+2*l)+c;else h<=-m?(f=Math.max(0,-(-r*a+o)),h=f>0?-a:Math.min(Math.max(-a,-l),a),d=-f*f+h*(h+2*l)+c):h<=m?(f=0,h=Math.min(Math.max(-a,-l),a),d=h*(h+2*l)+c):(f=Math.max(0,-(r*a+o)),h=f>0?a:Math.min(Math.max(-a,-l),a),d=-f*f+h*(h+2*l)+c);else h=r>0?-a:a,f=Math.max(0,-(r*h+o)),d=-f*f+h*(h+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,f),s&&s.copy(cg).addScaledVector(hh,h),d}intersectSphere(t,n){if(t.radius<0)return null;Us.subVectors(t.center,this.origin);let i=Us.dot(this.direction),s=Us.dot(Us)-i*i,a=t.radius*t.radius;if(s>a)return null;let r=Math.sqrt(a-s),o=i-r,l=i+r;return l<0?null:o<0?this.at(l,n):this.at(o,n)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){let n=t.normal.dot(this.direction);if(n===0)return t.distanceToPoint(this.origin)===0?0:null;let i=-(this.origin.dot(t.normal)+t.constant)/n;return i>=0?i:null}intersectPlane(t,n){let i=this.distanceToPlane(t);return i===null?null:this.at(i,n)}intersectsPlane(t){let n=t.distanceToPoint(this.origin);return n===0||t.normal.dot(this.direction)*n<0}intersectBox(t,n){let i,s,a,r,o,l,c=1/this.direction.x,u=1/this.direction.y,f=1/this.direction.z,h=this.origin;return c>=0?(i=(t.min.x-h.x)*c,s=(t.max.x-h.x)*c):(i=(t.max.x-h.x)*c,s=(t.min.x-h.x)*c),u>=0?(a=(t.min.y-h.y)*u,r=(t.max.y-h.y)*u):(a=(t.max.y-h.y)*u,r=(t.min.y-h.y)*u),i>r||a>s||((a>i||isNaN(i))&&(i=a),(r<s||isNaN(s))&&(s=r),f>=0?(o=(t.min.z-h.z)*f,l=(t.max.z-h.z)*f):(o=(t.max.z-h.z)*f,l=(t.min.z-h.z)*f),i>l||o>s)||((o>i||i!==i)&&(i=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(i>=0?i:s,n)}intersectsBox(t){return this.intersectBox(t,Us)!==null}intersectTriangle(t,n,i,s,a){let r=this.origin,o=this.direction,l=o.x,c=o.y,u=o.z,f=t.x-r.x,h=t.y-r.y,d=t.z-r.z,m=n.x-r.x,b=n.y-r.y,g=n.z-r.z,p=i.x-r.x,y=i.y-r.y,S=i.z-r.z,v=Math.abs(l),T=Math.abs(c),E=Math.abs(u),C,_,A,R,O,F,X,U,G,J,I,it;if(v>=T&&v>=E?(A=l,F=f,G=m,it=p,l>=0?(C=c,_=u,R=h,O=d,X=b,U=g,J=y,I=S):(C=u,_=c,R=d,O=h,X=g,U=b,J=S,I=y)):T>=E?(A=c,F=h,G=b,it=y,c>=0?(C=u,_=l,R=d,O=f,X=g,U=m,J=S,I=p):(C=l,_=u,R=f,O=d,X=m,U=g,J=p,I=S)):(A=u,F=d,G=g,it=S,u>=0?(C=l,_=c,R=f,O=h,X=m,U=b,J=p,I=y):(C=c,_=l,R=h,O=f,X=b,U=m,J=y,I=p)),A===0)return null;let q=C/A,tt=_/A,et=1/A,St=R-q*F,Mt=O-tt*F,me=X-q*G,Xt=U-tt*G,te=J-q*it,Y=I-tt*it,k=te*Xt-Y*me,ot=St*Y-Mt*te,Rt=me*Mt-Xt*St;if(s){if(k<0||ot<0||Rt<0)return null}else if((k<0||ot<0||Rt<0)&&(k>0||ot>0||Rt>0))return null;let st=k+ot+Rt;if(st===0)return null;let Pt=et*(k*F+ot*G+Rt*it);return(st>0?Pt<0:Pt>0)?null:this.at(Pt/st,a)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},Ti=class extends lr{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new se(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new _a,this.combine=Tg,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}},Nb=new qe,ar=new Fh,dh=new wo,Db=new V,ph=new V,mh=new V,gh=new V,ug=new V,yh=new V,Lb=new V,xh=new V,an=class extends Mi{constructor(t=new qn,n=new Ti){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=n,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,n){return super.copy(t,n),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){let n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){let s=n[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,r=s.length;a<r;a++){let o=s[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=a}}}}getVertexPosition(t,n){let i=this.geometry,s=i.attributes.position,a=i.morphAttributes.position,r=i.morphTargetsRelative;n.fromBufferAttribute(s,t);let o=this.morphTargetInfluences;if(a&&o){yh.set(0,0,0);for(let l=0,c=a.length;l<c;l++){let u=o[l],f=a[l];u!==0&&(ug.fromBufferAttribute(f,t),r?yh.addScaledVector(ug,u):yh.addScaledVector(ug.sub(n),u))}n.add(yh)}return n}intersectsFrustum(t){return t.intersectsObject(this)}raycast(t,n){let i=this.geometry,s=this.material,a=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),dh.copy(i.boundingSphere),dh.applyMatrix4(a),ar.copy(t.ray).recast(t.near),!(dh.containsPoint(ar.origin)===!1&&(ar.intersectSphere(dh,Db)===null||ar.origin.distanceToSquared(Db)>(t.far-t.near)**2))&&(Nb.copy(a).invert(),ar.copy(t.ray).applyMatrix4(Nb),!(i.boundingBox!==null&&ar.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(t,n,ar)))}_computeIntersections(t,n,i){let s,a=this.geometry,r=this.material,o=a.index,l=a.attributes.position,c=a.attributes.uv,u=a.attributes.uv1,f=a.attributes.normal,h=a.groups,d=a.drawRange;if(o!==null)if(Array.isArray(r))for(let m=0,b=h.length;m<b;m++){let g=h[m],p=r[g.materialIndex],y=Math.max(g.start,d.start),S=Math.min(o.count,Math.min(g.start+g.count,d.start+d.count));for(let v=y,T=S;v<T;v+=3){let E=o.getX(v),C=o.getX(v+1),_=o.getX(v+2);s=vh(this,p,t,i,c,u,f,E,C,_),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=g.materialIndex,n.push(s))}}else{let m=Math.max(0,d.start),b=Math.min(o.count,d.start+d.count);for(let g=m,p=b;g<p;g+=3){let y=o.getX(g),S=o.getX(g+1),v=o.getX(g+2);s=vh(this,r,t,i,c,u,f,y,S,v),s&&(s.faceIndex=Math.floor(g/3),n.push(s))}}else if(l!==void 0)if(Array.isArray(r))for(let m=0,b=h.length;m<b;m++){let g=h[m],p=r[g.materialIndex],y=Math.max(g.start,d.start),S=Math.min(l.count,Math.min(g.start+g.count,d.start+d.count));for(let v=y,T=S;v<T;v+=3){let E=v,C=v+1,_=v+2;s=vh(this,p,t,i,c,u,f,E,C,_),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=g.materialIndex,n.push(s))}}else{let m=Math.max(0,d.start),b=Math.min(l.count,d.start+d.count);for(let g=m,p=b;g<p;g+=3){let y=g,S=g+1,v=g+2;s=vh(this,r,t,i,c,u,f,y,S,v),s&&(s.faceIndex=Math.floor(g/3),n.push(s))}}}};function zE(e,t,n,i,s,a,r,o){let l;if(t.side===Un?l=i.intersectTriangle(r,a,s,!0,o):l=i.intersectTriangle(s,a,r,t.side===wa,o),l===null)return null;xh.copy(o),xh.applyMatrix4(e.matrixWorld);let c=n.ray.origin.distanceTo(xh);return c<n.near||c>n.far?null:{distance:c,point:xh.clone(),object:e}}function vh(e,t,n,i,s,a,r,o,l,c){e.getVertexPosition(o,ph),e.getVertexPosition(l,mh),e.getVertexPosition(c,gh);let u=zE(e,t,n,i,ph,mh,gh,Lb);if(u){let f=new V;va.getBarycoord(Lb,ph,mh,gh,f),s&&(u.uv=va.getInterpolatedAttribute(s,o,l,c,f,new ie)),a&&(u.uv1=va.getInterpolatedAttribute(a,o,l,c,f,new ie)),r&&(u.normal=va.getInterpolatedAttribute(r,o,l,c,f,new V),u.normal.dot(i.direction)>0&&u.normal.multiplyScalar(-1));let h={a:o,b:l,c,normal:new V,materialIndex:0};va.getNormal(ph,mh,gh,h.normal),u.face=h,u.barycoord=f}return u}var kh=class extends An{constructor(t=null,n=1,i=1,s,a,r,o,l,c=Ye,u=Ye,f,h){super(null,r,o,l,c,u,s,a,f,h),this.isDataTexture=!0,this.image={data:t,width:n,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var rr=new wo,FE=new ie(.5,.5),_h=new V,nc=class{constructor(t=new Pi,n=new Pi,i=new Pi,s=new Pi,a=new Pi,r=new Pi){this.planes=[t,n,i,s,a,r]}set(t,n,i,s,a,r){let o=this.planes;return o[0].copy(t),o[1].copy(n),o[2].copy(i),o[3].copy(s),o[4].copy(a),o[5].copy(r),this}copy(t){let n=this.planes;for(let i=0;i<6;i++)n[i].copy(t.planes[i]);return this}setFromProjectionMatrix(t,n=Bi,i=!1){let s=this.planes,a=t.elements,r=a[0],o=a[1],l=a[2],c=a[3],u=a[4],f=a[5],h=a[6],d=a[7],m=a[8],b=a[9],g=a[10],p=a[11],y=a[12],S=a[13],v=a[14],T=a[15];if(s[0].setComponents(c-r,d-u,p-m,T-y).normalize(),s[1].setComponents(c+r,d+u,p+m,T+y).normalize(),s[2].setComponents(c+o,d+f,p+b,T+S).normalize(),s[3].setComponents(c-o,d-f,p-b,T-S).normalize(),i)s[4].setComponents(l,h,g,v).normalize(),s[5].setComponents(c-l,d-h,p-g,T-v).normalize();else if(s[4].setComponents(c-l,d-h,p-g,T-v).normalize(),n===Bi)s[5].setComponents(c+l,d+h,p+g,T+v).normalize();else if(n===Kl)s[5].setComponents(l,h,g,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+n);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),rr.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{let n=t.geometry;n.boundingSphere===null&&n.computeBoundingSphere(),rr.copy(n.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(rr)}intersectsSprite(t){rr.center.set(0,0,0);let n=FE.distanceTo(t.center);return rr.radius=.7071067811865476+n,rr.applyMatrix4(t.matrixWorld),this.intersectsSphere(rr)}intersectsSphere(t){let n=this.planes,i=t.center,s=-t.radius;for(let a=0;a<6;a++)if(n[a].distanceToPoint(i)<s)return!1;return!0}intersectsBox(t){let n=this.planes;for(let i=0;i<6;i++){let s=n[i];if(_h.x=s.normal.x>0?t.max.x:t.min.x,_h.y=s.normal.y>0?t.max.y:t.min.y,_h.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(_h)<0)return!1}return!0}containsPoint(t){let n=this.planes;for(let i=0;i<6;i++)if(n[i].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var ic=class extends An{constructor(t=[],n=Ca,i,s,a,r,o,l,c,u){super(t,n,i,s,a,r,o,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}};var Sa=class extends An{constructor(t,n,i=Fi,s,a,r,o=Ye,l=Ye,c,u=es,f=1){if(u!==es&&u!==Na)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let h={width:t,height:n,depth:f};super(h,s,a,r,o,l,u,i,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new Eo(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){let n=super.toJSON(t);return n.compareFunction=this.compareFunction,n}},Hh=class extends Sa{constructor(t,n=Fi,i=Ca,s,a,r=Ye,o=Ye,l,c=es){let u={width:t,height:t,depth:1},f=[u,u,u,u,u,u];super(t,t,n,i,s,a,r,o,l,c),this.image=f,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(t){this.image=t}},sc=class extends An{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}},Co=class e extends qn{constructor(t=1,n=1,i=1,s=1,a=1,r=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:n,depth:i,widthSegments:s,heightSegments:a,depthSegments:r};let o=this;s=Math.floor(s),a=Math.floor(a),r=Math.floor(r);let l=[],c=[],u=[],f=[],h=0,d=0;m("z","y","x",-1,-1,i,n,t,r,a,0),m("z","y","x",1,-1,i,n,-t,r,a,1),m("x","z","y",1,1,t,i,n,s,r,2),m("x","z","y",1,-1,t,i,-n,s,r,3),m("x","y","z",1,-1,t,n,i,s,a,4),m("x","y","z",-1,-1,t,n,-i,s,a,5),this.setIndex(l),this.setAttribute("position",new sn(c,3)),this.setAttribute("normal",new sn(u,3)),this.setAttribute("uv",new sn(f,2));function m(b,g,p,y,S,v,T,E,C,_,A){let R=v/C,O=T/_,F=v/2,X=T/2,U=E/2,G=C+1,J=_+1,I=0,it=0,q=new V;for(let tt=0;tt<J;tt++){let et=tt*O-X;for(let St=0;St<G;St++){let Mt=St*R-F;q[b]=Mt*y,q[g]=et*S,q[p]=U,c.push(q.x,q.y,q.z),q[b]=0,q[g]=0,q[p]=E>0?1:-1,u.push(q.x,q.y,q.z),f.push(St/C),f.push(1-tt/_),I+=1}}for(let tt=0;tt<_;tt++)for(let et=0;et<C;et++){let St=h+et+G*tt,Mt=h+et+G*(tt+1),me=h+(et+1)+G*(tt+1),Xt=h+(et+1)+G*tt;l.push(St,Mt,Xt),l.push(Mt,me,Xt),it+=6}o.addGroup(d,it,A),d+=it,h+=I}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}};var ac=class e extends qn{constructor(t=1,n=32,i=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:n,thetaStart:i,thetaLength:s},n=Math.max(3,n);let a=[],r=[],o=[],l=[],c=new V,u=new ie;r.push(0,0,0),o.push(0,0,1),l.push(.5,.5);for(let f=0,h=3;f<=n;f++,h+=3){let d=i+f/n*s;c.x=t*Math.cos(d),c.y=t*Math.sin(d),r.push(c.x,c.y,c.z),o.push(0,0,1),u.x=(r[h]/t+1)/2,u.y=(r[h+1]/t+1)/2,l.push(u.x,u.y)}for(let f=1;f<=n;f++)a.push(f,f+1,0);this.setIndex(a),this.setAttribute("position",new sn(r,3)),this.setAttribute("normal",new sn(o,3)),this.setAttribute("uv",new sn(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new e(t.radius,t.segments,t.thetaStart,t.thetaLength)}};var Ma=class e extends qn{constructor(t=1,n=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:n,widthSegments:i,heightSegments:s};let a=t/2,r=n/2,o=Math.floor(i),l=Math.floor(s),c=o+1,u=l+1,f=t/o,h=n/l,d=[],m=[],b=[],g=[];for(let p=0;p<u;p++){let y=p*h-r;for(let S=0;S<c;S++){let v=S*f-a;m.push(v,-y,0),b.push(0,0,1),g.push(S/o),g.push(1-p/l)}}for(let p=0;p<l;p++)for(let y=0;y<o;y++){let S=y+c*p,v=y+c*(p+1),T=y+1+c*(p+1),E=y+1+c*p;d.push(S,v,E),d.push(v,T,E)}this.setIndex(d),this.setAttribute("position",new sn(m,3)),this.setAttribute("normal",new sn(b,3)),this.setAttribute("uv",new sn(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.widthSegments,t.heightSegments)}};function fr(e){let t={};for(let n in e){t[n]={};for(let i in e[n]){let s=e[n][i];if(Ub(s))s.isRenderTargetTexture?(Lt("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[n][i]=null):t[n][i]=s.clone();else if(Array.isArray(s))if(Ub(s[0])){let a=[];for(let r=0,o=s.length;r<o;r++)a[r]=s[r].clone();t[n][i]=a}else t[n][i]=s.slice();else t[n][i]=s}}return t}function wn(e){let t={};for(let n=0;n<e.length;n++){let i=fr(e[n]);for(let s in i)t[s]=i[s]}return t}function Ub(e){return e&&(e.isColor||e.isMatrix3||e.isMatrix4||e.isVector2||e.isVector3||e.isVector4||e.isTexture||e.isQuaternion)}function kE(e){let t=[];for(let n=0;n<e.length;n++)t.push(e[n].clone());return t}function Gg(e){let t=e.getRenderTarget();return t===null?e.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Qt.workingColorSpace}var SS={clone:fr,merge:wn},HE=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,VE=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,ai=class extends lr{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=HE,this.fragmentShader=VE,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=fr(t.uniforms),this.uniformsGroups=kE(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this.defaultAttributeValues=Object.assign({},t.defaultAttributeValues),this.index0AttributeName=t.index0AttributeName,this.uniformsNeedUpdate=t.uniformsNeedUpdate,this}toJSON(t){let n=super.toJSON(t);n.glslVersion=this.glslVersion,n.uniforms={};for(let s in this.uniforms){let r=this.uniforms[s].value;r&&r.isTexture?n.uniforms[s]={type:"t",value:r.toJSON(t).uuid}:r&&r.isColor?n.uniforms[s]={type:"c",value:r.getHex()}:r&&r.isVector2?n.uniforms[s]={type:"v2",value:r.toArray()}:r&&r.isVector3?n.uniforms[s]={type:"v3",value:r.toArray()}:r&&r.isVector4?n.uniforms[s]={type:"v4",value:r.toArray()}:r&&r.isMatrix3?n.uniforms[s]={type:"m3",value:r.toArray()}:r&&r.isMatrix4?n.uniforms[s]={type:"m4",value:r.toArray()}:n.uniforms[s]={value:r}}Object.keys(this.defines).length>0&&(n.defines=this.defines),n.vertexShader=this.vertexShader,n.fragmentShader=this.fragmentShader,n.lights=this.lights,n.clipping=this.clipping;let i={};for(let s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(n.extensions=i),n}fromJSON(t,n){if(super.fromJSON(t,n),t.uniforms!==void 0)for(let i in t.uniforms){let s=t.uniforms[i];switch(this.uniforms[i]={},s.type){case"t":this.uniforms[i].value=n[s.value]||null;break;case"c":this.uniforms[i].value=new se().setHex(s.value);break;case"v2":this.uniforms[i].value=new ie().fromArray(s.value);break;case"v3":this.uniforms[i].value=new V().fromArray(s.value);break;case"v4":this.uniforms[i].value=new ze().fromArray(s.value);break;case"m3":this.uniforms[i].value=new Bt().fromArray(s.value);break;case"m4":this.uniforms[i].value=new qe().fromArray(s.value);break;default:this.uniforms[i].value=s.value}}if(t.defines!==void 0&&(this.defines=t.defines),t.vertexShader!==void 0&&(this.vertexShader=t.vertexShader),t.fragmentShader!==void 0&&(this.fragmentShader=t.fragmentShader),t.glslVersion!==void 0&&(this.glslVersion=t.glslVersion),t.extensions!==void 0)for(let i in t.extensions)this.extensions[i]=t.extensions[i];return t.lights!==void 0&&(this.lights=t.lights),t.clipping!==void 0&&(this.clipping=t.clipping),this}},Vh=class extends ai{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}};var Gh=class extends lr{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=oS,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}},Wh=class extends lr{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}};function vo(e,t){return!e||e.constructor===t?e:typeof t.BYTES_PER_ELEMENT=="number"?new t(e):Array.prototype.slice.call(e)}function hg(e){return e!==void 0&&e.inTangents!==void 0&&e.outTangents!==void 0}var Ta=class{constructor(t,n,i,s){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new n.constructor(i),this.sampleValues=n,this.valueSize=i,this.settings=null,this.DefaultSettings_={}}evaluate(t){let n=this.parameterPositions,i=this._cachedIndex,s=n[i],a=n[i-1];t:{e:{let r;n:{i:if(!(t<s)){for(let o=i+2;;){if(s===void 0){if(t<a)break i;return i=n.length,this._cachedIndex=i,this.copySampleValue_(i-1)}if(i===o)break;if(a=s,s=n[++i],t<s)break e}r=n.length;break n}if(!(t>=a)){let o=n[1];t<o&&(i=2,a=o);for(let l=i-2;;){if(a===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===l)break;if(s=a,a=n[--i-1],t>=a)break e}r=i,i=0;break n}break t}for(;i<r;){let o=i+r>>>1;t<n[o]?r=o:i=o+1}if(s=n[i],a=n[i-1],a===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return i=n.length,this._cachedIndex=i,this.copySampleValue_(i-1)}this._cachedIndex=i,this.intervalChanged_(i,a,s)}return this.interpolate_(i,a,t,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){let n=this.resultBuffer,i=this.sampleValues,s=this.valueSize,a=t*s;for(let r=0;r!==s;++r)n[r]=i[a+r];return n}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}},Xh=class extends Ta{constructor(t,n,i,s){super(t,n,i,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:dg,endingEnd:dg}}intervalChanged_(t,n,i){let s=this.parameterPositions,a=t-2,r=t+1,o=s[a],l=s[r];if(o===void 0)switch(this.getSettings_().endingStart){case pg:a=t,o=2*n-i;break;case mg:a=s.length-2,o=n+s[a]-s[a+1];break;default:a=t,o=i}if(l===void 0)switch(this.getSettings_().endingEnd){case pg:r=t,l=2*i-n;break;case mg:r=1,l=i+s[1]-s[0];break;default:r=t-1,l=n}let c=(i-n)*.5,u=this.valueSize;this._weightPrev=c/(n-o),this._weightNext=c/(l-i),this._offsetPrev=a*u,this._offsetNext=r*u}interpolate_(t,n,i,s){let a=this.resultBuffer,r=this.sampleValues,o=this.valueSize,l=t*o,c=l-o,u=this._offsetPrev,f=this._offsetNext,h=this._weightPrev,d=this._weightNext,m=(i-n)/(s-n),b=m*m,g=b*m,p=-h*g+2*h*b-h*m,y=(1+h)*g+(-1.5-2*h)*b+(-.5+h)*m+1,S=(-1-d)*g+(1.5+d)*b+.5*m,v=d*g-d*b;for(let T=0;T!==o;++T)a[T]=p*r[u+T]+y*r[c+T]+S*r[l+T]+v*r[f+T];return a}},qh=class extends Ta{constructor(t,n,i,s){super(t,n,i,s)}interpolate_(t,n,i,s){let a=this.resultBuffer,r=this.sampleValues,o=this.valueSize,l=t*o,c=l-o,u=(i-n)/(s-n),f=1-u;for(let h=0;h!==o;++h)a[h]=r[c+h]*f+r[l+h]*u;return a}},Yh=class extends Ta{constructor(t,n,i,s){super(t,n,i,s)}interpolate_(t){return this.copySampleValue_(t-1)}},Zh=class extends Ta{interpolate_(t,n,i,s){let a=this.resultBuffer,r=this.sampleValues,o=this.valueSize,l=t*o,c=l-o,u=this.inTangents,f=this.outTangents;if(!u||!f){let m=(i-n)/(s-n),b=1-m;for(let g=0;g!==o;++g)a[g]=r[c+g]*b+r[l+g]*m;return a}let h=o*2,d=t-1;for(let m=0;m!==o;++m){let b=r[c+m],g=r[l+m],p=d*h+m*2,y=f[p],S=f[p+1],v=t*h+m*2,T=u[v],E=u[v+1],C=WE(i,n,y,T,s);a[m]=MS(C,b,S,E,g)}return a}};function MS(e,t,n,i,s){let a=1-e;return a*a*a*t+3*a*a*e*n+3*a*e*e*i+e*e*e*s}function GE(e,t,n,i,s){let a=1-e;return 3*a*a*(n-t)+6*a*e*(i-n)+3*e*e*(s-i)}function WE(e,t,n,i,s){let a=(e-t)/(s-t);for(let r=0;r<8;r++){let o=MS(a,t,n,i,s)-e;if(Math.abs(o)<1e-10)break;let l=GE(a,t,n,i,s);if(Math.abs(l)<1e-10)break;a=Math.max(0,Math.min(1,a-o/l))}return a}var ri=class{constructor(t,n,i,s){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(n===void 0||n.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=vo(n,this.TimeBufferType),this.values=vo(i,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(t){let n=t.constructor,i;if(n.toJSON!==this.toJSON)i=n.toJSON(t);else{i={name:t.name,times:vo(t.times,Array),values:vo(t.values,Array)};let s=t.getInterpolation();s!==t.DefaultInterpolation&&(i.interpolation=s),hg(t.settings)&&(i.settings={inTangents:vo(t.settings.inTangents,Array),outTangents:vo(t.settings.outTangents,Array)})}return i.type=t.ValueTypeName,i}InterpolantFactoryMethodDiscrete(t){return new Yh(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new qh(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new Xh(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodBezier(t){let n=new Zh(this.times,this.values,this.getValueSize(),t);return this.settings&&(n.inTangents=this.settings.inTangents,n.outTangents=this.settings.outTangents),n}setInterpolation(t){let n;switch(t){case ql:n=this.InterpolantFactoryMethodDiscrete;break;case Oh:n=this.InterpolantFactoryMethodLinear;break;case Mh:n=this.InterpolantFactoryMethodSmooth;break;case fg:n=this.InterpolantFactoryMethodBezier;break}if(n===void 0){let i="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(i);return Lt("KeyframeTrack:",i),this}return this.createInterpolant=n,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return ql;case this.InterpolantFactoryMethodLinear:return Oh;case this.InterpolantFactoryMethodSmooth:return Mh;case this.InterpolantFactoryMethodBezier:return fg}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){let n=this.times;for(let i=0,s=n.length;i!==s;++i)n[i]+=t}return this}scale(t){if(t!==1){let n=this.times;for(let i=0,s=n.length;i!==s;++i)n[i]*=t;hg(this.settings)&&(Ob(this.settings.inTangents,t),Ob(this.settings.outTangents,t))}return this}trim(t,n){let i=this.times,s=i.length,a=0,r=s-1;for(;a!==s&&i[a]<t;)++a;for(;r!==-1&&i[r]>n;)--r;if(++r,a!==0||r!==s){a>=r&&(r=Math.max(r,1),a=r-1);let o=this.getValueSize();this.times=i.slice(a,r),this.values=this.values.slice(a*o,r*o)}return this}validate(){let t=!0,n=this.getValueSize();n-Math.floor(n)!==0&&(It("KeyframeTrack: Invalid value size in track.",this),t=!1);let i=this.times,s=this.values,a=i.length;a===0&&(It("KeyframeTrack: Track is empty.",this),t=!1);let r=null;for(let o=0;o!==a;o++){let l=i[o];if(typeof l=="number"&&isNaN(l)){It("KeyframeTrack: Time is not a valid number.",this,o,l),t=!1;break}if(r!==null&&r>l){It("KeyframeTrack: Out of order keys.",this,o,l,r),t=!1;break}r=l}if(s!==void 0&&_E(s))for(let o=0,l=s.length;o!==l;++o){let c=s[o];if(isNaN(c)){It("KeyframeTrack: Value is not a valid number.",this,o,c),t=!1;break}}return t}optimize(){let t=this.times.slice(),n=this.values.slice(),i=this.getValueSize(),s=this.getInterpolation()===Mh,a=t.length-1,r=1;for(let o=1;o<a;++o){let l=!1,c=t[o],u=t[o+1];if(c!==u&&(o!==1||c!==t[0]))if(s)l=!0;else{let f=o*i,h=f-i,d=f+i;for(let m=0;m!==i;++m){let b=n[f+m];if(b!==n[h+m]||b!==n[d+m]){l=!0;break}}}if(l){if(o!==r){t[r]=t[o];let f=o*i,h=r*i;for(let d=0;d!==i;++d)n[h+d]=n[f+d]}++r}}if(a>0){t[r]=t[a];for(let o=a*i,l=r*i,c=0;c!==i;++c)n[l+c]=n[o+c];++r}return r!==t.length?(this.times=t.slice(0,r),this.values=n.slice(0,r*i)):(this.times=t,this.values=n),this}clone(){let t=this.times.slice(),n=this.values.slice(),i=this.constructor,s=new i(this.name,t,n);return s.createInterpolant=this.createInterpolant,hg(this.settings)&&(s.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),s}};function Ob(e,t){for(let n=0,i=e.length;n!==i;n+=2)e[n]*=t}ri.prototype.ValueTypeName="";ri.prototype.TimeBufferType=Float32Array;ri.prototype.ValueBufferType=Float32Array;ri.prototype.DefaultInterpolation=Oh;var Ea=class extends ri{constructor(t,n,i){super(t,n,i)}};Ea.prototype.ValueTypeName="bool";Ea.prototype.ValueBufferType=Array;Ea.prototype.DefaultInterpolation=ql;Ea.prototype.InterpolantFactoryMethodLinear=void 0;Ea.prototype.InterpolantFactoryMethodSmooth=void 0;var Kh=class extends ri{constructor(t,n,i,s){super(t,n,i,s)}};Kh.prototype.ValueTypeName="color";var Jh=class extends ri{constructor(t,n,i,s){super(t,n,i,s)}};Jh.prototype.ValueTypeName="number";var Qh=class extends Ta{constructor(t,n,i,s){super(t,n,i,s)}interpolate_(t,n,i,s){let a=this.resultBuffer,r=this.sampleValues,o=this.valueSize,l=(i-n)/(s-n),c=t*o;for(let u=c+o;c!==u;c+=4)is.slerpFlat(a,0,r,c-o,r,c,l);return a}},rc=class extends ri{constructor(t,n,i,s){super(t,n,i,s)}InterpolantFactoryMethodLinear(t){return new Qh(this.times,this.values,this.getValueSize(),t)}};rc.prototype.ValueTypeName="quaternion";rc.prototype.InterpolantFactoryMethodSmooth=void 0;var Aa=class extends ri{constructor(t,n,i){super(t,n,i)}};Aa.prototype.ValueTypeName="string";Aa.prototype.ValueBufferType=Array;Aa.prototype.DefaultInterpolation=ql;Aa.prototype.InterpolantFactoryMethodLinear=void 0;Aa.prototype.InterpolantFactoryMethodSmooth=void 0;var jh=class extends ri{constructor(t,n,i,s){super(t,n,i,s)}};jh.prototype.ValueTypeName="vector";var $h=class{constructor(t,n,i){let s=this,a=!1,r=0,o=0,l,c=[];this.onStart=void 0,this.onLoad=t,this.onProgress=n,this.onError=i,this._abortController=null,this.itemStart=function(u){o++,a===!1&&s.onStart!==void 0&&s.onStart(u,r,o),a=!0},this.itemEnd=function(u){r++,s.onProgress!==void 0&&s.onProgress(u,r,o),r===o&&(a=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(u){s.onError!==void 0&&s.onError(u)},this.resolveURL=function(u){return u=u.normalize("NFC"),l?l(u):u},this.setURLModifier=function(u){return l=u,this},this.addHandler=function(u,f){return c.push(u,f),this},this.removeHandler=function(u){let f=c.indexOf(u);return f!==-1&&c.splice(f,2),this},this.getHandler=function(u){for(let f=0,h=c.length;f<h;f+=2){let d=c[f],m=c[f+1];if(d.global&&(d.lastIndex=0),d.test(u))return m}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},TS=new $h,tf=class{constructor(t){this.manager=t!==void 0?t:TS,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(t,n){let i=this;return new Promise(function(s,a){i.load(t,s,n,a)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}abort(){return this}};tf.DEFAULT_MATERIAL_NAME="__DEFAULT";var bh=new V,Sh=new is,$i=new V,oc=class extends Mi{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new qe,this.projectionMatrix=new qe,this.projectionMatrixInverse=new qe,this.coordinateSystem=Bi,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,n){return super.copy(t,n),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorld.decompose(bh,Sh,$i),$i.x===1&&$i.y===1&&$i.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(bh,Sh,$i.set(1,1,1)).invert()}updateWorldMatrix(t,n,i=!1){super.updateWorldMatrix(t,n,i),this.matrixWorld.decompose(bh,Sh,$i),$i.x===1&&$i.y===1&&$i.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(bh,Sh,$i.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},xa=new V,Ib=new ie,Pb=new ie,Wn=class extends oc{constructor(t=50,n=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=n,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,n){return super.copy(t,n),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){let n=.5*this.getFilmHeight()/t;this.fov=Ih*2*Math.atan(n),this.updateProjectionMatrix()}getFocalLength(){let t=Math.tan(Wm*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Ih*2*Math.atan(Math.tan(Wm*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,n,i){xa.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(xa.x,xa.y).multiplyScalar(-t/xa.z),xa.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(xa.x,xa.y).multiplyScalar(-t/xa.z)}getViewSize(t,n){return this.getViewBounds(t,Ib,Pb),n.subVectors(Pb,Ib)}setViewOffset(t,n,i,s,a,r){this.aspect=t/n,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=s,this.view.width=a,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=this.near,n=t*Math.tan(Wm*.5*this.fov)/this.zoom,i=2*n,s=this.aspect*i,a=-.5*s,r=this.view;if(this.view!==null&&this.view.enabled){let l=r.fullWidth,c=r.fullHeight;a+=r.offsetX*s/l,n-=r.offsetY*i/c,s*=r.width/l,i*=r.height/c}let o=this.filmOffset;o!==0&&(a+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(a,a+s,n,n-i,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let n=super.toJSON(t);return n.object.fov=this.fov,n.object.zoom=this.zoom,n.object.near=this.near,n.object.far=this.far,n.object.focus=this.focus,n.object.aspect=this.aspect,this.view!==null&&(n.object.view=Object.assign({},this.view)),n.object.filmGauge=this.filmGauge,n.object.filmOffset=this.filmOffset,n}};var cr=class extends oc{constructor(t=-1,n=1,i=1,s=-1,a=.1,r=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=n,this.top=i,this.bottom=s,this.near=a,this.far=r,this.updateProjectionMatrix()}copy(t,n){return super.copy(t,n),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,n,i,s,a,r){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=s,this.view.width=a,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=(this.right-this.left)/(2*this.zoom),n=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2,a=i-t,r=i+t,o=s+n,l=s-n;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;a+=c*this.view.offsetX,r=a+c*this.view.width,o-=u*this.view.offsetY,l=o-u*this.view.height}this.projectionMatrix.makeOrthographic(a,r,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let n=super.toJSON(t);return n.object.zoom=this.zoom,n.object.left=this.left,n.object.right=this.right,n.object.top=this.top,n.object.bottom=this.bottom,n.object.near=this.near,n.object.far=this.far,this.view!==null&&(n.object.view=Object.assign({},this.view)),n}};var _o=-90,bo=1,ef=class extends Mi{constructor(t,n,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new Wn(_o,bo,t,n);s.layers=this.layers,this.add(s);let a=new Wn(_o,bo,t,n);a.layers=this.layers,this.add(a);let r=new Wn(_o,bo,t,n);r.layers=this.layers,this.add(r);let o=new Wn(_o,bo,t,n);o.layers=this.layers,this.add(o);let l=new Wn(_o,bo,t,n);l.layers=this.layers,this.add(l);let c=new Wn(_o,bo,t,n);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let t=this.coordinateSystem,n=this.children.concat(),[i,s,a,r,o,l]=n;for(let c of n)this.remove(c);if(t===Bi)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),a.up.set(0,0,-1),a.lookAt(0,1,0),r.up.set(0,0,1),r.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===Kl)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),a.up.set(0,0,1),a.lookAt(0,1,0),r.up.set(0,0,-1),r.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(let c of n)this.add(c),c.updateMatrixWorld()}update(t,n){this.parent===null&&this.updateMatrixWorld();let{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());let[a,r,o,l,c,u]=this.children,f=t.getRenderTarget(),h=t.getActiveCubeFace(),d=t.getActiveMipmapLevel(),m=t.xr.enabled;t.xr.enabled=!1;let b=i.texture.generateMipmaps;i.texture.generateMipmaps=!1;let g=!1;t.isWebGLRenderer===!0?g=t.state.buffers.depth.getReversed():g=t.reversedDepthBuffer,t.setRenderTarget(i,0,s),g&&t.autoClear===!1&&t.clearDepth(),t.render(n,a),t.setRenderTarget(i,1,s),g&&t.autoClear===!1&&t.clearDepth(),t.render(n,r),t.setRenderTarget(i,2,s),g&&t.autoClear===!1&&t.clearDepth(),t.render(n,o),t.setRenderTarget(i,3,s),g&&t.autoClear===!1&&t.clearDepth(),t.render(n,l),t.setRenderTarget(i,4,s),g&&t.autoClear===!1&&t.clearDepth(),t.render(n,c),i.texture.generateMipmaps=b,t.setRenderTarget(i,5,s),g&&t.autoClear===!1&&t.clearDepth(),t.render(n,u),t.setRenderTarget(f,h,d),t.xr.enabled=m,i.texture.needsPMREMUpdate=!0}},nf=class extends Wn{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}};var Wg="\\[\\]\\.:\\/",XE=new RegExp("["+Wg+"]","g"),Xg="[^"+Wg+"]",qE="[^"+Wg.replace("\\.","")+"]",YE=/((?:WC+[\/:])*)/.source.replace("WC",Xg),ZE=/(WCOD+)?/.source.replace("WCOD",qE),KE=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Xg),JE=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Xg),QE=new RegExp("^"+YE+ZE+KE+JE+"$"),jE=["material","materials","bones","map"],gg=class{constructor(t,n,i){let s=i||De.parseTrackName(n);this._targetGroup=t,this._bindings=t.subscribe_(n,s)}getValue(t,n){this.bind();let i=this._targetGroup.nCachedObjects_,s=this._bindings[i];s!==void 0&&s.getValue(t,n)}setValue(t,n){let i=this._bindings;for(let s=this._targetGroup.nCachedObjects_,a=i.length;s!==a;++s)i[s].setValue(t,n)}bind(){let t=this._bindings;for(let n=this._targetGroup.nCachedObjects_,i=t.length;n!==i;++n)t[n].bind()}unbind(){let t=this._bindings;for(let n=this._targetGroup.nCachedObjects_,i=t.length;n!==i;++n)t[n].unbind()}},De=class e{constructor(t,n,i){this.path=n,this.parsedPath=i||e.parseTrackName(n),this.node=e.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,n,i){return t&&t.isAnimationObjectGroup?new e.Composite(t,n,i):new e(t,n,i)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(XE,"")}static parseTrackName(t){let n=QE.exec(t);if(n===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+t);let i={nodeName:n[2],objectName:n[3],objectIndex:n[4],propertyName:n[5],propertyIndex:n[6]},s=i.nodeName&&i.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let a=i.nodeName.substring(s+1);jE.indexOf(a)!==-1&&(i.nodeName=i.nodeName.substring(0,s),i.objectName=a)}if(i.propertyName===null||i.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+t);return i}static findNode(t,n){if(n===void 0||n===""||n==="."||n===-1||n===t.name||n===t.uuid)return t;if(t.skeleton){let i=t.skeleton.getBoneByName(n);if(i!==void 0)return i}if(t.children){let i=function(a){for(let r=0;r<a.length;r++){let o=a[r];if(o.name===n||o.uuid===n)return o;let l=i(o.children);if(l)return l}return null},s=i(t.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,n){t[n]=this.targetObject[this.propertyName]}_getValue_array(t,n){let i=this.resolvedProperty;for(let s=0,a=i.length;s!==a;++s)t[n++]=i[s]}_getValue_arrayElement(t,n){t[n]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,n){this.resolvedProperty.toArray(t,n)}_setValue_direct(t,n){this.targetObject[this.propertyName]=t[n]}_setValue_direct_setNeedsUpdate(t,n){this.targetObject[this.propertyName]=t[n],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,n){this.targetObject[this.propertyName]=t[n],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,n){let i=this.resolvedProperty;for(let s=0,a=i.length;s!==a;++s)i[s]=t[n++]}_setValue_array_setNeedsUpdate(t,n){let i=this.resolvedProperty;for(let s=0,a=i.length;s!==a;++s)i[s]=t[n++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,n){let i=this.resolvedProperty;for(let s=0,a=i.length;s!==a;++s)i[s]=t[n++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,n){this.resolvedProperty[this.propertyIndex]=t[n]}_setValue_arrayElement_setNeedsUpdate(t,n){this.resolvedProperty[this.propertyIndex]=t[n],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,n){this.resolvedProperty[this.propertyIndex]=t[n],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,n){this.resolvedProperty.fromArray(t,n)}_setValue_fromArray_setNeedsUpdate(t,n){this.resolvedProperty.fromArray(t,n),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,n){this.resolvedProperty.fromArray(t,n),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,n){this.bind(),this.getValue(t,n)}_setValue_unbound(t,n){this.bind(),this.setValue(t,n)}bind(){let t=this.node,n=this.parsedPath,i=n.objectName,s=n.propertyName,a=n.propertyIndex;if(t||(t=e.findNode(this.rootNode,n.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){Lt("PropertyBinding: No target node found for track: "+this.path+".");return}if(i){let c=n.objectIndex;switch(i){case"materials":if(!t.material){It("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){It("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){It("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let u=0;u<t.length;u++)if(t[u].name===c){c=u;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){It("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){It("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[i]===void 0){It("PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[i]}if(c!==void 0){if(t[c]===void 0){It("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[c]}}let r=t[s];if(r===void 0){let c=n.nodeName;It("PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",t);return}let o=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?o=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(a!==void 0){if(s==="morphTargetInfluences"){if(!t.geometry){It("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){It("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[a]!==void 0&&(a=t.morphTargetDictionary[a])}l=this.BindingType.ArrayElement,this.resolvedProperty=r,this.propertyIndex=a}else r.fromArray!==void 0&&r.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=r):Array.isArray(r)?(l=this.BindingType.EntireArray,this.resolvedProperty=r):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};De.Composite=gg;De.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};De.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};De.prototype.GetterByBindingType=[De.prototype._getValue_direct,De.prototype._getValue_array,De.prototype._getValue_arrayElement,De.prototype._getValue_toArray];De.prototype.SetterByBindingTypeAndVersioning=[[De.prototype._setValue_direct,De.prototype._setValue_direct_setNeedsUpdate,De.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[De.prototype._setValue_array,De.prototype._setValue_array_setNeedsUpdate,De.prototype._setValue_array_setMatrixWorldNeedsUpdate],[De.prototype._setValue_arrayElement,De.prototype._setValue_arrayElement_setNeedsUpdate,De.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[De.prototype._setValue_fromArray,De.prototype._setValue_fromArray_setNeedsUpdate,De.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var b3=new Float32Array(1);var yg=class e{static{e.prototype.isMatrix2=!0}constructor(t,n,i,s){this.elements=[1,0,0,1],t!==void 0&&this.set(t,n,i,s)}identity(){return this.set(1,0,0,1),this}fromArray(t,n=0){for(let i=0;i<4;i++)this.elements[i]=t[i+n];return this}set(t,n,i,s){let a=this.elements;return a[0]=t,a[2]=n,a[1]=i,a[3]=s,this}};function qg(e,t,n,i){let s=$E(i);switch(n){case Bg:return e*t;case Fg:return e*t/s.components*s.byteLength;case uf:return e*t/s.components*s.byteLength;case Da:return e*t*2/s.components*s.byteLength;case hf:return e*t*2/s.components*s.byteLength;case zg:return e*t*3/s.components*s.byteLength;case Ai:return e*t*4/s.components*s.byteLength;case ff:return e*t*4/s.components*s.byteLength;case hc:case fc:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case dc:case pc:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case pf:case gf:return Math.max(e,16)*Math.max(t,8)/4;case df:case mf:return Math.max(e,8)*Math.max(t,8)/2;case yf:case xf:case _f:case bf:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case vf:case mc:case Sf:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case Mf:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case Tf:return Math.floor((e+4)/5)*Math.floor((t+3)/4)*16;case Ef:return Math.floor((e+4)/5)*Math.floor((t+4)/5)*16;case Af:return Math.floor((e+5)/6)*Math.floor((t+4)/5)*16;case wf:return Math.floor((e+5)/6)*Math.floor((t+5)/6)*16;case Cf:return Math.floor((e+7)/8)*Math.floor((t+4)/5)*16;case Rf:return Math.floor((e+7)/8)*Math.floor((t+5)/6)*16;case Nf:return Math.floor((e+7)/8)*Math.floor((t+7)/8)*16;case Df:return Math.floor((e+9)/10)*Math.floor((t+4)/5)*16;case Lf:return Math.floor((e+9)/10)*Math.floor((t+5)/6)*16;case Uf:return Math.floor((e+9)/10)*Math.floor((t+7)/8)*16;case Of:return Math.floor((e+9)/10)*Math.floor((t+9)/10)*16;case If:return Math.floor((e+11)/12)*Math.floor((t+9)/10)*16;case Pf:return Math.floor((e+11)/12)*Math.floor((t+11)/12)*16;case Bf:case zf:case Ff:return Math.ceil(e/4)*Math.ceil(t/4)*16;case kf:case Hf:return Math.ceil(e/4)*Math.ceil(t/4)*8;case gc:case Vf:return Math.ceil(e/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${n} format.`)}function $E(e){switch(e){case oi:case Ug:return{byteLength:1,components:1};case Do:case Og:case Hi:return{byteLength:2,components:1};case lf:case cf:return{byteLength:2,components:4};case Fi:case of:case ki:return{byteLength:4,components:1};case Ig:case Pg:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${e}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"186"}}));typeof window<"u"&&(window.__THREE__?Lt("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="186");function qS(){let e=null,t=!1,n=null,i=null;function s(a,r){i=e.requestAnimationFrame(s),n(a,r)}return{start:function(){t!==!0&&n!==null&&e!==null&&(i=e.requestAnimationFrame(s),t=!0)},stop:function(){e!==null&&e.cancelAnimationFrame(i),t=!1},setAnimationLoop:function(a){n=a},setContext:function(a){e=a}}}function eA(e){let t=new WeakMap;function n(o,l){let c=o.array,u=o.usage,f=c.byteLength,h=e.createBuffer();e.bindBuffer(l,h),e.bufferData(l,c,u),o.onUploadCallback();let d;if(c instanceof Float32Array)d=e.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)d=e.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?d=e.HALF_FLOAT:d=e.UNSIGNED_SHORT;else if(c instanceof Int16Array)d=e.SHORT;else if(c instanceof Uint32Array)d=e.UNSIGNED_INT;else if(c instanceof Int32Array)d=e.INT;else if(c instanceof Int8Array)d=e.BYTE;else if(c instanceof Uint8Array)d=e.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)d=e.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:h,type:d,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:f}}function i(o,l,c){let u=l.array,f=l.updateRanges;if(e.bindBuffer(c,o),f.length===0)e.bufferSubData(c,0,u);else{f.sort((d,m)=>d.start-m.start);let h=0;for(let d=1;d<f.length;d++){let m=f[h],b=f[d];b.start<=m.start+m.count+1?m.count=Math.max(m.count,b.start+b.count-m.start):(++h,f[h]=b)}f.length=h+1;for(let d=0,m=f.length;d<m;d++){let b=f[d];e.bufferSubData(c,b.start*u.BYTES_PER_ELEMENT,u,b.start,b.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function a(o){o.isInterleavedBufferAttribute&&(o=o.data);let l=t.get(o);l&&(e.deleteBuffer(l.buffer),t.delete(o))}function r(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){let u=t.get(o);(!u||u.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}let c=t.get(o);if(c===void 0)t.set(o,n(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,o,l),c.version=o.version}}return{get:s,remove:a,update:r}}var nA=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,iA=`#ifdef USE_ALPHAHASH
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
#endif`,sA=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,aA=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,rA=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,oA=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,lA=`#ifdef USE_AOMAP
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
#endif`,cA=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,uA=`#ifdef USE_BATCHING
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
#endif`,hA=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,fA=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,dA=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,pA=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,mA=`#ifdef USE_IRIDESCENCE
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
#endif`,gA=`#ifdef USE_BUMPMAP
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
#endif`,yA=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,xA=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,vA=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,_A=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,bA=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,SA=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,MA=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,TA=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
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
#endif`,EA=`#define PI 3.141592653589793
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
} // validated`,AA=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,wA=`vec3 transformedNormal = objectNormal;
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
#endif`,CA=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,RA=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,NA=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,DA=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,LA="gl_FragColor = linearToOutputTexel( gl_FragColor );",UA=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,OA=`#ifdef USE_ENVMAP
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
#endif`,IA=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,PA=`#ifdef USE_ENVMAP
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
#endif`,BA=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,zA=`#ifdef USE_ENVMAP
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
#endif`,FA=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,kA=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,HA=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,VA=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,GA=`#ifdef USE_GRADIENTMAP
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
}`,WA=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,XA=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,qA=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,YA=`uniform bool receiveShadow;
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
#include <lightprobes_pars_fragment>`,ZA=`#ifdef USE_ENVMAP
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
#endif`,KA=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,JA=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,QA=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,jA=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,$A=`PhysicalMaterial material;
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
#endif`,tw=`uniform sampler2D dfgLUT;
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
}`,ew=`
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
#endif`,nw=`#if defined( RE_IndirectDiffuse )
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
#endif`,iw=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,sw=`#ifdef USE_LIGHT_PROBES_GRID
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
#endif`,aw=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,rw=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,ow=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,lw=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,cw=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,uw=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,hw=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,fw=`#if defined( USE_POINTS_UV )
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
#endif`,dw=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,pw=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,mw=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,gw=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,yw=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,xw=`#ifdef USE_MORPHTARGETS
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
#endif`,vw=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,_w=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,bw=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Sw=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Mw=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Tw=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,Ew=`#ifdef USE_NORMALMAP
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
#endif`,Aw=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,ww=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Cw=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Rw=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Nw=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Dw=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Lw=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Uw=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Ow=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Iw=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Pw=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Bw=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,zw=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Fw=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,kw=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Hw=`float getShadowMask() {
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
}`,Vw=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Gw=`#ifdef USE_SKINNING
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
#endif`,Ww=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Xw=`#ifdef USE_SKINNING
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
#endif`,qw=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Yw=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Zw=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Kw=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Jw=`#ifdef USE_TRANSMISSION
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
#endif`,Qw=`#ifdef USE_TRANSMISSION
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
#endif`,jw=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,$w=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,tC=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,eC=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,nC=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,iC=`uniform sampler2D t2D;
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
}`,sC=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,aC=`#ifdef ENVMAP_TYPE_CUBE
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
}`,rC=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,oC=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,lC=`#include <common>
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
}`,cC=`#if DEPTH_PACKING == 3200
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
}`,uC=`#define DISTANCE
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
}`,hC=`#define DISTANCE
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
}`,fC=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,dC=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,pC=`uniform float scale;
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
}`,mC=`uniform vec3 diffuse;
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
}`,gC=`#include <common>
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
}`,yC=`uniform vec3 diffuse;
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
}`,xC=`#define LAMBERT
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
}`,vC=`#define LAMBERT
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
}`,_C=`#define MATCAP
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
}`,bC=`#define MATCAP
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
}`,SC=`#define NORMAL
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
}`,MC=`#define NORMAL
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
}`,TC=`#define PHONG
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
}`,EC=`#define PHONG
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
}`,AC=`#define STANDARD
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
}`,wC=`#define STANDARD
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
}`,CC=`#define TOON
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
}`,RC=`#define TOON
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
}`,NC=`uniform float size;
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
}`,DC=`uniform vec3 diffuse;
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
}`,LC=`#include <common>
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
}`,UC=`uniform vec3 color;
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
}`,OC=`uniform float rotation;
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
}`,IC=`uniform vec3 diffuse;
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
}`,Gt={alphahash_fragment:nA,alphahash_pars_fragment:iA,alphamap_fragment:sA,alphamap_pars_fragment:aA,alphatest_fragment:rA,alphatest_pars_fragment:oA,aomap_fragment:lA,aomap_pars_fragment:cA,batching_pars_vertex:uA,batching_vertex:hA,begin_vertex:fA,beginnormal_vertex:dA,bsdfs:pA,iridescence_fragment:mA,bumpmap_pars_fragment:gA,clipping_planes_fragment:yA,clipping_planes_pars_fragment:xA,clipping_planes_pars_vertex:vA,clipping_planes_vertex:_A,color_fragment:bA,color_pars_fragment:SA,color_pars_vertex:MA,color_vertex:TA,common:EA,cube_uv_reflection_fragment:AA,defaultnormal_vertex:wA,displacementmap_pars_vertex:CA,displacementmap_vertex:RA,emissivemap_fragment:NA,emissivemap_pars_fragment:DA,colorspace_fragment:LA,colorspace_pars_fragment:UA,envmap_fragment:OA,envmap_common_pars_fragment:IA,envmap_pars_fragment:PA,envmap_pars_vertex:BA,envmap_physical_pars_fragment:ZA,envmap_vertex:zA,fog_vertex:FA,fog_pars_vertex:kA,fog_fragment:HA,fog_pars_fragment:VA,gradientmap_pars_fragment:GA,lightmap_pars_fragment:WA,lights_lambert_fragment:XA,lights_lambert_pars_fragment:qA,lights_pars_begin:YA,lights_toon_fragment:KA,lights_toon_pars_fragment:JA,lights_phong_fragment:QA,lights_phong_pars_fragment:jA,lights_physical_fragment:$A,lights_physical_pars_fragment:tw,lights_fragment_begin:ew,lights_fragment_maps:nw,lights_fragment_end:iw,lightprobes_pars_fragment:sw,logdepthbuf_fragment:aw,logdepthbuf_pars_fragment:rw,logdepthbuf_pars_vertex:ow,logdepthbuf_vertex:lw,map_fragment:cw,map_pars_fragment:uw,map_particle_fragment:hw,map_particle_pars_fragment:fw,metalnessmap_fragment:dw,metalnessmap_pars_fragment:pw,morphinstance_vertex:mw,morphcolor_vertex:gw,morphnormal_vertex:yw,morphtarget_pars_vertex:xw,morphtarget_vertex:vw,normal_fragment_begin:_w,normal_fragment_maps:bw,normal_pars_fragment:Sw,normal_pars_vertex:Mw,normal_vertex:Tw,normalmap_pars_fragment:Ew,clearcoat_normal_fragment_begin:Aw,clearcoat_normal_fragment_maps:ww,clearcoat_pars_fragment:Cw,iridescence_pars_fragment:Rw,opaque_fragment:Nw,packing:Dw,premultiplied_alpha_fragment:Lw,project_vertex:Uw,dithering_fragment:Ow,dithering_pars_fragment:Iw,roughnessmap_fragment:Pw,roughnessmap_pars_fragment:Bw,shadowmap_pars_fragment:zw,shadowmap_pars_vertex:Fw,shadowmap_vertex:kw,shadowmask_pars_fragment:Hw,skinbase_vertex:Vw,skinning_pars_vertex:Gw,skinning_vertex:Ww,skinnormal_vertex:Xw,specularmap_fragment:qw,specularmap_pars_fragment:Yw,tonemapping_fragment:Zw,tonemapping_pars_fragment:Kw,transmission_fragment:Jw,transmission_pars_fragment:Qw,uv_pars_fragment:jw,uv_pars_vertex:$w,uv_vertex:tC,worldpos_vertex:eC,background_vert:nC,background_frag:iC,backgroundCube_vert:sC,backgroundCube_frag:aC,cube_vert:rC,cube_frag:oC,depth_vert:lC,depth_frag:cC,distance_vert:uC,distance_frag:hC,equirect_vert:fC,equirect_frag:dC,linedashed_vert:pC,linedashed_frag:mC,meshbasic_vert:gC,meshbasic_frag:yC,meshlambert_vert:xC,meshlambert_frag:vC,meshmatcap_vert:_C,meshmatcap_frag:bC,meshnormal_vert:SC,meshnormal_frag:MC,meshphong_vert:TC,meshphong_frag:EC,meshphysical_vert:AC,meshphysical_frag:wC,meshtoon_vert:CC,meshtoon_frag:RC,points_vert:NC,points_frag:DC,shadow_vert:LC,shadow_frag:UC,sprite_vert:OC,sprite_frag:IC},pt={common:{diffuse:{value:new se(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Bt},alphaMap:{value:null},alphaMapTransform:{value:new Bt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Bt}},envmap:{envMap:{value:null},envMapRotation:{value:new Bt},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Bt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Bt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Bt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Bt},normalScale:{value:new ie(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Bt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Bt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Bt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Bt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new se(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new V},probesMax:{value:new V},probesResolution:{value:new V}},points:{diffuse:{value:new se(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Bt},alphaTest:{value:0},uvTransform:{value:new Bt}},sprite:{diffuse:{value:new se(16777215)},opacity:{value:1},center:{value:new ie(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Bt},alphaMap:{value:null},alphaMapTransform:{value:new Bt},alphaTest:{value:0}}},rs={basic:{uniforms:wn([pt.common,pt.specularmap,pt.envmap,pt.aomap,pt.lightmap,pt.fog]),vertexShader:Gt.meshbasic_vert,fragmentShader:Gt.meshbasic_frag},lambert:{uniforms:wn([pt.common,pt.specularmap,pt.envmap,pt.aomap,pt.lightmap,pt.emissivemap,pt.bumpmap,pt.normalmap,pt.displacementmap,pt.fog,pt.lights,{emissive:{value:new se(0)},envMapIntensity:{value:1}}]),vertexShader:Gt.meshlambert_vert,fragmentShader:Gt.meshlambert_frag},phong:{uniforms:wn([pt.common,pt.specularmap,pt.envmap,pt.aomap,pt.lightmap,pt.emissivemap,pt.bumpmap,pt.normalmap,pt.displacementmap,pt.fog,pt.lights,{emissive:{value:new se(0)},specular:{value:new se(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Gt.meshphong_vert,fragmentShader:Gt.meshphong_frag},standard:{uniforms:wn([pt.common,pt.envmap,pt.aomap,pt.lightmap,pt.emissivemap,pt.bumpmap,pt.normalmap,pt.displacementmap,pt.roughnessmap,pt.metalnessmap,pt.fog,pt.lights,{emissive:{value:new se(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Gt.meshphysical_vert,fragmentShader:Gt.meshphysical_frag},toon:{uniforms:wn([pt.common,pt.aomap,pt.lightmap,pt.emissivemap,pt.bumpmap,pt.normalmap,pt.displacementmap,pt.gradientmap,pt.fog,pt.lights,{emissive:{value:new se(0)}}]),vertexShader:Gt.meshtoon_vert,fragmentShader:Gt.meshtoon_frag},matcap:{uniforms:wn([pt.common,pt.bumpmap,pt.normalmap,pt.displacementmap,pt.fog,{matcap:{value:null}}]),vertexShader:Gt.meshmatcap_vert,fragmentShader:Gt.meshmatcap_frag},points:{uniforms:wn([pt.points,pt.fog]),vertexShader:Gt.points_vert,fragmentShader:Gt.points_frag},dashed:{uniforms:wn([pt.common,pt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Gt.linedashed_vert,fragmentShader:Gt.linedashed_frag},depth:{uniforms:wn([pt.common,pt.displacementmap]),vertexShader:Gt.depth_vert,fragmentShader:Gt.depth_frag},normal:{uniforms:wn([pt.common,pt.bumpmap,pt.normalmap,pt.displacementmap,{opacity:{value:1}}]),vertexShader:Gt.meshnormal_vert,fragmentShader:Gt.meshnormal_frag},sprite:{uniforms:wn([pt.sprite,pt.fog]),vertexShader:Gt.sprite_vert,fragmentShader:Gt.sprite_frag},background:{uniforms:{uvTransform:{value:new Bt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Gt.background_vert,fragmentShader:Gt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Bt}},vertexShader:Gt.backgroundCube_vert,fragmentShader:Gt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Gt.cube_vert,fragmentShader:Gt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Gt.equirect_vert,fragmentShader:Gt.equirect_frag},distance:{uniforms:wn([pt.common,pt.displacementmap,{referencePosition:{value:new V},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Gt.distance_vert,fragmentShader:Gt.distance_frag},shadow:{uniforms:wn([pt.lights,pt.fog,{color:{value:new se(0)},opacity:{value:1}}]),vertexShader:Gt.shadow_vert,fragmentShader:Gt.shadow_frag}};rs.physical={uniforms:wn([rs.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Bt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Bt},clearcoatNormalScale:{value:new ie(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Bt},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Bt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Bt},sheen:{value:0},sheenColor:{value:new se(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Bt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Bt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Bt},transmissionSamplerSize:{value:new ie},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Bt},attenuationDistance:{value:0},attenuationColor:{value:new se(0)},specularColor:{value:new se(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Bt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Bt},anisotropyVector:{value:new ie},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Bt}}]),vertexShader:Gt.meshphysical_vert,fragmentShader:Gt.meshphysical_frag};var Xf={r:0,b:0,g:0},PC=new qe,YS=new Bt;YS.set(-1,0,0,0,1,0,0,0,1);function BC(e,t,n,i,s,a){let r=new se(0),o=s===!0?0:1,l,c,u=null,f=0,h=null;function d(y){let S=y.isScene===!0?y.background:null;if(S&&S.isTexture){let v=y.backgroundBlurriness>0;S=t.get(S,v)}return S}function m(y){let S=!1,v=d(y);v===null?g(r,o):v&&v.isColor&&(g(v,1),S=!0);let T=e.xr.getEnvironmentBlendMode();T==="additive"?n.buffers.color.setClear(0,0,0,1,a):T==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(e.autoClear||S)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil))}function b(y,S){let v=d(S);v&&(v.isCubeTexture||v.mapping===cc)?(c===void 0&&(c=new an(new Co(1,1,1),new ai({name:"BackgroundCubeMaterial",uniforms:fr(rs.backgroundCube.uniforms),vertexShader:rs.backgroundCube.vertexShader,fragmentShader:rs.backgroundCube.fragmentShader,side:Un,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(T,E,C){this.matrixWorld.copyPosition(C.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(c)),c.material.uniforms.envMap.value=v,c.material.uniforms.backgroundBlurriness.value=S.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(PC.makeRotationFromEuler(S.backgroundRotation)).transpose(),v.isCubeTexture&&v.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(YS),c.material.toneMapped=Qt.getTransfer(v.colorSpace)!==he,(u!==v||f!==v.version||h!==e.toneMapping)&&(c.material.needsUpdate=!0,u=v,f=v.version,h=e.toneMapping),c.layers.enableAll(),y.unshift(c,c.geometry,c.material,0,0,null)):v&&v.isTexture&&(l===void 0&&(l=new an(new Ma(2,2),new ai({name:"BackgroundMaterial",uniforms:fr(rs.background.uniforms),vertexShader:rs.background.vertexShader,fragmentShader:rs.background.fragmentShader,side:wa,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(l)),l.material.uniforms.t2D.value=v,l.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,l.material.toneMapped=Qt.getTransfer(v.colorSpace)!==he,v.matrixAutoUpdate===!0&&v.updateMatrix(),l.material.uniforms.uvTransform.value.copy(v.matrix),(u!==v||f!==v.version||h!==e.toneMapping)&&(l.material.needsUpdate=!0,u=v,f=v.version,h=e.toneMapping),l.layers.enableAll(),y.unshift(l,l.geometry,l.material,0,0,null))}function g(y,S){y.getRGB(Xf,Gg(e)),n.buffers.color.setClear(Xf.r,Xf.g,Xf.b,S,a)}function p(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return r},setClearColor:function(y,S=1){r.set(y),o=S,g(r,o)},getClearAlpha:function(){return o},setClearAlpha:function(y){o=y,g(r,o)},render:m,addToRenderList:b,dispose:p}}function zC(e,t){let n=e.getParameter(e.MAX_VERTEX_ATTRIBS),i={},s=h(null),a=s,r=!1;function o(O,F,X,U,G){let J=!1,I=f(O,U,X,F);a!==I&&(a=I,c(a.object)),J=d(O,U,X,G),J&&m(O,U,X,G),G!==null&&t.update(G,e.ELEMENT_ARRAY_BUFFER),(J||r)&&(r=!1,v(O,F,X,U),G!==null&&e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,t.get(G).buffer))}function l(){return e.createVertexArray()}function c(O){return e.bindVertexArray(O)}function u(O){return e.deleteVertexArray(O)}function f(O,F,X,U){let G=U.wireframe===!0,J=i[F.id];J===void 0&&(J={},i[F.id]=J);let I=O.isInstancedMesh===!0?O.id:0,it=J[I];it===void 0&&(it={},J[I]=it);let q=it[X.id];q===void 0&&(q={},it[X.id]=q);let tt=q[G];return tt===void 0&&(tt=h(l()),q[G]=tt),tt}function h(O){let F=[],X=[],U=[];for(let G=0;G<n;G++)F[G]=0,X[G]=0,U[G]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:F,enabledAttributes:X,attributeDivisors:U,object:O,attributes:{},index:null}}function d(O,F,X,U){let G=a.attributes,J=F.attributes,I=0,it=X.getAttributes();for(let q in it)if(it[q].location>=0){let et=G[q],St=J[q];if(St===void 0&&(q==="instanceMatrix"&&O.instanceMatrix&&(St=O.instanceMatrix),q==="instanceColor"&&O.instanceColor&&(St=O.instanceColor)),et===void 0||et.attribute!==St||St&&et.data!==St.data)return!0;I++}return a.attributesNum!==I||a.index!==U}function m(O,F,X,U){let G={},J=F.attributes,I=0,it=X.getAttributes();for(let q in it)if(it[q].location>=0){let et=J[q];et===void 0&&(q==="instanceMatrix"&&O.instanceMatrix&&(et=O.instanceMatrix),q==="instanceColor"&&O.instanceColor&&(et=O.instanceColor));let St={};St.attribute=et,et&&et.data&&(St.data=et.data),G[q]=St,I++}a.attributes=G,a.attributesNum=I,a.index=U}function b(){let O=a.newAttributes;for(let F=0,X=O.length;F<X;F++)O[F]=0}function g(O){p(O,0)}function p(O,F){let X=a.newAttributes,U=a.enabledAttributes,G=a.attributeDivisors;X[O]=1,U[O]===0&&(e.enableVertexAttribArray(O),U[O]=1),G[O]!==F&&(e.vertexAttribDivisor(O,F),G[O]=F)}function y(){let O=a.newAttributes,F=a.enabledAttributes;for(let X=0,U=F.length;X<U;X++)F[X]!==O[X]&&(e.disableVertexAttribArray(X),F[X]=0)}function S(O,F,X,U,G,J,I){I===!0?e.vertexAttribIPointer(O,F,X,G,J):e.vertexAttribPointer(O,F,X,U,G,J)}function v(O,F,X,U){b();let G=U.attributes,J=X.getAttributes(),I=F.defaultAttributeValues;for(let it in J){let q=J[it];if(q.location>=0){let tt=G[it];if(tt===void 0&&(it==="instanceMatrix"&&O.instanceMatrix&&(tt=O.instanceMatrix),it==="instanceColor"&&O.instanceColor&&(tt=O.instanceColor)),tt!==void 0){let et=tt.normalized,St=tt.itemSize,Mt=t.get(tt);if(Mt===void 0)continue;let me=Mt.buffer,Xt=Mt.type,te=Mt.bytesPerElement,Y=Xt===e.INT||Xt===e.UNSIGNED_INT||tt.gpuType===of;if(tt.isInterleavedBufferAttribute){let k=tt.data,ot=k.stride,Rt=tt.offset;if(k.isInstancedInterleavedBuffer){for(let st=0;st<q.locationSize;st++)p(q.location+st,k.meshPerAttribute);O.isInstancedMesh!==!0&&U._maxInstanceCount===void 0&&(U._maxInstanceCount=k.meshPerAttribute*k.count)}else for(let st=0;st<q.locationSize;st++)g(q.location+st);e.bindBuffer(e.ARRAY_BUFFER,me);for(let st=0;st<q.locationSize;st++)S(q.location+st,St/q.locationSize,Xt,et,ot*te,(Rt+St/q.locationSize*st)*te,Y)}else{if(tt.isInstancedBufferAttribute){for(let k=0;k<q.locationSize;k++)p(q.location+k,tt.meshPerAttribute);O.isInstancedMesh!==!0&&U._maxInstanceCount===void 0&&(U._maxInstanceCount=tt.meshPerAttribute*tt.count)}else for(let k=0;k<q.locationSize;k++)g(q.location+k);e.bindBuffer(e.ARRAY_BUFFER,me);for(let k=0;k<q.locationSize;k++)S(q.location+k,St/q.locationSize,Xt,et,St*te,St/q.locationSize*k*te,Y)}}else if(I!==void 0){let et=I[it];if(et!==void 0)switch(et.length){case 2:e.vertexAttrib2fv(q.location,et);break;case 3:e.vertexAttrib3fv(q.location,et);break;case 4:e.vertexAttrib4fv(q.location,et);break;default:e.vertexAttrib1fv(q.location,et)}}}}y()}function T(){A();for(let O in i){let F=i[O];for(let X in F){let U=F[X];for(let G in U){let J=U[G];for(let I in J)u(J[I].object),delete J[I];delete U[G]}}delete i[O]}}function E(O){if(i[O.id]===void 0)return;let F=i[O.id];for(let X in F){let U=F[X];for(let G in U){let J=U[G];for(let I in J)u(J[I].object),delete J[I];delete U[G]}}delete i[O.id]}function C(O){for(let F in i){let X=i[F];for(let U in X){let G=X[U];if(G[O.id]===void 0)continue;let J=G[O.id];for(let I in J)u(J[I].object),delete J[I];delete G[O.id]}}}function _(O){for(let F in i){let X=i[F],U=O.isInstancedMesh===!0?O.id:0,G=X[U];if(G!==void 0){for(let J in G){let I=G[J];for(let it in I)u(I[it].object),delete I[it];delete G[J]}delete X[U],Object.keys(X).length===0&&delete i[F]}}}function A(){R(),r=!0,a!==s&&(a=s,c(a.object))}function R(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:A,resetDefaultState:R,dispose:T,releaseStatesOfGeometry:E,releaseStatesOfObject:_,releaseStatesOfProgram:C,initAttributes:b,enableAttribute:g,disableUnusedAttributes:y}}function FC(e,t,n){let i;function s(l){i=l}function a(l,c){e.drawArrays(i,l,c),n.update(c,i,1)}function r(l,c,u){u!==0&&(e.drawArraysInstanced(i,l,c,u),n.update(c,i,u))}function o(l,c,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,c,0,u);let h=0;for(let d=0;d<u;d++)h+=c[d];n.update(h,i,1)}this.setMode=s,this.render=a,this.renderInstances=r,this.renderMultiDraw=o}function kC(e,t,n,i){let s;function a(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){let C=t.get("EXT_texture_filter_anisotropic");s=e.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function r(C){return!(C!==Ai&&i.convert(C)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(C){let _=C===Hi&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(C!==oi&&C!==ki&&!_&&i.convert(C)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_TYPE))}function l(C){if(C==="highp"){if(e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.HIGH_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.MEDIUM_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=n.precision!==void 0?n.precision:"highp",u=l(c);u!==c&&(Lt("WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);let f=n.logarithmicDepthBuffer===!0,h=n.reversedDepthBuffer===!0&&t.has("EXT_clip_control");n.reversedDepthBuffer===!0&&h===!1&&Lt("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");let d=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),m=e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS),b=e.getParameter(e.MAX_TEXTURE_SIZE),g=e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE),p=e.getParameter(e.MAX_VERTEX_ATTRIBS),y=e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS),S=e.getParameter(e.MAX_VARYING_VECTORS),v=e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS),T=e.getParameter(e.MAX_SAMPLES),E=e.getParameter(e.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:l,textureFormatReadable:r,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:f,reversedDepthBuffer:h,maxTextures:d,maxVertexTextures:m,maxTextureSize:b,maxCubemapSize:g,maxAttributes:p,maxVertexUniforms:y,maxVaryings:S,maxFragmentUniforms:v,maxSamples:T,samples:E}}function HC(e){let t=this,n=null,i=0,s=!1,a=!1,r=new Pi,o=new Bt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(f,h){let d=f.length!==0||h||i!==0||s;return s=h,i=f.length,d},this.beginShadows=function(){a=!0,u(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(f,h){n=u(f,h,0)},this.setState=function(f,h,d){let m=f.clippingPlanes,b=f.clipIntersection,g=f.clipShadows,p=e.get(f);if(!s||m===null||m.length===0||a&&!g)a?u(null):c();else{let y=a?0:i,S=y*4,v=p.clippingState||null;l.value=v,v=u(m,h,S,d);for(let T=0;T!==S;++T)v[T]=n[T];p.clippingState=v,this.numIntersection=b?this.numPlanes:0,this.numPlanes+=y}};function c(){l.value!==n&&(l.value=n,l.needsUpdate=i>0),t.numPlanes=i,t.numIntersection=0}function u(f,h,d,m){let b=f!==null?f.length:0,g=null;if(b!==0){if(g=l.value,m!==!0||g===null){let p=d+b*4,y=h.matrixWorldInverse;o.getNormalMatrix(y),(g===null||g.length<p)&&(g=new Float32Array(p));for(let S=0,v=d;S!==b;++S,v+=4)r.copy(f[S]).applyMatrix4(y,o),r.normal.toArray(g,v),g[v+3]=r.constant}l.value=g,l.needsUpdate=!0}return t.numPlanes=b,t.numIntersection=0,g}}var Oo=4,VC=6,GC=20,WC=256,xc=new cr,ES=new se,Yg=null,Zg=0,Kg=0,Jg=!1,XC=new V,dr=new V,Yf=class{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(t,n=0,i=.1,s=100,a={}){let{size:r=256,position:o=XC}=a;Yg=this._renderer.getRenderTarget(),Zg=this._renderer.getActiveCubeFace(),Kg=this._renderer.getActiveMipmapLevel(),Jg=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(r);let l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(t,i,s,l,o),n>0&&this._blur(l,0,0,n),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(t,n=null){return this._fromTexture(t,n)}fromCubemap(t,n=null){return this._fromTexture(t,n)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=CS(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=wS(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodMeshes.length;t++)this._lodMeshes[t].geometry.dispose()}_cleanup(t){this._renderer.setRenderTarget(Yg,Zg,Kg),this._renderer.xr.enabled=Jg,t.scissorTest=!1,Uo(t,0,0,t.width,t.height)}_fromTexture(t,n){t.mapping===Ca||t.mapping===hr?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Yg=this._renderer.getRenderTarget(),Zg=this._renderer.getActiveCubeFace(),Kg=this._renderer.getActiveMipmapLevel(),Jg=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let i=n||this._allocateTargets();return this._textureToCubeUV(t,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){let t=3*Math.max(this._cubeSize,112),n=4*this._cubeSize,i={magFilter:vn,minFilter:vn,generateMipmaps:!1,type:Hi,format:Ai,colorSpace:Yl,depthBuffer:!1},s=AS(t,n,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==n){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=AS(t,n,i);let{_lodMax:a}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=qC(a)),this._blurMaterial=ZC(a,t,n),this._ggxMaterial=YC(a,t,n)}return s}_compileMaterial(t){let n=new an(new qn,t);this._renderer.compile(n,xc)}_sceneToCubeUV(t,n,i,s,a){let l=new Wn(90,1,n,i),c=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],f=this._renderer,h=f.autoClear,d=f.toneMapping;f.getClearColor(ES),f.toneMapping=zi,f.autoClear=!1,f.state.buffers.depth.getReversed()&&(f.setRenderTarget(s),f.clearDepth(),f.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new an(new Co,new Ti({name:"PMREM.Background",side:Un,depthWrite:!1,depthTest:!1})));let b=this._backgroundBox,g=b.material,p=!1,y=t.background;y?y.isColor&&(g.color.copy(y),t.background=null,p=!0):(g.color.copy(ES),p=!0);for(let S=0;S<6;S++){let v=S%3;v===0?(l.up.set(0,c[S],0),l.position.set(a.x,a.y,a.z),l.lookAt(a.x+u[S],a.y,a.z)):v===1?(l.up.set(0,0,c[S]),l.position.set(a.x,a.y,a.z),l.lookAt(a.x,a.y+u[S],a.z)):(l.up.set(0,c[S],0),l.position.set(a.x,a.y,a.z),l.lookAt(a.x,a.y,a.z+u[S]));let T=this._cubeSize;Uo(s,v*T,S>2?T:0,T,T),f.setRenderTarget(s),p&&f.render(b,l),f.render(t,l)}f.toneMapping=d,f.autoClear=h,t.background=y}_textureToCubeUV(t,n){let i=this._renderer,s=t.mapping===Ca||t.mapping===hr;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=CS()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=wS());let a=s?this._cubemapMaterial:this._equirectMaterial,r=this._lodMeshes[0];r.material=a;let o=a.uniforms;o.envMap.value=t;let l=this._cubeSize;Uo(n,0,0,3*l,2*l),i.setRenderTarget(n),i.render(r,xc)}_applyPMREM(t){let n=this._renderer,i=n.autoClear;n.autoClear=!1;let s=this._lodMeshes.length;for(let a=1;a<s;a++)this._applyGGXFilter(t,a-1,a);n.autoClear=i}_applyGGXFilter(t,n,i){let s=this._renderer,a=this._pingPongRenderTarget,r=this._ggxMaterial,o=this._lodMeshes[i];o.material=r;let l=r.uniforms,c=i/(this._lodMeshes.length-1),u=n/(this._lodMeshes.length-1),f=Math.sqrt(c*c-u*u),h=c*1.25,d=f*h,{_lodMax:m}=this,b=this._sizeLods[i],g=3*b*(i>m-Oo?i-m+Oo:0),p=4*(this._cubeSize-b);l.envMap.value=t.texture,l.roughness.value=d,l.mipInt.value=m-n,Uo(a,g,p,3*b,2*b),s.setRenderTarget(a),s.render(o,xc),l.envMap.value=a.texture,l.roughness.value=0,l.mipInt.value=m-i,Uo(t,g,p,3*b,2*b),s.setRenderTarget(t),s.render(o,xc)}_blur(t,n,i,s){let a=this._pingPongRenderTarget,r=Math.min(s,Math.PI)/Math.SQRT2;this._blurPass(t,a,n,i,r),this._blurPass(a,t,i,i,r)}_blurPass(t,n,i,s,a){let r=this._renderer,o=this._blurMaterial,l=this._lodMeshes[s];l.material=o;let c=o.uniforms;c.envMap.value=t.texture,c.sigma.value=a,c.mipInt.value=this._lodMax-i;let u=this._sizeLods[s],f=3*u*(s>this._lodMax-Oo?s-this._lodMax+Oo:0),h=4*(this._cubeSize-u);Uo(n,f,h,3*u,2*u),r.setRenderTarget(n),r.render(l,xc)}};function qC(e){let t=[],n=[],i=e,s=e-Oo+1+VC;for(let a=0;a<s;a++){let r=Math.pow(2,i);t.push(r);let o=1/(r-2),l=-o,c=1+o,u=[l,l,c,l,c,c,l,l,c,c,l,c],f=6,h=6,d=3,m=new Float32Array(d*h*f),b=new Float32Array(d*h*f);for(let p=0;p<f;p++){let y=p%3*2/3-1,S=p>2?0:-1,v=[y,S,0,y+2/3,S,0,y+2/3,S+1,0,y,S,0,y+2/3,S+1,0,y,S+1,0];m.set(v,d*h*p);for(let T=0;T<h;T++){let E=u[T*2]*2-1,C=u[T*2+1]*2-1;p===0?dr.set(1,C,E):p===1?dr.set(-E,1,-C):p===2?dr.set(-E,C,1):p===3?dr.set(-1,C,-E):p===4?dr.set(-E,-1,C):dr.set(E,C,-1),dr.toArray(b,(p*h+T)*d)}}let g=new qn;g.setAttribute("position",new Si(m,d)),g.setAttribute("outputDirection",new Si(b,d)),n.push(new an(g,null)),i>Oo&&i--}return{lodMeshes:n,sizeLods:t}}function AS(e,t,n){let i=new Xn(e,t,n);return i.texture.mapping=cc,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Uo(e,t,n,i,s){e.viewport.set(t,n,i,s),e.scissor.set(t,n,i,s)}function YC(e,t,n){return new ai({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:WC,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Jf(),fragmentShader:`

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
		`,blending:ss,depthTest:!1,depthWrite:!1})}function ZC(e,t,n){return new ai({name:"SphericalGaussianBlur",defines:{SAMPLES:GC,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:Jf(),fragmentShader:`

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
		`,blending:ss,depthTest:!1,depthWrite:!1})}function wS(){return new ai({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Jf(),fragmentShader:`

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
		`,blending:ss,depthTest:!1,depthWrite:!1})}function CS(){return new ai({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Jf(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:ss,depthTest:!1,depthWrite:!1})}function Jf(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}var Zf=class extends Xn{constructor(t=1,n={}){super(t,t,n),this.isWebGLCubeRenderTarget=!0;let i={width:t,height:t,depth:1},s=[i,i,i,i,i,i];this.texture=new ic(s),this._setTextureOptions(n),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,n){this.texture.type=n.type,this.texture.colorSpace=n.colorSpace,this.texture.generateMipmaps=n.generateMipmaps,this.texture.minFilter=n.minFilter,this.texture.magFilter=n.magFilter;let i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new Co(5,5,5),a=new ai({name:"CubemapFromEquirect",uniforms:fr(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Un,blending:ss});a.uniforms.tEquirect.value=n;let r=new an(s,a),o=n.minFilter;return n.minFilter===Ra&&(n.minFilter=vn),new ef(1,10,this).update(t,r),n.minFilter=o,r.geometry.dispose(),r.material.dispose(),this}clear(t,n=!0,i=!0,s=!0){let a=t.getRenderTarget();for(let r=0;r<6;r++)t.setRenderTarget(this,r),t.clear(n,i,s);t.setRenderTarget(a)}};function KC(e){let t=new WeakMap,n=new WeakMap,i=null;function s(h,d=!1){return h==null?null:d?r(h):a(h)}function a(h){if(h&&h.isTexture){let d=h.mapping;if(d===sf||d===af)if(t.has(h)){let m=t.get(h).texture;return o(m,h.mapping)}else{let m=h.image;if(m&&m.height>0){let b=new Zf(m.height);return b.fromEquirectangularTexture(e,h),t.set(h,b),h.addEventListener("dispose",c),o(b.texture,h.mapping)}else return null}}return h}function r(h){if(h&&h.isTexture){let d=h.mapping,m=d===sf||d===af,b=d===Ca||d===hr;if(m||b){let g=n.get(h),p=g!==void 0?g.texture.pmremVersion:0;if(h.isRenderTargetTexture&&h.pmremVersion!==p)return i===null&&(i=new Yf(e)),g=m?i.fromEquirectangular(h,g):i.fromCubemap(h,g),g.texture.pmremVersion=h.pmremVersion,n.set(h,g),g.texture;if(g!==void 0)return g.texture;{let y=h.image;return m&&y&&y.height>0||b&&y&&l(y)?(i===null&&(i=new Yf(e)),g=m?i.fromEquirectangular(h):i.fromCubemap(h),g.texture.pmremVersion=h.pmremVersion,n.set(h,g),h.addEventListener("dispose",u),g.texture):null}}}return h}function o(h,d){return d===sf?h.mapping=Ca:d===af&&(h.mapping=hr),h}function l(h){let d=0,m=6;for(let b=0;b<m;b++)h[b]!==void 0&&d++;return d===m}function c(h){let d=h.target;d.removeEventListener("dispose",c);let m=t.get(d);m!==void 0&&(t.delete(d),m.dispose())}function u(h){let d=h.target;d.removeEventListener("dispose",u);let m=n.get(d);m!==void 0&&(n.delete(d),m.dispose())}function f(){t=new WeakMap,n=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:s,dispose:f}}function JC(e){let t={};function n(i){if(t[i]!==void 0)return t[i];let s=e.getExtension(i);return t[i]=s,s}return{has:function(i){return n(i)!==null},init:function(){n("EXT_color_buffer_float"),n("WEBGL_clip_cull_distance"),n("OES_texture_float_linear"),n("EXT_color_buffer_half_float"),n("WEBGL_multisampled_render_to_texture"),n("WEBGL_render_shared_exponent")},get:function(i){let s=n(i);return s===null&&or("WebGLRenderer: "+i+" extension not supported."),s}}}function QC(e,t,n,i){let s={},a=new WeakMap;function r(f){let h=f.target;h.index!==null&&t.remove(h.index);for(let m in h.attributes)t.remove(h.attributes[m]);h.removeEventListener("dispose",r),delete s[h.id];let d=a.get(h);d&&(t.remove(d),a.delete(h)),i.releaseStatesOfGeometry(h),h.isInstancedBufferGeometry===!0&&delete h._maxInstanceCount,n.memory.geometries--}function o(f,h){return s[h.id]===!0||(h.addEventListener("dispose",r),s[h.id]=!0,n.memory.geometries++),h}function l(f){let h=f.attributes;for(let d in h)t.update(h[d],e.ARRAY_BUFFER)}function c(f){let h=[],d=f.index,m=f.attributes.position,b=0;if(m===void 0)return;if(d!==null){let y=d.array;b=d.version;for(let S=0,v=y.length;S<v;S+=3){let T=y[S+0],E=y[S+1],C=y[S+2];h.push(T,E,E,C,C,T)}}else{let y=m.array;b=m.version;for(let S=0,v=y.length/3-1;S<v;S+=3){let T=S+0,E=S+1,C=S+2;h.push(T,E,E,C,C,T)}}let g=new(m.count>=65535?ec:tc)(h,1);g.version=b;let p=a.get(f);p&&t.remove(p),a.set(f,g)}function u(f){let h=a.get(f);if(h){let d=f.index;d!==null&&h.version<d.version&&c(f)}else c(f);return a.get(f)}return{get:o,update:l,getWireframeAttribute:u}}function jC(e,t,n){let i;function s(f){i=f}let a,r;function o(f){a=f.type,r=f.bytesPerElement}function l(f,h){e.drawElements(i,h,a,f*r),n.update(h,i,1)}function c(f,h,d){d!==0&&(e.drawElementsInstanced(i,h,a,f*r,d),n.update(h,i,d))}function u(f,h,d){if(d===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,h,0,a,f,0,d);let b=0;for(let g=0;g<d;g++)b+=h[g];n.update(b,i,1)}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=u}function $C(e){let t={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function i(a,r,o){switch(n.calls++,r){case e.TRIANGLES:n.triangles+=o*(a/3);break;case e.LINES:n.lines+=o*(a/2);break;case e.LINE_STRIP:n.lines+=o*(a-1);break;case e.LINE_LOOP:n.lines+=o*a;break;case e.POINTS:n.points+=o*a;break;default:It("WebGLInfo: Unknown draw mode:",r);break}}function s(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:t,render:n,programs:null,autoReset:!0,reset:s,update:i}}function t2(e,t,n){let i=new WeakMap,s=new ze;function a(r,o,l){let c=r.morphTargetInfluences,u=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,f=u!==void 0?u.length:0,h=i.get(o);if(h===void 0||h.count!==f){let A=function(){C.dispose(),i.delete(o),o.removeEventListener("dispose",A)};h!==void 0&&h.texture.dispose();let d=o.morphAttributes.position!==void 0,m=o.morphAttributes.normal!==void 0,b=o.morphAttributes.color!==void 0,g=o.morphAttributes.position||[],p=o.morphAttributes.normal||[],y=o.morphAttributes.color||[],S=0;d===!0&&(S=1),m===!0&&(S=2),b===!0&&(S=3);let v=o.attributes.position.count*S,T=1;v>t.maxTextureSize&&(T=Math.ceil(v/t.maxTextureSize),v=t.maxTextureSize);let E=new Float32Array(v*T*4*f),C=new Ql(E,v,T,f);C.type=ki,C.needsUpdate=!0;let _=S*4;for(let R=0;R<f;R++){let O=g[R],F=p[R],X=y[R],U=v*T*4*R;for(let G=0;G<O.count;G++){let J=G*_;d===!0&&(s.fromBufferAttribute(O,G),E[U+J+0]=s.x,E[U+J+1]=s.y,E[U+J+2]=s.z,E[U+J+3]=0),m===!0&&(s.fromBufferAttribute(F,G),E[U+J+4]=s.x,E[U+J+5]=s.y,E[U+J+6]=s.z,E[U+J+7]=0),b===!0&&(s.fromBufferAttribute(X,G),E[U+J+8]=s.x,E[U+J+9]=s.y,E[U+J+10]=s.z,E[U+J+11]=X.itemSize===4?s.w:1)}}h={count:f,texture:C,size:new ie(v,T)},i.set(o,h),o.addEventListener("dispose",A)}if(r.isInstancedMesh===!0&&r.morphTexture!==null)l.getUniforms().setValue(e,"morphTexture",r.morphTexture,n);else{let d=0;for(let b=0;b<c.length;b++)d+=c[b];let m=o.morphTargetsRelative?1:1-d;l.getUniforms().setValue(e,"morphTargetBaseInfluence",m),l.getUniforms().setValue(e,"morphTargetInfluences",c)}l.getUniforms().setValue(e,"morphTargetsTexture",h.texture,n),l.getUniforms().setValue(e,"morphTargetsTextureSize",h.size)}return{update:a}}function e2(e,t,n,i,s){let a=new WeakMap;function r(c){let u=s.render.frame,f=c.geometry,h=t.get(c,f);if(a.get(h)!==u&&(t.update(h),a.set(h,u)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),a.get(c)!==u&&(n.update(c.instanceMatrix,e.ARRAY_BUFFER),c.instanceColor!==null&&n.update(c.instanceColor,e.ARRAY_BUFFER),a.set(c,u))),c.isSkinnedMesh){let d=c.skeleton;a.get(d)!==u&&(d.update(),a.set(d,u))}return h}function o(){a=new WeakMap}function l(c){let u=c.target;u.removeEventListener("dispose",l),i.releaseStatesOfObject(u),n.remove(u.instanceMatrix),u.instanceColor!==null&&n.remove(u.instanceColor)}return{update:r,dispose:o}}var n2={[Eg]:"LINEAR_TONE_MAPPING",[Ag]:"REINHARD_TONE_MAPPING",[wg]:"CINEON_TONE_MAPPING",[Cg]:"ACES_FILMIC_TONE_MAPPING",[Ng]:"AGX_TONE_MAPPING",[Dg]:"NEUTRAL_TONE_MAPPING",[Rg]:"CUSTOM_TONE_MAPPING"};function i2(e,t,n,i,s,a){let r=new Xn(t,n,{type:e,depthBuffer:s,stencilBuffer:a,samples:i?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),o=null,l=null,c=new qn;c.setAttribute("position",new sn([-1,3,0,-1,-1,0,3,-1,0],3)),c.setAttribute("uv",new sn([0,2,0,0,2,0],2));let u=new Vh({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),f=new an(c,u),h=new cr(-1,1,1,-1,0,1),d=null,m=null,b=!1,g,p=null,y=[],S=!1;this.setSize=function(v,T){r.setSize(v,T),o!==null&&o.setSize(v,T),l!==null&&l.setSize(v,T);for(let E=0;E<y.length;E++){let C=y[E];C.setSize&&C.setSize(v,T)}},this.setEffects=function(v){y=v,S=y.length>0&&y[0].isRenderPass===!0;let T=r.width,E=r.height;y.length>0&&o===null&&(o=new Xn(T,E,{type:Hi,depthBuffer:!1,stencilBuffer:!1}),l=new Xn(T,E,{type:Hi,depthBuffer:!1,stencilBuffer:!1}));for(let C=0;C<y.length;C++){let _=y[C];_.setSize&&_.setSize(T,E)}},this.begin=function(v,T){if(b||v.toneMapping===zi&&y.length===0)return!1;if(p=T,T!==null){let E=T.width,C=T.height;(r.width!==E||r.height!==C)&&this.setSize(E,C)}return S===!1&&v.setRenderTarget(r),g=v.toneMapping,v.toneMapping=zi,!0},this.hasRenderPass=function(){return S},this.end=function(v,T){v.toneMapping=g,b=!0;let E=r,C=o;for(let _=0;_<y.length;_++){let A=y[_];A.enabled!==!1&&(A.render(v,C,E,T),A.needsSwap!==!1&&(E=C,C=C===o?l:o))}if(d!==v.outputColorSpace||m!==v.toneMapping){d=v.outputColorSpace,m=v.toneMapping,u.defines={},Qt.getTransfer(d)===he&&(u.defines.SRGB_TRANSFER="");let _=n2[m];_&&(u.defines[_]=""),u.needsUpdate=!0}u.uniforms.tDiffuse.value=E.texture,v.setRenderTarget(p),v.render(f,h),p=null,b=!1},this.isCompositing=function(){return b},this.dispose=function(){r.dispose(),o!==null&&o.dispose(),l!==null&&l.dispose(),c.dispose(),u.dispose()}}var ZS=new An,$g=new Sa(1,1),KS=new Ql,JS=new zh,QS=new ic,RS=[],NS=[],DS=new Float32Array(16),LS=new Float32Array(9),US=new Float32Array(4);function Po(e,t,n){let i=e[0];if(i<=0||i>0)return e;let s=t*n,a=RS[s];if(a===void 0&&(a=new Float32Array(s),RS[s]=a),t!==0){i.toArray(a,0);for(let r=1,o=0;r!==t;++r)o+=n,e[r].toArray(a,o)}return a}function rn(e,t){if(e.length!==t.length)return!1;for(let n=0,i=e.length;n<i;n++)if(e[n]!==t[n])return!1;return!0}function on(e,t){for(let n=0,i=t.length;n<i;n++)e[n]=t[n]}function Qf(e,t){let n=NS[t];n===void 0&&(n=new Int32Array(t),NS[t]=n);for(let i=0;i!==t;++i)n[i]=e.allocateTextureUnit();return n}function s2(e,t){let n=this.cache;n[0]!==t&&(e.uniform1f(this.addr,t),n[0]=t)}function a2(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2f(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(rn(n,t))return;e.uniform2fv(this.addr,t),on(n,t)}}function r2(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3f(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else if(t.r!==void 0)(n[0]!==t.r||n[1]!==t.g||n[2]!==t.b)&&(e.uniform3f(this.addr,t.r,t.g,t.b),n[0]=t.r,n[1]=t.g,n[2]=t.b);else{if(rn(n,t))return;e.uniform3fv(this.addr,t),on(n,t)}}function o2(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4f(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(rn(n,t))return;e.uniform4fv(this.addr,t),on(n,t)}}function l2(e,t){let n=this.cache,i=t.elements;if(i===void 0){if(rn(n,t))return;e.uniformMatrix2fv(this.addr,!1,t),on(n,t)}else{if(rn(n,i))return;US.set(i),e.uniformMatrix2fv(this.addr,!1,US),on(n,i)}}function c2(e,t){let n=this.cache,i=t.elements;if(i===void 0){if(rn(n,t))return;e.uniformMatrix3fv(this.addr,!1,t),on(n,t)}else{if(rn(n,i))return;LS.set(i),e.uniformMatrix3fv(this.addr,!1,LS),on(n,i)}}function u2(e,t){let n=this.cache,i=t.elements;if(i===void 0){if(rn(n,t))return;e.uniformMatrix4fv(this.addr,!1,t),on(n,t)}else{if(rn(n,i))return;DS.set(i),e.uniformMatrix4fv(this.addr,!1,DS),on(n,i)}}function h2(e,t){let n=this.cache;n[0]!==t&&(e.uniform1i(this.addr,t),n[0]=t)}function f2(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2i(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(rn(n,t))return;e.uniform2iv(this.addr,t),on(n,t)}}function d2(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3i(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(rn(n,t))return;e.uniform3iv(this.addr,t),on(n,t)}}function p2(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4i(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(rn(n,t))return;e.uniform4iv(this.addr,t),on(n,t)}}function m2(e,t){let n=this.cache;n[0]!==t&&(e.uniform1ui(this.addr,t),n[0]=t)}function g2(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2ui(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(rn(n,t))return;e.uniform2uiv(this.addr,t),on(n,t)}}function y2(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3ui(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(rn(n,t))return;e.uniform3uiv(this.addr,t),on(n,t)}}function x2(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4ui(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(rn(n,t))return;e.uniform4uiv(this.addr,t),on(n,t)}}function v2(e,t,n){let i=this.cache,s=n.allocateTextureUnit();i[0]!==s&&(e.uniform1i(this.addr,s),i[0]=s);let a;this.type===e.SAMPLER_2D_SHADOW?($g.compareFunction=n.isReversedDepthBuffer()?Wf:Gf,a=$g):a=ZS,n.setTexture2D(t||a,s)}function _2(e,t,n){let i=this.cache,s=n.allocateTextureUnit();i[0]!==s&&(e.uniform1i(this.addr,s),i[0]=s),n.setTexture3D(t||JS,s)}function b2(e,t,n){let i=this.cache,s=n.allocateTextureUnit();i[0]!==s&&(e.uniform1i(this.addr,s),i[0]=s),n.setTextureCube(t||QS,s)}function S2(e,t,n){let i=this.cache,s=n.allocateTextureUnit();i[0]!==s&&(e.uniform1i(this.addr,s),i[0]=s),n.setTexture2DArray(t||KS,s)}function M2(e){switch(e){case 5126:return s2;case 35664:return a2;case 35665:return r2;case 35666:return o2;case 35674:return l2;case 35675:return c2;case 35676:return u2;case 5124:case 35670:return h2;case 35667:case 35671:return f2;case 35668:case 35672:return d2;case 35669:case 35673:return p2;case 5125:return m2;case 36294:return g2;case 36295:return y2;case 36296:return x2;case 35678:case 36198:case 36298:case 36306:case 35682:return v2;case 35679:case 36299:case 36307:return _2;case 35680:case 36300:case 36308:case 36293:return b2;case 36289:case 36303:case 36311:case 36292:return S2}}function T2(e,t){e.uniform1fv(this.addr,t)}function E2(e,t){let n=Po(t,this.size,2);e.uniform2fv(this.addr,n)}function A2(e,t){let n=Po(t,this.size,3);e.uniform3fv(this.addr,n)}function w2(e,t){let n=Po(t,this.size,4);e.uniform4fv(this.addr,n)}function C2(e,t){let n=Po(t,this.size,4);e.uniformMatrix2fv(this.addr,!1,n)}function R2(e,t){let n=Po(t,this.size,9);e.uniformMatrix3fv(this.addr,!1,n)}function N2(e,t){let n=Po(t,this.size,16);e.uniformMatrix4fv(this.addr,!1,n)}function D2(e,t){e.uniform1iv(this.addr,t)}function L2(e,t){e.uniform2iv(this.addr,t)}function U2(e,t){e.uniform3iv(this.addr,t)}function O2(e,t){e.uniform4iv(this.addr,t)}function I2(e,t){e.uniform1uiv(this.addr,t)}function P2(e,t){e.uniform2uiv(this.addr,t)}function B2(e,t){e.uniform3uiv(this.addr,t)}function z2(e,t){e.uniform4uiv(this.addr,t)}function F2(e,t,n){let i=this.cache,s=t.length,a=Qf(n,s);rn(i,a)||(e.uniform1iv(this.addr,a),on(i,a));let r;this.type===e.SAMPLER_2D_SHADOW?r=$g:r=ZS;for(let o=0;o!==s;++o)n.setTexture2D(t[o]||r,a[o])}function k2(e,t,n){let i=this.cache,s=t.length,a=Qf(n,s);rn(i,a)||(e.uniform1iv(this.addr,a),on(i,a));for(let r=0;r!==s;++r)n.setTexture3D(t[r]||JS,a[r])}function H2(e,t,n){let i=this.cache,s=t.length,a=Qf(n,s);rn(i,a)||(e.uniform1iv(this.addr,a),on(i,a));for(let r=0;r!==s;++r)n.setTextureCube(t[r]||QS,a[r])}function V2(e,t,n){let i=this.cache,s=t.length,a=Qf(n,s);rn(i,a)||(e.uniform1iv(this.addr,a),on(i,a));for(let r=0;r!==s;++r)n.setTexture2DArray(t[r]||KS,a[r])}function G2(e){switch(e){case 5126:return T2;case 35664:return E2;case 35665:return A2;case 35666:return w2;case 35674:return C2;case 35675:return R2;case 35676:return N2;case 5124:case 35670:return D2;case 35667:case 35671:return L2;case 35668:case 35672:return U2;case 35669:case 35673:return O2;case 5125:return I2;case 36294:return P2;case 36295:return B2;case 36296:return z2;case 35678:case 36198:case 36298:case 36306:case 35682:return F2;case 35679:case 36299:case 36307:return k2;case 35680:case 36300:case 36308:case 36293:return H2;case 36289:case 36303:case 36311:case 36292:return V2}}var t0=class{constructor(t,n,i){this.id=t,this.addr=i,this.cache=[],this.type=n.type,this.setValue=M2(n.type)}},e0=class{constructor(t,n,i){this.id=t,this.addr=i,this.cache=[],this.type=n.type,this.size=n.size,this.setValue=G2(n.type)}},n0=class{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,n,i){let s=this.seq;for(let a=0,r=s.length;a!==r;++a){let o=s[a];o.setValue(t,n[o.id],i)}}},Qg=/(\w+)(\])?(\[|\.)?/g;function OS(e,t){e.seq.push(t),e.map[t.id]=t}function W2(e,t,n){let i=e.name,s=i.length;for(Qg.lastIndex=0;;){let a=Qg.exec(i),r=Qg.lastIndex,o=a[1],l=a[2]==="]",c=a[3];if(l&&(o=o|0),c===void 0||c==="["&&r+2===s){OS(n,c===void 0?new t0(o,e,t):new e0(o,e,t));break}else{let f=n.map[o];f===void 0&&(f=new n0(o),OS(n,f)),n=f}}}var Io=class{constructor(t,n){this.seq=[],this.map={};let i=t.getProgramParameter(n,t.ACTIVE_UNIFORMS);for(let r=0;r<i;++r){let o=t.getActiveUniform(n,r),l=t.getUniformLocation(n,o.name);W2(o,l,this)}let s=[],a=[];for(let r of this.seq)r.type===t.SAMPLER_2D_SHADOW||r.type===t.SAMPLER_CUBE_SHADOW||r.type===t.SAMPLER_2D_ARRAY_SHADOW?s.push(r):a.push(r);s.length>0&&(this.seq=s.concat(a))}setValue(t,n,i,s){let a=this.map[n];a!==void 0&&a.setValue(t,i,s)}setOptional(t,n,i){let s=n[i];s!==void 0&&this.setValue(t,i,s)}static upload(t,n,i,s){for(let a=0,r=n.length;a!==r;++a){let o=n[a],l=i[o.id];l.needsUpdate!==!1&&o.setValue(t,l.value,s)}}static seqWithValue(t,n){let i=[];for(let s=0,a=t.length;s!==a;++s){let r=t[s];r.id in n&&i.push(r)}return i}};function IS(e,t,n){let i=e.createShader(t);return e.shaderSource(i,n),e.compileShader(i),i}var X2=37297,q2=0;function Y2(e,t){let n=e.split(`
`),i=[],s=Math.max(t-6,0),a=Math.min(t+6,n.length);for(let r=s;r<a;r++){let o=r+1;i.push(`${o===t?">":" "} ${o}: ${n[r]}`)}return i.join(`
`)}var PS=new Bt;function Z2(e){Qt._getMatrix(PS,Qt.workingColorSpace,e);let t=`mat3( ${PS.elements.map(n=>n.toFixed(4))} )`;switch(Qt.getTransfer(e)){case Zl:return[t,"LinearTransferOETF"];case he:return[t,"sRGBTransferOETF"];default:return Lt("WebGLProgram: Unsupported color space: ",e),[t,"LinearTransferOETF"]}}function BS(e,t,n){let i=e.getShaderParameter(t,e.COMPILE_STATUS),a=(e.getShaderInfoLog(t)||"").trim();if(i&&a==="")return"";let r=/ERROR: 0:(\d+)/.exec(a);if(r){let o=parseInt(r[1]);return n.toUpperCase()+`

`+a+`

`+Y2(e.getShaderSource(t),o)}else return a}function K2(e,t){let n=Z2(t);return[`vec4 ${e}( vec4 value ) {`,`	return ${n[1]}( vec4( value.rgb * ${n[0]}, value.a ) );`,"}"].join(`
`)}var J2={[Eg]:"Linear",[Ag]:"Reinhard",[wg]:"Cineon",[Cg]:"ACESFilmic",[Ng]:"AgX",[Dg]:"Neutral",[Rg]:"Custom"};function Q2(e,t){let n=J2[t];return n===void 0?(Lt("WebGLProgram: Unsupported toneMapping:",t),"vec3 "+e+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+e+"( vec3 color ) { return "+n+"ToneMapping( color ); }"}var qf=new V;function j2(){Qt.getLuminanceCoefficients(qf);let e=qf.x.toFixed(4),t=qf.y.toFixed(4),n=qf.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${e}, ${t}, ${n} );`,"	return dot( weights, rgb );","}"].join(`
`)}function $2(e){return[e.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",e.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(_c).join(`
`)}function tR(e){let t=[];for(let n in e){let i=e[n];i!==!1&&t.push("#define "+n+" "+i)}return t.join(`
`)}function eR(e,t){let n={},i=e.getProgramParameter(t,e.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){let a=e.getActiveAttrib(t,s),r=a.name,o=1;a.type===e.FLOAT_MAT2&&(o=2),a.type===e.FLOAT_MAT3&&(o=3),a.type===e.FLOAT_MAT4&&(o=4),n[r]={type:a.type,location:e.getAttribLocation(t,r),locationSize:o}}return n}function _c(e){return e!==""}function zS(e,t){let n=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return e.replace(/NUM_SUN_LIGHTS/g,t.numSunLights).replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,t.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function FS(e,t){return e.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var nR=/^[ \t]*#include +<([\w\d./]+)>/gm;function i0(e){return e.replace(nR,sR)}var iR=new Map;function sR(e,t){let n=Gt[t];if(n===void 0){let i=iR.get(t);if(i!==void 0)n=Gt[i],Lt('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,i);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+t+">")}return i0(n)}var aR=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function kS(e){return e.replace(aR,rR)}function rR(e,t,n,i){let s="";for(let a=parseInt(t);a<parseInt(n);a++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+a+" ]").replace(/UNROLLED_LOOP_INDEX/g,a);return s}function HS(e){let t=`precision ${e.precision} float;
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
#define LOW_PRECISION`),t}var oR={[lc]:"SHADOWMAP_TYPE_PCF",[Ro]:"SHADOWMAP_TYPE_VSM"};function lR(e){return oR[e.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}var cR={[Ca]:"ENVMAP_TYPE_CUBE",[hr]:"ENVMAP_TYPE_CUBE",[cc]:"ENVMAP_TYPE_CUBE_UV"};function uR(e){return e.envMap===!1?"ENVMAP_TYPE_CUBE":cR[e.envMapMode]||"ENVMAP_TYPE_CUBE"}var hR={[hr]:"ENVMAP_MODE_REFRACTION"};function fR(e){return e.envMap===!1?"ENVMAP_MODE_REFLECTION":hR[e.envMapMode]||"ENVMAP_MODE_REFLECTION"}var dR={[Tg]:"ENVMAP_BLENDING_MULTIPLY",[sS]:"ENVMAP_BLENDING_MIX",[aS]:"ENVMAP_BLENDING_ADD"};function pR(e){return e.envMap===!1?"ENVMAP_BLENDING_NONE":dR[e.combine]||"ENVMAP_BLENDING_NONE"}function mR(e){let t=e.envMapCubeUVHeight;if(t===null)return null;let n=Math.log2(t)-2,i=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,n),112)),texelHeight:i,maxMip:n}}function gR(e,t,n,i){let s=e.getContext(),a=n.defines,r=n.vertexShader,o=n.fragmentShader,l=lR(n),c=uR(n),u=fR(n),f=pR(n),h=mR(n),d=$2(n),m=tR(a),b=s.createProgram(),g,p,y=n.glslVersion?"#version "+n.glslVersion+`
`:"";n.isRawShaderMaterial?(g=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,m].filter(_c).join(`
`),g.length>0&&(g+=`
`),p=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,m].filter(_c).join(`
`),p.length>0&&(p+=`
`)):(g=[HS(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,m,n.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",n.batching?"#define USE_BATCHING":"",n.batchingColor?"#define USE_BATCHING_COLOR":"",n.instancing?"#define USE_INSTANCING":"",n.instancingColor?"#define USE_INSTANCING_COLOR":"",n.instancingMorph?"#define USE_INSTANCING_MORPH":"",n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.map?"#define USE_MAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+u:"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.displacementMap?"#define USE_DISPLACEMENTMAP":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.mapUv?"#define MAP_UV "+n.mapUv:"",n.alphaMapUv?"#define ALPHAMAP_UV "+n.alphaMapUv:"",n.lightMapUv?"#define LIGHTMAP_UV "+n.lightMapUv:"",n.aoMapUv?"#define AOMAP_UV "+n.aoMapUv:"",n.emissiveMapUv?"#define EMISSIVEMAP_UV "+n.emissiveMapUv:"",n.bumpMapUv?"#define BUMPMAP_UV "+n.bumpMapUv:"",n.normalMapUv?"#define NORMALMAP_UV "+n.normalMapUv:"",n.displacementMapUv?"#define DISPLACEMENTMAP_UV "+n.displacementMapUv:"",n.metalnessMapUv?"#define METALNESSMAP_UV "+n.metalnessMapUv:"",n.roughnessMapUv?"#define ROUGHNESSMAP_UV "+n.roughnessMapUv:"",n.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+n.anisotropyMapUv:"",n.clearcoatMapUv?"#define CLEARCOATMAP_UV "+n.clearcoatMapUv:"",n.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+n.clearcoatNormalMapUv:"",n.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+n.clearcoatRoughnessMapUv:"",n.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+n.iridescenceMapUv:"",n.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+n.iridescenceThicknessMapUv:"",n.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+n.sheenColorMapUv:"",n.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+n.sheenRoughnessMapUv:"",n.specularMapUv?"#define SPECULARMAP_UV "+n.specularMapUv:"",n.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+n.specularColorMapUv:"",n.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+n.specularIntensityMapUv:"",n.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+n.transmissionMapUv:"",n.thicknessMapUv?"#define THICKNESSMAP_UV "+n.thicknessMapUv:"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexNormals?"#define HAS_NORMAL":"",n.vertexColors?"#define USE_COLOR":"",n.vertexAlphas?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.flatShading?"#define FLAT_SHADED":"",n.skinning?"#define USE_SKINNING":"",n.morphTargets?"#define USE_MORPHTARGETS":"",n.morphNormals&&n.flatShading===!1?"#define USE_MORPHNORMALS":"",n.morphColors?"#define USE_MORPHCOLORS":"",n.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+n.morphTextureStride:"",n.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+n.morphTargetsCount:"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+l:"",n.sizeAttenuation?"#define USE_SIZEATTENUATION":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",n.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(_c).join(`
`),p=[HS(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,m,n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",n.map?"#define USE_MAP":"",n.matcap?"#define USE_MATCAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+c:"",n.envMap?"#define "+u:"",n.envMap?"#define "+f:"",h?"#define CUBEUV_TEXEL_WIDTH "+h.texelWidth:"",h?"#define CUBEUV_TEXEL_HEIGHT "+h.texelHeight:"",h?"#define CUBEUV_MAX_MIP "+h.maxMip+".0":"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoat?"#define USE_CLEARCOAT":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.dispersion?"#define USE_DISPERSION":"",n.retroreflection?"#define USE_RETROREFLECTION":"",n.iridescence?"#define USE_IRIDESCENCE":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaTest?"#define USE_ALPHATEST":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.sheen?"#define USE_SHEEN":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexColors||n.instancingColor?"#define USE_COLOR":"",n.vertexAlphas||n.batchingColor?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.gradientMap?"#define USE_GRADIENTMAP":"",n.flatShading?"#define FLAT_SHADED":"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+l:"",n.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",n.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",n.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",n.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",n.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",n.toneMapping!==zi?"#define TONE_MAPPING":"",n.toneMapping!==zi?Gt.tonemapping_pars_fragment:"",n.toneMapping!==zi?Q2("toneMapping",n.toneMapping):"",n.dithering?"#define DITHERING":"",n.opaque?"#define OPAQUE":"",Gt.colorspace_pars_fragment,K2("linearToOutputTexel",n.outputColorSpace),j2(),n.useDepthPacking?"#define DEPTH_PACKING "+n.depthPacking:"",`
`].filter(_c).join(`
`)),r=i0(r),r=zS(r,n),r=FS(r,n),o=i0(o),o=zS(o,n),o=FS(o,n),r=kS(r),o=kS(o),n.isRawShaderMaterial!==!0&&(y=`#version 300 es
`,g=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,p=["#define varying in",n.glslVersion===Hg?"":"layout(location = 0) out highp vec4 pc_fragColor;",n.glslVersion===Hg?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);let S=y+g+r,v=y+p+o,T=IS(s,s.VERTEX_SHADER,S),E=IS(s,s.FRAGMENT_SHADER,v);s.attachShader(b,T),s.attachShader(b,E),n.index0AttributeName!==void 0?s.bindAttribLocation(b,0,n.index0AttributeName):n.hasPositionAttribute===!0&&s.bindAttribLocation(b,0,"position"),s.linkProgram(b);function C(O){if(e.debug.checkShaderErrors){let F=s.getProgramInfoLog(b)||"",X=s.getShaderInfoLog(T)||"",U=s.getShaderInfoLog(E)||"",G=F.trim(),J=X.trim(),I=U.trim(),it=!0,q=!0;if(s.getProgramParameter(b,s.LINK_STATUS)===!1)if(it=!1,typeof e.debug.onShaderError=="function")e.debug.onShaderError(s,b,T,E);else{let tt=BS(s,T,"vertex"),et=BS(s,E,"fragment");It("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(b,s.VALIDATE_STATUS)+`

Material Name: `+O.name+`
Material Type: `+O.type+`

Program Info Log: `+G+`
`+tt+`
`+et)}else G!==""?Lt("WebGLProgram: Program Info Log:",G):(J===""||I==="")&&(q=!1);q&&(O.diagnostics={runnable:it,programLog:G,vertexShader:{log:J,prefix:g},fragmentShader:{log:I,prefix:p}})}s.deleteShader(T),s.deleteShader(E),_=new Io(s,b),A=eR(s,b)}let _;this.getUniforms=function(){return _===void 0&&C(this),_};let A;this.getAttributes=function(){return A===void 0&&C(this),A};let R=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return R===!1&&(R=s.getProgramParameter(b,X2)),R},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(b),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=q2++,this.cacheKey=t,this.usedTimes=1,this.program=b,this.vertexShader=T,this.fragmentShader=E,this}var yR=0,s0=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t,n,i){let s=this._getShaderCacheForMaterial(t);return s.has(n)===!1&&(s.add(n),n.usedTimes++),s.has(i)===!1&&(s.add(i),i.usedTimes++),this}remove(t){let n=this.materialCache.get(t);for(let i of n)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(t),this}getVertexShaderStage(t){return this._getShaderStage(t.vertexShader)}getFragmentShaderStage(t){return this._getShaderStage(t.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){let n=this.materialCache,i=n.get(t);return i===void 0&&(i=new Set,n.set(t,i)),i}_getShaderStage(t){let n=this.shaderCache,i=n.get(t);return i===void 0&&(i=new a0(t),n.set(t,i)),i}},a0=class{constructor(t){this.id=yR++,this.code=t,this.usedTimes=0}};function xR(e){return e===Da||e===mc||e===gc}function vR(e,t,n,i,s,a){let r=new jl,o=new s0,l=new Set,c=[],u=new Map,f=i.logarithmicDepthBuffer,h=i.precision,d={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function m(_){return l.add(_),_===0?"uv":`uv${_}`}function b(_,A,R,O,F,X){let U=O.fog,G=F.geometry,J=_.isMeshStandardMaterial||_.isMeshLambertMaterial||_.isMeshPhongMaterial?O.environment:null,I=_.isMeshStandardMaterial||_.isMeshLambertMaterial&&!_.envMap||_.isMeshPhongMaterial&&!_.envMap,it=t.get(_.envMap||J,I),q=it&&it.mapping===cc?it.image.height:null,tt=d[_.type];_.precision!==null&&(h=i.getMaxPrecision(_.precision),h!==_.precision&&Lt("WebGLProgram.getParameters:",_.precision,"not supported, using",h,"instead."));let et=G.morphAttributes.position||G.morphAttributes.normal||G.morphAttributes.color,St=et!==void 0?et.length:0,Mt=0;G.morphAttributes.position!==void 0&&(Mt=1),G.morphAttributes.normal!==void 0&&(Mt=2),G.morphAttributes.color!==void 0&&(Mt=3);let me,Xt,te,Y;if(tt){let Se=rs[tt];me=Se.vertexShader,Xt=Se.fragmentShader}else{me=_.vertexShader,Xt=_.fragmentShader;let Se=o.getVertexShaderStage(_),ce=o.getFragmentShaderStage(_);o.update(_,Se,ce),te=Se.id,Y=ce.id}let k=e.getRenderTarget(),ot=e.state.buffers.depth.getReversed(),Rt=F.isInstancedMesh===!0,st=F.isBatchedMesh===!0,Pt=!!_.map,re=!!_.matcap,Ft=!!it,ae=!!_.aoMap,be=!!_.lightMap,Kt=!!_.bumpMap&&_.wireframe===!1,Ue=!!_.normalMap,ln=!!_.displacementMap,In=!!_.emissiveMap,Be=!!_.metalnessMap,Ze=!!_.roughnessMap,L=_.anisotropy>0,_n=_.clearcoat>0,fe=_.dispersion>0,w=_.retroreflectivity>0,x=_.iridescence>0,P=_.sheen>0,H=_.transmission>0,Z=L&&!!_.anisotropyMap,rt=_n&&!!_.clearcoatMap,lt=_n&&!!_.clearcoatNormalMap,K=_n&&!!_.clearcoatRoughnessMap,j=x&&!!_.iridescenceMap,ct=x&&!!_.iridescenceThicknessMap,At=P&&!!_.sheenColorMap,dt=P&&!!_.sheenRoughnessMap,ut=!!_.specularMap,wt=!!_.specularColorMap,Dt=!!_.specularIntensityMap,kt=H&&!!_.transmissionMap,D=H&&!!_.thicknessMap,ht=!!_.gradientMap,Q=!!_.alphaMap,ft=_.alphaTest>0,yt=!!_.alphaHash,nt=!!_.extensions,Ct=zi;_.toneMapped&&(k===null||k.isXRRenderTarget===!0)&&(Ct=e.toneMapping);let Tt={shaderID:tt,shaderType:_.type,shaderName:_.name,vertexShader:me,fragmentShader:Xt,defines:_.defines,customVertexShaderID:te,customFragmentShaderID:Y,isRawShaderMaterial:_.isRawShaderMaterial===!0,glslVersion:_.glslVersion,precision:h,batching:st,batchingColor:st&&F._colorsTexture!==null,instancing:Rt,instancingColor:Rt&&F.instanceColor!==null,instancingMorph:Rt&&F.morphTexture!==null,outputColorSpace:k===null?e.outputColorSpace:k.isXRRenderTarget===!0?k.texture.colorSpace:Qt.workingColorSpace,alphaToCoverage:!!_.alphaToCoverage,map:Pt,matcap:re,envMap:Ft,envMapMode:Ft&&it.mapping,envMapCubeUVHeight:q,aoMap:ae,lightMap:be,bumpMap:Kt,normalMap:Ue,displacementMap:ln,emissiveMap:In,normalMapObjectSpace:Ue&&_.normalMapType===lS,normalMapTangentSpace:Ue&&_.normalMapType===kg,packedNormalMap:Ue&&_.normalMapType===kg&&xR(_.normalMap.format),metalnessMap:Be,roughnessMap:Ze,anisotropy:L,anisotropyMap:Z,clearcoat:_n,clearcoatMap:rt,clearcoatNormalMap:lt,clearcoatRoughnessMap:K,dispersion:fe,retroreflection:w,iridescence:x,iridescenceMap:j,iridescenceThicknessMap:ct,sheen:P,sheenColorMap:At,sheenRoughnessMap:dt,specularMap:ut,specularColorMap:wt,specularIntensityMap:Dt,transmission:H,transmissionMap:kt,thicknessMap:D,gradientMap:ht,opaque:_.transparent===!1&&_.blending===No&&_.alphaToCoverage===!1,alphaMap:Q,alphaTest:ft,alphaHash:yt,combine:_.combine,mapUv:Pt&&m(_.map.channel),aoMapUv:ae&&m(_.aoMap.channel),lightMapUv:be&&m(_.lightMap.channel),bumpMapUv:Kt&&m(_.bumpMap.channel),normalMapUv:Ue&&m(_.normalMap.channel),displacementMapUv:ln&&m(_.displacementMap.channel),emissiveMapUv:In&&m(_.emissiveMap.channel),metalnessMapUv:Be&&m(_.metalnessMap.channel),roughnessMapUv:Ze&&m(_.roughnessMap.channel),anisotropyMapUv:Z&&m(_.anisotropyMap.channel),clearcoatMapUv:rt&&m(_.clearcoatMap.channel),clearcoatNormalMapUv:lt&&m(_.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:K&&m(_.clearcoatRoughnessMap.channel),iridescenceMapUv:j&&m(_.iridescenceMap.channel),iridescenceThicknessMapUv:ct&&m(_.iridescenceThicknessMap.channel),sheenColorMapUv:At&&m(_.sheenColorMap.channel),sheenRoughnessMapUv:dt&&m(_.sheenRoughnessMap.channel),specularMapUv:ut&&m(_.specularMap.channel),specularColorMapUv:wt&&m(_.specularColorMap.channel),specularIntensityMapUv:Dt&&m(_.specularIntensityMap.channel),transmissionMapUv:kt&&m(_.transmissionMap.channel),thicknessMapUv:D&&m(_.thicknessMap.channel),alphaMapUv:Q&&m(_.alphaMap.channel),vertexTangents:!!G.attributes.tangent&&(Ue||L),vertexNormals:!!G.attributes.normal,vertexColors:_.vertexColors,vertexAlphas:_.vertexColors===!0&&!!G.attributes.color&&G.attributes.color.itemSize===4,pointsUvs:F.isPoints===!0&&!!G.attributes.uv&&(Pt||Q),fog:!!U,useFog:_.fog===!0,fogExp2:!!U&&U.isFogExp2,flatShading:_.wireframe===!1&&(_.flatShading===!0||G.attributes.normal===void 0&&Ue===!1&&(_.isMeshLambertMaterial||_.isMeshPhongMaterial||_.isMeshStandardMaterial||_.isMeshPhysicalMaterial)),sizeAttenuation:_.sizeAttenuation===!0,logarithmicDepthBuffer:f,reversedDepthBuffer:ot,skinning:F.isSkinnedMesh===!0,hasPositionAttribute:G.attributes.position!==void 0,morphTargets:G.morphAttributes.position!==void 0,morphNormals:G.morphAttributes.normal!==void 0,morphColors:G.morphAttributes.color!==void 0,morphTargetsCount:St,morphTextureStride:Mt,numSunLights:A.sun.length,numDirLights:A.directional.length,numPointLights:A.point.length,numSpotLights:A.spot.length,numSpotLightMaps:A.spotLightMap.length,numRectAreaLights:A.rectArea.length,numHemiLights:A.hemi.length,numSunLightShadows:A.sunShadowMap.length,numDirLightShadows:A.directionalShadowMap.length,numPointLightShadows:A.pointShadowMap.length,numSpotLightShadows:A.spotShadowMap.length,numSpotLightShadowsWithMaps:A.numSpotLightShadowsWithMaps,numLightProbes:A.numLightProbes,numLightProbeGrids:X.length,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:_.dithering,shadowMapEnabled:e.shadowMap.enabled&&R.length>0,shadowMapType:e.shadowMap.type,toneMapping:Ct,decodeVideoTexture:Pt&&_.map.isVideoTexture===!0&&Qt.getTransfer(_.map.colorSpace)===he,decodeVideoTextureEmissive:In&&_.emissiveMap.isVideoTexture===!0&&Qt.getTransfer(_.emissiveMap.colorSpace)===he,premultipliedAlpha:_.premultipliedAlpha,doubleSided:_.side===Ei,flipSided:_.side===Un,useDepthPacking:_.depthPacking>=0,depthPacking:_.depthPacking||0,index0AttributeName:_.index0AttributeName,extensionClipCullDistance:nt&&_.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(nt&&_.extensions.multiDraw===!0||st)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:_.customProgramCacheKey()};return Tt.vertexUv1s=l.has(1),Tt.vertexUv2s=l.has(2),Tt.vertexUv3s=l.has(3),l.clear(),Tt}function g(_){let A=[];if(_.shaderID?A.push(_.shaderID):(A.push(_.customVertexShaderID),A.push(_.customFragmentShaderID)),_.defines!==void 0)for(let R in _.defines)A.push(R),A.push(_.defines[R]);return _.isRawShaderMaterial===!1&&(p(A,_),y(A,_),A.push(e.outputColorSpace)),A.push(_.customProgramCacheKey),A.join()}function p(_,A){_.push(A.precision),_.push(A.outputColorSpace),_.push(A.envMapMode),_.push(A.envMapCubeUVHeight),_.push(A.mapUv),_.push(A.alphaMapUv),_.push(A.lightMapUv),_.push(A.aoMapUv),_.push(A.bumpMapUv),_.push(A.normalMapUv),_.push(A.displacementMapUv),_.push(A.emissiveMapUv),_.push(A.metalnessMapUv),_.push(A.roughnessMapUv),_.push(A.anisotropyMapUv),_.push(A.clearcoatMapUv),_.push(A.clearcoatNormalMapUv),_.push(A.clearcoatRoughnessMapUv),_.push(A.iridescenceMapUv),_.push(A.iridescenceThicknessMapUv),_.push(A.sheenColorMapUv),_.push(A.sheenRoughnessMapUv),_.push(A.specularMapUv),_.push(A.specularColorMapUv),_.push(A.specularIntensityMapUv),_.push(A.transmissionMapUv),_.push(A.thicknessMapUv),_.push(A.combine),_.push(A.fogExp2),_.push(A.sizeAttenuation),_.push(A.morphTargetsCount),_.push(A.morphAttributeCount),_.push(A.numSunLights),_.push(A.numDirLights),_.push(A.numPointLights),_.push(A.numSpotLights),_.push(A.numSpotLightMaps),_.push(A.numHemiLights),_.push(A.numRectAreaLights),_.push(A.numSunLightShadows),_.push(A.numDirLightShadows),_.push(A.numPointLightShadows),_.push(A.numSpotLightShadows),_.push(A.numSpotLightShadowsWithMaps),_.push(A.numLightProbes),_.push(A.shadowMapType),_.push(A.toneMapping),_.push(A.numClippingPlanes),_.push(A.numClipIntersection),_.push(A.depthPacking)}function y(_,A){r.disableAll(),A.instancing&&r.enable(0),A.instancingColor&&r.enable(1),A.instancingMorph&&r.enable(2),A.matcap&&r.enable(3),A.envMap&&r.enable(4),A.normalMapObjectSpace&&r.enable(5),A.normalMapTangentSpace&&r.enable(6),A.clearcoat&&r.enable(7),A.iridescence&&r.enable(8),A.alphaTest&&r.enable(9),A.vertexColors&&r.enable(10),A.vertexAlphas&&r.enable(11),A.vertexUv1s&&r.enable(12),A.vertexUv2s&&r.enable(13),A.vertexUv3s&&r.enable(14),A.vertexTangents&&r.enable(15),A.anisotropy&&r.enable(16),A.alphaHash&&r.enable(17),A.batching&&r.enable(18),A.dispersion&&r.enable(19),A.retroreflection&&r.enable(24),A.batchingColor&&r.enable(20),A.gradientMap&&r.enable(21),A.packedNormalMap&&r.enable(22),A.vertexNormals&&r.enable(23),_.push(r.mask),r.disableAll(),A.fog&&r.enable(0),A.useFog&&r.enable(1),A.flatShading&&r.enable(2),A.logarithmicDepthBuffer&&r.enable(3),A.reversedDepthBuffer&&r.enable(4),A.skinning&&r.enable(5),A.morphTargets&&r.enable(6),A.morphNormals&&r.enable(7),A.morphColors&&r.enable(8),A.premultipliedAlpha&&r.enable(9),A.shadowMapEnabled&&r.enable(10),A.doubleSided&&r.enable(11),A.flipSided&&r.enable(12),A.useDepthPacking&&r.enable(13),A.dithering&&r.enable(14),A.transmission&&r.enable(15),A.sheen&&r.enable(16),A.opaque&&r.enable(17),A.pointsUvs&&r.enable(18),A.decodeVideoTexture&&r.enable(19),A.decodeVideoTextureEmissive&&r.enable(20),A.alphaToCoverage&&r.enable(21),A.numLightProbeGrids>0&&r.enable(22),A.hasPositionAttribute&&r.enable(23),_.push(r.mask)}function S(_){let A=d[_.type],R;if(A){let O=rs[A];R=SS.clone(O.uniforms)}else R=_.uniforms;return R}function v(_,A){let R=u.get(A);return R!==void 0?++R.usedTimes:(R=new gR(e,A,_,s),c.push(R),u.set(A,R)),R}function T(_){if(--_.usedTimes===0){let A=c.indexOf(_);c[A]=c[c.length-1],c.pop(),u.delete(_.cacheKey),_.destroy()}}function E(_){o.remove(_)}function C(){o.dispose()}return{getParameters:b,getProgramCacheKey:g,getUniforms:S,acquireProgram:v,releaseProgram:T,releaseShaderCache:E,programs:c,dispose:C}}function _R(){let e=new WeakMap;function t(r){return e.has(r)}function n(r){let o=e.get(r);return o===void 0&&(o={},e.set(r,o)),o}function i(r){e.delete(r)}function s(r,o,l){e.get(r)[o]=l}function a(){e=new WeakMap}return{has:t,get:n,remove:i,update:s,dispose:a}}function bR(e,t){return e.groupOrder!==t.groupOrder?e.groupOrder-t.groupOrder:e.renderOrder!==t.renderOrder?e.renderOrder-t.renderOrder:e.material.id!==t.material.id?e.material.id-t.material.id:e.materialVariant!==t.materialVariant?e.materialVariant-t.materialVariant:e.z!==t.z?e.z-t.z:e.id-t.id}function VS(e,t){return e.groupOrder!==t.groupOrder?e.groupOrder-t.groupOrder:e.renderOrder!==t.renderOrder?e.renderOrder-t.renderOrder:e.z!==t.z?t.z-e.z:e.id-t.id}function GS(){let e=[],t=0,n=[],i=[],s=[];function a(){t=0,n.length=0,i.length=0,s.length=0}function r(h){let d=0;return h.isInstancedMesh&&(d+=2),h.isSkinnedMesh&&(d+=1),d}function o(h,d,m,b,g,p){let y=e[t];return y===void 0?(y={id:h.id,object:h,geometry:d,material:m,materialVariant:r(h),groupOrder:b,renderOrder:h.renderOrder,z:g,group:p},e[t]=y):(y.id=h.id,y.object=h,y.geometry=d,y.material=m,y.materialVariant=r(h),y.groupOrder=b,y.renderOrder=h.renderOrder,y.z=g,y.group=p),t++,y}function l(h,d,m,b,g,p,y){y.reversedDepth===!0&&(g=-g);let S=o(h,d,m,b,g,p);m.transmission>0?i.push(S):m.transparent===!0?s.push(S):n.push(S)}function c(h,d,m,b,g,p){let y=o(h,d,m,b,g,p);m.transmission>0?i.unshift(y):m.transparent===!0?s.unshift(y):n.unshift(y)}function u(h,d){n.length>1&&n.sort(h||bR),i.length>1&&i.sort(d||VS),s.length>1&&s.sort(d||VS)}function f(){for(let h=t,d=e.length;h<d;h++){let m=e[h];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:n,transmissive:i,transparent:s,init:a,push:l,unshift:c,finish:f,sort:u}}function SR(){let e=new WeakMap;function t(i,s){let a=e.get(i),r;return a===void 0?(r=new GS,e.set(i,[r])):s>=a.length?(r=new GS,a.push(r)):r=a[s],r}function n(){e=new WeakMap}return{get:t,dispose:n}}function MR(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case"SunLight":case"DirectionalLight":n={direction:new V,color:new se};break;case"SpotLight":n={position:new V,direction:new V,color:new se,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":n={position:new V,color:new se,distance:0,decay:0};break;case"HemisphereLight":n={direction:new V,skyColor:new se,groundColor:new se};break;case"RectAreaLight":n={color:new se,position:new V,halfWidth:new V,halfHeight:new V};break}return e[t.id]=n,n}}}function TR(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case"SunLight":case"DirectionalLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ie};break;case"SpotLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ie};break;case"PointLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ie,shadowCameraNear:1,shadowCameraFar:1e3};break}return e[t.id]=n,n}}}var ER=0;function AR(e,t){return(t.castShadow?2:0)-(e.castShadow?2:0)+(t.map?1:0)-(e.map?1:0)}function wR(e){let t=new MR,n=TR(),i={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new V);let s=new V,a=new qe,r=new qe;function o(c){let u=0,f=0,h=0;for(let F=0;F<9;F++)i.probe[F].set(0,0,0);let d=0,m=0,b=0,g=0,p=0,y=0,S=0,v=0,T=0,E=0,C=0,_=0,A=0,R=0;c.sort(AR);for(let F=0,X=c.length;F<X;F++){let U=c[F],G=U.color,J=U.intensity,I=U.distance,it=null;if(U.shadow&&U.shadow.map&&(U.shadow.map.texture.format===Da?it=U.shadow.map.texture:it=U.shadow.map.depthTexture||U.shadow.map.texture),U.isAmbientLight)u+=G.r*J,f+=G.g*J,h+=G.b*J;else if(U.isLightProbe){for(let q=0;q<9;q++)i.probe[q].addScaledVector(U.sh.coefficients[q],J);R++}else if(U.isSunLight){let q=t.get(U);if(q.color.copy(U.color).multiplyScalar(U.intensity),U.castShadow){let tt=U.shadow,et=n.get(U);et.shadowIntensity=tt.intensity,et.shadowBias=tt.bias,et.shadowNormalBias=tt.normalBias,et.shadowRadius=tt.radius,et.shadowMapSize.copy(tt.mapSize).multiply(tt.getFrameExtents()),i.sunShadow[m]=et,i.sunShadowMap[m]=it;let St=tt.getViewportCount();for(let Mt=0;Mt<St;Mt++)i.sunShadowMatrix[b+Mt]=tt.getMatrix(Mt),i.sunShadowCascade[b+Mt]=tt._cascadeData[Mt];b+=St,m++}i.sun[d]=q,d++}else if(U.isDirectionalLight){let q=t.get(U);if(q.color.copy(U.color).multiplyScalar(U.intensity),U.castShadow){let tt=U.shadow,et=n.get(U);et.shadowIntensity=tt.intensity,et.shadowBias=tt.bias,et.shadowNormalBias=tt.normalBias,et.shadowRadius=tt.radius,et.shadowMapSize=tt.mapSize,i.directionalShadow[g]=et,i.directionalShadowMap[g]=it,i.directionalShadowMatrix[g]=U.shadow.matrix,T++}i.directional[g]=q,g++}else if(U.isSpotLight){let q=t.get(U);q.position.setFromMatrixPosition(U.matrixWorld),q.color.copy(G).multiplyScalar(J),q.distance=I,q.coneCos=Math.cos(U.angle),q.penumbraCos=Math.cos(U.angle*(1-U.penumbra)),q.decay=U.decay,i.spot[y]=q;let tt=U.shadow;if(U.map&&(i.spotLightMap[_]=U.map,_++,tt.updateMatrices(U),U.castShadow&&A++),i.spotLightMatrix[y]=tt.matrix,U.castShadow){let et=n.get(U);et.shadowIntensity=tt.intensity,et.shadowBias=tt.bias,et.shadowNormalBias=tt.normalBias,et.shadowRadius=tt.radius,et.shadowMapSize=tt.mapSize,i.spotShadow[y]=et,i.spotShadowMap[y]=it,C++}y++}else if(U.isRectAreaLight){let q=t.get(U);q.color.copy(G).multiplyScalar(J),q.halfWidth.set(U.width*.5,0,0),q.halfHeight.set(0,U.height*.5,0),i.rectArea[S]=q,S++}else if(U.isPointLight){let q=t.get(U);if(q.color.copy(U.color).multiplyScalar(U.intensity),q.distance=U.distance,q.decay=U.decay,U.castShadow){let tt=U.shadow,et=n.get(U);et.shadowIntensity=tt.intensity,et.shadowBias=tt.bias,et.shadowNormalBias=tt.normalBias,et.shadowRadius=tt.radius,et.shadowMapSize=tt.mapSize,et.shadowCameraNear=tt.camera.near,et.shadowCameraFar=tt.camera.far,i.pointShadow[p]=et,i.pointShadowMap[p]=it,i.pointShadowMatrix[p]=U.shadow.matrix,E++}i.point[p]=q,p++}else if(U.isHemisphereLight){let q=t.get(U);q.skyColor.copy(U.color).multiplyScalar(J),q.groundColor.copy(U.groundColor).multiplyScalar(J),i.hemi[v]=q,v++}}S>0&&(e.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=pt.LTC_FLOAT_1,i.rectAreaLTC2=pt.LTC_FLOAT_2):(i.rectAreaLTC1=pt.LTC_HALF_1,i.rectAreaLTC2=pt.LTC_HALF_2)),i.ambient[0]=u,i.ambient[1]=f,i.ambient[2]=h;let O=i.hash;(O.sunLength!==d||O.directionalLength!==g||O.pointLength!==p||O.spotLength!==y||O.rectAreaLength!==S||O.hemiLength!==v||O.numSunShadows!==m||O.numDirectionalShadows!==T||O.numPointShadows!==E||O.numSpotShadows!==C||O.numSpotMaps!==_||O.numLightProbes!==R)&&(i.sun.length=d,i.directional.length=g,i.spot.length=y,i.rectArea.length=S,i.point.length=p,i.hemi.length=v,i.sunShadow.length=m,i.sunShadowMap.length=m,i.sunShadowMatrix.length=b,i.sunShadowCascade.length=b,i.directionalShadow.length=T,i.directionalShadowMap.length=T,i.directionalShadowMatrix.length=T,i.pointShadow.length=E,i.pointShadowMap.length=E,i.pointShadowMatrix.length=E,i.spotShadow.length=C,i.spotShadowMap.length=C,i.spotLightMatrix.length=C+_-A,i.spotLightMap.length=_,i.numSpotLightShadowsWithMaps=A,i.numLightProbes=R,O.sunLength=d,O.directionalLength=g,O.pointLength=p,O.spotLength=y,O.rectAreaLength=S,O.hemiLength=v,O.numSunShadows=m,O.numDirectionalShadows=T,O.numPointShadows=E,O.numSpotShadows=C,O.numSpotMaps=_,O.numLightProbes=R,i.version=ER++)}function l(c,u){let f=0,h=0,d=0,m=0,b=0,g=0,p=u.matrixWorldInverse;for(let y=0,S=c.length;y<S;y++){let v=c[y];if(v.isSunLight){let T=i.sun[f];T.direction.setFromMatrixPosition(v.matrixWorld),T.direction.transformDirection(p),f++}else if(v.isDirectionalLight){let T=i.directional[h];T.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),T.direction.sub(s),T.direction.transformDirection(p),h++}else if(v.isSpotLight){let T=i.spot[m];T.position.setFromMatrixPosition(v.matrixWorld),T.position.applyMatrix4(p),T.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),T.direction.sub(s),T.direction.transformDirection(p),m++}else if(v.isRectAreaLight){let T=i.rectArea[b];T.position.setFromMatrixPosition(v.matrixWorld),T.position.applyMatrix4(p),r.identity(),a.copy(v.matrixWorld),a.premultiply(p),r.extractRotation(a),T.halfWidth.set(v.width*.5,0,0),T.halfHeight.set(0,v.height*.5,0),T.halfWidth.applyMatrix4(r),T.halfHeight.applyMatrix4(r),b++}else if(v.isPointLight){let T=i.point[d];T.position.setFromMatrixPosition(v.matrixWorld),T.position.applyMatrix4(p),d++}else if(v.isHemisphereLight){let T=i.hemi[g];T.direction.setFromMatrixPosition(v.matrixWorld),T.direction.transformDirection(p),g++}}}return{setup:o,setupView:l,state:i}}function WS(e){let t=new wR(e),n=[],i=[],s=[];function a(h){f.camera=h,n.length=0,i.length=0,s.length=0}function r(h){n.push(h)}function o(h){i.push(h)}function l(h){s.push(h)}function c(){t.setup(n)}function u(h){t.setupView(n,h)}let f={lightsArray:n,shadowsArray:i,lightProbeGridArray:s,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:a,state:f,setupLights:c,setupLightsView:u,pushLight:r,pushShadow:o,pushLightProbeGrid:l}}function CR(e){let t=new WeakMap;function n(s,a=0){let r=t.get(s),o;return r===void 0?(o=new WS(e),t.set(s,[o])):a>=r.length?(o=new WS(e),r.push(o)):o=r[a],o}function i(){t=new WeakMap}return{get:n,dispose:i}}var RR=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,NR=`uniform sampler2D shadow_pass;
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
}`,DR=[new V(1,0,0),new V(-1,0,0),new V(0,1,0),new V(0,-1,0),new V(0,0,1),new V(0,0,-1)],LR=[new V(0,-1,0),new V(0,-1,0),new V(0,0,1),new V(0,0,-1),new V(0,-1,0),new V(0,-1,0)],XS=new qe,vc=new V,jg=new V;function UR(e,t,n){let i=new nc,s=new ie,a=new ie,r=new ze,o=new Gh,l=new Wh,c={},u=n.maxTextureSize,f={[wa]:Un,[Un]:wa,[Ei]:Ei},h=new ai({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ie},radius:{value:4}},vertexShader:RR,fragmentShader:NR}),d=h.clone();d.defines.HORIZONTAL_PASS=1;let m=new qn;m.setAttribute("position",new Si(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let b=new an(m,h),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=lc;let p=this.type;this.render=function(E,C,_){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||E.length===0)return;this.type===Fb&&(Lt("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=lc);let A=e.getRenderTarget(),R=e.getActiveCubeFace(),O=e.getActiveMipmapLevel(),F=e.state;F.setBlending(ss),F.buffers.depth.getReversed()===!0?F.buffers.color.setClear(0,0,0,0):F.buffers.color.setClear(1,1,1,1),F.buffers.depth.setTest(!0),F.setScissorTest(!1);let X=p!==this.type;X&&C.traverse(function(U){U.material&&(Array.isArray(U.material)?U.material.forEach(G=>G.needsUpdate=!0):U.material.needsUpdate=!0)});for(let U=0,G=E.length;U<G;U++){let J=E[U],I=J.shadow;if(I===void 0){Lt("WebGLShadowMap:",J,"has no shadow.");continue}if(I.autoUpdate===!1&&I.needsUpdate===!1)continue;s.copy(I.mapSize);let it=I.getFrameExtents();s.multiply(it),a.copy(I.mapSize),(s.x>u||s.y>u)&&(s.x>u&&(a.x=Math.floor(u/it.x),s.x=a.x*it.x,I.mapSize.x=a.x),s.y>u&&(a.y=Math.floor(u/it.y),s.y=a.y*it.y,I.mapSize.y=a.y));let q=e.state.buffers.depth.getReversed();if(I.camera._reversedDepth=q,I.map===null||X===!0){if(I.map!==null&&(I.map.depthTexture!==null&&(I.map.depthTexture.dispose(),I.map.depthTexture=null),I.map.dispose()),this.type===Ro){if(J.isPointLight){Lt("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}I.map=new Xn(s.x,s.y,{format:Da,type:Hi,minFilter:vn,magFilter:vn,generateMipmaps:!1}),I.map.texture.name=J.name+".shadowMap",I.map.depthTexture=new Sa(s.x,s.y,ki),I.map.depthTexture.name=J.name+".shadowMapDepth",I.map.depthTexture.format=es,I.map.depthTexture.compareFunction=null,I.map.depthTexture.minFilter=Ye,I.map.depthTexture.magFilter=Ye}else J.isPointLight?(I.map=new Zf(s.x),I.map.depthTexture=new Hh(s.x,Fi)):(I.map=new Xn(s.x,s.y),I.map.depthTexture=new Sa(s.x,s.y,Fi)),I.map.depthTexture.name=J.name+".shadowMap",I.map.depthTexture.format=es,this.type===lc?(I.map.depthTexture.compareFunction=q?Wf:Gf,I.map.depthTexture.minFilter=vn,I.map.depthTexture.magFilter=vn):(I.map.depthTexture.compareFunction=null,I.map.depthTexture.minFilter=Ye,I.map.depthTexture.magFilter=Ye);I.camera.updateProjectionMatrix()}I.map.isWebGLCubeRenderTarget!==!0&&(I.map.width!==s.x||I.map.height!==s.y)&&I.map.setSize(s.x,s.y);let tt=I.map.isWebGLCubeRenderTarget?6:I.getViewportCount();J.isPointLight!==!0&&I.updateMatrices(J,_);for(let et=0;et<tt;et++){let St=I.getCamera(et);if(J.isPointLight){let Mt=I.camera,me=I.matrix,Xt=J.distance||Mt.far;Xt!==Mt.far&&(Mt.far=Xt,Mt.updateProjectionMatrix()),vc.setFromMatrixPosition(J.matrixWorld),Mt.position.copy(vc),jg.copy(Mt.position),jg.add(DR[et]),Mt.up.copy(LR[et]),Mt.lookAt(jg),Mt.updateMatrixWorld(),me.makeTranslation(-vc.x,-vc.y,-vc.z),XS.multiplyMatrices(Mt.projectionMatrix,Mt.matrixWorldInverse),I._frustum.setFromProjectionMatrix(XS,Mt.coordinateSystem,Mt.reversedDepth)}if(I.map.isWebGLCubeRenderTarget)e.setRenderTarget(I.map,et),e.clear();else{et===0&&(e.setRenderTarget(I.map),e.clear());let Mt=I.getViewport(et);r.set(a.x*Mt.x,a.y*Mt.y,a.x*Mt.z,a.y*Mt.w),F.viewport(r)}i=I.getFrustum(et),v(C,_,St,J,this.type)}I.isPointLightShadow!==!0&&this.type===Ro&&y(I,_),I.needsUpdate=!1}p=this.type,g.needsUpdate=!1,e.setRenderTarget(A,R,O)};function y(E,C){let _=t.update(b);h.defines.VSM_SAMPLES!==E.blurSamples&&(h.defines.VSM_SAMPLES=E.blurSamples,d.defines.VSM_SAMPLES=E.blurSamples,h.needsUpdate=!0,d.needsUpdate=!0),E.mapPass===null?E.mapPass=new Xn(s.x,s.y,{format:Da,type:Hi}):(E.mapPass.width!==E.map.width||E.mapPass.height!==E.map.height)&&E.mapPass.setSize(E.map.width,E.map.height),h.uniforms.shadow_pass.value=E.map.depthTexture,h.uniforms.resolution.value.set(E.map.width,E.map.height),h.uniforms.radius.value=E.radius,e.setRenderTarget(E.mapPass),e.clear(),e.renderBufferDirect(C,null,_,h,b,null),d.uniforms.shadow_pass.value=E.mapPass.texture,d.uniforms.resolution.value.set(E.map.width,E.map.height),d.uniforms.radius.value=E.radius,e.setRenderTarget(E.map),e.clear(),e.renderBufferDirect(C,null,_,d,b,null)}function S(E,C,_,A){let R=null,O=_.isPointLight===!0?E.customDistanceMaterial:E.customDepthMaterial;if(O!==void 0)R=O;else if(R=_.isPointLight===!0?l:o,e.localClippingEnabled&&C.clipShadows===!0&&Array.isArray(C.clippingPlanes)&&C.clippingPlanes.length!==0||C.displacementMap&&C.displacementScale!==0||C.alphaMap&&C.alphaTest>0||C.map&&C.alphaTest>0||C.alphaToCoverage===!0){let F=R.uuid,X=C.uuid,U=c[F];U===void 0&&(U={},c[F]=U);let G=U[X];G===void 0&&(G=R.clone(),U[X]=G,C.addEventListener("dispose",T)),R=G}if(R.visible=C.visible,R.wireframe=C.wireframe,A===Ro?R.side=C.shadowSide!==null?C.shadowSide:C.side:R.side=C.shadowSide!==null?C.shadowSide:f[C.side],R.alphaMap=C.alphaMap,R.alphaTest=C.alphaToCoverage===!0?.5:C.alphaTest,R.map=C.map,R.clipShadows=C.clipShadows,R.clippingPlanes=C.clippingPlanes,R.clipIntersection=C.clipIntersection,R.displacementMap=C.displacementMap,R.displacementScale=C.displacementScale,R.displacementBias=C.displacementBias,R.wireframeLinewidth=C.wireframeLinewidth,R.linewidth=C.linewidth,_.isPointLight===!0&&R.isMeshDistanceMaterial===!0){let F=e.properties.get(R);F.light=_}return R}function v(E,C,_,A,R){if(E.visible===!1)return;if(E.layers.test(C.layers)&&(E.isMesh||E.isLine||E.isPoints)&&(E.castShadow||E.receiveShadow&&R===Ro)&&(!E.frustumCulled||E.intersectsFrustum(i))){E.modelViewMatrix.multiplyMatrices(_.matrixWorldInverse,E.matrixWorld);let X=t.update(E),U=E.material;if(Array.isArray(U)){let G=X.groups;for(let J=0,I=G.length;J<I;J++){let it=G[J],q=U[it.materialIndex];if(q&&q.visible){let tt=S(E,q,A,R);E.onBeforeShadow(e,E,C,_,X,tt,it),e.renderBufferDirect(_,null,X,tt,E,it),E.onAfterShadow(e,E,C,_,X,tt,it)}}}else if(U.visible){let G=S(E,U,A,R);E.onBeforeShadow(e,E,C,_,X,G,null),e.renderBufferDirect(_,null,X,G,E,null),E.onAfterShadow(e,E,C,_,X,G,null)}}let F=E.children;for(let X=0,U=F.length;X<U;X++)v(F[X],C,_,A,R)}function T(E){E.target.removeEventListener("dispose",T);for(let _ in c){let A=c[_],R=E.target.uuid;R in A&&(A[R].dispose(),delete A[R])}}}function OR(e,t){function n(){let D=!1,ht=new ze,Q=null,ft=new ze(0,0,0,0);return{setMask:function(yt){Q!==yt&&!D&&(e.colorMask(yt,yt,yt,yt),Q=yt)},setLocked:function(yt){D=yt},setClear:function(yt,nt,Ct,Tt,Se){Se===!0&&(yt*=Tt,nt*=Tt,Ct*=Tt),ht.set(yt,nt,Ct,Tt),ft.equals(ht)===!1&&(e.clearColor(yt,nt,Ct,Tt),ft.copy(ht))},reset:function(){D=!1,Q=null,ft.set(-1,0,0,0)}}}function i(){let D=!1,ht=!1,Q=null,ft=null,yt=null;return{setReversed:function(nt){if(ht!==nt){let Ct=t.get("EXT_clip_control");nt?Ct.clipControlEXT(Ct.LOWER_LEFT_EXT,Ct.ZERO_TO_ONE_EXT):Ct.clipControlEXT(Ct.LOWER_LEFT_EXT,Ct.NEGATIVE_ONE_TO_ONE_EXT),ht=nt;let Tt=yt;yt=null,this.setClear(Tt)}},getReversed:function(){return ht},setTest:function(nt){nt?k(e.DEPTH_TEST):ot(e.DEPTH_TEST)},setMask:function(nt){Q!==nt&&!D&&(e.depthMask(nt),Q=nt)},setFunc:function(nt){if(ht&&(nt=_S[nt]),ft!==nt){switch(nt){case Eh:e.depthFunc(e.NEVER);break;case Ah:e.depthFunc(e.ALWAYS);break;case wh:e.depthFunc(e.LESS);break;case Mo:e.depthFunc(e.LEQUAL);break;case Ch:e.depthFunc(e.EQUAL);break;case Rh:e.depthFunc(e.GEQUAL);break;case Nh:e.depthFunc(e.GREATER);break;case Dh:e.depthFunc(e.NOTEQUAL);break;default:e.depthFunc(e.LEQUAL)}ft=nt}},setLocked:function(nt){D=nt},setClear:function(nt){yt!==nt&&(yt=nt,ht&&(nt=1-nt),e.clearDepth(nt))},reset:function(){D=!1,Q=null,ft=null,yt=null,ht=!1}}}function s(){let D=!1,ht=null,Q=null,ft=null,yt=null,nt=null,Ct=null,Tt=null,Se=null;return{setTest:function(ce){D||(ce?k(e.STENCIL_TEST):ot(e.STENCIL_TEST))},setMask:function(ce){ht!==ce&&!D&&(e.stencilMask(ce),ht=ce)},setFunc:function(ce,wi,Vi){(Q!==ce||ft!==wi||yt!==Vi)&&(e.stencilFunc(ce,wi,Vi),Q=ce,ft=wi,yt=Vi)},setOp:function(ce,wi,Vi){(nt!==ce||Ct!==wi||Tt!==Vi)&&(e.stencilOp(ce,wi,Vi),nt=ce,Ct=wi,Tt=Vi)},setLocked:function(ce){D=ce},setClear:function(ce){Se!==ce&&(e.clearStencil(ce),Se=ce)},reset:function(){D=!1,ht=null,Q=null,ft=null,yt=null,nt=null,Ct=null,Tt=null,Se=null}}}let a=new n,r=new i,o=new s,l=new WeakMap,c=new WeakMap,u={},f={},h={},d=new WeakMap,m=[],b=null,g=!1,p=null,y=null,S=null,v=null,T=null,E=null,C=null,_=new se(0,0,0),A=0,R=!1,O=null,F=null,X=null,U=null,G=null,J=e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS),I=!1,it=0,q=e.getParameter(e.VERSION);q.indexOf("WebGL")!==-1?(it=parseFloat(/^WebGL (\d)/.exec(q)[1]),I=it>=1):q.indexOf("OpenGL ES")!==-1&&(it=parseFloat(/^OpenGL ES (\d)/.exec(q)[1]),I=it>=2);let tt=null,et={},St=e.getParameter(e.SCISSOR_BOX),Mt=e.getParameter(e.VIEWPORT),me=new ze().fromArray(St),Xt=new ze().fromArray(Mt);function te(D,ht,Q,ft){let yt=new Uint8Array(4),nt=e.createTexture();e.bindTexture(D,nt),e.texParameteri(D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(D,e.TEXTURE_MAG_FILTER,e.NEAREST);for(let Ct=0;Ct<Q;Ct++)D===e.TEXTURE_3D||D===e.TEXTURE_2D_ARRAY?e.texImage3D(ht,0,e.RGBA,1,1,ft,0,e.RGBA,e.UNSIGNED_BYTE,yt):e.texImage2D(ht+Ct,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,yt);return nt}let Y={};Y[e.TEXTURE_2D]=te(e.TEXTURE_2D,e.TEXTURE_2D,1),Y[e.TEXTURE_CUBE_MAP]=te(e.TEXTURE_CUBE_MAP,e.TEXTURE_CUBE_MAP_POSITIVE_X,6),Y[e.TEXTURE_2D_ARRAY]=te(e.TEXTURE_2D_ARRAY,e.TEXTURE_2D_ARRAY,1,1),Y[e.TEXTURE_3D]=te(e.TEXTURE_3D,e.TEXTURE_3D,1,1),a.setClear(0,0,0,1),r.setClear(1),o.setClear(0),k(e.DEPTH_TEST),r.setFunc(Mo),Kt(!1),Ue(xg),k(e.CULL_FACE),ae(ss);function k(D){u[D]!==!0&&(e.enable(D),u[D]=!0)}function ot(D){u[D]!==!1&&(e.disable(D),u[D]=!1)}function Rt(D,ht){return h[D]!==ht?(e.bindFramebuffer(D,ht),h[D]=ht,D===e.DRAW_FRAMEBUFFER&&(h[e.FRAMEBUFFER]=ht),D===e.FRAMEBUFFER&&(h[e.DRAW_FRAMEBUFFER]=ht),!0):!1}function st(D,ht){let Q=m,ft=!1;if(D){Q=d.get(ht),Q===void 0&&(Q=[],d.set(ht,Q));let yt=D.textures;if(Q.length!==yt.length||Q[0]!==e.COLOR_ATTACHMENT0){for(let nt=0,Ct=yt.length;nt<Ct;nt++)Q[nt]=e.COLOR_ATTACHMENT0+nt;Q.length=yt.length,ft=!0}}else Q[0]!==e.BACK&&(Q[0]=e.BACK,ft=!0);ft&&e.drawBuffers(Q)}function Pt(D){return b!==D?(e.useProgram(D),b=D,!0):!1}let re={[ur]:e.FUNC_ADD,[Hb]:e.FUNC_SUBTRACT,[Vb]:e.FUNC_REVERSE_SUBTRACT};re[Gb]=e.MIN,re[Wb]=e.MAX;let Ft={[Xb]:e.ZERO,[qb]:e.ONE,[Yb]:e.SRC_COLOR,[Sg]:e.SRC_ALPHA,[$b]:e.SRC_ALPHA_SATURATE,[Qb]:e.DST_COLOR,[Kb]:e.DST_ALPHA,[Zb]:e.ONE_MINUS_SRC_COLOR,[Mg]:e.ONE_MINUS_SRC_ALPHA,[jb]:e.ONE_MINUS_DST_COLOR,[Jb]:e.ONE_MINUS_DST_ALPHA,[tS]:e.CONSTANT_COLOR,[eS]:e.ONE_MINUS_CONSTANT_COLOR,[nS]:e.CONSTANT_ALPHA,[iS]:e.ONE_MINUS_CONSTANT_ALPHA};function ae(D,ht,Q,ft,yt,nt,Ct,Tt,Se,ce){if(D===ss){g===!0&&(ot(e.BLEND),g=!1);return}if(g===!1&&(k(e.BLEND),g=!0),D!==kb){if(D!==p||ce!==R){if((y!==ur||T!==ur)&&(e.blendEquation(e.FUNC_ADD),y=ur,T=ur),ce)switch(D){case No:e.blendFuncSeparate(e.ONE,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case vg:e.blendFunc(e.ONE,e.ONE);break;case _g:e.blendFuncSeparate(e.ZERO,e.ONE_MINUS_SRC_COLOR,e.ZERO,e.ONE);break;case bg:e.blendFuncSeparate(e.DST_COLOR,e.ONE_MINUS_SRC_ALPHA,e.ZERO,e.ONE);break;default:It("WebGLState: Invalid blending: ",D);break}else switch(D){case No:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case vg:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE,e.ONE,e.ONE);break;case _g:It("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case bg:It("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:It("WebGLState: Invalid blending: ",D);break}S=null,v=null,E=null,C=null,_.set(0,0,0),A=0,p=D,R=ce}return}yt=yt||ht,nt=nt||Q,Ct=Ct||ft,(ht!==y||yt!==T)&&(e.blendEquationSeparate(re[ht],re[yt]),y=ht,T=yt),(Q!==S||ft!==v||nt!==E||Ct!==C)&&(e.blendFuncSeparate(Ft[Q],Ft[ft],Ft[nt],Ft[Ct]),S=Q,v=ft,E=nt,C=Ct),(Tt.equals(_)===!1||Se!==A)&&(e.blendColor(Tt.r,Tt.g,Tt.b,Se),_.copy(Tt),A=Se),p=D,R=!1}function be(D,ht){D.side===Ei?ot(e.CULL_FACE):k(e.CULL_FACE);let Q=D.side===Un;ht&&(Q=!Q),Kt(Q),D.blending===No&&D.transparent===!1?ae(ss):ae(D.blending,D.blendEquation,D.blendSrc,D.blendDst,D.blendEquationAlpha,D.blendSrcAlpha,D.blendDstAlpha,D.blendColor,D.blendAlpha,D.premultipliedAlpha),r.setFunc(D.depthFunc),r.setTest(D.depthTest),r.setMask(D.depthWrite),a.setMask(D.colorWrite);let ft=D.stencilWrite;o.setTest(ft),ft&&(o.setMask(D.stencilWriteMask),o.setFunc(D.stencilFunc,D.stencilRef,D.stencilFuncMask),o.setOp(D.stencilFail,D.stencilZFail,D.stencilZPass)),In(D.polygonOffset,D.polygonOffsetFactor,D.polygonOffsetUnits),D.alphaToCoverage===!0?k(e.SAMPLE_ALPHA_TO_COVERAGE):ot(e.SAMPLE_ALPHA_TO_COVERAGE)}function Kt(D){O!==D&&(D?e.frontFace(e.CW):e.frontFace(e.CCW),O=D)}function Ue(D){D!==Bb?(k(e.CULL_FACE),D!==F&&(D===xg?e.cullFace(e.BACK):D===zb?e.cullFace(e.FRONT):e.cullFace(e.FRONT_AND_BACK))):ot(e.CULL_FACE),F=D}function ln(D){D!==X&&(I&&e.lineWidth(D),X=D)}function In(D,ht,Q){D?(k(e.POLYGON_OFFSET_FILL),(U!==ht||G!==Q)&&(U=ht,G=Q,r.getReversed()&&(ht=-ht),e.polygonOffset(ht,Q))):ot(e.POLYGON_OFFSET_FILL)}function Be(D){D?k(e.SCISSOR_TEST):ot(e.SCISSOR_TEST)}function Ze(D){D===void 0&&(D=e.TEXTURE0+J-1),tt!==D&&(e.activeTexture(D),tt=D)}function L(D,ht,Q){Q===void 0&&(tt===null?Q=e.TEXTURE0+J-1:Q=tt);let ft=et[Q];ft===void 0&&(ft={type:void 0,texture:void 0},et[Q]=ft),(ft.type!==D||ft.texture!==ht)&&(tt!==Q&&(e.activeTexture(Q),tt=Q),e.bindTexture(D,ht||Y[D]),ft.type=D,ft.texture=ht)}function _n(){let D=et[tt];D!==void 0&&D.type!==void 0&&(e.bindTexture(D.type,null),D.type=void 0,D.texture=void 0)}function fe(){try{e.compressedTexImage2D(...arguments)}catch(D){It("WebGLState:",D)}}function w(){try{e.compressedTexImage3D(...arguments)}catch(D){It("WebGLState:",D)}}function x(){try{e.texSubImage2D(...arguments)}catch(D){It("WebGLState:",D)}}function P(){try{e.texSubImage3D(...arguments)}catch(D){It("WebGLState:",D)}}function H(){try{e.compressedTexSubImage2D(...arguments)}catch(D){It("WebGLState:",D)}}function Z(){try{e.compressedTexSubImage3D(...arguments)}catch(D){It("WebGLState:",D)}}function rt(){try{e.texStorage2D(...arguments)}catch(D){It("WebGLState:",D)}}function lt(){try{e.texStorage3D(...arguments)}catch(D){It("WebGLState:",D)}}function K(){try{e.texImage2D(...arguments)}catch(D){It("WebGLState:",D)}}function j(){try{e.texImage3D(...arguments)}catch(D){It("WebGLState:",D)}}function ct(D){return f[D]!==void 0?f[D]:e.getParameter(D)}function At(D,ht){f[D]!==ht&&(e.pixelStorei(D,ht),f[D]=ht)}function dt(D){me.equals(D)===!1&&(e.scissor(D.x,D.y,D.z,D.w),me.copy(D))}function ut(D){Xt.equals(D)===!1&&(e.viewport(D.x,D.y,D.z,D.w),Xt.copy(D))}function wt(D,ht){let Q=c.get(ht);Q===void 0&&(Q=new WeakMap,c.set(ht,Q));let ft=Q.get(D);ft===void 0&&(ft=e.getUniformBlockIndex(ht,D.name),Q.set(D,ft))}function Dt(D,ht){let ft=c.get(ht).get(D);l.get(ht)!==ft&&(e.uniformBlockBinding(ht,ft,D.__bindingPointIndex),l.set(ht,ft))}function kt(){e.disable(e.BLEND),e.disable(e.CULL_FACE),e.disable(e.DEPTH_TEST),e.disable(e.POLYGON_OFFSET_FILL),e.disable(e.SCISSOR_TEST),e.disable(e.STENCIL_TEST),e.disable(e.SAMPLE_ALPHA_TO_COVERAGE),e.blendEquation(e.FUNC_ADD),e.blendFunc(e.ONE,e.ZERO),e.blendFuncSeparate(e.ONE,e.ZERO,e.ONE,e.ZERO),e.blendColor(0,0,0,0),e.colorMask(!0,!0,!0,!0),e.clearColor(0,0,0,0),e.depthMask(!0),e.depthFunc(e.LESS),r.setReversed(!1),e.clearDepth(1),e.stencilMask(4294967295),e.stencilFunc(e.ALWAYS,0,4294967295),e.stencilOp(e.KEEP,e.KEEP,e.KEEP),e.clearStencil(0),e.cullFace(e.BACK),e.frontFace(e.CCW),e.polygonOffset(0,0),e.activeTexture(e.TEXTURE0),e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),e.bindFramebuffer(e.READ_FRAMEBUFFER,null),e.useProgram(null),e.lineWidth(1),e.scissor(0,0,e.canvas.width,e.canvas.height),e.viewport(0,0,e.canvas.width,e.canvas.height),e.pixelStorei(e.PACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!1),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,e.BROWSER_DEFAULT_WEBGL),e.pixelStorei(e.PACK_ROW_LENGTH,0),e.pixelStorei(e.PACK_SKIP_PIXELS,0),e.pixelStorei(e.PACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_ROW_LENGTH,0),e.pixelStorei(e.UNPACK_IMAGE_HEIGHT,0),e.pixelStorei(e.UNPACK_SKIP_PIXELS,0),e.pixelStorei(e.UNPACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_SKIP_IMAGES,0),u={},f={},tt=null,et={},h={},d=new WeakMap,m=[],b=null,g=!1,p=null,y=null,S=null,v=null,T=null,E=null,C=null,_=new se(0,0,0),A=0,R=!1,O=null,F=null,X=null,U=null,G=null,me.set(0,0,e.canvas.width,e.canvas.height),Xt.set(0,0,e.canvas.width,e.canvas.height),a.reset(),r.reset(),o.reset()}return{buffers:{color:a,depth:r,stencil:o},enable:k,disable:ot,bindFramebuffer:Rt,drawBuffers:st,useProgram:Pt,setBlending:ae,setMaterial:be,setFlipSided:Kt,setCullFace:Ue,setLineWidth:ln,setPolygonOffset:In,setScissorTest:Be,activeTexture:Ze,bindTexture:L,unbindTexture:_n,compressedTexImage2D:fe,compressedTexImage3D:w,texImage2D:K,texImage3D:j,pixelStorei:At,getParameter:ct,updateUBOMapping:wt,uniformBlockBinding:Dt,texStorage2D:rt,texStorage3D:lt,texSubImage2D:x,texSubImage3D:P,compressedTexSubImage2D:H,compressedTexSubImage3D:Z,scissor:dt,viewport:ut,reset:kt}}function IR(e,t,n,i,s,a,r){let o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new ie,u=new WeakMap,f=new Set,h,d=new WeakMap,m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function b(w,x){return m?new OffscreenCanvas(w,x):Jl("canvas")}function g(w,x,P){let H=1,Z=fe(w);if((Z.width>P||Z.height>P)&&(H=P/Math.max(Z.width,Z.height)),H<1)if(typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&w instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&w instanceof ImageBitmap||typeof VideoFrame<"u"&&w instanceof VideoFrame){let rt=Math.floor(H*Z.width),lt=Math.floor(H*Z.height);h===void 0&&(h=b(rt,lt));let K=x?b(rt,lt):h;return K.width=rt,K.height=lt,K.getContext("2d").drawImage(w,0,0,rt,lt),Lt("WebGLRenderer: Texture has been resized from ("+Z.width+"x"+Z.height+") to ("+rt+"x"+lt+")."),K}else return"data"in w&&Lt("WebGLRenderer: Image in DataTexture is too big ("+Z.width+"x"+Z.height+")."),w;return w}function p(w){return w.generateMipmaps}function y(w){e.generateMipmap(w)}function S(w){return w.isWebGLCubeRenderTarget?e.TEXTURE_CUBE_MAP:w.isWebGL3DRenderTarget?e.TEXTURE_3D:w.isWebGLArrayRenderTarget||w.isCompressedArrayTexture?e.TEXTURE_2D_ARRAY:e.TEXTURE_2D}function v(w,x,P,H,Z,rt=!1){if(w!==null){if(e[w]!==void 0)return e[w];Lt("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+w+"'")}let lt;H&&(lt=t.get("EXT_texture_norm16"),lt||Lt("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let K=x;if(x===e.RED&&(P===e.FLOAT&&(K=e.R32F),P===e.HALF_FLOAT&&(K=e.R16F),P===e.UNSIGNED_BYTE&&(K=e.R8),P===e.UNSIGNED_SHORT&&lt&&(K=lt.R16_EXT),P===e.SHORT&&lt&&(K=lt.R16_SNORM_EXT)),x===e.RED_INTEGER&&(P===e.UNSIGNED_BYTE&&(K=e.R8UI),P===e.UNSIGNED_SHORT&&(K=e.R16UI),P===e.UNSIGNED_INT&&(K=e.R32UI),P===e.BYTE&&(K=e.R8I),P===e.SHORT&&(K=e.R16I),P===e.INT&&(K=e.R32I)),x===e.RG&&(P===e.FLOAT&&(K=e.RG32F),P===e.HALF_FLOAT&&(K=e.RG16F),P===e.UNSIGNED_BYTE&&(K=e.RG8),P===e.UNSIGNED_SHORT&&lt&&(K=lt.RG16_EXT),P===e.SHORT&&lt&&(K=lt.RG16_SNORM_EXT)),x===e.RG_INTEGER&&(P===e.UNSIGNED_BYTE&&(K=e.RG8UI),P===e.UNSIGNED_SHORT&&(K=e.RG16UI),P===e.UNSIGNED_INT&&(K=e.RG32UI),P===e.BYTE&&(K=e.RG8I),P===e.SHORT&&(K=e.RG16I),P===e.INT&&(K=e.RG32I)),x===e.RGB_INTEGER&&(P===e.UNSIGNED_BYTE&&(K=e.RGB8UI),P===e.UNSIGNED_SHORT&&(K=e.RGB16UI),P===e.UNSIGNED_INT&&(K=e.RGB32UI),P===e.BYTE&&(K=e.RGB8I),P===e.SHORT&&(K=e.RGB16I),P===e.INT&&(K=e.RGB32I)),x===e.RGBA_INTEGER&&(P===e.UNSIGNED_BYTE&&(K=e.RGBA8UI),P===e.UNSIGNED_SHORT&&(K=e.RGBA16UI),P===e.UNSIGNED_INT&&(K=e.RGBA32UI),P===e.BYTE&&(K=e.RGBA8I),P===e.SHORT&&(K=e.RGBA16I),P===e.INT&&(K=e.RGBA32I)),x===e.RGB&&(P===e.UNSIGNED_SHORT&&lt&&(K=lt.RGB16_EXT),P===e.SHORT&&lt&&(K=lt.RGB16_SNORM_EXT),P===e.UNSIGNED_INT_5_9_9_9_REV&&(K=e.RGB9_E5),P===e.UNSIGNED_INT_10F_11F_11F_REV&&(K=e.R11F_G11F_B10F)),x===e.RGBA){let j=rt?Zl:Qt.getTransfer(Z);P===e.FLOAT&&(K=e.RGBA32F),P===e.HALF_FLOAT&&(K=e.RGBA16F),P===e.UNSIGNED_BYTE&&(K=j===he?e.SRGB8_ALPHA8:e.RGBA8),P===e.UNSIGNED_SHORT&&lt&&(K=lt.RGBA16_EXT),P===e.SHORT&&lt&&(K=lt.RGBA16_SNORM_EXT),P===e.UNSIGNED_SHORT_4_4_4_4&&(K=e.RGBA4),P===e.UNSIGNED_SHORT_5_5_5_1&&(K=e.RGB5_A1)}return(K===e.R16F||K===e.R32F||K===e.RG16F||K===e.RG32F||K===e.RGBA16F||K===e.RGBA32F)&&t.get("EXT_color_buffer_float"),K}function T(w,x){let P;return w?x===null||x===Fi||x===Lo?P=e.DEPTH24_STENCIL8:x===ki?P=e.DEPTH32F_STENCIL8:x===Do&&(P=e.DEPTH24_STENCIL8,Lt("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):x===null||x===Fi||x===Lo?P=e.DEPTH_COMPONENT24:x===ki?P=e.DEPTH_COMPONENT32F:x===Do&&(P=e.DEPTH_COMPONENT16),P}function E(w,x){return p(w)===!0||w.isFramebufferTexture&&w.minFilter!==Ye&&w.minFilter!==vn?Math.log2(Math.max(x.width,x.height))+1:w.mipmaps!==void 0&&w.mipmaps.length>0?w.mipmaps.length:w.isCompressedTexture&&Array.isArray(w.image)?x.mipmaps.length:1}function C(w){let x=w.target;x.removeEventListener("dispose",C),A(x),x.isVideoTexture&&u.delete(x),x.isHTMLTexture&&f.delete(x)}function _(w){let x=w.target;x.removeEventListener("dispose",_),O(x)}function A(w){let x=i.get(w);if(x.__webglInit===void 0)return;let P=w.source,H=d.get(P);if(H){let Z=H[x.__cacheKey];Z.usedTimes--,Z.usedTimes===0&&R(w),Object.keys(H).length===0&&d.delete(P)}i.remove(w)}function R(w){let x=i.get(w);e.deleteTexture(x.__webglTexture);let P=w.source,H=d.get(P);delete H[x.__cacheKey],r.memory.textures--}function O(w){let x=i.get(w);if(w.depthTexture&&(w.depthTexture.dispose(),i.remove(w.depthTexture)),w.isWebGLCubeRenderTarget)for(let H=0;H<6;H++){if(Array.isArray(x.__webglFramebuffer[H]))for(let Z=0;Z<x.__webglFramebuffer[H].length;Z++)e.deleteFramebuffer(x.__webglFramebuffer[H][Z]);else e.deleteFramebuffer(x.__webglFramebuffer[H]);x.__webglDepthbuffer&&e.deleteRenderbuffer(x.__webglDepthbuffer[H])}else{if(Array.isArray(x.__webglFramebuffer))for(let H=0;H<x.__webglFramebuffer.length;H++)e.deleteFramebuffer(x.__webglFramebuffer[H]);else e.deleteFramebuffer(x.__webglFramebuffer);if(x.__webglDepthbuffer&&e.deleteRenderbuffer(x.__webglDepthbuffer),x.__webglMultisampledFramebuffer&&e.deleteFramebuffer(x.__webglMultisampledFramebuffer),x.__webglColorRenderbuffer)for(let H=0;H<x.__webglColorRenderbuffer.length;H++)x.__webglColorRenderbuffer[H]&&e.deleteRenderbuffer(x.__webglColorRenderbuffer[H]);x.__webglDepthRenderbuffer&&e.deleteRenderbuffer(x.__webglDepthRenderbuffer)}let P=w.textures;for(let H=0,Z=P.length;H<Z;H++){let rt=i.get(P[H]);rt.__webglTexture&&(e.deleteTexture(rt.__webglTexture),r.memory.textures--),i.remove(P[H])}i.remove(w)}let F=0;function X(){F=0}function U(){return F}function G(w){F=w}function J(){let w=F;return w>=s.maxTextures&&Lt("WebGLTextures: Trying to use "+(w+1)+" texture units while this GPU supports only "+s.maxTextures),F+=1,w}function I(w){let x=[];return x.push(w.wrapS),x.push(w.wrapT),x.push(w.wrapR||0),x.push(w.magFilter),x.push(w.minFilter),x.push(w.anisotropy),x.push(w.internalFormat),x.push(w.format),x.push(w.type),x.push(w.generateMipmaps),x.push(w.premultiplyAlpha),x.push(w.flipY),x.push(w.unpackAlignment),x.push(w.colorSpace),x.join()}function it(w,x){let P=i.get(w);if(w.isVideoTexture&&L(w),w.isRenderTargetTexture===!1&&w.isExternalTexture!==!0&&w.version>0&&P.__version!==w.version){let H=w.image;if(H===null)Lt("WebGLRenderer: Texture marked for update but no image data found.");else if(H.complete===!1)Lt("WebGLRenderer: Texture marked for update but image is incomplete");else{ot(P,w,x);return}}else w.isExternalTexture&&(P.__webglTexture=w.sourceTexture?w.sourceTexture:null);n.bindTexture(e.TEXTURE_2D,P.__webglTexture,e.TEXTURE0+x)}function q(w,x){let P=i.get(w);if(w.isRenderTargetTexture===!1&&w.version>0&&P.__version!==w.version){ot(P,w,x);return}else w.isExternalTexture&&(P.__webglTexture=w.sourceTexture?w.sourceTexture:null);n.bindTexture(e.TEXTURE_2D_ARRAY,P.__webglTexture,e.TEXTURE0+x)}function tt(w,x){let P=i.get(w);if(w.isRenderTargetTexture===!1&&w.version>0&&P.__version!==w.version){ot(P,w,x);return}n.bindTexture(e.TEXTURE_3D,P.__webglTexture,e.TEXTURE0+x)}function et(w,x){let P=i.get(w);if(w.isCubeDepthTexture!==!0&&w.version>0&&P.__version!==w.version){Rt(P,w,x);return}n.bindTexture(e.TEXTURE_CUBE_MAP,P.__webglTexture,e.TEXTURE0+x)}let St={[Lh]:e.REPEAT,[ts]:e.CLAMP_TO_EDGE,[Uh]:e.MIRRORED_REPEAT},Mt={[Ye]:e.NEAREST,[rS]:e.NEAREST_MIPMAP_NEAREST,[uc]:e.NEAREST_MIPMAP_LINEAR,[vn]:e.LINEAR,[rf]:e.LINEAR_MIPMAP_NEAREST,[Ra]:e.LINEAR_MIPMAP_LINEAR},me={[uS]:e.NEVER,[mS]:e.ALWAYS,[hS]:e.LESS,[Gf]:e.LEQUAL,[fS]:e.EQUAL,[Wf]:e.GEQUAL,[dS]:e.GREATER,[pS]:e.NOTEQUAL};function Xt(w,x){if(x.type===ki&&t.has("OES_texture_float_linear")===!1&&(x.magFilter===vn||x.magFilter===rf||x.magFilter===uc||x.magFilter===Ra||x.minFilter===vn||x.minFilter===rf||x.minFilter===uc||x.minFilter===Ra)&&Lt("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),e.texParameteri(w,e.TEXTURE_WRAP_S,St[x.wrapS]),e.texParameteri(w,e.TEXTURE_WRAP_T,St[x.wrapT]),(w===e.TEXTURE_3D||w===e.TEXTURE_2D_ARRAY)&&e.texParameteri(w,e.TEXTURE_WRAP_R,St[x.wrapR]),e.texParameteri(w,e.TEXTURE_MAG_FILTER,Mt[x.magFilter]),e.texParameteri(w,e.TEXTURE_MIN_FILTER,Mt[x.minFilter]),x.compareFunction&&(e.texParameteri(w,e.TEXTURE_COMPARE_MODE,e.COMPARE_REF_TO_TEXTURE),e.texParameteri(w,e.TEXTURE_COMPARE_FUNC,me[x.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(x.magFilter===Ye||x.minFilter!==uc&&x.minFilter!==Ra||x.type===ki&&t.has("OES_texture_float_linear")===!1)return;if(x.anisotropy>1||i.get(x).__currentAnisotropy){let P=t.get("EXT_texture_filter_anisotropic");e.texParameterf(w,P.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(x.anisotropy,s.getMaxAnisotropy())),i.get(x).__currentAnisotropy=x.anisotropy}}}function te(w,x){let P=!1;w.__webglInit===void 0&&(w.__webglInit=!0,x.addEventListener("dispose",C));let H=x.source,Z=d.get(H);Z===void 0&&(Z={},d.set(H,Z));let rt=I(x);if(rt!==w.__cacheKey){Z[rt]===void 0&&(Z[rt]={texture:e.createTexture(),usedTimes:0},r.memory.textures++,P=!0),Z[rt].usedTimes++;let lt=Z[w.__cacheKey];lt!==void 0&&(Z[w.__cacheKey].usedTimes--,lt.usedTimes===0&&R(x)),w.__cacheKey=rt,w.__webglTexture=Z[rt].texture}return P}function Y(w,x,P){return Math.floor(Math.floor(w/P)/x)}function k(w,x,P,H){let rt=w.updateRanges;if(rt.length===0)n.texSubImage2D(e.TEXTURE_2D,0,0,0,x.width,x.height,P,H,x.data);else{rt.sort((At,dt)=>At.start-dt.start);let lt=0;for(let At=1;At<rt.length;At++){let dt=rt[lt],ut=rt[At],wt=dt.start+dt.count,Dt=Y(ut.start,x.width,4),kt=Y(dt.start,x.width,4);ut.start<=wt+1&&Dt===kt&&Y(ut.start+ut.count-1,x.width,4)===Dt?dt.count=Math.max(dt.count,ut.start+ut.count-dt.start):(++lt,rt[lt]=ut)}rt.length=lt+1;let K=n.getParameter(e.UNPACK_ROW_LENGTH),j=n.getParameter(e.UNPACK_SKIP_PIXELS),ct=n.getParameter(e.UNPACK_SKIP_ROWS);n.pixelStorei(e.UNPACK_ROW_LENGTH,x.width);for(let At=0,dt=rt.length;At<dt;At++){let ut=rt[At],wt=Math.floor(ut.start/4),Dt=Math.ceil(ut.count/4),kt=wt%x.width,D=Math.floor(wt/x.width),ht=Dt,Q=1;n.pixelStorei(e.UNPACK_SKIP_PIXELS,kt),n.pixelStorei(e.UNPACK_SKIP_ROWS,D),n.texSubImage2D(e.TEXTURE_2D,0,kt,D,ht,Q,P,H,x.data)}w.clearUpdateRanges(),n.pixelStorei(e.UNPACK_ROW_LENGTH,K),n.pixelStorei(e.UNPACK_SKIP_PIXELS,j),n.pixelStorei(e.UNPACK_SKIP_ROWS,ct)}}function ot(w,x,P){let H=e.TEXTURE_2D;(x.isDataArrayTexture||x.isCompressedArrayTexture)&&(H=e.TEXTURE_2D_ARRAY),x.isData3DTexture&&(H=e.TEXTURE_3D);let Z=te(w,x),rt=x.source;n.bindTexture(H,w.__webglTexture,e.TEXTURE0+P);let lt=i.get(rt);if(rt.version!==lt.__version||Z===!0){if(n.activeTexture(e.TEXTURE0+P),(typeof ImageBitmap<"u"&&x.image instanceof ImageBitmap)===!1){let Q=Qt.getPrimaries(Qt.workingColorSpace),ft=x.colorSpace===Is?null:Qt.getPrimaries(x.colorSpace),yt=x.colorSpace===Is||Q===ft?e.NONE:e.BROWSER_DEFAULT_WEBGL;n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,x.flipY),n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,yt)}n.pixelStorei(e.UNPACK_ALIGNMENT,x.unpackAlignment);let j=g(x.image,!1,s.maxTextureSize);j=_n(x,j);let ct=a.convert(x.format,x.colorSpace),At=a.convert(x.type),dt=v(x.internalFormat,ct,At,x.normalized,x.colorSpace,x.isVideoTexture);Xt(H,x);let ut,wt=x.mipmaps,Dt=x.isVideoTexture!==!0,kt=lt.__version===void 0||Z===!0,D=rt.dataReady,ht=E(x,j);if(x.isDepthTexture)dt=T(x.format===Na,x.type),kt&&(Dt?n.texStorage2D(e.TEXTURE_2D,1,dt,j.width,j.height):n.texImage2D(e.TEXTURE_2D,0,dt,j.width,j.height,0,ct,At,null));else if(x.isDataTexture)if(wt.length>0){Dt&&kt&&n.texStorage2D(e.TEXTURE_2D,ht,dt,wt[0].width,wt[0].height);for(let Q=0,ft=wt.length;Q<ft;Q++)ut=wt[Q],Dt?D&&n.texSubImage2D(e.TEXTURE_2D,Q,0,0,ut.width,ut.height,ct,At,ut.data):n.texImage2D(e.TEXTURE_2D,Q,dt,ut.width,ut.height,0,ct,At,ut.data);x.generateMipmaps=!1}else Dt?(kt&&n.texStorage2D(e.TEXTURE_2D,ht,dt,j.width,j.height),D&&k(x,j,ct,At)):n.texImage2D(e.TEXTURE_2D,0,dt,j.width,j.height,0,ct,At,j.data);else if(x.isCompressedTexture)if(x.isCompressedArrayTexture){Dt&&kt&&n.texStorage3D(e.TEXTURE_2D_ARRAY,ht,dt,wt[0].width,wt[0].height,j.depth);for(let Q=0,ft=wt.length;Q<ft;Q++)if(ut=wt[Q],x.format!==Ai)if(ct!==null)if(Dt){if(D)if(x.layerUpdates.size>0){let yt=qg(ut.width,ut.height,x.format,x.type);for(let nt of x.layerUpdates){let Ct=ut.data.subarray(nt*yt/ut.data.BYTES_PER_ELEMENT,(nt+1)*yt/ut.data.BYTES_PER_ELEMENT);n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,Q,0,0,nt,ut.width,ut.height,1,ct,Ct)}}else n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,Q,0,0,0,ut.width,ut.height,j.depth,ct,ut.data)}else n.compressedTexImage3D(e.TEXTURE_2D_ARRAY,Q,dt,ut.width,ut.height,j.depth,0,ut.data,0,0);else Lt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Dt?D&&n.texSubImage3D(e.TEXTURE_2D_ARRAY,Q,0,0,0,ut.width,ut.height,j.depth,ct,At,ut.data):n.texImage3D(e.TEXTURE_2D_ARRAY,Q,dt,ut.width,ut.height,j.depth,0,ct,At,ut.data);x.layerUpdates.size>0&&x.clearLayerUpdates()}else{Dt&&kt&&n.texStorage2D(e.TEXTURE_2D,ht,dt,wt[0].width,wt[0].height);for(let Q=0,ft=wt.length;Q<ft;Q++)ut=wt[Q],x.format!==Ai?ct!==null?Dt?D&&n.compressedTexSubImage2D(e.TEXTURE_2D,Q,0,0,ut.width,ut.height,ct,ut.data):n.compressedTexImage2D(e.TEXTURE_2D,Q,dt,ut.width,ut.height,0,ut.data):Lt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Dt?D&&n.texSubImage2D(e.TEXTURE_2D,Q,0,0,ut.width,ut.height,ct,At,ut.data):n.texImage2D(e.TEXTURE_2D,Q,dt,ut.width,ut.height,0,ct,At,ut.data)}else if(x.isDataArrayTexture)if(Dt){if(kt&&n.texStorage3D(e.TEXTURE_2D_ARRAY,ht,dt,j.width,j.height,j.depth),D)if(x.layerUpdates.size>0){let Q=qg(j.width,j.height,x.format,x.type);for(let ft of x.layerUpdates){let yt=j.data.subarray(ft*Q/j.data.BYTES_PER_ELEMENT,(ft+1)*Q/j.data.BYTES_PER_ELEMENT);n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,ft,j.width,j.height,1,ct,At,yt)}x.clearLayerUpdates()}else n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,0,j.width,j.height,j.depth,ct,At,j.data)}else n.texImage3D(e.TEXTURE_2D_ARRAY,0,dt,j.width,j.height,j.depth,0,ct,At,j.data);else if(x.isData3DTexture)Dt?(kt&&n.texStorage3D(e.TEXTURE_3D,ht,dt,j.width,j.height,j.depth),D&&n.texSubImage3D(e.TEXTURE_3D,0,0,0,0,j.width,j.height,j.depth,ct,At,j.data)):n.texImage3D(e.TEXTURE_3D,0,dt,j.width,j.height,j.depth,0,ct,At,j.data);else if(x.isFramebufferTexture){if(kt)if(Dt)n.texStorage2D(e.TEXTURE_2D,ht,dt,j.width,j.height);else{let Q=j.width,ft=j.height;for(let yt=0;yt<ht;yt++)n.texImage2D(e.TEXTURE_2D,yt,dt,Q,ft,0,ct,At,null),Q>>=1,ft>>=1}}else if(x.isHTMLTexture){if("texElementImage2D"in e){let Q=e.canvas;if(Q.hasAttribute("layoutsubtree")||Q.setAttribute("layoutsubtree","true"),j.parentNode!==Q){Q.appendChild(j),f.add(x),Q.onpaint=ft=>{let yt=ft.changedElements;for(let nt of f)yt.includes(nt.image)&&(nt.needsUpdate=!0)},Q.requestPaint();return}if(e.texElementImage2D.length===3)e.texElementImage2D(e.TEXTURE_2D,e.RGBA8,j);else{let yt=e.RGBA,nt=e.RGBA,Ct=e.UNSIGNED_BYTE;e.texElementImage2D(e.TEXTURE_2D,0,yt,nt,Ct,j)}e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE)}}else if(wt.length>0){if(Dt&&kt){let Q=fe(wt[0]);n.texStorage2D(e.TEXTURE_2D,ht,dt,Q.width,Q.height)}for(let Q=0,ft=wt.length;Q<ft;Q++)ut=wt[Q],Dt?D&&n.texSubImage2D(e.TEXTURE_2D,Q,0,0,ct,At,ut):n.texImage2D(e.TEXTURE_2D,Q,dt,ct,At,ut);x.generateMipmaps=!1}else if(Dt){if(kt){let Q=fe(j);n.texStorage2D(e.TEXTURE_2D,ht,dt,Q.width,Q.height)}D&&n.texSubImage2D(e.TEXTURE_2D,0,0,0,ct,At,j)}else n.texImage2D(e.TEXTURE_2D,0,dt,ct,At,j);p(x)&&y(H),lt.__version=rt.version,x.onUpdate&&x.onUpdate(x)}w.__version=x.version}function Rt(w,x,P){if(x.image.length!==6)return;let H=te(w,x),Z=x.source;n.bindTexture(e.TEXTURE_CUBE_MAP,w.__webglTexture,e.TEXTURE0+P);let rt=i.get(Z);if(Z.version!==rt.__version||H===!0){n.activeTexture(e.TEXTURE0+P);let lt=Qt.getPrimaries(Qt.workingColorSpace),K=x.colorSpace===Is?null:Qt.getPrimaries(x.colorSpace),j=x.colorSpace===Is||lt===K?e.NONE:e.BROWSER_DEFAULT_WEBGL;n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,x.flipY),n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),n.pixelStorei(e.UNPACK_ALIGNMENT,x.unpackAlignment),n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,j);let ct=x.isCompressedTexture||x.image[0].isCompressedTexture,At=x.image[0]&&x.image[0].isDataTexture,dt=[];for(let nt=0;nt<6;nt++)!ct&&!At?dt[nt]=g(x.image[nt],!0,s.maxCubemapSize):dt[nt]=At?x.image[nt].image:x.image[nt],dt[nt]=_n(x,dt[nt]);let ut=dt[0],wt=a.convert(x.format,x.colorSpace),Dt=a.convert(x.type),kt=v(x.internalFormat,wt,Dt,x.normalized,x.colorSpace),D=x.isVideoTexture!==!0,ht=rt.__version===void 0||H===!0,Q=Z.dataReady,ft=E(x,ut);Xt(e.TEXTURE_CUBE_MAP,x);let yt;if(ct){D&&ht&&n.texStorage2D(e.TEXTURE_CUBE_MAP,ft,kt,ut.width,ut.height);for(let nt=0;nt<6;nt++){yt=dt[nt].mipmaps;for(let Ct=0;Ct<yt.length;Ct++){let Tt=yt[Ct];x.format!==Ai?wt!==null?D?Q&&n.compressedTexSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+nt,Ct,0,0,Tt.width,Tt.height,wt,Tt.data):n.compressedTexImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+nt,Ct,kt,Tt.width,Tt.height,0,Tt.data):Lt("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):D?Q&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+nt,Ct,0,0,Tt.width,Tt.height,wt,Dt,Tt.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+nt,Ct,kt,Tt.width,Tt.height,0,wt,Dt,Tt.data)}}}else{if(yt=x.mipmaps,D&&ht){yt.length>0&&ft++;let nt=fe(dt[0]);n.texStorage2D(e.TEXTURE_CUBE_MAP,ft,kt,nt.width,nt.height)}for(let nt=0;nt<6;nt++)if(At){D?Q&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+nt,0,0,0,dt[nt].width,dt[nt].height,wt,Dt,dt[nt].data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+nt,0,kt,dt[nt].width,dt[nt].height,0,wt,Dt,dt[nt].data);for(let Ct=0;Ct<yt.length;Ct++){let Se=yt[Ct].image[nt].image;D?Q&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+nt,Ct+1,0,0,Se.width,Se.height,wt,Dt,Se.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+nt,Ct+1,kt,Se.width,Se.height,0,wt,Dt,Se.data)}}else{D?Q&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+nt,0,0,0,wt,Dt,dt[nt]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+nt,0,kt,wt,Dt,dt[nt]);for(let Ct=0;Ct<yt.length;Ct++){let Tt=yt[Ct];D?Q&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+nt,Ct+1,0,0,wt,Dt,Tt.image[nt]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+nt,Ct+1,kt,wt,Dt,Tt.image[nt])}}}p(x)&&y(e.TEXTURE_CUBE_MAP),rt.__version=Z.version,x.onUpdate&&x.onUpdate(x)}w.__version=x.version}function st(w,x,P,H,Z,rt){let lt=a.convert(P.format,P.colorSpace),K=a.convert(P.type),j=v(P.internalFormat,lt,K,P.normalized,P.colorSpace),ct=i.get(x),At=i.get(P);if(At.__renderTarget=x,!ct.__hasExternalTextures){let dt=Math.max(1,x.width>>rt),ut=Math.max(1,x.height>>rt);Z===e.TEXTURE_3D||Z===e.TEXTURE_2D_ARRAY?n.texImage3D(Z,rt,j,dt,ut,x.depth,0,lt,K,null):n.texImage2D(Z,rt,j,dt,ut,0,lt,K,null)}n.bindFramebuffer(e.FRAMEBUFFER,w),Ze(x)?o.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,H,Z,At.__webglTexture,0,Be(x)):(Z===e.TEXTURE_2D||Z>=e.TEXTURE_CUBE_MAP_POSITIVE_X&&Z<=e.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&e.framebufferTexture2D(e.FRAMEBUFFER,H,Z,At.__webglTexture,rt),n.bindFramebuffer(e.FRAMEBUFFER,null)}function Pt(w,x,P){if(e.bindRenderbuffer(e.RENDERBUFFER,w),x.depthBuffer){let H=x.depthTexture,Z=H&&H.isDepthTexture?H.type:null,rt=T(x.stencilBuffer,Z),lt=x.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;Ze(x)?o.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,Be(x),rt,x.width,x.height):P?e.renderbufferStorageMultisample(e.RENDERBUFFER,Be(x),rt,x.width,x.height):e.renderbufferStorage(e.RENDERBUFFER,rt,x.width,x.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,lt,e.RENDERBUFFER,w)}else{let H=x.textures;for(let Z=0;Z<H.length;Z++){let rt=H[Z],lt=a.convert(rt.format,rt.colorSpace),K=a.convert(rt.type),j=v(rt.internalFormat,lt,K,rt.normalized,rt.colorSpace);Ze(x)?o.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,Be(x),j,x.width,x.height):P?e.renderbufferStorageMultisample(e.RENDERBUFFER,Be(x),j,x.width,x.height):e.renderbufferStorage(e.RENDERBUFFER,j,x.width,x.height)}}e.bindRenderbuffer(e.RENDERBUFFER,null)}function re(w,x,P){let H=x.isWebGLCubeRenderTarget===!0;if(n.bindFramebuffer(e.FRAMEBUFFER,w),!(x.depthTexture&&x.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");let Z=i.get(x.depthTexture);if(Z.__renderTarget=x,(!Z.__webglTexture||x.depthTexture.image.width!==x.width||x.depthTexture.image.height!==x.height)&&(x.depthTexture.image.width=x.width,x.depthTexture.image.height=x.height,x.depthTexture.needsUpdate=!0),H){if(Z.__webglInit===void 0&&(Z.__webglInit=!0,x.depthTexture.addEventListener("dispose",C)),Z.__webglTexture===void 0){Z.__webglTexture=e.createTexture(),n.bindTexture(e.TEXTURE_CUBE_MAP,Z.__webglTexture),Xt(e.TEXTURE_CUBE_MAP,x.depthTexture);let ct=a.convert(x.depthTexture.format),At=a.convert(x.depthTexture.type),dt;x.depthTexture.format===es?dt=e.DEPTH_COMPONENT24:x.depthTexture.format===Na&&(dt=e.DEPTH24_STENCIL8);for(let ut=0;ut<6;ut++)e.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+ut,0,dt,x.width,x.height,0,ct,At,null)}}else it(x.depthTexture,0);let rt=Z.__webglTexture,lt=Be(x),K=H?e.TEXTURE_CUBE_MAP_POSITIVE_X+P:e.TEXTURE_2D,j=x.depthTexture.format===Na?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;if(x.depthTexture.format===es)Ze(x)?o.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,j,K,rt,0,lt):e.framebufferTexture2D(e.FRAMEBUFFER,j,K,rt,0);else if(x.depthTexture.format===Na)Ze(x)?o.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,j,K,rt,0,lt):e.framebufferTexture2D(e.FRAMEBUFFER,j,K,rt,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function Ft(w){let x=i.get(w),P=w.isWebGLCubeRenderTarget===!0;if(x.__boundDepthTexture!==w.depthTexture){let H=w.depthTexture;if(x.__depthDisposeCallback&&x.__depthDisposeCallback(),H){let Z=()=>{delete x.__boundDepthTexture,delete x.__depthDisposeCallback,H.removeEventListener("dispose",Z)};H.addEventListener("dispose",Z),x.__depthDisposeCallback=Z}x.__boundDepthTexture=H}if(w.depthTexture&&!x.__autoAllocateDepthBuffer)if(P)for(let H=0;H<6;H++)re(x.__webglFramebuffer[H],w,H);else{let H=w.texture.mipmaps;H&&H.length>0?re(x.__webglFramebuffer[0],w,0):re(x.__webglFramebuffer,w,0)}else if(P){x.__webglDepthbuffer=[];for(let H=0;H<6;H++)if(n.bindFramebuffer(e.FRAMEBUFFER,x.__webglFramebuffer[H]),x.__webglDepthbuffer[H]===void 0)x.__webglDepthbuffer[H]=e.createRenderbuffer(),Pt(x.__webglDepthbuffer[H],w,!1);else{let Z=w.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,rt=x.__webglDepthbuffer[H];e.bindRenderbuffer(e.RENDERBUFFER,rt),e.framebufferRenderbuffer(e.FRAMEBUFFER,Z,e.RENDERBUFFER,rt)}}else{let H=w.texture.mipmaps;if(H&&H.length>0?n.bindFramebuffer(e.FRAMEBUFFER,x.__webglFramebuffer[0]):n.bindFramebuffer(e.FRAMEBUFFER,x.__webglFramebuffer),x.__webglDepthbuffer===void 0)x.__webglDepthbuffer=e.createRenderbuffer(),Pt(x.__webglDepthbuffer,w,!1);else{let Z=w.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,rt=x.__webglDepthbuffer;e.bindRenderbuffer(e.RENDERBUFFER,rt),e.framebufferRenderbuffer(e.FRAMEBUFFER,Z,e.RENDERBUFFER,rt)}}n.bindFramebuffer(e.FRAMEBUFFER,null)}function ae(w,x,P){let H=i.get(w);x!==void 0&&st(H.__webglFramebuffer,w,w.texture,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,0),P!==void 0&&Ft(w)}function be(w){let x=w.texture,P=i.get(w),H=i.get(x);w.addEventListener("dispose",_);let Z=w.textures,rt=w.isWebGLCubeRenderTarget===!0,lt=Z.length>1;if(lt||(H.__webglTexture===void 0&&(H.__webglTexture=e.createTexture()),H.__version=x.version,r.memory.textures++),rt){P.__webglFramebuffer=[];for(let K=0;K<6;K++)if(x.mipmaps&&x.mipmaps.length>0){P.__webglFramebuffer[K]=[];for(let j=0;j<x.mipmaps.length;j++)P.__webglFramebuffer[K][j]=e.createFramebuffer()}else P.__webglFramebuffer[K]=e.createFramebuffer()}else{if(x.mipmaps&&x.mipmaps.length>0){P.__webglFramebuffer=[];for(let K=0;K<x.mipmaps.length;K++)P.__webglFramebuffer[K]=e.createFramebuffer()}else P.__webglFramebuffer=e.createFramebuffer();if(lt)for(let K=0,j=Z.length;K<j;K++){let ct=i.get(Z[K]);ct.__webglTexture===void 0&&(ct.__webglTexture=e.createTexture(),r.memory.textures++)}if(w.samples>0&&Ze(w)===!1){P.__webglMultisampledFramebuffer=e.createFramebuffer(),P.__webglColorRenderbuffer=[],n.bindFramebuffer(e.FRAMEBUFFER,P.__webglMultisampledFramebuffer);for(let K=0;K<Z.length;K++){let j=Z[K];P.__webglColorRenderbuffer[K]=e.createRenderbuffer(),e.bindRenderbuffer(e.RENDERBUFFER,P.__webglColorRenderbuffer[K]);let ct=a.convert(j.format,j.colorSpace),At=a.convert(j.type),dt=v(j.internalFormat,ct,At,j.normalized,j.colorSpace,w.isXRRenderTarget===!0),ut=Be(w);e.renderbufferStorageMultisample(e.RENDERBUFFER,ut,dt,w.width,w.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+K,e.RENDERBUFFER,P.__webglColorRenderbuffer[K])}e.bindRenderbuffer(e.RENDERBUFFER,null),w.depthBuffer&&(P.__webglDepthRenderbuffer=e.createRenderbuffer(),Pt(P.__webglDepthRenderbuffer,w,!0)),n.bindFramebuffer(e.FRAMEBUFFER,null)}}if(rt){n.bindTexture(e.TEXTURE_CUBE_MAP,H.__webglTexture),Xt(e.TEXTURE_CUBE_MAP,x);for(let K=0;K<6;K++)if(x.mipmaps&&x.mipmaps.length>0)for(let j=0;j<x.mipmaps.length;j++)st(P.__webglFramebuffer[K][j],w,x,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+K,j);else st(P.__webglFramebuffer[K],w,x,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+K,0);p(x)&&y(e.TEXTURE_CUBE_MAP),n.unbindTexture()}else if(lt){for(let K=0,j=Z.length;K<j;K++){let ct=Z[K],At=i.get(ct),dt=e.TEXTURE_2D;(w.isWebGL3DRenderTarget||w.isWebGLArrayRenderTarget)&&(dt=w.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(dt,At.__webglTexture),Xt(dt,ct),st(P.__webglFramebuffer,w,ct,e.COLOR_ATTACHMENT0+K,dt,0),p(ct)&&y(dt)}n.unbindTexture()}else{let K=e.TEXTURE_2D;if((w.isWebGL3DRenderTarget||w.isWebGLArrayRenderTarget)&&(K=w.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(K,H.__webglTexture),Xt(K,x),x.mipmaps&&x.mipmaps.length>0)for(let j=0;j<x.mipmaps.length;j++)st(P.__webglFramebuffer[j],w,x,e.COLOR_ATTACHMENT0,K,j);else st(P.__webglFramebuffer,w,x,e.COLOR_ATTACHMENT0,K,0);p(x)&&y(K),n.unbindTexture()}w.depthBuffer&&Ft(w)}function Kt(w){let x=w.textures;for(let P=0,H=x.length;P<H;P++){let Z=x[P];if(p(Z)){let rt=S(w),lt=i.get(Z).__webglTexture;n.bindTexture(rt,lt),y(rt),n.unbindTexture()}}}let Ue=[],ln=[];function In(w){if(w.samples>0){if(Ze(w)===!1){let x=w.textures,P=w.width,H=w.height,Z=e.COLOR_BUFFER_BIT,rt=w.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,lt=i.get(w),K=x.length>1;if(K)for(let ct=0;ct<x.length;ct++)n.bindFramebuffer(e.FRAMEBUFFER,lt.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+ct,e.RENDERBUFFER,null),n.bindFramebuffer(e.FRAMEBUFFER,lt.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+ct,e.TEXTURE_2D,null,0);n.bindFramebuffer(e.READ_FRAMEBUFFER,lt.__webglMultisampledFramebuffer);let j=w.texture.mipmaps;j&&j.length>0?n.bindFramebuffer(e.DRAW_FRAMEBUFFER,lt.__webglFramebuffer[0]):n.bindFramebuffer(e.DRAW_FRAMEBUFFER,lt.__webglFramebuffer);for(let ct=0;ct<x.length;ct++){if(w.resolveDepthBuffer&&(w.depthBuffer&&(Z|=e.DEPTH_BUFFER_BIT),w.stencilBuffer&&w.resolveStencilBuffer&&(Z|=e.STENCIL_BUFFER_BIT)),K){e.framebufferRenderbuffer(e.READ_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.RENDERBUFFER,lt.__webglColorRenderbuffer[ct]);let At=i.get(x[ct]).__webglTexture;e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,At,0)}e.blitFramebuffer(0,0,P,H,0,0,P,H,Z,e.NEAREST),l===!0&&(Ue.length=0,ln.length=0,Ue.push(e.COLOR_ATTACHMENT0+ct),w.depthBuffer&&w.storeMultisampledDepthBuffer===!1&&(Ue.push(rt),ln.push(rt),e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,ln)),e.invalidateFramebuffer(e.READ_FRAMEBUFFER,Ue))}if(n.bindFramebuffer(e.READ_FRAMEBUFFER,null),n.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),K)for(let ct=0;ct<x.length;ct++){n.bindFramebuffer(e.FRAMEBUFFER,lt.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+ct,e.RENDERBUFFER,lt.__webglColorRenderbuffer[ct]);let At=i.get(x[ct]).__webglTexture;n.bindFramebuffer(e.FRAMEBUFFER,lt.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+ct,e.TEXTURE_2D,At,0)}n.bindFramebuffer(e.DRAW_FRAMEBUFFER,lt.__webglMultisampledFramebuffer)}else if(w.depthBuffer&&w.storeMultisampledDepthBuffer===!1&&l){let x=w.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,[x])}}}function Be(w){return Math.min(s.maxSamples,w.samples)}function Ze(w){let x=i.get(w);return w.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&x.__useRenderToTexture!==!1}function L(w){let x=r.render.frame;u.get(w)!==x&&(u.set(w,x),w.update())}function _n(w,x){let P=w.colorSpace,H=w.format,Z=w.type;return w.isCompressedTexture===!0||w.isVideoTexture===!0||P!==Yl&&P!==Is&&(Qt.getTransfer(P)===he?(H!==Ai||Z!==oi)&&Lt("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):It("WebGLTextures: Unsupported texture color space:",P)),x}function fe(w){return typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement?(c.width=w.naturalWidth||w.width,c.height=w.naturalHeight||w.height):typeof VideoFrame<"u"&&w instanceof VideoFrame?(c.width=w.displayWidth,c.height=w.displayHeight):(c.width=w.width,c.height=w.height),c}this.allocateTextureUnit=J,this.resetTextureUnits=X,this.getTextureUnits=U,this.setTextureUnits=G,this.setTexture2D=it,this.setTexture2DArray=q,this.setTexture3D=tt,this.setTextureCube=et,this.rebindTextures=ae,this.setupRenderTarget=be,this.updateRenderTargetMipmap=Kt,this.updateMultisampleRenderTarget=In,this.setupDepthRenderbuffer=Ft,this.setupFrameBufferTexture=st,this.useMultisampledRTT=Ze,this.isReversedDepthBuffer=function(){return n.buffers.depth.getReversed()}}function PR(e,t){function n(i,s=Is){let a,r=Qt.getTransfer(s);if(i===oi)return e.UNSIGNED_BYTE;if(i===lf)return e.UNSIGNED_SHORT_4_4_4_4;if(i===cf)return e.UNSIGNED_SHORT_5_5_5_1;if(i===Ig)return e.UNSIGNED_INT_5_9_9_9_REV;if(i===Pg)return e.UNSIGNED_INT_10F_11F_11F_REV;if(i===Ug)return e.BYTE;if(i===Og)return e.SHORT;if(i===Do)return e.UNSIGNED_SHORT;if(i===of)return e.INT;if(i===Fi)return e.UNSIGNED_INT;if(i===ki)return e.FLOAT;if(i===Hi)return e.HALF_FLOAT;if(i===Bg)return e.ALPHA;if(i===zg)return e.RGB;if(i===Ai)return e.RGBA;if(i===es)return e.DEPTH_COMPONENT;if(i===Na)return e.DEPTH_STENCIL;if(i===Fg)return e.RED;if(i===uf)return e.RED_INTEGER;if(i===Da)return e.RG;if(i===hf)return e.RG_INTEGER;if(i===ff)return e.RGBA_INTEGER;if(i===hc||i===fc||i===dc||i===pc)if(r===he)if(a=t.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(i===hc)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===fc)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===dc)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===pc)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=t.get("WEBGL_compressed_texture_s3tc"),a!==null){if(i===hc)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===fc)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===dc)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===pc)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===df||i===pf||i===mf||i===gf)if(a=t.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(i===df)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===pf)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===mf)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===gf)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===yf||i===xf||i===vf||i===_f||i===bf||i===mc||i===Sf)if(a=t.get("WEBGL_compressed_texture_etc"),a!==null){if(i===yf||i===xf)return r===he?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(i===vf)return r===he?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC;if(i===_f)return a.COMPRESSED_R11_EAC;if(i===bf)return a.COMPRESSED_SIGNED_R11_EAC;if(i===mc)return a.COMPRESSED_RG11_EAC;if(i===Sf)return a.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===Mf||i===Tf||i===Ef||i===Af||i===wf||i===Cf||i===Rf||i===Nf||i===Df||i===Lf||i===Uf||i===Of||i===If||i===Pf)if(a=t.get("WEBGL_compressed_texture_astc"),a!==null){if(i===Mf)return r===he?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Tf)return r===he?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Ef)return r===he?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Af)return r===he?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===wf)return r===he?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Cf)return r===he?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Rf)return r===he?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Nf)return r===he?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Df)return r===he?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Lf)return r===he?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Uf)return r===he?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Of)return r===he?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===If)return r===he?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Pf)return r===he?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Bf||i===zf||i===Ff)if(a=t.get("EXT_texture_compression_bptc"),a!==null){if(i===Bf)return r===he?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===zf)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Ff)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===kf||i===Hf||i===gc||i===Vf)if(a=t.get("EXT_texture_compression_rgtc"),a!==null){if(i===kf)return a.COMPRESSED_RED_RGTC1_EXT;if(i===Hf)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===gc)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Vf)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Lo?e.UNSIGNED_INT_24_8:e[i]!==void 0?e[i]:null}return{convert:n}}var BR=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,zR=`
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

}`,r0=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,n){if(this.texture===null){let i=new sc(t.texture);(t.depthNear!==n.depthNear||t.depthFar!==n.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=i}}getMesh(t){if(this.texture!==null&&this.mesh===null){let n=t.cameras[0].viewport,i=new ai({vertexShader:BR,fragmentShader:zR,uniforms:{depthColor:{value:this.texture},depthWidth:{value:n.z},depthHeight:{value:n.w}}});this.mesh=new an(new Ma(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},o0=class extends ns{constructor(t,n){super();let i=this,s=null,a=1,r=null,o="local-floor",l=1,c=null,u=null,f=null,h=null,d=null,m=null,b=typeof XRWebGLBinding<"u",g=new r0,p={},y=n.getContextAttributes(),S=null,v=null,T=[],E=[],C=new ie,_=null,A=null,R=new Wn;R.viewport=new ze;let O=new Wn;O.viewport=new ze;let F=[R,O],X=new nf,U=null,G=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Y){let k=T[Y];return k===void 0&&(k=new Ao,T[Y]=k),k.getTargetRaySpace()},this.getControllerGrip=function(Y){let k=T[Y];return k===void 0&&(k=new Ao,T[Y]=k),k.getGripSpace()},this.getHand=function(Y){let k=T[Y];return k===void 0&&(k=new Ao,T[Y]=k),k.getHandSpace()};function J(Y){let k=E.indexOf(Y.inputSource);if(k===-1)return;let ot=T[k];ot!==void 0&&(ot.update(Y.inputSource,Y.frame,c||r),ot.dispatchEvent({type:Y.type,data:Y.inputSource}))}function I(){s.removeEventListener("select",J),s.removeEventListener("selectstart",J),s.removeEventListener("selectend",J),s.removeEventListener("squeeze",J),s.removeEventListener("squeezestart",J),s.removeEventListener("squeezeend",J),s.removeEventListener("end",I),s.removeEventListener("inputsourceschange",it);for(let Y=0;Y<T.length;Y++){let k=E[Y];k!==null&&(E[Y]=null,T[Y].disconnect(k))}U=null,G=null,g.reset();for(let Y in p)delete p[Y];if(t.setRenderTarget(S),d=null,h=null,f=null,s=null,v=null,te.stop(),i.isPresenting=!1,t.setPixelRatio(_),t.setSize(C.width,C.height,!1),A!==null){let Y=A.camera;Y.fov=A.fov,Y.zoom=A.zoom,Y.updateProjectionMatrix(),A=null}i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Y){a=Y,i.isPresenting===!0&&Lt("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Y){o=Y,i.isPresenting===!0&&Lt("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||r},this.setReferenceSpace=function(Y){c=Y},this.getBaseLayer=function(){return h!==null?h:d},this.getBinding=function(){return f===null&&b&&(f=new XRWebGLBinding(s,n)),f},this.getFrame=function(){return m},this.getSession=function(){return s},this.setSession=async function(Y){if(s=Y,s!==null){if(S=t.getRenderTarget(),s.addEventListener("select",J),s.addEventListener("selectstart",J),s.addEventListener("selectend",J),s.addEventListener("squeeze",J),s.addEventListener("squeezestart",J),s.addEventListener("squeezeend",J),s.addEventListener("end",I),s.addEventListener("inputsourceschange",it),y.xrCompatible!==!0&&await n.makeXRCompatible(),_=t.getPixelRatio(),t.getSize(C),b&&"createProjectionLayer"in XRWebGLBinding.prototype){let ot=null,Rt=null,st=null;y.depth&&(st=y.stencil?n.DEPTH24_STENCIL8:n.DEPTH_COMPONENT24,ot=y.stencil?Na:es,Rt=y.stencil?Lo:Fi);let Pt={colorFormat:n.RGBA8,depthFormat:st,scaleFactor:a};f=this.getBinding(),h=f.createProjectionLayer(Pt),s.updateRenderState({layers:[h]}),t.setPixelRatio(1),t.setSize(h.textureWidth,h.textureHeight,!1),v=new Xn(h.textureWidth,h.textureHeight,{format:Ai,type:oi,depthTexture:new Sa(h.textureWidth,h.textureHeight,Rt,void 0,void 0,void 0,void 0,void 0,void 0,ot),stencilBuffer:y.stencil,colorSpace:t.outputColorSpace,samples:y.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1,resolveStencilBuffer:h.ignoreDepthValues===!1,storeMultisampledDepthBuffer:h.ignoreDepthValues===!1,storeMultisampledStencilBuffer:h.ignoreDepthValues===!1})}else{let ot={antialias:y.antialias,alpha:!0,depth:y.depth,stencil:y.stencil,framebufferScaleFactor:a};d=new XRWebGLLayer(s,n,ot),s.updateRenderState({baseLayer:d}),t.setPixelRatio(1),t.setSize(d.framebufferWidth,d.framebufferHeight,!1),v=new Xn(d.framebufferWidth,d.framebufferHeight,{format:Ai,type:oi,colorSpace:t.outputColorSpace,stencilBuffer:y.stencil,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}v.isXRRenderTarget=!0,this.setFoveation(l),c=null,r=await s.requestReferenceSpace(o),te.setContext(s),te.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function it(Y){for(let k=0;k<Y.removed.length;k++){let ot=Y.removed[k],Rt=E.indexOf(ot);Rt>=0&&(E[Rt]=null,T[Rt].disconnect(ot))}for(let k=0;k<Y.added.length;k++){let ot=Y.added[k],Rt=E.indexOf(ot);if(Rt===-1){for(let Pt=0;Pt<T.length;Pt++)if(Pt>=E.length){E.push(ot),Rt=Pt;break}else if(E[Pt]===null){E[Pt]=ot,Rt=Pt;break}if(Rt===-1)break}let st=T[Rt];st&&st.connect(ot)}}let q=new V,tt=new V;function et(Y,k,ot){q.setFromMatrixPosition(k.matrixWorld),tt.setFromMatrixPosition(ot.matrixWorld);let Rt=q.distanceTo(tt),st=k.projectionMatrix.elements,Pt=ot.projectionMatrix.elements,re=st[14]/(st[10]-1),Ft=st[14]/(st[10]+1),ae=(st[9]+1)/st[5],be=(st[9]-1)/st[5],Kt=(st[8]-1)/st[0],Ue=(Pt[8]+1)/Pt[0],ln=re*Kt,In=re*Ue,Be=Rt/(-Kt+Ue),Ze=Be*-Kt;if(k.matrixWorld.decompose(Y.position,Y.quaternion,Y.scale),Y.translateX(Ze),Y.translateZ(Be),Y.matrixWorld.compose(Y.position,Y.quaternion,Y.scale),Y.matrixWorldInverse.copy(Y.matrixWorld).invert(),st[10]===-1)Y.projectionMatrix.copy(k.projectionMatrix),Y.projectionMatrixInverse.copy(k.projectionMatrixInverse);else{let L=re+Be,_n=Ft+Be,fe=ln-Ze,w=In+(Rt-Ze),x=ae*Ft/_n*L,P=be*Ft/_n*L;Y.projectionMatrix.makePerspective(fe,w,x,P,L,_n),Y.projectionMatrixInverse.copy(Y.projectionMatrix).invert()}}function St(Y,k){k===null?Y.matrixWorld.copy(Y.matrix):Y.matrixWorld.multiplyMatrices(k.matrixWorld,Y.matrix),Y.matrixWorldInverse.copy(Y.matrixWorld).invert()}this.updateCamera=function(Y){if(s===null)return;let k=Y.near,ot=Y.far;g.texture!==null&&(g.depthNear>0&&(k=g.depthNear),g.depthFar>0&&(ot=g.depthFar)),X.near=O.near=R.near=k,X.far=O.far=R.far=ot,(U!==X.near||G!==X.far)&&(s.updateRenderState({depthNear:X.near,depthFar:X.far}),U=X.near,G=X.far),X.layers.mask=Y.layers.mask|6,R.layers.mask=X.layers.mask&-5,O.layers.mask=X.layers.mask&-3;let Rt=Y.parent,st=X.cameras;St(X,Rt);for(let Pt=0;Pt<st.length;Pt++)St(st[Pt],Rt);st.length===2?et(X,R,O):X.projectionMatrix.copy(R.projectionMatrix),A===null&&Y.isPerspectiveCamera&&(A={camera:Y,fov:Y.fov,zoom:Y.zoom}),Mt(Y,X,Rt)};function Mt(Y,k,ot){ot===null?Y.matrix.copy(k.matrixWorld):(Y.matrix.copy(ot.matrixWorld),Y.matrix.invert(),Y.matrix.multiply(k.matrixWorld)),Y.matrix.decompose(Y.position,Y.quaternion,Y.scale),Y.updateMatrixWorld(!0),Y.projectionMatrix.copy(k.projectionMatrix),Y.projectionMatrixInverse.copy(k.projectionMatrixInverse),Y.isPerspectiveCamera&&(Y.fov=Ih*2*Math.atan(1/Y.projectionMatrix.elements[5]),Y.zoom=1)}this.getCamera=function(){return X},this.getFoveation=function(){if(!(h===null&&d===null))return l},this.setFoveation=function(Y){l=Y,h!==null&&(h.fixedFoveation=Y),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=Y)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(X)},this.getCameraTexture=function(Y){return p[Y]};let me=null;function Xt(Y,k){if(u=k.getViewerPose(c||r),m=k,u!==null){let ot=u.views;d!==null&&(t.setRenderTargetFramebuffer(v,d.framebuffer),t.setRenderTarget(v));let Rt=!1;ot.length!==X.cameras.length&&(X.cameras.length=0,Rt=!0);for(let Ft=0;Ft<ot.length;Ft++){let ae=ot[Ft],be=null;if(d!==null)be=d.getViewport(ae);else{let Ue=f.getViewSubImage(h,ae);be=Ue.viewport,Ft===0&&(t.setRenderTargetTextures(v,Ue.colorTexture,Ue.depthStencilTexture),t.setRenderTarget(v))}let Kt=F[Ft];Kt===void 0&&(Kt=new Wn,Kt.layers.enable(Ft),Kt.viewport=new ze,F[Ft]=Kt),Kt.matrix.fromArray(ae.transform.matrix),Kt.matrix.decompose(Kt.position,Kt.quaternion,Kt.scale),Kt.projectionMatrix.fromArray(ae.projectionMatrix),Kt.projectionMatrixInverse.copy(Kt.projectionMatrix).invert(),Kt.viewport.set(be.x,be.y,be.width,be.height),Ft===0&&(X.matrix.copy(Kt.matrix),X.matrix.decompose(X.position,X.quaternion,X.scale)),Rt===!0&&X.cameras.push(Kt)}let st=s.enabledFeatures;if(st&&st.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&b){f=i.getBinding();let Ft=f.getDepthInformation(ot[0]);Ft&&Ft.isValid&&Ft.texture&&g.init(Ft,s.renderState)}if(st&&st.includes("camera-access")&&b){t.state.unbindTexture(),f=i.getBinding();for(let Ft=0;Ft<ot.length;Ft++){let ae=ot[Ft].camera;if(ae){let be=p[ae];be||(be=new sc,p[ae]=be);let Kt=f.getCameraImage(ae);be.sourceTexture=Kt}}}}for(let ot=0;ot<T.length;ot++){let Rt=E[ot],st=T[ot];Rt!==null&&st!==void 0&&st.update(Rt,k,c||r)}me&&me(Y,k),k.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:k}),m=null}let te=new qS;te.setAnimationLoop(Xt),this.setAnimationLoop=function(Y){me=Y},this.dispose=function(){}}},FR=new qe,jS=new Bt;jS.set(-1,0,0,0,1,0,0,0,1);function kR(e,t){function n(g,p){g.matrixAutoUpdate===!0&&g.updateMatrix(),p.value.copy(g.matrix)}function i(g,p){p.color.getRGB(g.fogColor.value,Gg(e)),p.isFog?(g.fogNear.value=p.near,g.fogFar.value=p.far):p.isFogExp2&&(g.fogDensity.value=p.density)}function s(g,p,y,S,v){p.isNodeMaterial?p.uniformsNeedUpdate=!1:p.isMeshBasicMaterial?a(g,p):p.isMeshLambertMaterial?(a(g,p),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)):p.isMeshToonMaterial?(a(g,p),f(g,p)):p.isMeshPhongMaterial?(a(g,p),u(g,p),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)):p.isMeshStandardMaterial?(a(g,p),h(g,p),p.isMeshPhysicalMaterial&&d(g,p,v)):p.isMeshMatcapMaterial?(a(g,p),m(g,p)):p.isMeshDepthMaterial?a(g,p):p.isMeshDistanceMaterial?(a(g,p),b(g,p)):p.isMeshNormalMaterial?a(g,p):p.isLineBasicMaterial?(r(g,p),p.isLineDashedMaterial&&o(g,p)):p.isPointsMaterial?l(g,p,y,S):p.isSpriteMaterial?c(g,p):p.isShadowMaterial?(g.color.value.copy(p.color),g.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function a(g,p){g.opacity.value=p.opacity,p.color&&g.diffuse.value.copy(p.color),p.emissive&&g.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(g.map.value=p.map,n(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,n(p.alphaMap,g.alphaMapTransform)),p.bumpMap&&(g.bumpMap.value=p.bumpMap,n(p.bumpMap,g.bumpMapTransform),g.bumpScale.value=p.bumpScale,p.side===Un&&(g.bumpScale.value*=-1)),p.normalMap&&(g.normalMap.value=p.normalMap,n(p.normalMap,g.normalMapTransform),g.normalScale.value.copy(p.normalScale),p.side===Un&&g.normalScale.value.negate()),p.displacementMap&&(g.displacementMap.value=p.displacementMap,n(p.displacementMap,g.displacementMapTransform),g.displacementScale.value=p.displacementScale,g.displacementBias.value=p.displacementBias),p.emissiveMap&&(g.emissiveMap.value=p.emissiveMap,n(p.emissiveMap,g.emissiveMapTransform)),p.specularMap&&(g.specularMap.value=p.specularMap,n(p.specularMap,g.specularMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest);let y=t.get(p),S=y.envMap,v=y.envMapRotation;S&&(g.envMap.value=S,g.envMapRotation.value.setFromMatrix4(FR.makeRotationFromEuler(v)).transpose(),S.isCubeTexture&&S.isRenderTargetTexture===!1&&g.envMapRotation.value.premultiply(jS),g.reflectivity.value=p.reflectivity,g.ior.value=p.ior,g.refractionRatio.value=p.refractionRatio),p.lightMap&&(g.lightMap.value=p.lightMap,g.lightMapIntensity.value=p.lightMapIntensity,n(p.lightMap,g.lightMapTransform)),p.aoMap&&(g.aoMap.value=p.aoMap,g.aoMapIntensity.value=p.aoMapIntensity,n(p.aoMap,g.aoMapTransform))}function r(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,p.map&&(g.map.value=p.map,n(p.map,g.mapTransform))}function o(g,p){g.dashSize.value=p.dashSize,g.totalSize.value=p.dashSize+p.gapSize,g.scale.value=p.scale}function l(g,p,y,S){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.size.value=p.size*y,g.scale.value=S*.5,p.map&&(g.map.value=p.map,n(p.map,g.uvTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,n(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function c(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.rotation.value=p.rotation,p.map&&(g.map.value=p.map,n(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,n(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function u(g,p){g.specular.value.copy(p.specular),g.shininess.value=Math.max(p.shininess,1e-4)}function f(g,p){p.gradientMap&&(g.gradientMap.value=p.gradientMap)}function h(g,p){g.metalness.value=p.metalness,p.metalnessMap&&(g.metalnessMap.value=p.metalnessMap,n(p.metalnessMap,g.metalnessMapTransform)),g.roughness.value=p.roughness,p.roughnessMap&&(g.roughnessMap.value=p.roughnessMap,n(p.roughnessMap,g.roughnessMapTransform)),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)}function d(g,p,y){g.ior.value=p.ior,p.sheen>0&&(g.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),g.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(g.sheenColorMap.value=p.sheenColorMap,n(p.sheenColorMap,g.sheenColorMapTransform)),p.sheenRoughnessMap&&(g.sheenRoughnessMap.value=p.sheenRoughnessMap,n(p.sheenRoughnessMap,g.sheenRoughnessMapTransform))),p.clearcoat>0&&(g.clearcoat.value=p.clearcoat,g.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(g.clearcoatMap.value=p.clearcoatMap,n(p.clearcoatMap,g.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,n(p.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(g.clearcoatNormalMap.value=p.clearcoatNormalMap,n(p.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Un&&g.clearcoatNormalScale.value.negate())),p.dispersion>0&&(g.dispersion.value=p.dispersion),p.retroreflectivity>0&&(g.retroreflectivity.value=p.retroreflectivity),p.iridescence>0&&(g.iridescence.value=p.iridescence,g.iridescenceIOR.value=p.iridescenceIOR,g.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(g.iridescenceMap.value=p.iridescenceMap,n(p.iridescenceMap,g.iridescenceMapTransform)),p.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=p.iridescenceThicknessMap,n(p.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),p.transmission>0&&(g.transmission.value=p.transmission,g.transmissionSamplerMap.value=y.texture,g.transmissionSamplerSize.value.set(y.width,y.height),p.transmissionMap&&(g.transmissionMap.value=p.transmissionMap,n(p.transmissionMap,g.transmissionMapTransform)),g.thickness.value=p.thickness,p.thicknessMap&&(g.thicknessMap.value=p.thicknessMap,n(p.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=p.attenuationDistance,g.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(g.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(g.anisotropyMap.value=p.anisotropyMap,n(p.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=p.specularIntensity,g.specularColor.value.copy(p.specularColor),p.specularColorMap&&(g.specularColorMap.value=p.specularColorMap,n(p.specularColorMap,g.specularColorMapTransform)),p.specularIntensityMap&&(g.specularIntensityMap.value=p.specularIntensityMap,n(p.specularIntensityMap,g.specularIntensityMapTransform))}function m(g,p){p.matcap&&(g.matcap.value=p.matcap)}function b(g,p){let y=t.get(p).light;g.referencePosition.value.setFromMatrixPosition(y.matrixWorld),g.nearDistance.value=y.shadow.camera.near,g.farDistance.value=y.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function HR(e,t,n,i){let s={},a={},r=[],o=e.getParameter(e.MAX_UNIFORM_BUFFER_BINDINGS);function l(v,T){let E=T.program;i.uniformBlockBinding(v,E)}function c(v,T){let E=s[v.id];E===void 0&&(g(v),E=u(v),s[v.id]=E,v.addEventListener("dispose",y));let C=T.program;i.updateUBOMapping(v,C);let _=t.render.frame;a[v.id]!==_&&(h(v),a[v.id]=_)}function u(v){let T=f();v.__bindingPointIndex=T;let E=e.createBuffer(),C=v.__size,_=v.usage;return e.bindBuffer(e.UNIFORM_BUFFER,E),e.bufferData(e.UNIFORM_BUFFER,C,_),e.bindBuffer(e.UNIFORM_BUFFER,null),e.bindBufferBase(e.UNIFORM_BUFFER,T,E),E}function f(){for(let v=0;v<o;v++)if(r.indexOf(v)===-1)return r.push(v),v;return It("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function h(v){let T=s[v.id],E=v.uniforms,C=v.__cache;e.bindBuffer(e.UNIFORM_BUFFER,T);for(let _=0,A=E.length;_<A;_++){let R=E[_];if(Array.isArray(R))for(let O=0,F=R.length;O<F;O++)d(R[O],_,O,C);else d(R,_,0,C)}e.bindBuffer(e.UNIFORM_BUFFER,null)}function d(v,T,E,C){if(b(v,T,E,C)===!0){let _=v.__offset,A=v.value;if(Array.isArray(A)){let R=0;for(let O=0;O<A.length;O++){let F=A[O],X=p(F);m(F,v.__data,R),typeof F!="number"&&typeof F!="boolean"&&!F.isMatrix3&&!ArrayBuffer.isView(F)&&(R+=X.storage/Float32Array.BYTES_PER_ELEMENT)}}else m(A,v.__data,0);e.bufferSubData(e.UNIFORM_BUFFER,_,v.__data)}}function m(v,T,E){typeof v=="number"||typeof v=="boolean"?T[0]=v:v.isMatrix3?(T[0]=v.elements[0],T[1]=v.elements[1],T[2]=v.elements[2],T[3]=0,T[4]=v.elements[3],T[5]=v.elements[4],T[6]=v.elements[5],T[7]=0,T[8]=v.elements[6],T[9]=v.elements[7],T[10]=v.elements[8],T[11]=0):ArrayBuffer.isView(v)?T.set(new v.constructor(v.buffer,v.byteOffset,T.length)):v.toArray(T,E)}function b(v,T,E,C){let _=v.value,A=T+"_"+E;if(C[A]===void 0)return typeof _=="number"||typeof _=="boolean"?C[A]=_:ArrayBuffer.isView(_)?C[A]=_.slice():C[A]=_.clone(),!0;{let R=C[A];if(typeof _=="number"||typeof _=="boolean"){if(R!==_)return C[A]=_,!0}else{if(ArrayBuffer.isView(_))return!0;if(R.equals(_)===!1)return R.copy(_),!0}}return!1}function g(v){let T=v.uniforms,E=0,C=16;for(let A=0,R=T.length;A<R;A++){let O=Array.isArray(T[A])?T[A]:[T[A]];for(let F=0,X=O.length;F<X;F++){let U=O[F],G=Array.isArray(U.value)?U.value:[U.value];for(let J=0,I=G.length;J<I;J++){let it=G[J],q=p(it),tt=E%C,et=tt%q.boundary,St=tt+et;E+=et,St!==0&&C-St<q.storage&&(E+=C-St),U.__data=new Float32Array(q.storage/Float32Array.BYTES_PER_ELEMENT),U.__offset=E,E+=q.storage}}}let _=E%C;return _>0&&(E+=C-_),v.__size=E,v.__cache={},this}function p(v){let T={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(T.boundary=4,T.storage=4):v.isVector2?(T.boundary=8,T.storage=8):v.isVector3||v.isColor?(T.boundary=16,T.storage=12):v.isVector4?(T.boundary=16,T.storage=16):v.isMatrix3?(T.boundary=48,T.storage=48):v.isMatrix4?(T.boundary=64,T.storage=64):v.isTexture?Lt("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(v)?(T.boundary=16,T.storage=v.byteLength):Lt("WebGLRenderer: Unsupported uniform value type.",v),T}function y(v){let T=v.target;T.removeEventListener("dispose",y);let E=r.indexOf(T.__bindingPointIndex);r.splice(E,1),e.deleteBuffer(s[T.id]),delete s[T.id],delete a[T.id]}function S(){for(let v in s)e.deleteBuffer(s[v]);r=[],s={},a={}}return{bind:l,update:c,dispose:S}}var VR=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),as=null;function GR(){return as===null&&(as=new kh(VR,16,16,Da,Hi),as.name="DFG_LUT",as.minFilter=vn,as.magFilter=vn,as.wrapS=ts,as.wrapT=ts,as.generateMipmaps=!1,as.needsUpdate=!0),as}var Kf=class{constructor(t={}){let{canvas:n=yS(),context:i=null,depth:s=!0,stencil:a=!1,alpha:r=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:f=!1,reversedDepthBuffer:h=!1,outputBufferType:d=oi}=t;this.isWebGLRenderer=!0;let m;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");m=i.getContextAttributes().alpha}else m=r;let b=d,g=new Set([ff,hf,uf]),p=new Set([oi,Fi,Do,Lo,lf,cf]),y=new Uint32Array(4),S=new Int32Array(4),v=new V,T=null,E=null,C=[],_=[],A=null;this.domElement=n,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=zi,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let R=this,O=!1,F=null,X=null,U=null,G=null;this._outputColorSpace=En;let J=0,I=0,it=null,q=-1,tt=null,et=new ze,St=new ze,Mt=null,me=new se(0),Xt=0,te=n.width,Y=n.height,k=1,ot=null,Rt=null,st=new ze(0,0,te,Y),Pt=new ze(0,0,te,Y),re=!1,Ft=new nc,ae=!1,be=!1,Kt=new qe,Ue=new V,ln=new ze,In={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Be=!1;function Ze(){return it===null?k:1}let L=i;function _n(M,N){return n.getContext(M,N)}let fe,w,x,P,H,Z,rt,lt,K,j,ct,At,dt,ut,wt,Dt,kt,D,ht,Q,ft,yt,nt;try{let M={alpha:!0,depth:s,stencil:a,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:f};if("setAttribute"in n&&n.setAttribute("data-engine",`three.js r${"186"}`),n.addEventListener("webglcontextlost",Se,!1),n.addEventListener("webglcontextrestored",ce,!1),n.addEventListener("webglcontextcreationerror",wi,!1),L===null){let N="webgl2";if(L=_n(N,M),L===null)throw _n(N)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}Ct()}catch(M){throw n.removeEventListener("webglcontextlost",Se,!1),n.removeEventListener("webglcontextrestored",ce,!1),n.removeEventListener("webglcontextcreationerror",wi,!1),It("WebGLRenderer: "+M.message),M}function Ct(){fe=new JC(L),fe.init(),ft=new PR(L,fe),w=new kC(L,fe,t,ft),x=new OR(L,fe),w.reversedDepthBuffer&&h&&x.buffers.depth.setReversed(!0),X=L.createFramebuffer(),U=L.createFramebuffer(),G=L.createFramebuffer(),P=new $C(L),H=new _R,Z=new IR(L,fe,x,H,w,ft,P),rt=new KC(R),lt=new eA(L),yt=new zC(L,lt),K=new QC(L,lt,P,yt),j=new e2(L,K,lt,yt,P),D=new t2(L,w,Z),wt=new HC(H),ct=new vR(R,rt,fe,w,yt,wt),At=new kR(R,H),dt=new SR,ut=new CR(fe),kt=new BC(R,rt,x,j,m,l),Dt=new UR(R,j,w),nt=new HR(L,P,w,x),ht=new FC(L,fe,P),Q=new jC(L,fe,P),P.programs=ct.programs,R.capabilities=w,R.extensions=fe,R.properties=H,R.renderLists=dt,R.shadowMap=Dt,R.state=x,R.info=P}b!==oi&&(A=new i2(b,n.width,n.height,o,s,a));let Tt=new o0(R,L);this.xr=Tt,this.getContext=function(){return L},this.getContextAttributes=function(){return L.getContextAttributes()},this.forceContextLoss=function(){let M=fe.get("WEBGL_lose_context");M&&M.loseContext()},this.forceContextRestore=function(){let M=fe.get("WEBGL_lose_context");M&&M.restoreContext()},this.getPixelRatio=function(){return k},this.setPixelRatio=function(M){M!==void 0&&(k=M,this.setSize(te,Y,!1))},this.getSize=function(M){return M.set(te,Y)},this.setSize=function(M,N,W=!0){if(Tt.isPresenting){Lt("WebGLRenderer: Can't change size while VR device is presenting.");return}te=M,Y=N,n.width=Math.floor(M*k),n.height=Math.floor(N*k),W===!0&&(n.style.width=M+"px",n.style.height=N+"px"),A!==null&&A.setSize(n.width,n.height),this.setViewport(0,0,M,N)},this.getDrawingBufferSize=function(M){return M.set(te*k,Y*k).floor()},this.setDrawingBufferSize=function(M,N,W){te=M,Y=N,k=W,n.width=Math.floor(M*W),n.height=Math.floor(N*W),this.setViewport(0,0,M,N)},this.setEffects=function(M){if(b===oi){It("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(M){for(let N=0;N<M.length;N++)if(M[N].isOutputPass===!0){Lt("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}A.setEffects(M||[])},this.getCurrentViewport=function(M){return M.copy(et)},this.getViewport=function(M){return M.copy(st)},this.setViewport=function(M,N,W,B){M.isVector4?st.set(M.x,M.y,M.z,M.w):st.set(M,N,W,B),x.viewport(et.copy(st).multiplyScalar(k).round())},this.getScissor=function(M){return M.copy(Pt)},this.setScissor=function(M,N,W,B){M.isVector4?Pt.set(M.x,M.y,M.z,M.w):Pt.set(M,N,W,B),x.scissor(St.copy(Pt).multiplyScalar(k).round())},this.getScissorTest=function(){return re},this.setScissorTest=function(M){x.setScissorTest(re=M)},this.setOpaqueSort=function(M){ot=M},this.setTransparentSort=function(M){Rt=M},this.getClearColor=function(M){return M.copy(kt.getClearColor())},this.setClearColor=function(){kt.setClearColor(...arguments)},this.getClearAlpha=function(){return kt.getClearAlpha()},this.setClearAlpha=function(){kt.setClearAlpha(...arguments)},this.clear=function(M=!0,N=!0,W=!0){let B=0;if(M){let z=!1;if(it!==null){let gt=it.texture.format;z=g.has(gt)}if(z){let gt=it.texture.type,vt=p.has(gt),mt=kt.getClearColor(),_t=kt.getClearAlpha(),Et=mt.r,Vt=mt.g,qt=mt.b;vt?(y[0]=Et,y[1]=Vt,y[2]=qt,y[3]=_t,L.clearBufferuiv(L.COLOR,0,y)):(S[0]=Et,S[1]=Vt,S[2]=qt,S[3]=_t,L.clearBufferiv(L.COLOR,0,S))}else B|=L.COLOR_BUFFER_BIT}N&&(B|=L.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),W&&(B|=L.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),B!==0&&L.clear(B)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(M){M.setRenderer(this),F=M},this.dispose=function(){n.removeEventListener("webglcontextlost",Se,!1),n.removeEventListener("webglcontextrestored",ce,!1),n.removeEventListener("webglcontextcreationerror",wi,!1),kt.dispose(),dt.dispose(),ut.dispose(),H.dispose(),rt.dispose(),j.dispose(),yt.dispose(),nt.dispose(),ct.dispose(),Tt.dispose(),Tt.removeEventListener("sessionstart",u0),Tt.removeEventListener("sessionend",h0),La.stop()};function Se(M){M.preventDefault(),Vg("WebGLRenderer: Context Lost."),O=!0}function ce(){Vg("WebGLRenderer: Context Restored."),O=!1;let M=P.autoReset,N=Dt.enabled,W=Dt.autoUpdate,B=Dt.needsUpdate,z=Dt.type;Ct(),P.autoReset=M,Dt.enabled=N,Dt.autoUpdate=W,Dt.needsUpdate=B,Dt.type=z}function wi(M){It("WebGLRenderer: A WebGL context could not be created. Reason: ",M.statusMessage)}function Vi(M){let N=M.target;N.removeEventListener("dispose",Vi),h1(N)}function h1(M){f1(M),H.remove(M)}function f1(M){let N=H.get(M).programs;N!==void 0&&(N.forEach(function(W){ct.releaseProgram(W)}),M.isShaderMaterial&&ct.releaseShaderCache(M))}this.renderBufferDirect=function(M,N,W,B,z,gt){N===null&&(N=In);let vt=z.isMesh&&z.matrixWorld.determinantAffine()<0,mt=m1(M,N,W,B,z);x.setMaterial(B,vt);let _t=W.index,Et=1;if(B.wireframe===!0){if(_t=K.getWireframeAttribute(W),_t===void 0)return;Et=2}let Vt=W.drawRange,qt=W.attributes.position,bt=Vt.start*Et,ue=(Vt.start+Vt.count)*Et;gt!==null&&(bt=Math.max(bt,gt.start*Et),ue=Math.min(ue,(gt.start+gt.count)*Et)),_t!==null?(bt=Math.max(bt,0),ue=Math.min(ue,_t.count)):qt!=null&&(bt=Math.max(bt,0),ue=Math.min(ue,qt.count));let Ke=ue-bt;if(Ke<0||Ke===1/0)return;yt.setup(z,B,mt,W,_t);let Ee,ve=ht;if(_t!==null&&(Ee=lt.get(_t),ve=Q,ve.setIndex(Ee)),z.isMesh)B.wireframe===!0?(x.setLineWidth(B.wireframeLinewidth*Ze()),ve.setMode(L.LINES)):ve.setMode(L.TRIANGLES);else if(z.isLine){let bn=B.linewidth;bn===void 0&&(bn=1),x.setLineWidth(bn*Ze()),z.isLineSegments?ve.setMode(L.LINES):z.isLineLoop?ve.setMode(L.LINE_LOOP):ve.setMode(L.LINE_STRIP)}else z.isPoints?ve.setMode(L.POINTS):z.isSprite&&ve.setMode(L.TRIANGLES);if(z.isBatchedMesh)if(fe.get("WEBGL_multi_draw"))ve.renderMultiDraw(z._multiDrawStarts,z._multiDrawCounts,z._multiDrawCount);else{let bn=z._multiDrawStarts,xt=z._multiDrawCounts,Cn=z._multiDrawCount,ee=_t?lt.get(_t).bytesPerElement:1,li=H.get(B).currentProgram.getUniforms();for(let Gi=0;Gi<Cn;Gi++)li.setValue(L,"_gl_DrawID",Gi),ve.render(bn[Gi]/ee,xt[Gi])}else if(z.isInstancedMesh)ve.renderInstances(bt,Ke,z.count);else if(W.isInstancedBufferGeometry){let bn=W._maxInstanceCount!==void 0?W._maxInstanceCount:1/0,xt=Math.min(W.instanceCount,bn);ve.renderInstances(bt,Ke,xt)}else ve.render(bt,Ke)};function c0(M,N,W,B){F!==null&&M.isNodeMaterial&&F.setObject(B,M),ae===!0&&wt.setState(M,W,!1),M.transparent===!0&&M.side===Ei&&M.forceSinglePass===!1?(M.side=Un,M.needsUpdate=!0,Tc(M,N,B),M.side=wa,M.needsUpdate=!0,Tc(M,N,B),M.side=Ei):Tc(M,N,B)}this.compile=function(M,N,W=null){W===null&&(W=M),F!==null&&F.renderStart(M,N,W),E=ut.get(W),E.init(N),_.push(E),W.traverseVisible(function(z){z.isLight&&z.layers.test(N.layers)&&(E.pushLight(z),z.castShadow&&E.pushShadow(z))}),M!==W&&M.traverseVisible(function(z){z.isLight&&z.layers.test(N.layers)&&(E.pushLight(z),z.castShadow&&E.pushShadow(z))}),E.setupLights(),F!==null&&F.updateLights(E.state.lightsArray),be=this.localClippingEnabled,ae=wt.init(this.clippingPlanes,be),ae===!0&&wt.setGlobalState(this.clippingPlanes,N),F!==null&&Dt.render(E.state.shadowsArray,W,N);let B=new Set;return M.traverse(function(z){if(!(z.isMesh||z.isPoints||z.isLine||z.isSprite))return;let gt=z.material;if(gt)if(Array.isArray(gt))for(let vt=0;vt<gt.length;vt++){let mt=gt[vt];c0(mt,W,N,z),B.add(mt)}else c0(gt,W,N,z),B.add(gt)}),E=_.pop(),F!==null&&F.renderEnd(),B},this.compileAsync=function(M,N,W=null){let B=this.compile(M,N,W);return new Promise(z=>{function gt(){if(B.forEach(function(vt){let _t=H.get(vt).currentProgram;(_t===void 0||_t.isReady())&&B.delete(vt)}),B.size===0){z(M);return}setTimeout(gt,10)}fe.get("KHR_parallel_shader_compile")!==null?gt():setTimeout(gt,10)})};let ed=null;function d1(M){ed&&ed(M)}function u0(){La.stop()}function h0(){La.start()}let La=new qS;La.setAnimationLoop(d1),typeof self<"u"&&La.setContext(self),this.setAnimationLoop=function(M){ed=M,Tt.setAnimationLoop(M),M===null?La.stop():La.start()},Tt.addEventListener("sessionstart",u0),Tt.addEventListener("sessionend",h0),this.render=function(M,N){if(N!==void 0&&N.isCamera!==!0){It("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(O===!0)return;F!==null&&F.renderStart(M,N);let W=Tt.enabled===!0&&Tt.isPresenting===!0,B=A!==null&&(it===null||W)&&A.begin(R,it);if(M.matrixWorldAutoUpdate===!0&&M.updateMatrixWorld(),N.parent===null&&N.matrixWorldAutoUpdate===!0&&N.updateMatrixWorld(),Tt.enabled===!0&&Tt.isPresenting===!0&&(A===null||A.isCompositing()===!1)&&(Tt.cameraAutoUpdate===!0&&Tt.updateCamera(N),N=Tt.getCamera()),M.isScene===!0&&M.onBeforeRender(R,M,N,it),E=ut.get(M,_.length),E.init(N),E.state.textureUnits=Z.getTextureUnits(),_.push(E),Kt.multiplyMatrices(N.projectionMatrix,N.matrixWorldInverse),Ft.setFromProjectionMatrix(Kt,Bi,N.reversedDepth),be=this.localClippingEnabled,ae=wt.init(this.clippingPlanes,be),T=dt.get(M,C.length),T.init(),C.push(T),Tt.enabled===!0&&Tt.isPresenting===!0){let vt=R.xr.getDepthSensingMesh();vt!==null&&nd(vt,N,-1/0,R.sortObjects)}nd(M,N,0,R.sortObjects),T.finish(),F!==null&&F.updateLights(E.state.lightsArray),R.sortObjects===!0&&T.sort(ot,Rt),Be=Tt.enabled===!1||Tt.isPresenting===!1||Tt.hasDepthSensing()===!1,Be&&kt.addToRenderList(T,M),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),ae===!0&&wt.beginShadows();let z=E.state.shadowsArray;if(Dt.render(z,M,N),ae===!0&&wt.endShadows(),(B&&A.hasRenderPass())===!1){let vt=T.opaque,mt=T.transmissive;if(E.setupLights(),N.isArrayCamera){let _t=N.cameras;if(mt.length>0)for(let Et=0,Vt=_t.length;Et<Vt;Et++){let qt=_t[Et];d0(vt,mt,M,qt)}Be&&kt.render(M);for(let Et=0,Vt=_t.length;Et<Vt;Et++){let qt=_t[Et];f0(T,M,qt,qt.viewport)}}else mt.length>0&&d0(vt,mt,M,N),Be&&kt.render(M),f0(T,M,N)}it!==null&&I===0&&(Z.updateMultisampleRenderTarget(it),Z.updateRenderTargetMipmap(it)),B&&A.end(R),M.isScene===!0&&M.onAfterRender(R,M,N),yt.resetDefaultState(),q=-1,tt=null,_.pop(),_.length>0?(E=_[_.length-1],Z.setTextureUnits(E.state.textureUnits),ae===!0&&wt.setGlobalState(R.clippingPlanes,E.state.camera)):E=null,C.pop(),C.length>0?T=C[C.length-1]:T=null,F!==null&&F.renderEnd()};function nd(M,N,W,B){if(M.visible===!1)return;if(M.layers.test(N.layers)){if(M.isGroup)W=M.renderOrder;else if(M.isLOD)M.autoUpdate===!0&&M.update(N);else if(M.isLightProbeGrid)E.pushLightProbeGrid(M);else if(M.isLight)E.pushLight(M),M.castShadow&&E.pushShadow(M);else if(M.isSprite){if(!M.frustumCulled||M.intersectsFrustum(Ft)){B&&ln.setFromMatrixPosition(M.matrixWorld).applyMatrix4(Kt);let vt=j.update(M),mt=M.material;mt.visible&&T.push(M,vt,mt,W,ln.z,null,N)}}else if((M.isMesh||M.isLine||M.isPoints)&&(!M.frustumCulled||M.intersectsFrustum(Ft))){let vt=j.update(M),mt=M.material;if(B&&(M.boundingSphere!==void 0?(M.boundingSphere===null&&M.computeBoundingSphere(),ln.copy(M.boundingSphere.center)):(vt.boundingSphere===null&&vt.computeBoundingSphere(),ln.copy(vt.boundingSphere.center)),ln.applyMatrix4(M.matrixWorld).applyMatrix4(Kt)),Array.isArray(mt)){let _t=vt.groups;for(let Et=0,Vt=_t.length;Et<Vt;Et++){let qt=_t[Et],bt=mt[qt.materialIndex];bt&&bt.visible&&T.push(M,vt,bt,W,ln.z,qt,N)}}else mt.visible&&T.push(M,vt,mt,W,ln.z,null,N)}}let gt=M.children;for(let vt=0,mt=gt.length;vt<mt;vt++)nd(gt[vt],N,W,B)}function f0(M,N,W,B){let{opaque:z,transmissive:gt,transparent:vt}=M;E.setupLightsView(W),ae===!0&&wt.setGlobalState(R.clippingPlanes,W),B&&x.viewport(et.copy(B)),z.length>0&&Mc(z,N,W),gt.length>0&&Mc(gt,N,W),vt.length>0&&Mc(vt,N,W),x.buffers.depth.setTest(!0),x.buffers.depth.setMask(!0),x.buffers.color.setMask(!0),x.setPolygonOffset(!1)}function d0(M,N,W,B){if((W.isScene===!0?W.overrideMaterial:null)!==null)return;if(E.state.transmissionRenderTarget[B.id]===void 0){let bt=fe.has("EXT_color_buffer_half_float")||fe.has("EXT_color_buffer_float");E.state.transmissionRenderTarget[B.id]=new Xn(1,1,{generateMipmaps:!0,type:bt?Hi:oi,minFilter:Ra,samples:Math.max(4,w.samples),stencilBuffer:a,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:Qt.workingColorSpace})}let gt=E.state.transmissionRenderTarget[B.id],vt=B.viewport||et;gt.setSize(vt.z*R.transmissionResolutionScale,vt.w*R.transmissionResolutionScale);let mt=R.getRenderTarget(),_t=R.getActiveCubeFace(),Et=R.getActiveMipmapLevel();R.setRenderTarget(gt),R.getClearColor(me),Xt=R.getClearAlpha(),Xt<1&&R.setClearColor(16777215,.5),R.clear(),Be&&kt.render(W);let Vt=R.toneMapping;R.toneMapping=zi;let qt=B.viewport;if(B.viewport!==void 0&&(B.viewport=void 0),E.setupLightsView(B),ae===!0&&wt.setGlobalState(R.clippingPlanes,B),Mc(M,W,B),Z.updateMultisampleRenderTarget(gt),Z.updateRenderTargetMipmap(gt),fe.has("WEBGL_multisampled_render_to_texture")===!1){let bt=!1;for(let ue=0,Ke=N.length;ue<Ke;ue++){let Ee=N[ue],{object:ve,geometry:bn,material:xt,group:Cn}=Ee;if(xt.side===Ei&&ve.layers.test(B.layers)){let ee=xt.side;xt.side=Un,xt.needsUpdate=!0,p0(ve,W,B,bn,xt,Cn),xt.side=ee,xt.needsUpdate=!0,bt=!0}}bt===!0&&(Z.updateMultisampleRenderTarget(gt),Z.updateRenderTargetMipmap(gt))}R.setRenderTarget(mt,_t,Et),R.setClearColor(me,Xt),qt!==void 0&&(B.viewport=qt),R.toneMapping=Vt}function Mc(M,N,W){let B=N.isScene===!0?N.overrideMaterial:null;for(let z=0,gt=M.length;z<gt;z++){let vt=M[z],{object:mt,geometry:_t,group:Et}=vt,Vt=vt.material;Vt.allowOverride===!0&&B!==null&&(Vt=B),mt.layers.test(W.layers)&&p0(mt,N,W,_t,Vt,Et)}}function p0(M,N,W,B,z,gt){F!==null&&z.isNodeMaterial&&F.setObject(M,z),M.onBeforeRender(R,N,W,B,z,gt),M.modelViewMatrix.multiplyMatrices(W.matrixWorldInverse,M.matrixWorld),M.normalMatrix.getNormalMatrix(M.modelViewMatrix),z.onBeforeRender(R,N,W,B,M,gt),z.transparent===!0&&z.side===Ei&&z.forceSinglePass===!1?(z.side=Un,z.needsUpdate=!0,R.renderBufferDirect(W,N,B,z,M,gt),z.side=wa,z.needsUpdate=!0,R.renderBufferDirect(W,N,B,z,M,gt),z.side=Ei):R.renderBufferDirect(W,N,B,z,M,gt),M.onAfterRender(R,N,W,B,z,gt)}function Tc(M,N,W){N.isScene!==!0&&(N=In);let B=H.get(M),z=E.state.lights,gt=E.state.shadowsArray,vt=z.state.version,mt=ct.getParameters(M,z.state,gt,N,W,E.state.lightProbeGridArray),_t=ct.getProgramCacheKey(mt),Et=B.programs;B.environment=M.isMeshStandardMaterial||M.isMeshLambertMaterial||M.isMeshPhongMaterial?N.environment:null,B.fog=N.fog;let Vt=M.isMeshStandardMaterial||M.isMeshLambertMaterial&&!M.envMap||M.isMeshPhongMaterial&&!M.envMap;B.envMap=rt.get(M.envMap||B.environment,Vt),B.envMapRotation=B.environment!==null&&M.envMap===null?N.environmentRotation:M.envMapRotation,Et===void 0&&(M.addEventListener("dispose",Vi),Et=new Map,B.programs=Et);let qt=Et.get(_t);if(qt!==void 0){if(B.currentProgram===qt&&B.lightsStateVersion===vt)return g0(M,mt),qt}else mt.uniforms=ct.getUniforms(M),F!==null&&M.isNodeMaterial&&F.build(M,W,mt),M.onBeforeCompile(mt,R),qt=ct.acquireProgram(mt,_t),Et.set(_t,qt),B.uniforms=mt.uniforms;let bt=B.uniforms;return(!M.isShaderMaterial&&!M.isRawShaderMaterial||M.clipping===!0)&&(bt.clippingPlanes=wt.uniform),g0(M,mt),B.needsLights=y1(M),B.lightsStateVersion=vt,B.needsLights&&(bt.ambientLightColor.value=z.state.ambient,bt.lightProbe.value=z.state.probe,bt.sunLights.value=z.state.sun,bt.sunLightShadows.value=z.state.sunShadow,bt.directionalLights.value=z.state.directional,bt.directionalLightShadows.value=z.state.directionalShadow,bt.spotLights.value=z.state.spot,bt.spotLightShadows.value=z.state.spotShadow,bt.rectAreaLights.value=z.state.rectArea,bt.ltc_1.value=z.state.rectAreaLTC1,bt.ltc_2.value=z.state.rectAreaLTC2,bt.pointLights.value=z.state.point,bt.pointLightShadows.value=z.state.pointShadow,bt.hemisphereLights.value=z.state.hemi,bt.sunShadowMatrix.value=z.state.sunShadowMatrix,bt.sunShadowCascade.value=z.state.sunShadowCascade,bt.directionalShadowMatrix.value=z.state.directionalShadowMatrix,bt.spotLightMatrix.value=z.state.spotLightMatrix,bt.spotLightMap.value=z.state.spotLightMap,bt.pointShadowMatrix.value=z.state.pointShadowMatrix),B.lightProbeGrid=E.state.lightProbeGridArray.length>0,B.currentProgram=qt,B.uniformsList=null,qt}function m0(M){if(M.uniformsList===null){let N=M.currentProgram.getUniforms();M.uniformsList=Io.seqWithValue(N.seq,M.uniforms)}return M.uniformsList}function g0(M,N){let W=H.get(M);W.outputColorSpace=N.outputColorSpace,W.batching=N.batching,W.batchingColor=N.batchingColor,W.instancing=N.instancing,W.instancingColor=N.instancingColor,W.instancingMorph=N.instancingMorph,W.skinning=N.skinning,W.morphTargets=N.morphTargets,W.morphNormals=N.morphNormals,W.morphColors=N.morphColors,W.morphTargetsCount=N.morphTargetsCount,W.numClippingPlanes=N.numClippingPlanes,W.numIntersection=N.numClipIntersection,W.vertexAlphas=N.vertexAlphas,W.vertexTangents=N.vertexTangents,W.toneMapping=N.toneMapping}function p1(M,N){if(M.length===0)return null;if(M.length===1)return M[0].texture!==null?M[0]:null;v.setFromMatrixPosition(N.matrixWorld);for(let W=0,B=M.length;W<B;W++){let z=M[W];if(z.texture!==null&&z.boundingBox.containsPoint(v))return z}return null}function m1(M,N,W,B,z){N.isScene!==!0&&(N=In),Z.resetTextureUnits();let gt=N.fog,vt=B.isMeshStandardMaterial||B.isMeshLambertMaterial||B.isMeshPhongMaterial?N.environment:null,mt=it===null?R.outputColorSpace:it.isXRRenderTarget===!0?it.texture.colorSpace:Qt.workingColorSpace,_t=B.isMeshStandardMaterial||B.isMeshLambertMaterial&&!B.envMap||B.isMeshPhongMaterial&&!B.envMap,Et=rt.get(B.envMap||vt,_t),Vt=B.vertexColors===!0&&!!W.attributes.color&&W.attributes.color.itemSize===4,qt=!!W.attributes.tangent&&(!!B.normalMap||B.anisotropy>0),bt=!!W.morphAttributes.position,ue=!!W.morphAttributes.normal,Ke=!!W.morphAttributes.color,Ee=zi;B.toneMapped&&(it===null||it.isXRRenderTarget===!0)&&(Ee=R.toneMapping);let ve=W.morphAttributes.position||W.morphAttributes.normal||W.morphAttributes.color,bn=ve!==void 0?ve.length:0,xt=H.get(B),Cn=E.state.lights;if(ae===!0&&(be===!0||M!==tt)){let Me=M===tt&&B.id===q;wt.setState(B,M,Me)}let ee=!1;B.version===xt.__version?(xt.needsLights&&xt.lightsStateVersion!==Cn.state.version||xt.outputColorSpace!==mt||z.isBatchedMesh&&xt.batching===!1||!z.isBatchedMesh&&xt.batching===!0||z.isBatchedMesh&&xt.batchingColor===!0&&z._colorsTexture===null||z.isBatchedMesh&&xt.batchingColor===!1&&z._colorsTexture!==null||z.isInstancedMesh&&xt.instancing===!1||!z.isInstancedMesh&&xt.instancing===!0||z.isSkinnedMesh&&xt.skinning===!1||!z.isSkinnedMesh&&xt.skinning===!0||z.isInstancedMesh&&xt.instancingColor===!0&&z.instanceColor===null||z.isInstancedMesh&&xt.instancingColor===!1&&z.instanceColor!==null||z.isInstancedMesh&&xt.instancingMorph===!0&&z.morphTexture===null||z.isInstancedMesh&&xt.instancingMorph===!1&&z.morphTexture!==null||xt.envMap!==Et||B.fog===!0&&xt.fog!==gt||xt.numClippingPlanes!==void 0&&(xt.numClippingPlanes!==wt.numPlanes||xt.numIntersection!==wt.numIntersection)||xt.vertexAlphas!==Vt||xt.vertexTangents!==qt||xt.morphTargets!==bt||xt.morphNormals!==ue||xt.morphColors!==Ke||xt.toneMapping!==Ee||xt.morphTargetsCount!==bn||!!xt.lightProbeGrid!=E.state.lightProbeGridArray.length>0)&&(ee=!0):(ee=!0,xt.__version=B.version);let li=xt.currentProgram;ee===!0&&(li=Tc(B,N,z),F&&B.isNodeMaterial&&F.onUpdateProgram(B,li,xt));let Gi=!1,Ps=!1,pr=!1,ge=li.getUniforms(),Ve=xt.uniforms;if(x.useProgram(li.program)&&(Gi=!0,Ps=!0,pr=!0),B.id!==q&&(q=B.id,Ps=!0),xt.needsLights){let Me=p1(E.state.lightProbeGridArray,z);xt.lightProbeGrid!==Me&&(xt.lightProbeGrid=Me,Ps=!0)}if(Gi||tt!==M){x.buffers.depth.getReversed()&&M.reversedDepth!==!0&&(M._reversedDepth=!0,M.updateProjectionMatrix()),ge.setValue(L,"projectionMatrix",M.projectionMatrix),ge.setValue(L,"viewMatrix",M.matrixWorldInverse);let zs=ge.map.cameraPosition;zs!==void 0&&zs.setValue(L,Ue.setFromMatrixPosition(M.matrixWorld)),w.logarithmicDepthBuffer&&ge.setValue(L,"logDepthBufFC",2/(Math.log(M.far+1)/Math.LN2)),(B.isMeshPhongMaterial||B.isMeshToonMaterial||B.isMeshLambertMaterial||B.isMeshBasicMaterial||B.isMeshStandardMaterial||B.isShaderMaterial)&&ge.setValue(L,"isOrthographic",M.isOrthographicCamera===!0),tt!==M&&(tt=M,Ps=!0,pr=!0)}if(xt.needsLights&&(Cn.state.sunShadowMap.length>0&&ge.setValue(L,"sunShadowMap",Cn.state.sunShadowMap,Z),Cn.state.directionalShadowMap.length>0&&ge.setValue(L,"directionalShadowMap",Cn.state.directionalShadowMap,Z),Cn.state.spotShadowMap.length>0&&ge.setValue(L,"spotShadowMap",Cn.state.spotShadowMap,Z),Cn.state.pointShadowMap.length>0&&ge.setValue(L,"pointShadowMap",Cn.state.pointShadowMap,Z)),z.isSkinnedMesh){ge.setOptional(L,z,"bindMatrix"),ge.setOptional(L,z,"bindMatrixInverse");let Me=z.skeleton;Me&&(Me.boneTexture===null&&Me.computeBoneTexture(),ge.setValue(L,"boneTexture",Me.boneTexture,Z))}z.isBatchedMesh&&(ge.setOptional(L,z,"batchingTexture"),ge.setValue(L,"batchingTexture",z._matricesTexture,Z),ge.setOptional(L,z,"batchingIdTexture"),ge.setValue(L,"batchingIdTexture",z._indirectTexture,Z),ge.setOptional(L,z,"batchingColorTexture"),z._colorsTexture!==null&&ge.setValue(L,"batchingColorTexture",z._colorsTexture,Z));let Bs=W.morphAttributes;if((Bs.position!==void 0||Bs.normal!==void 0||Bs.color!==void 0)&&D.update(z,W,li),(Ps||xt.receiveShadow!==z.receiveShadow)&&(xt.receiveShadow=z.receiveShadow,ge.setValue(L,"receiveShadow",z.receiveShadow)),(B.isMeshStandardMaterial||B.isMeshLambertMaterial||B.isMeshPhongMaterial)&&B.envMap===null&&N.environment!==null&&(Ve.envMapIntensity.value=N.environmentIntensity),Ve.dfgLUT!==void 0&&(Ve.dfgLUT.value=GR()),Ps){if(ge.setValue(L,"toneMappingExposure",R.toneMappingExposure),xt.needsLights&&g1(Ve,pr),gt&&B.fog===!0&&At.refreshFogUniforms(Ve,gt),At.refreshMaterialUniforms(Ve,B,k,Y,E.state.transmissionRenderTarget[M.id]),xt.needsLights&&xt.lightProbeGrid){let Me=xt.lightProbeGrid;Ve.probesSH.value=Me.texture,Ve.probesMin.value.copy(Me.boundingBox.min),Ve.probesMax.value.copy(Me.boundingBox.max),Ve.probesResolution.value.copy(Me.resolution)}Io.upload(L,m0(xt),Ve,Z)}if(B.isShaderMaterial&&B.uniformsNeedUpdate===!0&&(Io.upload(L,m0(xt),Ve,Z),B.uniformsNeedUpdate=!1),B.isSpriteMaterial&&ge.setValue(L,"center",z.center),ge.setValue(L,"modelViewMatrix",z.modelViewMatrix),ge.setValue(L,"normalMatrix",z.normalMatrix),ge.setValue(L,"modelMatrix",z.matrixWorld),B.uniformsGroups!==void 0){let Me=B.uniformsGroups;for(let zs=0,mr=Me.length;zs<mr;zs++){let x0=Me[zs];nt.update(x0,li),nt.bind(x0,li)}}return li}function g1(M,N){M.ambientLightColor.needsUpdate=N,M.lightProbe.needsUpdate=N,M.sunLights.needsUpdate=N,M.sunLightShadows.needsUpdate=N,M.directionalLights.needsUpdate=N,M.directionalLightShadows.needsUpdate=N,M.pointLights.needsUpdate=N,M.pointLightShadows.needsUpdate=N,M.spotLights.needsUpdate=N,M.spotLightShadows.needsUpdate=N,M.rectAreaLights.needsUpdate=N,M.hemisphereLights.needsUpdate=N}function y1(M){return M.isMeshLambertMaterial||M.isMeshToonMaterial||M.isMeshPhongMaterial||M.isMeshStandardMaterial||M.isShadowMaterial||M.isShaderMaterial&&M.lights===!0}this.getActiveCubeFace=function(){return J},this.getActiveMipmapLevel=function(){return I},this.getRenderTarget=function(){return it},this.setRenderTargetTextures=function(M,N,W){let B=H.get(M);B.__autoAllocateDepthBuffer=M.resolveDepthBuffer===!1,B.__autoAllocateDepthBuffer===!1&&(B.__useRenderToTexture=!1),H.get(M.texture).__webglTexture=N,H.get(M.depthTexture).__webglTexture=B.__autoAllocateDepthBuffer?void 0:W,B.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(M,N){let W=H.get(M);W.__webglFramebuffer=N,W.__useDefaultFramebuffer=N===void 0},this.setRenderTarget=function(M,N=0,W=0){it=M,J=N,I=W;let B=null,z=!1,gt=!1;if(M){let mt=H.get(M);if(mt.__useDefaultFramebuffer!==void 0){x.bindFramebuffer(L.FRAMEBUFFER,mt.__webglFramebuffer),et.copy(M.viewport),St.copy(M.scissor),Mt=M.scissorTest,x.viewport(et),x.scissor(St),x.setScissorTest(Mt),q=-1;return}else if(mt.__webglFramebuffer===void 0)Z.setupRenderTarget(M);else if(mt.__hasExternalTextures)Z.rebindTextures(M,H.get(M.texture).__webglTexture,H.get(M.depthTexture).__webglTexture);else if(M.depthBuffer){let Vt=M.depthTexture;if(mt.__boundDepthTexture!==Vt){if(Vt!==null&&H.has(Vt)&&(M.width!==Vt.image.width||M.height!==Vt.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");Z.setupDepthRenderbuffer(M)}}let _t=M.texture;(_t.isData3DTexture||_t.isDataArrayTexture||_t.isCompressedArrayTexture)&&(gt=!0);let Et=H.get(M).__webglFramebuffer;M.isWebGLCubeRenderTarget?(Array.isArray(Et[N])?B=Et[N][W]:B=Et[N],z=!0):M.samples>0&&Z.useMultisampledRTT(M)===!1?B=H.get(M).__webglMultisampledFramebuffer:Array.isArray(Et)?B=Et[W]:B=Et,et.copy(M.viewport),St.copy(M.scissor),Mt=M.scissorTest}else et.copy(st).multiplyScalar(k).floor(),St.copy(Pt).multiplyScalar(k).floor(),Mt=re;if(W!==0&&(B=X),x.bindFramebuffer(L.FRAMEBUFFER,B)&&x.drawBuffers(M,B),x.viewport(et),x.scissor(St),x.setScissorTest(Mt),z){let mt=H.get(M.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_CUBE_MAP_POSITIVE_X+N,mt.__webglTexture,W)}else if(gt){let mt=N;for(let _t=0;_t<M.textures.length;_t++){let Et=H.get(M.textures[_t]);L.framebufferTextureLayer(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0+_t,Et.__webglTexture,W,mt)}}else if(M!==null&&W!==0){let mt=H.get(M.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,mt.__webglTexture,W)}q=-1};function y0(M){let N=H.get(M);return(N.__readFormat!==M.format||N.__readType!==M.type)&&(N.__readFormat=M.format,N.__readType=M.type,N.__formatReadable=w.textureFormatReadable(M.format),N.__typeReadable=w.textureTypeReadable(M.type)),N}this.readRenderTargetPixels=function(M,N,W,B,z,gt,vt,mt=0){if(!(M&&M.isWebGLRenderTarget)){It("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let _t=H.get(M).__webglFramebuffer;if(M.isWebGLCubeRenderTarget&&vt!==void 0&&(_t=_t[vt]),_t){x.bindFramebuffer(L.FRAMEBUFFER,_t);try{let Et=M.textures[mt],Vt=Et.format,qt=Et.type;M.textures.length>1&&L.readBuffer(L.COLOR_ATTACHMENT0+mt);let bt=y0(Et);if(bt.__formatReadable===!1){It("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(bt.__typeReadable===!1){It("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}N>=0&&N<=M.width-B&&W>=0&&W<=M.height-z&&L.readPixels(N,W,B,z,ft.convert(Vt),ft.convert(qt),gt)}finally{let Et=it!==null?H.get(it).__webglFramebuffer:null;x.bindFramebuffer(L.FRAMEBUFFER,Et)}}},this.readRenderTargetPixelsAsync=async function(M,N,W,B,z,gt,vt,mt=0){if(!(M&&M.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let _t=H.get(M).__webglFramebuffer;if(M.isWebGLCubeRenderTarget&&vt!==void 0&&(_t=_t[vt]),_t)if(N>=0&&N<=M.width-B&&W>=0&&W<=M.height-z){x.bindFramebuffer(L.FRAMEBUFFER,_t);let Et=M.textures[mt],Vt=Et.format,qt=Et.type;M.textures.length>1&&L.readBuffer(L.COLOR_ATTACHMENT0+mt);let bt=y0(Et);if(bt.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(bt.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let ue=L.createBuffer();L.bindBuffer(L.PIXEL_PACK_BUFFER,ue),L.bufferData(L.PIXEL_PACK_BUFFER,gt.byteLength,L.STREAM_READ),L.readPixels(N,W,B,z,ft.convert(Vt),ft.convert(qt),0),L.bindBuffer(L.PIXEL_PACK_BUFFER,null);let Ke=it!==null?H.get(it).__webglFramebuffer:null;x.bindFramebuffer(L.FRAMEBUFFER,Ke);let Ee=L.fenceSync(L.SYNC_GPU_COMMANDS_COMPLETE,0);return L.flush(),await vS(L,Ee,4),L.bindBuffer(L.PIXEL_PACK_BUFFER,ue),L.getBufferSubData(L.PIXEL_PACK_BUFFER,0,gt),L.bindBuffer(L.PIXEL_PACK_BUFFER,null),L.deleteBuffer(ue),L.deleteSync(Ee),gt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(M,N=null,W=0){let B=Math.pow(2,-W),z=Math.floor(M.image.width*B),gt=Math.floor(M.image.height*B),vt=N!==null?N.x:0,mt=N!==null?N.y:0;Z.setTexture2D(M,0),L.copyTexSubImage2D(L.TEXTURE_2D,W,0,0,vt,mt,z,gt),x.unbindTexture()},this.copyTextureToTexture=function(M,N,W=null,B=null,z=0,gt=0){let vt,mt,_t,Et,Vt,qt,bt,ue,Ke,Ee=M.isCompressedTexture?M.mipmaps[gt]:M.image;if(W!==null)vt=W.max.x-W.min.x,mt=W.max.y-W.min.y,_t=W.isBox3?W.max.z-W.min.z:1,Et=W.min.x,Vt=W.min.y,qt=W.isBox3?W.min.z:0;else{let Ve=Math.pow(2,-z);vt=Math.floor(Ee.width*Ve),mt=Math.floor(Ee.height*Ve),M.isDataArrayTexture?_t=Ee.depth:M.isData3DTexture?_t=Math.floor(Ee.depth*Ve):_t=1,Et=0,Vt=0,qt=0}B!==null?(bt=B.x,ue=B.y,Ke=B.z):(bt=0,ue=0,Ke=0);let ve=ft.convert(N.format),bn=ft.convert(N.type),xt;N.isData3DTexture?(Z.setTexture3D(N,0),xt=L.TEXTURE_3D):N.isDataArrayTexture||N.isCompressedArrayTexture?(Z.setTexture2DArray(N,0),xt=L.TEXTURE_2D_ARRAY):(Z.setTexture2D(N,0),xt=L.TEXTURE_2D),x.activeTexture(L.TEXTURE0),x.pixelStorei(L.UNPACK_FLIP_Y_WEBGL,N.flipY),x.pixelStorei(L.UNPACK_PREMULTIPLY_ALPHA_WEBGL,N.premultiplyAlpha),x.pixelStorei(L.UNPACK_ALIGNMENT,N.unpackAlignment);let Cn=x.getParameter(L.UNPACK_ROW_LENGTH),ee=x.getParameter(L.UNPACK_IMAGE_HEIGHT),li=x.getParameter(L.UNPACK_SKIP_PIXELS),Gi=x.getParameter(L.UNPACK_SKIP_ROWS),Ps=x.getParameter(L.UNPACK_SKIP_IMAGES);x.pixelStorei(L.UNPACK_ROW_LENGTH,Ee.width),x.pixelStorei(L.UNPACK_IMAGE_HEIGHT,Ee.height),x.pixelStorei(L.UNPACK_SKIP_PIXELS,Et),x.pixelStorei(L.UNPACK_SKIP_ROWS,Vt),x.pixelStorei(L.UNPACK_SKIP_IMAGES,qt);let pr=M.isDataArrayTexture||M.isData3DTexture,ge=N.isDataArrayTexture||N.isData3DTexture;if(M.isDepthTexture){let Ve=H.get(M),Bs=H.get(N),Me=H.get(Ve.__renderTarget),zs=H.get(Bs.__renderTarget);x.bindFramebuffer(L.READ_FRAMEBUFFER,Me.__webglFramebuffer),x.bindFramebuffer(L.DRAW_FRAMEBUFFER,zs.__webglFramebuffer);for(let mr=0;mr<_t;mr++)pr&&(L.framebufferTextureLayer(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,H.get(M).__webglTexture,z,qt+mr),L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,H.get(N).__webglTexture,gt,Ke+mr)),L.blitFramebuffer(Et,Vt,vt,mt,bt,ue,vt,mt,L.DEPTH_BUFFER_BIT,L.NEAREST);x.bindFramebuffer(L.READ_FRAMEBUFFER,null),x.bindFramebuffer(L.DRAW_FRAMEBUFFER,null)}else if(z!==0||M.isRenderTargetTexture||H.has(M)){let Ve=H.get(M),Bs=H.get(N);x.bindFramebuffer(L.READ_FRAMEBUFFER,U),x.bindFramebuffer(L.DRAW_FRAMEBUFFER,G);for(let Me=0;Me<_t;Me++)pr?L.framebufferTextureLayer(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,Ve.__webglTexture,z,qt+Me):L.framebufferTexture2D(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,Ve.__webglTexture,z),ge?L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,Bs.__webglTexture,gt,Ke+Me):L.framebufferTexture2D(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,Bs.__webglTexture,gt),z!==0?L.blitFramebuffer(Et,Vt,vt,mt,bt,ue,vt,mt,L.COLOR_BUFFER_BIT,L.NEAREST):ge?L.copyTexSubImage3D(xt,gt,bt,ue,Ke+Me,Et,Vt,vt,mt):L.copyTexSubImage2D(xt,gt,bt,ue,Et,Vt,vt,mt);x.bindFramebuffer(L.READ_FRAMEBUFFER,null),x.bindFramebuffer(L.DRAW_FRAMEBUFFER,null)}else ge?M.isDataTexture||M.isData3DTexture?L.texSubImage3D(xt,gt,bt,ue,Ke,vt,mt,_t,ve,bn,Ee.data):N.isCompressedArrayTexture?L.compressedTexSubImage3D(xt,gt,bt,ue,Ke,vt,mt,_t,ve,Ee.data):L.texSubImage3D(xt,gt,bt,ue,Ke,vt,mt,_t,ve,bn,Ee):M.isDataTexture?L.texSubImage2D(L.TEXTURE_2D,gt,bt,ue,vt,mt,ve,bn,Ee.data):M.isCompressedTexture?L.compressedTexSubImage2D(L.TEXTURE_2D,gt,bt,ue,Ee.width,Ee.height,ve,Ee.data):L.texSubImage2D(L.TEXTURE_2D,gt,bt,ue,vt,mt,ve,bn,Ee);x.pixelStorei(L.UNPACK_ROW_LENGTH,Cn),x.pixelStorei(L.UNPACK_IMAGE_HEIGHT,ee),x.pixelStorei(L.UNPACK_SKIP_PIXELS,li),x.pixelStorei(L.UNPACK_SKIP_ROWS,Gi),x.pixelStorei(L.UNPACK_SKIP_IMAGES,Ps),gt===0&&N.generateMipmaps&&L.generateMipmap(xt),x.unbindTexture()},this.initRenderTarget=function(M){H.get(M).__webglFramebuffer===void 0&&Z.setupRenderTarget(M)},this.initTexture=function(M){M.isCubeTexture?Z.setTextureCube(M,0):M.isData3DTexture?Z.setTexture3D(M,0):M.isDataArrayTexture||M.isCompressedArrayTexture?Z.setTexture2DArray(M,0):Z.setTexture2D(M,0),x.unbindTexture()},this.resetState=function(){J=0,I=0,it=null,x.reset(),yt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Bi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;let n=this.getContext();n.drawingBufferColorSpace=Qt._getDrawingBufferColorSpace(t),n.unpackColorSpace=Qt._getUnpackColorSpace()}};var os={light:"#609724",dark:"#54851d",line:"#e7e9bd",track:"#a66036",rim:"#e5dcb2"};function l0(e,t,n,i=!1){let s=i?640:er.width;t(e,i?-160:-32,-82,s+224,510,os.dark,-100);for(let f=-32,h=0;f<s+32;f+=54,h++)t(e,f,i?26:68,54,354,h%2?os.light:os.dark,-99);for(let f=76;f<356;f+=8)for(let h=2;h<s;h+=13){let d=(h*17+f*11)%29;d<4&&t(e,h,f,1,d%2+1,d%2?"#6fa12d":"#4b7d1b",-98)}let a=i?-4:-24;t(e,-30,40,s+60,34,os.track,-97);for(let f of[43,48,53,58])t(e,-30,f,s+60,1,"#cf9362",-96);t(e,-30,a,s+60,64,"#29546b",-95);let r=["#e1c678","#c8d9e0","#ce785c","#6ba5b0","#31435e"];for(let f=0;f<6;f++){let h=a+5+f*9;t(e,-30,h+6,s+60,2,"#879b9b",-94);for(let d=-28;d<s+30;d+=7){let m=Math.abs(d*31+f*47)%r.length;t(e,d+1,h,2,2,"#d5aa7e",-93),t(e,d,h+2,4,4,r[m],-93)}}for(let f=20;f<s;f+=126){t(e,f,a,10,64,"#9caeae",-92);for(let h=a+4;h<a+64;h+=8)t(e,f,h,10,1,"#d2d9c5",-91)}t(e,-30,i?48:39,s+60,5,"#dfdcc4",-90);let o=["#d9d6b8","#225397","#d4a432","#244c69","#ac573e","#315e42"],l={A:["010","101","111","101","101"],R:["110","101","110","101","101"],C:["011","100","100","100","011"],D:["110","101","101","101","110"],E:["111","100","110","100","111"],F:["111","100","110","100","100"],O:["010","101","101","101","010"],T:["111","010","010","010","010"],B:["110","101","110","101","110"],L:["100","100","100","100","111"],P:["110","101","110","100","100"],K:["101","101","110","101","101"]};for(let f=-30,h=0;f<s+30;f+=90,h++){t(e,f,49,88,21,o[h%o.length],-89),t(e,f+3,52,82,1,"#eee6c0",-88);let d=h%2?"FOOTBALL":"ARCADE";for(let[m,b]of[...d].entries())for(let[g,p]of l[b].entries())for(let y=0;y<3;y++)p[y]==="1"&&t(e,f+7+m*9+y*2,55+g*2,2,2,"#eee6c0",-88);t(e,f+87,48,2,25,"#263d3b",-87)}if(t(e,-32,71,s+64,3,os.rim,-86),i)return;let c=(f,h,d,m)=>{let b=Xe({x:f,y:h});n(e,b.x,b.y,d*Ot.scaleX,m*Ot.scaleY,os.line)};c(0,0,Ot.length,Ot.width);let u=Xe({x:Ot.length/2,y:Ot.width/2});t(e,u.x,Ot.y,1,Ot.width*Ot.scaleY,os.line,-40);for(let f of[0,88.5])c(f,20,16.5,28);for(let f of[0,99.5])c(f,27,5.5,14);for(let f=0;f<720;f++){let h=f*Math.PI*2/720,d=Xe({x:52.5+Math.cos(h)*Ot.centreRadius,y:34+Math.sin(h)*Ot.centreRadius});t(e,Math.round(d.x),Math.round(d.y),2,1,os.line,-40)}for(let f of[11,94]){let h=Xe({x:f,y:34});t(e,h.x,h.y,2,2,os.line,-40)}t(e,u.x,u.y,2,2,os.line,-40);for(let f of[0,Ot.length])for(let h of[0,Ot.width]){let d=Xe({x:f,y:h});t(e,d.x,d.y-15,1,16,"#e6d8a8",-39),t(e,d.x+1,d.y-15,5,4,"#e3b643",-38)}for(let f of[-1,1]){let h=Xe({x:f<0?0:Ot.length,y:34}).x,d=22,m=h+f*d,b=Math.min(h,m),g=Xe({x:0,y:Ot.goalTop}).y,p=Xe({x:0,y:Ot.goalBottom}).y,y=g-tr;t(e,b,y,d,p-y,"#526e57",-49);for(let S=y;S<=p;S+=5)t(e,b,S,d,1,"#b2c3a0",-48);for(let S=b;S<=b+d;S+=4)t(e,S,y,1,p-y,"#b2c3a0",-48);t(e,m,y,2,p-y,"#d9dfbd",-47);for(let S of[g,p])t(e,h,S-tr,2,tr,"#f3efda",-46),t(e,b,S-tr,d+2,2,"#f3efda",-46);t(e,h,y,2,p-g,"#f3efda",-46)}}var jf=class{constructor(t,n,i){this.assets=n;this.viewportWidth=_i.width;this.scene=new $l;this.pitch=new Ln;this.camera=new cr(0,320,0,-224,.1,200);this.actors=new Map;this.decorations=new Map;this.meshes=[];this.ball=new Ln;this.close=new Ln;this.net=new Ln;this.target=new Ln;this.disposed=!1;this.selectionLabel=new Ln;this.shootLabel=new Ln;this.gl=new Kf({canvas:t,antialias:!1,alpha:!1,preserveDrawingBuffer:!0,powerPreference:"low-power"}),this.gl.setPixelRatio(1),this.gl.setSize(_i.width,_i.height,!1),this.gl.outputColorSpace=En,this.gl.setClearColor("#0f172b"),this.camera.position.z=100,this.scene.add(this.pitch,this.close,this.ball),this.poses=new Map(n.records.map(u=>[u.id,u])),this.texture=new An(i),this.texture.colorSpace=En,this.texture.minFilter=Ye,this.texture.magFilter=Ye,this.texture.generateMipmaps=!1,this.texture.needsUpdate=!0,l0(this.pitch,this.rect.bind(this),this.box.bind(this)),this.batchStatic(this.pitch),this.pitch.add(this.selectionLabel,this.shootLabel),this.rect(this.shootLabel,-23,-98,46,18,"#172346",8003),this.rect(this.shootLabel,-22,-97,44,16,"#ffdb4d",8004),this.rect(this.shootLabel,-21,-96,42,14,"#2345a3",8005);let s=["111/100/111/001/111","101/101/111/101/101","111/101/101/101/111","111/101/101/101/111","111/010/010/010/010"];for(let[u,f]of s.entries())for(let[h,d]of f.split("/").entries())for(let m=0;m<3;m++)d[m]==="1"&&(this.rect(this.shootLabel,u*8+m*2-18+1,h*2-94+1,2,2,"#142112",8006),this.rect(this.shootLabel,u*8+m*2-18,h*2-94,2,2,"#ffe05a",8007));this.batchStatic(this.shootLabel);for(let[u,f]of[["110","101","110","100","100"],["010","110","010","010","111"]].entries())for(let h=0;h<5;h++)for(let d=0;d<3;d++)f[h][d]==="1"&&this.rect(this.selectionLabel,u*4+d-3,h-72,1,1,"#ffffff",8002);for(let u=0;u<22;u++){let f=this.makeSprite();this.actors.set(u,f),this.pitch.add(f);let h=this.rect(this.pitch,0,0,10,2,u<11?"#5cdfff":"#ef6758",1),d=new an(new ac(1,12),new Ti({color:"#102318",transparent:!0,depthTest:!1,depthWrite:!1}));d.scale.set(8,2,1),this.pitch.add(d),this.meshes.push(d);let m=new qn;m.setAttribute("position",new sn([-4,80,0,0,74,0,4,80,0],3));let b=new an(m,new Ti({color:"#ffffff",side:Ei,transparent:!0,depthTest:!1,depthWrite:!1}));b.scale.set(Fl,Fl,1),this.pitch.add(b),this.meshes.push(b),this.decorations.set(u,{marker:h,shadow:d,selection:b})}l0(this.close,this.rect.bind(this),this.box.bind(this),!0),this.batchStatic(this.close),this.close.add(this.net,this.target);let a=ne.centreX-6.5*ne.lateralScale,r=ne.centreX+6.5*ne.lateralScale,o=ne.basePlane-75,l=ne.basePlane;for(let u=a+12;u<=r-12;u+=7)this.rect(this.net,u,o-8,1,75,"#b9c8ba",-49);for(let u=o-8;u<=l-8;u+=6)this.rect(this.net,a+12,u,r-a-24,1,"#b9c8ba",-49);let c=(u,f,h,d)=>{let m=Math.ceil(Math.hypot(h-u,d-f));for(let b=0;b<=m;b++)this.rect(this.net,Math.round(u+(h-u)*b/m),Math.round(f+(d-f)*b/m),1,1,"#d7e1c9",-48)};for(let u=a;u<=r;u+=8)c(u,o,u+12-(u-a)/(r-a)*24,o-8);for(let u=o;u<=l;u+=7)c(a,u,a+12,u-8),c(r,u,r-12,u-8);this.rect(this.net,a,o,2,75,"#ffffff",-40),this.rect(this.net,r-1,o,2,75,"#ffffff",-40),this.rect(this.net,a,o,r-a,2,"#ffffff",-40),this.batchStatic(this.net),this.closeKeeper=this.makeSprite(),this.close.add(this.closeKeeper),this.closeShooter=this.makeSprite(),this.close.add(this.closeShooter),this.closeMarker=this.rect(this.close,0,0,10,2,"#5cdfff",1),this.closeShadow=this.rect(this.close,0,0,7,2,"#162536",9e3),this.rect(this.target,-12,0,25,1,"#5cdfff",10010),this.rect(this.target,0,-12,1,25,"#5cdfff",10010),this.ballShadow=this.rect(this.pitch,0,0,6,2,"#162536",9e3),this.rect(this.ball,-3,-3,7,7,"#081019",1e4),this.rect(this.ball,-2,-2,5,5,"#ffffff",10001),this.rect(this.ball,-1,-1,2,2,"#1a253a",10002)}resize(t){this.viewportWidth=t,this.gl.setSize(t,_i.height,!1)}rect(t,n,i,s,a,r,o){let l=new an(new Ma(s,a),new Ti({color:r,transparent:o>0,depthTest:!1,depthWrite:!1}));return l.position.set(n+s/2,-i-a/2,0),l.renderOrder=o,t.add(l),this.meshes.push(l),l}box(t,n,i,s,a,r,o=1){this.rect(t,n,i,s,o,r,-40),this.rect(t,n,i+a-o,s,o,r,-40),this.rect(t,n,i,o,a,r,-40),this.rect(t,n+s-o,i,o,a,r,-40)}makeSprite(){let t=new an(new Ma(1,1),new Ti({map:this.texture,transparent:!0,alphaTest:.01,depthTest:!1,depthWrite:!1}));return this.meshes.push(t),t}batchStatic(t){let n=t.children.filter(l=>l instanceof an&&l.renderOrder<0);n.sort((l,c)=>l.renderOrder-c.renderOrder);let i=[],s=[];for(let l of n){l.updateMatrix();let c=l.geometry.toNonIndexed(),u=c.getAttribute("position");for(let f=0;f<u.count;f++){let h=new V().fromBufferAttribute(u,f).applyMatrix4(l.matrix);i.push(h.x,h.y,h.z),s.push(l.material.color.r,l.material.color.g,l.material.color.b)}c.dispose(),l.geometry.dispose(),l.material.dispose(),t.remove(l)}let a=new Set(n);this.meshes=this.meshes.filter(l=>!a.has(l));let r=new qn;r.setAttribute("position",new sn(i,3)),r.setAttribute("color",new sn(s,3));let o=new an(r,new Ti({vertexColors:!0,depthTest:!1,depthWrite:!1}));o.renderOrder=-50,t.add(o),this.meshes.push(o)}show(t,n,i,s,a,r=!0){let o=this.poses.get(s.pose),l=o?r?kl(o):o:void 0;if(!l)throw new Error("Missing atlas pose "+s.pose);let c=l.anchors.ground,[u,f,h,d]=l.atlas,[m,b]=this.assets.atlasSize,g=l.width,p=l.height,y=t.geometry.getAttribute("uv");y.setXY(0,u/m,1-f/b),y.setXY(1,(u+h)/m,1-f/b),y.setXY(2,u/m,1-(f+d)/b),y.setXY(3,(u+h)/m,1-(f+d)/b),y.needsUpdate=!0,t.scale.set(s.mirror?-g:g,p,1),t.position.set(Math.round(n)+(s.mirror?c[0]-g/2:g/2-c[0]),-(Math.round(i)+p/2-c[1]),0),t.renderOrder=a,t.visible=!0}render(t){if(this.disposed)return;let n=t.state,i=n.shotView;if(this.pitch.visible=!i,this.close.visible=!!i,i){this.camera.left=160-this.viewportWidth/2,this.camera.right=160+this.viewportWidth/2,this.camera.top=0,this.camera.bottom=-224,this.camera.updateProjectionMatrix();let c=n.players[i.keeper],u=nr({...c,z:0},i),f=Vm(n.ball,i),h=nr(n.ball,i);this.net.position.y=-(i.planeY-ne.basePlane),this.show(this.closeKeeper,u.x,u.y,t.view(c),151,!1),this.closeMarker.position.set(u.x,-u.y-5,0),this.closeMarker.renderOrder=152,this.closeMarker.material instanceof Ti&&this.closeMarker.material.color.set(c.team===0?"#5cdfff":"#ef6758"),this.target.visible=i.phase==="aim",this.target.position.set(i.aim.x,-i.aim.y,0);let d=n.players[i.shooter],m=ub(i,d),b=Vm(t.anchor(d,"foot",{pose:(d.team===1?"orchard-":"")+"kick-contact",mirror:i.direction<0}),i);if(this.closeShooter.visible=!!m,m){let g=(d.team===1?"orchard-":"")+"close-"+m,p=this.poses.get(g),y=p.anchors.ground,S=p.anchors.ballContact,v=i.phase==="aim"&&i.age<66?-Math.round((66-i.age)/3):0;this.show(this.closeShooter,b.x+y[0]-S[0]+v,b.y+y[1]-S[1],{pose:g,mirror:!1},500,!1)}this.ball.position.set(Math.round(f.x),-Math.round(f.y),0),this.closeShadow.visible=n.ball.z>3,this.closeShadow.position.set(Math.round(h.x),-Math.round(h.y),0),this.gl.render(this.scene,this.camera);return}for(let c of this.actors.values())c.visible=!1;for(let c of this.decorations.values())c.marker.visible=!1,c.shadow.visible=!1,c.selection.visible=!1;for(let c of n.players){let u=Xe(c),f=Math.round(u.x),h=Math.round(u.y);this.show(this.actors.get(c.id),u.x,u.y,t.view(c),h);let d=this.decorations.get(c.id);d.marker.visible=!0,d.shadow.visible=!0,d.marker.position.set(f,-h-5,0),d.marker.renderOrder=h+.1,d.shadow.position.set(f,-h-2,0),d.shadow.renderOrder=h-.1,d.selection.visible=c.id===n.selected,d.selection.position.set(f,-h,0),d.selection.renderOrder=8e3}let s=Xe(n.ball);this.shootLabel.visible=t.shootPrompt();let a=Xe(n.players[n.selected]),r=Math.max(n.camera.x+24,Math.min(n.camera.x+this.viewportWidth-24,a.x+36)),o=Math.max(a.y-6,n.camera.y+140);this.shootLabel.position.set(Math.round(r),-Math.round(o),0);let l=Xe(n.players[n.selected]);this.selectionLabel.position.set(Math.round(l.x),-Math.round(l.y),0),this.ball.position.set(Math.round(s.x),-Math.round(s.y-n.ball.z),0),this.ballShadow.visible=n.ball.z>3,this.ballShadow.position.set(Math.round(s.x),-Math.round(s.y),0),this.camera.left=n.camera.x,this.camera.right=n.camera.x+this.viewportWidth,this.camera.top=-n.camera.y,this.camera.bottom=-n.camera.y-224,this.camera.updateProjectionMatrix(),this.gl.render(this.scene,this.camera)}diagnostics(){return{disposed:this.disposed,geometries:this.gl.info.memory.geometries,textures:this.gl.info.memory.textures,drawCalls:this.gl.info.render.calls}}dispose(){if(!this.disposed){this.disposed=!0;for(let t of this.meshes){t.geometry.dispose();let n=t.material;Array.isArray(n)?n.forEach(i=>i.dispose()):n.dispose()}this.texture.dispose(),this.scene.clear(),this.actors.clear(),this.gl.renderLists.dispose(),this.gl.dispose(),this.gl.forceContextLoss()}}};var $f=class{constructor(t,n,i,s={}){this.context=s;this.audio=new eh;this.previous=null;this.accumulated=0;this.raf=0;this.disposed=!1;this.unavailable=!1;this.backgrounded=!1;this.framing="wide";this.measuredWidth=384;this.listeners=new Set;this.resultSent=!1;this.eventCursor=0;this.controller=new AbortController;this.subscribe=t=>(this.listeners.add(t),()=>{this.listeners.delete(t)});this.dispatch=t=>{if(this.disposed||this.unavailable)return;t.type!=="clear"&&!(t.type==="hold"&&!t.value)&&this.audio.unlock();let n=this.sim.state.round,i=this.sim.state.status;this.sim.command(t);let s=this.sim.state.round!==n;(this.sim.state.status!==i||s)&&(this.previous=null,this.accumulated=0),s&&(this.resultSent=!1,this.eventCursor=0),this.publish(),["start","resume"].includes(t.type)&&this.audio.ui()};this.loop=t=>{if(!this.disposed){if(this.sim.state.status==="playing"){this.previous!==null&&(this.accumulated+=Math.min(200,t-this.previous));let n=Math.min(12,Math.floor((this.accumulated+1e-7)/(1e3/60)));n&&(this.step(n),this.accumulated-=n*1e3/60),this.previous=t}else this.previous=null;this.raf=requestAnimationFrame(this.loop)}};this.sim=new ih(n),this.renderer=new jf(t,n,i),this.resizeObserver=new ResizeObserver(a=>{if(this.disposed)return;let r=a[0]?.contentRect;!r||r.height<1||(this.measuredWidth=224*r.width/r.height,this.setFraming(this.framing))}),this.resizeObserver.observe(t.parentElement),this.settings={music:.4,sfx:.7},this.setSettings(s.settings??{},!1),this.renderer.render(this.sim),this.raf=requestAnimationFrame(this.loop),t.addEventListener("webglcontextlost",a=>{this.disposed||(a.preventDefault(),this.pause(),this.unavailable=!0,this.context.onError?.("Graphics context lost. Retry loading to continue."))},{signal:this.controller.signal})}setFraming(t){this.framing=t,this.sim.setViewportWidth(t==="reference"?320:this.measuredWidth),this.renderer.resize(this.sim.viewportWidth),this.renderer.render(this.sim)}publish(){this.renderer.render(this.sim);for(let t of this.sim.state.events){let n=Number(t.sequence);n>this.eventCursor&&(this.eventCursor=n,this.audio.event(t),this.context.onEvent?.(structuredClone(t)))}this.audio.sync(this.backgrounded?"hidden":this.sim.state.status),this.sim.state.status==="complete"&&(this.resultSent||(this.resultSent=!0,this.context.onResult?.(this.result())));for(let t of this.listeners)t()}result(){let t=this.sim.state;return{schemaVersion:2,gameId:"retro-football",mode:"exhibition",airContacts:[...t.airContacts],airCollections:[...t.airCollections],outcome:t.score[0]===t.score[1]?"draw":t.score[0]>t.score[1]?"win":"loss",score:[...t.score],halves:2,activeSeconds:180,passes:[...t.passes],shots:[...t.shots],saves:[...t.saves],rulesVersion:Di.rulesVersion,runtimeVersion:Di.runtimeVersion,assetVersion:Di.assetVersion}}step(t=1){if(!(this.disposed||this.unavailable)){for(let n=0;n<t;n++)this.sim.step();this.publish()}}start(){this.dispatch({type:"start"})}pause(){this.sim.state.status==="playing"?this.dispatch({type:"pause"}):this.dispatch({type:"clear"})}resume(){this.dispatch({type:"resume"})}setBackground(t){this.disposed||(this.backgrounded=t,t?this.pause():this.audio.sync(this.sim.state.status))}restart(){this.disposed||this.unavailable||(this.audio.unlock(),this.sim.restart(),this.previous=null,this.accumulated=0,this.resultSent=!1,this.eventCursor=0,this.publish())}setSettings(t,n=!0){if(!this.disposed){for(let i of["music","sfx"]){let s=t[i];s!==void 0&&Number.isFinite(s)&&(this.settings[i]=Math.max(0,Math.min(1,s)))}this.audio.setSettings(this.settings),n&&this.context.onSettingsChange?.({...this.settings})}}diagnostics(){return{...this.renderer.diagnostics(),listeners:this.listeners.size,audio:this.audio.diagnostics(),pendingFrame:!this.disposed}}dispose(){this.disposed||(this.disposed=!0,this.controller.abort(),this.resizeObserver.disconnect(),cancelAnimationFrame(this.raf),this.sim.clear(),this.listeners.clear(),this.renderer.dispose(),this.audio.dispose(),this.previous=null,this.accumulated=0)}};async function $S(e,t){let n=await fetch(e,{signal:t});if(!n.ok)throw new Error("Asset manifest could not load.");let i=await n.json();if(i.schemaVersion!==1||i.version!=="football-chance-atlas-v2"||i.approval!=="reference"||i.records.length!==95)throw new Error("Unsupported football asset manifest.");let s=new URL(i.atlasUrl,e);if(s.origin!==e.origin)throw new Error("Unexpected atlas origin.");let a=await fetch(s,{signal:t});if(!a.ok)throw new Error("Team atlas could not load.");let r=await a.arrayBuffer(),o=await crypto.subtle.digest("SHA-256",r);if(Array.from(new Uint8Array(o),u=>u.toString(16).padStart(2,"0")).join("")!==i.atlasSha256)throw new Error("Team atlas integrity check failed.");if(t.aborted)throw new DOMException("Aborted","AbortError");let c=URL.createObjectURL(new Blob([r],{type:"image/png"}));try{let u=new Image;if(u.src=c,await u.decode(),t.aborted)throw new DOMException("Aborted","AbortError");if(u.naturalWidth!==i.atlasSize[0]||u.naturalHeight!==i.atlasSize[1])throw new Error("Team atlas dimensions changed.");return{manifest:i,image:u}}finally{URL.revokeObjectURL(c)}}function t1(e,t,n=[]){let i=Math.hypot(e,t),s=n.length?.19:.27;if(i<s)return[];let a=Math.abs(e),r=Math.abs(t),o=Math.tan(Math.PI/8),l=a>r*o,c=r>a*o,u=[];return l&&u.push(e<0?"left":"right"),c&&u.push(t<0?"up":"down"),u}function e1(e,t){let n=new AbortController,i={signal:n.signal},s={arrowleft:"left",arrowright:"right",arrowup:"up",arrowdown:"down"};document.addEventListener("keydown",u=>{if(u.target?.matches("input,select,textarea"))return;if(u.key==="Escape"&&!u.repeat){u.preventDefault(),t.dispatch({type:"pause"});return}let f=s[u.key.toLowerCase()];f&&(u.preventDefault(),t.dispatch({type:"hold",key:f,value:!0,source:"keyboard:"+u.code}));let m=(t.sim.attackingControls()?{p:"pass",l:"loft",s:"shoot"}:{t:"tackle",s:"switch",d:"slide"})[u.key.toLowerCase()];m&&!u.repeat&&(u.preventDefault(),t.dispatch({type:m}))},i),document.addEventListener("keyup",u=>{let f=s[u.key.toLowerCase()];f&&t.dispatch({type:"hold",key:f,value:!1,source:"keyboard:"+u.code})},i);let a=new Set,r=new Map,o=u=>{let f=r.get(u.pointerId);if(!f)return;let h=f.pad.getBoundingClientRect(),d=t1((u.clientX-h.x-h.width/2)/(h.width/2),(u.clientY-h.y-h.height/2)/(h.height/2),f.directions),m="pointer:"+u.pointerId;for(let b of f.directions)d.includes(b)||t.dispatch({type:"hold",key:b,value:!1,source:m});for(let b of d)f.directions.includes(b)||t.dispatch({type:"hold",key:b,value:!0,source:m});f.directions=d};e.addEventListener("pointerdown",u=>{let f=u.target.closest("[data-stick]");if(f){if(f.getAttribute("aria-disabled")==="true")return;u.preventDefault(),f.setPointerCapture(u.pointerId),r.set(u.pointerId,{pad:f,directions:[]}),o(u);return}let h=u.target.closest("button[data-hold],button[data-action]");if(!h||h.disabled)return;u.preventDefault(),h.setPointerCapture(u.pointerId),a.add(u.pointerId),h.dataset.pressed="true";let d=h.dataset.hold,m=h.dataset.action;d?t.dispatch({type:"hold",key:d,value:!0,source:"pointer:"+u.pointerId}):m&&t.dispatch({type:m})},i),e.addEventListener("pointermove",u=>{r.has(u.pointerId)&&(u.preventDefault(),o(u))},i);let l=u=>{let f=r.get(u.pointerId);if(f){for(let m of f.directions)t.dispatch({type:"hold",key:m,value:!1,source:"pointer:"+u.pointerId});r.delete(u.pointerId);return}let h=u.target.closest("button[data-hold],button[data-action]");if(!h)return;delete h.dataset.pressed,a.delete(u.pointerId);let d=h.dataset.hold;d&&t.dispatch({type:"hold",key:d,value:!1,source:"pointer:"+u.pointerId})};for(let u of["pointerup","pointercancel","lostpointercapture"])e.addEventListener(u,l,i);let c=()=>{t.setBackground(!0);for(let u of e.querySelectorAll("[data-pressed]"))delete u.dataset.pressed;a.clear(),r.clear()};return window.addEventListener("blur",c,i),window.addEventListener("focus",()=>{document.hidden||t.setBackground(!1)},i),document.addEventListener("visibilitychange",()=>{document.hidden?c():t.setBackground(!1)},i),document.hidden&&c(),()=>{n.abort(),a.clear(),r.clear();for(let u of e.querySelectorAll("[data-pressed]"))delete u.dataset.pressed;t.sim.clear()}}var n1=1;function i1(){let e=new URL(location.href).searchParams,t=e.get("session")??crypto.randomUUID(),n=window.parent!==window&&e.get("host")==="web",i=window.RetroFootballHost,s=null,a=!1,r=!n,o=0,l=new AbortController,c=(m,b={})=>{if(a)return;let g={protocolVersion:n1,gameId:Di.id,sessionId:t,type:m,payload:b};n?parent.postMessage(g,location.origin):i?.postMessage(JSON.stringify(g))},u=m=>{if(!m||typeof m!="object")return null;let b=m,g={};for(let p of["music","sfx"])if(b[p]!==void 0){if(typeof b[p]!="number"||!Number.isFinite(b[p])||b[p]<0||b[p]>1)return null;g[p]=b[p]}return g},f=m=>{if(a||!s||!m||typeof m!="object")return;let b=m;if(!(b.protocolVersion!==n1||b.gameId!==Di.id||b.sessionId!==t)){if(b.type==="launch"){let g=u(b.payload);if(!g)return;r=!0,s.setSettings(g),c("launched",Di)}else if(r)if(b.type==="pause")s.pause();else if(b.type==="resume")s.resume();else if(b.type==="settings"){let g=u(b.payload);g&&s.setSettings(g)}else b.type==="dispose"&&(s.dispose(),c("disposed"),a=!0,l.abort())}};return window.addEventListener("message",m=>{n&&m.source===parent&&m.origin===location.origin&&f(m.data)},{signal:l.signal}),i&&Object.assign(window,{retroFootballHostV1:{receive:f}}),{context:{onReady:m=>{s=m,c("ready",Di)},onResult:m=>c("result",{resultId:t+":"+ ++o,result:m}),onSettingsChange:m=>c("settings",m),onError:m=>c("error",{message:m}),onExit:n||i?()=>c("exit"):void 0},dispose(){a||(a=!0,l.abort(),s=null,i&&delete window.retroFootballHostV1)}}}var o1=Ua(Bo());var Nt=Ua(bc());function l1({atlasUrl:e,onStart:t,onMenu:n}){let[i,s]=(0,o1.useState)(!1);return(0,Nt.jsxs)("section",{className:"arcade-lobby","aria-label":"Pitchflare XI lobby",children:[(0,Nt.jsx)("div",{className:"lobby-pattern","aria-hidden":"true",children:Array.from({length:18},(a,r)=>(0,Nt.jsx)("span",{children:"PITCHFLARE XI /"},r))}),(0,Nt.jsxs)("header",{className:"lobby-header",children:[(0,Nt.jsx)("span",{children:"FOOTBALL ARCADE"}),(0,Nt.jsx)("span",{children:"1 PLAYER \xB7 EXHIBITION"})]}),(0,Nt.jsxs)("div",{className:"lobby-copy",children:[(0,Nt.jsx)("span",{className:"lobby-kicker",children:"POCKET ARCADE / FOOTBALL"}),(0,Nt.jsx)("img",{src:"../../assets/games/identity/retro-football.svg",alt:"",width:"110",height:"80",style:{objectFit:"contain"}}),(0,Nt.jsxs)("h1",{children:["PITCHFLARE",(0,Nt.jsx)("br",{}),(0,Nt.jsx)("em",{children:"XI"})]}),(0,Nt.jsx)("p",{children:"THE MATCH IS YOURS."}),(0,Nt.jsxs)("div",{className:"lobby-format",children:["11 V 11 ",(0,Nt.jsx)("span",{children:" / "})," 2 \xD7 90 SECONDS"]}),(0,Nt.jsxs)("button",{id:"start",className:"primary lobby-start",onClick:t,children:["KICK OFF ",(0,Nt.jsx)("span",{"aria-hidden":"true",children:"\u25B6"})]}),(0,Nt.jsx)("button",{className:"utility lobby-help","aria-expanded":i,"aria-controls":"lobby-details",onClick:()=>s(a=>!a),children:i?"VIEW MATCHUP":"HOW TO PLAY"})]}),(0,Nt.jsxs)("div",{className:"lobby-match",id:"lobby-details",children:[(0,Nt.jsxs)("div",{className:"lobby-section-title",children:[i?"THREE BUTTON FOOTBALL":"MATCH MENU",(0,Nt.jsx)("button",{className:"utility",onClick:n,children:"SETTINGS"})]}),i?(0,Nt.jsxs)("div",{className:"lobby-instructions",children:[(0,Nt.jsx)("h2",{children:"MOVE. PASS. SHOOT."}),(0,Nt.jsx)("p",{children:"Steer with the pad. Button labels change with play."}),(0,Nt.jsxs)("dl",{children:[(0,Nt.jsxs)("div",{children:[(0,Nt.jsx)("dt",{children:"ATTACK"}),(0,Nt.jsx)("dd",{children:"P pass \xB7 L loft \xB7 S shoot"})]}),(0,Nt.jsxs)("div",{children:[(0,Nt.jsx)("dt",{children:"DEFEND"}),(0,Nt.jsx)("dd",{children:"T tackle \xB7 S switch \xB7 D slide"})]}),(0,Nt.jsxs)("div",{children:[(0,Nt.jsx)("dt",{children:"CHANCE"}),(0,Nt.jsx)("dd",{children:"Arrow keys aim \xB7 S confirms"})]})]}),(0,Nt.jsx)("small",{children:"KEYBOARD: ARROW KEYS TO MOVE"})]}):(0,Nt.jsxs)(Nt.Fragment,{children:[(0,Nt.jsxs)("div",{className:"lobby-teams",children:[["HARBOUR","ORCHARD"].map((a,r)=>(0,Nt.jsxs)("article",{className:"lobby-team "+(r?"opponent":"player"),children:[(0,Nt.jsxs)("div",{className:"team-plate",children:[(0,Nt.jsx)("span",{children:r?"CPU":"P1 / YOU"}),(0,Nt.jsx)("b",{children:a}),(0,Nt.jsx)("small",{children:r?"UNITED":"ATHLETIC"})]}),(0,Nt.jsx)("div",{className:"lobby-player","aria-hidden":"true",children:(0,Nt.jsx)("div",{style:{backgroundImage:`url("${e}")`,backgroundPosition:`-${r?86:2}px -768px`}})}),(0,Nt.jsx)("span",{className:"team-role",children:r?"LOCAL AI":"YOUR TEAM"})]},a)),(0,Nt.jsx)("b",{className:"lobby-versus","aria-hidden":"true",children:"VS"})]}),(0,Nt.jsx)("div",{className:"lobby-match-note",children:"ONE STADIUM. ONE MATCH. ALL TO PLAY FOR."})]})]}),(0,Nt.jsxs)("footer",{className:"lobby-footer",children:[(0,Nt.jsx)("span",{children:"LANDSCAPE + HEADPHONES"}),(0,Nt.jsx)("span",{children:"INVENTED CLUBS \xB7 LOCAL EXHIBITION"})]})]})}var at=Ua(bc()),On={session:null,ready:!1,mounts:0,disposals:0,lastDisposal:null,step:e=>On.session?.step(e),restart:()=>On.session?.restart(),dispose:()=>{},remount:()=>{}};window.productionLab=On;var Sc=window.frameElement?.ownerDocument??document;function YR({context:e,manifestUrl:t}){let n=(0,Le.useRef)(null),i=(0,Le.useRef)(null),s=(0,Le.useRef)(null),[a,r]=(0,Le.useState)(null),[o,l]=(0,Le.useState)(0),[c,u]=(0,Le.useState)(0),[f,h]=(0,Le.useState)(!1),[d,m]=(0,Le.useState)(""),[b,g]=(0,Le.useState)(!1),[p,y]=(0,Le.useState)(!1),[S,v]=(0,Le.useState)(!1),[T,E]=(0,Le.useState)(!1),[C,_]=(0,Le.useState)(""),[A,R]=(0,Le.useState)(!1),[O,F]=(0,Le.useState)("");(0,Le.useEffect)(()=>{a?.setFraming(A?"reference":"wide")},[a,A]);let X=(0,Le.useRef)(null),U=(0,Le.useRef)(null);(0,Le.useEffect)(()=>{let k=new AbortController,ot=()=>{},Rt=()=>{};return On.ready=!1,$S(t,k.signal).then(({manifest:st,image:Pt})=>{if(k.signal.aborted)return;let re=new $f(i.current,st,Pt,{...e,onError:Ft=>{m(Ft),h(!1),On.ready=!1,e.onError?.(Ft)}});F(Pt.src),s.current=re,r(re),On.session=re,On.mounts++,ot=e1(n.current,re),Rt=re.subscribe(()=>{window.gameState=re.sim.snapshot(),l(Ft=>Ft+1)}),window.gameState=re.sim.snapshot(),e.onReady?.(re),h(!0),On.ready=!0}).catch(st=>{k.signal.aborted||(m(st instanceof Error?st.message:"The game could not load."),e.onError?.("Retro Football could not load."))}),()=>{k.abort(),ot(),Rt();let st=s.current;st&&(st.dispose(),On.lastDisposal=st.diagnostics(),On.disposals++),s.current=null,On.session=null,On.ready=!1}},[e,t,c]);let G=()=>{h(!1),m(""),r(null),u(k=>k+1)};(0,Le.useEffect)(()=>(On.remount=()=>{h(!1),m(""),r(null),u(k=>k+1)},()=>{On.remount=()=>{}}),[]),(0,Le.useEffect)(()=>{let k=()=>E(!!Sc.fullscreenElement);return Sc.addEventListener("fullscreenchange",k),()=>Sc.removeEventListener("fullscreenchange",k)},[]),(0,Le.useEffect)(()=>{if(!b)return;let ot=U.current?.querySelectorAll("button,input");ot?.[0]?.focus();let Rt=st=>{if(st.key==="Escape"&&(st.preventDefault(),st.stopImmediatePropagation(),g(!1),X.current?.focus()),st.key==="Tab"&&ot?.length){let Pt=ot[0],re=ot[ot.length-1];st.shiftKey&&document.activeElement===Pt?(st.preventDefault(),re.focus()):!st.shiftKey&&document.activeElement===re&&(st.preventDefault(),Pt.focus())}};return document.addEventListener("keydown",Rt,!0),()=>document.removeEventListener("keydown",Rt,!0)},[b]);let J=async()=>{try{if(Sc.fullscreenElement){await Sc.exitFullscreen();return}await(window.frameElement instanceof HTMLIFrameElement?window.frameElement:document.documentElement).requestFullscreen(),await screen.orientation?.lock?.("landscape").catch(()=>{}),_("")}catch{_("Use landscape or add this game to your home screen for the largest view.")}},I=a?.sim.state,it=I?.status==="playing",q=I?Math.max(0,90-Math.floor(I.halfTicks/60)):90,tt=a?.sim.attackingControls()??!0,et=tt?[{type:"pass",key:"P",label:"PASS"},{type:"loft",key:"L",label:"LOFT"},{type:"shoot",key:"S",label:"SHOOT"}]:[{type:"tackle",key:"T",label:"TACKLE"},{type:"switch",key:"S",label:"SWITCH"},{type:"slide",key:"D",label:"SLIDE"}],St=f&&!d&&I?.status==="ready",Mt=!f||!it||I?.phase==="goal"||!!I?.shotView&&I.shotView.phase!=="aim",me=d?"LOAD ERROR":f?I?.status==="playing"?I.shotView?{aim:"CHANCE",windup:"SHOOT",flight:"SHOT",parry:"SAVE",goal:"GOAL!"}[I.shotView.phase]:I.phase==="restart"?"KICK OFF":I.phase==="goal"?"GOAL!":"EXHIBITION":I?.status.toUpperCase():"LOADING",Xt=()=>{g(!1),I?.status==="paused"?s.current?.resume():s.current?.start()},te=()=>{s.current?.pause(),g(!0)},Y=()=>{s.current?.pause(),e.onExit?e.onExit():(s.current?.restart(),g(!1))};return(0,at.jsxs)("main",{ref:n,className:"handheld "+(p?"screen-only ":"")+(A?"reference-view ":"")+(S?"portrait-allowed ":"")+(St?"in-lobby":""),"data-render":o,children:[(0,at.jsx)("div",{className:"console-edge",children:(0,at.jsxs)("div",{className:"console-body",children:[(0,at.jsxs)("header",{className:"console-brand",children:[(0,at.jsxs)("span",{children:["POCKET",(0,at.jsx)("span",{className:"brand-sub",children:"SPORTS ARCADE"})]}),(0,at.jsx)("span",{className:"brand-game",children:"PITCHFLARE XI"}),(0,at.jsxs)("span",{className:"power-light",children:["POWER ",(0,at.jsx)("i",{})]})]}),(0,at.jsxs)("aside",{className:"left-grip","aria-label":"Directional controls",children:[(0,at.jsx)("span",{className:"grip-caption",children:"DIRECTION"}),(0,at.jsxs)("div",{className:"dpad","data-stick":!0,"aria-label":"Eight-way movement pad","aria-disabled":Mt,children:[["up","left","down","right"].map(k=>(0,at.jsx)("button",{className:"direction "+k,"data-hold":k,disabled:Mt,"data-pressed":I?.held[k]?"true":void 0,"aria-label":"Move "+k,children:{up:"\u25B2",left:"\u25C0",down:"\u25BC",right:"\u25B6"}[k]},k)),(0,at.jsx)("span",{className:"pad-centre"})]}),(0,at.jsxs)("div",{className:"speaker","aria-hidden":"true",children:[(0,at.jsx)("i",{}),(0,at.jsx)("i",{}),(0,at.jsx)("i",{}),(0,at.jsx)("i",{})]}),(0,at.jsx)("button",{className:"small-button",onClick:()=>y(k=>!k),"aria-pressed":p,children:"SCREEN +"}),(0,at.jsx)("span",{className:"control-help",children:"ARROW KEYS"})]}),(0,at.jsx)("section",{className:"screen-bezel","aria-label":"Game display",children:(0,at.jsxs)("div",{className:"glass",children:[(0,at.jsx)("canvas",{width:_i.width,height:_i.height,ref:i,"aria-label":"Retro Football live pitch"},c),(0,at.jsxs)("div",{className:"scoreboard","aria-label":"Match score and clock",children:[(0,at.jsxs)("span",{className:"team-name harbour",children:["HARBOUR ",(0,at.jsx)("b",{id:"home-score",children:I?.score[0]??0})]}),(0,at.jsxs)("span",{className:"clock-block",children:[(0,at.jsxs)("small",{children:["HALF ",I?.half??1]}),(0,at.jsxs)("b",{id:"clock",children:[Math.floor(q/60),":",String(q%60).padStart(2,"0")]})]}),(0,at.jsxs)("span",{className:"team-name orchard",children:[(0,at.jsx)("b",{id:"away-score",children:I?.score[1]??0})," ORCHARD"]})]}),(0,at.jsx)("span",{id:"state",className:"game-state",children:me}),I?.phase==="goal"&&(0,at.jsx)("div",{className:"goal-banner",children:"GOAL!"}),(0,at.jsxs)("div",{className:"radar",hidden:!!I?.shotView,"aria-label":"Pitch overview",children:[(0,at.jsx)("i",{className:"halfway"}),I?.players.map(k=>(0,at.jsx)("i",{className:"dot "+(k.team===0?"harbour":"orchard")+(k.id===I.selected?" selected":""),style:{left:k.x/105*100+"%",top:k.y/68*100+"%"}},k.id)),I&&(0,at.jsx)("i",{className:"radar-ball",style:{left:I.ball.x/105*100+"%",top:I.ball.y/68*100+"%"}})]}),(0,at.jsx)("p",{className:"match-message",id:"message",role:"status",children:d||I?.message||"Loading the stadium\u2026"}),(!f||d||I?.status!=="playing")&&!St&&!b&&(0,at.jsx)("div",{className:"game-overlay",children:(0,at.jsxs)("section",{className:"title-card",children:[(0,at.jsx)("span",{className:"cartridge-label",children:"ARCADE FOOTBALL"}),(0,at.jsx)("h1",{children:I?.status==="complete"?"FULL TIME":I?.status==="halftime"?"HALF TIME":I?.status==="paused"?"PAUSED":"PITCHFLARE XI"}),(0,at.jsx)("p",{children:d||(f?I?.status==="complete"?`${I.score[0]} : ${I.score[1]} \xB7 ${I.score[0]===I.score[1]?"DRAW":I.score[0]>I.score[1]?"HARBOUR WINS":"ORCHARD WINS"}`:I?.status==="halftime"?"Switch ends. One more half.":"HARBOUR ATHLETIC \xD7 ORCHARD UNITED":"Loading your cartridge\u2026")}),d?(0,at.jsx)("button",{id:"retry",className:"primary",onClick:G,children:"RETRY CARTRIDGE"}):I?.status==="complete"?(0,at.jsx)("button",{id:"restart",className:"primary",onClick:()=>{s.current?.restart(),s.current?.start()},children:"REMATCH"}):(0,at.jsx)("button",{id:"start",className:"primary",disabled:!f,onClick:Xt,children:I?.status==="paused"?"RESUME MATCH":I?.status==="halftime"?"SECOND HALF":"KICK OFF"}),(0,at.jsx)("small",{children:"11 V 11 \xB7 TWO 90-SECOND HALVES"})]})})]})}),(0,at.jsxs)("aside",{className:"right-grip","aria-label":"Action controls",children:[(0,at.jsx)("span",{className:"grip-caption",children:"THREE BUTTON PLAY"}),(0,at.jsx)("div",{className:"action-cluster",children:et.map(({type:k,key:ot,label:Rt},st)=>(0,at.jsxs)("button",{className:"action action-"+["A","B","C"][st],id:["A","B","C"][st],"data-action":k,disabled:Mt||!!I?.shotView&&k!=="shoot","aria-label":Rt+" ("+ot+")",onClick:Pt=>{Pt.detail===0&&s.current?.dispatch({type:k})},children:[(0,at.jsx)("b",{children:ot}),(0,at.jsx)("small",{children:Rt})]},st))}),(0,at.jsx)("span",{className:"control-help",children:tt?"P / L / S":"T / S / D"}),(0,at.jsx)("button",{ref:X,className:"small-button",id:"menu",onClick:te,children:"MENU"})]}),St&&(0,at.jsx)(l1,{atlasUrl:O,onStart:Xt,onMenu:te}),(0,at.jsxs)("footer",{className:"console-footer",children:[(0,at.jsx)("button",{className:"utility",id:"pause",disabled:!f||!["playing","paused"].includes(I?.status||""),onClick:()=>s.current?.dispatch({type:"pause"}),children:I?.status==="paused"?"RESUME":"PAUSE"}),(0,at.jsxs)("span",{className:"footer-status",children:[I?.half===2?"\u25C0":"\u25B6"," HARBOUR ATTACKS ",I?.half===2?"LEFT":"RIGHT"]}),(0,at.jsx)("button",{className:"utility",id:"fullscreen",onClick:()=>{J()},children:T?"WINDOW":"FULL SCREEN"}),(0,at.jsx)("button",{className:"utility",id:"exit",onClick:Y,children:"EXIT"})]})]})}),C&&(0,at.jsx)("p",{className:"screen-hint",role:"status",children:C}),(0,at.jsxs)("div",{className:"portrait-guide",children:[(0,at.jsx)("span",{className:"rotate-device","aria-hidden":"true",children:"\u21BB"}),(0,at.jsx)("h2",{children:"TURN TO LANDSCAPE"}),(0,at.jsx)("p",{children:"Your handheld fills the wide screen."}),(0,at.jsx)("button",{className:"primary",onClick:()=>{J()},children:"ENTER FULL SCREEN"}),(0,at.jsx)("button",{className:"utility",onClick:()=>v(!0),children:"CONTINUE IN PORTRAIT"})]}),b&&(0,at.jsx)("div",{className:"menu-backdrop",children:(0,at.jsxs)("div",{ref:U,className:"settings-panel",role:"dialog","aria-modal":"true","aria-labelledby":"menu-title",children:[(0,at.jsx)("span",{className:"cartridge-label",children:"POCKET ARCADE"}),(0,at.jsx)("h2",{id:"menu-title",children:St?"LOBBY SETTINGS":"MATCH MENU"}),(0,at.jsx)("button",{className:"primary",onClick:()=>{g(!1),I?.status==="paused"&&s.current?.resume()},children:St?"BACK TO LOBBY":"BACK TO GAME"}),(0,at.jsx)("div",{className:"audio-settings",children:["music","sfx"].map(k=>(0,at.jsxs)("label",{children:[k==="music"?"Music":"Sound effects",(0,at.jsx)("input",{"aria-label":k==="music"?"Music volume":"Sound effects volume",type:"range",min:"0",max:"1",step:".05",value:a?.settings[k]??.4,onChange:ot=>{s.current?.audio.unlock(),s.current?.setSettings({[k]:Number(ot.currentTarget.value)}),l(Rt=>Rt+1)}})]},k))}),(0,at.jsxs)("button",{id:"framing",className:"utility","aria-pressed":A,onClick:()=>R(k=>!k),children:["VIEW: ",A?"REFERENCE 320 \xD7 224":"WIDE HANDHELD"]}),(0,at.jsx)("p",{children:"Slide your thumb across the pad for eight-way movement. Keep steering while pressing A, B or C."}),(0,at.jsx)("p",{children:"Move / aim: arrow keys. Attack: P pass, L loft, S shoot. Defence: T tackle, S switch, D slide. S confirms a CHANCE shot."}),(0,at.jsx)("p",{className:"review-note",children:"Invented clubs. Source-derived reference art. Original sound. Local exhibition."}),!St&&(0,at.jsx)("button",{className:"utility",onClick:()=>{s.current?.restart(),g(!1)},children:"RESTART MATCH"}),(0,at.jsx)("button",{className:"utility",onClick:Y,children:"EXIT TO GAMES"})]})})]})}function ZR(e,t={},n=new URL("./assets.json",import.meta.url)){let i=(0,u1.createRoot)(e),s=!1;return i.render((0,at.jsx)(YR,{context:t,manifestUrl:n})),{definition:Di,dispose(){s||(s=!0,i.unmount())}}}var c1=document.getElementById("game");if(c1){let e=i1(),t=ZR(c1,e.context,new URL("./assets.json",import.meta.url));On.dispose=()=>{e.dispose(),t.dispose()}}export{ZR as mountFootball};
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
