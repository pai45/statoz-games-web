"use client";

import type { CSSProperties } from "react";

import { PlayerCard, accentVar, glyphRegistry, type GlyphName } from "@/design-system";
import { playerRoleLabels, type PlayerCard as PlayerCardData } from "@/domain/cards";
import { portraitForCard } from "@/features/packs";

import { positionsOf, statLabels } from "../engine/stats";
import type { DerivedStats, StatKey } from "../engine/types";

import styles from "./pitch-duel.module.css";

export const roleAccent: Record<string, string> = {
  attacker: accentVar("cyan"),
  defender: accentVar("violet"),
  goalkeeper: accentVar("gold"),
};

export const sideAccent = { home: accentVar("lime"), away: accentVar("orange") } as const;

function glyph(name: string): GlyphName {
  return name in glyphRegistry ? (name as GlyphName) : "bolt";
}

/** The StatOz collectible card, fed from a domain card. */
export function DuelCard({
  card,
  size = "sm",
  selected,
  disabled,
  onClick,
  label,
}: {
  card: PlayerCardData;
  size?: "sm" | "md" | "lg";
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  label?: string;
}) {
  return (
    <PlayerCard
      name={card.shortName}
      roleLabel={playerRoleLabels[card.role]}
      position={card.position}
      countryCode={card.countryCode}
      rating={card.rating}
      trait={card.trait}
      tier={card.tier}
      icon={glyph(card.icon)}
      portraitSrc={portraitForCard(card)}
      roleAccent={roleAccent[card.role] ?? accentVar("cyan")}
      size={size}
      selected={selected}
      disabled={disabled}
      onClick={onClick}
      label={label}
    />
  );
}

const outfieldKeys: StatKey[] = ["pac", "sho", "pas", "dri", "def", "phy"];

/** Ballers-style six-stat block (or keeper block) for a card. */
export function StatBlock({ stats, keeper, highlight }: { stats: DerivedStats; keeper?: boolean; highlight?: StatKey[] }) {
  const rows: [string, number, boolean][] = keeper
    ? [
        ["DIV", stats.keeper.div, false],
        ["REF", stats.keeper.ref, false],
        ["HAN", stats.keeper.han, false],
        ["POS", stats.keeper.pos, false],
      ]
    : outfieldKeys.map((k) => [statLabels[k], stats[k], highlight?.includes(k) ?? false]);
  return (
    <dl className={styles.statBlock}>
      {rows.map(([label, value, hot]) => (
        <div key={label} className={hot ? styles.statHot : undefined} style={{ "--stat": `${value}%` } as CSSProperties}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function primaryPosition(card: PlayerCardData): string {
  return positionsOf(card)[0];
}
