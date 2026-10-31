"use client";

import { useState, type CSSProperties } from "react";

import { currentDuel, lineKey, playerRating, stoppageFor } from "../engine/match";
import { setPieceTitles } from "../engine/set-pieces";
import { tacticPlayable } from "../engine/tactics";
import { absoluteX, laneNames, mirror, zoneNames } from "../engine/zones";
import type { MatchInput, MatchState, SetPieceOption, Side } from "../engine/types";
import { usePitchDuelMatch } from "../state/use-pitch-duel-match";

import { ActionPad, TacticTray, useNumberKeys } from "./action-pad";
import { DuelCard, StatBlock, primaryPosition, sideAccent } from "./card-art";
import { DuelStage, type Faceoff } from "./duel-stage";
import { PitchIcon } from "./icons";
import { EventLog, EventsBar, MatchMap, PeriodStats, Scoreboard, SquadList, setPieceSpot } from "./match-parts";
import { pitchScene, type SceneInput } from "./pitch-layout";
import { SetPieceScene } from "./set-piece-scenes";
import { Modal, Pill, Sheet } from "./ui";
import styles from "./match.module.css";

type Panel = { kind: "squad"; side: Side; inspect?: string } | { kind: "events" } | { kind: "map" } | null;

/**
 * The portrait match screen, top to bottom: the trapezoid scoreboard, the
 * lineup tabs, the stage (situation, match map, the two cards and VS), the
 * moves in the thumb zone, and the match-events bar.
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
  const [panel, setPanel] = useState<Panel>(null);
  const [quitOpen, setQuitOpen] = useState(false);
  const [armed, setArmed] = useState<string | null>(null);

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
  const situation = situationFor(state);
  const lastEvent = [...state.log].reverse().find((e) => e.kind !== "duel");
  const setPieceTurn = !res && turn.kind === "setPiece" ? turn : null;

  const sendOrFinish = (input: MatchInput) => {
    if (state.phase === "fulltime") {
      onFinish(state);
      return;
    }
    send(input);
  };
  const advance = () => (res && state.phase === "choose" ? dismiss() : sendOrFinish({ type: "continue" }));
  const continueLabel =
    state.phase === "kickoff" ? "KICK OFF" : state.phase === "halftime" ? "START SECOND HALF" : state.phase === "fulltime" ? "SEE THE RESULT" : res && state.phase === "choose" ? "NEXT" : "CONTINUE";
  const waiting = Boolean(res) || turn.kind === "continue" || turn.kind === "over";
  useNumberKeys(0, () => {}, waiting && !res?.goal ? advance : undefined);

  const pickSetPiece = (option: SetPieceOption) => {
    const slot = state.teams.home.tactics.find((t) => t.id === armed && !t.used);
    send({ type: "setPiece", option, tacticId: slot && tacticPlayable(slot, "setPiece") ? slot.id : undefined });
    setArmed(null);
  };

  const scorer = res?.goal ? state.teams[res.goal].cards[res.attackerId] : undefined;

  return (
    <div className={styles.screen} data-phase={state.phase} data-danger={danger || undefined} aria-label="Pitch Duel match">
      <Scoreboard state={state} onQuit={() => setQuitOpen(true)} onLog={() => setPanel({ kind: "events" })} />

      <nav className={styles.tabs} aria-label="Lineups">
        <button type="button" className={styles.tab} data-side="home" onClick={() => setPanel({ kind: "squad", side: "home" })}>
          <PitchIcon size={16} /> YOUR LINEUP
        </button>
        <button type="button" className={styles.tab} data-side="away" onClick={() => setPanel({ kind: "squad", side: "away" })}>
          <PitchIcon size={16} /> OPP. LINEUP
        </button>
      </nav>

      <main className={styles.stage}>
        <div className={styles.stageTop}>
          <p className={styles.situation} style={{ "--tone": situation.tone } as CSSProperties}>
            <span>Current situation:</span> <b key={situation.title}>{situation.title}</b>
            <small>{situation.detail}</small>
          </p>
          <MatchMap state={state} scene={scene} danger={danger} onOpen={() => setPanel({ kind: "map" })} />
        </div>

        {setPieceTurn ? (
          <SetPieceScene state={state} turn={setPieceTurn} onPick={pickSetPiece} />
        ) : (
          <DuelStage state={state} faceoff={faceoff} res={res} onInspect={(side, id) => setPanel({ kind: "squad", side, inspect: id })} />
        )}
      </main>

      <footer className={styles.thumb}>
        {waiting ? (
          res?.goal ? null : (
            <div className={styles.continueRow}>
              <Pill tone={state.phase === "fulltime" ? "green" : "blue"} onClick={advance} wide pulse={!res}>
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
          />
        )}
        <EventsBar event={lastEvent} onShow={() => setPanel({ kind: "events" })} />
      </footer>

      <Modal open={Boolean(res?.goal)} labelledBy="pd-goal-title" tone={res?.goal === "home" ? "blue" : "red"}>
        {res?.goal ? (
          <div className={styles.goalModal}>
            <h2 id="pd-goal-title" className={styles.goalWord}>GOAL!!!</h2>
            <p>
              {scorer?.name ?? "A shot"} scores for {res.goal === "home" ? "your team" : state.opponentName}
            </p>
            {scorer ? (
              <div className={styles.goalCard}>
                <small>GOAL SCORER</small>
                <DuelCard card={scorer} size="md" stats={null} />
                <span className={styles.goalChips}>
                  <b>{scorer.rating}</b>
                  <b>{primaryPosition(scorer)}</b>
                  <b>{state.score.home}–{state.score.away}</b>
                </span>
              </div>
            ) : null}
            <Pill tone="blue" onClick={advance} wide>
              CONTINUE
            </Pill>
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
          <i style={{ background: sideAccent.home }} /> You attack up <i style={{ background: sideAccent.away }} /> {state.opponentName}
        </p>
      </Sheet>

      <Modal open={quitOpen} labelledBy="pd-quit-title" tone="red" onClose={() => setQuitOpen(false)}>
        <div className={styles.confirm}>
          <h2 id="pd-quit-title">LEAVE THE MATCH?</h2>
          <p>This match will not count. Your club and league points stay as they are.</p>
          <div className={styles.confirmRow}>
            <Pill tone="grey" back onClick={() => setQuitOpen(false)}>KEEP PLAYING</Pill>
            <Pill tone="red" onClick={onQuit}>LEAVE</Pill>
          </div>
        </div>
      </Modal>
    </div>
  );
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
