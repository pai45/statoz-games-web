import * as THREE from "three";
import { publicAsset } from "@/shared/config/base-path";
import { GOAL, TAKER, type Frame } from "../game-types";
import { keeperSample, strikerFrame, type CharacterPack, type SpriteActor } from "./sprite-motion";

const base = "/assets/games/penalty-shootout/imported-characters/";
const actorHeight = 1.8;

class AtlasAthlete {
  readonly sprite: THREE.Sprite;
  private lastFrame = "";
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
  show(animation: string, index: number, mirror = false) {
    const definition = this.definition, key = animation + ":" + index + ":" + mirror;
    const frame = definition.animations[animation].frames[index];
    if (key !== this.lastFrame) {
      // Half-texel inset keeps adjacent cells from bleeding through linear sampling.
      this.texture.repeat.set((frame.w - 1) / definition.atlasWidth * (mirror ? -1 : 1), (frame.h - 1) / definition.atlasHeight);
      this.texture.offset.set((mirror ? frame.x + frame.w - .5 : frame.x + .5) / definition.atlasWidth, 1 - (frame.y + frame.h - .5) / definition.atlasHeight);
      this.lastFrame = key;
    }
    const scale = actorHeight / definition.neutralHeight;
    this.sprite.scale.set(definition.frameWidth * scale, definition.frameHeight * scale, 1);
    // Mirroring must also mirror the shared pivot, rather than moving the hips.
    this.sprite.center.x = mirror ? 1 - definition.origin[0] / definition.frameWidth : definition.origin[0] / definition.frameWidth;
  }
  dispose() { this.texture.dispose(); (this.sprite.material as THREE.SpriteMaterial).dispose(); }
}

export class ImportedAthletes {
  readonly group = new THREE.Group();
  strikerFrame = 0;
  keeperFrame = 0;
  keeperAnimation = "Idle";
  private shadows: THREE.Mesh[] = [];
  private constructor(private striker: AtlasAthlete, private keeper: AtlasAthlete) {
    this.group.name = "PenaltyShooters2Characters";
    striker.sprite.renderOrder = 3; keeper.sprite.renderOrder = 2;
    this.group.add(striker.sprite, keeper.sprite);
    const canvas = document.createElement("canvas"); canvas.width = 64; canvas.height = 64;
    const ctx = canvas.getContext("2d")!;
    const gradient = ctx.createRadialGradient(32, 32, 2, 32, 32, 32);
    gradient.addColorStop(0, "rgba(15,25,12,.3)"); gradient.addColorStop(1, "rgba(15,25,12,0)");
    ctx.fillStyle = gradient; ctx.fillRect(0, 0, 64, 64);
    for (let i = 0; i < 2; i++) {
      const texture = new THREE.CanvasTexture(canvas);
      const shadow = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false, toneMapped: false }));
      shadow.rotation.x = -Math.PI / 2; shadow.scale.set(1.15, .65, 1);
      this.shadows.push(shadow); this.group.add(shadow);
    }
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
    return new ImportedAthletes(new AtlasAthlete(pack.striker, textures[0]), new AtlasAthlete(pack.keeper, textures[1]));
  }
  update(frame: Frame, previous: Frame | null, alpha: number, camera: THREE.Camera) {
    const blend = (now: number, before?: number) => before === undefined ? now : before + (now - before) * alpha;
    this.strikerFrame = strikerFrame(this.striker.definition, frame);
    this.striker.show("kick", this.strikerFrame);
    const strikerScale = actorHeight / this.striker.definition.neutralHeight;
    const contact = this.striker.definition.bootContactAnchor ?? this.striker.definition.contactAnchor ?? [45.4545, 109];
    camera.updateMatrixWorld();
    const right = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 0);
    const up = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 1);
    this.striker.sprite.position.set(0, GOAL.ballRadius, GOAL.spot)
      .addScaledVector(right, -contact[0] * strikerScale)
      .addScaledVector(up, contact[1] * strikerScale);
    this.striker.sprite.position.x += blend(frame.shooterX, previous?.shooterX) - TAKER.x;
    this.striker.sprite.position.z += blend(frame.shooterZ, previous?.shooterZ) - (GOAL.spot + TAKER.contactOffset);
    const sample = keeperSample(this.keeper.definition, frame);
    this.keeperAnimation = sample.name; this.keeperFrame = sample.index;
    this.keeper.show(sample.name, sample.index, sample.mirror);
    const pelvis = (pose: Frame["keeper"]) => ({ x: pose.root.x - Math.sin(pose.lean) * .94 });
    const now = pelvis(frame.keeper), before = previous ? pelvis(previous.keeper) : undefined;
    const keeperScale = actorHeight / this.keeper.definition.neutralHeight;
    // Source frames already contain the crouch, fall and recovery. Applying the
    // skeletal pelvis's vertical drop as well would put the keeper underground.
    this.keeper.sprite.position.set(blend(now.x, before?.x), this.keeper.definition.groundOffset * keeperScale, blend(frame.keeper.root.z, previous?.keeper.root.z));
    this.shadows[0].position.set(this.striker.sprite.position.x - .35, .018, this.striker.sprite.position.z + .9);
    this.shadows[1].position.set(now.x, .018, frame.keeper.root.z + .05);
  }
  dispose() {
    this.striker.dispose(); this.keeper.dispose();
    for (const shadow of this.shadows) {
      shadow.geometry.dispose(); const material = shadow.material as THREE.MeshBasicMaterial; material.map?.dispose(); material.dispose();
    }
    this.group.removeFromParent();
  }
}
