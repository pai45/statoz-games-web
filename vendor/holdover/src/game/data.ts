import {
  CHECKPOINT,
  COMPOUND,
  DEPOT,
  FLOOR_HEIGHT,
  OUTPOST,
  VILLAGE,
  type XZ,
  type ZoneId,
} from './layout.ts'

export type TimePresetId = 'dawn' | 'day' | 'noon' | 'overcast' | 'dusk' | 'night'
export type RifleId = 'ranger' | 'whisper' | 'longbow' | 'anvil'
export type ActorKind = 'hostile' | 'civilian' | 'hvt' | 'heavy' | 'sniper'
export type Pose = 'stand' | 'crouch' | 'kneel' | 'prone'

export interface RifleStats {
  damage: number
  velocity: number
  stability: number
  zoom: number
  handling: number
  stealth: number
}

export interface RifleSpec {
  id: RifleId
  name: string
  designation: string
  caliber: string
  role: string
  description: string
  unlockLevel: number
  muzzleVelocity: number
  drag: number
  zoom: [number, number]
  sway: number
  action: 'bolt' | 'semi'
  cycleTime: number
  magazine: number
  reserve: number
  reloadTime: number
  armorPiercing: boolean
  loudness: number
  recoil: number
  suppressed: boolean
  barrelLength: number
  stats: RifleStats
}

export const RIFLES: RifleSpec[] = [
  {
    id: 'ranger',
    name: 'R7 Ranger',
    designation: 'R7',
    caliber: '7.62×51mm',
    role: 'Bolt-action marksman',
    description: 'A forgiving bolt gun with a crisp trigger and a 4–10× optic. Dependable inside 500 meters.',
    unlockLevel: 1,
    muzzleVelocity: 820,
    drag: 0.00058,
    zoom: [4, 10],
    sway: 1,
    action: 'bolt',
    cycleTime: 1.05,
    magazine: 5,
    reserve: 20,
    reloadTime: 2.6,
    armorPiercing: false,
    loudness: 1,
    recoil: 1,
    suppressed: false,
    barrelLength: 0.61,
    stats: { damage: 62, velocity: 58, stability: 70, zoom: 50, handling: 82, stealth: 30 },
  },
  {
    id: 'whisper',
    name: 'SV-9 Whisper',
    designation: 'SV-9',
    caliber: '8.6mm suppressed',
    role: 'Integrally suppressed',
    description: 'Semi-automatic and quiet. Shots do not carry beyond the target area, but the slower round drops sooner.',
    unlockLevel: 3,
    muzzleVelocity: 690,
    drag: 0.0006,
    zoom: [4, 12],
    sway: 0.9,
    action: 'semi',
    cycleTime: 0.38,
    magazine: 8,
    reserve: 24,
    reloadTime: 2.4,
    armorPiercing: false,
    loudness: 0.2,
    recoil: 0.75,
    suppressed: true,
    barrelLength: 0.5,
    stats: { damage: 55, velocity: 40, stability: 76, zoom: 60, handling: 88, stealth: 95 },
  },
  {
    id: 'longbow',
    name: 'K-41 Longbow',
    designation: 'K-41',
    caliber: '.338 Magnum',
    role: 'Long-range precision',
    description: 'A flat-shooting magnum with a 5–16× optic. Defeats light armor and holds steady in the wind.',
    unlockLevel: 5,
    muzzleVelocity: 915,
    drag: 0.00042,
    zoom: [5, 16],
    sway: 0.92,
    action: 'bolt',
    cycleTime: 1.2,
    magazine: 5,
    reserve: 20,
    reloadTime: 2.8,
    armorPiercing: true,
    loudness: 1.15,
    recoil: 1.25,
    suppressed: false,
    barrelLength: 0.69,
    stats: { damage: 80, velocity: 82, stability: 80, zoom: 80, handling: 62, stealth: 22 },
  },
  {
    id: 'anvil',
    name: 'VX-50 Anvil',
    designation: 'VX-50',
    caliber: '12.7×99mm',
    role: 'Anti-materiel',
    description: 'A semi-automatic heavy rifle with a 6–20× optic. Punches through armor at any range, and everyone hears it.',
    unlockLevel: 8,
    muzzleVelocity: 880,
    drag: 0.00031,
    zoom: [6, 20],
    sway: 1.18,
    action: 'semi',
    cycleTime: 0.6,
    magazine: 5,
    reserve: 15,
    reloadTime: 3.4,
    armorPiercing: true,
    loudness: 1.45,
    recoil: 1.8,
    suppressed: false,
    barrelLength: 0.74,
    stats: { damage: 100, velocity: 90, stability: 58, zoom: 100, handling: 40, stealth: 8 },
  },
]

