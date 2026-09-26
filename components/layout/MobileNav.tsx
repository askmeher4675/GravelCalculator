"use client";

import Link from "next/link";
import { useState } from "react";
import { MenuIcon, CloseIcon, CalculatorIcon } from "@/components/icons/Icons";

const NAV_LINKS = [
  { href: "/calculators", label: "All Calculators" },
  { href: "/guides", label: "Guides" },
  { href: "/about", label: "About" },
];

export function MobileNav({ calculators }: { calculators: { slug: string; title: string }[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-text-secondary"
      >
        {open ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
      </button>

      {open && (
        <div className="absolute inset-x-0 top-full max-h-[calc(100dvh-4rem)] overflow-y-auto border-b border-border bg-surface shadow-[var(--shadow-md)]">
          <div className="border-b border-border px-4 py-3">
            <p className="px-2 text-[12px] font-semibold uppercase tracking-wide text-text-muted">Calculators</p>
            <div className="mt-1 grid grid-cols-2 gap-1">
              {calculators.map((c) => (
                <Link
                  key={c.slug}
                  href={`/calculators/${c.slug}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 rounded-md px-2 py-2.5 text-[14px] font-medium text-text-secondary transition-colors hover:bg-bg hover:text-primary"
                >
                  <CalculatorIcon slug={c.slug} className="h-4 w-4 shrink-0 text-primary" />
                  {c.title.replace(/ Calculator$/, "")}
                </Link>
              ))}
            </div>
          </div>
          <nav className="flex flex-col px-4 py-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-3 text-[15px] font-medium text-text-secondary transition-colors hover:bg-bg hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
