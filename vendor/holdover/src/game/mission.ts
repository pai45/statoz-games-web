// Campaign mission rules: spawns, behaviours, awareness, detection, return fire, and scoring.
import * as THREE from 'three'

import { Actor, turnToward, type HitPart } from './actors.ts'
import { isRequiredSpawn, type MissionSpec, type RifleSpec, type SpawnSpec } from './data.ts'
import type { XZ } from './layout.ts'
import { mulberry32 } from './noise.ts'
import { bonusMet, duelTuning, emptyMissionStats, scoreKill, type MissionStats } from './progression.ts'
import { SniperBrain } from './sniper.ts'
import { raycastTerrain, terrainHeight } from './terrain.ts'
import type { AlertLevel, BonusState, DuelHud, Glint, HitReport, MissionHud, Session, SessionHost, ShotInfo } from './types.ts'

type Mode = 'idle' | 'patrol' | 'wander' | 'escape' | 'sniper' | 'flee' | 'cower' | 'cover' | 'run' | 'gone'

interface Agent {
  actor: Actor
  spec: SpawnSpec
  required: boolean
  elevated: boolean
  homeX: number
  homeZ: number
  baseHeading: number
  awareness: 0 | 1 | 2
  reaction: { at: number; level: 1 | 2; sx: number; sz: number } | null
  mode: Mode
  path: XZ[] | null
  pathIndex: number
  pathDir: 1 | -1
  loop: boolean
  speed: number
  wait: number
  waitTimer: number
  targetX: number
  targetZ: number
  hasTarget: boolean
  lookTimer: number
  fireTimer: number
  burst: number
  losTimer: number
  hasLos: boolean
  escapeDelay: number
  escapeStarted: boolean
  critical: boolean
  escort: boolean
  wounds: number
  calmTimer: number
  diedAt: number
  brain: SniperBrain | null
  coverTimer: number
}

const _a = new THREE.Vector3()

function pathLoops(path: XZ[]): boolean {
  if (path.length < 3) return false
  let longest = 0
  for (let i = 1; i < path.length; i += 1) longest = Math.max(longest, Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1]))
  const closing = Math.hypot(path[0][0] - path[path.length - 1][0], path[0][1] - path[path.length - 1][1])
  return closing <= longest * 1.1
}

export class MissionSession implements Session {
  readonly kind = 'mission' as const
  readonly actors: Actor[] = []
  readonly mission: MissionSpec
  readonly stats: MissionStats = emptyMissionStats()
  outcome: { success: boolean; reason: string } | null = null
  endTimer = 0
  finished = false
  private readonly host: SessionHost
  private readonly agents: Agent[] = []
  private readonly random: () => number
  private alert: AlertLevel = 'calm'
  private detection = 0
  private compromised = false
  private loudShots = 0
  private lastKillTime = -Infinity
  private hvtNoHeadshot = false
  private escortEscaped = false
  private hvtMovingNotified = false
  private suspiciousTimer = 0

