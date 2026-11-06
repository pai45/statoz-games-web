import * as THREE from 'three'
import type { Athlete } from './Athlete'
import type { Match } from './Match'
import { BOUNDS, COURT, SPOTS, distToRim, isBeyondArc, isThree } from './court'
import { baseChance, type DiffParams } from './shooting'

const SPACING = [SPOTS.leftWing, SPOTS.rightWing, SPOTS.leftCorner, SPOTS.rightCorner, SPOTS.top, SPOTS.leftSlot, SPOTS.rightSlot]
const tmp = new THREE.Vector3()

export function segDist(px: number, pz: number, ax: number, az: number, bx: number, bz: number) {
  const vx = bx - ax
  const vz = bz - az
  const l2 = vx * vx + vz * vz || 1
  const t = Math.max(0, Math.min(1, ((px - ax) * vx + (pz - az) * vz) / l2))
  return Math.hypot(px - (ax + vx * t), pz - (az + vz * t))
}

function clampToCourt(v: THREE.Vector3) {
  v.x = Math.max(BOUNDS.minX + 0.2, Math.min(BOUNDS.maxX - 0.2, v.x))
  v.z = Math.max(BOUNDS.minZ + 0.2, Math.min(BOUNDS.maxZ - 0.4, v.z))
  return v
}

export function nearestDefenderDist(m: Match, a: Athlete) {
  let best = 99
  for (const d of m.teams[1 - a.team]) {
    const dd = Math.hypot(d.pos.x - a.pos.x, d.pos.z - a.pos.z)
    if (dd < best) best = dd
  }
  return best
}

/** Who a player is matched up with (defender <-> man), honouring switches made on screens. */
export function assignment(m: Match, a: Athlete): Athlete {
  const opp = m.teams[1 - a.team]
  return m.switches.get(a) ?? opp[a.slot] ?? opp[0]
}

/** Does this defender leave his feet on a pump fake? Smarter AI and disciplined defenders bite less. */
export function aiBitesOnFake(m: Match, d: Athlete, shooter: Athlete) {
  const dist = Math.hypot(d.pos.x - shooter.pos.x, d.pos.z - shooter.pos.z)
  if (dist > 2.6) return false
  // only a defender who sees the shot coming (in front, facing the shooter) reacts to it
  const f = d.forward(tmp)
  if (((shooter.pos.x - d.pos.x) * f.x + (shooter.pos.z - d.pos.z) * f.z) / (dist || 1) < 0.3) return false
  const diff = d.team === m.humanTeam ? m.mateDiff : m.diff
  // a real shooter draws a real closeout
  const threat = Math.max(shooter.attrs.three, shooter.attrs.mid) / 99
  let p = 0.25 + (1 - diff.shotIQ) * 0.6 + threat * 0.2 - (d.attrs.perimD / 99) * 0.25 + (dist < 1.4 ? 0.1 : 0)
  if (shooter.human) p *= m.diff.humanAssist
  return Math.random() < Math.max(0.05, Math.min(0.75, p))
}

/** When each active screen connected, so a screen holds up its defender (and can force a switch) once. */
const screenHits = new WeakMap<Athlete, number>()

/**
 * Screens in play: a screener planted on the ball handler's defender holds him up for a beat, and the
 * screener's own defender may switch onto the ball (better AI switches more reliably).
 */
export function updateScreens(m: Match, dt: number) {
  const h = m.holder
  if (!h || m.teamSize < 2) return
  for (const s of m.teams[h.team]) {
    if (s === h || s.action !== 'screen') continue
    if (screenHits.has(s)) continue
    const hd = assignment(m, h)
    if (hd.team === h.team || Math.hypot(hd.pos.x - s.pos.x, hd.pos.z - s.pos.z) > 0.8 || Math.hypot(h.pos.x - s.pos.x, h.pos.z - s.pos.z) > 3) continue
    screenHits.set(s, m.elapsed)
    // caught on the screen
    hd.vel.multiplyScalar(0.3)
    hd.lockMove = Math.max(hd.lockMove, 0.35)
    const sd = assignment(m, s)
    const diff = hd.team === m.humanTeam ? m.mateDiff : m.diff
    if (sd !== hd && !sd.human && !hd.human && Math.random() < 0.35 + diff.shotIQ * 0.4) {
      m.switches.set(hd, s)
      m.switches.set(s, hd)
      m.switches.set(sd, h)
      m.switches.set(h, sd)
    }
  }
  // a screen that ended can connect again next time
  for (const s of m.teams[h.team]) if (s.action !== 'screen') screenHits.delete(s)
  void dt
}

