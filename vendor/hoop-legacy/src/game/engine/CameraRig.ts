import * as THREE from 'three'

/** Smoothed broadcast-style camera with trauma-based shake. */
export class CameraRig {
  camera: THREE.PerspectiveCamera
  pos = new THREE.Vector3(0, 8, 22)
  look = new THREE.Vector3(0, 1.5, 4)
  targetPos = new THREE.Vector3(0, 8, 22)
  targetLook = new THREE.Vector3(0, 1.5, 4)
  fov = 42
  targetFov = 42
  posLag = 3.2
  lookLag = 5
  trauma = 0
  shakeEnabled = true
  private t = 0
  private tmp = new THREE.Vector3()

  constructor(camera: THREE.PerspectiveCamera) {
    this.camera = camera
  }

  set(pos: THREE.Vector3, look: THREE.Vector3, instant = false) {
    this.targetPos.copy(pos)
    this.targetLook.copy(look)
    if (instant) {
      this.pos.copy(pos)
      this.look.copy(look)
    }
  }

  addTrauma(a: number) {
    if (!this.shakeEnabled) return
    this.trauma = Math.min(1, this.trauma + a)
  }

  update(dt: number) {
    this.t += dt
    const kp = 1 - Math.exp(-this.posLag * dt)
    const kl = 1 - Math.exp(-this.lookLag * dt)
    this.pos.lerp(this.targetPos, kp)
    this.look.lerp(this.targetLook, kl)
    this.fov += (this.targetFov - this.fov) * (1 - Math.exp(-4 * dt))
    this.camera.position.copy(this.pos)
    this.trauma = Math.max(0, this.trauma - dt * 1.4)
    const s = this.trauma * this.trauma
    if (s > 0) {
      this.camera.position.x += Math.sin(this.t * 37) * 0.18 * s
      this.camera.position.y += Math.sin(this.t * 41 + 1.3) * 0.14 * s
    }
    this.tmp.copy(this.look)
    if (s > 0) this.tmp.y += Math.sin(this.t * 29 + 0.7) * 0.08 * s
    this.camera.lookAt(this.tmp)
    if (Math.abs(this.camera.fov - this.fov) > 0.01) {
      this.camera.fov = this.fov
      this.camera.updateProjectionMatrix()
    }
  }
}
