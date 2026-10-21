import * as THREE from "three";

/** Original shaded spectator atlas. No photographs or reference-video pixels. */
export function crowdAtlas() {
  const canvas = document.createElement("canvas"); canvas.width = 1024; canvas.height = 256;
  const ctx = canvas.getContext("2d")!;
  const shirts = ["#deddd2", "#b8c1bb", "#454e58", "#dfdfd9", "#8c6253", "#7e8d99", "#c5c6b9", "#c7d0cc"];
  const skins = ["#cbb297", "#a78063", "#bc9676", "#8d6950"];
  for (let i = 0; i < 8; i++) {
    ctx.save(); ctx.translate(i * 128, 0);
    const skin = skins[i % 4], shirt = shirts[i], lift = i === 3 || i === 6;
    // Two hanging or raised arms, with visible forearms and rounded hands.
    ctx.lineCap = "round"; ctx.lineJoin = "round";
    for (const side of [-1, 1]) {
      const shoulder = 64 + side * 23, elbow = 64 + side * (lift ? 35 : 34), wrist = 64 + side * (lift ? 47 : 24);
      ctx.strokeStyle = shirt; ctx.lineWidth = 16; ctx.beginPath(); ctx.moveTo(shoulder, 90); ctx.lineTo(elbow, lift ? 61 : 126); ctx.stroke();
      ctx.strokeStyle = skin; ctx.lineWidth = 11; ctx.beginPath(); ctx.moveTo(elbow, lift ? 61 : 126); ctx.lineTo(wrist, lift ? 24 : 159); ctx.stroke();
      ctx.fillStyle = skin; ctx.beginPath(); ctx.ellipse(wrist, lift ? 21 : 163, 6, 9, side * .15, 0, Math.PI * 2); ctx.fill();
    }
    const cloth = ctx.createLinearGradient(35, 85, 90, 150); cloth.addColorStop(0, shirt); cloth.addColorStop(.5, shirt); cloth.addColorStop(1, "#3b4546");
    ctx.fillStyle = cloth; ctx.beginPath(); ctx.moveTo(47, 79); ctx.quadraticCurveTo(64, 86, 81, 79); ctx.quadraticCurveTo(99, 84, 99, 102); ctx.lineTo(85, 108); ctx.lineTo(82, 165); ctx.quadraticCurveTo(64, 173, 45, 165); ctx.lineTo(43, 108); ctx.lineTo(29, 103); ctx.quadraticCurveTo(31, 85, 47, 79); ctx.fill();
    ctx.strokeStyle = "#ffffff19"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(51, 101); ctx.lineTo(48, 149); ctx.moveTo(78, 108); ctx.lineTo(80, 155); ctx.stroke();
    ctx.fillStyle = skin; ctx.fillRect(57, 68, 14, 17);
    const face = ctx.createLinearGradient(51, 43, 78, 69); face.addColorStop(0, "#e0c4a4"); face.addColorStop(.4, skin); face.addColorStop(1, "#775943");
    ctx.fillStyle = face; ctx.beginPath(); ctx.ellipse(64, 54, 15, 22, i % 2 ? .05 : -.05, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = i % 3 ? "#302b27" : "#706659"; ctx.beginPath(); ctx.ellipse(64, 41, 15.5, 12, 0, Math.PI, Math.PI * 2); ctx.lineTo(79, 48); ctx.quadraticCurveTo(63, 41, 49, 49); ctx.fill();
    ctx.fillStyle = "#3f3a32"; ctx.fillRect(56, 53, 3, 2); ctx.fillRect(69, 53, 3, 2); ctx.fillStyle = "#775a48"; ctx.fillRect(60, 66, 8, 1.5);
    const trousers = ctx.createLinearGradient(44, 170, 88, 224); trousers.addColorStop(0, "#414b50"); trousers.addColorStop(1, "#222a2e"); ctx.fillStyle = trousers;
    ctx.beginPath(); ctx.moveTo(45, 164); ctx.lineTo(82, 164); ctx.lineTo(89, 201); ctx.lineTo(82, 238); ctx.lineTo(67, 238); ctx.lineTo(70, 202); ctx.lineTo(63, 183); ctx.lineTo(58, 202); ctx.lineTo(60, 238); ctx.lineTo(45, 238); ctx.lineTo(39, 202); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#202828"; ctx.fillRect(42, 234, 20, 10); ctx.fillRect(66, 234, 20, 10);
    ctx.restore();
  }
  const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace; texture.anisotropy = 4;
  return texture;
}

export function spectatorMaterial(texture: THREE.Texture, time: { value: number }) {
  const material = new THREE.MeshStandardMaterial({ map: texture, roughness: 1, alphaTest: 0.45, side: THREE.DoubleSide });
  material.onBeforeCompile = shader => {
    shader.uniforms.crowdTime = time;
    shader.vertexShader = "uniform float crowdTime;\nattribute float crowdVariant;\n" + shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace("#include <uv_vertex>", "#include <uv_vertex>\nvMapUv.x = (vMapUv.x + crowdVariant) / 8.0;");
    shader.vertexShader = shader.vertexShader.replace("#include <begin_vertex>", "#include <begin_vertex>\ntransformed.y += sin(crowdTime * 1.7 + instanceMatrix[3].x * .9 + instanceMatrix[3].z * .7) * .014;");
  };
  return material;
}
