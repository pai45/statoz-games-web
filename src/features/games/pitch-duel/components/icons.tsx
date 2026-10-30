/** Pitch Duel's small line icons. Original drawings, `currentColor` throughout. */

type IconProps = { size?: number };

export function CoinIcon({ size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <circle cx="12" cy="12" r="9" fill="#fbbf24" stroke="#b45309" strokeWidth="2" />
      <path d="M9 9.5h4.5a1.8 1.8 0 010 3.6H10.5a1.8 1.8 0 000 3.6H15M12 7.5v1.8M12 16.7v1.8" fill="none" stroke="#7c2d12" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function FlameIcon({ size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <path d="M12 2c1 4 5 5.5 5 11a5 5 0 01-10 0c0-2.7 1.4-4.2 2.5-5.2.2 1.8 1 2.7 2 3.2C11 8 10.5 5 12 2z" fill="#fb923c" stroke="#ea580c" strokeWidth="1.2" />
    </svg>
  );
}

export function PitchIcon({ size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <rect x="5" y="2.5" width="14" height="19" rx="1" />
      <path d="M5 12h14" />
      <circle cx="12" cy="12" r="2.6" />
      <path d="M9.5 2.5v2.5h5V2.5M9.5 21.5V19h5v2.5" />
    </svg>
  );
}

export function ChevronsIcon({ size = 18, back }: IconProps & { back?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden style={back ? { transform: "scaleX(-1)" } : undefined}>
      <path d="M5 6l6 6-6 6M13 6l6 6-6 6" />
    </svg>
  );
}

export function BallIcon({ size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <circle cx="12" cy="12" r="10" fill="#f8fafc" stroke="#0f172a" strokeWidth="1.4" />
      <path d="M12 7.2l3.4 2.5-1.3 4h-4.2l-1.3-4z" fill="#0f172a" />
      <path d="M12 2.4v4.8M15.4 9.7l4.4-1.6M14.1 13.7l2.8 3.9M9.9 13.7l-2.8 3.9M8.6 9.7L4.2 8.1" stroke="#0f172a" strokeWidth="1.2" />
    </svg>
  );
}

export function LogIcon({ size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
      <path d="M4 6h16M4 12h16M4 18h10" />
    </svg>
  );
}

export function CloseIcon({ size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function StarIcon({ size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <path d="M12 2.5l2.9 6 6.6.8-4.9 4.5 1.3 6.5L12 17l-5.9 3.3 1.3-6.5-4.9-4.5 6.6-.8z" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
    </svg>
  );
}

export function SwapIcon({ size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 8h14l-3-3M20 16H6l3 3" />
    </svg>
  );
}
