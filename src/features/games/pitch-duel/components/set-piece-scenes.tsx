"use client";

import type { CSSProperties } from "react";

import type { Turn } from "../engine/match";
import { defenderOptions, takerOptions } from "../engine/set-pieces";
import type { MatchState, SetPieceKind, SetPieceOption } from "../engine/types";

import { useNumberKeys } from "./action-pad";
import { primaryPosition } from "./card-art";
import styles from "./match.module.css";

type Spot = { x: number; y: number; w: number; h: number };

/**
 * Where each option sits on its scene, in percent of a 3:2 picture. The goal
 * frame spans x 12–88, y 14–74 on every goal-facing scene.
 */
const spots: Record<SetPieceKind, { taker: Record<string, Spot>; defender: Record<string, Spot> }> = {
  penalty: {
    taker: {
      TL: { x: 13, y: 15, w: 24, h: 29 },
      BL: { x: 13, y: 45, w: 24, h: 28 },
      C: { x: 38, y: 15, w: 24, h: 58 },
      TR: { x: 63, y: 15, w: 24, h: 29 },
      BR: { x: 63, y: 45, w: 24, h: 28 },
    },
    defender: {
      L: { x: 13, y: 15, w: 24, h: 58 },
      C: { x: 38, y: 15, w: 24, h: 58 },
      R: { x: 63, y: 15, w: 24, h: 58 },
    },
  },
  freeKick: {
    taker: {
      over: { x: 30, y: 14, w: 40, h: 20 },
      around: { x: 68, y: 36, w: 26, h: 26 },
      low: { x: 30, y: 64, w: 40, h: 16 },
      layoff: { x: 3, y: 62, w: 25, h: 26 },
    },
    defender: {
      jump: { x: 30, y: 14, w: 40, h: 20 },
      cheat: { x: 68, y: 36, w: 26, h: 26 },
      stay: { x: 30, y: 64, w: 40, h: 16 },
    },
  },
  corner: {
    taker: {
      near: { x: 18, y: 22, w: 28, h: 26 },
      far: { x: 56, y: 22, w: 28, h: 26 },
      short: { x: 4, y: 62, w: 30, h: 26 },
    },
    defender: {
      man: { x: 18, y: 22, w: 28, h: 26 },
      zonal: { x: 56, y: 22, w: 28, h: 26 },
      press: { x: 4, y: 62, w: 30, h: 26 },
    },
  },
  oneOnOne: {
    taker: {
      round: { x: 64, y: 40, w: 30, h: 28 },
      chip: { x: 30, y: 12, w: 40, h: 22 },
      low: { x: 8, y: 40, w: 30, h: 28 },
    },
    defender: {
      rush: { x: 30, y: 46, w: 40, h: 24 },
      wait: { x: 30, y: 14, w: 40, h: 26 },
    },
  },
};

const titles: Record<SetPieceKind, string> = {
  penalty: "Penalty!",
  freeKick: "Free kick!",
  corner: "Corner!",
  oneOnOne: "One on one!",
};

function subtitle(kind: SetPieceKind, taker: boolean): string {
  if (taker)
    return kind === "penalty"
      ? "Pick your shot placement."
      : kind === "freeKick"
        ? "Pick your shot over, around or under the wall."
        : kind === "corner"
          ? "Pick your delivery."
          : "Pick your finish.";
  return kind === "penalty"
    ? "Pick your dive."
    : kind === "freeKick"
      ? "Tell the wall what to do."
      : kind === "corner"
        ? "Set your marking."
        : "Rush him or stay big.";
}

/**
 * A set piece as a picture you tap: the goal and its five zones for a
 * penalty, the wall for a free kick, the box for a corner, the keeper for a
 * one-on-one. Each zone sends the same option id the engine already knows.
 */
