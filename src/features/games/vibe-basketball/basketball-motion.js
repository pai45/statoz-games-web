import * as THREE from 'three';

const clamp = (x, min = 0, max = 1) => Math.max(min, Math.min(max, x));
const smooth = x => { const t = clamp(x); return t * t * (3 - 2 * t); };
const mix = (a, b, t) => a + (b - a) * t;

/**
 * Distance-paced, basketball-specific locomotion. The simulation still owns all
 * root travel; this layer only supplies the visible weight transfer and steps.
 */
export function basketballGait(animator, dt, ctx) {
  const {gait = 'idle', speed = 0, crouch = 0} = ctx;
  if (!['idle', 'run', 'slide', 'air'].includes(gait)) return false;
  const a = animator, pace = clamp(speed / 6.8);
  const stride = mix(.66, 1.30, pace);
  a.phase += dt * (speed > .15 ? speed / (stride * 2) * Math.PI * 2 : 1.8);
  const p = a.phase, breathe = Math.sin(a.t * 2.2);
  const forward = ctx.moveLocal?.z ?? 1, lateral = ctx.moveLocal?.x ?? 0;
  const direction = Math.hypot(forward, lateral) || 1;
  const f = forward / direction, l = lateral / direction;
  a._basketballFeet = null;

  if (gait === 'air') {
    const tuck = ctx.airTuck ?? .45;
    a.hips(-.025);
    a.rot('LeftUpLeg', -.35 - tuck * .65, 0, -.09);
    a.rot('RightUpLeg', -.18 - tuck * .45, 0, .09);
    a.rot('LeftLeg', .62 + tuck, 0, 0);
    a.rot('RightLeg', .45 + tuck * .75, 0, 0);
    a.rot('Spine', .06, 0, 0);
    return true;
  }
  if (gait === 'idle') {
    const sit = .028 + .12 * crouch;
    a.hips(-sit + breathe * .0025, Math.sin(a.t * .7) * .004);
    a.rot('Spine', .055 + crouch * .10 + breathe * .007, .015 * Math.sin(a.t), 0);
    a.rot('Spine1', .015, 0, 0);
    a._basketballFeet = [
      {side: 'Left', x: .14 + crouch * .07, y: .095, z: .035},
      {side: 'Right', x: -.14 - crouch * .07, y: .095, z: -.045},
    ];
  } else if (gait === 'slide') {
    const beat = Math.sin(p), width = .22 + crouch * .04;
    a.hips(-.13 - .035 * pace - .04 * crouch, beat * .018);
    a.rot('Hips', .035, lateral * .04, -beat * .025);
    a.rot('Spine', .16, -lateral * .055, -lateral * .035);
    a.rot('Spine1', .055, 0, 0);
    a._basketballFeet = ['Left', 'Right'].map((side, index) => {
      const phase = p + index * Math.PI, swing = Math.sin(phase);
      return {side, x: (index ? -width : width) + swing * l * .15,
        y: .095 + Math.max(0, Math.cos(phase)) * .045 * pace,
        z: swing * f * .19 * pace};
    });
  } else {
    const beat = Math.sin(p), bob = .015 + pace * .014;
    a.hips(-.075 - .05 * crouch - bob * Math.cos(p * 2), beat * .009);
    a.rot('Hips', 0, beat * .055 * f, beat * .02);
    a.rot('Spine', .08 + pace * .12 + crouch * .08, -beat * .055 * f, -l * .045);
    a.rot('Spine1', .015, -beat * .03, 0);
    a._basketballFeet = ['Left', 'Right'].map((side, index) => {
      const cycle = ((p / (2 * Math.PI) + index * .5) % 1 + 1) % 1;
      const stance = cycle < .58;
      const travel = stance ? mix(.38, -.38, cycle / .58) : mix(-.38, .38, smooth((cycle - .58) / .42));
      const lift = stance ? 0 : Math.sin((cycle - .58) / .42 * Math.PI) * (.10 + pace * .10);
      return {side, x: (index ? -.13 : .13) + travel * stride * l * .50,
        y: .095 + lift, z: travel * stride * f};
    });
  }
  if (!ctx.armOverride) {
    const swing = gait === 'run' ? Math.sin(p) * (.26 + pace * .24) : 0;
    a.rot('LeftArm', -.12 - swing * f, 0, -.13 - crouch * .1);
    a.rot('RightArm', -.12 + swing * f, 0, .13 + crouch * .1);
    a.rot('LeftForeArm', -.72 - pace * .20, 0, 0);
    a.rot('RightForeArm', -.72 - pace * .20, 0, 0);
  }
  return true;
}

