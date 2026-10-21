"use client";

import { useEffect, useMemo, useState } from "react";
import localFont from "next/font/local";
import Image from "next/image";
import type { ActionCard, PlayerCard } from "@/domain/cards";
import { activeLoadout, useDecks } from "@/features/cards-decks";
import { grantCards, settleCoinReward, useEconomy } from "@/features/economy";
import { actionCardForId, allActionCards, footballPlayerCards, playerCardForId, portraitForCard } from "@/features/packs";
import type { GameLauncherProps } from "../components/game-launcher";
import { useGameReturn } from "../shared/hooks/use-game-return";
import { currentHighlight, deckErrors, divisionFor, divisions, playerStyle, resolveChoice, routes, startMatch, starterDeck, tacticStyle, type Choice, type Deck, type Match, type Style } from "./rules";
import { markTutorialSeen, saveDeck, settleMatch, usePitchDuelCareer } from "./progress";
import { fictionalCards, promotionCard } from "./fictional-cards";
import styles from "./pitch-duel.module.css";

const pixelFont = localFont({ src: "./PixelifySans.ttf", display: "swap" });

type View = "home" | "club" | "league" | "guide" | "match" | "result";
const players = [...footballPlayerCards, ...fictionalCards];
const actions = allActionCards;
const player = (id: string) => players.find(c => c.id === id) ?? playerCardForId(id);
const action = (id: string) => actionCardForId(id);
const label = (style: Style) => style.toUpperCase();
const roleName = { attacker: "FORWARD", defender: "BACK LINE", goalkeeper: "KEEPER" };
const portrait = (card: PlayerCard) => portraitForCard(card);