  constructor(host: SessionHost, mission: MissionSpec, missionIndex: number) {
    this.host = host
    this.mission = mission
    this.random = mulberry32(missionIndex * 7919 + 13)
    const tuning = duelTuning('veteran', host.level)
    mission.spawns.forEach((spec, index) => {
      const variant = spec.kind === 'hvt' ? (spec.label === 'Warlord' ? 'warlord' : 'courier') : undefined
      const actor = new Actor({ kind: spec.kind, seed: missionIndex * 101 + index * 17 + 3, variant, flashlight: spec.flashlight })
      const [x, z] = spec.pos
      const elevated = spec.y !== undefined
      const y = spec.y ?? terrainHeight(x, z)
      const heading = THREE.MathUtils.degToRad(spec.facing ?? 180)
      actor.place(x, y, z, heading)
      const behavior = spec.behavior
      const agent: Agent = {
        actor,
        spec,
        required: isRequiredSpawn(spec),
        elevated,
        homeX: x,
        homeZ: z,
        baseHeading: heading,
        awareness: 0,
        reaction: null,
        mode: 'idle',
        path: null,
        pathIndex: 0,
        pathDir: 1,
        loop: false,
        speed: 1.1,
        wait: 2,
        waitTimer: this.random() * 2,
        targetX: x,
        targetZ: z,
        hasTarget: false,
        lookTimer: this.random() * 3,
        fireTimer: 1.5 + this.random() * 3,
        burst: 0,
        losTimer: this.random() * 0.6,
        hasLos: true,
        escapeDelay: 0,
        escapeStarted: false,
        critical: false,
        escort: false,
        wounds: 0,
        calmTimer: 0,
        diedAt: -1,
        brain: null,
        coverTimer: 0,
      }
      switch (behavior.type) {
        case 'idle':
          actor.stance = behavior.pose ?? 'stand'
          break
        case 'patrol':
          agent.mode = 'patrol'
          agent.path = behavior.path
          agent.loop = pathLoops(behavior.path)
          agent.speed = behavior.speed ?? 1.2
          agent.wait = behavior.wait ?? 2
          agent.pathIndex = 1
          break
        case 'wander':
          agent.mode = 'wander'
          agent.speed = 0.8 + this.random() * 0.45
          agent.waitTimer = this.random() * 4
          break
        case 'escape':
          agent.mode = 'escape'
          agent.path = behavior.path
          agent.speed = behavior.speed ?? 1.05
          agent.escapeDelay = behavior.delay
          agent.critical = behavior.critical ?? false
          agent.escort = spec.kind === 'hostile'
          agent.pathIndex = 1
          break
        case 'sniper':
          agent.mode = 'sniper'
          agent.brain = new SniperBrain(host, actor, behavior.nests, tuning, mulberry32(missionIndex * 31 + index))
          agent.brain.start(0, 2)
          agent.brain.onFire = (hit) => {
            if (hit) window.setTimeout(() => this.host.damagePlayer(70, actor.muzzlePosition(_a).clone()), 450)
          }
          break
      }
      if (spec.kind === 'civilian') actor.upper = 'relaxed'
      this.agents.push(agent)
      this.actors.push(actor)
    })
  }

  get live(): boolean {
    return this.outcome === null
  }

  get forceCover(): boolean {
    return false
  }

  // -------------------------------------------------------------------------
  // Awareness

  private alertAgent(agent: Agent, level: 1 | 2, delay: number, sx = 0, sz = 29): void {
    if (!agent.actor.alive || agent.mode === 'gone' || agent.awareness >= level) return
    if (agent.reaction && agent.reaction.level >= level) return
    agent.reaction = { at: this.host.time + delay, level, sx, sz }
  }

  private applyAwareness(agent: Agent, level: 1 | 2, sx: number, sz: number): void {
    agent.awareness = level
    agent.calmTimer = 14 + this.random() * 8
    const actor = agent.actor
    if (agent.spec.kind === 'civilian') {
      // Panic away from the disturbance.
      const away = Math.atan2(actor.x - sx, -(actor.z - sz)) + (this.random() - 0.5) * 1.4
      this.setFleeTarget(agent, away, 12 + this.random() * 14)
      agent.mode = 'flee'
      return
    }
    if (agent.mode === 'sniper') return
    if (agent.spec.kind === 'hvt' || agent.escort) {
      if (agent.spec.behavior.type === 'escape') {
        agent.escapeStarted = true
        if (level === 2) agent.speed = Math.max(agent.speed, 3.1)
      } else if (agent.spec.escapePath) {
        agent.mode = 'run'
        agent.path = agent.spec.escapePath
        agent.pathIndex = 0
        agent.speed = 3.3
        agent.critical = true
        this.host.emit({ type: 'notice', text: `${this.mission.hvtName ?? 'The target'} is running for the vehicle`, tone: 'warn' })
      }
      return
    }
    if (level === 1) {
      actor.look((this.random() - 0.5) * 1.6, 0.05)
      if (!agent.elevated && this.random() < 0.5) actor.stance = 'crouch'
      return
    }
    // Alerted hostiles: take cover nearby, then scan toward the ridge.
    if (agent.elevated || agent.spec.kind === 'heavy') {
      actor.stance = agent.spec.kind === 'heavy' ? 'stand' : 'crouch'
      agent.mode = 'cover'
      agent.hasTarget = false
      agent.coverTimer = 2 + this.random() * 3
      return
    }
    const toNest = Math.atan2(0 - actor.x, -(29 - actor.z))
    const side = this.random() < 0.5 ? -1 : 1
    this.setFleeTarget(agent, toNest + side * (1.2 + this.random() * 0.6), 5 + this.random() * 6)
    agent.mode = 'cover'
    agent.coverTimer = 0
  }

