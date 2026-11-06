// World layout shared by terrain generation, scene construction, and mission data.
// Units are meters. North is -Z, east is +X, and the sniper nest looks north.

export type XZ = readonly [number, number]
export type ZoneId = 'checkpoint' | 'village' | 'depot' | 'compound' | 'outpost'

export interface ZoneSpec {
  id: ZoneId
  name: string
  center: XZ
  radius: number
  height: number
}

export const FLOOR_HEIGHT = 3.2

export const ZONES: Record<ZoneId, ZoneSpec> = {
  checkpoint: { id: 'checkpoint', name: 'Gate 7 Checkpoint', center: [-35, -150], radius: 38, height: 0 },
  village: { id: 'village', name: 'Varno Old Town', center: [62, -270], radius: 80, height: 0 },
  depot: { id: 'depot', name: 'Halden Fuel Depot', center: [-175, -345], radius: 72, height: 0 },
  compound: { id: 'compound', name: 'Mirov Compound', center: [150, -445], radius: 74, height: 0 },
  outpost: { id: 'outpost', name: 'Signal Hill Outpost', center: [-40, -690], radius: 58, height: 18 },
}

/** Player overwatch position inside a ruined building on the southern ridge. */
export const NEST = {
  x: 0,
  z: 29.48,
  wallZ: 28.4,
  wallThickness: 0.35,
  floorAboveGround: 3.4,
  eyeHeight: 1.15,
  coverEyeHeight: 0.55,
  sillHeight: 0.85,
  openingTop: 2.25,
  openingHalfWidth: 1.5,
} as const

export interface RoadSpec {
  points: XZ[]
  width: number
  flatten: boolean
  surface: 'asphalt' | 'dirt'
}

export const ROADS: RoadSpec[] = [
  {
    surface: 'asphalt',
    width: 7,
    flatten: true,
    points: [
      [-1500, -86],
      [-620, -116],
      [-260, -132],
      [-120, -140],
      [-35, -150],
      [10, -188],
      [40, -232],
      [62, -250],
      [104, -250],
      [146, -262],
      [150, -300],
      [150, -404],
    ],
  },
  {
    surface: 'dirt',
    width: 6,
    flatten: true,
    points: [
      [31, -262],
      [-10, -284],
      [-60, -305],
      [-120, -316],
      [-175, -306],
    ],
  },
  {
    surface: 'dirt',
    width: 5,
    flatten: false,
    points: [
      [-128, -345],
      [-112, -420],
      [-96, -520],
      [-76, -598],
      [-56, -640],
    ],
  },
  {
    surface: 'dirt',
    width: 4.5,
    flatten: false,
    points: [
      [-90, -141],
      [-70, -70],
      [-44, -8],
      [-14, 34],
      [0, 40],
    ],
  },
  {
    surface: 'asphalt',
    width: 6,
    flatten: true,
    points: [
      [150, -300],
      [320, -330],
      [700, -300],
      [1500, -260],
    ],
  },
]

export interface Opening {
  floor: number
  xs: number[]
}

export interface BuildingSpec {
  id: string
  x: number
  z: number
  w: number
  d: number
  floors: number
  color: string
  /** Real openings on the south face (toward the nest) that duel snipers can use. */
  openings?: Opening[]
  roofProps?: Array<'tank' | 'dish' | 'ac' | 'antenna' | 'laundry'>
  awning?: string
}

export const VILLAGE_BUILDINGS: BuildingSpec[] = [
  { id: 'V1', x: 40, z: -296, w: 14, d: 10, floors: 2, color: '#c9b79c', openings: [{ floor: 1, xs: [35, 45] }], roofProps: ['tank', 'ac'] },
  { id: 'V2', x: 62, z: -298, w: 12, d: 10, floors: 3, color: '#d6c7ab', openings: [{ floor: 2, xs: [58, 66] }], roofProps: ['tank', 'dish', 'antenna'] },
  { id: 'V3', x: 82, z: -294, w: 12, d: 9, floors: 2, color: '#bfa98a', openings: [{ floor: 1, xs: [78, 86] }], roofProps: ['laundry', 'ac'] },
  { id: 'V4', x: 26, z: -270, w: 9, d: 14, floors: 2, color: '#cdbfa6', roofProps: ['dish'] },
  { id: 'V5', x: 24, z: -248, w: 10, d: 10, floors: 1, color: '#b9a58b', awning: '#6d7f5a' },
  { id: 'V6', x: 96, z: -262, w: 10, d: 14, floors: 2, color: '#d2c2a4', openings: [{ floor: 1, xs: [93, 99] }], roofProps: ['tank'] },
  { id: 'V7', x: 98, z: -238, w: 9, d: 10, floors: 2, color: '#c4ae90', openings: [{ floor: 1, xs: [96] }], awning: '#8c3f2e' },
  { id: 'V8', x: 10, z: -300, w: 12, d: 10, floors: 2, color: '#bba88f', roofProps: ['ac'] },
  { id: 'V9', x: 118, z: -292, w: 12, d: 12, floors: 2, color: '#cbb89a', roofProps: ['tank', 'dish'] },
  { id: 'V10', x: 126, z: -266, w: 10, d: 10, floors: 1, color: '#b4a083' },
  { id: 'V11', x: 2, z: -258, w: 10, d: 12, floors: 1, color: '#c2b195', awning: '#40566b' },
  { id: 'V12', x: 44, z: -322, w: 14, d: 10, floors: 2, color: '#d0c0a2', roofProps: ['tank'] },
  { id: 'V13', x: 80, z: -320, w: 10, d: 10, floors: 3, color: '#c7b496', roofProps: ['antenna', 'tank'] },
  { id: 'V14', x: 104, z: -316, w: 10, d: 8, floors: 2, color: '#b8a284' },
  { id: 'V15', x: -14, z: -234, w: 8, d: 8, floors: 1, color: '#bca98c' },
]

