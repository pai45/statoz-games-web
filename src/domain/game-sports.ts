import {sportOrder, sportModules, type Sport} from './sports';
export type GameSport = Sport | 'golf';
export const gameSportOrder: GameSport[] = [...sportOrder, 'golf'];
export const gameSportModules = {...sportModules, golf: {sport: 'golf' as const, label: 'Golf', shortLabel: 'GOLF', accent: 'lime' as const}};
export const gameSportModuleFor = (sport: GameSport) => gameSportModules[sport];
