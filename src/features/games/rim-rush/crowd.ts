// Instanced low-poly fans. Bodies, arms, heads and hair are four instanced meshes that share
// per-seat transforms; a few lines of vertex shader make them bob and throw their arms up on
// big plays, so a full arena costs four draw calls and no per-frame CPU work.
import * as T from 'three';
import {mergeGeometries} from 'three/examples/jsm/utils/BufferGeometryUtils.js';

export type Seat = {x: number; y: number; z: number; /** Seated fans are shorter and lean back a little. */ seated: boolean};
export type CrowdStyle = {shirts: string[]; dim?: number; scale?: number};

const SKINS = ['#f1c9a5', '#e2b48c', '#c99a6e', '#a8754f', '#8d5a3b', '#5a3a26'];
const HAIRS = ['#1b1210', '#2a1a12', '#4a2c1a', '#7a4a22', '#c9a15a', '#3b3b3b', '#1b1210'];
const SHOULDER = 0.62;
const hash = (i: number, s: number) => {const v = Math.sin(i * 127.1 + s * 311.7) * 43758.5453; return v - Math.floor(v);};

function bodyGeometry() {
  const torso = new T.CapsuleGeometry(0.15, 0.3, 2, 8); torso.scale(1.15, 1, 0.75); torso.translate(0, 0.38, 0);
  const neck = new T.CylinderGeometry(0.05, 0.05, 0.08, 6, 1, true); neck.translate(0, 0.62, 0);
  return mergeGeometries([torso, neck])!;
}
function armsGeometry() {
  // Both arms hang from the shoulders; the shader flips them upward to cheer.
  const parts = [-1, 1].map(s => {const a = new T.CapsuleGeometry(0.045, 0.34, 2, 6); a.translate(s * 0.2, SHOULDER - 0.21, 0.02); a.rotateZ(s * 0.06); return a;});
  return mergeGeometries(parts)!;
}
function headGeometry() {const h = new T.SphereGeometry(0.12, 10, 7); h.translate(0, 0.79, 0); return h;}
function hairGeometry() {const h = new T.SphereGeometry(0.128, 10, 4, 0, Math.PI * 2, 0, Math.PI * 0.5); h.rotateX(-0.25); h.translate(0, 0.8, -0.01); return h;}

/** Shader patch shared by all four parts so a fan's pieces move together. */
function animated(material: T.MeshStandardMaterial, uniforms: {uTime: {value: number}; uCheer: {value: number}}, arms: boolean) {
  material.onBeforeCompile = shader => {
    shader.uniforms.uTime = uniforms.uTime; shader.uniforms.uCheer = uniforms.uCheer;
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nuniform float uTime;\nuniform float uCheer;\nattribute vec2 aFan;')
      .replace('#include <begin_vertex>', `vec3 transformed = vec3(position);
        float phase = aFan.x * 6.2831;
        float hype = clamp(uCheer * (0.45 + aFan.y), 0.0, 1.0);
        ${arms ? `float raise = clamp(hype * 1.6 - 0.25 + step(0.9, aFan.y) * 0.6 * (0.5 + 0.5 * sin(uTime * 0.7 + phase)), 0.0, 1.0);
        transformed.y = ${SHOULDER.toFixed(2)} + (transformed.y - ${SHOULDER.toFixed(2)}) * mix(1.0, -1.15, raise);
        transformed.x *= mix(1.0, 1.25, raise);` : ''}
        transformed.y += max(0.0, sin(uTime * (7.0 + aFan.y * 4.0) + phase * 3.0)) * 0.16 * hype + sin(uTime * 1.3 + phase * 5.0) * 0.012;
        transformed.x += sin(uTime * 0.9 + phase * 2.0) * 0.015;`);
  };
  material.customProgramCacheKey = () => (arms ? 'rim-rush-fans-arms' : 'rim-rush-fans');
  return material;
}

