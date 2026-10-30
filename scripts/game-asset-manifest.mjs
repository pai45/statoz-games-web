import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';

const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const runtime = /\.(?:avif|webp|png|jpe?g|svg|gif|woff2?|ttf|otf|mp3|ogg|wav|m4a|glb|gltf|bin|wasm|js|css|html|json)$/i;
export async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(entries.map(entry => {
    if (entry.isSymbolicLink()) throw Error('Linked asset: ' + entry.name);
    const file = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(file) : [file];
  }));
  return files.flat().sort();
}
const encodePath = value => value.split('/').map(encodeURIComponent).join('/');

// Portraits load on demand. Pre-download only other referenced shop assets
// (including template paths), excluding alternate unused originals.
export function referencedShopFiles(source, files) {
  const selected = new Set();
  for (const match of source.matchAll(/\/assets\/shop\/[^"'`\r\n<>]+/g)) {
    const pattern = match[0].replace(/\$\{[^}]+\}/g, '*').split('?')[0];
    const expression = new RegExp('^' + pattern.split('*').map(part => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('[^/]+') + '$');
    for (const file of files) if (!file.startsWith('assets/shop/portraits/') && runtime.test(file) && !file.split('/').some(part => part.startsWith('.')) && expression.test('/' + file)) selected.add(file);
  }
  return selected;
}

export async function generateAssetManifest({ root, buildId, basePath = '', exportDir }) {
  basePath = basePath.replace(/\/$/, '');
  if (basePath && !/^\/[\w/-]+$/.test(basePath)) throw Error('Invalid asset base path');
  const removedGames = JSON.parse(await fs.readFile(path.join(root, 'src/domain/removed-games.json'), 'utf8'));
  const publicRoot = path.join(root, 'public');
  const publicFiles = (await walk(publicRoot)).map(file => path.relative(publicRoot, file).split(path.sep).join('/'));
  const sourceFiles = (await walk(path.join(root, 'src'))).filter(file => /\.(?:tsx?|css|json)$/.test(file));
  const source = (await Promise.all(sourceFiles.map(file => fs.readFile(file, 'utf8')))).join('\n');
  const selected = referencedShopFiles(source, publicFiles);
  for (const file of publicFiles) {
    if (removedGames.some(id => file.startsWith(`embedded-games/${id}/`) || file.startsWith(`games/${id}/`))) continue;
    // Editable research libraries and immutable build inputs are available locally,
    // while the device cache contains the game-owned runtime representation only.
    if (/^games\/[^/]+\/(?:dissection|originals)\//.test(file)) continue;
    // This manifest is required runtime character data, not a research index.
    if(file==='assets/games/penalty-shootout/imported-characters/manifest.json'){selected.add(file);continue;}
    // Self-hosted arcade games need their local core, BIOS, cartridge and cover cached too.
    if ((file.startsWith('games/retro-hoops/street-hoop/') || file.startsWith('games/retro-football-2/') || file.startsWith('games/stick-cricket/') || file.startsWith('games/f1-racing/') || file.startsWith('games/football-shooting/') || file.startsWith('games/archery-test/') || file.startsWith('games/tennis-bits/') || file.startsWith('games/soccer-real/') || file.startsWith('games/penalty-shooters-2/')) && /\.(?:html|js|css|json|wasm|data|br|gz|zip|7z|png|webp|bundle|bin|glb|jpg|xml|woff2?|ttf|mp3|ogg|wav|webm|m4a)$/i.test(file) && !file.endsWith('assets-manifest.json')) {
      selected.add(file);
      continue;
    }
    if (!runtime.test(file) || /(?:^|\/)(?:reference|source|previews?)(?:\/|\.)|(?:credits|rules|manifest)\.json$/i.test(file)) continue;
    if (file.startsWith('embedded-games/') ||
        (file.startsWith('assets/') && !/^assets\/(?:shop|ads|quiz)\//.test(file) && !file.startsWith('assets/games/designer/')) ||
        /^assets\/ads\/ad-space-[\w-]+\.svg$/.test(file) ||
        file === 'games/stadium-cricket/stadium-preview.jpg') selected.add(file);
  }
  for (const game of ['open-golf', 'pitch-rush', 'final-third', 'retro-hoops', 'retro-football', 'retro-football-2', 'stick-cricket', 'football-shooting', 'f1-racing', 'archery-test', 'tennis-bits', 'soccer-real', 'penalty-shooters-2', 'retro-circuit', 'retro-innings', 'stadium-cricket', 'vibe-basketball'].filter(id => !removedGames.includes(id))) {
    if (!selected.has(`embedded-games/${game}/index.html`)) throw Error('Missing built game: ' + game);
  }
  const records = [];
  const add = async (file, url) => {
    const bytes = await fs.readFile(file);
    records.push({ url: basePath + encodePath(url), hash: hash(bytes), bytes: bytes.length });
  };
  for (const file of [...selected].sort()) await add(path.join(publicRoot, file), '/' + file);
  const staticRoot = path.join(root, '.next/static');
  for (const file of await walk(staticRoot)) {
    if (/\.(?:js|css|woff2?|ttf|wasm)$/.test(file)) await add(file, '/_next/static/' + path.relative(staticRoot, file).split(path.sep).join('/'));
  }
  records.sort((a, b) => a.url.localeCompare(b.url));
  const manifest = { schemaVersion: 1, buildId, revision: hash(JSON.stringify(records)), basePath, totalBytes: records.reduce((sum, file) => sum + file.bytes, 0), files: records };
  const name = `_game-assets/${buildId}.json`;
  for (const destination of [publicRoot, ...(exportDir ? [exportDir] : [])]) {
    await fs.mkdir(path.join(destination, '_game-assets'), { recursive: true });
    await fs.writeFile(path.join(destination, name), JSON.stringify(manifest));
  }
  console.log(`Device download: ${records.length} files, ${(manifest.totalBytes / 1048576).toFixed(1)} MiB`);
  return manifest;
}
