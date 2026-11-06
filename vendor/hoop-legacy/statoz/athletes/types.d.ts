import '../../src/game/world/Character';
declare module '../../src/game/world/Character' {
  interface Character {
    setDetail?: (detail:'game'|'hero')=>Promise<void>;
  }
}
