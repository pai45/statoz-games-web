// Longbow content: three original ranges, thirty career levels and three rival archers.

export type TargetSize = 'standard' | 'small';
export type Motion =
  | {kind: 'none'}
  | {kind: 'slide'; amplitude: number; period: number}
  | {kind: 'swing'; amplitude: number; period: number};

export type Level = {
  id: string;
  index: number;
  range: number;
  name: string;
  distance: number;
  target: TargetSize;
  motion: Motion;
  /** Wind speed range in m/s, re-rolled every end of three arrows. */
  wind: [number, number];
  arrows: number;
  /** Scores needed for one, two and three stars. One star clears the level. */
  stars: [number, number, number];
};

export type Opponent = {
  id: string;
  name: string;
  title: string;
  distance: number;
  wind: [number, number];
  /** Spread of the rival's arrows on the target face, in metres (1 sigma per axis). */
  spread: number;
  /** How badly the rival reads the wind: 0 is perfect, 0.5 means half the drift is misjudged. */
  windError: number;
};

export const RANGES = [
  {name: 'Meadow', blurb: 'Open grass, short lanes and a gentle breeze.'},
  {name: 'Pinewood', blurb: 'Longer lanes between the pines. Targets start to move.'},
  {name: 'Red Canyon', blurb: 'Long shots, strong gusts and small, restless targets.'},
] as const;

export const TARGET_RADIUS: Record<TargetSize, number> = {standard: 0.61, small: 0.4};
export const RANGE_UNLOCK_STARS = 20;
export const ARROWS_PER_END = 3;

const still: Motion = {kind: 'none'};
const slide = (amplitude: number, period: number): Motion => ({kind: 'slide', amplitude, period});
const swing = (amplitude: number, period: number): Motion => ({kind: 'swing', amplitude, period});

type Row = [name: string, distance: number, target: TargetSize, motion: Motion, wind: [number, number], arrows: number];
const rows: Row[] = [
  // Meadow
  ['First Draw', 15, 'standard', still, [0, 0], 3],
  ['Steady Hands', 18, 'standard', still, [0, 0], 3],
  ['Clover Lane', 20, 'standard', still, [0, 1], 6],
  ['Hay Bale Row', 25, 'standard', still, [0, 2], 6],
  ['Breeze Check', 25, 'standard', still, [1, 3], 6],
  ['Long Grass', 30, 'standard', still, [1, 3], 6],
  ['The Drifter', 30, 'standard', slide(0.8, 4.5), [0, 2], 6],
  ['Windmill Field', 35, 'standard', still, [2, 4], 6],
  ['Little Gold', 35, 'small', still, [0, 2], 6],
  ['Meadow Final', 40, 'standard', slide(1, 4), [2, 4], 9],
  // Pinewood
  ['Pine Gate', 30, 'standard', still, [2, 4], 6],
  ['Needle Path', 35, 'standard', slide(1.2, 4), [1, 3], 6],
  ['Hanging Ring', 35, 'standard', swing(0.35, 3.2), [0, 2], 6],
  ['Timber Line', 40, 'standard', still, [3, 5], 6],
  ['Fox Run', 45, 'standard', slide(1.4, 3.6), [2, 4], 6],
  ['Woodcutter', 45, 'small', still, [2, 5], 6],
  ['Pendulum', 50, 'standard', swing(0.4, 3), [2, 4], 6],
  ['Ridge Wind', 50, 'standard', still, [4, 6], 9],
  ['Shadow Glade', 55, 'small', slide(1.2, 4), [2, 5], 6],
  ['Pinewood Final', 60, 'standard', swing(0.45, 2.8), [3, 6], 9],
  // Red Canyon
  ['Dust Devil', 50, 'standard', still, [4, 7], 6],
  ['Sandstone', 55, 'standard', slide(1.6, 3.4), [3, 6], 6],
  ['Red Arch', 60, 'small', still, [4, 7], 6],
  ['Gust Corridor', 65, 'standard', still, [6, 9], 6],
  ['Coyote Run', 65, 'standard', slide(1.8, 3), [4, 7], 6],
  ['Bell Rope', 70, 'standard', swing(0.5, 2.6), [4, 8], 6],
  ['Mesa Top', 75, 'small', still, [5, 9], 6],
  ['Rattler', 80, 'small', slide(1.5, 3.2), [4, 8], 9],
  ['Thunder Gap', 85, 'standard', swing(0.5, 2.4), [7, 11], 9],
  ['Canyon Crown', 90, 'small', still, [8, 12], 9],
];

/** Fractions of a perfect score needed for one, two and three stars, easing a little per range. */
const STAR_FRACTIONS: [number, number, number][] = [[0.6, 0.78, 0.9], [0.55, 0.74, 0.87], [0.5, 0.7, 0.84]];

export const LEVELS: Level[] = rows.map(([name, distance, target, motion, wind, arrows], index) => {
  const range = Math.floor(index / 10), max = arrows * 10;
  const [a, b, c] = STAR_FRACTIONS[range];
  return {
    id: `level-${String(index + 1).padStart(2, '0')}`, index, range, name, distance, target, motion, wind, arrows,
    stars: [Math.round(max * a), Math.round(max * b), Math.round(max * c)],
  };
});

export const OPPONENTS: Opponent[] = [
  {id: 'wren', name: 'Wren Hollis', title: 'Village Rookie', distance: 30, wind: [0, 3], spread: 0.2, windError: 0.5},
  {id: 'tamsin', name: 'Tamsin Rook', title: 'Forest Ranger', distance: 50, wind: [2, 6], spread: 0.12, windError: 0.25},
  {id: 'odette', name: 'Odette Vale', title: 'Canyon Champion', distance: 70, wind: [4, 9], spread: 0.075, windError: 0.1},
];

export const MATCH_ENDS = 5;
export const levelFor = (id: string) => LEVELS.find(level => level.id === id) ?? null;
export const opponentFor = (id: string) => OPPONENTS.find(opponent => opponent.id === id) ?? null;
