// The target rig: a straw boss and face on a stand, a slide rail or a swing frame.
import * as T from 'three';
import {SWING_LENGTH, TARGET_HEIGHT, type Game} from '../engine';
import type {Motion} from '../levels';
import {PALETTE, v} from './common';
import {blobGeometry, ringTexture, strawTexture} from './textures';

export class TargetRig {
  /** Sits at the target's distance down the lane. */
  readonly root = new T.Group();
  /** Moves for sliding and swinging targets; stuck arrows are its children. */
  readonly face = new T.Group();
  private flash: T.Mesh;
  private flashAge = 9;
  private standLegs = new T.Group();
  private slideRail = new T.Group();
  private swingFrame = new T.Group();
  private swingPivot = new T.Group();
  private kind: Motion['kind'] = 'none';

  constructor(blobMaterial: T.Material) {
    // The paper sits millimetres in front of the straw; the depth offset stops the straw showing through at range.
    const faceMesh = new T.Mesh(new T.CircleGeometry(1, 64), new T.MeshStandardMaterial({map: ringTexture(), roughness: 0.85, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -4}));
    faceMesh.position.z = 0.012; faceMesh.receiveShadow = true;
    const boss = new T.Mesh(new T.CylinderGeometry(1.12, 1.12, 0.32, 40), new T.MeshStandardMaterial({map: strawTexture(), roughness: 1}));
    boss.rotation.x = Math.PI / 2; boss.position.z = -0.16; boss.castShadow = boss.receiveShadow = true;
    // Bright enough to bloom when post-processing is on.
    this.flash = new T.Mesh(new T.RingGeometry(0.9, 1, 64), new T.MeshBasicMaterial({color: new T.Color('#fff6d8').multiplyScalar(2.5), transparent: true, opacity: 0, depthWrite: false, blending: T.AdditiveBlending, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -10}));
    this.flash.position.z = 0.02;
    this.face.add(boss, faceMesh, this.flash);
    this.root.add(this.standLegs, this.slideRail, this.swingFrame, this.swingPivot, this.face);

    const wood = new T.MeshStandardMaterial({color: PALETTE.wood, roughness: 0.85});
    const post = (parent: T.Object3D, a: T.Vector3, b: T.Vector3, r = 0.05, material: T.Material = wood) => {
      const m = new T.Mesh(new T.CylinderGeometry(r, r, 1, 8), material), d = b.clone().sub(a);
      m.position.copy(a).add(b).multiplyScalar(0.5); m.scale.y = d.length(); m.quaternion.setFromUnitVectors(v(0, 1, 0), d.normalize());
      m.castShadow = true; parent.add(m); return m;
    };
    const blobs = blobGeometry();
    const blob = (parent: T.Object3D, x: number, z: number, radius: number) => {
      const m = new T.Mesh(blobs, blobMaterial); m.position.set(x, 0.02, z); m.scale.setScalar(radius); m.renderOrder = 1; parent.add(m);
    };
    post(this.standLegs, v(-0.7, 0, 0.35), v(-0.45, 1.6, -0.25)); post(this.standLegs, v(0.7, 0, 0.35), v(0.45, 1.6, -0.25)); post(this.standLegs, v(0, 0, -1.1), v(0, 1.5, -0.3));
    blob(this.standLegs, 0, -0.2, 1.1);
    post(this.slideRail, v(-3.2, 0, -0.5), v(-3.2, 2.2, -0.5), 0.07); post(this.slideRail, v(3.2, 0, -0.5), v(3.2, 2.2, -0.5), 0.07); post(this.slideRail, v(-3.3, 2.2, -0.5), v(3.3, 2.2, -0.5), 0.05);
    blob(this.slideRail, -3.2, -0.5, 0.45); blob(this.slideRail, 3.2, -0.5, 0.45);
    const frameTop = TARGET_HEIGHT + SWING_LENGTH + 0.05;
    post(this.swingFrame, v(-2.4, 0, -0.4), v(-2.1, frameTop, -0.4), 0.08); post(this.swingFrame, v(2.4, 0, -0.4), v(2.1, frameTop, -0.4), 0.08); post(this.swingFrame, v(-2.3, frameTop, -0.4), v(2.3, frameTop, -0.4), 0.07);
    blob(this.swingFrame, -2.4, -0.4, 0.5); blob(this.swingFrame, 2.4, -0.4, 0.5);
    const rope = new T.MeshStandardMaterial({color: PALETTE.rope, roughness: 1});
    for (const x of [-0.5, 0.5]) post(this.swingPivot, v(x * 0.3, 0, -0.1), v(x, -SWING_LENGTH + 0.9, -0.1), 0.012, rope);
    this.swingPivot.position.set(0, TARGET_HEIGHT + SWING_LENGTH, 0);
    this.layout('none', 0.61);
  }

  /** Shows the stand, rail or frame for `kind` and sizes the face to `radius` metres. */
  layout(kind: Motion['kind'], radius: number) {
    this.kind = kind;
    this.standLegs.visible = kind === 'none'; this.slideRail.visible = kind === 'slide'; this.swingFrame.visible = this.swingPivot.visible = kind === 'swing';
    this.face.removeFromParent(); (kind === 'swing' ? this.swingPivot : this.root).add(this.face);
    this.face.scale.setScalar(radius);
  }

  /** Places the face for this moment; `centre` is the engine's target centre. */
  pose(game: Game | null, centre: {x: number; y: number}) {
    if (game && this.kind === 'swing') {
      this.swingPivot.rotation.z = Math.asin(Math.max(-1, Math.min(1, centre.x / SWING_LENGTH)));
      this.face.position.set(0, -SWING_LENGTH, 0);
    } else {this.face.position.set(centre.x, centre.y, 0); this.swingPivot.rotation.z = 0;}
  }

  /** Flashes the ring that scored `score`. */
  hit(score: number) {
    this.flashAge = 0;
    const ring = 10 - score;
    this.flash.geometry.dispose(); this.flash.geometry = new T.RingGeometry(Math.max(0, ring / 10), (ring + 1) / 10, 64);
  }

  update(dt: number, reduced: boolean) {
    this.flashAge += dt;
    (this.flash.material as T.MeshBasicMaterial).opacity = reduced ? 0 : Math.max(0, 0.85 - this.flashAge * 1.6);
  }
}
