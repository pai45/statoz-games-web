/**
 * Football Chess's public API.
 *
 * Only the surface the launcher mounts. The engine, the opponent and the save
 * stay internal: nothing outside this module should reach a rule or a save.
 */
export { FootballChess } from "./components/football-chess";
export type { FootballChessProps } from "./components/football-chess";
