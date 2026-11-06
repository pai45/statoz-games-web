// Arrow meshes for the bow, the flight and arrows left in the target or ground.
import * as T from 'three';
import {PALETTE} from './common';

/** Builds an arrow pointing down its local -Z axis with the tip at the origin. */
export function arrowMesh(fletch: string) {
  const group = new T.Group(), length = 0.78;
  const shaft = new T.Mesh(new T.CylinderGeometry(0.0045, 0.0045, length, 6), new T.MeshStandardMaterial({color: PALETTE.shaft, roughness: 0.6}));
  shaft.rotation.x = Math.PI / 2; shaft.position.z = length / 2; group.add(shaft);
  const tip = new T.Mesh(new T.ConeGeometry(0.008, 0.035, 8), new T.MeshStandardMaterial({color: '#8d939a', metalness: 0.6, roughness: 0.35}));
  tip.rotation.x = -Math.PI / 2; tip.position.z = -0.012; group.add(tip);
  const vane = new T.MeshStandardMaterial({color: fletch, roughness: 0.8, side: T.DoubleSide});
  for (let i = 0; i < 3; i++) {
    const shape = new T.Shape(); shape.moveTo(0, 0); shape.lineTo(0.022, 0.03); shape.lineTo(0.022, 0.1); shape.lineTo(0, 0.1);
    const fin = new T.Mesh(new T.ShapeGeometry(shape), vane);
    const holder = new T.Group(); holder.rotation.z = i * Math.PI * 2 / 3; holder.position.z = length - 0.13;
    fin.rotation.y = -Math.PI / 2; fin.rotation.z = Math.PI / 2; fin.position.set(0.004, 0, 0); holder.add(fin); group.add(holder);
  }
  const nock = new T.Mesh(new T.CylinderGeometry(0.006, 0.006, 0.02, 6), new T.MeshStandardMaterial({color: fletch}));
  nock.rotation.x = Math.PI / 2; nock.position.z = length; group.add(nock);
  group.traverse(o => {o.castShadow = true;});
  return group;
}

/** Sets the fletching colour of an arrow built by `arrowMesh`. */
export function recolour(arrow: T.Group, colour: string) {
  arrow.traverse(o => {if (o instanceof T.Mesh && (o.material as T.MeshStandardMaterial).side === T.DoubleSide) (o.material as T.MeshStandardMaterial).color.set(colour);});
}
