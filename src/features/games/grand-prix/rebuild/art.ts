import { racingTeams } from '@/mocks/games/grand-prix-racing';
/** Original editable paths, nose up. Shared by previews, cached race sprites and discovery art. */
export function carShapes(teamIndex: number): {
    d: string;
    fill: string;
}[] {
    const t = racingTeams[teamIndex % 10];
    return [
        { d: 'M16 62h18v27H16z M66 62h18v27H66z M12 143h23v34H12z M65 143h23v34H65z', fill: '#17191b' },
        { d: 'M20 64h4v23h-4z M76 64h4v23h-4z M16 146h5v28h-5z M79 146h5v28h-5z', fill: '#3a3c40' },
        { d: 'M23 73h54v5H23z M23 154h54v6H23z', fill: '#7c8588' },
        { d: 'M9 24L13 18H87L91 24V37H9z', fill: t.color },
        { d: 'M10 27h80v5H10z M16 184h68v12H16z', fill: t.accent },
        { d: 'M43 21h14l5 65 15 22-7 58-10 19H40l-10-19-7-58 15-22z', fill: t.color },
        { d: 'M47 28h6l5 66h-16z M29 112l10-9-2 49-5 8z M71 112l-10-9 2 49 5 8z', fill: t.accent },
        { d: 'M37 117q13-32 26 0l-3 31H40z', fill: '#22262a' },
        { d: 'M40 113q10-16 20 0l-2 12H42z', fill: '#9db5bd' },
        { d: 'M43 130q7-10 14 0v9H43z', fill: '#f1e3c3' },
        { d: 'M47 139h6v27h-6z M22 184h56v5H22z', fill: '#454c50' },
        { d: 'M40 91l-6 18-4 40 4-28 11-21z M52 33h3l5 56h-3z', fill: '#ffffff45' },
        { d: 'M66 109l7 8-6 48-7 16h-7l8-22z', fill: '#00000035' },
    ];
}
export const carSvg = (team: number) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 210"><ellipse cx="53" cy="111" rx="41" ry="91" fill="#000" opacity=".16"/>${carShapes(team).map(p => `<path d="${p.d}" fill="${p.fill}"/>`).join('')}</svg>`;
export function drawCar(ctx: CanvasRenderingContext2D, team: number, x: number, y: number, heading: number, scale = 1, alpha = 1) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(heading + Math.PI / 2);
    ctx.scale(.043 * scale, .043 * scale);
    ctx.translate(-50, -105);
    ctx.globalAlpha = alpha;
    for (const shape of carShapes(team)) {
        ctx.fillStyle = shape.fill;
        ctx.fill(new Path2D(shape.d));
    }
    ctx.restore();
}
