"use client";

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";

import { publicAsset } from "@/shared/config/base-path";

import { gameCoverPath } from "../../home-catalog";
import { golfFonts } from "../fonts";
import { openGolfHoles, type OpenGolfProgress } from "../state/open-golf-progress";

import styles from "./open-golf-lobby.module.css";

export type OpenGolfLaunch = { hole: number } | { mode: "select" };

export type OpenGolfLobbyProps = {
  progress: OpenGolfProgress | null;
  onBack: () => void;
  onPlay: (launch: OpenGolfLaunch) => void;
};

type TileState = "loading" | "cleared" | "next" | "locked";

const pad = (value: number) => String(value).padStart(2, "0");
const strokes = (count: number) => `${count} stroke${count === 1 ? "" : "s"}`;

const iconPaths = {
  back: <path d="M14.5 5.5 8 12l6.5 6.5" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />,
  play: <path d="M8 5.6v12.8a1.2 1.2 0 0 0 1.8 1L19.6 13a1.2 1.2 0 0 0 0-2L9.8 4.6A1.2 1.2 0 0 0 8 5.6Z" />,
  lock: <><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" /><rect x="5" y="10" width="14" height="10" rx="2.6" /></>,
  star: <path d="m12 2.8 2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L12 16.6l-5.4 2.9 1.1-6.1-4.5-4.2 6.1-.8Z" />,
  help: <><path d="M9.2 9.2a2.9 2.9 0 1 1 4.1 2.6c-.8.4-1.3 1-1.3 1.9v.6" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" /><circle cx="12" cy="18.2" r="1.7" /></>,
};

function Icon({ name }: { name: keyof typeof iconPaths }) {
  return <svg viewBox="0 0 24 24" aria-hidden focusable="false">{iconPaths[name]}</svg>;
}

