import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {mergeGeometries} from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import {renderProfile} from './performance.js';
import {createBasketballJersey, createBasketballShorts, fitClothOutsideBody, makeKitTexture, maskKitCoveredSkin} from './basketball-kit.js';

const models = new Map(), textures = new Map();
const assetUrl = file => new URL('./models/athletes/' + file, location.href).href;
let warmupBall;

export async function preloadAthletes() {
  const loader = new GLTFLoader(), images = new THREE.TextureLoader();
  const textureNames = ['eyes.webp', 'skin-male.webp', 'skin-female.webp',
    ...(!renderProfile.fast ? ['normal-male.webp', 'normal-female.webp'] : [])];
  await Promise.all([
    ...['male', 'female'].map(async sex => {
      models.set(sex, (await loader.loadAsync(assetUrl(`athlete-${sex}.glb`))).scene);
    }),
    ...textureNames.map(async name => {
      const texture = await images.loadAsync(assetUrl(name));
      texture.flipY = false;
      if (!name.startsWith('normal')) texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = renderProfile.fast ? 1 : 4;
      textures.set(name, texture);
    }),
    loader.loadAsync(assetUrl('basketball.glb')).then(model => { warmupBall = model.scene; }),
  ]);
}

/** Fit once, then drive the licensed mesh with the game's existing contact bones. */
export function applyAthlete(rig) {
  const sex = ['NOVA', 'MIRA'].includes(rig.characterDesign.name) ? 'female' : 'male';
  const source = models.get(sex);
  if (!source) throw Error('Vibe athlete assets must be loaded before building a rig');
  let sourceSkeleton;
  source.traverse(node => { if (node.isSkinnedMesh) sourceSkeleton = node.skeleton; });
  for (const sourceBone of sourceSkeleton.bones) {
    if (rig.bones[sourceBone.name]) continue;
    const bone = new THREE.Bone();
    bone.name = sourceBone.name;
    bone.position.copy(sourceBone.position);
    rig.bones[sourceBone.parent.name].add(bone);
    rig.bones[bone.name] = bone;
    rig.boneList.push(bone);
  }
  rig.armature.updateMatrixWorld(true);
  const skeleton = new THREE.Skeleton(sourceSkeleton.bones.map(bone => rig.bones[bone.name]));
  rig.meshSkin.removeFromParent();
  rig.meshSkin.geometry.dispose();
  rig.meshSkin.material.dispose();
  // A scalp must follow the actual head rigidly. The legacy nearest-segment
  // weights blended hair into the neck and let it disappear inside a turned head.
  const headIndex = rig.skeleton.bones.findIndex(bone => bone.name === 'Head');
  for (const [mesh, onlyHead] of [[rig.meshHair, false], [rig.meshTrim, true]]) {
    const geometry = mesh.geometry, positions = geometry.attributes.position;
    for (let i = 0; i < positions.count; i++) {
      if (onlyHead && positions.getY(i) < 1.65) continue;
      geometry.attributes.skinIndex.setXYZW(i, headIndex, 0, 0, 0);
      geometry.attributes.skinWeight.setXYZW(i, 1, 0, 0, 0);
      if (!onlyHead) positions.setXYZ(i, positions.getX(i) * 1.10, positions.getY(i) + .006, (positions.getZ(i) + .012) * 1.10 - .012);
    }
    geometry.computeVertexNormals();
  }
  for (const mesh of [...rig.armature.children]) {
    if (mesh.isSkinnedMesh && mesh.geometry.type === 'PlaneGeometry') {
      mesh.removeFromParent(); mesh.geometry.dispose();
    }
  }
  const tint = ({
    VOLT: [1.12, .94, .83], REYES: [1.75, 1.52, 1.25], NOVA: [1.45, 1.21, 1.04],
    MIRA: [1.95, 1.7, 1.42], JETT: [.94, .87, .79],
  })[rig.characterDesign.name] || [1, 1, 1];
  source.traverse(node => {
    if (!node.isSkinnedMesh) return;
    const role = node.material.name;
    const material = new THREE.MeshStandardMaterial({
      color: role === 'brows' ? rig.config.hair ?? 0x18120f : 0xffffff,
      map: textures.get(role === 'eyes' ? 'eyes.webp' : role === 'skin' ? `skin-${sex}.webp` : ''),
      normalMap: role === 'skin' ? textures.get(`normal-${sex}.webp`) : null,
      normalScale: new THREE.Vector2(.38, .38),
      roughness: role === 'eyes' ? .32 : .79,
      metalness: 0,
    });
    if (role === 'skin') material.color.setRGB(...tint);
    const geometry = role === 'skin' ? maskKitCoveredSkin(node.geometry, sourceSkeleton) : node.geometry;
    const mesh = new THREE.SkinnedMesh(geometry, material);
    mesh.name = 'vibe-athlete-' + role;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.frustumCulled = false;
    mesh.bind(skeleton, new THREE.Matrix4());
    rig.armature.add(mesh);
    if (role === 'skin') {
      rig.meshSkin = mesh;
      const previous = rig.meshJersey;
      previous.removeFromParent();
      previous.geometry.dispose();
      const cloth = new THREE.SkinnedMesh(fitClothOutsideBody(createBasketballJersey(skeleton), node.geometry, sourceSkeleton), previous.material);
      cloth.material.color.set(0xffffff);
      cloth.material.map = makeKitTexture(rig.config);
      cloth.material.side = THREE.DoubleSide;
      cloth.name = 'vibe-fitted-jersey';
      cloth.castShadow = cloth.receiveShadow = true;
      cloth.frustumCulled = false;
      cloth.bind(skeleton, new THREE.Matrix4());
      rig.armature.add(cloth);
      rig.meshJersey = cloth;
      // The source seat and two separate leg tubes read as an apron; one fitted garment replaces them.
      const oldShorts = rig.meshShorts;
      oldShorts.removeFromParent();
      oldShorts.geometry.dispose();
      const shorts = new THREE.SkinnedMesh(createBasketballShorts(skeleton, renderProfile.fast ? {segments: 24, rows: 18} : undefined), oldShorts.material);
      shorts.material.side = THREE.DoubleSide;
      shorts.name = 'vibe-fitted-shorts';
      shorts.castShadow = shorts.receiveShadow = true;
      shorts.frustumCulled = false;
      shorts.bind(skeleton, new THREE.Matrix4());
      rig.armature.add(shorts);
      rig.meshShorts = shorts;
    }
  });
  rig.athleteSkeleton = skeleton;
  rig.group.userData.characterDesign = {
    version: 3, name: rig.characterDesign.name, hair: rig.characterDesign.style,
    model: sex, artist: 'Quaternius', license: 'CC0-1.0', articulatedFingers: true,
  };
}

export function createWarmupBall() {
  const group = warmupBall.clone(true);
  const box = new THREE.Box3().setFromObject(group);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  group.position.sub(center);
  const normalized = new THREE.Group(), ball = new THREE.Group();
  normalized.add(group);
  normalized.scale.setScalar(.242 / Math.max(size.x, size.y, size.z));
  ball.add(normalized);
  group.traverse(node => {
    if (!node.isMesh) return;
    node.material = node.material.clone();
    node.material.roughness = .85;
    node.castShadow = true;
  });
  const channels = [];
  for (const rotation of [[0, 0, 0], [Math.PI / 2, 0, 0], [0, Math.PI / 2, 0]]) {
    const channel = new THREE.TorusGeometry(.1218, .0015, 5, 64);
    channel.applyMatrix4(new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(...rotation)));
    channels.push(channel);
  }
  ball.add(new THREE.Mesh(mergeGeometries(channels), new THREE.MeshStandardMaterial({color: 0x302116, roughness: 1})));
  for (const channel of channels) channel.dispose();
  ball.userData.credit = 'Basketball by Zer0_Time · CC BY 3.0 · poly.pizza/m/wNXXIhP0ip';
  return ball;
}
