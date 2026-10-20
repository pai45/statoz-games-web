import type { CSSProperties, ReactNode } from "react";

import { accentVar } from "../../../tokens/colors";
import { withAlpha } from "../../../tokens/elevation";
import { bottomCutPath, shape } from "../../../tokens/shape";

/**
 * A flat dark plate, square across the top with both bottom corners cut, inside
 * a one-pixel accent edge.
 *
 * The app draws it as a clipped fill with a stroke painted over the top. A clip
 * path crops a border away on the web, so the edge is a clipped plate with the
 * fill inset a pixel inside it — the construction every chamfered surface in
 * this codebase uses.
 *
 * `glow` is for the one panel a screen wants looked at first, and nothing else.
 */

export type AccentPanelProps = {
  children: ReactNode;
  /** CSS color driving the edge and the optional bloom. */
  accent?: string;
  /** Blooms the accent behind the plate. One per screen, at most. */
  glow?: boolean;
  className?: string;
  style?: CSSProperties;
};

export function AccentPanel({
  children,
  accent = accentVar("cyan"),
  glow = false,
  className,
  style,
}: AccentPanelProps) {
  const clip: CSSProperties = { clipPath: bottomCutPath(shape.panelCut) };

  return (
    <div className={["relative", className ?? ""].filter(Boolean).join(" ")} style={style}>
      {/* The bloom sits behind everything, unclipped: a box-shadow would be
          cropped along with the element casting it. */}
      {glow ? (
        <div
          aria-hidden
          className="absolute -inset-0.5 blur-[6px]"
          style={{ ...clip, background: withAlpha(accent, 0.22) }}
        />
      ) : null}

      <div
        aria-hidden
        className="absolute inset-0"
        style={{ ...clip, background: withAlpha(accent, 0.5) }}
      />
      <div
        aria-hidden
        className="absolute inset-px"
        style={{ ...clip, background: "var(--ds-color-background-elevated)" }}
      />

      <div className="relative" style={clip}>
        {children}
      </div>
    </div>
  );
}
