import type { CSSProperties } from "react";

import { HomeHubSurface } from "@/features/shell/components/home-hub-surface";
import { PlatformLandscape } from "@/features/games/shared/mobile-viewport/mobile-game-viewport";

import { AdSlot } from "@/features/ads";
import { PlatformBreadcrumbs, PlatformNav, PlatformTopBar } from "@/features/shell";

/**
 * The platform shell. Navigation sits at the bottom on narrow portrait
 * screens and moves to a side rail once there is room for it. Phones always
 * get the landscape layout: `PlatformLandscape` turns the whole shell sideways
 * when the phone is upright, and the short-landscape (`phone-land`) layout
 * swaps the bottom bar for a narrow icon rail and a shorter header.
 */
export default function PlatformLayout({ children }: LayoutProps<"/">) {
  return (
    <PlatformLandscape>
    {/*
      --platform-nav-height is the bar nav's height, published because it is
      sticky and therefore floats over the page: anything a screen docks above
      it (the leaderboard's YOUR RANK card) has to offset by exactly this. The
      nav below is sized from the same value, so the two cannot drift. The
      landscape rail floats over nothing, so it is zero there.
    */}
    <div
      className="min-h-dvh [--platform-nav-height:5.25rem] phone-land:[--platform-nav-height:0px]"
      style={{ background: "var(--ds-gradient-app-background)" } as CSSProperties}
    >
      <div className="mx-auto grid min-h-dvh w-full max-w-[104rem] grid-cols-1 2xl:grid-cols-[10rem_minmax(0,80rem)_10rem] 2xl:gap-4 2xl:px-4">
        <div className="hidden 2xl:block">
          <div className="sticky top-4">
            <AdSlot placement="platform-left-rail" />
          </div>
        </div>

        <div className="mx-auto flex min-h-dvh w-full max-w-7xl min-w-0 flex-col lg:flex-row phone-land:flex-row 2xl:mx-0">
          <div className="hidden shrink-0 lg:block lg:w-56 phone-land:hidden!">
            <div className="sticky top-0 h-dvh">
              <PlatformNav orientation="rail" />
            </div>
          </div>
          <div className="hidden w-18 shrink-0 phone-land:block">
            <div className="sticky top-0 h-dvh">
              <PlatformNav orientation="rail" compact />
            </div>
          </div>

          <HomeHubSurface>
            <PlatformTopBar />
            <PlatformBreadcrumbs />
            <main className="flex min-h-0 flex-1 flex-col pb-[env(safe-area-inset-bottom)]">
              {children}
            </main>
          </HomeHubSurface>

          <PlatformNav className="sticky bottom-0 z-20 h-[calc(var(--platform-nav-height)+env(safe-area-inset-bottom))] pb-[env(safe-area-inset-bottom)] lg:hidden phone-land:hidden" />
        </div>

        <div className="hidden 2xl:block">
          <div className="sticky top-4">
            <AdSlot placement="platform-right-rail" />
          </div>
        </div>
      </div>
    </div>
    </PlatformLandscape>
  );
}
