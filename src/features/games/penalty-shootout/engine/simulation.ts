import * as THREE from "three";
import { CharacterAnimator, type CharacterPose } from "../animation/character";
import RAPIER from "@dimforge/rapier3d-compat";
import { accuracy, anticipate, clamp, crossesGoal, launch, matchStatus, mix, seeded, smooth } from "./rules";
import { GOAL, STEP, TAKER, type Frame, type GameEvent, type InputFrame, type KeeperCommand, type KeeperPose, type KickResult, type Mode, type Phase, type Role, type ShotCommand, type Snapshot, type Style, type Vec3 } from "../game-types";

let initialized: Promise<void> | undefined;
export const initializePhysics = () => initialized ??= RAPIER.init();
const copy = <T>(value: T): T => structuredClone(value);

/** One simulation owns rules, physics and replay. Rendering is a read-only consumer. */
export class ShootoutSimulation {
  readonly world: RAPIER.World;
  readonly ball: RAPIER.RigidBody;
  private queue = new RAPIER.EventQueue(true);
  private hands: RAPIER.RigidBody[] = [];
  private body: RAPIER.RigidBody;
  private limbBodies: RAPIER.RigidBody[] = [];
  private parts = new Map<number, string>();
  private segmentLengths = new Map<number, number>();
  private contactFacts: NonNullable<KickResult["contactFacts"]> = [];
  private shooterAnimator = new CharacterAnimator();
  private keeperAnimator = new CharacterAnimator();
  private shooterPose!: CharacterPose;
  private keeperActorPose!: CharacterPose;
  private cosmeticSeed: number;
  private cosmeticKick = 0;
  private keeperVelocity = 0;
  private catchTick = -1;
  private caughtOffset = { x: 0, y: 0, z: 0 };
  private caughtSide: "hand_L" | "hand_R" = "hand_L";
  private parryTick = -1;
  private colliders = new Map<number, "keeper" | "frame" | "ground">();
  private random: () => number;
  private contacts = new Set<"keeper" | "frame" | "ground">();
  readonly mode: Mode;
  readonly level: number;
  phase: Phase = "preparation";
  role: Role = "shooting";
  tick = 0;
  private phaseTick = 0;
  private shotTick = 0;
  private chargeTick = 0;
  private wasShoot = false;
  private power = 0;
  private composure = 1;
  private target = { x: 0, y: 1.15 };
  private actualTarget = { x: 0, y: 1.15 };
  private style: Style = "driven";
  private keeperX = 0;
  private dive: KeeperCommand | null = null;
  private ai: ReturnType<typeof anticipate>;
  private cpuShot: ShotCommand;
  private previousBall: Vec3 = { x: 0, y: GOAL.ballRadius, z: GOAL.spot };
  private caught = false;
  private stationary = 0;
  private eventId = 0;
  private events: GameEvent[] = [];
  kicks: KickResult[] = [];
  result: KickResult | null = null;
  frames: Frame[] = [];
  private replayIndex = 0;
  private tailTicks = 0;
  constructor(mode: Mode, level: number, seed: number, private rules: import("../game-types").MatchRules = {}) {
    this.cosmeticSeed = seed >>> 0;
    this.mode = mode; this.level = clamp(level, 1, 12); this.random = seeded(seed);
    this.world = new RAPIER.World({ x: 0, y: -9.81, z: 0 }); this.world.timestep = STEP;
    const ground = this.world.createCollider(RAPIER.ColliderDesc.cuboid(70, 0.2, 70).setTranslation(0, -0.2, 10).setFriction(0.6).setRestitution(0.38));
    this.colliders.set(ground.handle, "ground");
    for (const x of [-GOAL.halfWidth - 0.06, GOAL.halfWidth + 0.06]) {
      const post = this.world.createCollider(RAPIER.ColliderDesc.capsule(GOAL.height / 2, 0.06).setTranslation(x, GOAL.height / 2, 0).setRestitution(0.75));
      this.colliders.set(post.handle, "frame");
    }
    const bar = this.world.createCollider(RAPIER.ColliderDesc.cuboid(GOAL.halfWidth + 0.12, 0.06, 0.06).setTranslation(0, GOAL.height + 0.06, 0).setRestitution(0.75));
    this.colliders.set(bar.handle, "frame");
    // A soft goal enclosure settles scored balls during the visual follow-through.
    this.world.createCollider(RAPIER.ColliderDesc.cuboid(GOAL.halfWidth, GOAL.height / 2, 0.025).setTranslation(0, GOAL.height / 2, -GOAL.depth).setRestitution(0).setRestitutionCombineRule(RAPIER.CoefficientCombineRule.Min));
    for (const side of [-1, 1]) this.world.createCollider(RAPIER.ColliderDesc.cuboid(0.025, GOAL.height / 2, GOAL.depth / 2).setTranslation(side * (GOAL.halfWidth + 0.1), GOAL.height / 2, -GOAL.depth / 2).setRestitution(0).setRestitutionCombineRule(RAPIER.CoefficientCombineRule.Min));
    this.ball = this.world.createRigidBody(RAPIER.RigidBodyDesc.dynamic().setTranslation(0, GOAL.ballRadius, GOAL.spot).setCcdEnabled(true).setLinearDamping(0.025).setAngularDamping(0.15));
    this.world.createCollider(RAPIER.ColliderDesc.ball(GOAL.ballRadius).setMass(0.43).setRestitution(0.5).setFriction(0.5).setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS), this.ball);
    for (let i = 0; i < 2; i++) { const body = this.world.createRigidBody(RAPIER.RigidBodyDesc.kinematicPositionBased()); this.world.createCollider(RAPIER.ColliderDesc.ball(0.15).setRestitution(0.38).setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS), body); this.hands.push(body); this.colliders.set(body.collider(0).handle, "keeper"); this.parts.set(body.collider(0).handle, i ? "hand_R" : "hand_L"); }
    this.body = this.world.createRigidBody(RAPIER.RigidBodyDesc.kinematicPositionBased());
    this.world.createCollider(RAPIER.ColliderDesc.capsule(0.36, 0.25).setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS), this.body); this.colliders.set(this.body.collider(0).handle, "keeper");
    this.parts.set(this.body.collider(0).handle, "torso");
    for (const part of ["upper_arm_L", "forearm_L", "upper_arm_R", "forearm_R", "thigh_L", "shin_L", "thigh_R", "shin_R", "head"]) {
      const rigid = this.world.createRigidBody(RAPIER.RigidBodyDesc.kinematicPositionBased());
      const radius = part === "head" ? .10 : part.startsWith("thigh") ? .085 : .055;
      this.world.createCollider(RAPIER.ColliderDesc.capsule(part === "head" ? .025 : .12, radius).setRestitution(.25).setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS), rigid);
      this.limbBodies.push(rigid); this.parts.set(rigid.collider(0).handle, part); this.colliders.set(rigid.collider(0).handle, "keeper");
    }
    this.ai = anticipate([], level, this.random); this.cpuShot = this.createCpuShot(); this.resetKick();
  }
  private createCpuShot(): ShotCommand {
    const difficulty = (this.level - 1) / 11;
    return { target: { x: (this.random() < 0.5 ? -1 : 1) * mix(1, 3.25, this.random()), y: mix(0.22, 2.15, this.random()) }, power: mix(0.4, 0.85, this.random()), composure: mix(0.5, 0.94, difficulty), style: this.random() < 0.1 ? "chip" : this.random() < 0.4 ? "placed" : "driven" };
  }
  private emit(type: GameEvent["type"], result?: KickResult) { this.events.push({ id: ++this.eventId, type, result }); }
  consumeEvents() { const events = this.events; this.events = []; return events; }
  private setPhase(phase: Phase) { this.phase = phase; this.phaseTick = this.tick; }
  private age() { return (this.tick - this.phaseTick) * STEP; }
  private resetKick() {
    this.cosmeticKick = this.kicks.length;
    this.role = this.mode === "keeping" ? "keeping" : this.mode === "shooting" ? "shooting" : this.kicks.length % 2 ? "keeping" : "shooting";
    this.setPhase("preparation"); this.wasShoot = false; this.power = 0; this.composure = 1; this.target = { x: 0, y: 1.15 }; this.style = "driven";
    this.keeperX = 0; this.dive = null; this.contacts.clear(); this.caught = false; this.stationary = 0; this.result = null; this.frames = []; this.replayIndex = 0; this.tailTicks = 0;
    this.ai = anticipate(this.kicks, this.level, this.random); this.cpuShot = this.createCpuShot();
    this.ball.setBodyType(RAPIER.RigidBodyType.Dynamic, true); this.ball.setTranslation({ x: 0, y: GOAL.ballRadius + 0.002, z: GOAL.spot }, true);
    this.ball.setRotation({x:0,y:0,z:0,w:1},true); this.ball.setLinvel({ x: 0, y: 0, z: 0 }, true); this.ball.setAngvel({ x: 0, y: 0, z: 0 }, true); this.previousBall = copy(this.ball.translation());
    this.contactFacts = []; this.catchTick = -1; this.parryTick = -1; this.keeperVelocity = 0; this.shooterAnimator = new CharacterAnimator(); this.keeperAnimator = new CharacterAnimator();
    this.placeKeeper(true); this.emit("whistle");
  }
  next() { if (this.phase !== "resolution" && this.phase !== "replay") return; if (this.mode === "shootout" && matchStatus(this.kicks, this.rules).complete) { this.setPhase("summary"); return; } this.resetKick(); }
  cancelInput() { this.wasShoot = false; if (this.phase === "charging") { this.power = 0; this.setPhase("preparation"); } }
  replay() { if (this.phase === "resolution" && this.frames.length) { this.setPhase("replay"); this.replayIndex = 0; } }
  get marker() { return (Math.sin((this.tick * STEP) / 1.5 * Math.PI * 2) + 1) / 2; }
  private commitDive(x: number, y: number) {
    if (this.dive || !["preparation", "runup", "flight"].includes(this.phase)) return;
    this.dive = { x: Math.abs(x) < 0.15 ? 0 : Math.sign(x), y: clamp(y, -1, 1), tick: this.tick };
  }
  private keeperMotion(): KeeperPose {
    const d = this.dive, age = d ? (this.tick - d.tick) * STEP : 0, direction = d?.x ?? 0, height = d?.y ?? 0;
    const extend = smooth((age - .07) / .43), land = smooth((age - .65) / .65), recover = smooth((age - 1.45) / 1.25);
    const lean = -direction * 1.48 * extend * (1 - recover);
    const pelvisX = this.keeperX + direction * 1.6 * smooth(age / .65);
    const pelvisY = d && direction ? mix(mix(.94, .65 + Math.max(0, height) * .65, extend), .30, land) * (1 - recover) + .94 * recover : .94;
    const root = { x: pelvisX + Math.sin(lean) * .94, y: pelvisY - Math.cos(lean) * .94, z: .3 - .12 * land * (1 - recover) };
    const handY = d ? mix(1.08, direction ? mix(.30, 2.12, (height + 1) / 2) : .88, extend) : 1.08;
    const reach = direction * 1.13 * extend * (1 - recover);
    const hand = (side: number) => {
      const shoulder = { x: root.x + side * .19 * Math.cos(lean) - 1.48 * Math.sin(lean), y: root.y + side * .19 * Math.sin(lean) + 1.48 * Math.cos(lean), z: root.z };
      const groundSupport = land * (1 - smooth(recover / .65));
      const target = { x: pelvisX + mix(reach, direction * .28, groundSupport) + side * mix(.32, .09, extend * (1 - recover)), y: mix(mix(handY, .14, land), 1.08, recover), z: .42 };
      const dist = Math.hypot(target.x - shoulder.x, target.y - shoulder.y, target.z - shoulder.z), ratio = Math.min(1, .64 / Math.max(.001, dist));
      return { x: mix(shoulder.x, target.x, ratio), y: mix(shoulder.y, target.y, ratio), z: mix(shoulder.z, target.z, ratio) };
    };
    return { root, lean, leftHand: hand(1), rightHand: hand(-1), dive: age, direction, height };
  }
  keeperPose(): KeeperPose {
    const pose = this.keeperMotion();
    if (this.keeperActorPose) { pose.leftHand = this.keeperAnimator.point("hand_L"); pose.rightHand = this.keeperAnimator.point("hand_R"); }
    return pose;
  }
  private updateActors() {
    const moving = this.phase === "runup" || this.phase === "flight" || this.phase === "resolution";
    const runAge = this.phase === "runup" ? this.age() : moving ? 1 + (this.tick - this.shotTick) * STEP : 0;
    const shooterX = TAKER.x + TAKER.approachSide * (1 - smooth(Math.min(1, runAge))), shooterZ = GOAL.spot + TAKER.contactOffset + TAKER.approach * (1 - smooth(Math.min(1, runAge)));
    const reaction = !!this.result && runAge > 1.9, variant = (this.cosmeticSeed + this.cosmeticKick) % 2;
    const shooterClip = reaction ? this.result!.outcome === "goal" ? variant ? "celebrate_fist" : "celebrate" : variant ? "disappointed_hands" : "disappointed" : moving ? "kick_" + this.style : (this.cosmeticSeed % 2 ? "prepare_shift" : "prepare");
    const shooterTime = reaction ? runAge - 1.9 : moving ? Math.min(runAge, 1.9) : this.tick * STEP % 2.4;
    const leftPlant = !moving || !reaction && (runAge <= .16 || runAge >= .40 && runAge <= .58 || runAge >= .84 && runAge <= 1.15 || runAge >= 1.66);
    const rightPlant = !moving || !reaction && (runAge >= .20 && runAge <= .36 || runAge >= .64 && runAge <= .72 || runAge >= 1.46);
    this.shooterPose = this.shooterAnimator.evaluate(shooterClip, shooterTime, { root: { x: shooterX, y: 0, z: shooterZ }, yaw: Math.PI, tick: this.tick, preset: (this.cosmeticSeed + this.cosmeticKick) % 4, leftPlant, rightPlant, expression: reaction ? this.result!.outcome === "goal" ? "smile" : "tension" : "neutral" });
    const keeper = this.keeperMotion(), side = keeper.direction < 0 ? "left" : "right";
    let clip = this.dive ? keeper.direction === 0 ? "centre_block" : keeper.dive >= 1.45 ? "recovery_" + side : "dive_" + (keeper.height > .3 ? "high" : keeper.height < -.3 ? "low" : "mid") + "_" + side : Math.abs(this.keeperVelocity) > .01 ? "keeper_shuffle_" + (this.keeperVelocity < 0 ? "left" : "right") : "keeper_ready";
    let time = this.dive ? keeper.dive >= 1.45 && keeper.direction ? keeper.dive - 1.45 : keeper.dive : this.tick * STEP * (clip === "keeper_ready" ? 1 : 2) % (clip === "keeper_ready" ? 2 : .7);
    // Seeded cosmetic anticipation. Commands always interrupt it immediately;
    // its final pose drives the same colliders as every other animation.
    const gestureTime = this.tick * STEP % 5.4;
    const gesture = this.phase === "preparation" && !this.dive && Math.abs(this.keeperVelocity) < .01 && gestureTime < 2.2;
    if (gesture) { clip = (this.cosmeticSeed + this.cosmeticKick) % 2 ? "keeper_wave" : "keeper_crouch"; time = gestureTime; }
    if (this.catchTick >= 0 && !keeper.direction) { clip = "catch"; time = (this.tick - this.catchTick) * STEP; }
    else if (this.parryTick >= 0 && !this.dive && this.tick - this.parryTick < 78) { clip = "parry_" + side; time = (this.tick - this.parryTick) * STEP; }
    const shuffling = !this.dive && Math.abs(this.keeperVelocity) > .01, leftStep = this.tick * STEP % .35 >= .175;
    let handTargets: [Vec3, Vec3] | undefined = gesture ? undefined : [keeper.leftHand, keeper.rightHand];
    if (gesture && clip === "keeper_wave") {
      const lift = smooth(time / .38) * (1 - smooth((time - 1.55) / .65));
      handTargets = [1, -1].map(side => ({ x: keeper.root.x + side * (.32 + .11 * lift), y: 1.08 + .92 * lift, z: .42 + .035 * Math.sin(time * 10) * lift })) as [Vec3, Vec3];
    }
    this.keeperActorPose = this.keeperAnimator.evaluate(clip, time, { root: keeper.root, lean: keeper.lean, tick: this.tick, preset: (this.cosmeticSeed + 2) % 4, leftPlant: this.dive ? keeper.dive < .08 || keeper.dive > 2.15 : !shuffling || leftStep, rightPlant: this.dive ? keeper.dive < .08 || keeper.dive > 2.45 : !shuffling || !leftStep, resetFeet: !!this.dive && this.tick - this.dive.tick === 330, hands: handTargets, expression: this.result?.outcome === "goal" ? "tension" : this.result ? "smile" : "neutral" });
  }
  private placeKeeper(immediate = false) {
    this.updateActors(); const pose = this.keeperPose();
    [pose.leftHand, pose.rightHand].forEach((point, i) => { if (immediate) this.hands[i].setTranslation(point, true); this.hands[i].setNextKinematicTranslation(point); });
    const placeSegment = (body: RAPIER.RigidBody, a: Vec3, b: Vec3, radius: number) => {
      const p = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, z: (a.z + b.z) / 2 }, delta = new THREE.Vector3(b.x - a.x, b.y - a.y, b.z - a.z);
      const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), delta.clone().normalize());
      const halfHeight = Math.max(.015, delta.length() / 2 - radius);
      if (Math.abs((this.segmentLengths.get(body.handle) ?? -1) - halfHeight) > .002) { body.collider(0).setShape(new RAPIER.Capsule(halfHeight, radius)); this.segmentLengths.set(body.handle, halfHeight); }
      if (immediate) { body.setTranslation(p, true); body.setRotation(q, true); } body.setNextKinematicTranslation(p); body.setNextKinematicRotation(q);
    };
    placeSegment(this.body, this.keeperAnimator.point("hips"), this.keeperAnimator.point("neck"), .19);
    const segments = [["upper_arm_L", "forearm_L"], ["forearm_L", "hand_L"], ["upper_arm_R", "forearm_R"], ["forearm_R", "hand_R"], ["thigh_L", "shin_L"], ["shin_L", "foot_L"], ["thigh_R", "shin_R"], ["shin_R", "foot_R"], ["head", "head"]];
    segments.forEach(([a, b], i) => { const start = this.keeperAnimator.point(a), end = this.keeperAnimator.point(b); if (a === b) end.y += .15; placeSegment(this.limbBodies[i], start, end, a === "head" ? .1 : a.startsWith("thigh") ? .085 : .055); });
    if (this.caught) { const palm = this.caughtSide === "hand_L" ? pose.leftHand : pose.rightHand; this.ball.setNextKinematicTranslation({ x: palm.x + this.caughtOffset.x, y: palm.y + this.caughtOffset.y, z: palm.z + this.caughtOffset.z }); }
  }
  step(input: InputFrame) {
    if (this.phase === "summary") return;
    if (this.phase === "replay") { this.replayIndex += 1; if (this.replayIndex >= this.frames.length - 1) this.setPhase("resolution"); return; }
    if (this.phase === "resolution") {
      if (this.tailTicks < 360) { this.tick++; this.tailTicks++; this.placeKeeper(); this.world.step(this.queue); this.queue.drainCollisionEvents(() => {}); this.frames.push(this.liveFrame()); if (this.frames.length > 1920) this.frames.shift(); }
      return;
    }
    this.tick++;
    const age = this.age(), shootPressed = input.shoot && !this.wasShoot;
    if (this.role === "shooting") {
      if (this.phase === "preparation" || this.phase === "charging") this.style = input.style;
      // Pick the target while waiting. Pressing Shoot commits that target;
      // charging and the run-up only determine power and execute the kick.
      if (this.phase === "preparation") { this.target.x = clamp(this.target.x + input.x * STEP * 4.3, -4.7, 4.7); this.target.y = clamp(this.target.y + input.y * STEP * 2.8, -0.1, 3.25); }
      if (this.phase === "preparation" && shootPressed) { this.composure = clamp(1 - Math.abs(this.marker - 0.5) * 2, 0, 1); this.chargeTick = this.tick; this.setPhase("charging"); }
      if (this.phase === "charging") { this.power = clamp((this.tick - this.chargeTick) * STEP / 0.9, 0.05, 1); if (!input.shoot || this.power === 1) this.setPhase("runup"); }
      if (!this.dive) {
        if (this.ai.early && this.phase === "runup" && age > 0.65) this.commitDive(this.ai.x, this.ai.y);
        // Reactive AI observes launched velocity only, after its reaction delay.
        if (!this.ai.early && this.phase === "flight" && age >= this.ai.reaction) { const v = this.ball.linvel(), p = this.ball.translation(), arrival = Math.max(0, p.z / Math.max(0.01, -v.z)); this.commitDive(Math.sign(p.x + v.x * arrival), clamp((p.y + v.y * arrival - 4.905 * arrival ** 2 - 1.2) / 1.1, -1, 1)); }
      }
    } else {
      this.keeperVelocity = this.dive ? 0 : -input.x * 1.5;
      if (!this.dive) this.keeperX = clamp(this.keeperX + this.keeperVelocity * STEP, -1.05, 1.05);
      if (input.dive) this.commitDive(-input.dive.x, input.dive.y);
      if (this.phase === "preparation" && age > 1.8) { this.style = this.cpuShot.style; this.power = this.cpuShot.power; this.composure = this.cpuShot.composure; this.setPhase("runup"); }
    }
    this.wasShoot = input.shoot;
    if (this.phase === "runup" && this.age() >= 1) {
      const shot: ShotCommand = this.role === "shooting" ? { target: this.target, power: this.power, composure: this.composure, style: this.style } : this.cpuShot;
      const launched = launch(shot, this.random); this.actualTarget = launched.target;
      this.ball.setLinvel(launched.velocity, true); this.ball.setAngvel({ x: -launched.velocity.z / GOAL.ballRadius, y: this.style === "placed" ? 5 : 0, z: 0 }, true);
      this.shotTick = this.tick; this.setPhase("flight"); this.emit("kick");
    }
    this.placeKeeper();
    const beforeVelocity = copy(this.ball.linvel());
    this.world.step(this.queue);
    this.queue.drainCollisionEvents((a, b, started) => {
      if (!started || this.phase !== "flight") return;
      const ballHandle = this.ball.collider(0).handle;
      if (a !== ballHandle && b !== ballHandle) return;
      const kind = this.colliders.get(a === ballHandle ? b : a); if (!kind) return;
      if (!this.contacts.has(kind)) { this.contacts.add(kind); if (kind === "frame") this.emit("frame"); if (kind === "keeper") this.emit("glove"); }
      if (kind === "keeper") {
        const handle = a === ballHandle ? b : a, part = this.parts.get(handle) ?? "torso", point = copy(this.ball.translation());
        const collider = this.world.getCollider(handle), velocity = collider.parent()?.linvel() ?? { x: 0, y: 0, z: 0 };
        const relativeVelocity = { x: beforeVelocity.x - velocity.x, y: beforeVelocity.y - velocity.y, z: beforeVelocity.z - velocity.z };
        const speed = Math.hypot(relativeVelocity.x, relativeVelocity.y, relativeVelocity.z), pose = this.keeperPose();
        const hand = part.startsWith("hand"), gap = Math.hypot(pose.leftHand.x - pose.rightHand.x, pose.leftHand.y - pose.rightHand.y, pose.leftHand.z - pose.rightHand.z);
        const caughtNow = hand && speed < 13 && gap < .75 && (!this.dive || this.dive.x === 0);
        this.caught ||= caughtNow;
        let position = point;
        this.world.contactPair(this.ball.collider(0), collider, manifold => { if (manifold.numSolverContacts()) position = copy(manifold.solverContactPoint(0) ?? position); });
        this.contactFacts.push({ tick: this.tick, bodyPart: part, position, relativeVelocity, caught: caughtNow });
        if (caughtNow && this.catchTick < 0) { this.catchTick = this.tick; this.caughtSide = part as "hand_L" | "hand_R"; const palm = part === "hand_L" ? pose.leftHand : pose.rightHand; this.caughtOffset = { x: point.x - palm.x, y: point.y - palm.y, z: point.z - palm.z }; }
        else this.parryTick = this.tick;
      }
    });
    const point = copy(this.ball.translation());
    if (this.phase === "flight") {
      if (crossesGoal(this.previousBall, point)) this.resolve("goal");
      else if (this.caught) { this.ball.setLinvel({ x: 0, y: 0, z: 0 }, true); this.ball.setBodyType(RAPIER.RigidBodyType.KinematicPositionBased, true); this.resolve("saved"); }
      else if (point.z < -0.5 && (Math.abs(point.x) > GOAL.halfWidth + 0.2 || point.y > GOAL.height + 0.2)) this.resolve(this.contacts.has("frame") ? "woodwork" : point.y > GOAL.height ? "over" : "wide");
      else if (point.z < -GOAL.depth - 1 || Math.abs(point.x) > 12 || point.z > 15) this.resolve(this.contacts.has("keeper") ? "saved" : this.contacts.has("frame") ? "woodwork" : point.y > GOAL.height ? "over" : "wide");
      else { const v = this.ball.linvel(); this.stationary = v.x * v.x + v.y * v.y + v.z * v.z < 0.04 ? this.stationary + STEP : 0; if (this.age() >= 8 || this.stationary > 0.45 || this.contacts.has("keeper") && point.z > 1.2 && v.z > 0) this.resolve(this.contacts.has("keeper") ? "saved" : this.contacts.has("frame") ? "woodwork" : "wide"); }
    }
    this.previousBall = point;
    // Pre-contact snapshots include the complete run-up; capped to eight seconds plus preparation.
    if (this.phase !== "preparation" || this.role === "keeping") { this.frames.push(this.liveFrame()); if (this.frames.length > 1920) this.frames.shift(); }
  }
  private resolve(outcome: KickResult["outcome"]) {
    if (this.result) return;
    this.result = { id: this.kicks.length + 1, role: this.role, outcome, style: this.style, power: this.power, composure: this.composure, target: copy(this.actualTarget), contacts: [...this.contacts], contactFacts: copy(this.contactFacts), flightSeconds: (this.tick - this.shotTick) * STEP };
    this.kicks.push(this.result); this.setPhase("resolution"); this.emit(outcome === "goal" ? "goal" : "result", this.result);
  }
  private liveFrame(): Frame {
    return { tick: this.tick, ball: copy(this.ball.translation()), rotation: copy(this.ball.rotation()), keeper: this.keeperPose(), shooterX: this.shooterPose.root.x, shooterZ: this.shooterPose.root.z, shooterClip: this.shooterPose.clip, shooterTime: this.shooterPose.time, keeperClip: this.keeperActorPose.clip, keeperTime: this.keeperActorPose.time, shooterPose: this.shooterPose, keeperPose: this.keeperActorPose };
  }
  frame(): Frame { return this.phase === "replay" && this.frames.length ? this.frames[Math.min(this.frames.length - 1, Math.floor(this.replayIndex))] : this.liveFrame(); }
  snapshot(): Snapshot {
    const match = matchStatus(this.kicks, this.rules);
    return { phase: this.phase, role: this.role, mode: this.mode, tick: this.tick, ...match, kicks: [...this.kicks], power: this.power, composure: this.composure, marker: this.marker, aim: copy(this.target), spread: accuracy({ power: this.power, composure: this.composure, style: this.style }), style: this.style, result: this.result, replayProgress: this.frames.length ? this.replayIndex / this.frames.length : 0, notice: this.role === "shooting" ? this.phase === "preparation" ? "Aim first, then hold Shoot to charge" : this.phase === "charging" ? "Aim locked  -  release to shoot" : this.phase === "runup" ? "Aim locked  -  taking the shot" : "" : this.phase === "preparation" ? "Move on the line  -  read the taker" : this.phase === "runup" ? "Commit early for reach, or react late" : "" };
  }
  dispose() { this.queue.free(); this.world.free(); }
}
