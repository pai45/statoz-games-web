import * as THREE from 'three';

/** Explicit, sampled geometry inspection for browser regressions; never a frame-loop check. */
export function inspectAthleteBounds(scene:THREE.Object3D) {
  scene.updateMatrixWorld(true);
  const results:{detail:string;size:number[];maxCoordinate:number;finite:boolean;samples:number}[]=[];
  scene.traverse(root=>{
    if(!root.userData.authoredAthlete)return;
    const inverse=root.matrixWorld.clone().invert(),point=new THREE.Vector3(),bounds=new THREE.Box3();
    let finite=true,samples=0;
    root.traverse(object=>{
      const mesh=object as THREE.SkinnedMesh;if(!mesh.isSkinnedMesh)return;
      const count=mesh.geometry.getAttribute('position').count,stride=Math.max(1,Math.floor(count/384));
      for(let i=0;i<count;i+=stride){mesh.getVertexPosition(i,point);point.applyMatrix4(mesh.matrixWorld).applyMatrix4(inverse);finite&&=Number.isFinite(point.x)&&Number.isFinite(point.y)&&Number.isFinite(point.z);bounds.expandByPoint(point);samples++;}
    });
    results.push({detail:root.userData.authoredAthlete.detail,size:bounds.getSize(new THREE.Vector3()).toArray(),maxCoordinate:Math.max(...bounds.min.toArray().map(Math.abs),...bounds.max.toArray().map(Math.abs)),finite,samples});
  });
  return results;
}