export class Crowd {
  group = new T.Group();
  private uniforms = {uTime: {value: 0}, uCheer: {value: 0}};
  private cheer = 0;
  private meshes: T.InstancedMesh[] = [];

  constructor(seats: Seat[], style: CrowdStyle) {
    const n = seats.length, scale = style.scale ?? 1, dim = style.dim ?? 1;
    const fan = new Float32Array(n * 2);
    const geos = [bodyGeometry(), armsGeometry(), headGeometry(), hairGeometry()];
    geos.forEach((geo, part) => {
      geo.setAttribute('aFan', new T.InstancedBufferAttribute(fan, 2));
      const mat = animated(new T.MeshStandardMaterial({roughness: part === 0 ? 0.85 : 0.6}), this.uniforms, part === 1);
      const mesh = new T.InstancedMesh(geo, mat, n);
      mesh.frustumCulled = false; mesh.castShadow = false; mesh.receiveShadow = false;
      this.meshes.push(mesh); this.group.add(mesh);
    });
    const m = new T.Matrix4(), q = new T.Quaternion(), c = new T.Color(), e = new T.Euler();
    seats.forEach((s, i) => {
      fan[i * 2] = hash(i, 1); fan[i * 2 + 1] = hash(i, 2);
      const h = (s.seated ? 0.88 : 1.06) * scale * (0.92 + hash(i, 3) * 0.16);
      e.set(s.seated ? -0.08 : 0, (hash(i, 4) - 0.5) * 0.5, 0); q.setFromEuler(e);
      m.compose(new T.Vector3(s.x, s.y, s.z), q, new T.Vector3(h * (0.95 + hash(i, 5) * 0.15), h, h));
      const shirt = c.set(style.shirts[Math.floor(hash(i, 6) * style.shirts.length)]).multiplyScalar(dim).clone();
      const skin = c.set(SKINS[Math.floor(hash(i, 7) * SKINS.length)]).multiplyScalar(dim).clone();
      const hair = c.set(HAIRS[Math.floor(hash(i, 8) * HAIRS.length)]).multiplyScalar(dim).clone();
      // Some fans wear a cap in a team colour instead of showing hair.
      const cap = hash(i, 9) > 0.8 ? c.set(style.shirts[Math.floor(hash(i, 10) * style.shirts.length)]).multiplyScalar(dim).clone() : hair;
      const sleeves = hash(i, 11) > 0.55 ? shirt : skin;
      [shirt, sleeves, skin, cap].forEach((colour, part) => {this.meshes[part].setMatrixAt(i, m); this.meshes[part].setColorAt(i, colour);});
    });
    for (const mesh of this.meshes) {mesh.instanceMatrix.needsUpdate = true; if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;}
  }

  /** Big plays raise the noise; it fades over a couple of seconds. */
  roar(amount = 1) {this.cheer = Math.min(1, Math.max(this.cheer, amount));}
  update(t: number, dt: number) {
    this.cheer = Math.max(0, this.cheer - dt * 0.45);
    this.uniforms.uTime.value = t;
    this.uniforms.uCheer.value = 0.12 + this.cheer * 0.88;
  }
  dispose() {for (const mesh of this.meshes) {mesh.geometry.dispose(); (mesh.material as T.Material).dispose(); mesh.dispose();}}
}

/** Fans along a row from x0 to x1, skipping the given aisle gaps. */
export function row(x0: number, x1: number, y: number, z: number, spacing: number, seated: boolean, aisles: [number, number][] = [], fill = 0.9, seed = 0): Seat[] {
  const seats: Seat[] = [];
  for (let x = x0, i = 0; x <= x1; x += spacing, i++) {
    if (aisles.some(([a, b]) => x > a && x < b)) continue;
    if (hash(i + seed * 97, 13) > fill) continue;
    seats.push({x: x + (hash(i + seed * 97, 14) - 0.5) * spacing * 0.3, y, z: z + (hash(i + seed * 97, 15) - 0.5) * 0.12, seated});
  }
  return seats;
}
