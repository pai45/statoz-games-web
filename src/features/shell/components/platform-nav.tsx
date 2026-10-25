"use client";

import { usePathname } from "next/navigation";

import {
  accentVar,
  FootballIcon,
  NavRail,
  ProfileIcon,
  ShopIcon,
  TrophyIcon,
  type NavRailItem,
} from "@/design-system";
import { navDestinations, type NavDestinationId } from "@/shared/config";

export type PlatformNavProps = {
  /** Overrides the destination derived from the URL. */
  activeId?: NavDestinationId;
  orientation?: "bar" | "rail";
  className?: string;
};

const icons: Record<NavDestinationId, React.ReactNode> = {
  sports: <FootballIcon size={20} />,
  quiz: <TrophyIcon size={20} />,
  shop: <ShopIcon size={20} />,
  leaderboard: <TrophyIcon size={20} />,
  profile: <ProfileIcon size={20} />,
};

/** Platform destinations share one violet accent so no single tab dominates. */
const NAV_ACCENT = accentVar("violet");

/**
 * Which destination the current URL belongs to.
 *
 * Longest matching href wins, so `/profile/history` still lights PROFILE, and
 * the root href is only ever an exact match — otherwise it would claim every
 * page in the app.
 */
function destinationForPath(pathname: string): NavDestinationId {
  let best: NavDestinationId = "sports";
  let bestLength = 0;

  for (const destination of navDestinations) {
    if (destination.href === "/") continue;
    const matches =
      pathname === destination.href ||
      pathname.startsWith(`${destination.href}/`);
    if (matches && destination.href.length > bestLength) {
      best = destination.id;
      bestLength = destination.href.length;
    }
  }

  return best;
}

/** The platform's primary navigation, in either presentation. */
export function PlatformNav({
  activeId,
  orientation = "bar",
  className,
}: PlatformNavProps) {
  const pathname = usePathname();
  const active = activeId ?? (destinationForPath(pathname));

  const items: NavRailItem[] = navDestinations.map((destination) => ({
    id: destination.id,
    label: destination.label,
    icon: icons[destination.id],
    accent: NAV_ACCENT,
    href: destination.href,
  }));

  return (
    <NavRail
      label="Primary"
      items={items}
      activeId={active}
      orientation={orientation}
      className={className}
    />
  );
}
