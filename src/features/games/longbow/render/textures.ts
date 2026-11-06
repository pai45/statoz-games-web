// Canvas-generated textures. All original artwork.
import * as T from 'three';
import {hash} from './common';

export function ringTexture() {
  const size = 512, c = document.createElement('canvas'); c.width = c.height = size;
  const ctx = c.getContext('2d')!, colours = ['#f7f3e8', '#f7f3e8', '#1d1d1f', '#1d1d1f', '#2f8fd1', '#2f8fd1', '#d8432f', '#d8432f', '#f3c43d', '#f3c43d'];
  for (let ring = 0; ring < 10; ring++) {
    const r = size / 2 * (1 - ring / 10);
    ctx.beginPath(); ctx.arc(size / 2, size / 2, r, 0, Math.PI * 2); ctx.fillStyle = colours[ring]; ctx.fill();
    ctx.lineWidth = 2; ctx.strokeStyle = ring === 2 || ring === 3 ? '#f7f3e8' : '#1d1d1f'; ctx.stroke();
  }
  ctx.beginPath(); ctx.arc(size / 2, size / 2, size / 40, 0, Math.PI * 2); ctx.lineWidth = 1.5; ctx.strokeStyle = '#1d1d1f'; ctx.stroke();
  ctx.fillStyle = '#1d1d1f'; ctx.fillRect(size / 2 - 3, size / 2 - 0.5, 6, 1); ctx.fillRect(size / 2 - 0.5, size / 2 - 3, 1, 6);
  const t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; t.anisotropy = 4; return t;
}

export function strawTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 256;
  const ctx = c.getContext('2d')!; ctx.fillStyle = '#c9a552'; ctx.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 900; i++) {
    const x = hash(i, 1) * 256, y = hash(i, 2) * 256, a = hash(i, 3) * Math.PI, l = 8 + hash(i, 4) * 22;
    ctx.strokeStyle = ['#e2c473', '#a9853b', '#d8b45c', '#8f6d2e'][i % 4]; ctx.lineWidth = 1 + hash(i, 5);
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); ctx.stroke();
  }
  const t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; t.wrapS = t.wrapT = T.RepeatWrapping; return t;
}

export function labelTexture(text: string) {
  const c = document.createElement('canvas'); c.width = 256; c.height = 128;
  const ctx = c.getContext('2d')!; ctx.fillStyle = '#f3e6c4'; ctx.fillRect(0, 0, 256, 128);
  ctx.strokeStyle = '#4d3420'; ctx.lineWidth = 8; ctx.strokeRect(4, 4, 248, 120);
  ctx.fillStyle = '#2b2416'; ctx.font = "700 72px 'Arial Narrow', Arial, sans-serif"; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, 128, 68);
  const t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; return t;
}

/** A soft round shadow used under props so they sit on the ground, with or without shadow maps. */
export function blobTexture() {
  const size = 128, c = document.createElement('canvas'); c.width = c.height = size;
  const ctx = c.getContext('2d')!, g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  for (let i = 0; i <= 8; i++) {const t = i / 8; g.addColorStop(t, `rgba(0,0,0,${((1 - t) ** 1.8).toFixed(3)})`);}
  ctx.fillStyle = g; ctx.fillRect(0, 0, size, size);
  const t = new T.CanvasTexture(c); t.colorSpace = T.NoColorSpace; return t;
}

/** Material for blob shadows: darkens the ground without writing depth. */
export function blobMaterial(texture: T.Texture, opacity: number) {
  return new T.MeshBasicMaterial({color: '#141008', alphaMap: texture, transparent: true, opacity, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2, fog: true});
}

/** A flat, ground-facing unit plane for blob shadows. */
export function blobGeometry() {
  const g = new T.PlaneGeometry(2, 2); g.rotateX(-Math.PI / 2); return g;
}
