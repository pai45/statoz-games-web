/** Crazy Grand Prix shipped tuning, recovered from the source-bound RCC records.
 * See docs/racer/crazy-grand-prix-mechanics.md for byte identities and adaptations.
 * The browser simulation uses arcade distance/speed scaling, not Unity wheel physics.
 */
export const REFERENCE={
 maxKph:380,playerTorque:700,aiTorque:650,idleRpm:4500,peakRpm:11000,maxRpm:16000,
 upshiftRpm:13000,downshiftRpm:9000,brakeTorque:5000,finalDrive:5,
 steerLow:17.5,steerHigh:7.5,abs:true,tcs:true,nos:false,turbo:false,
 gears:[
  {ratio:4.6,maxKph:47,upKph:35},{ratio:2.5,maxKph:95,upKph:71},
  {ratio:1.86,maxKph:142,upKph:107},{ratio:1.43,maxKph:190,upKph:143},
  {ratio:1.23,maxKph:237,upKph:179},{ratio:1.05,maxKph:285,upKph:215},
  {ratio:.9,maxKph:332,upKph:251},{ratio:.72,maxKph:380,upKph:287},
 ],
} as const;
export const ROAD_TOP_SPEED=49, SPEED_SCALE=ROAD_TOP_SPEED/(REFERENCE.maxKph/3.6);
const clamp=(n:number,a:number,b:number)=>Math.max(a,Math.min(b,n));
/** Hysteresis keeps a held speed from repeatedly shifting up and down. */
export function transmission(speed:number,gear:number){
 const kph=Math.abs(speed)*3.6/SPEED_SCALE;let next=clamp(gear,1,8);
 while(next<8&&kph>REFERENCE.gears[next-1].upKph)next++;
 while(next>1&&kph<REFERENCE.gears[next-2].upKph*.76)next--;
 const rpm=clamp(kph/REFERENCE.gears[next-1].maxKph*REFERENCE.maxRpm,REFERENCE.idleRpm,REFERENCE.maxRpm);
 return{gear:next,rpm};
}
/** Shipped torque-curve key values. Interpolation here is an authored linear adapter. */
export function torqueAtRpm(rpm:number){
 const r=clamp(rpm,REFERENCE.idleRpm,REFERENCE.maxRpm);
 return r<=REFERENCE.peakRpm?350+(r-4500)/6500*350:700-(r-11000)/5000*(700-466.6666565);
}
/** Speed-sensitive steering follows the two shipped curve endpoints (zero tangents). */
export function steeringAuthority(speed:number){
 const t=clamp(Math.abs(speed)/ROAD_TOP_SPEED,0,1),smooth=t*t*(3-2*t);
 return(REFERENCE.steerLow+(REFERENCE.steerHigh-REFERENCE.steerLow)*smooth)/REFERENCE.steerLow;
}
