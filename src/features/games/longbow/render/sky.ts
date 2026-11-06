// Sky dome: an original gradient, sun and drifting-cloud shader. It also bakes the scene's reflected light.
import * as T from 'three';
import type {RangeLook} from './common';

const vertexShader = /* glsl */`
varying vec3 vDir;
void main() {
  vec4 world = modelMatrix * vec4(position, 1.0);
  vDir = world.xyz - cameraPosition;
  gl_Position = projectionMatrix * viewMatrix * world;
  gl_Position.z = gl_Position.w; // always on the far plane
}`;

const fragmentShader = /* glsl */`
uniform vec3 zenith; uniform vec3 horizon; uniform vec3 below; uniform vec3 glow;
uniform vec3 sunDir; uniform vec3 sunColour; uniform float sunDisc;
uniform vec3 cloudLight; uniform vec3 cloudShade; uniform float coverage; uniform float haze; uniform vec2 drift;
varying vec3 vDir;

float h21(vec2 p) {p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y);}
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(h21(i), h21(i + vec2(1.0, 0.0)), f.x), mix(h21(i + vec2(0.0, 1.0)), h21(i + vec2(1.0, 1.0)), f.x), f.y);
}
float fbm(vec2 p) {float a = 0.5, s = 0.0; for (int i = 0; i < 5; i++) {s += a * noise(p); p = p * 2.03 + 17.1; a *= 0.5;} return s;}

void main() {
  vec3 d = normalize(vDir);
  float h = d.y, up = clamp(h, 0.0, 1.0);
  vec3 col = mix(horizon, zenith, pow(up, 0.5));
  col = mix(col, horizon, haze * 0.65 * exp(-max(h, 0.0) * 10.0));
  float mu = max(dot(d, sunDir), 0.0);
  col += glow * (pow(mu, 5.0) * 0.16 + pow(mu, 40.0) * 0.4) * (0.5 + 0.5 * haze);
  if (h > 0.0 && coverage > 0.0) {
    vec2 uv = d.xz / (h + 0.1) * 1.4 + drift;
    float n = fbm(uv);
    float cover = smoothstep(1.0 - coverage, 1.0 - coverage + 0.3, n) * smoothstep(0.0, 0.16, h);
    // Thinner towards the sun means lit edges; denser means shadowed undersides.
    float towardSun = fbm(uv + sunDir.xz * 0.18);
    float light = clamp(0.6 + (n - towardSun) * 3.0, 0.0, 1.0);
    vec3 cloud = mix(cloudShade, cloudLight, light) + glow * pow(mu, 6.0) * 0.6;
    col = mix(col, cloud, cover * 0.94);
  }
  col = mix(col, below, smoothstep(0.0, -0.08, h));
  col += sunColour * sunDisc * smoothstep(0.99955, 0.99978, dot(d, sunDir));
  gl_FragColor = vec4(col, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;

export class SkyDome {
  readonly mesh: T.Mesh;
  readonly sunDir = new T.Vector3(0, 1, 0);
  private material: T.ShaderMaterial;

  constructor() {
    this.material = new T.ShaderMaterial({
      side: T.BackSide, depthWrite: false, fog: false, vertexShader, fragmentShader,
      uniforms: {
        zenith: {value: new T.Color()}, horizon: {value: new T.Color()}, below: {value: new T.Color()}, glow: {value: new T.Color()},
        sunDir: {value: this.sunDir}, sunColour: {value: new T.Color()}, sunDisc: {value: 40},
        cloudLight: {value: new T.Color()}, cloudShade: {value: new T.Color()}, coverage: {value: 0.4}, haze: {value: 0.5}, drift: {value: new T.Vector2()},
      },
    });
    this.mesh = new T.Mesh(new T.SphereGeometry(10, 32, 16), this.material);
    // Drawn after the other opaque objects so only visible sky pixels run the cloud shader.
    this.mesh.frustumCulled = false; this.mesh.renderOrder = 10;
  }

  setLook(look: RangeLook) {
    const u = this.material.uniforms, s = look.sky;
    u.zenith.value.set(s.zenith); u.horizon.value.set(s.horizon); u.below.value.set(s.below); u.glow.value.set(s.glow);
    u.cloudLight.value.set(s.cloudLight); u.cloudShade.value.set(s.cloudShade); u.coverage.value = s.clouds; u.haze.value = s.haze;
    u.sunColour.value.set(look.sun.colour);
    this.sunDir.set(...look.sun.dir).normalize();
  }

  /** Keeps the dome on the camera and lets the clouds drift downwind. */
  update(dt: number, camera: T.Camera, wind: {x: number; z: number}, reduced: boolean) {
    this.mesh.position.copy(camera.position);
    if (reduced) return;
    const drift = this.material.uniforms.drift.value as T.Vector2;
    drift.x += (0.004 + wind.x * 0.0012) * dt; drift.y += (0.002 + wind.z * 0.0012) * dt;
  }

  /** Bakes the sky into a prefiltered environment map for image-based lighting. The caller disposes it. */
  bakeEnvironment(renderer: T.WebGLRenderer) {
    const pmrem = new T.PMREMGenerator(renderer), scene = new T.Scene(), u = this.material.uniforms, disc = u.sunDisc.value;
    // The sun's direct light comes from the directional light, so leave its disc out of the bake.
    u.sunDisc.value = 0;
    scene.add(new T.Mesh(this.mesh.geometry, this.material));
    const target = pmrem.fromScene(scene, 0, 0.1, 100);
    u.sunDisc.value = disc; pmrem.dispose();
    return target;
  }

  dispose() {this.mesh.geometry.dispose(); this.material.dispose();}
}
