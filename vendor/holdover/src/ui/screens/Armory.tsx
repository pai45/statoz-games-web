import { useState } from 'react'

import { CAMOS, RETICLES, RIFLES, type RifleSpec } from '../../game/data.ts'
import { levelInfo, type Profile } from '../../game/progression.ts'
import { ScreenHeader, Segmented, StatBar, sfx, useEscape } from '../common.tsx'
import { IconCheck, IconLock } from '../icons.tsx'
import { ReticleThumb, camoSwatch, resolveLoadout } from '../loadout.tsx'
import { RiflePreview } from '../RiflePreview.tsx'

type Tab = 'rifles' | 'camo' | 'reticles'

const STAT_LABELS: Array<[keyof RifleSpec['stats'], string]> = [
  ['damage', 'Damage'],
  ['velocity', 'Velocity'],
  ['stability', 'Stability'],
  ['zoom', 'Optic'],
  ['handling', 'Handling'],
  ['stealth', 'Stealth'],
]

export function Armory({ profile, onBack, onLoadout }: { profile: Profile; onBack: () => void; onLoadout: (loadout: Profile['loadout']) => void }) {
  useEscape(onBack)
  const level = levelInfo(profile.xp).level
  const equipped = resolveLoadout(profile)
  const [tab, setTab] = useState<Tab>('rifles')
  const [focusRifle, setFocusRifle] = useState(equipped.rifle.id)
  const [focusCamo, setFocusCamo] = useState(equipped.camo.id)
  const [focusReticle, setFocusReticle] = useState(equipped.reticle)
  const rifle = RIFLES.find((item) => item.id === focusRifle) ?? equipped.rifle
  const camo = CAMOS.find((item) => item.id === focusCamo) ?? equipped.camo
  const reticle = RETICLES.find((item) => item.id === focusReticle) ?? RETICLES[0]
  const save = (patch: Partial<Profile['loadout']>) => onLoadout({ rifle: equipped.rifle.id, camo: equipped.camo.id, reticle: equipped.reticle, ...patch })
  const focusedLocked = tab === 'rifles' ? rifle.unlockLevel > level : tab === 'camo' ? camo.unlockLevel > level : reticle.unlockLevel > level
  const focusedEquipped = tab === 'rifles' ? rifle.id === equipped.rifle.id : tab === 'camo' ? camo.id === equipped.camo.id : reticle.id === equipped.reticle
  const unlockAt = tab === 'rifles' ? rifle.unlockLevel : tab === 'camo' ? camo.unlockLevel : reticle.unlockLevel
  const equip = () => {
    if (tab === 'rifles') save({ rifle: rifle.id })
    else if (tab === 'camo') save({ camo: camo.id })
    else save({ reticle: reticle.id })
  }
  return (
    <div className="screen">
      <ScreenHeader
        kicker="Gear locker"
        title="Armory"
        onBack={onBack}
        right={
          <Segmented
            options={[
              { value: 'rifles' as Tab, label: 'Rifles' },
              { value: 'camo' as Tab, label: 'Camo' },
              { value: 'reticles' as Tab, label: 'Reticles' },
            ]}
            value={tab}
            onChange={setTab}
          />
        }
      />
      <div className="split">
        <div className="scroll pick-list flex flex-col gap-1.5 pr-1">
          {tab === 'rifles' &&
            RIFLES.map((item) => (
              <button key={item.id} type="button" className={`mission-card !grid-cols-[1fr_auto] ${item.id === rifle.id ? 'active' : ''}`} onClick={() => setFocusRifle(item.id)} {...sfx()}>
                <span className="mission-name">{item.name}</span>
                <span className="label flex items-center gap-1.5">
                  {item.unlockLevel > level ? (
                    <>
                      <IconLock size={12} /> LVL {item.unlockLevel}
                    </>
                  ) : item.id === equipped.rifle.id ? (
                    <span className="text-[var(--ok)]">Equipped</span>
                  ) : (
                    item.designation
                  )}
                </span>
                <span className="col-span-2 text-[12px] text-[var(--text-dim)]">
                  {item.role} · {item.caliber}
                </span>
              </button>
            ))}
          {tab === 'camo' &&
            CAMOS.map((item) => (
              <button key={item.id} type="button" className={`mission-card !grid-cols-[64px_1fr_auto] ${item.id === camo.id ? 'active' : ''}`} onClick={() => setFocusCamo(item.id)} {...sfx()}>
                <span className="swatch row-span-2 !aspect-[1.6]" style={{ backgroundImage: `url(${camoSwatch(item)})` }} />
                <span className="mission-name">{item.name}</span>
                <span className="label row-span-2">{item.unlockLevel > level ? `LVL ${item.unlockLevel}` : item.id === equipped.camo.id ? 'Equipped' : ''}</span>
                <span className="text-[12px] capitalize text-[var(--text-dim)]">{item.pattern} pattern</span>
              </button>
            ))}
          {tab === 'reticles' &&
            RETICLES.map((item) => (
              <button key={item.id} type="button" className={`mission-card !grid-cols-[52px_1fr_auto] ${item.id === reticle.id ? 'active' : ''}`} onClick={() => setFocusReticle(item.id)} {...sfx()}>
                <span className="row-span-2">
                  <ReticleThumb id={item.id} size={46} />
                </span>
                <span className="mission-name">{item.name}</span>
                <span className="label row-span-2">{item.unlockLevel > level ? `LVL ${item.unlockLevel}` : item.id === equipped.reticle ? 'Equipped' : ''}</span>
                <span className="text-[12px] text-[var(--text-dim)]">{item.description}</span>
              </button>
            ))}
        </div>
        <div className="panel scroll flex min-h-0 flex-col">
          <div className="panel-head">
            <span className="label accent">{tab === 'rifles' ? rifle.designation : tab === 'camo' ? 'Finish' : 'Optic reticle'}</span>
            <span className="label">Drag to rotate</span>
          </div>
          <div className="relative">
            {tab === 'reticles' ? (
              <div className="grid place-items-center py-6">
                <ReticleThumb id={reticle.id} size={260} illuminated />
              </div>
            ) : (
              <RiflePreview rifle={rifle} camo={camo} height={300} />
            )}
            <div className="pointer-events-none absolute bottom-3 left-5">
              <div className="display text-[44px]">{tab === 'rifles' ? rifle.name : tab === 'camo' ? camo.name : reticle.name}</div>
            </div>
          </div>
          <div className="divider" />
          <div className="grid gap-6 p-5 xl:grid-cols-2 xl:p-6">
            <div className="flex flex-col gap-3">
              {tab === 'rifles' ? (
                <>
                  <p className="text-[15px] leading-relaxed text-[var(--text-dim)]">{rifle.description}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      ['Caliber', rifle.caliber],
                      ['Action', rifle.action === 'bolt' ? 'Bolt action' : 'Semi-automatic'],
                      ['Optic', `${rifle.zoom[0]}–${rifle.zoom[1]}×`],
                      ['Magazine', `${rifle.magazine} + ${rifle.reserve}`],
                      ['Muzzle velocity', `${rifle.muzzleVelocity} m/s`],
                      ['Armor piercing', rifle.armorPiercing ? 'Yes' : 'No'],
                    ].map(([label, value]) => (
                      <div key={label} className="bonus-row !flex-col !items-start !gap-0.5">
                        <span className="label">{label}</span>
                        <span className="mono text-[13px]">{value}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : tab === 'camo' ? (
                <p className="text-[15px] leading-relaxed text-[var(--text-dim)]">Applied to stock and forend furniture on every rifle. Metalwork and optics stay in their factory finish.</p>
              ) : (
                <p className="text-[15px] leading-relaxed text-[var(--text-dim)]">{reticle.description} Every reticle is first-focal-plane: its marks stay true in milliradians at any magnification.</p>
              )}
            </div>
            {tab === 'rifles' && (
              <div className="flex flex-col gap-2.5">
                <div className="label mb-1">Performance{rifle.id !== equipped.rifle.id ? ` · vs ${equipped.rifle.designation}` : ''}</div>
                {STAT_LABELS.map(([key, label]) => (
                  <StatBar key={key} label={label} value={rifle.stats[key]} compare={rifle.id !== equipped.rifle.id ? equipped.rifle.stats[key] : undefined} />
                ))}
              </div>
            )}
          </div>
          <div className="deploy-bar mt-auto flex items-center justify-end gap-3 border-t border-[var(--line)] p-4 xl:px-6">
            {focusedLocked ? (
              <span className="label flex items-center gap-2">
                <IconLock size={13} /> Unlocks at level {unlockAt} · you are level {level}
              </span>
            ) : focusedEquipped ? (
              <span className="label flex items-center gap-2 text-[var(--ok)]">
                <IconCheck size={14} /> Equipped
              </span>
            ) : null}
            <button type="button" className="btn primary" disabled={focusedLocked || focusedEquipped} onClick={equip} {...sfx('confirm')}>
              Equip
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
