"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { basePath } from '@/shared/config';
import { landscapeGeometry } from './policy';
import styles from './mobile-game-viewport.module.css';

const mobileQuery = '(pointer: coarse) and (max-width: 1366px)';
const navigationMessage = 'statoz:mobile-game-navigation';
const hosted = () => window.frameElement?.hasAttribute('data-mobile-game-frame');
const normalized = (pathname: string) => pathname.replace(/\/+$/, '') || '/';
function surface() {
  if (hosted()) return 'embedded';
  return window.matchMedia(mobileQuery).matches ? 'mobile' : 'desktop';
}
function subscribe(listener: () => void) {
  const query = window.matchMedia(mobileQuery);
  query.addEventListener('change', listener);
  return () => query.removeEventListener('change', listener);
}

/** A real iframe viewport keeps canvas sizing, media queries and touch coordinates
 * in landscape too. Rotating a React div alone leaves window.innerWidth portrait. */
export function MobileGameViewport({ title, children }: { title: string; children: ReactNode }) {
  const mode = useSyncExternalStore(subscribe, surface, () => 'pending');
  if (mode === 'pending') return <div role="status" className="grid min-h-dvh place-content-center">Opening {title}…</div>;
  if (mode !== 'mobile') return children;
  return <LandscapeFrame title={title} />;
}

function LandscapeFrame({ title }: { title: string }) {
  const host = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const router = useRouter();
  // This component only renders after hydration. Keep src stable across resize.
  const routePath = usePathname();
  // Client navigation can render this frame before browser history updates.
  const [source] = useState(() => new URL(basePath + routePath + window.location.search + window.location.hash, window.location.origin).href);
  const navigate = useCallback((href: string) => {
    let url: URL;
    try { url = new URL(href); } catch { return; }
    if (url.origin !== location.origin || normalized(url.pathname) === normalized(new URL(source).pathname)) return;
    if (basePath && url.pathname !== basePath && !url.pathname.startsWith(basePath + '/')) return;
    router.replace((url.pathname.slice(basePath.length) || '/') + url.search + url.hash);
  }, [router, source]);

  useEffect(() => {
    const element = frame.current, area = viewport.current, shell = host.current;
    if (!element || !area || !shell) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const sizeFrame = () => {
      const geometry = landscapeGeometry(area.clientWidth, area.clientHeight);
      element.style.width = geometry.width + 'px';
      element.style.height = geometry.height + 'px';
      element.style.transform = geometry.transform;
    };
    const visible = window.visualViewport;
    const sizeHost = () => {
      if (visible && visible.scale !== 1) return;
      shell.style.width = (visible?.width ?? window.innerWidth) + 'px';
      shell.style.height = (visible?.height ?? window.innerHeight) + 'px';
      shell.style.left = (visible?.offsetLeft ?? 0) + 'px';
      shell.style.top = (visible?.offsetTop ?? 0) + 'px';
      sizeFrame();
    };
    const observer = new ResizeObserver(sizeFrame);
    observer.observe(area);
    sizeHost();
    window.addEventListener('resize', sizeHost);
    visible?.addEventListener('resize', sizeHost);
    visible?.addEventListener('scroll', sizeHost);
    const receive = (event: MessageEvent) => {
      if (event.source !== element.contentWindow || event.origin !== location.origin || event.data?.type !== navigationMessage || typeof event.data.href !== 'string') return;
      navigate(event.data.href);
    };
    window.addEventListener('message', receive);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', sizeHost);
      visible?.removeEventListener('resize', sizeHost);
      visible?.removeEventListener('scroll', sizeHost);
      window.removeEventListener('message', receive);
      document.body.style.overflow = previousOverflow;
    };
  }, [navigate]);

  return <div ref={host} className={styles.host} data-mobile-game-viewport="landscape">
    <div ref={viewport} className={styles.viewport}>
      <iframe ref={frame} data-mobile-game-frame title={`${title} — landscape`} src={source} className={styles.frame}
        allow="autoplay; gamepad; fullscreen 'none'"
        onLoad={() => { try { if (frame.current?.contentWindow) navigate(frame.current.contentWindow.location.href); } catch { /* Only same-origin app routes participate. */ } }} />
    </div>
  </div>;
}

/** Mounted in the app layout so Next client-side exits also leave the outer
 * rotated frame. Saves/auth stay in the existing same-origin account stores. */
export function MobileGameNavigationBridge() {
  const pathname = usePathname();
  useEffect(() => {
    if (hosted()) window.parent.postMessage({ type: navigationMessage, href: location.href }, location.origin);
  }, [pathname]);
  return null;
}
