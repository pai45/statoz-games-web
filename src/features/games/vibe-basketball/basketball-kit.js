import * as THREE from 'three';

const profile = [
  [1.055, .185, .145, -.140], [1.14, .181, .137, -.131],
  [1.22, .181, .140, -.121], [1.30, .191, .148, -.132],
  [1.36, .211, .153, -.169], [1.42, .222, .149, -.177],
  [1.49, .207, .110, -.155], [1.54, .190, .075, -.128],
];
const blend = (a, b, t) => a + (b - a) * t;
const smooth = x => { const t = THREE.MathUtils.clamp(x, 0, 1); return t * t * (3 - 2 * t); };

function section(y) {
  for (let i = 1; i < profile.length; i++) {
    if (y > profile[i][0]) continue;
    const a = profile[i - 1], b = profile[i], t = THREE.MathUtils.clamp((y - a[0]) / (b[0] - a[0]), 0, 1);
    return [blend(a[1], b[1], t), blend(a[2], b[2], t), blend(a[3], b[3], t)];
  }
  return profile.at(-1).slice(1);
}
function top(u, back) {
  const x = Math.abs(u);
  if (x < .38) return blend(back ? 1.482 : 1.438, 1.51, (x / .38) ** 2);
  if (x < .77) return 1.51 + Math.sin((x - .38) / .39 * Math.PI) * .007;
  return blend(1.51, 1.365, smooth((x - .77) / .23));
}
function point(u, y, back) {
  const [rx, front, rear] = section(y);
  // A tank drapes across the chest rather than following a skin-tight ellipse.
  return [u * rx, y, (back ? rear : front) * Math.sqrt(Math.max(0, 1 - u ** 4))];
}

const maskedBodies = new WeakMap();
export function maskKitCoveredSkin(source, skeleton) {
  if (maskedBodies.has(source)) return maskedBodies.get(source);
  const torso = new Set(['Hips', 'Spine', 'Spine1', 'Spine2', 'Neck', 'LeftShoulder', 'RightShoulder']);
  const lower = new Set(['Hips', 'Spine', 'LeftUpLeg', 'RightUpLeg', 'LeftLeg', 'RightLeg']);
  const {position, skinIndex, skinWeight} = source.attributes;
  const hidden = [];
  for (let i = 0; i < position.count; i++) {
    const x = position.getX(i), y = position.getY(i), z = position.getZ(i);
    let torsoWeight = 0, lowerWeight = 0;
    for (let slot = 0; slot < 4; slot++) {
      const name = skeleton.bones[skinIndex.getComponent(i, slot)].name;
      const weight = skinWeight.getComponent(i, slot);
      if (torso.has(name)) torsoWeight += weight;
      if (lower.has(name)) lowerWeight += weight;
    }
    const u = x / section(y)[0];
    // Skin within 3 cm of the neckline/armhole edges stays: the fitted cloth hides it from the
    // side, while the shoulder tops between the front and back panels stay visible from above.
    const jersey = y > 1.055 && Math.abs(u) < .99 && y < top(u, z < 0) - .03 && torsoWeight > .6;
    const shorts = y > .67 && y < 1.115 && lowerWeight > .65;
    const socks = y < .297;
    hidden[i] = jersey || shorts || socks;
  }
  const indices = [];
  for (let i = 0; i < source.index.count; i += 3) {
    const face = [source.index.getX(i), source.index.getX(i + 1), source.index.getX(i + 2)];
    if (!face.every(vertex => hidden[vertex])) indices.push(...face);
  }
  const geometry = new THREE.BufferGeometry();
  // Immutable artist attributes are shared; only the clothing-occluded index
  // buffer differs. This prevents flesh clipping during large authored bends.
  for (const [name, attribute] of Object.entries(source.attributes)) geometry.setAttribute(name, attribute);
  geometry.setIndex(indices);
  maskedBodies.set(source, geometry);
  return geometry;
}

