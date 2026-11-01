/** Original Cricketer challenges. Names, venues and opponents are fictional. */
export const TIERS = ['Village green', 'Pavilion lights', 'The grandstand'] as const;
export const VENUES = ['Willow Park', 'Pavilion Oval', 'Crown Ground'] as const;
export type Challenge = {id: string; name: string; target: number; balls: number; tier: number; lesson?: 'direction' | 'timing' | 'mixed'};
const targets = [5, 10, 15, 20, 24, 28, 32, 36, 40, 44, 48, 54];
const limits = [5, 6, 6, 6, 9, 9, 9, 9, 12, 12, 12, 12];
const names = ['First light', 'Find the gap', 'Over the rope', 'Village champion', 'New ball', 'Change of pace', 'Under the lights', 'Pavilion final', 'Quick hands', 'Spin cycle', 'Pressure chase', 'One last over'];
export const CHASES: Challenge[] = targets.map((target, i) => ({id: `chase-${i+1}`, name: names[i], target, balls: limits[i], tier: Math.floor(i/4)}));
export const LESSONS: Challenge[] = [
  {id: 'lesson-direction', name: 'Pick your side', target: 6, balls: 6, tier: 0, lesson: 'direction'},
  {id: 'lesson-timing', name: 'Find the middle', target: 12, balls: 6, tier: 0, lesson: 'timing'},
  {id: 'lesson-mixed', name: 'Read the delivery', target: 16, balls: 6, tier: 0, lesson: 'mixed'},
];
export const challengeFor = (id: string) => [...LESSONS, ...CHASES].find(c => c.id === id);
export const lessonCopy = (kind: Challenge['lesson']) => kind === 'direction' ? 'Watch the line. Tap LEFT for an off-side ball or RIGHT for a leg-side ball. The highlighted arrow helps.' : kind === 'timing' ? 'Wait for the ball. Tap as it reaches the bright contact zone beside your bat. Early or late shots lose power.' : 'Read line and length together. Drives, cuts, pulls and scoops are chosen for you. One timed tap is all you need.';