/** Analytic knee solve keeps planted shoes at court level, including Lite mode. */
export function plantBasketballFeet(animator, ctx) {
  let targets = animator._basketballFeet;
  if (!targets || (ctx.pose && !['sizeup', 'defenseArms', 'checkball', 'shot', 'dribbleMove', 'land'].includes(ctx.pose.name))) return;
  if (ctx.pose?.name === 'dribbleMove') {
    const weight = Math.sin(Math.PI * Math.max(0, Math.min(1, ctx.pose.t ?? 0)));
    const direction = ctx.moveDir || 1;
    targets = targets.map(foot => {
      const side = foot.side === 'Left' ? 1 : -1, lead = side === -direction;
      return {...foot, x: side * (.19 + weight * .035), y: .095, z: (lead ? .16 : -.09) * weight};
    });
  }
  const rig = animator.rig;
  rig.armature.updateMatrixWorld(true);
  for (const target of targets) {
    const {side} = target;
    const hip = rig.bones[side + 'UpLeg'], knee = rig.bones[side + 'Leg'], foot = rig.bones[side + 'Foot'];
    const start = hip.getWorldPosition(new THREE.Vector3());
    const end = rig.group.localToWorld(new THREE.Vector3(target.x, target.y, target.z));
    const upper = .4602, lower = .4362;
    const direction = end.clone().sub(start);
    const distance = clamp(direction.length(), .12, (upper + lower) * .998);
    direction.normalize();
    const projection = (upper * upper + distance * distance - lower * lower) / (2 * distance);
    const height = Math.sqrt(Math.max(0, upper * upper - projection * projection));
    const pole = new THREE.Vector3(0, 0, 1).transformDirection(rig.group.matrixWorld);
    pole.addScaledVector(direction, -pole.dot(direction)).normalize();
    const bend = start.clone().addScaledVector(direction, projection).addScaledVector(pole, height);
    rig.setBoneWorldDir(hip, new THREE.Vector3(0, -.46, .014).normalize(), bend.clone().sub(start).normalize(), 1);
    rig.setBoneWorldDir(knee, new THREE.Vector3(0, -.435, -.032).normalize(), end.clone().sub(bend).normalize(), 1);
    // Counter the shin's rotation so a planted shoe lies on the court, not on its toe.
    const parentWorld = knee.getWorldQuaternion(new THREE.Quaternion());
    const rootWorld = rig.group.getWorldQuaternion(new THREE.Quaternion());
    foot.quaternion.copy(parentWorld.invert().multiply(rootWorld));
    foot.rotateX(target.y > .12 ? -.12 : 0);
    hip.updateWorldMatrix(true, true);
  }
}

