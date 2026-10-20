import type { CSSProperties, ReactNode } from "react";

import styles from "./fixture-panel.module.css";

export type FixturePanelProps = {
  /** The card's body, on the navy gradient. */
  children: ReactNode;
  /**
   * Sits inside the top notch, reading against the page rather than the card.
   * Without one the card's top edge is straight.
   */
  tag?: ReactNode;
  /** A full-width strip flush to the bottom chamfer. */
  strip?: ReactNode;
  /**
   * Tints the edge and the lift beneath it. Left off, both stay the neutral
   * fixture chrome, which is what a card carrying its own status tag wants.
   */
  accent?: string;
  className?: string;
  bodyClassName?: string;
  as?: "article" | "section" | "div";
};

/**
 * The fixture card surface: a navy panel with a square top carrying a centred
 * status notch, chamfered lower corners, and a hard un-blurred lift beneath it
 * on the same silhouette.
 *
 * Shared by everything that reads as one of a set of fixtures — a match tile, a
 * pick market — so the family is one piece of hardware rather than several.
 */
export function FixturePanel({
  children,
  tag,
  strip,
  accent,
  className,
  bodyClassName,
  as: Element = "article",
}: FixturePanelProps) {
  const style = {
    "--fixture-accent": accent ?? "var(--ds-color-fixture-border)",
    "--fixture-edge": accent
      ? `color-mix(in srgb, ${accent} 45%, var(--ds-color-fixture-border))`
      : "var(--ds-color-fixture-border)",
    "--fixture-lift": accent
      ? `color-mix(in srgb, ${accent} 25%, var(--ds-color-fixture-shadow))`
      : "var(--ds-color-fixture-shadow)",
    "--fixture-clip": tag ? "var(--ds-clip-fixture)" : "var(--ds-clip-fixture-flat)",
  } as CSSProperties;

  return (
    <Element className={[styles.shell, className].filter(Boolean).join(" ")} style={style}>
      <span aria-hidden className={styles.lift} />
      <div className={styles.frame}>
        <div className={styles.inner}>
          <div className={[styles.body, bodyClassName].filter(Boolean).join(" ")}>{children}</div>
          {strip}
        </div>
      </div>
      {tag ? <div className={styles.tag}>{tag}</div> : null}
    </Element>
  );
}

/**
 * The strip along a fixture card's bottom edge. `focal` switches to the
 * brighter blue fill and cyan hairline a call to action takes; give it an
 * `onClick` and it becomes the button.
 */
export function FixtureStrip({
  children,
  focal = false,
  className,
  onClick,
  ...rest
}: {
  children: ReactNode;
  focal?: boolean;
  className?: string;
  onClick?: () => void;
  "aria-label"?: string;
}) {
  const classes = [styles.strip, focal ? styles.stripFocal : "", className]
    .filter(Boolean)
    .join(" ");
  if (!onClick) {
    return (
      <div className={classes} {...rest}>
        {children}
      </div>
    );
  }
  return (
    <button type="button" className={classes} onClick={onClick} {...rest}>
      {children}
    </button>
  );
}