export function PitchDuel({ entry }: GameLauncherProps) {
  const leave = useGameReturn(); const career = usePitchDuelCareer(); const economy = useEconomy(); const decks = useDecks();
  const [view, setView] = useState<View>("home"); const [draft, setDraft] = useState<Deck | null>(null); const [match, setMatch] = useState<Match | null>(null);
  const [choice, setChoice] = useState<Partial<Choice>>({}); const [reveal, setReveal] = useState(false); const [reward, setReward] = useState(""); const [notice, setNotice] = useState("");
  const ownedPlayers = economy.owned.playerCardIds.filter(id => players.some(p => p.id === id));
  const ownedActions = economy.owned.actionCardIds.filter(id => actions.some(a => a.id === id));
  const old = activeLoadout(decks, "football");
  const preferred = useMemo(() => ({ attackers: old?.attackers, defenders: old?.defenders, keeper: old?.keeperId ?? undefined, tactics: old?.actionCardIds }), [old]);
  useEffect(() => {
    if (career.deck || draft || ownedPlayers.length < 5) return;
    const seed = starterDeck(ownedPlayers, ownedActions, preferred, players, actions);
    if (seed.additions.length) grantCards({ id: "pitch-duel-reboot-starter-v2", actionCardIds: seed.additions, title: "PITCH DUEL STARTER TACTICS" });
    saveDeck(seed.deck);
  }, [career.deck, draft, ownedPlayers, ownedActions, preferred]);
  const deck = draft ?? career.deck;
  const errors = deck ? deckErrors(deck, ownedPlayers, ownedActions, players, actions) : ["Open your football starter pack to build a club"];
  const h = match ? currentHighlight(match, players, actions) : null;
  const last = match?.decisions.at(-1);
  const finished = Boolean(match && match.index === 6);
  const resultTitle = match ? (match.home > match.away ? "VICTORY" : match.home < match.away ? "DEFEAT" : "DRAW") : "";

  const update = (next: Deck) => { setDraft(next); setNotice(""); };
  const save = () => { if (!deck || errors.length) return; saveDeck(deck); setNotice("CLUB SAVED"); setView("home"); };
  const kickOff = () => { if (!deck || errors.length) { setView("club"); return; } saveDeck(deck); setMatch(startMatch(deck, career.points)); setChoice({}); setReveal(false); setReward(""); setView("match"); };
  const play = () => {
    if (!match || !h || !choice.playerId || !choice.tacticId || !choice.route) return;
    const next = resolveChoice(match, choice as Choice, players, actions); setMatch(next); setReveal(true);
  };
  const advance = () => {
    setReveal(false); setChoice({});
    if (finished && match) {
      setView("result");
      const settlement = settleMatch(match); const coins = match.home > match.away ? 120 : match.home === match.away ? 75 : 45;
      settleCoinReward({ id: `pitch-duel-reboot-${match.id}`, coins, title: "PITCH DUEL MATCH", subtitle: `${match.home}-${match.away} vs ${match.opponent}` });
      const prize = settlement.promoted ? promotionCard(settlement.promoted) : undefined;
      if (prize) grantCards({ id: `pitch-duel-promotion-${settlement.promoted}`, playerCardIds: [prize.id], title: `${divisions[settlement.promoted! - 1]} REWARD` });
      setReward(`${coins} COINS${settlement.promoted ? `  ·  PROMOTED TO ${divisions[settlement.promoted - 1]}` : ""}${prize ? `  ·  NEW CARD: ${prize.name} (FICTIONAL)` : ""}`);
    }
  };
  const showGuide = () => { markTutorialSeen(); setView("guide"); };
  const pick = (kind: "attackers" | "defenders" | "keeper", id: string) => {
    if (!deck) return;
    if (kind === "keeper") update({ ...deck, keeper: id });
    else { const selected = deck[kind]; update({ ...deck, [kind]: selected.includes(id) ? selected.filter(x => x !== id) : selected.length < 2 ? [...selected, id] : [selected[1], id] }); }
  };
  const toggleTactic = (id: string) => { if (!deck) return; update({ ...deck, tactics: deck.tactics.includes(id) ? deck.tactics.filter(x => x !== id) : deck.tactics.length < 8 ? [...deck.tactics, id] : deck.tactics }); };
  const roleCards = (role: PlayerCard["role"]) => ownedPlayers.map(player).filter((p): p is PlayerCard => Boolean(p && p.role === role));

  return <main className={`${styles.shell} ${pixelFont.className}`} aria-label={entry.title}>
    <div className={styles.top}><button onClick={view === "home" ? leave : () => setView("home")} aria-label="Back">←</button><span className={styles.brand}>⚽ PITCH DUEL</span><span className={styles.topRight}>DIV {divisionFor(career.points)} <i/> {career.points} PTS</span></div>
    {view === "home" && <div className={styles.home}>
      <div className={styles.hero}><div className={styles.horizon}/><div className={styles.heroCopy}><span className={styles.kicker}>SEASON 01 · SOLO LEAGUE</span><h1>MAKE<br/>THE MOMENT.</h1><p>Build your club. Read the pitch. Turn six highlights into a win.</p><button className={styles.primary} onClick={kickOff}>KICK OFF <b>→</b></button></div><div className={styles.playerSilhouette} aria-hidden="true"><PixelBall/></div><div className={styles.scoreBug}>YOUR CLUB <b>0 : 0</b> LEAGUE XI</div></div>
      <div className={styles.homeCards}><button onClick={() => setView("club")}><small>01 / YOUR CLUB</small><strong>BUILD DECK</strong><span>5 players · 8 tactics →</span></button><button onClick={() => setView("league")}><small>02 / ROAD TO THE TOP</small><strong>{divisions[divisionFor(career.points)-1]}</strong><span>{career.points % 9} / 9 points to promotion →</span></button><button onClick={showGuide}><small>03 / THE RULES</small><strong>HOW TO PLAY</strong><span>Six choices make the match →</span></button></div>
    </div>}
    {view === "guide" && <div className={styles.page}><header><small>FIELD MANUAL</small><h1>SIX MOMENTS. ONE MATCH.</h1><p>Play three attacks and defend three threats. Every goal comes from your decisions.</p></header><div className={styles.guideGrid}><article><b>01</b><h2>BUILD A CLUB</h2><p>Pick two attackers, two defenders, a keeper and eight tactics: three attack, three defence, two flexible.</p></article><article><b>02</b><h2>READ THE MOMENT</h2><p>Choose an eligible player, one tactic from your hand, and a route or response. Match the style tags to build momentum.</p></article><article><b>03</b><h2>PLAY THE SIX</h2><p>Used tactics leave your hand. Two of your eight will stay unused. Defensive responses can stop the opponent’s chain.</p></article></div><button className={styles.primary} onClick={() => setView("home")}>READY TO PLAY →</button></div>}
    {view === "club" && <div className={styles.club}><div className={styles.clubHeader}><div><small>CLUB HOUSE / 01</small><h1>BUILD YOUR FIVE</h1><p>Set the formation, then choose the eight tactics that fit your style.</p></div><button className={styles.primary} disabled={errors.length > 0} onClick={save}>SAVE CLUB →</button></div><div className={styles.clubBody}>
      <section className={styles.formation}><div className={styles.formationTop}><b>2 · 2 · 1</b><span>YOUR FORMATION</span></div><div className={styles.field}><div className={styles.pitchMarkings}/>{deck && [[...deck.attackers], [...deck.defenders], [deck.keeper]].map((line, i) => <div className={styles.fieldLine} key={i}>{line.map((id,j) => { const c=player(id); return <div className={styles.marker} key={i+"-"+j}><span>{c?.shortName.slice(0,2) ?? "?"}</span><small>{c?.shortName ?? "EMPTY"}</small></div>; })}</div>)}</div><div className={styles.styleSummary}><span>STYLE LINKS</span>{stylesList(deck?.tactics ?? []).map(s => <b key={s}>{label(s)}</b>)}</div></section>
      <section className={styles.collection}><div className={styles.sectionHead}><h2>PLAYER CARDS</h2><span>{ownedPlayers.length} OWNED</span></div><div className={styles.scrollArea}>{(["attacker","defender","goalkeeper"] as const).map(role => <div key={role}><h3>{roleName[role]} <small>{role === "goalkeeper" ? "1" : "2"} NEEDED</small></h3><div className={styles.cardRow}>{roleCards(role).map(c => { const selected = deck && (role === "attacker" ? deck.attackers.includes(c.id) : role === "defender" ? deck.defenders.includes(c.id) : deck.keeper === c.id); return <button className={`${styles.playerCard} ${selected ? styles.selected : ""}`} key={c.id} onClick={() => pick(role === "attacker" ? "attackers" : role === "defender" ? "defenders" : "keeper", c.id)}><span className={styles.portrait}>{portrait(c) ? <Image src={portrait(c)!} alt="" width={100} height={51} unoptimized/> : "♙"}</span><b>{c.shortName}</b><small>{c.rating} · {c.tier.toUpperCase()}{c.id.startsWith("pd2-") ? " · FICTIONAL" : ""}</small><em>{label(playerStyle(c))}</em></button>; })}</div></div>)}</div></section>
      <section className={styles.tactics}><div className={styles.sectionHead}><h2>TACTIC DECK</h2><span>{deck?.tactics.length ?? 0}/8</span></div><p>3 ATTACK · 3 DEFENCE · 2 FLEXIBLE</p><div className={styles.tacticList}>{(["attack","defense","special"] as const).map(category => <div key={category}><h3>{category === "special" ? "FLEXIBLE" : category.toUpperCase()}</h3>{ownedActions.map(action).filter((c): c is ActionCard => Boolean(c && c.category === category)).map(c => <button key={c.id} className={`${styles.tacticItem} ${deck?.tactics.includes(c.id) ? styles.selected : ""}`} onClick={() => toggleTactic(c.id)}><b>{c.title}</b><span>{label(tacticStyle(c))} · {c.tier.toUpperCase()}</span><i>{deck?.tactics.includes(c.id) ? "✓" : "+"}</i></button>)}</div>)}</div></section>
      </div><div className={styles.clubFooter}><span>{errors.length ? errors.join(" · ") : "READY FOR KICK OFF · ALL ROLES COVERED"}</span><b>{notice}</b></div></div>}
    {view === "league" && <div className={styles.page}><header><small>THE ROAD TO THE TOP</small><h1>SOLO LEAGUE</h1><p>Earn three points for a win, one for a draw. Climb every nine points.</p></header><div className={styles.leagueList}>{divisions.map((name,i) => <div key={name} className={i+1 === divisionFor(career.points) ? styles.currentDivision : ""}><strong>0{i+1}</strong><div><b>{name}</b><small>{i === 0 ? "START HERE" : `${i*9} POINTS TO UNLOCK`}</small></div><span>{i+1 < divisionFor(career.points) ? "CLEARED" : i+1 === divisionFor(career.points) ? "CURRENT" : "LOCKED"}</span></div>)}</div><button className={styles.primary} onClick={kickOff}>PLAY NEXT MATCH →</button></div>}
    {view === "match" && match && <div className={styles.match}><div className={styles.matchBar}><span>YOU</span><b>{match.home} <small>:</small> {match.away}</b><span>{match.opponent.toUpperCase()}</span><em>{h?.minute ?? 90}&apos;</em></div><div className={styles.matchBody}><div className={styles.stadium}><div className={`${styles.stadiumPitch} ${reveal ? last?.success ? styles.successPlay : styles.failedPlay : ""}`}><div className={styles.centerCircle}/><div className={styles.goalLeft}/><div className={styles.goalRight}/><div className={styles.spriteRow}>{[0,1,2,3,4].map((i)=><i key={i} className={styles.sprite}/>)}</div><div className={styles.ball}>●</div><div className={styles.rivalRow}>{[0,1,2,3,4].map((i)=><i key={i} className={styles.rival}/>)}</div></div><div className={styles.reel}><span>{h ? `${h.minute}' ${h.title.toUpperCase()}` : "FULL TIME"}</span><div>{match.decisions.map((d,i)=><i className={d.success ? styles.good : styles.bad} key={i} title={d.explanation}/>)}</div><span>{6-match.index} MOMENTS LEFT</span></div></div><section className={styles.decisionPanel}>{reveal && last ? <div className={styles.outcome}><small>HIGHLIGHT {match.index}/6</small><h2>{last.success ? match.index % 2 === 0 ? "STOPPED!" : "MOMENT WON!" : "MOMENT LOST"}</h2><p>{last.explanation}</p><div className={styles.outcomeStats}><b>{last.score}</b> DECISION / <b>{last.threshold}</b> CHALLENGE <span>· {last.links} LINKS · {last.momentum} MOMENTUM</span></div><button className={styles.primary} onClick={advance}>{finished ? "FULL TIME →" : "NEXT HIGHLIGHT →"}</button></div> : h ? <><small className={styles.kicker}>{h.phase === "attack" ? "ATTACK" : "DEFEND"} / HIGHLIGHT {h.index+1} OF 6</small><h2>{h.title.toUpperCase()}</h2><p>{h.phase === "attack" ? `The pitch opens ahead. Their back line expects a ${h.threat} route.` : `The opponent threatens a ${h.threat} move. Read it and respond.`}</p><div className={styles.choiceBlock}><b>1 / PICK A PLAYER</b><div>{h.playerOptions.map(id => { const c=player(id); return c && <button className={choice.playerId === id ? styles.selected : ""} key={id} onClick={() => setChoice({ ...choice, playerId:id })}>{c.shortName}<small>{c.rating} · {label(playerStyle(c))}</small></button>; })}</div></div><div className={styles.choiceBlock}><b>2 / PLAY A TACTIC</b><div>{h.hand.map(id => { const c=action(id); return c && <button className={choice.tacticId === id ? styles.selected : ""} key={id} onClick={() => setChoice({ ...choice, tacticId:id })}>{c.title}<small>{label(tacticStyle(c))} · +{c.power}</small></button>; })}</div></div><div className={styles.choiceBlock}><b>3 / CHOOSE A {h.phase === "attack" ? "ROUTE" : "RESPONSE"}</b><div>{routes[h.phase].map(r => <button className={choice.route === r.style ? styles.selected : ""} key={r.style} onClick={() => setChoice({ ...choice, route:r.style })}>{r.title}<small>{r.description}</small></button>)}</div></div><div className={styles.choiceFooter}><span>{choice.playerId && choice.tacticId && choice.route ? `${Number(playerStyle(player(choice.playerId)!) === choice.route)+Number(tacticStyle(action(choice.tacticId)!) === choice.route)+Number(match.lastStyle === choice.route)} STYLE LINKS · ${match.momentum} MOMENTUM` : "SELECT ALL THREE TO PLAY"}</span><button className={styles.primary} disabled={!choice.playerId || !choice.tacticId || !choice.route} onClick={play}>PLAY THE MOMENT →</button></div></> : null}</section></div></div>}
    {view === "result" && match && <div className={styles.result}><small>FULL TIME · {match.opponent.toUpperCase()}</small><h1>{resultTitle}</h1><div className={styles.finalScore}><span>YOU</span><b>{match.home} : {match.away}</b><span>{match.opponent.toUpperCase()}</span></div><p>{reward}</p><div className={styles.resultNotes}>{match.decisions.map((d,i) => <div key={i}><b>{[8,21,36,57,72,89][i]}&apos;</b><span>{d.explanation}</span><strong>{d.success ? "✓" : "×"}</strong></div>)}</div><div className={styles.resultActions}><button className={styles.primary} onClick={kickOff}>NEXT MATCH →</button><button onClick={() => setView("home")}>CLUB HOUSE</button></div></div>}
    {view !== "match" && <div className={styles.orientation}>ROTATE YOUR PHONE FOR THE FULL PITCH ↻</div>}
  </main>;
}

