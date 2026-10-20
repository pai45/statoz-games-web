import type { CSSProperties } from "react";

export type StepMeterProps = {
  /** How many steps the flow has. */
  total: number;
  /** Zero-based index of the step the player is on. */
  active: number;
  /** Accessible name for the meter, e.g. "Profile setup progress". */
  label: string;
  className?: string;
};

/**
 * A paginated flow's position, as a row of flat segments: green behind the
 * player, amber where they are, slate ahead. Only the current segment glows,
 * so the row has exactly one live element.
 */
export function StepMeter({ total, active, label, className }: StepMeterProps) {
  const clamped = Math.min(Math.max(active, 0), total - 1);

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={clamped + 1}
      aria-valuetext={`Step ${clamped + 1} of ${total}`}
      className={["flex w-full gap-2", className ?? ""].filter(Boolean).join(" ")}
    >
      {Array.from({ length: total }, (_, index) => {
        const passed = index < clamped;
        const current = index === clamped;

        const style: CSSProperties = current
          ? {
              background: "var(--ds-gradient-step-current)",
              boxShadow:
                "0 0 8px 0 color-mix(in srgb, var(--ds-color-accent-orange) 35%, transparent)",
            }
          : passed
            ? { background: "var(--ds-gradient-step-passed)" }
            : { background: "var(--ds-color-border-default)" };

        return (
          <span
            key={index}
            aria-hidden
            className="h-2 flex-1 transition-[background,box-shadow] duration-200"
            style={style}
          />
        );
      })}
    </div>
  );
}
