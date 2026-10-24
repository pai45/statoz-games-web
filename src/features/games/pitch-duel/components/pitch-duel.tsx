"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import type { ActionCard, PlayerCard } from "@/domain/cards";
import { activeLoadout, useDecks } from "@/features/cards-decks";
import { useEconomy } from "@/features/economy";
import {
  actionCardForId,
  footballAttackers,
  footballDefenders,
  footballGoalkeepers,
  footballPlayerCards,
  playerCardForId,
} from "@/features/packs";
import { fictionalCards } from "@/mocks/packs/pitch-duel-fictional";

import type { GameLauncherProps } from "../../components/game-launcher";
import { GameMatchGate, matchmakingFighter, useMatchmakingPlayer } from "../../shared/components/matchmaking";
import { useGameReturn } from "../../shared/hooks/use-game-return";
import { defaultClub, lineupErrors, type ClubSetup } from "../engine/lineup";
import { createMatch } from "../engine/match";
import { divisionFor, divisions, draftOpponent, teamFromClub } from "../engine/setup";
import type { MatchState } from "../engine/types";
import { ensureMigrated, markTutorialSeen, saveClub, settleMatch, usePitchDuelCareer, type MatchSettlement } from "../state/progress";

import { GuideScreen, HomeScreen, LeagueScreen, LineupScreen, SummaryScreen } from "./hub-screens";
import { MatchScreen } from "./match-screen";
import styles from "./pitch-duel.module.css";

type View = "home" | "lineup" | "league" | "guide" | "prematch" | "match" | "summary";

const players: PlayerCard[] = [...footballPlayerCards, ...fictionalCards];
const byId = new Map(players.map((c) => [c.id, c]));
const cardFor = (id: string): PlayerCard | undefined => byId.get(id) ?? playerCardForId(id);
const actionFor = (id: string): ActionCard | undefined => actionCardForId(id);
const pools = { attackers: footballAttackers, defenders: footballDefenders, keepers: footballGoalkeepers };

/**
 * Pitch Duel: Ballers-style card football — a zone ladder, one duel per
 * decision, set-piece pick-ems — with a CPU that commits its counter in
 * secret. This component owns the screen flow and the career hand-offs.
 */
export function PitchDuel({ entry }: GameLauncherProps) {
  const leave = useGameReturn();
  const career = usePitchDuelCareer();
  const economy = useEconomy();
  const decks = useDecks();
  const player = useMatchmakingPlayer(`DIV ${divisionFor(career.points)}`);

  const [view, setView] = useState<View>("home");
  const [match, setMatch] = useState<MatchState | null>(null);
  const [session, setSession] = useState(0);
  const [final, setFinal] = useState<{ state: MatchState; settlement: MatchSettlement } | null>(null);

  useEffect(() => ensureMigrated(), []);

  const ownedPlayers = useMemo(() => economy.owned.playerCardIds.filter((id) => cardFor(id)), [economy.owned.playerCardIds]);
  const ownedActions = useMemo(() => economy.owned.actionCardIds.filter((id) => actionFor(id)), [economy.owned.actionCardIds]);
  const loadout = activeLoadout(decks, "football");

  // The saved club if it is still legal, else a fresh one from what is owned.
  const club = useMemo<ClubSetup | null>(() => {
    if (career.club && !lineupErrors(career.club, ownedPlayers, ownedActions, cardFor).length) return career.club;
    return defaultClub(ownedPlayers, ownedActions, cardFor, loadout ?? undefined, (id) => actionFor(id)?.category);
  }, [career.club, ownedPlayers, ownedActions, loadout]);

  const tacticTitles = useMemo(
    () => Object.fromEntries((club?.tactics ?? []).map((id) => [id, actionFor(id)?.title.toUpperCase() ?? "TACTIC"])),
    [club],
  );

  const kickOff = useCallback(() => {
    if (!club || lineupErrors(club, ownedPlayers, ownedActions, cardFor).length) {
      setView("lineup");
      return;
    }
    const division = divisionFor(career.points);
    const seed = Math.floor(Math.random() * 0xffffffff);
    const opponent = draftOpponent(division, pools, Math.random);
    const home = teamFromClub(club, "YOU", cardFor, actionFor);
    setMatch(createMatch({ id: `pd3-${Date.now().toString(36)}-${seed.toString(36)}`, seed, division, opponentName: opponent.name, home, away: opponent.team, firstKickoff: Math.random() < 0.5 ? "home" : "away" }));
    setSession((n) => n + 1);
    setView("prematch");
  }, [club, ownedPlayers, ownedActions, career.points]);

  const finish = useCallback((state: MatchState) => {
    const settlement = settleMatch(state);
    setFinal({ state, settlement });
    setView("summary");
  }, []);

  if (view === "prematch" && match) {
    return (
      <GameMatchGate
        goLabel="KICK OFF!"
        config={{
          title: "PITCH DUEL",
          subtitle: divisions[match.division - 1],
          queueLabel: "SCOUTING THE LEAGUE",
          player,
          opponent: matchmakingFighter(match.opponentName, `DIV ${match.division}`),
        }}
        onReady={() => setView("match")}
        onCancel={() => setView("home")}
      />
    );
  }

  if (view === "match" && match) {
    return (
      <MatchScreen
        key={session}
        initial={match}
        haptics={career.settings.haptics}
        tacticTitles={tacticTitles}
        onFinish={finish}
        onQuit={() => setView("home")}
      />
    );
  }

  const back = () => (view === "home" ? leave() : setView("home"));
  const titles: Record<View, string> = {
    home: "", lineup: "LINEUP", league: "LEAGUE", guide: "HOW TO PLAY", prematch: "", match: "", summary: "RESULT",
  };

  return (
    <main className={styles.shell} aria-label={entry.title} data-pitch-duel-screen={view}>
      <header className={styles.top}>
        <button type="button" className={styles.back} onClick={back} aria-label={view === "home" ? "Leave Pitch Duel" : "Back"}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>
        <span className={styles.brand}>
          <span>PITCH DUEL</span>{titles[view] ? ` / ${titles[view]}` : ""}
        </span>
        <span className={`${styles.plate} ${styles.chip}`}>DIV {divisionFor(career.points)} · {career.points} PTS</span>
      </header>

      <div className={styles.body}>
        {view === "home" ? (
          <HomeScreen
            career={career}
            club={club}
            cardFor={cardFor}
            onKickOff={kickOff}
            onLineup={() => setView("lineup")}
            onLeague={() => setView("league")}
            onGuide={() => setView("guide")}
          />
        ) : null}
        {view === "lineup" ? (
          club ? (
            <LineupScreen
              initial={club}
              ownedPlayers={ownedPlayers}
              ownedActions={ownedActions}
              cardFor={cardFor}
              actionFor={actionFor}
              onSave={(next) => {
                saveClub(next);
                setView("home");
              }}
            />
          ) : (
            <p className={styles.lead}>You need at least a keeper and four outfield players. Open your football starter pack, then come back.</p>
          )
        ) : null}
        {view === "league" ? <LeagueScreen career={career} /> : null}
        {view === "guide" ? (
          <GuideScreen
            onReady={() => {
              markTutorialSeen();
              setView("home");
            }}
          />
        ) : null}
        {view === "summary" && final ? (
          <SummaryScreen state={final.state} settlement={final.settlement} onNext={kickOff} onClub={() => setView("home")} />
        ) : null}
      </div>
    </main>
  );
}
