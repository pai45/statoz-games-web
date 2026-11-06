// Rim Rush data: court geometry, courts, rivals and cups. All names and characters are original.

/** Court geometry in metres. x runs left to right across the screen, y is height above the floor. */
export const GRAVITY = 9.8;
export const BALL_R = 0.12;
export const WALL_X = 6.6;
export const HOOP_X = 4.7;
export const RIM_Y = 3.05;
export const RIM_R = 0.23;
export const BIG_RIM_R = 0.34;
export const RIM_TUBE = 0.02;
export const BOARD_X = HOOP_X + 0.38;
export const BOARD_BOTTOM = 2.9;
export const BOARD_TOP = 3.95;
export const POLE_X = HOOP_X + 1.3;
export const POLE_TOP = 3.4;
/** Distances from centre court where a shooter can stand. The rival's half mirrors these. */
export const SPOTS = [0.7, 1.2, 1.7, 2.2];
export const START_SPOT = 1;
/** Hand height when holding the ball overhead, and how far in front of the body it is released. */
export const RELEASE_Y = 2.3;
export const RELEASE_X = 0.3;
/** Defender body: a vertical capsule from the waist to the raised hands. */
export const BODY_LOW = 0.9;
export const BODY_REACH = 2.35;
export const BODY_R = 0.2;
export const JUMP_SPEED = 4.5;
export const WALK_SPEED = 3.5;
/** Shot speed in m/s for power 0 and power 1. */
export const MIN_SPEED = 5.5;
export const MAX_SPEED = 11.5;
export const MIN_ANGLE = 20 * Math.PI / 180;
export const MAX_ANGLE = 80 * Math.PI / 180;

export const MATCH_SECONDS = 60;
export const TARGET_SCORE = 21;
export const OVERTIME_SECONDS = 30;
export const COUNTDOWN = 3;
export const BUZZER_WINDOW = 3;

export type CourtId = 'rooftop' | 'gym' | 'boardwalk' | 'arena';
export type Court = {id: CourtId; name: string; blurb: string};
export const COURTS: Court[] = [
  {id: 'rooftop', name: 'Rooftop', blurb: 'Painted asphalt above the city at dusk.'},
  {id: 'gym', name: 'Old Gym', blurb: 'Maple boards, bleachers and a loyal crowd.'},
  {id: 'boardwalk', name: 'Boardwalk', blurb: 'Sun-bleached planks by the sea.'},
  {id: 'arena', name: 'Night Arena', blurb: 'Lights down, crowd up. The big stage.'},
];
export const courtFor = (id: string) => COURTS.find(c => c.id === id) ?? null;

export type Look = {skin: string; hair: string; hairStyle: 'short' | 'buzz' | 'puff' | 'band'; jersey: string; trim: string; shorts: string; shoes: string; number: number};
export type Rival = {
  id: string; name: string; nickname: string; tier: number; look: Look;
  /** Shot spread: angle standard deviation in degrees, speed standard deviation as a fraction. */
  aimNoise: number; powerNoise: number;
  /** Seconds between getting the ball back and shooting. */
  think: [number, number];
  /** Chance of contesting a shot in flight, and the timing spread of that jump in seconds. */
  block: number; blockTiming: number;
  /** Chance of a jump shot, and the preferred release angle in degrees. */
  jumpShot: number; arc: number;
};

const look = (skin: string, hair: string, hairStyle: Look['hairStyle'], jersey: string, trim: string, shorts: string, number: number, shoes = '#f4f1ea'): Look =>
  ({skin, hair, hairStyle, jersey, trim, shorts, shoes, number});

