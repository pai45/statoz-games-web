export function usesMobileLandscape(game: string): boolean {
  // Final Third is designed portrait-first (swipe up at the goal), like a phone football game.
  return game !== 'cricketer' && game !== 'tennis-rally' && game !== 'final-third' && game !== 'archery-test' && game !== 'football-shooting';
}

/** Phones only (either side of the screen at most 500px), not tablets: these get the landscape platform shell. */
export const phoneQuery = '(pointer: coarse) and (max-width: 500px), (pointer: coarse) and (max-height: 500px)';

/**
 * Whether an app route takes over the whole screen rather than living inside
 * the rotated platform shell. The shop is portrait-first; games, streaks and
 * sign-in also leave it. Other platform tabs retain their existing layout.
 */
export function leavesPlatformFrame(pathname: string): boolean {
  return /^\/(play|shop|streaks|login|onboarding)(\/|$)/.test(pathname);
}

export function landscapeGeometry(width: number, height: number) {
  return {
    width: Math.max(width, height),
    height: Math.min(width, height),
    transform: height > width ? `translateX(${width}px) rotate(90deg)` : 'none',
  };
}
