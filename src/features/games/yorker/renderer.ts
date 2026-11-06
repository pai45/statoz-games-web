import * as T from 'three';
import {GLTFLoader, type GLTF} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {ACTION_START, POSES, Player, bowlingAction, lerpPose, signalFour, smooth, splitPair, stride, throwAction, type BodyPose, type Kit, type PlayerAssets} from './character';
import {Stadium} from './stadium';
import {createPlayerSurfaces} from './player-materials';
import {BOWLERS, TEAMS, VENUES, batterById, type BowlerKind, type FieldPreset, type TeamId, type Venue} from './data';
import {SHOTS, fieldPositions} from './batting';
import {APPEAL, type Match, type Outcome} from './engine';
import {BOWLING_POPPING, PITCH, POPPING, crossing, endTime, positionAt, type V3} from './physics';

export type CueName = 'step' | 'release' | 'bounce' | 'bat' | 'edge' | 'pad' | 'body' | 'stumps' | 'keeper' | 'catch' | 'drop' | 'field' | 'throw' | 'boundary' | 'land' | 'appeal' | 'signal';
export type CueOptions = {level?: number; x?: number; z?: number};
type Cue = (name: CueName, options?: CueOptions) => void;
const V = (x = 0, y = 0, z = 0) => new T.Vector3(x, y, z);
const clamp = (n: number, a = 0, b = 1) => Math.max(a, Math.min(b, n));
const hash = (n: number) => {const s = Math.sin(n*127.1)*43758.5453; return s-Math.floor(s);};
const yawTo = (dx: number, dz: number) => Math.atan2(dx, dz);
const SKIN = ['#8d5a3b', '#c58c64', '#f0c7a0', '#6b4128', '#a86f4a', '#e2b08a', '#4f3020'], HAIR = ['#1b1410', '#2b1d14', '#5b3a22', '#0f0d0c', '#7a5530'];
const BOWLING_SIDE = {white: {shirt: '#233c59', trim: '#d8ba75', trousers: '#172b40', cap: '#182f49'}, red: {shirt: '#eeece2', trim: '#233c59', trousers: '#e8e5da', cap: '#182f49'}};

/** Where the striker takes guard (right-hander; mirrored for left-handers). */
const GUARD = {x: -.6, z: -.95};
const NON_STRIKER = {x: -1.15, z: BOWLING_POPPING-.7};
const UMPIRE = {x: -.5, z: -PITCH-1.35};

