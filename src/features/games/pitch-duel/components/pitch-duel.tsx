"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";

import type { ActionCard, PlayerCard } from "@/domain/cards";
import { activeLoadout, useDecks } from "@/features/cards-decks";
import { useEconomy, useIsEconomyHydrated } from "@/features/economy";
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
import { publicAsset } from "@/shared/config/base-path";

import type { GameLauncherProps } from "../../components/game-launcher";
import { useGameReturn } from "../../shared/hooks/use-game-return";
import { draftDebut } from "../engine/debut";
import { defaultClub, lineupErrors, type ClubSetup } from "../engine/lineup";
import { createMatch } from "../engine/match";
import { divisionFor, draftOpponent, teamFromClub, type Opponent } from "../engine/setup";
import type { MatchState } from "../engine/types";
import { needsDebut } from "../state/career-schema";
import {
  claimDebut,
  debutGrantId,
  ensureMigrated,
  markTutorialSeen,
  saveClub,
  saveDebutDraw,
  settleMatch,
  usePitchDuelCareer,
  type MatchSettlement,
} from "../state/progress";

import { PitchDuelAudio, SoundContext } from "./audio";
import { DebutReveal, type DebutExit } from "./debut-reveal";
import { pitchDuelFonts } from "./fonts";
import { HomeScreen } from "./home-screen";
import { GuideScreen, LeagueScreen, PrematchScreen, SummaryScreen } from "./hub-screens";
import { CoinIcon, FlameIcon } from "./icons";
import { LineupEditor } from "./lineup-editor";
import { MatchScreen } from "./match-screen";
import { SoundToggle } from "./ui";
import styles from "./pitch-duel.module.css";

type View = "home" | "lineup" | "league" | "guide" | "prematch" | "match" | "summary" | "replay";

const players: PlayerCard[] = [...footballPlayerCards, ...fictionalCards, ...academyCards];
const byId = new Map(players.map((c) => [c.id, c]));
const cardFor = (id: string): PlayerCard | undefined => byId.get(id) ?? playerCardForId(id);
const actionFor = (id: string): ActionCard | undefined => actionCardForId(id);
const pools = { attackers: footballAttackers, defenders: footballDefenders, keepers: footballGoalkeepers };

/**
 * Fot Duel: Ballers-style card football, eleven a side — a zone ladder, one
 * duel per decision, set-piece pick-ems — with a CPU that commits its counter
 * in secret. This component owns the screen flow, the sound and the career
 * hand-offs. A first-time player opens with the debut XI reveal. Its look is
 * its own (see docs/PITCH-DUEL.md), not the StatOz system.
 */
export function PitchDuel({ entry }: GameLauncherProps) {
  const leave = useGameReturn();
  const career = usePitchDuelCareer();
  const economy = useEconomy();
  const hydrated = useIsEconomyHydrated();
  const decks = useDecks();

  const [view, setView] = useState<View>("home");
  const [opponent, setOpponent] = useState<Opponent | null>(null);
  const [match, setMatch] = useState<MatchState | null>(null);
  const [session, setSession] = useState(0);
  const [final, setFinal] = useState<{ state: MatchState; settlement: MatchSettlement } | null>(null);

  useEffect(() => ensureMigrated(), []);

  /* ---- Sound: created once, unlocked by the first tap, muted from the career setting. ---- */
  const [audio] = useState(() => new PitchDuelAudio(publicAsset("/games/pitch-duel/audio/")));
  const soundOn = career.settings.sound;
  useEffect(() => {
    const unlock = () => audio.unlock();
    const onVisibility = () => (document.hidden ? audio.suspend() : audio.resume());
    window.addEventListener("pointerdown", unlock, true);
    window.addEventListener("keydown", unlock, true);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("pointerdown", unlock, true);
      window.removeEventListener("keydown", unlock, true);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [audio]);
  useEffect(() => () => audio.dispose(), [audio]);
  useEffect(() => audio.setEnabled(soundOn), [audio, soundOn]);

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

  /* ---- Debut XI: a first-time player signs eleven before anything else. ---- */
  const debutDue = hydrated && needsDebut(career) && !economy.settledRewardIds.includes(debutGrantId);
  const ownedIds = economy.owned.playerCardIds;
  useEffect(() => {
    if (!debutDue || career.debut) return;
    // Drawn once and saved before the reveal plays, so a reload shows the same eleven.
    saveDebutDraw(draftDebut({ outfield: [...footballAttackers, ...footballDefenders], keepers: footballGoalkeepers }, Math.random, new Set(ownedIds)));
  }, [debutDue, career.debut, ownedIds]);

  // Away from the pitch the crowd is a murmur. The match, the reveal and the
  // full-time screen set their own (their effects run before this one).
  useEffect(() => {
    if (view === "match" || view === "replay" || view === "summary" || debutDue) return;
    audio.crowd(0.2);
    audio.chant(0);
  }, [audio, view, debutDue]);

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

  const signDebut = (exit: DebutExit) => {
    claimDebut(club?.tactics ?? []);
    if (exit === "play") {
      setOpponent(draftOpponent(divisionFor(career.points), pools, Math.random));
      setView("prematch");
    } else setView("home");
  };

  const fullscreen = (screen: string, children: ReactNode) => (
    <SoundContext.Provider value={audio}>
      <div className={`${styles.shell} ${pitchDuelFonts}`} data-pitch-duel-screen={screen}>
        {children}
      </div>
    </SoundContext.Provider>
  );

  if (view === "home" && debutDue) {
    return fullscreen("debut", career.debut ? <DebutReveal key="debut" squad={career.debut} cardFor={cardFor} onDone={signDebut} /> : null);
  }

  if (view === "replay" && career.debut) {
    return fullscreen("debut", <DebutReveal key="replay" squad={career.debut} cardFor={cardFor} replay onDone={() => setView("guide")} />);
  }

  if (view === "match" && match) {
    return fullscreen(
      "match",
      <MatchScreen
        key={session}
        initial={match}
        haptics={career.settings.haptics}
        tacticTitles={tacticTitles}
        onFinish={finish}
        onQuit={() => setView("home")}
      />,
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
    replay: "",
  };

  return (
    <SoundContext.Provider value={audio}>
      <main className={`${styles.shell} ${pitchDuelFonts}`} aria-label={entry.title} data-pitch-duel-screen={view}>
        <header className={styles.top}>
          <button type="button" className={styles.roundButton} onClick={back} aria-label={view === "home" ? "Leave Fot Duel" : "Back"}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
              <path d="M15 5l-7 7 7 7" />
            </svg>
            <span>{view === "home" ? "EXIT" : "RETURN"}</span>
          </button>
          {titles[view] ? <span className={styles.topTitle}>{titles[view]}</span> : <span />}
          <span className={styles.counters}>
            <SoundToggle />
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
              onReplayDebut={career.debut?.claimed ? () => setView("replay") : undefined}
            />
          ) : null}
          {view === "summary" && final ? (
            <SummaryScreen state={final.state} settlement={final.settlement} onNext={scout} onClub={() => setView("home")} />
          ) : null}
        </div>
      </main>
    </SoundContext.Provider>
  );
}
