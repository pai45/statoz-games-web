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
    for (const id of removedGames) for (const prefix of ['games', 'embedded-games']) {
      const source = path.join(root, 'out', prefix, id);
      const archive = path.join(root, '.cache/removed-exports', buildId, prefix, id);
      if (await fs.stat(source).catch(() => null)) {
        await fs.mkdir(path.dirname(archive), { recursive: true });
        await fs.rename(source, archive);
      }
    }
  }
  await generateAssetManifest({ root, buildId, basePath: env.NEXT_PUBLIC_BASE_PATH || '', exportDir: env.GITHUB_PAGES === 'true' ? path.join(root, 'out') : undefined });
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await buildWithAssets();
