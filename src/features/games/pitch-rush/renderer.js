// Retain the pinned camera/draw lifecycle; replace only presentation methods.
import {Renderer as OriginalRenderer, matchMinute} from '../../../../vendor/websoccer/src/render/renderer.js';
import {BALL_R, CHARGE_MAX, FIELD, FIELD_H, WORLD_W, WORLD_H} from '../../../../vendor/websoccer/src/constants.js';
import {clamp} from '../../../../vendor/websoccer/src/util.js';
import {buildPitch, drawFigure, stamp} from './art.js';

const colours = ['#267eb8', '#c95148'];
function panel(ctx, x, y, w, h, colour = '#fff8e8') {
  ctx.fillStyle = colour;ctx.beginPath();ctx.roundRect(x, y, w, h, 9);ctx.fill();
}

export class Renderer extends OriginalRenderer {
  constructor(canvas) {super(canvas);this.pitch = buildPitch();this.poses = new Map();}

  drawPlayer(ctx, state, t, i, p) {
    const key = t * 100 + i;
    let pose = this.poses.get(key);
    if (!pose || pose.player !== p) {pose = {player: p, x: p.x, y: p.y, distance: 0, kickUntil: 0, charging: false, cooldown: 0};this.poses.set(key, pose);}
    const travel = Math.hypot(p.x - pose.x, p.y - pose.y);
    if (travel < 40) pose.distance += travel;
    pose.x = p.x;pose.y = p.y;
    const kicker = state.ball.kicker;
    if (pose.charging && !p.charging && kicker?.team === t && kicker.idx === i) pose.kickUntil = state.tick + 10;
    if (kicker?.team === t && kicker.idx === i && p.cooldown > pose.cooldown) pose.kickUntil = state.tick + 10;
    pose.charging = p.charging;pose.cooldown = p.cooldown;
    const controlled = state.teams[t].human && state.teams[t].controlled === i;
    ctx.save();ctx.imageSmoothingEnabled = true;
    if (controlled) {ctx.strokeStyle = '#fff8e8';ctx.lineWidth = 2;ctx.beginPath();ctx.ellipse(p.x, p.y, 14, 14, 0, 0, Math.PI * 2);ctx.stroke();}
    drawFigure(ctx, {team: i === 0 ? (t ? 'keeperDark' : 'keeperYellow') : (t ? 'red' : 'blue'),
      tone: (i * 3 + t) % 5, x: p.x, y: p.y, heading: Math.atan2(p.dirY, p.dirX),
      stride: pose.distance, speed: Math.hypot(p.vx, p.vy), kick: clamp((pose.kickUntil - state.tick) / 10, 0, 1), slide: p.slide > 0, down: p.down > 0});
    if (controlled) {
      ctx.fillStyle = colours[t];ctx.strokeStyle = '#fff8e8';ctx.lineWidth = 1.5;ctx.beginPath();ctx.moveTo(p.x, p.y - 16);ctx.lineTo(p.x - 4, p.y - 23);ctx.lineTo(p.x + 4, p.y - 23);ctx.closePath();ctx.fill();ctx.stroke();
      if (p.charging && p.charge > 0) {panel(ctx, p.x - 13, p.y + 17, 26, 4, '#234839');panel(ctx, p.x - 13, p.y + 17, 26 * clamp(p.charge / CHARGE_MAX, 0, 1), 4, '#f4c94e');}
    }
    ctx.restore();
  }

  drawBall(ctx, state) {
    const b = state.ball, r = BALL_R + clamp(b.z / 120, 0, 1.6);
    ctx.save();ctx.imageSmoothingEnabled = true;ctx.translate(b.x, b.y - b.z * .6);
    ctx.rotate((b.x + b.y) / 18);stamp(ctx, 'ball', -r, -r, r * 2, r * 2);ctx.restore();
  }

