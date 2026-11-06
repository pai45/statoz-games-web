import * as T from 'three';
import {PITCH, POPPING, BOWLING_POPPING, WIDE_LINE} from './physics';
import type {PitchId, Venue} from './data';

/**
 * The ground: textured, mown outfield (ambientCG CC0 grass), a worn pitch (ambientCG CC0 soil), CC0 stumps and
 * bails from 3DAssets.dev, and an original stadium bowl with an instanced crowd, roof, floodlights and LED boards.
 */
export type StadiumAssets = {grass: T.Texture; pitch: T.Texture; sky: Record<Venue['time'], T.Texture>; wicket: T.Object3D; bails: T.Object3D};
export const BOUNDARY_CENTRE = -PITCH/2;
const V = (x = 0, y = 0, z = 0) => new T.Vector3(x, y, z);

function canvasTexture(w: number, h: number, draw: (ctx: CanvasRenderingContext2D) => void, srgb = true) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d')!);
  const t = new T.CanvasTexture(c); if (srgb) t.colorSpace = T.SRGBColorSpace; t.anisotropy = 8; return t;
}
/** Deterministic hash noise; the renderer never consumes the simulation RNG. */
const hash = (n: number) => {const s = Math.sin(n*127.1)*43758.5453; return s-Math.floor(s);};

export type Stumps = {group: T.Group; stumps: T.Object3D[]; bails: T.Object3D[]; rest: {p: T.Vector3; q: T.Quaternion}[]};

export class Stadium {
  group = new T.Group();
  sun: T.DirectionalLight; hemi: T.HemisphereLight; fill: T.DirectionalLight;
  crowd!: T.InstancedMesh; crowdUniforms = {uTime: {value: 0}, uExcite: {value: 0}, uStandLight: {value: .65}};
  private pitchUniforms = {uPitchWear: {value: .65}, uPitchGreen: {value: .02}};
  floodGlow: T.Sprite[] = []; floodPanels: T.Mesh[] = [];
  ends: Stumps[] = [];
  boards!: T.Texture; screen!: {texture: T.CanvasTexture; ctx: CanvasRenderingContext2D};
  targetMarker = new T.Group(); zoneMarker = new T.Group(); lengthBands = new T.Group(); pitchDots = new T.Group();
  private markerRing: T.Mesh; private markerScatter: T.Mesh; private sightMaterial: T.MeshStandardMaterial;
  private pmrem: T.PMREMGenerator; private envs = new Map<string, T.Texture>();
  private time: Venue['time'] = 'day';

  constructor(private renderer: T.WebGLRenderer, private scene: T.Scene, private assets: StadiumAssets) {
    this.pmrem = new T.PMREMGenerator(renderer);
    this.hemi = new T.HemisphereLight('#dceeff', '#4c6a33', 1);
    this.sun = new T.DirectionalLight('#fff1d8', 3);
    this.sun.castShadow = true; this.sun.shadow.mapSize.set(2048, 2048);
    Object.assign(this.sun.shadow.camera, {left: -22, right: 22, top: 26, bottom: -26, near: 20, far: 220});
    this.sun.shadow.bias = -.0001; this.sun.shadow.normalBias = .01;
    this.fill = new T.DirectionalLight('#cfe0ff', .6);
    this.group.add(this.hemi, this.sun, this.sun.target, this.fill, this.fill.target);
    this.sun.target.position.set(0, 0, -9); this.fill.target.position.set(0, 0, -9);
    this.sightMaterial = new T.MeshStandardMaterial({color: '#111316', roughness: .9});
    this.ground(); this.pitch(); this.stands(); this.lights(); this.sightScreens(); this.wickets();
    // Planning overlays on the pitch.
    const ringMat = new T.MeshBasicMaterial({color: '#ffd35a', transparent: true, opacity: .98, depthWrite: false, toneMapped: false});
    this.markerRing = new T.Mesh(new T.RingGeometry(.16, .23, 48), ringMat); this.markerRing.rotation.x = -Math.PI/2;
    const dot = new T.Mesh(new T.CircleGeometry(.05, 24), ringMat); dot.rotation.x = -Math.PI/2;
    const halo = new T.Mesh(new T.CircleGeometry(.42, 40), new T.MeshBasicMaterial({color: '#ffcf4a', transparent: true, opacity: .16, depthWrite: false, toneMapped: false})); halo.rotation.x = -Math.PI/2; this.targetMarker.add(halo);
    this.markerScatter = new T.Mesh(new T.RingGeometry(.97, 1, 48), new T.MeshBasicMaterial({color: '#ffffff', transparent: true, opacity: .45, depthWrite: false, toneMapped: false})); this.markerScatter.rotation.x = -Math.PI/2;
    this.targetMarker.add(this.markerRing, dot, this.markerScatter); this.targetMarker.position.y = .012; this.targetMarker.renderOrder = 3;
    this.group.add(this.targetMarker, this.zoneMarker, this.lengthBands, this.pitchDots);
    this.makeLengthBands();
    scene.add(this.group);
  }