  private setFleeTarget(agent: Agent, bearing: number, distance: number): void {
    const actor = agent.actor
    const collision = this.host.world.collision
    for (let attempt = 0; attempt < 7; attempt += 1) {
      const b = bearing + (attempt === 0 ? 0 : (attempt % 2 ? 1 : -1) * Math.ceil(attempt / 2) * 0.55)
      const d = distance * (1 - attempt * 0.08)
      const tx = actor.x + Math.sin(b) * d
      const tz = actor.z - Math.cos(b) * d
      const ty = terrainHeight(tx, tz)
      if (!collision.blocked(actor.x, actor.y + 0.6, actor.z, tx, ty + 0.6, tz)) {
        agent.targetX = tx
        agent.targetZ = tz
        agent.hasTarget = true
        return
      }
    }
    agent.hasTarget = false
  }

  private updateAlertLevel(): void {
    let level: AlertLevel = 'calm'
    for (const agent of this.agents) {
      if (!agent.actor.alive || agent.spec.kind === 'civilian') continue
      if (agent.awareness === 2) level = 'alerted'
      else if (agent.awareness === 1 && level === 'calm') level = 'suspicious'
    }
    if (this.compromised) level = 'compromised'
    if (level !== this.alert) {
      if (level === 'alerted' && this.alert !== 'compromised') this.host.emit({ type: 'notice', text: 'Hostiles alerted — they are searching for you', tone: 'warn' })
      if (level === 'compromised') this.host.emit({ type: 'notice', text: 'Position compromised — taking fire', tone: 'bad' })
      this.alert = level
      this.host.audio.setMusic(level === 'alerted' || level === 'compromised' ? 'tension' : 'mission')
    }
  }

  // -------------------------------------------------------------------------
  // Session API

  onPlayerFired(rifle: RifleSpec): void {
    this.stats.shots += 1
    if (!this.live) return
    if (rifle.loudness < 0.5) return
    this.loudShots += 1
    for (const agent of this.agents) {
      if (!agent.actor.alive) continue
      const delay = 0.45 + this.random() * 0.8
      if (agent.spec.kind === 'civilian') this.alertAgent(agent, 2, delay * 0.7, agent.actor.x + (this.random() - 0.5) * 10, agent.actor.z + 10)
      else this.alertAgent(agent, this.loudShots >= 2 || agent.awareness >= 1 ? 2 : 1, delay)
    }
    // Muzzle flash gives alerted watchers a fix on the ridge.
    if (this.alert === 'alerted') {
      let reveal = 0
      for (const agent of this.agents) if (agent.actor.alive && agent.awareness === 2 && agent.hasLos && agent.spec.kind !== 'civilian') reveal += 0.14
      this.detection = Math.min(1, this.detection + Math.min(0.42, reveal))
    }
  }

  onBulletSegment(ax: number, ay: number, az: number, bx: number, by: number, bz: number): void {
    for (const agent of this.agents) {
      if (!agent.actor.alive || agent.actor.hidden) continue
      if (agent.actor.headDistanceToSegment(ax, ay, az, bx, by, bz) < 2.6) {
        if (agent.brain) agent.brain.onNearMiss()
        else this.alertAgent(agent, 2, 0.2)
      }
    }
  }