function shotEV(m: Match, a: Athlete) {
  const dist = distToRim(a.pos.x, a.pos.z)
  const three = isThree(a.pos.x, a.pos.z)
  const type = dist < 2.2 ? 'layup' : three ? 'three' : 'jumper'
  const open = nearestDefenderDist(m, a)
  const contest = Math.max(0, Math.min(1, (2.7 - open) / 2.2))
  return baseChance(a, type, dist) * (1 - contest * 0.55) * (three ? 3 : 2)
}

export function aiUpdate(m: Match, a: Athlete, dt: number) {
  const diff = a.team === m.humanTeam ? m.mateDiff : m.diff
  // eyes on the ball (a handler keeps his head up instead)
  a.lookTarget = m.holder === a ? null : m.ball.pos
  if (m.holder === a) return aiBallHandler(m, a, dt, diff)
  if (m.holder && m.holder.team === a.team) return aiOffBall(m, a, dt)
  if (m.holder && m.holder.team !== a.team) return aiDefend(m, a, dt, diff, false)
  if (m.flight?.kind === 'pass') {
    if (m.flight.receiver === a || m.flight.interceptor === a) {
      a.moveTarget = tmp.copy(m.ball.pos).setY(0).clone()
      a.sprint = true
      a.faceTarget = m.ball.pos
      return
    }
    if (a.team === m.flight.passer?.team) return aiOffBall(m, a, dt)
    return aiDefendNoBall(m, a, diff)
  }
  return aiLoose(m, a, dt)
}

