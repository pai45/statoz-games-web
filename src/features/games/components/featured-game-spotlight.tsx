"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties, type FocusEvent, type MouseEvent, type PointerEvent } from "react";
import { accentVar } from "@/design-system";
import type { GameSport } from "@/domain/game-sports";
import { gameRegistry, type GameEntry } from "@/mocks/games";
import { publicAsset } from "@/shared/config";
import { usePrefersReducedMotion } from "@/shared/hooks/use-prefers-reduced-motion";
import { gameCoverPath, spotlightGames } from "../home-catalog";
import { useCardTilt } from "./use-card-tilt";
import { useGameLaunch } from "./use-game-launch";
import styles from "./featured-game-spotlight.module.css";

const fanPosition = [styles.pos0, styles.pos1, styles.pos2, styles.pos3];
/** Horizontal travel, in px, that counts as a swipe on the cover strip. */
const swipeDistance = 40;

/** The first line of a game's title, written large behind the strip. */
function ghostWord(entry: GameEntry): string {
  if (entry.titleLines?.length) return entry.titleLines[0];
  const at = entry.title.lastIndexOf(" ");
  return at > 0 ? entry.title.slice(0, at) : entry.title;
}

const accentStyle = (entry: GameEntry, name: string) => ({ [name]: accentVar(entry.accent) }) as CSSProperties;

/**
 * The home page's featured carousel, the same at every screen size: no frame
 * and no copy — a fanned strip of three cover cards over a full-bleed animated
 * backdrop (glow orbs, drifting dots, a running grid floor, a sweeping beam and
 * a ghost title), with the featured game's name beneath. The front cover and
 * name open the game; swipe or the pager changes it.
 *
 * Rotation is driven by the active pager segment's fill animation, so pausing
 * that animation (hover, focus, hidden tab) pauses the carousel exactly where
 * it stands. Reduced-motion viewers get no auto-advance.
 */
export function FeaturedGameSpotlight({ sport }: { sport: GameSport | null }) {
  const games = spotlightGames(sport);
  const count = games.length;
  const [index, setIndex] = useState(0);
  const [run, setRun] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(false);
  const reduced = usePrefersReducedMotion();
  const tilt = useCardTilt({ x: 12, y: 8, sheen: 140 });
  const swipe = useRef<{ x: number; y: number } | null>(null);
  const swiped = useRef(false);

  useEffect(() => {
    const update = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  if (!count) return null;
  const active = Math.min(index, count - 1);
  const entry = gameRegistry[games[active]];
  const auto = !reduced && count > 1;
  const paused = hovered || focused || hidden;
  const go = (next: number) => { setIndex((next + count) % count); setRun((value) => value + 1); };
  const onBlur = (event: FocusEvent<HTMLElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false);
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
      go(active + (dx < 0 ? 1 : -1));
    },
    onPointerLeave: (event: PointerEvent<HTMLElement>) => { swipe.current = null; tilt.onPointerLeave(event); },
    // A swipe ends on the cover link; it must not also open the game.
    onClickCapture: (event: MouseEvent<HTMLElement>) => {
      if (!swiped.current) return;
      swiped.current = false;
      event.preventDefault();
      event.stopPropagation();
    },
  };

  return <section aria-roledescription="carousel" aria-label="Featured games"
    className={`${styles.spot} ${paused ? styles.paused : ""}`} style={accentStyle(entry, "--spot-accent")}
    onPointerEnter={() => setHovered(true)} onPointerLeave={() => setHovered(false)}
    onFocus={() => setFocused(true)} onBlur={onBlur}>
    <div className={styles.backdrop} aria-hidden="true">
      <div className={`${styles.orb} ${styles.orbAccent}`} />
      <div className={`${styles.orb} ${styles.orbViolet}`} />
      <div className={styles.dots} />
      <div className={styles.floor} />
      <div className={styles.beam} />
      {games.map((id, i) => <div key={id} className={`${styles.ghost} ${i === active ? styles.ghostActive : ""}`}>{ghostWord(gameRegistry[id])}</div>)}
    </div>

    <div className={styles.stage} {...stage}>
      <div className={styles.fan} aria-hidden="true">
        {games.map((id, i) => {
          const position = Math.min((i - active + count) % count, 3);
          return <div key={id} className={`${styles.fanCard} ${fanPosition[position]}`} style={accentStyle(gameRegistry[id], "--fan-accent")}>
            <div className={styles.fanEdge} />
            <div className={styles.fanFill}>
              <Image src={publicAsset(gameCoverPath(id))} alt="" fill sizes="(min-width: 1024px) 480px, 70vw" unoptimized priority={i === 0} loading={i === 0 ? undefined : "eager"} className={styles.fanCover} />
              <div className={styles.fanVignette} />
              <div className={styles.holo} />
              <div className={styles.sheen} />
              <span className={`${styles.bracket} ${styles.bracketStart}`} />
              <span className={`${styles.bracket} ${styles.bracketEnd}`} />
            </div>
          </div>;
        })}
      </div>
      <StripLaunch key={entry.href} entry={entry} />
    </div>

    {count > 1 ? <div className={styles.pager}>
      <button type="button" className={styles.step} aria-label="Previous featured game" onClick={() => go(active - 1)}>
        <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M10 3L5 8l5 5" fill="none" stroke="currentColor" strokeWidth="1.8" /></svg>
      </button>
      <div className={styles.segments}>
        {games.map((id, i) => <button key={id} type="button" className={styles.segment} aria-label={`Show ${gameRegistry[id].title}`} aria-current={i === active ? "true" : undefined} onClick={() => go(i)}>
          <span className={styles.segmentBar}>
            {i === active ? <span key={run} className={`${styles.segmentFill} ${auto ? styles.segmentRun : ""}`} onAnimationEnd={auto ? () => go(active + 1) : undefined} /> : null}
          </span>
        </button>)}
      </div>
      <button type="button" className={styles.step} aria-label="Next featured game" onClick={() => go(active + 1)}>
        <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M6 3l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.8" /></svg>
      </button>
    </div> : null}
  </section>;
}

/** The front cover and the game's name are one tap target. */
function StripLaunch({ entry }: { entry: GameEntry }) {
  const launch = useGameLaunch(entry);
  const label = `Play ${entry.title}`;
  const name = <span className={styles.stripName}>{entry.title}</span>;
  return launch.href
    ? <Link href={launch.href} aria-label={label} className={styles.stripHit}>{name}</Link>
    : <button type="button" aria-label={label} className={styles.stripHit} onClick={launch.onClick}>{name}</button>;
}
