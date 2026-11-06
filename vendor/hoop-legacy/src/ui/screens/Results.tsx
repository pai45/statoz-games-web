import { ArrowRight, Coins, RotateCcw, Sparkles, TrendingUp, Trophy, Users } from 'lucide-react'
import type { ContestResult, MatchResult, PlayerGameStats } from '../../game/types'
import { shortName } from '../../game/types'
import { ATTRS } from '../../data/attributes'
import type { Rewards } from '../../data/career'
import { go, type Session } from '../../state/store'
import { Button, cx, Emblem, formatNum, Pill } from '../kit'
import { Leaderboard } from '../game/GameScreen'

function pct(m: number, a: number) {
  return a ? `${Math.round((m / a) * 100)}%` : '—'
}

function RewardsPanel({ rewards }: { rewards: Rewards }) {
  return (
    <div className="glass animate-rise rounded-2xl p-4 [animation-delay:200ms]">
      <div className="mb-3 font-display text-xs font-bold uppercase tracking-[0.2em] text-white/60">Career Rewards</div>
      <div className="grid grid-cols-3 gap-3">
        <RewardStat icon={<Sparkles className="size-4 text-sky" />} label="XP" value={`+${rewards.xp}`} />
        <RewardStat icon={<Coins className="size-4 text-gold" />} label="Coins" value={`+${formatNum(rewards.coins)}`} />
        <RewardStat icon={<Users className="size-4 text-blaze-soft" />} label="Fans" value={`+${formatNum(rewards.followers)}`} />
      </div>
      {(rewards.levelUps > 0 || rewards.attributeGains.length > 0 || rewards.messages.length > 0) && (
        <div className="mt-3 flex flex-col gap-1.5 border-t border-white/8 pt-3 text-sm">
          {rewards.levelUps > 0 && (
            <div className="flex items-center gap-2 font-semibold text-good">
              <TrendingUp className="size-4" /> Level up! +{rewards.spGained} skill points to spend
            </div>
          )}
          {rewards.attributeGains.map((g) => (
            <div key={g.key} className="flex items-center gap-2 text-good">
              <TrendingUp className="size-4" /> {ATTRS.find((a) => a.key === g.key)?.label} +{g.amount}
            </div>
          ))}
          {rewards.messages.map((m) => (
            <div key={m} className="flex items-center gap-2 text-white/80">
              <Trophy className="size-4 text-gold" /> {m}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function RewardStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/5 px-3 py-2">
      <div className="flex items-center gap-1.5 font-display text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
        {icon}
        {label}
      </div>
      <div className="font-display text-2xl font-black italic">{value}</div>
    </div>
  )
}

export function ResultsScreen({ session, result, rewards }: { session: Session; result: MatchResult; rewards?: Rewards }) {
  if (session.kind !== 'match') return null
  const cfg = session.config
  const humanSide = cfg.sides[0].human ? 0 : cfg.sides[1].human ? 1 : 0
  const won = result.winner === humanSide
  const all = cfg.sides.flatMap((s, ti) => s.players.map((p) => ({ p, ti, st: result.stats[p.id] })))
  const pog = [...all].sort((a, b) => score(b.st) - score(a.st))[0]
  const career = session.origin === 'career'
  return (
    <div className="absolute inset-0 z-10 flex flex-col overflow-hidden bg-gradient-to-r from-ink-950/95 via-ink-950/80 to-ink-950/40">
      <div className="scrollbar-thin safe-pad flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4 py-[max(env(safe-area-inset-top),16px)] sm:px-8 lg:flex-row lg:items-start">
        <div className="flex min-w-0 flex-col gap-4 lg:w-[420px] lg:shrink-0">
          <div className="animate-rise">
            <Pill tone={won ? 'good' : 'bad'}>{won ? 'Victory' : 'Defeat'}</Pill>
            <div className="mt-2 font-display text-[11px] font-bold uppercase tracking-[0.3em] text-white/50">{cfg.label} · Final</div>
            <div className="mt-2 flex items-center gap-4">
              <Emblem team={cfg.sides[0].team} size={54} />
              <div className="font-display text-[clamp(44px,8vw,72px)] font-black italic leading-none tabular-nums">
                <span className={result.winner === 0 ? 'text-white' : 'text-white/45'}>{result.score[0]}</span>
                <span className="mx-2 text-white/30">–</span>
                <span className={result.winner === 1 ? 'text-white' : 'text-white/45'}>{result.score[1]}</span>
              </div>
              <Emblem team={cfg.sides[1].team} size={54} />
            </div>
          </div>
          {pog?.st && (
            <details className="glass animate-rise rounded-2xl p-4 [animation-delay:100ms]">
              <summary className="min-h-11 cursor-pointer font-display text-xs font-bold uppercase tracking-[0.15em] text-gold">Player of the Game</summary>
              <div className="font-display text-2xl font-black uppercase italic">{shortName(pog.p)}</div>
              <div className="mt-1 flex gap-4 font-display text-sm font-bold text-white/75">
                <span>{pog.st.pts} PTS</span>
                <span>{pog.st.reb} REB</span>
                <span>{pog.st.ast} AST</span>
                <span>
                  {pog.st.fgm}/{pog.st.fga} FG
                </span>
              </div>
            </details>
          )}
          {rewards && <RewardsPanel rewards={rewards} />}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <details className="glass animate-rise overflow-hidden rounded-2xl [animation-delay:150ms]">
            <summary className="min-h-11 cursor-pointer border-b border-white/8 px-4 py-3 font-display text-xs font-bold uppercase tracking-[0.2em] text-white/60">Box Score</summary>
            <div className="scrollbar-thin overflow-x-auto">
              <table className="w-full min-w-[560px] text-sm">
                <thead>
                  <tr className="font-display text-[11px] uppercase tracking-wider text-white/45">
                    <th className="px-4 py-2 text-left">Player</th>
                    {['PTS', 'REB', 'AST', 'STL', 'BLK', 'FG', '3PT', 'FT', 'TO'].map((h) => (
                      <th key={h} className="px-2 py-2 text-right">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {all.map(({ p, ti, st }) =>
                    st ? (
                      <tr key={p.id} className={cx('border-t border-white/5', p.id === 'me' && 'bg-blaze/10')}>
                        <td className="px-4 py-2">
                          <div className="flex items-center gap-2">
                            <span className="h-4 w-1 rounded-full" style={{ background: cfg.sides[ti].team.primary }} />
                            <span className="font-semibold">{shortName(p)}</span>
                            <span className="text-xs text-white/40">{p.position}</span>
                          </div>
                        </td>
                        <td className="px-2 text-right font-display text-base font-bold">{st.pts}</td>
                        <td className="px-2 text-right tabular-nums">{st.reb}</td>
                        <td className="px-2 text-right tabular-nums">{st.ast}</td>
                        <td className="px-2 text-right tabular-nums">{st.stl}</td>
                        <td className="px-2 text-right tabular-nums">{st.blk}</td>
                        <td className="px-2 text-right tabular-nums">
                          {st.fgm}/{st.fga}
                        </td>
                        <td className="px-2 text-right tabular-nums">
                          {st.tpm}/{st.tpa}
                        </td>
                        <td className="px-2 text-right tabular-nums">
                          {st.ftm ?? 0}/{st.fta ?? 0}
                        </td>
                        <td className="px-2 pr-4 text-right tabular-nums">{st.tov}</td>
                      </tr>
                    ) : null,
                  )}
                </tbody>
              </table>
            </div>
          </details>
          {result.highlights.length > 0 && (
            <div className="glass animate-rise rounded-2xl p-4 [animation-delay:250ms]">
              <div className="mb-2 font-display text-xs font-bold uppercase tracking-[0.2em] text-white/60">Highlights</div>
              <div className="flex flex-wrap gap-2">
                {result.highlights.map((h, i) => (
                  <Pill key={i} tone="blaze">
                    {h}
                  </Pill>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="safe-pad flex shrink-0 flex-wrap items-center justify-end gap-2 border-t border-white/8 bg-ink-950/80 px-4 py-3 backdrop-blur sm:px-8">
        {career ? (
          <Button variant="primary" size="lg" icon={<ArrowRight className="size-5" />} sound="confirm" onClick={() => go({ id: 'career', tab: 'home' })} autoFocus>
            Continue
          </Button>
        ) : (
          <>
            <Button onClick={() => go({ id: 'menu' })}>Main Menu</Button>
            <Button variant="primary" size="lg" icon={<RotateCcw className="size-4" />} onClick={() => go({ id: 'game', session: { ...session } })} autoFocus>
              Rematch
            </Button>
          </>
        )}
      </div>
    </div>
  )
}

function score(s?: PlayerGameStats) {
  if (!s) return -1
  return s.pts + s.reb * 0.8 + s.ast * 1.1 + s.stl * 1.5 + s.blk * 1.5 - s.tov
}

export function ContestResultsScreen({ session, result, rewards }: { session: Session; result: ContestResult; rewards?: Rewards }) {
  if (session.kind !== 'contest') return null
  const human = session.config.shooters[session.config.humanIndex]
  const multi = session.config.shooters.length > 1
  const career = session.origin === 'career'
  return (
    <div className="absolute inset-0 z-10 flex flex-col overflow-hidden bg-gradient-to-r from-ink-950/95 via-ink-950/85 to-ink-950/40">
      <div className="scrollbar-thin safe-pad flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4 py-[max(env(safe-area-inset-top),16px)] sm:px-8 lg:flex-row">
        <div className="flex flex-col gap-4 lg:w-[420px]">
          <div className="animate-rise">
            {multi ? <Pill tone={result.humanWon ? 'gold' : 'default'}>{result.humanWon ? 'Champion' : `Champion: ${result.champion}`}</Pill> : <Pill tone="blaze">{session.config.label}</Pill>}
            <div className="mt-3 font-display text-[11px] font-bold uppercase tracking-[0.3em] text-white/50">Your best round</div>
            <div className="font-display text-[clamp(56px,10vw,96px)] font-black italic leading-none text-gold">{result.humanBest}</div>
            <div className="mt-1 flex gap-4 font-display text-sm font-bold uppercase text-white/70">
              <span>
                {result.makes}/{result.attempts} made
              </span>
              <span>{pct(result.makes, result.attempts)}</span>
              <span className="text-good">{result.greens} greens</span>
            </div>
          </div>
          {rewards && <RewardsPanel rewards={rewards} />}
        </div>
        {multi && (
          <div className="flex min-w-0 flex-1 flex-col gap-4">
            {result.rounds.map((rows, i) => (
              <div key={i} className="glass animate-rise rounded-2xl p-4">
                <div className="mb-2 font-display text-xs font-bold uppercase tracking-[0.2em] text-white/60">{i === 0 ? 'Round 1' : 'Final Round'}</div>
                <Leaderboard rows={rows} highlightId={human.id} cut={i === 0 && result.rounds.length > 1 ? 3 : undefined} />
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="safe-pad flex shrink-0 flex-wrap items-center justify-end gap-2 border-t border-white/8 bg-ink-950/80 px-4 py-3 backdrop-blur sm:px-8">
        {career ? (
          <Button variant="primary" size="lg" icon={<ArrowRight className="size-5" />} sound="confirm" onClick={() => go({ id: 'career', tab: 'home' })} autoFocus>
            Continue
          </Button>
        ) : (
          <>
            <Button onClick={() => go({ id: 'menu' })}>Main Menu</Button>
            <Button variant="primary" size="lg" icon={<RotateCcw className="size-4" />} onClick={() => go({ id: 'game', session: { ...session } })} autoFocus>
              Shoot Again
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
