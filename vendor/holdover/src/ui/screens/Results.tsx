import { useEffect } from 'react'

import { MISSIONS, type MissionSpec } from '../../game/data.ts'
import { levelInfo, type DuelSummary, type MissionEvaluation, type MissionStats, type ProgressResult, type UnlockItem } from '../../game/progression.ts'
import { RankBadge, Stars, XpBar, formatTime, playUi, sfx, useCountUp } from '../common.tsx'
import { IconCheck, IconClose } from '../icons.tsx'

export interface MissionResult {
  index: number
  mission: MissionSpec
  success: boolean
  reason: string
  stats: MissionStats
  evaluation: MissionEvaluation
  progress: ProgressResult
  xpBefore: number
}

export interface DuelResult {
  summary: DuelSummary
  progress: ProgressResult
  xpBefore: number
  arena: string
  difficulty: string
}

function XpReport({ progress, xpBefore }: { progress: ProgressResult; xpBefore: number }) {
  const gained = useCountUp(progress.xpGained, 1400, 900)
  const before = levelInfo(xpBefore)
  const after = levelInfo(progress.profile.xp)
  const leveled = progress.levelAfter > progress.levelBefore
  useEffect(() => {
    if (!leveled) return
    const id = window.setTimeout(() => playUi('levelup'), 1900)
    return () => window.clearTimeout(id)
  }, [leveled])
  const sameLevelGain = leveled ? 0 : Math.max(0, after.progress - before.progress)
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-end justify-between">
        <div>
          <div className="label">Experience</div>
          <div className="display text-[44px] text-[var(--accent-hi)]">+{gained.toLocaleString()} XP</div>
        </div>
        <RankBadge level={after.level} size={54} />
      </div>
      <XpBar progress={leveled ? after.progress : before.progress} gain={sameLevelGain} height={6} />
      <div className="mono flex justify-between text-[11px] text-[var(--text-faint)]">
        <span>
          LVL {after.level} · {after.rank}
        </span>
        <span>{after.maxed ? 'MAX' : `${after.xpIntoLevel.toLocaleString()} / ${after.xpForNext.toLocaleString()}`}</span>
      </div>
      {leveled && (
        <div className="levelup" style={{ animationDelay: '1.8s' }}>
          <div className="label accent">Promotion</div>
          <div className="display text-[30px]">
            Level {after.level} · {after.rank}
          </div>
          {progress.unlocks.length > 0 && <UnlockList items={progress.unlocks} />}
        </div>
      )}
    </div>
  )
}

function UnlockList({ items }: { items: UnlockItem[] }) {
  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {items.map((item) => (
        <span key={`${item.type}-${item.id}`} className="chip accent">
          New {item.type} · {item.name}
        </span>
      ))}
    </div>
  )
}

