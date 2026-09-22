import Link from "next/link";
import { PageContainer } from "./PageContainer";

const CALCULATORS = [
  "Gravel Calculator",
  "Driveway Calculator",
  "Concrete Calculator",
  "Mulch Calculator",
  "Topsoil Calculator",
  "Paver Calculator",
  "Sod Calculator",
  "Fence Calculator",
  "Paint Calculator",
  "Deck Calculator",
];

const GUIDES = [
  { label: "Gravel Driveway Guide", href: "/guides/gravel-driveway" },
  { label: "Concrete Slab Guide", href: "/guides/concrete-slab-thickness" },
  { label: "Mulch Guide", href: "/guides/mulch-depth" },
  { label: "All Guides", href: "/guides" },
];

const COMPANY = [
  { label: "About", href: "/about" },
  { label: "Methodology", href: "/methodology" },
  { label: "Contact", href: "/contact" },
];

const LEGAL = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Use", href: "/terms" },
  { label: "Disclaimer", href: "/disclaimer" },
];

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-surface">
      <PageContainer>
        <div className="grid grid-cols-2 gap-8 py-12 md:grid-cols-5">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="Gravel Cost Calculator" className="h-9 w-auto" />
            </Link>
            <p className="mt-3 text-[14px] text-text-secondary">Simple tools for bigger projects.</p>
          </div>
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-wide text-text-muted mb-3">
              Calculators
            </p>
            <ul className="space-y-2">
              {CALCULATORS.map((name) => (
                <li key={name}>
                  <Link
                    href={`/calculators/${name.toLowerCase().replace(/\s+/g, "-")}`}
                    className="text-[14px] text-text-secondary transition-colors hover:text-primary"
                  >
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-wide text-text-muted mb-3">
              Guides
            </p>
            <ul className="space-y-2">
              {GUIDES.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-[14px] text-text-secondary transition-colors hover:text-primary">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-wide text-text-muted mb-3">
              Company
            </p>
            <ul className="space-y-2">
              {COMPANY.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-[14px] text-text-secondary transition-colors hover:text-primary">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-wide text-text-muted mb-3">
              Legal
            </p>
            <ul className="space-y-2">
              {LEGAL.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-[14px] text-text-secondary transition-colors hover:text-primary">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex flex-col gap-3 border-t border-border py-6 text-[13px] text-text-muted md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} GravelCostCalculator.com. All rights reserved.</p>
          <p>Estimates are based on standard material assumptions — use as a planning guide, not a final order quantity.</p>
        </div>
      </PageContainer>
    </footer>
  );
}
