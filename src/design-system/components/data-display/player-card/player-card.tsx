import Image from "next/image";
import type { CSSProperties } from "react";

import { Glyph, type GlyphName } from "../../../icons";
import { cardIconFallback, rarityFoil } from "../../../tokens/gradients";
import { cardClipPath, cardCuts } from "../../../tokens/shape";

import styles from "./player-card.module.css";
import { RoleSignal, type RoleMarkings } from "./role-signal";
import { TierPips } from "./tier-pips";

/**
 * Rarity, restated here rather than imported: the design system carries no
 * dependencies of its own, so a card describes its own vocabulary and the
 * feature passes a domain card's fields straight through.
 */
export type PlayerCardTier = "bronze" | "silver" | "gold" | "platinum";

export type PlayerCardSize = "sm" | "md" | "lg";

const tierRanks: Record<PlayerCardTier, number> = {
  bronze: 0,
  silver: 1,
  gold: 2,
  platinum: 3,
};

/**
 * Card metrics per size. Flutter's 96px card forces 5-7px labels; these are the
 * same 2:3 silhouette scaled until every label lands on a real type step.
 */
const metrics: Record<
  PlayerCardSize,
  {
    width: number;
    chip: string;
    name: string;
    trait: string;
    rating: string;
    pip: number;
  }
> = {
  sm: {
    width: 128,
    chip: "var(--ds-text-2xs)",
    name: "var(--ds-text-xs)",
    trait: "var(--ds-text-2xs)",
    rating: "var(--ds-text-lg)",
    pip: 4,
  },
  md: {
    width: 176,
    chip: "var(--ds-text-2xs)",
    name: "var(--ds-text-sm)",
    trait: "var(--ds-text-xs)",
    rating: "var(--ds-text-xl)",
    pip: 5,
  },
  lg: {
    width: 224,
    chip: "var(--ds-text-xs)",
    name: "var(--ds-text-base)",
    trait: "var(--ds-text-sm)",
    rating: "var(--ds-text-3xl)",
    pip: 6,
  },
};

/** Rendered width of each card size, for anything that must line up with one. */
export const playerCardWidths: Record<PlayerCardSize, number> = {
  sm: metrics.sm.width,
  md: metrics.md.width,
  lg: metrics.lg.width,
};

/** A card is a 2:3 rectangle at every size. */
export const playerCardAspect = 1.5;

/** The nameplate's share of the card's height. */
const namePlateFraction = 0.24;

export type PlayerCardProps = {
  /** The name printed on the nameplate — short enough not to be clipped. */
  name: string;
  /** Short role code, e.g. ATK. */
  roleLabel: string;
  /** Positions covered, slash-separated; only the first is printed. */
  position: string;
  countryCode: string;
  rating: number;
  trait: string;
  tier: PlayerCardTier;
  icon: GlyphName;
  /** Optional portrait artwork. The glyph remains the automatic fallback. */
  portraitSrc?: string;
  /** CSS color for the role chip — the feature decides what a role means. */
  roleAccent: string;
  /** Which sport's markings sit behind the glyph. */
  markings?: RoleMarkings;
  size?: PlayerCardSize;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  /** Accessible name; defaults to the card's name. */
  label?: string;
  className?: string;
};

/**
 * A collectible player card: tier-graded foil, raking hairlines, the glyph
 * plate, an OVR compartment, and a nameplate carrying the rarity pips.
 *
 * Built the way `HudPanel` is — a gradient edge layer with the fill inset
 * inside it — because `clip-path` crops a border away, and the card's chamfer
 * is the HUD cut scaled to its own width through `--ds-card-cut-*`. Anything
 * laid over the card, the reveal's foil sweep included, inherits those two
 * properties and so clips to the identical silhouette.
 */