  drawHud(ctx, state) {
    const W = this.canvas.width, width = Math.min(370, W - 24), x = (W - width) / 2;
    panel(ctx, x, 10, width, 38);ctx.textAlign = 'center';ctx.textBaseline = 'middle';ctx.font = 'bold 16px "Trebuchet MS", Arial, sans-serif';
    ctx.fillStyle = colours[0];ctx.fillText(state.teams[0].name, x + 53, 30);
    ctx.fillStyle = colours[1];ctx.fillText(state.teams[1].name, x + width - 53, 30);
    ctx.fillStyle = '#234839';ctx.font = 'bold 22px "Trebuchet MS", Arial, sans-serif';ctx.fillText(state.score.join('  :  '), W / 2, 29);
    panel(ctx, W / 2 - 28, 48, 56, 22, '#234839');ctx.fillStyle = '#fff8e8';ctx.font = 'bold 13px Arial, sans-serif';ctx.fillText(`${String(matchMinute(state)).padStart(2,'0')}′`, W / 2, 59);
    ctx.textAlign = 'left';ctx.font = 'bold 11px Arial, sans-serif';
    for (let t = 0; t < 2; t++) {panel(ctx, 10, 55 + t * 22, 108, 19, '#fff8e8');ctx.fillStyle = colours[t];ctx.fillText(`${state.teams[t].name} · ${state.teams[t].human ? `P${t+1}` : 'CPU'}`, 19, 65 + t * 22);}
  }

  drawRadar(ctx, state) {
    const w = 62, h = w * WORLD_H / WORLD_W, x = this.canvas.width - w - 14, y = 82;
    panel(ctx, x - 5, y - 5, w + 10, h + 10, '#fff8e8e8');panel(ctx, x, y, w, h, '#268f59');
    const sx = w / WORLD_W, sy = h / WORLD_H;
    ctx.strokeStyle = '#d9ecd4';ctx.lineWidth = 1;ctx.strokeRect(x + FIELD.left * sx, y + FIELD.top * sy, (FIELD.right - FIELD.left) * sx, FIELD_H * sy);
    ctx.beginPath();ctx.moveTo(x + FIELD.left * sx, y + FIELD.cy * sy);ctx.lineTo(x + FIELD.right * sx, y + FIELD.cy * sy);ctx.stroke();
    for (let t = 0; t < 2; t++) for (const p of state.teams[t].players) {ctx.fillStyle = t ? '#ff9d8d' : '#8bd5ff';ctx.beginPath();ctx.arc(x + p.x * sx, y + p.y * sy, 1.8, 0, Math.PI * 2);ctx.fill();}
    ctx.fillStyle = '#fff8e8';ctx.beginPath();ctx.arc(x + state.ball.x * sx, y + state.ball.y * sy, 2, 0, Math.PI * 2);ctx.fill();
    ctx.strokeStyle = '#ffffff9c';ctx.strokeRect(x + (this.cam.x - this.canvas.width / 2.7) * sx, y + (this.cam.y - this.canvas.height / 2.7) * sy, this.canvas.width / 1.35 * sx, this.canvas.height / 1.35 * sy);
  }

  drawMessage(ctx, state) {
    if (!state.message) return;
    const text = state.phase === 'goal' ? `${state.teams[state.lastGoalTeam].name} SCORES!` : state.phase === 'fulltime' ? `FULL TIME  ${state.score.join(' – ')}` : state.message;
    ctx.font = 'bold 28px "Trebuchet MS", Arial, sans-serif';ctx.textAlign = 'center';ctx.textBaseline = 'middle';
    const w = Math.min(this.canvas.width - 24, ctx.measureText(text).width + 42);
    panel(ctx, (this.canvas.width - w) / 2, this.canvas.height / 2 - 48, w, 54, '#fff8e8ed');ctx.fillStyle = '#234839';ctx.fillText(text, this.canvas.width / 2, this.canvas.height / 2 - 20, w - 20);
  }
}
