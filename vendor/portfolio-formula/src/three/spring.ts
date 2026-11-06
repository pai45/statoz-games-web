/**
 * Critically damped spring (the smoothing behind Unity's SmoothDamp): it
 * eases out of rest, settles without overshooting and carries its velocity
 * through a change of target, so nothing starts or stops with a jolt.
 */
export class Spring {
  velocity = 0

  constructor(public value = 0) {}

  /** Jump straight to a value, at rest. */
  set(value: number) {
    this.value = value
    this.velocity = 0
    return value
  }

  /** Advance towards `target`; `smoothTime` is roughly the time to get there. */
  step(target: number, smoothTime: number, dt: number) {
    const omega = 2 / Math.max(1e-4, smoothTime)
    const x = omega * dt
    const decay = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x)
    const change = this.value - target
    const push = (this.velocity + omega * change) * dt
    this.velocity = (this.velocity - omega * push) * decay
    let next = target + (change + push) * decay
    const rising = target > this.value
    if (rising === next > target) {
      // arrived (or would overshoot): settle on the target
      next = target
      this.velocity = 0
    }
    this.value = next
    return next
  }
}
