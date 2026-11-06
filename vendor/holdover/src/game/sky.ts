import * as THREE from 'three'

import type { TimePresetId } from './data.ts'

export interface TimePreset {
  id: TimePresetId
  label: string
  sunElevation: number
  sunAzimuth: number
  sunColor: string
  sunIntensity: number
  sunDisc: number
  hemiSky: string
  hemiGround: string
  hemiIntensity: number
  envIntensity: number
  zenith: string
  horizon: string
  ground: string
  fogColor: string
  sunGlow: string
  fogDensity: number
  fogFalloff: number
  exposure: number
  clouds: number
  cloudColor: string
  stars: number
  bloom: number
  saturation: number
  contrast: number
  tint: string
  night: boolean
}

export const TIME_PRESETS: Record<TimePresetId, TimePreset> = {
  dawn: {
    id: 'dawn',
    label: 'Dawn',
    sunElevation: 6,
    sunAzimuth: 62,
    sunColor: '#ffb07a',
    sunIntensity: 3.3,
    sunDisc: 14,
    hemiSky: '#a7b5cf',
    hemiGround: '#5c4c42',
    hemiIntensity: 0.55,
    envIntensity: 0.95,
    zenith: '#3f5b86',
    horizon: '#f0b48f',
    ground: '#7a6a62',
    fogColor: '#c7a598',
    sunGlow: '#ffc08a',
    fogDensity: 0.00062,
    fogFalloff: 0.012,
    exposure: 1.08,
    clouds: 0.4,
    cloudColor: '#f2bea4',
    stars: 0.08,
    bloom: 0.42,
    saturation: 1.1,
    contrast: 1.08,
    tint: '#fff1e6',
    night: false,
  },
  day: {
    id: 'day',
    label: 'Morning',
    sunElevation: 32,
    sunAzimuth: 118,
    sunColor: '#fff0da',
    sunIntensity: 3.3,
    sunDisc: 10,
    hemiSky: '#b9cde6',
    hemiGround: '#7a6a55',
    hemiIntensity: 0.5,
    envIntensity: 0.85,
    zenith: '#3a6aa6',
    horizon: '#c4d6e4',
    ground: '#8f8576',
    fogColor: '#b7c6d2',
    sunGlow: '#fff2dc',
    fogDensity: 0.00042,
    fogFalloff: 0.01,
    exposure: 1.02,
    clouds: 0.3,
    cloudColor: '#f4f6f8',
    stars: 0,
    bloom: 0.26,
    saturation: 1.02,
    contrast: 1.06,
    tint: '#ffffff',
    night: false,
  },
  noon: {
    id: 'noon',
    label: 'Noon',
    sunElevation: 64,
    sunAzimuth: 168,
    sunColor: '#fff6e8',
    sunIntensity: 3.4,
    sunDisc: 8,
    hemiSky: '#c7d4e2',
    hemiGround: '#8b7860',
    hemiIntensity: 0.42,
    envIntensity: 0.9,
    zenith: '#4a7bb4',
    horizon: '#d8dcda',
    ground: '#a39886',
    fogColor: '#cfd1c9',
    sunGlow: '#fff4dc',
    fogDensity: 0.0005,
    fogFalloff: 0.012,
    exposure: 0.9,
    clouds: 0.18,
    cloudColor: '#ffffff',
    stars: 0,
    bloom: 0.22,
    saturation: 0.98,
    contrast: 1.08,
    tint: '#fff8ee',
    night: false,
  },
  overcast: {
    id: 'overcast',
    label: 'Overcast',
    sunElevation: 38,
    sunAzimuth: 215,
    sunColor: '#d9dde2',
    sunIntensity: 0.9,
    sunDisc: 0,
    hemiSky: '#aeb7c1',
    hemiGround: '#6b675e',
    hemiIntensity: 0.95,
    envIntensity: 1.25,
    zenith: '#7a848f',
    horizon: '#a9afb4',
    ground: '#7d7b74',
    fogColor: '#a0a6aa',
    sunGlow: '#b9bfc4',
    fogDensity: 0.0009,
    fogFalloff: 0.009,
    exposure: 1.14,
    clouds: 0.96,
    cloudColor: '#8f969d',
    stars: 0,
    bloom: 0.14,
    saturation: 0.82,
    contrast: 1.02,
    tint: '#eef2f5',
    night: false,
  },
  dusk: {
    id: 'dusk',
    label: 'Dusk',
    sunElevation: 4,
    sunAzimuth: 302,
    sunColor: '#ff8a4e',
    sunIntensity: 3.1,
    sunDisc: 18,
    hemiSky: '#7b85a8',
    hemiGround: '#4c3d38',
    hemiIntensity: 0.5,
    envIntensity: 0.8,
    zenith: '#283662',
    horizon: '#ff9862',
    ground: '#6b5450',
    fogColor: '#a77a6c',
    sunGlow: '#ffae6c',
    fogDensity: 0.0007,
    fogFalloff: 0.011,
    exposure: 1.06,
    clouds: 0.42,
    cloudColor: '#e38a68',
    stars: 0.15,
    bloom: 0.55,
    saturation: 1.08,
    contrast: 1.08,
    tint: '#ffe9dc',
    night: false,
  },
  night: {
    id: 'night',
    label: 'Night',
    sunElevation: 28,
    sunAzimuth: 322,
    sunColor: '#9db4ff',
    sunIntensity: 0.6,
    sunDisc: 5,
    hemiSky: '#2a3654',
    hemiGround: '#0f1218',
    hemiIntensity: 0.42,
    envIntensity: 0.35,
    zenith: '#050913',
    horizon: '#1a2537',
    ground: '#0d1118',
    fogColor: '#141c2a',
    sunGlow: '#2c3c5c',
    fogDensity: 0.0008,
    fogFalloff: 0.01,
    exposure: 1.6,
    clouds: 0.22,
    cloudColor: '#1d2534',
    stars: 1,
    bloom: 0.7,
    saturation: 0.8,
    contrast: 1.04,
    tint: '#dfe8ff',
    night: true,
  },
}

