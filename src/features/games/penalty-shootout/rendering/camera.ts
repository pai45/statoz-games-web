import type { Frame, Snapshot, Vec3 } from "../game-types";

/** Original long-lens staging informed by the supplied PC/PS4 recordings. */
export function broadcastCamera(frame: Frame, snapshot: Snapshot, aspect: number, reducedMotion: boolean) {
  const portrait = aspect < 1, replaying = snapshot.phase === "replay";
  const run = Math.min(1, frame.shooterTime), push = reducedMotion ? 0 : run * 0.4;
  const horizontalFov = replaying ? portrait ? 67 : 52 : snapshot.role === "keeping" ? portrait ? 43 : 65 : portrait ? 12.5 : 21.5;
  const position: Vec3 = replaying ? { x: 15.4, y: 4.2, z: 15.5 } : snapshot.role === "keeping" ? { x: 0, y: 2.8, z: -11.8 } : { x: 0.45, y: 4.7, z: 43.5 - push };
  const tracking = !reducedMotion && snapshot.phase === "flight" ? Math.max(-0.35, Math.min(0.35, frame.ball.x * 0.1)) : 0;
  const look: Vec3 = replaying ? { x: 0, y: 0.8, z: 5.3 } : snapshot.role === "keeping" ? { x: 0, y: 0.9, z: 8 } : { x: tracking, y: 0.8, z: 4 };
  return { position, look, fov: 2 * Math.atan(Math.tan(horizontalFov * Math.PI / 360) / aspect) * 180 / Math.PI };
}
