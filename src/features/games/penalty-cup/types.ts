import type { KickResult, MatchCheckpoint } from '../penalty-shootout/game-types';

export type Stage = 'group' | 'round32' | 'round16' | 'quarter' | 'semi' | 'bronze' | 'final';
export type MatchOutcome = 'win' | 'loss' | 'draw';
export type Nation = { id: string; name: string; flag: string; group: string; rank: number; primary: string; secondary: string };
export type MatchResult = { id: string; score: [number, number]; outcome: MatchOutcome; kicks: KickResult[]; suddenDeath: boolean };
export type Fixture = { id: string; stage: Stage; day: number; home: string; away: string; score?: [number, number]; winner?: string; seed: number; attempts: number };
export type Standing = { team: string; played: number; won: number; drawn: number; lost: number; gf: number; ga: number; gd: number; points: number };
export type Cup = { version: 2; dataVersion: string; id: string; team: string; seed: number; stage: Stage; day: number; fixtures: Fixture[]; status: 'active' | 'eliminated' | 'champion' | 'runner-up' | 'third' | 'fourth'; pending: MatchResult | null; checkpoint: { id: string; match: MatchCheckpoint } | null; updatedAt: string };
export type CupSave = { version: 2; revision: number; active: Cup | null; history: Cup[] };
export const stageNames: Record<Stage, string> = { group:'Group stage', round32:'Round of 32', round16:'Round of 16', quarter:'Quarter-final', semi:'Semi-final', bronze:'Third-place match', final:'Final' };
