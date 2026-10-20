/**
 * Four pips with `rank + 1` filled — a language-free rarity gauge on the
 * nameplate, so a card's tier reads without reading a word.
 */
export type TierPipsProps = {
  /** 0 bronze · 1 silver · 2 gold · 3 platinum. */
  rank: number;
  /** CSS color of a filled pip; an empty one keeps it as a 45% outline. */
  color: string;
  size: number;
};

export function TierPips({ rank, color, size }: TierPipsProps) {
  return (
    <span aria-hidden className="flex items-center gap-0.5">
      {[0, 1, 2, 3].map((index) => (
        <span
          key={index}
          className="block rounded-full"
          style={{
            width: size,
            height: size,
            background: index <= rank ? color : "transparent",
            boxShadow:
              index <= rank
                ? undefined
                : `inset 0 0 0 1px color-mix(in srgb, ${color} 45%, transparent)`,
          }}
        />
      ))}
    </span>
  );
}
