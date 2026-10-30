export function usesMobileLandscape(game: string): boolean {
  // Final Third is designed portrait-first (swipe up at the goal), like a phone football game.
  // Pitch Duel is a portrait card battler: scoreboard on top, moves under the thumb.
  return game !== 'football-chess' && game !== 'tennis-rally' && game !== 'final-third' && game !== 'archery-test' && game !== 'football-shooting' && game !== 'pitch-duel';
}

export function landscapeGeometry(width: number, height: number) {
  return {
    width: Math.max(width, height),
    height: Math.min(width, height),
    transform: height > width ? `translateX(${width}px) rotate(90deg)` : 'none',
  };
}
