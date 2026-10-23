// Portrait presentation fits the court width, keeping the shooter and basket in view.
// This changes only the camera; contest rules, athlete positions and shot physics stay upstream.
export function portraitContestCamera(rig,dt,world,court){
 if(rig.camera.aspect>=.85)return false;
 const settle=(from,to,rate=5)=>from+(to-from)*(1-Math.exp(-rate*dt));
 let x,y,z,fx,fy,fz,fov;
 if(world.state==='player-count'){
  x=0;y=3.8;z=7+3.7/(Math.tan(21*Math.PI/180)*rig.camera.aspect);fx=0;fy=.5;fz=7;fov=42;
 }else{
  if(!world.offense)return false;
  // Stay inside the side fences. Preserve a useful horizontal field of view
  // instead of cropping the original landscape camera to a narrow phone.
  x=0;y=10.5;z=18.5;fx=0;fy=1.1;fz=(court.halfCourtZ+court.rimCenter.z)*.42;
  fov=2*Math.atan(Math.tan(24*Math.PI/180)/rig.camera.aspect)*180/Math.PI;
 }
 rig.pos.x=settle(rig.pos.x,x);rig.pos.y=settle(rig.pos.y,y);rig.pos.z=settle(rig.pos.z,z);
 rig.focus.x=settle(rig.focus.x,fx);rig.focus.y=settle(rig.focus.y,fy);rig.focus.z=settle(rig.focus.z,fz);rig.fov=settle(rig.fov,fov);
 rig.commit(dt,false);return true;
}
