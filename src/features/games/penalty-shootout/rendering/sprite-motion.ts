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

/** One keyframe of a retimed keeper action: [dive age in seconds, source frame, tilt in radians]. */
type DiveKey = [seconds: number, frame: number, tilt?: number];
type DiveTimeline = { clip: string; keys: DiveKey[]; landAt: number; airborneFrom: number };
export type KeeperMotionName = "Idle" | "MidDive" | "HighDive" | "LowDive" | "MidCatch" | "HighCatch" | "LowCatch";

/** Spread a run of source frames evenly across a time window. */
const span = (from: number, to: number, start: number, end: number): DiveKey[] =>
  Array.from({ length: to - from + 1 }, (_, i) => [start + (end - start) * i / Math.max(1, to - from + 1), from + i] as DiveKey);

// Hand-placed timing for the imported dives. The source clips open with five
// near-identical standing frames; stretching those across the reach window made
// the keeper stand still, slide sideways, then pop into the air. These skip to
// the load/push frames, reach full stretch alongside the collider extension
// (0.07-0.5 s), land at the simulation's landing window and fill the existing
// 2.75 s recovery with the native ground, get-up and reset frames.
const DIVES: Record<"MidDive" | "HighDive" | "LowDive", DiveTimeline> = {
  MidDive: { clip: "MidParade", landAt: .62, airborneFrom: 8, keys: [
    [0, 5], [.05, 6], [.1, 7], [.17, 8, .06], [.26, 9], [.38, 10], [.5, 11], [.62, 12], [.7, 13], [.78, 14], [.86, 15],
    ...span(16, 23, .95, 1.45), ...span(24, 35, 1.45, 2.3), ...span(36, 45, 2.3, 2.7)] },
  HighDive: { clip: "HighParade", landAt: .68, airborneFrom: 7, keys: [
    [0, 4], [.05, 5], [.11, 6], [.18, 7], [.28, 8], [.4, 9], [.52, 10], [.6, 11], [.68, 12], [.76, 13],
    ...span(14, 23, .84, 1.45), ...span(24, 35, 1.45, 2.3), ...span(36, 47, 2.3, 2.7)] },
  // No native low side dive exists. Build one from the mid dive: load, push,
  // tip over toward the post (sprite tilt), then the flat near-ground stretch.
  LowDive: { clip: "MidParade", landAt: .34, airborneFrom: 11, keys: [
    [0, 5], [.05, 6], [.09, 7], [.13, 7, .22], [.17, 7, .42], [.2, 11], [.34, 12], [.44, 13], [.54, 14], [.64, 15],
    ...span(16, 23, .74, 1.45), ...span(24, 35, 1.45, 2.3), ...span(36, 45, 2.3, 2.7)] },
};

/** Step through frames; tilt eases between neighbouring keys. */
function sampleKeys(keys: DiveKey[], age: number) {
  let i = 0;
  while (i + 1 < keys.length && keys[i + 1][0] <= age) i++;
  const [time, frame, tilt = 0] = keys[i], next = keys[i + 1];
  const nextTilt = next && next[1] === frame ? next[2] ?? 0 : 0;
  const t = next ? Math.min(1, Math.max(0, (age - time) / (next[0] - time))) : 0;
  return { index: frame, tilt: tilt + (nextTilt - tilt) * t };
}

/** `landAt` is the dive age of touchdown; `airborneFrom` the first source frame off the ground. Both null when not diving sideways. */
export type KeeperSample = { name: string; motion: KeeperMotionName; index: number; mirror: boolean; tilt: number; landAt: number | null; airborneFrom: number | null; age: number };

export function keeperSample(actor: SpriteActor, frame: Pick<Frame, "tick" | "keeper" | "keeperClip" | "keeperTime">): KeeperSample {
  const active = /^(dive_|recovery_|centre_block|catch|parry_)/.test(frame.keeperClip);
  if (!active) return { name: "Idle", motion: "Idle", index: frameAt(actor.animations.Idle, frame.tick / 120 * 1000), mirror: false, tilt: 0, landAt: null, airborneFrom: null, age: 0 };
  // Sample from the recorded dive age only. No live wall clock: pause and
  // replay retain exactly the recorded pose.
  const age = Math.max(0, frame.keeper.dive || frame.keeperTime), high = frame.keeper.height > .3, low = frame.keeper.height < -.3;
  if (frame.keeper.direction !== 0) {
    const motion = high ? "HighDive" : low ? "LowDive" : "MidDive", dive = DIVES[motion], { index, tilt } = sampleKeys(dive.keys, age);
    // The source lateral dive travels toward screen-left; mirror for screen-right.
    const mirror = frame.keeper.direction > 0;
    return { name: dive.clip, motion, index, mirror, tilt: mirror ? -tilt : tilt, landAt: dive.landAt, airborneFrom: dive.airborneFrom, age };
  }
  // Centre saves play at their authored speed, hold the save, then reverse
  // back into the ready stance before the simulation's recovery ends.
  const name = high ? "HighCatch" : low ? "LowCatch" : "MidCatch", clip = actor.animations[name];
  const lead = name === "LowCatch" ? 5 : 0, leadMs = clip.frames.slice(0, lead).reduce((sum, item) => sum + item.durationMs, 0);
  const duration = clip.frames.reduce((sum, item) => sum + item.durationMs, 0) - leadMs;
  let elapsed = age * 1000;
  if (name !== "LowCatch" && age > 1.6) elapsed = Math.max(0, duration - (age - 1.6) * 1000);
  return { name, motion: name, index: Math.max(lead, frameAt(clip, leadMs + elapsed)), mirror: false, tilt: 0, landAt: null, airborneFrom: null, age };
}
