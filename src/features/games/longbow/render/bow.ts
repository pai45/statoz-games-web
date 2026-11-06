// The first-person bow, rendered in its own pass so camera zoom never distorts it.
import * as T from 'three';
import {drawAmount, type Game} from '../engine';
import {arrowMesh} from './arrows';
import {PALETTE, ease, v} from './common';

export class FirstPersonBow {
  readonly scene = new T.Scene();
  readonly camera = new T.PerspectiveCamera(42, 16 / 9, 0.01, 10);
  private bow = new T.Group();
  private string: T.Line;
  private arrow: T.Group;

  constructor() {
    this.scene.add(new T.HemisphereLight('#fff8ea', '#3b2c1c', 1.4));
    const key = new T.DirectionalLight('#ffffff', 1.6); key.position.set(-1, 2, 1); this.scene.add(key);
    const limb = new T.CatmullRomCurve3([v(0, -0.62, 0.02), v(0, -0.32, -0.07), v(0, 0, -0.09), v(0, 0.32, -0.07), v(0, 0.62, 0.02)]);
    const bowWood = new T.MeshStandardMaterial({color: '#6b4426', roughness: 0.55});
    this.bow.add(new T.Mesh(new T.TubeGeometry(limb, 40, 0.013, 8), bowWood));
    const grip = new T.Mesh(new T.CylinderGeometry(0.018, 0.018, 0.13, 10), new T.MeshStandardMaterial({color: '#2c2118', roughness: 0.9}));
    grip.position.z = -0.09; this.bow.add(grip);
    this.string = new T.Line(new T.BufferGeometry().setFromPoints([v(0, 0.62, 0.02), v(0, 0, 0.02), v(0, -0.62, 0.02)]), new T.LineBasicMaterial({color: '#f1ead8'}));
    this.bow.add(this.string);
    this.arrow = arrowMesh(PALETTE.player); this.arrow.position.set(0.012, 0, -0.1); this.bow.add(this.arrow);
    this.scene.add(this.bow, this.camera);
  }

  get visible() {return this.bow.visible;}

  setAspect(aspect: number) {this.camera.aspect = aspect; this.camera.updateProjectionMatrix();}

  setEnvironment(texture: T.Texture | null, intensity: number) {this.scene.environment = texture; this.scene.environmentIntensity = intensity;}

  update(game: Game | null, dt: number) {
    const aiming = !!game && game.turn === 'player' && (game.phase === 'ready' || game.phase === 'drawing' || (game.phase === 'flight' && !game.cinematic));
    this.bow.visible = aiming;
    if (!aiming || !game) return;
    const draw = ease(drawAmount(game)), released = game.phase === 'flight';
    // A right-handed archer's bow: held low and left, canted, and lowered further at full draw so the
    // sight picture stays clear. The arrow stays parallel to the view, so it points at the sight.
    const target = v(-0.34 + 0.06 * draw, -0.36 - 0.12 * draw, -1.15);
    this.bow.position.lerp(target, Math.min(1, dt * 14));
    this.bow.rotation.set(0, 0, -0.32 + 0.08 * draw);
    const nock = released ? 0.02 : 0.02 + draw * 0.5;
    const string = this.string.geometry.attributes.position as T.BufferAttribute;
    string.setXYZ(1, 0, 0, nock); string.needsUpdate = true;
    this.arrow.visible = !released;
    this.arrow.position.set(0.012, 0, nock - 0.78);
  }
}
