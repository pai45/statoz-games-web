"use client";
import Image from "next/image";
import { publicAsset } from "@/shared/config";
import { accentVar, HudPanel } from "@/design-system";
import { useAuthSession, useRequireAuth } from "@/features/auth";
import type { GameEntry } from "@/mocks/games";
import type { GameId } from "../types";
import styles from "./discovery-card.module.css";

export type DiscoveryGameTileProps={game:GameId;entry:GameEntry;landscape?:boolean;streak?:number};
export function DiscoveryGameTile({game,entry}:DiscoveryGameTileProps) {
  const session=useAuthSession(),requireAuth=useRequireAuth();
  const authenticated=session.status==="authenticated";
  return <HudPanel accent={accentVar(entry.accent)} className={styles.panel}
    href={authenticated?entry.href:undefined}
    onClick={authenticated?undefined:()=>requireAuth({intent:"play",message:`Log in to play ${entry.title} and save your progress.`,returnTo:entry.href})}
    label={`Play ${entry.title}`}>
    <div className={styles.body}>
      <div className={styles.art}><Image src={publicAsset(`/assets/games/covers/${game}.webp`)} alt="" fill sizes="(min-width: 1024px) 33vw, 50vw" unoptimized className={styles.coverImage}/></div>
      <div className={styles.rail}><span>{entry.title}</span><svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="M2 10h15M11 4l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.6"/></svg></div>
    </div>
  </HudPanel>;
}
