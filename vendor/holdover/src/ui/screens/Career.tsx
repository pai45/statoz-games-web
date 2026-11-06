import { MISSIONS, RANKS } from '../../game/data.ts'
import { MAX_LEVEL, allUnlocks, campaignStars, levelInfo, totalXpForLevel, type Profile } from '../../game/progression.ts'
import { RankBadge, ScreenHeader, XpBar, formatTime, useEscape } from '../common.tsx'
import { IconCheck, IconLock } from '../icons.tsx'

export function Career({ profile, onBack }: { profile: Profile; onBack: () => void }) {
  useEscape(onBack)
  const info = levelInfo(profile.xp)
  const stats = profile.stats
  const stars = campaignStars(profile)
  const unlocks = allUnlocks()
  const accuracy = stats.shotsFired > 0 ? Math.round((stats.shotsHit / stats.shotsFired) * 100) : 0
  const headshotRate = stats.kills > 0 ? Math.round((stats.headshots / stats.kills) * 100) : 0
  const tiles: Array<[string, string]> = [
    ['Missions', `${stats.missionsCompleted}/${MISSIONS.length}`],
    ['Campaign stars', `${stars.stars}/${stars.max}`],
    ['Eliminations', stats.kills.toLocaleString()],
    ['Headshots', `${stats.headshots} · ${headshotRate}%`],
    ['Accuracy', `${accuracy}%`],
    ['Longest shot', stats.longestShot > 0 ? `${Math.round(stats.longestShot)} m` : '—'],
    ['Duel record', `${stats.duelWins}–${stats.duelLosses}`],
    ['Best streak', String(stats.bestDuelStreak)],
    ['Rounds won', String(stats.duelRoundsWon)],
    ['Time deployed', formatTime(stats.playSeconds)],
  ]
  return (
    <div className="screen">
      <ScreenHeader kicker="Service record" title="Career" onBack={onBack} />
      <div className="split">
        <div className="flex min-h-0 flex-col gap-3">
          <div className="panel flex flex-col items-center gap-3 p-6 text-center">
            <RankBadge level={info.level} size={110} />
            <div>
              <div className="display text-[38px]">{info.rank}</div>
              <div className="label mt-1">
                {profile.callsign} · Level {info.level} of {MAX_LEVEL}
              </div>
            </div>
            <div className="w-full">
              <XpBar progress={info.progress} height={6} />
              <div className="mono mt-2 flex justify-between text-[11px] text-[var(--text-faint)]">
                <span>{info.maxed ? 'Maximum rank' : `${(info.xpForNext - info.xpIntoLevel).toLocaleString()} XP to level ${info.level + 1}`}</span>
                <span>{profile.xp.toLocaleString()} XP</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {tiles.map(([label, value]) => (
              <div key={label} className="bonus-row !flex-col !items-start !gap-0.5 !py-3">
                <span className="label">{label}</span>
                <span className="display text-[24px]">{value}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="panel scroll min-h-0">
          <div className="panel-head">
            <span className="label accent">Rank ladder</span>
            <span className="label">XP from missions and duels</span>
          </div>
          <div className="flex flex-col">
            {RANKS.map((rank, index) => {
              const level = index + 1
              const reached = info.level >= level
              const rewards = unlocks.filter((item) => item.level === level)
              return (
                <div key={rank} className={`grid grid-cols-[52px_1fr_auto] items-center gap-4 border-b border-[var(--line)] px-5 py-2.5 ${level === info.level ? 'bg-[rgb(217_160_63/10%)]' : ''}`}>
                  <div style={{ opacity: reached ? 1 : 0.4 }}>
                    <RankBadge level={level} size={38} />
                  </div>
                  <div>
                    <div className="display text-[20px]" style={{ color: reached ? 'var(--text)' : 'var(--text-faint)' }}>
                      {rank}
                    </div>
                    <div className="mono text-[10.5px] text-[var(--text-faint)]">
                      LVL {level} · {totalXpForLevel(level).toLocaleString()} XP
                    </div>
                  </div>
                  <div className="flex flex-wrap justify-end gap-1.5">
                    {rewards.map((item) => (
                      <span key={item.id} className={`chip ${reached ? 'accent' : ''}`}>
                        {reached ? <IconCheck size={11} /> : <IconLock size={11} />} {item.name}
                      </span>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
