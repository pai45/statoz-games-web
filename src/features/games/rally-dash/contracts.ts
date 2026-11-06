/** Rally Dash shared types. The game id stays `grand-prix-dash` in the host; everything here is rally-owned. */
export const RULES_VERSION = 1;
export const STEP = 1 / 60;
export const GATES = 24;
/** Gates that close a split (three splits, then the finish line at gate 0). */
export const SPLIT_GATES = [6, 12, 18] as const;

export type Vec = { x: number; y: number };
export type Mode = 'rallycross' | 'stage';
export type Rivals = 'rookie' | 'pro' | 'legend';
export type Surface = 'tarmac' | 'gravel' | 'sand' | 'mud' | 'snow' | 'ice';
export const SURFACES: Surface[] = ['tarmac', 'gravel', 'sand', 'mud', 'snow', 'ice'];
export type Theme = 'forest' | 'desert' | 'snow' | 'coast' | 'farm';
export type StageId = 'pine-ridge' | 'red-mesa' | 'frostvale' | 'harbour-hill' | 'mudbank-farm';
export type CameraMode = 'chase' | 'map';
export type Medal = 'gold' | 'silver' | 'bronze';

export type Setup = {
    version: 1;
    mode: Mode;
    stage: StageId;
    crew: number;
    rivals: Rivals;
    laps: 3 | 5;
    autoThrottle: boolean;
    brakeAssist: boolean;
    noteSounds: boolean;
    vibration: boolean;
    camera: CameraMode;
    engineVolume: number;
    effectsVolume: number;
    muted: boolean;
    touchSize: number;
    touchOpacity: number;
};
export const DEFAULT_SETUP: Setup = { version: 1, mode: 'stage', stage: 'pine-ridge', crew: 0, rivals: 'pro', laps: 3, autoThrottle: false, brakeAssist: false, noteSounds: true, vibration: true, camera: 'chase', engineVolume: .45, effectsVolume: .6, muted: false, touchSize: 68, touchOpacity: .85 };

export type Input = { steer: number; throttle: boolean; brake: boolean; handbrake: boolean };
export const neutralInput = (): Input => ({ steer: 0, throttle: false, brake: false, handbrake: false });

export type TrackPoint = Vec & { s: number; heading: number; curvature: number; turn: number };
export type FeatureKind = 'jump' | 'splash';
export type Feature = { kind: FeatureKind; s: number; length: number };
export type NoteKind = 'left' | 'right' | 'jump' | 'splash' | 'caution';
export type PaceNote = { s: number; end: number; kind: NoteKind; severity: number; hairpin: boolean; long: boolean; into: boolean };

export type Stage = {
    id: StageId;
    name: string;
    region: string;
    description: string;
    difficulty: 1 | 2 | 3;
    theme: Theme;
    width: number;
    points: TrackPoint[];
    length: number;
    bounds: { x: number; y: number; width: number; height: number };
    /** Surface index per sample point (into `SURFACES`). */
    surfaceAt: Uint8Array;
    /** Mix of surfaces by distance, for menus. */
    mix: Partial<Record<Surface, number>>;
    verge: Surface;
    barrier: { distance: number; hardness: number };
    features: Feature[];
    /** Braking-aware target speed per sample, used by rivals and brake assist. */
    speedAt: Float32Array;
    notes: PaceNote[];
    targets: { gold: number; silver: number; bronze: number };
};

export type GhostPoint = Vec & { t: number; heading: number };
export type Ghost = { version: 1; rulesVersion: 1; key: string; time: number; splits: number[]; samples: GhostPoint[] };

export type Car = Vec & {
    id: number;
    crew: number;
    name: string;
    heading: number;
    /** Previous pose, for render interpolation. Plain fields avoid an allocation per tick. */
    px: number;
    py: number;
    ph: number;
    vx: number;
    vy: number;
    speed: number;
    steering: number;
    yawRate: number;
    slip: number;
    surface: Surface;
    offroad: boolean;
    throttle: boolean;
    braking: boolean;
    handbrake: boolean;
    air: number;
    airTime: number;
    inWater: boolean;
    dirt: number;
    s: number;
    safeS: number;
    progress: number;
    laps: number;
    nextGate: number;
    started: boolean;
    lapStart: number;
    best: number | null;
    splits: number[];
    lapTimes: number[];
    finish: number | null;
    stuck: number;
    wrongWay: number;
    recoverCooldown: number;
    contactCooldown: number;
    pace: number;
};

export type Phase = 'intro' | 'countdown' | 'running' | 'paused' | 'finished';
export type EventType = 'count' | 'go' | 'contact' | 'crash' | 'launch' | 'land' | 'splash' | 'split' | 'lap' | 'finish' | 'recover' | 'note';
export type RaceEvent = { type: EventType; car: number; power: number };

export type ResultRow = { name: string; crew: number; position: number; time: number | null; best: number | null; laps: number; gap: number | null; status: 'Finished' | 'Running' | 'Retired' };
export type Result = {
    version: 1;
    rulesVersion: 1;
    id: string;
    mode: Mode;
    stage: StageId;
    crew: number;
    position: number;
    fieldSize: number;
    elapsed: number;
    best: number | null;
    laps: number;
    medal: Medal | null;
    status: 'finished' | 'retired';
    classification: ResultRow[];
};

export type Session = {
    version: 1;
    id: string;
    setup: Setup;
    stage: Stage;
    seed: number;
    phase: Phase;
    resumePhase: Phase;
    clock: number;
    raceClock: number;
    countdown: number;
    cars: Car[];
    tick: number;
    events: RaceEvent[];
    notice: string;
    noticeUntil: number;
    result: Result | null;
    ghost: Ghost | null;
    samples: GhostPoint[];
    newGhost: Ghost | null;
    completedGhosts: Ghost[];
    tutorial: boolean;
    tutorialStep: number;
    /** Latest split: index, time and delta to the stored best (null when there is no best). */
    split: { index: number; time: number; delta: number | null; at: number } | null;
    bestSplits: number[] | null;
    nextNote: number;
};

export type RecordEntry = { best: number; splits: number[]; ghost: Ghost | null; medal: Medal | null };
export type Save = { version: 1; rulesVersion: 1; setup: Setup; records: Record<string, RecordEntry>; recent: Result[]; tutorialSeen: boolean };

export const recordKey = (setup: Pick<Setup, 'stage' | 'autoThrottle' | 'brakeAssist'>) => `${setup.stage}:${setup.autoThrottle ? 'auto' : 'manual'}:${setup.brakeAssist ? 'assist' : 'free'}`;
export const timeLabel = (seconds: number | null | undefined) => seconds == null || !Number.isFinite(seconds) ? '–:––.––' : `${Math.floor(seconds / 60)}:${(seconds % 60).toFixed(2).padStart(5, '0')}`;
export const deltaLabel = (seconds: number) => `${seconds > 0 ? '+' : seconds < 0 ? '−' : '±'}${Math.abs(seconds).toFixed(2)}`;
export const medalFor = (time: number | null | undefined, targets: Stage['targets']): Medal | null => time == null || !Number.isFinite(time) ? null : time <= targets.gold ? 'gold' : time <= targets.silver ? 'silver' : time <= targets.bronze ? 'bronze' : null;
export const medalRank = (medal: Medal | null | undefined) => medal === 'gold' ? 3 : medal === 'silver' ? 2 : medal === 'bronze' ? 1 : 0;
