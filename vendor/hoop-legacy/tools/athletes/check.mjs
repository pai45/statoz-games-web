#!/usr/bin/env node
// pnpm athletes:check — validates shipped athlete assets against the contract. Exits non-zero on any violation.
// Run with --experimental-strip-types so the rig can be read straight from src/game/world/character/rig.ts.
import { createHash } from 'node:crypto'
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import path from 'node:path'
import { LOCK, PUBLIC_ATHLETES, PUBLIC_BASIS, TOOL_DIR } from './lib/paths.mjs'
import { B, BONE_COUNT } from '../../src/game/world/character/rig.ts'

const errors = []
const warn = []
const fail = (m) => errors.push(m)
const contract = JSON.parse(readFileSync(path.join(TOOL_DIR, 'contract.json'), 'utf8'))
const manifestPath = path.join(PUBLIC_ATHLETES, 'manifest.json')

// ---- rig contract: the contract's bone table must match the game's rig exactly
const rigNames = []
for (const [n, i] of Object.entries(B)) rigNames[i] = n
if (rigNames.length !== BONE_COUNT || JSON.stringify(rigNames) !== JSON.stringify(contract.bones)) fail(`contract bones ${JSON.stringify(contract.bones)} differ from rig.ts ${JSON.stringify(rigNames)}`)

// ---- sources and licenses
if (!existsSync(LOCK)) fail('tools/athletes/sources.lock.json missing (run pnpm athletes:fetch)')
else {
  const lock = JSON.parse(readFileSync(LOCK, 'utf8'))
  for (const [k, it] of Object.entries(lock.items ?? {})) {
    if (!/^[0-9a-f]{64}$/.test(it.sha256 ?? '')) fail(`sources.lock.json: ${k} has no sha256`)
    if (!it.license) fail(`sources.lock.json: ${k} has no license`)
    if (!it.retrieved) fail(`sources.lock.json: ${k} has no retrieval date`)
  }
  for (const k of ['makehuman', 'systemAssets']) if (!lock.items?.[k]?.license?.startsWith('CC0')) fail(`sources.lock.json: ${k} must be CC0`)
  const shipped = path.join(PUBLIC_ATHLETES, 'sources.lock.json')
  if (existsSync(shipped) && readFileSync(shipped, 'utf8') !== readFileSync(LOCK, 'utf8')) fail('public/athletes/sources.lock.json is stale (re-run pnpm athletes:build)')
}

