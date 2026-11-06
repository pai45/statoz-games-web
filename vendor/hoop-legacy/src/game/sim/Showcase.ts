import * as THREE from 'three'
import type { Engine, EngineMode } from '../engine/Engine'
import { BallBody, type BallEvents } from '../world/Ball'
import type { BallLike } from '../world/Hoop'
import { Athlete } from './Athlete'
import { COURT, distToRim, isThree } from './court'
import { aimPoint, baseChance, solveLaunch } from './shooting'
import type { JerseyStyle, PlayerProfile, TeamInfo } from '../types'

export type ShowcaseView = 'menu' | 'creator'

/** Menu background (solo shootaround with an orbiting camera) and the player creator turntable. */
export class Showcase implements EngineMode {
  engine: Engine
  view: ShowcaseView
  athlete: Athlete | null = null
  ball = new BallBody()
  yaw = 0
  zoom = 0
  /** creator camera framing */
  focus: 'body' | 'face' = 'body'
  private state: 'toSpot' | 'shoot' | 'watch' = 'toSpot'
  private stateT = 0
  private t = 0
  private target = new THREE.Vector3()
  private ev: BallEvents = { rim: 0, board: 0, floor: 0, scored: false }
  private shotReleased = false
  private holding = true
  private tmp = new THREE.Vector3()
  private camTmp = new THREE.Vector3()
  private creatorSpot = new THREE.Vector3(0, 0, 9.2)
  private lastProfileKey = ''
  private snapped = false
  private courtId = ''

  constructor(engine: Engine, view: ShowcaseView, profile: PlayerProfile, jersey: JerseyStyle, court: TeamInfo, team: TeamInfo | null = null) {
    this.engine = engine
    this.view = view
    engine.scene.add(this.ball.mesh)
    this.setCourt(court)
    engine.arena.updateScoreboard(null, null, 0, 0, '', 'HOOP LEGACY')
    engine.hoop.shotClock.draw('')
    this.setProfile(profile, jersey, team)
    engine.audio.setCrowdBase(0.02)
    engine.rig.targetFov = 40
  }

  setCourt(court: TeamInfo) {
    if (court.id === this.courtId) return
    this.courtId = court.id
    this.engine.arena.setCourtTeam(court)
    this.engine.hoop.setPadColor(court.primary)
    this.engine.farHoop.setPadColor(court.primary)
  }

  setProfile(profile: PlayerProfile, jersey: JerseyStyle, team: TeamInfo | null = null) {
    const key = JSON.stringify([profile.id, profile.lastName, profile.heightCm, profile.appearance, profile.number, profile.archetype, jersey, team?.id ?? null])
    if (key === this.lastProfileKey && this.athlete) return
    this.lastProfileKey = key
    const prev = this.athlete
    const a = new Athlete(profile, 0, 0, jersey, team)
    if (prev) {
      a.pos.copy(prev.pos)
      a.facing = prev.facing
      prev.dispose()
    } else {
      a.pos.set(2, 0, 5)
    }
    a.onBounce = () => {
      if (this.view === 'creator') this.engine.audio.bounce(0.35)
    }
    this.athlete = a
    this.engine.scene.add(a.char.group)
    this.holding = true
    a.hasBall = true
    a.dribbling = true
    if (this.view === 'creator') this.enterCreator(!prev)
    else this.state = 'toSpot'
  }

  setFocus(f: 'body' | 'face') {
    this.focus = f
  }

  setView(view: ShowcaseView) {
    if (this.view === view) return
    this.view = view
    if (view === 'creator') this.enterCreator(true)
    else {
      this.state = 'toSpot'
      this.pickSpot()
    }
  }

  private enterCreator(resetYaw: boolean) {
    const a = this.athlete
    if (!a) return
    a.pos.copy(this.creatorSpot)
    a.vel.set(0, 0, 0)
    a.endAction()
    a.moveTarget = null
    a.moveDir.set(0, 0)
    a.hasBall = true
    a.dribbling = true
    this.holding = true
    this.ball.free = false
    if (resetYaw) {
      this.yaw = 0
      this.snapped = false
    }
  }

  balls(): BallLike[] {
    return [this.ball]
  }

  private pickSpot() {
    const ang = (Math.random() - 0.5) * Math.PI * 0.9
    const r = 3.5 + Math.random() * 4.6
    this.target.set(Math.sin(ang) * r, 0, Math.max(0.6, Math.cos(ang) * r))
  }

  update(dt: number) {
    this.t += dt
    const a = this.athlete
    if (!a) return
    if (this.view === 'creator') this.updateCreator(dt, a)
    else this.updateMenu(dt, a)
    a.update(dt)
    if (this.holding) {
      a.ballPosition(this.ball.pos)
      this.ball.spinRate = a.dribbling ? 8 : 0
      this.ball.sync(dt)
    } else {
      this.ev.rim = 0
      this.ev.board = 0
      this.ev.floor = 0
      this.ev.scored = false
      this.ball.step(dt, this.engine.hoop, this.ev)
      this.ball.sync(dt)
      if (this.ev.rim > 0.3) {
        this.engine.audio.rim(this.ev.rim * 0.5)
        this.engine.hoop.hitRim(this.ev.rim)
      }
      if (this.ev.scored) this.engine.audio.swish()
      if (this.ev.floor > 0) this.engine.audio.bounce(Math.min(0.5, this.ev.floor / 8))
    }
  }

