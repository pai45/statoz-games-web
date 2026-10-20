import type { ButtonHTMLAttributes, CSSProperties, HTMLAttributes, ReactNode } from 'react';
import tokens from '../../../tokens/match-discovery.module.css';
import { discoveryLifecycleText, discoveryTimingText } from './presentation';
import styles from './discovery-card.module.css';

const classes = (...names: Array<string | undefined>) => names.filter(Boolean).join(' ');

/** Use on a native/Next anchor or button to preserve the correct root semantics. */
export const discoveryPlateClass = classes(styles.plate, tokens.editorialTokens);

export function DiscoveryChrome() {
  return <span className={styles.chrome} data-editorial-chrome aria-hidden>
    <span className={styles.signalRail} data-reveal-rail />
  </span>;
}

export type DiscoveryPlateProps = HTMLAttributes<HTMLDivElement> & { accent?: string; quiet?: boolean };
/** Static specimen/container. Navigation adapters use discoveryPlateClass directly. */
export function DiscoveryPlate({ accent, quiet, className, style, children, ...props }: DiscoveryPlateProps) {
  return <div {...props} className={classes(discoveryPlateClass, className)}
    style={{ ...(accent ? { '--sport-accent': accent } : {}), ...style } as CSSProperties}
    data-quiet={quiet || undefined}>
    <DiscoveryChrome />{children}
  </div>;
}

export type DiscoveryStatusProps = {
  label: string; status?: string; timing?: string; liveContext?: string;
  marker?: ReactNode; style?: CSSProperties; showMarker?: boolean;
};
export function DiscoveryStatus({ label, status, timing, liveContext, marker, style, showMarker = true }: DiscoveryStatusProps) {
  const text = discoveryLifecycleText(status, liveContext);
  const context = discoveryTimingText(status, timing);
  return <div className={styles.statusArea} style={style} data-discovery-status data-markerless={!showMarker || undefined}>
    {showMarker && <span className={styles.marker}>{marker ?? <span className={styles.signal} aria-hidden />}<span>{label}</span></span>}
    {status && <>
      <span className={styles.tag} data-status={status}>{text}</span>
      <span className={styles.tagSlot} aria-hidden>{text}</span>
    </>}
    {context && <span className={styles.timing}>{context}</span>}
  </div>;
}

export type DiscoveryOutcomeRowProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  label: string; percentage: number; fill: string; ink: string;
};
export function DiscoveryOutcomeRow({ label, percentage, fill, ink, className, style, ...props }: DiscoveryOutcomeRowProps) {
  return <button {...props} type="button" className={classes(styles.outcome, className)}
    style={{ '--outcome-fill': fill, ...style } as CSSProperties}>
    <span>{label}</span>
    <span className={styles.priceBadge} style={{ '--outcome-ink': ink } as CSSProperties}>{percentage}%</span>
  </button>;
}

export function DiscoveryVersus({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return <span {...props} className={classes(styles.versus, className)} data-discovery-versus>VS</span>;
}

export function DiscoveryTeamName({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return <span {...props} className={classes(styles.name, className)} />;
}

/** The feature supplies genuine counts and its accessible progress label. */
export function DiscoveryQuestionProgress({ answered, total }: { answered: number; total: number }) {
  return <div className={styles.questionSteps} aria-hidden>
    {Array.from({ length: Math.max(0, total) }, (_, index) => <span key={index} data-complete={index < answered || undefined} />)}
  </div>;
}
