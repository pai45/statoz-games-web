import * as T from 'three';

const refined = new WeakMap<T.BufferGeometry, T.BufferGeometry>();
const coarse = new WeakMap<T.BufferGeometry, T.BufferGeometry>();
const key = (x: number, y: number, z: number) => `${x.toFixed(5)},${y.toFixed(5)},${z.toFixed(5)}`;
type Vertex = {p: T.Vector3; neighbors: Set<number>; boundary: Set<number>; strength: number};
type Edge = {a: number; b: number; opposite: number[]; p?: T.Vector3};

/** Far-camera body: the prepared rig, palette and continuous jersey, without extra subdivision. */
export function coarseBodyGeometry(source: T.BufferGeometry) {
  const cached = coarse.get(source); if (cached) return cached;
  const regions = source.getAttribute('_region'), count = source.index?.count ?? regions.count, keep: number[] = [];
  for (let i = 0; i < count; i += 3) {
    for (let j = 0; j < 3; j++) keep.push(source.index ? source.index.getX(i+j) : i+j);
  }
  const geometry = new T.BufferGeometry();
  for (const [name, attribute] of Object.entries(source.attributes)) {
    if (name === 'normal') continue;
    const values: number[] = [];
    for (const i of keep) for (let c = 0; c < attribute.itemSize; c++) values.push(attribute.getComponent(i, c));
    geometry.setAttribute(name, name === 'skinIndex' ? new T.Uint16BufferAttribute(values, attribute.itemSize) : new T.Float32BufferAttribute(values, attribute.itemSize));
  }
  smoothBody(geometry); geometry.computeBoundingBox(); geometry.computeBoundingSphere(); coarse.set(source, geometry);
  return geometry;
}

/** Weld normals across the source model's duplicated palette/UV seams, without welding its skin attributes. */
export function smoothBody(geometry: T.BufferGeometry) {
  if (geometry.userData.yorkerSmoothed) return;
  geometry.computeVertexNormals();
  const positions = geometry.getAttribute('position'), normals = geometry.getAttribute('normal');
  const sums = new Map<string, T.Vector3>();
  for (let i = 0; i < positions.count; i++) {
    const id = key(positions.getX(i), positions.getY(i), positions.getZ(i));
    const n = new T.Vector3().fromBufferAttribute(normals, i);
    if (sums.has(id)) sums.get(id)!.add(n);
    else sums.set(id, n);
  }
  for (const n of sums.values()) n.normalize();
  for (let i = 0; i < positions.count; i++) {
    const n = sums.get(key(positions.getX(i), positions.getY(i), positions.getZ(i)))!;
    normals.setXYZ(i, n.x, n.y, n.z);
  }
  geometry.userData.yorkerSmoothed = true;
}

/**
 * A single restrained Loop subdivision, shared by every player. Geometric seams are continuous, but each
 * triangle keeps its palette region and kit UVs. New vertices merge the four strongest skin influences,
 * rather than interpolating joint indices (which would attach elbows and fingers to unrelated bones).
 */
