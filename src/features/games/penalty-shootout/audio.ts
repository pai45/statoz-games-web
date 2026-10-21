import { Howl, Howler } from "howler";
import { publicAsset } from "@/shared/config/base-path";
import type { GameEvent, Settings } from "./game-types";
const root = "/assets/games/penalty-shootout/audio/";
export class ShootoutAudio {
  private effects = new Map<string, Howl>();
  private crowd: Howl;
  private lastEvent = 0;
  private running = false;
  private settings: Settings;
  constructor(settings: Settings) {
    this.settings = settings;
    for (const name of ["kick", "glove", "frame", "whistle", "goal", "result"]) this.effects.set(name, new Howl({ src: [publicAsset(`${root}${name}.wav`)], volume: settings.effects, preload: true }));
    this.crowd = new Howl({ src: [publicAsset(`${root}crowd.ogg`)], loop: true, volume: settings.crowd * 0.35, preload: true });
    this.configure(settings);
  }
  unlock() { this.running = true; void Howler.ctx?.resume(); if (!this.crowd.playing() && !this.settings.muted) this.crowd.play(); }
  reset() { this.lastEvent = 0; }
  configure(settings: Settings) { this.settings = settings; for (const effect of this.effects.values()) { effect.volume(settings.effects); effect.mute(settings.muted); } this.crowd.volume(settings.crowd * 0.35); this.crowd.mute(settings.muted); if (this.running && !settings.muted && !this.crowd.playing()) this.crowd.play(); }
  events(events: GameEvent[]) { for (const event of events) { if (event.id <= this.lastEvent) continue; this.lastEvent = event.id; this.effects.get(event.type)?.play(); } }
  pause() { this.running = false; this.crowd.pause(); for (const effect of this.effects.values()) effect.stop(); }
  dispose() { this.crowd.unload(); for (const effect of this.effects.values()) effect.unload(); }
}