function stylesList(ids: string[]): Style[] { return [...new Set(ids.map(id => action(id)).filter((c): c is ActionCard => Boolean(c)).map(tacticStyle))]; }

function PixelBall() { return <svg viewBox="0 0 16 16" shapeRendering="crispEdges" aria-hidden="true"><path fill="#102b1b" d="M5 0h6v1h2v1h1v1h1v2h1v6h-1v2h-1v1h-1v1h-2v1H5v-1H3v-1H2v-1H1v-2H0V5h1V3h1V2h1V1h2z"/><path fill="#f4e6bc" d="M5 1h6v1h2v1h1v2h1v6h-1v2h-1v1h-2v1H5v-1H3v-1H2v-2H1V5h1V3h1V2h2z"/><path fill="#193e29" d="M6 5h4v1h1v4h-1v1H6v-1H5V6h1zM3 2h2v2H3zM11 2h2v2h-2zM1 7h2v3H1zM13 7h2v3h-2zM4 12h3v3H5v-1H4zM9 12h3v2h-1v1H9z"/><path fill="#7aa967" d="M5 4h1v2H5zM10 4h1v2h-1zM3 10h2v1H3zM11 10h2v1h-2zM7 11h2v2H7z"/><path fill="#f8b665" d="M7 6h2v1H7zM6 8h1v2H6z"/></svg>; }