export function PlayerCard({
  name,
  roleLabel,
  position,
  countryCode,
  rating,
  trait,
  tier,
  icon,
  portraitSrc,
  roleAccent,
  markings = "none",
  size = "sm",
  selected = false,
  disabled = false,
  onClick,
  label,
  className,
}: PlayerCardProps) {
  const rank = tierRanks[tier];
  const step = metrics[size];
  const height = step.width * 1.5;
  const cuts = cardCuts(step.width);
  const tierColor = `var(--ds-color-rarity-${tier}-base)`;

  // The rarity edge thickens and brightens with tier, so bronze reads as bronze
  // before its colour is even registered.
  const edgeWidth = 1 + rank * 0.45;
  const edgeRest = 0.5 + rank * 0.12;
  const lighten = (0.15 + rank * 0.17) * 100;
  const edge =
    rank >= 3
      ? `linear-gradient(135deg, var(--ds-color-text-default), ${tierColor}, var(--ds-color-rarity-platinum-deep))`
      : `linear-gradient(135deg, color-mix(in srgb, var(--ds-color-text-default) ${lighten}%, ${tierColor}), ${tierColor})`;

  const plateHeight = `${namePlateFraction * 100}%`;
  const ovrWidth = step.width * 0.36;
  const ovrFace = [
    "linear-gradient(to bottom,",
    `color-mix(in srgb, var(--ds-color-text-default) ${rank >= 2 ? 60 : 30}%, ${tierColor}),`,
    `color-mix(in srgb, var(--ds-color-background-primary) ${rank >= 1 ? 18 : 45}%, ${tierColor}))`,
  ].join(" ");

  const style = {
    "--ds-card-cut-big": `${cuts.big}px`,
    "--ds-card-cut-small": `${cuts.small}px`,
    "--card-tier": tierColor,
    "--card-edge-rest": edgeRest,
    "--card-edge-lit": Math.min(edgeRest + 0.3, 1),
    width: step.width,
    height,
  } as CSSProperties;

  // Assigned directly rather than through --ds-clip-card, so the cuts declared
  // on this element are the ones that take effect. See cardClipPath.
  const clip: CSSProperties = { clipPath: cardClipPath };

  return (
    <div
      className={[
        styles.card,
        selected ? styles.selected : "",
        disabled ? styles.disabled : "",
        "relative shrink-0",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={style}
    >
      {/* Bloom sits behind everything: a box-shadow would be clipped with its caster. */}
      <div
        aria-hidden
        className={`${styles.glow} absolute -inset-1 blur-[7px]`}
        style={{
          ...clip,
          background: `color-mix(in srgb, ${selected ? roleAccent : tierColor} 40%, transparent)`,
        }}
      />

      {/* Rarity edge, with the face inset inside it. */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          ...clip,
          background: selected ? roleAccent : edge,
          opacity: "var(--card-edge-alpha)",
        }}
      />

      <div
        className="absolute overflow-hidden"
        style={{ ...clip, inset: edgeWidth }}
      >
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ background: rarityFoil[tier] }}
        />
        <div aria-hidden className={`${styles.stripes} absolute inset-0`} />

        {/* Glyph plate: everything above the nameplate. */}
        <div
          className="absolute overflow-hidden"
          style={{
            top: 4,
            left: 4,
            right: 4,
            bottom: plateHeight,
            background: cardIconFallback(tierColor),
          }}
        >
          {portraitSrc ? (
            <Image
              src={portraitSrc}
              alt=""
              fill
              sizes={`${step.width}px`}
              className="object-cover object-top"
            />
          ) : (
            <span
              aria-hidden
              className="absolute inset-0 grid place-items-center text-inverse"
            >
              <Glyph name={icon} size={Math.round(step.width * 0.34)} />
            </span>
          )}
          <RoleSignal markings={markings} accent={roleAccent} />
        </div>

        {/* Role and country, tucked inside the top-left cut rather than under
            it — the chamfer scales with the card, so the inset must too. */}
        <div
          className="absolute flex max-w-[56%] flex-col px-1.5 py-0.5"
          style={{
            top: cuts.big * 0.6,
            left: cuts.big * 0.45,
            background: "var(--ds-color-overlay-plate)",
          }}
        >
          {/* A position is two letters for a footballer but a team or an
              archetype for a driver or a tennis player, so it is clipped to
              the room left of the OVR plate rather than allowed to wrap. */}
          <span
            className="truncate font-display font-black leading-compact"
            style={{ color: roleAccent, fontSize: step.chip }}
          >
            {roleLabel} - {position.split("/")[0]}
          </span>
          <span
            className="truncate font-bold leading-compact"
            style={{
              fontSize: step.chip,
              color: "color-mix(in srgb, var(--ds-color-text-default) 70%, transparent)",
            }}
          >
            {countryCode}
          </span>
        </div>

        {/* OVR compartment, top-right — the card's own chamfer, at badge scale. */}
        <div
          className="absolute right-0 top-0 grid place-items-center"
          style={
            {
              "--ds-card-cut-big": `${step.width * 0.06}px`,
              "--ds-card-cut-small": `${step.width * 0.02}px`,
              clipPath: cardClipPath,
              width: ovrWidth,
              height: ovrWidth * 0.85,
              background: ovrFace,
            } as CSSProperties
          }
        >
          <span className="flex flex-col items-center text-inverse">
            <span
              className="ds-tabular font-display font-black leading-compact"
              style={{ fontSize: step.rating }}
            >
              {rating}
            </span>
            <span
              aria-hidden
              className="my-0.5 h-px"
              style={{
                width: ovrWidth * 0.4,
                background:
                  "color-mix(in srgb, var(--ds-color-text-inverse) 40%, transparent)",
              }}
            />
            <span
              className="font-display font-black leading-compact"
              style={{
                fontSize: "var(--ds-text-2xs)",
                letterSpacing: "var(--ds-tracking-label)",
              }}
            >
              OVR
            </span>
          </span>
        </div>

        {/* Trait, resting on the nameplate. */}
        <div
          className="absolute truncate px-1 py-[3px] text-center font-bold"
          style={{
            left: 4,
            right: 4,
            bottom: plateHeight,
            fontSize: step.trait,
            background: "var(--ds-color-overlay-plate)",
            color: "color-mix(in srgb, var(--ds-color-text-default) 90%, transparent)",
          }}
        >
          {trait}
        </div>

        {/* Nameplate. */}
        <div
          className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-center px-1.5"
          style={{
            height: plateHeight,
            background: "var(--ds-gradient-card-nameplate)",
            borderLeft: `2px solid color-mix(in srgb, ${tierColor} 90%, transparent)`,
          }}
        >
          <TierPips rank={rank} color={tierColor} size={step.pip} />
          <span
            className="mt-1 max-w-full truncate font-display font-black leading-compact"
            style={{ fontSize: step.name }}
          >
            {name}
          </span>
        </div>
      </div>

      {onClick ? (
        <button
          type="button"
          onClick={onClick}
          disabled={disabled}
          aria-pressed={selected}
          aria-label={label ?? name}
          className="absolute inset-0 z-10"
          style={clip}
        />
      ) : null}
    </div>
  );
}
