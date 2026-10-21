"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent, type ButtonHTMLAttributes } from "react";
import { settleCoinReward } from "@/features/economy";
import { holdFullScreenMoment } from "@/shared/hooks";
import type { GameEntry } from "@/mocks/games";
import type { GameId } from "../../types";
import { GameLandingAd } from "../../shared/components/game-landing-ad";
import { useGameReturn } from "../../shared/hooks/use-game-return";
import { initializePhysics, ShootoutSimulation } from "../engine/simulation";
import { ShootoutInput } from "../input";
import { ShootoutAudio } from "../audio";
import { ShootoutScene } from "../rendering/scene";
import { levelFromXp, readShootoutProgress, recordShootout, useShootoutProgress } from "../state/shootout-progress";
import { RUNTIME_VERSION, STEP, type Frame, type Mode, type Settings, type Snapshot, type Style } from "../game-types";
import styles from "./shootout-3d.module.css";

export type PenaltyShootoutProps = { game: GameId; entry: GameEntry };
type Runtime = { simulation: ShootoutSimulation; scene: ShootoutScene; input: ShootoutInput; audio: ShootoutAudio; active: boolean; recorded: boolean; paused: boolean; sessionId: string; accumulator: number; previous: Frame | null };
const defaults: Settings = { effects: 0.65, crowd: 0.45, muted: false, reducedMotion: false };
const settingsKey = "statoz.games.web.shootout.settings.v1";
const outcomes = { goal: "GOAL", saved: "SAVED", wide: "WIDE", over: "OVER THE BAR", woodwork: "OFF THE FRAME" };
function loadSettings(): Settings { try { const s = JSON.parse(localStorage.getItem(settingsKey) ?? "null"); return { effects: typeof s?.effects === "number" ? Math.max(0, Math.min(1, s.effects)) : defaults.effects, crowd: typeof s?.crowd === "number" ? Math.max(0, Math.min(1, s.crowd)) : defaults.crowd, muted: !!s?.muted, reducedMotion: !!s?.reducedMotion }; } catch { return defaults; } }

