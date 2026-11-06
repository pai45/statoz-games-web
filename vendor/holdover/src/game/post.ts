// Post-processing: HDR scene + viewmodel, bloom, ACES output, then display-space grading
// that also renders the scope lens, thermal imaging, and bullet-cam effects.
import * as THREE from 'three'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'

const GradeShader = {
  uniforms: {
    tDiffuse: { value: null as THREE.Texture | null },
    uResolution: { value: new THREE.Vector2(1, 1) },
    uTime: { value: 0 },
    uScope: { value: 0 },
    uScopeRadius: { value: 0.46 },
    uScopeOffset: { value: new THREE.Vector2() },
    uThermal: { value: 0 },
    uDamage: { value: 0 },
    uFlash: { value: 0 },
    uSaturation: { value: 1 },
    uContrast: { value: 1 },
    uTint: { value: new THREE.Color(1, 1, 1) },
    uVignette: { value: 0.35 },
    uGrain: { value: 0.035 },
    uBlur: { value: 0 },
    uMirage: { value: 0 },
    uLetterbox: { value: 0 },
    uFade: { value: 0 },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }`,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform vec2 uResolution;
    uniform float uTime;
    uniform float uScope;
    uniform float uScopeRadius;
    uniform vec2 uScopeOffset;
    uniform float uThermal;
    uniform float uDamage;
    uniform float uFlash;
    uniform float uSaturation;
    uniform float uContrast;
    uniform vec3 uTint;
    uniform float uVignette;
    uniform float uGrain;
    uniform float uBlur;
    uniform float uMirage;
    uniform float uLetterbox;
    uniform float uFade;
    varying vec2 vUv;

    float hash( vec2 p ) {
      p = fract( p * vec2( 443.897, 441.423 ) );
      p += dot( p, p.yx + 19.19 );
      return fract( ( p.x + p.y ) * p.x );
    }

    void main() {
      float aspect = uResolution.x / uResolution.y;
      vec2 uv = vUv;
      vec2 centered = ( vUv - 0.5 ) * vec2( aspect, 1.0 );
      if ( uMirage > 0.0 ) {
        float w = sin( vUv.y * 210.0 + uTime * 3.3 ) * cos( vUv.x * 90.0 - uTime * 1.7 );
        uv.x += w * 0.00045 * uMirage;
        uv.y += sin( vUv.x * 160.0 + uTime * 2.1 ) * 0.00025 * uMirage;
      }
      vec3 color;
      if ( uBlur > 0.001 ) {
        vec2 toCenter = vec2( 0.5 ) - uv;
        vec3 sum = vec3( 0.0 );
        for ( int i = 0; i < 10; i++ ) {
          float t = float( i ) / 9.0;
          sum += texture2D( tDiffuse, uv + toCenter * t * uBlur * 0.12 ).rgb;
        }
        color = sum / 10.0;
      } else {
        color = texture2D( tDiffuse, uv ).rgb;
      }
      float lens = 0.0;
      if ( uScope > 0.001 ) {
        vec2 q = centered - uScopeOffset;
        float r = length( q ) / uScopeRadius;
        // Chromatic fringing toward the lens edge.
        vec2 dir = q / max( length( q ), 1e-4 );
        float ca = smoothstep( 0.62, 1.0, r ) * 0.0045 * uScope;
        vec2 shift = vec2( dir.x / aspect, dir.y ) * ca;
        color.r = mix( color.r, texture2D( tDiffuse, uv + shift ).r, uScope );
        color.b = mix( color.b, texture2D( tDiffuse, uv - shift ).b, uScope );
        // Lens transmission falloff and a faint coating tint.
        color *= mix( 1.0, 1.0 - 0.5 * pow( clamp( r, 0.0, 1.0 ), 3.0 ), uScope );
        color *= mix( vec3( 1.0 ), vec3( 0.97, 1.0, 1.02 ), uScope );
        lens = smoothstep( 0.975, 1.0, r ) * uScope;
      }
      if ( uThermal > 0.001 ) {
        float l = dot( color, vec3( 0.299, 0.587, 0.114 ) );
        l = pow( clamp( l * 1.7, 0.0, 1.0 ), 0.85 );
        l += ( hash( vUv * uResolution + floor( uTime * 30.0 ) ) - 0.5 ) * 0.06;
        vec3 thermal = vec3( l ) * vec3( 0.97, 1.0, 0.98 );
        color = mix( color, thermal, uThermal );
      }
      color = ( color - 0.5 ) * uContrast + 0.5;
      float luma = dot( color, vec3( 0.2126, 0.7152, 0.0722 ) );
      color = mix( vec3( luma ), color, uSaturation ) * uTint;
      float vig = smoothstep( 0.95, 0.25, length( ( vUv - 0.5 ) * vec2( 1.0, 0.85 ) ) * 1.15 );
      color *= mix( 1.0 - uVignette, 1.0, vig );
      if ( uDamage > 0.001 ) {
        float edge = 1.0 - smoothstep( 0.15, 0.75, length( ( vUv - 0.5 ) * vec2( 1.0, 1.1 ) ) );
        float grey = dot( color, vec3( 0.333 ) );
        color = mix( color, vec3( grey ), uDamage * 0.5 );
        color = mix( color, vec3( 0.45, 0.02, 0.02 ), ( 1.0 - edge ) * uDamage * 0.85 );
      }
      color += vec3( 1.0, 0.95, 0.85 ) * uFlash;
      color += ( hash( vUv * uResolution + fract( uTime ) * 100.0 ) - 0.5 ) * uGrain;
      color = mix( color, vec3( 0.0 ), lens );
      if ( abs( vUv.y - 0.5 ) > 0.5 - uLetterbox ) color = vec3( 0.0 );
      color = mix( color, vec3( 0.0 ), uFade );
      gl_FragColor = vec4( max( color, 0.0 ), 1.0 );
    }`,
}

