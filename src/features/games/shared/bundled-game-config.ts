import { gameSportFor } from '@/mocks/games/sport-decks';
import type { GameId } from '../types';

export const bundledGameIds: readonly GameId[] = [
  'stick-cricket', 'archery-test', 'penalty-shooters-2',
  'tennis-bits', 'soccer-real', 'f1-racing',
  'pitch-rush',
];

export const isBundledGame = (game: GameId) => bundledGameIds.includes(game);
export const gameHubHref = (game: GameId) => `/games/${gameSportFor(game)}`;