  onBulletImpact(x: number, y: number, z: number): void {
    for (const agent of this.agents) {
      if (!agent.actor.alive) continue
      const d = Math.hypot(agent.actor.x - x, agent.actor.y - y, agent.actor.z - z)
      if (d < 9) {
        if (agent.brain) agent.brain.onNearMiss()
        else this.alertAgent(agent, 2, 0.3 + this.random() * 0.4, x, z)
      }
    }
  }

  private agentFor(actor: Actor): Agent | undefined {
    return this.agents.find((agent) => agent.actor === actor)
  }

  wouldKill(actor: Actor, part: HitPart, rifle: RifleSpec): boolean {
    const agent = this.agentFor(actor)
    if (!agent || !actor.alive) return false
    if (agent.spec.kind === 'civilian') return true
    if (part === 'head') return true
    if (part === 'torso' || part === 'pelvis') return agent.spec.kind !== 'heavy' || rifle.armorPiercing
    return agent.wounds >= 1 || rifle.id === 'anvil'
  }

  isFinalTarget(actor: Actor): boolean {
    const agent = this.agentFor(actor)
    if (!agent || !agent.required || !actor.alive) return false
    return this.agents.every((other) => other === agent || !other.required || !other.actor.alive)
  }

  autoTagged(actor: Actor): boolean {
    return actor.kind === 'hvt' || actor.kind === 'sniper'
  }

  onActorHit(actor: Actor, part: HitPart, shot: ShotInfo): HitReport {
    const agent = this.agentFor(actor)
    if (!agent || !actor.alive) return { result: 'none' }
    const civilian = agent.spec.kind === 'civilian'
    if (!civilian) this.stats.hits += 1
    const lethal = this.wouldKill(actor, part, shot.rifle)
    if (!lethal) {
      if (part === 'torso' || part === 'pelvis') {
        actor.flinch()
        this.alertAgent(agent, 2, 0.1)
        this.host.emit({ type: 'notice', text: 'Armor stopped the round — go for the head', tone: 'warn' })
        return { result: 'armor' }
      }
      agent.wounds += 1
      actor.flinch()
      if (agent.brain) agent.brain.onWounded()
      else {
        this.alertAgent(agent, 2, 0.05)
        if (!agent.elevated) actor.stance = 'crouch'
      }
      return { result: 'wound' }
    }
    const moving = actor.moving
    const undetected = agent.awareness < 2
    actor.die(shot.dirX, shot.dirZ, part, this.host.world.collision, agent.elevated)
    agent.diedAt = this.host.time
    const since = this.host.time - this.lastKillTime
    this.lastKillTime = this.host.time
    const lines = scoreKill({ kind: agent.spec.kind, headshot: part === 'head', moving, distance: shot.distance, sincePrevious: since, undetected })
    const total = lines.reduce((sum, line) => sum + line.points, 0)
    this.stats.killPoints += total
    if (civilian) {
      this.stats.civiliansHit += 1
      this.host.emit({ type: 'score', lines, total, headshot: false })
      this.finish(false, 'Civilian casualty. Rules of engagement violated.', 2.2)
      return { result: 'kill' }
    }
    this.stats.kills += 1
    if (part === 'head') {
      this.stats.headshots += 1
      this.stats.longestHeadshot = Math.max(this.stats.longestHeadshot, shot.distance)
    }
    this.stats.longestKill = Math.max(this.stats.longestKill, shot.distance)
    if (moving) this.stats.movingKills += 1
    if (agent.spec.kind === 'hvt') {
      if (part === 'head') this.stats.hvtHeadshot = true
      else this.hvtNoHeadshot = true
    }
    if (agent.escort) this.stats.escortsKilled += 1
    if (agent.spec.kind === 'sniper') this.stats.sniperFirst = this.agents.some((other) => other.spec.kind === 'hvt' && other.actor.alive)
    this.host.emit({ type: 'score', lines, total, headshot: part === 'head' })
    // Bodies and the sound of the hit spread alarm to anyone close enough to see.
    for (const other of this.agents) {
      if (other === agent || !other.actor.alive) continue
      const d = Math.hypot(other.actor.x - actor.x, other.actor.z - actor.z)
      if (d < 32 && !this.host.world.collision.blocked(other.actor.x, other.actor.y + 1.5, other.actor.z, actor.x, actor.y + 0.6, actor.z)) {
        this.alertAgent(other, 2, 0.5 + this.random() * 0.9, actor.x, actor.z)
      }
    }
    if (this.agents.every((other) => !other.required || !other.actor.alive)) this.finish(true, 'All targets neutralized.', 2.6)
    return { result: 'kill' }
  }