if (!existsSync(manifestPath)) {
  fail('public/athletes/manifest.json missing (run pnpm athletes:build)')
} else {
  const m = JSON.parse(readFileSync(manifestPath, 'utf8'))
  if (m.version !== contract.version) fail(`manifest version ${m.version} != contract ${contract.version}`)
  if (JSON.stringify(m.bones) !== JSON.stringify(contract.bones)) fail('manifest bone table differs from the contract')
  for (const f of ['LICENSES.md', 'sources.lock.json']) if (!existsSync(path.join(PUBLIC_ATHLETES, f))) fail(`public/athletes/${f} missing`)
  for (const f of ['basis_transcoder.js', 'basis_transcoder.wasm']) if (!existsSync(path.join(PUBLIC_BASIS, f))) fail(`public/basis/${f} missing`)

  const referenced = new Set(['manifest.json', 'LICENSES.md', 'sources.lock.json'])
  const checkFile = (entry, what) => {
    referenced.add(entry.file)
    const p = path.join(PUBLIC_ATHLETES, entry.file)
    if (!existsSync(p)) return fail(`${what}: ${entry.file} missing`)
    const buf = readFileSync(p)
    if (buf.length !== entry.bytes) fail(`${what}: ${entry.file} is ${buf.length} bytes, manifest says ${entry.bytes}`)
    if (createHash('sha256').update(buf).digest('hex') !== entry.sha256) fail(`${what}: ${entry.file} sha256 mismatch`)
  }

  for (const [level, lv] of Object.entries(m.levels ?? {})) {
    if (!contract.levels.includes(level)) fail(`unknown level ${level}`)
    const budget = contract.budgets[level]
    let bytes = 0
    for (const [stem, t] of Object.entries(lv.textures ?? {})) {
      checkFile(t, `${level}/texture ${stem}`)
      bytes += t.bytes
    }
    const bySlot = {}
    for (const [name, a] of Object.entries(lv.assets ?? {})) {
      const what = `${level}/${name}`
      checkFile(a.glb, what)
      bytes += a.glb.bytes
      const slot = contract.slots[a.slot]
      if (!slot) {
        fail(`${what}: unknown slot ${a.slot}`)
        continue
      }
      if (!contract.licenses.includes(a.license?.split(' ')[0])) fail(`${what}: license "${a.license}" is not in ${contract.licenses}`)
      if (slot.variants && !slot.variants.includes(a.variant)) fail(`${what}: variant ${a.variant} not in ${slot.variants}`)
      for (const j of a.joints ?? []) if (!contract.bones.includes(j)) fail(`${what}: joint ${j} is not a rig bone`)
      for (const mesh of a.meshes ?? []) {
        for (const mn of mesh.morphs ?? []) {
          const ok = (slot.morphs && slot.morphs.includes(mn)) || (slot.morphPrefix && mn.startsWith(slot.morphPrefix))
          if (!ok) fail(`${what}: morph "${mn}" not allowed for slot ${a.slot}`)
        }
        if (slot.morphs && a.slot !== 'smoke') for (const want of slot.morphs) if (!(mesh.morphs ?? []).includes(want)) fail(`${what}: missing morph ${want}`)
      }
      for (const [key, stem] of Object.entries(a.textures ?? {})) if (!lv.textures?.[stem]) fail(`${what}: texture ${key} -> ${stem} not packed`)
      const zones = a.extras?.printZones
      if (zones) {
        for (const [zn, r] of Object.entries(zones)) {
          if (!contract.printZones.includes(zn)) fail(`${what}: unknown print zone ${zn}`)
          const [x, y, w, h] = r
          if (!(x >= 0 && y >= 0 && w > 0 && h > 0 && x + w <= 1 && y + h <= 1)) fail(`${what}: print zone ${zn} out of [0,1]: ${r}`)
        }
        const list = Object.entries(zones)
        for (let i = 0; i < list.length; i++)
          for (let k = i + 1; k < list.length; k++) {
            const [an, [ax, ay, aw, ah]] = list[i]
            const [bn, [bx, by, bw, bh]] = list[k]
            if (ax < bx + bw && bx < ax + aw && ay < by + bh && by < ay + ah) fail(`${what}: print zones ${an} and ${bn} overlap`)
          }
      }
      if (!slot.labOnly) (bySlot[a.slot] ??= []).push(a)
    }
    // athlete budget: every fixed slot + the most expensive variant of each optional slot
    let tris = 0
    let calls = 0
    for (const list of Object.values(bySlot)) {
      tris += Math.max(...list.map((a) => a.triangles))
      calls += Math.max(...list.map((a) => a.drawCalls))
    }
    const athleteSlots = Object.keys(bySlot)
    if (athleteSlots.length) {
      for (const [sn, s] of Object.entries(contract.slots)) if (s.required && !bySlot[sn]) warn.push(`${level}: required slot ${sn} not built yet`)
      if (tris > budget.triangles) fail(`${level}: athlete triangles ${tris} > budget ${budget.triangles}`)
      if (calls > budget.drawCalls) fail(`${level}: athlete draw calls ${calls} > budget ${budget.drawCalls}`)
    }
    if (bytes > budget.bytes) fail(`${level}: download ${bytes} bytes > budget ${budget.bytes}`)
    if (bytes !== lv.bytes) fail(`${level}: manifest bytes ${lv.bytes} != files ${bytes}`)
    console.log(`[check] ${level}: ${(bytes / 1e6).toFixed(2)} MB${athleteSlots.length ? `, athlete ${tris} tris / ${calls} draws (${athleteSlots.join(', ')})` : ''}`)
  }

  // unreferenced files ship bytes nobody loads
  const walk = (dir) => readdirSync(dir).flatMap((f) => (statSync(path.join(dir, f)).isDirectory() ? walk(path.join(dir, f)) : [path.join(dir, f)]))
  for (const f of walk(PUBLIC_ATHLETES)) {
    const r = path.relative(PUBLIC_ATHLETES, f).split(path.sep).join('/')
    if (!referenced.has(r)) fail(`unreferenced file public/athletes/${r}`)
  }
}

for (const w of warn) console.log(`[check] note: ${w}`)
if (errors.length) {
  for (const e of errors) console.error(`[check] FAIL ${e}`)
  process.exit(1)
}
console.log('[check] ok')
