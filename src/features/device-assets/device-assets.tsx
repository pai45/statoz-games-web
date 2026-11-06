"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
  type MouseEvent,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";

import { Button } from "@/design-system/components/actions/button";
import { SignalPanel } from "@/design-system/components/data-display/signal-panel";
import { basePath, publicAsset } from "@/shared/config";

import styles from "./device-assets.module.css";
import type {
  AssetPackIndex,
  AssetPackManifest,
  AssetPackSummary,
  DownloadProgress,
} from "./types";

type InstalledGame = { revision?: string; buildId?: string };
type GameLaunch = DownloadProgress & { game: string; pathname: string };
type WorkerReply = Omit<DownloadProgress, "state"> & InstalledGame & {
  state: DownloadProgress["state"] | "ready";
  installed?: boolean;
  current?: boolean;
};

type DeviceAssetContextValue = {
  prepareGame: (
    game: string,
    progress: (value: DownloadProgress) => void,
    signal?: AbortSignal,
  ) => Promise<InstalledGame>;
  cancelGame: (game: string) => void;
  playGame: (game: string, title: string, href: string) => void;
  launch: GameLaunch | null;
};

const readyProgress: DownloadProgress = {
  state: "installed",
  completedBytes: 0,
  totalBytes: 0,
};

const DeviceAssetContext = createContext<DeviceAssetContextValue | null>(null);

function validIndex(value: unknown, buildId: string): value is AssetPackIndex {
  const index = value as AssetPackIndex | null;
  return index?.schemaVersion === 2 && index.buildId === buildId &&
    index.core?.packId === "core" && typeof index.core.manifestUrl === "string" &&
    Boolean(index.games) && typeof index.games === "object";
}

function validManifest(value: unknown, summary: AssetPackSummary): value is AssetPackManifest {
  const manifest = value as AssetPackManifest | null;
  return manifest?.schemaVersion === 2 && manifest.packId === summary.packId &&
    manifest.revision === summary.revision && manifest.totalBytes === summary.totalBytes &&
    Array.isArray(manifest.files) && manifest.files.length > 0;
}

class DeviceAssetClient {
  private readonly development = process.env.NODE_ENV !== "production";
  private readonly buildId = process.env.NEXT_PUBLIC_ASSET_BUILD_ID ?? "";
  private setupPromise?: Promise<AssetPackIndex>;
  private index?: AssetPackIndex;
  private corePromise?: Promise<void>;

