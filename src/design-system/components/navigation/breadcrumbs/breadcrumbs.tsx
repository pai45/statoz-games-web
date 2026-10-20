import Link from "next/link";

import { ChevronRightIcon } from "@/design-system/icons";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export type BreadcrumbsProps = {
  items: BreadcrumbItem[];
  label?: string;
  className?: string;
};

/** A compact, horizontally-safe trail for secondary page navigation. */
export function Breadcrumbs({
  items,
  label = "Breadcrumb",
  className,
}: BreadcrumbsProps) {
  if (items.length === 0) return null;

  return (
    <nav aria-label={label} className={className}>
      <ol className="flex min-w-0 items-center overflow-x-auto px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((item, index) => {
          const current = index === items.length - 1;

          return (
            <li
              key={`${item.href ?? "current"}-${item.label}`}
              className="flex min-w-0 shrink-0 items-center"
            >
              {index > 0 ? (
                <ChevronRightIcon
                  size={14}
                  className="mx-1.5 shrink-0 text-line-strong"
                  aria-hidden="true"
                />
              ) : null}

              {item.href && !current ? (
                <Link
                  href={item.href}
                  className="flex min-h-11 items-center font-display text-2xs font-black tracking-ultra text-muted transition-colors hover:text-cyan"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={current ? "page" : undefined}
                  className="flex min-h-11 max-w-72 items-center truncate font-display text-2xs font-black tracking-ultra text-cyan"
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
