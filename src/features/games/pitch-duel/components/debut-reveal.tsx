"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";

import type { PlayerCard } from "@/domain/cards";

import { usePrefersReducedMotion } from "../../shared/state/use-reduced-motion";
import { revealOrder, squadOvr, type DebutSquad } from "../engine/debut";
import { formations } from "../engine/lineup";
import { deriveStats } from "../engine/stats";

import { useSound } from "./audio";
import { DuelCard } from "./card-art";
import { BallIcon } from "./icons";
import { nationColours, nationStripes, placeName } from "./nations";
import { keeperAt, placeSpot } from "./pitch-layout";
import { Pill, SoundToggle } from "./ui";
import styles from "./debut.module.css";

type Stage = "pack" | "open" | "reveal" | "squad";
type Beat = "build" | "nation" | "place" | "card" | "dock";
type Kind = "quick" | "star" | "walkout";

const tierRank: Record<PlayerCard["tier"], number> = { bronze: 0, silver: 1, gold: 2, platinum: 3 };
const tierColour: Record<PlayerCard["tier"], string> = { bronze: "#cd7f32", silver: "#cbd5e1", gold: "#fdc700", platinum: "#5cdfff" };

/** The beats each kind of signing plays, and how long each holds unless tapped on. */
const script: Record<Kind, [Beat, number][]> = {
  quick: [["card", 1150], ["dock", 380]],
  star: [["build", 800], ["card", 1800], ["dock", 400]],
  walkout: [["build", 1300], ["nation", 1500], ["place", 1500], ["card", 3600], ["dock", 450]],
};

/** Eighteen sparks around a circle, a little uneven so the burst looks thrown. */
const sparks = Array.from({ length: 18 }, (_, i) => ({ a: i * 20 + ((i * 37) % 11), d: 6 + ((i * 53) % 5), s: 0.6 + ((i * 29) % 5) / 10 }));

export type DebutExit = "play" | "home";

/**
 * Signing day: the first-time player's eleven, revealed one card at a time
 * like a pack opening. The pack tears open, the squad players deal in lowest
 * rated first, the stars get a short build-up, and the marquee signing gets
 * the full walkout (nation, position, then the card). Each signing then takes
 * its place on the pitch at the side. Tap to speed up; SKIP jumps to the XI.
 */
