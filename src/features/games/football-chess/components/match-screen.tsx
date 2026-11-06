"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";

import { personalityInfo } from "../engine/ai/bots";
import { carrierOf, onBoard, pieceById, possession } from "../engine/board";
import { classTraits } from "../engine/classes";
import { expectedScore } from "../engine/eval";
import { ROWS } from "../engine/geometry";
import { actionKey, actionTarget, legalActions } from "../engine/moves";
import { formatFactor, percent, previewAction, type ActionPreview } from "../engine/preview";
import { threatOf } from "../engine/threats";
import { other, type Action, type GameState, type MatchEvent, type Piece, type Side } from "../engine/state";
import type { Settings } from "../state/progress";
import type { QuickMatch } from "../state/squads";
import { useGame, type MoveLine } from "../state/use-game";
import { playSfx } from "./audio";
import { Board, useSquareSize, type BoardTarget, type TargetKind } from "./board";
import { CardGlyph, ClassGlyph, Icon } from "./icons";
import shell from "./football-chess.module.css";
import styles from "./match.module.css";

type MatchScreenProps = {
  match: QuickMatch;
  settings: Settings;
  onSettings: (patch: Partial<Settings>) => void;
  onRules: () => void;
  onFinish: (game: GameState) => void;
  onLeave: () => void;
};

const kindOf: Record<Action["kind"], TargetKind> = {
  move: "move",
  skill: "skill",
  pass: "pass",
  shoot: "shot",
  takeOn: "duel",
  tackle: "duel",
  slide: "duel",
  hold: "move",
};

function targetsFor(game: GameState, actions: readonly Action[]): BoardTarget[] {
  return actions
    .filter((action) => action.kind !== "hold")
    .map((action) => {
      const spot = actionTarget(game, action);
      const preview = previewAction(game, action);
      const chance = preview.risky ? preview.chance : null;
      return {
        key: actionKey(action),
        action,
        col: spot.col,
        row: spot.row,
        kind: kindOf[action.kind],
        chance,
        label: chance === null ? preview.title : `${preview.title}, ${percent(chance)}`,
      };
    });
}

function nameOf(game: GameState, side: Side): string {
  return side === "home" ? "You" : game.setup.away.name;
}

type Callout = { big: string | null; small: string; tone: "good" | "bad" | "neutral" };

const toastText: Partial<Record<MatchEvent["tag"], string>> = {
  saved: "Saved",
  blocked: "Blocked",
  corner: "Blocked, corner",
  intercepted: "Cut out",
  beat: "Beaten",
  lost: "Ball lost",
  won: "Won it",
  missed: "Missed",
};

/** What to announce about the action just played, if anything. */
function calloutFor(game: GameState, event: MatchEvent): Callout | null {
  const forHome = (side: Side) => (side === "home" ? "good" : "bad");
  if (event.goalFor !== null) {
    const scorer = pieceById(game, event.actorId).card.shortName;
    return { big: "GOAL!", small: `${scorer}${event.penaltyKick ? " · penalty" : ""}`, tone: forHome(event.goalFor) };
  }
  if (event.fullTime) return { big: "FULL TIME", small: `${game.score.home} – ${game.score.away}`, tone: "neutral" };
  if (event.halfTime) {
    return { big: "HALF TIME", small: `${nameOf(game, game.turn)} kick${game.turn === "home" ? "" : "s"} off the second half`, tone: "neutral" };
  }
  if (event.penaltyAwarded) {
    const to = other(event.side);
    return { big: "PENALTY!", small: `to ${nameOf(game, to)}`, tone: forHome(to) };
  }
  if (event.card !== "none") {
    const offender = pieceById(game, event.actorId).card.shortName;
    return event.card === "red"
      ? { big: "RED CARD", small: `${offender} off for 6 actions`, tone: forHome(other(event.side)) }
      : { big: "BOOKED", small: `${offender}, foul`, tone: forHome(other(event.side)) };
  }
  if (event.passive) {
    return { big: "PASSIVE PLAY", small: `ball to ${nameOf(game, possession(game))}`, tone: forHome(possession(game)) };
  }
  const text = toastText[event.tag];
  if (text === undefined) return null;
  const good = event.tag === "beat" || event.tag === "won" || event.tag === "corner";
  const actorWins = good ? event.side : other(event.side);
  return { big: null, small: `${text} · ${percent(event.p)}`, tone: forHome(actorWins) };
}

