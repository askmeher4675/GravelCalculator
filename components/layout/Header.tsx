import Link from "next/link";
import { PageContainer } from "./PageContainer";
import { MobileNav } from "./MobileNav";
import { GridIcon } from "@/components/icons/Icons";

const NAV_LINKS = [
  { href: "/calculators/gravel-calculator", label: "Gravel Calculator" },
  { href: "/calculators/driveway-calculator", label: "Driveway Calculator" },
  { href: "/calculators", label: "Calculators" },
  { href: "/guides", label: "Guides" },
  { href: "/about", label: "About" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-surface/90 backdrop-blur-sm">
      <PageContainer>
        <div className="relative flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex shrink-0 items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Gravel Cost Calculator" className="h-10 w-auto md:h-11" />
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link, i) => (
              <Link
                key={link.label}
                href={link.href}
                className={
                  i === 0
                    ? "rounded-md bg-primary px-3.5 py-2 text-[14px] font-semibold text-on-primary transition-colors hover:bg-primary-dark"
                    : "rounded-md px-3.5 py-2 text-[14px] font-medium text-text-secondary transition-colors hover:text-primary"
                }
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <Link
            href="/calculators"
            className="hidden shrink-0 items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-[14px] font-semibold text-on-primary shadow-[var(--shadow-primary)] transition-colors hover:bg-primary-dark lg:flex"
          >
            <GridIcon className="h-4 w-4" />
            All Calculators
          </Link>

          <MobileNav />
        </div>
      </PageContainer>
    </header>
  );
}
