import * as T from 'three';
import type {Kit, PlayerOptions} from './character';

export type PlayerSurfaces = {fabric: T.CanvasTexture; willow: T.CanvasTexture};
const noise = (n: number) => {const f = Math.sin(n * 127.1) * 43758.5453; return f - Math.floor(f);};

function texture(width: number, height: number, draw: (ctx: CanvasRenderingContext2D) => void, color = true) {
  const canvas = document.createElement('canvas'); canvas.width = width; canvas.height = height;
  draw(canvas.getContext('2d')!);
  const map = new T.CanvasTexture(canvas);
  if (color) map.colorSpace = T.SRGBColorSpace;
  map.anisotropy = 8;
  return map;
}

/** Original, small repeatable maps. No remote textures or extra asset downloads. */
export function createPlayerSurfaces(): PlayerSurfaces {
  const fabric = texture(128, 128, ctx => {
    const pixels = ctx.createImageData(128, 128);
    for (let y = 0; y < 128; y++) for (let x = 0; x < 128; x++) {
      const thread = Math.sin(x * Math.PI / 2) * Math.sin(y * Math.PI / 2);
      const n = Math.round(156 + thread * 23 + (noise(x + y * 128) - .5) * 17), i = (x + y * 128) * 4;
      pixels.data.set([n, n, n, 255], i);
    }
    ctx.putImageData(pixels, 0, 0);
  }, false);
  fabric.wrapS = fabric.wrapT = T.RepeatWrapping;
  const willow = texture(256, 512, ctx => {
    ctx.fillStyle = '#eddbb5'; ctx.fillRect(0, 0, 256, 512);
    for (let i = 0; i < 150; i++) {
      const x = noise(i * 1.3) * 256, strength = .035 + noise(i * 3.7) * .1;
      ctx.strokeStyle = `rgba(119,88,48,${strength})`; ctx.lineWidth = .4 + noise(i * 8.1) * 1.5;
      ctx.beginPath(); ctx.moveTo(x, 0);
      ctx.bezierCurveTo(x + Math.sin(i) * 2, 170, x + Math.cos(i * 2) * 3, 340, x + Math.sin(i) * 4, 512); ctx.stroke();
    }
  });
  return {fabric, willow};
}

function kitArtwork(options: PlayerOptions) {
  const {kit, number, name = '', badge = 'YC'} = options;
  const back = texture(256, 320, ctx => {
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = kit.trim;
    ctx.font = '600 27px YorkerCondensed,"Arial Narrow",Arial,sans-serif';
    ctx.fillText(name.toUpperCase(), 128, 49, 232);
    ctx.font = '600 202px YorkerCondensed,"Arial Narrow",Arial,sans-serif';
    ctx.lineJoin = 'round'; ctx.lineWidth = 2.5; ctx.strokeStyle = 'rgba(0,0,0,.22)';
    ctx.strokeText(number, 128, 182, 225); ctx.fillText(number, 128, 182, 225);
    if (number) {ctx.font = '600 13px Arial,sans-serif'; ctx.globalAlpha = .65; ctx.fillText('Y O R K E R', 128, 292);}
  });
  const front = texture(256, 320, ctx => {
    ctx.fillStyle = kit.trim; ctx.strokeStyle = kit.trim; ctx.lineWidth = 2;
    // A fictional stitched shield, not a real team's mark.
    ctx.beginPath(); ctx.moveTo(158, 45); ctx.lineTo(196, 45); ctx.lineTo(195, 74);
    ctx.quadraticCurveTo(177, 92, 159, 74); ctx.closePath(); ctx.stroke();
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.font = '700 21px YorkerCondensed,"Arial Narrow",Arial,sans-serif'; ctx.fillText(badge, 177, 65, 30);
    ctx.fillRect(60, 56, 29, 3); ctx.fillRect(68, 63, 21, 3);
    if (options.role !== 'umpire') {
      ctx.font = '600 31px YorkerCondensed,"Arial Narrow",Arial,sans-serif';
      ctx.fillText(options.club ?? 'YORKER', 128, 154, 218);
      ctx.font = '500 12px Arial,sans-serif'; ctx.globalAlpha = .65; ctx.fillText('C R I C K E T', 128, 183);
    } else {
      ctx.font = '600 22px YorkerCondensed,"Arial Narrow",Arial,sans-serif'; ctx.fillText('MATCH OFFICIAL', 128, 148, 220);
    }
  });
  return {back, front};
}