  private async register(): Promise<ServiceWorker> {
    if (!window.isSecureContext || !("serviceWorker" in navigator) || !("caches" in window)) {
      throw Error("Offline game downloads are unavailable in this browser.");
    }
    await navigator.storage?.persist?.().catch(() => false);
    const workerUrl = new URL(publicAsset("/game-assets-sw.js"), location.origin).href;
    try {
      await navigator.serviceWorker.register(workerUrl, { scope: `${basePath}/`, updateViaCache: "none" });
    } catch (error) {
      const existing = await navigator.serviceWorker.getRegistration(`${basePath}/`);
      if (existing?.active?.scriptURL !== workerUrl) throw error;
    }
    await Promise.race([
      navigator.serviceWorker.ready,
      new Promise((_, reject) => setTimeout(() => reject(Error("The download service could not start. Retry.")), 30_000)),
    ]);
    if (navigator.serviceWorker.controller?.scriptURL !== workerUrl) {
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          navigator.serviceWorker.removeEventListener("controllerchange", changed);
          reject(Error("The download service could not take control. Reload and retry."));
        }, 15_000);
        const changed = () => {
          if (navigator.serviceWorker.controller?.scriptURL !== workerUrl) return;
          clearTimeout(timeout);
          navigator.serviceWorker.removeEventListener("controllerchange", changed);
          resolve();
        };
        navigator.serviceWorker.addEventListener("controllerchange", changed);
        changed();
      });
    }
    return navigator.serviceWorker.controller!;
  }

  private async loadIndex(): Promise<AssetPackIndex> {
    const storageKey = `statoz.games.web.asset-index.v2.${this.buildId}`;
    try {
      const response = await fetch(
        publicAsset(`/_game-assets/${this.buildId}/index.json`),
        { cache: "no-store", signal: AbortSignal.timeout(30_000) },
      );
      if (!response.ok) throw Error("The game download list could not load.");
      const value: unknown = await response.json();
      if (!validIndex(value, this.buildId)) throw Error("The game download list does not match this app.");
      try { localStorage.setItem(storageKey, JSON.stringify(value)); } catch { /* Offline launch can still use worker metadata. */ }
      return value;
    } catch (error) {
      try {
        const cached: unknown = JSON.parse(localStorage.getItem(storageKey) ?? "null");
        if (validIndex(cached, this.buildId)) return cached;
      } catch { /* Report the original network failure below. */ }
      throw error;
    }
  }

  private setup(): Promise<AssetPackIndex> {
    if (this.development) return Promise.resolve({ schemaVersion: 2, buildId: "development", basePath: "", core: {} as AssetPackSummary, games: {} });
    if (!this.buildId) return Promise.reject(Error("This build has no game download list. Reload the app."));
    if (!this.setupPromise) this.setupPromise = Promise.all([this.register(), this.loadIndex()]).then(([, index]) => {
      this.index = index;
      return index;
    }).catch(error => {
      this.setupPromise = undefined;
      throw error;
    });
    return this.setupPromise;
  }

  private request(
    message: Record<string, unknown>,
    progress?: (value: WorkerReply) => void,
    timeoutMs = 150_000,
  ): Promise<WorkerReply> {
    return new Promise((resolve, reject) => {
      const worker = navigator.serviceWorker.controller;
      if (!worker) { reject(Error("The download service is not ready. Reload and retry.")); return; }
      const channel = new MessageChannel();
      let timeout: ReturnType<typeof setTimeout>;
      const finish = (value?: WorkerReply, error?: Error) => {
        clearTimeout(timeout);
        channel.port1.close();
        if (error) reject(error); else resolve(value!);
      };
      const reset = () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => finish(undefined, Error("The download service stopped responding. Close other StatOz tabs, reopen the app, and retry.")), timeoutMs);
      };
      channel.port1.onmessage = event => {
        reset();
        const value = event.data as WorkerReply;
        progress?.(value);
        if (["ready", "installed", "not-installed", "error", "cancelled"].includes(value.state)) finish(value);
      };
      reset();
      worker.postMessage({ ...message, index: this.index }, [channel.port2]);
    });
  }

  private async manifest(summary: AssetPackSummary): Promise<AssetPackManifest> {
    const response = await fetch(summary.manifestUrl, {
      cache: "no-store",
      signal: AbortSignal.timeout(30_000),
    });
    if (!response.ok) throw Error("The game download list could not load. Check your connection and retry.");
    const value: unknown = await response.json();
    if (!validManifest(value, summary)) throw Error("The game files do not match this app. Reload and retry.");
    return value;
  }

  private async installPack(
    summary: AssetPackSummary,
    progress: (value: DownloadProgress) => void,
    allowInstalledFallback: boolean,
    signal?: AbortSignal,
  ): Promise<InstalledGame> {
    signal?.throwIfAborted();
    const status = await this.request({
      type: "GET_PACK_STATUS",
      packId: summary.packId,
      revision: summary.revision,
    }, undefined, 30_000);
    if (status.state === "error") throw Error(status.error);
    if (status.installed && status.current) return status;

    let manifest: AssetPackManifest;
    try { manifest = await this.manifest(summary); }
    catch (error) {
      if (allowInstalledFallback && status.installed && (!navigator.onLine || error instanceof TypeError)) return status;
      if (!navigator.onLine) throw Error("Internet required to download this game.");
      throw error;
    }
    signal?.throwIfAborted();

    const verified = await this.request({
      type: "VERIFY_PACK",
      packId: summary.packId,
      revision: summary.revision,
      manifest,
    });
    if (verified.state === "error") throw Error(verified.error);
    if (verified.installed && verified.current) return verified;

    const phase = status.installed ? "updating" : "downloading";
    progress({
      state: phase,
      completedBytes: verified.completedBytes,
      totalBytes: manifest.totalBytes,
    });
    const cancel = () => navigator.serviceWorker.controller?.postMessage({ type: "CANCEL_PACK", packId: summary.packId });
    signal?.addEventListener("abort", cancel, { once: true });
    const result = await this.request({ type: "INSTALL_PACK", manifest }, value => {
      if (value.state === "downloading") progress({ ...value, state: phase });
    }).finally(() => signal?.removeEventListener("abort", cancel));
    signal?.throwIfAborted();
    if (result.state === "cancelled") throw Error("Download cancelled.");
    if (result.state === "error") throw Error(result.error ?? "The download stopped. Retry to resume.");
    return result;
  }

  async prepareCore(): Promise<void> {
    if (this.development) return;
    if (!this.corePromise) this.corePromise = (async () => {
      const index = await this.setup();
      await this.installPack(index.core, () => {}, true);
    })().catch(error => { this.corePromise = undefined; throw error; });
    return this.corePromise;
  }

  async prepareGame(game: string, progress: (value: DownloadProgress) => void, signal?: AbortSignal): Promise<InstalledGame> {
    if (this.development) { progress(readyProgress); return {}; }
    progress({ state: "checking", completedBytes: 0, totalBytes: 0 });
    const index = await this.setup();
    await this.prepareCore();
    signal?.throwIfAborted();
    const summary = index.games[game];
    if (!summary) throw Error("This game has no offline download package. Reload the app.");
    const installed = await this.installPack(summary, progress, true, signal);
    progress({ state: "installed", completedBytes: summary.totalBytes, totalBytes: summary.totalBytes });
    return installed;
  }

  cancelGame(game: string) {
    const summary = this.index?.games[game];
    if (!summary || !navigator.serviceWorker.controller) return;
    navigator.serviceWorker.controller.postMessage({ type: "CANCEL_PACK", packId: summary.packId });
  }
}

