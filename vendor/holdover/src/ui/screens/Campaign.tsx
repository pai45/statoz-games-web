import { useMemo, useState } from 'react'

import { MISSIONS, isRequiredSpawn, rifleById } from '../../game/data.ts'
import { campaignStars, isMissionUnlocked, type Profile } from '../../game/progression.ts'
import { ScreenHeader, Stars, formatTime, sfx, useEscape } from '../common.tsx'
import { IconLock, IconStar, IconTarget, IconWind } from '../icons.tsx'
import { LoadoutPanel } from '../loadout.tsx'
import { ValleyMap, type MapPoint } from '../ValleyMap.tsx'
import { TIME_LABEL, TimeIcon } from './shared.tsx'

export function Campaign({
  profile,
  initial,
  onBack,
  onDeploy,
  onLoadout,
}: {
  profile: Profile
  initial: number
  onBack: () => void
  onDeploy: (index: number) => void
  onLoadout: (loadout: Profile['loadout']) => void
}) {
  const [selected, setSelected] = useState(initial)
  useEscape(onBack)
  const mission = MISSIONS[selected]
  const record = profile.missions[mission.id]
  const unlocked = isMissionUnlocked(profile, selected)
  const points = useMemo<MapPoint[]>(
    () =>
      mission.spawns.map((spawn) => ({
        x: spawn.pos[0],
        z: spawn.pos[1],
        kind: spawn.kind === 'civilian' ? 'civilian' : spawn.kind === 'hvt' ? 'hvt' : 'hostile',
      })),
    [mission],
  )
  const targets = mission.spawns.filter(isRequiredSpawn).length
  const civilians = mission.spawns.filter((spawn) => spawn.kind === 'civilian').length
  const totals = campaignStars(profile)
  return (
    <div className="screen">
      <ScreenHeader
        kicker="Operation Sarn Watch"
        title="Campaign"
        onBack={onBack}
        right={
          <div className="text-right">
            <div className="label">Campaign progress</div>
            <div className="display flex items-center justify-end gap-2 text-[34px]">
              {totals.completed}/{MISSIONS.length}
              <span className="flex items-center gap-1 text-[var(--accent)]">
                <IconStar size={20} filled /> {totals.stars}
              </span>
            </div>
          </div>
        }
      />
      <div className="split">
        <div className="scroll pick-list flex flex-col gap-1.5 pr-1">
          {MISSIONS.map((item, index) => {
            const open = isMissionUnlocked(profile, index)
            const rec = profile.missions[item.id]
            return (
              <button key={item.id} type="button" disabled={!open} className={`mission-card ${index === selected ? 'active' : ''}`} onClick={() => setSelected(index)} {...sfx()}>
                <span className="mission-code">
                  {item.code}
                  <br />
                  <span className="text-[var(--text-faint)]">{item.clock}</span>
                </span>
                <span className="mission-name">{item.name}</span>
                <span className="row-span-2 flex flex-col items-end gap-1.5">
                  {open ? <Stars count={rec?.stars ?? 0} size={12} /> : <IconLock size={15} className="text-[var(--text-faint)]" />}
                  <span className="text-[var(--text-faint)]">
                    <TimeIcon time={item.time} size={13} />
                  </span>
                </span>
                <span className="truncate text-[12px] text-[var(--text-dim)]">{open ? item.location : `Complete ${MISSIONS[index - 1]?.code} to unlock`}</span>
              </button>
            )
          })}
        </div>

        <div className="panel scroll flex min-h-0 flex-col">
          <div className="panel-head">
            <span className="label accent">
              {mission.code} · Briefing
            </span>
            <span className="label flex items-center gap-2">
              <TimeIcon time={mission.time} size={13} /> {TIME_LABEL[mission.time]} · {mission.clock}
            </span>
          </div>
          <div className="grid gap-6 p-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] xl:p-6">
            <div className="flex flex-col gap-4">
              <div>
                <div className="label mb-2">{mission.location}</div>
                <h2 className="briefing-title">{mission.name}</h2>
              </div>
              <p className="text-[15px] leading-relaxed text-[var(--text)]">{mission.briefing}</p>
              <ul className="intel-list flex flex-col gap-1">
                {mission.intel.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-2">
                <span className="chip accent">
                  <IconTarget size={13} /> {targets} target{targets === 1 ? '' : 's'}
                </span>
                {civilians > 0 && <span className="chip">{civilians} civilians</span>}
                <span className="chip">
                  <IconWind size={13} /> {mission.wind.min}–{mission.wind.max} m/s
                </span>
                <span className="chip">Zero {mission.zero} m</span>
                {mission.thermal && <span className="chip">Thermal optic</span>}
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="label">Objectives</div>
                <div className="bonus-row">
                  <IconStar size={14} filled className="text-[var(--accent)]" />
                  <span>{mission.objective}</span>
                </div>
                {mission.bonuses.map((bonus) => (
                  <div key={bonus.id} className="bonus-row">
                    <IconStar size={14} className="text-[var(--text-faint)]" />
                    <span className="text-[var(--text-dim)]">{bonus.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <ValleyMap focus={mission.zone} points={points} height={250} />
              <div className="grid grid-cols-3 gap-2">
                {[
                  ['Best score', record?.bestScore ? record.bestScore.toLocaleString() : '—'],
                  ['Best time', record?.bestTime ? formatTime(record.bestTime) : '—'],
                  ['Attempts', String(record?.attempts ?? 0)],
                ].map(([label, value]) => (
                  <div key={label} className="bonus-row !flex-col !items-start !gap-0.5">
                    <span className="label">{label}</span>
                    <span className="mono text-[16px]">{value}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <span className="label">Reward · {mission.xp.toLocaleString()} XP first clear</span>
                <span className="label">Suggested · {rifleById(mission.recommended).name}</span>
              </div>
            </div>
          </div>
          <div className="divider" />
          <div className="p-5 xl:px-6">
            <details><summary className="btn-ghost min-h-11 cursor-pointer">Customize loadout</summary><LoadoutPanel profile={profile} onChange={onLoadout} recommended={mission.recommended} /></details>
          </div>
          <div className="deploy-bar mt-auto flex items-center justify-end gap-3 border-t border-[var(--line)] p-4 xl:px-6">
            <button type="button" className="btn primary big" disabled={!unlocked} onClick={() => onDeploy(selected)} {...sfx('confirm')}>
              Deploy
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
