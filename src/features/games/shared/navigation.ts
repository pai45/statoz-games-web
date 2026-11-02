import { gameSportOrder, type GameSport } from "@/domain/game-sports";

export function gameCatalogHref(sport: GameSport | null, viewAll = false) {
  const params = new URLSearchParams();
  if (sport) params.set("sport", sport);
  if (viewAll) params.set("view", "all");
  return params.size ? `/?${params}` : "/";
}

/** Keep return destinations inside the app and migrate retired catalog URLs. */
export function gameReturnHref(value: string | null | undefined): string {
  if (!value?.startsWith("/") || value.startsWith("//") || /[\\\u0000-\u0020]/.test(value)) return "/";
  const url = new URL(value, "https://statoz.invalid");
  if (url.pathname.startsWith("/play/")) return "/";
  const legacy = /^\/games\/([^/]+)\/?$/.exec(url.pathname);
  if (legacy) return gameSportOrder.includes(legacy[1] as GameSport) ? gameCatalogHref(legacy[1] as GameSport) : "/";
  return url.pathname + url.search + url.hash;
}

export function gameLaunchHref(href: string, origin: string) {
  const url = new URL(href, "https://statoz.invalid");
  url.searchParams.set("returnTo", gameReturnHref(origin));
  return url.pathname + url.search + url.hash;
}