export function sunDirection(preset: TimePreset, target = new THREE.Vector3()): THREE.Vector3 {
  const elevation = THREE.MathUtils.degToRad(preset.sunElevation)
  const azimuth = THREE.MathUtils.degToRad(preset.sunAzimuth)
  return target.set(
    Math.sin(azimuth) * Math.cos(elevation),
    Math.sin(elevation),
    -Math.cos(azimuth) * Math.cos(elevation),
  )
}

// ---------------------------------------------------------------------------
// Height fog with sun in-scattering, patched into every built-in material.
// Float32Array uniform values are shared by reference across cloned materials.

export const fogShared = {
  fogSunDir: { value: new Float32Array([0, 1, 0]) },
  fogSunColor: { value: new Float32Array([1, 1, 1]) },
  fogParams: { value: new Float32Array([0.01, 1]) },
}

let fogPatched = false

export function patchFogShaders(): void {
  if (fogPatched) return
  fogPatched = true
  THREE.ShaderChunk.fog_pars_vertex = /* glsl */ `
#ifdef USE_FOG
  varying vec3 vFogWorld;
#endif`
  THREE.ShaderChunk.fog_vertex = /* glsl */ `
#ifdef USE_FOG
  // mvPosition exists in every built-in vertex shader (including sprites). The view
  // matrix is rigid, so its transposed rotation maps view space back to world space.
  vFogWorld = cameraPosition + transpose( mat3( viewMatrix ) ) * mvPosition.xyz;
#endif`
  THREE.ShaderChunk.fog_pars_fragment = /* glsl */ `
#ifdef USE_FOG
  uniform vec3 fogColor;
  uniform vec3 fogSunDir;
  uniform vec3 fogSunColor;
  uniform vec2 fogParams;
  varying vec3 vFogWorld;
  #ifdef FOG_EXP2
    uniform float fogDensity;
  #else
    uniform float fogNear;
    uniform float fogFar;
  #endif
#endif`
  THREE.ShaderChunk.fog_fragment = /* glsl */ `
#ifdef USE_FOG
  vec3 fogRay = vFogWorld - cameraPosition;
  float fogDist = length( fogRay );
  vec3 fogDir = fogRay / max( fogDist, 1e-4 );
  #ifdef FOG_EXP2
    float fogFy = fogRay.y * fogParams.x;
    float fogHeightTerm = abs( fogFy ) > 1e-4 ? ( 1.0 - exp( -fogFy ) ) / fogFy : 1.0;
    float fogAmount = fogDensity * exp( -cameraPosition.y * fogParams.x ) * fogDist * fogHeightTerm;
    float fogFactor = 1.0 - exp( -fogAmount );
  #else
    float fogFactor = smoothstep( fogNear, fogFar, fogDist );
  #endif
  float fogSun = pow( max( dot( fogDir, fogSunDir ), 0.0 ), 8.0 ) * fogParams.y;
  vec3 fogTint = mix( fogColor, fogSunColor, fogSun );
  gl_FragColor.rgb = mix( gl_FragColor.rgb, fogTint, clamp( fogFactor, 0.0, 1.0 ) );
#endif`
  const libraries = ['basic', 'lambert', 'phong', 'standard', 'physical', 'toon', 'matcap', 'points', 'dashed', 'sprite', 'shadow']
  for (const name of libraries) {
    const library = THREE.ShaderLib[name]
    if (library) Object.assign(library.uniforms, fogShared)
  }
}