export type GradeUniforms = typeof GradeShader.uniforms

export class PostFX {
  readonly composer: EffectComposer
  readonly scenePass: RenderPass
  readonly viewPass: RenderPass
  readonly bloom: UnrealBloomPass
  readonly grade: ShaderPass
  readonly uniforms: GradeUniforms
  private readonly renderer: THREE.WebGLRenderer
  private samples: number

  constructor(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.Camera, viewScene: THREE.Scene, viewCamera: THREE.Camera, samples: number) {
    this.renderer = renderer
    this.samples = samples
    const target = this.createTarget(samples)
    this.composer = new EffectComposer(renderer, target)
    this.scenePass = new RenderPass(scene, camera)
    this.viewPass = new RenderPass(viewScene, viewCamera)
    this.viewPass.clear = false
    this.viewPass.clearDepth = true
    this.bloom = new UnrealBloomPass(new THREE.Vector2(512, 512), 0.3, 0.55, 0.86)
    this.grade = new ShaderPass(GradeShader)
    this.uniforms = this.grade.uniforms as unknown as GradeUniforms
    this.composer.addPass(this.scenePass)
    this.composer.addPass(this.viewPass)
    this.composer.addPass(this.bloom)
    this.composer.addPass(new OutputPass())
    this.composer.addPass(this.grade)
  }

  private createTarget(samples: number): THREE.WebGLRenderTarget {
    const size = this.renderer.getDrawingBufferSize(new THREE.Vector2())
    return new THREE.WebGLRenderTarget(Math.max(1, size.x), Math.max(1, size.y), { type: THREE.HalfFloatType, samples })
  }

  setSamples(samples: number): void {
    if (samples === this.samples) return
    this.samples = samples
    const target = this.createTarget(samples)
    this.composer.reset(target)
  }

  setSize(width: number, height: number): void {
    this.composer.setPixelRatio(this.renderer.getPixelRatio())
    this.composer.setSize(width, height)
    this.uniforms.uResolution.value.set(width * this.renderer.getPixelRatio(), height * this.renderer.getPixelRatio())
  }

  render(delta: number): void {
    this.composer.render(delta)
  }
}
