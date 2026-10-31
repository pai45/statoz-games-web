import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

import styles from "./nav-rail.module.css";

type NavRailItemBase = {
  id: string;
  label: string;
  icon: ReactNode;
  /** Color the item takes when it is the current destination. */
  accent: string;
};

export type NavRailItem = NavRailItemBase &
  (
    | { href: string; onSelect?: never }
    | { href?: never; onSelect: () => void }
  );

export type NavRailProps = {
  items: NavRailItem[];
  /** Id of the current destination. */
  activeId?: string;
  /** `bar` lays the items out horizontally, `rail` stacks them vertically. */
  orientation?: "bar" | "rail";
  /** Rail only: a narrow icon column with small labels, for short landscape screens. */
  compact?: boolean;
  label: string;
  className?: string;
};

const slotNumber = (index: number) => String(index + 1).padStart(2, "0");

/**
 * Primary destination switcher, styled as a game loadout. Every destination is
 * a numbered slot; only the current one glows. The same items render as a
 * bottom hotbar on small screens or a side rail on large ones, so the
 * navigation identity survives the reflow.
 */
export function NavRail({
  items,
  activeId,
  orientation = "bar",
  compact = false,
  label,
  className,
}: NavRailProps) {
  const rail = orientation === "rail";
  const variant = rail ? (compact ? "compact" : "rail") : "bar";
  const activeIndex = items.findIndex((item) => item.id === activeId);

  return (
    <nav
      aria-label={label}
      data-variant={variant}
      className={[styles.nav, className ?? ""].filter(Boolean).join(" ")}
      style={{ "--nav-accent": items[Math.max(activeIndex, 0)]?.accent } as CSSProperties}
    >
      {variant === "rail" && (
        <div className={styles.header} aria-hidden="true">
          <span className={styles.headerTitle}><small>SELECT</small>MODE</span>
          <span className={styles.meter}>
            {items.map((item, index) => <i key={item.id} data-on={index === activeIndex || undefined} />)}
          </span>
          <b className={styles.meterCount}>{activeIndex < 0 ? "--" : slotNumber(activeIndex)}/{slotNumber(items.length - 1)}</b>
        </div>
      )}
      <ul className={styles.list}>
        {items.map((item, index) => {
          const active = item.id === activeId;
          const itemStyle = { "--nav-accent": item.accent } as CSSProperties;
          const content = (
            <>
              <span className={styles.slot}><span className={styles.glyph}>{item.icon}</span></span>
              <span className={styles.label}>{item.label}</span>
              {variant === "rail" && <span className={styles.key} aria-hidden="true">{slotNumber(index)}</span>}
            </>
          );
          return (
            <li key={item.id} className={styles.cell}>
              {item.href ? (
                <Link href={item.href} aria-current={active ? "page" : undefined} className={styles.item} data-active={active || undefined} style={itemStyle}>
                  {content}
                </Link>
              ) : (
                <button type="button" onClick={item.onSelect} aria-current={active ? "page" : undefined} className={styles.item} data-active={active || undefined} style={itemStyle}>
                  {content}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
