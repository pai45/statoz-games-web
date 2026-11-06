// Kenney Sports Pack (CC0). Sources, transforms and regions: sports-art.json.
import {manifest, atlasUrl} from 'pitch-rush-art';
import {FIELD, FIELD_W, FIELD_H, WORLD_W, WORLD_H, GOAL_W, GOAL_DEPTH, PEN_W, PEN_D, SIX_W, SIX_D, PEN_SPOT, CENTER_R, ARC_R, CORNER_R} from '../../../../vendor/websoccer/src/constants.js';
import {KITS} from './career.mjs';

let atlas;
const kitAtlases=new Map();
export async function prepareSportsArt() {
  const image = new Image();
  image.src = atlasUrl;
  await image.decode();
  if (image.naturalWidth !== manifest.atlas.size[0] || image.naturalHeight !== manifest.atlas.size[1]) throw Error('Invalid sports atlas');
  atlas = image;
  kitAtlases.clear();
  // Cache cloth-only recolours. Skin, hair, ball and the retained source atlas
  // remain unchanged; never filter/recolour a complete player silhouette.
  for(const kit of KITS.slice(1)){
    const canvas=document.createElement('canvas');canvas.width=image.naturalWidth;canvas.height=image.naturalHeight;
    const ctx=canvas.getContext('2d');ctx.drawImage(image,0,0);
    const pixels=ctx.getImageData(0,0,canvas.width,canvas.height);
    for(const [key,region] of Object.entries(manifest.regions)){
      if(!key.startsWith('blue'))continue;
      const [x,y,w,h]=region.rect;
      for(let row=y;row<y+h;row++)for(let col=x;col<x+w;col++){
        const i=(row*canvas.width+col)*4,d=pixels.data,r=d[i],g=d[i+1],b=d[i+2];
        if(d[i+3]&&b>r+24&&b>g*1.05){
          const shade=b/224;for(let channel=0;channel<3;channel++)d[i+channel]=Math.min(255,Math.round(kit.rgb[channel]*shade));
        }
      }
    }
    ctx.putImageData(pixels,0,0);kitAtlases.set(kit.id,canvas);
  }
}

export function stamp(ctx, key, x, y, w, h, kit='blue') {
  if (!atlas) throw Error('Sports artwork is not ready');
  const [sx, sy, sw, sh] = manifest.regions[key].rect;
  ctx.drawImage(key.startsWith('blue')?(kitAtlases.get(kit)||atlas):atlas, sx, sy, sw, sh, x, y, w ?? sw, h ?? sh);
}

export function drawFigure(ctx, {team, tone, x, y, heading = -Math.PI / 2, stride = 0, speed = 0, kick = 0, slide = false, down = false, scale = 1,kit='blue'}) {
  ctx.save();ctx.translate(x, y);ctx.rotate(heading + Math.PI / 2);ctx.scale(scale, scale);
  const dark = Number(tone === 2 || tone === 3);
  const swing = Math.sin(stride / 4) * Math.min(1, speed / 80);
  if (slide || down) {
    ctx.fillStyle = 'rgba(248,245,225,.45)';ctx.beginPath();ctx.ellipse(0, 14, 7, 14, 0, 0, Math.PI * 2);ctx.fill();
    ctx.scale(1.15, .8);
  }
  stamp(ctx, `foot${dark}`, -7, 9 + swing * 4 - kick * 27, 8, 5);
  stamp(ctx, `foot${dark}`, 0, 9 - swing * 4, 8, 5);
  stamp(ctx, `${team}Arm${dark}`, -12, -3 - swing * 3, 9, 6,kit);
  ctx.save();ctx.scale(-1, 1);stamp(ctx, `${team}Arm${dark}`, -12, -3 + swing * 3, 9, 6,kit);ctx.restore();
  stamp(ctx, `${team}${tone}`, -7.45, -11, 14.9, 22,kit);
  ctx.restore();
}

function line(ctx, x0, y0, x1, y1) {ctx.beginPath();ctx.moveTo(x0, y0);ctx.lineTo(x1, y1);ctx.stroke();}
function circle(ctx, x, y, r) {ctx.beginPath();ctx.arc(x, y, r, 0, Math.PI * 2);ctx.stroke();}

