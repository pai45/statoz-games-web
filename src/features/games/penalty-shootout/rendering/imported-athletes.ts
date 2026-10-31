import * as THREE from "three";
import { publicAsset } from "@/shared/config/base-path";
import { GOAL, TAKER, type Frame, type Vec3 } from "../game-types";
import { keeperSample, strikerFrame, type CharacterPack, type KeeperSample, type SpriteActor } from "./sprite-motion";
import { AthleteEffects } from "./athlete-effects";

const base = "/assets/games/penalty-shootout/imported-characters/";
const actorHeight = 1.8;

/** Opaque extent of one source frame, in source-frame pixels. */
type Silhouette = { maxY: number; footMin: number; footMax: number };

/** Measure every frame once at load so shadows can follow the drawn pose. */
function measure(actor: SpriteActor, image: CanvasImageSource) {
  const result = new Map<string, Silhouette>();
  const canvas = document.createElement("canvas"); canvas.width = actor.atlasWidth; canvas.height = actor.atlasHeight;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return result;
  ctx.drawImage(image, 0, 0);
  const pixels = ctx.getImageData(0, 0, actor.atlasWidth, actor.atlasHeight).data;
  const opaque = (frame: { x: number; y: number }, x: number, y: number) => pixels[((frame.y + y) * actor.atlasWidth + frame.x + x) * 4 + 3] >= 48;
  for (const [name, clip] of Object.entries(actor.animations)) clip.frames.forEach((frame, index) => {
    let maxY = -1;
    for (let y = frame.h - 1; y >= 0 && maxY < 0; y--) for (let x = 0; x < frame.w; x++) if (opaque(frame, x, y)) { maxY = y; break; }
    if (maxY < 0) return;
    // Contact band: whatever the pose rests on, from planted boots to a body lying flat.
    let footMin = Infinity, footMax = -1;
    for (let y = Math.max(0, maxY - 9); y <= maxY; y++) for (let x = 0; x < frame.w; x++) {
      if (!opaque(frame, x, y)) continue;
      if (x < footMin) footMin = x; if (x > footMax) footMax = x;
    }
    result.set(name + ":" + index, { maxY, footMin, footMax });
  });
  return result;
}

class AtlasAthlete {
  readonly sprite: THREE.Sprite;
  private lastFrame = "";
  animation = "";
  index = 0;
  mirror = false;
  constructor(readonly definition: SpriteActor, readonly texture: THREE.Texture) {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter; texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;
    // The source image encodes perspective within its poses. Its near support
    // foot can project below the ball's ground point; a flat world-plane depth
    // test would incorrectly cut those original pixels off at the grass.
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true, alphaTest: .02, depthWrite: false, depthTest: false, toneMapped: false });
    this.sprite = new THREE.Sprite(material);
    this.sprite.name = definition.atlas;
    this.sprite.center.set(definition.origin[0] / definition.frameWidth, 1 - definition.origin[1] / definition.frameHeight);
    this.sprite.frustumCulled = false;
  }
  get scale() { return actorHeight / this.definition.neutralHeight; }
  /** Source row the pose stands on. */
  get groundRow() { return this.definition.origin[1] + this.definition.groundOffset; }
  show(animation: string, index: number, mirror = false, tilt = 0) {
    const definition = this.definition, key = animation + ":" + index + ":" + mirror;
    const frame = definition.animations[animation].frames[index];
    if (key !== this.lastFrame) {
      // Half-texel inset keeps adjacent cells from bleeding through linear sampling.
      this.texture.repeat.set((frame.w - 1) / definition.atlasWidth * (mirror ? -1 : 1), (frame.h - 1) / definition.atlasHeight);
      this.texture.offset.set((mirror ? frame.x + frame.w - .5 : frame.x + .5) / definition.atlasWidth, 1 - (frame.y + frame.h - .5) / definition.atlasHeight);
      this.lastFrame = key;
    }
    this.animation = animation; this.index = index; this.mirror = mirror;
    this.sprite.scale.set(definition.frameWidth * this.scale, definition.frameHeight * this.scale, 1);
    // Mirroring must also mirror the shared pivot, rather than moving the hips.
    this.sprite.center.x = mirror ? 1 - definition.origin[0] / definition.frameWidth : definition.origin[0] / definition.frameWidth;
    (this.sprite.material as THREE.SpriteMaterial).rotation = tilt;
  }
  /** Displayed x of a source column relative to the pivot, in metres (mirroring included). */
  offsetX(column: number) { return (this.mirror ? this.definition.origin[0] - column : column - this.definition.origin[0]) * this.scale; }
  dispose() { this.texture.dispose(); (this.sprite.material as THREE.SpriteMaterial).dispose(); }
}

