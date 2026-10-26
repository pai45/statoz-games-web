import { emptyInput, type InputFrame, type Role, type Style } from "./game-types";

/** Keyboard, gamepad and pointer controls converge here. No device mutates rules. */
export class ShootoutInput {
  private keys = new Set<string>();
  private touch = { x: 0, y: 0, shoot: false };
  private queuedDive: InputFrame["dive"] = null;
  style: Style = "driven";
  private previousPad = false;
  private previousPause = false;
  private paused = false;
  private role: Role = "shooting";
  private pauseCallback: () => void;
  private lastPadId: string | null = null;
  private onKeyDown = (event: KeyboardEvent) => {
    if ((event.target as HTMLElement)?.closest("input,textarea,select,[role='dialog']")) return;
    if (["Space", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.code)) event.preventDefault();
    if (event.code === "Escape" && !event.repeat) { this.clear(); this.pauseCallback(); return; }
    if (this.paused) return;
    this.keys.add(event.code);
    if (event.code === "Digit1") this.style = "driven";
    if (event.code === "Digit2") this.style = "placed";
    if (event.code === "Digit3") this.style = "chip";
    if (this.role === "keeping" && !event.repeat && ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Space"].includes(event.code)) {
      this.queuedDive = event.code === "Space" ? { x: 0, y: 0 } : { x: Number(this.keys.has("ArrowRight")) - Number(this.keys.has("ArrowLeft")), y: Number(this.keys.has("ArrowUp")) - Number(this.keys.has("ArrowDown")) };
    }
  };
  private onKeyUp = (event: KeyboardEvent) => { this.keys.delete(event.code); };
  private onBlur = () => { this.clear(); this.pauseCallback(); };
  private onDisconnected = () => { this.clear(); this.lastPadId = null; this.pauseCallback(); };
  constructor(pause: () => void) { this.pauseCallback = pause; window.addEventListener("keydown", this.onKeyDown); window.addEventListener("keyup", this.onKeyUp); window.addEventListener("blur", this.onBlur); window.addEventListener("gamepaddisconnected", this.onDisconnected); }
  setRole(role: Role) { if (role !== this.role) this.clear(); this.role = role; }
  setPaused(paused: boolean) { this.paused = paused; this.clear(); }
  aim(x: number, y: number) { this.touch.x = x; this.touch.y = y; }
  shoot(held: boolean) { this.touch.shoot = held; }
  dive(x: number, y: number) { this.queuedDive = { x, y }; }
  clear() { this.keys.clear(); this.touch = { x: 0, y: 0, shoot: false }; this.queuedDive = null; }
  sample(): InputFrame {
    if (this.paused) return emptyInput();
    let x = this.touch.x + Number(this.keys.has("KeyD")) - Number(this.keys.has("KeyA"));
    let y = this.touch.y + Number(this.keys.has("KeyW")) - Number(this.keys.has("KeyS"));
    let shoot = this.touch.shoot || this.keys.has("Space") && this.role === "shooting";
    const pad = Array.from(navigator.getGamepads?.() ?? []).find(p => p?.connected && p.mapping === "standard");
    if (pad) {
      this.lastPadId = pad.id;
      const axis = (n: number) => Math.abs(pad.axes[n] ?? 0) > 0.18 ? pad.axes[n] : 0;
      x += axis(0); y -= axis(1); shoot ||= !!pad.buttons[1]?.pressed;
      if (pad.buttons[4]?.pressed) this.style = "chip"; else if (pad.buttons[5]?.pressed) this.style = "placed";
      // Release both style modifiers to return to the standard driven shot.
      else if (pad.buttons[1]?.pressed) this.style = "driven";
      const dx = axis(2), dy = -axis(3), diving = Math.hypot(dx, dy) > 0.45 || !!pad.buttons[0]?.pressed;
      if (diving && !this.previousPad && this.role === "keeping") this.queuedDive = pad.buttons[0]?.pressed ? { x: 0, y: 0 } : { x: dx, y: dy };
      this.previousPad = diving;
      const pause = !!pad.buttons[9]?.pressed;
      if (pause && !this.previousPause) { this.clear(); this.pauseCallback(); }
      this.previousPause = pause;
    } else if (this.lastPadId) { this.onDisconnected(); }
    const dive = this.queuedDive; this.queuedDive = null;
    // The simulation retains its original behind-keeper command convention.
    // Imported front-facing sprites use the striker-side camera in both roles.
    const horizontal = this.role === "keeping" ? -1 : 1;
    return { x: horizontal * Math.max(-1, Math.min(1, x)), y: Math.max(-1, Math.min(1, y)), shoot, dive: dive ? { x: dive.x * horizontal, y: dive.y } : null, style: this.style, pause: false };
  }
  dispose() { this.clear(); window.removeEventListener("keydown", this.onKeyDown); window.removeEventListener("keyup", this.onKeyUp); window.removeEventListener("blur", this.onBlur); window.removeEventListener("gamepaddisconnected", this.onDisconnected); }
}