// ---------------------------------------------------------------------------
// Sky dome

const skyVertex = /* glsl */ `
varying vec3 vDir;
void main() {
  vDir = normalize( position );
  vec4 world = modelMatrix * vec4( position, 1.0 );
  gl_Position = projectionMatrix * viewMatrix * world;
  gl_Position.z = gl_Position.w * 0.99999;
}`

const skyFragment = /* glsl */ `
uniform vec3 uZenith;
uniform vec3 uHorizon;
uniform vec3 uGround;
uniform vec3 uSunDir;
uniform vec3 uSunColor;
uniform vec3 uGlow;
uniform vec3 uCloudColor;
uniform float uSunDisc;
uniform float uClouds;
uniform float uStars;
uniform float uTime;
varying vec3 vDir;

float hash( vec2 p ) {
  p = fract( p * vec2( 123.34, 456.21 ) );
  p += dot( p, p + 45.32 );
  return fract( p.x * p.y );
}
float noise( vec2 p ) {
  vec2 i = floor( p );
  vec2 f = fract( p );
  vec2 u = f * f * ( 3.0 - 2.0 * f );
  return mix( mix( hash( i ), hash( i + vec2( 1.0, 0.0 ) ), u.x ), mix( hash( i + vec2( 0.0, 1.0 ) ), hash( i + vec2( 1.0, 1.0 ) ), u.x ), u.y );
}
float fbm( vec2 p ) {
  float sum = 0.0;
  float amplitude = 0.5;
  for ( int i = 0; i < 5; i++ ) {
    sum += amplitude * noise( p );
    p = p * 2.07 + vec2( 17.1, 9.3 );
    amplitude *= 0.5;
  }
  return sum;
}

void main() {
  vec3 dir = normalize( vDir );
  float h = dir.y;
  vec3 color = mix( uHorizon, uZenith, pow( smoothstep( 0.0, 0.62, h ), 0.72 ) );
  color = mix( color, uGround, smoothstep( 0.0, -0.06, h ) );
  float sunDot = dot( dir, uSunDir );
  float glow = pow( max( sunDot, 0.0 ), 5.0 );
  color += uGlow * ( glow * 0.38 + pow( max( sunDot, 0.0 ), 48.0 ) * 0.55 ) * ( 1.0 - uClouds * 0.6 );

  if ( uClouds > 0.0 && h > -0.02 ) {
    vec2 cloudUv = dir.xz / max( h + 0.08, 0.04 ) * 0.42;
    float n = fbm( cloudUv * 1.3 + uTime * vec2( 0.006, 0.002 ) );
    float detail = fbm( cloudUv * 4.1 - uTime * vec2( 0.004, 0.0 ) );
    float coverage = smoothstep( 1.0 - uClouds * 0.92, 1.12 - uClouds * 0.55, n + detail * 0.22 );
    coverage *= smoothstep( -0.02, 0.16, h );
    vec3 lit = uCloudColor * ( 0.72 + 0.55 * pow( max( sunDot, 0.0 ), 3.0 ) ) + uGlow * glow * 0.25;
    vec3 shade = mix( lit, uCloudColor * 0.55, smoothstep( 0.4, 1.0, detail ) );
    color = mix( color, shade, coverage * 0.92 );
  }

  if ( uSunDisc > 0.0 ) {
    float disc = smoothstep( 0.99955, 0.99975, sunDot );
    color += uSunColor * disc * uSunDisc * ( 1.0 - uClouds * 0.85 );
  }

  if ( uStars > 0.0 && h > 0.0 ) {
    vec2 cell = floor( vec2( atan( dir.x, dir.z ) * 260.0, h * 420.0 ) );
    float star = hash( cell );
    float twinkle = 0.65 + 0.35 * sin( uTime * 2.3 + star * 91.0 );
    color += vec3( 0.75, 0.82, 1.0 ) * step( 0.9965, star ) * uStars * twinkle * smoothstep( 0.02, 0.25, h ) * 1.6 * ( 1.0 - uClouds );
  }
  gl_FragColor = vec4( color, 1.0 );
}`