  private finish(success: boolean, reason: string, delay: number): void {
    if (this.outcome) return
    this.outcome = { success, reason }
    this.endTimer = delay
    this.host.audio.setMusic('none')
  }

  glints(): Glint[] {
    const glints: Glint[] = []
    for (const agent of this.agents) {
      if (agent.brain && agent.brain.visible && agent.brain.glint > 0.01) glints.push({ position: agent.actor.opticPosition(), intensity: agent.brain.glint })
    }
    return glints
  }

  killer(): Actor | null {
    return this.agents.find((agent) => agent.brain && agent.actor.alive)?.actor ?? null
  }

  // -------------------------------------------------------------------------
  // Update

  private walk(agent: Agent, tx: number, tz: number, speed: number, dt: number): boolean {
    const actor = agent.actor
    const dx = tx - actor.x
    const dz = tz - actor.z
    const distance = Math.hypot(dx, dz)
    if (distance < 0.2) {
      actor.speed = 0
      return true
    }
    actor.heading = turnToward(actor.heading, Math.atan2(dx, -dz), 5, dt)
    const step = Math.min(distance, speed * dt)
    actor.x += (dx / distance) * step
    actor.z += (dz / distance) * step
    if (!agent.elevated) actor.y = terrainHeight(actor.x, actor.z)
    actor.speed = speed
    return false
  }

  private followPath(agent: Agent, dt: number, pingPong: boolean): boolean {
    const path = agent.path
    if (!path || path.length === 0) return true
    if (agent.waitTimer > 0) {
      agent.waitTimer -= dt
      agent.actor.speed = 0
      return false
    }
    const [tx, tz] = path[Math.max(0, Math.min(path.length - 1, agent.pathIndex))]
    if (this.walk(agent, tx, tz, agent.speed, dt)) {
      if (!pingPong) {
        if (agent.pathIndex >= path.length - 1) return true
        agent.pathIndex += 1
        return false
      }
      const atEnd = agent.loop ? false : agent.pathIndex === 0 || agent.pathIndex === path.length - 1
      if (agent.loop) agent.pathIndex = (agent.pathIndex + 1) % path.length
      else {
        if (agent.pathIndex >= path.length - 1) agent.pathDir = -1
        else if (agent.pathIndex <= 0) agent.pathDir = 1
        agent.pathIndex += agent.pathDir
      }
      if (atEnd || agent.loop) {
        agent.waitTimer = agent.wait * (0.7 + this.random() * 0.6)
        agent.actor.look((this.random() - 0.5) * 1.6, 0)
      }
    }
    return false
  }

  private lookAround(agent: Agent, dt: number, bodyTurns: boolean): void {
    agent.lookTimer -= dt
    if (agent.lookTimer > 0) return
    agent.lookTimer = 2.5 + this.random() * 4
    agent.actor.look((this.random() - 0.5) * 1.8, (this.random() - 0.6) * 0.3)
    if (bodyTurns && this.random() < 0.35) agent.actor.heading = agent.baseHeading + (this.random() - 0.5) * 1.1
  }

