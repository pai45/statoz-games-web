import { useEffect, type ReactNode } from 'react'
import { ChevronLeft, X } from 'lucide-react'
import { getEngine } from '../game/engine/runtime'
import { emblemDataUrl } from '../game/world/textures'
import type { TeamInfo } from '../game/types'
import { store } from '../state/store'

export function cx(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(' ')
}

export function sfx(kind: 'click' | 'confirm' | 'levelUp' = 'click') {
  const a = getEngine()?.audio
  if (!a) return
  a.unlock()
  a[kind]()
}

export function haptic(ms = 12) {
  if (!store.get().settings.vibration) return
  try {
    navigator.vibrate?.(ms)
  } catch {
    /* unsupported */
  }
}

type BtnVariant = 'primary' | 'secondary' | 'ghost' | 'gold' | 'danger'

export function Button({
  children,
  onClick,
  variant = 'secondary',
  size = 'md',
  icon,
  disabled,
  className,
  type = 'button',
  sound = 'click',
  autoFocus,
}: {
  children?: ReactNode
  onClick?: () => void
  variant?: BtnVariant
  size?: 'sm' | 'md' | 'lg'
  icon?: ReactNode
  disabled?: boolean
  className?: string
  type?: 'button' | 'submit'
  sound?: 'click' | 'confirm' | null
  autoFocus?: boolean
}) {
  const styles: Record<BtnVariant, string> = {
    primary: 'bg-blaze text-white hover:bg-blaze-soft shadow-[0_8px_24px_-8px_rgba(255,91,20,0.7)]',
    secondary: 'bg-white/10 text-white hover:bg-white/18',
    ghost: 'bg-transparent text-white/80 hover:text-white hover:bg-white/8',
    gold: 'bg-gold text-ink-950 hover:brightness-110',
    danger: 'bg-bad/90 text-white hover:bg-bad',
  }
  const sizes = {
    sm: 'h-8 px-4 text-[13px]',
    md: 'h-11 px-6 text-[15px]',
    lg: 'h-13 px-8 text-lg',
  }
  return (
    <button
      type={type}
      autoFocus={autoFocus}
      disabled={disabled}
      onClick={() => {
        if (disabled) return
        if (sound) sfx(sound)
        haptic(8)
        onClick?.()
      }}
      className={cx(
        'clip-skew relative inline-flex items-center justify-center gap-2 font-display font-bold uppercase italic tracking-wide transition-[transform,background,filter] duration-150 active:scale-[0.97] disabled:opacity-35 disabled:active:scale-100',
        styles[variant],
        sizes[size],
        className,
      )}
    >
      {icon}
      {children}
    </button>
  )
}

export function IconButton({ onClick, label, children, className }: { onClick: () => void; label: string; children: ReactNode; className?: string }) {
  return (
    <button
      aria-label={label}
      title={label}
      onClick={() => {
        sfx()
        haptic(8)
        onClick()
      }}
      className={cx('grid size-10 place-items-center rounded-full bg-white/8 text-white/85 transition hover:bg-white/16 hover:text-white active:scale-95', className)}
    >
      {children}
    </button>
  )
}

export function ScreenHeader({ title, kicker, onBack, right }: { title: string; kicker?: string; onBack?: () => void; right?: ReactNode }) {
  return (
    <header className="safe-pad flex shrink-0 items-center gap-3 px-4 pt-[max(env(safe-area-inset-top),12px)] pb-2 sm:px-6">
      {onBack && (
        <IconButton onClick={onBack} label="Back">
          <ChevronLeft className="size-5" />
        </IconButton>
      )}
      <div className="min-w-0 flex-1">
        {kicker && <div className="font-display text-[11px] font-semibold uppercase tracking-[0.22em] text-blaze">{kicker}</div>}
        <h1 className="truncate font-display text-2xl font-black uppercase italic leading-none tracking-tight sm:text-3xl">{title}</h1>
      </div>
      {right}
    </header>
  )
}

