"use client";

import type { CSSProperties } from "react";

import { hubBackgrounds, type HubBackgroundTheme } from "../../../tokens/hub-backgrounds.generated";
import styles from "./hub-backdrop.module.css";
import presentation from "./presentation.module.css";

export type HubBackdropProps = {
  theme: HubBackgroundTheme;
  /** Already includes the hosting base path. No route knowledge belongs here. */
  assetRoot: string;
};

/** Six preloaded local layers crossfade without remounting or moving the feed. */
export function HubBackdrop({ theme, assetRoot }: HubBackdropProps) {
  return (
    <div aria-hidden="true" data-hub-background={theme} className={`${styles.backdrop} ${presentation.presentation}`}>
      {(Object.keys(hubBackgrounds.themes) as HubBackgroundTheme[]).map((name) => (
        <div key={name} data-hub-layer={name} data-active={theme === name} className={styles.artwork} style={{
          "--hub-portrait": `url("${assetRoot}/${name}-portrait.svg")`,
          "--hub-wide": `url("${assetRoot}/${name}-wide.svg")`,
        } as CSSProperties} />
      ))}
      <div data-hub-overlay className={`${styles.veil} ${presentation.veil}`} />
    </div>
  );
}
