import { gameSportFor } from '@/mocks/games/sport-decks';
import type { GameId } from '../types';

export const bundledGameIds: readonly GameId[] = [
  'stick-cricket', 'archery-test', 'penalty-shooters-2', 'football-shooting',
  'tennis-bits', 'soccer-real', 'retro-innings', 'f1-racing',
  'pitch-rush', 'retro-football-2', 'retro-hoops',
];

export const isBundledGame = (game: GameId) => bundledGameIds.includes(game);
export const gameHubHref = (game: GameId) => `/games/${gameSportFor(game)}`;
