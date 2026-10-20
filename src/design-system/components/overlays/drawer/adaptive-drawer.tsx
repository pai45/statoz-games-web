"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";

export type AdaptiveDrawerProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  /**
   * The HUD sheet: the wide chamfer, the raked slate bed and the lit top edge
   * a decision is taken on. Its header is the caller's, so the sheet can put
   * its own controls on the title row.
   */
  hud?: boolean;
  className?: string;
};

/** Native modal dialog that is a bottom sheet on mobile and a right drawer on desktop. */
export function AdaptiveDrawer({ open, onClose, title, children, hud = false, className }: AdaptiveDrawerProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    const dialog = ref.current; if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);
  useEffect(() => {
    const dialog = ref.current; if (!dialog) return;
    const cancel = (event: Event) => { event.preventDefault(); onClose(); };
    const close = () => { if (open) onClose(); };
    dialog.addEventListener("cancel", cancel); dialog.addEventListener("close", close);
    return () => { dialog.removeEventListener("cancel", cancel); dialog.removeEventListener("close", close); };
  }, [onClose, open]);

  const shell = hud
    ? "fixed inset-auto bottom-0 left-0 m-0 max-h-[90dvh] w-full max-w-none overflow-y-auto border-0 bg-(image:--ds-gradient-hud-sheet) p-0 text-(--ds-color-text-default) shadow-2xl backdrop:bg-(--ds-color-overlay-scrim) md:bottom-auto md:left-auto md:right-0 md:top-0 md:h-dvh md:max-h-none md:w-[440px]"
    : "fixed inset-auto bottom-0 left-0 m-0 max-h-[90dvh] w-full max-w-none overflow-y-auto border border-(--ds-color-border-strong) bg-(--ds-color-background-primary) p-0 text-(--ds-color-text-default) shadow-2xl backdrop:bg-(--ds-color-overlay-scrim) md:bottom-auto md:left-auto md:right-0 md:top-0 md:h-dvh md:max-h-none md:w-[420px]";

  return (
    <dialog
      ref={ref}
      aria-label={hud ? title : undefined}
      aria-labelledby={hud ? undefined : titleId}
      onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}
      className={[shell, className].filter(Boolean).join(" ")}
      style={{ clipPath: hud ? "var(--ds-clip-hud-sheet)" : "var(--ds-clip-panel)" }}
    >
      {hud ? (
        <>
          {/* The sheet's one lit element: a hairline along its top edge. */}
          <span aria-hidden className="sticky top-0 z-10 block h-0.5 w-full bg-(image:--ds-gradient-hud-edge)" />
          {children}
        </>
      ) : (
        <>
          <header className="sticky top-0 z-10 flex min-h-16 items-center justify-between border-b border-(--ds-color-border-muted) bg-(--ds-color-background-primary) px-4">
            <h2 id={titleId} className="font-(family-name:--ds-font-display) text-lg font-black tracking-[0.08em]">{title}</h2>
            <button type="button" onClick={onClose} aria-label={`Close ${title}`} className="grid min-h-11 min-w-11 place-items-center text-2xl text-(--ds-color-text-muted) hover:text-white focus-visible:outline-2 focus-visible:outline-(--ds-color-accent-cyan)">×</button>
          </header>
          {children}
        </>
      )}
    </dialog>
  );
}
