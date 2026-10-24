"use client";

import { useEffect, useSyncExternalStore, type ReactNode } from 'react';
import { publicAsset, basePath } from '@/shared/config';
import { Button } from '@/design-system/components/actions/button';
import { SignalPanel } from '@/design-system/components/data-display/signal-panel';
import styles from './device-assets.module.css';

type DownloadState = { state: 'checking' | 'downloading' | 'ready' | 'error' | 'online'; completedBytes: number; totalBytes: number; error?: string };
const initial: DownloadState = { state: 'checking', completedBytes: 0, totalBytes: 0 };
let snapshot = initial;
const listeners = new Set<() => void>();
let running: Promise<void> | undefined;
let generation = 0;
const emit = (value: Partial<DownloadState>) => { snapshot = { ...snapshot, ...value }; listeners.forEach(listener => listener()); };
const subscribe = (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; };
const mb = (bytes: number) => (bytes / 1048576).toFixed(1);

async function prepare() {
  const run = ++generation;
  emit({ state: 'checking', error: undefined });
  try {
    if (!window.isSecureContext || !('serviceWorker' in navigator) || !('caches' in window)) throw Error('Device downloads are unavailable in this browser. You can play online.');
    const buildId = process.env.NEXT_PUBLIC_ASSET_BUILD_ID;
    if (!buildId) throw Error('This build has no game download list. You can play online.');
    const response = await fetch(publicAsset(`/_game-assets/${buildId}.json`), { cache: 'no-store', signal: AbortSignal.timeout(30000) });
    if (!response.ok) throw Error('The game download list could not load. Check your connection and retry.');
    const manifest = await response.json();
    if (manifest.buildId !== buildId) throw Error('The game files do not match this app. Reload and retry.');
    // Persistence is best-effort; its denial must not prevent ordinary caching.
    await navigator.storage?.persist?.().catch(() => false);
    await navigator.serviceWorker.register(publicAsset('/game-assets-sw.js'), { scope: basePath + '/', updateViaCache: 'none' });
    await Promise.race([
      navigator.serviceWorker.ready,
      new Promise((_, reject) => setTimeout(() => reject(Error('Device download setup timed out. Retry or play online.')), 30000)),
    ]);
    const workerURL = new URL(publicAsset('/game-assets-sw.js'), location.origin).href;
    if (navigator.serviceWorker.controller?.scriptURL !== workerURL) await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => { navigator.serviceWorker.removeEventListener('controllerchange', changed); reject(Error('The download service could not start. Retry or play online.')); }, 15000);
      const changed = () => { if (navigator.serviceWorker.controller?.scriptURL !== workerURL) return; clearTimeout(timeout); navigator.serviceWorker.removeEventListener('controllerchange', changed); resolve(); };
      navigator.serviceWorker.addEventListener('controllerchange', changed);
      changed();
    });
    await new Promise<void>((resolve, reject) => {
      const channel = new MessageChannel();
      let timeout: ReturnType<typeof setTimeout>;
      const finish = (error?: Error) => { clearTimeout(timeout); channel.port1.close(); if (error) reject(error); else resolve(); };
      const reset = () => { clearTimeout(timeout); timeout = setTimeout(() => finish(Error('The download stopped responding. Retry to resume, or play online.')), 150000); };
      channel.port1.onmessage = event => {
        reset();
        const next = event.data as DownloadState;
        if (run === generation) emit(next);
        if (next.state === 'ready') finish();
        if (next.state === 'error') finish(Error(next.error));
      };
      reset();
      navigator.serviceWorker.controller!.postMessage({ type: 'PREPARE', manifest }, [channel.port2]);
    });
  } catch (error) {
    if (run === generation) emit({ state: 'error', error: error instanceof Error ? error.message : 'The download stopped. Retry to resume.' });
  }
}
function start() {
  if (!running) running = prepare().finally(() => { running = undefined; });
}

/** Mounted once above all routes: a direct game URL cannot bypass the download. */
export function DeviceAssets({ children }: { children: ReactNode }) {
  const value = useSyncExternalStore(subscribe, () => snapshot, () => initial);
  const development = process.env.NODE_ENV !== 'production';
  useEffect(() => { if (!development) start(); }, [development]);
  if (development || value.state === 'ready' || value.state === 'online') return children;
  const percent = value.totalBytes ? Math.floor(value.completedBytes / value.totalBytes * 100) : 0;
  return <main className={styles.screen} data-device-assets={value.state}>
    <div className={styles.frame}>
    <SignalPanel accent="var(--ds-color-accent-cyan)" lifted={false} pad={false} className={styles.panel}>
      <div className={styles.content}>
      <p className={styles.eyebrow}>STATOZ GAMES // DEVICE DOWNLOAD</p>
      <h1 className={styles.title}>{value.state === 'error' ? 'Download paused' : 'Getting your games ready'}</h1>
      <p className={styles.copy}>{value.state === 'error' ? value.error : 'Downloading game files to this device for smoother play. Keep this tab open; interrupted downloads can resume.'}</p>
      <div className={styles.stats}><span>{value.state === 'checking' ? 'Checking device files…' : `${mb(value.completedBytes)} / ${mb(value.totalBytes)} MB`}</span><strong>{percent}%</strong></div>
      <progress className={styles.progress} aria-label="Game files downloaded" max={100} value={percent} />
      <p role="status" className={styles.copy}>{value.state === 'error' ? 'Your downloaded files are kept for your next attempt.' : 'Play unlocks when all game files are ready.'}</p>
      {value.state === 'error' && <div className={styles.actions}>
        <Button onClick={() => { running = undefined; start(); }}>Retry download</Button>
        <Button variant="ghost" onClick={() => { generation++; emit({ state: 'online' }); }}>Play online</Button>
      </div>}
      </div>
    </SignalPanel>
    </div>
  </main>;
}
