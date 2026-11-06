"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

import { currentDuel, lineKey, playerRating, stoppageFor } from "../engine/match";
import { setPieceTitles } from "../engine/set-pieces";
import { tacticPlayable } from "../engine/tactics";
import { absoluteX, laneNames, mirror, zoneNames } from "../engine/zones";
import type { MatchInput, MatchState, SetPieceOption, Side } from "../engine/types";
import { usePitchDuelMatch } from "../state/use-pitch-duel-match";

import { ActionPad, SurgeChip, TacticTray, useNumberKeys, type SurgeControl } from "./action-pad";
import { useSound } from "./audio";
import { DuelCard, StatBlock, primaryPosition, sideAccent } from "./card-art";
import { DuelStage, promptFor, type Faceoff } from "./duel-stage";
import { EventLog, EventsBar, MatchMap, PeriodStats, Scoreboard, SquadList, setPieceSpot } from "./match-parts";
import { pitchScene, type SceneInput } from "./pitch-layout";
import { SetPieceScene } from "./set-piece-scenes";
import { Modal, Pill, Sheet } from "./ui";
import styles from "./match.module.css";

type Panel = { kind: "squad"; side: Side; inspect?: string } | { kind: "events" } | { kind: "map" } | null;

/** Confetti for your goals: forty pieces thrown from the top, in your colours and gold. */
const confetti = Array.from({ length: 40 }, (_, i) => ({
  x: (i * 37) % 100,
  delay: ((i * 53) % 40) / 100,
  spin: ((i * 71) % 360) - 180,
  drift: ((i * 29) % 30) - 15,
  colour: ["#60a5fa", "#fbbf24", "#ffffff", "#a855f7", "#38bdf8"][i % 5],
}));

/**
 * The landscape match screen. Along the top, the scorebug with the lineup
 * buttons either side and each side's momentum under its score. Below it
 * three columns: the situation, match map and latest event on the left; the
 * two cards and VS in the middle; your moves, momentum and tactics (or
 * CONTINUE) on the right, under the thumb. The crowd behind the cards and
 * the sound follow the play.
 */
