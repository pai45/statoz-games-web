/**
 * Yorker gameplay data: the player's two bowlers, venues and pitches, fictional batting sides with
 * scouting reports, the twelve career spells and the Bowling Academy lessons. All names are invented.
 */
export type BowlerKind = 'pace' | 'spin';
export type DeliveryId = 'seam' | 'outswing' | 'inswing' | 'slower' | 'legbreak' | 'googly' | 'topspin' | 'slider';
export type DeliverySpec = {
  id: DeliveryId; kind: BowlerKind; name: string; short: string;
  /** Release speed (km/h) from a perfect release. */
  speed: number;
  /** Air movement (m/s²): positive moves away from the batter, negative into them. */
  swing: number;
  /** Spin drift in the air (m/s², world +x). */
  drift: number;
  /** Random seam movement off the pitch (degrees, either way). */
  seam: number;
  /** Deviation at the bounce (degrees, world +x = from a right-hander's leg side to off side). */
  turn: number;
  /** Bounce (restitution) and pace-off-the-pitch multipliers. */
  bounce: number; skid: number;
  /** 0..1: how hard the batter finds it to read from the hand. */
  disguise: number;
  tip: string;
};

export const DELIVERIES: Record<DeliveryId, DeliverySpec> = {
  seam: {id: 'seam', kind: 'pace', name: 'Seam up', short: 'SEAM', speed: 141, swing: 0, drift: 0, seam: 1, turn: 0, bounce: 1, skid: 1, disguise: 0, tip: 'Your stock ball. Hits the seam and can nip either way off the pitch.'},
  outswing: {id: 'outswing', kind: 'pace', name: 'Outswinger', short: 'OUT', speed: 135, swing: 3.4, drift: 0, seam: .35, turn: 0, bounce: 1, skid: 1, disguise: .2, tip: 'Curves away from the batter late. Finds the outside edge.'},
  inswing: {id: 'inswing', kind: 'pace', name: 'Inswinger', short: 'IN', speed: 134, swing: -3.2, drift: 0, seam: .35, turn: 0, bounce: 1, skid: 1, disguise: .2, tip: 'Curves back into the batter. Attacks the pads and stumps.'},
  slower: {id: 'slower', kind: 'pace', name: 'Slower ball', short: 'SLOW', speed: 112, swing: 0, drift: 0, seam: .8, turn: -1.2, bounce: .92, skid: .9, disguise: .75, tip: 'Same action, far less pace. Batters swing too early and lob catches.'},
  legbreak: {id: 'legbreak', kind: 'spin', name: 'Leg-break', short: 'LEG', speed: 86, swing: 0, drift: -.55, seam: .3, turn: 5.6, bounce: 1.08, skid: .9, disguise: 0, tip: 'Your stock ball. Drifts in, then spins away from a right-hander.'},
  googly: {id: 'googly', kind: 'spin', name: 'Googly', short: 'GOOG', speed: 84, swing: 0, drift: .2, seam: .3, turn: -4.6, bounce: 1.05, skid: .9, disguise: .8, tip: 'Looks like a leg-break but spins the other way. Bowled and LBW ball.'},
  topspin: {id: 'topspin', kind: 'spin', name: 'Top-spinner', short: 'TOP', speed: 85, swing: 0, drift: 0, seam: .3, turn: 0, bounce: 1.24, skid: .86, disguise: .45, tip: 'Dips and kicks up. Brings top edges and bat-pad catches.'},
  slider: {id: 'slider', kind: 'spin', name: 'Slider', short: 'SLIDE', speed: 93, swing: 0, drift: 0, seam: .25, turn: 0, bounce: .74, skid: 1.06, disguise: .55, tip: 'Quicker and flatter. Skids on low and straight at the stumps.'},
};

