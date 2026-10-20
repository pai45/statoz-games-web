import type { CSSProperties } from "react";

import { DangerousIcon, Glyph, type GlyphName } from "../../../icons";
import { actionCategoryFill } from "../../../tokens/gradients";

import styles from "./action-card.module.css";

export type ActionCardTier = "bronze" | "silver" | "gold" | "platinum";
export type ActionCardCategory = "attack" | "defense" | "special";
export type ActionCardSize = "sm" | "md" | "lg";

/** The edge and chip colour that says what lane an action plays in. */
const categoryAccents: Record<ActionCardCategory, string> = {
  attack: "var(--ds-color-danger)",
  defense: "var(--ds-color-accent-violet)",
  special: "var(--ds-color-accent-gold)",
};

/** The colour the glyph and effect line are set in. */
const categoryInk: Record<ActionCardCategory, string> = {
  attack: "var(--ds-color-accent-lime)",
  defense: "var(--ds-color-accent-violet)",
  special: "var(--ds-color-accent-violet)",
};

const categoryCodes: Record<ActionCardCategory, string> = {
  attack: "ATK",
  defense: "DEF",
  special: "SPC",
};

const metrics: Record<
  ActionCardSize,
  { width: number; title: string; effect: string; power: number; glyph: number }
> = {
  sm: {
    width: 128,
    title: "var(--ds-text-xs)",
    effect: "var(--ds-text-2xs)",
    power: 17,
    glyph: 30,
  },
  md: {
    width: 176,
    title: "var(--ds-text-sm)",
    effect: "var(--ds-text-xs)",
    power: 22,
    glyph: 40,
  },
  lg: {
    width: 224,
    title: "var(--ds-text-lg)",
    effect: "var(--ds-text-sm)",
    power: 32,
    glyph: 52,
  },
};

export type ActionCardProps = {
  title: string;
  category: ActionCardCategory;
  tier: ActionCardTier;
  /** Human-readable effect, with the tier's power already resolved. */
  effect: string;
  power: number;
  /** Whether the effect can backfire. */
  risky?: boolean;
  icon: GlyphName;
  size?: ActionCardSize;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  label?: string;
  className?: string;
};

/**
 * A one-shot action card — the square-cornered sibling of `PlayerCard`. It
 * keeps square corners deliberately: the chamfer marks a player, so an action
 * reads as a different kind of object at a glance.
 *
 * Rarity shows as the strip along the bottom edge rather than the edge itself,
 * because every action exists in all four tiers and the strip is what separates
 * them in a hand.
 */
export function ActionCard({
  title,
  category,
  tier,
  effect,
  power,
  risky = false,
  icon,
  size = "sm",
  selected = false,
  disabled = false,
  onClick,
  label,
  className,
}: ActionCardProps) {
  const step = metrics[size];
  const accent = risky
    ? "var(--ds-color-accent-violet)"
    : categoryAccents[category];
  const ink = categoryInk[category];

  // Bronze reads too close to gold on a strip this thin, so it is deepened
  // towards copper rather than given a colour of its own.
  const strip =
    tier === "bronze"
      ? "color-mix(in srgb, var(--ds-color-rarity-bronze-base) 70%, var(--ds-color-rarity-bronze-deep))"
      : `var(--ds-color-rarity-${tier}-base)`;

  const style = {
    "--action-accent": accent,
    width: step.width,
    height: step.width * 1.375,
  } as CSSProperties;

  return (
    <div
      className={[
        styles.card,
        selected ? styles.selected : "",
        disabled ? styles.disabled : "",
        "relative shrink-0 overflow-hidden",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={style}
    >
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: actionCategoryFill[category],
          border: `1px solid color-mix(in srgb, ${accent} ${risky ? 100 : 55}%, transparent)`,
        }}
      />

      {/* Category rail along the top edge. */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-0.5"
        style={{ background: accent }}
      />

      {/* Category code, top-left. */}
      <span
        className="absolute left-0 top-0.5 px-[7px] py-0.5 font-bold leading-compact text-inverse"
        style={{ background: accent, fontSize: "var(--ds-text-2xs)" }}
      >
        {categoryCodes[category]}
      </span>

      {/* Power — the headline stat, so it never dims. */}
      <span
        className="absolute right-0 top-0.5 flex items-center gap-[3px] px-1.5 pb-[3px] pt-0.5"
        style={{
          background:
            "color-mix(in srgb, var(--ds-color-background-primary) 85%, transparent)",
          borderLeft: "3px solid var(--ds-color-accent-gold)",
          borderBottom:
            "1px solid color-mix(in srgb, var(--ds-color-rarity-gold-light) 45%, transparent)",
        }}
      >
        <span
          className="font-display font-black leading-compact"
          style={{
            color:
              "color-mix(in srgb, var(--ds-color-accent-gold) 72%, transparent)",
            fontSize: "var(--ds-text-2xs)",
            letterSpacing: "var(--ds-tracking-label)",
          }}
        >
          PWR
        </span>
        <span
          className="ds-tabular font-display font-black leading-compact text-gold"
          style={{ fontSize: step.power }}
        >
          +{power}
        </span>
      </span>

      <div className="relative flex h-full flex-col items-center justify-between gap-2 px-2 pb-4 pt-9">
        <span aria-hidden style={{ color: ink }}>
          <Glyph name={icon} size={step.glyph} />
        </span>
        <span
          className="line-clamp-2 text-center font-display font-black leading-tight"
          style={{ fontSize: step.title }}
        >
          {title.toUpperCase()}
        </span>
        <span
          className="truncate text-center font-bold leading-compact"
          style={{
            color: `color-mix(in srgb, ${ink} 76%, transparent)`,
            fontSize: step.effect,
          }}
        >
          {effect}
        </span>
      </div>

      {risky ? (
        <span
          className="absolute bottom-2 left-1 text-danger"
          title="This action can backfire"
        >
          <DangerousIcon size={14} title="Risky" />
        </span>
      ) : null}

      {/* Rarity strip — every action exists in all four tiers. */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-1.5"
        style={{ background: strip }}
      />

      {onClick ? (
        <button
          type="button"
          onClick={onClick}
          disabled={disabled}
          aria-pressed={selected}
          aria-label={label ?? title}
          className="absolute inset-0 z-10"
        />
      ) : null}
    </div>
  );
}