export function MatchScreen({
  initial,
  haptics,
  tacticTitles,
  onFinish,
  onQuit,
}: {
  initial: MatchState;
  haptics: boolean;
  tacticTitles: Record<string, string>;
  onFinish: (state: MatchState) => void;
  onQuit: () => void;
}) {
  const { state, turn, revealing, send, dismiss, autoHold } = usePitchDuelMatch(initial, haptics);
  const sound = useSound();
  const [panel, setPanel] = useState<Panel>(null);
  const [quitOpen, setQuitOpen] = useState(false);
  const [armed, setArmed] = useState<string | null>(null);
  const [surgeArmed, setSurgeArmed] = useState(false);

  const res = revealing ? state.lastResolution : null;
  const duel = currentDuel(state);
  const nextDuel: Record<Side, string> = {
    home: duel.attacker.side === "home" ? duel.attacker.id : duel.defender.id,
    away: duel.attacker.side === "away" ? duel.attacker.id : duel.defender.id,
  };
  // The cards show who just duelled during a reveal, otherwise the coming duel.
  const faceoff: Faceoff = res
    ? {
        home: res.attackingSide === "home" ? res.attackerId : res.defenderId,
        away: res.attackingSide === "home" ? res.defenderId : res.attackerId,
        ball: res.attackingSide,
      }
    : { ...nextDuel, ball: duel.attacker.side };

  // The map shows where the play went; a goal sends the ball into the net.
  const sceneInput: SceneInput = res?.goal
    ? {
        x: res.from.x,
        lane: res.from.lane,
        possession: res.attackingSide,
        duel: { home: faceoff.home, away: faceoff.away },
        ballAt: { x: res.goal === "home" ? 1 : 0, y: 0.5 },
      }
    : {
        x: absoluteX(state.possession.side, state.possession.progress),
        lane: state.possession.lane,
        possession: duel.attacker.side,
        duel: nextDuel,
        spot: setPieceSpot(state),
      };
  const scene = pitchScene(state, sceneInput);
  const danger = !res && state.phase === "choose" && state.possession.side === "away" && state.possession.progress >= 6;
  const chance = !res && state.phase === "choose" && state.possession.side === "home" && state.possession.progress >= 6;
  const situation = situationFor(state);
  const lastEvent = [...state.log].reverse().find((e) => e.kind !== "duel");
  const setPieceTurn = !res && turn.kind === "setPiece" ? turn : null;
  const heat = res?.goal ? "goal" : danger ? "danger" : chance || setPieceTurn ? "chance" : "calm";

  /* ---- Sound ---------------------------------------------------------------- */

  // The crowd bed rises when either box is under threat; the drums come in for your surge and late drama.
  const late = state.half === 2 && state.minute >= 80 && Math.abs(state.score.home - state.score.away) <= 1;
  const crowdLevel = state.phase !== "choose" ? 0.35 : heat === "calm" ? 0.42 : 0.72;
  const chantLevel = state.phase === "choose" && (state.momentum.home >= 100 || late) ? 0.75 : 0;
  useEffect(() => {
    sound.crowd(crowdLevel);
    sound.chant(chantLevel);
  }, [sound, crowdLevel, chantLevel]);

  // Each new reveal: the clash, then what happened.
  const heard = useRef(-1);
  useEffect(() => {
    if (!res || heard.current === state.decisions) return;
    heard.current = state.decisions;
    const kinds = new Set(res.events.map((e) => e.kind));
    const big = res.outcome === "success_high" || res.outcome === "fail_high";
    if (res.surges.length) sound.surge();
    sound.clash(big || Boolean(res.goal));
    if (res.goal) {
      sound.goal(res.goal === "home");
      return;
    }
    const t = setTimeout(() => {
      if (kinds.has("red") || kinds.has("yellow")) sound.whistle("long");
      else if (kinds.has("foul") || kinds.has("penalty")) sound.whistle("short");
      if (kinds.has("save") || kinds.has("post") || kinds.has("miss") || kinds.has("bigChance")) sound.ooh();
      else if (kinds.has("block") || kinds.has("corner")) sound.swell(0.2);
      sound.result(res.userWon);
    }, 160);
    return () => clearTimeout(t);
  }, [res, state.decisions, sound]);

  // Whistles for kick-off, half-time and full-time.
  const lastPhase = useRef(state.phase);
  useEffect(() => {
    const from = lastPhase.current;
    lastPhase.current = state.phase;
    if (from === state.phase) return;
    if (state.phase === "choose") {
      sound.whistle("long");
      sound.swell(0.35);
    } else if (state.phase === "halftime" || state.phase === "fulltime") sound.whistle("end");
  }, [state.phase, sound]);

  /* ---- Input ---------------------------------------------------------------- */

  const sendOrFinish = (input: MatchInput) => {
    if (state.phase === "fulltime") {
      onFinish(state);
      return;
    }
    if (input.type === "attack" || (input.type === "setPiece" && turn.kind === "setPiece" && turn.role === "taker")) sound.kick();
    else if (input.type !== "continue") sound.tap();
    if ((input.type === "attack" || input.type === "defend") && input.surge) setSurgeArmed(false);
    send(input);
  };
  // A reveal is dismissed first, so half-time and full-time get their own panel before moving on.
  const advance = () => (res ? dismiss() : sendOrFinish({ type: "continue" }));
  const continueLabel =
    res ? "NEXT" : state.phase === "kickoff" ? "KICK OFF" : state.phase === "halftime" ? "START SECOND HALF" : state.phase === "fulltime" ? "SEE THE RESULT" : "CONTINUE";
  const waiting = Boolean(res) || turn.kind === "continue" || turn.kind === "over";
  useNumberKeys(0, () => {}, waiting && !res?.goal ? advance : undefined);

  const prompt = promptFor(state);
  const call = callFor(state, turn.kind, Boolean(res), autoHold);

  const pickSetPiece = (option: SetPieceOption) => {
    const slot = state.teams.home.tactics.find((t) => t.id === armed && !t.used);
    sendOrFinish({ type: "setPiece", option, tacticId: slot && tacticPlayable(slot, "setPiece") ? slot.id : undefined });
    setArmed(null);
  };

  const surge: SurgeControl = {
    value: state.momentum.home,
    armed: surgeArmed && state.momentum.home >= 100,
    theirs: state.momentum.away,
    onToggle: () => {
      setSurgeArmed((on) => !on);
      if (!surgeArmed) sound.sparkle(2);
    },
  };

  const scorer = res?.goal ? state.teams[res.goal].cards[res.attackerId] : undefined;

  return (
    <div className={styles.screen} data-phase={state.phase} data-danger={danger || undefined} data-heat={heat} aria-label="Fot Duel match">
      <Scoreboard
        state={state}
        onQuit={() => setQuitOpen(true)}
        onLog={() => setPanel({ kind: "events" })}
        onSquad={(side) => setPanel({ kind: "squad", side })}
      />

      <main className={styles.stage}>
        <span className={styles.crowd} aria-hidden>
          <i />
          <i />
        </span>
        {res?.surges.length ? <span key={`s${state.decisions}`} className={styles.surgeFlash} data-side={res.surges.includes("home") ? "home" : "away"} aria-hidden /> : null}

        <aside className={styles.info} aria-label="Match situation">
          <p className={styles.situation} style={{ "--tone": situation.tone } as CSSProperties}>
            <span>Current situation</span>
            <b key={situation.title}>{situation.title}</b>
            <small>{situation.detail}</small>
          </p>
          <MatchMap state={state} scene={scene} danger={danger} onOpen={() => setPanel({ kind: "map" })} />
          <EventsBar event={lastEvent} onShow={() => setPanel({ kind: "events" })} />
        </aside>

        <div className={styles.centre}>
          {setPieceTurn ? (
            <SetPieceScene state={state} turn={setPieceTurn} onPick={pickSetPiece} />
          ) : (
            <DuelStage state={state} faceoff={faceoff} res={res} onInspect={(side, id) => setPanel({ kind: "squad", side, inspect: id })} />
          )}
        </div>

        <section className={styles.thumb} aria-label="Your call">
          <header className={styles.callHead}>
            <b key={call.title ?? prompt.text}>{call.title ?? prompt.text}</b>
            <small>{call.sub}</small>
            {!waiting && !setPieceTurn ? <SurgeChip surge={surge} /> : null}
          </header>
          {waiting ? (
            res?.goal ? null : (
              <div className={styles.continueRow}>
                <Pill tone={state.phase === "fulltime" && !res ? "green" : "blue"} onClick={advance} wide pulse={!res}>
                  {continueLabel}
                </Pill>
                {autoHold ? <i key={state.decisions} className={styles.autoFill} style={{ "--hold": `${autoHold}ms` } as CSSProperties} aria-hidden /> : null}
              </div>
            )
          ) : setPieceTurn ? (
            state.teams.home.tactics.length ? (
              <TacticTray
                tactics={state.teams.home.tactics}
                titles={tacticTitles}
                role="setPiece"
                armed={armed}
                onArm={(id) => setArmed((a) => (a === id ? null : id))}
                onMindGame={() => {}}
              />
            ) : null
          ) : (
            <ActionPad
              turn={turn}
              turnKey={`${state.decisions}-${state.phase}-${state.pending.kind}`}
              tactics={state.teams.home.tactics}
              tacticTitles={tacticTitles}
              armed={armed}
              onArm={setArmed}
              onSend={sendOrFinish}
              surge={surge}
            />
          )}
        </section>
      </main>

      {res?.goal ? <Celebration key={state.decisions} side={res.goal} /> : null}

      <Modal open={Boolean(res?.goal)} labelledBy="pd-goal-title" tone={res?.goal === "home" ? "blue" : "red"} wide>
        {res?.goal ? (
          <div className={styles.goalModal} data-side={res.goal}>
            {scorer ? (
              <div className={styles.goalCard}>
                <small>GOAL SCORER</small>
                <DuelCard card={scorer} size="md" stats={null} />
              </div>
            ) : null}
            <div className={styles.goalText}>
              <h2 id="pd-goal-title" className={styles.goalWord}>
                {res.goal === "home" ? "GOAL!!!" : "GOAL…"}
              </h2>
              <p>
                {scorer?.name ?? "A shot"} scores for {res.goal === "home" ? "your team" : state.opponentName}
              </p>
              {scorer ? (
                <span className={styles.goalChips}>
                  <b>{scorer.rating} OVR</b>
                  <b>{primaryPosition(scorer)}</b>
                  <b>
                    {state.score.home}–{state.score.away}
                  </b>
                </span>
              ) : null}
              <Pill tone="blue" onClick={advance} wide>
                CONTINUE
              </Pill>
            </div>
          </div>
        ) : null}
      </Modal>

      <Sheet open={panel?.kind === "squad"} title={panel?.kind === "squad" && panel.side === "away" ? "OPP. LINEUP" : "YOUR LINEUP"} onClose={() => setPanel(null)}>
        {panel?.kind === "squad" ? (
          panel.inspect ? (
            <PlayerDetail state={state} side={panel.side} id={panel.inspect} onBack={() => setPanel({ kind: "squad", side: panel.side })} />
          ) : (
            <SquadList state={state} side={panel.side} onInspect={(id) => setPanel({ kind: "squad", side: panel.side, inspect: id })} />
          )
        ) : null}
      </Sheet>

      <Sheet open={panel?.kind === "events"} title="MATCH EVENTS" onClose={() => setPanel(null)}>
        <PeriodStats state={state} />
        <EventLog state={state} />
      </Sheet>

      <Sheet open={panel?.kind === "map"} title="MATCH MAP" onClose={() => setPanel(null)}>
        <MatchMap state={state} scene={scene} danger={danger} big />
        <p className={styles.mapKey}>
          <i style={{ background: sideAccent.home }} /> You attack right → <i style={{ background: sideAccent.away }} /> {state.opponentName}
        </p>
      </Sheet>

      <Modal open={quitOpen} labelledBy="pd-quit-title" tone="red" onClose={() => setQuitOpen(false)}>
        <div className={styles.confirm}>
          <h2 id="pd-quit-title">LEAVE THE MATCH?</h2>
          <p>This match will not count. Your club and league points stay as they are.</p>
          <div className={styles.confirmRow}>
            <Pill tone="grey" back onClick={() => setQuitOpen(false)}>
              KEEP PLAYING
            </Pill>
            <Pill tone="red" onClick={onQuit}>
              LEAVE
            </Pill>
          </div>
        </div>
      </Modal>
    </div>
  );
}

