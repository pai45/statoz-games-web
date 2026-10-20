import Image from "next/image";
import type { CSSProperties } from "react";

import { publicAsset } from "@/shared/config";

export type AvatarProps = {
  /** Path under `public/`; run through `publicAsset` here. */
  src: string;
  /** Accessible name. Pass an empty string when a label sits beside it. */
  alt: string;
  size: number;
  /** Draws a ring in this colour around the portrait. */
  ring?: string;
  ringWidth?: number;
  className?: string;
};

/**
 * An octagon-clipped portrait — the same silhouette as {@link Monogram}, which
 * is what stands in for one when there is no picture to show.
 *
 * The ring is a clipped plate with the portrait inset inside it rather than a
 * border, because a clip path crops a border away.
 */
export function Avatar({
  src,
  alt,
  size,
  ring,
  ringWidth = 1.2,
  className,
}: AvatarProps) {
  const clip: CSSProperties = { clipPath: "var(--ds-clip-octagon)" };
  const inset = ring ? ringWidth : 0;

  return (
    <span
      className={["relative block shrink-0", className ?? ""]
        .filter(Boolean)
        .join(" ")}
      style={{ width: size, height: size }}
    >
      {ring ? (
        <span
          aria-hidden
          className="absolute inset-0"
          style={{ ...clip, background: ring }}
        />
      ) : null}
      <span
        aria-hidden={alt === "" ? true : undefined}
        className="absolute overflow-hidden"
        style={{ ...clip, inset, background: "var(--ds-color-background-elevated)" }}
      >
        <Image
          src={publicAsset(src)}
          alt={alt}
          fill
          sizes={`${Math.ceil(size)}px`}
          className="object-cover object-top"
        />
      </span>
    </span>
  );
}
