import type { KeyboardEvent, ReactNode } from "react"
import { cn } from "@/lib/cn"

/** Roving-focus radio group (arrow keys move and select), styled as a segmented control. */
export function Segmented<T extends string | number>({
  label,
  value,
  options,
  onChange,
  className,
}: {
  label: string
  value: T
  options: {
    value: T
    label: ReactNode
  }[]
  onChange: (value: T) => void
  className?: string
}) {
  const index = options.findIndex((o) => o.value === value)
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const step =
      e.key === "ArrowRight" || e.key === "ArrowDown"
        ? 1
        : e.key === "ArrowLeft" || e.key === "ArrowUp"
          ? -1
          : 0
    if (!step) return
    e.preventDefault()
    const next = options[(index + step + options.length) % options.length]
    onChange(next.value)
    const buttons =
      e.currentTarget.querySelectorAll<HTMLButtonElement>("[role=radio]")
    buttons[(index + step + options.length) % options.length]?.focus()
  }
  return (
    <div className={cn("flex items-center justify-between gap-3", className)}>
      <span className="eyebrow text-[10px] text-dim" id={`seg-${label}`}>
        {label}
      </span>
      <div
        role="radiogroup"
        aria-labelledby={`seg-${label}`}
        onKeyDown={onKeyDown}
        className="flex rounded-[4px] border border-white/12 bg-white/[0.03] p-0.5"
      >
        {options.map((o) => {
          const on = o.value === value
          return (
            <button
              key={String(o.value)}
              type="button"
              role="radio"
              aria-checked={on}
              tabIndex={on ? 0 : -1}
              onClick={() => onChange(o.value)}
              className={cn(
                "h-8 min-w-11 rounded-[3px] px-3 font-mono text-[11px] font-medium tracking-[0.08em] uppercase transition-colors duration-150 focus-visible:outline-offset-[-2px]",
                on ? "bg-paper text-ink" : "text-mute hover:text-paper",
              )}
            >
              {o.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

/** Compact on/off switch with a label and optional hint. */
export function Toggle({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string
  hint?: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="group flex w-full items-center justify-between gap-3 text-left"
    >
      <span className="min-w-0">
        <span className="eyebrow block text-[10px] text-dim">{label}</span>
        {hint && (
          <span className="mt-0.5 block truncate text-[12px] text-paper/60">
            {hint}
          </span>
        )}
      </span>
      <span
        aria-hidden="true"
        className={cn(
          "relative h-5 w-9 shrink-0 rounded-full border transition-colors duration-200",
          checked ? "border-paper bg-paper" : "border-white/25 bg-white/[0.04]",
        )}
      >
        <span
          className={cn(
            "absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full transition-[left,background-color] duration-200",
            checked ? "left-[18px] bg-ink" : "left-[2px] bg-mute",
          )}
        />
      </span>
    </button>
  )
}

/** Keyboard key glyph. */
export function Key({ children }: { children: ReactNode }) {
  return (
    <kbd className="inline-grid h-6 min-w-6 place-items-center rounded-[3px] border border-white/20 bg-white/[0.05] px-1.5 font-mono text-[10px] leading-none font-semibold text-paper shadow-[inset_0_-1px_0_rgba(255,255,255,0.08)]">
      {children}
    </kbd>
  )
}
