import Link from "next/link";
import { PageContainer } from "./PageContainer";

const NAV_LINKS = [
  { href: "/calculators/gravel-calculator", label: "Gravel Calculator" },
  { href: "/calculators", label: "All Calculators" },
  { href: "/guides", label: "Guides" },
  { href: "/about", label: "About" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-surface/90 backdrop-blur-sm">
      <PageContainer>
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-[17px] font-bold text-text-primary">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ background: "var(--gradient-hero)" }}
              aria-hidden="true"
            />
            Gravel Cost Calculator
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-[15px] font-medium text-text-secondary transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </PageContainer>
    </header>
  );
}
