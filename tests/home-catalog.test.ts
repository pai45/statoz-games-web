import test from "node:test";
import assert from "node:assert/strict";
import { isGameEnabled } from "../src/domain/demo-product";
import { gameSportOrder as sportOrder } from "../src/domain/game-sports";
import {
  allGamesInFeedOrder,
  libraryCardLayout,
  spotlightGames,
  spotlightLimit,
  sportGamesInDeckOrder,
} from "../src/features/games/home-catalog";

/** Column spans a layout produces, on the six-column and two-column grids. */
function spans(count: number) {
  const wide: number[] = [], phone: number[] = [];
  for (let i = 0; i < count; i++) {
    const l = libraryCardLayout(count, i);
    wide.push(l.wide ? 6 : l.feature ? 3 : 2);
    phone.push(l.phoneWide ? 2 : 1);
  }
  return { wide, phone };
}

/** Every row of the grid is filled exactly: no orphan cell at any width. */
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
  assert.equal(ids[0], "retro-hoops");
  for (const sport of sportOrder) for (const id of sportGamesInDeckOrder(sport)) assert.ok(ids.includes(id));
});

test("banner rotates through the leading games of the selected view", () => {
  assert.deepEqual(spotlightGames(null), allGamesInFeedOrder().slice(0, spotlightLimit.all));
  for (const sport of sportOrder) {
    const games = spotlightGames(sport);
    assert.ok(games.length >= 1 && games.length <= spotlightLimit.sport);
    assert.deepEqual(games, sportGamesInDeckOrder(sport).slice(0, games.length));
  }
});

test("library bento fills every row for each catalog size", () => {
  for (let count = 1; count <= 16; count++) {
    const { wide, phone } = spans(count);
    assert.ok(rowsAreFull(wide, 6), `six-column rows for ${count} games: ${wide}`);
    assert.ok(rowsAreFull(phone, 2), `two-column rows for ${count} games: ${phone}`);
  }
});
