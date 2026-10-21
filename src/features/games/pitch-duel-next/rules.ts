import type { ActionCard, PlayerCard } from "@/domain/cards";

export type Style = "passing" | "direct" | "pressing" | "cover";
export type Phase = "attack" | "defend";
export type Deck = { attackers: string[]; defenders: string[]; keeper: string; tactics: string[] };
export type Choice = { playerId: string; tacticId: string; route: Style };
export type Highlight = {
  index: number; minute: number; phase: Phase; title: string; threat: Style;
  hand: string[]; playerOptions: string[]; used: string[];
};
export type Decision = {
  choice: Choice; success: boolean; score: number; threshold: number;
  links: number; explanation: string; momentum: number; home: number; away: number;
};
export type Match = { id: string; division: number; opponent: string; deck: Deck; seed: number; index: number; used: string[]; momentum: number; lastStyle: Style | null; home: number; away: number; decisions: Decision[] };

export const minutes = [8, 21, 36, 57, 72, 89];
export const divisions = ["LOCAL LEAGUE", "CITY CIRCUIT", "REGIONAL CUP", "NATIONAL LEAGUE", "CHAMPIONS DIVISION"];
export const opponents = ["Mill Town", "Harbour FC", "Northside", "Union Eleven", "Royal Borough"];
export const styles: Style[] = ["passing", "direct", "pressing", "cover"];
export const routes: Record<Phase, { style: Style; title: string; description: string }[]> = {
  attack: [
    { style: "passing", title: "Work the gap", description: "Short passing creates space" },
    { style: "direct", title: "Break the line", description: "Run at goal quickly" },
    { style: "pressing", title: "Win it high", description: "Force a mistake near goal" },
    { style: "cover", title: "Switch wide", description: "Pull the back line apart" },
  ],
  defend: [
    { style: "passing", title: "Read the pass", description: "Cut out the next ball" },
    { style: "direct", title: "Meet the runner", description: "Stop the break early" },
    { style: "pressing", title: "Close down", description: "Deny time on the ball" },
    { style: "cover", title: "Hold shape", description: "Protect the dangerous lane" },
  ],
};

