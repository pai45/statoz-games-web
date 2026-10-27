import test from "node:test";
import assert from "node:assert/strict";
import { isGameEnabled } from "../src/domain/demo-product";
import { gameSportOrder as sportOrder } from "../src/domain/game-sports";
import {
  allGamesInFeedOrder,
  gameCoverPath,
  libraryCardLayout,
  spotlightGames,
  spotlightLimit,
  sportGamesInDeckOrder,
} from "../src/features/games/home-catalog";

/** Column spans a layout produces on the six-column desktop bento. */
function spans(count: number) {
  return Array.from({ length: count }, (_, i) => {
    const l = libraryCardLayout(count, i);
    return l.wide ? 6 : l.feature ? 3 : 2;
  });
}

/** Every row of the grid is filled exactly: no orphan cell. */
function rowsAreFull(widths: number[], columns: number) {
  let used = 0;
  for (const w of widths) {
    if (used + w > columns) return false;
    used = (used + w) % columns;
  }
  return used === 0;
}

test("home feed lists every enabled game once, curated order first", () => {
  const ids = allGamesInFeedOrder();
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(ids.every(isGameEnabled));
  for (const sport of sportOrder) for (const id of sportGamesInDeckOrder(sport)) assert.ok(ids.includes(id));
});

test("carousel rotates through three leading games of the selected view", () => {
  assert.equal(spotlightLimit.all, 3);
  assert.deepEqual(spotlightGames(null), allGamesInFeedOrder().slice(0, 3));
  for (const sport of sportOrder) {
    const games = spotlightGames(sport);
    assert.ok(games.length >= 1 && games.length <= spotlightLimit.sport);
    assert.deepEqual(games, sportGamesInDeckOrder(sport).slice(0, games.length));
  }
});

test("desktop bento fills every row for each catalog size", () => {
  for (let count = 1; count <= 16; count++) {
    const widths = spans(count);
    assert.ok(rowsAreFull(widths, 6), `six-column rows for ${count} games: ${widths}`);
  }
});

test("covers come from the shared folder unless the game bundles its own", () => {
  assert.equal(gameCoverPath("retro-hoops"), "/assets/games/covers/retro-hoops.webp");
  assert.equal(gameCoverPath("stick-cricket"), "/games/stick-cricket/cover.png");
});
