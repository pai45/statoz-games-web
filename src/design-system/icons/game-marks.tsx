import { Icon, type IconProps } from "./icon";

type GameMarkGeometry = { paths: readonly string[]; fills: readonly string[] };

export type StatozGameId =
  | "pitch-duel"
  | "penalty-shootout"
  | "football-chess"
  | "football-quiz"
  | "football-bingo"
  | "guess-player"
  | "final-over"
  | "cricket-quiz"
  | "cricket-guess-player"
  | "hoop-duel"
  | "basketball-quiz"
  | "basketball-guess-player"
  | "tennis-rally"
  | "tennis-quiz"
  | "tennis-guess-winner"
  | "grand-prix-dash"
  | "motorsport-quiz"
  | "guess-driver";

function quiz(markerPath: string, markerFill?: string): GameMarkGeometry {
  return {
    paths: ["M7 3h16l4 4v9l-3 3h-5l-3 3v7H7l-4-4V7Z", "M8.5 10C8.5 5 15.5 5 15.5 9C15.5 12 12 12 12 15", markerPath],
    fills: ["M11 18L13 18L13 20L11 20Z", ...(markerFill ? [markerFill] : [])],
  };
}

function player(markerPath: string, markerFill: string): GameMarkGeometry {
  return {
    paths: ["M10 4h10l3 3 6 3-3 6-5-3v6h-4v10H9V13l-4 3-3-6 5-3Z", "M11 4l4 4 4-4", "M11.38 13C11.38 9.25 16.63 9.25 16.63 12.25C16.63 14.5 14 14.5 14 16.75", markerPath],
    fills: ["M13.25 19L14.75 19L14.75 20.5L13.25 20.5Z", markerFill],
  };
}

function sleevelessPlayer(markerPath: string): GameMarkGeometry {
  return {
    paths: ["M6 3h5c0 5 8 5 8 0h5v7l-3 4v5h-4v10H9V14l-3-4Z", "M11.38 13C11.38 9.25 16.63 9.25 16.63 12.25C16.63 14.5 14 14.5 14 16.75", markerPath],
    fills: ["M13.25 19L14.75 19L14.75 20.5L13.25 20.5Z"],
  };
}

