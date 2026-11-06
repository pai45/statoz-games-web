import * as THREE from 'three'

export type CharQuality = 'low' | 'medium' | 'high'

let quality: CharQuality = 'high'
/** Set by the engine so new characters pick an appropriate shading tier. */
export function setCharacterQuality(q: CharQuality) {
  quality = q
}
export function characterQuality() {
  return quality
}

const AO_VERT_PARS = /* glsl */ `
attribute float ao;
varying float vAO;
`
const AO_FRAG = /* glsl */ `
#include <aomap_fragment>
reflectedLight.indirectDiffuse *= vAO;
reflectedLight.indirectSpecular *= vAO;
reflectedLight.directDiffuse *= mix(1.0, vAO, 0.5);
reflectedLight.directSpecular *= mix(1.0, vAO, 0.35);
`

/** Wrap lighting with a warm scatter band at the terminator: a cheap stand-in for subsurface scattering. */
function skinLightsChunk() {
  const src = THREE.ShaderChunk.lights_physical_pars_fragment
  const target = 'reflectedLight.directDiffuse += irradiance * diffuseBRDF * ( 1.0 - F );'
  if (!src.includes(target)) return src
  return (
    /* glsl */ `
uniform vec3 uScatter;
float gSkinAmt = 1.0;
vec3 skinIrradiance( vec3 n, vec3 l, vec3 lightColor ) {
  float ndl = dot( n, l );
  float hard = clamp( ndl, 0.0, 1.0 );
  float wrap = clamp( ( ndl + 0.42 ) / 1.42, 0.0, 1.0 );
  vec3 band = uScatter * clamp( wrap - hard, 0.0, 1.0 ) * 0.55;
  return mix( vec3( hard ), vec3( mix( hard, wrap, 0.55 ) ) + band, gSkinAmt ) * lightColor;
}
` + src.replace(target, 'reflectedLight.directDiffuse += skinIrradiance( geometryNormal, directLight.direction, directLight.color ) * diffuseBRDF * ( 1.0 - F );')
  )
}

function baseMaterial(physical: boolean, params: THREE.MeshPhysicalMaterialParameters) {
  return physical ? new THREE.MeshPhysicalMaterial(params) : new THREE.MeshStandardMaterial(params as THREE.MeshStandardMaterialParameters)
}

export interface SkinOptions {
  skin: string
  armSleeve: string | null
  legSleeve: string | null
  sock: string
  sockStripe: string | null
}

function scatterFor(skin: THREE.Color) {
  // deeper tones scatter a richer red-brown, lighter tones a pink-orange
  const l = skin.r * 0.3 + skin.g * 0.59 + skin.b * 0.11
  return new THREE.Color().setRGB(0.95, 0.38 + 0.12 * l, 0.25 + 0.1 * l)
}