/** Silhouette shadow: the current frame laid on the grass, stretched away from the sun. */
class CastShadow {
  readonly mesh: THREE.Mesh;
  private positions: THREE.BufferAttribute;
  constructor(texture: THREE.Texture, opacity: number) {
    const geometry = new THREE.BufferGeometry();
    this.positions = new THREE.BufferAttribute(new Float32Array(12), 3);
    geometry.setAttribute("position", this.positions);
    geometry.setAttribute("uv", new THREE.BufferAttribute(new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]), 2));
    // The far end (the head) is softer, like a real penumbra.
    geometry.setAttribute("color", new THREE.BufferAttribute(new Float32Array([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, .4, 1, 1, 1, .4]), 4));
    geometry.setIndex([0, 1, 2, 0, 2, 3]);
    const material = new THREE.MeshBasicMaterial({ map: texture, color: 0x0a1606, vertexColors: true, transparent: true, opacity, alphaTest: .02, depthWrite: false, toneMapped: false, side: THREE.DoubleSide });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.frustumCulled = false; this.mesh.renderOrder = 1;
  }
  /** Corners in world space, matching the frame's bottom-left, bottom-right, top-right and top-left. */
  set(corners: THREE.Vector3[]) {
    corners.forEach((corner, i) => this.positions.setXYZ(i, corner.x, corner.y, corner.z));
    this.positions.needsUpdate = true;
  }
  dispose() { this.mesh.geometry.dispose(); (this.mesh.material as THREE.Material).dispose(); }
}

type Trace = { tick: number; x: number; y: number; z: number; animation: string; index: number; mirror: boolean; tilt: number };