  /* ---------- Turf ---------- */
  private ground() {
    const grass = this.assets.grass; grass.wrapS = grass.wrapT = T.RepeatWrapping; grass.repeat.set(70, 70); grass.colorSpace = T.SRGBColorSpace; grass.anisotropy = 8;
    const material = new T.MeshStandardMaterial({map: grass, bumpMap: grass, bumpScale: .018, color: '#9ca481', roughness: .98});
    material.onBeforeCompile = shader => {
      shader.vertexShader = 'varying vec3 vWorldPos;\n'+shader.vertexShader.replace('#include <worldpos_vertex>', '#include <worldpos_vertex>\nvWorldPos=(modelMatrix*vec4(transformed,1.)).xyz;');
      shader.fragmentShader = 'varying vec3 vWorldPos;\nfloat yhash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}\nfloat ynoise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(yhash(i),yhash(i+vec2(1,0)),f.x),mix(yhash(i+vec2(0,1)),yhash(i+vec2(1,1)),f.x),f.y);}\n'+shader.fragmentShader.replace('#include <map_fragment>', `#include <map_fragment>
vec2 w=vWorldPos.xz;
float stripe=smoothstep(-.13,.13,sin((w.x+2.5)*.6283185));
vec2 c=w-vec2(0.,${BOUNDARY_CENTRE.toFixed(2)});
float r=length(c);
float ring=1.-smoothstep(.06,.13,abs(r-27.4));
float wear=1.-smoothstep(2.,14.,length(vec2(c.x*.55,c.y*.16)));
float n=ynoise(w*.08)*.5+ynoise(w*.31)*.3+ynoise(w*1.7)*.2;
float luma=dot(diffuseColor.rgb,vec3(.2126,.7152,.0722));
diffuseColor.rgb=mix(vec3(luma),diffuseColor.rgb,.76);
diffuseColor.rgb*=mix(.93,1.045,stripe)*(.91+.15*n);
diffuseColor.rgb=mix(diffuseColor.rgb,diffuseColor.rgb*vec3(1.08,1.02,.82),wear*.35);
diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.73),ring*.65*step(.5,fract(atan(c.x,c.y)*28.)));`);
    };
    material.customProgramCacheKey = () => 'yorker-turf-v2';
    const field = new T.Mesh(new T.CircleGeometry(98, 128), material);
    field.rotation.x = -Math.PI/2; field.position.set(0, 0, BOUNDARY_CENTRE); field.receiveShadow = true; this.group.add(field);
    const squareMap = grass.clone(); squareMap.repeat.set(7, 11);
    const square = new T.Mesh(new T.PlaneGeometry(18.5, PITCH+6), new T.MeshStandardMaterial({map: squareMap, color: '#949a6c', roughness: 1, polygonOffset: true, polygonOffsetFactor: 0, polygonOffsetUnits: -1}));
    square.rotation.x = -Math.PI/2; square.position.set(0, .002, BOUNDARY_CENTRE); square.receiveShadow = true; this.group.add(square);
    const retired = canvasTexture(128, 512, ctx => {
      const fade = ctx.createLinearGradient(0, 0, 128, 0); fade.addColorStop(0, 'rgba(132,117,76,0)'); fade.addColorStop(.12, 'rgba(132,117,76,.26)'); fade.addColorStop(.88, 'rgba(132,117,76,.26)'); fade.addColorStop(1, 'rgba(132,117,76,0)');
      ctx.fillStyle = fade; ctx.fillRect(0, 0, 128, 512);
      for (let i = 0; i < 1800; i++) {ctx.fillStyle = `rgba(99,101,61,${hash(i)*.13})`; ctx.fillRect(hash(i*2.7)*128, hash(i*3.9)*512, 1, 3);}
    });
    const retiredMat = new T.MeshStandardMaterial({map: retired, transparent: true, depthWrite: false, roughness: 1, polygonOffset: true, polygonOffsetFactor: 0, polygonOffsetUnits: -3});
    for (const x of [-7.2, -3.65, 3.65, 7.2]) {
      const old = new T.Mesh(new T.PlaneGeometry(3.3, PITCH+3.5), retiredMat);
      old.rotation.x = -Math.PI/2; old.position.set(x, .003, BOUNDARY_CENTRE); old.receiveShadow = true; this.group.add(old);
    }
  }
  private pitch() {
    const soil = this.assets.pitch; soil.wrapS = soil.wrapT = T.RepeatWrapping; soil.colorSpace = T.SRGBColorSpace; soil.repeat.set(1.6, 12); soil.anisotropy = 8;
    // Creases, wide guidelines, footmarks and wear are painted into an overlay at 64 px per metre.
    const W = 3.66, L = PITCH+5, ppm = 64;
    const marks = canvasTexture(Math.round(W*ppm), Math.round(L*ppm), ctx => {
      const X = (x: number) => (x+W/2)*ppm, Z = (z: number) => (z-(2.5-L))*ppm;
      ctx.clearRect(0, 0, W*ppm, L*ppm);
      // Worn, scuffed areas where bowlers land and batters stand.
      for (const [cz, spread] of [[POPPING-.3, 1.1], [BOWLING_POPPING+.2, 1.6]] as const) for (let i = 0; i < 120; i++) {
        const x = (hash(i+cz*13)-.5)*1.5, z = cz+(hash(i*3.7+cz)-.5)*spread*2, r = 6+hash(i*1.9)*20;
        const g = ctx.createRadialGradient(X(x), Z(z), 0, X(x), Z(z), r); g.addColorStop(0, 'rgba(96,70,40,.28)'); g.addColorStop(1, 'rgba(96,70,40,0)'); ctx.fillStyle = g; ctx.fillRect(X(x)-r, Z(z)-r, r*2, r*2);
      }
      // Small boot scrapes rather than large uniformly blurred patches.
      for (let i = 0; i < 110; i++) {
        const near = i%2 === 0, z = (near ? POPPING-.2 : BOWLING_POPPING+.1)+(hash(i*4.9)-.5)*1.9;
        const x = (hash(i*2.3)-.5)*1.25;
        ctx.save(); ctx.translate(X(x), Z(z)); ctx.rotate((hash(i*9.2)-.5)*.8);
        ctx.strokeStyle = `rgba(84,67,40,${.08+hash(i*.7)*.13})`; ctx.lineWidth = .6;
        for (let j = 0; j < 5; j++) {ctx.beginPath(); ctx.moveTo(j*1.2-3, -4); ctx.lineTo(j*1.2-3, 5+hash(i+j)*7); ctx.stroke();}
        ctx.restore();
      }
      ctx.fillStyle = 'rgba(255,255,250,.94)';
      const line = (x0: number, z0: number, x1: number, z1: number, t = .05) => {const x = Math.min(X(x0), X(x1)), y = Math.min(Z(z0), Z(z1)); ctx.fillRect(x-t*ppm/2*(x0 === x1 ? 1 : 0), y-t*ppm/2*(z0 === z1 ? 1 : 0), Math.max(Math.abs(X(x1)-X(x0)), x0 === x1 ? t*ppm : 0), Math.max(Math.abs(Z(z1)-Z(z0)), z0 === z1 ? t*ppm : 0));};
      for (const [stumps, popping, dirz] of [[0, POPPING, 1], [-PITCH, BOWLING_POPPING, -1]] as const) {
        line(-1.32, stumps, 1.32, stumps);
        line(-W/2, popping, W/2, popping);
        for (const x of [-1.32, 1.32]) line(x, popping, x, stumps+dirz*1.22);
        for (const x of [-WIDE_LINE, WIDE_LINE]) line(x, popping, x, popping-dirz*.65, .04);
      }
    });
    const cracks = canvasTexture(256, 1536, ctx => {
      for (let i = 0; i < 65; i++) {
        let x = hash(i*3.2)*256, y = hash(i*8.1)*1536;
        ctx.beginPath(); ctx.moveTo(x, y);
        for (let j = 0; j < 5; j++) {x += (hash(i*5.9+j)-.5)*9; y += 4+hash(i*6.3+j)*12; ctx.lineTo(x, y);}
        ctx.strokeStyle = `rgba(85,64,36,${.12+hash(i)*.16})`; ctx.lineWidth = .4+hash(i*5)*.45; ctx.stroke();
      }
      for (let i = 0; i < 6500; i++) {
        ctx.fillStyle = i%3 ? 'rgba(100,84,47,.1)' : 'rgba(227,215,179,.16)';
        ctx.fillRect(hash(i*.83)*256, hash(i*1.73)*1536, .5+hash(i*7.7), .5+hash(i*2.1)*2);
      }
    });
    const material = new T.MeshStandardMaterial({map: soil, bumpMap: soil, bumpScale: .008, color: '#d1bc94', roughness: .97});
    material.onBeforeCompile = shader => {
      Object.assign(shader.uniforms, this.pitchUniforms, {uMarks: {value: marks}, uCracks: {value: cracks}});
      shader.vertexShader = 'varying vec2 vMarkUv;\n'+shader.vertexShader.replace('#include <uv_vertex>', '#include <uv_vertex>\nvMarkUv=uv;');
      shader.fragmentShader = 'uniform sampler2D uMarks; uniform sampler2D uCracks; uniform float uPitchWear; uniform float uPitchGreen; varying vec2 vMarkUv;\n'+shader.fragmentShader.replace('#include <map_fragment>', `#include <map_fragment>
float edge=smoothstep(0.,.06,vMarkUv.x)*(1.-smoothstep(.94,1.,vMarkUv.x));
diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.64,.53,.36),.23);
diffuseColor.rgb=mix(diffuseColor.rgb*vec3(.72,.86,.55),diffuseColor.rgb,edge);
diffuseColor.rgb=mix(diffuseColor.rgb,diffuseColor.rgb*vec3(.7,.88,.52),uPitchGreen);
vec4 crack=texture2D(uCracks,vMarkUv);diffuseColor.rgb=mix(diffuseColor.rgb,crack.rgb,crack.a*uPitchWear);
vec4 mk=texture2D(uMarks,vMarkUv);diffuseColor.rgb=mix(diffuseColor.rgb,mk.rgb,mk.a);`);
    };
    material.customProgramCacheKey = () => 'yorker-pitch-v2';
    material.addEventListener('dispose', () => {marks.dispose(); cracks.dispose();});
    // The strip runs from 2.5 m behind the striker's stumps to beyond the bowler's end; canvas row 0 is the far end.
    const strip = new T.Mesh(new T.PlaneGeometry(W, L), material);
    strip.rotation.x = -Math.PI/2; strip.position.set(0, .006, 2.5-L/2); strip.receiveShadow = true; this.group.add(strip);
  }
  private makeLengthBands() {
    // Length zones (from the striker's stumps) shown while planning.
    const bands: [number, number, string][] = [[1.2, 2, '#ff5a4a'], [2, 3.8, '#6fd3ff'], [3.8, 6.2, '#ffd04a'], [6.2, 8.2, '#7cffb2'], [8.2, 12.6, '#c48bff']];
    for (const [a, b, color] of bands) {
      const m = new T.Mesh(new T.PlaneGeometry(2.6, b-a), new T.MeshBasicMaterial({color, transparent: true, opacity: .055, depthWrite: false, toneMapped: false}));
      m.rotation.x = -Math.PI/2; m.position.set(0, .009, -(a+b)/2); this.lengthBands.add(m);
      const edge = new T.Mesh(new T.PlaneGeometry(2.6, .03), new T.MeshBasicMaterial({color, transparent: true, opacity: .45, depthWrite: false, toneMapped: false}));
      edge.rotation.x = -Math.PI/2; edge.position.set(0, .01, -a); this.lengthBands.add(edge);
    }
  }

