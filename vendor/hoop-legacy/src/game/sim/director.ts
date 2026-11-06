import type { Athlete } from './Athlete'
import type { Match } from './Match'
import type { ShotType } from './shooting'
import { positionWord, type LineKey } from '../engine/commentary'
import { shortName } from '../types'

/** A broadcast lower-third (player line or team run), shown during dead balls. */
export interface StatCard {
  id: number
  kind: 'player' | 'team'
  title: string
  number?: number
  team: { abbr: string; primary: string; secondary: string }
  line: string
  tag?: string
}

/** Everything the booth needs to call a made basket. */
export interface ScoreInfo {
  scorer: Athlete
  points: number
  shot: ShotType
  green: boolean
  assister: Athlete | null
  /** the defender who got dunked on */
  victim: Athlete | null
  alley: boolean
  putback: boolean
  stepback: boolean
  euro: boolean
  andOne: boolean
}

/** The home crowd pulls for side 0. */
const HOME = 0

/**
 * Broadcast presentation for a match: the booth's calls, the crowd's reactions and rituals (chants, organ,
 * air horn), the game's tension, and stat lower-thirds. Match reports what happened; this decides how the
 * broadcast tells it. Nothing here changes the rules.
 */
export class BroadcastDirector {
  private m: Match
  private run = { team: -1, pts: 0, announced: 0 }
  private gamePointCalled = [false, false]
  private clutchCalled = false
  private lastCard = -99
  private shownPts = new Map<Athlete, number>()
  private deadBalls = 0
  private cardId = 1
  tension = 0

  constructor(m: Match) {
    this.m = m
  }

  private get audio() {
    return this.m.engine.audio
  }
  private get booth() {
    return this.m.engine.commentary
  }
  private team(t: 0 | 1) {
    return this.m.config.sides[t].team
  }
  private scoreText() {
    const [a, b] = this.m.score
    return a === b ? `${a} apiece` : `${Math.max(a, b)} to ${Math.min(a, b)}`
  }
  private vars(a: Athlete | null | undefined) {
    return a ? { last: a.profile.lastName, first: a.profile.firstName } : {}
  }

  // ---------------------------------------------------------------- pregame
  tipoff() {
    const h = this.team(0)
    const a = this.team(1)
    this.booth.call('tipoff', { home: `the ${h.city} ${h.name}`, away: `the ${a.city} ${a.name}` }, { priority: 2, follow: 'tipoffColor', followChance: 0.7, ttl: 4000 })
  }

  lineupPlayer(p: Athlete) {
    const pr = p.profile
    this.booth.call('paPlayer', { num: pr.number, pos: positionWord(pr.position), first: pr.firstName, last: pr.lastName }, { priority: 3, speaker: 'pa', ttl: 2500 })
    if (p.team === HOME) this.audio.cheer(0.45)
  }

  // ---------------------------------------------------------------- live
  /** Game tension (0..1) from the margin and how late it is; drives the crowd bed and clutch calls. */
  update() {
    const m = this.m
    const [a, b] = m.score
    const target = m.config.targetScore
    let late = 0
    if (target > 0) late = Math.max(0, (Math.max(a, b) - target * 0.5) / (target * 0.5))
    if (m.config.timeLimit > 0) late = Math.max(late, 1 - m.gameClock / Math.min(120, m.config.timeLimit))
    if (m.overtime) late = 1
    const close = Math.max(0, 1 - Math.abs(a - b) / 7)
    this.tension = Math.min(1, 0.06 + late * close * 1.05)
    this.audio.setTension(this.tension)
    if (!this.clutchCalled && m.config.timeLimit > 0 && !m.overtime && m.gameClock < 30 && m.phase === 'live' && Math.abs(a - b) <= 6) {
      this.clutchCalled = true
      this.booth.call('clutch', { score: this.scoreText() }, { priority: 2, ttl: 5000 })
    }
  }

