import * as T from 'three';
import type {Kit} from './character';
import type {PlayerSurfaces} from './player-materials';

const V = (x = 0, y = 0, z = 0) => new T.Vector3(x, y, z);
const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
function closeNormalSeam(geometry: T.BufferGeometry, sides: number, rows: number) {
  geometry.computeVertexNormals();
  const normals = geometry.getAttribute('normal');
  for (let row = 0; row <= rows; row++) {
    const a = row*(sides+1), b = a+sides;
    const n = V().fromBufferAttribute(normals, a).add(V().fromBufferAttribute(normals, b)).normalize();
    normals.setXYZ(a, n.x, n.y, n.z); normals.setXYZ(b, n.x, n.y, n.z);
  }
}
// Anatomical cross-sections: chin, jaw, cheeks, eye line, forehead and crown. Units are relative to the skull bone.
const RINGS = [
  [0, .12, .14, .2], [.09, .25, .23, .28], [.23, .34, .32, .32],
  [.43, .405, .42, .345], [.61, .421, .5, .325], [.76, .42, .54, .305],
  [.91, .405, .55, .31], [1.04, .365, .5, .275], [1.16, .28, .38, .2],
  [1.245, .145, .2, .11], [1.28, .002, .002, .002],
] as const;
function section(y: number, profile: number) {
  let i = 0; while (i < RINGS.length-2 && y > RINGS[i+1][0]) i++;
  const a = RINGS[i], b = RINGS[i+1], previous = RINGS[Math.max(0, i-1)], next = RINGS[Math.min(RINGS.length-1, i+2)];
  const span = b[0]-a[0], t = clamp((y-a[0])/span), t2 = t*t, t3 = t2*t;
  const interpolate = (axis: 1 | 2 | 3) => {
    const m0 = (b[axis]-previous[axis])/(b[0]-previous[0]), m1 = (next[axis]-a[axis])/(next[0]-a[0]);
    return Math.max(.001, (2*t3-3*t2+1)*a[axis]+(t3-2*t2+t)*span*m0+(-2*t3+3*t2)*b[axis]+(t3-t2)*span*m1);
  };
  return {width: interpolate(1)*(1+(profile%3-1)*.035), back: interpolate(2), front: interpolate(3)};
}
/** A continuous face surface; small Gaussian forms add the nasal bridge, cheekbones and eye sockets. */
export function headSurface(x: number, y: number, profile = 0) {
  const s = section(y, profile), edge = clamp(Math.abs(x)/Math.max(.001, s.width));
  let z = s.front*Math.pow(Math.max(0, 1-edge*edge), .3);
  const gauss = (cx: number, cy: number, sx: number, sy: number) => Math.exp(-(((x-cx)/sx)**2)-(((y-cy)/sy)**2));
  z += .055*gauss(0, .67, .055, .19) + .133*gauss(0, .505, .07, .082);
  z += .022*gauss(-.235, .52, .105, .15) + .022*gauss(.235, .52, .105, .15);
  z -= .025*gauss(-.18, .747, .093, .06) + .025*gauss(.18, .747, .093, .06);
  z += .014*gauss(-.18, .835, .12, .04) + .014*gauss(.18, .835, .12, .04);
  return z;
}

/** Original head topology, independent of the licensed body mesh; smooth, bounded and cheap enough for a full cast. */
export function createHeadGeometry(profile = 0, detailed = true) {
  const positions: number[] = [], uvs: number[] = [], indices: number[] = [];
  const sides = detailed ? 56 : 28, rows = detailed ? 42 : 22;
  for (let row = 0; row <= rows; row++) {
    const y = row/rows*1.28, s = section(y, profile);
    for (let col = 0; col <= sides; col++) {
      const a = col/sides*Math.PI*2, x = Math.sin(a)*s.width, front = Math.cos(a);
      const z = front >= 0 ? headSurface(x, y, profile) : front*s.back;
      positions.push(x, y, z); uvs.push(col/sides, row/rows);
    }
  }
  for (let row = 0; row < rows; row++) for (let col = 0; col < sides; col++) {
    const a = row*(sides+1)+col, b = a+sides+1;
    indices.push(a, a+1, b, a+1, b+1, b);
  }
  const geometry = new T.BufferGeometry();
  geometry.setAttribute('position', new T.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new T.Float32BufferAttribute(uvs, 2)); geometry.setIndex(indices);
  closeNormalSeam(geometry, sides, rows); geometry.computeBoundingBox(); geometry.userData.yorkerHead = true;
  return geometry;
}

