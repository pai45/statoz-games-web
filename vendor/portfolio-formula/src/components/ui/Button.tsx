import type {
  AnchorHTMLAttributes,
  ComponentPropsWithRef,
  ReactNode,
} from "react"
import { Link, type LinkProps } from "react-router"
import { cn } from "@/lib/cn"

type Variant = "primary" | "secondary" | "quiet"
type Size = "md" | "sm"

const base =
  "group inline-flex shrink-0 items-center gap-2.5 rounded-[3px] font-mono font-medium uppercase tracking-[0.14em] transition-[background-color,color,border-color,box-shadow] duration-200 ease-out"
const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-[12px]",
  sm: "h-9 px-4 text-[11px]",
}
const variants: Record<Variant, string> = {
  primary:
    "bg-paper text-ink hover:bg-white hover:shadow-[0_0_0_4px_rgba(243,241,236,0.12)]",
  secondary:
    "border border-white/20 text-paper hover:border-white/45 hover:bg-white/[0.06]",
  quiet: "text-mute hover:text-paper",
}

export function buttonClass(
  variant: Variant = "primary",
  size: Size = "md",
  className?: string,
) {
  return cn(base, sizes[size], variants[variant], className)
}

type Common = {
  variant?: Variant
  size?: Size
  className?: string
  children: ReactNode
}

export function ButtonLink({
  variant,
  size,
  className,
  ...props
}: Common & LinkProps) {
  return <Link {...props} className={buttonClass(variant, size, className)} />
}

export function ButtonAnchor({
  variant,
  size,
  className,
  ...props
}: Common & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a {...props} className={buttonClass(variant, size, className)} />
}

export function Button({
  variant,
  size,
  className,
  ...props
}: Common & ComponentPropsWithRef<"button">) {
  return (
    <button
      type="button"
      {...props}
      className={buttonClass(variant, size, className)}
    />
  )
}

/** Small arrow that nudges in the direction of travel on hover. */
export function Nudge({
  children,
  direction = "right",
}: {
  children: ReactNode
  direction?: "right" | "up" | "down" | "left"
}) {
  const move = {
    right: "group-hover:translate-x-0.5",
    left: "group-hover:-translate-x-0.5",
    up: "group-hover:-translate-y-0.5 group-hover:translate-x-0.5",
    down: "group-hover:translate-y-0.5",
  }[direction]
  return (
    <span
      className={cn(
        "inline-flex transition-transform duration-200 ease-out",
        move,
      )}
    >
      {children}
    </span>
  )
}