export type CamoPattern = 'solid' | 'woodland' | 'desert' | 'digital' | 'tiger' | 'arctic' | 'damascus'

export interface CamoSpec {
  id: string
  name: string
  unlockLevel: number
  pattern: CamoPattern
  colors: string[]
}

export const CAMOS: CamoSpec[] = [
  { id: 'factory', name: 'Factory Black', unlockLevel: 1, pattern: 'solid', colors: ['#25282b', '#1a1c1e', '#33373b'] },
  { id: 'desert', name: 'Dune Tan', unlockLevel: 2, pattern: 'desert', colors: ['#b39a73', '#9a7f58', '#cdb892', '#7d6646'] },
  { id: 'woodland', name: 'Woodland', unlockLevel: 4, pattern: 'woodland', colors: ['#4d5a3a', '#2f3527', '#7a6a48', '#1d1f19'] },
  { id: 'arctic', name: 'Arctic', unlockLevel: 6, pattern: 'arctic', colors: ['#dfe3e6', '#a9b2b9', '#6e7780'] },
  { id: 'urban', name: 'Urban Digital', unlockLevel: 7, pattern: 'digital', colors: ['#5d6166', '#3f4347', '#8b9095', '#26292c'] },
  { id: 'tiger', name: 'Tiger Stripe', unlockLevel: 10, pattern: 'tiger', colors: ['#5b6142', '#2a2d22', '#8a7f55'] },
  { id: 'obsidian', name: 'Obsidian Gold', unlockLevel: 14, pattern: 'damascus', colors: ['#141414', '#b8913f', '#5c4720'] },
]

export type ReticleId = 'mildot' | 'duplex' | 'horseshoe' | 'tree'

export interface ReticleSpec {
  id: ReticleId
  name: string
  unlockLevel: number
  description: string
}

export const RETICLES: ReticleSpec[] = [
  { id: 'mildot', name: 'Mil-Dot', unlockLevel: 1, description: 'Classic dots every milliradian for holdover and ranging.' },
  { id: 'duplex', name: 'Duplex', unlockLevel: 2, description: 'Heavy outer posts and a fine center cross for fast acquisition.' },
  { id: 'horseshoe', name: 'Horseshoe', unlockLevel: 4, description: 'An open circle frames moving targets with hash marks underneath.' },
  { id: 'tree', name: 'Mil Grid', unlockLevel: 6, description: 'A holdover tree with windage dots for every half mil.' },
]

export const RANKS = [
  'Recruit',
  'Private',
  'Private First Class',
  'Specialist',
  'Corporal',
  'Sergeant',
  'Staff Sergeant',
  'Sergeant First Class',
  'Master Sergeant',
  'First Sergeant',
  'Sergeant Major',
  'Warrant Officer',
  'Chief Warrant Officer',
  'Second Lieutenant',
  'First Lieutenant',
  'Captain',
  'Major',
  'Lieutenant Colonel',
  'Colonel',
  'Ghost',
]

export const ZERO_DISTANCES = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000]

