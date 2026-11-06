/**
 * Ball flight for Yorker. Pure TypeScript, no Three.js. Metres and seconds.
 * World frame: striker's stumps at the origin, bowler's stumps at z = -PITCH, +y up. For a
 * right-handed batter the off side is +x (a right-arm over bowler releases from that side).
 */
export const PITCH = 20.12;
/** Striker's popping crease and the bowler's popping crease (z). */
export const POPPING = -1.22, BOWLING_POPPING = -PITCH+1.22;
export const BALL_R = .036, STUMP_HALF = .1143, STUMP_H = .711, BAIL_TOP = .724;
/** Wide guideline (distance of the line from middle stump). */
export const WIDE_LINE = .89;
export const G = 9.81, DRAG = .0062;
export const FLIGHT_DT = 1/480;
export type V3 = {x: number; y: number; z: number};
export const v3 = (x = 0, y = 0, z = 0): V3 => ({x, y, z});

export type FlightParams = {
  /** Lateral air acceleration (m/s², world x) at full strength; ramps up late in the flight. */
  swing: number;
  /** Spin drift (m/s², world x), also late. */
  drift: number;
  /** Deviation added to the horizontal velocity at the first bounce (degrees, + toward world +x). */
  deviation: number;
  /** First-bounce vertical restitution and horizontal speed retention. */
  restitution: number; retention: number;
  /** Struck balls: every bounce uses the outfield model (a shallow skim keeps its pace, a steep landing dies). */
  grass?: boolean;
};

export type Flight = {
  /** Samples [t, x, y, z] at FLIGHT_DT intervals. */
  data: Float32Array; count: number;
  /** First ground contact in this flight (for a delivery, where it pitched). */
  bounce: V3 | null; bounceT: number;
  /** Velocity at the end of the samples. */
  end: V3;
};

/** Integrate from p0/v0 until the ball passes `untilZ`, stops, or `maxT` elapses. */
export function fly(p0: V3, v0: V3, params: FlightParams, untilZ: number, maxT = 3, startT = 0, bounced = false): Flight {
  const max = Math.ceil(maxT/FLIGHT_DT)+2, data = new Float32Array(max*4);
  let x = p0.x, y = p0.y, z = p0.z, vx = v0.x, vy = v0.y, vz = v0.z, t = startT, n = 0;
  let bounce: V3 | null = null, bounceT = -1, first = !bounced;
  const put = () => {data[n*4] = t; data[n*4+1] = x; data[n*4+2] = y; data[n*4+3] = z; n++;};
  put();
  let rolling = false, landed = false;
  while (n < max-1) {
    const speed = Math.hypot(vx, vy, vz);
    if (rolling) {
      // On the turf: air drag plus rolling resistance, no gravity or bounce.
      const h = Math.hypot(vx, vz), slow = Math.max(0, h-(2.2+DRAG*h*h)*FLIGHT_DT);
      if (h > 0) {vx *= slow/h; vz *= slow/h;}
      x += vx*FLIGHT_DT; z += vz*FLIGHT_DT; t += FLIGHT_DT;
    } else {
      // Swing and drift build late in the flight (anchored to pitch position, not to this call) and fade after pitching.
      const u = Math.min(1, Math.max(0, (z-BOWLING_POPPING)/(POPPING-BOWLING_POPPING))), late = first ? .3+.95*u*u : .15;
      const ax = -DRAG*speed*vx+(params.swing+params.drift)*late, ay = -G-DRAG*speed*vy, az = -DRAG*speed*vz;
      vx += ax*FLIGHT_DT; vy += ay*FLIGHT_DT; vz += az*FLIGHT_DT;
      x += vx*FLIGHT_DT; y += vy*FLIGHT_DT; z += vz*FLIGHT_DT; t += FLIGHT_DT;
      if (y < BALL_R && vy < 0) {
        // Interpolate the contact point inside the step, then bounce.
        const back = Math.min(FLIGHT_DT, (BALL_R-y)/Math.max(1e-6, -vy));
        x -= vx*back; z -= vz*back; t -= back; y = BALL_R;
        const h = Math.hypot(vx, vz), shallow = Math.min(1, Math.max(0, 1-Math.abs(vy)/(.6*h+1e-6)));
        const r = first && !params.grass ? params : {restitution: .42-.16*shallow, retention: .6+.36*shallow};
        if (!landed) {bounce = {x, y: 0, z}; bounceT = t; landed = true;}
        vy = -vy*r.restitution; vx *= r.retention; vz *= r.retention;
        if (first) {const a = params.deviation*Math.PI/180, c = Math.cos(a), sn = Math.sin(a), nx = vx*c+vz*sn, nz = -vx*sn+vz*c; vx = nx; vz = nz;}
        first = false;
        if (vy < .35) {vy = 0; rolling = true;}
      }
    }
    put();
    if (z >= untilZ || t-startT >= maxT || (rolling && Math.hypot(vx, vz) < .05)) break;
  }
  return {data, count: n, bounce, bounceT, end: {x: vx, y: vy, z: vz}};
}

