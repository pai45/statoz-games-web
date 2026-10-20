import type { CSSProperties, ReactNode } from "react";

import { CheckIcon } from "../../../icons";
import { glow } from "../../../tokens/elevation";

export type SelectableTileProps = {
  children: ReactNode;
  /** Accessible name — the tile's content is usually artwork. */
  label: string;
  selected: boolean;
  onSelect: () => void;
  /**
   * `radio` for one-of-many (an avatar, a banner), `checkbox` for an
   * independent on/off, `button` when the tile only sets focus.
   */
  role?: "radio" | "checkbox" | "button";
  /** CSS color for the selected edge, glow, and seal. */
  accent?: string;
  /** Calms the fill for a tile that is selectable but not yet in play. */
  dimmed?: boolean;
  /** Edge of the seal square in px; drop it on tiles too small to carry one. */
  sealSize?: number | null;
  className?: string;
};

/**
 * A picture-first choice: a panel plate that takes an accent edge, a soft glow,
 * and a corner seal once chosen. Avatars, banners, and club crests all read as
 * the same control because they share it.
 */
export function SelectableTile({
  children,
  label,
  selected,
  onSelect,
  role = "radio",
  accent = "var(--ds-color-accent-lime)",
  dimmed = false,
  sealSize = 30,
  className,
}: SelectableTileProps) {
  // The resting edge is a class so `:hover` can lift it; a selected edge is
  // the caller's accent, which only an inline value can carry.
  const style: CSSProperties = {
    background: dimmed
      ? "color-mix(in srgb, var(--ds-color-background-secondary) 58%, transparent)"
      : "var(--ds-color-background-secondary)",
    borderWidth: selected ? 2 : 1,
    ...(selected
      ? { borderColor: accent, boxShadow: glow(accent, { alpha: 0.18, blur: 14 }) }
      : {}),
  };

  return (
    <button
      type="button"
      role={role}
      aria-checked={role === "button" ? undefined : selected}
      aria-label={label}
      onClick={onSelect}
      style={style}
      className={[
        "relative block overflow-hidden border text-left transition-[border-color,box-shadow,background,transform] duration-150",
        "hover:-translate-y-px active:translate-y-0",
        selected ? "" : "border-line-subtle hover:border-line-strong",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}

      {selected && sealSize ? (
        <span
          aria-hidden
          className="absolute left-0 top-0 grid place-items-center"
          style={{
            width: sealSize,
            height: sealSize,
            background: accent,
            color: "var(--ds-color-background-primary)",
          }}
        >
          <CheckIcon size={Math.round(sealSize * 0.67)} />
        </span>
      ) : null}
    </button>
  );
}
