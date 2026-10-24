"use client";

import { useState, type CSSProperties } from "react";

import { AdaptiveDrawer, ConfirmDialog, accentVar, feedbackVar } from "@/design-system";

import { currentDuel, lineKey, playerRating, stoppageFor } from "../engine/match";
import { setPieceTitles } from "../engine/set-pieces";
import { absoluteX, laneNames, mirror, zoneNames } from "../engine/zones";
import type { MatchState, Side } from "../engine/types";
import { usePitchDuelMatch } from "../state/use-pitch-duel-match";

import { ActionPad } from "./action-pad";
import { DuelCard, StatBlock, sideAccent } from "./card-art";
import { DuelStage } from "./duel-stage";
import { EventLog, EventTicker, PitchView, Scoreboard, SquadLists, setPieceSpot } from "./match-parts";
import { pitchScene, type SceneInput } from "./pitch-layout";
import styles from "./match.module.css";

/**
 * The match screen for a landscape phone: a slim scoreboard, the pitch with
 * all ten players on the left, the duel on the right, and the moves along the
 * bottom. Squads, stats and the log live in a drawer opened from the pitch.
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
  const [logOpen, setLogOpen] = useState(false);
  const [quitOpen, setQuitOpen] = useState(false);
  const [inspect, setInspect] = useState<{ side: Side; id: string } | null>(null);

  const res = revealing ? state.lastResolution : null;
  const duel = currentDuel(state);
  const nextDuel: Record<Side, string> = {
    home: duel.attacker.side === "home" ? duel.attacker.id : duel.defender.id,
    away: duel.attacker.side === "away" ? duel.attacker.id : duel.defender.id,
  };

  // The cards show who just duelled during a reveal, otherwise the coming duel.
  const faceoff = res
    ? {
        home: res.attackingSide === "home" ? res.attackerId : res.defenderId,
        away: res.attackingSide === "home" ? res.defenderId : res.attackerId,
        ball: res.attackingSide,
      }
    : { ...nextDuel, ball: duel.attacker.side };

  // The pitch shows where the play went. A goal leaves the players where the shot was taken and sends the ball into the net.
  const sceneInput: SceneInput = res?.goal
    ? {
        x: res.from.x,
        lane: res.from.lane,
        possession: res.attackingSide,
        duel: { home: faceoff.home, away: faceoff.away },
        ballAt: { x: res.goal === "home" ? 1.02 : -0.02, y: 0.5 },
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
  const continueLabel =
    state.phase === "kickoff" ? "KICK OFF ▶" : state.phase === "halftime" ? "START SECOND HALF ▶" : state.phase === "fulltime" ? "FULL-TIME · SEE RESULT ▶" : "CONTINUE ▶";

  const sendOrFinish = (input: Parameters<typeof send>[0]) => {
    if (state.phase === "fulltime") {
      onFinish(state);
      return;
    }
    send(input);
  };

  const inspectFromDrawer = (side: Side, id: string) => {
    setLogOpen(false);
    setInspect({ side, id });
  };

  return (
    <main className={styles.screen} data-pitch-duel-screen="match" data-phase={state.phase} aria-label="Pitch Duel match">
      <Scoreboard state={state} onQuit={() => setQuitOpen(true)} onLog={() => setLogOpen(true)} />

      <PitchView
        state={state}
        scene={scene}
        zone={res?.goal ? null : { x: sceneInput.x, lane: sceneInput.lane }}
        possession={sceneInput.possession}
        danger={danger}
        moving={Boolean(res)}
        goal={res?.goal ?? null}
        onOpen={() => setLogOpen(true)}
        header={
          <span className={styles.situation} style={{ "--tone": situation.tone } as CSSProperties}>
            <strong key={situation.title}>{situation.title}</strong>
            <span>{situation.detail}</span>
            <em aria-hidden>SQUADS ▸</em>
          </span>
        }
        footer={<EventTicker event={lastEvent} />}
      />

      <DuelStage state={state} faceoff={faceoff} res={res} onSkip={dismiss} onInspect={(side, id) => setInspect({ side, id })} />

      {res ? (
        <div className={styles.bar}>
          <button
            type="button"
            className={`${styles.plate} ${styles.continue}`}
            onClick={() => (state.phase === "choose" ? dismiss() : sendOrFinish({ type: "continue" }))}
          >
            {autoHold ? <span key={state.decisions} className={styles.autoFill} style={{ "--hold": `${autoHold}ms` } as CSSProperties} aria-hidden /> : null}
            {state.phase === "choose" ? "NEXT ▶" : continueLabel}
          </button>
        </div>
      ) : (
        <ActionPad
          turn={turn}
          turnKey={`${state.decisions}-${state.phase}-${state.pending.kind}`}
          tactics={state.teams.home.tactics}
          tacticTitles={tacticTitles}
          continueLabel={continueLabel}
          onSend={sendOrFinish}
        />
      )}

      <p className={styles.rotateHint}>ROTATE YOUR PHONE FOR THE FULL PITCH</p>

      {res?.goal ? (
        <div key={`g${state.decisions}`} className={styles.goalFlash} style={{ "--tone": sideAccent[res.goal] } as CSSProperties} aria-hidden>
          <strong>GOAL!</strong>
          <span>{res.goal === "home" ? state.teams.home.name : state.opponentName}</span>
        </div>
      ) : null}

      <AdaptiveDrawer open={logOpen} onClose={() => setLogOpen(false)} title="MATCH CENTRE">
        <div className={styles.sheet}>
          <PeriodStats state={state} />
          <SquadLists state={state} onInspect={inspectFromDrawer} />
          <EventLog events={state.log} />
        </div>
      </AdaptiveDrawer>

      <AdaptiveDrawer open={inspect !== null} onClose={() => setInspect(null)} title="PLAYER">
        {inspect ? <PlayerSheet state={state} side={inspect.side} id={inspect.id} /> : null}
      </AdaptiveDrawer>

      <ConfirmDialog
        open={quitOpen}
        title="LEAVE THE MATCH?"
        message="This match will not count. Your club and league points stay as they are."
        confirmLabel="LEAVE"
        cancelLabel="KEEP PLAYING"
        destructive
        onConfirm={onQuit}
        onCancel={() => setQuitOpen(false)}
      />
    </main>
  );
}

function situationFor(state: MatchState): { title: string; detail: string; tone: string } {
  if (state.phase === "kickoff") return { title: "KICK-OFF", detail: "Five against five", tone: accentVar("cyan") };
  if (state.phase === "halftime") return { title: "HALF-TIME", detail: `${state.score.home}–${state.score.away}`, tone: accentVar("cyan") };
  if (state.phase === "fulltime") return { title: "FULL-TIME", detail: `${state.score.home}–${state.score.away}`, tone: accentVar("cyan") };
  if (state.pending.kind === "setPiece") {
    const sp = state.pending.setPiece;
    const yours = sp.side === "home";
    return {
      title: `${setPieceTitles[sp.kind]}${sp.kind === "oneOnOne" ? " · BIG CHANCE" : ""}`,
      detail: yours ? "Your chance" : "Their chance",
      tone: yours ? accentVar("orange") : feedbackVar("danger"),
    };
  }
  const { side, progress, lane } = state.possession;
  const added = state.minute > (state.half === 1 ? 45 : 90) ? ` · +${stoppageFor(state)}` : "";
  if (side === "home") return { title: "YOUR BALL", detail: `${zoneNames[progress]} · ${laneNames[lane]}${added}`, tone: accentVar("lime") };
  const danger = progress >= 6;
  return {
    title: danger ? "DANGER" : "THEIR BALL",
    detail: `${zoneNames[mirror(progress)]} · ${laneNames[lane]}${added}`,
    tone: danger ? feedbackVar("danger") : accentVar("orange"),
  };
}

function PeriodStats({ state }: { state: MatchState }) {
  const h = state.stats.home;
  const a = state.stats.away;
  const rows: [string, number, number][] = [
    ["SHOTS", h.shots, a.shots],
    ["ON TARGET", h.onTarget, a.onTarget],
    ["DUELS WON", h.duelsWon, a.duelsWon],
    ["READS WON", h.readsWon, a.readsWon],
    ["CORNERS", h.corners, a.corners],
    ["FOULS", h.fouls, a.fouls],
  ];
  return (
    <div className={styles.periodStats}>
      {rows.map(([label, x, y]) => (
        <div key={label} style={{ display: "contents" }}>
          <b style={{ color: sideAccent.home }}>{x}</b>
          <span>{label}</span>
          <b style={{ color: sideAccent.away }}>{y}</b>
        </div>
      ))}
    </div>
  );
}

function PlayerSheet({ state, side, id }: { state: MatchState; side: Side; id: string }) {
  const team = state.teams[side];
  const card = team.cards[id];
  const line = state.players[lineKey(side, id)];
  const keeper = id === team.keeperId;
  return (
    <div className={styles.sheet}>
      <div className={styles.sheetRow}>
        <DuelCard card={card} size="sm" />
        <div className={styles.sheet}>
          <StatBlock stats={team.stats[id]} keeper={keeper} />
          <p className={styles.sheetNote}>
            Match rating <b>{playerRating(line, keeper).toFixed(1)}</b> · duels {line.duelsWon}–{line.duelsLost}
            {line.goals ? ` · ${line.goals} goal${line.goals > 1 ? "s" : ""}` : ""}
            {keeper ? ` · ${line.saves} saves` : ""}
            {line.red ? " · sent off" : line.yellow ? " · booked" : ""}
          </p>
        </div>
      </div>
    </div>
  );
}
