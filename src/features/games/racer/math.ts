export const TAU=Math.PI*2;
export const clamp=(n:number,a:number,b:number)=>Math.max(a,Math.min(b,n));
export const wrap=(n:number,m:number)=>(n%m+m)%m;
export const angle=(n:number)=>wrap(n+Math.PI,TAU)-Math.PI;
export const angleLerp=(a:number,b:number,t:number)=>a+angle(b-a)*t;
export const damp=(a:number,b:number,rate:number,dt:number)=>a+(b-a)*(1-Math.exp(-rate*dt));