/** Body skin (with hands): procedural compression sleeves and socks driven by the limb region attribute. */
export function makeSkinMaterial(o: SkinOptions) {
  const physical = quality === 'high'
  const skin = new THREE.Color(o.skin)
  const m = baseMaterial(physical, { color: 0xffffff, roughness: 0.56, metalness: 0 })
  if (physical) {
    const pm = m as THREE.MeshPhysicalMaterial
    pm.clearcoat = 0.12
    pm.clearcoatRoughness = 0.42
    pm.specularIntensity = 0.7
  }
  const u = {
    uSkin: { value: skin },
    uScatter: { value: scatterFor(skin) },
    uArmSleeve: { value: new THREE.Vector4(...new THREE.Color(o.armSleeve ?? '#000000').toArray(), o.armSleeve ? 1 : 0) },
    uLegSleeve: { value: new THREE.Vector4(...new THREE.Color(o.legSleeve ?? '#000000').toArray(), o.legSleeve ? 1 : 0) },
    uSock: { value: new THREE.Color(o.sock) },
    uSockStripe: { value: new THREE.Vector4(...new THREE.Color(o.sockStripe ?? '#000000').toArray(), o.sockStripe ? 1 : 0) },
    uSweat: { value: 0 },
  }
  m.userData.uniforms = u
  m.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, u)
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', `#include <common>\n${AO_VERT_PARS}\nattribute vec2 region;\nvarying vec2 vRegion;`)
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvAO = ao;\nvRegion = region;')
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>\nvarying float vAO;\nvarying vec2 vRegion;\nuniform vec3 uSkin;\nuniform vec4 uArmSleeve;\nuniform vec4 uLegSleeve;\nuniform vec3 uSock;\nuniform vec4 uSockStripe;\nuniform float uSweat;\nfloat gCloth = 0.0;`)
      .replace('#include <lights_physical_pars_fragment>', skinLightsChunk())
      .replace(
        '#include <color_fragment>',
        /* glsl */ `
        {
          float code = vRegion.x;
          float t = vRegion.y;
          float aa = fwidth( t ) * 1.2 + 0.0015;
          vec3 col = uSkin;
          float isR = 1.0 - smoothstep( 0.25, 0.5, abs( code - 2.0 ) );
          float sl = isR * uArmSleeve.a * smoothstep( 0.17 - aa, 0.17 + aa, t ) * ( 1.0 - smoothstep( 0.955 - aa, 0.955 + aa, t ) );
          float isLeg = 1.0 - smoothstep( 0.25, 0.5, min( abs( code - 3.0 ), abs( code - 4.0 ) ) );
          float ls = isLeg * uLegSleeve.a * smoothstep( 0.37 - aa, 0.37 + aa, t ) * ( 1.0 - smoothstep( 0.79 - aa, 0.79 + aa, t ) );
          float sock = isLeg * smoothstep( 0.835 - aa, 0.835 + aa, t );
          float cuff = isLeg * uSockStripe.a * smoothstep( 0.851 - aa, 0.851 + aa, t ) * ( 1.0 - smoothstep( 0.862 - aa, 0.862 + aa, t ) );
          float edgeL = isLeg * ( 1.0 - smoothstep( 0.0, 0.006 + aa, abs( t - 0.835 ) ) ) * 0.18;
          col = mix( col, uArmSleeve.rgb, sl );
          col = mix( col, uLegSleeve.rgb, ls );
          col = mix( col, uSock, sock );
          col = mix( col, uSockStripe.rgb, cuff );
          col *= 1.0 - edgeL;
          gCloth = max( max( sl, ls ), sock );
          diffuseColor.rgb = col;
        }
        `,
      )
      .replace(
        '#include <roughnessmap_fragment>',
        '#include <roughnessmap_fragment>\nroughnessFactor = mix( roughnessFactor * ( 1.0 - 0.35 * uSweat ), 0.68, gCloth );\ngSkinAmt = 1.0 - gCloth;',
      )
      .replace('#include <aomap_fragment>', AO_FRAG)
  }
  m.customProgramCacheKey = () => `hl-skin-${physical}`
  return m
}

let poreTex: THREE.CanvasTexture | null = null
/**
 * Tileable skin micro-relief as a tangent-space normal map: pores, a fine cross-hatch of creases and soft
 * millimetre-scale unevenness that breaks up the specular.
 */
function poreNormalMap() {
  if (poreTex) return poreTex
  const S = 256
  const h = new Float32Array(S * S)
  let seed = 0x2545f491
  const rnd = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0
    return seed / 4294967296
  }
  // soft unevenness: tileable value noise on a 16-cell lattice
  const G = 16
  const lat = new Float32Array(G * G).map(() => rnd())
  for (let y = 0; y < S; y++)
    for (let x = 0; x < S; x++) {
      const gx = (x / S) * G, gy = (y / S) * G
      const x0 = Math.floor(gx), y0 = Math.floor(gy)
      const fx = gx - x0, fy = gy - y0
      const sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy)
      const a = lat[(x0 % G) + G * (y0 % G)], b = lat[((x0 + 1) % G) + G * (y0 % G)]
      const c = lat[(x0 % G) + G * ((y0 + 1) % G)], d = lat[((x0 + 1) % G) + G * ((y0 + 1) % G)]
      const n = a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy
      // fine creases along two directions (integer frequencies keep it tileable)
      const cr = Math.sin((2 * Math.PI * (9 * x + 4 * y)) / S + n * 3) * Math.sin((2 * Math.PI * (-4 * x + 9 * y)) / S + n * 2)
      h[y * S + x] = n * 0.9 + cr * 0.12
    }
  for (let i = 0; i < 1300; i++) {
    const cx = rnd() * S, cy = rnd() * S
    const rad = 0.7 + rnd() * 1.0
    const depth = 0.18 + rnd() * 0.25
    for (let dy = -4; dy <= 4; dy++)
      for (let dx = -4; dx <= 4; dx++) {
        const px = Math.floor(cx) + dx, py = Math.floor(cy) + dy
        const d2 = (px - cx) ** 2 + (py - cy) ** 2
        h[((py + S) % S) * S + ((px + S) % S)] -= depth * Math.exp(-d2 / (rad * rad))
      }
  }
  const c = document.createElement('canvas')
  c.width = S
  c.height = S
  const ctx = c.getContext('2d')!
  const img = ctx.createImageData(S, S)
  const at = (x: number, y: number) => h[((y + S) % S) * S + ((x + S) % S)]
  for (let y = 0; y < S; y++)
    for (let x = 0; x < S; x++) {
      // canvas rows run down, texture v runs up
      const nx = -(at(x + 1, y) - at(x - 1, y)) * 0.9
      const ny = (at(x, y + 1) - at(x, y - 1)) * 0.9
      const l = Math.hypot(nx, ny, 1)
      const o = (y * S + x) * 4
      img.data[o] = Math.round(((nx / l) * 0.5 + 0.5) * 255)
      img.data[o + 1] = Math.round(((ny / l) * 0.5 + 0.5) * 255)
      img.data[o + 2] = Math.round(((1 / l) * 0.5 + 0.5) * 255)
      img.data[o + 3] = 255
    }
  ctx.putImageData(img, 0, 0)
  poreTex = new THREE.CanvasTexture(c)
  poreTex.wrapS = poreTex.wrapT = THREE.RepeatWrapping
  poreTex.anisotropy = 4
  return poreTex
}

/** Face micro-relief through a derivative tangent frame of the face-window coordinates (face vertices only). */
const PORE_FRAG = /* glsl */ `
{
  vec2 puv = vFaceUv * vec2( 15.0, 9.0 );
  vec3 pn = texture2D( uPores, puv ).xyz * 2.0 - 1.0;
  vec3 q0 = dFdx( -vViewPosition ), q1 = dFdy( -vViewPosition );
  vec2 st0 = dFdx( puv ), st1 = dFdy( puv );
  vec3 N = normal;
  vec3 q1perp = cross( q1, N ), q0perp = cross( N, q0 );
  vec3 T = q1perp * st0.x + q0perp * st1.x;
  vec3 B = q1perp * st0.y + q0perp * st1.y;
  float det = max( dot( T, T ), dot( B, B ) );
  float sc = det == 0.0 ? 0.0 : inversesqrt( det );
  vec3 pert = normalize( T * ( pn.x * sc * uPoreScale ) + B * ( pn.y * sc * uPoreScale ) + N * pn.z );
  normal = normalize( mix( N, pert, clamp( ( vFaceFlag - 0.5 ) * 2.0, 0.0, 1.0 ) ) );
}
`

/**
 * Head: the equirect head map (scalp, ears, the cranium) and, on the face mesh (`faceFlag`), the zoomed
 * face-window map, each with its roughness; pores on medium and high; the same subsurface approximation.
 */
export function makeHeadMaterial(map: THREE.Texture, roughnessMap: THREE.Texture, faceMap: THREE.Texture, faceRough: THREE.Texture, skin: string) {
  const physical = quality === 'high'
  const pores = quality !== 'low'
  const m = baseMaterial(physical, { map, roughnessMap, roughness: 1.08, metalness: 0 })
  if (physical) {
    const pm = m as THREE.MeshPhysicalMaterial
    pm.clearcoat = 0.1
    pm.clearcoatRoughness = 0.4
    pm.specularIntensity = 0.72
  }
  const u = {
    uScatter: { value: scatterFor(new THREE.Color(skin)) },
    uSweat: { value: 0 },
    uFaceMap: { value: faceMap },
    uFaceRough: { value: faceRough },
    uPores: { value: pores ? poreNormalMap() : null },
    uPoreScale: { value: physical ? 0.3 : 0.24 },
  }
  m.userData.uniforms = u
  m.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, u)
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', `#include <common>\n${AO_VERT_PARS}\nattribute vec2 faceUv;\nattribute float faceFlag;\nvarying vec2 vFaceUv;\nvarying float vFaceFlag;`)
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvAO = ao;\nvFaceUv = faceUv;\nvFaceFlag = faceFlag;')
    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        '#include <common>\nvarying float vAO;\nuniform float uSweat;\nvarying vec2 vFaceUv;\nvarying float vFaceFlag;\nuniform sampler2D uFaceMap;\nuniform sampler2D uFaceRough;\nuniform sampler2D uPores;\nuniform float uPoreScale;',
      )
      .replace('#include <lights_physical_pars_fragment>', skinLightsChunk())
      .replace(
        '#include <map_fragment>',
        /* glsl */ `
        #ifdef USE_MAP
          diffuseColor *= mix( texture2D( map, vMapUv ), texture2D( uFaceMap, vFaceUv ), step( 0.5, vFaceFlag ) );
        #endif
        `,
      )
      .replace(
        '#include <roughnessmap_fragment>',
        /* glsl */ `
        float roughnessFactor = roughness;
        #ifdef USE_ROUGHNESSMAP
          roughnessFactor *= mix( texture2D( roughnessMap, vRoughnessMapUv ).g, texture2D( uFaceRough, vFaceUv ).g, step( 0.5, vFaceFlag ) );
        #endif
        roughnessFactor *= 1.0 - 0.3 * uSweat;
        gSkinAmt = smoothstep( 0.74, 0.6, roughnessFactor );
        `,
      )
      .replace('#include <normal_fragment_maps>', pores ? `#include <normal_fragment_maps>\n${PORE_FRAG}` : '#include <normal_fragment_maps>')
      .replace('#include <aomap_fragment>', AO_FRAG)
  }
  m.customProgramCacheKey = () => `hl-head-2-${physical}-${pores}`
  return m
}

