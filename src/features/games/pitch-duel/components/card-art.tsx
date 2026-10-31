"use client";

import Image from "next/image";
import type { CSSProperties } from "react";

import type { PlayerCard as PlayerCardData } from "@/domain/cards";
import { portraitForCard } from "@/features/packs";

import { attacks } from "../engine/actions";
import { positionGroup } from "../engine/lineup";
import { deriveStats, positionsOf } from "../engine/stats";
import type { DerivedStats, StatKey } from "../engine/types";

import styles from "./card.module.css";

/** Possession and score colours: you are blue, they are red. */
export const sideAccent = { home: "#60a5fa", away: "#f87171" } as const;

/** Rarity rank: drives the edge weight, the OVR face and the filled pips. */
const tierRank: Record<PlayerCardData["tier"], number> = { bronze: 0, silver: 1, gold: 2, platinum: 3 };

export function primaryPosition(card: PlayerCardData): string {
  return positionsOf(card)[0];
}

export type CardStat = { key: string; label: string; value: number };

/** The six numbers a card prints: outfield attributes, or the keeper's set. */
export function statPairs(stats: DerivedStats, keeper: boolean): CardStat[] {
  return keeper
    ? [
        { key: "div", label: "DIV", value: stats.keeper.div },
        { key: "ref", label: "REF", value: stats.keeper.ref },
        { key: "han", label: "HAN", value: stats.keeper.han },
        { key: "pos", label: "POS", value: stats.keeper.pos },
        { key: "keep", label: "KEP", value: stats.keep },
        { key: "composure", label: "NRV", value: stats.composure },
      ]
    : [
        { key: "pac", label: "PAC", value: stats.pac },
        { key: "sho", label: "SHO", value: stats.sho },
        { key: "pas", label: "PAS", value: stats.pas },
        { key: "dri", label: "DRI", value: stats.dri },
        { key: "def", label: "DEF", value: stats.def },
        { key: "phy", label: "PHY", value: stats.phy },
      ];
}

/** Value bands for the stat numbers: 85+ elite, 75+ strong, 65+ fair, below that weak. */
export function statGrade(value: number): "elite" | "strong" | "fair" | "weak" {
  return value >= 85 ? "elite" : value >= 75 ? "strong" : value >= 65 ? "fair" : "weak";
}

/**
 * The stats an open-play move leans on, looked up from the label the duel
 * result carries: the attacker's weights and the defender's weights.
 */
export function duelStatKeys(attackLabel: string): { attacker: StatKey[]; defender: StatKey[] } | null {
  const move = Object.values(attacks).find((a) => a.label === attackLabel);
  if (!move) return null;
  return { attacker: Object.keys(move.off) as StatKey[], defender: Object.keys(move.def) as StatKey[] };
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

export type CardSize = "lg" | "md" | "sm" | "mini";

/**
 * The player card, built on the StatOz collectible layout: a chamfered 2:3
 * frame with a rarity edge, the portrait plate, the role and nation plate at
 * the top left, the OVR compartment at the top right, the trait strip and a
 * nameplate with rarity pips. Below the nameplate sits the stat panel, three
 * by two, each number graded by colour with a bar under it.
 *
 * `mini` is the lineup token: portrait, OVR and a position plate, no stats.
 * `highlight` lights the stats a duel was decided on and dims the rest.
 */
export function DuelCard({
  card,
  size = "md",
  stats,
  highlight,
  onClick,
  label,
  selected,
  muted,
  style,
}: {
  card: PlayerCardData;
  size?: CardSize;
  /** Defaults to the card's derived stats; pass null for the plain collectible face. */
  stats?: DerivedStats | null;
  highlight?: readonly string[];
  onClick?: () => void;
  label?: string;
  selected?: boolean;
  muted?: boolean;
  style?: CSSProperties;
}) {
  const portrait = portraitForCard(card);
  const keeper = card.role === "goalkeeper";
  const mini = size === "mini";
  const shown = mini || stats === null ? null : (stats ?? deriveStats(card));
  const position = primaryPosition(card);
  const group = positionGroup(position);
  const rank = tierRank[card.tier];
  const hot = shown && highlight?.length ? new Set(highlight) : null;

  const body = (
    <>
      <span className={styles.edge} aria-hidden />
      <span className={styles.face}>
        <span className={styles.stripes} aria-hidden />

        <span className={styles.plate}>
          {portrait ? (
            <Image src={portrait} alt="" fill sizes={size === "lg" ? "160px" : mini ? "64px" : "120px"} className={styles.portraitImg} draggable={false} />
          ) : (
            <Silhouette />
          )}
          {!mini && card.trait ? <span className={styles.trait}>{card.trait}</span> : null}
        </span>

        {mini ? null : (
          <span className={styles.tag}>
            <b>
              {group} · {position}
            </b>
            <small>{card.countryCode}</small>
          </span>
        )}

        <span className={styles.ovr}>
          <b>{card.rating}</b>
          {mini ? null : (
            <>
              <i aria-hidden />
              <small>OVR</small>
            </>
          )}
        </span>

        <span className={styles.nameplate}>
          {mini ? (
            <>
              <b className={styles.miniPos}>{position}</b>
              <small className={styles.miniNation}>{card.countryCode}</small>
            </>
          ) : (
            <>
              <span className={styles.pips} aria-hidden>
                {[0, 1, 2, 3].map((i) => (
                  <i key={i} data-on={i <= rank || undefined} />
                ))}
              </span>
              <span className={styles.name}>{card.shortName}</span>
            </>
          )}
        </span>

        {shown ? (
          <span className={styles.stats} data-focus={hot ? true : undefined}>
            {statPairs(shown, keeper).map((s) => (
              <span key={s.key} className={styles.stat} data-grade={statGrade(s.value)} data-hot={hot?.has(s.key) || undefined}>
                <b>{s.value}</b>
                <small>{s.label}</small>
                <i style={{ "--v": `${s.value}%` } as CSSProperties} aria-hidden />
              </span>
            ))}
          </span>
        ) : null}

        <span className={styles.shine} aria-hidden />
      </span>
    </>
  );

  const name = label ?? `${card.name}, ${position}, rated ${card.rating}`;
  const common = {
    className: styles.card,
    "data-tier": card.tier,
    "data-group": group,
    "data-size": size,
    "data-stats": shown ? true : undefined,
    "data-selected": selected || undefined,
    "data-muted": muted || undefined,
    style,
  };

  return onClick ? (
    <button type="button" {...common} onClick={onClick} aria-label={name} aria-pressed={selected}>
      {body}
    </button>
  ) : (
    <span {...common} role="img" aria-label={name}>
      {body}
    </span>
  );
}

/** The six stats as a sheet list with bars (player details). */
export function StatBlock({ stats, keeper, highlight }: { stats: DerivedStats; keeper?: boolean; highlight?: readonly string[] }) {
  const hot = highlight?.length ? new Set(highlight) : null;
  return (
    <dl className={styles.statBlock}>
      {statPairs(stats, Boolean(keeper)).map((s) => (
        <div key={s.key} data-grade={statGrade(s.value)} data-hot={hot?.has(s.key) || undefined} style={{ "--v": `${s.value}%` } as CSSProperties}>
          <dt>{s.label}</dt>
          <dd>{s.value}</dd>
        </div>
      ))}
    </dl>
  );
}
