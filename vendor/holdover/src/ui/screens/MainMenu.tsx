import { MISSIONS } from '../../game/data.ts'
import { campaignStars, isMissionUnlocked, levelInfo, type Profile } from '../../game/progression.ts'
import { RankBadge, XpBar, sfx } from '../common.tsx'
import { IconCrosshair } from '../icons.tsx'
import { host } from '../../host'

export type MenuTarget = 'campaign' | 'duel' | 'armory' | 'career' | 'settings'

export function PlayerCard({ profile }: { profile: Profile }) {
  const info = levelInfo(profile.xp)
  return (
    <div className="panel player-card">
      <div className="row-span-3">
        <RankBadge level={info.level} size={52} />
      </div>
      <div className="flex items-baseline justify-between gap-4">
        <span className="display text-[22px] tracking-[0.08em]">{profile.callsign}</span>
        <span className="mono text-[11px] text-[var(--accent)]">LVL {info.level}</span>
      </div>
      <div className="label">{info.rank}</div>
      <div className="flex flex-col gap-1.5">
        <XpBar progress={info.progress} />
        <div className="mono flex justify-between text-[10px] text-[var(--text-faint)]">
          <span>{info.maxed ? 'MAX RANK' : `${info.xpIntoLevel.toLocaleString()} / ${info.xpForNext.toLocaleString()} XP`}</span>
          <span>{profile.xp.toLocaleString()} TOTAL</span>
        </div>
      </div>
    </div>
  )
}

export function MainMenu({ profile, onNavigate, onContinue }: { profile: Profile; onNavigate: (target: MenuTarget) => void; onContinue: (index: number) => void }) {
  const stars = campaignStars(profile)
  const pendingIndex = MISSIONS.findIndex((mission, index) => isMissionUnlocked(profile, index) && !profile.missions[mission.id]?.completed)
  const nextIndex = pendingIndex >= 0 ? pendingIndex : MISSIONS.length - 1
  const nextMission = MISSIONS[nextIndex]
  const items: Array<{ id: MenuTarget; title: string; desc: string; meta: string }> = [
    { id: 'campaign', title: 'Browse Operations', desc: 'Choose any unlocked mission.', meta: `${stars.completed}/${MISSIONS.length} complete` },
    { id: 'duel', title: 'Quick Duel', desc: 'Face one enemy marksman.', meta: `W ${profile.stats.duelWins} · L ${profile.stats.duelLosses}` },
  ]
  return (
    <div className="screen" data-ui-role="game-lobby">
      <div className="topbar">
        <div className="brand">
          <IconCrosshair size={30} className="text-[var(--accent)]" />
          <div>
            <div className="brand-word">HOLDOVER</div>
            <div className="label">Sarn Valley · Long-range operations</div>
          </div>
        </div>
        <details className="panel p-3">
          <summary className="display cursor-pointer">{profile.callsign} · Profile & settings</summary>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" className="btn" onClick={() => onNavigate('armory')}>Armory</button>
            <button type="button" className="btn" onClick={() => onNavigate('career')}>Records</button>
            <button type="button" className="btn" onClick={() => onNavigate('settings')}>Settings</button>
          </div>
        </details>
      </div>

      <div className="grid flex-1 grid-cols-1 items-center gap-4">
        <nav className="main-nav" aria-label="Main menu">
          <button type="button" className="nav-item" data-primary data-ui-role="primary-action" onClick={() => onContinue(nextIndex)} {...sfx('confirm')}>
            <span className="nav-index">→</span>
            <span className="nav-title">{pendingIndex >= 0 ? 'Next operation' : 'Replay operation'}</span>
            <span className="nav-meta">{nextMission.code}</span>
            <span className="nav-desc">{nextMission.name}</span>
          </button>
          {items.map((item, index) => (
            <button key={item.id} type="button" className="nav-item" onClick={() => onNavigate(item.id)} {...sfx('confirm')}>
              <span className="nav-index">0{index + 1}</span>
              <span className="nav-title">{item.title}</span>
              <span className="nav-meta">{item.meta}</span>
              <span className="nav-desc">{item.desc}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="ticker">
        <button type="button" className="btn min-h-11" onClick={() => host()?.emit('exit')}>Back to Archery</button>
      </div>
    </div>
  )
}
