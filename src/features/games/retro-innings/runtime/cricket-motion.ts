/* eslint-disable @typescript-eslint/no-explicit-any -- Presentation reads the preserved JavaScript match state. */
/** Source pose identities from movement-identity-v3; holds are authored adaptations.
 * Recording sample times are evidence for sequence order, not native game cadence.
 */
export const bowlingHolds = [
  { id: 'bowler-4', until: 90, phase: 'release', sourceSecond: 132 },
  { id: 'bowler-5', until: 220, phase: 'follow-through', sourceSecond: 132.1 },
  { id: 'bowler-6', until: 460, phase: 'recovery', sourceSecond: 132.25 },
  { id: 'bowler-ready', until: Infinity, phase: 'ready', sourceSecond: null },
] as const;

export function bowlingPose(s: any) {
  if (s.phase === 'runup') {
    // The existing simulation releases at 500ms. Keep the gather/brace ahead of it.
    if (s.age < 300) return 'bowler-' + Math.floor(s.age / 100) % 2;
    return s.age < 400 ? 'bowler-2' : 'bowler-3';
  }
  if (s.phase === 'delivery' && s.ball) {
    const release = [...s.events].reverse().find((event: any) => event.type === 'release');
    const age = release ? s.time - release.time : s.age;
    return bowlingHolds.find(hold => age < hold.until)!.id;
  }
  return 'bowler-ready';
}

export function runningPose(s: any, runner: any) {
  if (!s.run.moving) return 'runner-distant';
  // Pose progression follows distance along this run; no idle/global clock cycling.
  const step = Math.floor(s.run.p * 16 + runner.id * 4);
  return 'runner-stride-' + ((step % 8 + 8) % 8);
}
