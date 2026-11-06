// Inline icon set (stroke-based, 24px grid) so the UI has no external icon dependency.
import type { ReactNode, SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

function Icon({ size = 18, children, ...rest }: IconProps & { children: ReactNode }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="square" aria-hidden {...rest}>
      {children}
    </svg>
  )
}

export const IconCrosshair = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="7.5" />
    <path d="M12 2v5M12 17v5M2 12h5M17 12h5" />
  </Icon>
)

export const IconStar = ({ filled, ...p }: IconProps & { filled?: boolean }) => (
  <Icon {...p} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3.2l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.1-5.4 3.1 1.3-6-4.6-4.1 6.1-.6z" fill={filled ? 'currentColor' : 'none'} />
  </Icon>
)

export const IconLock = (p: IconProps) => (
  <Icon {...p}>
    <rect x="5" y="11" width="14" height="9" />
    <path d="M8 11V8a4 4 0 018 0v3" />
  </Icon>
)

export const IconCheck = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4.5 12.5l5 5 10-11" />
  </Icon>
)

export const IconClose = (p: IconProps) => (
  <Icon {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </Icon>
)

export const IconBack = (p: IconProps) => (
  <Icon {...p}>
    <path d="M14.5 5.5L8 12l6.5 6.5" />
  </Icon>
)

export const IconArrow = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 20V4M6 10l6-6 6 6" />
  </Icon>
)

export const IconSun = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8" />
  </Icon>
)

export const IconHorizon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3 17h18M6.5 17a5.5 5.5 0 0111 0M12 6.5V9M5 10.5l1.6 1.6M19 10.5l-1.6 1.6" />
  </Icon>
)

export const IconMoon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M19 14.5A7.5 7.5 0 019.5 5a7.5 7.5 0 109.5 9.5z" />
  </Icon>
)

export const IconCloud = (p: IconProps) => (
  <Icon {...p}>
    <path d="M7 18h10.5a3.5 3.5 0 00.4-7A5.5 5.5 0 007.3 9.6 4.2 4.2 0 007 18z" />
  </Icon>
)

export const IconWind = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3 9h11a3 3 0 10-3-3M3 15h15a3 3 0 11-3 3M3 12h7" />
  </Icon>
)

export const IconTarget = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <circle cx="12" cy="12" r="4.5" />
    <circle cx="12" cy="12" r="0.6" fill="currentColor" />
  </Icon>
)

export const IconRifle = (p: IconProps) => (
  <Icon {...p} viewBox="0 0 48 24">
    <path d="M2 13h7l3-2h14l2-2h6v2h12v2H34l-2 2h-6l-1 4h-4l1-4h-6l-6 4H3z" fill="currentColor" stroke="none" />
    <rect x="18" y="6.5" width="12" height="2.6" rx="1" fill="currentColor" stroke="none" />
  </Icon>
)

export const IconMedal = (p: IconProps) => (
  <Icon {...p}>
    <path d="M8 3l2.5 6M16 3l-2.5 6" />
    <circle cx="12" cy="15" r="5.5" />
    <path d="M12 12.2l.9 1.8 2 .3-1.4 1.4.3 2-1.8-1-1.8 1 .3-2-1.4-1.4 2-.3z" fill="currentColor" stroke="none" />
  </Icon>
)

export const IconGear = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="3.2" />
    <path d="M12 2.8v2.6M12 18.6v2.6M21.2 12h-2.6M5.4 12H2.8M18.5 5.5l-1.8 1.8M7.3 16.7l-1.8 1.8M18.5 18.5l-1.8-1.8M7.3 7.3L5.5 5.5" />
  </Icon>
)

export const IconShield = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 3l7.5 3v6c0 4.4-3.2 7.8-7.5 9-4.3-1.2-7.5-4.6-7.5-9V6z" />
  </Icon>
)

export const IconEye = (p: IconProps) => (
  <Icon {...p}>
    <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
    <circle cx="12" cy="12" r="3" />
  </Icon>
)

export const IconClock = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7v5.5l3.5 2" />
  </Icon>
)

export const IconPin = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0113 0c0 5.4-6.5 11-6.5 11z" />
    <circle cx="12" cy="10" r="2.2" />
  </Icon>
)

export const IconVolume = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4z" />
    <path d="M15.5 9a4 4 0 010 6M18 6.5a7.5 7.5 0 010 11" />
  </Icon>
)