function soundFor(event: MatchEvent) {
  if (event.goalFor !== null) return playSfx("net");
  if (event.fullTime) return playSfx("fullTime");
  if (event.halfTime || event.penaltyAwarded || event.card !== "none" || event.passive) return playSfx("whistle");
  switch (event.tag) {
    case "passed":
      return playSfx("pass");
    case "saved":
    case "blocked":
    case "corner":
      return playSfx("shot");
    case "intercepted":
    case "lost":
    case "missed":
      return playSfx("thud");
    default:
      return playSfx("clack");
  }
}

export function MatchScreen({ match, settings, onSettings, onRules, onFinish, onLeave }: MatchScreenProps) {
  const g = useGame(match.setup, { difficulty: match.difficulty, personality: match.personality });
  const { game, yourTurn } = g;
  const slot = useRef<HTMLDivElement>(null);
  const sq = useSquareSize(slot);
  const [menu, setMenu] = useState<"closed" | "open" | "leave">("closed");

  const legal = useMemo(() => (yourTurn ? legalActions(game) : []), [game, yourTurn]);
  const liveIds = useMemo(() => new Set(legal.filter((a) => a.kind !== "hold").map((a) => a.pieceId)), [legal]);
  const onlyHold = legal.length > 0 && legal.every((a) => a.kind === "hold");
  const penaltyTaker = yourTurn && game.phase === "penalty" ? (game.penaltyTakerId ?? game.carrierId) : null;
  const selectedId = penaltyTaker ?? g.selected;
  const selectedActions = useMemo(
    () => (selectedId === null ? [] : legal.filter((action) => action.pieceId === selectedId)),
    [legal, selectedId],
  );
  const targets = useMemo(() => targetsFor(game, selectedActions), [game, selectedActions]);
  const preview = useMemo(() => (g.pending === null ? null : previewAction(game, g.pending)), [game, g.pending]);
  const threat = useMemo(() => (yourTurn ? threatOf(game, "away") : null), [game, yourTurn]);
  const shotOn = threat?.on ?? false;
  const evalHome = useMemo(() => expectedScore(game, "home"), [game]);

  // During a goal's beat the board shows the shot going in, not the kick-off.
  const event = game.last;
  const replayGoal = g.busy && event !== null && event.goalFor !== null && g.before !== null;
  const shown = replayGoal && g.before !== null ? g.before : game;
  const pieces = shown.pieces.filter((piece) => onBoard(piece) || piece.cls === "keeper");
  const ballAt = replayGoal && event !== null ? event.to : carrierOf(game);
  const restedIds = useMemo(
    () => new Set(shown.pieces.filter((piece) => shown.ply < piece.restUntil).map((piece) => piece.id)),
    [shown],
  );
  const lastMove = event === null ? null : { from: event.from, to: event.to };
  const callout = g.busy && event !== null ? calloutFor(game, event) : null;

  useEffect(() => {
    if (event !== null) soundFor(event);
  }, [event]);

  useEffect(() => {
    if (shotOn) playSfx("bell");
  }, [shotOn, game.ply]);

  const finished = useRef(false);
  const done = game.phase === "fullTime" && !g.busy;
  useEffect(() => {
    if (!done || finished.current) return;
    finished.current = true;
    onFinish(game);
  }, [done, game, onFinish]);

  const { select, stage, play, pending } = g;
  const onTarget = useCallback(
    (target: BoardTarget) => {
      if (!yourTurn) return;
      if (target.chance === null) {
        play(target.action);
        return;
      }
      if (pending !== null && actionKey(pending) === target.key) {
        play(target.action);
        return;
      }
      stage(target.action);
    },
    [yourTurn, pending, play, stage],
  );

  const onPiece = useCallback(
    (piece: Piece) => {
      if (penaltyTaker !== null) return;
      select(piece.id === g.selected ? null : piece.id);
    },
    [penaltyTaker, select, g.selected],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (menu !== "closed") setMenu("closed");
      else if (pending !== null) stage(null);
      else select(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menu, pending, select, stage]);

  const inspected = selectedId === null ? null : game.pieces.find((piece) => piece.id === selectedId) ?? null;
  const boardHeight = (ROWS + 0.4) * sq;

  return (
    <div className={styles.match} data-screen="match">
      <TopBar game={game} sound={settings.sound} onMenu={() => setMenu("open")} onSound={() => onSettings({ sound: !settings.sound })} />

      <div className={styles.body}>
        <div className={styles.side}>
          {preview !== null && pending !== null ? (
            // The odds take the whole column while a risky action waits, so Play it is always in reach.
            <PreviewCard preview={preview} onConfirm={() => play(pending)} onCancel={() => stage(null)} />
          ) : (
            <>
              <StatusCard
                game={game}
                match={match}
                yourTurn={yourTurn}
                thinking={g.thinking}
                shotOn={shotOn}
                onlyHold={onlyHold}
                onHold={() => {
                  const hold = legal.find((action) => action.kind === "hold");
                  if (hold) play(hold);
                }}
              />
              {inspected !== null ? (
                <PieceCard piece={inspected} game={game} live={liveIds.has(inspected.id)} yourTurn={yourTurn} />
              ) : null}
            </>
          )}
        </div>

        <div className={styles.boardArea}>
          {settings.evalBar && sq > 0 ? (
            <div
              className={styles.evalBar}
              style={{ height: boardHeight }}
              role="meter"
              aria-label="Your chance of winning"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(evalHome * 100)}
              title={`Win chance ${Math.round(evalHome * 100)}%`}
            >
              <span className={styles.evalFill} style={{ height: `${evalHome * 100}%` }} />
              <span className={styles.evalMid} />
            </div>
          ) : null}
          <div className={styles.boardSlot} ref={slot}>
            {sq > 0 ? (
              <Board
                sq={sq}
                pieces={pieces}
                carrierId={replayGoal ? shown.carrierId : game.carrierId}
                ballAt={ballAt}
                selectedId={selectedId}
                liveIds={liveIds}
                restedIds={restedIds}
                targets={yourTurn ? targets : []}
                pendingKey={pending === null ? null : actionKey(pending)}
                lastMove={lastMove}
                threatLanes={shotOn && threat !== null ? threat.lanes : []}
                onPiece={onPiece}
                onTarget={onTarget}
              >
                {shotOn ? <span className={styles.shotOn}>Shot on!</span> : null}
                {callout !== null && callout.big !== null ? (
                  <div className={styles.banner} data-tone={callout.tone} role="status">
                    <span className={styles.bannerBig}>{callout.big}</span>
                    <span className={styles.bannerSmall}>{callout.small}</span>
                  </div>
                ) : null}
                {callout !== null && callout.big === null ? (
                  <span className={styles.toast} data-tone={callout.tone} role="status">
                    {callout.small}
                  </span>
                ) : null}
              </Board>
            ) : null}
          </div>
        </div>

        <div className={styles.side}>
          <MoveList moves={g.moves} />
        </div>
      </div>

      {menu !== "closed" ? (
        <div className={shell.overlay} role="dialog" aria-modal="true" aria-label="Match menu" onClick={() => setMenu("closed")}>
          <div className={`${shell.panel} ${shell.menuDialog}`} onClick={(e) => e.stopPropagation()}>
            {menu === "open" ? (
              <>
                <span className={shell.kicker}>Paused</span>
                <button type="button" className={`${shell.button} ${shell.primary}`} onClick={() => setMenu("closed")}>
                  <Icon name="play" size={18} /> Resume
                </button>
                <button type="button" className={shell.button} onClick={() => onSettings({ sound: !settings.sound })}>
                  <Icon name={settings.sound ? "sound" : "mute"} size={18} /> Sound {settings.sound ? "on" : "off"}
                </button>
                <button type="button" className={shell.button} onClick={() => onSettings({ evalBar: !settings.evalBar })}>
                  <span aria-hidden="true" style={{ width: 18, display: "inline-grid", placeItems: "center" }}>
                    ▮
                  </span>
                  Win bar {settings.evalBar ? "on" : "off"}
                </button>
                <button
                  type="button"
                  className={shell.button}
                  onClick={() => {
                    setMenu("closed");
                    onRules();
                  }}
                >
                  <Icon name="book" size={18} /> Rules
                </button>
                <button type="button" className={`${shell.button} ${shell.danger}`} onClick={() => setMenu("leave")}>
                  <Icon name="close" size={18} /> Leave match
                </button>
              </>
            ) : (
              <>
                <span className={shell.kicker}>Leave match?</span>
                <p className={shell.ruleBody}>This match will not count towards your record and pays nothing.</p>
                <button type="button" className={`${shell.button} ${shell.danger}`} onClick={onLeave}>
                  Leave
                </button>
                <button type="button" className={shell.button} onClick={() => setMenu("open")}>
                  Stay
                </button>
              </>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

/* ---- Top bar ------------------------------------------------------------------ */

function TopBar({ game, sound, onMenu, onSound }: { game: GameState; sound: boolean; onMenu: () => void; onSound: () => void }) {
  const holder = game.phase === "play" ? possession(game) : null;
  const clock = game.setup.config.attackClock;
  const left = game.actionsLeft.home + game.actionsLeft.away;
  const binned = game.pieces.filter((piece) => piece.offFor > 0);
  return (
    <header className={styles.topBar}>
      <button type="button" className={shell.iconButton} onClick={onMenu} aria-label="Menu">
        <Icon name="menu" />
      </button>
      <div className={styles.team}>
        <span className={`${styles.disc} ${styles.discHome}`} />
        <span className={styles.teamName}>You</span>
        <span className={styles.score} data-score="home">
          {game.score.home}
        </span>
      </div>
      <div className={styles.clock}>
        <span className={styles.clockText}>
          {game.phase === "fullTime"
            ? "Full time"
            : game.phase === "penalty"
              ? "Penalty"
              : `${game.half === 1 ? "1st" : "2nd"} half · ${left} moves left`}
        </span>
        {holder !== null && clock > 0 ? (
          <span
            className={styles.pips}
            data-low={game.attackClock <= 2 ? "" : undefined}
            role="meter"
            aria-label={`Attack clock: ${game.attackClock} of ${clock} actions left for ${holder === "home" ? "you" : "the rival"}`}
            aria-valuemin={0}
            aria-valuemax={clock}
            aria-valuenow={game.attackClock}
          >
            {Array.from({ length: clock }, (_, index) => (
              <span key={index} className={styles.pip} data-on={index < game.attackClock ? holder : undefined} />
            ))}
          </span>
        ) : null}
        {binned.length > 0 ? (
          <span className={styles.sinBin}>
            {binned.map((piece) => (
              <span key={piece.id} className={styles.sinBin}>
                <CardGlyph colour="red" size={11} /> {piece.card.shortName} {piece.offFor}
              </span>
            ))}
          </span>
        ) : null}
      </div>
      <div className={`${styles.team} ${styles.teamAway}`}>
        <span className={styles.score} data-score="away">
          {game.score.away}
        </span>
        <span className={styles.teamName}>{game.setup.away.name}</span>
        <span className={`${styles.disc} ${styles.discAway}`} />
      </div>
      <button type="button" className={shell.iconButton} onClick={onSound} aria-label={sound ? "Mute sound" : "Turn sound on"}>
        <Icon name={sound ? "sound" : "mute"} />
      </button>
    </header>
  );
}

/* ---- Left panel ---------------------------------------------------------------- */

function StatusCard({
  game,
  match,
  yourTurn,
  thinking,
  shotOn,
  onlyHold,
  onHold,
}: {
  game: GameState;
  match: QuickMatch;
  yourTurn: boolean;
  thinking: boolean;
  shotOn: boolean;
  onlyHold: boolean;
  onHold: () => void;
}) {
  let title: string;
  let hint: string;
  if (game.phase === "fullTime") {
    title = "Full time";
    hint = "Counting it up…";
  } else if (yourTurn && game.phase === "penalty") {
    title = "Penalty!";
    hint = "Pick your spot: top, middle or bottom of the goal.";
  } else if (yourTurn) {
    title = "Your move";
    hint = shotOn
      ? "Shot on! They can score from here. Close the lane, mark the receiver or win the ball."
      : possession(game) === "home"
        ? "Tap a piece, then a highlighted square."
        : "Win the ball back: tackle from beside, slide from two away.";
  } else if (thinking) {
    title = `${match.opponentName} is thinking`;
    hint = personalityInfo[match.personality].label;
  } else {
    title = "…";
    hint = "";
  }
  return (
    <div className={styles.card} data-status="">
      <span className={styles.label}>{game.phase === "play" && possession(game) === "home" ? "Your ball" : game.phase === "play" ? "Their ball" : " "}</span>
      <p className={styles.status} data-turn={yourTurn ? "you" : "rival"}>
        {title}
      </p>
      {hint ? <p className={styles.hint}>{hint}</p> : null}
      {onlyHold && yourTurn ? (
        <button type="button" className={`${shell.button} ${shell.primary}`} onClick={onHold}>
          Hold position
        </button>
      ) : null}
    </div>
  );
}

function PieceCard({ piece, game, live, yourTurn }: { piece: Piece; game: GameState; live: boolean; yourTurn: boolean }) {
  const traits = classTraits[piece.cls];
  const mine = piece.side === "home";
  let note: string | null = null;
  if (piece.offFor > 0) note = `Sent off: back in ${piece.offFor} actions.`;
  else if (game.ply < piece.restUntil) note = "On the floor after a missed challenge. Back next turn.";
  else if (mine && yourTurn && !live && piece.cls === "keeper") note = "The keeper only acts when he has the ball.";
  else if (mine && yourTurn && live) note = "Tap a highlighted square.";
  return (
    <div className={`${styles.card} ${styles.cardGrow}`} data-piece-card="">
      <div className={styles.pieceHead}>
        <span className={`${shell.chip} ${mine ? shell.chipHome : shell.chipAway}`} style={{ width: 34, height: 34 } as CSSProperties}>
          <ClassGlyph cls={piece.cls} size={18} />
        </span>
        <span style={{ minWidth: 0 }}>
          <span className={styles.pieceName}>{piece.card.shortName}</span>
          <span className={styles.pieceClass}>
            {mine ? "Your" : "Rival"} {traits.label} · {piece.card.position}
          </span>
        </span>
        <span className={styles.pieceRating}>{piece.card.rating}</span>
      </div>
      <p className={styles.trait}>
        <b>Moves</b> {traits.moves}.
      </p>
      <p className={styles.trait}>
        <b>Power</b> {traits.power}.
      </p>
      {piece.yellow ? (
        <p className={styles.trait}>
          <CardGlyph colour="yellow" size={11} /> Booked: another foul is a red.
        </p>
      ) : null}
      {note !== null ? <p className={styles.hint}>{note}</p> : null}
    </div>
  );
}

function PreviewCard({ preview, onConfirm, onCancel }: { preview: ActionPreview; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className={`${styles.card} ${styles.cardGrow}`} data-preview="">
      <span className={styles.label}>{preview.title}</span>
      <span className={styles.bigChance} data-low={preview.chance < 0.35 ? "" : undefined}>
        {percent(preview.chance)}
      </span>
      <div className={styles.actionsRow}>
        <button type="button" className={shell.button} onClick={onCancel}>
          Cancel
        </button>
        <button type="button" className={`${shell.button} ${shell.primary}`} onClick={onConfirm} data-confirm="">
          Play it
        </button>
      </div>
      <ul className={styles.lines}>
        {preview.lines.map((line) => (
          <li key={line.tag} className={styles.line}>
            <span>{line.label}</span>
            <b>{percent(line.p)}</b>
            <span className={styles.bar} data-bad={line.good ? undefined : ""}>
              <span style={{ width: `${line.p * 100}%` }} />
            </span>
          </li>
        ))}
      </ul>
      {preview.factors.length > 0 ? (
        <ul className={styles.factors} aria-label="Why">
          {preview.factors.map((factor, index) => (
            <li key={index}>
              <span>{factor.label}</span>
              <b>{formatFactor(factor)}</b>
            </li>
          ))}
        </ul>
      ) : null}
      {preview.note !== null ? <p className={styles.hint}>{preview.note}</p> : null}
    </div>
  );
}

/* ---- Move list ------------------------------------------------------------------- */

function MoveList({ moves }: { moves: readonly MoveLine[] }) {
  const list = useRef<HTMLOListElement>(null);
  useEffect(() => {
    const element = list.current;
    if (element !== null) element.scrollTop = element.scrollHeight;
  }, [moves.length]);
  return (
    <div className={`${styles.card} ${styles.cardGrow}`}>
      <span className={styles.label}>Moves</span>
      {moves.length === 0 ? <p className={styles.hint}>The move list fills in as you play. # is a goal, + is a shot on.</p> : null}
      <ol className={styles.moves} ref={list} aria-label="Move list">
        {moves.map((move) => (
          <li key={move.ply} className={styles.move} data-goal={move.tag === "goal" ? "" : undefined}>
            <span className={styles.moveNo}>{move.ply}</span>
            <span className={`${styles.sideDot} ${move.side === "home" ? styles.discHome : styles.discAway}`} />
            <span className={styles.moveText}>{move.text}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

