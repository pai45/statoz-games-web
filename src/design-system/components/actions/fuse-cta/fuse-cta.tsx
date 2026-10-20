"use client";

import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { FlameIcon, ChevronRightIcon } from "../../../icons";
import { glow } from "../../../tokens/elevation";
import styles from "./fuse-cta.module.css";

/** Web counterpart of Flutter's CyberFuseCtaButton. A timer is optional. */
export function FuseCta({ label, helper, icon = <FlameIcon size={30} />, disabled = false, pending = false, href, onClick, fuse }: {
  label: string;
  helper?: string;
  icon?: ReactNode;
  disabled?: boolean;
  pending?: boolean;
  href?: string;
  onClick?: () => void;
  /** Real remaining time, 0..1. Omit for an untimed launch action. */
  fuse?: number;
}) {
  const blocked = disabled || pending;
  const remaining = fuse === undefined ? undefined : Math.max(0, Math.min(1, fuse));
  const content = <>
    <span className={styles.core} aria-hidden="true">{icon}</span>
    <span className={styles.copy}><strong>{label}</strong>{helper && <small>{helper}</small>}</span>
    <span className={styles.chase} aria-hidden="true"><ChevronRightIcon size={24}/><ChevronRightIcon size={24}/><ChevronRightIcon size={24}/></span>
    {remaining !== undefined && <span className={styles.fuse} role="meter" aria-label="Time remaining" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(remaining * 100)} style={{ "--fuse": remaining } as CSSProperties}><i/></span>}
  </>;
  const props = { className: styles.action, style: { boxShadow: blocked ? undefined : glow("var(--ds-color-accent-cyan)", { alpha: .24, blur: 24 }) }, "aria-label": label, "aria-busy": pending || undefined };
  return href && !blocked ? <Link {...props} href={href}>{content}</Link> : <button {...props} type="button" disabled={blocked} onClick={onClick}>{content}</button>;
}
