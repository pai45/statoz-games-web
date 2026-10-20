/**
 * The faint markings behind a card's glyph — a crease, a key, a court, a
 * corner. Flutter paints these with a `CustomPainter`; being pure geometry they
 * become inline SVG here.
 *
 * The viewBox is square but the plate is not, so `preserveAspectRatio="none"`
 * stretches the drawing to fill it and `vector-effect="non-scaling-stroke"`
 * keeps every hairline exactly one pixel through that stretch.
 */
export type RoleMarkings =
  | "none"
  | "cricket"
  | "basketball"
  | "tennis"
  | "motorsport";

export type RoleSignalProps = {
  markings: RoleMarkings;
  /** CSS color the markings are drawn in; rendered at 22% opacity. */
  accent: string;
};

export function RoleSignal({ markings, accent }: RoleSignalProps) {
  if (markings === "none") return null;

  return (
    <svg
      aria-hidden
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="absolute inset-0 size-full"
      fill="none"
      stroke={accent}
      strokeOpacity={0.22}
      strokeWidth={0.9}
      vectorEffect="non-scaling-stroke"
    >
      {markings === "cricket" ? (
        <>
          <path d="M0 74H100" vectorEffect="non-scaling-stroke" />
          <path d="M44 61V74M50 61V74M56 61V74" vectorEffect="non-scaling-stroke" />
        </>
      ) : markings === "basketball" ? (
        <>
          <path d="M14 18A36 36 0 0 0 86 18" vectorEffect="non-scaling-stroke" />
          <path d="M35 1H65V31H35Z" vectorEffect="non-scaling-stroke" />
        </>
      ) : markings === "tennis" ? (
        <>
          <path d="M10 10H90V80H10Z" vectorEffect="non-scaling-stroke" />
          <path d="M10 45H90" vectorEffect="non-scaling-stroke" />
        </>
      ) : (
        <path
          d="M22 0C85 20 18 58 82 100"
          strokeWidth={3}
          vectorEffect="non-scaling-stroke"
        />
      )}
    </svg>
  );
}
