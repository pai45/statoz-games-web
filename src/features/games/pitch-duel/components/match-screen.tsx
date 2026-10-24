"use client";

import { useMemo, useState, type CSSProperties } from "react";

import { AdaptiveDrawer, ConfirmDialog, accentVar, feedbackVar } from "@/design-system";

import { currentDuel, lineKey, playerRating, stoppageFor } from "../engine/match";
import { setPieceTitles } from "../engine/set-pieces";
import { absoluteX, laneNames, mirror, zoneNames } from "../engine/zones";
import type { MatchState, Side } from "../engine/types";
import { usePitchDuelMatch } from "../state/use-pitch-duel-match";

import { ActionPad } from "./action-pad";
import { DuelCard, StatBlock, sideAccent } from "./card-art";
import { DuelStage } from "./duel-stage";
import { EventLog, EventTicker, LineupStrip, Minimap, Scoreboard } from "./match-parts";
import styles from "./match.module.css";

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
  const { state, turn, revealing, send, dismiss } = usePitchDuelMatch(initial, haptics);
  const [logOpen, setLogOpen] = useState(false);
  const [quitOpen, setQuitOpen] = useState(false);
  const [inspect, setInspect] = useState<{ side: Side; id: string } | null>(null);

  const res = revealing ? state.lastResolution : null;

  // During a reveal the cards and ball show what just happened; otherwise the coming duel.
  const faceoff = useMemo(() => {
    if (res) {
      const homeId = res.attackingSide === "home" ? res.attackerId : res.defenderId;
      const awayId = res.attackingSide === "home" ? res.defenderId : res.attackerId;
      return { home: homeId, away: awayId, ball: res.attackingSide };
    }
    const duel = currentDuel(state);
    const home = duel.attacker.side === "home" ? duel.attacker.id : duel.defender.id;
    const away = duel.attacker.side === "away" ? duel.attacker.id : duel.defender.id;
    return { home, away, ball: duel.attacker.side };
  }, [res, state]);

  const ballX = res ? res.to.x : absoluteX(state.possession.side, state.possession.progress);
  const ballLane = res ? res.to.lane : state.possession.lane;
  const danger = state.possession.side === "away" && state.possession.progress >= 6 && state.phase === "choose";

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

  return (
    <main className={styles.screen} data-pitch-duel-screen="match" aria-label="Pitch Duel match">
      <LineupStrip state={state} side="home" activeId={faceoff.home} onInspect={(side, id) => setInspect({ side, id })} />

      <div className={styles.centre}>
        <Scoreboard state={state} onQuit={() => setQuitOpen(true)} onLog={() => setLogOpen(true)} />
        <Minimap x={ballX} lane={ballLane} possession={res ? res.attackingSide : state.possession.side} danger={danger} />
        <div className={`${styles.plate} ${styles.situation}`} style={{ "--tone": situation.tone } as CSSProperties} role="status">
          <strong>{situation.title}</strong>
          <span>{situation.detail}</span>
        </div>
        <DuelStage state={state} faceoff={faceoff} revealing={Boolean(res)} onSkip={dismiss} />
        {res ? (
          <div className={styles.pad}>
            <button type="button" className={`${styles.plate} ${styles.continue}`} onClick={() => (state.phase === "choose" ? dismiss() : sendOrFinish({ type: "continue" }))}>
              {state.phase === "choose" ? "NEXT ▶" : continueLabel}
            </button>
          </div>
        ) : (
          <ActionPad
            turn={turn}
            tactics={state.teams.home.tactics}
            tacticTitles={tacticTitles}
            disabled={false}
            continueLabel={continueLabel}
            onSend={sendOrFinish}
          />
        )}
        <EventTicker event={lastEvent} onOpen={() => setLogOpen(true)} />
        <p className={styles.rotateHint}>ROTATE OR WIDEN FOR THE FULL PITCH</p>
      </div>

      <LineupStrip state={state} side="away" activeId={faceoff.away} onInspect={(side, id) => setInspect({ side, id })} />

      {res?.goal ? (
        <div className={styles.goalFlash} style={{ "--tone": sideAccent[res.goal] } as CSSProperties} aria-hidden>
          <strong>GOAL!</strong>
        </div>
      ) : null}

      <AdaptiveDrawer open={logOpen} onClose={() => setLogOpen(false)} title="MATCH LOG">
        <div className={styles.sheet}>
          <PeriodStats state={state} />
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
  if (state.phase === "kickoff") return { title: "KICK-OFF", detail: `${state.teams.home.name} vs ${state.opponentName}`, tone: accentVar("cyan") };
  if (state.phase === "halftime") return { title: "HALF-TIME", detail: `${state.score.home}–${state.score.away} · second half next`, tone: accentVar("cyan") };
  if (state.phase === "fulltime") return { title: "FULL-TIME", detail: `${state.score.home}–${state.score.away}`, tone: accentVar("cyan") };
  if (state.pending.kind === "setPiece") {
    const sp = state.pending.setPiece;
    const yours = sp.side === "home";
    return {
      title: `${setPieceTitles[sp.kind]}${sp.kind === "oneOnOne" ? " · BIG CHANCE" : ""}`,
      detail: yours ? "Your call — pick the finish" : "Stop it — guess their plan",
      tone: yours ? accentVar("orange") : feedbackVar("danger"),
    };
  }
  const { side, progress, lane } = state.possession;
  const added = state.minute > (state.half === 1 ? 45 : 90) ? ` · +${stoppageFor(state)} ADDED` : "";
  if (side === "home") return { title: "YOUR BALL", detail: `${zoneNames[progress]} · ${laneNames[lane]}${added}`, tone: accentVar("lime") };
  const danger = progress >= 6;
  return {
    title: danger ? "DANGER" : "THEY ATTACK",
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
          <p className={styles.detail}>
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