  private lineOfSight(agent: Agent): boolean {
    const actor = agent.actor
    actor.headPosition(_a)
    const target = this.host.window
    const dx = target.x - _a.x
    const dy = target.y - _a.y
    const dz = target.z - _a.z
    const length = Math.hypot(dx, dy, dz)
    if (this.host.world.collision.raycast(_a.x, _a.y, _a.z, dx / length, dy / length, dz / length, length - 1.5)) return false
    return raycastTerrain(_a.x, _a.y, _a.z, dx / length, dy / length, dz / length, length - 4, 4) < 0
  }

  update(dt: number, realDt: number): void {
    if (this.outcome) {
      this.endTimer -= realDt
      if (this.endTimer <= 0 && !this.finished) {
        this.finished = true
        this.host.emit({ type: 'missionEnd', success: this.outcome.success, reason: this.outcome.reason, stats: { ...this.stats } })
      }
    } else {
      this.stats.elapsed += dt
    }
    const time = this.host.time
    const exposed = this.host.playerExposed()
    let detectionRate = 0
    for (const agent of this.agents) {
      const actor = agent.actor
      if (!actor.alive || agent.mode === 'gone') {
        actor.speed = 0
        actor.update(dt, time)
        continue
      }
      if (agent.reaction && time >= agent.reaction.at) {
        const { level, sx, sz } = agent.reaction
        agent.reaction = null
        this.applyAwareness(agent, level, sx, sz)
      }
      agent.losTimer -= dt
      if (agent.losTimer <= 0) {
        agent.losTimer = 0.6 + this.random() * 0.3
        agent.hasLos = this.lineOfSight(agent)
      }
      this.behave(agent, dt)
      // Detection: alerted hostiles who can see the ridge eventually spot the shooter.
      const hostile = agent.spec.kind === 'hostile' || agent.spec.kind === 'heavy'
      if (hostile && agent.awareness === 2 && agent.hasLos && exposed && !this.outcome) {
        const distance = Math.hypot(actor.x, actor.z - 29)
        detectionRate += 1 / (6 + distance / 80)
      }
      if (this.compromised && hostile && agent.hasLos && !this.outcome) this.returnFire(agent, dt, exposed)
      if (agent.awareness === 1 && agent.calmTimer > 0) {
        agent.calmTimer -= dt
        if (agent.calmTimer <= 0 && agent.mode !== 'cover') {
          agent.awareness = 0
          actor.stance = agent.spec.behavior.type === 'idle' ? (agent.spec.behavior.pose ?? 'stand') : 'stand'
        }
      }
      actor.update(dt, time)
    }
    if (!this.outcome) {
      if (detectionRate > 0) this.detection = Math.min(1, this.detection + Math.min(0.3, detectionRate) * dt)
      else this.detection = Math.max(0, this.detection - dt * (exposed ? 0.04 : 0.12))
      if (this.detection >= 1 && !this.compromised) {
        this.compromised = true
        this.stats.detected = true
        for (const agent of this.agents) if (agent.spec.kind !== 'civilian') this.alertAgent(agent, 2, 0.2 + this.random())
      }
      if (this.host.playerDead()) this.finish(false, 'You were killed in action.', 2.4)
    }
    if (this.alert === 'suspicious') this.suspiciousTimer += dt
    this.updateAlertLevel()
  }