/** The Open Golf lobby, in the game's own arcade style: course progress and the hole grid. */
export function OpenGolfLobby({ progress, onBack, onPlay }: OpenGolfLobbyProps) {
  const [helpOpen, setHelpOpen] = useState(false);
  const helpButton = useRef<HTMLButtonElement>(null);
  const ready = progress !== null;
  const bests = progress?.bests ?? Array.from({ length: openGolfHoles }, () => null);
  const cleared = progress?.cleared ?? 0;
  const next = progress?.next ?? null;
  // Same rule as the engine: a hole opens once every earlier hole has a best.
  const unlocked = (hole: number) => bests.slice(0, hole).every((best) => best !== null);
  const stateOf = (hole: number): TileState => (!ready ? "loading" : bests[hole] !== null ? "cleared" : unlocked(hole) ? "next" : "locked");
  const ctaLabel = !ready ? "LOADING" : next === null ? "REPLAY HOLE 1" : cleared === 0 ? "TEE OFF" : `PLAY HOLE ${next + 1}`;

  const closeHelp = () => { setHelpOpen(false); helpButton.current?.focus(); };

  // Arrow keys move through the hole grid like the in-game hole select.
  const moveFocus = (event: KeyboardEvent<HTMLDivElement>) => {
    const tile = (event.target as HTMLElement).closest<HTMLButtonElement>("button[data-hole]");
    if (!tile) return;
    const tiles = [...event.currentTarget.querySelectorAll<HTMLButtonElement>("button[data-hole]")];
    const columns = getComputedStyle(event.currentTarget).gridTemplateColumns.split(" ").length;
    const index = tiles.indexOf(tile);
    const target = { ArrowLeft: index - 1, ArrowRight: index + 1, ArrowUp: index - columns, ArrowDown: index + columns, Home: 0, End: tiles.length - 1 }[event.key];
    if (target === undefined || !tiles[target]) return;
    event.preventDefault();
    tiles[target].focus();
  };

  return (
    <main
      className={`${styles.lobby} ${golfFonts}`}
      aria-labelledby="open-golf-title"
      style={{ "--og-cover": `url("${publicAsset(gameCoverPath("open-golf"))}")` } as CSSProperties}
    >
      <div className={styles.side}>
        <div className={styles.head}>
          <button type="button" className={styles.round} onClick={onBack} aria-label="Back to games"><Icon name="back" /></button>
          <p className={styles.tag}>MINI GOLF · {openGolfHoles} HOLES</p>
          <button type="button" ref={helpButton} className={`${styles.round} ${styles.roundSmall}`} onClick={() => setHelpOpen(true)} aria-label="How to play and credits" aria-haspopup="dialog"><Icon name="help" /></button>
        </div>

        <h1 id="open-golf-title" className={styles.logo} aria-label="Open Golf">
          <span className={styles.logoOpen} aria-hidden>OPEN</span>
          <span className={styles.logoGolf} aria-hidden>G<i className={styles.ball} />LF</span>
        </h1>

        <div className={styles.progress} role="img" aria-label={ready ? `${cleared} of ${openGolfHoles} holes cleared` : "Loading course progress"}>
          <i style={{ width: `${(cleared / openGolfHoles) * 100}%` }} />
        </div>
        <dl className={styles.stats}>
          <div><dt>CLEARED</dt><dd><b>{ready ? cleared : "–"}</b>/<span>{openGolfHoles}</span></dd></div>
          <div><dt>BEST TOTAL</dt><dd>{ready && cleared > 0 ? progress.total : "–"}</dd></div>
          <div><dt>ACES</dt><dd>{ready ? progress.aces : "–"}</dd></div>
        </dl>
        <button type="button" className={`${styles.btn} ${styles.btnSun}`} disabled={!ready} onClick={() => onPlay({ hole: next ?? 0 })}>
          {ctaLabel}<Icon name="play" />
        </button>
      </div>

      <div className={styles.card}>
        <div className={styles.grid} role="group" aria-label="Holes" onKeyDown={moveFocus}>
          {bests.map((best, hole) => {
            const state = stateOf(hole);
            const label = state === "loading" ? `Hole ${hole + 1}` : state === "locked" ? `Hole ${hole + 1}, locked. Clear hole ${hole} to unlock`
              : state === "next" ? `Hole ${hole + 1}, not yet cleared. Play` : `Hole ${hole + 1}, best ${strokes(best ?? 0)}${best === 1 ? ", hole in one" : ""}. Play`;
            const playable = state === "cleared" ? unlocked(hole) : state === "next";
            return (
              <button
                key={hole}
                type="button"
                className={styles.tile}
                data-hole={hole}
                data-state={state}
                style={{ "--i": hole } as CSSProperties}
                aria-label={label}
                aria-disabled={!playable}
                onClick={() => { if (playable) onPlay({ hole }); }}
              >
                <span className={styles.tileNumber}>{pad(hole + 1)}</span>
                <span className={styles.tileMeta}>{state === "locked" ? <Icon name="lock" /> : state === "next" ? "PLAY" : state === "cleared" ? `BEST ${best}` : " "}</span>
                {best === 1 && <i className={styles.ace}><Icon name="star" /></i>}
              </button>
            );
          })}
        </div>
      </div>

      {helpOpen && <HelpDialog onClose={closeHelp} />}
    </main>
  );
}

function HelpDialog({ onClose }: { onClose: () => void }) {
  const close = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    close.current?.focus();
    const onKey = (event: globalThis.KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div className={styles.modal} onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className={`${styles.cardPanel} ${styles.dialog}`} role="dialog" aria-modal="true" aria-labelledby="open-golf-help-title">
        <p className={styles.eyebrow}>OPEN GOLF</p>
        <h2 id="open-golf-help-title" className={styles.title}>HOW TO PLAY</h2>
        <ol className={styles.steps}>
          <li><b>1</b><span>Drag back from inside the circle around the ball. The further you drag, the harder the putt.</span></li>
          <li><b>2</b><span>Release to hit. Sink the ball in as few strokes as you can.</span></li>
          <li><b>3</b><span>Drag outside the circle to turn the camera. Esc or P pauses.</span></li>
        </ol>
        <p className={styles.note}>Clear a hole to unlock the next. Progress saves on this device for your StatOz account.</p>
        <p className={styles.credits}>
          Original game by Michael Gerdes · MIT licence · <a href="https://github.com/mgerdes/Open-Golf" target="_blank" rel="noreferrer">Source</a>
          <br />Rubik typeface · SIL Open Font License 1.1
        </p>
        <button type="button" ref={close} className={`${styles.btn} ${styles.btnSun} ${styles.btnWide}`} onClick={onClose}>GOT IT</button>
      </section>
    </div>
  );
}