function hairGeometry(profile: number, beard = false, detailed = true) {
  const positions: number[] = [], uvs: number[] = [], indices: number[] = [];
  const sides = detailed ? 56 : 28, rows = beard ? (detailed ? 14 : 8) : (detailed ? 22 : 12);
  for (let row = 0; row <= rows; row++) for (let col = 0; col <= sides; col++) {
    const a = col/sides*Math.PI*2, front = Math.cos(a), t = row/rows;
    const line = front > 0 ? .975 + .065*Math.cos(a*2) : .66 + .17*(1+front);
    const beardTop = .3+.22*Math.pow(Math.abs(Math.sin(a)), .7);
    const y = beard ? .015+t*beardTop : line+(1.28-line)*t;
    const s = section(y, profile), x = Math.sin(a)*(s.width+(beard ? .003 : .009));
    let z = front >= 0 ? headSurface(x, y, profile) : front*s.back;
    z += front*(beard ? .004 : .012);
    const lift = beard ? 0 : Math.pow(t, 4)*(profile%3 === 1 ? .04 : .014);
    positions.push(x, y+lift, z); uvs.push(col/sides, t);
  }
  for (let row = 0; row < rows; row++) for (let col = 0; col < sides; col++) {
    const a = row*(sides+1)+col, b = a+sides+1; indices.push(a, a+1, b, a+1, b+1, b);
  }
  const geometry = new T.BufferGeometry(); geometry.setAttribute('position', new T.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new T.Float32BufferAttribute(uvs, 2)); geometry.setIndex(indices); closeNormalSeam(geometry, sides, rows);
  return geometry;
}