export function DeviceAssets({ children }: { children: ReactNode }) {
  const client = useMemo(() => new DeviceAssetClient(), []);
  const pathname = usePathname();
  const [launch, setLaunch] = useState<GameLaunch | null>(null);
  const activeLaunch = useRef<{ game: string; controller: AbortController } | null>(null);
  const playGame = useCallback((game: string, _title: string, href: string) => {
    // Repeated clicks share the current install. Selecting another game cancels
    // the old launch so it cannot navigate after the new selection completes.
    if (activeLaunch.current?.game === game) return;
    activeLaunch.current?.controller.abort();
    const request = { game, controller: new AbortController() };
    activeLaunch.current = request;
    setLaunch({ game, pathname, state: "checking", completedBytes: 0, totalBytes: 0 });
    void client.prepareGame(game, progress => {
      if (activeLaunch.current === request) setLaunch({ ...progress, game, pathname });
    }, request.controller.signal).then(installed => {
      if (activeLaunch.current !== request || request.controller.signal.aborted) return;
      hardNavigate(href, installed.revision);
    }).catch(error => {
      if (activeLaunch.current !== request || request.controller.signal.aborted) return;
      activeLaunch.current = null;
      setLaunch(previous => ({
        completedBytes: previous?.completedBytes ?? 0,
        totalBytes: previous?.totalBytes ?? 0,
        game, pathname, state: "error",
        error: error instanceof Error ? error.message : "The download stopped. Retry to resume.",
      }));
    });
  }, [client, pathname]);
  const value = useMemo<DeviceAssetContextValue>(() => ({
    prepareGame: (game, progress, signal) => client.prepareGame(game, progress, signal),
    cancelGame: game => client.cancelGame(game),
    playGame,
    launch: launch?.pathname === pathname ? launch : null,
  }), [client, playGame, launch, pathname]);

  useEffect(() => () => {
    activeLaunch.current?.controller.abort();
    activeLaunch.current = null;
    setLaunch(null);
  }, [pathname]);

  // The shell never waits for device caching. Core installation is best-effort
  // and contains no game runtime files.
  useEffect(() => { void client.prepareCore().catch(() => {}); }, [client]);
  return <DeviceAssetContext.Provider value={value}>
    {children}
  </DeviceAssetContext.Provider>;
}

/** Shared by the spotlight and every cover for the selected game's inline UI. */
export function useGamePlayState(game: string) {
  const launch = useContext(DeviceAssetContext)?.launch;
  const progress = launch?.game === game ? launch : null;
  const pending = Boolean(progress && progress.state !== "error");
  const percent = progress?.totalBytes ? Math.max(0, Math.min(100, Math.floor(progress.completedBytes / progress.totalBytes * 100))) : null;
  const label = progress?.state === "error" ? "Retry download"
    : progress?.state === "installed" ? "Opening lobby…"
    : progress?.state === "updating" ? `Updating${percent === null ? "…" : ` ${percent}%`}`
    : `Downloading${percent === null ? "…" : ` ${percent}%`}`;
  return { pending, label, error: progress?.error, state: progress?.state };
}

export function GamePlayFeedback({ game }: { game: string }) {
  const { error } = useGamePlayState(game);
  return error ? <span role="alert" className={styles.inlineError} data-game-download-error={game}>{error}</span> : null;
}

