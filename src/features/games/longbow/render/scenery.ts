// Range scenery: Poly Haven models, original trees, bales and mesas, each with a soft contact shadow.
import * as T from 'three';
import type {GLTF} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {PALETTE, hash, v} from './common';
import {blobGeometry, strawTexture} from './textures';

export const MODEL_NAMES = ['rock', 'boulder', 'stump', 'shrub', 'fern'] as const;
type ModelName = typeof MODEL_NAMES[number];
type Part = {geometry: T.BufferGeometry; material: T.Material; matrix: T.Matrix4};
/** x, z, scale, turn and vertical squash. */
type Spot = [number, number, number, number, number?];

/** Contact-shadow radius per metre of model height. Canyon boulders are cliffs and get none. */
const BLOB: Record<ModelName, number> = {rock: 0.55, boulder: 0, stump: 0.45, shrub: 0.55, fern: 0.5};

export class Scenery {
  readonly group = new T.Group();
  private models: Partial<Record<ModelName, Part[]>> = {};
  private blobs: [number, number, number][] = [];
  private blobGeometry = blobGeometry();

  constructor(private castShadows: boolean, private blobMaterial: T.Material) {}

  /** Normalises every model to stand on the ground, centred, one metre tall. */
  setModels(gltfs: GLTF[]) {
    MODEL_NAMES.forEach((name, i) => {
      const parts: Part[] = [], root = gltfs[i].scene; root.updateMatrixWorld(true);
      const box = new T.Box3().setFromObject(root), size = box.getSize(v()), centre = box.getCenter(v());
      const normalise = new T.Matrix4().makeScale(1 / size.y, 1 / size.y, 1 / size.y).multiply(new T.Matrix4().makeTranslation(-centre.x, -box.min.y, -centre.z));
      root.traverse(o => {if (o instanceof T.Mesh) parts.push({geometry: o.geometry, material: o.material as T.Material, matrix: normalise.clone().multiply(o.matrixWorld)});});
      this.models[name] = parts;
    });
  }

  build(range: number) {
    this.clear();
    const side = (i: number, seed: number, near: number, far: number) => (hash(i, seed) < 0.5 ? -1 : 1) * (near + hash(i, seed + 1) * (far - near));
    const along = (i: number, seed: number) => 25 - hash(i, seed) * 160;
    const spots = (count: number, make: (i: number) => Spot) => Array.from({length: count}, (_, i) => make(i));
    if (range === 0) {
      this.trees('round', spots(46, i => [side(i, 3, 16, 75), along(i, 5), 0.8 + hash(i, 7) * 0.7, 0]));
      this.instanced('shrub', spots(34, i => [side(i, 11, 6, 30), along(i, 13), 0.7 + hash(i, 15) * 0.8, hash(i, 17) * 6]));
      this.instanced('rock', spots(14, i => [side(i, 19, 8, 40), along(i, 21), 0.5 + hash(i, 23) * 0.8, hash(i, 25) * 6, 0.7]));
      // Hay bales along the lane edge, original geometry.
      const bales = new T.InstancedMesh(new T.CylinderGeometry(0.6, 0.6, 1.1, 18), new T.MeshStandardMaterial({map: strawTexture(), roughness: 1}), 8);
      for (let i = 0; i < 8; i++) {
        const x = (i % 2 ? 1 : -1) * (4.5 + hash(i, 31)), z = -8 - i * 9;
        bales.setMatrixAt(i, new T.Matrix4().compose(v(x, 0.6, z), new T.Quaternion().setFromEuler(new T.Euler(0, hash(i, 33), Math.PI / 2)), v(1, 1, 1)));
        this.blobs.push([x, z, 0.95]);
      }
      this.own(bales); bales.userData.ownMap = true;
    } else if (range === 1) {
      this.trees('pine', spots(90, i => [side(i, 41, 9, 60), along(i, 43), 0.75 + hash(i, 45) * 0.6, 0]));
      this.trees('pine', spots(30, i => [(hash(i, 51) - 0.5) * 120, -140 - hash(i, 53) * 60, 0.9 + hash(i, 55) * 0.5, 0]));
      this.instanced('stump', spots(18, i => [side(i, 61, 5, 25), along(i, 63), 0.45 + hash(i, 65) * 0.3, hash(i, 67) * 6]));
      this.instanced('fern', spots(40, i => [side(i, 71, 4.5, 22), along(i, 73), 0.6 + hash(i, 75) * 0.5, hash(i, 77) * 6]));
      this.instanced('rock', spots(12, i => [side(i, 79, 6, 30), along(i, 81), 0.6 + hash(i, 83) * 0.7, hash(i, 85) * 6, 0.6]), '#b8c2b0');
    } else {
      // Canyon walls: large boulders stretched into cliffs, plus original mesa blocks.
      this.instanced('boulder', spots(26, i => [(i % 2 ? 1 : -1) * (26 + hash(i, 91) * 18), 20 - Math.floor(i / 2) * 14, 9 + hash(i, 93) * 7, hash(i, 95) * 6, 1.3 + hash(i, 97)]), '#d9926a');
      this.instanced('rock', spots(26, i => [side(i, 101, 6, 24), along(i, 103), 0.5 + hash(i, 105) * 1.1, hash(i, 107) * 6, 0.7]), '#e0a37c');
      this.instanced('shrub', spots(18, i => [side(i, 111, 5, 22), along(i, 113), 0.4 + hash(i, 115) * 0.4, hash(i, 117) * 6]), '#b1a46a');
      const mesa = new T.InstancedMesh(new T.CylinderGeometry(1, 1.15, 1, 7), new T.MeshStandardMaterial({color: '#b9603f', roughness: 1, flatShading: true}), 7);
      for (let i = 0; i < 7; i++) mesa.setMatrixAt(i, new T.Matrix4().compose(v((hash(i, 121) - 0.5) * 260, 14, -180 - hash(i, 123) * 90), new T.Quaternion(), v(18 + hash(i, 125) * 22, 28 + hash(i, 127) * 26, 18 + hash(i, 129) * 18)));
      this.own(mesa, false);
    }
    this.buildBlobs();
  }