export type BehaviorSpec =
  | { type: 'idle'; pose?: Pose; lookAround?: boolean }
  | { type: 'patrol'; path: XZ[]; speed?: number; wait?: number }
  | { type: 'wander'; radius: number; speed?: number }
  | { type: 'escape'; path: XZ[]; speed?: number; delay: number; critical?: boolean }
  | { type: 'sniper'; nests: NestSpec[] }

export interface NestSpec {
  /** Feet position. A null height means "on the terrain". */
  pos: readonly [number, number | null, number]
  pose: Pose
  cover: 'window' | 'parapet' | 'bush' | 'sandbag' | 'tank'
}

export interface SpawnSpec {
  kind: ActorKind
  pos: XZ
  /** Elevated feet height for rooftops and towers. Defaults to the terrain. */
  y?: number
  /** Compass bearing in degrees: 0 north, 90 east, 180 south (toward the player). */
  facing?: number
  behavior: BehaviorSpec
  required?: boolean
  flashlight?: boolean
  label?: string
  /** HVT path used when the area is alerted. */
  escapePath?: XZ[]
}

export type BonusId =
  | 'headshots'
  | 'nomiss'
  | 'undetected'
  | 'time'
  | 'moving'
  | 'hvtHeadshot'
  | 'escorts'
  | 'longshot'
  | 'sniperFirst'

export interface BonusSpec {
  id: BonusId
  label: string
  value?: number
}

export interface WindSpec {
  min: number
  max: number
  /** Meteorological direction the wind blows from, in degrees. */
  from: number
}

export interface MissionSpec {
  id: string
  code: string
  name: string
  zone: ZoneId
  time: TimePresetId
  clock: string
  location: string
  summary: string
  briefing: string
  intel: string[]
  objective: string
  wind: WindSpec
  zero: number
  spawns: SpawnSpec[]
  bonuses: [BonusSpec, BonusSpec]
  recommended: RifleId
  xp: number
  timeLimit?: number
  tutorial?: boolean
  thermal?: boolean
  hvtName?: string
  focus: readonly [number, number, number]
}

const roof = (floors: number) => floors * FLOOR_HEIGHT
const tower = CHECKPOINT.tower
const villaRoof = roof(COMPOUND.villa.floors)
const hvtEscape: XZ[] = [
  [150, COMPOUND.porchZ],
  [150, -437],
  [149, -427],
  [COMPOUND.escapeVehicle.x, -419.5],
]