function aiBallHandler(m: Match, a: Athlete, dt: number, diff: DiffParams) {
  a.defense = false
  if (a.busy || a.stumble > 0) return
  const ai = a.ai
  const dist = distToRim(a.pos.x, a.pos.z)
  if (m.mustClear) {
    const l = Math.hypot(a.pos.x, a.pos.z) || 1
    const target = new THREE.Vector3((a.pos.x / l) * 8.3, 0, Math.max(1.5, (a.pos.z / l) * 8.3))
    a.moveTarget = clampToCourt(target)
    a.sprint = true
    a.faceTarget = null
    return
  }
  // straight out of a step-back or hesitation: rise into the pull-up if there is daylight
  if (a.rhythm > 0.15 && dist > 2.6 && nearestDefenderDist(m, a) > 1.4 && shotEV(m, a) > 0.78) return m.startShot(a, false)
  ai.think -= dt
  if (ai.intent === 'drive') {
    a.sprint = true
    if (dist < 2.5) {
      m.startShot(a, false)
      ai.intent = 'idle'
      return
    }
    // lane closed? re-think quickly
    for (const d of m.teams[1 - a.team]) {
      if (Math.hypot(d.pos.x - a.pos.x, d.pos.z - a.pos.z) < 1.0 && distToRim(d.pos.x, d.pos.z) < dist) ai.think = Math.min(ai.think, 0.08)
    }
  }
  if (ai.think > 0) return
  ai.think = diff.react * (0.75 + Math.random() * 0.7)

  const defs = m.teams[1 - a.team]
  const open = nearestDefenderDist(m, a)
  const evShoot = shotEV(m, a)
  const laneBlocked = defs.some((d) => segDist(d.pos.x, d.pos.z, a.pos.x, a.pos.z, 0, 0) < 0.85 && distToRim(d.pos.x, d.pos.z) < dist && !d.airborne)
  // the defender bit on the fake and is in the air: go right by him
  if (!m.mustClear && defs.some((d) => d.airborne && d.action === 'block' && Math.hypot(d.pos.x - a.pos.x, d.pos.z - a.pos.z) < 2.6) && !laneBlocked && dist > 2.5) {
    ai.intent = 'drive'
    a.moveTarget = new THREE.Vector3((a.pos.x / (dist || 1)) * 1.0, 0, (a.pos.z / (dist || 1)) * 1.0)
    a.sprint = true
    a.faceTarget = null
    return
  }
  // a teammate's screen on my man: come off it, shoulder to shoulder
  const screener = m.teams[a.team].find((t) => t !== a && t.action === 'screen' && Math.hypot(t.pos.x - a.pos.x, t.pos.z - a.pos.z) < 2.8)
  if (screener && !m.mustClear) {
    const md = assignment(m, a)
    const sx = screener.pos.x - md.pos.x
    const sz = screener.pos.z - md.pos.z
    const sl = Math.hypot(sx, sz) || 1
    a.moveTarget = clampToCourt(new THREE.Vector3(screener.pos.x + (sx / sl) * 1.5 - (screener.pos.x / (distToRim(screener.pos.x, screener.pos.z) || 1)) * 0.8, 0, screener.pos.z + (sz / sl) * 1.5 - (screener.pos.z / (distToRim(screener.pos.x, screener.pos.z) || 1)) * 0.8))
    a.sprint = true
    a.faceTarget = null
    ai.intent = 'probe'
    ai.think = 0.45
    return
  }
  const evDrive = laneBlocked ? 0 : baseChance(a, a.attrs.dunk > 70 ? 'dunk' : 'layup', 1.2) * 2 * (0.82 + a.attrs.speed / 450)
  let bestPass: Athlete | null = null
  let evPass = 0
  for (const t of m.teams[a.team]) {
    if (t === a) continue
    let ev = shotEV(m, t) - 0.14
    if ((t.ai.intent === 'cut' || t.ai.intent === 'roll') && distToRim(t.pos.x, t.pos.z) < 3 && nearestDefenderDist(m, t) > 1.2) ev += 0.4
    // a cutter at the rim with bounce: throw it up
    if (m.canLob(a, t)) ev += 0.25
    // lane to receiver
    const blocked = defs.some((d) => segDist(d.pos.x, d.pos.z, a.pos.x, a.pos.z, t.pos.x, t.pos.z) < 0.7)
    if (blocked) ev -= 0.5
    if (ev > evPass) {
      evPass = ev
      bestPass = t
    }
  }
  const sc = m.config.shotClock > 0 ? m.shotClock : 99
  // early in the clock, work for a better look unless wide open
  const patience = m.config.shotClock > 0 ? Math.max(0, Math.min(1, (sc - 4.5) / 6)) : 0.5
  const threshold = 0.95 - (1 - diff.shotIQ) * 0.25 + (open > 2.6 ? 0 : patience * 0.32)
  const chaos = Math.random() < (1 - diff.shotIQ) * 0.25

  if (sc < 3.2) {
    if (dist < 2.5) return m.startShot(a, false)
    if (evDrive > 0.7 && sc > 1.6) {
      ai.intent = 'drive'
      a.moveTarget = new THREE.Vector3((a.pos.x / (dist || 1)) * 1.0, 0, (a.pos.z / (dist || 1)) * 1.0)
      return
    }
    return m.startShot(a, false)
  }
  if (dist < 2.3 && !laneBlocked) return m.startShot(a, false)
  if (chaos && sc < 9) {
    const r = Math.random()
    if (r < 0.35) return m.startShot(a, false)
    if (r < 0.6 && bestPass) return m.doPass(a, bestPass)
  }
  if (evShoot >= threshold && evShoot >= evPass - 0.05 && open > 1.1) return m.startShot(a, false)
  if (bestPass && evPass > Math.max(evShoot, 0.88)) return m.doPass(a, bestPass)
  if (evDrive > 0.9 && dist > 2.5) {
    ai.intent = 'drive'
    const l = dist || 1
    a.moveTarget = new THREE.Vector3((a.pos.x / l) * 1.0, 0, (a.pos.z / l) * 1.0)
    a.sprint = true
    a.faceTarget = null
    return
  }
  // a defender flying at a shooter eats a pump fake
  const closer = defs.find((d) => {
    const dd = Math.hypot(d.pos.x - a.pos.x, d.pos.z - a.pos.z)
    return dd < 2.4 && ((a.pos.x - d.pos.x) * d.vel.x + (a.pos.z - d.pos.z) * d.vel.z) / (dd || 1) > 2.2
  })
  if (closer && evShoot > 0.6 && a.skillCooldown <= 0 && Math.random() < 0.35) {
    m.pumpFake(a)
    ai.think = 0.3
    return
  }
  // pressured: pick a move that suits the player and the spot
  if (open < 1.35 && a.skillCooldown <= 0 && Math.random() < 0.3 + a.attrs.handles / 280) {
    const tx = -a.pos.x / (dist || 1)
    const tz = -a.pos.z / (dist || 1)
    const r = Math.random()
    const shooter = Math.max(a.attrs.three, a.attrs.mid)
    if (dist > 6.2 && dist < 8.6 && shooter >= 74 && r < 0.22) return m.doMove(a, -tx, -tz)
    if (dist < 7.2 && a.attrs.finish >= 68 && r < 0.45) return m.doMove(a, tx, tz)
    if (r < 0.62) return m.doMove(a, 0, 0)
    const f = a.forward(tmp)
    const dir = Math.random() < 0.5 ? 1 : -1
    return m.doMove(a, f.z * dir, -f.x * dir)
  }
  // probe: drift to a nearby spot, attacking space
  ai.intent = 'probe'
  const spot = SPACING[Math.floor(Math.random() * SPACING.length)]
  const target = new THREE.Vector3(
    THREE.MathUtils.lerp(a.pos.x, spot.x, 0.5) + (Math.random() - 0.5) * 2,
    0,
    THREE.MathUtils.lerp(a.pos.z, spot.z, 0.5) + (Math.random() - 0.5) * 2,
  )
  a.moveTarget = clampToCourt(target)
  a.sprint = false
  a.faceTarget = null
}

