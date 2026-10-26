import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { frameAt, keeperSample, strikerFrame, type CharacterPack } from "../src/features/games/penalty-shootout/rendering/sprite-motion";
import { broadcastCamera } from "../src/features/games/penalty-shootout/rendering/camera";
import type { Frame, Snapshot } from "../src/features/games/penalty-shootout/game-types";

const pack: CharacterPack = JSON.parse(fs.readFileSync("public/assets/games/penalty-shootout/imported-characters/manifest.json", "utf8"));
test("Imported atlases retain every source frame and valid frame regions", () => {
  assert.equal(pack.striker.animations.kick.frames.length, 55);
  for (const [name, count] of Object.entries({ Idle: 12, MidCatch: 8, MidParade: 46, LowCatch: 31, HighCatch: 10, HighParade: 48 })) assert.equal(pack.keeper.animations[name].frames.length, count);
  for (const actor of [pack.striker, pack.keeper]) {
    assert.ok(fs.statSync("public/assets/games/penalty-shootout/imported-characters/" + actor.atlas).size > 0);
    for (const clip of Object.values(actor.animations)) for (const f of clip.frames) {
      assert.ok(f.durationMs > 0);
      assert.ok(f.x >= 0 && f.y >= 0 && f.x + f.w <= actor.atlasWidth && f.y + f.h <= actor.atlasHeight);
    }
  }
});
test("Imported striker contact is sampled at the physics release marker", () => {
  const clip = pack.striker.animations.kick;
  assert.ok(clip.contactFrame !== undefined);
  assert.equal(strikerFrame(pack.striker, { shooterClip: "kick_driven", shooterTime: 1 }), clip.contactFrame);
  assert.ok(strikerFrame(pack.striker, { shooterClip: "kick_driven", shooterTime: .99 }) < clip.contactFrame!);
  assert.equal(strikerFrame(pack.striker, { shooterClip: "prepare", shooterTime: 1 }), 0);
  assert.equal(strikerFrame(pack.striker, { shooterClip: "celebrate", shooterTime: .1 }), 0);
});
test("Keeper playback follows recorded time, completes recovery and mirrors source dives", () => {
  const frame = { tick: 80, keeperClip: "dive_mid_left", keeperTime: .55, keeper: { direction: -1, height: 0, dive: .55 } } as Frame;
  const sample = keeperSample(pack.keeper, frame);
  assert.equal(sample.name, "MidParade"); assert.equal(sample.mirror, false);
  assert.equal(keeperSample(pack.keeper, { ...frame, keeper: { ...frame.keeper, direction: 1 } }).mirror, true);
  const last = keeperSample(pack.keeper, { ...frame, keeper: { ...frame.keeper, dive: 2.75 } });
  assert.equal(last.index, 45);
  // Visiting later replay frames cannot mutate the result of an earlier sample.
  assert.deepEqual(keeperSample(pack.keeper, frame), sample);
  const low = keeperSample(pack.keeper, { ...frame, keeper: { ...frame.keeper, height: -1, dive: .55 } });
  assert.equal(low.name, "LowCatch"); assert.equal(low.index, 10);
  const idle = pack.keeper.animations.Idle, period = idle.frames.reduce((sum, f) => sum + f.durationMs, 0);
  assert.equal(frameAt(idle, 0), frameAt(idle, period));
});
test("Imported front-facing keeper remains on the source-facing camera side in both roles and replay", () => {
  const frame = { shooterTime: 0, ball: { x: 0 } } as Frame;
  for (const role of ["shooting", "keeping"] as const) for (const phase of ["preparation", "replay"] as const) {
    const view = broadcastCamera(frame, { role, phase } as Snapshot, 16 / 9, false);
    assert.ok(view.position.z > 11);
  }
});
