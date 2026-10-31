import {gameRegistry} from '@/mocks/games/game-registry';
import type {ModeGuide} from '../types';

type LocalGuide = Pick<ModeGuide,'id'|'icon'|'accent'|'tagline'|'purpose'|'steps'>;
const games: LocalGuide[] = [
  {id:'penalty-cup',icon:'sports_soccer',accent:'gold',tagline:'One shot. One nation. One cup.',purpose:'Choose one of 48 national teams and play a complete penalties-only international cup, or face a random opponent in a single shootout. Progress stays local to your account.',steps:[{title:'Choose your journey',body:'Penalty Cup starts in your nation’s actual 2026 group. Random Game draws a different national team for one match. The cup uses one balanced challenge that builds through the rounds.'},{title:'Score and save',body:'Aim with WASD, the left stick or the touch stick. Press in the green composure window, hold to charge and release to shoot. Time your goalkeeper dive with arrows, the right stick or the dive pad.'},{title:'Take the cup',body:'Groups play five penalties each, with 3/1/0 points for win/draw/loss. Knockouts use sudden death when tied. Retry a knockout defeat or accept it; a semi-final defeat leads to the third-place match. Continue Cup restores your saved run.'}]},
  {
    id:'stick-cricket', icon:'sports_cricket', accent:'orange', tagline:'Time your shots and chase the target',
    purpose:'Follow the batting lesson, then choose a chase in Stick Cricket Chase. Time a left or right shot as the ball arrives.',
    steps:[{title:'Start with the lesson',body:'Use the original hitting lesson to learn when to play the ball.'},{title:'Choose a side',body:'Tap the game’s left or right arrow. You can also use keyboard arrows or enable the handheld buttons in Settings.'},{title:'Chase the score',body:'Choose a native chase and follow its target, balls and wickets. Use Pause before leaving the game.'}],
  },
  {
    id:'archery-test', icon:'my_location', accent:'gold', tagline:'Draw, aim and release',
    purpose:'Reach each target score within the arrow limit in Archery Master. Keep a phone portrait for the largest target view.',
    steps:[{title:'Choose a level',body:'Start the native level and check the target score and arrows remaining.'},{title:'Draw and aim',body:'Hold to draw the bow, then drag to adjust the aim. On a phone, use the right half of the playfield.'},{title:'Release your shot',body:'Release to fire. Earn the target score to unlock the next level. Settings controls the game volume.'}],
  },
  {
    id:'penalty-shooters-2', icon:'sports_soccer', accent:'cyan', tagline:'Choose a team and chase the cup',
    purpose:'Play the original Penalty Shooters 2 cup against CPU teams, alternating between shooting and saving.',
    steps:[{title:'Pick your team',body:'Choose a league, select a team and press the native Play arrow to start the next match.'},{title:'Take the shot',body:'Use a click or touch to time your aim and shot. Follow the native aiming indicator.'},{title:'Make the save',body:'On the goalkeeper turn, time a click or touch to attempt the save. Complete the shootout to update the group table or knockout round.'}],
  },
  {
    id:'football-shooting', icon:'sports_soccer', accent:'cyan', tagline:'Bend a shot and defend your goal',
    purpose:'Play the authored Football Shooting browser game with recovered Football Strike character art. Practice shooting or alternate attack and keeper turns against the CPU.',
    steps:[{title:'Choose your session',body:'Select Practice for five shots or the CPU shootout for alternating shooting and saving turns. The lobby also lets you customise the jersey.'},{title:'Swipe to shoot',body:'Drag upward and release toward the goal. Curve the swipe to bend the ball. A cancelled gesture does not take a shot.'},{title:'Defend and finish',body:'Use the keeper controls when defending. Complete the session to see its real result and save it on this device.'}],
  },
  {
    id:'tennis-bits', icon:'sports_tennis', accent:'lime', tagline:'Move, serve and win the rally',
    purpose:'Follow the original Tennis Bits tutorial, then play arcade tennis against the local CPU.',
    steps:[{title:'Learn the native controls',body:'Follow the game’s movement, charging, serving and return prompts. Use its directional controls or keyboard arrows.'},{title:'Play the point',body:'Move into position, time the serve and return the ball. A completed match can be a win or a loss.'},{title:'Continue locally',body:'Use the native result and reward screens to continue. Earned progression stays local; ad and purchase offers do not grant rewards.'}],
  },
  {
    id:'soccer-real', icon:'sports_soccer', accent:'lime', tagline:'Build the move and finish the chance',
    purpose:'Choose teams and play the original Soccer REAL CPU football challenges locally. The Local CPU Match entry uses the native match rules.',
    steps:[{title:'Choose your match',body:'Follow or skip the tutorial, select your team and use the native match setup.'},{title:'Drag and release',body:'Drag from the ball to aim a pass or shot, then release to kick. Follow the original on-pitch prompts.'},{title:'Finish the chances',body:'Play through the full set of chances against the CPU to reach the match result. Optional ad boosts are skipped without granting a boost.'}],
  },
  {
    id:'retro-innings', icon:'sports_cricket', accent:'orange', tagline:'Bat your innings, then defend the score',
    purpose:'Play Creasefire Six, the maintained Retro Innings cricket game. Choose a match mode, bat and bowl through both innings.',
    steps:[{title:'Set up the match',body:'Choose Practice, Fast Match or One-Day Match. One-Day offers team and over selection.'},{title:'Bat with timing',body:'Use A for a ground shot or B for an aerial shot, holding a direction to place the ball. Use the visible game controls or their keyboard bindings.'},{title:'Bowl and defend',body:'Tap or drag on the pitch to set the bounce point, then use A for fast or B for slow. Escape pauses. Finish both innings to record a result.'}],
  },
  {
    id:'f1-racing', icon:'sports_motorsports', accent:'orange', tagline:'One quick race. Chase the lead.',
    purpose:'Race a twenty-car field over two laps of the Silverstone Grand Prix layout in Racer. Hold gas to accelerate, release to coast, brake for corners and boost to overtake.',
    steps:[{title:'Quick race',body:'Choose a car colour and start the single two-lap race. No driver setup, career or purchases.'},{title:'Find your line',body:'Hold Gas or W/up to accelerate. Drag the touch steering pad, or use A/D and left/right arrows. Release Gas to coast. Brake with the on-screen button or S/down; Brake overrides Gas and Boost. Space or Shift boosts. Follow closely to refill boost faster.'},{title:'Take the flag',body:'Complete both laps and all checkpoints to see your position, time and best lap. C changes camera; R resets your car. Pause releases held controls. Your personal best stays local to this account.'}],
  },
];

export const localGameGuides: ModeGuide[] = games.map(game => {
  const entry = gameRegistry[game.id as keyof typeof gameRegistry];
  return {
    ...game, title:entry.title, playHref:entry.href, subtitle:'// LOCAL ARCADE · DEVICE SAVES',
    stats:[{icon:game.icon,label:'LOCAL PLAY',sub:'no online backend',accent:game.accent},{icon:'history',label:'DEVICE SAVE',sub:'separate player progress',accent:'cyan'},{icon:'timer',label:'PAUSE',sub:'stop before leaving',accent:'gold'}],
    facts:[{icon:'history',label:'Local progress',body:'Progress is stored in this browser for the current player. Clearing browser storage removes local progress.'},{icon:'lightbulb',label:'Local modes',body:'Online matchmaking, cloud accounts, advertising and purchases are unavailable. Only rewards earned by ordinary local gameplay are retained.'}],
  };
});
