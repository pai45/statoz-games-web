"use client";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { publicAsset } from "@/shared/config";
import { accentVar } from "@/design-system";
import type { GameEntry } from "@/mocks/games";
import type { GameId } from "../types";
import { useCardTilt } from "./use-card-tilt";
import { useGameLaunch } from "./use-game-launch";
import styles from "./discovery-card.module.css";

export type DiscoveryGameTileProps = {
  game: GameId;
  entry: GameEntry;
  /** Position in the library, printed as a small serial in the card's corner. */
  index?: number;
  /** On touch screens, which cannot hover, play the hover treatment continuously. */
  live?: boolean;
};

/**
 * The library's holo cartridge: full-bleed cover art inside the arcade bevel,
 * the game's name and a play plate on the art. Pointer tilt, a foil wash and a
 * sheen answer hover; the name is the only text the card carries.
 */
export function DiscoveryGameTile({ game, entry, index, live = false }: DiscoveryGameTileProps) {
  const launch = useGameLaunch(entry), tilt = useCardTilt();
  const style = { "--card-accent": accentVar(entry.accent) } as CSSProperties;
  const label = `Play ${entry.title}`;
  const body: ReactNode = <>
    <span className={styles.edge} aria-hidden="true" />
    <span className={styles.fill}>
      <Image src={publicAsset(["retro-football-2","stick-cricket"].includes(game) ? `/games/${game}/cover.png` : `/assets/games/covers/${game}.webp`)} alt="" fill sizes="(min-width: 1024px) 50vw, (min-width: 640px) 50vw, 100vw" unoptimized className={styles.cover} />
      <span className={styles.tint} aria-hidden="true" />
      <span className={styles.vignette} aria-hidden="true" />
      <span className={styles.dots} aria-hidden="true" />
      <span className={styles.holo} aria-hidden="true" />
      <span className={styles.sheen} aria-hidden="true" />
      <span className={`${styles.bracket} ${styles.bracketStart}`} aria-hidden="true" />
      <span className={`${styles.bracket} ${styles.bracketEnd}`} aria-hidden="true" />
      {index === undefined ? null : <span className={styles.serial} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>}
      <span className={styles.foot}>
        <span className={styles.name}><i aria-hidden="true" />{entry.title}</span>
        <span className={styles.plate} aria-hidden="true">
          <span className={styles.plateFill}>
            <svg viewBox="0 0 14 14" width="14" height="14"><path d="M3 1.5v11l9-5.5z" fill="currentColor" /></svg>
          </span>
        </span>
      </span>
    </span>
  </>;
  return <div className={live ? `${styles.tile} ${styles.live}` : styles.tile} style={style}>
    {launch.href
      ? <Link href={launch.href} aria-label={label} className={styles.hit} {...tilt}>{body}</Link>
      : <button type="button" aria-label={label} className={styles.hit} onClick={launch.onClick} {...tilt}>{body}</button>}
  </div>;
}
