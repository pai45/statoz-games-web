export type QualityLevel = 'low' | 'medium' | 'high'
export type QualitySetting = 'auto' | QualityLevel

export interface QualitySettings {
  level: QualityLevel
  pixelRatio: number
  shadows: boolean
  shadowMapSize: number
  crowdDensity: number
  bloom: boolean
  clearcoat: boolean
  /** Post stack (HDR render target, tone mapping, broadcast grade, vignette, dither). */
  post: boolean
  /** Ground-truth ambient occlusion reconstructed from the depth buffer. */
  ao: boolean
  /** Mirrored floor pass: 0 off, 1 lite (athletes, ball, hoops, LED boards), 2 full scene. */
  reflections: 0 | 1 | 2
}

export function isTouchDevice() {
  if (typeof window === 'undefined') return false
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || window.matchMedia?.('(pointer: coarse)').matches
}

/** Phones and tablets (the primary pointer is a finger), as opposed to touch-screen laptops. */
export function isHandheld() {
  if (typeof window === 'undefined') return false
  return !!window.matchMedia?.('(pointer: coarse)').matches || /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)
}

export function detectQuality(): QualityLevel {
  const nav = navigator as Navigator & { deviceMemory?: number }
  const cores = nav.hardwareConcurrency ?? 4
  const mem = nav.deviceMemory ?? 4
  const touch = isTouchDevice()
  if (mem <= 2 || cores <= 3) return 'low'
  if (touch) return 'medium'
  return 'high'
}

export function qualityPreset(level: QualityLevel, resolutionScale = 1): QualitySettings {
  const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1
  const touch = isTouchDevice()
  switch (level) {
    case 'low':
      return { level, pixelRatio: Math.min(dpr, 1) * resolutionScale, shadows: false, shadowMapSize: 512, crowdDensity: 0.45, bloom: false, clearcoat: false, post: false, ao: false, reflections: 0 }
    case 'medium':
      return { level, pixelRatio: Math.min(dpr, touch ? 1.5 : 1.25) * resolutionScale, shadows: true, shadowMapSize: 1024, crowdDensity: 0.75, bloom: false, clearcoat: false, post: true, ao: false, reflections: 1 }
    case 'high':
      return { level, pixelRatio: Math.min(dpr, 2) * resolutionScale, shadows: true, shadowMapSize: 2048, crowdDensity: 1, bloom: true, clearcoat: true, post: true, ao: true, reflections: 2 }
  }
}