function hash(value: string): number { let n = 2166136261; for (const c of value) n = Math.imul(n ^ c.charCodeAt(0), 16777619); return n >>> 0; }
function roll(seed: number, salt: number): number { let n = (seed ^ Math.imul(salt + 1, 0x9e3779b1)) >>> 0; n ^= n << 13; n ^= n >>> 17; n ^= n << 5; return (n >>> 0) / 4294967296; }
export function tacticStyle(card: ActionCard): Style { return styles[(Number(card.id.match(/^act(\d+)/)?.[1] ?? 1) - 1) % 4]; }
export function playerStyle(card: PlayerCard): Style { const t = card.trait.toLowerCase(); if (/pass|playmak|vision|creative/.test(t)) return "passing"; if (/pace|speed|shot|finis|attack/.test(t)) return "direct"; if (/press|work|tack|intercept/.test(t)) return "pressing"; if (/block|defen|position|save|keeper/.test(t)) return "cover"; return styles[hash(card.id) % 4]; }
export function divisionFor(points: number): number { return Math.min(5, Math.floor(Math.max(0, points) / 9) + 1); }
export function deckErrors(deck: Deck, ownedPlayers: string[], ownedActions: string[], players: PlayerCard[], actions: ActionCard[]): string[] {
  const errors: string[] = [];
  const byPlayer = new Map(players.map(c => [c.id, c])); const byAction = new Map(actions.map(c => [c.id, c]));
  const all = [...deck.attackers, ...deck.defenders, deck.keeper];
  if (deck.attackers.length !== 2 || deck.attackers.some(id => byPlayer.get(id)?.role !== "attacker")) errors.push("Choose two attackers");
  if (deck.defenders.length !== 2 || deck.defenders.some(id => byPlayer.get(id)?.role !== "defender")) errors.push("Choose two defenders");
  if (byPlayer.get(deck.keeper)?.role !== "goalkeeper") errors.push("Choose a keeper");
  if (new Set(all).size !== 5 || all.some(id => !ownedPlayers.includes(id))) errors.push("Squad must use five different owned players");
  if (deck.tactics.length !== 8 || new Set(deck.tactics).size !== 8 || deck.tactics.some(id => !ownedActions.includes(id) || !byAction.has(id))) errors.push("Choose eight different owned tactics");
  const counts = { attack: 0, defense: 0, special: 0 }; for (const id of deck.tactics) { const c = byAction.get(id); if (c) counts[c.category]++; }
  if (counts.attack < 3 || counts.defense < 3 || counts.special < 2) errors.push("Use at least 3 attack, 3 defence and 2 flexible tactics");
  return errors;
}
export function starterDeck(ownedPlayers: string[], ownedActions: string[], preferred: Partial<Deck>, players: PlayerCard[], actions: ActionCard[]): { deck: Deck; additions: string[] } {
  const pickPlayers = (role: PlayerCard["role"], count: number, prior: string[]) => [...new Set([...prior, ...ownedPlayers])].filter(id => ownedPlayers.includes(id) && players.find(c => c.id === id)?.role === role).slice(0, count);
  const tactics: string[] = []; const additions: string[] = [];
  for (const [category, count] of [["attack", 3], ["defense", 3], ["special", 2]] as const) {
    const wanted = [...new Set([...(preferred.tactics ?? []), ...ownedActions])].filter(id => actions.find(c => c.id === id)?.category === category);
    for (const c of actions.filter(c => c.category === category && c.tier === "bronze")) if (wanted.length < count && !wanted.includes(c.id)) { wanted.push(c.id); if (!ownedActions.includes(c.id)) additions.push(c.id); }
    tactics.push(...wanted.slice(0, count));
  }
  return { deck: { attackers: pickPlayers("attacker", 2, preferred.attackers ?? []), defenders: pickPlayers("defender", 2, preferred.defenders ?? []), keeper: pickPlayers("goalkeeper", 1, preferred.keeper ? [preferred.keeper] : [])[0] ?? "", tactics }, additions };
}
export function startMatch(deck: Deck, points: number, seed = Math.floor(Math.random() * 0xffffffff)): Match { const division = divisionFor(points); return { id: `pd2-${Date.now()}-${seed}`, division, opponent: opponents[division - 1], deck, seed, index: 0, used: [], momentum: 0, lastStyle: null, home: 0, away: 0, decisions: [] }; }
export function currentHighlight(match: Match, players: PlayerCard[], actions: ActionCard[]): Highlight | null {
  if (match.index >= 6) return null;
  const phase: Phase = match.index % 2 === 0 ? "attack" : "defend";
  const threat = match.division >= 3 && match.lastStyle && roll(match.seed, match.index + 60) < .45
    ? match.lastStyle
    : styles[Math.floor(roll(match.seed, match.index + 60) * 4)];
  const hand = match.deck.tactics.filter(id => !match.used.includes(id) && actions.some(c => c.id === id && (c.category === "special" || c.category === (phase === "attack" ? "attack" : "defense")))).sort((a,b) => roll(match.seed ^ hash(a), match.index) - roll(match.seed ^ hash(b), match.index)).slice(0, 3);
  const playerOptions = phase === "attack" ? match.deck.attackers : [...match.deck.defenders, match.deck.keeper];
  return { index: match.index, minute: minutes[match.index], phase, title: phase === "attack" ? ["Break in behind", "Counter at pace", "Final opening"][match.index / 2] : ["Stop the counter", "Guard the box", "Last stand"][(match.index - 1) / 2], threat, hand, playerOptions: playerOptions.filter(id => players.some(c => c.id === id)), used: match.used };
}
export function resolveChoice(match: Match, choice: Choice, players: PlayerCard[], actions: ActionCard[]): Match {
  const h = currentHighlight(match, players, actions); if (!h || !h.playerOptions.includes(choice.playerId) || !h.hand.includes(choice.tacticId) || !styles.includes(choice.route)) throw new Error("Invalid highlight choice");
  const player = players.find(c => c.id === choice.playerId)!; const tactic = actions.find(c => c.id === choice.tacticId)!;
  const tacticLink = tacticStyle(tactic) === choice.route; const playerLink = playerStyle(player) === choice.route; const chain = match.lastStyle === choice.route;
  const counter = h.phase === "defend" && choice.route === h.threat;
  const links = Number(tacticLink) + Number(playerLink) + Number(chain) + Number(counter);
  const opponentRead = h.phase === "attack" && choice.route === h.threat;
  const score = Math.round(player.rating * .52 + tactic.power * .9 + links * 9 + match.momentum * 4 + roll(match.seed, match.index + 7) * 15 - (opponentRead ? 7 : 0));
  const threshold = 55 + match.division * 6 + Math.floor(roll(match.seed, match.index + 27) * 12);
  const success = score >= threshold;
  const momentum = success ? Math.min(3, match.momentum + (links >= 2 ? 2 : 1)) : Math.max(0, match.momentum - 1);
  const home = match.home + Number(success && h.phase === "attack"); const away = match.away + Number(!success && h.phase === "defend");
  const explanation = `${player.shortName} used ${tactic.title}. ${links ? `${links} style link${links > 1 ? "s" : ""} built momentum.` : "No style links connected."}${opponentRead ? " Their back line read the route." : ""} ${success ? (h.phase === "attack" ? "Goal!" : "Attack stopped.") : (h.phase === "attack" ? "Chance missed." : "Opponent scored.")}`;
  const decision: Decision = { choice, success, score, threshold, links, explanation, momentum, home, away };
  return { ...match, index: match.index + 1, used: [...match.used, choice.tacticId], momentum, lastStyle: success ? choice.route : null, home, away, decisions: [...match.decisions, decision] };
}
