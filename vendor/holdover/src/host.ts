/** The existing bundle bridge owns device-local, per-game, per-account storage. */
export interface HoldoverHost {
  emit(type: string, payload?: Record<string, unknown>): void
  command: ((command: string) => void) | null
}

declare global {
  interface Window { __STATOZ_HOST__?: HoldoverHost }
}

export const host = () => window.__STATOZ_HOST__