export interface ClothOptions {
  kind: 'jersey' | 'shorts'
  base: string
  trim: string
  trim2: string
  panel: string | null
  print: THREE.Texture
}

let fabricNormal: THREE.CanvasTexture | null = null
/** Tileable athletic mesh: offset rows of small perforations. */
function fabricNormalMap() {
  if (fabricNormal) return fabricNormal
  const S = 64
  const c = document.createElement('canvas')
  c.width = S
  c.height = S
  const ctx = c.getContext('2d')!
  const img = ctx.createImageData(S, S)
  const holes: [number, number][] = [
    [16, 16],
    [48, 16],
    [0, 48],
    [32, 48],
    [64, 48],
  ]
  for (let y = 0; y < S; y++)
    for (let x = 0; x < S; x++) {
      let nx = 0, ny = 0
      for (const [hx, hy] of holes) {
        for (const oy of [-S, 0, S]) {
          const dx = x - hx, dy = y - (hy + oy)
          const d = Math.hypot(dx, dy)
          if (d < 11) {
            const k = Math.sin((d / 11) * Math.PI) * 0.6
            nx += (dx / (d || 1)) * k
            ny += (dy / (d || 1)) * k
          }
        }
      }
      const o = (y * S + x) * 4
      img.data[o] = Math.round((nx * 0.5 + 0.5) * 255)
      img.data[o + 1] = Math.round((-ny * 0.5 + 0.5) * 255)
      img.data[o + 2] = 255
      img.data[o + 3] = 255
    }
  ctx.putImageData(img, 0, 0)
  fabricNormal = new THREE.CanvasTexture(c)
  fabricNormal.wrapS = fabricNormal.wrapT = THREE.RepeatWrapping
  return fabricNormal
}