export const MISSIONS: MissionSpec[] = [
  {
    id: 'op01',
    code: 'OP-01',
    name: 'First Light',
    zone: 'checkpoint',
    time: 'dawn',
    clock: '05:48',
    location: 'Gate 7 Checkpoint · Sarn Valley',
    summary: 'Clear the militia checkpoint before the morning convoy.',
    briefing:
      'Three militia gunmen hold Gate 7 on the valley road. Neutralize all three before the supply column rolls through. Range is short and the air is still, so settle in and take clean shots.',
    intel: ['Range 180–190 m', 'Wind calm', 'One guard in the watchtower'],
    objective: 'Eliminate the checkpoint guards',
    wind: { min: 0, max: 0.4, from: 90 },
    zero: 200,
    recommended: 'ranger',
    xp: 500,
    tutorial: true,
    focus: [-35, 1.5, -150],
    spawns: [
      { kind: 'hostile', pos: [-31.5, -147], facing: 250, behavior: { type: 'idle', lookAround: true } },
      { kind: 'hostile', pos: [-44, -154.5], facing: 120, behavior: { type: 'idle', lookAround: true } },
      { kind: 'hostile', pos: [tower.x, tower.z + 0.4], y: tower.platform, facing: 200, behavior: { type: 'idle', lookAround: true } },
    ],
    bonuses: [
      { id: 'headshots', label: 'Land 2 headshots', value: 2 },
      { id: 'nomiss', label: 'No missed shots' },
    ],
  },
  {
    id: 'op02',
    code: 'OP-02',
    name: 'Dry Route',
    zone: 'village',
    time: 'day',
    clock: '09:15',
    location: 'Varno Old Town · Market Square',
    summary: 'Break a militia patrol without spooking the town.',
    briefing:
      'A four-man patrol is shaking down Varno’s market square. Civilians are on the street. Pick your moments, avoid bystanders, and drop the patrol before they report your position.',
    intel: ['Range 280–330 m', 'Light wind from the east', 'Spotter on the tallest rooftop'],
    objective: 'Eliminate the patrol',
    wind: { min: 1, max: 2, from: 90 },
    zero: 300,
    recommended: 'ranger',
    xp: 650,
    focus: [62, 2, -268],
    spawns: [
      { kind: 'hostile', pos: [38, -241], behavior: { type: 'patrol', path: [[38, -241], [48, -251], [72, -252], [86, -246]], speed: 1.2, wait: 3 } },
      { kind: 'hostile', pos: [48, -262], behavior: { type: 'patrol', path: [[48, -262], [62, -272], [76, -262], [62, -253]], speed: 1.1, wait: 2 } },
      { kind: 'hostile', pos: [62, -294.3], y: roof(3), facing: 180, behavior: { type: 'idle', lookAround: true } },
      { kind: 'hostile', pos: [39, -243.5], facing: 150, behavior: { type: 'idle', lookAround: true } },
      { kind: 'civilian', pos: [56, -266], behavior: { type: 'wander', radius: 12 } },
      { kind: 'civilian', pos: [70, -268], behavior: { type: 'wander', radius: 12 } },
      { kind: 'civilian', pos: [60, -276], behavior: { type: 'wander', radius: 10 } },
    ],
    bonuses: [
      { id: 'headshots', label: 'Land 3 headshots', value: 3 },
      { id: 'undetected', label: 'Remain undetected' },
    ],
  },
  {
    id: 'op03',
    code: 'OP-03',
    name: 'Crosswind',
    zone: 'depot',
    time: 'noon',
    clock: '12:40',
    location: 'Halden Fuel Depot',
    summary: 'Silence the depot guard in a strong crosswind.',
    briefing:
      'The Halden depot fuels every militia truck in the valley. Five guards walk the yard and the tank tops. A hard crosswind is pushing across the range, so read the flags and hold into it.',
    intel: ['Range 400–430 m', 'Wind 4–6 m/s from the west', 'Moving patrols in the yard'],
    objective: 'Eliminate the depot guard',
    wind: { min: 4.5, max: 6, from: 270 },
    zero: 300,
    recommended: 'ranger',
    xp: 800,
    focus: [-175, 3, -345],
    spawns: [
      { kind: 'hostile', pos: [-200, -326], behavior: { type: 'patrol', path: [[-200, -326], [-152, -326]], speed: 1.3, wait: 2 } },
      { kind: 'hostile', pos: [-152, -346], behavior: { type: 'patrol', path: [[-152, -346], [-204, -346]], speed: 1.2, wait: 2 } },
      { kind: 'hostile', pos: [DEPOT.bigTanks[1].x, -362.4], y: DEPOT.bigTanks[1].h, facing: 170, behavior: { type: 'idle', lookAround: true } },
      { kind: 'hostile', pos: [-144.5, -321.6], facing: 200, behavior: { type: 'idle', lookAround: true } },
      { kind: 'hostile', pos: [DEPOT.office.x, -312.4], y: roof(DEPOT.office.floors), facing: 180, behavior: { type: 'idle', lookAround: true } },
    ],
    bonuses: [
      { id: 'moving', label: 'Drop 2 moving targets', value: 2 },
      { id: 'time', label: 'Finish within 3:00', value: 180 },
    ],
  },
  {
    id: 'op04',
    code: 'OP-04',
    name: 'The Courier',
    zone: 'compound',
    time: 'overcast',
    clock: '15:05',
    location: 'Mirov Compound',
    summary: 'Stop the courier before he reaches his vehicle.',
    briefing:
      'Courier Dalen Rusk is carrying the valley command codes. He will leave the villa with two escorts and walk to an armored SUV at the gate. Once he is behind the wall, he is gone. Take him in the open.',
    intel: ['Range 480–510 m', 'Target wears a red beret', 'The south wall hides the vehicle'],
    objective: 'Eliminate the courier',
    wind: { min: 2, max: 3, from: 60 },
    zero: 400,
    recommended: 'ranger',
    xp: 950,
    hvtName: 'Dalen Rusk',
    focus: [150, 2, -440],
    spawns: [
      { kind: 'hvt', pos: [150, COMPOUND.porchZ], facing: 180, label: 'Courier', behavior: { type: 'escape', path: hvtEscape, speed: 1.05, delay: 24, critical: true } },
      { kind: 'hostile', pos: [148.3, COMPOUND.porchZ + 0.4], required: false, behavior: { type: 'escape', path: hvtEscape.map(([x, z]) => [x - 1.7, z + 0.6] as XZ), speed: 1.05, delay: 24 } },
      { kind: 'hostile', pos: [151.7, COMPOUND.porchZ + 0.4], required: false, behavior: { type: 'escape', path: hvtEscape.map(([x, z]) => [x + 1.7, z + 0.6] as XZ), speed: 1.05, delay: 24 } },
      { kind: 'hostile', pos: [142, -450.2], y: villaRoof, required: false, behavior: { type: 'patrol', path: [[142, -450.2], [158, -450.2]], speed: 1, wait: 4 } },
      { kind: 'hostile', pos: [COMPOUND.tower.x, COMPOUND.tower.z], y: COMPOUND.tower.platform, facing: 200, required: false, behavior: { type: 'idle', lookAround: true } },
      { kind: 'hostile', pos: [151, -409.5], facing: 180, required: false, behavior: { type: 'idle', lookAround: true } },
    ],
    bonuses: [
      { id: 'hvtHeadshot', label: 'Headshot the courier' },
      { id: 'escorts', label: 'Eliminate both escorts', value: 2 },
    ],
  },
  {
    id: 'op05',
    code: 'OP-05',
    name: 'Market Day',
    zone: 'village',
    time: 'noon',
    clock: '11:30',
    location: 'Varno Old Town · Market Square',
    summary: 'Find four gunmen in a crowded market.',
    briefing:
      'Militia gunmen are mixed into a busy market crowd. Hostiles carry rifles and chest rigs; civilians do not. Tag targets, wait for clean lanes, and do not hit a single civilian.',
    intel: ['Range 280–330 m', '10 civilians in the square', 'A lookout watches from a rooftop'],
    objective: 'Eliminate the gunmen without civilian casualties',
    wind: { min: 2, max: 3, from: 300 },
    zero: 300,
    recommended: 'whisper',
    xp: 1000,
    focus: [62, 2, -266],
    spawns: [
      { kind: 'hostile', pos: [48, -257], behavior: { type: 'patrol', path: [[48, -257], [76, -257]], speed: 0.95, wait: 3 } },
      { kind: 'hostile', pos: [64.5, -266], facing: 170, behavior: { type: 'idle', lookAround: true } },
      { kind: 'hostile', pos: [89, -249], behavior: { type: 'patrol', path: [[89, -249], [89, -274]], speed: 1, wait: 4 } },
      { kind: 'hostile', pos: [82, -290.3], y: roof(2), facing: 180, behavior: { type: 'idle', lookAround: true } },
      ...([
        [52, -262],
        [58, -270],
        [68, -262],
        [72, -272],
        [50, -275],
        [75, -280],
        [60, -255],
        [66, -277],
        [44, -268],
        [80, -265],
      ] as XZ[]).map((pos) => ({ kind: 'civilian' as const, pos, behavior: { type: 'wander' as const, radius: 14 } })),
    ],
    bonuses: [
      { id: 'nomiss', label: 'No missed shots' },
      { id: 'time', label: 'Finish within 2:30', value: 150 },
    ],
  },
  {
    id: 'op06',
    code: 'OP-06',
    name: 'Long Watch',
    zone: 'outpost',
    time: 'dawn',
    clock: '06:10',
    location: 'Signal Hill Outpost',
    summary: 'Take the radio outpost at extreme range.',
    briefing:
      'Signal Hill relays every militia transmission in the valley. Five defenders hold it, including an armored heavy. At over 700 meters, adjust your zero, read the wind, and stay patient.',
    intel: ['Range 690–740 m', 'Armored heavy: headshot or armor-piercing round', 'Wind 2.5–4 m/s'],
    objective: 'Eliminate the outpost defenders',
    wind: { min: 2.5, max: 4, from: 240 },
    zero: 500,
    recommended: 'longbow',
    xp: 1200,
    focus: [-40, OUTPOST.height + 2, -680],
    spawns: [
      { kind: 'hostile', pos: [-72, -656], behavior: { type: 'patrol', path: [[-72, -656], [-12, -656]], speed: 1.1, wait: 3 } },
      { kind: 'hostile', pos: [OUTPOST.bunker.x, OUTPOST.bunker.z], facing: 175, behavior: { type: 'idle', lookAround: true } },
      { kind: 'hostile', pos: [-25, -674.5], facing: 190, behavior: { type: 'idle', lookAround: true } },
      { kind: 'heavy', pos: [-44, -702], behavior: { type: 'patrol', path: [[-44, -702], [-44, -666]], speed: 0.9, wait: 3 } },
      { kind: 'hostile', pos: [-31, -697], facing: 160, behavior: { type: 'idle', lookAround: true } },
    ],
    bonuses: [
      { id: 'longshot', label: 'Headshot beyond 700 m', value: 700 },
      { id: 'nomiss', label: 'No missed shots' },
    ],
  },
  {
    id: 'op07',
    code: 'OP-07',
    name: 'Nightfall',
    zone: 'village',
    time: 'night',
    clock: '23:20',
    location: 'Gate 7 · Varno · Halden',
    summary: 'Hunt flashlight patrols across the valley by thermal.',
    briefing:
      'Militia patrols are moving under darkness across three sites. Your optic carries a thermal channel: press T to switch it on. Six hostiles, three locations, and no reinforcements if you stay quiet.',
    intel: ['Range 180–420 m', 'Thermal optic available (T)', 'Patrols carry flashlights'],
    objective: 'Eliminate the night patrols',
    wind: { min: 1, max: 2, from: 200 },
    zero: 300,
    recommended: 'whisper',
    xp: 1300,
    thermal: true,
    focus: [20, 2, -240],
    spawns: [
      { kind: 'hostile', pos: [tower.x, tower.z + 0.4], y: tower.platform, facing: 200, flashlight: true, behavior: { type: 'idle', lookAround: true } },
      { kind: 'hostile', pos: [-62, -152], flashlight: true, behavior: { type: 'patrol', path: [[-62, -152], [-39, -152]], speed: 1.1, wait: 3 } },
      { kind: 'hostile', pos: [38, -241], flashlight: true, behavior: { type: 'patrol', path: [[38, -241], [86, -246]], speed: 1.1, wait: 3 } },
      { kind: 'hostile', pos: [64.5, -266], facing: 170, flashlight: true, behavior: { type: 'idle', lookAround: true } },
      { kind: 'hostile', pos: [62, -294.3], y: roof(3), facing: 180, behavior: { type: 'idle', lookAround: true } },
      { kind: 'hostile', pos: [DEPOT.bigTanks[1].x, -362.4], y: DEPOT.bigTanks[1].h, facing: 170, flashlight: true, behavior: { type: 'idle', lookAround: true } },
    ],
    bonuses: [
      { id: 'headshots', label: 'Land 4 headshots', value: 4 },
      { id: 'undetected', label: 'Remain undetected' },
    ],
  },
  {
    id: 'op08',
    code: 'OP-08',
    name: 'Ghost Protocol',
    zone: 'compound',
    time: 'dusk',
    clock: '19:02',
    location: 'Mirov Compound',
    summary: 'Kill the warlord, and the marksman hunting you.',
    briefing:
      'Warlord Ilya Mirov is on his porch at sunset. An enemy marksman covers the compound and he is already looking for you. Watch for scope glint, duck when he locks on, and take both men.',
    intel: ['Range 480–510 m', 'Counter-sniper active: hold SPACE for cover', 'The warlord runs for his SUV if alerted'],
    objective: 'Eliminate the warlord and the marksman',
    wind: { min: 3, max: 4, from: 100 },
    zero: 500,
    recommended: 'longbow',
    xp: 1600,
    hvtName: 'Ilya Mirov',
    focus: [155, 4, -435],
    spawns: [
      { kind: 'hvt', pos: [150, COMPOUND.porchZ], facing: 175, label: 'Warlord', behavior: { type: 'idle', lookAround: true }, escapePath: hvtEscape.slice(1) },
      {
        kind: 'sniper',
        pos: [COMPOUND.tower.x, COMPOUND.tower.z],
        y: COMPOUND.tower.platform,
        behavior: {
          type: 'sniper',
          nests: [
            { pos: [COMPOUND.tower.x, COMPOUND.tower.platform, COMPOUND.tower.z + 0.5], pose: 'kneel', cover: 'parapet' },
            { pos: [141.5, villaRoof, -449.2], pose: 'kneel', cover: 'parapet' },
            { pos: [125, roof(COMPOUND.garage.floors), -420.8], pose: 'prone', cover: 'parapet' },
          ],
        },
      },
      { kind: 'hostile', pos: [131, -437], required: false, behavior: { type: 'patrol', path: [[131, -437], [169, -437]], speed: 1, wait: 3 } },
      { kind: 'hostile', pos: [151, -409.5], facing: 180, required: false, behavior: { type: 'idle', lookAround: true } },
      { kind: 'hostile', pos: [142, -450.2], y: villaRoof, required: false, behavior: { type: 'patrol', path: [[142, -450.2], [158, -450.2]], speed: 1, wait: 4 } },
    ],
    bonuses: [
      { id: 'sniperFirst', label: 'Kill the marksman first' },
      { id: 'hvtHeadshot', label: 'Headshot the warlord' },
    ],
  },
]

