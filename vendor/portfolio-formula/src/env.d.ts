interface ImportMeta {
  readonly env: { DEV: boolean; BASE_URL: string }
}

interface Window {
  __STATOZ_HOST__: {
    sessionId: string
    emit(type: string, payload?: Record<string, unknown>): void
    result(payload: Record<string, unknown>): void
    command: ((type: string) => void) | null
  }
  __PORTFOLIO_FORMULA__?: () => Record<string, unknown>
}