function pickSpacing(m: Match, a: Athlete) {
  const handler = m.holder
  let best = SPACING[0]
  let bestScore = -1
  for (const s of SPACING) {
    let score = 99
    if (handler) score = Math.min(score, Math.hypot(s.x - handler.pos.x, s.z - handler.pos.z))
    for (const t of m.teams[a.team]) {
      if (t === a || t === handler) continue
      score = Math.min(score, Math.hypot(s.x - t.ai.target.x, s.z - t.ai.target.z) * 0.9)
    }
    score -= Math.hypot(s.x - a.pos.x, s.z - a.pos.z) * 0.08
    if (m.mustClear && !isBeyondArc(s.x, s.z)) score -= 5
    if (score > bestScore) {
      bestScore = score
      best = s
    }
  }
  return best
}

function aiOffBall(m: Match, a: Athlete, dt: number) {
  a.defense = false
  const ai = a.ai
  ai.think -= dt
  ai.cutTimer -= dt
  const handler = m.holder
  // pick and roll: set the screen, hold it, then roll hard to the rim
  if (ai.intent === 'screen' && handler && !m.mustClear) {
    const hd = assignment(m, handler)
    if (a.action === 'screen') {
      if (ai.cutTimer <= 0 || distToRim(handler.pos.x, handler.pos.z) < 4.4 || Math.hypot(handler.pos.x - a.pos.x, handler.pos.z - a.pos.z) > 3.8) {
        a.endAction()
        ai.intent = 'roll'
        ai.cutTimer = 1.9
        ai.target.set((a.pos.x < 0 ? -1 : 1) * 0.9, 0, 1.1)
      }
      return
    }
    const bx = hd.pos.x - handler.pos.x
    const bz = hd.pos.z - handler.pos.z
    const bl = Math.hypot(bx, bz) || 1
    // screen on the side that sends the handler toward the middle of the floor
    const side = handler.pos.x > 0 ? -1 : 1
    ai.target.set(hd.pos.x + (-bz / bl) * 0.72 * side, 0, hd.pos.z + (bx / bl) * 0.72 * side)
    clampToCourt(ai.target)
    a.moveTarget = ai.target
    a.arrive = 0.25
    a.sprint = true
    a.faceTarget = hd.pos
    if (ai.cutTimer <= 0) {
      ai.intent = 'space'
      ai.think = 0
    } else if (Math.hypot(a.pos.x - ai.target.x, a.pos.z - ai.target.z) < 0.4) {
      a.moveTarget = null
      a.moveDir.set(0, 0)
      a.vel.multiplyScalar(0.3)
      a.startAction('screen', 1.6)
      ai.cutTimer = 1.3
    }
    return
  }
  if (ai.intent === 'screen') ai.intent = 'space'
  if (ai.intent === 'roll') {
    if (ai.cutTimer > 0) {
      a.moveTarget = ai.target
      a.arrive = 0.4
      a.sprint = true
      a.faceTarget = handler ? handler.pos : null
      return
    }
    ai.intent = 'space'
    ai.think = 0
  }
  if (ai.intent === 'cut' && ai.cutTimer <= 0) ai.think = 0
  if (ai.think <= 0) {
    ai.think = 0.7 + Math.random() * 0.9
    // call for the pick: the handler is out top with a defender on him (bigs set most screens)
    if (handler && handler !== a && m.teamSize > 1 && !m.mustClear && distToRim(handler.pos.x, handler.pos.z) > 6.2 && nearestDefenderDist(m, handler) < 1.9 && !m.teams[a.team].some((t) => t.ai.intent === 'screen' || t.ai.intent === 'roll')) {
      const big = a.profile.position === 'C' || a.profile.position === 'PF'
      if (Math.random() < (big ? 0.4 : 0.16)) {
        ai.intent = 'screen'
        ai.cutTimer = 2.4
        return
      }
    }
    const man = assignment(m, a)
    const sepFromDef = Math.hypot(man.pos.x - a.pos.x, man.pos.z - a.pos.z)
    if (!m.mustClear && ai.intent !== 'cut' && Math.random() < (sepFromDef > 1.8 ? 0.35 : 0.12)) {
      ai.intent = 'cut'
      ai.cutTimer = 1.7
      const side = a.pos.x < 0 ? SPOTS.leftBlock : SPOTS.rightBlock
      ai.target.set(side.x * 0.6, 0, side.z + 0.4)
    } else {
      ai.intent = 'space'
      const s = pickSpacing(m, a)
      ai.target.set(s.x, 0, s.z)
    }
  }
  a.moveTarget = ai.target
  a.arrive = 0.6
  const d = Math.hypot(ai.target.x - a.pos.x, ai.target.z - a.pos.z)
  a.sprint = ai.intent === 'cut' || d > 3.5
  // relocating to a nearby spot is a jog that eases into a walk, not a full-speed run
  if (ai.intent !== 'cut') a.pace = d < 1.6 ? 0.45 : d < 3 ? 0.72 : 1
  a.faceTarget = d < 1 && m.holder ? m.holder.pos : null
}

