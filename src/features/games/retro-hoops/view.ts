/** Presentation calibration from retained footage; not native engine recovery. */
export const VIEW={width:900,height:360,centerX:450,farY:164,nearY:330,farScale:.86,nearScale:1.10} as const;
export function depthScale(y:number){const t=Math.max(0,Math.min(1,(y-VIEW.farY)/(VIEW.nearY-VIEW.farY)));return VIEW.farScale+(VIEW.nearScale-VIEW.farScale)*t;}
export function courtPoint(x:number,y:number,z=0){const scale=depthScale(y);return {x:VIEW.centerX+(x-VIEW.centerX)*scale,y:y-z*scale,scale};}
export function cameraOrigin(s:{camera:number;ball:{y:number}},width:number){return Math.round(Math.max(0,Math.min(VIEW.width-width,courtPoint(s.camera+240,s.ball.y).x-width/2)));}