export const sampleT = (f: Flight, i: number) => f.data[i*4];
export function sampleAt(f: Flight, i: number): V3 {return {x: f.data[i*4+1], y: f.data[i*4+2], z: f.data[i*4+3]};}
/** Position at time t (clamped to the flight), linearly interpolated. */
export function positionAt(f: Flight, t: number): V3 {
  const t0 = f.data[0], i = Math.max(0, Math.min(f.count-2, Math.floor((t-t0)/FLIGHT_DT)));
  const ta = f.data[i*4], tb = f.data[(i+1)*4], k = tb > ta ? Math.max(0, Math.min(1, (t-ta)/(tb-ta))) : 0;
  const a = sampleAt(f, i), b = sampleAt(f, i+1);
  if (t >= f.data[(f.count-1)*4]) return sampleAt(f, f.count-1);
  return {x: a.x+(b.x-a.x)*k, y: a.y+(b.y-a.y)*k, z: a.z+(b.z-a.z)*k};
}
export function velocityAt(f: Flight, t: number): V3 {
  const a = positionAt(f, t-FLIGHT_DT), b = positionAt(f, t+FLIGHT_DT);
  return {x: (b.x-a.x)/(2*FLIGHT_DT), y: (b.y-a.y)/(2*FLIGHT_DT), z: (b.z-a.z)/(2*FLIGHT_DT)};
}
export const endTime = (f: Flight) => f.data[(f.count-1)*4];
/** Where and when the flight first crosses the plane z = zc (null if it never does). */
export function crossing(f: Flight, zc: number): {t: number; p: V3} | null {
  for (let i = 1; i < f.count; i++) {
    const za = f.data[(i-1)*4+3], zb = f.data[i*4+3];
    if (za < zc && zb >= zc) {
      const k = (zc-za)/(zb-za), a = sampleAt(f, i-1), b = sampleAt(f, i);
      return {t: f.data[(i-1)*4]+(f.data[i*4]-f.data[(i-1)*4])*k, p: {x: a.x+(b.x-a.x)*k, y: a.y+(b.y-a.y)*k, z: zc}};
    }
  }
  return null;
}
/** The state (position and velocity) at time t, to continue a flight with new rules. */
export function stateAt(f: Flight, t: number) {return {p: positionAt(f, t), v: velocityAt(f, t)};}

export type StumpTest = {hit: boolean; clear: boolean; x: number; y: number};
/** Would a ball crossing the stump plane at (x, y) hit the wicket? `clear` means the centre is inside the zone. */
export function stumpTest(p: V3 | null): StumpTest {
  if (!p) return {hit: false, clear: false, x: 0, y: 0};
  const hit = Math.abs(p.x) <= STUMP_HALF+BALL_R && p.y <= BAIL_TOP+BALL_R && p.y >= 0;
  const clear = Math.abs(p.x) <= STUMP_HALF && p.y <= STUMP_H;
  return {hit, clear, x: p.x, y: p.y};
}

export type Release = {p: V3; v: V3; speed: number};
/**
 * Find the release velocity (of the given speed) that pitches the ball on `target`.
 * Newton iterations on elevation and azimuth; the flight model includes swing and drift, so a
 * swinging ball still lands on the spot it was aimed at.
 */
export function solveRelease(p: V3, speed: number, target: {x: number; z: number}, params: FlightParams): Release {
  const land = (elev: number, az: number) => {
    const c = Math.cos(elev), v = {x: speed*c*Math.sin(az), y: speed*Math.sin(elev), z: speed*c*Math.cos(az)};
    const f = fly(p, v, {...params, deviation: 0}, target.z+12, 4);
    return {b: f.bounce ?? sampleAt(f, f.count-1), v};
  };
  let elev = Math.atan2(-p.y, target.z-p.z)+.05, az = Math.atan2(target.x-p.x, target.z-p.z), best = land(elev, az);
  for (let i = 0; i < 12; i++) {
    const ex = best.b.x-target.x, ez = best.b.z-target.z;
    if (Math.abs(ex) < .002 && Math.abs(ez) < .002) break;
    const h = 1e-4, de = land(elev+h, az), da = land(elev, az+h);
    const j11 = (de.b.x-best.b.x)/h, j12 = (da.b.x-best.b.x)/h, j21 = (de.b.z-best.b.z)/h, j22 = (da.b.z-best.b.z)/h;
    const det = j11*j22-j12*j21; if (Math.abs(det) < 1e-9) break;
    let dElev = (j22*ex-j12*ez)/det, dAz = (-j21*ex+j11*ez)/det;
    const step = Math.max(Math.abs(dElev), Math.abs(dAz)); if (step > .08) {dElev *= .08/step; dAz *= .08/step;}
    elev -= dElev; az -= dAz; best = land(elev, az);
  }
  return {p, v: best.v, speed};
}
