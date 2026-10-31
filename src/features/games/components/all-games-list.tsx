"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { accentVar, FilterChips } from "@/design-system";
import { gameSportModuleFor, gameSportOrder, type GameSport } from "@/domain/game-sports";
import { gameRegistry, gameSportFor } from "@/mocks/games";
import { publicAsset } from "@/shared/config";
import { allGamesInFeedOrder, gameCoverPath, sportGamesInDeckOrder } from "../home-catalog";
import type { GameId } from "../types";
import { useGameLaunch } from "./use-game-launch";
import styles from "./all-games-list.module.css";

const ALL = "ALL";
const sportLabel = (sport: GameSport) => gameSportModuleFor(sport).label.toUpperCase();
const sportsWithGames = gameSportOrder.filter((sport) => sportGamesInDeckOrder(sport).length > 0);

/**
 * Every game as a plain list, over the home tab. A native modal dialog, so
 * focus stays inside it and Escape closes it. Sport chips narrow the list.
 * Mount it to open it; unmount it to close it.
 */
export function AllGamesList({ initialSport, onClose }: { initialSport: GameSport | null; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [filter, setFilter] = useState<string>(initialSport ? sportLabel(initialSport) : ALL);

  useEffect(() => {
    const element = dialog.current;
    if (!element || element.open) return;
    element.showModal();
    return () => element.close();
  }, []);

  const sport = sportsWithGames.find((entry) => sportLabel(entry) === filter) ?? null;
  const games = sport ? sportGamesInDeckOrder(sport) : allGamesInFeedOrder();

  return <dialog ref={dialog} className={styles.dialog} aria-labelledby="all-games-title"
    onCancel={(event) => { event.preventDefault(); onClose(); }}>
    <div className={styles.panel}>
      <header className={styles.head}>
        <div>
          <p className={styles.kicker}>{`// GAME LIBRARY · ${games.length} ${games.length === 1 ? "GAME" : "GAMES"}`}</p>
          <h2 id="all-games-title" className={styles.title}>ALL GAMES</h2>
        </div>
        <button type="button" className={styles.close} aria-label="Close all games" onClick={onClose}>
          <svg viewBox="0 0 16 16" width="18" height="18" aria-hidden="true"><path d="M3 3l10 10M13 3L3 13" fill="none" stroke="currentColor" strokeWidth="2" /></svg>
        </button>
      </header>
      <FilterChips options={[ALL, ...sportsWithGames.map(sportLabel)]} selected={filter} onSelect={setFilter}
        accent={accentVar(sport ? gameSportModuleFor(sport).accent : "cyan")} label="Filter games by sport" className={styles.chips} />
      <ul className={styles.list}>
        {games.map((game, index) => <li key={game}><GameRow game={game} index={index} /></li>)}
      </ul>
    </div>
  </dialog>;
}

function GameRow({ game, index }: { game: GameId; index: number }) {
  const entry = gameRegistry[game];
  const launch = useGameLaunch(entry);
  const sport = gameSportFor(game);
  const style = { "--row-accent": accentVar(entry.accent) } as CSSProperties;
  const body = <>
    <span className={styles.thumb}>
      <Image src={publicAsset(gameCoverPath(game))} alt="" fill sizes="120px" unoptimized className={styles.cover} />
    </span>
    <span className={styles.text}>
      <strong className={styles.name}>{entry.title}</strong>
      <small className={styles.sport}>
        {sport ? <span style={{ color: accentVar(gameSportModuleFor(sport).accent) }}>{sportLabel(sport)}</span> : null}
        <span>{String(index + 1).padStart(2, "0")}</span>
      </small>
    </span>
    <span className={styles.play} aria-hidden="true">
      <svg viewBox="0 0 14 14" width="12" height="12"><path d="M3 1.5v11l9-5.5z" fill="currentColor" /></svg>
      PLAY
    </span>
  </>;
  return launch.href
    ? <Link href={launch.href} className={styles.row} style={style} aria-label={`Play ${entry.title}`}>{body}</Link>
    : <button type="button" className={styles.row} style={style} aria-label={`Play ${entry.title}`} onClick={launch.onClick}>{body}</button>;
}
