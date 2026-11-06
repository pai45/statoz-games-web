#!/usr/bin/env node
// pnpm athletes:fetch — downloads the pinned toolchain inputs into .cache/athletes/ and verifies them.
//
// - Blender is verified against the sha256 published by blender.org (pinned in sources.json).
// - Every other download is hashed; the first fetch records the hash in sources.lock.json and every
//   later fetch must match it. A mismatch fails the run (delete the lock entry to re-pin deliberately).
// - Archives are extracted and then deleted to keep the cache small; a marker records the verified hash.
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, renameSync, rmSync, writeFileSync, statSync } from 'node:fs'
import { execFile, execFileSync } from 'node:child_process'
import { promisify } from 'node:util'
import path from 'node:path'
import { CACHE, LOCK, SOURCES } from './lib/paths.mjs'

const execFileP = promisify(execFile)
const cfg = JSON.parse(readFileSync(SOURCES, 'utf8'))
const lock = existsSync(LOCK) ? JSON.parse(readFileSync(LOCK, 'utf8')) : { items: {} }
lock.items ??= {}
const today = new Date().toISOString().slice(0, 10)
const DL = path.join(CACHE, 'dl')
mkdirSync(DL, { recursive: true })

const sha256File = (f) => createHash('sha256').update(readFileSync(f)).digest('hex')

// curl rather than fetch(): Node 22's undici can hit an uncatchable internal assertion when many
// streamed downloads run concurrently.
async function download(url, dest) {
  const tmp = dest + '.part'
  try {
    await execFileP('curl', ['-fsSL', '--retry', '6', '--retry-all-errors', '--retry-delay', '2', '--connect-timeout', '30', '-o', tmp, url], { maxBuffer: 1 << 20 })
  } catch (e) {
    rmSync(tmp, { force: true })
    throw new Error(`download failed: ${url}: ${e.stderr || e.message}`)
  }
  renameSync(tmp, dest)
}

/** Records or verifies a hash for a lock entry. */
function pin(key, entry, sha, expected) {
  const prev = lock.items[key]
  const want = expected ?? prev?.sha256
  if (want && want !== sha) throw new Error(`checksum mismatch for ${key}: expected ${want}, got ${sha}`)
  lock.items[key] = { ...entry, sha256: sha, retrieved: prev?.sha256 === sha ? prev.retrieved : today }
}

/** Download + verify + extract an archive into CACHE/<dir> (strip the top folder). */
async function archive(key, item, tarFlag) {
  const dir = path.join(CACHE, item.dir)
  const marker = path.join(dir, '.verified-sha256')
  const want = item.sha256 ?? lock.items[key]?.sha256
  if (want && existsSync(marker) && readFileSync(marker, 'utf8').trim() === want) {
    console.log(`[fetch] ${key}: cached`)
    lock.items[key] = { ...lock.items[key], url: item.url, license: item.license, version: item.version }
    return
  }
  const file = path.join(DL, path.basename(new URL(item.url).pathname))
  console.log(`[fetch] ${key}: downloading ${item.url}`)
  await download(item.url, file)
  const sha = sha256File(file)
  pin(key, { url: item.url, license: item.license, version: item.version, bytes: statSync(file).size }, sha, item.sha256)
  rmSync(dir, { recursive: true, force: true })
  mkdirSync(dir, { recursive: true })
  console.log(`[fetch] ${key}: extracting`)
  execFileSync('tar', [tarFlag, file, '-C', dir, '--strip-components=1'], { stdio: 'inherit' })
  rmSync(file)
  writeFileSync(marker, sha + '\n')
}

async function makehuman() {
  const mh = cfg.makehuman
  const key = 'makehuman'
  const base = `https://raw.githubusercontent.com/${mh.repo}/${mh.commit}`
  const prev = lock.items[key]?.commit === mh.commit ? lock.items[key].files ?? {} : {}
  const files = {}
  const all = [mh.licenseFile && { rel: mh.licenseFile, url: `${base}/${mh.licenseFile}` }, ...mh.files.map((f) => ({ rel: f, url: `${base}/${mh.root}/${f}` }))].filter(Boolean)
  let fetched = 0
  let i = 0
  const worker = async () => {
    while (i < all.length) {
      const { rel, url } = all[i++]
      const dest = path.join(CACHE, mh.dir, rel)
      mkdirSync(path.dirname(dest), { recursive: true })
      // raw files are pinned by commit SHA and written atomically, so a present file is complete
      if (!existsSync(dest) || (prev[rel] && sha256File(dest) !== prev[rel])) {
        await download(url, dest)
        fetched++
      }
      const sha = sha256File(dest)
      if (prev[rel] && prev[rel] !== sha) throw new Error(`checksum mismatch for makehuman:${rel}`)
      files[rel] = sha
    }
  }
  await Promise.all(Array.from({ length: 6 }, worker))
  const sorted = Object.fromEntries(Object.keys(files).sort().map((k) => [k, files[k]]))
  const agg = createHash('sha256').update(JSON.stringify(sorted)).digest('hex')
  lock.items[key] = {
    repo: mh.repo,
    commit: mh.commit,
    license: mh.license,
    retrieved: lock.items[key]?.sha256 === agg ? lock.items[key].retrieved : today,
    sha256: agg,
    count: Object.keys(sorted).length,
    files: sorted,
  }
  console.log(`[fetch] makehuman: ${Object.keys(sorted).length} files (${fetched} downloaded)`)
}

async function systemAssets() {
  const item = cfg.systemAssets
  const key = 'systemAssets'
  const file = path.join(DL, path.basename(new URL(item.url).pathname))
  if (!existsSync(file) || (lock.items[key]?.sha256 && sha256File(file) !== lock.items[key].sha256)) {
    console.log(`[fetch] ${key}: downloading ${item.url}`)
    await download(item.url, file)
  }
  const sha = sha256File(file)
  pin(key, { url: item.url, license: item.license, bytes: statSync(file).size, members: item.members }, sha)
  const dir = path.join(CACHE, item.dir)
  if (item.members.length) {
    rmSync(dir, { recursive: true, force: true })
    mkdirSync(dir, { recursive: true })
    execFileSync('unzip', ['-q', '-o', file, ...item.members, '-d', dir], { stdio: 'inherit' })
  }
  console.log(`[fetch] ${key}: ok (${item.members.length} member patterns)`)
}

const only = process.argv.slice(2)
const want = (k) => only.length === 0 || only.includes(k)
try {
  if (want('blender')) await archive('blender', cfg.blender, '-xJf')
  if (want('ktx')) await archive('ktx', cfg.ktx, '-xjf')
  if (want('makehuman')) await makehuman()
  if (want('systemAssets')) await systemAssets()
} finally {
  const out = { $comment: 'Generated by `pnpm athletes:fetch`. Verified hashes of every toolchain input.', items: Object.fromEntries(Object.keys(lock.items).sort().map((k) => [k, lock.items[k]])) }
  writeFileSync(LOCK, JSON.stringify(out, null, 2) + '\n')
}
console.log('[fetch] done')
