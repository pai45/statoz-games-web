"use client";

import { useState } from "react";
import localFont from "next/font/local";
import type { PackRevealData } from "@/features/packs";
import styles from "./pitch-duel.module.css";

const pixelFont = localFont({ src: "./PixelifySans.ttf", display: "swap" });

/** The first football pack uses the same owned IDs as other modes, in Pitch Duel's art direction. */
export function PitchDuelStarterPack({ reveal, onComplete }: { reveal: PackRevealData; onComplete: () => void }) {
  const [opened, setOpened] = useState(false);
  return <main className={`${styles.shell} ${styles.packScreen} ${pixelFont.className}`} aria-label="Pitch Duel starter pack">
    <div className={styles.top}><span className={styles.brand}>⚽ PITCH DUEL</span><span className={styles.topRight}>NEW CLUB / STARTER PACK</span></div>
    {!opened ? <div className={styles.packIntro}><div><small>WELCOME TO YOUR CLUB</small><h1>EVERY CLUB<br/>STARTS HERE.</h1><p>Your first five players and tactics are ready. Open the pack to see your squad.</p><button className={styles.primary} onClick={() => setOpened(true)}>OPEN PACK →</button></div><div className={styles.packArt} aria-hidden="true"><b>PD</b><span>STARTER<br/>XI</span><i>★</i></div></div> : <div className={styles.packOpened}><header><small>YOUR FIRST CLUB</small><h1>THE CARDS ARE YOURS.</h1><p>{reveal.playerCards.length} players · {reveal.actionCards.length} tactics · your club deck will be completed to eight tactics.</p></header><div className={styles.packCards}><div><h2>YOUR FIVE</h2><div>{reveal.playerCards.map(c => <article key={c.id}><strong>{c.rating}</strong><b>{c.shortName}</b><small>{c.role.toUpperCase()} · {c.tier.toUpperCase()}</small></article>)}</div></div><div><h2>TACTIC STARTERS</h2><div>{reveal.actionCards.map(c => <article key={c.id}><strong>+{c.power}</strong><b>{c.title}</b><small>{c.category.toUpperCase()} · {c.tier.toUpperCase()}</small></article>)}</div></div></div><button className={styles.primary} onClick={onComplete}>BUILD MY CLUB →</button></div>}
  </main>;
}