  /* ---------- Stands, crowd, boards ---------- */
  private stands() {
    const concrete = new T.MeshStandardMaterial({color: '#697279', roughness: .95, side: T.DoubleSide}), seats = new T.MeshStandardMaterial({color: '#293b46', roughness: .95, side: T.DoubleSide});
    const roofMat = new T.MeshStandardMaterial({color: '#939da5', roughness: .78, metalness: .25, side: T.DoubleSide});
    const R0 = 76, gap = .17;
    // Three tiers of stepped terraces; gaps behind each bowling end hold the sight screens.
    const terrace: T.Vector2[] = [];
    let r = R0, y = 0;
    terrace.push(new T.Vector2(r, 0));
    for (let tier = 0; tier < 3; tier++) {
      for (let row = 0; row < 9; row++) {y += .55; terrace.push(new T.Vector2(r, y)); r += .95; terrace.push(new T.Vector2(r, y));}
      if (tier < 2) {y += 2.4; terrace.push(new T.Vector2(r, y)); r += 1.5; terrace.push(new T.Vector2(r, y));}
    }
    terrace.push(new T.Vector2(r+2, y+1.2), new T.Vector2(r+2, -.5));
    for (const [start, length] of [[gap, Math.PI-2*gap], [Math.PI+gap, Math.PI-2*gap]]) {
      const lathe = new T.LatheGeometry(terrace, 72, start, length);
      const stand = new T.Mesh(lathe, seats); stand.position.z = BOUNDARY_CENTRE; stand.receiveShadow = true; this.group.add(stand);
      const roof = new T.Mesh(new T.LatheGeometry([new T.Vector2(r+2, y+7.5), new T.Vector2(r-14, y+9.5)], 72, start, length), roofMat);
      roof.position.z = BOUNDARY_CENTRE; this.group.add(roof);
      const back = new T.Mesh(new T.CylinderGeometry(r+2, r+2, y+8, 72, 1, true, start, length), concrete);
      back.position.set(0, (y+8)/2, BOUNDARY_CENTRE); this.group.add(back);
    }
    const steel = new T.MeshStandardMaterial({color: '#3e484f', roughness: .68, metalness: .45});
    const structure: T.Matrix4[] = [], beam = new T.Object3D();
    const strut = (a: T.Vector3, b: T.Vector3) => {
      const axis = b.clone().sub(a); beam.position.copy(a).add(b).multiplyScalar(.5);
      beam.quaternion.setFromUnitVectors(V(0, 1, 0), axis.clone().normalize()); beam.scale.set(1, axis.length(), 1); beam.updateMatrix();
      structure.push(beam.matrix.clone());
    };
    for (let i = 0; i < 48; i++) {
      const a = i/48*Math.PI*2, wrapped = a%Math.PI;
      if (wrapped < gap || wrapped > Math.PI-gap) continue;
      const point = (radius: number, height: number) => V(Math.sin(a)*radius, height, BOUNDARY_CENTRE+Math.cos(a)*radius);
      strut(point(r+1, .4), point(r+1, y+7.4));
      strut(point(r+1, y+7.4), point(r-13.7, y+9.35));
      strut(point(r+1, y+3.8), point(r-7, y+8.4));
    }
    const roofTruss = new T.InstancedMesh(new T.CylinderGeometry(.12, .12, 1, 6), steel, structure.length);
    structure.forEach((matrix, i) => roofTruss.setMatrixAt(i, matrix)); this.group.add(roofTruss);
    for (const [radius, height] of [[85.1, 6.1], [95.15, 13.45]]) {
      const fascia = new T.Mesh(new T.CylinderGeometry(radius, radius, .8, 128, 1, true), concrete);
      fascia.position.set(0, height, BOUNDARY_CENTRE); this.group.add(fascia);
      const rail = new T.Mesh(new T.TorusGeometry(radius-.15, .035, 5, 160), steel);
      rail.rotation.x = Math.PI/2; rail.position.set(0, height+.75, BOUNDARY_CENTRE); this.group.add(rail);
    }
    // One shaded atlas gives spectators faces, hair, layered clothes and different seated silhouettes.
    // The whole crowd still draws as a single instanced mesh.
    const figure = new T.PlaneGeometry(.62, 1.05); figure.translate(0, .52, 0);
    const spectators = canvasTexture(768, 288, ctx => {
      const clothing = ['#667481', '#b6afa1', '#43625e', '#8c4c43', '#c5bfad', '#3c4f68', '#88764e', '#495658', '#7a635d', '#435972', '#8c8b7d', '#53694d', '#999c98', '#755352', '#aa956a', '#555e70'];
      const skin = ['#bd8964', '#72503d', '#dbb99a', '#9e7154', '#b6957b', '#5e4434'];
      for (let i = 0; i < 16; i++) {
        ctx.save(); ctx.translate((i%8)*96, Math.floor(i/8)*144); ctx.scale(1.5, 1.125);
        const lean = (hash(i*7.3)-.5)*7, x = 32+lean;
        ctx.fillStyle = '#303944';
        ctx.beginPath(); ctx.moveTo(x-13, 91); ctx.lineTo(x-16, 128); ctx.lineTo(x-2, 128); ctx.lineTo(x+1, 105); ctx.lineTo(x+3, 128); ctx.lineTo(x+17, 128); ctx.lineTo(x+13, 91); ctx.fill();
        const shade = ctx.createLinearGradient(12, 50, 52, 115); shade.addColorStop(0, clothing[i]); shade.addColorStop(1, '#333c40'); ctx.fillStyle = shade;
        ctx.beginPath(); ctx.moveTo(x-11, 44); ctx.quadraticCurveTo(x-20, 49, x-21, 64); ctx.lineTo(x-14, 108); ctx.quadraticCurveTo(x, 114, x+15, 108); ctx.lineTo(x+21, 64); ctx.quadraticCurveTo(x+19, 48, x+10, 44); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = skin[i%skin.length]; ctx.lineWidth = 5; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(x-18, 65); ctx.lineTo(x-19, 89); ctx.lineTo(x-6, 100); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x+18, 65); ctx.lineTo(x+20, 87); ctx.lineTo(x+9, 99); ctx.stroke();
        ctx.fillStyle = skin[i%skin.length]; ctx.fillRect(x-4, 38, 8, 9);
        const face = ctx.createLinearGradient(x-9, 20, x+8, 41); face.addColorStop(0, skin[i%skin.length]); face.addColorStop(1, '#705648'); ctx.fillStyle = face;
        ctx.beginPath(); ctx.ellipse(x, 28, 8.2, 11.6, -.04+hash(i)*.08, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = i%5 === 0 ? '#74654f' : '#27292b';
        ctx.beginPath(); ctx.ellipse(x, 21, 8.5, 6.4, 0, Math.PI, Math.PI*2); ctx.lineTo(x+7.5, 28); ctx.lineTo(x+4, 23); ctx.lineTo(x-7.5, 26); ctx.fill();
        ctx.strokeStyle = 'rgba(30,30,25,.5)'; ctx.lineWidth = .8; ctx.beginPath(); ctx.moveTo(x-4, 29); ctx.lineTo(x-2, 29); ctx.moveTo(x+2, 29); ctx.lineTo(x+4, 29); ctx.stroke();
        ctx.strokeStyle = 'rgba(235,226,205,.18)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x-8, 48); ctx.quadraticCurveTo(x, 55, x+8, 48); ctx.stroke();
        ctx.restore();
      }
    });
    const material = new T.MeshStandardMaterial({roughness: .98, map: spectators, alphaTest: .35, side: T.DoubleSide, alphaToCoverage: true});
    material.onBeforeCompile = shader => {
      Object.assign(shader.uniforms, this.crowdUniforms);
      shader.vertexShader = 'uniform float uTime; uniform float uExcite; attribute float aPhase; attribute float aVariant; varying float vVariant;\n'+shader.vertexShader.replace('#include <begin_vertex>', `#include <begin_vertex>
vVariant=aVariant;
float jump=max(0.,sin(uTime*(6.+aPhase*3.)+aPhase*40.))*uExcite*.35+sin(uTime*1.3+aPhase*20.)*.015;
transformed.y+=jump;`);
      shader.fragmentShader = 'uniform float uStandLight; varying float vVariant;\n'+shader.fragmentShader.replace('#include <map_fragment>', `
vec2 atlas=(vMapUv+vec2(mod(vVariant,8.),floor(vVariant/8.)))/vec2(8.,2.);
vec4 person=texture2D(map,atlas);diffuseColor*=person;diffuseColor.rgb*=uStandLight;
`);
    };
    material.customProgramCacheKey = () => 'yorker-crowd-atlas-v3';
    const spots: T.Matrix4[] = [], colors: T.Color[] = [], phases: number[] = [], variants: number[] = [], emptySeats: T.Matrix4[] = [];
    const dummy = new T.Object3D();
    let ry = 0, rr = R0, k = 0;
    for (let tier = 0; tier < 3; tier++) {
      for (let row = 0; row < 9; row++) {
        ry += .55; const radius = rr+.45; rr += .95;
        const count = Math.floor(2*Math.PI*radius/.66);
        for (let i = 0; i < count; i++) {
          const a = i/count*Math.PI*2, wrapped = ((a%Math.PI)+Math.PI)%Math.PI;
          if (wrapped < gap || wrapped > Math.PI-gap) continue;
          if (Math.abs(Math.sin(a*12)) < .055) continue;
          const empty = hash(k++*1.37) < .16;
          dummy.position.set(Math.sin(a)*radius, ry, BOUNDARY_CENTRE+Math.cos(a)*radius);
          dummy.rotation.y = Math.atan2(-Math.sin(a), -Math.cos(a)); dummy.scale.setScalar(.9+hash(k*2.1)*.2); dummy.updateMatrix();
          if (empty) {dummy.position.y += .4; dummy.updateMatrix(); emptySeats.push(dummy.matrix.clone()); continue;}
          spots.push(dummy.matrix.clone()); colors.push(new T.Color('#ffffff').multiplyScalar(.82+hash(k*.7)*.22)); phases.push(hash(k*9.1)); variants.push(Math.floor(hash(k*3.7)*16));
        }
      }
      if (tier < 2) {ry += 2.4; rr += 1.5;}
    }
    this.crowd = new T.InstancedMesh(figure, material, spots.length);
    spots.forEach((m, i) => {this.crowd.setMatrixAt(i, m); this.crowd.setColorAt(i, colors[i]);});
    figure.setAttribute('aPhase', new T.InstancedBufferAttribute(new Float32Array(phases), 1));
    figure.setAttribute('aVariant', new T.InstancedBufferAttribute(new Float32Array(variants), 1));
    this.crowd.frustumCulled = false; this.group.add(this.crowd);
    const empty = new T.InstancedMesh(new T.BoxGeometry(.43, .36, .09), new T.MeshStandardMaterial({color: '#485a63', roughness: .85}), emptySeats.length);
    emptySeats.forEach((matrix, i) => empty.setMatrixAt(i, matrix)); this.group.add(empty);
    // LED boards ring beyond the rope.
    this.boards = canvasTexture(2048, 64, ctx => {
      const words = ['YORKER', 'BOWL IT FULL', 'HOWZAT', 'LINE & LENGTH', 'SIX & OUT', 'YORKER', 'NIGHT BOWL', 'DRS: BALL TRACKING'];
      ctx.fillStyle = '#060a12'; ctx.fillRect(0, 0, 2048, 64);
      words.forEach((w, i) => {const x = i*256; ctx.fillStyle = i%2 ? '#0d1d38' : '#101317'; ctx.fillRect(x+2, 2, 252, 60); ctx.fillStyle = i%3 === 0 ? '#ffcf4a' : i%3 === 1 ? '#ffffff' : '#5fd4ff'; ctx.font = '700 38px YorkerCondensed,"Arial Narrow",sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(w, x+128, 34, 236);});
    });
    this.boards.wrapS = T.RepeatWrapping; this.boards.repeat.set(-6, 1);
    const boardMat = new T.MeshStandardMaterial({map: this.boards, emissive: '#ffffff', emissiveMap: this.boards, emissiveIntensity: .7, roughness: .5, side: T.DoubleSide});
    const ring = new T.Mesh(new T.CylinderGeometry(71.5, 71.5, .95, 160, 1, true), boardMat); ring.position.set(0, .48, BOUNDARY_CENTRE); this.group.add(ring);
    // Rope.
    this.rope = new T.Mesh(new T.TorusGeometry(67, .09, 6, 220), new T.MeshStandardMaterial({color: '#f4f1e6', roughness: .6})); this.rope.rotation.x = Math.PI/2; this.rope.position.set(0, .09, BOUNDARY_CENTRE); this.group.add(this.rope);
    // Big screen above the far stand.
    const sc = document.createElement('canvas'); sc.width = 512; sc.height = 256;
    const st = new T.CanvasTexture(sc); st.colorSpace = T.SRGBColorSpace; this.screen = {texture: st, ctx: sc.getContext('2d')!};
    const frame = new T.Mesh(new T.BoxGeometry(17, 9, .6), new T.MeshStandardMaterial({color: '#15181d', roughness: .6}));
    const face = new T.Mesh(new T.PlaneGeometry(16, 8), new T.MeshBasicMaterial({map: st, toneMapped: false})); face.position.z = .31; frame.add(face);
    frame.position.set(0, 24, BOUNDARY_CENTRE+84); frame.lookAt(0, 10, -30); this.group.add(frame);
  }
  rope!: T.Mesh;
  setBoundary(radius: number) {this.rope.scale.setScalar(radius/67);}
  private lights() {
    const steel = new T.MeshStandardMaterial({color: '#9aa1a8', roughness: .5, metalness: .6}), panel = new T.MeshStandardMaterial({color: '#fbfdff', emissive: '#ffffff', emissiveIntensity: 0, roughness: .3});
    const housing = new T.MeshStandardMaterial({color: '#3f4b55', roughness: .6, metalness: .6});
    const glow = new T.SpriteMaterial({map: canvasTexture(128, 128, ctx => {const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(.2, 'rgba(240,246,255,.6)'); g.addColorStop(1, 'rgba(200,220,255,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, 128, 128);}), color: '#eef4ff', transparent: true, depthWrite: false, blending: T.AdditiveBlending, opacity: 0});
    for (const a of [.75, 2.35, 3.9, 5.5]) {
      const x = Math.sin(a)*110, z = BOUNDARY_CENTRE+Math.cos(a)*110;
      const mast = new T.Mesh(new T.CylinderGeometry(.6, 1.1, 58, 10), steel); mast.position.set(x, 29, z); this.group.add(mast);
      const head = new T.Group(); head.position.set(x, 59, z); head.lookAt(0, 0, BOUNDARY_CENTRE); this.group.add(head);
      const back = new T.Mesh(new T.BoxGeometry(9.2, 4.9, .35), housing); head.add(back);
      const lamp = new T.InstancedMesh(new T.BoxGeometry(.88, .83, .12), panel, 32), dummy = new T.Object3D();
      for (let row = 0; row < 4; row++) for (let col = 0; col < 8; col++) {
        dummy.position.set((col-3.5)*1.06, (row-1.5)*1.08, .25); dummy.updateMatrix(); lamp.setMatrixAt(row*8+col, dummy.matrix);
      }
      head.add(lamp); this.floodPanels.push(lamp);
      const sprite = new T.Sprite(glow); sprite.scale.set(26, 26, 1); sprite.position.set(0, 0, .8); head.add(sprite); this.floodGlow.push(sprite);
    }
  }
  private sightScreens() {
    const steel = new T.MeshStandardMaterial({color: '#6e7680', roughness: .6, metalness: .3});
    const masonry = canvasTexture(256, 256, ctx => {
      ctx.fillStyle = '#b3b3a7'; ctx.fillRect(0, 0, 256, 256);
      for (let i = 0; i < 8000; i++) {
        ctx.fillStyle = i%2 ? 'rgba(54,55,47,.035)' : 'rgba(250,246,226,.05)';
        ctx.fillRect(hash(i*2.1)*256, hash(i*3.3)*256, 1, 1);
      }
      ctx.strokeStyle = 'rgba(62,67,64,.13)'; ctx.lineWidth = .6;
      for (let y = 0; y <= 256; y += 32) {ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(256, y); ctx.stroke();}
    }); masonry.wrapS = masonry.wrapT = T.RepeatWrapping; masonry.repeat.set(6, 3);
    const glassMap = canvasTexture(256, 128, ctx => {
      const sky = ctx.createLinearGradient(0, 0, 0, 128); sky.addColorStop(0, '#9aaab1'); sky.addColorStop(.5, '#55697b'); sky.addColorStop(1, '#263b4b');
      ctx.fillStyle = sky; ctx.fillRect(0, 0, 256, 128);
      ctx.fillStyle = 'rgba(201,216,221,.15)'; ctx.beginPath(); ctx.moveTo(30, 0); ctx.lineTo(93, 0); ctx.lineTo(165, 128); ctx.lineTo(105, 128); ctx.closePath(); ctx.fill();
    });
    const brick = new T.MeshStandardMaterial({map: masonry, roughness: .94});
    const glass = new T.MeshPhysicalMaterial({map: glassMap, color: '#a4b2b8', roughness: .27, metalness: .18, clearcoat: .65});
    const roofM = new T.MeshStandardMaterial({color: '#39464f', roughness: .7, metalness: .25});
    const trim = new T.MeshStandardMaterial({color: '#c6c9c1', roughness: .78});
    for (const sign of [1, -1]) {
      const z = BOUNDARY_CENTRE+sign*73.4;
      const screen = new T.Mesh(new T.BoxGeometry(12, 5.6, .3), this.sightMaterial); screen.position.set(0, 2.9, z); this.group.add(screen);
      for (const x of [-5.8, 5.8]) {const leg = new T.Mesh(new T.BoxGeometry(.25, 5.9, 1.4), steel); leg.position.set(x, 2.95, z+sign*.8); this.group.add(leg);}
      const slats = new T.InstancedMesh(new T.BoxGeometry(.022, 5.5, .012), steel, 60), slat = new T.Object3D();
      for (let i = 0; i < 60; i++) {slat.position.set(-5.9+i*.2, 2.9, z-sign*.16); slat.updateMatrix(); slats.setMatrixAt(i, slat.matrix);}
      this.group.add(slats);
      // Pavilion and scoreboard fill the gaps in the bowl behind each end.
      const pav = new T.Group(); pav.position.set(0, 0, BOUNDARY_CENTRE+sign*86); pav.rotation.y = sign > 0 ? Math.PI : 0; this.group.add(pav);
      const body = new T.Mesh(new T.BoxGeometry(34, 14, 10), brick); body.position.y = 7; pav.add(body);
      for (let floor = 0; floor < 2; floor++) {
        for (let pane = 0; pane < 8; pane++) {
          const window = new T.Mesh(new T.BoxGeometry(3.65, 2.6, .09), glass); window.position.set((pane-3.5)*4, 4.6+floor*5.2, 5.07); pav.add(window);
          const mullion = new T.Mesh(new T.BoxGeometry(.055, 2.65, .14), trim); mullion.position.copy(window.position); mullion.position.z += .06; pav.add(mullion);
        }
        const balcony = new T.Mesh(new T.BoxGeometry(34.4, .3, 2.8), trim); balcony.position.set(0, 6.5+floor*5.2, 6.2); pav.add(balcony);
        const railing = new T.Mesh(new T.BoxGeometry(33.6, .07, .06), steel); railing.position.set(0, 7.4+floor*5.2, 7.5); pav.add(railing);
        const posts = new T.InstancedMesh(new T.BoxGeometry(.045, .85, .045), steel, 32), post = new T.Object3D();
        for (let i = 0; i < 32; i++) {post.position.set((i-15.5)*1.05, 6.95+floor*5.2, 7.5); post.updateMatrix(); posts.setMatrixAt(i, post.matrix);} pav.add(posts);
      }
      for (const x of [-16.7, -8.3, 0, 8.3, 16.7]) {
        const pier = new T.Mesh(new T.BoxGeometry(.4, 13.4, .38), trim); pier.position.set(x, 6.7, 5.25); pav.add(pier);
      }
      const lintel = new T.Mesh(new T.BoxGeometry(35, .5, 1), trim); lintel.position.set(0, 13.7, 5.4); pav.add(lintel);
      const roofShape = new T.Shape(); roofShape.moveTo(-18, 0); roofShape.lineTo(0, 2.4); roofShape.lineTo(18, 0); roofShape.closePath();
      const roof = new T.Mesh(new T.ExtrudeGeometry(roofShape, {depth: 11, bevelEnabled: false}), roofM); roof.position.set(0, 14, -5.5); pav.add(roof);
    }
  }
  private wickets() {
    // Split the CC0 three-stump wicket and bail pair into individual pieces so they can scatter.
    const pieces = (source: T.Object3D, centres: number[]) => {
      source.updateMatrixWorld(true);
      const out = centres.map(() => new T.Group());
      source.traverse(o => {
        if (!(o instanceof T.Mesh)) return;
        const g = (o.geometry.index ? o.geometry.toNonIndexed() : o.geometry.clone()).applyMatrix4(o.matrixWorld), pos = g.getAttribute('position');
        const buckets: number[][] = centres.map(() => []);
        for (let i = 0; i < pos.count; i += 3) {const cx = (pos.getX(i)+pos.getX(i+1)+pos.getX(i+2))/3; let best = 0; centres.forEach((c, j) => {if (Math.abs(cx-c) < Math.abs(cx-centres[best])) best = j;}); buckets[best].push(i);}
        buckets.forEach((tris, j) => {
          const geo = new T.BufferGeometry();
          for (const name of Object.keys(g.attributes)) {const src = g.getAttribute(name), size = src.itemSize, arr = new Float32Array(tris.length*3*size); tris.forEach((s, k) => {for (let v = 0; v < 3; v++) for (let c = 0; c < size; c++) arr[(k*3+v)*size+c] = src.getComponent(s+v, c);}); geo.setAttribute(name, new T.BufferAttribute(arr, size));}
          if (!geo.getAttribute('normal')) geo.computeVertexNormals();
          geo.translate(-centres[j], 0, 0);
          const wood = new T.MeshStandardMaterial({color: '#e2cfa9', roughness: .72});
          wood.onBeforeCompile = shader => {
            shader.vertexShader = 'varying vec3 vWood;\n'+shader.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\nvWood=position;');
            shader.fragmentShader = 'varying vec3 vWood;\n'+shader.fragmentShader.replace('#include <map_fragment>', `#include <map_fragment>
              float grain=sin(vWood.x*970.+sin(vWood.y*18.)*.45)*sin(vWood.z*710.+vWood.y*2.);
              diffuseColor.rgb*=.97+grain*.035;
              float band=1.-smoothstep(.003,.005,abs(vWood.y-.515));
              diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.12,.19,.25),band*.85);
            `);
          };
          wood.customProgramCacheKey = () => 'yorker-willow-stumps-v1';
          const mesh = new T.Mesh(geo, wood); mesh.castShadow = true; out[j].add(mesh);
        });
      });
      return out;
    };
    for (const z of [0, -PITCH]) {
      const group = new T.Group(); group.position.set(0, 0, z); this.group.add(group);
      const stumps = pieces(this.assets.wicket, [-.0963, 0, .0963]), bails = pieces(this.assets.bails, [-.055, .055]);
      stumps.forEach((s, i) => {s.position.set([-.0963, 0, .0963][i], 0, 0); group.add(s);});
      bails.forEach((b, i) => {b.position.set([-.055, .055][i], .709, 0); group.add(b);});
      this.ends.push({group, stumps, bails, rest: [...stumps, ...bails].map(o => ({p: o.position.clone(), q: o.quaternion.clone()}))});
    }
  }

  /* ---------- Venue lighting ---------- */
  setPitch(pitch: PitchId) {
    this.pitchUniforms.uPitchWear.value = pitch === 'dust' ? 1.35 : pitch === 'flat' ? .35 : .7;
    this.pitchUniforms.uPitchGreen.value = pitch === 'green' ? .4 : pitch === 'dust' ? 0 : .035;
  }
  setVenue(venue: Venue) {
    this.time = venue.time;
    const sky = this.assets.sky[venue.time]; sky.mapping = T.EquirectangularReflectionMapping; sky.colorSpace = T.SRGBColorSpace;
    this.scene.background = sky; this.scene.backgroundIntensity = venue.time === 'night' ? .55 : venue.time === 'dusk' ? .85 : 1;
    let env = this.envs.get(venue.time);
    if (!env) {env = this.pmrem.fromEquirectangular(sky).texture; this.envs.set(venue.time, env);}
    this.scene.environment = env; this.scene.environmentIntensity = venue.time === 'night' ? .38 : venue.time === 'dusk' ? .48 : .6;
    const flood = venue.time === 'day' ? 0 : venue.time === 'dusk' ? .65 : 1;
    if (venue.time === 'day') {this.sun.color.set('#fff3df'); this.sun.intensity = 2.6; this.sun.position.set(-38, 70, -30); this.hemi.color.set('#dce6ed'); this.hemi.groundColor.set('#62674e'); this.hemi.intensity = 1.2; this.fill.color.set('#e6eeff'); this.fill.intensity = .42;}
    else if (venue.time === 'dusk') {this.sun.color.set('#ffd0a4'); this.sun.intensity = 2.05; this.sun.position.set(-70, 26, 40); this.hemi.color.set('#aab7ce'); this.hemi.groundColor.set('#4c5140'); this.hemi.intensity = .9; this.fill.color.set('#e6eeff'); this.fill.intensity = 1;}
    else {this.sun.color.set('#eff5ff'); this.sun.intensity = 2.35; this.sun.position.set(30, 75, -45); this.hemi.color.set('#8291ac'); this.hemi.groundColor.set('#353e30'); this.hemi.intensity = .83; this.fill.color.set('#e1eaff'); this.fill.intensity = 1.12;}
    this.fill.position.set(45, 55, 35);
    this.scene.fog = new T.Fog(venue.time === 'night' ? '#112132' : venue.time === 'dusk' ? '#93929e' : '#b9c8d1', 85, 340);
    this.crowdUniforms.uStandLight.value = venue.time === 'night' ? .9 : venue.time === 'dusk' ? .95 : 1;
    for (const p of this.floodPanels) (p.material as T.MeshStandardMaterial).emissiveIntensity = flood*3;
    for (const g of this.floodGlow) g.material.opacity = flood*.9;
    this.sightMaterial.color.set(venue.ball === 'red' ? '#f2f2ee' : '#101215');
    this.setBoundary(venue.boundary);
  }

  /* ---------- Per-frame ---------- */
  update(time: number, excite: number) {
    this.crowdUniforms.uTime.value = time; this.crowdUniforms.uExcite.value = excite;
    this.markerRing.scale.setScalar(1+.12*Math.sin(time*5));
    this.boards.offset.x = (time*.02)%1;
  }
  showTarget(on: boolean, x = 0, z = 0, scatter = .3) {
    this.targetMarker.visible = on; this.lengthBands.visible = on;
    if (!on) return;
    this.targetMarker.position.set(x, .012, z); this.markerScatter.scale.set(scatter, scatter*1.8, 1);
  }
  /** Lesson zone box on the pitch. */
  showZone(zone: {xMin: number; xMax: number; zMin: number; zMax: number} | null) {
    this.zoneMarker.clear();
    if (!zone) return;
    const w = zone.xMax-zone.xMin, d = zone.zMax-zone.zMin;
    const fill = new T.Mesh(new T.PlaneGeometry(w, d), new T.MeshBasicMaterial({color: '#ffcf4a', transparent: true, opacity: .22, depthWrite: false, toneMapped: false}));
    fill.rotation.x = -Math.PI/2; fill.position.set((zone.xMin+zone.xMax)/2, .011, (zone.zMin+zone.zMax)/2); this.zoneMarker.add(fill);
    const edges = new T.LineSegments(new T.EdgesGeometry(new T.PlaneGeometry(w, d)), new T.LineBasicMaterial({color: '#ffcf4a', toneMapped: false}));
    edges.rotation.x = -Math.PI/2; edges.position.copy(fill.position); edges.position.y = .013; this.zoneMarker.add(edges);
  }
  /** This spell's pitch map: where each ball landed, coloured by result. */
  setPitchDots(dots: {x: number; z: number; color: string}[]) {
    this.pitchDots.clear();
    for (const d of dots) {const m = new T.Mesh(new T.CircleGeometry(.05, 16), new T.MeshBasicMaterial({color: d.color, transparent: true, opacity: .9, depthWrite: false, toneMapped: false})); m.rotation.x = -Math.PI/2; m.position.set(d.x, .011, d.z); this.pitchDots.add(m);}
  }
  drawScreen(lines: {title: string; big: string; small: string; accent: string}) {
    const {ctx, texture} = this.screen;
    ctx.fillStyle = '#05080f'; ctx.fillRect(0, 0, 512, 256);
    ctx.fillStyle = lines.accent; ctx.fillRect(0, 0, 512, 10);
    ctx.textAlign = 'center'; ctx.fillStyle = '#9fb2cf'; ctx.font = '600 30px YorkerCondensed,"Arial Narrow",sans-serif'; ctx.fillText(lines.title, 256, 58);
    ctx.fillStyle = '#ffffff'; ctx.font = '700 104px YorkerCondensed,"Arial Narrow",sans-serif'; ctx.fillText(lines.big, 256, 162, 480);
    ctx.fillStyle = lines.accent; ctx.font = '600 34px YorkerCondensed,"Arial Narrow",sans-serif'; ctx.fillText(lines.small, 256, 222, 480);
    texture.needsUpdate = true;
  }
  get venueTime() {return this.time;}
  dispose() {this.pmrem.dispose(); for (const e of this.envs.values()) e.dispose();}
}

export {V};
