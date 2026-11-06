import * as THREE from 'three'
import { FullScreenQuad } from 'three/addons/postprocessing/Pass.js'

/** Floor surfaces live on this layer only: the main camera sees them, the mirrored pass never does. */
export const LAYER_FLOOR = 2
/** What the lite (medium tier) reflection shows: athletes, the ball, hoops, LED boards, screens. */
export const LAYER_REFLECT = 3

/** Shared by every reflective floor material and written by {@link FloorReflection} each frame. */
export const floorReflectionUniforms = {
  tReflect: { value: null as THREE.Texture | null },
  tReflectBlur: { value: null as THREE.Texture | null },
  uReflectMatrix: { value: new THREE.Matrix4() },
  uReflectStrength: { value: 0 },
}

/**
 * Lacquered hardwood: the mirrored scene replaces the environment map in the specular terms where it
 * covers the floor (fresnel and roughness weight it like any reflection), plus a thin gloss layer
 * (`lacquer`, scaled by fresnel) so reflections read at broadcast angles the way they do on a real
 * polished court. With the pass off (`uReflectStrength` 0) the material is unchanged.
 */
export function makeReflective<T extends THREE.MeshStandardMaterial>(m: T, lacquer = 3): T {
  m.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, floorReflectionUniforms, { uLacquer: { value: lacquer } })
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nuniform mat4 uReflectMatrix;\nvarying vec4 vReflectCoord;')
      .replace('#include <project_vertex>', '#include <project_vertex>\nvReflectCoord = uReflectMatrix * ( modelMatrix * vec4( transformed, 1.0 ) );')
    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        '#include <common>\nuniform sampler2D tReflect;\nuniform sampler2D tReflectBlur;\nuniform float uReflectStrength;\nuniform float uLacquer;\nvarying vec4 vReflectCoord;',
      )
      .replace(
        '#include <lights_fragment_maps>',
        /* glsl */ `#include <lights_fragment_maps>
        vec3 hlLacquer = vec3( 0.0 );
        #if defined( RE_IndirectSpecular )
        if ( uReflectStrength > 0.0 ) {
          vec2 ruv = vReflectCoord.xy / vReflectCoord.w;
          // the boards are never perfectly flat: a little ripple keeps the image from looking like glass
          ruv.x += ( material.roughness - 0.4 ) * 0.008;
          vec4 sharp = texture2D( tReflect, ruv );
          vec4 soft = texture2D( tReflectBlur, ruv );
          vec4 rr = mix( sharp, soft, smoothstep( 0.1, 0.45, material.roughness ) );
          float cover = clamp( rr.a, 0.0, 1.0 ) * uReflectStrength;
          vec3 refl = rr.rgb / max( rr.a, 1e-3 );
          radiance = mix( radiance, refl, cover );
          #ifdef USE_CLEARCOAT
          clearcoatRadiance = mix( clearcoatRadiance, sharp.rgb / max( sharp.a, 1e-3 ), clamp( sharp.a, 0.0, 1.0 ) * uReflectStrength );
          #endif
          vec4 gl = mix( sharp, soft, 0.6 );
          float nv = saturate( dot( geometryNormal, geometryViewDir ) );
          float fres = 0.02 + 0.98 * pow( 1.0 - nv, 5.0 );
          // capped so grazing views gloss up without turning the floor into a mirror
          hlLacquer = gl.rgb / max( gl.a, 1e-3 ) * clamp( gl.a, 0.0, 1.0 ) * uReflectStrength * min( fres * uLacquer, 0.42 );
        }
        #endif`,
      )
      .replace('#include <lights_fragment_end>', '#include <lights_fragment_end>\nreflectedLight.indirectSpecular += hlLacquer;')
  }
  m.customProgramCacheKey = () => `hl-reflect-${m.type}`
  return m
}

const BLUR_SHADER = {
  uniforms: { tDiffuse: { value: null as THREE.Texture | null }, uDir: { value: new THREE.Vector2() } },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }`,
  // 9-tap gaussian folded into 5 bilinear fetches
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform vec2 uDir;
    varying vec2 vUv;
    void main() {
      vec4 c = texture2D( tDiffuse, vUv ) * 0.2270270270;
      c += ( texture2D( tDiffuse, vUv + uDir * 1.3846153846 ) + texture2D( tDiffuse, vUv - uDir * 1.3846153846 ) ) * 0.3162162162;
      c += ( texture2D( tDiffuse, vUv + uDir * 3.2307692308 ) + texture2D( tDiffuse, vUv - uDir * 3.2307692308 ) ) * 0.0702702703;
      gl_FragColor = c;
    }`,
}

/**
 * Planar reflection of the scene in the court (plane y = 0). A camera mirrored below the floor renders
 * the scene (or only {@link LAYER_REFLECT} in lite mode) into a half-float target with alpha as
 * coverage; a separable blur, wider vertically, gives the soft streaks of a lacquered floor. Floor
 * materials project it with `uReflectMatrix`.
 */