export function createPlayerHead(kit: Kit, surfaces: PlayerSurfaces, profile: number, detailed = true) {
  const group = new T.Group(), skinColor = new T.Color(kit.skin);
  const skin = new T.MeshPhysicalMaterial({color: skinColor, roughness: .62, metalness: 0, bumpMap: surfaces.fabric, bumpScale: .00035, sheen: .07, sheenRoughness: .9});
  skin.onBeforeCompile = shader => {
    shader.vertexShader = 'varying vec3 vFacePoint;\n'+shader.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\nvFacePoint=position;');
    shader.fragmentShader = 'varying vec3 vFacePoint;\n'+shader.fragmentShader.replace('#include <map_fragment>', `#include <map_fragment>
      float cheek=exp(-pow((abs(vFacePoint.x)-.23)/.14,2.)-pow((vFacePoint.y-.49)/.15,2.))*step(.1,vFacePoint.z);
      diffuseColor.rgb*=mix(vec3(.91),vec3(1.),smoothstep(.02,.27,vFacePoint.y));
      diffuseColor.rgb=mix(diffuseColor.rgb,diffuseColor.rgb*vec3(1.07,.965,.94),cheek*.4);`);
  };
  skin.customProgramCacheKey = () => 'yorker-anatomical-skin-v1';
  group.add(new T.Mesh(createHeadGeometry(profile, detailed), skin));
  const sphere = (material: T.Material, p: T.Vector3, scale: T.Vector3) => {
    const mesh = new T.Mesh(new T.SphereGeometry(1, detailed ? 20 : 10, detailed ? 12 : 7), material); mesh.position.copy(p); mesh.scale.copy(scale); group.add(mesh); return mesh;
  };
  const tube = (points: T.Vector3[], radius: number, material: T.Material) => {
    group.add(new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(points), detailed ? 18 : 8, radius, detailed ? 6 : 4, false), material));
  };
  const crease = new T.MeshStandardMaterial({color: skinColor.clone().multiplyScalar(.56), roughness: .85});
  const lid = new T.MeshStandardMaterial({color: skinColor.clone().multiplyScalar(.86), roughness: .78});
  const whites = new T.MeshPhysicalMaterial({color: '#c6c6ba', roughness: .4, clearcoat: .25});
  const iris = new T.MeshStandardMaterial({color: profile%4 === 1 ? '#52605b' : '#47382d', roughness: .5});
  const pupil = new T.MeshStandardMaterial({color: '#111719', roughness: .4});
  const hair = new T.MeshStandardMaterial({color: kit.hair, roughness: .92, bumpMap: surfaces.fabric, bumpScale: .0012});
  hair.onBeforeCompile = shader => {
    shader.vertexShader = 'varying vec3 vHairPoint;\n'+shader.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\nvHairPoint=position;');
    shader.fragmentShader = 'varying vec3 vHairPoint;\n'+shader.fragmentShader.replace('#include <map_fragment>', `#include <map_fragment>
      float strands=sin(vHairPoint.x*310.+vHairPoint.z*170.+sin(vHairPoint.y*16.)*.8);
      diffuseColor.rgb*=.95+strands*.045;
    `);
  };
  hair.customProgramCacheKey = () => 'yorker-hair-strands-v1';
  const lip = new T.MeshStandardMaterial({color: skinColor.clone().lerp(new T.Color('#965b52'), .28).multiplyScalar(.78), roughness: .74});
  for (const material of [crease, lid, whites, iris, pupil, lip]) material.userData.yorkerNoShadow = true;
  // Ears, lobes and a tapered neck soften the silhouette without inflating the skull or helmet.
  for (const sign of [-1, 1]) {
    sphere(skin, V(sign*.421, .62, -.015), V(.062, .125, .048));
    sphere(crease, V(sign*.448, .63, .022), V(.023, .075, .01));
    sphere(skin, V(sign*.43, .534, .008), V(.04, .04, .038));
  }
  const neck = new T.Mesh(new T.CylinderGeometry(.22, .255, .3, detailed ? 28 : 16), skin); neck.position.set(0, -.085, -.035); group.add(neck);
  const eyeY = .747;
  for (const sign of [-1, 1]) {
    const x = sign*.181, z = headSurface(x, eyeY, profile);
    sphere(crease, V(x, eyeY, z+.002), V(.083, .035, .025));
    sphere(whites, V(x, eyeY, z+.013), V(.071, .025, .024));
    sphere(iris, V(x, eyeY, z+.036), V(.023, .023, .005));
    sphere(pupil, V(x, eyeY, z+.0405), V(.011, .017, .002));
    const points = [-1, -.5, 0, .5, 1].map(t => V(x+t*.076, eyeY+.022*Math.sqrt(1-t*t), headSurface(x+t*.076, eyeY, profile)+.02));
    tube(points, .009, lid);
    const browY = .838;
    tube([-1, -.5, 0, .5, 1].map(t => V(x+t*.088, browY+.012*(1-t*t)-sign*t*.012, headSurface(x+t*.088, browY, profile)+.009)), .009, hair);
    sphere(crease, V(sign*.052, .455, headSurface(sign*.052, .455, profile)+.003), V(.019, .011, .004));
  }
  const mouthY = .288;
  tube([-1, -.5, 0, .5, 1].map(t => V(t*.123, mouthY+.007*Math.cos(t*Math.PI), headSurface(t*.123, mouthY, profile)+.009)), .0065, lip);
  tube([-1, -.5, 0, .5, 1].map(t => V(t*.106, mouthY-.019*(1-t*t), headSurface(t*.106, mouthY-.012, profile)+.006)), .0045, lid);
  group.add(new T.Mesh(hairGeometry(profile, false, detailed), hair));
  if (kit.beard) {
    const beard = new T.MeshStandardMaterial({color: new T.Color(kit.hair).lerp(skinColor, .27), roughness: .96, bumpMap: surfaces.fabric, bumpScale: .001});
    beard.onBeforeCompile = shader => {
      shader.uniforms.uSkin = {value: skinColor};
      shader.vertexShader = 'varying float vBeardT;\n'+shader.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\nvBeardT=uv.y;');
      shader.fragmentShader = 'uniform vec3 uSkin; varying float vBeardT;\n'+shader.fragmentShader.replace('#include <map_fragment>', '#include <map_fragment>\ndiffuseColor.rgb=mix(uSkin,diffuseColor.rgb,1.-smoothstep(.72,1.,vBeardT));');
    };
    beard.customProgramCacheKey = () => 'yorker-beard-fade-v1';
    group.add(new T.Mesh(hairGeometry(profile, true, detailed), beard));
  }
  return {group, radius: .455, hatLine: 1.035};
}