export function DebutReveal({
  squad,
  cardFor,
  replay,
  onDone,
}: {
  squad: DebutSquad;
  cardFor: (id: string) => PlayerCard | undefined;
  /** Watching it again: nothing is granted, and the finale has one button. */
  replay?: boolean;
  onDone: (exit: DebutExit) => void;
}) {
  const sound = useSound();
  const reduced = usePrefersReducedMotion();
  const rating = useCallback((id: string) => cardFor(id)?.rating ?? 0, [cardFor]);
  const order = useMemo(() => revealOrder(squad, rating), [squad, rating]);
  const places = useMemo(() => {
    const slots = formations[squad.formation].slots;
    return [
      { id: squad.keeperId, pos: "GK", ...placeSpot(keeperAt) },
      ...squad.outfield.map((id, i) => ({ id, pos: slots[i].pos as string, ...placeSpot(slots[i].at) })),
    ];
  }, [squad]);
  const posOf = (id: string) => places.find((p) => p.id === id)?.pos ?? "";

  const [stage, setStage] = useState<Stage>("pack");
  const [index, setIndex] = useState(0);
  const [step, setStep] = useState(0);

  const id = order[Math.min(index, order.length - 1)];
  const card = cardFor(id);
  const kind: Kind = id === squad.marqueeId ? "walkout" : card && card.rating >= 82 ? "star" : "quick";
  const beats = script[kind];
  const beat: Beat = beats[Math.min(step, beats.length - 1)][0];

  const advance = useCallback(() => {
    if (stage === "pack") {
      setStage("open");
      return;
    }
    if (stage !== "reveal") return;
    if (step < beats.length - 1) {
      setStep(step + 1);
      return;
    }
    if (index < order.length - 1) {
      setIndex(index + 1);
      setStep(0);
      return;
    }
    setStage("squad");
  }, [stage, step, beats.length, index, order.length]);

  const skip = useCallback(() => {
    setIndex(order.length - 1);
    setStage("squad");
  }, [order.length]);

  // Each beat holds for its time, then moves on by itself.
  const speed = reduced ? 0.55 : 1;
  useEffect(() => {
    if (stage === "open") {
      const t = setTimeout(() => setStage("reveal"), reduced ? 600 : 1500);
      return () => clearTimeout(t);
    }
    if (stage !== "reveal") return;
    const t = setTimeout(advance, beats[step][1] * speed);
    return () => clearTimeout(t);
  }, [stage, step, index, beats, speed, advance, reduced]);

  // Sound for each beat as it starts.
  const tier = card ? tierRank[card.tier] : 0;
  useEffect(() => {
    if (stage === "pack") {
      sound.crowd(0.45);
      return;
    }
    if (stage === "open") {
      sound.riser(1.1);
      sound.chant(0.6);
      const t = setTimeout(() => sound.boom(1), reduced ? 300 : 1100);
      return () => clearTimeout(t);
    }
    if (stage === "squad") {
      sound.chant(0.9);
      sound.sting("win");
      sound.swell(0.4);
      return;
    }
    if (beat === "build") {
      sound.riser(kind === "walkout" ? 1.2 : 0.7);
      if (kind === "walkout") sound.chant(1);
    } else if (beat === "nation" || beat === "place") sound.boom(0);
    else if (beat === "card") {
      if (kind === "quick") {
        sound.whoosh();
        sound.flip();
      } else {
        sound.boom(tier);
        sound.swell(kind === "walkout" ? 0.55 : 0.3);
      }
    } else if (beat === "dock") sound.whoosh(false);
  }, [stage, index, beat, kind, tier, sound, reduced]);

  // Keyboard: Enter or Space moves on, Escape skips to the eleven.
  const latest = useRef({ advance, skip, stage });
  useEffect(() => {
    latest.current = { advance, skip, stage };
  });
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const { advance: next, skip: jump, stage: now } = latest.current;
      if (now === "squad") return;
      if (event.key === "Escape") jump();
      else if ((event.key === "Enter" || event.key === " ") && !(event.target instanceof HTMLButtonElement)) {
        event.preventDefault();
        next();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const docked = new Set(stage === "squad" ? order : order.slice(0, index + (beat === "dock" ? 1 : 0)));
  const walkout = stage === "reveal" && kind === "walkout" && beat !== "dock";
  const signed = stage === "squad" ? order.length : docked.size;

  return (
    <div
      className={styles.debut}
      data-stage={stage}
      data-walkout={walkout || undefined}
      style={{ "--tier": card ? tierColour[card.tier] : "#a855f7" } as CSSProperties}
      aria-label="Signing day: your debut eleven"
    >
      <div className={styles.backdrop} aria-hidden>
        <i className={styles.lightL} />
        <i className={styles.lightR} />
        <i className={styles.crowd} />
        <i className={styles.floor} />
      </div>

      <header className={styles.head}>
        <span className={styles.titleBlock}>
          <small>SIGNING DAY</small>
          <b>YOUR DEBUT XI</b>
        </span>
        <ol className={styles.pips} aria-label={`${signed} of ${order.length} signed`}>
          {order.map((pid, i) => (
            <li key={pid} data-on={docked.has(pid) || undefined} data-now={(stage === "reveal" && i === index) || undefined} />
          ))}
        </ol>
        <span className={styles.headTools}>
          <SoundToggle />
          {stage !== "squad" ? (
            <button type="button" className={styles.skip} onClick={skip} data-pitch-duel-option="debut-skip">
              SKIP ▸▸
            </button>
          ) : null}
        </span>
      </header>

      <div className={styles.body}>
        {stage === "pack" || stage === "open" ? (
          <button
            type="button"
            className={styles.packZone}
            onClick={advance}
            disabled={stage === "open"}
            data-pitch-duel-option="debut-open"
            aria-label="Open your debut pack"
          >
            <span className={styles.packGlow} aria-hidden />
            <span className={styles.pack} data-open={stage === "open" || undefined} aria-hidden>
              <span className={styles.packTop}>
                <i />
              </span>
              <span className={styles.packBody}>
                <span className={styles.packFoil} />
                <span className={styles.packBadge}>
                  <BallIcon size={34} />
                </span>
                <b>FOT DUEL</b>
                <strong>DEBUT XI</strong>
                <small>11 PLAYERS · 1 MARQUEE</small>
              </span>
            </span>
            {stage === "open" ? <span className={styles.flash} aria-hidden /> : null}
            <span className={styles.packHint}>{stage === "pack" ? "TAP TO OPEN" : "OPENING…"}</span>
          </button>
        ) : (
          <>
            {stage === "reveal" && card ? (
              <button type="button" className={styles.spot} onClick={advance} data-beat={beat} data-kind={kind} data-pitch-duel-option="debut-next" aria-label="Next signing">
                <span className={styles.beams} aria-hidden>
                  <i />
                  <i />
                  <i />
                </span>
                <span className={styles.flare} aria-hidden />

                {beat === "build" ? (
                  <span key={`b${index}`} className={styles.build}>
                    <small>{kind === "walkout" ? "HERE HE COMES" : "INCOMING"}</small>
                    <b>{kind === "walkout" ? "MARQUEE SIGNING" : "STAR SIGNING"}</b>
                  </span>
                ) : null}

                {beat === "nation" ? (
                  <span key={`n${index}`} className={styles.nation}>
                    <i style={{ background: nationStripes(card.countryCode, 90) }} />
                    <b>{card.countryCode}</b>
                    <small>{card.country.toUpperCase()}</small>
                  </span>
                ) : null}

                {beat === "place" ? (
                  <span key={`p${index}`} className={styles.place}>
                    <b>{posOf(id)}</b>
                    <small>{placeName(posOf(id))}</small>
                    <i style={{ background: nationStripes(card.countryCode, 90) }} />
                  </span>
                ) : null}

                {beat === "card" || beat === "dock" ? (
                  <span key={`c${index}`} className={styles.reveal} data-dock={beat === "dock" || undefined}>
                    {kind === "quick" ? null : (
                      <>
                        <span className={styles.ring} aria-hidden />
                        <span className={styles.sparks} aria-hidden>
                          {sparks.map((s, i) => (
                            <i key={i} style={{ "--a": `${s.a}deg`, "--d": `${s.d}rem`, "--s": s.s, "--c": i % 3 ? "var(--tier)" : nationColours(card.countryCode)[1] } as CSSProperties} />
                          ))}
                        </span>
                      </>
                    )}
                    <span className={styles.flipper} data-kind={kind}>
                      <span className={styles.back} aria-hidden>
                        <BallIcon size={30} />
                        <small>PD</small>
                      </span>
                      <span className={styles.front}>
                        <DuelCard card={card} size="lg" stats={deriveStats(card)} style={{ "--w": "var(--reveal-w)" } as CSSProperties} />
                      </span>
                    </span>
                    <span className={styles.caption} role="status">
                      <b>{card.name}</b>
                      <small>
                        {posOf(id)} · {card.countryCode} · {card.trait}
                      </small>
                    </span>
                  </span>
                ) : null}

                <span className={styles.tapHint} aria-hidden>
                  {beat === "card" && kind === "walkout" ? "TAP TO CONTINUE" : "TAP TO SPEED UP"}
                </span>
              </button>
            ) : null}

            {stage === "squad" ? <Finale squad={squad} order={order} cardFor={cardFor} posOf={posOf} replay={replay} onDone={onDone} /> : null}

            <section className={styles.pitchCol} aria-label="Your eleven so far">
              <span className={styles.pitchHead}>
                <b>{squad.formation}</b> {formations[squad.formation].label}
                <em>
                  {signed}/{order.length}
                </em>
              </span>
              <span className={styles.pitch}>
                <svg viewBox="0 0 90 60" preserveAspectRatio="none" aria-hidden>
                  <rect x="1" y="1" width="88" height="58" rx="1" />
                  <line x1="45" y1="1" x2="45" y2="59" />
                  <circle cx="45" cy="30" r="6" />
                  <rect x="1" y="16" width="12" height="28" />
                  <rect x="77" y="16" width="12" height="28" />
                </svg>
                {places.map((p) => {
                  const c = cardFor(p.id);
                  const on = docked.has(p.id) && c;
                  return (
                    <span
                      key={p.id}
                      className={styles.token}
                      data-on={on ? true : undefined}
                      data-tier={c?.tier}
                      data-marquee={(on && p.id === squad.marqueeId) || undefined}
                      style={{ left: `${p.x * 100}%`, top: `${p.y * 100}%` }}
                    >
                      {on ? (
                        <>
                          <b>{c.rating}</b>
                          <small>{c.shortName}</small>
                        </>
                      ) : (
                        <em>{p.pos}</em>
                      )}
                    </span>
                  );
                })}
              </span>
            </section>
          </>
        )}
      </div>
    </div>
  );
}

/** The last screen: the team's overall counting up, the marquee card, and the way out. */
function Finale({
  squad,
  order,
  cardFor,
  posOf,
  replay,
  onDone,
}: {
  squad: DebutSquad;
  order: string[];
  cardFor: (id: string) => PlayerCard | undefined;
  posOf: (id: string) => string;
  replay?: boolean;
  onDone: (exit: DebutExit) => void;
}) {
  const sound = useSound();
  const reduced = usePrefersReducedMotion();
  const ovr = squadOvr(order, (id) => cardFor(id)?.rating ?? 0);
  const [shown, setShown] = useState(reduced ? ovr : 50);
  useEffect(() => {
    if (shown >= ovr) return;
    const t = setTimeout(() => {
      setShown((n) => Math.min(ovr, n + (ovr - n > 8 ? 3 : 1)));
      sound.tick(shown);
    }, 45);
    return () => clearTimeout(t);
  }, [shown, ovr, sound]);
  const marquee = cardFor(squad.marqueeId);
  const tierCount = order.reduce<Record<string, number>>((acc, pid) => {
    const t = cardFor(pid)?.tier ?? "bronze";
    acc[t] = (acc[t] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <section className={styles.finale} aria-label="Your debut eleven">
      {marquee ? (
        <span className={styles.finaleCard}>
          <small>MARQUEE SIGNING</small>
          <DuelCard card={marquee} size="md" stats={null} style={{ "--w": "var(--finale-w)" } as CSSProperties} />
        </span>
      ) : null}
      <span className={styles.finaleInfo}>
        <small className={styles.kicker}>{replay ? "YOUR DEBUT XI" : "SIGNING DAY COMPLETE"}</small>
        <h2 className={styles.finaleTitle}>YOUR XI IS READY</h2>
        <span className={styles.ovrRow}>
          <b>{shown}</b>
          <span>
            TEAM OVR
            <em>
              {squad.formation} · {formations[squad.formation].label}
            </em>
          </span>
        </span>
        <span className={styles.tiers}>
          {(["platinum", "gold", "silver", "bronze"] as const).map((t) =>
            tierCount[t] ? (
              <i key={t} data-tier={t}>
                {tierCount[t]} {t.toUpperCase()}
              </i>
            ) : null,
          )}
        </span>
        {marquee ? (
          <span className={styles.marqueeLine}>
            {marquee.name} · {posOf(marquee.id)} · {marquee.rating}
          </span>
        ) : null}
        <span className={styles.finaleCtas}>
          {replay ? (
            <Pill tone="violet" onClick={() => onDone("home")} optionId="debut-done">
              DONE
            </Pill>
          ) : (
            <>
              <Pill tone="green" pulse onClick={() => onDone("play")} optionId="debut-play">
                PLAY FIRST MATCH
              </Pill>
              <Pill tone="grey" onClick={() => onDone("home")} optionId="debut-club">
                CLUB HOUSE
              </Pill>
            </>
          )}
        </span>
      </span>
    </section>
  );
}