  score(info: ScoreInfo, before: [number, number]) {
    const m = this.m
    const s = info.scorer
    const team = s.team
    const after = m.score
    const vars = { ...this.vars(s), victim: info.victim?.profile.lastName ?? 'him', passer: info.assister?.profile.lastName ?? '' }
    let key: LineKey = 'jumper'
    let follow: LineKey | undefined
    let priority = 1
    if (info.andOne) {
      key = 'andOne'
      priority = 3
    } else if (info.alley) {
      key = 'alleyOop'
      follow = 'colorAlley'
      priority = 3
    } else if (info.putback) {
      key = 'putback'
      follow = 'colorDunk'
      priority = 3
    } else if (info.shot === 'dunk') {
      key = info.victim ? 'poster' : 'dunk'
      follow = 'colorDunk'
      priority = 3
    } else if (info.points === 3) {
      key = info.stepback ? 'stepbackThree' : info.green ? 'greenThree' : 'three'
      follow = 'colorThree'
      priority = 2
    } else if (info.shot === 'layup') {
      key = info.euro ? 'euro' : 'layup'
      priority = info.euro ? 2 : 1
    }
    this.booth.call(key, vars, { priority, follow, followChance: 0.4 })
    // the scoreboard story: ties, lead changes, runs, game point
    const lb = Math.sign(before[0] - before[1])
    const la = Math.sign(after[0] - after[1])
    if (la === 0) this.booth.call('tie', { score: `${after[0]}` }, { priority: 2, ttl: 5500 })
    else if (lb !== 0 && lb !== la) this.booth.call('leadChange', { team: `the ${this.team(team).name}` }, { priority: 2, ttl: 5500 })
    if (this.run.team === team) this.run.pts += info.points
    else this.run = { team, pts: info.points, announced: 0 }
    if (this.run.pts >= 6 && this.run.pts - this.run.announced >= 4) {
      this.run.announced = this.run.pts
      this.booth.call('run', { run: this.run.pts, team: `the ${this.team(team).name}` }, { priority: 2, follow: 'colorRun', followChance: 0.5, ttl: 7000 })
      const t = this.team(team)
      this.card({ kind: 'team', title: `${t.city} ${t.name}`, team: t, line: `${this.run.pts}-0 run`, tag: 'RUN' }, true)
    }
    const target = m.config.targetScore
    if (target > 0 && !this.gamePointCalled[team] && after[team] >= target - 2 && after[team] < target) {
      this.gamePointCalled[team] = true
      this.booth.call('gamePoint', { team: `the ${this.team(team).name}` }, { priority: 2, ttl: 7000 })
    }
    // the building
    const big = info.shot === 'dunk' || info.points === 3 || info.green || info.alley || info.putback
    if (team === HOME) {
      this.audio.cheer(big ? 1 : 0.6)
      if ((info.shot === 'dunk' || info.alley || info.putback) && Math.random() < 0.55) window.setTimeout(() => this.audio.airHorn(), 450)
    } else {
      this.audio.cheer(big ? 0.32 : 0.18)
      if (info.victim && info.victim.team === HOME) this.audio.boo()
      else if (big) this.audio.aww()
    }
    this.playerCard(s)
  }

  miss(shooter: Athlete, airball: boolean, rimmed: boolean, three: boolean) {
    if (airball) this.booth.call('airball', this.vars(shooter), { priority: 1 })
    if (shooter.team === HOME) {
      if (three || this.tension > 0.45) this.audio.aww()
      else if (rimmed) this.audio.ooh()
    } else if (this.tension > 0.3) this.audio.cheer(0.22)
    else if (rimmed) this.audio.ooh()
  }

  block(blocker: Athlete) {
    this.booth.call('block', this.vars(blocker), { priority: 2, follow: 'colorBlock', followChance: 0.35 })
    this.audio.ooh()
    if (blocker.team === HOME) this.audio.cheer(0.7)
  }

  steal(stealer: Athlete) {
    this.booth.call('steal', this.vars(stealer), { priority: 2, follow: 'colorSteal', followChance: 0.3 })
    if (stealer.team === HOME) this.audio.cheer(0.45)
    else this.audio.aww()
  }

  ankles(handler: Athlete, victim: Athlete, big: boolean) {
    const vars = { ...this.vars(handler), victim: victim.profile.lastName }
    if (big) this.booth.call('ankles', vars, { priority: 3, follow: 'colorAnkles', followChance: 0.55 })
    else this.booth.call('shook', vars, { priority: 1 })
    this.audio.ooh()
    if (big && handler.team === HOME) this.audio.cheer(0.7)
  }

  foul(fouler: Athlete, fouled: Athlete, shots: number) {
    if (shots > 0) this.booth.call('shootingFoul', { ...this.vars(fouled), n: shots === 1 ? 'one' : 'two' }, { priority: 2, ttl: 4000 })
    else this.booth.call('foul', this.vars(fouler), { priority: 2, ttl: 3500 })
    // the crowd never likes a call against its own
    if (fouler.team === HOME) this.audio.boo()
  }

