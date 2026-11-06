import type { ReactNode } from "react";

import styles from "./page-search-header.module.css";

export function PageSearchHeader({ title, titleId, heading: Heading = "h1", children }: {
  title: string;
  titleId?: string;
  heading?: "h1" | "h2";
  children: ReactNode;
}) {
  return <header className={styles.header} data-page-search-header>
    <Heading id={titleId} className={styles.title}>{title}</Heading>
    <div className={styles.search}>{children}</div>
  </header>;
}
