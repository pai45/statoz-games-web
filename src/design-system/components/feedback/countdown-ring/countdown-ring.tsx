import type { CSSProperties } from "react";

import { withAlpha } from "../../../tokens/elevation";

import styles from "./countdown-ring.module.css";

export type CountdownRingProps = {
  /** What the ring reads out — a remaining count, or a word such as "GO". */
  children: string;
  /** CSS color for the rings, the sweep, and the readout. */
  accent: string;
  /** Diameter in px. */
  size?: number;
  className?: string;
};

/** The twelve radial ticks, longer every third one. */
const ticks = Array.from({ length: 12 }, (_, index) => {
  const angle = (Math.PI * 2 * index) / 12;
  const inner = 77 - (index % 3 === 0 ? 25 : 18);
  const outer = 77 - 8;
  return {
    x1: 77 + Math.cos(angle) * inner,
    y1: 77 + Math.sin(angle) * inner,
    x2: 77 + Math.cos(angle) * outer,
    y2: 77 + Math.sin(angle) * outer,
  };
});

/**
 * A radar-style countdown: concentric rings, tick marks, and a crosshair, with
 * one bright arc sweeping around them and the whole dial breathing slowly.
 *
 * The sweep is a conic gradient masked into a ring rather than a stroked arc,
 * which is how the web draws the shader Flutter paints onto a circle.
 */
export function CountdownRing({
  children,
  accent,
  size = 154,
  className,
}: CountdownRingProps) {
  const style = { "--ring-accent": accent, width: size, height: size } as CSSProperties;
  const faint = withAlpha(accent, 0.12);

  return (
    <div
      className={[
        styles.breathe,
        "relative grid shrink-0 place-items-center",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={style}
    >
      <svg
        aria-hidden
        viewBox="0 0 154 154"
        className="absolute inset-0 size-full"
        fill="none"
      >
        <circle cx="77" cy="77" r="69" stroke={faint} strokeWidth="1" />
        <circle cx="77" cy="77" r="49" stroke={faint} strokeWidth="1" />
        <circle
          cx="77"
          cy="77"
          r="31"
          stroke={withAlpha(accent, 0.46)}
          strokeWidth="1.2"
        />
        {ticks.map((tick, index) => (
          <line key={index} {...tick} stroke={faint} strokeWidth="1" />
        ))}
        <line x1="77" y1="0" x2="77" y2="154" stroke={withAlpha(accent, 0.18)} strokeWidth="1" />
        <line x1="0" y1="77" x2="154" y2="77" stroke={withAlpha(accent, 0.18)} strokeWidth="1" />
      </svg>

      {/* The sweeping arc: a conic gradient clipped to a disc, with its middle
          masked out. The mask's black is a stencil value — opaque, not a
          colour — and the rounding is what keeps the corners off the screen. */}
      <div
        aria-hidden
        className={[styles.sweep, "absolute inset-2 rounded-full"].join(" ")}
        style={{
          background: `conic-gradient(from 0deg, transparent 0%, ${withAlpha(accent, 0.08)} 68%, ${withAlpha(accent, 0.68)} 82%, transparent 100%)`,
          maskImage:
            "radial-gradient(closest-side, transparent calc(100% - 3px), #000 calc(100% - 3px))",
          WebkitMaskImage:
            "radial-gradient(closest-side, transparent calc(100% - 3px), #000 calc(100% - 3px))",
        }}
      />

      <span
        className="relative font-display font-black leading-compact tabular-nums"
        style={{
          color: accent,
          fontSize:
            children.length > 1
              ? "var(--ds-text-hero)"
              : "var(--ds-text-countdown)",
          letterSpacing: "var(--ds-tracking-tight)",
          textShadow: `0 0 24px ${withAlpha(accent, 0.85)}, 0 0 42px ${withAlpha(accent, 0.35)}`,
        }}
      >
        {children}
      </span>
    </div>
  );
}
