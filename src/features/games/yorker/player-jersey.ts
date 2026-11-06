import * as T from 'three';

const prepared = new WeakMap<T.BufferGeometry, T.BufferGeometry>();
const V = (x = 0, y = 0, z = 0) => new T.Vector3(x, y, z);
const clamp = (x: number) => Math.max(0, Math.min(1, x));
type Influence = [number, number];

/**
 * Original continuous jersey in the source rig's bind space. The inherited shirt was assembled from
 * disconnected palette patches; a fitted, weighted torso and overlapping sleeves replace those patches.
 * Arms, hands, trousers, footwear, the skeleton and all animation remain on the credited source body.
 */
export function playerBodyGeometry(body: T.SkinnedMesh) {
  const source = body.geometry, cached = prepared.get(source); if (cached) return cached;
  const skeleton = body.skeleton, inverseBind = body.bindMatrix.clone().invert();
  const joint = (name: string) => {
    const i = skeleton.bones.findIndex(bone => bone.name.replace(/_\d+$/, '') === name);
    if (i < 0) throw Error('Jersey rig is missing '+name);
    // bindMatrixInverse on an attached SkinnedMesh changes with matrixWorld; invert the fixed bind matrix instead.
    return {i, p: V().setFromMatrixPosition(skeleton.boneInverses[i].clone().invert()).applyMatrix4(inverseBind)};
  };
  const hips = joint('Hips'), spine = joint('Spine'), spine1 = joint('Spine1'), spine2 = joint('Spine2'), neck = joint('Neck');
  const positions: number[] = [], skinIndices: number[] = [], skinWeights: number[] = [], regions: number[] = [], kituv: number[] = [], indices: number[] = [];
  const vertex = (p: T.Vector3, influences: Influence[], part: number, back = false) => {
    positions.push(p.x, p.y, p.z); regions.push(part);
    const combined = new Map<number, number>();
    for (const [bone, weight] of influences) combined.set(bone, (combined.get(bone) ?? 0)+weight);
    const top = [...combined].sort((a, b) => b[1]-a[1]).slice(0, 4), total = top.reduce((sum, [, weight]) => sum+weight, 0) || 1;
    for (let i = 0; i < 4; i++) {skinIndices.push(top[i]?.[0] ?? 0); skinWeights.push((top[i]?.[1] ?? 0)/total);}
    if (back && part === 5 && p.y > hips.p.y+.15) kituv.push((p.x-hips.p.x)/.34+.5, (p.y-1.18)/.45);
    else kituv.push(-4, -4);
    return positions.length/3-1;
  };
  const stations = [hips, spine, spine1, spine2];
  const torsoWeights = (y: number): Influence[] => {
    if (y <= hips.p.y) return [[hips.i, 1]];
    for (let i = 1; i < stations.length; i++) if (y <= stations[i].p.y) {
      const a = stations[i-1], b = stations[i], t = clamp((y-a.p.y)/(b.p.y-a.p.y));
      return [[a.i, 1-t], [b.i, t]];
    }
    return [[spine2.i, 1]];
  };
  const rings = [
    [hips.p.y-.04, .22, .178], [hips.p.y+.06, .204, .169],
    [spine.p.y, .195, .151], [spine1.p.y, .213, .156],
    [spine2.p.y, .238, .163], [neck.p.y-.09, .241, .146],
    [neck.p.y-.025, .126, .082], [neck.p.y+.002, .079, .064],
  ];
  const sides = 36, rows = 20;
  for (let row = 0; row <= rows; row++) {
    const y = rings[0][0]+(rings.at(-1)![0]-rings[0][0])*row/rows;
    let r = 0; while (r < rings.length-2 && y > rings[r+1][0]) r++;
    const a = rings[r], b = rings[r+1], t = clamp((y-a[0])/(b[0]-a[0]));
    const radiusX = a[1]+(b[1]-a[1])*t, radiusZ = a[2]+(b[2]-a[2])*t;
    const centerZ = hips.p.z+(neck.p.z-hips.p.z)*clamp((y-hips.p.y)/(neck.p.y-hips.p.y));
    for (let col = 0; col <= sides; col++) {
      const angle = col/sides*Math.PI*2, x = Math.sin(angle)*radiusX;
      // Subtle, rounded fabric folds, not projecting triangular scraps.
      const fold = 1+.012*Math.sin(angle*9+y*24)*(1-clamp((y-spine2.p.y)/.15));
      const p = V(hips.p.x+x*fold, y, centerZ+Math.cos(angle)*radiusZ*fold);
      vertex(p, torsoWeights(y), 5, Math.cos(angle) < -.5);
    }
  }
  for (let row = 0; row < rows; row++) for (let col = 0; col < sides; col++) {
    const a = row*(sides+1)+col, b = a+sides+1; indices.push(a, a+1, b, a+1, b+1, b);
  }
  for (const side of ['Left', 'Right']) {
    const shoulder = joint(side+'Shoulder'), arm = joint(side+'Arm'), elbow = joint(side+'ForeArm');
    const axis = elbow.p.clone().sub(arm.p).normalize(), up = V(0, 1, 0); up.addScaledVector(axis, -up.dot(axis)).normalize();
    const across = axis.clone().cross(up).normalize(), first = positions.length/3;
    const sleeveRows = 7, sleeveSides = 24, length = arm.p.distanceTo(elbow.p)*.73+.085;
    for (let row = 0; row <= sleeveRows; row++) {
      const t = row/sleeveRows, center = arm.p.clone().addScaledVector(axis, -.085+length*t);
      const radius = .079-(.079-.073)*t;
      const armWeight = .48+.52*clamp(t*2), shoulderWeight = (1-armWeight)*.6;
      for (let col = 0; col <= sleeveSides; col++) {
        const a = col/sleeveSides*Math.PI*2;
        const p = center.clone().addScaledVector(up, Math.cos(a)*radius).addScaledVector(across, Math.sin(a)*radius);
        vertex(p, [[arm.i, armWeight], [shoulder.i, shoulderWeight], [spine2.i, 1-armWeight-shoulderWeight]], 7);
      }
    }
    for (let row = 0; row < sleeveRows; row++) for (let col = 0; col < sleeveSides; col++) {
      const a = first+row*(sleeveSides+1)+col, b = a+sleeveSides+1; indices.push(a, a+1, b, a+1, b+1, b);
    }
    const center = vertex(arm.p.clone().addScaledVector(axis, -.085), [[spine2.i, .5], [arm.i, .25], [shoulder.i, .25]], 7);
    for (let col = 0; col < sleeveSides; col++) indices.push(center, first+col+1, first+col);
  }
  const jersey = new T.BufferGeometry();
  jersey.setAttribute('position', new T.Float32BufferAttribute(positions, 3));
  jersey.setAttribute('skinIndex', new T.Uint16BufferAttribute(skinIndices, 4));
  jersey.setAttribute('skinWeight', new T.Float32BufferAttribute(skinWeights, 4));
  jersey.setAttribute('_region', new T.Float32BufferAttribute(regions, 1));
  jersey.setAttribute('_kituv', new T.Float32BufferAttribute(kituv, 2));
  jersey.setIndex(indices);
  const unindexed = jersey.toNonIndexed(), keep: number[] = [], sourceRegions = source.getAttribute('_region');
  const sourceCount = source.index?.count ?? sourceRegions.count;
  for (let i = 0; i < sourceCount; i += 3) {
    const first = source.index ? source.index.getX(i) : i, region = sourceRegions.getX(first);
    if ([0, 3, 4, 5, 6, 7].includes(region)) continue;
    for (let j = 0; j < 3; j++) keep.push(source.index ? source.index.getX(i+j) : i+j);
  }
  const clean = new T.BufferGeometry();
  for (const name of ['position', 'skinIndex', 'skinWeight', '_region', '_kituv']) {
    const old = source.getAttribute(name), fresh = unindexed.getAttribute(name), values: number[] = [];
    for (const i of keep) for (let c = 0; c < old.itemSize; c++) values.push(old.getComponent(i, c));
    for (let i = 0; i < fresh.count; i++) for (let c = 0; c < fresh.itemSize; c++) values.push(fresh.getComponent(i, c));
    clean.setAttribute(name, name === 'skinIndex' ? new T.Uint16BufferAttribute(values, old.itemSize) : new T.Float32BufferAttribute(values, old.itemSize));
  }
  clean.userData.yorkerTailored = true; prepared.set(source, clean);
  jersey.dispose(); unindexed.dispose();
  return clean;
}