export function createKitMaterial(options: PlayerOptions, surfaces: PlayerSurfaces) {
  const {kit, role} = options, skin = new T.Color(kit.skin), hair = new T.Color(kit.hair);
  const gloved = role === 'batter' || role === 'keeper';
  const palette = [
    skin, skin, new T.Color(kit.hand || (gloved ? '#e6e5dd' : kit.skin)), hair,
    kit.beard ? hair.clone().lerp(skin, .32) : skin.clone(),
    new T.Color(kit.shirt), new T.Color(kit.shirt).multiplyScalar(.84),
    new T.Color(kit.sleeve || kit.shirt), new T.Color(kit.trousers),
    new T.Color(kit.shoes || '#e8e8df'), new T.Color('#41454a'),
  ];
  const art = kitArtwork(options), trim = new T.Color(kit.trim);
  const material = new T.MeshPhysicalMaterial({roughness: .86, metalness: 0, sheen: .18, sheenRoughness: .9, sheenColor: '#bcc2ca'});
  material.name = 'Yorker performance fabric / skin';
  material.onBeforeCompile = shader => {
    Object.assign(shader.uniforms, {
      uPalette: {value: palette}, uNumber: {value: art.back}, uFront: {value: art.front},
      uFabric: {value: surfaces.fabric}, uTrim: {value: trim}, uMirror: {value: options.left ? 1 : 0},
    });
    shader.vertexShader = `
      attribute float _region; attribute vec2 _kituv;
      varying float vRegion; varying vec2 vKitUV; varying vec3 vRest; varying vec3 vRestNormal;
    ` + shader.vertexShader.replace('#include <begin_vertex>', `#include <begin_vertex>
      vRegion = _region; vKitUV = _kituv; vRest = position; vRestNormal = normal;
    `);
    shader.fragmentShader = `
      uniform vec3 uPalette[11]; uniform vec3 uTrim;
      uniform sampler2D uNumber; uniform sampler2D uFront; uniform sampler2D uFabric; uniform float uMirror;
      varying float vRegion; varying vec2 vKitUV; varying vec3 vRest; varying vec3 vRestNormal;
    ` + shader.fragmentShader
      .replace('#include <map_fragment>', `#include <map_fragment>
        int region = int(clamp(vRegion + .5, 0., 10.));
        bool cloth = region >= 5 && region <= 8;
        vec2 textileUV = vec2(vRest.x + vRest.z * .65, vRest.y) * 28.;
        float textile = texture2D(uFabric, textileUV).r;
        diffuseColor.rgb = uPalette[region];
        if (cloth) {
          diffuseColor.rgb *= .96 + textile * .075;
          float sidePanel = smoothstep(.13, .23, abs(vRest.x));
          if (region == 5) {
            diffuseColor.rgb *= 1. - sidePanel * .2;
            float panelSeam = 1. - smoothstep(.001, .004, abs(abs(vRest.x) - .16));
            diffuseColor.rgb = mix(diffuseColor.rgb, uTrim, panelSeam * .22);
          }
          if (region == 7) {
            float cuff = 1. - smoothstep(.003, .008, abs(abs(vRest.x) - .413));
            diffuseColor.rgb = mix(diffuseColor.rgb, uTrim, cuff * .8);
          }
          if (region == 8) {
            float trouserSeam = 1. - smoothstep(.001, .004, abs(abs(vRest.x) - .143));
            diffuseColor.rgb *= 1. - trouserSeam * .13;
          }
        } else if (region <= 2) {
          diffuseColor.rgb *= .97 + textile * .05;
        } else if (region == 3 || region == 4) {
          diffuseColor.rgb *= .84 + texture2D(uFabric, vRest.xy * vec2(45., 9.)).r * .25;
        }
        if (vKitUV.x >= 0. && vKitUV.x <= 1. && vKitUV.y >= 0. && vKitUV.y <= 1.) {
          vec2 uv = vec2(mix(1. - vKitUV.x, vKitUV.x, uMirror), vKitUV.y);
          vec4 ink = texture2D(uNumber, uv); diffuseColor.rgb = mix(diffuseColor.rgb, ink.rgb, ink.a);
        }
        // Rest-space projection follows the skinned torso without a floating decal mesh.
        if (region == 5 && vRestNormal.z > .45 && vRest.y > 1.22 && vRest.y < 1.65) {
          vec2 uv = vec2(.5 + mix(vRest.x, -vRest.x, uMirror) / .42, (vRest.y - 1.22) / .43);
          if (all(greaterThanEqual(uv, vec2(0.))) && all(lessThanEqual(uv, vec2(1.)))) {
            vec4 ink = texture2D(uFront, uv); diffuseColor.rgb = mix(diffuseColor.rgb, ink.rgb, ink.a);
          }
        }
      `)
      .replace('#include <roughnessmap_fragment>', `#include <roughnessmap_fragment>
        roughnessFactor = cloth ? .82 + textile * .12 : region <= 2 ? .57 : region == 9 ? .68 : .88;
      `)
      .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
        float heightDetail = textile * (cloth ? .00016 : region <= 2 ? .000018 : .00004);
        vec3 dx = dFdx(-vViewPosition), dy = dFdy(-vViewPosition);
        vec3 r1 = cross(dy, normal), r2 = cross(normal, dx);
        float determinant = dot(dx, r1);
        normal = normalize(abs(determinant) * normal - sign(determinant) * (dFdx(heightDetail) * r1 + dFdy(heightDetail) * r2));
      `);
  };
  material.customProgramCacheKey = () => 'yorker-tailored-kit-v2';
  material.addEventListener('dispose', () => {art.back.dispose(); art.front.dispose();});
  return material;
}

function planarUV(geometry: T.BufferGeometry) {
  if (geometry.getAttribute('uv')) return;
  geometry.computeBoundingBox();
  const box = geometry.boundingBox!, size = box.getSize(new T.Vector3()), p = geometry.getAttribute('position');
  const uv = new Float32Array(p.count * 2), across = size.x > size.z ? 0 : 2;
  for (let i = 0; i < p.count; i++) {
    uv[i * 2] = (p.getComponent(i, across) - box.min.getComponent(across)) / (size.getComponent(across) || 1);
    uv[i * 2 + 1] = (p.getY(i) - box.min.y) / (size.y || 1);
  }
  geometry.setAttribute('uv', new T.BufferAttribute(uv, 2));
}

/** Keep the licensed equipment geometry, replacing toy-like metallic padding with fabric, leather, rubber and willow. */
export function dressEquipment(object: T.Object3D, kind: 'helmet' | 'bat' | 'pads' | 'gloves', kit: Kit, surfaces: PlayerSurfaces) {
  object.traverse(node => {
    if (!(node instanceof T.Mesh)) return;
    planarUV(node.geometry);
    const source = node.material as T.MeshStandardMaterial, name = source.name;
    let material: T.MeshStandardMaterial;
    if (kind === 'helmet' && name === 'blue') {
      material = new T.MeshPhysicalMaterial({color: kit.shirt, roughness: .29, metalness: .05, clearcoat: .45, clearcoatRoughness: .26});
    } else {
      material = source.clone(); material.metalness = 0;
      if (name === 'chrome') {material.color.set('#a6adb1'); material.metalness = .88; material.roughness = .3;}
      else if (name === 'oak') {material.map = surfaces.willow; material.color.set('#ffffff'); material.roughness = .6;}
      else if (name === 'black') {material.color.set('#22272b'); material.roughness = .9;}
      else if (name === 'cream' || name === 'white') {material.color.set(name === 'white' ? '#e7e5dc' : '#f0eee5'); material.roughness = .82;}
      else if (name === 'blue') {material.color.set(kit.trim).multiplyScalar(.78); material.roughness = .73;}
      else if (name === 'red') {material.color.set('#a54136'); material.roughness = .78;}
      if (kind !== 'helmet' && name !== 'chrome' && name !== 'oak') {
        material.bumpMap = surfaces.fabric; material.bumpScale = kind === 'bat' ? .0008 : .0003;
      }
    }
    material.name = name; material.userData.yorkerOwned = true;
    node.material = material; node.castShadow = true; node.receiveShadow = true;
  });
}

export function ownsPlayerMaterial(material: T.Material) {return !!material.userData.yorkerOwned;}