export type Bowler = {
  kind: BowlerKind; title: string; style: string; deliveries: DeliveryId[];
  /** Seconds from leaving the mark to release; the run-up distance in metres. */
  runUp: number; runUpDistance: number;
  releaseHeight: number; releaseX: number;
  /** Release-meter perfect window half-width (fraction of the meter). */
  perfect: number;
  /** Base accuracy scatter (m) with a perfect release. */
  scatter: number;
};
export const BOWLERS: Record<BowlerKind, Bowler> = {
  pace: {kind: 'pace', title: 'PACE', style: 'Right-arm fast', deliveries: ['seam', 'outswing', 'inswing', 'slower'], runUp: 2.45, runUpDistance: 17, releaseHeight: 2.18, releaseX: .38, perfect: .045, scatter: .17},
  spin: {kind: 'spin', title: 'SPIN', style: 'Right-arm leg-spin', deliveries: ['legbreak', 'googly', 'topspin', 'slider'], runUp: 1.55, runUpDistance: 6, releaseHeight: 2.02, releaseX: .32, perfect: .055, scatter: .12},
};

export type PitchId = 'standard' | 'green' | 'dust' | 'flat';
export type Conditions = {swing: number; seam: number; turn: number; bounce: number; pace: number};
export const PITCHES: Record<PitchId, {name: string; note: string; conditions: Conditions}> = {
  standard: {name: 'Good pitch', note: 'True bounce, a little for everyone.', conditions: {swing: 1, seam: 1, turn: 1, bounce: 1, pace: 1}},
  green: {name: 'Green top', note: 'Grass on the surface: seam and swing.', conditions: {swing: 1.2, seam: 1.55, turn: .8, bounce: 1.06, pace: 1.02}},
  dust: {name: 'Dust bowl', note: 'Dry and cracked: big turn for spin.', conditions: {swing: .85, seam: .8, turn: 1.6, bounce: .96, pace: .93}},
  flat: {name: 'Flat deck', note: 'Little movement. Accuracy is everything.', conditions: {swing: .75, seam: .7, turn: .8, bounce: 1, pace: 1.02}},
};

export type VenueId = 'elmfield' | 'harbour' | 'meridian';
export type Venue = {
  id: VenueId; name: string; short: string; time: 'day' | 'dusk' | 'night'; ball: 'red' | 'white';
  sky: string; boundary: number; swing: number; note: string;
};
export const VENUES: Record<VenueId, Venue> = {
  elmfield: {id: 'elmfield', name: 'Elmfield County Ground', short: 'ELMFIELD', time: 'day', ball: 'red', sky: 'textures/sky-day.jpg', boundary: 64, swing: 1.2, note: 'Cloud cover and a red ball: it should swing.'},
  harbour: {id: 'harbour', name: 'Harbour Oval', short: 'HARBOUR OVAL', time: 'dusk', ball: 'white', sky: 'textures/sky-dusk.jpg', boundary: 67, swing: 1.05, note: 'Twilight under the lights. The white ball still moves.'},
  meridian: {id: 'meridian', name: 'Meridian Stadium', short: 'MERIDIAN', time: 'night', ball: 'white', sky: 'textures/sky-night.jpg', boundary: 70, swing: .92, note: 'Full floodlights and dew. Big crowd, bigger hitters.'},
};

export type Weakness = 'short' | 'full' | 'yorker' | 'outswing' | 'inswing' | 'spin' | 'slower' | 'pace';
export type Strength = 'drive' | 'pull' | 'cut' | 'loft' | 'sweep' | 'flick';
export type Batter = {
  id: string; name: string; hand: 'R' | 'L'; number: number;
  /** 0..1 technique, baseline intent to score, boundary power. */
  skill: number; aggression: number; power: number;
  footwork: 'front' | 'back' | 'balanced';
  weak: Partial<Record<Weakness, number>>; strong: Strength[];
  scouting: string;
};
export type TeamId = 'rooks' | 'hawks' | 'comets' | 'kings' | 'academy';
export type Team = {id: TeamId; name: string; short: string; shirt: string; trim: string; trousers: string; helmet: string; batters: Batter[]};

type Row = [name: string, hand: 'R' | 'L', number: number, skill: number, aggression: number, power: number, footwork: Batter['footwork'], weak: Batter['weak'], strong: Strength[], scouting: string];
const side = (prefix: string, rows: Row[]): Batter[] => rows.map(([name, hand, number, skill, aggression, power, footwork, weak, strong, scouting]) => ({
  id: prefix+'-'+name.split(' ').at(-1)!.toLowerCase().replace(/[^a-z]/g, ''), name, hand, number, skill, aggression, power, footwork, weak, strong, scouting,
}));

