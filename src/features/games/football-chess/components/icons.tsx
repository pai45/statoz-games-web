import type { ReactNode } from "react";

import type { PieceClass } from "../engine/state";

/**
 * Football Chess's own glyphs, drawn for the game on a 24-unit grid in
 * `currentColor`. Each piece class gets a silhouette that reads at token
 * size: a spearhead, a double chevron, an arcing pass, a shield and a glove.
 */

type IconProps = { size?: number; className?: string; title?: string };

function Svg({ size = 20, className, title, children }: IconProps & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      aria-hidden={title === undefined}
      role={title === undefined ? undefined : "img"}
      focusable="false"
    >
      {title === undefined ? null : <title>{title}</title>}
      {children}
    </svg>
  );
}

export function ClassGlyph({ cls, ...props }: IconProps & { cls: PieceClass }) {
  switch (cls) {
    case "striker":
      return (
        <Svg {...props}>
          <path d="M21 12 4 4.5 8.6 12 4 19.5Z" fill="currentColor" />
        </Svg>
      );
    case "runner":
      return (
        <Svg {...props}>
          <path
            d="M4 5l6.5 7L4 19M12 5l6.5 7L12 19"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );
    case "playmaker":
      return (
        <Svg {...props}>
          <path d="M5 18.5C6.5 8 15 5 19.5 13.5" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
          <path d="M21.5 10.2 20.2 17l-6-3.3Z" fill="currentColor" />
          <circle cx="5" cy="19" r="2.4" fill="currentColor" />
        </Svg>
      );
    case "defender":
      return (
        <Svg {...props}>
          <path d="M12 2.5 20 5.6v6.2c0 4.9-3.4 8.3-8 9.7-4.6-1.4-8-4.8-8-9.7V5.6Z" fill="currentColor" />
        </Svg>
      );
    case "keeper":
      return (
        <Svg {...props}>
          <path
            d="M7.5 21v-9.5a1.6 1.6 0 0 1 3.2 0V9a1.6 1.6 0 0 1 3.2 0v.5a1.6 1.6 0 0 1 3.2 0V12a1.5 1.5 0 0 1 3 0v4.2c0 2.8-2.2 4.8-5 4.8Z"
            fill="currentColor"
          />
          <path d="M7.5 15.5 4.6 12.8a1.5 1.5 0 0 0-2.1 2.1l4 4.5" fill="currentColor" />
        </Svg>
      );
  }
}

export function BallIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="10" fill="#fbf8ee" stroke="#1d1a16" strokeWidth="1.4" />
      <path d="M12 7.6 15.6 10.2 14.2 14.4H9.8L8.4 10.2Z" fill="#1d1a16" />
      <path
        d="M12 7.6V2.2M15.6 10.2 21 8.6M14.2 14.4 17.4 19.2M9.8 14.4 6.6 19.2M8.4 10.2 3 8.6"
        stroke="#1d1a16"
        strokeWidth="1.2"
      />
    </Svg>
  );
}

/** Glyphs that are a single stroked path. */
const paths = {
  menu: "M4 6.5h16M4 12h16M4 17.5h16",
  close: "M6 6l12 12M18 6 6 18",
  back: "M15 5l-7 7 7 7",
  next: "M9 5l7 7-7 7",
} as const;

export type IconName = keyof typeof paths | "whistle" | "book" | "record" | "sound" | "mute" | "play";

export function Icon({ name, ...props }: IconProps & { name: IconName }) {
  const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 2.2, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  switch (name) {
    case "whistle":
      return (
        <Svg {...props}>
          <path d="M3 9.5h10.5a5.5 5.5 0 1 1-5.4 6.6L3 14.5Z" {...stroke} />
          <path d="M8.5 5.5 10 7.5M13 4v2.5M17.5 5.5 16 7.5" {...stroke} />
        </Svg>
      );
    case "book":
      return (
        <Svg {...props}>
          <path d="M4 5.5C7 4 9.5 4.3 12 6c2.5-1.7 5-2 8-.5V19c-3-1.5-5.5-1.2-8 .5-2.5-1.7-5-2-8-.5Z" {...stroke} />
          <path d="M12 6v13.5" {...stroke} />
        </Svg>
      );
    case "record":
      return (
        <Svg {...props}>
          <path d="M7 4h10v4.5a5 5 0 0 1-10 0Z" {...stroke} />
          <path d="M7 6H4.5a3 3 0 0 0 3 4M17 6h2.5a3 3 0 0 1-3 4M12 13.5V17M8.5 20h7" {...stroke} />
        </Svg>
      );
    case "sound":
      return (
        <Svg {...props}>
          <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4Z" {...stroke} />
          <path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" {...stroke} />
        </Svg>
      );
    case "mute":
      return (
        <Svg {...props}>
          <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4Z" {...stroke} />
          <path d="M16 9.5l5 5M21 9.5l-5 5" {...stroke} />
        </Svg>
      );
    case "play":
      return (
        <Svg {...props}>
          <path d="M8 5.5v13l10.5-6.5Z" fill="currentColor" />
        </Svg>
      );
    default:
      return (
        <Svg {...props}>
          <path d={paths[name]} {...stroke} />
        </Svg>
      );
  }
}

/** A referee's card, yellow or red. */
export function CardGlyph({ colour, size = 12 }: { colour: "yellow" | "red"; size?: number }) {
  return (
    <svg width={size * 0.72} height={size} viewBox="0 0 9 12.5" aria-hidden="true" focusable="false">
      <rect x="0.5" y="0.5" width="8" height="11.5" rx="1.2" fill={colour === "yellow" ? "#f2c84b" : "#c8372e"} stroke="#1d1a16" strokeWidth="0.8" />
    </svg>
  );
}