export function SetPieceScene({
  state,
  turn,
  onPick,
}: {
  state: MatchState;
  turn: Extract<Turn, { kind: "setPiece" }>;
  onPick: (option: SetPieceOption) => void;
}) {
  const sp = turn.setPiece;
  const taker = turn.role === "taker";
  const defs = (taker ? takerOptions : defenderOptions)[sp.kind];
  const place = spots[sp.kind][taker ? "taker" : "defender"];
  const takerCard = state.teams[sp.side].cards[sp.takerId];
  const keeperSide = sp.side === "home" ? "away" : "home";
  const keeperCard = state.teams[keeperSide].cards[sp.keeperId];
  const yourMan = taker ? takerCard : keeperCard;

  useNumberKeys(defs.length, (i) => onPick(defs[i].id as SetPieceOption));

  return (
    <section className={styles.scene} aria-label={titles[sp.kind]} data-kind={sp.kind} data-role={turn.role}>
      <header className={styles.sceneHead}>
        <small>MATCH EVENT</small>
        <h2>{titles[sp.kind]}</h2>
        <p>{subtitle(sp.kind, taker)}</p>
        {yourMan ? (
          <span className={styles.takerChip}>
            <small>{taker ? (sp.kind === "corner" ? "CORNER TAKER" : "TAKER") : "YOUR KEEPER"}</small>
            <b>{yourMan.name}</b>
            <em>
              {yourMan.rating} {primaryPosition(yourMan)}
            </em>
          </span>
        ) : null}
      </header>

      <div className={styles.picture}>
        <SceneArt kind={sp.kind} lane={sp.lane} keeperRating={keeperCard?.rating} />
        {defs.map((o, i) => {
          const base = place[o.id];
          if (!base) return null;
          // A corner from the right flag mirrors the picture.
          const s = sp.kind === "corner" && sp.lane === "right" ? { ...base, x: 100 - base.x - base.w } : base;
          return (
            <button
              key={o.id}
              type="button"
              className={styles.zone}
              style={{ left: `${s.x}%`, top: `${s.y}%`, width: `${s.w}%`, height: `${s.h}%`, "--i": i } as CSSProperties}
              onClick={() => onPick(o.id as SetPieceOption)}
              data-pitch-duel-option={o.id}
              aria-label={`${o.label}${o.hint ? `. ${o.hint}` : ""}`}
            >
              <b>{o.label}</b>
              {o.hint ? <small>{o.hint}</small> : null}
            </button>
          );
        })}
      </div>
      <p className={styles.sceneFoot}>
        {sp.kind === "penalty" && taker ? "Tap one of the 5 goal zones" : `Tap one of the ${defs.length} options`}
      </p>
    </section>
  );
}

