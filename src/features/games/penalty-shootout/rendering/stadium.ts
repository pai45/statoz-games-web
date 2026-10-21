import * as THREE from "three";
import { crowdAtlas, spectatorMaterial } from "./crowd";

/** Original compact football ground: instanced seating/crowd and four enclosed stands. */
export function buildStadium(scene: THREE.Scene) {
  const concrete = new THREE.MeshStandardMaterial({ color: 0x737b7b, roughness: 0.96 });
  const roof = new THREE.MeshStandardMaterial({ color: 0x343e43, roughness: 0.8 });
  const terraces = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), concrete, 72);
  const matrix = new THREE.Matrix4(), quaternion = new THREE.Quaternion(), scale = new THREE.Vector3(), position = new THREE.Vector3();
  const set = (mesh: THREE.InstancedMesh, i: number, x: number, y: number, z: number, sx: number, sy: number, sz: number, rotation = 0) => {
    position.set(x, y, z); quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), rotation); scale.set(sx, sy, sz); matrix.compose(position, quaternion, scale); mesh.setMatrixAt(i, matrix);
  };
  const places: { x: number; y: number; z: number; angle: number; section: number }[] = [];
  const mobile = matchMedia("(pointer: coarse)").matches;
  const stands = [{ x: 0, z: -14, width: 86, angle: 0, columns: mobile ? 128 : 160 }, { x: 0, z: 119, width: 86, angle: Math.PI, columns: mobile ? 128 : 160 }, { x: -44, z: 52.5, width: 108, angle: Math.PI / 2, columns: mobile ? 160 : 200 }, { x: 44, z: 52.5, width: 108, angle: -Math.PI / 2, columns:  mobile ? 160 : 200 }];
  for (const [s, stand] of stands.entries()) {
    for (let row = 0; row < 18; row++) {
      const y = row * 0.48 + (row >= 11 ? 1.15 : 0), depth = row * 0.86;
      const x = stand.x - Math.sin(stand.angle) * depth, z = stand.z - Math.cos(stand.angle) * depth;
      set(terraces, s * 18 + row, x, y + 0.2, z, stand.width, 0.48, 0.9, stand.angle);
      for (let column = 0; column < stand.columns; column++) {
        if (column % 26 < 2) continue;
        const along = (column / (stand.columns - 1) - 0.5) * (stand.width - 1.2);
        places.push({ x: x + Math.cos(stand.angle) * along, y, z: z - Math.sin(stand.angle) * along, angle: stand.angle, section: Math.floor(column / 26) + s });
      }
    }
    const overhang = new THREE.Mesh(new THREE.BoxGeometry(stand.width + 2, 0.32, 8.5), roof);
    overhang.position.set(stand.x - Math.sin(stand.angle) * 12.8, 11.4, stand.z - Math.cos(stand.angle) * 12.8); overhang.rotation.y = stand.angle; scene.add(overhang);
    const fascia = new THREE.Mesh(new THREE.BoxGeometry(stand.width, 0.75, 0.24), roof);
    fascia.position.set(stand.x - Math.sin(stand.angle) * 8.65, 11.18, stand.z - Math.cos(stand.angle) * 8.65); fascia.rotation.y = stand.angle; scene.add(fascia);
    const balcony = new THREE.Mesh(new THREE.BoxGeometry(stand.width, 0.8, 0.3), concrete);
    balcony.position.set(stand.x - Math.sin(stand.angle) * 8.65, 5.6, stand.z - Math.cos(stand.angle) * 8.65); balcony.rotation.y = stand.angle; scene.add(balcony);
  }
  scene.add(terraces);
  const seats = new THREE.InstancedMesh(new THREE.BoxGeometry(0.52, 0.36, 0.45), new THREE.MeshStandardMaterial({ color: 0x53616b, roughness: 0.9 }), places.length);
  const time = { value: 0 };
  const textureAtlas = crowdAtlas(), geometryCrowd = new THREE.PlaneGeometry(0.66, 1.24);
  const variants = new Float32Array(places.length);
  geometryCrowd.setAttribute("crowdVariant", new THREE.InstancedBufferAttribute(variants, 1));
  const spectators = new THREE.InstancedMesh(geometryCrowd, spectatorMaterial(textureAtlas, time), places.length);
  let randomState = 94014; const random = () => { randomState = (randomState * 1664525 + 1013904223) >>> 0; return randomState / 4294967296; };
  places.forEach((p, i) => {
    const h = 0.88 + random() * 0.22, offset = (random() - 0.5) * 0.13;
    set(seats, i, p.x, p.y + 0.42, p.z, 1, 1, 1, p.angle);
    set(spectators, i, p.x + Math.cos(p.angle) * offset, p.y + 0.77 * h, p.z + Math.cos(p.angle) * 0.13, h, h, h, p.angle);
    variants[i] = (Math.floor(random() * 8) + p.section) % 8;
  });
  scene.add(seats, spectators);
  const steel: number[] = [];
  for (const stand of stands) for (let i = -2; i <= 2; i++) {
    const along = i * stand.width / 5;
    const p = (depth: number, y: number) => [stand.x + Math.cos(stand.angle) * along - Math.sin(stand.angle) * depth, y, stand.z - Math.sin(stand.angle) * along - Math.cos(stand.angle) * depth];
    steel.push(...p(17, 0), ...p(17, 11.4), ...p(17, 11.4), ...p(8.5, 11.4), ...p(17, 9.8), ...p(8.5, 11.4));
  }
  const geometry = new THREE.BufferGeometry(); geometry.setAttribute("position", new THREE.Float32BufferAttribute(steel, 3)); scene.add(new THREE.LineSegments(geometry, new THREE.LineBasicMaterial({ color: 0x8a9294 })));
  const canvas = document.createElement("canvas"); canvas.width = 2048; canvas.height = 128; const ctx = canvas.getContext("2d")!;
  const messages = ["FOOTBALL FOR EVERYONE", "THE BEAUTIFUL GAME", "PLAY. BELIEVE.", "FROM THE SPOT"];
  for (let i = 0; i < 4; i++) { ctx.fillStyle = i % 2 ? "#253a43" : "#e7e5d8"; ctx.fillRect(i * 512, 0, 512, 128); ctx.fillStyle = i % 2 ? "#f1f0e7" : "#2a3d49"; ctx.font = "bold 31px Arial"; ctx.textAlign = "center"; ctx.fillText(messages[i], i * 512 + 256, 78); }
  const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace; texture.wrapS = THREE.RepeatWrapping; texture.repeat.set(3, 1); texture.anisotropy = 8;
  const boardMaterial = new THREE.MeshStandardMaterial({ map: texture, roughness: 0.75, emissive: 0xffffff, emissiveMap: texture, emissiveIntensity: 0.12 });
  for (const [i, board] of [{ x: 0, z: -8, width: 80, angle: 0 }, { x: 0, z: 113, width: 80, angle: Math.PI }, { x: -39, z: 52.5, width: 106, angle: Math.PI / 2 }, { x: 39, z: 52.5, width: 106, angle: -Math.PI / 2 }].entries()) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(board.width, 0.9, 0.12), boardMaterial); mesh.position.set(board.x, 0.47, board.z); mesh.rotation.y = board.angle; if (!i) mesh.name = "nearAdvertising"; scene.add(mesh);
  }
  for (const x of [-37, 37]) for (const z of [-13, 111]) {
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.2, 18, 6), roof); mast.position.set(x, 9, z); scene.add(mast);
    const lamp = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1, 0.4), new THREE.MeshStandardMaterial({ color: 0xeae7d9, emissive: 0xfff7d7, emissiveIntensity: 0.6 })); lamp.position.set(x, 18, z); scene.add(lamp);
  }
  return (seconds: number, reducedMotion: boolean) => { time.value = reducedMotion ? 0 : seconds; };
}
