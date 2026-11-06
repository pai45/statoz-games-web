import * as THREE from 'three';
import {Rig} from '../../../../vendor/vibebasketball/src/entities/rig.js';
import {Animator} from '../../../../vendor/vibebasketball/src/anim/animator.js';
import {createWarmupBall} from './athlete-assets.js';
import {renderProfile} from './performance.js';

/** A single, game-owned warmup set rendered by the existing WebGL renderer. */
export function createLobby(renderer) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x111713);
  scene.fog = new THREE.Fog(0x111713, 5, 15);
  const camera = new THREE.PerspectiveCamera(33, 1, .1, 50);
  const portrait = () => innerHeight > innerWidth;
  camera.position.set(2.1, 1.50, 4.6);
  camera.lookAt(0, .98, 0);
  scene.add(new THREE.HemisphereLight(0xf1ecda, 0x292820, 2.0));
  const key = new THREE.DirectionalLight(0xffedce, 3.8);
  key.position.set(-2.5, 4.5, 3.0);
  key.castShadow = !renderProfile.fast;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.left = key.shadow.camera.bottom = -3;
  key.shadow.camera.right = key.shadow.camera.top = 3;
  key.shadow.normalBias = .025;
  key.shadow.bias = -.00015;
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xe9a66b, 3.1);
  rim.position.set(2, 3, -2.4);
  scene.add(rim);
  const fill = new THREE.DirectionalLight(0xe2e6df, .5);
  fill.position.set(1, 2, 4);
  scene.add(fill);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.MeshStandardMaterial({color: 0x1b241d, roughness: .96}));
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -.012;
  floor.receiveShadow = true;
  scene.add(floor);
  const lineMaterial = new THREE.MeshStandardMaterial({color: 0x92947d, roughness: 1});
  const arc = new THREE.Mesh(new THREE.RingGeometry(2.78, 2.80, 100, 1, 0, Math.PI * 1.7), lineMaterial);
  arc.rotation.x = -Math.PI / 2; arc.rotation.z = .45;
  arc.position.set(-1.2, -.004, -1.8); scene.add(arc);
  const sideline = new THREE.Mesh(new THREE.PlaneGeometry(.025, 10), lineMaterial);
  sideline.rotation.x = -Math.PI / 2; sideline.position.set(1.6, -.003, -1); scene.add(sideline);

  // A drawn practice hoop, not a borrowed court image or branded sports asset.
  const poleMaterial = new THREE.MeshStandardMaterial({color: 0x323a30, roughness: .85});
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(.045, .07, 2.8, 12), poleMaterial);
  pole.position.set(-1.7, 1.4, -4.6); scene.add(pole);
  const board = new THREE.Mesh(new THREE.BoxGeometry(1.18, .7, .055), new THREE.MeshStandardMaterial({color: 0xa7ab94, roughness: .8}));
  board.position.set(-1.7, 2.65, -4.4); scene.add(board);
  const target = new THREE.Mesh(new THREE.RingGeometry(.18, .195, 4), new THREE.MeshBasicMaterial({color: 0x555e4c, side: THREE.DoubleSide}));
  target.scale.set(1.3, 1, 1); target.rotation.z = Math.PI / 4; target.position.set(-1.7, 2.52, -4.365); scene.add(target);
  const hoop = new THREE.Mesh(new THREE.TorusGeometry(.23, .013, 8, 40), new THREE.MeshStandardMaterial({color: 0xc87c43, roughness: .65}));
  hoop.rotation.x = Math.PI / 2; hoop.position.set(-1.7, 2.38, -4.12); scene.add(hoop);
  const netPositions = [];
  for (let i = 0; i < 12; i++) {
    const angle = i / 12 * Math.PI * 2;
    netPositions.push(-1.7 + Math.cos(angle) * .23, 2.38, -4.12 + Math.sin(angle) * .23,
      -1.7 + Math.cos(angle + .25) * .13, 2.02, -4.12 + Math.sin(angle + .25) * .13);
  }
  const netGeometry = new THREE.BufferGeometry();
  netGeometry.setAttribute('position', new THREE.Float32BufferAttribute(netPositions, 3));
  scene.add(new THREE.LineSegments(netGeometry, new THREE.LineBasicMaterial({color: 0xb2b49d})));

  const rig = new Rig({name: 'VOLT', number: 7, hair: 0x17120d});
  const animator = new Animator(rig);
  rig.group.rotation.y = -.20;
  scene.add(rig.group, rig.shadow);
  rig.updateGround(0, 0, 0, 0);
  const ball = createWarmupBall();
  scene.add(ball);
  let elapsed = 0, bounds = null;
  const stage = document.getElementById('lobby-stage');
  const resize = new ResizeObserver(() => { bounds = null; });
  resize.observe(stage);
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hand = new THREE.Vector3(), poleTarget = new THREE.Vector3();
  const api = {
    rig, animator, ball,
    update(dt) {
      if (!document.getElementById('mode-menu').classList.contains('show')) return;
      elapsed += reducedMotion ? 0 : Math.min(dt, .05);
      const cycle = elapsed % 2.3, bounce = cycle > .6 && cycle < 1.45;
      // A relaxed, deliberate one-hand pound dribble between carried holds.
      const flight = bounce ? Math.sin((cycle - .6) / .85 * Math.PI) : 0;
      const y = .91 - flight * .78;
      rig.group.rotation.y = -.20 + Math.sin(elapsed * .32) * .035;
      rig.group.updateMatrixWorld(true);
      hand.set(-.36 - flight * .035, .96 - flight * .14, .21);
      rig.group.localToWorld(hand);
      rig.group.localToWorld(poleTarget.set(-.62, 1.18, -.22));
      animator.update(dt, {
        gait: 'idle', crouch: .12, speed: 0, armOverride: true,
        handTargets: {Right: {target: hand, pole: poleTarget, weight: 1}},
        grip: {Left: .08, Right: bounce ? .12 : .56},
      });
      rig.setBoneEuler('LeftArm', -.12, 0, -.10);
      rig.setBoneEuler('LeftForeArm', -.18, 0, 0);
      rig.setBoneEuler('Neck', -.025, -.13, 0);
      rig.setBoneEuler('Head', -.025, -.08, 0);
      rig.armature.updateMatrixWorld(true);
      const ballPoint = rig.group.localToWorld(new THREE.Vector3(-.37 - flight * .035, y, .24));
      ball.position.copy(ballPoint);
      ball.rotation.x = elapsed * .55;
      ball.rotation.z = -.20;
    },
    render() {
      bounds ??= stage.getBoundingClientRect();
      const width = document.getElementById('app').clientWidth, height = document.getElementById('app').clientHeight;
      const x = Math.max(0, bounds.left), y = Math.max(0, height - bounds.bottom);
      const w = Math.min(bounds.width, width - x), h = Math.min(bounds.height, height - y);
      if (w <= 0 || h <= 0) return;
      camera.aspect = w / h;
      camera.fov = portrait() ? 34 : 33;
      camera.position.set(portrait() ? 1.6 : 1.65, 1.42, portrait() ? 4.0 : 3.65);
      camera.lookAt(0, 1.0, 0);
      camera.updateProjectionMatrix();
      renderer.setScissorTest(false);
      renderer.setClearColor(0x111713);
      renderer.clear();
      renderer.setViewport(x, y, w, h);
      renderer.setScissor(x, y, w, h);
      renderer.setScissorTest(true);
      renderer.render(scene, camera);
      renderer.setScissorTest(false);
      renderer.setViewport(0, 0, width, height);
    },
    dispose() { resize.disconnect(); },
  };
  window.__VIBE_LOBBY__ = api;
  window.addEventListener('pagehide', () => api.dispose(), {once: true});
  api.update(0);
  return api;
}