/** The drawn backdrop for each scene: original vector art, no photos. */
function SceneArt({ kind, lane, keeperRating }: { kind: SetPieceKind; lane: string; keeperRating?: number }) {
  const goalFacing = kind !== "corner";
  const flip = lane === "right";
  return (
    <svg className={styles.art} viewBox="0 0 300 200" preserveAspectRatio="none" aria-hidden>
      <defs>
        <linearGradient id="pd-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#05030c" />
          <stop offset="0.55" stopColor="#1b0d33" />
          <stop offset="1" stopColor="#0f2a1a" />
        </linearGradient>
        <linearGradient id="pd-grass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2f8f3a" />
          <stop offset="1" stopColor="#14531f" />
        </linearGradient>
        <pattern id="pd-net" width="6" height="6" patternUnits="userSpaceOnUse">
          <path d="M0 0L6 6M6 0L0 6" stroke="rgba(255,255,255,.22)" strokeWidth="0.6" />
        </pattern>
        <radialGradient id="pd-flood" cx="0.5" cy="0" r="0.6">
          <stop offset="0" stopColor="rgba(255,255,255,.35)" />
          <stop offset="1" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>
      <rect width="300" height="200" fill="url(#pd-sky)" />
      <circle cx="40" cy="6" r="60" fill="url(#pd-flood)" />
      <circle cx="260" cy="6" r="60" fill="url(#pd-flood)" />
      {/* Stands: rows of crowd dots. */}
      {Array.from({ length: 5 }, (_, r) => (
        <path key={r} d={`M0 ${36 + r * 6}H300`} stroke={`rgba(168,85,247,${0.08 + r * 0.03})`} strokeWidth="3" strokeDasharray="2 3" />
      ))}
      <rect y="148" width="300" height="52" fill="url(#pd-grass)" />
      {Array.from({ length: 6 }, (_, i) => (
        <rect key={i} x={i * 50} y="148" width="25" height="52" fill="rgba(255,255,255,.04)" />
      ))}
      <path d="M0 176H300" stroke="rgba(255,255,255,.55)" strokeWidth="1.4" />

      {goalFacing ? (
        <g>
          <rect x="36" y="28" width="228" height="120" fill="url(#pd-net)" />
          <rect x="36" y="28" width="228" height="120" fill="none" stroke="#f8fafc" strokeWidth="5" />
          <path d="M36 148H264" stroke="#f8fafc" strokeWidth="2" />
          {kind === "penalty" ? (
            <g stroke="rgba(255,255,255,.75)" strokeWidth="1.2" strokeDasharray="4 3" fill="none">
              <path d="M112 28V148M188 28V148M36 88H112M188 88H264" />
            </g>
          ) : null}
        </g>
      ) : (
        <g>
          {/* Corner: the box seen from the flag, goal at the top. */}
          <path d="M70 34H230V54H70Z" fill="url(#pd-net)" stroke="#f8fafc" strokeWidth="3" />
          <path d="M20 148L60 54H240L280 148" fill="none" stroke="rgba(255,255,255,.6)" strokeWidth="1.4" />
          <path d="M95 54L88 82H212L205 54" fill="none" stroke="rgba(255,255,255,.6)" strokeWidth="1.4" />
          <path
            d={flip ? "M286 186C240 120 200 70 112 66" : "M14 186C60 120 100 70 188 66"}
            fill="none"
            stroke="rgba(56,189,248,.7)"
            strokeWidth="2"
            strokeDasharray="5 4"
          />
          <path d={flip ? "M286 186l6-24" : "M14 186l-6-24"} stroke="#fbbf24" strokeWidth="2" />
          <path d={flip ? "M292 162l-8 4 8 4" : "M8 162l8 4-8 4"} fill="#fbbf24" />
          {Array.from({ length: 6 }, (_, i) => (
            <g key={i} transform={`translate(${86 + i * 25} ${92 + (i % 2) * 14})`}>
              <circle r="4" cy="-9" fill={i % 2 ? "#f87171" : "#60a5fa"} />
              <rect x="-4" y="-5" width="8" height="12" rx="2" fill={i % 2 ? "#f87171" : "#60a5fa"} />
            </g>
          ))}
        </g>
      )}

      {kind === "freeKick" ? (
        <g>
          {Array.from({ length: 5 }, (_, i) => (
            <g key={i} transform={`translate(${120 + i * 15} 112)`}>
              <circle r="5" cy="-10" fill="#f87171" />
              <rect x="-6" y="-5" width="12" height="26" rx="3" fill="#ef4444" />
            </g>
          ))}
          <path d="M150 190C140 150 110 110 150 60" fill="none" stroke="rgba(56,189,248,.5)" strokeWidth="1.5" strokeDasharray="4 4" />
        </g>
      ) : null}

      {kind === "penalty" || kind === "freeKick" || kind === "oneOnOne" ? (
        <g transform={kind === "oneOnOne" ? "translate(150 128) scale(1.5)" : kind === "freeKick" ? "translate(150 70) scale(0.8)" : "translate(150 124)"}>
          <circle r="7" cy="-18" fill="#e9d5ff" />
          <rect x="-11" y="-11" width="22" height="30" rx="5" fill="#a855f7" />
          <path d="M-11 -6l-12 -10M11 -6l12 -10" stroke="#a855f7" strokeWidth="5" strokeLinecap="round" />
          {keeperRating ? (
            <text y="8" textAnchor="middle" fontSize="11" fontWeight="800" fill="#fff">{keeperRating}</text>
          ) : null}
        </g>
      ) : null}

      {kind !== "corner" ? <circle cx="150" cy="188" r="6" fill="#f8fafc" stroke="#0f172a" strokeWidth="1.2" /> : null}
    </svg>
  );
}