/** The catalog keeps ordinary hrefs for new tabs while PLAY installs before navigation. */
export function useGamePlay() {
  const client = useContext(DeviceAssetContext);
  return useCallback((game: string, title: string, href: string) => {
    window.dispatchEvent(new Event("statoz:home-launch"));
    if (client) client.playGame(game, title, href);
    else hardNavigate(href);
  }, [client]);
}

export function useGamePlayAction(game: string, title: string, href: string) {
  const play = useGamePlay();
  return useCallback((event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    play(game, title, href);
  }, [play, game, href, title]);
}

function hardNavigate(href: string, revision?: string) {
  const url = new URL(basePath && href.startsWith(basePath + "/") ? href : publicAsset(href), location.origin);
  if (revision) url.searchParams.set("assetPack", revision);
  const platform = window.frameElement?.hasAttribute("data-mobile-platform-frame");
  if (platform) window.parent.location.assign(url.href);
  else window.location.assign(url.href);
}

const mb = (bytes: number) => (bytes / 1_048_576).toFixed(1);

export function GameAssetGate({ game, title, children, launchHref, onCancel }: {
  game: string;
  title: string;
  children: ReactNode;
  launchHref?: string;
  onCancel?: () => void;
}) {
  const client = useContext(DeviceAssetContext);
  const [attempt, setAttempt] = useState(0);
  const [value, setValue] = useState<DownloadProgress>({
    state: "checking",
    completedBytes: 0,
    totalBytes: 0,
  });

  useEffect(() => {
    if (!client) return;
    let active = true;
    const controller = new AbortController();
    void client.prepareGame(game, next => { if (active && next.state !== "installed") setValue(next); }, controller.signal).then(installed => {
      if (!active) return;
      if (launchHref) hardNavigate(launchHref, installed.revision);
      else if (installed.buildId && installed.buildId !== process.env.NEXT_PUBLIC_ASSET_BUILD_ID) hardNavigate(location.pathname + location.search, installed.revision);
      else setValue(readyProgress);
    }).catch(error => {
      if (!active) return;
      setValue(previous => ({
        ...previous,
        state: "error",
        error: error instanceof Error ? error.message : "The download stopped. Retry to resume.",
      }));
    });
    return () => { active = false; controller.abort(); };
  }, [attempt, client, game, launchHref]);

  if (value.state === "installed" && !launchHref) return children;
  // This state is also prerendered into every lobby document. Rendering the
  // install panel here flashes it before hydration can confirm an installed
  // pack, including after PLAY has just verified that same pack in the library.
  // Keep the boundary closed while checking, without painting download UI.
  if (value.state === "checking") return <main className={styles.preparing} data-game-preparing={game}>
    <span className="sr-only" role="status">Opening {title}…</span>
  </main>;
  const percent = value.totalBytes ? Math.floor(value.completedBytes / value.totalBytes * 100) : 0;
  const downloading = value.state === "downloading" || value.state === "updating";
  const error = value.state === "error";
  const heading = error ? "Download paused" : value.state === "updating" ? `Updating ${title}` : `Getting ${title} ready`;
  const copy = error
    ? value.error
    : "Downloading and verifying this game for offline play. Keep this tab open.";

  const back = () => { if (onCancel) onCancel(); else hardNavigate("/"); };
  const cancel = () => { client?.cancelGame(game); back(); };

  return <main className={styles.screen} data-game-download={value.state}>
    <div className={styles.frame}>
      <SignalPanel accent="var(--ds-color-accent-cyan)" lifted={false} pad={false} className={styles.panel}>
        <div className={styles.content}>
          <p className={styles.eyebrow}>STATOZ GAMES // OFFLINE INSTALL</p>
          <h1 className={styles.title}>{heading}</h1>
          <p className={styles.copy}>{copy}</p>
          {!error && <>
            <div className={styles.stats}>
              <span>{mb(value.completedBytes)} / {mb(value.totalBytes)} MB</span>
              <strong>{percent}%</strong>
            </div>
            <progress className={styles.progress} aria-label={`${title} downloaded`} max={100} value={percent} />
            <p role="status" className={styles.copy}>{downloading ? "The lobby opens automatically when verification is complete." : "Preparing download…"}</p>
          </>}
          <div className={styles.actions}>
            {error ? <Button onClick={() => setAttempt(value => value + 1)}>Retry</Button> : null}
            {downloading ? <Button variant="surface" onClick={cancel}>Cancel</Button> : null}
            {error ? <Button variant="ghost" onClick={back}>Back to Games</Button> : null}
          </div>
        </div>
      </SignalPanel>
    </div>
  </main>;
}
