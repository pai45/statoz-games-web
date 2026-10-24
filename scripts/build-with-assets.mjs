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
  await generateAssetManifest({ root, buildId, basePath: env.NEXT_PUBLIC_BASE_PATH || '', exportDir: env.GITHUB_PAGES === 'true' ? path.join(root, 'out') : undefined });
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await buildWithAssets();
