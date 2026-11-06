// Loadout resolution and compact pickers shared by briefings, the duel lobby, and the Armory.
import { useEffect, useRef } from 'react'

import { createCamoTexture } from '../game/builder.ts'
import { CAMOS, RETICLES, RIFLES, camoById, reticleById, rifleById, type CamoSpec, type ReticleId } from '../game/data.ts'
import type { Loadout } from '../game/engine.ts'
import { drawReticlePreview } from '../game/overlay.ts'
import { levelInfo, type Profile } from '../game/progression.ts'
import { sfx } from './common.tsx'
import { IconLock } from './icons.tsx'

export function resolveLoadout(profile: Profile): Loadout {
  const level = levelInfo(profile.xp).level
  let rifle = rifleById(profile.loadout.rifle)
  if (rifle.unlockLevel > level) rifle = RIFLES[0]
  let camo = camoById(profile.loadout.camo)
  if (camo.unlockLevel > level) camo = CAMOS[0]
  let reticle = reticleById(profile.loadout.reticle)
  if (reticle.unlockLevel > level) reticle = RETICLES[0]
  return { rifle, camo, reticle: reticle.id }
}

const swatchCache = new Map<string, string>()

export function camoSwatch(camo: CamoSpec): string {
  let url = swatchCache.get(camo.id)
  if (!url) {
    const texture = createCamoTexture(camo, 128)
    url = (texture.image as HTMLCanvasElement).toDataURL()
    texture.dispose()
    swatchCache.set(camo.id, url)
  }
  return url
}

export function ReticleThumb({ id, size = 64, illuminated = false }: { id: ReticleId; size?: number; illuminated?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = size * dpr
    canvas.height = size * dpr
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    drawReticlePreview(ctx, id, size, illuminated)
  }, [id, size, illuminated])
  return <canvas ref={ref} style={{ width: size, height: size }} aria-label={`${reticleById(id).name} reticle`} />
}

function Locked({ level }: { level: number }) {
  return (
    <span className="lock">
      <IconLock size={13} /> LVL {level}
    </span>
  )
}

export function LoadoutPanel({ profile, onChange, recommended }: { profile: Profile; onChange: (loadout: Profile['loadout']) => void; recommended?: string }) {
  const level = levelInfo(profile.xp).level
  const current = resolveLoadout(profile)
  const set = (patch: Partial<Profile['loadout']>) => onChange({ rifle: current.rifle.id, camo: current.camo.id, reticle: current.reticle, ...patch })
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="label">Rifle</div>
        <div className="grid grid-cols-2 gap-2 xl:grid-cols-4">
          {RIFLES.map((rifle) => {
            const locked = rifle.unlockLevel > level
            return (
              <button key={rifle.id} type="button" disabled={locked} className={`option ${current.rifle.id === rifle.id ? 'active' : ''}`} onClick={() => set({ rifle: rifle.id })} {...sfx()}>
                <span className="label" style={{ color: rifle.id === recommended ? 'var(--accent)' : undefined }}>
                  {rifle.id === recommended ? 'Recommended' : rifle.role}
                </span>
                <span className="display text-[19px]">{rifle.name}</span>
                <span className="mono text-[11px] text-[var(--text-dim)]">
                  {rifle.caliber} · {rifle.zoom[0]}–{rifle.zoom[1]}×
                </span>
                {locked && <Locked level={rifle.unlockLevel} />}
              </button>
            )
          })}
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-[1.4fr_1fr]">
        <div className="flex flex-col gap-2">
          <div className="label">Camouflage · {current.camo.name}</div>
          <div className="grid grid-cols-7 gap-1.5">
            {CAMOS.map((camo) => {
              const locked = camo.unlockLevel > level
              return (
                <button
                  key={camo.id}
                  type="button"
                  disabled={locked}
                  title={locked ? `${camo.name} · unlocks at level ${camo.unlockLevel}` : camo.name}
                  className={`option !p-1 ${current.camo.id === camo.id ? 'active' : ''}`}
                  onClick={() => set({ camo: camo.id })}
                  {...sfx()}
                >
                  <span className="swatch" style={{ backgroundImage: `url(${camoSwatch(camo)})`, aspectRatio: '1' }} />
                  {locked && (
                    <span className="lock">
                      <IconLock size={12} />
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="label">Reticle · {reticleById(current.reticle).name}</div>
          <div className="grid grid-cols-4 gap-1.5">
            {RETICLES.map((reticle) => {
              const locked = reticle.unlockLevel > level
              return (
                <button
                  key={reticle.id}
                  type="button"
                  disabled={locked}
                  title={locked ? `${reticle.name} · unlocks at level ${reticle.unlockLevel}` : reticle.name}
                  className={`option !items-center !p-1 ${current.reticle === reticle.id ? 'active' : ''}`}
                  onClick={() => set({ reticle: reticle.id })}
                  {...sfx()}
                >
                  <ReticleThumb id={reticle.id} size={46} />
                  {locked && (
                    <span className="lock">
                      <IconLock size={12} />
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
