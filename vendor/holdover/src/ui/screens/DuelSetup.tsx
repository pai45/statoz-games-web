import { useMemo } from 'react'

import { DUEL_ARENAS, DUEL_DIFFICULTIES, type DuelDifficultyId } from '../../game/data.ts'
import { winsNeeded, type DuelPrefs, type DuelRounds, type Profile } from '../../game/progression.ts'
import { ScreenHeader, Segmented, sfx, useEscape } from '../common.tsx'
import { IconShield, IconWind } from '../icons.tsx'
import { LoadoutPanel } from '../loadout.tsx'
import { ValleyMap, type MapPoint } from '../ValleyMap.tsx'
import { TIME_LABEL, TimeIcon } from './shared.tsx'

export function DuelSetup({
  profile,
  onBack,
  onStart,
  onPrefs,
  onLoadout,
}: {
  profile: Profile
  onBack: () => void
  onStart: () => void
  onPrefs: (prefs: DuelPrefs) => void
  onLoadout: (loadout: Profile['loadout']) => void
}) {
  useEscape(onBack)
  const prefs = profile.duel
  const arena = DUEL_ARENAS.find((item) => item.id === prefs.arena) ?? DUEL_ARENAS[0]
  const difficulty = DUEL_DIFFICULTIES.find((item) => item.id === prefs.difficulty) ?? DUEL_DIFFICULTIES[0]
  const points = useMemo<MapPoint[]>(() => arena.nests.map((nest) => ({ x: nest.pos[0], z: nest.pos[2], kind: 'nest' })), [arena])
  const stats = profile.stats
  return (
    <div className="screen">
      <ScreenHeader
        kicker="Counter-sniper engagement"
        title="Quick Duel"
        onBack={onBack}
        right={
          <div className="hidden gap-6 md:flex">
            {[
              ['Wins', stats.duelWins],
              ['Losses', stats.duelLosses],
              ['Streak', stats.duelStreak],
              ['Best', stats.bestDuelStreak],
            ].map(([label, value]) => (
              <div key={label} className="text-right">
                <div className="label">{label}</div>
                <div className="display text-[34px]">{value}</div>
              </div>
            ))}
          </div>
        }
      />
      <div className="split">
        <div className="scroll pick-list flex flex-col gap-2 pr-1">
          {DUEL_ARENAS.map((item) => (
            <button key={item.id} type="button" className={`mission-card !grid-cols-[1fr_auto] ${item.id === arena.id ? 'active' : ''}`} onClick={() => onPrefs({ ...prefs, arena: item.id })} {...sfx()}>
              <span className="mission-name">{item.name}</span>
              <span className="flex items-center gap-2 text-[var(--text-dim)]">
                <TimeIcon time={item.time} size={14} />
                <span className="mono text-[11px]">{item.range}</span>
              </span>
              <span className="col-span-2 text-[13px] leading-snug text-[var(--text-dim)]">{item.description}</span>
            </button>
          ))}
          <div className="panel mt-2 p-4">
            <div className="label accent mb-2">Rules of the duel</div>
            <ul className="intel-list flex flex-col gap-1">
              <li>One enemy marksman hides in one of {arena.nests.length} positions.</li>
              <li>Scope glint gives him away. It flares just before he fires.</li>
              <li>Hold SPACE to drop below the sill. He must reacquire you.</li>
              <li>Head or chest shots kill. Limb hits make him relocate.</li>
              <li>Rounds last two minutes. First to {winsNeeded(prefs.rounds)} wins.</li>
            </ul>
          </div>
        </div>
        <div className="panel scroll flex min-h-0 flex-col">
          <div className="panel-head">
            <span className="label accent">Engagement · {arena.name}</span>
            <span className="label flex items-center gap-2">
              <TimeIcon time={arena.time} size={13} /> {TIME_LABEL[arena.time]} · <IconWind size={13} /> {arena.wind.min}–{arena.wind.max} m/s
            </span>
          </div>
          <div className="grid gap-6 p-5 xl:grid-cols-2 xl:p-6">
            <div className="flex flex-col gap-5">
              <div>
                <div className="label mb-2">{arena.range} · zero {arena.zero} m</div>
                <h2 className="briefing-title">{arena.name}</h2>
              </div>
              <div className="flex flex-col gap-2">
                <div className="label">Difficulty</div>
                <Segmented options={DUEL_DIFFICULTIES.map((item) => ({ value: item.id, label: item.label }))} value={difficulty.id} onChange={(id: DuelDifficultyId) => onPrefs({ ...prefs, difficulty: id })} />
                <p className="flex items-center gap-2 text-[14px] text-[var(--text-dim)]">
                  <IconShield size={14} /> {difficulty.description} XP ×{difficulty.xpMultiplier.toFixed(2)}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <div className="label">Match length</div>
                <Segmented options={([3, 5, 7] as DuelRounds[]).map((value) => ({ value, label: `Best of ${value}` }))} value={prefs.rounds} onChange={(rounds: DuelRounds) => onPrefs({ ...prefs, rounds })} />
              </div>
            </div>
            <ValleyMap focus={arena.zone} points={points} height={260} />
          </div>
          <div className="divider" />
          <div className="p-5 xl:px-6">
            <details><summary className="btn-ghost min-h-11 cursor-pointer">Customize loadout</summary><LoadoutPanel profile={profile} onChange={onLoadout} /></details>
          </div>
          <div className="deploy-bar mt-auto flex items-center justify-end gap-3 border-t border-[var(--line)] p-4 xl:px-6">
            <button type="button" className="btn primary big" onClick={onStart} {...sfx('confirm')}>
              Start duel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