function aiDefendNoBall(m: Match, a: Athlete, diff: DiffParams) {
  const man = assignment(m, a)
  a.defense = true
  const l = Math.hypot(man.pos.x, man.pos.z) || 1
  const t = new THREE.Vector3(man.pos.x - (man.pos.x / l) * 1.2, 0, man.pos.z - (man.pos.z / l) * 1.2)
  a.moveTarget = t
  a.sprint = Math.hypot(t.x - a.pos.x, t.z - a.pos.z) > 2.4
  a.faceTarget = m.ball.pos
  void diff
}

export function aiDefend(m: Match, a: Athlete, dt: number, diff: DiffParams, auto: boolean) {
  const handler = m.holder
  if (!handler) return
  a.defense = true
  const man = assignment(m, a)
  const ai = a.ai
  ai.reactDelay -= dt
  const onBall = man === handler
  const manDist = distToRim(man.pos.x, man.pos.z)
  const ux = -man.pos.x / (manDist || 1)
  const uz = -man.pos.z / (manDist || 1)
  const shooting = handler.action === 'shoot' || handler.action === 'layup' || handler.action === 'dunk'
  const shotMotion = shooting || handler.action === 'pumpfake'
  if (ai.reactDelay <= 0 || shotMotion) {
    ai.reactDelay = diff.react * 0.55
    if (onBall) {
      let gap = 1.05 - (a.attrs.perimD / 99) * 0.25
      if (isThree(man.pos.x, man.pos.z) && man.attrs.three < 62) gap += 0.7
      if (manDist > 8.6) gap += 0.7
      if (shotMotion) gap = 0.55
      ai.target.set(man.pos.x + ux * gap, 0, man.pos.z + uz * gap)
    } else {
      // help when the ball handler gets downhill
      const hd = distToRim(handler.pos.x, handler.pos.z)
      const hDef = assignment(m, handler)
      const beaten = distToRim(hDef.pos.x, hDef.pos.z) > hd + 0.25
      let helper = false
      if (hd < 3.6 && beaten) {
        let closest: Athlete | null = null
        let cd = 99
        for (const t of m.teams[a.team]) {
          if (t === hDef) continue
          const dd = Math.hypot(t.pos.x - handler.pos.x, t.pos.z - handler.pos.z)
          if (dd < cd) {
            cd = dd
            closest = t
          }
        }
        helper = closest === a
      }
      if (helper) {
        const hl = hd || 1
        ai.target.set(handler.pos.x - (handler.pos.x / hl) * 0.9, 0, handler.pos.z - (handler.pos.z / hl) * 0.9)
      } else {
        const bx = handler.pos.x - man.pos.x
        const bz = handler.pos.z - man.pos.z
        const bl = Math.hypot(bx, bz) || 1
        ai.target.set(man.pos.x + ux * 1.35 + (bx / bl) * 0.9, 0, man.pos.z + uz * 1.35 + (bz / bl) * 0.9)
      }
    }
  }
  clampToCourt(ai.target)
  a.moveTarget = ai.target
  a.arrive = 0.35
  const td = Math.hypot(ai.target.x - a.pos.x, ai.target.z - a.pos.z)
  a.sprint = td > 2.3
  a.faceTarget = handler.pos
  if (auto || a.busy || a.stumble > 0) return
  const hdist = Math.hypot(handler.pos.x - a.pos.x, handler.pos.z - a.pos.z)
  // contest / block
  if (shooting && hdist < 2.7 && !a.airborne && ai.plan === null) {
    ai.plan = { releaseAt: m.elapsed + diff.react * (0.45 + Math.random() * 0.5), gradeRoll: Math.random() }
  }
  if (ai.plan && m.elapsed >= ai.plan.releaseAt) {
    if (shooting && hdist < 2.8 && !a.airborne) m.blockJump(a)
    ai.plan = null
  }
  if (!shooting && ai.plan && m.elapsed > ai.plan.releaseAt + 1) ai.plan = null
  // steal attempts
  if (onBall && !shooting && hdist < 1.3 && a.stealCooldown <= 0) {
    const rate = diff.stealRate * (a.attrs.steal / 75)
    if (Math.random() < rate * dt * 2.2) m.doSteal(a)
  }
}

