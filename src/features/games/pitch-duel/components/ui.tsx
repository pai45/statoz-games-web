"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";

import { ChevronsIcon, CloseIcon } from "./icons";
import styles from "./pitch-duel.module.css";

export type PillTone = "violet" | "green" | "red" | "blue" | "grey" | "light";

/**
 * The big action pill: a round chevron badge on the left and a bold label,
 * on a tone gradient. Disabled pills dim and stop.
 */
export function Pill({
  tone = "violet",
  children,
  onClick,
  disabled,
  back,
  icon,
  label,
  wide,
  pulse,
  optionId,
}: {
  tone?: PillTone;
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  back?: boolean;
  icon?: ReactNode;
  label?: string;
  wide?: boolean;
  pulse?: boolean;
  optionId?: string;
}) {
  return (
    <button
      type="button"
      className={styles.pill}
      data-tone={tone}
      data-wide={wide || undefined}
      data-pulse={pulse || undefined}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      data-pitch-duel-option={optionId}
    >
      <span className={styles.pillBadge} aria-hidden>
        {icon ?? <ChevronsIcon back={back} />}
      </span>
      <span className={styles.pillLabel}>{children}</span>
    </button>
  );
}

/** "◆ WORDS ◆" eyebrow over a section. */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className={styles.eyebrow}>
      <i aria-hidden />
      {children}
      <i aria-hidden />
    </span>
  );
}

function useEscape(open: boolean, onClose: () => void) {
  const close = useRef(onClose);
  useEffect(() => {
    close.current = onClose;
  });
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close.current();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);
}

/** A sheet that slides up from the bottom of the game column. */
export function Sheet({ open, title, onClose, children }: { open: boolean; title: string; onClose: () => void; children: ReactNode }) {
  const id = useId();
  useEscape(open, onClose);
  if (!open) return null;
  return (
    <div className={styles.overlay} onClick={onClose}>
      <section className={styles.sheet} role="dialog" aria-modal="true" aria-labelledby={id} onClick={(e) => e.stopPropagation()}>
        <header className={styles.sheetHead}>
          <h2 id={id}>{title}</h2>
          <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Close">
            <CloseIcon />
          </button>
        </header>
        <div className={styles.sheetBody}>{children}</div>
      </section>
    </div>
  );
}

/** A centred card over a dimmed, violet-tinted backdrop. */
export function Modal({
  open,
  labelledBy,
  tone = "violet",
  onClose,
  children,
}: {
  open: boolean;
  labelledBy: string;
  tone?: "violet" | "blue" | "red";
  onClose?: () => void;
  children: ReactNode;
}) {
  useEscape(open, onClose ?? (() => {}));
  if (!open) return null;
  return (
    <div className={styles.overlay} data-center onClick={onClose}>
      <section className={styles.modal} data-tone={tone} role="dialog" aria-modal="true" aria-labelledby={labelledBy} onClick={(e) => e.stopPropagation()}>
        {children}
      </section>
    </div>
  );
}
