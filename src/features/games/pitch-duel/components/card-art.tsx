"use client";

import Image from "next/image";
import type { CSSProperties } from "react";

import type { PlayerCard as PlayerCardData } from "@/domain/cards";
import { portraitForCard } from "@/features/packs";

import { deriveStats, positionsOf } from "../engine/stats";
import type { DerivedStats } from "../engine/types";

import styles from "./card.module.css";

/** Possession and score colours: you are blue, they are red. */
export const sideAccent = { home: "#60a5fa", away: "#f87171" } as const;

/** Card tiers as the shield shows them; platinum reads as the lilac "legend" frame. */
const tierName: Record<PlayerCardData["tier"], string> = { bronze: "bronze", silver: "silver", gold: "gold", platinum: "legend" };

export function primaryPosition(card: PlayerCardData): string {
  return positionsOf(card)[0];
}

/** Ballers-style card numbers: six outfield stats, or four for a keeper. */
export function statPairs(stats: DerivedStats, keeper: boolean): [string, number][] {
  return keeper
    ? [
        ["DIV", stats.keeper.div],
        ["REF", stats.keeper.ref],
        ["HAN", stats.keeper.han],
        ["POS", stats.keeper.pos],
        ["KEP", stats.keep],
        ["NRV", stats.composure],
      ]
    : [
        ["PAC", stats.pac],
        ["DRI", stats.dri],
        ["SHO", stats.sho],
        ["DEF", stats.def],
        ["PAS", stats.pas],
        ["PHY", stats.phy],
      ];
}

/** A drawn head-and-shoulders for cards without portrait art. */
function Silhouette() {
  return (
    <svg className={styles.silhouette} viewBox="0 0 60 60" aria-hidden>
      <circle cx="30" cy="22" r="11" />
      <path d="M8 60c1-14 10-21 22-21s21 7 22 21z" />
    </svg>
  );
}

export type ShieldSize = "lg" | "md" | "sm" | "mini";

/**
 * The shield card: rating, position and nation at the top left, the portrait,
 * a name bar and a 2×3 stat grid. `mini` is the lineup token (rating, nation
 * and position on one band under the portrait).
 */
export function ShieldCard({
  card,
  size = "md",
  stats,
  onClick,
  label,
  selected,
  muted,
  style,
}: {
  card: PlayerCardData;
  size?: ShieldSize;
  /** Defaults to the card's derived stats; pass null to hide the grid. */
  stats?: DerivedStats | null;
  onClick?: () => void;
  label?: string;
  selected?: boolean;
  muted?: boolean;
  style?: CSSProperties;
}) {
  const portrait = portraitForCard(card);
  const keeper = card.role === "goalkeeper";
  const shown = size === "mini" || stats === null ? null : (stats ?? deriveStats(card));
  const body = (
    <span className={styles.face}>
      <span className={styles.shine} aria-hidden />
      {size === "mini" ? null : (
        <span className={styles.corner}>
          <b className={styles.ovr}>{card.rating}</b>
          <small className={styles.pos}>{primaryPosition(card)}</small>
          <span className={styles.nation}>{card.countryCode}</span>
        </span>
      )}
      <span className={styles.portrait}>
        {portrait ? <Image src={portrait} alt="" fill sizes={size === "lg" ? "160px" : "96px"} className={styles.portraitImg} /> : <Silhouette />}
      </span>
      {size === "mini" ? (
        <span className={styles.band}>
          <b>{card.rating}</b>
          <span className={styles.bandNation}>{card.countryCode}</span>
          <small>{primaryPosition(card)}</small>
        </span>
      ) : (
        <span className={styles.name}>{card.shortName}</span>
      )}
      {shown ? (
        <span className={styles.stats}>
          {statPairs(shown, keeper).map(([k, v]) => (
            <span key={k}>
              <b>{v}</b>
              <small>{k}</small>
            </span>
          ))}
        </span>
      ) : null}
    </span>
  );

  const common = {
    className: styles.card,
    "data-tier": tierName[card.tier],
    "data-size": size,
    "data-selected": selected || undefined,
    "data-muted": muted || undefined,
    style,
  };

  return onClick ? (
    <button type="button" {...common} onClick={onClick} aria-label={label ?? `${card.name}, ${primaryPosition(card)}, rated ${card.rating}`}>
      {body}
    </button>
  ) : (
    <span {...common} role="img" aria-label={label ?? `${card.name}, ${primaryPosition(card)}, rated ${card.rating}`}>
      {body}
    </span>
  );
}

/** The six stats as a sheet list (player details, lineup preview). */
export function StatBlock({ stats, keeper }: { stats: DerivedStats; keeper?: boolean }) {
  return (
    <dl className={styles.statBlock}>
      {statPairs(stats, Boolean(keeper)).map(([label, value]) => (
        <div key={label} style={{ "--stat": `${value}%` } as CSSProperties}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}