  private updateCreator(dt: number, a: Athlete) {
    a.facing = this.yaw
    a.moveTarget = null
    a.moveDir.set(0, 0)
    a.faceTarget = null
    const narrow = this.engine.aspect < 1
    this.engine.rig.posLag = 4
    if (this.focus === 'face') {
      // head-and-shoulders portrait
      const side = narrow ? 0 : -0.2
      const headY = a.char.boneWorld(4, this.camTmp).y + 0.12
      // portrait: only the top ~38% of the screen shows the court, so the head sits high in frame
      const look = new THREE.Vector3(this.creatorSpot.x + side, headY - (narrow ? 0.4 : 0.02), this.creatorSpot.z)
      const pos = new THREE.Vector3(this.creatorSpot.x + side, headY + (narrow ? -0.04 : 0.03), this.creatorSpot.z + (narrow ? 1.9 : 1.3))
      this.engine.rig.set(pos, look, !this.snapped)
      this.engine.rig.targetFov = narrow ? 40 : 30
    } else {
      const dist = (narrow ? 6.4 : 3.9) - this.zoom
      const side = narrow ? 0 : -0.75
      // portrait: the form covers the lower part of the screen, so frame the player high
      const look = new THREE.Vector3(this.creatorSpot.x + side, a.H * (narrow ? 0.08 : 0.55), this.creatorSpot.z)
      const pos = new THREE.Vector3(this.creatorSpot.x + side, a.H * (narrow ? 0.75 : 0.62), this.creatorSpot.z + dist)
      this.engine.rig.set(pos, look, !this.snapped)
      this.engine.rig.targetFov = narrow ? 46 : 36
    }
    this.snapped = true
    this.engine.shadowFocus.copy(this.creatorSpot)
    void dt
  }

  private updateMenu(dt: number, a: Athlete) {
    this.stateT += dt
    switch (this.state) {
      case 'toSpot': {
        if (this.stateT < 0.05) this.pickSpot()
        a.moveTarget = this.target
        a.arrive = 0.9
        a.sprint = false
        a.pace = 0.62
        a.faceTarget = null
        if (Math.hypot(a.pos.x - this.target.x, a.pos.z - this.target.z) < 0.4 || this.stateT > 5) {
          a.moveTarget = null
          a.vel.multiplyScalar(0.3)
          a.startAction('shoot', 4)
          a.dribbling = false
          a.faceTarget = new THREE.Vector3(0, 0, 0)
          this.state = 'shoot'
          this.stateT = 0
          this.shotReleased = false
        }
        break
      }
      case 'shoot': {
        if (this.stateT > 0.18 && !a.airborne && !this.shotReleased && this.stateT < 0.3) a.jump(0.42)
        if (!this.shotReleased && this.stateT > 0.5) {
          this.shotReleased = true
          a.releaseT = a.actionT
          a.actionDur = a.actionT + 0.6
          const from = a.ballPosition(new THREE.Vector3())
          const dist = distToRim(a.pos.x, a.pos.z)
          const p = baseChance(a, isThree(a.pos.x, a.pos.z) ? 'three' : 'jumper', dist) + 0.18
          const target = aimPoint(Math.random() < p, from, 'good')
          this.ball.pos.copy(from)
          this.ball.launch(solveLaunch(from, target, 51), 10)
          this.holding = false
          a.hasBall = false
          this.state = 'watch'
          this.stateT = 0
        }
        break
      }
      case 'watch': {
        if (this.stateT > 0.9) {
          const b = this.ball.pos
          a.moveTarget = this.tmp.set(b.x, 0, b.z)
          a.arrive = 0.2
          a.sprint = this.stateT > 1.6
          a.faceTarget = null
          const hd = Math.hypot(b.x - a.pos.x, b.z - a.pos.z)
          if ((hd < 0.6 && b.y < a.reach) || this.stateT > 7) {
            this.holding = true
            a.hasBall = true
            a.dribbling = true
            a.moveTarget = null
            this.state = 'toSpot'
            this.stateT = 0
          }
        }
        // keep the ball on the floor area
        if (Math.abs(this.ball.pos.x) > COURT.halfWidth + 1 || this.ball.pos.z > 13) {
          this.ball.pos.set(Math.sign(this.ball.pos.x) * Math.min(Math.abs(this.ball.pos.x), COURT.halfWidth), this.ball.pos.y, Math.min(this.ball.pos.z, 12))
          this.ball.vel.multiplyScalar(0.2)
        }
        break
      }
    }
    // slow orbit camera framing the shootaround
    const ang = Math.sin(this.t * 0.07) * 0.9 + 0.35
    const r = this.engine.aspect < 1 ? 17 : 12.5
    const pos = new THREE.Vector3(Math.sin(ang) * r, 3.6 + Math.sin(this.t * 0.11) * 0.8, 3.5 + Math.cos(ang) * r)
    const look = new THREE.Vector3(a.pos.x * 0.35 + Math.cos(ang) * -1.6, 2.1, a.pos.z * 0.3 + 1.2 + Math.sin(ang) * 1.6)
    if (this.engine.aspect > 1.2) {
      // shift the framing so the action sits right of the menu column
      const fwd = this.camTmp.copy(look).sub(pos).setY(0).normalize()
      const right = new THREE.Vector3(-fwd.z, 0, fwd.x)
      look.addScaledVector(right, -Math.min(4.2, (this.engine.aspect - 1.2) * 4.5))
    }
    this.engine.rig.posLag = 1.2
    this.engine.rig.lookLag = 1.6
    this.engine.rig.set(pos, look)
    this.engine.rig.targetFov = this.engine.aspect < 1 ? 50 : 38
    this.engine.shadowFocus.set(a.pos.x * 0.6, 0, a.pos.z * 0.6 + 1)
  }

  dispose() {
    this.athlete?.dispose()
    this.ball.mesh.removeFromParent()
    this.engine.rig.posLag = 3.2
    this.engine.rig.lookLag = 5
  }
}
