import * as THREE from 'three'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import { GTAOPass } from 'three/addons/postprocessing/GTAOPass.js'
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js'

/**
 * GTAO that reuses the depth the main render pass already produced (normals are reconstructed from
 * it), so ambient occlusion costs two screen-space passes instead of a second scene render.
 */
class DepthAOPass extends GTAOPass {
  override render(renderer: THREE.WebGLRenderer, writeBuffer: THREE.WebGLRenderTarget, readBuffer: THREE.WebGLRenderTarget, deltaTime: number, maskActive: boolean) {
    const depth = readBuffer.depthTexture
    if (depth && this.depthTexture !== depth) this.setGBuffer(depth)
    super.render(renderer, writeBuffer, readBuffer, deltaTime, maskActive)
  }
}

/**
 * Final image: ACES tone mapping and sRGB encoding (what OutputPass does) plus the broadcast grade in
 * display space: gentle contrast, a touch of saturation, cool shadows and warm highlights, a soft
 * vignette and sub-LSB dither so the dark stands never band.
 */
const FinalShader = {
  name: 'HoopLegacyFinal',
  uniforms: {
    tDiffuse: { value: null as THREE.Texture | null },
    toneMappingExposure: { value: 1 },
    uAspect: { value: 1 },
    uTime: { value: 0 },
    uContrast: { value: 1.06 },
    uSaturation: { value: 1.07 },
    uShadowTint: { value: new THREE.Vector3(-0.006, 0.0, 0.014) },
    uHighTint: { value: new THREE.Vector3(0.014, 0.006, -0.01) },
    uVignette: { value: 0.26 },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }`,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float uAspect;
    uniform float uTime;
    uniform float uContrast;
    uniform float uSaturation;
    uniform vec3 uShadowTint;
    uniform vec3 uHighTint;
    uniform float uVignette;
    // colorspace_pars_fragment (sRGBTransferOETF) comes with three's prefix; the tone mapping chunk
    // is included here because the material opts out of automatic tone mapping
    #include <tonemapping_pars_fragment>
    varying vec2 vUv;
    float hash12( vec2 p ) {
      vec3 p3 = fract( vec3( p.xyx ) * 0.1031 );
      p3 += dot( p3, p3.yzx + 33.33 );
      return fract( ( p3.x + p3.y ) * p3.z );
    }
    void main() {
      vec4 c = texture2D( tDiffuse, vUv );
      c.rgb = ACESFilmicToneMapping( c.rgb );
      c = sRGBTransferOETF( c );
      vec3 g = c.rgb;
      float l = dot( g, vec3( 0.2126, 0.7152, 0.0722 ) );
      g = mix( vec3( l ), g, uSaturation );
      // contrast as a soft S-curve around mid grey, so blacks and whites roll off instead of clipping
      vec3 s = g * g * ( 3.0 - 2.0 * g );
      g = mix( g, s, ( uContrast - 1.0 ) * 2.0 );
      g += uShadowTint * ( 1.0 - smoothstep( 0.0, 0.5, l ) ) + uHighTint * smoothstep( 0.45, 1.0, l );
      vec2 d = ( vUv - 0.5 ) * vec2( uAspect, 1.0 );
      g *= 1.0 - uVignette * smoothstep( 0.42, 1.25, length( d ) * 1.25 );
      g += ( hash12( gl_FragCoord.xy + fract( uTime ) * 61.0 ) - 0.5 ) / 255.0;
      gl_FragColor = vec4( clamp( g, 0.0, 1.0 ), 1.0 );
    }`,
}

export interface PostOptions {
  bloom: boolean
  ao: boolean
  samples: number
}

/** HDR render target → (GTAO) → (bloom) → tone map + grade, sized to the drawing buffer. */
export class PostStack {
  readonly composer: EffectComposer
  readonly options: PostOptions
  private bloom: UnrealBloomPass | null = null
  private ao: DepthAOPass | null = null
  private final: ShaderPass
  private renderer: THREE.WebGLRenderer
  private time = 0

  constructor(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.PerspectiveCamera, opts: PostOptions, width: number, height: number) {
    this.renderer = renderer
    this.options = opts
    const size = renderer.getDrawingBufferSize(new THREE.Vector2())
    // only add the key when AO needs depth: an explicit `depthTexture: undefined` overrides three's
    // `null` default and makes the RenderTarget setter throw
    const rt = new THREE.WebGLRenderTarget(size.x, size.y, {
      type: THREE.HalfFloatType,
      samples: opts.samples,
      ...(opts.ao ? { depthTexture: new THREE.DepthTexture(size.x, size.y) } : {}),
    })
    this.composer = new EffectComposer(renderer, rt)
    this.composer.addPass(new RenderPass(scene, camera))
    if (opts.ao) {
      // seeded with the render pass target's depth so GTAO never allocates its own normal/depth pass
      const ao = new DepthAOPass(scene, camera, size.x, size.y, { depthTexture: this.composer.renderTarget2.depthTexture ?? undefined })
      ao.updateGtaoMaterial({ radius: 0.55, distanceExponent: 1.4, thickness: 1.6, scale: 1, samples: 12, distanceFallOff: 1, screenSpaceRadius: false })
      ao.updatePdMaterial({ lumaPhi: 10, depthPhi: 2, normalPhi: 3, radius: 6, radiusExponent: 1, rings: 2, samples: 12 })
      ao.blendIntensity = 0.85
      this.ao = ao
      this.composer.addPass(ao)
    }
    if (opts.bloom) {
      this.bloom = new UnrealBloomPass(new THREE.Vector2(width / 2, height / 2), 0.32, 0.55, 0.92)
      this.composer.addPass(this.bloom)
    }
    this.final = new ShaderPass(FinalShader)
    this.final.material.toneMapped = false
    this.composer.addPass(this.final)
    this.setSize(width, height, renderer.getPixelRatio())
  }

  setSize(width: number, height: number, pixelRatio: number) {
    this.composer.setPixelRatio(pixelRatio)
    this.composer.setSize(width, height)
    this.bloom?.resolution.set(width / 2, height / 2)
    this.final.uniforms.uAspect.value = width / Math.max(1, height)
  }

  render(dt: number) {
    this.time += dt
    this.final.uniforms.uTime.value = this.time
    this.final.uniforms.toneMappingExposure.value = this.renderer.toneMappingExposure
    this.composer.render(dt)
  }

  dispose() {
    this.ao?.dispose()
    this.bloom?.dispose()
    this.final.dispose()
    this.composer.renderTarget1.depthTexture?.dispose()
    this.composer.renderTarget2.depthTexture?.dispose()
    this.composer.dispose()
  }
}