export const TEAMS: Record<TeamId, Team> = {
  rooks: {id: 'rooks', name: 'Elmfield Rooks', short: 'ROOKS', shirt: '#7c2232', trim: '#f0dfb8', trousers: '#2a1c22', helmet: '#5c1824', batters: side('rooks', [
    ['Tom Hadley', 'R', 4, .55, .35, .4, 'front', {outswing: .4}, ['drive'], 'Pushes hard at balls outside off stump. Find the edge.'],
    ['Sam Okafor', 'R', 9, .5, .45, .5, 'back', {full: .3, yorker: .35}, ['cut', 'pull'], 'Back-foot player. Pitch it up at the stumps.'],
    ['Joe Pickering', 'L', 14, .46, .55, .55, 'front', {short: .45}, ['drive'], 'Left-hander who loves to drive. Rush him with the short ball.'],
    ['Callum Reid', 'R', 21, .42, .5, .5, 'balanced', {spin: .4, inswing: .3}, ['flick'], 'Plays across the line and struggles to read spin.'],
    ['Ben Ashworth', 'R', 30, .3, .62, .45, 'front', {yorker: .45, short: .3}, ['loft'], 'Swings hard down the ground. Straight and full.'],
    ['Liam Doyle', 'R', 66, .22, .5, .38, 'front', {yorker: .4, pace: .35, spin: .3}, [], 'Number eleven. Bowl at the stumps.'],
  ])},
  hawks: {id: 'hawks', name: 'Harbour Hawks', short: 'HAWKS', shirt: '#0f6c73', trim: '#f4f8f6', trousers: '#123236', helmet: '#0a4f54', batters: side('hawks', [
    ['Mateo Silva', 'L', 5, .62, .55, .6, 'front', {inswing: .3, short: .2}, ['drive', 'cut'], 'Hits through the line. Swing it back into his pads.'],
    ['Rohan Pillai', 'R', 8, .68, .4, .5, 'back', {outswing: .32, slower: .2}, ['cut'], 'Patient and classy. Make him play outside off stump.'],
    ['Kieran Walsh', 'R', 17, .58, .65, .7, 'front', {short: .42, slower: .25}, ['loft', 'drive'], 'Big front-foot hitter. Bang it in short.'],
    ['Ade Bankole', 'R', 23, .55, .8, .82, 'balanced', {yorker: .45, slower: .3}, ['loft', 'pull'], 'Clears the ropes with ease. Yorkers and slower balls.'],
    ['Finn Larsen', 'L', 33, .6, .45, .55, 'back', {spin: .42, full: .2}, ['cut', 'pull'], 'Strong square of the wicket, unsure against turn.'],
    ['Chris Mbeki', 'R', 41, .38, .55, .5, 'front', {yorker: .42, inswing: .2}, ['loft'], 'Lower order. Target the base of the stumps.'],
  ])},
  comets: {id: 'comets', name: 'Capital Comets', short: 'COMETS', shirt: '#1d3fa3', trim: '#f2c14e', trousers: '#121c3d', helmet: '#16307c', batters: side('comets', [
    ['Arjun Desai', 'R', 3, .72, .6, .6, 'front', {outswing: .28, short: .15}, ['drive'], 'Elegant driver. Tempt him wide, then go straight.'],
    ['Luca Moretti', 'L', 7, .66, .72, .7, 'balanced', {inswing: .32, slower: .22}, ['loft', 'pull'], 'Attacks from the first ball. Angle it into his pads.'],
    ['Hamza Qureshi', 'R', 18, .74, .45, .55, 'back', {full: .26, yorker: .24}, ['cut', 'flick'], 'Late, wristy player. Fuller balls test him.'],
    ['Dylan Price', 'R', 27, .6, .86, .86, 'front', {short: .36, slower: .32}, ['loft', 'drive'], 'Hits everything in the V. Short balls and slower balls.'],
    ['Kofi Mensah', 'R', 31, .62, .6, .66, 'back', {spin: .36, yorker: .26}, ['pull', 'cut'], 'Powerful off the back foot. Turn and full length.'],
    ['Ollie Grant', 'L', 45, .4, .62, .55, 'front', {short: .36, inswing: .2}, ['loft'], 'Swings hard. Short and at the body.'],
  ])},
  kings: {id: 'kings', name: 'Meridian Kings', short: 'KINGS', shirt: '#17171b', trim: '#ff7a1a', trousers: '#0d0d10', helmet: '#121214', batters: side('kings', [
    ['Viktor Hale', 'R', 1, .78, .7, .75, 'front', {inswing: .22, yorker: .22}, ['drive', 'loft'], 'Dominant opener. Only a perfect yorker stops him.'],
    ['Sanjay Rao', 'R', 6, .8, .5, .6, 'balanced', {slower: .26, outswing: .16}, ['cut', 'flick'], 'Rarely beaten. Vary your pace.'],
    ['Marcus Bell', 'L', 12, .7, .75, .8, 'back', {full: .26, spin: .26}, ['pull', 'cut'], 'Pulls anything short. Keep it up to him.'],
    ['Jae-won Park', 'R', 24, .68, .9, .92, 'front', {yorker: .32, short: .22}, ['loft'], 'The finisher. A six-hitter, so bowl yorkers.'],
    ['Elias Novak', 'R', 19, .72, .6, .65, 'front', {spin: .32, outswing: .2}, ['drive'], 'Sound technique, uneasy against turn.'],
    ['Tariq Haddad', 'R', 50, .45, .7, .66, 'front', {yorker: .36, short: .3}, ['loft'], 'A hitter in the tail. Straight and full.'],
  ])},
  academy: {id: 'academy', name: 'Academy XI', short: 'ACADEMY', shirt: '#e9edf2', trim: '#f4b63f', trousers: '#1b2638', helmet: '#22324c', batters: side('academy', [
    ['Practice Batter', 'R', 10, .55, .08, .3, 'front', {outswing: .45}, [], 'Defends almost everything. Beat the outside edge.'],
    ['Academy Opener', 'R', 12, .45, .25, .35, 'balanced', {yorker: .5, inswing: .4, full: .3}, [], 'Plays across the line. Full and straight hits the stumps.'],
    ['Academy Left-hander', 'L', 16, .46, .2, .35, 'front', {spin: .55}, [], 'Struggles to pick the googly.'],
  ])},
};