export class YorkerView {
  renderer: T.WebGLRenderer; scene = new T.Scene(); camera = new T.PerspectiveCamera(22, 16/9, .1, 1200);
  stadium!: Stadium; onCue: Cue | null = null;
  private assets!: PlayerAssets; private ballMesh!: T.Group; private ballMats: T.MeshStandardMaterial[] = []; private shadow!: T.Mesh; private trail: T.Mesh[] = [];
  private bowlers = new Map<BowlerKind, Player>(); private batters = new Map<string, Player>(); private keeper: Player | null = null; private umpire: Player | null = null; private legUmpire: Player | null = null; private fielders: Player[] = [];
  private sideKey = ''; private venueId = ''; private observer: ResizeObserver; private disposed = false;
  private tracking = new T.Group(); private dust: T.Sprite[] = [];
  private eye = V(0, 6, -40); private look = V(0, .6, -3); private fov = 22; private lastDraw = 0; private prevKey = ''; private prevT = -1;
  private releaseOffset = new Map<BowlerKind, T.Vector3>();
  private dotsKey = '';
  constructor(private canvas: HTMLCanvasElement) {
    this.renderer = new T.WebGLRenderer({canvas, antialias: true, powerPreference: 'high-performance'});
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, matchMedia('(pointer: coarse)').matches ? 1.25 : 1.5)); this.renderer.shadowMap.enabled = true; this.renderer.shadowMap.type = T.PCFShadowMap;
    this.renderer.outputColorSpace = T.SRGBColorSpace; this.renderer.toneMapping = T.ACESFilmicToneMapping; this.renderer.toneMappingExposure = 1;
    this.observer = new ResizeObserver(() => this.resize()); this.observer.observe(canvas); this.resize();
    this.scene.add(this.tracking);
  }
  private resize() {const {width, height} = this.canvas.getBoundingClientRect(); if (!width || !height) return; this.renderer.setSize(width, height, false); this.camera.aspect = width/height; this.camera.updateProjectionMatrix();}

  async load(base: string) {
    // Canvas lettering (boards, numbers, the big screen) uses the embedded condensed face.
    try {await document.fonts?.load('700 40px YorkerCondensed');} catch {/* fallback face */}
    const loader = new GLTFLoader(), tex = new T.TextureLoader();
    const gl = (f: string) => loader.loadAsync(base+f), tx = (f: string) => tex.loadAsync(base+f);
    const [player, helmet, bat, pads, gloves, keeperGloves, wicket, bails, ball, grass, pitch, day, dusk, night] = await Promise.all([
      gl('player.glb'), gl('models/helmet.glb'), gl('models/bat.glb'), gl('models/pads.glb'), gl('models/gloves.glb'), gl('models/keeper-gloves.glb'), gl('models/wicket.glb'), gl('models/bails.glb'), gl('models/ball.glb'),
      tx('textures/grass.jpg'), tx('textures/pitch.jpg'), tx('textures/sky-day.jpg'), tx('textures/sky-dusk.jpg'), tx('textures/sky-night.jpg'),
    ]) as [GLTF, GLTF, GLTF, GLTF, GLTF, GLTF, GLTF, GLTF, GLTF, T.Texture, T.Texture, T.Texture, T.Texture, T.Texture];
    if (this.disposed) return;
    this.assets = {gltf: player, surfaces: createPlayerSurfaces(), gear: {helmet: helmet.scene, bat: bat.scene, pads: splitPair(pads.scene), gloves: splitPair(gloves.scene), keeperGloves: splitPair(keeperGloves.scene)}};
    this.stadium = new Stadium(this.renderer, this.scene, {grass, pitch, sky: {day, dusk, night}, wicket: wicket.scene, bails: bails.scene});
    // The CC0 seamed ball, recoloured per venue.
    this.ballMesh = new T.Group(); const b = ball.scene.clone(true); const box = new T.Box3().setFromObject(b), c = box.getCenter(V());
    b.position.sub(c); b.traverse(o => {if (o instanceof T.Mesh) {o.material = (o.material as T.MeshStandardMaterial).clone(); this.ballMats.push(o.material as T.MeshStandardMaterial); o.castShadow = true;}});
    b.scale.setScalar(.072/box.getSize(V()).x); this.ballMesh.add(b); this.scene.add(this.ballMesh);
    this.shadow = new T.Mesh(new T.CircleGeometry(.05, 16), new T.MeshBasicMaterial({color: '#000', transparent: true, opacity: .35, depthWrite: false})); this.shadow.rotation.x = -Math.PI/2; this.scene.add(this.shadow);
    for (let i = 0; i < 12; i++) {const m = new T.Mesh(new T.SphereGeometry(.03*(1-i/14), 8, 6), new T.MeshBasicMaterial({color: '#fff6d6', transparent: true, opacity: .32*(1-i/12), depthWrite: false})); this.trail.push(m); this.scene.add(m);}
    const puff = new T.SpriteMaterial({map: (() => {const cv = document.createElement('canvas'); cv.width = cv.height = 64; const x = cv.getContext('2d')!; const g = x.createRadialGradient(32, 32, 0, 32, 32, 32); g.addColorStop(0, 'rgba(214,190,150,.7)'); g.addColorStop(1, 'rgba(214,190,150,0)'); x.fillStyle = g; x.fillRect(0, 0, 64, 64); const t = new T.CanvasTexture(cv); t.colorSpace = T.SRGBColorSpace; return t;})(), transparent: true, depthWrite: false});
    for (let i = 0; i < 6; i++) {const s = new T.Sprite(puff.clone()); s.visible = false; this.dust.push(s); this.scene.add(s);}
    this.setVenue(VENUES.meridian);
  }

  /* ---------- Cast ---------- */
  private person(i: number, kit: {shirt: string; trim: string; trousers: string}, extra: Partial<Kit> = {}): Kit {
    return {shirt: kit.shirt, trim: kit.trim, trousers: kit.trousers, skin: SKIN[Math.floor(hash(i*3.1)*SKIN.length)], hair: HAIR[Math.floor(hash(i*5.7)*HAIR.length)], beard: hash(i*9.3) < .35, ...extra};
  }
  private setVenue(venue: Venue) {
    if (venue.id === this.venueId) return;
    this.venueId = venue.id; this.stadium.setVenue(venue);
    const white = venue.ball === 'white';
    this.ballMats.forEach(m => {
      m.color.set(m.name === 'red' ? (white ? '#eeeee5' : '#922d28') : (white ? '#cbcbbd' : '#ddd6bb'));
      m.metalness = 0; m.roughness = m.name === 'red' ? .43 : .82;
    });
  }
  /** Fielding side, umpires and keeper for this venue's ball colour. */
  private ensureCast(venue: Venue, team: TeamId) {
    const key = venue.ball+':'+team;
    if (key === this.sideKey) return;
    this.sideKey = key;
    const remove = (p: Player | null | undefined) => p?.dispose();
    [...this.bowlers.values(), ...this.batters.values(), this.keeper, this.umpire, this.legUmpire, ...this.fielders].forEach(remove);
    this.bowlers.clear(); this.batters.clear(); this.fielders = [];
    const side = BOWLING_SIDE[venue.ball], add = (p: Player) => {this.scene.add(p.outer); return p;};
    for (const kind of ['pace', 'spin'] as const) this.bowlers.set(kind, add(new Player(this.assets, {kit: this.person(kind === 'pace' ? 3 : 7, side), number: kind === 'pace' ? '9' : '17', name: kind.toUpperCase(), role: 'bowler', cap: kind === 'spin' ? side.cap : undefined, height: kind === 'pace' ? 1.88 : 1.79})));
    this.keeper = add(new Player(this.assets, {kit: this.person(11, side, {hand: '#e8e6db'}), number: '1', name: 'KEEPER', role: 'keeper', cap: side.cap, height: 1.77}));
    for (let i = 0; i < 9; i++) this.fielders.push(add(new Player(this.assets, {kit: this.person(20+i, side), number: String(i+2), role: 'fielder', cap: i%3 === 0 ? side.cap : undefined, height: 1.76+hash(i*4.3)*.13})));
    const ump = venue.time === 'day' ? {shirt: '#f4f2ea', trim: '#c7ccd4', trousers: '#1b1f27'} : {shirt: '#2a3550', trim: '#ffcf4a', trousers: '#15181f'};
    this.umpire = add(new Player(this.assets, {kit: this.person(40, ump, {shoes: '#2a2e32'}), number: '', role: 'umpire', badge: 'MC', height: 1.78}));
    this.legUmpire = add(new Player(this.assets, {kit: this.person(41, ump, {shoes: '#2a2e32'}), number: '', role: 'umpire', badge: 'MC', height: 1.82}));
    for (const kind of ['pace', 'spin'] as const) {
      // Where the bowling hand is relative to the root at release, so the ball leaves the hand at the physical release point.
      const p = this.bowlers.get(kind)!; p.place(0, 0, 0); p.begin(0, 'probe'); p.pose(bowlingAction(kind === 'spin', 0)); p.end();
      this.releaseOffset.set(kind, p.handWorld('Right').sub(p.outer.position));
    }
  }
  private batterPlayer(id: string, team: TeamId, venue: Venue) {
    let p = this.batters.get(id);
    if (!p) {
      const b = batterById(id)!, t = TEAMS[team], white = venue.ball === 'white';
      const kit = this.person(b.number*13+id.length, white ? {shirt: t.shirt, trim: t.trim, trousers: t.trousers} : {shirt: '#f3f1e8', trim: t.shirt, trousers: '#efeadc'});
      p = new Player(this.assets, {kit, number: String(b.number), name: b.name.split(' ').at(-1), club: t.short, badge: t.short.slice(0, 2), role: 'batter', helmet: t.helmet, left: b.hand === 'L', height: 1.76+hash(b.number*3.1)*.12});
      this.batters.set(id, p); this.scene.add(p.outer);
    }
    return p;
  }

  /* ---------- Frame ---------- */
  draw(m: Match | null, time: number, opts: {reduced: boolean; menuVenue?: Venue; menuTeam?: TeamId}) {
    if (!this.stadium) return;
    const venue = m ? m.venue : opts.menuVenue ?? VENUES.meridian, team = m ? m.challenge.team : opts.menuTeam ?? 'kings';
    this.setVenue(venue); this.stadium.setPitch(m?.challenge.pitch ?? 'standard'); this.ensureCast(venue, team);
    const dt = clamp(time-this.lastDraw, 0, .1); this.lastDraw = time;
    const o = m?.current ?? null, phase = m?.phase ?? 'menu';
    const runUp = m ? m.bowler.runUp : 2.45;
    // Bowler clock τ: negative during the run-up, 0 at release.
    const tau = !m ? -99 : phase === 'runup' ? m.age-runUp : phase === 'delivery' ? m.age : phase === 'plan' ? -runUp-1 : 30;
    const playT = phase === 'delivery' ? m!.age : phase === 'appeal' || phase === 'review' || phase === 'tracking' || phase === 'between' ? (o?.end ?? 0)+(phase === 'appeal' ? m!.age : phase === 'between' ? m!.age+(o?.lbw?.appeal ? APPEAL : 0) : APPEAL) : -1;
    // Slow-motion replay of a broken wicket: re-evaluate the moment from a low side-on camera.
    const replay = !opts.reduced && o?.stumps && phase === 'delivery' ? this.replayClock(o, m!.age) : null;
    const t = replay ?? playT;
    const ballKey = m ? `${m.initialSeed}:${m.checkpoint}:${phase === 'plan' ? 'p' : 'b'}` : 'menu';
    if (ballKey !== this.prevKey) {this.prevKey = ballKey; this.prevT = -1;}
    const cue: Cue = (name, options) => {if (!replay && phase === 'delivery') this.onCue?.(name, options);};
    const crossed = (at: number) => this.prevT < at && t >= at;

    // Cast visibility.
    for (const p of [...this.bowlers.values(), ...this.batters.values()]) p.outer.visible = false;
    const kind = m?.bowler.kind ?? 'pace', bowler = this.bowlers.get(kind)!;
    bowler.outer.visible = true;
    const striker = m && m.striker >= 0 ? this.batterPlayer(o?.batter ?? m.batters[m.striker].id, team, venue) : null;
    const nonStriker = m && m.nonStriker >= 0 ? this.batterPlayer(m.batters[m.nonStriker].id, team, venue) : null;
    if (striker) striker.outer.visible = true;
    if (nonStriker && nonStriker !== striker) nonStriker.outer.visible = true;
    const field = o?.field ?? (m ? this.fieldFor(m) : null);

    this.drawBowler(bowler, kind, tau, o, phase, time, t);
    if (striker) this.drawStriker(striker, m!, o, phase, time, t);
    if (nonStriker && nonStriker !== striker) this.drawNonStriker(nonStriker, m!, o, phase, time, t);
    this.drawFielders(field, o, phase, time, t, tau, kind);
    this.drawUmpires(m, o, phase, time, t, tau);
    const ball = this.drawBall(m, o, phase, t, bowler, field, opts.reduced);
    this.drawStumps(o, t);
    this.drawTracking(m, o, phase);
    this.drawOverlays(m, phase);
    this.drawBigScreen(m, o, phase, venue);

    // Sound cues timed to what is on screen.
    if (o && phase === 'delivery' && !replay) {
      for (const e of o.events) if (crossed(e.t)) {
        const name = e.type === 'stumps' ? 'stumps' : e.type === 'boundary' ? 'boundary' : e.type;
        cue(name as CueName, {level: e.level, x: e.p.x, z: e.p.z});
      }
    }
    if (!replay) this.prevT = t;
    const excite = o && (phase === 'delivery' || phase === 'between') && (o.dismissal || o.runs >= 4) ? clamp(1-Math.max(0, t-(o.events.at(-1)?.t ?? 0)-2)/3) : 0;
    this.stadium.update(time, excite);
    this.camera3(m, o, phase, t, ball, dt, opts.reduced, replay !== null, time);
    for (const p of [...this.bowlers.values(), ...this.batters.values(), this.keeper, this.umpire, this.legUmpire, ...this.fielders]) if (p?.outer.visible) p.updateDetail(this.camera);
    this.renderer.render(this.scene, this.camera);
  }
  private fieldFor(m: Match) {
    const b = m.striker >= 0 ? batterById(m.batters[m.striker].id) : null;
    // Same geometry the engine uses for this plan.
    return fieldLayout(m.bowler.kind, m.plan.field, b?.hand ?? 'R');
  }
  private replayClock(o: Outcome, age: number) {
    const s = o.stumps!.t, start = s+.9, len = 1.5;
    if (age < start || age > start+len || age > o.end-.1) return null;
    return s-.42+(age-start)*.42;
  }

  /* ---------- Bowler ---------- */
  private drawBowler(p: Player, kind: BowlerKind, tau: number, o: Outcome | null, phase: string, time: number, t: number) {
    const b = BOWLERS[kind], spin = kind === 'spin', off = this.releaseOffset.get(kind) ?? V();
    const rel = o?.release ?? {x: b.releaseX, y: b.releaseHeight, z: BOWLING_POPPING+.32};
    const releaseRoot = {x: rel.x-off.x, z: rel.z-off.z};
    const mark = releaseRoot.z-b.runUpDistance, start = ACTION_START[kind];
    let x = releaseRoot.x, z = mark, yaw = 0, pose: BodyPose, key = 'stand';
    const tauEff = phase === 'delivery' || phase === 'runup' ? (phase === 'delivery' ? t : tau) : tau;
    if (phase === 'menu' || phase === 'plan' || phase === 'finished') {
      z = mark; pose = POSES.stand;
      if (phase === 'finished') pose = POSES.stand;
    } else if (tauEff < 0 && tauEff > -b.runUp-.01) {
      const u = clamp((tauEff+b.runUp)/b.runUp), dist = b.runUpDistance*Math.pow(u, spin ? 1.1 : 1.35);
      z = mark+dist; key = 'run';
      const pace = spin ? .45 : .35+.65*u, phaseLeg = dist*Math.PI/(spin ? 1.3 : 1.65+.45*u);
      const run = stride(phaseLeg, pace);
      pose = tauEff < start ? run : lerpPose(run, bowlingAction(spin, tauEff), smooth(start, start+.12, tauEff));
      if (tauEff >= start) key = 'action';
      if (Math.floor(phaseLeg/Math.PI) !== Math.floor((phaseLeg-.12)/Math.PI) && tauEff < start) this.onCue?.('step', {x, z, level: .6+.4*u});
    } else if (tauEff >= 0 && tauEff < 12) {
      const vEnd = spin ? 2.6 : 7.5, decel = spin ? .9 : 1.25, tt = Math.min(tauEff, decel);
      z = releaseRoot.z+vEnd*tt-.5*(vEnd/decel)*tt*tt; x = releaseRoot.x+(spin ? .6 : 1.5)*smooth(.15, 1.3, tauEff);
      key = 'follow';
      pose = tauEff < .42 ? bowlingAction(spin, tauEff) : lerpPose(bowlingAction(spin, .42), stride(z*Math.PI/1.4, .3), smooth(.42, .7, tauEff));
      if (tauEff > decel+.2) pose = lerpPose(pose, POSES.stand, smooth(decel+.2, decel+.6, tauEff));
      // Appeal and celebrate.
      if (o && (o.lbw?.appeal && !o.noBall && !o.freeHit) && phase !== 'delivery') {pose = POSES.appeal; key = 'appeal'; yaw = Math.PI*.15;}
      else if (o?.dismissal && t > (o.events.find(e => e.type === 'stumps' || e.type === 'catch')?.t ?? 99)+.3) {pose = POSES.celebrate; key = 'celebrate';}
      if (phase === 'appeal' && o?.lbw?.appeal) {pose = POSES.appeal; key = 'appeal'; yaw = Math.PI*.2;}
    } else pose = POSES.stand;
    p.place(x, z, yaw); p.begin(time, key, key === 'action' ? .1 : .25); p.pose(pose); p.end();
  }

  /* ---------- Batters ---------- */
  private drawStriker(p: Player, m: Match, o: Outcome | null, phase: string, time: number, t: number) {
    const b = batterById(p === this.batters.get(o?.batter ?? '') ? o!.batter! : m.batters[m.striker].id);
    const off = b?.hand === 'L' ? -1 : 1, bat = o?.bat ?? null;
    const gx = GUARD.x*off, gz = GUARD.z;
    const runUp = m.bowler.runUp;
    if (phase === 'plan' || phase === 'menu') {p.place(gx, gz, 0); p.begin(time, 'relaxed'); p.ready(0, time); p.end(); return;}
    if (phase === 'runup') {p.place(gx, gz, 0); p.begin(time, 'ready'); p.ready(smooth(runUp-1.1, runUp-.15, m.age), time); p.end(); return;}
    if (!o || !bat) {p.place(gx, gz, 0); p.begin(time, 'hold'); p.ready(1, time); p.end(); return;}
    const tc = bat.contactT, spec = SHOTS[bat.shot];
    const runs = o.fielding && o.fielding.kind !== 'four' && o.fielding.kind !== 'six' ? o.runs : 0;
    const out = !!o.dismissal || (m.decision?.out ?? false);
    // Shot footwork: step toward where the bat meets the ball, partially, then let the bat IK reach.
    const contact = p.contactLocal, target = bat.batP;
    let rx = gx, rz = gz;
    if (target && spec.bat !== 'none') {
      const wantX = target.x-contact.x*off, wantZ = target.z-contact.z;
      const dx = clamp(wantX-gx, -.55, .55), dz = clamp(wantZ-gz, -.85, .35), w = smooth(tc-.5, tc-.08, t);
      rx = gx+dx*w; rz = gz+dz*w;
    } else if (bat.shot === 'leave') rz = gz-.25*smooth(tc-.5, tc-.2, t);
    const runStart = tc+.45;
    if (runs > 0 && t > runStart) {
      const r = this.runningPos(t-runStart, runs, 0);
      p.place(.95, r.z, r.heading > 0 ? Math.PI : 0); p.begin(time, 'run'); p.pose(r.moving ? stride(r.dist*Math.PI/1.8, .85, true) : POSES.stand); p.end(); return;
    }
    if (out && t > tc+.9) {
      const walk = Math.max(0, t-tc-1.4), wx = rx-walk*1.1*off, wz = rz+walk*.5;
      p.place(wx, wz, walk > 0 ? yawTo(-off, .4) : 0); p.begin(time, walk > 0 ? 'walkoff' : 'dejected'); p.pose(walk > 0 ? lerpPose(stride(walk*1.1*Math.PI/.8, 0, true), POSES.dejected, .35) : POSES.dejected); p.end(); return;
    }
    p.place(rx, rz, 0); p.begin(time, 'shot:'+bat.shot, .12);
    if (bat.shot === 'leave') {p.ready(1, time); p.liftHands(smooth(tc-.35, tc-.05, t)*(1-smooth(tc+.6, tc+1.2, t)));}
    else if (bat.shot === 'duck') {p.pose(lerpPose(POSES.stand, POSES.duck, smooth(tc-.4, tc-.15, t)*(1-smooth(tc+.5, tc+1.1, t))));}
    else {
      const defend = bat.shot === 'defend' || bat.shot === 'block';
      const s = t < tc-.48 ? 0 : t < tc ? .5*smooth(tc-.48, tc, t) : defend ? .5+.06*smooth(tc, tc+.15, t)-.06*smooth(tc+.6, tc+1, t)*0 : .5+.5*smooth(tc, tc+.5, t);
      if (t < tc-.48) p.ready(1, time); else p.swing(defend && t > tc+.7 ? .5+.25*smooth(tc+.7, tc+1.3, t) : s);
      const side = bat.shot === 'pull' || bat.shot === 'flick' || bat.shot === 'sweep' ? -1 : bat.shot === 'cut' ? 1 : 0;
      const follow = smooth(tc-.1, tc+.4, t)*(defend ? .2 : 1);
      p.spineTurn((side < 0 ? .45 : side > 0 ? -.3 : -.12)*follow, bat.shot === 'loft' ? -.15*follow : 0);
      if (bat.shot === 'sweep') p.crouch(.38*smooth(tc-.45, tc-.15, t)*(1-smooth(tc+.6, tc+1.2, t)));
      if (target) {
        const near = Math.exp(-Math.pow((t-tc)/.16, 2)), solve = p.solveSpace(V(target.x, target.y, target.z));
        p.batTo(solve, near);
      }
    }
    p.end();
  }
  /** Position along the pitch while running `runs` runs; `lane` 0 striker, 1 non-striker. */
  private runningPos(t: number, runs: number, lane: number) {
    const a = POPPING-.4, bEnd = BOWLING_POPPING+.4, per = [3, ...Array(Math.max(0, runs-1)).fill(2.8)];
    let left = t, seg = 0;
    while (seg < runs && left > per[seg]) {left -= per[seg]; seg++;}
    const done = seg >= runs, u = done ? 1 : clamp(left/per[seg]), ease = u < .2 ? 2.5*u*u : u > .8 ? 1-2.5*(1-u)*(1-u) : .1+(u-.2)*1.333;
    const from = (seg+lane)%2 === 0 ? a : bEnd, to = from === a ? bEnd : a;
    const z = done ? ((runs+lane)%2 === 0 ? a : bEnd) : from+(to-from)*clamp(ease);
    return {z, heading: to < from ? 1 : -1, moving: !done, dist: (seg+clamp(ease))*Math.abs(bEnd-a)};
  }
  private drawNonStriker(p: Player, m: Match, o: Outcome | null, phase: string, time: number, t: number) {
    const runUp = m.bowler.runUp;
    const back = phase === 'runup' ? 1.3*smooth(runUp-.8, runUp, m.age) : phase === 'delivery' ? 1.3 : 0;
    const runs = o?.fielding && o.fielding.kind !== 'four' && o.fielding.kind !== 'six' ? o.runs : 0;
    if (o?.bat && runs > 0 && phase === 'delivery' && t > o.bat.contactT+.45) {
      const r = this.runningPos(t-o.bat.contactT-.45, runs, 1);
      p.place(-.95, r.z, r.heading > 0 ? Math.PI : 0); p.begin(time, 'run'); p.pose(r.moving ? stride(r.dist*Math.PI/1.8, .85, true) : POSES.stand); p.end(); return;
    }
    const walking = phase === 'runup' && m.age > runUp-.8;
    p.place(NON_STRIKER.x, NON_STRIKER.z+back, 0); p.begin(time, walking ? 'walk' : 'wait');
    p.pose(walking ? stride(m.age*5.2, 0, true) : {...POSES.stand, ra: [[-.2, -.95, .25], [-.1, -.55, .85]]}); p.end();
  }

  /* ---------- Fielders, keeper, umpires ---------- */
  private drawFielders(field: FieldSpot[] | null, o: Outcome | null, phase: string, time: number, t: number, tau: number, kind: BowlerKind) {
    const keeper = this.keeper!;
    if (!field) {
      // Menu: everyone at a balanced field around an empty pitch.
      field = fieldLayout('pace', 'balanced', 'R');
    }
    const fe = o?.fielding ?? null, tc = o?.bat?.contactT ?? 0, hit = o?.hit ?? null;
    const walkIn = phase === 'runup' ? smooth(-1.2, -.1, tau) : phase === 'delivery' ? 1 : 0;
    const ballPos = (tt: number) => hit ? positionAt(hit, tt) : null;
    const celebrate = !!o?.dismissal && t > (o.events.find(e => e.type === 'stumps' || e.type === 'catch' || e.type === 'pad')?.t ?? 99)+.4;
    // Keeper.
    const k = field[0], kYaw = Math.PI;
    keeper.place(k.x, k.z, kYaw); keeper.begin(time, 'keep');
    const takeT = o && o.keeperT > 0 ? o.keeperT : -1;
    if (o && takeT > 0 && phase === 'delivery' && t > takeT-.45) {
      const rise = smooth(takeT-.45, takeT-.1, t), pose = lerpPose(POSES.keep, POSES.catchHigh, rise*.6);
      keeper.pose(pose);
      const at = positionAt(o.flight, Math.min(t, takeT));
      const hand = keeper.solveSpace(V(at.x, Math.max(.25, at.y), at.z));
      keeper.handTo('Left', hand.clone().add(V(.06, 0, 0))); keeper.handTo('Right', hand.clone().add(V(-.06, 0, 0)));
    } else if (fe && fe.fielder === 0 && phase === 'delivery' && t > fe.t-.5) {
      const at = ballPos(Math.min(t, fe.t)); keeper.pose(lerpPose(POSES.keep, POSES.catchHigh, smooth(fe.t-.5, fe.t, t)));
      if (at) {const hand = keeper.solveSpace(V(at.x, at.y, at.z)); keeper.handTo('Left', hand.clone().add(V(.06, 0, 0))); keeper.handTo('Right', hand.clone().add(V(-.06, 0, 0)));}
    } else keeper.pose(celebrate ? POSES.celebrate : phase === 'plan' || phase === 'menu' ? POSES.stand : phase === 'runup' ? lerpPose(POSES.stand, POSES.keep, smooth(-.9, -.3, tau)) : POSES.keep);
    keeper.end();
    // Ring and deep fielders.
    for (let i = 0; i < this.fielders.length; i++) {
      const spot = field[i+1], p = this.fielders[i];
      if (!spot) {p.outer.visible = false; continue;}
      p.outer.visible = true;
      const toBat = {x: -spot.x, z: -1-spot.z}, d = Math.hypot(toBat.x, toBat.z), inX = spot.x+toBat.x/d*1.4*walkIn*(spot.role === 'deep' ? 1.6 : spot.role === 'ring' ? 1 : 0), inZ = spot.z+toBat.z/d*1.4*walkIn*(spot.role === 'deep' ? 1.6 : spot.role === 'ring' ? 1 : 0);
      let x = inX, z = inZ, yaw = yawTo(toBat.x, toBat.z), pose: BodyPose = phase === 'runup' && walkIn < 1 ? stride(walkIn*4.4, 0) : walkIn > .95 ? (spot.role === 'slip' || spot.role === 'close' ? POSES.slip : POSES.ready) : POSES.stand, key = 'idle';
      if (phase === 'runup' && walkIn > 0 && walkIn < 1) key = 'walkin';
      const chaser = fe && fe.fielder === i+1;
      if (chaser && hit && phase !== 'plan') {
        const reaction = spot.role === 'slip' || spot.role === 'close' ? .06 : .28, startT = tc+reaction;
        const goal = {x: fe.p.x, z: fe.p.z}, dist = Math.hypot(goal.x-inX, goal.z-inZ);
        const arrive = Math.max(startT+.05, fe.t), u = clamp((t-startT)/(arrive-startT));
        x = inX+(goal.x-inX)*u; z = inZ+(goal.z-inZ)*u;
        const moving = t > startT && u < 1 && dist > .4;
        if (moving) {yaw = yawTo(goal.x-inX, goal.z-inZ); pose = stride(u*dist*Math.PI/1.9, .9); key = 'chase';}
        else if (t >= fe.t) {
          const since = t-fe.t;
          if (fe.kind === 'catch') {pose = since < .5 ? POSES.catchHigh : POSES.celebrate; key = since < .5 ? 'catch' : 'celebrate'; yaw = yawTo(-x, -z);}
          else if (fe.kind === 'drop') {pose = since < .4 ? POSES.catchHigh : POSES.dejected; key = 'drop';}
          else if (fe.kind === 'stop' || fe.kind === 'dead') {
            const toKeeper = Math.hypot(x, z) < Math.hypot(x, z+PITCH) ? {x: -x, z: 1-z} : {x: -x, z: -PITCH-1-z};
            yaw = yawTo(toKeeper.x, toKeeper.z);
            pose = since < .45 ? POSES.slip : throwAction(since-.45); key = since < .45 ? 'pickup' : 'throw';
          }
        }
        if (fe.kind === 'catch' || fe.kind === 'drop') {
          if (t > fe.t-.35 && t < fe.t+.3) {
            const b = ballPos(Math.min(t, fe.t));
            if (b) {p.place(x, z, yaw); p.begin(time, 'catching'); p.pose(POSES.catchHigh); const h = p.solveSpace(V(b.x, Math.max(.3, b.y), b.z)); p.handTo('Left', h.clone().add(V(.05, 0, 0))); p.handTo('Right', h.clone().add(V(-.05, 0, 0))); p.end(); continue;}
          }
        }
      } else if (fe && (fe.kind === 'four' || fe.kind === 'six') && phase === 'delivery' && hit && i+1 === nearestTo(field, fe.p)) {
        const startT = tc+.3, goal = {x: fe.p.x*.92, z: -10+(fe.p.z+10)*.92}, u = clamp((t-startT)/Math.max(.3, fe.t+.4-startT));
        x = inX+(goal.x-inX)*u; z = inZ+(goal.z-inZ)*u; yaw = yawTo(goal.x-inX, goal.z-inZ);
        if (t > startT && u < 1) {pose = stride(u*Math.hypot(goal.x-inX, goal.z-inZ)*Math.PI/1.9, 1); key = 'chase';}
      } else if (hit && phase === 'delivery' && t > tc) {
        const b = ballPos(t); if (b) yaw = yawTo(b.x-x, b.z-z);
        pose = POSES.stand; key = 'watch';
      }
      if (celebrate && !chaser) {pose = POSES.celebrate; key = 'celebrate';}
      p.place(x, z, yaw); p.begin(time, key); p.pose(pose); p.end();
    }
    void kind;
  }
  private drawUmpires(m: Match | null, o: Outcome | null, phase: string, time: number, t: number, tau: number) {
    const u = this.umpire!, l = this.legUmpire!;
    let pose: BodyPose = POSES.umpire, key = 'stand';
    if (phase === 'runup' && tau > -.7) {pose = lerpPose(POSES.umpire, POSES.umpireCrouch, smooth(-.7, -.3, tau)); key = 'crouch';}
    else if (phase === 'delivery' && t < .8) {pose = POSES.umpireCrouch; key = 'crouch';}
    if (o && m) {
      const boundary = o.events.find(e => e.type === 'boundary');
      const signal = (from: number, p: BodyPose | ((tt: number) => BodyPose), k: string) => {if (t >= from && t < from+2.6) {pose = typeof p === 'function' ? p(t-from) : p; key = k;}};
      if (o.noBall) signal(.7, POSES.signalNoBall, 'noball');
      if (o.wide) signal(o.keeperT+.4, POSES.signalWide, 'wide');
      if (boundary) signal(boundary.t+.6, boundary.level === 6 ? POSES.signalSix : signalFour, boundary.level === 6 ? 'six' : 'four');
      if ((o.dismissal === 'caught' || o.dismissal === 'caught-behind') && phase === 'delivery') {const c = o.events.find(e => e.type === 'catch'); if (c) signal(c.t+.7, POSES.signalOut, 'out');}
      if (phase === 'appeal' && m.age > APPEAL-.55 && o.umpireOut) {pose = POSES.signalOut; key = 'out';}
      if ((phase === 'review' || phase === 'tracking' || phase === 'between') && m.decision?.out && !m.decision.reviewed) {pose = POSES.signalOut; key = 'out';}
      if (phase === 'between' && m.decision?.out && m.decision.reviewed) {pose = POSES.signalOut; key = 'out';}
    }
    u.place(UMPIRE.x, UMPIRE.z, 0); u.begin(time, key); u.pose(pose); u.end();
    const off = o?.hand === 'L' ? -1 : 1;
    l.place(-24*off, -1.2, yawTo(off, 0)); l.begin(time, 'idle'); l.pose(POSES.umpire); l.end();
  }

  /* ---------- Ball ---------- */
  private drawBall(m: Match | null, o: Outcome | null, phase: string, t: number, bowler: Player, field: FieldSpot[] | null, reduced: boolean): T.Vector3 {
    let p: V3 | null = null, inPlay = false;
    if (m && (phase === 'plan' || phase === 'runup')) {const h = bowler.handWorld('Right'); p = {x: h.x, y: h.y-.04, z: h.z};}
    else if (o && t >= 0) {
      const firstStop = this.stopTime(o);
      if (t <= firstStop) {p = positionAt(o.flight, t); inPlay = true;}
      else if (o.hit) {
        const fe = o.fielding;
        if (fe && (fe.kind === 'catch') && t >= fe.t) {const f = this.fielderAt(fe.fielder); p = f ? {...f.handWorld('Right')} : fe.p;}
        else if (fe && (fe.kind === 'stop' || fe.kind === 'dead') && t >= fe.t) {
          const f = this.fielderAt(fe.fielder), since = t-fe.t, throwAt = .45+.18;
          if (since < throwAt || !f) p = f ? {...f.handWorld('Right')} : fe.p;
          else {const from = fe.p, toEnd = Math.hypot(from.x, from.z) < Math.hypot(from.x, from.z+PITCH) ? {x: .3, z: .9} : {x: .3, z: -PITCH-.9}, d = Math.hypot(toEnd.x-from.x, toEnd.z-from.z), w = clamp((since-throwAt)/(d/26+.05)); p = {x: from.x+(toEnd.x-from.x)*w, y: 1.8+(1-1.8)*w+d*.06*4*w*(1-w), z: from.z+(toEnd.z-from.z)*w};}
        } else if (fe && fe.kind === 'drop' && t >= fe.t) p = positionAt(o.hit, Math.min(t, endTime(o.hit)));
        else {p = positionAt(o.hit, Math.min(t, endTime(o.hit))); inPlay = true;}
      } else if (o.bat?.pad || o.bat?.body) {
        const hitAt = (o.bat.pad ?? o.bat.body)!, since = t-hitAt.t;
        p = {x: hitAt.p.x+.4*Math.min(since, .6), y: Math.max(.036, hitAt.p.y+1.5*since-4.9*since*since), z: hitAt.p.z-1.2*Math.min(since, .8)};
      } else if (o.stumps) {const since = t-o.stumps.t; p = {x: o.stumps.p.x, y: Math.max(.036, o.stumps.p.y-1.5*since), z: o.stumps.p.z+Math.min(since, .8)*6};}
      else if (o.keeperT > 0) {const k = this.keeper!; p = {...k.handWorld('Right'), y: k.handWorld('Right').y};}
    }
    const visible = !!p && !(phase === 'tracking' || phase === 'review');
    this.ballMesh.visible = visible; this.shadow.visible = visible;
    if (p) {this.ballMesh.position.set(p.x, p.y, p.z); this.ballMesh.rotation.x = t*25; this.shadow.position.set(p.x, .012, p.z); this.shadow.scale.setScalar(1+p.y*.1);}
    for (let i = 0; i < this.trail.length; i++) {
      const tr = this.trail[i]; tr.visible = !reduced && inPlay && !!o && t > 0;
      if (tr.visible) {const at = Math.max(0, t-i*.012), q = o!.hit && t > this.stopTime(o!) ? positionAt(o!.hit, Math.max(at, o!.bat!.contactT)) : positionAt(o!.flight, Math.min(at, this.stopTime(o!))); tr.position.set(q.x, q.y, q.z);}
    }
    // Dust where the delivery pitched.
    const bt = o?.flight.bounceT ?? -1;
    this.dust.forEach((s, i) => {
      const since = t-bt; s.visible = !!o?.bounce && bt > 0 && since > 0 && since < .7 && !reduced;
      if (s.visible) {const a = i/this.dust.length*Math.PI*2; s.position.set(o!.bounce!.x+Math.cos(a)*since*.5, .05+since*.25, o!.bounce!.z+Math.sin(a)*since*.5); s.scale.setScalar(.15+since*.6); s.material.opacity = .5*(1-since/.7);}
    });
    void field;
    return p ? V(p.x, p.y, p.z) : V(0, 1, -10);
  }
  /** When the delivery stops being free flight (bat, pad, body, stumps or the keeper). */
  private stopTime(o: Outcome) {
    const e = o.events.find(e => e.type === 'bat' || e.type === 'edge' || e.type === 'pad' || e.type === 'body' || e.type === 'stumps' || e.type === 'keeper');
    return e ? e.t : endTime(o.flight);
  }
  private fielderAt(index: number) {return index === 0 ? this.keeper : this.fielders[index-1] ?? null;}
  private drawStumps(o: Outcome | null, t: number) {
    const end = this.stadium.ends[0], pieces = [...end.stumps, ...end.bails];
    const hitT = o?.stumps?.t ?? -1;
    pieces.forEach((piece, i) => {
      const rest = end.rest[i];
      if (!o?.stumps || t < hitT) {piece.position.copy(rest.p); piece.quaternion.copy(rest.q); return;}
      const since = Math.min(t-hitT, 2.5), bail = i >= 3, hx = o.stumps.p.x;
      const near = bail ? 1 : Math.max(.15, 1-Math.abs(rest.p.x-hx)*6);
      const vz = (bail ? 3.5 : 2.4)*near+hash(i*7.7)*.8, vx = (rest.p.x-hx)*6+(hash(i*3.3)-.5)*1.2, vy = bail ? 2.6+hash(i)*1.5 : 1.2*near;
      const y = Math.max(bail ? .01 : 0, rest.p.y+vy*since-4.9*since*since);
      const k = bail ? 1 : near;
      piece.position.set(rest.p.x+vx*since*k, y, rest.p.z+vz*since*k*.8);
      piece.rotation.set((bail ? 9 : 2.2*near)*Math.min(since, .6), hash(i*2.2)*3*since, (rest.p.x-hx)*8*Math.min(since, .5));
    });
  }

  /* ---------- Hawk-Eye ---------- */
  private trackingKey = '';
  private drawTracking(m: Match | null, o: Outcome | null, phase: string) {
    const show = phase === 'tracking' && !!o?.lbw;
    this.tracking.visible = show;
    // Ball tracking is a virtual reconstruction: clear the whole cast so only pitch, stumps and path remain.
    if (show) for (const p of [...this.bowlers.values(), ...this.batters.values(), ...this.fielders, this.keeper, this.umpire, this.legUmpire]) {if (p) p.outer.visible = false;}
    else for (const p of [this.keeper, this.umpire, this.legUmpire]) if (p) p.outer.visible = true;
    if (!show || !o?.lbw || !m) return;
    const key = `${m.initialSeed}:${m.checkpoint}`;
    if (key !== this.trackingKey) {
      this.trackingKey = key; this.tracking.clear();
      const lbw = o.lbw, pts: T.Vector3[] = [];
      for (let tt = Math.max(0, o.flight.bounceT-.25); tt <= lbw.impactT; tt += .01) {const q = positionAt(o.flight, tt); pts.push(V(q.x, q.y, q.z));}
      const proj: T.Vector3[] = []; const pf = lbw.projected, pEnd = crossing(pf, .05)?.t ?? endTime(pf);
      for (let tt = lbw.impactT; tt <= pEnd; tt += .01) {const q = positionAt(pf, tt); proj.push(V(q.x, q.y, q.z));}
      const tube = (points: T.Vector3[], color: string, opacity: number) => {if (points.length < 2) return; const mesh = new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(points), Math.max(8, points.length), .036, 10), new T.MeshBasicMaterial({color, transparent: true, opacity, toneMapped: false, depthWrite: false})); this.tracking.add(mesh);};
      tube(pts, '#e8433a', .95); tube(proj, '#4aa3ff', .55);
      const disc = (q: V3, color: string) => {const d = new T.Mesh(new T.CircleGeometry(.07, 24), new T.MeshBasicMaterial({color, transparent: true, opacity: .85, toneMapped: false, depthWrite: false})); d.rotation.x = -Math.PI/2; d.position.set(q.x, .014, q.z); this.tracking.add(d);};
      if (o.bounce) disc(o.bounce, lbw.pitching === 'outside-leg' ? '#e8433a' : '#3fd27a');
      const zone = new T.Mesh(new T.BoxGeometry(.2286, .711, .02), new T.MeshBasicMaterial({color: lbw.wickets === 'hitting' ? '#e8433a' : lbw.wickets === 'umpires-call' ? '#ffb02e' : '#3fd27a', transparent: true, opacity: .32, toneMapped: false, depthWrite: false}));
      zone.position.set(0, .3555, 0); this.tracking.add(zone);
      const lineMat = new T.MeshBasicMaterial({color: '#ffffff', transparent: true, opacity: .35, toneMapped: false, depthWrite: false});
      for (const x of [-.1143, .1143]) {const l = new T.Mesh(new T.PlaneGeometry(.012, 18), lineMat); l.rotation.x = -Math.PI/2; l.position.set(x, .013, -9); this.tracking.add(l);}
    }
    const progress = clamp(m.age/2.2);
    this.tracking.children.forEach((c, i) => {if (c instanceof T.Mesh && c.geometry instanceof T.TubeGeometry) {const g = c.geometry, total = g.index ? g.index.count : 0, share = i === 0 ? clamp(progress*1.6) : clamp(progress*1.6-1); g.setDrawRange(0, Math.floor(total*share/6)*6);}});
  }
  private drawOverlays(m: Match | null, phase: string) {
    const planning = !!m && phase === 'plan';
    const scatter = m ? m.bowler.scatter*(m.assist ? .8 : 1)*1.6 : .3;
    this.stadium.showTarget(planning, m?.plan.target.x ?? 0, m?.plan.target.z ?? 0, scatter);
    const zone = m && m.challenge.objective.type === 'target' ? m.challenge.objective.zone : null;
    this.stadium.zoneMarker.visible = !!zone && (phase === 'plan' || phase === 'runup' || phase === 'delivery' || phase === 'between');
    const key = m ? `${m.challenge.id}:${m.results.length}:${JSON.stringify(zone)}` : '';
    if (key !== this.dotsKey) {
      this.dotsKey = key; this.stadium.showZone(zone);
      this.stadium.setPitchDots((m?.results ?? []).slice(-12).filter(r => r.pitch).map(r => ({x: r.pitch!.x, z: r.pitch!.z, color: r.tone === 'wicket' ? '#ff4d4d' : r.tone === 'boundary' ? '#ffcf4a' : r.tone === 'runs' ? '#7fd1ff' : r.tone === 'extra' ? '#c48bff' : '#ffffff'})));
    }
    this.stadium.pitchDots.visible = planning || phase === 'between';
  }

  private screenKey = '';
  /** The stadium's big screen follows the score, with a flash for wickets and boundaries. */
  private drawBigScreen(m: Match | null, o: Outcome | null, phase: string, venue: Venue) {
    let lines = {title: venue.name.toUpperCase(), big: 'YORKER', small: 'BOWL IT FULL', accent: '#f4b63f'};
    if (m) {
      const obj = m.challenge.objective, left = Math.max(0, m.challenge.balls-m.legal);
      const small = obj.type === 'defend' ? `NEED ${Math.max(0, obj.target-m.runs)} OFF ${left}` : obj.type === 'wickets' ? `WICKETS ${m.wickets}/${obj.wickets} · ${left} BALLS` : `${left} BALLS LEFT`;
      lines = {title: m.challenge.lesson ? 'BOWLING ACADEMY' : `${TEAMS[m.challenge.team].short} · ${m.challenge.name.toUpperCase()}`, big: `${m.runs}/${m.wickets}`, small, accent: '#58aefc'};
      const show = o && (phase === 'between' || (phase === 'delivery' && m.age > (o.events.find(e => e.type === 'stumps' || e.type === 'catch' || e.type === 'boundary')?.t ?? 99)));
      if (show && o.dismissal) lines = {...lines, big: 'OUT!', small: o.title.replace('!', ''), accent: '#ef4b3c'};
      else if (show && o.runs >= 4) lines = {...lines, big: o.runs === 6 ? 'SIX!' : 'FOUR!', accent: '#f4b63f'};
    }
    const key = JSON.stringify(lines);
    if (key !== this.screenKey) {this.screenKey = key; this.stadium.drawScreen(lines);}
  }

  /* ---------- Camera ---------- */
  private camera3(m: Match | null, o: Outcome | null, phase: string, t: number, ball: T.Vector3, dt: number, reduced: boolean, replay: boolean, time: number) {
    const eye = V(), look = V(); let fov = 20, snap = false;
    const broadcast = () => {eye.set(.35, 10.5, -60); look.set(0, .45, -2.6); fov = 12.4;};
    if (!m) {const a = time*.05; eye.set(Math.sin(a)*58, 24, -10+Math.cos(a)*58); look.set(0, 0, -10); fov = 38;}
    else if (phase === 'finished') {const a = time*.08; eye.set(Math.sin(a)*24, 9, -10+Math.cos(a)*24); look.set(0, .8, -10); fov = 40;}
    else if (phase === 'plan') broadcast();
    else if (phase === 'runup') {
      const bowler = this.bowlers.get(m.bowler.kind)!, bp = bowler.outer.position, u = smooth(m.bowler.runUp-.75, m.bowler.runUp-.05, m.age);
      const chase = V(bp.x-.8, 2.6, bp.z-6.5), chaseLook = V(0, .9, -3);
      broadcast(); const tv = eye.clone(), tvLook = look.clone(); eye.lerpVectors(chase, tv, u); look.lerpVectors(chaseLook, tvLook, u); fov = 30+(12.4-30)*u;
      if (reduced) broadcast();
    } else if (phase === 'delivery' && o) {
      broadcast();
      const stop = this.stopTime(o);
      if (replay && o.stumps) {eye.set(2.4, .55, -2.2); look.set(0, .35, 0); fov = 30; snap = true;}
      else if (o.hit && t > stop+.15 && !reduced && (o.fielding && (o.fielding.kind !== 'dead' || o.runs > 0))) {
        const far = Math.hypot(ball.x, ball.z+5);
        eye.set(ball.x*.32, 13+far*.12, Math.min(-30, ball.z*.35-34)); look.copy(ball); fov = 30;
      }
    } else if (phase === 'appeal' || phase === 'review') {eye.set(1.6, 1.75, -4.2); look.set(-.2, 1.5, -20); fov = 26;}
    else if (phase === 'tracking') {eye.set(.15, 1.45, -23); look.set(0, .4, -.6); fov = 15.5; snap = this.fov > 17 && false;}
    else broadcast();
    const k = snap ? 1 : 1-Math.exp(-dt*(phase === 'delivery' ? 5 : 3.2));
    const cut = this.lastPhase !== phase && (phase === 'tracking' || phase === 'appeal' || this.lastPhase === 'tracking' || this.lastPhase === 'appeal' || this.lastPhase === 'menu' || this.lastPhase === 'finished' || this.lastPhase === '');
    if (snap || cut) {this.eye.copy(eye); this.look.copy(look); this.fov = fov;}
    else {this.eye.lerp(eye, k); this.look.lerp(look, k); this.fov += (fov-this.fov)*k;}
    this.lastPhase = phase;
    this.camera.position.copy(this.eye); this.camera.fov = this.fov; this.camera.updateProjectionMatrix(); this.camera.lookAt(this.look);
  }
  private lastPhase = '';

  /** Screen position → pitch-plane point (for dragging the target). */
  pitchPoint(nx: number, ny: number) {
    const ray = new T.Raycaster(); ray.setFromCamera(new T.Vector2(nx, ny), this.camera);
    const p = new T.Vector3(); return ray.ray.intersectPlane(new T.Plane(new T.Vector3(0, 1, 0), 0), p) ? p : null;
  }
  scoreboard(lines: {title: string; big: string; small: string; accent: string}) {this.stadium?.drawScreen(lines);}
  inspection() {return {drawCalls: this.renderer.info.render.calls, triangles: this.renderer.info.render.triangles, camera: this.camera.position.toArray(), players: [...this.batters.values()].map(p => p.inspection())};}
  dispose() {
    this.disposed = true; this.observer.disconnect(); this.stadium?.dispose();
    this.scene.traverse(o => {if (o instanceof T.Mesh) {o.geometry.dispose(); const ms = Array.isArray(o.material) ? o.material : [o.material]; ms.forEach(mat => {for (const v of Object.values(mat)) if (v instanceof T.Texture) v.dispose(); mat.dispose();});}});
    [...this.bowlers.values(), ...this.batters.values(), this.keeper, this.umpire, this.legUmpire, ...this.fielders].forEach(p => p?.dispose(true));
    if (this.assets) Object.values(this.assets.surfaces).forEach(texture => texture.dispose());
    this.renderer.dispose(); this.renderer.forceContextLoss();
  }
}

/* ---------- Field geometry shared with the engine ---------- */
type FieldSpot = ReturnType<typeof fieldPositions>[number];
function fieldLayout(kind: BowlerKind, preset: FieldPreset, hand: 'R' | 'L') {return fieldPositions(kind, preset, hand);}
const nearestTo = (field: FieldSpot[], p: V3) => field.reduce((bi, f, i) => i === 0 || f.role === 'bowler' ? bi : Math.hypot(f.x-p.x, f.z-p.z) < Math.hypot(field[bi].x-p.x, field[bi].z-p.z) ? i : bi, 1);
