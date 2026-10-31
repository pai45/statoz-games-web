import { gameSportFor } from '@/mocks/games/sport-decks';
import type { GameId } from '../types';

export const bundledGameIds: readonly GameId[] = [
  "penalty-cup",
  'stick-cricket', 'archery-test',
  'tennis-bits', 'soccer-real', 'f1-racing',
  'pitch-rush',
];

export const isBundledGame = (game: GameId) => bundledGameIds.includes(game);
export const gameHubHref = (game: GameId) => `/games/${gameSportFor(game)}`;