export const batterById = (id: string) => Object.values(TEAMS).flatMap(t => t.batters).find(b => b.id === id) ?? null;
export const teamOfBatter = (id: string) => Object.values(TEAMS).find(t => t.batters.some(b => b.id === id)) ?? null;

export type Objective =
  | {type: 'defend'; target: number}
  | {type: 'wickets'; wickets: number}
  | {type: 'economy'; runs: number}
  | {type: 'target'; count: number; zone: {xMin: number; xMax: number; zMin: number; zMax: number}}
  | {type: 'release'; count: number}
  | {type: 'beat'; count: number};
/** A star condition: every listed limit must hold. */
export type StarRule = {maxRuns?: number; minWickets?: number};
export type LessonId = 'length' | 'release' | 'swing' | 'stumps' | 'spin';
export type Challenge = {
  id: string; tier: number; name: string; brief: string;
  venue: VenueId; pitch: PitchId; team: TeamId; lineup: string[]; wicketsInHand: number;
  balls: number; objective: Objective; bowler: BowlerKind | 'any';
  two: StarRule; three: StarRule;
  lesson?: LessonId;
};
const ids = (team: TeamId, ...names: string[]) => names.map(n => team+'-'+n);

export const TIERS = ['COUNTY DAYS', 'HARBOUR NIGHTS', 'MERIDIAN LIGHTS'] as const;
export const SPELLS: Challenge[] = [
  {id: 'spell-1', tier: 0, name: 'First Spell', brief: 'Take a wicket in two overs against the tail.', venue: 'elmfield', pitch: 'standard', team: 'rooks', lineup: ids('rooks', 'doyle', 'ashworth'), wicketsInHand: 2, balls: 12, objective: {type: 'wickets', wickets: 1}, bowler: 'pace', two: {maxRuns: 10}, three: {maxRuns: 4}},
  {id: 'spell-2', tier: 0, name: 'Hold Your Nerve', brief: 'Defend 12 in the final over.', venue: 'elmfield', pitch: 'standard', team: 'rooks', lineup: ids('rooks', 'pickering', 'okafor', 'reid', 'ashworth'), wicketsInHand: 4, balls: 6, objective: {type: 'defend', target: 12}, bowler: 'pace', two: {maxRuns: 7}, three: {maxRuns: 4}},
  {id: 'spell-3', tier: 0, name: 'Spin It Up', brief: 'A dry pitch. Take a wicket with leg-spin.', venue: 'elmfield', pitch: 'dust', team: 'rooks', lineup: ids('rooks', 'reid', 'pickering', 'okafor'), wicketsInHand: 3, balls: 12, objective: {type: 'wickets', wickets: 1}, bowler: 'spin', two: {maxRuns: 12}, three: {maxRuns: 6}},
  {id: 'spell-4', tier: 0, name: 'Green Top', brief: 'Seam and swing. Two wickets in three overs.', venue: 'elmfield', pitch: 'green', team: 'rooks', lineup: ids('rooks', 'hadley', 'okafor', 'pickering', 'reid'), wicketsInHand: 4, balls: 18, objective: {type: 'wickets', wickets: 2}, bowler: 'pace', two: {maxRuns: 16}, three: {maxRuns: 10}},
  {id: 'spell-5', tier: 1, name: 'Death Over', brief: 'Defend 12 off the last over under the lights.', venue: 'harbour', pitch: 'standard', team: 'hawks', lineup: ids('hawks', 'bankole', 'walsh', 'mbeki', 'larsen'), wicketsInHand: 4, balls: 6, objective: {type: 'defend', target: 12}, bowler: 'any', two: {maxRuns: 8}, three: {maxRuns: 5}},
  {id: 'spell-6', tier: 1, name: 'Break the Stand', brief: 'A big partnership. Take a wicket in two overs.', venue: 'harbour', pitch: 'standard', team: 'hawks', lineup: ids('hawks', 'silva', 'pillai', 'larsen', 'walsh'), wicketsInHand: 4, balls: 12, objective: {type: 'wickets', wickets: 1}, bowler: 'any', two: {maxRuns: 10}, three: {maxRuns: 5}},
  {id: 'spell-7', tier: 1, name: 'Turn And Burn', brief: 'Concede ten or fewer in two overs of spin.', venue: 'harbour', pitch: 'dust', team: 'hawks', lineup: ids('hawks', 'larsen', 'walsh', 'pillai', 'silva'), wicketsInHand: 4, balls: 12, objective: {type: 'economy', runs: 10}, bowler: 'spin', two: {maxRuns: 7}, three: {maxRuns: 5, minWickets: 1}},
  {id: 'spell-8', tier: 1, name: 'The Corridor', brief: 'Pillai leaves everything. Make him play, inside nine balls.', venue: 'harbour', pitch: 'green', team: 'hawks', lineup: ids('hawks', 'pillai', 'walsh', 'bankole'), wicketsInHand: 3, balls: 9, objective: {type: 'wickets', wickets: 1}, bowler: 'pace', two: {maxRuns: 8}, three: {maxRuns: 3}},
  {id: 'spell-9', tier: 2, name: 'Powerplay Strike', brief: 'An early wicket against attacking openers.', venue: 'meridian', pitch: 'standard', team: 'comets', lineup: ids('comets', 'desai', 'moretti', 'qureshi', 'mensah'), wicketsInHand: 4, balls: 12, objective: {type: 'wickets', wickets: 1}, bowler: 'any', two: {maxRuns: 9}, three: {maxRuns: 4}},
  {id: 'spell-10', tier: 2, name: 'Last-Ball Thriller', brief: 'Seven needed from three balls. Hold them.', venue: 'meridian', pitch: 'flat', team: 'comets', lineup: ids('comets', 'price', 'grant'), wicketsInHand: 2, balls: 3, objective: {type: 'defend', target: 7}, bowler: 'any', two: {maxRuns: 4}, three: {maxRuns: 2}},
  {id: 'spell-11', tier: 2, name: 'The Finisher', brief: 'Defend 14 against the best hitters in the game.', venue: 'meridian', pitch: 'flat', team: 'kings', lineup: ids('kings', 'park', 'bell', 'novak', 'haddad'), wicketsInHand: 4, balls: 6, objective: {type: 'defend', target: 14}, bowler: 'any', two: {maxRuns: 9}, three: {maxRuns: 5}},
  {id: 'spell-12', tier: 2, name: 'The Final', brief: 'World final. Defend 22 from the last two overs.', venue: 'meridian', pitch: 'standard', team: 'kings', lineup: ids('kings', 'hale', 'park', 'bell', 'rao', 'novak', 'haddad'), wicketsInHand: 6, balls: 12, objective: {type: 'defend', target: 22}, bowler: 'any', two: {maxRuns: 15}, three: {maxRuns: 9}},
];

