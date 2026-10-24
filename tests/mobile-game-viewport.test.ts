import test from 'node:test';
import assert from 'node:assert/strict';
import { usesMobileLandscape, landscapeGeometry } from '../src/features/games/shared/mobile-viewport/policy';
import { gameRegistry } from '../src/mocks/games/game-registry';
import { isGameEnabled } from '../src/domain/demo-product';

test('every enabled game uses mobile landscape except chess and tennis', () => {
  for (const game of Object.keys(gameRegistry).filter(isGameEnabled)) {
    assert.equal(usesMobileLandscape(game), !['football-chess', 'tennis-rally'].includes(game), game);
  }
});
test('portrait screens get an exact landscape viewport without scaling touch targets', () => {
  assert.deepEqual(landscapeGeometry(393, 851), { width: 851, height: 393, transform: 'translateX(393px) rotate(90deg)' });
  assert.deepEqual(landscapeGeometry(851, 393), { width: 851, height: 393, transform: 'none' });
  assert.deepEqual(landscapeGeometry(320, 568), { width: 568, height: 320, transform: 'translateX(320px) rotate(90deg)' });
});
