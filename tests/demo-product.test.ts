import test from 'node:test';
import assert from 'node:assert/strict';
import { isGameEnabled, isQuizGame } from '../src/domain/demo-product';
import { sportGameDecks } from '../src/mocks/games/sport-decks';
import { playableGameHrefs, gameForHref } from '../src/mocks/games/game-registry';
test('catalog and direct play routes respect product ownership',()=>{ for(const ids of Object.values(sportGameDecks)) for(const id of ids) assert.ok(isGameEnabled(id)); for(const href of playableGameHrefs()) assert.ok(isGameEnabled(gameForHref(href)!.game)); assert.equal(isGameEnabled('football-bingo'),false); assert.equal(isGameEnabled('retro-hoops'),true); assert.ok(isQuizGame('guess-driver')); assert.ok(isQuizGame('tennis-guess-winner')); });

test('retired games are absent from catalog and direct play routes', () => {
  for (const id of ["retro-innings","final-third","retro-football","retro-circuit"]) {
    assert.equal(isGameEnabled(id), false);
    assert.equal(gameForHref('/play/' + id), null);
    assert.ok(!Object.values(sportGameDecks).flat().includes(id as never));
  }
  for (const id of ['retro-hoops', 'retro-football-2', 'stick-cricket', 'grand-prix-dash']) assert.equal(isGameEnabled(id), true);
});
