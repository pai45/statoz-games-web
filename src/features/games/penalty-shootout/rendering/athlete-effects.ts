import * as THREE from "three";

/** Deterministic 0..1 noise so the same tick always draws the same particles. */
const noise = (seed: number) => { const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

function canvasTexture(size: number, draw: (ctx: CanvasRenderingContext2D, size: number) => void) {
  const canvas = document.createElement("canvas"); canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d"); if (!ctx) throw new Error("Canvas textures are unavailable");
  draw(ctx, size);
  const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace; return texture;
}

export type Burst = {
  /** Seconds since the burst started; nothing is drawn outside 0..life. */
  age: number; life: number; origin: THREE.Vector3; count: number; seed: number;
  /** Mean horizontal push (metres/second) and spread. */
  drift: THREE.Vector3; spread: THREE.Vector3; size: number; colors: number[]; opacity: number; gravity: number;
  /** Draw behind the keeper so the body occludes it (dust thrown up around a landing). */
  behind?: boolean;
};

/**
 * Turf, dust and glove-impact effects for the athletes. Every effect is a pure
 * function of recorded simulation time, so pause, replay and skipping frames
 * draw identical results.
 */
export class AthleteEffects {
  readonly group = new THREE.Group();
  private particles: THREE.Sprite[] = [];
  private flash: THREE.Sprite;
  private dotTexture: THREE.Texture;
  private flashTexture: THREE.Texture;
  private used = 0;
  constructor(pool = 48) {
    this.group.name = "AthleteEffects";
    this.dotTexture = canvasTexture(64, (ctx, size) => {
      const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
      g.addColorStop(0, "rgba(255,255,255,1)"); g.addColorStop(.45, "rgba(255,255,255,.65)"); g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = g; ctx.fillRect(0, 0, size, size);
    });
    this.flashTexture = canvasTexture(128, (ctx, size) => {
      const c = size / 2, g = ctx.createRadialGradient(c, c, 0, c, c, c);
      g.addColorStop(0, "rgba(255,255,255,1)"); g.addColorStop(.18, "rgba(255,250,225,.9)"); g.addColorStop(.5, "rgba(255,235,170,.25)"); g.addColorStop(1, "rgba(255,230,160,0)");
      ctx.fillStyle = g; ctx.fillRect(0, 0, size, size);
      ctx.translate(c, c); ctx.fillStyle = "rgba(255,255,240,.85)";
      for (let i = 0; i < 8; i++) { ctx.rotate(Math.PI / 4); ctx.beginPath(); ctx.moveTo(0, -3); ctx.lineTo(c * (i % 2 ? .62 : .95), 0); ctx.lineTo(0, 3); ctx.fill(); }
    });
    for (let i = 0; i < pool; i++) {
      const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: this.dotTexture, transparent: true, depthWrite: false, depthTest: false, toneMapped: false }));
      sprite.renderOrder = 4; sprite.visible = false; sprite.frustumCulled = false;
      this.particles.push(sprite); this.group.add(sprite);
    }
    this.flash = new THREE.Sprite(new THREE.SpriteMaterial({ map: this.flashTexture, transparent: true, depthWrite: false, depthTest: false, toneMapped: false, blending: THREE.AdditiveBlending }));
    this.flash.renderOrder = 6; this.flash.visible = false; this.flash.frustumCulled = false; this.group.add(this.flash);
  }
  begin() { this.used = 0; this.flash.visible = false; }
  burst(b: Burst) {
    if (b.age < 0 || b.age >= b.life) return;
    const t = b.age, fade = Math.pow(1 - t / b.life, 1.4);
    for (let i = 0; i < b.count && this.used < this.particles.length; i++) {
      const r = (k: number) => noise(b.seed + i * 7.31 + k * 1.913);
      const sprite = this.particles[this.used++], material = sprite.material as THREE.SpriteMaterial;
      const vx = b.drift.x + (r(1) - .5) * 2 * b.spread.x, vy = b.drift.y + r(2) * b.spread.y, vz = b.drift.z + (r(3) - .5) * 2 * b.spread.z;
      // Light drag keeps the spray close to the body instead of flying off.
      const travel = (1 - Math.exp(-3 * t)) / 3;
      sprite.position.set(b.origin.x + vx * travel, Math.max(.02, b.origin.y + vy * travel - b.gravity * t * t), b.origin.z + vz * travel);
      const size = b.size * (.6 + r(4) * .8) * (1 + t * 1.6);
      sprite.scale.set(size, size, 1);
      material.color.setHex(b.colors[Math.floor(r(5) * b.colors.length) % b.colors.length]);
      material.opacity = b.opacity * fade * (.55 + r(6) * .45);
      sprite.renderOrder = b.behind ? 1.8 : 4;
      sprite.visible = true;
    }
  }
  impact(age: number, at: THREE.Vector3) {
    const life = .32; if (age < 0 || age >= life) return;
    const t = age / life, size = .45 + t * .9;
    this.flash.position.copy(at); this.flash.scale.set(size, size, 1);
    (this.flash.material as THREE.SpriteMaterial).opacity = Math.pow(1 - t, 1.6);
    (this.flash.material as THREE.SpriteMaterial).rotation = t * .5;
    this.flash.visible = true;
  }
  end() { for (let i = this.used; i < this.particles.length; i++) this.particles[i].visible = false; }
  dispose() {
    for (const sprite of [...this.particles, this.flash]) (sprite.material as THREE.SpriteMaterial).dispose();
    this.dotTexture.dispose(); this.flashTexture.dispose(); this.group.removeFromParent();
  }
}
