"use client";

import { useMemo, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";

import type { ActionCard, PlayerCard as PlayerCardData } from "@/domain/cards";
import { isAcademyId } from "@/mocks/packs/pitch-duel-academy";

import {
  fillFormation,
  formationIds,
  formations,
  lineupErrors,
  maxTactics,
  positionFit,
  positionGroup,
  reshapeClub,
  type ClubSetup,
  type PositionGroup,
} from "../engine/lineup";
import { effectFor } from "../engine/tactics";
import type { FormationId } from "../engine/types";

import { DuelCard, primaryPosition } from "./card-art";
import { StarIcon } from "./icons";
import { Pill } from "./ui";
import styles from "./pitch-duel.module.css";

/** A place on the pitch: the keeper, or outfield slot 0–9. */
type Place = "gk" | number;
type Drag = { from: Place | { bench: string }; id: string; x: number; y: number; started: boolean; pointer: number };

const groups: ("ALL" | PositionGroup)[] = ["ALL", "GK", "DEF", "MID", "FWD"];

/** Slot depth (0 own goal … ~0.56) to a top offset on the portrait pitch. */
const topFor = (depth: number) => 0.93 - (depth / 0.56) * 0.83;

/**
 * The eleven-a-side lineup editor. Drag a card onto another place to swap
 * them, or drag one up from the squad tray to bring it in. Tapping works the
 * same way: tap a place, then tap another place or a squad card. Keyboard:
 * Enter picks a place, the arrow keys move between places, Enter places.
 */
export function LineupEditor({
  initial,
  ownedPlayers,
  ownedActions,
  cardFor,
  actionFor,
  onSave,
}: {
  initial: ClubSetup;
  ownedPlayers: string[];
  ownedActions: string[];
  cardFor: (id: string) => PlayerCardData | undefined;
  actionFor: (id: string) => ActionCard | undefined;
  onSave: (club: ClubSetup) => void;
}) {
  const [club, setClub] = useState<ClubSetup>(initial);
  const [picked, setPicked] = useState<Place | null>(null);
  const [filter, setFilter] = useState<"ALL" | PositionGroup>("ALL");
  const [note, setNote] = useState<string | null>(null);
  const [drag, setDrag] = useState<Drag | null>(null);
  const placeRefs = useRef(new Map<string, HTMLButtonElement>());
  // A finished drag is followed by a click on the card it started from; that click is not a tap.
  const justDragged = useRef(false);

  const shape = formations[club.formation];
  const errors = lineupErrors(club, ownedPlayers, ownedActions, cardFor);
  const onPitch = new Set([club.keeperId, ...club.outfield]);
  const xi = [club.keeperId, ...club.outfield].map(cardFor).filter((c): c is PlayerCardData => Boolean(c));
  const ovr = xi.length ? Math.round(xi.reduce((sum, c) => sum + c.rating, 0) / xi.length) : 0;

  const pickedPos = picked === null ? null : picked === "gk" ? "GK" : shape.slots[picked]?.pos ?? null;
  const bench = useMemo(() => {
    const cards = ownedPlayers
      .filter((id) => !onPitch.has(id))
      .map(cardFor)
      .filter((c): c is PlayerCardData => Boolean(c))
      .filter((c) => {
        if (picked === "gk") return c.role === "goalkeeper";
        if (picked !== null) return c.role !== "goalkeeper";
        if (filter === "ALL") return true;
        return positionGroup(primaryPosition(c)) === filter;
      });
    const fit = (c: PlayerCardData) => (pickedPos && pickedPos !== "GK" ? positionFit(c, pickedPos as never) : 0);
    return cards.sort((a, b) => fit(b) - fit(a) || Number(isAcademyId(a.id)) - Number(isAcademyId(b.id)) || b.rating - a.rating);
    // onPitch is derived from club, which is a dependency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ownedPlayers, cardFor, club, picked, filter, pickedPos]);

  const idAt = (place: Place) => (place === "gk" ? club.keeperId : club.outfield[place]);

  /** Swap two places, or bring a squad card into a place. Keepers stay in goal. */
  const apply = (from: Place | { bench: string }, to: Place) => {
    setNote(null);
    if (typeof from === "object") {
      const incoming = cardFor(from.bench);
      if (!incoming) return;
      if ((to === "gk") !== (incoming.role === "goalkeeper")) {
        setNote(to === "gk" ? "Only a goalkeeper can play in goal." : "Goalkeepers play in goal only.");
        return;
      }
      if (to === "gk") setClub({ ...club, keeperId: incoming.id });
      else {
        const outfield = [...club.outfield];
        outfield[to] = incoming.id;
        setClub({ ...club, outfield });
      }
      return;
    }
    if (from === to) return;
    if (from === "gk" || to === "gk") {
      setNote("Keepers stay in goal. Bring one in from the squad instead.");
      return;
    }
    const outfield = [...club.outfield];
    [outfield[from], outfield[to]] = [outfield[to], outfield[from]];
    setClub({ ...club, outfield });
  };

  const tapPlace = (place: Place) => {
    if (justDragged.current) {
      justDragged.current = false;
      return;
    }
    if (picked === null) setPicked(place);
    else if (picked === place) setPicked(null);
    else {
      apply(picked, place);
      setPicked(null);
    }
  };

  const tapBench = (id: string) => {
    if (justDragged.current) {
      justDragged.current = false;
      return;
    }
    if (picked === null) {
      setNote("Pick a place on the pitch first, or drag the card onto one.");
      return;
    }
    apply({ bench: id }, picked);
    setPicked(null);
  };

  /* ---- Pointer drag ------------------------------------------------------- */

  const startDrag = (event: PointerEvent, from: Drag["from"], id: string) => {
    if (event.button !== 0) return;
    setDrag({ from, id, x: event.clientX, y: event.clientY, started: false, pointer: event.pointerId });
  };

  const moveDrag = (event: PointerEvent) => {
    if (!drag || event.pointerId !== drag.pointer) return;
    const moved = Math.hypot(event.clientX - drag.x, event.clientY - drag.y) > 8;
    if (!drag.started && !moved) return;
    if (!drag.started) (event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId);
    setDrag({ ...drag, x: event.clientX, y: event.clientY, started: true });
  };

  const endDrag = (event: PointerEvent) => {
    if (!drag || event.pointerId !== drag.pointer) return;
    const current = drag;
    setDrag(null);
    if (!current.started) return; // a plain tap; the click handler runs
    justDragged.current = true;
    setTimeout(() => (justDragged.current = false), 0);
    const under = document.elementFromPoint(event.clientX, event.clientY)?.closest<HTMLElement>("[data-place]");
    if (!under) return;
    const raw = under.dataset.place!;
    apply(current.from, raw === "gk" ? "gk" : Number(raw));
    setPicked(null);
  };

  const dragOver = (place: Place) =>
    drag?.started ? document.elementFromPoint(drag.x, drag.y)?.closest<HTMLElement>("[data-place]")?.dataset.place === String(place) : false;

  /* ---- Keyboard ------------------------------------------------------------ */

  const order: Place[] = ["gk", ...shape.slots.map((_, i) => i)];
  const placeKey = (event: KeyboardEvent, place: Place) => {
    if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    const here = place === "gk" ? { across: 0.5, depth: 0.04 } : shape.slots[place].at;
    const dir = { ArrowUp: [0, 1], ArrowDown: [0, -1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] }[event.key]!;
    let best: Place | null = null;
    let bestScore = Infinity;
    for (const p of order) {
      if (p === place) continue;
      const at = p === "gk" ? { across: 0.5, depth: 0.04 } : shape.slots[p].at;
      const dx = at.across - here.across;
      const dy = at.depth - here.depth;
      const along = dx * dir[0] + dy * dir[1];
      if (along <= 0.01) continue;
      const score = along + Math.abs(dx * dir[1] + dy * dir[0]) * 2;
      if (score < bestScore) {
        best = p;
        bestScore = score;
      }
    }
    if (best !== null) placeRefs.current.get(String(best))?.focus();
  };

  /* ---- Actions --------------------------------------------------------------- */

  const autoPick = () => {
    const keepers = ownedPlayers.filter((id) => cardFor(id)?.role === "goalkeeper").sort((a, b) => (cardFor(b)?.rating ?? 0) - (cardFor(a)?.rating ?? 0));
    const outfield = fillFormation(club.formation, ownedPlayers, cardFor);
    setClub({ ...club, keeperId: keepers[0] ?? club.keeperId, outfield: outfield.map((id) => id ?? "") });
    setPicked(null);
    setNote("Best eleven picked for this shape.");
  };

  const toggleTactic = (id: string) => {
    if (club.tactics.includes(id)) setClub({ ...club, tactics: club.tactics.filter((t) => t !== id) });
    else if (club.tactics.length < maxTactics) setClub({ ...club, tactics: [...club.tactics, id] });
  };
  const actions = ownedActions.map(actionFor).filter((a): a is ActionCard => Boolean(a)).sort((a, b) => b.power - a.power);

  const placeButton = (place: Place, x: number, y: number, pos: string) => {
    const id = idAt(place);
    const card = id ? cardFor(id) : undefined;
    const fit = !card ? 0 : place === "gk" ? 3 : positionFit(card, pos as never);
    const dragging = drag?.started && typeof drag.from !== "object" && drag.from === place;
    return (
      <button
        key={String(place)}
        ref={(node) => {
          if (node) placeRefs.current.set(String(place), node);
          else placeRefs.current.delete(String(place));
        }}
        type="button"
        className={styles.place}
        data-place={String(place)}
        data-picked={picked === place || undefined}
        data-over={dragOver(place) || undefined}
        data-dragging={dragging || undefined}
        style={{ left: `${x * 100}%`, top: `${y * 100}%` } as CSSProperties}
        onClick={() => tapPlace(place)}
        onKeyDown={(e) => placeKey(e, place)}
        onPointerDown={(e) => card && startDrag(e, place, card.id)}
        onPointerMove={moveDrag}
        onPointerUp={endDrag}
        onPointerCancel={() => setDrag(null)}
        aria-pressed={picked === place}
        aria-label={`${pos}: ${card ? `${card.name}, ${card.rating}` : "empty"}${picked === place ? ", picked" : ""}`}
        data-pitch-duel-option={`place-${place}`}
      >
        {card ? <DuelCard card={card} size="mini" /> : <span className={styles.placeEmpty}>+</span>}
        <span className={styles.placePos} data-fit={fit}>
          {pos}
        </span>
      </button>
    );
  };

  const ghost = drag?.started ? cardFor(drag.id) : undefined;

  return (
    // Native image drag would cancel the pointer drag, so it is switched off here.
    <div className={styles.lineup} data-dragging={drag?.started || undefined} onDragStart={(e) => e.preventDefault()}>
      <div className={styles.lineupBar}>
        <label className={styles.formationSelect}>
          <span className={styles.srOnly}>Formation</span>
          <select
            value={club.formation}
            onChange={(e) => {
              setClub(reshapeClub(club, e.target.value as FormationId, ownedPlayers, cardFor));
              setPicked(null);
            }}
          >
            {formationIds.map((f) => (
              <option key={f} value={f}>
                {f} · {formations[f].label}
              </option>
            ))}
          </select>
        </label>
        <span className={styles.ovrPill}>
          <StarIcon size={16} /> {ovr} OVR
        </span>
      </div>
      <p className={styles.shapeBlurb}>{shape.blurb}</p>

      <div className={styles.pitch} aria-label={`Pitch, ${club.formation}`}>
        <svg className={styles.pitchLines} viewBox="0 0 60 90" preserveAspectRatio="none" aria-hidden>
          <rect x="1.5" y="1.5" width="57" height="87" rx="1.5" />
          <line x1="1.5" y1="45" x2="58.5" y2="45" />
          <circle cx="30" cy="45" r="7.5" />
          <rect x="14" y="1.5" width="32" height="13" />
          <rect x="14" y="75.5" width="32" height="13" />
          <rect x="22" y="83" width="16" height="5.5" />
        </svg>
        {placeButton("gk", 0.5, 0.9, "GK")}
        {shape.slots.map((s, i) => placeButton(i, s.at.across, topFor(s.at.depth), s.pos))}
      </div>

      <p className={styles.lineupNote} role="status">
        {note ?? (picked !== null ? `Now tap another place or a squad card for ${pickedPos}.` : "Drag a card onto another place to swap, or tap two places.")}
      </p>

      <section className={styles.benchPanel} aria-label="Squad">
        <header className={styles.benchHead}>
          <span className={styles.benchTitle}>{picked !== null ? `SQUAD FOR ${pickedPos}` : "SQUAD"}</span>
          {picked === null ? (
            <span className={styles.chips} role="group" aria-label="Filter by position">
              {groups.map((g) => (
                <button key={g} type="button" className={styles.chip} aria-pressed={filter === g} onClick={() => setFilter(g)}>
                  {g}
                </button>
              ))}
            </span>
          ) : null}
        </header>
        <div className={styles.bench}>
          {bench.map((card) => (
            <span
              key={card.id}
              className={styles.benchCard}
              data-bench={card.id}
              onPointerDown={(e) => startDrag(e, { bench: card.id }, card.id)}
              onPointerMove={moveDrag}
              onPointerUp={endDrag}
              onPointerCancel={() => setDrag(null)}
            >
              <DuelCard card={card} size="mini" onClick={() => tapBench(card.id)} label={`Bring in ${card.name}, ${primaryPosition(card)}, ${card.rating}`} />
              {isAcademyId(card.id) ? <small className={styles.academyTag}>ACADEMY</small> : null}
            </span>
          ))}
          {!bench.length ? <p className={styles.muted}>No one else for this place. Open packs to grow your squad.</p> : null}
        </div>
      </section>

      <section className={styles.benchPanel} aria-label="Tactic cards">
        <header className={styles.benchHead}>
          <span className={styles.benchTitle}>
            TACTICS {club.tactics.length}/{maxTactics}
          </span>
        </header>
        <div className={styles.tacticList}>
          {actions.map((a) => {
            const on = club.tactics.includes(a.id);
            return (
              <button
                key={a.id}
                type="button"
                className={styles.tacticPick}
                aria-pressed={on}
                disabled={!on && club.tactics.length >= maxTactics}
                onClick={() => toggleTactic(a.id)}
              >
                <b>{a.title}</b>
                <small>
                  {a.tier.toUpperCase()} · {effectFor(a).summary}
                </small>
              </button>
            );
          })}
          {!actions.length ? <p className={styles.muted}>No tactic cards yet — they come in packs.</p> : null}
        </div>
      </section>

      {errors.length ? <p className={styles.errors}>{errors[0]}</p> : null}
      <div className={styles.lineupActions}>
        <Pill tone="grey" onClick={autoPick}>AUTO PICK</Pill>
        <Pill tone="red" back onClick={() => { setClub(initial); setPicked(null); setNote("Back to your saved eleven."); }}>RESET</Pill>
        <Pill tone="green" wide disabled={errors.length > 0} onClick={() => onSave(club)} optionId="save-lineup">
          SAVE SQUAD
        </Pill>
      </div>

      {ghost && drag ? (
        <span className={styles.ghost} style={{ left: drag.x, top: drag.y }} aria-hidden>
          <DuelCard card={ghost} size="mini" />
        </span>
      ) : null}
    </div>
  );
}
