"use client";

import {
  forwardRef,
  type ChangeEventHandler,
  type CSSProperties,
  type InputHTMLAttributes,
} from "react";

import { CloseIcon, SearchIcon } from "../../../icons";

export type SearchFieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "className" | "onChange" | "type"
> & {
  label: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onClear?: () => void;
  accent?: string;
  className?: string;
};

/**
 * The persistent rectangular search surface used by catalogue and finder
 * screens. Search stays visually distinct from the chamfered action fields.
 */
export const SearchField = forwardRef<HTMLInputElement, SearchFieldProps>(
  function SearchField(
    {
      label,
      value,
      onChange,
      onClear,
      accent = "var(--ds-color-accent-cyan)",
      className,
      ...input
    },
    ref,
  ) {
    return (
      <div
        className={[
          "group flex h-14 items-center border bg-elevated px-3 transition-colors focus-within:border-(--search-accent)",
          className ?? "",
        ]
          .filter(Boolean)
          .join(" ")}
        style={{
          "--search-accent": accent,
          borderColor: `color-mix(in srgb, ${accent} 50%, transparent)`,
        } as CSSProperties}
      >
        <SearchIcon size={20} className="shrink-0" style={{ color: accent }} />
        <input
          ref={ref}
          type="search"
          aria-label={label}
          value={value}
          onChange={onChange}
          className="h-full min-w-0 flex-1 appearance-none bg-transparent px-2.5 text-md font-medium text-foreground outline-none placeholder:text-muted [&::-webkit-search-cancel-button]:appearance-none"
          {...input}
        />
        {value && onClear ? (
          <button
            type="button"
            onClick={onClear}
            aria-label="Clear search"
            className="grid size-11 shrink-0 place-items-center text-muted transition-colors hover:text-foreground"
          >
            <CloseIcon size={18} />
          </button>
        ) : null}
      </div>
    );
  },
);