export function buildPitch() {
  const canvas = document.createElement('canvas');canvas.width = WORLD_W;canvas.height = WORLD_H;
  const ctx = canvas.getContext('2d');ctx.imageSmoothingEnabled = true;
  for (let y = 0; y < WORLD_H; y += 64) for (let x = 0; x < WORLD_W; x += 64) stamp(ctx, 'grass', x, y);
  ctx.fillStyle = 'rgba(17,88,57,.26)';
  ctx.fillRect(0, 0, WORLD_W, FIELD.top);ctx.fillRect(0, FIELD.bottom, WORLD_W, WORLD_H - FIELD.bottom);
  ctx.fillRect(0, FIELD.top, FIELD.left, FIELD_H);ctx.fillRect(FIELD.right, FIELD.top, WORLD_W - FIELD.right, FIELD_H);
  ctx.strokeStyle = '#f9f6e4';ctx.lineWidth = 3;ctx.strokeRect(FIELD.left, FIELD.top, FIELD_W, FIELD_H);
  line(ctx, FIELD.left, FIELD.cy, FIELD.right, FIELD.cy);circle(ctx, FIELD.cx, FIELD.cy, CENTER_R);
  ctx.fillStyle = '#f9f6e4';ctx.beginPath();ctx.arc(FIELD.cx, FIELD.cy, 3, 0, Math.PI * 2);ctx.fill();
  for (const side of [-1, 1]) {
    const gy = side < 0 ? FIELD.top : FIELD.bottom, dir = side < 0 ? 1 : -1;
    ctx.strokeRect(FIELD.cx - PEN_W / 2, side < 0 ? gy : gy - PEN_D, PEN_W, PEN_D);
    ctx.strokeRect(FIELD.cx - SIX_W / 2, side < 0 ? gy : gy - SIX_D, SIX_W, SIX_D);
    ctx.beginPath();ctx.arc(FIELD.cx, gy + dir * PEN_SPOT, 2.5, 0, Math.PI * 2);ctx.fill();
    ctx.save();ctx.beginPath();ctx.rect(FIELD.left, side < 0 ? gy + PEN_D : gy - PEN_D - 200, FIELD_W, 200);ctx.clip();circle(ctx, FIELD.cx, gy + dir * PEN_SPOT, ARC_R);ctx.restore();
    for (const x of [FIELD.left, FIELD.right]) {ctx.save();ctx.beginPath();ctx.rect(FIELD.left, FIELD.top, FIELD_W, FIELD_H);ctx.clip();circle(ctx, x, gy, CORNER_R);ctx.restore();}
    // Slice a three-by-three goal without stretching its corner/post thickness.
    ctx.save();ctx.translate(FIELD.cx, gy);if (side > 0) ctx.rotate(Math.PI);
    const cellW = GOAL_W / 3, cellH = GOAL_DEPTH / 3;
    for (let row = 0; row < 3; row++) for (let col = 0; col < 3; col++) {
      const key = [32,33,34,41,42,43,50,51,52][row * 3 + col];
      stamp(ctx, `goal${key}`, -GOAL_W / 2 + col * cellW, -GOAL_DEPTH + row * cellH, cellW, cellH);
    }
    ctx.restore();
  }
  return canvas;
}

let title;
export function drawTitleScreen(ctx, width, height) {
  if (!title) {
    title = buildPitch();
    const g = title.getContext('2d');
    for (let t = 0; t < 2; t++) for (let i = 0; i < 7; i++) drawFigure(g, {team: t ? 'red' : 'blue', tone: i % 5, x: 170 + (i % 3) * 210, y: 270 + Math.floor(i / 3) * 240 + t * 90, heading: t ? Math.PI / 3 : -Math.PI / 4, scale: 1.4});
    stamp(g, 'ball', 395, 570, 12, 12);
  }
  ctx.setTransform(1,0,0,1,0,0);ctx.imageSmoothingEnabled = true;
  const scale = Math.max(width / title.width, height / title.height);
  ctx.drawImage(title, (width - title.width * scale) / 2, (height - title.height * scale) / 2, title.width * scale, title.height * scale);
}