export class FloorReflection {
  private mode: 0 | 1 | 2 = 0
  /** mode the current targets were created for (MSAA differs between modes) */
  private targetMode: 0 | 1 | 2 = 0
  private rt: THREE.WebGLRenderTarget | null = null
  private blurA: THREE.WebGLRenderTarget | null = null
  private blurB: THREE.WebGLRenderTarget | null = null
  private cam = new THREE.PerspectiveCamera()
  private blurMat = new THREE.ShaderMaterial({ ...BLUR_SHADER, uniforms: THREE.UniformsUtils.clone(BLUR_SHADER.uniforms), depthTest: false, depthWrite: false })
  private quad = new FullScreenQuad(this.blurMat)
  private width = 1
  private height = 1
  private pixelRatio = 1
  private bias = new THREE.Matrix4().set(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 0.5, 0.5, 0, 0, 0, 1)
  private pos = new THREE.Vector3()
  private fwd = new THREE.Vector3()
  private up = new THREE.Vector3()
  private clear = new THREE.Color()

  get active() {
    return this.mode > 0
  }

  setMode(mode: 0 | 1 | 2) {
    if (mode === this.mode) return
    this.mode = mode
    this.cam.layers.set(mode === 1 ? LAYER_REFLECT : 0)
    this.allocate()
  }

  setSize(width: number, height: number, pixelRatio: number) {
    this.width = width
    this.height = height
    this.pixelRatio = pixelRatio
    this.allocate()
  }

  private allocate() {
    if (!this.mode) {
      this.disposeTargets()
      floorReflectionUniforms.uReflectStrength.value = 0
      floorReflectionUniforms.tReflect.value = null
      floorReflectionUniforms.tReflectBlur.value = null
      return
    }
    // full mode at half the drawing buffer, lite at a third
    const scale = this.mode === 2 ? 0.5 : 0.34
    const w = Math.max(16, Math.round(this.width * this.pixelRatio * scale))
    const h = Math.max(16, Math.round(this.height * this.pixelRatio * scale))
    const bw = Math.max(8, Math.round(w / 2))
    const bh = Math.max(8, Math.round(h / 2))
    // a render target's sample count is fixed at creation: rebuild when the mode changes it
    if (this.rt && this.targetMode !== this.mode) this.disposeTargets()
    this.targetMode = this.mode
    if (!this.rt) {
      this.rt = new THREE.WebGLRenderTarget(w, h, { type: THREE.HalfFloatType, samples: this.mode === 2 ? 4 : 0 })
      this.blurA = new THREE.WebGLRenderTarget(bw, bh, { type: THREE.HalfFloatType, depthBuffer: false })
      this.blurB = new THREE.WebGLRenderTarget(bw, bh, { type: THREE.HalfFloatType, depthBuffer: false })
    } else {
      this.rt.setSize(w, h)
      this.blurA!.setSize(bw, bh)
      this.blurB!.setSize(bw, bh)
    }
    floorReflectionUniforms.tReflect.value = this.rt.texture
    floorReflectionUniforms.tReflectBlur.value = this.blurB!.texture
    floorReflectionUniforms.uReflectStrength.value = 1
  }

  /** Renders the mirrored view; call before the main render each frame. */
  render(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
    if (!this.mode || !this.rt || !this.blurA || !this.blurB) return
    camera.updateMatrixWorld()
    const cam = this.cam
    this.pos.setFromMatrixPosition(camera.matrixWorld)
    // never render from below the floor (camera dipping under it would mirror the wrong side)
    if (this.pos.y < 0.05) return
    this.fwd.set(0, 0, -1).transformDirection(camera.matrixWorld)
    this.up.set(0, 1, 0).transformDirection(camera.matrixWorld)
    cam.position.set(this.pos.x, -this.pos.y, this.pos.z)
    cam.up.set(this.up.x, -this.up.y, this.up.z)
    cam.lookAt(this.pos.x + this.fwd.x, -(this.pos.y + this.fwd.y), this.pos.z + this.fwd.z)
    cam.updateMatrixWorld()
    cam.projectionMatrix.copy(camera.projectionMatrix)
    cam.projectionMatrixInverse.copy(camera.projectionMatrixInverse)
    floorReflectionUniforms.uReflectMatrix.value.copy(this.bias).multiply(cam.projectionMatrix).multiply(cam.matrixWorldInverse)

    const prevTarget = renderer.getRenderTarget()
    const prevAuto = renderer.shadowMap.autoUpdate
    const prevAlpha = renderer.getClearAlpha()
    renderer.getClearColor(this.clear)
    const bg = scene.background
    // the shadow map from the main pass is reused; alpha 0 marks "nothing reflected here"
    renderer.shadowMap.autoUpdate = false
    scene.background = null
    renderer.setClearColor(0x000000, 0)
    renderer.setRenderTarget(this.rt)
    renderer.clear()
    renderer.render(scene, cam)
    scene.background = bg

    // streaky blur: a little across, more along the view direction
    const u = this.blurMat.uniforms
    u.tDiffuse.value = this.rt.texture
    u.uDir.value.set(1.2 / this.blurA.width, 0)
    renderer.setRenderTarget(this.blurA)
    this.quad.render(renderer)
    u.tDiffuse.value = this.blurA.texture
    u.uDir.value.set(0, 2.6 / this.blurA.height)
    renderer.setRenderTarget(this.blurB)
    this.quad.render(renderer)

    renderer.setRenderTarget(prevTarget)
    renderer.setClearColor(this.clear, prevAlpha)
    renderer.shadowMap.autoUpdate = prevAuto
  }

  private disposeTargets() {
    this.rt?.dispose()
    this.blurA?.dispose()
    this.blurB?.dispose()
    this.rt = this.blurA = this.blurB = null
  }

  dispose() {
    this.disposeTargets()
    this.blurMat.dispose()
    this.quad.dispose()
    floorReflectionUniforms.uReflectStrength.value = 0
  }
}
