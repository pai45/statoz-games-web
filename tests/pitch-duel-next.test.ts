import { test } from "node:test";
import assert from "node:assert/strict";
import { actionCards } from "../src/mocks/packs/action-cards";
import { footballPlayerCards } from "../src/mocks/packs/football-cards";
import { currentHighlight, deckErrors, divisionFor, resolveChoice, startMatch, starterDeck, styles } from "../src/features/games/pitch-duel-next/rules";

const byRole = (role: string) => footballPlayerCards.filter(c => c.role === role);
const ownedPlayers = [...byRole("attacker").slice(0,2),...byRole("defender").slice(0,2),...byRole("goalkeeper").slice(0,1)].map(c=>c.id);
const ownedActions = ["act1-bronze","act2-bronze","act3-bronze","act7-bronze","act8-bronze","act9-bronze"];

test("legacy five-player squad becomes a legal eight-tactic starter without replacing cards", () => {
  const prior = { attackers: ownedPlayers.slice(0,2), defenders: ownedPlayers.slice(2,4), keeper: ownedPlayers[4], tactics: ownedActions };
  const seeded = starterDeck(ownedPlayers, ownedActions, prior, footballPlayerCards, actionCards);
  assert.deepEqual(seeded.deck.attackers, prior.attackers);
  assert.deepEqual(seeded.deck.defenders, prior.defenders);
  assert.equal(seeded.deck.keeper, prior.keeper);
  assert.deepEqual(seeded.additions.length, 2);
  assert.deepEqual(deckErrors(seeded.deck, ownedPlayers, [...ownedActions,...seeded.additions], footballPlayerCards, actionCards), []);
  const illegal = { ...seeded.deck, tactics: [...seeded.deck.tactics.slice(0,7), seeded.deck.tactics[0]] };
  assert.ok(deckErrors(illegal, ownedPlayers, [...ownedActions,...seeded.additions], footballPlayerCards, actionCards).length);
});

test("six highlights consume six unique eligible tactics and settle solely from choices", () => {
  const { deck, additions } = starterDeck(ownedPlayers, ownedActions, {}, footballPlayerCards, actionCards);
  assert.deepEqual(deckErrors(deck, ownedPlayers, [...ownedActions,...additions], footballPlayerCards, actionCards), []);
  let a = startMatch(deck, 0, 101), b = startMatch(deck, 0, 101);
  for (let i=0;i<6;i++) {
    const h = currentHighlight(a, footballPlayerCards, actionCards)!;
    assert.equal(h.phase, i%2===0 ? "attack" : "defend");
    assert.ok(h.hand.length > 0 && h.hand.length <= 3);
    const choice = { playerId: h.playerOptions[0], tacticId: h.hand[0], route: styles[i%4] };
    a = resolveChoice(a, choice, footballPlayerCards, actionCards);
    b = resolveChoice(b, choice, footballPlayerCards, actionCards);
    assert.deepEqual(a,b);
  }
  assert.equal(a.index,6); assert.equal(a.used.length,6); assert.equal(new Set(a.used).size,6);
  assert.equal(currentHighlight(a, footballPlayerCards, actionCards), null);
  assert.equal(a.home, a.decisions.filter((d,i)=>i%2===0 && d.success).length);
  assert.equal(a.away, a.decisions.filter((d,i)=>i%2===1 && !d.success).length);
});

test("league promotion follows nine-point steps", () => {
  assert.equal(divisionFor(0),1); assert.equal(divisionFor(8),1); assert.equal(divisionFor(9),2); assert.equal(divisionFor(18),3); assert.equal(divisionFor(999),5);
});