export interface SkyUniforms {
  [uniform: string]: THREE.IUniform
  uZenith: THREE.IUniform<THREE.Color>
  uHorizon: THREE.IUniform<THREE.Color>
  uGround: THREE.IUniform<THREE.Color>
  uSunDir: THREE.IUniform<THREE.Vector3>
  uSunColor: THREE.IUniform<THREE.Color>
  uGlow: THREE.IUniform<THREE.Color>
  uCloudColor: THREE.IUniform<THREE.Color>
  uSunDisc: THREE.IUniform<number>
  uClouds: THREE.IUniform<number>
  uStars: THREE.IUniform<number>
  uTime: THREE.IUniform<number>
}

export function createSkyMaterial(): THREE.ShaderMaterial & { uniforms: SkyUniforms } {
  const uniforms: SkyUniforms = {
    uZenith: { value: new THREE.Color() },
    uHorizon: { value: new THREE.Color() },
    uGround: { value: new THREE.Color() },
    uSunDir: { value: new THREE.Vector3(0, 1, 0) },
    uSunColor: { value: new THREE.Color() },
    uGlow: { value: new THREE.Color() },
    uCloudColor: { value: new THREE.Color() },
    uSunDisc: { value: 10 },
    uClouds: { value: 0.3 },
    uStars: { value: 0 },
    uTime: { value: 0 },
  }
  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: skyVertex,
    fragmentShader: skyFragment,
    side: THREE.BackSide,
    depthWrite: false,
    depthTest: true,
    fog: false,
  })
  return material as THREE.ShaderMaterial & { uniforms: SkyUniforms }
}

export function applySkyPreset(uniforms: SkyUniforms, preset: TimePreset, includeSun = true): void {
  uniforms.uZenith.value.set(preset.zenith)
  uniforms.uHorizon.value.set(preset.horizon)
  uniforms.uGround.value.set(preset.ground)
  sunDirection(preset, uniforms.uSunDir.value)
  uniforms.uSunColor.value.set(preset.sunColor)
  uniforms.uGlow.value.set(preset.sunGlow)
  uniforms.uCloudColor.value.set(preset.cloudColor)
  uniforms.uSunDisc.value = includeSun ? preset.sunDisc : 0
  uniforms.uClouds.value = preset.clouds
  uniforms.uStars.value = preset.stars
}

export function applyFogPreset(fog: THREE.FogExp2, preset: TimePreset): void {
  fog.color.set(preset.fogColor)
  fog.density = preset.fogDensity
  const sun = sunDirection(preset)
  fogShared.fogSunDir.value.set([sun.x, sun.y, sun.z])
  const glow = new THREE.Color(preset.sunGlow)
  fogShared.fogSunColor.value.set([glow.r, glow.g, glow.b])
  fogShared.fogParams.value.set([preset.fogFalloff, preset.night ? 0.35 : 0.85])
}

/** Prefiltered sky lighting for metals and ambient fill. */
export function buildEnvironment(renderer: THREE.WebGLRenderer, preset: TimePreset): THREE.WebGLRenderTarget {
  const scene = new THREE.Scene()
  const material = createSkyMaterial()
  applySkyPreset(material.uniforms, preset, false)
  const geometry = new THREE.SphereGeometry(40, 32, 16)
  scene.add(new THREE.Mesh(geometry, material))
  const generator = new THREE.PMREMGenerator(renderer)
  const target = generator.fromScene(scene, 0.035, 0.1, 100)
  generator.dispose()
  geometry.dispose()
  material.dispose()
  return target
}