export function PenaltyShootout({ entry }: PenaltyShootoutProps) {
  const host = useRef<HTMLDivElement>(null), runtime = useRef<Runtime | null>(null), settingsRef = useRef(defaults), progress = useShootoutProgress(), goBack = useGameReturn();
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null), [ready, setReady] = useState(false), [error, setError] = useState(""), [retry, setRetry] = useState(0);
  const [screen, setScreen] = useState<"lobby" | "playing">("lobby"), [paused, setPaused] = useState(false), [contextLost, setContextLost] = useState(false);
  const [dialog, setDialog] = useState<"help" | "history" | "settings" | "quit" | null>(null), [settings, setSettings] = useState(() => { const loaded = loadSettings(); if (typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches) loaded.reducedMotion = true; return loaded; }), [practiceLevel, setPracticeLevel] = useState(6), [award, setAward] = useState(0);
  const previousFocus = useRef<HTMLElement | null>(null), modal = useRef<HTMLDivElement>(null);
  // The game owns its result moment; shared streak celebrations wait for the lobby.
  useEffect(() => screen === "playing" ? holdFullScreenMoment() : undefined, [screen]);
  const pause = useCallback(() => {
    const rt = runtime.current; if (!rt?.active) return;
    rt.paused = true; rt.accumulator = 0; rt.input.setPaused(true); rt.simulation.cancelInput(); rt.audio.pause(); setPaused(true);
  }, []);
  useEffect(() => {
    if (!host.current) return;
    let cancelled = false, scene: ShootoutScene | null = null, input: ShootoutInput | null = null, audio: ShootoutAudio | null = null, simulation: ShootoutSimulation | null = null;
    let raf = 0, last = performance.now(), hud = 0;
    const visibility = () => { if (document.hidden) pause(); };
    document.addEventListener("visibilitychange", visibility);
    const initialize = async () => {
      try {
        await initializePhysics(); if (cancelled || !host.current) return;
        scene = new ShootoutScene(host.current, () => { setContextLost(true); pause(); }, () => { setContextLost(false); pause(); });
        await scene.load(); if (cancelled) { scene.dispose(); return; }
        simulation = new ShootoutSimulation("shootout", levelFromXp(readShootoutProgress().xp), 202614);
        input = new ShootoutInput(pause); audio = new ShootoutAudio(settingsRef.current);
        const rt: Runtime = { simulation, scene, input, audio, active: false, recorded: false, paused: false, sessionId: "preview", accumulator: 0, previous: null };
        runtime.current = rt; setSnapshot(simulation.snapshot()); setReady(true);
        const draw = (now: number) => {
          if (cancelled) return;
          const dt = Math.min(0.05, Math.max(0, (now - last) / 1000)); last = now;
          if (rt.active && !rt.paused) {
            rt.accumulator += dt;
            while (rt.accumulator >= STEP) {
              rt.previous = rt.simulation.frame(); rt.input.setRole(rt.simulation.role); rt.simulation.step(rt.input.sample()); rt.accumulator -= STEP;
            }
            rt.audio.events(rt.simulation.consumeEvents());
          }
          const current = rt.simulation.snapshot();
          rt.scene.render(rt.simulation.frame(), rt.previous, rt.accumulator / STEP, current, settingsRef.current.reducedMotion);
          if (now - hud > 50) { hud = now; setSnapshot(current); }
          raf = requestAnimationFrame(draw);
        };
        raf = requestAnimationFrame(draw);
      } catch (cause) { if (!cancelled) { setError(cause instanceof Error ? cause.message : "Could not load the pitch"); setReady(false); } }
    };
    void initialize();
    return () => { cancelled = true; cancelAnimationFrame(raf); document.removeEventListener("visibilitychange", visibility); input?.dispose(); audio?.dispose(); scene?.dispose(); runtime.current?.simulation.dispose(); if (!runtime.current && simulation) simulation.dispose(); runtime.current = null; };
  }, [pause, retry]);
  useEffect(() => {
    settingsRef.current = settings; runtime.current?.audio.configure(settings);
    try { localStorage.setItem(settingsKey, JSON.stringify(settings)); } catch { /* Settings remain usable in memory. */ }
  }, [settings]);
  useEffect(() => {
    const rt = runtime.current;
    if (!rt?.active || rt.recorded || snapshot?.mode !== "shootout" || !snapshot.winner) return;
    rt.recorded = true;
    const gained = recordShootout({ sessionId: rt.sessionId, runtimeVersion: RUNTIME_VERSION, won: snapshot.winner === "player", margin: Math.abs(snapshot.score[0] - snapshot.score[1]), playerScore: snapshot.score[0], opponentScore: snapshot.score[1], opponentName: "Rival FC", suddenDeath: snapshot.suddenDeath });
    settleCoinReward({ id: rt.sessionId, coins: snapshot.winner === "player" ? 50 : 10, title: "PENALTY SHOOTOUT", subtitle: snapshot.winner === "player" ? "WIN" : "LOSS" });
    if (gained > 0) setAward(gained);
  }, [snapshot]);
  useEffect(() => {
    if (!dialog && !paused && snapshot?.phase !== "summary") return;
    previousFocus.current = document.activeElement as HTMLElement;
    const node = modal.current; const first = node?.querySelector<HTMLElement>("button,input,select,[tabindex='0']"); first?.focus();
    const trap = (event: KeyboardEvent) => {
      if (event.key !== "Tab" || !node) return;
      const controls = Array.from(node.querySelectorAll<HTMLElement>("button:not(:disabled),input,select,[tabindex='0']")); const a = controls[0], b = controls.at(-1);
      if (event.shiftKey && document.activeElement === a) { event.preventDefault(); b?.focus(); } else if (!event.shiftKey && document.activeElement === b) { event.preventDefault(); a?.focus(); }
    };
    document.addEventListener("keydown", trap); return () => { document.removeEventListener("keydown", trap); previousFocus.current?.focus(); };
  }, [dialog, paused, snapshot?.phase]);
  const start = (mode: Mode) => {
    const rt = runtime.current; if (!rt || !ready) return;
    rt.audio.unlock(); rt.audio.reset(); rt.simulation.dispose();
    const id = crypto.randomUUID(); rt.sessionId = `shootout-${id}`;
    const seed = new Uint32Array(1); crypto.getRandomValues(seed);
    rt.simulation = new ShootoutSimulation(mode, mode === "shootout" ? levelFromXp(readShootoutProgress().xp) : practiceLevel, seed[0]);
    rt.active = true; rt.recorded = false; rt.paused = false; rt.previous = null; rt.accumulator = 0; rt.input.setPaused(false); rt.input.setRole(rt.simulation.role); rt.input.style = "driven";
    setAward(0); setPaused(false); setDialog(null); setSnapshot(rt.simulation.snapshot()); setScreen("playing");
  };
  const resume = () => { const rt = runtime.current; if (!rt || contextLost) return; rt.input.setPaused(false); rt.audio.unlock(); rt.paused = false; rt.accumulator = 0; setDialog(null); setPaused(false); };
  const home = () => { const rt = runtime.current; if (rt) { rt.active = false; rt.paused = false; rt.input.clear(); rt.audio.pause(); } setPaused(false); setDialog(null); setScreen("lobby"); };
  const show = (name: typeof dialog) => { if (screen === "playing") pause(); setDialog(name); };
  const next = () => { runtime.current?.input.clear(); runtime.current?.simulation.next(); if (runtime.current) { runtime.current.input.setRole(runtime.current.simulation.role); runtime.current.previous = null; setSnapshot(runtime.current.simulation.snapshot()); } };
  const changeStyle = (style: Style) => { if (runtime.current) runtime.current.input.style = style; };
  const s = snapshot, result = s?.result, taking = s?.role === "shooting", inResult = s?.phase === "resolution" || s?.phase === "replay", inSummary = s?.phase === "summary";
  const good = result && (result.role === "shooting" ? result.outcome === "goal" : result.outcome !== "goal");
  const stateStyle = { "--composure-position": `${(s?.marker ?? 0.5) * 100}%`, "--power": `${(s?.power ?? 0) * 100}%` } as CSSProperties;
  return (
    <div className={`${styles.game} ${screen === "lobby" ? styles.lobby : ""}`} style={stateStyle} data-shootout-phase={s?.phase ?? "loading"} data-shootout-role={s?.role ?? "shooting"}>
      <div className={styles.canvas} ref={host} />
      <header className={styles.header}>
        <button className={styles.back} onClick={screen === "lobby" ? goBack : () => { pause(); setDialog("quit"); }} aria-label={screen === "lobby" ? "Back to games" : "Leave shootout"}>‹</button>
        <div className={styles.brand}>PENALTY<small>SHOOTOUT / FOOTBALL</small></div>
        <div className={styles.headerRight}><span className={styles.liveTag}>{screen === "lobby" ? "MATCHDAY / 3D" : s?.mode === "shootout" ? "SHOOTOUT" : "TRAINING"}</span><button className={styles.iconButton} aria-label={settings.muted ? "Unmute audio" : "Mute audio"} onClick={() => setSettings(v => ({ ...v, muted: !v.muted }))}>{settings.muted ? "SOUND OFF" : "SOUND ON"}</button>{screen === "playing" && !inSummary && <button className={styles.iconButton} onClick={pause} aria-label="Pause game">Ⅱ</button>}</div>
      </header>

      {screen === "lobby" ? <>
        <div className={styles.lobbyShade} />
        <main className={styles.lobbyContent}>
          <p className={styles.eyebrow}>MATCHDAY / PENALTIES</p><h1>PENALTY<br /><span>SHOOTOUT</span></h1><p className={styles.intro}>A moment of composure.<br />Eleven metres. Everything to play for.</p>
          <div className={styles.stats}><div><strong>{levelFromXp(progress.xp)}</strong><span>LEVEL</span></div><div><strong>{progress.wins}</strong><span>WINS</span></div><div><strong>{progress.xp}</strong><span>MODE XP</span></div></div>
          <div className={styles.playButton}><Button size="lg" fullWidth glow onClick={() => start("shootout")} disabled={!ready}>{ready ? "PLAY SHOOTOUT  →" : error ? "PITCH UNAVAILABLE" : "PREPARING THE PITCH…"}</Button></div>
          <div className={styles.practice}><span>TRAINING / NO REWARDS</span><select aria-label="Training difficulty" value={practiceLevel} onChange={e => setPracticeLevel(Number(e.target.value))}><option value={1}>ROOKIE</option><option value={6}>REGULAR</option><option value={12}>EXPERT</option></select></div>
          <div className={styles.twoButtons}><Button variant="surface" disabled={!ready} onClick={() => start("shooting")}>PRACTICE SHOTS</Button><Button variant="surface" disabled={!ready} onClick={() => start("keeping")}>PRACTICE SAVES</Button></div>
          <nav className={styles.links}><button onClick={() => show("help")}>HOW TO PLAY</button><button onClick={() => show("history")}>HISTORY</button><button onClick={() => show("settings")}>SETTINGS</button></nav>
          <p className={styles.inputHint}>TOUCH · KEYBOARD · GAMEPAD</p>
        </main>
        <div className={styles.pitchLabel}><span>MATCHDAY GROUND</span><small>ORIGINAL TEAMS · EQUAL ATTRIBUTES</small></div>
        <GameLandingAd />
      </> : s && <>
        <div className={styles.matchTop}><div className={styles.scoreboard}><Team name="STATOZ FC" kicks={s.kicks.filter(k => k.role === "shooting")} /><strong>{s.score[0]}<span>:</span>{s.score[1]}</strong><Team name="RIVAL FC" kicks={s.kicks.filter(k => k.role === "keeping")} /></div><span className={styles.round}>{s.mode !== "shootout" ? "TRAINING · NO REWARDS" : s.suddenDeath ? "SUDDEN DEATH" : `KICK ${Math.min(5, Math.floor(s.kicks.length / 2) + 1)} / 5`}</span></div>
        {!inSummary && !paused && <div className={styles.playerStrips}><div><b>01</b><span>GOALKEEPER<small>{taking ? "RIVAL FC" : "STATOZ FC"}</small></span></div><div><span>STRIKER<small>{taking ? "STATOZ FC" : "RIVAL FC"}</small></span><b>09</b></div></div>}
        {!inSummary && !paused && <div className={styles.roleLabel}><span>{taking ? "YOUR PENALTY" : "YOU’RE IN GOAL"}</span><small>{s.notice}</small></div>}
        {!paused && !inSummary && <div className={styles.controls}>
          {inResult ? <div className={styles.resultBar}>
            <div><span className={styles.eyebrow}>{s.phase === "replay" ? "REPLAY" : good ? "YOUR MOMENT" : "NEXT ONE COUNTS"}</span><h2 data-good={good}>{result ? outcomes[result.outcome] : ""}</h2>{result && <p>{result.style.toUpperCase()} · {Math.round(result.power * 100)}% POWER{result.contacts.includes("frame") ? " · FRAME CONTACT" : ""}</p>}</div>
            <div className={styles.resultActions}>{s.phase !== "replay" && <Button variant="surface" onClick={() => runtime.current?.simulation.replay()}>REPLAY</Button>}<Button onClick={next}>{s.phase === "replay" ? "SKIP REPLAY" : s.winner ? "VIEW RESULT" : s.mode === "shootout" ? "NEXT PENALTY →" : "TRY AGAIN →"}</Button></div>
          </div> : <>
            <div className={styles.meterArea}>{taking ? <><div className={styles.meterLabel}><span>{s.phase === "preparation" ? "COMPOSURE" : "SHOT POWER"}</span><strong>{s.phase === "preparation" ? "PRESS IN THE GREEN" : `${Math.round(s.power * 100)}%`}</strong></div>{s.phase === "preparation" ? <div className={styles.composure}><i /><b /></div> : <div className={styles.power}><i /></div>}<div className={styles.styleRow}>{(["driven", "placed", "chip"] as Style[]).map(style => <button key={style} aria-pressed={s.style === style} onClick={() => changeStyle(style)} disabled={s.phase !== "preparation"}>{style.toUpperCase()}</button>)}</div></> : <div className={styles.keeperHint}><strong>GOALKEEPER CONTROLS</strong><span>Left stick to position · right pad to dive<br />Early commitment reaches farther.</span></div>}</div>
            <div className={styles.touchRow}><AimStick onAim={(x, y) => runtime.current?.input.aim(x, y)} disabled={false} label={taking ? "AIM" : "MOVE"} />{taking ? <button className={styles.shootButton} disabled={s.phase !== "preparation" && s.phase !== "charging"} onPointerDown={e => { e.preventDefault(); e.currentTarget.setPointerCapture(e.pointerId); runtime.current?.input.shoot(true); }} onPointerUp={() => runtime.current?.input.shoot(false)} onPointerCancel={() => { runtime.current?.input.clear(); runtime.current?.simulation.cancelInput(); }} onLostPointerCapture={() => runtime.current?.input.shoot(false)} aria-label="Hold to charge shot">{s.phase === "charging" ? "RELEASE" : "SHOOT"}<small>HOLD TO CHARGE</small></button> : <DivePad onDive={(x, y) => runtime.current?.input.dive(x, y)} />}</div>
            <p className={styles.keyboardHint}>{taking ? "WASD AIM · HOLD SPACE · 1 / 2 / 3 SHOT STYLE" : "A / D MOVE · ARROWS DIVE · SPACE HOLD CENTRE"}</p>
          </>}
        </div>}
      </>}

      {error && <div className={styles.error} role="alert"><strong>THE PITCH COULDN’T LOAD</strong><p>{error}</p><Button onClick={() => { setError(""); setReady(false); setRetry(v => v + 1); }}>RETRY</Button><Button variant="ghost" onClick={goBack}>BACK TO GAMES</Button></div>}
      {(dialog || paused || inSummary) && <div className={styles.scrim}><section ref={modal} className={styles.modal} role="dialog" aria-modal="true" aria-label={inSummary ? "Shootout result" : dialog ?? "Game paused"}>
        {inSummary && s ? <><p className={styles.eyebrow}>FULL TIME / PENALTIES</p><h2>{s.winner === "player" ? "NERVES OF STEEL." : "BACK TO THE SPOT."}</h2><div className={styles.finalScore}>{s.score[0]} <span>:</span> {s.score[1]}</div><p>{s.winner === "player" ? "SHOOTOUT WON" : "RIVAL FC WINS"}{s.suddenDeath ? " · SUDDEN DEATH" : ""}</p><div className={styles.reward}>{s.winner === "player" ? "+50" : "+10"} COINS {award ? ` / +${award} XP` : ""}</div><Button fullWidth onClick={() => start("shootout")}>PLAY AGAIN</Button><Button fullWidth variant="ghost" onClick={home}>BACK TO LOBBY</Button></>
        : dialog === "help" ? <><p className={styles.eyebrow}>THE SPOT / FIELD GUIDE</p><h2>MAKE IT COUNT.</h2><ol className={styles.instructions}><li><strong>Find your composure.</strong> Press Shoot as the marker passes through the green centre.</li><li><strong>Charge, then release.</strong> Hold Shoot for power. Very high power sacrifices accuracy.</li><li><strong>Pick your corner.</strong> Use the aim stick during charging and run-up. Holding too far can send the ball wide.</li><li><strong>Mix your finish.</strong> Driven is fast, Placed favours accuracy, Chip lifts over a committed keeper.</li><li><strong>Be the last line.</strong> Move on the line; dive with the right pad. Commit early for reach or react to a slower shot.</li></ol><p className={styles.fine}>Five penalties each, then sudden-death pairs. Training never awards coins or XP. Fictional teams have equal attributes.</p><Button fullWidth onClick={() => { setDialog(null); if (paused) resume(); }}>GOT IT</Button></>
        : dialog === "history" ? <><p className={styles.eyebrow}>YOUR RECORD</p><h2>FROM THE SPOT.</h2><div className={styles.history}>{progress.history.length ? progress.history.map(record => <div key={record.id}><span>{record.playerScore > record.opponentScore ? "WIN" : "LOSS"}<small>{new Date(record.playedAt).toLocaleDateString()}</small></span><strong>{record.playerScore} : {record.opponentScore}</strong><span>{record.opponentName}<small>{record.runtimeVersion ? "SKILL SHOOTOUT" : "PREVIOUS VERSION"}</small></span></div>) : <p>Your first shootout starts here.</p>}</div><Button fullWidth onClick={() => setDialog(null)}>CLOSE</Button></>
        : dialog === "quit" ? <><p className={styles.eyebrow}>LEAVE THE PITCH?</p><h2>QUIT SHOOTOUT?</h2><p>An unfinished shootout won’t earn rewards. Your previous results stay saved.</p><Button fullWidth onClick={resume}>KEEP PLAYING</Button><Button fullWidth variant="ghost" onClick={home}>QUIT TO LOBBY</Button></>
        : <><p className={styles.eyebrow}>{contextLost ? "GRAPHICS INTERRUPTED" : paused ? "TAKE A BREATH" : "MAKE IT YOURS"}</p><h2>{paused ? "GAME PAUSED." : "SETTINGS."}</h2>{contextLost && <p>Waiting for the graphics context to recover. Your kick is paused.</p>}<label className={styles.setting}>EFFECTS <input aria-label="Effects volume" type="range" min="0" max="1" step="0.05" value={settings.effects} onChange={e => setSettings(v => ({ ...v, effects: Number(e.target.value) }))} /></label><label className={styles.setting}>CROWD <input aria-label="Crowd volume" type="range" min="0" max="1" step="0.05" value={settings.crowd} onChange={e => setSettings(v => ({ ...v, crowd: Number(e.target.value) }))} /></label><label className={styles.setting}>MUTE AUDIO <input type="checkbox" checked={settings.muted} onChange={e => setSettings(v => ({ ...v, muted: e.target.checked }))} /></label><label className={styles.setting}>REDUCED MOTION <input type="checkbox" checked={settings.reducedMotion} onChange={e => setSettings(v => ({ ...v, reducedMotion: e.target.checked }))} /></label><Button fullWidth disabled={contextLost} onClick={paused ? resume : () => setDialog(null)}>{paused ? "RESUME PLAY" : "DONE"}</Button>{paused && <Button fullWidth variant="ghost" onClick={() => setDialog("quit")}>QUIT SHOOTOUT</Button>}<p className={styles.fine}>Original sound effects. Stadium Crowd by stomachache, CC0. Character foundation: Blender Studio, CC0. Original StatOz adaptation.</p></>}
      </section></div>}
      <span className={styles.srOnly} aria-live="polite">{inResult && result ? `${outcomes[result.outcome]}. StatOz ${s?.score[0]}, Rival ${s?.score[1]}.` : s?.notice}</span>
      <span hidden>{entry.title}</span>
    </div>
  );
}