/**
 * The goal moment behind the modal: a flash in the scorer's colour and, for
 * your goals, confetti; for theirs, a red pulse at the edges.
 */
function Celebration({ side }: { side: Side }) {
  return (
    <div className={styles.celebration} data-side={side} aria-hidden>
      <i className={styles.celebrationFlash} />
      {side === "home"
        ? confetti.map((c, i) => (
            <i
              key={i}
              className={styles.confetti}
              style={{ left: `${c.x}%`, "--delay": `${c.delay}s`, "--spin": `${c.spin}deg`, "--drift": `${c.drift}vw`, background: c.colour } as CSSProperties}
            />
          ))
        : null}
    </div>
  );
}

/** The heading over the move column: what this turn asks of you. */
function callFor(state: MatchState, kind: string, revealing: boolean, autoHold: number | null | undefined): { title?: string; sub: string } {
  if (revealing) return { title: "DUEL RESULT", sub: autoHold ? "The next duel starts by itself" : "Tap NEXT when you are ready" };
  if (state.phase !== "choose") return { sub: promptFor(state).hint };
  if (kind === "setPiece") return { sub: "Tap your pick on the picture" };
  if (kind === "attack") return { sub: "Your ball · pick a move" };
  if (kind === "defend") return { sub: "Their ball · pick how you defend" };
  return { sub: "" };
}

