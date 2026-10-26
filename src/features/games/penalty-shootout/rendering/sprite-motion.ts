import type { Frame } from "../game-types";

export type AtlasFrame = { x: number; y: number; w: number; h: number; durationMs: number; sourceFrame: number };
export type SpriteClip = { fps: number; loop: boolean; contactFrame?: number; frames: AtlasFrame[] };
export type SpriteActor = {
  atlas: string; atlasWidth: number; atlasHeight: number;
  frameWidth: number; frameHeight: number; origin: [number, number];
  neutralHeight: number; groundOffset: number; animations: Record<string, SpriteClip>;
  contactAnchor?: [number, number]; bootContactAnchor?: [number, number]; sourceBallGround?: [number, number];
};
export type CharacterPack = { version: number; striker: SpriteActor; keeper: SpriteActor };

/** Sample explicit frame holds, independent of display rate and replay order. */
export function frameAt(clip: SpriteClip, elapsedMs: number): number {
  const duration = clip.frames.reduce((sum, frame) => sum + frame.durationMs, 0);
  let time = Math.max(0, elapsedMs);
  if (clip.loop && duration > 0) time %= duration;
  for (let i = 0; i < clip.frames.length; i++) {
    if (time < clip.frames[i].durationMs) return i;
    time -= clip.frames[i].durationMs;
  }
  return clip.frames.length - 1;
}

export function strikerFrame(actor: SpriteActor, frame: Pick<Frame, "shooterClip" | "shooterTime">): number {
  const clip = actor.animations.kick;
  if (frame.shooterClip.startsWith("prepare")) return 0;
  // The source ends mid follow-through. It has no celebration/recovery clip;
  // use its grounded neutral pose when the simulation enters a result reaction.
  if (!frame.shooterClip.startsWith("kick_")) return 0;
  const contact = clip.contactFrame ?? 30;
  const contactMs = clip.frames.slice(0, contact).reduce((sum, item) => sum + item.durationMs, 0);
  // The existing physics releases the ball exactly one second into the run-up.
  // Retime the approach to that marker, then retain the source follow-through holds.
  const elapsed = frame.shooterTime <= 1 ? frame.shooterTime * contactMs : contactMs + (frame.shooterTime - 1) * 1000;
  return frameAt(clip, elapsed + 1e-6);
}

export function keeperSample(actor: SpriteActor, frame: Pick<Frame, "tick" | "keeper" | "keeperClip" | "keeperTime">) {
  const active = /^(dive_|recovery_|centre_block|catch|parry_)/.test(frame.keeperClip);
  const name = !active ? "Idle" : frame.keeper.direction === 0
    ? frame.keeper.height > .3 ? "HighCatch" : frame.keeper.height < -.3 ? "LowCatch" : "MidCatch"
    : frame.keeper.height > .3 ? "HighParade" : frame.keeper.height < -.3 ? "LowCatch" : "MidParade";
  const clip = actor.animations[name];
  if (!active) return { name, index: frameAt(clip, frame.tick / 120 * 1000), mirror: false };
  // Sample the complete authored action through the existing 2.75 s dive/recovery
  // window. No live wall clock: pause and replay retain exactly the recorded pose.
  const age = frame.keeper.dive || frame.keeperTime;
  const duration = clip.frames.reduce((sum, item) => sum + item.durationMs, 0);
  // Bring the authored reach pose to the simulation's extension window, then
  // let the remaining poses recover. Uniformly stretching a short low catch
  // over 2.75 s would leave the visible gloves at waist height during the save.
  const reachIndex = name === "MidCatch" ? 4 : name === "HighCatch" ? 6 : 10;
  const reachMs = clip.frames.slice(0, reachIndex).reduce((sum, item) => sum + item.durationMs, 0);
  const reachSeconds = name.endsWith("Catch") && name !== "LowCatch" ? .35 : .55;
  const elapsed = age <= reachSeconds ? Math.max(0, age) / reachSeconds * reachMs
    : reachMs + Math.min(1, (age - reachSeconds) / (2.75 - reachSeconds)) * Math.max(0, duration - 1 - reachMs);
  // The source lateral dive travels toward screen-left.
  return { name, index: frameAt(clip, elapsed), mirror: frame.keeper.direction > 0 };
}