function Team({ name, kicks }: { name: string; kicks: Snapshot["kicks"] }) { return <div className={styles.team}><span>{name}</span><div aria-label={`${name} kick history`}>{Array.from({ length: 5 }, (_, i) => <i key={i} data-outcome={kicks.slice(-5)[i]?.outcome}>{kicks.slice(-5)[i] ? kicks.slice(-5)[i].outcome === "goal" ? "●" : "×" : "○"}</i>)}</div></div>; }
function AimStick({ onAim, label, disabled }: { onAim: (x: number, y: number) => void; label: string; disabled: boolean }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const move = (e: PointerEvent<HTMLDivElement>) => { if (!e.currentTarget.hasPointerCapture(e.pointerId)) return; const r = e.currentTarget.getBoundingClientRect(), x = (e.clientX - r.left - r.width / 2) / (r.width * 0.35), y = (r.height / 2 - (e.clientY - r.top)) / (r.height * 0.35), length = Math.max(1, Math.hypot(x, y)); const p = { x: x / length, y: y / length }; setPosition(p); onAim(p.x, p.y); };
  const reset = () => { setPosition({ x: 0, y: 0 }); onAim(0, 0); };
  return <div className={styles.stickWrap}><div className={styles.stick} role="group" aria-label={`${label} virtual stick`} onPointerDown={e => { if (disabled) return; e.preventDefault(); e.currentTarget.setPointerCapture(e.pointerId); move(e); }} onPointerMove={move} onPointerUp={reset} onPointerCancel={reset} onLostPointerCapture={reset}><span /><i style={{ transform: `translate(${position.x * 30}px, ${-position.y * 30}px)` }} /></div><small>{label}</small></div>;
}
function DivePad({ onDive }: { onDive: (x: number, y: number) => void }) { return <div className={styles.divePad} aria-label="Goalkeeper dive controls">{[[ -1, 1, "↖" ],[0,1,"↑"],[1,1,"↗"],[-1,0,"←"],[0,0,"HOLD"],[1,0,"→"],[-1,-1,"↙"],[0,-1,"↓"],[1,-1,"↘"]].map(([x,y,label]) => <button key={`${x}:${y}`} onPointerDown={e => { e.preventDefault(); onDive(Number(x), Number(y)); }} aria-label={x === 0 && y === 0 ? "Hold centre" : `Dive ${Number(x) < 0 ? "left" : Number(x) > 0 ? "right" : "centre"} ${Number(y) > 0 ? "high" : Number(y) < 0 ? "low" : "middle"}`}>{label}</button>)}</div>; }

function Button({ fullWidth, variant, size, glow, className, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { fullWidth?: boolean; variant?: "surface" | "ghost"; size?: "lg" | "md" | "sm"; glow?: boolean }) {
  return <button type="button" className={className ? styles.gameButton + " " + className : styles.gameButton} data-wide={fullWidth || undefined} data-variant={variant ?? "primary"} data-size={size} data-primary={glow || undefined} {...props} />;
}
