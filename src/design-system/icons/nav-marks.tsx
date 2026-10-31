import { Icon, type IconProps } from "./icon";

type NavMarkGeometry = { paths: readonly string[]; fills: readonly string[] };

export type NavMarkId = "games" | "quiz" | "shop" | "top" | "profile";

/**
 * Primary-navigation marks on the shared 32-unit game-mark grid: proportional
 * 1.75 strokes, butt caps, miter joins. One silhouette and one game cue each,
 * so every tab reads in monochrome at 20px.
 */
const navMarks = {
  /** Faceted gamepad: d-pad and two action buttons. */
  games: {
    paths: ["M8 8H24L27 11L29 22L26 25L21 21H11L6 25L3 22L5 11Z"],
    fills: ["M9.5 12H11.5V13.5H13V15.5H11.5V17H9.5V15.5H8V13.5H9.5Z", "M21.5 11.5L23 13L21.5 14.5L20 13ZM24 14L25.5 15.5L24 17L22.5 15.5Z"],
  },
  /** Quiz card with a cut corner and a drawn question mark. */
  quiz: {
    paths: ["M7 3h16l4 4v18l-4 4H7l-4-4V7Z", "M12.5 11C12.5 7 19.5 7 19.5 11C19.5 14 16 14 16 17"],
    fills: ["M15 20h2v2h-2Z"],
  },
  /** Loot chest: chamfered lid, banded body and a lit lock. */
  shop: {
    paths: ["M4 14V10L8 6H24L28 10V14", "M4 14H28V25L26 27H6L4 25Z", "M10 6V14M22 6V14"],
    fills: ["M14 12H18V18L16 20L14 18Z"],
  },
  /** Winners' podium under a crown. */
  top: {
    paths: ["M2 28H30", "M4 28V21H11", "M11 28V15H21V28", "M21 21H28V28"],
    fills: ["M11 12L12 5L14.5 8L16 4L17.5 8L20 5L21 12Z"],
  },
  /** Player card: faceted head, shoulders and a rank chevron. */
  profile: {
    paths: ["M16 4L21 7V13L16 16L11 13V7Z", "M5 28V24L10 19H22L27 24V28"],
    fills: ["M12 22.5L16 25L20 22.5V25.5L16 28L12 25.5Z"],
  },
} satisfies Record<NavMarkId, NavMarkGeometry>;

export const navMarkIds = Object.keys(navMarks) as NavMarkId[];

/** Decorative by default; pass a title when the mark is the only label. */
export function NavMarkIcon({ mark, ...props }: IconProps & { mark: NavMarkId }) {
  const geometry = navMarks[mark];
  return (
    <Icon viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="butt" strokeLinejoin="miter" strokeMiterlimit={2} {...props}>
      {geometry.paths.map((path) => <path key={path} d={path} />)}
      {geometry.fills.map((path) => <path key={path} d={path} fill="currentColor" fillRule="evenodd" stroke="none" />)}
    </Icon>
  );
}
