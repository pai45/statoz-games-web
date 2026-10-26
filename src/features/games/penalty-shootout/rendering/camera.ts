import type { Frame, Snapshot, Vec3 } from "../game-types";

/** The imported art depicts the striker's back and the keeper's front.
 * Keep every mode on that side of the pitch, including recorded replays. */
export function broadcastCamera(frame: Frame, snapshot: Snapshot, aspect: number, reducedMotion: boolean) {
  const portrait = aspect < 1, replaying = snapshot.phase === "replay";
  const run = Math.min(1, frame.shooterTime), push = reducedMotion ? 0 : run * 0.4;
  const horizontalFov = portrait ? 12.5 : replaying ? 20.5 : 21.5;
  const position: Vec3 = { x: 0.45, y: 4.7, z: 43.5 - push };
  const tracking = !reducedMotion && snapshot.phase === "flight" ? Math.max(-0.35, Math.min(0.35, frame.ball.x * 0.1)) : 0;
  const look: Vec3 = { x: tracking, y: 0.8, z: 4 };
  return { position, look, fov: 2 * Math.atan(Math.tan(horizontalFov * Math.PI / 360) / aspect) * 180 / Math.PI };
}