export function Panel({ children, className, title, action }: { children: ReactNode; className?: string; title?: string; action?: ReactNode }) {
  return (
    <section className={cx('glass rounded-2xl p-4', className)}>
      {(title || action) && (
        <div className="mb-3 flex items-center justify-between gap-2">
          {title && <h2 className="font-display text-sm font-bold uppercase tracking-[0.16em] text-white/70">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </section>
  )
}

export function Emblem({ team, size = 44, className }: { team: Pick<TeamInfo, 'id' | 'abbr' | 'primary' | 'secondary' | 'name'>; size?: number; className?: string }) {
  return <img src={emblemDataUrl(team, 160)} width={size} height={size} alt={team.name} className={cx('shrink-0 drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]', className)} draggable={false} />
}

export function ovrColor(v: number) {
  if (v >= 90) return 'from-[#b06cff] to-[#5d2bd1]'
  if (v >= 85) return 'from-[#ffe08a] to-[#d99a1e]'
  if (v >= 78) return 'from-[#ffb36b] to-[#e0601a]'
  if (v >= 70) return 'from-[#9fd8ff] to-[#2f7fd1]'
  return 'from-[#c7ced8] to-[#6b7385]'
}

export function OvrBadge({ value, size = 'md', label = 'OVR' }: { value: number; size?: 'sm' | 'md' | 'lg'; label?: string }) {
  const dims = { sm: 'h-9 w-9 text-base', md: 'h-12 w-12 text-2xl', lg: 'h-16 w-16 text-[34px]' }[size]
  return (
    <div className={cx('relative grid shrink-0 place-items-center bg-gradient-to-br font-display font-black italic leading-none text-ink-950 [clip-path:polygon(50%_0,100%_25%,100%_75%,50%_100%,0_75%,0_25%)]', dims, ovrColor(value))}>
      <span className="-mt-1">{value}</span>
      <span className="absolute bottom-[14%] text-[8px] font-bold not-italic tracking-widest opacity-70">{label}</span>
    </div>
  )
}

export function RatingBar({ label, value, cap, boost = 0, compact }: { label: string; value: number; cap?: number; boost?: number; compact?: boolean }) {
  const color = value >= 85 ? 'bg-gold' : value >= 75 ? 'bg-blaze' : value >= 65 ? 'bg-sky' : 'bg-white/45'
  return (
    <div className={cx('grid items-center gap-3', compact ? 'grid-cols-[56px_1fr_28px]' : 'grid-cols-[minmax(84px,130px)_1fr_34px]')}>
      <span className={cx('truncate font-display font-semibold uppercase tracking-wide text-white/70', compact ? 'text-[11px]' : 'text-[13px]')}>{label}</span>
      <div className="relative h-2 overflow-hidden rounded-full bg-white/8">
        <div className={cx('absolute inset-y-0 left-0 rounded-full', color)} style={{ width: `${Math.min(100, value)}%` }} />
        {boost > 0 && <div className="absolute inset-y-0 rounded-r-full bg-good/70" style={{ left: `${value - boost}%`, width: `${boost}%` }} />}
        {cap !== undefined && <div className="absolute inset-y-[-2px] w-0.5 bg-white/70" style={{ left: `${cap}%` }} />}
      </div>
      <span className={cx('text-right font-display font-bold tabular-nums', compact ? 'text-sm' : 'text-base')}>{value}</span>
    </div>
  )
}

export function Segmented<T extends string | number>({ options, value, onChange, className }: { options: { value: T; label: string }[]; value: T; onChange: (v: T) => void; className?: string }) {
  return (
    <div className={cx('inline-flex rounded-xl bg-white/6 p-1', className)} role="radiogroup">
      {options.map((o) => (
        <button
          key={String(o.value)}
          role="radio"
          aria-checked={o.value === value}
          onClick={() => {
            sfx()
            onChange(o.value)
          }}
          className={cx(
            'h-9 min-w-0 flex-1 rounded-lg px-3 font-display text-[14px] font-bold uppercase tracking-wide transition',
            o.value === value ? 'bg-white text-ink-950 shadow' : 'text-white/65 hover:text-white',
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

export function Modal({ open, onClose, title, children, wide }: { open: boolean; onClose?: () => void; title?: string; children: ReactNode; wide?: boolean }) {
  useEffect(() => {
    if (!open || !onClose) return
    const h = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [open, onClose])
  if (!open) return null
  return (
    <div className="absolute inset-0 z-50 grid animate-fade place-items-center bg-black/65 p-3 backdrop-blur-sm" onClick={onClose}>
      <div
        className={cx('glass relative flex max-h-[92dvh] w-full animate-pop flex-col overflow-hidden rounded-2xl', wide ? 'max-w-3xl' : 'max-w-md')}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {(title || onClose) && (
          <div className="flex items-center justify-between gap-2 border-b border-white/8 px-5 py-3">
            <h2 className="font-display text-xl font-black uppercase italic">{title}</h2>
            {onClose && (
              <button aria-label="Close" onClick={onClose} className="grid size-8 place-items-center rounded-full text-white/60 hover:bg-white/10 hover:text-white">
                <X className="size-4" />
              </button>
            )}
          </div>
        )}
        <div className="scrollbar-thin min-h-0 flex-1 overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  )
}

export function Stat({ label, value, sub, accent }: { label: string; value: ReactNode; sub?: string; accent?: boolean }) {
  return (
    <div className="min-w-0">
      <div className="font-display text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">{label}</div>
      <div className={cx('font-display text-2xl font-black italic leading-tight tabular-nums', accent && 'text-blaze')}>{value}</div>
      {sub && <div className="text-[11px] text-white/45">{sub}</div>}
    </div>
  )
}

export function Pill({ children, tone = 'default', className }: { children: ReactNode; tone?: 'default' | 'blaze' | 'gold' | 'good' | 'bad'; className?: string }) {
  const tones = {
    default: 'bg-white/10 text-white/80',
    blaze: 'bg-blaze/20 text-blaze-soft',
    gold: 'bg-gold/18 text-gold',
    good: 'bg-good/18 text-good',
    bad: 'bg-bad/18 text-bad',
  }
  return <span className={cx('inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-display text-[11px] font-bold uppercase tracking-wider', tones[tone], className)}>{children}</span>
}

export function Arrows({ onPrev, onNext, children }: { onPrev: () => void; onNext: () => void; children: ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <IconButton onClick={onPrev} label="Previous" className="size-9">
        <ChevronLeft className="size-4" />
      </IconButton>
      <div className="min-w-0 flex-1">{children}</div>
      <IconButton onClick={onNext} label="Next" className="size-9">
        <ChevronLeft className="size-4 rotate-180" />
      </IconButton>
    </div>
  )
}

export function formatNum(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 10_000) return `${Math.round(n / 1000)}K`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
  return String(n)
}
