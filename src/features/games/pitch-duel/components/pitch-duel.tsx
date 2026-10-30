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
import { academyCards, academyIds } from "@/mocks/packs/pitch-duel-academy";
import { fictionalCards } from "@/mocks/packs/pitch-duel-fictional";

import type { GameLauncherProps } from "../../components/game-launcher";
import { useGameReturn } from "../../shared/hooks/use-game-return";
import { defaultClub, lineupErrors, type ClubSetup } from "../engine/lineup";
import { createMatch } from "../engine/match";
import { divisionFor, draftOpponent, teamFromClub, type Opponent } from "../engine/setup";
import type { MatchState } from "../engine/types";
import { ensureMigrated, markTutorialSeen, saveClub, settleMatch, usePitchDuelCareer, type MatchSettlement } from "../state/progress";

import { pitchDuelFonts } from "./fonts";
import { HomeScreen } from "./home-screen";
import { GuideScreen, LeagueScreen, PrematchScreen, SummaryScreen } from "./hub-screens";
import { CoinIcon, FlameIcon } from "./icons";
import { LineupEditor } from "./lineup-editor";
import { MatchScreen } from "./match-screen";
import styles from "./pitch-duel.module.css";

type View = "home" | "lineup" | "league" | "guide" | "prematch" | "match" | "summary";

const players: PlayerCard[] = [...footballPlayerCards, ...fictionalCards, ...academyCards];
const byId = new Map(players.map((c) => [c.id, c]));
const cardFor = (id: string): PlayerCard | undefined => byId.get(id) ?? playerCardForId(id);
const actionFor = (id: string): ActionCard | undefined => actionCardForId(id);
const pools = { attackers: footballAttackers, defenders: footballDefenders, keepers: footballGoalkeepers };

/**
 * Pitch Duel: Ballers-style card football, eleven a side — a zone ladder, one
 * duel per decision, set-piece pick-ems — with a CPU that commits its counter
 * in secret. This component owns the screen flow and the career hand-offs.
 * Its look is its own (see docs/PITCH-DUEL.md), not the StatOz system.
 */
export function PitchDuel({ entry }: GameLauncherProps) {
  const leave = useGameReturn();
  const career = usePitchDuelCareer();
  const economy = useEconomy();
  const decks = useDecks();

  const [view, setView] = useState<View>("home");
  const [opponent, setOpponent] = useState<Opponent | null>(null);
  const [match, setMatch] = useState<MatchState | null>(null);
  const [session, setSession] = useState(0);
  const [final, setFinal] = useState<{ state: MatchState; settlement: MatchSettlement } | null>(null);

  useEffect(() => ensureMigrated(), []);

  // Academy players are always on the books, so any collection can field eleven.
  const ownedPlayers = useMemo(
    () => [...new Set([...economy.owned.playerCardIds.filter((id) => cardFor(id)), ...academyIds])],
    [economy.owned.playerCardIds],
  );
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

  const scout = useCallback(() => {
    if (!club || lineupErrors(club, ownedPlayers, ownedActions, cardFor).length) {
      setView("lineup");
      return;
    }
    setOpponent(draftOpponent(divisionFor(career.points), pools, Math.random));
    setView("prematch");
  }, [club, ownedPlayers, ownedActions, career.points]);

  const kickOff = useCallback(() => {
    if (!club || !opponent) return;
    const division = divisionFor(career.points);
    const seed = Math.floor(Math.random() * 0xffffffff);
    const home = teamFromClub(club, "YOU", cardFor, actionFor);
    setMatch(
      createMatch({
        id: `pd4-${Date.now().toString(36)}-${seed.toString(36)}`,
        seed,
        division,
        opponentName: opponent.name,
        home,
        away: opponent.team,
        firstKickoff: Math.random() < 0.5 ? "home" : "away",
      }),
    );
    setSession((n) => n + 1);
    setView("match");
  }, [club, opponent, career.points]);

  const finish = useCallback((state: MatchState) => {
    const settlement = settleMatch(state);
    setFinal({ state, settlement });
    setView("summary");
  }, []);

  if (view === "match" && match) {
    return (
      <div className={`${styles.shell} ${pitchDuelFonts}`} data-pitch-duel-screen="match">
        <MatchScreen
          key={session}
          initial={match}
          haptics={career.settings.haptics}
          tacticTitles={tacticTitles}
          onFinish={finish}
          onQuit={() => setView("home")}
        />
      </div>
    );
  }

  const back = () => (view === "home" ? leave() : setView("home"));
  const titles: Record<View, string> = {
    home: "",
    lineup: "LINEUP",
    league: "LEAGUE",
    guide: "HOW TO PLAY",
    prematch: "MATCHDAY",
    match: "",
    summary: "FULL-TIME",
  };

  return (
    <main className={`${styles.shell} ${pitchDuelFonts}`} aria-label={entry.title} data-pitch-duel-screen={view}>
      <header className={styles.top}>
        <button type="button" className={styles.roundButton} onClick={back} aria-label={view === "home" ? "Leave Pitch Duel" : "Back"}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
            <path d="M15 5l-7 7 7 7" />
          </svg>
          <span>{view === "home" ? "EXIT" : "RETURN"}</span>
        </button>
        {titles[view] ? <span className={styles.topTitle}>{titles[view]}</span> : <span />}
        <span className={styles.counters}>
          <span className={styles.counter} aria-label={`${economy.coins} coins`}>
            <CoinIcon />
            {economy.coins}
          </span>
          <span className={styles.counter} aria-label={`Win streak ${career.currentStreak}, best ${career.bestStreak}`}>
            <FlameIcon />
            {career.currentStreak}
          </span>
        </span>
      </header>

      <div className={styles.body}>
        {view === "home" ? (
          <HomeScreen
            career={career}
            club={club}
            cardFor={cardFor}
            onPlay={scout}
            onLineup={() => setView("lineup")}
            onLeague={() => setView("league")}
            onGuide={() => setView("guide")}
          />
        ) : null}
        {view === "lineup" ? (
          club ? (
            <LineupEditor
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
            <p className={styles.lead}>You need a keeper to build a club. Open your football starter pack, then come back.</p>
          )
        ) : null}
        {view === "prematch" && club && opponent ? (
          <PrematchScreen
            club={club}
            opponent={opponent}
            division={divisionFor(career.points)}
            cardFor={cardFor}
            onKickOff={kickOff}
            onReroll={() => setOpponent(draftOpponent(divisionFor(career.points), pools, Math.random))}
          />
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
          <SummaryScreen state={final.state} settlement={final.settlement} onNext={scout} onClub={() => setView("home")} />
        ) : null}
      </div>
    </main>
  );
}