function situationFor(state: MatchState): { title: string; detail: string; tone: string } {
  const neutral = "#bfff00";
  const attack = "#4ade80";
  const defend = "#f87171";
  const chance = "#fbbf24";
  if (state.phase === "kickoff") return { title: "Kick-off", detail: "Eleven a side", tone: neutral };
  if (state.phase === "halftime") return { title: "Half-time", detail: `${state.score.home}–${state.score.away}`, tone: neutral };
  if (state.phase === "fulltime") return { title: "Full-time", detail: `${state.score.home}–${state.score.away}`, tone: neutral };
  if (state.pending.kind === "setPiece") {
    const sp = state.pending.setPiece;
    const yours = sp.side === "home";
    return { title: `${setPieceTitles[sp.kind].toLowerCase().replace(/^./, (c) => c.toUpperCase())}${yours ? " for you" : " against you"}`, detail: yours ? "Big chance" : "Stop it", tone: yours ? chance : defend };
  }
  const duel = currentDuel(state);
  const attacker = state.teams[duel.attacker.side].cards[duel.attacker.id]?.name ?? "";
  const defender = state.teams[duel.defender.side].cards[duel.defender.id]?.name ?? "";
  const { side, progress, lane } = state.possession;
  const added = state.minute > (state.half === 1 ? 45 : 90) ? ` · +${stoppageFor(state)}` : "";
  const where = `${side === "home" ? zoneNames[progress] : zoneNames[mirror(progress)]} · ${laneNames[lane]}${added}`;
  const title = `${attacker} faces ${defender}.`;
  if (side === "home") return { title, detail: where, tone: progress >= 7 ? chance : attack };
  return { title, detail: where, tone: progress >= 6 ? defend : neutral };
}

function PlayerDetail({ state, side, id, onBack }: { state: MatchState; side: Side; id: string; onBack: () => void }) {
  const team = state.teams[side];
  const card = team.cards[id];
  const line = state.players[lineKey(side, id)];
  const keeper = id === team.keeperId;
  return (
    <div className={styles.detail}>
      <DuelCard card={card} size="md" stats={null} />
      <div className={styles.detailBody}>
        <h3>{card.name}</h3>
        <p className={styles.muted}>
          {card.trait} · {card.country}
        </p>
        <StatBlock stats={team.stats[id]} keeper={keeper} />
        <p className={styles.detailNote}>
          Match rating <b>{playerRating(line, keeper).toFixed(1)}</b> · duels {line.duelsWon}–{line.duelsLost}
          {line.goals ? ` · ${line.goals} goal${line.goals > 1 ? "s" : ""}` : ""}
          {keeper ? ` · ${line.saves} saves` : ""}
          {line.red ? " · sent off" : line.yellow ? " · booked" : ""}
        </p>
        <Pill tone="grey" back onClick={onBack}>
          BACK
        </Pill>
      </div>
    </div>
  );
}