/** Good-length corridor on and just outside a right-hander's off stump (off side is +x). */
export const LENGTH_ZONE = {xMin: -.06, xMax: .3, zMin: -7, zMax: -4.6};
export const LESSONS: Challenge[] = [
  {id: 'lesson-length', tier: 0, lesson: 'length', name: 'Line & Length', brief: 'Pitch three balls in the good-length box.', venue: 'elmfield', pitch: 'standard', team: 'academy', lineup: [], wicketsInHand: 0, balls: 10, objective: {type: 'target', count: 3, zone: LENGTH_ZONE}, bowler: 'pace', two: {}, three: {}},
  {id: 'lesson-release', tier: 0, lesson: 'release', name: 'The Release', brief: 'Land three Good or Perfect releases.', venue: 'elmfield', pitch: 'standard', team: 'academy', lineup: [], wicketsInHand: 0, balls: 10, objective: {type: 'release', count: 3}, bowler: 'pace', two: {}, three: {}},
  {id: 'lesson-swing', tier: 0, lesson: 'swing', name: 'Swing & Seam', brief: 'Beat the bat or find the edge twice.', venue: 'elmfield', pitch: 'green', team: 'academy', lineup: ['academy-batter'], wicketsInHand: 1, balls: 10, objective: {type: 'beat', count: 2}, bowler: 'pace', two: {}, three: {}},
  {id: 'lesson-stumps', tier: 0, lesson: 'stumps', name: 'Attack the Stumps', brief: 'Bowled or LBW. Take one wicket.', venue: 'elmfield', pitch: 'standard', team: 'academy', lineup: ['academy-opener'], wicketsInHand: 1, balls: 10, objective: {type: 'wickets', wickets: 1}, bowler: 'pace', two: {}, three: {}},
  {id: 'lesson-spin', tier: 0, lesson: 'spin', name: 'Spin School', brief: 'Beat the bat twice with leg-spin.', venue: 'elmfield', pitch: 'dust', team: 'academy', lineup: ['academy-lefthander'], wicketsInHand: 1, balls: 10, objective: {type: 'beat', count: 2}, bowler: 'spin', two: {}, three: {}},
];
export const challengeById = (id: string) => [...SPELLS, ...LESSONS].find(c => c.id === id) ?? null;