export function predictBall(m: Match, out: THREE.Vector3) {
  const b = m.ball
  if (m.flight?.kind === 'shot' && !m.flight.resolved && m.flight.shooter) {
    const s = m.flight.shooter
    const l = Math.hypot(s.pos.x, s.pos.z) || 1
    const long = m.flight.points === 3 ? 2.2 : 1.4
    return out.set((s.pos.x / l) * long * 0.8, 0, Math.max(0.2, (s.pos.z / l) * long))
  }
  const h = 1.6
  if (b.pos.y > h && b.vel.y < 6) {
    const vy = b.vel.y
    const disc = vy * vy + 2 * COURT.gravity * (b.pos.y - h)
    const t = (vy + Math.sqrt(Math.max(0, disc))) / COURT.gravity
    return out.set(b.pos.x + b.vel.x * t, 0, b.pos.z + b.vel.z * t)
  }
  return out.set(b.pos.x + b.vel.x * 0.25, 0, b.pos.z + b.vel.z * 0.25)
}

function aiLoose(m: Match, a: Athlete, dt: number) {
  a.defense = false
  const p = predictBall(m, new THREE.Vector3())
  // two closest per team chase; others crash or hold
  const mates = m.teams[a.team]
  const sorted = [...mates].sort((x, y) => Math.hypot(x.pos.x - p.x, x.pos.z - p.z) - Math.hypot(y.pos.x - p.x, y.pos.z - p.z))
  const chasers = m.teams[a.team].length > 1 ? 2 : 1
  const idx = sorted.indexOf(a)
  if (idx < chasers) {
    a.moveTarget = clampToCourt(p.clone())
    a.arrive = 0.2
    a.sprint = true
  } else {
    const man = assignment(m, a)
    const l = Math.hypot(man.pos.x, man.pos.z) || 1
    a.moveTarget = clampToCourt(new THREE.Vector3((man.pos.x / l) * 2.2, 0, Math.max(0.6, (man.pos.z / l) * 2.2)))
    a.sprint = false
  }
  a.faceTarget = m.ball.pos
  void dt
  // jump for a high ball within reach
  const b = m.ball
  const hd = Math.hypot(b.pos.x - a.pos.x, b.pos.z - a.pos.z)
  if (!a.airborne && !a.busy && hd < 1.0 && b.pos.y > a.H * 1.25 && b.pos.y < a.H * 1.3 + a.maxJump() + 0.3 && b.vel.y < 1.5 && Math.random() < 0.25) {
    m.reboundJump(a)
  }
}
