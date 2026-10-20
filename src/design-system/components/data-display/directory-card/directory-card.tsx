import Link from "next/link";
import type { CSSProperties } from "react";

import { ChevronRightIcon, Glyph, type GlyphName } from "../../../icons";
import { withAlpha } from "../../../tokens/elevation";
import { AccentPanel } from "../accent-panel";

/**
 * A row of a directory: a glyph on its tinted plate, a name, a line about it, a
 * small tag, and the chevron that says it goes somewhere.
 *
 * One item in a list where every item is equally a starting point — the How To
 * Play hub, the support channels — so the card never glows and never competes;
 * its accent is all that separates it from its neighbours.
 */

export type DirectoryCardProps = {
  href: string;
  /** CSS color driving the panel edge, the glyph plate, and the tag. */
  accent: string;
  icon: GlyphName;
  title: string;
  tagline: string;
  /** The small plate under the tagline: a count, an index, a status. */
  meta?: string;
  /** Accessible name, when the title alone does not read as one. */
  label?: string;
  className?: string;
};

export function DirectoryCard({
  href,
  accent,
  icon,
  title,
  tagline,
  meta,
  label,
  className,
}: DirectoryCardProps) {
  return (
    <Link
      href={href}
      aria-label={label}
      className={[
        "block transition-[transform,filter] duration-150 hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-3 motion-reduce:transition-none motion-reduce:hover:translate-y-0",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ outlineColor: accent }}
    >
      <AccentPanel accent={accent}>
        <div className="flex items-center gap-3.5 p-3.5">
          <GlyphTile icon={icon} accent={accent} size={52} />

          <div className="min-w-0 flex-1">
            <h2
              className="font-display font-black"
              style={{
                fontSize: "var(--ds-text-base)",
                letterSpacing: "var(--ds-tracking-tight)",
              }}
            >
              {title}
            </h2>
            <p
              className="mt-1.25 text-subtle"
              style={{
                fontSize: "var(--ds-text-compact)",
                lineHeight: "var(--ds-leading-tight)",
              }}
            >
              {tagline}
            </p>
            {meta ? (
              <p
                className="ds-tabular mt-2 inline-block px-1.75 py-0.5 font-display font-black"
                style={{
                  fontSize: "var(--ds-text-nano)",
                  letterSpacing: "var(--ds-tracking-ultra)",
                  color: accent,
                  background: withAlpha(accent, 0.12),
                  border: `1px solid ${withAlpha(accent, 0.4)}`,
                }}
              >
                {meta}
              </p>
            ) : null}
          </div>

          <ChevronRightIcon
            size={22}
            aria-hidden
            style={{ color: withAlpha(accent, 0.8) }}
          />
        </div>
      </AccentPanel>
    </Link>
  );
}

export type GlyphTileProps = {
  icon: GlyphName;
  /** CSS color driving the plate's edge, wash, and glyph. */
  accent: string;
  /** Side of the square. The glyph is always half of it. */
  size: number;
  className?: string;
  style?: CSSProperties;
};

/** A glyph on its tinted plate — the mark a directory entry is known by. */
export function GlyphTile({ icon, accent, size, className, style }: GlyphTileProps) {
  return (
    <span
      className={["grid flex-none place-items-center", className ?? ""]
        .filter(Boolean)
        .join(" ")}
      style={{
        width: size,
        height: size,
        color: accent,
        background: withAlpha(accent, 0.12),
        border: `1px solid ${withAlpha(accent, 0.45)}`,
        ...style,
      }}
    >
      <Glyph name={icon} size={Math.round(size * 0.5)} />
    </span>
  );
}