export class ImportedAthletes {
  readonly group = new THREE.Group();
  strikerFrame = 0;
  keeperFrame = 0;
  keeperAnimation = "Idle";
  keeperMotion = "Idle";
  private contactShadows: THREE.Mesh[] = [];
  private castShadows: CastShadow[];
  private ghosts: AtlasAthlete[];
  private trace: Trace[] = [];
  private effects = new AthleteEffects();
  private ball = { tick: -1, position: new THREE.Vector3(), velocity: new THREE.Vector3() };
  private impact: { tick: number; position: THREE.Vector3 } | null = null;
  /**
   * Ground offset per metre of height. The broadcast camera sits low behind
   * the striker, so a shadow falling away from it collapses to a thin line.
   * Character shadows keep the sun's screen-right fall but lean toward the
   * camera so the silhouette reads on the grass.
   */
  private shadowDirection = new THREE.Vector3(.5, 0, .62);
  private constructor(private striker: AtlasAthlete, private keeper: AtlasAthlete, private silhouettes: [Map<string, Silhouette>, Map<string, Silhouette>]) {
    this.group.name = "PenaltyShooters2Characters";
    striker.sprite.renderOrder = 3; keeper.sprite.renderOrder = 2;
    this.group.add(striker.sprite, keeper.sprite);
    const canvas = document.createElement("canvas"); canvas.width = 64; canvas.height = 64;
    const ctx = canvas.getContext("2d")!;
    const gradient = ctx.createRadialGradient(32, 32, 2, 32, 32, 32);
    gradient.addColorStop(0, "rgba(10,20,8,.55)"); gradient.addColorStop(.55, "rgba(10,20,8,.22)"); gradient.addColorStop(1, "rgba(10,20,8,0)");
    ctx.fillStyle = gradient; ctx.fillRect(0, 0, 64, 64);
    for (let i = 0; i < 2; i++) {
      const shadow = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(canvas), transparent: true, depthWrite: false, toneMapped: false }));
      shadow.rotation.x = -Math.PI / 2; shadow.renderOrder = 1;
      this.contactShadows.push(shadow); this.group.add(shadow);
    }
    this.castShadows = [new CastShadow(striker.texture, .34), new CastShadow(keeper.texture, .34)];
    for (const shadow of this.castShadows) this.group.add(shadow.mesh);
    // Afterimages of the keeper's own frames, drawn behind the diver.
    this.ghosts = [0, 1, 2].map(() => {
      // Clones share the uploaded image; only the frame window differs.
      const texture = keeper.texture.clone(); texture.needsUpdate = true;
      const ghost = new AtlasAthlete(keeper.definition, texture);
      ghost.sprite.renderOrder = 1.5; ghost.sprite.visible = false;
      (ghost.sprite.material as THREE.SpriteMaterial).color.setHex(0xfff1d6);
      this.group.add(ghost.sprite); return ghost;
    });
    this.group.add(this.effects.group);
  }
  static async load() {
    const response = await fetch(publicAsset(base + "manifest.json"));
    if (!response.ok) throw new Error("Character animation data could not load. Please retry the pitch.");
    const pack = await response.json() as CharacterPack;
    for (const actor of [pack.striker, pack.keeper]) {
      if (!actor || actor.neutralHeight <= 0 || actor.frameWidth <= 0 || actor.frameHeight <= 0) throw new Error("Character animation data is incomplete");
      for (const clip of Object.values(actor.animations)) {
        if (!clip.frames.length || clip.frames.some(frame => frame.durationMs <= 0)) throw new Error("Character animation frames are incomplete");
      }
    }
    if (!pack.striker.animations.kick || !pack.keeper.animations.Idle) throw new Error("Character animation clips are missing");
    const loader = new THREE.TextureLoader();
    const loaded = await Promise.allSettled([pack.striker, pack.keeper].map(actor => loader.loadAsync(publicAsset(base + actor.atlas))));
    if (loaded.some(result => result.status === "rejected")) {
      for (const result of loaded) if (result.status === "fulfilled") result.value.dispose();
      throw new Error("Character artwork could not load. Please retry the pitch.");
    }
    const textures = loaded.map(result => (result as PromiseFulfilledResult<THREE.Texture>).value);
    // Shadows are cosmetic: an unreadable canvas falls back to centred shadows.
    const silhouettes = [pack.striker, pack.keeper].map((actor, i) => {
      try { return measure(actor, textures[i].image as CanvasImageSource); } catch { return new Map<string, Silhouette>(); }
    }) as [Map<string, Silhouette>, Map<string, Silhouette>];
    return new ImportedAthletes(new AtlasAthlete(pack.striker, textures[0]), new AtlasAthlete(pack.keeper, textures[1]), silhouettes);
  }
  private kitUniforms: { primary: { value: THREE.Color }; secondary: { value: THREE.Color } }[] = [];
  async prepareKitMasks() {
    if(this.kitUniforms.length)return;
    const loader=new THREE.TextureLoader();
    const textures=await Promise.allSettled(['striker','keeper'].map(name=>loader.loadAsync(publicAsset('/games/penalty-cup/'+name+'-kit-mask.png'))));
    if(textures.some(t=>t.status==='rejected')){for(const t of textures)if(t.status==='fulfilled')t.value.dispose();throw Error('National kits could not load');}
    const masks=textures.map(t=>{if(t.status!=='fulfilled')throw Error('Kit mask missing');return t.value;});
    for(const [actor,index] of [[this.striker,0],[this.keeper,1],...this.ghosts.map(g=>[g,1])] as [AtlasAthlete,number][]){
      const uniforms={primary:{value:new THREE.Color('#ffffff')},secondary:{value:new THREE.Color('#ffffff')}};
      this.kitUniforms.push(uniforms);
      const material=actor.sprite.material as THREE.SpriteMaterial;
      material.onBeforeCompile=shader=>{
        shader.uniforms.cupMask={value:masks[index]};shader.uniforms.cupPrimary=uniforms.primary;shader.uniforms.cupSecondary=uniforms.secondary;
        shader.fragmentShader='uniform sampler2D cupMask; uniform vec3 cupPrimary; uniform vec3 cupSecondary;\n'+shader.fragmentShader;
        shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>', '#include <map_fragment>\nvec2 coverage=texture2D(cupMask,vMapUv).rg;float shade=0.62+0.38*max(diffuseColor.r,max(diffuseColor.g,diffuseColor.b));diffuseColor.rgb=mix(diffuseColor.rgb,cupPrimary*shade,coverage.r);diffuseColor.rgb=mix(diffuseColor.rgb,cupSecondary*shade,coverage.g);');
      };
      material.customProgramCacheKey=()=> 'penalty-cup-masked-kit-v1';material.needsUpdate=true;
    }
    this.kitMasks=masks;
  }
  private kitMasks: THREE.Texture[] = [];
  setKitPalette(striker:string,keeper:string,strikerShorts:string,keeperShorts:string){
    this.kitUniforms.forEach((u,i)=>{u.primary.value.set(i===0?striker:keeper);u.secondary.value.set(i===0?strikerShorts:keeperShorts);});
  }
  update(frame: Frame, previous: Frame | null, alpha: number, camera: THREE.Camera, ball: Vec3, reducedMotion = false) {
    const blend = (now: number, before?: number) => before === undefined ? now : before + (now - before) * alpha;
    this.strikerFrame = strikerFrame(this.striker.definition, frame);
    this.striker.show("kick", this.strikerFrame);
    const strikerScale = this.striker.scale;
    const contact = this.striker.definition.bootContactAnchor ?? this.striker.definition.contactAnchor ?? [45.4545, 109];
    camera.updateMatrixWorld();
    const right = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 0);
    const up = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 1);
    const eye = new THREE.Vector3().setFromMatrixPosition(camera.matrixWorld);
    this.striker.sprite.position.set(0, GOAL.ballRadius, GOAL.spot)
      .addScaledVector(right, -contact[0] * strikerScale)
      .addScaledVector(up, contact[1] * strikerScale);
    this.striker.sprite.position.x += blend(frame.shooterX, previous?.shooterX) - TAKER.x;
    this.striker.sprite.position.z += blend(frame.shooterZ, previous?.shooterZ) - (GOAL.spot + TAKER.contactOffset);
    const sample = keeperSample(this.keeper.definition, frame);
    this.keeperAnimation = sample.name; this.keeperFrame = sample.index; this.keeperMotion = sample.motion;
    this.keeper.show(sample.name, sample.index, sample.mirror, reducedMotion ? 0 : sample.tilt);
    const pelvis = (pose: Frame["keeper"]) => ({ x: pose.root.x - Math.sin(pose.lean) * .94 });
    const now = pelvis(frame.keeper), before = previous ? pelvis(previous.keeper) : undefined;
    // Source frames already contain the crouch, fall and recovery. Applying the
    // skeletal pelvis's vertical drop as well would put the keeper underground.
    this.keeper.sprite.position.set(blend(now.x, before?.x), this.keeper.definition.groundOffset * this.keeper.scale, blend(frame.keeper.root.z, previous?.keeper.root.z));

    // The striker's source frames bake in perspective: his feet climb the frame
    // as he walks toward the ball, so his shadow always follows the drawn feet.
    this.ground(this.striker, this.silhouettes[0], right, up, eye, this.castShadows[0], this.contactShadows[0], true);
    const keeperGround = this.ground(this.keeper, this.silhouettes[1], right, up, eye, this.castShadows[1], this.contactShadows[1], false);
    this.trail(frame.tick, sample, reducedMotion);

    this.effects.begin();
    if (!reducedMotion) {
      // Turf kicked up as the boot strikes the ball (physics release at 1 s).
      if (frame.shooterClip.startsWith("kick_")) this.effects.burst({
        age: frame.shooterTime - 1, life: .55, origin: new THREE.Vector3(0, .03, GOAL.spot + .05), count: 9, seed: 11,
        drift: new THREE.Vector3(0, .8, -1.2), spread: new THREE.Vector3(.9, 1.6, .8), size: .07, colors: [0x5f7d3a, 0x7d9a4c, 0xb9b58a], opacity: .85, gravity: 2.4,
      });
      // Grass and dust where the diving keeper lands.
      if (sample.landAt !== null) {
        const side = sample.mirror ? 1 : -1;
        // Spray from the hips forward along the body, in the direction of the slide.
        for (const [offset, seed] of [[-.35, 37], [.35, 53]] as const) this.effects.burst({
          age: sample.age - sample.landAt, life: .9, origin: keeperGround.clone().setX(keeperGround.x + offset * side).setY(.06), count: 11, seed,
          drift: new THREE.Vector3(side * 1.1, .7, .3), spread: new THREE.Vector3(1.6, 1.3, .6), size: .22, colors: [0xd8cfa6, 0xc4bc93, 0x6c8743, 0x93a85c], opacity: .8, gravity: 1.1, behind: true,
        });
      }
      this.trackImpact(frame, ball);
      if (this.impact) {
        const age = (frame.tick - this.impact.tick) / 120;
        this.effects.impact(age, this.impact.position);
        this.effects.burst({
          age, life: .4, origin: this.impact.position, count: 10, seed: 71,
          drift: new THREE.Vector3(0, .2, 1.4), spread: new THREE.Vector3(2.2, 1.6, 1.2), size: .06, colors: [0xffffff, 0xfff4d0], opacity: .9, gravity: 1.5,
        });
      }
    }
    this.effects.end();
  }
  /**
   * Places both shadows from the current frame's measured silhouette. The
   * ground point is where the camera ray through the drawn feet meets the
   * pitch, so the shadow sits under what the viewer sees.
   */
  private ground(actor: AtlasAthlete, silhouettes: Map<string, Silhouette>, right: THREE.Vector3, up: THREE.Vector3, eye: THREE.Vector3, cast: CastShadow, contact: THREE.Mesh, alwaysGrounded: boolean) {
    const shape = silhouettes.get(actor.animation + ":" + actor.index), scale = actor.scale;
    // Airborne frames keep the authored ground row so the shadow stays on the grass below them.
    const grounded = !!shape && (alwaysGrounded || shape.maxY > actor.groundRow - 6);
    const row = grounded ? shape!.maxY : actor.groundRow;
    const definition = actor.definition, centreColumn = shape ? (shape.footMin + shape.footMax) / 2 : definition.origin[0];
    const drawn = actor.sprite.position.clone().addScaledVector(right, actor.offsetX(centreColumn)).addScaledVector(up, (definition.origin[1] - row) * scale);
    const drop = eye.y - drawn.y;
    const anchor = drop > .01 ? eye.clone().addScaledVector(drawn.sub(eye), eye.y / drop) : drawn.setY(0);
    // Cast shadow: frame columns run along world x; frame height runs away from the sun.
    const corner = (column: number, rowY: number) => anchor.clone()
      .add(new THREE.Vector3(actor.offsetX(column) - actor.offsetX(centreColumn), .016, 0))
      .addScaledVector(this.shadowDirection, (row - rowY) * scale);
    const w = definition.frameWidth, h = definition.frameHeight, leftColumn = actor.mirror ? w : 0, rightColumn = actor.mirror ? 0 : w;
    cast.set([corner(leftColumn, h), corner(rightColumn, h), corner(rightColumn, 0), corner(leftColumn, 0)]);
    // Contact shadow: as wide as whatever touches the grass, fading when airborne.
    const gap = shape && !grounded ? Math.max(0, row - shape.maxY) * scale : 0;
    const width = shape ? Math.abs(actor.offsetX(shape.footMax) - actor.offsetX(shape.footMin)) : .5;
    contact.position.copy(anchor).setY(.018);
    contact.scale.set(Math.max(.55, width * 1.25 + .25), .5 + Math.min(.35, width * .15), 1);
    (contact.material as THREE.MeshBasicMaterial).opacity = Math.max(.2, 1 - gap / .7);
    return anchor;
  }
  /** Fading afterimages while the keeper is travelling fast through a dive. */
  private trail(tick: number, sample: KeeperSample, reducedMotion: boolean) {
    if (this.trace.length && tick < this.trace[this.trace.length - 1].tick) this.trace = [];
    const position = this.keeper.sprite.position;
    if (!this.trace.length || this.trace[this.trace.length - 1].tick !== tick) {
      this.trace.push({ tick, x: position.x, y: position.y, z: position.z, animation: sample.name, index: sample.index, mirror: sample.mirror, tilt: reducedMotion ? 0 : sample.tilt });
      if (this.trace.length > 48) this.trace.shift();
    }
    const landAt = sample.landAt ?? 0, diving = !reducedMotion && sample.landAt !== null && sample.age > .06 && sample.age < landAt + .12;
    const fade = diving ? Math.min(1, (sample.age - .06) / .08) * Math.min(1, (landAt + .12 - sample.age) / .12) : 0;
    this.ghosts.forEach((ghost, i) => {
      let past: Trace | undefined;
      const wanted = tick - (i + 1) * 5;
      // A gap in the recording (a pause or a new match) leaves no afterimage.
      if (fade > 0) for (let k = this.trace.length - 1; k >= 0; k--) if (this.trace[k].tick <= wanted) { if (this.trace[k].tick >= wanted - 4) past = this.trace[k]; break; }
      // Only airborne poses leave a trail; a standing take-off frame would read as a second keeper.
      const airborne = past && sample.airborneFrom !== null && past.animation === sample.name && past.index >= sample.airborneFrom;
      if (!past || !airborne || Math.hypot(past.x - position.x, past.z - position.z) < .08) { ghost.sprite.visible = false; return; }
      ghost.show(past.animation, past.index, past.mirror, past.tilt);
      ghost.sprite.position.set(past.x, past.y, past.z);
      (ghost.sprite.material as THREE.SpriteMaterial).opacity = [.26, .15, .07][i] * fade;
      ghost.sprite.visible = true;
    });
  }
  /** Detects the ball being stopped or turned back by the keeper. */
  private trackImpact(frame: Frame, ball: Vec3) {
    const position = new THREE.Vector3(ball.x, ball.y, ball.z);
    if (this.impact && frame.tick < this.impact.tick) this.impact = null;
    if (this.ball.tick >= 0 && frame.tick > this.ball.tick && frame.tick - this.ball.tick <= 4) {
      const velocity = position.clone().sub(this.ball.position).multiplyScalar(120 / (frame.tick - this.ball.tick));
      const hands = [frame.keeper.leftHand, frame.keeper.rightHand].map(hand => Math.hypot(hand.x - ball.x, hand.y - ball.y, hand.z - ball.z));
      const pelvisX = frame.keeper.root.x - Math.sin(frame.keeper.lean) * .94;
      const nearKeeper = Math.min(...hands) < .8 || Math.abs(ball.x - pelvisX) < .9 && ball.y < 2.2;
      const stopped = this.ball.velocity.z < -4 && velocity.z > this.ball.velocity.z * .35;
      const clearOfFrame = Math.abs(Math.abs(ball.x) - GOAL.halfWidth) > .25 && Math.abs(ball.y - GOAL.height) > .2;
      if (!this.impact && stopped && nearKeeper && clearOfFrame && ball.z > -.15 && ball.z < 1.8) this.impact = { tick: frame.tick, position: position.clone().setZ(position.z + .12) };
      this.ball.velocity.copy(velocity);
    } else if (frame.tick !== this.ball.tick) this.ball.velocity.set(0, 0, 0);
    this.ball.tick = frame.tick; this.ball.position.copy(position);
  }
  dispose() {
    for(const texture of this.kitMasks)texture.dispose();
    this.striker.dispose(); this.keeper.dispose();
    for (const ghost of this.ghosts) ghost.dispose();
    for (const shadow of this.castShadows) shadow.dispose();
    for (const shadow of this.contactShadows) {
      shadow.geometry.dispose(); const material = shadow.material as THREE.MeshBasicMaterial; material.map?.dispose(); material.dispose();
    }
    this.effects.dispose();
    this.group.removeFromParent();
  }
}