/** Original authored takes, keyed to the existing release frame, not a new timer. */
export function basketballPose(a, pose, ctx) {
  const t = clamp(pose.t ?? 0), w = pose.weight ?? 1;
  if (pose.name === 'shot') {
    const release = ctx.shotRelease ?? .68;
    const load = smooth(t / (release * .44)) * (1 - smooth((t - release * .45) / (release * .46)));
    const extend = smooth((t - release * .45) / (release * .5));
    const recover = smooth((t - Math.max(.82, release)) / .18);
    a.hips(-.15 * load - .012 * recover);
    a.rot('LeftUpLeg', -.10 - .34 * load + .04 * extend, 0, -.065);
    a.rot('RightUpLeg', -.12 - .38 * load + .02 * extend, 0, .065);
    a.rot('LeftLeg', .18 + .66 * load + .12 * extend, 0, 0);
    a.rot('RightLeg', .21 + .70 * load + .10 * extend, 0, 0);
    a.rot('LeftFoot', -.08 * extend + .12 * load, 0, 0);
    a.rot('RightFoot', -.08 * extend + .12 * load, 0, 0);
    a.rot('Spine', .11 * load - .075 * extend, -.035, 0);
    a.rot('Spine1', -.035 * extend, 0, 0);
    a.rot('Neck', -.035, .025, 0);
    return true;
  }
  if (pose.name === 'defenseArms') {
    const read = ctx.defHand ?? .5, pulse = Math.sin(a.t * 4) * .035;
    a.rot('LeftArm', -.45 - read * .2 + pulse, 0, -.65, w);
    a.rot('RightArm', -.42 - read * .2 - pulse, 0, .65, w);
    a.rot('LeftForeArm', -.65 - read * .25, 0, 0, w);
    a.rot('RightForeArm', -.68 - read * .25, 0, 0, w);
    return true;
  }
  if (pose.name === 'dribbleMove' && ['cross', 'doublecross', 'btl', 'behind', 'hesitation', 'sidedrive', 'spin', 'halfspin'].includes(ctx.moveName)) {
    const d = ctx.moveDir || 1, k = Math.sin(t * Math.PI);
    const transfer = smooth(t / .44) - smooth((t - .56) / .44);
    const low = ['btl', 'cross', 'doublecross'].includes(ctx.moveName);
    const lead = d > 0 ? 'Right' : 'Left', trail = d > 0 ? 'Left' : 'Right';
    a.hips(-.075 - (low ? .11 : .055) * k, d * .035 * transfer);
    a.rot(lead + 'UpLeg', -.35 - .32 * k, 0, (lead === 'Left' ? -1 : 1) * (.12 + .20 * k));
    a.rot(trail + 'UpLeg', -.22 + .16 * transfer, 0, (trail === 'Left' ? -1 : 1) * (.10 + .14 * k));
    a.rot(lead + 'Leg', .55 + .48 * k, 0, 0);
    a.rot(trail + 'Leg', .38 + .17 * k, 0, 0);
    a.rot('Spine', .15 + .22 * k, -.22 * d * transfer, .12 * d * k);
    a.rot('Spine1', .025, -.10 * d * k, .045 * d * k);
    a.rot('Hips', .025, .11 * d * transfer, 0);
    if (ctx.moveName === 'hesitation') {
      a.addHips(.105 * k);
      a.addRot('Spine', -.27 * transfer, 0, 0);
      a.addRot('Head', -.08 * transfer, .18 * d * k, 0);
    } else if (ctx.moveName === 'behind') {
      a.addRot('Hips', 0, -.26 * d * k, 0);
      a.addRot('Spine', 0, .31 * d * k, -.10 * d * k);
    } else if (ctx.moveName.includes('spin')) {
      a.addRot('Neck', -.04, -.40 * d * k, 0);
      a.addRot('Head', 0, -.24 * d * k, 0);
    }
    return true;
  }
  if (pose.name === 'layup' || pose.name === 'dunk') {
    const side = (ctx.layupHand || ctx.dunkHand) === 'Left' ? 'Left' : 'Right';
    const other = side === 'Left' ? 'Right' : 'Left';
    const knee = smooth(t / .36) * (1 - smooth((t - .66) / .34));
    const extend = smooth((t - .35) / .28);
    a.rot(side + 'UpLeg', -.28 - .92 * knee + .35 * extend, 0, side === 'Left' ? -.10 : .10);
    a.rot(side + 'Leg', .35 + 1.05 * knee, 0, 0);
    a.rot(other + 'UpLeg', -.12 + .20 * knee, 0, other === 'Left' ? -.10 : .10);
    a.rot(other + 'Leg', .35 + .95 * knee, 0, 0);
    a.rot('Spine', .04 - .12 * extend, side === 'Left' ? .08 : -.08, 0);
    a.rot(other + 'Arm', -.45 - .30 * knee, 0, other === 'Left' ? -.38 : .38);
    a.rot(other + 'ForeArm', -.95, 0, 0);
    return true;
  }
  return false;
}

export function basketballFingers(animator, dt, ctx) {
  const rig = animator.rig;
  if (!rig.athleteSkeleton) return;
  animator._fingerGrip ??= {Left: 0, Right: 0};
  for (const side of ['Left', 'Right']) {
    const requested = ctx.grip?.[side] ?? 0;
    const grip = animator._fingerGrip[side] += (clamp(requested) - animator._fingerGrip[side]) * (1 - Math.exp(-18 * dt));
    for (const finger of ['Index', 'Middle', 'Ring', 'Pinky', 'Thumb']) {
      for (let joint = 1; joint <= 3; joint++) {
        const bone = rig.bones[`${side}${finger}${joint}`];
        if (!bone) continue;
        const curl = finger === 'Thumb' ? .17 + grip * .28 : .07 + grip * (joint === 1 ? .42 : .72);
        bone.rotation.set(-curl, finger === 'Thumb' ? (side === 'Left' ? -.25 : .25) * grip : 0, 0);
      }
    }
  }
}

export function basketballLook(animator, target, dt, weight) {
  const rig = animator.rig, point = rig.group.worldToLocal(target.clone());
  const yaw = clamp(Math.atan2(point.x, point.z), -.65, .65);
  const pitch = clamp(Math.atan2(point.y - 1.68, Math.hypot(point.x, point.z)), -.35, .45);
  animator.lookWeight += (weight - animator.lookWeight) * (1 - Math.exp(-8 * dt));
  animator.addRot('Neck', -pitch * .4 * animator.lookWeight, yaw * .35 * animator.lookWeight, 0);
  animator.addRot('Head', -pitch * .6 * animator.lookWeight, yaw * .65 * animator.lookWeight, 0);
}
