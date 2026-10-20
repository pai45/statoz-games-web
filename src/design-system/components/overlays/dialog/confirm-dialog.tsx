"use client";

import { useEffect, useId, useRef } from "react";

import { WarningIcon } from "../../../icons/glyphs";

export type ConfirmDialogProps = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  /** A destructive choice is flagged in danger and shouts WARNING. */
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

/**
 * The house confirmation: a chamfered plate carrying a flagged heading, the
 * consequence in plain words, and two equal actions split by a hairline.
 *
 * It exists because some choices cannot be taken back — deleting a comment, a
 * deck, a saved run — and the platform should ask the same way every time
 * rather than borrowing the browser's own dialog.
 */
export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel,
  destructive = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      confirmRef.current?.focus();
    }
    if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    // Escape must read as a cancel, not as a silent dismissal.
    const cancel = (event: Event) => {
      event.preventDefault();
      onCancel();
    };
    const close = () => {
      if (open) onCancel();
    };
    dialog.addEventListener("cancel", cancel);
    dialog.addEventListener("close", close);
    return () => {
      dialog.removeEventListener("cancel", cancel);
      dialog.removeEventListener("close", close);
    };
  }, [onCancel, open]);

  const accent = destructive ? "var(--ds-color-danger)" : "var(--ds-color-accent-cyan)";
  const edge = destructive ? "var(--ds-color-accent-violet)" : "var(--ds-color-accent-cyan)";

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onCancel();
      }}
      className="m-auto w-[calc(100%-48px)] max-w-80 border-0 bg-transparent p-0 text-(--ds-color-text-default) backdrop:bg-(--ds-color-overlay-scrim)"
    >
      {/* The chamfer crops a border, so the edge is a plate the fill sits inside. */}
      <div
        className="p-px"
        style={{ clipPath: "var(--ds-clip-signal)", background: `color-mix(in srgb, ${edge} 50%, transparent)` }}
      >
        <div
          className="bg-(--ds-color-background-elevated)"
          style={{ clipPath: "var(--ds-clip-signal)" }}
        >
          <div className="px-5 pt-5 pb-3">
            <p
              className="flex items-center gap-2 font-(family-name:--ds-font-display) text-[length:var(--ds-size-p11)] font-black tracking-[0.25em]"
              style={{ color: accent }}
            >
              <WarningIcon size={14} aria-hidden="true" />
              {destructive ? "WARNING" : "CONFIRM"}
            </p>
            <h2
              id={titleId}
              className="mt-2.5 font-(family-name:--ds-font-display) text-sm font-black tracking-[0.09em] text-(--ds-color-text-default)"
            >
              {title.toUpperCase()}
            </h2>
            <p className="mt-2 text-xs leading-[1.45] text-(--ds-color-text-muted)">{message}</p>
          </div>

          <span aria-hidden className="block h-0.5 w-full bg-(image:--ds-gradient-hud-edge)" />

          <div className="grid h-12 grid-cols-[1fr_1px_1fr]">
            <DialogAction label={cancelLabel} color="var(--ds-color-text-muted)" onClick={onCancel} />
            <span aria-hidden className="bg-(--ds-color-border-subtle)" />
            <DialogAction ref={confirmRef} label={`${confirmLabel} >`} color={accent} onClick={onConfirm} />
          </div>
        </div>
      </div>
    </dialog>
  );
}

function DialogAction({
  ref,
  label,
  color,
  onClick,
}: {
  ref?: React.Ref<HTMLButtonElement>;
  label: string;
  color: string;
  onClick: () => void;
}) {
  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      className="grid place-items-center font-(family-name:--ds-font-display) text-[length:var(--ds-size-p11)] font-black tracking-[0.2em] hover:bg-(--ds-color-overlay-subtle) focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-current"
      style={{ color }}
    >
      {label.toUpperCase()}
    </button>
  );
}
