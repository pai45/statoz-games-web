import type {Kit} from './character';

// Original Cricketer team kits. Skin and hair vary per player so the fielding side is not a row of clones.
const SKIN = ['#b97b52', '#8a5636', '#d9a77f', '#6a4129', '#c48b62', '#a36a45', '#e3b994', '#7b4b31'];
const HAIR = ['#17110e', '#271a13', '#0f0c0b', '#3a2819', '#1d1511', '#4a3424', '#120f0d', '#2c1f17'];
const batting = (i: number): Kit => ({shirt: '#c4432f', trim: '#f2e7cb', sleeve: '#c4432f', trousers: '#22304a', accent: '#c4432f', skin: SKIN[i%SKIN.length], hair: HAIR[i%HAIR.length], beard: i === 1});
const fielding = (i: number): Kit => ({shirt: '#1f6a4f', trim: '#e8c55a', sleeve: '#1f6a4f', trousers: '#163a2f', accent: '#e8c55a', skin: SKIN[(i+3)%SKIN.length], hair: HAIR[(i+2)%HAIR.length], beard: i%3 === 1});
export const KITS = {batting: [0, 1].map(batting), fielding: Array.from({length: 9}, (_, i) => fielding(i))};
