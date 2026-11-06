"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";

import { activeLoadout, useDecks } from "@/features/cards-decks";
import type { GameEntry } from "@/mocks/games";

import { useGameReturn } from "../../shared/hooks/use-game-return";
import type { GameId } from "../../types";
import type { GameState } from "../engine/state";
import {
  ensureMigrated,
  saveQuickSetup,
  settleMatch,
  updateSettings,
  useFootballChessSave,
  type MatchSettlement,
  type QuickSetup,
} from "../state/progress";
import { drawQuickMatch, squadFromLoadout, type QuickMatch } from "../state/squads";
import { setSoundEnabled } from "./audio";
import { footballChessFonts } from "./fonts";
import { MatchScreen } from "./match-screen";
import { RulesSheet } from "./rules";
import { HubScreen, PrematchScreen, RecordScreen, ResultScreen, SetupScreen } from "./screens";
import styles from "./football-chess.module.css";

/**
 * Football Chess: five a side on a chessboard pitch, one action a turn.
 *
 * The orchestrator owns which screen is showing and nothing else. Each match
 * is mounted under its own key, so a rematch starts from a clean slate.
 */

export type FootballChessProps = {
  game: GameId;
  entry: GameEntry;
};

type View =
  | { name: "hub" }
  | { name: "setup" }
  | { name: "record" }
  | { name: "prematch"; match: QuickMatch }
  | { name: "match"; match: QuickMatch }
  | { name: "result"; match: QuickMatch; game: GameState; settlement: MatchSettlement | null };

export function FootballChess(props: FootballChessProps) {
  void props;
  const save = useFootballChessSave();
  const decks = useDecks();
  const goBack = useGameReturn();
  const loadout = activeLoadout(decks, "football");
  const squad = useMemo(() => squadFromLoadout(loadout), [loadout]);
  const [view, setView] = useState<View>({ name: "hub" });
  const [rules, setRules] = useState(false);

  useEffect(() => {
    ensureMigrated();
  }, []);

  useEffect(() => {
    setSoundEnabled(save.settings.sound);
  }, [save.settings.sound]);

  const startQuick = useCallback(
    (quick: QuickSetup) => {
      saveQuickSetup(quick);
      setView({ name: "prematch", match: drawQuickMatch(quick, squad) });
    },
    [squad],
  );

  const playing = view.name === "match" ? view.match : null;
  const onFinish = useCallback(
    (game: GameState) => {
      if (playing === null) return;
      const settlement = settleMatch({
        id: playing.id,
        mode: "quick",
        opponent: playing.opponentName,
        difficulty: playing.difficulty,
        personality: playing.personality,
        scored: game.score.home,
        conceded: game.score.away,
      });
      setView({ name: "result", match: playing, game, settlement });
    },
    [playing],
  );

  let screen: ReactNode;
  switch (view.name) {
    case "hub":
      screen = (
        <HubScreen
          save={save}
          squad={squad}
          onQuick={() => setView({ name: "setup" })}
          onRules={() => setRules(true)}
          onRecord={() => setView({ name: "record" })}
          onBack={goBack}
        />
      );
      break;
    case "setup":
      screen = <SetupScreen initial={save.quick} squad={squad} onStart={startQuick} onBack={() => setView({ name: "hub" })} />;
      break;
    case "prematch":
      screen = (
        <PrematchScreen
          match={view.match}
          onKickOff={() => setView({ name: "match", match: view.match })}
          onBack={() => setView({ name: "setup" })}
        />
      );
      break;
    case "match":
      screen = (
        <MatchScreen
          key={view.match.id}
          match={view.match}
          settings={save.settings}
          onSettings={updateSettings}
          onRules={() => setRules(true)}
          onFinish={onFinish}
          onLeave={() => setView({ name: "hub" })}
        />
      );
      break;
    case "result":
      screen = (
        <ResultScreen
          match={view.match}
          game={view.game}
          settlement={view.settlement}
          onRematch={() => startQuick(save.quick)}
          onHub={() => setView({ name: "hub" })}
        />
      );
      break;
    case "record":
      screen = <RecordScreen save={save} onBack={() => setView({ name: "hub" })} />;
      break;
  }

  return (
    <div className={`${styles.root} ${footballChessFonts}`} data-game="football-chess">
      {screen}
      {rules ? <RulesSheet onClose={() => setRules(false)} /> : null}
    </div>
  );
}
