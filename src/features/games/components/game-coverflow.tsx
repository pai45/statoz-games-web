"use client";
import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type MouseEvent, type PointerEvent } from "react";
import { accentVar, Button } from "@/design-system";
import { gameSportModuleFor } from "@/domain/game-sports";
import { gameRegistry, gameSportFor } from "@/mocks/games";
import { publicAsset } from "@/shared/config";
import { coverflowOffset, gameCoverPath } from "../home-catalog";
import type { GameId } from "../types";
import { useCardTilt } from "./use-card-tilt";
import { useGameLaunch } from "./use-game-launch";
import styles from "./game-coverflow.module.css";

/** Horizontal travel, in px, that counts as a swipe. */
const swipeDistance = 40;
/** Cards drawn on each side of the centre; the outermost one is faded out so newcomers fade in. */
const reach = 3;

const pad = (value: number) => String(value).padStart(2, "0");

/**
 * The home page's game browser: one large game in the centre with the rest of
 * the library fanned out to its left and right. Swipe, the arrows or the
 * keyboard move through every game; tapping a side card brings it to the
 * centre, and tapping the centre card (or PLAY) opens the game.
 */
export function GameCoverflow({ games, label, onViewAll }: { games: GameId[]; label: string; onViewAll: () => void }) {
  const count = games.length;
  const [index, setIndex] = useState(0);
  const tilt = useCardTilt({ x: 10, y: 6, sheen: 140 });
  const swipe = useRef<{ x: number; y: number } | null>(null);
  const swiped = useRef(false);
  const stageRef = useRef<HTMLDivElement>(null);

  // Publish the stage size so the cards fit both its width and its height.
  useLayoutEffect(() => {
    const element = stageRef.current;
    if (!element) return;
    const measure = () => {
      element.style.setProperty("--stage-w", `${element.clientWidth}px`);
      element.style.setProperty("--stage-h", `${element.clientHeight}px`);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  if (!count) return null;
  const active = Math.min(index, count - 1);
  const id = games[active];
  const entry = gameRegistry[id];
  const sport = gameSportFor(id);
  const go = (next: number) => setIndex(((next % count) + count) % count);

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    if ((event.target as HTMLElement).closest('[role="tablist"]')) return;
    event.preventDefault();
    go(active + (event.key === "ArrowRight" ? 1 : -1));
  };
  const stage = {
    onPointerMove: tilt.onPointerMove,
    onPointerDown: (event: PointerEvent<HTMLElement>) => { swipe.current = { x: event.clientX, y: event.clientY }; swiped.current = false; },
    onPointerUp: (event: PointerEvent<HTMLElement>) => {
      const start = swipe.current; swipe.current = null;
      if (!start || count < 2) return;
      const dx = event.clientX - start.x, dy = event.clientY - start.y;
      if (Math.abs(dx) < swipeDistance || Math.abs(dx) < Math.abs(dy)) return;
      swiped.current = true;
      const steps = Math.min(3, Math.max(1, Math.round(Math.abs(dx) / 140)));
      go(active + (dx < 0 ? steps : -steps));
    },
    onPointerLeave: (event: PointerEvent<HTMLElement>) => { swipe.current = null; tilt.onPointerLeave(event); },
    // A swipe ends on a card; it must not also open or select it.
    onClickCapture: (event: MouseEvent<HTMLElement>) => {
      if (!swiped.current) return;
      swiped.current = false;
      event.preventDefault();
      event.stopPropagation();
    },
  };

  return <section aria-roledescription="carousel" aria-label={label} className={styles.flow}
    style={{ "--spot-accent": accentVar(entry.accent) } as CSSProperties} onKeyDown={onKeyDown}>
    <div className={styles.backdrop} aria-hidden="true">
      <div className={`${styles.orb} ${styles.orbAccent}`} />
      <div className={`${styles.orb} ${styles.orbViolet}`} />
      <div className={styles.dots} />
      <div className={styles.floor} />
      <div className={styles.ghost}>{entry.titleLines?.[0] ?? entry.title}</div>
    </div>

    <div ref={stageRef} className={styles.stage} {...stage}>
      <div className={styles.track}>
        {games.map((game, i) => {
          const offset = coverflowOffset(i, active, count);
          if (Math.abs(offset) > reach) return null;
          return <CoverCard key={game} game={game} offset={offset} onSelect={() => go(i)} />;
        })}
      </div>
      {count > 1 ? <>
        <button type="button" className={`${styles.step} ${styles.stepPrev}`} aria-label="Previous game" onClick={() => go(active - 1)}>
          <svg viewBox="0 0 16 16" width="18" height="18" aria-hidden="true"><path d="M10 3L5 8l5 5" fill="none" stroke="currentColor" strokeWidth="2" /></svg>
        </button>
        <button type="button" className={`${styles.step} ${styles.stepNext}`} aria-label="Next game" onClick={() => go(active + 1)}>
          <svg viewBox="0 0 16 16" width="18" height="18" aria-hidden="true"><path d="M6 3l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="2" /></svg>
        </button>
      </> : null}
    </div>

    <div className={styles.info}>
      <div className={styles.meta} aria-live="polite">
        <h2 className={styles.name}>{entry.title}</h2>
        <p className={styles.sub}>
          {sport ? <span style={{ color: accentVar(gameSportModuleFor(sport).accent) }}>{gameSportModuleFor(sport).label.toUpperCase()}</span> : null}
          <span>{`${pad(active + 1)} / ${pad(count)}`}</span>
        </p>
      </div>
      <div className={styles.actions}>
        <PlayButton game={id} />
        <Button variant="tonal" size="md" accent={accentVar("violet")} onClick={onViewAll}>VIEW ALL GAMES</Button>
      </div>
    </div>
  </section>;
}

function PlayButton({ game }: { game: GameId }) {
  const entry = gameRegistry[game];
  const launch = useGameLaunch(entry);
  return <Button variant="solid" size="md" glow accent={accentVar(entry.accent)} href={launch.href} onClick={launch.onClick} label={`Play ${entry.title}`}>PLAY</Button>;
}

function CoverCard({ game, offset, onSelect }: { game: GameId; offset: number; onSelect: () => void }) {
  const entry = gameRegistry[game];
  const launch = useGameLaunch(entry);
  const centre = offset === 0;
  const style = { "--d": offset, "--ad": Math.abs(offset), "--card-accent": accentVar(entry.accent), zIndex: 10 - Math.abs(offset) } as CSSProperties;
  const className = [styles.card, centre && styles.centre, Math.abs(offset) === reach && styles.edgeOut].filter(Boolean).join(" ");
  const body = <>
    <span className={styles.edge} aria-hidden="true" />
    <span className={styles.fill}>
      <Image src={publicAsset(gameCoverPath(game))} alt="" fill sizes="(min-width: 1024px) 520px, 60vw" unoptimized priority={centre} className={styles.cover} />
      <span className={styles.vignette} aria-hidden="true" />
      <span className={styles.sheen} aria-hidden="true" />
      <span className={`${styles.bracket} ${styles.bracketStart}`} aria-hidden="true" />
      <span className={`${styles.bracket} ${styles.bracketEnd}`} aria-hidden="true" />
    </span>
  </>;
  if (!centre) return <button type="button" className={className} style={style} aria-label={`Show ${entry.title}`} tabIndex={-1} onClick={onSelect}>{body}</button>;
  return launch.href
    ? <Link href={launch.href} className={className} style={style} aria-label={`Play ${entry.title}`} draggable={false}>{body}</Link>
    : <button type="button" className={className} style={style} aria-label={`Play ${entry.title}`} onClick={launch.onClick}>{body}</button>;
}
