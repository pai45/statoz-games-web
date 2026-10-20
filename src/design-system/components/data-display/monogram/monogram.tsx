import type { CSSProperties } from "react";

export type MonogramProps = {
  /** Full name; the initials are derived from it. */
  name: string;
  /** Pre-computed initials, when the derived ones read badly. */
  initials?: string;
  /** CSS color for the badge fill and edge. */
  accent: string;
  size?: number;
  className?: string;
};

function initialsFrom(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

/**
 * Octagonal identity badge used for teams, clubs, and players. Cut corners
 * instead of a circle so it matches the rest of the system's silhouette.
 */
export function Monogram({
  name,
  initials,
  accent,
  size = 34,
  className,
}: MonogramProps) {
  const label = initials ?? initialsFrom(name);
  const style = {
    width: size,
    height: size,
    clipPath: "var(--ds-clip-octagon)",
    background: `color-mix(in srgb, ${accent} 22%, var(--ds-color-background-primary))`,
    color: accent,
    // Two initials get the full step; a longer label — a club code such as FCB
    // or S04 — is set smaller so it still clears the octagon's cut corners.
    fontSize: Math.round(size * (label.length > 2 ? 0.26 : 0.36)),
  } satisfies CSSProperties;

  return (
    <span
      className={[
        "inline-grid shrink-0 place-items-center font-display font-black tracking-tight",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={style}
      role="img"
      aria-label={name}
    >
      {label}
    </span>
  );
}
