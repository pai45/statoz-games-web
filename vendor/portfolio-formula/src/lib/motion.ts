import type { MotionProps, Transition, Variants } from "motion/react"

export const EASE_OUT: Transition["ease"] = [0.16, 1, 0.3, 1]

/** Rise-and-fade used for staggered copy reveals. */
export const reveal: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE_OUT } },
}

export function stagger(step = 0.08, delay = 0): Variants {
  return {
    hidden: {},
    show: { transition: { staggerChildren: step, delayChildren: delay } },
  }
}

/**
 * Cards that share one slot on a stage: the outgoing card clears quickly,
 * then the incoming one glides in (from the left beside its subject, up from
 * the bottom when docked), so two cards never sit on top of each other. The
 * incoming card settles about when the camera arrives at its subject.
 */
export function stageCard(active: boolean, dock: boolean): MotionProps {
  return {
    initial: false,
    animate: active
      ? { opacity: 1, x: 0, y: 0 }
      : { opacity: 0, x: dock ? 0 : -20, y: dock ? 14 : 0 },
    transition: active
      ? { duration: 0.85, delay: 0.3, ease: EASE_OUT }
      : { duration: 0.24, ease: "easeIn" },
  }
}