  private place([x, z, scale, turn, squash = 1]: Spot) {
    return new T.Matrix4().compose(v(x, 0, z), new T.Quaternion().setFromAxisAngle(v(0, 1, 0), turn), v(scale, scale * squash, scale));
  }

  /** Adds an InstancedMesh whose geometry and material belong to this scenery build. */
  private own(mesh: T.InstancedMesh, shadows = true) {
    mesh.castShadow = shadows && this.castShadows; mesh.receiveShadow = true;
    mesh.userData.ownMaterial = mesh.userData.ownGeometry = true; this.group.add(mesh);
  }

  private instanced(name: ModelName, spots: Spot[], tint?: string) {
    for (const part of this.models[name] ?? []) {
      const material = tint ? (part.material as T.MeshStandardMaterial).clone() : part.material;
      if (tint) (material as T.MeshStandardMaterial).color.set(tint);
      const mesh = new T.InstancedMesh(part.geometry, material, spots.length);
      spots.forEach((spot, i) => mesh.setMatrixAt(i, this.place(spot).multiply(part.matrix)));
      mesh.castShadow = this.castShadows; mesh.receiveShadow = true; mesh.userData.ownMaterial = !!tint; mesh.userData.ownGeometry = false;
      this.group.add(mesh);
    }
    if (BLOB[name]) for (const [x, z, scale] of spots) this.blobs.push([x, z, scale * BLOB[name]]);
  }

  private trees(kind: 'round' | 'pine', spots: Spot[]) {
    const trunk = new T.InstancedMesh(new T.CylinderGeometry(0.18, 0.28, 1, 6), new T.MeshStandardMaterial({color: PALETTE.darkWood, roughness: 1}), spots.length);
    const crownGeometry = kind === 'pine' ? new T.ConeGeometry(1, 1, 7) : new T.IcosahedronGeometry(1, 1);
    const crown = new T.InstancedMesh(crownGeometry, new T.MeshStandardMaterial({color: '#ffffff', roughness: 0.95, flatShading: true}), spots.length * (kind === 'pine' ? 3 : 1));
    const greens = kind === 'pine' ? ['#2f5a3c', '#36644a', '#28503a'] : ['#5f8a3e', '#6f9a45', '#4f7b39', '#7d9f4c'];
    let c = 0;
    spots.forEach(([x, z, s], i) => {
      const height = kind === 'pine' ? 9 * s : 4.5 * s;
      trunk.setMatrixAt(i, this.place([x, z, s, 0]).multiply(new T.Matrix4().makeScale(1, kind === 'pine' ? 3 : 2.6, 1)).multiply(new T.Matrix4().makeTranslation(0, 0.5, 0)));
      if (kind === 'pine') for (let k = 0; k < 3; k++) {
        const w = (2.6 - k * 0.7) * s, h = (3.6 - k * 0.6) * s;
        crown.setMatrixAt(c, new T.Matrix4().compose(v(x, height * 0.3 + k * 2.1 * s + h / 2, z), new T.Quaternion(), v(w, h, w)));
        crown.setColorAt(c++, new T.Color(greens[(i + k) % 3]));
      } else {
        crown.setMatrixAt(c, new T.Matrix4().compose(v(x, height * 0.75, z), new T.Quaternion().setFromAxisAngle(v(0, 1, 0), i), v(2.6 * s, 2.2 * s, 2.6 * s)));
        crown.setColorAt(c++, new T.Color(greens[i % 4]));
      }
      this.blobs.push([x, z, (kind === 'pine' ? 1.9 : 2.2) * s]);
    });
    this.own(trunk); this.own(crown);
  }

  private buildBlobs() {
    const mesh = new T.InstancedMesh(this.blobGeometry, this.blobMaterial, Math.max(1, this.blobs.length));
    mesh.count = this.blobs.length; mesh.renderOrder = 1;
    this.blobs.forEach(([x, z, r], i) => mesh.setMatrixAt(i, new T.Matrix4().compose(v(x, 0.02, z), new T.Quaternion(), v(r, 1, r))));
    mesh.userData.ownMaterial = mesh.userData.ownGeometry = false; this.group.add(mesh);
  }

  private clear() {
    for (const child of [...this.group.children]) {
      this.group.remove(child);
      if (!(child instanceof T.InstancedMesh)) continue;
      if (child.userData.ownGeometry) child.geometry.dispose();
      if (child.userData.ownMaterial) {const m = child.material as T.MeshStandardMaterial; if (child.userData.ownMap) m.map?.dispose(); m.dispose();}
      child.dispose();
    }
    this.blobs = [];
  }

  dispose() {
    this.clear(); this.blobGeometry.dispose();
    for (const parts of Object.values(this.models)) for (const p of parts ?? []) {p.geometry.dispose(); p.material.dispose();}
  }
}
