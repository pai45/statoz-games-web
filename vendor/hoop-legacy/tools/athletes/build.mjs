#!/usr/bin/env node
// pnpm athletes:build [--only stage,stage] [--force] [--skip-pack]
// 1. export-rig.ts (node --experimental-strip-types) -> build/rig.json
// 2. Blender stages, headless: blender -b --factory-startup -P <script> -- --rig ... --build ...
//    Each stage is skipped when the hash of its inputs (script, shared modules, rig, source lock) is unchanged.
// 3. pack.mjs -> public/athletes
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import path from 'node:path'
import { BLENDER, BUILD, LOCK, ROOT, TOOL_DIR } from './lib/paths.mjs'

/** Ordered Blender stages. `inputs` are extra files (relative to tools/athletes) that invalidate the stage. */
const STAGES = [
  { name: 'smoke', script: 'blender/smoke.py', inputs: [], optional: true },
  { name: 'body', script: 'blender/base_body.py', inputs: ['blender/mh.py', 'blender/conform.py', 'blender/subdiv.py', 'blender/raster.py'] },
  { name: 'skin', script: 'blender/skin_bake.py', inputs: ['blender/raster.py', 'build/body/info.json'] },
]
const SHARED = ['blender/common.py']

const argv = process.argv.slice(2)
const force = argv.includes('--force')
const onlyArg = argv.indexOf('--only')
const only = onlyArg >= 0 ? argv[onlyArg + 1].split(',') : null

// PYTHONDONTWRITEBYTECODE keeps __pycache__ out of tools/athletes/blender
const run = (cmd, args, opts = {}) => execFileSync(cmd, args, { stdio: 'inherit', cwd: ROOT, env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' }, ...opts })
const hashFiles = (files) => {
  const h = createHash('sha256')
  for (const f of files) h.update(f).update(existsSync(f) ? readFileSync(f) : Buffer.alloc(0))
  return h.digest('hex')
}

mkdirSync(BUILD, { recursive: true })
console.log('[build] exporting rig')
run(process.execPath, ['--experimental-strip-types', '--no-warnings', path.join(TOOL_DIR, 'export-rig.ts')])
const rigJson = path.join(BUILD, 'rig.json')

if (!existsSync(BLENDER)) throw new Error('Blender missing: run pnpm athletes:fetch')
const stampDir = path.join(BUILD, '.stamps')
mkdirSync(stampDir, { recursive: true })
for (const st of STAGES) {
  if (only ? !only.includes(st.name) : st.optional) continue
  const inputs = [st.script, ...SHARED, ...st.inputs].map((f) => path.join(TOOL_DIR, f)).concat([rigJson, LOCK])
  const stamp = hashFiles(inputs)
  const stampFile = path.join(stampDir, st.name)
  if (!force && existsSync(stampFile) && readFileSync(stampFile, 'utf8') === stamp) {
    console.log(`[build] ${st.name}: up to date`)
    continue
  }
  console.log(`[build] ${st.name}: running Blender`)
  const t0 = Date.now()
  run(BLENDER, ['-b', '--factory-startup', '-noaudio', '-P', path.join(TOOL_DIR, st.script), '--', '--rig', rigJson, '--build', BUILD, '--cache', path.join(ROOT, '.cache', 'athletes')], {
    stdio: ['ignore', 'inherit', 'inherit'],
  })
  writeFileSync(stampFile, stamp)
  console.log(`[build] ${st.name}: done in ${((Date.now() - t0) / 1000).toFixed(1)} s`)
}

if (!argv.includes('--skip-pack')) {
  console.log('[build] packing')
  run(process.execPath, [path.join(TOOL_DIR, 'pack.mjs')])
}