/** Jersey / shorts: team colours, side panels, crisp piping from the edge-distance attribute, printed graphics. */
export function makeClothMaterial(o: ClothOptions) {
  const physical = quality === 'high'
  const nm = fabricNormalMap().clone()
  nm.needsUpdate = true
  nm.repeat.set(o.kind === 'jersey' ? 150 : 140, o.kind === 'jersey' ? 95 : 85)
  const m = baseMaterial(physical, { color: 0xffffff, roughness: 0.72, metalness: 0, side: THREE.DoubleSide, normalMap: quality === 'low' ? null : nm, normalScale: new THREE.Vector2(0.35, 0.35) })
  if (physical) {
    const pm = m as THREE.MeshPhysicalMaterial
    pm.sheen = 0.6
    pm.sheenRoughness = 0.55
    pm.sheenColor = new THREE.Color(o.base).lerp(new THREE.Color('#ffffff'), 0.5)
  }
  const u = {
    uBase: { value: new THREE.Color(o.base) },
    uTrim: { value: new THREE.Color(o.trim) },
    uTrim2: { value: new THREE.Color(o.trim2) },
    uPanel: { value: new THREE.Vector4(...new THREE.Color(o.panel ?? o.base).toArray(), o.panel ? 1 : 0) },
    uPrint: { value: o.print },
    uKind: { value: o.kind === 'jersey' ? 0 : 1 },
  }
  m.userData.uniforms = u
  m.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, u)
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', `#include <common>\n${AO_VERT_PARS}\nattribute vec3 cloth;\nvarying vec3 vCloth;\nvarying vec2 vCUv;`)
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvAO = ao;\nvCloth = cloth;\nvCUv = uv;')
    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>\nvarying float vAO;\nvarying vec3 vCloth;\nvarying vec2 vCUv;\nuniform vec3 uBase;\nuniform vec3 uTrim;\nuniform vec3 uTrim2;\nuniform vec4 uPanel;\nuniform sampler2D uPrint;\nuniform float uKind;`,
      )
      .replace(
        '#include <color_fragment>',
        /* glsl */ `
        {
          vec3 col = uBase;
          float side = vCloth.z;
          float aaS = fwidth( side ) * 1.2 + 1e-4;
          float panelEdge = uKind < 0.5 ? 0.93 : 0.955;
          col = mix( col, uPanel.rgb, uPanel.a * smoothstep( panelEdge - aaS, panelEdge + aaS, side ) );
          vec4 pr = texture2D( uPrint, vCUv );
          col = col * ( 1.0 - pr.a ) + pr.rgb;
          float aaE = fwidth( vCloth.x ) * 1.2 + 1e-4;
          float aaF = fwidth( vCloth.y ) * 1.2 + 1e-4;
          if ( uKind < 0.5 ) {
            float e1 = vCloth.x;
            float e2 = vCloth.y;
            float trim = max( 1.0 - smoothstep( 0.0058 - aaE, 0.0058 + aaE, e1 ), 1.0 - smoothstep( 0.0048 - aaF, 0.0048 + aaF, e2 ) );
            float inner = max(
              smoothstep( 0.0058 - aaE, 0.0058 + aaE, e1 ) * ( 1.0 - smoothstep( 0.0074 - aaE, 0.0074 + aaE, e1 ) ),
              smoothstep( 0.0048 - aaF, 0.0048 + aaF, e2 ) * ( 1.0 - smoothstep( 0.0062 - aaF, 0.0062 + aaF, e2 ) )
            );
            col = mix( col, uTrim2, inner );
            col = mix( col, uTrim, trim );
          } else {
            float band = 1.0 - smoothstep( 0.0165 - aaE, 0.0165 + aaE, vCloth.x );
            float stripe = smoothstep( 0.006 - aaE, 0.006 + aaE, vCloth.x ) * ( 1.0 - smoothstep( 0.0095 - aaE, 0.0095 + aaE, vCloth.x ) );
            col = mix( col, mix( uTrim, uTrim2, stripe ), band );
            float hem = 1.0 - smoothstep( 0.0055 - aaF, 0.0055 + aaF, vCloth.y );
            float hem2 = smoothstep( 0.0055 - aaF, 0.0055 + aaF, vCloth.y ) * ( 1.0 - smoothstep( 0.0072 - aaF, 0.0072 + aaF, vCloth.y ) );
            col = mix( col, uTrim2, hem2 );
            col = mix( col, uTrim, hem );
          }
          if ( !gl_FrontFacing ) col *= 0.42;
          diffuseColor.rgb = col;
        }
        `,
      )
      .replace('#include <aomap_fragment>', AO_FRAG)
  }
  m.customProgramCacheKey = () => `hl-cloth-${physical}-${quality === 'low'}`
  return m
}

export interface ShoeOptions {
  upper: string
  accent: string
  sole: string
  outsole: string
  lace: string
}

/**
 * Sneaker colourway computed per pixel in shoe space: cupsole, outsole, heel counter, collar, side flash,
 * laces. A procedural bump layer adds the close-up detail the mesh can't carry (sculpted midsole groove,
 * ribbed outsole wall, herringbone tread, stitching, toe perforations, raised laces) and fades out once
 * the pattern is smaller than a pixel, so gameplay distance never shimmers.
 */
export function makeShoeMaterial(o: ShoeOptions) {
  const m = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5, metalness: 0 })
  const u = {
    uUpper: { value: new THREE.Color(o.upper) },
    uAccent: { value: new THREE.Color(o.accent) },
    uSole: { value: new THREE.Color(o.sole) },
    uOutsole: { value: new THREE.Color(o.outsole) },
    uLace: { value: new THREE.Color(o.lace) },
  }
  m.userData.uniforms = u
  m.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, u)
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', `#include <common>\n${AO_VERT_PARS}\nattribute vec3 shoeLocal;\nvarying vec3 vShoe;`)
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvAO = ao;\nvShoe = shoeLocal;')
    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>\nvarying float vAO;\nvarying vec3 vShoe;\nuniform vec3 uUpper;\nuniform vec3 uAccent;\nuniform vec3 uSole;\nuniform vec3 uOutsole;\nuniform vec3 uLace;\nfloat gSole = 0.0;\nfloat gShoeH = 0.0;\nfloat gShoeRough = 0.45;`,
      )
      .replace(
        '#include <color_fragment>',
        /* glsl */ `
        {
          vec3 p = vShoe;
          float aa = fwidth( p.y ) * 1.2 + 1e-4;
          float aaz = fwidth( p.z ) * 1.2 + 1e-4;
          float soleTop = -0.039 + mix( 0.0148, 0.0104, smoothstep( -0.02, 0.07, p.z ) ) + 0.003 * smoothstep( 0.095, 0.135, p.z );
          float sole = 1.0 - smoothstep( soleTop - aa, soleTop + aa, p.y );
          float outs = 1.0 - smoothstep( -0.0356 - aa, -0.0356 + aa, p.y );
          float heel = ( 1.0 - smoothstep( -0.017 - aaz, -0.017 + aaz, p.z + 0.04 * ( p.y + 0.03 ) ) ) * ( 1.0 - sole );
          float collar = smoothstep( 0.0035 - aa, 0.0035 + aa, p.y );
          float sideWall = smoothstep( 0.011, 0.015, abs( p.x ) );
          float zc = clamp( ( p.z + 0.012 ) / 0.105, 0.0, 1.0 );
          float curveY = -0.0285 + 0.021 * ( 1.0 - zc ) * ( 1.0 - zc );
          float flash = ( 1.0 - smoothstep( 0.0026 * ( 1.2 - zc * 0.7 ) - aa, 0.0026 * ( 1.2 - zc * 0.7 ) + aa, abs( p.y - curveY ) ) ) * step( -0.012, p.z ) * ( 1.0 - smoothstep( 0.088, 0.096, p.z ) ) * sideWall;
          float laceZone = ( 1.0 - smoothstep( 0.0072, 0.0092, abs( p.x ) ) ) * smoothstep( 0.002, 0.008, p.z ) * ( 1.0 - smoothstep( 0.052, 0.058, p.z ) ) * smoothstep( -0.022, -0.014, p.y );
          float laces = laceZone * smoothstep( 0.35, 0.5, abs( fract( p.z * 160.0 + abs( p.x ) * 60.0 ) - 0.5 ) * 2.0 );
          vec3 col = uUpper;
          col = mix( col, uAccent, max( heel, collar ) );
          col = mix( col, uAccent, flash );
          col = mix( col, mix( uUpper * 0.8, uLace, 0.85 ), laceZone * 0.6 );
          col = mix( col, uLace, laces );
          col = mix( col, uSole, sole );
          col = mix( col, uOutsole, outs );
          gSole = sole;

          // ---- close-up relief (heights in tenths of a millimetre-ish; faded below pixel size)
          float fw = max( fwidth( p.z ), fwidth( p.y ) );
          float detail = 1.0 - smoothstep( 0.00028, 0.0007, fw );
          float midsole = sole * ( 1.0 - outs );
          float gy = -0.0333 + 0.0011 * sin( p.z * 70.0 + 0.6 );
          float groove = 1.0 - smoothstep( 0.00035, 0.0009, abs( p.y - gy ) );
          float ribs = 0.5 + 0.5 * sin( p.z * 540.0 + abs( p.x ) * 120.0 );
          float bottom = 1.0 - smoothstep( -0.0386, -0.0379, p.y );
          float herring = step( 0.5, fract( ( p.z + abs( p.x ) * 0.85 ) * 270.0 ) );
          float flashW = 0.0026 * ( 1.2 - zc * 0.7 );
          float stitchPath = 1.0 - smoothstep( 0.00022, 0.00048, abs( abs( p.y - curveY ) - flashW - 0.0011 ) );
          float heelPath = 1.0 - smoothstep( 0.00022, 0.00048, abs( p.z + 0.04 * ( p.y + 0.03 ) + 0.0182 ) );
          float dashes = step( 0.42, fract( ( p.z + p.y ) * 540.0 ) );
          float stitch = max( stitchPath * step( -0.012, p.z ) * ( 1.0 - smoothstep( 0.086, 0.094, p.z ) ) * sideWall, heelPath * ( 1.0 - sole ) ) * dashes;
          float toe = smoothstep( 0.084, 0.092, p.z ) * ( 1.0 - sole ) * smoothstep( -0.034, -0.03, p.y );
          vec2 pg = fract( vec2( p.z * 640.0, ( p.x * 0.8 + p.y ) * 640.0 ) ) - 0.5;
          float holes = ( 1.0 - smoothstep( 0.16, 0.27, length( pg ) ) ) * toe;
          float h = -0.65 * groove * midsole + 0.35 * ribs * outs * ( 1.0 - bottom ) + 0.55 * herring * bottom
            - 0.4 * stitch - 0.5 * holes + 0.6 * laces;
          gShoeH = h * detail;
          col *= 1.0 - 0.18 * holes * detail - 0.25 * groove * midsole * detail;
          gShoeRough = mix( mix( 0.44, 0.62, toe ), 0.74, laces );
          gShoeRough = mix( gShoeRough, 0.5, max( heel, collar ) * 0.6 );
          gShoeRough = mix( gShoeRough, 0.62, midsole );
          gShoeRough = mix( gShoeRough, 0.86, outs );
          diffuseColor.rgb = col;
        }
        `,
      )
      .replace('#include <roughnessmap_fragment>', '#include <roughnessmap_fragment>\nroughnessFactor = gShoeRough;')
      .replace(
        '#include <normal_fragment_maps>',
        /* glsl */ `#include <normal_fragment_maps>
        {
          // derivative bump (as perturbNormalArb) from the procedural relief
          vec3 sp = -vViewPosition;
          vec3 dpx = dFdx( sp );
          vec3 dpy = dFdy( sp );
          vec3 r1 = cross( dpy, normal );
          vec3 r2 = cross( normal, dpx );
          float det = dot( dpx, r1 );
          vec3 grad = sign( det ) * ( dFdx( gShoeH ) * r1 + dFdy( gShoeH ) * r2 ) * 0.0011;
          normal = normalize( abs( det ) * normal - grad );
        }`,
      )
      .replace('#include <aomap_fragment>', AO_FRAG)
  }
  m.customProgramCacheKey = () => 'hl-shoe-2'
  return m
}

const eyeMats = new Map<THREE.Texture, THREE.MeshStandardMaterial>()
/** Wet eyes, one shared material per iris texture. */
export function getEyeMaterial(map: THREE.Texture) {
  let m = eyeMats.get(map)
  if (!m) {
    m = new THREE.MeshStandardMaterial({ map, roughness: 0.07, metalness: 0, envMapIntensity: 1.5 })
    eyeMats.set(map, m)
  }
  return m
}

/** Hair: tinted strand texture; shells discard against a noise mask that thins toward the tips. */
export function makeHairMaterial(color: string, map: THREE.Texture, shells: boolean) {
  const c = new THREE.Color(color)
  // near-black hair still needs a little value to catch highlights
  const hsl = { h: 0, s: 0, l: 0 }
  c.getHSL(hsl)
  if (hsl.l < 0.09) c.setHSL(hsl.h, Math.min(0.35, hsl.s), 0.09)
  const m = new THREE.MeshStandardMaterial({ color: c, map, roughness: 0.62, metalness: 0, side: shells ? THREE.DoubleSide : THREE.FrontSide })
  m.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', `#include <common>\n${AO_VERT_PARS}\nattribute float shell;\nvarying float vShell;`)
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvAO = ao;\nvShell = shell;')
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying float vAO;\nvarying float vShell;')
      .replace(
        '#include <map_fragment>',
        shells
          ? /* glsl */ `
          {
            vec4 h = texture2D( map, vMapUv );
            if ( vShell > 0.001 && h.r < vShell * 0.86 + 0.06 ) discard;
            diffuseColor.rgb *= mix( 0.42, 1.0, vShell ) * ( 0.75 + 0.5 * h.g );
          }
          `
          : /* glsl */ `
          {
            vec4 h = texture2D( map, vMapUv );
            diffuseColor.rgb *= 0.55 + 0.6 * h.g;
          }
          `,
      )
      .replace('#include <aomap_fragment>', AO_FRAG)
  }
  m.customProgramCacheKey = () => `hl-hair-${shells}`
  return m
}

/** Terry-cloth / elastic accessories (headbands, wristbands). */
export function makeGearMaterial(color: string) {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.85, metalness: 0 })
}
