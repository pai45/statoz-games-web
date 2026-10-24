import { test } from "node:test";
import assert from "node:assert/strict";

import { footballPlayerCards } from "../src/mocks/packs/football-cards";
import { defaultClub, lineupErrors } from "../src/features/games/pitch-duel/engine/lineup";
import { applyResult, coinsFor, emptyCareer, migrateV2, sanitizeCareer } from "../src/features/games/pitch-duel/state/career-schema";

const byRole = (role: string) => footballPlayerCards.filter((c) => c.role === role).map((c) => c.id);
const cardFor = (id: string) => footballPlayerCards.find((c) => c.id === id);
const [a1, a2] = byRole("attacker");
const [d1, d2] = byRole("defender");
const [gk] = byRole("goalkeeper");

const v2 = {
  version: 2,
  deck: { attackers: [a1, a2], defenders: [d1, d2], keeper: gk, tactics: ["act1-bronze", "act7-bronze", "act13-bronze", "act2-bronze"] },
  points: 10, xp: 400, wins: 3, played: 5, currentStreak: 1, bestStreak: 2, tutorialSeen: true,
  history: [
    { id: "m2", at: "2026-10-02T10:00:00.000Z", playedAt: "2026-10-02T10:00:00.000Z", opponent: "Harbour FC", opponentName: "Harbour FC", home: 1, away: 1, playerScore: 1, opponentScore: 1, result: "Draw", points: 1, division: 2, decisions: [{}, {}, {}, {}, {}, {}] },
    { id: "m1", at: "2026-10-01T10:00:00.000Z", playedAt: "2026-10-01T10:00:00.000Z", opponent: "Mill Town", opponentName: "Mill Town", home: 2, away: 0, playerScore: 2, opponentScore: 0, result: "Victory", points: 3, division: 1, decisions: [] },
  ],
  rewardedDivisions: [2],
};

test("v2 saves migrate without losing progress or streak history", () => {
  const c = migrateV2(JSON.stringify(v2));
  assert.equal(c.version, 3);
  assert.equal(c.points, 10);
  assert.equal(c.xp, 400);
  assert.equal(c.wins, 3);
  assert.equal(c.played, 5);
  assert.equal(c.draws, 1);
  assert.equal(c.losses, 1);
  assert.equal(c.bestStreak, 2);
  assert.deepEqual(c.rewardedDivisions, [2]);
  assert.equal(c.tutorialSeen, false, "new rules, so the guide shows once");
  assert.equal(c.migratedFrom, 2);
  assert.deepEqual(c.club, { formation: "2-2", keeperId: gk, outfield: [d1, d2, a1, a2], tactics: ["act1-bronze", "act7-bronze", "act13-bronze"] });
  const first = c.history[0];
  for (const key of ["id", "playedAt", "result", "playerScore", "opponentScore", "opponentName"] as const) assert.ok(first[key] !== undefined, key);
  assert.equal(first.decisions, 6);
  assert.deepEqual(sanitizeCareer(JSON.parse(JSON.stringify(c))), c, "migration output is stable");
});

test("garbage input falls back to an empty career", () => {
  assert.deepEqual(migrateV2("{nope"), emptyCareer);
  assert.deepEqual(migrateV2(null), emptyCareer);
  assert.deepEqual(sanitizeCareer(42), emptyCareer);
  assert.equal(sanitizeCareer({ points: -5, history: "x" }).points, 0);
});

test("results bank points, promotion and streaks once", () => {
  const base = { ...emptyCareer, points: 7 };
  const win = applyResult(base, { id: "x1", playedAt: "2026-10-24T09:00:00.000Z", opponentName: "Northside", playerScore: 2, opponentScore: 1, division: 1, decisions: 31 });
  assert.equal(win.earned, 3);
  assert.equal(win.career.points, 10);
  assert.equal(win.promoted, 2);
  assert.equal(win.career.xp, 120);
  assert.equal(win.career.currentStreak, 1);
  assert.equal(win.result.result, "Victory");
  const again = applyResult(win.career, { id: "x1", playedAt: "2026-10-24T09:05:00.000Z", opponentName: "Northside", playerScore: 2, opponentScore: 1, division: 1, decisions: 31 });
  assert.equal(again.duplicate, true);
  assert.equal(again.career, win.career);

  const draw = applyResult(win.career, { id: "x2", playedAt: "2026-10-24T10:00:00.000Z", opponentName: "Old Quay", playerScore: 0, opponentScore: 0, division: 2, decisions: 30 });
  assert.equal(draw.career.points, 11);
  assert.equal(draw.career.currentStreak, 0);
  assert.equal(draw.promoted, null);
  assert.equal(coinsFor("Victory"), 120);
  assert.equal(coinsFor("Draw"), 75);
  assert.equal(coinsFor("Defeat"), 45);

  let career = emptyCareer;
  for (let i = 0; i < 40; i += 1) career = applyResult(career, { id: `h${i}`, playedAt: "2026-10-24T10:00:00.000Z", opponentName: "X", playerScore: 0, opponentScore: 1, division: 1, decisions: 30 }).career;
  assert.equal(career.history.length, 30);
});

test("a promotion already rewarded is not rewarded again", () => {
  const base = { ...emptyCareer, points: 8, rewardedDivisions: [2] };
  const s = applyResult(base, { id: "p", playedAt: "2026-10-24T10:00:00.000Z", opponentName: "X", playerScore: 1, opponentScore: 0, division: 1, decisions: 30 });
  assert.equal(s.promoted, null);
});

test("lineup rules and the default club", () => {
  const owned = [a1, a2, d1, d2, gk];
  const actions = ["act1-bronze", "act8-bronze", "act15-bronze", "act2-bronze"];
  const category = (id: string) => (id.startsWith("act1-") || id.startsWith("act2-") ? "attack" : id.startsWith("act8-") ? "defense" : "special");
  const club = defaultClub(owned, actions, cardFor, undefined, category);
  assert.ok(club);
  assert.equal(club!.keeperId, gk);
  assert.equal(club!.outfield.length, 4);
  assert.deepEqual(new Set(club!.tactics), new Set(["act1-bronze", "act8-bronze", "act15-bronze"]));
  assert.deepEqual(lineupErrors(club!, owned, actions, cardFor), []);
  assert.ok(lineupErrors({ ...club!, keeperId: a1 }, owned, actions, cardFor).length);
  assert.ok(lineupErrors({ ...club!, outfield: [a1, a1, d1, d2] }, owned, actions, cardFor).length);
  assert.ok(lineupErrors({ ...club!, tactics: [...actions] }, owned, actions, cardFor).length);
  assert.equal(defaultClub([a1, gk], [], cardFor), null);
});
