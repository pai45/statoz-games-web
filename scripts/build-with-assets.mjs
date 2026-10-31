import fs from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { generateAssetManifest } from './game-asset-manifest.mjs';

export async function buildWithAssets(env = process.env) {
  const root = process.cwd();
  const buildId = randomUUID();
  const child = spawn(process.execPath, [path.join(root, 'node_modules/next/dist/bin/next'), 'build'], {
    cwd: root, stdio: 'inherit', env: { ...env, NEXT_PUBLIC_ASSET_BUILD_ID: buildId },
  });
  await new Promise((resolve, reject) => {
    child.on('error', reject);
    child.on('exit', (code, signal) => code === 0 ? resolve() : reject(Error(`Next build failed: ${signal || code}`)));
  });
  // Static exports copy public verbatim: keep retired runtimes out of the artifact.
  if (env.GITHUB_PAGES === 'true') {
    const removedGames = JSON.parse(await fs.readFile(path.join(root, 'src/domain/removed-games.json'), 'utf8'));
    for (const id of removedGames) for (const prefix of ['games', 'embedded-games', 'assets/games']) {
      const source = path.join(root, 'out', prefix, id);
      const archive = path.join(root, '.cache/removed-exports', buildId, prefix, id);
      if (!path.resolve(source).startsWith(path.resolve(root, 'out') + path.sep) || !path.resolve(archive).startsWith(path.resolve(root, '.cache/removed-exports') + path.sep)) throw Error('Invalid retired asset path');
      if (await fs.stat(source).catch(() => null)) {
        await fs.mkdir(path.dirname(archive), { recursive: true });
        await fs.rename(source, archive);
      }
    }
    // Shared single-file covers and identity artwork also stay out of releases.
    for (const folder of ['assets/games', 'assets/games/covers', 'assets/games/identity']) {
      const directory = path.join(root, 'out', folder);
      for (const entry of await fs.readdir(directory, { withFileTypes: true }).catch(error => { if (error.code === 'ENOENT') return []; throw error; })) {
        if (!entry.isFile() || !removedGames.some(id => entry.name.startsWith(id + '.'))) continue;
        const source = path.resolve(directory, entry.name);
        const archive = path.resolve(root, '.cache/removed-exports', buildId, folder, entry.name);
        if (!source.startsWith(path.resolve(root, 'out') + path.sep) || !archive.startsWith(path.resolve(root, '.cache/removed-exports') + path.sep)) throw Error('Invalid retired artwork path');
        await fs.mkdir(path.dirname(archive), { recursive: true });
        await fs.rename(source, archive);
      }
    }
  }
  await generateAssetManifest({ root, buildId, basePath: env.NEXT_PUBLIC_BASE_PATH || '', exportDir: env.GITHUB_PAGES === 'true' ? path.join(root, 'out') : undefined });
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await buildWithAssets();