export function Results({
  result,
  onNext,
  onRetry,
  onMenu,
}: {
  result: MissionResult
  onNext: () => void
  onRetry: () => void
  onCampaign: () => void
  onMenu: () => void
}) {
  const { mission, evaluation, stats, success } = result
  const total = useCountUp(evaluation.score, 1300, 600)
  const hasNext = success && result.index < MISSIONS.length - 1
  const accuracy = stats.shots > 0 ? Math.round((stats.hits / stats.shots) * 100) : 0
  return (
    <div className="screen">
      <div className="grid min-h-0 flex-1 items-center gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="flex flex-col gap-5">
          <div className="kicker" style={{ color: success ? 'var(--accent)' : 'var(--danger)' }}>
            {mission.code} · {mission.name}
          </div>
          <h1 className="banner-title !text-left" style={{ color: success ? 'var(--text)' : 'var(--danger)' }}>
            {success ? 'Mission complete' : 'Mission failed'}
          </h1>
          <p className="max-w-[560px] text-[16px] text-[var(--text-dim)]">{result.reason}</p>
          <div className="flex items-center gap-4">
            <Stars count={evaluation.stars} size={40} pop />
            {result.progress.newBest && <span className="chip accent">New personal best</span>}
          </div>
          <details className="max-w-[560px]"><summary className="btn-ghost min-h-11 cursor-pointer">Objectives</summary><div className="flex flex-col gap-1.5">
            <div className={`bonus-row ${success ? '' : 'opacity-60'}`}>
              {success ? <IconCheck size={15} className="text-[var(--ok)]" /> : <IconClose size={15} className="text-[var(--danger)]" />}
              <span>{mission.objective}</span>
            </div>
            {evaluation.bonuses.map(({ spec, met }) => (
              <div key={spec.id} className="bonus-row">
                {met ? <IconCheck size={15} className="text-[var(--ok)]" /> : <IconClose size={15} className="text-[var(--text-faint)]" />}
                <span className={met ? '' : 'text-[var(--text-dim)]'}>{spec.label}</span>
              </div>
            ))}
          </div></details>
        </div>
        <div className="panel flex flex-col gap-5 p-6">
          <div>
            <div className="label mb-2">Score</div>
            <details><summary className="btn-ghost min-h-11 cursor-pointer">Score breakdown</summary>{evaluation.breakdown.map((line, i) => (
              <div key={line.label} className="line-item" style={{ animationDelay: `${0.25 + i * 0.12}s` }}>
                <span>{line.label}</span>
                <span className="mono" style={{ color: line.points < 0 ? 'var(--danger)' : 'var(--text)' }}>
                  {line.points > 0 ? '+' : ''}
                  {line.points.toLocaleString()}
                </span>
              </div>
            ))}</details>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="label">Total</span>
              <span className="display text-[46px]">{total.toLocaleString()}</span>
            </div>
          </div>
          <details><summary className="btn-ghost min-h-11 cursor-pointer">Mission statistics</summary><div className="grid grid-cols-4 gap-2">
            {[
              ['Accuracy', `${accuracy}%`],
              ['Headshots', String(stats.headshots)],
              ['Longest', stats.longestKill > 0 ? `${Math.round(stats.longestKill)}m` : '—'],
              ['Time', formatTime(stats.elapsed)],
            ].map(([label, value]) => (
              <div key={label} className="bonus-row !flex-col !items-start !gap-0.5">
                <span className="label">{label}</span>
                <span className="mono text-[15px]">{value}</span>
              </div>
            ))}
          </div></details>
          <XpReport progress={result.progress} xpBefore={result.xpBefore} />
          <div className="flex flex-wrap gap-2">
            {hasNext ? (
              <button type="button" className="btn primary flex-1" onClick={onNext} {...sfx('confirm')}>
                Next operation
              </button>
            ) : (
              <button type="button" className="btn primary flex-1" onClick={onRetry} {...sfx('confirm')}>
                {success ? 'Replay' : 'Retry'}
              </button>
            )}
            <button type="button" className="btn" onClick={onMenu} {...sfx('back')}>
              Menu
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function DuelResults({ result, onRematch, onMenu }: { result: DuelResult; onRematch: () => void; onSetup: () => void; onMenu: () => void }) {
  const { summary } = result
  const title = summary.winner === 'player' ? 'Victory' : summary.winner === 'enemy' ? 'Defeat' : 'Draw'
  const accuracy = summary.shots > 0 ? Math.round((summary.hits / summary.shots) * 100) : 0
  return (
    <div className="screen">
      <div className="grid min-h-0 flex-1 items-center gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="flex flex-col gap-5">
          <div className="kicker">
            Quick Duel · {result.arena} · {result.difficulty}
          </div>
          <h1 className="banner-title !text-left" style={{ color: summary.winner === 'enemy' ? 'var(--danger)' : 'var(--text)' }}>
            {title}
          </h1>
          <div className="flex items-end gap-6">
            <div>
              <div className="label">You</div>
              <div className="display text-[96px] leading-none">{summary.score.player}</div>
            </div>
            <div className="display pb-5 text-[40px] text-[var(--text-faint)]">–</div>
            <div>
              <div className="label">Marksman</div>
              <div className="display text-[96px] leading-none text-[var(--text-dim)]">{summary.score.enemy}</div>
            </div>
          </div>
          {summary.score.draws > 0 && <span className="label">{summary.score.draws} drawn rounds</span>}
        </div>
        <div className="panel flex flex-col gap-5 p-6">
          <details><summary className="btn-ghost min-h-11 cursor-pointer">Duel statistics</summary><div className="grid grid-cols-4 gap-2">
            {[
              ['Accuracy', `${accuracy}%`],
              ['Headshots', String(summary.headshots)],
              ['Longest', summary.longest > 0 ? `${Math.round(summary.longest)}m` : '—'],
              ['Time', formatTime(summary.elapsed)],
            ].map(([label, value]) => (
              <div key={label} className="bonus-row !flex-col !items-start !gap-0.5">
                <span className="label">{label}</span>
                <span className="mono text-[15px]">{value}</span>
              </div>
            ))}
          </div></details>
          <XpReport progress={result.progress} xpBefore={result.xpBefore} />
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn primary flex-1" onClick={onRematch} {...sfx('confirm')}>
              Rematch
            </button>
            <button type="button" className="btn" onClick={onMenu} {...sfx('back')}>
              Menu
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
