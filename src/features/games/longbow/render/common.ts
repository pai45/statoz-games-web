// Shared helpers and the per-range art direction for the Longbow renderer.
import * as T from 'three';

export const v = (x = 0, y = 0, z = 0) => new T.Vector3(x, y, z);
export const hash = (i: number, seed: number) => {const s = Math.sin(i * 127.1 + seed * 311.7) * 43758.5453; return s - Math.floor(s);};
export const ease = (t: number) => t * t * (3 - 2 * t);

export const PALETTE = {wood: '#7a5634', darkWood: '#4d3420', rope: '#c9b48a', straw: '#d7b866', player: '#c8452d', rival: '#2f7f8c', shaft: '#d9c29a'};

export type GroundName = 'meadow-grass' | 'forest-floor' | 'canyon-sand';

/** One range's look. Colours are sRGB hex; the sun direction points from the range towards the sun. */
export type RangeLook = {
  ground: GroundName; tint: string; lane: string;
  sky: {zenith: string; horizon: string; below: string; glow: string; haze: number; clouds: number; cloudLight: string; cloudShade: string};
  sun: {colour: string; intensity: number; dir: [number, number, number]};
  hemi: {sky: string; ground: string; intensity: number};
  fog: {colour: string; density: number};
  /** Strength of the light reflected from the sky (image-based lighting). */
  environment: number;
  exposure: number;
  /** Colour grade for the post-processing pass: white balance and saturation. */
  grade: {gain: [number, number, number]; saturation: number};
};

export const LOOKS: RangeLook[] = [
  { // Meadow: a fresh late morning with fair-weather clouds.
    ground: 'meadow-grass', tint: '#c8e09a', lane: '#d9eaa6',
    sky: {zenith: '#2f6fc0', horizon: '#c9dcea', below: '#7d8c5c', glow: '#fff1d0', haze: 0.55, clouds: 0.42, cloudLight: '#ffffff', cloudShade: '#a9b9cc'},
    sun: {colour: '#fff0d6', intensity: 3.1, dir: [-0.42, 0.74, 0.52]},
    hemi: {sky: '#dcebff', ground: '#5d7a36', intensity: 0.55},
    fog: {colour: '#c4d6e2', density: 0.0042},
    environment: 0.75, exposure: 1.0,
    grade: {gain: [1.02, 1.0, 0.97], saturation: 1.08},
  },
  { // Pinewood: cool, soft light and mist between the trees.
    ground: 'forest-floor', tint: '#b9c79a', lane: '#cfdcae',
    sky: {zenith: '#4f7fa6', horizon: '#d2dcd8', below: '#46543a', glow: '#ffeccc', haze: 0.9, clouds: 0.58, cloudLight: '#f3f5f4', cloudShade: '#97a6ae'},
    sun: {colour: '#ffe8c4', intensity: 2.5, dir: [0.48, 0.62, 0.62]},
    hemi: {sky: '#e3efe8', ground: '#3f5530', intensity: 0.6},
    fog: {colour: '#c3cfcb', density: 0.0072},
    environment: 0.8, exposure: 1.02,
    grade: {gain: [0.97, 1.0, 1.02], saturation: 1.04},
  },
  { // Red Canyon: warm late-afternoon sun behind the archer, so the cliff shadows fall along the walls, not the lane.
    ground: 'canyon-sand', tint: '#f0b98a', lane: '#f3cfa2',
    sky: {zenith: '#2e62a8', horizon: '#f4cf9e', below: '#9c5f3a', glow: '#ffd29a', haze: 1.0, clouds: 0.22, cloudLight: '#fff0da', cloudShade: '#cf977d'},
    sun: {colour: '#ffcf96', intensity: 3.3, dir: [-0.3, 0.55, 0.78]},
    hemi: {sky: '#ffe8cc', ground: '#8a4a2a', intensity: 0.45},
    fog: {colour: '#eec9a0', density: 0.0036},
    environment: 0.65, exposure: 1.0,
    grade: {gain: [1.05, 0.99, 0.93], saturation: 1.1},
  },
];

/** Disposes the geometry, materials and textures of every mesh and line under `root`. */
export function disposeObject(root: T.Object3D) {
  root.traverse(o => {
    if (o instanceof T.Mesh || o instanceof T.Line) {
      o.geometry.dispose();
      for (const m of Array.isArray(o.material) ? o.material : [o.material]) {for (const value of Object.values(m)) if (value instanceof T.Texture) value.dispose(); m.dispose();}
    }
  });
}
