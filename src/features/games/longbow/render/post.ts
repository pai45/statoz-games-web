// Post-processing for the high tier: depth of field, the bow overlay, bloom, colour grade and output.
import * as T from 'three';
import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer.js';
import {OutputPass} from 'three/examples/jsm/postprocessing/OutputPass.js';
import {FullScreenQuad, Pass} from 'three/examples/jsm/postprocessing/Pass.js';
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass.js';
import {ShaderPass} from 'three/examples/jsm/postprocessing/ShaderPass.js';
import {UnrealBloomPass} from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import type {RangeLook} from './common';

const quadVertex = /* glsl */`varying vec2 vUv; void main() {vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);}`;

/** Gather-style depth of field: pixels away from the focus distance blur, in-focus edges never bleed. */
class FocusPass extends Pass {
  readonly uniforms = {
    tColor: {value: null as T.Texture | null}, tDepth: {value: null as T.Texture | null}, texel: {value: new T.Vector2()},
    focus: {value: 30}, strength: {value: 0}, near: {value: 0.05}, far: {value: 900}, maxRadius: {value: 7},
  };
  private quad = new FullScreenQuad(new T.ShaderMaterial({
    uniforms: this.uniforms, vertexShader: quadVertex, fragmentShader: /* glsl */`
      #include <packing>
      uniform sampler2D tColor; uniform sampler2D tDepth; uniform vec2 texel;
      uniform float focus; uniform float strength; uniform float near; uniform float far; uniform float maxRadius;
      varying vec2 vUv;
      // Explicit level-0 reads: these run after an early exit, where implicit mip selection is undefined.
      float coc(vec2 uv) {
        float z = -perspectiveDepthToViewZ(textureLod(tDepth, uv, 0.0).x, near, far);
        return clamp(abs(z - focus) / (focus * 1.3 + 1.5), 0.0, 1.0) * strength * maxRadius;
      }
      void main() {
        vec4 base = textureLod(tColor, vUv, 0.0);
        float c0 = coc(vUv);
        if (c0 < 0.6) {gl_FragColor = base; return;}
        vec3 sum = base.rgb; float total = 1.0;
        for (int i = 1; i < 20; i++) {
          float r = sqrt(float(i) / 19.0) * c0, a = float(i) * 2.39996323;
          vec2 uv = vUv + vec2(cos(a), sin(a)) * r * texel;
          float w = clamp(coc(uv) - r + 1.0, 0.0, 1.0);
          sum += textureLod(tColor, uv, 0.0).rgb * w; total += w;
        }
        gl_FragColor = vec4(sum / total, base.a);
      }`,
  }));

  setSize(width: number, height: number) {this.uniforms.texel.value.set(1 / width, 1 / height);}

  render(renderer: T.WebGLRenderer, writeBuffer: T.WebGLRenderTarget, readBuffer: T.WebGLRenderTarget) {
    this.uniforms.tColor.value = readBuffer.texture; this.uniforms.tDepth.value = readBuffer.depthTexture;
    renderer.setRenderTarget(this.renderToScreen ? null : writeBuffer); this.quad.render(renderer);
  }

  dispose() {this.quad.material.dispose(); this.quad.dispose();}
}

const GradeShader = {
  uniforms: {tDiffuse: {value: null}, gain: {value: new T.Vector3(1, 1, 1)}, saturation: {value: 1}, vignette: {value: 0.32}, aspect: {value: 16 / 9}},
  vertexShader: quadVertex,
  fragmentShader: /* glsl */`
    uniform sampler2D tDiffuse; uniform vec3 gain; uniform float saturation; uniform float vignette; uniform float aspect;
    varying vec2 vUv;
    void main() {
      vec4 c = texture2D(tDiffuse, vUv);
      float l = dot(c.rgb, vec3(0.2126, 0.7152, 0.0722));
      vec3 col = mix(vec3(l), c.rgb, saturation) * gain;
      vec2 q = (vUv - 0.5) * vec2(aspect / 1.6, 1.0);
      col *= 1.0 - vignette * smoothstep(0.12, 0.72, dot(q, q) * 2.0);
      gl_FragColor = vec4(col, c.a);
    }`,
};

export class PostPipeline {
  private composer: EffectComposer;
  private focus = new FocusPass();
  private overlay: RenderPass;
  private bloom: UnrealBloomPass;
  private grade = new ShaderPass(GradeShader);

  constructor(renderer: T.WebGLRenderer, scene: T.Scene, camera: T.PerspectiveCamera, overlayScene: T.Scene, overlayCamera: T.Camera) {
    const size = renderer.getDrawingBufferSize(new T.Vector2());
    const target = new T.WebGLRenderTarget(Math.max(1, size.x), Math.max(1, size.y), {type: T.HalfFloatType, samples: 4});
    target.depthTexture = new T.DepthTexture(target.width, target.height);
    this.composer = new EffectComposer(renderer, target);
    this.overlay = new RenderPass(overlayScene, overlayCamera); this.overlay.clear = false; this.overlay.clearDepth = true;
    this.bloom = new UnrealBloomPass(new T.Vector2(size.x, size.y), 0.32, 0.5, 1.5);
    this.focus.uniforms.near.value = camera.near; this.focus.uniforms.far.value = camera.far;
    this.composer.addPass(new RenderPass(scene, camera));
    this.composer.addPass(this.focus);
    this.composer.addPass(this.overlay);
    this.composer.addPass(this.bloom);
    this.composer.addPass(this.grade);
    this.composer.addPass(new OutputPass());
  }

  setSize(width: number, height: number, pixelRatio: number) {
    this.composer.setPixelRatio(pixelRatio); this.composer.setSize(width, height);
    this.grade.uniforms.aspect.value = width / height;
  }

  setLook(look: RangeLook) {
    this.grade.uniforms.gain.value.set(...look.grade.gain); this.grade.uniforms.saturation.value = look.grade.saturation;
  }

  /** Renders the world, then the bow over it, through the effect chain to the screen. */
  render(dt: number, overlay: boolean, focus: number, blur: number) {
    this.focus.uniforms.focus.value = focus; this.focus.uniforms.strength.value = blur;
    this.focus.enabled = blur > 0.02; this.overlay.enabled = overlay;
    this.composer.render(dt);
  }

  dispose() {
    this.focus.dispose(); this.bloom.dispose(); this.grade.dispose();
    this.composer.renderTarget1.depthTexture?.dispose(); this.composer.renderTarget2.depthTexture?.dispose();
    this.composer.dispose();
  }
}

/** A light vignette for the low tier, drawn as one transparent quad over the frame. */
export class VignetteOverlay {
  private quad = new FullScreenQuad(new T.ShaderMaterial({
    transparent: true, depthTest: false, depthWrite: false, toneMapped: false,
    uniforms: {strength: {value: 0.28}}, vertexShader: quadVertex,
    fragmentShader: /* glsl */`uniform float strength; varying vec2 vUv; void main() {vec2 q = vUv - 0.5; gl_FragColor = vec4(0.0, 0.0, 0.0, strength * smoothstep(0.12, 0.72, dot(q, q) * 2.4));}`,
  }));

  render(renderer: T.WebGLRenderer) {this.quad.render(renderer);}

  dispose() {this.quad.material.dispose(); this.quad.dispose();}
}