export const VILLAGE = {
  square: [62, -262] as XZ,
  well: [62, -262] as XZ,
  stalls: [
    [46, -281],
    [55, -284],
    [69, -284],
    [78, -281],
  ] as XZ[],
  cars: [
    { x: 36, z: -246, rot: 0.2, color: '#7c2f26' },
    { x: 88, z: -278, rot: -0.4, color: '#c8c8c2' },
  ],
  waterTower: { x: 118, z: -249, platform: 10 },
}

export const CHECKPOINT = {
  booth: { x: -27, z: -143, w: 2.6, d: 2.6, h: 2.7 },
  barrierX: -37,
  barriers: [
    [-62, -139],
    [-54, -147],
    [-46, -140],
  ] as XZ[],
  bunker: { x: -46, z: -160, r: 2.2 },
  tower: { x: -20, z: -165, platform: 6 },
  container: { x: -58, z: -128 },
  barracks: { x: -4, z: -162, w: 10, d: 6, floors: 1 },
  truck: { x: -12, z: -140, rot: 0.5 },
  flag: { x: -30, z: -158 },
}

export const DEPOT = {
  fence: { minX: -222, maxX: -128, minZ: -382, maxZ: -308, gate: [-182, -168] as XZ },
  bigTanks: [
    { x: -202, z: -368, r: 7, h: 9 },
    { x: -180, z: -368, r: 7, h: 9 },
    { x: -158, z: -368, r: 7, h: 9 },
  ],
  smallTanks: [
    { x: -208, z: -332, r: 3.5, h: 6 },
    { x: -196, z: -332, r: 3.5, h: 6 },
  ],
  containers: [
    { x: -145, z: -330, rot: Math.PI / 2, stack: 2, color: '#5c6b4a' },
    { x: -138, z: -352, rot: 0, stack: 1, color: '#8a3b2a' },
    { x: -214, z: -318, rot: 0, stack: 1, color: '#2f4c63' },
  ],
  pipeZ: -354,
  office: { x: -152, z: -315, w: 12, d: 7, floors: 1 },
  trucks: [
    { x: -165, z: -318, rot: Math.PI / 2 },
    { x: -188, z: -318, rot: Math.PI / 2 },
  ],
  generator: { x: -134, z: -366 },
  lightTower: { x: -130, z: -312 },
}

export const COMPOUND = {
  minX: 115,
  maxX: 185,
  minZ: -480,
  maxZ: -410,
  southWallHeight: 2.6,
  wallHeight: 3,
  gate: [145, 155] as XZ,
  villa: { x: 150, z: -455, w: 22, d: 14, floors: 2 },
  porchZ: -446.5,
  tower: { x: 182, z: -413, platform: 7.5 },
  garage: { x: 125, z: -424, w: 10, d: 8, floors: 1 },
  shed: { x: 176, z: -470, w: 6, d: 5, floors: 1 },
  escapeVehicle: { x: 148, z: -417, rot: 0 },
  vehicles: [{ x: 164, z: -423, rot: 0.3 }],
  trees: [
    [128, -440],
    [172, -440],
    [120, -470],
    [180, -455],
  ] as XZ[],
}

export const OUTPOST = {
  height: 18,
  mast: { x: -28, z: -702, h: 32 },
  bunker: { x: -56, z: -672, r: 2.4 },
  cabins: [
    { x: -62, z: -700, rot: 0.2 },
    { x: -22, z: -678, rot: -0.1 },
  ],
  dish: { x: -48, z: -710 },
  truck: { x: -8, z: -690, rot: 1.2 },
  flag: { x: -40, z: -660 },
}