/** Coach steps shown in order during a lesson; `until` names the event that completes a step. */
export type CoachUntil = 'tap' | 'target' | 'zone' | 'delivery' | 'bowl' | 'release' | 'ball';
export type Zone = {xMin: number; xMax: number; zMin: number; zMax: number};
export type CoachStep = {text: string; until: CoachUntil; delivery?: DeliveryId; zone?: Zone; focus?: 'pitch' | 'cards' | 'bowl' | 'meter' | 'map' | 'batter' | 'field' | 'review'};
export const COACH: Record<LessonId, CoachStep[]> = {
  length: [
    {text: 'Welcome to the Academy. You bowl; the batter tries to score. Where the ball pitches decides almost everything.', until: 'tap'},
    {text: 'Drag anywhere on the field to move your target. Arrow keys or WASD also work. Put it inside the gold good-length box.', until: 'zone', focus: 'pitch'},
    {text: 'Good length (4.5 to 7 m from the stumps) is hard to drive and hard to pull. Now press BOWL.', until: 'bowl', focus: 'bowl'},
    {text: 'Tap anywhere, or press Space, when the needle reaches the gold zone.', until: 'release', focus: 'meter'},
    {text: 'The pitch map shows where every ball landed. Land three in the box.', until: 'ball', focus: 'map'},
  ],
  release: [
    {text: 'Timing your release decides pace and accuracy.', until: 'tap'},
    {text: 'Gold is Perfect: full pace, tight accuracy, more movement. White is Good. Early releases lose pace and spray.', until: 'tap', focus: 'meter'},
    {text: 'Too late and your front foot lands over the crease: a no-ball, one run, and a free hit next ball.', until: 'tap', focus: 'meter'},
    {text: 'Aim at the stumps and bowl. Land three Good or Perfect releases.', until: 'release', focus: 'bowl'},
  ],
  swing: [
    {text: 'This batter defends everything. Movement beats the bat.', until: 'tap', focus: 'batter'},
    {text: 'Choose the OUTSWINGER. It curves away from the batter late in its flight.', until: 'delivery', delivery: 'outswing', focus: 'cards'},
    {text: 'Pitch it on a good length just outside off stump: the corridor of uncertainty. Make him play.', until: 'target', zone: {xMin: .04, xMax: .45, zMin: -7.2, zMax: -4.2}, focus: 'pitch'},
    {text: 'Bowl it. Beat the bat or find the edge twice.', until: 'ball', focus: 'bowl'},
  ],
  stumps: [
    {text: 'This opener plays across the line. Attack the stumps.', until: 'tap', focus: 'batter'},
    {text: 'A yorker pitches at the batter’s toes. Drag the target right up to the crease, in line with the stumps.', until: 'target', zone: {xMin: -.13, xMax: .13, zMin: -2.2, zMax: -.8}, focus: 'pitch'},
    {text: 'The INSWINGER curves into the pads. If it hits the pad in line, appeal for LBW.', until: 'delivery', delivery: 'inswing', focus: 'cards'},
    {text: 'If the umpire says not out and you think it was hitting, use your review. Ball tracking decides.', until: 'ball', focus: 'review'},
  ],
  spin: [
    {text: 'Leg-spin is slower and turns off the pitch. The batter has more time, so deceive him.', until: 'tap'},
    {text: 'The LEG-BREAK turns away from a right-hander but into this left-hander. The GOOGLY turns the other way.', until: 'delivery', delivery: 'googly', focus: 'cards'},
    {text: 'Flight it full, around 3 to 5 m from the stumps, and let the turn do the work.', until: 'target', zone: {xMin: -.45, xMax: .45, zMin: -5.2, zMax: -2.8}, focus: 'pitch'},
    {text: 'Beat the bat twice. Mix the leg-break and the googly.', until: 'ball', focus: 'bowl'},
  ],
};