export type DuelDifficultyId = 'recruit' | 'veteran' | 'elite'

export interface DuelDifficulty {
  id: DuelDifficultyId
  label: string
  description: string
  lockTime: number
  reacquire: number
  glint: number
  accuracy: number
  relocateOnMiss: boolean
  xpMultiplier: number
}

export const DUEL_DIFFICULTIES: DuelDifficulty[] = [
  { id: 'recruit', label: 'Recruit', description: 'Slow lock-on and a bright scope glint.', lockTime: 7.5, reacquire: 3.5, glint: 1, accuracy: 0.85, relocateOnMiss: false, xpMultiplier: 1 },
  { id: 'veteran', label: 'Veteran', description: 'Relocates after near misses. Glint is brief.', lockTime: 5, reacquire: 2.6, glint: 0.75, accuracy: 0.95, relocateOnMiss: true, xpMultiplier: 1.35 },
  { id: 'elite', label: 'Elite', description: 'Locks on fast and rarely shows his lens.', lockTime: 3.4, reacquire: 1.8, glint: 0.5, accuracy: 1, relocateOnMiss: true, xpMultiplier: 1.75 },
]

export interface DuelArena {
  id: string
  name: string
  zone: ZoneId
  time: TimePresetId
  range: string
  description: string
  zero: number
  wind: WindSpec
  focus: readonly [number, number, number]
  nests: NestSpec[]
}

