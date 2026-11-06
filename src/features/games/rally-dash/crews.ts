/** Six fictional rally crews. Equal cars; the choice is colours, number and names. */
export type Crew = { id: string; team: string; driver: string; codriver: string; number: number; body: string; stripe: string; trim: string };

export const crews: Crew[] = [
    { id: 'kova', team: 'Kova Works', driver: 'Ilse Kova', codriver: 'Tom Arden', number: 7, body: '#f6f1e7', stripe: '#ff5b14', trim: '#1b1714' },
    { id: 'sundog', team: 'Sundog Rally', driver: 'Rosa Calder', codriver: 'Ines Vale', number: 3, body: '#ffc629', stripe: '#1b1714', trim: '#d2401a' },
    { id: 'bramble', team: 'Bramble Motorsport', driver: 'Owen Pryce', codriver: 'Dai Morgan', number: 21, body: '#2f6b3a', stripe: '#f6f1e7', trim: '#ffc629' },
    { id: 'ferro', team: 'Ferro Rally Team', driver: 'Luca Ferro', codriver: 'Gia Monti', number: 5, body: '#c8202e', stripe: '#f6f1e7', trim: '#1b1714' },
    { id: 'tundra', team: 'Tundra Lights', driver: 'Mika Hollo', codriver: 'Esa Rinne', number: 12, body: '#1f3f8f', stripe: '#ffc629', trim: '#f6f1e7' },
    { id: 'northline', team: 'Northline', driver: 'Saga Lind', codriver: 'Pia Ek', number: 44, body: '#e4ded3', stripe: '#6d3fa8', trim: '#ff5b14' },
];