export type FieldPreset = 'attack' | 'balanced' | 'defend';
export const FIELD_NAMES: Record<FieldPreset, string> = {attack: 'ATTACK', balanced: 'BALANCED', defend: 'DEFEND'};
/** Quick Match draws a side, venue and target; the seed decides everything. */
export function quickMatch(seed: number): Challenge {
  let s = seed >>> 0; const r = () => (s = (Math.imul(s, 1664525)+1013904223) >>> 0)/4294967296;
  const teams: TeamId[] = ['rooks', 'hawks', 'comets', 'kings'], venues: VenueId[] = ['elmfield', 'harbour', 'meridian'];
  const team = teams[Math.floor(r()*teams.length)], venue = venues[Math.floor(r()*venues.length)];
  const lineup = TEAMS[team].batters.map(b => b.id);
  const start = Math.floor(r()*3), order = [...lineup.slice(start), ...lineup.slice(0, start)];
  const target = 9+Math.floor(r()*9), pitches: PitchId[] = ['standard', 'green', 'dust', 'flat'];
  return {id: 'quick', tier: 0, name: 'Quick Match', brief: `Defend ${target} off the final over.`, venue, pitch: pitches[Math.floor(r()*4)], team, lineup: order, wicketsInHand: 4, balls: 6, objective: {type: 'defend', target}, bowler: 'any', two: {maxRuns: Math.max(2, target-6)}, three: {maxRuns: Math.max(1, Math.floor(target/3))}};
}