  private behave(agent: Agent, dt: number): void {
    const actor = agent.actor
    switch (agent.mode) {
      case 'sniper':
        agent.brain?.update(dt)
        actor.speed = 0
        return
      case 'idle':
        actor.speed = 0
        if (agent.spec.behavior.type === 'idle' && agent.spec.behavior.lookAround) this.lookAround(agent, dt, !agent.elevated)
        if (agent.awareness === 2) this.watchRidge(agent, dt)
        return
      case 'patrol':
        if (agent.awareness >= 1) {
          actor.speed = 0
          this.lookAround(agent, dt, false)
          return
        }
        this.followPath(agent, dt, true)
        return
      case 'wander': {
        if (agent.waitTimer > 0) {
          agent.waitTimer -= dt
          actor.speed = 0
          this.lookAround(agent, dt, true)
          return
        }
        if (!agent.hasTarget) {
          const radius = agent.spec.behavior.type === 'wander' ? agent.spec.behavior.radius : 8
          const a = this.random() * Math.PI * 2
          const r = Math.sqrt(this.random()) * radius
          const tx = agent.homeX + Math.cos(a) * r
          const tz = agent.homeZ + Math.sin(a) * r
          if (!this.host.world.collision.blocked(actor.x, actor.y + 0.6, actor.z, tx, terrainHeight(tx, tz) + 0.6, tz)) {
            agent.targetX = tx
            agent.targetZ = tz
            agent.hasTarget = true
          } else {
            agent.waitTimer = 0.5
          }
          return
        }
        if (this.walk(agent, agent.targetX, agent.targetZ, agent.speed, dt)) {
          agent.hasTarget = false
          agent.waitTimer = 2 + this.random() * 5
        }
        return
      }
      case 'escape': {
        if (!agent.escapeStarted) {
          actor.speed = 0
          if (this.stats.elapsed >= agent.escapeDelay) agent.escapeStarted = true
          this.lookAround(agent, dt, false)
          return
        }
        if (agent.critical && !this.hvtMovingNotified) {
          this.hvtMovingNotified = true
          this.host.emit({ type: 'notice', text: `${this.mission.hvtName ?? 'The target'} is moving to the vehicle`, tone: 'warn' })
        }
        if (this.followPath(agent, dt, false)) this.escape(agent)
        return
      }
      case 'run':
        if (this.followPath(agent, dt, false)) this.escape(agent)
        return
      case 'flee':
        if (!agent.hasTarget || this.walk(agent, agent.targetX, agent.targetZ, 3.6, dt)) {
          agent.mode = 'cower'
          agent.coverTimer = 12 + this.random() * 10
          actor.stance = 'crouch'
          actor.upper = 'cower'
          actor.speed = 0
        }
        return
      case 'cower':
        actor.speed = 0
        agent.coverTimer -= dt
        if (agent.coverTimer <= 0) {
          actor.stance = 'stand'
          actor.upper = 'relaxed'
          agent.mode = 'wander'
          agent.homeX = actor.x
          agent.homeZ = actor.z
          agent.speed = 1.3
          agent.awareness = 1
        }
        return
      case 'cover':
        if (agent.hasTarget) {
          actor.upper = 'ready'
          if (this.walk(agent, agent.targetX, agent.targetZ, 3.4, dt)) {
            agent.hasTarget = false
            actor.stance = 'crouch'
          }
          return
        }
        actor.speed = 0
        this.watchRidge(agent, dt)
        return
      case 'gone':
        return
    }
  }

  /** Alerted posture: periodically peek toward the ridge, crouching between looks. */
  private watchRidge(agent: Agent, dt: number): void {
    const actor = agent.actor
    agent.coverTimer -= dt
    if (agent.coverTimer <= 0) {
      agent.coverTimer = 2.5 + this.random() * 3.5
      const peek = actor.stance === 'crouch' || actor.stance === 'kneel'
      if (agent.spec.kind !== 'heavy') actor.stance = peek ? 'stand' : 'crouch'
      const toNest = Math.atan2(-actor.x, -(29 - actor.z))
      actor.heading = toNest + (this.random() - 0.5) * 0.5
      actor.look((this.random() - 0.5) * 0.6, 0.12)
    }
  }

