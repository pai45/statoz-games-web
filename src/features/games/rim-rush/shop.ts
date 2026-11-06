// Locker items bought with coins earned in play. No real money is involved.
export type Outfit = {id: string; name: string; price: number; jersey: string; trim: string; shorts: string; shoes: string};
export type BallSkin = {id: string; name: string; price: number; base: string; seam: string; stripe: string | null; trail: string};

export const OUTFITS: Outfit[] = [
  {id: 'sunset', name: 'Sunset', price: 0, jersey: '#f08a24', trim: '#fff6e8', shorts: '#1d2b3a', shoes: '#f4f1ea'},
  {id: 'chalk', name: 'Chalk', price: 120, jersey: '#f4efe4', trim: '#1f6f4a', shorts: '#f4efe4', shoes: '#1f6f4a'},
  {id: 'forest', name: 'Forest', price: 160, jersey: '#1f6f4a', trim: '#f2c14e', shorts: '#163d2c', shoes: '#f2c14e'},
  {id: 'harbour', name: 'Harbour', price: 200, jersey: '#2c6e9b', trim: '#f6f0dc', shorts: '#1c3f5a', shoes: '#f6f0dc'},
  {id: 'cherry', name: 'Cherry', price: 260, jersey: '#c3283d', trim: '#ffe7c2', shorts: '#5e1220', shoes: '#ffffff'},
  {id: 'midnight', name: 'Midnight Gold', price: 420, jersey: '#191919', trim: '#e6b422', shorts: '#191919', shoes: '#e6b422'},
];

export const BALLS: BallSkin[] = [
  {id: 'classic', name: 'Classic', price: 0, base: '#d8641e', seam: '#1c120c', stripe: null, trail: '#ffb36b'},
  {id: 'playground', name: 'Playground', price: 100, base: '#b9502a', seam: '#2b1a10', stripe: '#e9d6b2', trail: '#f3dcb0'},
  {id: 'glacier', name: 'Glacier', price: 150, base: '#e9f2f6', seam: '#2b5b7a', stripe: '#7fc6d8', trail: '#bfe8f5'},
  {id: 'lime', name: 'Lime Twist', price: 200, base: '#9ccc3c', seam: '#1e2a10', stripe: '#f2f7e1', trail: '#d8f58a'},
  {id: 'flag', name: 'Tricolour', price: 260, base: '#f3efe6', seam: '#1a1a1a', stripe: '#c8102e', trail: '#ff8a8a'},
  {id: 'gold', name: 'Gold Standard', price: 500, base: '#e0b034', seam: '#4a3410', stripe: '#fff2c2', trail: '#ffe08a'},
];

export const outfitFor = (id: string) => OUTFITS.find(o => o.id === id) ?? null;
export const ballFor = (id: string) => BALLS.find(b => b.id === id) ?? null;