/** Original StatOz game artwork, sharing the sport family's 32px master grid. */
const gameMarks = {
  "pitch-duel": { paths: ["M6 23H3V7l4-4h14l3 3v1", "M13 9h12l4 4v12l-4 4H13l-4-4V13Z", "M19 13.5L21.75 14.24L23.76 16.25L24.5 19L23.76 21.75L21.75 23.76L19 24.5L16.25 23.76L14.24 21.75L13.5 19L14.24 16.25L16.25 14.24Z", "M19 16.47L19 13.83M21.41 18.22L23.92 17.4M20.49 21.05L22.04 23.18M17.51 21.05L15.96 23.18M16.59 18.22L14.08 17.4"], fills: ["M19 16.47L21.41 18.22L20.49 21.05L17.51 21.05L16.59 18.22Z"] },
  "penalty-shootout": { paths: ["M3 20V7l3-3h20l3 3v13M7 9h18M16 9v6", "M17 26l9-9M21 17h5v5", "M8.5 20L10.75 20.6L12.4 22.25L13 24.5L12.4 26.75L10.75 28.4L8.5 29L6.25 28.4L4.6 26.75L4 24.5L4.6 22.25L6.25 20.6Z"], fills: ["M8.5 22.43L10.47 23.86L9.72 26.17L7.28 26.17L6.53 23.86Z"] },
  "football-chess": { paths: ["M7 4h18l3 3v18l-3 3H7l-3-3V7Z", "M12 4v3h8V4M12 28v-3h8v3M4 16h6M22 16h6", "M12 23l8-12M15 11h5v5", "M22 7h4v4h-4Z"], fills: ["M6 20h4v4H6Z"] },
  "football-quiz": quiz("M25 20.5L27.25 21.1L28.9 22.75L29.5 25L28.9 27.25L27.25 28.9L25 29.5L22.75 28.9L21.1 27.25L20.5 25L21.1 22.75L22.75 21.1Z", "M25 22.93L26.97 24.36L26.22 26.67L23.78 26.67L23.03 24.36Z"),
  "football-bingo": { paths: ["M7 4h18l3 3v18l-3 3H7l-3-3V7Z", "M4 12h24M4 20h24M12 4v24M20 4v24"], fills: ["M7 6h3v4H6V7ZM14 14h4v4h-4ZM22 22h4v3l-1 1h-3Z"] },
  "guess-player": player("M25 20.5L27.25 21.1L28.9 22.75L29.5 25L28.9 27.25L27.25 28.9L25 29.5L22.75 28.9L21.1 27.25L20.5 25L21.1 22.75L22.75 21.1Z", "M25 22.93L26.97 24.36L26.22 26.67L23.78 26.67L23.03 24.36Z"),
  "final-over": { paths: ["M13.87 2.59L16.13 3.41L13.73 9.99L11.48 9.17Z", "M11.48 9.17L13.73 9.99L14.74 12.48L9.27 27.52L7.64 29.06L3.89 27.69L3.63 25.47L9.1 10.43Z", "M13.09 4.75L15.34 5.57M12.3 6.91L14.55 7.73", "M20 13v16M24 13v16M28 13v16M19 10h4M25 10h4"], fills: [] },
  "cricket-quiz": quiz("M27 20L26.19 22.24", "M25.8 22.1L26.57 22.38L27.23 23.34L25.37 28.45L24.82 28.98L22.9 28.28L22.81 27.52L24.68 22.41Z"),
  "cricket-guess-player": player("M27 20L26.19 22.24", "M25.8 22.1L26.57 22.38L27.23 23.34L25.37 28.45L24.82 28.98L22.9 28.28L22.81 27.52L24.68 22.41Z"),
  "hoop-duel": { paths: ["M10.5 3L14.25 4L17 6.75L18 10.5L17 14.25L14.25 17L10.5 18L6.75 17L4 14.25L3 10.5L4 6.75L6.75 4Z", "M3 10.5H18M6.75 4.05C15.38 8.25 15.38 12.75 6.75 16.95", "M24 6h5v9", "M18 18h11l-2 3h-7Z", "M20 21l2 7h3l2-7M23.5 21v7"], fills: [] },
  "basketball-quiz": quiz("M25 20.5L27.25 21.1L28.9 22.75L29.5 25L28.9 27.25L27.25 28.9L25 29.5L22.75 28.9L21.1 27.25L20.5 25L21.1 22.75L22.75 21.1ZM20.5 25H29.5M22.75 21.13C27.93 23.65 27.93 26.35 22.75 28.87"),
  "basketball-guess-player": sleevelessPlayer("M25 20.5L27.25 21.1L28.9 22.75L29.5 25L28.9 27.25L27.25 28.9L25 29.5L22.75 28.9L21.1 27.25L20.5 25L21.1 22.75L22.75 21.1ZM20.5 25H29.5M22.75 21.13C27.93 23.65 27.93 26.35 22.75 28.87"),
  "tennis-rally": { paths: ["M8.63 14.11L9.26 10.08L13.08 6.26L17.11 5.63L19.37 7.89L18.74 11.92L14.92 15.74L10.89 16.37Z", "M8.63 14.11L7.99 17.01L10.89 16.37", "M11.45 13.55L16.55 8.45M11.74 8.74L16.26 13.26", "M22 7a3 3 0 1 0 6 0a3 3 0 1 0 -6 0Z", "M23.5 4.42Q27.55 7 23.5 9.58", "M18 21h11M18 21v8M29 21v8M18 25h11M23.5 21v8"], fills: ["M7.07 16.09L8.91 17.93L4.67 22.17L2.83 20.33Z"] },
  "tennis-quiz": quiz("M23.31 25.56L23.63 23.54L25.54 21.63L27.56 21.31L28.69 22.44L28.37 24.46L26.46 26.37L24.44 26.69ZM23.31 25.56L22.11 27.89L24.44 26.69", "M21.47 27.25L22.75 28.53L21.33 29.94L20.06 28.67Z"),
  "tennis-guess-winner": { paths: ["M8 3h16v9l-6 8h-4l-6-8Z", "M8 6H3v5l5 5M24 6h5v5l-5 5M16 20v8M10 29h11", "M13.55 8.8C13.55 5.3 18.45 5.3 18.45 8.1C18.45 10.2 16 10.2 16 12.3", "M22.5 26a3.5 3.5 0 1 0 7 0a3.5 3.5 0 1 0 -7 0Z", "M24.25 22.99Q28.98 26 24.25 29.01"], fills: ["M15.3 14.4L16.7 14.4L16.7 15.8L15.3 15.8Z"] },
  "grand-prix-dash": { paths: ["M14 3h4l2 7v5l3 5v5H9v-5l3-5v-5Z", "M8 7h16M7 28h18", "M7 13h5M20 13h5M7 23h3M22 23h3", "M11 30h3M18 30h3"], fills: ["M3 10h4v6H3ZM25 10h4v6h-4ZM3 20h4v7H3ZM25 20h4v7h-4Z", "M14 12l2-2 2 2v5h-4Z"] },
  "motorsport-quiz": quiz("M20 29v-4a5 5 0 0 1 5-5h1l3 3v3h-6v3Z", "M24 22h2l2 2h-4Z"),
  "guess-driver": { paths: ["M7 26l-3-8v-5C4 7 8 3 16 3s12 4 12 10v5l-3 8-5 3h-8Z", "M12 26h8"], fills: ["M7 11h18l1 3-2 10H8L6 14ZM11 15c0-2 2-3 5-3s5 1 5 3c0 2-4 2-4 4h-2c0-3 4-3 4-4 0-.7-1-1-3-1s-3 .3-3 1ZM15 20h2v2h-2Z"] },
} satisfies Record<StatozGameId, GameMarkGeometry>;

/** Decorative by default; pass a title when the mark is the only game label. */
export function GameMarkIcon({ game, ...props }: IconProps & { game: StatozGameId }) {
  const mark = gameMarks[game];
  return (
    <Icon viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="butt" strokeLinejoin="miter" strokeMiterlimit={2} {...props}>
      {mark.paths.map((path) => <path key={path} d={path} />)}
      {mark.fills.map((path) => <path key={path} d={path} fill="currentColor" fillRule="evenodd" stroke="none" />)}
    </Icon>
  );
}
