import type { ReactNode } from 'react';
import styles from './screen.module.css';

/** Also works in a standalone iPhone browser where orientation locking is unavailable. */
export function Landscape({children}:{children:ReactNode}) {
  return <div className={styles.landscapeRoot}><div className={styles.landscapeSurface} data-cup-landscape>{children}</div></div>;
}