  /** Lining up at the stripe: the home crowd hushes for its shooter and gets loud for the visitor's. */
  ftSetup(shooter: Athlete) {
    if (shooter.team === HOME) this.audio.hush(true)
    else this.audio.cheer(0.35)
  }

  freeThrow(shooter: Athlete, made: boolean, last: boolean) {
    this.audio.hush(false)
    this.booth.call(made ? 'ftMake' : 'ftMiss', this.vars(shooter), { priority: 1, ttl: 2500 })
    if (shooter.team === HOME) {
      if (made) this.audio.cheer(last ? 0.5 : 0.35)
      else this.audio.aww()
    } else if (!made) this.audio.cheer(0.4)
  }

  streak(a: Athlete, level: 0 | 1 | 2, prev: number) {
    if (level === 2) {
      this.booth.call('onFire', this.vars(a), { priority: 3, follow: 'colorFire', followChance: 0.6 })
      if (a.team === HOME) this.audio.cheer(0.9)
      this.card({ kind: 'player', title: shortName(a.profile), number: a.profile.number, team: this.team(a.team), line: `${a.streak} straight buckets`, tag: 'ON FIRE' }, true)
    } else if (level === 1) this.booth.call('heatingUp', this.vars(a), { priority: 2 })
    else if (prev === 2) this.booth.call('cooled', this.vars(a), { priority: 1, ttl: 4000 })
  }

  turnover(reason: string) {
    if (reason.startsWith('SHOT CLOCK')) this.booth.call('shotClock', {}, { priority: 2 })
    else if (reason.startsWith('OUT')) this.booth.call('outOfBounds', {}, { priority: 1 })
  }

  overtime() {
    this.booth.call('overtime', {}, { priority: 3, ttl: 5000 })
    this.audio.cheer(0.8)
  }

  /** Between possessions the arena fills the gap: "DE-FENSE", the organ's "Charge!", the clap rhythm. */
  deadBall(nextPoss: 0 | 1) {
    this.deadBalls++
    const t = this.tension
    if (nextPoss !== HOME && t > 0.3 && Math.random() < 0.55) this.audio.chantDefense(2)
    else if (nextPoss === HOME && t > 0.4 && Math.random() < 0.35) this.audio.organCharge()
    else if (this.deadBalls % 3 === 0 && Math.random() < 0.6) {
      if (Math.random() < 0.5) this.audio.organRiff()
      else this.audio.rhythmClap(2)
    }
  }

  gameOver(winner: 0 | 1) {
    const w = this.m.teams[winner]
    const star = w.reduce((x, y) => (y.stats.pts > x.stats.pts ? y : x), w[0])
    this.booth.call('final', { team: `the ${this.team(winner).name}`, score: this.scoreText() }, { priority: 3, ttl: 6000 })
    this.booth.call('finalColor', { star: star.profile.lastName, pts: star.stats.pts }, { priority: 1, ttl: 12000 })
    if (winner === HOME) {
      this.audio.cheer(1)
      window.setTimeout(() => this.audio.airHorn(), 300)
    } else {
      this.audio.aww()
      this.audio.cheer(0.3)
    }
  }

  // ---------------------------------------------------------------- lower-thirds
  private playerCard(a: Athlete) {
    const st = a.stats
    const shown = this.shownPts.get(a) ?? 0
    // a scorer gets a card once they reach double figures, then every six points or so
    if (st.pts < 8 || st.pts - shown < 6) return
    const parts = [`${st.pts} PTS`, `${st.fgm}/${st.fga} FG`]
    if (st.tpa > 0) parts.push(`${st.tpm}/${st.tpa} 3PT`)
    else if (st.reb >= 3) parts.push(`${st.reb} REB`)
    if (st.ast >= 3 && parts.length < 4) parts.push(`${st.ast} AST`)
    if (this.card({ kind: 'player', title: shortName(a.profile), number: a.profile.number, team: this.team(a.team), line: parts.join('  ·  '), tag: a.fire === 2 ? 'ON FIRE' : st.pts >= 15 ? 'LEADING SCORER' : undefined })) this.shownPts.set(a, st.pts)
  }

  private card(c: Omit<StatCard, 'id'>, force = false) {
    const now = this.m.elapsed
    if (!force && now - this.lastCard < 14) return false
    this.lastCard = now
    this.m.events.onStat?.({ ...c, id: this.cardId++ })
    return true
  }
}