const clothFits = new WeakMap();
/**
 * Pushes any cloth vertex lying inside the torso skin out along the nearest
 * skin normal, leaving `clearance` metres of air (less on open edges, so a hem
 * or strap edge lies close to the skin instead of showing its underside). The
 * displacement is then smoothed so fabric drapes across small surface details
 * instead of tracing them, without dropping more than a few millimetres below
 * the required clearance. Coincident vertices are welded so seams stay closed.
 * The pattern itself stays analytic; arms are excluded so the side panels never
 * inflate around them. The result depends only on the body, so it is cached.
 */
export function fitClothOutsideBody(cloth, body, skeleton, {clearance = .009, edgeClearance = .003, key = 'jersey'} = {}) {
  const fits = clothFits.get(body) ?? new Map();
  clothFits.set(body, fits);
  const position = cloth.attributes.position;
  let offsets = fits.get(key);
  if (!offsets || offsets.length !== position.count * 3) {
    const torsoNames = new Set(['Hips', 'Spine', 'Spine1', 'Spine2', 'Neck', 'LeftShoulder', 'RightShoulder']);
    const torso = skeleton.bones.map(bone => torsoNames.has(bone.name));
    const {position: skin, normal, skinIndex, skinWeight} = body.attributes;
    const points = [], normals = [];
    for (let i = 0; i < skin.count; i++) {
      const y = skin.getY(i);
      if (y < .98 || y > 1.68) continue;
      let weight = 0;
      for (let slot = 0; slot < 4; slot++) if (torso[skinIndex.getComponent(i, slot)]) weight += skinWeight.getComponent(i, slot);
      // Shoulder caps lift the strap ends; lower arm skin never pushes the side panels.
      if (weight < .5 && y < 1.47) continue;
      points.push(skin.getX(i), y, skin.getZ(i));
      normals.push(normal.getX(i), normal.getY(i), normal.getZ(i));
    }
    // Weld coincident vertices (panel edges shared with straps) into groups.
    const groupOf = new Int32Array(position.count), seats = new Map(), anchors = [];
    for (let i = 0; i < position.count; i++) {
      const hash = [position.getX(i), position.getY(i), position.getZ(i)].map(value => Math.round(value * 1e4)).join(',');
      if (!seats.has(hash)) { seats.set(hash, anchors.length); anchors.push(i); }
      groupOf[i] = seats.get(hash);
    }
    const groups = anchors.length, linked = Array.from({length: groups}, () => new Set()), edgeUses = new Map();
    const index = cloth.index.array;
    for (let t = 0; t < index.length; t += 3) for (let k = 0; k < 3; k++) {
      const a = groupOf[index[t + k]], b = groupOf[index[t + (k + 1) % 3]];
      if (a === b) continue;
      linked[a].add(b); linked[b].add(a);
      const edge = a < b ? a * groups + b : b * groups + a;
      edgeUses.set(edge, (edgeUses.get(edge) ?? 0) + 1);
    }
    const neighbours = linked.map(set => Int32Array.from(set));
    const boundary = new Uint8Array(groups);
    for (const [edge, uses] of edgeUses) if (uses === 1) { boundary[Math.floor(edge / groups)] = 1; boundary[edge % groups] = 1; }
    const wanted = Float32Array.from({length: groups}, (_, g) => boundary[g] ? edgeClearance
      : neighbours[g].some(other => boundary[other]) ? (edgeClearance + clearance) / 2 : clearance);
    // 6 cm buckets match the search radius, so a lookup only visits adjacent cells.
    // Numeric keys: athletes stay within ±3.8 m of the origin, so 128 cells per axis suffice.
    const cell = .06, cellOf = value => Math.floor(value / cell) + 64, keyOf = (x, y, z) => (x * 128 + y) * 128 + z, buckets = new Map();
    for (let j = 0; j < points.length; j += 3) {
      const id = keyOf(cellOf(points[j]), cellOf(points[j + 1]), cellOf(points[j + 2]));
      if (!buckets.has(id)) buckets.set(id, []);
      buckets.get(id).push(j);
    }
    const push = new Float32Array(groups * 3), none = [];
    for (let g = 0; g < groups; g++) {
      const sx = position.getX(anchors[g]), sy = position.getY(anchors[g]), sz = position.getZ(anchors[g]);
      let px = sx, py = sy, pz = sz;
      // Two passes settle points that start deep inside a curved surface.
      for (let pass = 0; pass < 2; pass++) {
        let best = -1, bestDistance = .0036; // only skin within 6 cm can claim a cloth point
        const cx = cellOf(px), cy = cellOf(py), cz = cellOf(pz);
        for (let ix = cx - 1; ix <= cx + 1; ix++) for (let iy = cy - 1; iy <= cy + 1; iy++) for (let iz = cz - 1; iz <= cz + 1; iz++) {
          for (const j of buckets.get(keyOf(ix, iy, iz)) ?? none) {
            const dx = px - points[j], dy = py - points[j + 1], dz = pz - points[j + 2], distance = dx * dx + dy * dy + dz * dz;
            if (distance < bestDistance) { bestDistance = distance; best = j; }
          }
        }
        if (best < 0) break;
        const depth = (px - points[best]) * normals[best] + (py - points[best + 1]) * normals[best + 1] + (pz - points[best + 2]) * normals[best + 2];
        if (depth >= wanted[g]) break;
        const lift = wanted[g] - depth;
        px += normals[best] * lift; py += normals[best + 1] * lift; pz += normals[best + 2] * lift;
      }
      push[g * 3] = px - sx; push[g * 3 + 1] = py - sy; push[g * 3 + 2] = pz - sz;
    }
    // Drape: average the push with its neighbours, but never fall more than
    // 4 mm (edges: 1 mm) short of what each point itself required.
    let smooth = push.slice(), next = new Float32Array(groups * 3);
    for (let iteration = 0; iteration < 4; iteration++) {
      for (let g = 0; g < groups; g++) {
        const around = neighbours[g];
        let mx = 0, my = 0, mz = 0;
        for (const other of around) { mx += smooth[other * 3]; my += smooth[other * 3 + 1]; mz += smooth[other * 3 + 2]; }
        const n = around.length || 1, keep = around.length ? .5 : 1;
        next[g * 3] = smooth[g * 3] * keep + mx / n * (1 - keep);
        next[g * 3 + 1] = smooth[g * 3 + 1] * keep + my / n * (1 - keep);
        next[g * 3 + 2] = smooth[g * 3 + 2] * keep + mz / n * (1 - keep);
        const length = Math.hypot(push[g * 3], push[g * 3 + 1], push[g * 3 + 2]);
        if (length < 1e-6) continue;
        const along = (next[g * 3] * push[g * 3] + next[g * 3 + 1] * push[g * 3 + 1] + next[g * 3 + 2] * push[g * 3 + 2]) / length;
        const floor = length - (boundary[g] ? .001 : .004);
        if (along < floor) for (let axis = 0; axis < 3; axis++) next[g * 3 + axis] += push[g * 3 + axis] / length * (floor - along);
      }
      [smooth, next] = [next, smooth];
    }
    offsets = new Float32Array(position.count * 3);
    for (let i = 0; i < position.count; i++) for (let axis = 0; axis < 3; axis++) offsets[i * 3 + axis] = smooth[groupOf[i] * 3 + axis];
    fits.set(key, offsets);
  }
  for (let i = 0; i < position.count; i++) position.setXYZ(i, position.getX(i) + offsets[i * 3], position.getY(i) + offsets[i * 3 + 1], position.getZ(i) + offsets[i * 3 + 2]);
  position.needsUpdate = true;
  cloth.computeVertexNormals();
  return cloth;
}

