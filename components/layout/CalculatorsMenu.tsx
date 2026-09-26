"use client";

import Link from "next/link";
import { ReactNode, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowRightIcon, CalculatorIcon } from "@/components/icons/Icons";

export type CalculatorMenuGroup = {
  category: string;
  items: { slug: string; title: string; tagline: string }[];
};

type Props = {
  groups: CalculatorMenuGroup[];
  triggerClassName: string;
  children: ReactNode;
};

/**
 * Header trigger that reveals every calculator in a dropdown on hover or keyboard focus.
 * The panel is positioned against the header row (the nearest `relative` ancestor), so it
 * lines up with the page container no matter which trigger opened it.
 */
export function CalculatorsMenu({ groups, triggerClassName, children }: Props) {
  const pathname = usePathname();
  // Remember which page the menu was opened on so it closes itself after navigation.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const setOpen = (value: boolean) => setOpenOn(value ? pathname : null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenOn(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const show = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const hide = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  };

  return (
    <div
      className="flex self-stretch items-center"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) hide();
      }}
    >
      <Link href="/calculators" className={triggerClassName} aria-haspopup="true" aria-expanded={open}>
        {children}
      </Link>

      <div
        className={`absolute right-0 top-full z-30 w-[min(820px,100%)] pt-1 transition-[opacity,visibility] duration-150 motion-reduce:transition-none ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <div className="rounded-xl border border-border bg-surface p-5 shadow-[var(--shadow-md)]">
          <div className="grid grid-cols-3 gap-x-6 gap-y-5">
            {groups.map((group) => (
              <div key={group.category}>
                <p className="px-2 text-[12px] font-semibold uppercase tracking-wide text-text-muted">
                  {group.category}
                </p>
                <ul className="mt-1.5 space-y-0.5">
                  {group.items.map((item) => (
                    <li key={item.slug}>
                      <Link
                        href={`/calculators/${item.slug}`}
                        onClick={() => setOpen(false)}
                        className="group/item flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-bg"
                      >
                        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary transition-colors group-hover/item:bg-primary group-hover/item:text-on-primary">
                          <CalculatorIcon slug={item.slug} className="h-4 w-4" />
                        </span>
                        <span>
                          <span className="block text-[14px] font-semibold text-text-primary group-hover/item:text-primary">
                            {item.title}
                          </span>
                          <span className="block text-[12.5px] leading-snug text-text-secondary">{item.tagline}</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-end border-t border-border pt-3">
            <Link
              href="/calculators"
              onClick={() => setOpen(false)}
              className="inline-flex items-center gap-1 text-[14px] font-medium text-primary hover:underline"
            >
              View all calculators
              <ArrowRightIcon className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