export const RIVALS: Rival[] = [
  {id: 'milo', name: 'Milo Brandt', nickname: 'The Rookie', tier: 1, look: look('#f1c9a5', '#6b3e1f', 'short', '#3c8d5a', '#f6e7b0', '#2b5e3d', 7),
    aimNoise: 2.6, powerNoise: 0.016, think: [1.3, 1.9], block: 0.12, blockTiming: 0.16, jumpShot: 0.05, arc: 56},
  {id: 'tess', name: 'Tess Okoro', nickname: 'Quick Hands', tier: 1, look: look('#8d5a3b', '#1d1410', 'puff', '#e0663a', '#fff3e0', '#7a2e17', 12),
    aimNoise: 2.3, powerNoise: 0.014, think: [1.1, 1.6], block: 0.2, blockTiming: 0.14, jumpShot: 0.1, arc: 54},
  {id: 'rafa', name: 'Rafa Quinteros', nickname: 'Long Range', tier: 1, look: look('#c99a6e', '#2a1a12', 'band', '#2f6fb5', '#ffd45c', '#1d3f6b', 30),
    aimNoise: 2.0, powerNoise: 0.012, think: [1.0, 1.5], block: 0.22, blockTiming: 0.13, jumpShot: 0.15, arc: 58},
  {id: 'june', name: 'June Halvorsen', nickname: 'Ice Queen', tier: 2, look: look('#f5d6c0', '#e8c27a', 'band', '#7fc6d8', '#ffffff', '#2c5d6b', 3),
    aimNoise: 1.7, powerNoise: 0.011, think: [0.9, 1.3], block: 0.3, blockTiming: 0.11, jumpShot: 0.2, arc: 57},
  {id: 'dex', name: 'Dex Marlow', nickname: 'The Wall', tier: 2, look: look('#5a3a26', '#120c08', 'buzz', '#5b3e8f', '#ffcf4a', '#2e1f4a', 44),
    aimNoise: 1.6, powerNoise: 0.01, think: [0.9, 1.3], block: 0.45, blockTiming: 0.1, jumpShot: 0.1, arc: 60},
  {id: 'kai', name: 'Kai Nakamura', nickname: 'Splash', tier: 2, look: look('#e9c39b', '#14100e', 'short', '#f2c230', '#1e1e1e', '#2a2a2a', 11),
    aimNoise: 1.4, powerNoise: 0.009, think: [0.8, 1.15], block: 0.32, blockTiming: 0.1, jumpShot: 0.3, arc: 55},
  {id: 'zara', name: 'Zara Mensah', nickname: 'Showtime', tier: 3, look: look('#6e4630', '#1a110c', 'puff', '#d23b5a', '#fdf0f2', '#6d1a2c', 1),
    aimNoise: 1.2, powerNoise: 0.008, think: [0.75, 1.05], block: 0.45, blockTiming: 0.08, jumpShot: 0.35, arc: 57},
  {id: 'otto', name: 'Otto Varga', nickname: 'Big Shot', tier: 3, look: look('#f0c8a8', '#8a4b22', 'short', '#1f2a44', '#f08a24', '#121a2c', 21),
    aimNoise: 1.05, powerNoise: 0.007, think: [0.7, 1.0], block: 0.55, blockTiming: 0.07, jumpShot: 0.3, arc: 59},
  {id: 'nova', name: 'Nova Reyes', nickname: 'The Legend', tier: 3, look: look('#b07850', '#0f0b08', 'band', '#f4f1ea', '#c8102e', '#1b1b1b', 0),
    aimNoise: 0.9, powerNoise: 0.006, think: [0.6, 0.9], block: 0.6, blockTiming: 0.06, jumpShot: 0.4, arc: 57},
];
export const rivalFor = (id: string) => RIVALS.find(r => r.id === id) ?? null;

export type Cup = {id: string; name: string; reward: number; rounds: {rival: string; court: CourtId}[]};
export const ROUND_NAMES = ['Quarter-final', 'Semi-final', 'Final'];
export const CUPS: Cup[] = [
  {id: 'street', name: 'Street Cup', reward: 150, rounds: [{rival: 'milo', court: 'rooftop'}, {rival: 'tess', court: 'rooftop'}, {rival: 'rafa', court: 'gym'}]},
  {id: 'city', name: 'City Cup', reward: 250, rounds: [{rival: 'june', court: 'gym'}, {rival: 'dex', court: 'boardwalk'}, {rival: 'kai', court: 'boardwalk'}]},
  {id: 'champions', name: 'Champions Cup', reward: 400, rounds: [{rival: 'zara', court: 'arena'}, {rival: 'otto', court: 'arena'}, {rival: 'nova', court: 'arena'}]},
];
export const cupFor = (id: string) => CUPS.find(c => c.id === id) ?? null;

/** The player's look before outfits are applied. */
export const PLAYER_LOOK: Look = look('#c68b5e', '#1b1210', 'short', '#f08a24', '#fff6e8', '#1d2b3a', 9);
