import test from 'node:test';
import assert from 'node:assert/strict';
import { usesMobileLandscape, landscapeGeometry, leavesPlatformFrame } from '../src/features/games/shared/mobile-viewport/policy';
import { gameRegistry } from '../src/mocks/games/game-registry';
import { isGameEnabled } from '../src/domain/demo-product';

test('every enabled game uses mobile landscape except tennis and the portrait-first games', () => {
  for (const game of Object.keys(gameRegistry).filter(isGameEnabled)) {
    assert.equal(usesMobileLandscape(game), !['cricketer', 'tennis-rally', 'final-third', 'archery-test', 'football-shooting'].includes(game), game);
  }
});
test('portrait screens get an exact landscape viewport without scaling touch targets', () => {
  assert.deepEqual(landscapeGeometry(393, 851), { width: 851, height: 393, transform: 'translateX(393px) rotate(90deg)' });
  assert.deepEqual(landscapeGeometry(851, 393), { width: 851, height: 393, transform: 'none' });
  assert.deepEqual(landscapeGeometry(320, 568), { width: 568, height: 320, transform: 'translateX(320px) rotate(90deg)' });
});
test('the portrait-first shop, games, streaks and sign-in leave the rotated platform shell', () => {
  for (const path of ['/play/retro-football', '/play/final-over', '/shop', '/shop/search', '/streaks', '/login', '/onboarding']) assert.equal(leavesPlatformFrame(path), true, path);
  for (const path of ['/', '/shopping', '/leaderboard', '/profile', '/profile/history', '/games/football', '/friends', '/players']) assert.equal(leavesPlatformFrame(path), false, path);
});