export const DUEL_ARENAS: DuelArena[] = [
  {
    id: 'oldtown',
    name: 'Old Town',
    zone: 'village',
    time: 'day',
    range: '290–340 m',
    description: 'Windows, rooftops, and a water tower across Varno’s market.',
    zero: 300,
    wind: { min: 1, max: 2.5, from: 80 },
    focus: [70, 4, -280],
    nests: [
      { pos: [35, roof(1), -292.4], pose: 'kneel', cover: 'window' },
      { pos: [45, roof(1), -292.4], pose: 'kneel', cover: 'window' },
      { pos: [78, roof(1), -290.9], pose: 'kneel', cover: 'window' },
      { pos: [58, roof(2), -294.4], pose: 'kneel', cover: 'window' },
      { pos: [64, roof(3), -294.1], pose: 'kneel', cover: 'parapet' },
      { pos: [93, roof(1), -256.4], pose: 'kneel', cover: 'window' },
      { pos: [VILLAGE.waterTower.x, VILLAGE.waterTower.platform, VILLAGE.waterTower.z + 1.6], pose: 'kneel', cover: 'parapet' },
    ],
  },
  {
    id: 'depot',
    name: 'Fuel Depot',
    zone: 'depot',
    time: 'dusk',
    range: '400–440 m',
    description: 'Tank tops and container stacks in a hard sunset glare.',
    zero: 400,
    wind: { min: 2, max: 4, from: 250 },
    focus: [-170, 5, -350],
    nests: [
      { pos: [DEPOT.bigTanks[1].x, DEPOT.bigTanks[1].h, -362.2], pose: 'prone', cover: 'tank' },
      { pos: [DEPOT.bigTanks[2].x, DEPOT.bigTanks[2].h, -362.2], pose: 'kneel', cover: 'tank' },
      { pos: [-148, roof(DEPOT.office.floors), -312.2], pose: 'kneel', cover: 'parapet' },
      { pos: [-145, 5.2, -325.6], pose: 'prone', cover: 'parapet' },
      { pos: [DEPOT.bigTanks[0].x, DEPOT.bigTanks[0].h, -362.2], pose: 'kneel', cover: 'tank' },
    ],
  },
  {
    id: 'ridge',
    name: 'Signal Ridge',
    zone: 'outpost',
    time: 'dawn',
    range: '620–740 m',
    description: 'Extreme range across scrub and the radio outpost.',
    zero: 600,
    wind: { min: 2, max: 3.5, from: 230 },
    focus: [-30, 14, -650],
    nests: [
      { pos: [OUTPOST.bunker.x, null, OUTPOST.bunker.z], pose: 'stand', cover: 'sandbag' },
      { pos: [20, null, -612], pose: 'prone', cover: 'bush' },
      { pos: [-110, null, -628], pose: 'prone', cover: 'bush' },
      { pos: [58, null, -642], pose: 'prone', cover: 'bush' },
      { pos: [-22, OUTPOST.height + 2.7, -677.5], pose: 'prone', cover: 'parapet' },
    ],
  },
]

export function rifleById(id: string): RifleSpec {
  return RIFLES.find((rifle) => rifle.id === id) ?? RIFLES[0]
}

export function camoById(id: string): CamoSpec {
  return CAMOS.find((camo) => camo.id === id) ?? CAMOS[0]
}

export function reticleById(id: string): ReticleSpec {
  return RETICLES.find((reticle) => reticle.id === id) ?? RETICLES[0]
}

export function missionById(id: string): MissionSpec | undefined {
  return MISSIONS.find((mission) => mission.id === id)
}

export function isRequiredSpawn(spawn: SpawnSpec): boolean {
  return spawn.required ?? spawn.kind !== 'civilian'
}