export function refineBodyGeometry(source: T.BufferGeometry): T.BufferGeometry {
  const cached = refined.get(source);
  if (cached) return cached;
  const position = source.getAttribute('position'), region = source.getAttribute('_region');
  const joints = source.getAttribute('skinIndex'), weights = source.getAttribute('skinWeight');
  const kituv = source.getAttribute('_kituv');
  const vertices: Vertex[] = [], weld = new Map<string, number>(), ids: number[] = [];
  for (let i = 0; i < position.count; i++) {
    const p = new T.Vector3().fromBufferAttribute(position, i), id = key(p.x, p.y, p.z);
    let index = weld.get(id);
    // Keep small fingers and boot soles crisp; round the larger anatomical and fabric surfaces.
    const r = Math.round(region.getX(i)), strength = r === 2 ? .18 : r >= 9 ? .28 : .62;
    if (index === undefined) {index = vertices.length; weld.set(id, index); vertices.push({p, neighbors: new Set(), boundary: new Set(), strength});}
    else vertices[index].strength = Math.min(vertices[index].strength, strength);
    ids.push(index);
  }
  const edges = new Map<string, Edge>();
  const edgeKey = (a: number, b: number) => a < b ? `${a}:${b}` : `${b}:${a}`;
  const count = source.index?.count ?? position.count;
  const at = (i: number) => source.index ? source.index.getX(i) : i;
  for (let i = 0; i < count; i += 3) {
    const face = [ids[at(i)], ids[at(i + 1)], ids[at(i + 2)]];
    for (let side = 0; side < 3; side++) {
      const a = face[side], b = face[(side + 1) % 3], opposite = face[(side + 2) % 3];
      if (a === b) continue;
      vertices[a].neighbors.add(b); vertices[b].neighbors.add(a);
      const id = edgeKey(a, b), existing = edges.get(id);
      if (existing) existing.opposite.push(opposite);
      else edges.set(id, {a, b, opposite: [opposite]});
    }
  }
  for (const edge of edges.values()) {
    const {a, b, opposite} = edge, pa = vertices[a].p, pb = vertices[b].p;
    const midpoint = pa.clone().add(pb).multiplyScalar(.5);
    if (opposite.length === 2) {
      const rounded = pa.clone().add(pb).multiplyScalar(.375)
        .addScaledVector(vertices[opposite[0]].p, .125).addScaledVector(vertices[opposite[1]].p, .125);
      midpoint.lerp(rounded, Math.min(vertices[a].strength, vertices[b].strength));
    } else if (opposite.length === 1) {
      vertices[a].boundary.add(b); vertices[b].boundary.add(a);
    }
    edge.p = midpoint;
  }
  const rounded = vertices.map(vertex => {
    const {p, neighbors, boundary, strength} = vertex, next = p.clone();
    if (boundary.size === 2) {
      next.multiplyScalar(.75);
      for (const n of boundary) next.addScaledVector(vertices[n].p, .125);
    } else if (!boundary.size && neighbors.size >= 3) {
      const beta = neighbors.size === 3 ? 3 / 16 : 3 / (8 * neighbors.size);
      next.multiplyScalar(1 - beta * neighbors.size);
      for (const n of neighbors) next.addScaledVector(vertices[n].p, beta);
    }
    return p.clone().lerp(next, strength);
  });
  const positions: number[] = [], skinIndices: number[] = [], skinWeights: number[] = [];
  const regions: number[] = [], uvs: number[] = [];
  const append = (a: number, b = a) => {
    const p = a === b ? rounded[ids[a]] : edges.get(edgeKey(ids[a], ids[b]))?.p ?? vertices[ids[a]].p;
    positions.push(p.x, p.y, p.z);
    regions.push(region.getX(a));
    if (a === b) {
      for (let c = 0; c < 4; c++) {skinIndices.push(joints.getComponent(a, c)); skinWeights.push(weights.getComponent(a, c));}
    } else {
      const influences = new Map<number, number>();
      for (const vertex of [a, b]) for (let c = 0; c < 4; c++) {
        const joint = joints.getComponent(vertex, c);
        influences.set(joint, (influences.get(joint) ?? 0) + weights.getComponent(vertex, c) * .5);
      }
      const top = [...influences].sort((a, b) => b[1] - a[1] || a[0] - b[0]).slice(0, 4);
      const total = top.reduce((sum, [, weight]) => sum + weight, 0) || 1;
      for (let c = 0; c < 4; c++) {skinIndices.push(top[c]?.[0] ?? 0); skinWeights.push((top[c]?.[1] ?? 0) / total);}
    }
    // Invalid UVs are a deliberate sentinel: no numbers on sleeves, hair, or the shirt front.
    if (kituv.getX(a) < -1 || kituv.getX(b) < -1) uvs.push(-4, -4);
    else uvs.push((kituv.getX(a) + kituv.getX(b)) * .5, (kituv.getY(a) + kituv.getY(b)) * .5);
  };
  for (let i = 0; i < count; i += 3) {
    const a = at(i), b = at(i + 1), c = at(i + 2);
    append(a); append(a, b); append(c, a);
    append(a, b); append(b); append(b, c);
    append(c, a); append(b, c); append(c);
    append(a, b); append(b, c); append(c, a);
  }
  const geometry = new T.BufferGeometry();
  geometry.setAttribute('position', new T.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('skinIndex', new T.Uint16BufferAttribute(skinIndices, 4));
  geometry.setAttribute('skinWeight', new T.Float32BufferAttribute(skinWeights, 4));
  geometry.setAttribute('_region', new T.Float32BufferAttribute(regions, 1));
  geometry.setAttribute('_kituv', new T.Float32BufferAttribute(uvs, 2));
  geometry.userData.yorkerRefined = true;
  smoothBody(geometry); geometry.computeBoundingBox(); geometry.computeBoundingSphere();
  refined.set(source, geometry);
  return geometry;
}
