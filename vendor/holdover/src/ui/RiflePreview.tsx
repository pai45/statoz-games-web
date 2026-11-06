// Turntable render of the selected rifle and camouflage for the Armory and briefings.
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'

import type { CamoSpec, RifleSpec } from '../game/data.ts'
import { buildRifleModel, type RifleModel } from '../game/rifle.ts'

interface PreviewState {
  renderer: THREE.WebGLRenderer
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
  pivot: THREE.Group
  model: RifleModel | null
  drag: number
  velocity: number
}

export function RiflePreview({ rifle, camo, height = 260 }: { rifle: RifleSpec; camo: CamoSpec; height?: number }) {
  const hostRef = useRef<HTMLDivElement>(null)
  const stateRef = useRef<PreviewState | null>(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    } catch {
      return
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.05
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    host.appendChild(renderer.domElement)
    const scene = new THREE.Scene()
    const pmrem = new THREE.PMREMGenerator(renderer)
    const environment = new RoomEnvironment()
    scene.environment = pmrem.fromScene(environment, 0.04).texture
    scene.environmentIntensity = 0.55
    const key = new THREE.DirectionalLight('#fff1dc', 2.4)
    key.position.set(1.5, 2.2, 2.5)
    const rim = new THREE.DirectionalLight('#9fc2ff', 1.6)
    rim.position.set(-2, 1, -2.5)
    scene.add(key, rim, new THREE.HemisphereLight('#d9dde0', '#2a2420', 0.6))
    const camera = new THREE.PerspectiveCamera(26, 1, 0.05, 20)
    camera.position.set(0, 0.32, 2.75)
    camera.lookAt(0, 0.02, 0)
    const pivot = new THREE.Group()
    scene.add(pivot)
    const state: PreviewState = { renderer, scene, camera, pivot, model: null, drag: 0, velocity: 0 }
    stateRef.current = state
    const resize = () => {
      const rect = host.getBoundingClientRect()
      renderer.setSize(Math.max(1, rect.width), Math.max(1, rect.height), false)
      camera.aspect = Math.max(1, rect.width) / Math.max(1, rect.height)
      camera.updateProjectionMatrix()
    }
    const observer = new ResizeObserver(resize)
    observer.observe(host)
    resize()
    let dragging = false
    let lastX = 0
    const down = (event: PointerEvent) => {
      dragging = true
      lastX = event.clientX
      host.setPointerCapture(event.pointerId)
    }
    const move = (event: PointerEvent) => {
      if (!dragging) return
      state.velocity = (event.clientX - lastX) * 0.01
      state.drag += state.velocity
      lastX = event.clientX
    }
    const up = () => {
      dragging = false
    }
    host.addEventListener('pointerdown', down)
    host.addEventListener('pointermove', move)
    host.addEventListener('pointerup', up)
    const timer = new THREE.Timer()
    renderer.setAnimationLoop(() => {
      timer.update()
      const dt = Math.min(0.05, timer.getDelta())
      const t = timer.getElapsed()
      if (!dragging) {
        state.velocity *= Math.exp(-dt * 3)
        state.drag += state.velocity
      }
      pivot.rotation.y = -Math.PI / 2 + Math.sin(t * 0.35) * 0.45 + state.drag
      pivot.rotation.z = Math.sin(t * 0.5) * 0.03
      renderer.render(scene, camera)
    })
    return () => {
      renderer.setAnimationLoop(null)
      observer.disconnect()
      host.removeEventListener('pointerdown', down)
      host.removeEventListener('pointermove', move)
      host.removeEventListener('pointerup', up)
      state.model?.dispose()
      pmrem.dispose()
      environment.dispose()
      renderer.dispose()
      renderer.domElement.remove()
      stateRef.current = null
    }
  }, [])

  useEffect(() => {
    const state = stateRef.current
    if (!state) return
    if (state.model) {
      state.pivot.remove(state.model.root)
      state.model.dispose()
    }
    const model = buildRifleModel(rifle, camo, false)
    const box = new THREE.Box3().setFromObject(model.root)
    const center = box.getCenter(new THREE.Vector3())
    model.root.position.sub(center)
    const length = box.getSize(new THREE.Vector3()).z
    state.pivot.scale.setScalar(1.25 / Math.max(0.8, length))
    state.pivot.add(model.root)
    state.model = model
  }, [rifle, camo])

  return <div ref={hostRef} className="relative w-full cursor-grab active:cursor-grabbing" style={{ height }} />
}