/** An original continuous tank pattern: U-neck, two armholes, shoulder bridges. */
export function createBasketballJersey(skeleton) {
  const positions = [], uvs = [], indices = [], skinIndices = [], skinWeights = [];
  const boneIndex = Object.fromEntries(skeleton.bones.map((bone, index) => [bone.name, index]));
  const add = (position, uv) => {
    const index = positions.length / 3, y = position[1];
    positions.push(...position); uvs.push(...uv);
    const joints = [['Hips', 1.04], ['Spine', 1.16], ['Spine1', 1.28], ['Spine2', 1.40]];
    const upper = joints.findIndex(([, height]) => height >= y);
    if (upper <= 0) {
      skinIndices.push(boneIndex[upper < 0 ? 'Spine2' : 'Hips'], 0, 0, 0);
      skinWeights.push(1, 0, 0, 0);
    } else {
      const lower = joints[upper - 1], higher = joints[upper];
      const amount = (y - lower[1]) / (higher[1] - lower[1]);
      skinIndices.push(boneIndex[lower[0]], boneIndex[higher[0]], 0, 0);
      skinWeights.push(1 - amount, amount, 0, 0);
    }
    return index;
  };
  for (const back of [false, true]) {
    const offset = positions.length / 3, columns = 48, rows = 32;
    for (let row = 0; row <= rows; row++) {
      for (let col = 0; col <= columns; col++) {
        const u = col / columns * 2 - 1, y = blend(1.055, top(u, back), row / rows);
        add(point(u, y, back), [back ? 1 - col / columns : col / columns, (y - 1.055) / .49]);
      }
    }
    for (let row = 0; row < rows; row++) for (let col = 0; col < columns; col++) {
      const a = offset + row * (columns + 1) + col, b = a + 1, c = a + columns + 1, d = c + 1;
      indices.push(...(back ? [a, c, b, b, c, d] : [a, b, c, b, d, c]));
    }
  }
  for (const side of [-1, 1]) {
    const offset = positions.length / 3, columns = 16, rows = 12;
    for (let row = 0; row <= rows; row++) for (let col = 0; col <= columns; col++) {
      const u = side * blend(.38, .77, col / columns), t = row / rows;
      const front = point(u, top(u, false), false), back = point(u, top(u, true), true);
      add([blend(front[0], back[0], t), blend(front[1], back[1], t) + Math.sin(t * Math.PI) * .008, blend(front[2], back[2], t)], [(u + 1) / 2, .96]);
    }
    for (let row = 0; row < rows; row++) for (let col = 0; col < columns; col++) {
      const a = offset + row * (columns + 1) + col, b = a + 1, c = a + columns + 1, d = c + 1;
      indices.push(...(side > 0 ? [a, b, c, b, d, c] : [a, c, b, b, c, d]));
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(skinIndices, 4));
  geometry.setAttribute('skinWeight', new THREE.Float32BufferAttribute(skinWeights, 4));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

// Shorts: [y, half-width, depth, centre z] around the pelvis, then
// [y, centre x, half-width, depth, centre z] for each loose leg opening.
const pelvisProfile = [[1.078, .172, .122, .004], [1.04, .188, .133, .004], [.99, .212, .143, .003], [.94, .232, .149, .002], [.89, .242, .150, .002]];
const legProfile = [[.95, .124, .118, .130, .002], [.86, .122, .118, .128, .004], [.76, .122, .118, .126, .005], [.672, .124, .120, .130, .007]];
const SHORTS_TOP = 1.078, SHORTS_HEM = .672, CROTCH_TOP = .945, CROTCH_SPAN = .09;

function lookup(table, y) {
  if (y >= table[0][0]) return table[0].slice(1);
  for (let i = 1; i < table.length; i++) {
    if (y < table[i][0]) continue;
    const a = table[i - 1], b = table[i], t = (y - a[0]) / (b[0] - a[0]);
    return a.slice(1).map((value, j) => blend(value, b[j + 1], t));
  }
  return table.at(-1).slice(1);
}
const crotchSplit = y => smooth((CROTCH_TOP - y) / CROTCH_SPAN);

/**
 * One side of the shorts at angle phi (0 = outside, PI/2 = front). Above the
 * crotch it is half of a single pelvis ellipse, so both halves meet on smooth
 * centre seams; below it the section becomes that leg's loose opening.
 */
function shortsPoint(side, phi, y) {
  const [rx, rz, cz] = lookup(pelvisProfile, y), [cx, lx, lz, lcz] = lookup(legProfile, y);
  const c = Math.cos(phi), s = Math.sin(phi), split = crotchSplit(y);
  return [blend(side * rx * Math.max(0, c), side * (cx + lx * c), split), y, blend(cz + rz * s, lcz + lz * s, split)];
}

/** A continuous pair of basketball shorts: fitted waist, one seat, two loose legs. */
export function createBasketballShorts(skeleton, {segments = 36, rows = 28} = {}) {
  const positions = [], normals = [], uvs = [], indices = [], skinIndices = [], skinWeights = [];
  const bone = name => skeleton.bones.findIndex(entry => entry.name === name);
  const hips = bone('Hips'), spine = bone('Spine');
  const along = new THREE.Vector3(), up = new THREE.Vector3(), normal = new THREE.Vector3(), edgeA = new THREE.Vector3(), edgeB = new THREE.Vector3();
  const delta = (target, a, b) => target.set(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
  for (const side of [1, -1]) {
    const thigh = bone(side > 0 ? 'LeftUpLeg' : 'RightUpLeg'), offset = positions.length / 3;
    for (let row = 0; row <= rows; row++) {
      const y = blend(SHORTS_TOP, SHORTS_HEM, row / rows), split = crotchSplit(y);
      for (let col = 0; col <= segments; col++) {
        const phi = col / segments * Math.PI * 2, point = shortsPoint(side, phi, y), e = 1e-3;
        // Analytic normals keep the two halves shading as one garment at the centre seams.
        delta(along, shortsPoint(side, phi + e, y), shortsPoint(side, phi - e, y));
        delta(up, shortsPoint(side, phi, y + e), shortsPoint(side, phi, y - e));
        normal.crossVectors(up, along).multiplyScalar(side).normalize();
        positions.push(...point); normals.push(normal.x, normal.y, normal.z);
        uvs.push(col / segments, (y - SHORTS_HEM) / (SHORTS_TOP - SHORTS_HEM));
        // The seat follows the hips. Leg cloth follows its thigh, but shared
        // centre-seam points stay on the hips so the halves never part.
        const leg = smooth((.985 - y) / .15) * blend(smooth(Math.abs(point[0]) / .07), 1, split);
        const waist = THREE.MathUtils.clamp((y - 1.04) / .12, 0, 1);
        skinIndices.push(hips, spine, thigh, 0);
        skinWeights.push(1 - leg - waist, waist, leg, 0);
      }
    }
    for (let row = 0; row < rows; row++) for (let col = 0; col < segments; col++) {
      const a = offset + row * (segments + 1) + col, b = a + 1, c = a + segments + 1, d = c + 1;
      // Wind every quad so its front face agrees with the outward analytic normal.
      const at = index => positions.slice(index * 3, index * 3 + 3);
      delta(edgeA, at(c), at(a)); delta(edgeB, at(b), at(a));
      const outward = edgeA.cross(edgeB).dot(normal.fromArray(normals, a * 3)) > 0;
      indices.push(...(outward ? [a, c, b, b, c, d] : [a, b, c, b, d, c]));
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(skinIndices, 4));
  geometry.setAttribute('skinWeight', new THREE.Float32BufferAttribute(skinWeights, 4));
  geometry.setIndex(indices);
  return geometry;
}

export function makeKitTexture(config) {
  const canvas = document.createElement('canvas');
  canvas.width = 512; canvas.height = 640;
  const ctx = canvas.getContext('2d');
  const jersey = '#' + new THREE.Color(config.jersey).getHexString();
  ctx.fillStyle = jersey; ctx.fillRect(0, 0, 512, 640);
  // Restrained woven texture. Printed marks are in the cloth's UVs, never floating planes.
  ctx.fillStyle = '#00000008';
  for (let y = 0; y < 640; y += 4) ctx.fillRect(0, y, 512, 1);
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillStyle = config.numberColor || '#ede9df';
  ctx.font = '800 36px Arial'; ctx.fillText('VIBE', 256, 180);
  ctx.font = '900 190px Arial'; ctx.fillText(String(config.number ?? 7), 256, 309, 220);
  ctx.font = '700 22px Arial'; ctx.fillText(config.name || '', 256, 433, 210);
  ctx.fillRect(231, 475, 50, 2);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}