  private returnFire(agent: Agent, dt: number, exposed: boolean): void {
    const actor = agent.actor
    agent.fireTimer -= dt
    if (agent.fireTimer > 0) return
    const heavy = agent.spec.kind === 'heavy'
    if (heavy && agent.burst > 0) {
      agent.burst -= 1
      agent.fireTimer = 0.11
    } else {
      agent.burst = heavy ? 4 : 0
      agent.fireTimer = heavy ? 3.5 + this.random() * 2.5 : 2.4 + this.random() * 2.8
    }
    actor.upper = 'aim'
    actor.stance = 'stand'
    actor.heading = Math.atan2(-actor.x, -(29 - actor.z))
    const distance = Math.hypot(actor.x, actor.z - 29)
    const chance = THREE.MathUtils.clamp(0.32 - distance / 1800, 0.05, 0.26) * (heavy ? 0.6 : 1)
    const hit = exposed && this.random() < chance
    const from = actor.muzzlePosition(_a).clone()
    this.host.enemyFire(from, hit, heavy ? 'heavy' : 'rifle')
    if (hit) window.setTimeout(() => this.host.damagePlayer(heavy ? 18 : 24, from), (distance / 750) * 1000)
  }

  private escape(agent: Agent): void {
    agent.mode = 'gone'
    agent.actor.hidden = true
    agent.actor.speed = 0
    if (agent.escort) this.escortEscaped = true
    if (agent.critical && agent.spec.kind === 'hvt') this.finish(false, `${this.mission.hvtName ?? 'The target'} reached the vehicle and escaped.`, 1.8)
  }

  // -------------------------------------------------------------------------
  // HUD

  private bonusState(index: number): { state: BonusState; progress?: string } {
    const bonus = this.mission.bonuses[index]
    const s = this.stats
    if (this.outcome) return { state: this.outcome.success && bonusMet(bonus, s) ? 'met' : 'failed' }
    switch (bonus.id) {
      case 'headshots':
        return { state: s.headshots >= (bonus.value ?? 1) ? 'met' : 'pending', progress: `${Math.min(s.headshots, bonus.value ?? 1)}/${bonus.value ?? 1}` }
      case 'nomiss':
        return { state: s.hits < s.shots ? 'failed' : 'pending' }
      case 'undetected':
        return { state: s.detected ? 'failed' : 'pending' }
      case 'time':
        return { state: s.elapsed > (bonus.value ?? 180) ? 'failed' : 'pending' }
      case 'moving':
        return { state: s.movingKills >= (bonus.value ?? 1) ? 'met' : 'pending', progress: `${Math.min(s.movingKills, bonus.value ?? 1)}/${bonus.value ?? 1}` }
      case 'hvtHeadshot':
        return { state: s.hvtHeadshot ? 'met' : this.hvtNoHeadshot ? 'failed' : 'pending' }
      case 'escorts':
        return { state: s.escortsKilled >= (bonus.value ?? 2) ? 'met' : this.escortEscaped ? 'failed' : 'pending', progress: `${s.escortsKilled}/${bonus.value ?? 2}` }
      case 'longshot':
        return { state: s.longestHeadshot >= (bonus.value ?? 700) ? 'met' : 'pending' }
      case 'sniperFirst': {
        const sniperAlive = this.agents.some((agent) => agent.spec.kind === 'sniper' && agent.actor.alive)
        const hvtAlive = this.agents.some((agent) => agent.spec.kind === 'hvt' && agent.actor.alive)
        return { state: s.sniperFirst ? 'met' : sniperAlive && !hvtAlive ? 'failed' : 'pending' }
      }
    }
  }

  missionHud(): MissionHud {
    const required = this.agents.filter((agent) => agent.required)
    return {
      code: this.mission.code,
      name: this.mission.name,
      objective: this.mission.objective,
      remaining: required.filter((agent) => agent.actor.alive && agent.mode !== 'gone').length,
      total: required.length,
      elapsed: this.stats.elapsed,
      alert: this.alert,
      detection: this.detection,
      bonuses: this.mission.bonuses.map((bonus, index) => ({ label: bonus.label, ...this.bonusState(index) })),
      score: Math.max(0, this.stats.killPoints),
      ending: this.outcome ? (this.outcome.success ? 'success' : 'fail') : null,
      endReason: this.outcome?.reason ?? null,
    }
  }

  duelHud(): DuelHud | null {
    return null
  }

  dispose(): void {
    for (const actor of this.actors) actor.dispose()
  }
}
