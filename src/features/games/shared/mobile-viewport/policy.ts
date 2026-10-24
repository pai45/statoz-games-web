export function usesMobileLandscape(game: string): boolean {
  return game !== 'football-chess' && game !== 'tennis-rally';
}

export function landscapeGeometry(width: number, height: number) {
  return {
    width: Math.max(width, height),
    height: Math.min(width, height),
    transform: height > width ? `translateX(${width}px) rotate(90deg)` : 'none',
  };
}
